'use strict';
const crypto=require('node:crypto');
const path=require('node:path');
const os=require('node:os');
const S=require('../../security.cjs');
const M=require('../../../src/model.js');
const D=require('../../commands.cjs');
const {createAssetStore}=require('./assets.cjs');

const CONSENT='أقر أنني راجعت جميع البنود والمقاسات والمواصفات والأسعار وأوافق على تحويل العرض المحدد إلى أمر عمل. التوقيع الإلكتروني يمثل موافقتي على هذا الإصدار.';
const STAGES={draft:'تم تسجيل الطلب',approval:'مراجعة واعتماد التصميم',queued:'بانتظار الإنتاج',production:'قيد الإنتاج',quality:'فحص الجودة',ready:'جاهز للتسليم',delivered:'تم التسليم',cancelled:'ملغي'};
const MAX_AMOUNT=1_000_000_000_000;
const now=()=>new Date().toISOString();
const json=value=>JSON.stringify(value);
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
const text=(v,name,max=200,optional=false)=>S.str(v??(optional?'':v),name,max,optional);
function checkKeys(value,allowed){S.requireObject(value);S.pick(value,allowed);}
function id(){return S.id('doc');}
function time(value,name){if(typeof value!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(value)||!Number.isFinite(Date.parse(value)))S.error(400,'INVALID_DATE',name+' غير صالح');return new Date(value).toISOString();}
function daysFromNow(n){return new Date(Date.now()+n*86400000).toISOString();}
function money(v,name){return S.num(v,name,0,MAX_AMOUNT,true);}
function boundedText(v,label,max=180){return text(v,label,max,true);}
function validLine(line,i){
 checkKeys(line,['name','quantity','unit','unitAmountMinor','widthMm','heightMm','editableQuantity','maxQuantity','minQuantity','specs','previewDataUrl']);
 const quantity=S.num(line.quantity,'الكمية',1,10000,true);
 const minQuantity=S.num(line.minQuantity??quantity,'أقل كمية',1,10000,true);
 const maxQuantity=S.num(line.maxQuantity??quantity,'أقصى كمية',minQuantity,10000,true);
 if(quantity<minQuantity||quantity>maxQuantity)S.error(400,'INVALID_QUANTITY','الكمية خارج النطاق');
 const specs=line.specs??{};checkKeys(specs,['material','thickness','lighting','machine','installation','warranty','notes','location','requiresNight','requiresInstallation','materialId','warrantyMonths']);
 const clean={};
 for(const k of ['material','thickness','lighting','machine','installation','warranty','notes','location'])clean[k]=boundedText(specs[k],k,250);
 for(const k of ['requiresNight','requiresInstallation'])clean[k]=specs[k]===true;
 clean.warrantyMonths=S.num(specs.warrantyMonths??0,'مدة الضمان',0,120,true);
 clean.materialId=specs.materialId?S.safeId(specs.materialId,'الخامة'):'';
 const item={
  id:S.id('line'),name:text(line.name,'البند',180),quantity,
  unit:text(line.unit||'قطعة','وحدة البند',35),
  unitAmountMinor:money(line.unitAmountMinor,'سعر الوحدة'),
  widthMm:S.num(line.widthMm??0,'العرض',0,1000000),
  heightMm:S.num(line.heightMm??0,'الطول',0,1000000),
  editableQuantity:line.editableQuantity===true,minQuantity,maxQuantity,
  specs:clean,previewAssetId:null
 };
 if(!item.editableQuantity){item.minQuantity=quantity;item.maxQuantity=quantity;}
 if(line.previewDataUrl)item.previewDataUrl=line.previewDataUrl;
 const total=BigInt(item.quantity)*BigInt(item.unitAmountMinor);
 if(total>BigInt(MAX_AMOUNT))S.error(400,'QUOTE_TOO_LARGE','مجموع البند كبير جدا');
 return item;
}
function tiers(input){
 if(input===undefined||input===null)return [{key:'standard',label:'الخيار الأساسي',multiplierBp:10000}];
 if(!Array.isArray(input)||!input.length||input.length>3)S.error(400,'INVALID_TIERS','يمكن إضافة حتى ثلاث باقات');
 const seen=new Set(),all=input.map(t=>{
  checkKeys(t,['key','label','multiplierBp']);
  const key=text(t.key,'رمز الباقة',30);
  if(!/^[a-z][a-z0-9_]{1,29}$/.test(key)||seen.has(key))S.error(400,'INVALID_TIERS','اسم الباقة غير صالح أو مكرر');
  seen.add(key);return {key,label:text(t.label,'اسم الباقة',70),multiplierBp:S.num(t.multiplierBp,'معامل الباقة',1000,30000,true)};
 });
 if(!seen.has('standard')||all.find(x=>x.key==='standard').multiplierBp!==10000)S.error(400,'INVALID_TIERS','يجب تضمين الباقة الأساسية بمعامل 10000');
 return all;
}
function totalFor(snapshot,tierKey='standard',quantities={}){
 const tier=snapshot.tiers.find(t=>t.key===tierKey);
 if(!tier)S.error(400,'INVALID_TIER','الباقة غير متاحة');
 if(quantities===null||typeof quantities!=='object'||Array.isArray(quantities))S.error(400,'INVALID_QUANTITY','الكمية غير صالحة');
 const allowedKeys=new Set(snapshot.lines.map(x=>x.id));
 for(const key of Object.keys(quantities))if(!allowedKeys.has(key))S.error(400,'UNKNOWN_LINE','البند غير موجود');
 let subtotal=0n;
 const lines=snapshot.lines.map(line=>{
  const q=quantities[line.id]??line.quantity;
  if(!Number.isSafeInteger(q)||q<line.minQuantity||q>line.maxQuantity)S.error(400,'INVALID_QUANTITY','الكمية المسموحة للبند غير مطابقة');
  if(!line.editableQuantity&&q!==line.quantity)S.error(400,'QUANTITY_LOCKED','لا يمكن تغيير كمية هذا البند');
  const amount=BigInt(q)*BigInt(line.unitAmountMinor);
  const lineAmount=(amount*BigInt(tier.multiplierBp)+5000n)/10000n;
  subtotal+=lineAmount;
  if(subtotal>BigInt(MAX_AMOUNT))S.error(400,'QUOTE_TOO_LARGE','مجموع العرض كبير جدا');
  return {id:line.id,name:line.name,quantity:q,unit:line.unit,unitAmountMinor:line.unitAmountMinor,totalAmountMinor:Number(lineAmount)};
 });
 return {tierKey,tierLabel:tier.label,lines,totalAmountMinor:Number(subtotal),currency:snapshot.currency};
}
function createdLineSnapshot(input){const {previewDataUrl,...line}=input;return line;}
function expiryDate(value){const parsed=time(value,'انتهاء العرض');if(Date.parse(parsed)<=Date.now()||Date.parse(parsed)>Date.now()+120*86400000)S.error(400,'INVALID_EXPIRY','يجب أن تنتهي صلاحية العرض خلال 120 يوما');return parsed;}
function createDocuments({store,origin,mediaRoot,env=process.env}){
 const db=store.db,assets=createAssetStore({db,root:mediaRoot||path.join(os.tmpdir(),'awamer-phase1-media')});
 function tenant(id){const t=store.getTenant(id);if(!t)S.error(404,'NOT_FOUND','المنشأة غير موجودة');if(t.status!=='active')S.error(403,'TENANT_SUSPENDED','المنشأة غير نشطة');if(t.expires_at&&Date.parse(t.expires_at.length===10?t.expires_at+'T23:59:59.999Z':t.expires_at)<Date.now())S.error(403,'TENANT_EXPIRED','انتهى الاشتراك');return t;}
 function state(t){return JSON.parse(t.state_json);}
 function requireActor(auth,permission,branchId){
  if(!auth||auth.a?.kind!=='tenant')S.error(403,'FORBIDDEN','حساب منشأة مطلوب');
  if(!M.can(auth.state,auth.a.user_id,permission,branchId))S.error(403,'FORBIDDEN','لا تملك صلاحية هذه العملية');
 }
 function ownedDoc(auth,documentId,permission='manage_orders'){
  S.safeId(documentId,'المستند');
  if(auth?.a?.kind!=='tenant')S.error(403,'FORBIDDEN','حساب منشأة مطلوب');
  const row=db.prepare('SELECT * FROM aw_documents WHERE tenant_id=? AND id=?').get(auth.a.tenant_id,documentId);
  if(!row)S.error(404,'NOT_FOUND','المستند غير موجود');
  requireActor(auth,permission,row.branch_id);
  return row;
 }
 function version(docId){const v=db.prepare('SELECT * FROM aw_document_versions WHERE document_id=? ORDER BY version_no DESC LIMIT 1').get(docId);if(!v)S.error(500,'DOCUMENT_CORRUPT','إصدار المستند غير موجود');if(digest(v.snapshot_json)!==v.sha256)S.error(500,'DOCUMENT_INTEGRITY','فشل التحقق من المستند');return {...v,snapshot:JSON.parse(v.snapshot_json)};}
 function record(doc,ver,event,actorKind,actorId,details={},requestId=null){
  db.prepare('INSERT INTO aw_document_events(id,tenant_id,document_id,version_id,actor_kind,actor_id,event,event_json,occurred_at,request_id) VALUES(?,?,?,?,?,?,?,?,?,?)')
    .run(S.id('evt'),doc.tenant_id,doc.id,ver?.id||null,actorKind,actorId,event,json(details),now(),requestId);
 }
 function newDocument({tenantId,branchId,clientId,orderId=null,type,status='draft',createdBy,currency,snapshot}){
  const docId=id(),versionId=S.id('version'),date=now(),raw=json(snapshot);
  db.prepare('INSERT INTO aw_documents(id,tenant_id,branch_id,client_id,order_id,type,status,current_version_id,created_by,created_at,updated_at,currency) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(docId,tenantId,branchId,clientId,orderId,type,status,versionId,createdBy,date,date,currency);
  db.prepare('INSERT INTO aw_document_versions(id,tenant_id,document_id,version_no,snapshot_json,sha256,created_at,published_at) VALUES(?,?,?,?,?,?,?,?)')
    .run(versionId,tenantId,docId,1,raw,digest(raw),date,status==='published'?date:null);
  return {id:docId,versionId,sha256:digest(raw),tenantId,branchId,type,status,snapshot};
 }
 function share(doc,versionId,purpose,expiresAt){
  const token=S.random(32);
  db.prepare('INSERT INTO aw_document_links(id,tenant_id,document_id,version_id,token_hash,purpose,expires_at) VALUES(?,?,?,?,?,?,?)')
    .run(S.id('link'),doc.tenantId,doc.id,versionId,digest(token),purpose,expiresAt);
  return {token,url:origin+'/d/'+token};
 }
 function createQuote(auth,data){
  checkKeys(data,['requestId','branchId','clientId','title','description','category','priority','dueAt','expiresAt','lines','tiers','businessPhone']);
  const requestId=S.safeId(data.requestId,'معرف الطلب'),branchId=S.safeId(data.branchId,'الفرع'),clientId=S.safeId(data.clientId,'العميل');
  requireActor(auth,'manage_orders',branchId);requireActor(auth,'view_financials',branchId);
  const t=tenant(auth.a.tenant_id),s=state(t);
  if(!s.branches.some(b=>b.id===branchId&&b.active)||!s.clients.some(c=>c.id===clientId&&c.branchId===branchId))S.error(400,'SCOPE_ERROR','العميل أو الفرع غير موجود');
  const existing=db.prepare("SELECT d.* FROM aw_documents d JOIN aw_document_events e ON e.document_id=d.id WHERE d.tenant_id=? AND e.event='created' AND e.request_id=?").get(t.id,requestId);
  if(existing)S.error(409,'REQUEST_REPLAY','العرض موجود مسبقا: '+existing.id);
  if(!Array.isArray(data.lines)||!data.lines.length||data.lines.length>80)S.error(400,'INVALID_LINES','أضف من بند إلى 80 بندا');
  const lines=data.lines.map(validLine),options=tiers(data.tiers),currency=s.brand.currency;
  for(const line of lines)if(line.specs.materialId&&!s.materials.some(m=>m.id===line.specs.materialId&&m.branchId===branchId))S.error(400,'MATERIAL_SCOPE','الخامة غير موجودة في الفرع');
  const snapshot={type:'quote',title:text(data.title,'عنوان العرض',200),description:boundedText(data.description,'وصف العرض',3000),
   category:text(data.category||'projects','القسم',60),priority:['normal','high','urgent'].includes(data.priority)?data.priority:'normal',
   dueAt:time(data.dueAt,'موعد التسليم'),expiresAt:expiryDate(data.expiresAt),
   branchId,clientId,clientName:s.clients.find(c=>c.id===clientId).name,branchName:s.branches.find(b=>b.id===branchId).name,
   brandName:s.brand.name,brandLogo:s.brand.logo||'',brandPhone:boundedText(data.businessPhone,'واتساب المنشأة',30),currency,lines:[],tiers:options,createdAt:now()};
  const created=[];
  try{
   const doc=store.transaction(()=>{
    for(const line of lines){
     if(line.previewDataUrl){const item=assets.create({tenantId:t.id,branchId,purpose:'quote_preview',createdBy:auth.a.user_id,dataUrl:line.previewDataUrl});created.push(item);line.previewAssetId=item.id;}
     snapshot.lines.push(createdLineSnapshot(line));
    }
    const result=newDocument({tenantId:t.id,branchId,clientId,type:'quote',createdBy:auth.a.user_id,currency,snapshot});
    const base=totalFor(snapshot);
    snapshot.initialTotalMinor=base.totalAmountMinor;
    // Preserve content hash for the finalized snapshot (including its canonical total).
    const raw=json(snapshot);
    db.prepare('UPDATE aw_document_versions SET snapshot_json=?,sha256=? WHERE id=?').run(raw,digest(raw),result.versionId);
    result.snapshot=snapshot;
    for(let i=0;i<snapshot.lines.length;i++){
     const line=snapshot.lines[i];
     db.prepare('INSERT INTO aw_document_lines(id,tenant_id,version_id,sort_order,item_name,quantity,unit,width_mm,height_mm,spec_json,preview_asset_id,unit_amount_minor,total_amount_minor,currency) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
      .run(line.id,t.id,result.versionId,i,line.name,line.quantity,line.unit,line.widthMm,line.heightMm,json(line.specs),line.previewAssetId,line.unitAmountMinor,base.lines[i].totalAmountMinor,currency);
    }
    for(const tier of options)db.prepare('INSERT INTO aw_quote_tiers(id,tenant_id,version_id,tier_key,label,multiplier_bp) VALUES(?,?,?,?,?,?)').run(S.id('tier'),t.id,result.versionId,tier.key,tier.label,tier.multiplierBp);
    record({tenant_id:t.id,id:result.id},{id:result.versionId},'created','staff',auth.a.user_id,{initialTotalMinor:base.totalAmountMinor},requestId);
    store.audit(auth.a.id,'create_quote',t.id,'إنشاء مسودة عرض '+result.id);
    return result;
   });
   return {documentId:doc.id,versionId:doc.versionId,status:'draft',totalAmountMinor:snapshot.initialTotalMinor,currency};
  }catch(e){created.forEach(assets.remove);throw e;}
 }
 function publish(auth,documentId){
  const d=ownedDoc(auth,documentId);requireActor(auth,'view_financials',d.branch_id);
  if(d.type!=='quote'||d.status!=='draft')S.error(409,'DOCUMENT_LOCKED','العرض ليس مسودة قابلة للإصدار');
  const v=version(d.id),expiry=v.snapshot.expiresAt;
  if(Date.parse(expiry)<=Date.now())S.error(409,'QUOTE_EXPIRED','انتهت صلاحية العرض');
  return store.transaction(()=>{
   const current=db.prepare('SELECT status FROM aw_documents WHERE id=?').get(d.id);
   if(current.status!=='draft')S.error(409,'DOCUMENT_LOCKED','العرض صدر مسبقا');
   const link=share({tenantId:d.tenant_id,id:d.id},v.id,'quote',expiry);
   db.prepare("UPDATE aw_documents SET status='published',updated_at=? WHERE id=?").run(now(),d.id);
   db.prepare('UPDATE aw_document_versions SET published_at=? WHERE id=?').run(now(),v.id);
   record(d,v,'published','staff',auth.a.user_id,{expiresAt:expiry});
   return {documentId:d.id,sha256:v.sha256,status:'published',url:link.url};
  });
 }
 function list(auth){
  if(auth?.a?.kind!=='tenant')S.error(403,'FORBIDDEN','حساب منشأة مطلوب');
  const rows=db.prepare('SELECT id,branch_id,client_id,order_id,type,status,created_at,updated_at,accepted_order_id FROM aw_documents WHERE tenant_id=? ORDER BY created_at DESC LIMIT 100').all(auth.a.tenant_id);
  return rows.filter(row=>M.can(auth.state,auth.a.user_id,'manage_orders',row.branch_id));
 }
 function cap(token,purpose){
  if(typeof token!=='string'||!/^[A-Za-z0-9_-]{42,44}$/.test(token))S.error(404,'NOT_FOUND','الرابط غير صالح');
  const link=db.prepare('SELECT * FROM aw_document_links WHERE token_hash=?').get(digest(token));
  if(!link||link.revoked_at||link.purpose!==purpose||Date.parse(link.expires_at)<=Date.now())S.error(404,'LINK_EXPIRED','الرابط غير متاح أو انتهى');
  const t=tenant(link.tenant_id),doc=db.prepare('SELECT * FROM aw_documents WHERE tenant_id=? AND id=?').get(t.id,link.document_id);
  if(!doc||!['published','accepted','completed'].includes(doc.status))S.error(404,'NOT_FOUND','المستند غير متاح');
  const v=version(doc.id);
  if(v.id!==link.version_id)S.error(404,'VERSION_EXPIRED','أصدر رابطا جديدا للإصدار الحالي');
  return {t,doc,v,link,s:state(t)};
 }
 function publicDocument(token){
  for(const purpose of ['quote','workshop','delivery','warranty']){
   try{
    const {doc,v,s}=cap(token,purpose);
    const snap=structuredClone(v.snapshot);
    if(purpose==='quote'){
     const accepted=doc.status==='accepted'?db.prepare('SELECT quote_line_id,quantity FROM aw_job_lines WHERE tenant_id=? AND quote_document_id=?').all(doc.tenant_id,doc.id):[];
     const quantities=Object.fromEntries(accepted.map(x=>[x.quote_line_id,x.quantity]));
     const pricing=totalFor(snap,doc.selected_tier||'standard',quantities);
     snap.initialTotalMinor=pricing.totalAmountMinor;
     snap.status=doc.status;
     snap.lines=snap.lines.map(x=>({...x,previewUrl:x.previewAssetId?origin+'/api/public/documents/'+token+'/assets/'+x.previewAssetId:null}));
     return {kind:purpose,documentId:doc.id,hash:v.sha256,version:v.version_no,snapshot:snap,pricing,consentText:CONSENT,token};
    }
    if(purpose==='workshop'){
     const o=s.orders.find(x=>x.id===doc.order_id);
     snap.lines=(snap.lines||[]).map(x=>({...x,previewUrl:x.previewAssetId?origin+'/api/public/documents/'+token+'/assets/'+x.previewAssetId:null}));
     return {kind:purpose,documentId:doc.id,hash:v.sha256,version:v.version_no,snapshot:{...snap,status:o?.status||snap.status}};
    }
    return {kind:purpose,documentId:doc.id,hash:v.sha256,version:v.version_no,snapshot:snap};
   }catch(e){if(!['NOT_FOUND','LINK_EXPIRED','VERSION_EXPIRED'].includes(e.code))throw e;}
  }
  S.error(404,'NOT_FOUND','المستند غير متاح');
 }
 function publicAsset(token,assetId){
  S.safeId(assetId,'المرفق');
  let ctx;
  for(const purpose of ['quote','workshop']){try{ctx=cap(token,purpose);break;}catch(e){if(!['LINK_EXPIRED','NOT_FOUND','VERSION_EXPIRED'].includes(e.code))throw e;}}
  if(!ctx)S.error(404,'NOT_FOUND','الملف غير متاح');
  const {t,v}=ctx;
  if(!v.snapshot.lines.some(line=>line.previewAssetId===assetId))S.error(404,'ASSET_NOT_FOUND','المرفق غير موجود في العرض');
  return assets.read(t.id,assetId);
 }
 function quotePreview(token,payload){
  const {doc,v}=cap(token,'quote');
  if(doc.status!=='published')S.error(409,'QUOTE_LOCKED','العرض غير قابل للتعديل');
  checkKeys(payload,['tierKey','quantities']);
  return totalFor(v.snapshot,payload.tierKey??'standard',payload.quantities||{});
 }
 function ipEncrypted(ip){
  const raw=env.AW_DOC_IP_ENCRYPTION_KEY;
  if(typeof raw!=='string'||!/^[a-f0-9]{64}$/i.test(raw))S.error(503,'SIGNATURE_CONFIG','مفتاح حماية بيانات التوقيع غير مضبوط');
  const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',Buffer.from(raw,'hex'),iv);
  const bytes=Buffer.concat([cipher.update(String(ip||'unknown').slice(0,128)),cipher.final()]);
  return Buffer.concat([iv,cipher.getAuthTag(),bytes]).toString('base64url');
 }
 function addTracking(tid,order,displayText=STAGES[order.status]){
  db.prepare('INSERT INTO aw_tracking_events(id,tenant_id,order_id,public_stage,occurred_at,eta_at,display_text) VALUES(?,?,?,?,?,?,?)')
   .run(S.id('trackevt'),tid,order.id,order.status,now(),order.dueAt,displayText);
 }
 function createLinkedDocument(t,order,creatorId,type,snapshot,expiry=365){
  const doc=newDocument({tenantId:t.id,branchId:order.branchId,clientId:order.clientId,orderId:order.id,type,status:'published',createdBy:creatorId,currency:state(t).brand.currency,snapshot});
  const link=share(doc,doc.versionId,type,daysFromNow(expiry));
  return {documentId:doc.id,url:link.url};
 }
 function accept(token,payload,context={}){
  checkKeys(payload,['requestId','tierKey','quantities','signerName','signatureDataUrl','consent']);
  const {t,doc,v,s}=cap(token,'quote');
  const requestId=S.safeId(payload.requestId,'معرف الاعتماد');
  const existing=db.prepare("SELECT event_json FROM aw_document_events WHERE document_id=? AND event='accepted' AND request_id=?").get(doc.id,requestId);
  if(existing)return {accepted:true,replayed:true,...JSON.parse(existing.event_json)};
  if(doc.status==='accepted')S.error(409,'ALREADY_ACCEPTED','تم اعتماد العرض سابقا');
  if(doc.status!=='published'||Date.parse(v.snapshot.expiresAt)<=Date.now())S.error(409,'QUOTE_EXPIRED','العرض منتهي أو غير منشور');
  if(payload.consent!==true)S.error(400,'CONSENT_REQUIRED','أكد الموافقة على شروط الاعتماد');
  const name=text(payload.signerName,'اسم المعتمد',120),total=totalFor(v.snapshot,payload.tierKey||'standard',payload.quantities||{});
  const ipCipher=ipEncrypted(context.ip);
  const creator=s.users.find(u=>u.id===doc.created_by&&u.active);
  if(!creator||!M.can(s,creator.id,'manage_orders',doc.branch_id)||!M.can(s,creator.id,'view_financials',doc.branch_id))S.error(409,'CREATOR_INACTIVE','يلزم إعادة اعتماد العرض من إدارة المنشأة');
  const image=payload.signatureDataUrl;
  const created=[];
  try{
   return store.transaction(()=>{
    const current=db.prepare('SELECT status FROM aw_documents WHERE id=?').get(doc.id);
    if(current.status!=='published')S.error(409,'ALREADY_ACCEPTED','تم الاعتماد بالفعل');
    const sig=assets.create({tenantId:t.id,branchId:doc.branch_id,purpose:'quote_signature',dataUrl:image});created.push(sig);
    const line=total.lines[0],spec=v.snapshot.lines[0];
    const orderData={branchId:doc.branch_id,clientId:doc.client_id,title:v.snapshot.title,
      category:v.snapshot.category,description:v.snapshot.description,
      quantity:line.quantity,width:spec.widthMm/10,height:spec.heightMm/10,unit:'cm',
      materialId:spec.specs.materialId||'',salePrice:total.totalAmountMinor/100,estimatedCost:0,
      dueAt:v.snapshot.dueAt,priority:v.snapshot.priority};
    const order=D.dispatch(s,creator.id,{type:'order.create',payload:{data:orderData}},t);
    const date=now();
    for(const item of total.lines){
     const snap=v.snapshot.lines.find(x=>x.id===item.id);
     db.prepare('INSERT INTO aw_job_lines(id,tenant_id,branch_id,order_id,quote_document_id,quote_line_id,line_specs_json,quantity,created_at) VALUES(?,?,?,?,?,?,?,?,?)')
      .run(S.id('jobline'),t.id,doc.branch_id,order.id,doc.id,snap.id,json({...snap,quantity:item.quantity}),item.quantity,date);
    }
    D.validateState(s);store.saveState(t.id,s,t.revision+1);
    const signatureId=S.id('sig');
    db.prepare('INSERT INTO aw_signatures(id,tenant_id,document_id,version_id,signer_name,consent_text_hash,signature_asset_id,document_hash,signed_at_utc,request_ip_encrypted,user_agent,verification_method,verification_state) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)')
      .run(signatureId,t.id,doc.id,v.id,name,digest(CONSENT),sig.id,v.sha256,date,ipCipher,boundedText(context.userAgent,'الجهاز',500),'explicit_canvas','recorded');
    db.prepare("UPDATE aw_documents SET status='accepted',order_id=?,accepted_order_id=?,selected_tier=?,accepted_total_minor=?,updated_at=? WHERE id=?")
      .run(order.id,order.id,total.tierKey,total.totalAmountMinor,date,doc.id);
    // Keep the capability readable after acceptance: it becomes strictly read-only.
    const safeLines=total.lines.map(x=>{
     const original=v.snapshot.lines.find(a=>a.id===x.id);
     return {name:x.name,quantity:x.quantity,unit:x.unit,widthMm:original.widthMm,heightMm:original.heightMm,specs:original.specs,previewAssetId:original.previewAssetId};
    });
    const workshop=createLinkedDocument(t,order,creator.id,'workshop',{
      type:'workshop',brandName:v.snapshot.brandName,orderNumber:order.number,orderTitle:order.title,
      dueAt:order.dueAt,priority:order.priority,status:order.status,lines:safeLines,createdAt:date
    },90);
    const trackRaw=S.random(32);
    db.prepare('INSERT INTO aw_tracking_links(id,tenant_id,order_id,token_hash,expires_at,scope,created_at) VALUES(?,?,?,?,?,?,?)')
      .run(S.id('track'),t.id,order.id,digest(trackRaw),daysFromNow(365),'status',date);
    addTracking(t.id,order);
    const installs=safeLines.filter(x=>x.specs.requiresInstallation||x.specs.requiresNight);
    if(installs.length){
     db.prepare('INSERT INTO aw_delivery_checks(id,tenant_id,order_id,branch_id,checklist_json,requires_night,updated_at) VALUES(?,?,?,?,?,?,?)')
      .run(S.id('delivery'),t.id,order.id,order.branchId,json({ladder:false,silicone:false,screws:false,power:false,wires:false,lift:false}),safeLines.some(x=>x.specs.requiresNight)?1:0,date);
    }
    const details={orderId:order.id,orderNumber:order.number,workshopUrl:workshop.url,trackingUrl:origin+'/track/'+trackRaw,
      totalAmountMinor:total.totalAmountMinor,currency:total.currency,tierKey:total.tierKey};
    record(doc,v,'accepted','customer',null,details,requestId);
    store.audit(null,'customer_quote_accept',t.id,'اعتماد عرض '+doc.id+' وإنشاء أمر '+order.number);
    return {accepted:true,replayed:false,...details};
   });
  }catch(error){created.forEach(assets.remove);throw error;}
 }
 function uploadEvidence(token,payload){
  checkKeys(payload,['imageDataUrl','claimedAmountMinor','currency']);
  const {t,doc}=cap(token,'quote');
  if(!['published','accepted'].includes(doc.status))S.error(409,'QUOTE_LOCKED','لا يمكن إرفاق الإيصال');
  const amount=money(payload.claimedAmountMinor,'مبلغ التحويل'),currency=text(payload.currency,'العملة',3);
  if(currency!==doc.currency)S.error(400,'CURRENCY_MISMATCH','عملة الإيصال مختلفة');
  const saved=[];
  try{return store.transaction(()=>{
   const asset=assets.create({tenantId:t.id,branchId:doc.branch_id,purpose:'payment_evidence',dataUrl:payload.imageDataUrl});saved.push(asset);
   const evidenceId=S.id('evidence');
   db.prepare('INSERT INTO aw_payment_evidence(id,tenant_id,order_id,quote_document_id,asset_id,claimed_amount_minor,currency,status,created_at) VALUES(?,?,?,?,?,?,?,?,?)')
    .run(evidenceId,t.id,doc.order_id,doc.id,asset.id,amount,currency,'unverified',now());
   record(doc,null,'payment_evidence_uploaded','customer',null,{evidenceId,status:'unverified'});
   return {id:evidenceId,status:'unverified',message:'الإيصال قيد المراجعة وليس سند قبض'};
  });}catch(e){saved.forEach(assets.remove);throw e;}
 }
 function tracker(token){
  if(typeof token!=='string'||!/^[A-Za-z0-9_-]{42,44}$/.test(token))S.error(404,'NOT_FOUND','الرابط غير متاح');
  const row=db.prepare('SELECT * FROM aw_tracking_links WHERE token_hash=?').get(digest(token));
  if(!row||row.revoked_at||Date.parse(row.expires_at)<Date.now())S.error(404,'LINK_EXPIRED','رابط التتبع انتهى');
  const t=tenant(row.tenant_id),order=state(t).orders.find(o=>o.id===row.order_id);
  if(!order)S.error(404,'NOT_FOUND','الطلب غير موجود');
  const timeline=db.prepare('SELECT public_stage AS stage,occurred_at AS at,display_text AS label FROM aw_tracking_events WHERE tenant_id=? AND order_id=? ORDER BY occurred_at,id').all(t.id,order.id);
  return {reference:order.number,title:order.title,stage:order.status,stageLabel:STAGES[order.status]||'قيد المتابعة',dueAt:order.dueAt,updatedAt:timeline.at(-1)?.at||order.createdAt,timeline,
    phases:['draft','approval','queued','production','quality','ready','delivered'].map(id=>({id,label:STAGES[id]}))};
 }
 function stageChange(tid,order){const last=db.prepare('SELECT public_stage FROM aw_tracking_events WHERE tenant_id=? AND order_id=? ORDER BY occurred_at DESC,id DESC LIMIT 1').get(tid,order.id);if(last?.public_stage!==order.status)addTracking(tid,order);}
 function deliveryGuard(tid,order){
  const row=db.prepare('SELECT * FROM aw_delivery_checks WHERE tenant_id=? AND order_id=?').get(tid,order.id);
  if(row&&!row.verified_at)S.error(409,'DELIVERY_EVIDENCE_REQUIRED','يلزم الصور وقائمة الأدوات وتوقيع المستلم قبل التسليم');
 }
 function startDelivery(auth,orderId,payload){
  S.safeId(orderId,'الأمر');checkKeys(payload,['requiresNight']);
  const t=tenant(auth.a.tenant_id),s=state(t),order=s.orders.find(x=>x.id===orderId);
  if(!order)S.error(404,'NOT_FOUND','أمر العمل غير موجود');
  requireActor(auth,'manage_production',order.branchId);
  if(['delivered','cancelled'].includes(order.status))S.error(409,'ORDER_LOCKED','الأمر مغلق');
  return store.transaction(()=>{
   db.prepare('INSERT INTO aw_delivery_checks(id,tenant_id,order_id,branch_id,checklist_json,requires_night,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(tenant_id,order_id) DO NOTHING')
     .run(S.id('delivery'),t.id,order.id,order.branchId,json({ladder:false,silicone:false,screws:false,power:false,wires:false,lift:false}),payload.requiresNight===true?1:0,now());
   return {orderId,required:true};
  });
 }
 function readDelivery(auth,orderId){
  const t=tenant(auth.a.tenant_id),s=state(t),order=s.orders.find(x=>x.id===orderId);
  if(!order)S.error(404,'NOT_FOUND','الأمر غير موجود');
  requireActor(auth,'manage_production',order.branchId);
  const delivery=db.prepare('SELECT * FROM aw_delivery_checks WHERE tenant_id=? AND order_id=?').get(t.id,order.id);
  return {orderNumber:order.number,status:order.status,requiresEvidence:!!delivery,delivery:delivery?{...delivery,checklist:JSON.parse(delivery.checklist_json)}:null};
 }
 function saveDeliveryEvidence(auth,orderId,payload){
  checkKeys(payload,['beforeImageDataUrl','afterImageDataUrl','nightImageDataUrl','checklist']);
  const t=tenant(auth.a.tenant_id),s=state(t),order=s.orders.find(x=>x.id===orderId);
  if(!order)S.error(404,'NOT_FOUND','الأمر غير موجود');
  requireActor(auth,'manage_production',order.branchId);
  const row=db.prepare('SELECT * FROM aw_delivery_checks WHERE tenant_id=? AND order_id=?').get(t.id,order.id);
  if(!row||row.verified_at)S.error(409,'DELIVERY_LOCKED','إجراء التسليم غير متاح');
  const checks=payload.checklist;checkKeys(checks,['ladder','silicone','screws','power','wires','lift']);
  for(const k of ['ladder','silicone','screws','power','wires','lift'])if(typeof checks[k]!=='boolean')S.error(400,'CHECKLIST_INVALID','حدد حالة كل أداة');
  const created=[];
  try{return store.transaction(()=>{
   const before=assets.create({tenantId:t.id,branchId:order.branchId,purpose:'delivery_before',createdBy:auth.a.user_id,dataUrl:payload.beforeImageDataUrl});created.push(before);
   const after=assets.create({tenantId:t.id,branchId:order.branchId,purpose:'delivery_after',createdBy:auth.a.user_id,dataUrl:payload.afterImageDataUrl});created.push(after);
   let night=null;
   if(row.requires_night){night=assets.create({tenantId:t.id,branchId:order.branchId,purpose:'delivery_night',createdBy:auth.a.user_id,dataUrl:payload.nightImageDataUrl});created.push(night);}
   db.prepare('UPDATE aw_delivery_checks SET before_asset_id=?,after_asset_id=?,night_asset_id=?,checklist_json=?,updated_at=? WHERE id=?')
    .run(before.id,after.id,night?.id||null,json(checks),now(),row.id);
   return {saved:true,requiresNight:!!row.requires_night};
  });}catch(e){created.forEach(assets.remove);throw e;}
 }
 function completeDelivery(auth,orderId,payload,context={}){
  checkKeys(payload,['recipientName','signatureDataUrl','consent','coverage','supportPhone']);
  if(payload.consent!==true)S.error(400,'CONSENT_REQUIRED','يلزم تأكيد استلام العميل');
  const t=tenant(auth.a.tenant_id),s=state(t),order=s.orders.find(x=>x.id===orderId);
  if(!order)S.error(404,'NOT_FOUND','الأمر غير موجود');
  requireActor(auth,'manage_production',order.branchId);
  if(order.status!=='ready')S.error(409,'STAGE_ERROR','يجب وصول الأمر إلى مرحلة جاهز للتسليم');
  const record=db.prepare('SELECT * FROM aw_delivery_checks WHERE tenant_id=? AND order_id=?').get(t.id,orderId);
  if(!record||record.verified_at)S.error(409,'DELIVERY_LOCKED','إجراء التسليم غير متاح أو مكتمل');
  const checks=JSON.parse(record.checklist_json);
  if(!record.before_asset_id||!record.after_asset_id||(record.requires_night&&!record.night_asset_id))
   S.error(409,'DELIVERY_EVIDENCE_REQUIRED','الصور المطلوبة للتسليم غير مكتملة');
  if(!Object.values(checks).every(v=>typeof v==='boolean'))S.error(409,'CHECKLIST_INVALID','قائمة فحص المعدات غير مكتملة');
  const name=text(payload.recipientName,'اسم المستلم',120),phone=boundedText(payload.supportPhone,'رقم الدعم',30),coverage=boundedText(payload.coverage,'تغطية الضمان',1200);
  const created=[];
  try{return store.transaction(()=>{
   const sign=assets.create({tenantId:t.id,branchId:order.branchId,purpose:'delivery_signature',createdBy:auth.a.user_id,dataUrl:payload.signatureDataUrl});created.push(sign);
   db.prepare('UPDATE aw_delivery_checks SET recipient_signature_id=?,recipient_name=?,verified_by=?,verified_at=?,updated_at=? WHERE id=?')
    .run(sign.id,name,auth.a.user_id,now(),now(),record.id);
   D.dispatch(s,auth.a.user_id,{type:'order.transition',payload:{id:order.id,status:'delivered'}},t);
   D.validateState(s);store.saveState(t.id,s,t.revision+1);
   stageChange(t.id,order);
   const snap={type:'delivery',brandName:s.brand.name,orderTitle:order.title,orderNumber:order.number,
     recipientName:name,deliveredAt:order.deliveredAt,checklist:checks,hasBefore:true,hasAfter:true,hasNight:!!record.night_asset_id,status:'delivered'};
   const delivery=createLinkedDocument(t,order,auth.a.user_id,'delivery',snap);
   const jobLines=db.prepare('SELECT line_specs_json FROM aw_job_lines WHERE tenant_id=? AND order_id=?').all(t.id,order.id);
   const months=Math.max(0,...jobLines.map(l=>{try{return JSON.parse(l.line_specs_json).specs.warrantyMonths||0;}catch{return 0;}}));
   let warranty=null;
   if(months>0){
    const start=order.deliveredAt.slice(0,10),d=new Date(start+'T00:00:00.000Z');
    d.setUTCMonth(d.getUTCMonth()+months);
    const end=d.toISOString().slice(0,10);
    const ws={type:'warranty',brandName:s.brand.name,orderNumber:order.number,orderTitle:order.title,
      startAt:start,endAt:end,coverage:coverage||'بنود الضمان المذكورة في العرض المعتمد',serviceContact:phone};
    warranty=createLinkedDocument(t,order,auth.a.user_id,'warranty',ws);
    db.prepare('INSERT INTO aw_warranties(id,tenant_id,order_id,document_id,start_at,end_at,coverage_json,status,service_contact,source_delivery_id,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)')
      .run(S.id('warranty'),t.id,order.id,warranty.documentId,start,end,json({months,description:ws.coverage}),'active',phone,record.id,now());
   }
   store.audit(auth.a.id,'delivery_completed',t.id,'تسليم موثق '+order.number);
   return {delivered:true,orderId:order.id,deliveryUrl:delivery.url,warrantyUrl:warranty?.url||null};
  });}catch(e){created.forEach(assets.remove);throw e;}
 }

 function staffDocument(auth,documentId){
  const d=ownedDoc(auth,documentId);
  const v=version(d.id),snapshot=structuredClone(v.snapshot);
  if(d.type==='quote')requireActor(auth,'view_financials',d.branch_id);
  return {kind:d.type,documentId:d.id,version:v.version_no,hash:v.sha256,snapshot,
    ...(d.type==='quote'?{pricing:totalFor(snapshot,d.selected_tier||'standard'),consentText:CONSENT}:{}),status:d.status};
 }
 function renewDocumentLink(auth,documentId){
  const d=ownedDoc(auth,documentId);
  if(d.type==='quote')requireActor(auth,'view_financials',d.branch_id);
  if(!['published','accepted','completed'].includes(d.status))S.error(409,'DOCUMENT_LOCKED','المستند غير منشور');
  const v=version(d.id);
  return store.transaction(()=>{
   db.prepare('UPDATE aw_document_links SET revoked_at=? WHERE document_id=? AND revoked_at IS NULL').run(now(),d.id);
   const until=d.type==='quote'?v.snapshot.expiresAt:daysFromNow(365);
   const link=share({tenantId:d.tenant_id,id:d.id},v.id,d.type,until);
   record(d,v,'link_renewed','staff',auth.a.user_id);
   return {url:link.url,expiresAt:until};
  });
 }
 function renewTrackingLink(auth,orderId){
  S.safeId(orderId,'الأمر');
  if(auth?.a?.kind!=='tenant')S.error(403,'FORBIDDEN','حساب منشأة مطلوب');
  const t=tenant(auth.a.tenant_id),s=state(t),o=s.orders.find(x=>x.id===orderId);
  if(!o)S.error(404,'NOT_FOUND','أمر العمل غير موجود');
  requireActor(auth,'manage_orders',o.branchId);
  const token=S.random(32);
  store.transaction(()=>{
   db.prepare('UPDATE aw_tracking_links SET revoked_at=? WHERE tenant_id=? AND order_id=? AND revoked_at IS NULL').run(now(),t.id,o.id);
   db.prepare('INSERT INTO aw_tracking_links(id,tenant_id,order_id,token_hash,expires_at,scope,created_at) VALUES(?,?,?,?,?,?,?)')
    .run(S.id('track'),t.id,o.id,digest(token),daysFromNow(365),'status',now());
   store.audit(auth.a.id,'renew_tracking',t.id,'تجديد رابط متابعة '+o.number);
  });
  return {url:origin+'/track/'+token};
 }

 return {createQuote,publish,list,ownedDoc,version,staffDocument,renewDocumentLink,renewTrackingLink,publicDocument,publicAsset,quotePreview,accept,uploadEvidence,tracker,
   stageChange,deliveryGuard,startDelivery,readDelivery,saveDeliveryEvidence,completeDelivery,assets,CONSENT,STAGES,totalFor};
}
module.exports={createDocuments,totalFor,validLine,tiers,CONSENT,STAGES};

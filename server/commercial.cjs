'use strict';
// Platform-only subscriptions and consent-based WhatsApp notifications.
// All paid entitlements are applied ONLY after an authenticated provider read.
const crypto=require('node:crypto');
const S=require('./security.cjs');
const WhatsApp=require('./whatsapp-cloud.cjs');

function createCommercial({store,origin,env=process.env,fetchImpl=globalThis.fetch,clock=()=>new Date()}){
 const db=store.db;
 db.exec(
  'CREATE TABLE IF NOT EXISTS commercial_invoices ('+
  'id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,'+
  'request_id TEXT NOT NULL UNIQUE, provider_id TEXT UNIQUE, provider_url TEXT,'+
  'amount_minor INTEGER NOT NULL, currency TEXT NOT NULL, term_days INTEGER NOT NULL,'+
  'status TEXT NOT NULL, created_at TEXT NOT NULL, paid_at TEXT);'+
  'CREATE INDEX IF NOT EXISTS commercial_invoices_tenant ON commercial_invoices(tenant_id,created_at);'+
  'CREATE TABLE IF NOT EXISTS whatsapp_contacts ('+
  'tenant_id TEXT PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,'+
  'phone TEXT NOT NULL, consent_at TEXT NOT NULL, revoked_at TEXT, updated_at TEXT NOT NULL);'+
  'CREATE TABLE IF NOT EXISTS whatsapp_outbox ('+
  'id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,'+
  'event_key TEXT NOT NULL UNIQUE, phone TEXT NOT NULL, consent_at TEXT NOT NULL,'+
  'template TEXT NOT NULL, language TEXT NOT NULL, parameters_json TEXT NOT NULL,'+
  'status TEXT NOT NULL, message_id TEXT, created_at TEXT NOT NULL, sent_at TEXT, error_code TEXT);'+
  'CREATE INDEX IF NOT EXISTS whatsapp_outbox_state ON whatsapp_outbox(status,created_at);'
 );
 const date=()=>clock().toISOString();
 function configured(){return {
   payments:!!(env.MOYASAR_SECRET_KEY&&env.MOYASAR_WEBHOOK_SECRET),
   whatsapp:env.WHATSAPP_ENABLE_SENDING==='true'&&!!(env.WHATSAPP_ACCESS_TOKEN&&env.WHATSAPP_PHONE_NUMBER_ID&&env.WHATSAPP_GRAPH_VERSION&&env.WHATSAPP_EXPIRY_TEMPLATE&&env.WHATSAPP_APP_SECRET&&env.WHATSAPP_VERIFY_TOKEN)
 };}
 function ct(a,b){if(typeof a!=='string'||typeof b!=='string')return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y);}
 function viewInvoice(r){return {id:r.id,tenantId:r.tenant_id,amountMinor:r.amount_minor,currency:r.currency,days:r.term_days,status:r.status,url:r.provider_url||null,createdAt:r.created_at,paidAt:r.paid_at};}
 function listInvoices(){return db.prepare('SELECT * FROM commercial_invoices ORDER BY created_at DESC LIMIT 200').all().map(viewInvoice);}
 function listContacts(){return db.prepare('SELECT * FROM whatsapp_contacts ORDER BY updated_at DESC LIMIT 500').all().map(r=>({tenantId:r.tenant_id,phone:r.phone,consentAt:r.consent_at,revokedAt:r.revoked_at}));}
 function listNotifications(){return db.prepare('SELECT id,tenant_id AS tenantId,event_key AS eventKey,phone,status,message_id AS messageId,created_at AS createdAt,sent_at AS sentAt,error_code AS errorCode FROM whatsapp_outbox ORDER BY created_at DESC LIMIT 200').all();}
 function snapshot(){return {configured:configured(),invoices:listInvoices(),contacts:listContacts(),notifications:listNotifications()};}
 function webhookSignature(id){const key=env.MOYASAR_WEBHOOK_SECRET;if(!key||key.length<24)S.error(503,'PAYMENT_NOT_READY','لم يتم إعداد سر تحقق الدفع');return crypto.createHmac('sha256',key).update(id).digest('hex');}
 function providerKey(){const key=env.MOYASAR_SECRET_KEY;if(typeof key!=='string'||!/^sk_(?:test|live)_[A-Za-z0-9_-]+$/.test(key))S.error(503,'PAYMENT_NOT_READY','لم يتم إعداد بوابة الدفع');return key;}
 function providerFetch(path,init={}){const key=providerKey();return fetchImpl('https://api.moyasar.com/v1/'+path,{...init,headers:{Authorization:'Basic '+Buffer.from(key+':').toString('base64'),Accept:'application/json',...(init.headers||{})},redirect:'error',signal:AbortSignal.timeout(10000)});}
 async function providerJson(path,init={}){
  const res=await providerFetch(path,init);
  if(!res.ok)S.error(502,'PAYMENT_PROVIDER_ERROR','تعذر الاتصال الآمن بمزود الدفع');
  return res.json();
 }
 async function createInvoice(data,actorId){
  S.requireObject(data);S.pick(data,['tenantId','requestId','amountMinor','currency','days']);
  const tenantId=S.safeId(data.tenantId,'المنشأة'),requestId=S.safeId(data.requestId,'معرف الطلب');
  const amount=S.num(data.amountMinor,'المبلغ بالهللات',100,100000000,true);
  const days=S.num(data.days,'مدة الاشتراك',1,366,true);
  const currency=data.currency||'SAR';
  if(currency!=='SAR')S.error(400,'CURRENCY_UNSUPPORTED','بوابة الدفع هذه تستقبل الريال السعودي فقط');
  if(!origin.startsWith('https://'))S.error(503,'HTTPS_REQUIRED','يلزم HTTPS لاستقبال إشعار الدفع');
  providerKey();webhookSignature('ready');
  const tenant=store.getTenant(tenantId);if(!tenant)S.error(404,'NOT_FOUND','المنشأة غير موجودة');
  const old=db.prepare('SELECT * FROM commercial_invoices WHERE request_id=?').get(requestId);
  if(old){
   if(old.tenant_id!==tenantId||old.amount_minor!==amount||old.currency!==currency||old.term_days!==days)S.error(409,'REQUEST_ID_REUSED','معرف الطلب مستخدم لفاتورة مختلفة');
   if(old.status==='creating')S.error(409,'INVOICE_PENDING','انتظر تأكيد إصدار الفاتورة');
   return viewInvoice(old);
  }
  const id=S.id('bill');
  store.transaction(()=>{
   db.prepare('INSERT INTO commercial_invoices(id,tenant_id,request_id,amount_minor,currency,term_days,status,created_at) VALUES(?,?,?,?,?,?,?,?)').run(id,tenantId,requestId,amount,currency,days,'creating',date());
  });
  try{
   const payload={
    amount,currency,description:'Awamer subscription - '+tenant.slug+' - '+days+' days',
    callback_url:origin+'/api/webhooks/moyasar/'+id+'/'+webhookSignature(id),
    success_url:origin+'/#/home',
    back_url:origin+'/#/home',
    metadata:{awamer_invoice_id:id,awamer_tenant_id:tenantId}
   };
   const remote=await providerJson('invoices',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const paymentUrl=new URL(remote.url||'');
   if(typeof remote.id!=='string'||!/^[A-Za-z0-9_-]{8,100}$/.test(remote.id)||paymentUrl.protocol!=='https:'||!(paymentUrl.hostname==='moyasar.com'||paymentUrl.hostname.endsWith('.moyasar.com'))||remote.amount!==amount||remote.currency!==currency)S.error(502,'PAYMENT_PROVIDER_ERROR','رد فاتورة الدفع غير مطابق');
   store.transaction(()=>db.prepare("UPDATE commercial_invoices SET provider_id=?,provider_url=?,status='pending' WHERE id=?").run(remote.id,paymentUrl.href,id));
   store.audit(actorId,'create_subscription_invoice',tenantId,'إنشاء رابط تحصيل الاشتراك '+id);
   return viewInvoice(db.prepare('SELECT * FROM commercial_invoices WHERE id=?').get(id));
  }catch(error){
   store.transaction(()=>db.prepare("UPDATE commercial_invoices SET status='needs_review' WHERE id=? AND status='creating'").run(id));
   if(error.status)throw error;
   S.error(502,'PAYMENT_PROVIDER_ERROR','تعذر إنشاء الفاتورة؛ تحقق منها لدى مزود الدفع قبل إعادة المحاولة');
  }
 }
 async function reconcileInvoice(id){
  S.safeId(id,'معرف الفاتورة');
  const row=db.prepare('SELECT * FROM commercial_invoices WHERE id=?').get(id);
  if(!row)S.error(404,'NOT_FOUND','فاتورة الاشتراك غير موجودة');
  if(row.status==='paid')return viewInvoice(row);
  if(!row.provider_id)S.error(409,'INVOICE_PENDING','الفاتورة لم تصدر لدى بوابة الدفع');
  const remote=await providerJson('invoices/'+encodeURIComponent(row.provider_id));
  if(remote.id!==row.provider_id||remote.amount!==row.amount_minor||remote.currency!==row.currency)S.error(409,'PAYMENT_MISMATCH','بيانات الدفع لا تطابق الفاتورة المسجلة');
  if(remote.metadata?.awamer_invoice_id&&remote.metadata.awamer_invoice_id!==row.id)S.error(409,'PAYMENT_MISMATCH','مرجع الدفع مختلف');
  if(remote.status!=='paid')return viewInvoice(row);
  store.transaction(()=>{
   const current=db.prepare('SELECT * FROM commercial_invoices WHERE id=?').get(id);
   if(current.status==='paid')return;
   const tenant=store.getTenant(current.tenant_id);
   if(!tenant)S.error(404,'NOT_FOUND','المنشأة غير موجودة');
   const today=date().slice(0,10);
   const start=tenant.expires_at&&tenant.expires_at>today?tenant.expires_at:today;
   const millis=Date.parse(start+'T00:00:00Z')+current.term_days*86400000;
   const expiry=new Date(millis).toISOString().slice(0,10);
   db.prepare('UPDATE tenants SET expires_at=? WHERE id=?').run(expiry,tenant.id);
   db.prepare("UPDATE commercial_invoices SET status='paid',paid_at=? WHERE id=?").run(date(),id);
   store.audit(null,'subscription_paid',tenant.id,'تجديد اشتراك موثق من Moyasar، فاتورة '+id);
  });
  return viewInvoice(db.prepare('SELECT * FROM commercial_invoices WHERE id=?').get(id));
 }
 async function verifyPaymentWebhook(id,signature){
  if(!ct(signature,webhookSignature(id)))S.error(403,'WEBHOOK_DENIED','طلب غير موثوق');
  return {ok:true,invoice:await reconcileInvoice(id)};
 }
 function saveContact(data){
  S.requireObject(data);S.pick(data,['tenantId','phone','consentAt','revoke']);
  const id=S.safeId(data.tenantId,'المنشأة');
  if(!store.getTenant(id))S.error(404,'NOT_FOUND','المنشأة غير موجودة');
  if(data.revoke===true){
   db.prepare('UPDATE whatsapp_contacts SET revoked_at=?,updated_at=? WHERE tenant_id=?').run(date(),date(),id);
   return {ok:true,revoked:true};
  }
  if(typeof data.phone!=='string'||!/^\+[1-9]\d{7,14}$/.test(data.phone))S.error(400,'PHONE_INVALID','الرقم يجب أن يتبع الصيغة الدولية +966...');
  if(typeof data.consentAt!=='string'||!Number.isFinite(Date.parse(data.consentAt))||Date.parse(data.consentAt)>clock().getTime())S.error(400,'CONSENT_REQUIRED','يلزم توثيق موافقة صاحب الرقم');
  const existing=db.prepare('SELECT * FROM whatsapp_contacts WHERE tenant_id=?').get(id);
  if(existing?.phone!==data.phone||existing?.revoked_at)db.prepare("UPDATE whatsapp_outbox SET status='cancelled' WHERE tenant_id=? AND status='queued'").run(id);
  db.prepare('INSERT INTO whatsapp_contacts(tenant_id,phone,consent_at,revoked_at,updated_at) VALUES(?,?,?,NULL,?) ON CONFLICT(tenant_id) DO UPDATE SET phone=excluded.phone,consent_at=excluded.consent_at,revoked_at=NULL,updated_at=excluded.updated_at').run(id,data.phone,data.consentAt,date());
  return {ok:true,tenantId:id,phone:data.phone};
 }
 function queueReminders(){
  if(!configured().whatsapp)return 0;
  const today=date().slice(0,10);
  const tenants=db.prepare("SELECT t.id,t.name,t.expires_at,c.phone,c.consent_at FROM tenants t JOIN whatsapp_contacts c ON c.tenant_id=t.id WHERE t.status='active' AND t.expires_at IS NOT NULL AND c.revoked_at IS NULL").all();
  let added=0;
  for(const t of tenants){
   const until=Math.round((Date.parse(t.expires_at.slice(0,10)+'T00:00:00Z')-Date.parse(today+'T00:00:00Z'))/86400000);
   if(until<0||until>7)continue;
   const key='expiry:'+t.id+':'+t.expires_at+':week';
   const id=S.id('msg');
   const result=db.prepare("INSERT OR IGNORE INTO whatsapp_outbox(id,tenant_id,event_key,phone,consent_at,template,language,parameters_json,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)").run(id,t.id,key,t.phone,t.consent_at,env.WHATSAPP_EXPIRY_TEMPLATE,env.WHATSAPP_LANGUAGE||'ar',JSON.stringify([t.name,t.expires_at]),'queued',date());
   added+=Number(result.changes||0);
  }
  return added;
 }
 async function dispatchNotifications(limit=10){
  if(!configured().whatsapp)return {disabled:true,sent:0,needsReview:0};
  let sent=0,needsReview=0;
  const pending=db.prepare("SELECT * FROM whatsapp_outbox WHERE status='queued' ORDER BY created_at LIMIT ?").all(Math.max(1,Math.min(50,limit)));
  for(const item of pending){
   const contact=db.prepare('SELECT * FROM whatsapp_contacts WHERE tenant_id=?').get(item.tenant_id);
   if(!contact||contact.revoked_at||contact.phone!==item.phone||contact.consent_at!==item.consent_at){
    db.prepare("UPDATE whatsapp_outbox SET status='cancelled' WHERE id=?").run(item.id);
    continue;
   }
   const claim=db.prepare("UPDATE whatsapp_outbox SET status='sending' WHERE id=? AND status='queued'").run(item.id);
   if(!claim.changes)continue;
   try {
    const result=await WhatsApp.sendTemplate({to:item.phone,consentAt:item.consent_at,template:item.template,language:item.language,parameters:JSON.parse(item.parameters_json)},{env,fetchImpl,send:true});
    db.prepare("UPDATE whatsapp_outbox SET status='sent',message_id=?,sent_at=? WHERE id=?").run(result.messageId,date(),item.id);
    sent++;
   }catch(error){
    // Unknown provider outcome: never retry automatically, so one network timeout cannot double-send.
    db.prepare("UPDATE whatsapp_outbox SET status='needs_review',error_code='PROVIDER_OUTCOME_UNKNOWN' WHERE id=?").run(item.id);
    needsReview++;
   }
  }
  return {sent,needsReview};
 }
 async function tick(){const queued=queueReminders();return {queued,...await dispatchNotifications()};}
 function verifyWhatsApp(query){
  if(!env.WHATSAPP_VERIFY_TOKEN||!ct(query.get('hub.verify_token'),env.WHATSAPP_VERIFY_TOKEN)||query.get('hub.mode')!=='subscribe')S.error(403,'WEBHOOK_DENIED','طلب غير موثوق');
  const challenge=query.get('hub.challenge');
  if(!challenge||!/^[A-Za-z0-9_-]{1,256}$/.test(challenge))S.error(400,'INVALID_CHALLENGE','رمز تحقق غير صالح');
  return challenge;
 }
 async function receiveWhatsApp(req){
  if(!env.WHATSAPP_APP_SECRET)S.error(503,'WHATSAPP_DISABLED','لم يتم إعداد توقيع رسائل واتساب');
  let total=0;const chunks=[];
  for await(const chunk of req){total+=chunk.length;if(total>256*1024)S.error(413,'BODY_TOO_LARGE','حجم الطلب أكبر من الحد');chunks.push(chunk);}
  const raw=Buffer.concat(chunks);
  const signature=req.headers['x-hub-signature-256'];
  const expected='sha256='+crypto.createHmac('sha256',env.WHATSAPP_APP_SECRET).update(raw).digest('hex');
  if(!ct(signature,expected))S.error(403,'WEBHOOK_DENIED','توقيع واتساب غير صالح');
  let payload;try{payload=JSON.parse(raw.toString('utf8'));}catch{S.error(400,'INVALID_JSON','بيانات غير صالحة');}
  const changes=Array.isArray(payload.entry)?payload.entry.flatMap(e=>Array.isArray(e.changes)?e.changes:[]):[];
  for(const change of changes){
   const statuses=change?.value?.statuses;
   if(!Array.isArray(statuses))continue;
   for(const item of statuses){
    if(typeof item.id!=='string'||!['delivered','read','failed'].includes(item.status))continue;
    db.prepare("UPDATE whatsapp_outbox SET status=? WHERE message_id=? AND status IN ('sent','delivered','read')").run(item.status,item.id);
   }
  }
  return {ok:true};
 }
 return {snapshot,createInvoice,reconcileInvoice,verifyPaymentWebhook,saveContact,queueReminders,dispatchNotifications,tick,verifyWhatsApp,receiveWhatsApp};
}
module.exports={createCommercial};

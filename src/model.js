(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.WOModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const statuses = ['draft','approval','queued','production','quality','ready','delivered','cancelled'];
  const permissions = ['view_all_branches','view_financials','manage_orders','approve_design','manage_production','manage_inventory','request_purchase','approve_purchase','receive_purchase','manage_team','manage_branches','view_reports','view_reviews','manage_settings'];
  const defaults = {
    owner: permissions,
    manager: permissions.filter(p=>!['view_all_branches','manage_branches','manage_settings'].includes(p)),
    employee: [],
    purchasing: ['manage_inventory','request_purchase','receive_purchase']
  };
  let sequence = 0;
  const uid = prefix => `${prefix || 'id'}_${Date.now().toString(36)}_${(++sequence).toString(36)}_${Math.random().toString(36).slice(2,8)}`;
  const fail = message => { throw new Error(message); };
  const obj = v => !!v && typeof v === 'object' && !Array.isArray(v);
  const text = (v,label,max=200,optional=false) => { if(typeof v!=='string'||(!optional&&!v.trim())||v.length>max) fail(`${label}: نص غير صالح أو أطول من الحد المسموح`); return v.trim(); };
  const number = (v,label,min=0,max=1e10,integer=false) => { if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v)))fail(`${label}: قيمة رقمية غير صالحة`); return v; };
  const date = (v,label,optional=false) => { if(optional&&(v===null||v===''))return; if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v.slice(0,10)+'T00:00:00Z').toISOString().slice(0,10)!==v.slice(0,10))fail(`${label}: تاريخ غير صالح`); };
  const oneOf = (v,values,label) => { if(!values.includes(v))fail(`${label}: قيمة غير معروفة`); };
  const bool = (v,label) => {if(typeof v!=='boolean')fail(`${label}: قيمة منطقية مطلوبة`);};
  const round = (v,d=2) => Math.round((v+Number.EPSILON)*10**d)/10**d;
  const now = () => new Date().toISOString();
  const get = (list,id,label) => list.find(x=>x.id===id) || fail(`${label} غير موجود`);
  const user = (s,id) => {const u=get(s.users,id,'المستخدم');if(!u.active)fail('حساب المستخدم غير نشط');return u;};
  const branch = (s,id) => {const b=get(s.branches,id,'الفرع');if(!b.active)fail('الفرع غير نشط');return b;};
  const can = (s,id,permission,branchId) => {
    const u=s.users.find(x=>x.id===id);if(!u||!u.active||!permissions.includes(permission))return false;
    const permitted = p => u.permissions && Object.prototype.hasOwnProperty.call(u.permissions,p) ? u.permissions[p]===true : (defaults[u.role]||[]).includes(p);
    if(branchId && branchId!=='all') { const b=s.branches.find(b=>b.id===branchId);if(!b||!b.active||(!u.branchIds.includes(branchId)&&!permitted('view_all_branches')))return false; }
    return permitted(permission);
  };
  const requirePermission = (s,id,p,b) => {user(s,id);branch(s,b);if(!can(s,id,p,b))fail('لا تملك صلاحية هذه العملية في هذا الفرع');};
  const audit = (s,actorId,branchId,action,entityId,detail) => s.audit.push({id:uid('evt'),at:now(),actorId,branchId,action,entityId,detail:detail||''});
  const visibleOrders = (s,id,branchId='all') => {
    const u=s.users.find(x=>x.id===id);if(!u||!u.active)return [];
    return s.orders.filter(o=>(branchId==='all'||o.branchId===branchId)&&(can(s,id,'view_all_branches')||u.branchIds.includes(o.branchId))&&(u.role!=='employee'||o.assignees.some(a=>a.userId===id)));
  };
  const editable = o => {if(['delivered','cancelled'].includes(o.status))fail('الأمر المسلم أو الملغى مغلق للتعديل');};
  const teamValue = (s,branchId,team,historical=false,fallbackDueAt) => {
    if(!Array.isArray(team)||!team.length)fail('اختر فريق تنفيذ واحدا على الأقل');
    const ids=new Set();let sum=0;
    const out=team.map(a=>{if(!obj(a))fail('بيانات الفريق غير صالحة');const u=get(s.users,a.userId,'عضو الفريق');if((!historical&&!u.active)||!['employee','manager','owner'].includes(u.role)||!u.branchIds.includes(branchId))fail('عضو الفريق غير نشط أو ليس في فرع الأمر');if(ids.has(u.id))fail('لا يمكن تكرار عضو الفريق');ids.add(u.id);number(a.share,'نسبة المساهمة',.001,100);number(a.plannedMinutes??0,'الدقائق المخططة',0,100000);const dueAt=a.dueAt===undefined?fallbackDueAt:a.dueAt;date(dueAt,'موعد تسليم مهمة الموظف');sum+=a.share;return {userId:u.id,share:a.share,plannedMinutes:a.plannedMinutes??0,actualMinutes:0,done:false,completedAt:null,acceptedAt:null,dueAt};});
    if(Math.abs(sum-100)>.00001)fail('مجموع حصص الفريق يجب أن يساوي 100%');return out;
  };
  const orderValues = (s,p,historical=false) => {
    if(historical)get(s.branches,p.branchId,'الفرع');else branch(s,p.branchId);const c=get(s.clients,p.clientId,'العميل');if(c.branchId!==p.branchId)fail('العميل ليس في فرع الأمر');
    text(p.title,'عنوان الأمر',200);text(p.category,'الفئة',60);text(p.description,'الوصف',5000,true);oneOf(p.unit,['cm','m','piece'],'الوحدة');
    number(p.quantity,'الكمية',.000001,1e7);number(p.width,'العرض',0,1e6);number(p.height,'الارتفاع',0,1e6);number(p.salePrice,'سعر البيع');number(p.estimatedCost,'التكلفة التقديرية');date(p.dueAt,'موعد التسليم');oneOf(p.priority,['normal','urgent','high'],'الأولوية');
    if(p.materialId){const m=get(s.materials,p.materialId,'الخامة');if(m.branchId!==p.branchId)fail('الخامة ليست في فرع الأمر');}
    bool(p.designApproved,'اعتماد التصميم');bool(p.qualityPassed,'فحص الجودة');text(p.designDataUrl,'ملف التصميم',6000000,true);
    if(p.designDataUrl&&!/^data:image\/(png|jpeg|jpg|webp|gif);base64,[a-z\d+/=\s]+$/i.test(p.designDataUrl))fail('التصميم يجب أن يكون صورة محلية صالحة');
    if(!Array.isArray(p.notes)||!Array.isArray(p.attachments))fail('الملاحظات والمرفقات غير صالحة');
    p.notes.forEach(n=>{if(!obj(n))fail('الملاحظة غير صالحة');text(n.id,'معرف الملاحظة');get(s.users,n.userId,'كاتب الملاحظة');text(n.text,'الملاحظة',5000);date(n.at,'وقت الملاحظة');});
    p.attachments.forEach(a=>{if(!obj(a))fail('المرفق غير صالح');text(a.id,'معرف المرفق');text(a.name,'اسم المرفق',250);text(a.dataUrl,'المرفق',6000000);if(!/^data:image\/(png|jpeg|jpg|webp|gif);base64,[a-z\d+/=\s]+$/i.test(a.dataUrl))fail('المرفق يجب أن يكون صورة محلية صالحة');date(a.at,'وقت المرفق');});
  };
  const createOrder = (s,id,p) => {
    if(!obj(p))fail('بيانات الأمر غير صالحة');requirePermission(s,id,'manage_orders',p.branchId);
    const o={id:uid('order'),number:`WO-${new Date().getFullYear()}-${String(s.orders.length+1).padStart(4,'0')}`,branchId:p.branchId,clientId:p.clientId,title:p.title,category:p.category||'projects',description:p.description||'',quantity:p.quantity??1,width:p.width??0,height:p.height??0,unit:p.unit||'piece',materialId:p.materialId||'',salePrice:p.salePrice??0,estimatedCost:p.estimatedCost??0,actualCost:0,dueAt:p.dueAt||now().slice(0,10),status:'draft',priority:p.priority||'normal',designApproved:false,designDataUrl:p.designDataUrl||'',assignees:[],notes:[],attachments:[],consumptions:[],costItems:[],createdAt:now(),deliveredAt:null,reviewToken:uid('review'),qualityPassed:false};
    orderValues(s,o);s.orders.push(o);audit(s,id,o.branchId,'create_order',o.id,'إنشاء أمر عمل');return o;
  };
  const updateOrder = (s,id,orderId,patch) => {
    const o=get(s.orders,orderId,'الأمر');editable(o);if(!obj(patch)||!Object.keys(patch).length)fail('التعديلات غير صالحة');
    if(Object.keys(patch).some(k=>!['designApproved','qualityPassed'].includes(k)))requirePermission(s,id,'manage_orders',o.branchId);
    const allowed=['clientId','title','category','description','quantity','width','height','unit','materialId','salePrice','estimatedCost','dueAt','priority','designApproved','designDataUrl','qualityPassed','notes','attachments'];
    Object.keys(patch).forEach(k=>{if(!allowed.includes(k))fail(`الحقل ${k} لا يعدل من هذا النموذج`);});
    if('designApproved' in patch)requirePermission(s,id,'approve_design',o.branchId);
    if('qualityPassed' in patch){requirePermission(s,id,'manage_production',o.branchId);if(patch.qualityPassed&&o.status!=='quality')fail('يمكن اعتماد الجودة في مرحلة فحص الجودة فقط');}
    const candidate={...o,...patch};orderValues(s,candidate);
    if(s.remnants.some(r=>r.reservedFor===o.id) && ['materialId','width','height','quantity','unit'].some(k=>k in patch&&patch[k]!==o[k]))fail('حرر الباقي المحجوز قبل تغيير الخامة أو المقاس أو الكمية');
    if(o.consumptions.length&&patch.materialId&&patch.materialId!==o.materialId)fail('لا يمكن تغيير خامة أمر تم صرف خاماته');
    Object.assign(o,patch);audit(s,id,o.branchId,'update_order',o.id,'تعديل بيانات أمر العمل');return o;
  };
  const transitionOrder = (s,id,orderId,nextStatus) => {
    const o=get(s.orders,orderId,'الأمر');requirePermission(s,id,'manage_production',o.branchId);editable(o);
    const transitions={draft:['approval','cancelled'],approval:['draft','queued','cancelled'],queued:['approval','production','cancelled'],production:['quality','cancelled'],quality:['production','ready','cancelled'],ready:['quality','delivered','cancelled']};
    if(!(transitions[o.status]||[]).includes(nextStatus))fail('الانتقال بين هاتين المرحلتين غير مسموح');
    if(['queued','production'].includes(nextStatus)&&!o.designApproved)fail('يلزم اعتماد التصميم أولا');
    if(nextStatus==='production'&&!o.assignees.length)fail('يلزم تعيين فريق التنفيذ');
    if(nextStatus==='quality'&&o.status==='production'&&(!o.assignees.length||o.assignees.some(a=>!a.done)))fail('يلزم إكمال مهام فريق التنفيذ أولا');
    if(['ready','delivered'].includes(nextStatus)&&!o.qualityPassed)fail('يلزم اجتياز فحص الجودة أولا');
    const old=o.status;o.status=nextStatus;if(nextStatus==='production')o.qualityPassed=false;if(nextStatus==='delivered'){o.deliveredAt=now();s.remnants.filter(r=>r.reservedFor===o.id&&r.status==='reserved').forEach(r=>r.status='used');}
    if(nextStatus==='cancelled')s.remnants.filter(r=>r.reservedFor===o.id&&r.status==='reserved').forEach(r=>{r.status='available';r.reservedFor=null;});
    audit(s,id,o.branchId,'transition_order',o.id,`${old} → ${nextStatus}`);return o;
  };
  const assignTeam = (s,id,orderId,team) => {const o=get(s.orders,orderId,'الأمر');requirePermission(s,id,'manage_production',o.branchId);editable(o);if(o.assignees.some(a=>a.acceptedAt||a.done))fail('لا يمكن تغيير فريق بعد استلام المهمة أو تسجيل إنجاز عضو منه');const out=teamValue(s,o.branchId,team,false,o.dueAt);o.assignees=out;audit(s,id,o.branchId,'assign_team',o.id,'توزيع فريق التنفيذ وحصص الإنجاز');return o;};
  const ownProduction = (s,id,o) => {const u=user(s,id);branch(s,o.branchId);return u.branchIds.includes(o.branchId)&&o.status==='production'&&o.assignees.some(a=>a.userId===id);};
  const acceptAssignment = (s,id,orderId) => {const o=get(s.orders,orderId,'الأمر');if(!ownProduction(s,id,o)||user(s,id).role!=='employee')fail('يمكن استلام مهمتك فقط خلال الإنتاج في فرعك');const a=o.assignees.find(a=>a.userId===id);if(a.acceptedAt)return a;if(a.done)fail('المهمة مكتملة مسبقا');a.acceptedAt=now();audit(s,id,o.branchId,'accept_assignment',o.id,`استلام مهمة بحصة ${a.share}%`);return a;};
  const completeAssignment = (s,id,orderId,minutes) => {const o=get(s.orders,orderId,'الأمر');if(!ownProduction(s,id,o))fail('يمكن إكمال مهمتك فقط خلال الإنتاج في فرعك');const a=o.assignees.find(a=>a.userId===id);if(a.done)fail('تم تسجيل إنجاز هذه المهمة مسبقا');if(!a.acceptedAt)fail('يلزم استلام المهمة قبل تسجيل إنجازها');number(minutes,'دقائق العمل',0,100000);a.actualMinutes=minutes;a.done=true;a.completedAt=now();audit(s,id,o.branchId,'complete_assignment',o.id,`إنجاز ${a.share}% خلال ${minutes} دقيقة`);return o;};
  const remnantFits = (o,r) => {const factor=o.unit==='m'?100:1,w=o.width*factor,h=o.height*factor,tolerance=1e-9;return o.quantity===1&&w>0&&h>0&&((w<=r.width+tolerance&&h<=r.height+tolerance)||(w<=r.height+tolerance&&h<=r.width+tolerance));};
  const reserveRemnant = (s,id,remnantId,orderId) => {const r=get(s.remnants,remnantId,'الباقي');const o=get(s.orders,orderId,'الأمر');requirePermission(s,id,'manage_inventory',r.branchId);editable(o);if(r.branchId!==o.branchId||r.materialId!==o.materialId)fail('الباقي والأمر يجب أن يتطابقا في الفرع والخامة');if(r.status!=='available'||r.reservedFor)fail('الباقي غير متاح أو محجوز مسبقا');if(s.remnants.some(x=>x.reservedFor===o.id&&x.status==='reserved'))fail('يوجد باقي محجوز لهذا الأمر بالفعل');if(!remnantFits(o,r))fail('مقاس الباقي لا يكفي قطعة الأمر المطلوبة');r.status='reserved';r.reservedFor=o.id;audit(s,id,r.branchId,'reserve_remnant',r.id,`حجز للأمر ${o.number}`);return r;};
  const releaseRemnant = (s,id,remnantId) => {const r=get(s.remnants,remnantId,'الباقي');requirePermission(s,id,'manage_inventory',r.branchId);if(r.status!=='reserved')fail('هذا الباقي ليس محجوزا');r.status='available';r.reservedFor=null;audit(s,id,r.branchId,'release_remnant',r.id,'تحرير حجز الباقي');return r;};
  const canDocument = (s,id,o) => {const u=user(s,id);branch(s,o.branchId);if(!can(s,id,'manage_orders',o.branchId)&&!(u.branchIds.includes(o.branchId)&&o.assignees.some(a=>a.userId===id)))fail('يمكن إضافة التوثيق لأوامرك المسندة في فرعك فقط');if(o.status==='cancelled')fail('الأمر الملغى مغلق للتوثيق');};
  const addOrderNote = (s,id,orderId,value) => {const o=get(s.orders,orderId,'الأمر');canDocument(s,id,o);const content=text(value,'الملاحظة',5000);const n={id:uid('note'),userId:id,text:content,at:now()};o.notes.push(n);audit(s,id,o.branchId,'add_order_note',o.id,'إضافة ملاحظة متابعة');return n;};
  const addOrderAttachment = (s,id,orderId,p) => {const o=get(s.orders,orderId,'الأمر');canDocument(s,id,o);if(!obj(p))fail('بيانات الصورة غير صالحة');text(p.name,'اسم الصورة',250);text(p.dataUrl,'الصورة',6000000);if(!/^data:image\/(png|jpeg|webp);base64,[a-z\d+/=\s]+$/i.test(p.dataUrl))fail('الصورة يجب أن تكون PNG أو JPEG أو WebP محلية');const a={id:uid('photo'),name:p.name,dataUrl:p.dataUrl,at:now()};o.attachments.push(a);audit(s,id,o.branchId,'add_order_attachment',o.id,'إضافة صورة التنفيذ');return a;};
  function addOrderCost(s,id,orderId,p){
 const o=get(s.orders,orderId,'الأمر');requirePermission(s,id,'manage_orders',o.branchId);requirePermission(s,id,'view_financials',o.branchId);
 if(!obj(p))fail('بيانات التكلفة غير صالحة');
 oneOf(p.type,['labor','machine','finishing','outsourcing','installation','delivery','other'],'نوع التكلفة');
 number(p.amount,'قيمة التكلفة',.01,1e9);const amount=round(p.amount);
 if(amount<.01)fail('المبلغ أقل من أصغر وحدة مسموحة');
 const note=text(p.note,'سبب التكلفة',500);
 if(!Array.isArray(o.costItems))o.costItems=[];
 if(o.costItems.length>=200)fail('تم بلوغ الحد المسموح لتفاصيل تكاليف هذا الأمر');
 const item={id:uid('cost'),type:p.type,amount,note,recordedBy:id,at:now(),reversedAt:null,reversedBy:null,reverseReason:''};
 o.costItems.push(item);o.actualCost=round(o.actualCost+amount);
 audit(s,id,o.branchId,'add_order_cost',o.id,'إضافة تكلفة تشغيل موثقة');
 return item;
}
  function reverseOrderCost(s,id,orderId,costId,reason){
 const o=get(s.orders,orderId,'الأمر');requirePermission(s,id,'manage_orders',o.branchId);requirePermission(s,id,'view_financials',o.branchId);
 const item=(o.costItems||[]).find(c=>c.id===costId);if(!item)fail('بند التكلفة غير موجود');
 if(item.reversedAt)fail('تم عكس هذا البند مسبقا');
 const note=text(reason,'سبب تصحيح التكلفة',500);
 if(o.actualCost+0.001<item.amount)fail('إجمالي التكلفة أقل من المبلغ المطلوب عكسه');
 item.reversedAt=now();item.reversedBy=id;item.reverseReason=note;
 o.actualCost=round(o.actualCost-item.amount);
 audit(s,id,o.branchId,'reverse_order_cost',o.id,'تصحيح تكلفة تشغيل مع حفظ السبب');
 return item;
}
  const consumeMaterial = (s,id,orderId,p) => {const o=get(s.orders,orderId,'الأمر');editable(o);if(!can(s,id,'manage_inventory',o.branchId)&&!ownProduction(s,id,o))fail('لا تملك صلاحية صرف خامات هذا الأمر');if(!['production','quality'].includes(o.status))fail('صرف الخامات متاح أثناء الإنتاج أو فحص الجودة');if(!obj(p))fail('بيانات الصرف غير صالحة');const m=get(s.materials,p.materialId,'الخامة');if(m.branchId!==o.branchId)fail('الخامة ليست في فرع الأمر');number(p.quantity,'كمية الصرف',.000001);number(p.wasteQuantity??0,'كمية الهدر',0,p.quantity);text(p.note??'','ملاحظة الصرف',2000,true);if(p.quantity>m.quantity)fail('الرصيد المتاح لا يكفي للصرف');const cost=round(p.quantity*m.unitCost);const c={id:uid('issue'),materialId:m.id,quantity:p.quantity,wasteQuantity:p.wasteQuantity??0,unitCost:m.unitCost,cost,note:p.note||'',userId:id,at:now()};m.quantity=round(m.quantity-p.quantity,6);o.consumptions.push(c);o.actualCost=round(o.actualCost+cost);audit(s,id,o.branchId,'consume_material',o.id,`صرف ${p.quantity} ${m.unit}، الهدر منها ${c.wasteQuantity}`);return c;};
  const createPurchase = (s,id,p) => {if(!obj(p))fail('بيانات طلب الشراء غير صالحة');requirePermission(s,id,'request_purchase',p.branchId);const m=get(s.materials,p.materialId,'الخامة');if(m.branchId!==p.branchId)fail('الخامة ليست في فرع الطلب');text(p.title,'عنوان الشراء',200);number(p.quantity,'الكمية',.000001);number(p.unitCost,'تكلفة الوحدة');text(p.note??'','الملاحظة',2000,true);const purchase={id:uid('purchase'),number:`PO-${String(s.purchases.length+1).padStart(4,'0')}`,branchId:p.branchId,title:p.title,materialId:p.materialId,quantity:p.quantity,unitCost:p.unitCost,status:'requested',requestedBy:id,approvedBy:null,receivedAt:null,note:p.note||'',createdAt:now()};s.purchases.push(purchase);audit(s,id,p.branchId,'create_purchase',purchase.id,'طلب شراء خامات');return purchase;};
  const purchaseDecision = (s,id,purchaseId,status) => {const p=get(s.purchases,purchaseId,'طلب الشراء');requirePermission(s,id,'approve_purchase',p.branchId);if(p.status!=='requested')fail('يمكن اتخاذ قرار لطلب الشراء المعلق فقط');p.status=status;p.approvedBy=id;audit(s,id,p.branchId,status==='approved'?'approve_purchase':'reject_purchase',p.id,'تحديث قرار طلب الشراء');return p;};
  const approvePurchase = (s,id,purchaseId) => purchaseDecision(s,id,purchaseId,'approved');
  const rejectPurchase = (s,id,purchaseId) => purchaseDecision(s,id,purchaseId,'rejected');
  const receivePurchase = (s,id,purchaseId) => {const p=get(s.purchases,purchaseId,'طلب الشراء');requirePermission(s,id,'receive_purchase',p.branchId);if(p.status!=='approved'||p.receivedAt)fail('يلزم طلب معتمد لم يسبق استلامه');const m=get(s.materials,p.materialId,'الخامة');if(m.branchId!==p.branchId)fail('الفرع لا يتطابق مع الخامة');const q=m.quantity+p.quantity,c=round((m.quantity*m.unitCost+p.quantity*p.unitCost)/q,4);m.quantity=round(q,6);m.unitCost=c;p.status='received';p.receivedAt=now();audit(s,id,p.branchId,'receive_purchase',p.id,`إضافة ${p.quantity} ${m.unit} للمخزون`);return p;};
  const submitReview = (s,p) => {if(!obj(p))fail('بيانات التقييم غير صالحة');text(p.token,'رمز التقييم',200);const o=s.orders.find(o=>o.reviewToken===p.token);if(!o||o.status!=='delivered')fail('رابط التقييم غير صالح أو الأمر لم يسلم بعد');number(p.rating,'التقييم',1,5,true);const name=text(p.name??'','الاسم',100,true),comment=text(p.comment??'','التعليق',2000,true);const existing=s.reviews.find(r=>r.token===p.token);if(existing){if(existing.rating===p.rating&&existing.name===name&&existing.comment===comment)return existing;fail('تم إرسال تقييم لهذا الأمر مسبقا');}const r={id:uid('review'),orderId:o.id,branchId:o.branchId,token:p.token,rating:p.rating,name,comment,createdAt:now()};s.reviews.push(r);audit(s,null,o.branchId,'submit_review',o.id,'استلام تقييم العميل محليا');return r;};
  const employeePerformance = (s,employeeId,monthYYYYMM) => {
    const u=get(s.users,employeeId,'الموظف');if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(monthYYYYMM))fail('اختر شهرا صالحا بصيغة سنة-شهر');
    const assigned=s.orders.filter(o=>o.status!=='cancelled'&&o.assignees.some(a=>a.userId===employeeId)&&(o.dueAt.startsWith(monthYYYYMM)||o.createdAt.startsWith(monthYYYYMM)));
    const completed=s.orders.filter(o=>o.status!=='cancelled').map(o=>({o,a:o.assignees.find(a=>a.userId===employeeId)})).filter(x=>x.a?.done&&x.a.completedAt?.startsWith(monthYYYYMM));
    const contribution=round(completed.reduce((n,x)=>n+x.a.share/100,0),4),minutes=completed.reduce((n,x)=>n+x.a.actualMinutes,0);
    const onTime=completed.filter(x=>{const deadline=x.a.dueAt||x.o.dueAt;return Date.parse(x.a.completedAt)<=Date.parse(deadline.length===10?deadline+'T23:59:59.999Z':deadline);}).length;
    const ratings=completed.map(x=>s.reviews.find(r=>r.orderId===x.o.id)?.rating).filter(x=>x!==undefined);
    const onTimeRate=completed.length?round(onTime/completed.length*100):null,avgRating=ratings.length?round(ratings.reduce((a,b)=>a+b,0)/ratings.length):null,target=u.targetMonthly||0;
    const weights=s.settings.performance;let score=null;
    if(completed.length){const components=[{value:onTimeRate,weight:weights.onTimeWeight},{value:avgRating===null?null:avgRating/5*100,weight:weights.qualityWeight},{value:target>0?Math.min(100,contribution/target*100):null,weight:weights.outputWeight}].filter(c=>c.value!==null&&c.weight>0);const total=components.reduce((n,c)=>n+c.weight,0);if(total)score=round(components.reduce((n,c)=>n+c.value*c.weight,0)/total);}
    return {completed:completed.length,contribution,onTimeRate,avgRating,minutes,score,level:score===null?'لا توجد بيانات كافية':score>=95?'فوق الممتاز':score>=80?'ممتاز':score>=60?'جيد جدا':'طبيعي',target,assigned:assigned.length,explanation:'الإنجاز حسب الحصة؛ الالتزام بوقت إكمال مهمة الموظف مقارنة بموعدها الفردي أو موعد الأمر عند غيابه. عند غياب تقييم العميل يستبعد وزنه ولا يخترع تقييم.'};
  };
  const totals = (s,id,branchId='all',from='',to='') => {
    if(from)date(from,'من تاريخ');if(to)date(to,'إلى تاريخ');if(from&&to&&Date.parse(from)>Date.parse(to))fail('بداية الفترة بعد نهايتها');
    const start=from?Date.parse(from): -Infinity,end=to?Date.parse(to.length===10?to+'T23:59:59.999Z':to):Infinity;
    const visible=visibleOrders(s,id,branchId);const inRange=o=>{const d=Date.parse(o.status==='delivered'?o.deliveredAt:o.createdAt);return d>=start&&d<=end;};const orders=visible.filter(inRange),delivered=orders.filter(o=>o.status==='delivered');const financial=can(s,id,'view_financials',branchId==='all'?undefined:branchId);
    const estimated=delivered.filter(o=>!(o.actualCost>0||o.consumptions.length));const cost=delivered.reduce((n,o)=>n+(o.actualCost>0||o.consumptions.length?o.actualCost:o.estimatedCost),0),sales=delivered.reduce((n,o)=>n+o.salePrice,0);
    return {orders:orders.length,sales:financial?round(sales):null,cost:financial?round(cost):null,margin:financial?round(sales-cost):null,active:orders.filter(o=>!['delivered','cancelled'].includes(o.status)).length,late:orders.filter(o=>!['delivered','cancelled'].includes(o.status)&&Date.parse(o.dueAt.length===10?o.dueAt+'T23:59:59.999Z':o.dueAt)<Date.now()).length,ready:orders.filter(o=>o.status==='ready').length,delivered:delivered.length,costBasis:estimated.length?(estimated.length===delivered.length?'estimated':'mixed_actual_and_estimated'):'actual',estimatedCostOrders:estimated.length,costBasisLabel:estimated.length?`تكلفة مباشرة فعلية مع تكلفة تقديرية لعدد ${estimated.length} من الأوامر`:'تكلفة مباشرة فعلية للأوامر المسلمة'};
  };
  const seed = (input=new Date()) => {
    const current=new Date(input);if(!Number.isFinite(+current))fail('تاريخ بيانات العرض غير صالح');
    const stamp=(offset,hour=10)=>new Date(+current+offset*86400000).toISOString().slice(0,10)+`T${String(hour).padStart(2,'0')}:00:00.000Z`;
    const monthDay=d=>new Date(Date.UTC(current.getUTCFullYear(),current.getUTCMonth(),Math.max(1,Math.min(d,current.getUTCDate())),10)).toISOString();
    const s={schemaVersion:1,brand:{name:'آرت بلس للطباعة',activity:'الدعاية والإعلان',primary:'#5B248C',secondary:'#16B6B5',currency:'SAR',footer:'',logo:''},branches:[{id:'b1',name:'الفرع الرئيسي',city:'الرياض',address:'حي الملز، شارع الستين',active:true},{id:'b2',name:'فرع جدة',city:'جدة',address:'حي الروضة، شارع الأمير سلطان',active:true},{id:'b3',name:'فرع الدمام',city:'الدمام',address:'حي الفيصلية، طريق الملك فهد',active:true}],users:[{id:'owner',name:'عبدالله العتيبي',role:'owner',branchIds:['b1','b2','b3'],jobTitle:'المدير المالك',targetMonthly:30,active:true},{id:'manager1',name:'نورة القحطاني',role:'manager',branchIds:['b1'],jobTitle:'مديرة فرع الرياض',targetMonthly:25,active:true},{id:'emp1',name:'أحمد السالم',role:'employee',branchIds:['b1'],jobTitle:'فني أكريلك وحروف',targetMonthly:18,active:true},{id:'emp2',name:'خالد الحربي',role:'employee',branchIds:['b1'],jobTitle:'فني طباعة وتجهيز',targetMonthly:22,active:true},{id:'emp3',name:'محمد الزهراني',role:'employee',branchIds:['b2'],jobTitle:'فني إنتاج وتركيب',targetMonthly:20,active:true},{id:'buyer',name:'سارة الدوسري',role:'purchasing',branchIds:['b1','b2','b3'],jobTitle:'مسؤولة المشتريات',targetMonthly:0,active:true}],clients:[{id:'c1',name:'سارة الراشد',phone:'0501234567',company:'مقهى غصن',branchId:'b1'},{id:'c2',name:'فهد العمري',phone:'0552345678',company:'مطعم المرسى',branchId:'b2'},{id:'c3',name:'ريم الناصر',phone:'0543456789',company:'عيادات نبض',branchId:'b1'},{id:'c4',name:'علي الغامدي',phone:'0564567890',company:'معرض مدار',branchId:'b3'},{id:'c5',name:'هند الفارس',phone:'0535678901',company:'متجر ورد',branchId:'b1'}],orders:[],materials:[],remnants:[],purchases:[],reviews:[],audit:[],drafts:{},settings:{performance:{onTimeWeight:50,qualityWeight:30,outputWeight:20},pricing:{letterMinHeight:1,logoMultiplier:2,markup:35},publicBaseUrl:'',workdayHours:8}};
    const mats=[['m1','b1','أكريلك شفاف 3 مم','acrylic','لوح',18,5,145,'مصنع المدى',122,244,3,'شفاف'],['m2','b1','فينيل لاصق أبيض','stickers','م²',95,25,18,'رواد الطباعة',152,0,0,'أبيض'],['m3','b1','ورق كوشيه 350 جرام','paper','ورقة',2400,500,1.2,'ورق الخليج',32,45,0,'أبيض'],['m4','b1','ليد وحدات 12 فولت','letters','وحدة',380,100,2.8,'أنوار التقنية',0,0,0,'أبيض بارد'],['m5','b1','حبر إيكو سولفنت','banners','مل',3200,1000,.24,'ألوان الخليج',0,0,0,'ألوان'],['m6','b1','ألمنيوم كلادينج 3 مم','letters','لوح',9,3,210,'أركان المعادن',122,244,3,'فضي'],['m7','b2','بنر 440 جرام','banners','م²',72,20,9,'رواد الطباعة',320,0,0,'أبيض'],['m8','b2','أكريلك أبيض 5 مم','acrylic','لوح',12,4,195,'مصنع المدى',122,244,5,'أبيض'],['m9','b3','ألواح فوم 5 مم','projects','لوح',28,8,38,'مستلزمات الشرق',122,244,5,'أبيض']];
    s.materials=mats.map(a=>Object.fromEntries(['id','branchId','name','category','unit','quantity','minQuantity','unitCost','supplier','width','height','thickness','color'].map((k,i)=>[k,a[i]])));
    const defs=[['o1','b1','c1','حروف أكريلك مضيئة لمقهى غصن','letters','m1','production',2400,850,640,2,['emp1','emp2'],70,30],['o2','b1','c3','لوحات إرشادية لعيادات نبض','acrylic','m1','queued',1260,420,0,3,['emp1'],60,40],['o3','b1','c5','استيكر واجهة متجر ورد','stickers','m2','approval',780,230,0,4,[],120,80],['o4','b2','c2','بنر افتتاح مطعم المرسى','banners','m7','production',950,280,190,1,['emp3'],300,100],['o5','b1','c1','بطاقات ولاء مقهى غصن','paper','m3','ready',650,210,195,0,['emp2'],9,5],['o6','b1','c3','ستاند استقبال العيادة','acrylic','m1','quality',980,330,310,1,['emp1'],40,60],['o7','b1','c5','لوحة أكريلك باب متجر ورد','acrylic','m1','delivered',480,160,145,-5,['emp1'],30,20],['o8','b1','c1','منيو طاولات وقواعد أكريلك','acrylic','m1','delivered',1650,610,580,-3,['emp1','emp2'],15,20],['o9','b2','c2','تغليف واجهة مطعم المرسى','banners','m7','delivered',3200,1250,1120,-2,['emp3'],320,200],['o10','b3','c4','مجسم فوم للركن التعريفي','models','m9','draft',1800,680,0,6,[],80,100],['o11','b1','c3','ملصقات ساعات العمل','stickers','m2','cancelled',220,65,0,-1,[],30,40],['o12','b1','c5','بوكس هدايا إطلاق الهوية','packaging','m3','draft',1400,560,0,7,[],25,25]];
    s.orders=defs.map((a,i)=>{const [id,branchId,clientId,title,category,materialId,status,salePrice,estimatedCost,actualCost,dueOffset,staff,width,height]=a;const done=['quality','ready','delivered'].includes(status),completedAt=done?monthDay(Math.max(1,current.getUTCDate()-(i===6?6:i===7?4:3))):null;return {id,number:`WO-${current.getUTCFullYear()}-${String(120+i).padStart(4,'0')}`,branchId,clientId,title,category,description:['قص وتجميع حسب التصميم المعتمد مع تغليف مناسب للنقل','مطابقة الألوان والمقاسات مع هوية العميل'][i%2],quantity:1,width,height,unit:'cm',materialId,salePrice,estimatedCost,actualCost,dueAt:status==='delivered'?monthDay(Math.max(1,current.getUTCDate()-(i===6?5:i===7?3:1))):stamp(dueOffset,17),status,priority:i===0||i===3?'urgent':i===1?'high':'normal',designApproved:!['draft','approval','cancelled'].includes(status),designDataUrl:'',assignees:staff.map((userId,n)=>({userId,share:staff.length===2?(n?40:60):100,plannedMinutes:i===0?180:90,actualMinutes:done?(n?65:85):0,done,completedAt})),notes:[{id:`note-${id}`,userId:branchId==='b2'?'emp3':'owner',text:i===0?'يرجى تجربة الإضاءة ومراجعة توصيلات الحروف قبل الإغلاق.':'تم تأكيد المقاس والخامة مع العميل.',at:stamp(-8)}],attachments:[],consumptions:[],createdAt:stamp(-10-(i%3)),deliveredAt:status==='delivered'?monthDay(Math.max(1,current.getUTCDate()-(i===6?6:i===7?4:2))):null,reviewToken:`demo-review-${id}-artplus`,qualityPassed:done};});
    s.orders.forEach(o=>o.assignees.forEach(a=>{a.dueAt=o.dueAt;a.acceptedAt=a.done?a.completedAt:null;}));
    s.remnants=[{id:'r1',branchId:'b1',materialId:'m1',name:'أكريلك شفاف مناسب للوحات الصغيرة',width:80,height:60,thickness:3,color:'شفاف',location:'رف A-2',sourceOrderId:'o7',confirmedBy:'emp1',status:'available',reservedFor:null,createdAt:stamp(-5)},{id:'r2',branchId:'b1',materialId:'m1',name:'شريحة أكريلك شفاف',width:40,height:25,thickness:3,color:'شفاف',location:'رف A-3',sourceOrderId:'o8',confirmedBy:'emp1',status:'available',reservedFor:null,createdAt:stamp(-3)},{id:'r3',branchId:'b2',materialId:'m8',name:'أكريلك أبيض متبقي',width:65,height:45,thickness:5,color:'أبيض',location:'رف B-1',sourceOrderId:'',confirmedBy:'emp3',status:'available',reservedFor:null,createdAt:stamp(-4)},{id:'r4',branchId:'b3',materialId:'m9',name:'فوم صالح للنماذج الصغيرة',width:90,height:55,thickness:5,color:'أبيض',location:'رف C-1',sourceOrderId:'',confirmedBy:'owner',status:'available',reservedFor:null,createdAt:stamp(-2)}];
    s.purchases=[{id:'p1',number:'PO-0041',branchId:'b1',title:'أكريلك شفاف للمشاريع الجديدة',materialId:'m1',quantity:10,unitCost:140,status:'requested',requestedBy:'buyer',approvedBy:null,receivedAt:null,note:'يرجى التأكد من استواء الألواح قبل التوريد',createdAt:stamp(-1)},{id:'p2',number:'PO-0040',branchId:'b2',title:'بنر أبيض للطباعة الخارجية',materialId:'m7',quantity:50,unitCost:8.5,status:'approved',requestedBy:'buyer',approvedBy:'owner',receivedAt:null,note:'موعد التوريد غدا',createdAt:stamp(-3)},{id:'p3',number:'PO-0039',branchId:'b1',title:'ورق كوشيه لبطاقات العملاء',materialId:'m3',quantity:1000,unitCost:1.1,status:'received',requestedBy:'buyer',approvedBy:'manager1',receivedAt:stamp(-4),note:'تم الفحص والمطابقة؛ الرصيد التجريبي يشمل هذه الدفعة',createdAt:stamp(-6)}];
    s.reviews=[{id:'rv1',orderId:'o8',branchId:'b1',token:s.orders.find(o=>o.id==='o8').reviewToken,rating:5,name:'سارة',comment:'الخامة ممتازة والتسليم في الموعد، شكرا للفريق.',createdAt:monthDay(Math.max(1,current.getUTCDate()-3))},{id:'rv2',orderId:'o9',branchId:'b2',token:s.orders.find(o=>o.id==='o9').reviewToken,rating:4,name:'فهد',comment:'تنفيذ متقن، نأمل تنسيق موعد التركيب مبكرا.',createdAt:monthDay(Math.max(1,current.getUTCDate()-1))}];
    s.audit=s.orders.flatMap(o=>[{id:`evt-create-${o.id}`,at:o.createdAt,actorId:'owner',branchId:o.branchId,action:'create_order',entityId:o.id,detail:'أمر تجريبي لإظهار سير العمل'},...(o.deliveredAt?[{id:`evt-deliver-${o.id}`,at:o.deliveredAt,actorId:o.branchId==='b2'?'owner':'manager1',branchId:o.branchId,action:'transition_order',entityId:o.id,detail:'ready → delivered'}]:[])]);
    return s;
  };
  const validateState = s => {
    if(!obj(s)||s.schemaVersion!==1)fail('ملف النسخة الاحتياطية غير صالح أو إصدار المخطط غير مدعوم');
    const deadlineDefaults=[],acceptanceDefaults=[];
    const lists=['branches','users','clients','orders','materials','remnants','purchases','reviews','audit'];
    lists.forEach(k=>{if(!Array.isArray(s[k])||s[k].length>100000)fail(`قائمة ${k} غير صالحة`);const ids=new Set();s[k].forEach(v=>{if(!obj(v))fail(`سجل ${k} غير صالح`);text(v.id,`معرف ${k}`,200);if(!/^[a-z\d_-]+$/i.test(v.id))fail(`معرف غير صالح في ${k}`);if(ids.has(v.id))fail(`معرف مكرر في ${k}`);ids.add(v.id);});});
    if(!obj(s.brand)||!obj(s.settings)||!obj(s.settings.performance)||!obj(s.settings.pricing)||!obj(s.drafts))fail('إعدادات الهوية أو النظام أو المسودات غير صالحة');
    ['name','activity','primary','secondary','currency','footer','logo'].forEach(k=>text(s.brand[k],`الهوية ${k}`,k==='logo'?6000000:2000,true));if(!s.brand.name.trim())fail('اسم المنشأة مطلوب');if(s.brand.logo&&!/^data:image\/(png|jpeg|webp);base64,[a-z\d+/=]+$/i.test(s.brand.logo))fail('الشعار يجب أن يكون صورة PNG أو JPEG أو WebP محلية');
    if(s.settings.servicePrices!==undefined){if(!obj(s.settings.servicePrices))fail('قائمة أسعار الخدمات غير صالحة');Object.values(s.settings.servicePrices).forEach(v=>number(v,'سعر الخدمة'));}
    ['primary','secondary'].forEach(k=>{if(!/^#[\da-f]{6}$/i.test(s.brand[k]))fail('لون الهوية غير صالح');});
    ['onTimeWeight','qualityWeight','outputWeight'].forEach(k=>number(s.settings.performance[k],'وزن تقييم الأداء',0,100));if(Object.values(s.settings.performance).filter(v=>typeof v==='number').reduce((a,b)=>a+b,0)<=0)fail('يجب تحديد وزن واحد للأداء على الأقل');
    ['letterMinHeight','logoMultiplier','markup'].forEach(k=>number(s.settings.pricing[k],'إعداد التسعير',0,10000));number(s.settings.workdayHours,'ساعات العمل',.01,24);text(s.settings.publicBaseUrl,'رابط التقييم',2000,true);if(s.settings.publicBaseUrl&&!/^https?:\/\//i.test(s.settings.publicBaseUrl))fail('رابط التقييم يجب أن يبدأ بـ http أو https');
    const ref=(list,id,label,optional=false)=>{if(optional&&(id===null||id===''))return null;return get(s[list],id,label);};
    s.branches.forEach(b=>{['name','city','address'].forEach(k=>text(b[k],`بيانات الفرع ${k}`,500,k!=='name'));bool(b.active,'حالة الفرع');});
    s.users.forEach(u=>{text(u.name,'اسم المستخدم');oneOf(u.role,['owner','manager','employee','purchasing'],'دور المستخدم');if(!Array.isArray(u.branchIds)||!u.branchIds.length||new Set(u.branchIds).size!==u.branchIds.length)fail('فروع المستخدم غير صالحة');u.branchIds.forEach(b=>ref('branches',b,'فرع المستخدم'));text(u.jobTitle,'المسمى الوظيفي',200,true);number(u.targetMonthly,'الهدف الشهري',0,100000);bool(u.active,'حالة المستخدم');if(u.permissions!==undefined){if(!obj(u.permissions))fail('صلاحيات المستخدم غير صالحة');Object.entries(u.permissions).forEach(([k,v])=>{oneOf(k,permissions,'الصلاحية');bool(v,'حالة الصلاحية');});}});
    if(!s.users.some(u=>u.role==='owner'&&u.active&&u.branchIds.some(id=>s.branches.some(b=>b.id===id&&b.active))))fail('يلزم حساب مالك نشط وفرع نشط لاستعادة النسخة');
    s.clients.forEach(c=>{ref('branches',c.branchId,'فرع العميل');text(c.name,'اسم العميل');text(c.phone,'هاتف العميل',50,true);text(c.company,'منشأة العميل',200,true);});
    s.materials.forEach(m=>{ref('branches',m.branchId,'فرع الخامة');['name','category','unit','supplier','color'].forEach(k=>text(m[k],`الخامة ${k}`,300,k==='supplier'||k==='color'));['quantity','minQuantity','unitCost','width','height','thickness'].forEach(k=>number(m[k],`الخامة ${k}`));});
    const orderNumbers=new Set(),tokens=new Set();
    s.orders.forEach(o=>{
      ref('branches',o.branchId,'فرع الأمر');ref('clients',o.clientId,'عميل الأمر');orderValues(s,o,true);oneOf(o.status,statuses,'مرحلة الأمر');text(o.number,'رقم الأمر');if(orderNumbers.has(o.number))fail('رقم أمر مكرر');orderNumbers.add(o.number);number(o.actualCost,'التكلفة الفعلية');date(o.createdAt,'تاريخ إنشاء الأمر');date(o.deliveredAt,'تاريخ تسليم الأمر',true);if(o.status==='delivered'&&!o.deliveredAt)fail('أمر مسلم بدون تاريخ تسليم');if(o.status!=='delivered'&&o.deliveredAt)fail('تاريخ تسليم لأمر غير مسلم');text(o.reviewToken,'رمز التقييم');if(!/^[a-z\d_-]+$/i.test(o.reviewToken))fail('رمز التقييم غير صالح');if(tokens.has(o.reviewToken))fail('رمز تقييم مكرر');tokens.add(o.reviewToken);
      if(!Array.isArray(o.assignees)||!Array.isArray(o.consumptions))fail('فريق الأمر أو الصرف غير صالح');
      if(o.assignees.length){teamValue(s,o.branchId,o.assignees,true,o.dueAt);o.assignees.forEach(a=>{if(a.dueAt===undefined)deadlineDefaults.push({assignment:a,dueAt:o.dueAt});number(a.actualMinutes,'دقائق العمل');bool(a.done,'حالة المهمة');date(a.completedAt,'تاريخ إنجاز المهمة',true);if(a.acceptedAt===undefined)acceptanceDefaults.push({assignment:a,acceptedAt:a.done?a.completedAt:null});else date(a.acceptedAt,'تاريخ استلام المهمة',true);if(a.done!==!!a.completedAt)fail('تاريخ إنجاز المهمة لا يتطابق مع حالتها');});}
      const issueIds=new Set();o.consumptions.forEach(c=>{text(c.id,'معرف الصرف');if(issueIds.has(c.id))fail('صرف مكرر');issueIds.add(c.id);const m=ref('materials',c.materialId,'خامة الصرف');if(m.branchId!==o.branchId)fail('خامة صرف خارج فرع الأمر');ref('users',c.userId,'موظف الصرف');number(c.quantity,'كمية الصرف',.000001);number(c.wasteQuantity,'كمية الهدر',0,c.quantity);number(c.unitCost,'تكلفة وحدة الصرف');number(c.cost,'تكلفة الصرف');if(Math.abs(c.cost-round(c.quantity*c.unitCost))>.02)fail('تكلفة الصرف غير متطابقة');text(c.note,'ملاحظة الصرف',2000,true);date(c.at,'وقت الصرف');});if(o.costItems!==undefined){
        if(!Array.isArray(o.costItems)||o.costItems.length>200)fail('تفاصيل تكاليف التشغيل غير صالحة');
        const unique=new Set();for(const c of o.costItems){
         if(!obj(c))fail('بند تكلفة تشغيل غير صالح');text(c.id,'معرف التكلفة',200);
         if(unique.has(c.id))fail('بند تكلفة تشغيل مكرر');unique.add(c.id);
         oneOf(c.type,['labor','machine','finishing','outsourcing','installation','delivery','other'],'نوع تكلفة التشغيل');
         number(c.amount,'مبلغ تكلفة التشغيل',.01,1e9);text(c.note,'وصف تكلفة التشغيل',500);
         ref('users',c.recordedBy,'مسجل التكلفة');date(c.at,'وقت تسجيل التكلفة');
         date(c.reversedAt,'وقت عكس التكلفة',true);
         ref('users',c.reversedBy,'مصَحح التكلفة',true);text(c.reverseReason||'','سبب عكس التكلفة',500,true);
         if(!!c.reversedAt!==!!c.reversedBy||!!c.reversedAt!==!!c.reverseReason)fail('سجل تصحيح التكلفة غير متطابق');
        }
       }
       const activeCost=(o.costItems||[]).filter(c=>!c.reversedAt).reduce((sum,c)=>sum+c.amount,0);
       if(o.consumptions.reduce((v,c)=>v+c.cost,0)+activeCost>o.actualCost+.02)fail('تكلفة الأمر أقل من إجمالي المصروف وتكاليف التشغيل');
    });
    const reserved=new Set();s.remnants.forEach(r=>{ref('branches',r.branchId,'فرع الباقي');const m=ref('materials',r.materialId,'خامة الباقي');if(m.branchId!==r.branchId)fail('فرع الباقي لا يطابق خامته');text(r.name,'اسم الباقي');text(r.location,'موقع الباقي',300,true);text(r.color,'لون الباقي',100,true);number(r.width,'عرض الباقي',.000001);number(r.height,'ارتفاع الباقي',.000001);number(r.thickness,'سماكة الباقي');oneOf(r.status,['available','reserved','used'],'حالة الباقي');date(r.createdAt,'تاريخ الباقي');ref('users',r.confirmedBy,'موظف تأكيد الباقي');const source=ref('orders',r.sourceOrderId,'أمر مصدر الباقي',true);if(source&&source.branchId!==r.branchId)fail('مصدر الباقي خارج الفرع');const o=ref('orders',r.reservedFor,'الأمر المحجوز',true);if(r.status==='available'&&o||r.status==='reserved'&&!o)fail('بيانات حجز الباقي غير متطابقة');if(o&&(o.branchId!==r.branchId||o.materialId!==r.materialId))fail('حجز باقي خارج فرع أو خامة الأمر');if(r.status==='reserved'){if(['cancelled','delivered'].includes(o.status)||reserved.has(o.id))fail('حجز باقي مكرر أو لأمر مغلق');reserved.add(o.id);if(!remnantFits(o,r))fail('مقاس الباقي المحجوز لا يناسب الأمر');}});
    const poNumbers=new Set();s.purchases.forEach(p=>{ref('branches',p.branchId,'فرع الشراء');const m=ref('materials',p.materialId,'خامة الشراء');if(m.branchId!==p.branchId)fail('خامة الشراء خارج الفرع');text(p.number,'رقم الشراء');if(poNumbers.has(p.number))fail('رقم شراء مكرر');poNumbers.add(p.number);text(p.title,'عنوان الشراء');number(p.quantity,'كمية الشراء',.000001);number(p.unitCost,'تكلفة الشراء');oneOf(p.status,['requested','approved','received','rejected'],'حالة الشراء');ref('users',p.requestedBy,'طالب الشراء');ref('users',p.approvedBy,'معتمد الشراء',true);date(p.createdAt,'تاريخ الشراء');date(p.receivedAt,'تاريخ الاستلام',true);text(p.note,'ملاحظة الشراء',2000,true);if((p.status==='received')!==!!p.receivedAt)fail('حالة استلام الشراء لا تتطابق مع التاريخ');if(['approved','received','rejected'].includes(p.status)&&!p.approvedBy)fail('قرار شراء بدون مستخدم معتمد');});
    const reviewTokens=new Set();s.reviews.forEach(r=>{const o=ref('orders',r.orderId,'أمر التقييم');if(o.status!=='delivered'||r.branchId!==o.branchId||r.token!==o.reviewToken||reviewTokens.has(r.token))fail('تقييم مكرر أو لا يرتبط بأمر مسلم');reviewTokens.add(r.token);number(r.rating,'التقييم',1,5,true);text(r.name,'اسم المقيم',100,true);text(r.comment,'نص التقييم',2000,true);date(r.createdAt,'وقت التقييم');});
    s.audit.forEach(a=>{date(a.at,'وقت السجل');ref('users',a.actorId,'منفذ الحدث',true);ref('branches',a.branchId,'فرع الحدث');text(a.action,'نوع الحدث',100);text(a.entityId,'هدف الحدث',200);text(a.detail,'تفصيل الحدث',5000,true);});
    deadlineDefaults.forEach(({assignment,dueAt})=>assignment.dueAt=dueAt);acceptanceDefaults.forEach(({assignment,acceptedAt})=>assignment.acceptedAt=acceptedAt);
    return s;
  };
  return {seed,uid,can,visibleOrders,createOrder,updateOrder,transitionOrder,assignTeam,acceptAssignment,completeAssignment,reserveRemnant,releaseRemnant,addOrderNote,addOrderAttachment,addOrderCost,reverseOrderCost,consumeMaterial,createPurchase,approvePurchase,rejectPurchase,receivePurchase,submitReview,employeePerformance,totals,validateState};
});

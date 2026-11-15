'use strict';
const $=id=>document.getElementById(id);
const state={tenants:[],invoices:[],contacts:[],notifications:[],csrf:'',configured:{payments:false,whatsapp:false}};
function notify(msg,error=false){$('alert').textContent=msg;$('alert').className=error?'error':'';}
async function api(path,options={}){
 const method=options.method||'GET';
 const res=await fetch('/api/'+path,{credentials:'same-origin',method,headers:{...(method==='GET'?{}:{'Content-Type':'application/json','X-CSRF-Token':state.csrf})},body:options.data===undefined?undefined:JSON.stringify(options.data)});
 let data;try{data=await res.json();}catch{throw Error('رد الخادم غير متاح');}
 if(!res.ok)throw Error(data.error?.message||'تعذر تنفيذ العملية');
 return data;
}
function optionList(select){
 select.replaceChildren();
 for(const tenant of state.tenants){
  const option=document.createElement('option');option.value=tenant.id;option.textContent=tenant.name;
  select.appendChild(option);
 }
}
function cell(row,txt){
 const td=document.createElement('td');td.textContent=String(txt??'—');row.appendChild(td);return td;
}
function aLink(text,url){
 const a=document.createElement('a');a.textContent=text;a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;
}
function render(){
 optionList($('invoice-tenant'));optionList($('contact-tenant'));
 const names=new Map(state.tenants.map(t=>[t.id,t.name]));
 $('count-invoices').textContent=state.invoices.length;
 $('count-paid').textContent=state.invoices.filter(x=>x.status==='paid').length;
 $('count-contacts').textContent=state.contacts.filter(x=>!x.revokedAt).length;
 $('payment-config').textContent=state.configured.payments?'بوابة الدفع مجهزة لإنشاء الروابط؛ يتم التفعيل بعد التسوية الموثقة.':'بوابة الدفع غير مفعلة؛ يلزم إعداد أسرار Moyasar في الخادم.';
 $('whatsapp-config').textContent=state.configured.whatsapp?'تنبيهات واتساب مفعلة للأرقام الموافق عليها.':'تنبيهات واتساب غير مفعلة؛ يلزم إعداد حساب Meta وقالب الرسالة المعتمد.';
 $('create-invoice').disabled=!state.configured.payments||!state.tenants.length;
 $('dispatch').disabled=!state.configured.whatsapp;
 const tbody=$('invoices-body');tbody.replaceChildren();
 for(const inv of state.invoices){
  const tr=document.createElement('tr');
  cell(tr,names.get(inv.tenantId)||'منشأة');cell(tr,inv.days+' يوم');cell(tr,(inv.amountMinor/100).toFixed(2)+' '+inv.currency);cell(tr,inv.status);cell(tr,inv.createdAt?.slice(0,10));
  const actions=document.createElement('td');
  if(inv.url){actions.appendChild(aLink('رابط الدفع',inv.url));actions.appendChild(document.createTextNode('   '));}
  if(inv.status!=='paid'){const b=document.createElement('button');b.className='outline';b.textContent='فحص الدفع';b.addEventListener('click',()=>run(async()=>{const result=await api('platform/commercial/reconcile',{method:'POST',data:{id:inv.id}});notify('حالة الفاتورة: '+result.invoice.status);await refresh();}));actions.appendChild(b);}
  tr.appendChild(actions);tbody.appendChild(tr);
 }
 const messages=$('notifications-body');messages.replaceChildren();
 for(const n of state.notifications){const tr=document.createElement('tr');cell(tr,n.phone);cell(tr,n.status);cell(tr,n.createdAt?.slice(0,16));messages.appendChild(tr);}
}
async function refresh(){
 const [tenants,commercial]=await Promise.all([api('platform/tenants'),api('platform/commercial')]);
 state.tenants=tenants.tenants;Object.assign(state,commercial);render();
}
async function run(fn){
 try{notify('جار تنفيذ العملية...');await fn();}catch(e){notify(e.message||'تعذر تنفيذ العملية',true);}
}
$('create-invoice').addEventListener('click',()=>run(async()=>{
 const tenantId=$('invoice-tenant').value,raw=$('invoice-amount').value;
 if(!/^\d+(?:\.\d{1,2})?$/.test(raw))throw Error('اكتب مبلغا صحيحا بالريال السعودي (منزلتان عشريتان كحد أقصى)');
 const amountMinor=Math.round(Number(raw)*100);
 const result=await api('platform/commercial/invoices',{method:'POST',data:{tenantId,requestId:crypto.randomUUID(),amountMinor,currency:'SAR',days:Number($('invoice-days').value)}});
 const box=$('invoice-result');box.replaceChildren();box.hidden=false;
 box.append('تم إنشاء فاتورة الاشتراك. ');
 if(result.url)box.appendChild(aLink('فتح رابط الدفع لدى Moyasar',result.url));
 notify('تم إصدار الفاتورة. لن يتم تمديد الاشتراك إلا بعد تأكيد الدفع.');
 await refresh();
}));
$('save-contact').addEventListener('click',()=>run(async()=>{
 if(!$('contact-consent').checked)throw Error('يجب تأكيد موافقة صاحب الرقم قبل تسجيله.');
 await api('platform/commercial/contact',{method:'POST',data:{tenantId:$('contact-tenant').value,phone:$('contact-phone').value.trim(),consentAt:new Date().toISOString()}});
 $('contact-consent').checked=false;notify('تم تسجيل الموافقة بشكل آمن.');await refresh();
}));
$('revoke-contact').addEventListener('click',()=>run(async()=>{
 await api('platform/commercial/contact',{method:'POST',data:{tenantId:$('contact-tenant').value,revoke:true}});
 notify('تم إيقاف الموافقة وإلغاء الرسائل المعلقة.');await refresh();
}));
$('dispatch').addEventListener('click',()=>run(async()=>{
 const result=await api('platform/commercial/dispatch',{method:'POST',data:{}});
 notify('تمت معالجة التنبيهات: '+result.sent+' أرسلت، '+result.needsReview+' تحتاج مراجعة.');await refresh();
}));
$('refresh').addEventListener('click',()=>run(async()=>{await refresh();notify('تم تحديث السجل.');}));
run(async()=>{
 const session=await api('session');
 if(session.account?.kind!=='platform')throw Error('تحتاج حساب مالك المنصة للوصول إلى هذه الصفحة.');
 state.csrf=session.csrfToken;await refresh();notify('تم تحميل بيانات إدارة الاشتراكات.');
});

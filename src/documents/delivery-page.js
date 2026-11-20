'use strict';
(()=>{
 const $=id=>document.getElementById(id),orderId=new URLSearchParams(location.search).get('order');
 let csrf='',data=null,busy=false,drew=false;
 const checklist=['ladder','silicone','screws','power','wires','lift'];
 const labels={ladder:'سلم',silicone:'سيليكون',screws:'براغي',power:'محولات',wires:'أسلاك',lift:'رافعة'};
 const notice=t=>$('notice').textContent=t;
 const checked=()=>Object.fromEntries(checklist.map(k=>[k,$('check-'+k).checked]));
 async function api(path,method='GET',body){
  const res=await fetch(path,{method,credentials:'same-origin',cache:'no-store',
   headers:body===undefined?{}:{'Content-Type':'application/json','X-CSRF-Token':csrf},
   body:body===undefined?undefined:JSON.stringify(body)});
  const json=await res.json().catch(()=>null);
  if(!res.ok)throw Error(json?.error?.message||'تعذر الاتصال بالخادم');
  return json;
 }
 async function compress(file){
  if(!file||!/^image\/(png|jpeg|webp)$/.test(file.type))throw Error('يجب رفع صورة PNG أو JPEG أو WebP');
  if(file.size>12*1024*1024)throw Error('حجم الصورة كبير');
  const bitmap=await createImageBitmap(file);
  try{const k=Math.min(1,1500/Math.max(bitmap.width,bitmap.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(bitmap.width*k));c.height=Math.max(1,Math.round(bitmap.height*k));
   const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(bitmap,0,0,c.width,c.height);
   const result=c.toDataURL('image/jpeg',.75);if(result.length>3_200_000)throw Error('الصورة كبيرة بعد الضغط');
   return result;
  }finally{bitmap.close?.();}
 }
 function initSignature(){
  const c=$('receipt-signature'),ctx=c.getContext('2d'),ratio=Math.min(window.devicePixelRatio||1,2);
  let w=Math.max(260,Math.floor(c.getBoundingClientRect().width||440));c.width=w*ratio;c.height=190*ratio;
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.strokeStyle='#164858';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.lineJoin='round';
  drew=false;let touching=false;
  c.onpointerdown=e=>{touching=true;drew=true;c.setPointerCapture(e.pointerId);const r=c.getBoundingClientRect();ctx.beginPath();ctx.moveTo(e.clientX-r.left,e.clientY-r.top);e.preventDefault();};
  c.onpointermove=e=>{if(!touching)return;const r=c.getBoundingClientRect();ctx.lineTo(e.clientX-r.left,e.clientY-r.top);ctx.stroke();e.preventDefault();};
  c.onpointerup=c.onpointercancel=()=>{touching=false;};
 }
 async function refresh(){
  data=await api('/api/v3/orders/'+encodeURIComponent(orderId)+'/delivery');
  $('order-reference').textContent='رقم العمل: '+data.orderNumber+' · حالة الإنتاج: '+data.status;
  $('start-panel').hidden=!!data.delivery||data.status==='delivered'||data.status==='cancelled';
  $('evidence-panel').hidden=!data.delivery||!!data.delivery.verified_at;
  $('confirm-panel').hidden=!data.delivery||!!data.delivery.verified_at;
  $('night-label').hidden=!data.delivery?.requires_night;
  if(data.delivery){
   for(const k of checklist)$('check-'+k).checked=data.delivery.checklist[k]===true;
  }
  if(!data.delivery)notice('ابدأ بتفعيل توثيق التسليم إذا كان المطلوب صورا وتوقيعا.');
  else if(data.delivery.verified_at)notice('تم توثيق التسليم مسبقا.');
  else notice('أدخل الصور والأدوات المطلوبة، ثم احفظ الأدلة قبل توقيع الاستلام.');
 }
 $('start-delivery').addEventListener('click',async()=>{
  try{await api('/api/v3/orders/'+encodeURIComponent(orderId)+'/delivery/start','POST',{requiresNight:$('need-night').checked});await refresh();}
  catch(e){notice(e.message);}
 });
 $('evidence-save').addEventListener('click',async()=>{
  if(busy)return;busy=true;$('evidence-save').disabled=true;
  try{
   const beforeImageDataUrl=await compress($('before').files?.[0]);
   const afterImageDataUrl=await compress($('after').files?.[0]);
   const nightImageDataUrl=data.delivery?.requires_night?await compress($('night').files?.[0]):undefined;
   await api('/api/v3/orders/'+encodeURIComponent(orderId)+'/delivery/evidence','POST',
    {beforeImageDataUrl,afterImageDataUrl,nightImageDataUrl,checklist:checked()});
   notice('تم حفظ صور الموقع وقائمة الأدوات في سجل الأمر.');
  }catch(e){notice('تعذر الحفظ: '+e.message);}
  finally{busy=false;$('evidence-save').disabled=false;}
 });
 $('confirm-delivery').addEventListener('click',async()=>{
  if(busy)return;busy=true;$('confirm-delivery').disabled=true;
  try{
   if(!drew||!$('consent').checked||!$('recipient').value.trim())throw Error('يلزم اسم المستلم وتوقيعه وإقرار الاستلام');
   const result=await api('/api/v3/orders/'+encodeURIComponent(orderId)+'/delivery/complete','POST',{
    recipientName:$('recipient').value.trim(),signatureDataUrl:$('receipt-signature').toDataURL('image/png'),
    consent:true,coverage:$('coverage').value,supportPhone:$('support-phone').value
   });
   notice('تم توثيق التسليم وإصدار المستندات.');
   const box=$('completed-links');box.replaceChildren();
   for(const [title,url] of [['محضر التسليم',result.deliveryUrl],['شهادة الضمان',result.warrantyUrl]]){
    if(!url)continue;const a=document.createElement('a');a.className='doc-btn';a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=title;box.append(a);
   }
   await refresh();
  }catch(e){notice('تعذر تسليم العمل: '+e.message);}
  finally{busy=false;$('confirm-delivery').disabled=false;}
 });
 $('clear-signature').addEventListener('click',initSignature);
 if(!orderId||!/^[-A-Za-z0-9_]{1,160}$/.test(orderId)){notice('معرف العمل غير صحيح');return;}
 for(const k of checklist){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.id='check-'+k;label.append(input,' '+labels[k]);$('checklist').append(label);}
 (async()=>{const session=await api('/api/session');if(session.account?.kind!=='tenant')throw Error('يلزم حساب الموظف أو المدير');csrf=session.csrfToken;await refresh();initSignature();})().catch(e=>notice(e.message));
})();

'use strict';
(()=>{
 const root=document.getElementById('root'),token=location.pathname.split('/').at(-1),R=globalThis.AwamerDocumentRenderer;
 if(!/^[A-Za-z0-9_-]{42,44}$/.test(token)){root.textContent='الرابط غير صالح';return;}
 let view=null,tier='standard',quantities={},busy=false,drew=false;
 const el=id=>document.getElementById(id);
 function notify(msg,error=false){
  const box=el('page-alert');box.textContent=msg;
  box.className=error?'doc-error':'doc-callout';box.style.display='block';
 }
 async function api(path,method='GET',data){
  const res=await fetch(path,{method,credentials:'omit',cache:'no-store',headers:data===undefined?{}:{'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});
  const payload=await res.json().catch(()=>null);
  if(!res.ok)throw Error(payload?.error?.message||'تعذر إكمال العملية');
  return payload;
 }
 async function load(){
  view=await api('/api/public/documents/'+encodeURIComponent(token));
  tier=view.pricing?.tierKey||'standard';
  view.snapshot.status=view.snapshot.status||'published';
  draw();
 }
 function draw(){
  if(!view)return;
  root.innerHTML=R.render(view,{token,url:location.origin+location.pathname,print:false});
  if(location.search.includes('print=1')){window.print();}
 }
 async function price(){
  if(!view||view.kind!=='quote')return;
  const data=await api('/api/public/documents/'+encodeURIComponent(token)+'/preview','POST',{tierKey:tier,quantities});
  view.pricing=data;draw();
 }
 function modal(id,show=true){const dialog=el(id);if(!dialog)return;dialog.hidden=!show;if(show)dialog.querySelector('input:not([type=checkbox])')?.focus();}
 function err(id,txt){const box=el(id);box.hidden=!txt;box.textContent=txt||'';}
 async function compress(file){
  if(!file||!/^image\/(png|jpeg|webp)$/.test(file.type))throw Error('ارفع صورة JPEG أو PNG أو WebP');
  if(file.size>12*1024*1024)throw Error('الصورة أكبر من الحد');
  const bitmap=await createImageBitmap(file);
  try{
   const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.floor(bitmap.width*scale));canvas.height=Math.max(1,Math.floor(bitmap.height*scale));
   const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
   const data=canvas.toDataURL('image/jpeg',.74);
   if(data.length>3_200_000)throw Error('تعذر ضغط الصورة؛ اختر صورة أصغر');
   return data;
  }finally{bitmap.close?.();}
 }
 function initializeCanvas(){
  const canvas=el('sign-canvas'),ctx=canvas.getContext('2d');
  drew=false;
  const ratio=Math.min(window.devicePixelRatio||1,2);
  const width=Math.max(260,Math.floor(canvas.getBoundingClientRect().width||420));
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(190*ratio);
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.strokeStyle='#164854';ctx.lineWidth=2.3;ctx.lineCap='round';ctx.lineJoin='round';
  let active=false;
  const point=e=>{const rect=canvas.getBoundingClientRect();return {x:e.clientX-rect.left,y:e.clientY-rect.top};};
  canvas.onpointerdown=e=>{active=true;drew=true;canvas.setPointerCapture(e.pointerId);let p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);e.preventDefault();};
  canvas.onpointermove=e=>{if(!active)return;let p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();e.preventDefault();};
  canvas.onpointerup=canvas.onpointercancel=()=>{active=false;};
 }
 root.addEventListener('click',async e=>{
  const tierButton=e.target.closest('[data-tier]');
  if(tierButton){tier=tierButton.dataset.tier;try{await price();}catch(error){notify(error.message,true);}return;}
  const image=e.target.closest('.doc-zoomable');
  if(image){el('zoom-photo').src=image.src;modal('zoom-modal',true);return;}
  if(e.target.closest('#doc-accept')){modal('sign-modal');initializeCanvas();return;}
  if(e.target.closest('#doc-receipt')){modal('receipt-modal');return;}
  if(e.target.closest('#doc-print')){e.preventDefault();window.print();return;}
 });
 root.addEventListener('change',async e=>{
  if(!e.target.matches('[data-line-id]'))return;
  quantities[e.target.dataset.lineId]=Number(e.target.value);
  try{await price();}catch(error){notify(error.message,true);}
 });
 for(const x of document.querySelectorAll('[data-modal-close]'))x.addEventListener('click',()=>x.closest('.doc-modal').hidden=true);
 el('sign-clear').addEventListener('click',initializeCanvas);
 el('sign-confirm').addEventListener('click',async()=>{
  if(busy)return;
  try{
   if(!drew)throw Error('وقع أولا داخل مساحة التوقيع');
   if(!el('sign-consent').checked)throw Error('يجب تأكيد الموافقة على شروط العرض');
   const signerName=el('sign-name').value.trim();
   if(!signerName)throw Error('اكتب اسم المعتمد');
   busy=true;el('sign-confirm').disabled=true;err('sign-error','');
   const data=await api('/api/public/documents/'+encodeURIComponent(token)+'/accept','POST',{
    requestId:'sign_'+crypto.randomUUID().replace(/-/g,''),
    tierKey:tier,quantities,consent:true,signerName,
    signatureDataUrl:el('sign-canvas').toDataURL('image/png')
   });
   modal('sign-modal',false);
   if(data.trackingUrl)notify('تم اعتماد العرض وإنشاء أمر العمل رقم '+data.orderNumber+'. رابط التتبع: '+data.trackingUrl);
   else notify('تم اعتماد العرض وإنشاء أمر العمل.');
   await load();
  }catch(error){err('sign-error',error.message);}
  finally{busy=false;el('sign-confirm').disabled=false;}
 });
 el('receipt-confirm').addEventListener('click',async()=>{
  if(busy)return;
  try{
   const file=el('receipt-file').files?.[0];if(!file)throw Error('اختر صورة الإيصال');
   const claimedAmountMinor=Math.round(Number(el('receipt-amount').value)*100);
   if(!Number.isSafeInteger(claimedAmountMinor)||claimedAmountMinor<0)throw Error('مبلغ التحويل غير صالح');
   busy=true;el('receipt-confirm').disabled=true;err('receipt-error','');
   const imageDataUrl=await compress(file);
   const data=await api('/api/public/documents/'+encodeURIComponent(token)+'/payment-evidence','POST',{imageDataUrl,claimedAmountMinor,currency:view.snapshot.currency});
   modal('receipt-modal',false);notify(data.message||'تم إرفاق الإيصال للمراجعة');
  }catch(error){err('receipt-error',error.message);}
  finally{busy=false;el('receipt-confirm').disabled=false;}
 });
 load().catch(error=>{root.innerHTML='<main class="doc-frame"><div class="doc-error">'+R.html(error.message)+'</div></main>';});
})();

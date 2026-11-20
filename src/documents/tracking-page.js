'use strict';
(()=>{
 const root=document.getElementById('root'),R=globalThis.AwamerDocumentRenderer;
 const token=location.pathname.split('/').at(-1);
 if(!/^[A-Za-z0-9_-]{42,44}$/.test(token)){root.textContent='رابط التتبع غير صالح';return;}
 let previous='',etag='';
 async function refresh(){
  if(document.visibilityState==='hidden')return;
  try{
   const res=await fetch('/api/public/tracking/'+encodeURIComponent(token),{cache:'no-store',headers:etag?{'If-None-Match':etag}:{}});
   if(res.status===304)return;
   if(!res.ok)throw Error('رابط التتبع غير متاح');
   const result=await res.json();etag=res.headers.get('ETag')||'';
   const encoded=JSON.stringify(result);
   if(encoded!==previous){previous=encoded;root.innerHTML=R.tracker(result);}
  }catch(error){if(!previous)root.innerHTML='<main class="doc-frame"><div class="doc-error">'+R.html(error.message)+'</div></main>';}
 }
 refresh();
 setInterval(refresh,15000);
 document.addEventListener('visibilitychange',refresh);
})();

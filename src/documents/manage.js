'use strict';
(()=>{
 const $=id=>document.getElementById(id),form=$('quote-form'),root=$('line-list');
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let csrf='',state=null,documents=[];
 function message(t){$('notice').textContent=t;}
 async function api(path,method='GET',body){
  const res=await fetch(path,{method,credentials:'same-origin',cache:'no-store',headers:body===undefined?{}:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:body===undefined?undefined:JSON.stringify(body)});
  const data=await res.json().catch(()=>null);if(!res.ok)throw Error(data?.error?.message||'تعذر تنفيذ العملية');
  return data;
 }
 function addLine(){
  const row=document.createElement('div');row.className='doc-line';row.dataset.line='';
  row.innerHTML='<div class="doc-line-top"><b>بند تشغيلي</b><button type="button" class="doc-btn" data-remove>حذف البند</button></div>'+
   '<div class="line-grid">'+
   '<label>اسم البند<input name="lineName" required maxlength="180" placeholder="حروف أكريلك مضيئة"></label>'+
   '<label>الكمية<input name="quantity" type="number" min="1" max="10000" step="1" required value="1"></label>'+
   '<label>وحدة البيع<input name="unit" required maxlength="35" value="قطعة"></label>'+
   '<label>سعر الوحدة<input name="unitAmount" type="number" step="0.01" min="0" required></label>'+
   '<label>العرض بالملليمتر<input name="widthMm" type="number" step=".1" min="0"></label>'+
   '<label>الارتفاع بالملليمتر<input name="heightMm" type="number" step=".1" min="0"></label>'+
   '<label>الخامة<input name="material" maxlength="250" placeholder="أكريلك أصلي"></label>'+
   '<label>السماكة<input name="thickness" maxlength="250" placeholder="5mm"></label>'+
   '<label>الماكينة<input name="machine" maxlength="250" placeholder="CNC / ليزر"></label>'+
   '<label>الإضاءة<input name="lighting" maxlength="250" placeholder="LED 12V"></label>'+
   '<label>التركيب<input name="installation" maxlength="250" placeholder="تركيب بالموقع"></label>'+
   '<label>الموقع<input name="location" maxlength="250"></label>'+
   '<label>شروط الضمان<input name="warranty" maxlength="250"></label>'+
   '<label>مدة الضمان بالأشهر<input name="warrantyMonths" type="number" min="0" max="120" step="1"></label>'+
   '<label>أقصى كمية يسمح للعميل بتعديلها<input name="maxQuantity" type="number" min="1" max="10000" step="1"></label>'+
   '<label>صورة معاينة مضغوطة<input name="preview" type="file" accept="image/png,image/jpeg,image/webp"></label>'+
   '</div><div class="doc-specs"><label class="check"><input type="checkbox" name="editable"> يمكن للعميل تعديل الكمية</label>'+
   '<label class="check"><input type="checkbox" name="install"> تركيب ميداني</label>'+
   '<label class="check"><input type="checkbox" name="night"> يحتاج صورة مضاءة بعد التركيب</label></div>';
  root.append(row);
 }
 async function compress(file){
  if(!file||!/^image\/(png|jpeg|webp)$/.test(file.type))throw Error('الصورة يجب أن تكون PNG أو JPG أو WebP');
  if(file.size>12*1024*1024)throw Error('الصورة كبيرة جدا');
  const bitmap=await createImageBitmap(file);
  try{
   const k=Math.min(1,1500/Math.max(bitmap.width,bitmap.height)),c=document.createElement('canvas');
   c.width=Math.max(1,Math.round(bitmap.width*k));c.height=Math.max(1,Math.round(bitmap.height*k));
   const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(bitmap,0,0,c.width,c.height);
   const result=c.toDataURL('image/jpeg',.79);
   if(result.length>3_100_000)throw Error('الصورة المضغوطة لا تزال كبيرة');
   return result;
  }finally{bitmap.close?.();}
 }
 function fillSelect(select,items,labelKey='name'){
  select.replaceChildren();
  for(const item of items){const option=document.createElement('option');option.value=item.id;option.textContent=item[labelKey];select.add(option);}
 }
 function refreshClients(){
  const branchId=$('branch').value;
  fillSelect($('client'),(state?.clients||[]).filter(c=>c.branchId===branchId));
 }
 function renderDocs(){
  const box=$('docs-list');box.replaceChildren();
  if(!documents.length){box.textContent='لا توجد مستندات محفوظة بعد';return;}
  for(const d of documents){
   const row=document.createElement('div');row.className='doc-line';
   const info=document.createElement('div');info.className='doc-line-info';
   const title=document.createElement('h3');title.textContent=d.type+' · '+d.id.slice(0,15);
   const subtitle=document.createElement('p');subtitle.className='doc-line-note';subtitle.textContent=d.status+' · '+(d.created_at||'').slice(0,16);
   info.append(title,subtitle);
   const actions=document.createElement('div');actions.className='doc-specs';
   if(d.status==='draft'&&d.type==='quote'){
    const pub=document.createElement('button');pub.className='doc-cta';pub.textContent='إصدار العرض';pub.dataset.op='publish';pub.dataset.id=d.id;actions.append(pub);
   }else if(['published','accepted','completed'].includes(d.status)){
    const link=document.createElement('button');link.className='doc-btn';link.textContent='رابط جديد';link.dataset.op='share';link.dataset.id=d.id;actions.append(link);
   }
   const pdf=document.createElement('a');pdf.href='/api/v3/documents/'+encodeURIComponent(d.id)+'/pdf';pdf.className='doc-btn';pdf.textContent='عرض PDF';pdf.target='_blank';pdf.rel='noopener';actions.append(pdf);
   row.append(info,actions);box.append(row);
  }
 }
 async function refreshDocs(){const data=await api('/api/v3/documents');documents=data.documents;renderDocs();}
 async function bootstrap(){
  const session=await api('/api/session');if(session.account?.kind!=='tenant')throw Error('يلزم الدخول بحساب منشأة');
  csrf=session.csrfToken;
  const data=await api('/api/state');state=data.state;
  fillSelect($('branch'),state.branches);refreshClients();await refreshDocs();
  message('تستطيع تجهيز عرض سعر مرتبط بعميل وفرع، ثم إصداره برابط خاص.');
 }
 $('branch').addEventListener('change',refreshClients);
 $('line-add').addEventListener('click',()=>{if(root.children.length>=80){message('الحد الأقصى 80 بندا للعرض');return;}addLine();});
 root.addEventListener('click',event=>{if(event.target.matches('[data-remove]')){if(root.children.length<=1){message('أضف بندا واحدا على الأقل');return;}event.target.closest('[data-line]').remove();}});
 form.addEventListener('submit',async event=>{
  event.preventDefault();const button=$('quote-create');button.disabled=true;
  try{
   const v=new FormData(form);
   const dueAt=new Date(v.get('dueAt')).toISOString(),expiresAt=new Date(v.get('expiresAt')).toISOString();
   const list=[];
   for(const node of root.querySelectorAll('[data-line]')){
    const get=name=>node.querySelector('[name="'+name+'"]')?.value?.trim()||'';
    const q=Number(get('quantity')),price=Number(get('unitAmount'));
    if(!Number.isFinite(price)||price<0||!Number.isSafeInteger(Math.round(price*100)))throw Error('السعر غير صالح');
    const edit=node.querySelector('[name=editable]').checked;
    const specs={material:get('material'),thickness:get('thickness'),lighting:get('lighting'),machine:get('machine'),
     installation:get('installation'),warranty:get('warranty'),location:get('location'),
     warrantyMonths:Number(get('warrantyMonths')||0),requiresInstallation:node.querySelector('[name=install]').checked,
     requiresNight:node.querySelector('[name=night]').checked};
    const line={name:get('lineName'),quantity:q,unit:get('unit'),unitAmountMinor:Math.round(price*100),
     widthMm:Number(get('widthMm')||0),heightMm:Number(get('heightMm')||0),
     editableQuantity:edit,maxQuantity:edit?Number(get('maxQuantity')||q):q,minQuantity:q,specs};
    const photo=node.querySelector('[name=preview]').files?.[0];
    if(photo)line.previewDataUrl=await compress(photo);
    list.push(line);
   }
   const tiers=[{key:'standard',label:'قياسي',multiplierBp:10000}];
   const e=v.get('economicBp'),p=v.get('premiumBp');
   if(e)tiers.unshift({key:'economic',label:'اقتصادي',multiplierBp:Math.round(Number(e)*100)});
   if(p)tiers.push({key:'premium',label:'فاخر',multiplierBp:Math.round(Number(p)*100)});
   const created=await api('/api/v3/documents/quote','POST',{
    requestId:'quote_'+crypto.randomUUID().replace(/-/g,''),branchId:v.get('branchId'),clientId:v.get('clientId'),title:v.get('title'),
    description:v.get('description')||'',dueAt,expiresAt,category:'projects',priority:v.get('priority'),
    businessPhone:v.get('businessPhone')||'',tiers,lines:list
   });
   message('تم حفظ المسودة. اضغط إصدار العرض لإرسال الرابط إلى العميل.');
   await refreshDocs();window.scrollTo({top:0,behavior:'smooth'});
  }catch(error){message('تعذر الحفظ: '+error.message);}
  finally{button.disabled=false;}
 });
 $('docs-list').addEventListener('click',async e=>{
  const button=e.target.closest('[data-op]');if(!button)return;
  button.disabled=true;
  try{
   const data=await api('/api/v3/documents/'+encodeURIComponent(button.dataset.id)+'/'+button.dataset.op,'POST',{});
   const a=document.createElement('a');a.href=data.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='فتح الرابط الجديد';
   $('notice').replaceChildren('تم إنشاء الرابط الآمن. انسخه وشاركه مع المستلم. ',a);
   if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(data.url).catch(()=>{});
   await refreshDocs();
  }catch(error){message('تعذر إصدار الرابط: '+error.message);}
  finally{button.disabled=false;}
 });
 addLine();
 bootstrap().catch(error=>{message(error.message+' — ارجع إلى تسجيل الدخول.');});
})();

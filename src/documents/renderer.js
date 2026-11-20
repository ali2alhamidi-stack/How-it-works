(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('../qr.js'):root.WOQR);
 if(typeof module==='object'&&module.exports)module.exports=api;
 root.AwamerDocumentRenderer=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(QR){
 'use strict';
 const icons={
  check:'<path d="m5 12 4 4L19 6"/>',file:'<path d="M6 2h9l5 5v15H6zM15 2v6h5M9 12h8m-8 4h8"/>',
  layer:'<path d="m2 9 10-6 10 6-10 6zM2 14l10 6 10-6M2 18l10 4 10-4"/>',
  ruler:'<path d="M3 8h18v8H3zM7 8v4m4-4v3m4-3v4m4-4v3"/>',
  light:'<path d="M9 18h6m-5 3h4m-8-10a6 6 0 1 1 12 0c0 3-3 4-3 7H9c0-3-3-4-3-7z"/>',
  machine:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M6 8h12m-9 4h6m-8 4h10M12 8v4"/>',
  install:'<path d="M14 7 6 15l3 3 8-8m-8 8-2 3-4-4 3-2M16 3l5 5-3 3-5-5z"/>',
  shield:'<path d="M12 2 21 6v6c0 5-4 8-9 10-5-2-9-5-9-10V6zM8 12l3 3 5-6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
  pin:'<path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13z"/><circle cx="12" cy="9" r="2.5"/>',
  phone:'<path d="M7 3H4c-1 0-2 1-2 2 0 10 7 17 17 17 1 0 2-1 2-2v-3l-5-2-3 3c-3-1-5-3-6-6l3-3z"/>',
  sign:'<path d="M3 19h18M4 16c4 2 5-4 8-8s5 4 8 3M14 4l3-2 3 3-3 2"/>',
  whatsapp:'<path d="M20 11a8 8 0 0 1-12 7l-5 2 1-5a8 8 0 1 1 16-4zM8 9c1 3 3 5 6 6l2-2"/>',
  camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/>',
  print:'<path d="M6 9V2h12v7M6 18H4V9h16v9h-2M6 15h12v7H6zM17 12h.1"/>',
  arrow:'<path d="M20 12H4m7-7-7 7 7 7"/>',
  package:'<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10"/>',
  work:'<path d="M4 3h16v18H4zM8 8h8M8 12h8M8 16h4"/>',
  lock:'<rect x="5" y="10" width="14" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  cart:'<path d="M3 3h2l3 12h11l2-8H6M9 19h.1M18 19h.1"/>',
  alert:'<path d="M12 2 22 21H2zM12 9v5m0 4v.1"/>',
  quality:'<path d="m12 2 2.5 5 5.5 1-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1z"/>',
  download:'<path d="M12 3v13m-5-5 5 5 5-5M4 18v4h16v-4"/>',
  view:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>'
 };
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot','"':'&quot;',"'":'&#39;'}[c]));
 // Correct explicit escaping avoids injecting customer strings into attributes or HTML.
 function html(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function icon(name){return '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(icons[name]||icons.file)+'</svg>';}
 function amount(n,currency){return new Intl.NumberFormat('ar-SA-u-nu-latn',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n||0)/100)+' '+html(currency||'');}
 function date(x){const d=new Date(x);return Number.isNaN(+d)?'—':d.toLocaleDateString('ar-SA-u-ca-gregory',{year:'numeric',month:'long',day:'numeric'});}
 function safeHref(href){if(typeof href!=='string')return '';try{const u=new URL(href,'https://awamer.invalid');return ['http:','https:','tel:'].includes(u.protocol)?html(href):'';}catch{return '';}}
 function badges(line){
  const s=line.specs||{},b=[];
  if(s.material||s.thickness)b.push(['layer',[s.material,s.thickness].filter(Boolean).join(' · ')]);
  if(line.widthMm>0&&line.heightMm>0){
   const area=(line.widthMm*line.heightMm/1000000).toLocaleString('ar-SA-u-nu-latn',{maximumFractionDigits:3});
   b.push(['ruler',(line.widthMm/1000)+'م × '+(line.heightMm/1000)+'م · '+area+'م²']);
  }
  if(s.lighting)b.push(['light',s.lighting]);
  if(s.machine)b.push(['machine',s.machine]);
  if(s.installation)b.push(['install',s.installation]);
  if(s.warranty)b.push(['shield',s.warranty]);
  if(s.location)b.push(['pin',s.location]);
  return b.map(([name,value])=>'<span class="doc-spec">'+icon(name)+html(value)+'</span>').join('');
 }
 function qr(url){
  if(!url||!QR?.svg)return '';
  try{return '<div class="doc-qr">'+QR.svg(url,{size:110,margin:2})+'</div>';}catch{return '';}
 }
 function lineCard(line,pricing,editable,mode){
  const priced=pricing?.lines?.find(x=>x.id===line.id),amt=priced?.totalAmountMinor;
  const image=line.previewUrl&&/^(data:image\/(?:png|jpeg|webp);base64,|https:\/\/)/.test(line.previewUrl)?
    '<img src="'+html(line.previewUrl)+'" alt="معاينة التصميم" class="doc-zoomable" loading="lazy" />':icon('package');
  const qty=editable&&line.editableQuantity?
    '<input type="number" step="1" min="'+line.minQuantity+'" max="'+line.maxQuantity+'" data-line-id="'+html(line.id)+'" value="'+(priced?.quantity??line.quantity)+'" aria-label="تعديل كمية '+html(line.name)+'">':
    '<b>'+(priced?.quantity??line.quantity)+'</b>';
  return '<article class="doc-line"><div class="doc-thumb">'+image+'</div><div class="doc-line-info"><div class="doc-line-top"><div><h3>'+html(line.name)+'</h3><div class="doc-line-note">البند · '+html(line.unit)+'</div></div><div class="doc-qty">الكمية '+qty+'</div></div><div class="doc-specs">'+badges(line)+'</div></div>'+
    (mode==='quote'&&typeof amt==='number'?'<div class="doc-price"><small>إجمالي البند</small><strong>'+amount(amt,pricing.currency)+'</strong></div>':'')+'</article>';
 }
 function header(snapshot,title,number,status){
  const logo=typeof snapshot.brandLogo==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(snapshot.brandLogo)?snapshot.brandLogo:'/assets/awamer-logo.webp';
  return '<header class="doc-header"><div class="doc-brand"><img class="doc-brand-mark" src="'+html(logo)+'" alt="شعار المنشأة"><div><div class="doc-brand-name">'+html(snapshot.brandName||'أوامر')+'</div><div class="doc-brand-caption">AWAMER · DOCUMENTS</div></div></div><div class="doc-heading"><small>OFFICIAL WORKFLOW DOCUMENT</small><strong>'+html(title)+'</strong><div>'+html(number||'')+'</div></div></header><div class="doc-kicker">'+icon('shield')+' مستند بإصدار موثق</div>';
 }
 function info(items){return '<div class="doc-info-grid">'+items.map(x=>'<div class="doc-meta"><small>'+html(x[0])+'</small><b>'+html(x[1])+'</b></div>').join('')+'</div>';}
 function quote(view,options={}){
  const s=view.snapshot,p=view.pricing||{currency:s.currency,lines:[],totalAmountMinor:s.initialTotalMinor},readOnly=s.status!=='published'||options.print;
  const expires=Date.parse(s.expiresAt)<=Date.now();
  const status=s.status==='accepted'?'معتمد':expires?'منتهي':s.status==='published'?'بانتظار اعتماد العميل':'مسودة';
  const tiers=s.tiers||[];
  const url=options.url||'';
  let inner=header(s,'عرض سعر تفاعلي',view.documentId)+
   '<div class="doc-main-title">'+html(s.title)+'</div><p class="doc-summary">'+html(s.description||'مواصفات تنفيذ وتجهيز العمل')+'</p>'+
   '<span class="doc-status '+(readOnly?'':'pending')+'">'+icon('clock')+html(status)+'</span>'+
   info([['العميل',s.clientName],['الفرع',s.branchName],['صلاحية العرض',date(s.expiresAt)]])+
   '<section><h2 class="doc-section-title">'+icon('layer')+' اختر الباقة المناسبة</h2>'+
   (tiers.length>1?'<div class="doc-tiers">'+tiers.map(t=>'<button class="doc-tier" type="button" data-tier="'+html(t.key)+'" aria-pressed="'+(p.tierKey===t.key)+'"'+(readOnly?' disabled':'')+'>'+icon('check')+html(t.label)+'</button>').join('')+'</div>':
    '<div class="doc-callout">'+html(tiers[0]?.label||'الخيار الأساسي')+'</div>')+'</section>'+
   '<h2 class="doc-section-title">'+icon('package')+' البنود والمواصفات</h2><div class="doc-lines">'+s.lines.map(l=>lineCard(l,p,!readOnly,'quote')).join('')+'</div>'+
   '<div class="doc-total"><div><small>القيمة الإجمالية لهذا الاختيار</small><strong id="doc-total-amount">'+amount(p.totalAmountMinor,s.currency)+'</strong></div>'+icon('check')+'</div>'+
   '<div class="doc-legal">'+html(view.consentText||'يرجى مراجعة جميع البنود قبل الاعتماد')+'</div>'+
   '<div class="doc-qr-wrap">'+qr(url)+'<div><strong>نسخة العرض المباشرة</strong><p class="doc-summary">امسح الرمز لفتح نسخة الويب ومراجعة الموافقة.</p></div></div>';
  if(!readOnly)inner+='<div class="doc-actions no-print"><div><button class="doc-cta" id="doc-accept" type="button">'+icon('sign')+' اعتماد وتوقيع العرض</button><button class="doc-btn" id="doc-receipt" type="button">'+icon('camera')+' إرفاق تحويل</button></div><div><a class="doc-btn" target="_blank" rel="noopener noreferrer" href="'+(url?html('https://wa.me/?text='+encodeURIComponent('مناقشة عرض أوامر: '+url)):'#')+'">'+icon('whatsapp')+' مناقشة واتساب</a><a class="doc-btn" href="'+html(url?url+'?print=1':'#')+'" id="doc-print">'+icon('print')+' حفظ PDF / طباعة</a></div></div>';
  return inner;
 }
 function workshop(view,options={}){
  const s=view.snapshot,st=s.status||'draft',status=({draft:'مسودة',approval:'مراجعة التصميم',queued:'انتظار التنفيذ',production:'قيد التنفيذ',quality:'فحص الجودة',ready:'جاهز للتسليم',delivered:'تم التسليم',cancelled:'ملغي'})[st]||'قيد المتابعة';
  return header(s,'بطاقة أمر تشغيل',s.orderNumber)+
   '<h1 class="doc-main-title">'+html(s.orderTitle)+'</h1><span class="doc-status pending">'+icon('clock')+html(status)+'</span>'+
   info([['رقم الأمر',s.orderNumber],['أولوية التنفيذ',s.priority==='urgent'?'عاجل':s.priority==='high'?'مرتفع':'عادي'],['تاريخ التسليم',date(s.dueAt)]])+
   '<h2 class="doc-section-title">'+icon('machine')+' مسار التنفيذ</h2><div class="doc-flow">'+[['file','التصميم'],['machine','التجهيز / CNC'],['light','الإنارة والتجميع'],['quality','فحص الجودة'],['install','التركيب والتسليم']].map(([i,label],j)=>'<span class="doc-step '+(j===0?'active':'')+'">'+icon(i)+html(label)+'</span>'+(j<4?'<span class="doc-separator"></span>':'')).join('')+'</div>'+
   '<h2 class="doc-section-title">'+icon('layer')+' البنود التشغيلية</h2><div class="doc-lines">'+(s.lines||[]).map(l=>lineCard(l,null,false,'workshop')).join('')+'</div>'+
   '<div class="doc-callout"><h3>'+icon('shield')+' بيانات التشغيل فقط</h3><p>هذه البطاقة لا تحتوي أسعارا أو تكاليف. بدء المهام أو إتمامها يتطلب حساب الفني.</p></div>';
 }
 function delivery(view){
  const s=view.snapshot,tools={ladder:'سلم',silicone:'سيليكون',screws:'براغي',power:'محولات',wires:'أسلاك',lift:'رافعة'};
  return header(s,'محضر التركيب والتسليم',s.orderNumber)+
   '<h1 class="doc-main-title">تم تسليم '+html(s.orderTitle)+'</h1>'+
   '<span class="doc-status">'+icon('check')+' تسليم موثق</span>'+
   info([['المرجع',s.orderNumber],['اسم المستلم',s.recipientName],['تاريخ التسليم',date(s.deliveredAt)]])+
   '<h2 class="doc-section-title">'+icon('check')+' قائمة تجهيز المهمة</h2>'+
   '<div class="doc-specs">'+Object.entries(s.checklist||{}).map(([k,v])=>'<span class="doc-spec">'+icon(v?'check':'alert')+html(tools[k]||k)+' · '+(v?'مطلوب ومجهز':'غير مطلوب')+'</span>').join('')+'</div>'+
   '<div class="doc-callout"><h3>'+icon('camera')+' توثيق العمل</h3><p>صور ما قبل التنفيذ وبعده محفوظة لدى المنشأة؛ '+(s.hasNight?'صورة الإضاءة الليلية موثقة.':'لا يتطلب هذا العمل توثيق إضاءة ليلية.')+'</p></div>';
 }
 function warranty(view){
  const s=view.snapshot;
  return header(s,'شهادة ضمان رقمية',s.orderNumber)+
   '<div class="doc-hero-cert"><h1>'+icon('shield')+' شهادة ضمان</h1><p>تغطية موثقة للعمل المركب</p><h2>'+html(s.orderTitle)+'</h2></div>'+
   info([['رقم الطلب',s.orderNumber],['بداية الضمان',date(s.startAt)],['نهاية الضمان',date(s.endAt)]])+
   '<div class="doc-callout"><h3>نطاق الضمان</h3><p>'+html(s.coverage||'حسب شروط العرض المعتمد')+'</p></div>'+
   (s.serviceContact?'<a class="doc-btn" href="tel:'+html(s.serviceContact.replace(/[^+0-9]/g,''))+'">'+icon('phone')+' طلب دعم وصيانة</a>':'');
 }
 function render(view,options={}){
  if(!view||!view.snapshot)throw Error('Invalid document view');
  const body=view.kind==='quote'?quote(view,options):view.kind==='workshop'?workshop(view,options):view.kind==='delivery'?delivery(view):view.kind==='warranty'?warranty(view):'<p>نوع المستند غير معروف</p>';
  return '<main class="doc-frame" dir="rtl">'+body+'<footer class="doc-foot">أوامر · المستند مرتبط بالإصدار رقم '+html(view.version)+' · المرجع الرقمي '+html(String(view.hash||'').slice(0,16))+'</footer></main>';
 }
 function tracker(data){
  const phases=data.phases||[],idx=phases.findIndex(x=>x.id===data.stage);
  return '<main class="doc-frame tracker-wrap" dir="rtl"><header class="doc-header"><div class="doc-brand">'+icon('package')+'<div class="doc-brand-name">تتبع أمر العمل</div></div></header>'+
   '<div class="doc-main-title">'+html(data.title)+'</div>'+info([['رقم الطلب',data.reference],['التسليم المتوقع',date(data.dueAt)],['آخر تحديث',date(data.updatedAt)]])+
   '<div class="tracker-stage">'+icon('check')+html(data.stageLabel)+'</div><ol class="tracker-list">'+phases.map((p,i)=>'<li class="'+(idx===i?'current':i<idx?'complete':'')+'"><span class="tracker-dot">'+(i<=idx?icon('check'):'')+'</span><div><b>'+html(p.label)+'</b><small>'+(idx===i?'المرحلة الحالية':i<idx?'اكتملت المرحلة':'مرحلة لاحقة')+'</small></div></li>').join('')+'</ol>'+
   '<div class="doc-callout">يتم تحديث حالة الطلب تلقائيا من نظام الورشة. المعلومات الظاهرة هنا لا تتضمن أسعارا أو بيانات موظفين.</div></main>';
 }
 return {render,tracker,icon,amount,html};
});

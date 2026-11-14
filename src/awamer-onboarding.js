(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.WOOnboarding=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const guideTips={
 home:'راقب الأعمال المتأخرة، طلبات الاعتماد والخامات المنخفضة من الصفحة الرئيسية.',
 orders:'ابدأ بأمر جديد، وحدد العميل والخامة والمقاس وموعد التسليم.',
 proofs:'أرسل رابط التصميم للعميل قبل الإنتاج؛ موافقته لا تلغي اعتماد المسؤول.',
 production:'وزع الفريق وأكد اكتمال المهام قبل بدء فحص الجودة.',
 inventory:'أضف الخامات الفعلية ووحدات الشراء والتكاليف بعد تأكيد المورد.',
 nesting:'اختر خامة الفرع والمقاسات بالملليمتر، وقس البواقي بعد القص الحقيقي.',
 calculators:'المبالغ تقديرية؛ راجع أسعار المورد وتكاليف التشغيل قبل عرضها للعميل.',
 clients:'احفظ بيانات العميل في الفرع الذي يدير أعماله.',
 employees:'حدد الفرع ودور المستخدم وصلاحياته قبل تفعيل حساب الموظف.',
 branches:'راجع بيانات الفرع وأنشئ فروعًا إضافية حسب حدود الاشتراك.',
 purchases:'الطلب والموافقة والاستلام مراحل منفصلة لحماية رصيد المخزون.',
 reports:'التقارير مبنية على العمليات المسجلة وليست نظامًا ضريبيًا.',
 settings:'هوية المؤسسة تظهر في مستنداتها؛ هوية نظام أوامر تظهر في التطبيق.'
};
function steps(ctx){
 const ids=new Set(ctx.branches.filter(b=>b.active!==false).map(b=>b.id)),has=id=>ids.has(id);
 return [
  {id:'identity',title:'بيانات وهوية المنشأة',detail:'أكد اسم المؤسسة ونوع نشاطها وشعارها وألوان مستنداتها.',route:'settings',allowed:ctx.can('manage_settings'),done:!!ctx.brand.name?.trim()&&!!ctx.brand.activity?.trim()},
  {id:'branches',title:'مراجعة الفروع',detail:'راجع بيانات الفرع الرئيسي وأضف فروعًا أخرى عند الحاجة.',route:'branches',allowed:ctx.can('manage_branches'),done:ctx.branches.some(b=>b.active!==false&&!!b.name?.trim())},
  {id:'staff',title:'الموظفون والصلاحيات',detail:'أضف موظفًا وحدد له الفرع والصلاحيات المناسبة.',route:'employees',allowed:ctx.can('manage_team'),done:ctx.users.some(u=>u.active!==false&&u.role!=='owner'&&u.branchIds?.some(has))},
  {id:'materials',title:'المخزون والخامات',detail:'أدخل خامة حقيقية مع وحدة الشراء والمقاسات والتكلفة.',route:'inventory',allowed:ctx.can('manage_inventory'),done:ctx.materials.some(m=>has(m.branchId))},
  {id:'clients',title:'أول عميل',detail:'أضف اسم العميل وبياناته في الفرع المناسب.',route:'clients',allowed:ctx.can('manage_orders'),done:ctx.clients.some(c=>has(c.branchId))},
  {id:'orders',title:'أول أمر عمل',detail:'أنشئ أمرًا يحتوي الصورة والمقاسات وموعد التسليم.',route:'newOrder',allowed:ctx.can('manage_orders'),done:ctx.orders.some(o=>has(o.branchId))}
 ].filter(x=>x.allowed);
}
function progress(items){const count=items.filter(x=>x.done).length,total=items.length;return {count,total,percent:total?Math.round(count/total*100):100};}
function bar(value){return '<div class="awamer-guide-progress" role="progressbar" aria-valuenow="'+value+'" aria-valuemin="0" aria-valuemax="100"><span style="width:'+value+'%"></span></div>';}
function banner(ctx){
 if(!['owner','manager'].includes(ctx.actor?.role))return '';
 const xs=steps(ctx),p=progress(xs);if(!p.total||p.count===p.total)return '';
 return '<section class="awamer-guide-hero"><div class="grow"><div class="eyebrow">دليل البداية داخل أوامر</div><h2>جهز منشأتك في خطوات واضحة</h2><p>أكملت '+p.count+' من '+p.total+' خطوات. افتح الخطوة المتبقية وابدأ تشغيل أول أمر عمل.</p>'+bar(p.percent)+'</div><a class="btn primary" href="#/guide">ابدأ من هنا</a></section>';
}
function page(ctx){
 if(ctx.actor?.role==='employee'){
  return '<div class="awamer-steps"><article class="awamer-step"><span class="step-index">1</span><div><h3>استلم مهمتك</h3><p>من صفحة مهامي راجع العمل والصورة والمقاسات، ثم سجل وقت الاستلام.</p><a class="btn primary" href="#/myWork">فتح مهامي</a></div></article><article class="awamer-step"><span class="step-index">2</span><div><h3>وثق التنفيذ</h3><p>أرفق صور العمل ووقت التنفيذ وأكمل المهمة المسندة إليك.</p><a class="btn" href="#/orders">عرض الأوامر</a></div></article></div>';
 }
 const items=steps(ctx),p=progress(items);
 return '<section class="awamer-guide-hero"><div class="grow"><div class="eyebrow">خطوات الإعداد</div><h2>'+(p.count===p.total?'أكملت الأساسيات، يمكنك بدء التشغيل':'أكمل الأساسيات لتبدأ بثقة')+'</h2><p>يعتمد التقدم على سجلات المنشأة الفعلية، دون إنشاء بيانات تجريبية أو تغيير الصلاحيات.</p>'+bar(p.percent)+'</div><strong>'+p.percent+'%</strong></section>'+
 '<div class="awamer-steps">'+items.map((x,i)=>'<article class="awamer-step '+(x.done?'done':'')+'"><span class="step-index">'+(x.done?'✓':i+1)+'</span><div class="grow"><h3>'+escape(x.title)+'</h3><p>'+escape(x.detail)+'</p><a class="btn '+(x.done?'soft':'primary')+'" href="#/'+escape(x.route)+'">'+(x.done?'مراجعة الخطوة':'فتح الخطوة')+'</a></div></article>').join('')+'</div>'+
 '<section class="card"><h2>بعد أول أمر عمل</h2><p class="mt">اطبع أمر التشغيل للورشة أو افتح عرض السعر للعميل إذا كنت مخولًا بالمالية. من نافذة الطباعة اختر «حفظ بتنسيق PDF» للحصول على مستند A4.</p><div class="row wrap mt"><a class="btn primary" href="#/orders">فتح أوامر العمل</a><a class="btn" href="#/calculators">فتح الحاسبات</a></div></section>';
}
function tip(route){return guideTips[route]||'';}
return {steps,progress,banner,page,tip};
});
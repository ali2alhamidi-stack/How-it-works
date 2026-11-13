/* Original Arabic service catalog and 24px stroke icons for the local operations demo. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.WOCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var standard = ['draft','approval','queued','production','quality','ready','delivered'];
  function service(name, unit, calculator, basePrice, stages) {
    return {name:name, unit:unit, calculator:calculator, basePrice:basePrice, stages:(stages || standard).slice()};
  }
  var categories = [
    {id:'paper',name:'المطبوعات الورقية',icon:'paper',color:'#7C3AED',description:'بطاقات ومطبوعات تجارية بجودة ألوان متسقة مع خيارات الورق والتغليف والتشطيب.',services:[service('بطاقات أعمال','علبة','sheet',85),service('بروشورات ومطويات','نسخة','sheet',3.5),service('دفاتر وسندات وفواتير','دفتر','sheet',18),service('شهادات وملفات عروض','قطعة','sheet',12),service('طباعة تقارير ومشاريع تخرج','نسخة','sheet',25),service('تجليد حراري وسلك','نسخة','general',15)]},
    {id:'banners',name:'البنرات واللوحات الإعلانية',icon:'photo',color:'#0891B2',description:'طباعة بنر وفلكس وقماش ولوحات عرض داخلية وخارجية مع تجهيز الحواف والتثبيت.',services:[service('بنر إعلاني مع تلحيم وعيون','م²','roll',45),service('فلكس للواجهات المضيئة','م²','roll',65),service('رول أب مع القاعدة','قطعة','general',180),service('لوحات فوم وبورد','م²','sheet',95),service('طباعة أحبار UV على خامات صلبة','م²','general',140)]},
    {id:'stickers',name:'الاستيكر والفينيل والملصقات',icon:'scissors',color:'#DB2777',description:'ملصقات منتجات وقص كونتور وتغطيات زجاج ومركبات بحسب السطح ونوع الاستخدام.',services:[service('استيكر منتجات وقص كونتور','م²','roll',75),service('فينيل واجهات وزجاج','م²','roll',90),service('استيكر أرضيات مع حماية','م²','roll',125),service('ملصقات ورقية على شيت','ورقة','sheet',9)]},
    {id:'acrylic',name:'الأكريلك والقص والتشكيل',icon:'cube',color:'#2563EB',description:'قص وحفر وتجميع الأكريلك مع تخطيط الاستفادة من الألواح وتوثيق البواقي.',services:[service('قص أكريلك حسب المقاس','قطعة','sheet',35),service('لوحات أسماء ومكاتب','قطعة','sheet',65),service('حوامل عرض ومنتجات','قطعة','general',140),service('حفر ليزر وتشطيب حواف','قطعة','general',45)]},
    {id:'letters',name:'الحروف البارزة والشعارات',icon:'letter',color:'#7C3AED',description:'حروف أكريلك وستانلس وشعارات مجسمة مع خيارات الإضاءة وتجهيز التركيب.',services:[service('حروف أكريلك بارزة','حرف','letters',160),service('حروف ستانلس','حرف','letters',250),service('شعار مجسم مضاء','شعار','letters',650),service('تجهيز ليدات ومزودات طاقة','مجموعة','led',180)]},
    {id:'stamps',name:'الأختام والطباعة المكتبية',icon:'stamp',color:'#475569',description:'أختام رسمية وشخصية ولوحات بيانات مكتبية مع مراجعة النص والمقاس قبل التنفيذ.',services:[service('ختم أوتوماتيك','قطعة','general',75),service('ختم يدوي خشبي','قطعة','general',40),service('ختم تاريخ وأرقام','قطعة','general',95),service('لوحة اسم مكتبية','قطعة','general',55)]},
    {id:'gifts',name:'الهدايا والدروع التذكارية',icon:'gift',color:'#D97706',description:'تخصيص الهدايا الدعائية والدروع وحقائب المناسبات بالطباعة أو الحفر.',services:[service('طباعة أكواب','قطعة','general',28),service('أقلام وهدايا دعائية','قطعة','general',8),service('دروع تكريم وتخرج','قطعة','general',180),service('طباعة تيشيرتات وحقائب','قطعة','general',45)]},
    {id:'projects',name:'المعارض ومشاريع التخرج',icon:'branch',color:'#0F766E',description:'تنسيق أعمال المعارض ومشاريع التخرج والهوية والفعاليات من الإخراج الفني إلى التسليم.',services:[service('جناح معرض حسب التصميم','مشروع','general',3500),service('خلفيات ومنصات فعاليات','مشروع','general',1800),service('هوية وإرشادات منشأة','مشروع','general',2500),service('ركن تصوير وعرض','مشروع','general',1400),service('تنسيق وإخراج مشروع تخرج','مشروع','general',450)]},
    {id:'models',name:'المجسمات ونماذج العرض',icon:'cube',color:'#9333EA',description:'مجسمات دعائية وتعليمية ونماذج منتجات مصنعة حسب التصميم والخامة.',services:[service('مجسم دعائي ثلاثي الأبعاد','قطعة','general',850),service('نموذج معماري مصغر','مشروع','general',2200),service('ستاند عرض منتجات','قطعة','general',320),service('قص وتجميع فوم وخشب','قطعة','sheet',95)]},
    {id:'flags',name:'الأعلام والرايات والمنسوجات',icon:'flag',color:'#059669',description:'أعلام مكتبية وميدانية ورايات شاطئية مع الأعمدة والقواعد وخيارات القماش.',services:[service('علم قماش مطبوع','م²','roll',85),service('علم شاطئي مع قاعدة','طقم','general',280),service('أعلام مكتبية','قطعة','general',35),service('رايات مناسبات وتعليق','م²','roll',75)]},
    {id:'packaging',name:'التغليف والعلب والأكياس',icon:'package',color:'#B45309',description:'علب وعبوات وأكياس مخصصة مع تخطيط القص والطباعة والتجميع والتعبئة.',services:[service('علب منتجات مطبوعة','قطعة','sheet',12),service('أكياس ورقية بشعار','قطعة','sheet',6),service('سليف وبطاقات تغليف','قطعة','sheet',3),service('تغليف هدايا وتجميع','طقم','general',25),service('داي كت وقوالب قص','قالب','sheet',95)]},
    {id:'installation',name:'التركيب والصيانة الميدانية',icon:'tool',color:'#0369A1',description:'معاينة ورفع مقاسات وتركيب وصيانة لوحات وحروف وإضاءة مع فحص نهائي.',services:[service('معاينة ورفع مقاسات','زيارة','general',150),service('تركيب لوحات وحروف','زيارة','general',450,['draft','queued','production','quality','ready','delivered']),service('صيانة إضاءة ليدات','زيارة','led',220,['draft','queued','production','quality','ready','delivered']),service('فك ونقل وإعادة تركيب','زيارة','general',650)]}
  ];
  var stages = [
    {id:'draft',label:'مسودة',color:'#64748B'},{id:'approval',label:'اعتماد التصميم',color:'#8B5CF6'},
    {id:'queued',label:'بانتظار التنفيذ',color:'#D97706'},{id:'production',label:'قيد التنفيذ',color:'#2563EB'},
    {id:'quality',label:'فحص الجودة',color:'#0891B2'},{id:'ready',label:'جاهز للتسليم',color:'#059669'},
    {id:'delivered',label:'تم التسليم',color:'#16A34A'},{id:'cancelled',label:'ملغي',color:'#DC2626'}
  ];
  var permissions = [
    {id:'view_all_branches',label:'عرض جميع الفروع'},{id:'view_financials',label:'عرض الأسعار والتكاليف'},
    {id:'manage_orders',label:'إدارة أوامر العمل'},{id:'approve_design',label:'اعتماد التصاميم'},
    {id:'manage_production',label:'إدارة الإنتاج'},{id:'manage_inventory',label:'إدارة المخزون والبواقي'},
    {id:'request_purchase',label:'طلب المشتريات'},{id:'approve_purchase',label:'اعتماد المشتريات'},
    {id:'receive_purchase',label:'استلام المشتريات'},{id:'manage_team',label:'إدارة الفريق والصلاحيات'},
    {id:'manage_branches',label:'إدارة الفروع'},{id:'view_reports',label:'عرض التقارير'},
    {id:'view_reviews',label:'عرض تقييمات العملاء'},{id:'manage_settings',label:'إدارة الإعدادات والهوية'}
  ];
  // Original geometric drawings. Caller wraps each fragment in a 24x24 SVG,
  // setting fill="none", stroke="currentColor", stroke-width="1.7" and round caps/joins.
  var icons = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    orders:'<rect x="5" y="4" width="15" height="17" rx="2"/><path d="M9 4V2h7v2M9 9h7M9 13h7M9 17h4M2 7v11"/>',
    production:'<path d="M3 21V9l6 3V8l6 3V3h5l1 18zM7 16v2m5-2v2m5-2v2"/>',
    inventory:'<path d="M3 8h18v13H3zM2 3h20v5H2zM9 12h6M12 12v5"/>',
    remnant:'<path d="M3 3h15l3 3v15H3zM18 3v5h3M8 3v18M3 15h18" stroke-dasharray="3 2"/>',
    purchase:'<path d="M3 3h2l3 12h11l2-8H6M9 19h.01M18 19h.01"/><circle cx="9" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5"/>',
    branch:'<path d="M4 21V4h11v17M15 11h5v10M2 21h20M8 8h3m-3 4h3m-3 4h3M17 15h1m-1 3h1"/>',
    review:'<path d="M8 18H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-7l-5 4z"/><path d="m12 6 1.5 3 3.3.5-2.4 2.3.6 3.2-3-1.5L9 15l.6-3.2-2.4-2.3 3.3-.5z"/>',
    chart:'<path d="M3 3v18h18M7 17v-6m5 6V7m5 10V4"/>',
    calculator:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 5h8v4H8zM8 13h1m6 0h1m-8 4h1m6 0h1M11 13h1m-1 4h1"/>',
    settings:'<path d="m10 3-.7 2.3-2 .9L5 5.6 3 9l1.7 1.7v2.6L3 15l2 3.4 2.3-.6 2 .9L10 21h4l.7-2.3 2-.9 2.3.6 2-3.4-1.7-1.7v-2.6L21 9l-2-3.4-2.3.6-2-.9L14 3z"/><circle cx="12" cy="12" r="3"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    bell:'<path d="M5 16V9a7 7 0 0 1 14 0v7l2 3H3zM10 22h4M12 2V1"/>',
    plus:'<path d="M12 4v16M4 12h16"/>',
    arrow:'<path d="M21 12H3m7-7-7 7 7 7"/>',
    chevron:'<path d="m15 5-7 7 7 7"/>',
    check:'<path d="m4 12 5 5L20 6"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
    print:'<path d="M7 8V3h10v5M7 17H3V8h18v9h-4M7 14h10v8H7zM17 11h1"/>',
    photo:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m3 17 6-5 4 4 3-3 5 5"/>',
    camera:'<path d="M3 7h4l2-3h6l2 3h4v14H3z"/><circle cx="12" cy="13" r="4"/>',
    shield:'<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6zM8 12l3 3 5-6"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff:'<path d="m3 3 18 18M9 5.5c1-.3 2-.5 3-.5 6 0 10 7 10 7a21 21 0 0 1-3.5 4.4M15 18.5c-1 .3-2 .5-3 .5-6 0-10-7-10-7a21 21 0 0 1 3.5-4.4M10 10a3 3 0 0 0 4 4"/>',
    logout:'<path d="M10 3H4v18h6m4-14 5 5-5 5M8 12h12"/>',
    moon:'<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
    menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
    filter:'<path d="M3 4h18l-7 8v7l-4 2v-9z"/>',
    edit:'<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14zM3 22h18"/>',
    trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
    copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    qr:'<path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6zM12 3v3m0 3v3H6m6 3v6M3 12h3m12 0h3m0 0v3"/>',
    star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
    phone:'<path d="m4 3 4-1 3 6-3 2a14 14 0 0 0 6 6l2-3 6 3-1 4c-.3 1.3-2 2-3 2A20 20 0 0 1 2 6c0-1 .7-2.7 2-3z"/>',
    whatsapp:'<path d="M4 17.5A9 9 0 1 1 8 21l-6 1zM8 7l2 3-1.5 1a9 9 0 0 0 4.5 4.5l1-1.5 3 2c-1 3-4 2-7-1s-4-6-2-8z"/>',
    save:'<path d="M3 3h15l3 3v15H3zM7 3v6h10V3M7 21v-8h10v8M14 5v2"/>',
    alert:'<path d="m12 3 10 18H2zM12 9v5m0 3v1"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    package:'<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5v4"/>',
    scissors:'<circle cx="5" cy="6" r="3"/><circle cx="5" cy="18" r="3"/><path d="m7 8 14 13M7 16 21 3M10 12l2 2"/>',
    letter:'<path d="m3 21 7-18h4l7 18M6 14h12"/>',
    lightbulb:'<path d="M8 17c0-3-3-4-3-8a7 7 0 0 1 14 0c0 4-3 5-3 8zM8 20h8m-6 3h4M10 9l2 3 2-3m-2 3v5"/>',
    paper:'<path d="M5 2h10l5 5v15H5zM15 2v6h5M8 12h9m-9 4h9m-9 3h6"/>',
    flag:'<path d="M4 22V3m0 1c5-5 10 5 16 0v10c-6 5-11-5-16 0M2 22h6"/>',
    gift:'<path d="M3 8h18v5H3zM5 13v9h14v-9M12 8v14M12 8C3 8 5 1 9 3c2 1 3 5 3 5s1-4 3-5c4-2 6 5-3 5z"/>',
    stamp:'<path d="M7 12h10l3 5v3H4v-3zM9 12V9C6 5 8 2 12 2s6 3 3 7v3M3 23h18"/>',
    graduate:'<path d="m2 8 10-5 10 5-10 5zM6 10v7c4 3 8 3 12 0v-7M22 8v9l-1 3h2"/>',
    cube:'<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10M8 4l9 5"/>',
    tool:'<path d="M14 3a6 6 0 0 0-7 7l-5 7a3 3 0 0 0 5 5l7-7a6 6 0 0 0 7-7l-4 4-5-5z"/>',
    link:'<path d="m9 15 6-6M8 17l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 7l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 0) scale(.92 1)"/>',
    refresh:'<path d="M20 9a8 8 0 0 0-14-4L3 8m0-6v6h6M4 15a8 8 0 0 0 14 4l3-3m0 6v-6h-6"/>',
    expand:'<path d="M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6M3 3l6 6m6 6 6 6M3 21l6-6m6-6 6-6"/>',
    file:'<path d="M5 2h10l5 5v15H5zM15 2v6h5"/>',
    calendar:'<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M7 2v6m10-6v6M3 11h18M7 15h2m3 0h2m3 0h1M7 18h2m3 0h2"/>',
    wallet:'<path d="M3 6V4h15v4M3 6v14h18V8H5a2 2 0 0 1-2-2zM21 12h-6v5h6M17 14.5h.1"/>'
  };
  return {categories:categories,stages:stages,permissions:permissions,icons:icons,priceNote:'الأسعار أمثلة تجريبية وليست قائمة تسعير معتمدة؛ تضبط حسب الخامة والتشطيب والتكلفة.'};
});

globalThis.WO_CONFIG={"mode": "connected", "version": "2.0.0"};
globalThis.WO_ASSETS={"logo": "/assets/brand.jpg", "appMark": "/assets/app-mark.svg", "systemLogo": "/assets/awamer-identity.svg"};
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

;
/* QRCode for JavaScript — Copyright (c) 2009 Kazuhiko Arase.
 * Source: http://www.d-project.com/ ; vendored from qrcode-terminal 0.12.0.
 * Modified 2026-11-13: bundled with private CommonJS loader; added browser/Node
 * WOQR API, UTF-8 conversion, validation, and SVG rendering. Original QR encoder
 * algorithm retained. QR Code is a registered trademark of DENSO WAVE INCORPORATED.
 *
 * MIT License
 * 
 * Copyright (c) 2009 Kazuhiko Arase
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.WOQR = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
'use strict';
var modules = {
'./QR8bitByte': function(module, exports, require) {
var QRMode = require('./QRMode');

function QR8bitByte(data) {
	this.mode = QRMode.MODE_8BIT_BYTE;
	this.data = data;
}

QR8bitByte.prototype = {

	getLength : function() {
		return this.data.length;
	},
	
	write : function(buffer) {
		for (var i = 0; i < this.data.length; i++) {
			// not JIS ...
			buffer.put(this.data.charCodeAt(i), 8);
		}
	}
};

module.exports = QR8bitByte;

},
'./QRBitBuffer': function(module, exports, require) {
function QRBitBuffer() {
	this.buffer = [];
	this.length = 0;
}

QRBitBuffer.prototype = {

	get : function(index) {
		var bufIndex = Math.floor(index / 8);
		return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
	},
	
	put : function(num, length) {
		for (var i = 0; i < length; i++) {
			this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
		}
	},
	
	getLengthInBits : function() {
		return this.length;
	},
	
	putBit : function(bit) {
	
		var bufIndex = Math.floor(this.length / 8);
		if (this.buffer.length <= bufIndex) {
			this.buffer.push(0);
		}
	
		if (bit) {
			this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
		}
	
		this.length++;
	}
};

module.exports = QRBitBuffer;

},
'./QRErrorCorrectLevel': function(module, exports, require) {
module.exports = {
	L : 1,
	M : 0,
	Q : 3,
	H : 2
};


},
'./QRMaskPattern': function(module, exports, require) {
module.exports = {
	PATTERN000 : 0,
	PATTERN001 : 1,
	PATTERN010 : 2,
	PATTERN011 : 3,
	PATTERN100 : 4,
	PATTERN101 : 5,
	PATTERN110 : 6,
	PATTERN111 : 7
};

},
'./QRMath': function(module, exports, require) {
var QRMath = {

	glog : function(n) {
	
		if (n < 1) {
			throw new Error("glog(" + n + ")");
		}
		
		return QRMath.LOG_TABLE[n];
	},
	
	gexp : function(n) {
	
		while (n < 0) {
			n += 255;
		}
	
		while (n >= 256) {
			n -= 255;
		}
	
		return QRMath.EXP_TABLE[n];
	},
	
	EXP_TABLE : new Array(256),
	
	LOG_TABLE : new Array(256)

};
	
for (var i = 0; i < 8; i++) {
	QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
	QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4]
		^ QRMath.EXP_TABLE[i - 5]
		^ QRMath.EXP_TABLE[i - 6]
		^ QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
	QRMath.LOG_TABLE[QRMath.EXP_TABLE[i] ] = i;
}

module.exports = QRMath;

},
'./QRMode': function(module, exports, require) {
module.exports = {
    MODE_NUMBER :       1 << 0,
    MODE_ALPHA_NUM :    1 << 1,
    MODE_8BIT_BYTE :    1 << 2,
    MODE_KANJI :        1 << 3
};

},
'./QRPolynomial': function(module, exports, require) {
var QRMath = require('./QRMath');

function QRPolynomial(num, shift) {
	if (num.length === undefined) {
		throw new Error(num.length + "/" + shift);
	}

	var offset = 0;

	while (offset < num.length && num[offset] === 0) {
		offset++;
	}

	this.num = new Array(num.length - offset + shift);
	for (var i = 0; i < num.length - offset; i++) {
		this.num[i] = num[i + offset];
	}
}

QRPolynomial.prototype = {

	get : function(index) {
		return this.num[index];
	},
	
	getLength : function() {
		return this.num.length;
	},
	
	multiply : function(e) {
	
		var num = new Array(this.getLength() + e.getLength() - 1);
	
		for (var i = 0; i < this.getLength(); i++) {
			for (var j = 0; j < e.getLength(); j++) {
				num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i) ) + QRMath.glog(e.get(j) ) );
			}
		}
	
		return new QRPolynomial(num, 0);
	},
	
	mod : function(e) {
	
		if (this.getLength() - e.getLength() < 0) {
			return this;
		}
	
		var ratio = QRMath.glog(this.get(0) ) - QRMath.glog(e.get(0) );
	
		var num = new Array(this.getLength() );
		
		for (var i = 0; i < this.getLength(); i++) {
			num[i] = this.get(i);
		}
		
		for (var x = 0; x < e.getLength(); x++) {
			num[x] ^= QRMath.gexp(QRMath.glog(e.get(x) ) + ratio);
		}
	
		// recursive call
		return new QRPolynomial(num, 0).mod(e);
	}
};

module.exports = QRPolynomial;

},
'./QRRSBlock': function(module, exports, require) {
var QRErrorCorrectLevel = require('./QRErrorCorrectLevel');

function QRRSBlock(totalCount, dataCount) {
	this.totalCount = totalCount;
	this.dataCount  = dataCount;
}

QRRSBlock.RS_BLOCK_TABLE = [

	// L
	// M
	// Q
	// H

	// 1
	[1, 26, 19],
	[1, 26, 16],
	[1, 26, 13],
	[1, 26, 9],
	
	// 2
	[1, 44, 34],
	[1, 44, 28],
	[1, 44, 22],
	[1, 44, 16],

	// 3
	[1, 70, 55],
	[1, 70, 44],
	[2, 35, 17],
	[2, 35, 13],

	// 4		
	[1, 100, 80],
	[2, 50, 32],
	[2, 50, 24],
	[4, 25, 9],
	
	// 5
	[1, 134, 108],
	[2, 67, 43],
	[2, 33, 15, 2, 34, 16],
	[2, 33, 11, 2, 34, 12],
	
	// 6
	[2, 86, 68],
	[4, 43, 27],
	[4, 43, 19],
	[4, 43, 15],
	
	// 7		
	[2, 98, 78],
	[4, 49, 31],
	[2, 32, 14, 4, 33, 15],
	[4, 39, 13, 1, 40, 14],
	
	// 8
	[2, 121, 97],
	[2, 60, 38, 2, 61, 39],
	[4, 40, 18, 2, 41, 19],
	[4, 40, 14, 2, 41, 15],
	
	// 9
	[2, 146, 116],
	[3, 58, 36, 2, 59, 37],
	[4, 36, 16, 4, 37, 17],
	[4, 36, 12, 4, 37, 13],
	
	// 10		
	[2, 86, 68, 2, 87, 69],
	[4, 69, 43, 1, 70, 44],
	[6, 43, 19, 2, 44, 20],
	[6, 43, 15, 2, 44, 16],

	// 11
	[4, 101, 81],
	[1, 80, 50, 4, 81, 51],
	[4, 50, 22, 4, 51, 23],
	[3, 36, 12, 8, 37, 13],

	// 12
	[2, 116, 92, 2, 117, 93],
	[6, 58, 36, 2, 59, 37],
	[4, 46, 20, 6, 47, 21],
	[7, 42, 14, 4, 43, 15],

	// 13
	[4, 133, 107],
	[8, 59, 37, 1, 60, 38],
	[8, 44, 20, 4, 45, 21],
	[12, 33, 11, 4, 34, 12],

	// 14
	[3, 145, 115, 1, 146, 116],
	[4, 64, 40, 5, 65, 41],
	[11, 36, 16, 5, 37, 17],
	[11, 36, 12, 5, 37, 13],

	// 15
	[5, 109, 87, 1, 110, 88],
	[5, 65, 41, 5, 66, 42],
	[5, 54, 24, 7, 55, 25],
	[11, 36, 12],

	// 16
	[5, 122, 98, 1, 123, 99],
	[7, 73, 45, 3, 74, 46],
	[15, 43, 19, 2, 44, 20],
	[3, 45, 15, 13, 46, 16],

	// 17
	[1, 135, 107, 5, 136, 108],
	[10, 74, 46, 1, 75, 47],
	[1, 50, 22, 15, 51, 23],
	[2, 42, 14, 17, 43, 15],

	// 18
	[5, 150, 120, 1, 151, 121],
	[9, 69, 43, 4, 70, 44],
	[17, 50, 22, 1, 51, 23],
	[2, 42, 14, 19, 43, 15],

	// 19
	[3, 141, 113, 4, 142, 114],
	[3, 70, 44, 11, 71, 45],
	[17, 47, 21, 4, 48, 22],
	[9, 39, 13, 16, 40, 14],

	// 20
	[3, 135, 107, 5, 136, 108],
	[3, 67, 41, 13, 68, 42],
	[15, 54, 24, 5, 55, 25],
	[15, 43, 15, 10, 44, 16],

	// 21
	[4, 144, 116, 4, 145, 117],
	[17, 68, 42],
	[17, 50, 22, 6, 51, 23],
	[19, 46, 16, 6, 47, 17],

	// 22
	[2, 139, 111, 7, 140, 112],
	[17, 74, 46],
	[7, 54, 24, 16, 55, 25],
	[34, 37, 13],

	// 23
	[4, 151, 121, 5, 152, 122],
	[4, 75, 47, 14, 76, 48],
	[11, 54, 24, 14, 55, 25],
	[16, 45, 15, 14, 46, 16],

	// 24
	[6, 147, 117, 4, 148, 118],
	[6, 73, 45, 14, 74, 46],
	[11, 54, 24, 16, 55, 25],
	[30, 46, 16, 2, 47, 17],

	// 25
	[8, 132, 106, 4, 133, 107],
	[8, 75, 47, 13, 76, 48],
	[7, 54, 24, 22, 55, 25],
	[22, 45, 15, 13, 46, 16],

	// 26
	[10, 142, 114, 2, 143, 115],
	[19, 74, 46, 4, 75, 47],
	[28, 50, 22, 6, 51, 23],
	[33, 46, 16, 4, 47, 17],

	// 27
	[8, 152, 122, 4, 153, 123],
	[22, 73, 45, 3, 74, 46],
	[8, 53, 23, 26, 54, 24],
	[12, 45, 15, 28, 46, 16],

	// 28
	[3, 147, 117, 10, 148, 118],
	[3, 73, 45, 23, 74, 46],
	[4, 54, 24, 31, 55, 25],
	[11, 45, 15, 31, 46, 16],

	// 29
	[7, 146, 116, 7, 147, 117],
	[21, 73, 45, 7, 74, 46],
	[1, 53, 23, 37, 54, 24],
	[19, 45, 15, 26, 46, 16],

	// 30
	[5, 145, 115, 10, 146, 116],
	[19, 75, 47, 10, 76, 48],
	[15, 54, 24, 25, 55, 25],
	[23, 45, 15, 25, 46, 16],

	// 31
	[13, 145, 115, 3, 146, 116],
	[2, 74, 46, 29, 75, 47],
	[42, 54, 24, 1, 55, 25],
	[23, 45, 15, 28, 46, 16],

	// 32
	[17, 145, 115],
	[10, 74, 46, 23, 75, 47],
	[10, 54, 24, 35, 55, 25],
	[19, 45, 15, 35, 46, 16],

	// 33
	[17, 145, 115, 1, 146, 116],
	[14, 74, 46, 21, 75, 47],
	[29, 54, 24, 19, 55, 25],
	[11, 45, 15, 46, 46, 16],

	// 34
	[13, 145, 115, 6, 146, 116],
	[14, 74, 46, 23, 75, 47],
	[44, 54, 24, 7, 55, 25],
	[59, 46, 16, 1, 47, 17],

	// 35
	[12, 151, 121, 7, 152, 122],
	[12, 75, 47, 26, 76, 48],
	[39, 54, 24, 14, 55, 25],
	[22, 45, 15, 41, 46, 16],

	// 36
	[6, 151, 121, 14, 152, 122],
	[6, 75, 47, 34, 76, 48],
	[46, 54, 24, 10, 55, 25],
	[2, 45, 15, 64, 46, 16],

	// 37
	[17, 152, 122, 4, 153, 123],
	[29, 74, 46, 14, 75, 47],
	[49, 54, 24, 10, 55, 25],
	[24, 45, 15, 46, 46, 16],

	// 38
	[4, 152, 122, 18, 153, 123],
	[13, 74, 46, 32, 75, 47],
	[48, 54, 24, 14, 55, 25],
	[42, 45, 15, 32, 46, 16],

	// 39
	[20, 147, 117, 4, 148, 118],
	[40, 75, 47, 7, 76, 48],
	[43, 54, 24, 22, 55, 25],
	[10, 45, 15, 67, 46, 16],

	// 40
	[19, 148, 118, 6, 149, 119],
	[18, 75, 47, 31, 76, 48],
	[34, 54, 24, 34, 55, 25],
	[20, 45, 15, 61, 46, 16]
];

QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
	
	var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
	
	if (rsBlock === undefined) {
		throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
	}

	var length = rsBlock.length / 3;
	
	var list = [];
	
	for (var i = 0; i < length; i++) {

		var count = rsBlock[i * 3 + 0];
		var totalCount = rsBlock[i * 3 + 1];
		var dataCount  = rsBlock[i * 3 + 2];

		for (var j = 0; j < count; j++) {
			list.push(new QRRSBlock(totalCount, dataCount) );	
		}
	}
	
	return list;
};

QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {

	switch(errorCorrectLevel) {
	case QRErrorCorrectLevel.L :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
	case QRErrorCorrectLevel.M :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
	case QRErrorCorrectLevel.Q :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
	case QRErrorCorrectLevel.H :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
	default :
		return undefined;
	}
};

module.exports = QRRSBlock;

},
'./QRUtil': function(module, exports, require) {
var QRMode = require('./QRMode');
var QRPolynomial = require('./QRPolynomial');
var QRMath = require('./QRMath');
var QRMaskPattern = require('./QRMaskPattern');

var QRUtil = {

    PATTERN_POSITION_TABLE : [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],        
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
    ],

    G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)    | (1 << 4) | (1 << 1),

    getBCHTypeInfo : function(data) {
        var d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
            d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) ) );    
        }
        return ( (data << 10) | d) ^ QRUtil.G15_MASK;
    },

    getBCHTypeNumber : function(data) {
        var d = data << 12;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
            d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) ) );    
        }
        return (data << 12) | d;
    },

    getBCHDigit : function(data) {

        var digit = 0;

        while (data !== 0) {
            digit++;
            data >>>= 1;
        }

        return digit;
    },

    getPatternPosition : function(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },

    getMask : function(maskPattern, i, j) {
        
        switch (maskPattern) {
            
        case QRMaskPattern.PATTERN000 : return (i + j) % 2 === 0;
        case QRMaskPattern.PATTERN001 : return i % 2 === 0;
        case QRMaskPattern.PATTERN010 : return j % 3 === 0;
        case QRMaskPattern.PATTERN011 : return (i + j) % 3 === 0;
        case QRMaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 === 0;
        case QRMaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 === 0;
        case QRMaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 === 0;
        case QRMaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 === 0;

        default :
            throw new Error("bad maskPattern:" + maskPattern);
        }
    },

    getErrorCorrectPolynomial : function(errorCorrectLength) {

        var a = new QRPolynomial([1], 0);

        for (var i = 0; i < errorCorrectLength; i++) {
            a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0) );
        }

        return a;
    },

    getLengthInBits : function(mode, type) {

        if (1 <= type && type < 10) {

            // 1 - 9

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 10;
            case QRMode.MODE_ALPHA_NUM  : return 9;
            case QRMode.MODE_8BIT_BYTE  : return 8;
            case QRMode.MODE_KANJI      : return 8;
            default :
                throw new Error("mode:" + mode);
            }

        } else if (type < 27) {

            // 10 - 26

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 12;
            case QRMode.MODE_ALPHA_NUM  : return 11;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 10;
            default :
                throw new Error("mode:" + mode);
            }

        } else if (type < 41) {

            // 27 - 40

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 14;
            case QRMode.MODE_ALPHA_NUM  : return 13;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 12;
            default :
                throw new Error("mode:" + mode);
            }

        } else {
            throw new Error("type:" + type);
        }
    },

    getLostPoint : function(qrCode) {
        
        var moduleCount = qrCode.getModuleCount();
        var lostPoint = 0;
        var row = 0; 
        var col = 0;

        
        // LEVEL1
        
        for (row = 0; row < moduleCount; row++) {

            for (col = 0; col < moduleCount; col++) {

                var sameCount = 0;
                var dark = qrCode.isDark(row, col);

                for (var r = -1; r <= 1; r++) {

                    if (row + r < 0 || moduleCount <= row + r) {
                        continue;
                    }

                    for (var c = -1; c <= 1; c++) {

                        if (col + c < 0 || moduleCount <= col + c) {
                            continue;
                        }

                        if (r === 0 && c === 0) {
                            continue;
                        }

                        if (dark === qrCode.isDark(row + r, col + c) ) {
                            sameCount++;
                        }
                    }
                }

                if (sameCount > 5) {
                    lostPoint += (3 + sameCount - 5);
                }
            }
        }

        // LEVEL2

        for (row = 0; row < moduleCount - 1; row++) {
            for (col = 0; col < moduleCount - 1; col++) {
                var count = 0;
                if (qrCode.isDark(row,     col    ) ) count++;
                if (qrCode.isDark(row + 1, col    ) ) count++;
                if (qrCode.isDark(row,     col + 1) ) count++;
                if (qrCode.isDark(row + 1, col + 1) ) count++;
                if (count === 0 || count === 4) {
                    lostPoint += 3;
                }
            }
        }

        // LEVEL3

        for (row = 0; row < moduleCount; row++) {
            for (col = 0; col < moduleCount - 6; col++) {
                if (qrCode.isDark(row, col) && 
                        !qrCode.isDark(row, col + 1) && 
                         qrCode.isDark(row, col + 2) && 
                         qrCode.isDark(row, col + 3) && 
                         qrCode.isDark(row, col + 4) && 
                        !qrCode.isDark(row, col + 5) && 
                         qrCode.isDark(row, col + 6) ) {
                    lostPoint += 40;
                }
            }
        }

        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount - 6; row++) {
                if (qrCode.isDark(row, col) &&
                        !qrCode.isDark(row + 1, col) &&
                         qrCode.isDark(row + 2, col) &&
                         qrCode.isDark(row + 3, col) &&
                         qrCode.isDark(row + 4, col) &&
                        !qrCode.isDark(row + 5, col) &&
                         qrCode.isDark(row + 6, col) ) {
                    lostPoint += 40;
                }
            }
        }

        // LEVEL4
        
        var darkCount = 0;

        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount; row++) {
                if (qrCode.isDark(row, col) ) {
                    darkCount++;
                }
            }
        }
        
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;

        return lostPoint;       
    }

};

module.exports = QRUtil;

},
'./index': function(module, exports, require) {
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of 
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
// Modified to work in node for this project (and some refactoring)
//---------------------------------------------------------------------

var QR8bitByte = require('./QR8bitByte');
var QRUtil = require('./QRUtil');
var QRPolynomial = require('./QRPolynomial');
var QRRSBlock = require('./QRRSBlock');
var QRBitBuffer = require('./QRBitBuffer');

function QRCode(typeNumber, errorCorrectLevel) {
	this.typeNumber = typeNumber;
	this.errorCorrectLevel = errorCorrectLevel;
	this.modules = null;
	this.moduleCount = 0;
	this.dataCache = null;
	this.dataList = [];
}

QRCode.prototype = {
	
	addData : function(data) {
		var newData = new QR8bitByte(data);
		this.dataList.push(newData);
		this.dataCache = null;
	},
	
	isDark : function(row, col) {
		if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
			throw new Error(row + "," + col);
		}
		return this.modules[row][col];
	},

	getModuleCount : function() {
		return this.moduleCount;
	},
	
	make : function() {
		// Calculate automatically typeNumber if provided is < 1
		if (this.typeNumber < 1 ){
			var typeNumber = 1;
			for (typeNumber = 1; typeNumber < 40; typeNumber++) {
				var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);

				var buffer = new QRBitBuffer();
				var totalDataCount = 0;
				for (var i = 0; i < rsBlocks.length; i++) {
					totalDataCount += rsBlocks[i].dataCount;
				}

				for (var x = 0; x < this.dataList.length; x++) {
					var data = this.dataList[x];
					buffer.put(data.mode, 4);
					buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
					data.write(buffer);
				}
				if (buffer.getLengthInBits() <= totalDataCount * 8)
					break;
			}
			this.typeNumber = typeNumber;
		}
		this.makeImpl(false, this.getBestMaskPattern() );
	},
	
	makeImpl : function(test, maskPattern) {
		
		this.moduleCount = this.typeNumber * 4 + 17;
		this.modules = new Array(this.moduleCount);
		
		for (var row = 0; row < this.moduleCount; row++) {
			
			this.modules[row] = new Array(this.moduleCount);
			
			for (var col = 0; col < this.moduleCount; col++) {
				this.modules[row][col] = null;//(col + row) % 3;
			}
		}
	
		this.setupPositionProbePattern(0, 0);
		this.setupPositionProbePattern(this.moduleCount - 7, 0);
		this.setupPositionProbePattern(0, this.moduleCount - 7);
		this.setupPositionAdjustPattern();
		this.setupTimingPattern();
		this.setupTypeInfo(test, maskPattern);
		
		if (this.typeNumber >= 7) {
			this.setupTypeNumber(test);
		}
	
		if (this.dataCache === null) {
			this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
		}
	
		this.mapData(this.dataCache, maskPattern);
	},

	setupPositionProbePattern : function(row, col)  {
		
		for (var r = -1; r <= 7; r++) {
			
			if (row + r <= -1 || this.moduleCount <= row + r) continue;
			
			for (var c = -1; c <= 7; c++) {
				
				if (col + c <= -1 || this.moduleCount <= col + c) continue;
				
				if ( (0 <= r && r <= 6 && (c === 0 || c === 6) ) || 
                     (0 <= c && c <= 6 && (r === 0 || r === 6) ) || 
                     (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
					this.modules[row + r][col + c] = true;
				} else {
					this.modules[row + r][col + c] = false;
				}
			}		
		}		
	},
	
	getBestMaskPattern : function() {
	
		var minLostPoint = 0;
		var pattern = 0;
	
		for (var i = 0; i < 8; i++) {
			
			this.makeImpl(true, i);
	
			var lostPoint = QRUtil.getLostPoint(this);
	
			if (i === 0 || minLostPoint >  lostPoint) {
				minLostPoint = lostPoint;
				pattern = i;
			}
		}
	
		return pattern;
	},
	
	createMovieClip : function(target_mc, instance_name, depth) {
	
		var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
		var cs = 1;
	
		this.make();

		for (var row = 0; row < this.modules.length; row++) {
			
			var y = row * cs;
			
			for (var col = 0; col < this.modules[row].length; col++) {
	
				var x = col * cs;
				var dark = this.modules[row][col];
			
				if (dark) {
					qr_mc.beginFill(0, 100);
					qr_mc.moveTo(x, y);
					qr_mc.lineTo(x + cs, y);
					qr_mc.lineTo(x + cs, y + cs);
					qr_mc.lineTo(x, y + cs);
					qr_mc.endFill();
				}
			}
		}
		
		return qr_mc;
	},

	setupTimingPattern : function() {
		
		for (var r = 8; r < this.moduleCount - 8; r++) {
			if (this.modules[r][6] !== null) {
				continue;
			}
			this.modules[r][6] = (r % 2 === 0);
		}
	
		for (var c = 8; c < this.moduleCount - 8; c++) {
			if (this.modules[6][c] !== null) {
				continue;
			}
			this.modules[6][c] = (c % 2 === 0);
		}
	},
	
	setupPositionAdjustPattern : function() {
	
		var pos = QRUtil.getPatternPosition(this.typeNumber);
		
		for (var i = 0; i < pos.length; i++) {
		
			for (var j = 0; j < pos.length; j++) {
			
				var row = pos[i];
				var col = pos[j];
				
				if (this.modules[row][col] !== null) {
					continue;
				}
				
				for (var r = -2; r <= 2; r++) {
				
					for (var c = -2; c <= 2; c++) {
					
						if (Math.abs(r) === 2 || 
                            Math.abs(c) === 2 ||
                            (r === 0 && c === 0) ) {
							this.modules[row + r][col + c] = true;
						} else {
							this.modules[row + r][col + c] = false;
						}
					}
				}
			}
		}
	},
	
	setupTypeNumber : function(test) {
	
		var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        var mod;
	
		for (var i = 0; i < 18; i++) {
			mod = (!test && ( (bits >> i) & 1) === 1);
			this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
		}
	
		for (var x = 0; x < 18; x++) {
			mod = (!test && ( (bits >> x) & 1) === 1);
			this.modules[x % 3 + this.moduleCount - 8 - 3][Math.floor(x / 3)] = mod;
		}
	},
	
	setupTypeInfo : function(test, maskPattern) {
	
		var data = (this.errorCorrectLevel << 3) | maskPattern;
		var bits = QRUtil.getBCHTypeInfo(data);
        var mod;
	
		// vertical		
		for (var v = 0; v < 15; v++) {
	
			mod = (!test && ( (bits >> v) & 1) === 1);
	
			if (v < 6) {
				this.modules[v][8] = mod;
			} else if (v < 8) {
				this.modules[v + 1][8] = mod;
			} else {
				this.modules[this.moduleCount - 15 + v][8] = mod;
			}
		}
	
		// horizontal
		for (var h = 0; h < 15; h++) {
	
			mod = (!test && ( (bits >> h) & 1) === 1);
			
			if (h < 8) {
				this.modules[8][this.moduleCount - h - 1] = mod;
			} else if (h < 9) {
				this.modules[8][15 - h - 1 + 1] = mod;
			} else {
				this.modules[8][15 - h - 1] = mod;
			}
		}
	
		// fixed module
		this.modules[this.moduleCount - 8][8] = (!test);
	
	},
	
	mapData : function(data, maskPattern) {
		
		var inc = -1;
		var row = this.moduleCount - 1;
		var bitIndex = 7;
		var byteIndex = 0;
		
		for (var col = this.moduleCount - 1; col > 0; col -= 2) {
	
			if (col === 6) col--;
	
			while (true) {
	
				for (var c = 0; c < 2; c++) {
					
					if (this.modules[row][col - c] === null) {
						
						var dark = false;
	
						if (byteIndex < data.length) {
							dark = ( ( (data[byteIndex] >>> bitIndex) & 1) === 1);
						}
	
						var mask = QRUtil.getMask(maskPattern, row, col - c);
	
						if (mask) {
							dark = !dark;
						}
						
						this.modules[row][col - c] = dark;
						bitIndex--;
	
						if (bitIndex === -1) {
							byteIndex++;
							bitIndex = 7;
						}
					}
				}
								
				row += inc;
	
				if (row < 0 || this.moduleCount <= row) {
					row -= inc;
					inc = -inc;
					break;
				}
			}
		}
		
	}

};

QRCode.PAD0 = 0xEC;
QRCode.PAD1 = 0x11;

QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
	
	var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
	
	var buffer = new QRBitBuffer();
	
	for (var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		buffer.put(data.mode, 4);
		buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
		data.write(buffer);
	}

	// calc num max data.
	var totalDataCount = 0;
	for (var x = 0; x < rsBlocks.length; x++) {
		totalDataCount += rsBlocks[x].dataCount;
	}

	if (buffer.getLengthInBits() > totalDataCount * 8) {
		throw new Error("code length overflow. (" + 
            buffer.getLengthInBits() + 
            ">" +  
            totalDataCount * 8 + 
            ")");
	}

	// end code
	if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
		buffer.put(0, 4);
	}

	// padding
	while (buffer.getLengthInBits() % 8 !== 0) {
		buffer.putBit(false);
	}

	// padding
	while (true) {
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD0, 8);
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD1, 8);
	}

	return QRCode.createBytes(buffer, rsBlocks);
};

QRCode.createBytes = function(buffer, rsBlocks) {

	var offset = 0;
	
	var maxDcCount = 0;
	var maxEcCount = 0;
	
	var dcdata = new Array(rsBlocks.length);
	var ecdata = new Array(rsBlocks.length);
	
	for (var r = 0; r < rsBlocks.length; r++) {

		var dcCount = rsBlocks[r].dataCount;
		var ecCount = rsBlocks[r].totalCount - dcCount;

		maxDcCount = Math.max(maxDcCount, dcCount);
		maxEcCount = Math.max(maxEcCount, ecCount);
		
		dcdata[r] = new Array(dcCount);
		
		for (var i = 0; i < dcdata[r].length; i++) {
			dcdata[r][i] = 0xff & buffer.buffer[i + offset];
		}
		offset += dcCount;
		
		var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
		var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);

		var modPoly = rawPoly.mod(rsPoly);
		ecdata[r] = new Array(rsPoly.getLength() - 1);
		for (var x = 0; x < ecdata[r].length; x++) {
            var modIndex = x + modPoly.getLength() - ecdata[r].length;
			ecdata[r][x] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
		}

	}
	
	var totalCodeCount = 0;
	for (var y = 0; y < rsBlocks.length; y++) {
		totalCodeCount += rsBlocks[y].totalCount;
	}

	var data = new Array(totalCodeCount);
	var index = 0;

	for (var z = 0; z < maxDcCount; z++) {
		for (var s = 0; s < rsBlocks.length; s++) {
			if (z < dcdata[s].length) {
				data[index++] = dcdata[s][z];
			}
		}
	}

	for (var xx = 0; xx < maxEcCount; xx++) {
		for (var t = 0; t < rsBlocks.length; t++) {
			if (xx < ecdata[t].length) {
				data[index++] = ecdata[t][xx];
			}
		}
	}

	return data;

};

module.exports = QRCode;

}
};
var cache = {};
function internalRequire(name) {
  if (!modules[name]) throw new Error('Unknown internal QR module');
  if (!cache[name]) {
    var local = {exports:{}};
    cache[name] = local;
    modules[name](local, local.exports, internalRequire);
  }
  return cache[name].exports;
}
var QRCode = internalRequire('./index');
var levels = internalRequire('./QRErrorCorrectLevel');
function byteString(text) {
  if (typeof text !== 'string' || !text.length) throw new Error('أدخل نصا أو رابطا لإنشاء رمز QR.');
  var encoded;
  try {
    // A byte-mode QR needs UTF-8 bytes, not UTF-16 code units. Percent escapes
    // become bytes; ASCII characters retain their exact value, including %.
    encoded = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });
  } catch (err) { throw new Error('النص يحتوي على أحرف غير صالحة.'); }
  if (encoded.length > 2300) throw new Error('رابط QR طويل جدا؛ الحد 2300 بايت بترميز UTF-8.');
  return encoded;
}
function matrix(text) {
  var qr = new QRCode(-1, levels.M);
  qr.addData(byteString(text));
  qr.make();
  return qr.modules.map(function (row) { return row.map(function (cell) { return !!cell; }); });
}
function svg(text, options) {
  options = options || {};
  var size = options.size === undefined ? 240 : Number(options.size);
  var margin = options.margin === undefined ? 4 : Number(options.margin);
  if (!Number.isFinite(size) || size < 32 || size > 4096) throw new Error('حجم رمز QR يجب أن يكون بين 32 و4096.');
  if (!Number.isFinite(margin) || margin < 0 || margin > 64) throw new Error('هامش رمز QR غير صالح.');
  // A requested smaller margin never removes the required four-module quiet zone.
  margin = Math.max(4, Math.ceil(margin));
  var cells = matrix(text), n = cells.length, edge = n + margin * 2, paths = [];
  for (var y = 0; y < n; y++) {
    var x = 0;
    while (x < n) {
      if (!cells[y][x]) { x++; continue; }
      var start = x;
      while (x < n && cells[y][x]) x++;
      var run = x - start;
      paths.push('M' + (start + margin) + ' ' + (y + margin) + 'h' + run + 'v1h-' + run + 'z');
    }
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+edge+' '+edge+'" width="'+size+'" height="'+size+'" role="img" aria-label="رمز QR" shape-rendering="crispEdges"><rect width="'+edge+'" height="'+edge+'" fill="#fff"/><path d="'+paths.join('')+'" fill="#000"/></svg>';
}
return {svg:svg,matrix:matrix};
});

;
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.WOCalc = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const EPS = 1e-9;
  const MAX_COUNT = 1000000;
  const PREVIEW_LIMIT = 5000;
  const r = value => Math.round((value + Number.EPSILON) * 100) / 100;
  const precise = value => Math.round(value * 1e9) / 1e9;
  function number(value, label, options) {
    const o = options || {};
    if (value === undefined && o.default !== undefined) value = o.default;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < (o.positive ? 0.001 : 0) || value > (o.max || 1e12) || (o.integer && !Number.isInteger(value))) {
      throw new Error(label + ': أدخل رقما ' + (o.positive ? 'موجبا ' : 'غير سالب ') + (o.integer ? 'صحيحا ' : '') + 'ضمن النطاق المسموح');
    }
    return value;
  }
  const cost = (v, label) => number(v, label, {default:0});
  const count = (v, label) => number(v, label, {positive:true,integer:true,max:MAX_COUNT});
  const cm = (v, label) => number(v, label, {positive:true,max:1000000});
  const meters = (v, label) => number(v, label, {positive:true,max:10000});
  const markupOf = v => number(v, 'نسبة الإضافة على التكلفة', {default:35,max:10000});
  const entry = (label, value) => ({label, value:r(value)});
  function price(total, quantity, markup, quotedPrice) {
    const sale = quotedPrice === undefined ? total * (1 + markup / 100) : quotedPrice;
    if (!Number.isFinite(sale) || !Number.isFinite(total) || sale > 1e15 || total > 1e15) throw new Error('القيمة المحسوبة تتجاوز نطاق الحاسبة');
    return {totalCost:r(total),unitCost:r(total/quantity),suggestedPrice:r(sale),unitSuggestedPrice:r(sale/quantity),profit:r(sale-total),marginPercent:sale ? r((sale-total)/sale*100) : 0,markupPercent:markup};
  }
  function sheet(p) {
    p = p || {};
    const sheetW=cm(p.sheetW,'عرض اللوح'), sheetH=cm(p.sheetH,'طول اللوح');
    const pieceW=cm(p.pieceW,'عرض القطعة'), pieceH=cm(p.pieceH,'طول القطعة'), quantity=count(p.quantity,'الكمية');
    const gap=number(p.gap,'فاصل القطع',{default:0,max:1000000}), margin=number(p.margin,'هامش الحواف',{default:0,max:1000000}), bleed=number(p.bleed,'نزف الطباعة',{default:0,max:1000000});
    const usableW=sheetW-2*margin, usableH=sheetH-2*margin;
    function grid(rotated) {
      const w=(rotated?pieceH:pieceW)+2*bleed, h=(rotated?pieceW:pieceH)+2*bleed;
      const columns=Math.max(0,Math.floor((usableW+gap+EPS)/(w+gap))),rows=Math.max(0,Math.floor((usableH+gap+EPS)/(h+gap)));
      return {rotated,columns,rows,capacity:columns*rows,w,h};
    }
    let best=grid(false);
    if (p.allowRotate!==false) {const other=grid(true);if(other.capacity>best.capacity)best=other;}
    if (!best.capacity || usableW<=0 || usableH<=0) throw new Error('لا يتسع مقاس القطعة داخل اللوح بعد الهامش والنزف');
    if (best.capacity>MAX_COUNT) throw new Error('عدد القطع في اللوح يتجاوز نطاق الحاسبة');
    const sheets=Math.ceil(quantity/best.capacity),totalArea=sheets*sheetW*sheetH,usedArea=quantity*pieceW*pieceH;
    const wasteArea=Math.max(0,totalArea-usedArea);
    const material=cost(p.sheetCost,'تكلفة اللوح')*sheets,cutting=cost(p.cutCost,'القطع لكل قطعة')*quantity,setup=cost(p.setupCost,'التجهيز'),labor=cost(p.laborCost,'العمل');
    const placements=[];
    const shown=Math.min(quantity,best.capacity,PREVIEW_LIMIT);
    for(let i=0;i<shown;i++)placements.push({index:i+1,x:precise(margin+bleed+(i%best.columns)*(best.w+gap)),y:precise(margin+bleed+Math.floor(i/best.columns)*(best.h+gap)),width:best.w-2*bleed,height:best.h-2*bleed});
    return Object.assign({columns:best.columns,rows:best.rows,perSheet:best.capacity,sheets,rotated:best.rotated,usedArea:precise(usedArea),totalArea:precise(totalArea),wasteArea:precise(wasteArea),wastePercent:r(wasteArea/totalArea*100),layout:{sheetW,sheetH,pieceW,pieceH,columns:best.columns,rows:best.rows,gap,margin,bleed,rotated:best.rotated,placements,previewTruncated:shown<Math.min(quantity,best.capacity)},breakdown:[entry('ألواح كاملة',material),entry('قطع القطع المطلوبة',cutting),entry('تجهيز الدفعة',setup),entry('عمل الدفعة',labor)],notes:['شبكة مستطيلة باتجاه موحد؛ نقارن اتجاهين فقط، وليست تعشيقا مثاليا أو مسار CNC.','الهدر يشمل باقي الألواح والنزف والهامش والفواصل؛ تتم فوترة آخر لوح كاملا.','الهامش والفاصل قيم تشغيلية تدخل حسب الماكينة والخامة.']},price(material+cutting+setup+labor,quantity,markupOf(p.markup)));
  }
  function roll(p) {
    p=p||{};
    const rollWidth=meters(p.rollWidth,'عرض الرول'),length=meters(p.length,'طول التصميم'),width=meters(p.width,'عرض التصميم'),quantity=count(p.quantity,'الكمية');
    const extra=number(p.wastePercent,'هدر التشغيل',{default:0,max:1000});
    const candidates=[];
    for(const rotated of [false,true]){const across=rotated?length:width,along=rotated?width:length,columns=Math.floor((rollWidth+EPS)/across);if(columns>0)candidates.push({rotated,columns,rows:Math.ceil(quantity/columns),across,along,baseLength:Math.ceil(quantity/columns)*along});}
    if(!candidates.length)throw new Error('مقاس التصميم أكبر من عرض الرول في الاتجاهين؛ التقسيم غير محسوب');
    candidates.sort((a,b)=>a.baseLength-b.baseLength||Number(a.rotated)-Number(b.rotated));
    const best=candidates[0],area=length*width*quantity,linearMeters=best.baseLength*(1+extra/100),consumedArea=rollWidth*linearMeters;
    const inkMl=area*(1+extra/100)*cost(p.inkMlPerM2,'ملل الحبر لكل متر مربع');
    const media=consumedArea*cost(p.mediaCostPerM2,'الخامة لكل متر مربع'),ink=inkMl*cost(p.inkCostPerMl,'تكلفة ملل الحبر'),finishing=area*cost(p.finishingPerM2,'التشطيب لكل متر مربع'),setup=cost(p.setupCost,'التجهيز'),labor=cost(p.laborCost,'العمل');
    return Object.assign({area:precise(area),consumedArea:precise(consumedArea),linearMeters:precise(linearMeters),inkMl:precise(inkMl),rotated:best.rotated,columns:best.columns,rows:best.rows,wasteArea:precise(consumedArea-area),wastePercent:r((consumedArea-area)/consumedArea*100),layout:{rollWidth,length,width,columns:best.columns,rows:best.rows,rotated:best.rotated,pieceW:best.across,pieceH:best.along,baseLength:best.baseLength},breakdown:[entry('خامة بعرض الرول الكامل',media),entry('حبر الطباعة مع هدر التشغيل',ink),entry('تشطيب المساحة الصافية',finishing),entry('تجهيز الدفعة',setup),entry('عمل الدفعة',labor)],notes:['تتم المقارنة بين اتجاهين لاختيار أقل طول مستهلك؛ لا يوجد تقسيم تلقائي للتصميم.','استهلاك الخامة يشمل العرض الكامل للرول وآخر صف وهدر التشغيل؛ الحبر على مساحة الطباعة مع هدر التشغيل والتشطيب على المساحة الصافية.','لا تشمل الأبعاد تلقائيا هوامش الماكينة أو علامات القص؛ أدخل المقاس التشغيلي المعتمد.']},price(media+ink+finishing+setup+labor,quantity,markupOf(p.markup)));
  }
  function letters(p) {
    p=p||{};
    const height=meters(p.height,'ارتفاع الحرف بالمتر'),quantity=count(p.count,'عدد الحروف أو الشعارات'),rate=cost(p.rate,'سعر المتر'),minimum=number(p.minHeight,'الحد الأدنى للارتفاع',{positive:true,default:1,max:10000});
    const multiplier=p.logo?number(p.logoMultiplier,'معامل الشعار',{positive:true,default:2,max:100}):1;
    const billableHeight=p.roundUp?Math.ceil(Math.max(minimum,height)):Math.max(minimum,height),billableMeters=billableHeight*quantity*multiplier,total=cost(p.cost,'إجمالي التكلفة'),markup=markupOf(p.markup);
    const suggested=rate>0?billableMeters*rate:undefined;
    return Object.assign({billableHeight,billableMeters:precise(billableMeters),rule:'أكبر قيمة بين الارتفاع والحد الأدنى × العدد × معامل الشعار × سعر المتر',breakdown:[entry('أمتار الاحتساب',billableMeters),entry('إجمالي التكلفة المباشرة',total)],notes:['الحد الأدنى الافتراضي متر لكل حرف؛ نصف متر يحتسب مترا. الشعار بمعامل ٢ حتى عند ارتفاع متر.','الارتفاع فوق متر يحتسب بقيمته الفعلية؛ التقريب للمتر الأعلى يعمل فقط عند تفعيله.','السعر المدخل للمتر يحكم عرض السعر؛ عند كونه صفرا تستخدم التكلفة مع نسبة الإضافة.']},price(total,quantity,markup,suggested));
  }
  function led(p) {
    p=p||{};
    if(p.mode!=='module'&&p.mode!=='strip')throw new Error('اختر وضع وحدات LED أو الشريط');
    const voltage=number(p.voltage,'الجهد',{positive:true,max:1000}),supplyWatts=number(p.powerSupplyWatts,'قدرة مزود الطاقة',{positive:true,max:1000000}),load=number(p.loadPercent,'نسبة تحميل المزود',{positive:true,default:80,max:100}),usableWatts=supplyWatts*load/100;
    const maxPerChain=p.maxPerChain===undefined?50:count(p.maxPerChain,'أقصى عدد في مجموعة التوصيل'),unitPrice=cost(p.unitPrice,'سعر الوحدة أو الرول'),supplyPrice=cost(p.powerSupplyPrice,'سعر مزود الطاقة');
    let n=0,rows=0,columns=0,stripLength=0,rolls=0,totalWatts=0,layout={},units=[];
    if(p.mode==='module') {
      const watts=number(p.wattsPerUnit,'واط لكل وحدة',{positive:true,max:1000000});
      if(watts>usableWatts+EPS)throw new Error('قدرة وحدة واحدة تتجاوز قدرة مزود الطاقة المسموح بها');
      const width=cm(p.width,'عرض اللوحة'),height=cm(p.height,'ارتفاع اللوحة'),edge=number(p.edge,'بعد الوحدات عن الحافة',{default:0,max:1000000});
      if(width<2*edge||height<2*edge)throw new Error('مقاس اللوحة لا يتسع لبعد الحافة');
      let spacingX=0,spacingY=0;
      if(p.manualCount!==undefined){n=count(p.manualCount,'عدد الوحدات اليدوي');columns=Math.ceil(Math.sqrt(n*width/height));columns=Math.max(1,Math.min(columns,n));rows=Math.ceil(n/columns);}
      else {spacingX=cm(p.spacingX,'التباعد الأفقي'),spacingY=cm(p.spacingY,'التباعد الرأسي');columns=Math.floor((width-2*edge+EPS)/spacingX)+1;rows=Math.floor((height-2*edge+EPS)/spacingY)+1;n=count(columns*rows,'عدد الوحدات المحسوب');}
      const dx=p.manualCount!==undefined?(columns>1?(width-2*edge)/(columns-1):0):spacingX,dy=p.manualCount!==undefined?(rows>1?(height-2*edge)/(rows-1):0):spacingY;
      const startX=(width-(columns-1)*dx)/2,startY=(height-(rows-1)*dy)/2,placements=[];
      for(let i=0;i<Math.min(n,PREVIEW_LIMIT);i++)placements.push({index:i+1,x:precise(startX+(i%columns)*dx),y:precise(startY+Math.floor(i/columns)*dy)});
      layout={width,height,edge,spacingX:dx,spacingY:dy,columns,rows,manual:p.manualCount!==undefined,placements,previewTruncated:n>PREVIEW_LIMIT};
      // Group mathematically instead of allocating one object per module.
      const perSupply=Math.floor((usableWatts+EPS)/watts),supplies=Math.ceil(n/perSupply);
      if(supplies>10000)throw new Error('عدد مزودات الطاقة يتجاوز نطاق المخطط');
      for(let remain=n;remain>0;remain-=perSupply){const amount=Math.min(remain,perSupply);units.push({units:amount,watts:amount*watts});}
      totalWatts=n*watts;
    } else {
      stripLength=meters(p.stripLength,'طول الشريط المركب'),rolls=Math.ceil((stripLength-EPS)/meters(p.rollLength,'طول الرول'));
      const watts=number(p.wattsPerMeter,'واط لكل متر',{positive:true,max:1000000}),segmentLength=number(p.segmentLength,'طول مقطع التغذية',{positive:true,default:1,max:10000});
      n=count(Math.ceil((stripLength-EPS)/segmentLength),'عدد مقاطع الشريط');
      if(Math.min(segmentLength,stripLength)*watts>usableWatts+EPS)throw new Error('قدرة مقطع الشريط الواحد تتجاوز المزود؛ عدل طول مقطع التغذية حسب مواصفات المنتج');
      if(n>10000)throw new Error('عدد مقاطع الشريط يتجاوز نطاق المخطط');
      for(let i=0;i<n;i++){
        const len=Math.min(segmentLength,stripLength-i*segmentLength),w=len*watts;
        let bin=units.find(x=>x.watts+w<=usableWatts+EPS);
        if(!bin){bin={units:0,watts:0,meters:0};units.push(bin);}
        bin.units++;bin.watts+=w;bin.meters+=len;
      }
      totalWatts=stripLength*watts;layout={stripLength,segmentLength,rollLength:p.rollLength,segments:n};
    }
    const distribution=units.map((x,i)=>({supply:i+1,units:x.units,watts:precise(x.watts),loadPercent:r(x.watts/supplyWatts*100),...(x.meters===undefined?{}:{meters:precise(x.meters)})}));
    const wiringGroups=[];
    distribution.forEach(d=>{for(let remaining=d.units;remaining>0;remaining-=maxPerChain)wiringGroups.push({supply:d.supply,group:wiringGroups.length+1,units:Math.min(remaining,maxPerChain)});});
    const material=(p.mode==='module'?n:rolls)*unitPrice,supplies=distribution.length*supplyPrice;
    return Object.assign({count:n,rows,columns,stripLength,rolls,totalWatts:precise(totalWatts),currentAmps:precise(totalWatts/voltage),usableWatts:precise(usableWatts),powerSupplies:distribution.length,chains:wiringGroups.length,distribution,wiringGroups,layout,breakdown:[entry(p.mode==='module'?'وحدات LED':'رولات شريط كاملة',material),entry('مزودات الطاقة',supplies)],notes:['نسبة ٨٠٪ مثال افتراضي قابل للتعديل وليست قاعدة عامة؛ اتبع تحميل المصنع وخفض القدرة للحرارة وطريقة التركيب.','كل وحدة أو مقطع تغذية يخصص لمزود واحد؛ مجموعات التوصيل لا تعبر حدود المزود ولا تتجاوز العدد المدخل.','الجهد موحد حسب المدخل؛ لا توصل مخارج مزودات الطاقة على التوازي. يراجع الفني الأسلاك والحماية وهبوط الجهد والجهد الفعلي ومخطط التنفيذ.'].concat(p.mode==='strip'?['سعر الوحدة هنا سعر الرول الكامل؛ القدرة للطول المركب فقط. مقطع التغذية الافتراضي متر مع بقية أخيرة، ويجب ضبطه حسب حدود القطع والتغذية من المصنع.']:['توزيع مستطيل تقديري للمراكز؛ لا يمثل شكل الحرف أو اختبار تجانس الإضاءة.'])},price(material+supplies,1,markupOf(p.markup)));
  }
  function general(p) {
    p=p||{};
    const quantity=count(p.quantity,'الكمية'),material=cost(p.materialCost,'الخامات'),printing=cost(p.printCost,'الطباعة'),minutes=cost(p.laborMinutes,'دقائق عمل الدفعة'),hourly=cost(p.hourlyRate,'أجر الساعة'),labor=minutes/60*hourly,machine=cost(p.machineCost,'تشغيل الماكينة'),finishing=cost(p.finishingCost,'التشطيب'),packaging=cost(p.packagingCost,'التغليف'),overhead=cost(p.overhead,'المصاريف التشغيلية');
    return Object.assign({breakdown:[entry('خامات الدفعة',material),entry('طباعة الدفعة',printing),entry('عمل الدفعة',labor),entry('تشغيل الماكينة',machine),entry('تشطيب الدفعة',finishing),entry('تغليف الدفعة',packaging),entry('مصاريف تشغيلية للدفعة',overhead)],notes:['كل التكاليف المدخلة إجمالي الدفعة، ودقائق العمل إجمالي الدفعة؛ تقسم النتائج على الكمية.','نسبة الإضافة تطبق على التكلفة، وهامش المساهمة يحسب من سعر البيع. لا يمثل صافي ربح محاسبيا.']},price(material+printing+labor+machine+finishing+packaging+overhead,quantity,markupOf(p.markup)));
  }
  return {sheet,roll,letters,led,general};
});

;
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.WONesting=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const EPS=1e-8,round=x=>Math.round(x*1e6)/1e6;
const num=(v,name,min=0,max=1000000,integer=false)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v)))throw Error(name+' خارج النطاق');return v;};
const area=r=>r.w*r.h;
function validate(input){
 if(!input||!Array.isArray(input.parts)||!input.parts.length||!Array.isArray(input.stocks)||!input.stocks.length)throw Error('أدخل القطع والألواح');
 if(input.parts.length>100||input.stocks.length>100)throw Error('تجاوز حد المدخلات');
 const kerf=num(input.kerf??3,'عرض سلاح القص',0,100,true),margin=num(input.margin??0,'الهامش',0,1000,true);
 const salvageW=num(input.salvageMinWidth??150,'أقل عرض للباقي',1),salvageH=num(input.salvageMinHeight??150,'أقل طول للباقي',1);
 let count=0;const ids=new Set();
 const parts=input.parts.map((p,i)=>{const id=String(p.id??'part'+i);if(ids.has(id))throw Error('معرف قطعة مكرر');ids.add(id);const width=num(p.width,'عرض القطعة',1),height=num(p.height,'طول القطعة',1),quantity=num(p.quantity,'عدد القطع',1,2000,true);count+=quantity;return {id,width,height,quantity,rotate:p.rotate!==false&&input.allowRotate!==false};});
 if(count>2000)throw Error('العدد يتجاوز 2000 قطعة في عملية واحدة');
 const stockIds=new Set();
 const stocks=input.stocks.map((s,i)=>{const id=String(s.id??'stock'+i);if(stockIds.has(id))throw Error('معرف خامة مكرر');stockIds.add(id);const width=num(s.width,'عرض اللوح',1),height=num(s.height,'طول اللوح',1),quantity=num(s.quantity??1,'كمية المخزون',0,2000,true),cost=num(s.cost??0,'تكلفة اللوح',0,1e10);if(width<=2*margin||height<=2*margin)throw Error('الهامش يتجاوز مقاس اللوح');return {id,width,height,quantity,cost,kind:s.kind==='remnant'?'remnant':'sheet',location:String(s.location||'').slice(0,150),used:0};});
 return {parts,stocks,count,kerf,margin,salvageW,salvageH,maxSheets:num(input.maxSheets??200,'حد الألواح',1,2000,true)};
}
function split(f,w,h,k){
 const variants=[
 {direction:'vertical',rects:[{x:f.x+w+k,y:f.y,w:f.w-w-k,h:f.h},{x:f.x,y:f.y+h+k,w,h:f.h-h-k}]},
 {direction:'horizontal',rects:[{x:f.x+w+k,y:f.y,w:f.w-w-k,h},{x:f.x,y:f.y+h+k,w:f.w,h:f.h-h-k}]}
 ];
 for(const v of variants)v.rects=v.rects.filter(r=>r.w>EPS&&r.h>EPS);
 variants.sort((a,b)=>Math.max(...b.rects.map(area),0)-Math.max(...a.rects.map(area),0)||a.direction.localeCompare(b.direction));
 return variants[0];
}
function fit(bin,part,k){
 let best=null;
 for(let i=0;i<bin.free.length;i++)for(const rotated of part.rotate&&part.width!==part.height?[false,true]:[false]){
  const f=bin.free[i],w=rotated?part.height:part.width,h=rotated?part.width:part.height;
  if(w>f.w+EPS||h>f.h+EPS)continue;
  const cut=split(f,w,h,k),loss=area(f)-w*h-cut.rects.reduce((s,r)=>s+area(r),0);
  const score=area(f)-w*h+loss*.000001;
  if(!best||score<best.score-EPS)best={i,f,w,h,rotated,cut,score};
 }
 return best;
}
function open(s,index,margin){return {id:s.id+'-'+index,sourceId:s.id,kind:s.kind,location:s.location,width:s.width,height:s.height,cost:s.cost,free:[{x:margin,y:margin,w:s.width-2*margin,h:s.height-2*margin}],placed:[]};}
function plan(options){
 const c=validate(options),parts=c.parts.slice().sort((a,b)=>b.width*b.height-a.width*a.height||a.id.localeCompare(b.id)),todo=[];
 for(const p of parts)for(let n=0;n<p.quantity;n++)todo.push(p);
 const bins=[];
 for(let step=0;todo.length&&step<c.count;step++){
  let best=null;
  for(let pi=0;pi<todo.length;pi++){
   const p=todo[pi];let pick=null;
   for(const bin of bins){const f=fit(bin,p,c.kerf);if(!f)continue;const score=(bin.kind==='remnant'?0:1)*1e15+f.score;if(!pick||score<pick.score)pick={bin,fit:f,score};}
   if(!pick)for(const stock of c.stocks){if(stock.used>=stock.quantity||bins.length>=c.maxSheets)continue;const bin=open(stock,stock.used+1,c.margin),f=fit(bin,p,c.kerf);if(!f)continue;const score=(stock.kind==='remnant'?0:1)*1e15+stock.cost*1e6+area(bin.free[0]);if(!pick||score<pick.score)pick={bin,fit:f,stock,score};}
   if(!pick)continue;
   const overall=(pick.stock?2:0)*1e17+pick.score-p.width*p.height*.00001;
   if(!best||overall<best.overall)best={pi,pick,overall};
  }
  if(!best)break;
  const {pick}=best,{bin}=pick;
  if(pick.stock){pick.stock.used++;bins.push(bin);}
  const v=pick.fit,p=todo.splice(best.pi,1)[0];
  bin.free.splice(v.i,1,...v.cut.rects);
  bin.placed.push({partId:p.id,x:round(v.f.x),y:round(v.f.y),width:v.w,height:v.h,rotated:v.rotated,cutOrder:v.cut.direction});
 }
 const missing={};todo.forEach(x=>missing[x.id]=(missing[x.id]||0)+1);
 let gross=0,used=0,salvage=0,cost=0;
 const result=bins.map(b=>{
  const g=b.width*b.height;gross+=g;cost+=b.cost;
  const u=b.placed.reduce((n,x)=>n+x.width*x.height,0);used+=u;
  const candidates=b.free.filter(r=>r.w>=c.salvageW&&r.h>=c.salvageH).map((r,i)=>({id:b.id+'-r'+(i+1),sourceId:b.sourceId,x:round(r.x),y:round(r.y),width:round(r.w),height:round(r.h),requiresMeasurement:true}));
  const rem=candidates.reduce((n,r)=>n+r.width*r.height,0);salvage+=rem;
  return {id:b.id,sourceId:b.sourceId,kind:b.kind,location:b.location,width:b.width,height:b.height,cost:b.cost,placed:b.placed,remnantCandidates:candidates,usedArea:round(u),salvageArea:round(rem)};
 });
 const complete=todo.length===0;
 return {complete,requested:c.count,produced:c.count-todo.length,missing,bins:result,materialCost:Math.round(cost*100)/100,grossArea:round(gross),usedArea:round(used),unallocatedArea:round(gross-used),salvageableArea:round(salvage),nonSalvageArea:round(gross-used-salvage),utilizationPercent:gross?Math.round(used/gross*10000)/100:0,notes:['اقتراح تخطيط Guillotine؛ ليس ملف ماكينة أو ضمانا للقص الأمثل.','الأبعاد بالملليمتر. يجب تأكيد قياس الباقي قبل إضافته أو صرفه من المخزون.']};
}
return {plan};
});
;
(function(root,factory){'use strict';const api=factory(root.WONesting);if(typeof module==='object'&&module.exports)module.exports=api;root.WONestingUI=api;})(typeof globalThis!=='undefined'?globalThis:this,function(N){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(v,d=0)=>Number(v||0).toLocaleString('en-US',{maximumFractionDigits:d});
function stockOptions(ctx){return ctx.state.materials.filter(m=>m.branchId===ctx.branchId&&((m.baseUnit||({لوح:'sheet',ورقة:'sheet'}[m.unit]))==='sheet')&&m.width>0&&m.height>0).map(m=>({material:m,available:Math.max(0,Math.floor(ctx.inventory.availability(ctx.state,m.id).available))}));}
function draft(ctx){return {...{materialId:'manual',parts:'600 × 400 × 12',kerf:3,margin:10,minWidth:150,minHeight:150,rotate:true,useRemnants:true,manualW:122,manualH:244,manualQty:3},...(ctx.state.drafts.nesting||{})};}
function field(label,name,value){return '<div class="field"><label>'+esc(label)+'</label><input type="number" name="'+name+'" min="0" step="1" required value="'+esc(value)+'"></div>';}
function view(ctx){
 const d=draft(ctx),stock=stockOptions(ctx);
 const select='<option value="manual"'+(d.materialId==='manual'?' selected':'')+'>لوح يدوي للتجربة بدون صرف مخزون</option>'+stock.map(m=>'<option value="'+esc(m.material.id)+'"'+(m.material.id===d.materialId?' selected':'')+'>'+esc(m.material.name)+' · '+fmt(m.material.width)+'×'+fmt(m.material.height)+' سم · '+fmt(m.available)+' متاح</option>').join('');
 return '<div class="page-title between"><div><div class="eyebrow">إدارة القص والخامات</div><h1>تخطيط القص واستثمار البواقي</h1><p>توزيع مقاسات مختلفة على ألواح الأكريلك والورق والكلادينج مع سماكة القص والهامش.</p></div><a href="#/calculators" class="btn">الحاسبات الأخرى</a></div>'+
 '<div class="alert-box teal mb">التخطيط تقديري بنظام Guillotine وليس ملف ماكينة قص. تأكد من أبعاد الخامة وعرض السلاح واتجاه النقشة قبل اعتماد الإنتاج.</div>'+
 '<div class="grid main-side"><section class="card"><form id="cut-form" class="stack"><h2>بيانات القص</h2><div class="field"><label>اختر خامة من الفرع: '+esc(ctx.branchName)+'</label><select name="materialId">'+select+'</select></div>'+
 '<div class="field"><label>المقاسات (مم) — عرض × طول × عدد، كل مقاس في سطر</label><textarea name="parts" rows="4" required maxlength="3000">'+esc(d.parts)+'</textarea><span class="help">مثال: 600×400×4 وفي السطر التالي 250×300×8</span></div>'+
 '<div class="form-grid keep">'+field('عرض سلاح القص (مم)','kerf',d.kerf)+field('هامش الحافة (مم)','margin',d.margin)+field('أقل عرض لباق مفيد (مم)','minWidth',d.minWidth)+field('أقل طول لباق مفيد (مم)','minHeight',d.minHeight)+'</div>'+
 '<div class="row wrap"><label class="check"><input type="checkbox" name="rotate"'+(d.rotate?' checked':'')+'> السماح بتدوير القطعة</label><label class="check"><input type="checkbox" name="useRemnants"'+(d.useRemnants?' checked':'')+'> فحص البواقي أولا</label></div>'+
 '<h3>لوح يدوي للمحاكاة فقط</h3><div class="form-grid three">'+field('العرض (سم)','manualW',d.manualW)+field('الطول (سم)','manualH',d.manualH)+field('عدد الألواح','manualQty',d.manualQty)+'</div><button type="submit" class="btn primary">حساب توزيع القص</button></form></section>'+
 '<aside class="stack"><section class="card"><h2>ما الذي تحسبه الأداة؟</h2><p class="tiny muted">أولوية البواقي، توزيع القطع بالملليمتر، الفواصل، القطع الدوارة، كمية الألواح المفتوحة والمساحة الصالحة للاستعادة.</p><p class="field-note">البواقي الجديدة لا تدخل المخزون دون قياس وتأكيد فعلي.</p></section><section class="card"><h2>حالة الحسبة</h2><p id="cut-status" role="status" class="tiny muted">أدخل المقاسات واضغط حساب.</p></section></aside></div><div id="cut-output" class="mt"></div>';
}
function parseParts(text){const lines=String(text||'').split(/[\n;]/).map(v=>v.trim()).filter(Boolean);if(!lines.length||lines.length>100)throw Error('أدخل من 1 إلى 100 نوع قطع');return lines.map((line,i)=>{const a=line.replace(/[xX×*,،]/g,' ').split(/\s+/).filter(Boolean).map(Number);if(a.length!==3||a.some(x=>!Number.isInteger(x)||x<=0))throw Error('سطر '+(i+1)+': أدخل عرض × طول × عدد بأرقام صحيحة');return {id:'part'+(i+1),width:a[0],height:a[1],quantity:a[2]};});}
function inputs(f){const e=f.elements;return {materialId:e.materialId.value,parts:e.parts.value,kerf:Number(e.kerf.value),margin:Number(e.margin.value),minWidth:Number(e.minWidth.value),minHeight:Number(e.minHeight.value),rotate:e.rotate.checked,useRemnants:e.useRemnants.checked,manualW:Number(e.manualW.value),manualH:Number(e.manualH.value),manualQty:Number(e.manualQty.value)};}
function toPlan(ctx,d){let stocks=[];if(d.materialId==='manual'){stocks=[{id:'manual',kind:'sheet',width:d.manualW*10,height:d.manualH*10,quantity:d.manualQty,cost:0}];}
 else {const record=stockOptions(ctx).find(x=>x.material.id===d.materialId);if(!record)throw Error('الخامة غير متاحة في هذا الفرع');const m=record.material;if(m.costConfirmed===false)throw Error('تكلفة المورد غير مؤكدة؛ صحح بطاقة الخامة أو استخدم اللوح اليدوي للمحاكاة');stocks.push({id:m.id,width:m.width*10,height:m.height*10,quantity:record.available,cost:m.unitCost,kind:'sheet',location:m.location});if(d.useRemnants)for(const r of ctx.state.remnants){if(r.materialId===m.id&&r.branchId===ctx.branchId&&r.status==='available'&&!r.reservedFor&&r.width>0&&r.height>0)stocks.push({id:r.id,width:r.width*10,height:r.height*10,kind:'remnant',quantity:1,location:r.location,cost:0});}}
 return {parts:parseParts(d.parts),stocks,kerf:d.kerf,margin:d.margin,salvageMinWidth:d.minWidth,salvageMinHeight:d.minHeight,allowRotate:d.rotate};}
function preview(bin){
 const parts=bin.placed.slice(0,140).map((p,i)=>'<rect x="'+p.x+'" y="'+p.y+'" width="'+p.width+'" height="'+p.height+'" fill="'+(i%2?'#9adcd5':'#ad92d1')+'" stroke="white" stroke-width="3"/>').join('');
 const remnants=bin.remnantCandidates.slice(0,60).map(p=>'<rect x="'+p.x+'" y="'+p.y+'" width="'+p.width+'" height="'+p.height+'" fill="#dbebcd" stroke="#8da977" stroke-dasharray="12 8" stroke-width="3"/>').join('');
 return '<svg viewBox="0 0 '+bin.width+' '+bin.height+'" class="layout-svg" style="height:245px" role="img" aria-label="مخطط قص اللوح"><rect width="'+bin.width+'" height="'+bin.height+'" fill="#f4f1f8"/>'+remnants+parts+'</svg>';
}
function results(ctx,r){
 const cards=r.bins.map(b=>'<section class="card"><div class="between"><h3>'+(b.kind==='remnant'?'باق مستخدم: ':'لوح جديد: ')+esc(b.sourceId)+'</h3><span class="tag teal">'+b.placed.length+' قطع</span></div><p class="tiny muted">'+fmt(b.width)+' × '+fmt(b.height)+' مم</p>'+preview(b)+'<p class="tiny mt">مساحة بواقي تقبل القياس: '+fmt(b.salvageArea/1000000,3)+' م²</p><div class="tiny muted">'+b.remnantCandidates.slice(0,8).map(x=>fmt(x.width)+'×'+fmt(x.height)+' مم').join('، ')+'</div></section>').join('');
 return '<div class="stats"><div class="stat"><div><p class="label">قطع موزعة</p><div class="value">'+r.produced+' / '+r.requested+'</div></div></div><div class="stat"><div><p class="label">الألواح والبواقي المستخدمة</p><div class="value">'+r.bins.length+'</div></div></div><div class="stat"><div><p class="label">نسبة الاستفادة</p><div class="value">'+r.utilizationPercent+'%</div></div></div><div class="stat"><div><p class="label">مساحة بواقي قابلة للقياس</p><div class="value">'+fmt(r.salvageableArea/1000000,2)+' م²</div></div></div></div>'+
 (r.complete?'<div class="alert-box teal mb">توزعت جميع القطع ضمن الخامات المختارة.</div>':'<div class="alert-box orange mb">المخزون المحدد لا يكفي لكل القطع؛ راجع العدد والأبعاد قبل الإنتاج.</div>')+
 '<div class="grid three">'+cards+'</div>'+(ctx.financial?'<section class="card mt"><p>تكلفة خامات الألواح المستخدمة: <b>'+fmt(r.materialCost,2)+'</b> '+esc(ctx.currency)+' — لا تشمل أجور القطع أو الهدر المحاسبي.</p></section>':'')+'<p class="field-note">البواقي في المخطط اقتراحات تحتاج قياسا من الموظف قبل إضافتها إلى مخزون الفرع.</p>';
}
function bind(ctx){const f=document.getElementById('cut-form');if(!f)return;
 f.addEventListener('input',()=>{ctx.state.drafts.nesting=inputs(f);try{ctx.persist();}catch(e){document.getElementById('cut-status').textContent='تعذر حفظ مسودة الحاسبة';}});
 f.addEventListener('submit',e=>{e.preventDefault();const d=inputs(f);try{ctx.state.drafts.nesting=d;ctx.persist();const r=N.plan(toPlan(ctx,d));document.getElementById('cut-output').innerHTML=results(ctx,r);document.getElementById('cut-status').textContent='نتيجة قابلة للمراجعة؛ لم يحدث صرف مخزون أو حجز تلقائي.';}catch(err){document.getElementById('cut-status').textContent=err.message;document.getElementById('cut-output').innerHTML='';}});
}
return {view,bind,parseParts,toPlan};
});
;
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

;
(function(root,factory){'use strict';const api=factory(typeof module==='object'&&module.exports?require('./model.js'):root.WOModel);if(typeof module==='object'&&module.exports)module.exports=api;root.WOInventory=api;})(typeof globalThis!=='undefined'?globalThis:this,function(M){
'use strict';
const BASES=['sheet','m','m2','piece','ml','kg'],COUNT=['sheet','piece'],FORMS=['sheet','roll','piece','liquid','strip','module','powerSupply'],EPS=1e-6;
const labels={sheet:'لوح',m:'متر',m2:'م²',piece:'قطعة',ml:'مل',kg:'كجم'};
const fail=msg=>{throw new Error(msg);},obj=x=>x&&typeof x==='object'&&!Array.isArray(x),round=(x,d=6)=>Math.round((x+Number.EPSILON)*10**d)/10**d,stamp=()=>new Date().toISOString();
function num(v,label,min=0,max=1e10){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)fail(label+': قيمة رقمية غير صالحة');return v;}
function txt(v,label,max=300,optional=false){if(typeof v!=='string'||v.length>max||(!optional&&!v.trim()))fail(label+': نص غير صالح');return v.trim();}
function get(list,id,label){return (list||[]).find(x=>x.id===id)||fail(label+' غير موجود');}
function auth(s,u,b,p='manage_inventory'){if(!M.can(s,u,p,b))fail('لا تملك صلاحية هذه العملية في هذا الفرع');}
function tenant(s,v){if(v!==undefined&&v!==s.tenantId)fail('الخامة خارج نطاق المنشأة');}
function base(m){if(m.baseUnit)return m.baseUnit;const a={'لوح':'sheet','ورقة':'sheet','متر':'m','م':'m','م²':'m2','متر مربع':'m2','قطعة':'piece','وحدة':'piece','مل':'ml','ملل':'ml','كجم':'kg','كغ':'kg'};return a[m.unit]||'piece';}
function qty(m,v,label='الكمية',positive=false){num(v,label,positive?.000001:0);if(COUNT.includes(base(m))&&!Number.isInteger(v))fail(label+': وحدة العد تتطلب عددا صحيحا');return round(v);}
function arrays(s){for(const key of ['stockReservations','stockMovements'])if(s[key]!==undefined&&!Array.isArray(s[key]))fail('سجل المخزون الموسع غير صالح');}
function init(s){if(!s.stockReservations)s.stockReservations=[];if(!s.stockMovements)s.stockMovements=[];}
function audit(s,u,b,action,id,detail){s.audit.push({id:M.uid('evt'),at:stamp(),actorId:u,branchId:b,action,entityId:id,detail});}
function move(s,u,m,type,data){const x={id:M.uid('stock'),at:stamp(),actorId:u,branchId:m.branchId,materialId:m.id,type,baseUnit:base(m),...data};s.stockMovements.push(x);return x;}
function unique(s,m){for(const x of s.materials){if(x.id===m.id||x.branchId!==m.branchId)continue;if(m.sku&&x.sku&&m.sku.toLocaleLowerCase()===x.sku.toLocaleLowerCase())fail('رمز SKU مكرر في الفرع');if(m.barcode&&x.barcode===m.barcode)fail('الباركود مكرر في الفرع');}}
function validateMaterial(s,m){
 tenant(s,m.tenantId);get(s.branches,m.branchId,'الفرع');txt(m.name,'اسم الخامة');txt(m.category,'فئة الخامة');txt(m.unit,'وحدة الخامة');
 for(const k of ['sku','barcode','supplier','color','finish','location','compatibleProcess','specStatus','sourceUrl'])if(m[k]!==undefined)txt(m[k],k,k==='sourceUrl'?2000:300,true);
 if(m.baseUnit!==undefined&&!BASES.includes(m.baseUnit))fail('وحدة المخزون الأساسية غير معروفة');if(m.form!==undefined&&!FORMS.includes(m.form))fail('شكل الخامة غير معروف');
 qty(m,m.quantity);qty(m,m.minQuantity,'حد إعادة الطلب');num(m.unitCost,'تكلفة الوحدة');for(const k of ['width','height','thickness','gsm','inkMlPerM2','voltage','wattsPerUnit','wattsPerMeter','rollLength','maxPerChain','powerSupplyWatts','cct'])if(m[k]!==undefined)num(m[k],k);
 if(m.costConfirmed!==undefined&&typeof m.costConfirmed!=='boolean')fail('حالة تأكيد التكلفة غير صالحة');
 if(m.sourceUrl&&!/^https?:\/\/[^\s]+$/i.test(m.sourceUrl))fail('رابط المصدر يجب أن يبدأ بـ http أو https');
 if(m.purchaseUnits!==undefined){if(!Array.isArray(m.purchaseUnits)||m.purchaseUnits.length>30)fail('عبوات الشراء غير صالحة');const seen=new Set();for(const p of m.purchaseUnits){if(!obj(p))fail('عبوة شراء غير صالحة');const name=txt(p.name,'اسم العبوة',80);if(BASES.includes(name)||name===m.unit||seen.has(name))fail('اسم عبوة مكرر أو يلتبس بالوحدة الأساسية');seen.add(name);num(p.factor,'معامل تحويل العبوة',.000001,1e9);if(COUNT.includes(base(m))&&!Number.isInteger(p.factor))fail('معامل عبوة وحدات العد يجب أن يكون صحيحا');}}
 unique(s,m);return m;
}
function createMaterial(s,u,d){if(!obj(d))fail('بيانات الخامة غير صالحة');arrays(s);auth(s,u,d.branchId);tenant(s,d.tenantId);
 if(d.id!==undefined&&(typeof d.id!=='string'||!/^[-a-zA-Z0-9_]{1,100}$/.test(d.id)||s.materials.some(m=>m.id===d.id)))fail('معرف الخامة غير صالح أو مكرر');
 if(d.sku!==undefined)txt(d.sku,'رمز الصنف',300,true);if(d.barcode!==undefined)txt(d.barcode,'الباركود',300,true);
 const b=d.baseUnit||base(d);const m={id:d.id||M.uid('mat'),branchId:d.branchId,name:d.name,category:d.category||'projects',unit:d.unit||labels[b]||'قطعة',quantity:d.quantity??0,minQuantity:d.minQuantity??0,unitCost:d.unitCost??0,supplier:d.supplier||'',width:d.width??0,height:d.height??0,thickness:d.thickness??0,color:d.color||'',sku:d.sku?.trim()||'',barcode:d.barcode?.trim()||'',baseUnit:b,purchaseUnits:d.purchaseUnits?JSON.parse(JSON.stringify(d.purchaseUnits)):[],form:d.form||(b==='sheet'?'sheet':b==='m'?'roll':b==='ml'?'liquid':'piece'),gsm:d.gsm??0,finish:d.finish||'',location:d.location||'',sourceUrl:d.sourceUrl||'',specStatus:d.specStatus||'awaiting_supplier',inkMlPerM2:d.inkMlPerM2??0,compatibleProcess:d.compatibleProcess||'',costConfirmed:d.costConfirmed??((d.unitCost??0)>0)};
 if(s.tenantId!==undefined)m.tenantId=s.tenantId;
 for(const k of ['description','manufacturer','manufacturerPartNo','voltage','wattsPerUnit','wattsPerMeter','rollLength','maxPerChain','powerSupplyWatts','cct','sourceRevision'])if(d[k]!==undefined)m[k]=d[k];
 validateMaterial(s,m);s.materials.push(m);init(s);if(m.quantity)move(s,u,m,'opening',{quantity:m.quantity,delta:m.quantity,unitCost:m.unitCost,reason:'رصيد افتتاحي'});audit(s,u,m.branchId,'create_material',m.id,'إضافة خامة '+m.name);return m;
}
function updateMaterial(s,u,id,patch){if(!obj(patch)||!Object.keys(patch).length)fail('تعديلات الخامة غير صالحة');arrays(s);const m=get(s.materials,id,'الخامة');auth(s,u,m.branchId);tenant(s,m.tenantId);
 const fields=['name','category','unit','supplier','width','height','thickness','color','sku','barcode','baseUnit','purchaseUnits','form','gsm','finish','location','sourceUrl','specStatus','inkMlPerM2','compatibleProcess','unitCost','minQuantity','costConfirmed','description','manufacturer','manufacturerPartNo','voltage','wattsPerUnit','wattsPerMeter','rollLength','maxPerChain','powerSupplyWatts','cct','sourceRevision'];
 for(const k of Object.keys(patch))if(!fields.includes(k))fail('الحقل '+k+' غير قابل للتعديل؛ استخدم الجرد لتغيير الرصيد');
 if(patch.baseUnit&&patch.baseUnit!==base(m)&&(m.quantity>0||(s.stockReservations||[]).some(r=>r.materialId===id)||(s.stockMovements||[]).some(x=>x.materialId===id)||s.orders.some(o=>o.consumptions.some(c=>c.materialId===id))))fail('لا يمكن تغيير وحدة خامة لها رصيد أو تاريخ حركات');
 const candidate={...m,...JSON.parse(JSON.stringify(patch))};for(const k of ['sku','barcode'])if(typeof candidate[k]==='string')candidate[k]=candidate[k].trim();validateMaterial(s,candidate);Object.assign(m,candidate);audit(s,u,m.branchId,'update_material',m.id,'تعديل بطاقة الخامة');return m;
}
function convert(m,quantity,unit){num(quantity,'كمية التحويل');const b=base(m);let factor=1;if(unit!==undefined&&unit!==b&&unit!==m.unit){const p=(m.purchaseUnits||[]).find(x=>x.name===unit);if(!p)fail('وحدة التحويل غير معرفة لهذه الخامة');num(p.factor,'معامل التحويل',.000001);factor=p.factor;}return qty(m,round(quantity*factor),'الكمية المحولة');}
function availability(s,id,orderId){const m=get(s.materials,id,'الخامة');tenant(s,m.tenantId);arrays(s);const active=(s.stockReservations||[]).filter(r=>r.materialId===id&&r.status==='active');const reserved=round(active.reduce((n,r)=>n+r.remainingQuantity,0));return {onHand:m.quantity,reserved,available:round(m.quantity-reserved),allocatedToOrder:round(active.filter(r=>r.orderId===orderId).reduce((n,r)=>n+r.remainingQuantity,0))};}
function adjust(s,u,id,quantity,reason){arrays(s);const m=get(s.materials,id,'الخامة');auth(s,u,m.branchId);tenant(s,m.tenantId);qty(m,quantity);reason=txt(reason,'سبب الجرد',2000);if(quantity+EPS<availability(s,id).reserved)fail('الجرد لا يمكن أن ينخفض دون الرصيد المحجوز');const old=m.quantity;m.quantity=quantity;init(s);move(s,u,m,'adjust',{quantity:Math.abs(quantity-old),delta:round(quantity-old),unitCost:m.unitCost,reason});audit(s,u,m.branchId,'adjust_material',id,'جرد: '+reason);return m;}
function reserve(s,u,id,orderId,quantity){arrays(s);const m=get(s.materials,id,'الخامة'),o=get(s.orders,orderId,'الأمر');auth(s,u,m.branchId);tenant(s,m.tenantId);qty(m,quantity,'كمية الحجز',true);if(m.branchId!==o.branchId)fail('الخامة والأمر ليسا في الفرع نفسه');if(['cancelled','delivered'].includes(o.status))fail('لا يمكن حجز خامة لأمر مغلق');if(quantity>availability(s,id).available+EPS)fail('الرصيد المتاح لا يكفي للحجز');
 const x={id:M.uid('reserve'),branchId:m.branchId,materialId:id,orderId,quantity,remainingQuantity:quantity,consumedQuantity:0,releasedQuantity:0,status:'active',actorId:u,at:stamp(),releasedAt:null};init(s);s.stockReservations.push(x);audit(s,u,m.branchId,'reserve_material',x.id,'حجز '+quantity+' '+m.unit+' للأمر '+o.number);return x;
}
function releaseOne(s,u,x,reason){x.releasedQuantity=round((x.releasedQuantity||0)+x.remainingQuantity);x.remainingQuantity=0;x.status='released';x.releasedAt=stamp();x.reason=reason||'تحرير الحجز';audit(s,u,x.branchId,'release_material',x.id,x.reason);return x;}
function release(s,u,id){arrays(s);const x=get(s.stockReservations,id,'الحجز');auth(s,u,x.branchId);if(x.status!=='active')fail('هذا الحجز غير نشط');return releaseOne(s,u,x);}
function releaseForOrder(s,u,orderId){arrays(s);const o=get(s.orders,orderId,'الأمر');if(!M.can(s,u,'manage_inventory',o.branchId)&&!M.can(s,u,'manage_production',o.branchId))fail('لا تملك صلاحية تحرير حجوزات الأمر');if(!['cancelled','delivered'].includes(o.status))fail('التحرير الختامي متاح للأمر المسلم أو الملغى فقط');const xs=(s.stockReservations||[]).filter(r=>r.orderId===orderId&&r.status==='active');xs.forEach(x=>releaseOne(s,u,x,'تحرير متبقي الحجز عند إغلاق الأمر'));return xs;}
function issue(s,u,orderId,d){if(!obj(d))fail('بيانات الصرف غير صالحة');arrays(s);const m=get(s.materials,d.materialId,'الخامة');tenant(s,m.tenantId);const quantity=convert(m,d.quantity,d.unit);if(quantity<=0)fail('كمية الصرف يجب أن تكون موجبة');const factor=d.unit===undefined||d.unit===base(m)||d.unit===m.unit?1:((m.purchaseUnits||[]).find(x=>x.name===d.unit)||{}).factor;num(d.wasteQuantity??0,'الهدر');const wasteQuantity=round((d.wasteQuantity??0)*factor);if(wasteQuantity>quantity)fail('الهدر يجب أن يكون جزءا من إجمالي الصرف');const av=availability(s,m.id,orderId);if(quantity>av.available+av.allocatedToOrder+EPS)fail('الرصيد غير المحجوز لهذا الأمر لا يكفي؛ لا يمكن صرف حجز أمر آخر');
 const result=M.consumeMaterial(s,u,orderId,{materialId:m.id,quantity,wasteQuantity,note:d.note??''});init(s);let remaining=quantity;for(const x of s.stockReservations.filter(x=>x.orderId===orderId&&x.materialId===m.id&&x.status==='active')){const used=Math.min(x.remainingQuantity,remaining);x.remainingQuantity=round(x.remainingQuantity-used);x.consumedQuantity=round(x.consumedQuantity+used);remaining=round(remaining-used);if(x.remainingQuantity===0)x.status='consumed';if(!remaining)break;}
 move(s,u,m,'issue',{orderId,consumptionId:result.id,quantity,wasteQuantity,netQuantity:round(quantity-wasteQuantity),delta:-quantity,unitCost:result.unitCost,cost:result.cost,reason:d.note||''});return result;
}
function receivePurchase(s,u,id){arrays(s);const p=get(s.purchases,id,'الشراء'),m=get(s.materials,p.materialId,'الخامة');tenant(s,m.tenantId);const quantity=convert(m,p.quantity,p.purchaseUnit);if(quantity<=0)fail('كمية الاستلام يجب أن تكون موجبة');num(p.unitCost,'تكلفة الشراء');const factor=quantity/p.quantity,unitCost=p.unitCost/factor;
 const copy=JSON.parse(JSON.stringify(s)),cp=get(copy.purchases,id,'الشراء');cp.quantity=quantity;cp.unitCost=unitCost;M.receivePurchase(copy,u,id);const cm=get(copy.materials,m.id,'الخامة');qty(m,cm.quantity,'الرصيد بعد الاستلام');cp.quantity=p.quantity;cp.unitCost=p.unitCost;cp.receiptQuantityBase=quantity;cp.receiptUnitCostBase=unitCost;Object.assign(m,{quantity:cm.quantity,unitCost:cm.unitCost,costConfirmed:(m.quantity===0||m.costConfirmed!==false)&&p.unitCost>0});Object.assign(p,cp);s.audit=copy.audit;init(s);move(s,u,m,'receive',{purchaseId:id,quantity,delta:quantity,unitCost,cost:round(quantity*unitCost,2),reason:'استلام طلب شراء'});return p;
}
function transfer(s,u,id,toBranchId,quantity,reason){arrays(s);const m=get(s.materials,id,'الخامة');tenant(s,m.tenantId);auth(s,u,m.branchId);auth(s,u,toBranchId);if(m.branchId===toBranchId)fail('اختر فرعا مختلفا للتحويل');qty(m,quantity,'كمية التحويل',true);reason=txt(reason,'سبب التحويل',2000);if(quantity>availability(s,id).available+EPS)fail('الرصيد غير المحجوز لا يكفي للتحويل');
 let target=s.materials.find(x=>x.branchId===toBranchId&&((m.sku&&x.sku===m.sku)||(!m.sku&&x.name===m.name)));let isNew=false;
 if(target){for(const k of ['width','height','thickness','gsm','color','finish','form','compatibleProcess'])if((target[k]??'')!==(m[k]??''))fail('صنف الفرع الهدف يختلف في مواصفاته');if(base(target)!==base(m))fail('وحدة صنف الفرع الهدف مختلفة');}
 else {target={...JSON.parse(JSON.stringify(m)),id:M.uid('mat'),branchId:toBranchId,quantity:0};validateMaterial(s,target);isNew=true;}
 const beforeTarget=target.quantity,total=round(beforeTarget+quantity),weighted=round((beforeTarget*target.unitCost+quantity*m.unitCost)/total,4);qty(target,total,'رصيد الفرع الهدف');
 const transferId=M.uid('transfer');m.quantity=round(m.quantity-quantity);target.quantity=total;target.unitCost=weighted;target.costConfirmed=target.costConfirmed!==false&&m.costConfirmed!==false;if(isNew){target.costConfirmed=m.costConfirmed!==false;s.materials.push(target);}init(s);move(s,u,m,'transfer_out',{transferId,toBranchId,toMaterialId:target.id,quantity,delta:-quantity,unitCost:m.unitCost,reason});move(s,u,target,'transfer_in',{transferId,fromBranchId:m.branchId,fromMaterialId:m.id,quantity,delta:quantity,unitCost:m.unitCost,reason});audit(s,u,m.branchId,'transfer_material',id,'تحويل '+quantity+' إلى '+toBranchId+': '+reason);audit(s,u,toBranchId,'receive_transfer',target.id,'استلام تحويل '+transferId);return {transferId,fromMaterialId:m.id,toMaterialId:target.id,quantity,fromBranchId:m.branchId,toBranchId};
}
function suggest(s,q){q=q||{};if(!obj(q))fail('طلب اقتراح الخامة غير صالح');const factor=q.unit==='m'?100:1,w=num(q.width??0,'عرض الطلب')*factor,h=num(q.height??0,'ارتفاع الطلب')*factor,quantity=num(q.quantity??1,'عدد القطع',.000001);const matches=m=>(!q.branchId||m.branchId===q.branchId)&&(!q.materialId||m.id===q.materialId)&&(!q.category||m.category===q.category)&&(!q.baseUnit||base(m)===q.baseUnit)&&(!q.thickness||m.thickness===q.thickness)&&(!q.color||m.color===q.color);
 const materials=s.materials.filter(matches).filter(m=>{if(!w||!h)return true;if(m.form==='roll'||m.form==='strip'||base(m)==='m'||base(m)==='m2')return !m.width||m.width>=w||m.width>=h;if(!m.width||!m.height)return true;return (m.width>=w&&m.height>=h)||(m.width>=h&&m.height>=w);}).map(m=>({...m,...availability(s,m.id)})).sort((a,b)=>b.available-a.available);
 const ids=new Set(materials.map(m=>m.id));const remnants=quantity===1&&w>0&&h>0?s.remnants.filter(r=>r.status==='available'&&!r.reservedFor&&ids.has(r.materialId)&&(!q.branchId||r.branchId===q.branchId)&&((r.width>=w&&r.height>=h)||(r.width>=h&&r.height>=w))).map(r=>({...r})).sort((a,b)=>a.width*a.height-b.width*b.height):[];return {materials,remnants};
}
function calculatorPreset(m,type){if(!obj(m))fail('الخامة غير صالحة');const b=base(m),confirmed=m.costConfirmed!==false,unitCost=confirmed?num(m.unitCost??0,'تكلفة الوحدة'):0;if(type==='sheet'||type==='paper')return {sheetW:m.width||0,sheetH:m.height||0,sheetCost:b==='m2'?round(unitCost*(m.width||0)*(m.height||0)/10000):unitCost};
 if(type==='roll'){const width=(m.width||0)/100;return {rollWidth:width,mediaCostPerM2:b==='m'?(width?round(unitCost/width):0):b==='m2'?unitCost:0,...(m.inkMlPerM2?{inkMlPerM2:m.inkMlPerM2}:{})};}
 if(type==='led'){const out={unitPrice:unitCost};for(const k of ['voltage','wattsPerUnit','wattsPerMeter','maxPerChain','powerSupplyWatts'])if(m[k]!==undefined)out[k]=m[k];if(m.form==='strip'){out.mode='strip';const len=m.rollLength||(m.height?m.height/100:0);if(len){out.rollLength=len;if(b==='m')out.unitPrice=round(unitCost*len);}}else out.mode='module';return out;}
 if(type==='general')return {materialCost:unitCost};if(type==='letters')return {cost:unitCost};fail('نوع الحاسبة غير معروف');}
function validateExtensions(s){arrays(s);const ids=new Set();for(const m of s.materials)validateMaterial(s,m);
 const totals=new Map();for(const r of s.stockReservations||[]){if(!obj(r)||ids.has(r.id))fail('معرف حجز مكرر أو غير صالح');txt(r.id,'معرف الحجز');ids.add(r.id);get(s.users,r.actorId,'منفذ الحجز');if(typeof r.at!=='string'||!Number.isFinite(Date.parse(r.at)))fail('تاريخ الحجز غير صالح');const m=get(s.materials,r.materialId,'خامة الحجز'),o=get(s.orders,r.orderId,'أمر الحجز');if(r.branchId!==m.branchId||o.branchId!==m.branchId)fail('حجز خارج فرع الخامة أو الأمر');qty(m,r.quantity,'الكمية الأصلية',true);qty(m,r.remainingQuantity,'متبقي الحجز');num(r.consumedQuantity??0,'المصروف من الحجز');num(r.releasedQuantity??0,'المحرر من الحجز');if(Math.abs(r.remainingQuantity+(r.consumedQuantity||0)+(r.releasedQuantity||0)-r.quantity)>EPS)fail('توزيع الحجز يتجاوز الكمية الأصلية');if(!['active','released','consumed'].includes(r.status)||(r.status==='active')!==(r.remainingQuantity>0))fail('حالة الحجز لا تطابق متبقيه');if(r.status==='active'){if(['cancelled','delivered'].includes(o.status))fail('أمر مغلق ما زال يحتفظ بحجز خامات');totals.set(m.id,(totals.get(m.id)||0)+r.remainingQuantity);}}
 for(const [id,total] of totals)if(total>get(s.materials,id,'الخامة').quantity+EPS)fail('الحجوزات تتجاوز الرصيد');
 const movements=new Set();for(const x of s.stockMovements||[]){if(!obj(x)||movements.has(x.id))fail('سجل حركة مكرر أو غير صالح');txt(x.id,'معرف الحركة');movements.add(x.id);if(!['opening','adjust','issue','receive','transfer_out','transfer_in'].includes(x.type))fail('نوع حركة غير معروف');get(s.users,x.actorId,'منفذ الحركة');if(typeof x.at!=='string'||!Number.isFinite(Date.parse(x.at)))fail('تاريخ حركة غير صالح');const m=get(s.materials,x.materialId,'خامة الحركة');if(x.branchId!==m.branchId)fail('حركة خارج الفرع');num(x.quantity,'كمية الحركة');if(typeof x.delta!=='number'||!Number.isFinite(x.delta)||Math.abs(x.delta)>1e10)fail('أثر حركة غير صالح');if(x.orderId)get(s.orders,x.orderId,'أمر الحركة');if(x.purchaseId)get(s.purchases,x.purchaseId,'شراء الحركة');if(x.wasteQuantity!==undefined)num(x.wasteQuantity,'هدر الحركة',0,x.quantity);}
 return s;
}
return {createMaterial,updateMaterial,adjust,availability,convert,reserve,release,releaseForOrder,issue,receivePurchase,transfer,suggest,calculatorPreset,validateExtensions};
});

;
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.WOMaterialCatalog=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const sources={
 acrylic:'https://www.plexiglas.de/en/products/plexiglas/plexiglas-gs-xt',
 pvc:'https://www.palram.com/product/palight-pvc-flat-sheets/',
 acp:'https://media.3acomposites.com/pdf/3AComposites/EN_3AC_DISPLAY_ProductGuide_01-2020.pdf',
 backlit:'https://support.hplfmedia.com/docs/hp-backlit-polyester-film',
 vinyl:'https://graphics.averydennison.com/en/home/graphics-products/digitally-printable-films/supercast-digital-color-graphics/mpi-1105-opaque-series-films.html',
 banner:'https://support.hplfmedia.com/docs/hp-opaque-scrim',
 paper:'https://www.mymondi.net/en/ufp/brand/color-copy-original/',
 ink:'https://epson.com/For-Home/Ink/Epson-T51U-Ink-Packs/i/T51U',
 led:'https://sloanled.com/downloads/SpecSheet-SloanLEDSE-Global.pdf',
 supply:'https://www.meanwell.com/Upload/PDF/LPV-60/LPV-60-SPEC.PDF',
 gift:'https://www.unisub.com/products/'
};
function template(id,name,family,data){return {id,name,family,category:'projects',form:'sheet',baseUnit:'sheet',unit:'لوح',sku:'TPL-'+id.toUpperCase(),barcode:'',quantity:0,minQuantity:0,unitCost:0,costConfirmed:false,width:0,height:0,thickness:0,gsm:0,color:'',finish:'',purchaseUnits:[],supplier:'',location:'',sourceUrl:sources[family],specStatus:'awaiting_supplier',compatibleProcess:'',sourceRevision:'checked-2026-11-13',description:'قالب مرجعي من مصدر المصنع؛ أكد المقاس والعبوة والتوافق والتكلفة لدى المورد قبل التشغيل.',...data};}
const templates=[];
for(const thickness of [3,5])templates.push(template('gs-clear-'+thickness,'أكريلك PLEXIGLAS GS مصبوب شفاف '+thickness+' مم','acrylic',{category:'acrylic',manufacturer:'PLEXIGLAS',width:305,height:203,thickness,color:'شفاف',finish:'لامع',compatibleProcess:'قص وتصنيع',description:'مثال GS مصبوب بمقاس المصنع 3050×2030 مم؛ يختلف عن مقاس XT. أكد الصنف وتفاوت السماكة والمقاس الفعلي.'}));
for(const thickness of [3,5])templates.push(template('gs-white-'+thickness,'أكريلك PLEXIGLAS GS مصبوب أبيض '+thickness+' مم','acrylic',{category:'acrylic',manufacturer:'PLEXIGLAS',width:305,height:203,thickness,color:'أبيض',compatibleProcess:'قص وتصنيع',description:'مثال أبيض مصبوب من جدول GS؛ درجة اللون ونفاذية الضوء والسماكة الفعلية تحتاج تأكيد المورد، ولا يفترض أنه صنف LED.'}));
for(const thickness of [3,5])templates.push(template('xt-clear-'+thickness,'أكريلك PLEXIGLAS XT مبثوق شفاف '+thickness+' مم','acrylic',{category:'acrylic',manufacturer:'PLEXIGLAS',width:305,height:205,thickness,color:'شفاف',finish:'لامع',compatibleProcess:'قص وتصنيع',description:'مثال XT مبثوق 3050×2050 مم؛ العملية والخامة تختلفان عن GS، ولا يعمم المقاس على جميع أنواع الأكريلك.'}));
templates.push(template('palight-print','PVC فوم PALIGHT Print للطباعة','pvc',{manufacturer:'Palram',color:'أبيض',compatibleProcess:'طباعة عريضة',description:'فئة Print من المصنع. المقاس والسماكة صفر إلى أن يؤكدهما المورد؛ ليس كل لوح PVC صالحا لكل تطبيق خارجي.'}));
templates.push(template('palight-colors','PVC فوم PALIGHT Colors ملون','pvc',{manufacturer:'Palram',finish:'مطفي',compatibleProcess:'تصنيع لوحات',description:'فئة Colors ذات سطح مطفي؛ أدخل رمز اللون والمقاس والسماكة الفعلية من المورد.'}));
templates.push(template('palight-outdoor-13','PVC فوم PALIGHT Outdoor سماكة 13 مم','pvc',{manufacturer:'Palram',thickness:13,color:'أبيض',compatibleProcess:'لوحات خارجية',description:'مثال سماكة 13 مم منشور لفئة Outdoor؛ يحتاج المقاس والدفعة والتوافق والتعليمات المعتمدة.'}));
for(const thickness of [3,6])templates.push(template('dibond-'+thickness,'ألمنيوم مركب DIBOND سماكة '+thickness+' مم','acp',{category:'letters',manufacturer:'3A Composites',thickness,compatibleProcess:'طباعة وتصنيع لوحات',description:'مثال سماكة ضمن مجال دليل DIBOND 2–6 مم. جلد الألمنيوم 0.3 مم لكل وجه في المنتج المشار إليه؛ نوع القلب واللون والمقاس يؤكدها المورد، ولا تعمم على ACP آخر.'}));
for(const item of [{id:'hp-backlit-914',width:91.4,part:'CR660B'},{id:'hp-backlit-1372',width:137.2,part:'CR662B'}])templates.push(template(item.id,'فيلم بوليستر باك لايت HP '+item.width+' سم','backlit',{category:'banners',form:'roll',baseUnit:'m',unit:'متر',manufacturer:'HP',manufacturerPartNo:item.part,width:item.width,height:3050,thickness:.22,gsm:275,finish:'مطفي',purchaseUnits:[{name:'رول اسمي 30.5 متر',factor:30.5}],compatibleProcess:'HP Latex / حبر مائي متوافق',description:'فيلم بوليستر 220 ميكرون، 275 جم/م²، رول اسمي 30.5 متر. أكد نوع الحبر والتوافق وإصدار بيانات المورد؛ السعر والمخزون غير مدخلين.'}));
templates.push(template('avery-mpi1105','فينيل لاصق مصبوب Avery MPI 1105','vinyl',{category:'stickers',form:'roll',baseUnit:'m',unit:'متر',manufacturer:'Avery Dennison',color:'أبيض',finish:'لامع',compatibleProcess:'Solvent / Eco-solvent / UV / Latex متوافق',description:'عائلة فيلم لاصق مصبوب للالتفاف. المقاسات والسماكة واللاصق واللامينيشن تتبع إصدار SKU الإقليمي؛ لم يختر القالب مقاس رول أو ادعاء عمر خدمة عام.'}));
templates.push(template('hp-opaque-scrim','بنر فينيل HP Opaque Scrim','banner',{category:'banners',form:'roll',baseUnit:'m',unit:'متر',manufacturer:'HP',manufacturerPartNo:'Q1902C',width:152.4,height:1520,thickness:.378,gsm:0,finish:'مطفي',purchaseUnits:[{name:'رول اسمي 15.2 متر',factor:15.2}],compatibleProcess:'حبر مائي حسب توافق المصنع',description:'يوجد تعارض في GSM بين صفحات HP الرسمية (480 و495 و486)؛ ترك الوزن صفرا لحين التأكيد. المقاس الاسمي 1524 مم×15.2 م، وليس مواصفة عامة لجميع البنرات.'}));
for(const gsm of [80,120,250,350])templates.push(template('mondi-a4-'+gsm,'ورق Mondi Color Copy A4 وزن '+gsm+' جم/م²','paper',{category:'paper',unit:'ورقة',manufacturer:'Mondi',width:21,height:29.7,gsm,color:'أبيض',compatibleProcess:'طباعة رقمية متوافقة',description:'مثال من عائلة Color Copy original؛ GSM وزن مساحة وليس سماكة. عبوة الشراء وعدد أوراقها ومقاس الدفعة وتوافق الطابعة يؤكدها المورد؛ لا يفترض 500 ورقة لكل عبوة.'}));
for(const capacity of [700,1500])templates.push(template('epson-gs3-'+capacity,'حبر Epson GS3 عبوة مرجعية '+capacity+' مل','ink',{category:'banners',form:'liquid',baseUnit:'ml',unit:'مل',manufacturer:'Epson',purchaseUnits:[{name:'عبوة '+capacity+' مل',factor:capacity}],compatibleProcess:'Epson SureColor متوافق',description:'سعة ضمن عائلة GS3: خرطوشة حتى 700 مل أو حزمة حتى 1.5 لتر بحسب موديل الطابعة. أدخل اللون ورقم الخرطوشة الفعلي وتاريخها؛ الاستهلاك يشمل الصيانة وليس سعة طباعة مضمونة.'}));
templates.push(template('sloanled-se-12','وحدة SloanLED SE 12V','led',{category:'letters',form:'module',baseUnit:'piece',unit:'قطعة',manufacturer:'SloanLED',manufacturerPartNo:'701269-6WSK1-MB',width:2.2,height:1.1,voltage:12,wattsPerUnit:.43,cct:6500,color:'أبيض 6500K',purchaseUnits:[{name:'صينية 50 وحدة',factor:50}],compatibleProcess:'حروف مضيئة',description:'مرجع منتج محدد من ورقة Rev C لسنة 2019، 0.43 واط/وحدة. أكد الإصدار الحالي وحدود السلسلة ومزود الطاقة والكثافة بالتجربة؛ لا يفترض حد سلسلة من عدد وحدات العبوة.'}));
for(const voltage of [12,24])templates.push(template('meanwell-lpv60-'+voltage,'مزود Mean Well LPV-60-'+voltage+' جهد '+voltage+'V','supply',{category:'letters',form:'powerSupply',baseUnit:'piece',unit:'قطعة',manufacturer:'Mean Well',manufacturerPartNo:'LPV-60-'+voltage,voltage,powerSupplyWatts:60,compatibleProcess:'تغذية LED جهد ثابت',description:'مثال مزود جهد ثابت 60 واط لهذا الطراز تحديدا. شروط الحرارة والتركيب وخفض الحمل وتعليمات المصنع هي المرجع، ولا يفترض 80% لكل المنتجات.'}));
const gifts=[{id:'unisub-5995',part:'5995',name:'ميدالية ألمنيوم مستطيلة Unisub 5995',width:4.06,height:5.71,url:'https://www.unisub.com/product/aluminum-rectangle-key-chain-5995/'},{id:'unisub-4107',part:'4107',name:'ميدالية ألمنيوم مربعة Unisub 4107',width:5.72,height:5.72,url:'https://www.unisub.com/product/aluminum-square-key-chain-4107/'},{id:'unisub-5917',part:'5917',name:'ميدالية ألمنيوم بيضاوية Unisub 5917',width:3.49,height:6.35,url:'https://www.unisub.com/products/?_products=key-chains'}];
for(const g of gifts)templates.push(template(g.id,g.name,'gift',{category:'gifts',form:'piece',baseUnit:'piece',unit:'قطعة',manufacturer:'Unisub',manufacturerPartNo:g.part,width:g.width,height:g.height,thickness:1.14,color:'أبيض',finish:'لامع',purchaseUnits:[{name:'عبوة 50 قطعة',factor:50}],compatibleProcess:'سبلميشن على طلاء متوافق',sourceUrl:g.url,description:'قالب بلانك من بيانات المنتج مع طلاء سبلميشن؛ المقاس الخارجي لا يضمن مساحة طباعة الحافة. أكد العبوة وقالب التصميم وتعليمات الكبس للدفعة.'}));
templates.push(template('unisub-hardboard','بلانك هاردبورد مطلي Unisub','gift',{category:'gifts',form:'piece',baseUnit:'piece',unit:'قطعة',manufacturer:'Unisub',compatibleProcess:'سبلميشن على طلاء متوافق',sourceUrl:'https://www.unisub.com/wp-content/uploads/2025/04/Unisub-Digital-Catalog-USA-EMEA-2024-PRINT-version-compressed.pdf',description:'عائلة هاردبورد مطلية من الكتالوج الرسمي. المقاس والسماكة والشكل والتشطيب والعبوة تحدد من SKU فعلي قبل التشغيل؛ لا توجد حرارة أو مدة كبس عامة لكل البلانكات.'}));
const categories=[{id:'acrylic',name:'أكريلك ومشتقاته'},{id:'pvc',name:'PVC فوم'},{id:'acp',name:'ألمنيوم مركب'},{id:'backlit',name:'أفلام إضاءة خلفية'},{id:'vinyl',name:'فينيل لاصق'},{id:'banner',name:'بنرات ورولات'},{id:'paper',name:'ورق ومطبوعات'},{id:'ink',name:'أحبار'},{id:'led',name:'وحدات LED'},{id:'supply',name:'مزودات طاقة'},{id:'gift',name:'بلانكات هدايا'}];
return {templates,categories,sources,checkedAt:'2026-11-13',notice:'قوالب مرجعية بلا مخزون أو تكلفة مؤكدة. المقاسات والأسعار المحلية ومواصفات الدفعة تعتمد من المورد قبل التشغيل.'};
});

;
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./inventory-engine.js'));else root.WOMaterialBindings=factory(root.WOInventory);})(typeof globalThis!=='undefined'?globalThis:this,function(I){
 'use strict';
 const base=m=>m.baseUnit||({'لوح':'sheet','ورقة':'sheet','متر':'m','م':'m','م²':'m2','متر مربع':'m2','قطعة':'piece','وحدة':'piece','مل':'ml','ملل':'ml','كجم':'kg','كغ':'kg'}[m.unit]||'piece');
 function supports(m,type){const b=base(m);if(type==='letters')return false;if(type==='paper')return m.category==='paper'&&(m.form==='sheet'||b==='sheet');if(type==='sheet')return (m.form==='sheet'||b==='sheet')&&m.category!=='paper';if(type==='roll')return (m.form==='roll'||['m','m2'].includes(b)&&m.form!=='sheet')&&!['strip','module'].includes(m.form);if(type==='led')return ['module','strip','powerSupply'].includes(m.form);if(type==='general')return b==='piece'&&!['module','strip','powerSupply'].includes(m.form);return false;}
 function preset(m,type,inputs={}){if(!supports(m,type))throw new Error('هذه الخامة لا تناسب الحاسبة المحددة');if(type==='led'&&m.form==='powerSupply')return {powerSupplyPrice:m.costConfirmed===false?0:m.unitCost||0,...(m.powerSupplyWatts>0?{powerSupplyWatts:m.powerSupplyWatts}:{}),...(m.voltage>0?{voltage:m.voltage}:{})};const p=I.calculatorPreset(m,type);if(type==='general')p.materialCost=(m.costConfirmed===false?0:m.unitCost||0)*Number(inputs.quantity||1);return p;}
 function required(m,type,p,r){const b=base(m);if(['sheet','paper'].includes(type))return b==='sheet'?r.sheets:b==='m2'?r.sheets*p.sheetW*p.sheetH/10000:null;if(type==='roll')return b==='m'?r.linearMeters:b==='m2'?r.consumedArea:null;if(type==='led'){if(m.form==='powerSupply')return r.powerSupplies;if(m.form==='module'&&p.mode==='module')return r.count;if(m.form==='strip'&&p.mode==='strip')return b==='m'?r.rolls*p.rollLength:r.rolls;return null;}if(type==='general'&&b==='piece')return p.quantity;return null;}
 function calculatorType(m){return ['paper','sheet','led','roll','general'].find(type=>supports(m,type))||null;}
 return {base,supports,preset,required,calculatorType};
});

;
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.WOSyncCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clone=v=>JSON.parse(JSON.stringify(v));
  function checkCache(value){
    if(!value||typeof value!=='object')return;
    for(const [key,child] of Object.entries(value)){if(/password|^(authorization|cookie|csrfToken|sessionToken|accessToken|refreshToken|secret|credential)$/i.test(key))throw new Error('بيانات الدخول لا تحفظ ضمن العمليات أو المسودات المؤجلة');checkCache(child);}
  }
  function visibleState(record){return record?.queue?.some(q=>q.status!=='pending')?record?.state:(record?.optimisticState||record?.state);}
  function checkActions(actions){
    if(!Array.isArray(actions)||!actions.length||actions.length>100)throw new Error('لا توجد عمليات صالحة للحفظ');
    for(const action of actions){if(!action||typeof action.type!=='string'||!/^[a-z-]+\.[a-z-]+$/.test(action.type)||!action.payload||typeof action.payload!=='object')throw new Error('صيغة العملية غير صالحة');checkCache(action.payload);}
    return actions;
  }
  function enqueue(record,actions,state,id,now=new Date().toISOString()){
    checkActions(actions);checkCache(state);if(!record?.account?.id)throw new Error('سجل الدخول أولا');
    if(record.queue?.some(q=>q.status!=='pending'))throw new Error('راجع العملية المتعارضة قبل إضافة عملية جديدة');
    const next=clone(record);next.queue=next.queue||[];
    if(next.queue.some(q=>q.requestId===id))throw new Error('معرف طلب مكرر');
    if(next.queue.length>=200)throw new Error('وصلت العمليات المؤجلة إلى الحد الأقصى. اتصل بالخادم للمزامنة');
    next.queue.push({requestId:id,baseRevision:next.queue.length?next.queue[next.queue.length-1].baseRevision+1:next.revision,actions:clone(actions),createdAt:now,status:'pending'});
    next.optimisticState=clone(state);return next;
  }
  function acknowledge(record,id,response){
    if(record.queue?.[0]?.requestId!==id)throw new Error('ترتيب تأكيد العمليات غير صحيح');
    if(!Number.isInteger(response.revision)||response.revision<record.queue[0].baseRevision+1||!response.state)throw new Error('تأكيد الخادم غير صالح');
    const next=clone(record);next.queue.shift();if(response.revision>=next.revision){next.revision=response.revision;next.state=clone(response.state);}next.lastSyncedAt=new Date().toISOString();
    if(!next.queue.length)delete next.optimisticState;return next;
  }
  function reject(record,id,error){const next=clone(record),entry=next.queue?.find(q=>q.requestId===id);if(!entry)throw new Error('الطلب المؤجل غير موجود');entry.status=error.code==='REVISION_CONFLICT'?'conflict':'failed';entry.error={code:error.code||'REJECTED',message:String(error.message||'رفض الخادم العملية').slice(0,1000)};return next;}
  function info(record,online=true){const queue=record?.queue||[];return {count:queue.length,blocked:queue.some(q=>q.status!=='pending'),online,lastSyncedAt:record?.lastSyncedAt||null,entries:queue.map(q=>({requestId:q.requestId,status:q.status,createdAt:q.createdAt,types:q.actions.map(a=>a.type),error:q.error}))};}
  return {checkActions,checkCache,visibleState,enqueue,acknowledge,reject,info};
});

;
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.WOCommandCapture=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clone=v=>JSON.parse(JSON.stringify(v));
  function create(model,inventory){
    let enabled=false,depth=0,actions=[];
    const map={
      createOrder:(a,r)=>['order.create',{data:a[2],clientId:r.id}],updateOrder:a=>['order.update',{id:a[2],patch:a[3]}],assignTeam:a=>['order.team',{id:a[2],team:a[3]}],transitionOrder:a=>['order.transition',{id:a[2],status:a[3]}],
      acceptAssignment:a=>['task.accept',{id:a[2]}],completeAssignment:a=>['task.complete',{id:a[2],minutes:a[3]}],addOrderNote:a=>['order.note',{id:a[2],text:a[3]}],addOrderAttachment:a=>['order.photo',{id:a[2],attachment:a[3]}],addOrderCost:(a,r)=>['order.cost.add',{id:a[2],data:a[3],clientId:r.id}],reverseOrderCost:a=>['order.cost.reverse',{id:a[2],costId:a[3],reason:a[4]}],
      consumeMaterial:a=>['material.consume',{orderId:a[2],data:a[3]}],reserveRemnant:a=>['remnant.reserve',{id:a[2],orderId:a[3]}],releaseRemnant:a=>['remnant.release',{id:a[2]}],
      createPurchase:(a,r)=>['purchase.create',{data:a[2],clientId:r.id}],approvePurchase:a=>['purchase.approve',{id:a[2]}],rejectPurchase:a=>['purchase.reject',{id:a[2]}],receivePurchase:a=>['purchase.receive',{id:a[2]}]
    };
    const inventoryMap={createMaterial:(a,r)=>['material.create',{data:{...a[2],id:r.id}}],updateMaterial:a=>['material.update',{id:a[2],patch:a[3]}],adjust:a=>['material.adjust',{id:a[2],quantity:a[3],reason:a[4]}],reserve:a=>['material.reserve',{id:a[2],orderId:a[3],quantity:a[4]}],release:a=>['material.release',{reservationId:a[2]}],issue:a=>['material.consume',{orderId:a[2],data:a[3]}],receivePurchase:a=>['purchase.receive',{id:a[2]}],transfer:a=>['material.transfer',{id:a[2],toBranchId:a[3],quantity:a[4],reason:a[5]}]};
    function wrap(object,methods){if(!object)return;for(const [name,mapper] of Object.entries(methods)){const original=object[name];if(typeof original!=='function')continue;object[name]=function(...args){const outer=depth===0;depth++;try{const result=original.apply(this,args);if(enabled&&outer){const [type,payload]=mapper(args,result);actions.push({type,payload:clone(payload)});}return result;}finally{depth--;}};}}
    wrap(model,map);wrap(inventory,inventoryMap);
    function custom(action,id,state){if(!enabled)return;const find=(key)=>clone(state[key].find(x=>x.id===id));let entry;
      switch(action){
        case 'create_client':entry=['client.create',{data:find('clients')}];break;
        case 'create_branch':entry=['branch.create',{data:find('branches')}];break;
        case 'update_branch':{const branch=find('branches');entry=['branch.update',{id,patch:Object.fromEntries(['name','city','address','active'].filter(key=>branch[key]!==undefined).map(key=>[key,branch[key]]))}];break;}
        case 'create_material':entry=['material.create',{data:find('materials')}];break;
        case 'create_remnant':entry=['remnant.create',{data:find('remnants')}];break;
        case 'update_brand':entry=['brand.update',{patch:clone(state.brand)}];break;
        case 'update_pricing':entry=['pricing.update',{pricing:clone(state.settings.pricing)}];break;
        case 'update_prices':entry=['service-prices.update',{prices:clone(state.settings.servicePrices)}];break;
        case 'update_performance':entry=['performance.update',{weights:clone(state.settings.performance)}];break;
        case 'update_connections':entry=['connections.update',{publicBaseUrl:state.settings.publicBaseUrl||'',apiBaseUrl:state.settings.apiBaseUrl||''}];break;
        case 'update_permissions':entry=['user.permissions',{id,permissions:find('users').permissions}];break;
        case 'create_user':case 'update_user':throw new Error('إدارة الحسابات تتطلب الاتصال المباشر بالخادم');
        default:throw new Error('هذه العملية غير مربوطة بالخادم: '+action);
      }
      actions.push({type:entry[0],payload:entry[1]});
    }
    return {start(){actions=[];enabled=true;},finish(){enabled=false;return clone(actions);},cancel(){enabled=false;actions=[];},custom};
  }
  return {create};
});

;
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.WOTabLock=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function create(options={}){
    const locks=options.locks;
    let acquired=false,accountId=null,reason='يلزم فتح جلسة كتابة آمنة',generation=0,unlock=null,requestPromise=null;
    const status=()=>({acquired,accountId,reason,supported:typeof locks?.request==='function'});
    async function release(){
      generation++;acquired=false;reason='انتهت جلسة الكتابة في هذه النافذة؛ أعد تحميلها لاستئناف التعديل';
      const done=requestPromise;if(unlock){const resolve=unlock;unlock=null;resolve();}
      if(done)await done.catch(()=>{});
    }
    async function acquire(id){
      if(typeof id!=='string'||!id)throw new Error('معرف حساب القفل غير صالح');
      if(acquired&&accountId===id)return status();
      await release();accountId=id;
      if(typeof locks?.request!=='function'){reason='هذا المتصفح لا يدعم قفل الكتابة الآمن؛ العرض فقط. استخدم Chrome أو Edge عبر اتصال آمن';return status();}
      const ticket=++generation;
      let ready;
      const result=new Promise(resolve=>ready=resolve);
      try{
        requestPromise=Promise.resolve(locks.request('qodynex-account-writer:'+id,{mode:'exclusive',ifAvailable:true},lock=>{
          if(!lock||ticket!==generation){if(ticket===generation)reason='الحساب مفتوح للتعديل في نافذة أخرى؛ هذه النافذة للقراءة فقط. أغلق نافذة الكتابة ثم حدث الصفحة';ready({...status(),acquired:false});return;}
          acquired=true;reason='';
          const held=new Promise(resolve=>unlock=resolve);
          ready(status());return held;
        })).catch(()=>{if(ticket===generation){acquired=false;reason='تعذر الحصول على قفل كتابة آمن؛ هذه النافذة للقراءة فقط';}ready({...status(),acquired:false});});
      }catch(e){acquired=false;reason='تعذر الحصول على قفل كتابة آمن؛ هذه النافذة للقراءة فقط';ready(status());}
      return result;
    }
    return {acquire,release,status};
  }
  return {create};
});

;
(function(){
  'use strict';
  const connected=globalThis.WO_CONFIG?.mode==='connected';
  const core=globalThis.WOSyncCore, listeners=new Set();
  const tab=globalThis.WOTabLock.create({locks:navigator.locks}), writes=new Set();
  let closingWriter=false,lockRelease=null,lifecycleActive=true;
  const ownsWriter=()=>lifecycleActive&&!closingWriter&&tab.status().acquired;
  function queueInfo(){const readOnly=account?.kind==='tenant'&&!ownsWriter();return {...core.info(record,online),storageFailure,readOnly:!!readOnly,readOnlyReason:readOnly?(!lifecycleActive?'انتهت جلسة الكتابة لهذه النافذة؛ حدث الصفحة قبل التعديل':tab.status().reason||'هذه النافذة للقراءة فقط'):''};}
  function requireWriter(){if(!account||account.kind!=='tenant')throw new Error('سجل الدخول أولا');if(!ownsWriter())throw new Error(queueInfo().readOnlyReason||'هذه النافذة للقراءة فقط');}
  function shownState(){return ownsWriter()?core.visibleState(record):record?.state;}
  function releaseWriter(){if(lockRelease)return lockRelease;closingWriter=true;lockRelease=(async()=>{await Promise.allSettled([...writes]);await tab.release();})().finally(()=>{lockRelease=null;});return lockRelease;}
  async function acquireWriter(id){if(!lifecycleActive)return {...tab.status(),acquired:false};if(lockRelease)await lockRelease;const result=await tab.acquire(id);closingWriter=false;return result;}
  let record=null, account=null, csrf='', online=navigator.onLine, flushing=false, retryTimer=null, databasePromise=null, storageFailure='';
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  function emit(type,extra={}){for(const fn of listeners){try{fn({type,account:clone(account),state:clone(shownState()),revision:record?.revision,tenant:clone(record?.tenant),queue:queueInfo(),...extra});}catch(error){console.error(error);}}}
  function database(){if(!databasePromise)databasePromise=new Promise((resolve,reject)=>{const req=indexedDB.open('qodynex-operations-v2',1);req.onupgradeneeded=()=>req.result.createObjectStore('kv');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});return databasePromise;}
  async function storage(operation,key,value){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('kv',operation==='get'?'readonly':'readwrite'),store=tx.objectStore('kv');const req=operation==='get'?store.get(key):operation==='delete'?store.delete(key):store.put(value,key);let result;req.onsuccess=()=>{result=req.result;};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error||req.error);tx.onabort=()=>reject(tx.error||new Error('تعذر حفظ البيانات المحلية'));});}
  function persist(){
    if(!record)return Promise.resolve();requireWriter();core.checkCache(record);const saved=clone(record);
    const pending=(async()=>{try{await storage('set','account:'+saved.account.id,saved);await storage('set','active',saved.account.id);storageFailure='';}catch(e){storageFailure='تعذر حفظ العمليات على هذا الجهاز. حرر مساحة أو اسمح بتخزين بيانات الموقع.';throw new Error(storageFailure);}})();
    writes.add(pending);pending.then(()=>writes.delete(pending),()=>writes.delete(pending));return pending;
  }
  function errorOf(status,body){const data=body?.error||{};const err=new Error(data.message||'تعذر تنفيذ الطلب');err.code=data.code||'HTTP_'+status;err.status=status;err.details=data.details;return err;}
  async function request(path,method='GET',body){
    method=method.toUpperCase();
    if(connected&&account?.kind==='tenant'&&!['GET','HEAD'].includes(method)&&path!=='/api/login'&&!path.startsWith('/api/public/reviews/'))requireWriter();
    if(!/^\/api\//.test(path))throw new Error('عنوان الطلب غير صالح');
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
    try{
      const res=await fetch(path,{method,credentials:'same-origin',cache:'no-store',signal:controller.signal,headers:{Accept:'application/json',...(body!==undefined?{'Content-Type':'application/json'}:{}),...(method!=='GET'&&csrf?{'X-CSRF-Token':csrf}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
      let value;try{value=await res.json();}catch(e){throw errorOf(res.status,{error:{code:'INVALID_RESPONSE',message:'استجابة الخادم غير مكتملة'}});}
      if(!res.ok){const error=errorOf(res.status,value);if(error.code==='OFFLINE'){online=false;error.network=true;}if(account&&path!=='/api/login'&&!path.startsWith('/api/public/')&&(res.status===401||res.status===403&&['TENANT_SUSPENDED','TENANT_EXPIRED'].includes(error.code))){account=null;csrf='';await releaseWriter();error.authenticationHandled=true;emit('authentication',{message:error.message});}throw error;}
      online=true;return value;
    }catch(e){if(e.name==='AbortError'||e instanceof TypeError){online=false;const err=new Error('الاتصال غير متاح. سيبقى الطلب محفوظا حتى عودة الشبكة.');err.code='OFFLINE';err.network=true;throw err;}throw e;}finally{clearTimeout(timer);}
  }
  async function getRemoteState(){const response=await request('/api/state');if(!response.state||!Number.isInteger(response.revision))throw new Error('بيانات الخادم غير صالحة');if(account&&response.account?.id!==account.id)throw errorOf(401,{error:{code:'SESSION_CHANGED',message:'تغير حساب الجلسة؛ سجل الدخول بالحساب الصحيح'}});return response;}
  async function loadAccount(session){
    let previous=record;if(!previous){const active=await storage('get','active').catch(()=>null);previous=active?await storage('get','account:'+active).catch(()=>null):null;}
    if(previous?.queue?.length&&previous.account.id!==session.account.id){record=previous;account=null;csrf='';await releaseWriter();throw errorOf(401,{error:{code:'SESSION_CHANGED',message:'توجد عمليات مؤجلة لحساب سابق؛ سجل الدخول بالحساب الذي أنشأها أولا'}});}
    account=session.account;csrf=session.csrfToken||'';
    if(account.kind==='platform'){await releaseWriter();record=null;await storage('delete','active');return {mode:'connected',account:clone(account),offline:false};}
    await acquireWriter(account.id);
    const cached=await storage('get','account:'+account.id).catch(()=>null),response=await getRemoteState();
    record=cached?.account?.id===account.id?cached:{queue:[]};
    record.account=clone(account);record.tenant=response.tenant;record.state=response.state;record.revision=response.revision;record.lastSyncedAt=new Date().toISOString();
    // Pending commands keep their original revisions; a fresh snapshot never silently rebases them.
    if(!record.queue?.length){record.queue=[];delete record.optimisticState;}
    if(ownsWriter()){await persist();schedule(0);}return snapshot();
  }
  async function init(){
    if(!connected)return {mode:'demo',account:null};
    try{
      if(localStorage.getItem('wo-central-logged-out')==='1')return {mode:'connected',account:null};
      return await loadAccount(await request('/api/session'));
    }catch(e){
      if(e.status===401||e.status===403){account=null;csrf='';await releaseWriter();return {mode:'connected',account:null,error:e.message};}
      if(e.network){const active=await storage('get','active').catch(()=>null),cached=active?await storage('get','account:'+active).catch(()=>null):null;
        if(cached&&Date.now()-Date.parse(cached.lastSyncedAt)<86400000){record=cached;account=cached.account;await acquireWriter(account.id);return {...snapshot(),offline:true};}
      }
      account=null;await releaseWriter();return {mode:'connected',account:null,error:e.message};
    }
  }
  function snapshot(){return {mode:'connected',account:clone(account),state:clone(shownState()),revision:record?.revision,tenant:clone(record?.tenant),offline:!online,queue:queueInfo()};}
  async function login(email,password){
    if(flushing)throw new Error('انتظر انتهاء المزامنة قبل تبديل الحساب');
    if(record?.queue?.length&&record.account.email.toLowerCase()!==email.trim().toLowerCase())throw new Error('توجد عمليات مؤجلة للحساب السابق. راجعها أو صدرها قبل تبديل الحساب.');
    const session=await request('/api/login','POST',{email:email.trim(),password});localStorage.removeItem('wo-central-logged-out');return loadAccount(session);
  }
  async function logout(){
    if(account?.kind==='tenant')requireWriter();
    if(flushing)throw new Error('انتظر انتهاء المزامنة قبل تسجيل الخروج');
    if(record?.queue?.length)throw new Error('توجد عمليات غير متزامنة. افتح مركز المزامنة قبل تسجيل الخروج.');
    await request('/api/logout','POST',{});
    const previousId=record?.account.id;let cleanupError='';
    try{localStorage.setItem('wo-central-logged-out','1');}catch(e){cleanupError='تعذر حفظ علامة الخروج على الجهاز';}
    try{if(previousId)await storage('delete','account:'+previousId);await storage('delete','active');}catch(e){cleanupError='انتهت جلسة الخادم، وتعذر تنظيف نسخة الجهاز';}
    record=null;account=null;csrf='';clearTimeout(retryTimer);await releaseWriter();emit('logout',{message:cleanupError});
  }
  function schedule(delay=3000){clearTimeout(retryTimer);if(ownsWriter()&&record?.queue?.length&&!core.info(record,online).blocked)retryTimer=setTimeout(()=>flush(),delay);}
  async function flush(){
    if(flushing||!ownsWriter()||!record?.queue?.length||!account||core.info(record,online).blocked)return;
    flushing=true;
    try{
      // Reconfirm the cookie-bound identity and refresh CSRF after offline launch or reload.
      if(!csrf){const session=await request('/api/session');if(session.account.id!==record.account.id)throw errorOf(401,{error:{code:'SESSION_CHANGED',message:'سجل الدخول بالحساب الذي أنشأ العمليات المؤجلة'}});account=session.account;csrf=session.csrfToken;}
      while(ownsWriter()&&record.queue.length&&record.queue[0].status==='pending'){
        const item=clone(record.queue[0]);
        let response;
        try{response=await request('/api/commands','POST',{requestId:item.requestId,baseRevision:item.baseRevision,actions:item.actions});}
        catch(e){if(e.network||e.status>=500){online=false;emit('offline',{message:e.message});schedule(5000);break;}
          if(e.status===401||e.status===403&&['TENANT_SUSPENDED','TENANT_EXPIRED'].includes(e.code)){csrf='';account=null;await releaseWriter();if(!e.authenticationHandled)emit('authentication',{message:e.message});break;}
          record=core.reject(record,item.requestId,e);try{const latest=await getRemoteState();record.state=latest.state;record.revision=latest.revision;}catch(ignored){}await persist();emit('rejected',{state:clone(record.state),message:e.message});break;}
        if(response.account&&response.account.id!==record.account.id)throw errorOf(401,{error:{code:'SESSION_CHANGED',message:'تغير حساب الجلسة أثناء المزامنة'}});
        record=core.acknowledge(record,item.requestId,response);
        // A successful server mutation stays acknowledged even if local persistence fails.
        // The older durable request can safely replay under its original idempotency key.
        try{await persist();}catch(e){emit(record.queue.length?'queue':'confirmed',{message:'أكد الخادم العملية، لكن تعذر تحديث نسخة الجهاز. '+e.message});schedule(5000);break;}
        emit(record.queue.length?'queue':'confirmed');
      }
    }catch(e){if(e.status===401||e.status===403){account=null;csrf='';await releaseWriter();}if(!e.authenticationHandled)emit(e.network?'offline':'authentication',{message:e.message});schedule(5000);}finally{flushing=false;}
  }
  async function commit(actions,optimisticState){
    if(!connected)return;requireWriter();
    const previous=record;record=core.enqueue(record,actions,optimisticState,'req_'+crypto.randomUUID().replaceAll('-',''));
    try{await persist();}catch(e){record=previous;throw e;}
    emit('queue');flush();return core.info(record,online);
  }
  async function refresh(){if(account?.kind==='tenant'&&!ownsWriter()){const result=await loadAccount(await request('/api/session'));emit('confirmed');return result;}if(record?.queue?.length){await flush();return snapshot();}const response=await getRemoteState();record={...record,account:account||response.account,state:response.state,revision:response.revision,tenant:response.tenant,queue:[],lastSyncedAt:new Date().toISOString()};delete record.optimisticState;await persist();emit('confirmed');return snapshot();}
  async function discardPending(){requireWriter();if(flushing)throw new Error('انتظر انتهاء المزامنة الجارية');if(!record?.queue?.length)return;await storage('set','archive:'+record.account.id+':'+Date.now(),{queue:record.queue,optimisticState:record.optimisticState,createdAt:new Date().toISOString()});const latest=await getRemoteState();record={...record,state:latest.state,revision:latest.revision,queue:[],lastSyncedAt:new Date().toISOString()};delete record.optimisticState;await persist();emit('confirmed');}
  function exportPending(){return JSON.stringify({format:'work-orders-pending-v2',account:{id:record?.account.id,email:record?.account.email},tenantId:record?.tenant?.id,exportedAt:new Date().toISOString(),queue:record?.queue||[],optimisticState:record?.optimisticState},null,2);}
  async function saveDrafts(drafts){if(!record)return;requireWriter();core.checkCache(drafts);record.drafts=clone(drafts);await persist();}
  async function getDrafts(){return clone(record?.drafts||{});}
  globalThis.WOTransport={init,login,logout,request,getSession:()=>({account:clone(account)}),getSnapshot:snapshot,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},commit,refresh,flush,queueInfo,exportPending,discardPending,saveDrafts,getDrafts};
  addEventListener('pagehide',()=>{lifecycleActive=false;clearTimeout(retryTimer);releaseWriter();emit('connection');});
  addEventListener('online',()=>{online=true;flush();emit('connection');});addEventListener('offline',()=>{online=false;emit('connection');});
})();

;
(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=n=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${WOCatalog.icons[n]||WOCatalog.icons.grid}</svg>`;
  const field=(label,name,type='text',attrs='')=>`<div class="field"><label for="central-${name}">${label}</label><input id="central-${name}" name="${name}" type="${type}" ${attrs}></div>`;
  function login({error='',loading=false,logo=''}){return `<div class="login-page central-login"><section class="login-brand"><div><div class="awamer-login-lockup"><img src="${esc(globalThis.WO_ASSETS?.systemLogo||'/assets/app-mark.svg')}" alt="شعار أوامر، نظام أوامر العمل والتشغيل"></div><div class="eyebrow" style="color:#f0d392">أوامر | نظام أوامر العمل والتشغيل</div><h1>عمل منظم.<br>وفريق يعرف خطوته التالية.</h1><p>من أول مقاس إلى آخر تسليم. أوامر العمل والخامات والفروع في مساحة واحدة.</p><div class="login-icons">${['orders','scissors','inventory','users'].map((n,i)=>`<span class="app-icon" style="--ic:${['#8c63d5','#16b6b5','#eea85e','#5b9ed9'][i]}">${icon(n)}</span>`).join('')}</div><div class="tiny mt" style="color:#decfee">واجهة موحدة للمنشأة وموظفيها على الكمبيوتر والجوال</div></div></section><section class="login-form"><div class="login-inner"><div class="eyebrow">نظام أوامر العمل والتشغيل</div><h2>أهلا بعودتك</h2><p class="muted tiny">ادخل حسابك؛ تظهر مساحة العمل والصلاحيات الخاصة بك تلقائيا.</p>${error?`<div class="alert-box orange mt" role="alert">${esc(error)}</div>`:''}<form id="central-login-form" class="stack mt">${field('البريد الإلكتروني','email','email','autocomplete="username" required maxlength="254" dir="ltr" placeholder="name@company.com"')}${field('كلمة المرور','password','password','autocomplete="current-password" required minlength="10" maxlength="200"')}<button class="btn primary full" type="submit" ${loading?'disabled':''}>${icon('shield')} ${loading?'جار تسجيل الدخول…':'دخول إلى مساحة العمل'}</button></form><div class="login-note">حساب مالك المنصة يفتح إدارة المنشآت والحسابات. حساب المنشأة أو الموظف يفتح التطبيق نفسه حسب صلاحياته.</div><p class="tiny muted text-center mt">لتفعيل حساب أو إعادة ضبطه، تواصل مع مدير منشأتك.</p></div></section></div>`;}
  const labels={'order.create':'إنشاء أمر عمل','order.update':'تعديل أمر عمل','order.team':'توزيع فريق','order.transition':'تحديث مرحلة','task.accept':'استلام مهمة','task.complete':'إنجاز مهمة','order.note':'توثيق ملاحظة','order.photo':'توثيق صورة','material.consume':'صرف خامة','material.create':'إضافة خامة','material.update':'تعديل خامة','material.reserve':'حجز خامة','material.release':'تحرير حجز','material.adjust':'جرد مخزون','material.transfer':'تحويل مخزون','purchase.create':'طلب شراء','purchase.approve':'اعتماد شراء','purchase.receive':'استلام مشتريات','purchase.reject':'رفض شراء','remnant.create':'إضافة باقي','remnant.reserve':'حجز باقي','remnant.release':'تحرير باقي','client.create':'إضافة عميل','branch.create':'إضافة فرع','branch.update':'تعديل فرع','brand.update':'تحديث الهوية','pricing.update':'تحديث التسعير','performance.update':'تحديث الأداء','service-prices.update':'تحديث قائمة الأسعار','user.permissions':'تحديث صلاحيات'};
  function sync(info){return `<div class="page-title"><div class="eyebrow">اتصال واضح وعمليات محفوظة</div><h1>مركز المزامنة</h1><p>الطلب لا يعد محفوظا على الخادم إلا بعد تأكيده.</p></div><div class="grid three"><section class="card"><div class="tiny muted">الاتصال</div><h2>${info.online?'متصل بالخادم':'العمل دون اتصال'}</h2></section><section class="card"><div class="tiny muted">بانتظار التأكيد</div><h2>${info.count} عملية</h2></section><section class="card"><div class="tiny muted">آخر مزامنة مؤكدة</div><h3>${info.lastSyncedAt?new Date(info.lastSyncedAt).toLocaleString('ar-SA-u-ca-gregory'):'لم تتم بعد'}</h3></section></div>${info.readOnly?`<div class="alert-box orange mt">${esc(info.readOnlyReason)}</div>`:''}${info.blocked?'<div class="alert-box orange mt">توقف الإرسال لحماية آخر بيانات الخادم. طلبك محفوظ للمراجعة والتصدير؛ لم تتم الكتابة فوق تعديل مستخدم آخر.</div>':''}${info.storageFailure?`<div class="alert-box orange mt">${esc(info.storageFailure)}</div>`:''}<section class="card mt"><div class="card-head"><h2>العمليات المؤجلة</h2><button class="btn soft" data-action="central-sync">${icon('refresh')} محاولة المزامنة</button></div>${info.entries.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>العملية</th><th>الوقت</th><th>الحالة</th><th>الملاحظة</th></tr></thead><tbody>${info.entries.map(e=>`<tr><td>${e.types.map(t=>esc(labels[t]||'تحديث تشغيل')).join('، ')}</td><td>${new Date(e.createdAt).toLocaleString('ar-SA-u-ca-gregory')}</td><td><span class="tag ${e.status==='pending'?'blue':'orange'}">${e.status==='pending'?'بانتظار الإرسال':e.status==='conflict'?'تعارض يحتاج مراجعة':'لم يعتمد الخادم'}</span></td><td>${esc(e.error?.message||'')}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty"><h3>كل العمليات مؤكدة</h3><p>تستطيع متابعة العمل أو تسجيل الخروج.</p></div>'}<div class="form-actions"><button class="btn" data-action="central-export-pending">${icon('download')} تصدير طلباتي المحفوظة</button>${info.count?'<button class="btn danger" data-action="central-discard-pending">أرشفة الطلبات والرجوع لبيانات الخادم</button>':''}</div><p class="field-note">الأرشفة لا تطبق الطلبات على الخادم. تُحفظ نسخة محلية ويُنزّل ملف بالمحتوى لتراجع العمل وتعيد إدخاله عند الحاجة.</p></section>`;}
  function settings({tab,tenant,account}){return `<div class="page-title"><div class="eyebrow">نظام أوامر العمل والتشغيل</div><h1>${tab==='backup'?'النسخ الاحتياطي وحماية الحساب':'الاتصال والتثبيت'}</h1><p>${esc(tenant?.name||'منشأتك')} · ${esc(account?.email||'')}</p></div><div class="tabs">${[['brand','الهوية'],['pricing','التسعير'],['permissions','الصلاحيات'],['performance','الأداء'],['connections','الاتصال والتثبيت'],['backup','النسخ والحساب']].map(([id,text])=>`<button class="tab ${tab===id?'active':''}" data-action="tab" data-key="settingsTab" data-value="${id}">${text}</button>`).join('')}</div><div class="grid two">${tab==='backup'?`<section class="card"><h2>نسخة بيانات المنشأة</h2><p class="tiny muted mt">تنزيل نسخة من الخادم للمالك المخول. الاستعادة التشغيلية من قاعدة الخادم تتم بأداة الإدارة مع إيقاف الكتابة أثناء الاستعادة.</p><button class="btn primary full mt" data-action="export-backup">${icon('download')} تنزيل نسخة الخادم</button><p class="field-note">الملف لا يحتوي كلمات المرور أو الجلسات. احتفظ به في مكان خاص بمنشأتك.</p></section><section class="card"><h2>تغيير كلمة المرور</h2><form id="central-password-form" class="stack mt">${field('كلمة المرور الحالية','currentPassword','password','required autocomplete="current-password"')}${field('كلمة المرور الجديدة','newPassword','password','required minlength="12" maxlength="200" autocomplete="new-password"')}${field('تأكيد كلمة المرور الجديدة','confirmPassword','password','required minlength="12" maxlength="200" autocomplete="new-password"')}<button class="btn primary" type="submit">حفظ كلمة المرور</button></form></section>`:`<section class="card"><h2>تثبيت التطبيق</h2><p class="tiny muted mt">نفس مساحة العمل والصلاحيات في Windows وAndroid. استخدم زر التثبيت إذا ظهر، أو اختر تثبيت التطبيق من قائمة Chrome أو Edge.</p><button class="btn primary full mt" data-action="central-install">${icon('download')} تثبيت على هذا الجهاز</button><p class="field-note">يتطلب التثبيت نشر التطبيق عبر HTTPS. أول دخول يحتاج اتصالا، ثم تحفظ الواجهة والمسودات والعمليات المؤجلة محليا.</p></section><section class="card"><h2>البيانات بين الأجهزة</h2><p class="tiny muted mt">الخادم يوحد حالة المنشأة. كل مستخدم يرى فروعه ومهامه المصرح بها. اضغط تحديث لجلب التغييرات الجديدة.</p><button class="btn soft full mt" data-action="central-refresh">${icon('refresh')} تحديث بيانات المنشأة</button><a class="btn full mt" href="#/sync">فتح مركز المزامنة</a></section><section class="card"><h2>تقييمات العملاء</h2><p class="tiny muted mt">QR الأمر المسلّم يفتح صفحة عامة دون تسجيل دخول. التقييم يحفظ على الخادم ويظهر للإدارة بعد التحديث.</p><a class="btn full mt" href="#/reviews">بطاقات التقييم</a></section><section class="card"><h2>تقارير واتساب</h2><p class="tiny muted mt">جهز تقرير التشغيل وانسخه. الإرسال الآلي يحتاج إعداد حساب WhatsApp Business وتفويضه في مرحلة التكامل.</p><button class="btn full mt" data-action="copy-summary">${icon('copy')} نسخ تقرير التشغيل</button></section>`}</div>`;}
  function accountPage({account,tenant,role}){return `<div class="page-title"><div class="eyebrow">مساحة شخصية لكل فرد في الفريق</div><h1>حسابي والجهاز</h1><p>بيانات دخولك وإعدادات هذا الجهاز</p></div><div class="grid two"><section class="card"><h2>${esc(account?.name||'حسابي')}</h2><p class="muted mt">${esc(tenant?.name||'')} · ${esc(role||'')}</p><p class="mt" dir="ltr">${esc(account?.email||'')}</p><div class="form-actions"><button class="btn" data-action="switch-user">${icon('shield')} تسجيل الخروج</button></div></section><section class="card"><h2>التثبيت والاتصال</h2><p class="tiny muted mt">تستطيع تثبيت نفس التطبيق من Chrome أو Edge على Windows وAndroid بعد نشره عبر HTTPS.</p><button class="btn primary full mt" data-action="central-install">${icon('download')} تثبيت على هذا الجهاز</button><a class="btn full mt" href="#/sync">${icon('refresh')} مركز المزامنة</a></section><section class="card"><h2>تغيير كلمة المرور</h2><form id="central-password-form" class="stack mt">${field('كلمة المرور الحالية','currentPassword','password','required autocomplete="current-password"')}${field('كلمة المرور الجديدة','newPassword','password','required minlength="12" maxlength="200" autocomplete="new-password"')}${field('تأكيد كلمة المرور الجديدة','confirmPassword','password','required minlength="12" maxlength="200" autocomplete="new-password"')}<button class="btn primary" type="submit">حفظ كلمة المرور</button></form><p class="field-note">التغيير يتطلب اتصالا بالخادم ويلغي الجلسات الأخرى للحساب.</p></section></div>`;}
  function publicFeedback({data,error,rating=0,logo=''}){const brand=data?.brand||{};return `<main class="public-page"><section class="public-card">${logo?`<img class="public-logo" src="${esc(logo)}" alt="${esc(brand.name||'شعار المنشأة')}">`:''}<div class="eyebrow text-center">${esc(brand.name||'تقييم الخدمة')}</div>${error?`<h1 class="text-center">رابط التقييم غير متاح</h1><p class="muted mt">${esc(error)}</p>`:!data?'<h1 class="text-center">جار تحميل بطاقة التقييم…</h1>':data.reviewed?`<div class="empty">${icon('check')}<h1>شكرا لمشاركتك</h1><p>وصل تقييمك إلى إدارة المنشأة ومدير الفرع.</p></div>`:`<h1 class="text-center">كيف كانت تجربتك معنا؟</h1><p class="tiny muted text-center mt">${esc(data.order.title)} · #${esc(data.order.number)}</p><form id="central-feedback-form" data-token="${esc(data.token)}"><div class="rating-picker" aria-label="اختر عدد النجوم">${[1,2,3,4,5].map(n=>`<button type="button" class="rating-btn ${n<=rating?'active':''}" data-action="rating" data-value="${n}" aria-label="${n} نجوم">${icon('star')}</button>`).join('')}</div>${field('الاسم اختياري','name','text','maxlength="100" placeholder="يمكنك تركه فارغا"')}<div class="field mt"><label for="central-comment">تعليقك</label><textarea id="central-comment" name="comment" maxlength="2000" placeholder="رأيك يساعدنا على تحسين الخدمة"></textarea></div><div class="alert-box teal mt">التقييم يصل للإدارة ومدير الفرع ولا ينشر للعامة. لا تحتاج إلى حساب أو تسجيل دخول.</div><button class="btn primary full mt" type="submit">إرسال التقييم</button></form>`}</section></main>`;}
  globalThis.WOConnectedUI={login,sync,settings,accountPage,publicFeedback};
})();

;
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
;
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.WODocuments=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function amount(v,currency){const n=Number(v);return (Number.isFinite(n)?n:0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+esc(currency||'SAR');}
function safeImage(value){return typeof value==='string'&&(/^(\/assets\/[a-zA-Z0-9_-]+\.(?:svg|png|jpg|webp))$/.test(value)||/^data:image\/(png|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(value))?esc(value):'/assets/app-mark.svg';}
function block(label,value){return '<div class="document-block"><small>'+esc(label)+'</small><strong>'+esc(value??'—')+'</strong></div>';}
function table(headers,rows){return '<table class="document-table"><thead><tr>'+headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';}
function section(title,body){return '<section class="document-section"><h2>'+esc(title)+'</h2>'+body+'</section>';}
function header(c,title){const o=c.order,b=c.brand||{};return '<div class="print-header"><div><div class="document-overline">AWAMER · نظام أوامر العمل والتشغيل</div><h1 class="document-title">'+esc(title)+'</h1><p>'+esc(b.name||'المنشأة')+' · '+esc(b.activity||'')+'</p><p>مرجع المستند: <strong>'+esc(o.number)+'</strong></p></div><img src="'+safeImage(c.logo)+'" alt="شعار المنشأة"></div>';}
function footer(c){const b=c.brand||{};return '<div class="document-footer"><div>'+esc(b.footer||b.name||'')+'<p>أوامر · '+esc(c.issuedAt||new Date().toISOString().slice(0,10))+'</p></div>'+(typeof c.qrHtml==='string'&&c.qrHtml.startsWith('<svg')?c.qrHtml:'')+'</div>';}
function meta(c){const o=c.order;return '<div class="document-grid">'+block('العميل',c.client?.name)+block('الفرع',c.branch)+block('تاريخ الإصدار',c.issuedAt)+block('موعد التسليم',c.dueAt)+block('رقم أمر العمل',o.number)+block('الحالة',c.status)+'</div>';}
function spec(c){const o=c.order;return section('مواصفات العمل',table(['البيان','الكمية','المقاس','اعتماد التصميم'],[[o.title,o.quantity,o.width+' × '+o.height+' '+o.unit,o.designApproved?'معتمد داخليا':'بانتظار اعتماد المسؤول']]));}
function preview(c){const src=c.order?.designDataUrl;return typeof src==='string'&&/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/i.test(src)?section('التصميم المرفق','<div class="document-preview"><img src="'+esc(src)+'" alt="نسخة التصميم المرفقة بأمر العمل"></div>'):'';}
function signatures(one='توقيع المسؤول',two='توقيع المستلم'){return '<div class="document-signatures"><div>'+esc(one)+'</div><div>'+esc(two)+'</div></div>';}
function workOrder(c){const o=c.order,team=(c.team||[]).map(a=>[a.name,a.share+'%',a.plannedMinutes+' دقيقة',a.dueAt||c.dueAt,a.done?'منجز':'بانتظار التنفيذ']);
 return header(c,'أمر عمل وتشغيل')+meta(c)+spec(c)+preview(c)+section('تعليمات التنفيذ','<p>'+esc(o.description||'لا توجد تعليمات إضافية.')+'</p>')+(team.length?section('فريق التنفيذ',table(['الموظف','نسبة العمل','الوقت المخطط','موعد المهمة','الحالة'],team)):'')+(c.canFinancial?section('التكاليف الداخلية',table(['سعر البيع','التكلفة التقديرية','التكاليف المسجلة'],[[amount(o.salePrice,c.currency),amount(o.estimatedCost,c.currency),amount(o.actualCost,c.currency)]])):'')+signatures('مسؤول الإنتاج','اعتماد التسليم')+footer(c);}
function quotation(c){if(!c.canFinancial||!c.canManageOrders)throw Error('عرض السعر يتطلب صلاحية مالية وإدارة أوامر العمل');const o=c.order;
 return header(c,'عرض سعر')+meta(c)+section('تفاصيل الخدمة',table(['العمل','الكمية','المقاس','الإجمالي'],[[o.title,o.quantity,o.width+' × '+o.height+' '+o.unit,amount(o.salePrice,c.currency)]]))+'<div class="document-block"><small>إجمالي العرض</small><strong>'+amount(o.salePrice,c.currency)+'</strong></div>'+section('الشروط والملاحظات','<p>'+esc(o.description||'تحدد التفاصيل النهائية بعد اعتماد التصميم والمقاسات.')+'</p>')+'<p class="tiny muted">هذا عرض سعر غير ضريبي، ولا يعتبر فاتورة أو سند قبض. راجع السعر قبل اعتماده وإرساله.</p>'+signatures('اعتماد المنشأة','موافقة العميل')+footer(c);}
function delivery(c){if(c.order.status!=='delivered')throw Error('يجب تسجيل تسليم أمر العمل قبل إصدار محضر التسليم');const o=c.order;
 return header(c,'محضر تسليم واستلام')+meta(c)+section('العمل المسلم',table(['الوصف','الكمية','المقاس','حالة التسليم'],[[o.title,o.quantity,o.width+' × '+o.height+' '+o.unit,'تم التسليم']]))+section('إقرار الاستلام','<p>تم تسليم العمل الموضح أعلاه بعد مراجعة الكمية والمواصفات. تثبت أي ملاحظات إضافية في المساحة أدناه.</p><div class="document-block"><small>ملاحظات المستلم</small><strong>_______________________________________</strong></div>')+signatures('المسلم','المستلم')+footer(c);}
function approval(c){if(!c.order.proofRequired||c.order.proofStatus!=='approved')throw Error('لا يوجد اعتماد عميل مسجل على أحدث إصدار');const o=c.order,d=o.proofDecision||{};return header(c,'إثبات مراجعة التصميم')+meta(c)+preview(c)+section('قرار العميل',table(['الإصدار','القرار','التاريخ','اسم المراجع'],[[o.proofRevision,'موافق على التصميم',d.at||'—',d.name||'غير محدد']]))+section('الملاحظات','<p>'+esc(d.comment||'لم يسجل العميل ملاحظات إضافية.')+'</p>')+'<p class="tiny muted">هذا توثيق لقرار سجلته صفحة المراجعة، وليس توقيعا إلكترونيا معتمدا قانونيا.</p>'+footer(c);}
function render(type,ctx){if(!ctx||!ctx.order)throw Error('أمر العمل غير متاح');const formats={workOrder,quotation,delivery,approval};if(!Object.prototype.hasOwnProperty.call(formats,type))throw Error('قالب مستند غير معروف');return formats[type](ctx);}
return {render,amount};
});
;
/* Qodynex platform console. Server-authoritative; no demo tenants or credential storage. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.WOPlatform = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const count = value => Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0).toLocaleString('en-US');
  const paths = {
    grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    company:'<path d="M4 21V4h11v17M15 10h5v11M2 21h20M8 8h3m-3 4h3m-3 4h3m6-2h1m-1 4h1"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5"/>',
    check:'<path d="m4 12 5 5L20 6"/>', search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    plus:'<path d="M12 4v16M4 12h16"/>', arrow:'<path d="M21 12H3m7-7-7 7 7 7"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    logout:'<path d="M10 3H4v18h6m4-14 5 5-5 5M8 12h12"/>',
    refresh:'<path d="M20 9a8 8 0 0 0-14-4L3 8m0-6v6h6M4 15a8 8 0 0 0 14 4l3-3m0 6v-6h-6"/>',
    shield:'<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6zM8 12l3 3 5-6"/>',
    key:'<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-4-4 3-3m-6 0 3-3"/>',
    edit:'<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14z"/>',
    alert:'<path d="m12 3 10 18H2zM12 9v5m0 3v1"/>'
  };
  const icon = name => '<svg class="p-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.company)+'</svg>';
  const mark = '<svg class="p-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect width="64" height="64" rx="20" fill="currentColor"/><path d="M43 33a13 13 0 1 0-11 13c3 0 5-.8 7-2.2l7 7" stroke="white" stroke-width="5" stroke-linecap="round"/><path d="m34 30 6 6 9-12" stroke="#65E3D2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function date(value) {
    if (!value) return 'غير محدد';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'تاريخ غير صالح' : parsed.toLocaleDateString('ar-SA-u-ca-gregory',{year:'numeric',month:'short',day:'numeric'});
  }
  const dateField = value => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toISOString().slice(0,10) : '';
  const errorMessage = error => String(error && (error.error?.message || error.message) || 'تعذر الاتصال بالخادم. حاول مرة أخرى.');
  function mount(options) {
    if (!options || !options.root || typeof options.api !== 'function') throw new Error('WOPlatform.mount requires root and api.');
    const container=options.root, request=options.api;
    const model={view:'overview',tenants:[],events:[],loaded:false,loading:true,busy:false,query:'',filter:'all',error:'',success:'',form:null,draft:{},confirmation:null,destroyed:false};
    const account=options.account||{};
    let generation=0;
    function tenant(id) { return model.tenants.find(item=>String(item.id)===String(id)); }
    async function api(path,method,body) {
      const result=await request(path,method||'GET',body);
      if (result && result.error) throw result;
      return result || {};
    }
    function stats() {
      const now=Date.now(),limit=now+30*86400000;
      return {total:model.tenants.length,active:model.tenants.filter(t=>t.status==='active').length,suspended:model.tenants.filter(t=>t.status==='suspended').length,
        users:model.tenants.reduce((sum,t)=>sum+(Number(t.userCount)||0),0),branches:model.tenants.reduce((sum,t)=>sum+(Number(t.branchCount)||0),0),
        expiring:model.tenants.filter(t=>t.expiresAt&&new Date(t.expiresAt).getTime()>=now&&new Date(t.expiresAt).getTime()<=limit).length};
    }
    function status(item) { const suspended=item.status==='suspended';return '<span class="p-status '+(suspended?'suspended':'active')+'"><i></i>'+(suspended?'معلقة':'نشطة')+'</span>'; }
    function expiry(item) { const expired=item.expiresAt&&new Date(item.expiresAt).getTime()<Date.now();return '<span class="'+(expired?'p-expired':'')+'">'+(expired?'منتهية · ':'')+esc(date(item.expiresAt))+'</span>'; }
    function button(label,action,cls='',id='') { return '<button type="button" class="p-button '+cls+'" data-p-action="'+action+'"'+(id?' data-id="'+esc(id)+'"':'')+(model.busy?' disabled':'')+'>'+label+'</button>'; }
    function field(label,name,value='',type='text',attrs='',help='') { return '<div class="p-field"><label for="p-'+name+'">'+label+'</label><input id="p-'+name+'" name="'+name+'" type="'+type+'"'+(type==='password'?'':' value="'+esc(value)+'"')+' '+attrs+'>'+ (help?'<small>'+help+'</small>':'')+'</div>'; }
    function submit(label) {return '<button class="p-button primary" type="submit"'+(model.busy?' disabled':'')+'>'+(model.busy?'جار الحفظ…':label)+'</button>';}
    function feedback() { return '<div id="p-feedback" aria-live="polite">'+(model.error?'<div class="p-notice error" role="alert">'+icon('alert')+'<span>'+esc(model.error)+'</span></div>':'')+(model.success?'<div class="p-notice success" role="status">'+icon('check')+'<span>'+esc(model.success)+'</span></div>':'')+'</div>'; }
    function overview() {
      const s=stats();
      return (model.loaded&&!model.tenants.length?'<section class="p-first-run"><h3>ابدأ بإنشاء أول منشأة</h3><p>أضف اسم المنشأة وبيانات مالكها، ثم ادخل بحساب المالك لإضافة الموظفين والخامات وأول أمر عمل.</p>'+button(icon('plus')+'إنشاء أول منشأة','create','primary')+'</section>':'')+'<section class="p-hero"><div><span class="p-eyebrow">أوامر · لوحة مالك المنصة</span><h1>مساحة واضحة لكل منشأة.</h1><p>أدر الاشتراكات والحسابات وحدود الاستخدام من مكان واحد، مع بقاء بيانات كل منشأة مستقلة.</p>'+button(icon('plus')+'إنشاء منشأة','create','light')+'</div><div class="p-hero-art" aria-hidden="true">'+mark+'<span>'+icon('company')+'</span><span>'+icon('shield')+'</span></div></section>'+statCards(s)+'<div class="p-section-head"><div><h2>المنشآت على المنصة</h2><p>أحدث الحسابات المسجلة وحالة وصولها</p></div>'+button('عرض كل المنشآت '+icon('arrow'),'tenants','subtle')+'</div>'+tenantList(true);
    }
    function statCards(s) {return '<section class="p-stats" aria-label="إحصاءات المنصة">'+[['المنشآت المسجلة',s.total,'company','purple'],['منشآت نشطة',s.active,'check','teal'],['مستخدمون مسجلون',s.users,'users','blue'],['تنتهي خلال 30 يوما',s.expiring,'clock','amber']].map(([label,value,ic,color])=>'<article class="p-stat"><span class="p-stat-icon '+color+'">'+icon(ic)+'</span><div><span>'+label+'</span><strong>'+(model.loaded?count(value):'—')+'</strong></div></article>').join('')+'</section>';}
    function filtered() {const q=model.query.trim().toLocaleLowerCase();return model.tenants.filter(t=>(model.filter==='all'||t.status===model.filter)&&(!q||[t.name,t.slug,t.ownerEmail,t.id].some(value=>String(value||'').toLocaleLowerCase().includes(q))));}
    function tenantList(recent) {
      let items=recent?model.tenants.slice().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,6):filtered();
      if (!model.loaded) return model.loading?'<div class="p-empty" role="status">'+icon('refresh')+'<h3>جار تحميل المنشآت…</h3><p>نقرأ الحالة الحالية من الخادم.</p></div>':'<div class="p-empty">'+icon('alert')+'<h3>لم تحمل قائمة المنشآت</h3><p>راجع رسالة الخادم أعلاه، ثم أعد المحاولة.</p>'+button(icon('refresh')+'إعادة المحاولة','refresh','primary')+'</div>';
      if (!items.length) return '<div class="p-empty">'+icon('company')+'<h3>'+(model.tenants.length?'لا توجد نتائج مطابقة':'أول منشأة تبدأ من هنا')+'</h3><p>'+(model.tenants.length?'جرب اسما آخر أو غير تصفية الحالة.':'أنشئ المنشأة وحساب المالك، ثم تصبح مساحة العمل جاهزة للفروع والفريق.')+'</p>'+(model.tenants.length?'':button(icon('plus')+'إنشاء منشأة','create','primary'))+'</div>';
      const actions=t=>'<div class="p-row-actions">'+button(icon('edit')+'إدارة','edit','small',t.id)+button(icon('key')+'كلمة المرور','reset','small subtle',t.id)+'</div>';
      return '<div class="p-table-scroll"><table class="p-table"><thead><tr><th scope="col">المنشأة</th><th scope="col">الحالة</th><th scope="col">الاستخدام</th><th scope="col">انتهاء الصلاحية</th><th scope="col">الإدارة</th></tr></thead><tbody>'+items.map(t=>'<tr><td><div class="p-company-cell"><span class="p-company-avatar">'+esc(String(t.name||'م').slice(0,1))+'</span><div><strong>'+esc(t.name)+'</strong><small dir="ltr">'+esc(t.slug)+'</small><small dir="ltr">'+esc(t.ownerEmail||'')+'</small></div></div></td><td>'+status(t)+'</td><td><div class="p-usage"><span>'+count(t.userCount)+' / '+count(t.maxUsers)+' مستخدم</span><span>'+count(t.branchCount)+' / '+count(t.maxBranches)+' فرع</span><small>'+count(t.orderCount)+' أمر عمل</small></div></td><td>'+expiry(t)+'</td><td>'+actions(t)+'</td></tr>').join('')+'</tbody></table></div><div class="p-company-cards">'+items.map(t=>'<article class="p-company-card"><div class="p-company-top"><div><h3>'+esc(t.name)+'</h3><small dir="ltr">'+esc(t.ownerEmail||t.slug)+'</small></div>'+status(t)+'</div><div class="p-card-metrics"><span><b>'+count(t.userCount)+' / '+count(t.maxUsers)+'</b>مستخدم</span><span><b>'+count(t.branchCount)+' / '+count(t.maxBranches)+'</b>فرع</span><span><b>'+count(t.orderCount)+'</b>أمر عمل</span></div><p class="p-expiry-line">انتهاء الصلاحية: '+expiry(t)+'</p>'+actions(t)+'</article>').join('')+'</div>';
    }
    function tenantsView() {
      return '<div class="p-page-heading"><div><span class="p-eyebrow">إدارة مساحات العمل</span><h1>المنشآت والاشتراكات</h1><p>الحسابات والحدود وحالة الوصول الفعلية على الخادم.</p></div>'+button(icon('plus')+'منشأة جديدة','create','primary')+'</div>'+statCards(stats())+'<section class="p-panel"><div class="p-list-toolbar"><label class="p-search">'+icon('search')+'<input type="search" aria-label="البحث عن منشأة" placeholder="ابحث باسم المنشأة أو بريد المالك…" data-p-search value="'+esc(model.query)+'"></label><label class="p-filter">الحالة<select aria-label="تصفية حالة المنشآت" data-p-filter><option value="all"'+(model.filter==='all'?' selected':'')+'>جميع الحالات</option><option value="active"'+(model.filter==='active'?' selected':'')+'>نشطة</option><option value="suspended"'+(model.filter==='suspended'?' selected':'')+'>معلقة</option></select></label><span class="p-result-count" id="p-result-count">'+count(filtered().length)+' منشأة</span></div><div id="p-tenant-results">'+tenantList(false)+'</div></section>';
    }
    function formView() {
      const d=model.draft,t=tenant(d.id),creating=model.form==='create',resetting=model.form==='reset';
      const title=creating?'إنشاء منشأة جديدة':resetting?'تعيين كلمة مرور المالك':'إدارة المنشأة';
      if (!creating&&!t) return '<div class="p-empty"><h2>المنشأة غير متاحة</h2>'+button('العودة للمنشآت','tenants')+'</div>';
      const intro=creating?'أنشئ مساحة عمل مستقلة وحساب مالكها في خطوة واحدة.':resetting?'تغيير كلمة المرور يلغي جلسات المالك الحالية. كلمة المرور لا تحفظ في المتصفح.':'تطبق التغييرات على الخادم، وتتحقق الحدود مقابل الاستخدام الحالي.';
      const shared=field('اسم المنشأة','name',d.name||'','text','required maxlength="120" autocomplete="organization"')+field('الحد الأقصى للمستخدمين','maxUsers',d.maxUsers||10,'number','required min="1" max="100000" step="1"')+field('الحد الأقصى للفروع','maxBranches',d.maxBranches||3,'number','required min="1" max="10000" step="1"')+field('انتهاء الصلاحية','expiresAt',dateField(d.expiresAt),'date','required');
      let fields='';
      if (resetting) fields='<div class="p-notice warning">'+icon('key')+'<span>الحساب المستهدف: <b dir="ltr">'+esc(t.ownerEmail||'مالك المنشأة')+'</b>. ستحتاج إلى مشاركة كلمة المرور مع المالك عبر قناتك الآمنة.</span></div>'+field('كلمة المرور الجديدة','password','','password','required minlength="12" maxlength="200" autocomplete="new-password"','12 حرفا على الأقل. لن تعرض بعد الحفظ.');
      else if (creating) fields='<div class="p-form-section"><h2>بيانات المنشأة</h2><div class="p-form-grid">'+field('اسم المنشأة','name',d.name||'','text','required maxlength="120" autocomplete="organization"')+field('معرف المنشأة','slug',d.slug||'','text','required minlength="3" maxlength="64" pattern="[a-z0-9][a-z0-9-]*" dir="ltr" autocapitalize="none" spellcheck="false"','حروف إنجليزية صغيرة وأرقام وشرطات؛ مثال art-plus.')+field('الحد الأقصى للمستخدمين','maxUsers',d.maxUsers||10,'number','required min="1" max="100000" step="1"')+field('الحد الأقصى للفروع','maxBranches',d.maxBranches||3,'number','required min="1" max="10000" step="1"')+field('انتهاء الصلاحية','expiresAt',dateField(d.expiresAt),'date','required')+'<div class="p-field"><label for="p-currency">عملة عرض الأسعار</label><select id="p-currency" name="currency">'+[['SAR','ريال سعودي — SAR'],['YER','ريال يمني — YER'],['USD','دولار — USD']].map(([value,label])=>'<option value="'+value+'"'+((d.currency||'SAR')===value?' selected':'')+'>'+label+'</option>').join('')+'</select></div></div></div><div class="p-form-section"><h2>حساب مالك المنشأة</h2><p>ينشأ حساب المالك والفرع الأول مع المنشأة في معاملة واحدة.</p><div class="p-form-grid">'+field('اسم المالك','ownerName',d.ownerName||'','text','required maxlength="100" autocomplete="name"')+field('البريد الإلكتروني للمالك','ownerEmail',d.ownerEmail||'','email','required maxlength="254" autocomplete="username" dir="ltr" autocapitalize="none"')+field('كلمة مرور أولية','password','','password','required minlength="12" maxlength="200" autocomplete="new-password"','12 حرفا على الأقل. لا تحفظ كلمة المرور في المتصفح.')+'</div></div>';
      else fields='<div class="p-company-summary"><span class="p-company-avatar">'+esc(String(t.name||'م').slice(0,1))+'</span><div><h2>'+esc(t.name)+'</h2><span dir="ltr">'+esc(t.ownerEmail||t.slug)+'</span></div>'+status(t)+'</div><div class="p-form-grid">'+shared+'<div class="p-field"><label for="p-status">حالة الوصول</label><select id="p-status" name="status"><option value="active"'+(d.status==='active'?' selected':'')+'>نشطة — يسمح بتسجيل الدخول</option><option value="suspended"'+(d.status==='suspended'?' selected':'')+'>معلقة — يوقف الوصول</option></select></div></div><div class="p-notice neutral">'+icon('users')+'<span>الاستخدام الحالي: '+count(t.userCount)+' مستخدم و'+count(t.branchCount)+' فرع. لا يمكن خفض الحدود تحت العدد الموجود.</span></div>';
      const confirmation=model.confirmation?'<section class="p-suspension" role="region" aria-label="تأكيد تعليق المنشأة"><h3>'+icon('alert')+'تأكيد تعليق الوصول</h3><p>سيوقف وصول مستخدمي '+esc(t.name)+' وتلغى جلساتهم الحالية. تبقى بيانات المنشأة محفوظة.</p><label class="p-checkbox"><input type="checkbox" data-p-confirm-check> أفهم أثر التعليق وأريد المتابعة</label><div class="p-form-actions">'+button('تعليق المنشأة وحفظ التغييرات','confirm-suspend','danger')+button('العودة للتعديل','cancel-suspend','subtle')+'</div></section>':'';
      return '<div class="p-page-heading"><div><span class="p-eyebrow">'+(creating?'مساحة جديدة':'إعدادات الحساب')+'</span><h1>'+title+'</h1><p>'+intro+'</p></div>'+button(icon('arrow')+'المنشآت','tenants','subtle')+'</div><section class="p-panel p-edit-panel"><form data-p-form="'+model.form+'" autocomplete="on">'+fields+(model.confirmation?'':'<div class="p-form-actions">'+submit(creating?'إنشاء المنشأة وحساب المالك':resetting?'تغيير كلمة المرور وإلغاء الجلسات':'حفظ تغييرات المنشأة')+button('إلغاء','tenants','subtle')+'</div>')+'</form>'+confirmation+'</section>';
    }
    function auditView() {
      function details(value) {
        if (!value) return '';
        if (typeof value==='string') return value;
        return Object.entries(value).filter(([key])=>!/password|secret|token|credential/i.test(key)).map(([key,val])=>key+': '+(typeof val==='object'?'…':String(val))).join(' · ');
      }
      return '<div class="p-page-heading"><div><span class="p-eyebrow">شفافية الإدارة</span><h1>سجل عمليات المنصة</h1><p>إنشاء المنشآت وتحديث الوصول والحسابات، كما سجلها الخادم.</p></div>'+button(icon('refresh')+'تحديث السجل','refresh','subtle')+'</div><section class="p-panel">'+(model.events.length?'<ol class="p-audit-list">'+model.events.slice().sort((a,b)=>String(b.at||b.createdAt).localeCompare(String(a.at||a.createdAt))).map(e=>'<li><span class="p-audit-dot">'+icon('shield')+'</span><div><h3>'+esc(e.action||e.type||'عملية إدارية')+'</h3><p>'+esc(details(e.detail||e.details))+'</p><small>'+esc(e.actorName||e.actorEmail||e.accountId||e.actorId||'المنصة')+(e.tenantId?' · '+esc(tenant(e.tenantId)?.name||e.tenantId):'')+' · '+esc(date(e.at||e.createdAt))+'</small></div></li>').join('')+'</ol>':'<div class="p-empty">'+icon('shield')+'<h3>'+(model.loading?'جار تحميل السجل…':'لا توجد عمليات مسجلة')+'</h3><p>ستظهر أحداث إدارة المنصة هنا بعد تسجيلها على الخادم.</p></div>')+'</section>';
    }
    function render() {
      if(model.destroyed)return;
      if(account.kind!=='platform'){container.innerHTML='<main class="p-access-denied"><h1>هذه اللوحة مخصصة لمالك المنصة</h1><p>سجل الدخول بحساب منصة مخول للوصول إلى إدارة المنشآت.</p></main>';return;}
      const nav=[['overview','نظرة عامة','grid'],['tenants','المنشآت والاشتراكات','company'],['audit','سجل العمليات','shield']];
      container.innerHTML='<div class="platform-shell" dir="rtl"><aside class="p-sidebar"><a class="p-wordmark" href="#/platform" data-p-action="overview">'+('<img class="p-logo-awamer" src="'+esc(globalThis.WO_ASSETS?.systemLogo||'/assets/app-mark.svg')+'" alt="شعار أوامر">')+'<div><b>أوامر</b><small>إدارة المنصة والاشتراكات</small></div></a><span class="p-nav-caption">مساحة التحكم</span><nav aria-label="أقسام لوحة المنصة">'+nav.map(([id,label,ic])=>'<button data-p-action="'+id+'" class="p-nav-item '+(model.view===id&&!model.form?'active':'')+'"'+(model.view===id&&!model.form?' aria-current="page"':'')+'>'+icon(ic)+'<span>'+label+'</span></button>').join('')+'</nav><div class="p-sidebar-bottom"><div class="p-platform-badge">'+icon('shield')+' حساب مالك المنصة</div><small>هوية المنصة مستقلة عن هوية كل منشأة.</small></div></aside><main class="p-main"><header class="p-topbar"><div><span class="p-breadcrumb">لوحة المنصة</span><h2>'+esc(model.form?'إدارة الحساب':model.view==='audit'?'سجل العمليات':model.view==='tenants'?'المنشآت والاشتراكات':'نظرة عامة')+'</h2></div><div class="p-top-actions"><span class="p-account"><b>'+esc(account.name||'مالك المنصة')+'</b><small dir="ltr">'+esc(account.email||'')+'</small></span>'+button(icon('refresh')+'<span>تحديث</span>','refresh','icon-label')+button(icon('logout')+'<span>خروج</span>','logout','icon-label')+'</div></header><div class="p-content" aria-busy="'+model.loading+'">'+feedback()+(model.form?formView():model.view==='audit'?auditView():model.view==='tenants'?tenantsView():overview())+'<footer class="p-footer"><b lang="en">Qodynex</b><span>منصة تشغيل المنشآت · بيانات متصلة بالخادم</span></footer></div></main></div>';
    }
    function setMessage(error,success) {model.error=error||'';model.success=success||'';}
    async function refresh() {
      if(model.destroyed||account.kind!=='platform')return;
      const current=++generation;model.loading=true;model.error='';render();
      try {
        const result=await api('/api/platform/tenants','GET');
        if(model.destroyed||current!==generation)return;
        if(!Array.isArray(result.tenants))throw new Error('استجابة المنشآت غير صالحة. حاول التحديث.');
        model.tenants=result.tenants;model.loaded=true;
        if(model.view==='audit') {const audit=await api('/api/platform/audit','GET');if(model.destroyed||current!==generation)return;if(!Array.isArray(audit.events))throw new Error('استجابة سجل العمليات غير صالحة.');model.events=audit.events;}
      } catch(error) {if(!model.destroyed&&current===generation)model.error=errorMessage(error);}
      finally {if(!model.destroyed&&current===generation){model.loading=false;render();}}
    }
    function read(form,name) {const field=form.elements && form.elements.namedItem?form.elements.namedItem(name):form.querySelector('[name="'+name+'"]');return field?String(field.value||'').trim():'';}
    function secret(form) {const input=form.elements?.namedItem?form.elements.namedItem('password'):form.querySelector('[name="password"]');const value=input?input.value:'';if(input)input.value='';return value;}
    async function mutate(path,method,payload,success) {
      if(model.busy)return;
      model.busy=true;setMessage('','');render();
      try {
        await api(path,method,payload);
        if(model.destroyed)return;
        model.form=null;model.confirmation=null;model.draft={};model.view='tenants';model.success=success;
        await refresh();
      } catch(error) {if(!model.destroyed)model.error=errorMessage(error);}
      finally {if(payload&&Object.prototype.hasOwnProperty.call(payload,'password'))payload.password='';model.busy=false;render();}
    }
    async function submitForm(event) {
      const form=event.target;
      if(!form.matches?.('[data-p-form]'))return;
      event.preventDefault();if(model.busy)return;
      if(typeof form.reportValidity==='function'&&!form.reportValidity())return;
      setMessage('','');
      const type=form.dataset.pForm;
      if(type==='reset') {let password=secret(form);if(password.length<12){model.error='كلمة المرور يجب أن تتكون من 12 حرفا على الأقل.';render();return;}const pending=mutate('/api/platform/tenants/'+encodeURIComponent(model.draft.id)+'/reset-owner','POST',{password},'تم تغيير كلمة مرور المالك وإلغاء جلساته. لم تحفظ كلمة المرور في المتصفح.');password='';await pending;return;}
      const expiryInput=read(form,'expiresAt');
      const payload={name:read(form,'name'),maxUsers:Number(read(form,'maxUsers')),maxBranches:Number(read(form,'maxBranches')),expiresAt:expiryInput?new Date(expiryInput+'T23:59:59.999Z').toISOString():null};
      if(type==='create') {
        model.draft={...payload,slug:read(form,'slug'),ownerName:read(form,'ownerName'),ownerEmail:read(form,'ownerEmail'),currency:read(form,'currency')};
        let password=secret(form);if(password.length<12){model.error='كلمة المرور يجب أن تتكون من 12 حرفا على الأقل.';render();return;}
        const pending=mutate('/api/platform/tenants','POST',{...model.draft,password},'تم إنشاء المنشأة وحساب المالك بنجاح.');password='';await pending;
      } else {
        payload.status=read(form,'status');model.draft={id:model.draft.id,...payload};const existing=tenant(model.draft.id);
        if(existing&&existing.status!=='suspended'&&payload.status==='suspended'){model.confirmation=payload;render();return;}
        await mutate('/api/platform/tenants/'+encodeURIComponent(model.draft.id),'PATCH',payload,'تم حفظ إعدادات المنشأة.');
      }
    }
    async function click(event) {
      const el=event.target.closest?.('[data-p-action]');if(!el)return;
      event.preventDefault();if(model.busy)return;
      const action=el.dataset.pAction;setMessage('','');
      if(['overview','tenants','audit'].includes(action)){model.form=null;model.confirmation=null;model.draft={};model.view=action;if(action==='audit')await refresh();else render();}
      else if(action==='create'){model.form='create';model.confirmation=null;model.draft={maxUsers:10,maxBranches:3,currency:'SAR',expiresAt:new Date(Date.now()+30*86400000).toISOString()};render();}
      else if(action==='edit'||action==='reset'){const t=tenant(el.dataset.id);if(!t){model.error='لم تعد المنشأة متاحة. حدث القائمة.';render();return;}model.form=action;model.confirmation=null;model.draft={id:t.id,name:t.name,status:t.status,maxUsers:t.maxUsers,maxBranches:t.maxBranches,expiresAt:t.expiresAt};render();}
      else if(action==='refresh')await refresh();
      else if(action==='cancel-suspend'){model.confirmation=null;model.draft.status=tenant(model.draft.id)?.status||'active';render();}
      else if(action==='confirm-suspend') {if(!container.querySelector('[data-p-confirm-check]')?.checked){model.error='أكد فهم أثر تعليق الوصول أولا.';render();return;}const pending=model.confirmation;if(pending)await mutate('/api/platform/tenants/'+encodeURIComponent(model.draft.id),'PATCH',pending,'تم تعليق وصول المنشأة وحفظ التغييرات.');}
      else if(action==='logout') {model.busy=true;render();try{if(typeof options.onLogout==='function')await options.onLogout();else await api('/api/logout','POST',{});if(!model.destroyed)destroy();}catch(error){model.error=errorMessage(error);}finally{model.busy=false;render();}}
    }
    function input(event) {if(!event.target.matches?.('[data-p-search]'))return;model.query=event.target.value;const target=container.querySelector('#p-tenant-results');if(target)target.innerHTML=tenantList(false);const badge=container.querySelector('#p-result-count');if(badge)badge.textContent=count(filtered().length)+' منشأة';}
    function change(event) {if(event.target.matches?.('[data-p-filter]')){model.filter=event.target.value;render();}}
    container.addEventListener('click',click);container.addEventListener('submit',submitForm);container.addEventListener('input',input);container.addEventListener('change',change);
    render();
    function destroy(){model.destroyed=true;generation++;container.removeEventListener('click',click);container.removeEventListener('submit',submitForm);container.removeEventListener('input',input);container.removeEventListener('change',change);model.draft={};model.confirmation=null;}
    const ready=refresh();
    return {ready,refresh,destroy};
  }
  return {mount};
});

;
(function(){
 'use strict';
 const I=globalThis.WOInventory,K=globalThis.WOCatalog,T=globalThis.WOMaterialCatalog;
 let pane='stock',formMode='',selected='',templateId='',family='all';
 const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const n=v=>Number(v||0).toLocaleString('en-US',{maximumFractionDigits:3});
 const units={sheet:'لوح / ورقة',m:'متر طولي',m2:'متر مربع',piece:'قطعة',ml:'ملل',kg:'كجم'};
 const forms={sheet:'ألواح وورق',roll:'رول',piece:'قطعة جاهزة',liquid:'سائل أو حبر',strip:'شريط LED',module:'موديول LED',powerSupply:'مزود طاقة'};
 const buttons=(label,action,id='',cls='')=>`<button type="button" class="btn ${cls}" data-action="pro:${action}" data-id="${e(id)}">${label}</button>`;
 const input=(label,name,value='',type='text',extra='')=>`<div class="field"><label for="pro-${name}">${label}</label><input id="pro-${name}" name="${name}" type="${type}" value="${e(value)}" ${extra}></div>`;
 const select=(label,name,values,value='',extra='')=>`<div class="field"><label for="pro-${name}">${label}</label><select id="pro-${name}" name="${name}" ${extra}>${values.map(([key,label])=>`<option value="${e(key)}" ${String(key)===String(value)?'selected':''}>${e(label)}</option>`).join('')}</select></div>`;
 const allowed=(h,list)=>list.filter(x=>(h.branchId==='all'||h.branchId===x.branchId)&&h.allowedBranches.some(b=>b.id===x.branchId));
 const material=(h,id)=>allowed(h,h.state.materials).find(m=>m.id===id);
 const category=m=>K.categories.find(c=>c.id===m.category)?.name||m.category||'خامات';
 const formIcon=m=>({sheet:'paper',roll:'photo',piece:'package',liquid:'droplet',strip:'lightbulb',module:'lightbulb',powerSupply:'lightbulb'}[m.form]||'inventory');
 function heading(h){const list=allowed(h,h.state.materials),active=(h.state.stockReservations||[]).filter(r=>r.status==='active'&&list.some(m=>m.id===r.materialId)),low=list.filter(m=>I.availability(h.state,m.id).available<=m.minQuantity);return `<div class="page-title between"><div><div class="eyebrow">الخامة المناسبة. بالكمية الواضحة.</div><h1>الخامات والمخزون</h1><p>أصنافك وعبواتها ومحجوزاتها وبواقيها في مكان واحد</p></div><div class="row wrap">${buttons('قوالب الخامات','pane','templates','soft')}${buttons('+ خامة جديدة','new','','primary')}</div></div><div class="stats"><div class="stat"><span class="app-icon" style="--ic:#8864c6">${h.icon('inventory')}</span><div><div class="label">أصناف المخزون</div><div class="value">${list.length}</div></div></div><div class="stat"><span class="app-icon" style="--ic:#12aaa9">${h.icon('shield')}</span><div><div class="label">حجوزات جارية</div><div class="value">${active.length}</div></div></div><div class="stat"><span class="app-icon" style="--ic:#e8a354">${h.icon('alert')}</span><div><div class="label">تحتاج إعادة طلب</div><div class="value">${low.length}</div></div></div><div class="stat"><span class="app-icon" style="--ic:#6596d4">${h.icon('remnant')}</span><div><div class="label">بواقي متاحة</div><div class="value">${allowed(h,h.state.remnants).filter(r=>r.status==='available').length}</div></div></div></div><div class="tabs">${[['stock','الأصناف والأرصدة'],['templates','دليل الخامات'],['remnants','البواقي'],['reservations','المحجوز للأعمال'],['movements','حركات المخزون']].map(([id,label])=>`<button class="tab ${pane===id?'active':''}" data-action="pro:pane" data-id="${id}">${label}</button>`).join('')}</div>`;}
 function view(h){let body='';if(pane==='templates')body=templates(h);else if(pane==='remnants')body=remnants(h);else if(pane==='reservations')body=reservations(h);else if(pane==='movements')body=movements(h);else body=stock(h);return heading(h)+(formMode?editor(h):'')+body;}
 function stock(h){const list=allowed(h,h.state.materials).filter(m=>!h.query||[m.name,m.sku,m.barcode,m.location,m.supplier].join(' ').toLowerCase().includes(h.query.toLowerCase()));return `<div class="toolbar"><div class="search-field">${h.icon('search')}<input id="view-search" data-search="view" value="${e(h.query)}" placeholder="اسم الخامة، SKU، باركود، مورد أو موقع تخزين…" aria-label="البحث في الخامات"></div><span class="tiny muted">المتاح = الرصيد الفعلي − المحجوز</span></div><section class="card"><div class="table-wrap"><table class="data-table material-table"><thead><tr><th>الخامة</th><th>المواصفات</th><th>الفعلي</th><th>المحجوز</th><th>المتاح</th>${h.financial?'<th>تكلفة الوحدة</th>':''}<th>إجراءات</th></tr></thead><tbody>${list.map(m=>{const a=I.availability(h.state,m.id);return `<tr><td><div class="row"><span class="app-icon soft" style="--ic:#8660c0;--icbg:#f0eafb">${h.icon(formIcon(m))}</span><div><b>${e(m.name)}</b><span class="subline">${e(m.sku||m.id)} · ${e(category(m))}</span><span class="subline">${e(h.allowedBranches.find(b=>b.id===m.branchId)?.name||'')} ${m.location?'· '+e(m.location):''}</span></div></div></td><td>${m.width?(m.height?n(m.width)+' × '+n(m.height)+' سم':'عرض '+n(m.width)+' سم'):'حسب بطاقة الصنف'}<span class="subline">${m.thickness?n(m.thickness)+' مم · ':''}${m.gsm?n(m.gsm)+' جم/م² · ':''}${e(m.color||'')}</span></td><td>${n(a.onHand)}<span class="subline">${e(m.unit)}</span></td><td>${n(a.reserved)}</td><td><b class="${a.available<=m.minQuantity?'overdue':''}">${n(a.available)}</b></td>${h.financial?`<td>${h.money(m.unitCost)}${m.costConfirmed===false?'<span class="subline overdue">تكلفة غير مؤكدة</span>':''}</td>`:''}<td><div class="row wrap">${buttons('البطاقة','edit',m.id,'sm')}${h.financial&&WOMaterialBindings.calculatorType(m)?buttons('حاسبة','calc',m.id,'sm soft'):''}${buttons('حجز','reserve',m.id,'sm')}${buttons('جرد','adjust',m.id,'sm')}${h.allowedBranches.length>1?buttons('تحويل','transfer',m.id,'sm'):''}<button class="btn sm" data-action="material-purchase" data-id="${e(m.id)}">شراء</button></div></td></tr>`;}).join('')}</tbody></table></div>${!list.length?'<div class="empty"><h3>ابدأ بإضافة خامات نشاطك</h3><p>أضف صنفا مخصصا أو اختر قالبا ثم أكد بيانات المورد.</p></div>':''}</section>`;}
 function templates(h){const list=T.templates.filter(t=>family==='all'||t.family===family);return `<div class="toolbar"><div class="row wrap"><span class="tag purple">${T.templates.length} قالب خامة</span><select id="pro-family" aria-label="نوع الخامة">${[['all','كل الخامات'],...T.categories.map(c=>[c.id,c.name])].map(([id,name])=>`<option value="${id}" ${family===id?'selected':''}>${e(name)}</option>`).join('')}</select></div></div><div class="alert-box teal mb">قوالب استرشادية من مواصفات المصنع. تبدأ بلا رصيد وبلا تكلفة معتمدة؛ أكد صنف المورد ومقاساته وعبوته قبل التشغيل.</div><div class="grid three">${list.map(t=>`<article class="card material-template"><div class="between"><span class="app-icon soft" style="--ic:#7861bd;--icbg:#f1ecfa">${h.icon(formIcon(t))}</span><span class="tag gray">${e(T.categories.find(c=>c.id===t.family)?.name||t.family)}</span></div><h3 class="mt">${e(t.name)}</h3><p class="tiny muted mt">${e(t.description)}</p><div class="details-grid mt"><div class="detail-item"><small>المقاس</small><b>${t.width?n(t.width)+' × '+n(t.height)+' سم':'يؤكد من المورد'}</b></div><div class="detail-item"><small>وحدة المخزون</small><b>${e(units[t.baseUnit])}</b></div></div><div class="row wrap mt">${buttons('تجهيز بطاقة الصنف','template',t.id,'primary sm')}<a class="btn sm" href="${e(t.sourceUrl)}" target="_blank" rel="noopener noreferrer">مرجع المصنع</a></div></article>`).join('')}</div>`;}
 function editor(h){const existing=selected?material(h,selected):null,template=templateId?T.templates.find(t=>t.id===templateId):null,d=existing||template||{},branchId=existing?.branchId||(h.branchId==='all'?h.allowedBranches[0]?.id:h.branchId);if(!branchId)return '<div class="alert-box orange">أضف فرعا نشطا أولا.</div>';if(['reserve','adjust','transfer'].includes(formMode)){if(!existing)return '';const av=I.availability(h.state,existing.id),open=h.state.orders.filter(o=>o.branchId===existing.branchId&&!['cancelled','delivered'].includes(o.status));return `<section class="card mb"><div class="card-head"><div><h2>${{reserve:'حجز خامة لأمر عمل',adjust:'جرد الرصيد الفعلي',transfer:'تحويل خامة بين الفروع'}[formMode]}</h2><p>${e(existing.name)} · المتاح ${n(av.available)} ${e(existing.unit)}</p></div>${buttons('إغلاق','close','','sm')}</div><form id="pro-stock-form" data-mode="${formMode}" data-id="${existing.id}"><div class="form-grid three">${formMode==='reserve'?select('أمر العمل','orderId',[['','اختر أمر العمل'],...open.map(o=>[o.id,o.number+' — '+o.title])],'','required'):''}${formMode==='transfer'?select('إلى الفرع','toBranchId',h.allowedBranches.filter(b=>b.id!==existing.branchId).map(b=>[b.id,b.name]),'','required'):''}${input(formMode==='adjust'?'الرصيد النهائي بعد العد':'الكمية','quantity',formMode==='adjust'?existing.quantity:1,'number','min="0" step="0.001" required')}${formMode!=='reserve'?input('السبب / المرجع','reason','','text','required maxlength="2000"'):''}</div><div class="form-actions"><button class="btn primary" type="submit">${formMode==='adjust'?'تثبيت نتيجة الجرد':'تأكيد العملية'}</button></div><div class="field-note">${formMode==='adjust'?'يحفظ الفرق كحركة جرد، ولا يسمح بتخفيض الرصيد دون المحجوز.':'يتحقق النظام من الرصيد والصلاحيات قبل اعتماد العملية.'}</div></form></section>`;}
 const base=WOMaterialBindings.base(d);
 return `<section class="card mb"><div class="card-head"><div><h2>${existing?'بطاقة الخامة':'إضافة صنف مخزون'}</h2><p>${template?'راجع مواصفات القالب وأكمل بيانات المورد':'المقاس والسماكة ووزن الورق حقول مستقلة'}</p></div>${buttons('إغلاق','close','','sm')}</div><form id="pro-material-form" data-id="${e(existing?.id||'')}"><div class="form-grid three">${input('اسم الخامة','name',d.name||'','text','required maxlength="200"')}${input('رمز الصنف SKU','sku',existing?.sku||'MAT-'+String(h.state.materials.length+1).padStart(5,'0'),'text','required maxlength="80"')}${input('باركود اختياري','barcode',existing?.barcode||'','text','maxlength="100"')}${select('الفرع','branchId',h.allowedBranches.map(b=>[b.id,b.name]),branchId,existing?'disabled':'required')}${select('القسم','category',K.categories.map(c=>[c.id,c.name]),d.category||'acrylic')}${select('شكل الخامة','form',Object.entries(forms),d.form||({sheet:'sheet',m:'roll',m2:'roll',ml:'liquid',kg:'piece'}[base]||'piece'))}${select('وحدة الرصيد الأساسية','baseUnit',Object.entries(units),base)}${input('اسم الوحدة للعرض','unit',d.unit||'لوح','text','required maxlength="30"')}${input('رصيد افتتاحي بوحدة المخزون','quantity',existing?.quantity||0,'number',existing?'disabled':'min="0" step="0.001" required')}${input('العرض سم','width',d.width||0,'number','min="0" step="0.01"')}${input('الطول / طول الرول سم','height',d.height||0,'number','min="0" step="0.01"')}${input('السماكة مم','thickness',d.thickness||0,'number','min="0" step="0.001"')}${input('وزن الورق / الخامة جم للمتر المربع','gsm',d.gsm||0,'number','min="0" step="0.1"')}${input('اللون','color',d.color||'','text','maxlength="80"')}${input('التشطيب / السطح','finish',d.finish||'','text','maxlength="80"')}${input('المورد','supplier',existing?.supplier||'','text','maxlength="150"')}${input('موقع التخزين','location',existing?.location||'','text','maxlength="150"')}${input('حد إعادة الطلب','minQuantity',existing?.minQuantity||0,'number','min="0" step="0.001"')}${h.financial?input('تكلفة الوحدة الأساسية','unitCost',existing?.unitCost||0,'number','min="0" step="0.0001"'):''}${input('توافق الطباعة / التشغيل','compatibleProcess',d.compatibleProcess||'','text','maxlength="250"')}${input('مرجع المواصفات','sourceUrl',d.sourceUrl||'','url','maxlength="2000"')}</div><hr class="divider"><h3>عبوات الشراء والتحويل</h3><p class="field-note">مثال: عبوة حبر = 1000 ملل، رول = 50 مترا، باكت ورق = العدد المؤكد من المورد. المعامل يخص هذا الصنف فقط.</p><div class="form-grid three mt">${[0,1,2].map(index=>`<div class="card" style="padding:12px">${input('اسم العبوة '+(index+1),'packName'+index,d.purchaseUnits?.[index]?.name||'','text','maxlength="80"')}${input('كم تساوي من الوحدة الأساسية؟','packFactor'+index,d.purchaseUnits?.[index]?.factor||'','number','min="0.000001" step="0.000001"')}</div>`).join('')}</div><details class="mt"><summary>بيانات إضافية للإضاءة والحبر</summary><div class="form-grid three mt">${input('فولت المنتج','voltage',d.voltage||0,'number','min="0" step="1"')}${input('واط لكل وحدة LED','wattsPerUnit',d.wattsPerUnit||0,'number','min="0" step="0.01"')}${input('واط لكل متر شريط','wattsPerMeter',d.wattsPerMeter||0,'number','min="0" step="0.01"')}${input('طول لفة الشريط متر','rollLength',d.rollLength||0,'number','min="0" step="0.01"')}${input('قدرة الترانس واط','powerSupplyWatts',d.powerSupplyWatts||0,'number','min="0" step="1"')}${input('استهلاك حبر ملل / م²','inkMlPerM2',d.inkMlPerM2||0,'number','min="0" step="0.01"')}</div></details><div class="row wrap mt"><label class="check"><input name="specConfirmed" type="checkbox" ${d.specStatus==='confirmed'?'checked':''}> تمت مراجعة مواصفات المورد</label>${h.financial?`<label class="check"><input name="costConfirmed" type="checkbox" ${existing?.costConfirmed!==false&&existing?'checked':''}> تكلفة الوحدة مؤكدة</label>`:''}</div><div class="form-actions"><button class="btn primary" type="submit">${existing?'حفظ بطاقة الخامة':'إضافة الصنف'}</button></div></form></section>`;
 }
 function reservations(h){const list=allowed(h,h.state.stockReservations||[]).slice().reverse();return `<section class="card"><div class="card-head"><h2>الخامات المخصصة لأوامر العمل</h2></div><div class="table-wrap"><table class="data-table"><thead><tr><th>الخامة</th><th>أمر العمل</th><th>الأصل</th><th>المتبقي</th><th>المصروف</th><th>الحالة</th><th></th></tr></thead><tbody>${list.map(r=>`<tr><td>${e(h.state.materials.find(m=>m.id===r.materialId)?.name||'')}</td><td>${e(h.state.orders.find(o=>o.id===r.orderId)?.number||'')}</td><td>${n(r.quantity)}</td><td>${n(r.remainingQuantity)}</td><td>${n(r.consumedQuantity)}</td><td><span class="tag ${r.status==='active'?'purple':'gray'}">${{active:'محجوز',released:'محرر',consumed:'مصروف'}[r.status]}</span></td><td>${r.status==='active'?buttons('تحرير الحجز','release',r.id,'sm'):''}</td></tr>`).join('')}</tbody></table></div>${!list.length?'<div class="empty"><h3>لا توجد حجوزات بعد</h3><p>اختر حجز من بطاقة الخامة لتخصيصها لأمر عمل.</p></div>':''}</section>`;}
 function movements(h){const list=allowed(h,h.state.stockMovements||[]).slice().reverse();return `<section class="card"><div class="card-head"><h2>سجل حركة المخزون</h2><span class="tiny muted">كل حركة مرتبطة بسبب أو مستند</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>النوع</th><th>الخامة</th><th>الكمية</th><th>الأثر</th><th>المصدر / السبب</th><th>الوقت</th></tr></thead><tbody>${list.map(x=>`<tr><td>${e({opening:'رصيد افتتاحي',adjust:'جرد',issue:'صرف',receive:'استلام شراء',transfer_out:'تحويل صادر',transfer_in:'تحويل وارد'}[x.type])}</td><td>${e(h.state.materials.find(m=>m.id===x.materialId)?.name||'')}</td><td>${n(x.quantity)}</td><td dir="ltr">${x.delta>0?'+':''}${n(x.delta)}</td><td>${e(x.reason||'')}${x.wasteQuantity?'<span class="subline">الهدر ضمن المصروف: '+n(x.wasteQuantity)+'</span>':''}</td><td>${new Date(x.at).toLocaleString('ar-SA-u-ca-gregory')}</td></tr>`).join('')}</tbody></table></div>${!list.length?'<div class="empty"><h3>تظهر الحركات عند بدء التشغيل</h3><p>الحركات الجديدة تسجل الصرف والاستلام والجرد والتحويل. استهلاك الأوامر السابقة محفوظ في تفاصيلها.</p></div>':''}</section>`;}
 function remnants(h){const list=allowed(h,h.state.remnants);return `<div class="toolbar"><span class="tiny muted">مقاسات فعلية مؤكدة، وليست مجرد مساحة غير مستخدمة في الحاسبة</span>${buttons('+ قطعة متبقية','remnant-new','','primary')}</div>${h.remnantForm?.()||''}<div class="grid three">${list.map(r=>{const orders=h.state.orders.filter(o=>o.branchId===r.branchId&&o.materialId===r.materialId&&o.quantity===1&&!['cancelled','delivered'].includes(o.status)&&I.suggest(h.state,{branchId:r.branchId,materialId:r.materialId,width:o.width,height:o.height,unit:o.unit,quantity:1}).remnants.some(x=>x.id===r.id));return `<section class="card"><div class="between"><span class="app-icon soft" style="--ic:#16aaa7;--icbg:#e6f5f3">${h.icon('remnant')}</span><span class="tag ${r.status==='available'?'green':r.status==='reserved'?'purple':'gray'}">${{available:'متاحة',reserved:'محجوزة',used:'مستخدمة'}[r.status]}</span></div><h3 class="mt">${e(r.name)}</h3><h2 class="mt">${n(r.width)} × ${n(r.height)} <small>سم</small></h2><p class="tiny muted">${n(r.thickness)} مم · ${e(r.color)} · ${e(r.location)}</p><div class="tiny muted mt">من الأمر ${e(h.state.orders.find(o=>o.id===r.sourceOrderId)?.number||'غير محدد')}</div>${r.status==='reserved'?`<div class="mt">للأمر ${e(h.state.orders.find(o=>o.id===r.reservedFor)?.number||'')}</div><button class="btn full mt" data-action="release-remnant" data-id="${r.id}">تحرير القطعة</button>`:r.status==='available'&&orders.length?`<select class="mt" id="reserve-order-${r.id}" aria-label="أمر مناسب للقطعة">${orders.map(o=>`<option value="${o.id}">${e(o.number)} — ${e(o.title)}</option>`).join('')}</select><button class="btn primary full mt" data-action="reserve-remnant" data-id="${r.id}">حجز القطعة للعمل</button>`:'<p class="field-note">سيظهر الأمر المناسب عند مطابقة المقاس والخامة.</p>'}</section>`;}).join('')||'<div class="card empty"><h3>سجل البواقي القابلة للاستخدام</h3><p>حدد المقاس والموقع والأمر السابق لتجدها عند الطلب التالي.</p></div>'}</div>`;}
 async function action(a,el,h){const id=el.dataset.id;switch(a){case 'pro:pane':pane=id;formMode='';break;case 'pro:new':pane='stock';formMode='material';selected='';templateId='';break;case 'pro:template':formMode='material';selected='';templateId=id;break;case 'pro:close':formMode='';selected='';templateId='';break;case 'pro:edit':case 'pro:reserve':case 'pro:adjust':case 'pro:transfer':selected=id;templateId='';formMode=a.slice(4)==='edit'?'material':a.slice(4);break;case 'pro:release':if(h.queueInfo().count)throw new Error('انتظر تأكيد الحجوزات المعلقة قبل تحرير الحجز');h.mutate(()=>I.release(h.state,h.actorId,id),'تم تحرير الحجز');return;case 'pro:remnant-new':h.openRemnant();return;case 'pro:calc':{const m=material(h,id);if(!m)throw new Error('الخامة غير متاحة');const type=WOMaterialBindings.calculatorType(m);if(!type)throw new Error('أدخل تكلفة هذه الخامة ضمن حاسبة الدفعة العامة');h.useCalculator(id,type);return;}}h.render();}
 async function submit(form,h){const data=Object.fromEntries(new FormData(form));for(const f of form.querySelectorAll('input[type=number]'))if(!f.disabled)data[f.name]=f.value===''?0:Number(f.value);for(const f of form.querySelectorAll('input[type=checkbox]'))data[f.name]=f.checked;
  if(form.id==='pro-stock-form'){const id=form.dataset.id;let result;if(form.dataset.mode==='reserve')result=h.mutate(()=>I.reserve(h.state,h.actorId,id,data.orderId,data.quantity),'تم حجز الخامة');else if(form.dataset.mode==='adjust')result=h.mutate(()=>I.adjust(h.state,h.actorId,id,data.quantity,data.reason),'تم تسجيل الجرد');else result=h.mutate(()=>I.transfer(h.state,h.actorId,id,data.toBranchId,data.quantity,data.reason),'تم تحويل المخزون');if(result){formMode='';h.render();}return;}
  const id=form.dataset.id,existing=id?material(h,id):null;const keys=['name','sku','barcode','category','form','baseUnit','unit','width','height','thickness','gsm','color','finish','supplier','location','minQuantity','compatibleProcess','sourceUrl','voltage','wattsPerUnit','wattsPerMeter','rollLength','powerSupplyWatts','inkMlPerM2'];const payload={};for(const key of keys)payload[key]=data[key];payload.purchaseUnits=[];for(let j=0;j<3;j++){if(data['packName'+j]?.trim())payload.purchaseUnits.push({name:data['packName'+j].trim(),factor:data['packFactor'+j]});}payload.specStatus=data.specConfirmed?'confirmed':'awaiting_supplier';if(h.financial){payload.unitCost=data.unitCost;payload.costConfirmed=data.costConfirmed;}else if(!existing){payload.unitCost=0;payload.costConfirmed=false;}
  if(!existing){payload.branchId=data.branchId;payload.quantity=data.quantity;}
  const result=h.mutate(()=>existing?I.updateMaterial(h.state,h.actorId,id,payload):I.createMaterial(h.state,h.actorId,payload),existing?'تم تعديل بطاقة الخامة':'تمت إضافة الصنف');if(result){formMode='';selected='';templateId='';pane='stock';h.render();}
 }
 document.addEventListener('change',event=>{if(event.target.id==='pro-family'){family=event.target.value;document.dispatchEvent(new CustomEvent('wo-inventory-render'));}});
 globalThis.WOInventoryUI={view,action,submit};
})();

;
(function(){
'use strict';
const M=globalThis.WOModel,C=globalThis.WOCalc,K=globalThis.WOCatalog,I=globalThis.WOInventory;
const CONNECTED=globalThis.WO_CONFIG?.mode==='connected';
const recorder=CONNECTED?WOCommandCapture.create(M,I):null;
let centralAccount=null,centralTenant=null,centralBooting=CONNECTED,centralError='',centralSaving=false,installPrompt=null,platformHandle=null;
const STORE='artplus.workorders.v1', SESSION='artplus.session.v1';
const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>Array.from(r.querySelectorAll(q));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ico=(name,size='')=>`<svg class="icon ${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${K.icons[name]||K.icons.grid||''}</svg>`;
const appico=(name,color='#8c5bd6',soft=false)=>`<span class="app-icon ${soft?'soft':''}" style="--ic:${color};--ic2:${shade(color,-22)};--icbg:${color}14">${ico(name)}</span>`;
const fmt=(n,d=0)=>Number(n||0).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
const nowMonth=()=>new Date().toISOString().slice(0,7), day=v=>v?new Date(v).toLocaleDateString('ar-SA-u-ca-gregory',{day:'numeric',month:'short'}):'—';
const dt=v=>v?new Date(v).toLocaleString('ar-SA-u-ca-gregory',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'—';
const dateInput=v=>v?new Date(new Date(v).getTime()-new Date(v).getTimezoneOffset()*60000).toISOString().slice(0,16):'';
function shade(hex,amount){const h=String(hex||'#5b248c').replace('#','');if(!/^[a-f\d]{6}$/i.test(h))return '#5b248c';return '#'+[0,2,4].map(i=>Math.max(0,Math.min(255,parseInt(h.slice(i,i+2),16)+amount)).toString(16).padStart(2,'0')).join('');}
let state, session={},loadError='';
try{const raw=CONNECTED?null:localStorage.getItem(STORE);state=raw?M.validateState(JSON.parse(raw)):M.seed();session=JSON.parse(localStorage.getItem(CONNECTED?'wo-central-ui':SESSION)||'{}');if(CONNECTED)delete session.userId;}catch(e){state=M.seed();loadError='تعذر قراءة البيانات المحفوظة. لم نستبدلها تلقائيا؛ يمكنك استعادة نسخة احتياطية من الإعدادات.';}
state.drafts=state.drafts||{};state.settings=state.settings||{};
const UI={branch:session.branch||'all',query:'',status:'all',inventoryTab:'materials',settingsTab:'brand',purchaseTab:'all',month:nowMonth(),calcType:'sheet',menu:false,sidebarCollapsed:session.sidebarCollapsed===true,notifications:false,employeeForm:null,branchForm:null,inventoryForm:null,clientForm:false,rating:0,reportFrom:'',reportTo:'',formImage:'',formFileName:'',reviewOrderId:'',reviewFilter:'all'};
let actorId=session.userId||'',toastTimer,draftTimer,searchTimer;
const NAV=[['home','الرئيسية','home'],['guide','ابدأ هنا · دليل الاستخدام','check'],['orders','أوامر العمل','orders'],['proofs','اعتمادات العملاء','check'],['production','خط الإنتاج','production'],['myWork','مهامي وإنجازي','check'],['catalog','الخدمات والمنتجات','grid'],['calculators','الحاسبات والتسعير','calculator'],['nesting','تخطيط القص والبواقي','scissors'],['inventory','المخزون والبواقي','inventory'],['purchases','المشتريات','purchase'],['clients','العملاء','users'],['employees','الفريق والأداء','users'],['branches','الفروع','branch'],['reviews','تقييمات العملاء','review'],['reports','التقارير','chart'],['activity','سجل العمليات','clock'],...(CONNECTED?[['sync','المزامنة والجهاز','refresh'],['account','حسابي والجهاز','shield']]:[]),['settings','الإعدادات والهوية','settings']];
const COLORS={guide:'#c8a047',nesting:'#078f97',proofs:'#c8a047',home:'#052e48',orders:'#135f7a',production:'#078f97',myWork:'#3b87b3',catalog:'#678ca2',calculators:'#bf923b',inventory:'#0e9f8a',purchases:'#397ca6',clients:'#078f97',employees:'#c59b4d',branches:'#7992aa',reviews:'#cc9e45',reports:'#25977d',settings:'#586c81',activity:'#68879b'};
const STAGES=[['draft','مسودة','gray'],['approval','اعتماد التصميم','orange'],['queued','جاهز للتنفيذ','purple'],['production','قيد التنفيذ','teal'],['quality','فحص الجودة','blue'],['ready','جاهز للتسليم','green'],['delivered','تم التسليم','green'],['cancelled','ملغي','red']];
const actor=()=>state.users.find(u=>u.id===actorId&&u.active!==false);
const perm=(p,b)=>!!actor()&&M.can(state,actorId,p,b);
const financial=()=>perm('view_financials',UI.branch==='all'?undefined:UI.branch);
const money=(n)=>financial()?`${fmt(n,2)} <small>${currency()}</small>`:'<span class="muted">—</span>';
const currency=()=>({SAR:'ر.س',YER:'ر.ي',USD:'$'}[state.brand.currency]||esc(state.brand.currency));
const bname=id=>state.branches.find(b=>b.id===id)?.name||'غير محدد';
const uname=id=>state.users.find(u=>u.id===id)?.name||'غير محدد';
const client=id=>state.clients.find(c=>c.id===id);
const cat=id=>K.categories.find(c=>c.id===id);
const initial=name=>String(name||'م').split(' ').map(s=>s[0]).slice(0,2).join('');
const avatar=(id,small=false)=>`<span class="avatar ${small?'small':''}" title="${esc(uname(id))}">${esc(initial(uname(id)))}</span>`;
const stage=s=>STAGES.find(x=>x[0]===s)||STAGES[0];
const statusTag=s=>`<span class="tag ${stage(s)[2]}">${stage(s)[1]}</span>`;
const priorityTag=p=>p==='urgent'?'<span class="tag red">عاجل</span>':p==='high'?'<span class="tag orange">أولوية عالية</span>':'';
const tag=(text,color='purple')=>`<span class="tag ${color}">${esc(text)}</span>`;
const isLate=o=>!['delivered','cancelled'].includes(o.status)&&new Date(o.dueAt)<new Date();
const orders=()=>M.visibleOrders(state,actorId,UI.branch);
const allowedBranches=()=>state.branches.filter(b=>b.active!==false&&(perm('view_all_branches')||actor()?.branchIds?.includes(b.id)));
const ownBranch=()=>allowedBranches().find(b=>b.id===UI.branch)?.id||allowedBranches()[0]?.id||'b1';
const scoped=(items)=>items.filter(x=>(UI.branch==='all'||x.branchId===UI.branch)&&(perm('view_all_branches')||actor()?.branchIds?.includes(x.branchId)));
const logo=()=>typeof state.brand.logo==='string'&&/^data:image\/(jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(state.brand.logo)?state.brand.logo:(WO_ASSETS.systemLogo||WO_ASSETS.appMark);
const imageSafe=src=>typeof src==='string'&&/^data:image\/(jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(src)?src:logo();
const teamAvatars=o=>`<div class="avatar-group">${(o.assignees||[]).slice(0,4).map(a=>avatar(a.userId,true)).join('')||'<span class="tiny muted">لم يحدد</span>'}</div>`;
function canRoute(route){if(!actor())return false;const p={nesting:'view_financials',orders:null,order:null,proofs:'manage_orders',newOrder:'manage_orders',production:'manage_production',inventory:'manage_inventory',purchases:'request_purchase',employees:'manage_team',branches:'manage_branches',clients:'manage_orders',reviews:'view_reviews',reports:'view_reports',activity:'view_reports',settings:'manage_settings',calculators:'view_financials'}[route];return !p||perm(p);}
function saveSession(){try{localStorage.setItem(CONNECTED?'wo-central-ui':SESSION,JSON.stringify({userId:actorId,branch:UI.branch,sidebarCollapsed:UI.sidebarCollapsed,theme:document.body.classList.contains('dark')?'dark':'light'}));}catch(e){toast('تعذر حفظ جلسة العرض',true);}}
function persist(){if(CONNECTED){WOTransport.saveDrafts(state.drafts).catch(e=>toast(e.message,true));return;}localStorage.setItem(STORE,JSON.stringify(state));}
function notify(message,error=false){toast(message,error);}
function toast(message,error=false){const t=$('#toast');t.textContent=message;t.className='show'+(error?' error':'');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.className='',4000);}
function mutate(fn,message='تم حفظ التغييرات'){
 const before=JSON.stringify(state);
 try{
  if(CONNECTED){if(WOTransport.queueInfo().readOnly)throw new Error(WOTransport.queueInfo().readOnlyReason||'هذا التبويب للقراءة فقط');if(centralSaving)throw new Error('انتظر حفظ العملية الحالية');if(WOTransport.queueInfo().blocked)throw new Error('راجع مركز المزامنة أولا؛ توجد عملية تحتاج مراجعة');recorder.start();}
  const value=fn();
  if(CONNECTED){const actions=recorder.finish();if(!actions.length)throw new Error('لا توجد عملية خادم محددة');if(actions.some(a=>a.type==='material.transfer')&&!WOTransport.queueInfo().online)throw new Error('تحويل المخزون بين الفروع يحتاج اتصالا بالخادم');centralSaving=true;WOTransport.commit(actions,state).then(()=>toast(WOTransport.queueInfo().online?'جار تأكيد العملية مع الخادم':'حفظت العملية على الجهاز وبانتظار الاتصال')).catch(e=>{state=JSON.parse(before);render();toast(e.message,true);}).finally(()=>centralSaving=false);}
  else persist();
  render();if(message&&!CONNECTED)toast(message);return value;
 }catch(e){recorder?.cancel();state=JSON.parse(before);toast(e.message||'تعذر تنفيذ العملية',true);return null;}
}
function audit(action,id,detail='',branchId=ownBranch()){recorder?.custom(action,id,state);state.audit.push({id:M.uid('a'),at:new Date().toISOString(),actorId,branchId,action,entityId:id,detail});}
function requirePerm(p,b){if(!perm(p,b))throw new Error('لا تملك صلاحية هذه العملية');}
function theme(){const c='#052e48';document.documentElement.style.setProperty('--primary',c);document.documentElement.style.setProperty('--primary-light','#'+[1,3,5].map(i=>Math.round(parseInt(c.slice(i,i+2),16)+(255-parseInt(c.slice(i,i+2),16))*.65).toString(16).padStart(2,'0')).join(''));document.documentElement.style.setProperty('--primary-rgb',[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)).join(','));document.documentElement.style.setProperty('--secondary','#078f97');document.title='أوامر | '+state.brand.name;}
function safeDecode(value){try{return decodeURIComponent(value);}catch(e){return '';}}
function route(){const raw=location.hash.replace(/^#\/?/,'');const [path,q='']=raw.split('?');const parts=path.split('/');return {name:parts[0]||'home',id:safeDecode(parts[1]||''),params:new URLSearchParams(q)};}
function go(path){UI.query='';UI.menu=false;UI.notifications=false;const next='#/'+path;if(location.hash===next)render();else location.hash=next;window.scrollTo(0,0);}
function title(text,sub='',actions=''){const hint=WOOnboarding.tip(route().name);return `<div class="page-title between"><div><div class="eyebrow">أوامر | نظام أوامر العمل والتشغيل</div><h1>${esc(text)}</h1>${sub?`<p>${esc(sub)}</p>`:''}${hint?`<div class="guide-inline-tip">${ico('check','sm')} <span>${esc(hint)}</span><a href="#/guide">المزيد</a></div>`:''}</div><div class="row wrap">${actions}</div></div>`;}
function btn(text,action,cls='',data='',icon=''){return `<button type="button" class="btn ${cls}" data-action="${action}" ${data}>${icon?ico(icon):''}<span class="label">${text}</span></button>`;}
const empty=(heading,text='',icon='package')=>`<div class="empty">${appico(icon,'#aa9ac9',true)}<h3>${esc(heading)}</h3><p>${esc(text)}</p></div>`;
function alertBox(text,color='gray',icon='info'){return `<div class="alert-box ${color}">${ico(icon)}<div>${text}</div></div>`;}
function field(label,name,value='',type='text',extra='',help=''){return `<div class="field"><label for="f-${name}">${label}</label><input id="f-${name}" name="${name}" type="${type}" value="${esc(value)}" ${extra}>${help?`<div class="help">${help}</div>`:''}</div>`;}
function selectField(label,name,options,value='',extra=''){return `<div class="field"><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}" ${extra}>${options.map(([v,t])=>`<option value="${esc(v)}" ${String(v)===String(value)?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`;}
function values(form){const out=Object.fromEntries(new FormData(form));for(const x of $$('input[type=number]',form))if(x.name)out[x.name]=x.value===''?'':Number(x.value);for(const x of $$('input[type=checkbox][name]',form))out[x.name]=x.checked;return out;}
function activeFinancialButton(o){return financial()?`<span class="tag purple">${money(o.salePrice)}</span>`:'';}
function tabs(items,current,dataName){return `<div class="tabs">${items.map(([id,label])=>`<button class="tab ${id===current?'active':''}" data-action="tab" data-key="${dataName}" data-value="${id}">${label}</button>`).join('')}</div>`;}
function searchBar(placeholder='ابحث بالاسم أو الرقم…'){return `<div class="search-field">${ico('search')}<input id="view-search" aria-label="${placeholder}" data-search="view" value="${esc(UI.query)}" placeholder="${placeholder}"></div>`;}
function formatErrorPage(e){return title('نحتاج إلى مراجعة هذه الصفحة')+alertBox(esc(e.message),'red')+btn('العودة للرئيسية','navigate','primary','data-to="home"','home');}
function render(){theme();const r=route();if(CONNECTED&&r.name!=='feedback'){if(centralBooting){$('#app').innerHTML='<div class="public-page"><div class="public-card text-center"><h2>جار فتح مساحة العمل…</h2><p class="muted mt">نتحقق من الحساب والصلاحيات</p></div></div>';return;}if(centralAccount?.kind==='platform'){if(!platformHandle)platformHandle=WOPlatform.mount({root:$('#app'),api:WOTransport.request,account:centralAccount,onLogout:centralLogout});return;}}if(session.theme==='dark'&&!document.body.dataset.themeReady){document.body.classList.add('dark');document.body.dataset.themeReady='1';}
 if(platformHandle){platformHandle.destroy();platformHandle=null;}
 if(r.name==='feedback'){renderFeedback(r.id);return;}
 if(r.name==='login'||!actor()){renderLogin();return;}
 if(UI.branch!=='all'&&!allowedBranches().some(b=>b.id===UI.branch))UI.branch=ownBranch();if(!perm('view_all_branches')&&UI.branch==='all')UI.branch=actor().branchIds[0];
 let view='';try{if(!canRoute(r.name)){view=title('هذه الصفحة خارج صلاحياتك')+empty('لا توجد صلاحية','يمكنك الرجوع إلى مهامك أو التواصل مع مدير النظام','shield');}else{view=({home:homeView,orders:ordersView,guide:guideView,proofs:proofsView,order:()=>orderView(r.id),newOrder:()=>orderForm(r.id),production:productionView,catalog:catalogView,calculators:calculatorsView,inventory:inventoryView,purchases:purchasesView,employees:employeesView,employee:()=>employeeView(r.id),branches:branchesView,clients:clientsView,reviews:reviewsView,reports:reportsView,settings:settingsView,activity:activityView,nesting:()=>WONestingUI.view(nestingContext()),sync:()=>WOConnectedUI.sync(WOTransport.queueInfo()),myWork:myWorkView,account:()=>WOConnectedUI.accountPage({account:centralAccount,tenant:centralTenant,role:roleLabel(actor().role)})}[r.name]||homeView)();}}catch(e){console.error(e);view=formatErrorPage(e);}
 const nav=NAV.filter(([id])=>canRoute(id)&&(id!=='myWork'||actor().role==='employee'));
 $('#app').innerHTML=`<div class="app-shell ${UI.sidebarCollapsed?'is-collapsed':''}"><div class="backdrop ${UI.menu?'open':''}" data-action="menu-close"></div><aside class="sidebar ${UI.menu?'open':''}"><a class="brand" href="#/home" aria-label="أوامر، الرئيسية"><img class="awamer-system-logo" src="${esc(WO_ASSETS.systemLogo||WO_ASSETS.appMark)}" alt="أوامر، نظام أوامر العمل والتشغيل"><img class="awamer-compact-mark" src="${esc(WO_ASSETS.appMark)}" alt="أوامر"><div class="brand-text"><div class="brand-name">${esc(state.brand.name)}</div><div class="brand-sub">مساحة عمل المنشأة</div></div></a><div class="nav-label">مساحة العمل والأقسام</div><nav class="nav" aria-label="أقسام نظام أوامر">${nav.map(([id,label,icon])=>`<a href="#/${id}" class="${r.name===id||(r.name==='order'&&id==='orders')||(r.name==='newOrder'&&id==='orders')?'active':''}">${ico(icon)}<span>${label}</span>${id==='orders'?`<span class="count">${orders().filter(o=>!['delivered','cancelled'].includes(o.status)).length}</span>`:''}</a>`).join('')}</nav><div class="sidebar-foot"><button class="sidebar-collapse-control" data-action="sidebar-toggle" type="button" aria-label="تصغير أو توسيع الشريط الجانبي" aria-expanded="${!UI.sidebarCollapsed}">${ico(UI.sidebarCollapsed?'arrow':'menu','sm')}<span class="label">${UI.sidebarCollapsed?'توسيع القائمة':'تصغير القائمة'}</span></button><div class="between"><span class="local-tag"><span class="dot"></span> ${CONNECTED?(WOTransport.queueInfo().count?'عمليات بانتظار المزامنة':WOTransport.queueInfo().online?'بيانات المنشأة متصلة':'نسخة محفوظة على الجهاز'):'حفظ محلي على هذا الجهاز'}</span><button class="icon-btn" data-action="theme" aria-label="تبديل المظهر">${ico('moon','sm')}</button></div><div class="tiny muted mt">${CONNECTED?'إصدار 2.0 · حساب منشأة':'نسخة عرض محلية · بيانات توضيحية'}</div></div></aside><main class="main"><header class="topbar"><button class="icon-btn mobile-menu-btn" data-action="menu" aria-label="القائمة">${ico('menu')}</button><a class="brand" href="#/home"><img src="${esc(WO_ASSETS.appMark)}" alt="شعار أوامر"><div><div class="brand-name">أوامر</div><div class="brand-sub">${esc(state.brand.name)}</div></div></a><div class="top-search">${ico('search','sm')}<input data-search="global" aria-label="بحث في أوامر العمل" placeholder="ابحث عن أمر عمل أو عميل…"><span class="shortcut-key">/</span></div><div class="row"><select class="branch-select" data-branch aria-label="اختيار الفرع">${branchOptions()}</select>${CONNECTED?`<button class="icon-btn" data-action="central-refresh" aria-label="تحديث بيانات المنشأة">${ico('refresh','sm')}</button>`:''}<button class="icon-btn desktop-theme" data-action="theme" aria-label="الوضع الليلي">${ico('moon','sm')}</button><button class="icon-btn" data-action="notifications" aria-label="التنبيهات">${ico('bell','sm')}<span class="notification-dot"></span></button><button class="profile-btn row" data-action="${CONNECTED?'navigate':'switch-user'}" ${CONNECTED?'data-to="account"':''} aria-label="${CONNECTED?'حسابي والجهاز':'تبديل حساب العرض'}">${avatar(actorId)}<div class="user-label"><div class="strong tiny">${esc(actor().name)}</div><div class="tiny muted">${roleLabel(actor().role)}</div></div></button></div>${UI.notifications?notificationsView():''}</header><div class="content fade-in"><div class="mobile-only mobile-branch"><select data-branch aria-label="اختيار الفرع">${branchOptions()}</select><span class="local-tag"><span class="dot"></span> ${CONNECTED?(WOTransport.queueInfo().count?'بانتظار المزامنة':WOTransport.queueInfo().online?'حساب متصل':'دون اتصال'):'محفوظ على جهازك'}</span></div>${loadError?alertBox(esc(loadError),'orange'):''}${CONNECTED&&WOTransport.queueInfo().readOnly?`<div class="alert-box orange mb">${ico('shield')}<div><b>هذا التبويب للقراءة فقط</b><p class="tiny mt">${esc(WOTransport.queueInfo().readOnlyReason)}</p><button class="btn sm mt" data-action="central-reload">إعادة فتح التبويب</button></div></div>`:''}${CONNECTED&&WOTransport.queueInfo().count?`<a href="#/sync" class="alert-box ${WOTransport.queueInfo().blocked?'orange':'teal'} mb">${ico('refresh')}<span>${WOTransport.queueInfo().count} عملية ${WOTransport.queueInfo().blocked?'تحتاج مراجعتك':'بانتظار تأكيد الخادم'} — فتح المزامنة</span></a>`:''}${view}<footer class="page-footnote">${esc(state.brand.footer||'كل أمر واضح. كل مرحلة موثقة.')} · ${esc(bname(UI.branch)==='غير محدد'?'جميع الفروع':bname(UI.branch))}</footer></div></main><nav class="mobile-nav">${[['home','الرئيسية','home'],[actor().role==='employee'?'myWork':'orders',actor().role==='employee'?'مهامي':'الأوامر','orders'],[canRoute('calculators')?'calculators':'catalog',canRoute('calculators')?'الحاسبات':'الخدمات',canRoute('calculators')?'calculator':'grid'],[CONNECTED?'account':canRoute('settings')?'settings':'myWork','حسابي','users']].map(([id,label,icon])=>`<a href="#/${id}" class="${r.name===id?'active':''}">${ico(icon)}<span>${label}</span></a>`).join('')}</nav></div>`;
 if(r.name==='purchases')updatePurchasePreview();if(r.name==='calculators')updateCalcResult();if(r.name==='nesting')WONestingUI.bind(nestingContext());if(r.name==='reviews')renderQR();if(r.name==='newOrder')bindOrderForm();if(r.name==='settings'&&UI.settingsTab==='brand')bindBrandPreview();}
function roleLabel(role){return {owner:'مالك النظام',manager:'مدير الفرع',employee:'موظف التشغيل',purchasing:'مسؤول المشتريات'}[role]||role;}
function branchOptions(){return (perm('view_all_branches')?`<option value="all" ${UI.branch==='all'?'selected':''}>جميع الفروع</option>`:'')+allowedBranches().map(b=>`<option value="${b.id}" ${UI.branch===b.id?'selected':''}>${esc(b.name)}</option>`).join('');}
function renderLogin(){if(CONNECTED){$('#app').innerHTML=WOConnectedUI.login({error:centralError});return;}const roles=[['owner','الإدارة الكاملة','الفروع، الصلاحيات، الأسعار والتقارير','shield','#8354cb'],['manager1','بوابة مدير الفرع','متابعة تشغيل الفرع واعتماد الأعمال','branch','#19b6b4'],['emp1','بوابة الموظف','المهام المسندة والوقت والإنجاز','users','#5096e8'],['buyer','بوابة المشتريات','طلبات الشراء والتوريد والاستلام','purchase','#f0a04f']];$('#app').innerHTML=`<div class="login-page"><section class="login-brand"><div><img src="${logo()}" class="brand-logo" alt="${esc(state.brand.name)}"><h1>كل شغلك.<br>من الفكرة إلى التسليم.</h1><p>مساحة واحدة لأوامر العمل والفروع والموظفين والخامات، مصممة لتفاصيل الدعاية والإعلان.</p><div class="login-icons">${['orders','production','scissors','lightbulb','inventory','users','chart','review'].map((n,i)=>appico(n,Object.values(COLORS)[i])).join('')}</div></div></section><section class="login-form"><div class="login-inner"><div class="eyebrow">${esc(state.brand.name)}</div><h2>أهلا بك في مساحة العمل</h2><p class="muted tiny">اختر بوابة لتجربة النظام بصلاحيات مختلفة.</p><div class="role-options">${roles.filter(x=>state.users.some(u=>u.id===x[0])).map(([id,t,d,ic,col])=>`<button class="role-card" data-action="login" data-user="${id}">${appico(ic,col)}<div class="grow"><h3>${t}</h3><p>${d}</p></div>${ico('arrow')}</button>`).join('')}</div><div class="field mt"><label for="demo-user-select">تجربة حساب آخر أو موظف جديد</label><div class="row"><select id="demo-user-select">${state.users.filter(u=>u.active!==false).map(u=>`<option value="${u.id}">${esc(u.name)} — ${roleLabel(u.role)}</option>`).join('')}</select>${btn('دخول','login-selected','soft','','arrow')}</div></div><div class="login-note">هذه بوابات عرض محلية ببيانات توضيحية. العمليات تحفظ في هذا المتصفح. المصادقة الآمنة وربط الأجهزة والفروع عبر الخادم هما مرحلة التكامل التالية.</div><div class="tiny muted text-center mt">نظام أوامر العمل والتشغيل · 1.0</div></div></section></div>`;}
function statsView(items){return `<div class="stats">${items.map(([label,value,icon,color,sub])=>`<div class="stat">${appico(icon,color,true)}<div><div class="label">${label}</div><div class="value">${value}</div>${sub?`<div class="sub">${sub}</div>`:''}</div></div>`).join('')}</div>`;}
function guideContext(){return {brand:state.brand,actor:actor(),branches:allowedBranches(),users:state.users,materials:state.materials,clients:state.clients,orders:orders(),can:perm};}
function guideView(){return title('ابدأ هنا','دليل عملي من إعداد المنشأة إلى أول أمر عمل')+WOOnboarding.page(guideContext());}
function homeView(){const os=orders(),active=os.filter(o=>!['delivered','cancelled'].includes(o.status)),late=os.filter(isLate),ready=os.filter(o=>o.status==='ready'),done=os.filter(o=>o.status==='delivered');const nearest=active.slice().sort((a,b)=>new Date(a.dueAt)-new Date(b.dueAt)).slice(0,5);const quick=NAV.filter(([id])=>['orders','proofs','production','inventory','calculators','nesting','purchases','employees','reviews','reports'].includes(id)&&canRoute(id));const deliveredPct=os.length?Math.round(done.length/os.length*100):0;
 return `${WOOnboarding.banner(guideContext())}<div class="hero"><div><div class="greeting">أهلا ${esc(actor().name.split(' ')[0])}، يوم جديد وإنجاز جديد</div><h1>متابعة أعمالك تبدأ من هنا</h1><p>${active.length} أمر عمل جار في ${UI.branch==='all'?allowedBranches().length+' فروع':esc(bname(UI.branch))}. تابع الأولويات ووزع العمل ووثق كل مرحلة.</p>${perm('manage_orders')?btn('أمر عمل جديد','navigate','','data-to="newOrder"','plus'):btn('عرض مهامي','navigate','','data-to="myWork"','orders')}</div><div class="hero-art"><div class="hero-circle"><div><b>${deliveredPct}%</b><small>أوامر تم تسليمها</small></div></div><div class="hero-float">${ico('orders')}</div><div class="hero-float top">${ico('check')}</div></div></div>${statsView([['أوامر العمل',os.length,'orders','#8b60d1','كل مراحل التشغيل'],['قيد التنفيذ',os.filter(o=>o.status==='production').length,'production','#19b6b4','شغل يتحرك الآن'],['جاهز للتسليم',ready.length,'package','#55b894','بانتظار العميل'],['طلبات متأخرة',late.length,'clock','#ed9450','تحتاج إلى متابعة']])}<div class="section-label"><h2>أقسام مساحة العمل</h2><span class="tiny muted">كل قسم بمكانه</span></div><div class="launcher">${quick.map(([id,label,icon])=>`<button class="launch" data-action="navigate" data-to="${id}">${appico(icon,COLORS[id])}<span>${label}</span></button>`).join('')}</div><div class="grid main-side mt"><section class="card"><div class="card-head"><div><h2>الأولوية في التسليم</h2><p>الأقرب موعدا، مع حالة كل طلب</p></div><a class="tiny" href="#/orders">كل الأوامر ←</a></div>${orderTable(nearest,false)}</section><div class="stack"><section class="card"><div class="card-head"><h2>بانتظار المتابعة</h2>${ico('bell')}</div>${attentionList()}</section><section class="card"><div class="card-head"><h2>حركة الإنتاج</h2><a class="tiny" href="#/${canRoute('production')?'production':'myWork'}">عرض</a></div><div class="budget-list">${[['approval','اعتماد التصميم','#f0a04f'],['queued','جاهز للتنفيذ','#8b60d1'],['production','قيد التنفيذ','#19b6b4'],['quality','الجودة','#5096e8']].map(([s,l,col])=>{const n=os.filter(o=>o.status===s).length;return `<div class="budget-line"><span>${l}</span><div class="progress"><span style="width:${os.length?n/os.length*100:0}%;background:${col}"></span></div><b>${n} أوامر</b></div>`;}).join('')}</div></section></div></div>`;}
function attentionList(){const pending=scoped(state.purchases).filter(p=>p.status==='requested');const low=scoped(state.materials).filter(m=>m.quantity<=m.minQuantity);const overdue=orders().filter(isLate);let html='';if(pending.length&&canRoute('purchases'))html+=`<a class="mini-row" href="#/purchases">${appico('purchase','#ed9450',true)}<div class="grow"><h4>${pending.length} طلبات شراء</h4><p>تنتظر اعتماد المدير</p></div>${ico('arrow','sm')}</a>`;if(low.length&&canRoute('inventory'))html+=`<a class="mini-row" href="#/inventory">${appico('inventory','#dc6c81',true)}<div class="grow"><h4>${low.length} خامات منخفضة</h4><p>راجع الكميات قبل التنفيذ</p></div>${ico('arrow','sm')}</a>`;if(overdue.length)html+=`<a class="mini-row" href="#/orders">${appico('clock','#8b60d1',true)}<div class="grow"><h4>${overdue.length} أوامر تجاوزت موعدها</h4><p>راجع الوقت وتوزيع الفريق</p></div>${ico('arrow','sm')}</a>`;return html||'<div class="tiny muted">لا توجد تنبيهات حالية في هذا النطاق.</div>';}
function notificationsView(){return `<div class="card notification-list"><div class="card-head"><h2>تنبيهات التشغيل</h2><button class="icon-btn" data-action="notifications" aria-label="إغلاق">${ico('close','sm')}</button></div>${attentionList()}<div class="tiny muted mt">تنبيهات محلية من العمليات المسجلة في هذه النسخة.</div></div>`;}
function orderTable(items,withPrice=true){if(!items.length)return empty('لا توجد أوامر في هذا العرض','غير التصفية أو أنشئ أول أمر عمل','orders');return `<div class="table-wrap"><table class="data-table"><thead><tr><th>أمر العمل</th><th>العميل</th><th>الحالة</th><th>التسليم</th><th>الفريق</th>${withPrice&&financial()?'<th>البيع</th>':''}<th></th></tr></thead><tbody>${items.map(o=>`<tr><td><a class="order-link" href="#/order/${o.id}">#${esc(o.number)}</a><span class="subline">${esc(o.title)}</span></td><td>${esc(client(o.clientId)?.name||'عميل مباشر')}<span class="subline">${esc(bname(o.branchId))}</span></td><td>${statusTag(o.status)}</td><td class="${isLate(o)?'overdue':''}">${day(o.dueAt)}${isLate(o)?'<span class="subline" style="color:var(--red)">متأخر</span>':''}</td><td>${teamAvatars(o)}</td>${withPrice&&financial()?`<td>${money(o.salePrice)}</td>`:''}<td><a class="icon-btn" href="#/order/${o.id}" aria-label="تفاصيل أمر ${esc(o.number)}">${ico('arrow','sm')}</a></td></tr>`).join('')}</tbody></table></div>`;}
const PROOF_LABELS={"pending":["بانتظار رد العميل","orange"],"approved":["وافق العميل","green"],"changes_requested":["طلب العميل تعديلا","red"],"needs_resend":["يحتاج إصدارا جديدا","orange"]};
function proofBadge(o){if(!o.proofRequired)return tag('لم يطلب اعتماد العميل','gray');const info=PROOF_LABELS[o.proofStatus]||['حالة اعتماد غير معروفة','orange'];return tag(info[0],info[1]);}
function proofPanel(o){
 if(!perm('manage_orders',o.branchId))return '';
 const editable=['draft','approval'].includes(o.status),existing=!!o.proofToken,hasImage=!!(o.designDataUrl&&o.designDataUrl.startsWith('data:image/'));
 const last=o.proofDecision,history=Array.isArray(o.proofHistory)?o.proofHistory:[];
 return `<section class="card mb"><div class="card-head"><div><h2>اعتماد التصميم من العميل</h2><p>قرار العميل منفصل عن اعتماد المسؤول الداخلي وإذن بدء الإنتاج.</p></div>${proofBadge(o)}</div><div class="grid two"><div class="stack"><div class="details-grid"><div class="detail-item"><small>إصدار التصميم</small><b>${o.proofRevision||'لم يرسل'}</b></div><div class="detail-item"><small>اعتماد المسؤول</small><b>${o.designApproved?'تم الاعتماد':'بانتظار الاعتماد'}</b></div></div><div class="row wrap">${editable&&hasImage&&!existing&&CONNECTED?btn('إنشاء رابط العميل','proof-send','primary','data-id="'+o.id+'"','plus'):''}${editable&&existing&&CONNECTED?btn('نسخ رابط العميل','proof-copy','soft','data-id="'+o.id+'"','copy'):''}${editable&&existing&&CONNECTED?btn('إصدار رابط جديد','proof-renew','','data-id="'+o.id+'"','refresh'):''}${CONNECTED?btn('تحديث حالة الاعتماد','proof-refresh','sm','','refresh'):''}</div>${!hasImage&&editable?alertBox('أرفق صورة التصميم أولا حتى تتمكن من إرساله للعميل.','orange','info'):''}${!CONNECTED?alertBox('اعتماد العملاء عبر الرابط يحتاج تشغيل الخادم المركزي.','gray','info'):''}</div><div class="stack">${last?`<div class="selection-card"><b>آخر رد من العميل</b><p>${esc(last.comment||'لم يضف ملاحظات')}</p><p class="tiny muted">${esc(last.name||'بدون اسم')} · ${dt(last.at)}</p></div>`:alertBox('عند تسجيل موافقة العميل أو طلب التعديل ستظهر النتيجة هنا، مع رقم الإصدار.','teal','shield')}${history.length>1?`<p class="tiny muted">الإصدارات السابقة المسجلة: ${history.length}</p>`:''}</div></div>${o.proofRequired&&o.proofStatus!=='approved'?`<div class="field-note">لن ينتقل هذا الأمر إلى التنفيذ قبل موافقة العميل على أحدث إصدار، إضافة إلى اعتماد المسؤول الداخلي.</div>`:''}</section>`;
}
function proofsView(){
 const list=orders().filter(o=>perm('manage_orders',o.branchId)&&!['delivered','cancelled'].includes(o.status));
 const pending=list.filter(o=>o.proofStatus==='pending'),changes=list.filter(o=>['changes_requested','needs_resend'].includes(o.proofStatus)),accepted=list.filter(o=>o.proofStatus==='approved');
 return title('اعتمادات العملاء','موافقة التصميم، طلب التعديلات، وتوثيق إصدار كل أمر',CONNECTED?btn('تحديث الموافقات','proof-refresh','soft','','refresh'):'')+statsView([['بانتظار العميل',pending.length,'clock','#d2a44c'],['تحتاج تعديلات',changes.length,'edit','#db6783'],['وافق العميل',accepted.length,'check','#38b6a8'],['لم تطلب الموافقة',list.filter(o=>!o.proofRequired).length,'orders','#8b60d1']])+alertBox('اعتماد العميل لا يلغي اعتماد المسؤول الداخلي، ولا يستبدل فحص الجودة.','teal','shield')+`<section class="card mt"><div class="card-head"><h2>أوامر العمل وموافقاتها</h2><span class="tiny muted">الأوامر النشطة</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>أمر العمل</th><th>الفرع</th><th>مرحلة الإنتاج</th><th>قرار العميل</th><th>الإصدار</th><th>التسليم</th><th></th></tr></thead><tbody>${list.map(o=>`<tr><td><a class="order-link" href="#/order/${encodeURIComponent(o.id)}">#${esc(o.number)}</a><span class="subline">${esc(o.title)}</span></td><td>${esc(bname(o.branchId))}</td><td>${statusTag(o.status)}</td><td>${proofBadge(o)}</td><td>${o.proofRevision||'—'}</td><td>${day(o.dueAt)}</td><td><a class="btn sm" href="#/order/${encodeURIComponent(o.id)}">تفاصيل واعتماد</a></td></tr>`).join('')}</tbody></table></div>${!list.length?empty('لا توجد أوامر نشطة','يمكن إنشاء أمر جديد من قسم أوامر العمل','orders'):''}</section>`;
}
function ordersView(){let os=orders();if(UI.status!=='all')os=os.filter(o=>UI.status==='late'?isLate(o):o.status===UI.status);if(UI.query){const q=UI.query.toLowerCase();os=os.filter(o=>[o.number,o.title,client(o.clientId)?.name].join(' ').toLowerCase().includes(q));}return title('أوامر العمل','من استلام الطلب حتى التسليم النهائي',perm('manage_orders')?btn('أمر جديد','navigate','primary','data-to="newOrder"','plus'):'')+`<div class="toolbar">${searchBar('ابحث برقم الأمر أو العميل أو نوع العمل…')}<div class="row">${btn('طباعة القائمة','print-orders','','','print')}${btn('تصدير','export-orders','','','download')}</div></div><div class="pill-filters mb">${[['all','الكل'],['approval','اعتماد'],['queued','جاهز للتنفيذ'],['production','قيد التنفيذ'],['ready','جاهز للتسليم'],['delivered','تم التسليم'],['late','المتأخرة']].map(([id,l])=>`<button class="pill ${UI.status===id?'active':''}" data-action="order-filter" data-value="${id}">${l}</button>`).join('')}</div><div class="card">${orderTable(os)}</div>`;}
function orderForm(id){const edit=id?orders().find(o=>o.id===id):null;if(id&&!edit)return empty('أمر غير متاح','لا يمكنك تعديل أمر خارج صلاحياتك','shield');const saved=state.drafts.order;const d=edit||(saved&&allowedBranches().some(b=>b.id===saved.branchId)?saved:{});UI.formImage=d.designDataUrl||'';let branchId=d.branchId||ownBranch();if(!allowedBranches().some(b=>b.id===branchId))branchId=ownBranch();const selectedCat=d.category||'acrylic';const members=state.users.filter(u=>u.active!==false&&u.role==='employee'&&u.branchIds.includes(branchId));const team=d.assignees||[];return title(edit?'تعديل أمر العمل #'+edit.number:'أمر عمل جديد','سجل التفاصيل مرة واحدة، ويتابعها الفريق في كل المراحل',btn('رجوع','navigate','','data-to="orders"','arrow'))+`<form id="order-form" data-order-id="${esc(edit?.id||'')}"><div class="grid main-side"><div class="stack"><section class="card"><h2 class="form-section-title">${appico('orders','#8354cb',true)} بيانات الطلب</h2><div class="form-grid">${selectField('الفرع','branchId',allowedBranches().map(b=>[b.id,b.name]),branchId,'required')}${selectField('العميل','clientId',[['','اختر العميل'],...state.clients.filter(c=>c.branchId===branchId).map(c=>[c.id,c.name])],d.clientId||'','required')}${selectField('القسم','category',K.categories.map(c=>[c.id,c.name]),selectedCat)}${selectField('نوع الخدمة','service',[['','اختيار خدمة'],...(cat(selectedCat)?.services||[]).map(s=>[s.name,s.name])],d.service||'')}${field('اسم العمل','title',d.title||'','text','required maxlength="100" placeholder="مثال: لوحة واجهة محل"')}${selectField('الأولوية','priority',[['normal','عادية'],['high','عالية'],['urgent','عاجلة']],d.priority||'normal')}${field('موعد التسليم','dueAt',dateInput(d.dueAt)||dateInput(new Date(Date.now()+86400000)),'datetime-local','required')}${field('الكمية','quantity',d.quantity||1,'number','required min="1" max="100000" step="1"')}<div class="field full"><label for="f-description">وصف العمل والتعليمات</label><textarea name="description" id="f-description" maxlength="2000" placeholder="الخامة، التشطيب، متطلبات العميل، وملاحظات التركيب…">${esc(d.description||'')}</textarea></div></div></section><section class="card"><h2 class="form-section-title">${appico('scissors','#19b6b4',true)} المقاسات والخامات</h2><div class="form-grid three">${field('العرض','width',d.width??50,'number','min="0" step="0.01"')}${field('الارتفاع / الطول','height',d.height??30,'number','min="0" step="0.01"')}${selectField('وحدة المقاس','unit',[['cm','سم'],['m','متر'],['piece','قطعة']],d.unit||'cm')}${selectField('الخامة الرئيسية','materialId',[['','بدون تخصيص الآن'],...state.materials.filter(m=>m.branchId===branchId).map(m=>[m.id,m.name])],d.materialId||'')}${financial()?field('التكلفة التقديرية الإجمالية','estimatedCost',d.estimatedCost||0,'number','min="0" step="0.01"'):''}${financial()?field('قيمة البيع الإجمالية','salePrice',d.salePrice||0,'number','min="0" step="0.01"'):''}</div><div class="field-note">المقاسات الفعلية تدخل كما هي. قواعد احتساب سعر الحروف والشعار تطبق في الحاسبة فقط.</div>${canRoute('calculators')?`<a class="link-btn" href="#/calculators">افتح الحاسبة لتجهيز التكلفة والسعر ←</a>`:''}</section><section class="card"><div class="card-head"><div><h2>توزيع المهمة على الفريق</h2><p>الحصص مجموعها 100%، مع مدة تنفيذ وموعد تسليم لكل موظف.</p></div><span id="team-total" class="tag purple">${team.reduce((s,a)=>s+Number(a.share),0)}%</span></div><div id="team-picker" class="team-picker">${teamPicker(members,team,d.dueAt||new Date(Date.now()+86400000))}</div></section></div><aside class="stack"><section class="card"><h2 class="form-section-title">التصميم والمرفقات</h2><label class="upload-box" for="design-upload" id="design-preview">${UI.formImage?`<img src="${imageSafe(UI.formImage)}" alt="التصميم المرفق">`:ico('photo','lg')}<span>ارفع صورة التصميم</span><small>PNG، JPG أو WebP · حتى 2 MB</small></label><input id="design-upload" data-upload="design" type="file" accept="image/png,image/jpeg,image/webp" hidden><div class="field-note">اعتماد التصميم خطوة منفصلة لدى المدير قبل الإنتاج.</div></section>${alertBox('المسودة تحفظ تلقائيا على جهازك أثناء الكتابة. يمكنك التنقل والعودة لاستكمالها.','teal','save')}<section class="card"><h3>قبل إرسال أمر العمل</h3><div class="checklist mt"><div>${ico('check')} العميل والفرع واضحان</div><div>${ico('check')} المقاسات والكمية محددة</div><div>${ico('check')} الفريق والموعد مسجلان</div></div><div class="form-actions"><button class="btn primary full" type="submit">${ico('check')} ${edit?'حفظ التعديل':'حفظ وإرسال لاعتماد التصميم'}</button>${!edit?btn('حفظ كمسودة','save-order-draft','full','','save'):''}</div><div id="draft-indicator" class="save-indicator mt"></div></section></aside></div></form>`;}
function teamPicker(members,team,defaultDueAt){return members.map(u=>{const a=team.find(x=>x.userId===u.id);return `<div class="team-row"><input type="checkbox" data-team-user="${u.id}" aria-label="إسناد إلى ${esc(u.name)}" ${a?'checked':''}><label>${esc(u.name)}<small class="muted" style="display:block">${esc(u.jobTitle||'فريق الإنتاج')}</small></label><div class="field"><input type="number" data-team-share="${u.id}" aria-label="حصة ${esc(u.name)}" value="${a?.share??0}" min="0" max="100" step="0.01"><small class="muted">الحصة %</small></div><div class="field"><input type="number" data-team-time="${u.id}" aria-label="الوقت المتوقع ${esc(u.name)}" value="${a?.plannedMinutes??60}" min="1" max="100000" step="1"><small class="muted">الوقت بالدقائق</small></div><div class="field team-deadline"><input type="datetime-local" data-team-due="${u.id}" aria-label="موعد تسليم ${esc(u.name)}" value="${dateInput(a?.dueAt||defaultDueAt)}"><small class="muted">موعد تسليم الموظف</small></div></div>`;}).join('')||'<p class="muted tiny">أضف موظفين لهذا الفرع من قسم الفريق.</p>';}
function readTeam(form){return $$('[data-team-user]:checked',form).map(el=>({userId:el.dataset.teamUser,share:Number($(`[data-team-share="${el.dataset.teamUser}"]`,form).value),plannedMinutes:Number($(`[data-team-time="${el.dataset.teamUser}"]`,form).value),actualMinutes:0,done:false,completedAt:null,dueAt:dateToISO($(`[data-team-due="${el.dataset.teamUser}"]`,form)?.value||form.elements.dueAt.value)}));}
function dateToISO(value){if(!value)return '';const stamp=new Date(value);if(!Number.isFinite(stamp.getTime()))throw new Error('اختر موعدا صالحا');return stamp.toISOString();}
function orderDraft(form){const v=values(form);v.dueAt=dateToISO(v.dueAt);v.assignees=readTeam(form);v.designDataUrl=UI.formImage;return v;}
function bindOrderForm(){const f=$('#order-form');if(f.dataset.orderId){f.elements.branchId.disabled=true;const o=orders().find(x=>x.id===f.dataset.orderId);if(o?.assignees.some(a=>a.done||a.acceptedAt))$$('#team-picker input',f).forEach(x=>x.disabled=true);}f.addEventListener('input',()=>{const total=readTeam(f).reduce((s,a)=>s+a.share,0);$('#team-total').textContent=fmt(total,0)+'%';$('#team-total').className='tag '+(Math.abs(total-100)<.01?'green':'orange');clearTimeout(draftTimer);draftTimer=setTimeout(()=>{if(!f.dataset.orderId){state.drafts.order=orderDraft(f);try{persist();const ind=$('#draft-indicator');if(ind)ind.innerHTML=ico('check','sm')+' تم حفظ المسودة';}catch(e){toast('لم تحفظ المسودة. مساحة التخزين غير كافية.',true);}}},350);});}
const COST_TYPES=[["labor","أجور التنفيذ"],["machine","تشغيل الماكينة"],["finishing","التشطيب والتجميع"],["outsourcing","تصنيع خارجي"],["installation","التركيب"],["delivery","النقل والتوصيل"],["other","تكلفة مباشرة أخرى"]];
function costSection(o){
 if(!financial())return '';
 const canEdit=perm('manage_orders',o.branchId);
 const records=o.costItems||[];
 const active=records.filter(c=>!c.reversedAt).reduce((n,c)=>n+c.amount,0);
 return `<section class="card"><div class="card-head"><div><h2>تكاليف التشغيل المباشرة</h2><p>أجور العاملين والماكينات والتشطيب والتركيب وغيرها؛ بخلاف الخامات المصروفة.</p></div>${ico('calculator')}</div>${records.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>البند</th><th>المبلغ</th><th>الحالة</th><th></th></tr></thead><tbody>${records.map(c=>`<tr><td><b>${esc(COST_TYPES.find(x=>x[0]===c.type)?.[1]||c.type)}</b><span class="subline">${esc(c.note)} · ${dt(c.at)}</span>${c.reversedAt?`<span class="subline">سبب التصحيح: ${esc(c.reverseReason)}</span>`:''}</td><td>${money(c.amount)}</td><td>${tag(c.reversedAt?'تم عكس التكلفة':'مسجلة',c.reversedAt?'gray':'green')}</td><td>${canEdit&&!c.reversedAt?btn('تصحيح','cost-correct','sm','data-id="'+c.id+'"','edit'):''}</td></tr>${canEdit&&!c.reversedAt?`<tr><td colspan="4"><form id="cost-reverse-form" data-id="${o.id}" data-cost-id="${c.id}" class="hidden"><div class="row"><input name="reason" required maxlength="500" placeholder="سبب عكس التكلفة (إلزامي)"><button class="btn danger" type="submit">توثيق التصحيح</button></div></form></td></tr>`:''}`).join('')}</tbody></table></div>`:'<p class="tiny muted">لم تسجل تكاليف تشغيل إضافية بعد.</p>'}<div class="breakdown mt"><div><span>إضافات التشغيل الفعالة</span><b>${money(active)}</b></div><div><span>تكلفة الأمر المسجلة الإجمالية</span><b>${money(o.actualCost)}</b></div></div>${canEdit?`<form id="cost-form" data-id="${o.id}" class="inline-form"><h3>إضافة تكلفة مباشرة</h3><div class="form-grid mt">${selectField('نوع التكلفة','type',COST_TYPES,'labor')}${field('المبلغ','amount','','number','required min="0.01" step="0.01"')}${field('تفصيل التكلفة وسببها','note','','text','required maxlength="500"')}</div><div class="form-actions"><button class="btn primary" type="submit">تسجيل التكلفة</button></div></form>`:''}<p class="field-note">عند وجود خطأ، استخدم تصحيحا موثقا بدل حذف السجل. لا تُسجل الخامة مرتين إذا صرفت من المخزون بالفعل.</p></section>`;
}
function orderView(id){const o=orders().find(x=>x.id===id);if(!o)return title('أمر غير متاح')+empty('لا يمكنك الوصول لهذا الأمر','قد يكون خارج الفرع أو غير مسند إلى حسابك','shield');const editable=perm('manage_orders',o.branchId)&&!['delivered','cancelled'].includes(o.status);const team=o.assignees||[];const next={draft:'approval',approval:'queued',queued:'production',production:'quality',quality:'ready',ready:'delivered'}[o.status];const nextText={draft:'إرسال للاعتماد',approval:'إرسال للتنفيذ',queued:'بدء الإنتاج',production:'إرسال لفحص الجودة',quality:'تأكيد الجاهزية',ready:'تأكيد التسليم للعميل'}[o.status];const rems=state.remnants.filter(r=>r.branchId===o.branchId&&r.status==='available'&&(!o.materialId||r.materialId===o.materialId)&&fits(r,o));const reserved=state.remnants.filter(r=>r.reservedFor===o.id&&r.status==='reserved');const my=team.find(a=>a.userId===actorId);return title('أمر العمل #'+o.number,o.title,`${btn('أمر العمل','print-order','','data-id="'+o.id+'"','print')}${financial()&&perm('manage_orders',o.branchId)?btn('عرض سعر','print-quote','','data-id="'+o.id+'"','print'):''}${o.status==='delivered'?btn('محضر تسليم','print-delivery','','data-id="'+o.id+'"','check'):''}${o.proofRequired&&o.proofStatus==='approved'?btn('إثبات الاعتماد','print-approval','','data-id="'+o.id+'"','check'):''}${editable?btn('تعديل','navigate','','data-to="newOrder/'+o.id+'"','edit'):''}`)+`<div class="row wrap mb">${statusTag(o.status)}${priorityTag(o.priority)}${tag(bname(o.branchId),'gray')}${isLate(o)?tag('تجاوز موعد التسليم','red'):''}${o.designApproved?tag('التصميم معتمد داخليا','green'):tag('التصميم بانتظار اعتماد المسؤول','orange')}</div>${proofPanel(o)}<div class="grid main-side"><div class="stack"><section class="card"><div class="grid two"><div class="order-preview">${o.designDataUrl?`<img src="${imageSafe(o.designDataUrl)}" alt="التصميم المعتمد">`:`<div class="design-default"><div class="sign"><img src="${logo()}" alt="معاينة توضيحية للهوية"></div><span class="tiny muted">معاينة الهوية · أرفق تصميم العمل الفعلي</span></div>`}</div><div><h2>${esc(o.title)}</h2><p class="tiny muted mt">${esc(o.description||'لا توجد ملاحظات إضافية')}</p><div class="details-grid mt"><div class="detail-item"><small>العميل</small><b>${esc(client(o.clientId)?.name||'عميل مباشر')}</b></div><div class="detail-item"><small>الكمية</small><b>${fmt(o.quantity)} قطعة</b></div><div class="detail-item"><small>المقاسات</small><b>${fmt(o.width,1)} × ${fmt(o.height,1)} ${o.unit==='m'?'متر':o.unit==='piece'?'قطعة':'سم'}</b></div><div class="detail-item"><small>موعد التسليم</small><b>${dt(o.dueAt)}</b></div></div></div></div><div class="stepper">${STAGES.slice(1,7).map((s,i)=>{const current=STAGES.findIndex(x=>x[0]===o.status)-1;return `<div class="step ${i<current?'done':i===current?'current':''}"><div class="step-dot">${i<current?ico('check','sm'):''}</div>${s[1]}</div>`;}).join('')}</div><div class="form-actions">${next&&perm('manage_production',o.branchId)?btn(nextText,'advance-order','primary','data-id="'+o.id+'" data-next="'+next+'"','check'):''}${!o.designApproved&&perm('approve_design',o.branchId)?btn('اعتماد التصميم','approve-design','soft','data-id="'+o.id+'"','shield'):''}${o.status==='quality'&&perm('manage_production',o.branchId)?`<label class="check"><input type="checkbox" data-quality="${o.id}" ${o.qualityPassed?'checked':''}> تم فحص المقاسات والخامة والتشطيب</label>`:''}${o.status==='delivered'&&perm('view_reviews',o.branchId)?btn('رابط تقييم العميل','order-review','soft','data-id="'+o.id+'"','qr'):''}${editable?btn('إلغاء الأمر','cancel-order','danger sm','data-id="'+o.id+'"','close'):''}</div></section><section class="card"><div class="card-head"><div><h2>الفريق وتوزيع الإنجاز</h2><p>كل موظف يحتسب له نصيبه عند إتمام مهمته، وليس الأمر كاملا.</p></div>${tag(fmt(team.reduce((s,a)=>s+Number(a.share),0))+'% موزعة','purple')}</div>${team.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>الموظف</th><th>حصة الإنجاز</th><th>الوقت المخطط</th><th>موعد الموظف</th><th>الوقت الفعلي</th><th>الحالة</th></tr></thead><tbody>${team.map(a=>`<tr><td><div class="row">${avatar(a.userId,true)}${esc(uname(a.userId))}</div></td><td>${fmt(a.share)}%</td><td>${fmt(a.plannedMinutes)} دقيقة</td><td>${dt(a.dueAt||o.dueAt)}</td><td>${fmt(a.actualMinutes)} دقيقة</td><td>${tag(a.done?'مكتملة':a.acceptedAt?'تم الاستلام':'بانتظار الاستلام',a.done?'green':a.acceptedAt?'blue':'gray')}</td></tr>`).join('')}</tbody></table></div>`:empty('لم يحدد فريق العمل','عدل الأمر وأضف الموظفين وحصصهم','users')}${my&&!my.done&&o.status==='production'&&!my.acceptedAt?`<div class="mt">${btn('استلام مهمتي وبدء التنفيذ','accept-task','primary','data-id="'+o.id+'"','check')}<p class="field-note">يثبت وقت الاستلام لحصتك. سجل الإنجاز والوقت الفعلي عند الانتهاء.</p></div>`:''}${my&&!my.done&&my.acceptedAt&&o.status==='production'?`<form id="complete-task-form" class="inline-form" data-id="${o.id}"><div class="row wrap"><div class="grow">${field('الوقت الفعلي لإنجاز مهمتك (دقيقة)','minutes',my.plannedMinutes||60,'number','min="1" max="100000" required')}</div><button type="submit" class="btn primary">${ico('check')} إتمام مهمتي</button></div><div class="field-note">يتم إثبات إنجاز حصتك فقط، ويبقى باقي الفريق مستقلا.</div></form>`:''}</section><section class="card"><div class="card-head"><h2>الخامات المصروفة والهدر</h2>${perm('manage_inventory',o.branchId)||my?btn('تسجيل صرف','toggle-consumption','soft sm','data-id="'+o.id+'"','plus'):''}</div>${(o.consumptions||[]).length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>الخامة</th><th>المصروف</th><th>الهدر منه</th>${financial()?'<th>التكلفة</th>':''}</tr></thead><tbody>${o.consumptions.map(c=>`<tr><td>${esc(state.materials.find(m=>m.id===c.materialId)?.name||c.materialId)}</td><td>${fmt(c.quantity,2)}</td><td>${fmt(c.wasteQuantity,2)}</td>${financial()?`<td>${money(c.cost??c.quantity*(c.unitCost||0))}</td>`:''}</tr>`).join('')}</tbody></table></div>`:'<p class="tiny muted">لم يسجل صرف خامات لهذا الأمر بعد.</p>'}<div id="consumption-area" class="hidden"><form id="consume-form" data-id="${o.id}" class="inline-form"><div class="form-grid">${selectField('الخامة','materialId',state.materials.filter(m=>m.branchId===o.branchId).map(m=>[m.id,`${m.name} — متاح لهذا الأمر ${fmt(I?I.availability(state,m.id,o.id).available+I.availability(state,m.id,o.id).allocatedToOrder:m.quantity,2)} ${m.unit}`]),o.materialId||'')}${field('إجمالي المصروف','quantity',1,'number','required min="0.001" step="0.001"')}${field('الهدر من الكمية المصروفة','wasteQuantity',0,'number','required min="0" step="0.001"')}${field('سبب الصرف أو الهدر','note','','text','maxlength="300"')}</div><div class="form-actions"><button type="submit" class="btn primary">تأكيد الصرف</button></div></form></div></section><section class="card"><h2 class="form-section-title">الملاحظات والتوثيق</h2><div class="timeline">${(o.notes||[]).map(n=>`<div class="timeline-item">${esc(n.text)}<small>${esc(uname(n.userId))} · ${dt(n.at)}</small></div>`).join('')||'<div class="tiny muted">كل ملاحظة تظهر هنا مع الموظف والوقت.</div>'}</div><form id="order-note-form" data-id="${o.id}"><div class="row mt"><input name="text" required maxlength="1000" placeholder="أضف تحديثا أو ملاحظة على العمل…"><button class="btn primary" type="submit">إضافة</button></div></form><div class="photo-grid mt">${(o.attachments||[]).map(a=>`<img src="${imageSafe(a.dataUrl)}" alt="${esc(a.name)}">`).join('')}</div><label class="btn mt">${ico('camera')} إرفاق صورة استلام أو تسليم<input data-upload="order-photo" data-order-id="${o.id}" type="file" accept="image/png,image/jpeg,image/webp" hidden></label></section></div><aside class="stack">${costSection(o)}${financial()?`<section class="card"><div class="card-head"><h2>بيع وتكلفة الأمر</h2>${ico('chart')}</div><div class="breakdown"><div><span>قيمة البيع</span><b>${money(o.salePrice)}</b></div><div><span>التكلفة التقديرية</span><b>${money(o.estimatedCost)}</b></div><div><span>التكاليف المسجلة</span><b>${money(o.actualCost)}</b></div><div class="total"><span>هامش الأمر ${o.actualCost?'المسجل':'التقديري'}</span><span>${money(o.salePrice-(((o.actualCost>0||o.consumptions?.length)?o.actualCost:o.estimatedCost)||0))}</span></div></div><p class="field-note">قبل أي مصاريف عامة غير مسجلة. الأسعار إجمالية للأمر، وليست تكلفة القطعة.</p></section>`:''}<section class="card"><div class="card-head"><h2>استفد من البواقي</h2>${ico('remnant')}</div>${reserved.map(r=>`<div class="selection-card mb">${tag('محجوزة لهذا الأمر','teal')}<h3 class="mt">${esc(r.name)}</h3><p class="tiny">${r.width} × ${r.height} سم · ${esc(r.location)}</p>${perm('manage_inventory',o.branchId)?btn('فك الحجز','release-remnant','sm mt','data-id="'+r.id+'"','close'):''}</div>`).join('')}${rems.slice(0,3).map(r=>`<div class="selection-card mb"><div class="row">${appico('remnant','#19b6b4',true)}<div><h4>${esc(r.name)}</h4><div class="tiny muted">${r.width} × ${r.height} سم · ${r.thickness} مم</div></div></div><p class="tiny muted mt">${esc(r.location)} · مقاسات مؤكدة</p>${perm('manage_inventory',o.branchId)?btn('حجز لهذا الأمر','reserve-remnant','primary sm full mt','data-id="'+r.id+'" data-order-id="'+o.id+'"','check'):''}</div>`).join('')}${!reserved.length&&!rems.length?'<p class="tiny muted">لا توجد قطعة متاحة مطابقة للخامة والمقاس المسجلين.</p>':''}</section><section class="card"><h3>سجل الأمر</h3><div class="timeline mt">${state.audit.filter(a=>a.entityId===o.id).slice(-6).reverse().map(a=>`<div class="timeline-item">${esc(a.detail||actionLabel(a.action))}<small>${esc(uname(a.actorId))} · ${dt(a.at)}</small></div>`).join('')||`<div class="timeline-item">إنشاء أمر العمل<small>${dt(o.createdAt)}</small></div>`}</div></section></aside></div>`;}
function fits(r,o){const factor=o.unit==='m'?100:1;return (r.width>=o.width*factor&&r.height>=o.height*factor)||(r.width>=o.height*factor&&r.height>=o.width*factor);}
function productionView(){const os=orders().filter(o=>!['draft','cancelled','delivered'].includes(o.status));return title('خط الإنتاج','كل مرحلة واضحة، وكل مهمة لها مسؤول وموعد تسليم',btn('قائمة الأوامر','navigate','','data-to="orders"','orders'))+`<div class="toolbar">${searchBar('ابحث في خط الإنتاج…')}<span class="tiny muted">${os.length} أمر جار · افتح البطاقة لتحديث المرحلة</span></div><div class="kanban">${STAGES.slice(1,6).map(([s,l,col])=>{const list=os.filter(o=>o.status===s&&(!UI.query||(o.title+' '+o.number).includes(UI.query)));return `<section class="kanban-col"><div class="kanban-head"><span>${tag(l,col)}</span><span class="muted">${list.length}</span></div>${list.map(o=>`<article class="kanban-card" data-action="navigate" data-to="order/${o.id}" tabindex="0"><div class="between"><span class="tiny strong muted">#${esc(o.number)}</span>${priorityTag(o.priority)}</div><h3>${esc(o.title)}</h3><p class="tiny muted">${esc(client(o.clientId)?.name||'عميل مباشر')}</p><div class="row mt"><span class="tiny muted">${esc(cat(o.category)?.name||'عمل خاص')}</span></div><div class="bottom">${teamAvatars(o)}<span class="tiny ${isLate(o)?'overdue':'muted'}">${ico('clock','sm').replace('<svg','<svg style="display:inline-block;vertical-align:middle"')} ${day(o.dueAt)}</span></div></article>`).join('')||'<div class="empty tiny">لا توجد أوامر</div>'}</section>`;}).join('')}</div>`;}
function catalogView(){const selected=cat(route().id);if(selected){return title(selected.name,selected.description,btn('كل الأقسام','navigate','','data-to="catalog"','arrow'))+alertBox('أسعار الخدمات أرقام توضيحية قابلة للتعديل من إعدادات التسعير. التكلفة الدقيقة تجهز من الحاسبة بحسب المقاس والكمية والخامة.','gray')+`<div class="grid two mt">${selected.services.map((s,i)=>`<section class="card"><div class="row">${appico(selected.icon,selected.color)}<div><h3>${esc(s.name)}</h3><p class="tiny muted">الوحدة: ${esc(s.unit)}</p></div></div>${financial()?`<div class="metric-big mt">${money(servicePrice(selected.id,i,s.basePrice))}</div><div class="tiny muted">سعر مرجعي للوحدة</div>`:''}<div class="row wrap mt">${perm('manage_orders')?btn('إنشاء أمر','use-service','primary sm','data-category="'+selected.id+'" data-index="'+i+'"','plus'):''}${canRoute('calculators')?btn('حساب التكلفة','open-calc','sm','data-type="'+s.calculator+'"','calculator'):''}</div></section>`).join('')}</div>`;}const list=K.categories.filter(c=>!UI.query||(c.name+' '+c.description+' '+c.services.map(s=>s.name).join(' ')).includes(UI.query));return title('الخدمات والمنتجات','أقسام متخصصة للطباعة والدعاية والتصنيع والتركيب')+`<div class="toolbar">${searchBar('ابحث عن خدمة أو قسم…')}<span class="tag gray">${K.categories.reduce((n,c)=>n+c.services.length,0)} خدمة قابلة للتسعير</span></div><div class="grid three">${list.map(c=>`<section class="card category-card"><div class="between">${appico(c.icon,c.color)}<span class="tiny muted">${c.services.length} خدمات</span></div><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><div class="row wrap gap-6">${c.services.slice(0,3).map(s=>`<span class="service-chip">${esc(s.name)}</span>`).join('')}</div>${btn('فتح القسم','navigate','soft full','data-to="catalog/'+c.id+'"','arrow')}</section>`).join('')}</div>`;}
function servicePrice(category,index,fallback){return state.settings.servicePrices?.[category+'-'+index]??(CONNECTED?0:fallback);}
function legacyInventoryView(){const mats=scoped(state.materials).filter(m=>!UI.query||(m.name+' '+m.category).includes(UI.query));const rems=scoped(state.remnants).filter(r=>!UI.query||(r.name+' '+r.width+' '+r.height+' '+r.location).includes(UI.query));const low=scoped(state.materials).filter(m=>m.quantity<=m.minQuantity).length;return title('المخزون والبواقي','رصيد كل فرع، والخامات المصروفة، والقطع التي تستحق إعادة الاستخدام',btn(UI.inventoryTab==='remnants'?'إضافة قطعة متبقية':'إضافة خامة','inventory-new','primary','','plus'))+statsView([['الخامات المسجلة',scoped(state.materials).length,'inventory','#f0a04f'],['بواقي متاحة',scoped(state.remnants).filter(r=>r.status==='available').length,'remnant','#19b6b4'],['قطع محجوزة',scoped(state.remnants).filter(r=>r.status==='reserved').length,'shield','#8b60d1'],['تنبيه مخزون',low,'alert','#dc6c81']])+tabs([['materials','الخامات والأرصدة'],['remnants','بواقي الخامات'],['movements','حركات الصرف']],UI.inventoryTab,'inventoryTab')+`<div class="toolbar">${searchBar('ابحث بالخامة أو المقاس أو موقع التخزين…')}</div>${UI.inventoryForm?inventoryForm():''}`+(UI.inventoryTab==='remnants'?`<div class="grid three">${rems.map(r=>{const suitable=orders().filter(o=>o.branchId===r.branchId&&o.materialId===r.materialId&&o.quantity===1&&!['delivered','cancelled'].includes(o.status)&&fits(r,o));return `<section class="card remnant-card"><div class="remnant-art">${tag({available:'متاحة',reserved:'محجوزة',used:'مستخدمة'}[r.status],{available:'green',reserved:'purple',used:'gray'}[r.status])}<div class="sheet-piece" style="${r.color==='أسود'?'background:#31313f;border-color:#444':''}"></div></div><div class="remnant-body"><div class="between"><h3>${esc(r.name)}</h3><span class="tiny muted">${esc(r.id)}</span></div><div class="remnant-dim">${fmt(r.width)} × ${fmt(r.height)} <small>سم</small></div><div class="breakdown"><div><span class="muted">السماكة / اللون</span><b>${fmt(r.thickness)} مم · ${esc(r.color)}</b></div><div><span class="muted">الموقع</span><b>${esc(r.location)}</b></div><div><span class="muted">الفرع</span><b>${esc(bname(r.branchId))}</b></div><div><span class="muted">أمر العمل السابق</span><b>${esc(state.orders.find(o=>o.id===r.sourceOrderId)?.number||'—')}</b></div></div><div class="tiny muted mt">${ico('check','sm').replace('<svg','<svg style="display:inline-block;vertical-align:middle"')} المقاسات مؤكدة بواسطة ${esc(uname(r.confirmedBy))}</div>${r.status==='available'?`<div class="mt">${suitable.length?`<select id="reserve-order-${r.id}" aria-label="الأمر المناسب للقطعة">${suitable.map(o=>`<option value="${o.id}">#${esc(o.number)} — ${esc(o.title)}</option>`).join('')}</select>${btn('حجز القطعة للأمر','reserve-remnant','primary full mt','data-id="'+r.id+'"','shield')}`:'<div class="tiny muted">لا توجد أوامر مطابقة حاليا في هذا الفرع.</div>'}</div>`:r.status==='reserved'?`<div class="mt">${tag('للأمر '+(state.orders.find(o=>o.id===r.reservedFor)?.number||''),'purple')}${btn('فك الحجز','release-remnant','sm full mt','data-id="'+r.id+'"','close')}</div>`:''}</div></section>`;}).join('')||empty('لا توجد بواقي مسجلة','سجل القطع الصالحة للاستخدام بعد القص مع مقاساتها','remnant')}</div>`:UI.inventoryTab==='movements'?`<div class="card"><div class="card-head"><h2>صرف الخامات حسب أمر العمل</h2></div>${consumptionTable()}</div>`:`<div class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>الخامة</th><th>الفرع</th><th>الرصيد</th><th>حد الطلب</th>${financial()?'<th>تكلفة الوحدة</th>':''}<th>الحالة</th><th></th></tr></thead><tbody>${mats.map(m=>`<tr><td><b>${esc(m.name)}</b><span class="subline">${esc(m.category||'خامات إنتاج')}</span></td><td>${esc(bname(m.branchId))}</td><td><b>${fmt(m.quantity,2)}</b> ${esc(m.unit)}</td><td>${fmt(m.minQuantity,2)}</td>${financial()?`<td>${money(m.unitCost)}</td>`:''}<td>${tag(m.quantity<=m.minQuantity?'يحتاج شراء':'متوفر',m.quantity<=m.minQuantity?'orange':'green')}</td><td>${btn('طلب شراء','material-purchase','sm','data-id="'+m.id+'"','plus')}</td></tr>`).join('')}</tbody></table></div>${!mats.length?empty('لا توجد خامات','أضف أول خامة لهذا الفرع','inventory'):''}</div>`);}
function inventoryForm(){const rem=UI.inventoryForm==='remnant',b=ownBranch();return `<section class="card mb"><div class="card-head"><h2>${rem?'تسجيل قطعة متبقية':'إضافة خامة جديدة'}</h2><button class="icon-btn" data-action="inventory-close" aria-label="إغلاق النموذج">${ico('close','sm')}</button></div><form id="inventory-form" data-kind="${rem?'remnant':'material'}"><div class="form-grid three">${selectField('الفرع','branchId',allowedBranches().map(x=>[x.id,x.name]),b)}${field('اسم الخامة','name','','text','required maxlength="100"')}${rem?selectField('الخامة الأصلية','materialId',state.materials.filter(m=>m.branchId===b).map(m=>[m.id,m.name])):field('التصنيف','category','خامات إنتاج','text','required maxlength="80"')}${rem?field('العرض (سم)','width',60,'number','min="0.01" step="0.01" required'):field('الرصيد الافتتاحي','quantity',0,'number','min="0" step="0.001" required')}${rem?field('الارتفاع (سم)','height',40,'number','min="0.01" step="0.01" required'):field('حد التنبيه','minQuantity',3,'number','min="0" step="0.001" required')}${rem?field('السماكة (مم)','thickness',3,'number','min="0" step="0.01"'):selectField('وحدة المخزون','unit',[['لوح','لوح'],['متر','متر'],['م²','متر مربع'],['قطعة','قطعة'],['لفة','لفة'],['ملل','ملل'],['ورقة','ورقة'],['علبة','علبة']],'لوح')}${rem?field('اللون','color','أبيض','text','maxlength="50"'):field('تكلفة الوحدة','unitCost',0,'number','min="0" step="0.01" required')}${rem?field('مكان التخزين','location','رف A3','text','required maxlength="100"'):field('المورد','supplier','','text','maxlength="100"')}${rem?selectField('ناتجة عن أمر العمل','sourceOrderId',[['','بدون ربط بأمر سابق'],...orders().filter(o=>o.branchId===b).map(o=>[o.id,o.number+' — '+o.title])]):''}</div>${rem?'<label class="check mt"><input name="confirmed" type="checkbox" required> راجعت المقاس الفعلي وحالة القطعة بعد القص</label>':''}<div class="form-actions"><button class="btn primary" type="submit">حفظ ${rem?'القطعة':'الخامة'}</button></div></form></section>`;}
function consumptionTable(filterDates=false){const rows=orders().flatMap(o=>(o.consumptions||[]).map(c=>({...c,order:o}))).filter(c=>!filterDates||((!UI.reportFrom||c.at>=UI.reportFrom)&&(!UI.reportTo||c.at.slice(0,10)<=UI.reportTo))).sort((a,b)=>new Date(b.at)-new Date(a.at));return rows.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>الأمر</th><th>الخامة</th><th>المصروف</th><th>الهدر</th><th>الموظف</th><th>التاريخ</th>${financial()?'<th>التكلفة</th>':''}</tr></thead><tbody>${rows.map(c=>`<tr><td><a href="#/order/${c.order.id}">${esc(c.order.number)}</a></td><td>${esc(state.materials.find(m=>m.id===c.materialId)?.name||'')}</td><td>${fmt(c.quantity,2)}</td><td>${fmt(c.wasteQuantity,2)}</td><td>${esc(uname(c.userId))}</td><td>${day(c.at)}</td>${financial()?`<td>${money(c.cost)}</td>`:''}</tr>`).join('')}</tbody></table></div>`:empty('لا توجد حركات صرف','يمكن تسجيل الصرف والهدر من داخل أمر العمل أثناء التنفيذ','inventory');}
function purchasesView(){const list=scoped(state.purchases).filter(p=>(UI.purchaseTab==='all'||p.status===UI.purchaseTab)&&(!UI.query||(p.title+' '+p.number).includes(UI.query)));const labels={requested:['بانتظار الاعتماد','orange'],approved:['معتمد للشراء','purple'],received:['تم الاستلام','green'],rejected:['مرفوض','red']};return title('طلبات المشتريات','طلب من الفرع، اعتماد المدير، ثم شراء واستلام موثق',btn('طلب شراء','purchase-new','primary','','plus'))+tabs([['all','كل الطلبات'],['requested','بانتظار الاعتماد'],['approved','معتمدة'],['received','مستلمة']],UI.purchaseTab,'purchaseTab')+`<div class="toolbar">${searchBar('ابحث برقم الطلب أو عنوانه…')}</div>${UI.purchaseForm?purchaseForm():''}<div class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>طلب الشراء</th><th>الفرع</th><th>الخامة والكمية</th><th>القيمة</th><th>الحالة</th><th>الإجراء</th></tr></thead><tbody>${list.map(p=>`<tr><td><b>${esc(p.number)}</b><span class="subline">${esc(p.title)}</span></td><td>${esc(bname(p.branchId))}<span class="subline">${esc(uname(p.requestedBy))}</span></td><td>${esc(state.materials.find(m=>m.id===p.materialId)?.name||'')}<span class="subline">${fmt(p.quantity,2)} ${esc(p.purchaseUnit||state.materials.find(m=>m.id===p.materialId)?.unit||'')}</span>${p.purchaseUnit?`<span class="subline">${p.status==='received'?'أضيف للمخزون:':'يعادل عند الاستلام:'} ${fmt(p.receiptQuantityBase??I.convert(state.materials.find(m=>m.id===p.materialId),p.quantity,p.purchaseUnit),3)} ${esc(state.materials.find(m=>m.id===p.materialId)?.unit||'')}</span>`:''}</td><td>${money(p.quantity*p.unitCost)}</td><td>${tag(...labels[p.status])}</td><td><div class="row">${p.status==='requested'&&perm('approve_purchase',p.branchId)?`${btn('اعتماد','approve-purchase','primary sm','data-id="'+p.id+'"','check')}${btn('رفض','reject-purchase','sm','data-id="'+p.id+'"','close')}`:p.status==='approved'&&perm('receive_purchase',p.branchId)?btn('تأكيد الاستلام','receive-purchase','teal sm','data-id="'+p.id+'"','package'):p.status==='received'?`<span class="tiny muted">${day(p.receivedAt)}</span>`:'<span class="tiny muted">بانتظار المسؤول</span>'}</div></td></tr>`).join('')}</tbody></table></div>${!list.length?empty('لا توجد طلبات مشتريات','ابدأ طلبا جديدا بالخامة والكمية المطلوبة','purchase'):''}</div><div class="mt">${alertBox('تأكيد الاستلام يزيد رصيد الخام مرة واحدة فقط. رفض الطلب أو اعتماده لا يغير المخزون.','teal','shield')}</div>`;}
function purchaseForm(){const d=UI.purchaseForm===true?{}:UI.purchaseForm,b=d.branchId||ownBranch(),materials=state.materials.filter(m=>m.branchId===b),m=materials.find(m=>m.id===d.materialId)||materials[0];return `<section class="card mb"><div class="card-head"><h2>طلب شراء جديد</h2><button class="icon-btn" data-action="purchase-close" aria-label="إغلاق">${ico('close','sm')}</button></div><form id="purchase-form"><div class="form-grid three">${selectField('الفرع','branchId',allowedBranches().map(x=>[x.id,x.name]),b)}${selectField('الخامة','materialId',materials.map(m=>[m.id,m.name]),m?.id||'','required')}${field('عنوان الطلب','title',d.title||'شراء خامات تشغيل','text','required maxlength="150"')}${selectField('وحدة الشراء','purchaseUnit',purchaseUnits(m),d.purchaseUnit||m?.baseUnit||m?.unit||'')}${field('عدد وحدات الشراء','quantity',d.quantity||1,'number','required min="0.001" step="0.001"')}${field('تكلفة وحدة الشراء','unitCost',d.unitCost??m?.unitCost??0,'number','required min="0" step="0.0001"')}${field('ملاحظة للمشتريات','note',d.note||'','text','maxlength="500"')}</div><div id="purchase-conversion" class="alert-box teal mt">عند الاستلام تحوّل العبوة إلى وحدة المخزون الأساسية.</div><div class="form-actions"><button class="btn primary" type="submit" ${!m?'disabled':''}>إرسال للاعتماد</button></div>${!m?'<p class="field-note">أضف خامة في مخزون الفرع أولا، ثم أنشئ طلب الشراء.</p>':''}</form></section>`;}
function purchaseUnits(m){return m?[[m.baseUnit||m.unit,m.unit+' — الوحدة الأساسية'],...(m.purchaseUnits||[]).map(p=>[p.name,p.name+' = '+fmt(p.factor,3)+' '+m.unit])]:[];}
function updatePurchasePreview(resetUnits=false){const f=$('#purchase-form');if(!f||!I)return;const m=state.materials.find(m=>m.id===f.elements.materialId.value);if(!m)return;if(resetUnits){f.elements.purchaseUnit.innerHTML=purchaseUnits(m).map(([v,t])=>`<option value="${esc(v)}">${esc(t)}</option>`).join('');f.elements.unitCost.value=m.unitCost||0;}const box=$('#purchase-conversion');try{const q=I.convert(m,Number(f.elements.quantity.value),f.elements.purchaseUnit.value),cost=Number(f.elements.unitCost.value)*Number(f.elements.quantity.value);box.textContent='الاستلام يضيف '+fmt(q,3)+' '+m.unit+' إلى مخزون '+m.name+(financial()?' · إجمالي الطلب '+fmt(cost,2)+' '+({SAR:'ر.س',YER:'ر.ي',USD:'$'}[state.brand.currency]||state.brand.currency):'');}catch(e){box.textContent=e.message;}}
function createPurchaseFromForm(v){const m=state.materials.find(m=>m.id===v.materialId);if(I)I.convert(m,v.quantity,v.purchaseUnit);const purchase=M.createPurchase(state,actorId,v);if(v.purchaseUnit)purchase.purchaseUnit=v.purchaseUnit;return purchase;}
function perfColor(p){return p.score===null?'gray':p.score>=95?'purple':p.score>=80?'green':p.score>=60?'teal':'orange';}
function performanceMap(){return `<div class="performance-map">${[['طبيعي','0–59','#ed9450'],['جيد جدا','60–79','#16b6b5'],['ممتاز','80–94','#55b894'],['فوق الممتاز','95–100','#8b60d1']].map(([l,r,c])=>`<span class="performance-level"><span class="dot" style="background:${c}"></span>${l}<span class="muted ltr">${r}</span></span>`).join('')}</div>`;}
function employeesView(){const users=state.users.filter(u=>u.role!=='owner'&&(UI.branch==='all'||u.branchIds.includes(UI.branch))&&(perm('view_all_branches')||u.branchIds.some(b=>actor().branchIds.includes(b))));return title('الفريق والإنجاز','توزيع عادل للمهمات وقياس شهري واضح لكل موظف',btn('إضافة موظف','employee-new','primary','','plus'))+`<div class="toolbar"><div class="row">${searchBar('ابحث باسم الموظف…')}<input type="month" value="${UI.month}" data-month style="max-width:180px" aria-label="شهر الأداء"></div></div>${performanceMap()}${UI.employeeForm?employeeForm():''}<div class="grid three">${users.filter(u=>!UI.query||u.name.includes(UI.query)).map(u=>employeeCard(u)).join('')}</div><div class="mt">${alertBox('الإنجاز الموزع: أمر يشارك فيه موظفان بحصتي 60% و40% يمنح الأول 0.6 والثاني 0.4 أمر مكافئ. تقييم العميل يدخل في الدرجة عند توفره فقط.','gray','info')}</div>`;}
function employeePerformance(id){return state.performanceByUser?.[id]?.[UI.month]||M.employeePerformance(state,id,UI.month);}
function employeeCard(u){const p=employeePerformance(u.id);return `<section class="card employee-card"><div class="between"><div class="employee-top">${avatar(u.id)}<div><h3>${esc(u.name)}</h3><p>${esc(u.jobTitle||roleLabel(u.role))} · ${esc(u.branchIds.map(bname).join('، '))}</p></div></div>${u.active===false?tag('غير نشط','gray'):''}</div><div class="between">${tag(p.level,perfColor(p))}<span class="strong">${p.score===null?'—':fmt(p.score)+' / 100'}</span></div><div class="score-bar"><span style="width:${p.score??0}%;background:${p.score>=95?'var(--primary)':'var(--secondary)'}"></span></div><div class="employee-stats"><div><b>${fmt(p.completed)}</b><small>مهمات منجزة</small></div><div><b>${fmt(p.contribution,1)}</b><small>إنجاز موزع</small></div><div><b>${p.onTimeRate===null?'—':fmt(p.onTimeRate)+'%'}</b><small>التزام بالموعد</small></div></div><div class="row"><a class="btn soft grow" href="#/employee/${u.id}">تفاصيل الإنجاز</a>${btn('تعديل','employee-edit','sm','data-id="'+u.id+'"','edit')}</div></section>`;}
function employeeForm(){const u=typeof UI.employeeForm==='string'?state.users.find(u=>u.id===UI.employeeForm):null;const b=u?.branchIds?.[0]||ownBranch();return `<section class="card mb"><div class="card-head"><h2>${u?'تعديل '+esc(u.name):'إضافة موظف'}</h2><button class="icon-btn" data-action="employee-close" aria-label="إغلاق">${ico('close','sm')}</button></div><form id="employee-form" data-id="${esc(u?.id||'')}"><div class="form-grid three">${field('اسم الموظف','name',u?.name||'','text','required maxlength="80"')}${field('المسمى الوظيفي','jobTitle',u?.jobTitle||'موظف إنتاج','text','required maxlength="80"')}${selectField('الفرع','branchId',allowedBranches().map(x=>[x.id,x.name]),b)}${selectField('الدور','role',[['employee','موظف تشغيل'],['manager','مدير فرع'],['purchasing','مسؤول مشتريات']],u?.role||'employee')}${CONNECTED&&!u?field('البريد الإلكتروني للدخول','email','','email','required autocomplete="off" maxlength="254"'):''}${CONNECTED&&!u?field('كلمة مرور أولية','password','','password','required minlength="12" maxlength="200" autocomplete="new-password"'):''}${field('هدف الإنجاز الشهري (أوامر مكافئة)','targetMonthly',u?.targetMonthly||20,'number','min="1" max="1000" required')}<label class="check"><input type="checkbox" name="active" ${u?.active===false?'':'checked'}> حساب نشط</label></div><div class="form-actions"><button class="btn primary" type="submit">حفظ الموظف</button></div></form>${CONNECTED&&u?`<hr class="divider"><form id="employee-password-form" data-id="${esc(u.id)}"><h3>تعيين كلمة مرور جديدة</h3><p class="field-note">تطبق على حساب هذا الموظف وتلغي جلساته الحالية. تشاركها معه عبر قناتك المعتادة.</p><div class="form-grid mt">${field('كلمة المرور الجديدة','password','','password','required minlength="12" maxlength="200" autocomplete="new-password"')}</div><div class="form-actions"><button class="btn" type="submit">تعيين كلمة المرور</button></div></form>`:''}</section>`;}
function employeeView(id){if(!perm('manage_team')&&id!==actorId)return empty('عرض الإنجاز خاص بصاحبه','هذه البيانات خارج صلاحياتك','shield');const u=state.users.find(x=>x.id===id);if(!u||(!perm('view_all_branches')&&!u.branchIds.some(b=>actor().branchIds.includes(b))))return empty('موظف غير متاح');const p=employeePerformance(id),jobs=orders().filter(o=>o.assignees?.some(a=>a.userId===id));return title('إنجاز '+u.name,u.jobTitle||roleLabel(u.role),btn('الفريق','navigate','','data-to="employees"','arrow'))+`<div class="toolbar"><div class="row">${avatar(id)}${tag(p.level,perfColor(p))}</div><input type="month" data-month value="${UI.month}" style="max-width:185px" aria-label="شهر الأداء"></div>`+statsView([['المهام المنجزة',p.completed,'check','#8b60d1'],['الإنجاز الموزع',fmt(p.contribution,1),'chart','#19b6b4'],['الوقت الفعلي',fmt(p.minutes/60,1)+' س','clock','#5096e8'],['تقييم العملاء',p.avgRating===null?'—':fmt(p.avgRating,1)+' / 5','star','#e7b24b']])+performanceMap()+`<div class="grid main-side"><section class="card"><div class="card-head"><h2>المهام المسندة</h2><span class="tag gray">${jobs.length}</span></div>${orderTable(jobs,false)}</section><aside class="card"><h3>كيف تحسب الدرجة؟</h3><div class="breakdown mt"><div><span>الالتزام بالمواعيد</span><b>${state.settings.performance?.onTimeWeight??50}%</b></div><div><span>تقييم العملاء</span><b>${state.settings.performance?.qualityWeight??30}%</b></div><div><span>تحقيق هدف الإنجاز</span><b>${state.settings.performance?.outputWeight??20}%</b></div><div class="total"><span>النتيجة</span><span>${p.score===null?'غير متاحة':fmt(p.score,1)+' / 100'}</span></div></div><p class="field-note">${esc(p.explanation||'عند غياب تقييم العميل يستبعد وزنه. لا تعد المهام المشتركة مرتين.')}</p><div class="mt">${alertBox('الهدف الشهري '+p.target+' أمر مكافئ. هذا مؤشر تشغيل يساعد المدير ويحتاج إلى مراجعة طبيعة وتعقيد المهام.','gray')}</div></aside></div>`;}
function myWorkView(){const jobs=orders().filter(o=>o.assignees?.some(a=>a.userId===actorId));const p=employeePerformance(actorId);return title('مهامي وإنجازي','استلم العمل، وثق التنفيذ، وسجل وقتك الفعلي',btn('تبديل الحساب','switch-user','','','users'))+`<div class="toolbar"><input type="month" data-month value="${UI.month}" style="max-width:185px" aria-label="شهر الإنجاز">${tag(p.level,perfColor(p))}</div>`+statsView([['مهام مسندة',jobs.filter(o=>!['delivered','cancelled'].includes(o.status)).length,'orders','#8b60d1'],['مهام منجزة',p.completed,'check','#19b6b4'],['حصتي من الإنجاز',fmt(p.contribution,1),'chart','#5096e8'],['الوقت المسجل',fmt(p.minutes/60,1)+' س','clock','#ed9450']])+`<div class="grid two">${jobs.filter(o=>!['cancelled','delivered'].includes(o.status)).map(o=>{const a=o.assignees.find(a=>a.userId===actorId);return `<section class="card"><div class="between"><span class="tiny muted">#${esc(o.number)}</span>${statusTag(o.status)}</div><h2 class="mt">${esc(o.title)}</h2><p class="tiny muted">${esc(client(o.clientId)?.name||'')}</p><div class="details-grid mt"><div class="detail-item"><small>حصتي في المهمة</small><b>${fmt(a.share)}%</b></div><div class="detail-item"><small>الوقت المخطط</small><b>${fmt(a.plannedMinutes)} دقيقة</b></div><div class="detail-item"><small>موعد تسليم مهمتي</small><b>${dt(a.dueAt||o.dueAt)}</b></div><div class="detail-item"><small>إنجاز حصتي</small><b>${a.done?'مكتملة':a.acceptedAt?'تم الاستلام':'بانتظار الاستلام'}</b></div></div><a href="#/order/${o.id}" class="btn primary full mt">فتح المهمة وتوثيق العمل ${ico('arrow')}</a></section>`;}).join('')||`<div class="card">${empty('لا توجد مهام جارية','ستظهر هنا المهام التي يسندها المدير إليك','check')}</div>`}</div><div class="card mt"><h3>أعمال مكتملة</h3>${orderTable(jobs.filter(o=>o.status==='delivered'),false)}</div>`;}
function branchesView(){return title('إدارة الفروع','تطبيق واحد، وعمليات ومخزون وفريق مستقل لكل فرع',btn('إضافة فرع','branch-new','primary','','plus'))+`${UI.branchForm?branchForm():''}<div class="grid three">${allowedBranches().map(b=>{const os=state.orders.filter(o=>o.branchId===b.id),us=state.users.filter(u=>u.branchIds.includes(b.id)&&u.role==='employee');return `<section class="card branch-card"><div class="branch-art">${ico('branch','lg')}</div><div class="between"><h3>${esc(b.name)}</h3>${tag('نشط','green')}</div><p class="tiny muted mt">${esc(b.city)} · ${esc(b.address||'لم يسجل عنوان تفصيلي')}</p><div class="employee-stats mt"><div><b>${os.length}</b><small>أوامر العمل</small></div><div><b>${us.length}</b><small>الموظفون</small></div><div><b>${state.materials.filter(m=>m.branchId===b.id).length}</b><small>الخامات</small></div></div><div class="row mt">${btn('فتح عمليات الفرع','select-branch','primary grow','data-id="'+b.id+'"','arrow')}${btn('تعديل','branch-edit','sm','data-id="'+b.id+'"','edit')}</div></section>`;}).join('')}</div><div class="mt">${alertBox(CONNECTED?'يفصل الخادم عمليات كل منشأة وفروعها، ويتحقق من صلاحية الحساب والفرع في كل طلب.':'الفصل داخل نسخة العرض المحلية. الحماية المركزية متاحة عند تشغيل الخادم وتسجيل الدخول بالحسابات الفعلية.','gray','shield')}</div>`;}
function branchForm(){const b=typeof UI.branchForm==='string'?state.branches.find(x=>x.id===UI.branchForm):null;return `<section class="card mb"><div class="card-head"><h2>${b?'تعديل الفرع':'فرع جديد'}</h2><button class="icon-btn" data-action="branch-close" aria-label="إغلاق">${ico('close','sm')}</button></div><form id="branch-form" data-id="${esc(b?.id||'')}"><div class="form-grid three">${field('اسم الفرع','name',b?.name||'','text','required maxlength="80"')}${field('المدينة','city',b?.city||'','text','required maxlength="80"')}${field('العنوان','address',b?.address||'','text','maxlength="200"')}</div><div class="form-actions"><button type="submit" class="btn primary">حفظ الفرع</button></div></form></section>`;}
function clientsView(){const list=scoped(state.clients).filter(c=>!UI.query||(c.name+' '+c.phone+' '+c.company).includes(UI.query));return title('العملاء','بيانات التواصل وأعمال كل عميل في مكان واحد',btn('إضافة عميل','client-new','primary','','plus'))+`<div class="toolbar">${searchBar('ابحث بالاسم أو رقم الهاتف…')}</div>${UI.clientForm?`<section class="card mb"><div class="card-head"><h2>عميل جديد</h2><button class="icon-btn" data-action="client-close" aria-label="إغلاق">${ico('close','sm')}</button></div><form id="client-form"><div class="form-grid three">${field('اسم العميل','name','','text','required maxlength="100"')}${field('رقم الهاتف','phone','','tel','maxlength="30"')}${field('اسم النشاط','company','','text','maxlength="100"')}${selectField('الفرع','branchId',allowedBranches().map(b=>[b.id,b.name]),ownBranch())}</div><div class="form-actions"><button class="btn primary" type="submit">حفظ العميل</button></div></form></section>`:''}<div class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>العميل</th><th>الهاتف</th><th>الفرع</th><th>عدد الأعمال</th>${financial()?'<th>مبيعات الأعمال المسلمة</th>':''}<th></th></tr></thead><tbody>${list.map(c=>{const os=orders().filter(o=>o.clientId===c.id);return `<tr><td><b>${esc(c.name)}</b><span class="subline">${esc(c.company||'')}</span></td><td class="ltr">${esc(c.phone||'—')}</td><td>${esc(bname(c.branchId))}</td><td>${os.length}</td>${financial()?`<td>${money(os.filter(o=>o.status==='delivered').reduce((n,o)=>n+o.salePrice,0))}</td>`:''}<td>${btn('أمر جديد','client-order','soft sm','data-id="'+c.id+'"','plus')}</td></tr>`;}).join('')}</tbody></table></div>${!list.length?empty('لا يوجد عملاء','أضف العميل قبل تسجيل أمره','users'):''}</div>`;}
const CALCTYPES=[['sheet','أكريلك وألواح','cube','#5d91e5'],['paper','ورقي وداي كت','paper','#8b60d1'],['roll','بنر وفينيل وأحبار','photo','#19b6b4'],['letters','حروف وشعار','letter','#ce78a2'],['led','ليدات وترانس','lightbulb','#edaa45'],['general','تكلفة عمل شامل','calculator','#55b894']];
const CALCDEFAULTS={sheet:{sheetW:122,sheetH:244,pieceW:30,pieceH:20,quantity:24,gap:.3,margin:1,bleed:0,allowRotate:true,sheetCost:230,cutCost:1.5,setupCost:15,laborCost:40,markup:35},paper:{sheetW:32,sheetH:45,pieceW:9,pieceH:5,quantity:500,gap:.2,margin:1,bleed:.3,allowRotate:true,sheetCost:.6,printPerSide:.9,sides:2,cutCost:.04,setupCost:15,laborCost:25,markup:35},roll:{rollWidth:1.52,width:1,length:2,quantity:3,inkMlPerM2:12,inkCostPerMl:.22,mediaCostPerM2:12,wastePercent:8,finishingPerM2:4,setupCost:15,laborCost:30,markup:35},letters:{height:.65,count:6,rate:180,minHeight:1,logo:false,logoMultiplier:2,roundUp:false,cost:620,markup:35},led:{mode:'module',width:150,height:60,spacingX:15,spacingY:15,edge:5,wattsPerUnit:1.2,manualCount:'',stripLength:20,wattsPerMeter:9.6,rollLength:5,segmentLength:1,voltage:12,powerSupplyWatts:100,loadPercent:80,maxPerChain:20,unitPrice:2.5,powerSupplyPrice:65,markup:35},general:{quantity:10,materialCost:180,printCost:70,laborMinutes:120,hourlyRate:25,machineCost:35,finishingCost:20,packagingCost:15,overhead:25,markup:35}};
function calcData(){const type=UI.calcType,p=state.settings.pricing||{},defaults={...CALCDEFAULTS[type]};if(CONNECTED)for(const key of ['sheetCost','cutCost','setupCost','laborCost','printPerSide','inkCostPerMl','mediaCostPerM2','finishingPerM2','rate','cost','unitPrice','powerSupplyPrice','materialCost','printCost','hourlyRate','machineCost','finishingCost','packagingCost','overhead'])if(key in defaults)defaults[key]=0;return {...defaults,markup:p.markup??35,...(type==='letters'?{minHeight:p.letterMinHeight??1,logoMultiplier:p.logoMultiplier??2}:{}),...state.drafts.calculators?.[type]};}
function calcField(label,name,d,unit='',extra='min="0" step="0.01"'){return `<div class="field"><label for="calc-${name}">${label}</label><div class="input-unit"><input id="calc-${name}" name="${name}" type="number" value="${esc(d[name])}" ${extra}><span>${unit}</span></div></div>`;}
function nestingContext(){const branchId=ownBranch();return {state,branchId,branchName:bname(branchId),inventory:I,financial:financial(),currency:currency(),persist};}
function calculatorsView(){const r=route();if(r.id&&CALCTYPES.some(x=>x[0]===r.id))UI.calcType=r.id;const t=UI.calcType,d=calcData();let f='';if(t==='sheet'||t==='paper'){f=`<h3 class="form-section-title">${ico('scissors')} مقاسات ${t==='paper'?'الورقة والمطبوع':'اللوح والقطعة'}</h3><div class="form-grid keep">${calcField(t==='paper'?'عرض ورقة الطباعة':'عرض اللوح','sheetW',d,'سم','min="0.1" step="0.01" required')}${calcField(t==='paper'?'طول ورقة الطباعة':'طول اللوح','sheetH',d,'سم','min="0.1" step="0.01" required')}${calcField('عرض القطعة النهائية','pieceW',d,'سم','min="0.1" step="0.01" required')}${calcField('طول القطعة النهائية','pieceH',d,'سم','min="0.1" step="0.01" required')}${calcField('الكمية المطلوبة','quantity',d,'قطعة','min="1" max="100000" step="1" required')}${calcField('فاصل القطع','gap',d,'سم')}${calcField('هامش حواف اللوح','margin',d,'سم')}${calcField('نزف الطباعة لكل جانب','bleed',d,'سم')}</div><label class="check mt"><input name="allowRotate" type="checkbox" ${d.allowRotate?'checked':''}> السماح بتدوير القطع 90° لاختيار سعة أفضل</label><hr class="divider"><h3 class="form-section-title">التكلفة والتشطيب</h3><div class="form-grid keep">${calcField(t==='paper'?'تكلفة ورقة الخام':'تكلفة اللوح الكامل','sheetCost',d,currency())}${t==='paper'?calcField('طباعة الوجه لكل ورقة','printPerSide',d,currency()):''}${t==='paper'?selectField('أوجه الطباعة','sides',[[1,'وجه واحد'],[2,'وجهان']],d.sides):''}${calcField('تكلفة القص لكل قطعة','cutCost',d,currency())}${calcField('تجهيز الدفعة','setupCost',d,currency())}${calcField('تكلفة عمل الدفعة','laborCost',d,currency())}${calcField('الإضافة على التكلفة','markup',d,'%')}</div>`;}else if(t==='roll'){f=`<h3 class="form-section-title">مقاس الطباعة واستهلاك الرول</h3><div class="form-grid keep">${calcField('عرض الرول','rollWidth',d,'م','min="0.01" step="0.01" required')}${calcField('عرض التصميم','width',d,'م','min="0.01" step="0.01" required')}${calcField('طول التصميم','length',d,'م','min="0.01" step="0.01" required')}${calcField('عدد النسخ','quantity',d,'نسخة','min="1" step="1" required')}${calcField('تكلفة الخامة / م²','mediaCostPerM2',d,currency())}${calcField('هدر تشغيل إضافي','wastePercent',d,'%')}</div><hr class="divider"><h3 class="form-section-title">الأحبار والتشطيب</h3><div class="form-grid keep">${calcField('استهلاك الحبر / م²','inkMlPerM2',d,'ملل')}${calcField('تكلفة ملل الحبر','inkCostPerMl',d,currency())}${calcField('التشطيب / م²','finishingPerM2',d,currency())}${calcField('تجهيز الطباعة','setupCost',d,currency())}${calcField('عمل الدفعة','laborCost',d,currency())}${calcField('الإضافة على التكلفة','markup',d,'%')}</div>`;}else if(t==='letters'){f=`<div class="row wrap mb"><label class="check"><input name="logo" type="checkbox" ${d.logo?'checked':''}> احتساب شعار (المعامل ×2 افتراضيا)</label></div><div class="form-grid keep">${calcField('الارتفاع الفعلي','height',d,'م','min="0.01" step="0.01" required')}${calcField('عدد الحروف / الشعارات','count',d,'عدد','min="1" step="1" required')}${calcField('سعر متر الاحتساب','rate',d,currency())}${calcField('الحد الأدنى لكل حرف / شعار','minHeight',d,'م','min="0.01" step="0.01" required')}${calcField('معامل الشعار','logoMultiplier',d,'×','min="1" step="0.01"')}${calcField('تكلفة العمل الإجمالية','cost',d,currency())}</div><label class="check mt"><input name="roundUp" type="checkbox" ${d.roundUp?'checked':''}> تقريب الارتفاع إلى المتر الأعلى بعد تطبيق الحد الأدنى</label><div class="math-rule mt">أقل من متر يحتسب مترا · الشعار يضرب ×2 حتى عند ارتفاع متر</div><div class="field-note">فوق المتر يحتسب الارتفاع الفعلي افتراضيا. سعر المتر هنا تسعير بيع، وليس تكلفة خامة.</div>`;}else if(t==='led'){f=`${selectField('نوع الإضاءة','mode',[['module','موديولات LED'],['strip','شريط LED / لفات']],d.mode)}<div class="form-grid keep mt">${d.mode==='module'?`${calcField('عرض المساحة','width',d,'سم','min="0.1" step="0.1" required')}${calcField('ارتفاع المساحة','height',d,'سم','min="0.1" step="0.1" required')}${calcField('تباعد أفقي','spacingX',d,'سم','min="0.1" step="0.1" required')}${calcField('تباعد رأسي','spacingY',d,'سم','min="0.1" step="0.1" required')}${calcField('البعد عن الحافة','edge',d,'سم')}${calcField('قدرة الموديول','wattsPerUnit',d,'W','min="0.01" step="0.01" required')}${calcField('عدد يدوي اختياري','manualCount',d,'عدد','min="1" step="1" placeholder="يحسب من التباعد"')}${calcField('سعر الموديول','unitPrice',d,currency())}`:`${calcField('الطول المركب','stripLength',d,'م','min="0.01" step="0.01" required')}${calcField('طول اللفة','rollLength',d,'م','min="0.01" step="0.01" required')}${calcField('قدرة كل متر','wattsPerMeter',d,'W','min="0.01" step="0.01" required')}${calcField('طول مقطع التغذية','segmentLength',d,'م','min="0.01" step="0.01" required')}${calcField('سعر اللفة الكاملة','unitPrice',d,currency())}`}</div><hr class="divider"><h3 class="form-section-title">الترانسات وتوزيع الحمل</h3><div class="form-grid keep">${selectField('الفولت الموحد','voltage',[[12,'12 V'],[24,'24 V']],d.voltage)}${calcField('قدرة الترانس الاسمية','powerSupplyWatts',d,'W','min="1" step="1" required')}${calcField('أقصى نسبة تحميل','loadPercent',d,'%','min="1" max="100" step="1" required')}${calcField('حد الوحدات في مجموعة','maxPerChain',d,'عدد','min="1" step="1" required')}${calcField('سعر الترانس','powerSupplyPrice',d,currency())}${calcField('الإضافة على التكلفة','markup',d,'%')}</div><div class="mt">${alertBox('التوزيع تقديري حسب مدخلاتك. راجع بيانات مصنع الليد والترانس وحدود التوصيل وهبوط الجهد والحرارة مع الفني قبل التنفيذ.','orange','lightbulb')}</div>`;}else{f=`<h3 class="form-section-title">تكلفة الدفعة بالكامل</h3><div class="form-grid keep">${calcField('كمية المنتج','quantity',d,'قطعة','min="1" step="1" required')}${calcField('الخامات','materialCost',d,currency())}${calcField('الطباعة أو الحفر','printCost',d,currency())}${calcField('إجمالي وقت العمل','laborMinutes',d,'دقيقة')}${calcField('تكلفة ساعة العمل','hourlyRate',d,currency())}${calcField('تشغيل الماكينة','machineCost',d,currency())}${calcField('التشطيب والتجميع','finishingCost',d,currency())}${calcField('التغليف','packagingCost',d,currency())}${calcField('مصاريف تشغيلية للأمر','overhead',d,currency())}${calcField('الإضافة على التكلفة','markup',d,'%')}</div><div class="field-note">كل مدخل تكلفة هو إجمالي الدفعة، ثم تقسم النتيجة على الكمية لمعرفة تكلفة الحبة.</div>`;}return title('الحاسبات والتسعير','مقاس وكمية وخامة… ثم نتيجة واضحة يمكنك تحويلها لأمر عمل',btn('إعادة القيم التوضيحية','reset-calc','','','refresh'))+`<div class="calc-picker">${CALCTYPES.map(([id,l,ic,col])=>`<button class="calc-card ${id===t?'active':''}" data-action="open-calc" data-type="${id}">${appico(ic,col)}<span>${l}</span></button>`).join('')}</div><div class="grid main-side"><section class="card"><div class="card-head"><div><h2>${CALCTYPES.find(x=>x[0]===t)[1]}</h2><p>النتائج تتحدث مباشرة مع تعديل القيم</p></div>${tag('قيم قابلة للتعديل','gray')}</div>${calculatorStockPicker(t)}<form id="calc-form" data-type="${t}">${f}</form></section><aside class="stack sticky-side"><div id="calc-result"></div></aside></div><section class="card mt"><div class="card-head"><h2>${t==='led'?'توزيع الإضاءة ومجموعات الترانسات':t==='sheet'||t==='paper'?'معاينة ترتيب القطع على أول لوح':t==='roll'?'مساحة الطباعة واستهلاك الخام':'تفاصيل قاعدة الحساب'}</h2><span class="tiny muted">${t==='sheet'||t==='paper'?'شبكة تقديرية، ليست ملف ماكينة':''}</span></div><div id="calc-visual"></div></section>`;}
let calcResult=null,calcInputs=null;
function readCalc(){const form=$('#calc-form');if(!form)return null;const p=values(form),t=UI.calcType,m=scoped(state.materials).find(m=>m.id===UI.calcMaterialId);if(m&&t==='general'){p.materialCost=WOMaterialBindings.preset(m,t,p).materialCost;form.elements.materialCost.value=p.materialCost;form.elements.materialCost.readOnly=true;}else if(form.elements.materialCost)form.elements.materialCost.readOnly=false;p.voltage=Number(p.voltage||12);if(p.manualCount===''||p.manualCount===undefined)delete p.manualCount;if(t==='paper'){p.sheetCost=Number(p.sheetCost)+Number(p.printPerSide)*Number(p.sides);p.sides=Number(p.sides);}if(t==='letters'){p.markup=state.settings.pricing?.markup??35;}return p;}
function updateCalcResult(){const result=$('#calc-result'),visual=$('#calc-visual');if(!result||!visual)return;try{const p=readCalc(),t=UI.calcType,r=C[t==='paper'?'sheet':t](p);calcResult=r;calcInputs=p;result.innerHTML=calculatorAvailability(t,p,r)+`<section class="card"><div class="result-hero"><h3>سعر البيع المقترح ${t==='letters'?'حسب قاعدة المتر':''}</h3><b>${fmt(r.suggestedPrice,2)}</b> <small>${currency()}</small></div><div class="breakdown"><div><span>إجمالي التكلفة</span><b>${money(r.totalCost)}</b></div><div><span>تكلفة الحبة</span><b>${money(r.unitCost)}</b></div><div><span>بيع الحبة المقترح</span><b>${money(r.unitSuggestedPrice)}</b></div>${t==='sheet'||t==='paper'?`<div><span>${t==='paper'?'عدد الأوراق':'عدد الألواح'}</span><b>${fmt(r.sheets)}</b></div><div><span>قطع في اللوح الواحد</span><b>${fmt(r.perSheet)}</b></div><div><span>مساحة غير مستغلة</span><b>${fmt(r.wastePercent,1)}%</b></div>`:t==='roll'?`<div><span>استهلاك طول الرول</span><b>${fmt(r.linearMeters,2)} م</b></div><div><span>استهلاك الحبر</span><b>${fmt(r.inkMl,1)} ملل</b></div>`:t==='letters'?`<div><span>ارتفاع الاحتساب</span><b>${fmt(r.billableHeight,2)} م</b></div><div><span>إجمالي أمتار الاحتساب</span><b>${fmt(r.billableMeters,2)} م</b></div>`:t==='led'?`<div><span>${p.mode==='strip'?'عدد اللفات':'عدد الموديولات'}</span><b>${fmt(p.mode==='strip'?r.rolls:r.count)}</b></div><div><span>إجمالي القدرة</span><b>${fmt(r.totalWatts,1)} W</b></div><div><span>التيار الإجمالي</span><b>${fmt(r.currentAmps,2)} A</b></div><div><span>عدد الترانسات</span><b>${fmt(r.powerSupplies)}</b></div>`:''}<div class="total"><span>هامش مساهمة الدفعة</span><b>${money(r.profit)}</b></div></div><div class="field-note">هامش من البيع: ${fmt(r.marginPercent,1)}%. الإضافة على التكلفة تختلف عن هامش البيع.</div>${btn('استخدام في أمر عمل','calc-to-order','primary full mt','','plus')}${btn('طباعة الحسبة','print-calc','full mt','','print')}</section><section class="card mt"><h3 class="mb">تفصيل التكلفة</h3><div class="breakdown">${r.breakdown.filter(x=>x.label!=='أمتار الاحتساب').map((x,i)=>`<div><span>${esc(t==='paper'&&i===0?'ورق وطباعة الأوجه':x.label)}</span><b>${money(x.value)}</b></div>`).join('')}</div></section>`;visual.innerHTML=calcVisual(t,p,r)+`<div class="field-note mt">${r.notes.map(n=>esc(n).replace('الهدر يشمل باقي الألواح','غير المستغل يشمل باقي الألواح')).join('<br>')}</div>`;}catch(e){calcResult=null;result.innerHTML=alertBox(esc(e.message),'orange','alert');visual.innerHTML=empty('عدل المدخلات لعرض النتيجة','لن يتم حساب مقاس لا يناسب الخامة أو مدخل غير صالح','calculator');}}
function calculatorAvailability(type,p,r){const m=scoped(state.materials).find(m=>m.id===UI.calcMaterialId);if(!m)return '';const a=I.availability(state,m.id),need=WOMaterialBindings.required(m,type,p,r);return `<section class="card mb"><h3>${esc(m.name)}</h3>${m.costConfirmed===false?'<div class="alert-box orange mt">تكلفة المورد غير مؤكدة. النتيجة لا تعتمد للتسعير حتى تأكيد تكلفة الخامة.</div>':''}<div class="breakdown mt"><div><span>المتاح في المخزون</span><b>${fmt(a.available,3)} ${esc(m.unit)}</b></div>${need===null?'':`<div><span>احتياج الحاسبة التقديري</span><b>${fmt(need,3)} ${esc(m.unit)}</b></div>`}</div><p class="field-note">${need!==null&&need>a.available?'الرصيد المتاح أقل من التقدير؛ راجع المشتريات أو المخزون.':'تحقق من مواصفات المورد قبل التنفيذ.'} الحجز والصرف عمليتان منفصلتان بعد اعتماد العمل.</p></section>`;}
function calcVisual(t,p,r){if(t==='sheet'||t==='paper'){const l=r.layout,m=Math.max(l.sheetW,l.sheetH)*.07;return `<div class="grid two"><svg class="layout-svg" viewBox="${-m} ${-m} ${l.sheetW+2*m} ${l.sheetH+2*m}" role="img" aria-label="توزيع القطع داخل اللوح"><rect width="${l.sheetW}" height="${l.sheetH}" fill="#ede8f4" stroke="#b5a5cf" stroke-width=".4"/><rect x="${l.margin}" y="${l.margin}" width="${Math.max(0,l.sheetW-2*l.margin)}" height="${Math.max(0,l.sheetH-2*l.margin)}" fill="none" stroke="#9e8ab9" stroke-width=".3" stroke-dasharray="2 2"/>${l.placements.slice(0,1000).map((q,i)=>`<rect x="${q.x}" y="${q.y}" width="${q.width}" height="${q.height}" rx=".3" fill="${i%2?'#b9e7e5':'#8cd4d2'}" stroke="#fff" stroke-width=".2"/>`).join('')}</svg><div class="stack"><div class="math-rule">${fmt(l.sheetW)} × ${fmt(l.sheetH)} سم<br>${fmt(r.columns)} أعمدة × ${fmt(r.rows)} صفوف = ${fmt(r.perSheet)} قطعة / لوح</div><div class="breakdown"><div><span>التدوير</span><b>${r.rotated?'90 درجة':'الوضع الأصلي'}</b></div><div><span>مساحة المنتج النهائي</span><b>${fmt(r.usedArea/10000,3)} م²</b></div><div><span>المساحة غير المستغلة</span><b>${fmt(r.wasteArea/10000,3)} م²</b></div></div>${alertBox('المساحة غير المستغلة قد تتضمن قطعا قابلة لإعادة الاستخدام. سجل مقاس الباقي الفعلي في المخزون بعد القص.','teal','remnant')}</div></div>`;}if(t==='led'){const colors=['#7c51b8','#16b6b5','#e5a145','#598de0'];let svg='';if(p.mode==='module'){const l=r.layout,pad=8,limits=[];let total=0;for(const d of r.distribution){total+=d.units;limits.push(total);}svg=`<svg class="layout-svg" viewBox="${-pad} ${-pad} ${l.width+2*pad} ${l.height+2*pad}" role="img" aria-label="مراكز موديولات الإضاءة"><rect width="${l.width}" height="${l.height}" rx="2" fill="#f2eff7" stroke="#d4cce2" stroke-width=".5"/>${l.placements.slice(0,1500).map(q=>{const i=limits.findIndex(n=>q.index<=n);return `<circle cx="${q.x}" cy="${q.y}" r="${Math.min(2.3,l.width/60)}" fill="${colors[i%colors.length]}"/>`;}).join('')}</svg>`;}else{svg=`<div class="math-rule">${fmt(r.stripLength,2)} متر مركب ÷ ${fmt(p.rollLength)} متر / لفة<br><b>${r.rolls} لفات مطلوبة</b></div>`;}return `<div class="grid two"><div>${svg}<div class="tiny muted mt">كل لون يشير إلى مجموعة تغذية مستقلة. هذه معاينة للمراكز والتوزيع فقط.</div></div><div><div class="math-rule">${fmt(r.totalWatts,1)} W إجمالي · ${fmt(r.usableWatts,1)} W قدرة مسموحة لكل ترانس</div><div class="psu-list">${r.distribution.slice(0,30).map((d,i)=>`<div class="psu"><i style="background:${colors[i%colors.length]}"></i><div class="grow"><b>ترانس ${d.supply}</b><div class="tiny muted">${p.mode==='strip'?fmt(d.meters,2)+' متر':d.units+' موديول'} · ${fmt(d.watts,1)} W</div></div><span class="tag gray">${fmt(d.loadPercent,1)}%</span></div>`).join('')}</div><div class="tiny muted mt">${r.chains} مجموعات توصيل حسب الحد المدخل. لا تجمع مخارج الترانسات معا.</div></div></div>`;}if(t==='roll')return `<div class="grid three"><div class="result-hero"><h3>مساحة الطباعة الصافية</h3><b>${fmt(r.area,2)}</b> م²</div><div class="result-hero"><h3>مساحة الخام المستهلكة</h3><b>${fmt(r.consumedArea,2)}</b> م²</div><div class="result-hero"><h3>طول الرول المستهلك</h3><b>${fmt(r.linearMeters,2)}</b> م</div></div>`;if(t==='letters')return `<div class="math-rule">${fmt(r.billableHeight,2)} متر × ${fmt(p.count)} ${p.logo?'شعار':'حرف'} × ${p.logo?fmt(p.logoMultiplier):1} × ${fmt(p.rate,2)} = ${fmt(r.suggestedPrice,2)} ${currency()}</div>`;return `<div class="math-rule">إجمالي الخامات + الطباعة + العمل + تشغيل الماكينة + التشطيب + التغليف + المصاريف التشغيلية<br><b>${fmt(r.totalCost,2)} ÷ ${p.quantity} = ${fmt(r.unitCost,2)} ${currency()} تكلفة الحبة</b></div>`;}
function reviewsView(){const delivered=orders().filter(o=>o.status==='delivered'),list=scoped(state.reviews);let selected=delivered.find(o=>o.id===UI.reviewOrderId)||delivered.find(o=>!list.some(r=>r.orderId===o.id))||delivered[0];UI.reviewOrderId=selected?.id||'';const average=list.length?list.reduce((n,r)=>n+r.rating,0)/list.length:null;return title('تقييمات العملاء','رابط وQR لكل أمر مسلم، والاسم اختياري دون إنشاء حساب')+statsView([['التقييمات الواردة',list.length,'review','#e7b24b'],['متوسط التقييم',average===null?'—':fmt(average,1)+' / 5','star','#edaa45'],['أوامر مسلمة',delivered.length,'package','#19b6b4'],['بانتظار تقييم',delivered.filter(o=>!list.some(r=>r.orderId===o.id)).length,'clock','#8b60d1']])+`<div class="grid main-side"><section class="card"><div class="card-head"><h2>صوت العميل</h2><span class="tiny muted">يصل للإدارة ومدير الفرع</span></div>${list.slice().reverse().map(r=>`<article class="mini-row" style="align-items:flex-start"><span class="avatar">${esc(initial(r.name||'عميل'))}</span><div class="grow"><div class="between"><h4>${esc(r.name||'عميل بدون اسم')}</h4>${stars(r.rating)}</div><p class="tiny muted">#${esc(state.orders.find(o=>o.id===r.orderId)?.number||'')} · ${esc(bname(r.branchId))} · ${day(r.createdAt)}</p><p class="mt" style="font-size:12px;color:var(--text);margin-top:9px">${esc(r.comment||'تم التقييم بدون تعليق')}</p></div></article>`).join('')||empty('التقييمات ستظهر هنا','افتح صفحة التقييم من البطاقة وجرب إرسال تقييم محلي','review')}</section><aside class="stack"><section class="card"><h3>بطاقة تقييم العميل</h3>${selected?`<div class="field mt"><label for="review-order-select">أمر العمل المسلم</label><select id="review-order-select">${delivered.map(o=>`<option value="${o.id}" ${o.id===selected.id?'selected':''}>#${esc(o.number)} — ${esc(o.title)}</option>`).join('')}</select></div><div id="review-qr" class="qr-wrap mt"></div><div class="field-note text-center">امسح الرمز لفتح صفحة التقييم</div>${btn('معاينة صفحة العميل','feedback-preview','primary full mt','data-token="'+selected.reviewToken+'"','eye')}${btn('نسخ رابط التقييم','copy-review','full mt','data-token="'+selected.reviewToken+'"','copy')}${btn('طباعة بطاقة التقييم','print-review','full mt','data-id="'+selected.id+'"','print')}`:empty('سلم أمرا أولا','تفعيل رابط التقييم بعد التسليم','qr')}</section>${CONNECTED?alertBox('التقييمات تحفظ على الخادم وتصل للإدارة. استخدم تحديث البيانات لمراجعة أحدث تقييمات العملاء.','teal','shield'):alertBox('التقييمات في العرض المحلي تحفظ على هذا الجهاز. استقبالها من جوالات العملاء يتطلب تشغيل النسخة المركزية.','orange','info')}</aside></div>`;}
function stars(n){return `<span class="review-stars">${Array.from({length:5},(_,i)=>`<span style="color:${i<n?'#f2b44b':'#dedee9'}">${ico('star')}</span>`).join('')}</span>`;}
function feedbackLink(token){if(CONNECTED)return location.href.split('#')[0]+'#/feedback/'+encodeURIComponent(token);let base=state.settings.publicBaseUrl||location.href.split('#')[0];return base.replace(/#.*$/,'')+'#/feedback/'+encodeURIComponent(token);}
function renderQR(){const o=state.orders.find(x=>x.id===UI.reviewOrderId);const el=$('#review-qr');if(o&&el){try{el.innerHTML=WOQR.svg(encodeURI(feedbackLink(o.reviewToken)),{size:216,margin:4});}catch(e){el.textContent=e.message;}}}
function renderFeedback(token){if(CONNECTED){renderCentralFeedback(token);return;}const o=state.orders.find(x=>x.reviewToken===token&&x.status==='delivered');const reviewed=state.reviews.find(r=>r.token===token);$('#app').innerHTML=`<main class="public-page"><section class="public-card"><img class="public-logo" src="${logo()}" alt="${esc(state.brand.name)}">${!o?`<h1 class="text-center">رابط التقييم غير متاح</h1><p class="muted tiny text-center mt">قد لا يكون الأمر قد سلم، أو أن بياناته موجودة على جهاز آخر في النسخة المحلية.</p>`:reviewed?`<div class="text-center">${appico('check','#16b6b5')}<h1 class="mt">شكرا لمشاركتك</h1><p class="muted mt">تم حفظ التقييم في هذه النسخة المحلية، ويمكن للإدارة الاطلاع عليه من قسم التقييمات.</p><div class="row mt" style="justify-content:center">${stars(reviewed.rating)}</div></div>`:`<div class="text-center"><div class="eyebrow">رأيك يساعدنا نتطور</div><h1>كيف كانت تجربتك معنا؟</h1><p class="muted tiny mt">${esc(o.title)} · #${esc(o.number)}</p></div><form id="feedback-form" data-token="${esc(token)}"><div class="rating-picker" aria-label="اختر التقييم من خمس نجوم">${[1,2,3,4,5].map(n=>`<button type="button" class="rating-btn ${n<=UI.rating?'active':''}" data-action="rating" data-value="${n}" aria-label="${n} نجوم">${ico('star')}</button>`).join('')}</div><div class="form-grid">${field('اسمك (اختياري)','name','','text','maxlength="100" placeholder="يمكنك تركه فارغا"')}<div class="field"><label for="f-comment">تعليقك وملاحظاتك</label><textarea id="f-comment" name="comment" maxlength="2000" placeholder="ما الذي أعجبك، وما الذي نقدر نحسنه؟"></textarea></div></div><div class="mt">${alertBox('التقييم مخصص للإدارة ومدير الفرع، ولا ينشر للعامة. لا تحتاج إلى تسجيل دخول.','teal','shield')}</div><button class="btn primary full mt" type="submit">إرسال التقييم</button><p class="field-note text-center">معاينة محلية: الإرسال يسجل على هذا الجهاز حتى تفعيل الربط المركزي.</p></form>`}${actor()?`<div class="text-center mt"><a href="#/reviews" class="tiny">العودة إلى الإدارة</a></div>`:''}</section></main>`;}
function reportsView(){let totals;try{totals=M.totals(state,actorId,UI.branch,UI.reportFrom,UI.reportTo);}catch(e){totals=M.totals(state,actorId,UI.branch);}
 const ds=orders().filter(o=>o.status==='delivered'&&(!UI.reportFrom||o.deliveredAt>=UI.reportFrom)&&(!UI.reportTo||o.deliveredAt.slice(0,10)<=UI.reportTo));const rows=K.categories.map(c=>{const os=ds.filter(o=>o.category===c.id);return {name:c.name,count:os.length,sales:os.reduce((n,o)=>n+o.salePrice,0),cost:os.reduce((n,o)=>n+(((o.actualCost>0||o.consumptions?.length)?o.actualCost:o.estimatedCost)),0),color:c.color};}).filter(c=>c.count);const allSales=rows.reduce((n,r)=>n+r.sales,0);
 return title('تقارير التشغيل والبيع','قيمة الأعمال المسلمة وتكاليفها وهوامشها، مع متابعة الاستهلاك',btn('تصدير التقرير','export-report','','','download'))+`<form id="report-filter-form" class="card mb"><div class="row wrap">${field('من تاريخ','from',UI.reportFrom,'date')}${field('إلى تاريخ','to',UI.reportTo,'date')}<button class="btn primary" type="submit">تطبيق الفترة</button>${btn('كل الفترات','clear-report','sm','','refresh')}</div></form>`+statsView([['بيع الأوامر المسلمة',money(totals.sales),'chart','#8b60d1'],['التكلفة المباشرة',money(totals.cost),'inventory','#ed9450'],['هامش مساهمة الأوامر',money(totals.margin),'wallet','#19b6b4'],['أوامر تم تسليمها',totals.delivered,'check','#55b894']])+alertBox(esc(totals.costBasisLabel)+'. هامش المساهمة لا يمثل صافي ربح محاسبيا، ولا يشمل مصاريف لم تسجل على الأوامر.','gray')+`<div class="grid two mt"><section class="card"><div class="card-head"><h2>مبيعات الأقسام</h2></div><div class="budget-list">${rows.map(r=>`<div><div class="between tiny mb" style="margin-bottom:6px"><span>${esc(r.name)}</span><b>${money(r.sales)}</b></div><div class="progress"><span style="width:${financial()&&allSales?r.sales/allSales*100:0}%;background:${r.color}"></span></div></div>`).join('')||empty('لا توجد أعمال مسلمة في الفترة')}</div></section><section class="card"><div class="card-head"><h2>مقارنة الفروع</h2></div><div class="table-wrap"><table class="data-table"><thead><tr><th>الفرع</th><th>تم التسليم</th><th>البيع</th><th>التكلفة</th></tr></thead><tbody>${allowedBranches().filter(b=>UI.branch==='all'||b.id===UI.branch).map(b=>{const t=M.totals(state,actorId,b.id,UI.reportFrom,UI.reportTo);return `<tr><td>${esc(b.name)}</td><td>${t.delivered}</td><td>${money(t.sales)}</td><td>${money(t.cost)}</td></tr>`;}).join('')}</tbody></table></div></section></div><section class="card mt"><div class="card-head"><h2>تفصيل بيع وتكلفة الأوامر</h2><span class="tiny muted">الفعلية عند وجودها، وإلا التقديرية</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>أمر العمل</th><th>القسم</th><th>البيع</th><th>التكلفة</th><th>هامش الأمر</th><th>مصدر التكلفة</th></tr></thead><tbody>${ds.map(o=>{const cost=((o.actualCost>0||o.consumptions?.length)?o.actualCost:o.estimatedCost);return `<tr><td><a href="#/order/${o.id}">${esc(o.number)}</a><span class="subline">${esc(o.title)}</span></td><td>${esc(cat(o.category)?.name||'')}</td><td>${money(o.salePrice)}</td><td>${money(cost)}</td><td>${money(o.salePrice-cost)}</td><td>${tag(o.actualCost>0||o.consumptions?.length?'مسجلة':'تقديرية',o.actualCost>0||o.consumptions?.length?'green':'orange')}</td></tr>`;}).join('')}</tbody></table></div></section><section class="card mt"><div class="card-head"><h2>استهلاك الخامات والهدر المسجل</h2></div>${consumptionTable(true)}</section>`;}
function activityView(){const list=scoped(state.audit).filter(a=>!UI.query||(a.action+' '+a.detail+' '+uname(a.actorId)).includes(UI.query)).slice().reverse();return title('سجل العمليات','من نفذ العملية، ومتى، وفي أي فرع')+`<div class="toolbar">${searchBar('ابحث في تفاصيل العملية أو الموظف…')}</div><section class="card"><div class="table-wrap"><table class="data-table activity-table"><thead><tr><th>الوقت</th><th>المستخدم</th><th>الفرع</th><th>العملية</th><th>التفصيل</th></tr></thead><tbody>${list.slice(0,300).map(a=>`<tr><td>${dt(a.at)}</td><td>${a.actorId?esc(uname(a.actorId)):'عميل'}</td><td>${esc(bname(a.branchId))}</td><td>${esc(actionLabel(a.action))}</td><td>${esc(a.detail||'—')}</td></tr>`).join('')}</tbody></table></div>${!list.length?empty('لا توجد عمليات مسجلة','العمليات الجديدة توثق تلقائيا','clock'):''}</section>`;}
function actionLabel(a){return {create_order:'إنشاء أمر عمل',update_order:'تعديل أمر عمل',transition_order:'تغيير مرحلة',assign_team:'توزيع الفريق',accept_assignment:'استلام مهمة',complete_assignment:'إنجاز مهمة',reserve_remnant:'حجز قطعة',release_remnant:'فك حجز',consume_material:'صرف خامات',create_purchase:'طلب شراء',approve_purchase:'اعتماد شراء',receive_purchase:'استلام شراء',reject_purchase:'رفض شراء',submit_review:'تقييم عميل',add_order_note:'إضافة ملاحظة',add_order_cost:'تكلفة تشغيل مباشرة',reverse_order_cost:'تصحيح تكلفة تشغيل',add_order_attachment:'إرفاق صورة',update_brand:'تحديث الهوية',update_permissions:'تعديل الصلاحيات',create_branch:'إضافة فرع',create_user:'إضافة موظف',create_material:'إضافة خامة',create_remnant:'تسجيل باقي',create_client:'إضافة عميل',record_cost:'تسجيل تكلفة مباشرة'}[a]||a;}
function settingsView(){const t=UI.settingsTab;if(CONNECTED&&['connections','backup'].includes(t))return WOConnectedUI.settings({tab:t,tenant:centralTenant,account:centralAccount});let body='';if(t==='brand'){body=`<form id="brand-form"><div class="grid main-side"><section class="card"><h3 class="form-section-title">هوية نشاطك في كل الأقسام</h3><div class="form-grid">${field('اسم النشاط','name',state.brand.name,'text','required maxlength="80"')}${field('وصف النشاط','activity',state.brand.activity,'text','required maxlength="120"')}${selectField('عملة عرض الأسعار','currency',[['SAR','ريال سعودي — SAR'],['YER','ريال يمني — YER'],['USD','دولار — USD']],state.brand.currency)}<div class="field"><label>ألوان الهوية</label><div class="row"><input aria-label="اللون الأساسي" type="color" name="primary" value="${esc(state.brand.primary)}"><span class="tiny">أساسي</span><input aria-label="اللون الثانوي" type="color" name="secondary" value="${esc(state.brand.secondary)}"><span class="tiny">ثانوي</span></div></div><div class="field full"><label for="brand-footer">الكليشة والتذييل</label><textarea id="brand-footer" name="footer" maxlength="400" placeholder="اسم النشاط، العنوان، التواصل، ملاحظة التسليم…">${esc(state.brand.footer||'')}</textarea><div class="help">تظهر أسفل الأقسام وفي أوراق الطباعة.</div></div></div><div class="form-actions"><button class="btn primary" type="submit">${ico('save')} حفظ الهوية</button></div></section><aside class="stack"><section class="card"><h3>شعار النشاط</h3><label class="upload-box mt" for="brand-logo-input"><img src="${logo()}" alt="شعار النشاط"><span>اختيار شعار جديد</span></label><input id="brand-logo-input" data-upload="logo" type="file" accept="image/jpeg,image/png,image/webp" hidden><p class="field-note">JPG أو PNG أو WebP. تغيير الشعار يحدث الهوية في الواجهات والطباعة.</p></section><div class="brand-preview" id="brand-live-preview"><div class="preview-top"><img src="${logo()}" alt="الشعار"><div><b id="preview-name">${esc(state.brand.name)}</b><div class="tiny">نظام أوامر العمل والتشغيل</div></div></div><div class="preview-body"><span class="tag teal">معاينة الهوية</span><p class="tiny muted mt" id="preview-footer">${esc(state.brand.footer||'الكليشة الخاصة بنشاطك')}</p></div></div></aside></div></form>`;}else if(t==='pricing'){const p=state.settings.pricing||{};body=`<form id="pricing-form"><section class="card"><h3 class="form-section-title">قواعد الاحتساب الافتراضية</h3><div class="form-grid three">${field('الحد الأدنى لارتفاع الحرف / الشعار','letterMinHeight',p.letterMinHeight??1,'number','min="0.01" max="20" step="0.01" required')}${field('معامل تسعير الشعار','logoMultiplier',p.logoMultiplier??2,'number','min="1" max="10" step="0.1" required')}${field('إضافة مقترحة على التكلفة %','markup',p.markup??35,'number','min="0" max="500" step="0.1" required')}</div><div class="form-actions"><button class="btn primary" type="submit">حفظ قواعد التسعير</button></div></section></form><section class="card mt"><div class="card-head"><div><h2>الأسعار المرجعية للخدمات</h2><p>قيم توضيحية، عدلها حسب خاماتك ومعداتك وسوقك.</p></div></div><form id="service-prices-form"><div class="table-wrap"><table class="data-table"><thead><tr><th>القسم</th><th>الخدمة</th><th>وحدة البيع</th><th>السعر المرجعي</th></tr></thead><tbody>${K.categories.map(c=>c.services.map((s,i)=>`<tr><td>${esc(c.name)}</td><td>${esc(s.name)}</td><td>${esc(s.unit)}</td><td><input type="number" min="0" max="10000000" step="0.01" name="${c.id}-${i}" value="${servicePrice(c.id,i,s.basePrice)}" aria-label="سعر ${esc(s.name)}" style="width:115px"></td></tr>`).join('')).join('')}</tbody></table></div><div class="form-actions"><button class="btn primary" type="submit">حفظ قائمة الأسعار</button></div></form></section>`;}else if(t==='permissions'){const u=state.users.find(x=>x.id===UI.permissionUser&&x.role!=='owner')||state.users.find(x=>x.role!=='owner');UI.permissionUser=u?.id;body=`<section class="card"><div class="card-head"><div><h2>صلاحيات المستخدم</h2><p>صلاحية واضحة لكل إجراء، والأسعار والتكاليف حسب الدور.</p></div></div>${u?`<div class="field mb"><label for="permission-user">اختر المستخدم</label><select id="permission-user">${state.users.filter(x=>x.role!=='owner').map(x=>`<option value="${x.id}" ${x.id===u.id?'selected':''}>${esc(x.name)} — ${roleLabel(x.role)}</option>`).join('')}</select></div><form id="permissions-form" data-id="${u.id}"><div class="permission-grid">${K.permissions.map(p=>`<label class="check"><input type="checkbox" name="${p.id}" ${M.can(state,u.id,p.id,u.branchIds[0])?'checked':''}> ${esc(p.label)}</label>`).join('')}</div><div class="form-actions"><button class="btn primary" type="submit">حفظ صلاحيات المستخدم</button></div></form>`:empty('أضف موظفا أولا')}<div class="mt">${alertBox(CONNECTED?'يتحقق الخادم من صلاحيات الحساب وفرعه في كل عملية. التغيير يسري على الطلبات التالية.':'حسابات العرض المحلي ليست حماية للبيانات على جهاز مشترك.','gray','shield')}</div></section>`;}else if(t==='performance'){const p=state.settings.performance;body=`<section class="card"><form id="performance-form"><h3 class="form-section-title">أوزان تقييم الإنجاز الشهري</h3><div class="form-grid three">${field('الالتزام بالموعد %','onTimeWeight',p.onTimeWeight,'number','min="0" max="100" step="1" required')}${field('تقييم العملاء %','qualityWeight',p.qualityWeight,'number','min="0" max="100" step="1" required')}${field('تحقيق هدف الإنجاز %','outputWeight',p.outputWeight,'number','min="0" max="100" step="1" required')}</div><div class="field-note">يجب أن يكون مجموع الأوزان 100%. عند غياب التقييم يعاد توزيع الوزن على البيانات المتاحة.</div><div class="form-actions"><button class="btn primary" type="submit">حفظ أوزان التقييم</button></div></form><div class="mt">${performanceMap()}</div></section>`;}else if(t==='connections'){body=`<div class="grid two"><section class="card"><div class="row">${appico('qr','#8b60d1')}<div><h3>صفحة تقييم العملاء</h3><p class="tiny muted">عنوان الصفحة بعد نشرها وربط استقبال التقييمات</p></div></div><form id="connections-form" class="mt">${field('رابط التطبيق المنشور','publicBaseUrl',state.settings.publicBaseUrl||'','url','placeholder="https://example.com/"')}${field('عنوان API المقترح للربط لاحقا','apiBaseUrl',state.settings.apiBaseUrl||'','url','placeholder="https://api.example.com/"')}<div class="form-actions"><button class="btn primary" type="submit">حفظ عناوين الربط</button></div></form><p class="field-note">حفظ العناوين يجهز الإعداد فقط، ولا ينشئ خادما أو يفعل المزامنة.</p></section><section class="card"><div class="row">${appico('whatsapp','#49b980')}<div><h3>تقارير واتساب</h3><p class="tiny muted">تنبيهات المراحل وأوامر العمل وتقارير الإدارة</p></div></div><div class="mt">${tag('ربط مركزي مطلوب','orange')}</div><p class="tiny muted mt">الإرسال الآلي يحتاج WhatsApp Business Platform وخادما لإدارة الرسائل والقوالب. في النسخة الحالية تستطيع تجهيز نص التقرير ونسخه.</p>${btn('نسخ تقرير التشغيل','copy-summary','soft full mt','','copy')}</section><section class="card"><div class="row">${appico('refresh','#5096e8')}<div><h3>الربط والمزامنة</h3><p class="tiny muted">API، قاعدة بيانات، صلاحيات مركزية وسجل مزامنة</p></div></div><div class="mt">${alertBox('هذه النسخة تعمل وتحتفظ بالتغييرات محليا. الأجهزة والفروع لا تتبادل البيانات حتى تجهيز الخادم.','gray')}</div></section><section class="card"><div class="row">${appico('shield','#d18eac')}<div><h3>Windows وAndroid</h3><p class="tiny muted">واجهة متجاوبة جاهزة لتجربة العمل على المتصفح</p></div></div><p class="tiny muted mt">التثبيت الأصلي ومزامنة قواعد البيانات والتوقيع وملفات التوزيع مرحلة لاحقة منفصلة عن هذه الواجهة.</p></section></div>`;}else{body=`<div class="grid two"><section class="card"><h3>نسخة احتياطية للعمليات</h3><p class="tiny muted mt">تحتوي البيانات والخامات والمستخدمين والهوية والمسودات. احفظها قبل تغيير الجهاز أو مسح بيانات المتصفح.</p>${btn('تنزيل نسخة JSON','export-backup','primary full mt','','download')}<label class="btn full mt">${ico('upload')} استعادة نسخة احتياطية<input data-upload="backup" type="file" accept=".json,application/json" hidden></label><p class="field-note">يتم فحص محتوى النسخة وتراجعها قبل الاستبدال.</p><div id="backup-preview"></div></section><section class="card"><h3>بيانات التشغيل المحلية</h3><p class="tiny muted mt">يمكنك تجربة بيانات العرض أو بدء قاعدة فارغة مع الاحتفاظ بالهوية وحساب المالك والفرع الرئيسي.</p><div class="field mt"><label for="reset-confirm">للتأكيد اكتب: بدء جديد</label><input id="reset-confirm" placeholder="بدء جديد" autocomplete="off"></div>${btn('بدء بيانات فارغة','clear-data','danger full mt','','trash')}${btn('إعادة بيانات التجربة','reset-demo','full mt','','refresh')}</section></div>`;}return title('الإعدادات والهوية','خصص النظام باسم نشاطك وشعارك وطريقة تشغيلك',btn(CONNECTED?'تسجيل الخروج':'تبديل حساب العرض','switch-user','','','users'))+tabs([['brand','الهوية والكليشة'],['pricing','التسعير'],['permissions','الصلاحيات'],['performance','تقييم الأداء'],['connections','الربط والتكامل'],['backup','النسخ الاحتياطي']],t,'settingsTab')+body;}
function bindBrandPreview(){const f=$('#brand-form');f?.addEventListener('input',()=>{const v=values(f);$('#preview-name').textContent=v.name;$('#preview-footer').textContent=v.footer;$('#brand-live-preview .preview-top').style.background=v.primary;});}
let pendingBackup=null;
function download(name,content,type='text/plain;charset=utf-8'){const blob=content instanceof Blob?content:new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function csv(rows){return '\ufeff'+rows.map(row=>row.map(v=>{let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(',')).join('\r\n');}
function exportOrders(report=false){if(!actor())return;let os=orders();if(report){requirePerm('view_reports');os=os.filter(o=>o.status==='delivered'&&(!UI.reportFrom||o.deliveredAt>=UI.reportFrom)&&(!UI.reportTo||o.deliveredAt.slice(0,10)<=UI.reportTo));}const rows=[['رقم الأمر','العمل','العميل','الفرع','الحالة','التسليم',...(financial()?['البيع','التكلفة المسجلة','التكلفة التقديرية','هامش المساهمة']:[])],...os.map(o=>[o.number,o.title,client(o.clientId)?.name,bname(o.branchId),stage(o.status)[1],o.dueAt,...(financial()?[o.salePrice,o.actualCost,o.estimatedCost,o.salePrice-(((o.actualCost>0||o.consumptions?.length)?o.actualCost:o.estimatedCost))]:[])])];download(report?'work-orders-report.csv':'work-orders.csv',csv(rows),'text/csv;charset=utf-8');}
function printContent(html){$('#print-area').innerHTML=html;window.print();}
function printHeader(name,number=''){return `<div class="print-header"><div><h1>${esc(name)}</h1><p>${esc(state.brand.name)} · ${esc(state.brand.activity)}</p>${number?`<p>${esc(number)}</p>`:''}</div><img src="${logo()}" alt="الشعار"></div>`;}
function printFooter(qr=''){return `<div class="print-footer"><div>${esc(state.brand.footer||state.brand.name)}<br>نظام أوامر العمل والتشغيل · ${day(new Date())}</div>${qr?WOQR.svg(encodeURI(qr),{size:96,margin:4}):''}</div>`;}

function printTemplate(type,id){
 const o=orders().find(o=>o.id===id);if(!o)throw new Error('أمر العمل غير متاح');
 const data={order:o,brand:state.brand,client:client(o.clientId),branch:bname(o.branchId),dueAt:dt(o.dueAt),status:stage(o.status)[1],issuedAt:day(new Date()),logo:logo(),currency:state.brand.currency||'SAR',canFinancial:financial(),canManageOrders:perm('manage_orders',o.branchId),team:(o.assignees||[]).map(a=>({...a,name:uname(a.userId),dueAt:dt(a.dueAt||o.dueAt)}))};
 printContent(WODocuments.render(type,data));
}
function printOrder(id){printTemplate('workOrder',id);}

async function copy(text){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();if(!ok)throw new Error('copy');}toast('تم النسخ');}catch(e){toast('تعذر النسخ التلقائي في هذا المتصفح. استخدم نسخة الطباعة.',true);}}
function summaryText(){const os=orders();return `${state.brand.name}\nتقرير التشغيل — ${day(new Date())}\n${UI.branch==='all'?'جميع الفروع':bname(UI.branch)}\nالأوامر: ${os.length}\nقيد التنفيذ: ${os.filter(o=>o.status==='production').length}\nجاهزة للتسليم: ${os.filter(o=>o.status==='ready').length}\nمتأخرة: ${os.filter(isLate).length}\n\n${os.filter(isLate).slice(0,5).map(o=>o.number+' — '+o.title).join('\n')}`;}
function calcToOrder(){requirePerm('manage_orders');if(!calcResult)throw new Error('أكمل مدخلات الحاسبة أولا');const p=calcInputs,t=UI.calcType,m=scoped(state.materials).find(m=>m.id===UI.calcMaterialId);if(m?.costConfirmed===false)throw new Error('أكد تكلفة المورد في بطاقة الخامة قبل نقل التسعير');const category=m?.category||{sheet:'acrylic',paper:'paper',roll:'banners',letters:'letters',led:'installation',general:'gifts'}[t];state.drafts.order={title:CALCTYPES.find(x=>x[0]===t)[1],category,materialId:m?.id||'',quantity:p.quantity||p.count||1,width:p.pieceW||p.width||0,height:p.pieceH||p.length||p.height||0,unit:t==='general'?'piece':t==='roll'||t==='letters'?'m':'cm',estimatedCost:calcResult.totalCost,salePrice:calcResult.suggestedPrice,branchId:m?.branchId||ownBranch(),description:'تقدير من حاسبة '+CALCTYPES.find(x=>x[0]===t)[1]+'؛ يراجع حسب مواصفات التنفيذ. لا يمثل صرفا من المخزون.'};persist();go('newOrder');toast('نقلت المقاسات والخامة والتكلفة إلى مسودة أمر جديد');}
function updateCalcDraft(){const f=$('#calc-form');if(!f)return;state.drafts.calculators=state.drafts.calculators||{};state.drafts.calculators[UI.calcType]=values(f);try{persist();}catch(e){toast('تعذر حفظ مدخلات الحاسبة',true);}updateCalcResult();}
function validNum(v,label,min=0){const n=Number(v);if(!Number.isFinite(n)||n<min||n>100000000)throw new Error('قيمة '+label+' غير صالحة');return n;}
function cleanText(v,label,max=200,required=true){const s=String(v||'').trim();if((required&&!s)||s.length>max)throw new Error('راجع حقل '+label);return s;}
function storeOrder(form,draftOnly=false){clearTimeout(draftTimer);const v=orderDraft(form),team=v.assignees;delete v.assignees;delete v.service;const id=form.dataset.orderId;const result=mutate(()=>{let o;if(id){o=state.orders.find(x=>x.id===id);const allowed=['clientId','title','category','description','quantity','width','height','unit','materialId','salePrice','estimatedCost','dueAt','priority','designDataUrl'];const patch={};for(const k of allowed)if(v[k]!==undefined)patch[k]=v[k];o=M.updateOrder(state,actorId,id,patch);if(!o.assignees.some(a=>a.done||a.acceptedAt)){if(o.assignees.length&&!team.length)throw new Error('حدد موظفا واحدا على الأقل أو احتفظ بفريق العمل الحالي');if(team.length)M.assignTeam(state,actorId,id,team);}}else{o=M.createOrder(state,actorId,v);if(team.length)M.assignTeam(state,actorId,o.id,team);if(!draftOnly)M.transitionOrder(state,actorId,o.id,'approval');delete state.drafts.order;}return o;},id?'تم تعديل الأمر':'تم حفظ أمر العمل');if(result)go('order/'+result.id);}
async function handleUpload(el){const file=el.files?.[0];if(!file)return;const kind=el.dataset.upload;if(kind==='backup'){if(CONNECTED)throw new Error('استعادة النسخة المركزية تتم من أداة الخادم');requirePerm('manage_settings');if(file.size>12*1024*1024)throw new Error('ملف النسخة كبير جدا');let candidate;try{candidate=JSON.parse(await file.text());candidate=M.validateState(candidate);}catch(e){throw new Error('النسخة غير صالحة: '+e.message);}pendingBackup=candidate;const target=$('#backup-preview');target.innerHTML=alertBox(`نسخة تحتوي ${candidate.orders.length} أمر و${candidate.branches.length} فرع. الاستعادة تستبدل البيانات المحلية الحالية.`,'orange')+btn('تأكيد استعادة هذه النسخة','confirm-import','primary full mt','','check');return;}if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('اختر صورة PNG أو JPG أو WebP');if(file.size>2*1024*1024)throw new Error('الحد الأقصى للصورة 2 MB');const dataUrl=await new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=reject;fr.readAsDataURL(file);});if(kind==='design'){UI.formImage=dataUrl;const p=$('#design-preview');p.innerHTML=`<img src="${imageSafe(dataUrl)}" alt="التصميم"><span>تغيير الصورة</span>`;const f=$('#order-form');if(!f.dataset.orderId){state.drafts.order=orderDraft(f);try{persist();}catch(e){toast('تعذر حفظ الصورة؛ صدر نسخة ثم قلل حجم الصور',true);}}}else if(kind==='logo'){mutate(()=>{requirePerm('manage_settings');state.brand.logo=dataUrl;audit('update_brand','brand','تغيير شعار النشاط');},'تم تحديث الشعار');}else if(kind==='order-photo'){mutate(()=>M.addOrderAttachment(state,actorId,el.dataset.orderId,{name:file.name,dataUrl}),'تم توثيق الصورة');}}
$('#app').addEventListener('click',async event=>{const el=event.target.closest('[data-action]');if(!el)return;const a=el.dataset.action;try{if(a.startsWith('pro:')&&globalThis.WOInventoryUI){await WOInventoryUI.action(a,el,inventoryContext());return;}switch(a){
case 'central-reload':location.reload();break;
case 'central-sync':await WOTransport.flush();render();break;
case 'central-refresh':await WOTransport.refresh();toast('تم تحديث بيانات المنشأة');break;
case 'central-export-pending':download('pending-operations-'+Date.now()+'.json',WOTransport.exportPending(),'application/json');break;
case 'central-discard-pending':if(el.dataset.confirm!=='yes'){el.dataset.confirm='yes';el.textContent='تأكيد الأرشفة وتنزيل نسخة من الطلبات';break;}download('pending-operations-'+Date.now()+'.json',WOTransport.exportPending(),'application/json');await WOTransport.discardPending();toast('أرشفت الطلبات، وتظهر الآن بيانات الخادم');break;
case 'central-install':if(installPrompt){await installPrompt.prompt();installPrompt=null;}else toast('من قائمة Chrome أو Edge اختر تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية');break;
case 'navigate':go(el.dataset.to);break;
case 'login-selected':
case 'login':{if(CONNECTED)throw new Error('استخدم تسجيل الدخول لحسابك');const selected=a==='login-selected'?$('#demo-user-select').value:el.dataset.user;const u=state.users.find(x=>x.id===selected&&x.active!==false);if(!u)throw new Error('هذا الحساب غير متاح');$('#print-area').innerHTML='';actorId=u.id;UI.branch=u.role==='owner'?'all':u.branchIds[0];saveSession();go(u.role==='employee'?'myWork':u.role==='purchasing'?'purchases':'home');break;}
case 'switch-user':if(CONNECTED){await centralLogout();break;}$('#print-area').innerHTML='';actorId='';saveSession();go('login');break;
case 'sidebar-toggle':UI.sidebarCollapsed=!UI.sidebarCollapsed;saveSession();render();break;
case 'menu':UI.menu=!UI.menu;render();break;
case 'menu-close':UI.menu=false;render();break;
case 'theme':document.body.classList.toggle('dark');session.theme=document.body.classList.contains('dark')?'dark':'light';document.body.dataset.themeReady='1';saveSession();break;
case 'notifications':UI.notifications=!UI.notifications;render();break;
case 'tab':UI[el.dataset.key]=el.dataset.value;UI.query='';UI.inventoryForm=null;render();break;
case 'order-filter':UI.status=el.dataset.value;render();break;
case 'save-order-draft':{const f=$('#order-form');if(f.reportValidity())storeOrder(f,true);break;}
case 'proof-send':
case 'proof-renew':{
 if(!CONNECTED)throw new Error('إرسال اعتماد العميل يتطلب تشغيل الخادم المركزي');
 const id=el.dataset.id,order=orders().find(o=>o.id===id);
 if(!order||!perm('manage_orders',order.branchId))throw new Error('هذا الأمر خارج صلاحياتك');
 const q=WOTransport.queueInfo();
 if(q.readOnly||q.blocked||q.count||!q.online)throw new Error('أكمل المزامنة واتصل بالخادم قبل إصدار رابط العميل');
 const force=a==='proof-renew';
 if(force&&el.dataset.confirm!=='yes'){el.dataset.confirm='yes';el.textContent='تأكيد إنشاء إصدار جديد وإلغاء الرابط السابق';break;}
 el.disabled=true;
 try{const result=await WOTransport.request('/api/orders/'+encodeURIComponent(id)+'/proof','POST',{force});await WOTransport.refresh();await copy(result.url);}
 finally{if(el.isConnected)el.disabled=false;}
 break;
}
case 'proof-copy':{
 const order=orders().find(o=>o.id===el.dataset.id);
 if(!order||!perm('manage_orders',order.branchId)||!order.proofToken)throw new Error('رابط العميل غير متاح');
 await copy(location.origin+'/proof.html?token='+encodeURIComponent(order.proofToken));break;
}
case 'proof-refresh':await WOTransport.refresh();toast('تم تحديث قرارات العملاء من الخادم');break;
case 'approve-design':mutate(()=>M.updateOrder(state,actorId,el.dataset.id,{designApproved:true}),'تم اعتماد التصميم');break;
case 'advance-order':mutate(()=>{const o=state.orders.find(o=>o.id===el.dataset.id);const result=M.transitionOrder(state,actorId,o.id,el.dataset.next);if(I&&['cancelled','delivered'].includes(result.status))I.releaseForOrder(state,actorId,o.id);return result;},'تم تحديث مرحلة العمل');break;
case 'cancel-order':if(el.dataset.confirm!=='yes'){el.dataset.confirm='yes';el.querySelector('.label').textContent='اضغط لتأكيد الإلغاء';return;}mutate(()=>{const o=M.transitionOrder(state,actorId,el.dataset.id,'cancelled');if(I)I.releaseForOrder(state,actorId,o.id);return o;},'تم إلغاء الأمر وفك حجوزاته');break;
case 'accept-task':mutate(()=>M.acceptAssignment(state,actorId,el.dataset.id),'تم استلام المهمة وبدء تنفيذ حصتك');break;
case 'cost-correct':{const form=$('form[data-cost-id="'+el.dataset.id+'"]');if(form)form.classList.toggle('hidden');break;}
case 'toggle-consumption':$('#consumption-area')?.classList.toggle('hidden');break;
case 'reserve-remnant':{const oid=el.dataset.orderId||$('#reserve-order-'+el.dataset.id)?.value;if(!oid)throw new Error('اختر أمر العمل المناسب');mutate(()=>M.reserveRemnant(state,actorId,el.dataset.id,oid),'تم حجز القطعة لهذا الأمر');break;}
case 'release-remnant':mutate(()=>M.releaseRemnant(state,actorId,el.dataset.id),'تم فك حجز القطعة');break;
case 'inventory-new':UI.inventoryForm=UI.inventoryTab==='remnants'?'remnant':'material';render();break;
case 'inventory-close':UI.inventoryForm=null;render();break;
case 'purchase-new':UI.purchaseForm=true;render();break;
case 'purchase-close':UI.purchaseForm=null;render();break;
case 'material-purchase':{const m=state.materials.find(m=>m.id===el.dataset.id);requirePerm('request_purchase',m.branchId);UI.purchaseForm={materialId:m.id,branchId:m.branchId,title:'شراء '+m.name,quantity:Math.max(1,m.minQuantity*2-m.quantity),unitCost:m.unitCost};go('purchases');break;}
case 'approve-purchase':mutate(()=>M.approvePurchase(state,actorId,el.dataset.id),'تم اعتماد الشراء');break;
case 'reject-purchase':mutate(()=>M.rejectPurchase(state,actorId,el.dataset.id),'تم رفض الطلب');break;
case 'receive-purchase':if(el.dataset.confirm!=='yes'){el.dataset.confirm='yes';el.querySelector('.label').textContent='وصلت البضاعة؟ أكد';return;}mutate(()=>(I?I.receivePurchase:M.receivePurchase)(state,actorId,el.dataset.id),'تم توثيق الاستلام وزيادة المخزون مرة واحدة');break;
case 'employee-new':UI.employeeForm=true;render();break;
case 'employee-edit':UI.employeeForm=el.dataset.id;render();break;
case 'employee-close':UI.employeeForm=null;render();break;
case 'branch-new':UI.branchForm=true;render();break;
case 'branch-edit':UI.branchForm=el.dataset.id;render();break;
case 'branch-close':UI.branchForm=null;render();break;
case 'select-branch':if(!allowedBranches().some(b=>b.id===el.dataset.id))throw new Error('الفرع خارج الصلاحية');UI.branch=el.dataset.id;saveSession();go('home');break;
case 'client-new':UI.clientForm=true;render();break;
case 'client-close':UI.clientForm=false;render();break;
case 'client-order':{requirePerm('manage_orders');const c=scoped(state.clients).find(c=>c.id===el.dataset.id);if(!c)throw new Error('العميل خارج نطاقك');state.drafts.order={clientId:c.id,branchId:c.branchId};persist();go('newOrder');break;}
case 'use-service':{requirePerm('manage_orders');const c=cat(el.dataset.category),s=c.services[Number(el.dataset.index)];state.drafts.order={category:c.id,service:s.name,title:s.name,quantity:1,salePrice:servicePrice(c.id,Number(el.dataset.index),s.basePrice),branchId:ownBranch()};persist();go('newOrder');break;}
case 'open-calc':UI.calcMaterialId='';UI.calcType=el.dataset.type||'sheet';go('calculators/'+UI.calcType);break;
case 'reset-calc':UI.calcMaterialId='';if(state.drafts.calculators)delete state.drafts.calculators[UI.calcType];persist();render();break;
case 'calc-to-order':calcToOrder();break;
case 'print-calc':if(!calcResult)throw new Error('لا توجد حسبة صالحة للطباعة');printContent(printHeader('تقدير تكلفة وتسعير')+`<h2>${CALCTYPES.find(x=>x[0]===UI.calcType)[1]}</h2><table><thead><tr><th>البند</th><th>القيمة</th></tr></thead><tbody>${calcResult.breakdown.map(b=>`<tr><td>${esc(b.label)}</td><td>${fmt(b.value,2)}</td></tr>`).join('')}<tr><td>إجمالي التكلفة</td><td>${fmt(calcResult.totalCost,2)} ${currency()}</td></tr><tr><td>سعر البيع المقترح</td><td>${fmt(calcResult.suggestedPrice,2)} ${currency()}</td></tr></tbody></table><p>${calcResult.notes.map(esc).join('<br>')}</p>`+printFooter());break;
case 'print-order':printOrder(el.dataset.id);break;
case 'print-quote':printTemplate('quotation',el.dataset.id);break;
case 'print-delivery':printTemplate('delivery',el.dataset.id);break;
case 'print-approval':printTemplate('approval',el.dataset.id);break;
case 'print-orders':printContent(printHeader('كشف أوامر العمل')+orderTable(orders())+printFooter());break;
case 'export-orders':exportOrders();break;
case 'export-report':exportOrders(true);break;
case 'clear-report':UI.reportFrom='';UI.reportTo='';render();break;
case 'order-review':UI.reviewOrderId=el.dataset.id;go('reviews');break;
case 'feedback-preview':UI.rating=0;go('feedback/'+encodeURIComponent(el.dataset.token));break;
case 'copy-review':await copy(feedbackLink(el.dataset.token));break;
case 'print-review':{const o=orders().find(o=>o.id===el.dataset.id);if(!o)throw new Error('أمر غير متاح');printContent(printHeader('نسعد بتقييم تجربتك')+`<div style="text-align:center;padding:30px"><h2>${esc(o.title)}</h2><p>امسح الرمز، اختر التقييم واكتب تعليقك. الاسم اختياري ولا تحتاج إلى حساب.</p><div style="display:flex;justify-content:center">${WOQR.svg(encodeURI(feedbackLink(o.reviewToken)),{size:230,margin:4})}</div><p>تقييمك يصل إلى الإدارة ومدير الفرع.</p>${CONNECTED?'':'<p>نسخة محلية تجريبية؛ يلزم نشر وربط الصفحة لاستقبال التقييمات من أجهزة أخرى.</p>'}</div>`+printFooter());break;}
case 'rating':UI.rating=Number(el.dataset.value);$$('.rating-btn').forEach(b=>b.classList.toggle('active',Number(b.dataset.value)<=UI.rating));break;
case 'copy-summary':await copy(summaryText());break;
case 'export-backup':if(CONNECTED){const backup=await WOTransport.request('/api/backup');download('company-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(backup,null,2),'application/json');toast('تم تنزيل نسخة الخادم');break;}requirePerm('manage_settings');download('work-orders-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(state,null,2),'application/json');toast('تم تجهيز النسخة الاحتياطية');break;
case 'confirm-import':{if(CONNECTED)throw new Error('استعادة قاعدة الخادم تتم بأداة الإدارة');requirePerm('manage_settings');if(!pendingBackup)throw new Error('لا توجد نسخة مفحوصة');const backup=state;try{state=pendingBackup;persist();pendingBackup=null;actorId=state.users.find(u=>u.role==='owner'&&u.active!==false)?.id||'';UI.branch='all';saveSession();render();toast('تمت استعادة النسخة');}catch(e){state=backup;throw e;}break;}
case 'clear-data':case 'reset-demo':{if(CONNECTED)throw new Error('هذه الوظيفة خاصة ببيانات العرض المحلي');requirePerm('manage_settings');if($('#reset-confirm')?.value.trim()!=='بدء جديد')throw new Error('اكتب بدء جديد في حقل التأكيد أولا');const brand={...state.brand};mutate(()=>{state=M.seed();state.brand=brand;if(a==='clear-data'){const owner=state.users.find(u=>u.role==='owner');owner.branchIds=['b1'];state.users=[owner];state.branches=state.branches.filter(b=>b.id==='b1');for(const k of ['clients','orders','materials','remnants','purchases','reviews','audit'])state[k]=[];state.drafts={};}actorId='owner';UI.branch='all';saveSession();},a==='clear-data'?'بدأت قاعدة محلية فارغة':'استعدت بيانات التجربة');go('home');break;}
}}catch(e){toast(e.message||'تعذر تنفيذ الإجراء',true);}});
$('#app').addEventListener('submit',async event=>{const form=event.target;if(!(form instanceof HTMLFormElement))return;event.preventDefault();const v=values(form);try{if(form.id.startsWith('pro-')&&globalThis.WOInventoryUI){await WOInventoryUI.submit(form,inventoryContext());return;}switch(form.id){
case 'order-form':storeOrder(form,false);break;
case 'complete-task-form':mutate(()=>M.completeAssignment(state,actorId,form.dataset.id,Number(v.minutes)),'تم تسجيل إنجاز حصتك');break;
case 'cost-form':mutate(()=>M.addOrderCost(state,actorId,form.dataset.id,v),'تم تسجيل تكلفة التشغيل');break;
case 'cost-reverse-form':mutate(()=>M.reverseOrderCost(state,actorId,form.dataset.id,form.dataset.costId,v.reason),'تم توثيق تصحيح التكلفة');break;
case 'consume-form':mutate(()=>(I?I.issue:M.consumeMaterial)(state,actorId,form.dataset.id,v),'تم تسجيل الصرف والهدر');break;
case 'order-note-form':mutate(()=>M.addOrderNote(state,actorId,form.dataset.id,v.text),'تمت إضافة الملاحظة');break;
case 'inventory-form':{const result=mutate(()=>{requirePerm('manage_inventory',v.branchId);const name=cleanText(v.name,'اسم الخامة',100);if(form.dataset.kind==='material'){const m={id:M.uid('mat'),branchId:v.branchId,name,category:cleanText(v.category,'التصنيف',80),unit:v.unit,quantity:validNum(v.quantity,'الرصيد'),minQuantity:validNum(v.minQuantity,'حد التنبيه'),unitCost:validNum(v.unitCost,'تكلفة الوحدة'),supplier:cleanText(v.supplier,'المورد',100,false),width:0,height:0,thickness:0,color:''};state.materials.push(m);audit('create_material',m.id,'إضافة '+name,v.branchId);return m;}const m=state.materials.find(m=>m.id===v.materialId&&m.branchId===v.branchId);if(!m)throw new Error('اختر خامة من نفس الفرع');if(!v.confirmed)throw new Error('أكد مراجعة المقاس الفعلي');if(v.sourceOrderId&&!state.orders.some(o=>o.id===v.sourceOrderId&&o.branchId===v.branchId))throw new Error('الأمر السابق خارج الفرع');const r={id:M.uid('rem'),branchId:v.branchId,materialId:m.id,name,width:validNum(v.width,'العرض',.01),height:validNum(v.height,'الارتفاع',.01),thickness:validNum(v.thickness,'السماكة'),color:cleanText(v.color,'اللون',50,false),location:cleanText(v.location,'الموقع',100),sourceOrderId:v.sourceOrderId||'',confirmedBy:actorId,status:'available',reservedFor:null,createdAt:new Date().toISOString()};state.remnants.push(r);audit('create_remnant',r.id,'تسجيل مقاس باقي مؤكد',v.branchId);return r;},'تم حفظ بيانات المخزون');if(result){UI.inventoryForm=null;render();}break;}
case 'purchase-form':{const r=mutate(()=>createPurchaseFromForm(v),'تم رفع طلب الشراء للمدير');if(r){UI.purchaseForm=null;render();}break;}
case 'central-login-form':{const button=$('button[type=submit]',form);button.disabled=true;try{centralError='';const result=await WOTransport.login(v.email,v.password);await applyCentralSnapshot(result);go(result.account?.kind==='platform'?'platform':result.account?.role==='employee'?'myWork':'home');}catch(e){centralError=e.message;renderLogin();}finally{button.disabled=false;}break;}
case 'central-password-form':{if(v.newPassword!==v.confirmPassword)throw new Error('تأكيد كلمة المرور غير مطابق');await WOTransport.request('/api/password','POST',{currentPassword:v.currentPassword,newPassword:v.newPassword});form.reset();toast('تم تغيير كلمة المرور وإبطال الجلسات الأخرى');break;}
case 'central-feedback-form':{if(UI.rating<1||UI.rating>5)throw new Error('اختر عدد النجوم أولا');const button=$('button[type=submit]',form);button.disabled=true;try{await WOTransport.request('/api/public/reviews/'+encodeURIComponent(form.dataset.token),'POST',{rating:UI.rating,name:v.name,comment:v.comment});publicReviewCache.delete(form.dataset.token);await renderCentralFeedback(form.dataset.token);}finally{button.disabled=false;}break;}
case 'employee-password-form':{if(WOTransport.queueInfo().count)throw new Error('أكمل المزامنة قبل تغيير حساب الموظف');const password=v.password;form.reset();await WOTransport.request('/api/users/'+encodeURIComponent(form.dataset.id)+'/password','POST',{password});toast('تم تعيين كلمة المرور وإلغاء جلسات الموظف');break;}
case 'employee-form':{if(CONNECTED){await saveCentralEmployee(form,v);break;}const r=mutate(()=>{requirePerm('manage_team',v.branchId);if(!allowedBranches().some(b=>b.id===v.branchId))throw new Error('الفرع خارج نطاقك');if(!['employee','manager','purchasing'].includes(v.role))throw new Error('الدور غير صالح');const data={name:cleanText(v.name,'اسم الموظف',80),jobTitle:cleanText(v.jobTitle,'المسمى',80),role:v.role,branchIds:[v.branchId],targetMonthly:validNum(v.targetMonthly,'الهدف',1),active:!!v.active};if(form.dataset.id){const u=state.users.find(u=>u.id===form.dataset.id&&u.role!=='owner');if(!u)throw new Error('المستخدم غير متاح');if(!u.branchIds.every(b=>perm('manage_team',b)))throw new Error('لا يمكنك تعديل موظف خارج فروعك');if((u.branchIds[0]!==v.branchId||u.role!==v.role)&&state.orders.some(o=>o.assignees.some(a=>a.userId===u.id)))throw new Error('الموظف مرتبط بأوامر عمل. احتفظ بفرعه ودوره لحماية السجل السابق.');Object.assign(u,data);audit('update_user',u.id,'تحديث بيانات الموظف',v.branchId);return u;}const u={id:M.uid('user'),...data,permissions:{}};state.users.push(u);audit('create_user',u.id,'إضافة '+u.name,v.branchId);return u;},'تم حفظ الموظف');if(r){UI.employeeForm=null;render();}break;}
case 'branch-form':{const r=mutate(()=>{requirePerm('manage_branches');const data={name:cleanText(v.name,'اسم الفرع',80),city:cleanText(v.city,'المدينة',80),address:cleanText(v.address,'العنوان',200,false)};if(state.branches.some(b=>b.name===data.name&&b.id!==form.dataset.id))throw new Error('اسم الفرع موجود بالفعل');if(form.dataset.id){const b=state.branches.find(b=>b.id===form.dataset.id);Object.assign(b,data);audit('update_branch',b.id,'تحديث بيانات الفرع',b.id);return b;}const b={id:M.uid('branch'),...data,active:true};state.branches.push(b);state.users.filter(u=>u.role==='owner').forEach(u=>u.branchIds.push(b.id));audit('create_branch',b.id,'إنشاء '+b.name,b.id);return b;},'تم حفظ الفرع');if(r){UI.branchForm=null;render();}break;}
case 'client-form':{const r=mutate(()=>{requirePerm('manage_orders',v.branchId);const c={id:M.uid('client'),branchId:v.branchId,name:cleanText(v.name,'اسم العميل',100),phone:cleanText(v.phone,'رقم الهاتف',30,false),company:cleanText(v.company,'النشاط',100,false)};state.clients.push(c);audit('create_client',c.id,'إضافة عميل',c.branchId);return c;},'تم حفظ العميل');if(r){UI.clientForm=false;render();}break;}
case 'feedback-form':{if(UI.rating<1||UI.rating>5)throw new Error('اختر عدد النجوم أولا');mutate(()=>M.submitReview(state,{token:form.dataset.token,rating:UI.rating,name:v.name,comment:v.comment}),'تم حفظ التقييم محليا');break;}
case 'report-filter-form':if(v.from&&v.to&&v.from>v.to)throw new Error('تاريخ البداية يجب أن يسبق النهاية');UI.reportFrom=v.from;UI.reportTo=v.to;render();break;
case 'brand-form':mutate(()=>{requirePerm('manage_settings');state.brand={...state.brand,name:cleanText(v.name,'اسم النشاط',80),activity:cleanText(v.activity,'نوع النشاط',120),currency:v.currency,primary:v.primary,secondary:v.secondary,footer:cleanText(v.footer,'التذييل',400,false)};audit('update_brand','brand','تحديث الهوية والكليشة');},'تم تطبيق الهوية في كل الأقسام');break;
case 'pricing-form':mutate(()=>{requirePerm('manage_settings');state.settings.pricing={letterMinHeight:validNum(v.letterMinHeight,'الحد الأدنى',.01),logoMultiplier:validNum(v.logoMultiplier,'معامل الشعار',1),markup:validNum(v.markup,'الإضافة')};audit('update_pricing','pricing','تحديث قواعد التسعير');},'تم تحديث قواعد التسعير');break;
case 'service-prices-form':mutate(()=>{requirePerm('manage_settings');const prices={};for(const [key,value]of Object.entries(v))prices[key]=validNum(value,'السعر');state.settings.servicePrices=prices;audit('update_prices','catalog','تحديث أسعار الخدمات المرجعية');},'تم حفظ الأسعار');break;
case 'permissions-form':mutate(()=>{requirePerm('manage_settings');const u=state.users.find(u=>u.id===form.dataset.id&&u.role!=='owner');if(!u)throw new Error('المستخدم غير متاح');u.permissions=Object.fromEntries(K.permissions.map(p=>[p.id,!!v[p.id]]));audit('update_permissions',u.id,'تعديل صلاحيات '+u.name,u.branchIds[0]);},'تم تطبيق الصلاحيات');break;
case 'performance-form':mutate(()=>{requirePerm('manage_settings');const p={onTimeWeight:validNum(v.onTimeWeight,'الالتزام'),qualityWeight:validNum(v.qualityWeight,'الجودة'),outputWeight:validNum(v.outputWeight,'الهدف')};if(Math.abs(Object.values(p).reduce((n,x)=>n+x,0)-100)>.01)throw new Error('مجموع الأوزان يجب أن يكون 100%');state.settings.performance=p;audit('update_performance','performance','تحديث أوزان الأداء');},'تم حفظ معايير الأداء');break;
case 'connections-form':mutate(()=>{requirePerm('manage_settings');for(const key of ['publicBaseUrl','apiBaseUrl']){const val=String(v[key]||'').trim();if(val&&!/^https:\/\//i.test(val))throw new Error('استخدم رابط HTTPS صالحا');if(val)new URL(val);state.settings[key]=val;}audit('update_connections','connections','حفظ عناوين التكامل المستقبلي');},'حفظت العناوين. لم يفعل الربط المركزي بعد.');break;
}}catch(e){toast(e.message||'تعذر حفظ النموذج',true);}});
$('#app').addEventListener('input',event=>{const el=event.target;try{if(el.closest('#purchase-form'))updatePurchasePreview();if(el.closest('#calc-form')){clearTimeout(draftTimer);draftTimer=setTimeout(updateCalcDraft,180);}if(el.dataset.search==='view'){clearTimeout(searchTimer);searchTimer=setTimeout(()=>{const pos=el.selectionStart;UI.query=el.value;render();const input=$('#view-search');if(input){input.focus();try{input.setSelectionRange(pos,pos);}catch(e){}}},220);}if(el.dataset.search==='global'){clearTimeout(searchTimer);const value=el.value;searchTimer=setTimeout(()=>{UI.query=value;if(route().name!=='orders'){location.hash='#/orders';}else render();setTimeout(()=>{const v=$('#view-search');if(v){v.focus();v.setSelectionRange(v.value.length,v.value.length);}},20);},350);}}catch(e){toast(e.message,true);}});
$('#app').addEventListener('change',async event=>{const el=event.target;try{if(el.closest('#purchase-form')&&el.name==='materialId')updatePurchasePreview(true);if(el.closest('#purchase-form')&&el.name==='purchaseUnit'){const f=el.closest('form'),m=state.materials.find(x=>x.id===f.elements.materialId.value);if(m){const factor=I.convert(m,1,el.value);f.elements.unitCost.value=Number((m.unitCost*factor).toFixed(4));}updatePurchasePreview();}if(el.id==='calc-stock-material'){applyCalcMaterial(el.value);}if(el.hasAttribute('data-branch')){if(el.value!=='all'&&!allowedBranches().some(b=>b.id===el.value))throw new Error('الفرع خارج الصلاحية');UI.branch=el.value;UI.query='';UI.calcMaterialId='';UI.inventoryForm=null;UI.purchaseForm=null;saveSession();render();}if(el.hasAttribute('data-month')){if(!el.value)return;UI.month=el.value;render();}if(el.dataset.upload)await handleUpload(el);if(el.hasAttribute('data-quality')){mutate(()=>M.updateOrder(state,actorId,el.dataset.quality,{qualityPassed:el.checked}),'تم توثيق فحص الجودة');}if(el.id==='review-order-select'){UI.reviewOrderId=el.value;render();}if(el.id==='permission-user'){UI.permissionUser=el.value;render();}if(el.closest('#calc-form')&&el.name==='mode'){updateCalcDraft();render();}if(el.closest('#order-form')&&['branchId','category'].includes(el.name)){const f=$('#order-form');if(el.name==='category'){f.elements.service.innerHTML='<option value="">اختيار خدمة</option>'+(cat(el.value)?.services||[]).map(s=>`<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('');if(!f.dataset.orderId){state.drafts.order=orderDraft(f);persist();}}else if(!f.dataset.orderId){clearTimeout(draftTimer);const d=orderDraft(f);d.clientId='';d.materialId='';d.assignees=[];state.drafts.order=d;persist();render();}}if(el.closest('#order-form')&&el.name==='service'){const f=$('#order-form');if(!f.elements.title.value)f.elements.title.value=el.value;}if(['purchase-form','inventory-form'].includes(el.closest('form')?.id)&&el.name==='branchId'){const f=el.closest('form'),sel=$('select[name=materialId]',f);if(sel)sel.innerHTML=state.materials.filter(m=>m.branchId===el.value).map(m=>`<option value="${m.id}">${esc(m.name)}</option>`).join('');if(f.id==='purchase-form')updatePurchasePreview(true);const source=$('select[name=sourceOrderId]',f);if(source)source.innerHTML='<option value="">بدون ربط بأمر سابق</option>'+orders().filter(o=>o.branchId===el.value).map(o=>`<option value="${o.id}">${esc(o.number)}</option>`).join('');}}catch(e){toast(e.message||'تعذر قراءة الملف',true);}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)){e.preventDefault();$('[data-search=global]')?.focus();}if((e.ctrlKey||e.metaKey)&&e.key==='s'&&$('#order-form')){e.preventDefault();$('#order-form').requestSubmit();}if(e.key==='Escape'&&(UI.menu||UI.notifications)){UI.menu=false;UI.notifications=false;render();}if(e.key==='Enter'&&e.target.matches('article[data-action]'))e.target.click();});
window.addEventListener('hashchange',()=>{UI.menu=false;UI.notifications=false;render();});
window.addEventListener('beforeunload',()=>{try{const f=$('#order-form');if(f&&!f.dataset.orderId){state.drafts.order=orderDraft(f);persist();}}catch(e){}});
window.addEventListener('storage',e=>{if(!CONNECTED&&e.key===STORE&&e.newValue){try{state=M.validateState(JSON.parse(e.newValue));render();toast('تم تحديث البيانات من تبويب آخر على هذا الجهاز');}catch(err){toast('تعذر قراءة تحديث التبويب الآخر',true);}}});

const publicReviewCache=new Map();
function clearAccountUI(){clearTimeout(draftTimer);clearTimeout(searchTimer);Object.assign(UI,{branch:'all',query:'',status:'all',settingsTab:'brand',employeeForm:null,branchForm:null,inventoryForm:null,purchaseForm:null,clientForm:false,formImage:'',formFileName:'',reviewOrderId:'',permissionUser:'',calcMaterialId:'',notifications:false,menu:false});calcResult=null;calcInputs=null;pendingBackup=null;if(platformHandle){platformHandle.destroy();platformHandle=null;}state.drafts={};}
async function applyCentralSnapshot(snapshot){
 clearAccountUI();centralAccount=snapshot.account||null;centralTenant=snapshot.tenant||null;
 if(snapshot.state){state=snapshot.state;state.drafts=await WOTransport.getDrafts();state.settings=state.settings||{};}
 actorId=centralAccount?.kind==='tenant'?centralAccount.userId:'';
 centralBooting=false;saveSession();render();
}
async function centralLogout(){try{await WOTransport.logout();clearAccountUI();centralAccount=null;centralTenant=null;actorId='';$('#print-area').innerHTML='';go('login');render();}catch(e){if(WOTransport.queueInfo().count)go('sync');throw e;}}
async function initCentral(){
 WOTransport.subscribe(event=>{
  if(event.type==='confirmed'||event.type==='rejected'){if(event.state){const f=$('#order-form');if(f&&!f.dataset.orderId)state.drafts.order=orderDraft(f);const drafts=state.drafts;state=event.state;state.drafts=drafts;}render();if(event.message)toast(event.message,event.type==='rejected');else if(event.type==='confirmed')toast('أكد الخادم حفظ العملية');}
  else if(event.type==='authentication'){if(platformHandle){platformHandle.destroy();platformHandle=null;}centralError=event.message||'انتهت الجلسة، سجل الدخول لاستكمال المزامنة';centralAccount=null;actorId='';renderLogin();}
  else if(event.type==='logout'){centralAccount=null;actorId='';}
  else if(event.type==='connection'&&route().name==='sync'||event.type==='lock')render();
 });
 const result=await WOTransport.init();centralAccount=result.account||null;centralTenant=result.tenant||null;centralBooting=false;centralError=result.error||'';
 if(result.state){state=result.state;state.drafts=await WOTransport.getDrafts();actorId=result.account.userId;}
 render();
 if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('/sw.js').catch(()=>{});
}
async function renderCentralFeedback(token){
 const current='#/feedback/'+encodeURIComponent(token);
 if(!publicReviewCache.has(token)){$('#app').innerHTML=WOConnectedUI.publicFeedback({data:null});try{const data=await WOTransport.request('/api/public/reviews/'+encodeURIComponent(token));publicReviewCache.set(token,{...data,token});}catch(e){if(route().name==='feedback')$('#app').innerHTML=WOConnectedUI.publicFeedback({error:e.message});return;}}
 if(route().name!=='feedback'||route().id!==token)return;
 const data=publicReviewCache.get(token);const image=/^data:image\/(jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(data.brand?.logo||'')?data.brand.logo:(WO_ASSETS.appMark||'');
 $('#app').innerHTML=WOConnectedUI.publicFeedback({data,rating:UI.rating,logo:image});
}
async function saveCentralEmployee(form,v){
 if(WOTransport.queueInfo().count)throw new Error('أكمل المزامنة قبل إدارة الحسابات');
 const data={name:cleanText(v.name,'اسم الموظف',80),jobTitle:cleanText(v.jobTitle,'المسمى',80),role:v.role,branchIds:[v.branchId],targetMonthly:validNum(v.targetMonthly,'الهدف',1),active:!!v.active};
 const button=$('button[type=submit]',form);button.disabled=true;
 try{if(form.dataset.id)await WOTransport.request('/api/users/'+encodeURIComponent(form.dataset.id),'PATCH',data);else await WOTransport.request('/api/users','POST',{user:data,email:v.email,password:v.password});if(form.elements.password)form.elements.password.value='';UI.employeeForm=null;await WOTransport.refresh();toast('تم حفظ حساب الموظف على الخادم');}finally{button.disabled=false;}
}
function inventoryContext(){return {state,actorId,branchId:UI.branch,query:UI.query,allowedBranches:allowedBranches(),can:perm,financial:financial(),money,icon:ico,mutate,render,toast,go,legacy:legacyInventoryView,remnantForm:()=>UI.inventoryForm==='remnant'?inventoryForm():'',openRemnant:()=>{UI.inventoryForm='remnant';UI.inventoryTab='remnants';render();},queueInfo:()=>CONNECTED?WOTransport.queueInfo():{count:0,online:true},useCalculator:(materialId,type)=>{UI.calcType=type;applyCalcMaterial(materialId,false);go('calculators/'+type);}};}
function inventoryView(){return globalThis.WOInventoryUI?WOInventoryUI.view(inventoryContext()):legacyInventoryView();}
function calculatorStockPicker(type){if(!I||type==='letters')return '';const list=scoped(state.materials).filter(m=>WOMaterialBindings.supports(m,type));if(UI.calcMaterialId&&!list.some(m=>m.id===UI.calcMaterialId))UI.calcMaterialId='';return `<div class="field mb"><label for="calc-stock-material">اختر خامة من مخزون الفرع</label><select id="calc-stock-material"><option value="">إدخال يدوي للمقاسات والتكلفة</option>${list.map(m=>{const a=I.availability(state,m.id);return `<option value="${esc(m.id)}" ${UI.calcMaterialId===m.id?'selected':''}>${esc(m.sku||m.id)} · ${esc(m.name)} — متاح ${fmt(a.available,2)} ${esc(m.unit)}</option>`;}).join('')}</select><div class="field-note">تنقل بطاقة الخامة مقاسها وتكلفتها. تبقى تكاليف التشغيل والإضاءة الأخرى حسب مدخلاتك. لا تصرف الخامة تلقائيا.</div></div>`;}
function applyCalcMaterial(id,rerender=true){if(!id){UI.calcMaterialId='';if(rerender)render();return;}const m=scoped(state.materials).find(x=>x.id===id);if(!m)throw new Error('الخامة خارج الفرع');const inputs=calcData(),preset=WOMaterialBindings.preset(m,UI.calcType,inputs);UI.calcMaterialId=id;state.drafts.calculators=state.drafts.calculators||{};state.drafts.calculators[UI.calcType]={...inputs,...preset};persist();if(rerender){render();toast(m.costConfirmed===false?'راجع تكلفة هذه الخامة؛ سعر المورد غير مؤكد':'تم نقل بيانات الخامة للحاسبة',m.costConfirmed===false);}}
document.addEventListener('wo-inventory-render',()=>{if(route().name==='inventory')render();});
addEventListener('pageshow',event=>{if(CONNECTED&&event.persisted)location.reload();});
addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
render();
if(CONNECTED)initCentral().catch(e=>{centralBooting=false;centralError=e.message;renderLogin();});
})();

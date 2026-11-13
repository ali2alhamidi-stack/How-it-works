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

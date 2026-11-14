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
  const mark = '<img class="p-mark awamer-platform-mark" src="/assets/awamer-logo.webp" alt="شعار أوامر">';
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
      return '<section class="p-hero"><div><span class="p-eyebrow">أوامر · إدارة المنصة</span><h1>مساحة واضحة لكل منشأة.</h1><p>أدر الاشتراكات والحسابات وحدود الاستخدام من مكان واحد، مع بقاء بيانات كل منشأة مستقلة.</p>'+button(icon('plus')+'إنشاء منشأة','create','light')+'</div><div class="p-hero-art" aria-hidden="true">'+mark+'<span>'+icon('company')+'</span><span>'+icon('shield')+'</span></div></section>'+statCards(s)+'<div class="p-section-head"><div><h2>المنشآت على المنصة</h2><p>أحدث الحسابات المسجلة وحالة وصولها</p></div>'+button('عرض كل المنشآت '+icon('arrow'),'tenants','subtle')+'</div>'+tenantList(true);
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
      container.innerHTML='<div class="platform-shell" dir="rtl"><aside class="p-sidebar"><a class="p-wordmark" href="#/platform" data-p-action="overview">'+mark+'<div><b lang="en" dir="ltr">أوامر<span> / </span></b><small>إدارة المنصة</small></div></a><span class="p-nav-caption">مساحة التحكم</span><nav aria-label="أقسام لوحة المنصة">'+nav.map(([id,label,ic])=>'<button data-p-action="'+id+'" class="p-nav-item '+(model.view===id&&!model.form?'active':'')+'"'+(model.view===id&&!model.form?' aria-current="page"':'')+'>'+icon(ic)+'<span>'+label+'</span></button>').join('')+'</nav><div class="p-sidebar-bottom"><div class="p-platform-badge">'+icon('shield')+' حساب مالك المنصة</div><small>هوية المنصة مستقلة عن هوية كل منشأة.</small></div></aside><main class="p-main"><header class="p-topbar"><div><span class="p-breadcrumb">لوحة المنصة</span><h2>'+esc(model.form?'إدارة الحساب':model.view==='audit'?'سجل العمليات':model.view==='tenants'?'المنشآت والاشتراكات':'نظرة عامة')+'</h2></div><div class="p-top-actions"><span class="p-account"><b>'+esc(account.name||'مالك المنصة')+'</b><small dir="ltr">'+esc(account.email||'')+'</small></span>'+button(icon('refresh')+'<span>تحديث</span>','refresh','icon-label')+button(icon('logout')+'<span>خروج</span>','logout','icon-label')+'</div></header><div class="p-content" aria-busy="'+model.loading+'">'+feedback()+(model.form?formView():model.view==='audit'?auditView():model.view==='tenants'?tenantsView():overview())+'<footer class="p-footer"><b lang="en">Qodynex</b><span>منصة تشغيل المنشآت · بيانات متصلة بالخادم</span></footer></div></main></div>';
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

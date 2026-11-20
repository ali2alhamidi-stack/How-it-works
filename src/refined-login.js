/* Refined connected login, preserving the existing authentication API and validation. */
(function(root){
  'use strict';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=name=>'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(root.WOCatalog?.icons?.[name]||root.WOCatalog?.icons?.grid||'')+'</svg>';
  function login({error='',loading=false}={}){
    const logo=esc(root.WO_ASSETS?.systemLogo||'/assets/awamer-logo.webp');
    const steps=[
      ['orders','استلام الطلب','جميع المتطلبات والمرفقات في مكان واحد'],
      ['production','متابعة التنفيذ','المراحل والموظفون والمواعيد بوضوح'],
      ['check','مراجعة وتسليم','الجودة والتسليم موثقان خطوة بخطوة']
    ];
    return `<div class="login-page central-login awamer-login-v4" dir="rtl">
      <section class="login-form" aria-labelledby="awamer-login-title">
        <div class="login-inner">
          <div class="login-mini-head">
            <div class="login-mini-brand"><img src="${logo}" alt="شعار أوامر"><span>أوامر</span></div>
            <span class="login-secure-chip">${icon('shield')} حساب آمن</span>
          </div>
          <div class="login-overline">مساحة عملك اليومية</div>
          <h1 id="awamer-login-title">أهلا بعودتك</h1>
          <p class="login-description">ادخل إلى حسابك لمتابعة الأوامر والفريق والمراحل حسب صلاحياتك.</p>
          ${error?`<div class="alert-box orange login-error" role="alert">${esc(error)}</div>`:''}
          <form id="central-login-form" class="login-fields" autocomplete="on">
            <div class="field">
              <label for="central-email">البريد الإلكتروني</label>
              <div class="login-input">${icon('users')}
                <input id="central-email" type="email" name="email" dir="ltr" autocomplete="username" inputmode="email" autocapitalize="none" spellcheck="false" maxlength="254" required placeholder="name@company.com">
              </div>
            </div>
            <div class="field">
              <label for="central-password">كلمة المرور</label>
              <div class="login-input">${icon('shield')}
                <input id="central-password" type="password" name="password" dir="ltr" autocomplete="current-password" minlength="10" maxlength="200" required placeholder="••••••••">
                <button type="button" class="login-reveal" data-login-reveal aria-controls="central-password" aria-label="إظهار كلمة المرور" aria-pressed="false" title="إظهار أو إخفاء كلمة المرور">
                  <span class="eye-open">${icon('eye')}</span><span class="eye-off">${icon('eyeOff')}</span>
                </button>
              </div>
              <span id="login-caps-warning" class="login-caps-warning" role="status" hidden>${icon('alert')} مفتاح الأحرف الكبيرة Caps Lock مفعل</span>
            </div>
            <button class="btn primary full login-submit" type="submit" ${loading?'disabled':''}>${loading?'جار التحقق من الحساب...':'دخول إلى مساحة العمل'} ${icon('arrow')}</button>
          </form>
          <div class="login-inline-note">${icon('shield')}<span>تظهر لك الأقسام والبيانات المسموح بها فقط. لا تحفظ كلمات المرور داخل التطبيق.</span></div>
          <p class="login-help">لا تستطيع الدخول؟ تواصل مع مدير منشأتك لإعادة تعيين كلمة المرور.</p>
        </div>
      </section>
      <section class="login-brand" aria-label="تعريف مختصر بنظام أوامر">
        <div>
          <span class="login-hero-tag">${icon('grid')} AWAMER <span aria-hidden="true">·</span> نظام إدارة الأعمال</span>
          <h2>شغلك واضح.<br>وفريقك على نفس الخطوة.</h2>
          <p>من أول طلب وحتى التسليم، تفاصيل التشغيل مرتبة ومتابعتها أسهل من أي وقت.</p>
          <div class="login-workflow">${steps.map(([ic,title,desc])=>`<div class="login-workflow-step"><span class="work-icon">${icon(ic)}</span><div><strong>${title}</strong><small>${desc}</small></div></div>`).join('')}</div>
          <div class="login-brand-foot">واجهة واحدة للإدارة والموظفين على الجوال والكمبيوتر</div>
        </div>
      </section>
    </div>`;
  }
  if(root.WOConnectedUI)root.WOConnectedUI.login=login;
  if(typeof module==='object'&&module.exports)module.exports={login};
  if(typeof document==='undefined')return;
  const app=document.getElementById('app');
  if(!app)return;
  app.addEventListener('click',event=>{
    const control=event.target.closest?.('[data-login-reveal]');
    if(!control||!app.contains(control))return;
    const input=app.querySelector('#central-password');
    if(!input)return;
    const visible=input.type==='password';
    input.type=visible?'text':'password';
    control.setAttribute('aria-pressed',String(visible));
    control.setAttribute('aria-label',visible?'إخفاء كلمة المرور':'إظهار كلمة المرور');
    input.focus({preventScroll:true});
  });
  app.addEventListener('keydown',event=>{
    if(event.target?.id!=='central-password')return;
    const hint=app.querySelector('#login-caps-warning');
    if(hint&&typeof event.getModifierState==='function')hint.hidden=!event.getModifierState('CapsLock');
  });
  app.addEventListener('focusout',event=>{
    if(event.target?.id==='central-password'){
      const hint=app.querySelector('#login-caps-warning');
      if(hint)hint.hidden=true;
    }
  });
})(globalThis);

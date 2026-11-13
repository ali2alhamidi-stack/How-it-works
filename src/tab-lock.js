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

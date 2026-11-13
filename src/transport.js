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

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

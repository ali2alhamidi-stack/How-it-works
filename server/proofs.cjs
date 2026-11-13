'use strict';
const S=require('./security.cjs');
const editableStages=new Set(['draft','approval']);
const significant=['designDataUrl','title','description','width','height','unit','quantity','clientId','materialId'];
const modified=(before,patch)=>significant.some(key=>Object.prototype.hasOwnProperty.call(patch||{},key)&&patch[key]!==before[key]);
function assertUpdate(before,patch){
 if(before.proofRequired&&modified(before,patch)&&!editableStages.has(before.status))
  S.error(409,'PROOF_LOCKED','أعد أمر العمل لمرحلة الاعتماد أو أنشئ أمر تصحيح قبل تعديل التصميم المعتمد');
}
function invalidate(order,before,patch){
 if(!before.proofRequired||!modified(before,patch))return false;
 order.proofToken='';
 order.proofStatus='needs_resend';
 order.proofDecision=null;
 order.designApproved=false;
 return true;
}
function issue(order,force=false){
 if(!editableStages.has(order.status))S.error(409,'PROOF_LOCKED','لا يمكن إرسال تصميم للعميل بعد بدء الإنتاج');
 if(typeof order.designDataUrl!=='string'||!order.designDataUrl.startsWith('data:image/'))S.error(400,'PROOF_MISSING','ارفع صورة التصميم قبل إرسال طلب الاعتماد');
 if(order.proofToken&&!force)return {changed:false,order};
 if(force!==false&&force!==true)S.error(400,'INVALID_FORCE','خيار إعادة الإرسال غير صالح');
 if(!Number.isSafeInteger(order.proofRevision||0)||order.proofRevision<0||order.proofRevision>=1000000)S.error(409,'PROOF_VERSION','إصدارات التصميم تجاوزت الحد');
 order.proofRequired=true;
 order.proofRevision=(order.proofRevision||0)+1;
 order.proofToken=S.random(32);
 order.proofStatus='pending';
 order.proofDecision=null;
 if(!Array.isArray(order.proofHistory))order.proofHistory=[];
 return {changed:true,order};
}
function decide(order,data){
 S.requireObject(data);
 if(!order.proofRequired||order.proofStatus!=='pending'||!order.proofToken)S.error(409,'PROOF_CLOSED','هذا الإصدار من التصميم لم يعد يقبل الرد');
 if(!Number.isInteger(data.revision)||data.revision!==order.proofRevision)S.error(409,'PROOF_STALE','تغير إصدار التصميم، افتح الرابط الجديد');
 if(!['approved','changes_requested'].includes(data.decision))S.error(400,'PROOF_DECISION','اختر الموافقة أو طلب تعديل');
 const name=S.str(data.name??'','الاسم',100,true);
 const comment=S.str(data.comment??'','الملاحظة',2000,true);
 if(data.decision==='changes_requested'&&!comment)S.error(400,'PROOF_COMMENT','اكتب التعديل المطلوب حتى يعرفه فريق التصميم');
 const record={revision:order.proofRevision,decision:data.decision,name,comment,at:new Date().toISOString()};
 order.proofStatus=data.decision;
 order.proofDecision=record;
 if(!Array.isArray(order.proofHistory))order.proofHistory=[];
 order.proofHistory.push(record);
 if(order.proofHistory.length>50)order.proofHistory=order.proofHistory.slice(-50);
 return record;
}
function visible(order){
 return !!(order&&order.proofRequired&&order.proofToken&&['pending','approved','changes_requested'].includes(order.proofStatus)&&editableStages.has(order.status));
}
function publicView(state,order){
 return {brand:{name:state.brand.name,primary:state.brand.primary,secondary:state.brand.secondary,logo:state.brand.logo||''},order:{number:order.number,title:order.title,designDataUrl:order.designDataUrl,width:order.width,height:order.height,unit:order.unit,quantity:order.quantity,revision:order.proofRevision,status:order.proofStatus},decided:order.proofStatus!=='pending'};
}
module.exports={assertUpdate,invalidate,issue,decide,visible,publicView};

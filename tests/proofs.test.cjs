'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const P=require('../server/proofs.cjs');
const art='data:image/png;base64,ZmFrZS1pbWFnZQ==';
const fresh=()=>({id:'job',status:'approval',designDataUrl:art,title:'لوحة',proofRequired:false});
test('proof issuance creates a new unpredictable link and explicit revision',()=>{
 const o=fresh(),r=P.issue(o);
 assert.equal(r.changed,true);assert.equal(o.proofRequired,true);assert.equal(o.proofRevision,1);
 assert.match(o.proofToken,/^[A-Za-z0-9_-]{40,160}$/);assert.equal(o.proofStatus,'pending');
 const token=o.proofToken;
 assert.equal(P.issue(o).changed,false);assert.equal(o.proofToken,token);
 assert.equal(P.issue(o,true).changed,true);assert.notEqual(o.proofToken,token);assert.equal(o.proofRevision,2);
});
test('customer response validates current revision, requires change reason and prevents replay',()=>{
 const o=fresh();P.issue(o);
 assert.throws(()=>P.decide(o,{revision:0,decision:'approved'}),/تغير إصدار التصميم/);
 assert.throws(()=>P.decide(o,{revision:1,decision:'changes_requested',comment:' '}),/التعديل المطلوب/);
 const decision=P.decide(o,{revision:1,decision:'changes_requested',comment:'تعديل لون العنوان',name:'عميل'});
 assert.equal(o.proofStatus,'changes_requested');assert.equal(decision.comment,'تعديل لون العنوان');
 assert.equal(o.proofHistory.length,1);
 assert.throws(()=>P.decide(o,{revision:1,decision:'approved'}),/لم يعد يقبل الرد/);
});
test('revised design expires old link and makes internal design approval pending again',()=>{
 const o=fresh();P.issue(o);P.decide(o,{revision:1,decision:'approved'});
 const old={...o},patch={designDataUrl:'data:image/png;base64,ZmFrZS0y'};
 P.assertUpdate(old,patch);Object.assign(o,patch);o.designApproved=true;
 assert.equal(P.invalidate(o,old,patch),true);assert.equal(o.proofToken,'');assert.equal(o.proofStatus,'needs_resend');
 assert.equal(o.designApproved,false);assert.equal(o.proofHistory.length,1);
 P.issue(o);assert.equal(o.proofRevision,2);
});
test('design changes are locked after production begins and public data is minimal',()=>{
 const o=fresh();P.issue(o);o.status='production';
 assert.throws(()=>P.assertUpdate(o,{width:75}),/مرحلة الاعتماد/);
 assert.equal(P.visible(o),false);
 o.status='approval';
 const view=P.publicView({brand:{name:'منشأة',primary:'#000000',secondary:'#ffffff',logo:''}},o);
 assert.deepEqual(Object.keys(view.order).sort(),['designDataUrl','height','number','quantity','revision','status','title','unit','width'].sort());
 assert.ok(!JSON.stringify(view).includes('salePrice'));
});

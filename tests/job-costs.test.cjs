'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('../src/model.js');
const state=()=>M.seed(new Date('2026-11-13T10:00:00Z'));
test('direct job costs are recorded without duplicate material consumption',()=>{
 const s=state(),order=s.orders.find(o=>o.id==='o8'),before=order.actualCost;
 const item=M.addOrderCost(s,'owner',order.id,{type:'machine',amount:79.50,note:'ساعات تشغيل ليزر على الماكينة'});
 assert.equal(order.actualCost,Math.round((before+79.5)*100)/100);
 assert.equal(item.amount,79.5);assert.equal(order.costItems.length,1);assert.equal(item.reversedAt,null);
 assert.ok(s.audit.some(a=>a.action==='add_order_cost'&&a.entityId===order.id));
 assert.ok(M.validateState(s));assert.equal(order.consumptions.length,s.orders.find(o=>o.id==='o8').consumptions.length);
});
test('reversal requires a documented reason, never deletes the original and cannot repeat',()=>{
 const s=state(),order=s.orders.find(o=>o.id==='o8'),before=order.actualCost;
 const item=M.addOrderCost(s,'owner',order.id,{type:'delivery',amount:33.40,note:'رحلة توصيل'});
 assert.throws(()=>M.reverseOrderCost(s,'owner',order.id,item.id,''),/سبب/);
 const result=M.reverseOrderCost(s,'owner',order.id,item.id,'أدخلت الرحلة على الأمر الخطأ');
 assert.equal(result.id,item.id);assert.equal(order.actualCost,before);
 assert.equal(order.costItems.length,1);assert.ok(item.reversedAt);assert.equal(item.reverseReason,'أدخلت الرحلة على الأمر الخطأ');
 assert.throws(()=>M.reverseOrderCost(s,'owner',order.id,item.id,'تكرار'),/مسبقا/);
 assert.ok(M.validateState(s));
});
test('staff without financial permission cannot create or reverse costs',()=>{
 const s=state(),order=s.orders.find(o=>o.id==='o8'),item=M.addOrderCost(s,'owner',order.id,{type:'labor',amount:25,note:'ساعة تركيب'});
 assert.throws(()=>M.addOrderCost(s,'emp1',order.id,{type:'labor',amount:2,note:'غير مصرح'}),/صلاحية/);
 assert.throws(()=>M.reverseOrderCost(s,'emp1',order.id,item.id,'غير مصرح'),/صلاحية/);
 const manager=s.users.find(u=>u.id==='manager1');manager.permissions={...manager.permissions,view_financials:false};
 assert.throws(()=>M.addOrderCost(s,'manager1',order.id,{type:'labor',amount:9,note:'غير مصرح'}),/صلاحية/);
});
test('validation rejects forged, duplicate or unbalanced direct-cost entries',()=>{
 const s=state(),order=s.orders.find(o=>o.id==='o8');const item=M.addOrderCost(s,'owner',order.id,{type:'finishing',amount:110,note:'لصق وتشطيب'});
 const duplicate=structuredClone(s);duplicate.orders.find(o=>o.id===order.id).costItems.push(structuredClone(item));
 assert.throws(()=>M.validateState(duplicate),/مكرر/);
 const forged=structuredClone(s);forged.orders.find(o=>o.id===order.id).actualCost=0;
 assert.throws(()=>M.validateState(forged),/تكلفة الأمر/);
 const bad=structuredClone(s);bad.orders.find(o=>o.id===order.id).costItems[0].amount=-1;
 assert.throws(()=>M.validateState(bad),/تكلفة التشغيل/);
});

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Model=require('../src/model.js');
const Command=require('../server/commands.cjs');
const {redactState}=require('../server/redaction.cjs');
const Capture=require('../src/command-capture.js');

const seed=()=>Model.seed(new Date('2026-11-20T00:00:00Z'));
const sample={
 id:'svc_night_sign',name:'لوحة مضيئة خارجية',category:'letters',unit:'متر مربع',
 calculator:'letters',basePrice:560,active:true
};

test('tenant service registry persists in existing state schema and can be archived',()=>{
 const state=seed();
 const out=Command.dispatch(state,'owner',{type:'service-catalog.update',payload:{services:[sample]}},{max_branches:5});
 assert.deepEqual(out,{count:1});
 assert.strictEqual(Model.validateState(state),state);
 assert.equal(state.settings.customServices[0].name,sample.name);
 const archived={...sample,active:false};
 Command.dispatch(state,'owner',{type:'service-catalog.update',payload:{services:[archived]}},{max_branches:5});
 assert.equal(state.settings.customServices[0].active,false);
 assert.equal(state.orders.length,12,'historical work orders must remain untouched');
 assert.strictEqual(Model.validateState(JSON.parse(JSON.stringify(state))).settings.customServices[0].id,sample.id);
});

test('only authorized settings managers change the service catalog',()=>{
 const state=seed();
 for(const actor of ['manager1','emp1','buyer']){
  assert.throws(()=>Command.dispatch(state,actor,{type:'service-catalog.update',payload:{services:[sample]}},{max_branches:5}),/صلاحية/);
  assert.equal(state.settings.customServices,undefined);
 }
 Command.dispatch(state,'owner',{type:'service-catalog.update',payload:{services:[sample]}},{max_branches:5});
 assert.throws(()=>Command.dispatch(state,'owner',{type:'service-catalog.update',payload:{services:[{...sample,basePrice:-20}]}},{max_branches:5}),/السعر/);
 assert.throws(()=>Command.dispatch(state,'owner',{type:'service-catalog.update',payload:{services:[{...sample,evil:true}]}},{max_branches:5}),/حقل غير مسموح/);
 assert.throws(()=>Model.validateState({...state,settings:{...state.settings,customServices:[sample,sample]}}),/مكرر/);
});

test('nonfinancial workers can select service names but never receive cost rates',()=>{
 const state=seed();
 Command.dispatch(state,'owner',{type:'service-catalog.update',payload:{services:[sample]}},{max_branches:5});
 const owner=redactState(state,'owner');
 const employee=redactState(state,'emp1');
 assert.equal(owner.settings.customServices[0].basePrice,560);
 assert.equal(employee.settings.customServices[0].name,sample.name);
 assert.equal(employee.settings.customServices[0].basePrice,0);
 assert.equal(employee.settings.customServices[0].calculator,'letters');
 assert.equal(employee.settings.servicePrices,undefined);
});

test('command capture queues catalog changes for central synchronization',()=>{
 const state=seed();
 state.settings.customServices=[{...sample}];
 const recorder=Capture.create(Model,null);
 recorder.start();
 recorder.custom('update_service_catalog','catalog',state);
 const actions=recorder.finish();
 assert.equal(actions.length,1);
 assert.equal(actions[0].type,'service-catalog.update');
 assert.deepEqual(actions[0].payload.services,[sample]);
 actions[0].payload.services[0].name='different';
 assert.equal(state.settings.customServices[0].name,sample.name);
});

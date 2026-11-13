'use strict';
// Execute the actual UI against server-projected snapshots. This checks integration
// without claiming browser layout or authenticated browser end-to-end coverage.
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const Model=require('../src/model.js'),{redactState}=require('../server/redaction.cjs');
const source=name=>fs.readFileSync(path.join(__dirname,'../src',name+'.js'),'utf8');
const modules=['catalog','qr','calculators','model','inventory-engine','material-catalog','material-bindings','command-capture','connected-ui','inventory-ui'];
async function render(userId,route,options={}){
 const full=Model.seed(),user=full.users.find(u=>u.id===userId),account={id:'account-'+userId,userId,tenantId:'tenant-a',kind:'tenant',role:user.role,name:user.name,email:userId+'@example.test'},state=redactState(full,userId);
 const errors=[],listeners={},nodes=new Map();
 const make=()=>({innerHTML:'',textContent:'',className:'',dataset:{},style:{setProperty(){}},classList:{contains:()=>false,add(){},remove(){},toggle(){}},elements:{branchId:{}},addEventListener(type,fn){this.listeners??={};this.listeners[type]=fn;},querySelector(){return null;},querySelectorAll(){return [];}});
 const app=make(),toast=make(),print=make();nodes.set('#app',app);nodes.set('#toast',toast);nodes.set('#print-area',print);
 const document={title:'',body:{...make(),append(){}},documentElement:{style:{setProperty(){}}},addEventListener(type,fn){listeners[type]=fn;},querySelector(selector){if(nodes.has(selector))return nodes.get(selector);if(!/^#[a-zA-Z0-9_-]+$/.test(selector)||!app.innerHTML.includes('id="'+selector.slice(1)+'"'))return null;const n=make();nodes.set(selector,n);return n;},querySelectorAll(){return [];}};
 const queue={count:0,entries:[],blocked:false,online:true,readOnly:!!options.readOnly,readOnlyReason:options.readOnly?'الحساب مفتوح للتعديل في تبويب آخر':''};
 const context={WO_CONFIG:{mode:'connected'},WO_ASSETS:{logo:'/assets/brand.jpg',appMark:'/assets/app-mark.svg'},WOTransport:{init:async()=>({account,state,tenant:{id:'tenant-a',name:state.brand.name}}),getDrafts:async()=>({}),saveDrafts:async()=>{},subscribe(){},queueInfo:()=>queue},document,location:{hash:'#/'+route,href:'http://localhost/#/'+route,protocol:'http:'},navigator:{onLine:true},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},URLSearchParams,FormData:class{constructor(){this[Symbol.iterator]=function*(){};}},HTMLFormElement:class{},console:{error:e=>errors.push(String(e)),log(){}},setTimeout,clearTimeout,addEventListener(type,fn){listeners[type]=fn;},window:{scrollTo(){}},crypto:globalThis.crypto};
 context.window=context;context.scrollTo=()=>{};vm.createContext(context);for(const name of modules)vm.runInContext(source(name),context,{filename:name+'.js'});vm.runInContext(source('app'),context,{filename:'app.js'});await new Promise(setImmediate);await new Promise(setImmediate);
 return {html:app.innerHTML,errors};
}
test('owner central routes render with an actual server snapshot and the shared account page',async()=>{
 for(const route of ['home','orders','order/o1','newOrder','production','catalog','inventory','purchases','clients','employees','employee/emp1','branches','reviews','reports','activity','settings','sync','account']){
  const view=await render('owner',route);assert.deepEqual(view.errors,[],route);assert.ok(!view.html.includes('نحتاج إلى مراجعة هذه الصفحة'),route);assert.ok(view.html.includes('app-shell'),route);
 }
 const account=await render('owner','account');assert.ok(account.html.includes('central-password-form'));assert.ok(account.html.includes('owner@example.test'));
});
test('employee projection renders assigned tasks and own account without finance or company backup controls',async()=>{
 for(const route of ['home','orders','order/o1','myWork','employee/emp1','catalog','account','sync']){
  const view=await render('emp1',route);assert.deepEqual(view.errors,[],route);assert.ok(view.html.includes('app-shell'),route);assert.ok(!view.html.includes('نحتاج إلى مراجعة هذه الصفحة'),route);
  assert.ok(!view.html.includes('data-action="export-backup"'),route);
 }
 const order=await render('emp1','order/o1');assert.ok(!order.html.includes('قيمة البيع الإجمالية'));assert.ok(!order.html.includes('بيع وتكلفة الأمر'));
});
test('manager and buyer projections render their scoped operations; secondary tab has a persistent notice',async()=>{
 for(const [user,route]of [['manager1','orders'],['manager1','employees'],['buyer','purchases'],['buyer','inventory']]){const view=await render(user,route);assert.deepEqual(view.errors,[],user+route);assert.ok(view.html.includes('app-shell'));}
 const view=await render('owner','home',{readOnly:true});assert.ok(view.html.includes('هذا التبويب للقراءة فقط'));assert.ok(view.html.includes('data-action="central-reload"'));
});

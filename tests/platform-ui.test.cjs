'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Platform=require('../src/platform-ui');
const source=require('node:fs').readFileSync(require.resolve('../src/platform-ui'),'utf8');
const account={id:'platform-1',kind:'platform',name:'مالك المنصة',email:'platform@example.test'};
const first={id:'tenant-1',name:'منشأة الطباعة',slug:'print-house',status:'active',maxUsers:10,maxBranches:3,expiresAt:'2027-01-31T23:59:59.999Z',createdAt:'2026-11-01T00:00:00Z',userCount:4,branchCount:2,orderCount:23,ownerEmail:'owner@example.test'};
function fakeRoot(){return {innerHTML:'',handlers:{},confirm:{checked:false},addEventListener(name,fn){this.handlers[name]=fn;},removeEventListener(name,fn){if(this.handlers[name]===fn)delete this.handlers[name];},querySelector(selector){return selector==='[data-p-confirm-check]'?this.confirm:null;}};}
function event(action,id){return {preventDefault(){},target:{closest(){return {dataset:{pAction:action,id}};}}};}
function formEvent(type,fields){const inputs=Object.fromEntries(Object.entries(fields).map(([key,value])=>[key,{value:String(value)}]));const form={dataset:{pForm:type},matches:()=>true,reportValidity:()=>true,elements:{namedItem:name=>inputs[name]}};return {event:{target:form,preventDefault(){}},inputs};}
function fixture(overrides={}){
 const root=fakeRoot(),calls=[],tenants=[{...first}];
 const api=async(path,method,body)=>{calls.push({path,method,body:body&&JSON.parse(JSON.stringify(body))});if(overrides.api)return overrides.api(path,method,body,tenants);if(path==='/api/platform/tenants'&&method==='GET')return {tenants,stats:{total:tenants.length}};if(path==='/api/platform/audit')return {events:[]};return {};};
 const instance=Platform.mount({root,api,account:overrides.account||account,onLogout:overrides.onLogout});return {root,calls,tenants,instance};
}

test('loads actual tenants and derives visible statistics from returned rows',async()=>{
 const f=fixture();await f.instance.ready;assert.deepEqual(f.calls,[{path:'/api/platform/tenants',method:'GET',body:undefined}]);
 assert.match(f.root.innerHTML,/منشأة الطباعة/);assert.match(f.root.innerHTML,/owner@example.test/);assert.match(f.root.innerHTML,/4 \/ 10 مستخدم/);assert.match(f.root.innerHTML,/23 أمر عمل/);assert.match(f.root.innerHTML,/أوامر/);
});

test('denies a tenant account without fetching platform data',async()=>{
 const f=fixture({account:{kind:'tenant'}});await f.instance.ready;assert.equal(f.calls.length,0);assert.match(f.root.innerHTML,/مخصصة لمالك المنصة/);
});

test('escapes untrusted tenant names, owner email and platform account display',async()=>{
 const f=fixture({api:async()=>({tenants:[{...first,name:'<img src=x onerror=alert(1)>',ownerEmail:'"><script>secret</script>'}]})});await f.instance.ready;
 assert.ok(!f.root.innerHTML.includes('<img src=x'));assert.ok(!f.root.innerHTML.includes('<script>'));assert.match(f.root.innerHTML,/&lt;img/);assert.match(f.root.innerHTML,/&lt;script&gt;/);
});

test('create posts the exact contract, never puts the password into rendered saved values',async()=>{
 const f=fixture();await f.instance.ready;await f.root.handlers.click(event('create'));
 const data={name:'شركة جديدة',slug:'new-print',ownerName:'المالك الجديد',ownerEmail:'new@example.test',password:'Transient!Pass123',maxUsers:'12',maxBranches:'4',expiresAt:'2027-06-30',currency:'SAR'};
 const submission=formEvent('create',data);await f.root.handlers.submit(submission.event);
 const call=f.calls.find(c=>c.method==='POST');assert.equal(call.path,'/api/platform/tenants');assert.deepEqual(call.body,{...data,maxUsers:12,maxBranches:4,expiresAt:'2027-06-30T23:59:59.999Z'});
 assert.equal(submission.inputs.password.value,'');assert.ok(!f.root.innerHTML.includes(data.password));assert.match(f.root.innerHTML,/تم إنشاء المنشأة وحساب المالك بنجاح/);assert.equal(f.calls.filter(c=>c.method==='GET').length,2);
});

test('create server failure shows server message, preserves nonsecret draft and clears password',async()=>{
 const f=fixture({api:async(path,method)=>{if(method==='POST')throw {error:{message:'البريد مسجل بالفعل'}};return {tenants:[first]};}});await f.instance.ready;await f.root.handlers.click(event('create'));
 const submission=formEvent('create',{name:'منشأة فاشلة',slug:'failed',ownerName:'مالك',ownerEmail:'exists@example.test',password:'Transient!Pass123',maxUsers:10,maxBranches:3,expiresAt:'2027-04-01',currency:'SAR'});
 await f.root.handlers.submit(submission.event);assert.match(f.root.innerHTML,/البريد مسجل بالفعل/);assert.match(f.root.innerHTML,/منشأة فاشلة/);assert.ok(!f.root.innerHTML.includes('تم إنشاء المنشأة وحساب المالك بنجاح'));assert.ok(!f.root.innerHTML.includes('Transient!Pass123'));assert.equal(submission.inputs.password.value,'');assert.ok(!/name="password"[^>]*value=/.test(f.root.innerHTML));
});

test('reset-owner posts only a transient password and a successful reset never exposes it',async()=>{
 const f=fixture();await f.instance.ready;await f.root.handlers.click(event('reset','tenant-1'));
 const submission=formEvent('reset',{password:'Different!Pass123'});await f.root.handlers.submit(submission.event);
 const call=f.calls.find(c=>c.method==='POST');assert.equal(call.path,'/api/platform/tenants/tenant-1/reset-owner');assert.deepEqual(call.body,{password:'Different!Pass123'});assert.equal(submission.inputs.password.value,'');assert.ok(!f.root.innerHTML.includes('Different!Pass123'));assert.match(f.root.innerHTML,/إلغاء جلساته/);
});

test('suspension requires a distinct inline confirmation and checkbox before sending PATCH',async()=>{
 const f=fixture();await f.instance.ready;await f.root.handlers.click(event('edit','tenant-1'));
 await f.root.handlers.submit(formEvent('edit',{name:'منشأة الطباعة',maxUsers:8,maxBranches:2,expiresAt:'2027-01-31',status:'suspended'}).event);
 assert.equal(f.calls.filter(c=>c.method==='PATCH').length,0);assert.match(f.root.innerHTML,/تأكيد تعليق الوصول/);
 await f.root.handlers.click(event('confirm-suspend'));assert.equal(f.calls.filter(c=>c.method==='PATCH').length,0);assert.match(f.root.innerHTML,/أكد فهم أثر تعليق الوصول أولا/);
 f.root.confirm.checked=true;await f.root.handlers.click(event('confirm-suspend'));
 const call=f.calls.find(c=>c.method==='PATCH');assert.equal(call.path,'/api/platform/tenants/tenant-1');assert.equal(call.body.status,'suspended');assert.equal(call.body.maxUsers,8);assert.match(f.root.innerHTML,/تم تعليق وصول المنشأة/);
});

test('cancelling suspension does not send a write and returns to editing',async()=>{
 const f=fixture();await f.instance.ready;await f.root.handlers.click(event('edit','tenant-1'));
 await f.root.handlers.submit(formEvent('edit',{name:'منشأة الطباعة',maxUsers:10,maxBranches:3,expiresAt:'2027-01-31',status:'suspended'}).event);
 await f.root.handlers.click(event('cancel-suspend'));assert.equal(f.calls.filter(c=>c.method==='PATCH').length,0);assert.ok(!f.root.innerHTML.includes('aria-label="تأكيد تعليق المنشأة"'));assert.match(f.root.innerHTML,/<option value="active" selected/);
});

test('regular edit updates the correct tenant with exact allowed fields',async()=>{
 const f=fixture();await f.instance.ready;await f.root.handlers.click(event('edit','tenant-1'));
 await f.root.handlers.submit(formEvent('edit',{name:'الاسم المعدل',maxUsers:20,maxBranches:5,expiresAt:'2027-05-31',status:'active'}).event);
 const call=f.calls.find(c=>c.method==='PATCH');assert.deepEqual(call.body,{name:'الاسم المعدل',maxUsers:20,maxBranches:5,expiresAt:'2027-05-31T23:59:59.999Z',status:'active'});assert.equal(call.path,'/api/platform/tenants/tenant-1');
});

test('fetch failures display the real server error and never fabricate demo companies',async()=>{
 const f=fixture({api:async()=>{throw new Error('انتهت الجلسة. سجل الدخول مجددا.');}});await f.instance.ready;
 assert.match(f.root.innerHTML,/انتهت الجلسة/);assert.ok(!f.root.innerHTML.includes('منشأة الطباعة'));assert.ok(!f.root.innerHTML.includes('owner@example.test'));assert.match(f.root.innerHTML,/لم تحمل قائمة المنشآت/);assert.ok(!f.root.innerHTML.includes('جار تحميل المنشآت')); 
});

test('audit loads the real endpoint, escapes content and omits sensitive structured keys',async()=>{
 const f=fixture({api:async(path)=>path==='/api/platform/audit'?{events:[{id:'a1',at:'2026-11-01',action:'tenant.update',actorEmail:'platform@example.test',tenantId:'tenant-1',details:{status:'suspended',password:'NeverShown123',csrfToken:'TokenSecret',name:'<script>x</script>'}}]}:{tenants:[first]}});await f.instance.ready;await f.root.handlers.click(event('audit'));
 assert.ok(f.calls.some(c=>c.path==='/api/platform/audit'));assert.match(f.root.innerHTML,/tenant.update/);assert.match(f.root.innerHTML,/suspended/);assert.ok(!f.root.innerHTML.includes('NeverShown123'));assert.ok(!f.root.innerHTML.includes('TokenSecret'));assert.ok(!f.root.innerHTML.includes('<script>'));
});

test('delegated logout calls only the parent and does not overwrite its login view',async()=>{
 let f;f=fixture({onLogout:()=>{f.root.innerHTML='PARENT LOGIN';}});await f.instance.ready;await f.root.handlers.click(event('logout'));
 assert.ok(!f.calls.some(c=>c.path==='/api/logout'));assert.equal(f.root.innerHTML,'PARENT LOGIN');assert.deepEqual(f.root.handlers,{});
});

test('failed logout preserves the console and reports no false sign-out',async()=>{
 let loggedOut=false;const f=fixture({onLogout:async()=>{throw new Error('تعذر إنهاء الجلسة');}});await f.instance.ready;await f.root.handlers.click(event('logout'));
 assert.equal(loggedOut,false);assert.match(f.root.innerHTML,/تعذر إنهاء الجلسة/);assert.ok(f.root.handlers.click);
});

test('destroy detaches every listener and prevents pending refresh from replacing parent content',async()=>{
 let resolve;const f=fixture({api:()=>new Promise(r=>resolve=r)});f.instance.destroy();f.root.innerHTML='NEXT VIEW';resolve({tenants:[first]});await f.instance.ready;
 assert.deepEqual(f.root.handlers,{});assert.equal(f.root.innerHTML,'NEXT VIEW');
});

test('module does not access local/session storage or use blocking popup confirmations',()=>{
 assert.ok(!/\b(localStorage|sessionStorage)\b/.test(source));assert.ok(!/\b(window\.)?(alert|confirm|prompt)\s*\(/.test(source));
});


test('search uses the returned tenant rows and updates result count without losing the search input',async()=>{
 const f=fixture({api:async()=>({tenants:[first,{...first,id:'tenant-2',name:'شركة التغليف',slug:'packaging',ownerEmail:'pack@example.test'}]})});await f.instance.ready;await f.root.handlers.click(event('tenants'));
 const results={innerHTML:''},badge={textContent:''};f.root.querySelector=selector=>selector==='#p-tenant-results'?results:selector==='#p-result-count'?badge:null;
 f.root.handlers.input({target:{matches:()=>true,value:'pack@example.test'}});assert.match(results.innerHTML,/شركة التغليف/);assert.ok(!results.innerHTML.includes('منشأة الطباعة'));assert.equal(badge.textContent,'1 منشأة');
 f.root.handlers.input({target:{matches:()=>true,value:'missing-result'}});assert.match(results.innerHTML,/لا توجد نتائج مطابقة/);assert.equal(badge.textContent,'0 منشأة');
});

test('status filter renders only the matching actual tenant records',async()=>{
 const f=fixture({api:async()=>({tenants:[first,{...first,id:'tenant-2',name:'منشأة معلقة فقط',status:'suspended'}]})});await f.instance.ready;await f.root.handlers.click(event('tenants'));
 f.root.handlers.change({target:{matches:()=>true,value:'suspended'}});assert.match(f.root.innerHTML,/منشأة معلقة فقط/);assert.ok(!f.root.innerHTML.includes('<strong>منشأة الطباعة</strong>'));
});


test('logout without a parent callback makes exactly one logout API request',async()=>{
 const f=fixture();await f.instance.ready;await f.root.handlers.click(event('logout'));
 assert.equal(f.calls.filter(c=>c.path==='/api/logout'&&c.method==='POST').length,1);assert.deepEqual(f.root.handlers,{});
});

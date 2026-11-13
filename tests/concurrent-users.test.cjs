'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createApplication}=require('../server/app.cjs');
const origin='http://orders.test.local';
async function harness(){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wo-concurrency-')),app=createApplication({dbPath:path.join(dir,'db.sqlite'),publicDir:dir,origin,secureCookies:false,bootstrapOwner:{email:'platform@example.test',password:'PlatformPass!2026',name:'مالك المنصة'}});
 const server=http.createServer(app.handler);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port;
 const request=async(route,method='GET',payload,auth)=>{const r=await fetch(url+route,{method,headers:{...(payload===undefined?{}:{'Content-Type':'application/json',Origin:origin}),...(auth?{Cookie:auth.cookie,'X-CSRF-Token':auth.csrf}: {})},body:payload===undefined?undefined:JSON.stringify(payload)});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
 const login=async(email,password)=>{const r=await request('/api/login','POST',{email,password});assert.equal(r.status,200,JSON.stringify(r.data));return {cookie:r.cookie,csrf:r.data.csrfToken};};
 const platform=await login('platform@example.test','PlatformPass!2026');
 const provision=async slug=>{const r=await request('/api/platform/tenants','POST',{name:slug,slug,ownerName:slug+' owner',ownerEmail:slug+'@example.test',password:'TenantPass!2026',maxUsers:6,maxBranches:4,expiresAt:'2099-12-31',currency:'SAR'},platform);assert.equal(r.status,201,JSON.stringify(r.data));return r.data.tenant;};
 const close=async()=>{await new Promise(r=>server.close(r));app.close();fs.rmSync(dir,{recursive:true,force:true});};
 const command=async(auth,baseRevision,requestId,actions)=>request('/api/commands','POST',{baseRevision,requestId,actions},auth);
 return {request,login,provision,command,close};
}
test('two devices on the same tenant revision cannot silently overwrite one another',async()=>{
 const f=await harness();try{
  await f.provision('alpha');
  const left=await f.login('alpha@example.test','TenantPass!2026'),right=await f.login('alpha@example.test','TenantPass!2026');
  const snap=await f.request('/api/state','GET',undefined,left),b=snap.data.state.branches[0].id,rev=snap.data.revision;
  const responses=await Promise.all([f.command(left,rev,'simultaneous_left',[{type:'client.create',payload:{data:{name:'عميل الأول',branchId:b}}}]),f.command(right,rev,'simultaneous_right',[{type:'client.create',payload:{data:{name:'عميل الثاني',branchId:b}}}])]);
  assert.deepEqual(responses.map(x=>x.status).sort(),[200,409]);
  const after=await f.request('/api/state','GET',undefined,left);
  assert.equal(after.data.revision,rev+1);assert.equal(after.data.state.clients.length,1);
 }finally{await f.close();}
});
test('simultaneous work in separate tenant databases is isolated',async()=>{
 const f=await harness();try{
  await Promise.all([f.provision('alpha'),f.provision('beta')]);
  const a=await f.login('alpha@example.test','TenantPass!2026'),b=await f.login('beta@example.test','TenantPass!2026');
  const [sa,sb]=await Promise.all([f.request('/api/state','GET',undefined,a),f.request('/api/state','GET',undefined,b)]);
  const [ra,rb]=await Promise.all([f.command(a,sa.data.revision,'alpha_job',[{type:'client.create',payload:{data:{branchId:sa.data.state.branches[0].id,name:'عميل ألف'}}}]),f.command(b,sb.data.revision,'beta_job',[{type:'client.create',payload:{data:{branchId:sb.data.state.branches[0].id,name:'عميل باء'}}}])]);
  assert.equal(ra.status,200,JSON.stringify(ra.data));assert.equal(rb.status,200,JSON.stringify(rb.data));
  const [aa,bb]=await Promise.all([f.request('/api/state','GET',undefined,a),f.request('/api/state','GET',undefined,b)]);
  assert.deepEqual(aa.data.state.clients.map(c=>c.name),['عميل ألف']);assert.deepEqual(bb.data.state.clients.map(c=>c.name),['عميل باء']);
 }finally{await f.close();}
});

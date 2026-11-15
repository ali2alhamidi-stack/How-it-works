'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const {createApplication}=require('../server/app.cjs');

test('commercial endpoints enforce platform login and CSRF; Meta verifies callback token',async()=>{
 const origin='https://app.example.test';
 const app=createApplication({dbPath:':memory:',origin,secureCookies:false,bootstrapOwner:{email:'platform@tests.example',password:'StrongPlatformPass!2026'},env:{WHATSAPP_VERIFY_TOKEN:'verify-secret-123',MOYASAR_WEBHOOK_SECRET:'long_test_secret_at_least_24_chars'}});
 const server=http.createServer(app.handler);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 async function request(path,method='GET',data,auth={}){
  const response=await fetch(base+path,{method,headers:{...(data===undefined?{}:{Origin:origin,'Content-Type':'application/json'}),...(auth.cookie?{Cookie:auth.cookie}:{}),...(auth.csrf?{'X-CSRF-Token':auth.csrf}:{})},body:data===undefined?undefined:JSON.stringify(data)});
  const raw=await response.text();let body;try{body=JSON.parse(raw);}catch{body=raw;}
  return {status:response.status,body,cookie:response.headers.get('set-cookie')};
 }
 try{
  assert.equal((await request('/api/platform/commercial')).status,401);
  assert.equal((await request('/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=abc123')).status,403);
  const verified=await request('/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=verify-secret-123&hub.challenge=abc123');
  assert.equal(verified.status,200);assert.equal(verified.body,'abc123');
  const untrustedPayment=await fetch(base+'/api/webhooks/moyasar/bill_unknown/'+'0'.repeat(64),{method:'POST',headers:{'Content-Type':'text/plain'},body:'callback'}); 
  assert.equal(untrustedPayment.status,403);
  const login=await request('/api/login','POST',{email:'platform@tests.example',password:'StrongPlatformPass!2026'});
  assert.equal(login.status,200);
  const auth={cookie:login.cookie.split(';')[0],csrf:login.body.csrfToken};
  const snap=await request('/api/platform/commercial','GET',undefined,auth);
  assert.equal(snap.status,200);
  assert.equal(snap.body.configured.payments,false);
  const tenant=await request('/api/platform/tenants','POST',{name:'Shop',slug:'shop',ownerName:'Ali',ownerEmail:'tenant@tests.example',password:'StrongTenantPass!2026',maxUsers:5,maxBranches:2,expiresAt:'2099-12-31',currency:'SAR'},auth);
  assert.equal(tenant.status,201);
  const data={tenantId:tenant.body.tenant.id,phone:'+966500000000',consentAt:'2026-11-15T00:00:00.000Z'};
  assert.equal((await request('/api/platform/commercial/contact','POST',data,{cookie:auth.cookie})).status,403);
  assert.equal((await request('/api/platform/commercial/contact','POST',data,auth)).status,200);
  assert.equal((await request('/api/platform/commercial','GET',undefined,auth)).body.contacts.length,1);
  assert.equal((await request('/api/platform/commercial/invoices','POST',{tenantId:tenant.body.tenant.id,requestId:'request_123',amountMinor:1000,currency:'SAR',days:30},auth)).status,503);
 }finally{
  await new Promise(resolve=>server.close(resolve));
  app.close();
 }
});

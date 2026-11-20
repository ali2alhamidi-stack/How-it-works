'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {createApplication}=require('../server/app.cjs');
const ORIGIN='http://documents-test.example.test';
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4a6qMAAAAASUVORK5CYII=';

async function start(){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'awamer-doc-http-'));
 const app=createApplication({dbPath:path.join(dir,'test.sqlite'),origin:ORIGIN,publicDir:dir,secureCookies:false,
  bootstrapOwner:{email:'platform@documents.test',name:'مالك المنصة',password:'Platform!2026Secure'}});
 const server=http.createServer(app.handler);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 async function send(url,method='GET',payload,auth={}){
  const res=await fetch(base+url,{method,headers:{...(payload!==undefined?{'Content-Type':'application/json',Origin:ORIGIN}:{}),
   ...(auth.cookie?{Cookie:auth.cookie}:{}),...(auth.csrf?{'X-CSRF-Token':auth.csrf}: {})},
   body:payload===undefined?undefined:JSON.stringify(payload)});
  const raw=await res.text();let data;try{data=JSON.parse(raw)}catch{data=raw}
  return {status:res.status,data,headers:res.headers};
 }
 async function login(email,password){
  const res=await send('/api/login','POST',{email,password});
  assert.equal(res.status,200,JSON.stringify(res.data));
  return {cookie:res.headers.get('set-cookie').split(';')[0],csrf:res.data.csrfToken};
 }
 async function close(){
  await new Promise(resolve=>server.close(resolve));
  app.close();fs.rmSync(dir,{recursive:true,force:true});
 }
 return {send,login,close};
}
test('interactive quote publishes a signed customer offer and converts acceptance into one work order',async()=>{
 const f=await start();
 try{
  const platform=await f.login('platform@documents.test','Platform!2026Secure');
  const provision=await f.send('/api/platform/tenants','POST',
   {name:'مطبعة اختبارية',slug:'documentstest',ownerName:'مالك المنشأة',ownerEmail:'owner@documents.test',
    password:'TenantOwner!2026',maxUsers:5,maxBranches:2,expiresAt:'2099-12-31',currency:'SAR'},platform);
  assert.equal(provision.status,201,JSON.stringify(provision.data));
  const owner=await f.login('owner@documents.test','TenantOwner!2026');
  const snapshot=await f.send('/api/state','GET',undefined,owner);
  assert.equal(snapshot.status,200);
  const branchId=snapshot.data.state.branches[0].id;
  const created=await f.send('/api/commands','POST',{
   requestId:'client_doc_1',baseRevision:snapshot.data.revision,
   actions:[{type:'client.create',payload:{data:{branchId,name:'عميل اختبار',phone:'0501112222',company:'تجارب'}}}]
  },owner);
  assert.equal(created.status,200,JSON.stringify(created.data));
  const clientId=created.data.state.clients[0].id;
  const quote=await f.send('/api/v3/documents/quote','POST',{
   requestId:'quote_doc_1',branchId,clientId,title:'لوحة تجريبية متعددة البنود',description:'إنشاء لوحة بدقة معتمدة',
   category:'letters',priority:'high',
   dueAt:new Date(Date.now()+14*86400000).toISOString(),
   expiresAt:new Date(Date.now()+7*86400000).toISOString(),
   lines:[{name:'لوحة كلادينج',quantity:2,unit:'قطعة',unitAmountMinor:12000,widthMm:1000,heightMm:900,
     editableQuantity:true,minQuantity:1,maxQuantity:4,specs:{material:'كلادينج'}}],
  },owner);
  assert.equal(quote.status,201,JSON.stringify(quote.data));
  assert.equal(quote.data.totalAmountMinor,24000);
  const list=await f.send('/api/v3/documents','GET',undefined,owner);
  assert.equal(list.status,200);
  assert.ok(list.data.documents.some(d=>d.id===quote.data.documentId));
  const publish=await f.send('/api/v3/documents/'+quote.data.documentId+'/publish','POST',{},owner);
  assert.equal(publish.status,201,JSON.stringify(publish.data));
  const token=publish.data.url.split('/').pop();
  assert.match(token,/^[a-zA-Z0-9_-]{42,44}$/);
  const publicView=await f.send('/api/public/documents/'+token);
  assert.equal(publicView.status,200,JSON.stringify(publicView.data));
  const denied=await f.send('/api/public/documents/'+token+'/accept','POST',{
   requestId:'accept_no_consent',signerName:'عميل اختبار',signatureDataUrl:png,consent:false
  });
  assert.equal(denied.status,400);
  const accepted=await f.send('/api/public/documents/'+token+'/accept','POST',{
   requestId:'accept_doc_1',tierKey:'standard',signerName:'عميل اختبار',signatureDataUrl:png,consent:true
  });
  assert.equal(accepted.status,201,JSON.stringify(accepted.data));
  assert.equal(accepted.data.accepted,true);
  assert.equal(accepted.data.totalAmountMinor,24000);
  const replay=await f.send('/api/public/documents/'+token+'/accept','POST',{
   requestId:'accept_doc_1',tierKey:'standard',signerName:'عميل اختبار',signatureDataUrl:png,consent:true
  });
  assert.equal(replay.status,201);
  assert.equal(replay.data.replayed,true);
  const orders=await f.send('/api/state','GET',undefined,owner);
  assert.equal(orders.status,200);
  assert.equal(orders.data.state.orders.length,1);
  assert.equal(orders.data.state.orders[0].salePrice,240);
  assert.equal(orders.data.state.orders[0].clientId,clientId);
  assert.ok(accepted.data.workshopUrl);
  assert.ok(accepted.data.trackingUrl);
 }finally{await f.close();}
});

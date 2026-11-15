'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {Readable}=require('node:stream');
const {createStore}=require('../server/store.cjs');
const {createCommercial}=require('../server/commercial.cjs');

const now=()=>new Date('2026-11-15T12:00:00.000Z');
function fixture(expiresAt='2026-11-19',extraEnv={},fetchImpl=async()=>{throw Error('network disabled in test');}){
 const store=createStore(':memory:');
 const owner=store.createPlatformOwner({email:'platform@test.example',password:'VerySecure!2026Password'});
 const created=store.provision({name:'Test Print Shop',slug:'test-press',ownerName:'Tenant Owner',ownerEmail:'tenant@test.example',password:'SecureTenant!2026',maxUsers:5,maxBranches:2,expiresAt,currency:'SAR'},owner.id);
 const env={MOYASAR_SECRET_KEY:'sk_test_EXAMPLEonly',MOYASAR_WEBHOOK_SECRET:'test_webhook_secret_at_least_24_chars',...extraEnv};
 const commercial=createCommercial({store,origin:'https://awamer-app-production.up.railway.app',env,fetchImpl,clock:now});
 return {store,owner,tenant:created.tenant,env,commercial};
}
const response=(data,status=200)=>({ok:status>=200&&status<300,status,async json(){return data;}});

test('Moyasar invoice idempotency, amount checks and one-time entitlement extension',async()=>{
 let invoicesCreated=0,remoteReference='';
 const remoteInvoice={id:'demo_invoice_12345678',url:'https://checkout.moyasar.com/invoices/demo_invoice_12345678',amount:19900,currency:'SAR'};
 const fetchImpl=async(url,options)=>{
  assert.match(url,/^https:\/\/api\.moyasar\.com\/v1\/invoices/);
  if(options.method==='POST'){
   invoicesCreated++;
   const body=JSON.parse(options.body);
   remoteReference=body.metadata.awamer_invoice_id;
   assert.equal(body.amount,19900);
   assert.match(body.callback_url,/^https:\/\/awamer-app-production\.up\.railway\.app\/api\/webhooks\/moyasar\/bill_/);
   return response(remoteInvoice);
  }
  return response({...remoteInvoice,status:'paid',metadata:{awamer_invoice_id:remoteReference}});
 };
 const f=fixture('2026-11-30',{},fetchImpl);
 try{
  const data={tenantId:f.tenant.id,requestId:'ui_request_1',amountMinor:19900,days:30,currency:'SAR'};
  const inv=await f.commercial.createInvoice(data,f.owner.id);
  assert.equal(inv.status,'pending');
  const replay=await f.commercial.createInvoice(data,f.owner.id);
  assert.equal(replay.id,inv.id);
  assert.equal(invoicesCreated,1);
  await assert.rejects(f.commercial.createInvoice({...data,amountMinor:1000},f.owner.id),{code:'REQUEST_ID_REUSED'});
  assert.equal(f.store.getTenant(f.tenant.id).expires_at,'2026-11-30');
  await assert.rejects(f.commercial.verifyPaymentWebhook(inv.id,'malicious'),{code:'WEBHOOK_DENIED'});
  const token=crypto.createHmac('sha256',f.env.MOYASAR_WEBHOOK_SECRET).update(inv.id).digest('hex');
  const result=await f.commercial.verifyPaymentWebhook(inv.id,token);
  assert.equal(result.invoice.status,'paid');
  assert.equal(f.store.getTenant(f.tenant.id).expires_at,'2026-12-30');
  await f.commercial.verifyPaymentWebhook(inv.id,token);
  assert.equal(f.store.getTenant(f.tenant.id).expires_at,'2026-12-30');
  assert.equal(f.store.db.prepare("SELECT count(*) AS n FROM platform_audit WHERE action='subscription_paid'").get().n,1);
 }finally{f.store.close();}
});

test('Moyasar non-paid invoice or amount mismatch never grants access',async()=>{
 const fetchImpl=async(url,options)=>{
  if(options.method==='POST')return response({id:'unpaid_invoice_123',url:'https://checkout.moyasar.com/invoices/a',amount:1000,currency:'SAR'});
  return response({id:'unpaid_invoice_123',status:'paid',amount:999,currency:'SAR'});
 };
 const f=fixture('2026-11-30',{},fetchImpl);
 try{
  const inv=await f.commercial.createInvoice({tenantId:f.tenant.id,requestId:'ui_request_2',amountMinor:1000,currency:'SAR',days:30},f.owner.id);
  await assert.rejects(f.commercial.reconcileInvoice(inv.id),{code:'PAYMENT_MISMATCH'});
  assert.equal(f.store.getTenant(f.tenant.id).expires_at,'2026-11-30');
 }finally{f.store.close();}
});

test('WhatsApp requires consent, queues one reminder and does not duplicate confirmed send',async()=>{
 let sends=0;
 const extra={WHATSAPP_ENABLE_SENDING:'true',WHATSAPP_ACCESS_TOKEN:'test_access',WHATSAPP_PHONE_NUMBER_ID:'1234567890',WHATSAPP_GRAPH_VERSION:'v23.0',WHATSAPP_EXPIRY_TEMPLATE:'subscription_expiring',WHATSAPP_LANGUAGE:'ar',WHATSAPP_APP_SECRET:'app_secret_test',WHATSAPP_VERIFY_TOKEN:'verify_token_test'};
 const f=fixture('2026-11-19',extra,async(url,opts)=>{
  assert.match(url,/^https:\/\/graph\.facebook\.com\//);
  assert.equal(opts.method,'POST');
  sends++;
  return response({messages:[{id:'wamid.demo.123'}]});
 });
 try{
  assert.equal(f.commercial.queueReminders(),0);
  assert.throws(()=>f.commercial.saveContact({tenantId:f.tenant.id,phone:'0500000000',consentAt:now().toISOString()}),{code:'PHONE_INVALID'});
  f.commercial.saveContact({tenantId:f.tenant.id,phone:'+966500000000',consentAt:now().toISOString()});
  assert.equal(f.commercial.queueReminders(),1);
  assert.equal(f.commercial.queueReminders(),0);
  assert.deepEqual(await f.commercial.dispatchNotifications(),{sent:1,needsReview:0});
  assert.equal(sends,1);
  assert.equal((await f.commercial.dispatchNotifications()).sent,0);
  assert.equal(f.commercial.listNotifications,undefined);
  let outbox=f.commercial.snapshot().notifications;
  assert.equal(outbox[0].status,'sent');
  assert.equal(outbox[0].messageId,'wamid.demo.123');
  const challenge=f.commercial.verifyWhatsApp(new URLSearchParams({'hub.mode':'subscribe','hub.verify_token':'verify_token_test','hub.challenge':'12345'}));
  assert.equal(challenge,'12345');
  const payload={entry:[{changes:[{value:{statuses:[{id:'wamid.demo.123',status:'delivered'}]}}]}]};
  const raw=Buffer.from(JSON.stringify(payload));
  const signature='sha256='+crypto.createHmac('sha256',extra.WHATSAPP_APP_SECRET).update(raw).digest('hex');
  const req=Readable.from([raw]);req.headers={'x-hub-signature-256':signature};
  assert.deepEqual(await f.commercial.receiveWhatsApp(req),{ok:true});
  outbox=f.commercial.snapshot().notifications;
  assert.equal(outbox[0].status,'delivered');
  f.commercial.saveContact({tenantId:f.tenant.id,revoke:true});
  assert.equal(f.commercial.queueReminders(),0);
 }finally{f.store.close();}
});


test('Revoking WhatsApp consent cancels queued notification atomically',()=>{
 const extra={WHATSAPP_ENABLE_SENDING:'true',WHATSAPP_ACCESS_TOKEN:'test',WHATSAPP_PHONE_NUMBER_ID:'1234567890',WHATSAPP_GRAPH_VERSION:'v23.0',WHATSAPP_EXPIRY_TEMPLATE:'subscription_expiring',WHATSAPP_APP_SECRET:'secret',WHATSAPP_VERIFY_TOKEN:'token'};
 const f=fixture('2026-11-19',extra);
 try {
  f.commercial.saveContact({tenantId:f.tenant.id,phone:'+966500000000',consentAt:now().toISOString()});
  assert.equal(f.commercial.queueReminders(),1);
  assert.equal(f.commercial.snapshot().notifications[0].status,'queued');
  f.commercial.saveContact({tenantId:f.tenant.id,revoke:true});
  assert.equal(f.commercial.snapshot().notifications[0].status,'cancelled');
 } finally { f.store.close(); }
});

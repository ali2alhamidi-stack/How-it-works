#!/usr/bin/env node
'use strict';
// Explicit development fixture only. Production main.cjs never creates demo accounts.
const path=require('node:path');
const fs=require('node:fs');
const {createStore}=require('../server/store.cjs');
const {startServer}=require('../server/main.cjs');
const S=require('../server/security.cjs');
const M=require('../src/model.js');
const dbPath=process.env.DEV_DB_PATH||path.join(__dirname,'../data/development.sqlite');
const productionDefault=path.resolve(process.env.DB_PATH||path.join(__dirname,'../data/work-orders.sqlite'));
if(path.resolve(dbPath)===productionDefault){console.error('Development database must be isolated from DB_PATH / the production database.');process.exit(1);}
const platformEmail='platform@demo.local',platformPassword='PlatformDemo!2026',tenantPassword='ArtPlusDemo!2026';
const store=createStore(dbPath);let tenantId;
try{let platform=store.db.prepare('SELECT * FROM accounts WHERE email=?').get(platformEmail);if(!platform){store.createPlatformOwner({email:platformEmail,password:platformPassword,name:'مالك المنصة التجريبي'});platform=store.db.prepare('SELECT * FROM accounts WHERE email=?').get(platformEmail);}let tenant=store.db.prepare("SELECT * FROM tenants WHERE slug='artplus-demo'").get();if(!tenant){const created=store.provision({name:'آرت بلس للطباعة',slug:'artplus-demo',ownerName:'عبدالله العتيبي',ownerEmail:'owner@demo.local',password:tenantPassword,maxUsers:25,maxBranches:10,expiresAt:'2099-12-31',currency:'SAR'},platform.id);tenantId=created.tenant.id;const state=M.seed();state.stockReservations=[];state.stockMovements=[];for(const o of state.orders){o.reviewToken=S.random();const review=state.reviews.find(r=>r.orderId===o.id);if(review)review.token=o.reviewToken;}store.transaction(()=>{store.db.prepare('UPDATE accounts SET user_id=? WHERE tenant_id=?').run('owner',tenantId);for(const u of state.users.filter(u=>u.id!=='owner'))store.db.prepare('INSERT INTO accounts(id,email,name,kind,tenant_id,user_id,password_hash,created_at) VALUES(?,?,?,?,?,?,?,?)').run(S.id('account'),u.id+'@demo.local',u.name,'tenant',tenantId,u.id,S.passwordHash(tenantPassword),new Date().toISOString());store.saveState(tenantId,state,1);store.audit(platform.id,'seed_development',tenantId,'بيانات وأسماء وحسابات تجريبية صريحة');});}else tenantId=tenant.id;}finally{store.close();}
console.log('DEVELOPMENT ONLY — isolated demo database: '+dbPath);
console.log('Platform: '+platformEmail+' / '+platformPassword);
console.log('Tenant owner: owner@demo.local / '+tenantPassword);
console.log('Staff: manager1@demo.local, emp1@demo.local, emp2@demo.local, emp3@demo.local, buyer@demo.local / '+tenantPassword);
const port=Number(process.env.PORT||4173),host=process.env.HOST||'127.0.0.1';
const app=startServer({dbPath,port,host,origin:process.env.APP_ORIGIN||process.env.ORIGIN||`http://${host==='0.0.0.0'?'localhost':host}:${port}`,secureCookies:process.env.SECURE_COOKIES==='true'});
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>{app.stop();setTimeout(()=>process.exit(0),1000).unref();});

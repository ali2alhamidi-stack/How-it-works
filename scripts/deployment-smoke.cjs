#!/usr/bin/env node
'use strict';
// Read-only production smoke check. It does not create accounts or modify data.
const assert=require('node:assert/strict');
async function check(url,{fetchImpl=globalThis.fetch,allowHttpLocal=false}={}){
 const base=new URL(url);
 if(base.protocol!=='https:'&&!(allowHttpLocal&&base.protocol==='http:'&&['localhost','127.0.0.1'].includes(base.hostname)))throw Error('A public deployment must use HTTPS');
 if(base.username||base.password||base.search||base.hash)throw Error('Use the application origin URL without credentials or query parameters');
 const checks=[];
 async function get(route){const r=await fetchImpl(new URL(route,base),{redirect:'error',signal:AbortSignal.timeout(10000)});return r;}
 const root=await get('/');if(!root.ok)throw Error('Application shell unavailable');const html=await root.text();
 assert.match(html,/<html lang="ar" dir="rtl">/);checks.push('Arabic RTL page');
 const meta=await get('/manifest.webmanifest');assert.ok(meta.ok);const manifest=await meta.json();assert.equal(manifest.display,'standalone');checks.push('Installable PWA manifest');
 const secure=await get('/api/session');assert.equal(secure.status,401);checks.push('Unauthenticated session access denied');
 const state=await get('/api/state');assert.equal(state.status,401);checks.push('Unauthenticated tenant data denied');
 for(const p of ['/proof.html','/proof-center.html']){const res=await get(p);assert.ok(res.ok);checks.push(p+' reachable');}
 return {origin:base.origin,ok:true,checks};
}
if(require.main===module){
 if(process.argv.includes('--help')){console.log('Usage: node scripts/deployment-smoke.cjs https://orders.example.com');process.exit(0);}
 const target=process.argv[2];if(!target)throw Error('Supply a public HTTPS origin');
 check(target).then(out=>console.log(JSON.stringify(out,null,2))).catch(e=>{console.error('Pre-launch smoke check failed: '+e.message);process.exitCode=1;});
}
module.exports={check};

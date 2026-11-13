'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{check}=require('../scripts/deployment-smoke.cjs');
test('public smoke check enforces TLS and no credentials',async()=>{await assert.rejects(check('http://example.com'),/HTTPS/);await assert.rejects(check('https://user:secret@example.com'),/credentials/);});
test('mock live host passes only if session and tenant data are private',async()=>{
 const fetchImpl=async(url)=>{const p=new URL(url).pathname;return {status:p.startsWith('/api/')?401:200,ok:!p.startsWith('/api/'),text:async()=>'<html lang="ar" dir="rtl"></html>',json:async()=>({display:'standalone'})};};
 const x=await check('https://orders.example.com',{fetchImpl});assert.ok(x.ok);assert.equal(x.checks.length,6);
});
test('exposed tenant state fails public prelaunch smoke',async()=>{const fetchImpl=async(url)=>({status:200,ok:true,text:async()=>'<html lang="ar" dir="rtl"></html>',json:async()=>({display:'standalone'})});await assert.rejects(check('https://orders.example.com',{fetchImpl}));});

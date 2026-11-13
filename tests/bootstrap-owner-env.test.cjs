'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {bootstrapOwnerFromEnv}=require('../server/main.cjs');
test('first owner bootstrap must provide both private credentials',()=>{
 assert.equal(bootstrapOwnerFromEnv({}),undefined);
 assert.throws(()=>bootstrapOwnerFromEnv({AWAMER_BOOTSTRAP_OWNER_EMAIL:'a@example.com'}),/together/);
 assert.throws(()=>bootstrapOwnerFromEnv({AWAMER_BOOTSTRAP_OWNER_PASSWORD:'secret'}),/together/);
 const a=bootstrapOwnerFromEnv({AWAMER_BOOTSTRAP_OWNER_EMAIL:'owner@example.com',AWAMER_BOOTSTRAP_OWNER_PASSWORD:'temporary-strong-secret'});
 assert.equal(a.email,'owner@example.com');assert.equal(a.name,'مالك منصة أوامر');assert.equal(a.password,'temporary-strong-secret');
});

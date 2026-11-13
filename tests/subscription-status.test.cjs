'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{evaluate}=require('../scripts/subscription-status.cjs');
test('expiry reminders classify active tenants only and never renew automatically',()=>{
 const now=Date.UTC(2026,10,14,12,0,0),rows=[{id:'a',name:'A',status:'active',expires_at:'2026-11-15'},{id:'b',name:'B',status:'active',expires_at:'2026-11-30'},{id:'c',name:'C',status:'suspended',expires_at:'2026-11-14'},{id:'d',name:'D',status:'active',expires_at:'2026-11-13'}];
 const copy=structuredClone(rows),alerts=evaluate(rows,now);
 assert.deepEqual(alerts.map(x=>x.id),['d','a']);assert.equal(alerts[0].severity,'expired');assert.equal(alerts[1].severity,'upcoming');assert.deepEqual(rows,copy);
});
test('invalid expiration cannot silently become a valid reminder',()=>{assert.throws(()=>evaluate([{id:'x',name:'X',status:'active',expires_at:'invalid'}]),/Invalid/);});

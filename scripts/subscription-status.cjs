#!/usr/bin/env node
'use strict';
// Read-only renewal scan. Outputs alerts to the operator; does not charge customers.
const path=require('node:path');
function evaluate(tenants,now=Date.now(),withinDays=7){
 if(!Array.isArray(tenants))throw Error('Expected subscription records');
 return tenants.filter(t=>t.status==='active'&&t.expires_at).map(t=>{
 const raw=String(t.expires_at),date=new Date(raw.length===10?raw+'T23:59:59.999Z':raw),time=date.getTime();
 if(!Number.isFinite(time))throw Error('Invalid tenant expiration');
 const days=Math.ceil((time-now)/86400000);
 return {id:t.id,name:t.name,expiresAt:raw,daysRemaining:days,severity:days<=0?'expired':days<=1?'urgent':'upcoming'};
 }).filter(x=>x.daysRemaining<=withinDays).sort((a,b)=>a.daysRemaining-b.daysRemaining);
}
function run(){
 const {DatabaseSync}=require('node:sqlite'),dbPath=process.env.DB_PATH||path.resolve(__dirname,'../data/work-orders.sqlite');
 const db=new DatabaseSync(dbPath,{readOnly:true});
 try{const rows=db.prepare("SELECT id,name,status,expires_at FROM tenants ORDER BY expires_at ASC").all();const alerts=evaluate(rows);process.stdout.write(JSON.stringify({checkedAt:new Date().toISOString(),alertCount:alerts.length,alerts},null,2)+'\n');}
 finally{db.close();}
}
if(require.main===module){try{run();}catch(e){console.error('Subscription scan failed: '+e.message);process.exitCode=1;}}
module.exports={evaluate};

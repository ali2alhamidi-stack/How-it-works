'use strict';
// Opt-in-only WhatsApp Business Cloud API utility template adapter.
// It never sends without both explicit consent and send:true.
function validate(payload){
 if(!payload||!/^\+[1-9]\d{7,14}$/.test(payload.to||''))throw Error('Recipient must be E.164');
 if(!payload.consentAt||!Number.isFinite(Date.parse(payload.consentAt)))throw Error('Recorded opt-in consent is required');
 if(!/^[a-z0-9_]{2,512}$/.test(payload.template||''))throw Error('Use an approved template name');
 if(!/^[a-z]{2}(?:_[A-Z]{2})?$/.test(payload.language||'ar'))throw Error('Invalid template language');
 const vars=payload.parameters||[];if(!Array.isArray(vars)||vars.length>10||vars.some(x=>typeof x!=='string'||x.length>1024))throw Error('Invalid template parameters');
 return vars;
}
async function sendTemplate(payload,{env=process.env,fetchImpl=globalThis.fetch,send=false}={}){
 const params=validate(payload);
 if(!send)return {sent:false,dryRun:true,template:payload.template,parameterCount:params.length};
 const token=env.WHATSAPP_ACCESS_TOKEN,phoneId=env.WHATSAPP_PHONE_NUMBER_ID,version=env.WHATSAPP_GRAPH_VERSION;
 if(!token||!phoneId||!version)throw Error('WhatsApp Business credentials and Graph version are not configured');
 if(!/^\d{6,30}$/.test(phoneId)||!/^v\d{1,2}\.\d{1,2}$/.test(version))throw Error('Invalid WhatsApp Graph API configuration');
 const body={messaging_product:'whatsapp',to:payload.to.replace(/^\+/,''),type:'template',template:{name:payload.template,language:{code:payload.language||'ar'},...(params.length?{components:[{type:'body',parameters:params.map(text=>({type:'text',text}))}]}:{})}};
 if(typeof fetchImpl!=='function')throw Error('Fetch is unavailable');
 const res=await fetchImpl('https://graph.facebook.com/'+version+'/'+phoneId+'/messages',{method:'POST',headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
 if(!res.ok)throw Error('WhatsApp provider rejected template request (HTTP '+res.status+')');
 const response=await res.json();const id=response?.messages?.[0]?.id;
 if(typeof id!=='string'||!id)throw Error('WhatsApp provider did not confirm a message ID');
 return {sent:true,messageId:id};
}
module.exports={validate,sendTemplate};

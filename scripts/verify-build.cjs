#!/usr/bin/env node
'use strict';
// Validate the deliverable, including the boundary that keeps private API data
// out of the service worker cache. This does not claim device installation QA.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'public');
const read=name=>fs.readFileSync(path.join(dir,name),'utf8');
function present(url){assert.ok(url.startsWith('/')&&!url.includes('..'),'Expected a local application asset: '+url);const file=path.join(dir,url);assert.ok(fs.statSync(file).isFile(),'Missing asset: '+url);return file;}
async function main(){
 const html=read('index.html');assert.match(html,/<html lang="ar" dir="rtl">/);assert.ok(!html.includes('__SCRIPTS__')&&!html.includes('__STYLES__'),'Unreplaced build marker');
 const scriptTags=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];assert.equal(scriptTags.length,1);assert.equal(scriptTags[0][2].trim(),'','Central CSP must not need inline script');
 const jsUrl=scriptTags[0][1].match(/src="([^"]+)"/)?.[1];assert.ok(jsUrl);const js=fs.readFileSync(present(jsUrl),'utf8');assert.match(js,/globalThis\.WO_CONFIG=\{"mode": "connected"/);
 const cssUrl=html.match(/href="(\/styles-[a-f0-9]+\.css)"/)?.[1];assert.ok(cssUrl);const css=fs.readFileSync(present(cssUrl),'utf8');
 for(const [url,data,prefix,extension]of [[jsUrl,js,'app','js'],[cssUrl,css,'styles','css']])assert.equal(url,`/${prefix}-${crypto.createHash('sha256').update(data).digest('hex').slice(0,16)}.${extension}`,'Content hash differs from filename');
 for(const tag of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(\/[^"?#]+)"/g))present(tag[1]);
 for(const ref of css.matchAll(/url\((\/assets\/[^)]+)\)/g))present(ref[1]);
 const manifest=JSON.parse(read('manifest.webmanifest'));assert.equal(manifest.lang,'ar');assert.equal(manifest.dir,'rtl');assert.equal(manifest.display,'standalone');assert.equal(manifest.scope,'/');assert.ok(manifest.start_url.startsWith('/'));
 assert.deepEqual(manifest.icons.map(icon=>icon.sizes).sort(),['192x192','512x512']);
 for(const icon of manifest.icons){const bytes=fs.readFileSync(present(icon.src));assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(bytes.subarray(12,16).toString(),'IHDR');const [w,h]=icon.sizes.split('x').map(Number);assert.equal(bytes.readUInt32BE(16),w);assert.equal(bytes.readUInt32BE(20),h);}
 for(const file of fs.readdirSync(path.join(dir,'assets'))){const source=path.join(root,'assets',file);assert.ok(fs.existsSync(source),'Untracked generated asset: '+file);assert.ok(fs.readFileSync(source).equals(fs.readFileSync(path.join(dir,'assets',file))),'Asset differs from source: '+file);}
 const handlers={},cached=[],removed=[];let claimed=false;const origin='https://orders.example.test';
 const shell={applicationShell:true};
 const context={URL,Request,self:{location:{origin},addEventListener(type,fn){handlers[type]=fn;},skipWaiting:async()=>{},clients:{claim:async()=>{claimed=true;}}},caches:{open:async()=>({addAll:async requests=>{for(const req of requests){const url=new URL(req.url);assert.equal(url.origin,origin);assert.ok(!url.pathname.startsWith('/api/'));present(url.pathname==='/'?'/index.html':url.pathname);cached.push(url.pathname);}}}),keys:async()=>['wo-shell-obsolete','unrelated-cache'],delete:async key=>removed.push(key),match:async()=>shell},fetch:async()=>{throw new Error('Simulated offline');}};
 // In a browser Request resolves relative URLs against the worker origin.
 context.Request=function(url,init){return new Request(new URL(url,origin),init);};
 vm.runInNewContext(read('sw.js'),context,{filename:'sw.js'});
 let pending;handlers.install({waitUntil(value){pending=value;}});await pending;assert.ok(cached.includes('/index.html')&&cached.includes(jsUrl));
 handlers.activate({waitUntil(value){pending=value;}});await pending;assert.deepEqual(removed,['wo-shell-obsolete']);assert.equal(claimed,true);
 function dispatch(request){let response;handlers.fetch({request,respondWith(value){response=value;}});return response;}
 for(const request of [{url:origin+'/api/state',method:'GET',mode:'cors'},{url:origin+'/api/public/reviews/token',method:'GET',mode:'cors'},{url:origin+'/api/commands',method:'POST',mode:'cors'},{url:'https://other.example.test/data',method:'GET',mode:'cors'}])assert.equal(dispatch(request),undefined,'Private/nonlocal requests must bypass the service worker');
 assert.equal(await dispatch({url:origin+'/',method:'GET',mode:'navigate'}),shell,'Offline navigation must load the shell');
 const demo=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(demo,/globalThis\.WO_CONFIG=\{"mode": "demo"/);assert.ok(demo.includes('third-party-notices'));assert.ok(!demo.includes('__SCRIPTS__'));
 console.log('Build verified: central RTL shell, content hashes, local assets, PWA icons, offline shell, private API bypass, standalone demo.');
}
main().catch(error=>{console.error(error.stack||error);process.exitCode=1;});

/* Only the application shell enters Cache Storage, never API or customer data. */
'use strict';
const CACHE='wo-shell-dc4f76929c6b07d2';
const FILES=["/", "/index.html", "/app-f5b911f8bb066faf.js", "/styles-7ff8e8a510399e82.css", "/manifest.webmanifest", "/assets/Arabic-Bold.ttf", "/assets/Arabic-Regular.ttf", "/assets/app-icon-192.png", "/assets/app-icon-512.png", "/assets/app-mark.svg", "/assets/brand.jpg"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('wo-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(req.mode==='navigate')event.respondWith(fetch(req).catch(()=>caches.match('/index.html')));
 else if(FILES.includes(url.pathname))event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});

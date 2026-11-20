/* Only the application shell enters Cache Storage, never API or customer data. */
'use strict';
const CACHE='wo-shell-43f5f6a34b77220b';
const FILES=["/", "/index.html", "/app-b575544f73478cbf.js", "/styles-d036b6e26f3817bc.css", "/manifest.webmanifest", "/assets/Arabic-Bold.ttf", "/assets/Arabic-Regular.ttf", "/assets/app-icon-192.png", "/assets/app-icon-512.png", "/assets/app-mark.svg", "/assets/awamer-logo.webp", "/assets/brand.jpg"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('wo-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(req.mode==='navigate')event.respondWith(fetch(req).catch(()=>caches.match('/index.html')));
 else if(FILES.includes(url.pathname))event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});

#!/usr/bin/env python3
"""Build central PWA and a separate single-file demo with Python's standard library."""
from pathlib import Path
from html import escape
import base64, hashlib, json, shutil
ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / 'public'
PUBLIC.mkdir(exist_ok=True)
(PUBLIC / 'assets').mkdir(exist_ok=True)
SOURCES = ['catalog','qr','calculators','nesting','nesting-ui','model','inventory-engine','material-catalog','material-bindings','sync-core','command-capture','tab-lock','transport','connected-ui','platform-ui','inventory-ui','app']
b64 = lambda name: base64.b64encode((ROOT / name).read_bytes()).decode()
digest = lambda data: hashlib.sha256(data.encode()).hexdigest()[:16]
def font_css(embedded):
    return '\n'.join('@font-face{font-family:Arabic;src:url(' + ('data:font/ttf;base64,' + b64('assets/Arabic-'+weight+'.ttf') if embedded else '/assets/Arabic-'+weight+'.ttf') + ') format("truetype");font-weight:'+str(number)+';font-display:swap;}' for weight,number in [('Regular',400),('Bold',700)])
style = '\n'.join((ROOT / ('src/'+name)).read_text(encoding='utf-8') for name in ['styles.css','premium.css'])
modules = '\n;\n'.join((ROOT / ('src/'+name+'.js')).read_text(encoding='utf-8') for name in SOURCES)
notices = (ROOT/'docs/THIRD_PARTY.md').read_text(encoding='utf-8')+'\n\n'+(ROOT/'assets/FONT-LICENSE.txt').read_text(encoding='utf-8')
def js(mode, embedded=False):
    assets = {'logo':'data:image/jpeg;base64,'+b64('assets/brand.jpg') if embedded else '/assets/brand.jpg','appMark':'data:image/svg+xml;base64,'+b64('assets/app-mark.svg') if embedded else '/assets/app-mark.svg'}
    return 'globalThis.WO_CONFIG='+json.dumps({'mode':mode,'version':'2.0.0'})+';\n'+'globalThis.WO_ASSETS='+json.dumps(assets)+';\n'+modules
# The demo never connects to the central API.
demo_scripts=js('demo',True).replace('</script','<\\/script')
demo=(ROOT/'src/shell.html').read_text(encoding='utf-8').replace('/*__STYLES__*/',font_css(True)+'\n'+style).replace('/*__SCRIPTS__*/',demo_scripts)
demo=demo.replace('</body>','<template id="third-party-notices"><pre>'+escape(notices)+'</pre></template>\n</body>')
(ROOT/'index.html').write_text(demo,encoding='utf-8',newline='\n')
central_js=js('connected');central_css=font_css(False)+'\n'+style
js_name='app-'+digest(central_js)+'.js';css_name='styles-'+digest(central_css)+'.css'
for pattern in ['app-*.js','styles-*.css']:
    for old in PUBLIC.glob(pattern):old.unlink()
(PUBLIC/js_name).write_text(central_js,encoding='utf-8',newline='\n');(PUBLIC/css_name).write_text(central_css,encoding='utf-8',newline='\n')
for filename in ['brand.jpg','app-mark.svg','app-icon-192.png','app-icon-512.png','Arabic-Regular.ttf','Arabic-Bold.ttf']:
    shutil.copyfile(ROOT/'assets'/filename,PUBLIC/'assets'/filename)
shell=(ROOT/'src/shell.html').read_text(encoding='utf-8')
shell=shell.replace('<style>/*__STYLES__*/</style>','<link rel="stylesheet" href="/'+css_name+'"><link rel="manifest" href="/manifest.webmanifest"><link rel="icon" type="image/svg+xml" href="/assets/app-mark.svg"><link rel="apple-touch-icon" href="/assets/app-icon-192.png">')
shell=shell.replace('<script>/*__SCRIPTS__*/</script>','<script src="/'+js_name+'" defer></script>')
(PUBLIC/'index.html').write_text(shell,encoding='utf-8',newline='\n');(PUBLIC/'third-party.txt').write_text(notices,encoding='utf-8',newline='\n')
manifest={'id':'/','name':'نظام أوامر العمل والتشغيل','short_name':'أوامر العمل','lang':'ar','dir':'rtl','description':'إدارة الإنتاج والفروع والخامات وفريق العمل للدعاية والإعلان','start_url':'/#/home','scope':'/','display':'standalone','background_color':'#f7f6fa','theme_color':'#63349b','icons':[{'src':'/assets/app-icon-'+str(n)+'.png','sizes':str(n)+'x'+str(n),'type':'image/png','purpose':'any maskable'} for n in [192,512]],'shortcuts':[{'name':'أوامر العمل','url':'/#/orders'},{'name':'مهامي','url':'/#/myWork'}]}
(PUBLIC/'manifest.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8',newline='\n')
cache_version=digest(central_js+central_css)
files=['/','/index.html','/'+js_name,'/'+css_name,'/manifest.webmanifest']+['/assets/'+p.name for p in sorted((PUBLIC/'assets').iterdir()) if p.is_file()]
sw="""/* Only the application shell enters Cache Storage, never API or customer data. */
'use strict';
const CACHE='wo-shell-__VERSION__';
const FILES=__FILES__;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('wo-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(req.mode==='navigate')event.respondWith(fetch(req).catch(()=>caches.match('/index.html')));
 else if(FILES.includes(url.pathname))event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});
""".replace('__VERSION__',cache_version).replace('__FILES__',json.dumps(files))
(PUBLIC/'sw.js').write_text(sw,encoding='utf-8',newline='\n')
print('Built central PWA: public/index.html; version 2.0.0 / '+cache_version)
print('Built local demo: index.html ('+str(len(demo.encode()))+' bytes)')

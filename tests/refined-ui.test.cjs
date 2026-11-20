'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {login}=require('../src/refined-login.js');
const styles=fs.readFileSync(path.join(__dirname,'../src/awamer-refined.css'),'utf8');
const builder=fs.readFileSync(path.join(__dirname,'../build.py'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'../src/app.js'),'utf8');

test('connected login renders a usable and accessible Arabic form without demo credentials',()=>{
 const html=login({});
 assert.match(html,/dir="rtl"/);
 assert.match(html,/id="central-login-form"/);
 assert.match(html,/id="central-email"[^>]+name="email"/);
 assert.match(html,/id="central-password"[^>]+name="password"/);
 assert.match(html,/autocomplete="username"/);
 assert.match(html,/autocomplete="current-password"/);
 assert.match(html,/data-login-reveal/);
 assert.match(html,/aria-pressed="false"/);
 assert.match(html,/type="submit"/);
 assert.match(html,/العمليات|المراحل|متابعة التنفيذ/);
 assert.doesNotMatch(html,/demo@|demo.local|password123/);
});
test('login escapes server authentication errors and disables submit during loading',()=>{
 const html=login({error:'<img src=x onerror=alert(1)>',loading:true});
 assert.match(html,/role="alert"/);
 assert.doesNotMatch(html,/<img src=x/);
 assert.match(html,/&lt;img/);
 assert.match(html,/type="submit" disabled/);
 assert.match(html,/جار التحقق/);
});
test('refined layout maintains compact sidebar, mobile navigation and reduced-motion support',()=>{
 assert.match(styles,/\.sidebar-compact \.app-shell\{--sidebar:86px\}/);
 assert.match(styles,/@media\(max-width:760px\)/);
 assert.match(styles,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(styles,/\.login-reveal\[aria-pressed=true\]/);
 assert.match(styles,/\.launcher\{display:grid/);
 assert.match(styles,/\.p-sidebar/);
 assert.match(builder,/refined-login/);
 assert.match(builder,/awamer-refined\.css/);
 assert.match(app,/quickHelp=\{/);
 assert.match(app,/class="launch-copy"/);
});

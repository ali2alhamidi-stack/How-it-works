'use strict';
// This worker processes server-created static HTML only; arbitrary URLs and user-supplied
// file paths never reach it. It runs separately from the API request process.
const cp=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const [input,output,executable]=process.argv.slice(2);
if(!input||!output||!executable)process.exit(2);
const folder=path.dirname(path.resolve(input));
if(!fs.realpathSync(input).startsWith(folder+path.sep)||path.dirname(path.resolve(output))!==folder)process.exit(2);
if(!fs.readFileSync(input,'utf8').startsWith('<!doctype html>'))process.exit(2);
const args=[
 '--headless=new','--disable-gpu','--disable-dev-shm-usage',
 '--no-first-run','--disable-extensions','--disable-background-networking',
 '--disable-features=Translate,MediaRouter','--disable-javascript',
 '--no-sandbox','--no-pdf-header-footer',
 '--print-to-pdf='+path.resolve(output),
 'file://'+path.resolve(input)
];
const result=cp.spawnSync(executable,args,{timeout:40000,maxBuffer:65536,encoding:'utf8',env:{...process.env,HOME:folder}});
if(result.error||result.status!==0||!fs.existsSync(output)||fs.statSync(output).size<1000){
 process.stderr.write('Controlled PDF rendering failed');
 process.exit(1);
}

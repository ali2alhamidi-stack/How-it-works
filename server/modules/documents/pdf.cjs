'use strict';
const crypto=require('node:crypto');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const cp=require('node:child_process');
const S=require('../../security.cjs');
const R=require('../../../src/documents/renderer.js');
let busy=false;
function makePdf(view,{url,assets,env=process.env}={}){
 if(busy)S.error(429,'PDF_BUSY','هناك ملف آخر قيد التجهيز، حاول مجددا');
 const chromium=env.AWAMER_CHROMIUM_PATH||'/usr/bin/chromium';
 if(!fs.existsSync(chromium))S.error(503,'PDF_UNAVAILABLE','محرك PDF لم يجهز على الخادم');
 busy=true;
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'awamer-pdf-'));
 try{
  // Embed all resources. Chromium has no need to request data from the network.
  const copy=structuredClone(view);
  for(const line of copy.snapshot.lines||[]){
   if(line.previewAssetId&&assets){
    const file=assets.read(copy.snapshot.tenantId||copy.tenantId,line.previewAssetId);
    line.previewUrl='data:'+file.mime+';base64,'+file.bytes.toString('base64');
   }
  }
  const root=path.resolve(__dirname,'../../../');
  const css=fs.readFileSync(path.join(root,'src/documents/document.css'),'utf8');
  const font=weight=>'@font-face{font-family:Arabic;src:url(data:font/ttf;base64,'+fs.readFileSync(path.join(root,'assets/Arabic-'+weight+'.ttf')).toString('base64')+') format("truetype");font-weight:'+(weight==='Bold'?700:400)+';font-display:block}';
  const markup=R.render(copy,{url,print:true});
  const complete='<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>AWAMER Document</title><style>'+css+'\n'+font('Regular')+'\n'+font('Bold')+'</style></head><body>'+markup+'</body></html>';
  if(Buffer.byteLength(complete,'utf8')>12*1024*1024)S.error(413,'PDF_TOO_LARGE','محتوى المستند كبير جدا');
  const input=path.join(temp,'input.html'),output=path.join(temp,'result.pdf');
  fs.writeFileSync(input,complete,{flag:'wx',mode:0o600});
  const runner=path.join(root,'services/pdf-worker/render.cjs');
  const result=cp.spawnSync(process.execPath,[runner,input,output,chromium],{timeout:45000,maxBuffer:32768});
  if(result.error||result.status!==0)S.error(503,'PDF_FAILED','تعذر إنشاء ملف PDF، حاول مجددا');
  const bytes=fs.readFileSync(output);
  if(!bytes.subarray(0,5).equals(Buffer.from('%PDF-'))||bytes.length>15*1024*1024)S.error(500,'PDF_INVALID','ملف PDF الناتج غير صالح');
  return bytes;
 }finally{busy=false;fs.rmSync(temp,{recursive:true,force:true});}
}
module.exports={makePdf};

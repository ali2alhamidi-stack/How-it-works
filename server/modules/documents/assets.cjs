'use strict';
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const S=require('../../security.cjs');
const MAX_BYTES=2_500_000;
const TYPES={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'};
function imageBuffer(dataUrl,max=MAX_BYTES){
 if(typeof dataUrl!=='string'||dataUrl.length>Math.ceil(max*4/3)+200)S.error(413,'IMAGE_TOO_LARGE','الصورة تجاوزت الحد المسموح');
 const m=/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataUrl);
 if(!m)S.error(400,'INVALID_IMAGE','يسمح فقط بصور PNG وJPEG وWebP');
 const bytes=Buffer.from(m[2],'base64');
 if(!bytes.length||bytes.length>max||bytes.toString('base64').replace(/=+$/,'')!==m[2].replace(/=+$/,''))S.error(400,'INVALID_IMAGE','بيانات الصورة غير صالحة أو كبيرة');
 const mime=m[1];
 const isPng=bytes.length>24&&bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'));
 const isJpeg=bytes.length>6&&bytes[0]===0xff&&bytes[1]===0xd8&&bytes[bytes.length-2]===0xff&&bytes[bytes.length-1]===0xd9;
 const isWebp=bytes.length>20&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
 if(!((mime==='image/png'&&isPng)||(mime==='image/jpeg'&&isJpeg)||(mime==='image/webp'&&isWebp)))S.error(400,'INVALID_IMAGE','توقيع الملف لا يطابق نوع الصورة');
 if(isPng){const w=bytes.readUInt32BE(16),h=bytes.readUInt32BE(20);if(w<1||h<1||w*h>24_000_000)S.error(400,'IMAGE_DIMENSIONS','أبعاد الصورة تتجاوز الحد');}
 return {mime,bytes,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
}
function createAssetStore({db,root}){
 if(!path.isAbsolute(root))throw Error('Private media root must be an absolute path');
 const dir=path.resolve(root);
 const publicDir=path.resolve(__dirname,'../../../public');
 if(dir===publicDir||dir.startsWith(publicDir+path.sep))throw Error('Media storage must be outside public root');
 fs.mkdirSync(dir,{recursive:true,mode:0o700});
 function create({tenantId,branchId=null,purpose,createdBy=null,dataUrl}){
  S.safeId(tenantId,'هوية المنشأة');
  const {mime,bytes,sha256}=imageBuffer(dataUrl);
  const id=S.id('asset'),key=tenantId+'/'+id+'.'+TYPES[mime];
  const target=path.join(dir,key);
  const folder=path.dirname(target);
  fs.mkdirSync(folder,{recursive:true,mode:0o700});
  fs.writeFileSync(target,bytes,{flag:'wx',mode:0o600});
  try{
   db.prepare('INSERT INTO aw_assets(id,tenant_id,branch_id,storage_key,mime,byte_size,sha256,purpose,created_by,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)')
     .run(id,tenantId,branchId,key,mime,bytes.length,sha256,purpose,createdBy,new Date().toISOString());
  }catch(e){fs.rmSync(target,{force:true});throw e;}
  return {id,mime,sha256,size:bytes.length,absolutePath:target};
 }
 function read(tenantId,assetId){
  S.safeId(tenantId,'المنشأة');S.safeId(assetId,'الملف');
  const row=db.prepare('SELECT * FROM aw_assets WHERE tenant_id=? AND id=? AND deleted_at IS NULL').get(tenantId,assetId);
  if(!row)S.error(404,'ASSET_NOT_FOUND','المرفق غير متاح');
  if(!/^[-A-Za-z0-9_]+\/asset_[-A-Za-z0-9_]+\.(png|jpg|webp)$/.test(row.storage_key))S.error(500,'STORAGE_ERROR','مسار المرفق غير صالح');
  const filename=path.resolve(dir,row.storage_key);
  if(!filename.startsWith(dir+path.sep))S.error(500,'STORAGE_ERROR','مسار المرفق غير آمن');
  const bytes=fs.readFileSync(filename);
  if(bytes.length!==row.byte_size||crypto.createHash('sha256').update(bytes).digest('hex')!==row.sha256)S.error(500,'ASSET_INTEGRITY','تعذر التحقق من المرفق');
  return {bytes,mime:row.mime,row};
 }
 function remove(asset){if(asset?.absolutePath)fs.rmSync(asset.absolutePath,{force:true});}
 return {create,read,remove,root:dir};
}
module.exports={imageBuffer,createAssetStore,MAX_BYTES};

'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {DatabaseSync,backup}=require('node:sqlite');
const PREFIX='awamer-snapshot-';
const regexp=/^awamer-snapshot-\d{8}T\d{6}Z-[0-9a-f]{8}\.sqlite$/;
function validate(source,folder,keep){
 if(!source||!folder)throw Error('Backup source and destination required');
 if(!Number.isInteger(keep)||keep<2||keep>30)throw Error('Retention must be 2 to 30 snapshots');
 const db=path.resolve(source),dest=path.resolve(folder),publicPath=path.resolve(__dirname,'../public');
 if(dest===publicPath||dest.startsWith(publicPath+path.sep))throw Error('Backups must not be publicly served');
 if(db===dest||db.startsWith(dest+path.sep))throw Error('Backup folder cannot contain live database');
 return {db,dest,keep};
}
async function snapshot({dbPath,backupDir,keep=7,clock=()=>new Date(),logger=console}={}){
 const {db,dest}=validate(dbPath,backupDir,keep);
 if(!fs.existsSync(db))throw Error('Live SQLite database does not exist');
 fs.mkdirSync(dest,{recursive:true,mode:0o700});
 const realRoot=fs.realpathSync(dest),realPublic=fs.realpathSync(path.resolve(__dirname,'../public'));
 if(realRoot===realPublic||realRoot.startsWith(realPublic+path.sep))throw Error('Backup directory resolves inside public');
 const iso=clock().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const file=PREFIX+iso+'-'+crypto.randomBytes(4).toString('hex')+'.sqlite';
 const tmp=path.join(realRoot,'.'+file+'.partial'),output=path.join(realRoot,file);
 let sourceDB,check;
 try{
  sourceDB=new DatabaseSync(db,{readOnly:true});
  await backup(sourceDB,tmp);
  sourceDB.close();sourceDB=null;
  check=new DatabaseSync(tmp,{readOnly:true});
  const result=check.prepare('PRAGMA integrity_check').get();
  if(Object.values(result)[0]!=='ok')throw Error('SQLite snapshot failed integrity_check');
  check.close();check=null;
  fs.chmodSync(tmp,0o600);
  fs.renameSync(tmp,output);
  const sum=crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex');
  fs.writeFileSync(output+'.sha256',sum+'  '+file+'\n',{flag:'wx',mode:0o600});
  const files=fs.readdirSync(realRoot).filter(f=>regexp.test(f)).sort().reverse();
  for(const old of files.slice(keep)){fs.rmSync(path.join(realRoot,old),{force:true});fs.rmSync(path.join(realRoot,old+'.sha256'),{force:true});}
  logger.info('Verified on-volume SQLite snapshot: '+file);
  return {file,output,sha256:sum,retained:Math.min(files.length,keep)};
 }catch(err){if(fs.existsSync(tmp))fs.rmSync(tmp,{force:true});throw err;}
 finally{try{check?.close();}catch{}try{sourceDB?.close();}catch{}}
}
function schedule({dbPath,backupDir,intervalHours=24,keep=7,initialDelayMs=5000,logger=console}={}){
 if(!(intervalHours>=1&&intervalHours<=168))throw Error('Backup interval hours must be 1 to 168');
 let active=false,closed=false;
 async function run(){if(active||closed)return;active=true;try{await snapshot({dbPath,backupDir,keep,logger});}catch(e){logger.error('Backup failed: '+e.message);}finally{active=false;}}
 const first=setTimeout(()=>{run();},initialDelayMs);first.unref?.();
 const timer=setInterval(run,Math.round(intervalHours*3600000));timer.unref?.();
 return {run,stop(){closed=true;clearTimeout(first);clearInterval(timer);}};
}
module.exports={snapshot,schedule};

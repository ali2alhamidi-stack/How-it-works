'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {DatabaseSync}=require('node:sqlite'),B=require('../server/auto-backup.cjs');
const setup=()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'awamer-backup-')),dbPath=path.join(dir,'live.sqlite'),backupDir=path.join(dir,'private-backups');const db=new DatabaseSync(dbPath);db.exec('PRAGMA journal_mode=WAL; CREATE TABLE documents(id INTEGER PRIMARY KEY, value TEXT)');db.prepare('INSERT INTO documents(value) VALUES(?)').run('مستند محفوظ');return {dir,dbPath,backupDir,db,close(){db.close();fs.rmSync(dir,{recursive:true,force:true});}};};
test('verified automatic SQLite snapshot includes committed WAL rows',async()=>{
 const v=setup();try{
 const s=await B.snapshot({...v,logger:{info(){}}});
 assert.ok(fs.existsSync(s.output));assert.equal(fs.statSync(s.output).mode&0o777,0o600);
 const copy=new DatabaseSync(s.output,{readOnly:true});
 assert.equal(copy.prepare('SELECT value FROM documents').get().value,'مستند محفوظ');copy.close();
 const hash=crypto.createHash('sha256').update(fs.readFileSync(s.output)).digest('hex');
 assert.equal(s.sha256,hash);
 assert.ok(fs.readFileSync(s.output+'.sha256','utf8').includes(hash));
 }finally{v.close();}
});
test('snapshot retention keeps only most recent files and hash manifests',async()=>{
 const v=setup();try{for(let i=0;i<4;i++)await B.snapshot({...v,keep:2,clock:()=>new Date(Date.UTC(2026,10,14,2,0,i)),logger:{info(){}}});const files=fs.readdirSync(v.backupDir);assert.equal(files.filter(f=>f.endsWith('.sqlite')).length,2);assert.equal(files.filter(f=>f.endsWith('.sha256')).length,2);}finally{v.close();}
});
test('backups reject public directory and invalid keep without mutation',async()=>{
 const v=setup();try{await assert.rejects(B.snapshot({dbPath:v.dbPath,backupDir:path.resolve(__dirname,'../public'),keep:7}),/public/);await assert.rejects(B.snapshot({dbPath:v.dbPath,backupDir:v.backupDir,keep:0}),/Retention/);}finally{v.close();}
});
test('scheduler triggers a verified snapshot and is safely stoppable',async()=>{
 const v=setup();try{const log=[];const q=B.schedule({...v,initialDelayMs:100000,logger:{info(x){log.push(x)},error(x){throw Error(x)}}});await q.run();q.stop();assert.equal(log.length,1);assert.equal(fs.readdirSync(v.backupDir).filter(f=>f.endsWith('.sqlite')).length,1);}finally{v.close();}
});

'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
class HttpError extends Error { constructor(status, code, message, details) { super(message); this.status=status; this.code=code; this.details=details; } }
function error(status,code,message,details){throw new HttpError(status,code,message,details);}
const random = (bytes=32)=>crypto.randomBytes(bytes).toString('base64url');
const id = prefix=>prefix+'_'+random(16);
const digest = v=>crypto.createHash('sha256').update(v).digest('hex');
function passwordHash(password){validatePassword(password);const salt=crypto.randomBytes(16);const key=crypto.scryptSync(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024});return 'scrypt$32768$'+salt.toString('hex')+'$'+key.toString('hex');}
function passwordMatches(password,hash){if(typeof password!=='string'||password.length>1024)return false;try{const [kind,n,salt,stored]=hash.split('$');if(kind!=='scrypt'||n!=='32768'||!salt||!stored)return false;const expected=Buffer.from(stored,'hex');const actual=crypto.scryptSync(password,Buffer.from(salt,'hex'),64,{N:32768,r:8,p:1,maxmem:64*1024*1024});return expected.length===actual.length&&crypto.timingSafeEqual(expected,actual);}catch{return false;}}
function validatePassword(v){if(typeof v!=='string'||v.length<12||v.length>1024)error(400,'INVALID_PASSWORD','كلمة المرور يجب أن تكون من 12 إلى 1024 حرفا');}
function str(v,label,max=200,optional=false){if(typeof v!=='string'||(!optional&&!v.trim())||v.length>max)error(400,'VALIDATION_ERROR','راجع حقل '+label);return v.trim();}
function email(v){const e=str(v,'البريد الإلكتروني',254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))error(400,'VALIDATION_ERROR','البريد الإلكتروني غير صالح');return e;}
function safeId(v,label='المعرف'){if(typeof v!=='string'||!/^[A-Za-z0-9_-]{1,160}$/.test(v))error(400,'VALIDATION_ERROR',label+' غير صالح');return v;}
function num(v,label,min=0,max=1e10,integer=false){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v)))error(400,'VALIDATION_ERROR',label+' غير صالح');return v;}
function date(v,optional=true){if(optional&&(v===''||v===null||v===undefined))return null;if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v.slice(0,10)+'T00:00:00Z').toISOString().slice(0,10)!==v.slice(0,10))error(400,'VALIDATION_ERROR','التاريخ غير صالح');return v;}
const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
function requireObject(v){if(!object(v))error(400,'VALIDATION_ERROR','بيانات الطلب غير صالحة');return v;}
function pick(v,keys){requireObject(v);const result={};for(const k of Object.keys(v)){if(!keys.includes(k))error(400,'UNKNOWN_FIELD','حقل غير مسموح: '+k);result[k]=v[k];}return result;}
function stable(v){if(Array.isArray(v))return '['+v.map(stable).join(',')+']';if(object(v))return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';return JSON.stringify(v);}
function secureDirectory(filename){if(filename===':memory:')return;fs.mkdirSync(path.dirname(path.resolve(filename)),{recursive:true,mode:0o700});}
module.exports={HttpError,error,random,id,digest,passwordHash,passwordMatches,validatePassword,str,email,safeId,num,date,object,requireObject,pick,stable,secureDirectory};

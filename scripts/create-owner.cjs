#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {createStore}=require('../server/store.cjs');
const args=process.argv.slice(2);function flag(name){const i=args.indexOf('--'+name);return i<0?undefined:args[i+1];}
if(args.includes('--help')){console.log('Create a production platform owner (no default credentials).\nUsage: node scripts/create-owner.cjs --db data/work-orders.sqlite --email owner@example.com --name "Platform owner" --password-stdin\nRead the password from stdin, or set PLATFORM_OWNER_PASSWORD. DB_PATH / PLATFORM_OWNER_EMAIL / PLATFORM_OWNER_NAME are also accepted.');process.exit(0);}
const email=flag('email')||process.env.PLATFORM_OWNER_EMAIL,name=flag('name')||process.env.PLATFORM_OWNER_NAME||'مالك المنصة',dbPath=flag('db')||process.env.DB_PATH||path.join(__dirname,'../data/work-orders.sqlite');
const password=args.includes('--password-stdin')?fs.readFileSync(0,'utf8').replace(/\r?\n$/,''):process.env.PLATFORM_OWNER_PASSWORD;
if(!email||!password){console.error('An explicit email and password are required. Use --help for secure stdin usage.');process.exitCode=1;}else{let store;try{store=createStore(dbPath);const account=store.createPlatformOwner({email,password,name});console.log('Created platform owner '+account.email+' ('+account.id+'). No tenant or sample data was created.');}catch(e){console.error('Could not create owner: '+e.message);process.exitCode=1;}finally{store?.close();}}

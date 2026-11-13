(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.WONesting=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const EPS=1e-8,round=x=>Math.round(x*1e6)/1e6;
const num=(v,name,min=0,max=1000000,integer=false)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v)))throw Error(name+' خارج النطاق');return v;};
const area=r=>r.w*r.h;
function validate(input){
 if(!input||!Array.isArray(input.parts)||!input.parts.length||!Array.isArray(input.stocks)||!input.stocks.length)throw Error('أدخل القطع والألواح');
 if(input.parts.length>100||input.stocks.length>100)throw Error('تجاوز حد المدخلات');
 const kerf=num(input.kerf??3,'عرض سلاح القص',0,100,true),margin=num(input.margin??0,'الهامش',0,1000,true);
 const salvageW=num(input.salvageMinWidth??150,'أقل عرض للباقي',1),salvageH=num(input.salvageMinHeight??150,'أقل طول للباقي',1);
 let count=0;const ids=new Set();
 const parts=input.parts.map((p,i)=>{const id=String(p.id??'part'+i);if(ids.has(id))throw Error('معرف قطعة مكرر');ids.add(id);const width=num(p.width,'عرض القطعة',1),height=num(p.height,'طول القطعة',1),quantity=num(p.quantity,'عدد القطع',1,2000,true);count+=quantity;return {id,width,height,quantity,rotate:p.rotate!==false&&input.allowRotate!==false};});
 if(count>2000)throw Error('العدد يتجاوز 2000 قطعة في عملية واحدة');
 const stockIds=new Set();
 const stocks=input.stocks.map((s,i)=>{const id=String(s.id??'stock'+i);if(stockIds.has(id))throw Error('معرف خامة مكرر');stockIds.add(id);const width=num(s.width,'عرض اللوح',1),height=num(s.height,'طول اللوح',1),quantity=num(s.quantity??1,'كمية المخزون',0,2000,true),cost=num(s.cost??0,'تكلفة اللوح',0,1e10);if(width<=2*margin||height<=2*margin)throw Error('الهامش يتجاوز مقاس اللوح');return {id,width,height,quantity,cost,kind:s.kind==='remnant'?'remnant':'sheet',location:String(s.location||'').slice(0,150),used:0};});
 return {parts,stocks,count,kerf,margin,salvageW,salvageH,maxSheets:num(input.maxSheets??200,'حد الألواح',1,2000,true)};
}
function split(f,w,h,k){
 const variants=[
 {direction:'vertical',rects:[{x:f.x+w+k,y:f.y,w:f.w-w-k,h:f.h},{x:f.x,y:f.y+h+k,w,h:f.h-h-k}]},
 {direction:'horizontal',rects:[{x:f.x+w+k,y:f.y,w:f.w-w-k,h},{x:f.x,y:f.y+h+k,w:f.w,h:f.h-h-k}]}
 ];
 for(const v of variants)v.rects=v.rects.filter(r=>r.w>EPS&&r.h>EPS);
 variants.sort((a,b)=>Math.max(...b.rects.map(area),0)-Math.max(...a.rects.map(area),0)||a.direction.localeCompare(b.direction));
 return variants[0];
}
function fit(bin,part,k){
 let best=null;
 for(let i=0;i<bin.free.length;i++)for(const rotated of part.rotate&&part.width!==part.height?[false,true]:[false]){
  const f=bin.free[i],w=rotated?part.height:part.width,h=rotated?part.width:part.height;
  if(w>f.w+EPS||h>f.h+EPS)continue;
  const cut=split(f,w,h,k),loss=area(f)-w*h-cut.rects.reduce((s,r)=>s+area(r),0);
  const score=area(f)-w*h+loss*.000001;
  if(!best||score<best.score-EPS)best={i,f,w,h,rotated,cut,score};
 }
 return best;
}
function open(s,index,margin){return {id:s.id+'-'+index,sourceId:s.id,kind:s.kind,location:s.location,width:s.width,height:s.height,cost:s.cost,free:[{x:margin,y:margin,w:s.width-2*margin,h:s.height-2*margin}],placed:[]};}
function plan(options){
 const c=validate(options),parts=c.parts.slice().sort((a,b)=>b.width*b.height-a.width*a.height||a.id.localeCompare(b.id)),todo=[];
 for(const p of parts)for(let n=0;n<p.quantity;n++)todo.push(p);
 const bins=[];
 for(let step=0;todo.length&&step<c.count;step++){
  let best=null;
  for(let pi=0;pi<todo.length;pi++){
   const p=todo[pi];let pick=null;
   for(const bin of bins){const f=fit(bin,p,c.kerf);if(!f)continue;const score=(bin.kind==='remnant'?0:1)*1e15+f.score;if(!pick||score<pick.score)pick={bin,fit:f,score};}
   if(!pick)for(const stock of c.stocks){if(stock.used>=stock.quantity||bins.length>=c.maxSheets)continue;const bin=open(stock,stock.used+1,c.margin),f=fit(bin,p,c.kerf);if(!f)continue;const score=(stock.kind==='remnant'?0:1)*1e15+stock.cost*1e6+area(bin.free[0]);if(!pick||score<pick.score)pick={bin,fit:f,stock,score};}
   if(!pick)continue;
   const overall=(pick.stock?2:0)*1e17+pick.score-p.width*p.height*.00001;
   if(!best||overall<best.overall)best={pi,pick,overall};
  }
  if(!best)break;
  const {pick}=best,{bin}=pick;
  if(pick.stock){pick.stock.used++;bins.push(bin);}
  const v=pick.fit,p=todo.splice(best.pi,1)[0];
  bin.free.splice(v.i,1,...v.cut.rects);
  bin.placed.push({partId:p.id,x:round(v.f.x),y:round(v.f.y),width:v.w,height:v.h,rotated:v.rotated,cutOrder:v.cut.direction});
 }
 const missing={};todo.forEach(x=>missing[x.id]=(missing[x.id]||0)+1);
 let gross=0,used=0,salvage=0,cost=0;
 const result=bins.map(b=>{
  const g=b.width*b.height;gross+=g;cost+=b.cost;
  const u=b.placed.reduce((n,x)=>n+x.width*x.height,0);used+=u;
  const candidates=b.free.filter(r=>r.w>=c.salvageW&&r.h>=c.salvageH).map((r,i)=>({id:b.id+'-r'+(i+1),sourceId:b.sourceId,x:round(r.x),y:round(r.y),width:round(r.w),height:round(r.h),requiresMeasurement:true}));
  const rem=candidates.reduce((n,r)=>n+r.width*r.height,0);salvage+=rem;
  return {id:b.id,sourceId:b.sourceId,kind:b.kind,location:b.location,width:b.width,height:b.height,cost:b.cost,placed:b.placed,remnantCandidates:candidates,usedArea:round(u),salvageArea:round(rem)};
 });
 const complete=todo.length===0;
 return {complete,requested:c.count,produced:c.count-todo.length,missing,bins:result,materialCost:Math.round(cost*100)/100,grossArea:round(gross),usedArea:round(used),unallocatedArea:round(gross-used),salvageableArea:round(salvage),nonSalvageArea:round(gross-used-salvage),utilizationPercent:gross?Math.round(used/gross*10000)/100:0,notes:['اقتراح تخطيط Guillotine؛ ليس ملف ماكينة أو ضمانا للقص الأمثل.','الأبعاد بالملليمتر. يجب تأكيد قياس الباقي قبل إضافته أو صرفه من المخزون.']};
}
return {plan};
});
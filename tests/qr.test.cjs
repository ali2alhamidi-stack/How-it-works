'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const QR = require('../src/qr');
const catalog = require('../src/catalog');

// Independent lossless decoder for the three tested versions. It reads QR format
// data, removes function patterns/masking, deinterleaves codewords, checks every
// Reed-Solomon syndrome, and extracts the UTF-8 payload. No encoder internals used.
// Standard QR level-M block and alignment data for versions 1, 3, and 23.
const specs = {
  1: {positions:[], groups:[[1,26,16]]},
  3: {positions:[6,22], groups:[[1,70,44]]},
  23: {positions:[6,30,54,78,102],groups:[[4,75,47],[14,76,48]]}
};
function readQR(m) {
  const n=m.length, version=(n-17)/4, spec=specs[version];
  assert.ok(spec, 'decoder fixture version supported: '+version);
  const occupied=Array.from({length:n},()=>Array(n).fill(false));
  function mark(x,y,w,h) {
    for(let row=y;row<y+h;row++) for(let col=x;col<x+w;col++) if(row>=0&&row<n&&col>=0&&col<n) occupied[row][col]=true;
  }
  mark(0,0,9,9); mark(n-8,0,8,9); mark(0,n-8,9,8);
  for(const y of spec.positions) for(const x of spec.positions) {
    if((x===6&&(y===6||y===n-7))||(y===6&&x===n-7)) continue;
    mark(x-2,y-2,5,5);
  }
  mark(6,0,1,n);mark(0,6,n,1);
  if(version>=7) {mark(n-11,0,3,6);mark(0,n-11,6,3);}
  let format=0;
  for(let i=0;i<15;i++) {
    const y=i<6?i:i<8?i+1:n-15+i;
    format |= Number(m[y][8])<<i;
  }
  const plain=format^0x5412, data=plain>>>10, mask=data&7;
  assert.equal(data>>>3,0,'error correction level M');
  let remainder=plain;
  for(let bit=14;bit>=10;bit--) if(remainder&(1<<bit)) remainder ^= 0x537<<(bit-10);
  assert.equal(remainder,0,'valid format BCH');
  const masks=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,
    (x,y)=>(Math.floor(y/2)+Math.floor(x/3))%2===0,(x,y)=>(x*y)%2+(x*y)%3===0,
    (x,y)=>((x*y)%2+(x*y)%3)%2===0,(x,y)=>((x*y)%3+(x+y)%2)%2===0];
  let bits=[], up=true;
  for(let right=n-1;right>=1;right-=2) {
    if(right===6) right--;
    for(let v=0;v<n;v++) {
      const y=up?n-1-v:v;
      for(let dx=0;dx<2;dx++) {
        const x=right-dx;
        if(!occupied[y][x]) bits.push(Number(m[y][x])^Number(masks[mask](x,y)));
      }
    }
    up=!up;
  }
  let codewords=[];
  for(let i=0;i+7<bits.length;i+=8) codewords.push(bits.slice(i,i+8).reduce((a,b)=>(a<<1)|b,0));
  const blocks=[];
  for(const [count,total,dataCount] of spec.groups) for(let i=0;i<count;i++) blocks.push({total,dataCount,bytes:[]});
  let cursor=0;
  for(let i=0;i<Math.max(...blocks.map(b=>b.dataCount));i++) for(const b of blocks) if(i<b.dataCount) b.bytes.push(codewords[cursor++]);
  for(let i=0;i<blocks[0].total-blocks[0].dataCount;i++) for(const b of blocks) b.bytes.push(codewords[cursor++]);
  assert.equal(cursor,blocks.reduce((s,b)=>s+b.total,0));
  // Evaluate each RS block at all generator roots over GF(256), polynomial 0x11d.
  function mul(a,b) {let p=0;while(b){if(b&1)p^=a;b>>=1;a<<=1;if(a&256)a^=0x11d;}return p;}
  for(const b of blocks) {
    let root=1;
    for(let i=0;i<b.total-b.dataCount;i++) {
      let syndrome=0;for(const byte of b.bytes)syndrome=mul(syndrome,root)^byte;
      assert.equal(syndrome,0,'valid Reed-Solomon parity for every block');
      root=mul(root,2);
    }
  }
  const payloadBits=blocks.flatMap(b=>b.bytes.slice(0,b.dataCount)).flatMap(byte=>Array.from({length:8},(_,i)=>(byte>>(7-i))&1));
  let offset=0;
  function take(count){let value=0;while(count--)value=(value<<1)|payloadBits[offset++];return value;}
  assert.equal(take(4),4,'byte mode');
  const length=take(version<10?8:16);
  return Buffer.from(Array.from({length},()=>take(8))).toString('utf8');
}

for(const [name,text] of [
  ['short byte payload','HELLO'],
  ['review URL','https://example.com/review?token=abc123'],
  ['UTF-8 Arabic and emoji','https://example.com/?n=أهلا🙂'],
  ['800-character URL','https://example.com/?q='+ 'a'.repeat(778)]
]) test('QR independently decodes '+name,()=>assert.equal(readQR(QR.matrix(text)),text));

test('matrix has boolean cells, valid dimensions, finder and timing patterns',()=>{
  const m=QR.matrix('HELLO');
  assert.equal(m.length,21);assert.ok(m.every(r=>r.length===21&&r.every(x=>typeof x==='boolean')));
  for(const [x,y] of [[0,0],[14,0],[0,14]]) for(let dy=0;dy<7;dy++) for(let dx=0;dx<7;dx++) {
    const expected=dx===0||dy===0||dx===6||dy===6||(dx>=2&&dx<=4&&dy>=2&&dy<=4);
    assert.equal(m[y+dy][x+dx],expected);
  }
  for(let i=8;i<13;i++)assert.equal(m[6][i],i%2===0);
});

test('SVG preserves every matrix cell and a white four-module quiet zone',()=>{
  const text='https://example.com/review?token=abc123', m=QR.matrix(text), n=m.length;
  const svg=QR.svg(text,{size:320,margin:0});
  assert.match(svg,new RegExp('viewBox="0 0 '+(n+8)+' '+(n+8)+'"'));
  assert.match(svg,/width="320" height="320"/);assert.match(svg,/fill="#fff"/);
  const image=Array.from({length:n+8},()=>Array(n+8).fill(false));
  const path=svg.match(/<path d="([^"]+)"/)[1];
  for(const run of path.matchAll(/M(\d+) (\d+)h(\d+)v1h-(\d+)z/g)) {
    const x=+run[1],y=+run[2],len=+run[3];assert.equal(+run[4],len);
    assert.ok(x>=4&&y>=4&&x+len<=n+4&&y<n+4,'dark module inside quiet zone');
    for(let i=x;i<x+len;i++)image[y][i]=true;
  }
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)assert.equal(image[y+4][x+4],m[y][x]);
});

test('SVG supports larger margins and never embeds source text',()=>{
  const svg=QR.svg('<script>alert("x")</script>',{margin:6.2,size:128});
  assert.match(svg,/width="128"/);assert.ok(!svg.includes('<script>'));assert.match(svg,/viewBox="0 0 43 43"/);
});

test('invalid QR input and unsafe numeric options fail usefully',()=>{
  for(const input of ['',null,undefined,12,'\ud800','x'.repeat(2301)])assert.throws(()=>QR.matrix(input),Error);
  for(const options of [{size:NaN},{size:Infinity},{size:0},{size:'<script>'},{margin:-1},{margin:Infinity},{margin:65}])assert.throws(()=>QR.svg('abc',options),Error);
});

test('encoding is deterministic and matrix result has no shared mutable rows',()=>{
  assert.deepEqual(QR.matrix('HELLO'),QR.matrix('HELLO'));
  const m=QR.matrix('HELLO');m[0][0]=false;assert.equal(QR.matrix('HELLO')[0][0],true);
});

test('both modules run in browser without require, DOM, fetch or packages',()=>{
  const context=vm.createContext({});
  vm.runInContext(fs.readFileSync(require.resolve('../src/qr'),'utf8'),context);
  vm.runInContext(fs.readFileSync(require.resolve('../src/catalog'),'utf8'),context);
  assert.equal(context.WOQR.matrix('HELLO').length,21);
  assert.equal(context.WOCatalog.categories.length,12);
});

test('catalog covers all categories with supported services and demo pricing',()=>{
  assert.deepEqual(catalog.categories.map(c=>c.id),['paper','banners','stickers','acrylic','letters','stamps','gifts','projects','models','flags','packaging','installation']);
  for(const c of catalog.categories) {
    assert.ok(c.name&&c.description&&catalog.icons[c.icon]);assert.ok(c.services.length>=3);
    for(const s of c.services){assert.ok(s.name&&s.unit);assert.ok(['sheet','roll','letters','led','general'].includes(s.calculator));assert.ok(s.basePrice>=0);assert.ok(s.stages.every(id=>catalog.stages.some(stage=>stage.id===id)));}
  }
  assert.match(catalog.priceNote,/تجريبية/);
});

test('catalog stage and permission IDs match the shared contracts',()=>{
  assert.deepEqual(catalog.stages.map(s=>s.id),['draft','approval','queued','production','quality','ready','delivered','cancelled']);
  assert.deepEqual(catalog.permissions.map(p=>p.id),['view_all_branches','view_financials','manage_orders','approve_design','manage_production','manage_inventory','request_purchase','approve_purchase','receive_purchase','manage_team','manage_branches','view_reports','view_reviews','manage_settings']);
  assert.ok(catalog.permissions.every(p=>/[\u0600-\u06ff]/.test(p.label)));
});

test('all requested original icons are safe inner SVG fragments',()=>{
  const required='home grid orders production inventory remnant purchase users branch review chart calculator settings search bell plus arrow chevron check close clock download upload print photo camera shield eye eyeOff logout moon sun menu filter edit trash copy qr star phone whatsapp save alert info package scissors letter lightbulb paper flag gift stamp graduate cube tool link refresh expand file calendar wallet'.split(' ');
  for(const name of required){assert.ok(catalog.icons[name],name);assert.match(catalog.icons[name],/^<(path|rect|circle)/);assert.ok(!/<svg|script|on\w+=|https?:/.test(catalog.icons[name]));}
  assert.ok(Object.keys(catalog.icons).length>=40);
});

test('catalog explicitly covers graduation reports, binding, die cutting and UV inks',()=>{
  const names=catalog.categories.flatMap(c=>c.services.map(s=>s.name));
  for(const name of ['طباعة تقارير ومشاريع تخرج','تجليد حراري وسلك','داي كت وقوالب قص','طباعة أحبار UV على خامات صلبة','تنسيق وإخراج مشروع تخرج'])assert.ok(names.includes(name),name);
  assert.equal(catalog.categories.find(c=>c.id==='projects').name,'المعارض ومشاريع التخرج');
});

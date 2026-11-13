"""Chromium QA for the self-contained demo. Writes evidence to qa-output.
Run: python tests/ui_smoke.py [--base-url http://127.0.0.1:8787]
Requires playwright and Chromium; server must serve project root.
"""
import argparse, json, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8787');args=parser.parse_args()
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'qa-output';OUT.mkdir(exist_ok=True)
report={'base_url':args.base_url,'viewports':{},'failures':[]}
ROUTES=['home','orders','newOrder','production','myWork','catalog','calculators','inventory','purchases','clients','employees','branches','reviews','reports','activity','settings']

def check(condition,message):
    if not condition:raise AssertionError(message)

def run_step(name,fn,record):
    try:fn();record['checks'].append({'name':name,'pass':True});print('PASS',record['name'],name,flush=True)
    except Exception as exc:
        record['checks'].append({'name':name,'pass':False,'error':str(exc)})
        report['failures'].append({'viewport':record['name'],'check':name,'error':str(exc)})
        print('FAIL',record['name'],name,str(exc),flush=True)

def main():
  with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for name,width,height in [('desktop',1440,1000),('mobile',390,844)]:
      context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1)
      page=context.new_page();page.set_default_timeout(8000)
      record={'name':name,'size':[width,height],'checks':[],'errors':[],'routes':[]};report['viewports'][name]=record
      page.on('pageerror',lambda e:record['errors'].append({'type':'pageerror','message':str(e)}))
      page.on('console',lambda m:record['errors'].append({'type':'console.error','message':m.text}) if m.type=='error' and 'favicon.ico' not in m.text else None)
      page.goto(args.base_url,wait_until='networkidle');page.locator('[data-action=login][data-user=owner]').click();page.wait_for_timeout(150)
      def nav(route):
        page.evaluate('(hash)=>location.hash=hash','#/'+route);page.wait_for_timeout(100)
      def snap(file):page.screenshot(path=str(OUT/file),full_page=True)
      def measure(route):
        return page.evaluate('''() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth,offenders:[...document.querySelectorAll('.content *')].filter(e=>{let r=e.getBoundingClientRect();return r.width>0&&(r.left < -1 || r.right > innerWidth+1)&&getComputedStyle(e).position!=='fixed'}).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right)}))})''')
      def route_check(route):
        nav(route);text=page.locator('#app').inner_text();check('نحتاج إلى مراجعة هذه الصفحة' not in text,'render error page for '+route)
        check(page.locator('.content').count()==1,'missing application content for '+route)
        sizes=measure(route);record['routes'].append({'route':route,**sizes});snap(f'{name}-{route}.png')
        check(sizes['scroll']<=width+1 and sizes['body']<=width+1,f'horizontal overflow at {route}: {sizes}')
      for route in ROUTES:run_step('route '+route,lambda route=route:route_check(route),record)
      def settings_tabs():
        nav('settings')
        for tab in ['brand','pricing','permissions','performance','connections','backup']:
          page.locator(f'[data-key=settingsTab][data-value={tab}]').click();page.wait_for_timeout(70)
          check('نحتاج إلى مراجعة هذه الصفحة' not in page.locator('.content').inner_text(),'settings tab render error '+tab)
          sizes=measure(tab);check(sizes['scroll']<=width+1,'settings '+tab+' overflow '+str(sizes));snap(f'{name}-settings-{tab}.png')
      run_step('all six settings tabs',settings_tabs,record)
      def persistence():
        nav('settings');page.locator('[data-key=settingsTab][data-value=brand]').click()
        page.locator('#brand-form [name=name]').fill('آرت بلس — اختبار الجودة')
        page.locator('#brand-form [name=footer]').fill('كليشة اختبار محفوظة')
        page.locator('#brand-form button[type=submit]').click();page.reload(wait_until='networkidle')
        check(page.locator('#brand-form [name=name]').input_value()=='آرت بلس — اختبار الجودة','brand did not persist')
        check(page.locator('#brand-form [name=footer]').input_value()=='كليشة اختبار محفوظة','footer did not persist')
        storage=json.loads(page.evaluate("localStorage.getItem('artplus.workorders.v1')"));check(storage['brand']['name']=='آرت بلس — اختبار الجودة','persisted state differs')
      run_step('brand save and reload persistence',persistence,record)
      def calculator_types():
        nav('calculators/sheet')
        for kind in ['sheet','paper','roll','letters','led','general']:
          page.locator(f'[data-action=open-calc][data-type={kind}]').click();page.wait_for_timeout(70)
          check(page.locator('#calc-result .result-hero b').count()==1,kind+' missing valid result: '+page.locator('#calc-result').inner_text())
          snap(f'{name}-calc-{kind}.png')
      run_step('all six calculator defaults render',calculator_types,record)
      def calculator_letters():
        nav('calculators/letters')
        for field,value in [('height','0.5'),('count','3'),('rate','200'),('minHeight','1'),('logoMultiplier','2')]:page.locator(f'#calc-form [name={field}]').fill(value)
        page.locator('#calc-form [name=logo]').uncheck();page.wait_for_timeout(300)
        check(page.locator('#calc-result .result-hero b').inner_text()=='600.00','minimum-height letter quote must be 600')
        page.locator('#calc-form [name=logo]').check();page.wait_for_timeout(300)
        check(page.locator('#calc-result .result-hero b').inner_text()=='1,200.00','logo multiplier quote must be1200')
        page.reload(wait_until='networkidle');check(page.locator('#calc-form [name=height]').input_value()=='0.5','calculator draft did not persist')
        check(page.locator('#calc-form [name=logo]').is_checked(),'logo checkbox draft did not persist')
      run_step('letter minimum, logo multiplier, calculator persistence',calculator_letters,record)
      def invalid_sheet():
        nav('calculators/sheet');page.locator('#calc-form [name=pieceW]').fill('9999');page.wait_for_timeout(300)
        check(page.locator('#calc-result .result-hero').count()==0,'oversized sheet piece quoted as valid')
        check(page.locator('#calc-result .alert-box').count()==1,'oversized piece lacks explanation')
        page.locator('[data-action=reset-calc]').click()
      run_step('oversized piece validation',invalid_sheet,record)
      def led_strip():
        nav('calculators/led');page.locator('#calc-form [name=mode]').select_option('strip');page.wait_for_timeout(300)
        check(page.locator('#calc-form [name=stripLength]').count()==1,'strip inputs missing')
        page.locator('#calc-form [name=stripLength]').fill('20');page.wait_for_timeout(300)
        check(page.locator('#calc-result .result-hero b').count()==1,'strip result failed: '+page.locator('#calc-result').inner_text());snap(f'{name}-led-strip.png')
      run_step('LED strip mode interaction',led_strip,record)
      def calc_to_order():
        nav('calculators/general');page.locator('#calc-form [name=quantity]').fill('17');page.wait_for_timeout(300)
        price=page.locator('#calc-result .result-hero b').inner_text().replace(',','')
        page.locator('[data-action=calc-to-order]').click();page.wait_for_timeout(120)
        check(page.locator('#order-form').count()==1,'calculator did not create order draft')
        check(page.locator('#order-form [name=quantity]').input_value()=='17','order quantity not transferred')
        check(float(page.locator('#order-form [name=salePrice]').input_value())==float(price),'quote not transferred')
      run_step('calculator transfers quantity and price to order',calc_to_order,record)
      def feedback():
        nav('reviews');check(page.locator('#review-qr svg').count()==1,'review QR missing')
        page.locator('[data-action=feedback-preview]').click();page.wait_for_timeout(100)
        check(page.locator('#feedback-form').count()==1,'no unreviewed public form available')
        token=page.locator('#feedback-form').get_attribute('data-token')
        page.locator('[data-action=rating][data-value="4"]').click();page.locator('#feedback-form [name=comment]').fill('اختبار واجهة العميل — خدمة ممتازة')
        page.locator('#feedback-form button[type=submit]').click();page.wait_for_timeout(150)
        check('شكرا لمشاركتك' in page.locator('#app').inner_text(),'public review confirmation missing')
        snap(f'{name}-review-confirmation.png');page.reload(wait_until='networkidle');check('شكرا لمشاركتك' in page.locator('#app').inner_text(),'review not persisted')
        state=json.loads(page.evaluate("localStorage.getItem('artplus.workorders.v1')"));match=[r for r in state['reviews'] if r['token']==token]
        check(len(match)==1 and match[0]['rating']==4 and match[0]['name']=='','anonymous review not correctly saved')
        nav('reviews');check('اختبار واجهة العميل — خدمة ممتازة' in page.locator('.content').inner_text(),'review absent from admin list')
      run_step('public anonymous review submit and persistence',feedback,record)
      def mobile_drawer():
        if name!='mobile':return
        nav('home');page.locator('[data-action=menu]').click();check(page.locator('.sidebar.open').count()==1,'drawer did not open');snap('mobile-drawer-open.png')
        page.locator('.sidebar a[href="#/inventory"]').click();page.wait_for_timeout(100)
        check(page.locator('.content h1').inner_text()=='المخزون والبواقي','drawer navigation failed')
        check(page.locator('.sidebar.open').count()==0,'drawer stayed open after navigation')
      run_step('mobile drawer open, navigate and close',mobile_drawer,record)
      def theme():
        nav('home')
        if name=='mobile':page.locator('[data-action=menu]').click()
        page.locator('[data-action=theme]:visible').first.click();check(page.locator('body.dark').count()==1,'theme not activated')
        page.reload(wait_until='networkidle');check(page.locator('body.dark').count()==1,'theme not persisted');snap(f'{name}-dark-home.png')
      run_step('dark theme persists on reload',theme,record)
      if record['errors']:report['failures'].append({'viewport':name,'check':'browser errors','error':record['errors']})
      context.close()
    browser.close()
  (OUT/'ui-smoke-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
  print('SUMMARY',json.dumps({'checks':sum(len(v['checks']) for v in report['viewports'].values()),'failures':len(report['failures'])},ensure_ascii=False),flush=True)
  return bool(report['failures'])
if __name__=='__main__':
  try:raise SystemExit(main())
  except Exception as exc:
    report['environment_blocker']=str(exc)
    (OUT/'ui-smoke-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    raise

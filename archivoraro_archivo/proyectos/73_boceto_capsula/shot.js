const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type()==='error' && console.log('CON', m.text()));
  await p.goto('file://' + path.join(__dirname, 'b.html')); await p.waitForFunction(() => document.title === 'ready', null, { timeout: 180000 });
  for (const n of process.argv.slice(2).map(Number)) { await p.evaluate(n => window.shot(n), n); await p.screenshot({ path: path.join(__dirname, `b_${n}.png`), timeout: 300000 }); }
  await b.close(); console.log('ok'); })();

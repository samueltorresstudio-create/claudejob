const { chromium } = require('playwright'); const path = require('path');
(async () => { const ns = (process.argv[2] || '0').split(',').map(Number), pre = process.argv[3] || 's'; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CERR', m.text().slice(0, 300)); });
  await p.goto('file://' + path.join(__dirname, 'rio.html')); await p.waitForFunction(() => document.title === 'ready', null, { timeout: 180000 }); await p.evaluate(async () => { await document.fonts.load('900 40px Inter'); await document.fonts.ready; });
  for (const n of ns) { const t0 = Date.now(); await p.evaluate(n => window.shot(n), n); await p.screenshot({ path: path.join(__dirname, `${pre}_${n}.png`), timeout: 300000 }); console.log(n, Date.now() - t0, 'ms'); }
  await b.close(); })();

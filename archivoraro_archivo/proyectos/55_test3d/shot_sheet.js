const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(__dirname, 'sheet.html')); await p.waitForFunction(() => document.title === 'ready', null, { timeout: 120000 }); await p.evaluate(async () => { await document.fonts.load('900 100px Inter'); await document.fonts.ready; });
  for (const n of [1, 2, 3, 4]) { await p.evaluate(n => window.shot(n), n); await p.screenshot({ path: path.join(__dirname, `ch_${n}.png`), timeout: 300000 }); }
  await b.close(); console.log('ok'); })();

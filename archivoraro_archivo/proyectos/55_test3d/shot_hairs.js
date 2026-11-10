const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2000, height: 560 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(__dirname, process.argv[2] || 'hairs.html')); await p.waitForFunction(() => document.title === 'ready'); await p.evaluate(async () => { await document.fonts.load('900 40px Inter'); await document.fonts.ready; });
  await p.screenshot({ path: path.join(__dirname, process.argv[3] || 'hairs.png') }); await b.close(); console.log('ok'); })();

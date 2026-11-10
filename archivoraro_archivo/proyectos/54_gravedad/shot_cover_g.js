const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(__dirname, 'cover_g.html')); await p.waitForFunction(() => document.title === 'done'); await p.evaluate(async () => { await document.fonts.load('900 100px Inter'); await document.fonts.load('800 30px "JetBrains Mono"'); await document.fonts.ready; });
  await p.waitForTimeout(300); await p.screenshot({ path: path.join(__dirname, 'portada.png') }); await b.close(); console.log('ok'); })();

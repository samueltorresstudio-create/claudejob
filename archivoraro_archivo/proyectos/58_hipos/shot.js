const { chromium } = require('playwright'); const path = require('path');
(async () => { const [html, out, w, h] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +(w || 1080), height: +(h || 1920) } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(__dirname, html)); await p.waitForFunction(() => document.title === 'ready'); await p.evaluate(async () => { await document.fonts.load('900 40px Inter'); await document.fonts.ready; });
  await p.screenshot({ path: path.join(__dirname, out) }); await b.close(); console.log('ok'); })();

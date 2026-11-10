const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } }); p.on('pageerror', e => console.log('ERR', e.message));
  for (const a of process.argv.slice(2)) { const [s, v] = a.split(':'); await p.goto('file://' + path.join(__dirname, 'chars.html') + `?s=${s}&v=${v}`); await p.waitForFunction(() => document.title === 'done', null, { timeout: 60000 }); await p.evaluate(async () => { await document.fonts.ready; });
    await p.screenshot({ path: path.join(__dirname, `ch_${s}_${v}.png`) }); }
  await b.close(); console.log('ok'); })();

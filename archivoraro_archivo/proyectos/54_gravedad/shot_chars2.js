const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } }); p.on('pageerror', e => console.log('ERR', e.message));
  for (const a of process.argv.slice(2)) { const [w, v, x] = a.split(':'); await p.goto('file://' + path.join(__dirname, 'chars2.html') + `?w=${w}&v=${v}&x=${x || 'smile'}`); await p.waitForFunction(() => document.title === 'done', null, { timeout: 60000 });
    await p.screenshot({ path: path.join(__dirname, `c2_${w}_${v}_${x || 'smile'}.png`) }); }
  await b.close(); console.log('ok'); })();

const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1170, height: 2080 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(__dirname, 't2.html'));
  for (const [f, ov, out] of [['serio', 1, 'ov'], ['serio', 0, 't_serio'], ['preocupado', 0, 't_preo'], ['sorpresa', 0, 't_sorp'], ['feliz', 0, 't_feliz']]) { await p.evaluate(([f, ov]) => window.shot(f, ov), [f, ov]); await p.waitForTimeout(300); await p.screenshot({ path: path.join(__dirname, out + '.png') }); }
  await b.close(); console.log('ok'); })();

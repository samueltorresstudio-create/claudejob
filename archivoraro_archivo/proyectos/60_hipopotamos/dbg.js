const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(500);
  const info = await p.evaluate(() => ({ xG, zG, yG, rb: rb(zG), mid: W2.mid(zG), h: [0, 2, 4, 6, 8, 10, 12].map(d => +W2.hgt(rb(zG) + d, zG).toFixed(2)) })); console.log(JSON.stringify(info));
  for (const [n, c] of [['a', [-30, 6, 18]], ['b', [-18, 3, 0]]]) { await p.evaluate(c => { const cam = V3(xG + c[0], c[1], zG + c[2]); W2.setCam(cam, V3(xG, 2, zG), 50, 20, .0005); W2.render(); document.getElementById('fx').innerHTML = ''; document.getElementById('cap').innerHTML = ''; }, c); await p.screenshot({ path: `dbg_${n}.png` }); }
  await b.close(); })();

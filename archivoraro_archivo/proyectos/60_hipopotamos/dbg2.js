const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log('LOG', m.text().slice(0,200)));
  await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(500);
  console.log(await p.evaluate(() => { let n = 0, ink = 0; W2.scene.traverse(o => { if (o.isMesh) { n++; if (o.material === W2.inkM) ink++; } }); return [n, ink, typeof W2.inkM]; }));
  await b.close(); })();

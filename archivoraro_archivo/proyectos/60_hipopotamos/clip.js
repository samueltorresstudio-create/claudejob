const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const [a, b, out] = process.argv.slice(2); const dir = path.join(__dirname, out); fs.mkdirSync(dir, { recursive: true });
  const br = await chromium.launch(); const open = async () => { const p = await br.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message)); await p.goto('file://' + path.join(__dirname, 'index.html')); await p.evaluate(async () => { await document.fonts.ready; }); return p; };
  const N0 = Math.round(+a * 30), N1 = Math.round(+b * 30); let next = N0; const ps = await Promise.all([0, 1, 2, 3].map(open));
  await Promise.all(ps.map(async p => { while (true) { const i = next++; if (i >= N1) break; await p.evaluate(t => window.render(t), i / 30); await p.screenshot({ path: path.join(dir, `f${String(i - N0).padStart(4, '0')}.png`), timeout: 300000 }); } }));
  await br.close(); console.log('ok', N1 - N0); })();

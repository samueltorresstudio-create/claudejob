const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const mode = process.argv[2] || 'preview'; const b = await chromium.launch();
  const open = async () => { const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CERR', m.text().slice(0, 200)); });
    await p.goto('file://' + path.join(__dirname, 'test.html')); await p.waitForFunction(() => document.title === 'ready', null, { timeout: 120000 }); await p.evaluate(async () => { await document.fonts.load('900 100px Inter'); await document.fonts.ready; }); return p; };
  if (mode === 'preview') { const p = await open(); for (const t of process.argv[3].split(',').map(Number)) { const t0 = Date.now(); await p.evaluate(t => window.render(t), t); await p.screenshot({ path: path.join(__dirname, `pv_${t}.png`), timeout: 300000 }); console.log(t, Date.now() - t0); } }
  else { fs.mkdirSync(path.join(__dirname, 'fr'), { recursive: true }); const N = Math.round(5.2 * 30); let next = 0; const ps = await Promise.all([0, 1, 2, 3].map(open));
    await Promise.all(ps.map(async p => { while (true) { const i = next++; if (i >= N) break; await p.evaluate(t => window.render(t), i / 30); await p.screenshot({ path: path.join(__dirname, 'fr', `f${String(i).padStart(4, '0')}.png`), timeout: 300000 }); } })); console.log('frames', N); }
  await b.close(); })();

// node probe.js t → imprime dónde se proyectan el balón y los personajes en ese instante (sin capturar)
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path');
(async () => { const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } }); await pg.addInitScript(() => { window.FAST_PREVIEW = 1; });
  pg.on('pageerror', e => console.log('PAGE ERROR', e.message)); await pg.goto('file://' + path.join(__dirname, 'index.html')); await pg.evaluate(async () => { await window.READY; });
  for (const t of process.argv.slice(2).map(Number)) { const r = await pg.evaluate(t => { window.render(t); const b = W2.BALL, q = W2.proj(b.position); const c = W2.camera.position; return { t, ballVis: b.visible, ball: [+b.position.x.toFixed(2), +b.position.y.toFixed(2), +b.position.z.toFixed(2)], scr: [Math.round(q.x), Math.round(q.y), +q.d.toFixed(1)], cam: [c.x, c.y, c.z].map(v => +v.toFixed(2)) }; }, t); console.log(JSON.stringify(r)); }
  await br.close(); })();

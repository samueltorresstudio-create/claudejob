// node probe2.js t "x,y,z" ... → pantalla de puntos del mundo en ese instante
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path');
(async () => { const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } }); await pg.addInitScript(() => { window.FAST_PREVIEW = 1; });
  await pg.goto('file://' + path.join(__dirname, 'index.html')); await pg.evaluate(async () => { await window.READY; });
  const t = +process.argv[2], pts = process.argv.slice(3).map(s => s.split(',').map(Number));
  const r = await pg.evaluate(([t, pts]) => { window.render(t); return pts.map(p => { const q = W2.proj(new THREE.Vector3(...p)); return [Math.round(q.x), Math.round(q.y), Math.round(q.ppm)]; }); }, [t, pts]); console.log(JSON.stringify(r)); await br.close(); })();

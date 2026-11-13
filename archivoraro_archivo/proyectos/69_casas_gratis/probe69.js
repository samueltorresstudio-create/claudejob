// node probe69.js "camPos" "look" fov "targetX,targetY" [y=0] → punto del suelo (y) que cae en ese píxel
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path');
(async () => { const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.goto('file://' + path.join(__dirname, 'boceto.html')); await pg.evaluate(async () => { await window.READY; });
  const [cp, lk, fov, tg, y0] = process.argv.slice(2);
  const r = await pg.evaluate(([cp, lk, fov, tg, y0]) => { const c = cp.split(',').map(Number), l = lk.split(',').map(Number), t = tg.split(',').map(Number), Y = +(y0 || 0);
    W2.setCam(V3(...c), V3(...l), +fov); const cam = W2.camera, T = W2.T; const ndc = new T.Vector3(t[0] / 540 - 1, 1 - t[1] / 960, .5).unproject(cam); const dir = ndc.sub(cam.position).normalize(); const k = (Y - cam.position.y) / dir.y; const p = cam.position.clone().addScaledVector(dir, k); return [p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2), k.toFixed(2)]; }, [cp, lk, fov, tg, y0]);
  console.log(r.join(' ')); await br.close(); })();

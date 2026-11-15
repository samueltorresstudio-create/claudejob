const { chromium } = require('/opt/node-tools/node_modules/playwright'); const path = require('path');
const C = JSON.parse(process.argv[2]);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'index.html'));
  const r = await p.evaluate(C => { const V = (x, y, z) => new THREE.Vector3(x, y, z), D = W2.DT, out = [];
    for (const c of C) { W2.setCam(V(D.x + c.cx, c.cy, D.z + c.cz), V(D.x + c.lx, c.ly, D.z + c.lz), c.f); W2.camera.updateMatrixWorld();
      const right = new THREE.Vector3().setFromMatrixColumn(W2.camera.matrixWorld, 0);
      const H = { pepe: [-1.02, 1.15, -.85], luis: [0, 1.15, -.85], toni: [1.02, 1.15, -.85], cam: [c.wx, 1.45, c.wz] }; const row = [JSON.stringify(c)];
      for (const k in H) { const [x, y, z] = H[k]; const P = V(D.x + x, y, D.z + z), a = W2.proj(P), e = W2.proj(P.clone().addScaledVector(right, .39)); const rr = Math.abs(e.x - a.x); row.push(`${k}:${(a.x - rr).toFixed(0)}..${(a.x + rr).toFixed(0)}`); }
      out.push(row.join(' ')); } return out; }, C);
  console.log(r.join('\n')); await b.close(); })();

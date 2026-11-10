W2.charLight = { tint: '#ffd9b0', k: .14, rim: '#fff0d6', rimA: .65, rimX: -1, rimY: -.4 };
const PESC = { outfit: 'shirt', top: '#f3efe2', topD: '#cfc7b3', pants: '#3b4a63', belt: '#5a3a22', scarf: '#d63c2f', hat: 'vueltiao', mustache: '#2a1a12', bag: '#8a5228', shoes: '#5a3a22', sole: '#2a2a2a', belly: 1.12 };
// near side of the canoe hull drawn in 2D over the fisherman's feet, so he stands INSIDE the canoe
function hullFront(W, cam) { const g = W.HERO; g.updateMatrixWorld(true); const pts = [], bot = [];
  for (let i = 0; i <= 24; i++) { const th = -Math.PI / 2 + i / 24 * Math.PI, z = 3.4 * Math.sin(th) * g.scale.z, x = .62 * Math.cos(th);
    const sd = new W.T.Vector3(-.62, 0, 0).applyMatrix4(g.matrixWorld).distanceTo(cam) < new W.T.Vector3(.62, 0, 0).applyMatrix4(g.matrixWorld).distanceTo(cam) ? -1 : 1;
    pts.push(W.proj(new W.T.Vector3(sd * x, 0, z).applyMatrix4(g.matrixWorld))); bot.push(W.proj(new W.T.Vector3(0, -.38 * Math.cos(th), z).applyMatrix4(g.matrixWorld))); }
  const d = 'M' + pts.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' L') + ' L' + bot.reverse().map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' L') + 'Z';
  return `<path d="${d}" fill="#3f8fa0" stroke="#1b1720" stroke-width="8" stroke-linejoin="round"/><path d="M${pts.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' L')}" stroke="#5e3a20" stroke-width="12" fill="none" stroke-linecap="round"/>`; }
window.shot = function (n) { const W = W2; window.__T = n * .37; W.setTime(3 + n); let s = '';
  const z0 = -30, rb = W.mid(z0) + W.RW;
  if (n === 0 || n === 1) { const st = n ? 'B' : 'A'; W.setCam(V3(rb - 3.6, 1.0, z0 + 4.6), V3(rb + 1.0, 1.0, z0), 40, 5.6, .003); W.render();
    const f = V3(rb + .6, W.hgt(rb + .6, z0), z0); s += hippoAt({ style: st, look: [-6, 2], turn: -.3, wet: n === 1 }, f, f.clone().add(V3(0, 1.75, 0)), W); }
  if (n === 2) { W.setCam(V3(rb - 8.5, .9, z0 + 6.5), V3(rb - 3.5, .8, z0 - 1), 42, 7.5, .003); W.render();
    const fA = V3(rb - 1.4, -.22, z0 - 2.4), fB = V3(rb - 4.6, -.25, z0 - .2);
    s += hippoAt({ style: 'A', open: 1, look: [0, -4], wet: true }, fA, fA.clone().add(V3(0, 1.75, 0)), W, { water: 0 });
    s += hippoAt({ style: 'B', open: 1, wet: true, turn: .2 }, fB, fB.clone().add(V3(0, 1.75, 0)), W, { water: 0 }); }
  if (n === 3) { const cz = -8, cx = W.mid(cz) + 4; W.HERO.position.set(cx, .12, cz); W.HERO.rotation.y = .25; W.HERO.scale.set(1, 1, .62);
    W.setCam(V3(cx - 2.6, 1.6, cz + 5.2), V3(cx + .2, 1.25, cz - 1.5), 44, 5.6, .003); W.render();
    const fh = V3(cx + 3.2, -1.25, cz - 4.5); s += hippoAt({ style: 'B', look: [-8, 4], wet: true, turn: -.4 }, fh, fh.clone().add(V3(0, 1.75, 0)), W, { water: 0 });
    s += stickAt(Object.assign({}, PESC, { face: 'wide', mouth: 'grin', brows: 1, sweat: true, prop: 'paddle', armL: [40, 60], armR: [60, 70], turn: .55, look: [10, -2], lift: [0, 0] }), V3(cx, -.12, cz), V3(cx, 1.5, cz), W) + hullFront(W, W.camera.position); }
  if (n === 4) { const cz = -8, cx = W.mid(cz) + 4; W.HERO.position.set(cx, .12, cz); W.HERO.rotation.y = .25; W.HERO.scale.set(1, 1, .62);
    W.setCam(V3(cx - 1.2, 1.55, cz + 3.0), V3(cx, 1.45, cz), 40, 3.2, .004); W.render();
    s += stickAt(Object.assign({}, PESC, { face: 'smug', mouth: 'smile', prop: 'paddle', armL: [16, 24], armR: [30, 60], turn: .3, look: [4, 0] }), V3(cx, -.12, cz), V3(cx, 1.5, cz), W) + hullFront(W, W.camera.position); }
  document.getElementById('sv').innerHTML = s; };
document.title = 'ready';

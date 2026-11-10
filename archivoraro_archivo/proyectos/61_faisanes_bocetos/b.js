const W = W2; W.charLight = { tint: '#fff2dc', k: .12, rim: '#ffffff', rimA: .5, rimX: -1, rimY: -.5 };
const ES = { outfit: 'navy', top: '#1d2740', topD: '#121a2e', hat: 'peaked', hair2: 'side', hairCol: '#2a1a12', badge: true, mustache: null, pants: '#1d2740', shoes: '#15161c', sole: '#15161c' };
const FR = { outfit: 'marin', top: '#f6f6f2', topD: '#d6d6cf', hat: 'bachi', hair2: null, stripe: '#1f3a7a', collar: '#1f3a7a', pants: '#1f2a4a', shoes: '#15161c', sole: '#15161c', mustache: '#3a2418' };
window.shot = function (n) { W.setTime(2 + n); let s = '';
  const y = W.ISLAND_Y;
  if (n === 0) { W.setCam(V3(0, 34, 62), V3(0, 0, -40), 62, 110, .0003); W.render(); }                                            // wide: the island between Spain and France
  if (n === 1) { W.setCam(V3(-.3, y + 1.4, -22.2), V3(0, y + 1.75, -34), 44, 7.8, .0022); W.render();                       // the two officers at the monument
    s += stickAt(Object.assign({}, ES, { face: 'smug', mouth: 'smirk', look: [8, 0], turn: .45, armL: [16, 24], armR: [20, 30] }), V3(-1.35, y, -29.6), V3(-1.35, y + 1.68, -29.6), W);
    s += stickAt(Object.assign({}, FR, { face: 'smug', mouth: 'smile', look: [-8, 0], turn: -.45, armL: [20, 30], armR: [16, 24] }), V3(1.35, y, -29.9), V3(1.35, y + 1.62, -29.9), W); }
  if (n === 2) { W.setCam(V3(-.6, y + 1.5, -30.2), V3(-1.5, y + 1.45, -32), 34, 2.2, .005); W.render();
    s += stickAt(Object.assign({}, ES, { face: 'open', mouth: 'smile', look: [6, 0], turn: .3, armL: [16, 24], armR: [130, 40] }), V3(-1.5, y, -32), V3(-1.5, y + 1.68, -32), W); }
  if (n === 3) { W.setCam(V3(.6, y + 1.5, -30.4), V3(1.5, y + 1.42, -32.4), 34, 2.2, .005); W.render();
    s += stickAt(Object.assign({}, FR, { face: 'happy', mouth: 'laugh', look: [-6, 0], turn: -.3, armL: [130, 40], armR: [16, 24] }), V3(1.5, y, -32.4), V3(1.5, y + 1.62, -32.4), W); }
  document.getElementById('sv').innerHTML = s; };
document.title = 'ready';

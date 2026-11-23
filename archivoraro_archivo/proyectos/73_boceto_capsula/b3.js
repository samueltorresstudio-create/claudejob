const W = W2; let CH = null;
window.shot = function (n) { W.setTime(2); let s = '';
  if (!CH) { CH = char3d(W, { top: 0x2a5d8a, armR: [[.08, -.05, .06], [.1, .1, .12]] }); CH.position.set(-1.2, 0, -1.9); CH.rotation.y = .12; }
  const F = ['picaro', 'serio', 'preocupado', 'sorpresa', 'feliz'][n]; setFace(CH, F);
  if (n === 0) W.setCam(V3(-1.0, 1.15, .75), V3(-1.2, .98, -1.9), 40, null, .009);
  else W.setCam(V3(-1.08, 1.42, .05), V3(-1.2, 1.3, -1.9), 34, null, .012);
  W.render(); document.getElementById('fx').innerHTML = s; };
document.title = 'ready';

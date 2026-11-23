const W = W2; let CH = null;
const SH = [ // [cara, cámara, mirar, fov, apertura]
  ['serio', [-1.12, 1.5, .1], [-1.2, 1.32, -1.9], 40, .016],
  ['serio', [-1.0, 1.1, .9], [-1.2, .95, -1.9], 40, .012],
  ['preocupado', [-1.12, 1.62, -.2], [-1.2, 1.55, -1.9], 36, .02],
  ['sorpresa', [-1.12, 1.62, -.2], [-1.2, 1.55, -1.9], 36, .02],
  ['picaro', [-1.12, 1.62, -.2], [-1.2, 1.55, -1.9], 36, .02],
  ['feliz', [-1.12, 1.62, -.2], [-1.2, 1.55, -1.9], 36, .02]];
window.shot = function (n) { W.setTime(2);
  if (!CH) { W.inkM.visible = false; W.dof.uniforms.maxblur.value = .02; document.getElementById('gl').style.filter = 'saturate(.82) sepia(.12)'; CH = char3d(W, {}); CH.position.set(-1.2, 0, -1.9); CH.rotation.y = .05; }
  const [f, cp, lk, fov, ap] = SH[n]; setFace(CH, f); W.setCam(V3(...cp), V3(...lk), fov, null, ap); W.render(); document.getElementById('fx').innerHTML = ''; };
document.title = 'ready';

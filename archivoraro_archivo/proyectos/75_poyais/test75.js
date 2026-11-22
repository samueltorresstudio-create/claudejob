window.READY = W2.READY_W;
const DAYL = { tint: '#ffe8c8', k: .12, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.6 };
window.shot = (name, o) => { const W = W2; W.site(o.site); W.setTime(o.t || 3); W.setMood(o.mood || 'poyais'); W.charLight = DAYL; (o.pre || []).forEach(f => new Function('W', 'V3', f)(W, V3)); W.setCam(V3(...o.p), V3(...o.l), o.f || 40); W.render();
  const L = (o.chars || []).map(([n, x, z, pose, h, y0]) => { const F = V3(x, y0 ?? W.ground(x, z), z); return [W.camera.position.distanceTo(F), who(n, pose || {}, F, h || ADULT, { gy: F.y })]; }).sort((a, b) => b[0] - a[0]).map(a => a[1]).join('');
  document.getElementById('fx').innerHTML = L + (o.fx ? new Function('W', 'V3', 'return ' + o.fx)(W, V3) : ''); };

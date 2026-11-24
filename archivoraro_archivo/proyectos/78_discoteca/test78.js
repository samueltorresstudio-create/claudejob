window.READY = W2.READY_W;
const LIGHTS = { calle: { tint: '#e8d8ff', k: .2, rim: '#ff4fb8', rimA: .75, rimX: -1, rimY: -.6 }, pista: { tint: '#ffd0f4', k: .26, rim: '#4ff0ff', rimA: .8, rimX: 1, rimY: -.6 }, aula: { tint: '#fff4e0', k: .08, rim: '#ffffff', rimA: .4, rimX: -1, rimY: -.6 } };
window.shot = (name, o) => { const W = W2; W.site(o.site); W.setTime(o.t || 3); W.setMood(o.mood || 'calle'); W.charLight = LIGHTS[o.mood || 'calle'];
  (o.pre || []).forEach(f => new Function('W', 'V3', f)(W, V3)); W.setCam(V3(...o.p), V3(...o.l), o.f || 40, o.focus || null, o.ap ?? .0004); W.render();
  const L = (o.chars || []).map(([n, x, z, pose0, h, y0]) => { const pose = Object.assign({}, pose0 || {}); ['holdRn', 'holdLn'].forEach(k => { if (pose[k]) { pose[k.slice(0, 5)] = new Function('return (' + pose[k] + ')')(); delete pose[k]; } }); const F = V3(x, y0 ?? 0, z); let sv = who(n, pose || {}, F, h || ADULT, { gy: F.y }); return [W.camera.position.distanceTo(F), sv]; }).sort((a, b) => b[0] - a[0]).map(a => a[1]).join('');
  document.getElementById('fx').innerHTML = L + (o.fx ? new Function('W', 'V3', 'return ' + o.fx)(W, V3) : ''); };

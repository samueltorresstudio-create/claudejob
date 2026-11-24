window.READY = W2.READY_W;
const LIGHTS = { calle: { tint: '#e8d8ff', k: .2, rim: '#ff4fb8', rimA: .75, rimX: -1, rimY: -.6 }, pista: { tint: '#ffd0f4', k: .26, rim: '#4ff0ff', rimA: .8, rimX: 1, rimY: -.6 }, aula: { tint: '#fff4e0', k: .08, rim: '#ffffff', rimA: .4, rimX: -1, rimY: -.6 } };
window.shot = (name, o) => { const W = W2; W.site(o.site); W.setTime(o.t || 3); W.setMood(o.mood || 'calle'); W.charLight = LIGHTS[o.mood || 'calle'];
  (o.pre || []).forEach(f => new Function('W', 'V3', f)(W, V3)); W.setCam(V3(...o.p), V3(...o.l), o.f || 40, o.focus || null, o.ap ?? .0004); W.render();
  const L = (o.chars || []).map(([n, x, z, pose0, h, y0]) => { const pose = Object.assign({}, pose0 || {}); ['holdRn', 'holdLn'].forEach(k => { if (pose[k]) { pose[k.slice(0, 5)] = new Function('return (' + pose[k] + ')')(); delete pose[k]; } }); const F = V3(x, y0 ?? 0, z); let sv = who(n, pose || {}, F, h || ADULT, { gy: F.y }); return [W.camera.position.distanceTo(F), sv]; }).sort((a, b) => b[0] - a[0]).map(a => a[1]).join('');
  // personajes estilo .99 (pj99): [función, x, z, cara, altura, {flip, sombra}]
  const TINT = { calle: '0.93 0 0 0 0.03  0 0.88 0 0 0.0  0 0 1.0 0 0.05  0 0 0 1 0', pista: '0.95 0 0 0 0.05  0 0.85 0 0 0  0 0 1.0 0 0.06  0 0 0 1 0', aula: '1 0 0 0 0  0 0.98 0 0 0  0 0 0.94 0 0  0 0 0 1 0' };
  const PJ = (o.pj || []).map(([fn, x, z, face, h, op]) => { op = op || {}; const F = V3(x, 0, z), a = W.proj(F), b = W.proj(V3(x, h || 1.8, z)); if (!a.ok) return [0, '']; const s = (a.y - b.y) / 1700;
      const svg = window[fn](Object.assign({ face }, op.o || {})); const fl = op.flip ? `translate(${(1190 * s).toFixed(1)},0) scale(-1,1)` : '';
      return [W.camera.position.distanceTo(F), `<g transform="translate(${(a.x - 595 * s).toFixed(1)},${(a.y - 2100 * s).toFixed(1)}) scale(${s.toFixed(4)}) ${fl}" filter="url(#tintF)">${svg}</g>`]; })
    .sort((a, b) => b[0] - a[0]).map(a => a[1]).join('');
  const defs = `<defs><filter id="tintF" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${TINT[o.mood || 'calle']}"/></filter></defs>`;
  document.getElementById('fx').innerHTML = defs + L + PJ + (o.fx ? new Function('W', 'V3', 'return ' + o.fx)(W, V3) : ''); };

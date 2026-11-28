window.READY = W2.READY_W;
const TINT = { establo: '1.02 0 0 0 0.02  0 0.98 0 0 0.01  0 0 0.9 0 0  0 0 0 1 0', prado: '1 0 0 0 0.02  0 1 0 0 0.02  0 0 0.98 0 0.02  0 0 0 1 0', pasillo: '1.0 0 0 0 0.03  0 0.96 0 0 0.01  0 0 0.92 0 0  0 0 0 1 0', hoja: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0' };
// borde de luz (rim) del color de la luz principal: copia de la silueta desplazada, teñida y recortada por la propia silueta
const RIM = { establo: ['#ffe6a8', -7, -4, .55], prado: ['#fff6dc', -7, -5, .5], pasillo: ['#ffb870', -8, -3, .6], hoja: ['#ffffff', 0, 0, 0] };
window.shot = (name, o) => { const W = W2; const mood = o.mood || 'establo';
  document.getElementById('gl').style.visibility = o.sheet ? 'hidden' : 'visible';
  if (!o.sheet) { W.site(o.site); W.setTime(o.t || 3); W.setMood(mood); W.doorMode(o.door || 'real'); W.setChalk(o.chalk ?? 22);
    W.setCam(V3(...o.p), V3(...o.l), o.f || 40, o.focus || null, o.ap ?? .0004); W.render(); }
  const [rc, rx, ry, ra] = RIM[mood];
  const PJ = (o.pj || []).map(([fn, x, z, face, h, op], i) => { op = op || {}; let a, b; if (o.sheet) { a = { x: x, y: z, ok: 1 }; b = { x, y: z - h * 760 }; } else { const F = V3(x, 0, z); a = W.proj(F); b = W.proj(V3(x, h || 1.8, z)); } if (!a.ok) return [0, ''];
      const s = (a.y - b.y) / (1700 + (window.PJ_LEG ?? 380)); const svg = window[fn](Object.assign({ face }, op.o || {})); const fl = op.flip ? `translate(1190,0) scale(-1,1)` : '';
      const d = o.sheet ? 0 : W.camera.position.distanceTo(V3(x, 0, z));
      return [d, `<g transform="translate(${(a.x - 595 * s).toFixed(1)},${(a.y - 2100 * s).toFixed(1)}) scale(${s.toFixed(4)})"><g transform="${fl}" filter="url(#rimF${i})">${svg}</g></g>
        <defs><filter id="rimF${i}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${TINT[mood]}" result="t"/>
        <feOffset in="SourceAlpha" dx="${(rx / s * .9).toFixed(1)}" dy="${(ry / s * .9).toFixed(1)}" result="off"/><feComposite in="SourceAlpha" in2="off" operator="out" result="edge"/><feGaussianBlur in="edge" stdDeviation="${(2 / s).toFixed(1)}" result="eb"/>
        <feFlood flood-color="${rc}" flood-opacity="${ra}"/><feComposite in2="eb" operator="in" result="rim"/><feComposite in="rim" in2="SourceAlpha" operator="in" result="rim2"/><feMerge><feMergeNode in="t"/><feMergeNode in="rim2"/></feMerge></filter></defs>`]; })
    .sort((a, b) => b[0] - a[0]).map(a => a[1]).join('');
  const bg = o.sheet ? `<defs><radialGradient id="shbg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#f4ecdc"/><stop offset="1" stop-color="#c8b89a"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#shbg)"/>` : '';
  document.getElementById('fx').innerHTML = bg + PJ + (o.fx || ''); };

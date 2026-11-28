window.READY = W2.READY_W;
// tinte por ambiente (blancos a ≤.95 en los brillantes para que la vaca no se queme)
const TINT = { establo: '.95 0 0 0 .01  0 .96 0 0 .01  0 0 .98 0 .02  0 0 0 1 0', establo27: '1.0 0 0 0 .03  0 .97 0 0 .01  0 0 .86 0 0  0 0 0 1 0', noche: '.78 0 0 0 0  0 .82 0 0 .01  0 0 .95 0 .03  0 0 0 1 0',
  nieve: '.94 0 0 0 .01  0 .96 0 0 .01  0 0 1.0 0 .02  0 0 0 1 0', prado: '.95 0 0 0 .02  0 .96 0 0 .02  0 0 .92 0 .01  0 0 0 1 0', sueno: '1.0 0 0 0 .04  0 .95 0 0 .02  0 0 .84 0 0  0 0 0 1 0',
  tele: '.8 0 0 0 0  0 .86 0 0 .01  0 0 1.0 0 .04  0 0 0 1 0', pasillo: '1.0 0 0 0 .03  0 .96 0 0 .01  0 0 .92 0 0  0 0 0 1 0', hoja: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0' };
// borde de luz principal (del lado del sol del ambiente) + contraluz del color opuesto + halo oscuro detrás de la silueta
const RIM = { establo: ['#e8f0ff', 1, .7, '#ffd08a', .3], establo27: ['#ffe0a8', 1, .85, '#8ab0ff', .3], noche: ['#9fd0ff', -1, .8, '#ffb060', .45], nieve: ['#e8f0ff', -1, .6, '#ffb070', .3],
  prado: ['#fff4d0', -1, .5, '#a8d0ff', .3], sueno: ['#ffe0a0', 1, .8, '#ffffff', .2], tele: ['#9fc4ff', -1, .8, '#ffcf8a', .4], pasillo: ['#ffb870', -1, .6, '#c8d8ff', .3], hoja: ['#ffffff', 1, 0, '#ffffff', 0] };
window.shot = (name, o) => { const W = W2; const mood = o.mood || 'establo';
  document.getElementById('gl').style.visibility = o.sheet ? 'hidden' : 'visible';
  if (!o.sheet) { W.site(o.site); W.setTime(o.t || 3); W.setMood(mood); W.doorMode(o.door || 'real'); W.setChalk(o.chalk ?? 22);
    W.setCam(V3(...o.p), V3(...o.l), o.f || 40, o.focus || null, o.ap ?? .0004); W.render(); }
  const [rc, rs, ra, bc, ba] = RIM[mood];
  const PJ = (o.pj || []).map(([fn, x, z, face, h, op], i) => { op = op || {}; let a, b; if (o.sheet) { a = { x: x, y: z, ok: 1 }; b = { x, y: z - h * 760 }; } else { const F = V3(x, 0, z); a = W.proj(F); b = W.proj(V3(x, h || 1.8, z)); } if (!a.ok) return [0, ''];
      const s = (a.y - b.y) / (1700 + (window.PJ_LEG ?? 380)); const svg = window[fn](Object.assign({ face, id: fn.slice(0, 3) + i }, op.o || {})); const fl = op.flip ? `translate(1190,0) scale(-1,1)` : '';
      const d = o.sheet ? 0 : W.camera.position.distanceTo(V3(x, 0, z)), k = 1 / s, dx = (rs * 11 * k * .9).toFixed(1), dy = (-6 * k * .9).toFixed(1);
      // el filtro va en el grupo EXTERIOR y el volteo en el interior (si no, el borde de luz sale del lado contrario al voltear)
      return [d, `<defs><filter id="rimF${i}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="${TINT[mood]}" result="t"/>
        <feOffset in="SourceAlpha" dx="${dx}" dy="${dy}" result="off"/><feComposite in="SourceAlpha" in2="off" operator="out" result="edge"/><feGaussianBlur in="edge" stdDeviation="${(3 * k * .6).toFixed(1)}" result="eb"/>
        <feFlood flood-color="${rc}" flood-opacity="${ra}"/><feComposite in2="eb" operator="in" result="rim"/><feComposite in="rim" in2="SourceAlpha" operator="in" result="rim2"/>
        <feOffset in="SourceAlpha" dx="${(-dx * .8).toFixed(1)}" dy="${dy}" result="off2"/><feComposite in="SourceAlpha" in2="off2" operator="out" result="edge2"/><feGaussianBlur in="edge2" stdDeviation="${(2.5 * k * .6).toFixed(1)}" result="eb2"/>
        <feFlood flood-color="${bc}" flood-opacity="${ba}"/><feComposite in2="eb2" operator="in" result="bk"/><feComposite in="bk" in2="SourceAlpha" operator="in" result="bk2"/>
        <feGaussianBlur in="SourceAlpha" stdDeviation="${(14 * k * .5).toFixed(1)}" result="hb"/><feOffset in="hb" dy="${(6 * k * .5).toFixed(1)}" result="hb2"/><feFlood flood-color="#000" flood-opacity=".28"/><feComposite in2="hb2" operator="in" result="halo"/>
        <feMerge><feMergeNode in="halo"/><feMergeNode in="t"/><feMergeNode in="rim2"/><feMergeNode in="bk2"/></feMerge></filter></defs>
        <g transform="translate(${(a.x - 595 * s).toFixed(1)},${(a.y - 2100 * s).toFixed(1)}) scale(${s.toFixed(4)})" filter="${o.sheet ? '' : `url(#rimF${i})`}"><g transform="${fl}">${svg}</g></g>`]; })
    .sort((a, b) => b[0] - a[0]).map(a => a[1]).join('');
  const bg = o.sheet ? `<defs><radialGradient id="shbg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#f4ecdc"/><stop offset="1" stop-color="#c8b89a"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#shbg)"/>` : '';
  document.getElementById('fx').innerHTML = bg + PJ + (o.fx || ''); };

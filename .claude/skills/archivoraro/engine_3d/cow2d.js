// Archivo Raro · vaca 2D (estilo de los personajes: contorno grueso, cabeza grande que mira a cámara, ojos con párpado).
// cow2(o): de perfil mirando a la derecha, pies en y=0, 462 unidades ≈ 1,45 m (altura de la cruz + cabeza).
// o.stripes: null | 'white' (cebra) | 'black' (rayas negras sobre negro, solo brillan un poco); o.wet: pintura fresca (brillos y gotas);
// o.eyes: 'lid' | 'annoyed' | 'wide' | 'closed'; o.mouth: 'chew' | 'moo' | 'flat'; o.chew 0..1; o.tail -1..1 (coletazo); o.tag: número del crotal;
// o.headTurn -1..1; o.twitch: líneas de piel temblando. cowAt(o, pies, W, {face:'left', blur, light}) la ancla en el 3D.
// flySwarm(cx, cy, s, n, t, o) dibuja moscas en pantalla (o.land: posadas sobre el lomo, o.miss: se pasan de largo / chocan).
function cow2(o = {}) {
  const K = '#120d10', C = o.col || '#2b2529', CD = mixC(C, '#000000', .45), CL = mixC(C, '#ffffff', .2), id = 'cw' + (++_sid);
  const WH = o.paint || '#f6f3ec', PK = '#e8a4a8';
  const body = smoothPath([[-326, -416], [-262, -436], [-170, -420], [-60, -408], [60, -418], [150, -432], [214, -414], [252, -372], [258, -300], [236, -232], [176, -200], [60, -184], [-60, -180], [-170, -198], [-236, -218], [-300, -246], [-344, -300], [-350, -372]]);
  const legP = (x, w, top, back) => back ? `M${x - w * .9},${top} Q${x - w * 1.25},${top + 90} ${x - w * .5},${-120} L${x - w * .48},-34 L${x + w * .52},-34 L${x + w * .6},-120 Q${x + w * 1.1},${top + 70} ${x + w * .9},${top}Z`
    : `M${x - w * .55},${top} L${x - w * .5},-34 L${x + w * .5},-34 L${x + w * .55},${top}Z`;
  const hoof = (x, w) => `<path d="M${x - w * .55},-36 L${x + w * .55},-36 L${x + w * .62},-2 Q${x},4 ${x - w * .62},-2Z" fill="#3a3438" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M${x},-30 L${x},0" stroke="${K}" stroke-width="4"/>`;
  const LEGS = [[-272, 46, -262, 1, 1], [150, 38, -230, 0, 1], [-222, 50, -262, 1, 0], [196, 40, -230, 0, 0]];  // x, ancho, arriba, trasera, lejana
  // rayas pintadas (cebra o negras); el contorno de cada raya tiembla un poco, como hecho con brocha
  const stripeBand = (x0, w, y0, y1, bend, k) => { const wob = j => Math.sin(k * 7.3 + j * 2.1) * 5; return `M${x0},${y0} C${x0 + bend + wob(1)},${y0 + (y1 - y0) * .33} ${x0 - bend + wob(2)},${y0 + (y1 - y0) * .66} ${x0 + wob(3)},${y1} L${x0 + w + wob(4)},${y1} C${x0 + w - bend + wob(5)},${y0 + (y1 - y0) * .66} ${x0 + w + bend + wob(6)},${y0 + (y1 - y0) * .33} ${x0 + w},${y0}Z`; };
  const stripeFill = o.stripes === 'black' ? '#0c090b' : WH;
  const gloss = (d) => o.stripes === 'black' || o.wet ? `<path d="${d}" fill="none" stroke="#ffffff" stroke-opacity="${o.stripes === 'black' ? .22 : .35}" stroke-width="3" transform="translate(-3,-2)"/>` : '';
  let bodyStripes = '', legStripes = '', headStripes = '';
  if (o.stripes) {
    const xs = [-318, -262, -200, -140, -78, -16, 46, 104, 160, 214];
    xs.forEach((x, k) => { if (o.paintTo != null && x > o.paintTo) return; const w = 24 + (k * 13) % 14, d = stripeBand(x, w, -450, -170, 18 + (k % 3) * 8, k); bodyStripes += `<path d="${d}" fill="${stripeFill}"/>` + gloss(d);
      if (o.wet && o.stripes === 'white' && k % 2 === 0) bodyStripes += `<path d="M${x + w * .3},-200 q-3,26 3,34 q7,-6 2,-34Z" fill="${WH}"/>`; });
    [-300, -250].forEach((y, k) => { const d = `M-360,${y} Q-300,${y - 16} -250,${y + 6} L-250,${y + 24} Q-300,${y + 6} -360,${y + 22}Z`; bodyStripes += `<path d="${d}" fill="${stripeFill}"/>`; }); // anca: rayas horizontales
    LEGS.forEach(([x, w]) => { if (o.paintTo != null && x > o.paintTo) return; for (let y = -200; y < -50; y += 44) legStripes += `<path d="M${x - w},${y} Q${x},${y - 10} ${x + w},${y} L${x + w},${y + 18} Q${x},${y + 8} ${x - w},${y + 18}Z" fill="${stripeFill}"/>`; });
    headStripes = (o.paintTo != null && o.paintTo < 260) ? '' : [[-70, -96, 22], [-24, -110, 18], [22, -108, 18], [64, -92, 20]].map(([x, y, w], k) => { const d = `M${x},${y} Q${x + (x < 0 ? -10 : 10)},${y + 50} ${x + (x < 0 ? 8 : -8)},${y + 96} L${x + w * .8},${y + 92} Q${x + w + (x < 0 ? -6 : 6)},${y + 48} ${x + w},${y + 4}Z`; return `<path d="${d}" fill="${stripeFill}"/>` + gloss(d); }).join('');
  }
  if (o.fresh) o.fresh.forEach(({ x, w = 26, y1 }, k) => { if (y1 <= -448) return; const d = stripeBand(x, w, -452, y1, 14, 3 + k); bodyStripes += `<path d="${d}" fill="${o.freshCol || WH}"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3" transform="translate(-3,-2)"/>` +
    (y1 > -420 ? `<ellipse cx="${x + w / 2}" cy="${y1}" rx="${w / 2 + 2}" ry="6" fill="${o.freshCol || WH}"/><path d="M${x + w * .3},${y1} q-3,${14 + k * 3} 3,${20 + k * 3} q6,-6 1,-${20 + k * 3}Z" fill="${o.freshCol || WH}"/>` : ''); });
  let s = `<defs><clipPath id="${id}b"><path d="${body}"/></clipPath><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${CL}"/><stop offset=".45" stop-color="${C}"/><stop offset="1" stop-color="${CD}"/></linearGradient></defs>`;
  // patas lejanas (más oscuras) detrás del cuerpo
  LEGS.filter(l => l[4]).forEach(([x, w, top, back]) => { const id2 = id + 'l' + x; s += `<defs><clipPath id="${id2}"><path d="${legP(x, w, top, back)}"/></clipPath></defs><path d="${legP(x, w, top, back)}" fill="${CD}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><g clip-path="url(#${id2})" opacity=".75">${legStripes}</g>` + hoof(x, w); });
  // cola (detrás del anca)
  const tw = (o.tail || 0), tx = -350 - tw * 70, ty = -150 + Math.abs(tw) * 40;
  s += `<path d="M-336,-380 Q${-372 - tw * 40},-290 ${tx},${ty}" stroke="${K}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-336,-380 Q${-372 - tw * 40},-290 ${tx},${ty}" stroke="${C}" stroke-width="11" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M${tx - 16},${ty - 10} Q${tx - 26},${ty + 30} ${tx - 6},${ty + 46} Q${tx + 4},${ty + 30} ${tx + 8},${ty + 50} Q${tx + 26},${ty + 26} ${tx + 16},${ty - 8}Z" fill="${o.stripes === 'white' ? WH : '#151014'}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>`;
  if (Math.abs(tw) > .4) s += [0, 1, 2].map(k => `<path d="M${tx + (tw > 0 ? -30 : 30) - k * 4},${ty - 40 + k * 22} l${tw > 0 ? -26 : 26},${-4 + k * 4}" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`).join('');
  // cuerpo con volumen, rayas y brillo
  s += `<path d="${body}" fill="url(#${id}g)"/><g clip-path="url(#${id}b)">${bodyStripes}<path d="M-300,-400 Q-50,-440 200,-404" stroke="#fff" stroke-opacity=".16" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-330,-215 Q-40,-170 250,-210 L260,-160 L-340,-160Z" fill="#000" opacity=".25"/></g>`;
  s += `<path d="${body}" fill="none" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`;
  s += `<path d="M-120,-198 Q-136,-170 -112,-160 Q-96,-150 -84,-166 Q-74,-186 -92,-198" fill="${PK}" stroke="${K}" stroke-width="6"/><path d="M-108,-160 l0,14 M-92,-162 l0,14" stroke="${K}" stroke-width="7" stroke-linecap="round"/>`; // ubre
  if (o.twitch) s += [[-80, -360], [-40, -330], [40, -370]].map(([x, y]) => `<path d="M${x - 14},${y} q7,-8 14,0 q7,8 14,0" stroke="#fff" stroke-opacity=".7" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('');
  // patas cercanas
  LEGS.filter(l => !l[4]).forEach(([x, w, top, back]) => { const id2 = id + 'n' + x; s += `<defs><clipPath id="${id2}"><path d="${legP(x, w, top, back)}"/></clipPath></defs><path d="${legP(x, w, top, back)}" fill="url(#${id}g)" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><g clip-path="url(#${id2})">${legStripes}</g>` + hoof(x, w); });
  // ---------- cabeza (mira a cámara) ----------
  const ht = (o.headTurn || 0) * 14, hx = 300 + ht, hy = -360;
  let h = '';
  [-1, 1].forEach(sd => { h += `<path d="M${sd * 62},-58 Q${sd * 150},-92 ${sd * 168},-46 Q${sd * 140},-18 ${sd * 70},-26Z" fill="${C}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M${sd * 84},-50 Q${sd * 136},-70 ${sd * 150},-46 Q${sd * 128},-34 ${sd * 88},-38Z" fill="${PK}"/>`;
    h += `<path d="M${sd * 52},-84 Q${sd * 74},-128 ${sd * 108},-132 Q${sd * 96},-112 ${sd * 72},-80Z" fill="#efe4c8" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M${sd * 92},-128 Q${sd * 102},-132 ${sd * 108},-132 Q${sd * 104},-124 ${sd * 98},-120Z" fill="#5a4a3a"/>`; });
  if (o.tag != null) h += `<g transform="translate(-136,-38) rotate(-12)"><rect x="-18" y="-6" width="36" height="34" rx="6" fill="#ffd34a" stroke="${K}" stroke-width="5"/><text x="0" y="20" transform="scale(${o._fl || 1},1)" text-anchor="middle" font-family="Inter" font-weight="900" font-size="18" fill="${K}">${o.tag}</text></g>`;
  const HP = 'M0,-108 C66,-108 98,-62 96,-6 C94,40 70,74 52,96 Q0,124 -52,96 C-70,74 -94,40 -96,-6 C-98,-62 -66,-108 0,-108Z';
  h += `<defs><clipPath id="${id}h"><path d="${HP}"/></clipPath><radialGradient id="${id}hg" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="${CL}"/><stop offset=".6" stop-color="${C}"/><stop offset="1" stop-color="${CD}"/></radialGradient></defs>`;
  h += `<path d="${HP}" fill="url(#${id}hg)"/><g clip-path="url(#${id}h)">${headStripes}<path d="M-62,-80 L-30,-90 L0,-74 L30,-90 L62,-80 L40,-60 L0,-66 L-40,-60Z" fill="${CD}" opacity=".7"/></g>`;
  h += `<path d="${HP}" fill="none" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`;
  // ojos: blanco + iris marrón + párpado pesado
  const e = o.eyes || 'lid';
  [-1, 1].forEach(sd => { const ex = sd * 40, ey = -20, cid = id + 'e' + sd;
    if (e === 'closed') { h += `<path d="M${ex - 18},${ey} Q${ex},${ey + 12} ${ex + 18},${ey}" stroke="#f6f3ec" stroke-width="7" fill="none" stroke-linecap="round"/>`; return; }
    const r = e === 'wide' ? 24 : 20;
    h += `<defs><clipPath id="${cid}"><circle cx="${ex}" cy="${ey}" r="${r}"/></clipPath></defs><circle cx="${ex}" cy="${ey}" r="${r}" fill="#fbf8f2"/><g clip-path="url(#${cid})"><circle cx="${ex + sd * 2}" cy="${ey + 3}" r="${e === 'wide' ? 9 : 13}" fill="#4a2a18"/><circle cx="${ex + sd * 2}" cy="${ey + 3}" r="${e === 'wide' ? 5 : 7}" fill="${K}"/><circle cx="${ex + sd * 2 + 4}" cy="${ey - 2}" r="3.5" fill="#fff"/>`;
    if (e !== 'wide') { const t = e === 'annoyed' ? sd * -18 : sd * -4, ly = e === 'annoyed' ? -4 : -7; h += `<rect x="${ex - 40}" y="${ey - 60}" width="80" height="${60 + ly}" fill="${C}" transform="rotate(${t} ${ex} ${ey})"/></g><line x1="${ex - r - 6}" y1="${ey + ly}" x2="${ex + r + 6}" y2="${ey + ly}" stroke="${K}" stroke-width="8" stroke-linecap="round" transform="rotate(${t} ${ex} ${ey})"/>`; }
    else h += `</g>`;
    h += `<circle cx="${ex}" cy="${ey}" r="${r}" fill="none" stroke="${K}" stroke-width="6"/>`; });
  // hocico, orificios y boca masticando
  const ch = (o.chew || 0) * 8;
  h += `<ellipse cx="0" cy="54" rx="64" ry="44" fill="#5d5259" stroke="${K}" stroke-width="8"/><ellipse cx="-8" cy="38" rx="30" ry="9" fill="#fff" opacity=".18"/>`;
  h += `<ellipse cx="-24" cy="46" rx="10" ry="13" fill="${K}"/><ellipse cx="24" cy="46" rx="10" ry="13" fill="${K}"/>`;
  const m = o.mouth || 'chew';
  if (m === 'chew') h += `<path d="M${-20 + ch},80 Q${ch},${90 + ch * .3} ${22 + ch},78" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  if (m === 'flat') h += `<path d="M-22,82 L22,82" stroke="${K}" stroke-width="7" stroke-linecap="round"/>`;
  if (m === 'moo') h += `<ellipse cx="0" cy="88" rx="26" ry="22" fill="${K}"/><ellipse cx="0" cy="98" rx="14" ry="9" fill="${PK}"/>`;
  if (o.grass) h += `<path d="M14,84 l30,-18 M16,86 l34,-4 M14,88 l26,14" stroke="#5fa346" stroke-width="6" stroke-linecap="round"/>`;
  s += `<g transform="translate(${hx},${hy}) rotate(${(o.headTilt || 0)})">${h}</g>`;
  return s;
}
function flySwarm(cx, cy, sc, n, t, o = {}) { // moscas de establo: cuerpo gris oscuro, alas transparentes, rastro al volar
  const rr = (k, a) => { const x = Math.sin(k * 91.7 + a * 13.1) * 43758.5; return x - Math.floor(x); }; let s = '';
  for (let k = 0; k < n; k++) { const land = o.land && k < o.land.length, p = land ? o.land[k] : null;
    let x = land ? cx + p[0] * sc : cx + (rr(k, 1) - .5) * 560 * sc + Math.sin(t * 6 + k) * 40 * sc, y = land ? cy + p[1] * sc : cy - rr(k, 2) * 380 * sc - 40 * sc + Math.cos(t * 7 + k * 2) * 30 * sc;
    const a = land ? rr(k, 3) * 360 : (Math.atan2(Math.cos(t * 7 + k * 2), Math.sin(t * 6 + k)) * 180 / Math.PI), z = sc * (o.big || 1);
    if (!land) s += `<path d="M${x},${y} q${-30 * z},${12 * z} ${-60 * z},${-4 * z}" stroke="#1b1720" stroke-opacity=".35" stroke-width="${3 * z}" stroke-dasharray="${6 * z} ${6 * z}" fill="none"/>`;
    s += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a.toFixed(0)}) scale(${z.toFixed(3)})"><ellipse cx="-6" cy="-9" rx="11" ry="6" fill="#e6f2ff" fill-opacity=".8" stroke="#1b1720" stroke-width="2.5" transform="rotate(${land ? 20 : -30 + Math.sin(t * 60 + k) * 40} -2 -2)"/><ellipse cx="-6" cy="9" rx="11" ry="6" fill="#e6f2ff" fill-opacity=".8" stroke="#1b1720" stroke-width="2.5" transform="rotate(${land ? -20 : 30 - Math.sin(t * 60 + k) * 40} -2 2)"/>` +
      `<ellipse cx="0" cy="0" rx="12" ry="6.5" fill="#3a3640" stroke="#1b1720" stroke-width="3"/><path d="M-4,-6 L-4,6 M2,-6 L2,6" stroke="#6a6670" stroke-width="2"/><circle cx="12" cy="0" r="5.5" fill="#2a2630" stroke="#1b1720" stroke-width="2.5"/><circle cx="14" cy="-3" r="2.6" fill="#c8302e"/><circle cx="14" cy="3" r="2.6" fill="#c8302e"/></g>`; }
  if (o.miss) o.miss.forEach(([x0, y0, x1, y1]) => { const X0 = cx + x0 * sc, Y0 = cy + y0 * sc, X1 = cx + x1 * sc, Y1 = cy + y1 * sc;
    s += `<path d="M${X0},${Y0} Q${(X0 + X1) / 2},${Math.min(Y0, Y1) - 60 * sc} ${X1},${Y1}" stroke="#c8302e" stroke-width="${4 * sc}" stroke-dasharray="${10 * sc} ${8 * sc}" fill="none"/>` +
      `<g transform="translate(${X1},${Y1}) scale(${sc * 1.2})"><path d="M0,-22 L5,-6 L22,-8 L8,2 L16,18 L0,8 L-14,18 L-8,2 L-22,-8 L-5,-6Z" fill="#ffd34a" stroke="#1b1720" stroke-width="3"/></g>`; });
  return s; }
function cowAt(o, F, W, opt = {}) {
  const pf = W.proj(F), pt = W.proj(new W.T.Vector3(F.x, F.y + 1.45, F.z)); if (!pf.ok || !pt.ok) return '';
  const dx = pt.x - pf.x, dy = pt.y - pf.y, L = Math.hypot(dx, dy), s = L / 462, rot = Math.atan2(dx, -dy) * 180 / Math.PI, fl = opt.face === 'left' ? -1 : 1;
  let out = `<ellipse cx="${pf.x.toFixed(1)}" cy="${(pf.y + 4 * s).toFixed(1)}" rx="${(340 * s).toFixed(1)}" ry="${(46 * s).toFixed(1)}" fill="#141826" opacity=".32" style="filter:blur(${(6 * s / .3).toFixed(1)}px)"/>`;
  const Lt = opt.light || W.charLight; let fil = '';
  if (Lt) { const fid = 'cl' + (++_sid), k = Lt.k ?? .2; out += `<defs><filter id="${fid}" color-interpolation-filters="sRGB"><feFlood flood-color="${Lt.tint}" result="t"/><feBlend in="SourceGraphic" in2="t" mode="multiply" result="m"/><feComposite in="m" in2="SourceAlpha" operator="in" result="mc"/><feComposite in="SourceGraphic" in2="mc" operator="arithmetic" k1="0" k2="${1 - k}" k3="${k}" k4="0"/></filter></defs>`; fil = ` filter="url(#${fid})"`; }
  out += `<g transform="translate(${pf.x.toFixed(1)},${pf.y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${(s * fl).toFixed(4)},${s.toFixed(4)})"${opt.blur > .3 ? ` style="filter:blur(${opt.blur}px)"` : ''}><g${fil}>${cow2(Object.assign({}, o, { _fl: fl }))}</g></g>`;
  return out; }

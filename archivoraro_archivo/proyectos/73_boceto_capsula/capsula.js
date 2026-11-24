// Personaje «cápsula» (estilo nuevo, ref. precios .99): cabeza esfera crema, cuerpo bala con volumen, patas de palo largas, manos bola.
// Unidades: 1000 = altura total; origen en el suelo entre los pies. o.lx = dirección de la luz (-1 izq, 1 der).
const CINK = '#1d1416';
let _cid = 0;
function cmix(a, b, t) { const p = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }

function capsula(o = {}) {
  const id = 'c' + (_cid++), lx = o.lx ?? -1, t = o.turn ?? 0, warm = o.warm || '#ffd79a';
  const top = o.top || '#1f6b6b', topD = cmix(top, '#000000', .45), topL = cmix(top, '#ffffff', .28);
  const skin = '#f5ead6', skinD = '#cdb796';
  const R = 168, HY = -770;                 // cabeza
  const BT = -600, BB = -318, BW = 128;     // cuerpo: arriba, abajo, medio ancho
  let s = `<defs>
   <radialGradient id="${id}h" cx="${.5 + lx * -.0}" cy=".5" r=".62" fx="${.5 + lx * .16}" fy=".34"><stop offset="0" stop-color="#fffaf0"/><stop offset=".55" stop-color="${skin}"/><stop offset="1" stop-color="${skinD}"/></radialGradient>
   <linearGradient id="${id}b" x1="${lx < 0 ? 0 : 1}" y1="0" x2="${lx < 0 ? 1 : 0}" y2="0"><stop offset="0" stop-color="${topL}"/><stop offset=".45" stop-color="${top}"/><stop offset="1" stop-color="${topD}"/></linearGradient>
   <linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
   <clipPath id="${id}bc"><path d="${bodyPath()}"/></clipPath>
   <clipPath id="${id}hc"><circle cx="0" cy="${HY}" r="${R}"/></clipPath>
   <filter id="${id}sb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>`;
  function bodyPath() { // bala: hombros redondos, panza algo más ancha, culo redondeado
    return `M${-BW * .82},${BT + 40} C${-BW * .8},${BT - 18} ${BW * .8},${BT - 18} ${BW * .82},${BT + 40} C${BW * 1.06},${BT + 120} ${BW * 1.06},${BB - 70} ${BW * .9},${BB - 18} Q${BW * .7},${BB + 14} 0,${BB + 14} Q${-BW * .7},${BB + 14} ${-BW * .9},${BB - 18} C${-BW * 1.06},${BB - 70} ${-BW * 1.06},${BT + 120} ${-BW * .82},${BT + 40}Z`; }
  // sombra de contacto
  if (!o.noShadow) s += `<ellipse cx="0" cy="4" rx="150" ry="26" fill="#000" opacity=".38" filter="url(#${id}sb)"/>`;
  // piernas (palos largos) y pies
  const lg = o.legs || [[-48, 0], [48, 0]];
  lg.forEach(([fx, fy], i) => { const hx = (i ? 1 : -1) * 50; s += `<path d="M${hx},${BB - 10} Q${(hx + fx) / 2 + (i ? 6 : -6)},${(BB + fy) / 2} ${fx},${fy - 6}" stroke="${CINK}" stroke-width="15" fill="none" stroke-linecap="round"/><ellipse cx="${fx + (i ? 9 : -9)}" cy="${fy - 4}" rx="20" ry="9" fill="${CINK}"/>`; });
  // brazo de atrás (si el giro esconde uno)
  const arm = (side, a) => { const sx = side * BW * .86, sy = BT + 70; const [ex, ey, hx, hy] = a; return `<path d="M${sx},${sy} Q${sx + ex},${sy + ey} ${sx + hx},${sy + hy}" stroke="${CINK}" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="${sx + hx}" cy="${sy + hy}" r="21" fill="${CINK}"/>${o.hold && o.hold[side] ? `<g transform="translate(${sx + hx},${sy + hy})">${o.hold[side]}</g>` : ''}`; };
  const aL = o.armL || [-38, 120, -22, 236], aR = o.armR || [38, 120, 22, 236];
  // cuerpo
  s += `<path d="${bodyPath()}" fill="url(#${id}b)"/>`;
  s += `<g clip-path="url(#${id}bc)">`;
  // camisa en V, corbata, botones, bolsillo con pañuelo, insignia AR
  const vx = t * 30;
  s += `<path d="M${vx - 62},${BT - 20} L${vx},${BT + 118} L${vx + 62},${BT - 20}Z" fill="#f4efe4" stroke="${CINK}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="M${vx - 13},${BT + 14} L${vx + 13},${BT + 14} L${vx + 9},${BT + 30} L${vx + 16},${BT + 104} L${vx},${BT + 122} L${vx - 16},${BT + 104} L${vx - 9},${BT + 30}Z" fill="#e0a93a" stroke="${CINK}" stroke-width="5" stroke-linejoin="round"/><path d="M${vx - 8},${BT + 48} L${vx + 8},${BT + 40} M${vx - 10},${BT + 74} L${vx + 10},${BT + 66}" stroke="#a8741c" stroke-width="5"/>`;
  // solapas
  s += [-1, 1].map(sd => `<path d="M${vx + sd * 62},${BT - 20} L${vx + sd * 4},${BT + 128} L${vx + sd * 44},${BT + 70} L${vx + sd * 96},${BT + 38} Z" fill="${cmix(top, '#000000', .18)}" stroke="${CINK}" stroke-width="6" stroke-linejoin="round"/>`).join('');
  s += [0, 1, 2].map(i => `<circle cx="${vx + 4}" cy="${BT + 160 + i * 42}" r="9" fill="#e7c24a" stroke="${CINK}" stroke-width="4"/>`).join('');
  s += `<path d="M${vx + 40},${BT + 118} L${vx + 96},${BT + 112}" stroke="${CINK}" stroke-width="6" stroke-linecap="round"/><path d="M${vx + 50},${BT + 116} q4,-26 16,-14 q8,-20 18,-4 q10,-10 10,18Z" fill="#d23a3a" stroke="${CINK}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<g transform="translate(${vx - 70},${BT + 104})"><circle r="17" fill="#e7c24a" stroke="${CINK}" stroke-width="4"/><text y="6.5" text-anchor="middle" font-family="Inter" font-weight="900" font-size="17" fill="${CINK}">AR</text></g>`;
  s += `<path d="M${vx - 78},${BB - 86} L${vx - 30},${BB - 88}" stroke="${CINK}" stroke-width="6" stroke-linecap="round" opacity=".8"/>`;
  // volumen: oscuro abajo, rim cálido del lado de la luz, brillo arriba
  s += `<rect x="-200" y="${BT - 40}" width="400" height="${BB - BT + 80}" fill="url(#${id}v)"/>`;
  s += `<path d="M${lx * BW * .95},${BT + 60} C${lx * BW * 1.06},${BT + 140} ${lx * BW * 1.04},${BB - 80} ${lx * BW * .86},${BB - 22}" stroke="${warm}" stroke-width="16" fill="none" opacity=".55" stroke-linecap="round"/>`;
  s += `<ellipse cx="${lx * 46}" cy="${BT + 30}" rx="46" ry="16" fill="#fff" opacity=".22" transform="rotate(${lx * 12},${lx * 46},${BT + 30})"/>`;
  s += `<ellipse cx="0" cy="${BT - 6}" rx="${R * .7}" ry="30" fill="#000" opacity=".28" filter="url(#${id}sb)"/>`; // sombra de la cabeza en los hombros
  s += `</g><path d="${bodyPath()}" fill="none" stroke="${CINK}" stroke-width="10" stroke-linejoin="round"/>`;
  s += arm(-1, aL) + arm(1, aR);
  // cabeza
  s += `<circle cx="0" cy="${HY}" r="${R}" fill="url(#${id}h)"/>`;
  s += `<g clip-path="url(#${id}hc)"><circle cx="${-lx * 40}" cy="${HY + 40}" r="${R}" fill="none" stroke="#7a5a3a" stroke-opacity=".16" stroke-width="40"/>
        <path d="M${lx * R * .98},${HY - 60} A${R} ${R} 0 0 ${lx < 0 ? 0 : 1} ${lx * R * .5},${HY + R * .86}" stroke="${warm}" stroke-width="12" fill="none" opacity=".6"/></g>`;
  // patillas (pelo en casquete bajo la gorra)
  const hair = o.hair || '#2a1c16';
  s += [-1, 1].map(sd => `<path d="M${sd * R * .9},${HY - 100} Q${sd * R * 1.02},${HY - 40} ${sd * R * .95},${HY + 20} Q${sd * R * .84},${HY - 20} ${sd * R * .8},${HY - 90}Z" fill="${hair}" stroke="${CINK}" stroke-width="5" stroke-linejoin="round"/>`).join('');
  s += `<circle cx="0" cy="${HY}" r="${R}" fill="none" stroke="${CINK}" stroke-width="11"/>`;
  s += face(o, t, HY, R, id);
  s += cap(o, t, HY, R);
  return s;
}

function face(o, t, HY, R) {
  const f = o.face || 'serio', x0 = t * 70, ey = HY + 22, ex = 58; let s = '';
  const brow = (sd, dy, tilt) => { const cx = x0 + sd * ex; return `<path d="M${cx - 40},${ey - 44 + dy + sd * tilt} Q${cx},${ey - 66 + dy} ${cx + 40},${ey - 44 + dy - sd * tilt}" stroke="${CINK}" stroke-width="17" fill="none" stroke-linecap="round"/>`; };
  const lid = (sd, dy = 0) => { const cx = x0 + sd * ex; return `<path d="M${cx - 30},${ey + dy} Q${cx},${ey - 12 + dy} ${cx + 30},${ey + dy}" stroke="${CINK}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M${cx - 20},${ey + 8 + dy} Q${cx},${ey + 14 + dy} ${cx + 20},${ey + 8 + dy}" stroke="${CINK}" stroke-width="12" fill="none" stroke-linecap="round"/>`; };
  const happy = sd => { const cx = x0 + sd * ex; return `<path d="M${cx - 28},${ey + 6} Q${cx},${ey - 24} ${cx + 28},${ey + 6}" stroke="${CINK}" stroke-width="13" fill="none" stroke-linecap="round"/>`; };
  const dot = sd => { const cx = x0 + sd * ex; return `<ellipse cx="${cx}" cy="${ey - 2}" rx="13" ry="17" fill="${CINK}"/><circle cx="${cx + 4}" cy="${ey - 8}" r="4" fill="#fff"/>`; };
  if (f === 'serio') s += brow(-1, 6, 6) + brow(1, 6, 6) + lid(-1) + lid(1);
  if (f === 'picaro') s += brow(-1, 10, -4) + brow(1, -10, 6) + lid(-1, 2) + happy(1);
  if (f === 'feliz') s += brow(-1, -6, 4) + brow(1, -6, 4) + happy(-1) + happy(1);
  if (f === 'preocupado') s += brow(-1, -4, -18) + brow(1, -4, -18) + lid(-1, 4) + lid(1, 4);
  if (f === 'sorpresa') s += brow(-1, -18, 2) + brow(1, -18, 2) + dot(-1) + dot(1);
  // bigote grande negro con contorno y brillo
  const my = HY + 78, mx = x0 * 1.05;
  const mus = `M${mx},${my - 16} C${mx - 30},${my - 34} ${mx - 76},${my - 30} ${mx - 96},${my - 2} C${mx - 112},${my + 22} ${mx - 128},${my + 30} ${mx - 140},${my + 18} C${mx - 132},${my + 50} ${mx - 92},${my + 58} ${mx - 58},${my + 38} C${mx - 36},${my + 26} ${mx - 14},${my + 20} ${mx},${my + 26} C${mx + 14},${my + 20} ${mx + 36},${my + 26} ${mx + 58},${my + 38} C${mx + 92},${my + 58} ${mx + 132},${my + 50} ${mx + 140},${my + 18} C${mx + 128},${my + 30} ${mx + 112},${my + 22} ${mx + 96},${my - 2} C${mx + 76},${my - 30} ${mx + 30},${my - 34} ${mx},${my - 16}Z`;
  // boca debajo del bigote
  const mo = { serio: `M${mx - 20},${my + 56} Q${mx},${my + 53} ${mx + 20},${my + 56}`, picaro: `M${mx - 10},${my + 60} Q${mx + 22},${my + 74} ${mx + 40},${my + 54}`, feliz: `M${mx - 30},${my + 54} Q${mx},${my + 84} ${mx + 30},${my + 54}`, preocupado: `M${mx - 24},${my + 70} Q${mx},${my + 54} ${mx + 24},${my + 70}` }[f];
  if (f === 'sorpresa') s += `<ellipse cx="${mx}" cy="${my + 72}" rx="16" ry="20" fill="#5a1e22" stroke="${CINK}" stroke-width="8"/>`;
  else s += `<path d="${mo}" stroke="${CINK}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  s += `<path d="${mus}" fill="#231915" stroke="${CINK}" stroke-width="7" stroke-linejoin="round"/><path d="M${mx - 80},${my - 8} Q${mx - 50},${my - 24} ${mx - 20},${my - 10} M${mx + 20},${my - 10} Q${mx + 50},${my - 24} ${mx + 80},${my - 8}" stroke="#fff" stroke-opacity=".22" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  return s;
}

function cap(o, t, HY, R) { // gorra plana de paño con visera, encajada en la cabeza
  const c = o.capCol || '#7a6a58', cd = cmix(c, '#000000', .38), cl = cmix(c, '#ffffff', .22), x0 = t * 34;
  return `<g transform="translate(0,-34)"><path d="M${-R * 1.02},${HY - 48} C${-R * 1.08},${HY - R * 1.25} ${R * 1.15},${HY - R * 1.32} ${R * 1.06},${HY - 40} Q0,${HY - 84} ${-R * 1.02},${HY - 48}Z" fill="${c}" stroke="${CINK}" stroke-width="10" stroke-linejoin="round"/>
   <path d="M${-R * .8},${HY - 120} Q0,${HY - 196} ${R * .78},${HY - 118}" stroke="${cl}" stroke-width="14" fill="none" stroke-linecap="round" opacity=".6"/>
   <path d="M${-R * .2},${HY - R * 1.06} Q${R * .1},${HY - 110} ${R * .05},${HY - 70}" stroke="${cd}" stroke-width="6" fill="none" opacity=".7"/>
   <circle cx="${R * .05}" cy="${HY - R * 1.08}" r="11" fill="${cd}" stroke="${CINK}" stroke-width="5"/>
   <path d="M${x0 - R * .86},${HY - 58} Q${x0},${HY - 92} ${x0 + R * .9},${HY - 54} Q${x0 + R * .7},${HY - 18} ${x0},${HY - 20} Q${x0 - R * .7},${HY - 18} ${x0 - R * .86},${HY - 58}Z" fill="${cd}" stroke="${CINK}" stroke-width="9" stroke-linejoin="round"/>
   <path d="M${x0 - R * .6},${HY - 44} Q${x0},${HY - 62} ${x0 + R * .6},${HY - 42}" stroke="${cl}" stroke-width="5" fill="none" opacity=".45"/></g>`;
}

function capsulaAt(o, F, W, hM = 1.75) { const p = W.proj(F); const k = p.ppm * hM / 1000; return `<g transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)}) scale(${k.toFixed(4)})">${capsula(o)}</g>`; }

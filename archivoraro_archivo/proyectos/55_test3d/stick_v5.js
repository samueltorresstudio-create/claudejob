// Archivo Raro · personajes 2D v5: cabeza redonda blanca, cuerpo «judía», brazos y piernas de palo, contorno grueso.
// stick(o): SVG in local units (feet at 0,0, head centre at y=-470, total ≈ 570). Anchored to 3D by stickAt().
const INKC = '#1b1720', LW = 10;
let _sid = 0;
function stick(o) {
  const d = Object.assign({ top: '#f07a2a', topD: '#c45a18', face: 'smug', brows: 0, browTilt: 0, mouth: 'smile', look: [0, 0], shade: .5, lean: 0, headTilt: 0,
    armL: [20, 10], armR: [20, 10], legL: [4, 0], legR: [4, 0], hair: null, cap: null, hood: false, sweat: false, number: null, shoes: '#f4f2ec', wrist: null }, o);
  const id = 'sk' + (++_sid), rad = a => a * Math.PI / 180;
  const HIP = -205, SH = -360, HC = -470, HR = 96;
  let s = `<defs><radialGradient id="${id}h" cx="${.32 + (d.shade - .5) * .4}" cy=".3" r=".85"><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd3df"/></radialGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="0"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>`;
  // ---- limbs (two segments, round joints) ----
  const seg = (x0, y0, a1, l1, a2, l2) => { const x1 = x0 + Math.sin(rad(a1)) * l1, y1 = y0 + Math.cos(rad(a1)) * l1, x2 = x1 + Math.sin(rad(a1 + a2)) * l2, y2 = y1 + Math.cos(rad(a1 + a2)) * l2; return [x1, y1, x2, y2]; };
  let legs = '', arms = '', front = '';
  [[-1, d.legL], [1, d.legR]].forEach(([sd, [hip, knee]]) => { const hx = sd * 24, [kx, ky, fx, fy] = seg(hx, HIP + 10, sd * hip, 100, -sd * knee, 105);
    legs += `<path d="M${hx},${HIP + 10} L${kx.toFixed(1)},${ky.toFixed(1)} L${fx.toFixed(1)},${fy.toFixed(1)}" stroke="${INKC}" stroke-width="${LW + 2}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const fa = sd * hip - sd * knee; legs += `<g transform="translate(${fx.toFixed(1)},${fy.toFixed(1)}) rotate(${(-fa * .6).toFixed(1)})"><path d="M${-14},-6 Q${-16},12 ${8 + sd * 20},12 Q${24 + sd * 22},10 ${20 + sd * 18},-2 Q${10 + sd * 8},-14 ${-8},-12Z" fill="${d.shoes}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/><path d="M${-14},8 L${22 + sd * 20},8" stroke="${d.sole || '#e94b3c'}" stroke-width="5"/></g>`; });
  [[-1, d.armL], [1, d.armR]].forEach(([sd, [sh, el]]) => { const sx = sd * 46, [ex, ey, hx, hy] = seg(sx, SH, sd * sh, 88, sd * el, 86);
    const a = `<path d="M${sx},${SH} L${ex.toFixed(1)},${ey.toFixed(1)} L${hx.toFixed(1)},${hy.toFixed(1)}" stroke="${INKC}" stroke-width="${LW}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      (d.wrist && sd > 0 ? `<circle cx="${(ex + (hx - ex) * .8).toFixed(1)}" cy="${(ey + (hy - ey) * .8).toFixed(1)}" r="9" fill="${d.wrist}" stroke="${INKC}" stroke-width="4"/>` : '') +
      `<ellipse cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" rx="13" ry="15" fill="${INKC}"/>`;
    arms += a; });
  // ---- body: bean ----
  const B = `M-40,${SH - 22} C-70,${SH - 12} -66,${HIP - 40} -60,${HIP + 4} Q0,${HIP + 26} 60,${HIP + 4} C66,${HIP - 40} 70,${SH - 12} 40,${SH - 22} Q0,${SH - 36} -40,${SH - 22}Z`;
  let body = `<path d="${B}" fill="${d.top}" stroke="${INKC}" stroke-width="${LW}" stroke-linejoin="round"/><path d="${B}" fill="url(#${id}b)"/>`;
  if (d.trim) body += `<path d="M-30,${SH - 26} Q0,${SH - 6} 30,${SH - 26}" stroke="${d.trim}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  if (d.number) body += `<text x="0" y="${SH + 92}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="78" fill="${d.trim || '#fff'}" stroke="${INKC}" stroke-width="5" paint-order="stroke">${d.number}</text>`;
  if (d.hood) body += `<path d="M-46,${SH - 20} Q0,${SH + 24} 46,${SH - 20}" stroke="${d.topD}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M-12,${SH} L-16,${SH + 58} M12,${SH} L16,${SH + 58}" stroke="#f1e6dc" stroke-width="6" stroke-linecap="round"/>
    <path d="M-38,${HIP - 46} Q0,${HIP - 58} 38,${HIP - 46} L42,${HIP - 6} Q0,${HIP + 6} -42,${HIP - 6}Z" fill="${d.topD}" stroke="${INKC}" stroke-width="5" opacity=".9"/>`;
  // ---- head ----
  let h = `<circle cx="0" cy="0" r="${HR}" fill="url(#${id}h)" stroke="${INKC}" stroke-width="${LW}"/>`;
  const [lx, ly] = d.look, E = [[-34, -6], [34, -6]];
  // brows
  const by = -46 - d.brows * 10;
  E.forEach(([ex], i) => { const s2 = i ? 1 : -1, t = (d.browTilt * 14) * s2; h += `<path d="M${ex - 18},${by - t * .5} L${ex + 18},${by + t * .5}" stroke="${INKC}" stroke-width="9" stroke-linecap="round"/>`; });
  // eyes
  E.forEach(([ex, ey]) => { const px = ex + lx, py = ey + ly;
    if (d.face === 'smug') h += `<path d="M${px - 11},${py - 2} A11 13 0 0 0 ${px + 11},${py - 2}Z" fill="${INKC}"/><path d="M${px - 17},${py - 4} L${px + 16},${py - 6}" stroke="${INKC}" stroke-width="7" stroke-linecap="round"/>`;
    else if (d.face === 'open') h += `<ellipse cx="${px}" cy="${py}" rx="10" ry="13" fill="${INKC}"/><circle cx="${px + 3}" cy="${py - 4}" r="3.2" fill="#fff"/>`;
    else if (d.face === 'wide') h += `<circle cx="${ex}" cy="${ey}" r="19" fill="#fff" stroke="${INKC}" stroke-width="6"/><circle cx="${ex + lx * .6}" cy="${ey + ly * .6}" r="5.5" fill="${INKC}"/>`;
    else if (d.face === 'closed') h += `<path d="M${ex - 14},${ey} Q${ex},${ey + 10} ${ex + 14},${ey}" stroke="${INKC}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    else if (d.face === 'happy') h += `<path d="M${ex - 14},${ey + 4} Q${ex},${ey - 12} ${ex + 14},${ey + 4}" stroke="${INKC}" stroke-width="7" fill="none" stroke-linecap="round"/>`; });
  // mouth
  const my = 40;
  if (d.mouth === 'smile') h += `<path d="M-18,${my - 4} Q2,${my + 12} 20,${my - 6}" stroke="${INKC}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  else if (d.mouth === 'smirk') h += `<path d="M-14,${my + 2} Q6,${my + 8} 22,${my - 8}" stroke="${INKC}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  else if (d.mouth === 'line') h += `<path d="M-14,${my} L14,${my}" stroke="${INKC}" stroke-width="7" stroke-linecap="round"/>`;
  else if (d.mouth === 'o') h += `<ellipse cx="0" cy="${my + 2}" rx="11" ry="14" fill="${INKC}"/>`;
  else if (d.mouth === 'grin') h += `<rect x="-30" y="${my - 14}" width="60" height="30" rx="9" fill="#fff" stroke="${INKC}" stroke-width="6"/><path d="M-30,${my + 1} L30,${my + 1} M-15,${my - 14} L-15,${my + 16} M0,${my - 14} L0,${my + 16} M15,${my - 14} L15,${my + 16}" stroke="${INKC}" stroke-width="3.5"/>`;
  else if (d.mouth === 'open') h += `<path d="M-26,${my - 8} Q0,${my - 14} 26,${my - 8} Q20,${my + 26} 0,${my + 28} Q-20,${my + 26} -26,${my - 8}Z" fill="${INKC}"/><path d="M-20,${my + 14} Q0,${my + 4} 20,${my + 14} Q0,${my + 26} -20,${my + 14}Z" fill="#e0707a"/>`;
  // hair / cap (our designs)
  if (d.hair === 'quiff') { const hc = d.hairCol || '#2a1a12'; h += `<path d="M-93,-14 C-102,-74 -62,-108 -14,-106 C2,-132 44,-150 84,-128 C70,-122 64,-116 68,-108 C92,-88 100,-50 93,-14 C80,-46 56,-64 22,-68 C-20,-74 -66,-60 -93,-14Z" fill="${hc}" stroke="${INKC}" stroke-width="${LW - 2}" stroke-linejoin="round"/><path d="M-6,-104 C14,-124 46,-132 70,-124" stroke="#fff" stroke-opacity=".25" stroke-width="7" fill="none" stroke-linecap="round"/>`; }
  if (d.cap) h += `<path d="M-94,-30 C-98,-118 98,-118 94,-30 Q0,-46 -94,-30Z" fill="${d.cap}" stroke="${INKC}" stroke-width="${LW - 2}" stroke-linejoin="round"/><path d="M-94,-32 Q-150,-30 -160,-12 Q-120,-10 -92,-24Z" fill="${d.capD || d.cap}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/><circle cx="20" cy="-82" r="13" fill="${d.capLogo || '#ffd34a'}" stroke="${INKC}" stroke-width="4"/>`;
  if (d.sweat) h += `<path d="M${HR - 6},-60 q14,22 0,30 q-14,-8 0,-30Z" fill="#8fd0ff" stroke="${INKC}" stroke-width="4"/>`;
  s += `<g transform="rotate(${d.lean})">${legs}${arms}${body}<g transform="translate(0,${HC + 8}) rotate(${d.headTilt})">${h}</g>${front}</g>`;
  return s;
}
// Anchor a stick figure in 3D: F = feet point, Hc = head-centre point (world). sh: draw cast shadow along the sun.
function stickAt(o, F, Hc, W, opt = {}) {
  const pf = W.proj(F), ph = W.proj(Hc); if (!pf.ok || !ph.ok) return '';
  const dx = ph.x - pf.x, dy = ph.y - pf.y, L = Math.hypot(dx, dy), s = L / 462, rot = Math.atan2(dx, -dy) * 180 / Math.PI;
  let out = '';
  if (opt.shadow !== false) { const g0 = new W.T.Vector3(F.x, 0.01, F.z), hgt = Math.max(0, Math.min(F.y, Hc.y)); const sd = new W.T.Vector3(-W.SUN.x, 0, -W.SUN.z).normalize();
    const tip = g0.clone().addScaledVector(sd, (Hc.y - F.y + .35) * 1.4).add(new W.T.Vector3(Hc.x - F.x, 0, Hc.z - F.z)); const a = W.proj(g0), b = W.proj(tip);
    const op = Math.max(0, .42 - hgt * .08);
    if (a.ok && b.ok && op > .01) { const w0 = a.ppm * .22, w1 = b.ppm * .34, ang = Math.atan2(b.y - a.y, b.x - a.x), nx = -Math.sin(ang), ny = Math.cos(ang);
      out += `<g opacity="${op.toFixed(2)}" style="filter:blur(${(3 + hgt * 4).toFixed(1)}px)"><path d="M${a.x + nx * w0},${a.y + ny * w0} L${b.x + nx * w1},${b.y + ny * w1} A${w1},${w1 * .6} 0 0 1 ${b.x - nx * w1},${b.y - ny * w1} L${a.x - nx * w0},${a.y - ny * w0}Z" fill="#141826"/><ellipse cx="${a.x}" cy="${a.y}" rx="${w0 * 1.6}" ry="${w0 * .6}" fill="#141826"/></g>`; } }
  const blur = opt.blur || 0;
  out += `<g transform="translate(${pf.x.toFixed(1)},${pf.y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${s.toFixed(4)})"${blur > .3 ? ` style="filter:blur(${blur.toFixed(1)}px)"` : ''}>${stick(o)}</g>`;
  return out;
}

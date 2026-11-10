// Archivo Raro · personajes 2D v6: cabeza orgánica (no un círculo perfecto, se estira y se aplasta con la emoción), cuerpo curvo,
// extremidades de «fideo» curvas, caras expresivas y línea viva (tiembla un poco cada 3 fotogramas, como dibujada a mano).
const INKC = '#1b1720', LW = 10;
const mixC = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
let _sid = 0;
function smoothPath(P) { const n = P.length; let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) { const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`; }
  return d + 'Z'; }
const hsh = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
function stick(o) {
  const d = Object.assign({ top: '#f07a2a', topD: '#c45a18', face: 'smug', brows: 0, browTilt: 0, mouth: 'smile', look: [0, 0], shade: .5, lean: 0, headTilt: 0, squash: 0,
    armL: [20, 10], armR: [20, 10], legL: [4, 0], legR: [4, 0], hair: null, cap: null, hood: false, sweat: false, number: null, shoes: '#f4f2ec', wrist: null,
    head: [92, 100], headSeed: 1, belly: 1, boil: 0, nose: true, jaw: 0 }, o);
  const id = 'sk' + (++_sid), rad = a => a * Math.PI / 180, bj = (k, a = 1.6) => (hsh(d.boil + k, d.headSeed) - .5) * a;
  const HIP = -205, SH = -360, HC = -470;
  let s = `<defs><radialGradient id="${id}h" cx="${.32 + (d.shade - .5) * .4}" cy=".3" r=".9"><stop offset=".42" stop-color="#ffffff"/><stop offset="1" stop-color="#cdd2df"/></radialGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="0"><stop offset=".4" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient></defs>`;
  const joint = (x0, y0, a1, l1, a2, l2) => { const x1 = x0 + Math.sin(rad(a1)) * l1, y1 = y0 + Math.cos(rad(a1)) * l1; return [x1, y1, x1 + Math.sin(rad(a1 + a2)) * l2, y1 + Math.cos(rad(a1 + a2)) * l2]; };
  const noodle = (x0, y0, x1, y1, x2, y2, w) => { const cx = 2 * x1 - (x0 + x2) / 2, cy = 2 * y1 - (y0 + y2) / 2;
    return `<path d="M${x0},${y0} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" stroke="${INKC}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`; };
  let legs = '', arms = '';
  [[-1, d.legL], [1, d.legR]].forEach(([sd, [hip, knee]], i) => { const hx = sd * 22, [kx, ky, fx, fy] = joint(hx, HIP + 6, sd * hip, 102, -sd * knee, 104);
    legs += noodle(hx, HIP + 6, kx + bj(10 + i), ky, fx, fy, LW + 2);
    if (d.socks) { const qx = kx + (fx - kx) * .66, qy = ky + (fy - ky) * .66; legs += `<path d="M${qx.toFixed(1)},${qy.toFixed(1)} L${fx.toFixed(1)},${(fy - 4).toFixed(1)}" stroke="${INKC}" stroke-width="21" stroke-linecap="round"/><path d="M${qx.toFixed(1)},${qy.toFixed(1)} L${fx.toFixed(1)},${(fy - 4).toFixed(1)}" stroke="#f6f3ec" stroke-width="13" stroke-linecap="round"/><path d="M${(qx + (fx - qx) * .2).toFixed(1)},${(qy + (fy - qy) * .2).toFixed(1)} L${(qx + (fx - qx) * .35).toFixed(1)},${(qy + (fy - qy) * .35).toFixed(1)}" stroke="${d.socks}" stroke-width="13"/>`; }
    const fa = sd * hip - sd * knee; legs += `<g transform="translate(${fx.toFixed(1)},${fy.toFixed(1)}) rotate(${(-fa * .6).toFixed(1)})"><path d="M${-15},-5 Q${-17},13 ${8 + sd * 20},13 Q${26 + sd * 22},11 ${21 + sd * 18},-3 Q${10 + sd * 8},-15 ${-9},-12Z" fill="${d.shoes}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/><path d="M${-15},9 L${23 + sd * 20},9" stroke="${d.sole || '#e94b3c'}" stroke-width="5" stroke-linecap="round"/></g>`; });
  [[-1, d.armL], [1, d.armR]].forEach(([sd, [sh, el]], i) => { const sx = sd * 44, [ex, ey, hx, hy] = joint(sx, SH, sd * sh, 90, sd * el, 86);
    arms += noodle(sx, SH, ex + bj(20 + i), ey + bj(30 + i), hx, hy, LW);
    if (d.wrist && sd > 0) arms += `<circle cx="${(ex + (hx - ex) * .78).toFixed(1)}" cy="${(ey + (hy - ey) * .78).toFixed(1)}" r="9" fill="${d.wrist}" stroke="${INKC}" stroke-width="4"/>`;
    arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)}) rotate(${(sd * sh + sd * el).toFixed(0)})"><ellipse cx="0" cy="3" rx="12" ry="15" fill="${INKC}"/><ellipse cx="${-sd * 11}" cy="-4" rx="5" ry="8" fill="${INKC}" transform="rotate(${sd * 30} ${-sd * 11} -4)"/></g>`; });
  const sx2 = d.lean * 1.4;
  const BP = [[-36 + sx2, SH - 26], [-60 + sx2 * .7, SH + 10], [-66 * d.belly, (SH + HIP) / 2], [-62, HIP - 20], [-34, HIP + 14], [0, HIP + 22], [34, HIP + 14], [62, HIP - 20], [64 * d.belly + 4, (SH + HIP) / 2 + 6], [58 + sx2 * .7, SH + 10], [34 + sx2, SH - 26], [0 + sx2, SH - 34]].map(([x, y], k) => [x + bj(40 + k, 2), y + bj(60 + k, 2)]);
  const B = smoothPath(BP);
  // ---------- clothes: drawn inside the bean (clipPath) with trims, seams, folds and shading ----------
  const cid = id + 'c', IN = (x) => `<g clip-path="url(#${cid})">${x}</g>`;
  let body = `<defs><clipPath id="${cid}"><path d="${B}"/></clipPath></defs><path d="${B}" fill="${d.top}"/>`;
  const SHO = HIP - 62; // shorts / hem line
  if (d.outfit === 'jersey') {
    let c = '';
    c += `<path d="M-90,${SH - 40} L-58,${SH - 40} Q-40,${SH + 60} -50,${SHO} L-90,${SHO}Z" fill="${d.trim}"/><path d="M90,${SH - 40} L58,${SH - 40} Q40,${SH + 60} 50,${SHO} L90,${SHO}Z" fill="${d.trim}"/>`;            // white side panels
    c += `<path d="M-90,${SH - 40} L-62,${SH - 40} Q-46,${SH + 60} -56,${SHO} L-90,${SHO}Z" fill="${d.top}"/><path d="M90,${SH - 40} L62,${SH - 40} Q46,${SH + 60} 56,${SHO} L90,${SHO}Z" fill="${d.top}"/>`;
    c += `<path d="M-30,${SH - 2} Q-44,${SH + 120} -26,${SHO - 6} M24,${SH + 70} Q36,${SH + 120} 30,${SHO - 4}" stroke="${d.topD}" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/>`; // folds
    c += `<rect x="-90" y="${SHO}" width="180" height="120" fill="${d.shorts}"/><rect x="-90" y="${SHO}" width="180" height="11" fill="${d.shortsD}"/>`;                                          // shorts + waistband
    c += `<path d="M-60,${SHO + 4} L-56,${HIP + 30} M60,${SHO + 4} L56,${HIP + 30}" stroke="${d.trim}" stroke-width="7"/><path d="M-6,${SHO + 12} L-10,${HIP + 24}" stroke="${d.shortsD}" stroke-width="3"/>`;
    c += `<rect x="-90" y="${SH - 60}" width="180" height="200" fill="url(#${id}b)"/>`;
    body += IN(c);
    // neck + armhole trims (over the clip so they read clearly)
    body += `<path d="M${-30 + sx2},${SH - 30} Q${sx2},${SH + 4} ${30 + sx2},${SH - 30}" stroke="${d.trim}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${-30 + sx2},${SH - 30} Q${sx2},${SH + 4} ${30 + sx2},${SH - 30}" stroke="${INKC}" stroke-width="2.5" fill="none" opacity=".6"/>`;
    [-1, 1].forEach(sd => body += `<path d="M${sd * 38 + sx2},${SH - 26} Q${sd * 60},${SH - 2} ${sd * 58},${SH + 34}" stroke="${d.trim}" stroke-width="8" fill="none" stroke-linecap="round"/>`);
    if (d.number) body += `<text x="${sx2 * .5}" y="${SH + 90}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="66" fill="${d.trim}" stroke="${INKC}" stroke-width="5" paint-order="stroke">${d.number}</text><text x="${sx2 * .5 - 1}" y="${SH + 22}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="15" letter-spacing="2" fill="${d.trim}">RARO</text>`;
  } else if (d.outfit === 'hoodie') {
    let c = '';
    c += `<path d="M-46,${HIP - 40} Q0,${HIP - 54} 46,${HIP - 40} L52,${HIP - 4} Q0,${HIP + 6} -52,${HIP - 4}Z" fill="${d.topD}"/>`;                                       // kangaroo pocket
    c += `<path d="M-40,${HIP - 34} Q0,${HIP - 46} 40,${HIP - 34}" stroke="${mixC(d.top, '#ffffff', .25)}" stroke-width="2.5" stroke-dasharray="6 6" fill="none"/>`;      // stitching
    c += `<path d="M-46,${HIP - 40} Q-30,${HIP - 20} -40,${HIP - 2} M46,${HIP - 40} Q30,${HIP - 20} 40,${HIP - 2}" stroke="${INKC}" stroke-width="3.5" fill="none" opacity=".7"/>`; // pocket openings
    c += `<rect x="-90" y="${HIP - 10}" width="180" height="60" fill="${d.topD}"/>`; for (let k = -6; k <= 6; k++) c += `<path d="M${k * 10},${HIP - 8} L${k * 10},${HIP + 30}" stroke="${INKC}" stroke-width="2" opacity=".25"/>`; // ribbed hem
    c += `<path d="M-34,${SH + 20} Q-46,${SH + 80} -36,${HIP - 46} M30,${SH + 40} Q42,${SH + 90} 34,${HIP - 48}" stroke="${INKC}" stroke-width="3.5" fill="none" opacity=".22" stroke-linecap="round"/>`; // folds
    c += `<rect x="16" y="${SH + 24}" width="28" height="20" rx="3" fill="${d.patch || '#ffd34a'}" stroke="${INKC}" stroke-width="3"/><text x="30" y="${SH + 39}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="12" fill="${INKC}">AR</text>`; // chest patch
    c += `<rect x="-90" y="${SH - 60}" width="180" height="300" fill="url(#${id}b)"/>`;
    body += IN(c);
    // hood around the neck (behind the head) + drawstrings with metal tips
    body += `<path d="M${-78 + sx2},${SH - 6} Q${-96 + sx2},${SH - 70} ${sx2},${SH - 84} Q${96 + sx2},${SH - 70} ${78 + sx2},${SH - 6} Q${sx2},${SH + 34} ${-78 + sx2},${SH - 6}Z" fill="${d.topD}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/>`;
    body += `<path d="M${-40 + sx2},${SH - 22} Q${sx2},${SH + 10} ${40 + sx2},${SH - 22}" stroke="${INKC}" stroke-width="3" fill="none" opacity=".45"/>`;
    [-1, 1].forEach(sd => { const x0 = sd * 13 + sx2; body += `<path d="M${x0},${SH - 4} Q${x0 + sd * 3},${SH + 30} ${x0 + sd * 2},${SH + 62}" stroke="#f3ece2" stroke-width="5.5" fill="none" stroke-linecap="round"/><rect x="${x0 + sd * 2 - 4}" y="${SH + 60}" width="8" height="13" rx="2" fill="#b9bec7" stroke="${INKC}" stroke-width="2.5"/>`; });
  } else body += IN(`<rect x="-90" y="${SH - 60}" width="180" height="300" fill="url(#${id}b)"/>`);
  body += `<path d="${B}" fill="none" stroke="${INKC}" stroke-width="${LW}" stroke-linejoin="round"/>`;
  // round head (perfect circle), soft shading on the shadow side
  const R0 = 100, rx = R0, ry = R0, fx = 1.04, fy = 1.04;
  let h = `<circle cx="0" cy="0" r="${R0}" fill="url(#${id}h)" stroke="${INKC}" stroke-width="${LW + 1}"/>`;
  const [lx, ly] = d.look, E = [[-36, -2], [36, -2]];
  // brows: short, thick, rounded
  const by = -44 - d.brows * 7;
  E.forEach(([ex], i) => { const s2 = i ? 1 : -1, t = d.browTilt * 10 * s2; h += `<path d="M${ex - 17},${by + t} Q${ex},${by - 6} ${ex + 17},${by - t}" stroke="${INKC}" stroke-width="10" fill="none" stroke-linecap="round"/>`; });
  // eyes (same family as the reference: heavy-lidded black half-discs, black ovals, round shocked eyes)
  E.forEach(([ex, ey], i) => { const s2 = i ? 1 : -1, px = ex + lx, py = ey + ly;
    if (d.face === 'smug' || d.face === 'angry') { const tl = d.face === 'angry' ? s2 * 4 : -2;
      h += `<path d="M${px - 15},${py - 3 - tl} L${px + 15},${py - 3 + tl} A15 14 0 0 1 ${px - 15},${py - 3 - tl}Z" fill="${INKC}"/><path d="M${px - 19},${py - 4 - tl * 1.2} L${px + 19},${py - 4 + tl * 1.2}" stroke="${INKC}" stroke-width="6" stroke-linecap="round"/>`; }
    else if (d.face === 'open') h += `<ellipse cx="${px}" cy="${py}" rx="10" ry="13" fill="${INKC}"/>`;
    else if (d.face === 'wide') h += `<circle cx="${ex}" cy="${ey}" r="19" fill="#fff" stroke="${INKC}" stroke-width="6"/><circle cx="${ex + lx * .5}" cy="${ey + ly * .5}" r="5.5" fill="${INKC}"/>`;
    else if (d.face === 'closed') h += `<path d="M${ex - 15},${ey} Q${ex},${ey + 10} ${ex + 15},${ey}" stroke="${INKC}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    else if (d.face === 'happy') h += `<path d="M${ex - 15},${ey + 6} Q${ex},${ey - 11} ${ex + 15},${ey + 6}" stroke="${INKC}" stroke-width="7" fill="none" stroke-linecap="round"/>`; });
  const my = 42, mx = lx * .25;
  if (d.mouth === 'smile') h += `<path d="M${mx - 18},${my - 4} Q${mx},${my + 12} ${mx + 18},${my - 4}" stroke="${INKC}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  else if (d.mouth === 'smirk') h += `<path d="M${mx - 4},${my + 4} Q${mx + 14},${my + 8} ${mx + 26},${my - 6}" stroke="${INKC}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  else if (d.mouth === 'line') h += `<path d="M${mx - 12},${my} L${mx + 12},${my}" stroke="${INKC}" stroke-width="6" stroke-linecap="round"/>`;
  else if (d.mouth === 'o') h += `<ellipse cx="${mx}" cy="${my + 2}" rx="9" ry="11" fill="${INKC}"/>`;
  else if (d.mouth === 'grin') h += `<rect x="${mx - 30}" y="${my - 14}" width="60" height="30" rx="8" fill="#fff" stroke="${INKC}" stroke-width="6"/><path d="M${mx - 30},${my + 1} L${mx + 30},${my + 1} M${mx - 15},${my - 14} L${mx - 15},${my + 16} M${mx},${my - 14} L${mx},${my + 16} M${mx + 15},${my - 14} L${mx + 15},${my + 16}" stroke="${INKC}" stroke-width="3.5"/>`;
  else if (d.mouth === 'laugh') h += `<path d="M${mx - 26},${my - 8} Q${mx},${my - 12} ${mx + 26},${my - 8} Q${mx + 20},${my + 26} ${mx},${my + 28} Q${mx - 20},${my + 26} ${mx - 26},${my - 8}Z" fill="${INKC}"/><path d="M${mx - 20},${my - 8} L${mx + 20},${my - 8} L${mx + 18},${my - 1} L${mx - 18},${my - 1}Z" fill="#fff"/>`;
  else if (d.mouth === 'open') h += `<path d="M${mx - 26},${my - 8} Q${mx},${my - 14} ${mx + 26},${my - 8} Q${mx + 20},${my + 28} ${mx},${my + 30} Q${mx - 20},${my + 28} ${mx - 26},${my - 8}Z" fill="${INKC}"/><path d="M${mx - 16},${my + 17} Q${mx},${my + 6} ${mx + 16},${my + 17} Q${mx},${my + 28} ${mx - 16},${my + 17}Z" fill="#e0707a"/>`;
  const hs = `transform="scale(${fx.toFixed(3)},${fy.toFixed(3)})"`;
  if (d.hair === 'quiff') { const hc = d.hairCol || '#2a1a12'; h += `<g ${hs}><path d="M-93,-14 C-102,-74 -62,-108 -14,-106 C2,-132 44,-150 84,-128 C70,-122 64,-116 68,-108 C92,-88 100,-50 93,-14 C80,-46 56,-64 22,-68 C-20,-74 -66,-60 -93,-14Z" fill="${hc}" stroke="${INKC}" stroke-width="${LW - 2}" stroke-linejoin="round"/><path d="M-6,-104 C14,-124 46,-132 70,-124" stroke="#fff" stroke-opacity=".25" stroke-width="7" fill="none" stroke-linecap="round"/></g>`; }
  if (d.cap) h += `<g ${hs}><path d="M-96,-26 C-100,-118 100,-118 96,-26 Q0,-44 -96,-26Z" fill="${d.cap}" stroke="${INKC}" stroke-width="${LW - 2}" stroke-linejoin="round"/><path d="M0,-108 Q-6,-70 -4,-36 M-52,-96 Q-60,-62 -58,-32 M52,-96 Q60,-62 58,-32" stroke="${INKC}" stroke-width="3" fill="none" opacity=".35"/><path d="M-95,-28 Q-150,-26 -162,-8 Q-120,-6 -92,-20Z" fill="${d.capD || d.cap}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/><path d="M-100,-24 Q-140,-22 -152,-10" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" stroke-dasharray="5 5" fill="none"/><path d="M-60,-96 Q0,-118 60,-96" stroke="#fff" stroke-opacity=".18" stroke-width="7" fill="none"/><ellipse cx="0" cy="-110" rx="12" ry="6" fill="${d.capD || d.cap}" stroke="${INKC}" stroke-width="4"/><circle cx="26" cy="-72" r="17" fill="${d.capLogo || '#ffd34a'}" stroke="${INKC}" stroke-width="4"/><text x="26" y="-66" text-anchor="middle" font-family="Inter" font-weight="900" font-size="16" fill="${INKC}">AR</text></g>`;
  if (d.sweat) h += `<path d="M${rx - 2},-62 q15,23 0,31 q-15,-8 0,-31Z" fill="#8fd0ff" stroke="${INKC}" stroke-width="4"/>`;
  s += `<g transform="rotate(${d.lean})">${legs}${arms}${body}<g transform="translate(${sx2},${HC + 8}) rotate(${d.headTilt})">${h}</g></g>`;
  return s;
}
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

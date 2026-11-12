// Archivo Raro · paloma 2D en el estilo del canal (contorno grueso, volumen con degradado, ojo de párpado pesado).
// pigeon(o): SVG en unidades locales, de perfil mirando a la derecha, patas en y=0, alto ≈ 300 (cabeza arriba en y≈-300).
// o: peck 0..1 (cabeza abajo a picotear), bob -1..1 (cabeceo al andar: adelante/atrás), walk (fase o null), flap 0..1 (ala levantada),
//    eye 'calm'|'wide'|'closed'|'angry', look [dx,dy], goggles (gafas de piloto), col/colD (gris), neck (irisado), blink
function pigeon(o = {}) {
  const d = Object.assign({ col: '#a9adbd', colD: '#6f7488', wingC: '#8d92a6', neckA: '#3f9a7a', neckB: '#8a5aa8', peck: 0, bob: 0, walk: null, flap: 0, eye: 'calm', look: [0, 0], goggles: false }, o);
  const K = '#1b1720', id = 'pg' + (++_sid), ph = d.walk;
  const rot = ([x, y], a, [cx, cy]) => { const r = a * Math.PI / 180, c = Math.cos(r), s2 = Math.sin(r); return [cx + (x - cx) * c - (y - cy) * s2, cy + (x - cx) * s2 + (y - cy) * c]; };
  let s = `<defs><linearGradient id="${id}g" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${mixC(d.col, '#ffffff', .25)}"/><stop offset=".55" stop-color="${d.col}"/><stop offset="1" stop-color="${d.colD}"/></linearGradient>
    <linearGradient id="${id}n" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${d.neckA}"/><stop offset=".5" stop-color="${mixC(d.neckA, d.neckB, .5)}"/><stop offset="1" stop-color="${d.neckB}"/></linearGradient>
    <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixC(d.wingC, '#ffffff', .15)}"/><stop offset="1" stop-color="${mixC(d.wingC, '#000000', .2)}"/></linearGradient></defs>`;
  // ---------- patas (rosa), alternan al andar ----------
  const leg = (x, off, far) => { const a = ph == null ? 0 : Math.sin(ph + off) * 18, lift = ph == null ? 0 : Math.max(0, Math.sin(ph + off + Math.PI / 2)) * 16, c = far ? '#c9707a' : '#e88a94';
    return `<g transform="rotate(${a.toFixed(1)} ${x} -62) translate(0,${(-lift).toFixed(1)})"><path d="M${x},-66 L${x + 4},-8" stroke="${K}" stroke-width="15" stroke-linecap="round"/><path d="M${x},-66 L${x + 4},-8" stroke="${c}" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M${x + 4},-6 L${x + 30},-2 M${x + 4},-6 L${x + 18},6 M${x + 4},-6 L${x - 16},-2" stroke="${K}" stroke-width="13" stroke-linecap="round"/><path d="M${x + 4},-6 L${x + 30},-2 M${x + 4},-6 L${x + 18},6 M${x + 4},-6 L${x - 16},-2" stroke="${c}" stroke-width="6" stroke-linecap="round"/></g>`; };
  s += leg(-26, Math.PI, true) + leg(8, 0, false);
  const by = ph == null ? 0 : -Math.abs(Math.sin(ph)) * 6;
  s += `<g transform="translate(0,${by.toFixed(1)})">`;
  // ---------- cola ----------
  s += `<path d="M-96,-118 L-214,-92 Q-226,-74 -212,-62 L-92,-82Z" fill="${d.colD}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><path d="M-176,-84 L-208,-78" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M-150,-98 L-200,-88 M-150,-90 L-200,-74" stroke="${K}" stroke-width="3" opacity=".3"/>`;
  // ---------- cuerpo ----------
  const BP = [[-120, -120], [-90, -176], [-10, -200], [62, -194], [104, -160], [112, -110], [80, -66], [0, -50], [-76, -64], [-112, -88]];
  const B = smoothPath(BP);
  s += `<clipPath id="${id}c"><path d="${B}"/></clipPath><path d="${B}" fill="url(#${id}g)"/>`;
  s += `<g clip-path="url(#${id}c)"><ellipse cx="70" cy="-120" rx="60" ry="70" fill="${mixC(d.col, '#d9b8c8', .35)}" opacity=".55"/><path d="M-60,-74 Q10,-56 80,-70" stroke="${K}" stroke-width="5" fill="none" opacity=".15"/></g>`;
  s += `<path d="${B}" fill="none" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`;
  // ---------- ala (dos barras negras); flap la levanta ----------
  const wa = d.flap * 70;
  const WP = [[-100, -150], [-40, -186], [40, -178], [70, -146], [40, -112], [-40, -96], [-120, -104], [-150, -114]].map(p => rot(p, wa, [40, -170]));
  s += `<path d="${smoothPath(WP)}" fill="url(#${id}w)" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>`;
  [[[-60, -150], [10, -146]], [[-80, -126], [-6, -122]]].forEach(([a, b]) => { const A = rot(a, wa, [40, -170]), Bb = rot(b, wa, [40, -170]); s += `<path d="M${A[0].toFixed(1)},${A[1].toFixed(1)} L${Bb[0].toFixed(1)},${Bb[1].toFixed(1)}" stroke="${K}" stroke-width="12" stroke-linecap="round"/>`; });
  s += `<path d="M-60,-176 Q0,-196 50,-186" stroke="#fff" stroke-width="9" fill="none" opacity=".35" stroke-linecap="round"/>`;
  // ---------- cuello + cabeza (giran juntos al picotear; cabeceo con bob) ----------
  const pa = d.peck * 62, bx = d.bob * 16;
  s += `<g transform="translate(${bx.toFixed(1)},0) rotate(${pa.toFixed(1)} 60 -170)">`;
  const NP = [[24, -186], [40, -238], [70, -262], [104, -250], [112, -206], [104, -164], [72, -150]];
  s += `<path d="${smoothPath(NP)}" fill="url(#${id}n)" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><path d="M50,-232 Q70,-214 96,-220" stroke="#fff" stroke-width="6" fill="none" opacity=".35" stroke-linecap="round"/>`;
  const HX = 92, HY = 282, HR = 46;
  s += `<circle cx="${HX}" cy="-${HY}" r="${HR}" fill="url(#${id}g)" stroke="${K}" stroke-width="10"/><path d="M${HX - 30},-${HY + 26} Q${HX - 4},-${HY + 40} ${HX + 22},-${HY + 30}" stroke="#fff" stroke-width="8" fill="none" opacity=".4" stroke-linecap="round"/>`;
  // pico con carúncula blanca
  s += `<path d="M${HX + 38},-${HY + 4} L${HX + 82},-${HY - 6} L${HX + 38},-${HY - 14}Z" fill="#3a3540" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="${HX + 44}" cy="-${HY + 6}" rx="11" ry="8" fill="#f1eee6" stroke="${K}" stroke-width="4"/>`;
  // ojo (anillo claro, iris naranja, párpado pesado = sello del canal)
  const ex = HX + 16 + d.look[0] * .3, ey = -HY - 8 + d.look[1] * .3;
  if (d.eye === 'closed' || d.blink) s += `<path d="M${HX + 2},-${HY + 8} Q${HX + 16},-${HY - 2} ${HX + 30},-${HY + 8}" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  else { const R = d.eye === 'wide' ? 19 : 15;
    s += `<circle cx="${HX + 16}" cy="-${HY + 8}" r="${R}" fill="#fbfaf4" stroke="${K}" stroke-width="5"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${d.eye === 'wide' ? 9 : 10}" fill="#e8742a"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${d.eye === 'wide' ? 3.5 : 5}" fill="${K}"/>`;
    if (d.eye === 'calm') s += `<path d="M${HX + 16 - R - 2},-${HY + 8} A${R + 2},${R + 2} 0 0 1 ${HX + 16 + R + 2},-${HY + 8} Z" fill="${mixC(d.col, '#000000', .1)}" stroke="${K}" stroke-width="5"/>`;
    if (d.eye === 'angry') s += `<path d="M${HX - 4},-${HY + 30} L${HX + 34},-${HY + 16}" stroke="${K}" stroke-width="8" stroke-linecap="round"/>`; }
  if (d.goggles) s += `<path d="M${HX - 44},-${HY + 4} Q${HX - 10},-${HY + 26} ${HX + 2},-${HY + 22}" stroke="#5a3a22" stroke-width="11" fill="none"/><circle cx="${HX + 16}" cy="-${HY + 30}" r="15" fill="#9fd6ee" stroke="${K}" stroke-width="5"/><circle cx="${HX - 14}" cy="-${HY + 34}" r="13" fill="#9fd6ee" stroke="${K}" stroke-width="5"/><path d="M${HX + 10},-${HY + 38} l8,-4" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
  s += `</g></g>`;
  return s;
}
// pigeonAt(o, pies, cimaCabeza, W): ancla la paloma en el 3D (escala por la distancia pies→cabeza), con sombra suave. o.flip=true la gira a la izquierda.
function pigeonAt(o, F, Top, W, opt = {}) {
  const pf = W.proj(F), pt = W.proj(Top); if (!pf.ok || !pt.ok) return '';
  const dx = pt.x - pf.x, dy = pt.y - pf.y, L = Math.hypot(dx, dy), s = L / 330, rot = Math.atan2(dx, -dy) * 180 / Math.PI;
  const fx = o.flip ? -1 : 1, blur = opt.blur || 0;
  const g = W.proj(new W.T.Vector3(F.x, F.y + .005, F.z));
  return (opt.shadow === false ? '' : `<ellipse cx="${g.x.toFixed(1)}" cy="${g.y.toFixed(1)}" rx="${(150 * s).toFixed(1)}" ry="${(26 * s).toFixed(1)}" fill="#141826" opacity=".28" style="filter:blur(4px)"/>`) +
    `<g transform="translate(${pf.x.toFixed(1)},${pf.y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${(s * fx).toFixed(4)},${s.toFixed(4)})"${blur > .3 ? ` style="filter:blur(${blur.toFixed(1)}px)"` : ''}>${pigeon(o)}</g>`;
}

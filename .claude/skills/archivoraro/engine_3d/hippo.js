// Archivo Raro · hipopótamo 2D en el estilo del canal (contorno grueso, volumen con degradado, ojo de párpado pesado).
// hippo(o): SVG in local units, side view facing right, feet at y=0, length ≈ 830 (x -340..490), height ≈ 390.
// o: open 0..1 (bostezo con colmillos), walk (fase; null = quieto), eye 'calm'|'wide'|'angry'|'closed', look [dx,dy], skin, wet (brillo de agua), ear (0..1 meneo)
function hippo(o = {}) {
  const d = Object.assign({ skin: '#8e8299', skinD: '#5f5570', belly: '#d9a9ae', pink: '#e9919b', open: 0, walk: null, eye: 'calm', look: [0, 0], ear: 0, wet: false, blink: false }, o);
  const K = '#1b1720', id = 'hp' + (++_sid), ph = d.walk;
  const sw = ph == null ? 0 : Math.sin(ph), bob = ph == null ? 0 : -Math.abs(Math.cos(ph)) * 7;
  const rot = ([x, y], a, [cx, cy]) => { const r = a * Math.PI / 180, c = Math.cos(r), s2 = Math.sin(r); return [cx + (x - cx) * c - (y - cy) * s2, cy + (x - cx) * s2 + (y - cy) * c]; };
  let s = `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixC(d.skin, '#ffffff', .2)}"/><stop offset=".5" stop-color="${d.skin}"/><stop offset="1" stop-color="${d.skinD}"/></linearGradient>
    <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixC(d.skinD, '#000000', .1)}"/><stop offset="1" stop-color="${mixC(d.skinD, '#000000', .3)}"/></linearGradient>
    <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a2a36"/><stop offset="1" stop-color="${d.pink}"/></linearGradient></defs>`;
  // ---------- legs: diagonal gait (near front + far back move together) ----------
  const leg = (x, far, off) => { const a = ph == null ? 0 : Math.sin(ph + off) * 13, lift = ph == null ? 0 : Math.max(0, Math.sin(ph + off + Math.PI / 2)) * 14;
    const fill = far ? `url(#${id}f)` : `url(#${id}g)`, w = far ? 40 : 46;
    const LP = smoothPath([[x - w - 10, -190], [x - w - 6, -120], [x - w + 6, -52], [x - w + 2, -14], [x - w + 14, 0], [x + w - 10, 0], [x + w + 4, -14], [x + w - 2, -52], [x + w + 8, -120], [x + w + 12, -190], [x, -205]]);
    return `<g transform="rotate(${a.toFixed(1)} ${x} -150) translate(0,${(-lift).toFixed(1)})"><path d="${LP}" fill="${fill}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><path d="M${x - w + 2},-42 Q${x},-30 ${x + w - 2},-42" stroke="${K}" stroke-width="4" fill="none" opacity=".3"/>` +
      [-1, 0, 1].map(k => `<ellipse cx="${x + 12 + k * 15}" cy="-6" rx="7" ry="8" fill="${far ? mixC(d.skinD, '#ffffff', .25) : '#efe2d6'}" stroke="${K}" stroke-width="3.5"/>`).join('') +
      (far ? '' : `<path d="M${x - w + 10},-60 Q${x},-50 ${x + w - 10},-60" stroke="${K}" stroke-width="4" fill="none" opacity=".35"/>`) + `</g>`; };
  s += leg(110, true, Math.PI) + leg(-200, true, 0) + leg(170, false, 0) + leg(-140, false, Math.PI);
  // ---------- body ----------
  const BP = [[-335, -178], [-312, -292], [-170, -352], [40, -350], [190, -318], [250, -236], [236, -138], [150, -84], [-60, -72], [-258, -92], [-330, -128]];
  const B = smoothPath(BP);
  s += `<g transform="translate(0,${bob.toFixed(1)})">`;
  s += `<path d="M-332,-170 q-34,8 -40,44" stroke="${K}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-372,-126 l-10,12 l14,4 l4,-14Z" fill="${K}"/>`;   // tail
  s += `<clipPath id="${id}c"><path d="${B}"/></clipPath><path d="${B}" fill="url(#${id}g)"/>`;
  s += `<g clip-path="url(#${id}c)"><ellipse cx="-30" cy="-60" rx="300" ry="70" fill="${d.belly}" opacity=".55"/>` +
    `<path d="M150,-330 Q172,-250 150,-170 M120,-338 Q138,-260 120,-160" stroke="${K}" stroke-width="5" fill="none" opacity=".22" stroke-linecap="round"/>` +             // neck folds
    `<path d="M-250,-150 Q-230,-120 -190,-110" stroke="${K}" stroke-width="5" fill="none" opacity=".2"/>` + [[-120, -250], [-60, -280], [0, -232], [-170, -210], [60, -270]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${d.skinD}" opacity=".35"/>`).join('') + `</g>`;
  s += `<path d="${B}" fill="none" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`;
  s += `<path d="M-230,-318 Q-80,-362 80,-338" stroke="#ffffff" stroke-width="12" fill="none" opacity="${d.wet ? .55 : .28}" stroke-linecap="round"/>`;                         // back shine
  if (d.wet) s += `<path d="M-120,-322 Q-60,-338 0,-332" stroke="#ffffff" stroke-width="6" fill="none" opacity=".6" stroke-linecap="round"/>`;
  s += `</g>`;

  // ---------- head: upper part + jaw hinged at (262,-246) ----------
  const H = [262, -246], ou = -d.open * 30, oj = d.open * 20;
  const U = [[200, -300], [232, -356], [300, -376], [380, -362], [440, -350], [484, -314], [490, -266], [472, -244], [400, -242], [320, -240], [250, -248], [206, -268]];
  const Jw = [[250, -248], [320, -240], [400, -242], [472, -244], [482, -218], [462, -186], [392, -170], [300, -172], [244, -196], [224, -226]];
  const Ur = U.map(p => rot(p, ou, H)), Jr = Jw.map(p => rot(p, oj, H));
  s += `<g transform="translate(0,${bob.toFixed(1)})">`;
  if (d.open > .02) { const a = rot([476, -244], ou, H), b = rot([476, -240], oj, H), m1 = rot([380, -242], ou, H), m2 = rot([380, -240], oj, H);
    s += `<path d="M${H[0]},${H[1]} L${m1[0].toFixed(1)},${m1[1].toFixed(1)} L${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)} L${m2[0].toFixed(1)},${m2[1].toFixed(1)}Z" fill="url(#${id}m)" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>`;
    const tg = rot([392, -236], oj, H); s += `<ellipse cx="${tg[0].toFixed(1)}" cy="${tg[1].toFixed(1)}" rx="54" ry="18" fill="#d9707e" transform="rotate(${oj} ${tg[0].toFixed(1)} ${tg[1].toFixed(1)})"/>`; }
  // jaw with big cheek
  s += `<path d="${smoothPath(Jr)}" fill="url(#${id}g)" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`;
  const ck = rot([300, -212], oj, H); s += `<ellipse cx="${ck[0].toFixed(1)}" cy="${ck[1].toFixed(1)}" rx="40" ry="26" fill="${d.belly}" opacity=".45"/>`;
  if (d.open > .02) { // lower tusks + teeth
    [[456, -246, 1], [420, -244, .8]].forEach(([x, y, k]) => { const p = rot([x, y], oj, H); s += `<path d="M${(p[0] - 9 * k).toFixed(1)},${p[1].toFixed(1)} Q${(p[0] - 12 * k).toFixed(1)},${(p[1] - 46 * k).toFixed(1)} ${(p[0] + 6 * k).toFixed(1)},${(p[1] - 54 * k).toFixed(1)} Q${(p[0] + 4 * k).toFixed(1)},${(p[1] - 20 * k).toFixed(1)} ${(p[0] + 10 * k).toFixed(1)},${p[1].toFixed(1)}Z" fill="#fbf6e8" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`; }); }
  // upper head
  s += `<path d="${smoothPath(Ur)}" fill="url(#${id}g)" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`;
  if (d.open > .02) { const p = rot([462, -246], ou, H); s += `<path d="M${(p[0] - 8).toFixed(1)},${p[1].toFixed(1)} l6,22 l8,-22Z" fill="#fbf6e8" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`; }
  else { const a = rot([476, -244], 0, H); s += `<path d="M300,-238 Q390,-232 ${a[0]},${a[1] + 2}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>`; }
  const g = (p, a = ou) => rot(p, a, H).map(v => v.toFixed(1)).join(',');
  // nostrils bump, ears, eye bump (all ride on the upper head)
  const up = `rotate(${ou} ${H[0]} ${H[1]})`;
  s += `<g transform="${up}"><path d="M412,-350 Q440,-382 470,-350" fill="url(#${id}g)" stroke="${K}" stroke-width="8"/><ellipse cx="434" cy="-354" rx="7" ry="4" fill="${K}" transform="rotate(-20 434 -354)"/><ellipse cx="458" cy="-350" rx="6" ry="4" fill="${K}" transform="rotate(20 458 -350)"/>` +
    `<path d="M380,-300 Q420,-290 452,-302" stroke="${K}" stroke-width="4" fill="none" opacity=".3"/><circle cx="360" cy="-290" r="4" fill="${d.skinD}"/><circle cx="378" cy="-276" r="4" fill="${d.skinD}"/><circle cx="396" cy="-288" r="4" fill="${d.skinD}"/>` +
    `<g transform="rotate(${(-15 + d.ear * 18).toFixed(1)} 238 -378)"><ellipse cx="232" cy="-394" rx="16" ry="24" fill="url(#${id}g)" stroke="${K}" stroke-width="7"/><ellipse cx="232" cy="-392" rx="7" ry="13" fill="${d.pink}"/></g>` +
    `<path d="M256,-366 Q290,-412 326,-366" fill="url(#${id}g)" stroke="${K}" stroke-width="8"/>`;
  const [lx, ly] = d.look, ex = 292, ey = -372;
  if (d.eye === 'closed' || d.blink) s += `<path d="M${ex - 16},${ey} Q${ex},${ey + 9} ${ex + 16},${ey}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  else { s += `<ellipse cx="${ex}" cy="${ey}" rx="17" ry="19" fill="#ffffff" stroke="${K}" stroke-width="5"/><ellipse cx="${ex + 5 + lx}" cy="${ey + 2 + ly}" rx="${d.eye === 'wide' ? 5 : 7.5}" ry="${d.eye === 'wide' ? 5.5 : 9}" fill="${K}"/><circle cx="${ex + 8 + lx}" cy="${ey - 3 + ly}" r="2.4" fill="#fff"/>`;
    if (d.eye === 'calm') s += `<path d="M${ex - 19},${ey - 1} Q${ex},${ey - 26} ${ex + 19},${ey - 1} L${ex + 19},${ey - 4} Q${ex},${ey - 12} ${ex - 19},${ey - 4}Z" fill="${d.skin}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`;
    if (d.eye === 'angry') s += `<path d="M${ex - 22},${ey - 30} L${ex + 20},${ey - 16}" stroke="${K}" stroke-width="9" stroke-linecap="round"/>`; }
  s += `</g></g>`;
  return s;
}

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

// ======================= hipopótamo v2 (de frente / 3-4, con carácter) =======================
// hippo2(o): front view, feet at y=0, ear tips ≈ -470. o.style 'A' (simpático: ojos grandes) | 'B' (salvaje: párpado pesado, ceño, colmillos grandes)
// o.open 0..1 bostezo, o.turn -1..1 (gira hocico), o.look [dx,dy], o.ear 0..1, o.wet, o.blink
function hippo2(o = {}) {
  const A = (o.style || 'A') === 'A';
  const d = Object.assign({ skin: A ? '#a294bf' : '#7d7486', skinD: A ? '#6f6296' : '#4f4858', muzzle: A ? '#d8b4cf' : '#b39aa6', belly: A ? '#d7c4e3' : '#a99ca8', pink: '#ee8fa3', open: 0, turn: 0, look: [0, 0], ear: 0, wet: false, blink: false }, o);
  const K = '#1b1720', id = 'h2' + (++_sid), tn = d.turn * 22, op = d.open, wk = d.walk, bobW = wk == null ? 0 : -Math.abs(Math.sin(wk)) * 12, swW = wk == null ? 0 : Math.sin(wk) * 2.2;
  const P = pts => smoothPath(pts.map(([x, y]) => [x, y]));
  let s = `<defs><linearGradient id="${id}g" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="${mixC(d.skin, '#ffffff', .22)}"/><stop offset=".55" stop-color="${d.skin}"/><stop offset="1" stop-color="${d.skinD}"/></linearGradient>
    <linearGradient id="${id}m" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="${mixC(d.muzzle, '#ffffff', .25)}"/><stop offset="1" stop-color="${mixC(d.muzzle, '#000000', .12)}"/></linearGradient>
    <radialGradient id="${id}i" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#e5717f"/><stop offset="1" stop-color="#7a1f30"/></radialGradient></defs>`;
  const shade = (path, cid) => `<clipPath id="${cid}"><path d="${path}"/></clipPath><g clip-path="url(#${cid})"><ellipse cx="160" cy="40" rx="260" ry="600" fill="#2a1f3a" opacity=".18"/></g>`;
  // ---- body ----
  const BODY = P([[-262, -150], [-250, -310], [-168, -408], [0, -432], [168, -408], [252, -310], [266, -150], [210, -64], [0, -44], [-210, -64]]);
  s += `<path d="${BODY}" fill="url(#${id}g)" stroke="${K}" stroke-width="11" stroke-linejoin="round"/>` + shade(BODY, id + 'c1');
  s += `<clipPath id="${id}cb"><path d="${BODY}"/></clipPath><g clip-path="url(#${id}cb)"><ellipse cx="0" cy="-96" rx="170" ry="70" fill="${d.belly}" opacity=".7"/></g>`;
  s += `<path d="M-220,-330 Q-150,-400 -40,-416" stroke="#ffffff" stroke-width="12" fill="none" opacity="${d.wet ? .5 : .3}" stroke-linecap="round"/>`;
  // ---- stubby front legs with toes ----
  let legsS = '';
  [-1, 1].forEach(sd => { const x = sd * 120, lf = wk == null ? 0 : Math.max(0, Math.sin(wk + (sd > 0 ? 0 : Math.PI))) * 30; const L = P([[x - 62, -150], [x - 60, -40], [x - 48, -4], [x + 48, -4], [x + 60, -40], [x + 62, -150], [x, -170]]);
    legsS += `<g transform="translate(0,${(-lf - bobW).toFixed(1)})"><path d="${L}" fill="url(#${id}g)" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>` + shade(L, id + 'l' + sd) + [-1, 0, 1].map(k => `<ellipse cx="${x + k * 28}" cy="-14" rx="13" ry="11" fill="${mixC(d.belly, '#ffffff', .4)}" stroke="${K}" stroke-width="4"/>`).join('') +
      `<path d="M${x - 50},-70 Q${x},-58 ${x + 50},-70" stroke="${K}" stroke-width="4" fill="none" opacity=".25"/></g>`; });
  s += legsS;
  // ---- ears (behind head) ----
  [-1, 1].forEach(sd => { const ex = sd * 128 + tn * .5; s += `<g transform="rotate(${sd * (24 + d.ear * 18)} ${ex} -436)"><ellipse cx="${ex}" cy="-458" rx="24" ry="32" fill="url(#${id}g)" stroke="${K}" stroke-width="8"/><ellipse cx="${ex}" cy="-454" rx="11" ry="18" fill="${d.pink}"/></g>`; });
  // ---- head (cranium) ----
  const HEAD = P([[-148 + tn * .3, -268], [-158 + tn * .4, -372], [-96 + tn * .5, -446], [0 + tn * .5, -462], [96 + tn * .5, -446], [158 + tn * .4, -372], [148 + tn * .3, -268], [0 + tn * .3, -250]]);
  s += `<path d="${HEAD}" fill="url(#${id}g)" stroke="${K}" stroke-width="11" stroke-linejoin="round"/>` + shade(HEAD, id + 'c2');
  // ---- eyes on bumps ----
  const ey = -398, ex = [-62 + tn, 62 + tn], [lx, ly] = d.look;
  ex.forEach((x, i) => { const sd = i ? 1 : -1; s += `<path d="M${x - 50},${ey + 14} Q${x - 48},${ey - 48} ${x},${ey - 52} Q${x + 48},${ey - 48} ${x + 50},${ey + 14}" fill="url(#${id}g)" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>`;
    if (d.blink) { s += `<path d="M${x - 24},${ey - 2} Q${x},${ey + 12} ${x + 24},${ey - 2}" stroke="${K}" stroke-width="8" fill="none" stroke-linecap="round"/>`; return; }
    if (A) s += `<ellipse cx="${x}" cy="${ey - 6}" rx="30" ry="34" fill="#fff" stroke="${K}" stroke-width="7"/><ellipse cx="${x + lx + sd * 2}" cy="${ey - 2 + ly}" rx="16" ry="19" fill="${K}"/><circle cx="${x + lx + 6}" cy="${ey - 10 + ly}" r="6" fill="#fff"/><circle cx="${x + lx - 6}" cy="${ey + 6 + ly}" r="2.6" fill="#fff"/>` +
      `<path d="M${x - 22},${ey - 58} Q${x},${ey - 66} ${x + 22},${ey - 58 - sd * 2}" stroke="${K}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    else s += `<ellipse cx="${x}" cy="${ey - 4}" rx="27" ry="24" fill="#fff" stroke="${K}" stroke-width="7"/><ellipse cx="${x + lx}" cy="${ey + 2 + ly}" rx="10" ry="12" fill="${K}"/><circle cx="${x + lx + 4}" cy="${ey - 2 + ly}" r="3" fill="#fff"/>` +
      `<path d="M${x - 30},${ey - 10 + sd * 4} Q${x},${ey - 30} ${x + 30},${ey - 10 - sd * 4} L${x + 30},${ey - 30} L${x - 30},${ey - 30}Z" fill="${d.skin}"/><path d="M${x - 30},${ey - 10 + sd * 4} Q${x},${ey - 24} ${x + 30},${ey - 10 - sd * 4}" stroke="${K}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<path d="M${x - 34},${ey - 40 - sd * 12} L${x + 30},${ey - 40 + sd * 12}" stroke="${K}" stroke-width="12" stroke-linecap="round"/>`; });
  // ---- muzzle: closed, or split into upper lip + dropped jaw ----
  const mz = tn * 1.1, up = op * 72, dn = op * 46;
  const UP = P([[-176 + mz, -262 - up], [-180 + mz, -206 - up], [-128 + mz, -178 - up * .9], [0 + mz, -170 - up * .8], [128 + mz, -178 - up * .9], [180 + mz, -206 - up], [176 + mz, -262 - up], [120 + mz, -312 - up], [0 + mz, -322 - up], [-120 + mz, -312 - up]]);
  const JAW = P([[-150 + mz, -196 + dn], [-160 + mz, -140 + dn], [-104 + mz, -96 + dn], [0 + mz, -82 + dn], [104 + mz, -96 + dn], [160 + mz, -140 + dn], [150 + mz, -196 + dn], [0 + mz, -190 + dn]]);
  if (op > .02) {
    s += `<path d="${JAW}" fill="url(#${id}m)" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`;
    s += `<ellipse cx="${mz}" cy="${-190 - up * .35 + dn * .3}" rx="${146}" ry="${18 + op * 62}" fill="url(#${id}i)" stroke="${K}" stroke-width="9"/><ellipse cx="${mz}" cy="${-150 + dn * .5}" rx="88" ry="${10 + op * 18}" fill="#ef8a98" stroke="${K}" stroke-width="5"/>`;
    const tk = A ? 1 : 1.5; [-1, 1].forEach(sd => { const x = mz + sd * 96, y = -186 + dn * .7; s += `<path d="M${x - 14 * tk},${y} Q${x - 12 * tk},${y - 56 * tk} ${x + sd * 6},${y - 66 * tk} Q${x + 12 * tk},${y - 30 * tk} ${x + 14 * tk},${y}Z" fill="#fbf6e8" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`;
      const ux = mz + sd * 70, uy = -178 - up * .82; s += `<path d="M${ux - 10},${uy} L${ux},${uy + 28 * tk} L${ux + 10},${uy}Z" fill="#fbf6e8" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`; });
    s += `<path d="${UP}" fill="url(#${id}m)" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`;
  } else {
    const M = P([[-176 + mz, -262], [-182 + mz, -200], [-130 + mz, -136], [0 + mz, -118], [130 + mz, -136], [182 + mz, -200], [176 + mz, -262], [120 + mz, -312], [0 + mz, -322], [-120 + mz, -312]]);
    s += `<path d="${M}" fill="url(#${id}m)" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`;
    s += `<path d="M${-132 + mz},${-196} Q${mz},${A ? -150 : -176} ${132 + mz},${-196}" stroke="${K}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M${-132 + mz},-196 q-12,-6 -14,-18 M${132 + mz},-196 q12,-6 14,-18" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    const tk = A ? .8 : 1.3; [-1, 1].forEach(sd => { const x = mz + sd * 78, y = A ? -170 : -180; s += `<path d="M${x - 10 * tk},${y + 6} Q${x - 8 * tk},${y - 26 * tk} ${x + sd * 4},${y - 32 * tk} Q${x + 9 * tk},${y - 14 * tk} ${x + 10 * tk},${y + 6}Z" fill="#fbf6e8" stroke="${K}" stroke-width="4.5" stroke-linejoin="round"/>`; });
  }
  // nostrils + freckle dots + cheeks (on the upper muzzle)
  const ny = -282 - up; s += [-1, 1].map(sd => `<ellipse cx="${mz + sd * 50}" cy="${ny}" rx="15" ry="10" fill="${K}" transform="rotate(${sd * 24} ${mz + sd * 50} ${ny})"/><path d="M${mz + sd * 50 - 22},${ny - 12} Q${mz + sd * 50},${ny - 26} ${mz + sd * 50 + 22},${ny - 12}" stroke="${K}" stroke-width="5" fill="none" opacity=".45"/>`).join('');
  s += [[-110, -232], [-92, -250], [-124, -252], [110, -232], [92, -250], [124, -252]].map(([x, y]) => `<circle cx="${x + mz}" cy="${y - up}" r="4.5" fill="${K}" opacity=".45"/>`).join('');
  if (A) s += [-1, 1].map(sd => `<ellipse cx="${mz + sd * 150}" cy="${-226 - up * .5}" rx="26" ry="15" fill="${d.pink}" opacity=".55"/>`).join('');
  else s += `<path d="M${mz - 150},-290 l26,10 M${mz - 140},-270 l22,6" stroke="${K}" stroke-width="4" opacity=".4"/>`;   // scar marks
  if (d.wet) s += `<path d="M${-60 + tn},-448 Q${tn},-458 ${60 + tn},-448" stroke="#fff" stroke-width="8" fill="none" opacity=".55" stroke-linecap="round"/>`;
  return `<g transform="translate(0,${bobW.toFixed(1)}) rotate(${swW.toFixed(2)} 0 -40)">${s}</g>`;
}
// Anchor hippo2 in 3D: F = ground point under the hippo, Top = point at the top of its head (≈ 1.6 m above F). opt.water: world y of the water surface (clips + tints what is under it)
function hippoAt(o, F, Top, W, opt = {}) {
  const pf = W.proj(F), pt = W.proj(Top); if (!pf.ok || !pt.ok) return '';
  const dx = pt.x - pf.x, dy = pt.y - pf.y, L = Math.hypot(dx, dy), s = L / 462, rot = Math.atan2(dx, -dy) * 180 / Math.PI, id = 'ha' + (++_sid);
  const body = `<g transform="translate(${pf.x.toFixed(1)},${pf.y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${s.toFixed(4)})">${hippo2(o)}</g>`;
  let out = '';
  if (opt.water != null) { const wp = W.proj(new W.T.Vector3(F.x, opt.water, F.z)), wy = wp.y, wr = 300 * s;
    out += `<defs><clipPath id="${id}a"><rect x="0" y="0" width="1080" height="${wy.toFixed(1)}"/></clipPath><clipPath id="${id}b"><rect x="0" y="${wy.toFixed(1)}" width="1080" height="2000"/></clipPath></defs>`;
    out += `<g clip-path="url(#${id}a)">${body}</g><path d="M${(pf.x - wr * 1.15).toFixed(1)},${wy.toFixed(1)} Q${pf.x.toFixed(1)},${(wy + wr * .12).toFixed(1)} ${(pf.x + wr * 1.15).toFixed(1)},${wy.toFixed(1)}" stroke="#1b1720" stroke-width="${(7 * s / .4).toFixed(1)}" fill="none" opacity=".35" stroke-linecap="round"/>`;
    const t = (window.__T || 0); for (let k = 0; k < 3; k++) { const ph = ((t * .6 + k / 3) % 1); out += `<ellipse cx="${pf.x.toFixed(1)}" cy="${wy.toFixed(1)}" rx="${(wr * (.9 + ph * .7)).toFixed(1)}" ry="${(wr * (.13 + ph * .09)).toFixed(1)}" fill="none" stroke="#e9f4f0" stroke-width="${(6 * (1 - ph)).toFixed(1)}" opacity="${(.8 * (1 - ph)).toFixed(2)}"/>`; }
  } else { const g = W.proj(new W.T.Vector3(F.x, F.y + .01, F.z)); out += `<ellipse cx="${g.x.toFixed(1)}" cy="${g.y.toFixed(1)}" rx="${(260 * s).toFixed(1)}" ry="${(48 * s).toFixed(1)}" fill="#141826" opacity=".3" style="filter:blur(6px)"/>` + body; }
  return out;
}

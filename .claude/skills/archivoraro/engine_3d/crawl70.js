// Gateo de perfil (70): figura propia del canal dibujada a mano con la misma cabeza de stick() (headOnly), cuerpo de rayas,
// brazos y piernas con IK de dos huesos y apoyos que NO patinan: cada mano/rodilla queda clavada en el suelo mientras apoya
// (fase de apoyo 65 %) y avanza en arco en la fase de vuelo. Marcha en diagonal: mano izq. + rodilla dcha. a la vez, y al revés.
// x0 = posición de la cadera en el instante 0, v = m/s, f = ciclos/s; mundo: el túnel va a lo largo de x, la cámara mira a -z.
function crawlFig(t, o = {}) {
  const v = o.v ?? .62, f = o.f ?? 1.25, stride = v / f, duty = .64, Z = o.z ?? -2.78, Y0 = o.floor ?? -3.1, x0 = o.x0 ?? 3.0, P = (x, y) => W2.proj(V3(x, y, Z));
  const hipX = x0 + v * t; const cyc = t * f;
  // apoyos: [desplazamiento respecto a la cadera/hombro al empezar el apoyo, fase]
  const limb = (base, ph, lift) => { const u = cyc + ph, k = Math.floor(u), fr = u - k; const c0 = base + (k + .5) * stride;   // punto de apoyo del ciclo k (fijo en el mundo)
    if (fr < duty) return { x: c0, y: 0, swing: 0 }; const s = (fr - duty) / (1 - duty), e = s * s * (3 - 2 * s); return { x: c0 + e * stride, y: Math.sin(Math.PI * s) * lift, swing: s }; };
  const Lk = limb(x0 - .05, .0, .07), Rk = limb(x0 - .05, .5, .07), Lh = limb(x0 + .66, .5, .13), Rh = limb(x0 + .66, .0, .13);
  // cadera y hombros con balanceo (sube cuando la rodilla está debajo)
  const bobH = .025 * Math.cos(cyc * Math.PI * 4), hip = { x: hipX, y: Y0 + .47 + bobH }, sh = { x: hipX + .6, y: Y0 + .6 + .02 * Math.cos(cyc * Math.PI * 4 + 1.2) };
  const ang = Math.atan2(sh.y - hip.y, sh.x - hip.x);
  // IK de dos huesos en pantalla: devuelve el codo/rodilla; bend = +1/-1 elige hacia dónde dobla
  const ik = (A, B, l1, l2, bend) => { const dx = B.x - A.x, dy = B.y - A.y, d = Math.min(l1 + l2 - .001, Math.hypot(dx, dy)); const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), b = Math.atan2(dy, dx) + bend * a; return { x: A.x + Math.cos(b) * l1, y: A.y + Math.sin(b) * l1 }; };
  const pa = P(hip.x, hip.y), pb = P(hip.x + 1, hip.y), ppm = Math.hypot(pb.x - pa.x, pb.y - pa.y), S = ppm * .004;   // 1 unidad del personaje = 4 mm
  const scr = q => P(q.x, q.y), INKW = Math.max(3, 10 * S);
  const noodle = (A, M, B, w, col = K) => `<path d="M${A.x.toFixed(1)},${A.y.toFixed(1)} Q${(2 * M.x - (A.x + B.x) / 2).toFixed(1)},${(2 * M.y - (A.y + B.y) / 2).toFixed(1)} ${B.x.toFixed(1)},${B.y.toFixed(1)}" stroke="${col}" stroke-width="${w.toFixed(1)}" fill="none" stroke-linecap="round"/>`;
  const handSVG = (H, rot) => `<g transform="translate(${H.x.toFixed(1)},${H.y.toFixed(1)}) rotate(${rot.toFixed(0)})"><ellipse rx="${(14 * S).toFixed(1)}" ry="${(11 * S).toFixed(1)}" fill="${K}"/></g>`;
  const legSVG = (Kp, far) => { const knee = { x: Kp.x, y: Y0 + .05 + Kp.y }, foot = { x: Kp.x - .44, y: Y0 + .07 + Kp.y * .4 + (Kp.swing ? .03 : 0) }; const H = scr(hip), Kn = scr(knee), Ft = scr(foot);
    const m1 = ik(hip, knee, .47, .47, 1), mid = scr({ x: (hip.x + knee.x) / 2 + .06, y: (hip.y + knee.y) / 2 }), mid2 = scr({ x: (knee.x + foot.x) / 2, y: (knee.y + foot.y) / 2 + .015 });
    const col = far ? '#3a3640' : K; let g = noodle(H, mid, Kn, (LW + 2) * S, col) + noodle(Kn, mid2, Ft, (LW + 2) * S, col);
    g += `<g transform="translate(${Ft.x.toFixed(1)},${Ft.y.toFixed(1)}) rotate(-80)"><path d="M${-15 * S},${-5 * S} Q${-17 * S},${13 * S} ${8 * S},${13 * S} Q${26 * S},${11 * S} ${21 * S},${-3 * S} Q${10 * S},${-15 * S} ${-9 * S},${-12 * S}Z" fill="${far ? '#d8d4c8' : '#f2f0ea'}" stroke="${K}" stroke-width="${(6 * S).toFixed(1)}" stroke-linejoin="round"/><path d="M${-15 * S},${9 * S} L${23 * S},${9 * S}" stroke="#2a2a34" stroke-width="${(5 * S).toFixed(1)}" stroke-linecap="round"/></g>`; return g; };
  const armSVG = (Hp, far) => { const hand = { x: Hp.x, y: Y0 + .045 + Hp.y }, el = ik(sh, hand, .36, .34, 1), Sx = scr(sh), Ex = scr(el), Hx = scr(hand), col = far ? '#3a3640' : K;
    return noodle(Sx, scr({ x: (sh.x + el.x) / 2, y: (sh.y + el.y) / 2 }), Ex, LW * S, col) + noodle(Ex, scr({ x: (el.x + hand.x) / 2, y: (el.y + hand.y) / 2 }), Hx, LW * S, col) + handSVG(Hx, -20); };
  // cuerpo: judía con rayas (las rayas del uniforme rodean el cuerpo → al estar tumbado se ven como bandas que cruzan el torso)
  const H = scr(hip), Sh = scr(sh), cx = (H.x + Sh.x) / 2, cy = (H.y + Sh.y) / 2, Lb = Math.hypot(Sh.x - H.x, Sh.y - H.y), rot = Math.atan2(Sh.y - H.y, Sh.x - H.x) * 180 / Math.PI, bw = 66 * S * 1.0, bl = Lb / 2 + 70 * S;
  const bid = 'cb' + Math.floor(Math.random() * 1e9); let stripes = ''; for (let k = -6; k <= 6; k++) stripes += `<rect x="${(k * 30 * S - 7 * S).toFixed(1)}" y="${(-bw * 1.4).toFixed(1)}" width="${(15 * S).toFixed(1)}" height="${(bw * 2.8).toFixed(1)}" fill="#2a2a34"/>`;
  const bean = `M${-bl},${(-bw * .2).toFixed(1)} C${-bl},${(-bw * 1.05).toFixed(1)} ${(bl * .6).toFixed(1)},${(-bw * 1.15).toFixed(1)} ${bl},${(-bw * .35).toFixed(1)} C${(bl * 1.08).toFixed(1)},${(bw * .4).toFixed(1)} ${(bl * .5).toFixed(1)},${(bw * 1.0).toFixed(1)} ${-bl * .2},${(bw * .95).toFixed(1)} C${-bl * .9},${(bw * .9).toFixed(1)} ${-bl * 1.05},${(bw * .5).toFixed(1)} ${-bl},${(-bw * .2).toFixed(1)}Z`;
  const body = `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) rotate(${rot.toFixed(1)})"><defs><clipPath id="${bid}"><path d="${bean}"/></clipPath><linearGradient id="${bid}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient></defs>` +
    `<path d="${bean}" fill="#f2ede0"/><g clip-path="url(#${bid})">${stripes}<rect x="${-bl * 1.2}" y="${-bw * 1.3}" width="${bl * 2.4}" height="${bw * 2.6}" fill="url(#${bid}g)"/></g><path d="${bean}" fill="none" stroke="${K}" stroke-width="${INKW.toFixed(1)}" stroke-linejoin="round"/></g>`;
  // cabeza: la misma de stick() (ojos de palo, pelo rapado), mirando adelante, con linterna frontal
  const head = { x: sh.x + .2 + .01 * Math.sin(cyc * Math.PI * 2), y: sh.y + .28 + .015 * Math.sin(cyc * Math.PI * 4 + .5) }, Hd = scr(head), hs = S;
  const face = Object.assign({}, window.CAST70.PRESO, { headOnly: true, face: o.face || 'smug', mouth: o.mouth || 'smirk', look: [20, 2], turn: .55, brows: -.1, browTilt: .25, headTilt: 6 + 3 * Math.sin(cyc * Math.PI * 2) }, o.faceOpt || {});
  const lamp = { x: head.x + .3, y: head.y + .2 }, Lp = scr(lamp);
  let beam = ''; if (o.lamp !== false) { const B1 = scr({ x: lamp.x + 2.6, y: Y0 + .1 }), B2 = scr({ x: lamp.x + 2.6, y: Y0 + 1.35 }); beam = `<defs><linearGradient id="${bid}l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6c0" stop-opacity=".55"/><stop offset="1" stop-color="#fff6c0" stop-opacity="0"/></linearGradient></defs><path d="M${Lp.x.toFixed(1)},${Lp.y.toFixed(1)} L${B1.x.toFixed(1)},${B1.y.toFixed(1)} L${B2.x.toFixed(1)},${B2.y.toFixed(1)}Z" fill="url(#${bid}l)"/>`; }
  const headSVG = `<g transform="translate(${Hd.x.toFixed(1)},${Hd.y.toFixed(1)}) scale(${hs.toFixed(4)})">${stick(face)}` +
    (o.lamp !== false ? `<path d="M-98,-40 Q0,-74 96,-48" stroke="#2a2a30" stroke-width="20" fill="none"/><g transform="translate(74,-60) rotate(-20)"><rect x="-6" y="-24" width="40" height="44" rx="8" fill="#3a3a42" stroke="${K}" stroke-width="7"/><ellipse cx="34" cy="-2" rx="8" ry="20" fill="#fff6c0" stroke="${K}" stroke-width="5"/></g>` : '') + `</g>`;
  // polvo al apoyar las manos
  let dust = ''; [Lh, Rh].forEach(hp => { if (hp.swing === 0) { const u = ((cyc + (hp === Lh ? .5 : 0)) % 1); if (u < .18) { const q = scr({ x: hp.x, y: Y0 + .02 }); dust += `<g opacity=".55">${puff(q.x, q.y, 9 * S * 4, u / .18, '#c8a07a')}</g>`; } } });
  if (o.light !== false && W2.setLantern) W2.setLantern(V3(lamp.x + .3, lamp.y, Z + .5), 4.5);
  // capas: extremidades lejanas, cuerpo, cabeza, extremidades cercanas
  return beam + legSVG(Rk, true) + armSVG(Rh, true) + body + legSVG(Lk, false) + armSVG(Lh, false) + headSVG + dust;
}

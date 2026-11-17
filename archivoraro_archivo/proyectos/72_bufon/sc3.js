
// ---------- el rey sentado en el trono ----------
const SIT_K = SITP(1.29, .75), KSEAT = V3(0, SIT_K.y0, -13.75);
const kingSit = (pose, opt) => [KSEAT, who('REY', Object.assign({ legLen: SEAT_LEG, legL: [10, -6], legR: [10, -6], hose: ['#22408f', '#22408f'], armL: [24, 30], armR: [24, 30], cape: null }, pose), KSEAT, ADULT, Object.assign({ shadow: false, light: Object.assign({}, IN, { rimA: 0 }) }, opt))];
let SEAT_LEG = .62;
const KHEAD = () => V3(0, KSEAT.y + 1.72, KSEAT.z);
// bufón delante de la tarima
const JF0 = V3(0, 0, -9.5);

// ---------- recorte de papel (la «inserción» del chiste) ----------
function paperBG(t) { let o = `<defs><radialGradient id="ppv" cx=".5" cy=".46" r=".75"><stop offset=".55" stop-color="#efdfb6"/><stop offset="1" stop-color="#c9a970"/></radialGradient></defs><rect x="-20" y="-20" width="1120" height="1960" fill="url(#ppv)"/>`;
  for (let i = 0; i < 26; i++) o += `<circle cx="${(hs(i, 11) * 1080).toFixed(0)}" cy="${(hs(i, 12) * 1920).toFixed(0)}" r="${(20 + hs(i, 13) * 70).toFixed(0)}" fill="#b8925a" opacity=".07"/>`;
  o += `<path d="M120,330 C180,300 260,300 330,320" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/><path d="M740,300 C800,280 880,285 950,310" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/>`;
  return o; }
function wave(y, amp, col, t, ph, front) { let d = `M-40,${y}`; for (let x = -40; x <= 1120; x += 60) d += ` Q${x + 30},${(y - amp + Math.sin(t * 2 + x * .01 + ph) * amp * .6).toFixed(1)} ${x + 60},${y}`; d += ` L1120,2000 L-40,2000Z`;
  return `<path d="${d}" fill="${col}" stroke="${K}" stroke-width="8" stroke-linejoin="round"${front ? '' : ''}/>`; }
function paperShip(x, y, s, tilt, kind) { const sail = kind === 'en'
    ? `<path d="M-150,-400 C-120,-330 -120,-230 -150,-150 L150,-150 C120,-230 120,-330 150,-400Z" fill="#f4efe2" stroke="${K}" stroke-width="9"/><path d="M-22,-398 L22,-398 L20,-152 L-20,-152Z M-140,-298 L140,-298 L138,-254 L-138,-254Z" fill="#c8302e"/>`
    : `<path d="M-150,-400 C-120,-330 -120,-230 -150,-150 L150,-150 C120,-230 120,-330 150,-400Z" fill="#2a4aa8" stroke="${K}" stroke-width="9"/>${LIS(0, -268, 2.4, '#e8b830', 4)}`;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${tilt.toFixed(2)}) scale(${s.toFixed(3)})"><path d="M0,0 L0,-440" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M-170,-405 L170,-405" stroke="${K}" stroke-width="12" stroke-linecap="round"/>${sail}` +
    `<path d="M-290,-10 L290,-10 C272,60 220,118 160,128 L-180,128 C-236,112 -276,60 -290,-10Z" fill="#8a5a32" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><path d="M-270,40 L272,40 M-240,86 L240,86" stroke="${K}" stroke-width="6" opacity=".6"/>` +
    `<path d="M-290,-10 L-290,-80 L-170,-80 L-170,-10Z" fill="#7a4c28" stroke="${K}" stroke-width="10"/><path d="M180,-10 L180,-60 L280,-60 L290,-10Z" fill="#7a4c28" stroke="${K}" stroke-width="10"/>` +
    `<path d="M${kind === 'en' ? 280 : -290},-80 l${kind === 'en' ? 0 : 0},-70" stroke="${K}" stroke-width="7"/><path d="M${kind === 'en' ? 280 : -290},-150 l50,14 l-50,14Z" fill="${kind === 'en' ? '#f4efe2' : '#e8b830'}" stroke="${K}" stroke-width="5"/></g>`; }
// silueta de marinero (tinta) — pies en (x, y)
function sailor(x, y, s, o = {}) { const sh = o.shake || 0, rot = o.rot || 0, arms = o.arms || 'cross';
  const A = arms === 'cross' ? `<path d="M-20,-58 L20,-50 M20,-58 L-20,-50" stroke="${K}" stroke-width="11" stroke-linecap="round"/>`
    : arms === 'up' ? `<path d="M0,-62 L-28,-104 M0,-62 L28,-104" stroke="${K}" stroke-width="11" stroke-linecap="round"/>` : `<path d="M0,-62 L-26,-36 M0,-62 L26,-36" stroke="${K}" stroke-width="11" stroke-linecap="round"/>`;
  const legs = o.legs === 'tuck' ? `<path d="M0,-30 L-18,-12 L-6,4 M0,-30 L18,-14 L8,2" stroke="${K}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` : `<path d="M0,-30 L-14,0 M0,-30 L14,0" stroke="${K}" stroke-width="12" stroke-linecap="round"/>`;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s.toFixed(3)})">${legs}<path d="M0,-30 L0,-72" stroke="${K}" stroke-width="15" stroke-linecap="round"/>${A}<circle cx="${sh.toFixed(1)}" cy="-92" r="19" fill="${K}"/>${o.cap ? `<path d="M${(sh - 20).toFixed(1)},-100 Q${sh.toFixed(1)},-122 ${(sh + 20).toFixed(1)},-100Z" fill="${o.cap}" stroke="${K}" stroke-width="4"/>` : ''}</g>`; }
function laughLines(x, y, r, t) { let o = ''; [-1, 1].forEach(sd => { for (let i = 0; i < 3; i++) { const a = -.55 + i * .5, k = ((t * 2.6 + i * .33 + (sd > 0 ? .5 : 0)) % 1), r0 = r * (1.08 + .2 * k), r1 = r0 + r * .3, c = Math.cos(a), s2 = Math.sin(a);
  const d = `M${(x + sd * c * r0).toFixed(1)},${(y + s2 * r0).toFixed(1)} L${(x + sd * c * r1).toFixed(1)},${(y + s2 * r1).toFixed(1)}`; o += `<path d="${d}" stroke="${K}" stroke-width="18" stroke-linecap="round" opacity="${(1 - k).toFixed(2)}"/><path d="${d}" stroke="#fff6c8" stroke-width="9" stroke-linecap="round" opacity="${(1 - k).toFixed(2)}"/>`; } }); return o; }
function splash(x, y, s, k) { if (k <= 0 || k >= 1) return ''; const e = eOut(k); let o = `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(70 * s * e).toFixed(1)}" ry="${(16 * s * e).toFixed(1)}" fill="none" stroke="#f4efe2" stroke-width="${(8 * (1 - k) * s + 1).toFixed(1)}"/>`;
  for (let i = 0; i < 6; i++) { const a = -Math.PI * (.15 + .7 * i / 5), r = 90 * s * e; o += `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r * 1.3 + 160 * s * k * k).toFixed(1)}" r="${(10 * s * (1 - k * .6)).toFixed(1)}" fill="#f4efe2" stroke="${K}" stroke-width="${(4 * s).toFixed(1)}"/>`; }
  return o; }
// cortinilla de pergamino con borde rasgado (k: 0 → 1)
function tornWipe(svg, k) { if (k >= 1) return svg; if (k <= 0) return ''; const X = -60 + k * 1250; let d = `M-20,-20 L${X.toFixed(0)},-20`;
  for (let y = 0; y <= 1960; y += 80) d += ` L${(X + (hs(y, 21) - .5) * 70 - y * .12).toFixed(0)},${y}`; d += ' L-20,1960Z'; const id = 'tw' + (++_clip);
  return `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }

// =====================================================================================================
// 12 · ENTRA — el bufón avanza por la alfombra dando saltitos (la corte, a los lados, aguanta la respiración);
// «¡Majestad…!»: plano subjetivo del rey: el bufón abre los brazos y grita; golpe de zoom en «cobardes».
// =====================================================================================================
S.entra = (t, D, B) => { const E = EVS.entra(B); const tG = Math.max(1.4, (E.majestad || D * .45) - .15); setup(t + B[0].s, { light: IN });
  if (t < tG) { const k = clamp(t / tG), hop = Math.abs(Math.sin(t * Math.PI * 2.4)), z = lerp(3.5, -4.2, eIO2(k)), JF = V3(.05, hop * .3, z);
    cam(V3(.7, 1.9, z - 5.6 - k * .3), V3(0, 1.5, z + .4), 46);
    const air = hop > .25, ph = Math.sin(t * Math.PI * 2.4) > 0;
    const L = [P_('BUFON', { face: 'happy', mouth: 'grin', armL: [130 + Math.sin(t * 15) * 15, 20], armR: [130 - Math.sin(t * 15) * 15, 20], legL: air ? (ph ? [40, -70] : [-10, 20]) : [4, 0], legR: air ? (ph ? [-10, 20] : [40, -70]) : [4, 0], hornSwing: Math.sin(t * 15) * .9 }, JF)];
    [[-1.5, 6.2, 'NOBLE1', .5], [1.6, 7.0, 'NOBLE2', -.5], [-1.7, 8.6, 'NOBLE3', .5], [1.8, 9.4, 'NOBLE4', -.5]].forEach(([x, zz, n, tn]) => L.push(P_(n, { turn: tn, face: 'wide', mouth: 'line', sweat: true, armL: [30, -100], armR: [14, 10] }, V3(x, 0, zz))));
    let s = depth(L); if (!air) { const fp = W.proj(V3(JF.x, 0, JF.z)); s += puff(fp.x, fp.y, 70 * fp.ppm / 260, (t * 2.4 % 1) * 2); } return s; }
  const u = t - tG, tC = E.cobardes || D * .7, punch = snap(t, tC - .05, .18); whipBlur(t, tG);
  cam(L3(V3(.15, 2.6, -13.6), V3(.1, 2.5, -13.1), oc(clamp(u / (D - tG)))), V3(0, 1.5, -9.5), lerp(50, 42, punch), .003);
  const shout = { face: 'happy', mouth: 'open', brows: .8, armL: [118, 14], armR: [118, 14], lean: 4, look: [0, -6], hornSwing: Math.sin(t * 13) * .7 };
  const L = [P_('BUFON', shout, JF0)];
  [[-2.2, -5.0, 'NOBLE1', .5], [2.25, -5.3, 'NOBLE2', -.5]].forEach(([x, z, n, tn]) => L.push(P_(n, { turn: tn, face: 'wide', mouth: 'o', sweat: n !== 'GUARDIA' }, V3(x, 0, z))));
  let s = depth(L); const h = headScr(JF0), q = sOf(JF0); s += burstLines(h.x + 120 * q, h.y + 30 * q, 120 * q, ((t - tG) % .5) / .5, '#ffd34a') + burstLines(h.x - 120 * q, h.y + 30 * q, 120 * q, ((t - tG + .25) % .5) / .5, '#ffd34a');
  return s; };

// =====================================================================================================
// 13 · RÍE — el rey, en el trono, se parte de risa (se da palmadas en la rodilla); «¿Por qué?»: se inclina hacia delante, intrigado.
// =====================================================================================================
S.rie = (t, D, B) => { const E = EVS.rie(B); const tP = (E.por || D * .65) - .12; setup(t + B[0].s, { light: IN, fg: true }); const k = oc(clamp(t / D)), q2 = snap(t, tP, .35);
  cam(L3(V3(.7, 1.9, -9.3), V3(.55, 1.95, -10.0), k), V3(0, 1.88, -13.85), 40);
  const laugh = { face: 'closed', mouth: 'laugh', headTilt: Math.sin(t * 16) * 9, armL: [34 + Math.sin(t * 18) * 12, -70], armR: [34 - Math.sin(t * 18) * 12, -70], lean: Math.sin(t * 9) * 3 };
  const ask = { face: 'wide', mouth: 'o', brows: .5, look: [0, 12], lean: 4, armL: [30, -60], armR: [40, -120], headTilt: -6 };
  const L = [kingSit(t < tP ? laugh : ask)];
  let s = depth(L); const h = W.proj(KHEAD()), q = sOf(KSEAT); if (t < tP) s += laughLines(h.x, h.y, 150 * q, t); else s += glint(h.x + 170 * q, h.y - 150 * q, 34, 1 - q2 * .3);
  return s; };

// =====================================================================================================
// 14 · REMATE — el bufón cuenta el chiste (pícaro, dedo en alto)… y en «se hundían» el mundo se vuelve recorte de papel:
// los ingleses, de brazos cruzados en su barco, NO se tiran al agua; «no como nuestros valientes marineros»: los franceses saltan.
// =====================================================================================================
S.remate = (t, D, B) => { const E = EVS.remate(B); const tH = Math.max(.9, (E.hundian || D * .25) - .12), tN = (E.no || D * .7) - .1; setup(t + B[0].s, { light: IN });
  const k = oc(clamp(t / tH)); cam(L3(V3(.35, 2.35, -13.5), V3(.25, 2.3, -13.0), k), V3(0, 1.85, -9.5), 40, .003);
  let s = who('BUFON', { face: 'smug', mouth: talkM(t, 0, D, 'smirk'), brows: -.3, look: [-4, -4], armR: [150, -40], armL: [20, 20], headTilt: Math.sin(t * 5) * 4, hornSwing: Math.sin(t * 6) * .5 }, JF0, ADULT);
  if (t < tH) return s;
  const u = t - tH, wipe = clamp(u / .3);
  let p = paperBG(t) + wave(1180, 30, '#24507c', t, 0);
  if (t < tN) { const kk = clamp(u / (tN - tH)), x = 540, y = 1120 + kk * 70, tilt = kk * 7; p += paperShip(x, y, 1.6, tilt, 'en');
    [[-170, 'a'], [-60, 'b'], [60, 'c'], [160, 'd']].forEach(([dx, c], i) => { const a = tilt * Math.PI / 180, px = x + dx * 1.6 * Math.cos(a) + 16 * Math.sin(a), py = y - 10 * 1.6 + dx * 1.6 * Math.sin(a);
      p += sailor(px, py, 1.9, { arms: 'cross', shake: Math.sin(t * 14 + i) * 7 * (kk > .35 ? 1 : 0), rot: tilt, cap: '#c8302e' }); });
    p += wave(1240, 34, '#2f5f8f', t, 1.3) + wave(1330, 40, '#3a72a6', t, 2.1); }
  else { const v = t - tN, x = 560, y = 1150 + v * 45, tilt = -12 - v * 3; p += paperShip(x, y, 1.6, tilt, 'fr');
    for (let i = 0; i < 5; i++) { const t0 = .1 + i * .28, kk = (v - t0) / .7, a = tilt * Math.PI / 180, dx = -210 + i * 75, sx = x + dx * 1.6 * Math.cos(a), sy = y - 16 + dx * 1.6 * Math.sin(a), ex = sx - 330 + i * 40, ey = 1260;
      if (kk < 0) p += sailor(sx, sy, 1.9, { arms: 'down', rot: tilt, cap: '#2a4aa8' });
      else if (kk < 1) p += sailor(lerp(sx, ex, kk), lerp(sy, ey, kk) - Math.sin(Math.PI * kk) * 340, 1.9, { arms: 'up', legs: 'tuck', rot: -kk * 160, cap: '#2a4aa8' });
      p += splash(ex, ey - 10, 1.6, (kk - 1) / .6); }
    p += wave(1240, 34, '#2f5f8f', t, 1.3) + wave(1330, 40, '#3a72a6', t, 2.1); }
  return s + tornWipe(p, wipe); };

// =====================================================================================================
// 15 · SILENCIO — «el rey deja de reír»: primerísimo plano, la risa se le congela; «lo ha entendido»: su mano aprieta el pomo de oro del trono;
// «solo se oyen tus cascabeles»: primerísimo plano de los cascabeles del bufón, que tiemblan.
// =====================================================================================================
S.silencio = (t, D, B) => { const E = EVS.silencio(B); const tL = (E.lo || D * .33) - .1, tS = (E.solo || D * .62) - .1; setup(t + B[0].s, { light: IN, fg: t < tS });
  if (t < tL) { const k = oc(clamp(t / tL)), stop = snap(t, .25, .25), hd = KHEAD(); cam(L3(V3(.05, 2.2, -9.1), V3(.04, 2.18, -9.6), k), V3(0, 2.12, hd.z), 32, .003);
    let s = depth([kingSit(stop < .5 ? { face: 'closed', mouth: 'laugh', headTilt: Math.sin(t * 16) * 5 } : { face: 'smug', mouth: 'line', brows: -.2, look: [0, 4] })]);
    return s; }
  if (t < tS) { const u = t - tL, k = oc(clamp(u / (tS - tL))); whipBlur(t, tL); const hd = KHEAD();
    cam(L3(V3(-.25, 2.0, -10.6), V3(-.2, 2.02, -11.1), k), V3(0, 2.2, hd.z), 24, .003);
    let s = depth([kingSit({ face: 'angry', mouth: 'line', brows: -.9, look: [lerp(0, -8, k), 6], headTilt: -3 })]);
    const h = W.proj(V3(0, hd.y + .1, hd.z)); s += tension(h.x, h.y, 430, u) + `<rect width="1080" height="1920" fill="#000" opacity="${(.18 * k).toFixed(3)}"/>`;
    return s; }
  const u = t - tS, k = oc(clamp(u / (D - tS))); whipBlur(t, tS); cam(L3(V3(.25, 2.25, -5.1), V3(.2, 2.2, -5.6), k), V3(.05, 1.95, -9.5), 34, .003);
  let s = who('BUFON', { face: 'wide', mouth: 'line', brows: 1, sweat: true, look: [-6, -8], hornSwing: Math.sin(u * 42) * .1 }, JF0, ADULT);
  const h = headScr(JF0), q = sOf(JF0); s += ding(h.x - 198 * q, h.y - 56 * q, q * .9, (u % .6) / .6) + ding(h.x + 198 * q, h.y - 56 * q, q * .9, ((u + .3) % .6) / .6);
  return s; };

// =====================================================================================================
// 16 · GUARDIAS — primer plano del guardia con la alabarda: los ojos se le van hacia el rey, esperando la orden; destello en la hoja.
// =====================================================================================================
S.guardias = (t, D, B) => { setup(t + B[0].s, { light: IN }); const k = oc(clamp(t / D)), GF = V3(-3.9, 0, -8.6), slide = snap(t, D * .35, .35);
  cam(L3(V3(-1.2, 2.0, -5.2), V3(-1.5, 1.95, -5.7), k), V3(-3.85, 1.75, -8.6), 36, .003);
  let s = depth([P_('GUARDIA', { turn: .35, face: 'angry', mouth: 'line', brows: -.5, look: [lerp(0, 18, slide), lerp(0, -2, slide)], armR: [40, -30] }, GF)]);
  const g = W.proj(V3(GF.x - .5, 2.55, GF.z)); s += glint(g.x, g.y, 46, Math.max(0, Math.sin(clamp((t - D * .55) / .5) * Math.PI)));
  return s; };

// =====================================================================================================
// 17 · GIRO — el rey no mira al bufón: los ojos se le van… a los nobles (barrido hasta ellos, sudando);
// «¿Ninguno de vosotros…?»: se levanta del trono y les señala, furioso; los nobles se encogen.
// =====================================================================================================
S.giro = (t, D, B) => { const E = EVS.giro(B); const tM = (E.sus || D * .3) - .35, tQ = (E.ninguno || D * .45) - .12; setup(t + B[0].s, { light: IN, fg: t < tM || (t >= tQ && snap(t - tQ, .02, .35) < .5) });
  const NOB = [[1.95, -9.3, 'NOBLE1', -.5], [2.75, -10.9, 'NOBLE2', -.55], [3.25, -8.3, 'NOBLE4', -.6]];
  if (t < tM) { const k = oc(clamp(t / tM)), hd = KHEAD(), sl = snap(t, (E.bufon || tM * .5) + .05, .3); cam(L3(V3(.4, 2.15, -9.3), V3(.3, 2.12, -9.8), k), V3(0, 2.05, hd.z), 34, .003);
    return depth([kingSit({ face: 'smug', mouth: 'line', brows: -.4, look: [lerp(-4, 18, sl), lerp(10, 2, sl)], armL: [24, 30], armR: [24, 30] })]); }
  if (t < tQ) { const u = t - tM, k = oc(clamp(u / (tQ - tM))); whipBlur(t, tM); cam(L3(V3(-.6, 2.0, -4.2), V3(-.4, 1.95, -4.7), k), V3(2.6, 1.6, -8.9), 42);
    const L = NOB.map(([x, z, n, tn], i) => P_(n, { turn: tn - .2, face: 'wide', mouth: i % 2 ? 'o' : 'line', sweat: true, brows: .9, look: [-14, -2], headTilt: Math.sin(u * 30 + i) * 2 }, V3(x, 0, z)));
    return depth(L); }
  const u = t - tQ, k = oc(clamp(u / (D - tQ))), up = snap(u, .02, .35); whipBlur(t, tQ);
  cam(L3(V3(.4, 2.7, -4.4), V3(.35, 2.6, -4.9), k), V3(.6, 1.95, -12.4), 46); SHAKE = u < .35 ? .03 * (1 - u / .35) : 0;
  const KF = V3(-.2, .75, lerp(-13.6, -12.8, up)), stand = { face: 'angry', mouth: talkM(u, 0, D - tQ - .2, 'open'), brows: -.9, turn: .45, armR: [96, 0], armL: [20, 40], lean: 6, prop: 'scepter' };
  const L = [up < .5 ? kingSit({ face: 'angry', mouth: 'open', brows: -.9, lean: 12, turn: .3 }) : P_('REY', stand, KF)];
  [[1.65, -9.5, 'NOBLE1', -.5]].forEach(([x, z, n, tn], i) => L.push(P_(n, { turn: tn, face: 'wide', mouth: 'o', sweat: true, lean: -6, armL: [110, -100], armR: [100, -90], brows: 1, headTilt: Math.sin(u * 28 + i) * 3 }, V3(x, 0, z))));
  let s = depth(L); const h = W.proj(V3(KF.x, KF.y + 1.7, KF.z)); s += burstLines(h.x + 90, h.y + 20, 130, ((u) % .45) / .45, '#ff4f5a');
  return s; };

// =====================================================================================================
// 18 · SALVAS — el bufón suelta todo el aire: alivio, se seca el sudor de la frente; los cascabeles, quietos por fin.
// =====================================================================================================
S.salvas = (t, D, B) => { setup(t + B[0].s, { light: IN }); const k = oc(clamp(t / D)); cam(L3(V3(.15, 2.2, -5.4), V3(.1, 2.15, -5.9), k), V3(0, 1.95, -9.5), 34, .003);
  let s = who('BUFON', { face: 'closed', mouth: 'smile', armR: [158, -128], armL: [14, 10], headTilt: -6, lean: -4, hornSwing: Math.sin(t * 3) * .15 * (1 - k) }, JF0, ADULT);
  return s; };

// =====================================================================================================
// 19 · BUCLE — «y desde entonces, cada vez que la guerra va mal…»: en el pasillo, los nobles con cartas selladas se miran… y miran al bufón.
// «adivina a quién empujan hacia el trono…»: el portón se abre de golpe y entra el bufón con la carta; «con su gorro de cascabeles»: el primer plano
// del principio (bucle con el gancho).
// =====================================================================================================
S.bucle = (t, D, B) => { const E = EVS.bucle(B); const tA = (E.adivina || D * .45) - .1, tC = (E.con || D * .8) - .1;
  if (t < tA) { setup(t + B[0].s, { light: IN, doors: 0 }); const k = oc(clamp(t / tA)), look = snap(t, (E.mal || tA * .8) - .15, .3);
    cam(L3(V3(.1, 2.1, 1.6), V3(-.05, 2.05, 2.4), k), V3(-.05, 1.6, 8.8), 46);
    const N = [[.15, 9.1, 'NOBLE1', .15], [1.05, 9.5, 'NOBLE3', 0]];
    const L = N.map(([x, z, n, tn], i) => P_(n, { turn: tn, face: look > .5 ? 'smug' : 'wide', mouth: look > .5 ? 'smirk' : 'line', look: [lerp((i - 1) * -10, -20, look), lerp(0, -2, look)], armR: [50, -70], holdR: LETTER(-10 + i * 8), holdTop: 1, sweat: look < .5 }, V3(x, 0, z)));
    L.push(P_('BUFON', { turn: .45, face: look > .5 ? 'wide' : 'happy', mouth: look > .5 ? 'o' : 'smile', hornSwing: Math.sin(t * 4) * .3, sweat: look > .5, armL: look > .5 ? [30, -100] : [14, 10] }, V3(-1.15, 0, 8.2)));
    return depth(L); }
  if (t < tC) { const u = t - tA; setup(t + B[0].s, { light: IN }); whipBlur(t, tA);
    cam(L3(V3(.15, 2.6, -13.6), V3(.1, 2.5, -13.0), oc(clamp(u / (tC - tA)))), V3(0, 1.5, -6.5), 44);
    const push = eIO2(clamp(u / ((tC - tA) * .85))), JF = V3(0, 0, lerp(-3.6, -6.6, push)), NZ = lerp(-1.4, -4.2, push);
    const L = [P_('BUFON', { face: 'wide', mouth: 'o', lean: lerp(-12, 4, push), armL: [120, 30], armR: [96, -20], holdR: LETTER(-14), holdTop: 1, legL: [24, 10], legR: [-8, 6], sweat: true, hornSwing: Math.sin(u * 14) * .7 }, JF)];
    [[-1.85, 0, 'NOBLE1', .3], [1.9, -.2, 'NOBLE2', -.3]].forEach(([x, dz, n, tn]) => L.push(P_(n, { turn: tn, face: 'smug', mouth: 'smirk', armL: [96, -10], armR: [96, -10], lean: -6 }, V3(x, 0, NZ + dz))));
    let s = depth(L); const fp = W.proj(JF); s += puff(fp.x, fp.y, 90 * fp.ppm / 260, clamp((u - .25) / .7)); return s; }
  const u = t - tC; setup(t + B[0].s, { light: IN }); whipBlur(t, tC); const k = oc(clamp(u / (D - tC)));
  cam(L3(V3(.05, 2.05, -5.0), CAM0[0], k), L3(V3(0, 2.0, -8.7), CAM0[1], k), 44, .003);
  let s = who('BUFON', { face: 'wide', mouth: 'line', look: [0, -10], brows: .8, sweat: true, hornSwing: Math.sin(u * 9) * .5 * Math.exp(-u * 1.5) }, JH, ADULT);
  const hc = headScr(JH), q = sOf(JH), kk = (u - .1) / .45; s += ding(hc.x - 198 * q, hc.y - 56 * q, q * 1.2, kk) + ding(hc.x + 198 * q, hc.y - 56 * q, q * 1.2, kk) + ding(hc.x + 84 * q, hc.y - 238 * q, q * 1.2, kk - .1);
  return s; };

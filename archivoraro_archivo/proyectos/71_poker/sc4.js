
// =====================================================================================================
// 14 · SUYO — la cámara se mete en la foto antigua de la pared… y pasamos a 1995 (sepia): Manolo joven corta la cinta detrás de la barra
// =====================================================================================================
const PH = W.PHOTO.position;
S.suyo = (t, D, B) => { const E = EVS.suyo(B); const tF = Math.max(1.0, (E.desde || D * .55) - .3);
  if (t < tF) { setup(t + B[0].s, { photo: clamp(t / tF) }); const k = eIO(clamp(t / tF)); cam(L3(V3(PH.x - .05, 2.1, -2.5), V3(PH.x, PH.y, PH.z + .5), k), V3(PH.x, PH.y, PH.z), lerp(46, 40, k), .002);
    const p = W.proj(PH); return t > (E.suyo || tF * .6) ? glint(p.x + 320, p.y - 260, 40, Math.abs(Math.sin(t * 5))) : ''; }
  const u = t - tF; setup(t + B[0].s, { sepia: 1, photo: 1 }); const k = oc(clamp(u / (D - tF))); cam(L3(V3(-1.6, 1.68, -1.1), V3(-1.6, 1.66, -1.3), k), V3(-1.6, 1.55, -4.2), 50);
  let s = ''; if (u < .18) s += `<rect width="1080" height="1920" fill="#fff6e0" opacity="${(1 - u / .18).toFixed(2)}"/>`;
  const Fy = V3(-1.6, 0, -4.15), cut = u > .55; const young = { hair2: 'side', hairCol: '#1b1720', mustache: '#1b1720', browCol: null, wrinkles: false, glasses: false, face: 'happy', mouth: 'laugh', armR: cut ? [110, 30] : [80, 60], holdR: `<g transform="rotate(-40)"><circle cx="-8" cy="-60" r="10" fill="none" stroke="${K}" stroke-width="6"/><circle cx="8" cy="-60" r="10" fill="none" stroke="${K}" stroke-width="6"/><path d="M-4,-52 L6,-10 M4,-52 L-6,-10" stroke="#9aa3ad" stroke-width="7"/></g>`, armL: [60, 40] };
  s = behindBar(who('MANOLO', young, Fy)) + s;
  const a = W.proj(V3(-3.4, 1.22, BZ + .05)), b = W.proj(V3(.2, 1.22, BZ + .05)), m = W.proj(V3(-1.6, 1.22, BZ + .05));
  if (!cut) s += `<path d="M${a.x},${a.y} Q${m.x},${m.y + 30} ${b.x},${b.y}" stroke="${K}" stroke-width="20" fill="none"/><path d="M${a.x},${a.y} Q${m.x},${m.y + 30} ${b.x},${b.y}" stroke="#c8302e" stroke-width="12" fill="none"/>`;
  else { const f = oc(clamp((u - .55) / .4)); s += `<path d="M${a.x},${a.y} Q${(a.x + m.x) / 2},${m.y + 40 + f * 80} ${m.x - 10},${m.y + 20 + f * 160}" stroke="${K}" stroke-width="20" fill="none"/><path d="M${a.x},${a.y} Q${(a.x + m.x) / 2},${m.y + 40 + f * 80} ${m.x - 10},${m.y + 20 + f * 160}" stroke="#c8302e" stroke-width="12" fill="none"/>` +
    `<path d="M${b.x},${b.y} Q${(b.x + m.x) / 2},${m.y + 40 + f * 80} ${m.x + 10},${m.y + 20 + f * 160}" stroke="${K}" stroke-width="20" fill="none"/><path d="M${b.x},${b.y} Q${(b.x + m.x) / 2},${m.y + 40 + f * 80} ${m.x + 10},${m.y + 20 + f * 160}" stroke="#c8302e" stroke-width="12" fill="none"/>` + impact(m.x, m.y, 200, (u - .55) / .4);
    for (let i = 0; i < 24; i++) { const kk = clamp((u - .55 - (i % 6) * .03) / 1.2), x = m.x + Math.sin(i * 2.3) * 420 * eOut(kk), y = m.y - 300 + kk * 900 + Math.sin(i) * 60; if (kk > 0 && kk < 1) s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="16" height="10" fill="${['#c8302e', '#e8b830', '#2f6fbf', '#3a9a5a'][i % 4]}" transform="rotate(${(kk * 720 + i * 30).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; } }
  return s; };

// =====================================================================================================
// 15 · CUÑADO — la licencia de la pared: «Titular: Fermín, el Cuñao» · el cuñado, en chándal, en la barra con su caña · los amigos, sin enterarse
// =====================================================================================================
const CANA = `<g transform="translate(0,-30)"><path d="M-20,-50 L20,-50 L16,24 L-16,24Z" fill="#f2c23a" stroke="${K}" stroke-width="6"/><path d="M-22,-50 Q-10,-70 0,-58 Q12,-72 22,-50Z" fill="#fff" stroke="${K}" stroke-width="5"/></g>`;
S.cunado = (t, D, B) => { const E = EVS.cunado(B); setup(t + B[0].s); const t1 = Math.max(1.0, (E.asi || D * .5) - .55), t2 = Math.max(t1 + .7, (E.asi || D * .55) - .05); const LP = W.LIC.position;
  if (t < t1) { lic(clamp((t - .35) / .5)); const k = oc(clamp(t / t1)); cam(L3(V3(LP.x - .1, 2.2, -3.4), V3(LP.x - .08, 2.22, -3.6), k), V3(LP.x, LP.y, LP.z), 40, .002); const p = W.proj(V3(LP.x, LP.y - .04, LP.z)); return t > .8 ? glint(p.x + 190, p.y - 60, 30, Math.abs(Math.sin(t * 5))) : ''; }
  if (t < t2) { whipBlur(t, t1); const u = t - t1, Fc = V3(-1.9, 0, -2.4); cam(L3(V3(-1.55, 1.68, .55), V3(-1.57, 1.66, .3), oc(clamp(u / (t2 - t1)))), V3(-1.9, 1.4, -2.4), 48);
    return who('CUNADO', { face: 'happy', mouth: 'laugh', armR: [150, 30], armL: [60, 60], holdL: CANA, look: [0, 0], headTilt: 6 }, Fc); }
  whipBlur(t, t2); const u = t - t2; W.setChips(defaultChips(14, 4)); cam(L3(V3(TC.x + 1.45, 2.3, TC.z + 2.95), V3(TC.x + 1.32, 2.24, TC.z + 2.62), oc(clamp(u / (D - t2)))), V3(TC.x + .05, 1.1, TC.z - .5), 58);
  const L = [seated('manolo', { face: 'happy', mouth: 'smile' }), seated('pepe', { face: 'happy', mouth: 'laugh', armL: [40, 110], armR: [60, 70] }), seated('luis', { face: 'happy', mouth: 'laugh' }), seated('toni', { view: 'back' }, { noClip: true })];
  return depth(L); };

// =====================================================================================================
// 16 · CAJA — los billetes salen de las carteras de la cena y vuelan… directos a la caja registradora (el cajón se abre). El reloj: medianoche.
// =====================================================================================================
const WALLET = (open = 0) => `<g transform="rotate(-10)"><rect x="-40" y="-26" width="80" height="52" rx="8" fill="#5a3a22" stroke="${K}" stroke-width="6"/>${open ? `<path d="M-40,-26 L-30,-60 L30,-60 L40,-26" fill="#6a4a2a" stroke="${K}" stroke-width="6"/>` : ''}</g>`;
S.caja = (t, D, B) => { const E = EVS.caja(B); setup(t + B[0].s, { dinner: true, clock: [23, 50] }); const t1 = Math.max(1.0, (E.vuelve || D * .45) - .2), t2 = Math.max(t1 + .8, (E.antes || D * .75) - .1);
  if (t < t1) { const k = oc(clamp(t / t1)); cam(L3(V3(DT.x + .4, 1.9, DT.z + 2.2), V3(DT.x + .45, 1.88, DT.z + 2.0), k), V3(DT.x + .2, 1.1, DT.z - .4), 54);
    let s = diners(t, { all: { face: 'happy', mouth: 'laugh', armR: [100, 30], holdR: WALLET(1), armL: [60, 60] } }); const p0 = W.proj(V3(DT.x, 1.5, DT.z - .7));
    for (let i = 0; i < 10; i++) { const kk = clamp((t - .1 - i * .07) / .7); s += flyBill({ x: p0.x - 200 + (i % 3) * 200, y: p0.y }, { x: 1300, y: p0.y - 500 }, kk, 1.3, 400 * (i % 2 ? 1 : -1), ['#9ab88a', '#e8b07a', '#7ab0e8'][i % 3]); } return s; }
  if (t < t2) { whipBlur(t, t1); const u = t - t1, open = oc(clamp(u / .3)); till(open, 1 + u * .4, ((u * 931) % 1000).toFixed(2).replace('.', ',')); const tp = W.TILL.position;
    cam(L3(V3(tp.x + .45, 1.62, tp.z + 1.25), V3(tp.x + .42, 1.6, tp.z + 1.1), oc(clamp(u / (t2 - t1)))), V3(tp.x, 1.2, tp.z), 44, .004);
    const p = W.proj(V3(tp.x, 1.2, tp.z + .25)); let s = ''; for (let i = 0; i < 12; i++) { const kk = clamp((u - i * .07) / .55); s += flyBill({ x: -200, y: p.y - 500 + (i % 4) * 60 }, { x: p.x + (i % 3 - 1) * 40, y: p.y }, kk, 1.4, 300, ['#9ab88a', '#e8b07a', '#7ab0e8'][i % 3]); }
    return s + (u > .3 ? impact(p.x, p.y - 30, 160, (u - .3) / .4) : ''); }
  whipBlur(t, t2); const u = t - t2, mm = Math.min(60, 57 + Math.floor(u * 4)); clock(mm >= 60 ? 0 : 23, mm % 60); cam(V3(2.4, 2.45, -3.6), V3(2.4, 2.55, -5), 34, .002);
  const p = W.proj(V3(2.4, 2.55, W.Z0 + .06)); return mm >= 60 ? ring(p.x, p.y, 260, (u - .75) / .4, '#fff') + impact(p.x, p.y, 240, (u - .75) / .4) : ''; };

// =====================================================================================================
// 17 · HAMBRE — los tres comen como si no hubiera mañana; la cuenta se desenrolla hasta el suelo; de la cartera de Pepe sale una polilla
// =====================================================================================================
function moth(x, y, s, t) { const f = Math.abs(Math.sin(t * 20)); return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(2)})"><ellipse rx="${(26 * (.4 + f * .6)).toFixed(1)}" ry="18" cx="-16" fill="#c8b8a0" stroke="${K}" stroke-width="4"/><ellipse rx="${(26 * (.4 + f * .6)).toFixed(1)}" ry="18" cx="16" fill="#c8b8a0" stroke="${K}" stroke-width="4"/><ellipse rx="6" ry="16" fill="${K}"/></g>`; }
S.hambre = (t, D, B) => { const E = EVS.hambre(B); setup(t + B[0].s, { dinner: true }); const tM = (E.gastan || D * .55) - .1; const k = oc(clamp(t / D));
  cam(L3(V3(DT.x + .3, 1.7, DT.z + 2.3), V3(DT.x + .28, 1.68, DT.z + 2.05), k), V3(DT.x, 1.15, DT.z - .4), 52);
  const chew = Math.floor(t * 8) % 2; let s = diners(t, { all: { face: 'happy', mouth: chew ? 'o' : 'laugh', armR: [118 + Math.sin(t * 14) * 10, 40], armL: [100, 30] }, pepe: { face: tM < t ? 'wide' : 'happy', mouth: tM < t ? 'o' : (chew ? 'laugh' : 'o'), armR: tM < t ? [96, 20] : [118, 40], holdR: tM < t ? WALLET(1) : '', armL: [100, 30] } });
  const un = oc(clamp((t - .3) / (D * .75))), hp = W.proj(V3(DT.x + .25, .8, DT.z + .58)), fp = W.proj(V3(DT.x + .3, .01, DT.z + .58 + .9 * un)), mp = W.proj(V3(DT.x + .27, .02, DT.z + .6));
  const path = `M${hp.x.toFixed(1)},${hp.y.toFixed(1)} L${mp.x.toFixed(1)},${lerp(hp.y, mp.y, Math.min(1, un * 2)).toFixed(1)}` + (un > .5 ? ` L${lerp(mp.x, fp.x, (un - .5) * 2).toFixed(1)},${lerp(mp.y, fp.y, (un - .5) * 2).toFixed(1)}` : '');
  s += `<path d="${path}" stroke="${K}" stroke-width="46" fill="none" stroke-linejoin="round"/><path d="${path}" stroke="#fbf8f0" stroke-width="36" fill="none" stroke-linejoin="round"/><path d="${path}" stroke="#8a8478" stroke-width="20" fill="none" stroke-dasharray="4 14" opacity=".7"/>`;
  if (t > tM) { const h = headScr(DSEAT.pepe, SEATH), u = t - tM; s += moth(h.x + 140 + u * 120, h.y + 120 - u * 260 + Math.sin(u * 9) * 20, 1.2, t); } return s; };

// =====================================================================================================
// 18 · TREINTA — la pizarra de partidas: Pepe 512, Luis 497, Toni 541… Manolo: 0 (se rodea en amarillo)
// =====================================================================================================
S.treinta = (t, D, B) => { setup(t + B[0].s); score(0, clamp((t - .5) / .6)); const k = oc(clamp(t / D)); const z = TC.z - .3;
  cam(L3(V3(W.X1 - 2.5, 2.0, z + .35), V3(W.X1 - 2.25, 2.0, z + .3), k), V3(W.X1, 2.0, z), 42, .002); const p = W.proj(V3(W.X1 - .02, 1.66, z - .2)); return t > 1.1 ? glint(p.x + 120, p.y - 30, 30, Math.abs(Math.sin(t * 4))) : ''; };

// =====================================================================================================
// 19 · RICO — al cerrar: Manolo detrás de la barra, con la caja llena, se abanica con los billetes. Lluvia de billetes en «rico».
// =====================================================================================================
const FANB = `<g transform="rotate(-20)">${[0, 1, 2, 3, 4].map(i => `<g transform="rotate(${(i - 2) * 13}) translate(0,-50) rotate(90) scale(.8)"><rect x="-60" y="-30" width="120" height="60" rx="4" fill="${['#9ab88a', '#e8b07a', '#7ab0e8', '#9ab88a', '#c87a9a'][i]}" stroke="${K}" stroke-width="6"/><circle cx="22" r="12" fill="rgba(255,255,255,.4)"/></g>`).join('')}</g>`;
S.rico = (t, D, B) => { const E = EVS.rico(B); setup(t + B[0].s, { clock: [0, 40] }); till(1, 2.2, '9.999,99'); const tR = (E.rico || D * .8) - .1; const k = oc(clamp(t / D)); const Fm = V3(.15, 0, -4.15);
  cam(L3(V3(.1, 1.72, -1.2), V3(.1, 1.7, -1.45), k), V3(.25, 1.48, -4.15), 46);
  const fan = Math.sin(t * 8) * 10; let s = behindBar(who('MANOLO', { face: 'smug', mouth: 'smirk', armR: [130 + fan, 30], holdR: FANB, armL: [60, 50], look: [0, 0], headTilt: 4 }, Fm));
  const h = headScr(Fm); s += glint(h.x - 170, h.y - 120, 34, Math.abs(Math.sin(t * 4))) + glint(h.x + 200, h.y - 40, 24, Math.abs(Math.cos(t * 5)));
  if (t > tR) { const u = t - tR; for (let i = 0; i < 16; i++) { const kk = clamp((u - (i % 8) * .05) / 1.2); if (kk > 0 && kk < 1) s += bill2d(80 + (i * 137) % 920, -100 + kk * 2100, 1.1, kk * 500 + i * 40, ['#9ab88a', '#e8b07a', '#7ab0e8'][i % 3]); } s += impact(h.x, h.y + 80, 280, u / .45); }
  return s; };

// =====================================================================================================
// 20 · BUCLE — otra vez: las cartas en la mano (escalera de color)… las tira boca abajo, y la grúa sube hasta el plano del principio
// =====================================================================================================
S.bucle = (t, D, B) => { const E = EVS.bucle(B); const tT = Math.max(1.2, (E.tira || D * .55) - .2); setup(t + B[0].s, { chips: defaultChips(40, 2) });
  if (t < tT) { const k = oc(clamp(t / tT)); cam(L3(V3(TC.x + .05, 1.42, TC.z - 1.18), V3(TC.x + .05, 1.36, TC.z - 1.0), k), V3(TC.x, 1.0, TC.z + 1.0), 56, .006);
    const L = [seated('toni', { face: 'smug', mouth: 'line', look: [0, 6] }, { blur: 3 }), seated('pepe', { face: 'smug', mouth: 'line', turn: -.6 }, { blur: 3 }), seated('luis', { face: 'smug', mouth: 'line', turn: .6 }, { blur: 3 })];
    let s = depth(L); const cx = 540, cy = 1160; s += `<g transform="translate(${cx},${cy + 120}) scale(3.3)">${FAN(ROYAL, 1, true, .6 + .3 * Math.sin(t * 9))}</g>` + hand2d(cx - 60, cy + 330, 3.0, -14) + hand2d(cx + 80, cy + 320, 3.0, 20);
    return s + glint(cx - 300, cy - 260, 40, Math.abs(Math.sin(t * 5))); }
  whipBlur(t, tT); const u = t - tT, k = eIO(clamp(u / (D - tT))); const cp = sp(k, [[0, V3(TC.x + .1, 1.9, TC.z + 2.85)], [1, V3(TC.x - .9, 2.6, TC.z + 2.9)]]); cam(cp, V3(TC.x, .98, TC.z - .45), lerp(58, 64, k));
  const L = [seated('manolo', { face: 'smug', mouth: 'smirk', armR: [118, 12], armL: [70, 40], look: [0, 10] }), seated('pepe', { face: 'happy', mouth: 'laugh', look: [10, 6] }), seated('luis', { face: 'happy', mouth: 'laugh', look: [-10, 6] })];
  let s = depth(L); const from = V3(TC.x + .02, TH + .32, TC.z - .62); ROYAL.forEach((c, i) => { const kk = clamp(u * 1.6 - i * .06), e = eOut(kk), to = V3(TC.x - .15 + i * .07, TH + .03, TC.z - .25 + (i % 2) * .05), p = from.clone().lerp(to, e); p.y += Math.sin(Math.PI * Math.min(1, kk)) * .1; s += cardOnTable(p, (1 - e) * 2.4 + i * .25 - .5, c[0], c[1], false); });
  return s; };

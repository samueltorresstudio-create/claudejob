
// =====================================================================================================
// 1 · GANCHO — A: «atraco» a un plátano entre láseres (el guardia suda) · B: el comprador se lo come entre flashes
// =====================================================================================================
const SUNF = () => V3(SX, .93, -9.8), SUNCLIP = () => V3(SX, 1.74, -7.62);
function biteShot(t, t0, t1, tBite, Dend, opt = {}) {   // primer plano del mordisco en la rueda de prensa
  setup(t, 'stage', 'rueda'); if (W.plate) W.plate.visible = false;
  const k = seg(t, t0, Dend); camK(k, V3(SX - .75, 2.48, -6.3), V3(SX, 2.55, -9.8), 34, V3(SX - .32, 2.64, -7.3), V3(SX, 2.64, -9.8), 29);
  const F = SUNF(), bit = t > tBite - .04, chew = Math.sin(t * 15) > 0;
  const P = { face: bit ? 'closed' : 'happy', mouth: bit ? (chew ? 'line' : 'smile') : 'big', blush: bit ? 1 : 0, armR: [20, 30], armL: [20, 30], turn: .05, brows: bit ? .35 : .1, headTilt: bit ? Math.sin(t * 7) * 4 : 0 };
  const L = [man('SUN', F, P, { clip: SUNCLIP() })], m = mouthAt(F), kk = eOut(clamp((t - t0) / Math.max(.2, tBite - t0))), off = (1 - kk) * m.R * 1.3;
  return depth(L) + biteBanana(m.x - m.R * .27 + off * .5, m.y + m.R * .72 + off, m.R * .00575, -34, bit) + flashes(t, 7, 4.5) + (bit ? rays(m.x, m.y + m.R * .5, m.R * 1.6, (t - tBite) / .4, '#ffffff', 10) : ''); }
S.gancho = (t, D, B) => {
  const tSe = wt(B, 'gancho', 0, 'seis'), tY = wt(B, 'gancho', 0, 'y'), tCo = wt(B, 'gancho', 0, 'comes'), tB = tY - .22;
  whip(t, [tB]);
  if (t < tB) { setup(t, 'gallery', 'laser'); W.lasers(true); W.poolOn(.28);
    const k = seg(t, 0, tB); camK(k, V3(-1.4, 1.7, 7.2), V3(0, 2.7, -16), 50, V3(-.12, 2.95, -8.4), V3(0, 3.04, -17.5), 33);
    const gp = { turn: .4, face: t < tSe ? 'wide' : 'stars', mouth: t < tSe ? 'o' : 'big', sweat: true, armR: [100 + Math.sin(t * 5) * 10, 50], holdR: TORCH, brows: -.2 };
    const q = scrX(BAN); return depth([man('GUARD', V3(-2.6, 0, 2.6), gp)]) + (t > tSe ? sparkles(q.x, q.y, 220, t, 9, 1.5) + rays(q.x, q.y, 260, (t - tSe) / .55, '#ffe58a', 14) : ''); }
  return biteShot(t, tB, tB, tCo, D); };

// =====================================================================================================
// 2 · MIAMI 2019 — grúa desde el cartel de la feria hasta la sala llena · Cattelan pega el plátano con cinta (la cinta crece)
// =====================================================================================================
S.miami = (t, D, B) => { setup(t, 'gallery', 'galeria');
  const t1 = B[1] ? B[1].s : D * .4, tCi = wt(B, 'miami', 1, 'cinta'), tAm = wt(B, 'miami', 1, 'americana'), tPl = wt(B, 'miami', 1, 'platano');
  whip(t, [t1]);
  if (t < t1) { const k = seg(t, 0, t1); camK(k, V3(1.2, 7.6, 10.5), V3(0, 6.9, -4), 48, V3(3.0, 2.15, 4.2), V3(-1.2, 2.5, -12), 48);
    const w1 = 1.2 * t, L = [man('VIS1', V3(-5 + w1, 0, -2.6), Object.assign(walk2(w1 / .45 * Math.PI), { turn: .55, face: 'happy', mouth: 'smile', holdL: PHONE2D }))];
    L.push(man('VIS2', V3(-7.4, 0, 3.2), { turn: -.7, face: 'open', mouth: talk(t, .2, 1.4, 'smile'), armR: [70, 60], brows: .2 }), man('BID2', V3(-6.2, 0, 3.8), { turn: -.5, face: 'happy', mouth: 'laugh', armL: [40, 70] }));
    L.push(man('GALER', V3(2.6, 0, -12.2), { turn: -.3, face: 'open', mouth: 'smile', holdR: CLIP, armR: [60, 70] }), man('BID1', V3(6.4, 0, -4.4), { turn: .8, face: 'open', mouth: 'o', armL: [30, 40] }));
    L.push(man('GUARD', V3(-3.0, 0, -12.6), { turn: .5, face: 'open', mouth: 'line', armR: [30, 20] }), man('VIS3', V3(1.1, 0, -9.6), { turn: -.3, face: 'happy', mouth: 'smile', holdR: PHONE2D, armR: [150, 30] }), man('BID3', V3(-1.2, 0, -7.4), { turn: .4, face: 'open', mouth: talk(t, .3, 1.6, 'smile'), armR: [60, 50] }), man('EATER', V3(1.8, 0, -5.2), { turn: -.5, face: 'smug', mouth: 'smirk' }));
    const w2 = 1.1 * t; L.push(man('REP2', V3(5.5 - w2, 0, 2.6), Object.assign(walk2(w2 / .45 * Math.PI), { turn: -.55, face: 'open', mouth: 'smile' })));
    return depth(L); }
  const k = seg(t, t1, D); camK(k, V3(2.9, 2.35, -9.6), V3(.7, 2.6, -17), 44, V3(.45, 3.06, -13.3), V3(.05, 3.0, -17.5), 29);
  const kT = clamp((t - (tCi - .15)) / .35); tapeK(t < tCi - .15 ? 0 : eOut(kT));
  const done = t > tCi + .25, P = { turn: -.45, face: done ? 'smug' : 'open', mouth: done ? 'smirk' : 'o', armR: done ? [70, 40] : [155, 25], holdR: done ? '' : TAPEROLL, wink: done && t > tAm, brows: .15 };
  const q = scrX(BAN); return depth([man('CATT', V3(2.1, 0, -16.2), P)]) + (t > tPl && t < tCi ? sparkles(q.x, q.y, 170, t, 5, 1.1) : '') + (done ? rays(q.x, q.y, 220, (t - tCi - .2) / .5, '#ffffff', 12) : ''); };

// =====================================================================================================
// 3 · PRECIO — la galerista enseña el precio (120.000 $), lluvia de monedas · «crees que es una broma»: todo el público se ríe
// =====================================================================================================
function priceTag(u) {   // u = segundos desde que aparece
  const A = scrX(V3(.35, 2.82, -17.1)), ppm = A.ppm, drop = eOut(clamp(u / .25)), sw = 22 * Math.exp(-u * 2.6) * Math.sin(u * 9 + .6), L = ppm * .62 * drop, s = ppm / 280;
  return `<g transform="translate(${A.x.toFixed(1)},${A.y.toFixed(1)}) rotate(${sw.toFixed(1)})"><path d="M0,0 L0,${L.toFixed(1)}" stroke="#241c2c" stroke-width="${(3 * s + 1).toFixed(1)}"/><circle r="${(5 * s).toFixed(1)}" fill="#241c2c"/>
    <g transform="translate(0,${L.toFixed(1)}) scale(${(s * drop).toFixed(3)}) rotate(-4)"><path d="M-110,10 L-70,-30 L130,-30 Q142,-30 142,-18 L142,96 Q142,108 130,108 L-70,108 L-110,68Z" fill="#fff6dc" stroke="#241c2c" stroke-width="8" stroke-linejoin="round"/>
    <circle cx="-78" cy="39" r="11" fill="#e9dcc0" stroke="#241c2c" stroke-width="6"/><path d="M-66,-16 L128,-16" stroke="#e0951c" stroke-width="5"/>
    <g transform="translate(40,40)"><rect x="-74" y="-34" width="148" height="72" rx="10" fill="#7fd08a" stroke="#241c2c" stroke-width="7"/><circle r="22" fill="#4fae5c" stroke="#241c2c" stroke-width="5"/><path d="M10,-10 Q0,-17 -9,-11 Q-15,-4 -6,1 L7,5 Q15,10 6,15 Q-3,19 -12,12 M0,-22 L0,24" stroke="#fff6dc" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="-54" cy="-16" r="6" fill="#4fae5c"/><circle cx="54" cy="18" r="6" fill="#4fae5c"/></g></g></g>`; }
S.precio = (t, D, B) => { setup(t, 'gallery', 'galeria');
  const t1 = B[1] ? B[1].s : D * .5, tP = wt(B, 'precio', 0, '120000'), tBr = wt(B, 'precio', 1, 'broma');
  whip(t, [t1]);
  if (t < t1) { const k = seg(t, 0, t1); camK(k, V3(1.9, 2.3, -9.6), V3(1.15, 2.35, -16.4), 42, V3(1.6, 2.4, -10.8), V3(1.05, 2.45, -16.4), 39);
    const up = t > tP - .25, L = [man('GALER', V3(2.2, 0, -15.3), { turn: -.45, face: up ? 'happy' : 'open', mouth: up ? 'big' : talk(t, .05, tP - .3, 'smile'), armL: [105, 10], armR: [30, 40], brows: .3 })];
    L.push(man('VIS2', V3(.55, 0, -12.4), { turn: .45, face: up ? 'wide' : 'open', mouth: up ? 'o' : 'smile', armL: up ? [150, 120] : [20, 10], armR: up ? [150, 120] : [20, 10], sweat: up }));
    return depth(L) + (up ? priceTag(t - tP + .25) : '') + coins(540, -200, t, 16, 1, tP); }
  const k = seg(t, t1, D); camK(k, V3(1.6, 2.7, -15.3), V3(-.4, 1.9, -8), 46, V3(.6, 2.45, -14.6), V3(-.6, 1.95, -8.6), 41);
  const lol = t > tBr - .3, L = [];
  [['VIS1', -1.7, -10.8, [150, 10], [20, 10]], ['VIS3', .5, -10.3, [40, 85], [40, 85]], ['BID1', 2.1, -9.6, [30, 40], [20, 10]], ['REP2', -.7, -8.6, [120, 40], [30, 60]], ['BID2', 1.2, -7.6, [40, 90], [40, 90]]].forEach(([n, x, z, aR, aL], i) =>
    L.push(man(n, V3(x, 0, z), { turn: (x > 0 ? -.35 : .35), face: lol ? (i % 2 ? 'closed' : 'happy') : 'open', mouth: lol ? 'laugh' : 'smile', armR: lol ? aR : [20, 10], armL: lol ? aL : [20, 10], blush: lol ? 1 : 0, headTilt: lol ? Math.sin(t * 12 + i) * 6 : 0, bob: lol ? Math.abs(Math.sin(t * 11 + i)) * -8 : 0 })));
  return depth(L); };

// =====================================================================================================
// 4 · DUDAS — ¿de oro? (se vuelve dorado… ¡NO!) · ¿lo hizo un genio? (bombilla… ¡NO!) · es un plátano · dos pegatinas rojas de VENDIDO
// =====================================================================================================
S.dudas = (t, D, B) => { setup(t, 'gallery', 'galeria');
  const tOr = wt(B, 'dudas', 0, 'oro'), tNo1 = wt(B, 'dudas', 0, 'no', 0), tLo = wt(B, 'dudas', 0, 'lo'), tNo2 = wt(B, 'dudas', 0, 'no', 1), tEs = wt(B, 'dudas', 0, 'es', 1), tY = wt(B, 'dudas', 0, 'y'), tVe = wt(B, 'dudas', 0, 'venden'), tDos = wt(B, 'dudas', 0, 'dos');
  const c1 = tLo - .12, c2 = tEs - .12, c3 = tY - .1; whip(t, [c1, c2, c3]);
  if (t < c1) { W.poolOn(.3); const k = seg(t, 0, c1); camK(k, V3(-1.3, 3.35, -13.6), BAN, 30, V3(.9, 3.25, -13.3), BAN, 28);
    const g = t < tNo1 ? seg(t, 0, tOr + .35) : Math.max(0, 1 - (t - tNo1) / .12); W.gold(g); if (t > tNo1 && t < tNo1 + .22) SHAKE = .25;
    const q = scrX(BAN); return (g > .05 ? sparkles(q.x, q.y, 260, t, 10, 1.6 * g) + rays(q.x, q.y, 300, (t - .1) / .6, '#ffd34a', 16) : '') + redX(q.x, q.y, 1.3, (t - tNo1) / .25); }
  if (t < c2) { const k = seg(t, c1, c2); camK(k, V3(1.0, 2.15, -13.4), V3(1.9, 2.05, -16.3), 34, V3(1.35, 2.22, -14.1), V3(1.95, 2.1, -16.3), 31);
    const no = t > tNo2 - .03, F = V3(1.95, 0, -16.2), P = no ? { turn: -.2, face: 'smug', mouth: 'smirk', armL: [70, 110], armR: [70, 110], brows: .2 } : { turn: -.2, face: 'stars', mouth: 'big', armR: [150, 30], brows: .4 };
    const h = scrX(V3(F.x, F.y + 2.55, F.z)); return depth([man('CATT', F, P)]) + bulb(h.x, h.y - 10, 2.0 * (no ? Math.max(.6, 1 - (t - tNo2) * 2) : eBack(clamp((t - c1) / .35))), no ? 0 : 1) + redX(h.x + 120, h.y + 260, .9, (t - tNo2) / .25); }
  if (t < c3) { W.poolOn(.25); const k = seg(t, c2, c3); camK(k, V3(0, 3.12, -12.2), BAN, 27, V3(-.05, 3.08, -13.2), BAN, 25); return sparkles(scrX(BAN).x, scrX(BAN).y, 240, t, 4, .9); }
  const k = seg(t, c3, D); camK(k, V3(3.1, 2.55, -10.6), V3(1.0, 2.6, -17.3), 40, V3(2.3, 2.7, -11.9), V3(1.0, 2.6, -17.3), 36);
  W.dots(clamp((t - tVe) / .25) + clamp((t - tDos) / .25)); const st = t > tVe - .25;
  const L = [man('GALER', V3(2.55, 0, -16.1), { turn: -.5, face: 'happy', mouth: st ? 'big' : 'smile', armR: st ? [150, 10] : [40, 30], armL: [30, 40], brows: .3 })];
  const d1 = scrX(V3(1.25, 2.3, -17.4)); return depth(L) + (t > tVe ? rays(d1.x, d1.y, 120, (t - tVe) / .4, '#ff4f5a', 10) : '') + (t > tDos ? rays(d1.x + 70, d1.y, 120, (t - tDos) / .4, '#ff4f5a', 10) + coins(540, -200, t, 10, .9, tDos) : ''); };

// =====================================================================================================
// 5 · PAPEL — con cada plátano te dan un papel (la pista): primer plano del certificado · «nada más»: el comprador, perplejo
// =====================================================================================================
S.papel = (t, D, B) => { setup(t, 'gallery', 'galeria');
  const tPa = wt(B, 'papel', 0, 'papel'), tNa = wt(B, 'papel', 0, 'nada'), c1 = tPa - .3, c2 = tNa - .12; whip(t, [c1, c2]);
  const GF = V3(-5.3, 0, -3.4), BF = V3(-4.0, 0, -2.8);
  if (t < c1) { const k = seg(t, 0, c1); camK(k, V3(-2.3, 2.0, 2.4), V3(-4.7, 1.7, -3.2), 40, V3(-2.9, 1.95, 1.0), V3(-4.7, 1.75, -3.2), 36);
    const give = clamp((t - .2) / .5); return depth([man('GALER', GF, { turn: .5, face: 'happy', mouth: talk(t, .1, c1, 'smile'), armR: [lerp(30, 72, give), 25], holdR: give < .9 ? CERT2 : '', brows: .3 }),
      man('BID1', BF, { turn: -.45, face: 'open', mouth: 'o', armL: [lerp(20, 90, give), 20], holdL: give >= .9 ? CERT2 : '', glasses: true })]); }
  if (t < c2) { const k = seg(t, c1, c2), C = V3(-4.65, 2.05, -2.0), c = XTRA.certs[0]; c.visible = true; c.position.copy(C); c.rotation.set(0, -.5 + .7 * k, .06 * Math.sin(t * 2)); c.scale.setScalar(.5);
    camK(k, V3(-4.4, 2.15, .6), C, 33, V3(-4.5, 2.1, .1), C, 31); const q = scrX(C); return sparkles(q.x, q.y, 220, t, 8, 1.3); }
  const k = seg(t, c2, D); camK(k, V3(-3.2, 2.0, -.6), V3(-4.0, 1.95, -2.8), 34, V3(-3.45, 2.0, -1.1), V3(-4.0, 2.0, -2.8), 31);
  const h = scrX(V3(BF.x, 2.6, BF.z)); return depth([man('BID1', BF, { turn: -.2, face: 'open', mouth: 'wavy', brows: -.4, armL: [80, 60], holdL: CERT2, armR: [70, 110], sweat: true })]) + qmark(h.x + 70, h.y - 30, 1.1, (t - c2) / .3); };

// =====================================================================================================
// 6 · COLA DE FOTOS — y el artista que se acerca, salta, lo arranca de la pared y se lo come delante de todos
// =====================================================================================================
const QUEUE = [['VIS2', -.4, -11.4], ['VIS1', .55, -10.2], ['BID2', -.6, -8.9], ['VIS3', .45, -7.6], ['REP1', -.3, -6.3]];
S.come = (t, D, B) => { setup(t, 'gallery', 'galeria');
  const tUn = wt(B, 'come', 0, 'un'), tAr = wt(B, 'come', 0, 'arranca'), tY = wt(B, 'come', 0, 'y'), tCo = wt(B, 'come', 0, 'come'), c1 = tUn - .1; whip(t, [c1]);
  if (t < c1) { const k = seg(t, 0, c1); camK(k, V3(1.9, 2.35, -1.4), V3(0, 2.7, -17), 44, V3(1.2, 2.4, -3.4), V3(0, 2.8, -17), 40);
    const L = QUEUE.map(([n, x, z], i) => man(n, V3(x, 0, z), { view: 'back', armR: i % 2 ? [160, 25] : [20, 10], holdR: i % 2 ? PHONE2D : '', headTilt: Math.sin(t * 2 + i) * 3 }));
    L.push(man('EATER', V3(-1.05, 0, -11.9), { view: 'back' })); const q = scrX(BAN); return depth(L) + flashes(t, 5, 3.6, q.y - 300, q.y + 200); }
  const k = seg(t, c1, D); camK(k, V3(3.7, 2.4, -7.6), V3(-.2, 2.3, -14.6), 44, V3(2.5, 2.75, -11.4), V3(.3, 2.75, -16.6), 40);
  // el artista camina hasta la pared, salta y lo arranca
  const tW1 = tAr - .42, ku = clamp((t - c1) / Math.max(.3, tW1 - c1)), z = lerp(-11.9, -16.3, eIO(ku)), xw = lerp(-1.05, .25, eIO(ku)), walking = t < tW1, dist = Math.hypot(z + 11.9, xw + 1.05);
  const jk = clamp((t - tW1) / .6), hop = .42 * Math.sin(Math.PI * clamp((-12.55 - z) / .9)), y = t > tW1 ? 1.05 * Math.sin(Math.PI * jk) : hop, got = t > tAr - .05;   // salta la cuerda (no la atraviesa) y luego salta a por el plátano
  if (got) W.wallP.visible = false;
  const F = V3(xw, y, z), eating = t > tY - .1, bit = t > tCo - .04;
  let P = walking ? Object.assign(walk2(Math.abs(dist) / .45 * Math.PI), { turn: -.75, face: 'smug', mouth: 'smirk' }) : (t < tAr + .3 ? { turn: -.6, face: 'wide', mouth: 'grin', armR: [168, 10], armL: [120, 30], holdR: got ? BANANA2D(1) : '', lift: [.6, .2] } :
    { turn: .3, face: bit ? 'closed' : 'smug', mouth: bit ? (Math.sin(t * 15) > 0 ? 'line' : 'smile') : 'smirk', armR: eating ? [20, 30] : [120, 40], holdR: eating ? '' : BANANA2D(1), blush: bit ? 1 : 0 });
  const L = [man('EATER', F, P, { gy: 0 })];
  const shock = t > tAr; QUEUE.slice(0, 3).forEach(([n, x, zz], i) => L.push(man(n, V3(x, 0, zz), shock ? { turn: -.2 - i * .1, face: 'wide', mouth: 'o', armR: [150, 120], armL: [150, 120], sweat: i === 0 } : { turn: -.4, face: 'open', mouth: 'smile' })));
  if (t > tCo) { const gk = clamp((t - tCo) / 1.2); L.push(man('GUARD', V3(lerp(-6, -2.6, gk), 0, -12.2), Object.assign(walk2(gk * 6 * Math.PI, { amp: 1.3 }), { turn: .7, face: 'angry', mouth: 'open', brows: -.4 }))); }
  let o = depth(L); if (eating) { const m = mouthAt(F); o += biteBanana(m.x - m.R * .27, m.y + m.R * .72 + (1 - clamp((t - tY + .1) / .3)) * m.R, m.R * .00575, -34, bit); }
  return o + (got && t < tAr + .4 ? rays(scrX(BAN).x, scrX(BAN).y, 200, (t - tAr) / .4, '#ffffff', 12) : ''); };

// =====================================================================================================
// 7 · SUBASTA — cinco años (el plátano madura y se repone una y otra vez) · Nueva York · el subastador · ¡las pujas no paran! · ¡6.200.000!
// =====================================================================================================
const BIDDERS = [['BID1', AX - 1.1, .4], ['BID2', AX + 1.25, .2], ['BID3', AX - 2.3, -1.7], ['SUN', AX + 2.25, -1.9]];
const AUCTF = () => V3(AX - 4.5, 1.0, -13.75);
S.subasta = (t, D, B) => {
  const t1 = B[1] ? B[1].s : D * .4, t2 = B[2] ? B[2].s : D * .65, tSu = wt(B, 'subasta', 0, 'subasta'), tSe = wt(B, 'subasta', 2, 'seis'), tDo = wt(B, 'subasta', 2, 'dolares'), tMu = wt(B, 'subasta', 1, 'mucho');
  const cA = tSu - .12; whip(t, [cA, t1, t2]);
  if (t < cA) { setup(t, 'gallery', 'galeria'); W.poolOn(.25); const k = seg(t, 0, cA), cyc = (t * 1.6) % 1; W.ripe(lerp(.1, 1, cyc)); W.wallP.scale.setScalar(1.12 * (cyc < .08 ? eBack(cyc / .08) : 1));
    camK(k, V3(.8, 3.25, -13.0), BAN, 28, V3(-.5, 3.15, -12.6), BAN, 26); const q = scrX(BAN); return (cyc > .6 ? flies(q.x, q.y - 60, Math.floor((cyc - .55) * 14), t) : '') + (cyc < .1 ? sparkles(q.x, q.y, 200, t, 5, 1.2) : ''); }
  if (t < t1) { setup(t, 'stand', 'calle'); const k = seg(t, cA, t1); camK(k, V3(NX + .6, 1.9, 21.0), V3(NX + .3, 5, -28), 46, V3(NX + .4, 4.8, 9.5), V3(NX, 10, -30), 44);
    const w = (t - cA) * 1.3; return depth([man('VIS3', V3(NX - 1.8 + w * .8, .4, 13.2), Object.assign(walk2(w * .8 / .45 * Math.PI), { turn: .6, face: 'open', mouth: 'smile' }), { gy: .4 }), man('REP2', V3(NX + 2.2 - w * .8, .4, 14.4), Object.assign(walk2(w * .8 / .45 * Math.PI), { turn: -.6, face: 'happy', mouth: 'smile', holdR: PHONE2D }), { gy: .4 })]); }
  setup(t, 'auction', 'subasta');
  if (t < t2) { const k = seg(t, t1, t2); camK(k, V3(AX + .8, 3.1, 9.5), V3(AX - 1.6, 2.6, -12), 42, V3(AX + .3, 3.0, 6.2), V3(AX - 2.2, 2.5, -12), 38);
    const L = [man('AUCT', AUCTF(), { turn: .25, face: 'open', mouth: talk(t, t1 + .1, t2 - .2, 'line'), armR: [125, 15], brows: .2 }, { gy: 1.0, clip: V3(AX - 4.5, 2.3, -12.55) })];
    BIDDERS.forEach(([n, x, z], i) => L.push(man(n, V3(x, 0, z), { view: 'back', armL: n === 'BID1' && t > tMu - .2 ? [80, 100] : [20, 10], armR: n === 'BID1' && t > tMu - .2 ? [80, 100] : [20, 10] })));
    return depth(L); }
  // ¡las pujas no paran!: planos rápidos de paletas que suben, y el martillazo final
  const tSlam = Math.max(tSe + .2, tDo - .05), cuts = []; let c = t2; while (c < tSe - .25) { cuts.push(c); c += .42; } whip(t, cuts.concat([tSe - .1]));
  if (t < tSe - .1) { const i = Math.max(0, cuts.filter(x => x <= t).length - 1), [n, x, z] = BIDDERS[i % 4], u = t - cuts[i], kk = clamp(u / .42), F = V3(x, 0, z);
    camK(kk, V3(x + (i % 2 ? -1.2 : 1.2), 2.25, z - 3.2), V3(x, 2.15, z), 34, V3(x + (i % 2 ? -.9 : .9), 2.3, z - 2.6), V3(x, 2.25, z), 31);
    const up = eBack(clamp(u / .18)); const L = [man(n, F, { turn: i % 2 ? .25 : -.25, face: i % 3 === 0 ? 'wide' : 'smug', mouth: i % 3 === 0 ? 'o' : 'grin', armR: [lerp(30, 168, up), 15], holdR: PADDLE2D, brows: .3 })];
    BIDDERS.forEach(([n2, x2, z2], j) => { if (n2 !== n) L.push(man(n2, V3(x2, 0, z2), { turn: 0, face: 'open', mouth: 'o', armR: [lerp(30, 160, .5 + .5 * Math.sin(t * 9 + j)), 15], holdR: PADDLE2D })); });
    const h = scrX(V3(x + .3, 2.6, z)); return depth(L) + rays(h.x, h.y, 140, u / .3, '#ffd34a', 10); }
  const k = seg(t, tSe - .1, D); camK(k, V3(AX - 2.2, 2.2, -8.4), V3(AX - 4.5, 2.4, -13.6), 40, V3(AX - 3.0, 2.3, -10.0), V3(AX - 4.5, 2.5, -13.6), 34);
  const slam = t > tSlam, ga = slam ? 30 : lerp(-60, 30, clamp((t - (tSlam - .25)) / .25)); if (t > tSlam && t < tSlam + .25) SHAKE = .35;
  const L = [man('AUCT', AUCTF(), { turn: .3, face: slam ? 'stars' : 'wide', mouth: slam ? 'big' : 'o', armR: [lerp(150, 70, clamp((t - (tSlam - .25)) / .25)), 30], holdR: GAVEL(ga), brows: .4 }, { gy: 1.0, clip: V3(AX - 4.5, 2.3, -12.55) })];
  const g = scrX(V3(AX - 4.0, 2.3, -12.9)); return depth(L) + (slam ? rays(g.x, g.y, 260, (t - tSlam) / .5, '#ffd34a', 16) + coins(540, -200, t, 22, 1.1, tSlam) + sparkles(540, 700, 420, t, 10, 1.6) : ''); };

// =====================================================================================================
// 8 · GANADOR — rueda de prensa en Hong Kong: lo presenta entre flashes… y se lo come (primer plano)
// =====================================================================================================
S.ganador = (t, D, B) => { const tY = wt(B, 'ganador', 0, 'y'), tCo = wt(B, 'ganador', 0, 'come'), tGa = wt(B, 'ganador', 0, 'ganador'), cB = tY - .18; whip(t, [cB]);
  if (t < cB) { setup(t, 'stage', 'rueda'); if (W.plate) W.plate.visible = false; const k = seg(t, 0, cB);
    camK(k, V3(SX + .9, 3.0, -.2), V3(SX, 2.3, -9.6), 40, V3(SX + .35, 2.85, -2.0), V3(SX, 2.35, -9.6), 38);
    const L = [man('SUN', SUNF(), { turn: .1, face: t > tGa ? 'happy' : 'smug', mouth: talk(t, .2, cB - .2, 'big'), armR: [155, 20], holdR: BANANA2D(1.1), armL: [60, 40], blush: 1, brows: .3 }, { clip: SUNCLIP() }),
      man('REP1', V3(SX - .95, 0, -4.3), { view: 'back', armR: [160, 25], holdR: PHONE2D }), man('REP2', V3(SX + 1.1, 0, -4.4), { view: 'back', armR: [150, 25], holdR: MIC2D }), man('VIS1', V3(SX + .1, 0, -3.8), { view: 'back', armR: [165, 15], holdR: PHONE2D })];
    return depth(L) + flashes(t, 9, 5) + sparkles(scrX(V3(SX + .4, 2.9, -9.6)).x, scrX(V3(SX + .4, 2.9, -9.6)).y, 140, t, 5, 1); }
  return biteShot(t, cB, cB, tCo, D); };

// =====================================================================================================
// 9 · ¿IDIOTA? VERÁS — primer plano masticando; interrogación… y guiño con el dedo en la sien
// =====================================================================================================
S.veras = (t, D, B) => { setup(t, 'stage', 'rueda'); if (W.plate) W.plate.visible = false; const tVe = wt(B, 'veras', 0, 'veras'), k = seg(t, 0, D);
  camK(k, V3(SX - .25, 2.62, -6.5), V3(SX, 2.64, -9.8), 30, V3(SX - .12, 2.66, -7.2), V3(SX, 2.66, -9.8), 26);
  const v = t > tVe - .05, F = SUNF(); const P = v ? { face: 'smug', mouth: 'smirk', wink: true, armR: [150, 140], brows: .35, turn: .1 } : { face: 'open', mouth: Math.sin(t * 15) > 0 ? 'line' : 'smile', brows: -.2, turn: .05, blush: 1 };
  const h = scrX(V3(F.x, F.y + 2.4, F.z)); return depth([man('SUN', F, P, { clip: SUNCLIP() })]) + (v ? sparkles(h.x, h.y + 120, 240, t, 6, 1.3) : qmark(h.x + 230, h.y - 40, 1.3, t / .3)); };

// =====================================================================================================
// 10 · CERTIFICADO — 14 páginas en abanico · cómo colgarlo y cada cuánto cambiarlo (madura y se repone) · la idea (bombilla) · unos céntimos
// =====================================================================================================
S.certificado = (t, D, B) => { setup(t, 'gallery', 'galeria');
  const tCa = wt(B, 'certificado', 0, 'catorce'), tCo = wt(B, 'certificado', 0, 'como'), tLo = wt(B, 'certificado', 0, 'lo'), tEl = wt(B, 'certificado', 0, 'el'), tCe = wt(B, 'certificado', 0, 'centimos');
  const c1 = tCo - .1, c2 = tLo - .1, c3 = tEl - .1; whip(t, [c1, c2, c3]); const C = V3(2.8, 3.0, -16.3);
  if (t < c1) { const k = seg(t, 0, c1), fan = eOut(clamp((t - tCa + .1) / .5)); camK(k, V3(3.05, 3.05, -12.4), C, 36, V3(2.95, 3.0, -13.3), C, 33);
    XTRA.certs.forEach((c, i) => { const a = (i - 6.5) * .12 * fan; c.visible = i === 0 || fan > .02; c.position.set(C.x + (i - 6.5) * .05 * fan, C.y - .25 * Math.abs(i - 6.5) * .02 * fan, C.z + i * .006); c.rotation.set(0, -.15, a); c.scale.setScalar(.62); });
    const q = scrX(C); return sparkles(q.x, q.y, 260, t, 6, 1.2) + (fan > .1 ? rays(q.x, q.y, 320, (t - tCa) / .5, '#ffffff', 14) : ''); }
  if (t < c2) { W.poolOn(.25); const k = seg(t, c1, c2), u = clamp((t - c1) / (c2 - c1)), rp = u < .72 ? lerp(.3, .97, u / .72) : .3, pop = u >= .72 ? eBack(clamp((u - .72) / .12)) : 1; W.ripe(rp); W.wallP.scale.setScalar(1.12 * pop);
    camK(k, V3(-.9, 3.2, -13.2), BAN, 28, V3(.6, 3.15, -13.0), BAN, 27); const q = scrX(BAN); return (rp > .6 ? flies(q.x, q.y - 60, Math.round((rp - .55) * 16), t) : '') + (u >= .72 ? sparkles(q.x, q.y, 220, t, 7, 1.4) : ''); }
  if (t < c3) { const k = seg(t, c2, c3), c = XTRA.certs[0]; c.visible = true; c.position.copy(C); c.rotation.set(0, -.15 + .2 * k, 0); c.scale.setScalar(.42);
    camK(k, V3(2.95, 3.0, -12.8), C, 33, V3(2.9, 3.0, -13.5), C, 31); const q = scrX(V3(C.x, C.y + .4, C.z)); return bulb(q.x, q.y - 60, eBack(clamp((t - c2) / .35)) * 1.3, 1) + sparkles(q.x, q.y + 120, 260, t, 6, 1.2); }
  W.poolOn(.3); const k = seg(t, c3, D); camK(k, V3(2.4, 1.4, -13.2), V3(.2, 2.4, -17.3), 36, V3(1.7, 1.2, -14.2), V3(.1, 2.2, -17.3), 34);
  let o = ''; [0, 1].forEach(i => { const tt = tCe - .25 + i * .18; if (t > tt) { const u = clamp((t - tt) / .5), p = scrX(V3(-.3 + i * .7, lerp(2.6, .05, Math.min(1, u * 1.3)) + Math.abs(Math.sin(u * 9)) * .25 * (1 - u), -16.6)); o += `<g transform="translate(${p.x.toFixed(0)},${p.y.toFixed(0)}) scale(${(.9 * (1 - .3 * u)).toFixed(2)}, ${(.9 * Math.abs(Math.cos(t * 9 + i))).toFixed(2)})">${COIN2}</g>`; } }); return o; };

// =====================================================================================================
// 11 · OTRO — te lo comes… y cuelgas otro: plátano nuevo que aparece con un salto y cinta que crece
// =====================================================================================================
S.otro = (t, D, B) => { setup(t, 'gallery', 'galeria'); const tY = wt(B, 'otro', 0, 'y'), tCol = wt(B, 'otro', 0, 'colgar'), tOt = wt(B, 'otro', 0, 'otro'), c1 = tY - .1; whip(t, [c1]);
  const F = V3(-1.6, 0, -15.4);
  if (t < c1) { W.wallP.visible = false; tapeK(0); const k = seg(t, 0, c1); camK(k, V3(-.5, 2.45, -11.8), V3(-1.6, 2.35, -15.4), 40, V3(-.95, 2.5, -12.7), V3(-1.6, 2.4, -15.4), 36);
    const L = [man('SUN', F, { turn: .25, face: 'closed', mouth: Math.sin(t * 15) > 0 ? 'line' : 'smile', blush: 1, armR: [20, 30], brows: .3 })], m = mouthAt(F);
    return depth(L) + biteBanana(m.x - m.R * .27, m.y + m.R * .72, m.R * .00575, -34, true); }
  const k = seg(t, c1, D), kb = clamp((t - (tCol - .1)) / .3); W.wallP.visible = kb > 0; W.wallP.scale.setScalar(1.12 * (kb > 0 ? eBack(kb) : .01)); tapeK(eOut(clamp((t - tOt + .1) / .3)));
  camK(k, V3(1.2, 2.6, -11.8), V3(-.2, 2.8, -17.3), 40, V3(.4, 3.0, -13.0), V3(0, 3.0, -17.4), 32);
  const L = [man('SUN', F, { turn: .35, face: t > tOt ? 'happy' : 'open', mouth: t > tOt ? 'big' : 'smile', armR: t < tOt + .2 ? [155, 25] : [150, 140], holdR: t < tOt + .2 ? TAPEROLL : '', wink: t > tOt + .3, brows: .3 })];
  const q = scrX(BAN); return depth(L) + (kb > 0 ? rays(q.x, q.y, 260, (t - tCol) / .5, '#ffe58a', 14) + sparkles(q.x, q.y, 220, t, 6, 1.2) : ''); };

// =====================================================================================================
// 12 · FRUTERO — el frutero que lo vendió · por unos céntimos (moneda) · y le prometen cien mil plátanos: ¡lluvia de plátanos!
// =====================================================================================================
const FRUTF = () => V3(NX - 5, .4, 12.15), FCLIP = () => V3(NX - 5, 1.46, 14.75);
S.frutero = (t, D, B) => { setup(t, 'stand', 'calle');
  const tPo = wt(B, 'frutero', 0, 'por'), tDe = wt(B, 'frutero', 0, 'de'), tCi = wt(B, 'frutero', 0, 'cien'), tMa = wt(B, 'frutero', 0, 'mas'), c1 = tPo - .1, c2 = tDe - .1; whip(t, [c1, c2]);
  if (t < c1) { const k = seg(t, 0, c1); camK(k, V3(NX - 1.5, 2.0, 21.5), V3(NX - 5, 1.7, 12.5), 40, V3(NX - 3.5, 1.9, 18.8), V3(NX - 5, 1.8, 12.5), 36);
    const w = t * 1.2; return depth([man('FRUT', FRUTF(), { turn: .1, face: 'happy', mouth: talk(t, .1, c1, 'smile'), armR: [130, 30], holdR: BANANA2D(1), armL: [40, 40] }, { gy: .4, clip: FCLIP() }),
      man('VIS2', V3(NX + 1.5 - w, .4, 16.9), Object.assign(walk2(w / .45 * Math.PI), { turn: -.6, face: 'open', mouth: 'smile' }), { gy: .4 })]); }
  if (t < c2) { const k = seg(t, c1, c2); camK(k, V3(NX - 4.2, 2.15, 16.4), V3(NX - 5, 1.9, 12.3), 33, V3(NX - 4.5, 2.1, 15.6), V3(NX - 5, 1.95, 12.3), 30);
    const u = clamp((t - c1) / Math.max(.3, c2 - c1 - .2)), h = scrX(V3(NX - 4.6, 2.0, 12.4)), cx = lerp(1100, h.x, u), cy = lerp(1300, h.y, u) - Math.sin(Math.PI * u) * 300;
    return depth([man('FRUT', FRUTF(), { turn: .2, face: u >= 1 ? 'stars' : 'happy', mouth: u >= 1 ? 'big' : 'smile', armR: [110, 40], armL: [40, 40] }, { gy: .4, clip: FCLIP() })]) + `<g transform="translate(${cx.toFixed(0)},${cy.toFixed(0)}) scale(${(1.3 * Math.abs(Math.cos(t * 10))).toFixed(2)},1.3)">${COIN2}</g>`; }
  const k = seg(t, c2, D); camK(k, V3(NX - 3.0, 2.2, 19), V3(NX - 5, 2.0, 12.8), 42, V3(NX + 1, 6.0, 27), V3(NX - 5, 2.6, 12.8), 46);
  const inten = clamp((t - tCi + .3) / .5), n = Math.round(lerp(10, 46, inten)); XTRA.rain.forEach((b, i) => { if (i >= n) { b.visible = false; return; } const u = t - c2 - hs(i, 7) * .9; if (u < 0) { b.visible = false; return; }
    const x = NX - 5 + (hs(i, 1) - .5) * 9, z = 12.5 + (hs(i, 2) - .5) * 6, yy = Math.max(.45 + hs(i, 9) * .5, 9 - u * u * 9); b.visible = true; b.position.set(x, yy, z); b.rotation.set(u * 4 + i, u * 3, i); b.scale.setScalar(.34); });
  const L = [man('FRUT', FRUTF(), { turn: 0, face: t > tCi ? 'stars' : 'wide', mouth: 'big', armR: [160, 20], armL: [160, 20], sweat: t > tMa, bob: Math.abs(Math.sin(t * 10)) * -10 }, { gy: .4, clip: FCLIP() })];
  return depth(L) + sparkles(540, 700, 420, t, 7, 1.2); };

// =====================================================================================================
// 13 · FINAL — «seis millones… de un bocado» (mordisco a cámara lenta) · «y mañana, otro plátano en la pared» (bucle con el gancho)
// =====================================================================================================
S.final = (t, D, B) => { const tBo = wt(B, 'final', 0, 'bocado'), tY = wt(B, 'final', 0, 'y'), tOt = wt(B, 'final', 0, 'otro'), tPa = wt(B, 'final', 0, 'pared'), c1 = tY - .12; whip(t, [c1]);
  if (t < c1) return biteShot(t, 0, 0, tBo, c1);
  setup(t, 'gallery', 'galeria'); const k = seg(t, c1, D); camK(k, V3(.9, 2.3, -6.8), V3(0, 2.6, -17.4), 42, V3(.15, 3.0, -10.8), BAN, 30);
  const kb = clamp((t - (tOt - .15)) / .3); W.wallP.visible = kb > 0; W.wallP.scale.setScalar(1.12 * (kb > 0 ? eBack(kb) : .01)); tapeK(eOut(clamp((t - tPa + .2) / .3)));
  const pop = t > tOt - .15; const L = [man('GUARD', V3(-1.25, 0, -12.3), { turn: .4, face: pop ? 'wide' : 'open', mouth: pop ? 'o' : 'line', holdR: TORCH, armR: [100, 50], sweat: pop }), man('VIS2', V3(1.05, 0, -12.0), { turn: -.4, face: pop ? 'stars' : 'open', mouth: pop ? 'big' : 'smile', armR: pop ? [150, 30] : [20, 10], holdR: PHONE2D })];
  const q = scrX(BAN); return depth(L) + (kb > 0 ? rays(q.x, q.y, 260, (t - tOt) / .5, '#ffe58a', 14) + sparkles(q.x, q.y, 240, t, 7, 1.3) : ''); };

// dibuja el 3D después de que la escena haya colocado TODO
Object.keys(S).forEach(k => { const f = S[k]; S[k] = (t, D, B) => { const r = f(t, D, B); W.render(); return r; }; });

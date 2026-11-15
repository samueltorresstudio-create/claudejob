
// =====================================================================================================
// 4 · BOTE — los tres amigos se lanzan a por las fichas del centro (vuelan a sus montones); Manolo sonríe al fondo. Cámara en órbita.
// =====================================================================================================
function potToWinners(t0, t, pot = 36) { let L = defaultChips(0, 2); const who_ = ['pepe', 'luis', 'toni'];
  for (let i = 0; i < pot; i++) { const w = who_[i % 3], kk = clamp((t - t0 - (i % 12) * .04) / .55), e = eIO(kk), j = i % 5, a = W.stack(TC.x + Math.cos(j * 1.26) * .11, TC.z + Math.sin(j * 1.26) * .09, 9, 8 + j)[Math.floor(i / 5)], dst = stackAt(w, TR_ - .42).add(V3(Math.sin(i) * .05, 0, Math.cos(i) * .05));
    const x = lerp(a[0], dst.x, e), z = lerp(a[2], dst.z, e), y = lerp(a[1], TH + .026 + Math.floor(i / 3) * .0125, e) + Math.sin(Math.PI * kk) * .14; L.push([x, y, z, i + kk * 6]); } return L; }
S.bote = (t, D, B) => { const E = EVS.bote(B); const tR = Math.max(.2, (E.reparten || .8) - .15); setup(t + B[0].s, { chips: potToWinners(tR, t) });
  const k = clamp(t / D), a = lerp(.74, .5, eIO(k)); const cp = V3(TC.x + Math.sin(a) * 3.5, 3.0, TC.z + Math.cos(a) * 3.5); cam(cp, V3(TC.x + .05, .98, TC.z - .4), 50);
  const grab = oc(clamp((t - tR) / .35)); const L = [seated('manolo', { face: 'happy', mouth: 'smile', look: [0, 8] }),
    seated('pepe', { face: 'happy', mouth: 'laugh', look: [10, 10], armL: [lerp(12, 56, grab), lerp(10, 20, grab)], armR: REST() }),
    seated('luis', { face: 'happy', mouth: 'laugh', look: [-10, 10], armL: REST(), armR: [lerp(12, 56, grab), lerp(10, 20, grab)] }),
    seated('toni', { view: 'back', armL: REST(), armR: REST() }, { noClip: true })];
  let s = depth(L); const pc = W.proj(V3(TC.x, TH + .1, TC.z)); if (grab > 0 && grab < 1) s += impact(pc.x, pc.y, 160, (t - tR) / .4); return s; };

// =====================================================================================================
// 5 · CIEN MIL — sobre el tapete crece una torre de billetes con faja «100.000 €» que sube hasta la lámpara; la cámara la sigue hacia arriba
// =====================================================================================================
// recorta un dibujo 2D con agujeros en las siluetas proyectadas de objetos 3D que tiene DELANTE (envolvente convexa de cada grupo de esquinas; máscara = unión de agujeros)
const hull2 = pts => { pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); } for (const p of pts.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1)); };
function holeMask(svg, groups) { const hs = groups.map(G => G.map(p => W.proj(p)).filter(p => p.ok).map(p => [p.x, p.y])).filter(g => g.length >= 3).map(hull2); if (!hs.length) return svg; const id = 'hm' + (++_tc);
  return `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="-3000" y="-3000" width="8000" height="8000"><rect x="-3000" y="-3000" width="8000" height="8000" fill="#fff"/>${hs.map(h => `<path d="M${h.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L')}Z" fill="#000"/>`).join('')}</mask></defs><g mask="url(#${id})">${svg}</g>`; }
const boxPts = (x, z, hw, y0, y1, hd = hw, ry = 0) => { const o = [], c = Math.cos(ry), sn = Math.sin(ry); for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (const y of [y0, y1]) { const a = sx * hw, b = sz * hd; o.push(V3(x + a * c + b * sn, y, z - a * sn + b * c)); } return o; };
S.cien = (t, D, B) => { const E = EVS.cien(B); setup(t + B[0].s, { chips: defaultChips(0, 0) }); const tN = (E._100000 || D * .7) - .1;
  const Hof = q => lerp(.02, 1.25, eOut(clamp(q / (D * .85)))), Htop = Hof(t), k = eIO(clamp(t / D));
  const MS = W.setMoney(Htop);   // torre 3D de fajos, cada capa cae encima de la anterior (antes de cam(), que es quien pinta)
  let tP = D; for (let q = 0; q <= D; q += .02) if (Hof(q) > .7) { tP = q; break; }
  const bandY = TH + .62, sB = t > tP ? eBack(clamp((t - tP) / .3)) : 0, val = Math.round(lerp(0, 100000, eOut(clamp((t - tP) / Math.max(.3, tN - tP)))) / 100) * 100;
  W.setBand(val, bandY, sB);
  cam(V3(TC.x + lerp(.5, -.15, k), lerp(1.25, 1.75, k), TC.z + 1.75), V3(TC.x, TH + Htop * .6 + .15, TC.z), 52);
  const L = [seated('manolo', { face: 'happy', mouth: 'smile', look: [0, -10] }, { blur: 3 }), seated('pepe', { face: 'wide', mouth: 'o', look: [10, -10], brows: .8 }, { blur: 3 }), seated('luis', { face: 'wide', mouth: 'o', look: [-10, -10], brows: .8 }, { blur: 3 })];
  const hw = W.moneyHalf() + .006, G = [boxPts(TC.x, TC.z, hw, TH, MS.yBody)]; if (sB > .01) G.push(boxPts(TC.x, TC.z, (hw + .012) * sB, bandY - W.bandH() / 2 * sB, bandY + W.bandH() / 2 * sB));
  MS.tops.forEach(([x, y, z, ry]) => G.push(boxPts(x, z, MS.FW / 2 + .003, y - MS.FH / 2, y + MS.FH / 2, MS.FD / 2 + .003, ry)));
  let s = holeMask(depth(L), G);
  // billetes sueltos que caen revoloteando a los lados de la torre (nunca delante de ella)
  const BC = ['#ec9c86', '#98bde6', '#a9cc8e'], hq = i => { const x = Math.sin(i * 91.7) * 4375.85; return x - Math.floor(x); };
  for (let i = 0; i < 8; i++) { const t0 = .15 + i * .3, u = (t - t0) / 1.9; if (u <= 0 || u >= 1) continue; const sd = i % 2 ? 1 : -1;
    const x = 540 + sd * (215 + hq(i) * 170) + Math.sin(u * 7 + i) * 38, y = -90 + u * 1250, r = Math.sin(u * 6 + i * 2) * 38 + sd * 10;
    s += bill2d(x, y, .85 + hq(i + 3) * .45, r, BC[i % 3]); }
  const bp = W.proj(V3(TC.x, bandY, TC.z + W.moneyHalf() + .02));
  if (t > tN) { const u = (t - tN) / .8, tp = W.proj(V3(TC.x, MS.yBody + .03, TC.z));   // fuente de billetes desde la cima; la cifra queda limpia
    s += ring(bp.x, bp.y, 340, (t - tN) / .5, '#ffe9a0') + glint(bp.x + 210, bp.y - 60, 46, Math.abs(Math.sin(t * 5))) + glint(bp.x - 220, bp.y + 30, 34, Math.abs(Math.cos(t * 4)));
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i / 9 - .5) * 2.6, to = { x: tp.x + Math.cos(a) * 520, y: tp.y + Math.sin(a) * 300 - 80 }; s += flyBill(tp, to, clamp(u - (i % 3) * .06), .85, 480 * (i % 2 ? 1 : -1), BC[i % 3]); } }
  return s; };

// =====================================================================================================
// 6 · PEOR — los tres se ríen de él a carcajadas… y en la estantería, su trofeo: «AL PEOR»
// =====================================================================================================
S.peor = (t, D, B) => { const E = EVS.peor(B); setup(t + B[0].s, { chips: defaultChips(0, 0) }); const t1 = Math.max(.7, (E.peor || D * .55) - .2);
  if (t < t1) { const k = oc(clamp(t / t1)); cam(L3(V3(TC.x + .45, 2.95, TC.z + 2.6), V3(TC.x + .42, 2.9, TC.z + 2.4), k), V3(TC.x, .98, TC.z - .55), 56);
    const L = [seated('manolo', { face: 'happy', mouth: 'smile', look: [0, 6], browTilt: -.4 }),
      seated('pepe', { face: 'happy', mouth: 'laugh', armL: BELLY(), armR: BELLY(), headTilt: -8 + Math.sin(t * 9) * 4 }), seated('luis', { face: 'happy', mouth: 'laugh', armL: BELLY(), armR: BELLY(), headTilt: 8 + Math.sin(t * 9 + 1) * 4 }),
      seated('toni', { view: 'back', armL: REST(), armR: [150, 40], headTilt: Math.sin(t * 10) * 6 }, { noClip: true })];
    SHAKE = .006; return depth(L); }
  whipBlur(t, t1); const u = t - t1, k = oc(clamp(u / (D - t1))); const tr = W.TROPHY.position;
  cam(L3(V3(tr.x - 1.2, tr.y + .35, tr.z + .45), V3(tr.x - .95, tr.y + .3, tr.z + .35), k), V3(tr.x, tr.y + .18, tr.z), 40, .005);
  const p = W.proj(V3(tr.x, tr.y + .28, tr.z)); return glint(p.x + 60, p.y - 80, 40, Math.abs(Math.sin(u * 4))) + glint(p.x - 70, p.y - 20, 24, Math.abs(Math.cos(u * 5))); };

// =====================================================================================================
// 7 · ASES — Luis mira a los lados y levanta las cartas tiradas: una a una… póker de ases. Cara de susto.
// =====================================================================================================
S.ases = (t, D, B) => { const E = EVS.ases(B); setup(t + B[0].s, { chips: defaultChips(0, 0) }); const t1 = Math.max(.9, (E.mira || D * .35) - .1), t2 = Math.max(t1 + .7, (E.poker || D * .72) - .45);
  if (t < t1) { const k = oc(clamp(t / t1)); cam(L3(V3(TC.x + .05, 1.6, TC.z + 1.7), V3(TC.x + .1, 1.58, TC.z + 1.5), k), V3(TC.x + .55, 1.1, TC.z - .45), 52);
    const L = [seated('luis', { face: 'smug', mouth: 'line', look: [Math.sin(t * 6) * 14, 4], armR: [100, 30], armL: [64, 62], browTilt: -.3 })]; let s = depth(L);
    ACES.forEach((c, i) => s += cardOnTable(V3(TC.x + .25 + i * .05, TH + .03, TC.z - .05 + (i % 2) * .04), .3 + i * .2, c[0], c[1], false)); return s; }
  if (t < t2 + .45) { whipBlur(t, t1); const u = t - t1, k = oc(clamp(u / (t2 + .45 - t1))); cam(L3(V3(TC.x + .3, 1.55, TC.z + .25), V3(TC.x + .3, 1.5, TC.z + .18), k), V3(TC.x + .32, TH, TC.z - .02), 44, .004);
    let s = ''; ACES.slice(0, 4).forEach((c, i) => { const fl = oc(clamp((u - .15 - i * (t2 - t1 - .1) / 4) / .22)), p = W.proj(V3(TC.x + .17 + i * .075, TH + .03 + Math.sin(Math.PI * fl) * .05, TC.z - .02));
      s += card2d(p.x, p.y, p.ppm * .00068, -6 + i * 4, c[0], c[1], fl, fl >= 1 ? .4 + .3 * Math.sin(t * 8 + i) : 0); if (fl > .95 && fl < 1) s += ring(p.x, p.y, 90, .5, '#fff'); });
    const p = W.proj(V3(TC.x + .58, TH + .03, TC.z + .02)); s += card2d(p.x, p.y, p.ppm * .00068, 12, '7', '♣', 0); return s; }
  whipBlur(t, t2 + .45); const u = t - t2 - .45; const Ls = seatF('luis'); cam(L3(V3(Ls.x - .35, 1.55, Ls.z + 1.9), V3(Ls.x - .33, 1.54, Ls.z + 1.7), oc(clamp(u / (D - t2)))), V3(Ls.x, 1.35, Ls.z), 42);
  const L = [seated('luis', { face: 'wide', mouth: 'o', brows: 1, look: [-14, 10], armR: [118, 40], holdR: `<g transform="rotate(-20) scale(.55)">${FAN(ACES.slice(0, 4), .8, true)}</g>`, armL: [40, 80], sweat: true }, { noClip: false })];
  let s = depth(L); const h = headScr(seatF('luis'), SEATH); s += popIcon('!', h.x + 30, h.y - 200, 120, u / .25); return s; };

// =====================================================================================================
// 8 · DUDAS — los tres, cabeza con cabeza junto a la barra, cuchichean: bocadillos con un termómetro y con un pagaré. Manolo, de fondo, silbando.
// =====================================================================================================
const THERMO = `<rect x="-14" y="-70" width="28" height="110" rx="14" fill="#fff" stroke="${K}" stroke-width="7"/><rect x="-6" y="-40" width="12" height="70" fill="#d8302e"/><circle cy="44" r="24" fill="#d8302e" stroke="${K}" stroke-width="7"/><path d="M28,-60 L52,-60 M28,-40 L46,-40 M28,-20 L52,-20" stroke="${K}" stroke-width="5"/>`;
const IOU = `<rect x="-60" y="-50" width="120" height="96" fill="#fbf6e8" stroke="${K}" stroke-width="7"/><text y="8" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="#2f6fbf">€?</text><path d="M-40,30 Q-20,20 0,32 T40,26" stroke="${K}" stroke-width="5" fill="none"/>`;
S.dudas = (t, D, B) => { const E = EVS.dudas(B); setup(t + B[0].s, { chips: defaultChips(0, 0) }); const k = oc(clamp(t / D)); const t2 = (E.les || D * .5) - .1;
  cam(L3(V3(-2.1, 1.76, 3.9), V3(-2.1, 1.73, 3.6), k), V3(-2.1, 1.45, -1.6), 56);
  const F1 = V3(-3.42, 0, -1.6), F2 = V3(-2.1, 0, -1.45), F3 = V3(-.78, 0, -1.65), Fm = V3(.6, 0, -2.4);
  const L = [[F1, who('PEPE', { face: 'smug', mouth: talkM(t, 0, t2, 'line'), lean: 9, look: [12, 4], turn: .5, browTilt: -.4, armL: [30, 40], armR: [60, 80] }, F1)],
    [F2, who('LUIS', { face: 'smug', mouth: 'o', lean: 0, look: [0, 4], browTilt: -.4, armL: [60, 80], armR: [60, 80] }, F2)],
    [F3, who('TONI', { face: 'smug', mouth: talkM(t, t2, D, 'line'), lean: -9, look: [-12, 4], turn: -.5, browTilt: -.4, armL: [60, 80], armR: [30, 40] }, F3)],
    [Fm, who('MANOLO', { face: 'closed', mouth: 'o', look: [0, 0], armL: [20, 60], armR: [100, 70], holdR: MUG2('#f2efe6') }, Fm, ADULT, { blur: 3 })]];
  let s = depth(L); const hm = headScr(Fm); s += notes(hm.x + 50, hm.y - 40, .8, t);
  const h1 = headScr(F1), h3 = headScr(F3); const bx = x => Math.min(920, Math.max(160, x)), byy = y => Math.max(210, y);
  s += thought(bx(h1.x - 40), byy(h1.y - 300), 210, clamp(t / .3), THERMO, h1.x - 10, h1.y - 120); if (t > t2) s += thought(bx(h3.x + 40), byy(h3.y - 300), 210, clamp((t - t2) / .3), IOU, h3.x + 10, h3.y - 120);
  return s; };

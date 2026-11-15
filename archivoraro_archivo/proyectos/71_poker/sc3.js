
// =====================================================================================================
// 9 · CONDICIÓN — plano secuencia desde la puerta: Manolo cruza el bar hasta la mesa del fondo (cartel de RESERVADO); los tres ya esperan
// =====================================================================================================
const walkPath = (k) => sp(k, [[0, V3(.9, 0, 3.6)], [.5, V3(1.6, 0, 1.1)], [1, V3(2.1, 0, -1.3)]]);   // acaba a la izquierda del grupo, sin taparse con nadie
S.condicion = (t, D, B) => { const E = EVS.condicion(B); setup(t + B[0].s, { chips: defaultChips(0, 0) }); const k = eIO(clamp(t / D)), wk = clamp(t / (D * .92));
  const cp = sp(k, [[0, V3(1.15, 1.8, 5.7)], [.55, V3(2.3, 1.95, 5.25)], [1, V3(3.2, 2.05, 4.85)]]), lk = sp(k, [[0, V3(.95, 1.3, 2.0)], [.55, V3(2.4, 1.15, -.6)], [1, V3(3.5, 1.05, TC.z + .1)]]); cam(cp, lk, lerp(54, 58, k));
  const F = walkPath(eIO(wk)), ph = wk * 26; const L = [[F, who('MANOLO', Object.assign({ view: 'back' }, wk < .97 ? walkPose(ph, { amp: .8 }) : { armL: [14, 14], armR: [14, 14] }), F)],
    seated('pepe', { face: 'smug', mouth: 'line', look: [10, 0] }), seated('luis', { face: 'smug', mouth: 'line', look: [-10, 0] })];
  return depth(L); };

// =====================================================================================================
// 10 · SONRÍE — primer plano: sus fichas se van deslizando hacia Pepe… y él sonríe de oreja a oreja
// =====================================================================================================
S.sonrie = (t, D, B) => { setup(t + B[0].s, { chips: [] }); let L = defaultChips(0, 0); const from = stackAt('manolo'), to = stackAt('pepe', TR_ - .42);
  for (let i = 0; i < 12; i++) { const kk = clamp((t - .15 - i * .06) / .5), e = eIO(kk); L.push([lerp(from.x, to.x, e), TH + .026 + (i % 6) * .0125 + Math.sin(Math.PI * kk) * .05, lerp(from.z, to.z, e), i]); } W.setChips(L);
  const k = oc(clamp(t / D)); cam(L3(V3(TC.x + .55, 1.42, TC.z + .1), V3(TC.x + .5, 1.42, TC.z - .1), k), V3(TC.x, 1.3, TC.z - 1.39), 42, .004);
  const L2 = [seated('manolo', { face: t > .4 ? 'happy' : 'smug', mouth: t > .4 ? 'laugh' : 'smile', look: [-8, 6], armL: [50, 70], armR: [50, 70] })]; let s = depth(L2);
  const h = headScr(seatF('manolo'), SEATH); if (t > .4) s += glint(h.x - 160, h.y - 130, 30, Math.abs(Math.sin(t * 5))) + glint(h.x + 170, h.y - 60, 22, Math.abs(Math.cos(t * 6))); return s; };

// =====================================================================================================
// 11 · CENA — grúa que baja desde el techo a la mesa de la cena: los tres con la carta; el camarero apunta
// =====================================================================================================
const DSEAT = { pepe: V3(DT.x - .88, SIT0.y0, DT.z - .85), luis: V3(DT.x, SIT0.y0, DT.z - .85), toni: V3(DT.x + .88, SIT0.y0, DT.z - .85) };   // separados: las cabezas (0,78 m) no se pisan
const MENU = `<g transform="rotate(-8)"><rect x="-50" y="-130" width="100" height="130" rx="6" fill="#7a2a22" stroke="${K}" stroke-width="6"/><rect x="-38" y="-118" width="76" height="106" fill="#f4ecd8"/><path d="M-28,-96 L28,-96 M-28,-76 L20,-76 M-28,-56 L26,-56 M-28,-36 L16,-36" stroke="#8a7a6a" stroke-width="6"/></g>`;
const PAD = `<g transform="rotate(-10)"><rect x="-34" y="-90" width="68" height="90" rx="4" fill="#fbf8f0" stroke="${K}" stroke-width="6"/><path d="M-22,-70 L22,-70 M-22,-54 L16,-54 M-22,-38 L20,-38" stroke="#5a6a8a" stroke-width="5"/></g>`;
function diners(t, ov = {}, opt = {}) { const edge = W.proj(V3(DT.x, .79, DT.z - .55)).y; const L = Object.entries(DSEAT).map(([n, F], i) => [V3(F.x, 1, F.z), who(NAME[n], Object.assign({ legLen: SIT0.legLen, legL: SIT0.legL, legR: SIT0.legR, armL: [70, 60], armR: [70, 60], face: 'happy', mouth: 'smile' }, (ov[n] || ov.all || {})), F, SEATH, opt)]);
  if (opt.last) { const i = Object.keys(DSEAT).indexOf(opt.last); const d = L.splice(i, 1)[0]; return clipAbove(depth(L) + d[1], edge + 4); }   // opt.last: ese comensal encima (su copa alzada no queda detrás del vecino)
  return clipAbove(depth(L), edge + 4); }
S.cena = (t, D, B) => { const E = EVS.cena(B); const tC = (E.cenar || D * .8) - .2; setup(t + B[0].s, { dinner: t > tC }); const k = eIO(clamp(t / D));
  const cp = sp(k, [[0, V3(DT.x + .25, 3.3, DT.z + 3.3)], [1, V3(DT.x + .2, 1.95, DT.z + 3.25)]]); cam(cp, V3(DT.x, 1.05, DT.z - .4), lerp(62, 60, k));
  // las cartas del menú, por FUERA del grupo (L = lado izquierdo de la pantalla, R = derecho): ninguna tapa una cara
  let s = diners(t, { luis: { mouth: 'smile', look: [0, 8], armL: [30, 30], armR: [30, 30] }, pepe: { armL: [96, 40], holdL: MENU, armR: [30, 30], face: 'happy', mouth: 'laugh' }, toni: { armR: [96, 40], holdR: MENU, armL: [30, 30], mouth: 'smile', look: [-6, 8] } });
  if (t > tC) { const p = W.proj(V3(DT.x, .95, DT.z)); s += ring(p.x, p.y, 260, (t - tC) / .4, '#fff'); } return s; };

// =====================================================================================================
// 12 · CHULETÓN — insertos: el chuletón chisporrotea en la piedra · los gin-tonics burbujean · la botella cara · brindis «para celebrarlo»
// =====================================================================================================
const COPA = `<g transform="translate(0,-16)"><path d="M0,-2 L0,40" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M-22,42 Q0,36 22,42" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>` +   // copa de balón de gin-tonic (se coge por el tallo)
  `<path d="M-27,-84 C-48,-66 -50,-22 -31,-8 C-19,2 19,2 31,-8 C50,-22 48,-66 27,-84Z" fill="#eef8ff" fill-opacity=".6" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>` +
  `<path d="M-45,-42 C-45,-22 -30,-6 0,-5 C30,-6 45,-22 45,-42Z" fill="#a9e2c1"/><path d="M-45,-42 Q0,-34 45,-42" stroke="#d8f6e6" stroke-width="5" fill="none"/>` +
  `<rect x="-24" y="-56" width="20" height="20" rx="4" fill="#fbfeff" fill-opacity=".9" stroke="#8aa4b4" stroke-width="2.5" transform="rotate(-14 -14 -46)"/><rect x="2" y="-52" width="18" height="18" rx="4" fill="#fbfeff" fill-opacity=".9" stroke="#8aa4b4" stroke-width="2.5" transform="rotate(12 11 -43)"/>` +
  `<circle cx="-6" cy="-24" r="4" fill="#2a3a6a"/><circle cx="12" cy="-20" r="3.5" fill="#2a3a6a"/><circle cx="-18" cy="-30" r="2.5" fill="#fff" opacity=".9"/><circle cx="20" cy="-34" r="2" fill="#fff" opacity=".9"/>` +
  `<path d="M-33,-66 Q-40,-46 -34,-26" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>` +
  `<g transform="translate(25,-84) rotate(20)"><circle r="15" fill="#e9f5c8" stroke="#3f7a1c" stroke-width="5"/><circle r="10" fill="#b6dc5a"/><path d="M0,-10 L0,10 M-10,0 L10,0 M-7,-7 L7,7 M-7,7 L7,-7" stroke="#eef8d0" stroke-width="2"/></g></g>`;
S.chuleton = (t, D, B) => { const E = EVS.chuleton(B); setup(t + B[0].s, { dinner: true }); const t1 = Math.max(.6, (E.gintonics || D * .3) - .12), t2 = Math.max(t1 + .5, (E.y || E.botella || D * .55) - .1), t3 = Math.max(t2 + .5, (E.para || D * .78) - .15);
  if (t < t1) { const st = V3(DT.x - .45, .85, DT.z - .15), k = oc(clamp(t / t1)); cam(L3(V3(st.x + .02, 1.5, st.z + .42), V3(st.x + .02, 1.38, st.z + .34), k), st, 42, .006);
    const p = W.proj(st); return steam(p.x - 60, p.y - 20, 1.6, t) + steam(p.x + 70, p.y - 30, 1.3, t + .4) + sparks(p.x + 20, p.y + 10, 1.2, t) + sparks(p.x - 90, p.y + 30, .9, t + .3); }
  if (t < t2) { whipBlur(t, t1); const u = t - t1, g = V3(DT.x + .7, .95, DT.z + .3), k = oc(clamp(u / (t2 - t1))); cam(L3(V3(g.x - .35, 1.05, g.z + .55), V3(g.x - .3, 1.03, g.z + .45), k), g, 40, .006);
    const p = W.proj(g); let s = ''; for (let i = 0; i < 9; i++) { const kk = ((u * 1.2 + i / 9) % 1); s += `<circle cx="${(p.x - 40 + (i * 37) % 80).toFixed(1)}" cy="${(p.y + 40 - kk * 120).toFixed(1)}" r="${(4 + (i % 3) * 2).toFixed(1)}" fill="#fff" stroke="${K}" stroke-width="2" opacity="${(1 - kk).toFixed(2)}"/>`; } return s; }
  if (t < t3) { whipBlur(t, t2); const u = t - t2, b = V3(DT.x + .1, .95, DT.z - .05), k = oc(clamp(u / (t3 - t2))); cam(L3(V3(b.x + .3, 1.1, b.z + .55), V3(b.x + .26, 1.08, b.z + .45), k), b, 38, .006);
    const p = W.proj(V3(b.x, 1.05, b.z)); return glint(p.x + 50, p.y - 90, 40, Math.abs(Math.sin(u * 6))) + glint(p.x - 40, p.y + 20, 24, Math.abs(Math.cos(u * 5))); }
  whipBlur(t, t3); const u = t - t3, k = oc(clamp(u / (D - t3))); cam(L3(V3(DT.x + .2, 1.6, DT.z + 2.0), V3(DT.x + .2, 1.58, DT.z + 1.8), k), V3(DT.x, 1.25, DT.z - .5), 50);
  const up = oc(clamp(u / .3)); const cheers = { face: 'happy', mouth: 'laugh', armR: [lerp(70, 150, up), lerp(60, 30, up)], holdR: COPA, holdTop: 1, armL: [30, 30] };
  let s = diners(t, { luis: cheers, toni: cheers, pepe: { face: 'happy', mouth: 'laugh', armL: [lerp(70, 150, up), lerp(60, 30, up)], holdL: COPA, armR: [30, 30] } }, { last: 'luis' });
  if (up > .8) { const p = W.proj(V3(DT.x, 1.75, DT.z - .7)); s += impact(p.x, p.y, 180, (u - .25) / .4) + glint(p.x, p.y - 30, 36, 1); } return s; };

// =====================================================================================================
// 13 · GUIÑO — el camarero deja la cuenta… se gira hacia la barra y le guiña un ojo a Manolo, que le levanta el café
// =====================================================================================================
const BILL = `<g transform="rotate(-6)"><ellipse cx="0" cy="0" rx="46" ry="12" fill="#c9ced6" stroke="${K}" stroke-width="5"/><rect x="-22" y="-74" width="44" height="70" fill="#fbf8f0" stroke="${K}" stroke-width="5"/><path d="M-14,-60 L14,-60 M-14,-48 L10,-48 M-14,-36 L14,-36 M-14,-20 L14,-20" stroke="#5a5a6a" stroke-width="4"/></g>`;
const SITB = SIT(.82, .22), FMB = V3(-.8, SITB.y0, -2.45);
const manoloBar = (o = {}, opt) => who('MANOLO', Object.assign({ legLen: SITB.legLen, legL: SITB.legL, legR: SITB.legR, face: 'smug', mouth: 'smirk', armL: [24, 70], armR: [70, 60], holdR: MUG2('#f2efe6'), look: [-8, 4] }, o), FMB, ADULT, opt);
S.guino = (t, D, B) => { const E = EVS.guino(B); setup(t + B[0].s, { dinner: true }); const tW = Math.max(.9, (E.guina || D * .62) - .12);
  if (t < tW) { const k = oc(clamp(t / tW)); cam(L3(V3(DT.x + .45, 1.9, DT.z + 3.3), V3(DT.x + .45, 1.88, DT.z + 3.2), k), V3(DT.x + .45, 1.12, DT.z - .4), lerp(78, 76, k));   // de frente y abierto: los tres + el camarero, sin pisarse (comprobado con dbg_fit.js)   // en diagonal desde la izquierda: la fila (Pepe, Luis, Toni, camarero) se aleja sin taparse
    const Fw = V3(DT.x + 1.75, 0, DT.z - .75), give = oc(clamp((t - .3) / .5));
    let s = diners(t, { all: { face: 'happy', mouth: 'smile', look: [10, 6], armL: [30, 30], armR: [30, 30] }, pepe: { face: 'wide', mouth: 'o', look: [12, 4], armL: [30, 30], armR: [30, 30] } });
    s = depth([[V3(DT.x, 1, DT.z - .85), s], [Fw, who('CAMARERO', { face: 'smug', mouth: 'smile', look: [-14, 6], armL: [lerp(60, 150, give), lerp(40, 25, give)], holdL: BILL, holdTop: 1, armR: [14, 14] }, Fw)]]); return s; }
  whipBlur(t, tW); const u = t - tW, t2 = (D - tW) * .5;
  if (u < t2) { const Fw = V3(DT.x + 1.75, 0, DT.z - .75); cam(L3(V3(Fw.x - .2, 1.85, Fw.z + 1.55), V3(Fw.x - .18, 1.84, Fw.z + 1.4), oc(clamp(u / t2))), V3(Fw.x, 1.75, Fw.z), 40);
    const wk = u > .12; let s = who('CAMARERO', { face: 'smug', mouth: 'smirk', wink: wk, look: [14, 0], turn: .5, armR: [96, 10], holdR: BILL, armL: [14, 14], headTilt: wk ? -8 : 0 }, Fw); const h = headScr(Fw); if (wk) s += glint(h.x + 120, h.y - 130, 40, eBack(clamp((u - .12) / .25))); return s; }
  whipBlur(t, tW + t2); const v = u - t2; cam(L3(V3(FMB.x + .3, 1.65, FMB.z + 1.55), V3(FMB.x + .28, 1.64, FMB.z + 1.4), oc(clamp(v / (D - tW - t2)))), V3(FMB.x, 1.5, FMB.z), 40);
  const lift = oc(clamp(v / .3)); return manoloBar({ face: 'smug', mouth: 'smirk', armR: [lerp(70, 128, lift), lerp(60, 20, lift)], look: [-6, 0], headTilt: 4 }); };


// =====================================================================================================
// 7 · MODELO — friega silbando · arregla la cafetera (chispas → vapor, Paco feliz) · el buzón de quejas con telaraña
// =====================================================================================================
S.modelo = (t, D, B) => { const E = EVS.modelo(B); setup(t + B[0].s, { light: IN }); const t1 = Math.max(.75, (E.arreglaba || D * .25) - .08), t2 = Math.max(t1 + 1, (E.y || E.jamas || D * .68) - .1), tFix = E.guardias || (t1 + t2) / 2;
  if (t < t1) { cam(L3(V3(-1.95, 1.3, 5.9), V3(-2.0, 1.28, 5.55), oc(t / t1)), V3(-2.4, 1.0, 2.2), 52);
    const sw = Math.sin(t * 7.5); const F = V3(-2.55 + sw * .04, 0, 2.15); let s = who('PRESO', { face: 'happy', mouth: 'o', look: [10, 10], armR: [26 + sw * 16, 18], armL: [40 + sw * 10, 60], prop: 'mop', lean: sw * 2 }, F);
    const h = headScr(F); s += notes(h.x + 90, h.y - 40, 1, t); const fl = W.proj(V3(-2.0 + sw * .25, .02, 2.3)); s += glint(fl.x, fl.y, 18, Math.abs(Math.sin(t * 6))) + glint(fl.x - 120, fl.y + 30, 12, Math.abs(Math.cos(t * 5))); return s; }
  if (t < t2) { whipBlur(t, t1); const u = t - t1; W.setCoffee(t < tFix ? clamp(u / .4) * .9 : 1 + clamp((t - tFix) / .6) * .5, t); cam(L3(V3(KX + 1.0, 1.62, .95), V3(KX + 1.0, 1.6, .6), oc(u / (t2 - t1))), V3(KX + .95, 1.25, -3.2), 58);
    const fixed = t >= tFix; const Fp = V3(KX + .12, 0, -2.85), Fg = V3(KX + 1.9, 0, -2.55);
    let s = who('PACO', fixed ? { face: 'happy', mouth: 'laugh', armR: [150, 40], holdR: MUG2('#2f6fbf'), armL: [12, 12], look: [-10, 0] } : { face: 'angry', mouth: 'line', armR: [40, 70], holdR: MUG2('#2f6fbf'), armL: [24, 50], look: [-14, 4], brows: -.3 }, Fg);
    s += who('PRESO', fixed ? { face: 'happy', mouth: 'smile', armR: [120, 30], holdR: SCREW, armL: [12, 12], look: [8, -4] } : { face: 'smug', mouth: 'line', armR: [84 + Math.sin(u * 30) * 4, 40], holdR: SCREW, armL: [20, 40], look: [12, 6], lean: -3 }, Fp);
    const pv = W.proj(V3(KX + .62, 1.2, -3.55)); if (!fixed) s += sparks(pv.x, pv.y, 1.1, u); else { const pt = W.proj(V3(KX + .9, 2.1, -3.62)); s += steam(pt.x, pt.y, 1.4, t) + impact(pt.x, pt.y + 60, 140, (t - tFix) / .35); }
    return s; }
  whipBlur(t, t2); const u = t - t2; cam(L3(V3(KX + 2.55, 1.55, 1.25), V3(KX + 2.9, 1.52, 1.05), oc(u / (D - t2))), V3(KX + 4.86, 1.5, .4), 42);
  const p = W.proj(V3(KX + 4.75, 1.42, .4)); let s = ''; const sx = p.x + Math.sin(t * 3) * 6, sy = p.y - 20 + Math.sin(t * 2.2) * 18; s += `<path d="M${sx},${p.y - 160} L${sx},${sy}" stroke="#fff" stroke-width="2" opacity=".8"/><g transform="translate(${sx},${sy})"><ellipse rx="11" ry="14" fill="${K}"/><circle cy="-14" r="8" fill="${K}"/>${[-1, 1].map(sd => [0, 1, 2].map(k => `<path d="M0,${-6 + k * 6} q${sd * 14},-8 ${sd * 20},${6 + k * 3}" stroke="${K}" stroke-width="3" fill="none"/>`).join('')).join('')}<circle cx="-3" cy="-16" r="2" fill="#fff"/><circle cx="3" cy="-16" r="2" fill="#fff"/></g>`; return s; };

// =====================================================================================================
// 8 · VENTANA — su cara tras los barrotes (desde el callejón) · lo que ve: la pared del BANCO · vuelve la cara, con plan
// =====================================================================================================
const F_WIN = V3(1.12, .12, -1.6);
function winFace(o) { return winClip(who('PRESO', Object.assign({ armL: [10, 10], armR: [10, 10] }, o), F_WIN), 2.31) + winBars2d(); }
S.ventana = (t, D, B) => { const E = EVS.ventana(B); setup(t + B[0].s); tally(23, 0); const t1 = Math.max(1.0, (E.la || E.pared || D * .45) - .3), t2 = Math.max(t1 + 1.0, (E.de || E.lado || D * .85) - .25);
  const pig = (k) => { const F = V3(2.42, 1.45, -1.18 + k * .0); return typeof pigeonAt === 'function' ? pigeonAt({ peck: Math.max(0, Math.sin(t * 3)) * .6, bob: Math.sin(t * 5) * .5, eye: 'calm', flip: true }, F, V3(F.x, F.y + .3, F.z), W, { shadow: false }) : ''; };
  if (t < t1) { cam(L3(V3(5.0, 1.82, -1.62), V3(4.75, 1.86, -1.6), oc(t / t1)), V3(1.9, 1.95, -1.6), 54); return winFace({ face: 'smug', mouth: 'line', look: [10, -2], brows: -.1 }) + pig(0); }
  if (t < t2) { whipBlur(t, t1); const u = t - t1; cam(L3(V3(.95, 1.9, -1.6), V3(1.22, 1.9, -1.6), oc(u / (t2 - t1))), V3(5.3, 1.86, -1.6), 56); const pb = W.proj(V3(5.29, 1.9, -1.6)); return glint(pb.x + 150, pb.y - 70, 30, Math.abs(Math.sin(u * 3.2))) + pig(0); }
  whipBlur(t, t2); const u = t - t2; cam(L3(V3(4.7, 1.88, -1.6), V3(4.3, 1.9, -1.6), oc(u / (D - t2))), V3(1.9, 1.96, -1.6), 52);
  let s = winFace({ face: 'smug', mouth: 'smirk', look: [-8, 0], browTilt: .55, brows: -.3 }) + pig(0); const h = headScr(F_WIN); s += glint(h.x + 70, h.y - 100, 26, eBack(clamp(u / .3))); return s; };

// =====================================================================================================
// 9 · RUIDO — noche: los dos guardias dormidos en la garita · se despiertan de golpe · en la celda: ondas y tierra bajo la litera; él abre un ojo
// =====================================================================================================
S.ruido = (t, D, B) => { const E = EVS.ruido(B); setup(t + B[0].s, { mood: [0, 1], light: NIGHT, clock: [3, 0] }); tally(23, 0); const tW = E.oian || D * .35, t2 = Math.max(tW + .7, (E.debajo || D * .65) - .2);
  if (t < t2) { cam(L3(V3(-4.45, 1.42, 3.0), V3(-4.45, 1.42, 3.3), oc(t / t2)), V3(-4.45, 1.62, 7.0), 54); const y = W.proj(V3(-4.45, 1.06, 5.0)).y; const aw = t > tW, j = aw ? Math.exp(-(t - tW) * 9) * .08 : 0;
    let g = who('PACO', aw ? { face: 'wide', mouth: 'o', legLen: .6, armL: [60, 40], armR: [60, 40], look: [-12, 0], brows: .9 } : { face: 'closed', mouth: 'o', headTilt: 16, legLen: .6, armL: [16, 40], armR: [16, 40] }, V3(-5.3, j, 6.62), 1.7) +
      who('LOLA', aw ? { face: 'wide', mouth: 'o', legLen: .6, armL: [60, 40], armR: [60, 40], look: [-14, 0], brows: .9 } : { face: 'closed', mouth: 'line', headTilt: -12, legLen: .6, armL: [16, 40], armR: [16, 40] }, V3(-3.6, j, 6.62), 1.85);
    let s = clipAbove(g, y); if (!aw) [[-5.3, 1.7], [-3.6, 1.85]].forEach(([x, hh], i) => { const p = W.proj(V3(x, hh + .35, 6.62)); s += zzz(p.x + 40, p.y, .9, t + i * .4); });
    else { [[-5.3, 1.7], [-3.6, 1.85]].forEach(([x, hh]) => { const p = W.proj(V3(x, hh + .5, 6.62)); s += popIcon('!', p.x, p.y + 10, 80, (t - tW) / .25); }); SHAKE = .02 * Math.exp(-(t - tW) * 6); } return s; }
  whipBlur(t, t2); const u = t - t2, tO = (E.cama || D * .9) - t2; cam(L3(V3(.3, 1.3, -.05), V3(.22, 1.26, -.25), oc(u / (D - t2))), V3(-.62, .66, -2.7), 58, .003);
  let s = lying({ face: u > tO ? 'smug' : 'closed', wink: u > tO, mouth: 'line', noArms: true, look: [8, 6] }); const p = W.proj(V3(-.9, .2, -2.35)); s += waves(p.x - 60, p.y, 1.3, u, -1) + waves(p.x + 160, p.y, 1.3, u + .3, 1) + dirt(p.x + 40, p.y + 30, 1.2, u);
  if (u < tO) { const h = W.proj(H_LIE); s += zzz(h.x + 40, h.y - 60, .9, u); } return s; };

// =====================================================================================================
// 10 · REGISTRO — le ponen la celda patas arriba (libros volando; él con su taza) · el colchón · los ladrillos · hasta el váter
// =====================================================================================================
S.registro = (t, D, B) => { const E = EVS.registro(B); setup(t + B[0].s, { light: IN, door: 1 }); tally(23, 0); const t1 = Math.max(.9, (E.el || E.colchon || D * .35) - .1), t2 = Math.max(t1 + .6, (E.los || E.ladrillos || D * .55) - .1), t3 = Math.max(t2 + .6, (E.hasta || E.vater || D * .75) - .1);
  if (t < t1) { W.setMess(t > t1 * .45); cam(L3(V3(1.2, 1.78, 1.75), V3(1.12, 1.74, 1.45), oc(t / t1)), V3(-.25, 1.0, -1.9), 60);
    const L = [[V3(-.7, 1, -1.9), who('PACO', { face: 'angry', mouth: 'grin', armL: [120 + Math.sin(t * 14) * 30, 40], armR: [130 - Math.sin(t * 14) * 30, 40], look: [6, 6], brows: -.5 }, V3(-.7, 0, -1.9))], [V3(.55, 1, -2.35), who('LOLA', { face: 'angry', mouth: 'line', armL: [150, 20], armR: [100, 60], look: [-8, -6] }, V3(.55, 0, -2.35))],
      [V3(1.2, 1, -.55), who('PRESO', { face: 'smug', mouth: 'smirk', armR: [40, 110], holdR: MUG2(), armL: [12, 12], look: [-10, 0] }, V3(1.2, 0, -.55))]];
    let s = depth(L); const a = W.proj(V3(-.25, 1.05, -1.9)); [['#c8302e', -260, -120, 0], ['#2f6fbf', 220, -60, .25], ['#e8b830', -120, 200, .5], ['#5a8a5a', 300, 120, .7]].forEach(([c, dx, dy, ph]) => s += flyBook(a.x, a.y, a.x + dx, a.y + dy + 300, ((t * 1.6 + ph) % 1), .9, c, 540)); return s; }
  if (t < t2) { whipBlur(t, t1); const u = t - t1, a = clamp(u / .35); W.setMess(true); W.setMattress(eOut(a) * 1.25, eOut(a) * .55); cam(L3(V3(1.05, 1.5, .55), V3(.95, 1.46, .3), oc(u / (t2 - t1))), V3(-.25, .95, -2.5), 56);
    let s = who('PACO', { face: 'angry', mouth: 'grin', armL: [150, 10], armR: [150, 10], look: [-8, -10], brows: -.6, lean: -4 }, V3(.5, 0, -2.3)); if (a > .6) { const p = W.proj(V3(-.5, .5, -2.5)); s += puff(p.x, p.y, 120, (u - .3) / .5); } return s; }
  if (t < t3) { whipBlur(t, t2); const u = t - t2; W.setMess(true); W.setMattress(1.25, .55); cam(L3(V3(1.1, 1.66, -.45), V3(1.0, 1.64, -.55), oc(u / (t3 - t2))), V3(-1.4, 1.52, -1.45), 56);
    const tap = Math.max(0, Math.sin(u * 13)); const F = V3(-.95, 0, -.95); let s = who('LOLA', { face: 'smug', mouth: 'line', baton: false, look: [-14, -6], armR: [90 + tap * 30, 30], holdR: `<rect x="-8" y="-120" width="16" height="130" rx="7" fill="#1f1d22" stroke="${K}" stroke-width="4"/>`, armL: [150, 140], brows: -.2, headTilt: -8 }, F);
    if (tap > .9) { const p = W.proj(V3(-1.38, 1.7, -1.7)); s += ring(p.x, p.y, 90, (u * 13 / Math.PI) % 1, '#fff'); } return s; }
  whipBlur(t, t3); const u = t - t3; W.setMess(true); W.setMattress(1.25, .55); cam(L3(V3(-.45, 1.62, .35), V3(-.35, 1.58, .1), oc(u / (D - t3))), V3(.8, .7, -2.6), 54);
  const F = V3(.5, 0, -2.38); let s = who('PACO', { face: 'smug', mouth: 'grin', look: [14, 14], lean: 22, armR: [70, 30], holdR: TORCH, armL: [30, 60], browTilt: -.4 }, F);
  const a = W.proj(V3(.78, .95, -2.6)), b = W.proj(V3(1.05, .38, -2.82)); s += `<path d="M${a.x},${a.y} L${b.x - 70},${b.y + 10} L${b.x + 70},${b.y - 10}Z" fill="#fff6c0" opacity=".35"/>`; return s; };

// =====================================================================================================
// 11 · NADA — la celda destrozada; él da un sorbo a su taza entre los dos guardias rendidos
// =====================================================================================================
S.nada = (t, D, B) => { setup(t + B[0].s, { light: IN, door: 1 }); tally(23, 0); W.setMess(true); W.setMattress(1.25, .55); cam(L3(V3(1.2, 1.78, 2.0), V3(1.12, 1.76, 1.75), oc(t / Math.max(1, D))), V3(-.15, 1.1, -1.8), 60);
  const sip = clamp(t / .4); const L = [[V3(-.75, 1, -1.5), who('PACO', { face: 'angry', mouth: 'line', armL: [40, 120], armR: [40, 120], brows: -.6, look: [10, 0] }, V3(-.75, 0, -1.5))], [V3(.95, 1, -1.9), who('LOLA', { face: 'smug', mouth: 'line', browTilt: -.6, armL: [10, 10], armR: [10, 10], look: [-10, 4], headTilt: 6 }, V3(.95, 0, -1.9))],
    [V3(.15, 1, -1.15), who('PRESO', { face: sip > .9 ? 'closed' : 'smug', mouth: 'smirk', armR: [lerp(40, 70, sip), lerp(110, 130, sip)], holdR: MUG2(), armL: [12, 12], look: [0, 0] }, V3(.15, 0, -1.15))]];
  let s = depth(L); const h = headScr(V3(.15, 0, -1.15)); s += steam(h.x + 80, h.y + 40, .8, t); return s; };

// =====================================================================================================
// 12 · BANCO — exterior de día: la cámara viaja de la cárcel al banco de al lado
// =====================================================================================================
const PEDS = [[CR[0], -2, 1], [CR[6], 8, -1], [CR[2], 14, 1], [CR[4], 20, -1]];
S.banco = (t, D, B) => { const E = EVS.banco(B); setup(t + B[0].s, { light: DAY }); const k = eIO(clamp(t / D)); const x = lerp(-5.5, 13.0, k); cam(V3(x, 2.4, 22.3), V3(x + 1.0, 3.5, 8.6), 62);
  const L = PEDS.map(([c, x0, dir], i) => { const xx = x0 + dir * t * 1.1, F = V3(xx, .12, 11.6 + (i % 2) * .7); return [F, who(c, Object.assign({ turn: dir * .6 }, walkPose(t * 7 + i, { amp: .8 })), F)]; });
  let s = depth(L); if (t > (E.banco || 1)) { const p = W.proj(V3(15.5, 6.1, 11.9)); s += glint(p.x - 160, p.y, 34, Math.sin(Math.PI * clamp((t - E.banco) / .6))); } return s; };

// =====================================================================================================
// 13 · LUNES — el calendario pasa de domingo a lunes · abre la puerta redonda de la cámara · el libro de cuentas: 200 → 199
// =====================================================================================================
const F_DIR = V3(8.2, 0, 1.05);
S.lunes = (t, D, B) => { const E = EVS.lunes(B); setup(t + B[0].s, { light: IN }); const tL = E.lunes || .4, t1 = Math.max(tL + .6, (E.a || E.camara || D * .35) - .1), t2 = Math.max(t1 + .9, (E.le || E.faltaba || D * .66) - .1);
  if (t < t1) { calk(eIO(clamp((t - tL + .1) / .35)), clamp((t - tL - .3) / .4)); cam(L3(V3(9.05, 1.22, 2.6), V3(9.05, 1.2, 2.42), oc(t / t1)), V3(9.05, 1.05, 1.9), 34); ledger(200, 50, 0); return ''; }
  if (t < t2) { whipBlur(t, t1); const u = t - t1, k = eIO(clamp((u - .25) / (t2 - t1 - .3))); W.setVaultDoor(k * .85, -u * 3); cam(L3(V3(15.7, 1.66, 1.9), V3(15.3, 1.64, 1.6), oc(u / (t2 - t1))), V3(12.7, 1.45, -2.3), 52);
    const F = V3(13.0 + k * .3, 0, -3.0 + k * .2); return who('DIRECTOR', { face: 'angry', mouth: 'grin', armL: [100, -20], armR: [100, -20], lean: -8 * (1 - k), look: [-14, 0], brows: -.4 }, F); }
  whipBlur(t, t2); const u = t - t2, tF = (E.faltaba || t2 + .3) - t2, tP = (E.poco || t2 + .9) - t2; ledger(u < tF ? 200 : 199, u < tF ? 50 : 49, clamp((u - tP + .1) / .4)); calk(1, 1);
  cam(L3(V3(8.2, 1.98, 3.7), V3(8.2, 1.94, 3.45), oc(u / (D - t2))), V3(8.2, 1.18, 1.6), 50); const top = W.proj(V3(8.2, .82, 1.5)).y;
  return clipAbove(who('DIRECTOR', { face: u < tF ? 'smug' : 'wide', mouth: u < tF ? 'line' : 'o', legLen: .7, look: [0, 14], armL: [30, 60], armR: [30, 60], sweat: u > tF, brows: u > tF ? .8 : 0 }, F_DIR, 1.6), top); };

// =====================================================================================================
// 14 · LINGOTE — hueco en la estantería donde faltaba un lingote (brillo) · un fajo de billetes que falta; el director cuenta y no le salen las cuentas
// =====================================================================================================
const GOLD_MISS = 9;
S.lingote = (t, D, B) => { const E = EVS.lingote(B); setup(t + B[0].s, { light: IN }); const t1 = Math.max(.8, (E.un2 || E.fajo || D * .5) - .32); W.GOLD[GOLD_MISS].visible = false; W.CASH[16].visible = false; W.CASH[17].visible = false;
  if (t < t1) { const g = W.goldPos(GOLD_MISS); cam(L3(V3(g.x - .5, g.y + .55, -1.75), V3(g.x - .35, g.y + .5, -2.0), oc(t / t1)), V3(g.x, g.y + .08, -3.3), 42); const p = W.proj(g);
    const pa = W.proj(V3(g.x - .15, g.y - .03, -3.3)), pb = W.proj(V3(g.x + .15, g.y + .04, -3.3)); let s = `<rect x="${Math.min(pa.x, pb.x).toFixed(1)}" y="${Math.min(pa.y, pb.y).toFixed(1)}" width="${Math.abs(pb.x - pa.x).toFixed(1)}" height="${Math.abs(pb.y - pa.y).toFixed(1)}" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="16 12" opacity=".85"/>` + glint(p.x, p.y, 46, .6 + .4 * Math.abs(Math.sin(t * 5))); const F = V3(g.x - .95, 0, -2.2); s += who('DIRECTOR', { face: 'wide', mouth: 'o', look: [12, 8], sweat: true, armL: [10, 10], armR: [40, 60], brows: .7 }, F); return s; }
  whipBlur(t, t1); const u = t - t1; const c = W.CASH[16].position.clone(); cam(L3(V3(c.x + .55, 1.85, -.15), V3(c.x + .55, 1.83, -.4), oc(u / (D - t1))), V3(c.x + .55, 1.65, -3.1), 60);
  const F = V3(c.x + 1.15, 0, -2.75); let s = who('DIRECTOR', { face: 'smug', mouth: 'o', look: [-12, -6], sweat: true, browTilt: -.6, armL: [150, 60], armR: [20, 40] }, F); const h = headScr(F);
  s += thought(h.x - 250, h.y - 230, 290, clamp(u / .3), bill2dGroup(u), h.x - 80, h.y - 60); return s; };
function bill2dGroup(u) { let s = ''; for (let i = 0; i < 3; i++) s += `<g transform="translate(${-60 + i * 50},${-10 + i * 6}) rotate(${-8 + i * 8})"><rect x="-34" y="-20" width="68" height="40" rx="3" fill="#9ab88a" stroke="${K}" stroke-width="5"/><circle cx="0" cy="0" r="10" fill="#7a9a6a"/></g>`; return s + `<g transform="translate(70,-30) scale(.6)"><path d="M-34,-36 C-34,-80 34,-84 34,-40 C34,-12 4,-6 4,22" stroke="${K}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M-34,-36 C-34,-80 34,-84 34,-40 C34,-12 4,-6 4,22" stroke="#ffd34a" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="4" cy="58" r="14" fill="#ffd34a" stroke="${K}" stroke-width="8"/></g>`; }

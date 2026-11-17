
// =====================================================================================================
// 1 · GORRO — ¡acción en el fotograma 0!: el gorro de cascabeles baja sobre la cabeza del bufón, sujeto por las manos del rey (mangas de terciopelo con lises).
// Al encajar, «¡ding!» y los cascabeles se balancean. «…y te nombra su bufón»: plano general, el rey en la tarima le señala con el cetro y la corte aplaude.
// =====================================================================================================
const JH = V3(0, 0, -8.7);
const CAM0 = [V3(.1, 2.4, -4.3), V3(0, 2.28, -8.7), 44];
S.gorro = (t, D, B) => { const E = EVS.gorro(B); const tB = Math.max(2.0, (E.y || D * .55) - .12); setup(t + B[0].s, { light: IN });
  if (t < tB) { const k = clamp(t / tB), land = 1.25, kl = clamp(t / land), lift = (1 - (1 - Math.pow(1 - kl, 3))) * 290, sw = t > land ? Math.sin((t - land) * 11) * Math.exp(-(t - land) * 2.6) : 0;
    cam(L3(CAM0[0], V3(.05, 2.05, -5.0), oc(k)), L3(CAM0[1], V3(0, 2.0, -8.7), oc(clamp(t / 1.4))), 44, .003);
    const face = t < land ? { face: 'wide', mouth: 'o', look: [0, -14], brows: .6 } : { face: 'wide', mouth: 'line', look: [0, -6], brows: .9, sweat: true };
    let s = who('BUFON', Object.assign({ hatLift: lift, hornSwing: sw, armL: [14, 10], armR: [14, 10] }, face), JH, ADULT);
    const hc = headScr(JH), q = sOf(JH), up = clamp((t - land - .15) / .5), yy = hc.y - (82 + lift) * q - up * 1100, dx = 150 * q;
    s += kingSleeve(hc.x - dx - 420, yy - 900, hc.x - dx, yy, q * 1.2) + kingSleeve(hc.x + dx + 420, yy - 900, hc.x + dx, yy, q * 1.2);
    if (t > land) { const kk = (t - land) / .45; s += ding(hc.x - 198 * q, hc.y - 56 * q, q * 1.2, kk) + ding(hc.x + 198 * q, hc.y - 56 * q, q * 1.2, kk) + ding(hc.x + 84 * q, hc.y - 238 * q, q * 1.2, kk - .1) + ring(hc.x, hc.y - 120 * q, 300, kk * 1.2, '#fff6c8'); }
    return s; }
  whipBlur(t, tB); const u = t - tB, k = oc(clamp(u / (D - tB))), tN = E.bufon || D * .85;
  cam(L3(V3(.6, 2.3, -2.4), V3(.75, 2.35, -1.9), k), V3(-.1, 2.0, -11), 50);
  const KF = V3(-.8, .75, -12.5), JF = V3(1.15, 0, -6.9), clap = Math.sin(u * 18) > 0, bow = snap(u + tB, tN - .1, .4);
  const L = [P_('REY', { face: 'happy', mouth: 'smile', prop: 'scepter', armR: [lerp(30, 118, snap(u, 0, .4)), lerp(40, 12, snap(u, 0, .4))], armL: [20, 30], turn: .25 }, KF),
    P_('BUFON', { face: bow > .5 ? 'happy' : 'wide', mouth: bow > .5 ? 'laugh' : 'o', lean: lerp(0, -9, bow), armL: [26, -96], armR: [lerp(14, 120, bow), lerp(10, 40, bow)], turn: -.35, hornSwing: Math.sin(u * 9) * .4 }, JF)];
  [[-1.15, -8.9, 'NOBLE1', .45], [-1.3, -10.9, 'NOBLE3', .4]].forEach(([x, z, n, tn]) => L.push(P_(n, { turn: tn, face: 'happy', mouth: 'smile', armL: clap ? [40, -90] : [46, -70], armR: clap ? [40, -90] : [46, -70] }, V3(x, 0, z))));
  [[-2.0, -12.6], [1.6, -12.6]].forEach(([x, z]) => L.push(P_('GUARDIA', { turn: x < 0 ? .3 : -.3 }, V3(x, .75, z))));
  let s = depth(L); const kp = W.proj(V3(KF.x + .9, KF.y + 2.2, KF.z)); s += glint(kp.x, kp.y, 34, Math.abs(Math.sin(u * 4)));
  return s; };

// =====================================================================================================
// 2 · VERDAD — el banquete: travelling lateral por la mesa; los nobles, callados y serios… y el bufón, el único que le habla al oído al rey.
// =====================================================================================================
const BTZ = -9.6, SEATZ = -10.25, SIT_B = SITP(.52, 0);
const tableClip = (svg, x) => clipAbove(svg, W.proj(V3(x, .95, BTZ + .66)).y);
function diner(name, x, pose, opt) { const F = V3(x, SIT_B.y0, SEATZ); return [F, tableClip(who(name, Object.assign({ legLen: SIT_B.legLen, legL: SIT_B.legL, legR: SIT_B.legR, armL: [12, 10], armR: [12, 10] }, pose), F, ADULT, opt), x)]; }
S.verdad = (t, D, B) => { const E = EVS.verdad(B); setup(t + B[0].s, { banq: true, light: IN }); const k = clamp(t / D), e = eIO2(k), tU = E.unico || D * .3;
  cam(L3(V3(-2.7, 1.7, -5.6), V3(.75, 1.75, -5.5), e), L3(V3(-1.9, 1.45, -10.3), V3(.5, 1.5, -10.4), e), 42);
  const L = [diner('NOBLE1', -2.6, { face: 'smug', mouth: 'line', look: [10, 8], turn: .3 }), diner('NOBLE3', -1.3, { face: 'smug', mouth: 'line', look: [8, 10], turn: .2 }),
    diner('REY', 0, { face: 'smug', mouth: 'smirk', look: [14, 0], turn: .15 }), diner('NOBLE4', 2.4, { face: 'smug', mouth: 'line', look: [-12, 6], turn: -.3 }), diner('NOBLE2', 3.3, { face: 'smug', mouth: 'line', look: [-10, 10], turn: -.3 })];
  const JF = V3(1.5, 0, -10.8); L.push([JF, tableClip(who('BUFON', { face: 'happy', mouth: talkM(t, tU, D - .2, 'smirk'), turn: -.55, lean: -10, look: [-16, 6], armL: [40, -110], armR: [14, 10], hornSwing: Math.sin(t * 6) * .3 }, JF, ADULT), JF.x)]);
  return depth(L); };

// =====================================================================================================
// 3 · CONDICIÓN — el bufón hace malabares delante de la mesa y el rey se parte de risa… «si deja de reír»: la risa se le apaga;
// «tú dejas de respirar»: primer plano del bufón, se le caen las bolas, gota de sudor y las franjas negras se cierran.
// =====================================================================================================
S.condicion = (t, D, B) => { const E = EVS.condicion(B); setup(t + B[0].s, { banq: true, light: IN }); const tA = (E.si || D * .45) - .1, tR = E.reir || D * .6, tT = (E.tu || D * .8) - .08;
  if (t < tA) { const k = oc(clamp(t / tA)); cam(L3(V3(-.3, 1.9, -1.6), V3(-.25, 1.85, -2.3), k), V3(.45, 1.55, -9.6), 46);
    const JF = V3(1.0, 0, -7.2), laugh = t > (E.ria || tA * .7) - .15;
    const L = [diner('REY', 0, { face: laugh ? 'happy' : 'smug', mouth: laugh ? 'laugh' : 'smile', headTilt: laugh ? Math.sin(t * 14) * 3 : 0, look: [8, 14] }), diner('NOBLE3', -1.3, { face: 'happy', mouth: 'smile' }), diner('NOBLE4', 2.4, { face: 'happy', mouth: 'smile' }),
      P_('BUFON', { face: 'happy', mouth: 'laugh', armL: [60 + Math.sin(t * 8) * 14, -40], armR: [60 - Math.sin(t * 8) * 14, -40], turn: .15, hornSwing: Math.sin(t * 7) * .5 }, JF)];
    return depth(L) + juggle(JF, t); }
  if (t < tT) { const u = t - tA, k = oc(clamp(u / (tT - tA))); whipBlur(t, tA); cam(L3(V3(.05, 1.62, -5.4), V3(.03, 1.6, -5.9), k), V3(0, 1.6, -10.3), 30);
    const stop = snap(t, tR - .1, .3); const L = [diner('REY', 0, stop < .5 ? { face: 'happy', mouth: 'laugh', headTilt: Math.sin(t * 14) * 3 } : { face: 'angry', mouth: 'line', brows: -.6, look: [0, 6] })];
    let s = depth(L); if (stop > .5) { const h = headScr(V3(0, SIT_B.y0, SEATZ)); s += tension(h.x, h.y, 400, t); } return s; }
  const u = t - tT, k = oc(clamp(u / (D - tT))); whipBlur(t, tT); cam(L3(V3(0, 2.0, -4.4), V3(0, 1.98, -4.8), k), V3(0, 1.88, -8.7), 40, .004);
  let s = who('BUFON', { face: 'wide', mouth: 'line', brows: 1, sweat: true, look: [0, 4], hornSwing: Math.sin(u * 30) * .08 }, JH, ADULT);
  const hc = headScr(JH), q = sOf(JH); for (let i = 0; i < 3; i++) { const kk = clamp((u - i * .08) / .7), x = hc.x + (i - 1) * 140 * q, y = hc.y + 130 * q + kk * kk * 900; if (kk < 1) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(26 * q).toFixed(1)}" fill="${['#c8302e', '#e8b830', '#2f6fbf'][i]}" stroke="${K}" stroke-width="${(7 * q).toFixed(1)}"/>`; }
  return s + bars(clamp((u - .25) / (D - tT - .3))); };

// =====================================================================================================
// 4 · GUERRA — sala de guerra de noche: primer plano del mapa: «AÑO MCCCXL»; la cámara sube y descubre a los nobles y a Inglaterra.
// «Y llega una noticia…»: se abre la puerta y entra el mensajero empapado con una carta sellada; los nobles se giran.
// =====================================================================================================
const mapClip = (svg, x) => clipAbove(svg, W.proj(V3(x, .93, -1.0)).y);
S.guerra = (t, D, B) => { const E = EVS.guerra(B); const tB = Math.max(1.6, (E.y || D * .55) - .12); setup(t + B[0].s, { mood: 'war', light: CANDLE, tk: .25 }); const G = W.GX;
  if (t < tB) { const k1 = eIO2(clamp((t - .9) / Math.max(.6, tB - 1.3)));
    cam(L3(V3(G - 1.05, 3.6, .9), V3(G - .05, 3.9, 3.9), k1), L3(V3(G - 1.15, .92, -.62), V3(G - .25, .9, -.6), k1), lerp(34, 46, k1), .003);
    const L = k1 < .25 ? [] : [[-.9, -1.5, 'NOBLE1', .1], [.55, -1.5, 'NOBLE2', -.1]].map(([x, z, n, tn]) => { const F = V3(G + x, 0, z); return [F, mapClip(who(n, { turn: tn, face: 'smug', mouth: 'line', look: [0, 16], armL: [26, -60], armR: [26, -60] }, F, ADULT), G + x)]; });
    let s = depth(L); const t13 = E._1340 || .4; if (t > t13 - .1) { const p = W.proj(W.mapP(.11, .13, .02)); s += glint(p.x + 60, p.y - 40, 46, Math.abs(Math.sin((t - t13) * 5)) * .9 + .1); }
    const tI = E.inglaterra || tB * .8; if (t > tI - .2) { const p = W.proj(W.mapP(.36, .12, .02)); s += ring(p.x, p.y, 200, (t - tI + .2) / .55, '#ff4f5a'); }
    return s; }
  whipBlur(t, tB); const u = t - tB, k = oc(clamp(u / (D - tB))), open = snap(u, .05, .35); W.WDOOR.rotation.y = -open * 1.5;
  cam(L3(V3(G + .4, 1.95, .6), V3(G + .3, 1.9, 1.15), k), V3(G - .05, 1.6, 7), 46);
  const turn = snap(u, .3, .35), MF = V3(G - .1, 0, 7.3 - open * .4);
  const L = [P_('MENSAJERO', { face: 'wide', mouth: talkM(u, .4, 1.2, 'o'), sweat: true, armR: [150, 10], holdR: LETTER(-14), holdTop: 1, armL: [30, 50], lean: -4 }, MF),
    P_('NOBLE3', turn < .5 ? { turn: .3, face: 'smug', mouth: 'line' } : { view: 'back', turn: -.35 }, V3(G + 1.1, 0, 3.4)), P_('NOBLE4', turn < .5 ? { turn: -.3, face: 'smug', mouth: 'line' } : { view: 'back', turn: .35 }, V3(G - 1.05, 0, 3.6))];
  let s = depth(L); const hp = headScr(MF);
  s += [0, 1, 2, 3].map(i => { const kk = ((u * 1.6 + i / 4) % 1); return `<circle cx="${(hp.x + (i - 1.5) * 60 + Math.sin(i * 3) * 20).toFixed(1)}" cy="${(hp.y + 80 + kk * 260).toFixed(1)}" r="9" fill="#8fd0ff" stroke="${K}" stroke-width="3" opacity="${(1 - kk).toFixed(2)}"/>`; }).join('');
  return s; };


// =====================================================================================================
// 15 · PISTAS — el inspector: la cerradura intacta (✔) · la alarma con su piloto verde, muda · la lupa sobre un lingote: ni una huella
// =====================================================================================================
S.pistas = (t, D, B) => { const E = EVS.pistas(B); setup(t + B[0].s, { light: IN }); const t1 = Math.max(.8, (E.ni2 || E.alarmas || D * .35) - .25), t2 = Math.max(t1 + .7, (E.una || E.huella || D * .68) - .3);
  if (t < t1) { cam(L3(V3(15.6, 1.66, 1.6), V3(15.35, 1.64, 1.35), oc(t / t1)), V3(12.6, 1.45, -1.6), 48); const F = V3(13.25, 0, -.7);
    let s = who('INSPECTOR', { face: 'smug', mouth: 'line', look: [-14, 0], armR: [10, 10], armL: [96, 30], holdL: LENS, lean: -4 }, F); const h = headScr(F); s += popIcon('ok', h.x + 120, h.y - 140, 90, (t - (E.rotas || t1 * .6)) / .25); return s; }
  if (t < t2) { whipBlur(t, t1); const u = t - t1; cam(L3(V3(15.3, 2.42, -1.0), V3(15.28, 2.42, -1.3), oc(u / (t2 - t1))), V3(15.2, 2.3, -3.5), 44); const F = V3(14.35, 0, -2.3);
    let s = who('INSPECTOR', { face: 'smug', mouth: 'line', look: [12, -12], armL: [40, 70], armR: [40, 70], browTilt: -.5, brows: .6 }, F); const p = W.proj(V3(15.2, 2.75, -3.2)); s += zzz(p.x + 80, p.y - 40, 1, u, 2); return s; }
  whipBlur(t, t2); const u = t - t2; const g = W.goldPos(3); cam(L3(V3(g.x - .45, g.y + .75, -1.35), V3(g.x - .4, g.y + .7, -1.6), oc(u / (D - t2))), V3(g.x - .1, g.y + .2, -3.3), 48);
  const p = W.proj(g), r = 170, F = V3(g.x - .75, 0, -2.45); let s = who('INSPECTOR', { face: 'smug', mouth: 'o', look: [14, 10], armR: [60, 40], armL: [10, 10], browTilt: -.5 }, F);
  s += `<circle cx="${p.x + 10}" cy="${p.y}" r="${r}" fill="#fff8d0" fill-opacity=".22" stroke="${K}" stroke-width="16"/><circle cx="${p.x + 10}" cy="${p.y}" r="${r - 10}" fill="none" stroke="#fff" stroke-width="5" opacity=".6"/><path d="M${p.x + 10 + r * .7},${p.y + r * .7} L${p.x + 10 + r * 1.5},${p.y + r * 1.5}" stroke="${K}" stroke-width="34" stroke-linecap="round"/><path d="M${p.x + 10 + r * .75},${p.y + r * .75} L${p.x + 10 + r * 1.45},${p.y + r * 1.45}" stroke="#5a3a22" stroke-width="20" stroke-linecap="round"/>`;
  s += glint(p.x - 30, p.y - 20, 30, Math.abs(Math.sin(u * 5))); const h = headScr(F); s += popIcon('?', h.x + 30, h.y - 150, 100, (u - .3) / .3); return s; };

// =====================================================================================================
// 16 · DIRECTOR — la policía le pone las esposas al director (llora); los clientes miran
// =====================================================================================================
S.director = (t, D, B) => { const E = EVS.director(B); setup(t + B[0].s, { light: IN }); const tD = E.detuvo || D * .3, tR = E.director || D * .7; cam(L3(V3(16.2, 1.72, 7.6), V3(16.0, 1.7, 7.1), oc(t / D)), V3(15.05, 1.32, .9), 50);
  const cuffed = t > tD; const Fd = V3(15.05, 0, 1.0); const L = [];
  L.push([Fd, who('DIRECTOR', cuffed ? { face: 'happy', mouth: 'open', browTilt: -.9, armL: [26, -46], armR: [26, -46], look: [0, 6], cry: t > tR - .2 ? t : null } : { face: 'wide', mouth: 'o', armL: [70, 30], armR: [70, 30], brows: .8, sweat: true }, Fd)]);
  L.push([V3(13.85, 0, 1.25), who('POLI1', { face: 'smug', mouth: 'line', armR: cuffed ? [62, 40] : [70, 60], armL: [10, 10], look: [12, 0] }, V3(13.85, 0, 1.25))]);
  L.push([V3(16.3, 0, 1.3), who('POLI2', { face: 'angry', mouth: 'line', armL: cuffed ? [62, 40] : [70, 60], armR: [10, 10], look: [-12, 0] }, V3(16.3, 0, 1.3))]);
  [[CR[5], 13.0, -1.6], [CR[2], 18.4, -.9], [CR[6], 19.6, .4]].forEach(([c, x, z]) => L.push([V3(x, 0, z), who(c, { face: 'wide', mouth: 'o', look: [x > 15 ? -12 : 12, 0], armL: [20, 40], armR: [20, 40] }, V3(x, 0, z), ADULT, { blur: 3 })]));
  L.push([V3(18.0, 0, -2.75), clipAbove(who('CAJERA', { face: 'wide', mouth: 'o', armL: [130, 110], armR: [20, 40], look: [-14, 0] }, V3(18.0, 0, -2.75), ADULT, { blur: 3 }), W.proj(V3(18, 1.18, -2.6)).y)]);
  let s = depth(L); const hp = W.proj(V3(15.05, 1.05, 1.15)), sc = sOf(Fd); if (cuffed) { s += CUFFS(hp.x, hp.y, sc * 1.6) + ring(hp.x, hp.y, 120, (t - tD) / .3, '#fff'); SHAKE = .015 * Math.exp(-(t - tD) * 8); }
  return s; };

// =====================================================================================================
// 17 · TÚNEL — vista en corte: él duerme en la litera… la cámara baja por debajo del suelo: el pozo, el túnel, el cartel de SALIDA tachado
// =====================================================================================================
function crawl(ph, o = {}) { const s1 = Math.sin(ph), c1 = Math.cos(ph); return Object.assign({ face: 'smug', mouth: 'smirk', look: [12, 0], headTilt: -64,
  armL: [128 + s1 * 22, -70 + s1 * 18], armR: [128 - s1 * 22, -70 - s1 * 18], legL: [52 + c1 * 18, 96], legR: [52 - c1 * 18, 96] }, o); }
const crawlAt = (x, y, ph, o) => { const F = V3(x - 1.55, y, -2.78), Hc = V3(x, y + .62, -2.78); return who('PRESO', crawl(ph, o), F, Hc, { shadow: false }); };
S.tunel = (t, D, B) => { const E = EVS.tunel(B); setup(t + B[0].s, { section: true, mood: [0, 1], light: CANDLE, clock: [3, 0] }); tally(23, 0); W.setCellLid(0);
  const k = eIO(clamp((t - .35) / (D - .35))); const cp = sp(k, [[0, V3(-.25, 1.45, 3.0)], [.5, V3(.05, -.4, 2.6)], [1, V3(1.25, -2.05, 2.35)]]), lk = sp(k, [[0, V3(-.35, 1.0, -2.8)], [.5, V3(-.6, -.9, -2.8)], [1, V3(.85, -2.45, -2.8)]]);
  cam(cp, lk, 56, .0018); W.charLight = k < .3 ? NIGHT : CANDLE; let s = lying({ face: 'closed', mouth: 'line', noArms: true }); const h = W.proj(H_LIE); if (k < .4) s += zzz(h.x + 40, h.y - 60, .9, t);
  if (t > (E.escapar || D * .8) - .1) { const p = W.proj(V3(-.2, W.TUN.y0 + 1.02, W.TUN.zb + .1)); s += `<path d="M${p.x - 90},${p.y - 60} L${p.x + 90},${p.y + 40} M${p.x + 90},${p.y - 60} L${p.x - 90},${p.y + 40}" stroke="#ff3b4a" stroke-width="16" stroke-linecap="round" opacity="${clamp((t - E.escapar + .1) / .2) * .0}"/>`; } return s; };

// =====================================================================================================
// 18 · DEBAJO — travelling por el túnel (bajo el muro y el callejón) y subida por el pozo hasta la cámara acorazada
// =====================================================================================================
S.debajo = (t, D, B) => { const E = EVS.debajo(B); setup(t + B[0].s, { section: true, mood: [0, 1], light: CANDLE }); W.setCellLid(0); W.setVTile(1);
  const tU = Math.max(D * .45, (E.y || E.subia || D * .5) - .1); let cp, lk;
  if (t < tU) { const k = eIO(clamp(t / tU)); cp = V3(lerp(1.25, 8.6, k), -2.05, lerp(2.35, 2.55, k)); lk = V3(lerp(.85, 9.0, k) + .4, -2.45 + k * .2, -2.8); }
  else { const k = eIO(clamp((t - tU) / (D - tU - .1))); cp = V3(9.0, lerp(-2.05, 1.35, k), lerp(2.55, 3.1, k)); lk = V3(9.0, lerp(-2.25, 1.05, k), -2.9); }
  cam(cp, lk, 56, .0018); let s = ''; if (t > tU) { const p = W.proj(V3(9.0, -.1, -2.8)); s += glint(p.x + 220, p.y - 260, 34, Math.abs(Math.sin(t * 3))); } return s; };

// =====================================================================================================
// 19 · NOCHE — gatea con su farol por el túnel · asoma por la losa de la cámara, coge un lingote y guiña · al amanecer, el recuento: él «dormido»
// =====================================================================================================
S.noche = (t, D, B) => { const E = EVS.noche(B); const t1 = Math.max(1.3, (E.cogia || D * .38) - .12), t2 = Math.max(t1 + .9, (E.y || E.volvia || D * .58) - .12);
  if (t < t1) { setup(t + B[0].s, { section: true, mood: [0, 1], light: CANDLE }); W.setCellLid(0); W.setVTile(1); const x0 = 2.9, v = .62, hx = x0 + v * t;
    cam(V3(hx + .5 + .1 * Math.sin(t * .8), -2.12, 1.3), V3(hx + .5, -2.42, -2.8), 50, .0018); return crawlFig(t, { x0, v, f: 1.2 }); }
  if (t < t2) { setup(t + B[0].s, { light: IN, mood: [0, 1] }); W.setVTile(1); whipBlur(t, t1); const u = t - t1, up = eOut(clamp(u / .35)), grab = clamp((u - .45) / .25); W.GOLD[26].visible = grab < .5;
    cam(L3(V3(9.0, 1.38, -.18), V3(9.0, 1.33, -.4), oc(u / (t2 - t1))), V3(9.0, .56, -2.95), 58); const F = V3(9.0, lerp(-1.75, -1.12, up), -2.82), top = W.proj(V3(9.0, 0, -2.35)).y;
    let s = clipAbove(who('PRESO', { face: 'smug', mouth: 'smirk', wink: grab > .9, look: [0, 4], armR: grab > 0 ? [lerp(150, 100, grab), lerp(30, 70, grab)] : [150, 30], holdR: grab > .5 ? BAR2(.9) : '', armL: [60, 40] }, F), top);
    const h = headScr(F); if (grab > .9) s += glint(h.x + 120, h.y - 140, 26, eBack(clamp((u - .7) / .2))); return s; }
  setup(t + B[0].s, { light: DUSK, mood: [.55, 0], clock: [6, 0] }); tally(23, 0); whipBlur(t, t2); const u = t - t2, tick = (E.recuento || D) - t2; cam(L3(V3(.2, 1.72, 4.5), V3(.18, 1.7, 4.2), oc(u / (D - t2))), V3(-.05, 1.15, -1.2), 52);
  const Fg = V3(.82, 0, 1.05); let s = lying({ face: 'closed', mouth: 'o', noArms: true }) + bars2d(0, 0); const h = W.proj(H_LIE); s += zzz(h.x + 40, h.y - 60, .9, u);
  s += who('LOLA', { face: 'smug', mouth: 'line', look: [-12, 6], armL: [80, 40], holdL: CLIP, armR: [u > tick - .3 ? 70 : 40, 60], holdR: `<rect x="-4" y="-60" width="8" height="60" fill="#2f6fbf" stroke="${K}" stroke-width="3"/>` }, Fg); return s; };

// =====================================================================================================
// 20 · SALIR — la puerta de la celda se queda abierta… y él mismo la cierra, sonriendo
// =====================================================================================================
S.salir = (t, D, B) => { const E = EVS.salir(B); setup(t + B[0].s, { light: IN }); tally(23, 0); const tS = E.salir || D * .6; const k = 1 - eIO(clamp((t - tS + .15) / .45)); W.setCellDoor(k);
  cam(L3(V3(1.2, 1.62, 2.75), V3(1.12, 1.6, 2.5), oc(t / D)), V3(-.05, 1.3, -.6), 50); const F = V3(.25, 0, -.62);
  let s = who('PRESO', seq(t, [[0, { face: 'smug', mouth: 'line', look: [12, 0], armL: [12, 12], armR: [12, 12] }], [tS - .35, { face: 'smug', mouth: 'smirk', armR: [86, 20], look: [0, 0] }, .2], [tS + .4, { face: 'happy', mouth: 'smile', armR: [30, 30] }, .3]]), F) + bars2d(0, k);
  if (t > tS + .25 && t < tS + .7) { const p = W.proj(V3(1.35, 1.3, .1)); s += ring(p.x, p.y, 120, (t - tS - .25) / .35, '#fff'); } return s; };

// =====================================================================================================
// 21 · VACIAR — pinta rayas de días con tiza (sonrisa de plan) · la cámara acorazada casi vacía
// =====================================================================================================
S.vaciar = (t, D, B) => { const E = EVS.vaciar(B); const t1 = Math.max(1.0, (E.para || D * .58) - .12);
  if (t < t1) { setup(t + B[0].s, { light: IN }); const n = 58 + Math.floor(t / .32), kk = (t / .32) % 1; tally(Math.min(n, 89), Math.round(kk * 6) / 6); cam(L3(V3(1.1, 1.72, -.05), V3(.98, 1.7, -.15), oc(t / t1)), V3(-1.3, 1.48, -1.22), 58);
    const F = V3(-.62, 0, -.42); return who('PRESO', { face: 'smug', mouth: 'smirk', browTilt: .45, look: [14, -2], armR: [118 + Math.sin(t * 20) * 6, 40], holdR: CHALK, armL: [12, 12] }, F); }
  setup(t + B[0].s, { light: IN, gold: .07, cash: .1 }); W.setVTile(1); whipBlur(t, t1); const u = t - t1; cam(L3(V3(11.25, 1.7, -.3), V3(11.1, 1.66, -.45), oc(u / (D - t1))), V3(8.4, .95, -3.2), 60);
  const vis = W.GOLD.filter(m => m.visible); let s = ''; if (vis.length) { const p = W.proj(vis[0].position); s += glint(p.x, p.y, 40, Math.abs(Math.sin(u * 4))); } return s; };

// =====================================================================================================
// 22 · FINAL — atardecer: coches de policía delante del banco · barrido al callejón: él, en su ventanita, saluda y guiña
// =====================================================================================================
S.final = (t, D, B) => { const E = EVS.final(B); setup(t + B[0].s, { mood: [1, 0], light: DUSK }); W.setPolice(true, t); const t1 = Math.max(1.0, (E.nadie || D * .45) - .15);
  if (t < t1) { cam(L3(V3(13.4, 1.85, 20.3), V3(13.6, 1.85, 19.8), oc(t / t1)), V3(14.6, 2.3, 11.0), 58);
    const L = [[V3(13.2, 0, 13.1), who('POLI1', { face: 'smug', mouth: 'line', armL: [10, 10], armR: [100, 60], look: [8, 0] }, V3(13.2, .12, 12.6))], [V3(17.2, 0, 12.4), who('POLI2', { face: 'smug', mouth: 'line', armL: [10, 10], armR: [10, 10], look: [-8, 0] }, V3(17.2, .12, 12.4))]];
    [[CR[0], 10.4, 12.4], [CR[3], 11.4, 12.0], [CR[6], 20.6, 12.2], [CR[1], 21.6, 12.6]].forEach(([c, x, z]) => L.push([V3(x, 0, z), who(c, { face: 'wide', mouth: 'o', look: [x > 15 ? -10 : 10, 0], armL: [20, 40], armR: [20, 40] }, V3(x, .12, z), ADULT, { blur: 2 })]));
    let s = depth(L); const ph = Math.floor(t * 6) % 2; s += `<rect width="1080" height="1920" fill="${ph ? '#3a5aff' : '#ff2a3a'}" opacity=".02"/>`; return s; }
  whipBlur(t, t1); const u = t - t1, tL = (E.lado || D * .9) - t1; cam(L3(V3(5.05, 1.86, -1.0), V3(4.8, 1.88, -1.15), oc(u / (D - t1))), V3(2.0, 1.96, -1.62), 54);
  let s = winClip(who('PRESO', { face: 'happy', mouth: 'smile', wink: u > tL - .1, look: [8, 0], armR: [160 + Math.sin(u * 10) * 14, 30], armL: [10, 10] }, F_WIN), 2.31) + winBars2d();
  const ph = Math.floor(t * 6) % 2; s += `<rect width="1080" height="1920" fill="${ph ? '#3a5aff' : '#ff2a3a'}" opacity=".03"/>`; if (u > tL - .1) { const h = headScr(F_WIN); s += glint(h.x + 80, h.y - 110, 28, eBack(clamp((u - tL + .1) / .25))); } return s; };

// =====================================================================================================
// 23 · BUCLE — vuelve el primer plano exacto (banquillo, orden sobre la barandilla) para enlazar con el principio
// =====================================================================================================
S.bucle = (t, D, B) => { setup(t + B[0].s, { light: IN }); cond(2, 1); W.setOrder(0, 0); const k = oc(clamp(t / D)); cam(L3(V3(JX + 2.0, 2.02, -5.15), CP_OF0, k), LK_OF, 50);
  return dockShot(t, { pose: { face: 'smug', mouth: 'line', look: [-8, 14], brows: -.2, armL: [26, 40], armR: [26, 40], headTilt: 4 } }); };

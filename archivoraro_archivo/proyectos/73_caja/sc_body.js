// =====================================================================================================
// 1 · GANCHO — Reg dentro de la caja (linterna) → la cámara se aleja: bodega, cabina con pasajeros → el avión sobre las nubes
// =====================================================================================================
const HY = W.HOLD_Y, FY = W.FLOOR_Y;
function pax(t) { const S1 = SITP(FY + .62, FY), L = [];
  [[1.35, 1.4, 'PAX1', { holdR: GLASS, armR: [60, 90] }], [.55, -1.6, 'PAX2', { holdR: GLASS, armR: [50, 100] }], [1.35, -4.6, 'PAX1', { hat: null, hair2: 'side', hairCol: '#5a3a22', top: '#5a4a3a', mustache: null }]].forEach(([x, z, n, o]) => {
    const F = V3(x, S1.y0, z); L.push([F, who(n, Object.assign({ legLen: S1.legLen, legL: S1.legL, legR: S1.legR, turn: .55, face: 'closed', mouth: 'smile', headTilt: Math.sin(t * 2 + x) * 3 }, o), F, ADULT, { shadow: false })]); }); return L; }
S.gancho = (t, D, B) => { setup(t + B[0].s, { mood: 'aire', fg: true, light: TORCHL }); SHAKE = .004;
  const K1 = [[0, V3(3.7, -1.5, 1.4)], [.9, V3(4.4, -1.35, 1.6)], [1.9, V3(9.5, .6, 3.2)], [3.1, V3(19, 4, 13)], [4.4, V3(32, 8.6, 37)], [6.5, V3(37, 10, 44)]];
  const K2 = [[0, V3(.35, -1.62, 1.0)], [.9, V3(.35, -1.6, 1.0)], [1.9, V3(.2, -1.2, 1)], [3.1, V3(0, -1.2, 0)], [4.4, V3(0, -1, 0)], [6.5, V3(-2, -1, -1)]];
  cam(sp(t, K1), sp(t, K2), lerp(36, 40, clamp(t / 2)), .0015);
  const L = [regInCrate(W.CR, { face: t < 1.6 ? 'wide' : 'smug', mouth: t < 1.6 ? 'o' : 'smile', look: [Math.sin(t * 3) * 6, 0] }, t + B[0].s)];
  let s = depth(L); if (t > 3.2) s += speedLines ? '' : ''; return s; };

// =====================================================================================================
// 2 · 63 HORAS. A OSCURAS — primer plano; la linterna parpadea y se apaga: solo quedan sus ojos
// =====================================================================================================
S.oscuras = (t, D, B) => { const E = EVS.oscuras(B); const tA = (E.a || D * .55) - .05; setup(t + B[0].s, { mood: 'aire', fg: true, light: TORCHL });
  const off = clamp((t - tA) / .35), fl = off > 0 && off < 1 ? (Math.sin(t * 60) > 0 ? 1 : .2) * (1 - off) : 1 - off; W.LIGHTS.torchL.intensity *= fl;
  cam(L3(V3(3.0, -1.35, 1.25), V3(2.6, -1.3, 1.2), oc(clamp(t / D))), V3(.35, -1.47, 1.0), 33, .003);
  const R = regInCrate(W.CR, { face: 'wide', mouth: t < tA ? 'line' : 'o', sweat: true, armL: [130, 40], look: [t < tA ? -12 : 0, t < tA ? 8 : -4] }, t + B[0].s, { on: fl });
  let s = R[1] + blackout(off); if (off > .98) { const h = R[2].ph, ss = R[2].s; s += darkEyes(h.x + 22 * ss, h.y - 10 * ss, ss, t); } return s; };

// =====================================================================================================
// 3 · LONDRES 1964 — sin un céntimo (cartera con polilla), la foto de su hija · «así que piensa»: cartel (£300) → buzón rojo → ¡idea!
// =====================================================================================================
S.londres = (t, D, B) => { const E = EVS.londres(B); setup(t + B[0].s, { mood: 'londres', light: FOG }); const t2 = B[1] ? B[1].s - B[0].s : D * .55;
  if (t < t2) { const k = clamp(t / (t2 - .2)), z = lerp(-17, -9.4, k), F = V3(-6.6, .16, z), tW = (E.sin || t2 * .45) - .1, tH = (E.cumpleanos || t2 * .7) - .25;
    cam(V3(-3.6, 1.75, z + 6.4), V3(-6.3, 1.45, z - 1), 40);
    const walking = t < tW; const pose = walking ? Object.assign({ face: 'open', mouth: 'line', hornSwing: 0 }, walkPose(t * 7, { amp: .8 })) : t < tH ? { face: 'wide', mouth: 'o', armR: [150, 20], holdR: WALLET, armL: [20, 10] } : { face: 'closed', mouth: 'sad', browTilt: -1, brows: .4, armR: [140, 30], holdR: PHOTO, armL: [30, 20], headTilt: -4 };
    let s = depth([P_('REG', pose, F)]); const h = headScr(F);
    if (t >= tW && t < tH) { const k2 = clamp((t - tW - .25) / 1.4); if (k2 > 0) { const mx = h.x + 120 + k2 * 260 + Math.sin(t * 18) * 20, my = h.y - 60 - k2 * 420; s += `<g transform="translate(${mx.toFixed(1)},${my.toFixed(1)})"><ellipse rx="10" ry="16" fill="#8a8478" stroke="${K}" stroke-width="4"/>` + [-1, 1].map(sd => `<path d="M0,-4 Q${sd * 34},${-30 + Math.sin(t * 40) * 14} ${sd * 30},6Z" fill="#b8b0a0" stroke="${K}" stroke-width="4"/>`).join('') + `</g>`; } }
    if (t >= tH) s += tears2d(F, t);
    return s; }
  const u = t - t2, D2 = D - t2, F = V3(-6.6, .16, -9.2), tP = (E.paquete || t2 + D2 * .75) - t2 - .15, tV = (E.volar || t2 + D2 * .35) - t2;
  whipBlur(t, t2); cam(L3(V3(-2.0, 1.65, -10.6), V3(-2.5, 1.8, -11.0), oc(clamp(u / D2))), V3(-7.0, 1.85, -8.9), 42, .002);
  const look = u < tV ? [-24, -10] : u < tP ? [-26, -8] : [22, 6], face = u < tP ? 'open' : 'smug', mouth = u < tP ? (u < tV ? 'line' : 'o') : 'smirk';
  let s = depth([P_('REG', { face, mouth, look, turn: u < tP ? -.35 : .35, armL: u >= tP ? [24, 40] : [14, 10], armR: u >= tP ? [130, 60] : [14, 10] }, F)]);
  const h = headScr(F); if (u > tV - .2 && u < tP) s += popIcon ? '' : ''; s += bulb(h.x + 40, h.y - 330, .9, (u - tP) / .5);
  return s; };

// =====================================================================================================
// 4 · EL TALLER — John clava la caja; Reg mete latas, linterna y dos botellas · «una para beber, la otra… mejor no preguntes»
// =====================================================================================================
S.taller = (t, D, B) => { const E = EVS.taller(B); setup(t + B[0].s, { mood: 'taller', light: IN }); W.CRT.userData.top.rotation.z = 1.95; const t2 = B[1] ? B[1].s - B[0].s : D * .55;
  const kids = W.SUPT.children; const tL = (E.latas || 1) - .05, tB = (E.botellas || t2 * .8) - .05; [0, 1, 2].forEach(i => kids[i].visible = t >= tL + i * .12); [3, 4].forEach((i, j) => kids[i].visible = t >= tB + j * .12);
  if (t < t2) { cam(L3(V3(6.6, 3.3, 7.6), V3(6.0, 3.1, 7.0), oc(clamp(t / t2))), V3(.1, 1.0, -.1), 38, .002);
    const tT = (E.linterna || t2 * .6) - .1, hold = t < tL ? null : t < tT ? null : t < tB ? TORCH : null;
    const sw = Math.sin(t * 9); const L = [P_('JOHN', { face: 'smug', mouth: 'line', armR: [100 + sw * 50, 40], holdR: HAMMER, turn: -.5 }, V3(1.2, 0, -.65)),
      P_('REG', { face: 'happy', mouth: 'smile', armR: [70 + Math.sin(t * 3) * 10, 50], holdR: hold, armL: [60, 40], turn: .5 }, V3(-.8, 0, 1.05))];
    let s = depth(L); const hp = W.proj(wp(W.CRT, .76, 1.2, -.3)); if (sw > .9) s += impact ? impact(hp.x, hp.y, 60, (sw - .9) * 10) : ''; return s; }
  const u = t - t2, D2 = D - t2, tO = (E.otra || t2 + D2 * .45) - t2 - .1;
  whipBlur(t, t2);
  if (u < tO) { cam(L3(V3(.55, 2.4, 1.0), V3(.45, 2.25, .85), oc(clamp(u / tO))), V3(-.3, .35, -.25), 30, .004); return ''; }
  whipBlur(t, t2 + tO); cam(L3(V3(.2, 1.95, 6.6), V3(.15, 1.9, 6.1), oc(clamp((u - tO) / (D2 - tO)))), V3(.1, 1.3, .3), 40, .003);
  return depth([P_('JOHN', { face: 'wide', mouth: 'o', brows: 1, look: [-14, 6], armR: [40, 120], armL: [20, 10], turn: -.3 }, V3(1.05, 0, 1.55)), P_('REG', { face: 'smug', mouth: 'smirk', look: [12, -4], armR: [150, -110], armL: [14, 10], turn: .3, sweat: true }, V3(-1.05, 0, 1.55))]); };

// =====================================================================================================
// 5 · ETIQUETA — «ZAPATOS» en plantilla (barrido por el lateral) → sello de PORTES DEBIDOS con golpe
// =====================================================================================================
S.etiqueta = (t, D, B) => { const E = EVS.etiqueta(B); setup(t + B[0].s, { mood: 'taller', light: IN }); W.CRT.userData.top.rotation.z = 0; const tP = (E.portes || D * .45) - .12;
  if (t < tP) { const k = oc(clamp(t / tP)); cam(V3(lerp(-.7, .6, k), .95, 3.7), V3(lerp(-.3, .4, k), .92, 1.1), 40, .003); return ''; }
  const u = t - tP; whipBlur(t, tP); cam(L3(V3(-.2, .95, -3.4), V3(0, .95, -3.2), oc(clamp(u / (D - tP)))), V3(-.1, .8, -.5), 40, .003);
  const hit = .35, k = u < hit ? u / hit : 1, lp = W.proj(wp(W.CRT, .05, .95, -.9)); SHAKE = u > hit && u < hit + .25 ? .03 * (1 - (u - hit) / .25) : 0;
  const y = lp.y - 40 - (1 - eIO2(clamp(k))) * 380; let s = `<g transform="translate(${lp.x.toFixed(1)},${y.toFixed(1)}) scale(2.4)">${STAMP}</g>` + hand2d(lp.x + 14, y - 300, 2.0, 0);
  if (u > hit) s += impact(lp.x, lp.y, 220, (u - hit) / .4); return s; };

// =====================================================================================================
// 6 · NIEBLA — un día entero en el almacén de Londres: el reloj de pared vuela, mozos «fantasma» pasan en cámara rápida
// =====================================================================================================
S.niebla = (t, D, B) => { setup(t + B[0].s, { mood: 'niebla', light: FOG }); W.ZG.almacen.userData.clock(8 + t * 6);
  cam(L3(V3(5.2, 2.3, 4.2), V3(3.4, 2.7, 5.4), oc(clamp(t / D))), V3(.2, 1.6, -2.6), 42, .002);
  const L = []; for (let i = 0; i < 4; i++) { const k = ((t * .9 + i * .27) % 1), x = lerp(-7, 7, k) * (i % 2 ? 1 : -1), F = V3(x, 0, -4.5 - i * 1.6);
    L.push([F, `<g opacity=".45">${who('LONDON', Object.assign({ face: 'open', mouth: 'line', turn: i % 2 ? .6 : -.6 }, walkPose(t * 14 + i, { amp: 1 })), F, ADULT, { shadow: false })}</g>`]); }
  // los mozos «fantasma» pasan POR DETRÁS de la caja: se tapan con una máscara del contorno de la caja en pantalla
  const pts = []; for (const x of [-.8, .8]) for (const y of [0, 1.85]) for (const z of [-.86, .86]) pts.push(W.proj(wp(W.CRA, x, y, z)));
  const x0 = Math.min(...pts.map(p => p.x)), x1 = Math.max(...pts.map(p => p.x)), y0 = Math.min(...pts.map(p => p.y)), y1 = Math.max(...pts.map(p => p.y));
  const ghosts = `<defs><mask id="mcr"><rect width="1080" height="1920" fill="#fff"/><rect x="${x0.toFixed(0)}" y="${y0.toFixed(0)}" width="${(x1 - x0).toFixed(0)}" height="${(y1 - y0 + 400).toFixed(0)}" fill="#000"/></mask></defs><g mask="url(#mcr)">${depth(L)}</g>`;
  return ghosts + `<rect width="1080" height="1920" fill="#c8d0dc" opacity="${(.08 + .05 * Math.sin(t * 8)).toFixed(3)}"/>`; };

// =====================================================================================================
// 7 · DESPEGA → ESCALA AL SOL — el avión sube entre nubes · «y en una escala…»: la caja sola en el carro, en la pista de Bombay
// =====================================================================================================
S.despega = (t, D, B) => { const E = EVS.despega(B); const tE = (E.y || D * .42) - .05;
  if (t < tE) { setup(t + B[0].s, { mood: 'aire', light: DAY }); const k = oc(clamp(t / tE)); cam(V3(lerp(28, 22, k), lerp(-20, -12, k), lerp(-62, -44, k)), V3(0, lerp(-3, 1, k), 2), 44, .0012); SHAKE = .01; return speedLines(540, 960, 1.2, (t * 1.5) % 1); }
  const u = t - tE; setup(t + B[0].s, { mood: 'pista', light: HOT }); whipBlur(t, tE);
  cam(L3(V3(5.6, 1.9, 6.4), V3(4.6, 1.7, 5.0), oc(clamp(u / (D - tE)))), V3(.1, 1.15, 0), 42, .002);
  return heatOverlay(.6, t) + `<circle cx="900" cy="160" r="140" fill="#fff8d0" opacity=".35" style="filter:blur(30px)"/>`; };

// =====================================================================================================
// 8 · SE CUECE — dentro de la caja al sol: linterna apagada, rayas de luz entre tablas, vapor y calor
// =====================================================================================================
S.cuece = (t, D, B) => { setup(t + B[0].s, { mood: 'aire', fg: true, light: HOT }); W.LIGHTS.torchL.intensity = 9; W.LIGHTS.torchL.color.set('#ff8a3a'); SHAKE = .002;
  cam(L3(V3(3.3, -1.45, 1.3), V3(2.8, -1.42, 1.2), oc(clamp(t / D))), V3(.35, -1.55, 1.0), 34, .003);
  const R = regInCrate(W.CR, { face: 'wide', mouth: 'o', sweat: true, armL: [120, 60], armR: [110, 70], headTilt: Math.sin(t * 6) * 4 }, t + B[0].s, { torch: false }); const h = R[2].ph, q = R[2].q;
  let s = R[1] + steam(h.x - 40, h.y - q * .35, q * .006, t) + steam(h.x + 50, h.y - q * .3, q * .006, t + .4) + heatOverlay(1, t);
  for (let i = 0; i < 4; i++) s += `<path d="M${(h.x - 400 + i * 220).toFixed(0)},0 L${(h.x - 300 + i * 220).toFixed(0)},0 L${(h.x - 80 + i * 220).toFixed(0)},1920 L${(h.x - 180 + i * 220).toFixed(0)},1920Z" fill="#fff0b0" opacity=".12"/>`;
  return s; };

// =====================================================================================================
// 9 · LA TAPA — la tapa se levanta un dedo (ojos en la rendija) · «un paquete que sale andando»: la caja anda con piernas y el de pista alucina
// =====================================================================================================
S.tapa = (t, D, B) => { const E = EVS.tapa(B); setup(t + B[0].s, { mood: 'pista', light: HOT }); const tW = (E.pero || D * .35) - .05;
  if (t < tW) { const k = clamp((t - .3) / .6); W.CRP.userData.top.rotation.z = .2 * eIO2(k); cam(L3(V3(3.2, 2.3, 2.0), V3(2.8, 2.2, 1.6), oc(clamp(t / tW))), V3(.6, 2.15, 0), 34, .003);
    const g = W.proj(wp(W.CRP, .65, 1.82, 0)); return heatOverlay(.5, t) + (k > .3 ? darkEyes(g.x, g.y + 6, .9, t + 1) : ''); }
  const u = t - tW; whipBlur(t, tW); const kx = clamp(u / (D - tW - .6)), x = lerp(.1, 4.2, kx), stp = Math.sin(u * 12), bob = Math.abs(stp) * .05;
  W.CRP.position.set(x, .55 + bob, .2); W.CRP.rotation.z = stp * .03;
  cam(V3(4.5, 1.7, 7.4), V3(2.4, .9, .2), 42, .002);
  const legs = [-1, 1].map(sd => { const hip = W.proj(wp(W.CRP, 0, 0, sd * .38)), lift = Math.max(0, sd * stp) * .2, ft = W.proj(V3(x + sd * stp * .18, lift, .2 + sd * .38)), q = Math.abs(hip.y - ft.y) / .55;
    return `<path d="M${hip.x.toFixed(1)},${hip.y.toFixed(1)} Q${((hip.x + ft.x) / 2 + 12).toFixed(1)},${((hip.y + ft.y) / 2).toFixed(1)} ${ft.x.toFixed(1)},${ft.y.toFixed(1)}" stroke="${K}" stroke-width="${(q * .07).toFixed(1)}" fill="none" stroke-linecap="round"/><ellipse cx="${(ft.x + q * .05).toFixed(1)}" cy="${ft.y.toFixed(1)}" rx="${(q * .1).toFixed(1)}" ry="${(q * .045).toFixed(1)}" fill="#4a2e1c" stroke="${K}" stroke-width="5"/>`; }).join('');
  const WF = V3(5.6, 0, -1.6), surprised = u > .4;
  let s = legs + depth([P_('PISTA', { face: surprised ? 'wide' : 'open', mouth: surprised ? 'o' : 'line', armR: surprised ? [150, 30] : [30, 60], holdR: surprised ? null : CLIP, armL: [20, 10], turn: -.6, look: [-16, 6], hatLift: surprised ? 40 : 0 }, WF)]);
  if (surprised && u < 1.6) { const h = headScr(WF); s += `<g transform="translate(${(h.x + 80 + (u - .4) * 200).toFixed(1)},${(h.y - (u - .4) * 300 + (u - .4) * (u - .4) * 400).toFixed(1)}) rotate(${((u - .4) * 400).toFixed(0)}) scale(1.6)">${CLIP}</g>`; }
  return heatOverlay(.5, t) + s; };

// =====================================================================================================
// 10 · AGUANTA — primer plano, dientes apretados, empujón de cámara
// =====================================================================================================
S.aguanta = (t, D, B) => { setup(t + B[0].s, { mood: 'aire', fg: true, light: HOT }); W.LIGHTS.torchL.intensity = 7; W.LIGHTS.torchL.color.set('#ff9a4a'); SHAKE = t < .25 ? .02 : .003;
  cam(V3(2.7, -1.36, 1.22), V3(.35, -1.42, 1.0), lerp(30, 25, oc(clamp(t / D))), .004);
  const R = regInCrate(W.CR, { face: 'angry', mouth: 'line', sweat: true, brows: -.9, armL: [30, 60], armR: [30, 60] }, t + B[0].s, { torch: false });
  return R[1] + heatOverlay(.6, t) + tension(R[2].ph.x, R[2].ph.y, R[2].q * .55, t); };

// =====================================================================================================
// 11 · PERTH — dos trabajadores australianos (pantalón corto y calcetines altos) cargan la caja maldiciendo; fuera, eucaliptos y la señal de canguros
// =====================================================================================================
S.perth = (t, D, B) => { const E = EVS.perth(B); setup(t + B[0].s, { mood: 'perth', light: DUSK }); const lift = .18 + Math.sin(t * 3) * .05;
  W.CRA.position.set(.1, .51 + lift, 0); W.CRA.rotation.z = Math.sin(t * 2.2) * .05;
  cam(L3(V3(5.4, 2.2, 5.8), V3(4.6, 2.0, 5.0), oc(clamp(t / D))), V3(.6, 1.3, -1.6), 42, .002);
  const strain = { face: 'angry', mouth: 'open', sweat: true, armL: [150, 20], armR: [150, 20] };
  const A1 = V3(-.75, 0, -.6), A2 = V3(2.1, 0, -.4), L = [P_('AUSSIE1', Object.assign({}, strain, { turn: .5, mouth: talkM(t, .2, D, 'open') }), A1), P_('AUSSIE2', Object.assign({}, strain, { turn: -.5, mouth: talkM(t + .5, .6, D, 'open') }), A2)];
  let s = depth(L); const h1 = headScr(A1), h2 = headScr(A2); s += grawlix(h1.x - 40, h1.y - 230, .9, t, ((t - .2) % 1.4) / 1.1) + grawlix(h2.x + 30, h2.y - 250, .9, t + 3, ((t - .9) % 1.4) / 1.1);
  return s; };

// =====================================================================================================
// 12 · ESTÁ EN CASA — alivio dentro de la caja
// =====================================================================================================
S.encasa = (t, D, B) => { setup(t + B[0].s, { mood: 'aire', fg: true, light: TORCHL }); W.LIGHTS.torchL.intensity *= .8;
  cam(L3(V3(3.0, -1.38, 1.3), V3(2.7, -1.36, 1.25), oc(clamp(t / D))), V3(.35, -1.5, 1.0), 33, .003);
  const R = regInCrate(W.CR, { face: 'closed', mouth: 'smile', sweat: false, armL: [20, 10], armR: [62, 70] }, t + B[0].s);
  return R[1] + sparks(R[2].ph.x + 150, R[2].ph.y - 120, 1.2, t) + sparks(R[2].ph.x - 170, R[2].ph.y - 60, 1, t + .3); };

// =====================================================================================================
// 13 · SALE COMO SI NADA — almacén de Perth de noche: la tapa se abre, Reg sale de puntillas y se va silbando delante del vigilante dormido
// =====================================================================================================
S.sale = (t, D, B) => { const E = EVS.sale(B); setup(t + B[0].s, { mood: 'noche', light: NIGHT }); const tY = (E.y || D * .5) - .1;
  W.CRA.userData.top.rotation.z = 1.7 * eIO2(clamp(t / .8));
  cam(L3(V3(5.6, 2.3, 4.4), V3(5.0, 2.1, 3.4), oc(clamp(t / D))), V3(.4, 1.2, -5), 44, .002);
  const G = V3(-3.4, 0, -11.2), L = [P_('VIGILANTE', { face: 'closed', mouth: 'line', headTilt: 14, armL: [14, 10], armR: [14, 10] }, G)];
  let s = '';
  if (t < tY) { const k = clamp((t - .5) / (tY - .5)), F = V3(lerp(.7, 2.4, eIO2(k)), lerp(.58, 0, clamp(k * 2 - .4)), lerp(-1, .6, k)); L.push(P_('REG', Object.assign({ face: 'smug', mouth: 'line', look: [-12, 0], armL: [60, 60], armR: [60, 60] }, walkPose(t * 6, { amp: .6 })), F)); }
  else { const u = t - tY, F = V3(lerp(2.4, -.6, clamp(u / (D - tY))), 0, lerp(.6, -7, clamp(u / (D - tY)))); L.push(P_('REG', Object.assign({ view: 'back', face: 'happy', mouth: 'smile' }, walkPose(t * 7, { amp: .9 })), F)); const h = headScr(F); s += notes ? notes(h.x + 60, h.y - 80, 1, t) : ''; }
  s = depth(L) + s; const g = headScr(G); s += zzz(g.x + 40, g.y - 110, 1.1, t); return s; };

// =====================================================================================================
// 14 · CUMPLEAÑOS — entra por la puerta y su hija salta a abrazarle; confeti
// =====================================================================================================
S.cumple = (t, D, B) => { setup(t + B[0].s, { mood: 'casa', light: IN }); W.ZG.casa.userData.door.rotation.y = -1.4 * eIO2(clamp(t / .6));
  cam(L3(V3(-.8, 1.7, 5.6), V3(-.4, 1.7, 5.2), oc(clamp(t / D))), V3(2.0, 1.15, .7), 46, .002);
  const jump = Math.abs(Math.sin(t * 7)) * .35 * (t > .4 ? 1 : 0), RF = V3(lerp(4.4, 2.6, clamp(t / .7)), 0, 1.2), HF = V3(1.5, jump, 1.1);
  const L = [P_('REG', { face: 'happy', mouth: 'open', armL: [120, 30], armR: [120, 30], turn: -.4 }, RF), [HF, who('HIJA', { face: 'happy', mouth: 'laugh', armL: [150, 20], armR: [150, 20], turn: .4 }, HF, 1.18)]];
  return depth(L) + confetti(t, clamp((t - .3) / 1.6)); };

// =====================================================================================================
// 15 · LA FACTURA — el cartero trae el sobre; primer plano de la factura · «muy educado, dice que no la paga»: la convierte en avión de papel y la lanza
// =====================================================================================================
S.factura = (t, D, B) => { const E = EVS.factura(B); setup(t + B[0].s, { mood: 'casa', light: IN }); W.ZG.casa.userData.door.rotation.y = -1.3; const t2 = B[1] ? B[1].s - B[0].s : D * .55, tF = (E.factura || t2 * .6) - .15;
  cam(L3(V3(-1.8, 1.8, 6.2), V3(-1.4, 1.8, 5.8), oc(clamp(t / D))), V3(3.9, 1.3, 1.8), 40, .002);
  const RF = V3(3.1, 0, 1.4), CF = V3(5.1, 0, 2.6); let s = '';
  if (t < t2) { const got = t > 1.0; const L = [P_('CARTERO', { face: 'open', mouth: talkM(t, .2, 1.2, 'smile'), armR: got ? [14, 10] : [80, 20], holdR: got ? null : ENVEL, turn: -.5 }, CF), P_('REG', { face: got ? 'wide' : 'open', mouth: got ? 'o' : 'smile', armR: got ? [120, 50] : [20, 10], holdR: got ? PAPER2 : null, turn: .4 }, RF)];
    s = depth(L) + invoice2d(540, 860, 1.05, (t - tF) / .35); return s; }
  const u = t - t2, tPl = .9; const L = [P_('CARTERO', { face: u > tPl + .3 ? 'wide' : 'open', mouth: u > tPl + .3 ? 'o' : 'line', armR: [14, 10], turn: -.5, look: [-20, -10] }, CF), P_('REG', { face: 'happy', mouth: 'smile', brows: .3, armR: u < tPl ? [120, 50] : [160, -20], holdR: u < tPl ? PAPER2 : null, turn: .5, headTilt: -6 }, RF)];
  s = depth(L); if (u > tPl) { const k = (u - tPl) / 1.4, h = headScr(RF); s += paperPlane(h.x + 120 - k * 900, h.y - 200 - k * 380 + Math.sin(k * 9) * 40, 1.5, -18 + Math.sin(k * 9) * 10); }
  return s; };

// =====================================================================================================
// 16 · BUCLE — en el taller, desde arriba: Reg saluda dentro de la caja y la tapa se cierra → negro (vuelve al gancho)
// =====================================================================================================
S.bucle = (t, D, B) => { setup(t + B[0].s, { mood: 'taller', light: IN }); const k = clamp((t - .15) / (D - .15)); W.CRT.userData.top.rotation.z = 1.95 * (1 - eIO2(clamp((k - .25) / .75)));
  cam(V3(3.4, 2.3, 1.2), V3(.1, 1.45, .3), lerp(40, 36, k), .002);
  const duck = eIO2(clamp((k - .2) / .55)), F = wp(W.CRT, -.15, .07 - duck * 1.15, 0), rim = W.proj(wp(W.CRT, .78, 1.78, 0)).y;
  const s = clipAbove(who('REG', { face: 'happy', mouth: 'smile', armL: [150, 20 + Math.sin(t * 10) * 30], armR: [14, 10], turn: .2 }, F, ADULT, { shadow: false }), rim);
  return s + blackout(clamp((k - .82) / .18)); };

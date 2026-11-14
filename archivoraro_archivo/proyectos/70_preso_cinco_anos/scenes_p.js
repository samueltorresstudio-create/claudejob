// «El preso que pidió cinco años más» (70) — ESTILO 3D: world_carcel.js + personajes 2D (cast70.js) + efectos (fx70.js).
// Un plano por frase y planos internos con barrido cuando la frase cambia de sitio. Cámara siempre en movimiento, pose a pose,
// textos solo dentro del mundo (orden de libertad, contador de condena, carteles, libro de cuentas, calendario, «BANCO» pintado).
window.CFG = { capY: 1500, capSize: 96, transDur: .42, blurK: .35, antic: .1, blurChars: false,
  transDurBy: { suplica: .34, risa: .34, cinco: .2, bucle: .5 },
  trans: { suplica: 'whip', risa: 'swish', juez: 'whip', cinco: 'cut', feliz: 'swish', modelo: 'swish', ventana: 'swish', ruido: 'swish', registro: 'swish', nada: 'cut', banco: 'swish',
    lunes: 'swish', lingote: 'swish', pistas: 'swish', director: 'whip', tunel: 'swish', debajo: 'glide', noche: 'swish', salir: 'swish', vaciar: 'swish', final: 'swish', bucle: 'swish' } };
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { const ws = l.cap.split(' ').map(w => norm(w.split('|')[0])); EVS[l.sc] = B => { const o = {}; ws.forEach((w, i) => { const k = /^[0-9]/.test(w) ? '_' + w : w; if (k && !(k in o)) o[k] = B[0].w[i]; }); o._last = B[0].w[ws.length - 1]; return o; }; });
const S = {}, W = W2, JX = W.JX, KX = W.KX, C = window.CAST70, CR = window.CROWD70;
window.READY = Promise.resolve();
// ---------- cámara (deriva de cámara en mano + sacudida) ----------
let SHAKE = 0;
{ const _sc = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * 4.59) * .5 + Math.sin(T * 8.61) * .3, Math.sin(T * 5.3 + 1) * .5 + Math.sin(T * 9.7) * .25, 0).multiplyScalar(.012 * p.distanceTo(l) / 8);
  const sh = SHAKE > 0 ? V3(Math.sin(T * 91) * SHAKE, Math.sin(T * 77 + 2) * SHAKE, 0) : V3(0, 0, 0); return _sc(p.clone().add(d).add(sh), l.clone().add(d.multiplyScalar(.35)).add(sh.multiplyScalar(.6)), f, fo, ap); }; }
const cam = (p, l, f = 40, ap = .0022) => { W.setCam(p, l, f, p.distanceTo(l), ap); W.render(); };
const pushIn = (p0, tg, k, factor = 1.25) => tg.clone().add(p0.clone().sub(tg).divideScalar(lerp(1, factor, oc(k))));
function sp(t, Ks) { const n = Ks.length; if (t <= Ks[0][0]) return Ks[0][1].clone(); if (t >= Ks[n - 1][0]) return Ks[n - 1][1].clone(); let i = 0; while (t > Ks[i + 1][0]) i++;
  const u = (t - Ks[i][0]) / (Ks[i + 1][0] - Ks[i][0]), a = Ks[Math.max(0, i - 1)][1], b = Ks[i][1], c = Ks[i + 1][1], d = Ks[Math.min(n - 1, i + 2)][1], u2 = u * u, u3 = u2 * u;
  const f = (p0, p1, p2, p3) => .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); return V3(f(a.x, b.x, c.x, d.x), f(a.y, b.y, c.y, d.y), f(a.z, b.z, c.z, d.z)); }
// cambio de plano DENTRO de una escena: barrido horizontal con desenfoque
function whipBlur(t, t0, dur = .22) { const k = clamp((t - t0 + dur / 2) / dur); if (k > 0 && k < 1 && typeof TR !== 'undefined' && TR) TR.blur('H', Math.sin(Math.PI * k) * 26); }
// estado del mundo por escena (solo se redibujan los lienzos que cambian)
const memo = f => { let last = null; return (...a) => { const k = JSON.stringify(a); if (k !== last) { last = k; f(...a); } }; };
const clk = memo((h, m) => W.setClocks(h, m)), tally = memo((n, k) => W.setTally(n, k)), ledger = memo((a, b, c) => W.setLedger(a, b, c)), calk = memo((k, r) => W.setCal(k, r)), cond = memo((n, k) => W.setCondena(n, k));
function setup(T, o = {}) { W.setTime(T); W.setSection(!!o.section); W.setMood(...(o.mood || [0, 0])); W.setCellDoor(o.door ?? 0); W.setMattress(0); W.setMess(false); W.setCellLid(1); W.setVTile(0); W.setVaultDoor(0);
  W.setGold(o.gold ?? 1, o.cash ?? 1); W.setCoffee(0, T); W.setPolice(false); W.setLantern(null); W.setGlint(null); W.charLight = o.light || DAY; SHAKE = 0; clk(...(o.clock || [10, 10])); W.CASH.forEach(m => { if (m.userData.hide) m.visible = false; }); }
// dibuja una lista de [puntoAncla, svg] de lejos a cerca
const depth = L => L.filter(x => x && x[1]).map(([p, s]) => [W.camera.position.distanceTo(p), s]).sort((a, b) => b[0] - a[0]).map(x => x[1]).join('');
// barrotes 2D de la puerta de una celda (cx), delante de quien está dentro; k = puerta abierta (0..1); y0 = piso
function bars2d(cx, k = 0, y0 = 0, opt = {}) { let s = ''; const bar = (a, b, w) => { const A = W.proj(a), Bp = W.proj(b); if (!A.ok || !Bp.ok) return ''; const px = Math.max(2.5, w * (A.ppm + Bp.ppm) / 2);
    return `<path d="M${A.x.toFixed(1)},${A.y.toFixed(1)} L${Bp.x.toFixed(1)},${Bp.y.toFixed(1)}" stroke="#14161c" stroke-width="${(px + 3).toFixed(1)}" stroke-linecap="butt"/><path d="M${A.x.toFixed(1)},${A.y.toFixed(1)} L${Bp.x.toFixed(1)},${Bp.y.toFixed(1)}" stroke="#3a3f48" stroke-width="${px.toFixed(1)}"/><path d="M${(A.x - px * .2).toFixed(1)},${A.y.toFixed(1)} L${(Bp.x - px * .2).toFixed(1)},${Bp.y.toFixed(1)}" stroke="#8a93a0" stroke-width="${(px * .18).toFixed(1)}" opacity=".7"/>`; };
  for (let x = -1.42; x <= -.05; x += .17) s += bar(V3(cx + x, y0 + .08, 0), V3(cx + x, y0 + 2.72, 0), .056);
  const dx = -1.3 * k; for (let x = .04; x <= 1.42; x += .17) s += bar(V3(cx + x + dx, y0 + .16, .09), V3(cx + x + dx, y0 + 2.64, .09), .056);
  [[.05, .1], [1.29, .08], [2.75, .1]].forEach(([y, w]) => { s += bar(V3(cx - 1.5, y0 + y, 0), V3(cx, y0 + y, 0), w); s += bar(V3(cx - .04 + dx, y0 + y, .09), V3(cx + 1.46 + dx, y0 + y, .09), w); });
  return s; }
// barrotes 2D de la ventanita (vista desde fuera o desde dentro)
function winBars2d() { let s = ''; const bar = (a, b, w) => { const A = W.proj(a), Bp = W.proj(b); if (!A.ok || !Bp.ok) return ''; const px = Math.max(2.5, w * (A.ppm + Bp.ppm) / 2); return `<path d="M${A.x.toFixed(1)},${A.y.toFixed(1)} L${Bp.x.toFixed(1)},${Bp.y.toFixed(1)}" stroke="#14161c" stroke-width="${(px + 3).toFixed(1)}"/><path d="M${A.x.toFixed(1)},${A.y.toFixed(1)} L${Bp.x.toFixed(1)},${Bp.y.toFixed(1)}" stroke="#3a3f48" stroke-width="${px.toFixed(1)}"/>`; };
  for (let k = 0; k < 4; k++) { const z = -1.93 + k * .22; s += bar(V3(1.9, 1.45, z), V3(1.9, 2.45, z), .048); } s += bar(V3(1.9, 1.95, -2.15), V3(1.9, 1.95, -1.05), .048); return s; }
// recorte a la ventanita (polígono proyectado del hueco en la cara x = xf)
let _wc = 0; function winClip(svg, xf = 2.3) { const P = [[-2.15, 1.45], [-1.05, 1.45], [-1.05, 2.45], [-2.15, 2.45]].map(([z, y]) => W.proj(V3(xf, y, z))); const id = 'wc' + (++_wc);
  return `<defs><clipPath id="${id}"><path d="M${P.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' L')}Z"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }
// colorete
const blush = (h, s) => [-1, 1].map(sd => `<ellipse cx="${(h.x + sd * 56 * s).toFixed(1)}" cy="${(h.y + 30 * s).toFixed(1)}" rx="${(18 * s).toFixed(1)}" ry="${(10 * s).toFixed(1)}" fill="#ff7a9a" opacity=".6"/>`).join('');
const sOf = (F, h = ADULT) => { const a = W.proj(F), b = W.proj(V3(F.x, F.y + h, F.z)); return Math.hypot(b.x - a.x, b.y - a.y) / 462; };
// libro / objeto 2D que vuela (registro)
function flyBook(x0, y0, x1, y1, k, s, col, spin) { if (k <= 0 || k >= 1) return ''; const x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(Math.PI * k) * 160 * s; return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(k * spin).toFixed(0)}) scale(${s.toFixed(2)})"><rect x="-34" y="-24" width="68" height="48" rx="4" fill="${col}" stroke="${K}" stroke-width="6"/><path d="M-26,-24 L-26,24" stroke="#fff" stroke-width="5" opacity=".6"/></g>`; }

// =====================================================================================================
// 1 · OFERTA — el preso en el banquillo, aburrido; la orden de libertad sube hasta la cámara y se subraya «LIBERTAD»
// =====================================================================================================
const F_DOCK = V3(JX + 3.38, .12, -1.62), CP_OF0 = V3(JX + 2.28, 1.92, -4.55), LK_OF = V3(JX + 3.3, 1.42, -1.6);
function dockShot(t, o = {}) { const E = o.E || {}; const top = W.proj(V3(F_DOCK.x, 1.05, -2.3)).y;
  let s = who(C.RISA, { face: 'smug', mouth: 'line', legLen: .5 }, V3(JX + 2.0, 0, 2.25), 1.72) + who(CR[1], { legLen: .5, look: [-6, 0] }, V3(JX + 4.4, 0, 2.25), 1.72) + who(CR[3], { legLen: .5 }, V3(JX + 3.1, 0, 3.55), 1.72) + who(CR[5], { legLen: .5 }, V3(JX + 5.4, 0, 3.55), 1.72);
  s += who('PACO', { armL: [8, 10], armR: [8, 10], look: o.pacoLook || [-10, 0], face: o.pacoFace || 'smug', mouth: o.pacoMouth || 'line' }, V3(JX + 4.78, 0, -1.25));
  s += clipAbove(who('PRESO', o.pose, F_DOCK), top); return s; }
S.oferta = (t, D, B) => { const E = EVS.oferta(B); setup(t + B[0].s, { light: IN }); cond(2, 1);
  const kL = E.libertad, k = clamp((t - kL + .25) / .55), cp = L3(CP_OF0, V3(JX + 2.5, 1.84, -4.05), oc(t / D)), lk = LK_OF.clone();
  // la orden: sube del pasamanos a delante de la cámara (abajo a la izquierda, para que la cara siga a la vista)
  const hl = clamp((t - E.libertad - .1) / .5); W.setOrder(0, hl);
  if (k > 0) { const fw = lk.clone().sub(cp).normalize(), rt = fw.clone().cross(V3(0, 1, 0)).normalize(), up = rt.clone().cross(fw).normalize(); const tgt = cp.clone().addScaledVector(fw, .82).addScaledVector(rt, -.07).addScaledVector(up, -.16);
    const e = eOut(k), O = W.ORDER, p0 = V3(JX + 3.05, 1.09, -2.27); O.position.copy(p0).lerp(tgt, e); O.position.y += Math.sin(Math.PI * e) * .22; const q0 = O.quaternion.clone(); const m = new THREE.Matrix4().lookAt(tgt, cp, V3(0, 1, 0)); const q1 = new THREE.Quaternion().setFromRotationMatrix(m); q1.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, .06))); O.quaternion.copy(q0).slerp(q1, e); }
  const pose = seq(t, [[0, { face: 'smug', mouth: 'line', look: [-8, 14], brows: -.2, armL: [22, 6], armR: [22, 6], headTilt: 4 }], [kL - .05, { face: 'wide', mouth: 'o', look: [-14, 6], brows: .8, armL: [34, 30], armR: [34, 30], headTilt: -3 }, .18], [E.tiempo || kL + 1, { face: 'wide', mouth: 'o', browTilt: -.7, brows: .4, look: [-10, 10], sweat: true }, .3]]);
  cam(cp, lk, 50); let s = dockShot(t, { pose, pacoLook: t > kL ? [-14, 4] : [-10, 0] }); const h = headScr(F_DOCK.clone()); if (t > kL && t < kL + .5) s += popIcon('!', h.x + 95, h.y - 150, 110, (t - kL) / .3); return s; };

// =====================================================================================================
// 2 · SUPLICA — llora y suplica agarrado a la barandilla (plano desde el juez); el juez le mira por encima de las gafas
// =====================================================================================================
S.suplica = (t, D, B) => { const E = EVS.suplica(B); setup(t + B[0].s, { light: IN }); W.setOrder(0, 1); cond(2, 1); const tJ = Math.max(.9, (E.juez || D * .45) - .05);
  if (t < tJ) { const cp = L3(V3(JX + 1.25, 1.85, -4.35), V3(JX + 1.6, 1.82, -4.0), oc(t / tJ)); cam(cp, V3(JX + 3.4, 1.62, -1.6), 46);
    const pose = { face: 'happy', mouth: talkM(t, .1, tJ, 'open'), browTilt: -.9, brows: .2, lean: -6, armL: [128, 128], armR: [128, 128], headTilt: Math.sin(t * 9) * 3, look: [-6, -4] }; let s = dockShot(t, { pose, pacoLook: [-14, 0], pacoFace: 'smug', pacoMouth: 'line' });
    const h = headScr(F_DOCK), sc = sOf(F_DOCK); s += tears(h, sc, t); return s; }
  whipBlur(t, tJ); const u = t - tJ; cam(L3(V3(JX + .42, 2.12, -3.05), V3(JX + .3, 2.1, -3.45), oc(u / (D - tJ))), V3(JX, 2.05, -5.95), 40);
  const top = W.proj(V3(JX, 1.84, -4.46)).y; const F = V3(JX, .62, -5.95); const pose = seq(u, [[0, { face: 'smug', mouth: 'line', look: [10, 12], brows: -.2, browTilt: .3, legLen: .7, armL: [16, 30], armR: [16, 30] }], [.5, { browTilt: -.4, brows: .7, look: [14, 10], sweat: true }, .25]]);
  return clipAbove(who('JUEZ', pose, F, 1.52), top); };

// =====================================================================================================
// 3 · RISA — una del público aguanta la risa… y revienta; barrido a toda la sala riéndose bajo el cartel «SILENCIO»
// =====================================================================================================
const PUB = [[4.8, 2.4, 6], [4.8, 4.0, 7], [4.8, 5.6, 4], [3.5, 1.6, 2], [3.5, 3.1, 3], [3.5, 4.7, 0], [2.2, 3.6, 1], [2.2, 5.2, 5]];
S.risa = (t, D, B) => { const E = EVS.risa(B); setup(t + B[0].s, { light: IN }); const tB = E.partio || D * .45, tW = Math.max(tB + .45, (E.risa || D * .8) - .12);
  const F = V3(JX + 2.0, 0, 2.28);
  if (t < tW) { cam(L3(V3(JX + 1.7, 1.52, .15), V3(JX + 1.8, 1.5, .45), oc(t / tW)), V3(JX + 2.0, 1.38, 2.3), 46);
    const pose = seq(t, [[0, { face: 'happy', mouth: 'line', legLen: .5, armR: [150, 118], armL: [20, 30], headTilt: -3, brows: .3 }], [tB, { mouth: 'laugh', armR: [40, 110], armL: [40, 110], headTilt: 10, brows: .8 }, .16]]);
    const back = PUB.slice(0, 6).map(([z, x, i]) => [V3(JX + x, 1, z), who(CR[i], { face: t > tB ? 'happy' : 'smug', mouth: t > tB + .15 ? 'laugh' : 'line', legLen: .5, armL: [30, 80], armR: [30, 80] }, V3(JX + x, 0, z + .05), 1.72, { blur: 4 })]);
    let s = depth(back) + who(C.RISA, pose, F, 1.72); const h = headScr(F, 1.72), sc = sOf(F, 1.72); s += blush(h, sc); if (t > tB) { SHAKE = .02 * Math.exp(-(t - tB) * 4); s += impact(h.x + 230 * sc * 2.2, h.y - 170 * sc * 2.2, 90, (t - tB) / .3); } return s; }
  whipBlur(t, tW); const u = t - tW; cam(L3(V3(JX + .55, 1.75, -.55), V3(JX + .7, 1.85, -.2), oc(u / (D - tW))), V3(JX + 4.3, 2.05, 3.6), 58); SHAKE = .012;
  const L = PUB.map(([z, x, i], j) => { const b = Math.abs(Math.sin((t + j * .37) * 11)) * .05; return [V3(JX + x, 1, z), who(CR[i], { face: 'happy', mouth: 'laugh', legLen: .5, armL: [40 + 20 * Math.sin(t * 9 + j), 100], armR: [40, 110], headTilt: 8 * Math.sin(t * 7 + j) }, V3(JX + x, b, z + .05), 1.72)]; });
  L.push([V3(F.x, 1, F.z), who(C.RISA, { face: 'happy', mouth: 'laugh', legLen: .5, armR: [40, 110], armL: [40, 110], headTilt: 12 + 4 * Math.sin(t * 9) }, V3(F.x, Math.abs(Math.sin(t * 10)) * .05, F.z), 1.72)]); return depth(L); };

// =====================================================================================================
// 4 · JUEZ — se encoge de hombros (manos arriba) delante del escudo
// =====================================================================================================
S.juez = (t, D, B) => { const E = EVS.juez(B); setup(t + B[0].s, { light: IN }); cond(2, 1); cam(L3(V3(JX + .3, 2.08, -2.75), V3(JX + .26, 2.06, -3.15), oc(t / D)), V3(JX, 2.12, -5.95), 40);
  const tS = E.encogio || D * .5; const top = W.proj(V3(JX, 1.84, -4.46)).y, F = V3(JX, .62, -5.95);
  const pose = seq(t, [[0, { face: 'smug', mouth: 'line', look: [6, 8], legLen: .7, armL: [16, 30], armR: [16, 30], brows: 0 }], [tS - .08, { armL: [62, 92], armR: [62, 92], brows: .9, headTilt: 7, look: [0, 0], mouth: 'smirk' }, .22], [(E.hombros || tS + .6) + .25, { armL: [56, 86], armR: [56, 86], headTilt: 4 }]]);
  return clipAbove(who('JUEZ', pose, F, 1.52), top); };

// =====================================================================================================
// 5 · CINCO — mazazo en «vale», el contador de condena pasa a 5 y el preso salta de alegría con ojos de estrella
// =====================================================================================================
S.cinco = (t, D, B) => { const E = EVS.cinco(B); setup(t + B[0].s, { light: IN }); W.setOrder(0, 1); const tV = E.vale ?? .1, tC = E.cinco ?? D * .4, tA = Math.max(tC + .32, (E.anos ?? D * .6) - .02);
  if (t < tA) { cond(t < tC ? 0 : 5, clamp((t - tC) / .22)); cam(L3(V3(JX + 1.42, 2.24, -3.62), V3(JX + 1.32, 2.2, -3.82), oc(t / tA)), V3(JX + .82, 2.0, -5.05), 44);
    const top = W.proj(V3(JX + .4, 1.84, -4.46)).y, F = V3(JX, .62, -5.95); const up = t < tV - .05; const hit = clamp((t - tV + .05) / .08);
    const pose = { face: up ? 'smug' : 'angry', mouth: up ? 'line' : 'grin', legLen: .7, look: [12, 8], armL: [16, 30], armR: hit > 0 ? [lerp(150, 88, hit), lerp(40, 22, hit)] : [150, 40], holdR: GAVEL(hit > 0 ? lerp(-60, 0, hit) : -60), brows: up ? .2 : -.4 };
    let s = clipAbove(who('JUEZ', pose, F, 1.52), top); if (t > tV) { SHAKE = .05 * Math.exp(-(t - tV) * 14); const p = W.proj(V3(JX + .78, 1.95, -4.95)); s += impact(p.x, p.y, 150, (t - tV) / .3) + ring(p.x, p.y + 10, 160, (t - tV) / .35); }
    if (t > tC && t < tC + .4) { const p = W.proj(V3(JX + 1.55, 2.04, -4.7)); s += glint(p.x + 70, p.y - 60, 40, Math.sin(Math.PI * (t - tC) / .4)); } return s; }
  whipBlur(t, tA); const u = t - tA, jump = Math.abs(Math.sin(u * 8.5)) * .22 * (u < 1.4 ? 1 : 0); cam(L3(V3(JX + 2.55, 1.86, -3.75), V3(JX + 2.7, 1.84, -3.5), oc(u / (D - tA))), V3(JX + 3.38, 1.6, -1.6), 48);
  const F = F_DOCK.clone(); F.y += jump; const top = W.proj(V3(F_DOCK.x, 1.05, -2.3)).y;
  let s = who('PACO', { armL: [8, 10], armR: [8, 10], look: [-14, -4], face: 'wide', mouth: 'o' }, V3(JX + 4.78, 0, -1.25)) + clipAbove(who('PRESO', { face: 'happy', mouth: 'laugh', armL: [138, 30], armR: [138, 30], headTilt: Math.sin(u * 8) * 5 }, F), top + jump * 300);
  const h = headScr(F), sc = sOf(F); s += starEyes(h, sc, eBack(clamp(u / .25))) + glint(h.x - 140 * sc * 1.6, h.y - 180 * sc, 30, Math.abs(Math.sin(u * 6))) + glint(h.x + 160 * sc * 1.6, h.y - 120 * sc, 22, Math.abs(Math.cos(u * 5))); return s; };

// =====================================================================================================
// 6 · FELIZ — la guardia le cierra la celda (él saluda feliz) · tumbado en la litera con las manos en la nuca · la cámara sale y se ve toda la galería
// =====================================================================================================
const F_LIE = V3(.62, .62, -2.72), H_LIE = V3(-1.13, .84, -2.72);
const lying = (o = {}) => who('PRESO', Object.assign({ face: 'happy', mouth: 'smile', armL: [150, 122], armR: [150, 122], legL: [8, 0], legR: [-6, 4] }, o), F_LIE, H_LIE, { shadow: false });
function neighbours(t, mood = 'sad') { const L = []; [[-3, 0, CR[4], 'sit'], [-6, 0, CR[0], 'stand'], [-9, 0, CR[3], 'stand'], [0, 3.2, CR[2], 'stand'], [-3, 3.2, CR[7], 'lean'], [-6, 3.2, CR[1], 'stand'], [-12, 0, CR[6], 'stand']].forEach(([cx, y0, c, p], i) => {
    const F = V3(cx + (i % 2 ? .4 : -.35), y0, -.9), o = { outfit: 'prisoner', top: '#f2ede0', topD: '#c9c1ae', stripe: ['#2a2a34', '#3a4a6a', '#5a3a3a'][i % 3], number: String(700 + i * 13), face: 'smug', mouth: mood === 'sad' ? 'line' : 'o', browTilt: -.4, look: [0, 4], armL: p === 'lean' ? [150, 30] : [10, 14], armR: p === 'lean' ? [150, 30] : [10, 14] };
    L.push([V3(F.x, y0 + 1, F.z), who(c, o, F) + bars2d(cx, 0, y0)]); }); return L; }
S.feliz = (t, D, B) => { const E = EVS.feliz(B); setup(t + B[0].s, { light: IN }); tally(23, 0); const t1 = Math.max(.8, (E.era || D * .33) - .06), t2 = Math.max(t1 + .7, (E.de2 || E.carcel || D * .78) - .45);
  if (t < t1) { const k = clamp(t / (t1 * .8)); W.setCellDoor(1 - eIO(k)); cam(L3(V3(.4, 1.68, 4.1), V3(.32, 1.66, 3.8), oc(t / t1)), V3(.25, 1.3, -.5), 54);
    const Fp = V3(-.38, 0, -1.25), Fg = V3(1.0, 0, .72);
    let s = who('PRESO', { face: 'happy', mouth: 'smile', armR: [150 + Math.sin(t * 12) * 18, 30], armL: [14, 14], look: [6, 0] }, Fp) + bars2d(0, 1 - eIO(k));
    s += who('LOLA', { face: 'smug', mouth: 'line', armL: [70, 20], armR: [12, 12], look: [-14, 0], holdL: '' }, Fg); if (k >= 1 && t < t1) { const p = W.proj(V3(1.35, 1.3, .1)); s += ring(p.x, p.y, 120, (t - t1 * .8) / .3, '#fff'); } return s; }
  if (t < t2) { whipBlur(t, t1); const u = t - t1; cam(L3(V3(.72, 1.22, -.42), V3(.55, 1.12, -.75), oc(u / (t2 - t1))), V3(-.45, .84, -2.72), 56, .0035);
    let s = lying({}); const h = W.proj(H_LIE), sc = sOf(F_LIE, 1.84); s += glint(h.x - 30, h.y - 150 * sc * 1.2, 26, Math.abs(Math.sin(u * 4))) + glint(h.x + 110, h.y - 70, 18, Math.abs(Math.cos(u * 5))) + notes(h.x + 80, h.y - 60, .9, u); return s; }
  const u = t - t2, k = eIO(clamp(u / (D - t2))); const cp = sp(k, [[0, V3(.35, 1.25, .55)], [.45, V3(-.6, 2.4, 3.6)], [1, V3(-3.4, 4.9, 7.3)]]), lk = L3(V3(-.4, .9, -2.6), V3(-3.2, 2.6, -1.4), k); cam(cp, lk, lerp(52, 60, k));
  let L = neighbours(t); L.push([V3(-.2, 1, -2.7), lying({}) + bars2d(0, 0)]); return depth(L); };

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
  whipBlur(t, t2); const u = t - t2; cam(L3(V3(KX + 2.95, 1.5, 1.05), V3(KX + 3.35, 1.46, .85), oc(u / (D - t2))), V3(KX + 4.86, 1.42, .4), 40);
  const p = W.proj(V3(KX + 4.75, 1.42, .4)); let s = ''; const sx = p.x + Math.sin(t * 3) * 6, sy = p.y - 20 + Math.sin(t * 2.2) * 18; s += `<path d="M${sx},${p.y - 160} L${sx},${sy}" stroke="#fff" stroke-width="2" opacity=".8"/><g transform="translate(${sx},${sy})"><ellipse rx="11" ry="14" fill="${K}"/><circle cy="-14" r="8" fill="${K}"/>${[-1, 1].map(sd => [0, 1, 2].map(k => `<path d="M0,${-6 + k * 6} q${sd * 14},-8 ${sd * 20},${6 + k * 3}" stroke="${K}" stroke-width="3" fill="none"/>`).join('')).join('')}<circle cx="-3" cy="-16" r="2" fill="#fff"/><circle cx="3" cy="-16" r="2" fill="#fff"/></g>`; return s; };

// =====================================================================================================
// 8 · VENTANA — su cara tras los barrotes (desde el callejón) · lo que ve: la pared del BANCO · vuelve la cara, con plan
// =====================================================================================================
const F_WIN = V3(1.12, .12, -1.6);
function winFace(o) { return winClip(who('PRESO', Object.assign({ armL: [10, 10], armR: [10, 10] }, o), F_WIN), 2.31) + winBars2d(); }
S.ventana = (t, D, B) => { const E = EVS.ventana(B); setup(t + B[0].s); tally(23, 0); const t1 = Math.max(1.0, (E.la || E.pared || D * .45) - .3), t2 = Math.max(t1 + 1.0, (E.de || E.lado || D * .85) - .25);
  const pig = (k) => { const F = V3(2.42, 1.45, -1.18 + k * .0); return typeof pigeonAt === 'function' ? pigeonAt({ peck: Math.max(0, Math.sin(t * 3)) * .6, bob: Math.sin(t * 5) * .5, eye: 'calm', flip: true }, F, V3(F.x, F.y + .3, F.z), W, { shadow: false }) : ''; };
  if (t < t1) { cam(L3(V3(5.0, 1.82, -1.62), V3(4.75, 1.86, -1.6), oc(t / t1)), V3(1.9, 1.95, -1.6), 54); return winFace({ face: 'smug', mouth: 'line', look: [10, -2], brows: -.1 }) + pig(0); }
  if (t < t2) { whipBlur(t, t1); const u = t - t1; cam(L3(V3(.95, 1.92, -1.6), V3(1.22, 1.95, -1.6), oc(u / (t2 - t1))), V3(5.3, 2.02, -1.6), 56); const pb = W.proj(V3(5.29, 2.05, -1.6)); return glint(pb.x + 150, pb.y - 70, 30, Math.abs(Math.sin(u * 3.2))) + pig(0); }
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
  whipBlur(t, t2); const u = t - t2, tO = (E.cama || D * .9) - t2; cam(L3(V3(.55, 1.05, -.45), V3(.42, 1.0, -.62), oc(u / (D - t2))), V3(-.42, .62, -2.65), 58, .003);
  let s = lying({ face: u > tO ? 'smug' : 'closed', wink: u > tO, mouth: 'line', armL: [24, 30], armR: [24, 30], look: [8, 6] }); const p = W.proj(V3(-.9, .2, -2.35)); s += waves(p.x - 60, p.y, 1.3, u, -1) + waves(p.x + 160, p.y, 1.3, u + .3, 1) + dirt(p.x + 40, p.y + 30, 1.2, u);
  if (u < tO) { const h = W.proj(H_LIE); s += zzz(h.x + 40, h.y - 60, .9, u); } return s; };

// =====================================================================================================
// 10 · REGISTRO — le ponen la celda patas arriba (libros volando; él con su taza) · el colchón · los ladrillos · hasta el váter
// =====================================================================================================
S.registro = (t, D, B) => { const E = EVS.registro(B); setup(t + B[0].s, { light: IN, door: 1 }); tally(23, 0); const t1 = Math.max(.9, (E.el || E.colchon || D * .35) - .1), t2 = Math.max(t1 + .6, (E.los || E.ladrillos || D * .55) - .1), t3 = Math.max(t2 + .6, (E.hasta || E.vater || D * .75) - .1);
  if (t < t1) { W.setMess(t > t1 * .45); cam(L3(V3(1.45, 1.78, 1.75), V3(1.35, 1.74, 1.45), oc(t / t1)), V3(-.2, 1.0, -1.9), 60);
    const L = [[V3(-.7, 1, -1.9), who('PACO', { face: 'angry', mouth: 'grin', armL: [120 + Math.sin(t * 14) * 30, 40], armR: [130 - Math.sin(t * 14) * 30, 40], look: [6, 6], brows: -.5 }, V3(-.7, 0, -1.9))], [V3(.55, 1, -2.35), who('LOLA', { face: 'angry', mouth: 'line', armL: [150, 20], armR: [100, 60], look: [-8, -6] }, V3(.55, 0, -2.35))],
      [V3(1.2, 1, -.55), who('PRESO', { face: 'smug', mouth: 'smirk', armR: [40, 110], holdR: MUG2(), armL: [12, 12], look: [-10, 0] }, V3(1.2, 0, -.55))]];
    let s = depth(L); const a = W.proj(V3(-.7, 1.6, -1.9)); [['#c8302e', -260, -120, 0], ['#2f6fbf', 220, -60, .25], ['#e8b830', -120, 200, .5], ['#5a8a5a', 300, 120, .7]].forEach(([c, dx, dy, ph]) => s += flyBook(a.x, a.y, a.x + dx, a.y + dy + 300, ((t * 1.6 + ph) % 1), .9, c, 540)); return s; }
  if (t < t2) { whipBlur(t, t1); const u = t - t1, a = clamp(u / .35); W.setMess(true); W.setMattress(eOut(a) * 1.25, eOut(a) * .55); cam(L3(V3(1.05, 1.5, .55), V3(.95, 1.46, .3), oc(u / (t2 - t1))), V3(-.25, .95, -2.5), 56);
    let s = who('PACO', { face: 'angry', mouth: 'grin', armL: [150, 10], armR: [150, 10], look: [-8, -10], brows: -.6, lean: -4 }, V3(.5, 0, -2.3)); if (a > .6) { const p = W.proj(V3(-.5, .5, -2.5)); s += puff(p.x, p.y, 120, (u - .3) / .5); } return s; }
  if (t < t3) { whipBlur(t, t2); const u = t - t2; W.setMess(true); W.setMattress(1.25, .55); cam(L3(V3(.55, 1.62, -.75), V3(.4, 1.6, -.85), oc(u / (t3 - t2))), V3(-1.4, 1.55, -1.75), 48);
    const tap = Math.max(0, Math.sin(u * 13)); const F = V3(-.95, 0, -1.05); let s = who('LOLA', { face: 'smug', mouth: 'line', look: [-14, -6], armR: [90 + tap * 30, 30], holdR: `<rect x="-8" y="-120" width="16" height="130" rx="7" fill="#1f1d22" stroke="${K}" stroke-width="4"/>`, armL: [150, 140], brows: -.2, headTilt: -8 }, F);
    if (tap > .9) { const p = W.proj(V3(-1.38, 1.7, -1.55)); s += ring(p.x, p.y, 90, (u * 13 / Math.PI) % 1, '#fff'); } return s; }
  whipBlur(t, t3); const u = t - t3; W.setMess(true); W.setMattress(1.25, .55); cam(L3(V3(-.45, 1.62, .35), V3(-.35, 1.58, .1), oc(u / (D - t3))), V3(.8, .7, -2.6), 54);
  const F = V3(.5, 0, -2.38); let s = who('PACO', { face: 'smug', mouth: 'grin', look: [14, 14], lean: 22, armR: [70, 30], holdR: TORCH, armL: [30, 60], browTilt: -.4 }, F);
  const a = W.proj(V3(.78, .95, -2.6)), b = W.proj(V3(1.05, .38, -2.82)); s += `<path d="M${a.x},${a.y} L${b.x - 70},${b.y + 10} L${b.x + 70},${b.y - 10}Z" fill="#fff6c0" opacity=".35"/>`; return s; };

// =====================================================================================================
// 11 · NADA — la celda destrozada; él da un sorbo a su taza entre los dos guardias rendidos
// =====================================================================================================
S.nada = (t, D, B) => { setup(t + B[0].s, { light: IN, door: 1 }); tally(23, 0); W.setMess(true); W.setMattress(1.25, .55); cam(L3(V3(1.55, 1.78, 2.0), V3(1.45, 1.76, 1.75), oc(t / Math.max(1, D))), V3(-.1, 1.1, -1.8), 60);
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
S.director = (t, D, B) => { const E = EVS.director(B); setup(t + B[0].s, { light: IN }); const tD = E.detuvo || D * .3, tR = E.director || D * .7; cam(L3(V3(16.9, 1.62, 4.75), V3(16.55, 1.6, 4.35), oc(t / D)), V3(15.05, 1.38, .9), 50);
  const cuffed = t > tD; const Fd = V3(15.05, 0, 1.0); const L = [];
  L.push([Fd, who('DIRECTOR', cuffed ? { face: 'happy', mouth: 'open', browTilt: -.9, armL: [26, -46], armR: [26, -46], look: [0, 6] } : { face: 'wide', mouth: 'o', armL: [70, 30], armR: [70, 30], brows: .8, sweat: true }, Fd)]);
  L.push([V3(14.1, 0, 1.35), who('POLI1', { face: 'smug', mouth: 'line', armR: cuffed ? [50, 50] : [70, 60], armL: [10, 10], look: [12, 0] }, V3(14.1, 0, 1.35))]);
  L.push([V3(16.05, 0, 1.4), who('POLI2', { face: 'angry', mouth: 'line', armL: cuffed ? [50, 50] : [70, 60], armR: [10, 10], look: [-12, 0] }, V3(16.05, 0, 1.4))]);
  [[CR[5], 13.0, -1.6], [CR[2], 18.4, -.9], [CR[6], 19.6, .4]].forEach(([c, x, z]) => L.push([V3(x, 0, z), who(c, { face: 'wide', mouth: 'o', look: [x > 15 ? -12 : 12, 0], armL: [20, 40], armR: [20, 40] }, V3(x, 0, z), ADULT, { blur: 3 })]));
  L.push([V3(18.0, 0, -2.75), clipAbove(who('CAJERA', { face: 'wide', mouth: 'o', armL: [130, 110], armR: [20, 40], look: [-14, 0] }, V3(18.0, 0, -2.75), ADULT, { blur: 3 }), W.proj(V3(18, 1.18, -2.6)).y)]);
  let s = depth(L); const hp = W.proj(V3(15.05, 1.05, 1.15)), sc = sOf(Fd); if (cuffed) { s += CUFFS(hp.x, hp.y, sc * 1.6) + ring(hp.x, hp.y, 120, (t - tD) / .3, '#fff'); SHAKE = .015 * Math.exp(-(t - tD) * 8); }
  if (t > tR - .2) s += tears(headScr(Fd), sc, t); return s; };

// =====================================================================================================
// 17 · TÚNEL — vista en corte: él duerme en la litera… la cámara baja por debajo del suelo: el pozo, el túnel, el cartel de SALIDA tachado
// =====================================================================================================
function crawl(ph, o = {}) { const s1 = Math.sin(ph), c1 = Math.cos(ph); return Object.assign({ face: 'smug', mouth: 'smirk', look: [12, 0], headTilt: -64,
  armL: [128 + s1 * 22, -70 + s1 * 18], armR: [128 - s1 * 22, -70 - s1 * 18], legL: [52 + c1 * 18, 96], legR: [52 - c1 * 18, 96] }, o); }
const crawlAt = (x, y, ph, o) => { const F = V3(x - 1.55, y, -2.78), Hc = V3(x, y + .62, -2.78); return who('PRESO', crawl(ph, o), F, Hc, { shadow: false }); };
S.tunel = (t, D, B) => { const E = EVS.tunel(B); setup(t + B[0].s, { section: true, mood: [0, 1], light: CANDLE, clock: [3, 0] }); tally(23, 0); W.setCellLid(0);
  const k = eIO(clamp((t - .35) / (D - .35))); const cp = sp(k, [[0, V3(-.25, 1.45, 3.0)], [.5, V3(.05, -.4, 2.6)], [1, V3(1.25, -2.05, 2.35)]]), lk = sp(k, [[0, V3(-.35, 1.0, -2.8)], [.5, V3(-.6, -.9, -2.8)], [1, V3(.85, -2.45, -2.8)]]);
  cam(cp, lk, 56, .0018); W.charLight = k < .3 ? NIGHT : CANDLE; let s = lying({ face: 'closed', mouth: 'line', armL: [24, 30], armR: [24, 30] }); const h = W.proj(H_LIE); if (k < .4) s += zzz(h.x + 40, h.y - 60, .9, t);
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
S.noche = (t, D, B) => { const E = EVS.noche(B); const t1 = Math.max(1.0, (E.cogia || D * .38) - .45), t2 = Math.max(t1 + .9, (E.y || E.volvia || D * .58) - .12);
  if (t < t1) { setup(t + B[0].s, { section: true, mood: [0, 1], light: CANDLE }); W.setCellLid(0); W.setVTile(1); const x = lerp(2.4, 6.6, t / t1), ph = t * 9; W.setLantern(V3(x + .3, -2.6, -2.5), 4); cam(V3(x + .05, -2.05, 1.6), V3(x + .05, -2.42, -2.8), 52, .0018);
    return crawlAt(x, -3.06 + Math.abs(Math.sin(ph)) * .03, ph, { holdR: LANTERN2 }); }
  if (t < t2) { setup(t + B[0].s, { light: IN, mood: [0, 1] }); W.setVTile(1); whipBlur(t, t1); const u = t - t1, up = eOut(clamp(u / .35)), grab = clamp((u - .45) / .25); W.GOLD[26].visible = grab < .5;
    cam(L3(V3(9.0, 1.38, -.18), V3(9.0, 1.33, -.4), oc(u / (t2 - t1))), V3(9.0, .56, -2.95), 58); const F = V3(9.0, lerp(-1.75, -1.12, up), -2.82), top = W.proj(V3(9.0, 0, -2.35)).y;
    let s = clipAbove(who('PRESO', { face: 'smug', mouth: 'smirk', wink: grab > .9, look: [0, 4], armR: grab > 0 ? [lerp(150, 100, grab), lerp(30, 70, grab)] : [150, 30], holdR: grab > .5 ? BAR2(.9) : '', armL: [60, 40] }, F), top);
    const h = headScr(F); if (grab > .9) s += glint(h.x + 120, h.y - 140, 26, eBack(clamp((u - .7) / .2))); return s; }
  setup(t + B[0].s, { light: DUSK, mood: [.55, 0], clock: [6, 0] }); tally(23, 0); whipBlur(t, t2); const u = t - t2, tick = (E.recuento || D) - t2; cam(L3(V3(.55, 1.7, 4.2), V3(.5, 1.68, 3.9), oc(u / (D - t2))), V3(-.15, 1.15, -1.4), 50);
  const Fg = V3(1.42, 0, .95); let s = lying({ face: 'closed', mouth: 'o', armL: [24, 30], armR: [24, 30] }) + bars2d(0, 0); const h = W.proj(H_LIE); s += zzz(h.x + 40, h.y - 60, .9, u);
  s += who('LOLA', { face: 'smug', mouth: 'line', look: [-12, 6], armL: [80, 40], holdL: CLIP, armR: [u > tick - .3 ? 70 : 40, 60], holdR: `<rect x="-4" y="-60" width="8" height="60" fill="#2f6fbf" stroke="${K}" stroke-width="3"/>` }, Fg); return s; };

// =====================================================================================================
// 20 · SALIR — la puerta de la celda se queda abierta… y él mismo la cierra, sonriendo
// =====================================================================================================
S.salir = (t, D, B) => { const E = EVS.salir(B); setup(t + B[0].s, { light: IN }); tally(23, 0); const tS = E.salir || D * .6; const k = 1 - eIO(clamp((t - tS + .15) / .45)); W.setCellDoor(k);
  cam(L3(V3(1.45, 1.62, 2.75), V3(1.35, 1.6, 2.5), oc(t / D)), V3(.0, 1.3, -.6), 50); const F = V3(.25, 0, -.62);
  let s = who('PRESO', seq(t, [[0, { face: 'smug', mouth: 'line', look: [12, 0], armL: [12, 12], armR: [12, 12] }], [tS - .35, { face: 'smug', mouth: 'smirk', armR: [86, 20], look: [0, 0] }, .2], [tS + .4, { face: 'happy', mouth: 'smile', armR: [30, 30] }, .3]]), F) + bars2d(0, k);
  if (t > tS + .25 && t < tS + .7) { const p = W.proj(V3(1.35, 1.3, .1)); s += ring(p.x, p.y, 120, (t - tS - .25) / .35, '#fff'); } return s; };

// =====================================================================================================
// 21 · VACIAR — pinta rayas de días con tiza (sonrisa de plan) · la cámara acorazada casi vacía
// =====================================================================================================
S.vaciar = (t, D, B) => { const E = EVS.vaciar(B); const t1 = Math.max(1.0, (E.para || D * .58) - .12);
  if (t < t1) { setup(t + B[0].s, { light: IN }); const n = 23 + Math.floor(t / .32), kk = (t / .32) % 1; tally(Math.min(n, 44), Math.round(kk * 6) / 6); cam(L3(V3(1.25, 1.72, -.2), V3(1.1, 1.7, -.3), oc(t / t1)), V3(-1.35, 1.5, -1.6), 56);
    const F = V3(-.72, 0, -.55); return who('PRESO', { face: 'smug', mouth: 'smirk', browTilt: .45, look: [14, -2], armR: [118 + Math.sin(t * 20) * 6, 40], holdR: CHALK, armL: [12, 12] }, F); }
  setup(t + B[0].s, { light: IN, gold: .07, cash: .1 }); W.setVTile(1); whipBlur(t, t1); const u = t - t1; cam(L3(V3(11.25, 1.7, -.3), V3(11.1, 1.66, -.45), oc(u / (D - t1))), V3(8.4, .95, -3.2), 60);
  const vis = W.GOLD.filter(m => m.visible); let s = ''; if (vis.length) { const p = W.proj(vis[0].position); s += glint(p.x, p.y, 40, Math.abs(Math.sin(u * 4))); } return s; };

// =====================================================================================================
// 22 · FINAL — atardecer: coches de policía delante del banco · barrido al callejón: él, en su ventanita, saluda y guiña
// =====================================================================================================
S.final = (t, D, B) => { const E = EVS.final(B); setup(t + B[0].s, { mood: [1, 0], light: DUSK }); W.setPolice(true, t); const t1 = Math.max(1.0, (E.nadie || D * .45) - .15);
  if (t < t1) { cam(L3(V3(13.4, 1.85, 20.3), V3(13.6, 1.85, 19.8), oc(t / t1)), V3(14.6, 2.3, 11.0), 58);
    const L = [[V3(13.2, 0, 13.1), who('POLI1', { face: 'smug', mouth: 'line', armL: [10, 10], armR: [100, 60], look: [8, 0] }, V3(13.2, .12, 12.6))], [V3(17.2, 0, 12.4), who('POLI2', { face: 'smug', mouth: 'line', armL: [10, 10], armR: [10, 10], look: [-8, 0] }, V3(17.2, .12, 12.4))]];
    [[CR[0], 10.4, 12.4], [CR[3], 11.4, 12.0], [CR[6], 20.6, 12.2], [CR[1], 21.6, 12.6]].forEach(([c, x, z]) => L.push([V3(x, 0, z), who(c, { face: 'wide', mouth: 'o', look: [x > 15 ? -10 : 10, 0], armL: [20, 40], armR: [20, 40] }, V3(x, .12, z), ADULT, { blur: 2 })]));
    let s = depth(L); const ph = Math.floor(t * 6) % 2; s += `<rect width="1080" height="1920" fill="${ph ? '#3a5aff' : '#ff2a3a'}" opacity=".035"/>`; return s; }
  whipBlur(t, t1); const u = t - t1, tL = (E.lado || D * .9) - t1; cam(L3(V3(5.05, 1.86, -1.0), V3(4.8, 1.88, -1.15), oc(u / (D - t1))), V3(2.0, 1.96, -1.62), 54);
  let s = winClip(who('PRESO', { face: 'happy', mouth: 'smile', wink: u > tL - .1, look: [8, 0], armR: [160 + Math.sin(u * 10) * 14, 30], armL: [10, 10] }, F_WIN), 2.31) + winBars2d();
  const ph = Math.floor(t * 6) % 2; s += `<rect width="1080" height="1920" fill="${ph ? '#3a5aff' : '#ff2a3a'}" opacity=".05"/>`; if (u > tL - .1) { const h = headScr(F_WIN); s += glint(h.x + 80, h.y - 110, 28, eBack(clamp((u - tL + .1) / .25))); } return s; };

// =====================================================================================================
// 23 · BUCLE — vuelve el primer plano exacto (banquillo, orden sobre la barandilla) para enlazar con el principio
// =====================================================================================================
S.bucle = (t, D, B) => { setup(t + B[0].s, { light: IN }); cond(2, 1); W.setOrder(0, 0); const k = oc(clamp(t / D)); cam(L3(V3(JX + 2.0, 2.02, -5.15), CP_OF0, k), LK_OF, 50);
  return dockShot(t, { pose: { face: 'smug', mouth: 'line', look: [-8, 14], brows: -.2, armL: [26, 40], armR: [26, 40], headTilt: 4 } }); };

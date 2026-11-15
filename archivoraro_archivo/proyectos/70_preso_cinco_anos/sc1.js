// «El preso que pidió cinco años más» (70) — ESTILO 3D: world_carcel.js + personajes 2D (cast70.js) + efectos (fx70.js).
// Un plano por frase y planos internos con barrido cuando la frase cambia de sitio. Cámara siempre en movimiento, pose a pose,
// textos solo dentro del mundo (orden de libertad, contador de condena, carteles, libro de cuentas, calendario, «BANCO» pintado).
window.CFG = { capY: 1500, capSize: 96, transDur: .42, blurK: .35, antic: .1, blurChars: false,
  transDurBy: { suplica: .34, risa: .34, cinco: .2, bucle: .5, noche: .26, modelo: .5 },
  trans: { suplica: 'whip', risa: 'swish', juez: 'whip', cinco: 'cut', feliz: 'swish', modelo: 'cut', ventana: 'swish', ruido: 'cut', registro: 'swish', nada: 'cut', banco: 'swish',
    lunes: 'swish', lingote: 'swish', pistas: 'swish', director: 'whip', tunel: 'swish', debajo: 'glide', noche: 'whip', salir: 'swish', vaciar: 'swish', final: 'swish', bucle: 'swish' } };
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
const clk = memo((h, m) => W.setClocks(h, m)), tally = memo((n, k) => W.setTally(n, k)), ledger = memo((a, b, c) => W.setLedger(a, b, c)), calk = memo((k, r) => W.setCal(k, r)), cond = memo((n, k, p) => W.setCondena(n, k, p));
function setup(T, o = {}) { W.setTime(T); W.ORDER.visible = true; W.setSection(!!o.section); W.setMood(...(o.mood || [0, 0])); W.setCellDoor(o.door ?? 0); W.setMattress(0); W.setMess(false); W.setCellLid(1); W.setVTile(0); W.setVaultDoor(0);
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
  for (let k = 0; k < 4; k++) { const z = -1.93 + k * .22; s += bar(V3(1.9, 1.45, z), V3(1.9, 2.45, z), .048); } s += bar(V3(1.9, 2.3, -2.15), V3(1.9, 2.3, -1.05), .048); return s; }
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
  if (k > 0) { const fw = lk.clone().sub(cp).normalize(), rt = fw.clone().cross(V3(0, 1, 0)).normalize(), up = rt.clone().cross(fw).normalize(); const tgt = cp.clone().addScaledVector(fw, 1.02).addScaledVector(rt, -.03).addScaledVector(up, -.15);
    const e = eOut(k), O = W.ORDER, p0 = V3(JX + 3.05, 1.09, -2.27); O.position.copy(p0).lerp(tgt, e); O.position.y += Math.sin(Math.PI * e) * .22; const q0 = O.quaternion.clone(); const m = new THREE.Matrix4().lookAt(tgt, cp, V3(0, 1, 0)); const q1 = new THREE.Quaternion().setFromRotationMatrix(m); q1.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, .06))); O.quaternion.copy(q0).slerp(q1, e); }
  const pose = seq(t, [[0, { face: 'smug', mouth: 'line', look: [-8, 14], brows: -.2, armL: [22, 6], armR: [22, 6], headTilt: 4 }], [kL - .05, { face: 'wide', mouth: 'o', look: [-14, 6], brows: .8, armL: [34, 30], armR: [34, 30], headTilt: -3 }, .18], [E.tiempo || kL + 1, { face: 'wide', mouth: 'o', browTilt: -.7, brows: .4, look: [-10, 10], sweat: true }, .3]]);
  cam(cp, lk, 50); let s = dockShot(t, { pose, pacoLook: t > kL ? [-14, 4] : [-10, 0] }); const h = headScr(F_DOCK.clone()); if (t > kL && t < kL + .5) s += popIcon('!', h.x + 95, h.y - 150, 110, (t - kL) / .3);
  if (k > 0) s += paper2d(); return s; };
// la orden de libertad pintada en 2D sobre su posición 3D (proyección afín de tres esquinas): así queda DELANTE del personaje
function paper2d() { const O = W.ORDER, mesh = O.children[0]; O.updateMatrixWorld(true); const P = (x, y) => W.proj(V3(x, y, 0).applyMatrix4(mesh.matrixWorld)); const tl = P(-.21, .28), tr = P(.21, .28), bl = P(-.21, -.28), br = P(.21, -.28);
  O.visible = false; const url = W.ORDERC.c.toDataURL('image/jpeg', .92), a = (tr.x - tl.x) / 600, b = (tr.y - tl.y) / 600, c = (bl.x - tl.x) / 800, d = (bl.y - tl.y) / 800;
  const sh = `<path d="M${tl.x + 14},${tl.y + 18} L${tr.x + 14},${tr.y + 18} L${br.x + 14},${br.y + 18} L${bl.x + 14},${bl.y + 18}Z" fill="#000" opacity=".25" style="filter:blur(8px)"/>`;
  return sh + `<image href="${url}" width="600" height="800" transform="matrix(${a.toFixed(5)},${b.toFixed(5)},${c.toFixed(5)},${d.toFixed(5)},${tl.x.toFixed(1)},${tl.y.toFixed(1)})"/><path d="M${tl.x},${tl.y} L${tr.x},${tr.y} L${br.x},${br.y} L${bl.x},${bl.y}Z" fill="none" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`; }

// =====================================================================================================
// 2 · SUPLICA — llora y suplica agarrado a la barandilla (plano desde el juez); el juez le mira por encima de las gafas
// =====================================================================================================
S.suplica = (t, D, B) => { const E = EVS.suplica(B); setup(t + B[0].s, { light: IN }); W.setOrder(0, 1); cond(2, 1); const tJ = Math.max(.9, (E.juez || D * .45) - .05);
  if (t < tJ) { const cp = L3(V3(JX + 1.25, 1.85, -4.35), V3(JX + 1.6, 1.82, -4.0), oc(t / tJ)); cam(cp, V3(JX + 3.4, 1.62, -1.6), 46);
    const pose = { face: 'happy', mouth: 'open', browTilt: -.9, brows: .2, lean: -4, armL: [38 + Math.sin(t * 7) * 4, -150], armR: [38 + Math.sin(t * 7) * 4, -150], headTilt: Math.sin(t * 9) * 3, look: [-6, -4], cry: t, clasp: true }; return dockShot(t, { pose, pacoLook: [-14, 0], pacoFace: 'smug', pacoMouth: 'line' }); }
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
  if (t < tC - .06) { cond(2, 1); cam(L3(V3(JX + 1.25, 2.28, -3.25), V3(JX + 1.18, 2.25, -3.45), oc(t / tA)), V3(JX + .6, 2.0, -5.1), 50);
    const top = W.proj(V3(JX + .4, 1.84, -4.46)).y, F = V3(JX, .62, -5.95); const up = t < tV - .09; const hit = clamp((t - tV + .09) / .09);
    const pose = { face: up ? 'smug' : 'angry', mouth: up ? 'line' : 'grin', legLen: .7, look: [12, 8], armL: [16, 30], armR: hit > 0 ? [lerp(140, 70, hit), lerp(50, 20, hit)] : [140, 50], holdR: GAVEL(hit > 0 ? lerp(-40, -118, hit) : -40), brows: up ? .2 : -.4 };
    let s = clipAbove(who('JUEZ', pose, F, 1.52), top); if (t > tV) { SHAKE = .05 * Math.exp(-(t - tV) * 14); const p = W.proj(V3(JX + .78, 1.95, -4.95)); s += impact(p.x, p.y, 150, (t - tV) / .3) + ring(p.x, p.y + 10, 160, (t - tV) / .35); } return s; }
  if (t < tA) { whipBlur(t, tC - .06, .16); cond(7, clamp((t - tC) / .2), 2); const u = t - tC + .06; cam(L3(V3(JX + 1.55, 2.15, -3.6), V3(JX + 1.55, 2.12, -3.8), oc(u / (tA - tC + .06))), V3(JX + 1.55, 1.95, -4.75), 42);
    const p = W.proj(V3(JX + 1.55, 2.04, -4.68)); return glint(p.x + 150, p.y - 120, 46, Math.sin(Math.PI * clamp((t - tC) / .45))) + glint(p.x - 160, p.y + 90, 30, Math.sin(Math.PI * clamp((t - tC - .1) / .4))); }
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
  const u = t - t2, k = eIO(clamp(u / (D - t2))); const cp = sp(k, [[0, V3(.3, 1.3, 1.25)], [.45, V3(-.7, 2.5, 3.9)], [1, V3(-3.4, 4.9, 7.3)]]), lk = L3(V3(-.4, .9, -2.6), V3(-3.2, 2.6, -1.4), k); cam(cp, lk, lerp(52, 60, k));
  let L = neighbours(t); L.push([V3(-.2, 1, -2.7), lying({}) + bars2d(0, 0)]); return depth(L); };

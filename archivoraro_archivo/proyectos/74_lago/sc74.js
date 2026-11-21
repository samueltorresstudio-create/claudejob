// «El lago que desapareció» (74) — ESTILO 3D: decorados de Blender (world_lago.js) + personajes 2D (cast74.js) + efectos (fx74.js).
// Gancho en el fotograma 0: el remolino ya se está tragando la plataforma (imagen imposible en 2 s).
window.CFG = { capY: 1500, capSize: 96, transDur: .32, blurK: .35, antic: .1, blurChars: false, transDefault: 'swish',
  trans: { agujero: 'cut', calma: 'swish', mina: 'glide', broca: 'cut', crece: 'glide', mineros: 'swish', remolino: 'swish', cascada: 'swish', flotan: 'cut', final: 'swish' },
  transDurBy: { mina: .5, crece: .4 } };
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { const ws = l.cap.split(' ').map(w => norm(w.split('|')[0])); const prev = EVS[l.sc]; const idx = window.SCRIPT.filter(x => x.sc === l.sc).indexOf(l);
  EVS[l.sc] = B => { const o = prev ? prev(B) : {}; ws.forEach((w, i) => { const k = /^[0-9]/.test(w) ? '_' + w : w; if (k && !(k in o) && B[idx]) o[k] = B[idx].w[i]; }); return o; }; });
const S = {}, W = W2;
let SHAKE = 0;
{ const _sc = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * 4.59) * .5 + Math.sin(T * 8.61) * .3, Math.sin(T * 5.3 + 1) * .5 + Math.sin(T * 9.7) * .25, 0).multiplyScalar(.01 * p.distanceTo(l) / 8);
  const sh = SHAKE > 0 ? V3(Math.sin(T * 91) * SHAKE, Math.sin(T * 77 + 2) * SHAKE, 0).multiplyScalar(p.distanceTo(l) / 10) : V3(0, 0, 0); return _sc(p.clone().add(d).add(sh), l.clone().add(d.multiplyScalar(.35)).add(sh.multiplyScalar(.6)), f, fo, ap); }; }
const cam = (p, l, f = 40, ap = .0015) => { W.setCam(p, l, f, p.distanceTo(l), ap); W.render(); };
function sp(t, Ks) { const n = Ks.length; if (t <= Ks[0][0]) return Ks[0][1].clone(); if (t >= Ks[n - 1][0]) return Ks[n - 1][1].clone(); let i = 0; while (t > Ks[i + 1][0]) i++;
  const u = (t - Ks[i][0]) / (Ks[i + 1][0] - Ks[i][0]), a = Ks[Math.max(0, i - 1)][1], b = Ks[i][1], c = Ks[i + 1][1], d = Ks[Math.min(n - 1, i + 2)][1], u2 = u * u, u3 = u2 * u;
  const f = (p0, p1, p2, p3) => .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); return V3(f(a.x, b.x, c.x, d.x), f(a.y, b.y, c.y, d.y), f(a.z, b.z, c.z, d.z)); }
const DAYL = { tint: '#ffe2bd', k: .14, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.6 }, MINEL = { tint: '#ffcf9a', k: .3, rim: '#ffe0a8', rimA: .65, rimX: 1, rimY: -.4 }, GREY = { tint: '#d8dce4', k: .16, rim: '#f0f4ff', rimA: .45, rimX: -1, rimY: -.6 };
const depth = L => L.filter(x => x && x[1]).map(([p, s]) => [W.camera.position.distanceTo(p), s]).sort((a, b) => b[0] - a[0]).map(x => x[1]).join('');
const CX = W.CX, ZF = W.ZF, PX = W.PIPEX, SX = W.SX, MF = -374, MC = -358;
// estado por defecto del mundo (cada escena lo vuelve a poner)
function setup(T, o = {}) { W.setTime(T); W.setMood(o.mood || 'dia'); W.charLight = o.light || DAYL; SHAKE = 0;
  W.setWater(Object.assign({ vs: 0, spin: 0, level: 0, drain: 0, fall: 0, pool: -70 }, o.water || {}));
  W.SU.uVS.value = 0; W.SU.uSpin.value = 0; W.CU.uFlow.value.set(0, 0);
  const R = W.RIG.main; R.visible = true; R.position.set(0, 0, 0); R.rotation.set(0, 0, 0);
  W.BARGES.forEach(b => { b.visible = true; b.position.copy(b.userData.home); b.rotation.set(0, b.userData.ry, 0); });
  W.TUG.visible = true; W.TUG.position.set(-60, 0, 84); W.TUG.rotation.set(0, .9, 0);
  W.SHRIMPS.forEach(b => { b.position.copy(b.userData.home); b.rotation.set(0, b.userData.ry, 0); });
  W.ISLTREES.forEach(o => { o.visible = true; o.position.copy(o.userData.home); o.rotation.set(0, o.rotation.y, 0); });
  W.JET.visible = false; W.FLOOD.visible = false; W.FUNNEL.visible = false; W.FUNNEL.material.uniforms.uK.value = 0;
  W.PIPE.scale.set(1, 360, 1); W.PIPE.position.y = -180; W.CAGE.position.y = MF + .4; W.BIT.rotation.set(0, 0, 0); }
// barco que flota sobre el agua (inclinado según la pendiente del embudo)
function floatOn(o, x, z, t, draft = 0, ry = null) { const y = W.waterY(x, z, t), e = 1.2, gx = (W.waterY(x + e, z, t) - y) / e, gz = (W.waterY(x, z + e, t) - y) / e; o.position.set(x, y - draft, z);
  if (ry !== null) o.rotation.y = ry; const yaw = o.rotation.y; o.rotation.x = clamp(-gz * Math.cos(yaw) + gx * Math.sin(yaw), -.9, .9) * .9; o.rotation.z = clamp(gx * Math.cos(yaw) + gz * Math.sin(yaw), -.9, .9) * .9; }
// barcaza en órbita: radio que se cierra y ángulo que acelera (vórtice libre)
function orbit(o, i, t, r0, a0, rate, k = 1) { const r = Math.max(2, r0 - rate * t), a = a0 + (16 / Math.max(r, 6)) * t * .55 * k; const x = Math.cos(a) * r, z = Math.sin(a) * r;
  floatOn(o, x, z, t, 0, -a + Math.PI / 2); o.position.y -= Math.max(0, 14 - r) * 1.4; return r; }
// línea de cota (doble flecha) entre dos puntos 3D, sin texto
function dim(A, B, k, col = '#ffffff') { if (k <= 0) return ''; const a = W.proj(A), b = W.proj(B); if (!a.ok || !b.ok) return ''; const e = eOut(clamp(k)), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const ax = mx + (a.x - mx) * e, ay = my + (a.y - my) * e, bx = mx + (b.x - mx) * e, by = my + (b.y - my) * e, ang = Math.atan2(by - ay, bx - ax), h = 22;
  const head = (x, y, an) => `M${(x + Math.cos(an + .45) * h).toFixed(1)},${(y + Math.sin(an + .45) * h).toFixed(1)} L${x.toFixed(1)},${y.toFixed(1)} L${(x + Math.cos(an - .45) * h).toFixed(1)},${(y + Math.sin(an - .45) * h).toFixed(1)}`;
  const d = `M${ax.toFixed(1)},${ay.toFixed(1)} L${bx.toFixed(1)},${by.toFixed(1)} ${head(ax, ay, ang)} ${head(bx, by, ang + Math.PI)}`;
  return `<path d="${d}" stroke="${K}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${col}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
// virutas de sal que saltan de la broca
function chips(x, y, s, t, n = 26) { let o = ''; for (let i = 0; i < n; i++) { const k = ((t * 2.2 + hs(i, 1)) % 1), a = -Math.PI * (.08 + .84 * hs(i, 2)), v = (180 + 260 * hs(i, 3)) * s;
  const xx = x + Math.cos(a) * v * k, yy = y + Math.sin(a) * v * k + 520 * s * k * k, r = (3 + 5 * hs(i, 4)) * s; o += `<rect x="${(xx - r).toFixed(1)}" y="${(yy - r).toFixed(1)}" width="${(r * 2).toFixed(1)}" height="${(r * 1.6).toFixed(1)}" fill="#f4f0e6" stroke="${K}" stroke-width="${(1.5 * s).toFixed(1)}" opacity="${(1 - k).toFixed(2)}" transform="rotate(${(hs(i, 5) * 360 + t * 400).toFixed(0)} ${xx.toFixed(1)} ${yy.toFixed(1)})"/>`; } return o; }
// grietas que se abren (pantalla)
function crack(x, y, s, k) { if (k <= 0) return ''; let o = ''; const e = eOut(clamp(k * 1.4));
  // grieta en el techo: se abre a los lados (casi horizontal), con ramas cortas; fina y color roca, no patas negras
  for (let i = 0; i < 4; i++) { const sg = i % 2 ? -1 : 1, a = (sg > 0 ? 0 : Math.PI) + (hs(i, 9) - .5) * .5, L = (150 + 110 * hs(i, 7)) * s * e; let d = `M${x},${y}`, cx = x, cy = y, br = '';
    for (let j = 1; j <= 6; j++) { const aj = a + (hs(i, j) - .5) * 1.1; cx += Math.cos(aj) * L / 6; cy += Math.sin(aj) * L / 6 * .5; d += ` L${cx.toFixed(1)},${cy.toFixed(1)}`;
      if (j === 2 || j === 4) { const ab = aj + sg * (hs(i, j + 20) > .5 ? .9 : -.9), lb = L * .22; br += `M${cx.toFixed(1)},${cy.toFixed(1)} L${(cx + Math.cos(ab) * lb).toFixed(1)},${(cy + Math.sin(ab) * lb * .6).toFixed(1)} `; } }
    o += `<path d="${d} ${br}" stroke="#f6f1e4" stroke-width="${(6 * s).toFixed(1)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>`;
    o += `<path d="${d} ${br}" stroke="#3b2f25" stroke-width="${(3.4 * s).toFixed(1)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; } return o; }
// salpicadura (pantalla)
function splash(x, y, s, k) { if (k <= 0 || k >= 1) return ''; let o = ''; for (let i = 0; i < 12; i++) { const a = -Math.PI * (.1 + .8 * i / 11), v = (120 + 120 * hs(i, 3)) * s, e = eOut(k), xx = x + Math.cos(a) * v * e, yy = y + Math.sin(a) * v * e + 200 * s * k * k;
  o += `<ellipse cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" rx="${(12 * s * (1 - k * .5)).toFixed(1)}" ry="${(16 * s * (1 - k * .5)).toFixed(1)}" fill="#e8f2ee" stroke="${K}" stroke-width="${(3 * s).toFixed(1)}" opacity="${(1 - k).toFixed(2)}"/>`; }
  return o + `<ellipse cx="${x}" cy="${y}" rx="${(150 * s * eOut(k)).toFixed(1)}" ry="${(30 * s * eOut(k)).toFixed(1)}" fill="none" stroke="#f4faf6" stroke-width="${(10 * s * (1 - k)).toFixed(1)}" opacity="${(1 - k).toFixed(2)}"/>`; }
// gotas que caen del techo de la mina
function drips(x, y, s, t, n = 10, w = 120) { let o = ''; for (let i = 0; i < n; i++) { const k = (t * 1.5 + hs(i, 2)) % 1, xx = x + (hs(i, 1) - .5) * w * s, yy = y + k * 260 * s;
  o += `<path d="M${xx.toFixed(1)},${(yy - 14 * s).toFixed(1)} Q${(xx + 6 * s).toFixed(1)},${yy.toFixed(1)} ${xx.toFixed(1)},${(yy + 6 * s).toFixed(1)} Q${(xx - 6 * s).toFixed(1)},${yy.toFixed(1)} ${xx.toFixed(1)},${(yy - 14 * s).toFixed(1)}Z" fill="#9fd8ea" stroke="${K}" stroke-width="${(2 * s).toFixed(1)}" opacity="${(1 - k).toFixed(2)}"/>`; } return o; }
// gotas y espuma que saltan alrededor de un punto 3D (anillo de radio R)
function sprayRing(t, C, n = 24, R = 20, s = 1) { let o = ''; for (let i = 0; i < n; i++) { const k = (t * 1.3 + hs(i, 4)) % 1, a = hs(i, 1) * 6.283 + t * .9, rr = R * (.7 + .5 * hs(i, 2)), up = (2 + 6 * hs(i, 3)) * Math.sin(Math.PI * k);
  const P = V3(C.x + Math.cos(a) * rr, C.y + up, C.z + Math.sin(a) * rr), q = W.proj(P); if (!q.ok) continue; const r = clamp(q.ppm * .35 * s * (1 - k * .5), 2, 26);
  o += `<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${r.toFixed(1)}" fill="#f2f6f2" opacity="${(.85 * (1 - k)).toFixed(2)}"/>`; } return o; }
// bandada de garzas blancas (pantalla)
function birds(t, x0, y0, s = 1, n = 5, vx = 60) { let o = ''; for (let i = 0; i < n; i++) { const x = x0 + t * vx * s + (i % 3) * 70 * s - i * 18 * s, y = y0 + Math.sin(t * 1.3 + i) * 10 * s + (i % 2) * 40 * s - i * 12 * s, f = Math.sin(t * 9 + i * 1.7), w = 34 * s;
  o += `<path d="M${(x - w).toFixed(1)},${(y - f * 14 * s).toFixed(1)} Q${(x - w * .4).toFixed(1)},${(y - 10 * s).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)} Q${(x + w * .4).toFixed(1)},${(y - 10 * s).toFixed(1)} ${(x + w).toFixed(1)},${(y - f * 14 * s).toFixed(1)}" stroke="${K}" stroke-width="${(9 * s).toFixed(1)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M${(x - w).toFixed(1)},${(y - f * 14 * s).toFixed(1)} Q${(x - w * .4).toFixed(1)},${(y - 10 * s).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)} Q${(x + w * .4).toFixed(1)},${(y - 10 * s).toFixed(1)} ${(x + w).toFixed(1)},${(y - f * 14 * s).toFixed(1)}" stroke="#f6f4ee" stroke-width="${(4 * s).toFixed(1)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; } return o; }
// minero (o trabajador) en un punto, mirando a la cámara con giro t
const man = (name, F, pose = {}, opt = {}) => [F, who(name, pose, F, ADULT, Object.assign({ gy: F.y }, opt))];
// remolino: fuerza, giro acumulado y estado de la plataforma
function vortex(t, k, spin, rigSink, rigTilt) { W.setWater({ vs: k, spin, level: 0 }); const R = W.RIG.main;
  const y = W.waterY(0, 0, t); R.position.set(Math.sin(t * .7) * 1.2, Math.max(y, -6) - rigSink, Math.cos(t * .5) * 1.2); R.rotation.set(rigTilt * .4, spin * .12, rigTilt); R.visible = R.position.y > -90; }

// =====================================================================================================
// 1 · GANCHO — vista aérea: el remolino ya gira, la plataforma se inclina y se hunde, las barcazas caen en espiral
// =====================================================================================================
S.gancho = (t, D, B) => { setup(t, { mood: 'drama', light: GREY }); const E = EVS.gancho(B); const tB = E.barcazas || 3.6, tI = E.isla || 5.9;
  // el remolino ya está en marcha en el fotograma 0; la plataforma se escora y se hunde
  vortex(t, .9 + .1 * clamp(t / 2), 2 + t * 1.5, 3 + t * 3.4, .32 + t * .06);
  W.BARGES.forEach((b, i) => { if (i > 6) { b.visible = false; return; }
    if (i === 0) { orbit(b, i, t, 34, 1.69, 0, 3); return; }                                   // pasa por delante de la cámara en el primer segundo
    if (i === 1) { const r = orbit(b, i, t, 70, 4.2, t < tB ? 2 : 2 + (t - tB) * 55, 1.4); b.visible = r > 3; return; }   // la que se traga al decir «barcazas»
    orbit(b, i, t, [0, 0, 92, 112, 132, 150, 84][i], i * 1.15, 1.5 + i * .4, 1.2); });
  W.TUG.visible = false;
  // árboles de la orilla de la isla al final
  W.ISLTREES.forEach((o, i) => { const kk = k01(t, tI - .3 + i * .06, tI + .9 + i * .06), h = o.userData.home, dir = V3(-h.x, 0, -h.z).normalize();
    o.position.set(h.x + dir.x * 40 * kk * kk, h.y - 26 * kk * kk, h.z + dir.z * 40 * kk * kk); o.rotation.x = dir.z * 1.3 * kk; o.rotation.z = -dir.x * 1.3 * kk; o.visible = kk < .98; });
  // cámara: pegada al agua junto a la plataforma → sube de golpe a la vista aérea del remolino → gira hacia la isla
  const p = sp(t, [[0, V3(-40, 5, 33)], [1.4, V3(-48, 9, 44)], [2.6, V3(-70, 70, 120)], [3.8, V3(-30, 190, 95)], [5.2, V3(60, 175, 120)], [D, V3(40, 120, 150)]]);
  const l = sp(t, [[0, V3(0, -2, 0)], [1.4, V3(0, -6, 0)], [2.6, V3(0, -14, 0)], [3.8, V3(0, -18, 0)], [5.2, V3(30, -14, -6)], [D, V3(150, -2, -40)]]);
  SHAKE = t < 2.4 ? .02 : .007; cam(p, l, t < 2 ? 44 : 48, .0012);
  if (t > 2.1 && t < 3.0 && typeof TR !== 'undefined' && TR) TR.blur('V', Math.sin(Math.PI * (t - 2.1) / .9) * 9);
  let s = sprayRing(t, V3(0, -4, 0), 30, 26, .9) + (t < 2.4 ? sprayRing(t + 3, W.RIG.main.position.clone().add(V3(0, 1, 0)), 18, 14, 1.1) : '');
  const c = W.proj(V3(0, -20, 0)); if (t > tB && t < tB + .5) s += splash(c.x, c.y, .9, (t - tB) / .5);
  return s; };

// =====================================================================================================
// 2 · AGUJERO DE 35 CM — primer plano de la broca tricónica mordiendo la sal; cota de 35 cm
// =====================================================================================================
S.agujero = (t, D, B) => { setup(t, { mood: 'bit', light: MINEL }); const E = EVS.agujero(B); SHAKE = .003; const b0 = W.BIT.position;
  W.BIT.rotation.y = t * 9; W.BIT.position.y = -500 - .05 + Math.sin(t * 40) * .004;
  const p = sp(t, [[0, V3(b0.x + 1.5, b0.y + .9, b0.z + 2.1)], [D, V3(b0.x + 1.05, b0.y + .6, b0.z + 1.5)]]);
  cam(p, V3(b0.x, b0.y + .45, b0.z), 36, .004);
  const g = W.proj(V3(b0.x, b0.y + .05, b0.z)), q = W.proj(V3(b0.x + .1, b0.y, b0.z)).x - g.x;
  let s = chips(g.x, g.y, Math.abs(q) / 60, t);
  const tN = E._35 || D * .55; s += dim(V3(b0.x - .175, b0.y - .02, b0.z + .25), V3(b0.x + .175, b0.y - .02, b0.z + .25), (t - tN + .15) / .35, '#ffd34a');
  return s; };

// =====================================================================================================
// 3 · CALMA — el lago tranquilo, la plataforma trabajando; al decir «tres metros», sección con la lámina de agua
// =====================================================================================================
S.calma = (t, D, B) => { const E = EVS.calma(B); const tT = (E.tres || D * .7) - .35;
  if (t < tT) { setup(t, { mood: 'dia', light: DAYL }); W.setWater({ vs: 0, spin: 0 });
    W.BARGES.forEach((b, i) => floatOn(b, b.userData.home.x, b.userData.home.z, t + i, 0));
    const R = W.RIG.main; floatOn(R, 0, 0, t, 0, 0);
    const p = sp(t, [[0, V3(-95, 9, 70)], [tT, V3(-34, 6.5, 26)]]); cam(p, V3(4, 7.5, 0), 40, .0012);
    // operarios en la cubierta (plataforma de perforación)
    const R0 = R.position, L = [man('PERF', V3(R0.x + 1.5, 8.5, R0.z + 3.2), { turn: .4, armR: [70 + Math.sin(t * 3) * 10, 60], armL: [20, 30], look: [8, 0] }),
      man('AYUD', V3(R0.x - 3.5, 1.7, R0.z + 5.6), Object.assign(walkPose(t * 5), { turn: -.6 }))];
    return depth(L) + birds(t, 80, 380, .8, 5, 55); }
  // sección: el agua solo tiene 3 m (cota)
  const u = t - tT; setup(t, { mood: 'corte', light: DAYL });
  const p = sp(u, [[0, V3(PX - 14, 1.5, ZF + 40)], [D - tT, V3(PX - 20, 0, ZF + 30)]]); cam(p, V3(PX - 6, -1.2, ZF), 40, .001);
  return dim(V3(PX - 26, 0, ZF + .6), V3(PX - 26, -3.3, ZF + .6), (u - .2) / .4, '#6cc6ff'); };

// =====================================================================================================
// 4 · MINA — la cámara baja por la sección 360 m hasta la mina de sal: cámaras, pilares, camiones y mineros
// =====================================================================================================
function minersFace(t, n = 8, walk = 0) { const L = []; const X = [PX - 4, PX + 3.5, PX - 1, CX + 18, CX - 10, CX + 77, CX + 105, CX - 38, CX - 66, CX + 133];
  for (let i = 0; i < n; i++) { const x = X[i] + Math.sin(t * .8 + i) * walk * 3, F = V3(x, MF + .05, ZF - 3 - (i % 3) * 2); L.push(man(['MIN1', 'MIN2', 'MIN3'][i % 3], F, Object.assign(walk ? walkPose(t * 5 + i) : {}, { turn: (i % 2 ? .5 : -.5), armR: i % 3 === 0 ? [80, 70] : [20, 30] }), { light: MINEL })); } return L; }
S.mina = (t, D, B) => { setup(t, { mood: 'corte', light: MINEL }); const k = eIO(clamp(t / (D * .78)));
  W.MINEL.forEach(l => { l.intensity = 340; l.visible = true; });
  const y = lerp(-6, -366.5, k), dist = lerp(60, 44, k);
  cam(V3(PX - 12 + 12 * k, y + 2, ZF + dist), V3(PX - 12 + 12 * k, y - .5, ZF), lerp(40, 42, k), .001);
  if (k > .3 && k < .95) { const v = Math.sin(Math.PI * (k - .3) / .65); if (typeof TR !== 'undefined' && TR) TR.blur('V', v * 10); }
  return depth(minersFace(t, 8, 1)) + dim(V3(PX - 19 + 12 * k, 0, ZF + 1), V3(PX - 19 + 12 * k, Math.max(MC, y - 1), ZF + 1), clamp(t / .4) * .999 + .001, '#ffd34a'); };

// =====================================================================================================
// 5 · BROCA — la tubería baja por la sección; se atasca; ¡crac!; atraviesa el techo de la mina
// =====================================================================================================
S.broca = (t, D, B) => { setup(t, { mood: 'corte', light: MINEL }); const E = EVS.broca(B); W.MINEL.forEach(l => { l.intensity = 340; l.visible = true; });
  const tA = E.atasca || D * .38, tC = E.crac || D * .52, tP = E.perforar || D * .72;
  // punta de la tubería: baja deprisa hasta el techo, se para, y al «perforar» entra en la mina
  const tip = t < tA ? lerp(-60, MC + 4, eIO(clamp(t / tA))) : t < tP ? MC + 4 - k01(t, tC, tC + .2) * 2 : MC + 2 - 6 * eOut(clamp((t - tP) / .5));
  W.PIPE.scale.y = -tip; W.PIPE.position.y = tip / 2;
  SHAKE = t > tA && t < tP ? .02 + .03 * (1 - clamp((t - tA) / .3)) : t > tP && t < tP + .4 ? .05 : 0;
  const ty = Math.max(tip, MC - 6);
  const p = t < tA ? V3(PX + 12, ty + 6, ZF + 34) : V3(PX + 10, MC - 2, ZF + 30), l = t < tA ? V3(PX, ty - 3, ZF) : V3(PX, MC - 4, ZF);
  cam(p, l, t < tA ? 44 : 40, .001); if (t < tA && typeof TR !== 'undefined' && TR) TR.blur('V', 6);
  const c = W.proj(V3(PX, MC, ZF + .3)); const sc = clamp(Math.abs(W.proj(V3(PX + 1, MC, ZF)).x - c.x) / 30, .3, 1.4);
  let s = crack(c.x, c.y, sc * .9, (t - tC) / .25);
  if (t > tP) { const kk = clamp((t - tP) / .9); for (let i = 0; i < 9; i++) { const x = c.x + (hs(i, 3) - .5) * 160 * sc, y = c.y + 10 + kk * kk * 900 * sc * (.6 + hs(i, 4) * .6), r = (8 + 10 * hs(i, 5)) * sc; s += `<rect x="${(x - r).toFixed(1)}" y="${(y - r).toFixed(1)}" width="${(r * 2).toFixed(1)}" height="${(r * 1.7).toFixed(1)}" rx="${(r * .3).toFixed(1)}" fill="#e6e0d2" stroke="${K}" stroke-width="${(3 * sc).toFixed(1)}" opacity="${(1 - kk * .6).toFixed(2)}" transform="rotate(${(hs(i, 6) * 90 + kk * 200).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; } s += drips(c.x, c.y + 20, sc * 1.2, t, 8, 90); }
  const L = [man('MIN1', V3(PX - 8, MF + .05, ZF - 3), { turn: .6, look: [0, -10], face: t > tC ? 'wide' : 'open', mouth: t > tC ? 'o' : 'line' }), man('MIN2', V3(PX + 9, MF + .05, ZF - 5), { turn: -.6, face: t > tC ? 'wide' : 'open', mouth: t > tC ? 'o' : 'line', armR: [150, 20] })];
  return depth(L) + s; };

// =====================================================================================================
// 6 · CRECE — el agua entra a chorro; el embudo se agranda en tres golpes («crece, crece, crece») y arriba el lago gira
// =====================================================================================================
S.crece = (t, D, B) => { setup(t, { mood: 'corte', light: MINEL }); const E = EVS.crece(B); W.MINEL.forEach(l => { l.intensity = 300; l.visible = true; });
  const words = SCRIPT.find(l => l.sc === 'crece').cap.split(' ').map(w => norm(w.split('|')[0])); const T3 = []; words.forEach((w, i) => { if (w === 'crece') T3.push(B[0].w[i]); }); while (T3.length < 3) T3.push((T3[T3.length - 1] || D * .5) + .6);
  W.PIPE.scale.y = 360; W.PIPE.position.y = -180; W.JET.visible = true; W.JET.material.uniforms.uK.value = clamp(t / .4);
  W.FLOOD.visible = true; W.FLOOD.position.y = MF + .1 + t * .25;
  const g = 1 + T3.filter(x => t > x).length * .9 + k01(t, 0, D) * .3; W.FUNNEL.visible = true; W.FUNNEL.material.uniforms.uK.value = .9;
  { const f = W.FUNNEL.geometry.attributes.position, n = f.count / 2; for (let i = 0; i < n; i++) { const v = i / (n - 1), y = -v * 355, w = (1.2 + 6 * Math.pow(1 - v, 2.2) * g * g + 1.2 * g) * (1 + .06 * Math.sin(v * 40 + t * 6)); f.setXYZ(i * 2, -w, y, 0); f.setXYZ(i * 2 + 1, w, y, 0); } f.needsUpdate = true; }
  W.SU.uVS.value = clamp(.15 * g, 0, .6); W.SU.uSpin.value = t * 1.5;
  // cámara: empieza en la mina y se aleja hacia arriba a cada «crece»
  const z = [[0, [MC - 6, 60]], [T3[0], [MC - 30, 160]], [T3[1], [-220, 330]], [T3[2], [-170, 520]], [D, [-160, 560]]];
  let yy = z[0][1][0], dd = z[0][1][1]; for (let i = 1; i < z.length; i++) { const k = eIO(clamp((t - z[i - 1][0]) / Math.max(.3, z[i][0] - z[i - 1][0]) * 1.4)); if (t > z[i - 1][0]) { yy = lerp(z[i - 1][1][0], z[i][1][0], k); dd = lerp(z[i - 1][1][1], z[i][1][1], k); } }
  yy = Math.max(yy, -426 + Math.tan(21 * Math.PI / 180) * dd);
  cam(V3(PX - 10, yy + 10, ZF + dd), V3(PX - 10, yy, ZF), 42, .0008);
  let s = ''; T3.forEach(x => { if (t > x && t < x + .3) SHAKE = .02; });
  return s + depth(minersFace(t, 6, 1)); };

// =====================================================================================================
// 7 · MINEROS — dentro: ven el agua; corren al ascensor; la jaula sube; salen vivos al sol
// =====================================================================================================
S.mineros = (t, D, B) => { const E = EVS.mineros(B); const tR = (E.corren || D * .38) - .1, tV = (E.salen || D * .72) - .15;
  if (t < tR) { setup(t, { mood: 'mina', light: MINEL }); W.JET.visible = true; W.JET.material.uniforms.uK.value = 1; W.JET.position.set(PX, -366, ZF - 21);
    W.FLOOD.visible = true; W.FLOOD.position.y = MF + .2 + t * .15; W.PIPE.visible = true;
    const p = V3(PX - 34, MF + 2.2, ZF - 18), l = V3(PX, MF + 3.8, ZF - 22); cam(p.clone().lerp(l, .12 * clamp(t / tR)), l, 42, .004);
    const L = [man('MIN1', V3(PX - 22, MF + .05, ZF - 19.5), { turn: .85, face: 'wide', mouth: 'o', armL: [120, 20], armR: [40, 60], sweat: true }, { light: MINEL }),
      man('MIN2', V3(PX - 25, MF + .05, ZF - 23.5), { turn: .7, face: 'wide', mouth: 'o', armR: [160, 10] }, { light: MINEL }),
      man('MIN3', V3(PX - 28.5, MF + .05, ZF - 20.5), { turn: .8, face: 'angry', mouth: 'open', sweat: true }, { light: MINEL })];
    return depth(L) + drips(W.proj(V3(PX, MC, ZF - 21)).x, W.proj(V3(PX, MC, ZF - 21)).y, 1, t, 12, 180); }
  if (t < tV) { const u = t - tR; setup(t, { mood: 'corte', light: MINEL }); W.MINEL.forEach(l => { l.intensity = 300; l.visible = true; });
    W.JET.visible = true; W.JET.material.uniforms.uK.value = 1; W.FLOOD.visible = true; W.FLOOD.position.y = MF + 1.5 + u * .4;
    // jaula subiendo por el pozo con los mineros (cámara la sigue)
    const k = eIO(clamp(u / (tV - tR))), cy = lerp(MF + .4, 4, k); W.CAGE.position.y = cy;
    cam(V3(SX + 14, cy + 6, ZF + 26), V3(SX, cy + 3, ZF - 3), 40, .001); if (k > .1 && k < .9 && typeof TR !== 'undefined' && TR) TR.blur('V', 8);
    const L = [-2, 0, 2].map((dx, i) => man(['MIN1', 'MIN2', 'MIN3'][i], V3(SX + dx, cy + .2, ZF - 3.5), { turn: .2 * (i - 1), face: 'wide', mouth: 'o', sweat: true, armR: [150, 10] }, { light: MINEL, shadow: false }));
    return depth(L); }
  // fuera: el castillete en la isla, salen al sol y celebran
  const u = t - tV; setup(t, { mood: 'dia', light: DAYL }); const h = W.G.headframe.position;
  const p = V3(h.x + 4, W.ground(h.x + 4, h.z + 36) + 2.6, h.z + 36), l = V3(h.x + 1, h.y + 10, h.z + 2); cam(p.clone().lerp(l, .08 * clamp(u / 2)), l, 44, .002);
  const L = [0, 1, 2, 3, 4].map(i => { const w = clamp(u * 1.4 - i * .25), x = h.x + [-6, -4.2, -2.4, 4.4, 6][i], z = h.z + 9 + w * 6 + (i % 2), F = V3(x, W.ground(x, z) + .02, z);
    return man(['MIN1', 'MIN2', 'MIN3'][i % 3], F, Object.assign(w < 1 ? walkPose(u * 6 + i) : {}, { turn: -.3, face: 'happy', mouth: 'laugh', armL: w >= 1 ? [160, 10] : [20, 30], armR: w >= 1 ? [160, 10] : [20, 30] }), { light: DAYL }); });
  return depth(L); };

// =====================================================================================================
// 8 · REMOLINO — el lago gira; se traga la plataforma, las barcazas, los árboles y parte de la isla
// =====================================================================================================
S.remolino = (t, D, B) => { setup(t, { mood: 'drama', light: GREY }); const E = EVS.remolino(B);
  const tG = E.girar || D * .2, tP = E.plataforma || D * .45, tB = E.barcazas || D * .58, tA = E.arboles || D * .7, tI = E.isla || D * .85;
  const k = .25 + .75 * k01(t, 0, tP);
  vortex(t, k, t * 1.3 * k + .5, t < tP ? 2 + t * 1.5 : 2 + tP * 1.5 + 40 * eIO(clamp((t - tP) / 1.6)), t < tP ? .1 + t * .04 : .1 + tP * .04 + .6 * clamp((t - tP) / 1.2));
  W.BARGES.forEach((b, i) => { if (i > 6) { b.visible = false; return; } const tb = tB + i * .16, rr = 62 + i * 13; const r = orbit(b, i, t, rr, i * .9, t < tb ? 1.2 : 1.2 + (t - tb) * (rr / .9), 1); b.visible = r > 2.5; });
  W.TUG.visible = false;
  // árboles de la orilla de la isla: se inclinan, resbalan hacia el agua y desaparecen
  W.ISLTREES.forEach((o, i) => { const kk = k01(t, tA + i * .07, tA + i * .07 + 1.1), h = o.userData.home, dir = V3(-h.x, 0, -h.z).normalize();
    o.position.set(h.x + dir.x * 40 * kk * kk, h.y - 26 * kk * kk, h.z + dir.z * 40 * kk * kk); o.rotation.x = dir.z * 1.3 * kk; o.rotation.z = -dir.x * 1.3 * kk; o.visible = kk < .98; });
  // cámaras: 1) aérea; 2) desde el agua, la plataforma cae; 3) barcazas; 4) la isla se desmorona
  let p, l, f = 44;
  if (t < tP - .2) { const a = .3 + t * .12; p = V3(Math.cos(a) * 120, 110 - t * 6, Math.sin(a) * 120); l = V3(0, -12, 0); }
  else if (t < tA - .2) { const u = t - tP; p = V3(-70 + u * 6, 22, 55); l = V3(0, -10 - u * 3, 0); f = 40; }
  else { const u = t - tA; p = V3(100 + u * 4, 34, 60 - u * 6); l = V3(175, 0, -40 + u * 4); f = 42; }
  SHAKE = .006 + (t > tP && t < tP + .5 ? .02 : 0); cam(p, l, f, .0012);
  return sprayRing(t, V3(0, -4, 0), 34, 28, 1) + (t > tP - .2 && t < tA ? sprayRing(t + 5, W.RIG.main.position.clone().add(V3(0, 2, 0)), 20, 15, 1.2) : ''); };

// =====================================================================================================
// 9 · CASCADA — el canal fluye al revés (los camaroneros van hacia atrás); el mar cae 50 m en el agujero
// =====================================================================================================
S.cascada = (t, D, B) => { const E = EVS.cascada(B); const tF = (E.cae || D * .42) - .25, tL = E.luisiana || D * .86;
  if (t < tF) { setup(t, { mood: 'drama', light: GREY, water: { drain: 1, fall: clamp(t / 1.2), pool: -70 } }); W.RIG.main.visible = false; W.BARGES.forEach(b => b.visible = false); W.TUG.visible = false;
    W.CU.uFlow.value.set(W.CANAL_DIR.x * -6, W.CANAL_DIR.y * -6);
    W.SHRIMPS.forEach((b, i) => { const h = b.userData.home; b.position.set(h.x - W.CANAL_DIR.x * t * 3.2, .3 + Math.sin(t * 2 + i) * .15, h.z - W.CANAL_DIR.y * t * 3.2); b.rotation.z = Math.sin(t * 1.7 + i) * .05; });
    const c0 = LAYOUT.canal[0], d = W.CANAL_DIR, n = V3(-d.y, 0, d.x); const A = V3(c0[0] + d.x * 120, 0, c0[1] + d.y * 120);
    const p = A.clone().addScaledVector(n, 30).add(V3(0, 34, 0)).addScaledVector(V3(d.x, 0, d.y), 20), l = V3(c0[0] + d.x * 45, 0, c0[1] + d.y * 45);
    cam(p.clone().lerp(A.clone().addScaledVector(n, 18).add(V3(0, 48, 0)).addScaledVector(V3(d.x, 0, d.y), -40), eIO(clamp(t / tF))), l.clone().lerp(V3(c0[0] * .55, -30, c0[1] * .55), eIO(clamp(t / tF))), 46, .0012);
    const PE = W.SHRIMPS[0].position, L = [man('PESC', V3(PE.x, 2.2, PE.z), { turn: .7, face: 'wide', mouth: 'o', armL: [150, 20], armR: [150, 20] }, { light: GREY })];
    return depth(L); }
  // la cascada: desde abajo, en la cuenca vacía; la cámara sube a lo largo de la caída
  const u = t - tF; setup(t, { mood: 'drama', light: GREY, water: { drain: 1, fall: clamp(u / .4), pool: -66 } }); W.RIG.main.visible = false; W.BARGES.forEach(b => b.visible = false); W.TUG.visible = false;
  W.CU.uFlow.value.set(W.CANAL_DIR.x * -8, W.CANAL_DIR.y * -8);
  const F = W.FALL, a = F.userData.ang, out = V3(-Math.cos(a), 0, -Math.sin(a)), side = V3(-out.z, 0, out.x), base = F.position.clone();
  const k = eIO(clamp(u / (D - tF)));
  const p = base.clone().addScaledVector(out, lerp(120, 140, k)).addScaledVector(side, lerp(-60, -40, k)).add(V3(0, lerp(-40, -18, k), 0));
  const l = base.clone().addScaledVector(out, 10).add(V3(0, lerp(-26, -23, k), 0));
  SHAKE = .006; cam(p, l, 46, .0012);
  const bot = W.proj(base.clone().addScaledVector(out, 12).add(V3(0, -46, 0))); let sp2 = ''; for (let j = 0; j < 3; j++) sp2 += splash(bot.x + (j - 1) * 60, bot.y, .9, ((u * 1.4 + j / 3) % 1));
  return sp2 + sprayRing(t, base.clone().addScaledVector(out, 12).add(V3(0, -46, 0)), 30, 14, .8) + dim(base.clone().addScaledVector(out, 14).addScaledVector(side, 22).add(V3(0, 0, 0)), base.clone().addScaledVector(out, 14).addScaledVector(side, 22).add(V3(0, -48, 0)), (t - (E.cincuenta || tL - 1.2) + .2) / .4, '#ffd34a'); };

// =====================================================================================================
// 10 · FLOTAN — días después: el lago lleno otra vez; nueve barcazas salen a flote una tras otra
// =====================================================================================================
S.flotan = (t, D, B) => { setup(t, { mood: 'tarde', light: DAYL }); W.RIG.main.visible = false; W.TUG.visible = false; const E = EVS.flotan(B); const tN = (E.nueve || .6) - .2;
  let s = '';
  W.BARGES.forEach((b, i) => { if (i > 8) { b.visible = false; return; } const tb = tN + i * .26, kk = clamp((t - tb) / .7), x = -40 + (i % 3) * 34 + (i > 5 ? 10 : 0), z = -30 + Math.floor(i / 3) * 30;
    b.visible = t > tb; floatOn(b, x, z, t + i, 0, i * .7); b.position.y += -6 * Math.pow(1 - kk, 2) + 1.6 * Math.sin(Math.PI * kk) * (1 - kk);
    b.rotation.x += (1 - kk) * .5 * Math.sin(i); b.rotation.z += (1 - kk) * .4;
    const c = W.proj(V3(x, 0, z)); if (t > tb && t < tb + .6) s += splash(c.x, c.y, .7, (t - tb) / .6); });
  const p = sp(t, [[0, V3(-10, 30, 120)], [D, V3(-4, 26, 100)]]); cam(p, V3(-6, 0, 0), 40, .0012);
  return s; };

// =====================================================================================================
// 11 · FINAL — el lago lleno; la sección muestra el pozo de 400 m de agua; el pescador prueba el agua: ¡salada!
// =====================================================================================================
S.final = (t, D, B) => { const E = EVS.final(B); const tP = (E.pero || D * .25) - .2, tS = (E.salada || D * .85) - .9;
  if (t < tP) { setup(t, { mood: 'tarde', light: DAYL }); W.RIG.main.visible = false; W.BARGES.forEach((b, i) => { b.visible = i < 9; if (i < 9) floatOn(b, -40 + (i % 3) * 34 + (i > 5 ? 10 : 0), -30 + Math.floor(i / 3) * 30, t + i, 0, i * .7); }); W.TUG.visible = false;
    const p = sp(t, [[0, V3(-160, 70, 230)], [tP, V3(-150, 50, 200)]]); cam(p, V3(0, 0, 0), 44, .001); return birds(t, 600, 420, .7, 4, -50); }
  if (t < tS) { const u = t - tP; setup(t, { mood: 'corte', light: DAYL }); W.RIG.corte.visible = false; W.PIPE.visible = false;
    // la sección ahora: el agujero lleno de agua hasta la mina
    W.FUNNEL.visible = true; W.FUNNEL.material.uniforms.uK.value = .95; { const f = W.FUNNEL.geometry.attributes.position, n = f.count / 2; for (let i = 0; i < n; i++) { const v = i / (n - 1), y = -v * 360, w = 10 + 40 * Math.pow(1 - v, 1.6) + 6 * Math.sin(v * 9); f.setXYZ(i * 2, -w, y, 0); f.setXYZ(i * 2 + 1, w, y, 0); } f.needsUpdate = true; }
    W.FLOOD.visible = true; W.FLOOD.position.y = MC - .5;
    const k = eIO(clamp(u / (tS - tP)));
    cam(V3(PX - 10 - 40 * k, lerp(-30, -190, k) + 8, ZF + lerp(220, 640, k)), V3(PX - 10 - 40 * k, lerp(-34, -190, k), ZF), 42, .0002); if (k > .2 && k < .8 && typeof TR !== 'undefined' && TR) TR.blur('V', 2.5 * Math.sin(Math.PI * (k - .2) / .6));
    return dim(V3(PX + 62, 0, ZF + 1), V3(PX + 62, MC, ZF + 1), (u - .5) / .8, '#6cc6ff'); }
  // salada: el pescador en el muelle prueba el agua
  const u = t - tS; setup(t, { mood: 'tarde', light: DAYL }); W.RIG.main.visible = false;
  const dk = W.G.dock.position, F = V3(dk.x + 6, 1.8, dk.z + 1.5);
  cam(V3(F.x + 2.8, F.y + 1.7, F.z + 4.6), V3(F.x, F.y + 1.3, F.z), 36, .004);
  const P = u < .6 ? { armR: [130, 70], holdR: MUG2('#c9ced6'), face: 'open', mouth: 'line', turn: .4 } : { armR: [60, 40], holdR: MUG2('#c9ced6'), face: 'angry', mouth: 'o', turn: .4, sweat: true, squash: .1 };
  return depth([man('PESC', F, P)]) + (u > .6 ? steam(W.proj(V3(F.x, F.y + 1.9, F.z)).x + 30, W.proj(V3(F.x, F.y + 1.9, F.z)).y, 1, u, 3) : ''); };

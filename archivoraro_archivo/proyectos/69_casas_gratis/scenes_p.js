// «Casas gratis en Japón» (69) — ESTILO 3D: world_akiya.js + personajes 2D (cast69.js) + efectos (fx69.js).
// Un plano por frase (y planos internos con barrido cuando la frase cambia de sitio). Cámara siempre en movimiento,
// pose a pose con «snap», textos solo dentro del mundo (etiqueta ¥0, móvil, cartel de precio, sello, pancarta).
window.CFG = { capY: 1500, capSize: 96, transDur: .42, blurK: .35, antic: .1, blurChars: false,
  transDurBy: { vacias: .6, pues: .2, ficha: .4, final: .6 },
  trans: { vacias: 'fly', web: 'swish', ficha: 'swish', estafa: 'whip', pues: 'cut', verla: 'swish', dentro: 'swish', salir: 'whip', vecina: 'swish', nueve: 'swish', pagan: 'whip',
    encantadas: 'swish', alguna: 'whip', normales: 'swish', nada: 'swish', historia: 'swish', dueno: 'whip', tirarla: 'swish', dejan: 'whip', venderla: 'whip', pierden: 'swish', treinta: 'whip', final: 'swish' } };
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { const ws = l.cap.split(' ').map(w => norm(w.split('|')[0])); EVS[l.sc] = B => { const o = {}; ws.forEach((w, i) => { const k = /^[0-9]/.test(w) ? '_' + w : w; if (k && !(k in o)) o[k] = B[0].w[i]; }); o._last = B[0].w[ws.length - 1]; return o; }; });
const S = {}, W = W2, ADULT = 1.84, IX = W.IX, IY = W.IY, AX = W.AX, OX = W.OX, SX = W.SX, TX = W.TX;
window.READY = Promise.resolve();
const hs = (a, b = 1) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const k01 = (t, a, b) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const oc = k => 1 - Math.pow(1 - clamp(k), 3), snap = (t, t0, d = .5) => 1 - Math.pow(1 - clamp((t - t0) / d), 4), rad = a => a * Math.PI / 180;
// ---------- cámara (deriva de cámara en mano + sacudida) ----------
let SHAKE = 0;
{ const _sc = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * 4.59) * .5 + Math.sin(T * 8.61) * .3, Math.sin(T * 5.3 + 1) * .5 + Math.sin(T * 9.7) * .25, 0).multiplyScalar(.012 * p.distanceTo(l) / 8);
  const sh = SHAKE > 0 ? V3(Math.sin(T * 91) * SHAKE, Math.sin(T * 77 + 2) * SHAKE, 0) : V3(0, 0, 0); return _sc(p.clone().add(d).add(sh), l.clone().add(d.multiplyScalar(.35)).add(sh.multiplyScalar(.6)), f, fo, ap); }; }
const cam = (p, l, f = 40, ap = .0022) => { W.setCam(p, l, f, p.distanceTo(l), ap); W.render(); };
const pushIn = (p0, tg, k, factor = 1.9) => tg.clone().add(p0.clone().sub(tg).divideScalar(lerp(1, factor, oc(k))));
function sp(t, Ks) { const n = Ks.length; if (t <= Ks[0][0]) return Ks[0][1].clone(); if (t >= Ks[n - 1][0]) return Ks[n - 1][1].clone(); let i = 0; while (t > Ks[i + 1][0]) i++;
  const u = (t - Ks[i][0]) / (Ks[i + 1][0] - Ks[i][0]), a = Ks[Math.max(0, i - 1)][1], b = Ks[i][1], c = Ks[i + 1][1], d = Ks[Math.min(n - 1, i + 2)][1], u2 = u * u, u3 = u2 * u;
  const f = (p0, p1, p2, p3) => .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); return V3(f(a.x, b.x, c.x, d.x), f(a.y, b.y, c.y, d.y), f(a.z, b.z, c.z, d.z)); }
// cambio de plano DENTRO de una escena: barrido horizontal con desenfoque (como los de la referencia, pero nuestro)
function whipBlur(t, t0, dur = .22) { const k = clamp((t - t0 + dur / 2) / dur); if (k > 0 && k < 1 && typeof TR !== 'undefined' && TR) TR.blur('H', Math.sin(Math.PI * k) * 26); }
// ---------- 2D anclado al mundo ----------
function frameOf(F, h) { const pf = W.proj(F), pt = W.proj(V3(F.x, F.y + h, F.z)), dx = pt.x - pf.x, dy = pt.y - pf.y, L = Math.hypot(dx, dy); return { x: pf.x, y: pf.y, s: L / 462, r: Math.atan2(dx, -dy), ok: pf.ok && pt.ok }; }
const rot2 = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
function toScr(fr, x, y, lean = 0) { let [a, b] = rot2(x, y, rad(lean)); [a, b] = rot2(a * fr.s, b * fr.s, fr.r); return [fr.x + a, fr.y + b]; }
const headScr = (F, h = ADULT) => W.proj(V3(F.x, F.y + h, F.z));
// ---------- poses ----------
function mixP(A, B, k) { const o = Object.assign({}, A, B); for (const key in B) { const a = A[key], b = B[key]; if (typeof b === 'number' && typeof a === 'number') o[key] = lerp(a, b, k); else if (Array.isArray(b) && Array.isArray(a) && typeof b[0] === 'number') o[key] = b.map((v, i) => lerp(a[i] ?? v, v, k)); } return o; }
function seq(t, L, dur = .45) { let P = Object.assign({}, L[0][1]); for (let j = 1; j < L.length; j++) { if (t < L[j][0] - .034) break; P = mixP(P, L[j][1], snap(t, L[j][0], L[j][2] || dur)); } return P; }
const talkM = (T, a, b, rest = 'line') => (T >= a && T <= b) ? ['open', 'o', 'smile', 'open', 'o'][Math.floor(hs(Math.floor(T * 15), 3) * 5)] : rest;
const C69 = window.CAST69;
const onScr = (F, h) => { const a = W.proj(F), b = W.proj(V3(F.x, F.y + h, F.z)); if (!a.ok || !b.ok) return false; const m = 560; return !(Math.max(a.x, b.x) < -m || Math.min(a.x, b.x) > 1080 + m || Math.max(a.y, b.y) < -m || Math.min(a.y, b.y) > 1920 + m); };
const who = (name, o, F, h = ADULT, opt) => onScr(F, h + .6) ? stickAt(Object.assign({}, typeof name === 'string' ? C69[name] : name, o), F, V3(F.x, F.y + h, F.z), W, opt) : '';
const PHONE_SVG = `<g transform="rotate(-12)"><rect x="-26" y="-58" width="52" height="96" rx="9" fill="#1b1d24" stroke="${K}" stroke-width="7"/><rect x="-19" y="-50" width="38" height="78" rx="4" fill="#bff0d0"/><rect x="-19" y="-50" width="38" height="14" fill="#2f7a4a"/></g>`;
// recorta lo que quede por debajo de y (personaje detrás de un mostrador o mesa)
let _clip = 0; const clipAbove = (svg, y) => { const id = 'cl' + (++_clip); return `<defs><clipPath id="${id}"><rect x="-2000" y="-2000" width="5080" height="${(y + 2000).toFixed(1)}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; };
// ---------- luces de personaje ----------
const DAY = { tint: '#ffe2bd', k: .14, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.6 }, NIGHT = { tint: '#8f9cff', k: .34, rim: '#9fd0ff', rimA: .7, rimX: 1, rimY: -.6 },
  IN = { tint: '#ffd9a8', k: .2, rim: '#fff0d0', rimA: .55, rimX: 1, rimY: -.5 }, APTL = { tint: '#c8b0ff', k: .25, rim: '#ffd0a0', rimA: .6, rimX: -1, rimY: -.5 }, OFFL = { tint: '#f4f6ff', k: .1, rim: '#ffffff', rimA: .45, rimX: -1, rimY: -.6 };
// ---------- dibujos 2D propios ----------
function bird(x, y, s, ph) { const f = Math.sin(ph) * .8; return `<path d="M${x - s},${y - s * f * .6} Q${x - s * .45},${y - s * (.4 + f * .3)} ${x},${y} Q${x + s * .45},${y - s * (.4 + f * .3)} ${x + s},${y - s * f * .6}" stroke="${K}" stroke-width="${Math.max(2, s * .16).toFixed(1)}" fill="none" stroke-linecap="round"/>`; }
function leaf(x, y, s, r, col) { return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(0)})"><path d="M${-s},0 Q0,${-s * .7} ${s},0 Q0,${s * .7} ${-s},0Z" fill="${col}" stroke="${K}" stroke-width="${Math.max(1.5, s * .14).toFixed(1)}"/></g>`; }
function bill2d(x, y, s, r, sk = 1) { return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${(s * sk).toFixed(2)},${s.toFixed(2)})"><rect x="-60" y="-30" width="120" height="60" rx="4" fill="#e8dcc0" stroke="${K}" stroke-width="6"/><rect x="-50" y="-21" width="100" height="42" fill="none" stroke="#9a8a6a" stroke-width="4"/><circle cx="22" cy="0" r="14" fill="#b8a88a"/><path d="M-40,-8 L-14,-8 M-40,6 L-20,6" stroke="#7a6a4a" stroke-width="6"/></g>`; }
function cat2d(p, ppm, t, yawn) { const s = ppm / 260; return `<g transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)}) scale(${s.toFixed(3)})"><ellipse cx="0" cy="8" rx="120" ry="18" fill="#000" opacity=".18"/>
  <path d="M-110,0 C-120,-70 40,-90 100,-30 C120,-10 110,10 80,10 L-100,10 Z" fill="#f2a24a" stroke="${K}" stroke-width="9"/><path d="M-40,-62 Q-30,-30 -50,6 M10,-66 Q20,-30 0,6 M55,-48 Q60,-20 45,8" stroke="#c87a2a" stroke-width="9" fill="none"/>
  <path d="M-108,-4 C-150,-10 -160,30 -120,30 C-100,30 -96,10 -110,4" fill="#f2a24a" stroke="${K}" stroke-width="8"/>
  <g transform="translate(96,-44) rotate(${(Math.sin(t * 2) * 3).toFixed(1)})"><circle r="44" fill="#f2a24a" stroke="${K}" stroke-width="9"/><path d="M-36,-26 L-30,-66 L-8,-40 Z M36,-26 L30,-66 L8,-40 Z" fill="#f2a24a" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  ${yawn > .1 ? `<path d="M-22,-4 Q-14,-12 -6,-4 M6,-4 Q14,-12 22,-4" stroke="${K}" stroke-width="6" fill="none"/><ellipse cx="0" cy="18" rx="${(12 * yawn).toFixed(1)}" ry="${(16 * yawn).toFixed(1)}" fill="#7a2030" stroke="${K}" stroke-width="5"/>` : `<path d="M-24,0 Q-14,8 -4,0 M4,0 Q14,8 24,0" stroke="${K}" stroke-width="6" fill="none"/><path d="M-6,14 L0,20 L6,14" stroke="${K}" stroke-width="5" fill="none"/>`}</g>
  ${yawn > .1 ? '' : `<text x="150" y="${(-100 - (t * 30) % 40).toFixed(0)}" font-family="Inter" font-weight="900" font-size="34" fill="#fff" stroke="${K}" stroke-width="7" paint-order="stroke">z</text>`}</g>`; }
function butterfly(x, y, s, t, col) { const f = Math.abs(Math.sin(t * 14)) * .8 + .2; return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(2)})"><ellipse cx="-12" cy="-6" rx="${(14 * f).toFixed(1)}" ry="12" fill="${col}" stroke="${K}" stroke-width="4"/><ellipse cx="12" cy="-6" rx="${(14 * f).toFixed(1)}" ry="12" fill="${col}" stroke="${K}" stroke-width="4"/><path d="M0,-14 L0,10" stroke="${K}" stroke-width="5" stroke-linecap="round"/></g>`; }
// contenido de bocadillos (dibujos, nunca texto)
const TRAP_SVG = `<rect x="-90" y="10" width="180" height="40" rx="6" fill="#c89a5a" stroke="${K}" stroke-width="7"/><path d="M-70,10 C-70,-50 70,-50 70,10" stroke="#9aa3ad" stroke-width="9" fill="none"/><path d="M-60,10 L60,10" stroke="#9aa3ad" stroke-width="6"/>
  <g transform="translate(0,-8)"><rect x="-26" y="-14" width="52" height="30" fill="#efe6d2" stroke="${K}" stroke-width="5"/><path d="M-36,-12 L0,-40 L36,-12 Z" fill="#d2283a" stroke="${K}" stroke-width="5" stroke-linejoin="round"/></g>`;
const CAL_SVG = (t) => { let s = ''; for (let i = 0; i < 4; i++) { const k = ((t * 1.6 + i / 4) % 1), x = -40 + k * 110, y = -30 - k * 50, r = k * 140; s += `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) rotate(${r.toFixed(0)})" opacity="${(1 - k).toFixed(2)}"><rect x="-26" y="-30" width="52" height="60" fill="#fff" stroke="${K}" stroke-width="5"/><rect x="-26" y="-30" width="52" height="14" fill="#d2283a"/></g>`; }
  return `<rect x="-60" y="-40" width="90" height="100" fill="#fff" stroke="${K}" stroke-width="7"/><rect x="-60" y="-40" width="90" height="24" fill="#d2283a" stroke="${K}" stroke-width="7"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${-50 + (i % 3) * 26}" y="${-6 + Math.floor(i / 3) * 20}" width="16" height="12" fill="#c9c2b0"/>`).join('') + s; };
const QHOUSE_SVG = `<rect x="-50" y="-10" width="100" height="56" fill="#efe6d2" stroke="${K}" stroke-width="7"/><path d="M-66,-8 L0,-60 L66,-8 Z" fill="#5a6070" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><rect x="10" y="10" width="22" height="36" fill="#3b2a1e"/>`;
// retrato funerario del dueño (en blanco y negro) proyectado en el marco del altar
function portrait2d(k = 1) { const M = W.PORTRAIT; M.updateMatrixWorld(); const c = [[-.19, .24], [.19, .24], [-.19, -.24]].map(([x, y]) => W.proj(M.localToWorld(V3(x, y, .002))));
  if (!c.every(q => q.ok)) return ''; const a = (c[1].x - c[0].x) / 380, b = (c[1].y - c[0].y) / 380, cc = (c[2].x - c[0].x) / 480, d = (c[2].y - c[0].y) / 480;
  return `<defs><filter id="bw"><feColorMatrix type="saturate" values="0"/></filter><clipPath id="pc"><rect x="0" y="0" width="380" height="480"/></clipPath></defs><g transform="matrix(${a.toFixed(4)},${b.toFixed(4)},${cc.toFixed(4)},${d.toFixed(4)},${c[0].x.toFixed(1)},${c[0].y.toFixed(1)})" opacity="${k}">
    <rect width="380" height="480" fill="#d9d6ce"/><g clip-path="url(#pc)" filter="url(#bw)"><g transform="translate(190,690) scale(.95)">${stick(Object.assign({}, C69.DUENO, { face: 'happy', mouth: 'smile', armL: [10, 10], armR: [10, 10] }))}</g></g>
    <path d="M0,0 L120,0 L0,120 Z M380,0 L260,0 L380,120 Z" fill="#141018"/><rect width="380" height="480" fill="none" stroke="#141018" stroke-width="10"/></g>`; }
function smoke(x, y, s, t) { let d = ''; for (let i = 0; i < 3; i++) { const ph = t * 1.4 + i * 2.1; d += `<path d="M${x},${y} C${x + Math.sin(ph) * 20 * s},${y - 60 * s} ${x - Math.sin(ph + 1) * 26 * s},${y - 120 * s} ${x + Math.sin(ph + 2) * 18 * s},${y - 190 * s}" stroke="#e8e4dc" stroke-opacity="${(.5 - i * .12).toFixed(2)}" stroke-width="${(5 * s).toFixed(1)}" fill="none" stroke-linecap="round"/>`; } return d; }
const shakeAt = (t, t0, a = .06, dec = 22) => { const dt = t - t0; return dt > 0 && dt < .5 ? Math.exp(-dt * dec) * a : 0; };
// estado del mundo por defecto (cada escena cambia lo que necesite ANTES de cam())
function setup(T, mood = 0, night = 0, light = DAY) { W.setTime(T); W.setMood(mood, night); W.charLight = light; SHAKE = 0; W.setGift(0); W.setDoor(W.HOUSE, 0); W.setPhone({ show: false }); W.setPins(0); W.setStamp(0);
  W.setDigger({ on: false }); W.setBills(0); W.setCoins(0); W.setHouseGone(false); W.setAge(0); W.setPrice(3e7); W.TT_CAR.rotation.y = T * .5; W.TT_HOUSE.rotation.y = -T * .5 + 1; }

// =============================== ESCENAS ===============================
// 1 · «En Japón te regalan casas»: el lazo cae desde el cielo sobre la casa y rebota; tú, en la carretera, das un salto atrás.
const GIFT_CAM = [V3(8.6, 1.3, 10.6), V3(-1.4, 3.1, -4.6)], TU_ROAD = V3(6.5, 0, 6.7);
function giftDrop(t, tLand, t0 = -.35) { const u = clamp((t - t0) / (tLand - t0)); const k = u < 1 ? .55 + .45 * u * u : 1; const after = t - tLand; const sq = after > 0 && after < .5 ? Math.sin(after / .5 * Math.PI) * Math.exp(-after * 4) * .22 : 0; return { k, sq, landed: after >= 0, after }; }
S.regalo = (t, D, B) => { const E = EVS.regalo(B), T = window.__T || t; setup(T); const tl = E.regalan + .02, g = giftDrop(t, tl); W.setGift(g.k, T, g.sq);
  SHAKE = shakeAt(t, tl, .09); const cp = L3(GIFT_CAM[0], V3(8.4, 1.35, 10.3), oc(t / (D + .6))); cam(cp, GIFT_CAM[1], 60);
  const P = seq(t, [[0, { face: 'wide', mouth: 'o', look: [-8, -12], turn: -.3, armL: [24, 30], armR: [30, 40], headTilt: 6, lean: 0 }], [tl, { face: 'wide', mouth: 'grin', look: [-10, -14], armL: [70, 60], armR: [80, 60], lean: 9, bob: -10, sweat: true }, .25]]);
  const bow = W.proj(V3(0, 7.55, -5.4)), base = W.proj(V3(0, .3, -1.4));
  return who('TU', P, TU_ROAD) + (g.landed ? impact(bow.x, bow.y, bow.ppm * 2.4, clamp(g.after / .45)) + puff(base.x - 160, base.y, base.ppm * 1.4, clamp(g.after / .7)) + puff(base.x + 220, base.y, base.ppm * 1.2, clamp((g.after - .05) / .7)) : ''); };
// 2 · «Y aun así, hay millones vacías»: grúa desde las casas cerradas del otro lado de la carretera hasta el valle lleno de casas.
S.vacias = (t, D, B) => { const E = EVS.vacias(B), T = window.__T || t; setup(T); const k = oc(t / D);
  const cp = sp(k, [[0, V3(-14, 3.0, 9.6)], [.5, V3(-22, 14, 26)], [1, V3(-40, 34, 58)]]), cl = sp(k, [[0, V3(-24, 2.2, 20)], [.5, V3(-12, 2, -10)], [1, V3(4, -2, -44)]]); cam(cp, cl, lerp(46, 52, k));
  let s = ''; for (let i = 0; i < 5; i++) { const x = (120 + i * 190 + T * 140) % 1300 - 110, y = 360 + Math.sin(i * 2 + T) * 60 + i * 30; s += bird(x, y, 22 - i * 2, T * 9 + i); } return s; };
// 3 · «Entras en el akiya bank…»: tu piso de noche, la cara iluminada por el móvil.
S.web = (t, D, B) => { const E = EVS.web(B), T = window.__T || t; setup(T, 0, 1, APTL); const p0 = V3(AX + 1.5, 1.45, 2.1), tg = V3(AX - .45, 1.2, -1.2); cam(pushIn(p0, tg, t / D, 1.15), tg, 54);
  const F = V3(AX - .3, 0, -.9), P = seq(t, [[0, { face: 'smug', mouth: 'line', look: [12, 10], armR: [62, 96], armL: [16, 24], holdR: PHONE_SVG, headTilt: 6 }], [E.akiya, { face: 'open', mouth: 'o', look: [8, 12], brows: .4 }, .3], [E.abandonadas, { face: 'smug', mouth: 'smirk', brows: -.2 }, .3]]);
  const hp = headScr(F); return who('TU', P, F) + `<circle cx="${(hp.x + 140).toFixed(0)}" cy="${(hp.y + 260).toFixed(0)}" r="${(hp.ppm * .9).toFixed(0)}" fill="#bff0d0" opacity="${(.18 + .06 * Math.sin(T * 7)).toFixed(2)}" style="filter:blur(40px)"/>`; };
// 4 · «Tres habitaciones… Precio: cero yenes»: el móvil en primer plano, sujeto por tus manos; las camas se encienden, la montaña se marca y cae el ¥0.
S.ficha = (t, D, B) => { const E = EVS.ficha(B), T = window.__T || t; setup(T, 0, 1, APTL); const beds = t < E._3 ? 0 : 1 + Math.floor(clamp((t - E._3) / .5) * 2.99);
  const tp = E._0 - .05; W.setPhone({ show: true, scroll: lerp(0, 60, k01(t, E.precio - .6, E.precio)), beds, mountain: t > E.montana - .1, price: t > tp ? '¥0' : null, stamp: clamp((t - tp - .35) / .2) }); SHAKE = shakeAt(t, tp, .004, 26);
  const p = W.PHONE.position, tilt = Math.sin(T * 1.3) * .01, p0 = V3(p.x + .02 + tilt, p.y + .02, p.z + .26), tg = V3(p.x, p.y - .005, p.z); cam(pushIn(p0, tg, t / D, 1.12), tg, 46, .0012);
  const hl = W.proj(W.PHONE.localToWorld(V3(-.43, -.5, -.05))), hr = W.proj(W.PHONE.localToWorld(V3(.43, -.42, -.05))), pr = W.proj(W.PHONE.localToWorld(V3(.1, -.4, .04)));
  const hand = (q, r) => `<g transform="translate(${q.x.toFixed(1)},${q.y.toFixed(1)}) rotate(${r})"><ellipse rx="${(q.ppm * .012).toFixed(1)}" ry="${(q.ppm * .022).toFixed(1)}" fill="${K}"/></g>`;
  return hand(hl, 18) + hand(hr, -12) + impact(pr.x, pr.y, 260, clamp((t - tp) / .4)); };
// 5 · «Esto es una estafa»: cara de sospecha y bocadillo con una ratonera con una casita de cebo.
const TU_APT = V3(AX - .3, 0, -.9);
S.estafa = (t, D, B) => { const E = EVS.estafa(B), T = window.__T || t; setup(T, 0, 1, APTL); const p0 = V3(AX + .3, 1.75, 2.2), tg = V3(AX - .3, 1.95, -.9); cam(pushIn(p0, tg, t / D, 1.1), tg, 44);
  const P = { face: 'smug', mouth: 'line', brows: -.7, browTilt: .5, look: [-10, -4], armR: [62, 96], armL: [96, 140], holdR: PHONE_SVG, headTilt: -4 }; const hp = headScr(TU_APT);
  return who('TU', P, TU_APT) + thought(hp.x + 210, hp.y - 360, 520, clamp((t - .15) / .3), TRAP_SVG, hp.x + 90, hp.y - 120); };
// 6 · «Pues no»: abres los ojos como platos y salta el ✔ verde (en la web sale el sello oficial del ayuntamiento).
S.pues = (t, D, B) => { const E = EVS.pues(B), T = window.__T || t; setup(T, 0, 1, APTL); const p0 = V3(AX + .25, 1.8, 2.0), tg = V3(AX - .3, 1.9, -.9); cam(pushIn(p0, tg, t / D, 1.1), tg, 44);
  const P = seq(t, [[0, { face: 'wide', mouth: 'o', brows: .6, look: [0, 2], armR: [62, 96], armL: [16, 24], holdR: PHONE_SVG, bob: -6 }], [E.no, { face: 'wide', mouth: 'grin', bob: -14, armL: [40, 30] }, .2]]); const hp = headScr(TU_APT);
  return who('TU', P, TU_APT) + popIcon('ok', hp.x + 230, hp.y - 200, 120, clamp((t - E.no + .1) / .25)); };
// 7 · «Vas a verla. La puerta está abierta»: andas por la carretera del pueblo hasta la casa; la puerta se desliza sin llave.
S.verla = (t, D, B) => { const E = EVS.verla(B), T = window.__T || t; setup(T); const tc = E.la - .12; whipBlur(t, tc);
  if (t < tc) { const x = lerp(-5.2, .6, t / tc), F = V3(x, 0, 7.6), wp = walkPose(t * 7.4, { amp: 1 }); const cp = V3(x - 1.6, 1.45, 11.6), cl = V3(x + .9, 1.4, 6.0); cam(cp, cl, 48);
    return who('TU', Object.assign({ face: 'smug', mouth: 'smirk', look: [10, 0], turn: .75 }, wp), F); }
  const u = t - tc, door = k01(t, E.abierta - .3, E.abierta + .25); W.setDoor(W.HOUSE, door); const p0 = V3(5.4, 1.7, 4.4), tg = V3(2.5, 1.3, -1.5); cam(pushIn(p0, tg, u / (D - tc), 1.25), tg, 46);
  const F = V3(2.45, .1, -.35), P = seq(t, [[tc, { view: 'back', armR: [20, 20], armL: [16, 20] }], [E.abierta - .45, { view: 'back', armR: [96, 20], armL: [16, 20] }, .25], [E.abierta + .2, { view: 'back', armR: [70, 30], armL: [16, 20], lean: -3 }, .3]]);
  return who('TU', P, F); };
// 8 · «Dentro siguen las zapatillas, las tazas del té y un periódico de 2003…»: tres planos de detalle.
S.dentro = (t, D, B) => { const E = EVS.dentro(B), T = window.__T || t; setup(T, 0, 0, IN); const c1 = E.tazas - .14, c2 = E.periodico - .14; whipBlur(t, c1); whipBlur(t, c2);
  let s = motes(T, 26, .45);
  if (t < c1) { const k = oc(t / c1); cam(L3(V3(IX + 5.55, IY + .22, 1.35), V3(IX + 5.25, IY + .2, .05), k), L3(V3(IX + 4.44, IY - .02, -.35), V3(IX + 4.44, IY, -1.05), k), 48, .003); return s; }
  if (t < c2) { const k = oc((t - c1) / (c2 - c1)), a = lerp(.4, -.2, k); const tg = V3(IX - .33, IY + .43, .15); cam(V3(tg.x + Math.sin(a) * 1.05, IY + 1.0, tg.z + Math.cos(a) * 1.05), tg, 44, .003);
    return s; }
  const k = oc((t - c2) / (D - c2)), dp = W.NEWS.localToWorld(V3(.19, .15, 0)), np = W.NEWS.localToWorld(V3(0, 0, 0)); const look = L3(np, dp, k); cam(V3(look.x + .02, IY + lerp(1.3, .82, k), look.z + .06), look, 44, .002);
  const q = W.proj(dp); return s + ring(q.x, q.y, 140, clamp((t - E._2003) / .5), '#d2283a'); };
// 9 · «Como si alguien acabara de salir»: miras alrededor, polvo en la luz, «!».
S.salir = (t, D, B) => { const E = EVS.salir(B), T = window.__T || t; setup(T, 0, 0, IN); const p0 = V3(IX + 3.7, IY + 1.55, 2.5), tg = V3(IX + .3, IY + .8, -1.1); cam(pushIn(p0, tg, t / D, 1.25), tg, 58);
  const F = V3(IX + 1.3, IY, -1.0), P = seq(t, [[0, { face: 'smug', mouth: 'line', look: [-12, 0], turn: -.35, armL: [16, 22], armR: [16, 22] }], [D * .3, { look: [12, -2], headTilt: 4 }, .3], [E.salir - .1, { face: 'wide', mouth: 'grin', look: [-6, -2], sweat: true, armL: [40, 50], armR: [44, 50], bob: -8 }, .2]]);
  const hp = headScr(F); return motes(T, 34, .55) + who('TU', P, F) + popIcon('!', hp.x - 10, hp.y - hp.ppm * 1.0, 110, clamp((t - E.salir + .05) / .25)); };
// 10 · «La vecina te dice que ahí no entra nadie desde hace 20 años»: delante de su casa, señala la casa del regalo; bocadillo con hojas de calendario volando.
S.vecina = (t, D, B) => { const E = EVS.vecina(B), T = window.__T || t; setup(T); const p0 = V3(9.4, 1.5, 12.8), tg = V3(12.1, 1.35, 6.2); cam(pushIn(p0, tg, t / D, 1.15), tg, 40);
  const FV = V3(12.4, 0, 6.3), FT = V3(10.5, 0, 9.0), talk = talkM(T, E.te, E._last + .2, 'smile');
  const PV = seq(t, [[0, { face: 'smug', mouth: talk, look: [-12, 0], turn: -.4, armL: [20, 30], armR: [20, 30] }], [E.nadie - .15, { armL: [112, 26], look: [-14, -2] }, .3], [E._20 - .1, { armL: [24, 30], face: 'happy', mouth: talk }, .35]]); PV.mouth = talk;
  const PT = seq(t, [[0, { turn: .7, face: 'smug', mouth: 'line', look: [10, -2], armL: [16, 20], armR: [16, 20] }], [E.nadie, { face: 'wide', mouth: 'o', look: [-12, 0] }, .25]]); const hv = headScr(FV, 1.62);
  return who('TU', PT, FT) + who('VECINA', PV, FV, 1.62) + thought(hv.x + 120, hv.y - 330, 330, clamp((t - E._20 + .15) / .3), CAL_SVG(T), hv.x + 40, hv.y - 110); };
// 11 · «…9 millones de casas vacías»: maqueta de Japón; se llena de casitas de tejado rojo mientras la cámara sube.
S.nueve = (t, D, B) => { const E = EVS.nueve(B), T = window.__T || t; setup(T, 0, 0, OFFL); const c = W.MAPC, k = oc(t / D); W.setPins(k01(t, E.japon - .1, E.millones + .15), T);
  cam(L3(V3(c.x + .05, 1.85, c.z + .5), V3(c.x + .05, 2.85, c.z + 1.05), k), L3(V3(c.x, .95, c.z - .02), V3(c.x, .9, c.z - .12), k), lerp(52, 66, k), .002); SHAKE = shakeAt(t, E._9, .01);
  return t > E._9 ? `<rect width="1080" height="1920" fill="#fff" opacity="${(.35 * Math.exp(-(t - E._9) * 8)).toFixed(3)}"/>` : ''; };
// 12 · «Hay pueblos que hasta te pagan por vivir en una»: el funcionario lanza billetes de 10.000 yenes por encima del mostrador.
S.pagan = (t, D, B) => { const E = EVS.pagan(B), T = window.__T || t; setup(T, 0, 0, OFFL); const p0 = V3(OX + .4, 1.55, 3.3), tg = V3(OX - 1.6, 1.45, -.4); cam(pushIn(p0, tg, t / D, 1.12), tg, 52);
  const FF = V3(OX - 1.4, 0, -.6), FT = V3(OX - 2.7, 0, 1.3), tp = E.pagan - .1;
  const PF = seq(t, [[0, { face: 'happy', mouth: 'smile', look: [8, 2], armL: [30, 30], armR: [30, 30] }], [tp, { face: 'happy', mouth: 'laugh', armL: [150, 30], armR: [150, 30], bob: -12 }, .2]]);
  const PT = seq(t, [[0, { turn: .6, face: 'smug', mouth: 'line', look: [10, -2], armL: [16, 20], armR: [16, 20] }], [tp + .1, { face: 'wide', mouth: 'grin', look: [-6, -10], armL: [120, 40], armR: [124, 40], bob: -10 }, .25]]);
  const cy = W.proj(V3(OX - 1.4, 1.1, -.15)).y; let bills = ''; if (t > tp) for (let i = 0; i < 26; i++) { const u = t - tp - (i % 8) * .06; if (u < 0) continue; const x0 = OX - 1.6 + (hs(i, 1) - .5) * 1.4, vx = (hs(i, 2) - .3) * 1.4, vy = 1.6 + hs(i, 3) * 1.6;
    const y = Math.max(.05, 2.4 + vy * u - 2.2 * u * u), z = -.2 + u * (.6 + hs(i, 4)), q = W.proj(V3(x0 + vx * u + Math.sin(u * 6 + i) * .15, y, z)); if (q.ok) bills += bill2d(q.x, q.y, q.ppm / 900, (u * 260 + i * 40) % 360, Math.cos(u * 9 + i)); }
  return clipAbove(who('FUNC', PF, FF), cy) + who('TU', PT, FT) + bills; };
// 13 · «¿Están encantadas?»: de noche, la casa con la puerta entreabierta; la cámara se acerca despacio.
const NIGHT_CAM = [V3(-.4, 1.5, 11.2), V3(1.9, 1.9, -1.6)], TU_N = V3(-.3, 0, 6.6);
S.encantadas = (t, D, B) => { const E = EVS.encantadas(B), T = window.__T || t; setup(T, 0, 1, NIGHT); W.setDoor(W.HOUSE, .45); cam(pushIn(NIGHT_CAM[0], NIGHT_CAM[1], t / (D + 4.9), 1.25), NIGHT_CAM[1], 50);
  const P = { face: 'smug', mouth: 'line', brows: .5, look: [10, -4], turn: .4, armL: [16, 22], armR: [16, 22], sweat: true }, hp = headScr(TU_N);
  return who('TU', P, TU_N) + popIcon('?', hp.x + 20, hp.y - hp.ppm * 1.0, 120, clamp((t - E.encantadas + .1) / .3)); };
// 14 · «Alguna sí: si alguien murió dentro de mala manera, te lo tienen que avisar»: sale el fantasma; corte a la inmobiliaria y ¡pum!, sello rojo en la ficha.
S.alguna = (t, D, B) => { const E = EVS.alguna(B), T = window.__T || t; const tc = E.mala - .12; whipBlur(t, tc);
  if (t < tc) { setup(T, 0, 1, NIGHT); W.setDoor(W.HOUSE, .45); const kk = (t + D * 0 + 1.24) / (1.24 + 4.9); cam(pushIn(NIGHT_CAM[0], NIGHT_CAM[1], kk, 1.25), NIGHT_CAM[1], 50);
    const out = oc(clamp((t - E.alguna + .25) / .7)), gp = W.proj(V3(2.85, 2.25, lerp(-2.0, -.9, out))); const P = seq(t, [[0, { face: 'smug', mouth: 'line', brows: .5, look: [10, -4], turn: .4, armL: [16, 22], armR: [16, 22], sweat: true }], [E.alguna, { face: 'wide', mouth: 'grin', lean: 8, armL: [80, 70], armR: [86, 70], bob: -12, look: [12, -4] }, .2]]);
    return ghost2d(gp, gp.ppm, { t: T, op: .92 * out, face: t > E.murio ? 'sad' : 'scared', look: [-10, 4] }) + wisp(gp.x - 170, gp.y - 130 + Math.sin(T * 3) * 10, 15, T) + wisp(gp.x + 180, gp.y - 70, 11, T, 1) + who('TU', P, TU_N); }
  setup(T, 0, 0, OFFL); const st = clamp((t - (E.avisar - .45)) / .9); W.setStamp(st); const p0 = V3(OX - 1.5, 1.8, 3.35), tg = V3(OX - 2.6, 1.3, 1.5); SHAKE = shakeAt(t, E.avisar, .02); cam(pushIn(p0, tg, (t - tc) / (D - tc), 1.2), tg, 52);
  const FA = V3(OX - 2.6, 0, 1.25), PA = seq(t, [[tc, { face: 'smug', mouth: 'line', look: [4, 8], armR: [40, 40], armL: [20, 30] }], [E.avisar - .45, { armR: [110, 30], face: 'angry', mouth: 'line', brows: -.4 }, .2], [E.avisar, { armR: [60, 50] }, .1]]);
  const dy = W.proj(V3(OX - 2.6, .82, 1.75)).y, sp2 = W.proj(V3(OX - 2.7, .83, 2.05)); return clipAbove(who('AGENTE', PA, FA), dy) + impact(sp2.x, sp2.y, 200, clamp((t - E.avisar) / .4)); };
// 15 · «Pero casi todas son normales»: de día, la calle tranquila, un gato que bosteza en la galería, mariposas.
S.normales = (t, D, B) => { const E = EVS.normales(B), T = window.__T || t; setup(T); const k = oc(t / D); cam(L3(V3(-7.6, 1.5, 9.6), V3(-6.4, 1.35, 8.4), k), L3(V3(-2.6, 1.4, 1.2), V3(-3.0, 1.1, 2.4), k), 46);
  const cp = W.proj(V3(-3.4, .8, 3.6)); return cat2d(cp, cp.ppm, T, k01(t, E.normales - .25, E.normales + .1) * (1 - k01(t, D - .2, D))) + butterfly(300 + Math.sin(T * 2) * 120, 700 + Math.cos(T * 1.6) * 80, 1.1, T, '#ffd34a') + butterfly(760 + Math.sin(T * 1.7 + 1) * 90, 900 + Math.cos(T * 2.2) * 70, .9, T + .3, '#f6f3ec'); };
// 16 · «¿En mitad de la nada? Solo en Tokio hay casi 900.000»: grúa desde la parada perdida entre arrozales → barrido a Tokio, a la casita vieja entre bloques.
S.nada = (t, D, B) => { const E = EVS.nada(B), T = window.__T || t; const tc = E.solo - .12; whipBlur(t, tc); const st = W.STOP;
  if (t < tc) { setup(T); const k = oc(t / tc); cam(L3(V3(st.x + 2.4, 1.5, st.z + 5.2), V3(st.x + 34, 46, st.z + 70), k), L3(V3(st.x + .2, 1.2, st.z), V3(st.x, 0, st.z - 4), k), lerp(46, 50, k));
    const F = V3(st.x + .4, 0, st.z + .1), wp = { face: 'smug', mouth: 'line', look: [6, 2], armL: [12, 20], armR: [12, 20] }; let s = who('TU', wp, F); for (let i = 0; i < 3; i++) s += bird((T * 90 + i * 300) % 1300 - 100, 300 + i * 60, 18, T * 9 + i); return s; }
  setup(T); const k = oc((t - tc) / (D - tc)); cam(L3(V3(TX + 4.2, 1.5, 10.8), V3(TX + 1.2, 1.7, 4.2), k), L3(V3(TX + 1.5, 6, -6), V3(TX, 2.6, -5.2), k), lerp(62, 48, k));
  let s = ''; [[-7.5, 1, 1.0], [-1.8, 1, 1.0], [3.6, 1, 1.0]].forEach(([x0, dir, sp_], i) => { const x = TX + x0 + dir * (t - tc) * sp_, F = V3(x, .2, i === 1 ? -.4 : -.8); s += who(i === 1 ? 'HIJA' : 'AGENTE', Object.assign({ turn: dir * .8, face: 'smug', mouth: 'line', look: [dir * 10, 0] }, walkPose(T * 7 + i * 2)), F); });
  return s; };
// 17 · «La historia de verdad es otra»: delante del altar, el retrato del dueño.
S.historia = (t, D, B) => { const E = EVS.historia(B), T = window.__T || t; setup(T, 0, 0, IN); const p0 = V3(IX + 3.7, IY + 1.6, .9), tg = V3(IX + 2.7, IY + 1.15, -2.0); cam(pushIn(p0, tg, t / D, 1.2), tg, 50);
  const F = V3(IX + 2.15, IY, -1.55), P = seq(t, [[0, { turn: .6, face: 'smug', mouth: 'line', look: [12, -4], armL: [16, 20], armR: [16, 20] }], [E.otra - .2, { face: 'wide', mouth: 'o', look: [14, -6], headTilt: 6 }, .3]]); const ip = W.proj(W.BUTSU.localToWorld(V3(.25, .62, .32)));
  return portrait2d() + smoke(ip.x, ip.y, ip.ppm / 300, T) + motes(T, 20, .4) + who('TU', P, F); };
// 18 · «El dueño muere, y sus hijos viven en la ciudad»: el retrato con el incienso → los hijos por una calle de Tokio, con prisa.
S.dueno = (t, D, B) => { const E = EVS.dueno(B), T = window.__T || t; const tc = E.y - .1; whipBlur(t, tc);
  if (t < tc) { setup(T, 0, 0, IN); const k = oc(t / tc), tg = V3(IX + 2.9, IY + 1.0, -2.15); cam(L3(V3(IX + 2.85, IY + 1.08, -1.05), V3(IX + 2.9, IY + 1.03, -1.35), k), tg, 40, .002); const ip = W.proj(W.BUTSU.localToWorld(V3(.25, .62, .32)));
    return portrait2d() + smoke(ip.x, ip.y, ip.ppm / 300, T); }
  setup(T); const u = t - tc, k = oc(u / (D - tc)); const x = TX - 3 + u * 1.3; cam(V3(x - 1.2, 1.55, 13.2), V3(x + 1.2, 1.9, 6), 50);
  const FH = V3(x + .2, .2, 9.0), FJ = V3(x + 1.4, .2, 9.5); return who('HIJO', Object.assign({ turn: .8, face: 'smug', mouth: talkM(T, 0, 99, 'line'), look: [10, 0], armR: [150, 100], holdR: PHONE_SVG }, walkPose(T * 7.4)), FH) + who('HIJA', Object.assign({ turn: .8, face: 'smug', mouth: 'line', look: [10, 2] }, walkPose(T * 7.4 + 2)), FJ); };
// 19 · «Tirarla cuesta millones… y sin casa, el impuesto del terreno se multiplica hasta por 6»: excavadora + montón de billetes → ¡puf!, sin casa, y las monedas de 1 a 6 pilas.
S.tirarla = (t, D, B) => { const E = EVS.tirarla(B), T = window.__T || t; const tc = E.y - .12; whipBlur(t, tc); setup(T);
  if (t < tc) { const k = oc(t / tc), dz = lerp(10.5, 6.8, k01(t, 0, tc * .7)); W.setDigger({ x: -2.0, z: dz, yaw: 0, boom: lerp(.15, .75, k), arm: lerp(-.2, -.9, k), bucket: .5 }); W.setBills(k01(t, E.millones - .1, E.millones + .45));
    cam(pushIn(V3(3.8, 2.3, 11.6), V3(-2.0, 1.6, 2.0), t / tc, 1.12), V3(-2.0, 1.6, 2.0), 52); const bp = W.proj(V3(-.6, 1.4, 4.7)); return impact(bp.x, bp.y, 220, clamp((t - E.millones) / .4)); }
  const gone = t > E.casa; W.setHouseGone(gone); const n = t < E.impuesto ? 0 : t < E.multiplica ? 1 : 1 + 5 * k01(t, E.multiplica, E._6 + .05); W.setCoins(n, T); SHAKE = shakeAt(t, E.casa, .05) + shakeAt(t, E._6, .03);
  const k = oc((t - tc) / (D - tc)); cam(L3(V3(0, 4.6, 10.4), V3(0, 3.8, 8.6), k), V3(0, .8, -4.6), 50);
  const hp = W.proj(V3(0, 2.4, -5.4)); let s = gone ? puff(hp.x - 200, hp.y, 300, clamp((t - E.casa) / .8), '#d9cfba') + puff(hp.x + 200, hp.y + 40, 280, clamp((t - E.casa - .05) / .8), '#d9cfba') + puff(hp.x, hp.y - 120, 340, clamp((t - E.casa) / .9), '#efe4cf') : '';
  for (let i = 1; i < 6; i++) { const ti = E.multiplica + (E._6 + .05 - E.multiplica) * (i - .5) / 5, q = W.proj(V3(-2.5 + (i % 3) * 2.5, 1.6, -5.8 + Math.floor(i / 3) * 2.2)); s += impact(q.x, q.y, 120, clamp((t - ti) / .35)); }
  return s; };
// 20 · «Así que la dejan ahí, cerrada»: el hijo cierra la puerta corredera y se va por el camino; vuelan hojas.
S.dejan = (t, D, B) => { const E = EVS.dejan(B), T = window.__T || t; setup(T); W.setDoor(W.HOUSE, 1 - k01(t, E.dejan - .2, E.dejan + .35)); const p0 = V3(5.8, 1.55, 8.6), tg = V3(2.4, 1.4, -1.2); cam(L3(p0, V3(7.0, 1.9, 10.4), oc(t / D)), tg, 46);
  const tw = E.cerrada - .3; let F, P; if (t < tw) { F = V3(2.4, .1, -.3); P = seq(t, [[0, { view: 'back', armR: [96, 20], armL: [16, 20] }], [E.dejan + .3, { view: 'back', armR: [20, 20] }, .3]]); }
  else { const u = t - tw, z = -.3 + u * 1.25; F = V3(2.6 + Math.sin(z) * .1, .1, z); P = Object.assign({ face: 'smug', mouth: 'line', look: [6, 4], brows: .4 }, walkPose(T * 7)); }
  let s = who('HIJO', P, F); for (let i = 0; i < 9; i++) { const u = ((T * .5 + i / 9) % 1), x = 1100 - u * 1300 + Math.sin(i) * 80, y = 600 + i * 90 + Math.sin(T * 3 + i) * 40; s += leaf(x, y, 18, T * 300 + i * 40, ['#e8862a', '#c8502e', '#e2b23a'][i % 3]); } return s; };
// 21 · «¿Y venderla? Casi imposible: allí las casas son como los coches»: tú con «?» → concesionario con el coche y la casa en plataformas giratorias.
S.venderla = (t, D, B) => { const E = EVS.venderla(B), T = window.__T || t; const tc = E.casi - .12; whipBlur(t, tc);
  if (t < tc) { setup(T); const F = V3(4.6, 0, 7.2), p0 = V3(4.3, 1.65, 11.0), tg = V3(4.6, 1.55, 7.2); cam(pushIn(p0, tg, t / tc, 1.15), tg, 42); const hp = headScr(F);
    return who('TU', { face: 'smug', mouth: 'line', brows: .4, look: [-8, -4], armL: [16, 22], armR: [80, 120], headTilt: -6 }, F) + popIcon('?', hp.x + 150, hp.y - 160, 130, clamp((t - .05) / .3)); }
  setup(T, 0, 0, OFFL); const k = oc((t - tc) / (D - tc)); cam(L3(V3(SX - .15, 1.75, 7.6), V3(SX - .05, 1.6, 6.7), k), V3(SX + .1, 1.05, -.2), 50); return ''; };
// 22 · «En cuanto alguien entra a vivir, pierden valor»: una pareja entra en una casa nueva y el cartel de precio empieza a bajar.
const NEWCAM = () => [V3(W.NX - 2.6, 1.8, W.NZ + 13.6), V3(W.NX - 1.0, 2.3, W.NZ + 2)];
S.pierden = (t, D, B) => { const E = EVS.pierden(B), T = window.__T || t; setup(T); const drop = k01(t, E.pierden - .1, D + .5); W.setPrice(3e7 - drop * 1.2e7, t > E.pierden ? .5 + .5 * Math.sin(T * 12) : 0);
  const [p0, tg] = NEWCAM(); cam(pushIn(p0, tg, t / D, 1.12), tg, 52); const te = E.entra; let s = '';
  [['NOVIA', -.5], ['NOVIO', .4]].forEach(([n, dx], i) => { const u = clamp(t / (te + .35)), x = lerp(W.NX - 4 + dx, W.NX + 2.4 + dx * .3, u), z = lerp(W.NZ + 6.4, W.NZ + 3.8, u), F = V3(x, 0, z); const inside = t > te + .6; if (inside) return;
    s += who(n, Object.assign({ turn: .8, face: 'happy', mouth: 'smile', look: [10, -2] }, u < 1 ? walkPose(T * 7 + i * 2) : { view: 'back' }), F); });
  const bp = W.proj(V3(W.NX - 2.6, 2.1, W.NZ + 5.6)); return s + `<g opacity="${clamp((t - E.pierden) / .2).toFixed(2)}">${arrowDown(bp.x + 230, bp.y - 40, 70, T)}</g>`; };
function arrowDown(x, y, s, T) { const yy = y + (T * 120) % 40; return `<path d="M${x},${yy - s} L${x},${yy + s * .4}" stroke="${K}" stroke-width="34" stroke-linecap="round"/><path d="M${x},${yy - s} L${x},${yy + s * .4}" stroke="#d2283a" stroke-width="20" stroke-linecap="round"/><path d="M${x - s * .7},${yy} L${x},${yy + s} L${x + s * .7},${yy} Z" fill="#d2283a" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>`; }
// 23 · «A los 30 años, la casa ya casi no vale nada»: cámara rápida — pasan días y noches, crece la maleza y la hiedra, el cartel baja a 0.
S.treinta = (t, D, B) => { const E = EVS.treinta(B), T = window.__T || t; const a = k01(t, .1, E.nada); const cyc = .5 - .5 * Math.cos(clamp(t / (E.nada + .1)) * Math.PI * 4); setup(T * 1, 0, cyc * .75); W.setTime(T * 25);
  W.setAge(a); W.setPrice(1.8e7 * (1 - a), t > E.nada ? 1 : 0); const [p0, tg] = NEWCAM(); cam(pushIn(p0, tg, t / D, 1.3), tg, 52); const bp = W.proj(V3(W.NX - 2.6, 1.9, W.NZ + 5.6)); SHAKE = shakeAt(t, E.nada, .04);
  return impact(bp.x, bp.y, 260, clamp((t - E.nada) / .45)); };
// 24 · «Por eso… te las regalan»: vuelta a la casa del principio; el lazo cae otra vez (mismo encuadre que el primer plano → bucle).
S.final = (t, D, B) => { const E = EVS.final(B), T = window.__T || t; setup(T); const tl = E.regalan + .02, g = giftDrop(t, tl, tl - 1.0); W.setGift(t < tl - 1.0 ? 0 : g.k, T, g.sq); SHAKE = shakeAt(t, tl, .09);
  const k = oc(t / D); cam(L3(V3(8.3, 1.45, 10.0), GIFT_CAM[0], k), GIFT_CAM[1], 60);
  const P = seq(t, [[0, { face: 'smug', mouth: 'smirk', look: [-8, -10], turn: -.3, armL: [16, 22], armR: [16, 22] }], [tl, { face: 'happy', mouth: 'laugh', armL: [130, 30], armR: [134, 30], bob: -12 }, .25]]);
  const bow = W.proj(V3(0, 7.55, -5.4)); return who('TU', P, TU_ROAD) + (g.landed ? impact(bow.x, bow.y, bow.ppm * 2.4, clamp(g.after / .45)) : ''); };

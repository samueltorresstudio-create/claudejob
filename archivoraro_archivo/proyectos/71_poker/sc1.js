// «El que siempre pierde al póker» (71) — ESTILO 3D: world_bar.js + personajes 2D (cast71.js) + cartas y efectos (fx71.js).
// Gancho visual en el fotograma 0 (la torre de fichas que se desmorona), un plano por frase, cámara siempre en movimiento,
// textos solo dentro del mundo (cartas, pizarra de partidas, licencia, foto de 1995, caja registradora, reloj).
window.CFG = { capY: 1500, capSize: 96, transDur: .42, blurK: .35, antic: .1, blurChars: false,
  transDurBy: { tira: .3, cien: .36, ases: .36, sonrie: .3, chuleton: .3, suyo: .4, bucle: .4 },
  trans: { cartas: 'whip', tira: 'cut', bote: 'swish', cien: 'whip', peor: 'swish', ases: 'whip', dudas: 'swish', condicion: 'swish', sonrie: 'cut', cena: 'swish', chuleton: 'whip',
    guino: 'swish', suyo: 'swish', cunado: 'whip', caja: 'swish', hambre: 'swish', treinta: 'whip', rico: 'swish', bucle: 'swish' } };
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { const ws = l.cap.split(' ').map(w => norm(w.split('|')[0])); EVS[l.sc] = B => { const o = {}; ws.forEach((w, i) => { const k = /^[0-9]/.test(w) ? '_' + w : w; if (k && !(k in o)) o[k] = B[0].w[i]; }); o._last = B[0].w[ws.length - 1]; return o; }; });
const S = {}, W = W2, C = window.CAST71, TC = W.TC, TH = W.TH, TR_ = W.TR, BZ = W.BZ, DT = W.DT;
window.READY = Promise.resolve();
// ---------- cámara (deriva de cámara en mano + sacudida) ----------
let SHAKE = 0;
{ const _sc = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * 4.59) * .5 + Math.sin(T * 8.61) * .3, Math.sin(T * 5.3 + 1) * .5 + Math.sin(T * 9.7) * .25, 0).multiplyScalar(.012 * p.distanceTo(l) / 8);
  const sh = SHAKE > 0 ? V3(Math.sin(T * 91) * SHAKE, Math.sin(T * 77 + 2) * SHAKE, 0) : V3(0, 0, 0); return _sc(p.clone().add(d).add(sh), l.clone().add(d.multiplyScalar(.35)).add(sh.multiplyScalar(.6)), f, fo, ap); }; }
const cam = (p, l, f = 40, ap = .0022) => { W.setCam(p, l, f, p.distanceTo(l), ap); W.render(); };
function sp(t, Ks) { const n = Ks.length; if (t <= Ks[0][0]) return Ks[0][1].clone(); if (t >= Ks[n - 1][0]) return Ks[n - 1][1].clone(); let i = 0; while (t > Ks[i + 1][0]) i++;
  const u = (t - Ks[i][0]) / (Ks[i + 1][0] - Ks[i][0]), a = Ks[Math.max(0, i - 1)][1], b = Ks[i][1], c = Ks[i + 1][1], d = Ks[Math.min(n - 1, i + 2)][1], u2 = u * u, u3 = u2 * u;
  const f = (p0, p1, p2, p3) => .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); return V3(f(a.x, b.x, c.x, d.x), f(a.y, b.y, c.y, d.y), f(a.z, b.z, c.z, d.z)); }
function whipBlur(t, t0, dur = .22) { const k = clamp((t - t0 + dur / 2) / dur); if (k > 0 && k < 1 && typeof TR !== 'undefined' && TR) TR.blur('H', Math.sin(Math.PI * k) * 26); }
const memo = f => { let last = null; return (...a) => { const k = JSON.stringify(a); if (k !== last) { last = k; f(...a); } }; };
const clock = memo((h, m) => W.setClock(h, m)), score = memo((n, k) => W.setScore(n, k)), till = memo((k, f, s) => W.setTill(k, f, s)), photo = memo(c => W.drawPhoto(c)), lic = memo(k => W.drawLicense(k));
function setup(T, o = {}) { W.setTime(T); W.setSepia(o.sepia || 0); W.setDinner(!!o.dinner); W.charLight = o.light || IN; SHAKE = 0; clock(...(o.clock || [22, 30])); score(0, 0); till(0, 1, ''); photo(o.photo ?? 0); lic(0); W.setChips(o.chips || defaultChips()); W.setMoney(0); W.setBand(0, 0, 0); }
const depth = L => L.filter(x => x && x[1]).map(([p, s]) => [W.camera.position.distanceTo(p), s]).sort((a, b) => b[0] - a[0]).map(x => x[1]).join('');
const sOf = (F, h = ADULT) => { const a = W.proj(F), b = W.proj(V3(F.x, F.y + h, F.z)); return Math.hypot(b.x - a.x, b.y - a.y) / 462; };
// ---------- la mesa ----------
// asientos (pies a la altura del asiento para que el cuerpo quede bien sentado) y punto de las fichas de cada uno
// SENTADO de verdad: misma escala que de pie (ADULT), la cadera a la altura del asiento, rodillas dobladas y pies en el suelo.
// En unidades del muñeco la cadera está 205 por encima del origen (1 u = 1,84/470 m): origen = asiento − 0,80 m; piernas [55°, 58°] con legLen = (asiento − suelo) / 0,636.
const SIT = (seatY = .5, footY = 0) => ({ y0: seatY - .8026, legLen: (seatY - footY) / .6358, legL: [55, 58], legR: [55, 58] });
const SEATH = ADULT, SIT0 = SIT(.5, 0), seatF = n => { const p = W.seatPos(W.SEATS[n], TR_ + .34); p.y = SIT0.y0; return p; };
const stackAt = (n, r = TR_ - .28) => { const a = W.SEATS[n]; return V3(TC.x + Math.sin(a) * r, 0, TC.z + Math.cos(a) * r); };
function defaultChips(pot = 0, mano = 6) { let L = []; const add = (p, n, sd) => L = L.concat(W.stack(p.x, p.z, n, sd));
  add(stackAt('pepe').add(V3(.05, 0, .1)), 14, 1); add(stackAt('pepe').add(V3(-.04, 0, -.1)), 10, 2); add(stackAt('luis').add(V3(0, 0, .08)), 12, 3); add(stackAt('luis').add(V3(.02, 0, -.12)), 9, 4);
  add(stackAt('toni').add(V3(.1, 0, 0)), 11, 5); add(stackAt('toni').add(V3(-.1, 0, 0)), 8, 6); if (mano) add(stackAt('manolo'), mano, 7); if (pot) for (let j = 0; j < 5; j++) add(V3(TC.x + Math.cos(j * 1.26) * .11, 0, TC.z + Math.sin(j * 1.26) * .09), Math.ceil(pot / 5) - (j % 2), 8 + j); return L; }
// silueta proyectada de la mesa (tablero + todo lo que hay debajo): recorta a quien está detrás
let _tc = 0; function behindTable(svg) { const pts = []; for (let i = 0; i < 64; i++) { const a = i / 64 * 6.283; const p = W.proj(V3(TC.x + Math.cos(a) * (TR_ + .09), TH + .05, TC.z + Math.sin(a) * (TR_ + .09))); if (p.ok) pts.push([p.x, p.y]); }
  if (pts.length < 3) return svg; const xs = pts.map(p => p[0]); pts.push([Math.min(...xs), 4000], [Math.max(...xs), 4000]);
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); } for (const p of pts.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  const hull = lo.slice(0, -1).concat(up.slice(0, -1)), id = 'tb' + (++_tc);
  return `<defs><clipPath id="${id}" clip-rule="evenodd"><path clip-rule="evenodd" d="M-3000,-3000 H5000 V5000 H-3000Z M${hull.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L')}Z"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }
// un jugador sentado: n = 'manolo' | 'pepe' | 'luis' | 'toni'; los que no son Toni (de espaldas a la cámara del frente) se recortan con la mesa
const NAME = { manolo: 'MANOLO', pepe: 'PEPE', luis: 'LUIS', toni: 'TONI' };
const TURN = { manolo: 0, pepe: .55, luis: -.55, toni: 0 };
function seated(n, pose = {}, opt = {}) { const F = seatF(n); const o = Object.assign({ legLen: SIT0.legLen, legL: SIT0.legL, legR: SIT0.legR, turn: TURN[n], armL: [64, 62], armR: [64, 62] }, pose); const svg = who(NAME[n], o, F, SEATH, opt);
  return [V3(F.x, 1, F.z), opt.noClip ? svg : behindTable(svg)]; }
// recorte a la barra (personaje de pie detrás del mostrador)
const behindBar = (svg) => clipAbove(svg, W.proj(V3(W.camera.position.x, 1.12, BZ)).y + 2);
// dos manos 2D (óvalos de tinta) en pantalla
const hand2d = (x, y, s, r = 0) => `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${s.toFixed(3)})"><ellipse cx="0" cy="0" rx="34" ry="42" fill="${K}"/><ellipse cx="-30" cy="-12" rx="12" ry="20" fill="${K}" transform="rotate(30 -30 -12)"/></g>`;
// ficha 2D que salta (para golpes de efecto)
function chip2d(x, y, s, r, col = '#c8302e') { return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${s.toFixed(2)},${(s * .45).toFixed(2)})"><circle r="30" fill="${col}" stroke="${K}" stroke-width="7"/><circle r="17" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="8 6"/></g>`; }

// =====================================================================================================
// 1 · GANCHO — fotograma 0 con acción: la cámara cae sobre la mesa mientras Manolo empuja su torre de fichas al centro y la torre se desmorona;
// los amigos, con los ojos como platos. En «a propósito», corte a primer plano: guiño a cámara.
// =====================================================================================================
S.gancho = (t, D, B) => { const E = EVS.gancho(B); const tP = (E.a || E.proposito || D * .72) - .12; setup(t + B[0].s, { chips: [] });
  // torre de Manolo: 26 fichas; empuje (0–.6 s) y derrumbe hacia el bote (.5–1.1 s)
  const push = eOut(clamp(t / .55)), fall = clamp((t - .45) / .7), base = stackAt('manolo'), ctr = V3(TC.x, 0, TC.z);
  let L = defaultChips(0, 0); const tower = []; for (let k = 0; k < 26; k++) { const h0 = TH + .026 + k * .0125, p = base.clone().lerp(ctr, push * .55);
    if (fall <= 0) tower.push([p.x, h0, p.z, k * .6]); else { const a = k * 2.39, r = .05 + (k % 7) * .045 * eOut(fall), dly = clamp(fall * 1.6 - k / 40), y = lerp(h0, TH + .026 + (k % 3) * .0125, eOut(dly)); tower.push([p.x + Math.cos(a) * r * dly, y, p.z + Math.sin(a) * r * dly, k, dly * (k % 2 ? 1.2 : -1.2) * (1 - dly), dly * .8 * (1 - dly)]); } }
  W.setChips(L.concat(tower)); W.setTime(t + B[0].s);
  if (t < tP) { const k = eOut(clamp(t / 1.6)); const cp = sp(k, [[0, V3(TC.x - .9, 2.6, TC.z + 2.9)], [1, V3(TC.x + .1, 1.9, TC.z + 2.85)]]); cam(cp, V3(TC.x, .98, TC.z - .45), lerp(64, 58, k));
    SHAKE = fall > 0 && fall < .4 ? .012 : 0;
    const L2 = [seated('manolo', { face: 'smug', mouth: 'smirk', armL: [lerp(70, 104, push), lerp(40, 18, push)], armR: [lerp(70, 104, push), lerp(40, 18, push)], look: [0, 10] }),
      seated('pepe', { face: fall > .1 ? 'wide' : 'smug', mouth: fall > .1 ? 'o' : 'line', brows: fall > .1 ? .9 : 0, look: [10, 6], armL: [40, 70], armR: [40, 70] }),
      seated('luis', { face: fall > .1 ? 'wide' : 'smug', mouth: fall > .1 ? 'grin' : 'line', brows: fall > .1 ? .9 : 0, look: [-10, 6], armL: [40, 70], armR: [40, 70] })];
    let s = depth(L2); const pc = W.proj(V3(TC.x, TH + .1, TC.z - .2)); if (fall > 0) s += ring(pc.x, pc.y, 220, fall / .6, '#fff') + impact(pc.x, pc.y - 30, 160, fall / .45);
    for (let i = 0; i < 6; i++) { const kk = clamp((t - .5 - i * .05) / .6); if (kk > 0 && kk < 1) s += chip2d(pc.x + Math.cos(i * 1.1) * 260 * eOut(kk), pc.y - Math.sin(Math.PI * kk) * 260 + kk * 120, 1.1, kk * 500 + i * 60, ['#c8302e', '#2f6fbf', '#1b1b22', '#f2efe6', '#2f9a5a', '#e8a830'][i]); }
    return s; }
  whipBlur(t, tP); const u = t - tP, k = oc(clamp(u / (D - tP))); cam(L3(V3(TC.x + .08, 1.58, TC.z + .65), V3(TC.x + .06, 1.56, TC.z + .4), k), V3(TC.x, 1.36, TC.z - 1.39), 40, .004);
  const wink = u > .18; let s = depth([seated('manolo', { face: 'smug', mouth: 'smirk', wink, look: [0, 2], armL: [70, 40], armR: [70, 40], headTilt: wink ? 6 : 0 }, { noClip: true })]);
  const h = headScr(seatF('manolo'), SEATH); if (wink) s += glint(h.x + 150, h.y - 140, 40, eBack(clamp((u - .18) / .25)));
  return behindTable(s); };

// =====================================================================================================
// 2 · CARTAS — su punto de vista: las cinco cartas se abren en abanico… escalera de color (brillo); al otro lado de la mesa, Toni y los demás
// =====================================================================================================
S.cartas = (t, D, B) => { const E = EVS.cartas(B); setup(t + B[0].s, { chips: defaultChips(40, 2) }); const tO = (E.cinco || D * .45) - .1, tE = E.escalera || D * .7;
  const k = oc(clamp(t / D)); cam(L3(V3(TC.x + .05, 1.42, TC.z - 1.18), V3(TC.x + .05, 1.36, TC.z - 1.0), k), V3(TC.x, 1.0, TC.z + 1.0), 56, .006);
  const L = [seated('toni', { face: 'smug', mouth: 'line', look: [0, 6], armL: [60, 60], armR: [60, 60] }, { blur: 3 }), seated('pepe', { face: 'smug', mouth: 'line', turn: -.6, look: [-8, 4] }, { blur: 3 }), seated('luis', { face: 'smug', mouth: 'line', turn: .6, look: [8, 4] }, { blur: 3 })];
  let s = depth(L);
  const open = oc(clamp((t - tO) / .5)), glow = clamp((t - tE + .05) / .3), cx = 540, cy = 1160 - 20 * open, sc = 3.3;
  s += `<g transform="translate(${cx},${cy + 120}) scale(${sc})">${FAN(ROYAL, open, open > .05, glow * (.7 + .3 * Math.sin(t * 9)))}</g>`;
  s += hand2d(cx - 60, cy + 330, 3.0, -14) + hand2d(cx + 80, cy + 320, 3.0, 20);
  if (glow > 0) { s += impact(cx, cy - 60, 360, (t - tE) / .45) + glint(cx - 300, cy - 260, 46, Math.abs(Math.sin(t * 5))) + glint(cx + 310, cy - 220, 34, Math.abs(Math.cos(t * 4))) + glint(cx + 40, cy - 420, 28, Math.abs(Math.sin(t * 6 + 1))); }
  return s; };

// =====================================================================================================
// 3 · TIRA — a cámara lenta: las cinco cartas, boca abajo, vuelan de su mano y patinan sobre el tapete; él, tan tranquilo
// =====================================================================================================
S.tira = (t, D, B) => { const E = EVS.tira(B); setup(t + B[0].s, { chips: defaultChips(40, 2) }); const k = oc(clamp(t / D));
  cam(L3(V3(TC.x + .55, 1.22, TC.z + 1.15), V3(TC.x + .5, 1.2, TC.z + 1.0), k), V3(TC.x - .02, 1.02, TC.z - .5), 54, .004);
  const tT = Math.max(.15, (E.tira || .3) - .1), u = clamp((t - tT) * .9);   // cámara lenta
  const L = [seated('manolo', { face: u > .1 ? 'closed' : 'smug', mouth: 'smile', armR: u > 0 ? [lerp(80, 120, oc(u * 2)), lerp(60, 10, oc(u * 2))] : [80, 60], armL: [64, 62], look: [6, 6] })];
  let s = depth(L); const from = V3(TC.x + .02, TH + .32, TC.z - .62);
  ROYAL.forEach((c, i) => { const kk = clamp(u * 1.3 - i * .06), e = eOut(kk), to = V3(TC.x - .15 + i * .07, TH + .03, TC.z - .25 + (i % 2) * .05), p = from.clone().lerp(to, e); p.y = lerp(from.y, to.y, e) + Math.sin(Math.PI * Math.min(1, kk * 1.1)) * .12;
    s += cardOnTable(p, (1 - e) * 2.4 + i * .25 - .5, c[0], c[1], false, 0); });
  if (u > .7 && u < 1.2) { const p = W.proj(V3(TC.x, TH + .03, TC.z - .2)); s += ring(p.x, p.y, 200, (u - .7) / .5, '#fff'); }
  return s; };

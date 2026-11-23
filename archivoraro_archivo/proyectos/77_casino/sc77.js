// «Las tres reglas secretas de los casinos» (77) — ESTILO 3D DE DIBUJO ANIMADO: decorados de Blender (world_casino.js) + personajes 2D (cast77.js) + efectos.
// Reglas obligatorias (references/reglas_75.md): cámara SIEMPRE en movimiento, transición en cada cambio de plano, caras nuevas según el momento,
// fondos con detalle, nada atravesado (piernas tras mostradores con clipAbove), nadie en zonas de paso sin motivo, SIN texto en el mundo (solo el subtítulo), SIN nariz, SIN rubor.
window.CFG = { capY: 1500, capSize: 96, transDur: .34, blurK: .35, antic: .1, blurChars: false, transDefault: 'swish', swishRel: 1.15, swishK: .9, pushMax: .3,
  trans: { regla1: 'swish', jefe: 'swish', cristal: 'swish', relojes: 'swish', regla2: 'swish', laberinto: 'swish', regla3: 'swish', perdida: 'swish', lab: 'swish', bolsillo: 'swish', final: 'swish' } };
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { EVS[l.sc] = EVS[l.sc] || (() => ({})); });
const capWords = (sc, li) => { const L = window.SCRIPT.filter(l => l.sc === sc)[li]; return L ? L.cap.split(' ').map(w => norm(w.split('|')[0])) : []; };
const wt = (B, sc, li, word, nth = 0, dflt = null) => { const ws = capWords(sc, li); let c = 0; for (let i = 0; i < ws.length; i++) if (ws[i] === word) { if (c === nth) return B[li] ? B[li].w[i] : dflt; c++; } return dflt ?? (B[li] ? B[li].s : 0); };
const S = {}, W = W2;
let SHAKE = 0;
{ const _sc = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * 4.59) * .5 + Math.sin(T * 8.61) * .3, Math.sin(T * 5.3 + 1) * .5 + Math.sin(T * 9.7) * .25, 0).multiplyScalar(.008 * p.distanceTo(l) / 8);
  const sh = SHAKE > 0 ? V3(Math.sin(T * 91) * SHAKE, Math.sin(T * 77 + 2) * SHAKE, 0).multiplyScalar(p.distanceTo(l) / 10) : V3(0, 0, 0); return _sc(p.clone().add(d).add(sh), l.clone().add(d.multiplyScalar(.35)).add(sh.multiplyScalar(.6)), f, fo, ap); }; }
const cam = (p, l, f = 40, ap = .0004) => { W.setCam(p, l, f, p.distanceTo(l), ap); };
const lerpV = (a, b, k) => a.clone().lerp(b, k);
const camK = (k, p0, l0, f0, p1, l1, f1, ap) => cam(lerpV(p0, p1, k), lerpV(l0, l1, k), lerp(f0, f1, k), ap);
const seg = (t, a, b) => eIO(clamp((t - a) / Math.max(.001, b - a)));
const depth = L => L.filter(x => x && x[1]).map(([p, s]) => [W.camera.position.distanceTo(p), s]).sort((a, b) => b[0] - a[0]).map(x => x[1]).join('');
const man = (name, F, pose = {}, opt = {}) => { let s = who(name, pose, F, opt.h || ADULT, Object.assign({ gy: opt.gy ?? F.y }, opt)); if (opt.clip && s) { const q = W.proj(opt.clip); if (q.ok) s = clipAbove(s, q.y); } return [F, s]; };
const whip = (t, cuts, w = .1) => { if (typeof TR === 'undefined' || !TR) return; for (const c of cuts) { const d = Math.abs(t - c); if (d < w) { TR.blur('H', 26 * (1 - d / w)); return; } } };
const talk = (t, a, b, rest = 'smile') => talkM(t, a, b, rest);
const scrX = v => W.proj(v);
// paseo de verdad: zancada con las piernas, brazos contrarios y rebote suave; ph = distancia / zancada · π
function walk2(ph, o = {}) { const A = o.amp ?? 1, s = Math.sin(ph), c = Math.cos(ph);
  return { legL: [-22 * s * A, 6 + 26 * Math.max(0, s) * A], legR: [22 * s * A, 6 + 26 * Math.max(0, -s) * A], armL: [12 - 24 * s * A, 22], armR: [12 + 24 * s * A, 22], bob: -8 * Math.abs(c) * A + 3, headTilt: s * 2 * A }; }
const LG = { casino: { tint: '#ffe8d0', k: .14, rim: '#ffb0c8', rimA: .6, rimX: -1, rimY: -.6 }, oficina: { tint: '#ffe8c8', k: .12, rim: '#fff0d0', rimA: .5, rimX: 1, rimY: -.6 }, dia: { tint: '#fffaf0', k: .08, rim: '#ffffff', rimA: .5, rimX: -1, rimY: -.6 },
  laberinto: { tint: '#ffd0b8', k: .2, rim: '#ff9a7a', rimA: .6, rimX: 1, rimY: -.6 }, lab: { tint: '#f4fffc', k: .06, rim: '#ffffff', rimA: .4, rimX: -1, rimY: -.6 } };
const GX = 2000, OX = 1000, MX = 3000, CX = 3040, LX = 4000;
function setup(T, site, mood) { W.setTime(T); W.site(site); W.setMood(mood); W.charLight = LG[mood] || LG.casino; SHAKE = 0; W.clear(); W.clock(8, 0, 0); W.plastic(0); W.ceiling(true); W.slotScr([0, 0, 0], 0); W.eeg(T, 0); }
const clk = (M, cover = 0) => W.clock(Math.floor(M / 60) % 12, M % 60, cover);

// ---------- props 2D ----------
const COIN2 = `<g><ellipse rx="24" ry="24" fill="#ffd23a" stroke="${K}" stroke-width="6"/><ellipse rx="14" ry="14" fill="none" stroke="#e0951c" stroke-width="4"/></g>`;
const PHONE2D = (s = 1, M = 0) => `<g transform="rotate(-12) scale(${s})"><rect x="-30" y="-100" width="60" height="100" rx="10" fill="#2a2430" stroke="${K}" stroke-width="5"/><rect x="-25" y="-94" width="50" height="86" rx="5" fill="#cfeaff"/>
  <g transform="translate(0,-50)"><circle r="21" fill="#fff" stroke="${K}" stroke-width="4"/><path d="M0,0 L0,-14" stroke="${K}" stroke-width="3.5" stroke-linecap="round" transform="rotate(${(M * 6).toFixed(0)})"/><path d="M0,0 L0,-9" stroke="${K}" stroke-width="3.5" stroke-linecap="round" transform="rotate(${(M * .5).toFixed(0)})"/></g></g>`;
const bulb = (x, y, s, on = 1) => `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(2)})">${on ? `<circle r="90" fill="#fff6b0" opacity=".45"/>` : ''}<path d="M-40,10 Q-58,-30 -40,-60 Q0,-100 40,-60 Q58,-30 40,10 L30,34 L-30,34Z" fill="${on ? '#ffe75a' : '#cfcfd6'}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><rect x="-28" y="34" width="56" height="30" rx="6" fill="#9aa1ad" stroke="${K}" stroke-width="7"/></g>`;
const redX = (x, y, s, k) => { if (k <= 0) return ''; const e = eBack(clamp(k)); return `<g transform="translate(${x},${y}) scale(${(s * e).toFixed(2)}) rotate(-6)"><path d="M-90,-90 L90,90 M90,-90 L-90,90" stroke="${K}" stroke-width="58" stroke-linecap="round"/><path d="M-90,-90 L90,90 M90,-90 L-90,90" stroke="#ff3b4f" stroke-width="38" stroke-linecap="round"/></g>`; };
const starP = (x, y, r, fill, sw = 6) => `<path d="M${x},${y - r} L${x + r * .3},${y - r * .3} L${x + r},${y - r * .15} L${x + r * .45},${y + r * .22} L${x + r * .62},${y + r} L${x},${y + r * .55} L${x - r * .62},${y + r} L${x - r * .45},${y + r * .22} L${x - r},${y - r * .15} L${x - r * .3},${y - r * .3}Z" fill="${fill}" stroke="${K}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const ruleStars = (n, k = 1) => [0, 1, 2].map(i => { const on = i < n, pop = i === n - 1 ? eBack(clamp(k)) : 1; return `<g transform="translate(${100 + i * 92},130) scale(${(on ? pop : 1).toFixed(2)})">${starP(0, 0, 40, on ? '#ffd23a' : '#d8d3c8', 7)}</g>`; }).join('');
const headsRow = (n9, k) => { let o = ''; for (let i = 0; i < 10; i++) { const x = 140 + i * 86, out = i < 9, show = clamp(k * 10 - i); if (show <= 0) continue; const rise = out && k > 1 ? clamp((k - 1) * 3 - i * .15) : 0;
  o += `<g transform="translate(${x},${330 - rise * 40}) scale(${(.55 + .0 * show).toFixed(2)})" opacity="${(out && rise > 0 ? 1 - rise * .75 : 1).toFixed(2)}"><circle r="34" fill="${out ? '#ffd23a' : '#8fd0ff'}" stroke="${K}" stroke-width="7"/><circle cx="-11" cy="-4" r="4" fill="${K}"/><circle cx="11" cy="-4" r="4" fill="${K}"/><path d="M-12,12 Q0,${out && rise > .3 ? 8 : 20} 12,12" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`; } return o; };
const star = (x, y, r, a = .95) => `<path d="M${x},${y - r} L${x + r * .22},${y - r * .22} L${x + r},${y} L${x + r * .22},${y + r * .22} L${x},${y + r} L${x - r * .22},${y + r * .22} L${x - r},${y} L${x - r * .22},${y - r * .22}Z" fill="#fff" opacity="${a}"/>`;
const flash = (x, y, r, k = 1) => k <= 0 ? '' : `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${(.9 * k).toFixed(2)}"/>` + star(x, y, r * 2.6 * (.6 + .4 * k), .85 * k);
const flashes = (t, n = 6, rate = 3.2, y0 = 160, y1 = 1300) => { let o = ''; for (let i = 0; i < n; i++) { const ph = (t * rate / n + hs(i, 11)) % 1, k = ph < .12 ? 1 - ph / .12 : 0; if (k > 0) o += flash(80 + hs(i, 12) * 920, y0 + hs(i, 13) * (y1 - y0), 14 + hs(i, 14) * 10, k); } return o; };
const confetti = (t, n = 40, t0 = 0) => { if (t < t0) return ''; let o = ''; const cols = ['#ff4f9a', '#ffd23a', '#2fe0ff', '#5fe08a', '#ff9a3c', '#a07aff']; for (let i = 0; i < n; i++) { const ph = ((t - t0) * .7 + hs(i, 5)) % 1, x = 540 + (hs(i, 6) - .5) * 1100, y = -60 + ph * 1900, r = (t * 220 + i * 70) % 360; o += `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) rotate(${r.toFixed(0)})"><rect x="-9" y="-5" width="18" height="10" fill="${cols[i % 6]}" stroke="${K}" stroke-width="3"/></g>`; } return o; };
const flyCoin = (x0, y0, x1, y1, k, s = 1) => { if (k <= 0 || k >= 1) return ''; const x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(Math.PI * k) * 160; return `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${(s * (1 - .3 * k)).toFixed(2)})">${COIN2}</g>`; };
const coinDisguise = (x, y, s, k) => { if (k <= 0) return ''; const e = eBack(clamp(k)); return `<g transform="translate(${x},${y}) scale(${(s * e).toFixed(2)})"><circle r="70" fill="#d8d8e4" stroke="${K}" stroke-width="9"/><circle r="48" fill="none" stroke="#a9a9bd" stroke-width="6"/><path d="M-30,24 Q0,-6 30,24" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="-22" cy="-14" r="7" fill="${K}"/><circle cx="22" cy="-14" r="7" fill="${K}"/>
  <g opacity="${clamp((k - .5) * 3).toFixed(2)}"><circle cx="-24" cy="-14" r="22" fill="none" stroke="${K}" stroke-width="7"/><circle cx="24" cy="-14" r="22" fill="none" stroke="${K}" stroke-width="7"/><path d="M-2,-14 L2,-14" stroke="${K}" stroke-width="7"/><path d="M-30,30 Q-14,16 0,26 Q14,16 30,30 Q14,42 0,34 Q-14,42 -30,30Z" fill="#3a2a1e" stroke="${K}" stroke-width="5"/></g></g>`; };
const thoughtB = (x, y, s, k, n, col = '#ffd23a') => { if (k <= 0) return ''; const e = eBack(clamp(k)); let st = ''; for (let i = 0; i < n; i++) st += starP(-84 + (i % 3) * 84, -34 + Math.floor(i / 3) * 78, 30, col, 6); return `<g transform="translate(${x},${y}) scale(${(s * e).toFixed(2)})"><circle cx="-40" cy="150" r="12" fill="#fff" stroke="${K}" stroke-width="6"/><circle cx="-8" cy="112" r="20" fill="#fff" stroke="${K}" stroke-width="6"/><path d="M-170,-10 Q-190,-110 -100,-120 Q-60,-190 20,-150 Q100,-190 150,-110 Q210,-60 150,10 Q170,100 80,100 Q20,140 -40,100 Q-140,110 -170,-10Z" fill="#fff" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>${st}</g>`; };

// =====================================================================================================
// 1 · GANCHO — entras a las ocho, sales sin saber qué hora es, y el reloj se tapa
// =====================================================================================================
S.gancho = (t, D, B) => { setup(t, 'hall', 'casino');
  const tOcho = wt(B, 'gancho', 0, 'ocho'), tSales = wt(B, 'gancho', 0, 'sales'), tCas = wt(B, 'gancho', 0, 'casualidad'), c1 = tSales - .12, c2 = tCas - .2; whip(t, [c1, c2]);
  if (t < c1) { const k = seg(t, 0, c1); camK(k, V3(0, 1.9, 33), V3(0, 2.9, -17), 46, V3(.4, 1.95, 22), V3(0, 2.8, -17), 38);
    const zJ = 27 - 2.2 * t, ph = (27 - zJ) / .5 * Math.PI, w2 = 1.5 * t;
    const L = [man('JUG', V3(0, 0, zJ), Object.assign(walk2(ph), { view: 'back' })), man('CLI1', V3(-2.7, 0, 9 + w2), Object.assign(walk2(w2 / .5 * Math.PI), { turn: .25, face: 'open', mouth: 'smile' })), man('CLI2', V3(2.6, 0, 5 + w2 * .8), Object.assign(walk2(w2 * .8 / .5 * Math.PI), { turn: -.3, face: 'happy', mouth: 'smile', holdR: PHONE2D(.8) }))];
    const q = scrX(V3(0, 3.4, -17.5)); return depth(L) + (t > tOcho - .1 && t < tOcho + .5 ? sparkles(q.x, q.y, 90, t, 4, .9) : ''); }
  if (t < c2) { const u = t - c1; W.hero('hall', 0, 0, 2.2, 0, 1); clk(480 + 330 * u, 0); W.slotScr([u * 6, u * 5, u * 7], u);
    camK(seg(t, c1, c2), V3(.8, 1.65, 12.6), V3(-.1, 1.7, 2.4), 36, V3(.2, 1.7, 10.6), V3(0, 1.75, 2.3), 34);
    const F = V3(.05, 0, 5.4), P = { turn: .15, face: u < .5 ? 'open' : 'hypno', mouth: u < .5 ? 'smile' : 'pout', armR: [150 - 40 * Math.abs(Math.sin(u * 5)), 30], brows: .3 }, h = headScr(F);
    return depth([man('JUG', F, P)]) + qmark(h.x + 170, h.y - 40, 1.2, (u - .5) / .35); }
  const u = t - c2; clk(14 * 60, eOut(clamp(u / .5))); SHAKE = (u > .45 && u < .7) ? .22 : 0;
  camK(seg(t, c2, D), V3(0, 3.3, -1.6), V3(0, 3.4, -17.8), 36, V3(0, 3.35, -7), V3(0, 3.4, -17.8), 32);
  const q = scrX(V3(0, 3.4, -17.4)); return rays(q.x, q.y, 300, (u - .45) / .5, '#ffffff', 14); };

// =====================================================================================================
// 2 · REGLA 1 — nada que te recuerde el mundo de fuera: ni ventanas (aspa en la ventana), ni relojes (aspa en el reloj)
// =====================================================================================================
S.regla1 = (t, D, B) => {
  const tV = wt(B, 'regla1', 0, 'ventanas'), tN2 = wt(B, 'regla1', 0, 'ni', 1), tR = wt(B, 'regla1', 0, 'relojes'), c1 = tN2 - .15; whip(t, [c1]);
  if (t < c1) { setup(t, 'glass', 'dia'); const k = seg(t, 0, c1); camK(k, V3(GX - 2.6, 2.0, 8), V3(GX, 2.7, -18), 42, V3(GX + 2.4, 2.0, 2.5), V3(GX, 2.7, -18), 38);
    const L = [man('JUG', V3(GX - .9, 0, -9.2), { view: 'back', face: 'dreamy', mouth: 'smile', armR: [160, 20] }), man('CLI2', V3(GX + 1.1, 0, -8.6), { view: 'back', face: 'wide', mouth: 'gasp' })];
    const q = scrX(V3(GX, 2.8, -18.6)); return depth(L) + ruleStars(1, (t - .15) / .3) + redX(q.x, q.y, 2.6, (t - tV - .05) / .22); }
  setup(t, 'hall', 'casino'); const k = seg(t, c1, D); camK(k, V3(0, 3.3, -2.6), V3(0, 3.4, -17.8), 36, V3(0, 3.3, -8.6), V3(0, 3.4, -17.8), 32);
  const q = scrX(V3(0, 3.4, -17.4)); return ruleStars(1, 1) + redX(q.x, q.y, 2.5, (t - tR - .05) / .22); };

// =====================================================================================================
// 3 · EL JEFE — un hombre que dirigía casinos en Las Vegas lo comprobó
// =====================================================================================================
S.jefe = (t, D, B) => { setup(t, 'office', 'oficina');
  const tV = wt(B, 'jefe', 0, 'vegas'), tC = wt(B, 'jefe', 0, 'comprobo');
  camK(seg(t, 0, D), V3(OX + .9, 2.15, 4.4), V3(OX + .1, 2.0, -5), 40, V3(OX + .35, 1.95, 1.4), V3(OX + .2, 1.95, -5.2), 33);
  const F = V3(OX + .2, 0, -5.1), done = t > tC - .1, P = { turn: .1, face: done ? 'sly' : 'open', mouth: done ? 'half' : talk(t, .15, tC - .1, 'smile'), armR: [105, 40], holdR: BLUEPRINT2D(1.1), brows: .25, bags: false };
  const h = headScr(F); return depth([man('DIR', F, P, { clip: V3(OX, .88, -3.0) })]) + (t > tV - .1 ? sparkles(h.x, h.y - 40, 190, t, 6, 1.1) : '') + (done ? bulb(h.x + 190, h.y - 150, .8 * eBack(clamp((t - tC) / .3)), 1) : ''); };

// =====================================================================================================
// 4 · CRISTAL — un lado de cristal, el 85-90 % se iba al ver el día, y lo tapó con plástico negro
// =====================================================================================================
S.cristal = (t, D, B) => {
  const tSe = wt(B, 'cristal', 0, 'segun'), t85 = wt(B, 'cristal', 0, '85'), t90 = wt(B, 'cristal', 0, '90'), tVer = wt(B, 'cristal', 0, 'ver'), tAsi = wt(B, 'cristal', 0, 'asi'), tTa = wt(B, 'cristal', 0, 'tapo');
  const c1 = tSe - .12, c2 = Math.max(c1 + .8, tVer - .5), c3 = tAsi - .12; whip(t, [c1, c2, c3]);
  if (t < c1) { setup(t, 'glass', 'dia'); const k = seg(t, 0, c1); camK(k, V3(GX + 2.4, 1.9, 12), V3(GX, 2.7, -18), 42, V3(GX - 1.4, 2.1, 5.5), V3(GX, 2.7, -18), 36);
    return depth([man('CLI1', V3(GX - 1.6, 0, -9.6), { view: 'back', face: 'dreamy', mouth: 'smile' }), man('CLI2', V3(GX + 1.4, 0, -9.0), { view: 'back', face: 'wide', mouth: 'o' }), man('SER1', V3(GX - .1, 0, -11.2), { view: 'back', face: 'smug', mouth: 'line' })]); }
  if (t < c2) { setup(t, 'glass', 'dia'); const k = seg(t, c1, c2), P0 = [-11.5, -8.8, -6.1, -3.4, -.7];
    camK(k, V3(GX - 1.9, 1.75, 9), V3(GX - 4.6, 1.85, -12), 44, V3(GX - 2.3, 1.7, 7), V3(GX - 4.7, 1.8, -12), 40);
    const L = P0.map((z, i) => man(['CLI1', 'CLI2', 'CLI3', 'SER2', 'CROU'][i], V3(GX - 4.15, 0, z), { turn: -.9, face: ['open', 'happy', 'open', 'smug', 'open'][i], mouth: i % 2 ? 'smile' : 'o', armR: [140 + 20 * Math.sin(t * 5 + i * 1.3), 25], brows: .2 }));
    const kk = (t - t85 + .1) / Math.max(.6, t90 - t85 + .9); return depth(L) + (t > t85 - .1 ? headsRow(9, kk) : ''); }
  if (t < c3) { setup(t, 'glass', 'dia'); const k = seg(t, c2, c3), u = t - c2, xs = [-1.5, -.5, .6, 1.7], lk = clamp((u - .5) / .8);
    camK(k, V3(GX - 1.0, 2.0, 4.2), V3(GX + .2, 2.6, -18), 42, V3(GX + .6, 1.9, 3.2), V3(GX, 2.5, -18), 40);
    const L = xs.map((x, i) => { const F = V3(GX + x, 0, -9 + (i % 2) * .8 + (lk > 0 ? lk * 7.5 : 0)); return lk <= 0 ? man(['CLI1', 'CLI3', 'SER2', 'CLI2'][i], F, { view: 'back', face: 'shock', mouth: 'gasp', armR: [160, 40] }) :
      man(['CLI1', 'CLI3', 'SER2', 'CLI2'][i], F, Object.assign(walk2(lk * 7.5 / .5 * Math.PI + i), { turn: (i % 2 ? .2 : -.2), face: 'tired', mouth: 'line' })); }); return depth(L); }
  setup(t, 'glass', 'dia'); const u = t - c3, kp = eOut(clamp(u / .9)); W.plastic(kp); if (u > .85 && u < 1.1) SHAKE = .18;
  camK(seg(t, c3, D), V3(GX + 3.4, 2.3, 8.5), V3(GX, 2.4, -18), 42, V3(GX + 1.3, 2.0, .6), V3(GX + .6, 2.2, -18), 38);
  const F = V3(GX + 2.1, 0, -5.2), P = { turn: -.5, face: 'sly', mouth: 'half', armR: [170 - 60 * Math.min(1, kp), 20], brows: .3 };
  return depth([man('DIR', F, P)]) + (u > .85 ? rays(540, 800, 400, (u - .85) / .5, '#ffffff', 12) : ''); };

// =====================================================================================================
// 5 · RELOJES — sin reloj no sabes cuánto llevas
// =====================================================================================================
S.relojes = (t, D, B) => {
  const tSin = wt(B, 'relojes', 0, 'sin'), tCu = wt(B, 'relojes', 0, 'cuanto'), c1 = tSin - .15; whip(t, [c1]);
  if (t < c1) { setup(t, 'hall', 'casino'); const tLm = wt(B, 'relojes', 0, 'lo'); clk(960, (q => q * q)(clamp((t - tLm + .05) / .45))); camK(seg(t, 0, c1), V3(1.2, 2.5, 5.0), V3(0, 3.1, -17.8), 46, V3(.4, 2.9, -.5), V3(0, 3.3, -17.8), 42); const q = scrX(V3(0, 3.4, -17.4)); return sparkles(q.x, q.y, 120, t, 4, .8); }
  setup(t, 'hall', 'casino'); clk(960, 1); W.hero('hall', -1.1, 0, 2.0, .3, 1); const u = t - c1; camK(seg(t, c1, D), V3(.9, 1.7, 10.4), V3(0, 1.6, 3.2), 36, V3(.25, 1.7, 9.0), V3(.05, 1.6, 3.2), 34);
  const F = V3(.3, 0, 5.5), wr = u > .2, P = { turn: -.2, face: u < .9 ? 'wary' : 'wide', mouth: u < .9 ? 'tsk' : 'worry', armR: wr ? [150, 100] : [20, 10], brows: .5, browTilt: -.5, look: [0, 8] }, h = headScr(F);
  return depth([man('JUG', F, P)]) + (u > .3 ? qmark(h.x + 150, h.y - 250, 1.2, (u - .3) / .3) : '') + (u > .8 ? qmark(h.x - 150, h.y - 230, .9, (u - .8) / .3) : ''); };

// =====================================================================================================
// 6 · REGLA 2 — que no puedas irte en línea recta (laberinto desde arriba)
// =====================================================================================================
S.regla2 = (t, D, B) => { setup(t, 'maze', 'laberinto'); W.ceiling(false); const tR = wt(B, 'regla2', 0, 'recta');
  camK(seg(t, 0, D), V3(MX, 56, 4), V3(MX, 0, 0), 36, V3(MX, 44, 1.5), V3(MX, 0, -.4), 34);
  const a = scrX(V3(MX, 0, 12)), b = scrX(V3(MX + 5, 0, -12)), k = clamp((t - tR + .5) / .5), mx = lerp(a.x, b.x, .5), my = lerp(a.y, b.y, .5);
  return ruleStars(2, (t - .15) / .3) + (k > 0 ? `<path d="M${a.x.toFixed(0)},${a.y.toFixed(0)} L${lerp(a.x, b.x, k).toFixed(0)},${lerp(a.y, b.y, k).toFixed(0)}" stroke="${K}" stroke-width="46" stroke-linecap="round" stroke-dasharray="70 46" fill="none"/><path d="M${a.x.toFixed(0)},${a.y.toFixed(0)} L${lerp(a.x, b.x, k).toFixed(0)},${lerp(a.y, b.y, k).toFixed(0)}" stroke="#ff3b4f" stroke-width="28" stroke-linecap="round" stroke-dasharray="70 46" fill="none"/>` : '') + redX(mx, my, 2.4, (t - tR - .1) / .22); };

// =====================================================================================================
// 7 · LABERINTO — pasillos cortos y estrechos, techos bajos, algo más allá de la esquina
// =====================================================================================================
S.laberinto = (t, D, B) => {
  const tPa = wt(B, 'laberinto', 0, 'pasillos'), tTe = wt(B, 'laberinto', 0, 'techos'), tSi = wt(B, 'laberinto', 0, 'siempre'), c1 = tPa - .15, c2 = tTe - .12, c3 = tSi - .12; whip(t, [c1, c2, c3]);
  if (t < c1) { setup(t, 'office', 'oficina'); camK(seg(t, 0, c1), V3(OX + .6, 2.2, 3.0), V3(OX, 2.6, -7), 44, V3(OX + .3, 2.1, .2), V3(OX + .2, 2.3, -7.6), 36);
    return depth([man('DIR', V3(OX + .3, 0, -5.2), { turn: -.3, face: 'open', mouth: talk(t, .1, c1 - .1, 'smile'), armR: [150, 25], brows: .2 }, { clip: V3(OX, .88, -3.0) })]); }
  if (t < c2) { setup(t, 'maze', 'laberinto'); const u = t - c1; camK(seg(t, c1, c2), V3(CX, 1.7, 19.5), V3(CX, 1.6, 2), 46, V3(CX, 1.7, 14.5), V3(CX, 1.6, 2), 44);
    const zJ = 13.5 - 1.2 * u; return depth([man('JUG', V3(CX, 0, zJ), Object.assign(walk2((13.5 - zJ) / .5 * Math.PI), { view: 'back' }))]); }
  if (t < c3) { setup(t, 'maze', 'laberinto'); const u = t - c2; camK(seg(t, c2, c3), V3(CX, 1.5, 15), V3(CX, 1.6, 2), 46, V3(CX, 1.4, 12.8), V3(CX, 3.2, -1), 52);
    const zJ = 9.4 - .6 * u; return depth([man('JUG', V3(CX, 0, zJ), Object.assign(walk2((10.5 - zJ) / .5 * Math.PI), { view: 'back' }))]); }
  setup(t, 'maze', 'laberinto'); W.hero('maze', CX, 0, -12.5, 0, 1); const u = t - c3; camK(seg(t, c3, D), V3(CX, 1.7, 14), V3(CX, 1.7, -4), 46, V3(CX, 1.7, 4.4), V3(CX, 1.7, -6), 40);
  const zJ = 8 - .6 * u, h = scrX(V3(CX, 1.9, zJ)); const q = scrX(V3(CX, 1.7, -12.4));
  return depth([man('JUG', V3(CX, 0, zJ), { turn: -.3, face: 'up', mouth: 'o', armR: [60, 30], look: [-4, -8] })]) + sparkles(q.x, q.y, 130, t, 6, 1.0) + qmark(h.x + 150, h.y - 30, 1.0, (u - .3) / .3); };

// =====================================================================================================
// 8 · REGLA 3 — que perder no suene a perder
// =====================================================================================================
S.regla3 = (t, D, B) => { setup(t, 'hall', 'casino'); W.hero('hall', -1.0, 0, 2.0, .25, 1); const tP = wt(B, 'regla3', 0, 'perder', 1);
  camK(seg(t, 0, D), V3(.9, 1.65, 9.8), V3(-.3, 1.55, 2.6), 36, V3(.3, 1.65, 7.9), V3(-.3, 1.5, 2.4), 33);
  const u = t, F = V3(.35, 0, 4.9), P = { turn: -.4, face: t < tP ? 'wide' : 'sly', mouth: t < tP ? 'o' : 'half', armR: [160 - 50 * Math.max(0, Math.sin(u * 4)), 30], brows: .4 };
  return depth([man('JUG', F, P)]) + ruleStars(3, (t - .1) / .3); };

// =====================================================================================================
// 9 · PÉRDIDA DISFRAZADA — apuestas diez, te devuelve uno… y todo suena a premio
// =====================================================================================================
S.perdida = (t, D, B) => {
  const tDi = wt(B, 'perdida', 0, 'disfrazada'), tAp = wt(B, 'perdida', 0, 'apuestas'), tD10 = wt(B, 'perdida', 0, 'diez'), tUno = wt(B, 'perdida', 0, 'uno'), tMu = wt(B, 'perdida', 0, 'musica'), c1 = tAp - .15, c2 = tUno - .1; whip(t, [c1, c2]);
  setup(t, 'hall', 'casino'); W.hero('hall', -.2, 0, 2.2, 0, 1);
  if (t < c1) { camK(seg(t, 0, c1), V3(.5, 1.65, 10.2), V3(-.2, 1.75, 2.4), 34, V3(.15, 1.7, 8.4), V3(-.2, 1.75, 2.4), 30); const q = scrX(V3(-.2, 3.0, 2.3)); const F = V3(.1, 0, 4.4);
    return depth([man('JUG', F, { turn: .1, face: 'open', mouth: talk(t, .1, c1, 'smile'), armR: [60, 40], brows: .3 })]) + coinDisguise(q.x + 80, q.y - 120, 1.4, (t - tDi + .1) / .35); }
  if (t < c2) { const u = t - c1; W.slotScr([u * 8, u * 7, u * 9], u); camK(seg(t, c1, c2), V3(1.0, 1.65, 9.8), V3(-.2, 1.6, 2.4), 34, V3(.4, 1.65, 9.1), V3(0, 1.6, 2.4), 33);
    const F = V3(.3, 0, 4.5), h = scrX(V3(F.x, 1.4, F.z)), sl = scrX(V3(-.2, 1.5, 2.9)); let c = ''; for (let i = 0; i < 10; i++) c += flyCoin(h.x + 90, h.y, sl.x, sl.y, (t - tD10 + .2 - i * .11) / .25, 1.2);
    return depth([man('JUG', F, { turn: -.35, face: 'wide', mouth: 'o', armR: [130 + 25 * Math.sin(u * 14), 40], holdR: '', brows: .4 })]) + c; }
  const u = t - c2; W.slotScr([u * 3 + 2, u * 2.4 + 1, u * 3.4], u * 2 + 1); camK(seg(t, c2, D), V3(.8, 1.65, 9.6), V3(-.2, 1.65, 2.4), 36, V3(.25, 1.7, 8.9), V3(0, 1.75, 2.5), 33);
  const F = V3(.3, 0, 4.4), h = headScr(F), sl = scrX(V3(-.2, .9, 3.0)), pe = 540 + Math.sin(u * 8) * 0;
  return depth([man('JUG', F, { turn: -.3, face: u < .5 ? 'shock' : 'stars', mouth: u < .5 ? 'gasp' : 'cheer', armR: [160, 30], armL: [150, 30], brows: .8 })]) + confetti(t, 46, c2 + .3) + mnotes(540, 520, t, 8, 1.2) + (u < .6 ? `<g transform="translate(${sl.x.toFixed(0)},${(sl.y + 70 + 140 * eOut(clamp(u / .35))).toFixed(0)}) scale(1.4)">${COIN2}</g>` : '') + sparkles(h.x, h.y, 250, t, 8, 1.3); };

// =====================================================================================================
// 10 · LABORATORIO — midieron el cuerpo de los jugadores y recordaban más victorias de las que tuvieron
// =====================================================================================================
S.lab = (t, D, B) => {
  const tMi = wt(B, 'lab', 0, 'midieron'), tRe = wt(B, 'lab', 0, 'reaccionaba'), tRc = wt(B, 'lab', 0, 'recordaban'), tTu = wt(B, 'lab', 0, 'tuvieron'), c1 = tMi - .15, c2 = tRc - .15; whip(t, [c1, c2]);
  setup(t, 'lab', 'lab'); W.hero('lab', LX + 3.8, 0, -3.2, -.4, 1);
  if (t < c1) { camK(seg(t, 0, c1), V3(LX + .35, 1.9, 7.45), V3(LX + .15, 1.45, 0), 58, V3(LX + .15, 1.85, 7.2), V3(LX + .15, 1.45, 0), 55);
    return depth([man('JUG', V3(LX - .5, 0, 3.9), { hat: 'eeg', turn: .3, face: 'hypno', mouth: 'pout' }), man('CIEN', V3(LX + 1.05, 0, 2.7), { turn: -.4, face: 'open', mouth: talk(t, .1, c1 - .1, 'smile'), armR: [110, 50], holdR: CLIP2D(1) })]); }
  if (t < c2) { const u = t - c1, amp = t > tRe - .2 ? clamp((t - tRe + .2) / .5) : .15; W.eeg(t, amp); camK(seg(t, c1, c2), V3(LX - 1.6, 1.8, -.4), V3(LX - 4.6, 1.75, -6.4), 40, V3(LX - 2.0, 1.8, -1.1), V3(LX - 4.7, 1.75, -6.4), 37);
    const F = V3(LX - 3.6, 0, -4.4), h = headScr(F);
    return depth([man('JUG', F, { hat: 'eeg', turn: .5, face: t > tRe - .2 ? 'stars' : 'hypno', mouth: t > tRe - .2 ? 'cheer' : 'pout', brows: .6 })]) + (t > tRe ? sparkles(h.x, h.y, 200, t, 6, 1.0) : ''); }
  const u = t - c2; camK(seg(t, c2, D), V3(LX + 2.4, 1.75, 5.4), V3(LX + 1.8, 1.9, .6), 36, V3(LX + 2.15, 1.85, 5.0), V3(LX + 1.8, 2.15, .6), 33);
  const F = V3(LX + 1.8, 0, .6), h = headScr(F), n5 = Math.min(5, Math.floor(u * 4.2) + 1), ok = u > .2;
  return depth([man('JUG', F, { hat: 'eeg', turn: .2, face: 'dreamy', mouth: 'smile' })]) + thoughtB(790, 300, 1.0, clamp((u - .05) / .3), ok ? n5 : 0) + thoughtB(255, 330, .6, clamp((u - 1.6) / .3), 2, '#b8b0c8'); };

// =====================================================================================================
// 11 · BOLSILLO — ya no hacen falta relojes en la pared: llevas uno en el bolsillo
// =====================================================================================================
S.bolsillo = (t, D, B) => { const tRe = wt(B, 'bolsillo', 0, 'reloj'), tLl = wt(B, 'bolsillo', 0, 'llevas'), c1 = tLl - .15; whip(t, [c1]);
  if (t < c1) { setup(t, 'hall', 'casino'); clk(480, 0); camK(seg(t, 0, c1), V3(0, 3.0, -1.0), V3(0, 3.4, -17.8), 36, V3(0, 3.3, -8.0), V3(0, 3.4, -17.8), 30); const q = scrX(V3(0, 3.4, -17.4)); return redX(q.x, q.y, 2.4, (t - tRe - .1) / .22); }
  setup(t, 'hall', 'casino'); clk(480, 0); const u = t - c1; camK(seg(t, c1, D), V3(.9, 1.75, 7.6), V3(0, 1.6, 2.6), 36, V3(.3, 1.75, 6.4), V3(.05, 1.65, 2.6), 33);
  const F = V3(.1, 0, 3.4), up = eOut(clamp(u / .5)), h = scrX(V3(F.x + .35, 1.2, F.z));
  return depth([man('JUG', F, { turn: .2, face: 'happy', mouth: 'smile', armR: [20 + 120 * up, 40 + 20 * up], holdR: u > .15 ? PHONE2D(1.5, u * 24) : '', brows: .3 })]) + sparkles(h.x, h.y - 80, 170, t, 5, 1.1); };

// =====================================================================================================
// 12 · FINAL — la máquina sigue celebrando… que pierdes
// =====================================================================================================
S.final = (t, D, B) => { setup(t, 'hall', 'casino'); W.hero('hall', -.5, 0, 2.2, .1, 1); const tCe = wt(B, 'final', 0, 'celebrando'), tPi = wt(B, 'final', 0, 'pierdes'), u = t;
  W.slotScr([u * 3, u * 2.6, u * 3.3], u * 2); camK(seg(t, 0, D), V3(.5, 1.6, 7.6), V3(-.15, 1.6, 2.6), 34, V3(1.2, 1.9, 12.5), V3(0, 1.7, 2.4), 42);
  const F = V3(.35, 0, 4.7), h = headScr(F), after = t > tPi - .1;
  return depth([man('JUG', F, { turn: -.35, face: after ? 'tired' : 'hypno', mouth: after ? 'yawn' : 'pout', armR: [40, 30], armL: [30, 20], brows: after ? -.5 : .2, bags: true })]) + confetti(t, 44, 0) + mnotes(540, 560, t, 8, 1.2) + (t > tCe ? flashes(t, 8, 5, 300, 1300) : ''); };

// dibuja el 3D después de que la escena haya colocado TODO
Object.keys(S).forEach(k => { const f = S[k]; S[k] = (t, D, B) => { const r = f(t, D, B); W.render(); return r; }; });

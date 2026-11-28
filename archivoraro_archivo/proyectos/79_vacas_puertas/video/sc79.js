// 79 · «El Cine»: el granjero que le puso gafas de realidad virtual a sus vacas. Decorados de Blender (world79.js) + personajes .99 (pjt.js, models79*.js).
// Reglas (camara_animacion.md): cámara SIEMPRE en movimiento (máx. 1 s quieta), calculada desde los personajes (followcam.js) → nadie recortado;
// personajes vivos (life.js: parpadeo, mirada, cabeza, respiración, gestos, labial); vacas con cola, orejas, masticar y respirar; luz y color por emoción.
window.CFG = { capY: 1365, capSize: 92, transDur: .5, blurK: .5, antic: .12, blurChars: false, transDefault: 'swish', swishRel: 1.1, swishK: .8, flash: false,
  trans: { gancho: 'cut', pienso: 'swish', burla: 'swish', nieve: 'swish', pared: 'swish', pizarra: 'glide', apodo: 'swish', vecino: 'swish', prueba: 'swish', prado: 'cut',
    dia1: 'cut', risa: 'glide', dia5: 'glide', dia10: 'glide', vecino22: 'swish', porque: 'swish', cabeza: 'glide', expertos: 'glide', sueno: 'glide', tienda: 'swish', final: 'swish' } };
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { EVS[l.sc] = EVS[l.sc] || (() => ({})); });
const capWords = (sc, li) => { const L = window.SCRIPT.filter(l => l.sc === sc)[li]; return L ? L.cap.split(' ').map(w => norm(w.split('|')[0])) : []; };
const wt = (B, sc, li, word, nth = 0) => { const ws = capWords(sc, li); let c = 0; for (let i = 0; i < ws.length; i++) if (ws[i] === word) { if (c === nth) return B[li] ? B[li].w[i] : 0; c++; } return B[li] ? B[li].s : 0; };
const hs = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const S = {}, W = W2, PJ_LEGX = window.PJ_LEG ?? 380;
const seg = (t, a, b) => eIO(clamp((t - a) / Math.max(.001, b - a))), sOut = (t, a, b) => eOut(clamp((t - a) / Math.max(.001, b - a)));
const lin = (t, a, b) => clamp((t - a) / Math.max(.001, b - a));
// ---------- cámara: deriva de mano por encima de todo + ayudas para followcam ----------
{ const _sc = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * 1.9) * .5 + Math.sin(T * 3.1) * .3, Math.sin(T * 2.3 + 1) * .5, 0).multiplyScalar(.006 * p.distanceTo(l) / 6);
  return _sc(p.clone().add(d), l.clone().add(d.multiplyScalar(.4)), f, fo, ap); }; }
const cam = (p, l, f = 40, ap = .0005, fo = null) => W.setCam(p, l, f, fo, ap);
const A2V = a => V3(a[0], a[1], a[2]);
const camC = (c, ap = .0005) => cam(A2V(c.pos), A2V(c.look), c.fov, ap);
const camMix = (ca, cb, k, ap = .0005) => cam(A2V(ca.pos).lerp(A2V(cb.pos), k), A2V(ca.look).lerp(A2V(cb.look), k), ca.fov + (cb.fov - ca.fov) * k, ap);
const camK = (k, p0, l0, f0, p1, l1, f1, ap = .0005) => cam(V3(...p0).lerp(V3(...p1), k), V3(...l0).lerp(V3(...l1), k), f0 + (f1 - f0) * k, ap);
// sujetos para followcam: persona (h ≈ 1,75; w ≈ .3h) y vaca de frente (dibujo h 2.0 → altura real visible ≈ 1,55 m; ancho con orejas ≈ .5)
const P_ = (x, z, h = 1.75, w = .56, y = 0) => ({ x, y, z, h, w });
const C_ = (x, z) => ({ x, y: 0, z, h: 1.42, w: .52 });
const O_ = (x, y, z, h, w) => ({ x, y, z, h: h / 1.12, w });             // objeto (pizarra, tele): h = alto real
// ---------- luz de contorno y tinte por ambiente (filtro por personaje; el volteo va dentro del grupo con filtro) ----------
const TINT = { establo: '.95 0 0 0 .01  0 .96 0 0 .01  0 0 .98 0 .02  0 0 0 1 0', establo27: '1.04 0 0 0 .04  0 .98 0 0 .01  0 0 .8 0 0  0 0 0 1 0', noche: '.78 0 0 0 0  0 .82 0 0 .01  0 0 .95 0 .03  0 0 0 1 0',
  nieve: '.94 0 0 0 .01  0 .96 0 0 .01  0 0 1.0 0 .02  0 0 0 1 0', prado: '.95 0 0 0 .02  0 .96 0 0 .02  0 0 .92 0 .01  0 0 0 1 0', sueno: '1.0 0 0 0 .04  0 .95 0 0 .02  0 0 .84 0 0  0 0 0 1 0',
  vecino: '1.0 0 0 0 .03  0 .93 0 0 .01  0 0 .84 0 0  0 0 0 1 0', tienda: '1.0 0 0 0 .02  0 .97 0 0 .01  0 0 .92 0 0  0 0 0 1 0' };
const RIM = { establo: ['#e8f0ff', 1, .7, '#ffd08a', .3], establo27: ['#ffe0a8', 1, .85, '#8ab0ff', .3], nieve: ['#e8f0ff', -1, .6, '#ffb070', .3], prado: ['#fff4d0', -1, .5, '#a8d0ff', .3],
  sueno: ['#ffe0a0', 1, .8, '#ffffff', .2], vecino: ['#ffa860', 1, .9, '#9ab8ff', .3], tienda: ['#ffe8c0', -1, .6, '#c8d8ff', .3] };
let MOOD = 'establo', PJN = 0, SITE = 'barn';
// límites de cada sala para la cámara (dentro de las paredes)
const BOX = { barn: [-6.8, 6.8, -5.7, 5.8], vbarn: [4994.0, 5006.0, -5.7, 3.9], shop: [5996.0, 6004.0, -3.1, 3.7], long: [3993.5, 4006.5, -38, 6] };
const SH = (fn, t, T, a, b, o = {}) => FC.shot(fn, t, T, a, b, Object.assign({ box: BOX[SITE] }, o));
const FR = (subs, o = {}) => FC.frame(subs, Object.assign({ box: BOX[SITE] }, o));
const LATE = ['porque', 'cabeza', 'expertos', 'sueno', 'tienda', 'final'];      // después del día 10: pizarra 27 y letrero DÍA 10
function setup(T, site, mood) { SITE = site; W.setTime(T); W.site(site); W.setMood(mood); MOOD = mood; PJN = 0; const late = LATE.includes(CUR); W.setDay(late ? 10 : 1); W.setChalk(late ? 27 : 22); W.showBoxes(CUR === 'tienda' || CUR === 'final' ? 10 : 0); }
let CUR = '';
// vida de las vacas: masticar, cola, orejas, respiración, parpadeo, visor que se mueve
function cowLife(T, seed, o = {}) { const still = o.still; const per = 3 + (seed % 3) * .7, ph = (T + seed * 1.3) % per;
  return Object.assign({ chew: still ? 0 : Math.sin(T * 5.2 + seed) * .9, tail: still ? 0 : Math.sin(T * 1.4 + seed * 2) * 16 + Math.sin(T * 3.1 + seed) * 5, earL: still ? 0 : Math.sin(T * .9 + seed) * 7 + (ph < .25 ? 14 : 0),
    earR: still ? 0 : Math.sin(T * 1.1 + seed * 3) * 7, breath: (Math.sin(T * 1.6 + seed) + 1) / 2, blink: (T + seed * .7) % 3.7 < .14 ? 1 : 0, screen: T * 1.4 + seed }, o); }
// personaje en el 3D: pies en F, altura del dibujo h; op: { o: opciones del modelo, life: {seed, words|talk, walk, look, gest}, cow: {…}, flip, op }
function pj(fn, F, face, h = 1.75, op = {}) { const a = W.proj(F), b = W.proj(V3(F.x, F.y + h, F.z)); if (!a.ok || a.d < .4) return [F, ''];
  const s = (a.y - b.y) / (1700 + PJ_LEGX), i = PJN++, T = window.__T || 0;
  (window.__PJ = window.__PJ || []).push({ fn, face, x: a.x, y: a.y, h: (a.y - b.y) * (fn === 'vaca2d' ? .78 / 1.12 : 1), pt: !!(op.o && (op.o.hold || op.o.slap)), d: a.d });
  let o = Object.assign({ face, id: fn.slice(0, 3) + i }, op.o || {});
  if (fn === 'vaca2d') o = Object.assign(cowLife(T, op.seed ?? i, op.cow || {}), o);
  else if (op.life !== false) { const L = LIFE.of(T, (op.life || {}).seed ?? i, op.life || {}); const lo = L.o; if (o.hold || o.saco || o.slap) delete lo.armA; o = Object.assign({}, lo, o); if (L.walk) o.walk = L.walk; }
  if (op.walk) o.walk = op.walk;
  const svg = window[fn](o), fl = op.flip ? 'translate(1190,0) scale(-1,1)' : '';
  const [rc, rs, ra, bc, ba] = RIM[MOOD] || RIM.establo, k = 1 / s, dx = (rs * 11 * k * .9).toFixed(1), dy = (-6 * k * .9).toFixed(1);
  return [F, `<defs><filter id="rf${i}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="${TINT[MOOD] || TINT.establo}" result="t"/>
    <feOffset in="SourceAlpha" dx="${dx}" dy="${dy}" result="o1"/><feComposite in="SourceAlpha" in2="o1" operator="out" result="e1"/><feGaussianBlur in="e1" stdDeviation="${(1.8 * k).toFixed(1)}" result="b1"/><feFlood flood-color="${rc}" flood-opacity="${ra}"/><feComposite in2="b1" operator="in" result="r1"/><feComposite in="r1" in2="SourceAlpha" operator="in" result="r2"/>
    <feOffset in="SourceAlpha" dx="${(-dx * .8).toFixed(1)}" dy="${dy}" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="e2"/><feGaussianBlur in="e2" stdDeviation="${(1.5 * k).toFixed(1)}" result="b2"/><feFlood flood-color="${bc}" flood-opacity="${ba}"/><feComposite in2="b2" operator="in" result="k1"/><feComposite in="k1" in2="SourceAlpha" operator="in" result="k2"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="${(7 * k).toFixed(1)}" result="hb"/><feOffset in="hb" dy="${(3 * k).toFixed(1)}" result="hb2"/><feFlood flood-color="#000" flood-opacity=".26"/><feComposite in2="hb2" operator="in" result="halo"/>
    <feMerge><feMergeNode in="halo"/><feMergeNode in="t"/><feMergeNode in="r2"/><feMergeNode in="k2"/></feMerge></filter></defs>
    <g transform="translate(${(a.x - 595 * s).toFixed(1)},${(a.y - 2100 * s).toFixed(1)}) scale(${s.toFixed(4)})" filter="url(#rf${i})" ${op.op != null ? `opacity="${op.op}"` : ''}><g transform="${fl}">${svg}</g></g>`]; }
const depth = L => L.filter(x => x && x[1]).map(([p, s]) => [W.camera.position.distanceTo(p), s]).sort((a, b) => b[0] - a[0]).map(x => x[1]).join('');
const HAZE = { establo: ['#a8bcd8', .14, '#d8e4f0', .06], establo27: ['#ffd8a0', .12, '#fff0d0', .08], nieve: ['#dfe8f5', .14, '#ffffff', .1], prado: ['#fff0c0', .1, '#cfe8ff', .1], sueno: ['#ffd090', .16, '#fff0d0', .1], vecino: ['#ff9a50', .12, '#ffd8a0', .06], tienda: ['#ffe8c0', .1, '#fff4e0', .06] };
function dust(n = 24) { let o = ''; const T = window.__T || 0; for (let i = 0; i < n; i++) { const x = (hs(i, 21) * 1080 + T * (8 + hs(i, 22) * 14) + Math.sin(T * .7 + i) * 20) % 1080, y = (hs(i, 23) * 1700 + 80 - T * (6 + hs(i, 24) * 10) + 1920) % 1920, r = 1.5 + hs(i, 25) * 2.5, a = .12 + hs(i, 26) * .25;
  o += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff6e0" opacity="${a.toFixed(2)}"/>`; } return o; }
const haze = () => { const [c1, a1, c2, a2] = HAZE[MOOD] || HAZE.establo; return `<defs><linearGradient id="hzG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c2}" stop-opacity="${a2}"/><stop offset=".55" stop-color="${c1}" stop-opacity="0"/><stop offset="1" stop-color="${c1}" stop-opacity="${a1}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#hzG)"/>`; };
const out = (L, extra = '', pre = '') => pre + depth(L) + haze() + (MOOD === 'nieve' || MOOD === 'prado' ? '' : `<g opacity=".8">${dust()}</g>`) + extra;
const flash = (k, col = '#fff') => k > 0 && k < 1 ? `<rect width="1080" height="1920" fill="${col}" opacity="${(.9 * (1 - k)).toFixed(3)}"/>` : '';
const shake = (t, t0, amp = 8) => { const k = clamp((t - t0) / .35); return k > 0 && k < 1 ? `translate(${(Math.sin(t * 90) * amp * (1 - k)).toFixed(1)},${(Math.cos(t * 77) * amp * (1 - k)).toFixed(1)})` : ''; };
const notes = (t, n = 9) => { let o = ''; for (let i = 0; i < n; i++) { const ph = (t * .35 + hs(i, 31)) % 1, x = 120 + hs(i, 32) * 840 + Math.sin(t * 2 + i) * 30, y = 1500 - ph * 1200, a = Math.sin(ph * Math.PI) * .9, sc = .8 + hs(i, 33) * .6;
  o += `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${sc.toFixed(2)}) rotate(${(Math.sin(t * 3 + i) * 12).toFixed(1)})" opacity="${a.toFixed(2)}"><path d="M0,0 L0,-90 L50,-104 L50,-14" stroke="#1e1418" stroke-width="16" fill="none" stroke-linejoin="round"/><path d="M0,0 L0,-90 L50,-104 L50,-14" stroke="#fff" stroke-width="7" fill="none" stroke-linejoin="round"/>
    <ellipse cx="-14" cy="2" rx="20" ry="15" fill="#fff" stroke="#1e1418" stroke-width="7" transform="rotate(-20,-14,2)"/><ellipse cx="36" cy="-12" rx="20" ry="15" fill="#fff" stroke="#1e1418" stroke-width="7" transform="rotate(-20,36,-12)"/></g>`; } return o; };
const glowAt = (p, k, col = '#d8f0ff') => { const a = W.proj(p); if (!a.ok || k <= 0) return ''; const r = 80 + k * 2400; return `<defs><radialGradient id="gwG"><stop offset="0" stop-color="#ffffff" stop-opacity="${Math.min(1, k * 1.4).toFixed(2)}"/><stop offset=".5" stop-color="${col}" stop-opacity="${Math.min(1, k * 1.2).toFixed(2)}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><circle cx="${a.x.toFixed(0)}" cy="${a.y.toFixed(0)}" r="${r.toFixed(0)}" fill="url(#gwG)"/>`; };
const walkPh = (d, stride = .55) => ({ ph: d / stride * Math.PI, amp: 1 });
// posiciones fijas
const COWS = [[-2.25, -4.5], [-.75, -4.5], [.75, -4.5], [2.25, -4.5]];
const VARS = ['frisona', 'negra', 'gorda', 'parda'], TAGS = [14, 21, 33, 52];
const vacas = (T, sel = [0, 1, 2, 3], o = {}, face = 'serio', co = {}) => sel.map(i => pj('vaca2d', V3(COWS[i][0], 0, COWS[i][1] + (i % 2 ? .15 : -.1)), (typeof face === 'function' ? face(i) : face), 2.0, { seed: i * 3 + 1, o: Object.assign({ var: VARS[i], tag: TAGS[i] }, o), cow: co }));
const VC = [5000 - 4.65, 5000 - 3.15, 5000 - 1.65];   // vacas del vecino
const vacasV = (T, o = {}, face = 'serio') => VC.map((x, i) => pj('vaca2d', V3(x, 0, -4.5 + (i % 2) * .12), face, 2.0, { seed: 20 + i * 5, o: Object.assign({ var: ['blanca', 'frisona', 'parda'][i], tag: [61, 74, 88][i] }, o), cow: { tail: Math.sin(T * .6 + i) * 4, chew: Math.sin(T * 2 + i) * .4 } }));

// =====================================================================================================
// 1 · GANCHO — fila de vacas con gafas; la cámara arranca en una vaca y se abre a toda la fila con el granjero orgulloso
// =====================================================================================================
S.gancho = (t, D, B) => { setup(t, 'barn', 'establo'); const T = t;
  const iz = P_(.05, -2.6, 1.75, .75), all = [C_(.75, -4.6), C_(-.75, -4.35), iz];
  camC(SH(() => all, t, D, { yaw: -14, occ: .78, elev: .05, aim: .05 }, { yaw: 10, occ: .66, elev: .45 }, { fov: 46 }));
  return out([...vacas(T, [1, 2], { vr: 1 }), pj('granjero2d', V3(.05, 0, -2.6), t < D * .55 ? 'serio' : 'feliz', 1.75, { o: { hold: 'vr' }, life: { seed: 1, look: [.3, -.2] } })]); };

// 2 · PIENSO — el vecino carga un saco de «PIENSO PREMIUM» en su establo, con la estufa encendida (la cámara le sigue de lado)
S.pienso = (t, D, B) => { setup(t, 'vbarn', 'vecino'); const T = t, x0 = 4997.6, x1 = 5000.6, x = x0 + (x1 - x0) * lin(t, 0, D * .9), z = -2.5;
  const c = SH(tt => [P_(x0 + (x1 - x0) * lin(tt, 0, D * .9), z, 1.86, .78)], t, D, { yaw: -16, occ: .74, elev: .2 }, { yaw: 10, occ: .8, elev: .08 }, { fov: 44 });
  camC(c);
  return out([pj('vecino2d', V3(x, 0, z), 'feliz', 1.86, { o: { saco: 1 }, walk: walkPh(x - x0), life: { seed: 2 } })]); };

// 3 · BURLA — «¿Y qué les vas a poner, el telediario?»: el vecino se ríe en el camino nevado; el granjero, con la caja de las gafas, ni se inmuta
S.burla = (t, D, B) => { setup(t, 'snow', 'nieve'); const T = t, words = LIFE.words(B, 0);
  const ve = P_(2998.7, 1.4, 1.86, .7), iz = P_(3000.9, 2.4, 1.75, .78);
  camC(SH(() => [ve, iz], t, D, { yaw: 14, occ: .6, elev: .3 }, { yaw: -6, occ: .7, elev: .1, aim: .05 }, { fov: 44 }));
  return out([pj('vecino2d', V3(ve.x, 0, ve.z), 'picaro', 1.86, { life: { seed: 2, words, look: [.6, 0] }, o: { lean: Math.sin(T * 6) * 2 } }),
    pj('granjero2d', V3(iz.x, 0, iz.z), 'serio', 1.75, { o: { hold: 'vr', invierno: 1 }, life: { seed: 1, look: [-.8, 0] } })]); };

// 4 · NIEVE — grúa que baja del cielo gris al establo rojo nevado; el granjero cruza la nieve hacia el portón
S.nieve = (t, D, B) => { setup(t, 'snow', 'nieve'); const T = t, k = eIO(lin(t, 0, D)), x = 3001.2 + .9 * lin(t, 0, D);
  camK(k, [3002.5, 8.5, 16], [3000, 5.5, -10], 50, [3001.2, 1.8, 7.5], [3000, 1.25, -8], 46, .0004);
  return out([pj('granjero2d', V3(x, 0, -3.0), 'serio', 1.75, { o: { invierno: 1 }, walk: walkPh(x - 3001.2), life: { seed: 1 } })]); };

// 5 · PARED — lo que miran: la mancha de humedad de la pared de delante… y ellas, aburridas, «mirando a cámara» desde la pared
S.pared = (t, D, B) => { setup(t, 'barn', 'establo'); const T = t, tc = D * .42;
  camC(SH(() => [C_(-.75, -4.35), C_(.75, -4.6)], t, D, { yaw: 14, occ: .72, elev: .05, side: -.3 }, { yaw: -12, occ: .8, elev: .2, side: .3 }, { fov: 44 }));
  return out(vacas(T, [1, 2], {}, i => i === 1 ? 'relajada' : 'serio', { chew: Math.sin(T * 2) * .3, tail: Math.sin(T * .5) * 3 })); };

// 6 · PIZARRA — 22 litros por vaca (se escribe con tiza) y «ni uno más»: el granjero suspira bajo la pizarra
S.pizarra = (t, D, B) => { setup(t, 'barn', 'establo'); const T = t, t22 = wt(B, 'pizarra', 0, 'veintidos'), tni = wt(B, 'pizarra', 0, 'ni');
  W.setChalk({ n: 22, w: lin(t, t22 - .2, t22 + .6) });
  const iz = P_(1.9, -3.3, 1.75, .6), board = O_(1.4, 2.0, -6.0, .95, .66);
  if (t < tni - .1) { camC(SH(() => [iz, board, C_(.75, -4.6)], t, tni, { yaw: -10, occ: .66, elev: -.25, aim: .1 }, { yaw: 6, occ: .74, elev: -.1, aim: .15 }, { fov: 48 }));
    return out([...vacas(T, [2], {}, 'serio'), pj('granjero2d', V3(iz.x, 0, iz.z), t < t22 ? 'serio' : 'preocupado', 1.75, { life: { seed: 1, look: [-.4, -.6] }, o: { lean: -2 } })]); }
  const k = eIO(lin(t, tni - .1, D)); camK(k, [1.3, 2.3, -3.9], [1.4, 2.42, -6], 44, [1.5, 2.42, -4.45], [1.4, 2.44, -6], 40, .0003); return out([]); };

// 7 · APODO — «el Cine»: dos vecinos del pueblo se ríen y le señalan mientras pasa con la caja
S.apodo = (t, D, B) => { setup(t, 'snow', 'nieve'); const T = t, x = 3001.6 - 1.4 * lin(t, 0, D), z = 3.2;
  camC(SH(tt => [P_(3001.6 - 1.4 * lin(tt, 0, D), z, 1.75, .7), P_(2998.4, 1.2, 1.86, .7), P_(2999.2, .4, 1.84, .6)], t, D, { yaw: 10, occ: .58, elev: .25 }, { yaw: -8, occ: .64, elev: .15 }, { fov: 44 }));
  return out([pj('vecino2d', V3(2998.4, 0, 1.2), 'feliz', 1.86, { o: { slap: 1 }, life: { seed: 2, look: [.7, 0] } }), pj('abuelo2d', V3(2999.2, 0, .4), 'feliz', 1.84, { o: { coat: 1 }, life: { seed: 5, look: [.7, 0] } }),
    pj('granjero2d', V3(x, 0, z), 'serio', 1.75, { o: { hold: 'vr', invierno: 1 }, walk: walkPh(3001.6 - x), life: { seed: 1, look: [-.5, 0] } })]); };

// 8 · VECINO — «pienso de primera, vitaminas… y una estufa»: la cámara recorre los sacos, el estante de vitaminas y la estufa, y vuelve al vecino orgulloso
S.vecino = (t, D, B) => { setup(t, 'vbarn', 'vecino'); const T = t, tv = wt(B, 'vecino', 0, 'vitaminas'), te = wt(B, 'vecino', 0, 'estufa');
  const k1 = seg(t, tv - .7, tv + .2), k2 = seg(t, te - .6, te + .2), xv = 5000.6 + 3.1 * k1 - .8 * k2, zv = -3.3 - .4 * k2, walking = (t > tv - .7 && t < tv + .2) || (t > te - .6 && t < te + .2);
  const ve = P_(xv, zv, 1.86, .8), SACK = O_(5001.6, 0, -5.3, 1.25, .95), SHELF = O_(5005.3, 1.4, -5.85, .9, .75), STOVE = O_(5004.2, 0, -4.6, 1.1, .5);
  const F0 = FR([ve, SACK], { yaw: -10 + 6 * lin(t, 0, tv), occ: .66, elev: .2, fov: 44 }), F1 = FR([ve, SHELF], { yaw: 12, occ: .66, elev: .05, fov: 44 }), F2 = FR([ve, STOVE], { yaw: 4 - 10 * lin(t, te, D), occ: .7, elev: .2, fov: 44 });
  const mix = (A, B2, k) => ({ pos: A.pos.map((v, i) => v + (B2.pos[i] - v) * k), look: A.look.map((v, i) => v + (B2.look[i] - v) * k), fov: A.fov + (B2.fov - A.fov) * k });
  camC(mix(mix(F0, F1, seg(t, tv - .5, tv + .2)), F2, seg(t, te - .5, te + .2)));
  return out([pj('vecino2d', V3(xv, 0, zv), 'feliz', 1.86, { walk: walking ? walkPh(xv - 5000.6 + zv) : null, life: { seed: 2, gest: 1.4, talk: [[0, D]], look: [k1 > .5 && k2 < .5 ? .7 : -.2, -.2] } })]); };

// 9 · PRUEBA — el Cine con unas gafas y dos vacas: órbita alrededor del granjero y las dos elegidas
S.prueba = (t, D, B) => { setup(t, 'barn', 'establo'); const T = t, td = wt(B, 'prueba', 0, 'dos');
  const iz = P_(3.0, -2.9, 1.75, .78);
  camC(SH(() => [iz, C_(.75, -4.6), C_(2.25, -4.6)], t, D, { yaw: -16, occ: .7, elev: .25 }, { yaw: 12, occ: .78, elev: .1 }, { fov: 44 }));
  return out([...vacas(T, [2, 3], {}, i => t > td ? 'sorpresa' : 'serio'), pj('granjero2d', V3(iz.x, 0, iz.z), 'picaro', 1.75, { o: { hold: 'vr' }, life: { seed: 1, look: [-.7, -.3] } })]); };

// 10 · PRADO — entramos por el visor (resplandor) y volamos bajo por el prado: hierba, flores, sol… y música clásica (notas)
S.prado = (t, D, B) => { const T = t, tin = .75, th = wt(B, 'prado', 0, 'hierba'), tf = wt(B, 'prado', 0, 'flores'), ts = wt(B, 'prado', 0, 'sol'), tm = wt(B, 'prado', 0, 'musica');
  if (t < tin) { setup(t, 'barn', 'establo'); const k = eIO(lin(t, 0, tin)); camMix(FR([C_(.75, -4.6)], { occ: .66, yaw: -6, fov: 44 }), FR([C_(.75, -4.6)], { occ: .8, yaw: 4, fov: 42, aim: .1 }), k);
    return out(vacas(T, [2], { vr: 1, screenShow: 1 }, 'serio'), glowAt(V3(.75, 1.32, -4.4), lin(t, .2, tin))); }
  setup(t, 'meadow', 'prado'); const u = t - tin, M0 = 1000;
  // vuelo bajo hacia el fondo; en «flores» baja a ras; en «sol» mira arriba; en «música» se abre y suben las notas
  const z = 5 - 7 * lin(u, 0, D - tin), dip = seg(t, tf - .3, tf + .3) - seg(t, ts - .3, ts + .3), up = seg(t, ts - .3, ts + .4) - .6 * seg(t, tm - .2, tm + .6);
  cam(V3(M0 + Math.sin(u * .6) * .6, .75 - .35 * dip + .4 * seg(t, tm, D), z), V3(M0 + 3 * up, .55 - .3 * dip + 6 * up, z - 8), 44 + 8 * seg(t, tm, D), .0007);
  return out([], (t > tm - .2 ? notes(t) : '') + flash(lin(t, tin, tin + .3))); };

// 11 · DÍA 1 — letrero «DÍA 1» y las vacas con gafas inmóviles (ni la cola)
S.dia1 = (t, D, B) => { setup(t, 'barn', 'establo'); const T = t, tc = .75;
  if (t < tc) { const k = eIO(lin(t, 0, tc)); camK(k, [2.6, 2.45, -4.6], [2.75, 2.6, -6], 42, [2.78, 2.6, -5.0], [2.75, 2.62, -6], 38, .0003); return out([]); }
  const k = lin(t, tc, D); camC(SH(() => [C_(.75, -4.6), C_(2.25, -4.35)], t - tc, D - tc, { yaw: 12, occ: .74, elev: .15, side: -.3 }, { yaw: -8, occ: .82, elev: .05, side: .3 }, { fov: 44 }));
  return out(vacas(T, [2, 3], { vr: 1 }, 'serio', { still: 1 })); };

// 12 · RISA — el vecino se asoma al portón del Cine y se parte de risa (se da en la rodilla, cabeza atrás)
S.risa = (t, D, B) => { setup(t, 'barn', 'establo'); const T = t, ve = P_(5.6, 2.6, 1.86, 1.05);
  camC(SH(() => [ve], t, D, { yaw: 24, occ: .76, elev: .1 }, { yaw: 40, occ: .86, elev: .02 }, { fov: 44 }));
  return out([pj('vecino2d', V3(ve.x, 0, ve.z), 'feliz', 1.86, { o: { slap: 1, head: [0, -18 + Math.sin(T * 14) * 8, -8 + Math.sin(T * 9) * 3] }, life: { seed: 2, look: [-.6, 0] } })]); };

// 13 · DÍA 5 — letrero «DÍA 5» y la pizarra con una flecha que empieza a subir; el granjero se acerca, ilusionado
S.dia5 = (t, D, B) => { setup(t, 'barn', 'establo'); W.setDay(5); const T = t, tsu = wt(B, 'dia5', 0, 'subir');
  W.setChalk({ n: 22, arrow: lin(t, tsu - .4, tsu + .5) * .6 });
  const iz = P_(2.0, -3.2, 1.75, .6);
  if (t < .65) { const k = eIO(lin(t, 0, .65)); camK(k, [2.7, 2.6, -4.9], [2.75, 2.62, -6], 40, [2.3, 2.5, -4.6], [2.2, 2.55, -6], 42, .0003); return out([]); }
  camC(SH(() => [iz, O_(1.4, 2.0, -6.0, .95, .66), C_(.75, -4.6)], t - .65, D - .65, { yaw: -6, occ: .66, elev: -.2, aim: .1 }, { yaw: 8, occ: .76, elev: -.1, aim: .12 }, { fov: 48 }));
  return out([...vacas(T, [2], { vr: 1 }, 'relajada'), pj('granjero2d', V3(iz.x, 0, iz.z), 'sorpresa', 1.75, { life: { seed: 1, look: [-.4, -.7] } })]); };

// 14 · DÍA 10 — «DÍA 10», el 27 en amarillo; salto de alegría, golpe de zoom y la luz se vuelve cálida
S.dia10 = (t, D, B) => { const t27 = wt(B, 'dia10', 0, 'veintisiete'); setup(t, 'barn', t < t27 ? 'establo' : 'establo27'); W.setDay(10); const T = t;
  W.setChalk({ n: 27, w: lin(t, t27 - .15, t27 + .45) });
  const jump = t > t27 ? Math.max(0, Math.sin(Math.PI * lin(t, t27 + .05, t27 + .55))) * .35 : 0, iz = P_(2.0, -3.2, 1.75, .7);
  const c = SH(() => [P_(2.0, -3.2, 2.1, .7), O_(1.4, 2.0, -6.0, .95, .66), C_(.75, -4.6)], t, D, { yaw: 8, occ: .64, elev: -.15, aim: .12 }, { yaw: -6, occ: .7, elev: -.2, aim: .14 }, { fov: 48 });
  const punch = sOut(t, t27, t27 + .25) - seg(t, t27 + .25, t27 + 1.0) * .6; const look = A2V(c.look), pos = A2V(c.pos).lerp(look, .05 * punch); cam(pos, look, c.fov);
  return out([...vacas(T, [2], { vr: 1, screenShow: 1 }, t > t27 ? 'feliz' : 'relajada'), pj('granjero2d', V3(iz.x, jump, iz.z), t > t27 ? 'feliz' : 'serio', 1.75, { o: { armA: t > t27 ? { L: [40, -380], R: [-40, -380] } : undefined }, life: { seed: 1, look: [-.4, -.6] } })],
    '', ''); };

// 15 · VECINO 22 — en el establo de al lado, con estufa y vitaminas… su pizarra sigue en 22. Cara de póker.
S.vecino22 = (t, D, B) => { setup(t, 'vbarn', 'vecino'); const T = t, t22 = wt(B, 'vecino22', 0, 'veintidos'), ve = P_(5001.0, -3.0, 1.86, .65);
  const K0 = [[5004.0, 1.0, -1.6], [5004.2, .55, -4.6], 44], K1 = [[5001.4, 1.6, 1.4], [5001.2, 1.6, -5.2], 46];
  if (t < D * .38) { const k = eIO(lin(t, 0, D * .38)); camK(k, K0[0], K0[1], K0[2], [5003.4, 1.2, -.6], [5003.2, .9, -4.6], 46); return out([]); }
  camC(SH(() => [ve, O_(5001.6, 1.95, -6.0, .95, .66)], t - D * .38, D * .62, { yaw: 10, occ: .62, elev: -.1, aim: .1 }, { yaw: -4, occ: .72, elev: -.15, aim: .12 }, { fov: 48 }));
  return out([pj('vecino2d', V3(ve.x, 0, ve.z), t < t22 ? 'sorpresa' : 'preocupado', 1.86, { life: { seed: 2, look: [-.3, -.7] }, o: { cruzado: t > t22 } })]); };

// 16 · PORQUE — «¿Por qué?» el granjero se rasca la cabeza; luego la pizarra dibuja la vaca nerviosa (grifo cerrado) y la tranquila (grifo abierto)
S.porque = (t, D, B) => { setup(t, 'barn', 'establo27'); const T = t, te = wt(B, 'porque', 0, 'estresada'), tt = wt(B, 'porque', 0, 'tranquila');
  W.setChalk({ diagram: .5 * lin(t, te - .4, te + .6) + .5 * lin(t, tt - .4, tt + .6) });
  const iz = P_(2.45, -3.4, 1.75, .8), board = O_(1.4, 2.0, -6.0, .95, .66);
  camC(SH(() => [iz, board], t, D, { yaw: -12, occ: .76, elev: -.25, aim: .12 }, { yaw: 4, occ: .88, elev: -.2, aim: .2 }, { fov: 44 }));
  const scratch = t < te - .2, point = !scratch;
  return out([pj('granjero2d', V3(iz.x, 0, iz.z), scratch ? 'preocupado' : 'picaro', 1.75, { o: { armA: scratch ? { L: [0, 0], R: [-180, -520 + Math.sin(T * 14) * 30] } : { L: [0, 0], R: [-260, -330] } }, life: { seed: 1, look: point ? [-.8, -.5] : [.2, -.2], gest: 0 } })]); };

// 17 · CABEZA — el visor por dentro: el prado se mueve en la pantalla; la vaca sonríe y mastica (órbita y empujón, vaca entera)
S.cabeza = (t, D, B) => { setup(t, 'barn', 'establo27'); const T = t;
  camC(SH(() => [C_(.75, -4.6), C_(-.75, -4.35)], t, D, { yaw: -14, occ: .62, elev: .2 }, { yaw: 10, occ: .74, elev: 0, aim: .1 }, { fov: 44 }));
  return out(vacas(T, [1, 2], { vr: 1, screenShow: 1 }, i => i === 2 ? 'feliz' : 'relajada')); };

// 18 · EXPERTOS — la tele vieja: el experto niega con la cabeza; latigazo a la pizarra: 27
S.expertos = (t, D, B) => { setup(t, 'barn', 'establo27'); const T = t, tp = wt(B, 'expertos', 0, 'pero');
  W.setChalk(27);
  if (t < tp - .1) { const k = eIO(lin(t, 0, tp - .1)); const iz = P_(-5.2, .9, 1.75, .6);
    camC(SH(() => [iz, O_(-6.76, 1.5, -1.8, .5, .3)], t, tp - .1, { yaw: -62, occ: .6, elev: .2 }, { yaw: -74, occ: .68, elev: .1 }, { fov: 46 }));
    return out([pj('granjero2d', V3(iz.x, 0, iz.z), 'serio', 1.75, { life: { seed: 1, look: [-.9, -.2] }, o: { cruzado: 1 } })]); }
  camC(SH(() => [O_(1.4, 2.0, -6.0, .95, .66), C_(.75, -4.6), P_(2.3, -3.0, 1.75, .6)], t - tp, D - tp, { yaw: -8, occ: .7, elev: -.1, aim: .12 }, { yaw: 6, occ: .76, elev: -.12, aim: .14 }, { fov: 48 }));
  return out([...vacas(T, [2], { vr: 1, screenShow: 1 }, 'feliz'), pj('granjero2d', V3(2.3, 0, -3.0), 'picaro', 1.75, { life: { seed: 1, look: [.6, 0] } })]); };

// 19 · SUEÑO — diez cajas de gafas apiladas… y el sueño: un establo enorme lleno de vacas con gafas (retroceso por el pasillo)
S.sueno = (t, D, B) => { const T = t, ts = wt(B, 'sueno', 0, 'para');
  if (t < ts - .1) { setup(t, 'barn', 'establo27'); W.showBoxes(Math.ceil(10 * lin(t, 0, ts * .7))); const iz = P_(4.0, -.6, 1.75, .6);
    camC(SH(() => [iz, O_(5.28, 0, -.31, 1.9, .6)], t, ts, { yaw: -18, occ: .62, elev: .2 }, { yaw: -4, occ: .68, elev: .1 }, { fov: 46 }));
    return out([pj('granjero2d', V3(iz.x, 0, iz.z), 'feliz', 1.75, { life: { seed: 1, look: [.7, -.2] } })]); }
  setup(t, 'long', 'sueno'); const u = lin(t, ts - .1, D), L0 = 4000;
  cam(V3(L0, 1.45 + .55 * u, -.5 + 5.5 * eOut(u)), V3(L0, 1.2, -26), 50 + 8 * u, .0006);
  const L = []; for (let k = 0; k < 13; k++) for (const sd of [-1, 1]) { const z = -9 - k * 2.6 - (sd > 0 ? 1.3 : 0); L.push(pj('vaca2d', V3(L0 + sd * 1.9, 0, z), k % 3 ? 'serio' : 'feliz', 2.0, { seed: k * 2 + (sd > 0), o: { vr: 1, var: ['frisona', 'negra', 'gorda', 'parda', 'blanca', 'joven'][(k * 2 + (sd > 0)) % 6], tag: 100 + k * 2 + (sd > 0) } })); }
  L.push(pj('granjero2d', V3(L0, 0, -3.4), 'feliz', 1.75, { life: { seed: 1, look: [0, -.4] } }));
  return out(L); };

// 20 · TIENDA — el vecino entra en la tienda, pasa de largo los sacos de pienso… y va directo a las gafas
S.tienda = (t, D, B) => { setup(t, 'shop', 'tienda'); const T = t, tn = wt(B, 'tienda', 0, 'no'), x0 = 5999.0, x1 = 5999.7, x = x0 + (x1 - x0) * seg(t, .1, D * .8), z = -.2;
  camC(SH(tt => [P_(x0 + (x1 - x0) * seg(tt, .1, D * .8), z, 1.86, .7), P_(6000.7, -.9, 1.84, .6)], t, D, { yaw: -12, occ: .68, elev: .2 }, { yaw: 10, occ: .76, elev: .1 }, { fov: 44 }));
  const shake = t > tn && t < tn + .9 ? [Math.sin(T * 18) * 14, 0, Math.sin(T * 18) * 5] : null;
  return out([pj('abuelo2d', V3(6000.7, 0, -.9), t > tn + .5 ? 'sorpresa' : 'serio', 1.84, { life: { seed: 5, look: [-.7, 0] } }),
    pj('vecino2d', V3(x, 0, z), t > tn ? 'serio' : 'preocupado', 1.86, { walk: lin(t, .1, D * .8) < 1 ? walkPh(x - x0) : null, life: { seed: 2, look: [x < 5999.4 ? -.7 : .7, -.2] }, o: shake ? { head: shake } : {} })]); };

// 21 · FINAL — el vecino, en su establo, con sus vacas con gafas… y él también con unas puestas, feliz
S.final = (t, D, B) => { setup(t, 'vbarn', 'vecino'); const T = t, ve = P_(4999.6, -2.6, 1.86, .7);
  camC(SH(() => [ve, C_(VC[2], -4.5)], t, D, { yaw: 12, occ: .8, elev: .05, aim: .05 }, { yaw: -10, occ: .66, elev: .4 }, { fov: 46 }));
  return out([...[2].map(i => pj('vaca2d', V3(VC[i], 0, -4.5 + (i % 2) * .12), 'feliz', 2.0, { seed: 20 + i * 5, o: { var: ['blanca', 'frisona', 'parda'][i], tag: [61, 74, 88][i], vr: 1, screenShow: 1 } })), pj('vecino2d', V3(ve.x, 0, ve.z), 'feliz', 1.86, { o: { vr: 1 }, life: { seed: 2, gest: .6 } })]); };
Object.keys(S).forEach(k => { const f = S[k]; S[k] = (t, D, B) => { CUR = k; const r = f(t, D, B); W.render(); return r; }; });

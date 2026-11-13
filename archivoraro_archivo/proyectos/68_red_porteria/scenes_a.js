// «La red de la portería» (68) — ESTILO 3D: world_futbol.js + personajes 2D. Reglas del tutorial de la referencia:
// lente estrecha, cada plano es push-in / órbita (~98°) / whip que frena en seco; la cámara casi nunca quieta;
// movimientos «snap» (60–70 % en los primeros 4–5 fotogramas), personaje parado = totalmente quieto, la cara cambia 1 fotograma antes que el cuerpo,
// boca cada ~2 fotogramas al hablar, sin parpadeos, personajes nunca desenfocados.
window.CFG = { capY: 1500, capSize: 96, transDur: .42, blurK: .35, antic: .1, blurChars: false, transDurBy: { liverpool: .7, arbitro: .6, anulan: .25, noche: .5, dibuja: .4, rien: .5, papelera: .5, prueba: .5 },
  trans: { liverpool: 'fly', nada: 'glide', pierde: 'whip', gritos: 'whip', arbitro: 'fly', brodie: 'whip', anulan: 'whip', noche: 'swish', bolsillos: 'glide', dibuja: 'swish', rien: 'swish',
    sardinas: 'glide', papelera: 'swish', discutir: 'glide', prueba: 'swish', disparo: 'whip', liga: 'whip', hoy: 'whip', gracias: 'whip' } };
// eventos: cada palabra del subtítulo es un evento (sin acentos, en minúsculas; los números con «_»): E.balon, E.entra, E._1889…
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { const ws = l.cap.split(' ').map(w => norm(w.split('|')[0])); EVS[l.sc] = B => { const o = {}; ws.forEach((w, i) => { const k = /^[0-9]/.test(w) ? '_' + w : w; if (k && !(k in o)) o[k] = B[0].w[i]; }); return o; }; });
const S = {}, W = W2, K = '#1b1720', ADULT = 1.84;
window.READY = W.crowd(window.CROWD_IMGS);
const hs = (a, b = 1) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const k01 = (t, a, b) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const oc = k => 1 - Math.pow(1 - clamp(k), 3), snap = (t, t0, d = .5) => 1 - Math.pow(1 - clamp((t - t0) / d), 4), rad = a => a * Math.PI / 180;
// ---------- cámara ----------
{ const _sc = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * 4.59) * .5 + Math.sin(T * 8.61) * .3, Math.sin(T * 5.3 + 1) * .5 + Math.sin(T * 9.7) * .25, 0).multiplyScalar(.012 * p.distanceTo(l) / 8); return _sc(p.clone().add(d), l, f, fo, ap); }; }
const cam = (p, l, f = 30, ap = .0022) => { W.setCam(p, l, f, p.distanceTo(l), ap); W.render(); };
const pushIn = (p0, tg, k, factor = 1.9) => tg.clone().add(p0.clone().sub(tg).divideScalar(lerp(1, factor, oc(k))));
const orb = (c, az, el, d) => V3(c.x + Math.sin(rad(az)) * Math.cos(rad(el)) * d, c.y + Math.sin(rad(el)) * d, c.z + Math.cos(rad(az)) * Math.cos(rad(el)) * d);
function sp(t, Ks) { const n = Ks.length; if (t <= Ks[0][0]) return Ks[0][1].clone(); if (t >= Ks[n - 1][0]) return Ks[n - 1][1].clone(); let i = 0; while (t > Ks[i + 1][0]) i++;
  const u = (t - Ks[i][0]) / (Ks[i + 1][0] - Ks[i][0]), a = Ks[Math.max(0, i - 1)][1], b = Ks[i][1], c = Ks[i + 1][1], d = Ks[Math.min(n - 1, i + 2)][1], u2 = u * u, u3 = u2 * u;
  const f = (p0, p1, p2, p3) => .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); return V3(f(a.x, b.x, c.x, d.x), f(a.y, b.y, c.y, d.y), f(a.z, b.z, c.z, d.z)); }
// ---------- 2D anclado al mundo ----------
function frameOf(F, h) { const pf = W.proj(F), pt = W.proj(V3(F.x, F.y + h, F.z)), dx = pt.x - pf.x, dy = pt.y - pf.y, L = Math.hypot(dx, dy); return { x: pf.x, y: pf.y, s: L / 462, r: Math.atan2(dx, -dy), ok: pf.ok && pt.ok }; }
const rot2 = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
function toScr(fr, x, y, lean = 0) { let [a, b] = rot2(x, y, rad(lean)); [a, b] = rot2(a * fr.s, b * fr.s, fr.r); return [fr.x + a, fr.y + b]; }
// ---------- reparto ----------
const CAST = {}; window.CAST68.forEach(c => CAST[c.name] = c);
const DAY = { tint: '#ffe2bd', k: .14, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.6 }, EVE = { tint: '#ffc79c', k: .22, rim: '#ffe2b8', rimA: .6, rimX: 1, rimY: -.4 }, NIGHT = { tint: '#ffb47c', k: .3, rim: '#ffd9a0', rimA: .6, rimX: -1, rimY: -.3 };
const onScr = (F, h) => { const a = W.proj(F), b = W.proj(V3(F.x, F.y + h, F.z)); if (!a.ok || !b.ok) return false; const m = 520; return !(Math.max(a.x, b.x) < -m || Math.min(a.x, b.x) > 1080 + m || Math.max(a.y, b.y) < -m || Math.min(a.y, b.y) > 1920 + m); };
const who = (name, o, F, h = ADULT, opt) => onScr(F, h + .6) ? stickAt(Object.assign({}, typeof name === 'string' ? CAST[name] : name, o), F, V3(F.x, F.y + h, F.z), W, opt) : '';
const FT = ['#3b3f4a', '#5a4632', '#2f3a52', '#6b5a44', '#4a4a44', '#7a2e2a', '#2e4a3a', '#55504a', '#3a2e2a', '#6a6458', '#2a2a30', '#5e3a52', '#44506a', '#6a3a2a', '#3e4a3a', '#5a5248'],
  FH = ['flatcap', 'bowler', 'flatcap', null, 'flatcap', 'bowler', 'flatcap', 'flatcap', 'bowler', 'flatcap', 'flatcap', null, 'bowler', 'flatcap', 'flatcap', 'bowler'],
  FHC = ['#6b6458', '#25222a', '#4a443c', null, '#7a6a52', '#3a2e24', '#55606a', '#3e3a36', '#25222a', '#8a7a62', '#5a5048', null, '#2a2a30', '#6a5a44', '#4a4a52', '#4a3424'],
  FHA = ['#5a3a22', '#2a1a12', '#b05a2a', '#1b1418', '#8a847c', '#5a3a22', '#c87a3a', '#2a1a12', '#8a847c', '#5a3a22', '#b05a2a', '#2a1a12', '#1b1418', '#c87a3a', '#5a3a22', '#2a1a12'],
  FS = ['#c8302e', null, '#2f4f9f', null, '#c8302e', null, null, '#f2c94c', null, '#2f4f9f', null, '#c8302e', null, null, '#c8302e', null];
const fanLook = i => ({ outfit: i % 3 === 0 ? 'suit' : 'shirt', top: FT[i], topD: FT[i], pants: '#2a2a30', shirt: '#e9e4d6', hat: FH[i] || undefined, hatCol: FHC[i] || undefined, hairCol: FHA[i], hair2: FH[i] ? undefined : ['side', 'capHair', 'side'][i % 3],
  mustache: i % 4 === 1 || i === 12, beard: i % 7 === 3 ? FHA[i] : undefined, glasses: i % 6 === 4, scarf: FS[i] || undefined, vest: i % 5 === 2 ? '#4a3a2a' : undefined, tie: i % 3 === 0 ? '#7a2e2a' : undefined, headSeed: i + 1, hatTilt: ((i * 7) % 7) - 3, rich: true, eyeStyle: 'palo', face: 'smug', mouth: 'line' });
const rowG = r => [(r + 1) * .42, -58 - (r * .75 + .375)], rowW = r => [(r + 1) * .42, -41 - (r * .75 + .375)];   // gradas: [altura, z] detrás de la portería · [altura, x] en la grada oeste
// ---------- poses ----------
function mixP(A, B, k) { const o = Object.assign({}, A, B); for (const key in B) { const a = A[key], b = B[key]; if (typeof b === 'number' && typeof a === 'number') o[key] = lerp(a, b, k); else if (Array.isArray(b) && Array.isArray(a) && typeof b[0] === 'number') o[key] = b.map((v, i) => lerp(a[i] ?? v, v, k)); } return o; }
// seq(t, [[t0, pose, dur?], …]): de pose a pose con «snap»; cara, boca y mirada (textos) cambian 1 fotograma antes que el cuerpo
function seq(t, L, dur = .5) { let P = Object.assign({}, L[0][1]); for (let j = 1; j < L.length; j++) { if (t < L[j][0] - .034) break; P = mixP(P, L[j][1], snap(t, L[j][0], L[j][2] || dur)); } return P; }
// posición en pantalla de la mano (sd = 1 derecha, -1 izquierda) de un personaje dibujado con who(name, pose, F)
function handPos(F, P, sd = 1, ext = 0) { const [sh, el] = (sd > 0 ? P.armR : P.armL) || [20, 10], a1 = rad(sd * sh), x1 = sd * 44 + Math.sin(a1) * 90, y1 = -360 + (P.bob || 0) + Math.cos(a1) * 90, a2 = a1 + rad(sd * el);
  return toScr(frameOf(F, ADULT), x1 + Math.sin(a2) * (86 + ext), y1 + Math.cos(a2) * (86 + ext), P.lean || 0); }
const talkM = (T, a, b, rest = 'line') => (T >= a && T <= b) ? ['open', 'o', 'smile', 'open', 'o'][Math.floor(hs(Math.floor(T * 15), 3) * 5)] : rest;
const laugh = (T, ph = 0, a = 1) => ({ face: 'happy', mouth: 'laugh', bob: -Math.abs(Math.sin(T * 10 + ph)) * 13 * a, headTilt: Math.sin(T * 10 + ph) * 6 * a, lean: Math.sin(T * 5 + ph) * 3 * a, armL: [26 + Math.sin(T * 10 + ph) * 9, 34], armR: [26 - Math.sin(T * 10 + ph) * 9, 34] });
const cheer = (T, ph = 0) => ({ face: 'happy', mouth: 'laugh', bob: -Math.abs(Math.sin(T * 9 + ph)) * 16, armL: [136 + Math.sin(T * 9 + ph) * 10, 30], armR: [138 - Math.sin(T * 9 + ph) * 10, 28], headTilt: Math.sin(T * 9 + ph) * 4 });
const shout = (T, ph = 0, arm = 1) => ({ face: 'angry', mouth: talkM(T + ph, 0, 1e9, 'open'), brows: -.5, bob: -Math.abs(Math.sin(T * 12 + ph)) * 5, armR: arm > 0 ? [128 + Math.sin(T * 14 + ph) * 12, 12] : [16, 24], armL: arm < 0 ? [128 + Math.sin(T * 14 + ph) * 12, 12] : [16, 24], lean: arm * 3 });
// chut: u = 0 quieto · .45 pierna atrás · .6 contacto · 1 final (golpea hacia la derecha de la pantalla)
function kick(u) { const back = snap(u, 0, .42), sw = clamp((u - .45) / .15), fol = snap(u, .6, .4), rec = k01(u, 1.0, 1.5);
  return { legR: [lerp(lerp(6, -44, back), 28, sw * sw) + fol * 50 - rec * 68, lerp(lerp(0, 72, back), 4, sw)], legL: [lerp(4, 10, back) - rec * 4, 0], lean: lerp(lerp(0, 10, back), -4, sw) - fol * 12 + rec * 14,
    armL: [lerp(20, 66, back) + fol * 16 - rec * 60, lerp(10, 30, back)], armR: [lerp(20, 30, back) + fol * 62 - rec * 70, 14], turn: .55, bob: -back * 6 + sw * 6, headTilt: -back * 4 + fol * 8 - rec * 4, face: u > .38 && u < .95 ? 'closed' : 'smug', mouth: u > .38 && u < .95 ? 'open' : 'line' }; }
// ---------- balón, red y efectos ----------
const fl = (p0, v, t) => V3(p0.x + v.x * t, p0.y + v.y * t - 4.9 * t * t, p0.z + v.z * t);
function ball2d(p, spin = 0, prev = null, big = 1) { const q = W.proj(p); if (!q.ok) return ''; const r = Math.max(4, q.ppm * .115 * big); let tr = '';
  if (prev) { const a = W.proj(prev); if (a.ok && Math.hypot(a.x - q.x, a.y - q.y) > r * .8) tr = `<path d="M${a.x.toFixed(1)},${a.y.toFixed(1)} L${q.x.toFixed(1)},${q.y.toFixed(1)}" stroke="#fff" stroke-opacity=".55" stroke-width="${(r * 1.5).toFixed(1)}" stroke-linecap="round"/><path d="M${a.x.toFixed(1)},${a.y.toFixed(1)} L${q.x.toFixed(1)},${q.y.toFixed(1)}" stroke="#8f5228" stroke-opacity=".35" stroke-width="${(r * .9).toFixed(1)}" stroke-linecap="round"/>`; }
  return tr + `<g transform="translate(${q.x.toFixed(1)},${q.y.toFixed(1)}) rotate(${(spin * 57.3).toFixed(0)})"><circle r="${r.toFixed(1)}" fill="#8f5228" stroke="${K}" stroke-width="${Math.max(2, r * .14).toFixed(1)}"/><path d="M${-r * .92},${-r * .2} Q0,${r * .35} ${r * .92},${-r * .2} M${-r * .5},${-r * .82} Q${r * .1},0 ${-r * .5},${r * .82} M${r * .55},${-r * .8} Q${r * .1},0 ${r * .55},${r * .8}" stroke="#4a260f" stroke-width="${(r * .1).toFixed(1)}" fill="none"/><rect x="${(-r * .1).toFixed(1)}" y="${(-r * .42).toFixed(1)}" width="${(r * .2).toFixed(1)}" height="${(r * .62).toFixed(1)}" rx="${(r * .05).toFixed(1)}" fill="#ecd9ae" stroke="#4a260f" stroke-width="${(r * .05).toFixed(1)}"/><path d="M${-r * .6},${-r * .5} Q${-r * .3},${-r * .75} ${r * .05},${-r * .78}" stroke="#fff" stroke-opacity=".35" stroke-width="${(r * .12).toFixed(1)}" fill="none" stroke-linecap="round"/></g>`; }
function net2d() { const L = W.netLines(1), c = W.proj(V3(0, 1.2, -53.7)); let d = ''; for (const ln of L) { let pen = 0; for (const p of ln) { const q = W.proj(p); if (!q.ok) { pen = 0; continue; } d += (pen ? 'L' : 'M') + q.x.toFixed(0) + ',' + q.y.toFixed(0); pen = 1; } }
  return `<path d="${d}" stroke="#f3f1e6" stroke-width="${Math.max(1.6, c.ppm * .011).toFixed(1)}" fill="none" stroke-linejoin="round" opacity=".96"/>`; }
function star(p, r, k) { if (k <= 0 || k >= 1) return ''; const q = p.x !== undefined && p.z !== undefined ? W.proj(p) : { x: p[0], y: p[1], ppm: 100, ok: true }; if (!q.ok) return ''; const R = (p.z !== undefined ? q.ppm * r : r) * (.5 + eOut(k) * .7), pts = n => Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2 + .2, rr = R * n * (i % 2 ? .45 : 1); return (i ? 'L' : 'M') + (q.x + Math.cos(a) * rr).toFixed(1) + ',' + (q.y + Math.sin(a) * rr).toFixed(1); }).join(' ') + 'Z';
  return `<g opacity="${(1 - k * k).toFixed(2)}"><path d="${pts(1)}" fill="#ffd34a" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="${pts(.55)}" fill="#fff6c8"/></g>`; }
function dizzy(F, T) { const q = W.proj(F); if (!q.ok) return ''; let s = ''; for (let i = 0; i < 4; i++) { const a = T * 5 + i * 1.57, x = q.x + Math.cos(a) * q.ppm * .42, y = q.y + Math.sin(a) * q.ppm * .12, sc = q.ppm / 300 * (.8 + .3 * Math.sin(a)); s += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)}) rotate(${(T * 200 + i * 40).toFixed(0)})"><path d="M0,-18 L5,-5 L18,-5 L8,3 L12,17 L0,8 L-12,17 L-8,3 L-18,-5 L-5,-5Z" fill="#ffd34a" stroke="${K}" stroke-width="4" stroke-linejoin="round"/></g>`; } return s; }
const byDist = L => L.filter(Boolean).sort((a, b) => b.p.distanceTo(W.camera.position) - a.p.distanceTo(W.camera.position)).map(o => o.f()).join('');
// estado del mundo por defecto en cada fotograma (cada escena cambia después lo que necesite, ANTES de cam())
function setup(T, mood = 0, cheerK = 0, year = '1889') { W.setTime(T); W.setMood(mood); W.charLight = [DAY, EVE, NIGHT][mood]; W.setCheer(cheerK); W.hideSeats([]); W.setYear(year); W.NET.visible = false; W.netMesh.visible = true; W.CRATE.visible = false; W.ball(null, 0, false); W.paper(null, 0, false); }
// aficionados «héroe» en 2D en las dos primeras filas de detrás de la portería (el resto del público son sprites 3D)
function heroFans(x0, n, T, poseOf) { W.hideSeats([[x0 - .35, x0 + n * .62 + .1, -59.55, -58.0]]); const L = []; for (let r = 0; r < 2; r++) for (let i = 0; i < n; i++) { const [y, z] = rowG(r), x = x0 + i * .62 + (r ? .31 : 0), id = (i * 5 + r * 7 + Math.abs(Math.round(x0 * 3))) % 16, F = V3(x, y, z); L.push({ p: F, f: () => who(fanLook(id), poseOf(F, id, r, i) || {}, F) }); } return L; }

// 1 · GANCHO: el chut, el balón cruza la portería y se pierde entre el público; media grada celebra y la otra protesta
S.gol = (t, D, B) => { const E = EVS.gol(B), T = window.__T || t; setup(T, 0, .04); if (t > 1.2) W.setCheer(.95, .1);
  const tk = .5, KP = V3(0, 0, -36), b0 = V3(.3, .11, -36.62), v = V3(-1.08, 6.5, -34), th = tk + .64, hitP = fl(b0, v, .64);
  let bp = b0, spin = 0; if (t >= tk && t < th) { bp = fl(b0, v, t - tk); spin = (t - tk) * 30; } else if (t >= th) { bp = fl(hitP, V3(.9, 6.4, -2.4), t - th); spin = 19 + (t - th) * 9; }
  const lost = t > th + 1.3, fans = heroFans(-2.3, 9, T, (F, id, r, i) => { const hit = r === 0 && i === 3; if (t < th) return { look: [0, 2] }; if (hit) return { face: 'closed', mouth: 'o', bob: 14 * (1 - snap(t, th, .5)), headTilt: 10 };
    return F.x < .1 ? cheer(T, id) : shout(T, id, 1); });
  const ok = oc((t - tk - .05) / .5), tp = E.y - .12, ctr = V3(0, 1.1, -36.4);
  let cp = orb(ctr, lerp(90, 4, ok), lerp(1.5, 7, ok), lerp(7.6, 12.5, ok)), cl = L3(V3(0, 1.15, -36.45), V3(.5, 1.7, -56), ok);
  if (t > tp) { const w = snap(t, tp, .3), tg2 = V3(.1, 3.3, -59.5), c2 = pushIn(V3(.3, 2.7, -42.5), tg2, (t - tp) / (D - tp), 1.4); cp = L3(cp, c2, w); cl = L3(cl, tg2, w); }
  W.ball(bp, spin, t < th); cam(cp, cl, 30);
  const u = .6 + (t - tk) / .55, kp = Object.assign(kick(u), ok > .5 ? { view: 'back', turn: 0 } : {});
  const L = fans.concat([{ p: KP, f: () => who('DELANTERO', kp, KP) }, lost ? null : { p: bp, f: () => ball2d(bp, spin, t > tk && t < th ? fl(b0, v, Math.max(0, t - tk - .045)) : null, t > tk && t < th ? 1.5 : 1) + star(hitP, .5, (t - th) / .35) }]);
  return byDist(L) + (t > th + .15 ? dizzy(V3(hitP.x, hitP.y + .75, hitP.z), T) : ''); };

// 2 · Liverpool, 1889: grúa desde lo alto hasta el poste; la cámara sube por el palo y recorre el larguero
S.liverpool = (t, D, B) => { const E = EVS.liverpool(B), T = window.__T || t; setup(T, 0, .03);
  const a = E.las, b = E.dos, c = E.larguero;
  const cp = sp(t, [[0, V3(17, 27, 16)], [a, V3(11, 7, -26)], [b, V3(6.9, 1.25, -44.6)], [c, V3(5.0, 1.2, -45.0)], [D, V3(.8, 1.5, -32.5)]]);
  const cl = sp(t, [[0, V3(0, 6, -56)], [a, V3(2.5, 2.5, -52)], [b, V3(3.66, 1.25, -52)], [c, V3(2.6, 2.44, -52)], [D, V3(0, 1.6, -54)]]);
  cam(cp, cl, lerp(40, 30, k01(t, 0, b)), .002); return ''; };

// 3 · «Detrás, nada»: push-in hacia la portería vacía
S.nada = (t, D, B) => { const T = window.__T || t; setup(T, 0, .03); const tg = V3(0, 1.4, -56.5); cam(pushIn(V3(0, 1.5, -31), tg, t / D, 1.9), tg, 30, .002); return ''; };

// 4 · el balón rebota de cabeza en cabeza, se pierde… y empiezan los gritos
S.pierde = (t, D, B) => { const E = EVS.pierde(B), T = window.__T || t; setup(T, 0, .05);
  const t0 = .2, A = V3(-5.42, 2.3, -58.3), Bh = V3(-4.49, 2.74, -59.05), p0 = V3(-3.9, 1.6, -47.5), ta = t0 + .55, tb = ta + .6, v0 = V3((A.x - p0.x) / .55, (A.y - p0.y + 4.9 * .3025) / .55, (A.z - p0.z) / .55), v1 = V3((Bh.x - A.x) / .6, (Bh.y - A.y + 4.9 * .36) / .6, (Bh.z - A.z) / .6);
  let bp = null, spin = t * 14; if (t >= t0 && t < ta) bp = fl(p0, v0, t - t0); else if (t >= ta && t < tb) bp = fl(A, v1, t - ta); else if (t >= tb && t < tb + 1.2) bp = fl(Bh, V3(-1.1, 7.2, -3.4), t - tb);
  const gr = E.empiezan - .05, fans = heroFans(-7.6, 8, T, (F, id, r, i) => { const hA = r === 0 && i === 3, hB = r === 1 && i === 4; if (t > gr) return shout(T, id, id % 2 ? 1 : -1);
    if (hA && t > ta) return { face: 'closed', mouth: 'o', bob: 16 * (1 - snap(t, ta, .5)), headTilt: -9 }; if (hB && t > tb) return { face: 'closed', mouth: 'o', bob: 16 * (1 - snap(t, tb, .5)), headTilt: 8 };
    return t > t0 + .2 ? { face: 'wide', mouth: 'o', look: [0, -8], armL: [seq(t, [[0, { a: 14 }], [ta - .1, { a: 60 + id * 3 }]]).a, 30] } : { look: [0, 2] }; });
  const tg = V3(-5.0, 2.75, -58.7); cam(pushIn(V3(-4.1, 2.3, -47.2), tg, t / D, 1.9), tg, 30, .0026);
  const L = fans.concat([bp ? { p: bp, f: () => ball2d(bp, spin) } : null]);
  return byDist(L) + star(A, .5, (t - ta) / .35) + star(Bh, .5, (t - tb) / .35) + (t > ta + .15 && t < gr ? dizzy(V3(A.x, A.y + .7, A.z), T) : ''); };

// 5 · «¡Por encima!» «¡Por dentro del palo!»: dos jugadores cara a cara y el árbitro en medio
S.gritos = (t, D, B) => { const E = EVS.gritos(B), T = window.__T || t; setup(T, 0, .2);
  const PB = V3(1.75, 0, -48.6), PR = V3(3.5, 0, -48.6), PA = V3(2.62, 0, -50.2), d2 = E.dentro - .05;
  const blue = seq(t, [[0, { face: 'angry', mouth: 'open', brows: -.5, armR: [16, 20], armL: [16, 20], lean: 0, turn: .5 }], [E.encima - .25, { armL: [150, 8], lean: 6 }], [d2, { armL: [40, 60], lean: 10 }]], .4);
  const red = seq(t, [[0, { face: 'angry', mouth: 'line', brows: -.5, armR: [16, 20], armL: [16, 20], lean: 0, turn: -.5 }], [d2, { armR: [100, 4], lean: -9 }]], .4);
  blue.mouth = talkM(t, 0, d2, 'line'); if (t > d2) red.mouth = talkM(t, d2, 99);
  const ref = { face: 'wide', mouth: 'o', look: [t > d2 ? 12 : -12, 0], armL: [20, 30], armR: [20, 30] };
  const tg = V3(2.62, 1.35, -48.9); cam(pushIn(V3(2.1, 1.6, -31.5), tg, t / D, 1.75), tg, 30, .003);
  return byDist([{ p: PA, f: () => who('ARBITRO', ref, PA) }, { p: PB, f: () => who('RIVAL', blue, PB) }, { p: PR, f: () => who('DELANTERO', red, PR) }]); };

// 6 · el árbitro en el centro del campo: de espaldas, la portería lejísimos; órbita de ~98° hasta verle la cara; decide «a ojo»
S.arbitro = (t, D, B) => { const E = EVS.arbitro(B), T = window.__T || t; setup(T, 0, .1);
  const RP = V3(0, 0, -3), to = E.decide - .2, ko = snap(t, to, .55), ctr = V3(0, 1.45, -3);
  const az = lerp(7, 105, ko), d = lerp(lerp(9.5, 8.2, t / Math.max(.1, to)), 6.2, ko) - (t > to + .5 ? oc((t - to - .5) / (D - to - .5)) * 2.2 : 0);
  const cp = orb(ctr, az, lerp(9, 3, ko), d), cl = L3(V3(0, 1.3, -30), V3(0, 1.62, -3), ko); cam(cp, cl, 30, .0026);
  const front = az > 52, ojo = E.ojo - .15;
  const pose = front ? seq(t, [[0, { face: 'smug', mouth: 'line', brows: -.3, armR: [16, 22], armL: [16, 22], headTilt: 0, lean: 0 }], [to + .3, { armR: [150, 118], lean: 6, headTilt: 4, face: 'angry' }], [ojo, { armR: [70, -120], armL: [70, -120], lean: 0, headTilt: -5, face: 'smug', mouth: 'smirk', brows: .5 }]], .4) : { view: 'back', armR: [16, 22], armL: [16, 22] };
  return who('ARBITRO', pose, RP); };

// 7 · en la grada, John Brodie: no mira el partido, mira su plano de tuberías
const planito = k => `<g transform="translate(6,-14) rotate(${lerp(40, 8, k)})"><rect x="${-60 * k - 8}" y="-52" width="${120 * k + 16}" height="92" rx="4" fill="#24508a" stroke="${K}" stroke-width="6"/>` + (k > .6 ? `<path d="M-48,18 L-12,18 L-12,-26 L34,-26 L34,8 L52,8" stroke="#eaf2ff" stroke-width="9" fill="none" stroke-linejoin="round" opacity="${k}"/><circle cx="-12" cy="18" r="8" fill="#eaf2ff"/><circle cx="34" cy="-26" r="8" fill="#eaf2ff"/>` : '') + `<rect x="${-60 * k - 14}" y="-56" width="12" height="100" rx="6" fill="#eae2cc" stroke="${K}" stroke-width="5"/><rect x="${60 * k + 2}" y="-56" width="12" height="100" rx="6" fill="#eae2cc" stroke="${K}" stroke-width="5"/></g>`;
const BSEAT = (() => { const [y, x] = rowW(0); return V3(x, y, -22); })();
function standW(T, poseOf, n = 3) { W.hideSeats([[-42.9, -41.0, BSEAT.z - n * .62 - .3, BSEAT.z + n * .62 + .3]]); const L = []; for (let r = 0; r < 2; r++) for (let i = -n; i <= n; i++) { const [y, x] = rowW(r), z = BSEAT.z + i * .62 + (r ? .31 : 0); if (r === 0 && i === 0) continue; const id = (i + 9) * 3 % 16 + (r ? 0 : 1), F = V3(x, y, z); L.push({ p: F, f: () => who(fanLook(id % 16), poseOf(F, id, r, i) || {}, F) }); } return L; }
S.brodie = (t, D, B) => { const E = EVS.brodie(B), T = window.__T || t; setup(T, 0, .12);
  const fans = standW(T, (F, id) => ({ look: [14, 0], mouth: id % 3 ? 'line' : 'o' }));
  const un = E.ingeniero + .1, k = snap(t, un, .45), br = seq(t, [[0, { face: 'smug', mouth: 'line', look: [10, 0], armR: [20, 96], armL: [16, 22], headTilt: 0 }], [un, { look: [-2, 9], armR: [44, 104], armL: [40, -96], headTilt: 7, mouth: 'smile' }]], .45);
  br.holdR = planito(k); const tg = V3(BSEAT.x, BSEAT.y + 1.3, BSEAT.z); cam(pushIn(V3(-28.0, 2.5, -22.5), tg, t / D, 2.3), tg, 30, .003);
  return byDist(fans.concat([{ p: BSEAT, f: () => who('BRODIE', br, BSEAT) }])); };

// 8 · un sábado ve cómo anulan un gol clarísimo: el balón entra sin duda… y el árbitro lo anula
S.anulan = (t, D, B) => { const E = EVS.anulan(B), T = window.__T || t; const tk = .27, tf = .5, tin = tk + tf, an = Math.max(E.anulan - .08, tin + .18); setup(T, 0, .05); if (t > tin && t < an + .25) W.setCheer(.8, -.5);
  const SP = V3(.5, 0, -40.5), RP = V3(-2.6, 0, -46.2), GK = V3(0, 0, -51.3), b0 = V3(.2, .11, -41.0), G = V3(-2.2, 1.0, -52.1), v = V3((G.x - b0.x) / tf, (G.y - b0.y + 4.9 * tf * tf) / tf, (G.z - b0.z) / tf);
  let bp = b0, spin = 0, vis = true; if (t >= tk) { const d = t - tk; bp = fl(b0, v, d); spin = d * 25; if (d > tf + .4) vis = false; }
  const st = Object.assign(kick(.6 + (t - tk) / .55), { view: 'back', turn: 0 }, t > tin + .1 && t < an ? cheer(T, 1) : {}, t >= an ? { view: undefined, turn: 0, face: 'wide', mouth: 'o', armL: [150, 150], armR: [150, 150], bob: 0, lean: 0, legR: [6, 0], headTilt: 0 } : {});
  const dv = oc((t - tk - .25) / .4), gk = { face: t > tin ? 'wide' : 'smug', mouth: t > tin ? 'o' : 'line', armL: [lerp(40, 150, dv), 20], armR: [lerp(40, 120, dv), 20], lean: -dv * 14, look: [-10, 0] };
  const rf = seq(t, [[0, { face: 'smug', mouth: 'line', armL: [16, 22], armR: [16, 22], look: [10, 0], brows: 0 }], [an, { face: 'angry', mouth: 'open', brows: -.6, look: [0, 2] }, .25]]); if (t >= an) { const w = Math.sin((t - an) * 14); rf.armL = [120 + w * 40, 30]; rf.armR = [120 - w * 40, 30]; rf.lean = w * 3; }
  const k = snap(t, an - .05, .32), c1 = pushIn(V3(1.0, 2.6, -28), V3(-.8, 1.0, -51), t / an, 1.25), c2 = pushIn(V3(-1.25, 1.7, -40.8), V3(RP.x, 1.45, RP.z), (t - an) / (D - an), 1.35);
  W.ball(bp, spin, vis); cam(L3(c1, c2, k), L3(V3(-.8, 1.0, -51), V3(RP.x, 1.45, RP.z), k), lerp(34, 30, k), .0022);
  return byDist([{ p: SP, f: () => who('DELANTERO', st, SP) }, { p: RP, f: () => who('ARBITRO', rf, RP) }, { p: GK, f: () => who('KEEPER', gk, V3(GK.x - dv * .5, 0, GK.z)) }, vis ? { p: bp, f: () => ball2d(bp, spin, t > tk && t < tin + .3 ? fl(b0, v, Math.max(0, t - tk - .05)) : null, t > tk ? 1.9 : 1) } : null]); };

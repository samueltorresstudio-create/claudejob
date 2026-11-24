// «La discoteca donde solo entran los feos» (78). Decorados de Blender a escala real (world_disco.js) + personajes estilo .99 (pjt.js, models78*.js).
// Reglas: cámara siempre en movimiento y pocos cortes (barridos entre planos), expresión nueva en las palabras clave, andar como el del limón
// (piernas rectas que se levantan por turnos + bote), NADA del decorado delante de un personaje 2D (se colocan siempre con el camino libre a cámara).
window.CFG = { capY: 1365, capSize: 92, transDur: .38, blurK: .45, antic: .1, blurChars: false, transDefault: 'swish', swishRel: 1.1, swishK: .8,
  trans: { gancho: 'cut', norma: 'whip', mira: 'whip', gym: 'whip', entra: 'swish', rival: 'swish', pista: 'swish', barra: 'whip', disfraz: 'swish', valgo: 'whip', aula: 'swish', psico: 'whip', foto: 'swish', entera: 'swish', reflejo: 'whip', bucle: 'swish' } };
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { EVS[l.sc] = EVS[l.sc] || (() => ({})); });
const capWords = (sc, li) => { const L = window.SCRIPT.filter(l => l.sc === sc)[li]; return L ? L.cap.split(' ').map(w => norm(w.split('|')[0])) : []; };
const wt = (B, sc, li, word, nth = 0) => { const ws = capWords(sc, li); let c = 0; for (let i = 0; i < ws.length; i++) if (ws[i] === word) { if (c === nth) return B[li] ? B[li].w[i] : 0; c++; } return B[li] ? B[li].s : 0; };
const ls = (B, li) => B[li] ? B[li].s : 0;   // inicio de la línea li de la escena
const S = {}, W = W2;
{ const _sc = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * 1.9) * .5 + Math.sin(T * 3.1) * .3, Math.sin(T * 2.3 + 1) * .5, 0).multiplyScalar(.006 * p.distanceTo(l) / 6);
  return _sc(p.clone().add(d), l.clone().add(d.multiplyScalar(.4)), f, fo, ap); }; }
const cam = (p, l, f = 40, ap = .004, fo = null) => W.setCam(p, l, f, fo, ap);
const lerpV = (a, b, k) => a.clone().lerp(b, k);
const camK = (k, p0, l0, f0, p1, l1, f1, ap = .004, fo = null) => cam(lerpV(p0, p1, k), lerpV(l0, l1, k), lerp(f0, f1, k), ap, fo);
const seg = (t, a, b) => eIO(clamp((t - a) / Math.max(.001, b - a)));
const sOut = (t, a, b) => eOut(clamp((t - a) / Math.max(.001, b - a)));
const LG = { calle: '0.93 0 0 0 0.03  0 0.88 0 0 0.0  0 0 1.0 0 0.05  0 0 0 1 0', pista: '0.97 0 0 0 0.05  0 0.86 0 0 0  0 0 1.0 0 0.07  0 0 0 1 0', aula: '1 0 0 0 0  0 0.98 0 0 0  0 0 0.94 0 0  0 0 0 1 0' };
let MOOD = 'calle';
function setup(T, site, mood) { W.setTime(T); W.site(site); W.setMood(mood); MOOD = mood; }
const PJ_LEGX = window.PJ_LEG ?? 380;
// personaje estilo .99 colocado en el 3D: pies en F, altura h (cabeza a pies), op: {flip, walk:{ph,amp}, o:{...opciones del modelo}}
function pj(fn, F, face, h = 1.8, op = {}) { const a = W.proj(F), b = W.proj(V3(F.x, F.y + h, F.z)); if (!a.ok || a.d < .4) return [F, ''];
  const s = (a.y - b.y) / (1700 + PJ_LEGX); const o = Object.assign({ face }, op.o || {}); if (op.walk) o.walk = op.walk; if (op.talk) o.talk = op.talk;
  const svg = window[fn](o), fl = op.flip ? 'translate(1190,0) scale(-1,1)' : '';
  return [F, `<g transform="translate(${(a.x - 595 * s).toFixed(1)},${(a.y - 2100 * s).toFixed(1)}) scale(${s.toFixed(4)}) ${fl}" filter="url(#tintF)" ${op.op != null ? `opacity="${op.op}"` : ''}>${svg}</g>`]; }
function handAt(F, h, lx, ly, flip = 0) { const a = W.proj(F), b = W.proj(V3(F.x, F.y + h, F.z)), s = (a.y - b.y) / (1700 + PJ_LEGX); const X = flip ? 1190 - lx : lx; return { x: a.x - 595 * s + X * s, y: a.y - 2100 * s + (ly - PJ_LEGX) * s, s }; }
const depth = L => L.filter(x => x && x[1]).map(([p, s]) => [W.camera.position.distanceTo(p), s]).sort((a, b) => b[0] - a[0]).map(x => x[1]).join('');
const out = (L, extra = '') => `<defs><filter id="tintF" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${LG[MOOD]}"/></filter></defs>` + depth(L) + extra;
const talk = (t, a, b) => t > a && t < b ? .35 + .65 * Math.abs(Math.sin((t - a) * 17)) : 0;
const walk = (t, rate = 7.2, amp = 1) => ({ ph: t * rate, amp });
const dance = (t, i = 0, amp = .55) => ({ ph: t * 8 + i * 1.7, amp });
const headAt = (F, h) => W.proj(V3(F.x, F.y + h * .78, F.z));
const flash = k => k > 0 && k < 1 ? `<rect width="1080" height="1920" fill="#fff" opacity="${(.85 * (1 - k)).toFixed(3)}"/>` : '';
// lluvia de billetes y monedas (dinero)
const billRain = (t, t0, n = 16) => { if (t < t0) return ''; let o = ''; for (let i = 0; i < n; i++) { const ph = (t - t0) * .55 + hs(i, 4) * .9, y = -120 + ((ph % 1.2) / 1.2) * 2200; if ((t - t0) * .55 + hs(i, 4) * .9 < .02) continue; o += bill2d(60 + hs(i, 5) * 960, y, .9 + hs(i, 6) * .5, (t * 90 * (hs(i, 7) - .5) + i * 40) % 360, ['#9ad08a', '#b8e0a0', '#8ac878'][i % 3]); } return o; };
// tarjeta de puntuación (en la mano)
const CARD = (n, col) => `<g><rect x="-70" y="-160" width="140" height="120" rx="14" fill="#fffef6" stroke="#1e1313" stroke-width="10"/><text x="0" y="-72" text-anchor="middle" font-family="Inter" font-weight="900" font-size="88" fill="${col}">${n}</text><rect x="-10" y="-42" width="20" height="60" fill="#8a5a34" stroke="#1e1313" stroke-width="6"/></g>`;
const PHONE = `<g><rect x="-48" y="-160" width="96" height="170" rx="16" fill="#1b1720" stroke="#1e1313" stroke-width="9"/><rect x="-38" y="-148" width="76" height="140" rx="8" fill="#6ac0ff"/><circle cx="0" cy="-120" r="7" fill="#fff" opacity=".8"/></g>`;
const REG = (k) => `<g><rect x="-150" y="-120" width="300" height="160" rx="18" fill="#c9a24a" stroke="#1e1313" stroke-width="10"/><rect x="-120" y="-100" width="140" height="60" rx="8" fill="#1a3a2a" stroke="#1e1313" stroke-width="6"/>
  <text x="-50" y="-58" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="#5fe08a">${k > .5 ? '2.480€' : '1.240€'}</text>${[0, 1, 2].map(i => `<rect x="${40 + i * 34}" y="-96" width="26" height="22" rx="5" fill="#f2ead6" stroke="#1e1313" stroke-width="4"/>`).join('')}
  <rect x="-160" y="${(40 + 40 * k).toFixed(0)}" width="320" height="60" rx="10" fill="#b08a34" stroke="#1e1313" stroke-width="10"/>${k > .2 ? `<rect x="-130" y="${(46 + 40 * k).toFixed(0)}" width="80" height="26" fill="#9ad08a"/><rect x="-40" y="${(46 + 40 * k).toFixed(0)}" width="80" height="26" fill="#9ad08a"/>` : ''}</g>`;

// =====================================================================================================
// 1 · GANCHO — el portero echa al guapo y deja pasar al del jersey; la cámara sube al letrero y llueven billetes
// =====================================================================================================
S.gancho = (t, D, B) => { setup(t, 'street', 'calle');
  const tY = ls(B, 1), tFe = wt(B, 'gancho', 0, 'feos'), tDin = wt(B, 'gancho', 1, 'dinero');
  if (t < tY) { const k = seg(t, 0, tY); camK(k, V3(.3, 1.35, 2.2), V3(.15, 1.5, -5.2), 54, V3(.25, 1.4, 1.0), V3(.15, 1.55, -5.2), 48, .004, 6.0);
    const xg = -.35 - 1.6 * sOut(t, .2, tY + .6), xj = -1.6 + 1.5 * clamp(t / (tY + .2));
    return out([pj('portero2d', V3(1.45, 0, -5.05), t < tFe ? 'enfadado' : 'serio', 2.0, { o: { point: 1 }, flip: 1 }),
      pj('guapo2d', V3(xg, 0, -4.45), t < .5 ? 'serio' : 'sorpresa', 1.85, { walk: t > .2 ? walk(t) : null }),
      pj('jersey2d', V3(xj, 0, -4.55), 'feliz', 1.7, { walk: xj < -.15 ? walk(t, 6.8) : null })]); }
  const u = t - tY, k = seg(t, tY, D); camK(k, V3(.25, 1.4, 1.0), V3(.15, 1.55, -5.2), 48, V3(.2, 2.4, .6), V3(.1, 4.2, -6.4), 48, .002);
  return out([pj('portero2d', V3(1.45, 0, -5.05), 'picaro', 2.0)], billRain(t, tDin - .15, 18) + coins(540, 300, t, 10, 1.1, tDin - .1)); };

// =====================================================================================================
// 2 · NORMA — primer plano del portero; la cámara se acerca despacio
// =====================================================================================================
S.norma = (t, D, B) => { setup(t, 'street', 'calle'); const tNa = wt(B, 'norma', 0, 'nadie'), tNo = wt(B, 'norma', 0, 'norma');
  camK(seg(t, 0, D), V3(1.75, 1.85, -2.6), V3(1.45, 1.75, -5.05), 34, V3(1.6, 1.88, -3.3), V3(1.45, 1.8, -5.05), 30, .03, 1.9);
  const f = t < tNo ? 'serio' : t < tNa - .1 ? 'picaro' : 'serio';
  return out([pj('portero2d', V3(1.45, 0, -5.05), f, 2.0)]); };

// =====================================================================================================
// 3 · MIRA — la cámara recorre al de la cola de arriba abajo (como los ojos del portero), «pasa» y «fuera»
// =====================================================================================================
S.mira = (t, D, B) => { setup(t, 'street', 'calle');
  const tPa = wt(B, 'mira', 0, 'pasa'), tSi = wt(B, 'mira', 0, 'siguiente'), tFu = wt(B, 'mira', 0, 'fuera');
  if (t < tPa - .1) { const k = clamp(t / (tPa - .1)), ly = 1.75 - 1.5 * Math.sin(Math.PI * Math.min(1, k * 1.15)); cam(V3(.2, 1.55, -1.9), V3(-.95, ly, -4.5), 36, .012, 2.7);
    return out([pj('jersey2d', V3(-.95, 0, -4.5), t < (tPa - .1) * .6 ? 'serio' : 'preocupado', 1.7)]); }
  const u = t - tPa, k = seg(t, tPa - .1, D); camK(k, V3(.4, 1.4, 1.6), V3(.0, 1.45, -5.0), 54, V3(.3, 1.42, 1.0), V3(-.1, 1.45, -5.0), 50, .004, 5.8);
  const pt = t < tSi ? 1 : 1, flipP = t < tSi;
  const xj = -.95 + .95 * sOut(t, tPa, tPa + 1.0);
  return out([pj('portero2d', V3(1.45, 0, -5.05), t < tFu ? 'serio' : 'enfadado', 2.0, { o: { point: pt }, flip: flipP }),
    pj('jersey2d', V3(xj, 0, -4.7 - .5 * sOut(t, tPa, tPa + 1)), 'feliz', 1.7, { walk: t < tPa + 1 ? walk(t) : null }),
    pj('guapo2d', V3(-1.75, 0, -4.4), t < tFu ? 'serio' : 'sorpresa', 1.85)]); };

// =====================================================================================================
// 4 · GYM — el guapo de la camisa planchada: «fuera»
// =====================================================================================================
S.gym = (t, D, B) => { setup(t, 'street', 'calle'); const tFu = wt(B, 'gym', 0, 'fuera');
  camK(seg(t, 0, D), V3(-.9, 1.7, -2.0), V3(-1.25, 1.55, -4.45), 36, V3(-1.0, 1.75, -2.5), V3(-1.25, 1.6, -4.45), 32, .025, 2.0);
  return out([pj('guapo2d', V3(-1.25, 0, -4.45), t < tFu - .05 ? 'picaro' : 'sorpresa', 1.85)], t > tFu ? `<g opacity="${(1 - clamp((t - tFu) / .6)).toFixed(2)}">${rays(540, 700, 260, clamp((t - tFu) / .4), '#ff4f6a', 10)}</g>` : ''); };

// =====================================================================================================
// 5 · ENTRA — dentro: el del jersey cruza la puerta andando hacia la cámara, feliz
// =====================================================================================================
S.entra = (t, D, B) => { setup(t, 'dance', 'pista');
  camK(seg(t, 0, D), V3(1000.15, 1.35, 1.6), V3(1000, 1.35, 6), 40, V3(1000.1, 1.4, 1.9), V3(1000, 1.4, 6), 38, .006, 2.6);
  const z = 5.55 - 1.4 * clamp(t / (D * .9));
  return out([pj('jersey2d', V3(999.95, 0, z), 'feliz', 1.7, { walk: walk(t) }), pj('chica2_2d', V3(1001.5, 0, 2.6), 'feliz', 1.68, { walk: dance(t, 1) })]); };

// =====================================================================================================
// 6 · RIVAL — el dueño de la competencia se ríe en su terraza
// =====================================================================================================
S.rival = (t, D, B) => { setup(t, 'street', 'calle'); const tTe = wt(B, 'rival', 0, 'te');
  camK(seg(t, 0, D), V3(-10.2, 1.5, -.9), V3(-11.1, 1.55, -4.0), 36, V3(-10.5, 1.55, -1.5), V3(-11.1, 1.6, -4.0), 32, .012, 2.6);
  return out([pj('rival2d', V3(-11.0, 0, -3.95), t < tTe - .1 ? 'picaro' : 'feliz', 1.75, { talk: talk(t, tTe, D - .1) })]); };

// =====================================================================================================
// 7 · PISTA — todos bailan; «ligan como nunca» y «cada sábado»
// =====================================================================================================
S.pista = (t, D, B) => { setup(t, 'dance', 'pista'); const tLi = wt(B, 'pista', 1, 'ligan');
  camK(seg(t, 0, D), V3(1001.8, 1.2, 3.2), V3(1000, 1.5, -4), 44, V3(999.4, 1.45, 2.4), V3(1000.2, 1.5, -4), 40, .004, 5.2);
  const L = [pj('jersey2d', V3(999.6, 0, -2.4), 'feliz', 1.7, { walk: dance(t, 0) }), pj('chica1_2d', V3(1000.9, 0, -2.6), t < tLi ? 'feliz' : 'picaro', 1.7, { walk: dance(t, 2), flip: 1 }),
    pj('copa2d', V3(998.2, 0, -3.6), 'feliz', 1.75, { walk: dance(t, 3, .4) }), pj('chica2_2d', V3(1002.0, 0, -4.0), 'feliz', 1.68, { walk: dance(t, 4) })];
  return out(L, mnotes(540, 520, t, 7, 1.0)); };

// =====================================================================================================
// 8 · BARRA — gastan el doble (la caja suena), el de la copa pregunta y nadie le contesta
// =====================================================================================================
S.barra = (t, D, B) => { setup(t, 'dance', 'pista'); const tPr = ls(B, 1), tOy = wt(B, 'barra', 1, 'oye'), tNa = ls(B, 2), tDo = wt(B, 'barra', 0, 'doble');
  if (t < tPr) { camK(seg(t, 0, tPr), V3(1003.3, 1.45, .3), V3(1006.6, 1.2, -3.0), 42, V3(1003.7, 1.45, -.3), V3(1006.6, 1.2, -3.0), 38, .006, 3.6);
    const r = W.proj(V3(1007.25, 1.6, -2.7)), kk = clamp((t - tDo + .1) / .5); W.regTotal(Math.round(1240 + 1240 * eOut(kk)));
    return out([pj('copa2d', V3(1005.5, 0, -2.4), 'feliz', 1.75)], kk > 0 && kk < 1 ? coins(r.x, r.y - 60, t, 8, .9, tDo) : ''); }
  const u = t - tPr; camK(seg(t, tPr, D), V3(1004.1, 1.85, -.9), V3(1005.5, 1.6, -2.4), 36, V3(1003.9, 1.82, -.5), V3(1005.5, 1.58, -2.4), 40, .02, 2.2);
  const f = t < tOy ? 'serio' : t < tNa ? 'sorpresa' : 'preocupado';
  return out([pj('copa2d', V3(1005.5, 0, -2.4), f, 1.75, { talk: talk(t, tOy, tNa - .15) }), pj('chica1_2d', V3(1003.6, 0, -4.6), 'feliz', 1.7, { walk: dance(t, 2) }), pj('jersey2d', V3(1002.6, 0, -5.4), 'feliz', 1.7, { walk: dance(t, 0) })]); };

// =====================================================================================================
// 9 · DISFRAZ — fuera, los guapos se despeinan y se ponen gafas torcidas; uno se pinta un diente de negro
// =====================================================================================================
S.disfraz = (t, D, B) => { setup(t, 'street', 'calle'); const tUn = wt(B, 'disfraz', 0, 'uno'), tGa = wt(B, 'disfraz', 0, 'gafas');
  if (t < tUn) { camK(seg(t, 0, tUn), V3(-3.6, 1.45, -1.6), V3(-2.4, 1.5, -4.45), 40, V3(-1.2, 1.5, -1.8), V3(-1.4, 1.55, -4.45), 38, .008, 2.7);
    return out([pj('guapo2d', V3(-1.25, 0, -4.45), 'preocupado', 1.85, { o: { disfraz: t > tGa ? 1 : 0 } }), pj('guapo2d', V3(-2.9, 0, -4.45), 'serio', 1.85, { o: { disfraz: 1 }, flip: 1 })], sparks(540, 820, 1, t)); }
  camK(seg(t, tUn, D), V3(-1.1, 1.82, -2.4), V3(-1.25, 1.72, -4.45), 30, V3(-1.15, 1.85, -2.8), V3(-1.25, 1.74, -4.45), 28, .03, 1.7);
  return out([pj('guapo2d', V3(-1.25, 0, -4.45), 'feliz', 1.85, { o: { disfraz: 1 } })], glint(560, 1000, 1, t)); };

// =====================================================================================================
// 10 · VALGO — «¿Así valgo?» … «Fuera.»
// =====================================================================================================
S.valgo = (t, D, B) => { setup(t, 'street', 'calle'); const tFu = ls(B, 1);
  if (t < tFu) { camK(seg(t, 0, tFu), V3(-.6, 1.6, -2.4), V3(-1.25, 1.6, -4.45), 34, V3(-.7, 1.62, -2.7), V3(-1.25, 1.62, -4.45), 32, .02, 1.85);
    return out([pj('guapo2d', V3(-1.25, 0, -4.45), 'feliz', 1.85, { o: { disfraz: 1 }, talk: talk(t, .05, tFu - .1) })]); }
  camK(seg(t, tFu, D), V3(1.3, 1.7, -1.9), V3(1.2, 1.6, -5.05), 36, V3(1.3, 1.72, -2.3), V3(1.2, 1.62, -5.05), 34, .02, 2.9);
  return out([pj('portero2d', V3(1.45, 0, -5.05), 'enfadado', 2.0, { o: { point: 1 }, flip: 1 })]); };

// =====================================================================================================
// 11 · AULA — «¿Y por qué funciona?» — la de las gafas señala la pizarra del efecto contraste
// =====================================================================================================
S.aula = (t, D, B) => { setup(t, 'aula', 'aula'); const tEf = ls(B, 1), tCe = ls(B, 2), tAl = wt(B, 'aula', 2, 'lado');
  const UP = { armR: 'M785,1260 C870,1180 950,1080 1010,960', handR: [1016, 950] };
  if (t < tEf) { camK(seg(t, 0, tEf), V3(1999.6, 1.4, 2.4), V3(1999.7, 1.7, -4.9), 40, V3(1999.6, 1.55, .9), V3(1999.75, 1.8, -4.9), 36, .004, 4.4);
    return out([pj('chica2_2d', V3(1999.25, 0, -3.9), 'serio', 1.68, { o: UP })], qmark(560, 430, 1.2, (t - .1) / .3)); }
  if (t < tCe) { camK(seg(t, tEf, tCe), V3(1999.9, 1.75, .3), V3(1999.9, 2.3, -4.9), 34, V3(1999.9, 1.8, -.4), V3(1999.9, 2.35, -4.9), 32, .002);
    return out([pj('chica2_2d', V3(1999.25, 0, -3.9), 'feliz', 1.68, { o: UP })]); }
  const k = seg(t, tCe, D); camK(k, V3(1999.4, 1.7, -.8), V3(1999.4, 1.85, -4.9), 32, V3(2000.6, 1.7, -.8), V3(2000.7, 1.85, -4.9), 32, .002);
  return out([], t > tAl ? `<g opacity="${clamp((t - tAl) / .3).toFixed(2)}">${rays(540, 900, 220, clamp((t - tAl) / .5), '#ffd34a', 10)}</g>` : ''); };

// =====================================================================================================
// 12 · PSICO — dos tarjetas: al guapísimo un 10, a la persona normal un 4
// =====================================================================================================
S.psico = (t, D, B) => { setup(t, 'aula', 'aula'); const tGu = wt(B, 'psico', 0, 'guapisima'), tNo = wt(B, 'psico', 0, 'normal'), tPe = wt(B, 'psico', 0, 'peor');
  const k = seg(t, 0, D); camK(k, V3(2000.2, 1.5, 3.4), V3(2000.3, 1.4, -2.0), 50, V3(2000.5, 1.5, 3.0), V3(2000.5, 1.4, -2.0), 47, .004, 4.6);
  const UP = { armR: 'M785,1260 C870,1180 930,1100 970,1000', handR: [975, 990] };
  const Fc = V3(2001.7, 0, -1.3), L = [pj('guapo2d', V3(1999.1, 0, -1.7), 'picaro', 1.85), pj('jersey2d', V3(2000.4, 0, -1.7), t < tPe ? 'serio' : 'preocupado', 1.7), pj('chica2_2d', Fc, t < tNo ? 'feliz' : 'serio', 1.68, { o: UP, flip: 1 })];
  const hC = handAt(Fc, 1.68, 975, 990, 1), sC = hC.s * 1.3, card = t < tNo ? CARD('10', '#2f9a52') : CARD('4', '#d8342c'), pop = t < tNo ? clamp((t - tGu + .1) / .25) : clamp((t - tNo) / .25);
  return out(L, pop > 0 ? `<g transform="translate(${hC.x.toFixed(0)},${(hC.y + 30 * sC).toFixed(0)}) scale(${(sC * eBack(pop)).toFixed(3)})">${card}</g>` : ''); };

// =====================================================================================================
// 13 · FOTO — selfi con el amigo más feo (flash)
// =====================================================================================================
S.foto = (t, D, B) => { setup(t, 'dance', 'pista'); const tFo = wt(B, 'foto', 0, 'foto'), tMe = wt(B, 'foto', 0, 'mejor');
  camK(seg(t, 0, D), V3(999.3, 1.55, 1.7), V3(999.55, 1.55, -2.2), 40, V3(999.45, 1.6, 1.2), V3(999.55, 1.6, -2.2), 36, .01, 3.4);
  const ph = handAt(V3(999.95, 0, -2.2), 1.85, 1042, 1050); ph.ppm = ph.s * 520 * 1.25;
  return out([pj('guapo2d', V3(999.95, 0, -2.2), t < tMe ? 'picaro' : 'feliz', 1.85, { o: { armR: 'M928,1240 C990,1170 1030,1110 1040,1060', handR: [1042, 1050] } }), pj('copa2d', V3(999.1, 0, -2.25), 'feliz', 1.75)],
    `<g transform="translate(${ph.x.toFixed(0)},${ph.y.toFixed(0)}) scale(${(ph.ppm / 520).toFixed(3)}) rotate(-8)">${PHONE}</g>` + flash(clamp((t - tFo) / .35))); };

// =====================================================================================================
// 14 · ENTERA — la pista llena, la cámara sube
// =====================================================================================================
S.entera = (t, D, B) => { setup(t, 'dance', 'pista');
  camK(seg(t, 0, D), V3(1000, 1.5, 3.6), V3(1000, 1.6, -4), 44, V3(1000, 3.0, 4.6), V3(1000, .9, -3.6), 50, .002);
  const C = [['jersey2d', 999.3, -2.3, 'feliz', 1.7], ['chica1_2d', 1000.6, -2.6, 'feliz', 1.7], ['copa2d', 998.3, -3.5, 'feliz', 1.75], ['chica2_2d', 1001.6, -3.8, 'feliz', 1.68], ['guapo2d', 1000.0, -4.6, 'feliz', 1.85], ['rival2d', 1002.2, -1.6, 'picaro', 1.75]];
  return out(C.map(([f, x, z, fa, h], i) => pj(f, V3(x, 0, z), fa, h, { walk: dance(t, i), flip: i % 2 })), confettiR(t)); };
function confettiR(t) { let o = ''; const cols = ['#ff4f9a', '#ffd23a', '#2fe0ff', '#5fe08a', '#a07aff']; for (let i = 0; i < 36; i++) { const ph = (t * .5 + hs(i, 5)) % 1, x = 540 + (hs(i, 6) - .5) * 1100, y = -60 + ph * 1900, r = (t * 220 + i * 70) % 360; o += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="22" height="12" rx="3" fill="${cols[i % 5]}" transform="rotate(${r.toFixed(0)},${x.toFixed(0)},${y.toFixed(0)})" opacity=".9"/>`; } return o; }

// =====================================================================================================
// 15 · REFLEJO — el portero ve su reflejo en la puerta de cristal y lo echa
// =====================================================================================================
S.reflejo = (t, D, B) => { setup(t, 'dance', 'pista'); const tRe = wt(B, 'reflejo', 0, 'reflejo'), tSi = wt(B, 'reflejo', 0, 'sin');
  camK(seg(t, 0, D), V3(1002.6, 1.5, 3.3), V3(1000.2, 1.3, 5.9), 48, V3(1002.4, 1.55, 3.6), V3(1000.1, 1.35, 5.9), 44, .004, 3.0);
  const g0 = W.proj(V3(999.15, 2.3, 5.86)), g1 = W.proj(V3(1000.85, 0, 5.86)), g2 = W.proj(V3(999.15, 0, 5.86)), g3 = W.proj(V3(1000.85, 2.3, 5.86));
  const pr = t > tSi ? 1 : 0, f = t < tSi ? 'serio' : 'enfadado';
  const real = pj('portero2d', V3(999.85, 0, 5.15), f, 2.0, { o: { point: pr } });
  const refl = pj('portero2d', V3(999.85, 0, 6.57), f, 2.0, { o: { point: pr }, flip: 1 });
  const clipR = `<clipPath id="glassC"><polygon points="${[g0, g3, g1, g2].map(q => q.x.toFixed(0) + ',' + q.y.toFixed(0)).join(' ')}"/></clipPath>`;
  return `<defs>${clipR}<linearGradient id="glSh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe6ff" stop-opacity=".25"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".05"/><stop offset="1" stop-color="#bfe6ff" stop-opacity=".2"/></linearGradient></defs><g clip-path="url(#glassC)"><g opacity=".6">${out([refl])}</g><rect width="1080" height="1920" fill="url(#glSh)"/>${[0, 1, 2].map(i => `<path d="M${(g0.x + 60 + i * 70).toFixed(0)},${g0.y.toFixed(0)} l-180,${(g1.y - g0.y).toFixed(0)} l40,0 l180,${(-(g1.y - g0.y)).toFixed(0)}Z" fill="#fff" opacity=".09"/>`).join('')}</g>` + out([real], t > tRe ? sparks(540, 700, 1, t) : ''); };

// =====================================================================================================
// 16 · BUCLE — vuelta al principio: la calle, la cámara entra hacia la puerta (corte a negro a media frase)
// =====================================================================================================
S.bucle = (t, D, B) => { setup(t, 'street', 'calle');
  camK(seg(t, 0, D + .6), V3(-.7, 1.6, 4.6), V3(-.4, 2.1, -6.5), 50, V3(1.6, 1.3, .7), V3(.2, 1.55, -5.4), 40, .004, 6.5);
  return out([pj('portero2d', V3(1.45, 0, -5.05), 'serio', 2.0), pj('guapo2d', V3(-.35, 0, -4.45), 'serio', 1.85), pj('jersey2d', V3(-1.6, 0, -4.55), 'preocupado', 1.7), pj('copa2d', V3(-3.0, 0, -4.45), 'serio', 1.75, { flip: 1 }), pj('chica1_2d', V3(-4.4, 0, -4.45), 'serio', 1.7)]); };

// dibuja el 3D después de que la escena haya colocado TODO
Object.keys(S).forEach(k => { const f = S[k]; S[k] = (t, D, B) => { const r = f(t, D, B); W.render(); return r; }; });

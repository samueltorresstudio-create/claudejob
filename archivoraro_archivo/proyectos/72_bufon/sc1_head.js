// «El chiste más peligroso de Francia» (72) — ESTILO 3D: world_corte.js + personajes 2D (cast72.js) + efectos (fx72.js).
// Gancho en el fotograma 0 (el gorro de cascabeles bajando sobre la cabeza del bufón, con las manos del rey), un plano por frase,
// cámara siempre en movimiento, textos solo dentro del mundo (el mapa con «AÑO MCCCXL»).
window.CFG = { capY: 1500, capSize: 96, transDur: .42, blurK: .35, antic: .1, blurChars: false,
  transDurBy: { verdad: .4, condicion: .36, guerra: .4, flota: .36, fondo: .4, nadie: .36, plaza: .4, empujan: .36, entra: .36, rie: .3, remate: .3, silencio: .3, guardias: .3, giro: .3, salvas: .3, bucle: .4 },
  trans: { verdad: 'swish', condicion: 'whip', guerra: 'swish', flota: 'whip', fondo: 'push', nadie: 'swish', plaza: 'swish', empujan: 'swish', entra: 'whip', rie: 'whip', remate: 'whip',
    silencio: 'whip', guardias: 'whip', giro: 'whip', salvas: 'whip', bucle: 'swish' } };
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { const ws = l.cap.split(' ').map(w => norm(w.split('|')[0])); const prev = EVS[l.sc]; const idx = window.SCRIPT.filter(x => x.sc === l.sc).indexOf(l);
  EVS[l.sc] = B => { const o = prev ? prev(B) : {}; ws.forEach((w, i) => { const k = /^[0-9]/.test(w) ? '_' + w : w; if (k && !(k in o) && B[idx]) o[k] = B[idx].w[i]; }); return o; }; });
const S = {}, W = W2, C = window.CAST72;
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
function setup(T, o = {}) { W.setTime(T); W.setMood(o.mood || 'hall'); W.setBanquet(!!o.banq); W.setDoors(o.doors ?? 0); W.setTokens(o.tk || 0, o.ts || 0); W.setFleet(o.ff || 0, o.fs || 0, o.fi || 0); W.setLightning(o.lt || 0); W.charLight = o.light || IN; SHAKE = 0; }
const depth = L => L.filter(x => x && x[1]).map(([p, s]) => [W.camera.position.distanceTo(p), s]).sort((a, b) => b[0] - a[0]).map(x => x[1]).join('');
const sOf = (F, h = ADULT) => { const a = W.proj(F), b = W.proj(V3(F.x, F.y + h, F.z)); return Math.hypot(b.x - a.x, b.y - a.y) / 462; };
const SITP = (seatY, footY) => ({ y0: seatY - .8026, legLen: (seatY - footY) / .6358, legL: [55, 58], legR: [55, 58] });
const P_ = (name, pose, F, opt) => [F, who(name, pose, F, ADULT, opt)];
const eIO2 = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
// pantalla del personaje: unidades del muñeco → píxeles (cabeza = radio 100; origen en los pies)
const toScr = (F, ux, uy) => { const a = W.proj(F), h = headScr(F), q = (a.y - h.y) / 470; return { x: a.x + ux * q, y: a.y + uy * q, q }; };

// ---------- efectos 2D propios del 72 ----------
const hand2d = (x, y, s, r = 0) => `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${s.toFixed(3)})"><ellipse cx="0" cy="0" rx="34" ry="42" fill="${K}"/><ellipse cx="-30" cy="-12" rx="12" ry="20" fill="${K}" transform="rotate(30 -30 -12)"/></g>`;
// manga del rey (terciopelo azul con lises, puño de armiño y anillo) que baja desde fuera del encuadre hasta la mano
function kingSleeve(x0, y0, x1, y1, s) { const w = 120 * s, ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI, L = Math.hypot(x1 - x0, y1 - y0);
  return `<g transform="translate(${x0.toFixed(1)},${y0.toFixed(1)}) rotate(${ang.toFixed(1)})"><rect x="-20" y="${(-w / 2 - 6 * s).toFixed(1)}" width="${(L + 20).toFixed(1)}" height="${(w + 12 * s).toFixed(1)}" rx="${(w * .3).toFixed(1)}" fill="${K}"/>` +
    `<rect x="-20" y="${(-w / 2).toFixed(1)}" width="${(L - 36 * s).toFixed(1)}" height="${w.toFixed(1)}" rx="${(w * .28).toFixed(1)}" fill="#2a4aa8"/><rect x="-20" y="${(-w / 2 + 10 * s).toFixed(1)}" width="${(L - 36 * s).toFixed(1)}" height="${(16 * s).toFixed(1)}" fill="#ffffff" opacity=".18"/>` +
    [.3, .62].map(f => `<g transform="translate(${(L * f).toFixed(1)},0) rotate(90) scale(${(s * .9).toFixed(3)})">${LIS(0, 0, 1, '#e8b830', 5)}</g>`).join('') +
    `<rect x="${(L - 58 * s).toFixed(1)}" y="${(-w / 2 - 10 * s).toFixed(1)}" width="${(40 * s).toFixed(1)}" height="${(w + 20 * s).toFixed(1)}" rx="${(14 * s).toFixed(1)}" fill="#f6f3ec" stroke="${K}" stroke-width="${(6 * s).toFixed(1)}"/>` +
    [-1, 0, 1].map(k => `<path d="M${(L - 40 * s).toFixed(1)},${(k * w * .32).toFixed(1)} l0,${(9 * s).toFixed(1)}" stroke="${K}" stroke-width="${(5 * s).toFixed(1)}" stroke-linecap="round"/>`).join('') + `</g>` +
    hand2d(x1, y1, s * .8, ang - 90) + `<circle cx="${(x1 + 10 * s).toFixed(1)}" cy="${(y1 + 14 * s).toFixed(1)}" r="${(9 * s).toFixed(1)}" fill="#e8b830" stroke="${K}" stroke-width="${(4 * s).toFixed(1)}"/>`; }
// carta sellada (para la mano: unidades del personaje)
const LETTER = (r = -8) => `<g transform="rotate(${r})"><rect x="-58" y="-86" width="116" height="80" rx="6" fill="#f2e6c4" stroke="${K}" stroke-width="6"/><path d="M-58,-86 L0,-40 L58,-86" stroke="${K}" stroke-width="5" fill="none"/><path d="M-50,-20 L50,-20" stroke="#b8a27a" stroke-width="4"/><circle cx="0" cy="-44" r="16" fill="#b8241e" stroke="${K}" stroke-width="5"/><path d="M-6,-48 L6,-40 M6,-48 L-6,-40" stroke="#7a1410" stroke-width="3"/><path d="M-8,-30 L-20,-6 M8,-30 L20,-6" stroke="#b8241e" stroke-width="7" stroke-linecap="round"/></g>`;
// bolas de malabares (en pantalla)
function juggle(F, t, s0 = 1) { const L = toScr(F, -125, -250), R = toScr(F, 125, -250); let o = ''; const cols = ['#c8302e', '#e8b830', '#2f6fbf'];
  for (let i = 0; i < 3; i++) { const ph = (t * 1.25 + i / 3) % 1, fromL = Math.floor(t * 1.25 + i / 3) % 2 === 0, A = fromL ? L : R, B = fromL ? R : L, x = lerp(A.x, B.x, ph), y = lerp(A.y, B.y, ph) - Math.sin(Math.PI * ph) * 560 * A.q, r = 22 * A.q * s0;
    o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${cols[i]}" stroke="${K}" stroke-width="${(6 * A.q).toFixed(1)}"/><circle cx="${(x - r * .35).toFixed(1)}" cy="${(y - r * .35).toFixed(1)}" r="${(r * .28).toFixed(1)}" fill="#fff" opacity=".6"/>`; } return o; }
// franjas negras que se cierran (contener la respiración)
const bars = k => { if (k <= 0) return ''; const h = 960 * eIO2(clamp(k)) * .97; return `<rect x="0" y="0" width="1080" height="${h.toFixed(1)}" fill="#000"/><rect x="0" y="${(1920 - h).toFixed(1)}" width="1080" height="${h.toFixed(1)}" fill="#000"/>`; };
// gotas de lluvia en pantalla
function rain2d(t, n = 90, a = .5, col = '#cfe0ff') { let o = ''; for (let i = 0; i < n; i++) { const x = ((hs(i, 3) * 1300 + t * 260) % 1300) - 110, y = ((hs(i, 7) * 2100 + t * 2600 * (.8 + hs(i, 9) * .4)) % 2100) - 90, L = 40 + hs(i, 5) * 50;
  o += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(-L * .12).toFixed(1)},${L.toFixed(1)}" stroke="${col}" stroke-width="${(2 + hs(i, 4) * 2).toFixed(1)}" stroke-linecap="round" opacity="${(a * (.5 + hs(i, 2) * .5)).toFixed(2)}"/>`; } return o; }
// líneas de tensión (rojas) alrededor de un punto
const tension = (x, y, r, t, n = 8) => { let o = ''; for (let i = 0; i < n; i++) { const a = i / n * 6.283 + t * .4, r0 = r * (1 + .08 * Math.sin(t * 20 + i)); o += `<path d="M${(x + Math.cos(a) * r0).toFixed(1)},${(y + Math.sin(a) * r0).toFixed(1)} L${(x + Math.cos(a) * r0 * 1.25).toFixed(1)},${(y + Math.sin(a) * r0 * 1.25).toFixed(1)}" stroke="#ff4f5a" stroke-width="10" stroke-linecap="round" opacity=".85"/>`; } return o; };
// destellito «ding» de un cascabel
const ding = (x, y, s, k) => { if (k <= 0 || k >= 1) return ''; let o = ''; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .5, r0 = 26 * s * (1 + k), r1 = r0 + 30 * s; o += `<path d="M${(x + Math.cos(a) * r0).toFixed(1)},${(y + Math.sin(a) * r0).toFixed(1)} L${(x + Math.cos(a) * r1).toFixed(1)},${(y + Math.sin(a) * r1).toFixed(1)}" stroke="#ffe27a" stroke-width="${(7 * s).toFixed(1)}" stroke-linecap="round" opacity="${(1 - k).toFixed(2)}"/>`; } return o; };

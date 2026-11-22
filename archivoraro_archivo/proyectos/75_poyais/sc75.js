// «El país que no existía» (75) — ESTILO 3D DE DIBUJO ANIMADO: decorados de Blender (world_poyais.js) + personajes 2D (cast75.js) + efectos (fx75.js).
// Gancho en el fotograma 0: MacGregor delante de una capital de cuento, presumiendo. Caras que cambian en cada frase (pedido del usuario: «más expresiones faciales»).
window.CFG = { capY: 1500, capSize: 96, transDur: .32, blurK: .35, antic: .1, blurChars: false, transDefault: 'swish',
  trans: { cacique: 'swish', pruebas: 'cut', barcos: 'swish', selva: 'swish', paris: 'swish', final: 'swish' } };
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { EVS[l.sc] = EVS[l.sc] || (() => ({})); });
// tiempo (relativo a la escena) de la n-ésima aparición de una palabra en la línea li de la escena
const capWords = (sc, li) => { const L = window.SCRIPT.filter(l => l.sc === sc)[li]; return L ? L.cap.split(' ').map(w => norm(w.split('|')[0])) : []; };
const wt = (B, sc, li, word, nth = 0, dflt = null) => { const ws = capWords(sc, li); let c = 0; for (let i = 0; i < ws.length; i++) if (ws[i] === word) { if (c === nth) return B[li] ? B[li].w[i] : dflt; c++; } return dflt ?? (B[li] ? B[li].s : 0); };
const S = {}, W = W2;
let SHAKE = 0;
{ const _sc = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * 4.59) * .5 + Math.sin(T * 8.61) * .3, Math.sin(T * 5.3 + 1) * .5 + Math.sin(T * 9.7) * .25, 0).multiplyScalar(.008 * p.distanceTo(l) / 8);
  const sh = SHAKE > 0 ? V3(Math.sin(T * 91) * SHAKE, Math.sin(T * 77 + 2) * SHAKE, 0).multiplyScalar(p.distanceTo(l) / 10) : V3(0, 0, 0); return _sc(p.clone().add(d).add(sh), l.clone().add(d.multiplyScalar(.35)).add(sh.multiplyScalar(.6)), f, fo, ap); }; }
const cam = (p, l, f = 40, ap = .0004) => { W.setCam(p, l, f, p.distanceTo(l), ap); };   // el 3D se dibuja al FINAL de cada escena (ver abajo): así salen las bolsas, carteles y edificios que se mueven después de cam()
function sp(t, Ks) { const n = Ks.length; if (t <= Ks[0][0]) return Ks[0][1].clone(); if (t >= Ks[n - 1][0]) return Ks[n - 1][1].clone(); let i = 0; while (t > Ks[i + 1][0]) i++;
  const u = (t - Ks[i][0]) / (Ks[i + 1][0] - Ks[i][0]), a = Ks[Math.max(0, i - 1)][1], b = Ks[i][1], c = Ks[i + 1][1], d = Ks[Math.min(n - 1, i + 2)][1], u2 = u * u, u3 = u2 * u;
  const f = (p0, p1, p2, p3) => .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3); return V3(f(a.x, b.x, c.x, d.x), f(a.y, b.y, c.y, d.y), f(a.z, b.z, c.z, d.z)); }
const lerpV = (a, b, k) => a.clone().lerp(b, k);
const DAYL = { tint: '#ffe8c8', k: .12, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.6 }, LONL = { tint: '#eef0ff', k: .1, rim: '#ffffff', rimA: .45, rimX: -1, rimY: -.6 },
  JUNL = { tint: '#e8ffd8', k: .14, rim: '#fffbe0', rimA: .5, rimX: -1, rimY: -.6 }, DUSKL = { tint: '#ffc0a0', k: .26, rim: '#ffd8b8', rimA: .6, rimX: 1, rimY: -.6 }, PARL = { tint: '#ffe0d0', k: .14, rim: '#fff0e6', rimA: .5, rimX: -1, rimY: -.6 };
const depth = L => L.filter(x => x && x[1]).map(([p, s]) => [W.camera.position.distanceTo(p), s]).sort((a, b) => b[0] - a[0]).map(x => x[1]).join('');
const at = (x, z, dy = 0) => V3(x, W.ground(x, z) + dy, z);
const man = (name, F, pose = {}, opt = {}) => [F, who(name, pose, F, opt.h || ADULT, Object.assign({ gy: opt.gy ?? F.y }, opt))];
// corte interno dentro de una escena: barrido horizontal corto alrededor del instante del corte
const whip = (t, cuts, w = .1) => { if (typeof TR === 'undefined' || !TR) return; for (const c of cuts) { const d = Math.abs(t - c); if (d < w) { TR.blur('H', 26 * (1 - d / w)); return; } } };
const pick = (t, L) => { let r = L[0][1]; for (const [a, v] of L) if (t >= a) r = v; return r; };
function setup(T, site, mood, light) { W.setTime(T); W.site(site); W.setMood(mood); W.charLight = light; SHAKE = 0;
  W.POOL.bonds.forEach(b => b.visible = false); W.POOL.bags.forEach(b => b.visible = false); W.POOL.stacks.forEach(b => b.visible = false);
  Object.values(W.BLD).forEach(b => { b.rotation.set(0, 0, 0); b.position.copy(b.userData.home); b.visible = true; });
  if (W.G.easelOn) W.G.easelOn.scale.setScalar(1); if (W.G.agotadoOn) { W.G.agotadoOn.visible = false; W.G.agotadoOn.scale.setScalar(1); }
  W.SITES.city.children.forEach(c => { if (c.name === 'palm') c.visible = true; });
  if (W.G.signpostOn) W.G.signpostOn.rotation.set(0, -.5, 0); if (W.G.cases) W.G.cases.visible = false;
  const [s1, s2] = W.SHIPS; s1.position.set(W.PX + 10.4, 0, 6); s1.rotation.set(0, -Math.PI / 2, 0); s2.position.set(W.PX - 100, 0, -60); s2.rotation.set(0, -Math.PI / 2, 0); }
function bob(ship, t, k = 1) { const p = ship.position; p.y = W.waterY(p.x, p.z, t) * .6 * k; ship.rotation.z = Math.sin(t * 1.1) * .025 * k; ship.rotation.x = Math.sin(t * .8 + 1) * .02 * k; ship.updateMatrixWorld(); }
const onShip = (ship, x, z) => ship.localToWorld(V3(x, 3.75, z));
// ---------- objetos en la mano (unidades del personaje: cabeza = radio 100) ----------
const BONDH = (r = -8, s = 1) => `<g transform="rotate(${r}) scale(${s})"><rect x="-34" y="-96" width="68" height="90" rx="4" fill="#f7f0d8" stroke="${K}" stroke-width="5"/><rect x="-26" y="-88" width="52" height="13" fill="#2c3f86"/><path d="M-24,-62 L24,-62 M-24,-50 L24,-50 M-24,-38 L10,-38" stroke="${K}" stroke-width="3.5" opacity=".6"/><circle cx="16" cy="-20" r="9" fill="#c8342c" stroke="${K}" stroke-width="3"/></g>`;
const BFAN = `<g transform="translate(0,-10)">${[-34, -12, 10, 32].map(a => `<g transform="rotate(${a} 0 0)">${BONDH(0, .95)}</g>`).join('')}</g>`;
const CASE = (c = '#8a5a2e') => `<g><path d="M-14,8 L-14,-2 L14,-2 L14,8" stroke="${K}" stroke-width="7" fill="none"/><rect x="-46" y="8" width="92" height="64" rx="9" fill="${c}" stroke="${K}" stroke-width="6"/><rect x="-46" y="32" width="92" height="9" fill="#00000033"/></g>`;
const PIC = `<g transform="translate(0,-44) rotate(-4)"><rect x="-74" y="-58" width="148" height="110" fill="#ffc928" stroke="${K}" stroke-width="6"/><rect x="-60" y="-45" width="120" height="84" fill="#8ec5ff"/><rect x="-60" y="16" width="120" height="23" fill="#41c261"/><rect x="-42" y="-14" width="24" height="31" fill="#f28fa8" stroke="${K}" stroke-width="3"/><rect x="-11" y="-31" width="27" height="48" fill="#fbf0d2" stroke="${K}" stroke-width="3"/><path d="M-11,-31 A13.5,13.5 0 0 1 16,-31" fill="#4f8fe8" stroke="${K}" stroke-width="3"/><rect x="22" y="-10" width="23" height="27" fill="#ffd96a" stroke="${K}" stroke-width="3"/><circle cx="42" cy="-30" r="8" fill="#ffd34a"/></g>`;
const BATON = (a = 20) => `<rect x="-4" y="-124" width="8" height="128" rx="4" fill="#fbf8ef" stroke="${K}" stroke-width="4" transform="rotate(${a})"/>`;
const CUP = `<g transform="translate(0,-16)"><path d="M-22,-16 L22,-16 L16,14 Q0,22 -16,14Z" fill="#fff" stroke="${K}" stroke-width="5"/><path d="M22,-8 Q36,-6 32,6 Q28,12 18,8" stroke="${K}" stroke-width="5" fill="none"/><ellipse cx="0" cy="22" rx="32" ry="7" fill="#fff" stroke="${K}" stroke-width="5"/><path d="M-6,-30 Q-12,-42 -4,-54 M6,-30 Q0,-42 8,-54" stroke="#fff" stroke-width="5" fill="none" opacity=".85"/></g>`;
const TRAY = `<g transform="translate(0,-6)"><ellipse rx="62" ry="12" fill="#c9ced6" stroke="${K}" stroke-width="5"/><path d="M-36,-8 Q-32,-42 0,-44 Q32,-42 36,-8 Q0,-18 -36,-8Z" fill="#e8a84a" stroke="${K}" stroke-width="5"/><path d="M-14,-38 L-10,-12 M8,-40 L6,-12" stroke="#b8782a" stroke-width="4"/></g>`;
const LEAF = `<g transform="translate(0,-60) rotate(-20)"><path d="M0,60 Q-90,-10 0,-120 Q90,-10 0,60Z" fill="#41c261" stroke="${K}" stroke-width="6"/><path d="M0,58 L0,-110" stroke="#2e9e57" stroke-width="5"/></g>`;
// ---------- efectos 2D ----------
function sparkle(x, y, s, rot = 0) { if (s <= .02) return ''; const r = 18 * s; return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)})"><path d="M0,${-r} L${r * .22},${-r * .22} L${r},0 L${r * .22},${r * .22} L0,${r} L${-r * .22},${r * .22} L${-r},0 L${-r * .22},${-r * .22}Z" fill="#fff8d0" stroke="${K}" stroke-width="${(2.5 + s).toFixed(1)}" stroke-linejoin="round"/></g>`; }
function sparkles(cx, cy, R, t, n = 7, s = 1.4) { let o = ''; for (let i = 0; i < n; i++) { const ph = (t * .8 + hs(i, 3)) % 1, x = cx + (hs(i, 1) - .5) * 2 * R, y = cy + (hs(i, 2) - .5) * 1.4 * R; o += sparkle(x, y, s * Math.sin(Math.PI * ph) * (.7 + .5 * hs(i, 4)), t * 60 + i * 40); } return o; }
function rays(x, y, r, k, col = '#ffd34a', n = 12) { if (k <= 0 || k >= 1) return ''; let o = ''; const e = eOut(k); for (let i = 0; i < n; i++) { const a = i / n * 6.283 + .2, r0 = r * (.45 + .5 * e), r1 = r * (.75 + .7 * e); o += `<path d="M${(x + Math.cos(a) * r0).toFixed(1)},${(y + Math.sin(a) * r0).toFixed(1)} L${(x + Math.cos(a) * r1).toFixed(1)},${(y + Math.sin(a) * r1).toFixed(1)}" stroke="${col}" stroke-width="${(14 * (1 - k)).toFixed(1)}" stroke-linecap="round" opacity="${(1 - k * .6).toFixed(2)}"/>`; } return o; }
function mnotes(cx, cy, t, n = 8, s = 1) { let o = ''; const cols = ['#ffd34a', '#ff6f91', '#6cc6ff', '#5fe08a']; for (let i = 0; i < n; i++) { const ph = (t * .45 + hs(i, 2)) % 1, x = cx + (hs(i, 1) - .5) * 520 * s + Math.sin(t * 3 + i) * 30 * s, y = cy - ph * 520 * s, sc = s * (1.1 + .4 * hs(i, 5)) * Math.sin(Math.PI * Math.min(1, ph * 1.4));
  if (sc <= .05) continue; const c = cols[i % 4]; o += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)}) rotate(${(Math.sin(t * 4 + i) * 14).toFixed(0)})"><path d="M8,-6 L8,-58 Q26,-50 30,-36" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-2" cy="-4" rx="14" ry="10" fill="${c}" stroke="${K}" stroke-width="5" transform="rotate(-20 -2 -4)"/></g>`; } return o; }
function qmark(x, y, s, k) { if (k <= 0) return ''; const sc = s * eBack(clamp(k)); return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)}) rotate(${(Math.sin(k * 9) * 8).toFixed(0)})"><text x="0" y="0" text-anchor="middle" font-family="Inter" font-weight="900" font-size="120" fill="#ffd34a" stroke="${K}" stroke-width="10" paint-order="stroke">?</text></g>`; }
function gulls(t, x0, y0, s = 1, n = 4, vx = 50) { let o = ''; for (let i = 0; i < n; i++) { const x = x0 + t * vx * s + (i % 3) * 80 * s - i * 22 * s, y = y0 + Math.sin(t * 1.3 + i) * 12 * s + (i % 2) * 44 * s - i * 14 * s, f = Math.sin(t * 8 + i * 1.7), w = 30 * s;
  const d = `M${(x - w).toFixed(1)},${(y - f * 12 * s).toFixed(1)} Q${(x - w * .4).toFixed(1)},${(y - 10 * s).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)} Q${(x + w * .4).toFixed(1)},${(y - 10 * s).toFixed(1)} ${(x + w).toFixed(1)},${(y - f * 12 * s).toFixed(1)}`;
  o += `<path d="${d}" stroke="${K}" stroke-width="${(9 * s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#ffffff" stroke-width="${(4 * s).toFixed(1)}" fill="none" stroke-linecap="round"/>`; } return o; }
function coins(cx, y0, t, n = 14, s = 1, t0 = 0) { if (t < t0) return ''; let o = ''; for (let i = 0; i < n; i++) { const ph = ((t - t0) * .9 + hs(i, 2)) % 1, x = cx + (hs(i, 1) - .5) * 900, y = y0 + ph * 1500, w = Math.abs(Math.cos(t * 6 + i)) * 26 * s + 3;
  o += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${w.toFixed(1)}" ry="${(26 * s).toFixed(1)}" fill="#ffd23a" stroke="${K}" stroke-width="${(5 * s).toFixed(1)}"/>`; } return o; }
// mosquito suelto (para la nube que forma una corona)
const mq = (x, y, s, t, i) => { const w = 3 + Math.abs(Math.sin(t * 38 + i * 3)) * 6; return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})"><ellipse cx="-5" cy="-7" rx="10" ry="${w.toFixed(1)}" fill="#fff" stroke="${K}" stroke-width="2" opacity=".92"/><ellipse cx="5" cy="-7" rx="10" ry="${w.toFixed(1)}" fill="#fff" stroke="${K}" stroke-width="2" opacity=".92"/><ellipse rx="9" ry="5.5" fill="${K}"/><path d="M-9,2 L-14,9 M0,4 L0,11 M9,2 L14,9" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/></g>`; };
function crownSwarm(cx, cy, R, t, k, n = 46) { const P = [[-1, .6], [-1, -.25], [-.55, .12], [0, -.75], [.55, .12], [1, -.25], [1, .6]]; const seg = []; let tot = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push([a, b, l]); tot += l; }
  let o = ''; for (let i = 0; i < n; i++) { let d = i / n * tot, j = 0; while (d > seg[j][2]) { d -= seg[j][2]; j++; } const [a, b, l] = seg[j], u = d / l, tx = cx + (a[0] + (b[0] - a[0]) * u) * R, ty = cy + (a[1] + (b[1] - a[1]) * u) * R;
    const ang = hs(i, 1) * 6.283 + t * (1.5 + hs(i, 2) * 2), rr = R * (.3 + .8 * hs(i, 3)), fx = cx + Math.cos(ang) * rr, fy = cy + Math.sin(ang * 1.3) * rr * .6, kk = eIO(clamp(k)), jit = (1 - kk * .85) * 1;
    o += mq(lerp(fx, tx, kk) + Math.sin(t * 9 + i) * 5 * jit, lerp(fy, ty, kk) + Math.cos(t * 8 + i) * 5 * jit, 1.05, t, i); } return o; }
function rain3D(list, C, t, t0, n, area, s = 1) { for (let i = 0; i < Math.min(n, list.length); i++) { const b = list[i], u = t - t0 - hs(i, 7) * .6; if (u < 0) { b.visible = false; continue; } const fall = 2.4 + hs(i, 3) * 1.6, y = C.y + 8 - ((u * fall) % 9.5);
    b.visible = true; b.position.set(C.x + (hs(i, 1) - .5) * area + Math.sin(u * 2 + i) * .6, y, C.z + (hs(i, 2) - .5) * area * .6); b.rotation.set(u * (1.5 + hs(i, 4) * 2), u * (1 + hs(i, 5)), Math.sin(u * 3 + i) * .8); b.scale.setScalar(s); } }

// =====================================================================================================
// 1 · GANCHO — MacGregor delante de la capital de cuento; cientos de colonos entran; ópera, catedral, palacio… y era de cartón
// =====================================================================================================
S.gancho = (t, D, B) => { setup(t, 'city', 'poyais', DAYL);
  const tV = wt(B, 'gancho', 0, 'vendio'), tE = wt(B, 'gancho', 0, 'entero'), tC = wt(B, 'gancho', 0, 'cientos') - .1, t1 = B[1] ? B[1].s : D * .48, tOp = wt(B, 'gancho', 1, 'opera'), tCa = wt(B, 'gancho', 1, 'catedral'), tPa = wt(B, 'gancho', 1, 'palacio'), t2 = B[2] ? B[2].s : D * .73, tEx = wt(B, 'gancho', 2, 'existia');
  whip(t, [tC, t1, tCa, tPa, t2]);
  if (t < tC) {   // A · MacGregor presume de su país (fotograma 0: personaje en cámara, con acción)
    const k = eIO(clamp(t / Math.max(.5, tE + .4))); cam(lerpV(V3(2.6, 1.95, 24.2), V3(1.6, 3.4, 29), k), lerpV(V3(2.1, 2.1, 20), V3(2, 4.6, 8), k), lerp(36, 46, k));
    const P = seq(t, [[0, { armR: [150, 10], armL: [40, 30], face: 'smug', mouth: 'smirk', brows: .3, turn: .15 }], [tV, { armR: [95, 30], armL: [150, 20], holdR: BFAN, face: 'stars', mouth: 'big', brows: .5, turn: .1 }], [tE + .2, { armR: [95, 30], armL: [160, 40], holdR: BFAN, face: 'smug', mouth: 'grin', turn: .2 }]], .3);
    const F = at(2, 20); const L = [man('MACG', F, Object.assign(P, { sparkle: t * 2 }))];
    return depth(L) + sparkles(540, 760, 380, t, 9, 1.3) + (t > tV ? rays(W.proj(V3(2.6, 2.6, 20.3)).x, W.proj(V3(2.6, 2.6, 20.3)).y, 160, (t - tV) / .5) : ''); }
  if (t < t1) {   // B · cientos de colonos llegan por el camino con sus maletas
    const u = t - tC, k = eIO(clamp(u / (t1 - tC))); cam(lerpV(V3(7.5, 1.7, 45), V3(6, 2.1, 41), k), lerpV(V3(-1, 2.1, 31), V3(-1.5, 2.6, 27), k), 44);
    const L = []; const names = ['COL1', 'COL2', 'COL3', 'DAMA2', 'CLERK', 'COL1', 'DAMA1', 'COL2', 'BANK', 'COL3'];
    for (let i = 0; i < 10; i++) { const x = -1.6 + (i % 2) * 2.4 - (i > 4 ? .5 : 0), z = 31 + i * 2.6 - u * 1.4, F = at(x, z), kid = names[i] === 'COL3';
      L.push(man(names[i], F, Object.assign(walkPose(t * 7 + i * 1.3), { turn: -.45, face: i % 3 === 0 ? 'happy' : 'open', mouth: i % 3 === 0 ? 'laugh' : 'smile', blush: i % 2 ? 1 : 0, holdR: i % 2 ? CASE(['#8a5a2e', '#5a7aa8', '#a83a2a'][i % 3]) : '', holdL: i % 4 === 0 ? CASE('#6a8a3a') : '' }), { h: kid ? 1.25 : ADULT })); }
    for (let i = 0; i < 22; i++) { const z = 58 + i * 3.2 - u * 1.4, F = at((i % 2 ? 1.2 : -1.2) + hs(i, 3) * .6, z); L.push(man(['COL1', 'COL2', 'DAMA1', 'CLERK', 'GENT'][i % 5], F, Object.assign(walkPose(t * 7 + i), { turn: -.3, face: 'open', mouth: 'smile', holdR: CASE() }), { blur: 2 })); }
    return depth(L); }
  if (t < t2) {   // C · ópera, catedral y palacio: tres golpes con brillo
    const sh = t < tCa ? 0 : t < tPa ? 1 : 2, t0 = [t1, tCa, tPa][sh], u = t - t0, k = eOut(clamp(u / 1.1));
    const Bx = [19.5, 2.5, -29][sh], Bz = [1.6, 0, -2.5][sh], Ly = [4.6, 8.2, 7][sh], dz = [12, 17, 14][sh];
    cam(V3(Bx + 2.6 - 1.5 * k, 2.4 + .8 * k, Bz + dz + 2.5 - 2.5 * k), V3(Bx, Ly - .4 + .4 * k, Bz), 46);
    const tw = [tOp, tCa, tPa][sh], q = W.proj(V3(Bx, Ly, Bz + .3));
    const F = at(Bx - 3.4 + sh * .3, Bz + dz - 4.2), poses = [{ armR: [140, 20], armL: [30, 30], face: 'happy', mouth: 'laugh', turn: .4, hatTilt: -10 }, { armR: [120, 70], armL: [120, 70], face: 'closed', mouth: 'smile', turn: .3, blush: 1 }, { armR: [150, 0], armL: [150, 0], face: 'stars', mouth: 'big', turn: .3 }];
    return depth([man('MACG', F, Object.assign({}, poses[sh], { sparkle: t * 3 }))]) + rays(q.x, q.y, 300, (t - tw + .05) / .55, '#ffe58a', 16) + sparkles(q.x, q.y, 260, t, 8, 1.6); }
  // D · «no existía»: la cámara rodea la catedral y se ve el decorado de cartón con puntales; MacGregor pillado pintando
  const u = t - t2, kE = clamp((u) / Math.max(.6, tEx - t2 + .3)), a = lerp(Math.PI / 2, -.95, eIO(kE)), C = V3(4, 0, -3);
  const RR = lerp(25, 18, eIO(kE)); cam(V3(C.x + Math.cos(a) * RR, 4.4 + .6 * eIO(kE), C.z + Math.sin(a) * RR), V3(lerp(2.5, 6.5, eIO(kE)), lerp(7.5, 3.6, eIO(kE)), lerp(0, -6, eIO(kE))), 50);
  const wob = t > tEx ? Math.sin((t - tEx) * 16) * .05 * Math.exp(-(t - tEx) * 3) : 0; W.BLD.cat.rotation.x = wob; W.BLD.opera.rotation.x = wob * .6;
  const caught = t > tEx - .05, P = caught ? { face: 'wide', mouth: 'grin', sweat: true, armR: [120, 40], turn: -.6, look: [-8, 0], prop: 'brush', paint: '#f28fa8', brushRot: -20, squash: .06 } : { face: 'happy', mouth: 'smile', armR: [100 + Math.sin(t * 9) * 25, 60], turn: .6, prop: 'brush', paint: '#f28fa8' };
  return depth([man('MACG', at(9.6, -8.2), P)]) + (caught ? rays(W.proj(V3(9.6, 2.6, -8.2)).x, W.proj(V3(9.6, 2.6, -8.2)).y, 150, (t - tEx) / .45, '#ffffff', 10) : ''); };

// =====================================================================================================
// 2 · CACIQUE — Londres: MacGregor sobre un barril; «soy el cacique de Poyais»; nadie se ríe: todos sueñan
// =====================================================================================================
const CROWD = [['BANK', 997.5, 7], ['GENT', 999, 7.6], ['DAMA1', 1000.6, 7.2], ['CLERK', 1002.2, 7.8], ['DAMA2', 1003.6, 7.1], ['COL1', 995.8, 8.3], ['COL2', 1005.2, 8.3]];
const PODF = () => V3(W.LX, 1.64, 2);
S.cacique = (t, D, B) => { setup(t, 'london', 'londres', LONL);
  const tG = wt(B, 'cacique', 0, 'gregor'), tGen = wt(B, 'cacique', 0, 'general'), t1 = B[1] ? B[1].s : D * .45, tCq = wt(B, 'cacique', 1, 'cacique'), tN = wt(B, 'cacique', 1, 'nadie') - .1, tR = wt(B, 'cacique', 1, 'rio');
  whip(t, [t1, tN]); const X = W.LX;
  if (t < t1) {   // contrapicado de héroe
    const k = eIO(clamp(t / t1)); cam(lerpV(V3(X + .9, .9, 8.6), V3(X + .4, 1.2, 6.9), k), V3(X, 3.5, 2), lerp(46, 40, k));
    const P = seq(t, [[0, { armR: [25, 10], armL: [25, 10], face: 'smug', mouth: 'smirk', turn: .1 }], [tG, { armR: [40, 135], armL: [30, 20], face: 'closed', mouth: 'smile', brows: .5, turn: .15, blush: 1 }], [tGen, { armR: [165, 150], armL: [20, 10], face: 'smug', mouth: 'smirk', brows: .3, turn: .1 }]], .3);
    const q = W.proj(V3(X - .2, 2.9, 2.2)); const L = [man('MACG', PODF(), Object.assign(P, { sparkle: t * 2 }))];
    L.push(man('BANK', at(X - 1.6, 5.6), { view: 'back', turn: .2 }, { blur: 5 }), man('DAMA1', at(X + 1.8, 5.8), { view: 'back', turn: -.2 }, { blur: 5 }));
    return depth(L) + (t > tGen ? sparkle(q.x, q.y, 2.2 * Math.sin(Math.PI * clamp((t - tGen) / .7)), t * 200) : ''); }
  if (t < tN) {   // por encima del hombro del público: «¡soy el cacique de Poyais!»
    const u = t - t1, k = eIO(clamp(u / (tN - t1))); cam(lerpV(V3(X - .2, 2.8, 12.8), V3(X - .1, 3.0, 11.4), k), V3(X, 3.0, 2), 42);
    const shout = t > tCq - .25; SHAKE = shout && t < tCq + .3 ? .012 : 0;
    const L = [man('MACG', PODF(), shout ? { armR: [150, 0], armL: [150, 0], face: 'stars', mouth: 'big', brows: .6, turn: .05 } : { armR: [60, 40], armL: [30, 20], face: 'smug', mouth: 'open', turn: .1 })];
    CROWD.forEach(([n, x, z], i) => L.push(man(n, at(x, z), { view: 'back', turn: (x - X) * -.08, bob: Math.sin(t * 3 + i) * 3 })));
    const q = W.proj(V3(X, 3.2, 2)); return depth(L) + (shout ? rays(q.x, q.y, 260, (t - tCq + .25) / .6, '#ffd34a', 14) : ''); }
  // «nadie se rió»: barrido por las caras; uno empieza a reírse y se calla al ver a los demás soñando
  const u = t - tN, k = eIO(clamp(u / (D - tN))); cam(V3(X + lerp(-3.2, 2.6, k), 2.0, 2.6), V3(X + lerp(-3.4, 2.8, k), 1.75, 7.4), 40);
  const L = CROWD.map(([n, x, z], i) => { let P = t < tR ? { face: 'wide', mouth: 'o', turn: -.1 } : (n === 'BANK' ? { face: 'money', mouth: 'laugh', blush: 1, armR: [150, 10], armL: [150, 10] } : { face: 'stars', mouth: 'big', armR: [150 - i * 5, 20], armL: [140, 20], blush: 1 });
    if (n === 'CLERK') P = t < tR - .05 ? { face: 'happy', mouth: 'laugh', armL: [40, 120] } : { face: 'open', mouth: 'line', sweat: true, look: [-10, 0], armL: [20, 10] };
    return man(n, at(x, z), Object.assign(P, { bob: t > tR ? Math.abs(Math.sin(t * 8 + i)) * -14 : 0 })); });
  return depth(L); };

// =====================================================================================================
// 3 · PRUEBAS — «¿pruebas?»; el cuadro de la capital; el himno; la oficina; lluvia de bonos (200.000 libras)
// =====================================================================================================
S.pruebas = (t, D, B) => { setup(t, 'london', 'londres', LONL); const X = W.LX;
  const tCu = wt(B, 'pruebas', 0, 'cuadros') - .1, tHi = wt(B, 'pruebas', 0, 'himno') - .2, tOf = wt(B, 'pruebas', 0, 'oficinas') - .1, tBo = wt(B, 'pruebas', 0, 'bonos') - .1, t2k = wt(B, 'pruebas', 0, '200000');
  whip(t, [tCu, tHi, tOf, tBo]);
  if (t < tCu) {   // el caballero desconfiado se acerca a cámara
    const k = eOut(clamp(t / .8)); cam(V3(X - .9, 1.85, lerp(10.6, 9.9, k)), V3(X - 1, 1.82, 7.6), 34);
    const L = [man('GENT', at(X - 1, 7.6), { face: 'smug', mouth: 'line', brows: -.4, browTilt: -.5, look: [10, 0], turn: .3, lean: -4 + 4 * k, armL: [40, 150] }), man('DAMA1', at(X + .8, 6.6), { face: 'open', mouth: 'o', turn: -.3 }, { blur: 4 })];
    const q = W.proj(V3(X - .7, 3.35, 7.6)); return depth(L) + qmark(q.x + 190, q.y + 120, 1.3, t / .3); }
  if (t < tHi) {   // el cuadro de la capital, con brillo
    const u = t - tCu, k = eIO(clamp(u / (tHi - tCu))); const E = W.G.easelOn; E.scale.setScalar(.6 + .4 * eBack(clamp(u / .35)));
    cam(lerpV(V3(X - 1.2, 2.3, 11.2), V3(X - 1.9, 2.3, 10), k), V3(X - 3.8, 2.0, 4.4), 42);
    const q = W.proj(V3(X - 5.4, 2.3, 3.75));
    const L = [man('MACG', at(X - 3.4, 4.5), { armL: [120, 10], armR: [30, 30], face: 'smug', mouth: 'grin', turn: -.3, look: [-10, 0], sparkle: t * 3 }), man('DAMA2', at(X - 1.7, 5.9), { face: 'stars', mouth: 'big', turn: -.6, blush: 1, armR: [140, 60], armL: [140, 60] }), man('GENT', at(X - .6, 6.6), { face: 'wide', mouth: 'o', turn: -.6 }, { blur: 3 })];
    return depth(L) + sparkles(q.x, q.y, 150, t, 8, 1.4); }
  if (t < tOf) {   // el himno: MacGregor dirige con batuta, el público baila
    const u = t - tHi, k = eIO(clamp(u / (tOf - tHi))); cam(lerpV(V3(X + 4.4, 2.3, 10.4), V3(X + 3.6, 2.5, 9.4), k), V3(X, 2.5, 4.2), 44);
    const beat = Math.sin(t * 7.5), L = [man('MACG', PODF(), { armR: [120 + beat * 35, 40], armL: [110 - beat * 30, 50], holdR: BATON(20 + beat * 25), face: 'closed', mouth: 'smile', turn: .1, lean: beat * 4 })];
    CROWD.forEach(([n, x, z], i) => { const b2 = Math.sin(t * 7.5 + i * 1.1); L.push(man(n, at(x, z - 1.4), { face: i % 2 ? 'happy' : 'closed', mouth: i % 3 ? 'smile' : 'laugh', armR: [130 + b2 * 30, 30], armL: [130 - b2 * 30, 30], lean: b2 * 6, bob: -Math.abs(b2) * 12, turn: -.2 + (x - X) * .05, blush: 1 })); });
    const q = W.proj(V3(X, 3.6, 2)); return depth(L) + mnotes(q.x, q.y + 80, t, 10, 1); }
  if (t < tBo) {   // la oficina de Poyais: grúa hasta el cartel, cola de gente entrando
    const u = t - tOf, k = eIO(clamp(u / (tBo - tOf))); cam(lerpV(V3(X + 2.4, 1.6, -29), V3(X + 1.2, 6.4, -33), k), lerpV(V3(X, 5, -46), V3(X, 12.4, -47), k), 48);
    const L = []; for (let i = 0; i < 9; i++) { const z = -36.5 - i * 1.1 + u * .9 - (i > 6 ? 30 : 0), x = X - .6 + (i % 2) * 1.2; if (z < -46.5) continue; L.push(man(['BANK', 'DAMA1', 'GENT', 'COL1', 'DAMA2', 'CLERK', 'COL2'][i % 7], at(x, z), Object.assign(walkPose(t * 6 + i), { view: 'back' }))); }
    return depth(L) + sparkles(540, 700, 260, t, 6, 1.2); }
  // bonos: llueven del cielo; el banquero los caza con ojos de libra
  const u = t - tBo, k = eIO(clamp(u / (D - tBo))); rain3D(W.POOL.bonds, V3(X, 0, -2.5), t, tBo - .2, 34, 12, 1.0);
  cam(lerpV(V3(X + 1.4, 1.75, 5.6), V3(X + 1.1, 2.2, 6.6), k), V3(X, 2.1, 0), 44);
  const jump = Math.abs(Math.sin(u * 7)) * .35; const L = [man('BANK', V3(X, W.ground(X, 0) + jump, 0), { face: 'money', mouth: 'laugh', armR: [160, 20], armL: [160, 20], blush: 1, holdR: BONDH(10), gy: 0 }, { gy: 0 }),
    man('DAMA1', at(X - 1.6, -1.6), { face: 'money', mouth: 'big', armR: [150, 40], armL: [150, 40], turn: .3 }), man('COL1', at(X + 1.7, -1.8), { face: 'stars', mouth: 'laugh', armR: [160, 0], armL: [120, 40], turn: -.3, holdL: BONDH(-20) })];
  const q = W.proj(V3(X, 3.4, 0)); return depth(L) + coins(540, -200, t, 16, 1.1, t2k - .1) + (t2k ? rays(q.x, q.y, 300, (t - t2k) / .6, '#ffd34a', 16) : ''); };

// =====================================================================================================
// 4 · BARCOS — la gente compra; el barco de Londres zarpa con 70 colonos; el de Escocia, con 200 más
// =====================================================================================================
S.barcos = (t, D, B) => { setup(t, 'port', 'puerto', DAYL); const X = W.PX, [s1, s2] = W.SHIPS;
  const tZ = wt(B, 'barcos', 0, 'zarpo') - .15, tO = wt(B, 'barcos', 0, 'otro') - .1, t70 = wt(B, 'barcos', 0, '70');
  whip(t, [tZ, tO]); bob(s1, t); bob(s2, t + 2);
  if (t < tZ) {   // en el muelle, con el bono en la mano y la maleta
    const k = eIO(clamp(t / tZ)); cam(lerpV(V3(X + 2, 2.4, 23.6), V3(X + 1.9, 2.6, 22.2), k), V3(X + 1.9, 2.2, 15), 42);
    const L = [man('COL1', at(X + .4, 15.4), { face: 'happy', mouth: 'laugh', armR: [165, 10 + Math.sin(t * 12) * 20], holdR: BONDH(-10), armL: [30, 20], holdL: CASE(), turn: .2, blush: 1 }),
      man('COL2', at(X + 2.2, 15.9), { face: 'stars', mouth: 'smile', armR: [40, 120], armL: [30, 20], holdL: CASE('#5a7aa8'), turn: -.1, blush: 1 }),
      man('COL3', V3(X + 3.5, W.ground(X + 3.5, 14.7) + Math.abs(Math.sin(t * 8)) * .3, 14.7), { face: 'happy', mouth: 'laugh', armR: [160, 10], armL: [160, 10] }, { h: 1.25, gy: W.ground(X + 3.5, 14.7) }),
      man('MARIN', at(X + 5.2, 9), { face: 'open', mouth: 'smile', armR: [150, 30], turn: -.4 }, { blur: 3 })];
    return depth(L) + gulls(t, 200, 420, .9, 4, 40); }
  if (t < tO) {   // zarpa: el barco avanza hacia mar abierto con los colonos saludando en cubierta
    const u = t - tZ, k = eIO(clamp(u / (tO - tZ))); s1.position.z = 6 + u * u * .9 + u * 1.5; s1.position.x = X + 10.4 + u * .8; bob(s1, t);
    const tgt = s1.position.clone(); cam(V3(tgt.x + 24 - k * 3, 3.6 + k, tgt.z + 24 - k * 3), V3(tgt.x, 6.8, tgt.z), 48);
    const L = []; for (let i = 0; i < 9; i++) { const lx = -6 + (i % 5) * 3, lz = i < 5 ? 1.5 : -1.2, F = onShip(s1, lx, lz); L.push(man(['COL1', 'COL2', 'DAMA1', 'COL3', 'DAMA2', 'CLERK', 'COL1', 'COL2', 'MARIN'][i], F, { face: i % 2 ? 'happy' : 'open', mouth: i % 2 ? 'laugh' : 'smile', armR: [160, Math.sin(t * 10 + i) * 30], turn: .4 }, { gy: F.y, shadow: false, h: i === 3 ? 1.25 : ADULT })); }
    const q = W.proj(V3(tgt.x, 9, tgt.z)); return depth(L) + gulls(t, 300, 360, 1, 5, 60) + (t70 ? sparkles(q.x, q.y, 220, t, 6, 1.2) : ''); }
  // el de Escocia: barco azul repleto de cabezas, cruzando delante de la cámara
  const u = t - tO, k = eIO(clamp(u / (D - tO))); s2.position.set(X - 20, 0, 60 + u * 3.2); bob(s2, t, 1.3);
  const tg = s2.position.clone(); cam(lerpV(V3(tg.x + 25, 3.8, tg.z + 23), V3(tg.x + 21, 4.6, tg.z + 20), k), V3(tg.x, 6.4, tg.z), 48);
  const L = []; for (let i = 0; i < 20; i++) { const lx = -7.5 + (i % 7) * 2.4 + (i > 13 ? 1.2 : 0), lz = [-2, 0, 2][Math.floor(i / 7)], F = onShip(s2, lx, lz); L.push(man(['COL1', 'COL2', 'DAMA1', 'DAMA2', 'COL3', 'CLERK', 'GENT'][i % 7], F, { face: ['happy', 'stars', 'open'][i % 3], mouth: ['laugh', 'big', 'smile'][i % 3], armR: [150 + Math.sin(t * 9 + i) * 20, 20], armL: [i % 2 ? 150 : 20, 20], turn: -.3 }, { gy: F.y, shadow: false, h: i % 7 === 4 ? 1.25 : ADULT })); }
  return depth(L) + gulls(t, 700, 380, 1, 4, -40); };

// =====================================================================================================
// 5 · SELVA — buscan la ópera: mosquitos; la catedral: más mosquitos; el palacio: una corona de mosquitos.
//            Solo selva (el cartel se cae). Al atardecer: enferman. Maletas en la arena.
// =====================================================================================================
const GRP = [['COL1', 3001.4, 15], ['COL2', 2999.6, 16], ['COL3', 3003, 16.3], ['DAMA2', 3004.6, 15.4]];
S.selva = (t, D, B) => { const BX = W.BX;
  const tEn = wt(B, 'selva', 0, 'encontraron') - .1, tB1 = wt(B, 'selva', 0, 'buscaron', 0) - .1, tMa = wt(B, 'selva', 0, 'mas') - .1, tB2 = wt(B, 'selva', 0, 'buscaron', 1) - .1, tPa = wt(B, 'selva', 0, 'palacio'), tIm = wt(B, 'selva', 0, 'imaginas'),
    t1 = B[1] ? B[1].s : D * .58, tSe = wt(B, 'selva', 1, 'selva'), t2 = B[2] ? B[2].s : D * .8, tMy = wt(B, 'selva', 2, 'mayoria') - .15;
  whip(t, [tEn, tB1, tMa, tB2, t1, tMy]);
  if (t < t2) setup(t, 'beach', 'selva', JUNL); else setup(t, 'beach', 'tarde', DUSKL);
  const sw = (i, f = 14) => Math.sin(t * f + i * 2);
  if (t < tEn) {   // llegan comparando el cuadro con lo que ven
    const k = eIO(clamp(t / tEn)); cam(lerpV(V3(BX + 2.4, 2.2, 28), V3(BX + 2.2, 2.0, 24.5), k), V3(BX + 2.4, 2.3, 13), 42);
    const L = GRP.map(([n, x, z], i) => man(n, at(x, z), i === 0 ? { holdR: PIC, armR: [140, 30], face: 'open', mouth: 'smile', look: [sw(0, 2) * 12, 0], turn: .1 } : { face: 'open', mouth: 'smile', look: [Math.sin(t * 2 + i) * 14, -4], turn: .2 * (i - 1.5), holdR: CASE(['#8a5a2e', '#5a7aa8', '#a83a2a'][i % 3]) }, { h: n === 'COL3' ? 1.25 : ADULT }));
    const q = W.proj(V3(BX + 1.4, 2.6, 15)); return depth(L) + sparkles(q.x, q.y - 60, 110, t, 4, 1); }
  if (t < tB1) {   // ¡mosquitos!
    const u = t - tEn, k = eOut(clamp(u / .6)); SHAKE = .006; cam(V3(BX + 2.2, 1.9, 21.8), V3(BX + 2.2, 2.0, 15), 40);
    const L = GRP.map(([n, x, z], i) => man(n, at(x, z), { face: 'wide', mouth: i % 2 ? 'big' : 'grin', armR: [140 + sw(i) * 40, 60 + sw(i + 1) * 40], armL: [130 - sw(i) * 40, 60], sweat: true, turn: .2 * (i - 1.5), squash: .05 }, { h: n === 'COL3' ? 1.25 : ADULT }));
    return depth(L) + mosq(lerp(-120, 520, k), 800, 300, 46, t, 1.4) + mosq(lerp(1200, 640, k), 700, 220, 30, t + 3, 1.2); }
  if (t < tMa) {   // buscan la catedral: miran a la selva, mano de visera
    const u = t - tB1, k = eIO(clamp(u / (tMa - tB1))); cam(lerpV(V3(BX + 4.6, 1.8, 19.5), V3(BX + 4.2, 2.3, 19), k), lerpV(V3(BX - 4, 3.4, 4), V3(BX - 7, 6.4, -2), k), 46);
    const L = [man('COL1', at(BX + 1.4, 15), { face: 'open', mouth: 'line', armR: [150, 150], turn: -.6, look: [-12, -4], brows: .3 }), man('COL3', at(BX + 3, 16.3), { face: 'open', mouth: 'o', turn: -.7, look: [-14, -6] }, { h: 1.25 })];
    return depth(L) + mosq(820, 640, 120, 14, t, 1); }
  if (t < tB2) {   // más mosquitos: primerísimo plano, uno en la nariz
    const u = t - tMa, hy = W.ground(BX - .4, 16) + ADULT; cam(V3(BX - .25, hy + .05, 18.6), V3(BX - .4, hy - .1, 16), 30); SHAKE = .004;
    const L = [man('COL2', at(BX - .4, 16), { face: 'angry', mouth: 'grin', vein: 1 + .2 * Math.sin(t * 20), brows: -.7, look: [0, -6], sweat: true, armR: [150 + sw(0, 20) * 20, 80] })];
    const q = W.proj(V3(BX - .4, W.ground(BX - .4, 16) + ADULT - .02, 16.05)); return depth(L) + mq(q.x, q.y + 8, 1.6, t, 3) + mosq(540, 820, 420, 60, t, 1.5); }
  if (t < t1) {   // el palacio… la nube de mosquitos se convierte en una corona
    const u = t - tB2, k = clamp((t - tPa) / Math.max(.4, tIm - tPa + .3)); cam(V3(BX + 3.4, 1.55, 20.2), V3(BX + 3.2, 2.7, 16), 44);
    const L = [man('COL3', at(BX + 3, 16.3), k < .95 ? { face: 'open', mouth: 'o', look: [0, -12], armR: [150, 30], holdR: LEAF, turn: .1 } : { face: 'sad', mouth: 'sad', browTilt: -.6, look: [0, -12], armR: [150, 30], holdR: LEAF }, { h: 1.25 })];
    const q = W.proj(V3(BX + 3, 4.2, 16)); return depth(L) + crownSwarm(q.x, q.y, 210, t, k); }
  if (t < t2) {   // solo selva: la cámara sube; el cartel de POYAIS se cae
    const u = t - t1, k = eIO(clamp(u / (t2 - t1))); cam(lerpV(V3(BX + 4, 3, 25), V3(BX + 12, 44, 62), k), lerpV(V3(BX + 3, 2.5, 13), V3(BX, 0, -10), k), lerp(44, 52, k));
    const kf = clamp((t - tSe + .1) / .5); W.G.signpostOn.rotation.set(0, -.5, -1.5 * eBack(kf) * (kf > 0 ? 1 : 0));
    const L = GRP.map(([n, x, z], i) => man(n, at(x, z), { face: 'sad', mouth: 'sad', browTilt: -.5, turn: .1 * i }, { h: n === 'COL3' ? 1.25 : ADULT }));
    const ps = W.proj(V3(BX + 7.5, .3, 8.4)); return depth(L) + (kf > .7 ? puff(ps.x, ps.y, 80 * ps.ppm / 40, (t - tSe - .25) / .7) : '') + mosq(W.proj(V3(BX + 2, 4, 15)).x, W.proj(V3(BX + 2, 4, 15)).y, 60, 16, t, .7); }
  if (t < tMy) {   // al atardecer: enfermos bajo la palmera
    const u = t - t2, k = eIO(clamp(u / (tMy - t2))); cam(lerpV(V3(BX + 1.6, 1.6, 23.5), V3(BX + 1.6, 1.6, 21.8), k), V3(BX + 1.6, 1.5, 15), 40);
    const L = GRP.map(([n, x, z], i) => man(n, at(x, z), { face: i % 2 ? 'dizzy' : 'sad', mouth: i % 2 ? 'wavy' : 'sad', sick: .8, sweat: true, browTilt: -.5, lean: (i % 2 ? 6 : -5) + Math.sin(t * 1.5 + i) * 3, squash: .08, armR: [10, 10], armL: [10, 10] }, { h: n === 'COL3' ? 1.25 : ADULT }));
    return depth(L) + mosq(540, 820, 300, 18, t, .9); }
  // la mayoría no volvió: maletas abandonadas en la arena, olas
  const u = t - tMy, k = eIO(clamp(u / (D - tMy))); W.G.cases.visible = true; cam(lerpV(V3(BX + .6, 1.8, 22.4), V3(BX + .4, 2.0, 21.4), k), V3(BX + .2, .6, 15.4), 50);
  return ''; };

// =====================================================================================================
// 6 · PARÍS — MacGregor tomando café con el meñique levantado; años después, vuelve a Londres a vender más bonos; guiño a cámara
// =====================================================================================================
S.paris = (t, D, B) => { const t1 = B[1] ? B[1].s : D * .28, tVe = wt(B, 'paris', 1, 'vender') - .1, tSi = wt(B, 'paris', 1, 'si') - .1, tPa = wt(B, 'paris', 0, 'paris');
  whip(t, [t1, tVe, tSi]);
  if (t < t1) { setup(t, 'paris', 'paris', PARL); const X = W.PR;
    const k = eIO(clamp(t / t1)); cam(lerpV(V3(X + 4.2, 1.95, -19.2), V3(X + 3.8, 1.85, -21.4), k), V3(X + 3.5, 1.75, -26.2), 42);
    const wk = t > tPa - .05; const L = [man('MACG', at(X + 2.3, -25.6), { holdR: CUP, armR: [70, 120], armL: [20, 10], face: wk ? 'smug' : 'closed', mouth: wk ? 'smirk' : 'smile', wink: wk, blush: 1, turn: .3, sparkle: t * 3 }),
      man('GARCON', at(X + 4.6, -26.4), { holdR: TRAY, armR: [95, 80], face: 'happy', mouth: 'smile', turn: -.5, lean: -6 })];
    const q = W.proj(V3(X + 2.3, 3.5, -25.6)); return depth(L) + (wk ? sparkle(q.x + 60, q.y, 2 * Math.sin(Math.PI * clamp((t - tPa) / .6)), t * 200) : ''); }
  setup(t, 'london', 'londres', LONL); const X = W.LX;
  if (t < tVe) {   // vuelve a Londres: cruza la calle con el abanico de bonos
    const u = t - t1, k = eIO(clamp(u / (tVe - t1))); cam(lerpV(V3(X + 2.4, 1.8, 14.5), V3(X + 2, 1.9, 12), k), V3(X, 1.9, lerp(9, 6.5, k)), 42);
    const F = at(X + .3, lerp(10.6, 6.6, k)); return depth([man('MACG', F, Object.assign(walkPose(t * 7), { holdR: BFAN, armR: [100, 30], face: 'smug', mouth: 'grin', turn: .15, sparkle: t * 2 }))]); }
  if (t < tSi) {   // otra vez en el barril: bonos que vuelan y público con ojos de libra
    const u = t - tVe, k = eIO(clamp(u / (tSi - tVe))); rain3D(W.POOL.bonds, V3(X, 0, 5), t, tVe, 26, 10, 1.1); cam(lerpV(V3(X + 3.2, 2.2, 10), V3(X + 2.6, 2.4, 9), k), V3(X, 2.7, 3), 44);
    const L = [man('MACG', PODF(), { holdR: BFAN, armR: [150, 20], armL: [150, 20], face: 'stars', mouth: 'big', turn: .1 })];
    CROWD.forEach(([n, x, z], i) => L.push(man(n, at(x, z - .8), { face: i % 2 ? 'money' : 'stars', mouth: 'big', armR: [160, 10 + Math.sin(t * 9 + i) * 20], armL: [150, 20], bob: -Math.abs(Math.sin(t * 8 + i)) * 16, blush: 1, turn: -.2 })));
    return depth(L) + coins(540, -200, t, 12, 1, tVe); }
  // «si algo funciona, ¿para qué cambiarlo?»: primer plano, guiño a cámara y encogerse de hombros
  const u = t - tSi, k = eIO(clamp(u / (D - tSi))); cam(lerpV(V3(X + .35, 3.4, 5.6), V3(X + .25, 3.35, 4.9), k), V3(X, 3.2, 2), 32);
  const wk = u > .6; const L = [man('MACG', PODF(), { holdR: BFAN, armR: [60, -30], armL: [60, -30], face: wk ? 'smug' : 'open', mouth: wk ? 'smirk' : 'line', wink: wk, brows: .5, look: [0, 0], turn: 0, sparkle: t * 2 })];
  const q = W.proj(V3(X + .35, 3.5, 2)); return depth(L) + (wk ? sparkle(q.x + 40, q.y - 20, 2.4 * Math.sin(Math.PI * clamp((u - .6) / .7)), t * 200) : ''); };

// =====================================================================================================
// 7 · FINAL — los decorados de cartón se caen uno a uno (sin ciudades, sin gente, sin ópera);
//             en Londres, al atardecer, «BONOS AGOTADOS» y MacGregor riéndose encima de las bolsas de dinero
// =====================================================================================================
S.final = (t, D, B) => { const t1 = B[1] ? B[1].s : D * .36, tCi = wt(B, 'final', 0, 'ciudades'), tGe = wt(B, 'final', 0, 'gente'), tOp = wt(B, 'final', 0, 'opera'), tBo = wt(B, 'final', 1, 'bonos'), tVe = wt(B, 'final', 1, 'vendieron'), tTo = wt(B, 'final', 1, 'todos');
  const cA = tGe - .3, cB = tOp - .2; whip(t, [cA, cB, t1]);
  if (t < t1) { setup(t, 'city', 'poyais', DAYL);
    // tres planos bajos entre las palmeras y los decorados: cada edificio cae de espaldas en su palabra
    const sh = t < cA ? 0 : t < cB ? 1 : 2, a0 = [0, cA, cB][sh], a1 = [cA, cB, t1][sh], k = eIO(clamp((t - a0) / Math.max(.3, a1 - a0))), cx = [-21, -47, 11][sh], dz = [17, 15.5, 17][sh];
    W.SITES.city.children.forEach(c => { if (c.name === 'palm') c.visible = false; });   // fuera las palmeras de delante: tapaban los decorados al caer
    cam(V3(cx + 2 - 3 * k, 10.5 + k, dz + 3 - k), V3(cx, 3.8, -2.5), 64);
    const fall = (b, t0) => { const kk = clamp((t - t0) / .55); b.rotation.x = -Math.PI / 2 * (kk < 1 ? kk * kk : 1) + (kk >= 1 ? Math.sin((t - t0 - .55) * 18) * .04 * Math.exp(-(t - t0 - .55) * 5) : 0); return kk; };
    const ev = [[W.BLD.palace, tCi - .25], [W.BLD.parl, tCi + .05], [W.BLD.h1, tGe - .3], [W.BLD.h3, tGe - .1], [W.BLD.h2, tGe + .1], [W.BLD.h4, tGe + .15], [W.BLD.opera, tOp - .1], [W.BLD.cat, tOp + .12]];
    let s = ''; ev.forEach(([b, t0]) => { fall(b, t0); if (t > t0 + .5 && t < t0 + 1.4) { const p = W.proj(b.position.clone().add(V3(0, .3, -4))); s += puff(p.x, p.y, 120 * Math.min(2, p.ppm / 10), (t - t0 - .5) / .9); } });
    SHAKE = ev.some(([, t0]) => t > t0 + .5 && t < t0 + .75) ? .008 : 0; return s; }
  setup(t, 'london', 'tarde', DUSKL); const X = W.LX;
  const u = t - t1, k = eIO(clamp(u / (D - t1))), A = W.G.agotadoOn; A.visible = t > tBo - .1; A.scale.setScalar(eBack(clamp((t - tBo + .1) / .4)));
  cam(lerpV(V3(X + 1.6, 2.6, -11), V3(X + 2.2, 4.4, -5), k), lerpV(V3(X + 1.6, 3, -21), V3(X + 1.6, 3.4, -22), k), 46);
  // montaña de bolsas de dinero con MacGregor encima
  const bags = W.POOL.bags, pile = [[0, 0, 0], [-1, 0, .2], [1, 0, -.1], [-.5, 1.05, 0], [.5, 1.05, .1], [0, 2.05, 0], [-1.9, 0, .5], [1.9, 0, .4], [-1.4, 1, .4], [1.4, 1, .3]];
  bags.forEach((b, i) => { const [x, y, z] = pile[i]; b.visible = true; b.position.set(X + 3.2 + x, y, -19.4 + z); b.rotation.set(0, i * .7, 0); b.scale.setScalar(1); });
  rain3D(W.POOL.bonds, V3(X + 1.6, 0, -20.5), t, tVe - .3, 22, 8, .75);
  const top = V3(X + 3.2, 3.2, -19.4), lau = t > tVe - .1;
  const L = [man('MACG', top, { face: lau ? (t > tTo ? 'smug' : 'money') : 'happy', mouth: lau ? (t > tTo ? 'smirk' : 'laugh') : 'smile', wink: t > tTo + .2, holdR: BFAN, armR: [150 + Math.sin(t * 9) * 20, 20], armL: [140, 30], blush: 1, turn: .2, sparkle: t * 3 }, { gy: 2.6, shadow: false })];
  const q = W.proj(V3(X, 4.2, -22)); return depth(L) + coins(540, -200, t, 14, 1, tVe) + (t > tBo - .1 ? rays(q.x, q.y, 320, (t - tBo + .1) / .6, '#ffffff', 16) : ''); };
// dibuja el 3D después de que la escena haya colocado TODO (antes, lo que se movía tras cam() no salía: bolsas, cartel, edificios que caen)
Object.keys(S).forEach(k => { const f = S[k]; S[k] = (t, D, B) => { const r = f(t, D, B); W.render(); return r; }; });

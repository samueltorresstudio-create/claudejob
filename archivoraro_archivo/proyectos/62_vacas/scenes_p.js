// «Las vacas cebra» (62) — ESTILO 3D: world_kenji.js + personajes 2D (stick.js, cow2d.js). Sin voz (fake_voice), cámara siempre en movimiento.
// Reglas de movimiento (referencia «naranjas»): pies clavados, una acción concreta por plano ligada a la palabra, de pose a pose con cambios
// rápidos y respiración sutil; la mano y la brocha se resuelven con cinemática inversa (IK) para tocar de verdad la vaca o el cubo.
window.CFG = { capY: 1500, capSize: 96, transDur: .95, blurK: .55, antic: .3,
  trans: { apodo: 'fly', valla: 'fly', jirafa: 'swish', moja: 'swish', negra: 'fly', nosevan: 'swish', tercera: 'fly', mosca: 'whip', hambre: 'fly', normal: 'swish',
    negras: 'whip', cebra: 'whip', estampa: 'whip', como: 'swish', barberia: 'fly', giran: 'fly', engana: 'fly', cuenta: 'fly', olor: 'whip', manana: 'fly', brocha: 'swish' } };
const EVS = {
  hook: B => ({ pintando: B[0].w[5], cebra: B[0].w[8], negra: B[0].w[12] }), apodo: B => ({ llaman: B[0].w[4], kenji: B[0].w[5], rayas: B[0].w[7] }),
  valla: B => ({ apoya: B[0].w[3], mira: B[0].w[8], suelta: B[0].w[12] }), jirafa: B => ({ jirafa: B[0].w[2], cuando: B[0].w[4] }),
  moja: B => ({ gira: B[0].w[3], moja: B[0].w[4], brocha: B[0].w[6], sigue: B[0].w[8] }), negra: B => ({ negras: B[0].w[7], sobre: B[0].w[8], negra2: B[0].w[11] }),
  nosevan: B => ({ ven: B[0].w[2], cerca: B[0].w[5] }), tercera: B => ({ tercera: B[0].w[3], toca: B[0].w[6] }),
  mosca: B => ({ imagina: B[0].w[1], mosca: B[0].w[6], pican: B[0].w[11] }), hambre: B => ({ agosto: B[0].w[1], hambre: B[0].w[4] }),
  normal: B => ({ normal: B[0].w[3], aterrizas: B[0].w[5], ciento: B[0].w[11], moscas: B[0].w[13] }), negras: B => ({ negras: B[0].w[5], igual: B[0].w[6], once: B[0].w[8] }),
  cebra: B => ({ cebra: B[0].w[5], frenas: B[0].w[6], pasas: B[0].w[9], largo: B[0].w[11] }), estampa: B => ({ intentar: B[0].w[3], estampas: B[0].w[6], lomo: B[0].w[9] }),
  como: B => ({ como: B[0].w[0], posible: B[0].w[2] }), barberia: B => ({ palo: B[0].w[4], barberia: B[0].w[7] }),
  giran: B => ({ subir: B[0].w[3], realidad: B[0].w[6], giran: B[0].w[8] }), engana: B => ({ engañan: B[0].w[9], calcula: B[0].w[10], frena: B[0].w[14], tiempo: B[0].w[16] }),
  cuenta: B => ({ cuenta: B[0].w[2], cebra: B[0].w[6], cincuenta: B[0].w[8], seis: B[0].w[10], mitad: B[0].w[12] }), olor: B => ({ negras: B[0].w[3], olor: B[0].w[11], pintura: B[0].w[13] }),
  manana: B => ({ siguiente: B[0].w[2], vecino: B[0].w[4], apoyarse: B[0].w[7], valla: B[0].w[10] }), brocha: B => ({ oye: B[0].w[0], kenji: B[0].w[1], dejas: B[0].w[3], brocha: B[0].w[5] }),
};
const S = {}, W = W2, K = '#1b1720';
// cámara nunca quieta: deriva suave tipo «cámara en mano» encima de cada movimiento (el usuario: «que la cámara nunca esté quieta»)
{ const _setCam = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * .53) * .05 + Math.sin(T * 1.31) * .015, Math.sin(T * .71 + 1) * .035, Math.sin(T * .37 + 2) * .04);
  return _setCam(p.clone().add(d), l.clone().add(d.clone().multiplyScalar(.35)), f, fo, ap); }; }
const DAY = { tint: '#ffe2bd', k: .14, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.6 }, MORN = { tint: '#ffc8b0', k: .2, rim: '#ffe0c0', rimA: .55, rimX: 1, rimY: -.4 };
const hs = (a, b = 1) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const smo = x => x * x * (3 - 2 * x), k01 = (t, a, b) => smo(clamp((t - a) / (b - a)));
const blink = (t, ph = 0) => ((t + ph) % 3.4) < .1;
const rad = a => a * Math.PI / 180;
// ---------- reparto ----------
const MIX = { rich: true, eyeStyle: 'palo', legLen: 1.18 }, ADULT = 1.84;
const KENJI = Object.assign({}, MIX, { outfit: 'shirt', top: '#4a6a8a', topD: '#33506e', pants: '#3b4a63', belt: '#5a3a22', hat: 'tenugui', hatCol: '#2f4f8f', hair2: 'side', hairCol: '#1b1418', boots: '#e8e8e4', shoes: '#e8e8e4', sole: '#9aa3ad', paint: '#f6f3ec', splat: '#f6f3ec', face: 'smug', mouth: 'line', brushScale: .62 });
const VECINO = Object.assign({}, MIX, { outfit: 'flannel', top: '#c8443a', topD: '#8a2a24', line: '#f2c94c', tee: '#f4f2ec', cap: '#2f6a3a', capD: '#1f4a28', capLogo: '#ffd34a', hair2: 'capHair', hairCol: '#8a847c', mustache: '#9a948c', wrinkles: true, glasses: true, belly: 1.18, face: 'smug', mouth: 'smirk', boots: '#3a3e46', shoes: '#3a3e46', sole: '#15161c', legLen: 1.1 });
const OBA = Object.assign({}, MIX, { outfit: 'cardigan', top: '#8a5a9a', topD: '#5e3a6e', shirt: '#f0e6d6', hair2: 'curly', hairCol: '#d9d6cf', glasses: true, wrinkles: true, face: 'smug', mouth: 'smirk', belly: 1.08, shoes: '#3a2e28', sole: '#3a2e28', legLen: 1.05 });
const CHICO = Object.assign({}, MIX, { outfit: 'hood', top: '#3f8a9a', topD: '#2a6a7a', hair2: 'messy', hairCol: '#1b1418', face: 'happy', mouth: 'laugh', shoes: '#f4f2ec', sole: '#e94b3c' });
// posiciones fijas
const COW1 = V3(-3.0, 0, -8.0), COW2 = V3(2.6, 0, -10.5), COW3 = V3(-1.0, 0, -12.8);
const KP = V3(-3.95, 0, -6.9), KP2 = V3(1.6, 0, -9.35), NB = V3(1.4, 0, -.35), RAIL = V3(-.45, 1.22, -1.0);
const XS = [-318, -262, -200, -140, -78, -16, 46, 104, 160, 214];
// ---------- transformaciones 2D (las mismas que stickAt / cowAt) ----------
function frameOf(F, h) { const pf = W.proj(F), pt = W.proj(V3(F.x, F.y + h, F.z)), dx = pt.x - pf.x, dy = pt.y - pf.y, L = Math.hypot(dx, dy); return { x: pf.x, y: pf.y, s: L / 462, r: Math.atan2(dx, -dy), ok: pf.ok && pt.ok }; }
const rot2 = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
function toScr(fr, x, y, fl = 1, lean = 0) { let [a, b] = rot2(x, y, rad(lean)); [a, b] = rot2(a * fr.s * fl, b * fr.s, fr.r); return [fr.x + a, fr.y + b]; }
function toLoc(fr, X, Y, fl = 1, lean = 0) { let [a, b] = rot2(X - fr.x, Y - fr.y, -fr.r); a /= fr.s * fl; b /= fr.s; return rot2(a, b, -rad(lean)); }
// IK del brazo (sd = 1 derecho, -1 izquierdo) para que la punta de la brocha (o la mano) llegue al objetivo (coordenadas locales del personaje)
function armIK(sd, T, o = {}) { const bob = o.bob || 0, Sx = sd * 44, Sy = -360 + bob, Lb = (o.brush ? 196 * (o.brushScale || 1) : 0), th = rad(o.brushRot || 0);
  let Hx = T[0] - Lb * Math.sin(th), Hy = T[1] + Lb * Math.cos(th); let vx = Hx - Sx, vy = Hy - Sy, d = Math.hypot(vx, vy); const dc = clamp(d, 30, 174); vx *= dc / d; vy *= dc / d; d = dc; Hx = Sx + vx; Hy = Sy + vy;
  const phi = Math.atan2(vx, vy), al = Math.acos(clamp((90 * 90 + d * d - 86 * 86) / (2 * 90 * d), -1, 1)); let best = null;
  [phi + al, phi - al].forEach(a1 => { const ex = Sx + Math.sin(a1) * 90, ey = Sy + Math.cos(a1) * 90; if (!best || ey > best.ey + (o.elbowUp ? -1e3 : 0) * 0) { if (!best || (o.elbowUp ? ey < best.ey : ey > best.ey)) best = { a1, ex, ey }; } });
  const a2 = Math.atan2(Hx - best.ex, Hy - best.ey) - best.a1, deg = x => x * 180 / Math.PI;
  return { arm: [deg(best.a1) * sd, deg(a2) * sd], tip: [Hx + Lb * Math.sin(th), Hy - Lb * Math.cos(th)], hand: [Hx, Hy] }; }
// ---------- personajes ----------
const who = (base, o, F, h = ADULT, opt) => stickAt(Object.assign({}, base, o), F, V3(F.x, F.y + h, F.z), W, opt);
const breathe = (t, ph = 0) => ({ bob: Math.sin(t * 2.1 + ph) * 3, headTilt: Math.sin(t * .9 + ph) * 1.2 });
const talk = (t, on) => on ? (Math.sin(t * 34) > -.1 ? 'open' : 'smirk') : null;
function cowLife(t, ph, o = {}) { return Object.assign({ chew: .5 + .5 * Math.sin(t * 5.5 + ph), tail: Math.sin(t * 1.1 + ph) * .25, headTilt: Math.sin(t * .8 + ph) * 2, eyes: blink(t, ph) ? 'closed' : 'lid' }, o); }
const cow = (o, F, face, opt = {}) => cowAt(o, F, W, Object.assign({ face }, opt));
// pintura de la vaca 1 y 2 según el momento del vídeo
const COW1_DONE = { stripes: 'white', tag: '01' }, COW2_DONE = { stripes: 'black', tag: '02' }, COW3O = { tag: '03' };
// barras de la valla delantera dibujadas en 2D (el 2D queda siempre encima del 3D)
function rails2d(x0, x1, z = -1) { let s = ''; const q = (x, y) => W.proj(V3(x, y, z));
  [.55, 1.15].forEach(y => { const a = q(x0, y + .07), b = q(x1, y + .07), c = q(x1, y - .07), d = q(x0, y - .07); if (!a.ok || !b.ok) return; s += `<path d="M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y} L${d.x},${d.y}Z" fill="#9a6c40" stroke="${K}" stroke-width="${Math.max(2, a.ppm * .02).toFixed(1)}" stroke-linejoin="round"/><path d="M${a.x},${a.y + 2} L${b.x},${b.y + 2}" stroke="#c99a6a" stroke-width="${Math.max(1.5, a.ppm * .012).toFixed(1)}"/>`; });
  for (let i = 0; i <= 10; i++) { const x = -11 + i * 2.2; if (x < x0 - .3 || x > x1 + .3) continue; const a = q(x - .1, 1.5), b = q(x + .1, 1.5), c = q(x + .1, 0), d = q(x - .1, 0); if (!a.ok) continue; s += `<path d="M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y} L${d.x},${d.y}Z" fill="#b08a60" stroke="${K}" stroke-width="${Math.max(2, a.ppm * .02).toFixed(1)}"/>`; } return s; }
// brazos del vecino apoyados en la barra de arriba (encima de la barra); sides: 'both' | 'left'
function leanArms(F, sides = 'both', bob = 0) { const fr = frameOf(F, 1.84), r = W.proj(V3(F.x, 1.22, -1.0)); if (!fr.ok || !r.ok) return ''; const s = fr.s, cx = fr.x, SHy = fr.y + (-360 + bob) * s, Ry = r.y; let o = '';
  [-1, 1].forEach(sd => { if (sides === 'left' && sd > 0) return; const sx = cx + sd * 44 * s, ex = cx + sd * 98 * s, hx = cx + sd * 26 * s;
    o += `<path d="M${sx},${SHy} Q${cx + sd * 92 * s},${(SHy + Ry) / 2} ${ex},${Ry - 4 * s}" stroke="${K}" stroke-width="${10 * s}" fill="none" stroke-linecap="round"/><path d="M${ex},${Ry - 4 * s} L${hx},${Ry - 9 * s}" stroke="${K}" stroke-width="${10 * s}" stroke-linecap="round"/><ellipse cx="${hx}" cy="${Ry - 9 * s}" rx="${13 * s}" ry="${11 * s}" fill="${K}"/>`; }); return o; }
// brazo derecho del vecino estirado por encima de la valla, palma arriba («¿me dejas la brocha?»)
function askArm(F, k, bob = 0) { if (k <= 0) return ''; const fr = frameOf(F, 1.84), s = fr.s, sx = fr.x + 44 * s, sy = fr.y + (-360 + bob) * s, ex = sx + lerp(40, 70, k) * s, ey = sy + lerp(80, 50, k) * s, hx = sx + lerp(60, 150, k) * s, hy = sy + lerp(140, 40, k) * s;
  return `<path d="M${sx},${sy} Q${ex + 10 * s},${ey} ${hx},${hy}" stroke="${K}" stroke-width="${10 * s}" fill="none" stroke-linecap="round"/><g transform="translate(${hx},${hy}) scale(${s})"><path d="M-14,-4 Q-18,12 2,14 Q22,14 24,0 L30,-10 Q26,-14 20,-8 Z" fill="${K}"/><path d="M-12,-6 l-6,-14 M-2,-8 l-2,-16 M8,-8 l2,-16" stroke="${K}" stroke-width="7" stroke-linecap="round"/></g>`; }
// ---------- moscas ----------
function fly1(x, y, sc, ang, t, landed, k = 0) { const fl = landed ? 0 : Math.sin(t * 90 + k * 3) * 38, wa = landed ? 18 : 0;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(0)}) scale(${sc.toFixed(3)})">` + (landed ? '' : `<ellipse cx="-4" cy="-10" rx="14" ry="7" fill="#e6f2ff" fill-opacity=".35" transform="rotate(${-30 - fl} -2 -2)"/><ellipse cx="-4" cy="10" rx="14" ry="7" fill="#e6f2ff" fill-opacity=".35" transform="rotate(${30 + fl} -2 2)"/>`) +
    `<ellipse cx="-6" cy="-8" rx="12" ry="6" fill="#e6f2ff" fill-opacity=".85" stroke="${K}" stroke-width="2.5" transform="rotate(${wa - 24 - fl * .6} -2 -2)"/><ellipse cx="-6" cy="8" rx="12" ry="6" fill="#e6f2ff" fill-opacity=".85" stroke="${K}" stroke-width="2.5" transform="rotate(${-wa + 24 + fl * .6} -2 2)"/>` +
    `<ellipse cx="0" cy="0" rx="12" ry="6.5" fill="#4a4650" stroke="${K}" stroke-width="3"/><path d="M-5,-6 L-5,6 M1,-6 L1,6" stroke="#7a7680" stroke-width="2"/><circle cx="12" cy="0" r="5.5" fill="#2a2630" stroke="${K}" stroke-width="2.5"/><circle cx="14" cy="-3" r="2.8" fill="#c8302e"/><circle cx="14" cy="3" r="2.8" fill="#c8302e"/></g>`; }
// moscas que llegan volando y se posan en una vaca (pts en coordenadas locales de la vaca)
function bodyPts(n, seed) { const a = []; let k = 0; while (a.length < n && k < n * 20) { const x = -330 + hs(k, seed) * 580, y = -440 + hs(k + 500, seed) * 260; k++; if (((x + 40) / 285) ** 2 + ((y + 312) / 112) ** 2 < .9) a.push([x, y, hs(k, seed + 7) * 360]); } return a; }
function landing(fr, fl, pts, t, t0, span, sc, o = {}) { let s = ''; pts.forEach(([x, y, a], i) => { const ta = t0 + (i / pts.length) * span + hs(i, 3) * .25, k = (t - (ta - .55)) / .55; if (k < 0) return;
  const [X1, Y1] = toScr(fr, x, y, fl); if (k >= 1) { const jx = Math.sin(t * 3 + i) * 1.2, jy = Math.cos(t * 2.3 + i) * 1.2; s += fly1(X1 + jx, Y1 + jy, sc, a + Math.sin(t + i) * 10, t, true); return; }
  const dir = hs(i, 9) * Math.PI * 2, R = 700 * fr.s, X0 = X1 + Math.cos(dir) * R, Y0 = Y1 - Math.abs(Math.sin(dir)) * R * .8 - 120 * fr.s, e = eOut(k);
  const X = lerp(X0, X1, e) + Math.sin(k * 9 + i) * 18 * (1 - k), Y = lerp(Y0, Y1, e) - Math.sin(k * Math.PI) * 60 * fr.s; s += fly1(X, Y, sc, Math.atan2(Y1 - Y0, X1 - X0) * 180 / Math.PI, t, false, i); }); return s; }
// moscas revoloteando alrededor de un punto
function buzz(cx, cy, n, R, sc, t, seed = 1) { let s = ''; for (let i = 0; i < n; i++) { const a = t * (1.6 + hs(i, seed) * 1.8) + i * 2.1, r = R * (.5 + hs(i, seed + 2) * .6), x = cx + Math.cos(a) * r, y = cy + Math.sin(a * 1.3) * r * .55; s += fly1(x, y, sc, (a + Math.PI / 2) * 180 / Math.PI, t, false, i); } return s; }
// la mosca protagonista («tú»): ojos rojos con párpado, pelillos, trompa; o.eye: 'lid'|'wide'|'spiral'|'squint'; o.legs: 'tuck'|'out'|'rub'; o.squash
function bigFly(x, y, sc, t, o = {}) { const fl = o.landed ? 0 : Math.sin(t * 70) * 1, sq = o.squash || 0, eye = o.eye || 'lid', id = 'bf' + Math.round(hs(x, y) * 1e6);
  let s = `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(o.rot || 0).toFixed(1)}) scale(${(sc * (1 + sq * .35)).toFixed(3)},${(sc * (1 - sq * .45)).toFixed(3)})">`;
  if (!o.landed) { for (let k = 0; k < 3; k++) { const a = -50 + fl * 30 + k * 18; s += `<ellipse cx="-30" cy="-70" rx="78" ry="30" fill="#e6f2ff" fill-opacity="${.16 - k * .04}" transform="rotate(${a} 0 -20)"/><ellipse cx="30" cy="-70" rx="78" ry="30" fill="#e6f2ff" fill-opacity="${.16 - k * .04}" transform="rotate(${-a} 0 -20)"/>`; } }
  const wa = o.landed ? 64 : 40 + fl * 26;
  s += `<ellipse cx="-58" cy="-48" rx="74" ry="28" fill="#eef6ff" fill-opacity=".8" stroke="${K}" stroke-width="5" transform="rotate(${-wa} -6 -20)"/><path d="M-110,-48 L-20,-46 M-90,-60 L-40,-34" stroke="#9ab" stroke-width="2.5" transform="rotate(${-wa} -6 -20)"/>`;
  // patas
  const legs = o.legs || 'tuck', lk = (x0, y0, x1, y1, x2, y2) => `<path d="M${x0},${y0} L${x1},${y1} L${x2},${y2}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (legs === 'out') s += lk(-24, 30, -60, 60, -70, 96) + lk(0, 34, -6, 76, -10, 108) + lk(24, 30, 50, 66, 64, 98);
  else if (legs === 'rub') { const r = Math.sin(t * 22) * 10; s += lk(-24, 30, -50, 56, -62, 82) + lk(0, 34, 0, 70, -4, 96) + lk(28, 20, 58 + r, 40, 46 - r, 60) + lk(30, 26, 54 - r, 52, 40 + r, 66); }
  else s += lk(-24, 30, -44, 50, -60, 58) + lk(0, 34, -4, 56, -18, 66) + lk(24, 30, 36, 52, 26, 64);
  // cuerpo: abdomen a cuadros, tórax con rayas y pelillos
  s += `<defs><clipPath id="${id}a"><ellipse cx="-62" cy="8" rx="64" ry="42"/></clipPath></defs><ellipse cx="-62" cy="8" rx="64" ry="42" fill="#7a7480" stroke="${K}" stroke-width="7"/><g clip-path="url(#${id}a)">${[-110, -86, -62, -38, -14].map((xx, i) => `<rect x="${xx}" y="${i % 2 ? -36 : -12}" width="22" height="24" fill="#3a3640"/><rect x="${xx}" y="${i % 2 ? 12 : 36}" width="22" height="24" fill="#3a3640"/>`).join('')}<ellipse cx="-80" cy="-14" rx="36" ry="12" fill="#fff" opacity=".18"/></g>`;
  s += `<ellipse cx="6" cy="-2" rx="42" ry="40" fill="#5a5660" stroke="${K}" stroke-width="7"/><path d="M-10,-38 L-10,34 M12,-38 L12,36" stroke="#2a2630" stroke-width="7"/>` + [[-20, -40], [0, -44], [22, -40], [34, -24]].map(([a, b]) => `<path d="M${a},${b} l${(a > 0 ? 4 : -2)},-12" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`).join('');
  s += `<ellipse cx="-58" cy="-48" rx="74" ry="28" fill="#eef6ff" fill-opacity=".55" stroke="${K}" stroke-width="5" transform="rotate(${wa - 8} 6 -20) scale(-1,1) translate(-12,0)"/>`;
  // cabeza
  s += `<g transform="translate(64,-6)"><circle r="40" fill="#3a3640" stroke="${K}" stroke-width="7"/><path d="M30,14 L82,30 L30,26Z" fill="#2a2630" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`;
  [[-2, -16, 30], [20, 10, 24]].forEach(([ex, ey, r], k) => { const cid = id + 'e' + k; s += `<defs><clipPath id="${cid}"><circle cx="${ex}" cy="${ey}" r="${r}"/></clipPath></defs><circle cx="${ex}" cy="${ey}" r="${r}" fill="#c8302e"/><g clip-path="url(#${cid})">` +
    Array.from({ length: 5 }, (_, i) => `<path d="M${ex - r},${ey - r + i * r * .45} L${ex + r},${ey - r + i * r * .45 + r * .2}" stroke="#a81e1e" stroke-width="2.5"/>`).join('') + `<circle cx="${ex - r * .35}" cy="${ey - r * .4}" r="${r * .3}" fill="#fff" opacity=".7"/>`;
    if (eye === 'lid' || eye === 'squint') s += `<rect x="${ex - r - 4}" y="${ey - r - 6}" width="${r * 2 + 8}" height="${r * (eye === 'squint' ? 1.25 : .85) + 6}" fill="#3a3640"/></g><line x1="${ex - r - 4}" y1="${ey - r * (eye === 'squint' ? -.25 : .15)}" x2="${ex + r + 4}" y2="${ey - r * (eye === 'squint' ? -.25 : .15)}" stroke="${K}" stroke-width="6" stroke-linecap="round"/>`;
    else if (eye === 'spiral') s += `<path d="M${ex},${ey} m-3,0 a3,3 0 1 1 6,0 a7,7 0 1 1 -14,0 a11,11 0 1 1 22,0 a15,15 0 1 1 -30,0" fill="none" stroke="#fff" stroke-width="3.5" transform="rotate(${t * 400} ${ex} ${ey})"/></g>`;
    else s += `<circle cx="${ex + 4}" cy="${ey + 2}" r="${r * .28}" fill="${K}"/></g>`;
    s += `<circle cx="${ex}" cy="${ey}" r="${r}" fill="none" stroke="${K}" stroke-width="6"/>`; });
  s += [[-6, -50, -20, -66], [12, -48, 22, -66]].map(([a, b, c, d]) => `<path d="M${a},${b} Q${(a + c) / 2 - 6},${d + 6} ${c},${d}" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('') + `</g></g>`;
  return s; }
function speedLines(t, n = 20, a = .55, dir = -1) { let s = ''; for (let i = 0; i < n; i++) { const y = hs(i, 7) * 1920, x = ((hs(i, 8) * 1600 + dir * t * 3000 * (1 + hs(i, 9))) % 1600 + 1600) % 1600 - 260; s += `<path d="M${x.toFixed(0)},${y.toFixed(0)} l${(220 + hs(i, 4) * 260).toFixed(0)},0" stroke="#fff" stroke-opacity="${a}" stroke-width="${(3 + hs(i, 5) * 5).toFixed(1)}" stroke-linecap="round"/>`; } return s; }
function stars(x, y, r, t, n = 4, sc = 1) { let s = ''; for (let i = 0; i < n; i++) { const a = t * 4 + i / n * Math.PI * 2, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * .35; s += `<g transform="translate(${px.toFixed(1)},${py.toFixed(1)}) scale(${(sc * (.8 + .3 * Math.sin(a))).toFixed(2)}) rotate(${(t * 200 + i * 40).toFixed(0)})"><path d="M0,-18 L5,-5 L18,-5 L8,3 L12,17 L0,8 L-12,17 L-8,3 L-18,-5 L-5,-5Z" fill="#ffd34a" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/></g>`; } return s; }
function impact(x, y, r, k) { if (k <= 0 || k >= 1) return ''; const e = eOut(k); let s = `<g opacity="${(1 - k).toFixed(2)}"><path d="${Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2, rr = r * (i % 2 ? .45 : 1) * (.5 + e * .7); return (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ',' + (y + Math.sin(a) * rr).toFixed(1); }).join(' ')}Z" fill="#ffd34a" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>`;
  s += `<path d="${Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2, rr = r * .55 * (i % 2 ? .45 : 1) * (.5 + e * .7); return (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ',' + (y + Math.sin(a) * rr).toFixed(1); }).join(' ')}Z" fill="#fff6c8"/></g>`; return s; }
// contador de mano (clicker) con 4 dígitos; dígito de las unidades rueda al pulsar
function clicker(x, y, sc, n, press = 0) { const d = String(Math.floor(n)).padStart(4, '0'), fr = n - Math.floor(n);
  let s = `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)})"><circle cx="0" cy="96" r="34" fill="none" stroke="#9aa3ad" stroke-width="14"/><circle cx="0" cy="96" r="34" fill="none" stroke="${K}" stroke-width="4" opacity=".5"/>`;
  s += `<rect x="-26" y="${-118 + press * 14}" width="52" height="44" rx="10" fill="#c9ced6" stroke="${K}" stroke-width="7"/><rect x="-14" y="${-108 + press * 14}" width="28" height="10" rx="4" fill="#fff" opacity=".6"/>`;
  s += `<rect x="-92" y="-80" width="184" height="160" rx="54" fill="#dfe3e8" stroke="${K}" stroke-width="9"/><path d="M-70,-50 Q0,-74 70,-50" stroke="#fff" stroke-width="10" fill="none" opacity=".7" stroke-linecap="round"/><rect x="-74" y="-30" width="148" height="60" rx="8" fill="#1b1720"/>`;
  for (let i = 0; i < 4; i++) { const cx = -55 + i * 37, last = i === 3; s += `<rect x="${cx - 15}" y="-24" width="30" height="48" rx="4" fill="#f6f3ec"/>`;
    s += `<text x="${cx}" y="${14 - (last ? fr * 40 : 0)}" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="38" fill="${K}">${d[i]}</text>`;
    if (last && fr > 0) s += `<text x="${cx}" y="${54 - fr * 40}" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="38" fill="${K}">${(+d[3] + 1) % 10}</text>`; }
  s += `<rect x="-74" y="-30" width="148" height="12" fill="#1b1720"/><rect x="-74" y="18" width="148" height="12" fill="#1b1720"/><rect x="-74" y="-30" width="148" height="60" rx="8" fill="none" stroke="${K}" stroke-width="6"/></g>`; return s; }
// termómetro de esfera (como el reloj-termómetro de la referencia)
function thermo(x, y, sc, deg) { const a = rad(-135 + (deg - 0) / 50 * 270); let s = `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)})"><rect x="-70" y="-80" width="140" height="190" rx="18" fill="#a07a56" stroke="${K}" stroke-width="7"/><circle cx="0" cy="0" r="60" fill="#f6efe0" stroke="#c8a13a" stroke-width="10"/>`;
  for (let i = 0; i <= 10; i++) { const b = rad(-135 + i * 27); s += `<path d="M${Math.sin(b) * 44},${-Math.cos(b) * 44} L${Math.sin(b) * 52},${-Math.cos(b) * 52}" stroke="${i > 6 ? '#d23a32' : K}" stroke-width="${i % 5 ? 3 : 5}"/>`; }
  s += `<path d="M${Math.sin(rad(54)) * 30},${-Math.cos(rad(54)) * 30} A30 30 0 0 1 ${Math.sin(rad(135)) * 30},${-Math.cos(rad(135)) * 30}" stroke="#d23a32" stroke-width="6" fill="none" opacity=".6"/>`;
  s += `<path d="M0,0 L${Math.sin(a) * 46},${-Math.cos(a) * 46}" stroke="${K}" stroke-width="6" stroke-linecap="round"/><circle r="8" fill="${K}"/><text x="0" y="34" text-anchor="middle" font-family="Inter" font-weight="900" font-size="20" fill="${K}">°C</text>`;
  s += `<rect x="-14" y="70" width="28" height="30" rx="6" fill="#d23a32" stroke="${K}" stroke-width="5"/></g>`; return s; }
// cubo de pintura en 2D (para que la brocha entre de verdad: pared trasera, pintura, [brocha], pared delantera)
function bucketBack(x, y, sc, paint) { return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)})"><ellipse cx="0" cy="-120" rx="70" ry="20" fill="#9aa3ad" stroke="${K}" stroke-width="7"/><ellipse cx="0" cy="-114" rx="62" ry="15" fill="${paint}"/><ellipse cx="-18" cy="-118" rx="22" ry="5" fill="#fff" opacity="${paint === '#0c090b' ? .25 : .5}"/></g>`; }
function bucketFront(x, y, sc, paint, label) { return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)})"><path d="M-70,-120 L-58,0 Q0,16 58,0 L70,-120 Q0,-100 -70,-120Z" fill="#c9ced6" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M-66,-80 L-60,-30 Q0,-16 60,-30 L66,-80 Q0,-62 -66,-80Z" fill="${label}"/>` +
  `<path d="M-50,-112 q-3,26 3,34 q7,-6 2,-34Z M30,-110 q-3,18 3,24 q6,-5 1,-24Z" fill="${paint}"/><path d="M-62,-110 Q-56,-50 -52,-10" stroke="#fff" stroke-width="6" opacity=".5" fill="none" stroke-linecap="round"/><path d="M-70,-120 Q0,-160 70,-120" stroke="#5a5e66" stroke-width="6" fill="none"/></g>`; }
function smell(x, y, sc, t) { let s = ''; for (let i = 0; i < 3; i++) { const k = ((t * .7 + i / 3) % 1), yy = y - k * 260 * sc, xx = x + (i - 1) * 40 * sc; s += `<path d="M${xx},${yy} q${18 * sc},${-30 * sc} 0,${-60 * sc} q${-18 * sc},${-30 * sc} 0,${-60 * sc}" stroke="#7fb04a" stroke-width="${8 * sc}" fill="none" stroke-linecap="round" opacity="${(Math.sin(k * Math.PI) * .9).toFixed(2)}"/>`; } return s; }
// flecha bien hecha (la misma de las palomas): curva suave, contorno de tinta, punta alineada con la tangente
function arrow(A, C, B, k, col = YEL, w = 26) { if (k <= 0) return ''; k = clamp(k); const q = (t) => [(1 - t) * (1 - t) * A[0] + 2 * (1 - t) * t * C[0] + t * t * B[0], (1 - t) * (1 - t) * A[1] + 2 * (1 - t) * t * C[1] + t * t * B[1]];
  const e = eOut(k), N = 24, pts = []; for (let i = 0; i <= N; i++) pts.push(q(i / N * e)); const E = pts[N], Pm = q(Math.max(0, e - .04)), ang = Math.atan2(E[1] - Pm[1], E[0] - Pm[0]), hl = w * 2.1, hw = w * 1.5;
  const base = [E[0] - Math.cos(ang) * hl * .75, E[1] - Math.sin(ang) * hl * .75], d = 'M' + pts.slice(0, N - 1).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ` L${base[0].toFixed(1)},${base[1].toFixed(1)}`;
  const tip = [E[0] + Math.cos(ang) * hl * .25, E[1] + Math.sin(ang) * hl * .25], l = [base[0] + Math.cos(ang + Math.PI / 2) * hw, base[1] + Math.sin(ang + Math.PI / 2) * hw], r = [base[0] - Math.cos(ang + Math.PI / 2) * hw, base[1] - Math.sin(ang + Math.PI / 2) * hw];
  const head = `M${tip[0].toFixed(1)},${tip[1].toFixed(1)} L${l[0].toFixed(1)},${l[1].toFixed(1)} L${r[0].toFixed(1)},${r[1].toFixed(1)}Z`;
  return `<g opacity="${clamp(k * 4).toFixed(2)}"><path d="${d}" stroke="${K}" stroke-width="${w + 14}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${head}" fill="${K}" stroke="${K}" stroke-width="14" stroke-linejoin="round"/><path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${head}" fill="${col}"/></g>`; }
function arrowUp(x, y0, y1, k, t, w = 24) { if (k <= 0) return ''; return arrow([x, y0], [x + Math.abs(y1 - y0) * .12, (y0 + y1) / 2], [x, y1], k, '#ffffff', w); }
function arrowSpin(x, y, rx, ry, k, t) { if (k <= 0) return ''; const a0 = t * 3, sw = Math.PI * 1.5 * eOut(clamp(k)), pts = []; for (let i = 0; i <= 30; i++) { const a = a0 + sw * i / 30; pts.push([x + Math.cos(a) * rx, y + Math.sin(a) * ry]); }
  const [ax, ay] = pts[30], [bx, by] = pts[28], ang = Math.atan2(ay - by, ax - bx), d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L'), hl = 44, hw = 30;
  const tip = [ax + Math.cos(ang) * hl * .3, ay + Math.sin(ang) * hl * .3], base = [ax - Math.cos(ang) * hl * .7, ay - Math.sin(ang) * hl * .7], l = [base[0] + Math.cos(ang + Math.PI / 2) * hw, base[1] + Math.sin(ang + Math.PI / 2) * hw], r = [base[0] - Math.cos(ang + Math.PI / 2) * hw, base[1] - Math.sin(ang + Math.PI / 2) * hw];
  const head = `M${tip[0].toFixed(1)},${tip[1].toFixed(1)} L${l[0].toFixed(1)},${l[1].toFixed(1)} L${r[0].toFixed(1)},${r[1].toFixed(1)}Z`;
  return `<g opacity="${clamp(k * 3).toFixed(2)}"><path d="${d}" stroke="${K}" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${head}" fill="${K}" stroke="${K}" stroke-width="14" stroke-linejoin="round"/><path d="${d}" stroke="#ffd34a" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${head}" fill="#ffd34a"/></g>`; }
function crossX(x, y, k) { if (k <= 0) return ''; const sc = .6 + .4 * eBack(clamp(k)); return `<g transform="translate(${x},${y}) scale(${sc.toFixed(2)})" opacity="${clamp(k * 3).toFixed(2)}"><path d="M-40,-40 L40,40 M40,-40 L-40,40" stroke="${K}" stroke-width="30" stroke-linecap="round"/><path d="M-40,-40 L40,40 M40,-40 L-40,40" stroke="#ff4f5a" stroke-width="18" stroke-linecap="round"/></g>`; }
const byDist = (L) => L.sort((a, b) => b.p.distanceTo(W.camera.position) - a.p.distanceTo(W.camera.position)).map(o => o.f()).join('');
function setup(T, mood = 0) { W.setTime(T); W.setMood(mood); W.charLight = mood ? MORN : DAY; }
// ---------- Kenji pintando una vaca: la punta de la brocha sigue la raya y la raya nace donde pasa la brocha ----------
// strokes: [{x, t0, t1}] en coordenadas de la vaca; devuelve { kenji, fresh } para dibujarlos en orden
function paintAction(t, KF, CF, cface, strokes, base, o = {}) { const cfl = cface === 'left' ? -1 : 1, sd = o.hand === 'L' ? -1 : 1, br = breathe(t, 1), lean = (o.lean || 0) + Math.sin(t * 1.3) * 1;
  const kfr = frameOf(KF, ADULT), cfr = frameOf(CF, 1.45); let fresh = [], tipC = null, active = null;
  strokes.forEach(st => { if (t >= st.t0) { const k = smo(clamp((t - st.t0) / (st.t1 - st.t0))); if (t <= st.t1 + .25) active = { st, k }; fresh.push({ x: st.x, k }); } });
  // objetivo de la punta: arriba de la raya → abajo (mientras pinta), o descanso entre rayas
  let tgtC; if (active && t <= active.st.t1) tgtC = [active.st.x + 13, lerp(-438, -204, active.k)];
  else if (active) { const k = clamp((t - active.st.t1) / .25); tgtC = [active.st.x + 13 + 20 * k, lerp(-204, -300, smo(k))]; }
  else tgtC = [strokes[0].x + 13, -440 - 30];
  const nxt = strokes.find(st => st.t0 > t); if (nxt && (!active || t > active.st.t1 + .25)) { const prev = strokes.filter(st => st.t1 < t).pop(); const a0 = prev ? prev.t1 + .25 : -1, k = smo(clamp((t - a0) / Math.max(.05, nxt.t0 - a0)));
    const from = prev ? [prev.x + 33, -300] : [nxt.x + 13, -470]; tgtC = [lerp(from[0], nxt.x + 13, k), lerp(from[1], -440, k) - Math.sin(k * Math.PI) * 40]; }
  const [TX, TY] = toScr(cfr, tgtC[0], tgtC[1], cfl), T = toLoc(kfr, TX, TY, 1, lean);
  const ik = armIK(sd, T, { brush: true, brushScale: KENJI.brushScale, brushRot: o.brushRot ?? (sd > 0 ? 70 : -70), bob: br.bob });
  const [AX, AY] = toScr(kfr, ik.tip[0], ik.tip[1], 1, lean), tipCow = toLoc(cfr, AX, AY, cfl);
  fresh = fresh.map(f => ({ x: f.x, w: 26, y1: f === fresh[fresh.length - 1] && active && t <= active.st.t1 ? Math.max(-448, Math.min(tipCow[1], -200)) : -196 }));
  const pose = Object.assign({}, base, br, { lean, prop: 'brush', brushHand: sd < 0 ? 'L' : 'R', brushRot: o.brushRot ?? (sd > 0 ? 70 : -70), look: o.look || [sd * 10, 2] });
  if (sd > 0) pose.armR = ik.arm; else pose.armL = ik.arm; if (blink(t, 2)) pose.face = 'closed';
  return { kenji: who(KENJI, pose, KF), fresh, tip: [AX, AY] }; }
// =====================================================================================================  ESCENAS
// 1 · gancho: la brocha deja una raya blanca y la cámara se abre: un granjero pintando una vaca negra de cebra
S.hook = (t, D, B) => { const E = EVS.hook(B); setup(window.__T || t);
  const k = k01(t, 0, 2.2), cp = L3(V3(-3.05, 1.12, -5.85), V3(-2.6, 1.35, -1.6), k), cl = L3(V3(-3.0, 1.12, -8), V3(-3.1, .98, -8), k);
  W.setCam(cp.add(V3(0, 0, -t * .08)), cl, lerp(36, 46, k), cp.distanceTo(cl), .004); W.render();
  const strokes = [{ x: -16, t0: .05, t1: 1.05 }, { x: 46, t0: 1.55, t1: 2.45 }, { x: 104, t0: 2.95, t1: 3.85 }];
  const pa = paintAction(t, KP, COW1, 'right', strokes, {}, { lean: 3 });
  const cw = cow(cowLife(t, 0, { stripes: 'white', wet: true, paintTo: -60, tag: '01', fresh: pa.fresh, headTurn: -.2 }), COW1, 'right');
  return cw + pa.kenji + (t < .9 ? `<circle cx="${pa.tip[0]}" cy="${pa.tip[1]}" r="0"/>` : ''); };
// 2 · el pueblo: dos vecinos en la carretera señalan la granja («Kenji el Rayas»)
S.apodo = (t, D, B) => { const E = EVS.apodo(B); setup(window.__T || t);
  const cp = V3(8.4 - t * .25, 2.1 + t * .04, 19.6 - t * .3), cl = V3(6.9, 1.2, 6.5); W.setCam(cp, cl, 46, 7.5, .0016); W.render();
  const pts = k01(t, E.llaman - .12, E.llaman), ri = k01(t, E.rayas - .1, E.rayas);
  let back = cow(cowLife(t, 0, COW1_DONE), COW1, 'right') + cow(cowLife(t, 1, { tag: '02' }), COW2, 'right') + cow(cowLife(t, 2, COW3O), COW3, 'right') + who(KENJI, Object.assign(breathe(t), { prop: 'brush', brushRot: 70, brushScale: .62, armR: [70, -40] }), V3(1.6, 0, -9.4));
  back += rails2d(-4, 8);
  const v1 = who(OBA, Object.assign(breathe(t, .5), { armR: [lerp(12, 132, pts), lerp(20, -12, pts)], look: [8, -6], mouth: ri > .5 ? 'smirk' : 'line', face: blink(t, .3) ? 'closed' : 'smug' }), V3(6.3, 0, 11.4));
  const v2 = who(CHICO, Object.assign(breathe(t, 1.2), { face: ri > .2 ? 'happy' : 'smug', mouth: ri > .2 ? 'laugh' : 'smirk', armR: [lerp(16, 36, ri), lerp(20, 80, ri)], headTilt: ri * 6 + Math.sin(t * 14) * 2 * ri, look: [-6, 0] }), V3(7.9, 0, 11.9));
  return back + v1 + v2; };
// 3 · el vecino se apoya en la valla y mira
S.valla = (t, D, B) => { const E = EVS.valla(B); setup(window.__T || t);
  const cp = V3(-.2 + t * .08, 1.55, -4.6 + t * .18), cl = V3(1.35, 1.38, 0); W.setCam(cp, cl, 44, cp.distanceTo(cl), .004); W.render();
  const ap = k01(t, E.apoya - .1, E.apoya + .02), br = breathe(t, .7), talking = t > E.suelta;
  const o = Object.assign({}, br, { noArms: ap > .5, lean: lerp(0, 6, ap), look: t > E.mira ? [-10, 3] : [-3, 0], mouth: talking ? 'open' : 'smirk', browTilt: t > E.mira ? .4 : 0, face: blink(t, .2) ? 'closed' : 'smug' });
  if (ap <= .5) { o.armL = [12, 15]; o.armR = [12, 15]; }
  return who(VECINO, o, NB) + rails2d(-1, 4) + (ap > .5 ? leanArms(NB, 'both', br.bob) : ''); };
// 4 · «¿Y la jirafa para cuándo?»
S.jirafa = (t, D, B) => { const E = EVS.jirafa(B); setup(window.__T || t);
  const cp = V3(.7, 1.6, -3.5 + t * .14), cl = V3(1.4, 1.48, 0); W.setCam(cp, cl, 40, cp.distanceTo(cl), .006); W.render();
  const br = breathe(t, .7), tl = t < E.cuando + .35, o = Object.assign({}, br, { noArms: true, lean: 6, look: [-10, 3], mouth: talk(t, tl) || 'smirk', browTilt: .6, brows: t > E.jirafa ? .6 : .2, headTilt: br.headTilt + (t > E.jirafa ? -5 : 0), face: 'smug' });
  return who(VECINO, o, NB) + rails2d(-1, 4) + leanArms(NB, 'both', br.bob); };
// 5 · Kenji ni se gira: moja la brocha en el cubo y sigue pintando
S.moja = (t, D, B) => { const E = EVS.moja(B); setup(window.__T || t);
  const cp = V3(-1.9 - t * .12, 1.25, -2.9 - t * .1), cl = V3(-3.4, 1.0, -7.6); W.setCam(cp, cl, 46, cp.distanceTo(cl), .0035); W.render();
  const BK = V3(-3.25, 0, -6.55), bfr = frameOf(BK, 1.45), bsc = bfr.s * .62, bx = bfr.x, by = bfr.y;
  const dipA = E.moja - .05, dipB = E.brocha + .15, dk = k01(t, dipA, dipA + .18) * (1 - k01(t, dipB, dipB + .2));
  const strokes = [{ x: 160, t0: .05, t1: Math.max(.6, dipA - .3) }, { x: 214, t0: E.sigue + .02, t1: E.sigue + .95 }];
  let pa = paintAction(t, KP, COW1, 'right', strokes, {}, { lean: 3 });
  let kenji = pa.kenji;
  if (dk > 0.001) { // en el cubo: se agacha un poco y mete la brocha (IK hasta la pintura)
    const kfr = frameOf(KP, ADULT), lean = lerp(3, 10, dk), br = breathe(t, 1), T = toLoc(kfr, bx, by - 112 * bsc + 6, 1, lean), ik = armIK(1, T, { brush: true, brushScale: KENJI.brushScale, brushRot: 175, bob: br.bob - 20 * dk });
    const dip = Object.assign({}, br, { bob: br.bob - 20 * dk, lean, prop: 'brush', brushRot: lerp(70, 175, dk), armR: [lerp(40, ik.arm[0], dk), lerp(-20, ik.arm[1], dk)], legL: [4, 18 * dk], legR: [4, 18 * dk], look: [6, 10 * dk] });
    kenji = who(KENJI, dip, KP); }
  const cw = cow(cowLife(t, 0, { stripes: 'white', wet: true, paintTo: 104, tag: '01', fresh: pa.fresh, headTurn: -.2 }), COW1, 'right');
  const drip = t > dipB && t < dipB + .5 ? `<circle cx="${pa.tip[0]}" cy="${pa.tip[1] + (t - dipB) * 400}" r="6" fill="#f6f3ec" stroke="${K}" stroke-width="2"/>` : '';
  return cw + bucketBack(bx, by, bsc, '#f6f3ec') + kenji + bucketFront(bx, by, bsc, '#f6f3ec', '#2f6fbf') + drip; };
// 6 · rayas negras sobre una vaca negra (la segunda vaca, con la mano izquierda desde la grupa)
S.negra = (t, D, B) => { const E = EVS.negra(B); setup(window.__T || t);
  const k = k01(t, E.sobre - .2, E.negra2 + .2), cp = L3(V3(3.0, 1.4, -4.0), V3(2.5, 1.3, -5.4), k).add(V3(-t * .06, 0, 0)), cl = V3(1.95, 1.0, -10.5); W.setCam(cp, cl, 46, cp.distanceTo(cl), .0035); W.render();
  const strokes = [{ x: -262, t0: .1, t1: .9 }, { x: -200, t0: 1.25, t1: 2.05 }, { x: -140, t0: 2.4, t1: 3.2 }];
  const pa = paintAction(t, KP2, COW2, 'right', strokes, { paint: '#141214' }, { lean: 3 });
  const cw = cow(cowLife(t, 1, { stripes: null, tag: '02', fresh: pa.fresh, freshCol: '#0c090b', headTurn: -.2 }), COW2, 'right');
  return cow(cowLife(t, 2, COW3O), COW3, 'right') + cw + pa.kenji; };
// 7 · «No se ven ni de cerca»: el vecino entorna los ojos y se inclina sobre la valla
S.nosevan = (t, D, B) => { const E = EVS.nosevan(B); setup(window.__T || t);
  const cp = V3(.85, 1.6, -3.3 + t * .14), cl = V3(1.55, 1.46, 0); W.setCam(cp, cl, 38, cp.distanceTo(cl), .006); W.render();
  const sq = k01(t, E.ven - .1, E.ven + .05), br = breathe(t, .7);
  const o = Object.assign({}, br, { noArms: true, lean: lerp(6, 11, sq), look: [-12, 6], face: 'angry', mouth: 'line', browTilt: lerp(.4, -.6, sq), brows: lerp(.3, -.5, sq), headTilt: br.headTilt + sq * 8 });
  return who(VECINO, o, NB) + rails2d(-1, 4) + leanArms(NB, 'both', br.bob); };
// 8 · a la tercera ni la toca: la vaca normal mastica; Kenji la mira y pasa (pose a pose)
S.tercera = (t, D, B) => { const E = EVS.tercera(B); setup(window.__T || t);
  const cp = V3(.9 + t * .08, 1.4, -5.6 - t * .1), cl = V3(-.5, .95, -12.6); W.setCam(cp, cl, 46, cp.distanceTo(cl), .0035); W.render();
  const lk = k01(t, E.toca - .1, E.toca), br = breathe(t, 1);
  const kj = who(KENJI, Object.assign({}, br, { prop: 'brush', brushRot: lerp(-10, 150, lk), brushScale: .62, armR: [lerp(30, 14, lk), lerp(30, 20, lk)], look: lk > .5 ? [0, 0] : [-10, 2], face: blink(t, 2) ? 'closed' : 'smug' }), V3(.6, 0, -12.0));
  return cow(cowLife(t, 2, Object.assign({}, COW3O, { headTurn: -.3, eyes: t > E.tercera ? (blink(t, 2) ? 'closed' : 'lid') : 'lid' })), COW3, 'right') + kj; };
// 9 · «imagina que eres una mosca»: vuelo rasante por el corral con la mosca en primer plano
S.mosca = (t, D, B) => { const E = EVS.mosca(B); setup(window.__T || t);
  const k = t / D, cp = V3(lerp(7.5, -.5, k), 1.7 + Math.sin(t * 3) * .08, lerp(-4.6, -5.4, k)), cl = cp.clone().add(V3(-3, -.6, -2.4)); W.setCam(cp, cl, 52, 8, .0025); W.render();
  let s = cow(cowLife(t, 0, COW1_DONE), COW1, 'right') + cow(cowLife(t, 1, COW2_DONE), COW2, 'right') + cow(cowLife(t, 2, COW3O), COW3, 'right');
  const bob = Math.sin(t * 6) * 14, pk = k01(t, E.pican - .1, E.pican + .05);
  s += bigFly(560, 1020 + bob, 1.55, t, { rot: -6 + Math.sin(t * 2) * 4, eye: 'lid', legs: 'tuck' });
  if (pk > 0 && t < E.pican + .5) s += `<g opacity="${(1 - k01(t, E.pican + .2, E.pican + .5)).toFixed(2)}">${[0, 1, 2].map(i => `<path d="M${790 + i * 18},${1010 - i * 30} l${30 + i * 8},${-18 + i * 18}" stroke="#ffd34a" stroke-width="10" stroke-linecap="round"/>`).join('')}</g>`;
  return s + speedLines(t, 10, .25, 1); };
// 10 · «Es agosto y tienes hambre»: la mosca en la valla, junto al termómetro; se frota las patas
S.hambre = (t, D, B) => { const E = EVS.hambre(B); setup(window.__T || t);
  const cp = V3(-1.35 + t * .06, 1.45, -2.85 + t * .08), cl = V3(-.25, 1.2, -1.0); W.setCam(cp, cl, 42, cp.distanceTo(cl), .009); W.render();
  const th = W.proj(V3(0, 1.0, -1.13)), rp = W.proj(RAIL), deg = lerp(29, 36, k01(t, E.agosto - .1, E.agosto + .4));
  let s = thermo(th.x, th.y, th.ppm * .0024, deg);
  const rub = t > E.hambre - .1; s += bigFly(rp.x - 30, rp.y - rp.ppm * .12, rp.ppm * .0012, t, { landed: true, legs: rub ? 'rub' : 'tuck', eye: rub ? 'squint' : 'lid', rot: -4 });
  if (rub) s += `<path d="M${rp.x + rp.ppm * .12},${rp.y - rp.ppm * .16} q12,-10 24,0" stroke="#fff" stroke-width="6" fill="none" opacity=".8"/>`;
  return s; };
// 11 · la vaca normal: aterrizas tú y 127 moscas más
S.normal = (t, D, B) => { const E = EVS.normal(B); setup(window.__T || t);
  const cp = V3(-.6 - t * .05, 1.15, -6.8 - t * .14), cl = V3(-.8, .9, -12.8); W.setCam(cp, cl, 46, cp.distanceTo(cl), .004); W.render();
  const fr = frameOf(COW3, 1.45), pts = bodyPts(127, 31), ann = t > E.ciento;
  let s = cow(cowLife(t, 2, Object.assign({}, COW3O, { eyes: ann ? 'annoyed' : 'lid', tail: ann ? Math.sin(t * 6) * .9 : Math.sin(t * 2) * .4, twitch: ann && Math.sin(t * 9) > 0, headTurn: ann ? Math.sin(t * 3) * .3 : 0 })), COW3, 'right');
  s += landing(fr, 1, pts, t, .4, Math.max(1, E.moscas - .4), fr.s * 1.25);
  // tú: aterrizas en el lomo (más grande, delante)
  const [LX, LY] = toScr(fr, 40, -405, 1), la = k01(t, E.aterrizas - .5, E.aterrizas), X = lerp(LX + 380, LX, eOut(la)), Y = lerp(LY - 600, LY, eOut(la)) - Math.sin(la * Math.PI) * 60;
  s += bigFly(X, Y - fr.s * 60, fr.s * .55, t, { landed: la >= 1, legs: la < 1 ? 'out' : 'tuck', eye: la >= 1 ? 'lid' : 'wide', rot: la >= 1 ? 0 : 18 * (1 - la) });
  return s; };
// 12 · la de rayas negras: 111 moscas igual
S.negras = (t, D, B) => { const E = EVS.negras(B); setup(window.__T || t);
  const cp = V3(5.6 - t * .2, 1.2, -6.9 - t * .05), cl = V3(2.4, .9, -10.5); W.setCam(cp, cl, 46, cp.distanceTo(cl), .004); W.render();
  const fr = frameOf(COW2, 1.45), pts = bodyPts(111, 17);
  let s = cow(cowLife(t, 1, Object.assign({}, COW2_DONE, { eyes: t > E.igual ? 'annoyed' : 'lid', tail: Math.sin(t * 6) * .8, twitch: Math.sin(t * 8) > .3, headTurn: Math.sin(t * 2.6) * .3 })), COW2, 'right');
  s += landing(fr, 1, pts, t, 0, Math.max(1, E.once - .2), fr.s * 1.25);
  return s; };
// 13 · vas a por la cebra, frenas… y te pasas de largo (vista de mosca)
S.cebra = (t, D, B) => { const E = EVS.cebra(B); setup(window.__T || t);
  const a = k01(t, 0, E.frenas + .2), b = k01(t, E.pasas - .05, E.pasas + .45);
  const cp = L3(V3(-2.2, 1.35, -2.0), V3(-2.55, 1.3, -5.3), eOut(a)).add(V3(b * .6 - t * .06, b * .9, -b * .4 - t * .08)), cl = L3(V3(-2.9, 1.1, -8), V3(-2.9, 2.6, -8.6), b); W.setCam(cp, cl, 48, cp.distanceTo(cl), .0035); W.render();
  let s = cow(cowLife(t, 0, Object.assign({}, COW1_DONE, { eyes: 'closed' })), COW1, 'right');
  const brake = t > E.frenas && t < E.pasas, fx = 520 + b * 980 + Math.sin(t * 5) * 8, fy = 1000 + Math.sin(t * 7) * 12 - b * 380;
  s += bigFly(fx, fy, 1.5, t, { legs: brake ? 'out' : 'tuck', eye: brake || b > 0 ? 'wide' : 'lid', rot: brake ? -20 : (b > 0 ? 14 : -4) });
  if (b > 0 && b < 1) s += speedLines(t, 24, .6 * Math.sin(b * Math.PI), -1);
  return s; };
// 14 · lo vuelves a intentar y te estampas contra el lomo
S.estampa = (t, D, B) => { const E = EVS.estampa(B); setup(window.__T || t);
  const hit = E.estampas, ap = k01(t, 0, hit), sh = t > hit && t < hit + .35 ? Math.sin(t * 70) * .04 * (1 - (t - hit) / .35) : 0;
  const cp = L3(V3(-4.3, 1.55, -4.2), V3(-3.4, 1.42, -5.5), eOut(ap)).add(V3(sh + Math.max(0, t - hit) * .12, sh, -Math.max(0, t - hit) * .1)), cl = V3(-3.0, 1.22, -8); W.setCam(cp, cl, 46, cp.distanceTo(cl), .0035); W.render();
  const fr = frameOf(COW1, 1.45), [HX, HY] = toScr(fr, -40, -414, 1);
  let s = cow(cowLife(t, 0, Object.assign({}, COW1_DONE, { eyes: 'closed' })), COW1, 'right');
  if (t < hit) { const k = eIO(ap); s += bigFly(lerp(120, HX - 40, k), lerp(760, HY - 70, k), lerp(1.5, 1.05, k), t, { legs: 'tuck', eye: k > .75 ? 'wide' : 'lid', rot: 22 }); }
  else { const k = clamp((t - hit) / 1.3), x = HX - 40 - 260 * eOut(k), y = HY - 70 - 300 * Math.sin(k * Math.PI * .85) + k * k * 700, sq = Math.max(0, 1 - (t - hit) / .2);
    s += impact(HX, HY - 30, 300, clamp((t - hit) / .45)); s += bigFly(x, y, 1.05, t, { legs: 'out', eye: 'spiral', squash: sq, rot: 30 + k * 160 }); if (k > .15) s += stars(x, y - 120, 110, t, 4, 1.4); }
  return s; };
// 15 · ¿cómo es posible? (la mosca mareada en la valla)
S.como = (t, D, B) => { const E = EVS.como(B); setup(window.__T || t);
  const cp = V3(-1.05 + t * .1, 1.38, -2.4 + t * .1), cl = V3(-.35, 1.24, -1.0); W.setCam(cp, cl, 40, cp.distanceTo(cl), .009); W.render();
  const rp = W.proj(RAIL), fx = rp.x - 20, fy = rp.y - rp.ppm * .085, sc = rp.ppm * .0008;
  return bigFly(fx, fy, sc, t, { landed: true, eye: 'spiral', legs: 'tuck', rot: Math.sin(t * 3) * 6 }) + stars(fx + 40 * sc, fy - 120 * sc, 110 * sc, t, 4, sc * 1.6); };
// 16 · el palo de una barbería
S.barberia = (t, D, B) => { const E = EVS.barberia(B); setup(window.__T || t);
  const cp = V3(-21.6 - t * .25, 1.75, 10.6 - t * .5), cl = V3(-25.4, 1.85, 4.6); W.setCam(cp, cl, 46, cp.distanceTo(cl), .0025); W.render(); return ''; };
// 17 · parecen subir, pero solo giran
S.giran = (t, D, B) => { const E = EVS.giran(B); setup(window.__T || t);
  const a = .35 - t * .06, cp = V3(-24.15 + Math.sin(a) * 2.6, 1.98, 4.95 + Math.cos(a) * 2.6), cl = V3(-24.15, 1.95, 4.95); W.setCam(cp, cl, 40, cp.distanceTo(cl), .006); W.render();
  const p = W.proj(V3(-24.15, 1.95, 4.95)), top = W.proj(V3(-24.15, 2.5, 4.95)), bot = W.proj(V3(-24.15, 1.4, 4.95)), r = p.ppm * .19;
  const up = t > E.subir - .2 && t < E.giran - .05 ? clamp((t - E.subir + .2) / .6) : 0, sp = clamp((t - E.giran + .2) / .5);
  const ax = p.x + p.ppm * .26; return arrowUp(ax, bot.y, top.y, up, t) + (t > E.realidad && t < E.giran + .1 ? crossX(ax, p.y, k01(t, E.realidad, E.realidad + .2)) : '') + arrowSpin(p.x, p.y + p.ppm * .05, p.ppm * .27, p.ppm * .08, sp, t); };
// 18 · a la mosca le pasa igual: calcula mal y no frena a tiempo (cámara lenta)
S.engana = (t, D, B) => { const E = EVS.engana(B); setup(window.__T || t);
  const cp = V3(-1.75 - t * .06, 1.2, -4.0 - t * .05), cl = V3(-2.6, 1.05, -8); W.setCam(cp, cl, 44, cp.distanceTo(cl), .0035); W.render();
  const fr = frameOf(COW1, 1.45), [TX, TY] = toScr(fr, 0, -420, 1);
  let s = cow(cowLife(t * .5, 0, Object.assign({}, COW1_DONE, { eyes: 'closed' })), COW1, 'right');
  // trayectoria prevista (aterrizaje) y real (se pasa)
  const pk = k01(t, E.calcula - .2, E.calcula + .3); if (pk > 0) { s += `<g opacity="${(pk * .95).toFixed(2)}"><path d="M120,760 Q${(120 + TX) / 2},${TY - 260} ${TX},${TY - 20}" stroke="${K}" stroke-width="20" stroke-dasharray="22 18" fill="none" stroke-linecap="round"/><path d="M120,760 Q${(120 + TX) / 2},${TY - 260} ${TX},${TY - 20}" stroke="#fff" stroke-width="10" stroke-dasharray="22 18" fill="none" stroke-linecap="round"/></g>`; if (t > E.frena) s += crossX(TX, TY - 20, k01(t, E.frena, E.frena + .2)); }
  const fk = k01(t, E.engañan - .5, E.tiempo + .3), fx = lerp(-60, 1260, fk), fy = TY - 160 - Math.sin(fk * Math.PI) * 120 + fk * 40;
  if (fk > 0 && fk < 1) { s += bigFly(fx, fy, 1.0, t * .35, { legs: fk > .45 ? 'out' : 'tuck', eye: fk > .5 ? 'wide' : 'lid', rot: fk > .5 ? -16 : 8 }); if (fk > .5) s += `<path d="M${fx - 120},${fy} l-180,0 M${fx - 120},${fy + 30} l-140,0" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".7"/>`; }
  return s; };
// 19 · Kenji cuenta las moscas: 56 en la cebra, la mitad
S.cuenta = (t, D, B) => { const E = EVS.cuenta(B); setup(window.__T || t);
  const z = k01(t, E.cincuenta - .4, E.cincuenta + .3) * (1 - k01(t, E.mitad - .25, E.mitad + .3));
  const KC = V3(-.55, 0, -6.1);
  const cpA = V3(1.3, 1.55, -2.4), clA = V3(-2.0, .9, -10.5), cpB = V3(-.14, 1.42, -3.95), clB = V3(-.38, 1.36, -6.1);
  const cp = L3(cpA, cpB, z).add(V3(-t * .04, 0, 0)), cl = L3(clA, clB, z); W.setCam(cp, cl, lerp(52, 41, z), cp.distanceTo(cl), .003); W.render();
  const rate = 56 / Math.max(.5, E.cincuenta - E.cuenta - .1), cnt = t < E.cuenta ? 0 : Math.min(56, (t - E.cuenta) * rate), press = (Math.floor((t - E.cuenta) * rate) % 2) && t > E.cuenta && cnt < 56 ? 1 : 0, fr1 = frameOf(COW1, 1.45), fr3 = frameOf(COW3, 1.45), fr2 = frameOf(COW2, 1.45);
  const L = [{ p: COW3, f: () => cow(cowLife(t, 2, Object.assign({}, COW3O, { eyes: 'annoyed', tail: Math.sin(t * 6) * .8 })), COW3, 'right') + landing(fr3, 1, bodyPts(128, 31), t, -9, 1, fr3.s * 1.25) },
    { p: COW2, f: () => cow(cowLife(t, 1, Object.assign({}, COW2_DONE, { eyes: 'annoyed', tail: Math.sin(t * 5) * .8 })), COW2, 'right') + landing(fr2, 1, bodyPts(111, 17), t, -9, 1, fr2.s * 1.25) },
    { p: COW1, f: () => cow(cowLife(t, 0, Object.assign({}, COW1_DONE, { eyes: blink(t, 0) ? 'closed' : 'lid' })), COW1, 'right') + landing(fr1, 1, bodyPts(56, 5), t, -9, 1, fr1.s * 1.25) },
    { p: KC, f: () => { const br = breathe(t, 1), kfr = frameOf(KC, ADULT), T = [70, -300 + br.bob], ik = armIK(1, T, { bob: br.bob }), [HX, HY] = toScr(kfr, ik.hand[0], ik.hand[1]);
      return who(KENJI, Object.assign({}, br, { armR: ik.arm, look: [-10, 2], face: blink(t, 2) ? 'closed' : 'smug', prop: null }), KC) + clicker(HX + 6 * kfr.s, HY - 30 * kfr.s, kfr.s * .55, cnt + (press ? .5 : 0), press); } }];
  return byDist(L); };
// 20 · las rayas negras: no era el olor de la pintura (cubo de pintura negra con olor; las moscas ni caso)
S.olor = (t, D, B) => { const E = EVS.olor(B); setup(window.__T || t);
  const cp = V3(4.2 + t * .05, 1.1 + t * .08, -5.6 - t * .18), cl = V3(2.9, .55 + t * .06, -10.4); W.setCam(cp, cl, 46, 2.7 + t * .5, .006); W.render();
  const BK = V3(3.75, 0, -9.0), bfr = frameOf(BK, 1.45), sc = bfr.s * .62, fr = frameOf(COW2, 1.45);
  let s = cow(cowLife(t, 1, Object.assign({}, COW2_DONE, { eyes: 'annoyed', tail: Math.sin(t * 6) * .8, twitch: Math.sin(t * 8) > .3 })), COW2, 'right') + landing(fr, 1, bodyPts(111, 17), t, -9, 1, fr.s * 1.25);
  s += bucketBack(bfr.x, bfr.y, sc, '#0c090b') + bucketFront(bfr.x, bfr.y, sc, '#0c090b', '#c8302e');
  if (t > E.olor - .4) s += smell(bfr.x, bfr.y - 130 * sc, sc * 1.4, t);
  s += buzz(fr.x - 40 * fr.s, fr.y - 320 * fr.s, 8, 260 * fr.s, fr.s * 1.25, t, 3);
  return s; };
// 21 · a la mañana siguiente: el vecino vuelve a la valla (rodeado de moscas)
S.manana = (t, D, B) => { const E = EVS.manana(B); setup(window.__T || t, 1);
  const cp = V3(-.4 + t * .1, 1.6, -4.7 + t * .2), cl = V3(1.35, 1.4, 0); W.setCam(cp, cl, 44, cp.distanceTo(cl), .004); W.render();
  const ap = k01(t, E.apoyarse - .1, E.apoyarse + .02), br = breathe(t, .7), sw = t < E.apoyarse ? Math.max(0, Math.sin(t * 9)) : 0;
  const o = Object.assign({}, br, { noArms: ap > .5, lean: lerp(0, 6, ap), look: [-8, 2], face: 'smug', mouth: 'line', brows: .4, browTilt: -.3 });
  if (ap <= .5) { o.armL = [12, 15]; o.armR = [lerp(14, 160, sw), lerp(15, 70, sw)]; }
  const hp = W.proj(V3(NB.x, 1.84, NB.z));
  return who(VECINO, o, NB) + rails2d(-1, 4) + (ap > .5 ? leanArms(NB, 'both', br.bob) : '') + buzz(hp.x, hp.y - 40, 5, hp.ppm * .45, hp.ppm * .0028, t, 5); };
// 22 · «Oye, Kenji… ¿me dejas la brocha?»
S.brocha = (t, D, B) => { const E = EVS.brocha(B); setup(window.__T || t, 1);
  const cp = V3(.6 + t * .06, 1.55, -8.2 + t * .14), cl = V3(1.6, 1.3, -1.0); W.setCam(cp, cl, 46, cp.distanceTo(cl), .0035); W.render();
  const br = breathe(t, .7), tl = t > E.oye - .05 && t < E.brocha + .35, ask = k01(t, E.dejas - .15, E.dejas + .1);
  const vo = Object.assign({}, br, { noArms: true, lean: 6, look: [-10, 2], mouth: talk(t, tl) || 'smirk', brows: .5, browTilt: -.4, face: blink(t, .2) ? 'closed' : 'smug' });
  const KF = V3(1.95, 0, -4.0), kb = breathe(t, 1), turn = k01(t, E.kenji - .1, E.kenji + .05);
  const kenji = who(KENJI, Object.assign({}, kb, { prop: 'brush', brushRot: 20, brushScale: .62, armR: [36, 40], look: [lerp(0, 12, turn), 0], face: 'smug' }), KF);
  return who(VECINO, vo, NB) + rails2d(-1, 4) + leanArms(NB, ask > 0 ? 'left' : 'both', br.bob) + askArm(NB, ask, br.bob) + buzz(W.proj(V3(NB.x, 1.84, NB.z)).x, W.proj(V3(NB.x, 1.84, NB.z)).y - 40, 3, 50, .5, t, 7) + kenji; };

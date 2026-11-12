// «Las palomas que pilotaban misiles» — ESTILO 3D (world_palomas.js) + personajes 2D (stick.js, pigeon.js). Sin voz (fake_voice), con transiciones.
window.CFG = { capY: 1500, capSize: 96, transDur: .55,
  trans: { army: 'fly', lab: 'whip', how: 'push', screen: 'swish', peck: 'push', turn: 'swish', dog: 'swish', train: 'whip', three: 'swish', committee: 'swish', cancel: 'push', crackpot: 'swish', navy: 'fly', prize: 'swish' } };
const EVS = {
  hook: B => ({ tres: B[0].w[3], palomas: B[0].w[4], misil: B[0].w[10] }), army: B => ({ y1943: B[0].w[2], ejercito: B[0].w[4], dinero: B[0].w[10] }),
  lab: B => ({ fred: B[0].w[2], lab: B[0].w[7], palomas: B[0].w[10] }), how: B => ({ como: B[0].w[1], paloma: B[0].w[4] }),
  screen: B => ({ ventanita: B[0].w[5], pantalla: B[0].w[10], barco: B[0].w[15] }), peck: B => ({ izq: B[0].w[7], picotea: B[0].w[11] }),
  turn: B => ({ gira: B[0].w[3], izq: B[0].w[6] }), dog: B => ({ perro: B[0].w[4], galleta: B[0].w[9], sienta: B[0].w[14], final: B[0].w[16], solo: B[0].w[19] }),
  train: B => ({ comida: B[0].w[4], acierta: B[0].w[10], barco: B[0].w[13] }), three: B => ({ distrae: B[0].w[5], tres: B[0].w[7], mayoria: B[0].w[10] }),
  committee: B => ({ comite: B[0].w[5], cientificos: B[0].w[9] }), cancel: B => ({ no: B[0].w[0], y1944: B[0].w[6], cancelo: B[0].w[10] }),
  crackpot: B => ({ llamo: B[0].w[3], chiflado: B[0].w[7] }), navy: B => ({ y1948: B[0].w[2], marina: B[0].w[4], resucito: B[0].w[6], cinco: B[0].w[10] }),
  prize: B => ({ y2024: B[0].w[2], premio: B[0].w[6], palomas: B[0].w[9] }),
};
const S = {};
const W = W2, K = '#1b1720';
const DAY = { tint: '#ffe6c4', k: .14, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.5 };
const hs = (a, b = 1) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const ease = x => x * x * (3 - 2 * x), k01 = (t, a, b) => ease(clamp((t - a) / (b - a)));
// ---------- reparto ----------
const MIX = { rich: true, eyeStyle: 'palo', legLen: 1.18 }, ADULT = 1.84;
const FRED = Object.assign({}, MIX, { outfit: 'labcoat', top: '#f6f4ee', topD: '#d9d6cc', shirt: '#cfe0f0', tie: '#7a2a2a', hair2: 'side', hairCol: '#3a2a1c', glasses: true, face: 'smug', mouth: 'smirk', pants: '#4a4f5a', shoes: '#2a1e16', sole: '#2a1e16' });
const GEN = Object.assign({}, MIX, { outfit: 'military', top: '#7a6a48', topD: '#5a4e34', hat: 'peaked', capTop: '#6a5a3a', hair2: 'buzz', hairCol: '#2a1a12', medals: true, nameTape: 'GRAY', mustache: '#3a2a1c', face: 'smug', mouth: 'line', pants: '#6a5a3a', shoes: '#15161c', sole: '#15161c', belly: 1.1 });
const NAVY = Object.assign({}, MIX, { outfit: 'navy', top: '#1d2740', topD: '#121a2e', hat: 'peaked', hair2: 'side', hairCol: '#5a3a22', badge: true, face: 'smug', mouth: 'smirk', pants: '#1d2740', shoes: '#15161c', sole: '#15161c' });
const SUIT = (top, hair, extra = {}) => Object.assign({}, MIX, { outfit: 'suit', top, topD: top, tie: '#2a2a33', hair2: hair, hairCol: '#2a2a2a', face: 'smug', mouth: 'line', pants: top, shoes: '#15161c', sole: '#15161c' }, extra);
const BOSSES = [SUIT('#4a4f5a', 'bald', { hairCol: '#d9d6cc', mustache: '#d9d6cc', browCol: '#d9d6cc', glasses: true, wrinkles: true }), SUIT('#5a4a3a', 'side', { mustache: '#2a1a12' }), GEN, SUIT('#2f3540', 'curly', { hairCol: '#5a3a22' })];
const pg = (o, F, h, opt) => pigeonAt(o, F, V3(F.x, F.y + h, F.z), W, opt);
const fred = (o, F, opt) => stickAt(Object.assign({}, FRED, o), F, V3(F.x, F.y + ADULT, F.z), W, opt);
const who = (base, o, F, opt) => stickAt(Object.assign({}, base, o), F, V3(F.x, F.y + ADULT, F.z), W, opt);
const behind = (svg, yClip) => { const id = 'cl' + Math.random().toString(36).slice(2, 8); return `<defs><clipPath id="${id}"><rect x="-300" y="-300" width="1680" height="${(yClip + 300).toFixed(1)}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; };
const byDist = (L, cam) => L.sort((a, b) => b.p.distanceTo(cam) - a.p.distanceTo(cam)).map(o => o.f()).join('');
const blink = (t, ph = 0) => ((t + ph) % 3.3) < .12;
// ---------- gráficos 2D ----------
function pill(x, y, txt, col, a, sz = 44) { if (a <= 0) return ''; const w = txt.length * sz * .62 + 60, sc = .7 + .3 * eBack(clamp(a));
  return `<g transform="translate(${x},${y}) scale(${sc.toFixed(3)})" opacity="${clamp(a * 1.6).toFixed(2)}"><rect x="${-w / 2 + 6}" y="${-sz * .85 + 8}" width="${w}" height="${sz * 1.6}" rx="10" fill="#000" opacity=".3"/><rect x="${-w / 2}" y="${-sz * .85}" width="${w}" height="${sz * 1.6}" rx="10" fill="#14121c" stroke="${col}" stroke-width="5"/><rect x="${-w / 2}" y="${-sz * .85}" width="22" height="${sz * 1.6}" rx="6" fill="${col}"/><text x="11" y="${sz * .3}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${sz}" fill="#fff">${txt}</text></g>`; }
function bigNum(x, y, txt, col, a, sz = 200) { if (a <= 0) return ''; const sc = .5 + .5 * eBack(clamp(a)); return `<g transform="translate(${x},${y}) scale(${sc.toFixed(3)}) rotate(-4)" opacity="${clamp(a * 2).toFixed(2)}"><text x="0" y="0" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${sz}" fill="${col}" stroke="${K}" stroke-width="${sz * .1}" stroke-linejoin="round" paint-order="stroke" style="filter:drop-shadow(0 10px 0 rgba(0,0,0,.35))">${txt}</text></g>`; }
function coin(x, y, k, dx = 0) { if (k <= 0 || k >= 1) return ''; const yy = y - 260 * eOut(k) + 220 * k * k, sx = Math.abs(Math.cos(k * 12)); return `<g transform="translate(${(x + dx * k).toFixed(1)},${yy.toFixed(1)}) scale(${(.3 + .7 * sx).toFixed(2)},1)" opacity="${(1 - k * k).toFixed(2)}"><circle r="30" fill="#f2c94c" stroke="${K}" stroke-width="6"/><text y="13" text-anchor="middle" font-family="Inter" font-weight="900" font-size="36" fill="${K}">$</text></g>`; }
function moneyBag(x, y, s, sq = 0) { return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(s * (1 + sq * .15)).toFixed(3)},${(s * (1 - sq * .15)).toFixed(3)})"><ellipse cx="0" cy="4" rx="120" ry="22" fill="#000" opacity=".25"/><path d="M-100,0 C-130,-120 -60,-170 -30,-190 L30,-190 C60,-170 130,-120 100,0 Z" fill="#cfae6e" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><path d="M-30,-190 L-50,-230 L-10,-214 L0,-240 L12,-214 L50,-232 L30,-190" fill="#cfae6e" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><path d="M-38,-192 L38,-192" stroke="#8a2a1a" stroke-width="16" stroke-linecap="round"/><path d="M-80,-60 C-70,-110 -40,-140 -20,-150" stroke="#fff" stroke-width="10" fill="none" opacity=".35" stroke-linecap="round"/><text x="0" y="-48" text-anchor="middle" font-family="Inter" font-weight="900" font-size="110" fill="#2f7a3a" stroke="${K}" stroke-width="6" paint-order="stroke">$</text></g>`; }
function qmark(x, y, s, a) { if (a <= 0) return ''; const sc = s * (.5 + .5 * eBack(clamp(a))); return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)}) rotate(8)"><text x="0" y="0" text-anchor="middle" font-family="Inter" font-weight="900" font-size="170" fill="${YEL}" stroke="${K}" stroke-width="16" paint-order="stroke">?</text></g>`; }
function check(x, y, s, a) { if (a <= 0) return ''; const k = clamp(a); return `<g transform="translate(${x},${y}) scale(${(s * (.6 + .4 * eBack(k))).toFixed(3)})"><circle r="70" fill="${GREEN}" stroke="${K}" stroke-width="10"/><path d="M-34,0 L-8,26 L38,-28" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
function stamp(x, y, txt, a, col = '#e23a3a') { if (a <= 0) return ''; const sc = a < 1 ? 1.9 - .9 * eOut(clamp(a * 2.2)) : 1; return `<g transform="translate(${x},${y}) rotate(-12) scale(${sc.toFixed(3)})" opacity="${clamp(a * 4).toFixed(2)}"><rect x="-370" y="-92" width="740" height="184" rx="18" fill="rgba(255,255,255,.12)" stroke="${col}" stroke-width="16"/><rect x="-350" y="-72" width="700" height="144" rx="10" fill="none" stroke="${col}" stroke-width="6"/><text x="0" y="30" text-anchor="middle" font-family="Inter" font-weight="900" font-size="104" fill="${col}" letter-spacing="4">${txt}</text></g>`; }
function sparkle(x, y, r, k) { if (k <= 0 || k >= 1) return ''; let s = ''; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + k, d = r * eOut(k); s += `<path d="M${(x + Math.cos(a) * d).toFixed(1)},${(y + Math.sin(a) * d - 16).toFixed(1)} l6,14 l14,6 l-14,6 l-6,14 l-6,-14 l-14,-6 l14,-6Z" fill="${YEL}" stroke="${K}" stroke-width="3" opacity="${(1 - k).toFixed(2)}"/>`; } return s; }
function seeds(x, y, k, n = 10, spread = 40, sc = 1) { if (k <= 0 || k >= 1) return ''; let s = ''; for (let i = 0; i < n; i++) { const kk = clamp(k * 1.4 - i * .04), yy = y + 140 * sc * kk * kk, xx = x + (hs(i, 3) - .5) * spread * sc; if (kk > 0 && kk < 1) s += `<ellipse cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" rx="${(5 * sc).toFixed(1)}" ry="${(3.5 * sc).toFixed(1)}" fill="${i % 2 ? '#d8b860' : '#b89040'}" stroke="${K}" stroke-width="${(1.5 * sc).toFixed(1)}"/>`; } return s; }
function speedLines(t, n = 26, a = .6) { let s = ''; for (let i = 0; i < n; i++) { const y = (hs(i, 7) * 1920), x = ((hs(i, 8) * 1600 - t * 2600 * (1 + hs(i, 9))) % 1600 + 1600) % 1600 - 200; s += `<path d="M${x.toFixed(0)},${y.toFixed(0)} l${(220 + hs(i, 2) * 200).toFixed(0)},0" stroke="#fff" stroke-width="${2 + (i % 3) * 2}" opacity="${(a * (.4 + .6 * hs(i, 4))).toFixed(2)}" stroke-linecap="round"/>`; } return s; }
function cookie(x, y, s) { return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(3)})"><circle r="34" fill="#c98a4a" stroke="${K}" stroke-width="6"/>${[[-12, -10], [10, -14], [14, 8], [-8, 12], [0, 0]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5" fill="#4a2a14"/>`).join('')}<path d="M-20,-18 q10,-8 22,-6" stroke="#fff" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/></g>`; }
// perro 2D (de perfil mirando a la derecha, patas en y=0, alto ≈ 330): sit 0..1, wag, happy, tongue, look
function dog(o = {}) { const d = Object.assign({ col: '#d9a066', colD: '#a8703a', ear: '#7a4a24', sit: 0, wag: 0, happy: false, eye: 'calm', look: [0, 0] }, o), id = 'dg' + Math.round(Math.random() * 1e6), sit = d.sit;
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${mixC(d.col, '#ffffff', .2)}"/><stop offset="1" stop-color="${d.colD}"/></linearGradient></defs>`;
  const leg = (x, y0, h, w = 30) => `<path d="M${x - w / 2},${y0} L${x - w / 2 + 2},${-10} Q${x},${8} ${x + w / 2 + 8},${-4} L${x + w / 2},${y0}Z" fill="url(#${id})" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M${x - 8},-6 l0,-10 M${x + 6},-6 l0,-10" stroke="${K}" stroke-width="4" opacity=".5"/>`;
  const tail = (x, y) => { const a = Math.sin(d.wag * 16) * 22; return `<path d="M${x},${y} Q${x - 40},${y - 40} ${x - 30 + a * .6},${y - 90}" stroke="${K}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${x},${y} Q${x - 40},${y - 40} ${x - 30 + a * .6},${y - 90}" stroke="${d.col}" stroke-width="12" fill="none" stroke-linecap="round"/>`; };
  if (sit < .5) { s += leg(-90, -110, 110) + leg(60, -110, 110) + tail(-130, -170); s += `<path d="M-150,-130 C-160,-210 -40,-230 40,-220 C120,-212 140,-150 110,-110 C60,-90 -100,-86 -150,-130Z" fill="url(#${id})" stroke="${K}" stroke-width="9"/>` + leg(-60, -110, 110, 34) + leg(90, -110, 110, 34) + `<path d="M40,-200 Q90,-170 100,-120" stroke="#f6efe0" stroke-width="30" fill="none" stroke-linecap="round" opacity=".9"/>`; }
  else { s += tail(-110, -40); s += `<path d="M-120,-30 C-150,-140 -60,-260 30,-250 C100,-240 110,-160 80,-40 C40,-6 -90,-4 -120,-30Z" fill="url(#${id})" stroke="${K}" stroke-width="9"/><path d="M-130,-10 C-140,-60 -60,-80 -20,-40 C-10,-20 -40,0 -80,0Z" fill="url(#${id})" stroke="${K}" stroke-width="8"/>` + leg(50, -150, 150, 32) + `<path d="M30,-230 Q70,-190 70,-120" stroke="#f6efe0" stroke-width="34" fill="none" stroke-linecap="round" opacity=".9"/>`; }
  const hx = sit < .5 ? 150 : 90, hy = sit < .5 ? -250 : -320;
  s += `<g transform="translate(${hx},${hy})"><circle r="78" fill="url(#${id})" stroke="${K}" stroke-width="9"/><path d="M40,10 C80,6 118,16 120,40 C118,64 80,70 46,60 Z" fill="#f6efe0" stroke="${K}" stroke-width="8"/><ellipse cx="116" cy="34" rx="16" ry="12" fill="${K}"/><path d="M70,58 Q86,70 104,60" stroke="${K}" stroke-width="5" fill="none"/>`;
  if (d.happy) s += `<path d="M78,62 Q86,100 100,64Z" fill="#ff7a8a" stroke="${K}" stroke-width="5"/>`;
  const ex = 28 + d.look[0] * .3, ey = -14 + d.look[1] * .3; s += `<circle cx="28" cy="-14" r="16" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="${ex + 3}" cy="${ey}" r="8" fill="${K}"/>`;
  if (d.eye === 'calm') s += `<path d="M10,-14 A18,18 0 0 1 46,-14Z" fill="${d.col}" stroke="${K}" stroke-width="5"/>`; if (d.happy) s += `<path d="M10,-20 Q28,-36 46,-20" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const ea = Math.sin(d.wag * 9) * 8; s += `<path d="M-40,-50 C-90,-60 -110,10 -80,60 C-60,80 -40,40 -30,-20Z" fill="${d.ear}" stroke="${K}" stroke-width="8" transform="rotate(${ea.toFixed(1)} -40 -50)"/>`;
  s += `<path d="M-50,40 Q0,70 50,46" stroke="#d63c2f" stroke-width="18" fill="none" stroke-linecap="round"/><circle cx="0" cy="66" r="12" fill="#f2c94c" stroke="${K}" stroke-width="4"/></g>`;
  return s; }
function dogAt(o, F, h, opt = {}) { const pf = W.proj(F), pt = W.proj(V3(F.x, F.y + h, F.z)); if (!pf.ok) return ''; const L = Math.hypot(pt.x - pf.x, pt.y - pf.y), s = L / 400;
  return `<ellipse cx="${pf.x.toFixed(1)}" cy="${pf.y.toFixed(1)}" rx="${(200 * s).toFixed(1)}" ry="${(30 * s).toFixed(1)}" fill="#141826" opacity=".3" style="filter:blur(4px)"/><g transform="translate(${pf.x.toFixed(1)},${pf.y.toFixed(1)}) scale(${s.toFixed(4)})">${dog(o)}</g>`; }
// paloma asomada a una ventanita del morro (recortada por el círculo)
function peek(port, o, k, cam) { const c = port.getWorldPosition(new THREE.Vector3()), p = W.proj(c); if (!p.ok || k <= 0) return ''; const r = .1 * p.ppm, id = 'pk' + Math.round(Math.random() * 1e6), sc = r / 46 * 1.05 * (.6 + .4 * eBack(clamp(k))), dy = (1 - eOut(clamp(k))) * r * 1.4;
  return `<defs><clipPath id="${id}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r.toFixed(1)}"/></clipPath></defs><g clip-path="url(#${id})"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r.toFixed(1)}" fill="#2a3a44"/><g transform="translate(${(p.x - 92 * sc + r * .1).toFixed(1)},${(p.y + 282 * sc + dy).toFixed(1)}) scale(${sc.toFixed(4)})">${pigeon(o)}</g></g><path d="M${(p.x - r * .6).toFixed(1)},${(p.y - r * .5).toFixed(1)} A${(r * .8).toFixed(1)},${(r * .8).toFixed(1)} 0 0 1 ${(p.x + r * .3).toFixed(1)},${(p.y - r * .75).toFixed(1)}" stroke="#fff" stroke-width="${(r * .12).toFixed(1)}" fill="none" opacity=".55" stroke-linecap="round"/>`; }
// estaciones del morro: posición de la paloma (sobre la tabla) y hacia dónde mira
function station(k) { const st = W.STATIONS[k], F = st.localToWorld(new THREE.Vector3(-.08, .56, 0)), dir = st.localToWorld(new THREE.Vector3(1, .56, 0)).sub(st.localToWorld(new THREE.Vector3(0, .56, 0))); return { F, dir }; }
function stationPigeon(k, o, h = .36, cam) { const { F, dir } = station(k), a = W.proj(F), b = W.proj(F.clone().addScaledVector(dir, .3)); return { p: F, f: () => pg(Object.assign({ flip: b.x < a.x }, o), F, h) }; }
// ======================= escenas =======================
// 1 · gancho: tres palomas asoman por las ventanitas del morro; la cámara se aleja y aparece Fred, orgulloso
const NOSEP = () => { const c = new THREE.Vector3(); W.NOSE_PORTS.forEach(p => c.add(p.getWorldPosition(new THREE.Vector3()))); return c.multiplyScalar(1 / 3); };
const NOSEN = () => { const p = W.NOSE_PORTS[1], a = p.getWorldPosition(new THREE.Vector3()); return p.localToWorld(new THREE.Vector3(0, 0, 1)).sub(a).normalize(); };
S.hook = (t, D, B) => { const E = EVS.hook(B); W.setTime(t + 1); W.charLight = DAY;
  const c = NOSEP(), n = NOSEN(), side = new THREE.Vector3(-n.z, 0, n.x), k = k01(t, .9, D);
  const cam = c.clone().addScaledVector(n, 1.05 + k * 2.4).addScaledVector(side, k * 1.4).add(V3(0, .05 + k * .35, 0)), look = c.clone().addScaledVector(side, k * .9).add(V3(0, -k * .25, 0));
  W.setCam(cam, look, 40 + k * 14, cam.distanceTo(c), .004 - k * .002); W.render();
  let s = ''; const goggles = [true, true, true];
  W.NOSE_PORTS.forEach((p, i) => { const t0 = .15 + i * .22; s += peek(p, { eye: blink(t, i) ? 'closed' : 'calm', goggles: goggles[i], look: [8, 0], bob: Math.sin(t * 5 + i) * .3 }, (t - t0) / .35, cam); });
  if (k > .25) { const F = c.clone().addScaledVector(side, 1.15).addScaledVector(n, .35); F.y = 0; s += fred({ face: 'smug', mouth: 'smile', turn: -.35, look: [-10, 0], armL: [18, 20], armR: [150 - 20 * Math.sin(t * 6), 10] }, F); }
  if (t > E.tres) s += bigNum(820, 330, '3', YEL, P(t, E.tres, .3), 230);
  return s + motes(t, 16, .35); };
// 2 · el ejército pone el dinero: el general deja un saco en la mesa y Fred sonríe
S.army = (t, D, B) => { const E = EVS.army(B); W.setTime(t + 4); W.charLight = DAY;
  const k = k01(t, 0, D), cam = V3(.65 - k * .1, 1.6, 5.6 - k * .4), look = V3(.65, 1.2, .9); W.setCam(cam, look, 52, cam.distanceTo(V3(.5, 1, 1.5)), .0018); W.render();
  const drop = clamp((t - E.dinero + .25) / .35), bagW = V3(.55, .9, 1.0), bp = W.proj(bagW), bs = bp.ppm * .0017;
  let s = '';
  const L = [{ p: V3(.1, 0, 2.0), f: () => fred({ face: t > E.dinero ? 'happy' : 'wide', mouth: t > E.dinero ? 'laugh' : 'o', brows: t > E.dinero ? .4 : 1, turn: .45, look: [12, 4], armL: t > E.dinero ? [130, 30] : [18, 20], armR: t > E.dinero ? [140, 20] : [20, 20] }, V3(.1, 0, 2.0)) },
    { p: V3(1.25, 0, 1.5), f: () => who(GEN, { turn: -.45, look: [-12, 4], face: 'smug', mouth: t > E.dinero ? 'smirk' : 'line', armL: drop > 0 && drop < 1 ? [70, 20] : [20, 30], armR: [24, 30] }, V3(1.25, 0, 1.5)) }];
  s += byDist(L, cam);
  if (drop > 0) { const y = lerp(bp.y - 420, bp.y, eOut(drop)), sq = drop >= 1 ? Math.max(0, 1 - (t - E.dinero - .1) * 5) * Math.sin((t - E.dinero) * 30) : 0; s += moneyBag(bp.x, y, bs, sq);
    for (let i = 0; i < 6; i++) s += coin(bp.x + (i - 2.5) * 30, bp.y - 120 * bs * 5, (t - E.dinero - .05 - i * .04) / .8, (i - 2.5) * 60); }
  s += pill(540, 330, '1943', YEL, P(t, E.y1943, .3), 60) + (t > E.ejercito ? pill(540, 460, 'U.S. ARMY', GREEN, P(t, E.ejercito, .3), 40) : '');
  return s + motes(t, 12, .3); };
// 3 · Fred y el laboratorio lleno de palomas
S.lab = (t, D, B) => { const E = EVS.lab(B); W.setTime(t + 8); W.charLight = DAY;
  const k = k01(t, 0, D), cam = V3(1.6 - k * 1.1, 1.55 - k * .1, 3.6 - k * 1.0), look = V3(-6.2, 1.45 - k * .1, 2.2 + k * .4); W.setCam(cam, look, 52, 6.5, .0014); W.render();
  let s = ''; const flap = t > E.palomas ? Math.max(0, Math.sin((t - E.palomas) * 14)) : 0;
  W.PIGEONHOLES.forEach((p, i) => { if (i % 5 === 3) return; const top = p.clone().add(V3(.02, .29, 0)); if (![[0, .03], [0, .3]].every(([dx, dy]) => W.visible(p.clone().add(V3(.1, dy, .14))) && W.visible(p.clone().add(V3(.1, dy, -.14))))) return;
    s += pg({ eye: blink(t, i * .7) ? 'closed' : (i % 6 === 1 ? 'wide' : 'calm'), bob: Math.sin(t * 4 + i) * .5, peck: i % 7 === 2 ? Math.max(0, Math.sin(t * 7 + i)) * .6 : 0, flap: i % 2 ? flap * .9 : 0 }, p.clone().add(V3(.04, 0, 0)), .27, { shadow: false }); });
  const fx = lerp(-1.5, -2.7, k), fz = lerp(3.0, 2.4, k), wk = walkPose(t * 7, { amp: .8 }), F = V3(fx, 0, fz);
  s += fred(Object.assign({}, wk, { face: 'smug', mouth: 'smile', turn: -.6, look: [-10, 0] }), F);
  const pp = W.proj(V3(fx, ADULT + .22, fz)); if (pp.ok) { const h = pp.ppm * .26; s += `<g transform="translate(${(pp.x - 30).toFixed(1)},${(pp.y + 6 + wk.bob * pp.ppm * .0012).toFixed(1)}) scale(${(-h / 330).toFixed(4)},${(h / 330).toFixed(4)})">${pigeon({ eye: 'calm', bob: Math.sin(t * 6) * .5 })}</g>`; }
  s += pill(540, 300, 'FRED SKINNER', YEL, P(t, E.fred, .3), 50);
  return s + motes(t, 16, .35); };
// 4 · ¿y cómo pilota una paloma? (primer plano de una paloma en su casillero)
const HOW = 6;
S.how = (t, D, B) => { const E = EVS.how(B); W.setTime(t + 12); W.charLight = DAY;
  const h = W.PIGEONHOLES[HOW], k = k01(t, 0, D), cam = h.clone().add(V3(1.25 - k * .35, .2, .45 - k * .2)), look = h.clone().add(V3(0, .17, .02)); W.setCam(cam, look, 36, cam.distanceTo(look), .007); W.render();
  const tilt = Math.sin(clamp((t - E.como) / .5) * Math.PI) * .6;
  let s = pg({ eye: 'wide', look: [4, -8], bob: tilt, flip: false }, h.clone().add(V3(.03, 0, .02)), .27, { shadow: false });
  const hp = W.proj(h.clone().add(V3(0, .42, -.04))); s += qmark(780, 560, 1.1, (t - E.como + .1) / .35);
  return s; };
// 5 · dentro del morro: ventanita arriba, pantalla con el barco delante
S.screen = (t, D, B) => { const E = EVS.screen(B); W.setTime(t + 14); W.setScreen(0); W.charLight = { tint: '#d8ffe0', k: .16, rim: '#e6fff0', rimA: .5, rimX: 1, rimY: -.3 };
  const up = 1 - k01(t, E.ventanita + .5, E.pantalla), cam = V3(W.NX + .1 + (1 - up) * .15, .85 + (1 - up) * .33, .7 + (1 - up) * .02), look = V3(W.NX + 1.4, .92 + up * .13, 0);
  W.setCam(cam, look, 46 + up * 16, 1.25, .006); W.render();
  let s = byDist([stationPigeon(1, { eye: blink(t) ? 'closed' : 'calm', goggles: true, look: up > .5 ? [4, -10] : [8, 0], bob: Math.sin(t * 3) * .2 }, .36, cam)], cam);
  if (t > E.barco) { const sp = W.proj(V3(W.NX + 1.51, 1.05, 0)); s += `<circle cx="${sp.x.toFixed(1)}" cy="${sp.y.toFixed(1)}" r="${(sp.ppm * .26 * (1 + .06 * Math.sin(t * 12))).toFixed(1)}" fill="none" stroke="${PINK}" stroke-width="10" opacity="${clamp((t - E.barco) / .2).toFixed(2)}"/>`; }
  return s; };
// 6 · el barco se va a la izquierda y la paloma lo picotea
S.peck = (t, D, B) => { const E = EVS.peck(B); W.setTime(t + 20); const sx = -.6 * k01(t, .3, E.izq + .2); W.setScreen(sx, t > E.picotea ? 1 : 0); W.charLight = { tint: '#d8ffe0', k: .16, rim: '#e6fff0', rimA: .5, rimX: 1, rimY: -.3 };
  const k = k01(t, 0, D), cam = V3(W.NX + .42 + k * .1, 1.16, .72 - k * .06), look = V3(W.NX + 1.4, .98, 0); W.setCam(cam, look, 44, cam.distanceTo(look), .006); W.render();
  const pk = t > E.picotea ? Math.pow(Math.max(0, Math.sin((t - E.picotea) * 18)), .6) : 0;
  let s = byDist([stationPigeon(1, { eye: 'angry', goggles: true, peck: pk * .35, look: [8, 2] }, .36, cam)], cam);
  if (t > E.picotea) { const sp = W.proj(V3(W.NX + 1.5, 1.05 - .0, -.12)); for (let i = 0; i < 4; i++) s += ring(sp.x, sp.y, sp.ppm * .18, ((t - E.picotea) * 3.2 - i * .28) % 1.3, YEL); }
  if (t > E.izq - .4) { const a = clamp((t - E.izq + .4) / .3); s += `<g transform="translate(300,470) scale(${(.6 + .4 * eBack(a)).toFixed(3)})" opacity="${a.toFixed(2)}"><path d="M60,-40 L-60,0 L60,40 L60,16 L150,16 L150,-16 L60,-16Z" fill="${YEL}" stroke="${K}" stroke-width="12" stroke-linejoin="round"/></g>`; }
  return s; };
// 7 · ¡y el misil gira a la izquierda! (persecución sobre el mar)
S.turn = (t, D, B) => { const E = EVS.turn(B); W.setTime(t + 23);
  const M = W.MISSILE, k = k01(t, .15, D), yaw0 = Math.PI / 2 + .35, yaw = yaw0 + k * .75, roll = -Math.sin(Math.min(1, k * 1.3) * Math.PI * .5) * .7 * (1 - Math.max(0, k - .7) * 2);
  const P0 = V3(W.SEAX + 52, 18, 70), dir = V3(Math.cos(yaw), -.12, -Math.sin(yaw)).normalize(), pos = P0.clone().addScaledVector(V3(Math.cos(yaw0 + k * .4), -.1, -Math.sin(yaw0 + k * .4)), t * 34);
  M.position.copy(pos); M.rotation.order = 'YZX'; M.rotation.set(roll, yaw, -.12);
  const back = dir.clone().multiplyScalar(-1), side = V3(-dir.z, 0, dir.x), cam = pos.clone().addScaledVector(back, 8.5).addScaledVector(side, 3.4).add(V3(0, 2.2, 0)), look = pos.clone().addScaledVector(dir, 6).add(V3(0, -.6, 0));
  W.setCam(cam, look, 50, cam.distanceTo(pos), .0006); W.render();
  let s = speedLines(t, 22, .35); const mp = W.proj(pos.clone().add(V3(0, 1.2, 0)));
  if (t > E.gira - .1) { const a = clamp((t - E.gira + .1) / .3); s += `<g transform="translate(${(mp.x - 200).toFixed(0)},${(mp.y - 160).toFixed(0)}) scale(${(.6 + .4 * eBack(a)).toFixed(3)}) rotate(-14)" opacity="${a.toFixed(2)}"><path d="M120,-60 Q-40,-90 -100,10" stroke="${K}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M120,-60 Q-40,-90 -100,10" stroke="${YEL}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M-140,-20 L-96,48 L-50,-2Z" fill="${YEL}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/></g>`; }
  return s; };
// 8 · piensa en tu perro: se sienta → galleta → al final se sienta solo
S.dog = (t, D, B) => { const E = EVS.dog(B); W.setTime(t + 25); W.charLight = DAY;
  const k = k01(t, 0, D), F = V3(1.6, 0, 1.75), cam = V3(.9 - k * .2, .62, 3.9 - k * .5), look = V3(1.75, .48, 1.75); W.setCam(cam, look, 42, cam.distanceTo(F), .005); W.render();
  const sit1 = t > E.sienta - .15 && t < E.final - .1, sit2 = t > E.solo - .25, sit = sit1 || sit2 ? 1 : 0, ck = (t - E.sienta - .05) / .45, eat = t > E.sienta + .4 && t < E.final - .1;
  let s = dogAt({ sit, wag: t, happy: eat || sit2, eye: sit2 ? 'calm' : (sit1 ? 'calm' : 'wide'), look: [6, -2] }, F, .62);
  const hp = W.proj(V3(F.x + .25, sit ? .74 : .55, F.z));
  if (ck > 0 && ck < 1) { const x = lerp(hp.x - 520, hp.x + 20, ck), y = lerp(hp.y - 120, hp.y, ck) - Math.sin(ck * Math.PI) * 220; s += cookie(x, y, hp.ppm * .0028 * (1 + .2 * Math.sin(ck * 9))); }
  if (eat) s += puff(hp.x + 40, hp.y + 10, hp.ppm * .12, clamp((t - E.sienta - .4) / .4), '#e8c08a');
  if (t > E.galleta - .05 && t < E.sienta - .15) s += cookie(140, 980, 1.6 + .1 * Math.sin(t * 8));
  if (sit2) s += sparkle(hp.x - 60, hp.y - hp.ppm * .45, hp.ppm * .35, clamp((t - E.solo + .25) / .6));
  if (sit2) s += pill(540, 380, '¡SOLO!', GREEN, P(t, E.solo - .2, .3), 54);
  return s + motes(t, 10, .25); };
// 9 · Fred hizo lo mismo: acierta en el barco → cae alpiste
S.train = (t, D, B) => { const E = EVS.train(B); W.setTime(t + 31); W.charLight = DAY;
  W.TRAIN_SCR.material.map = W.SCR_TEX; W.TRAIN_SCR.material.color.set('#ffffff'); W.TRAIN_SCR.material.needsUpdate = true; W.setScreen(Math.sin(t * 1.3) * .15, t > E.acierta && t < E.acierta + .5 ? 1 : 0);
  const k = k01(t, 0, D), cam = V3(1.05 + k * .25, 1.38, 2.35 - k * .25), look = V3(1.95, 1.18, .45); W.setCam(cam, look, 46, cam.distanceTo(V3(1.7, 1, .45)), .004); W.render();
  let s = behind(fred({ face: t > E.acierta ? 'happy' : 'smug', mouth: t > E.acierta ? 'laugh' : 'smile', turn: .3, look: [10, 8], armL: [16, 24], armR: t > E.comida ? [60 + 20 * Math.sin(t * 9), 60] : [30, 70] }, V3(1.85, 0, -.8), { shadow: false }), W.proj(V3(1.85, .9, -.1)).y);
  const pk = t > E.acierta - .35 ? Math.pow(Math.max(0, Math.sin((t - E.acierta + .35) * 14)), .6) : 0;
  s += pg({ peck: pk * .55, eye: t > E.acierta ? 'calm' : 'wide', look: [6, 0] }, V3(1.62, .9, .45), .3);
  const tray = W.TRAIN.localToWorld(new THREE.Vector3(.28, .2, .38)), tp = W.proj(tray);
  s += seeds(tp.x, tp.y - tp.ppm * .12, (t - E.comida) / .9, 12, 50, tp.ppm * .006) + seeds(tp.x, tp.y - tp.ppm * .12, (t - E.acierta - .1) / .9, 14, 60, tp.ppm * .006);
  if (t > E.acierta) s += check(780, 520, 1.2, (t - E.acierta) / .3);
  return s + motes(t, 12, .3); };
// 10 · tres palomas por si una se distrae; manda la mayoría
S.three = (t, D, B) => { const E = EVS.three(B); W.setTime(t + 36); W.setScreen(0, t > E.mayoria ? 1 : 0); W.charLight = { tint: '#d8ffe0', k: .16, rim: '#e6fff0', rimA: .5, rimX: 1, rimY: -.3 };
  const k = k01(t, 0, D), cam = V3(W.NX - 1.75 + k * .3, 1.55, .0 + Math.sin(k * 2) * .08), look = V3(W.NX + 1.0, .92, 0); W.setCam(cam, look, 78, 2.6, .003); W.render();
  const dist = t > E.distrae - .3 && t < E.mayoria + .2, pk = t > E.mayoria ? Math.pow(Math.max(0, Math.sin((t - E.mayoria) * 16)), .6) : 0;
  const L = [0, 1, 2].map(i => stationPigeon(i, i === 2 && dist ? { eye: 'calm', goggles: true, look: [-10, -6], bob: Math.sin(t * 4) * .4, flip: undefined } : { eye: i === 2 ? 'wide' : 'calm', goggles: true, peck: i === 2 ? pk * .3 : pk * .35, look: [8, 0] }, .36, cam));
  if (dist) { const { F, dir } = station(2); const a = W.proj(F), b = W.proj(F.clone().addScaledVector(dir, .3)); L[2] = { p: F, f: () => pg({ flip: b.x > a.x, eye: 'calm', goggles: true, look: [10, -8], bob: Math.sin(t * 4) * .5 }, F, .36) }; }
  let s = byDist(L, cam);
  if (dist) { const { F } = station(2), fp = W.proj(F.clone().add(V3(0, .55, .25))); const fx = fp.x + Math.sin(t * 9) * 40, fy = fp.y + Math.cos(t * 7) * 30; s += `<g transform="translate(${fx.toFixed(1)},${fy.toFixed(1)})"><ellipse cx="-8" cy="-10" rx="12" ry="8" fill="#dff" opacity=".8" stroke="${K}" stroke-width="2"/><ellipse cx="8" cy="-10" rx="12" ry="8" fill="#dff" opacity=".8" stroke="${K}" stroke-width="2"/><circle r="8" fill="${K}"/></g>`; }
  if (t > E.tres) [0, 1, 2].forEach(i => { const { F } = station(i), p = W.proj(F.clone().add(V3(0, .62, 0))); s += pill(p.x, p.y, String(i + 1), i === 2 && dist ? PINK : YEL, P(t, E.tres + i * .1, .25), 40); });
  if (t > E.mayoria) s += check(540, 420, 1.4, (t - E.mayoria - .1) / .3);
  return s; };
// 11 · el comité
const MEETY = (x) => W.proj(V3(W.MX + x, .92, -.8)).y;
S.committee = (t, D, B) => { const E = EVS.committee(B); W.setTime(t + 40); W.charLight = { tint: '#ffd9a8', k: .16, rim: '#fff0d6', rimA: .5, rimX: -1, rimY: -.5 };
  const k = k01(t, 0, D), cam = V3(W.MX + .2 - k * .4, 1.6, 4.7 - k * .5), look = V3(W.MX - .2, 1.25, -1.3); W.setCam(cam, look, 56, 5.4, .0012); W.render();
  let s = ''; const yT = MEETY(0);
  [-1.8, -.6, .6, 1.8].forEach((x, i) => s += behind(who(BOSSES[i], { turn: -.35 + i * .05, look: [-8, 0], armL: [24, 50], armR: [24, 50], face: blink(t, i) ? 'closed' : 'smug', mouth: 'line', brows: t > E.cientificos ? -.3 : 0 }, V3(W.MX + x, 0, -1.55), { shadow: false }), yT));
  s += fred({ face: 'smug', mouth: 'open', turn: .55, look: [12, -4], armL: [18, 20], armR: [120 + 10 * Math.sin(t * 5), 20] }, V3(W.MX - .6, 0, 1.4));
  const hp = W.proj(V3(W.MX - .6, ADULT + .2, 1.4)); if (hp.ok) { const h = hp.ppm * .28; s += `<g transform="translate(${(hp.x + 10).toFixed(1)},${(hp.y + 4).toFixed(1)}) scale(${(h / 330).toFixed(4)})">${pigeon({ eye: 'calm', goggles: true, bob: Math.sin(t * 5) * .4 })}</g>`; }
  s += pill(540, 300, 'COMITÉ CIENTÍFICO', YEL, P(t, E.comite, .3), 44);
  return s; };
// 12 · no les convenció → CANCELADO
S.cancel = (t, D, B) => { const E = EVS.cancel(B); W.setTime(t + 44); W.charLight = { tint: '#ffd9a8', k: .16, rim: '#fff0d6', rimA: .5, rimX: -1, rimY: -.5 };
  const k = k01(t, 0, D), shake = t > E.cancelo ? Math.max(0, 1 - (t - E.cancelo) * 4) * Math.sin((t - E.cancelo) * 60) * .04 : 0;
  const cam = V3(W.MX + .3 + shake, 1.55, 2.9 - k * .6), look = V3(W.MX + .3, 1.6 + shake, -1.55); W.setCam(cam, look, 46, 4.4, .0015); W.render();
  let s = ''; const yT = MEETY(0);
  [-.6, .6, 1.8].forEach((x, j) => { const i = j + 1; s += behind(who(BOSSES[i], { turn: -.1 * x, look: [-x * 4, 0], armL: i === 2 ? [100, 120] : [24, 50], armR: i === 2 ? [100, 120] : [24, 50], face: 'angry', mouth: i === 2 ? 'open' : 'line', headTilt: i === 2 ? Math.sin(t * 9) * 6 : 0, brows: -.6 }, V3(W.MX + x, 0, -1.55), { shadow: false }), yT); });
  s += pill(540, 330, 'OCTUBRE 1944', YEL, P(t, E.y1944, .3), 50) + stamp(540, 900, 'CANCELADO', (t - E.cancelo + .05) / .5);
  return s; };
// 13 · «una idea de chiflado»
S.crackpot = (t, D, B) => { const E = EVS.crackpot(B); W.setTime(t + 48); W.charLight = DAY;
  const k = k01(t, 0, D), cam = V3(-1.2 + Math.sin(k * 1.4) * .5, 1.7, 3.6 - k * .3), look = V3(-3.2, 1.5, 1.4); W.setCam(cam, look, 44, cam.distanceTo(V3(-3, 1.4, 1.6)), .004); W.render();
  const F = V3(-2.9, 0, 1.7), ch = t > E.chiflado - .1;
  let s = fred({ face: ch ? 'happy' : 'smug', mouth: ch ? 'laugh' : 'smirk', sweat: !ch, turn: .35, look: [8, 0], armL: [18, 20], armR: ch ? [160, 150 + 10 * Math.sin(t * 20)] : [20, 20], brows: ch ? .5 : 0 }, F);
  const hp = W.proj(V3(F.x, ADULT + .22, F.z)); if (hp.ok) { const h = hp.ppm * .26; s += `<g transform="translate(${(hp.x - 34).toFixed(1)},${(hp.y + 4).toFixed(1)}) scale(${(-h / 330).toFixed(4)},${(h / 330).toFixed(4)})">${pigeon({ eye: ch ? 'wide' : 'calm', bob: Math.sin(t * 6) * .5, flap: ch ? Math.max(0, Math.sin(t * 16)) : 0 })}</g>`;
    if (ch) { const a = clamp((t - E.chiflado + .1) / .3); for (let i = 0; i < 3; i++) { const r = (60 + i * 40) * (.6 + .4 * a), cx = hp.x + 170, cy = hp.y + 60; s += `<path d="M${cx + r},${cy} A${r},${r * .8} 0 1 1 ${cx - r * .2},${cy - r * .7}" stroke="${YEL}" stroke-width="12" fill="none" stroke-linecap="round" opacity="${a.toFixed(2)}" transform="rotate(${(t * 300 + i * 90).toFixed(0)} ${cx} ${cy})"/>`; } } }
  s += pill(540, 330, '«IDEA DE CHIFLADO»', PINK, P(t, E.chiflado, .3), 46);
  return s + motes(t, 14, .35); };
// 14 · 1948: la Marina destapa el morro y sigue probando cinco años
S.navy = (t, D, B) => { const E = EVS.navy(B); W.setTime(t + 50); W.charLight = DAY;
  const c = NOSEP(), n = NOSEN(), side = new THREE.Vector3(-n.z, 0, n.x), k = k01(t, 0, D);
  const cam = c.clone().addScaledVector(n, 3.9 - k * .5).addScaledVector(side, -.8 + k * .3).add(V3(0, .25, 0)), look = c.clone().addScaledVector(side, -.5).add(V3(0, -.2, 0)); W.setCam(cam, look, 54, cam.distanceTo(c), .002); W.render();
  const pull = clamp((t - E.resucito + .25) / .45), F = c.clone().addScaledVector(side, -.85).addScaledVector(n, .9); F.y = 0;
  let s = '';
  const cp = W.proj(c.clone().add(V3(0, .05, 0))), R0 = cp.ppm * 1.15;
  if (pull < 1) { const dx = pull * -900, dy = -pull * 500, rot = -pull * 50; s += `<g transform="translate(${(cp.x + dx).toFixed(1)},${(cp.y + dy).toFixed(1)}) rotate(${rot.toFixed(1)})" opacity="${(1 - pull * .6).toFixed(2)}"><path d="M${-R0},${R0 * .7} C${-R0 * 1.1},${-R0 * .2} ${-R0 * .5},${-R0 * .8} 0,${-R0 * .8} C${R0 * .6},${-R0 * .8} ${R0 * 1.1},${-R0 * .2} ${R0},${R0 * .7} Q${R0 * .5},${R0 * .5} 0,${R0 * .75} Q${-R0 * .5},${R0 * .5} ${-R0},${R0 * .7}Z" fill="#e8e2d2" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><path d="M${-R0 * .5},${-R0 * .5} Q0,${-R0 * .2} ${R0 * .4},${R0 * .5} M${-R0 * .1},${-R0 * .7} Q${R0 * .3},${-R0 * .2} ${R0 * .7},${R0 * .3}" stroke="#bdb5a0" stroke-width="8" fill="none"/></g>`; }
  if (pull > 0) s += puff(cp.x, cp.y + 40, cp.ppm * .9, clamp((t - E.resucito) / .7), '#d9cfb8');
  s += who(NAVY, { face: pull >= 1 ? 'happy' : 'smug', mouth: pull >= 1 ? 'smile' : 'line', turn: .45, look: [12, 0], armL: [18, 20], armR: pull > 0 && pull < 1 ? [150, 20] : [30, 30] }, F);
  s += pill(540, 320, '1948', YEL, P(t, E.y1948, .3), 60) + (t > E.marina ? pill(540, 450, 'U.S. NAVY', BLUE, P(t, E.marina, .3), 40) : '');
  if (t > E.cinco - .3) { const yr = Math.min(1953, 1948 + Math.floor(clamp((t - E.cinco + .3) / 1.3) * 5.99)); s += bigNum(540, 1180, String(yr), YEL, P(t, E.cinco - .3, .3), 170); }
  return s + motes(t, 18, .4); };
// 15 · 2024: le dieron un premio por aquellas palomas
S.prize = (t, D, B) => { const E = EVS.prize(B); W.setTime(t + 55); W.charLight = { tint: '#ffe8c8', k: .2, rim: '#fff4dc', rimA: .7, rimX: 0, rimY: -1 };
  const k = k01(t, 0, D), cam = V3(W.SX + .15 - k * .1, 1.12 - k * .06, 2.55 - k * .55), look = V3(W.SX - .18, .92, -.15); W.setCam(cam, look, 40, cam.distanceTo(V3(W.SX - .2, .8, -.15)), .004); W.render();
  const fl = t > E.premio ? Math.max(0, Math.sin((t - E.premio) * 12)) * .9 : 0;
  let s = pg({ eye: blink(t) ? 'closed' : 'calm', goggles: true, flap: fl, bob: Math.sin(t * 3) * .3, look: [6, -2] }, V3(W.SX - .42, .6, -.1), .34);
  if (t > E.premio) { for (let i = 0; i < 40; i++) { const tt = t - E.premio, x = (hs(i, 1) * 1080 + Math.sin(tt * 2 + i) * 30), y = -40 + ((tt * (180 + hs(i, 2) * 160) + hs(i, 3) * 400) % 1300); s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="16" height="26" fill="${[YEL, PINK, BLUE, GREEN, '#fff'][i % 5]}" stroke="${K}" stroke-width="3" transform="rotate(${(tt * 200 * (hs(i, 4) - .5) + i * 40).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; } }
  s += pill(540, 330, '2024', YEL, P(t, E.y2024, .3), 64) + (t > E.premio ? pill(540, 470, 'PREMIO IG NOBEL', PINK, P(t, E.premio, .3), 42) : '');
  return s + motes(t, 14, .4); };

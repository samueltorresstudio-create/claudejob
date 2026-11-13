// ---------- segunda parte: despacho de noche, la red, 1891 ----------
const OX = W.OX, Y91 = '1891';
// 9 · esa noche no pega ojo (despacho, lámpara de aceite)
S.noche = (t, D, B) => { const E = EVS.noche(B), T = window.__T || t; setup(T, 2); const BD = V3(OX + .75, 0, -1.15), tg = V3(OX + .72, 1.3, -1.15); cam(pushIn(V3(OX + 1.05, 1.7, 6.2), tg, t / D, 1.5), tg, 30, .003);
  const br = seq(t, [[0, { face: 'wide', mouth: 'line', look: [-10, 2], armL: [14, 20], armR: [14, 20], headTilt: 0, brows: .3 }], [E.pega - .15, { look: [6, -7], headTilt: 7, brows: .8, mouth: 'o' }]], .4);
  return who('BRODIE', br, BD); };
// pantalón colgado del respaldo de la silla (2D anclado a la silla), con un bolsillo enorme
function pants(fr, sag, inside) { const Tt = (x, y) => toScr(fr, x, y).map(v => v.toFixed(1)).join(','), s = fr.s, col = '#6a6a3a', dk = '#4e4e2a', py = -292 + sag * 12;
  let o = `<path d="M${Tt(-64, -360)} L${Tt(64, -360)} L${Tt(68, -250)} L${Tt(60, -84)} L${Tt(10, -84)} L${Tt(0, -236)} L${Tt(-10, -84)} L${Tt(-60, -84)} L${Tt(-68, -250)}Z" fill="${col}" stroke="${K}" stroke-width="${(8 * s).toFixed(1)}" stroke-linejoin="round"/>`;
  o += `<path d="M${Tt(-64, -360)} L${Tt(64, -360)} L${Tt(65, -336)} L${Tt(-65, -336)}Z" fill="${dk}" stroke="${K}" stroke-width="${(6 * s).toFixed(1)}" stroke-linejoin="round"/><path d="M${Tt(-40, -330)} L${Tt(-36, -100)}" stroke="${dk}" stroke-width="${(4 * s).toFixed(1)}"/>`;
  if (inside) o += inside;
  o += `<path d="M${Tt(8, py)} Q${Tt(36, py + 16 + sag * 12)} ${Tt(62, py)} L${Tt(62, py + 84 + sag * 8)} Q${Tt(35, py + 104 + sag * 18)} ${Tt(8, py + 84 + sag * 8)}Z" fill="${dk}" stroke="${K}" stroke-width="${(6 * s).toFixed(1)}" stroke-linejoin="round"/>`;
  o += `<path d="M${Tt(14, py + 4)} Q${Tt(36, py + 18 + sag * 12)} ${Tt(56, py + 4)}" stroke="#8a8a52" stroke-width="${(4 * s).toFixed(1)}" fill="none"/>`; return o; }
const bolita = (x, y, r) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#8f5228" stroke="${K}" stroke-width="${Math.max(2, r * .2).toFixed(1)}"/><path d="M${(x - r * .6).toFixed(1)},${(y - r * .2).toFixed(1)} Q${x.toFixed(1)},${(y + r * .4).toFixed(1)} ${(x + r * .6).toFixed(1)},${(y - r * .2).toFixed(1)}" stroke="#4a260f" stroke-width="${(r * .16).toFixed(1)}" fill="none"/>`;
// 10 · la idea: los bolsillos de su pantalón (algo que se trague el balón)
S.bolsillos = (t, D, B) => { const E = EVS.bolsillos(B), T = window.__T || t; setup(T, 2); const BP = V3(OX + .35, 0, -1.5), CH = V3(OX + 1.25, 0, -1.97);
  const tg = V3(OX + .78, 1.1, -1.7); cam(pushIn(V3(OX + .9, 1.55, 4.8), tg, t / D, 1.12), tg, 30, .003);
  const tt = E.trague - .35, tl = E.trague + .05, u = clamp((t - tt) / (tl - tt)), sag = t > tl ? 1 + Math.exp(-(t - tl) * 5) * Math.cos((t - tl) * 16) * .9 : 0, idea = E.balon;
  const br = seq(t, [[0, { face: 'smug', mouth: 'line', look: [4, 2], armL: [14, 20], armR: [14, 20], headTilt: 0, brows: 0 }], [E.idea - .1, { look: [-4, -6], headTilt: -4, brows: .5 }], [E.bolsillos - .2, { look: [13, 6], headTilt: 6, face: 'wide', brows: .3 }], [E.algo - .15, { armR: [96, 70], face: 'smug' }], [tt, { armR: [116, 6], lean: 4 }, .25], [idea, { face: 'happy', mouth: 'laugh', armR: [150, 20], armL: [150, 20], headTilt: -4, look: [0, -2], lean: 0 }, .35]], .45);
  const bf = frameOf(BP, ADULT), pf = frameOf(CH, ADULT), hand = handPos(BP, br, 1), pk = toScr(pf, 35, -282), r = pf.s * 30; let ball = '', inside = '';
  if (t > E.algo - .1 && t <= tt) ball = bolita(hand[0], hand[1] - r * .7, r); else if (t > tt && t < tl) { const x = lerp(hand[0], pk[0], u), y = lerp(hand[1] - r * .7, pk[1], u) - Math.sin(u * Math.PI) * 220 * pf.s; if (u < .9) ball = bolita(x, y, r); else inside = bolita(x, y, r); } else if (t >= tl) inside = bolita(pk[0], pk[1] + 34 * pf.s * Math.min(1, sag), r);
  const hp = W.proj(V3(BP.x - .32, 2.05, BP.z));
  return who('BRODIE', br, BP) + pants(pf, sag, inside) + ball + star([hp.x, hp.y], 120 * bf.s, (t - idea) / .5); };
// 11 · dibuja una red enorme detrás de la portería (el plano azul se dibuja solo bajo su lápiz)
const lapiz = `<g transform="rotate(35)"><rect x="-5" y="-8" width="10" height="64" rx="3" fill="#f2c94c" stroke="${K}" stroke-width="4"/><path d="M-5,56 L0,72 L5,56Z" fill="#e9dcc0" stroke="${K}" stroke-width="3"/></g>`;
function penXY(k) { const k1 = Math.min(1, k * 3.3), G = [[150, 420], [150, 150], [520, 150], [520, 420]], Bk = [[270, 380], [270, 200], [640, 200], [640, 380]], L = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  if (k1 < 1) { const i = Math.min(2, Math.floor(k1 * 3)); return L(G[i], G[i + 1], k1 * 3 - i); } const k2 = clamp((k - .3) / .7), S7 = [[G[1], Bk[1]], [G[2], Bk[2]], [Bk[1], Bk[2]], [Bk[1], Bk[0]], [Bk[2], Bk[3]], [G[0], Bk[0]], [G[3], Bk[3]]];
  if (k2 < 7 / 9) { const i = Math.min(6, Math.floor(k2 * 9)); return L(S7[i][0], S7[i][1], k2 * 9 - i); } const n = Math.floor(Math.max(0, k2 - .5) * 2 * 26), i = n % 13, uu = (i + .5) / 13; return n < 13 ? [270 + uu * 370, 380] : [640, 200 + uu * 180]; }
function planW(px, py) { const x = (px / 768 - .5) * 1.12, y = (.5 - py / 512) * .75, c = Math.cos(.06), s2 = Math.sin(.06); return V3(OX - .75 + x * c - y * s2, .86, -1.2 - (x * s2 + y * c)); }
S.dibuja = (t, D, B) => { const E = EVS.dibuja(B), T = window.__T || t; setup(T, 2); const k = k01(t, .1, D - .3); W.plan(k);
  const tg = V3(OX - .72, .86, -1.18); cam(pushIn(V3(OX - .4, 2.45, .95), tg, t / D, 1.22), tg, 34, .003);
  const pw = W.proj(planW(...penXY(k))); if (!pw.ok) return ''; const s = pw.ppm / 900, jx = Math.sin(t * 31) * 2 * s, jy = Math.cos(t * 27) * 2 * s, hx = pw.x + 70 * s + jx, hy = pw.y + 150 * s + jy;
  return `<path d="M${(hx + 900 * s).toFixed(1)},${(hy + 900 * s).toFixed(1)} Q${(hx + 330 * s).toFixed(1)},${(hy + 520 * s).toFixed(1)} ${hx.toFixed(1)},${hy.toFixed(1)}" stroke="${K}" stroke-width="${(26 * s).toFixed(1)}" fill="none" stroke-linecap="round"/>` +
    `<g transform="translate(${pw.x.toFixed(1)},${pw.y.toFixed(1)}) rotate(${(-28).toFixed(0)}) scale(${(s * 2.4).toFixed(3)})"><rect x="-6" y="0" width="12" height="78" rx="3" fill="#f2c94c" stroke="${K}" stroke-width="4"/><rect x="-6" y="62" width="12" height="16" rx="3" fill="#e46a8a" stroke="${K}" stroke-width="4"/><path d="M-6,0 L0,-16 L6,0Z" fill="#e9dcc0" stroke="${K}" stroke-width="3" stroke-linejoin="round"/><path d="M-2,-9 L0,-16 L2,-9Z" fill="${K}"/></g>` +
    `<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="${(30 * s).toFixed(1)}" fill="${K}"/>`; };
// 12 · los futbolistas se ríen (Brodie, al fondo, subido a una caja atando la red)
const PLY = [['DELANTERO', .3], ['ROJO2', 1.15], ['ROJO3', 2.0], ['RIVAL', 2.85]];
function redScene(T, t, mood, year, extra) { W.NET.visible = true; W.setNet({ wind: T * 2 }); W.CRATE.visible = true; W.CRATE.position.x = -1.2; const BF = V3(-1.2, 1.22, -51.5);
  return [{ p: BF, f: () => who('BRODIE', Object.assign({ face: 'smug', mouth: 'line', look: [6, 6], headTilt: 4, armL: [62 + Math.sin(T * 7) * 8, 40 + Math.sin(T * 9) * 10], armR: [58 - Math.sin(T * 7) * 8, 46 - Math.sin(T * 9) * 10] }, extra || {}), BF) }]; }
S.rien = (t, D, B) => { const E = EVS.rien(B), T = window.__T || t; setup(T, 0, .1); const L = redScene(T, t);
  PLY.forEach(([n, x], i) => { const F = V3(x, 0, -45.6 - (i % 2) * .25); L.push({ p: F, f: () => who(n, Object.assign(laugh(T, i * 1.7), i === 1 ? { armR: [120, 10] } : {}), F) }); });
  const tg = V3(.9, 1.45, -47.4); cam(pushIn(V3(3.6, 1.75, -31.5), tg, t / D, 1.35), tg, 30, .0026); return byDist(L); };
// 13 · «¿Y qué vamos a pescar, sardinas?»: el delantero hace como que lanza la caña… y saca una sardina
const sardina = `<g transform="rotate(80) scale(1.6)"><path d="M0,0 Q34,-24 82,0 Q34,24 0,0Z" fill="#9fb8cf" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M82,0 L106,-16 L98,0 L106,16Z" fill="#7f9ab4" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M14,4 Q40,16 70,4" stroke="#e6eef6" stroke-width="5" fill="none"/><circle cx="16" cy="-5" r="5" fill="${K}"/></g>`;
S.sardinas = (t, D, B) => { const E = EVS.sardinas(B), T = window.__T || t; setup(T, 0, .1); const L = redScene(T, t), ts = E.sardinas - .1, zoom = D - .5;
  const SF = V3(.3, 0, -45.6 + snap(t, .05, .4) * 1.5);
  const st = seq(t, [[0, { face: 'smug', mouth: 'smirk', armR: [20, 14], armL: [20, 14], lean: 0, headTilt: 0, turn: 0, bob: 0 }], [E.vamos - .2, { armR: [158, -24], lean: -7 }, .3], [E.pescar - .1, { armR: [78, 6], lean: 8 }, .25], [ts, { armR: [20, 14], armL: [132, 30], lean: 0, face: 'happy', headTilt: 5 }, .35]], .4);
  st.mouth = t > zoom ? 'laugh' : talkM(t, 0, 99, 'smile'); if (t > ts) st.holdL = `<g transform="scale(-1,1)">${sardina}</g>`; if (t > zoom) Object.assign(st, { bob: -Math.abs(Math.sin(T * 11)) * 10, headTilt: 5 + Math.sin(T * 11) * 5 });
  PLY.slice(1).forEach(([n, x], i) => { const F = V3(x, 0, -45.6 - (i % 2) * .25); L.push({ p: F, f: () => who(n, laugh(T, i * 1.7 + 1, t > ts ? 1.25 : .7), F) }); });
  L.push({ p: SF, f: () => who('DELANTERO', st, SF) });
  const tg = V3(SF.x + .05, 1.5, SF.z), k2 = snap(t, zoom, .3), tg2 = V3(SF.x, 1.9, SF.z), p1 = pushIn(V3(2.2, 1.6, -32), tg, t / D, 1.9); cam(L3(p1, pushIn(p1, tg2, 1, 2.1), k2), L3(tg, tg2, k2), 30, .003);
  let tears = ''; if (t > zoom) { const hq = W.proj(V3(SF.x, 1.86, SF.z)), s = hq.ppm / 250; [-1, 1].forEach(sd => { const kx = ((T * 2.2 + (sd > 0 ? .5 : 0)) % 1); tears += `<path d="M0,-14 Q10,2 0,10 Q-10,2 0,-14Z" transform="translate(${(hq.x + sd * (86 + kx * 40) * s).toFixed(1)},${(hq.y - 20 * s + kx * kx * 90 * s).toFixed(1)}) scale(${(s * 1.5).toFixed(2)})" fill="#8fd0ff" stroke="${K}" stroke-width="3" opacity="${(1 - kx).toFixed(2)}"/>`; }); }
  return byDist(L) + tears; };
// 14 · piensa en una papelera: la bola de papel entra… y se queda dentro (la cámara sube hasta mirar dentro)
S.papelera = (t, D, B) => { const E = EVS.papelera(B), T = window.__T || t; setup(T, 2); const BP = V3(OX + .2, 0, -.9), BIN = W.BIN, ts = E.si - .05, te = Math.max(ts + .6, E.entra - .05), u = clamp((t - ts) / (te - ts));
  const H = V3(OX + .72, 1.34, -.82), TOP = V3(BIN.x, .5, BIN.z); let pp, rot = T * 3;
  if (t < ts) pp = H; else if (t < te) { pp = L3(H, TOP, u); pp.y += Math.sin(u * Math.PI) * .75; rot = t * 14; } else { const d = t - te; pp = V3(BIN.x + Math.exp(-d * 5) * Math.sin(d * 21) * .07, Math.max(.1, .5 - 4.9 * d * d * 1.3) + Math.exp(-d * 6) * Math.abs(Math.sin(d * 15)) * .06, BIN.z + Math.exp(-d * 5) * Math.cos(d * 17) * .05); rot = 9 + Math.exp(-d * 4) * 5; }
  W.paper(pp, rot, true);
  const k = oc((t - ts - .1) / .75), c0 = pushIn(V3(OX + 1.6, 1.7, 6.8), V3(OX + .85, .95, -.3), Math.min(1, t / Math.max(.2, ts)), 1.2), c1 = pushIn(V3(BIN.x + .15, 2.6, BIN.z + 1.15), V3(BIN.x, .28, BIN.z), (t - te) / Math.max(.3, D - te), 1.6);
  cam(L3(c0, c1, k), L3(V3(OX + .85, .95, -.3), V3(BIN.x, .28, BIN.z), k), 30, .003);
  const br = seq(t, [[0, { face: 'smug', mouth: 'line', look: [10, 4], armR: [44, 98], armL: [14, 20], lean: 0 }], [ts - .28, { armR: [152, 30], lean: -7 }, .25], [ts, { armR: [74, 6], lean: 8, look: [13, 8] }, .2], [te, { face: 'happy', mouth: 'smile', lean: 0 }]], .4);
  return k < .35 ? who('BRODIE', br, BP) : ''; };
// 15 · nada que discutir
S.discutir = (t, D, B) => { const T = window.__T || t; setup(T, 2); const BP = V3(OX + .2, 0, -.9), tg = V3(OX + .2, 1.72, -.9); W.paper(V3(W.BIN.x, .1, W.BIN.z), 9, true); cam(pushIn(V3(OX + .95, 1.8, 6.6), tg, t / D, 1.9), tg, 30, .003);
  const br = seq(t, [[0, { face: 'smug', mouth: 'line', armL: [14, 20], armR: [14, 20], brows: 0, headTilt: 0 }], [.12, { armL: [62, -112], armR: [62, -112], brows: .6, headTilt: 4 }, .35]]); br.mouth = 'smirk'; return who('BRODIE', br, BP); };
// 16 · 1891: la prueban en un partido (atardecer, grúa hasta el delantero)
const KP2 = V3(0, 0, -40), B02 = V3(.3, .11, -40.62), GK0 = V3(-.15, 0, -51.3);
function match91(T, o = {}) { W.NET.visible = true; W.setNet(o.net || { wind: T * 2 }); const BF = V3(5.0, 0, -52.6), RF = V3(-4.2, 0, -44.5);
  return [{ p: BF, f: () => who('BRODIE', Object.assign({ face: 'smug', mouth: 'line', look: [-10, 0], armL: [10, 40], armR: [10, 40] }, o.brodie || {}), BF) }, { p: RF, f: () => who('ARBITRO', Object.assign({ face: 'smug', mouth: 'line', look: [8, 0], armL: [16, 22], armR: [16, 22] }, o.ref || {}), RF) }]; }
S.prueba = (t, D, B) => { const T = window.__T || t; setup(T, 1, .15, Y91); const L = match91(T); W.ball(B02, 0, true);
  L.push({ p: KP2, f: () => who('DELANTERO', Object.assign(kick(0), { look: [10, 2] }), KP2) }, { p: GK0, f: () => who('KEEPER', { look: [0, 2], armL: [44, 24], armR: [44, 24], legL: [12, 0], legR: [12, 0] }, GK0) });
  const cp = sp(t, [[0, V3(14, 13, -25)], [D * .55, V3(9, 5, -34)], [D, V3(7.6, 1.3, -40.2)]]), cl = sp(t, [[0, V3(0, 2, -53)], [D * .55, V3(0, 1.6, -50)], [D, V3(0, 1.15, -40.45)]]);
  cam(cp, cl, lerp(38, 30, k01(t, 0, D)), .0022); return byDist(L); };
// 17 · primer disparo… y el balón se queda temblando en la red (visto desde detrás de la red)
const netZ = y => -52 - (y >= 2.1 ? 1.4 : 1.4 + .7 * (2.1 - y) / 2.1);
S.disparo = (t, D, B) => { const E = EVS.disparo(B), T = window.__T || t; setup(T, 1, .15, Y91); const tk = Math.max(.5, E.disparo + .2),   /* chut en «disparo»; el balón llega a la red en la pausa */ tf = .42, th = tk + tf, tw = tk + .07, N = V3(-.75, 1.5, netZ(1.5) - .05), v = V3((N.x - B02.x) / tf, (N.y - B02.y + 4.9 * tf * tf) / tf, (N.z - B02.z) / tf);
  if (t > th) W.setCheer(.9);
  let bp = B02, spin = 0; const A = .95, bul = d => A * Math.exp(-d * 1.5) * Math.cos(d * 13) * (1 - Math.min(1, d * .15));
  if (t >= tk && t < th) { bp = fl(B02, v, t - tk); spin = (t - tk) * 30; } else if (t >= th) { const d = t - th, y = Math.max(.14, N.y - 4.9 * Math.max(0, d - 1.5) ** 2 * .5);   /* se queda temblando en la red y luego resbala */ bp = V3(N.x + Math.sin(d * 9) * .03 * Math.exp(-d * 2), y, netZ(y) + .1 - bul(d) * Math.min(1, y / .5 + .3) + (y < .2 ? .1 : 0)); spin = 13 + Math.exp(-d * 3) * 4 + Math.sin(T * 9) * .12 * Math.exp(-d * .8); }
  W.NET.visible = true; W.setNet(t >= th ? { hit: [N.x, N.y], t: t - th, amp: A, decay: 1.5, rest: t > th + 1.9 ? [N.x] : null, wind: T * 7 } : { wind: T * 2 });
  if (t < tw) { W.ball(bp, spin, true); cam(orb(V3(0, 1.1, -40.4), 90, 1.5, 7.6 - t * .5), V3(0, 1.15, -40.45), 30, .0022);
    return byDist([{ p: KP2, f: () => who('DELANTERO', kick(.6 + (t - tk) / .55), KP2) }, { p: bp, f: () => ball2d(bp, spin) }]); }
  // detrás de la red (mirando hacia el campo): la red 2D va ENCIMA de todo; el portero se tira tarde hacia el balón
  W.NET.visible = false; W.ball(bp, spin, false); const C0 = V3(-.5, 1.15, -56.2), tgA = V3(-.35, .66, -51.0), tgB = V3(N.x, .5, -53.6), kz = k01(t, th + .6, D), tg = L3(tgA, tgB, kz), cp = L3(C0, pushIn(C0, tgB, 1, 1.25), kz); cam(cp, tg, 72, .0014);
  const dk = clamp((t - th + .02) / .5), e = oc(dk), ang = rad(lerp(0, -76, e)), cx = GK0.x - e * .5, cy = .92 * (1 - e) + .3 * e + Math.sin(Math.min(1, dk) * Math.PI) * .45, F = V3(cx - Math.sin(ang) * .92, cy - Math.cos(ang) * .92, GK0.z), Hc = V3(cx + Math.sin(ang) * .92, cy + Math.cos(ang) * .92, GK0.z);   // se tira hacia el balón, pero tarde (el balón ya está dentro)
  const gk = Object.assign({}, CAST.KEEPER, { view: 'back', armL: [lerp(44, 168, e), 8], armR: [lerp(44, 160, e), 10], legL: [lerp(12, 4, e), 0], legR: [lerp(12, 22, e), lerp(0, 20, e)] });
  return stickAt(gk, F, Hc, W) + ball2d(bp, spin, t < th ? fl(B02, v, Math.max(0, t - tk - .04)) : null, t < th ? 1.3 : 1) + net2d(); };
// 18 · ese mismo año, obligatoria en la liga inglesa (órbita de ~98° alrededor de la portería con su red)
S.liga = (t, D, B) => { const E = EVS.liga(B), T = window.__T || t; setup(T, 1, .6, Y91); const bp = V3(.35, .14, netZ(.14) + .2), L = match91(T, { net: { rest: [.35], wind: T * 3 }, brodie: { face: 'happy', mouth: 'smile', armL: [10, 40], armR: [10, 40] }, ref: seq(t, [[0, { armR: [16, 22] }], [.25, { armR: [104, 2], look: [12, 0] }, .35]]) });
  W.ball(bp, 13, true); const GK = V3(-.9, 0, -51.5), ST = V3(1.4, 0, -44.5);
  L.push({ p: GK, f: () => who('KEEPER', { face: 'smug', mouth: 'line', look: [8, 9], headTilt: 8, armL: [30, 96], armR: [30, 96] }, GK) }, { p: ST, f: () => who('DELANTERO', cheer(T, 1), ST) });
  const k = oc(t / D), cp = orb(V3(0, 1.3, -52.4), lerp(-50, 48, k), lerp(5, 11, k), lerp(17, 25, k)); cam(cp, V3(0, 1.5, -52.4), 30, .002); return byDist(L); };
// 19 · hoy: cada vez que un balón toca la red, el estadio entero grita a la vez
function gorras(T, t0, n = 16) { let s = ''; for (let i = 0; i < n; i++) { const d = T - t0 - hs(i, 5) * 1.1; if (d < 0 || d > 1.5) continue; const x = -9 + hs(i, 2) * 18, r = Math.floor(hs(i, 3) * 9), [y0, z] = rowG(r), p = W.proj(V3(x + (hs(i, 4) - .5) * d, y0 + 2.4 + 4.6 * d - 4.2 * d * d, z)); if (!p.ok) continue; const sc = p.ppm / 230;
    s += `<g transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)}) rotate(${(d * 400 * (i % 2 ? 1 : -1)).toFixed(0)}) scale(${sc.toFixed(2)})"><path d="M-50,10 Q-50,-36 0,-38 Q50,-36 50,10Z" fill="${FHC[i % 16] || '#6b6458'}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M10,10 Q60,4 74,18 Q40,26 8,20Z" fill="#3e3a36" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></g>`; } return s; }
S.hoy = (t, D, B) => { const E = EVS.hoy(B), T = window.__T || t; setup(T, 1, .12, 'HOY'); const ti = E.toca - .12, tf = .3, th = ti + tf, ta = E.el - .12, N = V3(-.6, 1.3, netZ(1.3) + .12), p0 = V3(2.2, .8, -45.5), v = V3((N.x - p0.x) / tf, (N.y - p0.y + 4.9 * tf * tf) / tf, (N.z - p0.z) / tf), gr = E.grita - .1;
  W.NET.visible = true; const A = .8, bul = d => A * Math.exp(-d * 3.2) * Math.cos(d * 13); let bp = null, spin = t * 20;
  if (t >= ti && t < th) bp = fl(p0, v, t - ti); else if (t >= th) { const d = t - th, y = Math.max(.14, N.y - 4.9 * Math.max(0, d - .1) ** 2 * .8); bp = V3(N.x, y, netZ(y) + .12 - bul(d) * Math.min(1, y / .5 + .3)); }
  W.setNet(t >= th ? { hit: [N.x, N.y], t: t - th, amp: A, rest: t > th + .5 ? [N.x] : null, wind: T * 6 } : { wind: T * 2 }); W.ball(bp, spin, !!bp);
  if (t > gr) W.setCheer(1); else if (t > th) W.setCheer(.5);
  const w = snap(t, ta, .32), tg1 = V3(-.5, 1.25, -53.4), c1 = pushIn(V3(4.6, 1.5, -44.5), tg1, t / Math.max(.3, ta), 1.5), tg2 = V3(0, 5.2, -63), c2 = pushIn(V3(0, 3.0, -33), tg2, (t - ta) / (D - ta), 1.45);
  cam(L3(c1, c2, w), L3(tg1, tg2, w), lerp(30, 34, w), .002); return gorras(t, gr, 42); };
// 20 · gracias a un señor que dibujaba tuberías: Brodie, tranquilo entre el público que salta, se toca el bombín
S.gracias = (t, D, B) => { const E = EVS.gracias(B), T = window.__T || t; setup(T, 1, .9, Y91); const fans = standW(T, (F, id) => cheer(T, id * 1.3)), tip = E.dibujaba - .15;
  const br = seq(t, [[0, { armHalo: '#efe6d2', face: 'smug', mouth: 'smile', look: [8, 0], armR: [16, 22], armL: [16, 22], headTilt: 0, hatTilt: 0 }], [tip, { armR: [150, 128], hatTilt: 11, headTilt: 5, look: [3, 2], mouth: 'smirk' }, .4]]);
  const tg = V3(BSEAT.x, BSEAT.y + 1.62, BSEAT.z); cam(pushIn(V3(-28.5, 2.75, -23.1), tg, t / D, 1.95), tg, 30, .003); return byDist(fans.concat([{ p: BSEAT, f: () => who('BRODIE', br, BSEAT) }])); };


// ---------- fuego, astillas, humo, burbujas y cuervos (2D) ----------
function fire2d(x, y, s, t, seed = 0) { let o = ''; const L = [['#c8302e', 1, 0], ['#ff8a2a', .78, .4], ['#ffd34a', .52, .9]];
  L.forEach(([c, k, ph], li) => { for (let i = -1; i <= 1; i++) { const w = (60 - Math.abs(i) * 18) * s * k, h = (190 - Math.abs(i) * 50) * s * k * (1 + .14 * Math.sin(t * 11 + seed + i * 2 + ph)), cx = x + i * 46 * s * k, sway = Math.sin(t * 7 + seed + i + ph) * 16 * s;
    o += `<path d="M${(cx - w).toFixed(1)},${y.toFixed(1)} C${(cx - w).toFixed(1)},${(y - h * .5).toFixed(1)} ${(cx - w * .2 + sway).toFixed(1)},${(y - h * .7).toFixed(1)} ${(cx + sway * 1.6).toFixed(1)},${(y - h).toFixed(1)} C${(cx + w * .3 + sway).toFixed(1)},${(y - h * .62).toFixed(1)} ${(cx + w).toFixed(1)},${(y - h * .45).toFixed(1)} ${(cx + w).toFixed(1)},${y.toFixed(1)}Z" fill="${c}"${li === 0 ? ` stroke="${K}" stroke-width="${(6 * s).toFixed(1)}" stroke-linejoin="round"` : ''}/>`; } });
  for (let i = 0; i < 5; i++) { const k = ((t * .9 + i / 5 + seed * .13) % 1), ex = x + Math.sin(i * 2.3 + seed) * 90 * s + Math.sin(t * 3 + i) * 20 * s, ey = y - 120 * s - k * 300 * s; o += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${(5 * s * (1 - k) + 1.5).toFixed(1)}" fill="#ffd34a" opacity="${(1 - k).toFixed(2)}"/>`; }
  return o; }
function smoke2d(x, y, s, t, seed = 0) { let o = ''; for (let i = 0; i < 6; i++) { const k = ((t * .35 + i / 6 + seed * .1) % 1), r = (40 + k * 120) * s, xx = x + Math.sin(k * 4 + seed + i) * 40 * s + k * 160 * s, yy = y - k * 620 * s;
  o += `<circle cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" r="${r.toFixed(1)}" fill="#3a3038" opacity="${(.55 * (1 - k) * Math.min(1, k * 6)).toFixed(2)}"/>`; } return o; }
function splinters(x, y, s, k, seed = 0) { if (k <= 0 || k >= 1) return ''; let o = ''; for (let i = 0; i < 9; i++) { const a = -Math.PI * (.1 + .8 * hs(i, seed + 1)), v = (240 + hs(i, seed + 2) * 360) * s, xx = x + Math.cos(a) * v * k, yy = y + Math.sin(a) * v * k + 520 * s * k * k, r = (k * 900 + i * 40) * (hs(i, seed + 3) > .5 ? 1 : -1);
  o += `<g transform="translate(${xx.toFixed(1)},${yy.toFixed(1)}) rotate(${r.toFixed(0)})"><rect x="${(-34 * s).toFixed(1)}" y="${(-8 * s).toFixed(1)}" width="${(68 * s).toFixed(1)}" height="${(16 * s).toFixed(1)}" rx="${(3 * s).toFixed(1)}" fill="#8a5a32" stroke="${K}" stroke-width="${(5 * s).toFixed(1)}"/></g>`; } return o; }
function bubbles(x, y, s, t, n = 10, seed = 0) { let o = ''; for (let i = 0; i < n; i++) { const k = ((t * .45 + hs(i, seed) ) % 1), xx = x + (hs(i, seed + 1) - .5) * 260 * s + Math.sin(t * 3 + i) * 14 * s, yy = y - k * 900 * s, r = (6 + hs(i, seed + 2) * 14) * s;
  o += `<circle cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" r="${r.toFixed(1)}" fill="#dff6ff" fill-opacity=".25" stroke="#eafaff" stroke-width="${(3 * s).toFixed(1)}" opacity="${(1 - k * .7).toFixed(2)}"/><circle cx="${(xx - r * .35).toFixed(1)}" cy="${(yy - r * .35).toFixed(1)}" r="${(r * .22).toFixed(1)}" fill="#fff"/>`; } return o; }
function crow(x, y, s, t, flip = 1, seed = 0) { const peck = Math.max(0, Math.sin(t * 2.2 + seed * 2)) > .85 ? 10 : 0, cw = '#2a2836';
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(s * flip).toFixed(3)},${s.toFixed(3)})"><path d="M-4,-8 L-10,6 M10,-8 L10,6" stroke="${K}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M-30,-30 L-78,-14 L-74,-24 L-80,-30 L-34,-40Z" fill="${cw}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>` +
    `<ellipse cx="0" cy="-34" rx="36" ry="26" fill="${cw}" stroke="${K}" stroke-width="6"/><path d="M-26,-42 Q0,-30 22,-46" stroke="#4a4858" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    `<g transform="translate(30,${(-62 + peck).toFixed(0)})"><circle r="19" fill="${cw}" stroke="${K}" stroke-width="6"/><path d="M14,-6 L44,2 L14,8Z" fill="#3a3a3a" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><circle cx="6" cy="-5" r="5" fill="#ffd34a"/><circle cx="7" cy="-5" r="2" fill="${K}"/></g></g>`; }

// =====================================================================================================
// 5 · FLOTA — el puerto de La Esclusa: la flota francesa amarrada en filas (velas con lises); «los ingleses»: sus cocas entran por la derecha;
// «astillas»: golpe de zoom, impacto, astillas volando, fuego y humo en los barcos franceses.
// =====================================================================================================
S.flota = (t, D, B) => { const E = EVS.flota(B); const tA = (E.astillas || D * .55) - .05, X = W.HXc; const fire = clamp((t - tA + .1) / 1.4);
  setup(t + B[0].s, { mood: 'harbor', ff: fire, fs: 0, fi: 0 });
  W.FLEET.en.forEach((sh, i) => { sh.g.visible = i < 3; const z = lerp(14, 1.5, oc(clamp(t / (tA + .3)))) - i * 3.2; sh.g.position.set(X + 6 + i * 5.2, 0, z); sh.g.rotation.y = Math.PI / 2 - .25; });
  const punch = snap(t, tA - .05, .2), k = oc(clamp(t / D));
  cam(L3(V3(X + 21, 7, 15), V3(X + 19, 6.6, 12.5), k), V3(X - 2, 2.5, -14), lerp(50, 40, punch), .002);
  SHAKE = t > tA && t < tA + .35 ? .06 * (1 - (t - tA) / .35) : 0;
  let s = ''; const L = W.FLEET.fr.map((sh, i) => [W.proj(W.shipTop(i)), i, sh]).filter(([p]) => p.ok).sort((a, b) => b[0].d - a[0].d);
  L.forEach(([p, i, sh]) => { if ((sh.burn || 0) < .05) return; const sc = p.ppm / 200 * (.5 + sh.burn * .6); s += smoke2d(p.x, p.y - 60 * sc, sc * 1.3, t, i) + fire2d(p.x, p.y + 40 * sc, sc * 1.2, t, i); });
  if (t > tA - .05) { const c0 = W.proj(W.shipTop(15)), u = t - tA; s += impact(c0.x, c0.y + 80, 300, u / .4) + splinters(c0.x, c0.y + 60, c0.ppm / 120, u / .9, 1) + splinters(c0.x - 120, c0.y + 120, c0.ppm / 140, (u - .12) / .9, 2); }
  return s; };

// =====================================================================================================
// 6 · FONDO — bajo el agua: el estandarte de Francia cae despacio hacia el casco hundido, burbujas y rayos de luz. Sin cuerpos.
// =====================================================================================================
S.fondo = (t, D, B) => { setup(t + B[0].s, { mood: 'sea' }); const k = clamp(t / D), e = oc(k), X = W.UX;
  W.SBAN.position.set(X - .6, lerp(6.4, 2.6, e), 2.2); W.SBAN.rotation.set(0, Math.sin(t * .7) * .5, Math.sin(t * .9) * .22);
  cam(L3(V3(X + 1.6, 5.6, 10.5), V3(X + 1.1, 3.5, 9.0), e), L3(V3(X - .3, 4.6, 1.5), V3(X + .6, 2.0, -3.0), e), 50, .002);
  const b = W.proj(V3(X - .6, 2.4, 2.2)); return bubbles(b.x, b.y + 300, 1.2, t, 12, 1) + bubbles(b.x + 300, b.y + 500, 1, t + .5, 8, 4); };

// =====================================================================================================
// 7 · NADIE — los nobles, detrás del mapa, se pasan la carta como si quemara: cada uno niega con la cabeza y se la pasa al siguiente.
// =====================================================================================================
S.nadie = (t, D, B) => { setup(t + B[0].s, { mood: 'war', light: CANDLE, tk: 1, ts: 1 }); const G = W.GX, k = oc(clamp(t / D));
  cam(L3(V3(G + .15, 2.1, 4.6), V3(G + .05, 2.0, 4.1), k), V3(G, 1.45, -1.4), 46);
  const N = [['NOBLE1', -1.0, -1.45, .25], ['NOBLE3', 0, -1.7, 0], ['NOBLE2', 1.0, -1.45, -.25]], seg = D / 3.2, cur = Math.min(2, Math.floor(t / seg)), hop = clamp((t - cur * seg) / (seg * .45));
  const L = N.map(([n, x, z, tn], i) => { const has = i === cur, F = V3(G + x, 0, z); return [F, mapClip(who(n, { turn: tn, face: has ? 'wide' : 'smug', mouth: has ? 'o' : 'line', sweat: has, headTilt: has ? Math.sin(t * 22) * 6 : 0, armL: has ? [96, -20] : [14, 10], armR: has ? [96, -20] : [14, 10], brows: has ? .8 : 0 }, F, ADULT), G + x)]; });
  let s = depth(L); const A = N[Math.max(0, cur - 1)], Bn = N[cur], pa = toScr(V3(G + A[1], 0, A[2]), 0, -330), pb = toScr(V3(G + Bn[1], 0, Bn[2]), 0, -330), e = cur === 0 ? 1 : eIO2(hop);
  const lx = lerp(pa.x, pb.x, e), ly = lerp(pa.y, pb.y, e) - Math.sin(Math.PI * e) * 120; s += `<g transform="translate(${lx.toFixed(1)},${ly.toFixed(1)}) scale(${(pb.q * 1.25).toFixed(3)})">${LETTER(Math.sin(t * 9) * 8)}</g>`;
  s += [0, 1, 2].map(i => `<path d="M${(lx - 60 + i * 60).toFixed(1)},${(ly - 140 * pb.q - (t * 120 % 40)).toFixed(1)} q-14,-26 0,-50 q14,-24 0,-48" stroke="#ff8a2a" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>`).join('');
  return s; };

// =====================================================================================================
// 8 · PLAZA — de noche, con lluvia: la horca en la plaza, el último mensajero colgado (silueta lejos), cuervos en el travesaño; relámpago en «colgado».
// =====================================================================================================
function bolt(x, y, h, seed) { let d = `M${x},${y}`, xx = x, yy = y; for (let i = 0; i < 7; i++) { xx += (hs(i, seed) - .5) * 120; yy += h / 7; d += ` L${xx.toFixed(0)},${yy.toFixed(0)}`; }
  return `<path d="${d}" stroke="#eaf2ff" stroke-width="14" fill="none" stroke-linejoin="bevel" opacity=".9"/><path d="${d}" stroke="#fff" stroke-width="5" fill="none"/>`; }
S.plaza = (t, D, B) => { const E = EVS.plaza(B); const tL = (E.colgado || D * .7) - .1, lt = t > tL ? Math.exp(-(t - tL) * 5) * (Math.sin((t - tL) * 60) > -.3 ? 1 : .35) : 0;
  setup(t + B[0].s, { mood: 'plaza', light: NIGHT, lt }); const k = oc(clamp(t / D)), X = W.PX;
  cam(L3(V3(X - 1.0, 2.2, -3.6), V3(X - .55, 2.6, -5.0), k), V3(X + .1, 4.3, -10.6), 44);
  let s = ''; if (lt > .3) s += bolt(820, -20, 700, 3);
  const beam = (x) => W.proj(V3(X + x, 5.55, -10.6)); [[-1.1, 1, 0], [-.45, -1, 1.3], [.95, 1, 2.1]].forEach(([x, f, sd]) => { const p = beam(x); s += crow(p.x, p.y, p.ppm / 170, t, f, sd); });
  s += rain2d(t, 110, .5);
  if (lt > .02) s += `<rect width="1080" height="1920" fill="#e8f0ff" opacity="${(lt * .5).toFixed(3)}"/>`;
  return s; };

// =====================================================================================================
// 9 · EMPUJAN — el portón del salón del trono se abre de golpe: los nobles empujan al bufón, que entra trastabillando a contraluz.
// =====================================================================================================
S.empujan = (t, D, B) => { const open = snap(t, .05, .32); setup(t + B[0].s, { light: IN, doors: open }); const k = oc(clamp(t / D));
  cam(L3(V3(.9, 1.6, 2.6), V3(.75, 1.58, 3.4), k), V3(0, 1.85, 12.5), 46);
  const push = eIO2(clamp((t - .15) / (D * .7))), JF = V3(.1, 0, lerp(13.2, 10.8, push));
  const L = [P_('BUFON', { face: 'wide', mouth: 'o', lean: lerp(-14, 6, push), armL: [120, 30], armR: [130, 20], legL: [24, 10], legR: [-8, 6], sweat: true, hornSwing: Math.sin(t * 14) * .7 }, JF)];
  [[-1.75, 14.0, 'NOBLE1', .3], [1.75, 14.2, 'NOBLE2', -.3]].forEach(([x, z, n, tn]) => L.push(P_(n, { turn: tn, face: 'smug', mouth: 'smirk', armL: [96, -10], armR: [96, -10], lean: -6 }, V3(x, 0, z))));
  let s = depth(L); const fp = W.proj(JF); s += puff(fp.x, fp.y, 90 * fp.ppm / 260, clamp((t - .25) / .7)); return s; };

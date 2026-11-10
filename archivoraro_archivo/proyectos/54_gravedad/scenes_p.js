// ===================== «10 segundos sin gravedad» =====================
// 3D world in g3d.js (toon + outline). Characters are the channel's 2D figures, anchored to 3D points with gfig().
// Everything hangs from one story clock: g = seconds since gravity vanished (slow motion mapped to the voice).
const EVS = {}; const S = {};
['jump', 'slow', 'ball', 'rise', 'height', 'grab', 'street', 'cafe', 'car', 'iker', 'push', 'dive', 'lie', 'ten', 'fall', 'bfall', 'end'].forEach(k => EVS[k] = B => ({}));

const GDANI = { skin: '#c68a5e', hs: 'quiff', hair: '#22160f', top: '#f07a2a', topD: '#c45a18', shortSleeves: true, pants: '#25304a', shoes: '#f3f1ea', seed: 540 };
const GIKER = { skin: '#f0c8a4', hs: 'short', hat: 'cap', hatCol: '#1f3c88', hair: '#5a3a22', top: '#2f8f5b', topD: '#22704a', hood: true, strings: true, pants: '#3a3d48', shoes: '#2a2c34', build: 'heavy', seed: 541 };
const gV = (x, y, z) => new G3.THREE.Vector3(x, y, z);
const gL = (a, b, k) => a.clone().lerp(b, k);
const gN = (x, y, z) => gV(x, y, z).normalize();
const gk = (x, a, b) => clamp((x - a) / (b - a));
const gS = x => x * x * (3 - 2 * x);

// ---------- story clock ----------
const wA = (i, j) => BEATS[i].start + (j == null ? 0 : BEATS[i].wt[j]);
const lS = i => BEATS[i].start;
let _GA = null;
function GA() { if (_GA) return _GA; const T0 = wA(0, 5);
  _GA = { T0, pts: [[T0, 0], [lS(3), .04], [wA(3, 6), .07], [lS(4), .10], [lS(5), .14], [lS(6), .16], [wA(7, 1), .20], [wA(7, 8), .55], [lS(8), 2.0], [lS(10), 2.9], [lS(11), 3.3], [lS(12), 4.0], [lS(13), 4.9], [lS(14), 5.1], [lS(15), 6.2], [wA(16, 1), 7.25], [lS(17), 8.0], [lS(18), 8.6], [lS(19), 9.3], [wA(20, 2), 10.0], [lS(21), 10.9], [wA(22, 7), 12.565], [lS(23), 13.4], [lS(24) + 2.6, 16]] };
  return _GA; }
function GT(T) { const A = GA();
  if (T < A.T0) { const r0 = A.T0 - .42, pre = .42 * (1 + .03) / 2; if (T < r0) return -pre - (r0 - T); const u = (T - r0) / .42; return -pre + .42 * (u - (1 - .03) * u * u / 2); }
  const p = A.pts; for (let i = 0; i < p.length - 1; i++) if (T < p[i + 1][0]) return p[i][1] + (p[i + 1][1] - p[i][1]) * (T - p[i][0]) / (p[i + 1][0] - p[i][0]);
  return p[p.length - 1][1] + (T - p[p.length - 1][0]); }
const gNow = () => GT(window.__T || 0);

// ---------- 2D figure anchored in 3D ----------
function gfig(base, F, Hc, o = {}, sh = true) {
  let pf = G3.proj(F); const ph = G3.proj(Hc); if (!ph.ok) return { svg: '', loc: () => [0, 0], s: 0, x: 0, y: 0 };
  if (!pf.ok || pf.d < ph.d * .55) { const pm = G3.proj(Hc.clone().lerp(F, .35)); if (!pm.ok) return { svg: '', loc: () => [0, 0], s: 0, x: 0, y: 0 }; pf = { x: ph.x + (pm.x - ph.x) / .35, y: ph.y + (pm.y - ph.y) / .35, ok: true, d: pm.d }; }
  const dx = ph.x - pf.x, dy = ph.y - pf.y, L = Math.hypot(dx, dy), s = Math.max(.02, L / ((base.kid || o.kid) ? 412 : 638)), rot = Math.atan2(dx, -dy) * 180 / Math.PI;
  const loc = P => { const p = G3.proj(P), vx = (p.x - pf.x) / s, vy = (p.y - pf.y) / s, r = rot * Math.PI / 180; return [vx * Math.cos(r) + vy * Math.sin(r), -vx * Math.sin(r) + vy * Math.cos(r)]; };
  const oo = Object.assign({}, base, o); ['reachL', 'reachR'].forEach(k => { if (oo[k] && oo[k].isVector3) oo[k] = loc(oo[k]); });
  let svg = '';
  if (sh) { const gp = G3.proj(gV(F.x * .5 + Hc.x * .5, 0, F.z * .5 + Hc.z * .5)), hgt = Math.min(F.y, Hc.y); if (gp.ok) { const a = clamp(.32 - hgt * .06); if (a > 0.01) svg += `<ellipse cx="${gp.x.toFixed(1)}" cy="${gp.y.toFixed(1)}" rx="${(gp.ppm * .45).toFixed(1)}" ry="${(gp.ppm * .12).toFixed(1)}" fill="#0b0a18" opacity="${a.toFixed(2)}"/>`; } }
  const fn = oo.kid ? person : A; delete oo.kid;
  svg += fn(Object.assign(oo, { x: pf.x, y: pf.y, s, rot: (oo.rot || 0) + rot }));
  return { svg, loc, s, x: pf.x, y: pf.y, hx: ph.x, hy: ph.y };
}
const P2 = p => G3.proj(p);
function dotLine(a, b, col = '#fff', w = 6, op = .9, dash = '4 16') { const p = P2(a), q = P2(b); if (!p.ok || !q.ok) return '';
  return `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" stroke="#11131f" stroke-width="${w + 6}" stroke-dasharray="${dash}" stroke-linecap="round" opacity="${op * .6}"/><line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" opacity="${op}"/>`; }
function arrowHead(x, y, ang, col, sz = 34) { return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(1)})"><path d="M0,0 L${-sz},${-sz * .6} L${-sz * .7},0 L${-sz},${sz * .6}Z" fill="${col}" stroke="#11131f" stroke-width="6" stroke-linejoin="round" paint-order="stroke"/></g>`; }
function puff(x, y, r, k, col = '#e9dcc4') { if (k <= 0 || k >= 1) return ''; let s = ''; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + .3, d = r * (.4 + .9 * eOut(k)), rr = r * .32 * (1 - k * .6);
    s += `<circle cx="${(x + Math.cos(a) * d).toFixed(1)}" cy="${(y + Math.sin(a) * d * .35).toFixed(1)}" r="${rr.toFixed(1)}" fill="${col}" opacity="${(.8 * (1 - k)).toFixed(2)}"/>`; } return s; }
function ring(x, y, r, k, col = '#fff') { if (k <= 0 || k >= 1) return ''; return `<ellipse cx="${x}" cy="${y}" rx="${(r * eOut(k)).toFixed(1)}" ry="${(r * .3 * eOut(k)).toFixed(1)}" fill="none" stroke="${col}" stroke-width="${(10 * (1 - k)).toFixed(1)}" opacity="${(1 - k).toFixed(2)}"/>`; }
function speedLines(cx, cy, dirDeg, n, len, t, op = .5) { let s = ''; const r = dirDeg * Math.PI / 180; for (let i = 0; i < n; i++) { const off = ((i * 137) % 600) - 300, ph = (t * 3 + i * .37) % 1, ox = cx + Math.cos(r + Math.PI / 2) * off, oy = cy + Math.sin(r + Math.PI / 2) * off;
    const x1 = ox - Math.cos(r) * len * (ph - .5) * 2, y1 = oy - Math.sin(r) * len * (ph - .5) * 2; s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${(x1 - Math.cos(r) * len * .5).toFixed(1)}" y2="${(y1 - Math.sin(r) * len * .5).toFixed(1)}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="${(op * Math.sin(ph * Math.PI)).toFixed(2)}"/>`; } return s; }
function motes(t, n = 26, op = .5) { let s = ''; for (let i = 0; i < n; i++) { const x = (i * 211 + t * (6 + i % 5)) % 1080, y = (i * 389 + Math.sin(t * .4 + i) * 30 - t * (3 + i % 4)) % 1000; s += `<circle cx="${x.toFixed(1)}" cy="${((y + 1000) % 1000).toFixed(1)}" r="${2 + i % 3}" fill="#fff6d8" opacity="${(op * (.4 + .6 * Math.abs(Math.sin(t + i)))).toFixed(2)}"/>`; } return s; }
function floatHair(x, y, s, t, col, rot = 0) { return '';
  let g = ''; for (let i = 0; i < 4; i++) { const a = -40 + i * 26, w = Math.sin(t * 2 + i) * 6; g += `<path d="M${-50 + i * 32},-80 q${w},-40 ${8 + w},-${62 + i * 6}" stroke="${col}" stroke-width="13" fill="none" stroke-linecap="round"/>`; }
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s.toFixed(3)})">${g}</g>`; }

// ---------- Dani ----------
const GP_R = () => gV(.15, 3.05, -12.245), GP_L = () => gV(-.15, 3.05, -12.245);
const BALL_REL = { g: .07, p: [.35, 2.67, -12.0], v: [.02, 3.0, -.205] };
function ballPos(g) { const T = window.__T || 0;
  if (g >= BALL_REL.g) { const gg = Math.min(g, 10) - BALL_REL.g, p = gV(BALL_REL.p[0] + BALL_REL.v[0] * gg, BALL_REL.p[1] + BALL_REL.v[1] * gg, BALL_REL.p[2] + BALL_REL.v[2] * gg);
    if (g > 10) { const ft = g - 10, y0 = p.y, tImp = Math.sqrt((y0 - .12) / 4.9); if (ft < tImp) p.y = y0 - 4.9 * ft * ft; else { const b = ft - tImp, v1 = 9.8 * tImp * .6, t2 = 2 * v1 / 9.8; if (b < t2) p.y = .12 + v1 * b - 4.9 * b * b; else { const c = b - t2, v2 = v1 * .55; p.y = .12 + Math.max(0, v2 * (c % (2 * v2 / 9.8)) - 4.9 * Math.pow(c % (2 * v2 / 9.8), 2)); } } }
    return p; }
  return null; }
function dani(g) { const T = window.__T || 0; let F, H, o = {}, sh = true, u;
  if (g < -.08) { const z = -11.2 + 5 * (-.08 - g); F = gV(.25, 0, z); H = gV(.25, 1.6, z - .18); Object.assign(o, { walk: g * 15, stride: 1.45, lean: -5, look: [-6, -4], brows: 'angry' });
    const bp = (g * 2.2) % 1, by = .12 + Math.abs(Math.sin(Math.PI * ((g + 2) / .45))) * .78; o._ball = gV(.62, by, z - .35); o.reachR = gV(.62, by + .1, z - .35); }
  else if (g < .2) { const tau = Math.min(g + .08, .08), gg = Math.max(0, g); const y0 = 3.78 * tau - 4.9 * tau * tau + 3.0 * gg, z = -11.2 - 1.4 * (g + .08);
    u = gN(0, .97, -.243); F = gV(.25, y0, z); H = F.clone().addScaledVector(u, 1.62);
    const hr = H.clone().add(gV(.1, .62, -.2)); if (g >= .2 - .02) hr.copy(GP_R());
    o.reachR = g < BALL_REL.g ? hr : gL(hr, GP_R(), gk(g, .1, .2)); o.reachL = H.clone().add(gV(-.25, .55, -.18));
    o.walk = 1.3 + .25 * Math.sin(T * 1.3); o.stride = .8; o.look = [-2, -8]; o.brows = g < 0 ? 'angry' : 'up'; o.eyes = g < 0 ? 'open' : 'wide'; o.mouth = g < 0 ? 'line' : 'o';
    if (g < BALL_REL.g) o._ball = H.clone().add(gV(.1, .74, -.2)); }
  else if (g < 7.25) { let th; // swing up to horizontal, float, then turn legs down to push
    if (g < 1.5) th = 14 + 81 * gS(gk(g, .2, 1.5)); else if (g < 5.1) th = 95 + 6 * Math.sin((T) * .9); else if (g < 6.8) th = 95 - 83 * gS(gk(g, 5.1, 6.8)); else th = 12;
    const r = th * Math.PI / 180; u = gV(0, Math.cos(r), -Math.sin(r)); const two = g > 1.0, hp = two ? gL(GP_R(), GP_L(), .5) : GP_R();
    H = hp.clone().addScaledVector(u, -.6); F = H.clone().addScaledVector(u, -1.62);
    o.reachR = GP_R(); o.reachL = two ? GP_L() : H.clone().add(gV(-.4, -.2, .2)); o.walk = 1.0 + .5 * Math.sin(T * .8); o.stride = .9;
    o.eyes = 'wide'; o.brows = 'up'; o.mouth = g > 6.8 ? 'line' : 'o'; o.look = th > 60 ? [-8, 4] : [0, 8]; sh = true; }
  else if (g < 8.0) { const k = gk(g, 7.25, 8.0), kk = k < .12 ? k * k / .24 : k - .06; const kn = clamp(kk / .94);
    const H0 = GP_L().clone().lerp(GP_R(), .5).add(gV(0, -.587, .125)), H1 = gV(.15, 1.75, -14.25);
    H = gL(H0, H1, kn); const lean = Math.sin(Math.PI * Math.min(1, kn * 1.15)); u = gN(0, 1 - .4 * lean, -.21 * (1 - kn) - .85 * lean); F = H.clone().addScaledVector(u, -1.62);
    o.aL = 170 - 120 * kn; o.aR = 170 - 120 * kn; o.walk = 2.2; o.stride = .6; o.eyes = 'wide'; o.brows = 'angry'; o.mouth = 'jag'; o.look = [0, 6]; }
  else { // caught, slide down the pole, lie down, pulled away, stand up
    const Hs = gV(.15, 1.75, -14.25), Hg = gV(.35, 1.62, -14.15), Fg = gV(.35, 0, -14.0);
    const HL = gV(.55, .14, -14.04), FL = gV(.55, .12, -12.42);
    if (g < 8.4) { const k = gS(gk(g, 8.0, 8.4)); H = gL(Hs, Hg, k); F = H.clone().add(gV(0, -1.62, .25 * (1 - k))); o.reachR = gV(.05, 1.5, -14.82); o.eyes = 'wide'; o.mouth = 'o'; }
    else if (g < 13.6) { const k = gS(gk(g, 8.4, 8.9)); H = gL(Hg, HL, k); F = gL(Fg, FL, k);
      const pull = gS(gk(g, 12.0, 12.3)); H.x -= .6 * pull; F.x -= .45 * pull;
      o.aL = 175; o.aR = 175; o.eyes = g > 9.95 && g < 10.6 ? 'closed' : 'wide'; o.mouth = g > 12.5 && g < 13.2 ? 'o' : 'line'; o.brows = 'up'; o.look = [0, -10]; }
    else { const k = gS(gk(g, 13.6, 14.4)); const HL2 = HL.clone(); HL2.x -= .6; const FL2 = FL.clone(); FL2.x -= .45; F = gL(FL2, gV(.0, 0, -12.6), k); H = gL(HL2, gV(.0, 1.62, -12.62), k);
      o.look = [6, -10]; o.eyes = 'wide'; o.mouth = 'o'; o.brows = 'up'; }
    o.walk = null; }
  return { F, H, o, sh }; }
// ---------- Iker ----------
function iker(g) { const T = window.__T || 0; let F, H, o = {};
  const lift = g > 0 && g < 10 ? .0175 * Math.min(g, 4) ** 2 : 0;
  if (g < .5) { F = gV(.62, 0, -14.32); H = gV(.62, 1.66, -14.32); o.look = [-6, -6]; o.mouth = g > .1 ? 'o' : 'smile';
    if (g > 0) { const k = gS(gk(g, 0, .5)); o.reachL = gV(.06, 1.35, -14.78); o.reachR = gV(.12, 1.0, -14.75); F.x = .62 - .2 * k; H.x = .62 - .22 * k; } }
  else if (g < 4.0) { F = gV(.42, lift, -14.4); H = gV(.38, 1.66 + lift, -14.42); o.reachL = gV(.06, 1.35 + lift * .3, -14.78); o.reachR = gV(.12, 1.0 + lift * .3, -14.75); o.eyes = 'wide'; o.brows = 'up'; o.look = [-4, -10]; o.mouth = 'o'; o.walk = .9 + .3 * Math.sin(T * .7); o.stride = .5; }
  else if (g < 5.1) { const k = gS(gk(g, 4.0, 4.9)); F = gL(gV(.42, .28, -14.4), gV(.3, .55, -14.55), k); const u = gN(-.05, 1, .35 * k); H = F.clone().addScaledVector(u, 1.66 - .25 * k);
    o.reachL = gV(.06, 1.45, -14.78); o.reachR = g > 4.9 ? gV(.12, 1.1, -14.75) : null; o.aR = 120; o.walk = 1.4 + .6 * k; o.stride = 1.2; o.eyes = 'wide'; o.brows = 'angry'; o.look = [-4, -12]; o.mouth = 'line'; }
  else if (g < 7.25) { F = gV(.3, .45, -14.55); H = gV(.3, 2.08, -14.5); o.reachL = gV(.06, 1.45, -14.78); o.reachR = gV(.12, 1.1, -14.75); o.eyes = 'wide'; o.brows = 'up'; o.look = [-4, -12]; o.mouth = 'line'; o.walk = 1.0; o.stride = .5; }
  else if (g < 8.4) { const k = gS(gk(g, 8.0, 8.4)); F = gL(gV(.3, .45, -14.55), gV(-.25, 0, -14.4), k); H = gL(gV(.3, 2.08, -14.5), gV(-.25, 1.66, -14.45), k);
    o.reachL = gV(.06, 1.45 - .4 * k, -14.78); o.reachR = gV(.2, 1.3, -14.2); o.eyes = 'wide'; o.mouth = g > 7.9 ? 'jag' : 'o'; o.brows = 'up'; o.look = [6, -2]; }
  else if (g < 13.6) { const k = gS(gk(g, 8.4, 8.9)); F = gL(gV(-.25, 0, -14.4), gV(-.85, .12, -12.65), k); H = gL(gV(-.25, 1.66, -14.45), gV(-.85, .14, -14.3), k);
    const pull = gS(gk(g, 12.0, 12.3)); o.reachL = gV(-.15, .3, -14.72); o.reachR = gV(.45 - .55 * pull, .16, -13.75); o.aL = null; o.eyes = 'wide'; o.brows = g > 11.6 ? 'angry' : 'up'; o.look = [6, -8]; o.mouth = g > 11.8 && g < 12.6 ? 'jag' : 'line'; }
  else { const k = gS(gk(g, 13.6, 14.4)); F = gL(gV(-.85, .12, -12.65), gV(-.9, 0, -12.9), k); H = gL(gV(-.85, .14, -14.3), gV(-.9, 1.66, -12.92), k); o.look = [8, -10]; o.eyes = 'wide'; o.mouth = 'o'; }
  return { F, H, o }; }
function drawDani(g, extra = {}) { const d = dani(g); const f = gfig(GDANI, d.F, d.H, Object.assign(d.o, extra), d.sh); return f; }
function drawIker(g, extra = {}) { const d = iker(g); return gfig(GIKER, d.F, d.H, Object.assign(d.o, extra)); }
function rimFront() { // front arc of the rim drawn over hands that hold it
  let pts = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * .15 + i / 16 * Math.PI * .7; const p = P2(gV(Math.cos(a) * .23, 3.05, -12.42 + Math.sin(a) * .23)); if (!p.ok) return ''; pts.push(p.x.toFixed(1) + ',' + p.y.toFixed(1)); }
  const sw = Math.max(3, P2(gV(0, 3.05, -12.2)).ppm * .045); return `<polyline points="${pts.join(' ')}" fill="none" stroke="#17141f" stroke-width="${(sw + 6).toFixed(1)}" stroke-linecap="round"/><polyline points="${pts.join(' ')}" fill="none" stroke="#e9772f" stroke-width="${sw.toFixed(1)}" stroke-linecap="round"/>`; }

// ---------- world update per frame ----------
let _gInit = false; const CUPS = [];
function gInit() { if (_gInit) return; _gInit = true;
  for (let i = 0; i < 3; i++) { const c = G3.add(G3.cyl(.045, .035, .08, 14), G3.MAT.cup, 0, -9, 0); CUPS.push(c); }
  G3.TRAY = G3.add(G3.cyl(.22, .22, .02, 20), G3.MAT.steel, 0, -9, 0);
  G3.SHOE = G3.add(G3.rbox(.28, .1, .11, .04), G3.M('#f3f1ea'), 0, -9, 0); }
function world(g, T) { gInit();
  const w = Math.max(0, Math.min(10, g));
  G3.floaters(g < 0 ? 0 : g); G3.parked(g < 0 ? 0 : g); G3.setNet(T, g < 0 ? 0 : g < 10 ? clamp(w / 1.5) : 0);
  const b = ballPos(g); G3.BALL.position.copy(b || gV(0, -5, 0)); G3.BALL.rotation.set(T * .6, T * .9, 0);
  if (!b) { const d = dani(g); if (d.o._ball) G3.BALL.position.copy(d.o._ball); }
  // Dani's sneaker comes off at «si te sueltas» and stays floating where it was let go
  const gs = GT(wA(14, 4)); if (g >= gs && g < 10) { const d = dani(gs); const p = d.F.clone().add(gV(.15, -.05, .12)); p.add(gV(.02, .03, .05).multiplyScalar(g - gs)); G3.SHOE.position.copy(p); G3.SHOE.rotation.set(.3 + (g - gs) * .4, (g - gs) * .3, .2); }
  else if (g >= 10) { const d = dani(gs); const p = d.F.clone().add(gV(.15, -.05, .12)).add(gV(.02, .03, .05).multiplyScalar(10 - gs)); p.y = Math.max(.06, p.y - 4.9 * (g - 10) ** 2); G3.SHOE.position.copy(p); }
  else G3.SHOE.position.set(0, -9, 0);
  // the country road car: 25 m/s straight on, the road bends away
  const s = 88 + 25 * (Math.min(g, 10) - 3.3); let cy = 0; if (g > 0) cy = Math.min(.45, .0175 * Math.min(g, 10) ** 2);
  if (g > 10) { const ft = g - 10; cy = Math.max(0, cy - 4.9 * ft * ft); }
  G3.CAR.position.set(G3.ROAD.x0, cy, G3.ROAD.z0 - s); G3.CAR.rotation.y = 0;
  G3.CAR.userData.body.position.y = g > 0 && g < 10 ? .12 * (1 - Math.exp(-g * 2.5)) : 0; G3.CAR.userData.wheels.forEach(wh => wh.rotation.x = -s / .34);
  // café: tray cups that kept going when the waiter stopped
  CUPS.forEach((c, i) => { if (g < 0) { c.position.set(0, -9, 0); return; } const gg = Math.min(g, 10), p = gV(23.55 + .05 * i, 1.1 + .03 * i + .02 * gg, 7.45 - .35 * gg - .12 * i);
    if (g > 10) p.y = Math.max(.05, p.y - 4.9 * (g - 10) ** 2); c.position.copy(p); c.rotation.set(gg * (.3 + i * .2), 0, gg * .25); });
  G3.COFFEE.forEach((b2, i) => { if (g < 0) { b2.visible = false; return; } b2.visible = true; const gg = Math.min(g, 10), ci = i % 3, p = CUPS[ci].position.clone();
    p.add(gV(.04 * Math.sin(i * 2.1), .06 + (i % 5) * .045 * Math.min(1, gg / 2), .08 * Math.cos(i * 1.7) - .05 * (i % 4))); b2.position.copy(p);
    const wob = 1 + .18 * Math.sin(T * 5 + i); b2.scale.set(wob, 2 - wob, wob); if (g > 10) { b2.position.y = Math.max(.02, b2.position.y); b2.scale.set(2.2, .2, 2.2); } });
  G3.TRAY.position.set(0, -9, 0); }
function scene3D(g, T, pos, look, fov = 50, roll = 0, shk = 0) { world(g, T); if (shk) G3.shake(Math.sin(T * 63) * shk, Math.cos(T * 51) * shk); G3.setCam(pos, look, fov, roll); G3.render(); }
const camOrbit = (c, r, a, h) => gV(c.x + Math.sin(a) * r, c.y + h, c.z + Math.cos(a) * r);

// ---------- scenes ----------
S.jump = (t, D, B) => { const T = window.__T, g = GT(T), d = dani(g), A0 = GA().T0;
  const c = d.F.clone().lerp(d.H, .5); let pos, look;
  if (T < A0) { pos = gV(1.6, 1.0, -14.0); look = c.clone().add(gV(0, .15, 0)); }
  else { const k = gS(gk(T, A0, A0 + 2.6)), k2 = gS(gk(T, A0 + 2.6, A0 + 6.3)); const a = 2.68 - .9 * k - .25 * k2, rr = 3.0 + 1.9 * k + .5 * k2; pos = camOrbit(c, rr, a, .2 + .5 * k); look = c.clone().add(gV(0, .35 + .55 * k, -.5 * k)); }
  const hit = clamp(1 - Math.abs(T - A0) / .25);
  scene3D(g, T, pos, look, 52, 0, hit * .05);
  let s = ''; const ik = drawIker(g); s += ik.svg;
  const dn = drawDani(g); s += dn.svg; if (g >= 0) s += floatHair(dn.hx, dn.hy, dn.s, T, GDANI.hair);
  // the moment gravity switches off: shockwave over the court, a flash, everything starts to lift
  const k = (T - A0) / 1.2; const gp = P2(gV(0, 0, -10)); if (gp.ok) s += ring(gp.x, gp.y, 900, k, '#bfe6ff') + ring(gp.x, gp.y, 600, k - .15, '#ffffff');
  if (T > A0 && T < A0 + .25) s += `<rect width="1080" height="1100" fill="#dff3ff" opacity="${(.5 * (1 - (T - A0) / .25)).toFixed(2)}"/>`;
  if (T > A0) s += motes(T, 22, .45);
  if (T < A0) s += speedLines(540, 600, 180, 10, 260, T * 2, .35);
  if (t > B[1].s + .2 && t < B[1].s + 3) s += tag(Math.min(900, dn.hx + 170), Math.max(300, dn.hy - 40), 'DANI · 16 AÑOS', BLUE, P(t, B[1].s + .2, .3) * (1 - P(t, B[1].s + 2.7, .3)));
  return s; };
S.slow = (t, D, B) => { const T = window.__T, g = GT(T), d = dani(g);
  const c = gV(.1, 2.0, -12.6), a = -.55 + t * .13; const pos = camOrbit(c, 8.5 - t * .35, a, 3.2 - t * .25);
  scene3D(g, T, pos, c, 50);
  let s = drawIker(g).svg; const dn = drawDani(g); s += dn.svg + floatHair(dn.hx, dn.hy, dn.s, T, GDANI.hair) + motes(T, 30, .5);
  const k = t - B[0].w[0]; if (k > 0) s += countPop('10 S', 540, 330, 150, k, YEL);
  if (t > B[0].w[2]) s += tag(540, 470, 'CÁMARA LENTA ×60', PINK, P(t, B[0].w[2], .3));
  return s; };
S.ball = (t, D, B) => { const T = window.__T, g = GT(T), d = dani(g);
  const hand = d.H.clone().add(gV(.1, .7, -.2)); const up = gk(t, B[0].w[6], B[0].w[11] + .4);
  const look = gL(d.H, hand, .45).add(gV(0, up * .5, 0)); const pos = d.H.clone().add(gV(1.05, -.55, 2.1 + t * .03));
  scene3D(g, T, pos, look, 50);
  let s = ''; const dn = drawDani(g); s += dn.svg;
  const bp = P2(G3.BALL.position);
  if (t > B[0].w[6] && bp.ok) { const top = { x: bp.x + 40, y: -40 }, a = P(t, B[0].w[7], .5);
    s += `<g opacity="${a.toFixed(2)}"><line x1="${bp.x.toFixed(1)}" y1="${(bp.y - 70).toFixed(1)}" x2="${top.x}" y2="80" stroke="#11131f" stroke-width="16" stroke-dasharray="6 26" stroke-linecap="round"/><line x1="${bp.x.toFixed(1)}" y1="${(bp.y - 70).toFixed(1)}" x2="${top.x}" y2="80" stroke="#fff" stroke-width="9" stroke-dasharray="6 26" stroke-linecap="round"/></g>`;
    s += arrowHead(top.x, 70, -86, YEL, 46 * a);
    if (t > B[0].w[8]) s += tag(Math.min(820, bp.x + 250), 300, '3 M/S · SIN FRENO', YEL, P(t, B[0].w[8], .3)); }
  s += motes(T, 14, .4); return s; };
S.rise = (t, D, B) => { const T = window.__T, g = GT(T), d = dani(g);
  const c = d.H.clone(); const pos = gV(c.x + 1.6, Math.max(.4, d.F.y - .2), c.z + 2.7 - t * .05); const look = gV(0, 3.0 + t * .05, -12.3);
  scene3D(g, T, pos, look, 60, -.04);
  let s = ''; const dn = drawDani(g); s += dn.svg + floatHair(dn.hx, dn.hy, dn.s, T, GDANI.hair) + sweat(dn.x, dn.y, dn.s, T);
  s += speedLines(dn.x, dn.y - 150, -90, 12, 300, T * .6, .4);
  if (t > B[0].w[4]) { const a = P(t, B[0].w[4], .3); s += tag(270, 300, 'NADA LO FRENA', PINK, a); }
  return s; };
S.height = (t, D, B) => { const T = window.__T, g = GT(T); const pos = gV(10 - t * .4, 15, 17 - t * .6), look = gV(0, 15.5, -12.5);
  scene3D(g, T, pos, look, 70);
  let s = drawIker(g).svg + drawDani(g).svg;
  // ruler: 9 floors next to the hoop + ghost of Dani flying up
  const base = gV(1.8, 0, -12.2), k = clamp((t - .3) / 2.6); let rul = '';
  for (let f = 0; f <= 9; f++) { const p = P2(gV(1.8, f * 3.3, -12.2)), on = k * 30 >= f * 3.3; if (!p.ok) continue;
    rul += `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${(p.x + 28).toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${on ? YEL : '#fff'}" stroke-width="6" opacity="${on ? 1 : .5}"/>`;
    if (f > 0) rul += `<text x="${(p.x + 40).toFixed(1)}" y="${(p.y + 9).toFixed(1)}" font-family="JetBrains Mono" font-weight="800" font-size="26" fill="${on ? YEL : '#fff'}" stroke="#11131f" stroke-width="6" paint-order="stroke" opacity="${on ? 1 : .55}">PISO ${f}</text>`; }
  const p0 = P2(base), p1 = P2(gV(1.8, 30, -12.2)); if (p0.ok && p1.ok) rul = `<line x1="${p0.x.toFixed(1)}" y1="${p0.y.toFixed(1)}" x2="${p1.x.toFixed(1)}" y2="${p1.y.toFixed(1)}" stroke="#fff" stroke-width="5" opacity=".6"/>` + rul;
  s += rul;
  const d = dani(g), up = 30 * gS(k); const gF = d.F.clone().add(gV(0, up, 0)), gH = d.H.clone().add(gV(0, up, 0));
  s += dotLine(d.H.clone().add(gV(0, .4, 0)), gH.clone().add(gV(0, .3, 0)), '#fff', 6, .8);
  s += `<g opacity="${(.55 * Math.min(1, k * 6)).toFixed(2)}">${gfig(GDANI, gF, gH, Object.assign({}, d.o, { reachR: null, reachL: null, aL: 165, aR: 165 }), false).svg}</g>`;
  if (t > B[0].w[5]) s += countPop('30 M', 300, 330, 130, t - B[0].w[5], PINK);
  if (t > B[0].w[7]) s += tag(300, 470, '9 PISOS = CAÍDA MORTAL', PINK, P(t, B[0].w[7], .3));
  return s; };
S.grab = (t, D, B) => { const T = window.__T, g = GT(T), tA = B[1].w[1], tI = B[1].w[8];
  let pos, look; const gp = GP_R();
  if (t < tI) { const k = gS(gk(t, 0, tA)); pos = gV(1.9 - .3 * k, 2.0 + .3 * k, -9.5 - .4 * k); look = gp.clone().add(gV(-.1, -.45, .1)); }
  else { const k = gS(gk(t, tI, tI + 1.2)); pos = gL(gV(1.6, 2.3, -9.9), gV(2.4, 1.6, -11.6), k); look = gL(gp.clone().add(gV(-.1, -.45, .1)), gV(.2, 1.3, -14.6), k); }
  const hit = clamp(1 - Math.abs(t - tA) / .3);
  scene3D(g, T, pos, look, 52, 0, hit * .03);
  let s = drawIker(g).svg; const dn = drawDani(g); s += dn.svg + floatHair(dn.hx, dn.hy, dn.s, T, GDANI.hair);
  if (g >= .19) s += rimFront();
  if (t > tA - .05 && t < tA + .5) { const p = P2(gp); s += ring(p.x, p.y, 220, (t - tA) / .5, YEL); }
  if (t > tA && t < tI) s += tag(760, 330, '¡AGARRADO!', GREEN, P(t, tA + .1, .25) * (1 - P(t, tI - .3, .3)));
  if (t > tI + .4) { const ip = drawIker(g); s += tag(Math.min(860, ip.hx + 200), Math.max(300, ip.hy - 60), 'IKER', BLUE, P(t, tI + .4, .3)); }
  return s; };
// street: people on the sidewalk, cars, shops
const STREETP = [{ c: 'C05', x: 23.0, z: -15.5, look: [-4, -2] }, { c: 'C12', x: 23.4, z: -12.6, look: [6, 0] }, { c: 'C20', x: 22.6, z: -9.8, look: [-6, -4] }, { c: 'C09', x: 23.5, z: -7.0, look: [-4, 2] }, { c: 'C16', x: 22.8, z: -4.2, look: [4, -6] }];
function streetPeople(g, T, opts = {}) { let s = ''; const ft = g > 10 ? g - 10 : 0;
  STREETP.forEach((p, i) => { const ch = CAST_BY_ID[p.c]; if (!ch) return; let lift = g > 0 ? .019 * Math.min(g, 10) ** 2 * (1 + i * .08) : 0; if (ft > 0) lift = Math.max(0, lift - 4.9 * ft * ft);
    const sway = g > 0 && ft === 0 ? Math.sin(T * .8 + i) * 3 : 0; const F = gV(p.x, lift, p.z), H = gV(p.x + .02, lift + (ch.kid ? 1.25 : 1.62), p.z);
    const o = Object.assign({}, ch.o, { kid: !!ch.kid, look: p.look, eyes: g > 0 ? 'wide' : 'open', mouth: g > 0 ? 'o' : 'line', brows: g > 0 ? 'up' : null, rot: sway, walk: g > 0 && ft === 0 ? 1.1 + .4 * Math.sin(T * .6 + i) : null, stride: .6, aL: g > 0 && ft === 0 ? 40 + 20 * Math.sin(T + i) : null, aR: g > 0 && ft === 0 ? 50 + 20 * Math.cos(T * .9 + i) : null });
    if (ft > 0 && lift === 0) { o.eyes = 'closed'; o.mouth = 'jag'; }
    s += gfig(o, F, H, {}).svg; });
  return s; }
S.street = (t, D, B) => { const T = window.__T, g = GT(T); const t2 = B[1].s;
  let pos, look; if (t < t2) { pos = gV(20.0, 1.45, -4.0 - t * .9); look = gV(23.1, 1.1, -10.2 - t * .45); }
  else { const k = t - t2; pos = gV(19.7, 1.0, -7.3 - k * .05); look = gV(22.6, .95, -9.8); }
  scene3D(g, T, pos, look, t < t2 ? 52 : 46);
  let s = streetPeople(g, T);
  if (t < t2 && t > B[0].w[2]) { const a = P(t, B[0].w[2], .3), p0 = P2(gV(22.6, 1.85, -9.8)), p = { x: Math.min(930, p0.x + 230), y: Math.max(560, p0.y), ok: p0.ok }; if (p.ok) {
      s += `<g opacity="${a.toFixed(2)}"><line x1="${p.x}" y1="${p.y}" x2="${p.x}" y2="${(p.y - 300).toFixed(1)}" stroke="#11131f" stroke-width="16" stroke-dasharray="6 24" stroke-linecap="round"/><line x1="${p.x}" y1="${p.y}" x2="${p.x}" y2="${(p.y - 300).toFixed(1)}" stroke="#fff" stroke-width="9" stroke-dasharray="6 24" stroke-linecap="round"/></g>` + arrowHead(p.x, p.y - 310, -90, '#fff', 40 * a);
      const xk = P(t, B[0].w[5], .25); if (xk > 0) s += `<g transform="translate(${p.x},${(p.y - 170).toFixed(1)}) scale(${(.6 + .4 * eBack(xk)).toFixed(3)})"><path d="M-90,-90 L90,90 M90,-90 L-90,90" stroke="#11131f" stroke-width="44" stroke-linecap="round"/><path d="M-90,-90 L90,90 M90,-90 L-90,90" stroke="${PINK}" stroke-width="28" stroke-linecap="round"/></g>`;
      if (t > B[0].w[6]) s += tag(300, 840, 'NO SALES AL ESPACIO', PINK, P(t, B[0].w[6], .3)); } }
  if (t >= t2) { const ch = STREETP[2], lift = .019 * g * g * (1 + 2 * .08), p0 = P2(gV(ch.x + .25, 0, ch.z)), p1 = P2(gV(ch.x + .25, lift, ch.z));
    if (p0.ok && p1.ok) { s += `<line x1="${p0.x}" y1="${p0.y}" x2="${p1.x}" y2="${p1.y}" stroke="${YEL}" stroke-width="6"/><line x1="${p0.x - 22}" y1="${p0.y}" x2="${p0.x + 22}" y2="${p0.y}" stroke="${YEL}" stroke-width="6"/><line x1="${p1.x - 22}" y1="${p1.y}" x2="${p1.x + 22}" y2="${p1.y}" stroke="${YEL}" stroke-width="6"/>`;
      s += countPop('+' + Math.round(lift * 100) + ' CM', Math.min(900, p1.x + 190), p1.y - 60, 64, t - t2, YEL); }
    if (t > B[1].w[7]) s += tag(820, 820, 'COMO UN GLOBO', YEL, P(t, B[1].w[7], .3)); }
  s += motes(T, 16, .35); return s; };
const WAITER = { skin: '#d9a07a', hs: 'sidepart', hair: '#2a1a12', top: '#f4f1ea', topD: '#cfc9bd', vest: '#1f1f28', tie: '#1f1f28', pants: '#1f1f28', shoes: '#15161c', mustache: '#2a1a12', seed: 77 };
S.cafe = (t, D, B) => { const T = window.__T, g = GT(T); const pos = gV(21.3 + t * .12, 1.4, 4.2 - t * .15), look = gV(23.7, 1.1, 6.9 - t * .15);
  scene3D(g, T, pos, look, 50);
  let s = ''; const F = gV(23.9, .12, 8.0), H = gV(23.9, 1.74, 8.0);
  s += gfig(WAITER, F, H, { reachR: gV(24.55, 1.5, 8.4), reachL: gV(23.6, 1.15, 7.7), eyes: 'wide', brows: 'up', mouth: 'o', look: [-8, 2], walk: 1.2, stride: .5 }).svg;
  const tp = P2(gV(23.6, 1.12, 7.7)); if (tp.ok) s += `<ellipse cx="${tp.x.toFixed(1)}" cy="${tp.y.toFixed(1)}" rx="${(tp.ppm * .24).toFixed(1)}" ry="${(tp.ppm * .06).toFixed(1)}" fill="#c9ced6" stroke="#17141f" stroke-width="5"/>`;
  if (t > B[0].w[5]) s += tag(330, 720, 'SIGUE MOVIÉNDOSE', PINK, P(t, B[0].w[5], .3));
  s += motes(T, 12, .3); return s; };
S.car = (t, D, B) => { const T = window.__T, g = GT(T); const cp = G3.CAR.position.clone();
  const k = gS(gk(t, 0, D)); const pos = cp.clone().add(gV(7 - 3 * k, 3.2 + k * 2.5, 9 - 2 * k)), look = cp.clone().add(gV(-1.5 * k, .6, -7 - 6 * k));
  scene3D(g, T, pos, look, 55);
  let s = speedLines(540, 600, 120, 8, 300, T, .25);
  const cpp = P2(cp.clone().add(gV(0, 1.6, 0))); if (t > B[0].w[3] && cpp.ok) s += countPop('90 KM/H', Math.max(220, Math.min(860, cpp.x)), Math.max(320, cpp.y - 110), 70, t - B[0].w[3], YEL);
  if (t > B[0].w[6]) { const a = P(t, B[0].w[6], .3); const st = cp.clone(); s += dotLine(st.clone().add(gV(0, .3, -3)), st.clone().add(gV(0, .3, -40)), YEL, 7, a * .9);
    s += tag(780, 330, 'LA CARRETERA GIRA', PINK, a); }
  return s; };
S.iker = (t, D, B) => { const T = window.__T, g = GT(T), t2 = B[1].s; let s;
  if (t < t2) { const k = gS(gk(t, 0, t2)); const pos = gL(gV(.9, 3.6, -11.4), gV(.75, 3.3, -12.0), k), look = gV(.25, 1.0, -14.5);
    scene3D(g, T, pos, look, 50); s = drawIker(g).svg + sweat(drawIker(g).x, drawIker(g).y, drawIker(g).s, T);
    if (t > B[0].w[6]) { const ip = drawIker(g); s += tag(Math.min(820, ip.hx + 230), Math.max(300, ip.hy - 120), 'VA A SALTAR', PINK, P(t, B[0].w[6], .3)); } }
  else { const d = dani(g), c = d.H.clone(); const pos = gV(1.4, 1.1, -13.6), look = gL(c, d.F, .3);
    scene3D(g, T, pos, look, 40, 0, .02);
    const dn = drawDani(g, { mouth: 'grin', mopen: 1, brows: 'angry', eyes: 'wide', look: [6, 10] }); s = drawIker(g).svg + dn.svg;
    s += bang(650, 430, '¡NO SALTES!', PINK, P(t, t2 + .05, .2), 96); }
  return s; };
S.push = (t, D, B) => { const T = window.__T, g = GT(T), t2 = B[1].s; let pos, look;
  if (t < t2) { const k = gS(gk(t, 0, t2)); pos = gL(gV(5.8, 2.7, -11.4), gV(5.2, 2.2, -12.3), k); look = gL(gV(0, 2.75, -11.9), gV(0, 2.1, -13.0), k); }
  else { const k = gS(gk(t, t2, t2 + 1.4)); pos = gL(gV(5.0, 2.0, -12.2), gV(3.4, .45, -8.4), k); look = gL(gV(0, 2.0, -13.2), gV(0, 3.6, -13.2), k); }
  scene3D(g, T, pos, look, t < t2 ? 52 : 64);
  let s = drawIker(g).svg; const dn = drawDani(g); s += dn.svg + floatHair(dn.hx, dn.hy, dn.s, T, GDANI.hair) + rimFront();
  if (t < t2) { if (t > B[0].w[4]) { const sp = P2(G3.SHOE.position); if (sp.ok) s += tag(720, 430, 'SU ZAPATILLA SE QUEDA AHÍ', YEL, P(t, B[0].w[4] + .2, .3) * (1 - P(t, B[0].w[7] - .2, .3))); }
    if (t > B[0].w[7]) { const a = P(t, B[0].w[7], .3), d = dani(g); s += dotLine(d.F.clone(), gV(.2, .3, -14.4), YEL, 7, a); const q = P2(gV(.2, .3, -14.4)), p = P2(d.F); if (q.ok && p.ok) s += arrowHead(q.x, q.y, Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI, YEL, 40 * a); } }
  else { const items = [G3.SHOE.position, gV(1.25 + .03 * g, .07 + .16 * g, -13.75 + .02 * g), gV(-1.7 - .02 * g, .21 + .1 * g, -15.7 + .02 * g), gV(-1.1 + .05 * g, .05 + .22 * g, -12.6 + .03 * g)]; const a = P(t, B[1].w[8], .3);
    items.forEach((it, i) => { const p = P2(it); if (!p.ok || p.y < 160 || p.y > 1050 || p.x < 40 || p.x > 1040) return; s += `<g opacity="${a.toFixed(2)}"><line x1="${p.x.toFixed(1)}" y1="${(p.y + 24).toFixed(1)}" x2="${p.x.toFixed(1)}" y2="${(p.y + 86).toFixed(1)}" stroke="#11131f" stroke-width="14" stroke-linecap="round"/><line x1="${p.x.toFixed(1)}" y1="${(p.y + 24).toFixed(1)}" x2="${p.x.toFixed(1)}" y2="${(p.y + 86).toFixed(1)}" stroke="${PINK}" stroke-width="7" stroke-linecap="round"/></g>` + arrowHead(p.x, p.y + 104, 90, PINK, 30 * a); });
    if (t > B[1].w[8]) s += tag(740, 440, 'TODO VA A CAER', PINK, P(t, B[1].w[8], .3)); }
  s += motes(T, 14, .35); return s; };
S.dive = (t, D, B) => { const T = window.__T, g = GT(T), t2 = B[1].s; const d = dani(g);
  const c = d.H.clone().lerp(d.F, .4); const pos = gV(4.6, .45, -13.0), look = gL(gV(0, 1.9, -13.3), c, .55);
  const tP = B[0].w[1], hitP = clamp(1 - Math.abs(t - tP) / .25), hitC = clamp(1 - Math.abs(t - t2 - .1) / .3);
  scene3D(g, T, pos, look, 54, 0, hitP * .03 + hitC * .05);
  let s = ''; if (t > t2 && t < t2 + .5) { const p = P2(gV(.1, 1.4, -14.6)); s += ring(p.x, p.y, 260, (t - t2) / .5, '#ffffff'); }
  s += drawIker(g).svg; if (g > 7.25) s += dotLine(dani(7.25).H.clone().lerp(dani(7.25).F, .4), dani(Math.min(g, 8.0)).H.clone().lerp(dani(Math.min(g, 8.0)).F, .4), YEL, 6, .8 * (1 - P(t, B[1].s + .6, .4)));
  if (g > 7.3 && g < 8.0) [.24, .12].forEach((dg, i) => { s += `<g opacity="${(.18 + i * .12).toFixed(2)}">${drawDani(g - dg).svg}</g>`; }); const dn = drawDani(g); s += dn.svg;
  if (g > 7.25 && g < 8.0) s += speedLines(dn.x, dn.y - 120, Math.atan2(P2(gV(.15, 1.75, -14.25)).y - P2(dani(7.3).H).y, P2(gV(.15, 1.75, -14.25)).x - P2(dani(7.3).H).x) * 180 / Math.PI + 180, 10, 260, T, .5);
  if (g < 7.25) s += rimFront();
  if (t > tP && t < tP + .45) { const p = P2(gL(GP_R(), GP_L(), .5)); s += ring(p.x, p.y, 200, (t - tP) / .45, YEL); }
  if (t > t2 + .1) s += tag(300, 660, '¡ATRAPADO!', GREEN, P(t, t2 + .1, .25));
  return s; };
S.lie = (t, D, B) => { const T = window.__T, g = GT(T); const pos = gV(1.6, 4.3 + t * .25, -10.9 + t * .1), look = gV(-.1, 0, -13.4);
  scene3D(g, T, pos, look, 52, 0);
  let s = drawIker(g).svg + drawDani(g).svg + motes(T, 12, .3);
  if (t > B[0].w[2]) s += tag(300, 880, 'PEGADOS AL SUELO', GREEN, P(t, B[0].w[2], .3));
  return s; };
S.ten = (t, D, B) => { const T = window.__T, g = GT(T); const d = dani(g); const pos = d.H.clone().add(gV(.02, .95 - t * .08, .02)), look = d.H.clone();
  scene3D(g, T, pos, look, 42 - t * 3);
  let s = drawDani(g, { eyes: 'wide', look: [0, -10], mouth: 'line', brows: 'up' }).svg;
  const beat = Math.pow(Math.abs(Math.sin(T * 3.4)), 8); s += `<rect width="1080" height="1100" fill="#000" opacity="${(.18 + .12 * beat).toFixed(2)}"/>`;
  if (t > B[0].w[1]) s += countPop('10', 860, 900, 200, t - B[0].w[1], PINK);
  return s; };
S.fall = (t, D, B) => { const T = window.__T, tV = B[0].w[2]; let s = '', g;
  // last frozen instant, then the montage: court · street · car · café
  const shots = [[-9, 'court'], [tV, 'court'], [tV + .75, 'street'], [tV + 1.45, 'car'], [tV + 2.05, 'cafe']];
  let cur = shots[0], st = 0; for (const sh of shots) if (t >= sh[0]) cur = sh; const local = t - cur[0];
  g = t < tV ? GT(T) : 10 + local * .9;
  const shk = t >= tV ? Math.max(0, .12 - local * .2) : 0;
  if (t < tV) { scene3D(g, T, gV(5.5, 3.2, -8.5), gV(0, 1.2, -13.5), 52); s += drawIker(GT(T)).svg + drawDani(GT(T)).svg + streetPeople(g, T); }
  else if (cur[1] === 'court') { scene3D(g, T, gV(5.5, 3.2, -8.5), gV(0, 1.2, -13.5), 52, 0, shk); s += drawIker(GT(T)).svg + drawDani(GT(T)).svg;
    [[1.4, -13.7], [-1.8, -15.6], [-1.0, -12.5]].forEach(([x, z]) => { const p = P2(gV(x, 0, z)); if (p.ok) s += puff(p.x, p.y, 70, (local - .35) / .6); }); }
  else if (cur[1] === 'street') { scene3D(g, T, gV(19.0, 1.9, -2.5), gV(23.0, 1.5, -10.0), 54, 0, shk); s += streetPeople(g, T);
    STREETP.forEach(p => { const q = P2(gV(p.x, 0, p.z)); if (q.ok) s += puff(q.x, q.y, 90, (local - .55) / .5); }); }
  else if (cur[1] === 'car') { const cp = G3.CAR.position.clone(); scene3D(g, T, cp.clone().add(gV(9, 3.5, 7)), cp.clone().add(gV(0, .5, -2)), 52, 0, shk);
    const p = P2(gV(cp.x, 0, cp.z)); if (p.ok) s += puff(p.x, p.y, 260, (local - .25) / .7, '#e8d29a'); }
  else { scene3D(g, T, gV(21.0, 1.3, 2.8), gV(23.6, .5, 5.0), 52, 0, shk); s += gfig(WAITER, gV(23.9, 0, 8.0), gV(23.9, 1.62, 8.0), { eyes: 'closed', mouth: 'jag', reachR: gV(24.55, 1.4, 8.4) }).svg;
    CUPS.forEach(c => { const p = P2(gV(c.position.x, .02, c.position.z)); if (p.ok) s += puff(p.x, p.y, 60, (local - .3) / .5, '#7a4a28'); }); }
  if (t >= tV && t < tV + .15) s += `<rect width="1080" height="1100" fill="#fff" opacity="${(.7 * (1 - (t - tV) / .15)).toFixed(2)}"/>`;
  if (t >= tV) s += bang(540, 330, '¡BUM!', PINK, P(t, tV, .15) * (1 - P(t, tV + .7, .2)), 120);
  return s; };
S.bfall = (t, D, B) => { const T = window.__T, g = GT(T), t2 = B[0].w[7] - .2, t3 = B[1].s, tImp = B[1].w[7]; let s = '';
  if (t < t2) { const pos = gV(1.7, .6, -13.3), look = G3.BALL.position.clone().add(gV(.3, 0, .4)); scene3D(g, T, pos, look, 54);
    const bp = P2(G3.BALL.position); const hgt = Math.max(0, G3.BALL.position.y - .2);
    if (bp.ok) { const br = Math.max(13, bp.ppm * .12); s += `<circle cx="${bp.x.toFixed(1)}" cy="${bp.y.toFixed(1)}" r="${br.toFixed(1)}" fill="#ec7a2c" stroke="#17141f" stroke-width="4"/><path d="M${(bp.x - br).toFixed(1)},${bp.y.toFixed(1)} H${(bp.x + br).toFixed(1)} M${bp.x.toFixed(1)},${(bp.y - br).toFixed(1)} V${(bp.y + br).toFixed(1)}" stroke="#17141f" stroke-width="3"/><circle cx="${bp.x.toFixed(1)}" cy="${bp.y.toFixed(1)}" r="${(br + 22).toFixed(1)}" fill="none" stroke="${PINK}" stroke-width="6"/>`;
      if (t > B[0].w[3]) s += countPop(hgt.toFixed(0) + ' M', Math.min(880, bp.x + 170), Math.max(300, bp.y + 10), 72, t - B[0].w[3], PINK); } }
  else if (t < t3) { const pos = gV(2.6, .9, -12.0), look = gV(-.1, 1.6, -14.0); scene3D(g, T, pos, look, 62);
    s += drawIker(g).svg + drawDani(g).svg; s += dotLine(G3.BALL.position.clone().add(gV(0, -.2, 0)), gV(.55, .3, -14.04), PINK, 6, P(t, t2 + .2, .3));
    s += tag(320, 330, 'JUSTO ENCIMA', PINK, P(t, B[0].w[7], .3)); }
  else { const k = gS(gk(t, tImp + .2, tImp + 1.8)); const pos = gL(gV(2.5, .7, -12.3), gV(3.4, 1.4, -10.6), k), look = gL(gV(-.05, .4, -14.0), gV(.1, 1.0, -13.6), k);
    const hit = clamp(1 - Math.abs(t - tImp) / .35); scene3D(g, T, pos, look, 58, 0, hit * .09);
    s += drawIker(g).svg + drawDani(g).svg;
    const ip = P2(gV(.55, 0, -14.04)); if (ip.ok) { s += puff(ip.x, ip.y, 170, (t - tImp) / .7) + ring(ip.x, ip.y, 260, (t - tImp) / .5, '#fff'); }
    if (t > tImp && t < tImp + .12) s += `<rect width="1080" height="1100" fill="#fff" opacity="${(.6 * (1 - (t - tImp) / .12)).toFixed(2)}"/>`;
    s += bang(540, 330, '¡PAM!', YEL, P(t, tImp, .12) * (1 - P(t, tImp + .9, .2)), 120);
    if (t > tImp + .9) s += tag(320, 460, 'A UN PALMO DE SU CABEZA', PINK, P(t, tImp + .9, .3)); }
  return s; };
S.end = (t, D, B) => { const T = window.__T, g = GT(T), t2 = B[1].s; let pos, look;
  if (t < t2) { const k = gS(gk(t, 0, t2)); pos = gL(gV(2.0, 1.3, -10.7), gV(2.5, 1.6, -10.1), k); look = gL(gV(-.45, 1.1, -12.8), gV(-.3, 1.6, -12.9), k); }
  else { const k = eIn(gk(t, t2, D)); pos = gL(gV(2.5, 1.6, -10.1), gV(5, 70, 8), k); look = gL(gV(-.3, 1.6, -12.9), gV(0, 0, -12.5), Math.min(1, k * 1.4)); }
  scene3D(g, T, pos, look, 54);
  let s = drawIker(g).svg + drawDani(g).svg + motes(T, 14, .3);
  if (t > t2 + B[1].w[5] - B[1].s) s += countPop('60 S', 540, 360, 200, t - (B[1].w[5]), PINK);
  return s; };

window.CFG = {
  steps: ['1. AGÁRRATE A ALGO FIJO', '2. PARA BAJAR, EMPÚJATE', '3. AL SUELO ANTES DEL 10'], stepsTitle: 'REGLAS', listEnd: 'ten',
  band: { jump: '#141a2c', slow: '#141a2c', ball: '#141a2c', rise: '#141a2c', height: '#161a2e', grab: '#141a2c', street: '#171a28', cafe: '#171a28', car: '#1a1a24', iker: '#141a2c', push: '#141a2c', dive: '#141a2c', lie: '#141a2c', ten: '#1a0f18', fall: '#1a0f18', bfall: '#1a0f18', end: '#141a2c' },
  hud: (h, bt, st, T) => { const g = GT(T); if (h === '#g') return g < 13.4 ? 'GRAVEDAD · VUELVE' : 'GRAVEDAD · NORMAL';
    if (g < 0) return 'GRAVEDAD · NORMAL'; const v = Math.min(10, g); return 'SIN GRAVEDAD · 00:' + (v < 10 ? '0' : '') + v.toFixed(1); },
  hudFrac: T => { const g = GT(T); return g >= 0 && g <= 10 ? g / 10 : null; },
};

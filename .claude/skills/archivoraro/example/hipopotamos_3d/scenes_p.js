// «Los hipopótamos de Colombia» — ESTILO 3D: río Magdalena en 3D (world_rio.js) + personajes 2D (stick.js, hippo.js).
const EVS = {
  hook: B => ({ cuatro: B[0].w[3] }), many: B => ({ n180: B[0].w[8], nadie: B[0].w[10] }), zoo: B => ({ zoo: B[0].w[6] }), gate: B => ({ murio: B[0].w[2], nadie: B[0].w[3] }),
  river: B => ({ rio: B[0].w[5] }), africa: B => ({ seq: B[0].w[4], leo: B[0].w[7], col: B[1].s, noseq: B[1].w[5], noleo: B[1].w[7] }),
  paradise: B => ({ rio: B[0].w[2], comida: B[0].w[4], nadie: B[0].w[9] }), log: B => ({ tronco: B[0].w[9], abre: B[0].w[15] }),
  yawn: B => ({ tres: B[0].w[1], pel: B[0].w[9] }), vet: B => ({ est: B[0].w[3], miles: B[0].w[7], crias: B[1].w[3] }), stamp: B => ({ inv: B[0].w[2] }),
  future: B => ({ y2035: B[0].w[6], mil: B[0].w[11] }), end: B => ({ cuatro: B[0].w[2] }),
};
const S = {};
const W = W2, T3 = W.T, K = '#1b1720';
W.charLight = { tint: '#ffd9b0', k: .14, rim: '#fff0d6', rimA: .6, rimX: -1, rimY: -.4 };
const hs = (a, b = 1) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const ease = x => x * x * (3 - 2 * x), k01 = (t, a, b) => ease(clamp((t - a) / (b - a)));
// ---------- cast ----------
const PESC = { outfit: 'shirt', top: '#f3efe2', topD: '#cfc7b3', pants: '#3b4a63', belt: '#5a3a22', scarf: '#d63c2f', hat: 'vueltiao', mustache: '#2a1a12', bag: '#8a5228', shoes: '#5a3a22', sole: '#2a2a2a', belly: 1.12 };
const VET = { outfit: 'shirt', top: '#f6f7f9', topD: '#cdd3db', pants: '#2f6a6a', belt: '#2a2a2a', hair2: 'side', hairCol: '#3a2418', glasses: true, shoes: '#f4f2ec', sole: '#2f6a6a', prop: 'syringe' };
const MALE = { style: 'B' }, FEM = [{ style: 'A', skin: '#a294bf' }, { style: 'A', skin: '#9a8fb6', skinD: '#685c8e' }, { style: 'A', skin: '#ab9cc4' }];
// ---------- world additions: the hacienda gate with the little plane on top ----------
const zG = -20, xG = W.mid(zG) + W.RW + 6.5, yG = W.hgt(xG, zG);
const rb = z => W.mid(z) + W.RW;                       // right bank water line
const gy = (x, z) => Math.max(W.hgt(x, z), 0);         // ground (or water surface)
(function buildGate() {
  const STD = o => new T3.MeshStandardMaterial(Object.assign({ roughness: .8 }, o)), add = (geo, m, x, y, z, o = {}) => { const me = new T3.Mesh(geo, m); me.position.set(x, y, z); if (o.ry) me.rotation.y = o.ry; if (o.rz) me.rotation.z = o.rz; if (o.rx) me.rotation.x = o.rx; me.castShadow = true; me.receiveShadow = true; (o.p || W.scene).add(me); return me; };
  // clear vegetation / houses around the gate and along the path to the water
  W.scene.children.forEach(o => { if (o.isGroup && o.position && Math.hypot(o.position.x - xG, o.position.z - zG) < 9) o.visible = false; if (o.isGroup && o.position && Math.abs(o.position.z - zG) < 6 && o.position.x > rb(zG) - 1 && o.position.x < xG + 2) o.visible = false; });
  // no floating hyacinths in front of the bank cameras (z -40..-20)
  W.scene.children.forEach(o => { if (o.isGroup && o.position && Math.abs(o.position.y - .02) < .01 && o.position.z > -42 && o.position.z < -14) o.visible = false; });
  const g = new T3.Group(); g.position.set(xG, yG, zG); W.scene.add(g); const white = STD({ color: '#efe8da' }), wood = STD({ color: '#8a5a32' });
  [-1, 1].forEach(sd => { add(new T3.BoxGeometry(1.1, 4.4, 1.1), white, 0, 2.2, sd * 3.6, { p: g }); add(new T3.BoxGeometry(1.4, .3, 1.4), STD({ color: '#c9b79a' }), 0, 4.5, sd * 3.6, { p: g }); });
  add(new T3.BoxGeometry(.5, .5, 8.4), white, 0, 4.85, 0, { p: g });
  const c = document.createElement('canvas'); c.width = 1024; c.height = 160; const x2 = c.getContext('2d'); x2.fillStyle = '#f4efe2'; x2.fillRect(0, 0, 1024, 160); x2.strokeStyle = '#1b1720'; x2.lineWidth = 14; x2.strokeRect(7, 7, 1010, 146);
  x2.fillStyle = '#1b1720'; x2.font = '900 96px Inter'; x2.textAlign = 'center'; x2.fillText('HACIENDA NÁPOLES', 512, 118); const st = new T3.CanvasTexture(c); st.colorSpace = T3.SRGBColorSpace;
  const sign = add(new T3.BoxGeometry(.12, 1.0, 6.4), [STD({ color: '#f4efe2' }), STD({ map: st }), STD({ color: '#f4efe2' }), STD({ color: '#f4efe2' }), STD({ color: '#f4efe2' }), STD({ color: '#f4efe2' })], -.35, 4.0, 0, { p: g });
  W.GATESIGN = sign;
  // crest on top of the gate
  add(new T3.BoxGeometry(.6, .9, 2.2), white, 0, 5.55, 0, { p: g }); add(new T3.BoxGeometry(.7, .2, 2.4), STD({ color: '#c9b79a' }), 0, 6.05, 0, { p: g });
  // wooden fence along the bank on both sides of the gate
  [-1, 1].forEach(sd => { for (let k = 0; k < 7; k++) { const zz = sd * (5 + k * 2.2); add(new T3.CylinderGeometry(.09, .09, 1.6, 6), wood, 0, .8, zz, { p: g }); }
    [.6, 1.2].forEach(y => add(new T3.BoxGeometry(.08, .12, 15), wood, 0, y, sd * 11.6, { p: g })); });
  // outlines for the new meshes (same ink as the world)
  const ms = []; g.traverse(o => { if (o.isMesh) ms.push(o); }); ms.forEach(o => { let ge = o.geometry.clone(); ['normal', 'uv'].forEach(a => ge.deleteAttribute(a)); ge = mergeVertices(ge, 1e-3); ge.computeVertexNormals(); ge.clearGroups(); const h = new T3.Mesh(ge, W.inkM); o.add(h); });
})();
// ---------- 2D helpers ----------
function pill(x, y, txt, col = YEL, a = 1, sz = 46) { if (a <= 0) return ''; const w = txt.length * sz * .62 + 70, sc = .7 + .3 * eBack(clamp(a));
  return `<g transform="translate(${x},${y}) scale(${sc.toFixed(3)})" opacity="${clamp(a * 1.6).toFixed(2)}"><rect x="${-w / 2 + 6}" y="${-sz * .85 + 8}" width="${w}" height="${sz * 1.6}" rx="10" fill="#000" opacity=".3"/><rect x="${-w / 2}" y="${-sz * .85}" width="${w}" height="${sz * 1.6}" rx="10" fill="#14121c" stroke="${col}" stroke-width="5"/><rect x="${-w / 2}" y="${-sz * .85}" width="22" height="${sz * 1.6}" rx="6" fill="${col}"/><text x="11" y="${sz * .3}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${sz}" fill="#fff">${txt}</text></g>`; }
function bigNum(x, y, txt, col, a, sz = 210) { if (a <= 0) return ''; const sc = .5 + .5 * eBack(clamp(a)); return `<g transform="translate(${x},${y}) scale(${sc.toFixed(3)}) rotate(-4)" opacity="${clamp(a * 2).toFixed(2)}"><text x="0" y="0" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${sz}" fill="${col}" stroke="${K}" stroke-width="${sz * .1}" stroke-linejoin="round" paint-order="stroke" style="filter:drop-shadow(0 10px 0 rgba(0,0,0,.35))">${txt}</text></g>`; }
function splash(x, y, r, k) { if (k <= 0 || k >= 1) return ''; let s = ''; for (let i = 0; i < 14; i++) { const a = -Math.PI * (.08 + .84 * hs(i, 7)), v = .6 + .8 * hs(i, 8), d = r * v * eOut(k), yy = y + Math.sin(a) * d * 1.3 + k * k * r * 1.6 * v, rr = r * (.035 + .04 * hs(i, 9)) * (1 - k * .6);
    s += `<circle cx="${(x + Math.cos(a) * d).toFixed(1)}" cy="${yy.toFixed(1)}" r="${rr.toFixed(1)}" fill="#eef8f8" stroke="${K}" stroke-width="3" opacity="${(1 - k).toFixed(2)}"/>`; }
  s += `<ellipse cx="${x}" cy="${(y - r * .12 * (1 - k)).toFixed(1)}" rx="${(r * .5 * (1 - k * .4)).toFixed(1)}" ry="${(r * .2 * (1 - k)).toFixed(1)}" fill="#eef8f8" stroke="${K}" stroke-width="4" opacity="${(.9 * (1 - k)).toFixed(2)}"/>`;
  return s + `<ellipse cx="${x}" cy="${y}" rx="${(r * (.5 + k)).toFixed(1)}" ry="${(r * .18 * (.5 + k)).toFixed(1)}" fill="none" stroke="#e9f6f6" stroke-width="${(10 * (1 - k)).toFixed(1)}" opacity="${(1 - k).toFixed(2)}"/>`; }
function coin(x, y, k) { if (k <= 0 || k >= 1) return ''; const yy = y - 220 * eOut(k) + 160 * k * k, sx = Math.abs(Math.cos(k * 12)); return `<g transform="translate(${x},${yy.toFixed(1)}) scale(${(.3 + .7 * sx).toFixed(2)},1)" opacity="${(1 - k * k).toFixed(2)}"><circle r="30" fill="#f2c94c" stroke="${K}" stroke-width="6"/><text y="13" text-anchor="middle" font-family="Inter" font-weight="900" font-size="36" fill="${K}">$</text></g>`; }
function zzz(x, y, t) { let s = ''; for (let i = 0; i < 3; i++) { const p = (t * .5 + i / 3) % 1; s += `<text x="${(x + p * 60).toFixed(1)}" y="${(y - p * 120).toFixed(1)}" font-family="Inter" font-weight="900" font-size="${(30 + p * 30).toFixed(0)}" fill="#fff" stroke="${K}" stroke-width="6" paint-order="stroke" opacity="${(Math.sin(p * Math.PI)).toFixed(2)}">Z</text>`; } return s; }
function hullFront(cam) { const g = W.HERO; g.updateMatrixWorld(true); const pts = [], bot = [];
  const sd = new T3.Vector3(-.62, 0, 0).applyMatrix4(g.matrixWorld).distanceTo(cam) < new T3.Vector3(.62, 0, 0).applyMatrix4(g.matrixWorld).distanceTo(cam) ? -1 : 1;
  for (let i = 0; i <= 24; i++) { const th = -Math.PI / 2 + i / 24 * Math.PI, z = 3.4 * Math.sin(th), x = .62 * Math.cos(th); pts.push(W.proj(new T3.Vector3(sd * x, 0, z).applyMatrix4(g.matrixWorld))); bot.push(W.proj(new T3.Vector3(0, -.38 * Math.cos(th), z).applyMatrix4(g.matrixWorld))); }
  const P = a => a.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' L');
  return `<path d="M${P(pts)} L${P(bot.reverse())}Z" fill="#3f8fa0" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M${P(pts)}" stroke="#5e3a20" stroke-width="12" fill="none" stroke-linecap="round"/>`; }
const byDist = (items, cam) => items.sort((a, b) => b.p.distanceTo(cam) - a.p.distanceTo(cam)).map(i => i.f()).join('');
// a hippo standing on the bank (feet on the ground) or in the water (y < 0 → clipped at the surface)
function hip(o, x, z, hgt = 1.75, y = null, wl = 0) { const F = V3(x, y == null ? gy(x, z) : y, z); return { p: F.clone(), f: () => hippoAt(o, F, F.clone().add(V3(0, hgt, 0)), W, F.y < -.02 ? { water: 0 } : {}) }; }
// river crowd positions (deterministic)
const CROWD = Array.from({ length: 120 }, (_, i) => { const z = 8 - hs(i, 1) * 110, x = W.mid(z) + (hs(i, 2) - .5) * 2 * (W.RW - 3); return { x, z, st: hs(i, 3) < .35 ? 'B' : 'A', baby: hs(i, 4) < .18, ph: hs(i, 5) * 6, turn: (hs(i, 6) - .5) * 1.2 }; });
function crowd(n, t, cam) { return byDist(CROWD.slice(0, n).map(c => { const bob = Math.sin(t * 1.6 + c.ph) * .05, h = c.baby ? .9 : 1.75; return hip({ style: c.st, turn: c.turn, look: [c.turn * 6, 2], ear: (Math.sin(t * 3 + c.ph) + 1) / 2, wet: true, blink: ((t + c.ph) % 4) < .15 }, c.x, c.z, h, -h * .82 + bob); }), cam); }
// the four original hippos (male + 3 females) walking / standing
function four(t, base, walkK = 0, dir = -1, cam) { const pos = [[0, -.35, MALE, 1.85], [1.3, -1.75, FEM[0], 1.6], [1.0, 1.15, FEM[1], 1.55], [2.6, .25, FEM[2], 1.6]];
  return byDist(pos.map(([dx, dz, o, h], i) => { const x = base.x + dx + dir * walkK * 0, z = base.z + dz; const wk = walkK ? t * 6 + i * 1.3 : null;
    return hip(Object.assign({ turn: -.3 + (i % 2) * .15, look: [-6, 2], walk: wk, ear: (Math.sin(t * 2.5 + i) + 1) / 2, blink: ((t + i * .9) % 3.6) < .14 }, o), x, z, h); }), cam); }
// ======================= scenes =======================
S.hook = (t, D, B) => { const E = EVS.hook(B); W.setTime(t + 1);
  // the four walk toward the camera on the bank; low dolly back
  const walk = t * .5, base = V3(rb(-26) + 3.4 - walk, 0, -27);
  const cam = V3(base.x - 12.5 + walk * .5, 1.9, base.z + 1.2), look = V3(base.x + 1.2, 1.3, base.z - .2);
  W.setCam(cam, look, 40, cam.distanceTo(look), .0022); W.render();
  let s = four(t, base, 1, -1, cam);
  s += bigNum(540, 380, '4', YEL, P(t, E.cuatro, .3)) + (t > E.cuatro ? pill(540, 520, 'HIPOPÓTAMOS', YEL, P(t, E.cuatro + .15, .3), 34) : '');
  return s + motes(t, 18, .35); };
S.many = (t, D, B) => { const E = EVS.many(B); W.setTime(t + 4);
  let s = '';
  if (t < E.nadie - .1) { const k = k01(t, 0, E.nadie); const cam = V3(W.mid(16) + 1 - k * 2, 2.4 + k * 2.2, 16 - k * 2), look = V3(W.mid(-30), .2, -30);
    W.setCam(cam, look, 46, 26, .0012); W.render(); s += crowd(Math.round(20 + 60 * k01(t, .2, E.n180)), t, cam);
    const c0 = B[0].w[4]; if (t > c0) s += bigNum(540, 420, '+' + Math.round(lerp(4, 180, k01(t, c0, E.n180))), PINK, P(t, c0, .3)) + pill(540, 560, 'HOY · COLOMBIA', YEL, P(t, c0 + .2, .3), 32); }
  else { // the fisherman, surrounded
    const cz = -8, cx = W.mid(cz) + 4; W.HERO.position.set(cx, .12, cz); W.HERO.rotation.y = .25; W.HERO.scale.set(1, 1, .62);
    const cam = V3(cx - 2.8, 1.4, cz + 5.4), look = V3(cx + .4, 1.0, cz - 2); W.setCam(cam, look, 46, 5.8, .003); W.render();
    const heads = [[2.0, -3.0], [-1.4, -4.6], [3.0, -.6], [-2.6, -1.6], [.6, -6.5], [4.2, -4.6]].map(([dx, dz], i) => hip({ style: i % 2 ? 'A' : 'B', look: [-dx * 2, 3], wet: true, turn: -dx * .1, ear: (Math.sin(t * 3 + i) + 1) / 2 }, cx + dx, cz + dz, 1.75, -1.42 + Math.sin(t * 1.8 + i) * .04));
    s += byDist(heads, cam); const tk = t - E.nadie;
    s += stickAt(Object.assign({}, PESC, { face: 'wide', mouth: 'grin', brows: 1, sweat: true, prop: 'paddle', turn: Math.sin(tk * 5) * .6, look: [Math.sin(tk * 5) * 10, 0], armL: [40, 60], armR: [60, 70], lean: Math.sin(tk * 5) * 3 }), V3(cx, -.12, cz), V3(cx, 1.5, cz), W) + hullFront(cam); }
  return s; };
S.zoo = (t, D, B) => { const E = EVS.zoo(B); W.setTime(t + 9);
  const k = k01(t, 0, D), cam = V3(xG - 18 + k * 2, 2.6, zG + 1.2 - k * .8), look = V3(xG, 3.2, zG);
  W.setCam(cam, look, 46, cam.distanceTo(V3(xG - 4, 1, zG)), .0018); W.render();
  let s = four(t, V3(xG - 4.4, 0, zG + .2), 0, -1, cam);
  s += pill(540, 640, 'ZOOLÓGICO PRIVADO', YEL, P(t, E.zoo, .3), 40) + pill(540, 760, '1981', PINK, P(t, E.zoo + .25, .3), 40);
  return s + motes(t, 14, .3); };
S.gate = (t, D, B) => { const E = EVS.gate(B); W.setTime(t + 12);
  W.GATESIGN.rotation.x = t > E.murio ? -.28 * k01(t, E.murio, E.murio + .5) : 0;      // the sign drops on one side: abandoned
  const k = k01(t, 0, D), cam = V3(xG - 13, 2.4, zG - 3.5 + k * 1.5), look = V3(xG - 1, 2.6, zG);
  W.setCam(cam, look, 46, cam.distanceTo(V3(xG - 3, 1, zG)), .0018); W.render();
  W.GATESIGN.rotation.x = 0;
  // the four walk out through the open gate, toward the river
  const walk = Math.max(0, t - E.nadie + .3) * .9, s0 = four(t, V3(xG - 2.0 - walk, 0, zG - .3), t > E.nadie - .3 ? 1 : 0, -1, cam);
  let s = s0 + pill(540, 620, '1993', PINK, P(t, E.murio, .3), 40);
  if (t > E.nadie) s += pill(540, 730, 'NADIE SE LOS LLEVÓ', YEL, P(t, E.nadie + .2, .3), 34);
  return s; };
S.river = (t, D, B) => { const E = EVS.river(B); W.setTime(t + 14);
  const cam = V3(rb(-24) - 8.5, 1.0, -18.5), look = V3(rb(-24) + .5, .6, -25); W.setCam(cam, look, 46, 8.5, .0025); W.render();
  // they slide into the water one after another
  const it = [0, 1, 2, 3].map(i => { const t0 = .1 + i * .32, kk = clamp((t - t0) / .9), x = rb(-24) + 3.5 - kk * 4.2 + i * .6, z = -25 + (i - 1.5) * 1.9, ground = gy(x, z), y = kk < .55 ? ground : lerp(ground, -1.1, ease((kk - .55) / .45));
    return { i, t0, kk, it: hip(Object.assign({ walk: kk < .6 ? t * 6 + i : null, wet: kk > .7, turn: -.4, look: [-6, 2] }, i ? FEM[i - 1] : MALE), x, z, i ? 1.6 : 1.85, y) }; });
  let s = byDist(it.map(o => o.it), cam);
  it.forEach(o => { const kk = clamp((t - o.t0 - .55) / .7); const x = rb(-24) + 3.5 - .55 * 4.2 + o.i * .6 - 1.4, z = -25 + (o.i - 1.5) * 1.9, p = W.proj(V3(x, 0, z)); if (p.ok) s += splash(p.x, p.y, p.ppm * 1.4, kk); });
  return s; };
// Africa vs Colombia card (2D insert drawn over the 3D river)
function lion(x, y, sc) { return `<g transform="translate(${x},${y}) scale(${sc})"><circle r="70" fill="#c46a22" stroke="${K}" stroke-width="7"/>${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<circle cx="${(Math.cos(a) * 64).toFixed(1)}" cy="${(Math.sin(a) * 64).toFixed(1)}" r="22" fill="#c46a22" stroke="${K}" stroke-width="6"/>`; }).join('')}<circle r="58" fill="#c46a22"/><circle r="44" fill="#f2b45a" stroke="${K}" stroke-width="6"/><path d="M-16,-8 l6,0 M10,-8 l6,0" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M-10,6 L10,6 L0,16Z" fill="${K}"/><path d="M0,16 q-10,12 -20,6 M0,16 q10,12 20,6" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`; }
function sunIcon(x, y, sc) { return `<g transform="translate(${x},${y}) scale(${sc})">${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return `<path d="M${(Math.cos(a) * 62).toFixed(1)},${(Math.sin(a) * 62).toFixed(1)} L${(Math.cos(a) * 92).toFixed(1)},${(Math.sin(a) * 92).toFixed(1)}" stroke="#ffb02e" stroke-width="16" stroke-linecap="round"/>`; }).join('')}<circle r="52" fill="#ffd34a" stroke="${K}" stroke-width="7"/></g>`; }
function cross(x, y, r, a) { if (a <= 0) return ''; const k = eOut(clamp(a)); return `<g transform="translate(${x},${y})"><path d="M${-r},${-r} L${-r + 2 * r * k},${-r + 2 * r * k}" stroke="${K}" stroke-width="34" stroke-linecap="round"/><path d="M${r},${-r} L${r - 2 * r * k},${-r + 2 * r * k}" stroke="${K}" stroke-width="34" stroke-linecap="round"/><path d="M${-r},${-r} L${-r + 2 * r * k},${-r + 2 * r * k}" stroke="${PINK}" stroke-width="20" stroke-linecap="round"/><path d="M${r},${-r} L${r - 2 * r * k},${-r + 2 * r * k}" stroke="${PINK}" stroke-width="20" stroke-linecap="round"/></g>`; }
S.africa = (t, D, B) => { const E = EVS.africa(B); W.setTime(t + 16);
  const col = t >= E.col, k = k01(t, 0, D), cam = V3(W.mid(-30) - 6 + k * 2, 2.2, -12), look = V3(W.mid(-30) + 6, 1, -40);
  W.setCam(cam, look, 50, col ? 22 : 4, col ? .0015 : .02); W.render();
  let s = '';
  if (col) s += crowd(30, t, cam);
  // the card
  const ca = col ? 1 : P(t, 0, .35), fl = col ? Math.min(1, (t - E.col) / .3) : 1, sx = col ? Math.abs(Math.cos(Math.min(1, (t - E.col) / .3) * Math.PI)) : 1;
  if (!col || t - E.col < .15) { // ÁFRICA card
    s += `<g transform="translate(540,470) scale(${(sx * (.8 + .2 * eBack(ca))).toFixed(3)},${(.8 + .2 * eBack(ca)).toFixed(3)})" opacity="${clamp(ca * 2).toFixed(2)}"><rect x="-380" y="-300" width="760" height="600" rx="26" fill="#14121c" stroke="${YEL}" stroke-width="8"/>
      <clipPath id="afc"><rect x="-360" y="-280" width="720" height="560" rx="18"/></clipPath><g clip-path="url(#afc)"><rect x="-360" y="-280" width="720" height="560" fill="#ffcf8a"/><rect x="-360" y="20" width="720" height="260" fill="#d9a35a"/>
      ${Array.from({ length: 14 }, (_, i) => `<path d="M${-340 + i * 52},${60 + (i % 3) * 50} l40,22 l-14,38 l34,18" stroke="#8a5a2a" stroke-width="6" fill="none"/>`).join('')}
      ${sunIcon(220, -150, t > E.seq ? 1 + .06 * Math.sin(t * 8) : .0001)}${t > E.leo ? lion(-180, 40, .9 * eBack(clamp((t - E.leo) / .3))) : ''}
      <g transform="translate(140,250) scale(.34)">${hippo2({ style: 'B', look: [-6, 0], turn: -.3 })}</g></g>
      <text x="0" y="-210" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#fff" stroke="${K}" stroke-width="10" paint-order="stroke">ÁFRICA</text></g>`; }
  if (col && t - E.col >= .15) { const a = clamp((t - E.col - .15) / .3);
    s += `<g transform="translate(540,470) scale(${(sx * (.8 + .2 * eBack(a))).toFixed(3)},${(.8 + .2 * eBack(a)).toFixed(3)})"><rect x="-380" y="-300" width="760" height="600" rx="26" fill="#14121c" stroke="${YEL}" stroke-width="8"/>
      <rect x="-360" y="-280" width="720" height="560" rx="18" fill="#bfe6d6"/><text x="0" y="-210" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#fff" stroke="${K}" stroke-width="10" paint-order="stroke">COLOMBIA</text>
      ${sunIcon(-170, 20, .95)}${lion(170, 20, .95)}${cross(-170, 20, 110, clamp((t - E.noseq) / .3))}${cross(170, 20, 110, clamp((t - E.noleo) / .3))}
      <text x="-170" y="200" text-anchor="middle" font-family="Inter" font-weight="900" font-size="38" fill="#14121c">SEQUÍAS</text><text x="170" y="200" text-anchor="middle" font-family="Inter" font-weight="900" font-size="38" fill="#14121c">LEONES</text></g>`; }
  return s; };
S.paradise = (t, D, B) => { const E = EVS.paradise(B); W.setTime(t + 20);
  const k = k01(t, 0, D), cz = -30, cam = V3(rb(cz) - 8.4 + k * 1.4, 1.4 + k * .3, cz + .2), look = V3(rb(cz) + .2, .8, cz - .2);
  W.setCam(cam, look, 46, cam.distanceTo(look), .0024); W.render();
  // mother on the bank with babies; another adult in the water; a baby rides on a back
  const mom = hip({ style: 'B', look: [-6, 2], turn: -.3, blink: (t % 3.2) < .14, ear: (Math.sin(t * 3) + 1) / 2 }, rb(cz) + 1.8, cz - 1.0, 1.8);
  const b1 = hip({ style: 'A', look: [4, -2], turn: .3, walk: t * 7 }, rb(cz) + .5 - (t % 3) * .15, cz + .5, .95);
  const b2 = hip({ style: 'A', look: [-2, 2], turn: -.2, ear: (Math.sin(t * 4) + 1) / 2 }, rb(cz) + 1.2, cz + 1.4, .9);
  const wt = hip({ style: 'A', skin: '#9a8fb6', wet: true, look: [-4, 2] }, rb(cz) - 2.4, cz - 2.0, 1.7, -1.35 + Math.sin(t * 1.6) * .05);
  const riderF = V3(rb(cz) - 2.4, .22 + Math.sin(t * 1.6) * .05, cz - 2.05); const rider = { p: riderF.clone().add(V3(0, 0, .05)), f: () => hippoAt({ style: 'A', look: [2, 0], blink: (t % 2.4) < .12 }, riderF, riderF.clone().add(V3(0, .82, 0)), W) };
  let s = byDist([mom, b1, b2, wt, rider], cam);
  s += pill(540, 300, 'RÍO ENORME', BLUE, P(t, E.rio, .3), 36) + pill(540, 410, 'COMIDA TODO EL AÑO', GREEN, P(t, E.comida, .3), 36) + pill(540, 520, 'SIN ENEMIGOS', PINK, P(t, E.nadie, .3), 36);
  return s + motes(t, 16, .35); };
S.log = (t, D, B) => { const E = EVS.log(B); W.setTime(t + 26);
  const cz = -8, cx = W.mid(cz) + 4; W.HERO.position.set(cx, .12 + Math.sin(t * 1.4) * .02, cz); W.HERO.rotation.y = .25; W.HERO.scale.set(1, 1, .62);
  const open = t > E.abre, zoom = k01(t, E.abre - .1, E.abre + .5), hx = cx + 2.1, hz = cz - 1.6;
  let cam, look; if (t < E.tronco) { cam = V3(cx - 2.4, 1.5, cz + 5); look = V3(cx + .6, 1.1, cz - 1.5); }
  else { cam = L3(V3(cx - 1.4, 1.1, cz + 3.6), V3(hx + .9, 1.0, hz + 2.6), zoom); look = L3(V3(cx + 1.2, .6, cz - 1.2), V3(hx, .15, hz), zoom); }
  W.setCam(cam, look, 44 - zoom * 8, cam.distanceTo(V3(hx, .3, hz)), .003 + zoom * .003); W.render();
  // paddling: right arm pushes the paddle back and forth
  const pk = Math.sin(t * 2.6), fear = open;
  const head = hip({ style: 'B', blink: !open, eye: 'wide', look: [-8, 2], turn: -.5, wet: true, ear: open ? (Math.sin(t * 9) + 1) / 2 : 0 }, hx, hz, 1.75, -1.48 + Math.sin(t * 1.3) * .03);
  const fisher = { p: V3(cx, 0, cz), f: () => stickAt(Object.assign({}, PESC, fear ? { face: 'wide', mouth: 'grin', brows: 1, sweat: true, prop: 'paddle', armL: [40, 60], armR: [60, 70], turn: .7, look: [12, 2], lean: -6 } :
    { face: 'smug', mouth: 'smile', prop: 'paddle', armL: [20 + pk * 14, 40], armR: [30 + pk * 22, 50 - pk * 10], turn: .35, look: [6, 0], lean: pk * 2, bob: pk * 4 }), V3(cx, -.12, cz), V3(cx, 1.5, cz), W) + hullFront(cam) };
  let s = byDist([head, fisher], cam);
  if (t > E.tronco && !open) s += pill(560, 330, '¿UN TRONCO?', YEL, P(t, E.tronco, .3), 40);
  if (open) { const p = W.proj(V3(hx, .2, hz)); if (p.ok) s += ring(p.x, p.y, 240, (t - E.abre) / .6, '#fff'); s += burstLines(760, 300, 60, clamp((t - E.abre) / .5)); }
  return s + motes(t, 12, .3); };
S.yawn = (t, D, B) => { const E = EVS.yawn(B); W.setTime(t + 31);
  const cz = -8, cx = W.mid(cz) + 4; W.HERO.position.set(cx, .12 + Math.sin(t * 6) * .04 * Math.exp(-t), cz); W.HERO.rotation.y = .25; W.HERO.scale.set(1, 1, .62);
  const rise = k01(t, 0, .7), hx = cx + 2.4, hz = cz - 2.6, y = lerp(-1.45, -.35, rise), op = k01(t, .5, 1.1) * (1 - k01(t, D - .6, D)) + k01(t, D - .6, D) * .0;
  const shk = Math.sin(t * 50) * .06 * Math.exp(-(t - .55) * 4) * (t > .5 ? 1 : 0);
  const cam = V3(cx - 2.2 + shk, 1.25, cz + 4.4), look = V3(cx + 1.4, 1.6, cz - 2.4); W.setCam(cam, look, 48, cam.distanceTo(V3(hx, 1, hz)), .002); W.render();
  const hp = hip({ style: 'B', open: op, look: [-8, 4], turn: -.35, wet: true, eye: 'angry', ear: (Math.sin(t * 6) + 1) / 2 }, hx, hz, 1.9, y);
  const fisher = { p: V3(cx, 0, cz), f: () => stickAt(Object.assign({}, PESC, { face: 'wide', mouth: 'grin', brows: 1, sweat: true, prop: 'paddle', armL: [130, 30], armR: [150, 20], turn: .8, look: [12, -4], lean: -10 + Math.sin(t * 20) * 1.5 }), V3(cx, -.12, cz), V3(cx, 1.5, cz), W) + hullFront(cam) };
  let s = byDist([hp, fisher], cam);
  const p = W.proj(V3(hx, 0, hz)); if (p.ok) s += splash(p.x, p.y, p.ppm * 2.2, clamp((t - .35) / .8));
  s += bigNum(300, 330, '3 T', YEL, P(t, E.tres, .3), 170) + pill(300, 470, 'TONELADAS', YEL, P(t, E.tres + .2, .3), 34);
  if (t > E.pel) s += pill(640, 600, 'MUY PELIGROSOS', PINK, P(t, E.pel, .3), 40);
  return s; };
S.vet = (t, D, B) => { const E = EVS.vet(B); W.setTime(t + 35);
  const cz = -34, bx = rb(cz) + 2.6, k = k01(t, 0, D), cam = V3(bx - 10 + k * 1.2, 1.9, cz + .9), look = V3(bx, 1.2, cz + .9);
  W.setCam(cam, look, 44, cam.distanceTo(look), .0025); W.render();
  const mom = hip({ style: 'B', blink: true, turn: -.25, ear: 0 }, bx + .8, cz - .6, 1.8);
  const crias = t > E.crias;
  const vet = { p: V3(bx - 1.2, 0, cz + 2.0), f: () => stickAt(Object.assign({}, VET, crias ? { face: 'wide', mouth: 'grin', brows: 1, sweat: true, armL: [40, 60], armR: [60, 50], look: [-10, 0], turn: -.5 } : { face: 'open', mouth: 'smile', armL: [20, 30], armR: [70, 60], look: [-8, 0], turn: -.4 }), V3(bx - 1.2, gy(bx - 1.2, cz + 2.0), cz + 2.0), V3(bx - 1.2, gy(bx - 1.2, cz + 2.0) + 1.62, cz + 2.0), W) };
  const items = [mom, vet];
  if (crias) [[-.4, .6], [1.8, -1.9], [-.8, -1.6]].forEach(([dx, dz], i) => { const a = clamp((t - E.crias - i * .18) / .35); if (a <= 0) return; const F = V3(bx + dx, gy(bx + dx, cz + dz), cz + dz);
    items.push({ p: F.clone(), f: () => hippoAt({ style: 'A', look: [-4, 2], turn: (i - 1) * .3, ear: 1 }, F, F.clone().add(V3(0, .95 * eBack(a), 0)), W) }); });
  let s = byDist(items, cam);
  const mp = W.proj(V3(bx + .6, 2.2, cz - .4)); if (mp.ok && !crias) s += zzz(mp.x + 60, mp.y, t);
  s += pill(540, 330, 'ESTERILIZACIÓN', BLUE, P(t, E.est, .3), 40);
  for (let i = 0; i < 8; i++) s += coin(260 + i * 80, 560, clamp((t - E.miles - i * .12) / 1.2));
  if (crias) s += pill(540, 450, '+ CRÍAS', PINK, P(t, E.crias, .3), 44);
  return s; };
S.stamp = (t, D, B) => { const E = EVS.stamp(B); W.setTime(t + 40);
  const cz = -30, bx = rb(cz) + 1.2, cam = V3(bx - 5.8, 1.4, cz + 1.6), look = V3(bx, 1.3, cz);
  const hit = t > E.inv ? Math.sin((t - E.inv) * 60) * .05 * Math.exp(-(t - E.inv) * 6) : 0;
  W.setCam(cam.clone().add(V3(0, hit, hit)), look, 40, cam.distanceTo(look), .004); W.render();
  let s = hip({ style: 'B', look: [-8, 2], turn: -.3, eye: t > E.inv ? 'wide' : 'calm', ear: (Math.sin(t * 3) + 1) / 2 }, bx, cz, 1.85).f();
  if (t > E.inv) { const a = clamp((t - E.inv) / .18), sc = 1.8 - .8 * eOut(a);
    s += `<g transform="translate(540,380) rotate(-12) scale(${sc.toFixed(3)})" opacity="${clamp(a * 3).toFixed(2)}"><rect x="-330" y="-90" width="660" height="180" rx="18" fill="none" stroke="#e23a3a" stroke-width="16"/><rect x="-310" y="-70" width="620" height="140" rx="10" fill="none" stroke="#e23a3a" stroke-width="6"/><text x="0" y="-8" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#e23a3a" letter-spacing="2">ESPECIE</text><text x="0" y="56" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#e23a3a" letter-spacing="2">INVASORA</text></g>`; }
  return s; };
S.future = (t, D, B) => { const E = EVS.future(B); W.setTime(t + 42);
  const k = k01(t, 0, D), cam = V3(W.mid(16) - 1 + k * 2, 3 + k * 4, 16), look = V3(W.mid(-34), 0, -34); W.setCam(cam, look, 48, 26, .001); W.render();
  const n = Math.round(lerp(40, 120, k01(t, E.y2035 - .3, E.mil + .4)));
  let s = crowd(n, t, cam);
  const num = Math.round(lerp(180, 1000, k01(t, E.y2035, E.mil + .2)));
  s += pill(540, 330, '2035', YEL, P(t, E.y2035, .3), 50) + bigNum(540, 520, (t > E.mil + .2 ? '+' : '') + num, PINK, P(t, E.y2035 + .1, .3), 190);
  return s; };
S.end = (t, D, B) => { const E = EVS.end(B); W.setTime(t + 46);
  // back to the start: the four on the bank, at the gate (loop)
  const k = k01(t, 0, D), cam = V3(xG - 18 + k * 1.5, 2.6, zG + 1.2 - k * .6), look = V3(xG, 3.2, zG);
  W.setCam(cam, look, 46, cam.distanceTo(V3(xG - 4, 1, zG)), .0018); W.render();
  let s = four(t, V3(xG - 4.4, 0, zG + .2), 0, -1, cam);
  s += bigNum(540, 360, '4', YEL, P(t, E.cuatro, .3));
  return s + motes(t, 14, .3); };
window.CFG = { capY: 1460 };

// «El plátano de seis millones» (76) — ESTILO 3D DE DIBUJO ANIMADO: decorados de Blender (world_platano.js) + personajes 2D (cast76.js) + efectos.
// Reglas obligatorias (references/reglas_75.md): cámara SIEMPRE en movimiento, transición en cada cambio de plano, caras que cambian con la historia,
// fondos con detalle, nada atravesado (piernas tras mostradores con clipAbove), nadie en zonas de paso sin motivo.
window.CFG = { capY: 1500, capSize: 96, transDur: .34, blurK: .35, antic: .1, blurChars: false, transDefault: 'swish',
  trans: { miami: 'swish', precio: 'push', dudas: 'push', papel: 'swish', come: 'swish', subasta: 'swish', ganador: 'swish', veras: 'push', certificado: 'swish', otro: 'swish', frutero: 'swish', final: 'swish' } };
const norm = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const EVS = {}; window.SCRIPT.forEach(l => { EVS[l.sc] = EVS[l.sc] || (() => ({})); });
const capWords = (sc, li) => { const L = window.SCRIPT.filter(l => l.sc === sc)[li]; return L ? L.cap.split(' ').map(w => norm(w.split('|')[0])) : []; };
const wt = (B, sc, li, word, nth = 0, dflt = null) => { const ws = capWords(sc, li); let c = 0; for (let i = 0; i < ws.length; i++) if (ws[i] === word) { if (c === nth) return B[li] ? B[li].w[i] : dflt; c++; } return dflt ?? (B[li] ? B[li].s : 0); };
const S = {}, W = W2;
let SHAKE = 0;
{ const _sc = W2.setCam.bind(W2); W2.setCam = (p, l, f, fo, ap) => { const T = window.__T || 0, d = V3(Math.sin(T * 4.59) * .5 + Math.sin(T * 8.61) * .3, Math.sin(T * 5.3 + 1) * .5 + Math.sin(T * 9.7) * .25, 0).multiplyScalar(.008 * p.distanceTo(l) / 8);
  const sh = SHAKE > 0 ? V3(Math.sin(T * 91) * SHAKE, Math.sin(T * 77 + 2) * SHAKE, 0).multiplyScalar(p.distanceTo(l) / 10) : V3(0, 0, 0); return _sc(p.clone().add(d).add(sh), l.clone().add(d.multiplyScalar(.35)).add(sh.multiplyScalar(.6)), f, fo, ap); }; }
const cam = (p, l, f = 40, ap = .0004) => { W.setCam(p, l, f, p.distanceTo(l), ap); };
const camK = (k, p0, l0, f0, p1, l1, f1, ap) => cam(lerpV(p0, p1, k), lerpV(l0, l1, k), lerp(f0, f1, k), ap);
const lerpV = (a, b, k) => a.clone().lerp(b, k);
const seg = (t, a, b) => eIO(clamp((t - a) / Math.max(.001, b - a)));
const depth = L => L.filter(x => x && x[1]).map(([p, s]) => [W.camera.position.distanceTo(p), s]).sort((a, b) => b[0] - a[0]).map(x => x[1]).join('');
const man = (name, F, pose = {}, opt = {}) => { let s = who(name, pose, F, opt.h || ADULT, Object.assign({ gy: opt.gy ?? F.y }, opt)); if (opt.clip && s) { const q = W.proj(opt.clip); if (q.ok) s = clipAbove(s, q.y); } return [F, s]; };
const whip = (t, cuts, w = .1) => { if (typeof TR === 'undefined' || !TR) return; for (const c of cuts) { const d = Math.abs(t - c); if (d < w) { TR.blur('H', 26 * (1 - d / w)); return; } } };
const pick = (t, L) => { let r = L[0][1]; for (const [a, v] of L) if (t >= a) r = v; return r; };
const talk = (t, a, b, rest = 'smile') => talkM(t, a, b, rest);
// paseo de verdad: zancada con las piernas (no marchar en el sitio), brazos contrarios, rebote suave; ph = distancia / zancada · π
function walk2(ph, o = {}) { const A = o.amp ?? 1, s = Math.sin(ph), c = Math.cos(ph);
  return { legL: [-22 * s * A, 6 + 26 * Math.max(0, s) * A], legR: [22 * s * A, 6 + 26 * Math.max(0, -s) * A], armL: [12 - 24 * s * A, 22], armR: [12 + 24 * s * A, 22], bob: -8 * Math.abs(c) * A + 3, headTilt: s * 2 * A }; }
// luces de personaje por ambiente
const LG = { galeria: { tint: '#fff4e0', k: .1, rim: '#ffffff', rimA: .5, rimX: -1, rimY: -.6 }, laser: { tint: '#ff8a96', k: .26, rim: '#ff4a5c', rimA: .75, rimX: 1, rimY: -.6 },
  subasta: { tint: '#ffd9a8', k: .2, rim: '#fff0d0', rimA: .55, rimX: 1, rimY: -.5 }, rueda: { tint: '#9aa0ff', k: .3, rim: '#ff8ad0', rimA: .65, rimX: 1, rimY: -.6 }, calle: { tint: '#ffe8c8', k: .12, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.6 } };
const BAN = V3(0, 3.05, -17.4), AX = W.AX, SX = W.SX, NX = W.NX;
// ---------- objetos 3D extra creados una vez: cartel de la feria, certificados en abanico, lluvia de plátanos ----------
const XTRA = { built: false };
function buildX() { if (XTRA.built) return; XTRA.built = true; const T = THREE;
  const cvT = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; };
  const ban = cvT(1600, 440, (g, w, h) => { g.fillStyle = '#ff5a8a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd34a'; g.fillRect(0, h - 40, w, 40); g.fillStyle = '#2cc4b4'; g.fillRect(0, 0, w, 30);
    g.strokeStyle = '#241c2c'; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12);
    // palmera y sol de Miami
    g.fillStyle = '#ffd34a'; g.beginPath(); g.arc(210, 200, 110, 0, 7); g.fill(); g.stroke(); g.strokeStyle = '#7d5230'; g.lineWidth = 26; g.beginPath(); g.moveTo(250, 400); g.quadraticCurveTo(270, 260, 230, 170); g.stroke();
    g.fillStyle = '#2f9a52'; for (let a = 0; a < 6; a++) { g.save(); g.translate(230, 170); g.rotate(a * 1.05 - .4); g.beginPath(); g.ellipse(70, 0, 80, 22, 0, 0, 7); g.fill(); g.restore(); }
    // sin letras: olas, gaviotas y dos plátanos con gafas de sol (Miami, feria de arte)
    g.fillStyle = '#5fd4e8'; g.beginPath(); g.moveTo(420, 400); for (let x = 420; x <= 1560; x += 60) g.quadraticCurveTo(x + 30, 360, x + 60, 400); g.lineTo(1560, 410); g.lineTo(420, 410); g.fill();
    g.strokeStyle = '#241c2c'; g.lineWidth = 8; [[600, 120], [700, 90], [1350, 110]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x - 30, y); g.quadraticCurveTo(x - 15, y - 18, x, y); g.quadraticCurveTo(x + 15, y - 18, x + 30, y); g.stroke(); });
    [[820, 230, -.3], [1160, 230, .3]].forEach(([x, y, r]) => { g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = '#ffd83a'; g.strokeStyle = '#241c2c'; g.lineWidth = 12; g.beginPath(); g.moveTo(-150, 0); g.bezierCurveTo(-100, 110, 100, 110, 150, -30); g.bezierCurveTo(160, -60, 130, -64, 118, -44); g.bezierCurveTo(70, 40, -70, 46, -122, -26); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#241c2c'; g.fillRect(-60, 6, 46, 26); g.fillRect(10, 6, 46, 26); g.fillRect(-14, 12, 24, 6); g.restore(); }); });
  const bm = new T.Mesh(new T.PlaneGeometry(8, 2.2), new T.MeshBasicMaterial({ map: ban, side: T.DoubleSide, fog: false }));
  bm.position.set(0, 7.2, -4); W.SITES.gallery.add(bm); XTRA.banner = bm;
  [-3.6, 3.6].forEach(x => { const c = new T.Mesh(new T.CylinderGeometry(.02, .02, 1.9, 4), new T.MeshBasicMaterial({ color: '#241c2c' })); c.position.set(x, 8.3, -4); W.SITES.gallery.add(c); });
  XTRA.certs = []; for (let i = 0; i < 14; i++) { const c = W.G.cert.clone(true); c.visible = false; W.scene.add(c); XTRA.certs.push(c); }
  XTRA.rain = []; for (let i = 0; i < 46; i++) { const b = W.G.banana.clone(true); b.visible = false; W.SITES.stand.add(b); XTRA.rain.push(b); }
  XTRA.fresh = W.G.banana.clone(true); XTRA.fresh.visible = false; W.scene.add(XTRA.fresh); }
function setup(T, site, mood) { buildX(); W.setTime(T); W.site(site); W.setMood(mood); W.charLight = LG[mood] || LG.galeria; SHAKE = 0;
  W.ripe(.3); W.gold(0); W.dots(0); W.lasers(false); W.poolOn(.45); W.wallP.visible = true; W.wallP.scale.setScalar(1.12); tapeK(1);
  XTRA.certs.forEach(c => c.visible = false); XTRA.rain.forEach(b => b.visible = false); XTRA.fresh.visible = false; if (W.plate) W.plate.visible = true; }
function tapeK(k) { const s = 1.12, tp = W.tapeP; tp.visible = k > .01; tp.scale.set(s * Math.max(.01, k), s, s); tp.userData.ink2.visible = k > .01; tp.userData.ink2.scale.set(s * Math.max(.01, k), s, s); }
// ---------- objetos en la mano (unidades del personaje: cabeza = radio 100) ----------
const TAPEROLL = `<g transform="rotate(-10)"><circle r="44" fill="#cfd6e2" stroke="${K}" stroke-width="7"/><circle r="22" fill="#f4f2ec" stroke="${K}" stroke-width="5"/><path d="M30,-32 L80,-70 L96,-52 L44,-16" fill="#e2e7ef" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M-30,-10 A32,32 0 0 1 4,-34" stroke="#fff" stroke-width="6" fill="none" opacity=".7"/></g>`;
const PRICE = `<g transform="translate(0,-70) rotate(-6)"><rect x="-96" y="-58" width="192" height="116" rx="12" fill="#fbf3da" stroke="${K}" stroke-width="7"/><rect x="-84" y="-46" width="168" height="92" rx="8" fill="none" stroke="#e0951c" stroke-width="5"/><text x="0" y="20" text-anchor="middle" font-family="Inter" font-weight="900" font-size="50" fill="#2f9a52">120.000 $</text></g>`;
const CERT2 = `<g transform="translate(0,-40) rotate(-8)"><rect x="-50" y="-70" width="100" height="134" fill="#fbf3da" stroke="${K}" stroke-width="6"/><rect x="-40" y="-60" width="80" height="16" fill="#2c3f86"/><path d="M-36,-32 L36,-32 M-36,-18 L36,-18 M-36,-4 L26,-4 M-36,10 L36,10" stroke="${K}" stroke-width="4" opacity=".6"/><circle cx="22" cy="40" r="13" fill="#c8342c" stroke="${K}" stroke-width="4"/></g>`;
const COIN2 = `<g><ellipse rx="24" ry="24" fill="#ffd23a" stroke="${K}" stroke-width="6"/><ellipse rx="14" ry="14" fill="none" stroke="#e0951c" stroke-width="4"/></g>`;
const bulb = (x, y, s, on = 1) => `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(2)})">${on ? `<circle r="90" fill="#fff6b0" opacity=".45"/>` : ''}<path d="M-40,10 Q-58,-30 -40,-60 Q0,-100 40,-60 Q58,-30 40,10 L30,34 L-30,34Z" fill="${on ? '#ffe75a' : '#cfcfd6'}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><rect x="-28" y="34" width="56" height="30" rx="6" fill="#9aa1ad" stroke="${K}" stroke-width="7"/><path d="M-14,10 L-6,-24 L6,-6 L14,-30" stroke="${K}" stroke-width="6" fill="none"/></g>`;
const redX = (x, y, s, k) => { if (k <= 0) return ''; const e = eBack(clamp(k)); return `<g transform="translate(${x},${y}) scale(${(s * e).toFixed(2)}) rotate(-6)"><path d="M-90,-90 L90,90 M90,-90 L-90,90" stroke="${K}" stroke-width="58" stroke-linecap="round"/><path d="M-90,-90 L90,90 M90,-90 L-90,90" stroke="#ff3b4f" stroke-width="38" stroke-linecap="round"/></g>`; };
const star = (x, y, r, a = .95) => `<path d="M${x},${y - r} L${x + r * .22},${y - r * .22} L${x + r},${y} L${x + r * .22},${y + r * .22} L${x},${y + r} L${x - r * .22},${y + r * .22} L${x - r},${y} L${x - r * .22},${y - r * .22}Z" fill="#fff" opacity="${a}"/>`;
const flash = (x, y, r, k = 1) => k <= 0 ? '' : `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${(.9 * k).toFixed(2)}"/>` + star(x, y, r * 2.6 * (.6 + .4 * k), .85 * k);
// flashes de cámara que saltan solos (deterministas por tiempo)
const flashes = (t, n = 6, rate = 3.2, y0 = 160, y1 = 1300) => { let o = ''; for (let i = 0; i < n; i++) { const ph = (t * rate / n + hs(i, 11)) % 1, k = ph < .12 ? 1 - ph / .12 : 0; if (k > 0) o += flash(80 + hs(i, 12) * 920, y0 + hs(i, 13) * (y1 - y0), 14 + hs(i, 14) * 10, k); } return o; };
const flies = (x, y, n, t) => { let o = ''; for (let i = 0; i < n; i++) { const a = t * (2 + i * .3) + i * 2.4, r = 40 + i * 22, fx = x + Math.cos(a) * r, fy = y + Math.sin(a * 1.3) * r * .6, wg = 4 + Math.abs(Math.sin(t * 40 + i)) * 7; o += `<ellipse cx="${(fx - 6).toFixed(0)}" cy="${(fy - 9).toFixed(0)}" rx="10" ry="${wg.toFixed(1)}" fill="#fff" opacity=".75" stroke="${K}" stroke-width="2"/><ellipse cx="${fx.toFixed(0)}" cy="${fy.toFixed(0)}" rx="11" ry="8" fill="#241c2c"/>`; } return o; };
// plátano pelado en la mano, con la punta en la boca (tx,ty) y mordisco opcional
const biteBanana = (tx, ty, s = 1, a = -32, bitten = true) => { const r = a * Math.PI / 180, x = tx - s * 125 * Math.sin(r), y = ty + s * 125 * Math.cos(r);
  const top = bitten ? `M-34,40 L-34,-118 A20,20 0 0 1 -8,-124 A20,20 0 0 0 20,-116 A20,20 0 0 1 34,-126 L34,40 Z` : `M-34,40 L-34,-110 Q-30,-140 0,-142 Q30,-140 34,-110 L34,40 Z`;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a}) scale(${s})"><path d="M-22,10 C-70,40 -74,110 -50,150 C-40,100 -30,60 -14,30Z" fill="#ffd83a" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M22,10 C70,40 74,110 50,150 C40,100 30,60 14,30Z" fill="#f0b81e" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
  <path d="${top}" fill="#fff3c4" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M-16,30 L-16,-90" stroke="#f0dc96" stroke-width="7" stroke-linecap="round"/>
  <circle cx="0" cy="70" r="36" fill="#fff" stroke="${K}" stroke-width="8"/><path d="M-20,58 Q0,50 20,58 M-22,74 Q0,66 22,74" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${bitten ? `<circle cx="-54" cy="-100" r="8" fill="#fff3c4" stroke="${K}" stroke-width="4"/><circle cx="58" cy="-90" r="6" fill="#fff3c4" stroke="${K}" stroke-width="4"/><circle cx="-70" cy="-66" r="5" fill="#fff3c4" stroke="${K}" stroke-width="3"/>` : ''}</g>`; };
const mouthAt = (F, h = ADULT) => { const p = W.proj(V3(F.x, F.y + h, F.z)), R = p.ppm * .42; return { x: p.x, y: p.y, R }; };
const scrX = v => W.proj(v);

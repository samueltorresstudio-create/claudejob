const W = W2; window.READY = Promise.resolve();
const far = L => L.filter(x => x && x[1]).sort((a, b) => W.camera.position.distanceTo(b[0]) - W.camera.position.distanceTo(a[0])).map(x => x[1]).join('');
const wp = (obj, x, y, z) => { obj.updateMatrixWorld(true); return V3(x, y, z).applyMatrix4(obj.matrixWorld); };
window.shot = (name, o) => { W.setMood(o.mood || 'aire'); W.setTime(o.t || 1); W.setFg(!!o.fg);
  W.setCam(V3(...o.cp), V3(...o.lk), o.fov || 40, null, o.ap ?? .0015); W.charLight = ({ NIGHT, DAY, IN, CANDLE, COLD, DUSK, TORCHL })[o.light] || TORCHL; W.render();
  document.getElementById('fx').innerHTML = window.SVG ? window.SVG(name, o) : ''; };
const TORCHL = { tint: '#ffcf8a', k: .26, rim: '#ffe2a8', rimA: .7, rimX: 1, rimY: -.2 };
// Reg sentado con las piernas cruzadas en el suelo de la caja: el dibujo con piernas cruzadas acaba 155 u por encima de F, así que F baja
// 0,49 m bajo el suelo y la cabeza queda a ~1 m (escala 462 u = 1,47 m). Sombra de contacto propia (la de stickAt usa y = 0).
const TORCHSVG = (ang) => `<g transform="rotate(${ang})"><rect x="-12" y="-13" width="74" height="26" rx="7" fill="#3a3842" stroke="${K}" stroke-width="5"/><rect x="6" y="-13" width="10" height="26" fill="#c9ced6" stroke="${K}" stroke-width="3"/><path d="M60,-15 L86,-24 L86,24 L60,15Z" fill="#5a5862" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="86" cy="0" rx="6" ry="22" fill="#fff6c0" stroke="${K}" stroke-width="3"/></g>`;
function regInCrate(pose = {}, t = 0, o = {}) { const fl0 = wp(W.CR, -.02, .07, 0), F = V3(fl0.x, fl0.y - .49, fl0.z), H = V3(F.x, F.y + 1.47, F.z);
  const ang = o.tang ?? -78, armR = o.armR || [62, 70];
  const P = Object.assign({ legLen: .56, legL: [84, 150], legR: [84, 150], armL: [40, 120], armR, holdR: TORCHSVG(ang), face: 'wide', mouth: 'o', sweat: true, turn: .85 }, pose);
  const pf = W.proj(F), ph = W.proj(H), s = Math.hypot(ph.x - pf.x, ph.y - pf.y) / 462;
  const u = (ux, uy) => ({ x: pf.x + ux * s, y: pf.y + uy * s });
  // mano derecha (misma cuenta que stick.js: hombro en (44, -360), brazo 90 + 86)
  const r = a => a * Math.PI / 180, [a1, a2] = P.armR, x1 = 44 + Math.sin(r(a1)) * 90, y1 = -360 + Math.cos(r(a1)) * 90, hx = x1 + Math.sin(r(a1 + a2)) * 86, hy = y1 + Math.cos(r(a1 + a2)) * 86;
  const tip = u(hx + Math.cos(r(ang)) * 86, hy + Math.sin(r(ang)) * 86);
  const fp = W.proj(fl0), q = 462 * s / 1.47;   // q = píxeles por metro a esa distancia
  const fl = 1 + Math.sin(t * 23) * .03 + Math.sin(t * 37) * .02;
  const shadow = `<ellipse cx="${(fp.x + q * .02).toFixed(1)}" cy="${(fp.y - q * .02).toFixed(1)}" rx="${(q * .42).toFixed(1)}" ry="${(q * .09).toFixed(1)}" fill="#000" opacity=".38" style="filter:blur(${(q * .03).toFixed(1)}px)"/>`;
  const wall = W.proj(wp(W.CR, -W.CRATE_W / 2 + .08, 1.45, .25));
  const glow = `<defs><radialGradient id="tg"><stop offset="0" stop-color="#ffe7a8" stop-opacity="${(.5 * fl).toFixed(2)}"/><stop offset=".5" stop-color="#ffb860" stop-opacity=".18"/><stop offset="1" stop-color="#ff9a40" stop-opacity="0"/></radialGradient></defs>` +
    `<ellipse cx="${wall.x.toFixed(1)}" cy="${wall.y.toFixed(1)}" rx="${(q * .8 * fl).toFixed(1)}" ry="${(q * .62 * fl).toFixed(1)}" fill="url(#tg)"/>`;
  const shad = `<g opacity=".28" style="filter:brightness(0) blur(${(q * .015).toFixed(1)}px)" transform="translate(${(-q * .28).toFixed(1)},${(-q * .1).toFixed(1)}) translate(${wall.x.toFixed(1)},${wall.y.toFixed(1)}) scale(1.12) translate(${(-wall.x).toFixed(1)},${(-wall.y).toFixed(1)})">${who('REG', Object.assign({}, P, { holdR: null }), F, H, { shadow: false })}</g>`;
  const reg = who('REG', P, F, H, { shadow: false });
  const Lb = q * .62; let beam = `<defs><linearGradient id="tb" x1="0" x2="1"><stop offset="0" stop-color="#fff2c0" stop-opacity=".6"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></linearGradient></defs><g transform="translate(${tip.x.toFixed(1)},${tip.y.toFixed(1)}) rotate(${ang})"><path d="M0,${(-q * .05).toFixed(1)} L${Lb.toFixed(1)},${(-Lb * .34).toFixed(1)} L${Lb.toFixed(1)},${(Lb * .34).toFixed(1)} L0,${(q * .05).toFixed(1)}Z" fill="url(#tb)"/>`;
  for (let i = 0; i < 16; i++) { const k = ((hs(i, 3) + t * .05 * (1 + hs(i, 4))) % 1), x = k * Lb, y = (hs(i, 7) - .5) * x * .6 + Math.sin(t * 2 + i) * 4; beam += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(q * (.006 + hs(i, 9) * .01)).toFixed(1)}" fill="#fff6d8" opacity="${(.75 * (1 - k)).toFixed(2)}"/>`; }
  beam += `</g>`;
  return [F, glow + shad + shadow + reg + beam]; }
window.SVG = (name, o) => { const L = [];
  if (name === 'gancho') L.push(regInCrate(o.pose, o.t || 1, o));
  return far(L); };

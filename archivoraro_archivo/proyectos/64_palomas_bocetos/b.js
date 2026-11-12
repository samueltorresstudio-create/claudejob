const W = W2; const T = THREE;
const DAY = { tint: '#ffe6c4', k: .14, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.5 };
W.charLight = DAY;
const MIX = { rich: true, eyeStyle: 'palo', legLen: 1.18 };
const FRED = Object.assign({}, MIX, { outfit: 'labcoat', top: '#f6f4ee', topD: '#d9d6cc', shirt: '#cfe0f0', tie: '#7a2a2a', hair2: 'side', hairCol: '#3a2a1c', glasses: true, face: 'smug', mouth: 'smirk', pants: '#4a4f5a', shoes: '#2a1e16', sole: '#2a1e16' });
const SUIT = (top, hair, extra = {}) => Object.assign({}, MIX, { outfit: 'suit', top, topD: top, tie: '#2a2a33', hair2: hair, hairCol: '#2a2a2a', face: 'smug', mouth: 'line', pants: top, shoes: '#15161c', sole: '#15161c' }, extra);
const BOSSES = [SUIT('#4a4f5a', 'bald', { hairCol: '#d9d6cc', mustache: '#d9d6cc', browCol: '#d9d6cc', glasses: true, wrinkles: true }), SUIT('#5a4a3a', 'side', { mustache: '#2a1a12' }),
  Object.assign({}, MIX, { outfit: 'military', top: '#7a6a48', topD: '#5a4e34', hat: 'peaked', capTop: '#6a5a3a', hair2: 'buzz', hairCol: '#2a1a12', medals: true, nameTape: 'GRAY', face: 'smug', mouth: 'line', pants: '#6a5a3a', shoes: '#15161c', sole: '#15161c' }),
  SUIT('#2f3540', 'curly', { hairCol: '#5a3a22' })];
const pg = (o, F, h, W, opt) => pigeonAt(o, F, V3(F.x, F.y + h, F.z), W, opt);
const ADULT = 1.84;
const behind = (svg, yClip) => { const id = 'cl' + Math.random().toString(36).slice(2, 8); return `<defs><clipPath id="${id}"><rect x="-200" y="-200" width="1480" height="${(yClip + 200).toFixed(1)}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; };
window.shot = function (n) { W.setTime(2 + n); let s = ''; W.charLight = DAY;
  if (n === 0) { // laboratorio: Fred junto al morro, palomas en los palomares
    W.setCam(V3(3.2, 1.25, 3.9), V3(-4.5, 1.55, -1.6), 60, 5.4, .0016); W.render();
    W.PIGEONHOLES.forEach((p, i) => { if (i % 4 === 2 || ![[.05, .02], [.05, .28], [.05, .15]].every(([dx, dy]) => W.visible(p.clone().add(V3(dx, dy, .12))) && W.visible(p.clone().add(V3(dx, dy, -.12))))) return; s += pg({ eye: ['calm', 'calm', 'wide', 'closed'][i % 4], bob: (i % 5) * .2 - .4, peck: i % 7 === 3 ? .5 : 0 }, p.clone().add(V3(.02, 0, 0)), .28, W, { shadow: false }); });
    s += stickAt(Object.assign({}, FRED, { turn: -.3, look: [-8, 2], armL: [18, 20], armR: [120, 10], mouth: "smile", turn: -.35 }), V3(.48, 0, 2.56), V3(.48, ADULT, 2.56), W);
  }
  if (n === 1) { // primer plano: Fred y la paloma picoteando la pantalla de la caja de entrenamiento
    W.setCam(V3(.85, 1.48, 2.9), V3(1.95, 1.22, .4), 46, 2.6, .004); W.render();
    s += behind(stickAt(Object.assign({}, FRED, { face: 'smug', mouth: 'smile', turn: .3, look: [10, 8], armL: [16, 24], armR: [30, 70] }), V3(1.95, 0, -.85), V3(1.95, ADULT, -.85), W, { shadow: false }), W.proj(V3(1.95, .9, -.1)).y);
    s += pg({ peck: .5, eye: 'calm' }, V3(1.6, .9, .45), .32, W); }
  if (n === 2) { // dentro del morro: la paloma con gafas frente a la pantalla con el barco
    W.setScreen(-.25); W.setCam(V3(W.NX + .22, 1.12, .78), V3(W.NX + 1.3, .95, 0), 46, 1.25, .006); W.render();
    s += pg({ peck: .1, eye: 'calm', goggles: true, look: [6, 0] }, V3(W.NX + 1.0, .55, 0), .36, W); }
  if (n === 3) { // mar: el buque y el misil bajando hacia él
    const M = W.MISSILE, P = V3(W.SEAX + 34, 12.5, 6), tgt = W.SHIP.position.clone().add(V3(0, 4, 0)); M.position.copy(P); const d = tgt.clone().sub(P);
    M.rotation.order = 'YZX'; M.rotation.set(0, Math.atan2(-d.z, d.x), Math.atan2(d.y, Math.hypot(d.x, d.z)));
    W.setCam(V3(W.SEAX + 42, 9, 36), V3(W.SEAX + 18, 9, -45), 44, 50, .0005); W.render(); }
  if (n === 4) { // sala del comité (detrás de la mesa: recortados por el borde de la mesa)
    W.setCam(V3(W.MX - .2, 1.75, 4.4), V3(W.MX - .1, 1.15, -1.4), 58, 5.9, .0012); W.render();
    const yT = W.proj(V3(W.MX, .92, .8)).y;
    [-1.8, -.6, .6, 1.8].forEach((x, k) => s += behind(stickAt(Object.assign({}, BOSSES[k], { turn: -x * .14, look: [-x * 3 + 6, 0], armL: [24, 50], armR: [24, 50], face: k === 2 ? 'angry' : 'smug', mouth: k === 1 ? 'smirk' : 'line' }), V3(W.MX + x, 0, -1.55), V3(W.MX + x, ADULT, -1.55), W, { shadow: false }), yT));
    s += stickAt(Object.assign({}, FRED, { turn: .6, look: [12, -4], armL: [18, 20], armR: [110, 40], mouth: 'open' }), V3(W.MX - 1.9, 0, 2.0), V3(W.MX - 1.9, ADULT, 2.0), W); }
  if (n === 5) { // escenario del premio
    W.charLight = { tint: '#ffe8c8', k: .2, rim: '#fff4dc', rimA: .7, rimX: 0, rimY: -1 };
    W.setCam(V3(W.SX + .05, 1.15, 2.4), V3(W.SX - .2, .88, -.15), 40, 2.5, .004); W.render();
    s += pg({ eye: 'calm', goggles: true, flap: .55, look: [4, -2] }, V3(W.SX - .38, .6, -.12), .34, W); }
  document.getElementById('sv').innerHTML = s; };
document.title = 'ready';

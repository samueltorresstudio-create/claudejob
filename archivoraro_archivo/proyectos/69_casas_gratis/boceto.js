// bocetos del 69 (pueblo, casa del regalo, interior, vecina, noche)
const W = W2, C = window.CAST69; const DAY = { tint: '#ffe2bd', k: .14, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.6 };
const NIGHT = { tint: '#8f9cff', k: .34, rim: '#9fd0ff', rimA: .7, rimX: 1, rimY: -.6 }, IN = { tint: '#ffd9a8', k: .2, rim: '#fff0d0', rimA: .55, rimX: 1, rimY: -.5 };
const who = (name, o, F, h = 1.84) => stickAt(Object.assign({}, C[name], o), F, V3(F.x, F.y + h, F.z), W);
const IX = W.IX;
const IY = W.IY; const LOG = (...a) => console.log(JSON.stringify(a));
window.SC = {
  regalo: () => { W.setMood(0, 0); W.setGift(1, .3); W.charLight = DAY; W.setCam(V3(8.2, 1.25, 10.5), V3(-1.6, 3.0, -4.6), 60); LOG('tu', [V3(6.9,0,8.4),V3(7.4,0,8.9),V3(6.4,0,7.6)].map(q=>{const r=W.proj(q);return [r.x|0,r.y|0];}));
    return who('TU', { face: 'wide', mouth: 'o', look: [-10, -12], turn: -.3, look: [8, -12], armL: [24, 30], armR: [30, 40], headTilt: 6 }, V3(5.14, 0, 6.84)); },
  reparto: () => { W.setMood(0, 0); W.setGift(0); W.charLight = DAY; W.setCam(V3(7, 1.5, 17.6), V3(7, 1.35, 5), 46); const xs = [3.6, 5.0, 6.4, 7.8, 9.2, 10.6], z = 11.1;
    let out = who('VECINA', { face: 'happy', mouth: 'smile' }, V3(xs[0], 0, z), 1.62) + who('TU', { face: 'smug', mouth: 'smirk', armR: [30, 40] }, V3(xs[1], 0, z)) + who('FUNC', { face: 'happy', mouth: 'smile' }, V3(xs[2], 0, z)) + who('AGENTE', {}, V3(xs[3], 0, z)) + who('HIJO', {}, V3(xs[4], 0, z)) + who('HIJA', {}, V3(xs[5], 0, z));
    const g = W.proj(V3(12.2, 1.95, z)); return out + ghost2d(g, g.ppm, { t: .6 }) + wisp(g.x + 70, g.y - 120, 10, 1); },
  apt: () => { W.setMood(0, 1); W.charLight = { tint: '#c8b0ff', k: .25, rim: '#ffd0a0', rimA: .6, rimX: -1, rimY: -.5 }; const AX = W.AX; W.setCam(V3(AX + 1.3, 1.5, 1.6), V3(AX - .4, 1.2, -1.4), 52); return who('TU', { face: 'smug', mouth: 'line', look: [6, 8], armR: [150, 110], armL: [16, 24] }, V3(AX - .3, 0, -.9)); },
  phone: () => { W.setMood(0, 1); W.setPhone({ beds: 3, mountain: true, price: '¥0', stamp: 1 }); const p = W.PHONE.position; W.setCam(V3(p.x + .02, p.y + .03, p.z + .24), V3(p.x, p.y, p.z), 46, .24, .0015); return ''; },
  mapa: () => { W.setMood(0, 0); W.setPins(.8); const c = W.MAPC; W.setCam(V3(c.x + .3, 2.75, c.z + 1.7), V3(c.x, .9, c.z - .2), 54); return ''; },
  ayto: () => { W.setMood(0, 0); W.charLight = DAY; const O = W.OX; W.setCam(V3(O - .5, 1.55, 3.25), V3(O - 1.6, 1.4, -.6), 56); return who('FUNC', { face: 'happy', mouth: 'laugh', armL: [120, 40], armR: [120, 40] }, V3(O - 1.6, 0, -.6)) + who('TU', { view: 'back' }, V3(O - .9, 0, 1.9)); },
  agente: () => { W.setMood(0, 0); W.setStamp(.6); const O = W.OX; W.setCam(V3(O - 2.0, 1.8, 3.3), V3(O - 2.7, .8, 2.0), 50); return who('AGENTE', { face: 'smug', mouth: 'line', armR: [60, 60] }, V3(O - 2.6, 0, 1.3)); },
  show: () => { W.setMood(0, 0); W.charLight = DAY; const X = W.SX; W.setCam(V3(X, 1.8, 3.7), V3(X, 1.0, -.6), 66); return ''; },
  tokio: () => { W.setMood(0, 0); W.charLight = DAY; const X = W.TX; W.setCam(V3(X + 3, 1.6, 9.5), V3(X, 3.0, -5), 56); return who('HIJO', {}, V3(X + 2.2, 0, 5.6)) + who('HIJA', {}, V3(X + 3.4, 0, 5.2)); },
  digger: () => { W.setMood(0, 0); W.setDigger({ yaw: .2, boom: .5, arm: -.6 }); W.setBills(.7); W.setCam(V3(-1, 2.2, 10.5), V3(-4, 1.5, 0), 52); return ''; },
  monedas: () => { W.setMood(0, 0); W.setDigger({ on: false }); W.setBills(0); W.setHouseGone(true); W.setCoins(6); W.setCam(V3(0, 4.2, 9.5), V3(0, .8, -4.6), 50); return ''; },
  nueva: () => { W.setMood(0, 0); W.setHouseGone(false); W.setCoins(0); W.setAge(.0); W.setPrice(30000000); W.setCam(V3(W.NX - 1.4, 1.7, W.NZ + 13), V3(W.NX - .6, 2.6, W.NZ), 52); return ''; },
  vieja: () => { W.setMood(0, 0); W.setAge(1); W.setPrice(0, .5); W.setCam(V3(W.NX - 1.4, 1.7, W.NZ + 13), V3(W.NX - .6, 2.6, W.NZ), 52); return ''; },
  coche: () => { W.setMood(0, 0); const X = W.SX; W.TT_CAR.rotation.y = .9; W.setCam(V3(X + .6, 1.35, 4.2), V3(X - .9, .7, -.4), 40); return ''; },
  coche2: () => { W.setMood(0, 0); const X = W.TX; W.setCam(V3(X - 24, 1.4, 9.2), V3(X - 20, .8, 3.5), 46); return ''; },
  coche3: () => { W.setMood(0, 0); const X = W.TX; W.setCam(V3(X + 30.5, 1.4, 9.4), V3(X + 26, .8, 5.6), 46); return ''; },
  cf: () => { W.setMood(0, 0); const X = W.SX; W.TT_CAR.rotation.y = -1.25; W.setCam(V3(X + .9, 1.25, 4.0), V3(X - .9, .7, -.4), 40); return ''; },
  pueblo: () => { W.setMood(0, 0); W.setGift(0); W.charLight = DAY; W.setCam(V3(-46, 34, 62), V3(6, -2, -40), 52); return ''; },
  interior: () => { W.setMood(0, 0); W.setGift(0); W.charLight = IN; W.setCam(V3(IX + 3.7, IY + 1.55, 2.5), V3(IX + .1, IY + .7, -1.2), 60); return who('TU', { face: 'wide', mouth: 'grin', look: [-10, 4], turn: -.35, armL: [20, 40], armR: [24, 50], sweat: true }, V3(IX + 1.3, IY, -1.0)); },
  genkan: () => { W.setMood(0, 0); W.setGift(0); W.charLight = IN; W.setCam(V3(IX + 5.7, IY + .1, 1.3), V3(IX + 4.45, IY - .1, -.5), 50); return ''; },
  vecina: () => { W.setMood(0, 0); W.setGift(0); W.charLight = DAY; W.setCam(V3(9.2, 1.45, 14.0), V3(12.6, 1.3, 4.8), 40); return who('TU', { turn: .7, face: 'smug', mouth: 'line', look: [10, -2], armL: [16, 20], armR: [16, 20] }, V3(10.6, 0, 8.0)) + who('VECINA', { face: 'smug', mouth: 'open', look: [-12, 0], armL: [112, 26], armR: [20, 30], turn: -.4 }, V3(13.2, 0, 5.2), 1.62); },
  noche: () => { W.setMood(0, 1); W.setGift(0); W.charLight = NIGHT; W.setDoor(W.HOUSE, .8); W.setCam(V3(-.6, 1.45, 11.4), V3(1.6, 1.9, -1.6), 50); LOG('tun', [V3(-1.4,0,8.0),V3(-.9,0,8.2)].map(q=>{const r=W.proj(q);return [r.x|0,r.y|0];})); const g = W.proj(V3(2.85, 2.3, -1.2)); LOG('ghost', g.x, g.y, g.ppm);
    return ghost2d(g, g.ppm, { t: 1.2, face: 'scared', look: [8, 0] }) + wisp(g.x - 160, g.y - 120, 16, 1) + wisp(g.x + 170, g.y - 60, 12, 2, 1) + who('TU', { face: 'wide', mouth: 'grin', look: [-10, -4], turn: -.4, armL: [60, 70], armR: [70, 80], sweat: true, lean: 6 }, V3(-.45, 0, 6.85)); },
};
window.READY = Promise.resolve();
window.shot = (name) => { const f = SC[name]; const svg = f(); W.setTime(1); W.render(); window.__T = 1; document.getElementById('fx').innerHTML = svg; };

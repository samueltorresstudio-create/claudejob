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
  pueblo: () => { W.setMood(0, 0); W.setGift(0); W.charLight = DAY; W.setCam(V3(-46, 34, 62), V3(6, -2, -40), 52); return ''; },
  interior: () => { W.setMood(0, 0); W.setGift(0); W.charLight = IN; W.setCam(V3(IX + 3.7, IY + 1.55, 2.5), V3(IX + .1, IY + .7, -1.2), 60); return who('TU', { face: 'wide', mouth: 'grin', look: [-10, 4], turn: -.35, armL: [20, 40], armR: [24, 50], sweat: true }, V3(IX + 1.3, IY, -1.0)); },
  genkan: () => { W.setMood(0, 0); W.setGift(0); W.charLight = IN; W.setCam(V3(IX + 5.7, IY + .1, 1.3), V3(IX + 4.45, IY - .1, -.5), 50); return ''; },
  vecina: () => { W.setMood(0, 0); W.setGift(0); W.charLight = DAY; W.setCam(V3(9.2, 1.45, 14.0), V3(12.6, 1.3, 4.8), 40); return who('TU', { turn: .7, face: 'smug', mouth: 'line', look: [10, -2], armL: [16, 20], armR: [16, 20] }, V3(10.6, 0, 8.0)) + who('VECINA', { face: 'smug', mouth: 'open', look: [-12, 0], armL: [112, 26], armR: [20, 30], turn: -.4 }, V3(13.2, 0, 5.2), 1.62); },
  noche: () => { W.setMood(0, 1); W.setGift(0); W.charLight = NIGHT; W.setDoor(W.HOUSE, .8); W.setCam(V3(-.6, 1.45, 11.4), V3(1.6, 1.9, -1.6), 50); LOG('tun', [V3(-1.4,0,8.0),V3(-.9,0,8.2)].map(q=>{const r=W.proj(q);return [r.x|0,r.y|0];})); const g = W.proj(V3(2.85, 2.3, -1.2)); LOG('ghost', g.x, g.y, g.ppm);
    return ghost2d(g, g.ppm, { t: 1.2, face: 'scared', look: [8, 0] }) + wisp(g.x - 160, g.y - 120, 16, 1) + wisp(g.x + 170, g.y - 60, 12, 2, 1) + who('TU', { face: 'wide', mouth: 'grin', look: [-10, -4], turn: -.4, armL: [60, 70], armR: [70, 80], sweat: true, lean: 6 }, V3(-.45, 0, 6.85)); },
};
window.READY = Promise.resolve();
window.shot = (name) => { const f = SC[name]; const svg = f(); W.setTime(1); W.render(); document.getElementById('fx').innerHTML = svg; };

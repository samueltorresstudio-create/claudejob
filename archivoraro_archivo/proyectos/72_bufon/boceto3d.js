const W = W2; window.READY = Promise.resolve();
const C = window.CAST72;
const SITP = (seatY, footY) => ({ y0: seatY - .8026, legLen: (seatY - footY) / .6358, legL: [55, 58], legR: [55, 58] });
window.shot = (name, o) => { W.setMood(o.mood || 'hall'); W.setTime(o.t || 1); W.setBanquet(!!o.banq); W.setDoors(o.doors || 0); W.setTokens(o.tk || 0, o.ts || 0); W.setFleet(o.ff || 0, o.fs || 0, o.fi || 0);
  W.setCam(V3(...o.cp), V3(...o.lk), o.fov || 50, null, o.ap ?? .0015); W.render(); W.charLight = ({ NIGHT, DAY, IN, CANDLE, COLD, DUSK })[o.light] || IN; document.getElementById('fx').innerHTML = window.SVG ? window.SVG(name, o) : ''; };
const far = L => L.sort((a, b) => W.camera.position.distanceTo(b[0]) - W.camera.position.distanceTo(a[0])).map(x => x[1]).join('');
window.SVG = (name, o) => { let L = [];
  if (name === 'sala') { const S = SITP(1.1, .75), F = V3(0, S.y0, W.THRONE.z + .1);
    L.push([F, who('REY', { legLen: S.legLen, legL: S.legL, legR: S.legR, armL: [40, 60], armR: [40, 60], face: 'smug', mouth: 'line' }, F, ADULT)]);
    const J = V3(.6, 0, -7.5); L.push([J, who('BUFON', { armL: [140, 30], armR: [140, 30], face: 'happy', mouth: 'laugh', turn: .2 }, J, ADULT)]);
    [[-2.2, -4, 'NOBLE1'], [2.2, -3, 'NOBLE2'], [-2.3, 0, 'NOBLE3'], [2.3, 1.2, 'NOBLE4']].forEach(([x, z, n]) => { const F2 = V3(x, 0, z); L.push([F2, who(n, { turn: x < 0 ? .5 : -.5 }, F2, ADULT)]); });
    [[-1.7, -10.4], [1.7, -10.4]].forEach(([x, z]) => { const F3 = V3(x, 0, z); L.push([F3, who('GUARDIA', {}, F3, ADULT)]); });
    return far(L); }
  if (name === 'trono') { const S = SITP(1.1, .75), F = V3(0, S.y0, W.THRONE.z + .1);
    L.push([F, who('REY', { legLen: S.legLen, legL: S.legL, legR: S.legR, armL: [40, 60], armR: [96, -40], prop: 'scepter', face: 'smug', mouth: 'smirk' }, F, ADULT)]);
    const J = V3(-.9, 0, -9.2); L.push([J, who('BUFON', { armL: [150, 20], armR: [120, 40], prop: 'marotte', face: 'happy', mouth: 'laugh', turn: .35, lean: -4 }, J, ADULT)]);
    [[1.9, -10.6], [-2.6, -10.9]].forEach(([x, z]) => { const F3 = V3(x, 0, z); L.push([F3, who('GUARDIA', { turn: x < 0 ? .3 : -.3 }, F3, ADULT)]); });
    return far(L); }
  if (name === 'guerra') { [[-1.9, -1.2, 'NOBLE1', .6], [1.9, -1.1, 'NOBLE2', -.6], [-.6, -1.6, 'NOBLE3', 0], [.8, -1.6, 'NOBLE4', 0]].forEach(([x, z, n, tn]) => { const F = V3(W.GX + x, 0, z); L.push([F, who(n, { turn: tn, look: [0, 12] }, F, ADULT)]); });
    return far(L); }
  return ''; };

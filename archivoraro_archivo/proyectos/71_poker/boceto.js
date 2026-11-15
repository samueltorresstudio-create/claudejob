const W = W2; window.READY = Promise.resolve();
window.shot = (name, o) => { const st = o.st || {}; W.setTime(o.t || 0); W.setSepia(o.sepia || 0);
  for (const k in st) { const f = W[k]; if (typeof f === 'function') f(...(Array.isArray(st[k]) ? st[k] : [st[k]])); }
  W.setCam(V3(...o.cp), V3(...o.lk), o.fov || 50, null, o.ap ?? .0015); W.render(); document.getElementById('fx').innerHTML = window.SVG ? window.SVG(name, o) : ''; };
const C = window.CAST71, TC = W.TC;
const seat = (n) => W.seatPos(W.SEATS[n], W.TR + .3);
window.SVG = (name, o) => { W.charLight = IN; let s = '';
  if (name === 'reparto') { s += `<rect width="1080" height="1920" fill="#f2ead8"/>`; ['MANOLO', 'PEPE', 'LUIS', 'TONI', 'CAMARERO', 'CUNADO'].forEach((n, i) => { const x = 180 + (i % 3) * 360, y = 760 + Math.floor(i / 3) * 760; s += `<g transform="translate(${x},${y}) scale(.95)">${stick(Object.assign({}, C[n], n === 'MANOLO' ? { armR: [40, 60], holdR: `<g transform="rotate(-30) scale(.7)">${FAN(ROYAL, 1, true)}</g>` } : {}))}</g><text x="${x}" y="${y + 70}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="36" fill="${K}">${n}</text>`; }); return s; }
  if (name === 'mesa') { const top = W.proj(V3(TC.x, W.TH, TC.z + W.TR)).y; const L = [];
    const sitting = (n, ov, a) => { const F = seat(n); F.y = .42; return [F, who(n, Object.assign({ legLen: .5, armL: [60, 70], armR: [60, 70] }, ov), F, 1.32)]; };
    L.push(sitting('MANOLO', { face: 'smug', mouth: 'smirk' }), sitting('PEPE', { face: 'happy', mouth: 'laugh', turn: .6 }), sitting('LUIS', { turn: -.6 }));
    s += L.sort((a, b) => W.camera.position.distanceTo(b[0]) - W.camera.position.distanceTo(a[0])).map(x => x[1]).join('');
    s = clipAbove(s, top + 10); const F = seat('toni'); F.y = .42; s += who('TONI', { view: 'back', legLen: .5 }, F, 1.32);
    ROYAL.forEach((c, i) => s += cardOnTable(V3(TC.x - .12 + i * .06, W.TH + .03, TC.z - .45), .1 * (i - 2), c[0], c[1], false));
    return s; }
  if (name === 'gafas') { s += `<rect width="1080" height="1920" fill="#f2ead8"/>`; const T = [-.6, -.3, 0, .3, .6], FC = [['smug', 'smirk'], ['happy', 'laugh'], ['wide', 'o'], ['open', 'smile'], ['closed', 'line']];
    ['MANOLO', 'LUIS'].forEach((n, r) => T.forEach((tn, i) => { const x = 110 + i * 215, y = 300 + r * 900; s += `<g transform="translate(${x},${y}) scale(.62)">${stick(Object.assign({}, C[n], { turn: tn, face: FC[i][0], mouth: FC[i][1], look: [tn * 12, 0], headOnly: 1, headTilt: 0 }))}</g>`; }));
    return s; }
  if (name === 'fan') { const p = W.proj(V3(TC.x, 1.0, TC.z - .55)); return `<g transform="translate(540,1180) scale(2.6)">${FAN(ROYAL, 1, true, .6)}</g>` + glint(330, 560, 50) + glint(760, 520, 34); }
  return s; };

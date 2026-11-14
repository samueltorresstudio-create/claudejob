// vistas de prueba del mundo del 70: window.shot(name, o) con o = {cp:[..], lk:[..], fov, mood:[m,n], section, st:{...}}
const W = W2; window.READY = Promise.resolve();
window.shot = (name, o) => { const st = o.st || {}; W.setMood(...(o.mood || [0, 0])); W.setSection(!!o.section); W.setTime(o.t || 0);
  for (const k in st) { const f = W[k]; if (typeof f === 'function') f(...(Array.isArray(st[k]) ? st[k] : [st[k]])); }
  W.setCam(V3(...o.cp), V3(...o.lk), o.fov || 50, null, o.ap ?? .0015); W.render(); document.getElementById('fx').innerHTML = window.SVG ? window.SVG(name, o) : ''; };
const JX = W.JX, C = window.CAST70;
window.SVG = (name, o) => { W.charLight = o.light ? window[o.light] : DAY; const t = o.t || 0; let s = '';
  if (name === 'reparto') { const L = [['PRESO', {}], ['JUEZ', { face: 'smug', mouth: 'line' }], ['PACO', {}], ['LOLA', {}], ['DIRECTOR', { face: 'wide', mouth: 'o', sweat: true }], ['INSPECTOR', { holdR: LENS, armR: [40, 70] }], ['POLI1', {}], ['RISA', { face: 'happy', mouth: 'laugh' }], ['ABOGADO', {}]];
    s += `<rect width="1080" height="1920" fill="#f2ead8"/>`; L.forEach(([n, ov], i) => { const x = 180 + (i % 3) * 360, y = 600 + Math.floor(i / 3) * 610, sc = .9; s += `<ellipse cx="${x}" cy="${y + 4}" rx="110" ry="18" fill="#000" opacity=".12"/><g transform="translate(${x},${y}) scale(${sc})">${stick(Object.assign({}, C[n], ov))}</g><text x="${x}" y="${y + 60}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="${K}">${n}</text>`; }); return s; }
  if (name === 'oferta') { const F = V3(JX + 3.4, .12, -1.72); const top = W.proj(V3(JX + 3.4, 1.05, -2.3)).y;
    s += who(C.RISA, { face: 'smug', mouth: 'line', legLen: .5 }, V3(JX + 2.2, 0, 2.2), 1.7) + who(window.CROWD70[1], { legLen: .5 }, V3(JX + 4.3, 0, 2.2), 1.7) + who(window.CROWD70[3], { legLen: .5 }, V3(JX + 3.2, 0, 3.5), 1.7);
    s += who('PACO', { armL: [10, 10], armR: [10, 10] }, V3(JX + 4.75, 0, -1.4));
    s += clipAbove(who('PRESO', { face: 'smug', mouth: 'line', look: [-8, 14], brows: -.3, armL: [30, 50], armR: [30, 50] }, F), top); return s; }
  if (name === 'risa') { const row = (z, list) => list.map(([c, x, ov]) => who(c, Object.assign({ face: 'happy', mouth: 'laugh', legLen: .5, armL: [40, 90], armR: [40, 90] }, ov), V3(JX + x, 0, z), 1.72)).join('');
    s += row(4.8, [[window.CROWD70[4], -4.6], [window.CROWD70[5], -2.2], [window.CROWD70[6], 1.6], [window.CROWD70[7], 3.6]]) + row(3.5, [[window.CROWD70[2], -3.4, { mouth: 'open' }], [window.CROWD70[3], -1.5], [window.CROWD70[0], 2.4]]) + row(2.2, [[C.RISA, -2.6, { armL: [150, 40], armR: [40, 120] }], [window.CROWD70[1], 1.4, { headTilt: 12 }]]); return s; }
  if (name === 'feliz') { const F = V3(-1.32, .66, -2.72), Hc = V3(.24, .74, -2.72); s += who('PRESO', { face: 'happy', mouth: 'smile', armL: [160, 130], armR: [160, 130], legL: [10, 0], legR: [-4, 0] }, F, Hc); const h = W.proj(Hc); s += glint(h.x - 70, h.y - 120, 22) + glint(h.x + 90, h.y - 90, 14); return s; }
  if (name === 'garita') { const y = W.proj(V3(-4.5, 1.06, 5.0)).y; let g = who('PACO', { face: 'closed', mouth: 'o', headTilt: 14, legLen: .6, armL: [20, 40], armR: [20, 40] }, V3(-5.3, 0, 6.62), 1.7) + who('LOLA', { face: 'closed', mouth: 'line', headTilt: -10, legLen: .6, armL: [20, 40], armR: [20, 40] }, V3(-3.6, 0, 6.62), 1.85);
    s += clipAbove(g, y); [[-5.3, 1.7], [-3.6, 1.85]].forEach(([x, hh], i) => { const p = W.proj(V3(x, hh + .4, 6.62)); s += zzz(p.x + 30, p.y, .9, t + i * .4); }); return s; }
  if (name === 'tunel') { const F = V3(2.0, -2.95, -2.75), Hc = V3(3.75, -2.55, -2.75); s += who('PRESO', { face: 'smug', mouth: 'smirk', look: [10, 0], armL: [70, -60], armR: [100, -70], legL: [60, 80], legR: [30, 90], holdR: LANTERN2 }, F, Hc, { shadow: false }); return s; }
  if (name === 'boveda') { const F = V3(9.0, -1.15, -2.82), top = W.proj(V3(9.0, 0, -2.35)).y; s += clipAbove(who('PRESO', { face: 'smug', mouth: 'smirk', wink: true, look: [0, 4], armR: [150, 30], holdR: BAR2(.9), armL: [60, 40] }, F), top); const h = headScr(F); s += glint(h.x + 120, h.y - 140, 24); return s; }
  if (name === 'calle') { const p = W.proj(V3(2.4, 1.95, -1.6)); return s; }
  return s; };

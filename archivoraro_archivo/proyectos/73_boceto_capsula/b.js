const W = W2;
window.shot = function (n) { W.setTime(2); let s = ''; const F = V3(-1.2, 0, -1.9);
  if (n === 0) { W.setCam(V3(-0.7, 1.25, 1.6), V3(-1.2, 1.0, -1.9), 40, null, .0022); W.render();
    s += capsulaAt({ face: 'picaro', turn: .15, lx: -1, armR: [70, 60, 120, -30] }, F, W); }
  if (n === 1) { s += `<rect width="1080" height="1920" fill="#efe6d4"/>`; const E = ['serio', 'picaro', 'feliz', 'preocupado', 'sorpresa', 'serio'], T = [0, .15, 0, -.1, 0, .45];
    E.forEach((e, i) => { const x = 200 + (i % 3) * 340, y = 830 + Math.floor(i / 3) * 900; s += `<g transform="translate(${x},${y}) scale(.7)">${capsula({ face: e, turn: T[i], lx: -1, noShadow: 0, armL: i === 4 ? [-60, -40, -90, -170] : undefined, armR: i === 4 ? [60, -40, 90, -170] : undefined })}</g><text x="${x}" y="${y + 60}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#3a2c24">${e.toUpperCase()}${i === 5 ? ' (¾)' : ''}</text>`; }); }
  document.getElementById('fx').innerHTML = s; };
document.title = 'ready';

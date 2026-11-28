window.READY = Promise.resolve();
const C73 = window.CAST73;
window.shot = (name, o) => { const fx = document.getElementById('fx'); let s = '';
  const lab = (x, y, t, fs = 34) => `<text x="${x}" y="${y}" font-family="Inter" font-weight="900" font-size="${fs}" text-anchor="middle" fill="#1b1720">${t}</text>`;
  const put = (n, x, y, sc, ov = {}) => `<g transform="translate(${x},${y}) scale(${sc})">${stick(Object.assign({}, typeof n === 'string' ? C73[n] : n, ov))}</g>`;
  if (name === 'reparto') { s += `<rect width="1080" height="1920" fill="#efe6d2"/>`;
    s += put('REG', 300, 820, 1.25) + lab(300, 950, 'REG');
    s += put('JOHN', 640, 820, 1.1) + lab(640, 950, 'JOHN, SU AMIGO');
    s += put('HIJA', 930, 820, .7) + lab(930, 950, 'SU HIJA', 30);
    [['AUSSIE1', 'TRABAJADOR'], ['AUSSIE2', 'TRABAJADOR'], ['LONDON', 'MOZO LONDRES'], ['PISTA', 'PISTA'], ['VIGILANTE', 'VIGILANTE'], ['CARTERO', 'CARTERO'], ['PAX1', 'PASAJERO'], ['PAX2', 'PASAJERA']].forEach(([n, t], i) => {
      const x = 75 + (i % 8) * 133, y = 1560; s += put(n, x, y, .56) + `<text x="${x}" y="${y + 68}" font-family="Inter" font-weight="900" font-size="20" text-anchor="middle" fill="#1b1720">${t}</text>`; });
  }
  if (name === 'caras') { s += `<rect width="1080" height="1920" fill="#efe6d2"/>`;
    const F = [[{ face: 'wide', mouth: 'o', sweat: true }, 'agobiado'], [{ face: 'smug', mouth: 'smirk' }, 'idea'], [{ face: 'closed', mouth: 'smile' }, 'aliviado'], [{ face: 'angry', mouth: 'line', sweat: true }, 'aguanta'], [{ face: 'happy', mouth: 'laugh' }, 'feliz']];
    F.forEach(([o, t], i) => { const x = 110 + i * 215, y = 600; s += put('REG', x, y, .62, o) + lab(x, y + 76, t, 24); });
    // agachado (prueba de postura dentro de la caja)
    [[{ legLen: .62, legL: [72, 140], legR: [72, 140], armL: [30, 110], armR: [30, 110] }, 'A'], [{ legLen: .7, legL: [58, 120], legR: [58, 120], armL: [60, 120], armR: [60, 120] }, 'B'], [{ legLen: .56, legL: [84, 150], legR: [84, 150], armL: [40, 130], armR: [40, 130] }, 'C']].forEach(([o, t], i) => { const x = 200 + i * 340, y = 1500;
      s += `<rect x="${x - 150}" y="${y - 420}" width="300" height="440" fill="#c4935a" stroke="#1b1720" stroke-width="8"/>` + put('REG', x, y, .9, Object.assign({ face: 'wide', mouth: 'o', sweat: true }, o)) + lab(x, y + 80, t); });
  }
  fx.innerHTML = s; };

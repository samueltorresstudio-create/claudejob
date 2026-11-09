// Archivo Raro · peinados v2: mechones con forma, volumen detrás de la cabeza, líneas de mechón, brillo y sombra en la frente.
// hairParts(style, col) → { back, front } in head coords (circle r=100 at 0,0).
function hairParts(style, col) {
  const K = '#1b1720', dk = mixC(col, '#000000', .35), lt = mixC(col, '#ffffff', .28);
  const strands = (arr, w = 4) => arr.map(d => `<path d="${d}" stroke="${dk}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`).join('');
  const shine = d => `<path d="${d}" stroke="${lt}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".55"/>`;
  const fill = d => `<path d="${d}" fill="${col}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>`;
  const shadowFore = d => `<path d="${d}" fill="#000" opacity=".09"/>`;
  const S = {};
  // tupé: swept up and to the right, pointed locks over the forehead (Dani)
  S.tupe = { back: `<path d="M-104,-2 C-112,-86 -58,-126 0,-124 C58,-126 112,-86 104,-2 Z" fill="${col}" stroke="${K}" stroke-width="8"/>`,
    front: shadowFore('M-90,-30 C-60,-50 -20,-60 10,-62 L36,-58 L56,-52 C74,-44 86,-30 92,-18 C70,-34 40,-40 6,-42 C-30,-42 -64,-30 -90,-30Z') +
      fill('M-99,-8 C-106,-64 -76,-106 -32,-116 C-14,-152 50,-170 94,-140 C80,-138 72,-132 74,-122 C98,-104 106,-58 99,-8 L92,-24 C84,-44 70,-56 54,-62 L60,-50 L38,-64 L40,-54 L14,-66 C-22,-70 -56,-58 -80,-36 L-78,-48 C-88,-38 -95,-24 -99,-8Z') +
      strands(['M-66,-96 C-34,-112 8,-122 52,-136', 'M-44,-74 C-14,-92 26,-104 70,-112', 'M24,-80 C44,-92 66,-96 88,-90', 'M-82,-58 C-72,-74 -58,-86 -40,-94']) + shine('M-46,-110 C-16,-128 24,-142 62,-148') },
  // despeinado: puntas en todas direcciones (alternativa para un personaje travieso)
  S.messy = { back: `<path d="M-104,0 L-116,-40 L-102,-52 L-112,-86 L-86,-92 L-84,-122 L-52,-116 L-36,-142 L-12,-122 L8,-148 L28,-122 L52,-140 L64,-112 L94,-118 L94,-88 L118,-78 L104,-50 L114,-24 L104,0Z" fill="${col}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>`,
    front: shadowFore('M-92,-28 C-50,-56 40,-60 92,-26 C50,-44 -50,-44 -92,-28Z') +
      `<path d="M-100,-8 C-106,-66 -66,-110 0,-114 C66,-110 106,-66 100,-8 L84,-30 L80,-58 L64,-44 L52,-70 L36,-50 L20,-74 L4,-52 L-14,-74 L-26,-50 L-46,-70 L-56,-46 L-76,-62 L-80,-34Z" fill="${col}"/>` +
      `<path d="M100,-8 L84,-30 L80,-58 L64,-44 L52,-70 L36,-50 L20,-74 L4,-52 L-14,-74 L-26,-50 L-46,-70 L-56,-46 L-76,-62 L-80,-34 L-100,-8" stroke="${K}" stroke-width="8" fill="none" stroke-linejoin="round"/>` +
      strands(['M-60,-90 L-50,-74', 'M-20,-100 L-14,-80', 'M24,-100 L18,-80', 'M62,-88 L54,-72'], 4) + shine('M-50,-96 C-20,-108 20,-110 50,-102') },
  // raya al lado: liso, con flequillo cayendo a un lado
  S.side = { back: `<path d="M-104,4 C-112,-84 -56,-124 0,-122 C56,-124 112,-84 104,4 Z" fill="${col}" stroke="${K}" stroke-width="8"/>`,
    front: shadowFore('M-94,-26 C-60,-56 -20,-66 30,-64 C60,-58 84,-44 96,-30 C60,-46 10,-50 -30,-46 C-60,-42 -80,-34 -94,-26Z') +
      fill('M-99,-6 C-106,-70 -66,-112 -20,-116 L-30,-104 C10,-120 70,-110 96,-60 C102,-40 101,-22 99,-6 C92,-30 80,-48 60,-58 C36,-70 4,-70 -24,-62 C-50,-54 -72,-44 -88,-20 L-90,-40Z') +
      `<path d="M-24,-112 C-30,-96 -32,-84 -30,-70" stroke="${dk}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      strands(['M-10,-104 C30,-104 62,-90 82,-66', 'M-4,-88 C30,-88 56,-76 74,-58', 'M-70,-86 C-56,-96 -44,-102 -34,-104']) + shine('M0,-108 C34,-108 64,-96 82,-76') },
  // rizado: contorno de bolitas
  S.curly = (() => { let back = '', front = '', P = [];
    for (let i = 0; i <= 12; i++) { const a = Math.PI * (1.02 + i / 12 * .96), r = 108 + (i % 2) * 6; P.push([Math.cos(a) * r, Math.sin(a) * r]); }
    back = P.map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${24 + (i % 3) * 3}" fill="${col}" stroke="${K}" stroke-width="7"/>`).join('');
    const F = [[-80, -52], [-54, -66], [-24, -74], [8, -76], [40, -70], [68, -58], [88, -40]];
    front = `<path d="M-100,-10 C-104,-80 -50,-116 0,-116 C50,-116 104,-80 100,-10 C80,-50 40,-66 0,-66 C-40,-66 -80,-50 -100,-10Z" fill="${col}"/>` +
      F.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${17 + (i % 2) * 3}" fill="${col}" stroke="${K}" stroke-width="7"/>`).join('') +
      F.map(([x, y]) => `<path d="M${x - 8},${y - 2} q8,-8 14,2" stroke="${lt}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>`).join('');
    return { back, front }; })();
  // pelo asomando bajo la gorra (Iker)
  S.capHair = { back: `<path d="M-104,10 C-110,-50 -96,-90 -60,-104 L60,-104 C96,-90 110,-50 104,10 Z" fill="${col}" stroke="${K}" stroke-width="8"/>`,
    front: [[-1], [1]].map(([sd]) => `<path d="M${sd * 98},-30 L${sd * 104},-6 L${sd * 94},-12 L${sd * 98},6 L${sd * 84},-10 C${sd * 86},-22 ${sd * 90},-28 ${sd * 98},-30Z" fill="${col}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`).join('') };
  return S[style] || { back: '', front: '' };
}

// 78 · La discoteca donde solo entran los feos — personajes NUEVOS con el sistema pjT (acabado del tendero, estilo .99).
// Siluetas distintas: portero = armario (hombros enormes, cintura estrecha) · guapo = V de gimnasio, alto · jersey = pera bajita y redonda · copa = barril.

// ---------- EL PORTERO: armario de dos puertas, traje negro con solapas de raso, camiseta negra, pinganillo con cable rizado,
// gafas de sol con reflejo de neón, calvo brillante con barba de puntos, cejas gruesas, brazos cruzados, reloj dorado, placa «STAFF» ----------
const POR_BODY = 'M170,1170 C200,1076 410,1052 595,1052 C780,1052 990,1076 1020,1170 C1012,1390 930,1610 840,1770 C806,1836 712,1858 595,1858 C478,1858 384,1836 350,1770 C260,1610 178,1390 170,1170Z';
function portero2d(o = {}) {
  const f = o.face || 'serio';
  return pjT(Object.assign({
    id: 'po', bald: 1, bodyPath: POR_BODY, bodyEdge: 'M1000,1330 C980,1560 900,1760 600,1862', shadowW: 360,
    top: ['#5a5664', '#34303c', '#1e1a24', '#0c0a10', '#7a7690', '#b0acc8'], hatC: ['#000', '#000', '#000', '#000'], brow: '#141010',
    legs: legsAt(500, 690, 1850), armW: 30,
    armL: o.point || o.armsDown ? 'M232,1260 C190,1420 175,1560 180,1700' : 'M330,1250 C360,1300 380,1340 400,1380', handL: o.point || o.armsDown ? [180, 1710] : [400, 1380],
    armR: o.point ? 'M960,1250 C1060,1200 1150,1160 1240,1130' : o.armsDown ? 'M958,1260 C1000,1420 1012,1560 1006,1700' : 'M860,1250 C830,1300 810,1340 790,1380', handR: o.point ? [1250, 1126] : o.armsDown ? [1006, 1710] : [790, 1380],
    bodyIn: id => `
      <path d="M470,1070 C520,1180 560,1300 595,1420 C630,1300 670,1180 720,1070Z" fill="#141016"/>
      <path d="M500,1080 C540,1170 570,1260 595,1340" stroke="#3a3440" stroke-width="10" fill="none" opacity=".7"/>
      <path d="M440,1066 C470,1200 520,1330 595,1440 C470,1400 360,1300 260,1170 C300,1110 370,1080 440,1066Z M750,1066 C720,1200 670,1330 595,1440 C720,1400 830,1300 930,1170 C890,1110 820,1080 750,1066Z" fill="#26222c" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M430,1100 C460,1220 510,1330 575,1420 M760,1100 C730,1220 680,1330 615,1420" stroke="#8a8698" stroke-width="9" fill="none" opacity=".55"/>
      <path d="M595,1440 L595,1850" stroke="${TK}" stroke-width="9"/>
      ${[1520, 1640].map(y => `<circle cx="625" cy="${y}" r="17" fill="#2a2630" stroke="${TK}" stroke-width="6"/><circle cx="620" cy="${y - 5}" r="5" fill="#8a8698"/>`).join('')}
      <path d="M330,1600 L460,1590 M740,1590 L870,1600" stroke="${TK}" stroke-width="8"/><path d="M335,1612 L455,1604" stroke="#6a6676" stroke-width="5" opacity=".6"/>
      ${[[380, 1300], [820, 1300], [450, 1700], [760, 1700]].map(([x, y]) => `<path d="M${x},${y} l14,-30 l14,30Z" fill="#9a96b0" opacity=".25"/>`).join('')}`,
    front: id => `
      <!-- pinganillo: cable rizado desde la oreja hasta el cuello -->
      <path d="M915,960 C930,1010 920,1050 890,1090" stroke="#d8d4e4" stroke-width="7" fill="none" stroke-dasharray="4 8"/>
      <path d="M898,1085 C870,1130 860,1180 870,1240" stroke="#d8d4e4" stroke-width="6" fill="none"/>
      <!-- placa STAFF en la solapa -->
      <g transform="translate(790,1150) rotate(9) scale(.85)"><rect x="-70" y="-30" width="140" height="60" rx="10" fill="#e8c860" stroke="${TK}" stroke-width="7"/><rect x="-60" y="-21" width="120" height="42" rx="6" fill="#1a1620"/>
        <text x="0" y="10" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#ffd34a">STAFF</text><path d="M-56,-18 L-30,-18" stroke="#fff" stroke-width="4" opacity=".6"/></g>
      ${o.point || o.armsDown ? '' : `      <!-- brazos cruzados por delante del pecho -->
      <path d="M210,1230 C240,1420 420,1500 640,1470 C700,1462 760,1440 800,1420" stroke="#1c1820" stroke-width="150" fill="none" stroke-linecap="round"/>
      <path d="M210,1230 C240,1420 420,1500 640,1470 C700,1462 760,1440 800,1420" stroke="${TK}" stroke-width="166" fill="none" stroke-linecap="round" opacity="0"/>
      <path d="M980,1230 C960,1410 800,1480 590,1440 C520,1428 460,1410 420,1392" stroke="${TK}" stroke-width="168" fill="none" stroke-linecap="round"/>
      <path d="M980,1230 C960,1410 800,1480 590,1440 C520,1428 460,1410 420,1392" stroke="#2a2630" stroke-width="150" fill="none" stroke-linecap="round"/>
      <path d="M960,1260 C930,1400 790,1446 600,1416" stroke="#5a5664" stroke-width="16" fill="none" opacity=".7" stroke-linecap="round"/>
      <path d="M210,1230 C240,1420 420,1500 640,1470" stroke="${TK}" stroke-width="10" fill="none" opacity=".0"/>
      <path d="M600,1468 C680,1468 740,1450 790,1426" stroke="${TK}" stroke-width="166" fill="none" stroke-linecap="round" opacity="0"/>
      <!-- mano izquierda saliendo bajo el brazo derecho y mano derecha con reloj de oro encima -->
      <circle cx="400" cy="1395" r="54" fill="#261717" stroke="${TK}" stroke-width="6"/><circle cx="384" cy="1376" r="14" fill="#5a4440" opacity=".5"/>
      <path d="M262,1300 C300,1356 340,1392 380,1404" stroke="#e8c860" stroke-width="0"/>
      <circle cx="800" cy="1430" r="54" fill="#261717" stroke="${TK}" stroke-width="6"/><circle cx="784" cy="1410" r="14" fill="#5a4440" opacity=".5"/>
      <g transform="translate(712,1440) rotate(-14)"><rect x="-34" y="-30" width="68" height="60" rx="14" fill="#e8c860" stroke="${TK}" stroke-width="7"/><circle r="18" fill="#1a1620" stroke="#b08a2a" stroke-width="5"/><path d="M0,0 L0,-12 M0,0 L9,4" stroke="#ffd34a" stroke-width="4" stroke-linecap="round"/><path d="M-24,-20 L-10,-24" stroke="#fff" stroke-width="5" opacity=".7"/></g>
`}
      ${o.point || o.armsDown ? '' : '<path d="M230,1260 C260,1400 380,1470 540,1478" stroke="#5a5664" stroke-width="14" fill="none" opacity=".6" stroke-linecap="round"/>'}`,
    headIn: id => `
      ${[...Array(70)].map((_, i) => { const a = (i * 137.5) % 360 * Math.PI / 180, r = 40 + ((i * 53) % 230), x = 590 + Math.cos(a) * r * 1.15, y = 1010 + Math.sin(a) * r * .42; return y > 900 && y < 1140 ? `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${5 + (i % 3)}" fill="#3a2e30" opacity=".55"/>` : ''; }).join('')}
      <path d="M330,520 C400,440 500,412 600,412" stroke="#fffdf2" stroke-width="28" fill="none" opacity=".75" stroke-linecap="round" filter="url(#${id}S1)"/>
      <ellipse cx="420" cy="500" rx="40" ry="18" fill="#fff" opacity=".7" transform="rotate(-30,420,500)"/>`,
    faceTop: (id, f) => {
      const up = f === 'sorpresa' ? 70 : 0;
      return `<g transform="translate(0,${up})">
        <path d="M402,790 L588,790 L578,880 Q512,930 430,880Z M622,790 L808,790 L780,880 Q698,930 632,880Z" fill="#141018" stroke="${TK}" stroke-width="16" stroke-linejoin="round"/>
        <path d="M588,800 Q605,782 622,800" stroke="${TK}" stroke-width="16" fill="none"/><path d="M402,796 L232,770 M808,796 L960,770" stroke="${TK}" stroke-width="14"/>
        ${[[420, 600], [640, 790]].map(([x0, x1]) => `<path d="M${x0 + 8},822 L${x1 - 30},822" stroke="#ff4fb8" stroke-width="11"/><path d="M${x0 + 14},840 L${x1 - 34},840" stroke="#ffd34a" stroke-width="11"/><path d="M${x0 + 22},858 L${x1 - 40},858" stroke="#4ff0ff" stroke-width="11"/><path d="M${x0 + 20},802 L${x0 + 60},802 L${x0 + 30},874Z" fill="#fff" opacity=".22"/>`).join('')}
      </g>` + (f === 'sorpresa' ? `<ellipse cx="512" cy="800" rx="30" ry="36" fill="${TK}"/><ellipse cx="698" cy="800" rx="30" ry="36" fill="${TK}"/><circle cx="520" cy="788" r="7" fill="#fff" opacity=".6"/><circle cx="706" cy="788" r="7" fill="#fff" opacity=".6"/>` : '');
    },
    hat: id => `<path d="M920,900 C946,880 966,900 962,940 C958,980 936,1000 914,990 Z" fill="#f0e4c4" stroke="${TK}" stroke-width="10"/><circle cx="938" cy="942" r="16" fill="#1a1620" stroke="${TK}" stroke-width="5"/><circle cx="934" cy="936" r="5" fill="#9a96b0"/>`
  }, o));
}

// ---------- EL GUAPO DEL GIMNASIO: V de gimnasio, alto; camisa blanca planchada ajustada con el cuello abierto, cadenita, cinturón de piel,
// tupé engominado enorme con brillo, cejas perfiladas, mandíbula marcada (sombra), sonrisa con destello; peine en la mano ----------
const GYM_BODY = 'M250,1160 C280,1074 430,1052 595,1052 C760,1052 910,1074 940,1160 C930,1340 860,1520 790,1680 C760,1760 700,1790 595,1790 C490,1790 430,1760 400,1680 C330,1520 260,1340 250,1160Z';
function guapo2d(o = {}) {
  return pjT(Object.assign({
    id: 'gu', bodyPath: GYM_BODY, bodyEdge: 'M930,1300 C890,1520 820,1760 600,1794', shadowW: 280,
    top: ['#ffffff', '#f2f4fa', '#d4d8e6', '#9aa0b4', '#ffffff', '#ffffff'], hatC: ['#6a4228', '#4a2a16', '#32180a', '#1e0c04'], brow: '#3a2010',
    legs: legsAt(520, 670, 1780),
    armL: 'M262,1240 C210,1380 190,1520 200,1660', handL: [200, 1670], armR: 'M928,1240 C980,1360 1000,1440 990,1520', handR: [990, 1530],
    bodyIn: id => `
      <path d="M520,1060 L595,1220 L670,1060Z" fill="#f0d8b8"/><path d="M540,1066 L595,1190 L650,1066" stroke="#d8b894" stroke-width="6" fill="none"/>
      <path d="M520,1080 C560,1150 590,1180 595,1240 C600,1180 630,1150 670,1080" stroke="#e8c860" stroke-width="7" fill="none"/><circle cx="595" cy="1238" r="12" fill="#e8c860" stroke="${TK}" stroke-width="4"/>
      <path d="M595,1250 L595,1780" stroke="#c8ccda" stroke-width="8"/>${[1320, 1420, 1520, 1620].map(y => `<circle cx="610" cy="${y}" r="11" fill="#f8f8fc" stroke="#9aa0b4" stroke-width="4"/>`).join('')}
      <path d="M700,1300 L800,1300 L796,1390 L704,1390Z" fill="none" stroke="#b4b8c8" stroke-width="7"/><path d="M704,1316 L796,1316" stroke="#b4b8c8" stroke-width="5"/>
      ${[[430, 1340, 520, 1500], [760, 1340, 680, 1500], [470, 1560, 560, 1700], [720, 1560, 640, 1700]].map(([a, b, c, d]) => `<path d="M${a},${b} Q${(a + c) / 2 + 20},${(b + d) / 2} ${c},${d}" stroke="#b4b8cc" stroke-width="7" fill="none" opacity=".7"/>`).join('')}
      <path d="M330,1650 C450,1680 740,1680 860,1650 L850,1715 C730,1745 460,1745 340,1715Z" fill="#7a4a22" stroke="${TK}" stroke-width="8"/><rect x="562" y="1660" width="66" height="54" rx="8" fill="#e8c860" stroke="${TK}" stroke-width="6"/><rect x="580" y="1676" width="30" height="22" rx="3" fill="#7a4a22"/>`,
    front: id => `
      <path d="M470,1050 L522,1160 L560,1066Z M720,1050 L668,1160 L630,1066Z" fill="#ffffff" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M200,1670 l-6,-150" stroke="none"/>
      <g transform="translate(200,1590) rotate(-20)"><rect x="-16" y="-120" width="32" height="170" rx="8" fill="#2a2a34" stroke="${TK}" stroke-width="6"/>${[...Array(9)].map((_, i) => `<path d="M16,${-108 + i * 13} l22,0" stroke="#2a2a34" stroke-width="6" stroke-linecap="round"/>`).join('')}<path d="M-8,-110 L-8,30" stroke="#6a6a78" stroke-width="5" opacity=".7"/></g>
      <circle cx="200" cy="1670" r="44" fill="#261717"/><circle cx="186" cy="1654" r="12" fill="#5a4440" opacity=".5"/>
      <rect x="960" y="1490" width="64" height="36" rx="12" fill="#c9ced6" stroke="${TK}" stroke-width="6"/>`,
    headIn: id => `<path d="M300,960 C360,1080 470,1140 590,1146 C710,1140 820,1080 880,960" stroke="#c89c7c" stroke-width="40" fill="none" opacity=".35" filter="url(#${id}S2)"/>`,
    faceTop: (id, f) => (o.disfraz ? `<g transform="rotate(14,605,848)">${glasses('#3a2a20', 78)}</g>` + (f === 'feliz' ? `<rect x="578" y="998" width="40" height="34" rx="5" fill="#141014"/>` : '') : '') + (f === 'feliz' && !o.disfraz ? `<g transform="translate(690,1000)"><path d="M0,-34 L8,-8 L34,0 L8,8 L0,34 L-8,8 L-34,0 L-8,-8Z" fill="#fff" stroke="${TK}" stroke-width="5"/></g>` : '') + `<path d="M540,1120 C570,1134 620,1134 650,1120" stroke="#8a6a50" stroke-width="10" fill="none" opacity=".5" stroke-linecap="round"/>`,
    hat: id => (o.disfraz ? [[300,520,200,330],[420,450,380,230],[560,420,600,200],[700,440,800,250],[820,500,960,380],[880,600,1010,560]].map(([x1,y1,x2,y2]) => `<path d="M${x1},${y1} Q${(x1+x2)/2+30},${(y1+y2)/2} ${x2},${y2}" stroke="#32180a" stroke-width="26" fill="none" stroke-linecap="round"/>`).join('') : '') + `<g>
      <path d="M232,690 C212,540 300,420 430,372 C410,300 460,226 560,204 C690,178 830,214 880,300 C940,334 968,430 956,540 C954,610 950,660 946,694 C910,612 830,566 730,560 C650,556 600,542 562,516 C500,556 410,578 336,620 C292,644 258,666 232,690Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="14" stroke-linejoin="round"/>
      <path d="M430,372 C470,330 540,300 620,300 C540,330 500,380 490,440" stroke="#32180a" stroke-width="12" fill="none" stroke-linecap="round"/>
      ${[[300, 600, 470, 380], [400, 560, 560, 330], [520, 520, 700, 300], [660, 540, 840, 340], [780, 570, 920, 430]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} C${(x1 + x2) / 2 - 10},${y1 - 70} ${x2 - 50},${y2 + 30} ${x2},${y2}" stroke="#a87048" stroke-width="11" fill="none" stroke-linecap="round" opacity=".8"/>`).join('')}
      <path d="M500,250 C600,210 740,214 830,270" stroke="#f0c8a0" stroke-width="18" fill="none" opacity=".85" stroke-linecap="round" filter="url(#${id}S1)"/>
      <ellipse cx="600" cy="236" rx="40" ry="14" fill="#fff" opacity=".85" transform="rotate(-10,600,236)"/>
      <path d="M240,700 C234,760 240,820 256,860" stroke="#32180a" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M942,700 C948,760 942,820 926,860" stroke="#32180a" stroke-width="26" fill="none" stroke-linecap="round"/></g>`
  }, o));
}

// ---------- EL DEL JERSEY DE SU ABUELA: bajito y en pera; jersey de punto mostaza con rombos y cuello vuelto, coderas, pantalón de pana,
// gafas redondas torcidas, pelo revuelto con remolino, pecas, orejas grandes; bolsito de tela al hombro ----------
const JER_BODY = 'M380,1200 C392,1110 480,1082 595,1082 C710,1082 798,1110 810,1200 C860,1340 930,1520 920,1680 C908,1800 780,1860 595,1860 C410,1860 282,1800 270,1680 C260,1520 330,1340 380,1200Z';
function jersey2d(o = {}) {
  return pjT(Object.assign({
    id: 'je', bodyPath: JER_BODY, bodyEdge: 'M890,1400 C940,1600 900,1820 600,1864', shadowW: 330, freckles: 1,
    top: ['#f4c85a', '#e0a832', '#b8801c', '#7a5008', '#ffe08a', '#fff0b8'], hatC: ['#a0602a', '#7a4418', '#5a300c', '#3a1c04'], brow: '#5a3010',
    legs: legsAt(520, 670, 1850),
    armL: 'M384,1260 C330,1400 300,1540 290,1680', handL: [290, 1690], armR: 'M806,1260 C860,1400 890,1540 900,1680', handR: [900, 1690],
    bodyIn: id => `
      ${[1300, 1420, 1540, 1660].map((y, j) => [...Array(7)].map((_, i) => { const x = 330 + i * 92 + (j % 2) * 46; return `<path d="M${x},${y - 40} L${x + 34},${y} L${x},${y + 40} L${x - 34},${y}Z" fill="${j % 2 ? '#c8342c' : '#3a6ab0'}" stroke="${TK}" stroke-width="5" opacity=".95"/><circle cx="${x}" cy="${y}" r="7" fill="#fff4d0"/>`; }).join('')).join('')}
      ${[1240, 1360, 1480, 1600, 1720].map(y => `<path d="M260,${y} Q595,${y + 30} 940,${y}" stroke="#b8801c" stroke-width="6" fill="none" opacity=".6"/>`).join('')}
      ${[...Array(30)].map((_, i) => `<path d="M${300 + (i * 61) % 600},${1220 + (i * 97) % 600} l6,10 l6,-10" stroke="#7a5008" stroke-width="3" fill="none" opacity=".35"/>`).join('')}
      <path d="M290,1770 C450,1820 740,1820 900,1770 L896,1800 C740,1850 450,1850 294,1800Z" fill="#b8801c"/>${[...Array(18)].map((_, i) => `<path d="M${310 + i * 33},${1784 + Math.sin(i / 17 * Math.PI) * 30} l0,26" stroke="#7a5008" stroke-width="5"/>`).join('')}`,
    front: id => `
      <path d="M440,1100 C480,1060 710,1060 750,1100 L760,1170 C700,1210 490,1210 430,1170Z" fill="#e0a832" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      ${[...Array(11)].map((_, i) => `<path d="M${450 + i * 29},${1110 + Math.sin(i / 10 * Math.PI) * 18} l0,${60 + Math.sin(i / 10 * Math.PI) * 18}" stroke="#b8801c" stroke-width="6"/>`).join('')}
      <path d="M760,1120 C700,1300 640,1440 560,1560" stroke="#8a6a4a" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M752,1126 C694,1300 634,1436 556,1552" stroke="#b8946a" stroke-width="6" fill="none" opacity=".8"/>
      <path d="M450,1540 C520,1520 620,1530 660,1560 L680,1720 C620,1750 500,1750 440,1720Z" fill="#8a6a4a" stroke="${TK}" stroke-width="11" stroke-linejoin="round"/><path d="M460,1580 C530,1568 610,1574 656,1594" stroke="#b8946a" stroke-width="7" fill="none" opacity=".8"/>
      <g transform="translate(560,1640)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-16" rx="11" ry="16" fill="#f4f0e4" stroke="${TK}" stroke-width="4" transform="rotate(${a})"/>`).join('')}<circle r="9" fill="#f4c030" stroke="${TK}" stroke-width="4"/></g>
      <ellipse cx="300" cy="1560" rx="40" ry="60" fill="#8a5a2a" stroke="${TK}" stroke-width="7" transform="rotate(10,300,1560)"/><ellipse cx="890" cy="1560" rx="40" ry="60" fill="#8a5a2a" stroke="${TK}" stroke-width="7" transform="rotate(-10,890,1560)"/>`,
    faceTop: (id, f) => `<g transform="rotate(-7,605,848)">${glasses('#4a3020', 76)}</g>`,
    hat: id => `<g>
      <path d="M220,720 C200,560 300,420 470,370 C600,334 760,350 860,420 C950,484 980,600 960,720 C930,640 900,600 860,580 C880,640 870,660 850,680 C820,620 780,590 730,580 C740,620 730,640 710,650 C680,600 640,580 590,580 C560,610 530,630 500,640 C500,610 490,590 470,590 C430,610 400,640 380,690 C370,650 360,620 340,610 C290,640 250,680 220,720Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="14" stroke-linejoin="round"/>
      <path d="M600,370 C580,300 620,250 680,250 C650,280 640,320 660,360 C700,300 760,300 790,330 C750,340 720,370 710,400Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      ${[[300, 600, 420, 450], [420, 560, 540, 400], [560, 540, 650, 400], [700, 560, 820, 450], [820, 600, 900, 520]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} Q${(x1 + x2) / 2 + 30},${(y1 + y2) / 2} ${x2},${y2}" stroke="#c8884a" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>`).join('')}
      <path d="M380,440 C450,400 520,384 600,384" stroke="#e8b47a" stroke-width="14" fill="none" opacity=".7" stroke-linecap="round" filter="url(#${id}S1)"/>
      <ellipse cx="212" cy="830" rx="46" ry="74" fill="#f2dcb8" stroke="${TK}" stroke-width="14"/><path d="M220,790 C200,820 200,860 222,880" stroke="#c89c7c" stroke-width="10" fill="none"/>
      <ellipse cx="968" cy="830" rx="46" ry="74" fill="#f2dcb8" stroke="${TK}" stroke-width="14"/><path d="M960,790 C980,820 980,860 958,880" stroke="#c89c7c" stroke-width="10" fill="none"/></g>`
  }, o));
}

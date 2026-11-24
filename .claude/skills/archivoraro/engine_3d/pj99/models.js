// Catálogo de modelos de prueba (inventados) con el sistema pjT (mismo acabado que el tendero).
// Piezas reutilizables: cuerpos, sombreros/pelo, bigotes/barbas, gafas. Para cada vídeo se crean personajes NUEVOS combinando y adaptando estas piezas.
const BODY = {
  gordo: 'M330,1200 C350,1090 470,1060 595,1060 C720,1060 840,1090 860,1200 C930,1330 950,1520 900,1660 C850,1770 740,1800 595,1800 C450,1800 340,1770 290,1660 C240,1520 260,1330 330,1200Z',
  fuerte: 'M250,1180 C270,1090 420,1070 595,1070 C770,1070 920,1090 940,1180 C930,1380 860,1600 810,1760 C780,1840 700,1860 595,1860 C490,1860 410,1840 380,1760 C330,1600 260,1380 250,1180Z',
  nina: 'M450,1190 C458,1120 520,1096 595,1096 C670,1096 732,1120 740,1190 C748,1280 742,1360 730,1420 C800,1520 840,1620 860,1720 C780,1760 410,1760 330,1720 C350,1620 390,1520 460,1420 C448,1360 442,1280 450,1190Z',
  anciano: 'M350,1210 C364,1110 470,1080 595,1080 C720,1080 826,1110 840,1210 C860,1400 866,1600 856,1730 C844,1830 750,1870 595,1870 C440,1870 346,1830 334,1730 C324,1600 330,1400 350,1210Z',
  gabardina: 'M370,1190 C380,1100 480,1072 595,1072 C710,1072 810,1100 820,1190 C836,1400 870,1700 900,1960 C800,1990 390,1990 290,1960 C320,1700 354,1400 370,1190Z'
};
const MUST = {
  morsa: 'M600,902 C560,880 470,882 432,928 C395,972 390,1030 412,1050 C432,1066 452,1040 452,1012 C460,990 520,990 600,996 C680,990 740,990 750,1012 C752,1040 770,1066 790,1052 C812,1032 806,972 768,928 C730,882 640,880 600,902Z',
  fino: 'M600,930 C570,915 520,915 490,935 C470,948 450,950 432,940 C440,970 480,978 520,966 C550,958 580,952 600,956 C620,952 650,958 680,966 C720,978 760,970 768,940 C750,950 730,948 710,935 C680,915 630,915 600,930Z'
};
function mustache(id, d, fill, light) {
  return `<clipPath id="${id}Mc"><path d="${d}"/></clipPath><path d="${d}" fill="${fill}"/><g clip-path="url(#${id}Mc)"><path d="M428,1000 C440,950 520,925 600,940 C680,925 760,950 772,1000" stroke="${light}" stroke-width="30" fill="none" opacity=".7" filter="url(#${id}S2)"/></g><path d="${d}" fill="none" stroke="${TK}" stroke-width="20" stroke-linejoin="round"/>`;
}
function glasses(col = '#8a6a2a', r = 74) {
  return `<circle cx="512" cy="848" r="${r}" fill="#dfeef4" fill-opacity=".16" stroke="${col}" stroke-width="13"/><circle cx="698" cy="848" r="${r}" fill="#dfeef4" fill-opacity=".16" stroke="${col}" stroke-width="13"/>
    <path d="M586,842 Q605,826 624,842" stroke="${col}" stroke-width="11" fill="none"/><path d="M438,836 L240,800 M772,836 L940,800" stroke="${col}" stroke-width="10"/>
    <path d="M470,800 Q492,784 516,788" stroke="#fff" stroke-width="8" fill="none" opacity=".7" stroke-linecap="round"/><path d="M656,800 Q678,784 702,788" stroke="#fff" stroke-width="8" fill="none" opacity=".7" stroke-linecap="round"/>`;
}
const legsAt = (x1, x2, y0, y1 = 2100) => `M${x1},${y0} L${x1 - 6},${y1} M${x2},${y0} L${x2 + 6},${y1}`;

// 1. DON ANSELMO, el banquero: bajito y gordo, chistera, gafas, bigote de morsa gris, traje negro, chaleco gris, cadena de reloj
function anselmo2d(o = {}) {
  return pjT(Object.assign({
    id: 'an', bodyPath: BODY.gordo, bodyEdge: 'M930,1450 C940,1620 860,1780 600,1802',
    top: ['#3a3a44', '#2a2a32', '#1c1c22', '#0e0e12', '#6a6a7a', '#a8a8bc'], hatC: ['#4a4a52', '#2a2a30', '#18181c', '#0a0a0c'],
    brow: '#a8a49c', cheeks: 1, legs: legsAt(500, 690, 1790),
    armL: 'M300,1300 C240,1420 215,1560 210,1680', handL: [210, 1690], armR: 'M890,1300 C950,1420 975,1560 980,1680', handR: [980, 1690],
    bodyIn: id => `<path d="M510,1160 C540,1300 560,1500 560,1790 L640,1790 C640,1500 660,1300 690,1160Z" fill="#8a8a94"/><path d="M560,1300 L560,1790" stroke="#5a5a64" stroke-width="6" opacity=".6"/>
      ${[1420, 1500, 1580, 1660].map(y => `<circle cx="600" cy="${y}" r="12" fill="#3a3a44" stroke="${TK}" stroke-width="4"/>`).join('')}
      <path d="M520,1160 L430,1500 M680,1160 L770,1500" stroke="#0e0e12" stroke-width="10" opacity=".8"/>`,
    front: id => `<path d="M560,1180 L640,1180 L600,1250Z" fill="url(#${id}Tri)" stroke="${TK}" stroke-width="6"/><path d="M570,1200 L630,1200 L600,1320Z" fill="#7a1a2a" stroke="${TK}" stroke-width="6"/>
      <path d="M580,1520 C620,1580 700,1590 760,1540" stroke="#d8b040" stroke-width="7" fill="none"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${590 + i * 32}" cy="${1532 + Math.sin(i / 5 * Math.PI) * 44}" r="6" fill="#e8c860" stroke="#6a4a10" stroke-width="2"/>`).join('')}
      <circle cx="770" cy="1540" r="24" fill="#e8c860" stroke="${TK}" stroke-width="6"/><circle cx="770" cy="1540" r="13" fill="#f8f0d8"/>
      <path d="M720,1390 L800,1386 L796,1420 L724,1424Z" fill="#f6f0e4" stroke="${TK}" stroke-width="5"/>`,
    faceTop: (id, f) => mustache(id, MUST.morsa, '#bcb6ac', '#e4ded4') + glasses('#c8a040', 70),
    hat: id => `<path d="M236,720 C236,640 262,610 296,612 C286,660 282,710 288,790 L250,800Z M944,720 C944,640 918,610 884,612 C894,660 898,710 892,790 L930,800Z" fill="#c8c4bc" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <g transform="rotate(4,590,560)">
      <path d="M150,570 C300,546 880,546 1030,570 C1040,600 1000,620 960,618 C760,600 420,600 220,618 C180,620 140,600 150,570Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M340,566 L370,170 C470,150 710,150 810,170 L840,566Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <ellipse cx="590" cy="170" rx="220" ry="34" fill="#3a3a42" stroke="${TK}" stroke-width="10"/>
      <path d="M350,500 L838,500 L840,566 L340,566Z" fill="#7a1a2a" stroke="${TK}" stroke-width="8"/>
      <path d="M400,220 C390,320 384,420 380,490" stroke="#8a8a96" stroke-width="16" fill="none" opacity=".7" stroke-linecap="round" filter="url(#${id}S1)"/>
      <path d="M780,200 C800,320 810,420 812,490" stroke="#000" stroke-width="40" fill="none" opacity=".35" filter="url(#${id}S2)"/></g>`
  }, o));
}

// 2. BRUNO, el obrero: ancho de hombros, barba negra, pelo rapado, mono de trabajo azul con tirantes, brazos gruesos
function bruno2d(o = {}) {
  return pjT(Object.assign({
    id: 'br', bodyPath: BODY.fuerte, bodyEdge: 'M930,1250 C900,1450 850,1650 600,1862',
    top: ['#4a6a9a', '#3a5682', '#2a4062', '#182840', '#7a9ac8', '#b8d0ec'], hatC: ['#000', '#000', '#000', '#000'],
    brow: '#1a1210', armW: 36, legs: legsAt(510, 680, 1850),
    armL: 'M262,1230 C190,1400 165,1560 160,1720', handL: [160, 1730], armR: 'M928,1230 C1000,1400 1025,1560 1030,1720', handR: [1030, 1730],
    bodyIn: id => `<path d="M250,1080 L250,1400 C350,1420 480,1430 595,1430 C710,1430 840,1420 940,1400 L940,1080Z" fill="#d8d0c0"/>
      <path d="M300,1080 C310,1200 330,1300 360,1420 M890,1080 C880,1200 860,1300 830,1420" stroke="#c8b8a0" stroke-width="8" opacity=".6"/>
      <path d="M430,1420 L760,1420 L760,1600 L430,1600Z" fill="#3a5682" stroke="${TK}" stroke-width="9"/><path d="M470,1460 L720,1460" stroke="#7a9ac8" stroke-width="6" opacity=".6"/>
      <rect x="540" y="1480" width="110" height="80" rx="8" fill="#2a4062" stroke="${TK}" stroke-width="6"/>
      <path d="M440,1430 L400,1100 M750,1430 L790,1100" stroke="#3a5682" stroke-width="56"/><path d="M440,1430 L400,1100 M750,1430 L790,1100" stroke="${TK}" stroke-width="6" stroke-dasharray="0" opacity=".0"/>
      ${[[440, 1430], [750, 1430]].map(([x, y]) => `<rect x="${x - 22}" y="${y - 40}" width="44" height="44" rx="6" fill="#c49e36" stroke="${TK}" stroke-width="5"/>`).join('')}
      <path d="M595,1600 L595,1860" stroke="#182840" stroke-width="6" opacity=".6"/>`,
    front: id => `<path d="M410,1100 L440,1430 M780,1100 L750,1430" stroke="${TK}" stroke-width="64" opacity=".0"/>`,
    headIn: id => `<path d="M220,860 C240,1080 400,1200 590,1200 C780,1200 940,1080 960,860 C900,930 800,960 720,940 C680,990 500,990 460,940 C380,960 280,930 220,860Z" fill="#2a1c18"/>
      <path d="M300,960 C360,1040 460,1080 590,1090" stroke="#4a3a34" stroke-width="14" fill="none" opacity=".7" stroke-linecap="round"/>
      <path d="M260,520 C340,430 470,400 590,400 C710,400 840,430 920,520" stroke="#3a2c28" stroke-width="120" fill="none" opacity=".35" filter="url(#${id}S2)"/>
      ${[...Array(40)].map((_, i) => `<circle cx="${300 + (i * 97) % 580}" cy="${430 + (i * 53) % 140}" r="4" fill="#3a2c28" opacity=".5"/>`).join('')}`,
    hat: id => `<path d="M220,860 C240,1080 400,1200 590,1200 C780,1200 940,1080 960,860 C900,930 800,960 720,940 C680,990 500,990 460,940 C380,960 280,930 220,860Z" fill="none" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>`
  }, o));
}

// 3. LUCÍA, la niña: pequeña, coletas con lazos rojos, vestido amarillo con cuello blanco, calcetines
function lucia2d(o = {}) {
  return `<g transform="translate(590,2100) scale(.8) translate(-590,-2100)">` + pjT(Object.assign({
    id: 'lu', bodyPath: BODY.nina, bodyEdge: 'M745,1300 C740,1400 800,1560 850,1720', top: ['#f4c84a', '#e8b030', '#c89020', '#8a6010', '#fae08a', '#fff4c8'],
    hatC: ['#000', '#000', '#000', '#000'], cheeks: 1, lashes: 1, brow: '#4a2a14', legs: legsAt(530, 660, 1740),
    armL: 'M455,1250 C400,1380 370,1500 360,1600', handL: [360, 1610], armR: 'M735,1250 C790,1380 820,1500 830,1600', handR: [830, 1610],
    back: id => [-1, 1].map(sd => `<path d="M${590 + sd * 330},700 C${590 + sd * 470},740 ${590 + sd * 480},900 ${590 + sd * 420},1010 C${590 + sd * 400},940 ${590 + sd * 370},820 ${590 + sd * 320},760Z" fill="#6a3a1a" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>`).join(''),
    under: id => `<path d="M524,1940 L524,2080 M666,1940 L666,2080" stroke="#f6f2ea" stroke-width="40"/><path d="M500,2090 L550,2090 M640,2090 L690,2090" stroke="#7a1a1a" stroke-width="28" stroke-linecap="round"/>`,
    bodyIn: id => `<path d="M330,1700 C450,1730 740,1730 860,1700" stroke="#fff4c8" stroke-width="16" opacity=".8"/>${[1500, 1560, 1620].map(y => `<path d="M${400 - (y - 1500) * .3},${y} L${790 + (y - 1500) * .3},${y}" stroke="#c89020" stroke-width="5" stroke-dasharray="20 18" opacity=".6"/>`).join('')}`,
    front: id => `<path d="M470,1140 C520,1200 560,1220 595,1220 C630,1220 670,1200 720,1140 L740,1180 C690,1250 640,1270 595,1270 C550,1270 500,1250 450,1180Z" fill="#fbf6ec" stroke="${TK}" stroke-width="8"/>
      <path d="M560,1260 C520,1230 490,1250 500,1280 C510,1310 550,1300 570,1285Z M630,1260 C670,1230 700,1250 690,1280 C680,1310 640,1300 620,1285Z" fill="#d83a3a" stroke="${TK}" stroke-width="7"/><circle cx="595" cy="1275" r="16" fill="#c02a2a" stroke="${TK}" stroke-width="6"/>`,
    hat: id => `<path d="M232,700 C230,480 400,400 590,400 C780,400 950,480 948,700 C900,620 820,580 730,575 C700,620 650,640 590,640 C530,640 480,620 450,575 C360,580 280,620 232,700Z" fill="#6a3a1a" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M320,540 C400,460 500,440 580,440" stroke="#9a5a30" stroke-width="14" fill="none" opacity=".8" stroke-linecap="round"/>
      ${[-1, 1].map(sd => `<g transform="translate(${590 + sd * 330},690)"><path d="M0,0 C${sd * 40},-50 ${sd * 90},-40 ${sd * 80},0 C${sd * 90},40 ${sd * 40},50 0,0Z M0,0 C${-sd * 40},-50 ${-sd * 90},-40 ${-sd * 80},0 C${-sd * 90},40 ${-sd * 40},50 0,0Z" fill="#d83a3a" stroke="${TK}" stroke-width="8"/><circle r="18" fill="#c02a2a" stroke="${TK}" stroke-width="6"/></g>`).join('')}`
  }, o)) + `</g>`;
}

// 4. ABUELO TOMÁS: calvo con cerquillo blanco, cejas blancas pobladas, gafas, bigote blanco fino, cárdigan marrón, bastón
function tomas2d(o = {}) {
  return pjT(Object.assign({
    id: 'to', bodyPath: BODY.anciano, bodyEdge: 'M860,1420 C866,1620 840,1840 600,1872',
    top: ['#9a6a44', '#7e5434', '#5e3e24', '#3a2414', '#c49a74', '#e8d0b8'], hatC: ['#000', '#000', '#000', '#000'],
    brow: '#e8e4dc', legs: legsAt(520, 670, 1860),
    armL: 'M352,1280 C300,1420 280,1560 275,1700', handL: [275, 1710], armR: 'M838,1280 C900,1400 930,1500 935,1560', handR: [935, 1570],
    bodyIn: id => `<path d="M520,1100 L560,1870 M670,1100 L630,1870" stroke="#3a2414" stroke-width="10" opacity=".7"/><path d="M560,1100 L630,1100 L640,1870 L550,1870Z" fill="#e8e0cc" opacity=".9"/>
      ${[1300, 1420, 1540, 1660].map(y => `<circle cx="545" cy="${y}" r="15" fill="#4a2e18" stroke="${TK}" stroke-width="5"/>`).join('')}
      ${[...Array(18)].map((_, i) => `<path d="M${380 + (i % 6) * 30},${1300 + Math.floor(i / 6) * 160} l12,24 l12,-24" stroke="#5e3e24" stroke-width="5" fill="none" opacity=".5"/>`).join('')}
      <rect x="690" y="1560" width="110" height="100" rx="12" fill="#7e5434" stroke="${TK}" stroke-width="6"/>`,
    front: id => `<path d="M560,1170 L630,1170 L595,1240Z" fill="url(#${id}Tri)" stroke="${TK}" stroke-width="6"/><path d="M575,1190 L615,1190 L605,1300 L595,1320 L585,1300Z" fill="#3a5a8a" stroke="${TK}" stroke-width="6"/>
      <path d="M935,1570 L935,2100" stroke="#5a3418" stroke-width="22" stroke-linecap="round"/><path d="M935,1570 C935,1520 900,1500 870,1520" stroke="#5a3418" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M928,1600 L928,2090" stroke="#8a5a34" stroke-width="6" opacity=".7"/>
      <circle cx="935" cy="1570" r="44" fill="#261717"/>`,
    faceTop: (id, f) => mustache(id, MUST.fino, '#ece8e0', '#ffffff') + glasses('#3a2a20', 72),
    headIn: id => `<path d="M220,760 C230,690 260,640 300,620 C330,700 330,780 300,860 C260,850 230,820 220,760Z M960,760 C950,690 920,640 880,620 C850,700 850,780 880,860 C920,850 950,820 960,760Z" fill="#f0ece4"/>
      <ellipse cx="520" cy="470" rx="140" ry="60" fill="#fff" opacity=".35" filter="url(#${id}S2)"/>`,
    hat: id => `<path d="M220,760 C230,690 260,640 300,620 C330,700 330,780 300,860 C260,850 230,820 220,760Z M960,760 C950,690 920,640 880,620 C850,700 850,780 880,860 C920,850 950,820 960,760Z" fill="none" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M300,650 C320,690 330,720 320,760 M880,650 C860,690 850,720 860,760" stroke="#c8c4bc" stroke-width="6" fill="none"/>`
  }, o));
}

// 5. CARMEN, la periodista: media melena negra con flequillo, boina roja, gabardina beige con cinturón, libreta y lápiz
function carmen2d(o = {}) {
  return pjT(Object.assign({
    id: 'ca', bodyPath: BODY.gabardina, bodyEdge: 'M822,1300 C840,1500 870,1750 896,1958',
    top: ['#d8c094', '#c4aa7a', '#a68c5c', '#6e5a36', '#ecdcbc', '#fff4e0'], hatC: ['#d8404a', '#c02a36', '#901c26', '#5a0e16'],
    lashes: 1, lips: '#b8283a', cheeks: 1, brow: '#1a1212', legs: legsAt(520, 670, 1970),
    armL: 'M378,1260 C330,1400 330,1520 380,1560 C420,1590 480,1560 520,1520', handL: [528, 1515], armR: 'M812,1260 C860,1420 880,1560 885,1700', handR: [885, 1712],
    back: id => `<path d="M215,700 C200,880 220,1040 300,1110 C380,1130 380,1060 360,980 C340,880 340,780 360,700Z M965,700 C980,880 960,1040 880,1110 C800,1130 800,1060 820,980 C840,880 840,780 820,700Z" fill="#1e1616" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>`,
    bodyIn: id => `<path d="M595,1100 L520,1500 L595,1960 M595,1100 L670,1500" stroke="#6e5a36" stroke-width="10" fill="none" opacity=".8"/>
      <path d="M330,1480 L860,1480 L866,1540 L324,1540Z" fill="#a68c5c" stroke="${TK}" stroke-width="8"/><rect x="560" y="1474" width="70" height="72" rx="8" fill="none" stroke="#c49e36" stroke-width="10"/>
      ${[1300, 1400, 1620, 1720].map(y => `<circle cx="660" cy="${y}" r="13" fill="#6e5a36" stroke="${TK}" stroke-width="4"/>`).join('')}
      <path d="M420,1640 L520,1640 M700,1640 L800,1640" stroke="#6e5a36" stroke-width="10" stroke-linecap="round"/>`,
    front: id => `<path d="M500,1140 C540,1200 560,1260 520,1330 L470,1200Z M690,1140 C650,1200 630,1260 670,1330 L720,1200Z" fill="#c4aa7a" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M540,1160 L650,1160 L595,1260Z" fill="#f6f0e4" stroke="${TK}" stroke-width="6"/>
      <g transform="rotate(-14,560,1480)"><rect x="470" y="1420" width="130" height="160" rx="8" fill="#f6f0e4" stroke="${TK}" stroke-width="8"/>${[1460, 1490, 1520, 1550].map(y => `<path d="M490,${y} L580,${y}" stroke="#8aa0c0" stroke-width="5"/>`).join('')}<path d="M470,1420 L600,1420" stroke="#c02a36" stroke-width="12"/></g>
      <path d="M540,1520 L470,1600" stroke="#e8b840" stroke-width="14" stroke-linecap="round"/><circle cx="528" cy="1515" r="44" fill="#261717"/>`,
    hat: id => `<path d="M230,720 C220,520 380,430 590,430 C800,430 960,520 950,720 C930,690 905,668 880,656 C840,676 800,676 770,656 C740,676 700,676 670,656 C640,676 600,676 570,656 C540,676 500,676 470,656 C440,676 400,676 370,656 C330,668 260,690 230,720Z" fill="#1e1616" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M300,600 C380,520 480,490 580,488" stroke="#5a4a4a" stroke-width="12" fill="none" opacity=".8" stroke-linecap="round"/>
      <g transform="rotate(-12,590,440)"><path d="M300,500 C280,380 420,300 600,300 C800,300 930,380 900,480 C860,530 720,540 600,540 C460,540 330,540 300,500Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M360,430 C400,360 500,330 600,328" stroke="#f08080" stroke-width="12" fill="none" opacity=".7" stroke-linecap="round" filter="url(#${id}S1)"/>
      <path d="M600,300 L606,260" stroke="${TK}" stroke-width="12" stroke-linecap="round"/></g>`
  }, o));
}

// 6. SARGENTO RUIZ: alto y recto, gorra de plato con placa, uniforme azul oscuro de botones dorados, correaje, bigote fino negro
function ruiz2d(o = {}) {
  return pjT(Object.assign({
    id: 'ru', bodyPath: PACO_BODY, bodyEdge: 'M792,1420 C800,1650 790,1820 600,1860',
    top: ['#34456a', '#26365a', '#1a2644', '#0e162a', '#5a70a0', '#a0b4dc'], hatC: ['#34456a', '#26365a', '#1a2644', '#0e162a'],
    brow: '#1a1212', legs: legsAt(530, 662, 1840),
    armL: 'M412,1260 C370,1420 345,1600 335,1760', handL: [335, 1770], armR: 'M778,1260 C820,1420 845,1600 855,1745', handR: [855, 1755],
    bodyIn: id => `<path d="M400,1600 L800,1600 L800,1650 L400,1650Z" fill="#3a2a1a" stroke="${TK}" stroke-width="7"/><rect x="565" y="1594" width="60" height="62" rx="6" fill="#c49e36" stroke="${TK}" stroke-width="6"/>
      <path d="M760,1100 L470,1600" stroke="#3a2a1a" stroke-width="34"/><path d="M760,1100 L470,1600" stroke="#6a4a2a" stroke-width="8" opacity=".7"/>
      ${[1260, 1340, 1420, 1500, 1720].map(y => `<circle cx="595" cy="${y}" r="14" fill="url(#${id}Btn)" stroke="#3a1a10" stroke-width="4"/>`).join('')}
      <path d="M430,1300 L520,1300 L520,1380 L430,1380Z" fill="#26365a" stroke="${TK}" stroke-width="6"/><path d="M430,1300 L520,1300 L475,1340Z" fill="#1a2644" stroke="${TK}" stroke-width="5"/>`,
    front: id => `<path d="M520,1110 L670,1110 L670,1170 L520,1170Z" fill="#26365a" stroke="${TK}" stroke-width="8"/>${[540, 650].map(x => `<rect x="${x - 10}" y="1124" width="20" height="30" fill="#c49e36" stroke="${TK}" stroke-width="4"/>`).join('')}
      <path d="M420,1150 L470,1120 L480,1150Z M770,1150 L720,1120 L710,1150Z" fill="#c49e36" stroke="${TK}" stroke-width="5"/>`,
    faceTop: (id, f) => mustache(id, MUST.fino, '#241818', '#4a3838'),
    hat: id => `<path d="M236,720 C230,660 246,630 270,620 L276,760Z M944,720 C950,660 934,630 910,620 L904,760Z" fill="#1e1616" stroke="${TK}" stroke-width="9"/>
      <path d="M180,480 C260,380 920,380 1000,480 C1010,520 960,540 900,540 L280,540 C220,540 170,520 180,480Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M250,450 C380,400 600,392 760,400" stroke="#7a8ab4" stroke-width="12" fill="none" opacity=".7" stroke-linecap="round"/>
      <path d="M280,540 L900,540 L890,620 L290,620Z" fill="#141c30" stroke="${TK}" stroke-width="11" stroke-linejoin="round"/><path d="M290,580 L890,580" stroke="#c49e36" stroke-width="10"/>
      <path d="M380,610 C470,600 710,600 800,610 C820,650 790,690 740,694 C640,704 540,704 440,694 C390,690 360,650 380,610Z" fill="#0e0e12" stroke="${TK}" stroke-width="11"/><path d="M410,626 C500,618 690,618 780,626" stroke="#5a5a6a" stroke-width="7" fill="none" opacity=".8"/>
      <path d="M590,430 L626,470 L590,540 L554,470Z" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/><circle cx="590" cy="480" r="12" fill="#c02a2a" stroke="${TK}" stroke-width="4"/>`
  }, o));
}

// 7. GENERAL (militar): pecho ancho y recto, gorra de plato verde oliva con galón dorado, charreteras con flecos, medallas, banda cruzada, bigote de manillar
const BODY_MIL = 'M300,1180 C318,1092 440,1066 595,1066 C750,1066 872,1092 890,1180 C900,1360 880,1560 846,1720 C826,1810 740,1850 595,1850 C450,1850 364,1810 344,1720 C310,1560 290,1360 300,1180Z';
function general2d(o = {}) {
  return pjT(Object.assign({
    id: 'ge', bodyPath: BODY_MIL, gloves: '#f4f0e8', bodyEdge: 'M892,1300 C890,1520 860,1760 600,1852',
    top: ['#6a7a4a', '#566438', '#424e2a', '#2a321a', '#94a46a', '#c8d4a0'], hatC: ['#6a7a4a', '#566438', '#424e2a', '#2a321a'],
    brow: '#2a1c18', legs: legsAt(515, 675, 1840),
    armL: 'M305,1250 C250,1400 225,1560 220,1720', handL: [220, 1730], armR: 'M885,1250 C940,1400 965,1560 970,1720', handR: [970, 1730],
    bodyIn: id => `<path d="M420,1110 L800,1720" stroke="#a8282e" stroke-width="54"/><path d="M420,1110 L800,1720" stroke="#e85a5a" stroke-width="8" opacity=".6" transform="translate(-14,6)"/><path d="M420,1110 L800,1720" stroke="${TK}" stroke-width="5" opacity=".5" transform="translate(26,-14)"/><path d="M420,1110 L800,1720" stroke="#e8c040" stroke-width="5" opacity=".8" transform="translate(-24,14)"/><path d="M420,1110 L800,1720" stroke="#e8c040" stroke-width="5" opacity=".8" transform="translate(22,-12)"/>
      ${[1440, 1520, 1700].map(y => `<circle cx="${595}" cy="${y}" r="14" fill="url(#${id}Btn)" stroke="#3a1a10" stroke-width="4"/>`).join('')}
      <path d="M370,1250 L520,1250 L520,1340 L370,1340Z M680,1250 L830,1250 L830,1340 L680,1340Z" fill="#4e5c32" stroke="${TK}" stroke-width="6"/><path d="M370,1250 L520,1250 L445,1300Z M680,1250 L830,1250 L755,1300Z" fill="#424e2a" stroke="${TK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M330,1600 L860,1600 L856,1660 L334,1660Z" fill="#3a2a18" stroke="${TK}" stroke-width="7"/><path d="M340,1612 L850,1612" stroke="#6a5038" stroke-width="5"/><rect x="562" y="1594" width="66" height="72" rx="8" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="6"/>`,
    front: id => `<path d="M540,1110 L650,1110 L640,1170 L550,1170Z" fill="#566438" stroke="${TK}" stroke-width="8"/>${[560, 630].map(x => `<path d="M${x - 12},1122 l12,-10 l12,10 l-4,30 l-16,0Z" fill="#e8c860" stroke="${TK}" stroke-width="4"/>`).join('')}
      ${[-1, 1].map(sd => `<g transform="translate(${595 + sd * 260},1140)"><ellipse rx="80" ry="34" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="8"/>${[...Array(7)].map((_, i) => `<path d="M${-60 + i * 20},24 L${-62 + i * 20},64" stroke="#d8b040" stroke-width="9" stroke-linecap="round"/>`).join('')}<path d="M${-sd * 50},-6 L${sd * 50},-6" stroke="#f4dc8a" stroke-width="6" opacity=".7"/></g>`).join('')}
      <path d="M335,1140 C330,1260 380,1330 470,1340 C520,1345 560,1320 580,1290" stroke="#d8b040" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M335,1140 C350,1220 400,1280 470,1290 C520,1295 560,1280 580,1260" stroke="#d8b040" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M340,1150 C340,1250 390,1320 470,1330" stroke="#fff0a0" stroke-width="4" fill="none" opacity=".7"/><path d="M580,1290 L590,1330 M580,1260 L594,1296" stroke="#c49e36" stroke-width="10" stroke-linecap="round"/>
      <path d="M840,1640 L900,1800 L960,1930" stroke="#8a8a96" stroke-width="22" stroke-linecap="round"/><path d="M845,1650 L905,1810" stroke="#e8e8f0" stroke-width="6" opacity=".7"/><path d="M800,1620 C830,1600 870,1610 880,1650" stroke="url(#${id}Btn)" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M805,1660 L880,1630" stroke="${TK}" stroke-width="18" stroke-linecap="round"/><path d="M805,1660 L880,1630" stroke="url(#${id}Btn)" stroke-width="10" stroke-linecap="round"/>
      ${[[640, 1300, '#c02a2a'], [685, 1300, '#2a5aa8'], [730, 1300, '#e8c040'], [660, 1370, '#2a8a4a'], [705, 1370, '#c02a2a']].map(([x, y, c]) => `<rect x="${x - 18}" y="${y - 30}" width="36" height="26" fill="${c}" stroke="${TK}" stroke-width="5"/><path d="M${x},${y - 4} L${x},${y + 12}" stroke="${TK}" stroke-width="4"/><circle cx="${x}" cy="${y + 26}" r="17" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="5"/>`).join('')}`,
    faceTop: (id, f) => `<path d="M700,700 L740,760 M712,720 L690,740" stroke="#c48a7a" stroke-width="6" stroke-linecap="round" opacity=".8"/><path d="M580,1110 Q590,1120 600,1110" stroke="#b89a84" stroke-width="6" fill="none"/>` + mustache(id, 'M600,912 C560,888 500,890 470,912 C440,934 410,930 380,900 C376,950 420,982 470,966 C520,950 570,938 600,944 C630,938 680,950 730,966 C780,982 824,950 820,900 C790,930 760,934 730,912 C700,890 640,888 600,912Z', '#2a1c18', '#5a4a44'),
    hat: id => `<path d="M236,720 C230,660 246,630 270,620 L276,760Z M944,720 C950,660 934,630 910,620 L904,760Z" fill="#2a1c18" stroke="${TK}" stroke-width="9"/><path d="M242,700 L262,700 M938,700 L918,700" stroke="#a8a4a0" stroke-width="10"/>
      <path d="M170,470 C250,350 930,350 1010,470 C1020,520 970,540 910,540 L270,540 C210,540 160,520 170,470Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M240,440 C380,385 600,378 760,386" stroke="#a8b880" stroke-width="12" fill="none" opacity=".7" stroke-linecap="round" filter="url(#${id}S1)"/>
      <path d="M270,540 L910,540 L900,620 L280,620Z" fill="#2a321a" stroke="${TK}" stroke-width="11" stroke-linejoin="round"/><path d="M280,560 L900,560 M282,600 L898,600" stroke="#d8b040" stroke-width="10"/>
      <path d="M380,610 C470,600 710,600 800,610 C820,650 790,690 740,694 C640,704 540,704 440,694 C390,690 360,650 380,610Z" fill="#0e0e12" stroke="${TK}" stroke-width="11"/><path d="M420,640 C520,628 680,628 760,640" stroke="#d8b040" stroke-width="9" fill="none"/><path d="M410,626 C500,618 690,618 780,626" stroke="#5a5a6a" stroke-width="6" fill="none" opacity=".8"/>
      <g transform="translate(590,470)"><path d="M-70,10 C-60,-40 -20,-60 0,-70 C20,-60 60,-40 70,10 C40,0 20,-10 0,20 C-20,-10 -40,0 -70,10Z" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="7"/><circle cy="-20" r="14" fill="#c02a2a" stroke="${TK}" stroke-width="4"/></g>`
  }, o));
}

// 8. REY: gordo con capa de terciopelo rojo y armiño, corona de oro con joyas, barba y bigote blancos, cetro
const BODY_REY = 'M200,1210 C240,1090 420,1050 595,1050 C770,1050 950,1090 990,1210 C1040,1450 1050,1750 1060,2085 L130,2085 C140,1750 150,1450 200,1210Z';
function rey2d(o = {}) {
  return pjT(Object.assign({
    id: 'ry', bodyPath: BODY_REY, gloves: null, bodyEdge: 'M1000,1300 C1030,1550 1050,1800 1058,2080', legs: null,
    top: ['#c0283a', '#a01c2c', '#7a1220', '#4a0a12', '#e85a6a', '#ff9aa8'], hatC: ['#000', '#000', '#000', '#000'],
    brow: '#f0ece4', cheeks: 1,
    armL: 'M310,1300 C250,1420 240,1500 270,1560', handL: [275, 1570], armR: 'M880,1300 C940,1420 945,1520 915,1590', handR: [912, 1600],
    bodyIn: id => `<path d="M420,1120 C450,1400 470,1700 470,2085 L720,2085 C720,1700 740,1400 770,1120Z" fill="#e8c860"/><path d="M470,1200 C490,1500 500,1800 500,2085" stroke="#fff0b0" stroke-width="14" opacity=".6" fill="none"/>
      <path d="M440,1500 L750,1500 L752,1560 L438,1560Z" fill="#7a5a1a" stroke="${TK}" stroke-width="7"/><circle cx="595" cy="1530" r="30" fill="#c02a2a" stroke="${TK}" stroke-width="6"/>
      ${[1650, 1760, 1870].map(y => `<path d="M560,${y} L630,${y}" stroke="#a8882a" stroke-width="8" stroke-linecap="round"/>`).join('')}
      ${[[400, 1150], [790, 1150]].map(([x]) => `<path d="M${x + (x < 595 ? -48 : 48)},1100 C${x + (x < 595 ? -28 : 28)},1500 ${x + (x < 595 ? -18 : 18)},1800 ${x + (x < 595 ? -8 : 8)},2085" stroke="#e8c040" stroke-width="14" fill="none"/><path d="M${x},1100 C${x + (x < 595 ? 20 : -20)},1500 ${x + (x < 595 ? 30 : -30)},1800 ${x + (x < 595 ? 40 : -40)},2085" stroke="#f6f2ea" stroke-width="80" fill="none"/>`).join('')}
      ${[...Array(16)].map((_, i) => `<path d="M${(i % 2 ? 400 : 790) + (i % 2 ? 1 : -1) * Math.floor(i / 2) * 3},${1180 + Math.floor(i / 2) * 110} l0,26 m-8,-10 l8,-14 l8,14" stroke="${TK}" stroke-width="6" fill="none"/>`).join('')}`,
    front: id => `<path d="M260,1150 C360,1250 480,1290 595,1290 C710,1290 830,1250 930,1150 C960,1200 960,1250 930,1290 C820,1370 710,1390 595,1390 C480,1390 370,1370 260,1290 C230,1250 230,1200 260,1150Z" fill="#f6f2ea" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      ${[...Array(11)].map((_, i) => { const x = 290 + i * 61, y = 1290 + Math.sin(i / 10 * Math.PI) * 70; return `<path d="M${x},${y - 18} l0,24 m-9,-11 l9,-15 l9,15" stroke="${TK}" stroke-width="6" fill="none"/>`; }).join('')}
      <circle cx="595" cy="1300" r="34" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="7"/><circle cx="595" cy="1300" r="15" fill="#2a5aa8" stroke="${TK}" stroke-width="4"/>
      <g transform="translate(250,1490)"><circle r="62" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="9"/><path d="M-62,0 L62,0 M0,-62 L0,62" stroke="#a8822a" stroke-width="10"/><path d="M0,-62 L0,-110 M-22,-88 L22,-88" stroke="${TK}" stroke-width="20" stroke-linecap="round"/><path d="M0,-62 L0,-110 M-22,-88 L22,-88" stroke="#e8c860" stroke-width="9" stroke-linecap="round"/><circle cx="-22" cy="-22" r="14" fill="#fff" opacity=".6"/><circle r="12" fill="#2a5aa8" stroke="${TK}" stroke-width="4" transform="translate(30,30)"/></g><circle cx="275" cy="1570" r="44" fill="#261717"/>
      <path d="M912,1700 L1012,1080" stroke="#c49e36" stroke-width="22" stroke-linecap="round"/><path d="M920,1670 L1014,1100" stroke="#f4dc8a" stroke-width="6" opacity=".7"/>
      <g transform="translate(1018,1040)"><circle r="44" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="8"/><path d="M0,-44 L0,-90 M-20,-70 L20,-70" stroke="${TK}" stroke-width="18" stroke-linecap="round"/><path d="M0,-44 L0,-90 M-20,-70 L20,-70" stroke="#e8c860" stroke-width="8" stroke-linecap="round"/><circle r="16" fill="#c02a2a" stroke="${TK}" stroke-width="5"/></g>
      <circle cx="912" cy="1600" r="44" fill="#261717"/>`,
    headIn: id => `<path d="M220,760 C230,690 260,640 300,620 C330,700 330,780 300,860 C260,850 230,820 220,760Z M960,760 C950,690 920,640 880,620 C850,700 850,780 880,860 C920,850 950,820 960,760Z" fill="#f0ece4"/><path d="M230,820 C240,1080 400,1220 590,1220 C780,1220 940,1080 950,820 C900,900 820,940 740,930 C700,990 480,990 440,930 C360,940 280,900 230,820Z" fill="#ece8e0"/>
      <path d="M300,960 C360,1060 460,1110 590,1120" stroke="#ffffff" stroke-width="14" fill="none" opacity=".8" stroke-linecap="round"/>${[[380, 1040], [460, 1100], [700, 1100], [780, 1040], [590, 1150]].map(([x, y]) => `<path d="M${x},${y} q12,30 0,50" stroke="#c8c2b8" stroke-width="7" fill="none"/>`).join('')}`,
    faceTop: (id, f) => `<path d="M300,1080 C330,1200 380,1320 440,1380 C470,1350 490,1400 530,1420 C550,1390 580,1440 600,1450 C620,1440 650,1390 670,1420 C710,1400 730,1350 760,1380 C820,1320 860,1200 890,1080 C800,1180 700,1210 595,1210 C490,1210 390,1180 300,1080Z" fill="#ece8e0" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>${[[420, 1260], [500, 1330], [600, 1380], [700, 1330], [780, 1260], [540, 1250], [660, 1250]].map(([x, y]) => `<path d="M${x},${y} q14,26 0,46" stroke="#c8c2b8" stroke-width="7" fill="none"/>`).join('')}<path d="M230,820 C240,1080 400,1220 590,1220 C780,1220 940,1080 950,820 C900,900 820,940 740,930 C700,990 480,990 440,930 C360,940 280,900 230,820Z" fill="none" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>` + mustache(id, MUST.morsa, '#f0ece4', '#ffffff'),
    hat: id => `<path d="M220,760 C230,680 262,630 304,612 C330,700 330,790 300,880 C258,866 228,830 220,760Z M960,760 C950,680 918,630 876,612 C850,700 850,790 880,880 C922,866 952,830 960,760Z" fill="#dedad2" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/><path d="M250,700 C262,760 272,800 280,840 M930,700 C918,760 908,800 900,840" stroke="#ffffff" stroke-width="8" fill="none" opacity=".8"/>
      <g transform="rotate(-4,590,500)"><path d="M330,540 C320,360 420,300 590,300 C760,300 860,360 850,540Z" fill="#a01c2c" stroke="${TK}" stroke-width="10"/><path d="M380,480 C380,400 440,350 520,340" stroke="#e85a6a" stroke-width="12" fill="none" opacity=".7" stroke-linecap="round"/><path d="M300,560 L280,330 L390,430 L450,250 L520,410 L590,210 L660,410 L730,250 L790,430 L900,330 L880,560Z" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M300,500 C450,470 730,470 880,500 L880,580 C730,550 450,550 300,580Z" fill="#c49e36" stroke="${TK}" stroke-width="11" stroke-linejoin="round"/>
      ${[[280, 330], [450, 250], [590, 210], [730, 250], [900, 330]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="#f6f2ea" stroke="${TK}" stroke-width="6"/>`).join('')}
      ${[[400, 530, '#2a8a4a'], [500, 520, '#c02a2a'], [590, 516, '#2a5aa8'], [680, 520, '#c02a2a'], [780, 530, '#2a8a4a']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="${c === '#2a5aa8' ? 28 : 18}" ry="${c === '#2a5aa8' ? 24 : 16}" fill="${c}" stroke="${TK}" stroke-width="5"/><circle cx="${x - 6}" cy="${y - 6}" r="5" fill="#fff" opacity=".7"/>`).join('')}
      <path d="M330,460 L320,360" stroke="#fff4c0" stroke-width="10" opacity=".7" stroke-linecap="round"/><path d="M800,480 L870,380 L880,560Z" fill="#6a4a10" opacity=".35"/></g>`
  }, o));
}

// 9. CHEF: barrigón en forma de pera, gorro alto plisado, chaquetilla blanca cruzada, pañuelo rojo, delantal, cuchara de palo, bigote rizado
const BODY_CHEF = 'M400,1180 C410,1100 500,1070 595,1070 C690,1070 780,1100 790,1180 C830,1300 900,1480 900,1640 C900,1790 780,1860 595,1860 C410,1860 290,1790 290,1640 C290,1480 360,1300 400,1180Z';
function chef2d(o = {}) {
  return pjT(Object.assign({
    id: 'ch', bodyPath: BODY_CHEF, gloves: null, bodyEdge: 'M840,1350 C900,1500 910,1720 600,1862',
    top: ['#ffffff', '#f2eee6', '#d8d2c6', '#a8a094', '#ffffff', '#ffffff'], hatC: ['#ffffff', '#f6f4ee', '#dcd8ce', '#b8b2a6'],
    brow: '#3a2418', cheeks: 1, legs: legsAt(520, 670, 1850),
    armL: 'M402,1250 C330,1400 300,1540 290,1660', handL: [290, 1670], armR: 'M788,1250 C860,1380 880,1460 880,1500', handR: [880, 1510],
    bodyIn: id => `<path d="M595,1120 C640,1300 700,1500 720,1860" stroke="#b8b0a4" stroke-width="10" fill="none"/>
      ${[1290, 1400, 1510].map(y => [500, 760].map((x, k) => `<circle cx="${x + (y - 1290) * (k ? .12 : -.05)}" cy="${y}" r="16" fill="#e8e2d6" stroke="${TK}" stroke-width="5"/>`).join('')).join('')}
      <path d="M380,1560 C460,1580 730,1580 810,1560 L860,1860 L330,1860Z" fill="#e8e4dc" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M380,1560 L810,1560" stroke="#3a5a8a" stroke-width="12"/><rect x="520" y="1640" width="150" height="110" rx="10" fill="#dcd6cc" stroke="${TK}" stroke-width="6"/>
      ${[[440, 1700], [760, 1720], [600, 1800]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="10" fill="#c87a3a" opacity=".5"/>`).join('')}`,
    front: id => `<path d="M450,1150 C520,1200 670,1200 740,1150 L760,1200 C680,1250 510,1250 430,1200Z" fill="#c8302e" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M610,1210 L560,1330 L620,1300 L650,1345 L660,1220Z" fill="#b02624" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M760,1120 C800,1180 820,1280 800,1400 L860,1410 C880,1290 860,1170 800,1100Z" fill="#e8dcc0" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>${[1180, 1240, 1300, 1360].map(y => `<path d="M${800 + (y - 1180) * .05},${y} L${850 + (y - 1180) * .05},${y + 4}" stroke="#c0392b" stroke-width="7"/>`).join('')}
      <path d="M560,1650 L560,1600 M600,1650 L600,1590" stroke="#4a4a52" stroke-width="10" stroke-linecap="round"/><circle cx="560" cy="1596" r="9" fill="#c02a2a"/><path d="M600,1590 L612,1570" stroke="#e8c040" stroke-width="8"/>
      
      <path d="M880,1510 L960,1150" stroke="#b07a40" stroke-width="20" stroke-linecap="round"/><path d="M886,1490 L962,1160" stroke="#d8a868" stroke-width="5" opacity=".7"/>
      <ellipse cx="968" cy="1110" rx="42" ry="60" fill="#b07a40" stroke="${TK}" stroke-width="9" transform="rotate(13,968,1110)"/><ellipse cx="960" cy="1100" rx="22" ry="34" fill="#8a5a2a" transform="rotate(13,960,1100)"/>
      <circle cx="880" cy="1510" r="44" fill="#261717"/>`,
    faceTop: (id, f) => `<ellipse cx="790" cy="990" rx="38" ry="20" fill="#ffffff" opacity=".75" filter="url(#${id}S1)"/><circle cx="770" cy="985" r="6" fill="#fff"/><circle cx="805" cy="998" r="5" fill="#fff"/>` + mustache(id, 'M600,905 C560,880 500,884 470,905 C440,926 420,920 410,890 C380,900 380,950 420,960 C470,972 540,950 600,948 C660,950 730,972 780,960 C820,950 820,900 790,890 C780,920 760,926 730,905 C700,884 640,880 600,905Z', '#3a2418', '#6a4a34'),
    hat: id => `<path d="M286,580 C220,540 200,400 290,350 C290,210 430,150 510,210 C550,120 720,120 760,220 C860,170 1000,260 940,370 C1010,430 970,560 900,580Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="14" stroke-linejoin="round"/>
      <path d="M420,260 C430,390 420,480 430,580 M590,200 C600,340 590,470 600,580 M770,250 C760,390 770,480 760,580" stroke="#cfc8bc" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M330,340 C360,290 420,268 460,270" stroke="#ffffff" stroke-width="16" fill="none" opacity=".9" stroke-linecap="round"/><path d="M520,215 C560,170 640,160 700,190 M790,240 C850,220 920,260 930,320" stroke="#e8e4dc" stroke-width="10" fill="none" stroke-linecap="round"/><ellipse cx="520" cy="420" rx="120" ry="60" fill="#c8c0b4" opacity=".35" filter="url(#${id}S2)"/><ellipse cx="760" cy="440" rx="90" ry="50" fill="#c8c0b4" opacity=".35" filter="url(#${id}S2)"/>
      <path d="M900,400 C930,470 920,540 880,580" stroke="#a8a094" stroke-width="40" fill="none" opacity=".4" filter="url(#${id}S2)"/>
      <path d="M260,570 C450,530 760,530 930,570 L922,660 C760,620 450,620 268,660Z" fill="#f0ede6" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M290,640 C450,608 760,608 905,640" stroke="#b8b0a4" stroke-width="10" fill="none" opacity=".7"/>`
  }, o));
}

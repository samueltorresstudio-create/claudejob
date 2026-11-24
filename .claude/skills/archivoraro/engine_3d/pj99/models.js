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

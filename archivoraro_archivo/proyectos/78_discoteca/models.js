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
    brow: '#a8a49c', legs: legsAt(500, 690, 1790),
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
    hatC: ['#000', '#000', '#000', '#000'], lashes: 1, brow: '#4a2a14', legs: legsAt(530, 660, 1740),
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
    lashes: 1, lips: '#b8283a', brow: '#1a1212', legs: legsAt(520, 670, 1970),
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
    brow: '#f0ece4',
    armL: 'M310,1300 C250,1420 240,1500 270,1560', handL: [275, 1570], armR: 'M880,1300 C940,1420 945,1520 915,1590', handR: [912, 1600],
    bodyIn: id => `
      <defs><pattern id="${id}Brc" width="70" height="70" patternUnits="userSpaceOnUse"><rect width="70" height="70" fill="#e2b84a"/><path d="M35,4 L66,35 L35,66 L4,35Z" fill="none" stroke="#b88a2a" stroke-width="5"/><circle cx="35" cy="35" r="7" fill="#c02a2a" stroke="#7a5a10" stroke-width="3"/><circle cx="0" cy="0" r="5" fill="#f4dc8a"/><circle cx="70" cy="70" r="5" fill="#f4dc8a"/><circle cx="70" cy="0" r="5" fill="#f4dc8a"/><circle cx="0" cy="70" r="5" fill="#f4dc8a"/></pattern>
      <pattern id="${id}Vel" width="140" height="160" patternUnits="userSpaceOnUse"><path d="M70,40 C60,60 50,70 40,72 C52,78 62,80 70,100 C78,80 88,78 100,72 C90,70 80,60 70,40Z" fill="#c4983a" opacity=".55"/><path d="M60,104 L80,104" stroke="#c4983a" stroke-width="6" opacity=".55"/></pattern></defs>
      <path d="${BODY_REY}" fill="url(#${id}Vel)"/>
      ${[[300, 1300, 250, 2085], [370, 1250, 340, 2085], [820, 1250, 850, 2085], [900, 1300, 950, 2085]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} C${x1 - 10},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2 + 100} ${x2},${y2}" stroke="#4a0a12" stroke-width="26" fill="none" opacity=".55" filter="url(#${id}S2)"/><path d="M${x1 + 22},${y1 + 20} C${x1 + 12},${(y1 + y2) / 2} ${x2 + 22},${(y1 + y2) / 2 + 100} ${x2 + 22},${y2}" stroke="#ff8a9a" stroke-width="10" fill="none" opacity=".35" filter="url(#${id}S1)"/>`).join('')}
      <path d="M430,1120 C455,1400 470,1700 470,2085 L720,2085 C720,1700 735,1400 760,1120Z" fill="url(#${id}Brc)" stroke="${TK}" stroke-width="8"/>
      <path d="M430,1120 C455,1400 470,1700 470,2085 L720,2085 C720,1700 735,1400 760,1120Z" fill="#7a4a10" opacity=".25"/>
      <path d="M455,1180 C475,1450 488,1750 490,2085" stroke="#fff6c8" stroke-width="12" opacity=".5" fill="none"/>
      <path d="M440,1520 C520,1545 670,1545 750,1520 L752,1590 C670,1615 520,1615 438,1590Z" fill="#5a1a10" stroke="${TK}" stroke-width="8"/>
      ${[470, 530, 660, 720].map(x => `<circle cx="${x}" cy="1557" r="11" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="4"/>`).join('')}
      <ellipse cx="595" cy="1558" rx="40" ry="34" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="7"/><ellipse cx="595" cy="1558" rx="20" ry="17" fill="#c02a2a" stroke="${TK}" stroke-width="4"/><circle cx="588" cy="1550" r="5" fill="#fff" opacity=".8"/>
      ${[[388, 1120, 348, 2085], [802, 1120, 842, 2085]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} C${x1 + (x2 - x1) * .3},${y1 + 400} ${x2},${y2 - 500} ${x2},${y2}" stroke="#f6f2ea" stroke-width="96" fill="none"/><path d="M${x1 - 48 * Math.sign(x2 - x1 + .1) * -1},${y1} C${x1 + (x2 - x1) * .3 - 48},${y1 + 400} ${x2 - 48},${y2 - 500} ${x2 - 48},${y2}" stroke="none" fill="none"/>`).join('')}
      ${[...Array(22)].map((_, i) => { const L = i % 2, k = Math.floor(i / 2), y = 1180 + k * 86, x = (L ? 360 : 812) + (L ? -1 : 1) * k * 3 + ((k % 2) ? 18 : -18); return `<path d="M${x},${y - 14} C${x + 9},${y - 4} ${x + 7},${y + 14} ${x},${y + 22} C${x - 7},${y + 14} ${x - 9},${y - 4} ${x},${y - 14}Z" fill="#1a1414"/><circle cx="${x}" cy="${y - 19}" r="4" fill="#1a1414"/>`; }).join('')}
      ${[[388, 1120, 348, 2085, -1], [802, 1120, 842, 2085, 1]].map(([x1, y1, x2, y2, sd]) => `<path d="M${x1 - sd * 50},${y1} C${x1 - sd * 50 + (x2 - x1) * .3},${y1 + 400} ${x2 - sd * 50},${y2 - 500} ${x2 - sd * 50},${y2}" stroke="#e8c040" stroke-width="12" fill="none"/><path d="M${x1 + sd * 50},${y1} C${x1 + sd * 50 + (x2 - x1) * .3},${y1 + 400} ${x2 + sd * 50},${y2 - 500} ${x2 + sd * 50},${y2}" stroke="#e8c040" stroke-width="12" fill="none"/>`).join('')}`,
    front: id => `<path d="M230,1170 C330,1300 460,1340 595,1340 C730,1340 860,1300 960,1170 C1000,1230 1000,1300 950,1350 C840,1430 720,1450 595,1450 C470,1450 350,1430 240,1350 C190,1300 190,1230 230,1170Z" fill="#f6f2ea" stroke="${TK}" stroke-width="11" stroke-linejoin="round"/>
      <path d="M250,1340 C360,1420 470,1440 595,1440 C720,1440 830,1420 940,1340" stroke="#c8c2b6" stroke-width="18" fill="none" opacity=".7"/>
      <path d="M260,1220 C360,1310 470,1335 595,1335" stroke="#ffffff" stroke-width="14" fill="none" opacity=".8" stroke-linecap="round"/>
      ${[...Array(13)].map((_, i) => { const t = i / 12, x = 250 + t * 690, y = 1250 + Math.sin(t * Math.PI) * 150 + (i % 2 ? 40 : 0); return `<path d="M${x},${y - 14} C${x + 9},${y - 4} ${x + 7},${y + 14} ${x},${y + 22} C${x - 7},${y + 14} ${x - 9},${y - 4} ${x},${y - 14}Z" fill="#1a1414"/><circle cx="${x}" cy="${y - 19}" r="4" fill="#1a1414"/>`; }).join('')}
      <path d="M470,1420 C520,1470 670,1470 720,1420 L700,1500 L595,1530 L490,1500Z" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      ${[[520, 1470], [595, 1495], [670, 1470]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="#c4983a" stroke="${TK}" stroke-width="5"/>`).join('')}
      <g transform="translate(595,1530)"><path d="M0,-6 L26,20 L0,60 L-26,20Z" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/><circle cy="22" r="12" fill="#2a5aa8" stroke="${TK}" stroke-width="4"/></g>
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
    brow: '#3a2418', legs: legsAt(520, 670, 1850),
    armL: 'M402,1250 C330,1400 300,1540 290,1660', handL: [290, 1670], armR: 'M788,1250 C860,1380 880,1460 880,1500', handR: [880, 1510],
    bodyIn: id => `
      <path d="M520,1130 C560,1180 640,1180 680,1130" stroke="#d8d2c6" stroke-width="10" fill="none"/>
      <path d="M560,1120 C640,1260 740,1330 830,1360 L880,1560 C760,1500 650,1400 560,1250Z" fill="#f6f3ec" stroke="#a8a094" stroke-width="7" stroke-linejoin="round"/>
      <path d="M570,1150 C650,1280 740,1345 826,1372" stroke="#ffffff" stroke-width="8" fill="none" opacity=".9"/>
      <path d="M560,1250 C650,1400 760,1500 880,1560" stroke="#8a8276" stroke-width="16" fill="none" opacity=".35" filter="url(#${id}S1)"/>
      ${[[480, 1300], [500, 1420], [520, 1530], [680, 1330], [730, 1430], [770, 1520]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#f0ece4" stroke="${TK}" stroke-width="5"/><path d="M${x - 8},${y} L${x + 8},${y} M${x},${y - 8} L${x},${y + 8}" stroke="#a8a094" stroke-width="4"/>`).join('')}
      <path d="M300,1500 C300,1440 330,1400 380,1380" stroke="#d8d2c6" stroke-width="30" fill="none" opacity=".6" filter="url(#${id}S2)"/>`,
    front: id => `
      <path d="M470,1100 L720,1100 L726,1160 C640,1185 550,1185 464,1160Z" fill="#f6f3ec" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/><path d="M478,1120 L712,1120" stroke="#c8c0b4" stroke-width="5"/>
      <path d="M470,1150 C540,1205 650,1205 720,1150 L735,1200 C650,1255 540,1255 455,1200Z" fill="#d23a34" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M480,1172 C545,1215 645,1215 710,1172" stroke="#f08070" stroke-width="6" fill="none" opacity=".7"/>
      <circle cx="600" cy="1235" r="26" fill="#b82a26" stroke="${TK}" stroke-width="7"/>
      <path d="M590,1250 L548,1350 L604,1322 L622,1352 L620,1256Z" fill="#c4302c" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M612,1250 L660,1336 L616,1320Z" fill="#a82420" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M350,1590 C460,1610 730,1610 840,1590 C870,1680 880,1800 870,1990 L330,1990 C315,1800 325,1680 350,1590Z" fill="#fbfaf6" stroke="${TK}" stroke-width="11" stroke-linejoin="round"/>
      <path d="M350,1590 C460,1610 730,1610 840,1590 L842,1620 C730,1640 460,1640 348,1620Z" fill="#2e4e86" stroke="${TK}" stroke-width="7"/>
      ${[[440, 1640, 420, 1990], [600, 1640, 600, 1990], [760, 1640, 790, 1990]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}" stroke="#d0ccc2" stroke-width="12" fill="none" opacity=".8" filter="url(#${id}S1)"/>`).join('')}
      <path d="M820,1640 C860,1760 870,1880 860,1985 L800,1985 C810,1880 810,1760 780,1640Z" fill="#000" opacity=".12" filter="url(#${id}S2)"/>
      <path d="M520,1700 L690,1700 L686,1810 C640,1822 570,1822 524,1810Z" fill="#f2efe8" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/><path d="M520,1715 L690,1715" stroke="#c8c0b4" stroke-width="5"/>
      <path d="M548,1700 L548,1650 M592,1700 L592,1640" stroke="#5a5a64" stroke-width="10" stroke-linecap="round"/><circle cx="548" cy="1645" r="10" fill="#c02a2a" stroke="${TK}" stroke-width="3"/><path d="M592,1640 L600,1622" stroke="#e8c040" stroke-width="8" stroke-linecap="round"/>
      <g transform="translate(360,1610) rotate(8)"><path d="M0,0 L90,0 L100,170 C70,180 30,180 6,170Z" fill="#f6f2ea" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>${[30, 70, 110, 150].map(y => `<path d="M${2 + y * .02},${y} L${94 + y * .04},${y}" stroke="#3a6ab8" stroke-width="9"/>`).join('')}<path d="M8,0 L82,0" stroke="${TK}" stroke-width="10"/></g>
      ${[[460, 1880], [740, 1760], [640, 1920]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="20" ry="11" fill="#c87a3a" opacity=".45"/>`).join('')}
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

// 10. JUEZ: toga negra larga hasta el suelo con pliegues, puñetas de encaje en las muñecas, cuello blanco con chorrera, medalla dorada con cadena,
// gafas de media luna, pelo gris peinado hacia atrás con entradas, mazo de madera
const BODY_JUEZ = 'M360,1190 C372,1096 476,1066 595,1066 C714,1066 818,1096 830,1190 C850,1400 900,1750 930,2085 L260,2085 C290,1750 340,1400 360,1190Z';
function juez2d(o = {}) {
  const cuff = (x, y) => `<g transform="translate(${x},${y})">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i / 8 * Math.PI * 2; return `<circle cx="${Math.cos(a) * 46}" cy="${Math.sin(a) * 22 - 40}" r="20" fill="#fbf8f2" stroke="${TK}" stroke-width="5"/>`; }).join('')}<ellipse cy="-40" rx="40" ry="16" fill="#e8e2d6"/></g>`;
  return pjT(Object.assign({
    id: 'ju', bodyPath: BODY_JUEZ, bodyEdge: 'M832,1300 C860,1550 900,1820 926,2080', legs: null,
    top: ['#3a3a44', '#26262e', '#18181e', '#0a0a0e', '#6a6a7a', '#9a9aac'], hatC: ['#000', '#000', '#000', '#000'], brow: '#8a8680',
    armL: 'M366,1250 C320,1400 300,1520 300,1640', handL: [300, 1650], armR: 'M824,1250 C880,1360 900,1420 905,1460', handR: [905, 1470],
    bodyIn: id => `${[[430, 1300, 360, 2085], [500, 1350, 470, 2085], [690, 1350, 720, 2085], [760, 1300, 830, 2085]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}" stroke="#000" stroke-width="16" fill="none" opacity=".5" filter="url(#${id}S1)"/><path d="M${x1 - 16},${y1 + 30} C${x1 - 16},${(y1 + y2) / 2} ${x2 - 18},${(y1 + y2) / 2} ${x2 - 18},${y2}" stroke="#7a7a8c" stroke-width="6" fill="none" opacity=".45" filter="url(#${id}S1)"/>`).join('')}
      <path d="M595,1300 L595,2085" stroke="#000" stroke-width="8" opacity=".6"/>
      <path d="M360,1190 C420,1280 480,1330 520,1500 L520,1700 M830,1190 C770,1280 710,1330 670,1500 L670,1700" stroke="#4a4a58" stroke-width="40" fill="none" opacity=".5"/>`,
    front: id => `<path d="M500,1110 L690,1110 L700,1170 C640,1190 550,1190 490,1170Z" fill="#fbf8f2" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M545,1170 C520,1230 530,1300 595,1330 C660,1300 670,1230 645,1170Z" fill="#fbf8f2" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      ${[1205, 1245, 1285].map(y => `<path d="M${555 - (y - 1205) * .1},${y} Q595,${y + 18} ${635 + (y - 1205) * .1},${y}" stroke="#c8c0b4" stroke-width="6" fill="none"/>`).join('')}
      <path d="M470,1160 C500,1300 560,1400 595,1420 C630,1400 690,1300 720,1160" stroke="#d8b040" stroke-width="9" fill="none"/>${[...Array(9)].map((_, i) => { const t = i / 8, x = 470 + t * 250, y = 1160 + Math.sin(t * Math.PI) * 250; return `<circle cx="${x}" cy="${y}" r="7" fill="#e8c860" stroke="#6a4a10" stroke-width="2"/>`; }).join('')}
      <circle cx="595" cy="1450" r="44" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="8"/><circle cx="595" cy="1450" r="26" fill="none" stroke="#8a6a1a" stroke-width="5"/><path d="M580,1440 L610,1440 M595,1428 L595,1468 M575,1462 L615,1462" stroke="#8a6a1a" stroke-width="5"/>
      <defs><linearGradient id="${id}Wd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c88a4a"/><stop offset=".35" stop-color="#a8682e"/><stop offset=".75" stop-color="#7a4418"/><stop offset="1" stop-color="#5a300e"/></linearGradient>
        <linearGradient id="${id}Wd2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d0945a"/><stop offset=".4" stop-color="#a8682e"/><stop offset="1" stop-color="#6a3a12"/></linearGradient></defs>
      ${cuff(300, 1690)}<circle cx="300" cy="1650" r="44" fill="#261717"/>
      <g transform="translate(905,1470) rotate(-28)">
        <path d="M-15,110 L-17,-210 C-17,-222 17,-222 17,-210 L15,110 C15,128 -15,128 -15,110Z" fill="url(#${id}Wd)" stroke="${TK}" stroke-width="8"/>
        ${[-150, -40, 60].map(y => `<path d="M-17,${y} L17,${y}" stroke="${TK}" stroke-width="5"/><path d="M-17,${y + 8} L17,${y + 8}" stroke="#e0a868" stroke-width="3" opacity=".7"/>`).join('')}
        <ellipse cx="0" cy="120" rx="22" ry="12" fill="#8a5222" stroke="${TK}" stroke-width="6"/>
        <path d="M-10,-200 L-10,100" stroke="#f0c088" stroke-width="5" opacity=".6"/>
        <g transform="translate(0,-262)">
          <path d="M-110,-48 L110,-48 L110,48 L-110,48Z" fill="url(#${id}Wd2)"/>
          <path d="M-110,-48 L110,-48 L110,48 L-110,48Z" fill="none" stroke="${TK}" stroke-width="9"/>
          ${[-1, 1].map(sd => `<ellipse cx="${sd * 110}" cy="0" rx="24" ry="48" fill="${sd < 0 ? '#c88a4a' : '#7a4418'}" stroke="${TK}" stroke-width="9"/><ellipse cx="${sd * 110}" cy="0" rx="12" ry="28" fill="none" stroke="${sd < 0 ? '#e0a868' : '#5a300e'}" stroke-width="5"/>`).join('')}
          ${[-62, 62].map(x => `<rect x="${x - 12}" y="-50" width="24" height="100" fill="#d8b040" stroke="${TK}" stroke-width="6"/><path d="M${x - 5},-44 L${x - 5},44" stroke="#fff0a0" stroke-width="5" opacity=".8"/>`).join('')}
          <path d="M-90,-34 L90,-34" stroke="#f4c890" stroke-width="7" opacity=".7" stroke-linecap="round"/>
        </g>
      </g>
      <g transform="translate(905,1490)">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => { const a = i / 10 * Math.PI * 2; return `<circle cx="${Math.cos(a) * 50}" cy="${Math.sin(a) * 18 + 34}" r="18" fill="#fbf8f2" stroke="${TK}" stroke-width="5"/>`; }).join('')}</g>
      <circle cx="905" cy="1470" r="46" fill="#261717"/><path d="M872,1452 C882,1436 900,1430 916,1434" stroke="#5a4440" stroke-width="7" fill="none" opacity=".6" stroke-linecap="round"/>
      <path d="M866,1478 C890,1492 920,1492 944,1478" stroke="#0e0808" stroke-width="6" fill="none"/>`,
    headIn: id => `<path d="M222,770 C212,640 250,560 318,516 C306,600 312,690 346,780 C300,800 248,798 222,770Z M958,770 C968,640 930,560 862,516 C874,600 868,690 834,780 C880,800 932,798 958,770Z" fill="#b8b4ae"/><path d="M250,700 C258,640 280,590 310,560 M930,700 C922,640 900,590 870,560" stroke="#e8e4de" stroke-width="9" fill="none" opacity=".85"/><ellipse cx="540" cy="470" rx="150" ry="60" fill="#fff" opacity=".3" filter="url(#${id}S2)"/>`,
    faceTop: (id, f) => `<path d="M440,872 L585,872 A72,60 0 0 1 440,872Z M625,876 L770,876 A72,60 0 0 1 625,876Z" fill="#dfeef4" fill-opacity=".2" stroke="#8a6a2a" stroke-width="11" stroke-linejoin="round"/><path d="M585,876 Q605,860 625,876" stroke="#8a6a2a" stroke-width="9" fill="none"/><path d="M440,872 L240,820 M770,876 L940,820" stroke="#8a6a2a" stroke-width="8"/>`,
    hat: id => `<path d="M222,770 C212,640 250,560 318,516 C306,600 312,690 346,780 C300,800 248,798 222,770Z M958,770 C968,640 930,560 862,516 C874,600 868,690 834,780 C880,800 932,798 958,770Z" fill="none" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>${[[330, 560, 600, 440, 860, 540], [350, 600, 600, 480, 850, 590], [380, 640, 600, 520, 820, 630]].map(([x1, y1, x2, y2, x3, y3]) => `<path d="M${x1},${y1} Q${x2},${y2 - 40} ${x3},${y3}" stroke="${TK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M${x1},${y1} Q${x2},${y2 - 40} ${x3},${y3}" stroke="#b8b4ae" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('')}`
  }, o));
}

// 11. MILLONARIO: cuerpo de tonel, batín de terciopelo morado con solapas de raso dorado, pañuelo de seda, pelo negro engominado hacia atrás,
// bigote fino, puro con humo, cadena de oro, anillos, saco de dinero con el símbolo $
const BODY_MILL = 'M320,1200 C340,1092 460,1062 595,1062 C730,1062 850,1092 870,1200 C910,1380 912,1580 880,1720 C850,1830 740,1870 595,1870 C450,1870 340,1830 310,1720 C278,1580 280,1380 320,1200Z';
function millonario2d(o = {}) {
  return pjT(Object.assign({
    id: 'mi', bodyPath: BODY_MILL, bodyEdge: 'M880,1350 C910,1560 880,1800 600,1872',
    top: ['#7a3a90', '#622a78', '#4a1c5c', '#2c0e38', '#a868c0', '#d8a8e8'], hatC: ['#000', '#000', '#000', '#000'], brow: '#1a1212',
    legs: legsAt(510, 680, 1860),
    armL: 'M322,1260 C260,1400 240,1540 240,1660', handL: [240, 1670], armR: 'M868,1260 C920,1400 935,1500 940,1610', handR: [940, 1620],
    bodyIn: id => `<path d="M500,1100 C540,1300 560,1500 560,1870 L630,1870 C630,1500 650,1300 690,1100Z" fill="#f6f2ea"/>
      <path d="M470,1090 C520,1250 540,1400 560,1560 C500,1500 430,1400 340,1260 C380,1180 420,1120 470,1090Z M720,1090 C670,1250 650,1400 630,1560 C690,1500 760,1400 850,1260 C810,1180 770,1120 720,1090Z" fill="#e2b84a" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M480,1120 C510,1250 530,1380 548,1500 M710,1120 C680,1250 660,1380 642,1500" stroke="#fff0b0" stroke-width="8" fill="none" opacity=".7"/>
      <path d="M330,1560 C450,1590 740,1590 860,1560 L858,1620 C740,1650 450,1650 332,1620Z" fill="#e2b84a" stroke="${TK}" stroke-width="7"/>
      <path d="M560,1590 C520,1650 500,1720 510,1760 M630,1590 C670,1650 690,1720 680,1760" stroke="#e2b84a" stroke-width="22" fill="none" stroke-linecap="round"/><circle cx="510" cy="1770" r="20" fill="#e2b84a" stroke="${TK}" stroke-width="6"/><circle cx="680" cy="1770" r="20" fill="#e2b84a" stroke="${TK}" stroke-width="6"/>
      ${[[400, 1700], [790, 1700], [420, 1400], [770, 1400]].map(([x, y]) => `<path d="M${x},${y} l10,-24 l10,24 l-10,24Z" fill="#a868c0" opacity=".5"/>`).join('')}`,
    front: id => `<path d="M555,1130 C520,1180 520,1240 555,1270 L595,1250 L635,1270 C670,1240 670,1180 635,1130Z" fill="#c02a3a" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>${[[560, 1180], [600, 1220], [630, 1170]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#f6e8d0"/>`).join('')}
      <path d="M760,1330 L770,1300 L800,1310 L790,1345Z M772,1330 L790,1290 L812,1300" fill="#f0e0a0" stroke="${TK}" stroke-width="5"/>
      <path d="M590,1300 C620,1360 700,1380 760,1350" stroke="#e8c860" stroke-width="10" fill="none"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${600 + i * 30}" cy="${1312 + Math.sin(i / 5 * Math.PI) * 48}" r="8" fill="#f4dc8a" stroke="#6a4a10" stroke-width="2"/>`).join('')}
      <defs><radialGradient id="${id}Sk" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#ead8a8"/><stop offset=".55" stop-color="#d2b67a"/><stop offset="1" stop-color="#9a7c46"/></radialGradient>
        <pattern id="${id}Jt" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0,8 L16,8 M8,0 L8,16" stroke="#8a6c3a" stroke-width="2" opacity=".35"/></pattern></defs>
      <g transform="translate(925,1620)">
        <path d="M-40,20 C-150,60 -190,180 -160,280 C-130,370 -40,400 30,400 C110,400 200,370 220,280 C240,180 190,60 90,20Z" fill="url(#${id}Sk)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
        <path d="M-40,20 C-150,60 -190,180 -160,280 C-130,370 -40,400 30,400 C110,400 200,370 220,280 C240,180 190,60 90,20Z" fill="url(#${id}Jt)"/>
        <path d="M200,250 C190,330 130,385 40,392" stroke="#6a4c22" stroke-width="30" fill="none" opacity=".45" filter="url(#${id}S2)"/>
        <path d="M-130,140 C-150,200 -140,270 -110,320" stroke="#fff4d0" stroke-width="14" fill="none" opacity=".6" stroke-linecap="round"/>
        ${[[-60, 60, -80, 140], [30, 40, 20, 120], [110, 60, 140, 140]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} Q${(x1 + x2) / 2 - 10},${(y1 + y2) / 2} ${x2},${y2}" stroke="#8a6c3a" stroke-width="6" fill="none" opacity=".7"/>`).join('')}
        <path d="M-8,180 L-8,330 M42,180 L42,330" stroke="#2e6a2e" stroke-width="12" stroke-linecap="round"/>
        <path d="M78,205 C70,180 -10,170 -30,205 C-50,245 70,240 80,285 C90,330 -20,340 -40,300" stroke="#2e6a2e" stroke-width="22" fill="none" stroke-linecap="round"/>
        <path d="M78,205 C70,180 -10,170 -30,205 C-50,245 70,240 80,285 C90,330 -20,340 -40,300" stroke="#5aa05a" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7" transform="translate(-4,-4)"/>
        <path d="M-60,30 C-90,-10 -110,-50 -70,-70 C-40,-40 -20,-60 0,-80 C20,-60 40,-40 70,-70 C110,-50 100,-10 80,30Z" fill="#d8c08a" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
        <path d="M-50,-30 L-40,20 M0,-60 L0,20 M50,-30 L40,20" stroke="#9a7c46" stroke-width="6"/>
        <path d="M-66,24 C-20,42 60,42 96,24" stroke="#7a2a1a" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M-60,18 C-20,34 60,34 92,18" stroke="#c4583a" stroke-width="5" fill="none" opacity=".7"/>
        <path d="M60,30 C90,60 100,90 80,110 M64,32 C40,70 40,100 56,118" stroke="#7a2a1a" stroke-width="10" fill="none" stroke-linecap="round"/>
        ${[[-30, -66], [30, -72]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="10" fill="#e8c860" stroke="${TK}" stroke-width="5"/><ellipse cx="${x}" cy="${y - 4}" rx="12" ry="4" fill="#fff0a0" opacity=".8"/>`).join('')}
      </g>
      <circle cx="940" cy="1620" r="46" fill="#261717"/><path d="M909,1604 C919,1588 937,1582 953,1586" stroke="#5a4440" stroke-width="7" fill="none" opacity=".6" stroke-linecap="round"/><circle cx="965" cy="1602" r="12" fill="#e8c860" stroke="${TK}" stroke-width="4"/><circle cx="240" cy="1670" r="44" fill="#261717"/><circle cx="264" cy="1650" r="12" fill="#e8c860" stroke="${TK}" stroke-width="4"/><circle cx="264" cy="1650" r="5" fill="#3a8ad8"/>`,
    faceTop: (id, f) => mustache(id, MUST.fino, '#1a1212', '#4a3a3a') + (f === 'sorpresa' || f === 'feliz' ? '' : `<g transform="rotate(-12,650,1030)"><rect x="640" y="1012" width="190" height="36" rx="12" fill="#6a3a1a" stroke="${TK}" stroke-width="8"/><rect x="700" y="1012" width="34" height="36" fill="#c02a2a" stroke="${TK}" stroke-width="5"/><circle cx="830" cy="1030" r="16" fill="#e85a2a"/><circle cx="830" cy="1030" r="8" fill="#ffd040"/></g>
      ${[[880, 960, 22], [920, 880, 30], [900, 790, 38]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e8e4e0" opacity=".55" filter="url(#${id}S1)"/>`).join('')}`),
    hat: id => `<path d="M224,760 C210,540 380,420 600,420 C820,420 970,540 956,760 C930,660 880,600 820,580 C720,560 640,566 590,580 C520,566 440,560 360,580 C300,600 250,660 224,760Z" fill="#1a1212" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      ${[[320, 640, 520, 470], [420, 580, 600, 450], [560, 572, 720, 460], [700, 580, 860, 520]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} C${(x1 + x2) / 2},${y1 - 80} ${x2 - 40},${y2} ${x2},${y2}" stroke="#4a4248" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M330,520 C400,460 480,440 560,436" stroke="#8a8090" stroke-width="16" fill="none" opacity=".8" stroke-linecap="round"/>`
  }, o));
}

// shared gradients for metal / wood
function metalDefs(id) {
  return `<defs><linearGradient id="${id}Fe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8ecf0"/><stop offset=".35" stop-color="#a8b0b8"/><stop offset=".7" stop-color="#6a727c"/><stop offset="1" stop-color="#3a4048"/></linearGradient>
    <linearGradient id="${id}Fe2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe4ea"/><stop offset=".5" stop-color="#9aa2ac"/><stop offset="1" stop-color="#555c66"/></linearGradient>
    <linearGradient id="${id}Wd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c88a4a"/><stop offset=".4" stop-color="#9a5e28"/><stop offset="1" stop-color="#5a300e"/></linearGradient>
    <linearGradient id="${id}Au" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4dc8a"/><stop offset=".5" stop-color="#d0a840"/><stop offset="1" stop-color="#8a6a1a"/></linearGradient></defs>`;
}

// 12. LEGIONARIO ROMANO (v2)
const BODY_ROM = 'M270,1180 C290,1090 430,1066 595,1066 C760,1066 900,1090 920,1180 C915,1350 870,1500 840,1600 C820,1660 740,1680 595,1680 C450,1680 370,1660 350,1600 C320,1500 275,1350 270,1180Z';
function romano2d(o = {}) {
  const G = id => `url(#${id}Au)`;
  return pjT(Object.assign({
    id: 'ro', bodyPath: BODY_ROM, bodyEdge: 'M918,1260 C900,1420 860,1560 600,1682', shadowW: 360,
    top: ['#eef2f6', '#bcc4cc', '#8a929c', '#4a5058', '#ffffff', '#ffffff'], hatC: ['#000', '#000', '#000', '#000'], brow: '#2a1a14',
    legs: legsAt(522, 668, 1880), armW: 30,
    armL: 'M282,1240 C240,1360 225,1440 228,1500', handL: [228, 1510], armR: 'M908,1240 C980,1220 1010,1160 1010,1100', handR: [1010, 1090],
    back: id => metalDefs(id) + `<path d="M300,1140 C200,1400 190,1720 220,1990 C400,2030 790,2030 970,1990 C1000,1720 990,1400 890,1140Z" fill="#9a1a22" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M300,1300 C255,1520 250,1740 262,1960 M890,1300 C935,1520 940,1740 928,1960 M380,1700 C370,1800 372,1900 380,1990" stroke="#5a0a10" stroke-width="22" fill="none" opacity=".55"/>
      <path d="M320,1260 C290,1450 280,1650 290,1900" stroke="#d84a52" stroke-width="10" fill="none" opacity=".5"/>`,
    under: id => `<path d="M372,1660 C450,1690 740,1690 818,1660 L842,1900 C760,1925 430,1925 348,1900Z" fill="#b01e28" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M380,1880 C470,1900 720,1900 810,1880" stroke="#5a0a10" stroke-width="12" fill="none" opacity=".6"/>
      ${[...Array(10)].map((_, i) => { const x = 392 + i * 41, sk = (i - 4.5) * 5; return `<path d="M${x},1660 L${x + 36},1660 L${x + 36 + sk},1850 C${x + 30 + sk},1862 ${x + 6 + sk},1862 ${x + sk},1850Z" fill="#8a5428" stroke="${TK}" stroke-width="6" stroke-linejoin="round"/><path d="M${x + 7},1668 L${x + 7 + sk},1840" stroke="#c48a50" stroke-width="5" opacity=".7"/><circle cx="${x + 18 + sk}" cy="1826" r="9" fill="${G(id)}" stroke="${TK}" stroke-width="3"/><circle cx="${x + 18 + sk * .5}" cy="1740" r="7" fill="${G(id)}" stroke="${TK}" stroke-width="3"/>`; }).join('')}
      ${[516, 674].map(x => `<path d="M${x - 28},2088 L${x + 28},2088" stroke="#4a2a10" stroke-width="24" stroke-linecap="round"/>${[1960, 2000, 2040].map(y => `<path d="M${x - 22},${y} L${x + 22},${y - 14}" stroke="#7a4a1e" stroke-width="10" stroke-linecap="round"/>`).join('')}`).join('')}`,
    bodyIn: id => `${[1250, 1335, 1420, 1505, 1590].map((y, k) => `<path d="M250,${y} C400,${y + 34} 790,${y + 34} 940,${y}" stroke="#3a4048" stroke-width="11" fill="none"/><path d="M250,${y + 13} C400,${y + 47} 790,${y + 47} 940,${y + 13}" stroke="#ffffff" stroke-width="6" fill="none" opacity=".6"/>${[340, 850].map(x => `<circle cx="${x}" cy="${y + 34}" r="7" fill="${G(id)}" stroke="${TK}" stroke-width="3"/>`).join('')}`).join('')}
      <path d="M595,1090 L595,1300" stroke="#3a4048" stroke-width="9"/>
      ${[-1, 1].map(sd => `<path d="M${595 + sd * 30},1100 L${595 + sd * 200},1100 L${595 + sd * 210},1240 L${595 + sd * 40},1240Z" fill="url(#${id}Fe)" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M${595 + sd * 50},1120 L${595 + sd * 180},1120" stroke="#fff" stroke-width="6" opacity=".7"/>${[1130, 1210].map(y => `<rect x="${595 + sd * 110 - 16}" y="${y - 9}" width="32" height="18" rx="4" fill="${G(id)}" stroke="${TK}" stroke-width="4"/>`).join('')}`).join('')}`,
    front: id => `${[-1, 1].map(sd => [0, 1, 2].map(k => `<path d="M${595 + sd * (170 + k * 18)},${1088 + k * 38} C${595 + sd * (280 + k * 14)},${1078 + k * 38} ${595 + sd * (345 + k * 8)},${1120 + k * 38} ${595 + sd * (350 + k * 6)},${1190 + k * 38} C${595 + sd * (300 + k * 10)},${1210 + k * 38} ${595 + sd * (230 + k * 14)},${1200 + k * 38} ${595 + sd * (160 + k * 18)},${1170 + k * 38}Z" fill="url(#${id}Fe2)" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M${595 + sd * (190 + k * 18)},${1110 + k * 38} C${595 + sd * (270 + k * 14)},${1104 + k * 38} ${595 + sd * (315 + k * 8)},${1128 + k * 38} ${595 + sd * (328 + k * 6)},${1162 + k * 38}" stroke="#ffffff" stroke-width="5" fill="none" opacity=".75"/>`).reverse().join('')).join('')}
      <path d="M372,1648 C450,1676 740,1676 818,1648 L820,1700 C740,1728 450,1728 370,1700Z" fill="#6a3a14" stroke="${TK}" stroke-width="8"/>${[430, 500, 570, 640, 710, 780].map(x => `<rect x="${x - 17}" y="1660" width="34" height="34" rx="5" fill="${G(id)}" stroke="${TK}" stroke-width="4"/><circle cx="${x}" cy="1677" r="6" fill="#8a6a1a"/>`).join('')}
      <g transform="translate(1010,1090) rotate(-8)">
        <path d="M-34,-40 L34,-40 C38,-150 28,-330 0,-400 C-28,-330 -38,-150 -34,-40Z" fill="url(#${id}Fe)" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M0,-50 L0,-370" stroke="#4a5058" stroke-width="5"/><path d="M-18,-60 C-20,-180 -14,-300 -4,-360" stroke="#ffffff" stroke-width="6" fill="none" opacity=".8"/>
        <path d="M-66,-58 C-40,-70 40,-70 66,-58 C70,-40 66,-30 60,-26 C30,-34 -30,-34 -60,-26 C-66,-30 -70,-40 -66,-58Z" fill="${G(id)}" stroke="${TK}" stroke-width="7"/>
        <rect x="-20" y="-28" width="40" height="82" rx="10" fill="url(#${id}Wd)" stroke="${TK}" stroke-width="7"/>${[-10, 10, 30].map(y => `<path d="M-20,${y} L20,${y}" stroke="#4a2a10" stroke-width="4"/>`).join('')}
        <circle cx="0" cy="66" r="24" fill="${G(id)}" stroke="${TK}" stroke-width="7"/><circle cx="-8" cy="58" r="7" fill="#fff6c0"/>
      </g><circle cx="1010" cy="1090" r="46" fill="#261717"/><path d="M979,1074 C989,1058 1007,1052 1023,1056" stroke="#5a4440" stroke-width="7" fill="none" opacity=".6" stroke-linecap="round"/>
      <g transform="translate(228,1560)">
        <path d="M-150,-300 C-80,-322 80,-322 150,-300 C164,-90 164,140 150,350 C80,372 -80,372 -150,350 C-164,140 -164,-90 -150,-300Z" fill="#b01e28" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
        <path d="M-150,-300 C-164,-90 -164,140 -150,350 L-110,358 C-124,140 -124,-90 -110,-312Z" fill="#e85a62" opacity=".45"/>
        <path d="M150,-300 C164,-90 164,140 150,350 L100,360 C114,140 114,-90 100,-314Z" fill="#4a0810" opacity=".55"/>
        <path d="M-128,-280 C-60,-300 60,-300 128,-280 C140,-90 140,130 128,330 C60,350 -60,350 -128,330 C-140,130 -140,-90 -128,-280Z" fill="none" stroke="${G(id)}" stroke-width="16"/>
        ${[[-128, -280], [128, -280], [-128, 330], [128, 330], [-138, 25], [138, 25]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${G(id)}" stroke="${TK}" stroke-width="4"/>`).join('')}
        ${[-1, 1].map(sd => `<path d="M${sd * 40},-70 C${sd * 80},-120 ${sd * 110},-150 ${sd * 110},-200 C${sd * 70},-190 ${sd * 50},-160 ${sd * 30},-130 C${sd * 60},-160 ${sd * 70},-200 ${sd * 60},-240 C${sd * 30},-210 ${sd * 20},-170 ${sd * 10},-120Z" fill="${G(id)}" stroke="${TK}" stroke-width="6" stroke-linejoin="round"/>
          <path d="M${sd * 40},70 C${sd * 80},120 ${sd * 110},150 ${sd * 110},200 C${sd * 70},190 ${sd * 50},160 ${sd * 30},130 C${sd * 60},160 ${sd * 70},200 ${sd * 60},240 C${sd * 30},210 ${sd * 20},170 ${sd * 10},120Z" fill="${G(id)}" stroke="${TK}" stroke-width="6" stroke-linejoin="round"/>
          <path d="M${sd * 60},-30 L${sd * 120},-70 L${sd * 96},-10 L${sd * 140},-20 L${sd * 70},40 L${sd * 90},-6 L${sd * 50},0Z" fill="${G(id)}" stroke="${TK}" stroke-width="6" stroke-linejoin="round"/>`).join('')}
        <ellipse cx="0" cy="25" rx="62" ry="58" fill="url(#${id}Fe)" stroke="${TK}" stroke-width="10"/><ellipse cx="-18" cy="6" rx="20" ry="16" fill="#fff" opacity=".8"/><ellipse cx="0" cy="25" rx="40" ry="36" fill="none" stroke="#6a727c" stroke-width="5"/>
      </g>`,
    hat: id => metalDefs(id + 'h') + `
      <path d="M200,700 C200,760 210,800 230,830 L300,820 C290,780 290,740 300,700Z M980,700 C980,760 970,800 950,830 L880,820 C890,780 890,740 880,700Z" fill="url(#${id}hFe2)" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M210,690 C190,430 370,330 590,330 C810,330 990,430 970,690 C930,650 880,624 820,614 L360,614 C300,624 250,650 210,690Z" fill="url(#${id}hFe)" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M270,520 C320,420 440,370 560,362" stroke="#ffffff" stroke-width="16" fill="none" opacity=".85" stroke-linecap="round"/>
      <path d="M880,420 C930,500 950,580 950,640" stroke="#2a3038" stroke-width="40" fill="none" opacity=".35" filter="url(#${id}S2)"/>
      ${[[300, 600], [880, 600], [590, 340]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="url(#${id}hAu)" stroke="${TK}" stroke-width="4"/>`).join('')}
      <path d="M300,602 C420,580 760,580 880,602 L884,640 C760,620 420,620 296,640Z" fill="url(#${id}hAu)" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      ${[-1, 1].map(sd => `<path d="M${590 + sd * 310},620 C${590 + sd * 365},720 ${590 + sd * 365},880 ${590 + sd * 300},990 C${590 + sd * 255},975 ${590 + sd * 235},900 ${590 + sd * 245},820 C${590 + sd * 255},740 ${590 + sd * 270},680 ${590 + sd * 280},640Z" fill="url(#${id}hFe2)" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/><path d="M${590 + sd * 300},670 C${590 + sd * 335},760 ${590 + sd * 335},860 ${590 + sd * 300},940" stroke="${sd < 0 ? '#ffffff' : '#4a5058'}" stroke-width="6" fill="none" opacity=".7"/><circle cx="${590 + sd * 300}" cy="760" r="11" fill="url(#${id}hAu)" stroke="${TK}" stroke-width="4"/><circle cx="${590 + sd * 296}" cy="900" r="11" fill="url(#${id}hAu)" stroke="${TK}" stroke-width="4"/>`).join('')}
      <path d="M555,340 L555,270 L625,270 L625,340Z" fill="url(#${id}hAu)" stroke="${TK}" stroke-width="8"/>
      <path d="M350,290 C370,110 810,110 830,290 C770,262 690,246 590,246 C490,246 410,262 350,290Z" fill="#c0242c" stroke="${TK}" stroke-width="11" stroke-linejoin="round"/>
      ${[...Array(15)].map((_, i) => { const t = i / 14, x = 372 + t * 436; return `<path d="M${x},${280 - Math.sin(t * Math.PI) * 120} L${x + (t - .5) * 10},${262 - Math.sin(t * Math.PI) * 10}" stroke="#7a1018" stroke-width="5"/>`; }).join('')}
      <path d="M390,248 C430,160 530,140 600,140" stroke="#ff8a8a" stroke-width="12" fill="none" opacity=".6" stroke-linecap="round"/>`
  }, o));
}

// 13. MINERO (v2): robusto, casco con lámpara, pañuelo rojo al cuello, camisa de cuadros, mono con tirantes, hollín en rayas, pico apoyado en el suelo, farol
const BODY_MIN = 'M300,1190 C320,1096 450,1066 595,1066 C740,1066 870,1096 890,1190 C910,1380 905,1580 880,1720 C860,1820 760,1860 595,1860 C430,1860 330,1820 310,1720 C285,1580 280,1380 300,1190Z';
function minero2d(o = {}) {
  const G = id => `url(#${id}Au)`;
  return pjT(Object.assign({
    id: 'mn', bodyPath: BODY_MIN, bodyEdge: 'M892,1300 C906,1520 880,1800 600,1862', shadowW: 380, shadowX: 640,
    top: ['#b04e3c', '#8e3c2e', '#6c2c22', '#3a140e', '#d8806a', '#f4b4a0'], hatC: ['#f0c848', '#d4a420', '#a47c10', '#6a4a08'], brow: '#2a1a14',
    legs: legsAt(515, 675, 1850), armW: 30,
    armL: 'M310,1250 C255,1390 238,1500 236,1600', handL: [236, 1610], armR: 'M880,1250 C940,1360 965,1440 975,1520', handR: [978, 1530],
    under: id => metalDefs(id) + `<g transform="translate(978,1530) rotate(6)">
        <rect x="-15" y="-60" width="30" height="560" rx="12" fill="url(#${id}Wd)" stroke="${TK}" stroke-width="8"/><path d="M-6,-40 L-6,480" stroke="#e0a868" stroke-width="5" opacity=".6"/>
        <path d="M-200,500 C-100,450 100,450 200,500 L206,530 C100,486 -100,486 -206,530Z" fill="url(#${id}Fe2)" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
        <path d="M-200,500 L-232,540 L-196,522Z M200,500 L232,540 L196,522Z" fill="url(#${id}Fe2)" stroke="${TK}" stroke-width="6" stroke-linejoin="round"/>
        <rect x="-32" y="458" width="64" height="66" rx="8" fill="url(#${id}Fe)" stroke="${TK}" stroke-width="8"/><path d="M-170,486 C-80,462 80,462 170,486" stroke="#ffffff" stroke-width="6" fill="none" opacity=".75"/>
      </g>`,
    bodyIn: id => `<defs><pattern id="${id}Pl" width="84" height="84" patternUnits="userSpaceOnUse"><rect width="84" height="84" fill="none"/><path d="M0,0 L84,0 M0,42 L84,42" stroke="#3a140e" stroke-width="12" opacity=".5"/><path d="M0,0 L0,84 M42,0 L42,84" stroke="#3a140e" stroke-width="12" opacity=".5"/><path d="M21,0 L21,84 M0,21 L84,21 M63,0 L63,84 M0,63 L84,63" stroke="#f0c8a0" stroke-width="3" opacity=".35"/></pattern>
        <linearGradient id="${id}Dn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a6c90"/><stop offset=".5" stop-color="#3e4e70"/><stop offset="1" stop-color="#26324c"/></linearGradient></defs>
      <path d="${BODY_MIN}" fill="url(#${id}Pl)"/>
      <path d="M330,1420 C460,1440 730,1440 860,1420 L892,1860 L298,1860Z" fill="url(#${id}Dn)" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M425,1440 L388,1090" stroke="url(#${id}Dn)" stroke-width="56"/><path d="M765,1440 L802,1090" stroke="url(#${id}Dn)" stroke-width="56"/>
      ${[[[397, 1090], [434, 1440]], [[360, 1090], [397, 1440]], [[793, 1090], [756, 1440]], [[830, 1090], [793, 1440]]].map(([[a, b], [c, d]]) => `<path d="M${a},${b} L${c},${d}" stroke="${TK}" stroke-width="5"/>`).join('')}
      ${[[425, 1440], [765, 1440]].map(([x, y]) => `<rect x="${x - 26}" y="${y - 50}" width="52" height="52" rx="6" fill="${G(id)}" stroke="${TK}" stroke-width="6"/><circle cx="${x}" cy="${y - 24}" r="9" fill="#8a6a1a"/>`).join('')}
      <path d="M510,1480 L680,1480 L676,1610 L514,1610Z" fill="#33415e" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/><path d="M520,1500 L670,1500" stroke="#7a8cae" stroke-width="5" stroke-dasharray="12 8"/>
      <rect x="560" y="1460" width="18" height="60" rx="4" fill="#e8c040" stroke="${TK}" stroke-width="4"/><path d="M612,1470 L640,1460 L644,1520 L616,1528Z" fill="#f4f0e4" stroke="${TK}" stroke-width="4"/>
      <path d="M595,1610 L595,1860" stroke="#1e2a40" stroke-width="7"/>${[1700, 1790].map(y => `<path d="M330,${y} C460,${y + 10} 730,${y + 10} 870,${y}" stroke="#6a7c9e" stroke-width="5" stroke-dasharray="14 10" fill="none" opacity=".6"/>`).join('')}
      <path d="M700,1700 C730,1690 770,1700 790,1730 C760,1760 720,1760 700,1700Z" fill="#26324c" stroke="${TK}" stroke-width="5"/>
      ${[[380, 1740, -20], [770, 1560, 30], [470, 1300, -10]].map(([x, y, a]) => `<path d="M${x - 50},${y} C${x - 20},${y - 14} ${x + 20},${y - 10} ${x + 50},${y + 6}" stroke="#1a1414" stroke-width="16" fill="none" opacity=".35" stroke-linecap="round" transform="rotate(${a},${x},${y})"/>`).join('')}`,
    front: id => `<path d="M450,1130 C520,1200 670,1200 740,1130 L760,1180 C680,1250 510,1250 430,1180Z" fill="#c8302e" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>${[[480, 1170], [560, 1205], [640, 1205], [715, 1170]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#f6e8d8"/>`).join('')}
      <path d="M660,1210 L700,1300 L650,1290Z" fill="#a82420" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="978" cy="1530" r="46" fill="#261717"/><path d="M947,1514 C957,1498 975,1492 991,1496" stroke="#5a4440" stroke-width="7" fill="none" opacity=".6" stroke-linecap="round"/>
      <g transform="translate(236,1610)">
        <circle cx="0" cy="150" r="150" fill="#ffc860" opacity=".28" filter="url(#${id}So)"/>
        <path d="M-44,0 C-44,-56 44,-56 44,0" stroke="${TK}" stroke-width="16" fill="none"/><path d="M-44,0 C-44,-56 44,-56 44,0" stroke="${G(id)}" stroke-width="8" fill="none"/>
        <path d="M-46,10 L46,10 L56,44 L-56,44Z" fill="${G(id)}" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
        <path d="M-52,44 L52,44 L46,210 L-46,210Z" fill="#fff0b8" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
        <path d="M-30,60 L-26,196" stroke="#ffffff" stroke-width="10" opacity=".8"/>
        <path d="M0,178 C-26,160 -26,120 0,90 C26,120 26,160 0,178Z" fill="#ffa030"/><path d="M0,172 C-12,160 -12,136 0,116 C12,136 12,160 0,172Z" fill="#fff4b0"/>
        <path d="M-52,44 L-46,210 M52,44 L46,210 M0,44 L0,86 M0,190 L0,210" stroke="${TK}" stroke-width="8"/>
        <path d="M-60,206 L60,206 L54,240 L-54,240Z" fill="${G(id)}" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      </g><circle cx="236" cy="1610" r="46" fill="#261717"/>`,
    headIn: id => `<path d="M228,700 C236,820 268,920 318,990 C300,900 296,800 312,700Z M952,700 C944,820 912,920 862,990 C880,900 884,800 868,700Z" fill="#4a3020"/>
      <path d="M250,720 C262,800 280,870 300,920 M930,720 C918,800 900,870 880,920" stroke="#7a5034" stroke-width="7" fill="none"/>
      ${[[380, 960, 60], [800, 930, 46], [700, 1060, 36]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .55}" fill="#3a2a24" opacity=".28" filter="url(#${id}S2)"/>`).join('')}`,
    faceTop: (id, f) => `${[...Array(40)].map((_, i) => `<circle cx="${410 + (i * 71) % 370}" cy="${1010 + (i * 37) % 110}" r="4" fill="#2a1c18" opacity=".55"/>`).join('')}`,
    hat: id => metalDefs(id + 'h') + `<path d="M228,700 C236,820 268,920 318,990 C300,900 296,800 312,700" fill="none" stroke="${TK}" stroke-width="8"/><path d="M952,700 C944,820 912,920 862,990 C880,900 884,800 868,700" fill="none" stroke="${TK}" stroke-width="8"/>
      <path d="M220,660 C200,420 380,320 590,320 C800,320 980,420 960,660Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M560,322 C556,440 556,560 560,660 L620,660 C624,560 624,440 620,322Z" fill="#c09010" stroke="${TK}" stroke-width="6"/><path d="M572,330 L572,650" stroke="#fff0a0" stroke-width="5" opacity=".6"/>
      <path d="M290,520 C330,420 430,370 530,360" stroke="#fff6c0" stroke-width="16" fill="none" opacity=".85" stroke-linecap="round"/>
      <path d="M880,430 C920,500 945,580 950,640" stroke="#6a4a08" stroke-width="40" fill="none" opacity=".35" filter="url(#${id}S2)"/>
      <path d="M150,650 C300,610 880,610 1030,650 C1040,690 1000,712 960,708 C760,690 420,690 220,708 C180,712 140,690 150,650Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="11" stroke-linejoin="round"/><path d="M200,660 C400,636 780,636 980,660" stroke="#fff4b0" stroke-width="6" fill="none" opacity=".7"/>
      ${[[330, 470, 50], [850, 500, 40], [470, 630, 46], [760, 640, 34]].map(([x, y, r]) => `<path d="M${x - r},${y} C${x - r / 3},${y - 12} ${x + r / 3},${y + 10} ${x + r},${y - 4}" stroke="#4a3418" stroke-width="12" fill="none" opacity=".45" stroke-linecap="round"/>`).join('')}
      <g transform="translate(590,470)"><circle r="120" fill="#fff0a0" opacity=".35" filter="url(#${id}So)"/><path d="M-80,-56 L80,-56 L70,60 L-70,60Z" fill="url(#${id}hFe)" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/><circle r="46" fill="#fff8d0" stroke="${TK}" stroke-width="9"/><circle r="30" fill="#ffffff"/><circle r="46" fill="none" stroke="url(#${id}hAu)" stroke-width="6"/><circle cx="-14" cy="-14" r="10" fill="#fff" opacity=".9"/><path d="M-60,-40 L-40,-40" stroke="#fff" stroke-width="6" opacity=".7"/></g>`
  }, o));
}

// 14. PIRATA (v2): casaca larga roja con solapas y puños dorados, chaleco, fajín, pistola al cinto, sable, tricornio con calavera, parche,
// barba negra con trenzas, garfio grande, pata de palo, loro de pie en el hombro
const BODY_PIR = 'M360,1190 C372,1096 476,1066 595,1066 C714,1066 818,1096 830,1190 C850,1400 880,1640 910,1900 C760,1950 430,1950 280,1900 C310,1640 340,1400 360,1190Z';
function pirata2d(o = {}) {
  const G = id => `url(#${id}Au)`;
  const braid = (x, y0, y1) => { let s = ''; for (let y = y0; y < y1; y += 34) s += `<ellipse cx="${x + ((y / 34) % 2 ? 6 : -6)}" cy="${y}" rx="22" ry="20" fill="#1e1616" stroke="${TK}" stroke-width="5"/>`; return s + `<rect x="${x - 20}" y="${y1 - 14}" width="40" height="20" rx="5" fill="#c02a2a" stroke="${TK}" stroke-width="5"/><path d="M${x - 12},${y1 + 6} L${x - 18},${y1 + 40} M${x},${y1 + 6} L${x},${y1 + 44} M${x + 12},${y1 + 6} L${x + 18},${y1 + 40}" stroke="#1e1616" stroke-width="9" stroke-linecap="round"/>`; };
  return pjT(Object.assign({
    id: 'pi', bodyPath: BODY_PIR, bodyEdge: 'M832,1300 C850,1520 880,1760 906,1898', shadowW: 340,
    top: ['#c8403a', '#a82e28', '#801e1c', '#4a0e0c', '#f07a70', '#ffb8b0'], hatC: ['#3e3638', '#2a2226', '#1a1418', '#0a0608'], brow: '#1a1212',
    legs: 'M522,1920 L516,2096', armW: 28,
    armL: 'M366,1250 C318,1400 300,1500 300,1590', handL: [300, 1600], armR: 'M824,1250 C890,1360 915,1440 920,1500', handR: [920, 1505],
    under: id => metalDefs(id) + `<path d="M672,1910 L668,2070" stroke="url(#${id}Wd)" stroke-width="44" stroke-linecap="round"/><path d="M660,1930 L658,2060" stroke="#e0a868" stroke-width="6" opacity=".6"/>
      <path d="M646,1950 L698,1950 M646,1990 L698,1990" stroke="${TK}" stroke-width="7"/><ellipse cx="668" cy="2082" rx="26" ry="12" fill="#3a2010" stroke="${TK}" stroke-width="6"/>
      <path d="M496,2092 L548,2092" stroke="#2a1a10" stroke-width="26" stroke-linecap="round"/>`,
    bodyIn: id => `<path d="M500,1100 C520,1400 528,1660 524,1940 L666,1940 C662,1660 670,1400 690,1100Z" fill="#7a5a2a"/>
      <path d="M520,1100 C540,1300 545,1420 548,1500 L642,1500 C645,1420 650,1300 670,1100Z" fill="#f4ead0"/>${[1180, 1250, 1320, 1390].map(y => `<path d="M552,${y} C580,${y + 16} 610,${y + 16} 638,${y}" stroke="#c8b890" stroke-width="6" fill="none"/>`).join('')}
      ${[1560, 1640, 1720, 1800, 1880].map(y => `<circle cx="595" cy="${y}" r="11" fill="${G(id)}" stroke="${TK}" stroke-width="4"/>`).join('')}
      <path d="M330,1500 C460,1532 730,1532 860,1500 L862,1590 C730,1622 460,1622 328,1590Z" fill="#2a5a9a" stroke="${TK}" stroke-width="8"/><path d="M340,1530 C470,1560 720,1560 852,1530" stroke="#5a8ac8" stroke-width="8" fill="none" opacity=".7"/>
      <path d="M760,1560 C790,1620 800,1700 780,1760 L740,1750 C750,1700 745,1630 730,1580Z" fill="#2a5a9a" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/>
      ${[[440, 1180, 380, 1940], [750, 1180, 810, 1940]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} C${x1 - 10},1500 ${x2},1700 ${x2},${y2}" stroke="#4a0e0c" stroke-width="14" fill="none" opacity=".5"/>`).join('')}`,
    front: id => `${[-1, 1].map(sd => `<path d="M${595 + sd * 80},1090 C${595 + sd * 150},1110 ${595 + sd * 180},1180 ${595 + sd * 150},1300 C${595 + sd * 130},1400 ${595 + sd * 110},1500 ${595 + sd * 100},1520 L${595 + sd * 160},1520 C${595 + sd * 200},1380 ${595 + sd * 240},1220 ${595 + sd * 200},1100Z" fill="#801e1c" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M${595 + sd * 90},1100 C${595 + sd * 160},1120 ${595 + sd * 186},1190 ${595 + sd * 156},1310 C${595 + sd * 136},1410 ${595 + sd * 116},1500 ${595 + sd * 106},1515" stroke="${G(id)}" stroke-width="9" fill="none"/>${[1200, 1300, 1400].map(y => `<circle cx="${595 + sd * (170 - (y - 1200) * .1)}" cy="${y}" r="13" fill="${G(id)}" stroke="${TK}" stroke-width="4"/>`).join('')}`).join('')}
      <g transform="translate(500,1560) rotate(-20)"><path d="M-20,-90 L20,-90 L24,40 L-24,40Z" fill="#5a3418" stroke="${TK}" stroke-width="7"/><path d="M-24,40 C-60,60 -70,100 -50,130 L-10,120 C-20,96 -10,70 24,60Z" fill="#5a3418" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/><path d="M-18,-90 L-14,-180 L14,-180 L18,-90Z" fill="url(#${id}Fe)" stroke="${TK}" stroke-width="7"/><circle cx="0" cy="-184" r="10" fill="#2a2a2a"/><rect x="-26" y="-20" width="52" height="16" rx="4" fill="${G(id)}" stroke="${TK}" stroke-width="5"/><path d="M24,10 C40,14 44,30 30,36" stroke="${TK}" stroke-width="6" fill="none"/></g>
      
      <g transform="translate(920,1505)">
        <path d="M-40,10 C-50,30 -40,50 -24,44 C-20,60 0,64 6,48 C14,64 36,58 34,40 C50,44 54,20 40,10Z" fill="#f4ead0" stroke="${TK}" stroke-width="6" stroke-linejoin="round"/>
        <rect x="-18" y="36" width="36" height="34" rx="6" fill="#3a2010" stroke="${TK}" stroke-width="6"/>
        <path d="M0,70 L0,120 C0,200 -110,210 -120,130 C-124,96 -96,84 -80,104" stroke="${TK}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M0,70 L0,120 C0,200 -110,210 -120,130 C-124,96 -96,84 -80,104" stroke="url(#${id}Fe)" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M-6,80 L-6,124 C-8,180 -90,190 -104,130" stroke="#ffffff" stroke-width="6" fill="none" opacity=".75"/>
        <path d="M-80,104 L-98,80 L-70,88Z" fill="url(#${id}Fe)" stroke="${TK}" stroke-width="6" stroke-linejoin="round"/>
      </g>
      <path d="M262,1580 C252,1600 262,1620 278,1614 C282,1630 302,1634 308,1618 C316,1634 338,1628 336,1610 C352,1614 356,1590 342,1580Z" fill="#f4ead0" stroke="${TK}" stroke-width="6" stroke-linejoin="round"/><circle cx="300" cy="1640" r="44" fill="#261717"/><path d="M270,1622 C280,1606 298,1600 314,1604" stroke="#5a4440" stroke-width="7" fill="none" opacity=".6" stroke-linecap="round"/>`,
    headIn: id => `<path d="M240,880 C250,1080 400,1210 590,1210 C780,1210 930,1080 940,880 C880,960 790,990 720,970 C680,1010 500,1010 460,970 C390,990 300,960 240,880Z" fill="#1e1616"/>
      <path d="M320,980 C380,1070 470,1110 590,1120" stroke="#4a3a3a" stroke-width="12" fill="none" opacity=".7" stroke-linecap="round"/>${[[380, 1060], [480, 1120], [700, 1120], [800, 1060]].map(([x, y]) => `<path d="M${x},${y} q10,24 0,40" stroke="#4a3a3a" stroke-width="6" fill="none"/>`).join('')}`,
    faceTop: (id, f) => `<path d="M240,880 C250,1080 400,1210 590,1210 C780,1210 930,1080 940,880 C880,960 790,990 720,970 C680,1010 500,1010 460,970 C390,990 300,960 240,880Z" fill="none" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      ${braid(530, 1200, 1330)}${braid(660, 1200, 1330)}
      <path d="M260,680 C400,750 560,800 760,790" stroke="${TK}" stroke-width="12" fill="none"/>
      <path d="M618,800 C630,764 676,752 722,754 C770,756 794,786 790,836 C784,890 736,914 690,910 C644,904 610,866 618,800Z" fill="#1a1212" stroke="${TK}" stroke-width="6"/><path d="M660,806 C680,792 712,792 734,800" stroke="#5a4a4a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M776,800 C850,780 900,740 952,690" stroke="${TK}" stroke-width="12" fill="none"/>
      <path d="M700,700 L730,760 M745,710 L720,745" stroke="#c48a7a" stroke-width="7" stroke-linecap="round" opacity=".85"/>
      <circle cx="958" cy="930" r="24" fill="none" stroke="${G(id)}" stroke-width="9"/>`,
    hat: id => `<path d="M80,610 C190,560 300,500 360,380 C420,300 760,300 820,380 C880,500 990,560 1100,610 C1010,700 870,690 780,640 C700,610 480,610 400,640 C310,690 170,700 80,610Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M150,600 C250,560 330,510 380,420" stroke="#6a5a60" stroke-width="12" fill="none" opacity=".85" stroke-linecap="round"/><path d="M800,400 C860,480 950,540 1050,590" stroke="#000" stroke-width="30" fill="none" opacity=".3" filter="url(#${id}S2)"/>
      <path d="M80,610 C170,680 300,700 400,640 C480,610 700,610 780,640 C880,700 1010,680 1100,610" stroke="#e8c040" stroke-width="15" fill="none"/>
      <path d="M860,520 C900,420 960,360 1030,340 C1010,400 980,460 920,540Z" fill="#c02a2a" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M880,500 C920,430 970,380 1020,356" stroke="#ff7a7a" stroke-width="5" fill="none"/>
      <g transform="translate(590,470)"><path d="M-52,-10 C-52,-60 52,-60 52,-10 C52,20 30,30 24,46 L-24,46 C-30,30 -52,20 -52,-10Z" fill="#f6f2ea" stroke="${TK}" stroke-width="7"/><circle cx="-20" cy="-8" r="13" fill="${TK}"/><circle cx="20" cy="-8" r="13" fill="${TK}"/><path d="M-4,20 L4,20 L0,8Z" fill="${TK}"/><path d="M-12,46 L-12,34 M0,46 L0,34 M12,46 L12,34" stroke="${TK}" stroke-width="4"/><path d="M-80,40 L80,90 M80,40 L-80,90" stroke="${TK}" stroke-width="24" stroke-linecap="round"/><path d="M-80,40 L80,90 M80,40 L-80,90" stroke="#f6f2ea" stroke-width="14" stroke-linecap="round"/></g>
      <g transform="translate(260,478) scale(.85)">
        <path d="M-30,60 L-36,96 M-30,96 L-46,104 M-30,96 L-20,106 M10,60 L14,96 M14,96 L0,106 M14,96 L28,104" stroke="#e8a040" stroke-width="9" stroke-linecap="round"/>
        <path d="M-10,70 C-30,110 -50,170 -60,230 L-24,230 L-10,160 L6,230 L36,230 C30,170 20,110 10,70Z" fill="#c02a2a" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M-30,170 L24,170" stroke="#2a5aa8" stroke-width="12"/><path d="M-20,200 L28,200" stroke="#f4c040" stroke-width="10"/>
        <path d="M-10,70 C-70,50 -100,-30 -60,-100 C-30,-150 40,-140 62,-90 C84,-40 66,40 20,70Z" fill="#3aa848" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
        <path d="M-56,-20 C-90,20 -96,70 -80,110 C-60,90 -40,60 -30,20Z" fill="#2a8a38" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/>${[-10, 20, 50].map(y => `<path d="M-74,${y + 20} C-64,${y + 10} -52,${y + 8} -40,${y + 12}" stroke="#f4c040" stroke-width="6" fill="none"/>`).join('')}
        <path d="M-56,-90 C-30,-130 20,-136 50,-110" stroke="#8ae080" stroke-width="10" fill="none" opacity=".8" stroke-linecap="round"/>
        <circle cx="12" cy="-82" r="28" fill="#fff" stroke="${TK}" stroke-width="7"/><circle cx="18" cy="-84" r="13" fill="${TK}"/><circle cx="22" cy="-88" r="4" fill="#fff"/>
        <path d="M50,-84 C112,-96 124,-40 84,-16 C76,-36 64,-48 46,-48Z" fill="#f4c040" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/><path d="M54,-56 C80,-58 96,-50 100,-36" stroke="#8a6a10" stroke-width="5" fill="none"/>
      </g>`
  }, o));
}

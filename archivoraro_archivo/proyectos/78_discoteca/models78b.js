// 78 · reparto (2): el de la copa, dos chicas de la pista y el dueño de la discoteca de la competencia. Sistema pjT, siluetas distintas.

// ---------- EL DE LA COPA («Oye… ¿y yo por qué he entrado?»): barril, camiseta verde con dibujo de una palmera, chaqueta vaquera abierta,
// rapado con barba de puntos, orejas de soplillo, cóctel con sombrillita y pajita en la mano, pulsera de tela ----------
const COPA_BODY = 'M300,1210 C320,1100 450,1068 595,1068 C740,1068 870,1100 890,1210 C930,1380 940,1560 910,1690 C880,1810 760,1856 595,1856 C430,1856 310,1810 280,1690 C250,1560 260,1380 300,1210Z';
function copa2d(o = {}) {
  return pjT(Object.assign({
    id: 'co', bodyPath: COPA_BODY, bodyEdge: 'M905,1380 C930,1600 880,1820 600,1860', shadowW: 320,
    top: ['#5aa0d8', '#3a7ab8', '#285a90', '#163a60', '#8ac0ec', '#c8e4fa'], hatC: ['#3a2a20', '#2a1c14', '#1c120c', '#0e0804'], brow: '#1e1410',
    legs: legsAt(510, 680, 1850),
    armL: 'M300,1260 C250,1400 235,1530 240,1650', handL: [240, 1660], armR: 'M888,1260 C950,1330 990,1250 980,1150', handR: [980, 1140],
    bodyIn: id => `
      <path d="M455,1080 C480,1300 500,1600 510,1860 L680,1860 C690,1600 710,1300 735,1080Z" fill="#43bd65"/>
      <path d="M470,1090 C490,1300 508,1600 516,1850" stroke="#2f9a52" stroke-width="10" fill="none" opacity=".6"/>
      <g transform="translate(595,1420)"><path d="M-6,120 C0,40 4,-20 16,-70" stroke="#8a5a2a" stroke-width="22" fill="none" stroke-linecap="round"/>
        ${[-60, -20, 25, 70].map(a => `<path d="M16,-70 C${16 + Math.cos(a * Math.PI / 180) * 60},${-70 + Math.sin(a * Math.PI / 180) * 40 - 30} ${16 + Math.cos(a * Math.PI / 180) * 110},${-70 + Math.sin(a * Math.PI / 180) * 80} ${16 + Math.cos(a * Math.PI / 180) * 130},${-40 + Math.sin(a * Math.PI / 180) * 90}" stroke="#1f7a3a" stroke-width="18" fill="none" stroke-linecap="round"/>`).join('')}
        ${[-40, 10].map(a => `<path d="M16,-70 C${16 - Math.cos(a * Math.PI / 180) * 60},${-100} ${16 - Math.cos(a * Math.PI / 180) * 110},${-60} ${16 - Math.cos(a * Math.PI / 180) * 125},${-20}" stroke="#1f7a3a" stroke-width="18" fill="none" stroke-linecap="round"/>`).join('')}
        <circle cx="0" cy="-60" r="14" fill="#7a4a1a"/><circle cx="26" cy="-56" r="12" fill="#7a4a1a"/><path d="M-80,140 Q0,110 80,140" stroke="#ffd34a" stroke-width="14" fill="none"/><circle cx="60" cy="-120" r="30" fill="#ff9a3c" opacity=".9"/></g>
      ${[[340, 1300], [850, 1300], [330, 1600], [860, 1620]].map(([x, y]) => `<path d="M${x},${y} l0,60" stroke="#c8e4fa" stroke-width="5" stroke-dasharray="10 8" opacity=".6"/>`).join('')}
      <path d="M300,1660 C420,1700 470,1700 505,1700 M690,1700 C730,1700 780,1700 890,1660" stroke="#163a60" stroke-width="8" fill="none" opacity=".6"/>`,
    front: id => `
      <path d="M455,1076 L520,1240 L470,1250 L420,1100Z M735,1076 L670,1240 L720,1250 L770,1100Z" fill="#3a7ab8" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      ${[[440, 1320], [750, 1320]].map(([x, y]) => `<rect x="${x - 34}" y="${y}" width="68" height="56" rx="6" fill="#3a7ab8" stroke="${TK}" stroke-width="6"/><path d="M${x - 34},${y + 14} L${x + 34},${y + 14}" stroke="${TK}" stroke-width="5"/><circle cx="${x}" cy="${y + 8}" r="5" fill="#e8c860"/>`).join('')}
      ${[1500, 1580, 1660].map(y => `<circle cx="490" cy="${y}" r="10" fill="#e8c860" stroke="${TK}" stroke-width="4"/>`).join('')}
      <g transform="translate(980,1090)">
        <path d="M-50,-120 L50,-120 L10,-40 L10,40 L36,52 L-36,52 L-10,40 L-10,-40Z" fill="#dff4ff" fill-opacity=".7" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
        <path d="M-40,-110 L40,-110 L14,-60 L-14,-60Z" fill="#ff7ab8"/><path d="M-30,-105 L-10,-105" stroke="#fff" stroke-width="6" opacity=".7"/>
        <path d="M24,-104 L70,-200" stroke="#2fe8ff" stroke-width="10" stroke-linecap="round"/><path d="M70,-200 L96,-206" stroke="#2fe8ff" stroke-width="10" stroke-linecap="round"/>
        <path d="M-60,-150 L-6,-200 L48,-150Z" fill="#ffd34a" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/><path d="M-6,-200 L-12,-110" stroke="${TK}" stroke-width="6"/><path d="M-60,-150 L-6,-162 L48,-150" stroke="#e85a2a" stroke-width="6" fill="none"/>
        <circle cx="-38" cy="-118" r="16" fill="#8ad04a" stroke="${TK}" stroke-width="5"/></g>
      <circle cx="980" cy="1140" r="44" fill="#261717"/><path d="M955,1185 C970,1200 1000,1200 1015,1185" stroke="#e85a2a" stroke-width="12" fill="none"/>`,
    headIn: id => `${[...Array(60)].map((_, i) => { const a = (i * 137.5) % 360 * Math.PI / 180, r = 30 + ((i * 53) % 230), x = 590 + Math.cos(a) * r * 1.15, y = 1010 + Math.sin(a) * r * .42; return y > 920 && y < 1140 ? `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5" fill="#3a2e30" opacity=".55"/>` : ''; }).join('')}`,
    hat: id => `<path d="M236,700 C230,520 380,410 590,410 C800,410 950,520 944,700 C900,600 760,560 590,560 C420,560 280,600 236,700Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      ${[...Array(40)].map((_, i) => `<circle cx="${300 + (i * 61) % 580}" cy="${450 + (i * 37) % 160}" r="4" fill="#5a4a40" opacity=".6"/>`).join('')}
      ${[-1, 1].map(sd => `<ellipse cx="${590 + sd * 392}" cy="820" rx="62" ry="86" fill="#f2dcb8" stroke="${TK}" stroke-width="14" transform="rotate(${sd * 14},${590 + sd * 392},820)"/><path d="M${590 + sd * 380},770 C${590 + sd * 405},810 ${590 + sd * 400},860 ${590 + sd * 375},885" stroke="#c89c7c" stroke-width="10" fill="none"/>`).join('')}`
  }, o));
}

// ---------- CHICA 1, la que baila: vestido de lentejuelas fucsia, melena rizada enorme, aros dorados, pestañas, labios, pulseras ----------
const CH1_BODY = 'M440,1200 C448,1116 512,1090 595,1090 C678,1090 742,1116 750,1200 C760,1300 750,1380 730,1440 C800,1560 850,1680 870,1800 C780,1850 410,1850 320,1800 C340,1680 390,1560 460,1440 C440,1380 430,1300 440,1200Z';
function chica1_2d(o = {}) {
  return pjT(Object.assign({
    id: 'c1', bodyPath: CH1_BODY, bodyEdge: 'M748,1300 C740,1400 800,1600 866,1800', shadowW: 260,
    top: ['#ff6ab8', '#e83a98', '#b81e74', '#7a0c4a', '#ffa0d8', '#ffd0ec'], hatC: ['#000', '#000', '#000', '#000'], lashes: 1, lips: '#c4183a', brow: '#2a1410',
    legs: legsAt(530, 660, 1830),
    armL: 'M445,1250 C360,1220 260,1120 200,960', handL: [196, 948], armR: 'M745,1250 C810,1330 840,1420 850,1520', handR: [850, 1530],
    back: id => `<path d="M220,760 C120,900 140,1150 260,1260 C300,1180 300,1080 330,1010 C360,1120 420,1180 470,1200 C420,1080 410,980 420,900Z M960,760 C1060,900 1040,1150 920,1260 C880,1180 880,1080 850,1010 C820,1120 760,1180 710,1200 C760,1080 770,980 760,900Z" fill="#3a1c14" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      ${[[190, 980], [260, 1120], [990, 980], [920, 1120], [230, 860], [950, 860]].map(([x, y]) => `<path d="M${x - 30},${y} a30,30 0 1 1 60,0" stroke="#6a3424" stroke-width="10" fill="none"/>`).join('')}`,
    bodyIn: id => `${[...Array(70)].map((_, i) => { const x = 330 + (i * 83) % 530, y = 1110 + ((i * 47) % 720); return `<circle cx="${x}" cy="${y}" r="${7 + (i % 3) * 2}" fill="${i % 4 ? '#ffd0ec' : '#fff'}" opacity="${.35 + (i % 5) * .12}"/>`; }).join('')}
      <path d="M460,1440 C540,1462 650,1462 730,1440" stroke="#7a0c4a" stroke-width="16" fill="none" opacity=".7"/>
      <path d="M330,1790 C460,1820 730,1820 860,1790" stroke="#ffa0d8" stroke-width="12" fill="none" opacity=".8"/>`,
    front: id => `<path d="M520,1100 C540,1130 650,1130 670,1100" stroke="#ffd34a" stroke-width="7" fill="none"/><circle cx="595" cy="1130" r="14" fill="#ffd34a" stroke="${TK}" stroke-width="5"/>
      ${[0, 1, 2].map(k => `<ellipse cx="205" cy="${1000 + k * 22}" rx="38" ry="10" fill="none" stroke="${['#ffd34a', '#2fe8ff', '#ff3fa0'][k]}" stroke-width="8"/>`).join('')}
      <path d="M800,1840 L820,1900 M690,1840 L700,1900" stroke="none"/>`,
    under: id => `<path d="M500,2088 L560,2088 M630,2088 L690,2088" stroke="#ff3fa0" stroke-width="30" stroke-linecap="round"/><path d="M556,2060 L560,2090 M686,2060 L690,2090" stroke="#c81e78" stroke-width="10"/>`,
    hat: id => `<path d="M220,760 C190,540 360,380 590,380 C820,380 990,540 960,760 C930,680 880,640 820,620 C800,660 760,680 720,680 C700,640 660,610 600,606 C540,610 500,640 470,690 C420,680 380,650 360,610 C300,640 250,690 220,760Z" fill="#3a1c14" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      ${[[300, 520], [400, 450], [520, 420], [660, 420], [780, 450], [880, 520], [340, 640], [840, 640], [590, 480]].map(([x, y]) => `<path d="M${x - 34},${y + 6} a34,34 0 1 1 68,0" stroke="#6a3424" stroke-width="11" fill="none"/>`).join('')}
      <path d="M330,500 C400,440 480,420 560,418" stroke="#8a4a30" stroke-width="14" fill="none" opacity=".8" stroke-linecap="round"/>
      ${[-1, 1].map(sd => `<circle cx="${590 + sd * 360}" cy="960" r="44" fill="none" stroke="#e8c860" stroke-width="12"/><circle cx="${590 + sd * 360 - 14}" cy="${930}" r="6" fill="#fff" opacity=".8"/>`).join('')}`
  }, o));
}

// ---------- CHICA 2, la de las gafas: sudadera morada corta con capucha, moño rubio con coletero, gafas de pasta grandes, pendientes de estrella,
// riñonera cruzada, vaqueros (silueta recta) ----------
const CH2_BODY = 'M400,1200 C410,1110 500,1084 595,1084 C690,1084 780,1110 790,1200 C800,1360 796,1560 784,1700 C776,1790 700,1830 595,1830 C490,1830 414,1790 406,1700 C394,1560 390,1360 400,1200Z';
function chica2_2d(o = {}) {
  return pjT(Object.assign({
    id: 'c2', bodyPath: CH2_BODY, bodyEdge: 'M788,1350 C796,1560 780,1800 600,1834', shadowW: 260,
    top: ['#a880ff', '#8a5cff', '#6a3ad8', '#3e1c8a', '#c8b0ff', '#e8dcff'], hatC: ['#000', '#000', '#000', '#000'], lashes: 1, brow: '#8a6a2a',
    legs: legsAt(530, 660, 1830),
    armL: 'M405,1260 C350,1400 330,1540 330,1660', handL: [330, 1670], armR: 'M785,1260 C840,1400 860,1540 860,1660', handR: [860, 1670],
    bodyIn: id => `<path d="M400,1560 C500,1590 690,1590 790,1560 L792,1830 L398,1830Z" fill="#3a5a8a"/><path d="M595,1580 L595,1830" stroke="#24406a" stroke-width="8"/>${[1640, 1720].map(y => `<path d="M400,${y} C500,${y + 20} 690,${y + 20} 790,${y}" stroke="#5a7aaa" stroke-width="5" fill="none" stroke-dasharray="14 10"/>`).join('')}
      <path d="M400,1550 C500,1585 690,1585 790,1550 L790,1600 C690,1630 500,1630 400,1600Z" fill="#8a5cff" stroke="${TK}" stroke-width="7"/>${[...Array(14)].map((_, i) => `<path d="M${410 + i * 28},${1560 + Math.sin(i / 13 * Math.PI) * 30} l0,36" stroke="#6a3ad8" stroke-width="5"/>`).join('')}
      <path d="M500,1340 C540,1380 650,1380 690,1340 L700,1460 C640,1480 550,1480 490,1460Z" fill="#6a3ad8" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/>
      <g transform="translate(595,1260)"><path d="M0,-40 L12,-12 L42,-10 L18,10 L26,40 L0,24 L-26,40 L-18,10 L-42,-10 L-12,-12Z" fill="#ffd34a" stroke="${TK}" stroke-width="5"/></g>`,
    front: id => `<path d="M450,1110 C440,1060 520,1040 595,1040 C670,1040 750,1060 740,1110 C700,1160 490,1160 450,1110Z" fill="#8a5cff" stroke="${TK}" stroke-width="9"/><path d="M560,1130 L555,1230 M630,1130 L635,1230" stroke="#f4f2ec" stroke-width="7"/><circle cx="555" cy="1236" r="8" fill="#f4f2ec"/><circle cx="635" cy="1236" r="8" fill="#f4f2ec"/>
      <path d="M760,1130 C700,1300 600,1420 470,1500" stroke="#1b1720" stroke-width="20" fill="none"/>
      <rect x="400" y="1460" width="150" height="90" rx="30" fill="#2fe8ff" stroke="${TK}" stroke-width="9" transform="rotate(-24,475,1505)"/><path d="M420,1490 L540,1440" stroke="${TK}" stroke-width="5" transform="rotate(0)"/>`,
    faceTop: (id, f) => `<path d="M440,800 L585,800 L585,890 Q512,910 440,890Z M625,800 L770,800 L770,890 Q698,910 625,890Z" fill="#dff0ff" fill-opacity=".18" stroke="#1b1720" stroke-width="16" stroke-linejoin="round"/><path d="M585,820 Q605,806 625,820" stroke="#1b1720" stroke-width="14" fill="none"/><path d="M440,806 L250,780 M770,806 L940,780" stroke="#1b1720" stroke-width="12"/><path d="M460,818 L500,818" stroke="#fff" stroke-width="7" opacity=".7"/>`,
    hat: id => `<path d="M232,720 C220,520 380,410 590,410 C800,410 960,520 948,720 C900,620 820,570 700,560 C640,600 560,600 500,560 C380,570 290,630 232,720Z" fill="#f0c860" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      ${[[320, 600, 520, 440], [460, 560, 600, 430], [680, 560, 760, 450], [820, 610, 880, 520]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} Q${(x1 + x2) / 2 + 20},${(y1 + y2) / 2 - 20} ${x2},${y2}" stroke="#c8962a" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}
      <circle cx="590" cy="330" r="110" fill="#f0c860" stroke="${TK}" stroke-width="12"/><path d="M520,300 C560,260 640,260 670,320" stroke="#c8962a" stroke-width="10" fill="none"/><path d="M500,390 C560,420 620,420 680,390" stroke="#ff3fa0" stroke-width="26" fill="none" stroke-linecap="round"/>
      ${[-1, 1].map(sd => `<g transform="translate(${590 + sd * 365},960)"><path d="M0,-22 L6,-6 L22,-6 L9,4 L14,22 L0,12 L-14,22 L-9,4 L-22,-6 L-6,-6Z" fill="#ffd34a" stroke="${TK}" stroke-width="4"/></g>`).join('')}`
  }, o));
}

// ---------- EL DUEÑO DE LA COMPETENCIA: tonel, traje morado brillante con solapas negras, camisa amarilla abierta, cadena de oro gorda,
// pelo engominado hacia atrás con brillo, bigote fino, anillos, puro en la mano ----------
function rival2d(o = {}) {
  return pjT(Object.assign({
    id: 'rv', bodyPath: BODY_MILL, bodyEdge: 'M880,1350 C910,1560 880,1800 600,1872', shadowW: 330,
    top: ['#a868e0', '#8a4ac8', '#6a2ea0', '#3e1460', '#c890f4', '#e8c8ff'], hatC: ['#000', '#000', '#000', '#000'], brow: '#141010',
    legs: legsAt(510, 680, 1860),
    armL: 'M322,1260 C260,1400 240,1540 240,1660', handL: [240, 1670], armR: 'M868,1260 C930,1330 960,1260 950,1160', handR: [950, 1150],
    bodyIn: id => `<path d="M500,1080 C540,1280 560,1500 560,1870 L630,1870 C630,1500 650,1280 690,1080Z" fill="#ffc928"/><path d="M520,1090 C555,1280 572,1500 575,1860" stroke="#e0a020" stroke-width="8" fill="none"/>
      <path d="M470,1076 C520,1250 540,1400 560,1560 C500,1500 430,1400 340,1260 C380,1180 420,1110 470,1076Z M720,1076 C670,1250 650,1400 630,1560 C690,1500 760,1400 850,1260 C810,1180 770,1110 720,1076Z" fill="#1b1720" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M480,1110 C510,1250 530,1380 548,1500 M710,1110 C680,1250 660,1380 642,1500" stroke="#6a6676" stroke-width="7" fill="none" opacity=".8"/>
      ${[1640, 1740].map(y => `<circle cx="660" cy="${y}" r="14" fill="#1b1720" stroke="#ffc928" stroke-width="5"/>`).join('')}
      <path d="M720,1400 L800,1390 L800,1420 L720,1428Z" fill="#ff3fa0" stroke="${TK}" stroke-width="5"/>`,
    front: id => `<path d="M520,1100 C540,1220 650,1220 670,1100" stroke="#b8862a" stroke-width="30" fill="none"/><path d="M520,1100 C540,1220 650,1220 670,1100" stroke="#ffd34a" stroke-width="18" fill="none" stroke-dasharray="18 8"/>
      <circle cx="595" cy="1215" r="30" fill="#ffd34a" stroke="${TK}" stroke-width="7"/><path d="M582,1200 L608,1200 L595,1232Z" fill="#b8862a"/>
      <g transform="translate(950,1150)"><rect x="-10" y="-90" width="26" height="110" rx="10" fill="#7a4a22" stroke="${TK}" stroke-width="6" transform="rotate(30)"/><rect x="-12" y="-30" width="30" height="16" fill="#ffd34a" stroke="${TK}" stroke-width="4" transform="rotate(30)"/>
        <circle cx="52" cy="-80" r="12" fill="#ff7a3a"/><circle cx="52" cy="-80" r="6" fill="#ffe080"/>${[[70, -130, 18], [96, -190, 26], [80, -260, 34]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e8e4e0" opacity=".5"/>`).join('')}</g>
      <circle cx="950" cy="1150" r="46" fill="#261717"/><circle cx="975" cy="1130" r="12" fill="#ffd34a" stroke="${TK}" stroke-width="4"/><circle cx="240" cy="1670" r="44" fill="#261717"/><circle cx="262" cy="1650" r="12" fill="#ffd34a" stroke="${TK}" stroke-width="4"/><circle cx="262" cy="1650" r="5" fill="#ff3fa0"/>`,
    faceTop: (id, f) => mustache(id, MUST.fino, '#141010', '#4a3a3a'),
    hat: id => `<path d="M226,760 C206,560 360,410 590,404 C820,410 974,560 954,760 C920,640 860,580 760,560 C660,540 520,540 420,560 C320,580 260,640 226,760Z" fill="#141010" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      ${[[300, 660, 560, 440], [380, 600, 660, 430], [480, 560, 780, 450], [600, 556, 880, 520]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} C${(x1 + x2) / 2},${y1 - 90} ${x2 - 40},${y2} ${x2},${y2}" stroke="#4a4248" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M340,520 C420,460 520,440 610,440" stroke="#9a90a8" stroke-width="18" fill="none" opacity=".85" stroke-linecap="round"/><ellipse cx="470" cy="470" rx="34" ry="12" fill="#fff" opacity=".8" transform="rotate(-20,470,470)"/>`
  }, o));
}

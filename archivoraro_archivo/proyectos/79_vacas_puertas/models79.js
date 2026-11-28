// 79 · bocetos — personajes NUEVOS estilo .99 (pjT) + la VACA (dibujo propio con el mismo acabado: contorno grueso abajo a la derecha, luz arriba a la izquierda).
// Siluetas distintas: vaca = barril ancho de frente · granjero = tonel bajito · abuelo = palo alto un poco encorvado · cuidadora = pera fina.

// ---------------- LA VACA (frisona, de frente). Opciones: vr (gafas), face ('feliz'|'serio'|'sorpresa'), seed (manchas), tag (crotal), parda (color), chew (0–1), look [dx,dy], blink
function vaca2d(o = {}) {
  const id = o.id || ('vk' + (o.seed || 0)), f = o.face || 'serio', sd = o.seed || 0, K = TK;
  const rnd = (i, k) => { const x = Math.sin((i + sd * 13.1) * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const W0 = o.parda ? ['#c89a6a', '#a8784a', '#80542e', '#4a2c14'] : ['#ffffff', '#f4f0ea', '#d8d2ca', '#a8a098'];
  const SP = o.parda ? '#5a3418' : '#1e1a1c';
  const chew = o.chew || 0, lk = o.look || [0, 0], blk = (o.blink || 0) > .5;
  const blob = (cx, cy, r, i) => { let d = ''; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, rr = r * (.7 + .5 * rnd(i, k)); d += (k ? 'L' : 'M') + (cx + Math.cos(a) * rr * 1.2).toFixed(0) + ',' + (cy + Math.sin(a) * rr).toFixed(0); } return d + 'Z'; };
  const BODY = 'M160,1300 C160,1080 340,1000 595,1000 C850,1000 1030,1080 1030,1300 C1030,1520 900,1650 595,1650 C290,1650 160,1520 160,1300Z';
  const HEAD = 'M595,560 C722,560 802,612 808,724 C814,862 772,1000 762,1110 C750,1210 700,1260 595,1262 C490,1260 440,1210 428,1110 C418,1000 376,862 382,724 C388,612 468,560 595,560Z';
  const leg = (x, y0, y1, w, back, i) => { const c = back ? W0[2] : W0[1];
    return `<path d="M${x - w / 2},${y0} C${x - w / 2 - 8},${(y0 + y1) / 2} ${x - w / 2 + 6},${y1 - 120} ${x - w / 2 + 8},${y1 - 60} L${x + w / 2 - 8},${y1 - 60} C${x + w / 2 - 6},${y1 - 120} ${x + w / 2 + 8},${(y0 + y1) / 2} ${x + w / 2},${y0}Z" fill="${c}" stroke="${K}" stroke-width="12" stroke-linejoin="round"/>
      ${!back && rnd(i, 3) > .45 ? `<path d="M${x - w / 2 + 4},${y0 + 40} C${x},${y0 + 20} ${x + w / 2 - 4},${y0 + 60} ${x + w / 2 - 6},${y0 + 160} C${x},${y0 + 190} ${x - w / 2 + 6},${y0 + 150} ${x - w / 2 + 4},${y0 + 40}Z" fill="${SP}"/>` : ''}
      <path d="M${x - w / 2 + 2},${y1 - 64} L${x + w / 2 - 2},${y1 - 64} L${x + w / 2 + 4},${y1 - 4} L${x - w / 2 - 4},${y1 - 4}Z" fill="#2a1e1a" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><path d="M${x},${y1 - 60} L${x},${y1 - 6}" stroke="#4a3a34" stroke-width="6"/>
      <path d="M${x - w / 2 + 12},${y0 + 30} C${x - w / 2 + 6},${y0 + 150} ${x - w / 2 + 12},${y1 - 200} ${x - w / 2 + 16},${y1 - 90}" stroke="#fff" stroke-width="9" fill="none" opacity="${back ? .15 : .55}" stroke-linecap="round"/>`; };
  const spots = [...Array(7)].map((_, i) => `<path d="${blob(240 + rnd(i, 1) * 720, 1060 + rnd(i, 2) * 520, 70 + rnd(i, 4) * 90, i)}" fill="${SP}"/>`).join('');
  const eyes = () => { if (o.vr) return '';
    if (f === 'feliz') return `<path d="M470,846 Q512,800 556,846 M636,846 Q678,800 722,846" stroke="${K}" stroke-width="20" fill="none" stroke-linecap="round"/>`;
    const e = (cx, cy, s) => `<ellipse cx="${cx}" cy="${cy}" rx="46" ry="${f === 'sorpresa' ? 50 : 40}" fill="#fbf6ee" stroke="${K}" stroke-width="10"/>${blk ? `<path d="M${cx - 48},${cy} L${cx + 48},${cy}" stroke="${K}" stroke-width="16" stroke-linecap="round"/>` : `<circle cx="${cx + lk[0]}" cy="${cy + 6 + lk[1]}" r="26" fill="#2a1a14"/><circle cx="${cx + lk[0] - 9}" cy="${cy - 4 + lk[1]}" r="8" fill="#fff"/>`}
      ${f === 'sorpresa' ? '' : `<path d="M${cx - 52},${cy - 10} Q${cx},${cy - 46} ${cx + 52},${cy - 10}" stroke="${K}" stroke-width="14" fill="none" stroke-linecap="round"/>`}<path d="M${cx + s * 40},${cy - 22} l${s * 26},-22 M${cx + s * 48},${cy - 8} l${s * 30},-8" stroke="${K}" stroke-width="8" stroke-linecap="round"/>`;
    return e(510, 836, -1) + e(680, 836, 1); };
  const vr = () => !o.vr ? '' : `
    <path d="M330,770 C300,740 300,700 340,690 L380,700 M860,770 C890,740 890,700 850,690 L810,700" stroke="#1a1a22" stroke-width="34" fill="none" stroke-linecap="round"/>
    <rect x="368" y="716" width="454" height="208" rx="62" fill="url(#${id}VR)" stroke="${K}" stroke-width="16"/>
    <rect x="404" y="748" width="382" height="140" rx="40" fill="url(#${id}VRs)" stroke="#0a0a10" stroke-width="10"/>
    <g clip-path="url(#${id}VRc)"><path d="M404,846 C470,812 560,830 640,812 C700,800 760,816 786,830 L786,888 L404,888Z" fill="#6ac04a"/><path d="M404,866 C500,850 620,862 786,850 L786,888 L404,888Z" fill="#4a9a30"/>
      ${[[470, 862], [540, 872], [620, 858], [700, 870], [740, 856]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7" fill="${['#fff', '#ffd84a', '#ff7ab8'][i % 3]}"/>`).join('')}<circle cx="720" cy="782" r="18" fill="#fff6c8"/><path d="M440,790 C470,770 520,770 540,790Z" fill="#fff" opacity=".9"/></g>
    <path d="M420,760 C470,744 560,742 600,748" stroke="#fff" stroke-width="10" fill="none" opacity=".55" stroke-linecap="round"/>
    <circle cx="780" cy="740" r="9" fill="#5fe08a"/><circle cx="780" cy="740" r="18" fill="#5fe08a" opacity=".25"/>
    <rect x="560" y="898" width="70" height="16" rx="8" fill="#3a3a48"/>`;
  const mouth = f === 'feliz' ? `<path d="M520,${1318 + chew * 10} C560,${1362 + chew * 14} 630,${1362 + chew * 14} 670,${1318 + chew * 10}" stroke="${K}" stroke-width="14" fill="none" stroke-linecap="round"/>`
    : f === 'sorpresa' ? `<ellipse cx="595" cy="1336" rx="32" ry="26" fill="#5a1c20" stroke="${K}" stroke-width="10"/>` : `<path d="M540,${1326 + chew * 12} Q595,${1316 + chew * 20} 650,${1326 + chew * 12}" stroke="${K}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  const svg = `<defs>
    <radialGradient id="${id}B" cx=".3" cy=".28" r=".9"><stop offset="0" stop-color="${W0[0]}"/><stop offset=".45" stop-color="${W0[1]}"/><stop offset=".8" stop-color="${W0[2]}"/><stop offset="1" stop-color="${W0[3]}"/></radialGradient>
    <radialGradient id="${id}Hd" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="${W0[0]}"/><stop offset=".55" stop-color="${W0[1]}"/><stop offset="1" stop-color="${W0[2]}"/></radialGradient>
    <radialGradient id="${id}Mz" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#f6d8c4"/><stop offset=".7" stop-color="#e4b49a"/><stop offset="1" stop-color="#c8907a"/></radialGradient>
    <linearGradient id="${id}VR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4a5a"/><stop offset=".5" stop-color="#2a2a36"/><stop offset="1" stop-color="#14141c"/></linearGradient>
    <linearGradient id="${id}VRs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ac8ff"/><stop offset="1" stop-color="#d8f0ff"/></linearGradient>
    <linearGradient id="${id}Hn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e8dcc0"/><stop offset="1" stop-color="#a8987a"/></linearGradient>
    <radialGradient id="${id}Bell" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe89a"/><stop offset=".5" stop-color="#d8a83a"/><stop offset="1" stop-color="#8a6418"/></radialGradient>
    <clipPath id="${id}Bc"><path d="${BODY}"/></clipPath><clipPath id="${id}Hc"><path d="${HEAD}"/></clipPath><clipPath id="${id}VRc"><rect x="404" y="748" width="382" height="140" rx="40"/></clipPath>
    <filter id="${id}So" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter><filter id="${id}S1"><feGaussianBlur stdDeviation="3"/></filter></defs>
  ${leg(330, 1450, 2040, 92, 1, 0)}${leg(860, 1450, 2040, 92, 1, 1)}
  <path d="M1010,1270 C1060,1360 1070,1520 1046,1700" stroke="${K}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M1010,1270 C1060,1360 1070,1520 1046,1700" stroke="${W0[1]}" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M1046,1690 C1020,1720 1020,1790 1046,1820 C1072,1790 1078,1730 1046,1690Z" fill="${SP}" stroke="${K}" stroke-width="9"/>
  <path d="${BODY}" fill="url(#${id}B)"/><g clip-path="url(#${id}Bc)">${spots}<path d="${BODY}" fill="none" stroke="#000" stroke-width="120" opacity=".22" filter="url(#${id}So)" transform="translate(40,30)"/>
    <ellipse cx="380" cy="1120" rx="150" ry="70" fill="#fff" opacity=".22" filter="url(#${id}So)"/></g><path d="${BODY}" fill="none" stroke="${K}" stroke-width="18"/>
  <ellipse cx="595" cy="1690" rx="120" ry="58" fill="url(#${id}Mz)" stroke="${K}" stroke-width="10"/>${[540, 650].map(x => `<path d="M${x},1730 L${x + 4},1772" stroke="${K}" stroke-width="22" stroke-linecap="round"/><path d="M${x},1730 L${x + 4},1772" stroke="#e4b49a" stroke-width="10" stroke-linecap="round"/>`).join('')}
  ${leg(450, 1560, 2098, 100, 0, 2)}${leg(740, 1560, 2098, 100, 0, 3)}
  <!-- cuernos y orejas (con crotal amarillo) -->
  <path d="M470,620 C420,600 380,560 372,490 C400,520 440,540 500,560Z M720,620 C770,600 810,560 818,490 C790,520 750,540 690,560Z" fill="url(#${id}Hn)" stroke="${K}" stroke-width="12" stroke-linejoin="round"/>
  <path d="M396,700 C320,650 220,650 180,700 C230,760 320,780 400,760Z" fill="url(#${id}Hd)" stroke="${K}" stroke-width="14" stroke-linejoin="round"/><path d="M380,712 C320,690 250,690 220,708 C260,740 320,748 380,740Z" fill="#e4b49a" opacity=".85"/>
  <path d="M794,700 C870,650 970,650 1010,700 C960,760 870,780 790,760Z" fill="url(#${id}Hd)" stroke="${K}" stroke-width="14" stroke-linejoin="round"/><path d="M810,712 C870,690 940,690 970,708 C930,740 870,748 810,740Z" fill="#e4b49a" opacity=".85"/>
  <g transform="translate(905,760) rotate(8)"><rect x="-34" y="-8" width="68" height="70" rx="12" fill="#f2c230" stroke="${K}" stroke-width="7"/><text x="0" y="42" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="${K}">${o.tag || 27}</text></g>
  <!-- collar y cencerro -->
  <path d="M440,1250 C480,1320 710,1320 750,1250" stroke="${K}" stroke-width="46" fill="none" stroke-linecap="round"/><path d="M440,1250 C480,1320 710,1320 750,1250" stroke="#8a4a24" stroke-width="30" fill="none" stroke-linecap="round"/>
  <path d="M552,1300 L638,1300 L656,1430 C630,1446 560,1446 534,1430Z" fill="url(#${id}Bell)" stroke="${K}" stroke-width="11" stroke-linejoin="round"/><circle cx="595" cy="1440" r="16" fill="#5a3a10" stroke="${K}" stroke-width="6"/><path d="M566,1320 L558,1410" stroke="#fff8d0" stroke-width="9" opacity=".7" stroke-linecap="round"/>
  <!-- cabeza -->
  <path d="${HEAD}" fill="url(#${id}Hd)"/><g clip-path="url(#${id}Hc)">
    <path d="${blob(470 + rnd(9, 1) * 40, 820, 120, 9)}" fill="${SP}"/><path d="M560,560 C520,640 530,720 595,760 C660,720 670,640 630,560Z" fill="${W0[0]}" opacity="${o.parda ? 0 : 1}"/>
    <path d="${HEAD}" fill="none" stroke="#000" stroke-width="90" opacity=".2" filter="url(#${id}So)" transform="translate(40,40)"/>
    <path d="M420,700 C410,820 430,960 470,1080" stroke="#fff" stroke-width="16" fill="none" opacity=".7" stroke-linecap="round" filter="url(#${id}S1)"/></g>
  <path d="${HEAD}" fill="none" stroke="${K}" stroke-width="18"/>
  ${[...Array(5)].map((_, i) => `<circle cx="${545 + i * 25}" cy="${590 - (i % 2) * 18}" r="${28 - (i % 2) * 4}" fill="${o.parda ? '#a8784a' : '#f4f0ea'}" stroke="${K}" stroke-width="8"/>`).join('')}
  ${eyes()}${vr()}
  <!-- hocico -->
  <ellipse cx="595" cy="${1218 + chew * 6}" rx="196" ry="118" fill="url(#${id}Mz)" stroke="${K}" stroke-width="16"/>
  <ellipse cx="528" cy="${1214 + chew * 6}" rx="30" ry="22" fill="#5a2a24" stroke="${K}" stroke-width="7" transform="rotate(-18,528,1214)"/><ellipse cx="662" cy="${1214 + chew * 6}" rx="30" ry="22" fill="#5a2a24" stroke="${K}" stroke-width="7" transform="rotate(18,662,1214)"/>
  <path d="M470,1160 C510,1130 560,1124 590,1130" stroke="#fff" stroke-width="12" fill="none" opacity=".6" stroke-linecap="round"/>
  ${mouth}`;
  return `<ellipse cx="595" cy="2094" rx="460" ry="46" fill="#140a06" opacity=".45" filter="url(#${id}So)"/>` + pjOutline(id, svg);
}

// ---------------- IZZET, el granjero turco: tonel bajito, gorra de visera de tweed, bigote negro grande, chaleco acolchado verde oliva sobre camisa de cuadros, botas de goma
const IZ_BODY = 'M320,1200 C334,1096 460,1068 595,1068 C730,1068 856,1096 870,1200 C930,1340 940,1530 900,1670 C860,1790 740,1830 595,1830 C450,1830 330,1790 290,1670 C250,1530 260,1340 320,1200Z';
function granjero2d(o = {}) {
  const hold = o.hold || null;
  return pjT(Object.assign({
    id: 'iz', bodyPath: IZ_BODY, bodyEdge: 'M900,1420 C930,1600 860,1780 600,1834', shadowW: 330,
    top: ['#8a9a5a', '#6a7a3e', '#4a5a28', '#2a3414', '#b0c080', '#d8e4b0'], hatC: ['#8a8478', '#6a645a', '#4a463e', '#2a2622'], brow: '#1a1210', armW: 30,
    legs: legsAt(505, 685, 1820),
    armL: 'M330,1280 C270,1410 240,1550 236,1680', handL: [236, 1690],
    armR: hold ? 'M860,1280 C920,1360 960,1420 980,1480' : 'M860,1280 C920,1410 950,1550 954,1680', handR: hold ? [990, 1486] : [954, 1690],
    bodyIn: id => `
      <!-- camisa de cuadros en el pico del chaleco -->
      <path d="M500,1080 L690,1080 L640,1400 L595,1440 L550,1400Z" fill="#b8342c"/>
      ${[1110, 1170, 1230, 1290, 1350].map(y => `<path d="M490,${y} L700,${y}" stroke="#2a1414" stroke-width="16" opacity=".75"/>`).join('')}${[530, 580, 630, 670].map(x => `<path d="M${x},1080 L${x},1420" stroke="#2a1414" stroke-width="14" opacity=".6"/>`).join('')}
      <path d="M500,1080 L690,1080 L640,1400 L595,1440 L550,1400Z" fill="none" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <!-- acolchado del chaleco (rombos), bolsillos con broches, cremallera -->
      ${[...Array(9)].map((_, i) => `<path d="M${180 + i * 110},1060 L${-160 + i * 110 + 640},1860" stroke="#3a4a1c" stroke-width="6" opacity=".55"/><path d="M${180 + i * 110},1860 L${-160 + i * 110 + 640},1060" stroke="#3a4a1c" stroke-width="6" opacity=".55"/>`).join('')}
      <path d="M595,1440 L595,1830" stroke="${TK}" stroke-width="10"/><path d="M603,1450 L603,1820" stroke="#c8c8b8" stroke-width="5" stroke-dasharray="10 8"/>
      ${[[420, 1560], [700, 1560]].map(([x, y]) => `<path d="M${x},${y} L${x + 150},${y} L${x + 146},${y + 130} L${x + 4},${y + 130}Z" fill="#5a6a30" stroke="${TK}" stroke-width="8"/><path d="M${x},${y} L${x + 150},${y} L${x + 150},${y + 34} L${x},${y + 34}Z" fill="#6a7a3e" stroke="${TK}" stroke-width="7"/><circle cx="${x + 75}" cy="${y + 18}" r="10" fill="#c8c8b8" stroke="${TK}" stroke-width="4"/>`).join('')}
      <path d="M270,1700 C450,1760 740,1760 920,1700" stroke="#2a3414" stroke-width="14" fill="none" opacity=".6"/>`,
    front: id => `
      <!-- cuello de la camisa -->
      <path d="M510,1078 L595,1150 L520,1180Z M680,1078 L595,1150 L670,1180Z" fill="#c8443a" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <!-- bolígrafo y libreta asomando del bolsillo -->
      <path d="M738,1530 L744,1580" stroke="#2c5fa8" stroke-width="14" stroke-linecap="round"/><rect x="760" y="1508" width="62" height="70" rx="6" fill="#f4ecd8" stroke="${TK}" stroke-width="6" transform="rotate(8,790,1540)"/>
      ${hold === 'vr' ? `<g transform="translate(1040,1470) rotate(-10)"><path d="M-130,-10 C-170,-60 -160,-90 -120,-100" stroke="#1a1a22" stroke-width="22" fill="none" stroke-linecap="round"/>
        <rect x="-120" y="-70" width="240" height="120" rx="40" fill="#2a2a36" stroke="${TK}" stroke-width="12"/><rect x="-96" y="-48" width="192" height="76" rx="24" fill="#7ac8ff" stroke="#0a0a10" stroke-width="7"/><path d="M-86,10 C-40,-6 40,0 96,-10 L96,28 L-96,28Z" fill="#6ac04a"/><path d="M-80,-36 C-40,-46 0,-46 20,-42" stroke="#fff" stroke-width="8" opacity=".6" fill="none" stroke-linecap="round"/></g>
        <circle cx="990" cy="1486" r="50" fill="#261717" stroke="${TK}" stroke-width="6"/><circle cx="974" cy="1468" r="13" fill="#5a4440" opacity=".5"/>` : ''}
      ${hold === 'cubo' ? `<path d="M884,1560 C900,1480 1080,1480 1096,1560" stroke="#7a828c" stroke-width="12" fill="none"/><path d="M870,1560 L1110,1560 L1090,1760 L890,1760Z" fill="#c9ced6" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/><ellipse cx="990" cy="1560" rx="120" ry="24" fill="#fbf8f0" stroke="${TK}" stroke-width="9"/><path d="M900,1590 L912,1740" stroke="#fff" stroke-width="12" opacity=".7"/>
        <circle cx="990" cy="1486" r="50" fill="#261717" stroke="${TK}" stroke-width="6"/>` : ''}`,
    under: id => `${[[499, 2100], [691, 2100]].map(([x, y]) => `<path d="M${x - 46},${y - 170} L${x + 46},${y - 170} L${x + 50},${y - 30} L${x + 80},${y - 22} C${x + 92},${y - 4} ${x + 70},${y + 4} ${x + 40},${y} L${x - 52},${y} Z" fill="#2f5a3a" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/><path d="M${x - 46},${y - 150} L${x + 46},${y - 150}" stroke="#4a7a52" stroke-width="10"/><path d="M${x - 30},${y - 140} L${x - 32},${y - 40}" stroke="#7aa882" stroke-width="8" opacity=".6"/><path d="M${x - 52},${y - 8} L${x + 70},${y - 8}" stroke="#14241a" stroke-width="12"/>`).join('')}`,
    headIn: id => `${[...Array(80)].map((_, i) => { const a = (i * 137.5) % 360 * Math.PI / 180, r = 60 + ((i * 53) % 220), x = 590 + Math.cos(a) * r * 1.2, y = 1030 + Math.sin(a) * r * .38; return y > 930 && y < 1140 ? `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5" fill="#3a2e30" opacity=".45"/>` : ''; }).join('')}
      <path d="M330,860 C320,900 330,940 350,960 M850,860 C860,900 850,940 830,960" stroke="#c89c8c" stroke-width="8" fill="none" opacity=".7"/>`,
    faceTop: (id, f) => mustache(id, MUST.morsa, '#1e1612', '#4a3a30'),
    hat: id => `<path d="M228,740 C226,690 246,660 290,650 C286,700 286,760 296,820 L246,830Z M952,740 C954,690 934,660 890,650 C894,700 894,760 884,820 L934,830Z" fill="#8a8478" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M230,640 C220,470 380,380 590,380 C800,380 950,460 956,620 C960,660 940,672 900,660 C760,620 420,620 280,660 C246,670 230,662 230,640Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M270,650 C400,606 780,606 910,650 C980,690 990,730 930,744 C760,690 420,690 250,744 C200,730 210,690 270,650Z" fill="#5a5448" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      ${[...Array(22)].map((_, i) => `<path d="M${300 + i * 28},${430 + (i % 3) * 50} l18,18 M${300 + i * 28},${470 + (i % 2) * 70} l18,-16" stroke="#4a463e" stroke-width="5" opacity=".55"/>`).join('')}
      <circle cx="590" cy="392" r="18" fill="#6a645a" stroke="${TK}" stroke-width="6"/><path d="M330,520 C400,440 500,412 600,410" stroke="#c8c2b4" stroke-width="18" fill="none" opacity=".6" stroke-linecap="round" filter="url(#${id}S1)"/>`
  }, o));
}

// ---------------- DON ERNESTO, 86 años, con demencia: alto y delgado, un poco encorvado, calvo con pelo blanco a los lados, gafas grandes, chaqueta de punto beige, zapatillas de cuadros.
//  o.coat → abrigo gris y sombrero (se viste «para volver a casa»), o.maleta → maletín en la mano izquierda
const ER_BODY = 'M380,1200 C392,1110 480,1084 595,1084 C710,1084 798,1110 810,1200 C830,1400 838,1600 830,1740 C820,1830 740,1866 595,1866 C450,1866 370,1830 360,1740 C352,1600 360,1400 380,1200Z';
function abuelo2d(o = {}) {
  const coat = !!o.coat;
  return pjT(Object.assign({
    id: coat ? 'erc' : 'er', bald: 1, bodyPath: ER_BODY, bodyEdge: 'M820,1400 C830,1620 800,1820 600,1868', shadowW: 280, lean: o.lean ?? 3,
    top: coat ? ['#9aa0aa', '#7a808a', '#5a606a', '#30343a', '#c0c6d0', '#e0e6ee'] : ['#e8d0a0', '#d0b47a', '#a8884e', '#6a5228', '#f4e4c0', '#fff4dc'],
    hatC: ['#4a4038', '#3a3028', '#2a221c', '#140e0a'], brow: '#e8e4dc', armW: 24,
    legs: legsAt(530, 660, 1850),
    armL: 'M396,1270 C350,1400 328,1540 324,1680', handL: [324, 1690], armR: 'M794,1270 C840,1400 862,1540 866,1680', handR: [866, 1690],
    bodyIn: id => coat ? `
      <path d="M520,1100 L595,1300 L670,1100Z" fill="#d0b47a"/><path d="M530,1100 L595,1270 L660,1100" stroke="#a8884e" stroke-width="6" fill="none"/>
      <path d="M470,1094 C500,1200 540,1290 595,1340 C520,1330 440,1260 400,1160 C420,1120 440,1100 470,1094Z M720,1094 C690,1200 650,1290 595,1340 C670,1330 750,1260 790,1160 C770,1120 750,1100 720,1094Z" fill="#6a707a" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      ${[1430, 1570, 1710].map(y => `<circle cx="650" cy="${y}" r="20" fill="#2a2e34" stroke="${TK}" stroke-width="6"/><circle cx="645" cy="${y - 6}" r="6" fill="#8a909a"/>`).join('')}<path d="M595,1340 L620,1866" stroke="${TK}" stroke-width="9"/>
      ${[[400, 1600], [690, 1600]].map(([x, y]) => `<path d="M${x},${y} L${x + 110},${y - 6}" stroke="${TK}" stroke-width="9"/>`).join('')}` : `
      <path d="M530,1096 L595,1200 L660,1096Z" fill="#a8c8e8"/><path d="M520,1094 L560,1170 L595,1120 L630,1170 L670,1094" fill="#d8e8f8" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M520,1094 C540,1250 570,1400 595,1500 C620,1400 650,1250 670,1094" fill="none" stroke="#a8884e" stroke-width="12"/>
      <path d="M595,1500 L595,1866" stroke="${TK}" stroke-width="9"/>${[1560, 1660, 1760].map(y => `<circle cx="618" cy="${y}" r="15" fill="#6a4a2a" stroke="${TK}" stroke-width="5"/>`).join('')}
      ${[...Array(9)].map((_, i) => `<path d="M${400 + i * 46},1200 l0,640" stroke="#b8985e" stroke-width="5" opacity=".5" stroke-dasharray="14 10"/>`).join('')}
      ${[[400, 1600], [650, 1600]].map(([x, y]) => `<path d="M${x},${y} L${x + 140},${y} L${x + 136},${y + 120} L${x + 4},${y + 120}Z" fill="#c8a86e" stroke="${TK}" stroke-width="8"/>`).join('')}
      <path d="M690,1610 C700,1580 720,1570 740,1580" stroke="#f4f0e8" stroke-width="10" fill="none"/>`,
    front: id => `${o.maleta ? `<g transform="translate(324,1760)"><path d="M-40,-80 C-40,-120 40,-120 40,-80" stroke="#5a3a1a" stroke-width="16" fill="none"/><rect x="-130" y="-80" width="260" height="190" rx="22" fill="#8a5a2a" stroke="${TK}" stroke-width="12"/>
        <path d="M-130,-30 L130,-30" stroke="#5a3a1a" stroke-width="10"/>${[-80, 80].map(x => `<rect x="${x - 18}" y="-46" width="36" height="30" rx="6" fill="#d8b040" stroke="${TK}" stroke-width="5"/>`).join('')}<path d="M-110,-60 L-110,90" stroke="#b8884e" stroke-width="10" opacity=".6"/></g>
        <circle cx="324" cy="1690" r="48" fill="#261717" stroke="${TK}" stroke-width="6"/>` : ''}
      ${o.baston ? `<path d="M866,1690 L900,2096" stroke="#6a4426" stroke-width="22" stroke-linecap="round"/><path d="M866,1690 C860,1620 920,1600 950,1650" stroke="#6a4426" stroke-width="22" fill="none" stroke-linecap="round"/><circle cx="866" cy="1690" r="48" fill="#261717" stroke="${TK}" stroke-width="6"/>` : ''}`,
    under: id => `${[[524, 2100], [666, 2100]].map(([x, y], i) => `<path d="M${x - 70 + i * 20},${y} C${x - 70 + i * 20},${y - 60} ${x - 30},${y - 70} ${x + 10},${y - 64} C${x + 60},${y - 60} ${x + 80 - i * 10},${y - 30} ${x + 80 - i * 10},${y} Z" fill="#8a2a2a" stroke="${TK}" stroke-width="9"/><path d="M${x - 50},${y - 40} L${x + 60},${y - 40} M${x - 20},${y - 62} L${x - 20},${y - 4} M${x + 20},${y - 62} L${x + 20},${y - 4}" stroke="#d8b040" stroke-width="5" opacity=".7"/>`).join('')}`,
    headIn: id => `<path d="M450,560 C520,540 660,540 730,560 M470,610 C540,594 640,594 710,610" stroke="#c89c8c" stroke-width="8" fill="none" opacity=".75"/>
      <path d="M380,820 l-30,-14 M380,850 l-34,4 M810,820 l30,-14 M810,850 l34,4" stroke="#c89c8c" stroke-width="7" opacity=".8" stroke-linecap="round"/>
      <path d="M470,960 C500,1000 520,1010 540,1010 M720,960 C690,1000 670,1010 650,1010" stroke="#c89c8c" stroke-width="8" fill="none" opacity=".7"/>
      <path d="M330,520 C400,440 500,412 600,412" stroke="#fffdf2" stroke-width="28" fill="none" opacity=".8" stroke-linecap="round" filter="url(#${id}S1)"/><ellipse cx="430" cy="500" rx="40" ry="18" fill="#fff" opacity=".7" transform="rotate(-30,430,500)"/>
      ${[[540, 420], [590, 412], [640, 418]].map(([x, y]) => `<path d="M${x},${y + 10} C${x - 10},${y - 30} ${x + 20},${y - 50} ${x + 30},${y - 30}" stroke="#f4f2ec" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}`,
    faceTop: (id, f) => mustache(id, MUST.fino, '#ece8e0', '#ffffff') + glasses('#5a4a3a', 84),
    hat: id => (coat ? `<g transform="rotate(-3,590,470)"><path d="M170,540 C300,500 880,500 1010,540 C1030,580 990,600 950,598 C760,576 420,576 230,598 C190,600 150,580 170,540Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
        <path d="M330,540 C330,400 380,300 590,290 C800,300 850,400 850,540Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/><path d="M560,300 C580,340 600,340 620,300" stroke="${TK}" stroke-width="10" fill="none"/>
        <path d="M336,480 L846,480 L850,540 L330,540Z" fill="#1a1410" stroke="${TK}" stroke-width="8"/><path d="M390,360 C380,420 378,460 380,476" stroke="#8a7a6a" stroke-width="14" fill="none" opacity=".7" stroke-linecap="round"/></g>` : '') +
      `<path d="M226,740 C220,660 250,600 300,592 C290,640 296,700 300,790 C280,800 250,800 232,790Z M954,740 C960,660 930,600 880,592 C890,640 884,700 880,790 C900,800 930,800 948,790Z" fill="#f4f2ec" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M250,650 C240,700 250,740 262,770 M930,650 C940,700 930,740 918,770" stroke="#c8c4bc" stroke-width="8" fill="none"/>
      <ellipse cx="212" cy="860" rx="44" ry="84" fill="#f2dcb8" stroke="${TK}" stroke-width="13"/><path d="M220,810 C200,840 200,890 222,910" stroke="#c89c7c" stroke-width="9" fill="none"/>
      <ellipse cx="968" cy="860" rx="44" ry="84" fill="#f2dcb8" stroke="${TK}" stroke-width="13"/><path d="M960,810 C980,840 980,890 958,910" stroke="#c89c7c" stroke-width="9" fill="none"/>`
  }, o));
}

// ---------------- MARTA, la cuidadora: pera fina, pijama sanitario verde azulado, moño castaño, cordón con acreditación, reloj de enfermera, zapatillas blancas
const MA_BODY = 'M430,1200 C440,1112 512,1088 595,1088 C678,1088 750,1112 760,1200 C780,1360 800,1540 792,1700 C784,1800 700,1844 595,1844 C490,1844 406,1800 398,1700 C390,1540 410,1360 430,1200Z';
function cuidadora2d(o = {}) {
  return pjT(Object.assign({
    id: 'ma', bodyPath: MA_BODY, bodyEdge: 'M780,1380 C796,1580 770,1810 600,1846', shadowW: 260,
    top: ['#7ae0d8', '#3cb8ae', '#23867e', '#0f504a', '#a8f0ea', '#d8fff8'], hatC: ['#8a5a3a', '#6a4024', '#4a2a14', '#2a1408'], lashes: 1, brow: '#4a2a14',
    legs: legsAt(530, 660, 1840),
    armL: 'M440,1270 C390,1400 370,1540 368,1670', handL: [368, 1680], armR: 'M750,1270 C800,1400 820,1540 822,1670', handR: [822, 1680],
    bodyIn: id => `
      <path d="M520,1092 L595,1220 L670,1092Z" fill="#1f7a74"/><path d="M510,1090 L595,1236 L680,1090" stroke="#0f504a" stroke-width="12" fill="none" stroke-linejoin="round"/>
      <path d="M640,1330 L760,1330 L758,1440 L642,1440Z" fill="#3cb8ae" stroke="${TK}" stroke-width="8"/><path d="M660,1290 L664,1350 M690,1280 L692,1350 M716,1296 L718,1350" stroke-width="12" stroke-linecap="round" stroke="#2c5fa8"/><path d="M690,1280 L692,1300" stroke="#c8342c" stroke-width="12" stroke-linecap="round"/>
      <path d="M400,1640 C500,1660 690,1660 790,1640" stroke="#23867e" stroke-width="10" fill="none" opacity=".7"/>
      ${[...Array(6)].map((_, i) => `<path d="M${450 + i * 60},1250 C${460 + i * 60},1450 ${450 + i * 60},1650 ${455 + i * 60},1830" stroke="#23867e" stroke-width="5" fill="none" opacity=".35"/>`).join('')}`,
    front: id => `
      <!-- cordón con la acreditación -->
      <path d="M470,1110 C480,1260 540,1380 570,1430 M720,1110 C700,1260 640,1380 600,1430" stroke="#2c5fa8" stroke-width="14" fill="none"/>
      <g transform="translate(585,1500) rotate(-4)"><rect x="-74" y="-66" width="148" height="132" rx="14" fill="#fbf8ef" stroke="${TK}" stroke-width="8"/><rect x="-62" y="-54" width="52" height="62" rx="8" fill="#c8e0f0"/><circle cx="-36" cy="-30" r="14" fill="#6a4024"/>
        <text x="30" y="-18" text-anchor="middle" font-family="Inter" font-weight="900" font-size="24" fill="#1f7a74">MARTA</text><rect x="-62" y="22" width="124" height="22" rx="5" fill="#3cb8ae"/></g>
      <!-- reloj de enfermera colgado -->
      <path d="M470,1330 L470,1380" stroke="#c9ced6" stroke-width="6"/><circle cx="470" cy="1406" r="28" fill="#fbf8ef" stroke="${TK}" stroke-width="7"/><path d="M470,1406 L470,1390 M470,1406 L482,1412" stroke="${TK}" stroke-width="4"/>`,
    under: id => `${[[524, 2100], [666, 2100]].map(([x, y], i) => `<path d="M${x - 60 + i * 16},${y} C${x - 60 + i * 16},${y - 54} ${x - 20},${y - 62} ${x + 16},${y - 58} C${x + 56},${y - 52} ${x + 70 - i * 10},${y - 26} ${x + 70 - i * 10},${y} Z" fill="#fbf8f2" stroke="${TK}" stroke-width="9"/><path d="M${x - 56 + i * 16},${y - 10} L${x + 66 - i * 10},${y - 10}" stroke="#c9ced6" stroke-width="10"/>`).join('')}`,
    hat: id => `<path d="M232,760 C200,540 380,410 590,410 C800,410 980,540 948,760 C920,660 860,600 760,580 C700,620 620,632 560,610 C470,600 380,620 320,680 C290,700 250,730 232,760Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      ${[[330, 640, 500, 470], [470, 600, 620, 440], [660, 580, 780, 460], [800, 620, 880, 540]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} Q${(x1 + x2) / 2 + 20},${(y1 + y2) / 2 - 20} ${x2},${y2}" stroke="#a8704a" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>`).join('')}
      <circle cx="600" cy="330" r="120" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12"/><path d="M520,300 C560,250 660,256 690,320 M530,350 C580,380 640,380 680,350" stroke="#a8704a" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M500,410 C560,440 640,440 700,410" stroke="#2c5fa8" stroke-width="24" fill="none" stroke-linecap="round"/>
      <path d="M250,720 C236,800 250,880 280,930" stroke="url(#${id}Hat)" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M250,720 C236,800 250,880 280,930" stroke="${TK}" stroke-width="6" fill="none" opacity=".6"/>
      <circle cx="212" cy="900" r="14" fill="#d8b040" stroke="${TK}" stroke-width="5"/><circle cx="968" cy="900" r="14" fill="#d8b040" stroke="${TK}" stroke-width="5"/>`
  }, o));
}

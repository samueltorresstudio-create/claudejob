// Personajes propios con EXACTAMENTE el mismo acabado que el tendero (tendero2d.js): mismo cuerpo, cabeza, contorno, sombras,
// cejas gruesas en bloque, ojos de párpado con media pupila, sombrero 3D sombreado. Requiere tendero2d.js (TD_BODY, TD_CROWN, TD_BRIM).
const TK = '#1e1313';
function pjT(o) {
  const id = o.id, f = o.face || 'serio', K = TK, c = o.top; // c = [luz, medio, sombra, borde, brillo, filo]
  let s = `<defs>
  <radialGradient id="${id}H" cx=".46" cy=".36" r=".66"><stop offset="0" stop-color="#fdf4d8"/><stop offset=".45" stop-color="#f5e4bc"/><stop offset=".8" stop-color="#ecd0b0"/><stop offset="1" stop-color="#d8b49c"/></radialGradient>
  <radialGradient id="${id}B" cx=".28" cy=".3" r=".95"><stop offset="0" stop-color="${c[0]}"/><stop offset=".35" stop-color="${c[1]}"/><stop offset=".7" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></radialGradient>
  <radialGradient id="${id}Hat" cx=".28" cy=".25" r=".95"><stop offset="0" stop-color="${o.hatC[0]}"/><stop offset=".4" stop-color="${o.hatC[1]}"/><stop offset=".75" stop-color="${o.hatC[2]}"/><stop offset="1" stop-color="${o.hatC[3]}"/></radialGradient>
  <linearGradient id="${id}Tri" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf4e8"/><stop offset=".55" stop-color="#f2e9dc"/><stop offset="1" stop-color="#cfc6ba"/></linearGradient>
  <radialGradient id="${id}Btn" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#dcb44a"/><stop offset="1" stop-color="#b08a2a"/></radialGradient>
  <filter id="${id}So" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="${id}S2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="${id}S1"><feGaussianBlur stdDeviation="2.5"/></filter>
  <clipPath id="${id}Bc"><path d="${o.bodyPath || TD_BODY}"/></clipPath><clipPath id="${id}Hc"><circle cx="590" cy="775" r="375"/></clipPath>
 </defs>`;
  const BP = o.bodyPath || TD_BODY;
  if (o.back) s += o.back(id);
  s += `<path d="M478,1880 L470,2100 M712,1880 L722,2100" stroke="#261717" stroke-width="30" stroke-linecap="round"/>`;
  if (o.under) s += o.under(id);
  const armL = o.armL || 'M305,1260 C250,1400 215,1600 205,1760', handL = o.handL || [205, 1770];
  const armR = o.armR || 'M888,1270 C930,1420 965,1600 985,1745', handR = o.handR || [985, 1755];
  const hand = ([x, y]) => `<circle cx="${x}" cy="${y}" r="44" fill="#261717"/><circle cx="${x - 14}" cy="${y - 16}" r="12" fill="#5a4440" opacity=".45" filter="url(#${id}S1)"/>`;
  s += `<path d="${armL}" stroke="#261717" stroke-width="26" fill="none" stroke-linecap="round"/>${hand(handL)}<path d="${armR}" stroke="#261717" stroke-width="26" fill="none" stroke-linecap="round"/>${hand(handR)}`;
  // cuerpo: igual que el tendero (luz a la izquierda, sombra interior derecha/abajo, sombra de la cabeza)
  s += `<path d="${BP}" fill="url(#${id}B)"/><g clip-path="url(#${id}Bc)">
    <path d="M290,1300 C280,1480 285,1650 310,1780" stroke="${c[4]}" stroke-width="40" fill="none" opacity=".55" filter="url(#${id}S2)"/>
    <path d="M318,1270 C306,1450 308,1640 330,1770" stroke="${c[5]}" stroke-width="8" fill="none" opacity=".5" filter="url(#${id}S1)"/>
    <path d="${BP}" fill="none" stroke="#08060a" stroke-width="110" opacity=".55" filter="url(#${id}So)" transform="translate(-50,-20)"/>
    <path d="${BP}" fill="none" stroke="${c[5]}" stroke-width="40" opacity=".3" filter="url(#${id}S2)" transform="translate(22,10)"/>
    <ellipse cx="600" cy="1100" rx="400" ry="100" fill="#08060a" opacity=".85" filter="url(#${id}So)"/>
    ${o.bodyIn ? o.bodyIn(id) : ''}
  </g><path d="${BP}" fill="none" stroke="${K}" stroke-width="30" stroke-linejoin="round"/>
  <path d="M908,1420 C918,1650 900,1840 600,1900" stroke="${K}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  if (o.front) s += o.front(id);
  // cabeza (idéntica al tendero)
  s += `<circle cx="590" cy="775" r="375" fill="url(#${id}H)"/><g clip-path="url(#${id}Hc)">
    <circle cx="560" cy="700" r="375" fill="none" stroke="#c89c8c" stroke-width="90" opacity=".35" filter="url(#${id}So)" transform="translate(70,90)"/>
    <path d="M232,640 C214,780 236,940 330,1060" stroke="#e8eef2" stroke-width="16" fill="none" opacity=".9" stroke-linecap="round" filter="url(#${id}S1)"/>
    <ellipse cx="590" cy="600" rx="330" ry="40" fill="#5a3a28" opacity=".35" filter="url(#${id}So)"/>
    ${o.headIn ? o.headIn(id) : ''}
  </g><circle cx="590" cy="775" r="375" fill="none" stroke="${K}" stroke-width="24"/>
  <path d="M960,800 A375,375 0 0 1 520,1145" stroke="${K}" stroke-width="18" fill="none" transform="translate(4,7)" stroke-linecap="round"/>`;
  s += faceT(f, o, id);
  if (o.hat) s += o.hat(id);
  return s;
}

// cara con el mismo dibujo que el tendero: cejas en bloque, ojos de párpado + media pupila; boca rellena con contorno si no hay bigote
function faceT(f, o, id) {
  const K = TK, BR = o.brow || '#2a1918';
  let s = '';
  const browL = { serio: 'M458,762 C470,742 540,744 600,778 L598,798 C545,786 488,792 466,788 C452,786 450,772 458,762Z',
    sorpresa: 'M462,728 C480,700 560,700 598,720 L596,742 C545,728 490,730 470,744 C456,750 452,738 462,728Z',
    feliz: 'M460,752 C478,722 560,722 598,746 L596,768 C545,752 490,756 468,768 C454,774 452,762 460,752Z' };
  const flip = d => d.replace(/(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/g, (m, x, _, y) => `${1210 - +x},${y}`);
  const bl = f === 'preocupado' ? browL.serio : (browL[f] || (f === 'picaro' ? browL.feliz : browL.serio));
  const rl = f === 'preocupado' ? ['rotate(-24,528,775) translate(0,6)', 'rotate(24,682,775) translate(0,6)'] : f === 'picaro' ? ['translate(0,14)', 'translate(0,-20)'] : ['', ''];
  const bw = o.browThin ? `transform-origin:528px 770px;` : '';
  const sc = o.browThin ? ' scale(1,.7)' : '';
  s += `<g transform="${o.browThin ? 'translate(0,230) scale(1,.7)' : ''}"><path d="${bl}" transform="${rl[0]}" fill="${BR}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="${flip(bl)}" transform="${rl[1]}" fill="${BR}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/></g>`;
  const lid = (x0, x1, y) => `<path d="M${x0},${y} L${x1},${y + 3}" stroke="${K}" stroke-width="20" stroke-linecap="round"/>`;
  const pupil = (cx, y) => `<path d="M${cx - 46},${y} A46,50 0 0 0 ${cx + 46},${y}Z" fill="${K}"/>`;
  const lash = (x, y, sd) => o.lashes ? `<path d="M${x},${y} l${sd * 26},-20 M${x - sd * 6},${y + 8} l${sd * 30},-4" stroke="${K}" stroke-width="10" stroke-linecap="round"/>` : '';
  if (f === 'sorpresa') s += `<ellipse cx="512" cy="850" rx="34" ry="44" fill="${K}"/><ellipse cx="698" cy="850" rx="34" ry="44" fill="${K}"/><circle cx="522" cy="836" r="7" fill="#fff" opacity=".5"/><circle cx="708" cy="836" r="7" fill="#fff" opacity=".5"/>` + lash(468, 820, -1) + lash(742, 820, 1);
  else if (f === 'feliz') s += `<path d="M450,860 Q512,800 575,860 M635,860 Q698,800 760,860" stroke="${K}" stroke-width="24" fill="none" stroke-linecap="round"/>` + lash(450, 858, -1) + lash(760, 858, 1);
  else if (f === 'picaro') s += pupil(512, 846) + lid(446, 582, 840) + `<path d="M635,860 Q698,800 760,860" stroke="${K}" stroke-width="24" fill="none" stroke-linecap="round"/>` + lash(446, 840, -1) + lash(760, 858, 1);
  else { const dy = f === 'preocupado' ? 8 : 0; s += pupil(512, 846 + dy) + pupil(698, 850 + dy) + lid(446, 582, 840 + dy) + lid(630, 766, 846 + dy) + lash(446, 840 + dy, -1) + lash(766, 849 + dy, 1); }
  if (o.cheeks) s += `<ellipse cx="400" cy="950" rx="60" ry="32" fill="#e07a7a" opacity=".35" filter="url(#${id}S2)"/><ellipse cx="800" cy="950" rx="60" ry="32" fill="#e07a7a" opacity=".35" filter="url(#${id}S2)"/>`;
  if (o.freckles) s += [[390, 930], [420, 960], [450, 925], [770, 930], [800, 960], [740, 950]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#b8704a" opacity=".7"/>`).join('');
  // boca rellena con contorno (estilo del tendero: formas gruesas)
  const lip = o.lips || null, M = { // [relleno, d]
    serio: `M548,1012 C580,1004 620,1004 652,1012 C656,1026 652,1034 640,1032 C612,1026 588,1026 560,1032 C548,1034 544,1026 548,1012Z`,
    preocupado: `M540,1030 C560,1010 580,1010 600,1022 C620,1034 640,1034 660,1014 C668,1028 662,1042 648,1046 C628,1050 612,1042 600,1036 C586,1030 572,1032 556,1046 C542,1050 534,1042 540,1030Z`,
    picaro: `M560,1018 C600,1030 640,1024 676,996 C688,1000 690,1014 680,1024 C646,1054 600,1056 562,1038 C550,1032 550,1020 560,1018Z` };
  if (f === 'feliz') s += `<path d="M520,990 C560,1000 640,1000 680,990 C688,1060 640,1100 600,1100 C560,1100 512,1060 520,990Z" fill="#5a1c20" stroke="${K}" stroke-width="16" stroke-linejoin="round"/><path d="M556,1070 C580,1050 620,1050 644,1070 C630,1090 570,1090 556,1070Z" fill="#c8505a"/>` + (lip ? `<path d="M520,990 C560,1000 640,1000 680,990" stroke="${lip}" stroke-width="10" fill="none"/>` : '');
  else if (f === 'sorpresa') s += `<ellipse cx="600" cy="1040" rx="34" ry="42" fill="#5a1c20" stroke="${lip || K}" stroke-width="${lip ? 16 : 14}"/>`;
  else s += `<path d="${M[f] || M.serio}" fill="${lip || K}" stroke="${K}" stroke-width="${lip ? 7 : 4}" stroke-linejoin="round"/>` + (lip ? `<path d="M570,1012 C590,1008 610,1008 630,1012" stroke="#ff9a9a" stroke-width="5" opacity=".6" fill="none"/>` : '');
  return s;
}

// ---------- PACO, el repartidor (inventado): gorra plana gris azulada, pelo pelirrojo, pecas, jersey azul, bandolera con cartera ----------
function paco2d(o = {}) {
  return pjT(Object.assign({
    id: 'pa', top: ['#3a6a9a', '#2a5480', '#1e3e62', '#122a44', '#6a9ac8', '#a8c8e8'],
    hatC: ['#8a96a4', '#5e6a78', '#46505c', '#2e3640'], freckles: 1, cheeks: 1, brow: '#7a3a18',
    back: () => '',
    bodyIn: id => `<path d="M300,1560 L910,1560" stroke="#0e2238" stroke-width="10" opacity=".5"/>${[1600, 1650, 1700, 1750, 1800].map(y => `<path d="M310,${y} L900,${y}" stroke="#0e2238" stroke-width="4" opacity=".25"/>`).join('')}`,
    front: id => `<path d="M560,1180 L640,1180 L600,1260Z" fill="url(#${id}Tri)" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M520,1150 L600,1200 L560,1250 L500,1200Z M680,1150 L600,1200 L640,1250 L700,1200Z" fill="url(#${id}Tri)" stroke="${TK}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M760,1150 C700,1350 560,1550 400,1720" stroke="#6a4024" stroke-width="44" fill="none" stroke-linecap="round"/><path d="M760,1150 C700,1350 560,1550 400,1720" stroke="${TK}" stroke-width="56" fill="none" stroke-linecap="round" opacity="0"/>
      <path d="M770,1160 C708,1356 566,1556 404,1728" stroke="#8a5a34" stroke-width="10" fill="none" opacity=".7"/>
      <path d="M300,1660 L520,1660 C530,1660 536,1668 536,1678 L530,1860 C530,1872 520,1880 508,1880 L314,1880 C302,1880 294,1872 294,1860 L288,1678 C288,1668 294,1660 300,1660Z" fill="#7a4a28" stroke="${TK}" stroke-width="14" stroke-linejoin="round"/>
      <path d="M290,1670 L536,1670 L530,1760 C460,1776 360,1776 292,1760Z" fill="#8e5a32" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      <rect x="398" y="1740" width="28" height="34" rx="5" fill="#c49e36" stroke="${TK}" stroke-width="5"/>
      <path d="M310,1690 L520,1690" stroke="#b07a4c" stroke-width="6" opacity=".6"/>`,
    headIn: () => '',
    hat: id => `<path d="M228,700 C232,620 248,600 268,610 C262,660 258,700 262,760 L240,780Z" fill="#c8602a" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/><path d="M952,700 C948,620 932,600 912,610 C918,660 922,700 918,760 L940,780Z" fill="#c8602a" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M300,640 C360,600 420,600 470,620 C430,640 400,670 380,700 C350,680 320,660 300,640Z" fill="#d8703a" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <g transform="rotate(-3,590,560)">
      <path d="M232,640 C200,440 380,330 620,330 C860,330 990,440 960,600 C900,560 780,540 600,545 C440,550 320,580 232,640Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="14" stroke-linejoin="round"/>
      <path d="M300,500 C340,400 450,350 560,346" stroke="#c0c8d2" stroke-width="10" fill="none" opacity=".75" stroke-linecap="round" filter="url(#${id}S1)"/>
      <path d="M620,334 C640,420 640,500 620,548" stroke="#2e3640" stroke-width="8" fill="none" opacity=".6"/>
      <circle cx="620" cy="336" r="16" fill="#46505c" stroke="${TK}" stroke-width="6"/>
      <path d="M232,640 C330,600 460,585 600,590 C690,592 760,600 800,612 C760,660 600,690 420,680 C320,676 250,668 232,640Z" fill="#46505c" stroke="${TK}" stroke-width="11" stroke-linejoin="round"/>
      <path d="M270,640 C380,618 520,612 640,616" stroke="#8a96a4" stroke-width="6" fill="none" opacity=".8"/>
      <path d="M260,660 C340,672 460,676 560,672" stroke="#1a1e24" stroke-width="10" fill="none" opacity=".5" filter="url(#${id}S1)"/></g>`
  }, o));
}

// ---------- DOÑA REMEDIOS (inventada): pamela morada con lazo y pluma, moño castaño, pestañas, labios rojos, vestido verde botella con cuello de encaje y broche ----------
function remedios2d(o = {}) {
  return pjT(Object.assign({
    id: 're', top: ['#2e7a5a', '#226448', '#174a34', '#0c2e20', '#5aa886', '#9adcc0'],
    hatC: ['#8a4a9e', '#6a3480', '#4e2462', '#341646'], lashes: 1, lips: '#c4283a', cheeks: 1, brow: '#4a2a1a',
    back: id => `<circle cx="880" cy="980" r="110" fill="#6a3a1e" stroke="${TK}" stroke-width="14"/><path d="M820,940 C850,900 900,900 930,930" stroke="#9a5a34" stroke-width="12" fill="none" opacity=".7" stroke-linecap="round"/>`,
    front: id => `<path d="M420,1150 C470,1230 540,1260 600,1260 C660,1260 730,1230 780,1150 L800,1190 C760,1270 680,1310 600,1310 C520,1310 440,1270 400,1190Z" fill="#f6f0e4" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      ${[...Array(9)].map((_, i) => { const x = 430 + i * 43, y = 1210 + Math.sin(i / 8 * Math.PI) * 80; return `<circle cx="${x}" cy="${y + 20}" r="16" fill="#f6f0e4" stroke="${TK}" stroke-width="5"/>`; }).join('')}
      <circle cx="600" cy="1330" r="32" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="7"/><circle cx="600" cy="1330" r="14" fill="#2e8a6a" stroke="${TK}" stroke-width="4"/><circle cx="592" cy="1320" r="5" fill="#fff" opacity=".8"/>
      ${[1480, 1560, 1640, 1720].map(y => `<circle cx="600" cy="${y}" r="13" fill="url(#${id}Btn)" stroke="#3a1a10" stroke-width="4"/>`).join('')}`,
    headIn: () => '',
    hat: id => `<circle cx="240" cy="920" r="16" fill="#f6f2ea" stroke="${TK}" stroke-width="5"/><circle cx="940" cy="920" r="16" fill="#f6f2ea" stroke="${TK}" stroke-width="5"/>
      <path d="M232,700 C240,600 330,560 420,560 C380,600 350,650 340,720 C300,700 260,690 232,700Z" fill="#6a3a1e" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/><path d="M948,700 C940,600 850,560 760,560 C800,600 830,650 840,720 C880,700 920,690 948,700Z" fill="#6a3a1e" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <g transform="rotate(-6,590,560)">
      <path d="M80,600 C200,540 420,520 600,520 C800,520 1000,540 1110,600 C1080,640 1000,660 900,650 C700,630 480,630 280,650 C180,660 100,640 80,600Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M120,600 C300,560 500,550 640,552" stroke="#b07ac4" stroke-width="8" fill="none" opacity=".7"/>
      <path d="M330,560 C320,380 440,320 600,320 C760,320 870,380 860,560Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M380,500 C380,420 440,360 530,348" stroke="#c49ad8" stroke-width="10" fill="none" opacity=".75" stroke-linecap="round" filter="url(#${id}S1)"/>
      <path d="M334,500 C500,480 700,480 858,500 L860,556 C700,540 500,540 332,556Z" fill="#e8c4ec" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M760,500 C800,440 880,440 880,490 C880,530 820,530 780,512 C820,560 820,610 780,620 C740,620 740,560 760,520Z" fill="#e8c4ec" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M850,470 C900,330 980,230 1060,200 C1040,280 990,380 880,480Z" fill="#f2e6d4" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M865,470 C920,360 980,280 1050,212" stroke="#b8a68e" stroke-width="5" fill="none"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${900 + i * 25},${400 - i * 35} l${30},-10" stroke="#b8a68e" stroke-width="4"/>`).join('')}</g>`
  }, o));
}

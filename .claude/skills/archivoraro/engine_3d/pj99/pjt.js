// Personajes propios con EXACTAMENTE el mismo acabado que el tendero (tendero2d.js): mismo cuerpo, cabeza, contorno, sombras,
// cejas gruesas en bloque, ojos de párpado con media pupila, sombrero 3D sombreado. Requiere tendero2d.js (TD_BODY, TD_CROWN, TD_BRIM).
const TK = '#1e1313';
// contorno exterior de la silueta: más grueso abajo a la derecha, borde suave (como la referencia)
function pjOutline(id, svg) {
  return `<defs><filter id="${id}OL" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
    <feMorphology in="SourceAlpha" operator="dilate" radius="7" result="d1"/><feOffset in="d1" dx="3" dy="5" result="o1"/>
    <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d2"/><feMerge result="m"><feMergeNode in="o1"/><feMergeNode in="d2"/></feMerge>
    <feComponentTransfer in="m" result="mk"><feFuncA type="linear" slope="3"/></feComponentTransfer>
    <feFlood flood-color="#1a0f10"/><feComposite in2="mk" operator="in" result="ol"/><feGaussianBlur in="ol" stdDeviation=".9" result="olb"/>
    <feMerge><feMergeNode in="olb"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#${id}OL)">${svg}</g>`;
}
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
  // piernas un 30 % más largas (pedido del usuario 24-11-2026): el cuerpo y la cabeza suben LEG px y los pies se quedan en el suelo (y = 2100)
  const LEG = o.legX ?? (window.PJ_LEG ?? 480), upLeg = d => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (m, x, y) => +y >= 2090 ? m : `${x},${+y - LEG}`);
  const legsSvg = o.legs === null ? '' : `<path d="${upLeg(o.legs || 'M478,1880 L470,2100 M712,1880 L722,2100')}" stroke="#261717" stroke-width="30" stroke-linecap="round"/>`;
  if (o.under) s += o.under(id);
  const armL = o.armL || 'M305,1260 C250,1400 215,1600 205,1760', handL = o.handL || [205, 1770];
  const armR = o.armR || 'M888,1270 C930,1420 965,1600 985,1745', handR = o.handR || [985, 1755];
  const hand = ([x, y]) => o.gloves ? `<circle cx="${x}" cy="${y}" r="46" fill="${o.gloves}" stroke="${TK}" stroke-width="12"/><path d="M${x - 26},${y - 14} A30,30 0 0 1 ${x + 6},${y - 30}" stroke="#fff" stroke-width="8" fill="none" opacity=".8" stroke-linecap="round"/><path d="M${x - 20},${y + 30} L${x + 20},${y + 30}" stroke="#b8b2a8" stroke-width="6"/>` : `<circle cx="${x}" cy="${y}" r="44" fill="#261717"/><circle cx="${x - 14}" cy="${y - 16}" r="12" fill="#5a4440" opacity=".45" filter="url(#${id}S1)"/>`;
  s += `<path d="${armL}" stroke="#261717" stroke-width="${o.armW || 26}" fill="none" stroke-linecap="round"/>${hand(handL)}<path d="${armR}" stroke="#261717" stroke-width="${o.armW || 26}" fill="none" stroke-linecap="round"/>${hand(handR)}`;
  const shadowSvg = o.shadow === false ? '' : `<ellipse cx="${o.shadowX || 595}" cy="${o.shadowY || 2096}" rx="${o.shadowW || 300}" ry="40" fill="#140a06" opacity=".45" filter="url(#${id}So)"/>`;
  const defsEnd = s.indexOf('</defs>') + 7, limbs = s.slice(defsEnd); s = s.slice(0, defsEnd); // patas y brazos fuera del contorno grueso (siguen finos)
  // cuerpo: igual que el tendero (luz a la izquierda, sombra interior derecha/abajo, sombra de la cabeza)
  s += `<path d="${BP}" fill="url(#${id}B)"/><g clip-path="url(#${id}Bc)">
    <path d="${BP}" fill="none" stroke="${c[4]}" stroke-width="60" opacity=".45" filter="url(#${id}S2)" transform="translate(30,6)"/>
    <path d="${BP}" fill="none" stroke="${c[5]}" stroke-width="10" opacity=".45" filter="url(#${id}S1)" transform="translate(12,2)"/>
    <path d="${BP}" fill="none" stroke="#08060a" stroke-width="110" opacity=".55" filter="url(#${id}So)" transform="translate(-50,-20)"/>
    <path d="${BP}" fill="none" stroke="${c[5]}" stroke-width="40" opacity=".3" filter="url(#${id}S2)" transform="translate(22,10)"/>
    <ellipse cx="600" cy="1100" rx="400" ry="100" fill="#08060a" opacity=".85" filter="url(#${id}So)"/>
    <ellipse cx="470" cy="1300" rx="70" ry="150" fill="#ffffff" opacity=".13" filter="url(#${id}So)" transform="rotate(12,470,1300)"/>
    ${o.bodyIn ? o.bodyIn(id) : ''}
  </g><path d="${BP}" fill="none" stroke="${K}" stroke-width="22" stroke-linejoin="round"/>
  <path d="${o.bodyEdge || 'M908,1420 C918,1650 900,1840 600,1900'}" stroke="${K}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  if (o.front) s += o.front(id);
  // cabeza (idéntica al tendero)
  s += `<circle cx="590" cy="775" r="375" fill="url(#${id}H)"/><g clip-path="url(#${id}Hc)">
    <circle cx="560" cy="700" r="375" fill="none" stroke="#c89c8c" stroke-width="90" opacity=".35" filter="url(#${id}So)" transform="translate(70,90)"/>
    <path d="M232,640 C214,780 236,940 330,1060" stroke="#e8eef2" stroke-width="16" fill="none" opacity=".9" stroke-linecap="round" filter="url(#${id}S1)"/>
    ${o.bald ? '' : '<ellipse cx="590" cy="600" rx="330" ry="40" fill="#5a3a28" opacity=".35" filter="url(#' + id + 'So)"/>'}
    ${o.headIn ? o.headIn(id) : ''}
  </g><circle cx="590" cy="775" r="375" fill="none" stroke="${K}" stroke-width="20"/>
  <path d="M940,620 A375,375 0 0 1 440,1118" stroke="${K}" stroke-width="10" fill="none" transform="translate(3,5)" stroke-linecap="round"/>
  <path d="M955,820 A375,375 0 0 1 560,1148" stroke="${K}" stroke-width="12" fill="none" transform="translate(5,8)" stroke-linecap="round"/>
  <path d="M300,520 A375,375 0 0 1 560,402" stroke="#4a3a36" stroke-width="5" fill="none" opacity=".5" transform="translate(4,4)"/>`;
  s += faceT(f, o, id);
  if (o.faceTop) s += o.faceTop(id, f);
  if (o.hat) s += o.hat(id);
  const defs0 = s.slice(0, s.indexOf('</defs>') + 7), body0 = s.slice(s.indexOf('</defs>') + 7);
  return shadowSvg + legsSvg + `<g transform="translate(0,${-LEG})">${limbs}${pjOutline(id, defs0 + body0)}</g>`;
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
  if (o.cheeks && false) s += `<ellipse cx="400" cy="950" rx="60" ry="32" fill="#e07a7a" opacity=".35" filter="url(#${id}S2)"/><ellipse cx="800" cy="950" rx="60" ry="32" fill="#e07a7a" opacity=".35" filter="url(#${id}S2)"/>`;
  if (o.freckles) s += [[390, 930], [420, 960], [450, 925], [770, 930], [800, 960], [740, 950]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#b8704a" opacity=".7"/>`).join('');
  // boca rellena con contorno (estilo del tendero: formas gruesas)
  const lip = o.lips || null, M = { // [relleno, d]
    serio: `M548,1012 C580,1004 620,1004 652,1012 C656,1026 652,1034 640,1032 C612,1026 588,1026 560,1032 C548,1034 544,1026 548,1012Z`,
    preocupado: `M540,1030 C560,1010 580,1010 600,1022 C620,1034 640,1034 660,1014 C668,1028 662,1042 648,1046 C628,1050 612,1042 600,1036 C586,1030 572,1032 556,1046 C542,1050 534,1042 540,1030Z`,
    picaro: `M560,1018 C600,1030 640,1024 676,996 C688,1000 690,1014 680,1024 C646,1054 600,1056 562,1038 C550,1032 550,1020 560,1018Z` };
  if (f === 'feliz') s += `<path d="M520,990 C560,1000 640,1000 680,990 C688,1060 640,1100 600,1100 C560,1100 512,1060 520,990Z" fill="#5a1c20" stroke="${K}" stroke-width="16" stroke-linejoin="round"/><path d="M556,1070 C580,1050 620,1050 644,1070 C630,1090 570,1090 556,1070Z" fill="#c8505a"/>` + (o.gap ? `<path d="M534,1000 L594,1004 L592,1030 L538,1026Z M608,1004 L666,1000 L662,1026 L610,1030Z" fill="#fbf6ec" stroke="${K}" stroke-width="5"/>` : '') + (lip ? `<path d="M520,990 C560,1000 640,1000 680,990" stroke="${lip}" stroke-width="10" fill="none"/>` : '');
  else if (f === 'sorpresa') s += `<ellipse cx="600" cy="1040" rx="34" ry="42" fill="#5a1c20" stroke="${lip || K}" stroke-width="${lip ? 16 : 14}"/>`;
  else s += `<path d="${M[f] || M.serio}" fill="${lip || K}" stroke="${K}" stroke-width="${lip ? 7 : 4}" stroke-linejoin="round"/>` + (lip ? `<path d="M570,1012 C590,1008 610,1008 630,1012" stroke="#ff9a9a" stroke-width="5" opacity=".6" fill="none"/>` : '');
  return s;
}

// ---------- PACO, el repartidor de periódicos (inventado): flaco y alto, gorra de repartidor, pelo pelirrojo, pecas, diente mellado,
// jersey de rayas en el bajo, bufanda, bandolera con periódicos ----------
const PACO_BODY = 'M408,1190 C414,1110 500,1078 595,1078 C690,1078 776,1110 782,1190 C792,1380 798,1600 794,1730 C788,1820 720,1856 595,1856 C470,1856 402,1820 396,1730 C392,1600 398,1380 408,1190Z';
function paco2d(o = {}) {
  return pjT(Object.assign({
    id: 'pa', bodyPath: PACO_BODY, bodyEdge: 'M792,1420 C800,1650 790,1820 600,1860',
    top: ['#4a7cb0', '#335f90', '#244870', '#142e4c', '#7aaad8', '#b8d8f4'],
    hatC: ['#8a8278', '#6a6258', '#504840', '#36302a'], freckles: 1, brow: '#a04a1c', gap: 1,
    legs: 'M530,1840 L524,2100 M662,1840 L668,2100',
    armL: 'M412,1260 C370,1420 345,1600 335,1760', handL: [335, 1770], armR: 'M778,1260 C820,1420 845,1600 855,1745', handR: [855, 1755],
    bodyIn: id => `<path d="${PACO_BODY}" fill="none" stroke="#1a3450" stroke-width="0"/>
      ${[1700, 1740, 1780, 1820].map(y => `<path d="M380,${y} L810,${y}" stroke="#d8c25a" stroke-width="16" opacity=".9"/>`).join('')}
      ${[420, 470, 520, 570, 620, 670, 720, 770].map(x => `<path d="M${x},1690 L${x},1860" stroke="#142e4c" stroke-width="4" opacity=".45"/>`).join('')}
      <path d="M380,1690 L810,1690" stroke="#142e4c" stroke-width="8" opacity=".6"/>
      `,
    front: id => `
      <path d="M470,1110 C520,1150 670,1150 720,1110 L740,1170 C680,1215 510,1215 450,1170Z" fill="#c8302e" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M470,1130 C530,1165 660,1165 720,1130" stroke="#f08070" stroke-width="7" fill="none" opacity=".6"/>
      <path d="M690,1180 L700,1360 L650,1352 L668,1190Z" fill="#b02624" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      ${[1240, 1290, 1330].map(y => `<path d="M${652 + (y - 1190) * .02},${y} L${700},${y + 4}" stroke="#f0d060" stroke-width="7"/>`).join('')}
      <path d="M760,1130 C710,1330 600,1520 470,1680" stroke="#5a361c" stroke-width="48" fill="none" stroke-linecap="round"/>
      <path d="M760,1130 C710,1330 600,1520 470,1680" stroke="${TK}" stroke-width="62" fill="none" stroke-linecap="round" opacity=".0"/>
      <path d="M748,1140 C700,1330 592,1512 462,1672" stroke="#8a5a34" stroke-width="10" fill="none" opacity=".8"/>
      <path d="M776,1140 C726,1336 614,1530 484,1690" stroke="#2e1a0c" stroke-width="8" fill="none" opacity=".7"/>
      <rect x="560" y="1530" width="26" height="40" rx="6" fill="#c49e36" stroke="${TK}" stroke-width="6" transform="rotate(38,573,1550)"/>
      <path d="M300,1620 L330,1560 L430,1590 L410,1650Z" fill="#f2ece0" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M335,1585 L415,1608 M330,1600 L405,1622" stroke="#6a6258" stroke-width="5"/>
      <path d="M380,1600 L420,1530 L520,1560 L490,1630Z" fill="#fbf6ea" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/><path d="M425,1555 L505,1578 M418,1572 L495,1595 M412,1590 L470,1607" stroke="#6a6258" stroke-width="5"/>
      <path d="M300,1640 L560,1640 C572,1640 580,1650 578,1662 L566,1850 C565,1862 555,1872 542,1872 L322,1872 C308,1872 298,1862 298,1850 L288,1662 C287,1650 292,1640 300,1640Z" fill="#7a4a28" stroke="${TK}" stroke-width="14" stroke-linejoin="round"/>
      <path d="M292,1650 L578,1650 L572,1740 C490,1762 380,1762 294,1740Z" fill="#9a6238" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M306,1668 L560,1668" stroke="#c48a5a" stroke-width="6" opacity=".7"/><path d="M300,1840 L560,1840" stroke="#4a2a14" stroke-width="10" opacity=".6"/>
      <rect x="418" y="1726" width="30" height="36" rx="5" fill="#c49e36" stroke="${TK}" stroke-width="5"/>
      ${[[330, 1690], [520, 1690], [330, 1820], [540, 1820]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#d8b07a"/>`).join('')}`,
    hat: id => `
      <path d="M226,720 C220,650 236,610 262,600 C258,650 256,700 262,780 L238,800Z" fill="#c85a22" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M954,720 C960,650 944,610 918,600 C922,650 924,700 918,780 L942,800Z" fill="#c85a22" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M330,640 C380,610 430,610 470,630 C440,650 420,690 410,720 C380,700 350,670 330,640Z" fill="#d86a2e" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M360,650 C385,640 410,640 430,648" stroke="#f0a060" stroke-width="6" fill="none" opacity=".7"/>
      <g transform="rotate(-2.5,590,560)">
      <path d="M205,600 C170,470 300,330 560,320 C800,312 990,420 975,560 C972,600 950,622 920,630 C760,600 420,600 260,632 C232,632 212,622 205,600Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="14" stroke-linejoin="round"/>
      ${[[590, 330, 380, 600], [590, 330, 500, 605], [590, 330, 690, 605], [590, 330, 820, 610]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} Q${(x1 + x2) / 2 + (x2 < 590 ? -30 : 30)},${(y1 + y2) / 2} ${x2},${y2}" stroke="#36302a" stroke-width="6" fill="none" opacity=".55"/>`).join('')}
      <path d="M270,520 C300,420 420,350 560,342" stroke="#c8c0b4" stroke-width="12" fill="none" opacity=".7" stroke-linecap="round" filter="url(#${id}S1)"/>
      <circle cx="590" cy="334" r="18" fill="#504840" stroke="${TK}" stroke-width="7"/>
      <path d="M940,450 C970,520 960,590 920,630" stroke="#1e1a16" stroke-width="40" fill="none" opacity=".35" filter="url(#${id}S2)"/>
      <path d="M380,610 C470,596 710,596 800,610 C820,640 800,676 760,684 C660,700 520,700 420,684 C380,676 362,640 380,610Z" fill="#46403a" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M400,624 C500,612 690,612 780,624" stroke="#8a8278" stroke-width="6" fill="none" opacity=".8"/>
      </g>
      <ellipse cx="590" cy="700" rx="230" ry="26" fill="#3a2418" opacity=".3" filter="url(#${id}S2)"/>`
  }, o));
}

// ---------- DOÑA REMEDIOS (inventada): silueta de reloj de arena con falda de campana, pamela morada con flores y pluma, rizos,
// pestañas, labios rojos, cuello de encaje, broche, cinturón con lazo, bolso colgado del brazo ----------
const REM_BODY = 'M392,1190 C400,1100 492,1068 595,1068 C698,1068 790,1100 798,1190 C810,1300 790,1400 752,1470 C850,1660 930,1880 965,2085 L225,2085 C260,1880 340,1660 438,1470 C400,1400 380,1300 392,1190Z';
function remedios2d(o = {}) {
  return pjT(Object.assign({
    id: 're', bodyPath: REM_BODY, bodyEdge: 'M800,1300 C790,1400 760,1470 760,1480 C860,1680 930,1880 960,2080', legs: null,
    top: ['#348a66', '#26704f', '#1a523a', '#0e3424', '#5ab08c', '#a8e4c8'],
    hatC: ['#9a5aae', '#7a3e90', '#5a2a6e', '#3e1a50'], lashes: 1, lips: '#c4283a', brow: '#4a2a1a',
    armL: 'M400,1250 C350,1380 320,1500 300,1590', handL: [298, 1600],
    armR: 'M792,1250 C840,1420 860,1560 870,1700', handR: [870, 1712],
    back: id => `<circle cx="880" cy="960" r="105" fill="#6a3a1e" stroke="${TK}" stroke-width="14"/><path d="M820,920 C850,880 900,880 930,910" stroke="#9a5a34" stroke-width="12" fill="none" opacity=".7" stroke-linecap="round"/><path d="M800,1000 C840,1040 900,1040 950,1010" stroke="#4a2410" stroke-width="10" fill="none"/>`,
    bodyIn: id => `<path d="M438,1470 C540,1500 650,1500 752,1470" stroke="#0e3424" stroke-width="16" fill="none" opacity=".6"/>
      ${[[470, 1560, 380, 2080], [560, 1560, 520, 2080], [640, 1560, 680, 2080], [720, 1560, 820, 2080]].map(([x1, y1, x2, y2]) => `<path d="M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}" stroke="#0e3424" stroke-width="12" fill="none" opacity=".45" filter="url(#${id}S1)"/><path d="M${x1 - 14},${y1 + 20} C${x1 - 14},${(y1 + y2) / 2} ${x2 - 20},${(y1 + y2) / 2} ${x2 - 20},${y2}" stroke="#5ab08c" stroke-width="6" fill="none" opacity=".35" filter="url(#${id}S1)"/>`).join('')}
      <path d="M260,1980 C450,2010 750,2010 940,1980" stroke="#0a2418" stroke-width="40" opacity=".4" filter="url(#${id}S2)"/>`,
    front: id => `
      <path d="M436,1450 C530,1478 660,1478 756,1450 L762,1500 C660,1528 530,1528 430,1500Z" fill="#1a1a1a" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M560,1470 C520,1440 480,1450 485,1485 C490,1515 530,1510 560,1490Z M630,1470 C670,1440 710,1450 705,1485 C700,1515 660,1510 630,1490Z" fill="#2a2a2a" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <rect x="575" y="1462" width="40" height="36" rx="8" fill="#c49e36" stroke="${TK}" stroke-width="6"/>
      <path d="M440,1150 C490,1225 545,1252 595,1252 C645,1252 700,1225 750,1150 L770,1188 C725,1265 660,1300 595,1300 C530,1300 465,1265 420,1188Z" fill="#f6f0e4" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      ${[...Array(9)].map((_, i) => { const x = 440 + i * 39, y = 1210 + Math.sin(i / 8 * Math.PI) * 78; return `<path d="M${x - 16},${y + 6} A18,18 0 0 0 ${x + 20},${y + 6}" fill="#f6f0e4" stroke="${TK}" stroke-width="5"/><circle cx="${x + 2}" cy="${y + 10}" r="4" fill="#c8c0b0"/>`; }).join('')}
      <circle cx="595" cy="1326" r="34" fill="url(#${id}Btn)" stroke="${TK}" stroke-width="7"/><circle cx="595" cy="1326" r="15" fill="#2e8a6a" stroke="${TK}" stroke-width="4"/><circle cx="587" cy="1316" r="5" fill="#fff" opacity=".8"/>
      ${[1380, 1420].map(y => `<circle cx="595" cy="${y}" r="11" fill="url(#${id}Btn)" stroke="#3a1a10" stroke-width="4"/>`).join('')}
      <path d="M298,1600 C250,1640 240,1680 240,1700 M298,1600 C350,1640 360,1680 360,1700" stroke="#3a2214" stroke-width="10" fill="none"/><circle cx="298" cy="1600" r="44" fill="#261717"/>
      <path d="M210,1700 L390,1700 C402,1700 410,1710 408,1722 L392,1830 C390,1842 380,1850 368,1850 L232,1850 C220,1850 210,1842 208,1830 L192,1722 C190,1710 198,1700 210,1700Z" fill="#7a2a3a" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M196,1730 C260,1760 340,1760 406,1730" stroke="#5a1a28" stroke-width="10" fill="none"/><circle cx="300" cy="1752" r="12" fill="#c49e36" stroke="${TK}" stroke-width="5"/>
      <path d="M210,1720 L380,1720" stroke="#b05468" stroke-width="6" opacity=".6"/>`,
    hat: id => `<circle cx="236" cy="930" r="17" fill="#f6f2ea" stroke="${TK}" stroke-width="5"/><circle cx="944" cy="930" r="17" fill="#f6f2ea" stroke="${TK}" stroke-width="5"/>
      ${[[300, 660], [360, 640], [420, 630]].map(([x, y]) => `<path d="M${x},${y} C${x - 30},${y + 20} ${x - 20},${y + 70} ${x + 20},${y + 60} C${x + 40},${y + 50} ${x + 20},${y + 20} ${x},${y + 30}" fill="#6a3a1e" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>`).join('')}
      <path d="M940,690 C930,620 860,590 790,590 C820,630 840,670 846,730 C880,720 912,708 940,690Z" fill="#6a3a1e" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <g transform="rotate(-6,590,560)">
      <path d="M70,604 C200,540 420,520 600,520 C800,520 1010,540 1120,604 C1092,648 1006,666 900,656 C700,636 480,636 280,656 C176,666 96,646 70,604Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M110,604 C300,562 500,552 640,554" stroke="#c48ad8" stroke-width="8" fill="none" opacity=".7"/>
      <path d="M200,646 C400,628 700,628 980,648" stroke="#2a1036" stroke-width="12" fill="none" opacity=".5" filter="url(#${id}S1)"/>
      <path d="M330,560 C320,380 440,318 600,318 C760,318 870,380 860,560Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M380,500 C380,420 440,360 530,346" stroke="#d4aae6" stroke-width="10" fill="none" opacity=".75" stroke-linecap="round" filter="url(#${id}S1)"/>
      <path d="M334,500 C500,480 700,480 858,500 L860,556 C700,540 500,540 332,556Z" fill="#f0cce8" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      ${[[740, 500, '#e84a6a'], [790, 470, '#f4d040'], [835, 505, '#e84a6a'], [700, 520, '#f6f0f0']].map(([x, y, c]) => `<g transform="translate(${x},${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-20" rx="15" ry="22" fill="${c}" stroke="${TK}" stroke-width="5" transform="rotate(${a})"/>`).join('')}<circle r="11" fill="#f4c030" stroke="${TK}" stroke-width="4"/></g>`).join('')}
      <path d="M760,520 C740,560 700,580 670,575 C690,550 720,530 760,520Z" fill="#4a8a3a" stroke="${TK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M850,470 C900,330 980,230 1060,200 C1040,280 990,380 880,480Z" fill="#f2e6d4" stroke="${TK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M865,470 C920,360 980,280 1050,212" stroke="#b8a68e" stroke-width="5" fill="none"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${900 + i * 25},${400 - i * 35} l${30},-10" stroke="#b8a68e" stroke-width="4"/>`).join('')}</g>`
  }, o));
}

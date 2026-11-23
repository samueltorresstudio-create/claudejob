// Tendero 2D calcado de la referencia «.99» (coordenadas del fotograma 1170x2080; cabeza centro 590,775 R 375).
function tendero2d(o = {}) {
  const K = '#2a1b1b', f = o.face || 'serio';
  let s = `<defs>
  <radialGradient id="tdH" cx=".42" cy=".42" r=".65"><stop offset="0" stop-color="#fbf1dd"/><stop offset=".7" stop-color="#f1e1c8"/><stop offset="1" stop-color="#e8cfc0"/></radialGradient>
  <linearGradient id="tdB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a2a38"/><stop offset=".22" stop-color="#8e2030"/><stop offset=".6" stop-color="#7a1825"/><stop offset=".88" stop-color="#5c111b"/><stop offset="1" stop-color="#480d15"/></linearGradient>
  <linearGradient id="tdHat" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#7a4a28"/><stop offset=".5" stop-color="#5e3719"/><stop offset="1" stop-color="#3e2210"/></linearGradient>
  <linearGradient id="tdBrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a7468"/><stop offset=".25" stop-color="#4a2c18"/><stop offset="1" stop-color="#2e1a0e"/></linearGradient>
  <radialGradient id="tdBtn" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#e2c060"/><stop offset="1" stop-color="#a8822a"/></radialGradient>
  <filter id="tdSoft"><feGaussianBlur stdDeviation="18"/></filter>
  <clipPath id="tdBc"><path d="M330,1150 C300,1240 284,1440 288,1640 C292,1800 370,1895 600,1895 C830,1895 908,1800 912,1640 C916,1440 900,1240 870,1150 C760,1120 440,1120 330,1150Z"/></clipPath>
 </defs>`;
  // piernas
  s += `<path d="M478,1880 L470,2100 M712,1880 L722,2100" stroke="${K}" stroke-width="30" stroke-linecap="round"/>`;
  // brazos (de palo grueso) y manos bola
  const armL = o.armL || 'M305,1260 C250,1400 215,1600 205,1760', handL = o.handL || [205, 1770];
  const armR = o.armR || 'M888,1270 C930,1420 965,1600 985,1745', handR = o.handR || [985, 1755];
  s += `<path d="${armL}" stroke="${K}" stroke-width="26" fill="none" stroke-linecap="round"/><circle cx="${handL[0]}" cy="${handL[1]}" r="44" fill="${K}"/>`;
  s += `<path d="${armR}" stroke="${K}" stroke-width="26" fill="none" stroke-linecap="round"/><circle cx="${handR[0]}" cy="${handR[1]}" r="44" fill="${K}"/>`;
  // cuerpo (bala granate)
  const BP = 'M330,1150 C300,1240 284,1440 288,1640 C292,1800 370,1895 600,1895 C830,1895 908,1800 912,1640 C916,1440 900,1240 870,1150 C760,1120 440,1120 330,1150Z';
  s += `<path d="${BP}" fill="url(#tdB)"/><g clip-path="url(#tdBc)">
    <path d="M335,1240 C318,1400 322,1600 350,1770" stroke="#d06878" stroke-width="46" fill="none" opacity=".45" filter="url(#tdSoft)"/><path d="M420,1830 C500,1870 700,1870 800,1830" stroke="#2a060c" stroke-width="50" fill="none" opacity=".4" filter="url(#tdSoft)"/>
    <ellipse cx="600" cy="1150" rx="330" ry="70" fill="#2a0a10" opacity=".55" filter="url(#tdSoft)"/>
    <path d="M880,1220 C900,1450 895,1690 865,1830" stroke="#1e0408" stroke-width="80" fill="none" opacity=".5" filter="url(#tdSoft)"/>
    <path d="M420,1650 L530,1652 M752,1648 L862,1640" stroke="#3a0c12" stroke-width="11" stroke-linecap="round"/>
  </g><path d="${BP}" fill="none" stroke="${K}" stroke-width="30" stroke-linejoin="round"/><path d="M905,1500 C912,1700 880,1880 600,1898" stroke="${K}" stroke-width="18" fill="none" stroke-linecap="round"/>`;
  // camisa en pico bajo la pajarita, cuello (dos triángulos), pajarita roja de lunares
  s += `<path d="M602,1318 L700,1318 L652,1412Z" fill="#f2ece2" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="M515,1222 L640,1222 L585,1322Z" fill="#f4efe6" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M520,1226 L585,1322 L600,1290Z" fill="#d9d2c6" opacity=".6"/>`;
  s += `<path d="M652,1222 L766,1222 L705,1320Z" fill="#f4efe6" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M760,1226 L705,1320 L690,1290Z" fill="#d9d2c6" opacity=".6"/>`;
  s += `<path d="M578,1294 L632,1306 L632,1322 L582,1346Z" fill="#d8323a" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M718,1294 L664,1306 L664,1322 L714,1346Z" fill="#d8323a" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<circle cx="648" cy="1314" r="19" fill="#c42a32" stroke="${K}" stroke-width="6"/>`;
  s += [[592, 1306], [606, 1330], [618, 1312], [704, 1306], [690, 1330], [678, 1312]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f6e8e0"/>`).join('');
  // botones dorados
  s += [1522, 1593, 1665, 1737].map(y => `<circle cx="647" cy="${y}" r="15" fill="url(#tdBtn)" stroke="#5a3a14" stroke-width="3"/>`).join('');
  // cabeza
  s += `<circle cx="590" cy="775" r="375" fill="url(#tdH)"/>
   <path d="M260,760 C255,900 320,1050 440,1110" stroke="#ffffff" stroke-width="24" fill="none" opacity=".35" stroke-linecap="round" filter="url(#tdSoft)"/>
   <path d="M600,1150 C760,1150 900,1060 950,900" stroke="#c9a89a" stroke-width="40" fill="none" opacity=".35" filter="url(#tdSoft)"/>
   <circle cx="590" cy="775" r="375" fill="none" stroke="${K}" stroke-width="30"/><path d="M955,850 A375,375 0 0 1 560,1150" stroke="${K}" stroke-width="20" fill="none" transform="translate(4,6)" stroke-linecap="round"/>`;
  s += face2d(f);
  // bombín
  s += `<g transform="rotate(${o.hatTilt ?? 1.2},590,580)">
   <path d="M265,560 C250,300 430,262 600,262 C780,262 930,320 925,560Z" fill="url(#tdHat)" stroke="${K}" stroke-width="20" stroke-linejoin="round"/>
   <path d="M340,330 C305,370 292,420 296,470" stroke="#c89a78" stroke-width="20" fill="none" stroke-linecap="round" opacity=".75"/>
   <path d="M380,300 C360,312 345,325 338,335" stroke="#e8c8a8" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>
   <path d="M160,566 C300,548 900,540 1030,584 L1022,598 C1000,610 950,628 900,626 C700,610 300,610 200,602 C175,600 158,586 160,566Z" fill="url(#tdBrim)" stroke="${K}" stroke-width="12" stroke-linejoin="round"/>
   <path d="M270,570 C450,556 760,552 920,566" stroke="#1e1008" stroke-width="14" fill="none" opacity=".7"/>
  </g>`;
  return s;
}

function face2d(f) {
  const K = '#2a1b1b', BR = '#2e1d1a';
  let s = '';
  const browL = { serio: 'M458,762 C470,742 540,744 600,778 L598,798 C545,786 488,792 466,788 C452,786 450,772 458,762Z', preocupado: 'M458,800 C470,780 540,760 600,742 L604,764 C545,786 488,812 466,812 C450,812 448,808 458,800Z', sorpresa: 'M462,728 C480,700 560,700 598,720 L596,742 C545,728 490,730 470,744 C456,750 452,738 462,728Z' };
  const flip = d => d.replace(/(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/g, (m, x, _, y) => `${1210 - +x},${y}`);
  const bl = browL[f] || browL.serio; s += `<path d="${bl}" fill="${BR}" stroke="${K}" stroke-width="5"/><path d="${flip(bl)}" fill="${BR}" stroke="${K}" stroke-width="5"/>`;
  if (f === 'sorpresa') s += `<ellipse cx="512" cy="850" rx="34" ry="44" fill="${K}"/><ellipse cx="698" cy="850" rx="34" ry="44" fill="${K}"/>`;
  else if (f === 'feliz') s += `<path d="M450,860 Q512,800 575,860 M635,860 Q698,800 760,860" stroke="${K}" stroke-width="24" fill="none" stroke-linecap="round"/>`;
  else { const dy = f === 'preocupado' ? 8 : 0;
    s += `<path d="M470,${848 + dy} A40,44 0 0 0 554,${848 + dy}Z" fill="${K}"/><path d="M656,${852 + dy} A40,44 0 0 0 740,${852 + dy}Z" fill="${K}"/>`;
    s += `<path d="M446,${840 + dy} L582,${843 + dy} M630,${846 + dy} L766,${849 + dy}" stroke="${K}" stroke-width="24" stroke-linecap="round"/>`; }
  // bigote: arco grueso con puntas caídas
  const M = 'M600,902 C560,880 470,882 432,928 C395,972 390,1030 412,1050 C432,1066 452,1040 452,1012 C460,990 520,990 600,996 C680,990 740,990 750,1012 C752,1040 770,1066 790,1052 C812,1032 806,972 768,928 C730,882 640,880 600,902Z';
  s += `<path d="${M}" fill="#683820" stroke="${K}" stroke-width="20" stroke-linejoin="round"/>`;
  s += `<path d="M430,1010 C440,950 500,925 600,935 C700,925 760,950 772,1010" stroke="#7e4a2c" stroke-width="26" fill="none" opacity=".55" stroke-linecap="round"/>`;
  // boca
  if (f === 'sorpresa') s += `<ellipse cx="600" cy="1050" rx="26" ry="30" fill="#4a1c1e" stroke="${K}" stroke-width="10"/>`;
  else if (f === 'feliz') s += `<path d="M560,1010 Q600,1060 645,1010" stroke="${K}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M588,1000 C600,1018 618,1026 640,1012" stroke="${K}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  return s;
}

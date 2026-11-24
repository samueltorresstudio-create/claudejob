// Tendero 2D calcado de la referencia «.99» (coordenadas del fotograma 1170x2080; cabeza centro 590,775 R 375).
// Colores medidos en el vídeo: contorno #311b17, cabeza #f0e0bc→#f0cfbc, chaleco #904448/#761c24/#481116, bombín #937d71/#482a17/#372012, ala #68524f.
const TD_BODY = 'M300,1230 C320,1110 450,1060 600,1060 C750,1060 880,1110 900,1230 C916,1440 916,1640 910,1720 C900,1840 800,1895 600,1895 C400,1895 300,1840 292,1720 C286,1640 286,1440 300,1230Z';
const TD_CROWN = 'M265,560 C250,300 430,262 600,262 C780,262 930,320 925,560Z';
const TD_BRIM = 'M156,562 C300,548 880,540 1032,580 L1030,596 C990,606 950,616 900,616 C700,604 320,604 200,592 L158,580Z';
const TD_MUST = 'M600,902 C560,880 470,882 432,928 C395,972 390,1030 412,1050 C432,1066 452,1040 452,1012 C460,990 520,990 600,996 C680,990 740,990 750,1012 C752,1040 770,1066 790,1052 C812,1032 806,972 768,928 C730,882 640,880 600,902Z';
function tendero2d(o = {}) {
  const K = '#1e1313', f = o.face || 'serio';
  let s = `<defs>
  <radialGradient id="tdH" cx=".46" cy=".36" r=".66"><stop offset="0" stop-color="#fdf4d8"/><stop offset=".45" stop-color="#f5e4bc"/><stop offset=".8" stop-color="#ecd0b0"/><stop offset="1" stop-color="#d8b49c"/></radialGradient>
  <radialGradient id="tdB" cx=".28" cy=".3" r=".95"><stop offset="0" stop-color="#84222e"/><stop offset=".35" stop-color="#741a24"/><stop offset=".7" stop-color="#5e141e"/><stop offset="1" stop-color="#420e14"/></radialGradient>
  <radialGradient id="tdHat" cx=".28" cy=".25" r=".95"><stop offset="0" stop-color="#644030"/><stop offset=".4" stop-color="#4a2c19"/><stop offset=".75" stop-color="#3a2112"/><stop offset="1" stop-color="#2a170c"/></radialGradient>
  <linearGradient id="tdBrim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c6460"/><stop offset=".5" stop-color="#60483f"/><stop offset="1" stop-color="#433028"/></linearGradient>
  <linearGradient id="tdMu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c2816"/><stop offset="1" stop-color="#46261a"/></linearGradient>
  <linearGradient id="tdTri" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf4e8"/><stop offset=".55" stop-color="#f2e9dc"/><stop offset="1" stop-color="#cfc6ba"/></linearGradient>
  <radialGradient id="tdBtn" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#dcb44a"/><stop offset="1" stop-color="#b08a2a"/></radialGradient>
  <filter id="tdSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="tdS2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="tdS1"><feGaussianBlur stdDeviation="2.5"/></filter><filter id="tdAll"><feGaussianBlur stdDeviation=".5"/></filter>
  <clipPath id="tdBc"><path d="${TD_BODY}"/></clipPath><clipPath id="tdHc"><circle cx="590" cy="775" r="375"/></clipPath>
  <clipPath id="tdCc"><path d="${TD_CROWN}"/></clipPath><clipPath id="tdMc"><path d="${TD_MUST}"/></clipPath>
 </defs>`;
  // piernas
  s += `<path d="M478,1880 L470,2100 M712,1880 L722,2100" stroke="#261717" stroke-width="30" stroke-linecap="round"/>`;
  // brazos y manos bola
  const armL = o.armL || 'M305,1260 C250,1400 215,1600 205,1760', handL = o.handL || [205, 1770];
  const armR = o.armR || 'M888,1270 C930,1420 965,1600 985,1745', handR = o.handR || [985, 1755];
  const hand = ([x, y]) => `<circle cx="${x}" cy="${y}" r="44" fill="#261717"/><circle cx="${x - 14}" cy="${y - 16}" r="12" fill="#5a4440" opacity=".45" filter="url(#tdS1)"/>`;
  s += `<path d="${armL}" stroke="#261717" stroke-width="26" fill="none" stroke-linecap="round"/>${hand(handL)}<path d="${armR}" stroke="#261717" stroke-width="26" fill="none" stroke-linecap="round"/>${hand(handR)}`;
  // cuerpo: granate con luz por la izquierda, sombra a la derecha y bajo la cabeza
  s += `<path d="${TD_BODY}" fill="url(#tdB)"/><g clip-path="url(#tdBc)">
    <path d="M290,1300 C280,1480 285,1650 310,1780" stroke="#b05a60" stroke-width="40" fill="none" opacity=".55" filter="url(#tdS2)"/>
    <path d="M318,1270 C306,1450 308,1640 330,1770" stroke="#d48a8a" stroke-width="8" fill="none" opacity=".5" filter="url(#tdS1)"/>
    <path d="${TD_BODY}" fill="none" stroke="#1a0408" stroke-width="110" opacity=".55" filter="url(#tdSoft)" transform="translate(-50,-20)"/><path d="M360,1250 C340,1450 345,1650 380,1800" stroke="#a03644" stroke-width="70" fill="none" opacity=".35" filter="url(#tdSoft)"/>
    <path d="${TD_BODY}" fill="none" stroke="#c46a70" stroke-width="40" opacity=".35" filter="url(#tdS2)" transform="translate(22,10)"/>
    <ellipse cx="600" cy="1100" rx="400" ry="100" fill="#1a080a" opacity=".9" filter="url(#tdSoft)"/><path d="M650,1425 L648,1880" stroke="#3a0a12" stroke-width="5" opacity=".6" filter="url(#tdS1)"/>
    <path d="M420,1650 L530,1652 M752,1648 L862,1640" stroke="#441116" stroke-width="13" stroke-linecap="round" filter="url(#tdS1)"/>
    <path d="M424,1664 L528,1666 M754,1662 L858,1654" stroke="#9a3a44" stroke-width="4" stroke-linecap="round" opacity=".5" filter="url(#tdS1)"/>
  </g><path d="${TD_BODY}" fill="none" stroke="${K}" stroke-width="30" stroke-linejoin="round"/>
  <path d="M908,1420 C918,1650 900,1840 600,1900" stroke="${K}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  // camisa en pico, cuello (dos triángulos con sombra diagonal), pajarita roja de lunares
  s += `<path d="M598,1316 L702,1316 L650,1425Z" fill="url(#tdTri)" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="M515,1222 L640,1222 L585,1322Z" fill="url(#tdTri)" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>`;
  s += `<path d="M652,1222 L766,1222 L705,1320Z" fill="url(#tdTri)" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>`;
  s += `<path d="M578,1292 L632,1306 L632,1322 L582,1348Z" fill="#d42c34" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M718,1292 L664,1306 L664,1322 L714,1348Z" fill="#c42630" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="M586,1300 L626,1310" stroke="#f07070" stroke-width="4" opacity=".6"/>`;
  s += `<circle cx="648" cy="1314" r="19" fill="#b8222c" stroke="${K}" stroke-width="6"/>`;
  s += [[592, 1306], [606, 1332], [618, 1312], [704, 1306], [690, 1332], [678, 1312]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f6e8e0"/>`).join('');
  // botones dorados con contorno oscuro
  s += [1522, 1593, 1665, 1737].map(y => `<circle cx="647" cy="${y}" r="15" fill="url(#tdBtn)" stroke="#3a1a10" stroke-width="4"/><circle cx="642" cy="${y - 5}" r="4" fill="#f4dc8a" opacity=".7"/>`).join('');
  // cabeza: crema con sombra cálida abajo/derecha y borde de luz frío a la izquierda
  s += `<circle cx="590" cy="775" r="375" fill="url(#tdH)"/><g clip-path="url(#tdHc)">
    <circle cx="560" cy="700" r="375" fill="none" stroke="#c89c8c" stroke-width="90" opacity=".35" filter="url(#tdSoft)" transform="translate(70,90)"/>
    <path d="M232,640 C214,780 236,940 330,1060" stroke="#e8eef2" stroke-width="16" fill="none" opacity=".9" stroke-linecap="round" filter="url(#tdS1)"/>
    <ellipse cx="590" cy="600" rx="330" ry="40" fill="#5a3a28" opacity=".35" filter="url(#tdSoft)"/>
  </g><circle cx="590" cy="775" r="375" fill="none" stroke="${K}" stroke-width="24"/>
  <path d="M960,800 A375,375 0 0 1 520,1145" stroke="${K}" stroke-width="18" fill="none" transform="translate(4,7)" stroke-linecap="round"/>`;
  s += face2d(f);
  // bombín: copa chocolate con brillo ancho arriba a la izquierda, sombra de la copa sobre el ala
  s += `<g transform="rotate(${o.hatTilt ?? 1.2},590,580)">
   <path d="${TD_BRIM}" fill="url(#tdBrim)"/>
   <path d="M200,594 C320,604 700,604 900,614 C950,614 990,606 1028,594" stroke="#2a1a12" stroke-width="9" fill="none" opacity=".8"/>
   <path d="M170,572 C300,560 860,552 1010,584" stroke="#8e7670" stroke-width="5" fill="none" opacity=".8"/><path d="${TD_BRIM}" fill="none" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
   <path d="${TD_CROWN}" fill="url(#tdHat)"/><g clip-path="url(#tdCc)">
     <path d="M300,500 C290,380 360,300 470,282" stroke="#8a6a5c" stroke-width="40" fill="none" opacity=".55" stroke-linecap="round" filter="url(#tdS2)"/>
     <path d="M286,450 C296,360 370,296 520,272" stroke="#c8a49a" stroke-width="8" fill="none" opacity=".85" stroke-linecap="round" filter="url(#tdS1)"/>
     
     <path d="M930,300 C960,420 940,520 900,600 L1000,600 L1000,280Z" fill="#1a0c06" opacity=".6" filter="url(#tdSoft)"/>
     <rect x="250" y="530" width="700" height="40" fill="#1a0c06" opacity=".55" filter="url(#tdS2)"/>
   </g><path d="${TD_CROWN}" fill="none" stroke="${K}" stroke-width="12" stroke-linejoin="round"/>
   <path d="M262,568 C450,556 760,552 925,566" stroke="#241206" stroke-width="16" fill="none" stroke-linecap="round"/>
  </g>`;
  return s;
}

function face2d(f) {
  const K = '#1e1313', BR = '#2a1918';
  let s = '';
  const browL = { serio: 'M458,762 C470,742 540,744 600,778 L598,798 C545,786 488,792 466,788 C452,786 450,772 458,762Z',
    preocupado: 'M456,806 C470,786 530,766 596,742 C606,740 610,758 602,766 C545,790 490,816 468,818 C452,818 448,814 456,806Z',
    sorpresa: 'M462,728 C480,700 560,700 598,720 L596,742 C545,728 490,730 470,744 C456,750 452,738 462,728Z' };
  const flip = d => d.replace(/(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/g, (m, x, _, y) => `${1210 - +x},${y}`);
  const bl = f === 'preocupado' ? browL.serio : (browL[f] || browL.serio), rl = f === 'preocupado' ? [`rotate(-24,528,775) translate(0,6)`, `rotate(24,682,775) translate(0,6)`] : ['', ''];
  s += `<path d="${bl}" transform="${rl[0]}" fill="${BR}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="${flip(bl)}" transform="${rl[1]}" fill="${BR}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`;
  if (f === 'sorpresa') s += `<ellipse cx="512" cy="850" rx="34" ry="44" fill="${K}"/><ellipse cx="698" cy="850" rx="34" ry="44" fill="${K}"/><circle cx="522" cy="836" r="7" fill="#fff" opacity=".5"/><circle cx="708" cy="836" r="7" fill="#fff" opacity=".5"/>`;
  else if (f === 'feliz') s += `<path d="M450,860 Q512,800 575,860 M635,860 Q698,800 760,860" stroke="${K}" stroke-width="24" fill="none" stroke-linecap="round"/>`;
  else { const dy = f === 'preocupado' ? 8 : 0;
    s += `<path d="M466,${846 + dy} A46,50 0 0 0 558,${846 + dy}Z" fill="${K}"/><path d="M652,${850 + dy} A46,50 0 0 0 744,${850 + dy}Z" fill="${K}"/>`;
    s += `<path d="M446,${840 + dy} L582,${843 + dy} M630,${846 + dy} L766,${849 + dy}" stroke="${K}" stroke-width="20" stroke-linecap="round"/>`; }
  // bigote: marrón oscuro, más claro arriba, contorno grueso
  s += `<path d="${TD_MUST}" fill="url(#tdMu)"/><g clip-path="url(#tdMc)">
    <path d="M428,1030 C424,975 470,940 540,936 C570,935 590,945 600,948 C610,945 630,935 660,936 C730,940 776,975 772,1030" stroke="#5e321c" stroke-width="34" fill="none" opacity=".7" stroke-linecap="round" filter="url(#tdS2)"/>
  </g><path d="${TD_MUST}" fill="none" stroke="${K}" stroke-width="24" stroke-linejoin="round"/>`;
  // boca
  if (f === 'sorpresa') s += `<ellipse cx="600" cy="1050" rx="26" ry="30" fill="#4a1c1e" stroke="${K}" stroke-width="10"/>`;
  else if (f === 'feliz') s += `<path d="M560,1010 Q600,1060 645,1010" stroke="${K}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M588,1000 C600,1018 618,1026 640,1012" stroke="${K}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  return s;
}

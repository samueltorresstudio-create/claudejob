// Más personajes 2D del mismo estilo (ref .99). Mismo sistema de coordenadas que tendero2d.js (cabeza 590,775 R375, fotograma 1170x2080).
// Requiere tendero2d.js (TD_BODY, filtros tdSoft/tdS1/tdS2 definidos dentro de cada personaje).
const PK = '#1e1313';
function pjDefs(id, c) { // gradientes por personaje (c = colores de la prenda)
  return `<defs>
  <radialGradient id="${id}H" cx=".46" cy=".36" r=".66"><stop offset="0" stop-color="#fdf4d8"/><stop offset=".45" stop-color="#f5e4bc"/><stop offset=".8" stop-color="#ecd0b0"/><stop offset="1" stop-color="#d8b49c"/></radialGradient>
  <radialGradient id="${id}B" cx=".28" cy=".3" r=".95"><stop offset="0" stop-color="${c[0]}"/><stop offset=".4" stop-color="${c[1]}"/><stop offset=".75" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></radialGradient>
  <filter id="${id}So" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="${id}S2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="${id}S1"><feGaussianBlur stdDeviation="2.5"/></filter>
  <clipPath id="${id}Hc"><circle cx="590" cy="775" r="375"/></clipPath>
 </defs>`;
}
function pjArms(o, col = '#261717') {
  const armL = o.armL || 'M305,1260 C250,1400 215,1600 205,1760', handL = o.handL || [205, 1770];
  const armR = o.armR || 'M888,1270 C930,1420 965,1600 985,1745', handR = o.handR || [985, 1755];
  const hand = ([x, y]) => `<circle cx="${x}" cy="${y}" r="44" fill="${col}"/><circle cx="${x - 14}" cy="${y - 16}" r="12" fill="#5a4440" opacity=".45"/>`;
  return `<path d="${armL}" stroke="${col}" stroke-width="26" fill="none" stroke-linecap="round"/>${hand(handL)}<path d="${armR}" stroke="${col}" stroke-width="26" fill="none" stroke-linecap="round"/>${hand(handR)}`;
}
function pjBody(id, path, clip) { // cuerpo con sombra interior derecha/abajo, luz a la izquierda y sombra de la cabeza
  return `<clipPath id="${id}Bc"><path d="${clip || path}"/></clipPath><path d="${path}" fill="url(#${id}B)"/><g clip-path="url(#${id}Bc)">
    <path d="${path}" fill="none" stroke="#06040a" stroke-width="110" opacity=".55" filter="url(#${id}So)" transform="translate(-50,-20)"/>
    <path d="${path}" fill="none" stroke="#ffffff" stroke-width="40" opacity=".14" filter="url(#${id}S2)" transform="translate(22,10)"/>
    <ellipse cx="600" cy="1100" rx="400" ry="100" fill="#06040a" opacity=".75" filter="url(#${id}So)"/>
    ${'%IN%'}
  </g><path d="${path}" fill="none" stroke="${PK}" stroke-width="30" stroke-linejoin="round"/>`;
}
function pjHead(id) {
  return `<circle cx="590" cy="775" r="375" fill="url(#${id}H)"/><g clip-path="url(#${id}Hc)">
    <circle cx="560" cy="700" r="375" fill="none" stroke="#c89c8c" stroke-width="90" opacity=".35" filter="url(#${id}So)" transform="translate(70,90)"/>
    <path d="M232,640 C214,780 236,940 330,1060" stroke="#e8eef2" stroke-width="16" fill="none" opacity=".9" stroke-linecap="round" filter="url(#${id}S1)"/>
  </g><circle cx="590" cy="775" r="375" fill="none" stroke="${PK}" stroke-width="24"/>
  <path d="M960,800 A375,375 0 0 1 520,1145" stroke="${PK}" stroke-width="18" fill="none" transform="translate(4,7)" stroke-linecap="round"/>`;
}

// ---------- CAJERO: chaqueta verde, camisa amarilla, corbata granate, pelo negro engominado, bigote de manillar ----------
function cajero2d(o = {}) {
  const id = 'cj', f = o.face || 'picaro';
  let s = pjDefs(id, ['#3a7048', '#2a5a3c', '#22452f', '#14261c']);
  s += `<path d="M478,1880 L470,2100 M712,1880 L722,2100" stroke="#261717" stroke-width="30" stroke-linecap="round"/>` + pjArms(o);
  let inner = `<path d="M520,1210 L560,1420 M680,1210 L640,1420" stroke="#14261c" stroke-width="10" opacity=".7" filter="url(#${id}S1)"/>
    <path d="M440,1640 L540,1642 M760,1638 L860,1632" stroke="#10201a" stroke-width="12" stroke-linecap="round" filter="url(#${id}S1)"/>
    <path d="M650,1430 L648,1880" stroke="#10201a" stroke-width="5" opacity=".6"/>`;
  s += pjBody(id, TD_BODY).replace('%IN%', inner);
  // camisa amarilla en pico, corbata granate larga, solapas
  s += `<path d="M560,1180 L740,1180 L650,1330Z" fill="#efbf42" stroke="${PK}" stroke-width="7" stroke-linejoin="round"/><path d="M560,1180 L610,1260 L650,1330Z" fill="#d6a22e" opacity=".6"/>`;
  s += `<path d="M632,1196 L668,1196 L662,1230 L680,1440 L650,1480 L620,1440 L638,1230Z" fill="#8a2420" stroke="${PK}" stroke-width="7" stroke-linejoin="round"/><path d="M640,1240 L630,1430" stroke="#b03a30" stroke-width="6" opacity=".6"/>`;
  s += `<path d="M540,1180 L600,1330 L640,1470" stroke="${PK}" stroke-width="8" fill="none" opacity=".85"/><path d="M760,1180 L700,1330 L660,1470" stroke="${PK}" stroke-width="8" fill="none" opacity=".85"/>`;
  // bolsillo de pecho con lápiz y botones de latón
  s += `<rect x="410" y="1400" width="90" height="70" rx="8" fill="#2e5e40" stroke="${PK}" stroke-width="6"/><rect x="446" y="1372" width="14" height="44" rx="4" fill="#e0902a" stroke="${PK}" stroke-width="4"/>`;
  s += [1540, 1620, 1700].map(y => `<circle cx="600" cy="${y}" r="14" fill="#c49e36" stroke="#3a1a10" stroke-width="4"/><circle cx="596" cy="${y - 4}" r="4" fill="#f4dc8a" opacity=".7"/>`).join('');
  s += pjHead(id);
  // pelo negro pegado (casquete) con raya
  s += `<path d="M228,700 C230,470 380,395 590,395 C800,395 950,470 952,700 C930,640 900,600 860,580 C760,540 640,548 560,560 C470,572 380,600 330,640 C290,672 250,700 228,700Z" fill="#2a1c1a" stroke="${PK}" stroke-width="12" stroke-linejoin="round"/>
   <path d="M330,520 C420,450 560,430 700,440" stroke="#6a5a58" stroke-width="12" fill="none" opacity=".6" stroke-linecap="round"/>
   <path d="M228,700 C226,760 232,800 240,830 L262,830 C258,780 256,740 262,700Z" fill="#2a1c1a" stroke="${PK}" stroke-width="8"/><path d="M952,700 C954,760 948,800 940,830 L918,830 C922,780 924,740 918,700Z" fill="#2a1c1a" stroke="${PK}" stroke-width="8"/>`;
  // cara: cejas arqueadas, ojos de rendija contentos, bigote de manillar negro, sonrisa ladeada
  const K = PK;
  if (f === 'sorpresa') s += `<path d="M450,690 Q510,640 570,690 M640,690 Q700,640 760,690" stroke="${K}" stroke-width="26" fill="none" stroke-linecap="round"/><ellipse cx="510" cy="790" rx="30" ry="38" fill="${K}"/><ellipse cx="700" cy="790" rx="30" ry="38" fill="${K}"/>`;
  else s += `<path d="M450,${f === 'serio' ? 730 : 715} Q510,${f === 'serio' ? 705 : 675} 570,${f === 'serio' ? 725 : 715} M640,${f === 'serio' ? 725 : 715} Q700,${f === 'serio' ? 705 : 675} 760,${f === 'serio' ? 730 : 715}" stroke="${K}" stroke-width="26" fill="none" stroke-linecap="round"/>
    <path d="M460,${f === 'serio' ? 800 : 805} Q510,${f === 'serio' ? 790 : 780} 560,${f === 'serio' ? 800 : 805} M650,${f === 'serio' ? 800 : 805} Q700,${f === 'serio' ? 790 : 780} 750,${f === 'serio' ? 800 : 805}" stroke="${K}" stroke-width="22" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M600,850 C560,836 500,840 470,870 C440,900 430,930 400,928 C420,960 470,958 510,930 C540,912 570,900 600,906 C630,900 660,912 690,930 C730,958 780,960 800,928 C770,930 760,900 730,870 C700,840 640,836 600,850Z" fill="#2c1d1b" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`;
  if (f === 'sorpresa') s += `<ellipse cx="600" cy="985" rx="26" ry="32" fill="#4a1c1e" stroke="${K}" stroke-width="10"/>`;
  else if (f === 'serio') s += `<path d="M560,975 L640,975" stroke="${K}" stroke-width="14" stroke-linecap="round"/>`;
  else s += `<path d="M560,965 Q620,1010 670,950" stroke="${K}" stroke-width="15" fill="none" stroke-linecap="round"/>`;
  return s;
}

// ---------- CLIENTA: pañuelo rojo de lunares, melena castaña, blusa verde, camisa gris, falda azul larga ----------
function clienta2d(o = {}) {
  const id = 'cl', f = o.face || 'contenta';
  let s = pjDefs(id, ['#4a7a40', '#3c6534', '#2e5028', '#1c3018']);
  s += `<defs><radialGradient id="${id}Sk" cx=".3" cy=".2" r="1"><stop offset="0" stop-color="#40507a"/><stop offset=".5" stop-color="#2e3d5e"/><stop offset="1" stop-color="#182438"/></radialGradient>
    <pattern id="${id}Dot" width="96" height="84" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="13" fill="#f4e6dc"/><circle cx="68" cy="62" r="13" fill="#f4e6dc"/></pattern></defs>`;
  // melena castaña por detrás (lado izquierdo)
  s += `<path d="M260,640 C190,760 200,980 270,1120 C300,1180 360,1200 400,1170 C340,1060 320,900 340,720Z" fill="#5a3018" stroke="${PK}" stroke-width="12" stroke-linejoin="round"/>`;
  s += pjArms(o);
  // falda azul larga (tapa las piernas) y blusa
  s += `<path d="M300,1560 C300,1540 900,1540 905,1560 L960,2080 L250,2080Z" fill="url(#${id}Sk)" stroke="${PK}" stroke-width="26" stroke-linejoin="round"/>
    <path d="M330,1600 L300,2060" stroke="#4a5a84" stroke-width="16" opacity=".5"/><path d="M780,1600 L840,2060" stroke="#10182a" stroke-width="30" opacity=".5"/>`;
  const BL = 'M300,1230 C320,1110 450,1060 600,1060 C750,1060 880,1110 900,1230 C916,1400 912,1520 905,1590 C800,1610 400,1610 298,1590 C290,1520 286,1400 300,1230Z';
  s += pjBody(id, BL).replace('%IN%', `<path d="M600,1250 L600,1590" stroke="#1c3018" stroke-width="5" opacity=".6"/>`);
  // camisa gris con cuello en el escote
  s += `<path d="M530,1180 L670,1180 L640,1400 L600,1430 L560,1400Z" fill="#a89c88" stroke="${PK}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M530,1180 L600,1260 L560,1300Z M670,1180 L600,1260 L640,1300Z" fill="#c8bca8" stroke="${PK}" stroke-width="5" stroke-linejoin="round"/>
    ${[1320, 1370].map(y => `<circle cx="600" cy="${y}" r="7" fill="#e8e0d0" stroke="${PK}" stroke-width="3"/>`).join('')}`;
  s += pjHead(id);
  // pañuelo rojo de lunares anudado
  s += `<path d="M215,700 C200,430 380,330 600,330 C840,330 990,440 975,700 C900,600 760,560 600,560 C440,560 300,610 215,700Z" fill="#8a2222" stroke="${PK}" stroke-width="14" stroke-linejoin="round"/>
    <path d="M215,700 C200,430 380,330 600,330 C840,330 990,440 975,700 C900,600 760,560 600,560 C440,560 300,610 215,700Z" fill="url(#${id}Dot)" opacity=".9"/>
    <path d="M300,470 C400,390 520,370 640,372" stroke="#c85a5a" stroke-width="16" fill="none" opacity=".5" stroke-linecap="round"/>
    <path d="M940,520 C1010,500 1060,540 1050,600 C1020,580 990,575 960,590Z" fill="#7a1c1c" stroke="${PK}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M950,560 C1000,600 1010,660 980,700 C965,660 950,630 930,610Z" fill="#7a1c1c" stroke="${PK}" stroke-width="10" stroke-linejoin="round"/>`;
  // flequillo castaño saliendo del pañuelo
  s += `<path d="M230,690 C300,610 400,590 450,600 C400,640 360,700 340,790 C300,760 260,730 230,690Z" fill="#5a3018" stroke="${PK}" stroke-width="10" stroke-linejoin="round"/><path d="M270,690 C320,650 370,630 410,628" stroke="#8a5030" stroke-width="8" fill="none" opacity=".6"/>`;
  // cara: cejas finas, ojos de punto grandes con brillo, sonrisa
  const K = PK, ey = f === 'sorpresa' ? 790 : 800;
  s += `<path d="M460,${f === 'sorpresa' ? 680 : 705} Q510,${f === 'sorpresa' ? 655 : 690} 560,${f === 'sorpresa' ? 680 : 705} M640,${f === 'sorpresa' ? 680 : 705} Q690,${f === 'sorpresa' ? 655 : 690} 740,${f === 'sorpresa' ? 680 : 705}" stroke="${K}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  if (f === 'picara') s += `<path d="M470,${ey} Q510,${ey - 34} 550,${ey}" stroke="${K}" stroke-width="20" fill="none" stroke-linecap="round"/><ellipse cx="690" cy="${ey}" rx="30" ry="38" fill="${K}"/><circle cx="700" cy="${ey - 12}" r="9" fill="#fff" opacity=".8"/>`;
  else s += `<ellipse cx="510" cy="${ey}" rx="30" ry="${f === 'sorpresa' ? 44 : 38}" fill="${K}"/><ellipse cx="690" cy="${ey}" rx="30" ry="${f === 'sorpresa' ? 44 : 38}" fill="${K}"/><circle cx="520" cy="${ey - 12}" r="9" fill="#fff" opacity=".8"/><circle cx="700" cy="${ey - 12}" r="9" fill="#fff" opacity=".8"/>`;
  if (f === 'sorpresa') s += `<ellipse cx="600" cy="950" rx="30" ry="36" fill="#4a1c1e" stroke="${K}" stroke-width="10"/>`;
  else s += `<path d="M540,925 Q600,975 660,925" stroke="${K}" stroke-width="15" fill="none" stroke-linecap="round"/>`;
  s += `<ellipse cx="440" cy="900" rx="40" ry="22" fill="#e89090" opacity=".35" filter="url(#${id}S2)"/><ellipse cx="760" cy="900" rx="40" ry="22" fill="#e89090" opacity=".35" filter="url(#${id}S2)"/>`;
  return s;
}

// 79 · VACA v2 (tras la revisión de personajes): patas con rodilla y pezuña hendida, papada, flequillo rizado, cuernos cortos y gruesos,
// morro con volumen (labio, brillo húmedo, pelillos), visor con correa por detrás de los cuernos + espuma + LED, variantes con silueta distinta,
// id único por instancia y parámetros de animación (masticar de lado, mugir, orejas, cola con retraso, respiración, cabeza).
// o: { id, seed, var:'frisona'|'gorda'|'joven'|'blanca'|'negra'|'parda', vr, face:'serio'|'feliz'|'sorpresa'|'muge'|'relajada',
//      tag, chew (−1..1 lado de la mandíbula), earL, earR (grados), tail (grados de balanceo), breath (0..1), head [dx,dy,rot], look [dx,dy], blink, screen (fase del prado del visor), vrGlow }
function vaca2d(o = {}) {
  const v = o.var || 'frisona', sd = o.seed || 0, id = o.id || ('vk' + sd + v), f = o.face || 'serio', K = TK;
  const rnd = (i, k) => { const x = Math.sin((i + sd * 13.1) * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const PAL = { frisona: ['#ffffff', '#f2f0ec', '#d4d6de', '#9aa0b0'], gorda: ['#ffffff', '#f2f0ec', '#d4d6de', '#9aa0b0'], joven: ['#ffffff', '#f4f2ee', '#d8dae2', '#a0a6b6'], blanca: ['#ffffff', '#f6f4ef', '#dcdee6', '#a6acba'],
    negra: ['#4a4450', '#2e2a34', '#1c1a22', '#0c0a10'], parda: ['#d0a070', '#b07e4e', '#86582e', '#4a2c14'] }[v];
  const SP = v === 'parda' ? '#6a3c18' : v === 'negra' ? '#f4f2ee' : '#1e1a1c';
  const nSpots = v === 'blanca' ? 2 : v === 'negra' ? 0 : v === 'parda' ? 3 : 7;
  const chew = o.chew || 0, lk = o.look || [0, 0], blk = (o.blink || 0) > .5, br = 1 + (o.breath || 0) * .025;
  const blob = (cx, cy, r, i) => { let d = ''; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, rr = r * (.7 + .5 * rnd(i, k)); d += (k ? 'L' : 'M') + (cx + Math.cos(a) * rr * 1.2).toFixed(0) + ',' + (cy + Math.sin(a) * rr).toFixed(0); } return d + 'Z'; };
  const BW = v === 'gorda' ? 1.13 : v === 'joven' ? .84 : 1, BYt = v === 'joven' ? 1060 : 1000;
  const bx = x => (595 + (x - 595) * BW).toFixed(0);
  const BODY = `M${bx(160)},1300 C${bx(160)},1080 ${bx(340)},${BYt} 595,${BYt} C${bx(850)},${BYt} ${bx(1030)},1080 ${bx(1030)},1300 C${bx(1030)},1520 ${bx(900)},1650 595,1650 C${bx(290)},1650 ${bx(160)},1520 ${bx(160)},1300Z`;
  const HEAD = 'M595,560 C722,560 802,612 808,724 C814,862 772,1000 762,1110 C750,1210 700,1260 595,1262 C490,1260 440,1210 428,1110 C418,1000 376,862 382,724 C388,612 468,560 595,560Z';
  const LW = v === 'joven' ? .82 : v === 'gorda' ? 1.12 : 1;
  // pata con rodilla, caña fina, menudillo y pezuña de dos dedos
  const leg = (x, y0, y1, w0, back, i) => { const w = w0 * LW, a = w / 2, yk = y0 + (y1 - y0) * .5, c = back ? PAL[2] : PAL[1];
    const d = `M${x - a},${y0} C${x - a - 8},${(y0 + yk) / 2} ${x - w * .5},${yk - 34} ${x - w * .46},${yk} C${x - w * .4},${yk + 44} ${x - w * .3},${y1 - 170} ${x - w * .33},${y1 - 86} L${x + w * .33},${y1 - 86} C${x + w * .3},${y1 - 170} ${x + w * .4},${yk + 44} ${x + w * .46},${yk} C${x + w * .5},${yk - 34} ${x + a + 8},${(y0 + yk) / 2} ${x + a},${y0}Z`;
    const toe = s => `M${x + s * 4},${y1 - 84} L${x + s * w * .38},${y1 - 84} C${x + s * w * .44},${y1 - 50} ${x + s * w * .44},${y1 - 14} ${x + s * w * .34},${y1 - 2} L${x + s * 4},${y1 - 2}Z`;
    return `<path d="${d}" fill="${c}" stroke="${K}" stroke-width="12" stroke-linejoin="round"/>
      ${!back && v !== 'negra' && rnd(i, 3) > .45 ? `<path d="M${x - a + 6},${y0 + 30} C${x},${y0 + 10} ${x + a - 6},${y0 + 50} ${x + a - 8},${y0 + 150} C${x},${y0 + 180} ${x - a + 8},${y0 + 140} ${x - a + 6},${y0 + 30}Z" fill="${SP}" opacity="${v === 'blanca' ? 0 : 1}"/>` : ''}
      <ellipse cx="${x}" cy="${yk}" rx="${w * .42}" ry="26" fill="#fff" opacity="${back ? .08 : .3}"/><path d="M${x - w * .4},${yk + 6} Q${x},${yk + 22} ${x + w * .4},${yk + 6}" stroke="${PAL[3]}" stroke-width="6" fill="none" opacity=".6"/>
      <path d="M${x - w * .36},${y1 - 96} Q${x},${y1 - 82} ${x + w * .36},${y1 - 96}" stroke="${PAL[3]}" stroke-width="7" fill="none" opacity=".55"/>
      <path d="${toe(-1)}" fill="#2a1e1a" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><path d="${toe(1)}" fill="#2a1e1a" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M${x - w * .28},${y1 - 70} L${x - w * .3},${y1 - 20}" stroke="#5a4a44" stroke-width="6" opacity=".7" stroke-linecap="round"/>
      <path d="M${x - a + 14},${y0 + 30} C${x - a + 6},${y0 + 150} ${x - w * .36},${yk} ${x - w * .3},${y1 - 120}" stroke="#fff" stroke-width="9" fill="none" opacity="${back ? .12 : .5}" stroke-linecap="round"/>`; };
  const spots = [...Array(nSpots)].map((_, i) => `<path d="${blob(240 + rnd(i, 1) * 720, 1070 + rnd(i, 2) * 500, 70 + rnd(i, 4) * 90, i)}" fill="${SP}"/>`).join('');
  // cola con retraso (3 tramos: cada uno gira algo más que el anterior → latigazo)
  const ta = (o.tail || 0) * Math.PI / 180, tx0 = +bx(1010), ty0 = 1270;
  const seg = (x, y, ang, L) => [x + Math.sin(ang) * L, y + Math.cos(ang) * L];
  const t1 = seg(tx0 + 30, ty0 + 40, .25 + ta * .5, 170), t2 = seg(...t1, .1 + ta * 1.0, 160), t3 = seg(...t2, -.05 + ta * 1.6, 130);
  const tailD = `M${tx0},${ty0} Q${tx0 + 46},${ty0 + 30} ${t1[0].toFixed(0)},${t1[1].toFixed(0)} T${t2[0].toFixed(0)},${t2[1].toFixed(0)} T${t3[0].toFixed(0)},${t3[1].toFixed(0)}`;
  const eyes = () => { if (o.vr) return '';
    if (f === 'feliz' || f === 'relajada') return f === 'feliz' ? `<path d="M470,846 Q512,800 556,846 M636,846 Q678,800 722,846" stroke="${K}" stroke-width="20" fill="none" stroke-linecap="round"/>`
      : `<path d="M466,836 Q512,856 558,836 M632,836 Q678,856 724,836" stroke="${K}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M466,830 L558,826 M632,826 L724,830" stroke="${K}" stroke-width="10" stroke-linecap="round"/>`;
    const e = (cx, cy, s) => `<ellipse cx="${cx}" cy="${cy}" rx="46" ry="${f === 'sorpresa' || f === 'muge' ? 50 : 40}" fill="#fbf6ee" stroke="${K}" stroke-width="10"/>${blk ? `<path d="M${cx - 48},${cy} L${cx + 48},${cy}" stroke="${K}" stroke-width="16" stroke-linecap="round"/>` : `<circle cx="${cx + lk[0]}" cy="${cy + 6 + lk[1]}" r="26" fill="#2a1a14"/><circle cx="${cx + lk[0] - 9}" cy="${cy - 4 + lk[1]}" r="8" fill="#fff"/>`}
      ${f === 'sorpresa' || f === 'muge' ? '' : `<path d="M${cx - 52},${cy - 10} Q${cx},${cy - 46} ${cx + 52},${cy - 10}" stroke="${K}" stroke-width="14" fill="none" stroke-linecap="round"/>`}<path d="M${cx + s * 40},${cy - 22} l${s * 26},-22 M${cx + s * 48},${cy - 8} l${s * 30},-8" stroke="${K}" stroke-width="8" stroke-linecap="round"/>`;
    return e(510, 836, -1) + e(680, 836, 1); };
  const ph = o.screen || 0;
  const vrStrap = () => !o.vr ? '' : `<path d="M372,790 C330,700 360,600 470,588 C540,580 650,580 720,588 C830,600 860,700 818,790" stroke="#1a1a22" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M380,770 C350,700 380,620 470,606" stroke="#4a4a5a" stroke-width="8" fill="none" opacity=".8" stroke-linecap="round"/>`;
  const vr = () => !o.vr ? '' : `
    <rect x="360" y="708" width="470" height="224" rx="70" fill="#8a8a96" stroke="${K}" stroke-width="12"/>
    <rect x="372" y="716" width="446" height="208" rx="62" fill="url(#${id}VR)" stroke="${K}" stroke-width="14"/>
    <rect x="404" y="748" width="382" height="140" rx="40" fill="${o.vrGlow === false ? '#1a1a26' : `url(#${id}VRs)`}" stroke="#0a0a10" stroke-width="10"/>
    ${o.vrGlow === false ? '' : `<g clip-path="url(#${id}VRc)">${o.screenShow ? `<path d="M404,${846 + Math.sin(ph) * 4} C470,812 560,830 640,812 C700,800 760,816 786,830 L786,888 L404,888Z" fill="#6ac04a"/><path d="M404,866 C500,850 620,862 786,850 L786,888 L404,888Z" fill="#4a9a30"/>
      ${[[470, 862], [540, 872], [620, 858], [700, 870], [740, 856]].map(([x, y], i) => `<circle cx="${(x + ph * 30) % 400 + 400}" cy="${y}" r="7" fill="${['#fff', '#ffd84a', '#ff7ab8'][i % 3]}"/>`).join('')}<circle cx="720" cy="782" r="18" fill="#fff6c8"/><path d="M${440 + (ph * 20) % 300},790 c30,-20 80,-20 100,0z" fill="#fff" opacity=".9"/>`
      : `<rect x="404" y="748" width="382" height="140" fill="#cfeaff" opacity=".5"/><ellipse cx="595" cy="818" rx="150" ry="50" fill="#ffffff" opacity=".55"/>`}</g>
    <path d="M420,760 C470,744 560,742 600,748" stroke="#fff" stroke-width="10" fill="none" opacity=".55" stroke-linecap="round"/>`}
    <circle cx="790" cy="738" r="9" fill="#5fe08a"/><circle cx="790" cy="738" r="20" fill="#5fe08a" opacity=".3"/>
    ${o.vrCable ? `<path d="M800,900 C850,1000 860,1150 820,1300" stroke="#1a1a22" stroke-width="10" fill="none"/>` : ''}`;
  const mouthY = 1318, mx = chew * 14;
  const mouth = f === 'muge' ? `<ellipse cx="${595 + mx}" cy="1350" rx="70" ry="58" fill="#5a1c20" stroke="${K}" stroke-width="12"/><ellipse cx="${595 + mx}" cy="1382" rx="40" ry="20" fill="#d86a74"/>`
    : f === 'feliz' || f === 'relajada' ? `<path d="M${520 + mx},${mouthY} C${560 + mx},${mouthY + 44} ${630 + mx},${mouthY + 44} ${670 + mx},${mouthY}" stroke="${K}" stroke-width="14" fill="none" stroke-linecap="round"/>`
    : f === 'sorpresa' ? `<ellipse cx="${595 + mx}" cy="1336" rx="32" ry="26" fill="#5a1c20" stroke="${K}" stroke-width="10"/>` : `<path d="M${540 + mx},${1326} Q${595 + mx},${1318} ${650 + mx},${1326}" stroke="${K}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  const earL = o.earL || 0, earR = o.earR || 0, H = o.head || [0, 0, 0];
  const horns = v === 'parda' ? 'M470,622 C400,610 330,560 300,470 C350,520 420,540 500,560Z M720,622 C790,610 860,560 890,470 C840,520 770,540 690,560Z'
    : v === 'joven' ? 'M480,612 C460,596 448,570 446,546 C470,566 490,576 506,584Z M710,612 C730,596 742,570 744,546 C720,566 700,576 684,584Z'
    : 'M468,620 C436,604 412,578 404,530 C430,550 470,560 506,572Z M722,620 C754,604 778,578 786,530 C760,550 720,560 684,572Z';
  const headCol = v === 'negra' ? PAL[1] : PAL[0];
  const svg = `<defs>
    <radialGradient id="${id}B" cx=".3" cy=".25" r=".95"><stop offset="0" stop-color="${PAL[0]}"/><stop offset=".45" stop-color="${PAL[1]}"/><stop offset=".78" stop-color="${PAL[2]}"/><stop offset="1" stop-color="${PAL[3]}"/></radialGradient>
    <radialGradient id="${id}Hd" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="${headCol}"/><stop offset=".55" stop-color="${PAL[1]}"/><stop offset="1" stop-color="${PAL[2]}"/></radialGradient>
    <radialGradient id="${id}Mz" cx=".4" cy=".32" r=".8"><stop offset="0" stop-color="#f4d6c2"/><stop offset=".65" stop-color="#e0b098"/><stop offset="1" stop-color="#c08a76"/></radialGradient>
    <linearGradient id="${id}VR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4a5a"/><stop offset=".5" stop-color="#2a2a36"/><stop offset="1" stop-color="#14141c"/></linearGradient>
    <linearGradient id="${id}VRs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ac8ff"/><stop offset="1" stop-color="#d8f0ff"/></linearGradient>
    <linearGradient id="${id}Hn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ece2c8"/><stop offset=".7" stop-color="#c8b898"/><stop offset="1" stop-color="#8a7a5c"/></linearGradient>
    <radialGradient id="${id}Bell" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe89a"/><stop offset=".5" stop-color="#d8a83a"/><stop offset="1" stop-color="#8a6418"/></radialGradient>
    <clipPath id="${id}Bc"><path d="${BODY}"/></clipPath><clipPath id="${id}Hc"><path d="${HEAD}"/></clipPath><clipPath id="${id}VRc"><rect x="404" y="748" width="382" height="140" rx="40"/></clipPath>
    <filter id="${id}So" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter><filter id="${id}S1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>
  ${leg(+bx(330), 1450, 2040, 92, 1, 0)}${leg(+bx(860), 1450, 2040, 92, 1, 1)}
  <path d="${tailD}" stroke="${K}" stroke-width="24" fill="none" stroke-linecap="round"/><path d="${tailD}" stroke="${PAL[1]}" stroke-width="11" fill="none" stroke-linecap="round"/>
  <g transform="translate(${t3[0].toFixed(0)},${t3[1].toFixed(0)}) rotate(${(-(-.05 + ta * 1.6) * 57.3).toFixed(1)})"><path d="M0,-10 C-30,20 -26,90 0,120 C26,90 30,20 0,-10Z" fill="${v === 'blanca' || v === 'joven' ? '#e8e2d8' : SP === '#f4f2ee' ? '#2a2630' : SP}" stroke="${K}" stroke-width="9"/></g>
  <g transform="translate(595,1325) scale(1,${br.toFixed(4)}) translate(-595,-1325)"><path d="${BODY}" fill="url(#${id}B)"/><g clip-path="url(#${id}Bc)">${spots}<path d="${BODY}" fill="none" stroke="#1a2040" stroke-width="140" opacity=".22" filter="url(#${id}So)" transform="translate(40,40)"/>
    <ellipse cx="${bx(380)}" cy="1110" rx="150" ry="70" fill="#fff" opacity="${v === 'negra' ? .1 : .22}" filter="url(#${id}So)"/><ellipse cx="595" cy="1640" rx="380" ry="60" fill="#3a3a58" opacity=".22" filter="url(#${id}So)"/></g><path d="${BODY}" fill="none" stroke="${K}" stroke-width="18"/></g>
  <ellipse cx="595" cy="1690" rx="${120 * LW}" ry="58" fill="url(#${id}Mz)" stroke="${K}" stroke-width="10"/>${[540, 650].map(x => `<path d="M${595 + (x - 595) * LW},1730 L${595 + (x - 595) * LW + 4},1772" stroke="${K}" stroke-width="22" stroke-linecap="round"/><path d="M${595 + (x - 595) * LW},1730 L${595 + (x - 595) * LW + 4},1772" stroke="#e0b098" stroke-width="10" stroke-linecap="round"/>`).join('')}
  ${leg(+bx(450), 1560, 2098, 104, 0, 2)}${leg(+bx(740), 1560, 2098, 104, 0, 3)}
  <!-- papada (pliegue de piel bajo el cuello) -->
  <path d="M470,1240 C480,1380 540,1500 595,1540 C650,1500 710,1380 720,1240Z" fill="${PAL[1]}" stroke="${K}" stroke-width="14" stroke-linejoin="round"/><path d="M540,1330 C560,1420 580,1470 595,1490" stroke="${PAL[3]}" stroke-width="8" fill="none" opacity=".6"/>
  <g transform="translate(${H[0]},${H[1]}) rotate(${H[2]},595,1250)">
  <!-- cuernos, orejas (por encima de la correa del visor) y crotal -->
  ${vrStrap()}
  <path d="${horns}" fill="url(#${id}Hn)" stroke="${K}" stroke-width="13" stroke-linejoin="round"/><path d="M440,580 C430,560 424,548 422,540 M750,580 C760,560 766,548 768,540" stroke="#fff8e0" stroke-width="7" opacity=".7" stroke-linecap="round" fill="none"/>
  <g transform="rotate(${earL},400,720)"><path d="M396,700 C320,650 220,650 180,700 C230,760 320,780 400,760Z" fill="url(#${id}Hd)" stroke="${K}" stroke-width="14" stroke-linejoin="round"/><path d="M380,712 C320,690 250,690 220,708 C260,740 320,748 380,740Z" fill="#e0b098" opacity=".85"/><path d="M230,706 L210,700 M246,716 L226,716" stroke="#fff" stroke-width="5" opacity=".6"/></g>
  <g transform="rotate(${-earR},790,720)"><path d="M794,700 C870,650 970,650 1010,700 C960,760 870,780 790,760Z" fill="url(#${id}Hd)" stroke="${K}" stroke-width="14" stroke-linejoin="round"/><path d="M810,712 C870,690 940,690 970,708 C930,740 870,748 810,740Z" fill="#e0b098" opacity=".85"/>
    <g transform="translate(905,760) rotate(8)"><rect x="-34" y="-8" width="68" height="70" rx="12" fill="#f2c230" stroke="${K}" stroke-width="7"/><text x="0" y="42" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="${K}">${o.tag ?? (10 + Math.floor(rnd(5, 9) * 80))}</text></g></g>
  <!-- cabeza -->
  <path d="${HEAD}" fill="url(#${id}Hd)"/><g clip-path="url(#${id}Hc)">
    ${v === 'frisona' || v === 'gorda' ? `<path d="${blob(470 + rnd(9, 1) * 40, 820, 120, 9)}" fill="${SP}"/>` : ''}${v === 'negra' ? `<path d="M595,640 L620,700 L685,705 L635,745 L652,808 L595,772 L538,808 L555,745 L505,705 L570,700Z" fill="#f4f2ee"/>` : ''}
    ${v === 'parda' ? '<path d="M480,620 C540,700 650,700 710,620 L720,560 L470,560Z" fill="#4a2c14" opacity=".5"/>' : ''}
    <path d="${HEAD}" fill="none" stroke="#1a2040" stroke-width="90" opacity=".2" filter="url(#${id}So)" transform="translate(40,40)"/>
    <path d="M420,700 C410,820 430,960 470,1080" stroke="#fff" stroke-width="16" fill="none" opacity=".6" stroke-linecap="round" filter="url(#${id}S1)"/></g>
  <path d="${HEAD}" fill="none" stroke="${K}" stroke-width="18"/>
  <!-- flequillo rizado entre los cuernos -->
  ${[[520, 604, 34], [560, 584, 38], [604, 578, 40], [648, 588, 36], [684, 608, 30], [580, 622, 30], [630, 628, 28]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${v === 'parda' ? '#7a4a24' : v === 'negra' ? '#2a2630' : '#f4efe6'}" stroke="${K}" stroke-width="7"/><path d="M${x - r * .5},${y - r * .2} a${r * .5},${r * .5} 0 0 1 ${r * .7},${-r * .3}" stroke="#fff" stroke-width="5" opacity=".35" fill="none"/>`).join('')}
  ${eyes()}${vr()}
  <!-- morro con volumen: aro más claro, labio superior, brillo húmedo, pelillos -->
  <ellipse cx="${595 + mx * .5}" cy="${1218 + Math.abs(chew) * 4}" rx="204" ry="126" fill="${v === 'negra' ? '#5a4a50' : '#f6e6da'}" stroke="${K}" stroke-width="10" opacity=".9"/>
  <ellipse cx="${595 + mx * .5}" cy="${1220 + Math.abs(chew) * 4}" rx="188" ry="112" fill="url(#${id}Mz)" stroke="${K}" stroke-width="14"/>
  <ellipse cx="${528 + mx * .5}" cy="1212" rx="32" ry="24" fill="#5a2a24" stroke="${K}" stroke-width="7" transform="rotate(-18,528,1212)"/><ellipse cx="${662 + mx * .5}" cy="1212" rx="32" ry="24" fill="#5a2a24" stroke="${K}" stroke-width="7" transform="rotate(18,662,1212)"/>
  <path d="M${500 + mx * .5},1188 C520,1170 540,1170 552,1186 M${638 + mx * .5},1186 C650,1170 670,1170 690,1188" stroke="#b07a66" stroke-width="7" fill="none" opacity=".8"/>
  <path d="M${470 + mx * .5},1160 C510,1128 560,1122 590,1128" stroke="#fff" stroke-width="13" fill="none" opacity=".7" stroke-linecap="round"/><ellipse cx="${700 + mx * .5}" cy="1180" rx="18" ry="9" fill="#fff" opacity=".55"/>
  <path d="M${595 + mx * .5},1250 L${595 + mx * .5},1300" stroke="#b07a66" stroke-width="8" opacity=".7"/>
  ${[[440, 1250, -1], [452, 1272, -1], [750, 1250, 1], [738, 1272, 1]].map(([x, y, s]) => `<path d="M${x + mx * .5},${y} l${s * 34},${-6}" stroke="${K}" stroke-width="4" opacity=".6"/>`).join('')}
  ${mouth}
  <!-- collar y cencerro (sobre la papada) -->
  <path d="M440,1250 C480,1330 710,1330 750,1250" stroke="${K}" stroke-width="46" fill="none" stroke-linecap="round"/><path d="M440,1250 C480,1330 710,1330 750,1250" stroke="#8a4a24" stroke-width="30" fill="none" stroke-linecap="round"/>${[480, 540, 650, 710].map(x => `<circle cx="${x}" cy="${1290 + (x > 600 ? (x - 650) * -.3 : (x - 540) * .3)}" r="6" fill="#d8b040"/>`).join('')}
  </g>
  <path d="M552,1300 L638,1300 L656,1430 C630,1446 560,1446 534,1430Z" fill="url(#${id}Bell)" stroke="${K}" stroke-width="11" stroke-linejoin="round" transform="rotate(${(Math.sin((o.tail || 0) * .1) * 4).toFixed(1)},595,1300)"/><circle cx="595" cy="1440" r="16" fill="#5a3a10" stroke="${K}" stroke-width="6"/><path d="M566,1320 L558,1410" stroke="#fff8d0" stroke-width="9" opacity=".7" stroke-linecap="round"/>`;
  return `<ellipse cx="595" cy="2094" rx="${460 * BW}" ry="46" fill="#140a06" opacity=".45" filter="url(#${id}So)"/>` + pjOutline(id, svg);
}

// ---------------- IZZET v2 (más corpulento, bigote que deja ver el labio, arrugas de risa, lunar; o.invierno → bufanda roja y guantes)
const IZ2_BODY = 'M280,1190 C292,1086 460,1060 595,1060 C730,1060 898,1086 910,1190 C960,1340 960,1530 915,1675 C870,1795 740,1832 595,1832 C450,1832 320,1795 275,1675 C230,1530 230,1340 280,1190Z';
const IZ2_MUST = 'M600,915 C560,895 480,898 450,936 C428,962 430,996 452,1000 C470,1002 476,980 496,972 C530,962 570,968 600,974 C630,968 670,962 704,972 C724,980 730,1002 748,1000 C770,996 772,962 750,936 C720,898 640,895 600,915Z';
function granjero2d(o = {}) {
  const hold = o.hold || null;
  return pjT(Object.assign({
    id: 'iz', gloves: o.invierno ? '#5a4a3a' : undefined, bodyPath: IZ2_BODY, bodyEdge: 'M900,1420 C930,1600 860,1780 600,1834', shadowW: 330,
    top: ['#8a9a5a', '#6a7a3e', '#4a5a28', '#2a3414', '#b0c080', '#d8e4b0'], hatC: ['#8a8478', '#6a645a', '#4a463e', '#2a2622'], brow: '#1a1210', armW: 30,
    legs: legsAt(505, 685, 1820),
    armL: 'M300,1280 C250,1410 222,1550 218,1680', handL: [218, 1690],
    armR: hold === 'movil' ? 'M880,1280 C900,1330 890,1350 870,1360' : hold ? 'M880,1280 C940,1360 970,1420 990,1480' : 'M880,1280 C930,1410 960,1550 964,1680', handR: hold === 'movil' ? [870, 1362] : hold ? [990, 1486] : [964, 1690],
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
      ${hold === 'vr' ? `<g transform="translate(1040,1470) rotate(-10) scale(1.35)"><path d="M-130,-10 C-170,-60 -160,-90 -120,-100" stroke="#1a1a22" stroke-width="22" fill="none" stroke-linecap="round"/>
        <rect x="-120" y="-70" width="240" height="120" rx="40" fill="#2a2a36" stroke="${TK}" stroke-width="12"/><rect x="-96" y="-48" width="192" height="76" rx="24" fill="#7ac8ff" stroke="#0a0a10" stroke-width="7"/><path d="M-86,10 C-40,-6 40,0 96,-10 L96,28 L-96,28Z" fill="#6ac04a"/><path d="M-80,-36 C-40,-46 0,-46 20,-42" stroke="#fff" stroke-width="8" opacity=".6" fill="none" stroke-linecap="round"/></g>
        <circle cx="990" cy="1486" r="50" fill="#261717" stroke="${TK}" stroke-width="6"/><circle cx="974" cy="1468" r="13" fill="#5a4440" opacity=".5"/>` : ''}
      ${hold === 'movil' ? `<g transform="translate(880,1300) rotate(-12)"><circle r="150" fill="#9fd0ff" opacity=".18"/><rect x="-46" y="-86" width="92" height="168" rx="16" fill="#1b1720" stroke="${TK}" stroke-width="9"/><rect x="-36" y="-72" width="72" height="132" rx="8" fill="#bfe4ff"/><rect x="-30" y="-50" width="60" height="60" rx="6" fill="#fff"/><rect x="-14" y="-28" width="28" height="10" rx="4" fill="#1e1418"/><path d="M-26,30 L26,30" stroke="#c8342c" stroke-width="8"/></g><circle cx="860" cy="1360" r="50" fill="#261717" stroke="${TK}" stroke-width="6"/>` : ''}
      ${hold === 'cubo' ? `<path d="M884,1560 C900,1480 1080,1480 1096,1560" stroke="#7a828c" stroke-width="12" fill="none"/><path d="M870,1560 L1110,1560 L1090,1760 L890,1760Z" fill="#c9ced6" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/><ellipse cx="990" cy="1560" rx="120" ry="24" fill="#fbf8f0" stroke="${TK}" stroke-width="9"/><path d="M900,1590 L912,1740" stroke="#fff" stroke-width="12" opacity=".7"/>
        <circle cx="990" cy="1486" r="50" fill="#261717" stroke="${TK}" stroke-width="6"/>` : ''}`,
    under: id => `${[[499, 2100], [691, 2100]].map(([x, y]) => `<path d="M${x - 46},${y - 170} L${x + 46},${y - 170} L${x + 50},${y - 30} L${x + 80},${y - 22} C${x + 92},${y - 4} ${x + 70},${y + 4} ${x + 40},${y} L${x - 52},${y} Z" fill="#2f5a3a" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/><path d="M${x - 46},${y - 150} L${x + 46},${y - 150}" stroke="#4a7a52" stroke-width="10"/><path d="M${x - 30},${y - 140} L${x - 32},${y - 40}" stroke="#7aa882" stroke-width="8" opacity=".6"/><path d="M${x - 52},${y - 8} L${x + 70},${y - 8}" stroke="#14241a" stroke-width="12"/>`).join('')}`,
    headIn: id => `${[...Array(80)].map((_, i) => { const a = (i * 137.5) % 360 * Math.PI / 180, r = 60 + ((i * 53) % 220), x = 590 + Math.cos(a) * r * 1.2, y = 1030 + Math.sin(a) * r * .38; return y > 930 && y < 1140 ? `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5" fill="#3a2e30" opacity=".45"/>` : ''; }).join('')}
      <path d="M330,860 C320,900 330,940 350,960 M850,860 C860,900 850,940 830,960" stroke="#c89c8c" stroke-width="8" fill="none" opacity=".7"/><path d="M408,850 l-34,-14 M410,872 l-36,2 M800,850 l34,-14 M798,872 l36,2" stroke="#c89c8c" stroke-width="7" opacity=".8" stroke-linecap="round"/><circle cx="760" cy="940" r="9" fill="#6a4434" opacity=".8"/>`,
    faceTop: (id, f) => mustache(id, IZ2_MUST, '#1e1612', '#4a3a30') + (o.invierno ? `<path d="M380,1080 C450,1160 740,1160 810,1080 L830,1150 C740,1230 450,1230 360,1150Z" fill="#c8342c" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>${[420, 500, 580, 660, 740].map(x => `<path d="M${x},1110 L${x + 10},1200" stroke="#f2e6c0" stroke-width="10" opacity=".8"/>`).join('')}<path d="M720,1170 L760,1330 L700,1340 L680,1190Z" fill="#c8342c" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>${[0, 1, 2, 3].map(i => `<path d="M${704 + i * 14},1330 l2,30" stroke="#c8342c" stroke-width="8"/>`).join('')}` : ''),
    hat: id => `<path d="M228,740 C226,690 246,660 290,650 C286,700 286,760 296,820 L246,830Z M952,740 C954,690 934,660 890,650 C894,700 894,760 884,820 L934,830Z" fill="#8a8478" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M230,640 C220,470 380,380 590,380 C800,380 950,460 956,620 C960,660 940,672 900,660 C760,620 420,620 280,660 C246,670 230,662 230,640Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M270,650 C400,606 780,606 910,650 C980,690 990,730 930,744 C760,690 420,690 250,744 C200,730 210,690 270,650Z" fill="#5a5448" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      ${[...Array(22)].map((_, i) => `<path d="M${300 + i * 28},${430 + (i % 3) * 50} l18,18 M${300 + i * 28},${470 + (i % 2) * 70} l18,-16" stroke="#4a463e" stroke-width="5" opacity=".55"/>`).join('')}
      <circle cx="590" cy="392" r="18" fill="#6a645a" stroke="${TK}" stroke-width="6"/><path d="M330,520 C400,440 500,412 600,410" stroke="#c8c2b4" stroke-width="18" fill="none" opacity=".6" stroke-linecap="round" filter="url(#${id}S1)"/>`
  }, o));
}


// ---------------- EL VECINO: flaco y alto, boina negra, patillas grises, bigote fino, chaqueta de lana marrón con coderas, bufanda de cuadros.
const VE_BODY = 'M450,1180 C458,1100 522,1080 595,1080 C668,1080 732,1100 740,1180 C760,1380 772,1600 762,1760 C752,1846 688,1872 595,1872 C502,1872 438,1846 428,1760 C418,1600 430,1380 450,1180Z';
function vecino2d(o = {}) {
  return pjT(Object.assign({
    id: 've', bodyPath: VE_BODY, bodyEdge: 'M752,1400 C770,1620 740,1840 600,1874', shadowW: 240, armW: 24,
    top: ['#a8805a', '#8a6440', '#6a4828', '#3a2410', '#c8a07a', '#e8c8a0'], hatC: ['#3a3640', '#24222a', '#16141a', '#08080a'], brow: '#c8c4bc',
    legs: legsAt(545, 645, 1866),
    armL: o.caja ? 'M460,1270 C390,1360 390,1440 420,1500' : o.saco ? 'M460,1270 C400,1360 400,1460 430,1520' : o.slap ? 'M460,1270 C430,1380 470,1520 560,1640' : 'M460,1270 C420,1400 400,1540 398,1680', handL: o.caja ? [420, 1500] : o.saco ? [430, 1520] : o.slap ? [566, 1650] : [398, 1690],
    armR: o.caja ? 'M730,1270 C800,1360 810,1440 780,1490' : o.saco ? 'M730,1270 C790,1360 800,1440 770,1500' : o.cruzado ? 'M730,1270 C700,1330 640,1360 600,1380' : 'M730,1270 C770,1400 790,1540 792,1680', handR: o.caja ? [780, 1490] : o.saco ? [770, 1500] : o.cruzado ? [600, 1380] : [792, 1690],
    bodyIn: id => `
      ${[...Array(9)].map((_, i) => `<path d="M${450 + i * 36},1100 l0,780" stroke="#6a4828" stroke-width="7" opacity=".5"/>`).join('')}
      <path d="M560,1090 L595,1300 L630,1090Z" fill="#e8dcc0"/><path d="M595,1300 L595,1872" stroke="${TK}" stroke-width="9"/>${[1400, 1520, 1640].map(y => `<circle cx="615" cy="${y}" r="14" fill="#3a2410" stroke="${TK}" stroke-width="5"/>`).join('')}
      ${[[440, 1520], [700, 1520]].map(([x, y]) => `<ellipse cx="${x + 25}" cy="${y}" rx="34" ry="54" fill="#5a3a20" stroke="${TK}" stroke-width="6"/>`).join('')}
      <path d="M470,1700 L560,1700 L556,1790 L474,1790Z M630,1700 L720,1700 L716,1790 L634,1790Z" fill="#8a6440" stroke="${TK}" stroke-width="7"/>`,
    front: id => (o.caja ? `<g transform="translate(600,1480) rotate(-4)"><rect x="-190" y="-120" width="380" height="240" rx="18" fill="#f4f4f4" stroke="${TK}" stroke-width="12"/><rect x="-190" y="-120" width="380" height="64" fill="#1a1a22"/><text x="0" y="-74" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="#fff">GAFAS VR</text><rect x="-110" y="-20" width="220" height="110" rx="30" fill="#2a2a34"/><rect x="-86" y="2" width="172" height="50" rx="16" fill="#5ab8ff"/></g><circle cx="420" cy="1500" r="46" fill="#261717" stroke="${TK}" stroke-width="6"/><circle cx="780" cy="1490" r="46" fill="#261717" stroke="${TK}" stroke-width="6"/>` : '') + (o.saco ? `<g transform="translate(600,1500) rotate(-6) scale(1.05)"><path d="M-160,-90 C-170,-140 -120,-170 -60,-160 L140,-150 C190,-150 210,-110 200,-60 L190,90 C180,130 140,140 100,138 L-130,130 C-170,128 -190,100 -180,60Z" fill="#d8c090" stroke="${TK}" stroke-width="12" stroke-linejoin="round"/>
      <rect x="-120" y="-60" width="270" height="120" rx="10" fill="#7a1a24" stroke="#e8c040" stroke-width="6"/><text x="15" y="18" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="#f4e6c0">PIENSO</text><path d="M-150,-120 C-100,-130 -40,-128 0,-124" stroke="#fff" stroke-width="10" opacity=".4" fill="none" stroke-linecap="round"/></g>
      <circle cx="430" cy="1520" r="46" fill="#261717" stroke="${TK}" stroke-width="6"/><circle cx="770" cy="1500" r="46" fill="#261717" stroke="${TK}" stroke-width="6"/>` : '') + `<path d="M450,1110 C500,1170 690,1170 740,1110 L750,1180 C690,1240 500,1240 440,1180Z" fill="#2f7a3a" stroke="${TK}" stroke-width="10" stroke-linejoin="round"/>
      ${[470, 530, 590, 650, 710].map(x => `<path d="M${x},1120 L${x + 6},1220" stroke="#c8342c" stroke-width="10" opacity=".8"/>`).join('')}<path d="M445,1150 L748,1150" stroke="#f2c230" stroke-width="6" opacity=".7"/>
      <path d="M470,1180 L440,1360 L500,1366 L520,1200Z" fill="#2f7a3a" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/><path d="M455,1260 L505,1268" stroke="#c8342c" stroke-width="8"/>`,
    faceTop: (id, f) => mustache(id, MUST.fino, '#c8c4bc', '#f0ece4') + (o.vr ? `<path d="M300,800 C260,700 300,600 420,590 L760,590 C880,600 920,700 880,800" stroke="#1a1a22" stroke-width="36" fill="none" stroke-linecap="round"/>
      <rect x="352" y="742" width="486" height="216" rx="68" fill="#8a8a96" stroke="${TK}" stroke-width="12"/><rect x="364" y="750" width="462" height="200" rx="60" fill="#2a2a36" stroke="${TK}" stroke-width="12"/>
      <rect x="396" y="780" width="398" height="136" rx="38" fill="#9ad6ff"/><path d="M396,880 C470,850 560,866 640,850 C700,840 760,852 794,862 L794,916 L396,916Z" fill="#6ac04a"/><circle cx="740" cy="812" r="18" fill="#fff6c8"/><path d="M420,792 C470,778 560,776 600,782" stroke="#fff" stroke-width="10" opacity=".55" fill="none" stroke-linecap="round"/><circle cx="800" cy="770" r="9" fill="#5fe08a"/>` : ''),
    headIn: id => `<path d="M440,600 C520,580 660,580 740,600 M470,640 C540,626 640,626 710,640" stroke="#c89c8c" stroke-width="7" fill="none" opacity=".6"/><path d="M470,960 C500,1010 520,1020 540,1022 M720,960 C690,1010 670,1020 650,1022" stroke="#c89c8c" stroke-width="7" fill="none" opacity=".6"/>`,
    hat: id => `<path d="M232,760 C228,690 246,650 280,640 C274,690 276,750 282,820 L240,830Z M948,760 C952,690 934,650 900,640 C906,690 904,750 898,820 L940,830Z" fill="#c8c4bc" stroke="${TK}" stroke-width="9" stroke-linejoin="round"/>
      <g transform="rotate(-8,590,520)"><path d="M190,560 C200,430 420,380 600,380 C800,380 1000,440 1010,540 C1012,580 960,600 880,600 C700,610 440,612 280,600 C220,596 186,590 190,560Z" fill="url(#${id}Hat)" stroke="${TK}" stroke-width="13" stroke-linejoin="round"/>
      <path d="M590,384 L596,350" stroke="${TK}" stroke-width="12" stroke-linecap="round"/><path d="M300,470 C400,420 520,404 620,404" stroke="#5a5664" stroke-width="16" fill="none" opacity=".6" stroke-linecap="round" filter="url(#${id}S1)"/></g>
      <ellipse cx="212" cy="870" rx="44" ry="80" fill="#f2dcb8" stroke="${TK}" stroke-width="13"/><ellipse cx="968" cy="870" rx="44" ry="80" fill="#f2dcb8" stroke="${TK}" stroke-width="13"/>`
  }, o));
}

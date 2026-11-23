s = open('stick.before77.js').read()
def rep(a, b, cnt=1):
    global s
    assert a in s, 'NO ENCUENTRO: ' + a[:70]
    s = s.replace(a, b) if cnt == 0 else s.replace(a, b, cnt)

HELP = r'''
// ===== 77: rasgos faciales nuevos (más forma de cabeza, orejas, nariz, mejillas SIN rubor rosa, más expresiones) =====
const FSK = '#f4f6fb';
function headPath77(chin) { const top = 'M-100,0 A100,100 0 0 1 100,0 ';
  const B = { round: 'A100,100 0 0 1 -100,0Z', square: 'C100,48 92,92 52,100 L-52,100 C-92,92 -100,48 -100,0Z', point: 'C100,46 62,96 0,114 C-62,96 -100,46 -100,0Z', wide: 'C108,50 82,98 0,102 C-82,98 -108,50 -100,0Z', long: 'C100,72 70,120 0,128 C-70,120 -100,72 -100,0Z', soft: 'C100,56 82,96 42,106 Q0,116 -42,106 C-82,96 -100,56 -100,0Z' };
  return top + (B[chin] || B.round); }
function ears77(d) { if (d.ears === 0) return ''; const k = d.ears || 1, TN = d.turn || 0; let s = '';
  [-1, 1].forEach(sd => { if (sd * TN < -.38) return; const x = sd * (99 + (k - 1) * 6) + TN * 6;
    s += `<g transform="translate(${x.toFixed(1)},6) scale(${k.toFixed(2)})"><ellipse cx="0" cy="0" rx="14" ry="22" fill="${FSK}" stroke="${INKC}" stroke-width="7"/><path d="M${-sd * 2},-10 Q${sd * 7},-2 ${-sd * 2},12" stroke="${INKC}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".5"/></g>`; });
  return s; }
// ojos nuevos: cada uno pensado para una emoción distinta
const lowerEye = (ex, ey, rot, rx, ry, px, py, pr) => `<g transform="translate(${ex},${ey}) rotate(${rot})"><path d="M${-rx},0 A${rx},${ry} 0 0 0 ${rx},0Z" fill="#fff" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/><circle cx="${px}" cy="${py}" r="${pr}" fill="${INKC}"/><path d="M${-rx - 3},0 L${rx + 3},0" stroke="${INKC}" stroke-width="8" stroke-linecap="round"/></g>`;
const EYES77 = {
  wary: (ex, ey, px, py, s2, d, lx, ly) => lowerEye(ex, ey - 2, s2 * 7, 17, 13, lx * .5 + 5 * s2, 4 + ly * .3, 6.5),
  tired: (ex, ey, px, py, s2, d, lx, ly) => lowerEye(ex, ey, s2 * -4, 17, 9, lx * .4, 3, 5.5) + `<path d="M${ex - 14},${ey + 16} Q${ex},${ey + 23} ${ex + 14},${ey + 16}" stroke="${INKC}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".5"/>`,
  sly: (ex, ey, px, py, s2, d, lx, ly) => lowerEye(ex, ey - 1, s2 * 3, 18, 11, 8 * (d.slyDir || 1) + lx * .3, 3, 6.5),
  dreamy: (ex, ey, px, py, s2) => `<path d="M${ex - 16},${ey + 6} Q${ex},${ey - 12} ${ex + 16},${ey + 6}" stroke="${INKC}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${ex + s2 * 15},${ey + 2} l${s2 * 8},-5 M${ex + s2 * 12},${ey - 3} l${s2 * 8},-8 M${ex + s2 * 7},${ey - 7} l${s2 * 5},-9" stroke="${INKC}" stroke-width="3.6" stroke-linecap="round"/>`,
  shock: (ex, ey, px, py, s2, d, lx, ly) => `<circle cx="${ex}" cy="${ey}" r="24" fill="#fff" stroke="${INKC}" stroke-width="6"/><circle cx="${(ex + lx * .4).toFixed(1)}" cy="${(ey + ly * .4).toFixed(1)}" r="3.4" fill="${INKC}"/>`,
  hypno: (ex, ey) => `<circle cx="${ex}" cy="${ey}" r="22" fill="#fff" stroke="${INKC}" stroke-width="5"/><circle cx="${ex}" cy="${ey}" r="15" fill="${INKC}"/><circle cx="${ex}" cy="${ey}" r="10" fill="#fff"/><circle cx="${ex}" cy="${ey}" r="5" fill="${INKC}"/>`,
  focus: (ex, ey, px, py, s2, d, lx, ly) => lowerEye(ex, ey, s2 * 11, 16, 11, lx * .4, 3, 6),
  up: (ex, ey, px, py, s2, d, lx, ly) => `<circle cx="${ex}" cy="${ey}" r="19" fill="#fff" stroke="${INKC}" stroke-width="6"/><circle cx="${(ex + lx * .6 - 3).toFixed(1)}" cy="${(ey - 9).toFixed(1)}" r="6.5" fill="${INKC}"/>`,
};
function mouth77(d, mx, my) { const K = INKC; switch (d.mouth) {
  case 'pout': return `<ellipse cx="${mx}" cy="${my + 3}" rx="12" ry="7" fill="${K}"/><ellipse cx="${mx - 3}" cy="${my + 1}" rx="4" ry="2" fill="#fff" opacity=".6"/>`;
  case 'teeth': return `<rect x="${mx - 27}" y="${my - 10}" width="54" height="24" rx="8" fill="#fff" stroke="${K}" stroke-width="6"/><path d="M${mx - 27},${my + 2} L${mx + 27},${my + 2} M${mx - 14},${my - 10} L${mx - 14},${my + 14} M${mx},${my - 10} L${mx},${my + 14} M${mx + 14},${my - 10} L${mx + 14},${my + 14}" stroke="${K}" stroke-width="4"/>`;
  case 'gasp': return `<ellipse cx="${mx}" cy="${my + 6}" rx="13" ry="21" fill="${K}"/><path d="M${mx - 8},${my + 20} Q${mx},${my + 12} ${mx + 8},${my + 20}" fill="#ff8a8a" opacity=".9"/>`;
  case 'yawn': return `<ellipse cx="${mx}" cy="${my + 8}" rx="19" ry="26" fill="${K}"/><path d="M${mx - 12},${my + 26} Q${mx},${my + 10} ${mx + 12},${my + 26}Z" fill="#ff8a8a"/>`;
  case 'half': return `<path d="M${mx - 16},${my + 3} Q${mx + 4},${my + 11} ${mx + 22},${my - 3}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${mx + 22},${my - 3} l5,-6" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`;
  case 'tsk': return `<path d="M${mx - 18},${my + 5} L${mx + 8},${my + 5}" stroke="${K}" stroke-width="6" stroke-linecap="round"/><path d="M${mx + 8},${my + 5} Q${mx + 22},${my + 5} ${mx + 25},${my - 8}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  case 'cheer': return `<path d="M${mx - 32},${my - 8} Q${mx},${my - 14} ${mx + 32},${my - 8} Q${mx + 26},${my + 36} ${mx},${my + 38} Q${mx - 26},${my + 36} ${mx - 32},${my - 8}Z" fill="${K}"/><path d="M${mx - 26},${my - 8} Q${mx},${my - 12} ${mx + 26},${my - 8} L${mx + 24},${my + 4} Q${mx},${my} ${mx - 24},${my + 4}Z" fill="#fff"/><path d="M${mx - 16},${my + 26} Q${mx},${my + 10} ${mx + 16},${my + 26}Z" fill="#ff8a8a"/>`;
  case 'worry': return `<path d="M${mx - 18},${my + 8} Q${mx - 9},${my - 4} ${mx},${my + 6} Q${mx + 9},${my - 4} ${mx + 18},${my + 8}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  default: return ''; } }
function faceExtras77(d, TN, E, mx, my, lx, ly, by) { let s = ''; const K = INKC, nx = TN * 30 + lx * .1;
  if (d.cheeks !== false) [-1, 1].forEach(sd => { s += `<path d="M${(sd * 64 + TN * 26).toFixed(1)},16 Q${(sd * 52 + TN * 26).toFixed(1)},38 ${(sd * 26 + TN * 26).toFixed(1)},40 Q${(sd * 42 + TN * 26).toFixed(1)},28 ${(sd * 64 + TN * 26).toFixed(1)},16Z" fill="#8f98bb" opacity=".15"/>`; });   // volumen de mejilla en gris azulado, nunca rosa
  if (d.nose !== false) { const st = d.noseStyle || 'button', N = {
    button: `<path d="M-7,26 Q0,33 8,26" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-2" cy="16" r="3" fill="#fff" opacity=".75"/>`,
    long: `<path d="M3,-2 Q-6,18 -3,28 Q4,34 13,27" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-1" cy="12" r="3" fill="#fff" opacity=".7"/>`,
    round: `<ellipse cx="2" cy="25" rx="11" ry="9" fill="#e6e8f0" stroke="${K}" stroke-width="4.5"/><circle cx="-1" cy="22" r="3" fill="#fff" opacity=".9"/><path d="M-5,29 Q2,33 9,29" stroke="${K}" stroke-width="3" fill="none" opacity=".5"/>`,
    hook: `<path d="M2,-4 Q14,16 8,28 Q0,34 -8,26" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="1" cy="10" r="3" fill="#fff" opacity=".7"/>`,
    pointy: `<path d="M0,-2 L10,28 L-10,28Z" fill="#eceef6" stroke="${K}" stroke-width="4.5" stroke-linejoin="round"/>`,
    small: `<path d="M-4,26 Q0,30 5,26" stroke="${K}" stroke-width="4.5" fill="none" stroke-linecap="round"/>` };
    s += `<g transform="translate(${nx.toFixed(1)},0)">${N[st] || N.button}</g>`; }
  if (d.bags) E.forEach(([ex, ey]) => { s += `<path d="M${ex - 15},${ey + 20} Q${ex},${ey + 29} ${ex + 15},${ey + 20}" stroke="${K}" stroke-width="3.6" fill="none" stroke-linecap="round" opacity=".55"/>`; });
  if (d.lashes) E.forEach(([ex, ey], i) => { const sd = i ? 1 : -1; s += `<path d="M${ex + sd * 17},${ey - 2} l${sd * 10},-7 M${ex + sd * 14},${ey - 8} l${sd * 8},-9 M${ex + sd * 17},${ey + 4} l${sd * 10},-1" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>`; });
  if (d.bushy) E.forEach(([ex], i) => { for (let k = 0; k < 5; k++) s += `<path d="M${ex - 14 + k * 7},${by - 7 + Math.abs(k - 2)} l${(k - 2) * 1.5},-8" stroke="${K}" stroke-width="3.4" stroke-linecap="round"/>`; });
  if (d.freckles) for (let k = 0; k < 11; k++) s += `<circle cx="${(nx + (hsh(k, 2) - .5) * 70).toFixed(1)}" cy="${(14 + hsh(k, 5) * 18).toFixed(1)}" r="2.2" fill="#b07a58" opacity=".65"/>`;
  if (d.stubble) for (let k = 0; k < 90; k++) { const a = .35 + hsh(k, 7) * 2.45, r = 50 + hsh(k, 9) * 44, x = Math.cos(a) * r * 1.02, y = 8 + Math.sin(a) * r; if (Math.abs(x - mx) < 30 && y > 28 && y < 58) continue; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9" fill="${d.stubble}" opacity=".55"/>`; }
  if (d.mole) s += `<circle cx="${d.mole[0] + TN * 20}" cy="${d.mole[1]}" r="4.5" fill="${K}"/>`;
  s += mouth77(d, mx, my); return s; }
'''
rep("const hsh = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };", "const hsh = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };" + HELP)
# cabeza con mandíbula propia + orejas detrás
rep("HP2.back + `<circle cx=\"0\" cy=\"0\" r=\"${R0}\" fill=\"url(#${id}h)\" stroke=\"${INKC}\" stroke-width=\"${LW + 1}\"/>`;", "HP2.back + ears77(d) + `<path d=\"${headPath77(d.chin)}\" fill=\"url(#${id}h)\" stroke=\"${INKC}\" stroke-width=\"${LW + 1}\"/>`;")
# cejas con grosor y arco propios
rep("stroke=\"${INKC}\" stroke-width=\"${d.browCol ? 13 : 10}\"", "stroke=\"${INKC}\" stroke-width=\"${d.browW || (d.browCol ? 13 : 10)}\"")
rep("Q${ex},${by - 6} ${ex + 17},${by - t}", "Q${ex},${by - 6 - (d.browArch || 0)} ${ex + 17},${by - t}", 0)
# ojos nuevos + brillo en el ojo abierto
rep("else if (d.face === 'stars') {", "else if (EYES77[d.face]) h += EYES77[d.face](ex, ey, px, py, s2, d, lx, ly);\n    else if (d.face === 'stars') {")
rep("else if (d.face === 'open') h += `<ellipse cx=\"${px}\" cy=\"${py}\" rx=\"10\" ry=\"13\" fill=\"${INKC}\"/>`;", "else if (d.face === 'open') h += `<ellipse cx=\"${px}\" cy=\"${py}\" rx=\"10\" ry=\"13\" fill=\"${INKC}\"/><circle cx=\"${px - 3}\" cy=\"${py - 4.5}\" r=\"3.4\" fill=\"#fff\"/>`;")
# rubor fuera: ahora rasgos nuevos
rep("if (d.blush) h += [-1, 1].map(sd => `<ellipse cx=\"${sd * 52 + TN * 26}\" cy=\"22\" rx=\"17\" ry=\"9\" fill=\"#ff7f9a\" opacity=\".55\"/>`).join('');", "h += faceExtras77(d, TN, E, mx, my, lx, ly, by);   // 77: sin rubor rosa; nariz, mejillas, ojeras, barba incipiente, pecas, pestañas, bocas nuevas")
open('stick.js', 'w').write(s)
print('OK', len(s))

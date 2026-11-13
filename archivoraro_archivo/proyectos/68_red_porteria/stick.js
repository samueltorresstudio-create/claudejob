// Archivo Raro · personajes 2D v6: cabeza orgánica (no un círculo perfecto, se estira y se aplasta con la emoción), cuerpo curvo,
// extremidades de «fideo» curvas, caras expresivas y línea viva (tiembla un poco cada 3 fotogramas, como dibujada a mano).
const INKC = '#1b1720', LW = 10;
const mixC = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
let _sid = 0;
function smoothPath(P) { const n = P.length; let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) { const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`; }
  return d + 'Z'; }
const hsh = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
function stick(o) {
  const d = Object.assign({ top: '#f07a2a', topD: '#c45a18', face: 'smug', brows: 0, browTilt: 0, mouth: 'smile', look: [0, 0], shade: .5, lean: 0, headTilt: 0, squash: 0,
    armL: [20, 10], armR: [20, 10], legL: [4, 0], legR: [4, 0], hair: null, cap: null, hood: false, sweat: false, number: null, shoes: '#f4f2ec', wrist: null,
    head: [92, 100], headSeed: 1, belly: 1, boil: 0, nose: true, jaw: 0 }, o);
  const id = 'sk' + (++_sid), rad = a => a * Math.PI / 180, bj = (k, a = 1.6) => (hsh(d.boil + k, d.headSeed) - .5) * a;
  const BOB = d.bob || 0, HIP = -205 + BOB, SH = -360 + BOB, HC = -470 + BOB;
  let s = `<defs><radialGradient id="${id}h" cx="${.32 + (d.shade - .5) * .4}" cy=".3" r=".9"><stop offset=".42" stop-color="#ffffff"/><stop offset="1" stop-color="#cdd2df"/></radialGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="0"><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".345" stop-color="#fff" stop-opacity="${d.streak ?? .2}"/><stop offset=".39" stop-color="#fff" stop-opacity="0"/><stop offset=".46" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${d.shadeK ?? .34}"/></linearGradient></defs>`; // ropa: lado claro, raya pálida de brillo y lado más oscuro (regla del tutorial)
  const joint = (x0, y0, a1, l1, a2, l2) => { const x1 = x0 + Math.sin(rad(a1)) * l1, y1 = y0 + Math.cos(rad(a1)) * l1; return [x1, y1, x1 + Math.sin(rad(a1 + a2)) * l2, y1 + Math.cos(rad(a1 + a2)) * l2]; };
  const noodle = (x0, y0, x1, y1, x2, y2, w) => { const cx = 2 * x1 - (x0 + x2) / 2, cy = 2 * y1 - (y0 + y2) / 2;
    return `<path d="M${x0},${y0} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" stroke="${INKC}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`; };
  let legs = '', arms = '';
  if (d.lift) { [[-1, d.lift[0]], [1, d.lift[1]]].forEach(([sd, lf], i) => { const hx = sd * 22 + (d.turn || 0) * 6, hy = HIP + 6, fx = sd * 26 + (d.turn || 0) * 14 * lf + (d.stepX ? d.stepX[i] : 0), fy = -2 - lf * 62;
      const kx = (hx + fx) / 2 + sd * (4 + lf * 24) + (d.turn || 0) * lf * 18, ky = (hy + fy) / 2 - lf * 16;
      legs += noodle(hx, hy, kx, ky, fx, fy, LW + 2);
      legs += `<g transform="translate(${fx.toFixed(1)},${fy.toFixed(1)}) rotate(${(sd * lf * 14 - (d.turn || 0) * lf * 10).toFixed(1)})"><path d="M${-15},-5 Q${-17},13 ${8 + sd * 20},13 Q${26 + sd * 22},11 ${21 + sd * 18},-3 Q${10 + sd * 8},-15 ${-9},-12Z" fill="${d.shoes}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/><path d="M${-15},9 L${23 + sd * 20},9" stroke="${d.sole || '#e94b3c'}" stroke-width="5" stroke-linecap="round"/></g>`; }); }
  else [[-1, d.legL], [1, d.legR]].forEach(([sd, [hip, knee]], i) => { const hx = sd * 22, [kx, ky, fx, fy] = joint(hx, HIP + 6, sd * hip, 102 * (d.legLen || 1), -sd * knee, 104 * (d.legLen || 1));
    legs += noodle(hx, HIP + 6, kx + bj(10 + i), ky, fx, fy, LW + 2);
    if (d.knickers) { const ex = kx + (fx - kx) * .12, ey = ky + (fy - ky) * .12, kc = d.knickers; // pantalón bombacho hasta la rodilla (fútbol de 1889)
      legs += `<path d="M${hx.toFixed(1)},${(HIP + 2).toFixed(1)} Q${(hx + kx) / 2 + sd * 8},${((HIP + ky) / 2).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}" stroke="${INKC}" stroke-width="46" stroke-linecap="round" fill="none"/><path d="M${hx.toFixed(1)},${(HIP + 2).toFixed(1)} Q${(hx + kx) / 2 + sd * 8},${((HIP + ky) / 2).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}" stroke="${kc}" stroke-width="34" stroke-linecap="round" fill="none"/><path d="M${(ex - 14).toFixed(1)},${(ey + 2).toFixed(1)} L${(ex + 14).toFixed(1)},${(ey + 2).toFixed(1)}" stroke="${mixC(kc, '#000000', .3)}" stroke-width="4"/>`; }
    if (d.fshorts) { const ex = hx + (kx - hx) * .66, ey = HIP + 6 + (ky - HIP - 6) * .66, kc = d.fshorts; // pantalón corto de fútbol (a medio muslo, ancho)
      legs += `<path d="M${hx.toFixed(1)},${(HIP - 2).toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)}" stroke="${INKC}" stroke-width="54" stroke-linecap="butt" fill="none"/><path d="M${hx.toFixed(1)},${(HIP - 2).toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)}" stroke="${kc}" stroke-width="43" stroke-linecap="butt" fill="none"/><path d="M${(ex - 24).toFixed(1)},${(ey - 1).toFixed(1)} L${(ex + 24).toFixed(1)},${(ey - 1).toFixed(1)}" stroke="${INKC}" stroke-width="6" stroke-linecap="round"/><path d="M${(hx + sd * 16).toFixed(1)},${(HIP + 2).toFixed(1)} L${(ex + sd * 16).toFixed(1)},${(ey - 6).toFixed(1)}" stroke="${d.shortsTrim || '#f4f2ec'}" stroke-width="5" opacity=".9"/>`; }
    if (d.fsocks) { const a = .1, qx = kx + (fx - kx) * a, qy = ky + (fy - ky) * a, sc = d.fsocks, tc = d.sockTop || '#f4f2ec', P = k => [(kx + (fx - kx) * k).toFixed(1), (ky + (fy - ky) * k).toFixed(1)]; // medias altas hasta debajo de la rodilla + vuelta con raya + espinillera marcada
      legs += `<path d="M${qx.toFixed(1)},${qy.toFixed(1)} L${fx.toFixed(1)},${(fy - 8).toFixed(1)}" stroke="${INKC}" stroke-width="33" stroke-linecap="round"/><path d="M${qx.toFixed(1)},${qy.toFixed(1)} L${fx.toFixed(1)},${(fy - 8).toFixed(1)}" stroke="${sc}" stroke-width="23" stroke-linecap="round"/>` +
        `<path d="M${P(.08).join(',')} L${P(.3).join(',')}" stroke="${tc}" stroke-width="23"/><path d="M${P(.17).join(',')} L${P(.22).join(',')}" stroke="${sc}" stroke-width="23"/><path d="M${P(.3).join(',')} L${P(.31).join(',')}" stroke="${INKC}" stroke-width="23" opacity=".5"/>` +
        `<path d="M${(+P(.4)[0] - 5).toFixed(1)},${P(.4)[1]} L${(+P(.82)[0] - 5).toFixed(1)},${P(.82)[1]}" stroke="#fff" stroke-opacity=".28" stroke-width="5" stroke-linecap="round"/>`; }
    if (d.socks) { const qx = kx + (fx - kx) * .66, qy = ky + (fy - ky) * .66; legs += `<path d="M${qx.toFixed(1)},${qy.toFixed(1)} L${fx.toFixed(1)},${(fy - 4).toFixed(1)}" stroke="${INKC}" stroke-width="21" stroke-linecap="round"/><path d="M${qx.toFixed(1)},${qy.toFixed(1)} L${fx.toFixed(1)},${(fy - 4).toFixed(1)}" stroke="#f6f3ec" stroke-width="13" stroke-linecap="round"/><path d="M${(qx + (fx - qx) * .2).toFixed(1)},${(qy + (fy - qy) * .2).toFixed(1)} L${(qx + (fx - qx) * .35).toFixed(1)},${(qy + (fy - qy) * .35).toFixed(1)}" stroke="${d.socks}" stroke-width="13"/>`; }
    if (d.boots) { const qx = kx + (fx - kx) * .45, qy = ky + (fy - ky) * .45; legs += `<path d="M${qx.toFixed(1)},${qy.toFixed(1)} L${fx.toFixed(1)},${(fy - 6).toFixed(1)}" stroke="${INKC}" stroke-width="34" stroke-linecap="round"/><path d="M${qx.toFixed(1)},${qy.toFixed(1)} L${fx.toFixed(1)},${(fy - 6).toFixed(1)}" stroke="${d.boots}" stroke-width="24" stroke-linecap="round"/><path d="M${(qx - 6).toFixed(1)},${(qy + 6).toFixed(1)} L${(qx + (fx - qx) * .5 - 6).toFixed(1)},${(qy + (fy - qy) * .5).toFixed(1)}" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>`; }
    const fa = sd * hip - sd * knee; if (d.fboots) { const bc = d.fboots, bd = mixC(bc, '#000000', .35); // bota de fútbol antigua: caña alta, puntera reforzada, cordones y tacos
      legs += `<g transform="translate(${fx.toFixed(1)},${fy.toFixed(1)}) rotate(${(-fa * .6).toFixed(1)})"><path d="M-17,-26 L13,-26 L${15 + sd * 6},-8 Q${34 + sd * 24},-6 ${32 + sd * 24},8 Q${30 + sd * 22},15 ${10 + sd * 16},15 L-16,15 Q-21,6 -17,-26Z" fill="${bc}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/>` +
        `<path d="M${14 + sd * 20},-5 Q${20 + sd * 20},6 ${16 + sd * 20},14" stroke="${bd}" stroke-width="5" fill="none"/><path d="M-17,-18 L12,-18" stroke="#e9dcc0" stroke-width="5"/><path d="M-6,-10 L8,-4 M-6,-3 L8,3" stroke="#e9dcc0" stroke-width="3.5" stroke-linecap="round"/>` +
        [-10, 4 + sd * 8, 18 + sd * 16].map(x => `<rect x="${x - 4}" y="14" width="8" height="8" rx="2" fill="${INKC}"/>`).join('') + `</g>`; }
    else legs += `<g transform="translate(${fx.toFixed(1)},${fy.toFixed(1)}) rotate(${(-fa * .6).toFixed(1)})"><path d="M${-15},-5 Q${-17},13 ${8 + sd * 20},13 Q${26 + sd * 22},11 ${21 + sd * 18},-3 Q${10 + sd * 8},-15 ${-9},-12Z" fill="${d.shoes}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/><path d="M${-15},9 L${23 + sd * 20},9" stroke="${d.sole || '#e94b3c'}" stroke-width="5" stroke-linecap="round"/></g>`; });
  if (!d.noArms) [[-1, d.armL], [1, d.armR]].forEach(([sd, [sh, el]], i) => { const sx = sd * 44, [ex, ey, hx, hy] = joint(sx, SH, sd * sh, 90, sd * el, 86);
    if (d.armHalo) arms += noodle(sx, SH, ex + bj(20 + i), ey + bj(30 + i), hx, hy, LW + 12).replace(INKC, d.armHalo) + `<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="22" fill="${d.armHalo}"/>`;   // halo claro: brazos legibles sobre fondos oscuros (público)
    arms += noodle(sx, SH, ex + bj(20 + i), ey + bj(30 + i), hx, hy, LW);
    if (d.wrist && sd > 0) arms += `<circle cx="${(ex + (hx - ex) * .78).toFixed(1)}" cy="${(ey + (hy - ey) * .78).toFixed(1)}" r="9" fill="${d.wrist}" stroke="${INKC}" stroke-width="4"/>`;
    if (sd > 0 && d.cane) arms += `<path d="M${hx.toFixed(1)},${hy.toFixed(1)} L${(hx + 14).toFixed(1)},4" stroke="${INKC}" stroke-width="17" stroke-linecap="round"/><path d="M${hx.toFixed(1)},${hy.toFixed(1)} L${(hx + 14).toFixed(1)},4" stroke="${d.cane}" stroke-width="9" stroke-linecap="round"/><path d="M${(hx - 22).toFixed(1)},${(hy - 6).toFixed(1)} Q${(hx - 18).toFixed(1)},${(hy - 30).toFixed(1)} ${hx.toFixed(1)},${(hy - 22).toFixed(1)} L${hx.toFixed(1)},${hy.toFixed(1)}" stroke="${INKC}" stroke-width="17" fill="none" stroke-linecap="round"/><path d="M${(hx - 22).toFixed(1)},${(hy - 6).toFixed(1)} Q${(hx - 18).toFixed(1)},${(hy - 30).toFixed(1)} ${hx.toFixed(1)},${(hy - 22).toFixed(1)} L${hx.toFixed(1)},${hy.toFixed(1)}" stroke="${d.cane}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    if (sd > 0 && d.prop === 'pan') arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)}) rotate(-30)"><rect x="-6" y="-70" width="12" height="70" rx="5" fill="#3a2a22" stroke="${INKC}" stroke-width="5"/><ellipse cx="0" cy="-104" rx="52" ry="38" fill="#3b3f48" stroke="${INKC}" stroke-width="7"/><ellipse cx="0" cy="-108" rx="38" ry="25" fill="#22252c"/><ellipse cx="-6" cy="-110" rx="16" ry="11" fill="#fff6dc"/><circle cx="-4" cy="-110" r="7" fill="#ffc23a"/></g>`;
    if (sd > 0 && d.holdR) arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)})">${d.holdR}</g>`;   // objeto libre en la mano derecha (SVG en unidades del personaje)
    if (sd < 0 && d.holdL) arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)})">${d.holdL}</g>`;
    if (sd > 0 && d.prop === 'paddle') arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)}) rotate(-8)"><rect x="-7" y="-170" width="14" height="250" rx="6" fill="#9a6a3a" stroke="${INKC}" stroke-width="5"/><path d="M-7,80 Q-26,120 -20,190 Q0,210 20,190 Q26,120 7,80Z" fill="#b07a44" stroke="${INKC}" stroke-width="6" stroke-linejoin="round"/></g>`;
    if (sd > 0 && d.prop === 'syringe') arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)}) rotate(-70)"><rect x="-10" y="-96" width="20" height="78" rx="5" fill="#e9f4ff" stroke="${INKC}" stroke-width="5"/><rect x="-8" y="-60" width="16" height="40" fill="#7fd0ff"/><rect x="-16" y="-20" width="32" height="8" rx="3" fill="#cfd6de" stroke="${INKC}" stroke-width="4"/><rect x="-4" y="-12" width="8" height="26" fill="#9aa3ad" stroke="${INKC}" stroke-width="3"/><path d="M0,-96 L0,-130" stroke="${INKC}" stroke-width="4"/></g>`;
    if (sd > 0 && d.prop === 'mop') arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)}) rotate(14)"><rect x="-6" y="-150" width="12" height="300" rx="5" fill="#4f8fd8" stroke="${INKC}" stroke-width="5"/><rect x="-7" y="-160" width="14" height="22" rx="4" fill="#e94b3c" stroke="${INKC}" stroke-width="4"/><path d="M-6,-60 L6,-60 M-6,40 L6,40" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>` +
      `<path d="M-30,150 L30,150 L34,168 L-34,168Z" fill="#d9dde3" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/>` + Array.from({ length: 9 }, (_, k) => { const x = -32 + k * 8; return `<path d="M${x},166 Q${x - 6 + (k % 3) * 4},196 ${x - 4 + (k % 2) * 6},226" stroke="${INKC}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M${x},166 Q${x - 6 + (k % 3) * 4},196 ${x - 4 + (k % 2) * 6},226" stroke="${k % 2 ? '#f2efe6' : '#e4ded0'}" stroke-width="6" fill="none" stroke-linecap="round"/>`; }).join('') + `</g>`;
    if (sd > 0 && d.prop === 'scepter') arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)}) rotate(10)"><rect x="-7" y="-170" width="14" height="230" rx="6" fill="#e7c24a" stroke="${INKC}" stroke-width="5"/>${[-120, -60, 0].map(y => `<rect x="-11" y="${y}" width="22" height="12" rx="4" fill="#c9a032" stroke="${INKC}" stroke-width="3.5"/>`).join('')}<circle cx="0" cy="-192" r="24" fill="#e7c24a" stroke="${INKC}" stroke-width="6"/><circle cx="0" cy="-192" r="11" fill="#c8243a" stroke="${INKC}" stroke-width="3.5"/><circle cx="-4" cy="-196" r="3.5" fill="#fff" opacity=".8"/><path d="M0,-216 L0,-244 M-12,-232 L12,-232" stroke="${INKC}" stroke-width="13" stroke-linecap="round"/><path d="M0,-216 L0,-244 M-12,-232 L12,-232" stroke="#e7c24a" stroke-width="6" stroke-linecap="round"/><path d="M-3,-150 L-3,40" stroke="#fff" stroke-opacity=".45" stroke-width="3"/></g>`;
    if (sd > 0 && d.prop === 'radio') arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)}) rotate(-6)"><rect x="-17" y="-52" width="34" height="62" rx="7" fill="#2c3020" stroke="${INKC}" stroke-width="5"/><rect x="-11" y="-42" width="22" height="16" rx="2" fill="#9ad08a" stroke="${INKC}" stroke-width="2.5"/><path d="M-9,-16 L9,-16 M-9,-6 L9,-6 M-9,4 L9,4" stroke="#6a7a5a" stroke-width="3"/><path d="M9,-52 L16,-104" stroke="${INKC}" stroke-width="6" stroke-linecap="round"/><circle cx="16" cy="-106" r="6" fill="${INKC}"/></g>`;
    if (sd === (d.brushHand === 'L' ? -1 : 1) && d.prop === 'brush') { const pc = d.paint || '#f6f3ec'; arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)}) rotate(${d.brushRot ?? -50}) scale(${d.brushScale || 1})"><rect x="-7" y="-120" width="14" height="140" rx="6" fill="#c99a5a" stroke="${INKC}" stroke-width="5"/><rect x="-11" y="-150" width="22" height="34" rx="3" fill="#c9ced6" stroke="${INKC}" stroke-width="5"/><path d="M-14,-150 L14,-150 L18,-196 Q0,-206 -18,-196Z" fill="#6a4a2a" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/><path d="M-16,-186 L16,-186 L18,-196 Q0,-206 -18,-196Z" fill="${pc}" stroke="${INKC}" stroke-width="4" stroke-linejoin="round"/><path d="M-10,-186 q-2,12 2,18 q4,-6 2,-18 M8,-186 q-2,8 2,12 q3,-4 1,-12" fill="${pc}" stroke="${INKC}" stroke-width="2.5"/></g>`; }
    if (sd > 0 && d.prop === 'spoon') arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)}) rotate(-20)"><rect x="-5" y="-86" width="10" height="92" rx="5" fill="#c99a5a" stroke="${INKC}" stroke-width="5"/><ellipse cx="0" cy="-102" rx="16" ry="22" fill="#c99a5a" stroke="${INKC}" stroke-width="5"/></g>`;
    const gC = d.gloves || INKC, gS = d.gloves ? ` stroke="${INKC}" stroke-width="4"` : '';
    arms += `<g transform="translate(${hx.toFixed(1)},${hy.toFixed(1)}) rotate(${(sd * sh + sd * el).toFixed(0)})"><ellipse cx="${-sd * 11}" cy="-4" rx="5" ry="8" fill="${gC}"${gS} transform="rotate(${sd * 30} ${-sd * 11} -4)"/><ellipse cx="0" cy="3" rx="12" ry="15" fill="${gC}"${gS}/>${d.gloves ? `<path d="M-13,-12 Q0,-18 13,-12" stroke="${INKC}" stroke-width="4" fill="none"/>` : ''}</g>`; });
  const sx2 = d.lean * 1.4;
  const BP = [[-36 + sx2, SH - 26], [-60 + sx2 * .7, SH + 10], [-66 * d.belly, (SH + HIP) / 2], [-62, HIP - 20], [-34, HIP + 14], [0, HIP + 22], [34, HIP + 14], [62, HIP - 20], [64 * d.belly + 4, (SH + HIP) / 2 + 6], [58 + sx2 * .7, SH + 10], [34 + sx2, SH - 26], [0 + sx2, SH - 34]].map(([x, y], k) => [x + bj(40 + k, 2), y + bj(60 + k, 2)]);
  const B = smoothPath(BP);
  // ---------- clothes: drawn inside the bean (clipPath) with trims, seams, folds and shading ----------
  const cid = id + 'c', IN = (x) => `<g clip-path="url(#${cid})">${x}</g>`;
  let body = `<defs><clipPath id="${cid}"><path d="${B}"/></clipPath><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mixC(d.top, '#ffffff', .22)}"/><stop offset=".45" stop-color="${d.top}"/><stop offset="1" stop-color="${d.topD}"/></linearGradient></defs><path d="${B}" fill="url(#${id}g)"/>`;
  const SHO = HIP - 62; // shorts / hem line
  if (d.outfit === 'jersey') {
    let c = '';
    c += `<path d="M-90,${SH - 40} L-58,${SH - 40} Q-40,${SH + 60} -50,${SHO} L-90,${SHO}Z" fill="${d.trim}"/><path d="M90,${SH - 40} L58,${SH - 40} Q40,${SH + 60} 50,${SHO} L90,${SHO}Z" fill="${d.trim}"/>`;            // white side panels
    c += `<path d="M-90,${SH - 40} L-62,${SH - 40} Q-46,${SH + 60} -56,${SHO} L-90,${SHO}Z" fill="${d.top}"/><path d="M90,${SH - 40} L62,${SH - 40} Q46,${SH + 60} 56,${SHO} L90,${SHO}Z" fill="${d.top}"/>`;
    c += `<path d="M-30,${SH - 2} Q-44,${SH + 120} -26,${SHO - 6} M24,${SH + 70} Q36,${SH + 120} 30,${SHO - 4}" stroke="${d.topD}" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/>`; // folds
    c += `<rect x="-90" y="${SHO}" width="180" height="120" fill="${d.shorts}"/><rect x="-90" y="${SHO}" width="180" height="11" fill="${d.shortsD}"/>`;                                          // shorts + waistband
    c += `<path d="M-60,${SHO + 4} L-56,${HIP + 30} M60,${SHO + 4} L56,${HIP + 30}" stroke="${d.trim}" stroke-width="7"/><path d="M-6,${SHO + 12} L-10,${HIP + 24}" stroke="${d.shortsD}" stroke-width="3"/>`;
    c += `<rect x="-90" y="${SH - 60}" width="180" height="200" fill="url(#${id}b)"/>`;
    body += IN(c);
    // neck + armhole trims (over the clip so they read clearly)
    body += `<path d="M${-30 + sx2},${SH - 30} Q${sx2},${SH + 4} ${30 + sx2},${SH - 30}" stroke="${d.trim}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${-30 + sx2},${SH - 30} Q${sx2},${SH + 4} ${30 + sx2},${SH - 30}" stroke="${INKC}" stroke-width="2.5" fill="none" opacity=".6"/>`;
    [-1, 1].forEach(sd => body += `<path d="M${sd * 38 + sx2},${SH - 26} Q${sd * 60},${SH - 2} ${sd * 58},${SH + 34}" stroke="${d.trim}" stroke-width="8" fill="none" stroke-linecap="round"/>`);
    if (d.number) body += `<text x="${sx2 * .5}" y="${SH + 90}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="66" fill="${d.trim}" stroke="${INKC}" stroke-width="5" paint-order="stroke">${d.number}</text><text x="${sx2 * .5 - 1}" y="${SH + 22}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="15" letter-spacing="2" fill="${d.trim}">RARO</text>`;
  } else if (d.outfit === 'kit1889') { // fútbol de 1889: camisa de manga larga con cuello y cordón, rayas verticales (o mitades), pantalón bombacho blanco largo
    let c = ''; const A = d.top, B = d.stripe || '#f4f2ec', sw = d.stripeW || 34;
    if (d.halves) c += `<rect x="-90" y="${SH - 60}" width="90" height="${SHO - SH + 60}" fill="${A}"/><rect x="0" y="${SH - 60}" width="90" height="${SHO - SH + 60}" fill="${B}"/>`;
    else if (d.hoops) { const hw = d.hoopW || 17; c += `<rect x="-90" y="${SH - 60}" width="180" height="${SHO - SH + 60}" fill="${B}"/>`; for (let y = SH - 60 + hw * .4; y < SHO; y += hw * 2) c += `<path d="M-90,${y} Q0,${y + 8} 90,${y} L90,${y + hw} Q0,${y + hw + 8} -90,${y + hw}Z" fill="${A}"/>`; } // aros horizontales (como las equipaciones de 1889 de la referencia)
    else { c += `<rect x="-90" y="${SH - 60}" width="180" height="${SHO - SH + 60}" fill="${B}"/>`; for (let x = -90 + sw / 2; x < 90; x += sw * 2) c += `<rect x="${x}" y="${SH - 60}" width="${sw}" height="${SHO - SH + 60}" fill="${A}"/>`; }
    c += `<path d="M-30,${SH + 10} Q-42,${SH + 110} -26,${SHO - 8} M26,${SH + 60} Q38,${SH + 110} 30,${SHO - 6}" stroke="#000" stroke-width="4" fill="none" opacity=".18" stroke-linecap="round"/>`;
    const sh = d.fshorts || d.shorts || '#f1efe8';
    c += `<rect x="-90" y="${SHO}" width="180" height="160" fill="${sh}"/><rect x="-90" y="${SHO - 7}" width="180" height="12" fill="${d.hem || A}"/><rect x="-90" y="${SHO + 5}" width="180" height="9" fill="${mixC(sh, '#000000', .3)}"/><path d="M-4,${SHO + 16} L-8,${HIP + 40}" stroke="${mixC(sh, '#000000', .35)}" stroke-width="3"/>`;
    if (d.badge !== false && d.view !== 'back') c += `<g transform="translate(34,${SH + 44})"><path d="M-15,-17 L15,-17 L15,3 Q15,17 0,23 Q-15,17 -15,3Z" fill="${d.badgeCol || '#f2c94c'}" stroke="${INKC}" stroke-width="4" stroke-linejoin="round"/><path d="M-8,-6 L8,-6 M0,-12 L0,12" stroke="${INKC}" stroke-width="3.5" opacity=".7"/></g>`;
    c += `<rect x="-90" y="${SH - 60}" width="180" height="200" fill="url(#${id}b)"/>`;
    body += IN(c);
    // cuello con cordón (lacing) por encima (de espaldas, solo el cuello)
    if (d.view === 'back') body += `<path d="M${-34 + sx2},${SH - 30} Q${sx2},${SH - 14} ${34 + sx2},${SH - 30}" stroke="${d.collar || '#f4f2ec'}" stroke-width="12" fill="none" stroke-linecap="round"/>`; else
    body += `<path d="M${-34 + sx2},${SH - 34} L${sx2 - 4},${SH + 6} L${34 + sx2},${SH - 34} L${22 + sx2},${SH - 20} L${sx2},${SH - 8} L${-22 + sx2},${SH - 20}Z" fill="${d.collar || '#f4f2ec'}" stroke="${INKC}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M${sx2 - 2},${SH - 4} L${sx2 - 2},${SH + 40}" stroke="${INKC}" stroke-width="4"/>` + [0, 1, 2].map(k => `<path d="M${sx2 - 10},${SH + 6 + k * 12} L${sx2 + 6},${SH + 12 + k * 12}" stroke="#8a5a2a" stroke-width="3.5" stroke-linecap="round"/>`).join('');
  } else if (d.outfit === 'hoodie') {
    let c = '';
    c += `<path d="M-46,${HIP - 40} Q0,${HIP - 54} 46,${HIP - 40} L52,${HIP - 4} Q0,${HIP + 6} -52,${HIP - 4}Z" fill="${d.topD}"/>`;                                       // kangaroo pocket
    c += `<path d="M-40,${HIP - 34} Q0,${HIP - 46} 40,${HIP - 34}" stroke="${mixC(d.top, '#ffffff', .25)}" stroke-width="2.5" stroke-dasharray="6 6" fill="none"/>`;      // stitching
    c += `<path d="M-46,${HIP - 40} Q-30,${HIP - 20} -40,${HIP - 2} M46,${HIP - 40} Q30,${HIP - 20} 40,${HIP - 2}" stroke="${INKC}" stroke-width="3.5" fill="none" opacity=".7"/>`; // pocket openings
    c += `<rect x="-90" y="${HIP - 10}" width="180" height="60" fill="${d.topD}"/>`; for (let k = -6; k <= 6; k++) c += `<path d="M${k * 10},${HIP - 8} L${k * 10},${HIP + 30}" stroke="${INKC}" stroke-width="2" opacity=".25"/>`; // ribbed hem
    c += `<path d="M-34,${SH + 20} Q-46,${SH + 80} -36,${HIP - 46} M30,${SH + 40} Q42,${SH + 90} 34,${HIP - 48}" stroke="${INKC}" stroke-width="3.5" fill="none" opacity=".22" stroke-linecap="round"/>`; // folds
    c += `<rect x="16" y="${SH + 24}" width="28" height="20" rx="3" fill="${d.patch || '#ffd34a'}" stroke="${INKC}" stroke-width="3"/><text x="30" y="${SH + 39}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="12" fill="${INKC}">AR</text>`; // chest patch
    c += `<rect x="-90" y="${SH - 60}" width="180" height="300" fill="url(#${id}b)"/>`;
    body += IN(c);
    // hood around the neck (behind the head) + drawstrings with metal tips
    body += `<path d="M${-78 + sx2},${SH - 6} Q${-96 + sx2},${SH - 70} ${sx2},${SH - 84} Q${96 + sx2},${SH - 70} ${78 + sx2},${SH - 6} Q${sx2},${SH + 34} ${-78 + sx2},${SH - 6}Z" fill="${d.topD}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/>`;
    body += `<path d="M${-40 + sx2},${SH - 22} Q${sx2},${SH + 10} ${40 + sx2},${SH - 22}" stroke="${INKC}" stroke-width="3" fill="none" opacity=".45"/>`;
    [-1, 1].forEach(sd => { const x0 = sd * 13 + sx2; body += `<path d="M${x0},${SH - 4} Q${x0 + sd * 3},${SH + 30} ${x0 + sd * 2},${SH + 62}" stroke="#f3ece2" stroke-width="5.5" fill="none" stroke-linecap="round"/><rect x="${x0 + sd * 2 - 4}" y="${SH + 60}" width="8" height="13" rx="2" fill="#b9bec7" stroke="${INKC}" stroke-width="2.5"/>`; });
  } else if (d.outfit === 'zipjacket' || d.outfit === 'flannel') {
    // layered: shirt/tee underneath (the bean), garment on top with an opening, collar, buttons/zip, pockets, pattern, neck accessory
    const fl = d.outfit === 'flannel', open = fl ? 10 : 30, top0 = SH - 40, bot = HIP + 30, cx0 = sx2 * .6;
    const L1 = `M-95,${top0} L${cx0 - open},${top0} L${cx0 - open * .55},${SH + 40} L${cx0 - open * .5},${bot} L-95,${bot}Z`, R1 = `M95,${top0} L${cx0 + open},${top0} L${cx0 + open * .55},${SH + 40} L${cx0 + open * .5},${bot} L95,${bot}Z`;
    let c = `<rect x="-95" y="${top0}" width="190" height="300" fill="${d.tee || '#f4f2ec'}"/>`;
    if (d.teeArt) c += `<text x="${cx0}" y="${SH + 84}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="${d.teeArt}" stroke="${INKC}" stroke-width="3" paint-order="stroke">${d.teeTxt || ''}</text>`;
    const gfill = fl ? `url(#${id}p)` : d.top;
    if (fl) s += `<defs><pattern id="${id}p" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)"><rect width="34" height="34" fill="${d.top}"/><rect x="0" y="12" width="34" height="10" fill="${d.topD}" opacity=".75"/><rect x="12" y="0" width="10" height="34" fill="${d.topD}" opacity=".75"/><path d="M0,17 H34 M17,0 V34" stroke="${d.line || '#f2c94c'}" stroke-width="2"/><path d="M0,5 H34 M5,0 V34" stroke="#000" stroke-opacity=".18" stroke-width="2"/></pattern></defs>`;
    c += `<path d="${L1}" fill="${gfill}"/><path d="${R1}" fill="${gfill}"/>`;
    // opening edges
    c += `<path d="M${cx0 - open},${top0} L${cx0 - open * .55},${SH + 40} L${cx0 - open * .5},${bot} M${cx0 + open},${top0} L${cx0 + open * .55},${SH + 40} L${cx0 + open * .5},${bot}" stroke="${INKC}" stroke-width="4.5" fill="none" stroke-linejoin="round"/>`;
    if (!fl) { // zip teeth + hem band + side pockets
      for (let k = 0; k < 13; k++) { const y = SH + 4 + k * 13; [-1, 1].forEach(sd => c += `<path d="M${cx0 + sd * (open * .55 - 2)},${y} l${-sd * 5},0" stroke="#d9dde3" stroke-width="3.5"/>`); }
      c += `<rect x="-95" y="${HIP - 14}" width="190" height="40" fill="${d.topD}"/>`; for (let k = -8; k <= 8; k++) c += `<path d="M${k * 11},${HIP - 12} L${k * 11},${HIP + 22}" stroke="${INKC}" stroke-width="2" opacity=".22"/>`;
      c += `<path d="M-52,${HIP - 70} L-36,${HIP - 34} M52,${HIP - 70} L36,${HIP - 34}" stroke="${INKC}" stroke-width="4" stroke-linecap="round"/><path d="M-56,${HIP - 66} L-42,${HIP - 34} M56,${HIP - 66} L42,${HIP - 34}" stroke="${mixC(d.top, '#ffffff', .35)}" stroke-width="2" stroke-dasharray="4 4"/>`;
      c += `<path d="M-60,${SH + 10} Q-70,${SH + 70} -58,${HIP - 80} M58,${SH + 30} Q66,${SH + 80} 60,${HIP - 70}" stroke="${INKC}" stroke-width="3" fill="none" opacity=".2" stroke-linecap="round"/>`;
    } else { // shirt: button column, chest pockets with flaps
      for (let k = 0; k < 5; k++) c += `<circle cx="${cx0 + 4}" cy="${SH + 18 + k * 30}" r="5" fill="#f4f2ec" stroke="${INKC}" stroke-width="2.5"/>`;
      [-1, 1].forEach(sd => { const px = cx0 + sd * 38; c += `<rect x="${px - 20}" y="${SH + 20}" width="40" height="42" rx="5" fill="${gfill}" stroke="${INKC}" stroke-width="3.5"/><path d="M${px - 22},${SH + 20} L${px + 22},${SH + 20} L${px + 18},${SH + 36} Q${px},${SH + 42} ${px - 18},${SH + 36}Z" fill="${d.topD}" stroke="${INKC}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${px}" cy="${SH + 34}" r="3.5" fill="#f4f2ec" stroke="${INKC}" stroke-width="2"/>`; });
    }
    c += `<rect x="-95" y="${SH - 60}" width="190" height="320" fill="url(#${id}b)"/>`;
    body += IN(c);
    // collar on top: hood roll (jacket) or pointed shirt collar (flannel)
    if (!fl) body += `<path d="M${-60 + sx2},${SH - 22} Q${-70 + sx2},${SH - 58} ${sx2},${SH - 62} Q${70 + sx2},${SH - 58} ${60 + sx2},${SH - 22} Q${36 + sx2},${SH - 34} ${sx2},${SH - 30} Q${-36 + sx2},${SH - 34} ${-60 + sx2},${SH - 22}Z" fill="${d.topD}" stroke="${INKC}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M${cx0 - 20},${SH - 18} Q${cx0},${SH + 20} ${cx0 + 20},${SH - 18}" stroke="#c9ced6" stroke-width="4" stroke-dasharray="2 5" stroke-linecap="round" fill="none"/><circle cx="${cx0}" cy="${SH + 2}" r="6" fill="#e3e6ea" stroke="${INKC}" stroke-width="2"/>`;
    else body += [-1, 1].map(sd => `<path d="M${cx0 + sd * 4},${SH - 30} L${cx0 + sd * 44},${SH - 30} L${cx0 + sd * 26},${SH + 6}Z" fill="${d.top}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/><path d="M${cx0 + sd * 10},${SH - 27} L${cx0 + sd * 38},${SH - 27}" stroke="${d.topD}" stroke-width="4"/>`).join('');
  } else if (d.outfit === 'tee') {
    // reference approach: the bean IS the garment; 2-3 bold details only
    let c = `<path d="M-90,${HIP - 26} Q0,${HIP - 8} 90,${HIP - 26} L90,${HIP + 40} L-90,${HIP + 40}Z" fill="${d.topD}" opacity=".55"/>`;                 // hem shadow
    c += `<path d="M58,${SH + 4} Q66,${SH + 70} 46,${HIP - 60}" stroke="#000" stroke-opacity=".12" stroke-width="16" fill="none" stroke-linecap="round"/>`; // side fold
    if (d.number) c += `<text x="${sx2 * .5 - 30}" y="${SH + 66}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="#ffffff" stroke="${INKC}" stroke-width="6" paint-order="stroke" transform="rotate(-6 -30 ${SH + 50})">${d.number}</text>`;
    body += IN(c);
    body += `<path d="M${-30 + sx2},${SH - 28} Q${sx2},${SH + 6} ${30 + sx2},${SH - 28}" stroke="${d.topD}" stroke-width="11" fill="none" stroke-linecap="round"/>`;   // crew collar
    if (d.strap) { // diagonal backpack strap from the right shoulder to the left hip, with a buckle
      const sx = 40 + sx2, sy = SH - 22, ex2 = -52, ey2 = HIP - 34;
      body += IN(`<path d="M${sx},${sy} L${ex2},${ey2}" stroke="${INKC}" stroke-width="26" stroke-linecap="round"/><path d="M${sx},${sy} L${ex2},${ey2}" stroke="${d.strap}" stroke-width="17" stroke-linecap="round"/>` +
        `<g transform="translate(${(sx + ex2) / 2 + 6},${(sy + ey2) / 2 - 8}) rotate(${Math.atan2(ey2 - sy, ex2 - sx) * 180 / Math.PI})"><rect x="-12" y="-14" width="24" height="28" rx="4" fill="#d9dde3" stroke="${INKC}" stroke-width="4"/><rect x="-5" y="-7" width="10" height="14" fill="${d.strap}"/></g>`);
    }
  } else if (d.outfit === 'hood') {
    let c = `<rect x="-90" y="${HIP - 30}" width="180" height="70" fill="${d.topD}"/>`;                                                                  // ribbed waistband
    c += `<path d="M-44,${HIP - 92} Q0,${HIP - 104} 44,${HIP - 92} L48,${HIP - 34} L-48,${HIP - 34}Z" fill="none" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/>`; // pocket
    c += `<path d="M60,${SH + 4} Q68,${SH + 70} 48,${HIP - 60}" stroke="#000" stroke-opacity=".12" stroke-width="16" fill="none" stroke-linecap="round"/>`;
    body += IN(c);
    // hood bunched around the neck (drawn on top of the body, under the head)
    body += `<path d="M${-74 + sx2},${SH - 8} Q${-86 + sx2},${SH - 66} ${sx2},${SH - 74} Q${86 + sx2},${SH - 66} ${74 + sx2},${SH - 8} Q${sx2},${SH + 28} ${-74 + sx2},${SH - 8}Z" fill="${d.topD}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/>`;
    [-1, 1].forEach(sd => { const x0 = sd * 16 + sx2; body += `<path d="M${x0},${SH + 2} Q${x0 + sd * 4},${SH + 40} ${x0 + sd * 2},${SH + 70}" stroke="${INKC}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M${x0},${SH + 2} Q${x0 + sd * 4},${SH + 40} ${x0 + sd * 2},${SH + 70}" stroke="#f3ece2" stroke-width="5" fill="none" stroke-linecap="round"/>`; });
  } else if (d.outfit === 'shirt') {
    let c = `<rect x="-95" y="${HIP - 46}" width="190" height="120" fill="${d.pants || '#3b4a63'}"/><rect x="-95" y="${HIP - 50}" width="190" height="12" fill="${d.belt || '#5a3a22'}" stroke="${INKC}" stroke-width="3"/><rect x="-12" y="${HIP - 53}" width="24" height="18" rx="3" fill="#d9b25a" stroke="${INKC}" stroke-width="3"/>`;
    if (d.view !== 'back') c += `<path d="M${sx2 * .6 + 2},${SH - 6} L${sx2 * .6 - 2},${HIP - 52}" stroke="${INKC}" stroke-width="3.5" opacity=".6"/>` + [0, 1, 2].map(k => `<circle cx="${sx2 * .6 + 9}" cy="${SH + 26 + k * 40}" r="5" fill="#f4f2ec" stroke="${INKC}" stroke-width="2.5"/>`).join('');
    if (d.view !== 'back') c += `<rect x="-58" y="${SH + 22}" width="36" height="34" rx="4" fill="none" stroke="${INKC}" stroke-width="3.5"/><path d="M-58,${SH + 30} L-22,${SH + 30}" stroke="${INKC}" stroke-width="3"/>`;
    c += `<path d="M58,${SH + 4} Q66,${SH + 70} 46,${HIP - 64}" stroke="#000" stroke-opacity=".1" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="-95" y="${SH - 60}" width="190" height="320" fill="url(#${id}b)"/>`;
    body += IN(c);
    if (d.view !== 'back') body += [-1, 1].map(sd => `<path d="M${sd * 6 + sx2},${SH - 30} L${sd * 40 + sx2},${SH - 34} L${sd * 22 + sx2},${SH + 2}Z" fill="${d.top}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/>`).join('');
    if (d.scarf && d.view !== 'back') body += `<path d="M${-30 + sx2},${SH - 30} Q${sx2},${SH - 6} ${30 + sx2},${SH - 30} L${26 + sx2},${SH - 14} Q${sx2},${SH + 8} ${-26 + sx2},${SH - 14}Z" fill="${d.scarf}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/><path d="M${-8 + sx2},${SH - 4} l-14,34 l20,-6Z" fill="${d.scarf}" stroke="${INKC}" stroke-width="4" stroke-linejoin="round"/>`;
  } else if (d.outfit === 'navy') { // naval officer: double-breasted dark jacket, gold buttons, white shirt + black tie in a V, shoulder boards, cuff stripes
    let c = `<path d="M-30,${SH - 30} L0,${SH + 70} L30,${SH - 30}Z" fill="#f6f6f2"/><path d="M-9,${SH - 18} L9,${SH - 18} L5,${SH + 52} L0,${SH + 64} L-5,${SH + 52}Z" fill="#15161c"/>`;
    c += `<path d="M-30,${SH - 30} L0,${SH + 70} M30,${SH - 30} L0,${SH + 70}" stroke="${INKC}" stroke-width="5"/>`;
    [0, 1, 2].forEach(k => [-1, 1].forEach(sd => c += `<circle cx="${sd * 22}" cy="${SH + 92 + k * 34}" r="7" fill="#e7c24a" stroke="${INKC}" stroke-width="3"/>`));
    c += `<path d="M58,${SH + 4} Q66,${SH + 70} 46,${HIP - 60}" stroke="#000" stroke-opacity=".14" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="-95" y="${SH - 60}" width="190" height="320" fill="url(#${id}b)"/>`;
    if (d.badge) c += `<rect x="30" y="${SH + 30}" width="30" height="16" rx="2" fill="#e7c24a" stroke="${INKC}" stroke-width="2.5"/><rect x="-62" y="${SH + 26}" width="34" height="10" fill="${d.ribbon || '#c60b1e'}" stroke="${INKC}" stroke-width="2.5"/><rect x="-62" y="${SH + 29}" width="34" height="4" fill="${d.ribbon2 || '#ffc400'}"/>`;
    body += IN(c);
    [-1, 1].forEach(sd => body += `<path d="M${sd * 22 + sx2},${SH - 30} L${sd * 54 + sx2},${SH - 24} L${sd * 52 + sx2},${SH - 12} L${sd * 24 + sx2},${SH - 18}Z" fill="${d.topD}" stroke="${INKC}" stroke-width="4" stroke-linejoin="round"/><path d="M${sd * 30 + sx2},${SH - 22} L${sd * 48 + sx2},${SH - 19}" stroke="#e7c24a" stroke-width="4"/>`);
  } else if (d.outfit === 'marin') { // French sailor: striped marinière, square blue collar with white stripes, small neck scarf
    let c = ''; for (let k = 0; k < 12; k++) c += `<rect x="-95" y="${SH - 20 + k * 22}" width="190" height="9" fill="${d.stripe || '#1f3a7a'}"/>`;
    c += `<rect x="-95" y="${HIP - 26}" width="190" height="80" fill="${d.pants || '#1f2a4a'}"/><rect x="-95" y="${HIP - 30}" width="190" height="8" fill="#15161c"/>`;
    c += `<rect x="-95" y="${SH - 60}" width="190" height="320" fill="url(#${id}b)"/>`;
    body += IN(c);
    body += `<path d="M${-54 + sx2},${SH - 26} L${54 + sx2},${SH - 26} L${46 + sx2},${SH + 30} L${sx2},${SH + 58} L${-46 + sx2},${SH + 30}Z" fill="${d.collar || '#1f3a7a'}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M${-42 + sx2},${SH - 18} L${-36 + sx2},${SH + 26} L${sx2},${SH + 46} L${36 + sx2},${SH + 26} L${42 + sx2},${SH - 18}" stroke="#fff" stroke-width="4" fill="none"/>` +
      `<path d="M${-20 + sx2},${SH - 26} L${sx2},${SH + 2} L${20 + sx2},${SH - 26}Z" fill="#f6f6f2" stroke="${INKC}" stroke-width="4"/><path d="M${-10 + sx2},${SH + 8} L${10 + sx2},${SH + 8} L${4 + sx2},${SH + 40} L${-4 + sx2},${SH + 40}Z" fill="#15161c"/>`;
  } else if (d.outfit === 'military') {
    s += `<defs><pattern id="${id}cm" width="90" height="90" patternUnits="userSpaceOnUse"><rect width="90" height="90" fill="#6b7448"/><path d="M5,10 q18,-10 30,4 q8,14 -10,18 q-22,2 -20,-22Z" fill="#4a5232"/><path d="M50,40 q20,-8 32,6 q4,16 -16,16 q-20,-2 -16,-22Z" fill="#8f875a"/><path d="M20,60 q14,-6 24,6 q2,12 -14,12 q-14,-2 -10,-18Z" fill="#3b3326"/><path d="M60,4 q12,-2 16,8 q-4,10 -14,6Z" fill="#3b3326"/><path d="M0,44 q10,-4 16,4 q-2,8 -12,8Z" fill="#8f875a"/></pattern></defs>`;
    let c = `<path d="${B}" fill="url(#${id}cm)"/><rect x="-95" y="${SH - 60}" width="190" height="320" fill="url(#${id}b)"/>`;
    [-1, 1].forEach(sd => { const px = sd * 34; c += `<rect x="${px - 20}" y="${SH + 26}" width="40" height="40" rx="4" fill="url(#${id}cm)" stroke="${INKC}" stroke-width="4"/><path d="M${px - 22},${SH + 26} L${px + 22},${SH + 26} L${px + 20},${SH + 40} L${px - 20},${SH + 40}Z" fill="#4a5232" stroke="${INKC}" stroke-width="4" stroke-linejoin="round"/>`; });
    c += `<rect x="12" y="${SH + 6}" width="44" height="13" rx="2" fill="#2c3020" stroke="${INKC}" stroke-width="2.5"/><text x="34" y="${SH + 16}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="10" fill="#e8e2c8">${d.nameTape || 'RAMOS'}</text>`;
    c += `<rect x="-95" y="${HIP - 34}" width="190" height="22" fill="#3a3324" stroke="${INKC}" stroke-width="4"/><rect x="-14" y="${HIP - 38}" width="28" height="30" rx="3" fill="#c9b26a" stroke="${INKC}" stroke-width="4"/>`;
    body += IN(c);
    body += `<path d="M${-40 + sx2},${SH - 26} L${-6 + sx2},${SH + 10} L${sx2},${SH - 22} L${6 + sx2},${SH + 10} L${40 + sx2},${SH - 26}" fill="#4a5232" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/>`;               // collar
    if (d.medals) body += `<rect x="${-58 + sx2}" y="${SH + 8}" width="30" height="10" fill="#c23a3a" stroke="${INKC}" stroke-width="2.5"/><rect x="${-58 + sx2}" y="${SH + 8}" width="10" height="10" fill="#f2c94c"/><rect x="${-38 + sx2}" y="${SH + 8}" width="10" height="10" fill="#2f6fbf"/>`;
  } else if (d.outfit === 'cleaner') { // limpiadora: uniforme de color con cuello blanco, delantal con bolsillo grande y bayeta colgando, cinta con el nombre
    let c = `<rect x="-95" y="${SH - 60}" width="190" height="320" fill="url(#${id}b)"/>`;
    [0, 1, 2].forEach(k => c += `<circle cx="${sx2 * .5}" cy="${SH + 16 + k * 30}" r="5.5" fill="#f4f2ec" stroke="${INKC}" stroke-width="2.5"/>`);
    c += `<path d="M-74,${SH + 96} Q0,${SH + 84} 74,${SH + 96} L84,${HIP + 40} L-84,${HIP + 40}Z" fill="${d.apron || '#f2f0ea'}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/>`;
    c += `<path d="M-74,${SH + 96} Q0,${SH + 84} 74,${SH + 96}" stroke="${d.apronTie || '#e46a8a'}" stroke-width="9"/>`;
    c += `<path d="M-50,${HIP - 54} L50,${HIP - 54} L46,${HIP - 6} Q0,${HIP + 4} -46,${HIP - 6}Z" fill="${mixC(d.apron || '#f2f0ea', '#000000', .08)}" stroke="${INKC}" stroke-width="4.5" stroke-linejoin="round"/><path d="M0,${HIP - 54} L0,${HIP - 2}" stroke="${INKC}" stroke-width="3.5"/>`;
    c += `<rect x="-60" y="${SH + 26}" width="50" height="14" rx="3" fill="#fff" stroke="${INKC}" stroke-width="2.5"/><text x="-35" y="${SH + 37}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="10" fill="${INKC}">${d.nameTape || 'PILAR'}</text>`;
    c += `<path d="M58,${SH + 4} Q66,${SH + 70} 46,${HIP - 64}" stroke="#000" stroke-opacity=".1" stroke-width="16" fill="none" stroke-linecap="round"/>`;
    body += IN(c);
    body += [-1, 1].map(sd => `<path d="M${sd * 2 + sx2},${SH - 30} Q${sd * 40 + sx2},${SH - 36} ${sd * 44 + sx2},${SH - 10} Q${sd * 24 + sx2},${SH + 6} ${sd * 2 + sx2},${SH - 14}Z" fill="#fbfaf6" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/>`).join('');
    if (d.rag) body += `<path d="M-70,${HIP - 70} L-44,${HIP - 74} L-40,${HIP - 6} Q-50,${HIP + 6} -62,${HIP - 4} Q-68,${HIP - 30} -70,${HIP - 70}Z" fill="${d.rag}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/><path d="M-64,${HIP - 46} L-44,${HIP - 48} M-62,${HIP - 26} L-42,${HIP - 28}" stroke="#000" stroke-opacity=".18" stroke-width="4"/>`;
  } else if (d.outfit === 'king') { // rey: manto rojo abierto con borde de armiño, jubón dorado, banda cruzada y medallas, cinturón de oro
    let c = `<rect x="-95" y="${SH - 60}" width="190" height="320" fill="${d.vest || '#e7c24a'}"/>`;
    for (let k = 0; k < 8; k++) c += `<path d="M-20,${SH + k * 26} q20,10 40,0" stroke="#b8902a" stroke-width="3" fill="none"/>`;
    const open = 30;
    c += `<path d="M-95,${SH - 40} L${-open},${SH - 40} L${-open * .7},${HIP + 40} L-95,${HIP + 40}Z" fill="url(#${id}g)"/><path d="M95,${SH - 40} L${open},${SH - 40} L${open * .7},${HIP + 40} L95,${HIP + 40}Z" fill="url(#${id}g)"/>`;
    [-1, 1].forEach(sd => { c += `<path d="M${sd * open},${SH - 40} L${sd * open * .7},${HIP + 40}" stroke="#f6f3ec" stroke-width="22"/><path d="M${sd * (open + 11)},${SH - 40} L${sd * (open * .7 + 11)},${HIP + 40}" stroke="${INKC}" stroke-width="4"/>`;
      for (let k = 0; k < 6; k++) c += `<path d="M${sd * (open - 1 - k * .5)},${SH - 10 + k * 34} l0,8" stroke="${INKC}" stroke-width="5" stroke-linecap="round"/>`; });
    c += `<path d="M44,${SH - 30} L-60,${HIP - 40}" stroke="${INKC}" stroke-width="30" stroke-linecap="round"/><path d="M44,${SH - 30} L-60,${HIP - 40}" stroke="${d.sash || '#2f5fbf'}" stroke-width="21" stroke-linecap="round"/><path d="M44,${SH - 26} L-60,${HIP - 36}" stroke="#fff" stroke-opacity=".3" stroke-width="5"/>`;
    c += `<rect x="-95" y="${HIP - 44}" width="190" height="20" fill="#e7c24a" stroke="${INKC}" stroke-width="4"/><circle cx="0" cy="${HIP - 34}" r="13" fill="#c8243a" stroke="${INKC}" stroke-width="4"/>`;
    c += `<rect x="-95" y="${SH - 60}" width="190" height="320" fill="url(#${id}b)"/>`;
    body += IN(c);
    body += `<g transform="translate(${-48 + sx2},${SH + 64})"><path d="M-8,-20 L8,-20 L5,0 L-5,0Z" fill="#c8243a" stroke="${INKC}" stroke-width="3"/><circle cx="0" cy="10" r="13" fill="#e7c24a" stroke="${INKC}" stroke-width="4"/><path d="M0,1 L3,8 L10,8 L4,12 L6,19 L0,15 L-6,19 L-4,12 L-10,8 L-3,8Z" fill="#fff6c8"/></g>`;
    body += `<path d="M${-64 + sx2},${SH - 26} Q${sx2},${SH + 18} ${64 + sx2},${SH - 26} Q${70 + sx2},${SH - 4} ${50 + sx2},${SH + 8} Q${sx2},${SH + 40} ${-50 + sx2},${SH + 8} Q${-70 + sx2},${SH - 4} ${-64 + sx2},${SH - 26}Z" fill="#f6f3ec" stroke="${INKC}" stroke-width="6" stroke-linejoin="round"/>` +
      [[-44, -10], [-22, 6], [0, 12], [22, 6], [44, -10]].map(([x, y]) => `<path d="M${x + sx2},${SH + y} l0,9 M${x - 4 + sx2},${SH + y + 3} l8,0" stroke="${INKC}" stroke-width="4" stroke-linecap="round"/>`).join('');
  } else if (d.outfit === 'labcoat' || d.outfit === 'suit') { // labcoat: bata blanca abierta con solapas, camisa y corbata en V, bolis, bolsillos, faldón largo · suit: traje (sin bolis ni faldón)
    const suit = d.outfit === 'suit', open = suit ? 22 : 30, sh2 = d.shirt || (suit ? '#f4f2ec' : '#cfe0f0');
    let c = `<rect x="-95" y="${SH - 60}" width="190" height="320" fill="${sh2}"/>`;
    if (d.view !== 'back') c += `<path d="M-9,${SH - 18} L9,${SH - 18} L6,${SH + 96} L0,${SH + 110} L-6,${SH + 96}Z" fill="${d.tie || '#7a2a2a'}" stroke="${INKC}" stroke-width="3"/>` +
      `<path d="M-4,${SH + 20} L4,${SH + 12} M-5,${SH + 50} L5,${SH + 42}" stroke="#000" stroke-opacity=".25" stroke-width="3"/>`;
    c += `<path d="M-95,${SH - 40} L${-open},${SH - 40} L${-open * .5},${HIP + 40} L-95,${HIP + 40}Z" fill="url(#${id}g)"/><path d="M95,${SH - 40} L${open},${SH - 40} L${open * .5},${HIP + 40} L95,${HIP + 40}Z" fill="url(#${id}g)"/>`;
    c += `<path d="M${-open},${SH - 40} L${-open * .5},${HIP + 40} M${open},${SH - 40} L${open * .5},${HIP + 40}" stroke="${INKC}" stroke-width="5"/>`;
    if (d.view !== 'back') {
      [-1, 1].forEach(sd => c += `<path d="M${sd * open},${SH - 40} L${sd * (open + 30)},${SH + 4} L${sd * (open * .82)},${SH + 70}" fill="${d.topD}" stroke="${INKC}" stroke-width="4.5" stroke-linejoin="round"/>`);
      if (!suit) c += `<rect x="-78" y="${SH + 50}" width="36" height="34" rx="3" fill="${d.top}" stroke="${INKC}" stroke-width="3.5"/>` +
        `<rect x="-72" y="${SH + 30}" width="7" height="28" rx="3" fill="#2f5fbf" stroke="${INKC}" stroke-width="2.5"/><rect x="-60" y="${SH + 34}" width="7" height="24" rx="3" fill="#c23a3a" stroke="${INKC}" stroke-width="2.5"/>`;
      if (suit) c += `<path d="M-74,${SH + 52} L-46,${SH + 52} L-50,${SH + 40} L-56,${SH + 48} L-62,${SH + 38} L-68,${SH + 48}Z" fill="${d.square || '#f4f2ec'}" stroke="${INKC}" stroke-width="2.5"/><path d="M-78,${SH + 52} L-42,${SH + 52}" stroke="${INKC}" stroke-width="3.5"/>`;
      [-1, 1].forEach(sd => c += `<path d="M${sd * 44},${HIP - 46} L${sd * 82},${HIP - 46} L${sd * 82},${HIP - 4}" fill="none" stroke="${INKC}" stroke-width="3.5" stroke-linecap="round"/>`);
      [0, 1].forEach(k => c += `<circle cx="${-open * .9 + 10}" cy="${SH + 110 + k * 46}" r="5.5" fill="#f4f2ec" stroke="${INKC}" stroke-width="2.5"/>`);
    }
    c += `<path d="M58,${SH + 4} Q66,${SH + 70} 46,${HIP - 64}" stroke="#000" stroke-opacity=".1" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="-95" y="${SH - 60}" width="190" height="320" fill="url(#${id}b)"/>`;
    body += IN(c);
    if (!suit) body += [-1, 1].map(sd => `<path d="M${sd * 93},${HIP - 40} Q${sd * 98},${HIP + 40} ${sd * 90},${HIP + 104} L${sd * (open * .5 + 4)},${HIP + 104} L${sd * (open * .5)},${HIP + 10} Q${sd * 60},${HIP + 4} ${sd * 93},${HIP - 40}Z" fill="${d.top}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/><path d="M${sd * 70},${HIP + 30} Q${sd * 74},${HIP + 70} ${sd * 70},${HIP + 96}" stroke="#000" stroke-opacity=".1" stroke-width="10" fill="none"/>`).join('');
    if (d.view !== 'back') body += [-1, 1].map(sd => `<path d="M${sd * 8 + sx2},${SH - 30} L${sd * 34 + sx2},${SH - 36} L${sd * 22 + sx2},${SH - 4}Z" fill="${sh2}" stroke="${INKC}" stroke-width="4.5" stroke-linejoin="round"/>`).join('');
  } else if (d.outfit === 'chef') {
    let c = `<rect x="-95" y="${SH - 60}" width="190" height="320" fill="url(#${id}b)"/>`;
    c += `<path d="M10,${SH - 26} Q34,${SH + 60} 20,${HIP + 10}" stroke="${INKC}" stroke-width="4" fill="none" opacity=".55"/>`;                       // double-breasted overlap
    [0, 1, 2].forEach(k => [-1, 1].forEach(sd => c += `<circle cx="${sd < 0 ? -12 : 42}" cy="${SH + 24 + k * 40}" r="6.5" fill="#f4f2ec" stroke="${INKC}" stroke-width="3"/>`));
    c += `<path d="M-70,${HIP - 74} L70,${HIP - 74} L80,${HIP + 40} L-80,${HIP + 40}Z" fill="${d.apron || '#2a2d36'}" stroke="${INKC}" stroke-width="5"/><path d="M-70,${HIP - 74} L70,${HIP - 74}" stroke="${d.apronTie || '#c23a3a'}" stroke-width="8"/>`;
    body += IN(c);
    body += `<path d="M${-34 + sx2},${SH - 30} Q${sx2},${SH + 4} ${34 + sx2},${SH - 30} L${30 + sx2},${SH - 10} Q${sx2},${SH + 22} ${-30 + sx2},${SH - 10}Z" fill="${d.scarf || '#d63c2f'}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/><path d="M${sx2 + 6},${SH + 4} l12,26 l-20,-4Z" fill="${d.scarf || '#d63c2f'}" stroke="${INKC}" stroke-width="4" stroke-linejoin="round"/>`;
  } else if (d.outfit === 'cardigan') {
    const sh2 = d.shirt || '#bcd6ee', open = 22;
    let c = `<rect x="-95" y="${SH - 60}" width="190" height="320" fill="${sh2}"/>`;
    c += `<path d="M-95,${SH - 40} L${-open},${SH - 40} L${-open * .6},${HIP + 40} L-95,${HIP + 40}Z" fill="url(#${id}g)"/><path d="M95,${SH - 40} L${open},${SH - 40} L${open * .6},${HIP + 40} L95,${HIP + 40}Z" fill="url(#${id}g)"/>`;
    c += `<path d="M${-open},${SH - 40} L${-open * .6},${HIP + 40} M${open},${SH - 40} L${open * .6},${HIP + 40}" stroke="${INKC}" stroke-width="5"/>`;
    for (let k = 0; k < 4; k++) c += `<circle cx="${-open * .8 - 4}" cy="${SH + 30 + k * 34}" r="6" fill="${d.btn || '#5a3a22'}" stroke="${INKC}" stroke-width="3"/>`;
    [-1, 1].forEach(sd => c += `<rect x="${sd * 52 - 18}" y="${HIP - 80}" width="36" height="32" rx="5" fill="none" stroke="${INKC}" stroke-width="4"/>`);
    c += `<rect x="-95" y="${HIP - 20}" width="190" height="60" fill="${d.topD}"/>` + Array.from({ length: 17 }, (_, k) => `<path d="M${-88 + k * 11},${HIP - 18} L${-88 + k * 11},${HIP + 20}" stroke="${INKC}" stroke-width="2" opacity=".22"/>`).join('');
    c += `<rect x="-95" y="${SH - 60}" width="190" height="320" fill="url(#${id}b)"/>`;
    body += IN(c);
    body += [-1, 1].map(sd => `<path d="M${sd * 4 + sx2},${SH - 30} L${sd * 34 + sx2},${SH - 30} L${sd * 22 + sx2},${SH - 4}Z" fill="${sh2}" stroke="${INKC}" stroke-width="4" stroke-linejoin="round"/>`).join('');
  } else body += IN(`<rect x="-90" y="${SH - 60}" width="180" height="300" fill="url(#${id}b)"/>`);
  body += `<path d="${B}" fill="none" stroke="${INKC}" stroke-width="${LW}" stroke-linejoin="round"/>`;
  if (d.rich && d.outfit === 'military') { // cartucheras, tirantes del chaleco
    body += [-48, 26].map(x => `<rect x="${x}" y="${HIP - 32}" width="22" height="28" rx="4" fill="#4a5232" stroke="${INKC}" stroke-width="4"/><path d="M${x},${HIP - 22} L${x + 22},${HIP - 22}" stroke="${INKC}" stroke-width="3"/><circle cx="${x + 11}" cy="${HIP - 26}" r="3" fill="#c9b26a"/>`).join('') +
      [-1, 1].map(sd => `<path d="M${sd * 62 + sx2},${SH + 4} L${sd * 60},${HIP - 36}" stroke="${INKC}" stroke-width="15" stroke-linecap="round"/><path d="M${sd * 62 + sx2},${SH + 4} L${sd * 60},${HIP - 36}" stroke="#3a3324" stroke-width="8" stroke-linecap="round"/>`).join(''); }
  if (d.rich && d.outfit === 'cleaner') { // volante del delantal, spray en el bolsillo
    let fr = `M-84,${HIP + 26}`; for (let k = 0; k < 7; k++) fr += ` Q${-72 + k * 24},${HIP + 44} ${-60 + k * 24},${HIP + 28}`;
    body += IN(`<path d="${fr} L84,${HIP + 60} L-84,${HIP + 60}Z" fill="${d.apron || '#f4f1ea'}" stroke="${INKC}" stroke-width="4"/>`) +
      `<g transform="translate(26,${HIP - 54})"><rect x="-9" y="-34" width="18" height="34" rx="4" fill="#4fc0e8" stroke="${INKC}" stroke-width="4"/><rect x="-6" y="-46" width="12" height="12" fill="#fff" stroke="${INKC}" stroke-width="3"/><path d="M6,-44 L16,-44 L16,-38 L6,-38" fill="#fff" stroke="${INKC}" stroke-width="2.5"/><path d="M-4,-26 L-4,-8" stroke="#fff" stroke-opacity=".6" stroke-width="3"/></g>`; }
  if (d.rich && d.outfit === 'king') { // cuello de armiño encima
    body += `<path d="M${-70 + sx2},${SH - 28} Q${sx2},${SH + 16} ${70 + sx2},${SH - 28} Q${78 + sx2},${SH - 2} ${56 + sx2},${SH + 12} Q${sx2},${SH + 46} ${-56 + sx2},${SH + 12} Q${-78 + sx2},${SH - 2} ${-70 + sx2},${SH - 28}Z" fill="#f6f3ec" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/>` +
      [[-48, -8], [-24, 8], [0, 14], [24, 8], [48, -8]].map(([x, y]) => `<path d="M${x + sx2},${SH + y} l0,10 M${x - 5 + sx2},${SH + y + 3} l10,0" stroke="${INKC}" stroke-width="4.5" stroke-linecap="round"/>`).join(''); }
  if (d.splat) body += IN([[-40, SH + 40, 9], [30, SH + 110, 7], [-20, HIP - 40, 11], [48, SH + 30, 5], [-56, HIP - 80, 6], [12, SH + 70, 4]].map(([x, y, r], k) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${d.splat}" stroke="${INKC}" stroke-width="2"/><circle cx="${x + r * 1.3}" cy="${y - r}" r="${r * .4}" fill="${d.splat}"/>`).join(''));
  if (d.bag && d.view !== 'back') { // carriel: leather bag on a strap across the chest (right shoulder → left hip)
    const bx = -70, by = HIP - 30;
    body += `<path d="M${44 + sx2},${SH - 24} Q${-10},${(SH + HIP) / 2} ${bx + 14},${by - 30}" stroke="${INKC}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M${44 + sx2},${SH - 24} Q${-10},${(SH + HIP) / 2} ${bx + 14},${by - 30}" stroke="${d.bag}" stroke-width="11" fill="none" stroke-linecap="round"/>` +
      `<path d="M${bx - 40},${by - 34} L${bx + 40},${by - 34} L${bx + 44},${by + 26} Q${bx},${by + 40} ${bx - 44},${by + 26}Z" fill="${d.bag}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/>` +
      `<path d="M${bx - 42},${by - 34} L${bx + 42},${by - 34} L${bx + 34},${by - 4} Q${bx},${by + 6} ${bx - 34},${by - 4}Z" fill="${mixC(d.bag, '#000000', .25)}" stroke="${INKC}" stroke-width="6" stroke-linejoin="round"/><rect x="${bx - 7}" y="${by - 12}" width="14" height="14" rx="3" fill="#d9b25a" stroke="${INKC}" stroke-width="3"/>`; }
  // round head (perfect circle), soft shading on the shadow side
  const R0 = 100, rx = R0, ry = R0, fx = 1.04, fy = 1.04;
  const HP2 = (typeof hairParts === 'function' && d.hair2) ? hairParts(d.hair2, d.hairCol || '#2a1a12') : { back: '', front: '' };
  let hatBack = '';
  let h = '@@HATBACK@@' + (d.bun ? `<circle cx="-84" cy="-62" r="36" fill="${d.bun}" stroke="${INKC}" stroke-width="8"/><path d="M-104,-70 Q-84,-92 -64,-70" stroke="${mixC(d.bun, '#ffffff', .25)}" stroke-width="5" fill="none"/>` : '') + HP2.back + `<circle cx="0" cy="0" r="${R0}" fill="url(#${id}h)" stroke="${INKC}" stroke-width="${LW + 1}"/>`;
  const TN = d.turn || 0, [lx, ly] = d.look, E = [[-36 + TN * 26, -2], [36 + TN * 26, -2]];
  // brows: short, thick, rounded
  const hBase = h;
  const by = (d.hat === 'flatcap' ? -14 : d.hat === 'bowler' ? -16 : d.hat === 'vueltiao' || d.hat === 'peaked' ? -30 : -44) - d.brows * 7;
  E.forEach(([ex], i) => { const s2 = i ? 1 : -1, t = d.browTilt * 10 * s2; h += `<path d="M${ex - 17},${by + t} Q${ex},${by - 6} ${ex + 17},${by - t}" stroke="${INKC}" stroke-width="${d.browCol ? 13 : 10}" fill="none" stroke-linecap="round"/>` + (d.browCol ? `<path d="M${ex - 17},${by + t} Q${ex},${by - 6} ${ex + 17},${by - t}" stroke="${d.browCol}" stroke-width="5" fill="none" stroke-linecap="round"/>` : ''); });
  // eyes (same family as the reference: heavy-lidded black half-discs, black ovals, round shocked eyes)
  E.forEach(([ex, ey], i) => { const s2 = i ? 1 : -1, px = ex + lx, py = ey + ly;
    if (d.eyeStyle === 'palo' && (d.face === 'smug' || d.face === 'angry')) { const r = d.face === 'angry' ? s2 * -14 : s2 * 2; // ojos del «estilo palo v1»: párpado largo y ojo en D pequeño
      h += `<g transform="translate(${px},${py - 4}) rotate(${r})"><line x1="-21" y1="0" x2="21" y2="0" stroke="${INKC}" stroke-width="7" stroke-linecap="round"/><path d="M-9.5,0 Q-9.5,16 0,16 Q9.5,16 9.5,0Z" fill="${INKC}"/></g>`; }
    else if (d.eyeStyle === 'palo' && d.face === 'wide') h += `<circle cx="${ex}" cy="${ey + 2}" r="22" fill="#fff" stroke="${INKC}" stroke-width="7"/><circle cx="${ex + lx * .5}" cy="${ey + 2 + ly * .5}" r="6.5" fill="${INKC}"/>`;
    else if (d.face === 'smug' || d.face === 'angry') { const tl = d.face === 'angry' ? s2 * 4 : -2;
      h += `<path d="M${px - 15},${py - 3 - tl} L${px + 15},${py - 3 + tl} A15 14 0 0 1 ${px - 15},${py - 3 - tl}Z" fill="${INKC}"/><path d="M${px - 19},${py - 4 - tl * 1.2} L${px + 19},${py - 4 + tl * 1.2}" stroke="${INKC}" stroke-width="6" stroke-linecap="round"/>`; }
    else if (d.face === 'open') h += `<ellipse cx="${px}" cy="${py}" rx="10" ry="13" fill="${INKC}"/>`;
    else if (d.face === 'wide') h += `<circle cx="${ex}" cy="${ey}" r="19" fill="#fff" stroke="${INKC}" stroke-width="6"/><circle cx="${ex + lx * .5}" cy="${ey + ly * .5}" r="5.5" fill="${INKC}"/>`;
    else if (d.face === 'closed') h += `<path d="M${ex - 15},${ey} Q${ex},${ey + 10} ${ex + 15},${ey}" stroke="${INKC}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    else if (d.face === 'happy') h += `<path d="M${ex - 15},${ey + 6} Q${ex},${ey - 11} ${ex + 15},${ey + 6}" stroke="${INKC}" stroke-width="7" fill="none" stroke-linecap="round"/>`; });
  const my = 42, mx = lx * .25 + TN * 26;
  if (d.mouth === 'smile') h += `<path d="M${mx - 18},${my - 4} Q${mx},${my + 12} ${mx + 18},${my - 4}" stroke="${INKC}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  else if (d.mouth === 'smirk') h += `<path d="M${mx - 4},${my + 4} Q${mx + 14},${my + 8} ${mx + 26},${my - 6}" stroke="${INKC}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  else if (d.mouth === 'line') h += `<path d="M${mx - 12},${my} L${mx + 12},${my}" stroke="${INKC}" stroke-width="6" stroke-linecap="round"/>`;
  else if (d.mouth === 'o') h += `<ellipse cx="${mx}" cy="${my + 2}" rx="9" ry="11" fill="${INKC}"/>`;
  else if (d.mouth === 'grin') h += `<rect x="${mx - 30}" y="${my - 14}" width="60" height="30" rx="8" fill="#fff" stroke="${INKC}" stroke-width="6"/><path d="M${mx - 30},${my + 1} L${mx + 30},${my + 1} M${mx - 15},${my - 14} L${mx - 15},${my + 16} M${mx},${my - 14} L${mx},${my + 16} M${mx + 15},${my - 14} L${mx + 15},${my + 16}" stroke="${INKC}" stroke-width="3.5"/>`;
  else if (d.mouth === 'laugh') h += `<path d="M${mx - 26},${my - 8} Q${mx},${my - 12} ${mx + 26},${my - 8} Q${mx + 20},${my + 26} ${mx},${my + 28} Q${mx - 20},${my + 26} ${mx - 26},${my - 8}Z" fill="${INKC}"/><path d="M${mx - 20},${my - 8} L${mx + 20},${my - 8} L${mx + 18},${my - 1} L${mx - 18},${my - 1}Z" fill="#fff"/>`;
  else if (d.mouth === 'open') h += `<path d="M${mx - 26},${my - 8} Q${mx},${my - 14} ${mx + 26},${my - 8} Q${mx + 20},${my + 28} ${mx},${my + 30} Q${mx - 20},${my + 28} ${mx - 26},${my - 8}Z" fill="${INKC}"/><path d="M${mx - 16},${my + 17} Q${mx},${my + 6} ${mx + 16},${my + 17} Q${mx},${my + 28} ${mx - 16},${my + 17}Z" fill="#e0707a"/>`;
  if (d.wrinkles) h += `<path d="M-30,-70 Q0,-76 30,-70 M-24,-80 Q0,-86 24,-80" stroke="${INKC}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".45"/><path d="M-62,6 q-6,6 -2,14 M62,6 q6,6 2,14" stroke="${INKC}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".4"/>`;
  if (d.mustache) h += `<path transform="translate(0,-14) scale(.9) translate(${mx * .11},${my * .11})" d="M${mx - 44},${my + 2} Q${mx - 40},${my - 28} ${mx},${my - 20} Q${mx + 40},${my - 28} ${mx + 44},${my + 2} Q${mx + 30},${my - 2} ${mx + 18},${my - 4} Q${mx + 8},${my + 2} ${mx},${my - 4} Q${mx - 8},${my + 2} ${mx - 18},${my - 4} Q${mx - 30},${my - 2} ${mx - 44},${my + 2}Z" fill="${d.mustache}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/>`;
  if (d.beard) h += `<path d="M-84,10 Q-90,70 -50,100 Q-20,128 0,132 Q20,128 50,100 Q90,70 84,10 Q70,40 50,48 Q30,70 0,70 Q-30,70 -50,48 Q-70,40 -84,10Z" fill="${d.beard}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/><path d="M-40,84 Q-30,104 -14,112 M40,84 Q30,104 14,112 M0,90 L0,118" stroke="${mixC(d.beard, '#000000', .2)}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M${mx - 14},${my + 6} Q${mx},${my + 16} ${mx + 14},${my + 6}" stroke="${INKC}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (d.glasses) h += E.map(([ex, ey]) => `<circle cx="${ex}" cy="${ey}" r="25" fill="#cfe6ff" fill-opacity=".18" stroke="${INKC}" stroke-width="6"/>`).join('') + `<path d="M-11,-4 Q0,-12 11,-4" stroke="${INKC}" stroke-width="5" fill="none"/><path d="M-61,-6 L-94,-14 M61,-6 L94,-14" stroke="${INKC}" stroke-width="5"/>`;
  if (d.view === 'back') h = hBase + (d.hair2 && d.hair2 !== 'bald' && !d.hat ? `<path d="M-100,6 C-104,-70 -56,-108 0,-108 C56,-108 104,-70 100,6 C70,30 -70,30 -100,6Z" fill="${d.hairCol || '#2a1a12'}" stroke="${INKC}" stroke-width="8"/><path d="M-40,-80 Q-10,-96 30,-92" stroke="#fff" stroke-opacity=".2" stroke-width="8" fill="none" stroke-linecap="round"/>` : '');
  else h += HP2.front;
  if (d.hat === 'vueltiao') { // sits ON the head: crown wraps the skull, brim at forehead height; back half of the brim is drawn behind the head
    const cr = '#f3ead2', bk = '#1b1720', hx = TN * 10, BY = -62, z = (y, w, n) => { let p = `M${-w},${y}`; for (let k = 0; k <= n; k++) p += ` L${(-w + k * 2 * w / n).toFixed(1)},${y + (k % 2 ? -7 : 7)}`; return p; };
    hatBack = `<g transform="translate(${hx},${BY})"><path d="M-170,0 A170 34 0 0 1 170,0Z" fill="${mixC(cr, '#000000', .12)}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/></g>`;
    h += `<g transform="translate(${hx},${BY})"><path d="M-170,0 A170 34 0 0 0 170,0 L140,0 A140 26 0 0 1 -140,0Z" fill="${cr}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/><path d="M-152,4 A152 30 0 0 0 152,4" stroke="${bk}" stroke-width="9" fill="none"/><path d="M-120,6 A120 22 0 0 0 120,6" stroke="${bk}" stroke-width="5" stroke-dasharray="10 8" fill="none"/>` +
      `<path d="M-96,4 C-104,-50 -86,-104 0,-110 C86,-104 104,-50 96,4 Q0,24 -96,4Z" fill="${cr}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/>` +
      `<path d="${z(-18, 97, 16)}" stroke="${bk}" stroke-width="6" fill="none" stroke-linejoin="round"/><path d="${z(-52, 92, 16)}" stroke="${bk}" stroke-width="6" fill="none" stroke-linejoin="round"/><path d="M-82,-84 Q0,-100 82,-84" stroke="${bk}" stroke-width="7" fill="none"/>` +
      `<path d="M-60,-96 Q-28,-106 6,-104" stroke="#fff" stroke-width="7" fill="none" opacity=".55" stroke-linecap="round"/><path d="M-96,4 Q0,24 96,4" stroke="#000" stroke-opacity=".18" stroke-width="10" fill="none"/></g>`; }
  if (d.hat === 'peaked') { // officer's peaked cap: white top, black band, gold badge, visor over the brows (sits ON the head)
    hatBack = `<g transform="translate(${TN * 10},-62)"><ellipse cx="0" cy="-30" rx="122" ry="30" fill="${d.capTop ? mixC(d.capTop, '#000000', .12) : '#dcdcd6'}" stroke="${INKC}" stroke-width="8"/></g>`;
    h += `<g transform="translate(${TN * 10},-62)"><path d="M-104,6 L-122,-30 Q0,-58 122,-30 L104,6 Q0,-8 -104,6Z" fill="${d.capTop || '#f4f4f0'}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/><path d="M-102,-2 Q0,-16 102,-2 L104,10 Q0,-4 -104,10Z" fill="#15161c"/>` +
      `<path d="M-96,8 Q0,40 96,8 Q0,24 -96,8Z" fill="#15161c" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/><path d="M-60,16 Q0,28 60,16" stroke="#fff" stroke-opacity=".25" stroke-width="4" fill="none"/>` +
      `<g transform="translate(0,-18)"><ellipse rx="16" ry="12" fill="#e7c24a" stroke="${INKC}" stroke-width="3"/><path d="M-26,4 Q-14,-6 -8,2 M26,4 Q14,-6 8,2" stroke="#e7c24a" stroke-width="5" fill="none"/></g><path d="M-56,-36 Q-10,-48 30,-44" stroke="#fff" stroke-width="6" opacity=".6" fill="none" stroke-linecap="round"/></g>`; }
  if (d.hat === 'bachi') { // French sailor cap: low white crown, navy band, red pompom (sits ON the head)
    h += `<g transform="translate(${TN * 10},-70)"><ellipse cx="0" cy="-16" rx="104" ry="26" fill="#f6f6f2" stroke="${INKC}" stroke-width="8"/><path d="M-92,-8 L-92,12 Q0,32 92,12 L92,-8 Q0,12 -92,-8Z" fill="#1f3a7a" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/>` +
      `<path d="M-40,14 Q0,22 40,14" stroke="#e7c24a" stroke-width="3" fill="none"/><circle cx="0" cy="-36" r="20" fill="#e2302f" stroke="${INKC}" stroke-width="6"/><circle cx="-6" cy="-42" r="6" fill="#ff8a7a"/></g>`; }
  if (d.hat === 'helmet') h += (d.rich ? '' : '') + `<g transform="translate(0,-38)"><path d="M-112,-18 C-118,-118 118,-118 112,-18 Q0,-36 -112,-18Z" fill="url(#${id}cm)" stroke="${INKC}" stroke-width="9" stroke-linejoin="round"/><path d="M-120,-16 Q0,-40 120,-16 L116,-2 Q0,-24 -116,-2Z" fill="#4a5232" stroke="${INKC}" stroke-width="6" stroke-linejoin="round"/><path d="M-60,-98 Q0,-118 60,-98" stroke="#fff" stroke-opacity=".18" stroke-width="8" fill="none"/><path d="M-96,-8 Q-96,70 -60,100 M96,-8 Q96,70 60,100" stroke="#3a3324" stroke-width="6" fill="none"/></g>`;
  if (d.rich && d.hat === 'helmet') h += `<g transform="translate(0,-100)"><rect x="-74" y="-14" width="148" height="28" rx="14" fill="#2c3020" stroke="${INKC}" stroke-width="6"/>${[-1, 1].map(sd => `<ellipse cx="${sd * 36}" cy="0" rx="29" ry="16" fill="#5a8aa8" stroke="${INKC}" stroke-width="5"/><path d="M${sd * 36 - 16},-6 L${sd * 36 - 4},-10" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`).join('')}</g>`;
  if (d.rich && d.hat === 'crown') h += `<g transform="translate(${TN * 10},-74)"><path d="M0,-40 L0,-112 M-13,-96 L13,-96" stroke="${INKC}" stroke-width="15" stroke-linecap="round"/><path d="M0,-40 L0,-112 M-13,-96 L13,-96" stroke="#e7c24a" stroke-width="7" stroke-linecap="round"/></g>`;
  if (d.earrings) h += [-1, 1].map(sd => `<circle cx="${sd * 101}" cy="22" r="9" fill="${d.earrings}" stroke="${INKC}" stroke-width="4"/>`).join('');
  if (d.hat === 'tenugui') { const c1 = d.hatCol || '#2f4f8f', c2 = '#f4f1ea';
    h += `<path d="M-84,-56 Q0,-80 84,-56 L72,-92 Q0,-112 -72,-92Z" fill="${c2}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/>` +
      Array.from({ length: 9 }, (_, k) => `<circle cx="${-60 + k * 15}" cy="${-80 - Math.cos((k - 4) / 5) * 8 + 8}" r="4" fill="${c1}"/>`).join('') +
      `<path d="M-80,-62 Q0,-84 80,-62" stroke="${c1}" stroke-width="4" fill="none"/>` +
      `<g transform="translate(86,-74)"><path d="M0,0 L34,30 L22,40 L-4,8Z M0,0 L40,-12 L38,4 L-2,6Z" fill="${c2}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/><circle r="11" fill="${c2}" stroke="${INKC}" stroke-width="5"/></g>`; }
  if (d.hat === 'toque') h += `<g><path d="M-78,-58 C-120,-90 -110,-170 -60,-168 C-50,-214 50,-214 60,-168 C110,-170 120,-90 78,-58Z" fill="#fbfaf6" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/><path d="M-30,-160 Q-34,-110 -36,-72 M8,-178 Q6,-120 4,-72 M44,-160 Q42,-110 40,-72" stroke="${INKC}" stroke-width="4" fill="none" opacity=".35"/><path d="M-82,-74 Q0,-92 82,-74 L84,-48 Q0,-66 -84,-48Z" fill="#f0eee6" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/></g>`;
  if (d.hat === 'crown') { const G = '#e7c24a', GD = '#b8902a';
    h += `<g transform="translate(${TN * 10},-74)"><path d="M-74,-34 Q0,-70 74,-34 L70,-6 Q0,-30 -70,-6Z" fill="#c8243a" stroke="${INKC}" stroke-width="6"/>` +
      `<path d="M-84,10 L-92,-62 L-56,-30 L-30,-82 L0,-40 L30,-82 L56,-30 L92,-62 L84,10 Q0,-6 -84,10Z" fill="${G}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/>` +
      `<path d="M-84,10 Q0,-6 84,10 L82,-10 Q0,-26 -82,-10Z" fill="${GD}" stroke="${INKC}" stroke-width="5"/>` +
      [[-92, -62], [-30, -82], [30, -82], [92, -62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${G}" stroke="${INKC}" stroke-width="5"/>`).join('') +
      [[-50, 0, '#2f5fbf'], [0, -4, '#c8243a'], [50, 0, '#2fa05a']].map(([x, y, c2]) => `<ellipse cx="${x}" cy="${y}" rx="${x ? 9 : 12}" ry="${x ? 7 : 9}" fill="${c2}" stroke="${INKC}" stroke-width="3.5"/><circle cx="${x - 3}" cy="${y - 2}" r="2.5" fill="#fff" opacity=".8"/>`).join('') +
      `<path d="M-70,-40 L-60,-10 M-20,-60 L-14,-20" stroke="#fff6c8" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>`; }
  if (d.hat === 'kerchief') { const k1 = d.hatCol || '#e46a8a';
    h += `<path d="M-100,-12 C-108,-92 -50,-118 0,-118 C50,-118 108,-92 100,-12 Q74,-48 0,-52 Q-74,-48 -100,-12Z" fill="${k1}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/>` +
      Array.from({ length: 10 }, (_, k) => `<circle cx="${-70 + (k % 5) * 34 + (k > 4 ? 16 : 0)}" cy="${k > 4 ? -64 : -92}" r="5.5" fill="#fff" opacity=".9"/>`).join('') +
      `<path d="M-100,-12 Q-74,-48 0,-52 Q74,-48 100,-12" stroke="${mixC(k1, '#000000', .25)}" stroke-width="6" fill="none"/>` +
      `<g transform="translate(-86,-92) rotate(-30)"><path d="M0,0 Q-30,-26 -34,6 Q-16,12 0,0Z M0,0 Q-14,-36 12,-38 Q16,-18 0,0Z" fill="${k1}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/><circle r="8" fill="${mixC(k1, '#000000', .15)}" stroke="${INKC}" stroke-width="4"/></g>` +
      `<path d="M-44,-104 Q0,-114 40,-108" stroke="#fff" stroke-opacity=".35" stroke-width="7" fill="none" stroke-linecap="round"/>`; }
  // patillas / pelo que asoma por debajo del sombrero (bombín y gorra plana)
  if ((d.hat === 'bowler' || d.hat === 'flatcap') && d.hairCol) h += [-1, 1].map(sd => `<path d="M${sd * 80 + TN * 10},-50 Q${sd * 99 + TN * 10},-26 ${sd * 92 + TN * 10},6 Q${sd * 82 + TN * 10},-8 ${sd * 76 + TN * 10},-44Z" fill="${d.hairCol}" stroke="${INKC}" stroke-width="5" stroke-linejoin="round"/>`).join('');
  if (d.hat === 'bowler') { const hc = d.hatCol || '#25222a', hd = mixC(hc, '#000000', .38), hl = mixC(hc, '#ffffff', .25); // bombín ENCAJADO: la copa tapa la cabeza y el ala se apoya sobre la frente
    h += `<g transform="translate(${TN * 10},0) rotate(${d.hatTilt || 0} 0 -60)"><path d="M-84,-50 C-92,-152 92,-152 84,-50Z" fill="${hc}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/>` +
      `<path d="M-86,-66 Q0,-56 86,-66 L86,-50 Q0,-40 -86,-50Z" fill="${hd}"/><path d="M-46,-100 Q-10,-118 30,-112" stroke="${hl}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>` +
      `<path d="M-130,-44 Q-128,-62 -86,-56 Q0,-44 86,-56 Q128,-62 130,-44 Q106,-24 0,-28 Q-106,-24 -130,-44Z" fill="${hc}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/><path d="M-96,-40 Q0,-30 96,-40" stroke="${hl}" stroke-width="3.5" fill="none" opacity=".5"/></g>`; }
  if (d.hat === 'flatcap') { const hc = d.hatCol || '#6b6458', hd = mixC(hc, '#000000', .32), hl = mixC(hc, '#ffffff', .2); // gorra plana ENCAJADA: la copa cubre la cabeza y la visera baja hasta la frente
    let tw = ''; for (let k = 0; k < 44; k++) { const x = -92 + (k * 41) % 186, y = -112 + (k * 29) % 64; if ((x / 96) ** 2 + ((y + 82) / 34) ** 2 > .8) continue; tw += `<path d="M${x},${y} l7,4 M${x + 4},${y - 3} l5,5" stroke="${hd}" stroke-width="2.6" opacity=".5"/>`; }
    h += `<g transform="translate(${TN * 10},0) rotate(${d.hatTilt || 0} 0 -60)"><path d="M-108,-40 C-114,-86 -66,-122 6,-124 C78,-124 118,-98 116,-60 Q114,-48 108,-38 Q0,-56 -108,-40Z" fill="${hc}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/>${tw}` +
      `<path d="M-26,-121 Q-8,-84 -2,-52" stroke="${hd}" stroke-width="4" fill="none" opacity=".7"/><path d="M-70,-102 Q-24,-120 32,-116" stroke="${hl}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/><circle cx="6" cy="-120" r="8" fill="${hd}" stroke="${INKC}" stroke-width="3"/>` +
      `<path d="M-94,-48 Q0,-68 94,-48 Q76,-28 0,-26 Q-76,-28 -94,-48Z" fill="${hd}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/><path d="M-62,-42 Q0,-54 62,-42" stroke="${hl}" stroke-width="4" fill="none" opacity=".45"/></g>`; }
  if (d.hat === 'beret') h += `<path d="M-96,-36 C-110,-100 40,-130 104,-70 Q110,-50 96,-42 Q0,-58 -96,-36Z" fill="${d.hatCol || '#7a1f2a'}" stroke="${INKC}" stroke-width="8" stroke-linejoin="round"/><circle cx="-50" cy="-58" r="12" fill="#f2c94c" stroke="${INKC}" stroke-width="4"/>`;
  const hs = `transform="scale(${fx.toFixed(3)},${fy.toFixed(3)})"`;
  if (d.hair === 'quiff') { const hc = d.hairCol || '#2a1a12'; h += `<g ${hs}><path d="M-93,-14 C-102,-74 -62,-108 -14,-106 C2,-132 44,-150 84,-128 C70,-122 64,-116 68,-108 C92,-88 100,-50 93,-14 C80,-46 56,-64 22,-68 C-20,-74 -66,-60 -93,-14Z" fill="${hc}" stroke="${INKC}" stroke-width="${LW - 2}" stroke-linejoin="round"/><path d="M-6,-104 C14,-124 46,-132 70,-124" stroke="#fff" stroke-opacity=".25" stroke-width="7" fill="none" stroke-linecap="round"/></g>`; }
  if (d.cap) h += `<g ${hs}><path d="M-96,-26 C-100,-118 100,-118 96,-26 Q0,-44 -96,-26Z" fill="${d.cap}" stroke="${INKC}" stroke-width="${LW - 2}" stroke-linejoin="round"/><path d="M0,-108 Q-6,-70 -4,-36 M-52,-96 Q-60,-62 -58,-32 M52,-96 Q60,-62 58,-32" stroke="${INKC}" stroke-width="3" fill="none" opacity=".35"/><path d="M-95,-28 Q-150,-26 -162,-8 Q-120,-6 -92,-20Z" fill="${d.capD || d.cap}" stroke="${INKC}" stroke-width="7" stroke-linejoin="round"/><path d="M-100,-24 Q-140,-22 -152,-10" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" stroke-dasharray="5 5" fill="none"/><path d="M-60,-96 Q0,-118 60,-96" stroke="#fff" stroke-opacity=".18" stroke-width="7" fill="none"/><ellipse cx="0" cy="-110" rx="12" ry="6" fill="${d.capD || d.cap}" stroke="${INKC}" stroke-width="4"/><circle cx="26" cy="-72" r="17" fill="${d.capLogo || '#ffd34a'}" stroke="${INKC}" stroke-width="4"/><text x="26" y="-66" text-anchor="middle" font-family="Inter" font-weight="900" font-size="16" fill="${INKC}">AR</text></g>`;
  if (d.sweat) h += `<path d="M${rx - 2},-62 q15,23 0,31 q-15,-8 0,-31Z" fill="#8fd0ff" stroke="${INKC}" stroke-width="4"/>`;
  h = h.replace('@@HATBACK@@', hatBack);
  const cape = d.cape ? `<path d="M-56,${SH - 30} Q-120,${(SH + HIP) / 2} -132,${-20 + BOB} Q-60,${6 + BOB} 0,${-6 + BOB} Q60,${6 + BOB} 132,${-20 + BOB} Q120,${(SH + HIP) / 2} 56,${SH - 30}Z" fill="${d.cape}" stroke="${INKC}" stroke-width="${LW}" stroke-linejoin="round"/><path d="M-96,${-60 + BOB} Q-104,${(SH + HIP) / 2} -84,${SH + 20} M96,${-60 + BOB} Q104,${(SH + HIP) / 2} 84,${SH + 20}" stroke="#000" stroke-opacity=".22" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-128,${-24 + BOB} Q-60,${2 + BOB} 0,${-10 + BOB} Q60,${2 + BOB} 128,${-24 + BOB}" stroke="#f6f3ec" stroke-width="16" fill="none"/>` + Array.from({ length: 9 }, (_, k) => `<path d="M${-104 + k * 26},${-14 + BOB - Math.abs(4 - k) * -1} l0,9" stroke="${INKC}" stroke-width="5" stroke-linecap="round"/>`).join('') : '';
  s += `<g transform="rotate(${d.lean})">${cape}${legs}${arms}${body}${d.whistle ? `<path d="M-30,${SH - 24} Q-34,${SH + 30} -14,${SH + 62}" stroke="#d8d4c8" stroke-width="3.5" fill="none"/><g transform="translate(-12,${SH + 68}) rotate(-24)"><rect x="-13" y="-7" width="26" height="14" rx="6" fill="#c9ced6" stroke="${INKC}" stroke-width="3.5"/><circle cx="-13" cy="0" r="8" fill="#c9ced6" stroke="${INKC}" stroke-width="3.5"/><circle cx="-13" cy="0" r="3" fill="${INKC}"/></g>` : ''}<g transform="translate(${sx2},${HC + 8}) rotate(${d.headTilt})">${h}</g></g>`;
  return s;
}
function stickAt(o, F, Hc, W, opt = {}) {
  const pf = W.proj(F), ph = W.proj(Hc); if (!pf.ok || !ph.ok) return '';
  const dx = ph.x - pf.x, dy = ph.y - pf.y, L = Math.hypot(dx, dy), s = L / 462, rot = Math.atan2(dx, -dy) * 180 / Math.PI;
  let out = '';
  if (opt.shadow !== false) { const g0 = new W.T.Vector3(F.x, 0.01, F.z), hgt = Math.max(0, Math.min(F.y, Hc.y)); const sd = new W.T.Vector3(-W.SUN.x, 0, -W.SUN.z).normalize();
    const tip = g0.clone().addScaledVector(sd, (Hc.y - F.y + .35) * 1.4).add(new W.T.Vector3(Hc.x - F.x, 0, Hc.z - F.z)); const a = W.proj(g0), b = W.proj(tip);
    const op = Math.max(0, .42 - hgt * .08);
    if (a.ok && b.ok && op > .01) { const w0 = a.ppm * .22, w1 = b.ppm * .34, ang = Math.atan2(b.y - a.y, b.x - a.x), nx = -Math.sin(ang), ny = Math.cos(ang);
      out += `<g opacity="${op.toFixed(2)}" style="filter:blur(${(3 + hgt * 4).toFixed(1)}px)"><path d="M${a.x + nx * w0},${a.y + ny * w0} L${b.x + nx * w1},${b.y + ny * w1} A${w1},${w1 * .6} 0 0 1 ${b.x - nx * w1},${b.y - ny * w1} L${a.x - nx * w0},${a.y - ny * w0}Z" fill="#141826"/><ellipse cx="${a.x}" cy="${a.y}" rx="${w0 * 1.6}" ry="${w0 * .6}" fill="#141826"/></g>`; } }
  const blur = opt.blur || 0;
  const Lt = opt.light || W.charLight || null; let fl = '';
  if (Lt) { const fid = 'lt' + (++_sid), k = Lt.k ?? .2, rdx = (Lt.rimX ?? -1) * 9, rdy = (Lt.rimY ?? -.5) * 9;
    out += `<defs><filter id="${fid}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feFlood flood-color="${Lt.tint}" result="t"/><feBlend in="SourceGraphic" in2="t" mode="multiply" result="m"/><feComposite in="m" in2="SourceAlpha" operator="in" result="mc"/>` +
      `<feComposite in="SourceGraphic" in2="mc" operator="arithmetic" k1="0" k2="${1 - k}" k3="${k}" k4="0" result="lit"/>` +
      `<feMorphology in="SourceAlpha" operator="erode" radius="14" result="inner"/><feOffset in="inner" dx="${-rdx}" dy="${-rdy}" result="o"/><feComposite in="inner" in2="o" operator="out" result="edge"/><feGaussianBlur in="edge" stdDeviation="4" result="eb"/><feComposite in="eb" in2="inner" operator="in" result="eb2"/><feFlood flood-color="${Lt.rim || '#ffffff'}" flood-opacity="${Lt.rimA ?? .55}"/><feComposite in2="eb2" operator="in" result="rimr"/><feComposite in="rimr" in2="SourceAlpha" operator="in" result="rimc"/>` +
      `<feMerge><feMergeNode in="lit"/><feMergeNode in="rimc"/></feMerge></filter></defs>`; fl = ` filter="url(#${fid})"`; }
  out += `<g transform="translate(${pf.x.toFixed(1)},${pf.y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${s.toFixed(4)})"${blur > .3 ? ` style="filter:blur(${blur.toFixed(1)}px)"` : ''}><g${fl}>${stick(o)}</g></g>`;
  return out;
}

// walkPose(phase, o): fluid walk cycle for front / 3-4 / back views (reference: soft knees, foot lifts high, body bobs and rocks, arms swing with bent elbows).
// phase advances ~2π per two steps; at normal speed phase = t * 7. Returns props to merge into stick(o).
function walkPose(ph, o = {}) { const k = o.amp ?? 1, s1 = Math.sin(ph), l0 = Math.max(0, s1), l1 = Math.max(0, -s1);
  const ease = x => x * x * (3 - 2 * x);
  return { lift: [ease(l0) * k, ease(l1) * k], bob: -Math.abs(Math.cos(ph)) * 0 + (Math.abs(s1) - .5) * -14 * k, lean: s1 * 3 * k + (o.lean || 0),
    armL: [14 + 20 * Math.max(0, -s1) * k, 26 + 24 * Math.max(0, -s1) * k], armR: [14 + 20 * Math.max(0, s1) * k, 26 + 24 * Math.max(0, s1) * k], headTilt: -s1 * 2.5 * k }; }

window.READY = Promise.resolve();
const C72 = window.CAST72;
window.shot = (name, o) => { const fx = document.getElementById('fx'); let s = '';
  if (name === 'reparto') { s += `<rect width="1080" height="1920" fill="#efe6d2"/>`;
    const lab = (x, y, t) => `<text x="${x}" y="${y}" font-family="Inter" font-weight="900" font-size="34" text-anchor="middle" fill="#1b1720">${t}</text>`;
    const put = (n, x, y, sc, ov = {}) => `<g transform="translate(${x},${y}) scale(${sc})">${stick(Object.assign({}, C72[n], ov))}</g>`;
    s += put('REY', 300, 860, 1.25, { prop: 'scepter' }) + lab(300, 990, 'EL REY');
    s += put('BUFON', 780, 860, 1.25, { prop: 'marotte', armR: [40, 60], face: 'happy', mouth: 'laugh' }) + lab(780, 990, 'EL BUFÓN');
    [['NOBLE1', 'NOBLE'], ['NOBLE2', 'NOBLE'], ['NOBLE3', 'CONSEJERO'], ['NOBLE4', 'NOBLE'], ['GUARDIA', 'GUARDIA'], ['MENSAJERO', 'MENSAJERO']].forEach(([n, t], i) => { const x = 110 + i * 172, y = 1640;
      s += put(n, x, y, .66) + `<text x="${x}" y="${y + 78}" font-family="Inter" font-weight="900" font-size="22" text-anchor="middle" fill="#1b1720">${t}</text>`; });
  }

  if (name === 'bufon2') { s += `<rect width="1080" height="1920" fill="#efe6d2"/>`;
    const lab = (x, y, t, fs = 34) => `<text x="${x}" y="${y}" font-family="Inter" font-weight="900" font-size="${fs}" text-anchor="middle" fill="#1b1720">${t}</text>`;
    const put = (base, x, y, sc, ov = {}) => `<g transform="translate(${x},${y}) scale(${sc})">${stick(Object.assign({}, base, ov))}</g>`;
    const OLD = Object.assign({}, C72.BUFON, { jv2: false, top: '#2f8a4a', topD: '#1f6636', top2: '#e8b830', top3: '#c8302e', hat: 'jester', hatCol: '#2f8a4a', hatCol2: '#e8b830', hatCol3: '#c8302e', hose: ['#c8302e', '#2f8a4a'], poulaine: '#e8b830', coif: ['#2f8a4a', '#e8b830'], belly: .92, legLen: 1.14 });
    s += `<g opacity=".55">` + put(OLD, 230, 760, .95, { face: 'happy', mouth: 'laugh' }) + `</g>` + lab(230, 860, 'ANTES', 30) + `<path d="M380,560 L470,560" stroke="#1b1720" stroke-width="10" stroke-linecap="round"/><path d="M455,540 L480,560 L455,580" stroke="#1b1720" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += put(C72.BUFON, 760, 800, 1.3, { prop: 'marotte', armR: [40, 60], face: 'happy', mouth: 'laugh' }) + lab(760, 930, 'BUFÓN NUEVO');
    const P = [[{ face: 'smug', mouth: 'smirk' }, 'pícaro'], [{ face: 'wide', mouth: 'o', sweat: true }, 'asustado'], [{ face: 'happy', mouth: 'open', armL: [118, 14], armR: [118, 14] }, 'gritando'], [{ face: 'closed', mouth: 'smile' }, 'aliviado']];
    P.forEach(([o, t], i) => { const x = 140 + i * 267, y = 1650; s += put(C72.BUFON, x, y, .72, o) + lab(x, y + 84, t, 26); }); }
  if (name === 'caras') { s += `<rect width="1080" height="1920" fill="#efe6d2"/>`;
    const F = [['smug', 'smirk'], ['happy', 'laugh'], ['wide', 'o'], ['angry', 'grin'], ['open', 'line']];
    ['BUFON', 'REY'].forEach((n, r) => F.forEach(([f, m], i) => { const x = 110 + i * 215, y = 520 + r * 760; s += `<g transform="translate(${x},${y}) scale(.6)">${stick(Object.assign({}, C72[n], { face: f, mouth: m, sweat: n === 'BUFON' && f === 'wide' }))}</g>`; }));
  }
  fx.innerHTML = s; };

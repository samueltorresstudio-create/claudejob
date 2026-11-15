  const CAR_CFG = {
    sedan: { L: 4.5, W: 1.78, wx: 1.38, r: .34, top: [[-2.25, .56], [-2.24, .8], [-2.16, .95], [-1.95, 1.0], [-1.36, 1.03], [-.78, 1.42], [.36, 1.46], [1.13, 1.03], [1.6, .96], [2.08, .88], [2.21, .83], [2.27, .7], [2.29, .46]],
      belt: x => 1.0 - x * .012, gh: [-1.36, 1.13], ws: [.36, 1.13], rw: [-1.36, -.78], A: [.98, 1.13], B: [-.24, -.12], C: [-1.36, -1.02], doors: [1.0, -.18, -1.3], hy: .74, ty: .84 },
    kei: { L: 3.4, W: 1.48, wx: 1.1, r: .29, top: [[-1.71, .5], [-1.7, 1.5], [-1.63, 1.64], [.8, 1.67], [1.42, 1.14], [1.6, 1.0], [1.68, .94], [1.73, .8], [1.74, .48]],
      belt: x => 1.03, gh: [-1.63, 1.42], ws: [.8, 1.42], rw: [-1.71, -1.63], A: [1.28, 1.42], B: [-.12, 0], C: [-1.63, -1.36], doors: [1.08, .02, -.9], hy: .84, ty: 1.02 } };
  const TOONG = (() => { const c = document.createElement('canvas'); c.width = 4; c.height = 1; const g = c.getContext('2d'); ['#6a6a6a', '#a8a8a8', '#e6e6e6', '#ffffff'].forEach((col, i) => { g.fillStyle = col; g.fillRect(i, 0, 1, 1); }); const t = new T.CanvasTexture(c); t.minFilter = t.magFilter = T.NearestFilter; t.generateMipmaps = false; return t; })();
  const TOON = (o) => new T.MeshToonMaterial(Object.assign({ gradientMap: TOONG, side: T.DoubleSide }, o));
  function car3d(o = {}) { const type = o.type || 'sedan', col = o.color || '#d2283a', C = CAR_CFG[type], g = new T.Group(), L2 = C.L / 2, W2 = C.W / 2;
    const topAt = x => { const P = C.top; if (x <= P[0][0]) return P[0][1]; for (let i = 0; i < P.length - 1; i++) if (x <= P[i + 1][0]) return P[i][1] + (P[i + 1][1] - P[i][1]) * (x - P[i][0]) / (P[i + 1][0] - P[i][0]); return P[P.length - 1][1]; };
    const botAt = x => { let y = .28 + Math.max(0, (Math.abs(x) - (L2 - .3)) / .3) * .08; [-C.wx, C.wx].forEach(wx => { const d = Math.abs(x - wx), R0 = C.r + .08; if (d < R0) y = Math.max(y, C.r + Math.sqrt(R0 * R0 - d * d)); }); return y; };
    // secciones
    const xs = new Set(); for (let i = 0; i <= 120; i++) xs.add(+(-L2 + C.L * i / 120).toFixed(4)); C.top.forEach(p => xs.add(p[0])); [-C.wx, C.wx].forEach(wx => [-1, 1].forEach(s => xs.add(+(wx + s * (C.r + .079)).toFixed(4))));
    const X = [...xs].filter(x => x >= -L2 && x <= L2).sort((a, b) => a - b), NR = 10;
    const ring = x => { const yT = topAt(x), yB = Math.min(botAt(x), yT - .05), belt = C.belt(x), gh = x > C.gh[0] && x < C.gh[1] && yT > belt + .04; const rows = [];
      const body = [[yB, .93], [yB + .04, .97], [Math.max(yB + .06, .5), 1], [.66, 1], [.69, .995], [belt - .02, .985]]; body.forEach(([y, k]) => rows.push([Math.min(Math.max(y, yB), gh ? belt : yT), k]));
      if (gh) { rows[5][0] = belt - .02; rows.push([belt + .01, .955], [lerp(belt, yT, .5), .865], [yT - .03, .77], [yT, .68]); }
      else { const yt = Math.min(yT, rows[5][0]); rows[5] = [yT - .05, .97]; rows.push([yT - .015, .9], [yT, .8], [yT + .008, .6], [yT + .012, .35]); }
      for (let i = 1; i < rows.length; i++) rows[i][0] = Math.max(rows[i][0], rows[i - 1][0] + .0005);
      return { rows, yT, gh, cy: yT + (gh ? .02 : .014) }; };
    const pos = [], uv = [], R_ = X.map(ring), NP = NR * 2 + 1;
    R_.forEach((r, i) => { const x = X[i], pts = []; for (let j = 0; j < NR; j++) pts.push([r.rows[j][0], -W2 * r.rows[j][1]]); pts.push([r.cy, 0]); for (let j = NR - 1; j >= 0; j--) pts.push([r.rows[j][0], W2 * r.rows[j][1]]);
      pts.forEach(([y, z]) => { pos.push(x, y, z); uv.push((x + L2) / C.L, y / 1.8); }); });
    const groups = { paint: [], glass: [], trim: [], black: [] }, idx = (i, j) => i * NP + j;
    const inR = (x, r) => x >= r[0] && x <= r[1];
    for (let i = 0; i < X.length - 1; i++) { const xm = (X[i] + X[i + 1]) / 2, gh = R_[i].gh && R_[i + 1].gh;
      for (let j = 0; j < NP - 1; j++) { const side = Math.min(j, NP - 2 - j), q = [idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j), idx(i + 1, j + 1), idx(i, j + 1)];
        let m = 'paint';
        if (gh) { if (side === 5) m = 'trim'; else if (side >= 6 && side <= 8) m = inR(xm, C.A) || inR(xm, C.B) ? 'black' : inR(xm, C.C) ? 'paint' : 'glass'; else if (side === 9) m = inR(xm, C.ws) || inR(xm, C.rw) ? 'glass' : 'paint'; }
        if (j >= NP - 1 - 0) continue; (groups[m]).push(...(j < NR ? q : q)); } }
    // tapas delantera y trasera (abanico al centro)
    [[0, 1], [X.length - 1, -1]].forEach(([i, dir]) => { const c0 = pos.length / 3; let cy = 0; for (let j = 0; j < NP; j++) cy += pos[(idx(i, j)) * 3 + 1]; pos.push(X[i], cy / NP, 0); uv.push((X[i] + L2) / C.L, cy / NP / 1.8);
      for (let j = 0; j < NP - 1; j++) groups.paint.push(...(dir > 0 ? [c0, idx(i, j + 1), idx(i, j)] : [c0, idx(i, j), idx(i, j + 1)])); groups.paint.push(...(dir > 0 ? [c0, idx(i, 0), idx(i, NP - 1)] : [c0, idx(i, NP - 1), idx(i, 0)])); });
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    const all = []; const ORDER = ['paint', 'glass', 'trim', 'black']; ORDER.forEach((k, mi) => { geo.addGroup(all.length, groups[k].length, mi); all.push(...groups[k]); }); geo.setIndex(all); geo.computeVertexNormals();
    // pintura con juntas de puertas y degradado
    const paintT = tex(2048, 512, (c, w, h) => { const Xp = x => (x + L2) / C.L * w, Yp = y => h - y / 1.8 * h; const gr = c.createLinearGradient(0, Yp(1.5), 0, Yp(.25)); gr.addColorStop(0, col); gr.addColorStop(1, col); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(0, Yp(C.belt(0) - .06), w, 10);
      c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(0, Yp(.42), w, Yp(.28) - Yp(.42)); c.strokeStyle = '#1b1720'; c.lineWidth = 6;
      C.doors.forEach(x => { c.beginPath(); c.moveTo(Xp(x), Yp(C.belt(x) - .01)); c.lineTo(Xp(x - .03), Yp(.4)); c.stroke(); }); c.beginPath(); c.moveTo(Xp(C.doors[0]), Yp(.4)); c.lineTo(Xp(C.doors[2]), Yp(.4)); c.stroke();
      c.beginPath(); c.moveTo(Xp(C.gh[1] + .05), Yp(C.belt(0) - .01)); c.lineTo(Xp(L2 - .35), Yp(topAt(L2 - .35) - .02)); c.stroke();          // junta del capó
      c.fillStyle = 'rgba(16,14,20,.45)'; c.beginPath(); c.arc(Xp(-L2 + .6), Yp(.86), 9, 0, 7); c.fill(); });
    paintT.wrapS = paintT.wrapT = T.ClampToEdgeWrapping;
    const paint = TOON({ color: '#ffffff', map: paintT });
    const glassT = tex(1024, 256, (c, w, h) => { c.fillStyle = '#34507a'; c.fillRect(0, 0, w, h); c.fillStyle = '#4f6f9c'; c.fillRect(0, 0, w, h * .4); c.fillStyle = 'rgba(255,255,255,.8)'; [[.36, 46], [.41, 14], [.64, 40]].forEach(([u, ww]) => { const x = u * w; c.beginPath(); c.moveTo(x, h); c.lineTo(x + 50, 0); c.lineTo(x + 50 + ww, 0); c.lineTo(x + ww, h); c.fill(); }); }); const glass = TOON({ color: '#ffffff', map: glassT, emissive: '#1a2a40', emissiveIntensity: .25 });
    const trim = TOON({ color: '#e8ecf0' }), black = TOON({ color: '#2a2c34' });
    add(geo, [paint, glass, trim, black], 0, 0, 0, { parent: g });
    // bajos y pasos de rueda oscuros
    add(RB(C.L - .5, .05, C.W * .9, .02), black, 0, .3, 0, { parent: g, noInk: true });
    [-C.wx, C.wx].forEach(wx => add(new T.CylinderGeometry(C.r + .075, C.r + .075, C.W * .9, 24, 1, true, Math.PI / 2, Math.PI), new T.MeshStandardMaterial({ color: '#0e0f12', roughness: 1, side: T.DoubleSide }), wx, C.r, 0, { parent: g, rx: Math.PI / 2, rz: Math.PI, noInk: true }));
    // ruedas: neumático torneado + llanta de 10 radios con disco y pinza roja
    const tireProf = [[.62, -.11], [.86, -.115], [.97, -.09], [1, -.04], [1, .04], [.97, .09], [.86, .115], [.62, .11]].map(([r, y]) => new T.Vector2(r * C.r, y * .9));
    const tireGeo = new T.LatheGeometry(tireProf, 36); const tireM = TOON({ color: '#2e2e36' }), rimM = TOON({ color: '#dfe3e8' });
    const WHEELS = []; [[C.wx, 1], [-C.wx, 1], [C.wx, -1], [-C.wx, -1]].forEach(([x, sd]) => { const w = new T.Group(); w.position.set(x, C.r, sd * (W2 - .13)); g.add(w);
      add(tireGeo, tireM, 0, 0, 0, { parent: w, rx: Math.PI / 2 });
      const face = new T.Group(); face.position.z = sd * .06; face.scale.z = sd; w.add(face);
      add(new T.CylinderGeometry(C.r * .64, C.r * .64, .03, 32, 1, true), rimM, 0, 0, 0, { parent: face, rx: Math.PI / 2, noInk: true });
      add(new T.CylinderGeometry(C.r * .6, C.r * .6, .01, 28), STD({ color: '#2a2c30', roughness: .6 }), 0, 0, -.03, { parent: face, rx: Math.PI / 2, noInk: true });
      add(new T.CylinderGeometry(C.r * .42, C.r * .42, .015, 24), STD({ color: '#8a8e94', metalness: .6, roughness: .5 }), 0, 0, -.02, { parent: face, rx: Math.PI / 2, noInk: true });
      add(RB(.06, C.r * .3, .05, .015), STD({ color: '#d2283a', roughness: .4 }), C.r * .2, C.r * .3, -.012, { parent: face, noInk: true });
      for (let k = 0; k < 10; k++) { const s_ = add(RB(C.r * .52, .028, .02, .008), rimM, 0, 0, .006, { parent: face, noInk: true }); s_.geometry.translate(C.r * .3, 0, 0); s_.rotation.z = k / 10 * Math.PI * 2 + (k % 2) * .12; }
      add(new T.CylinderGeometry(C.r * .13, C.r * .13, .04, 18), rimM, 0, 0, .014, { parent: face, rx: Math.PI / 2, noInk: true }); for (let k = 0; k < 5; k++) add(new T.SphereGeometry(.009, 6, 4), STD({ color: '#3a3e46' }), Math.cos(k * 1.257) * C.r * .08, Math.sin(k * 1.257) * C.r * .08, .036, { parent: face, noInk: true });
      WHEELS.push(w); });
    // frontal: faros con reflector y lente, tira LED, parrilla de panal, entradas inferiores y antinieblas
    const nose = (y) => { let x = L2; while (x > 0 && topAt(x) < y) x -= .005; return x; }, fxH = nose(C.hy), fxG = nose(C.hy - .16), honey = tex(256, 128, (c, w, h) => { c.fillStyle = '#121317'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3a3d44'; c.lineWidth = 3; for (let y = 0; y < h + 16; y += 16) for (let x = 0; x < w + 18; x += 18) { c.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; c.lineTo(x + (y / 16 % 2) * 9 + Math.cos(a) * 7, y + Math.sin(a) * 7); } c.closePath(); c.stroke(); } });
    const lensM = TOON({ color: '#fff8dc', emissive: '#fff2c0', emissiveIntensity: .6 });
    [-1, 1].forEach(sd => { const hz = sd * W2 * .6, hg = new T.Group(); hg.position.set(nose(C.hy) - .01, C.hy, hz); hg.rotation.y = -sd * .18; g.add(hg);
      add(RB(.12, .15, .42, .05), black, -.02, 0, 0, { parent: hg }); add(new T.SphereGeometry(.055, 16, 10, 0, Math.PI), trim, .02, 0, -sd * .1, { parent: hg, ry: Math.PI / 2, noInk: true }); add(new T.SphereGeometry(.045, 16, 10, 0, Math.PI), trim, .02, 0, sd * .06, { parent: hg, ry: Math.PI / 2, noInk: true });
      add(RB(.02, .025, .36, .01), STD({ color: '#ffffff', emissive: '#e8f4ff', emissiveIntensity: 2.2 }), .05, -.055, 0, { parent: hg, noInk: true }); add(RB(.04, .14, .4, .05), lensM, .05, 0, 0, { parent: hg, noInk: true, cast: false });
      add(new T.CylinderGeometry(.04, .04, .03, 16), trim, nose(.45) + .03, .45, sd * W2 * .66, { parent: g, rz: Math.PI / 2, noInk: true }); add(new T.CylinderGeometry(.032, .032, .035, 16), STD({ color: '#fff8e0', emissive: '#fff0c0', emissiveIntensity: .8 }), nose(.45) + .04, .45, sd * W2 * .66, { parent: g, rz: Math.PI / 2, noInk: true }); });
    add(RB(.05, .2, C.W * .5, .03), new T.MeshStandardMaterial({ map: honey, roughness: .5 }), fxG + .015, C.hy - .14, 0, { parent: g }); add(RB(.03, .025, C.W * .52, .01), trim, fxG + .04, C.hy - .03, 0, { parent: g, noInk: true });
    add(RB(.05, .12, C.W * .62, .03), new T.MeshStandardMaterial({ map: honey, roughness: .5 }), nose(.4) + .01, .4, 0, { parent: g, noInk: true });
    // trasera: pilotos envolventes con franja cromada, escape, luz de matrícula
    const rX = y => { let x = -L2; while (x < 0 && topAt(x) < y) x += .005; return x; }, tlx = rX(C.ty + .05), tailM = TOON({ color: '#e0283a', emissive: '#b01020', emissiveIntensity: .5 });
    [-1, 1].forEach(sd => { const tg_ = new T.Group(); tg_.position.set(tlx + .02, C.ty, sd * W2 * .7); tg_.rotation.y = sd * .3; g.add(tg_); add(RB(.08, .14, .46, .04), tailM, 0, 0, 0, { parent: tg_ }); add(RB(.09, .03, .4, .01), STD({ color: '#ffffff', emissive: '#ffe8e0', emissiveIntensity: .6 }), 0, -.03, 0, { parent: tg_, noInk: true }); });
    add(RB(.03, .04, C.W * .5, .01), trim, tlx - .01, C.ty, 0, { parent: g, noInk: true });
    add(new T.CylinderGeometry(.04, .045, .16, 14), trim, -L2 + .02, .3, -W2 * .55, { parent: g, rz: Math.PI / 2 });
    // tiradores, retrovisores con brazo, antena
    [-1, 1].forEach(sd => { const zz = sd * (W2 * .975 + .012); C.doors.slice(0, 2).forEach(x => add(RB(.15, .035, .025, .012), trim, x - .42, C.belt(x) - .12, zz, { parent: g, noInk: true }));
      const mx = C.A[0] - .05, my = C.belt(mx) + .06, mz = sd * (W2 * .95); add(RB(.12, .03, .14, .01), black, mx, my - .02, mz + sd * .06, { parent: g, noInk: true });
      const mh = add(RB(.16, .12, .22, .05), TOON({ color: col }), mx - .02, my + .04, mz + sd * .17, { parent: g }); mh.rotation.y = sd * .15;
      add(RB(.01, .09, .18, .03), TOON({ color: '#a8c8e8' }), mx - .1, my + .04, mz + sd * .17, { parent: g, noInk: true }); });
    if (type === 'kei') add(new T.PlaneGeometry(C.W * .72, .42), glass, -L2 - .006, 1.28, 0, { parent: g, ry: -Math.PI / 2, cast: false, noInk: true });
    if (type === 'sedan') add(new T.CylinderGeometry(.006, .012, .4, 6), black, -1.0, topAt(-1.0) + .18, -.35, { parent: g, rz: .4, noInk: true });
    // matrículas japonesas (blancas con letras verdes)
    const plateT = tex(512, 112, (c, w, h) => { c.fillStyle = '#f6f6f0'; c.fillRect(0, 0, w, h); c.fillStyle = '#1f4fbf'; c.fillRect(0, 0, 64, h); c.fillStyle = '#ffd34a'; for (let k = 0; k < 8; k++) { c.beginPath(); c.arc(32 + Math.cos(k * .785) * 18, 38 + Math.sin(k * .785) * 18, 3, 0, 7); c.fill(); } c.fillStyle = '#fff'; c.font = '900 30px Inter, sans-serif'; c.textAlign = 'center'; c.fillText('E', 32, 98); c.strokeStyle = '#1b1720'; c.lineWidth = 6; c.strokeRect(3, 3, w - 6, h - 6); c.fillStyle = '#1b1720'; c.font = '900 72px Inter, sans-serif'; c.fillText(o.num || '7070 KRB', w / 2 + 30, 82); });
    const plM = STD({ map: plateT, roughness: .6 }); add(new T.PlaneGeometry(.52, .115), plM, nose(.36) + .07, .36, 0, { parent: g, ry: Math.PI / 2, cast: false, noInk: true }); add(new T.PlaneGeometry(.52, .115), plM, rX(.5) - .02, .5, 0, { parent: g, ry: -Math.PI / 2, cast: false, noInk: true });
    // sombra de contacto
    const shT = tex(128, 128, (c, w, h) => { const gr = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(0,0,0,.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    add(new T.PlaneGeometry(C.L + .6, C.W + .6), new T.MeshBasicMaterial({ map: shT, transparent: true, depthWrite: false }), 0, .015, 0, { parent: g, rx: -Math.PI / 2, cast: false, noInk: true });
    g.userData.wheels = WHEELS; return g; }

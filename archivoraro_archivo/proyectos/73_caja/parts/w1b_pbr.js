
  // =====================================================================================================
  // MATERIALES «DE VERDAD» (72): cada textura se pinta dos veces — color y relieve (bumpMap) — para que la luz marque juntas, vetas y piedras.
  // Además: mapa de entorno (reflejos en oro, mármol y suelos mojados) y oclusión ambiental (GTAO, en w5_api).
  // =====================================================================================================
  const texHB = (w, h, draw, blurH = 2) => { const c = document.createElement('canvas'), d = document.createElement('canvas'); c.width = d.width = w; c.height = d.height = h;
    const g = c.getContext('2d'), H = d.getContext('2d'); H.fillStyle = '#808080'; H.fillRect(0, 0, w, h); draw(g, H, w, h);
    if (blurH) { const e = document.createElement('canvas'); e.width = w; e.height = h; const E = e.getContext('2d'); E.filter = `blur(${blurH}px)`; E.drawImage(d, 0, 0); H.clearRect(0, 0, w, h); H.drawImage(e, 0, 0); }
    const mk = (cv, srgb) => { const t = new T.CanvasTexture(cv); if (srgb) t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; return t; };
    return { map: mk(c, true), bump: mk(d, false) }; };
  const PBR = (tx, o = {}) => { const { bump = 1.2, ...rest } = o; return STD(Object.assign({ map: tx.map, bumpMap: tx.bump, bumpScale: bump, roughness: .9 }, rest)); };
  const gray = v => `rgb(${v | 0},${v | 0},${v | 0})`;
  const vary = (hex, dh, ds, dl) => '#' + new T.Color(hex).offsetHSL((rnd() - .5) * dh, (rnd() - .5) * ds, (rnd() - .5) * dl).getHexString();
  const speck = (g, w, h, n, cols, r0 = .5, r1 = 2) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; g.beginPath(); g.arc(rnd() * w, rnd() * h, r0 + rnd() * (r1 - r0), 0, 7); g.fill(); } };
  const crack = (g, H, x, y, len, col) => { g.strokeStyle = col; H.strokeStyle = gray(40); g.lineWidth = 1.4; H.lineWidth = 2; g.beginPath(); H.beginPath(); g.moveTo(x, y); H.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x += (rnd() - .3) * len / 4; y += (rnd() - .5) * len / 4; g.lineTo(x, y); H.lineTo(x, y); } g.stroke(); H.stroke(); };
  // sillería: hiladas de bloques de anchos distintos, juntas hundidas, aristas biseladas, manchas y grietas
  const ashlar = (base, mortar, rows = 6, sz = 1024, o = {}) => texHB(sz, sz, (g, H, w, h) => { g.fillStyle = mortar; g.fillRect(0, 0, w, h); H.fillStyle = gray(30); H.fillRect(0, 0, w, h); const bh = h / rows, j = Math.max(3, sz / 170);
    for (let r = 0; r < rows; r++) { let x = -rnd() * 120; while (x < w) { const bw = bh * (1.1 + rnd() * 1.3), y = r * bh, col = vary(base, .02, .08, .16);
      const gr = g.createLinearGradient(x, y, x + bw, y + bh); gr.addColorStop(0, new T.Color(col).offsetHSL(0, 0, .05).getStyle()); gr.addColorStop(1, new T.Color(col).offsetHSL(0, 0, -.06).getStyle());
      g.fillStyle = gr; g.fillRect(x + j, y + j, bw - 2 * j, bh - 2 * j); H.fillStyle = gray(150 + rnd() * 50); H.fillRect(x + j, y + j, bw - 2 * j, bh - 2 * j);
      g.fillStyle = 'rgba(255,255,255,.10)'; g.fillRect(x + j, y + j, bw - 2 * j, j); g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x + j, y + bh - 2 * j, bw - 2 * j, j);
      if (rnd() < .3) { g.fillStyle = 'rgba(0,0,0,.25)'; H.fillStyle = gray(60); const cx = x + (rnd() < .5 ? j : bw - j * 3), cy = y + (rnd() < .5 ? j : bh - j * 3); g.fillRect(cx, cy, j * 2, j * 2); H.fillRect(cx, cy, j * 2, j * 2); }
      x += bw; } }
    speck(g, w, h, sz * 14, ['rgba(0,0,0,.07)', 'rgba(255,255,255,.06)', 'rgba(90,70,50,.08)'], .5, 2.2); speck(H, w, h, sz * 10, [gray(100), gray(190)], .5, 2);
    blot(g, w, h, 18, o.stain || 'rgba(70,55,35,.14)', sz * .04, sz * .16); for (let i = 0; i < 10; i++) crack(g, H, rnd() * w, rnd() * h, sz * .08, 'rgba(30,25,20,.45)');
    if (o.grime) { const gr = g.createLinearGradient(0, h, 0, h * .55); gr.addColorStop(0, 'rgba(40,30,20,.35)'); gr.addColorStop(1, 'rgba(40,30,20,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); } }, 1.5);
  // mármol pulido en damero con vetas
  const marblePBR = (a, b, n = 4, sz = 1024) => texHB(sz, sz, (g, H, w, h) => { const s = w / n;
    for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) { const dark = (i + k) % 2, base = dark ? b : a, x = i * s, y = k * s;
      const gr = g.createRadialGradient(x + s * rnd(), y + s * rnd(), 0, x + s / 2, y + s / 2, s); gr.addColorStop(0, new T.Color(base).offsetHSL(0, 0, .04).getStyle()); gr.addColorStop(1, new T.Color(base).offsetHSL(0, .02, -.05).getStyle());
      g.fillStyle = gr; g.fillRect(x, y, s, s); H.fillStyle = gray(200); H.fillRect(x + 3, y + 3, s - 6, s - 6);
      g.save(); g.beginPath(); g.rect(x, y, s, s); g.clip();
      for (let v = 0; v < 7; v++) { g.strokeStyle = dark ? `rgba(255,225,205,${.12 + rnd() * .2})` : `rgba(110,85,70,${.10 + rnd() * .18})`; g.lineWidth = .6 + rnd() * 2.4; g.beginPath(); let px = x + rnd() * s, py = y - 10; g.moveTo(px, py);
        while (py < y + s + 10) { px += (rnd() - .5) * s * .22; py += s * (.06 + rnd() * .08); g.lineTo(px, py); } g.stroke(); }
      g.restore(); }
    g.strokeStyle = 'rgba(40,30,25,.55)'; g.lineWidth = 3; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, h); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); }
    speck(g, w, h, 5000, ['rgba(0,0,0,.05)', 'rgba(255,255,255,.07)'], .4, 1.5); blot(g, w, h, 10, 'rgba(60,40,30,.08)', 40, 140); }, 1);
  // tablones con veta, nudos y juntas
  const planksPBR = (base, n = 6, sz = 1024, o = {}) => texHB(sz, sz, (g, H, w, h) => { const pw = w / n;
    for (let i = 0; i < n; i++) { const x = i * pw, col = vary(base, .02, .06, .12); g.fillStyle = col; g.fillRect(x, 0, pw, h); H.fillStyle = gray(170 + rnd() * 30); H.fillRect(x + 2, 0, pw - 4, h);
      for (let k = 0; k < 26; k++) { const gx = x + rnd() * pw; g.strokeStyle = `rgba(35,18,8,${.08 + rnd() * .2})`; g.lineWidth = .6 + rnd() * 1.6; H.strokeStyle = gray(130); H.lineWidth = 1;
        g.beginPath(); H.beginPath(); g.moveTo(gx, 0); H.moveTo(gx, 0); for (let y = 0; y <= h; y += h / 8) { const xx = gx + Math.sin(y * .01 + k) * pw * .06; g.lineTo(xx, y); H.lineTo(xx, y); } g.stroke(); H.stroke(); }
      for (let q = 0; q < 2; q++) { const kx = x + pw * (.25 + rnd() * .5), ky = rnd() * h; g.fillStyle = 'rgba(50,25,10,.55)'; g.beginPath(); g.ellipse(kx, ky, pw * .07, pw * .12, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(50,25,10,.3)'; g.lineWidth = 2; g.beginPath(); g.ellipse(kx, ky, pw * .12, pw * .2, 0, 0, 7); g.stroke(); }
      const jy = rnd() * h; g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(x, jy, pw, 3); H.fillStyle = gray(40); H.fillRect(x, jy, pw, 4);
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x, 0, 3, h); H.fillStyle = gray(30); H.fillRect(x, 0, 4, h);
      if (o.nails) [[.5, jy - 8], [.5, jy + 10]].forEach(([a, yy]) => { g.fillStyle = '#2a2420'; g.beginPath(); g.arc(x + pw * a, yy, 3, 0, 7); g.fill(); }); }
    blot(g, w, h, 12, 'rgba(20,10,5,.12)', 40, 160); speck(g, w, h, 6000, ['rgba(0,0,0,.06)', 'rgba(255,230,200,.04)'], .4, 1.5); }, 1);
  // adoquines redondeados (mojados si roughness baja)
  const cobblePBR = (base, sz = 1024) => texHB(sz, sz, (g, H, w, h) => { g.fillStyle = '#2a2622'; g.fillRect(0, 0, w, h); H.fillStyle = gray(20); H.fillRect(0, 0, w, h); const s = sz / 14;
    for (let r = 0; r < 15; r++) for (let i = -1; i < 15; i++) { const cx = i * s + (r % 2) * s / 2 + (rnd() - .5) * s * .2, cy = r * s + (rnd() - .5) * s * .15, rx = s * (.42 + rnd() * .06), ry = s * (.38 + rnd() * .06), col = vary(base, .03, .08, .18);
      const gr = g.createRadialGradient(cx - rx * .3, cy - ry * .3, 1, cx, cy, rx); gr.addColorStop(0, new T.Color(col).offsetHSL(0, 0, .08).getStyle()); gr.addColorStop(1, new T.Color(col).offsetHSL(0, 0, -.1).getStyle());
      g.fillStyle = gr; g.beginPath(); g.ellipse(cx, cy, rx, ry, rnd() * .5, 0, 7); g.fill();
      const hg = H.createRadialGradient(cx, cy, 1, cx, cy, rx); hg.addColorStop(0, gray(235)); hg.addColorStop(.7, gray(170)); hg.addColorStop(1, gray(40)); H.fillStyle = hg; H.beginPath(); H.ellipse(cx, cy, rx, ry, 0, 0, 7); H.fill(); }
    speck(g, w, h, 9000, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.05)'], .5, 2); blot(g, w, h, 14, 'rgba(40,60,30,.16)', 20, 70); }, 1);
  // revoco con manchas y desconchones
  const plasterPBR = (base, sz = 1024, dirt = .5) => texHB(sz, sz, (g, H, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); blot(g, w, h, 40, 'rgba(255,255,255,.05)', 30, 120); blot(g, w, h, 30, `rgba(90,70,50,${.08 * (1 + dirt)})`, 30, 160);
    speck(g, w, h, 20000, ['rgba(0,0,0,.05)', 'rgba(255,255,255,.06)'], .4, 1.8); speck(H, w, h, 16000, [gray(90), gray(170)], .6, 2.4);
    for (let i = 0; i < 8; i++) { const x = rnd() * w, y = rnd() * h, r = 10 + rnd() * 40; g.fillStyle = 'rgba(120,90,70,.35)'; g.beginPath(); g.ellipse(x, y, r, r * .6, rnd() * 3, 0, 7); g.fill(); H.fillStyle = gray(70); H.beginPath(); H.ellipse(x, y, r, r * .6, 0, 0, 7); H.fill(); }
    const gr = g.createLinearGradient(0, h, 0, h * .6); gr.addColorStop(0, `rgba(60,45,30,${.4 * dirt})`); gr.addColorStop(1, 'rgba(60,45,30,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }, 1.2);
  // tejas curvas en hileras
  const roofPBR = (base, sz = 512) => texHB(sz, sz, (g, H, w, h) => { const rows = 8, rh = h / rows, tw = w / 8;
    for (let r = 0; r < rows; r++) for (let i = -1; i < 9; i++) { const x = i * tw + (r % 2) * tw / 2, y = r * rh, col = vary(base, .02, .1, .14);
      const gr = g.createLinearGradient(x, 0, x + tw, 0); gr.addColorStop(0, new T.Color(col).offsetHSL(0, 0, -.08).getStyle()); gr.addColorStop(.5, new T.Color(col).offsetHSL(0, 0, .06).getStyle()); gr.addColorStop(1, new T.Color(col).offsetHSL(0, 0, -.1).getStyle());
      g.fillStyle = gr; g.beginPath(); g.moveTo(x, y); g.lineTo(x + tw, y); g.lineTo(x + tw, y + rh * .9); g.quadraticCurveTo(x + tw / 2, y + rh * 1.15, x, y + rh * .9); g.closePath(); g.fill();
      const hg = H.createLinearGradient(0, y, 0, y + rh); hg.addColorStop(0, gray(80)); hg.addColorStop(1, gray(220)); H.fillStyle = hg; H.fillRect(x + 1, y, tw - 2, rh); }
    speck(g, w, h, 4000, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.05)'], .5, 1.6); blot(g, w, h, 10, 'rgba(50,60,30,.18)', 15, 50); }, 1);
  // tejido (alfombras, tapices, velas): solo trama en el relieve
  const weave = (H, w, h, step = 4) => { for (let y = 0; y < h; y += step) { H.fillStyle = gray(y / step % 2 ? 150 : 110); H.fillRect(0, y, w, step / 2); } for (let x = 0; x < w; x += step) { H.fillStyle = 'rgba(255,255,255,.12)'; H.fillRect(x, 0, step / 2, h); } };
  const fabricPBR = (draw, w = 512, h = 512) => texHB(w, h, (g, H, ww, hh) => { draw(g, ww, hh); weave(H, ww, hh, 4); speck(g, ww, hh, ww * 8, ['rgba(0,0,0,.06)', 'rgba(255,255,255,.04)'], .4, 1.2); }, .6);

  // ---------- mapa de entorno: una «sala» suave con ventanas claras (da reflejos y luz rebotada) ----------
  const ENV = (() => { const es = new T.Scene(); const sg = new T.SphereGeometry(50, 32, 16), cols = []; const pos = sg.attributes.position;
    for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 50; const c = y > 0 ? new T.Color('#c8bca8').lerp(new T.Color('#e8e4dc'), y) : new T.Color('#c8bca8').lerp(new T.Color('#4a3a2e'), -y); cols.push(c.r, c.g, c.b); }
    sg.setAttribute('color', new T.Float32BufferAttribute(cols, 3)); es.add(new T.Mesh(sg, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide })));
    const lm = new T.MeshBasicMaterial({ color: new T.Color('#fff4e0').multiplyScalar(4) }); [[-30, 18, -10, Math.PI / 2], [-30, 18, 12, Math.PI / 2], [30, 22, 0, -Math.PI / 2], [0, 40, 0, 0]].forEach(([x, y, z, ry], k) => { const m = new T.Mesh(new T.PlaneGeometry(k === 3 ? 30 : 10, k === 3 ? 30 : 16), lm); m.position.set(x, y, z); if (k === 3) m.rotation.x = Math.PI / 2; else m.rotation.y = ry; es.add(m); });
    const pm = new T.PMREMGenerator(R); const t = pm.fromScene(es, .03).texture; pm.dispose(); return t; })();
  scene.environment = ENV;


  // =====================================================================================================
  // SALA DEL TRONO (corte de Francia, 1340): x ∈ [-7, 7], z ∈ [-16, 12], 11 m de alto. Trono al fondo (z = -14.2) sobre una tarima de 3 escalones,
  // alfombra azul con lises desde el portón (z = 12) hasta la tarima, columnas con estandartes, vidrieras con haces de luz a la izquierda, tapiz de lises y rosetón.
  // =====================================================================================================
  const HX0 = -7, HX1 = 7, HZ0 = -16, HZ1 = 12, HH = 11;
  const inHall = p => p.x > HX0 - 2 && p.x < HX1 + 2 && p.z > HZ0 - 2 && p.z < HZ1 + 8 && p.y < HH + 1;
  const goldT = tex(256, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#f6d46a'); gr.addColorStop(.5, '#d8a63a'); gr.addColorStop(1, '#b8862a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(${rnd() > .5 ? '255,240,190' : '120,80,20'},${.15 + rnd() * .2})`; g.lineWidth = 1 + rnd() * 3; g.beginPath(); const x = rnd() * w, y = rnd() * h; g.moveTo(x, y); g.lineTo(x + (rnd() - .5) * 60, y + (rnd() - .5) * 60); g.stroke(); } noise(g, w, h, 3000, ['rgba(0,0,0,.06)', 'rgba(255,255,255,.08)']); });
  const GOLD = STD({ map: goldT, color: '#ffffff', metalness: .25, roughness: .4, emissive: '#3a2400', emissiveIntensity: .18 });
  const GOLDD = STD({ map: goldT, color: '#c8a070', metalness: .25, roughness: .45, emissive: '#2a1800', emissiveIntensity: .15 });
  const IRON = STD({ color: '#3a3a42', metalness: .45, roughness: .5 });
  const flameM = new T.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: .95, depthWrite: false });
  const flameM2 = new T.MeshBasicMaterial({ color: '#ff9a3a', transparent: true, opacity: .72, depthWrite: false });
  const FLAMES = [];   // [malla, fase] para el parpadeo
  const flame = (x, y, z, s = 1, parent) => { const g = new T.Group(); g.position.set(x, y, z); (parent || scene).add(g);
    const tear = (r, h) => new T.LatheGeometry([[0, 0], [r * .7, h * .08], [r, h * .3], [r * .82, h * .55], [r * .42, h * .8], [0, h]].map(([u, v]) => new T.Vector2(u, v)), 16);
    const a = add(tear(.04 * s, .13 * s), flameM2, 0, 0, 0, { parent: g, cast: false, noInk: true }); const b = add(tear(.024 * s, .085 * s), flameM, 0, .004 * s, 0, { parent: g, cast: false, noInk: true });
    a.renderOrder = 5; b.renderOrder = 6; FLAMES.push([g, rnd() * 6.28]); return g; };
  const candle = (x, y, z, h = .22, parent) => { add(new T.CylinderGeometry(.03, .032, h, 12), STD({ color: '#f4ecd6', roughness: .6, emissive: '#5a4020', emissiveIntensity: .15 }), x, y + h / 2, z, { parent }); flame(x, y + h, z, 1, parent); };

  // ---------- texturas ----------
  const marbleT = (a, b) => tex(512, 512, (g, w, h) => { const n = 4, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const c = (i + j) % 2 ? b : a; g.fillStyle = c; g.fillRect(i * s, j * s, s, s);
      g.globalAlpha = .25; for (let k = 0; k < 4; k++) { g.strokeStyle = (i + j) % 2 ? 'rgba(255,220,200,.5)' : 'rgba(120,90,60,.45)'; g.lineWidth = 1 + rnd() * 2; g.beginPath(); let x = i * s + rnd() * s, y = j * s; g.moveTo(x, y); for (let q = 0; q < 6; q++) { x += (rnd() - .5) * 30; y += s / 6; g.lineTo(x, y); } g.stroke(); } g.globalAlpha = 1;
      g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(i * s, j * s, s, 3); g.fillRect(i * s, j * s, 3, s); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(i * s + 3, j * s + 3, s - 6, 3); }
    noise(g, w, h, 6000, ['rgba(0,0,0,.05)', 'rgba(255,255,255,.06)']); });
  const lisPattern = (g, w, h, base, lisCol, step, sz, border) => { g.fillStyle = base; g.fillRect(0, 0, w, h); noise(g, w, h, 9000, ['rgba(0,0,0,.07)', 'rgba(255,255,255,.05)']);
    for (let y = step / 2, r = 0; y < h; y += step, r++) for (let x = (r % 2 ? step : step / 2); x < w; x += step) drawLis(g, x, y, sz, lisCol);
    if (border) { g.strokeStyle = border; g.lineWidth = w * .035; g.strokeRect(w * .02, h * .012, w * .96, h * .976); g.strokeStyle = '#7a5410'; g.lineWidth = 3; g.strokeRect(w * .045, h * .03, w * .91, h * .94); } };
  const drawLis = (g, x, y, s, col) => { g.save(); g.translate(x, y); g.scale(s / 60, s / 60); g.fillStyle = col; g.strokeStyle = 'rgba(60,40,0,.65)'; g.lineWidth = 3;
    const p = new Path2D('M0,-34 C9,-24 11,-12 4,-2 L-4,-2 C-11,-12 -9,-24 0,-34Z M-5,0 C-14,-2 -26,-8 -26,-20 C-26,-28 -18,-32 -12,-28 C-18,-26 -18,-18 -12,-14 C-8,-10 -6,-6 -5,0Z M5,0 C14,-2 26,-8 26,-20 C26,-28 18,-32 12,-28 C18,-26 18,-18 12,-14 C8,-10 6,-6 5,0Z M-14,0 L14,0 L14,7 L-14,7Z M-4,7 C-6,14 -12,20 -18,22 L-4,22 L0,12 L4,22 L18,22 C12,20 6,14 4,7Z');
    g.fill(p); g.stroke(p); g.restore(); };
  const stoneWarm = STD({ map: tex(512, 512, (g, w, h) => { g.fillStyle = '#7e766a'; g.fillRect(0, 0, w, h); const rows = 8, bh = h / rows;
    for (let r = 0; r < rows; r++) { let x = -(r % 2) * 40; while (x < w) { const bw = 70 + rnd() * 60; const c = new T.Color('#cbbfa4').offsetHSL((rnd() - .5) * .02, (rnd() - .5) * .06, (rnd() - .5) * .08); g.fillStyle = '#' + c.getHexString(); g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6);
      g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x + 3, r * bh + 3, bw - 6, 3); g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(x + 3, r * bh + bh - 7, bw - 6, 4); x += bw; } }
    noise(g, w, h, 12000, ['rgba(0,0,0,.06)', 'rgba(255,255,255,.05)']); blot(g, w, h, 8, 'rgba(60,40,20,.12)', 30, 90); }), roughness: .95 });
  const carpetT = tex(256, 1024, (g, w, h) => { g.fillStyle = '#1f3a8f'; g.fillRect(0, 0, w, h); noise(g, w, h, 8000, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.04)']);
    for (let y = 64; y < h; y += 128) drawLis(g, w / 2, y, 56, '#e0b03a');
    g.fillStyle = '#e8b830'; g.fillRect(0, 0, 22, h); g.fillRect(w - 22, 0, 22, h); g.fillStyle = '#a8241e'; g.fillRect(22, 0, 8, h); g.fillRect(w - 30, 0, 8, h); });
  carpetT.wrapT = T.RepeatWrapping;
  const redCarpetM = STD({ map: tex(256, 256, (g, w, h) => { g.fillStyle = '#8a1f22'; g.fillRect(0, 0, w, h); noise(g, w, h, 6000, ['rgba(0,0,0,.1)', 'rgba(255,255,255,.04)']); }), roughness: 1 });

  // ---------- suelo, paredes y techo ----------
  floorXZ(HX0, HX1, HZ0, HZ1 + 6, 0, STD({ map: marbleT('#eadfc6', '#8a2f2c'), roughness: .34 }), 4);
  wallZY(HZ0, HZ1, 0, HH, HX0, stoneWarm, 3, -1); wallZY(HZ0, HZ1, 0, HH, HX1, stoneWarm, 3, 1);
  wallXY(HX0, HX1, 0, HH, HZ0, stoneWarm, 3);
  // pared del portón (agujero central 3.6 × 6)
  [[HX0, -1.8], [1.8, HX1]].forEach(([a, b]) => wallXY(a, b, 0, HH, HZ1, stoneWarm, 3, { ry: Math.PI }));
  wallXY(-1.8, 1.8, 6, HH, HZ1, stoneWarm, 3, { ry: Math.PI });
  // zócalo de madera y friso pintado azul con lises a lo largo de las paredes laterales
  [HX0 + .06, HX1 - .06].forEach((x, i) => { add(RB(.1, 1.1, HZ1 - HZ0, .02), MAT.woodDk, x, .55, (HZ0 + HZ1) / 2);
    const fr = tex(2048, 128, (g, w, h) => { lisPattern(g, w, h, '#22408f', '#e0b03a', 128, 70); g.fillStyle = '#e8b830'; g.fillRect(0, 0, w, 10); g.fillRect(0, h - 10, w, 10); });
    add(new T.PlaneGeometry(HZ1 - HZ0, .9), STD({ map: fr, roughness: .8 }), x + (i ? -.04 : .04), 5.9, (HZ0 + HZ1) / 2, { ry: i ? -Math.PI / 2 : Math.PI / 2, cast: false, noInk: true }); });
  // techo de vigas
  floorXZ(HX0, HX1, HZ0, HZ1, HH, STD({ map: planksT('#4a2e1c'), roughness: .9 }), 3, { rx: Math.PI / 2 });
  for (let z = HZ0 + 1; z < HZ1; z += 2.4) add(RB(HX1 - HX0, .45, .4, .04), MAT.woodDk, 0, HH - .3, z);
  // ---------- columnas con estandartes ----------
  const colM = STD({ map: tex(256, 512, (g, w, h) => { g.fillStyle = '#d8c6a0'; g.fillRect(0, 0, w, h); for (let k = 0; k < 9; k++) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, k * h / 9, w, 3); } noise(g, w, h, 6000, ['rgba(0,0,0,.06)', 'rgba(255,255,255,.06)']); for (let k = 0; k < 6; k++) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(k * w / 6, 0, 6, h); } }), roughness: .9 });
  const banT = (c1, c2) => tex(256, 768, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = c1; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, h); g.lineTo(w / 2, h * .86); g.lineTo(0, h); g.closePath(); g.fill();
    noise(g, w, h * .86, 3000, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.05)']); drawLis(g, w / 2, h * .3, 150, c2); drawLis(g, w / 2 - 60, h * .58, 70, c2); drawLis(g, w / 2 + 60, h * .58, 70, c2);
    g.strokeStyle = c2; g.lineWidth = 14; g.beginPath(); g.moveTo(10, 0); g.lineTo(10, h - 14); g.lineTo(w / 2, h * .86 - 10); g.lineTo(w - 10, h - 14); g.lineTo(w - 10, 0); g.stroke(); });
  const banBlue = STD({ map: banT('#22408f', '#e8b830'), transparent: true, alphaTest: .5, side: T.DoubleSide, roughness: .9 }), banRed = STD({ map: banT('#a8241e', '#e8b830'), transparent: true, alphaTest: .5, side: T.DoubleSide, roughness: .9 });
  const BANNERS = [];
  [-11, -6, -1, 4, 9].forEach((z, k) => [-1, 1].forEach(sd => { const x = sd * 4.7;
    add(new T.CylinderGeometry(.42, .42, HH, 20), colM, x, HH / 2, z); add(RB(1.15, .5, 1.15, .06), stoneWarm, x, .25, z); add(RB(1.15, .45, 1.15, .06), stoneWarm, x, HH - 1.1, z);
    add(RB(1.3, .18, 1.3, .04), GOLDD, x, HH - .8, z);
    const b = add(new T.PlaneGeometry(1.05, 3.2), (k + (sd > 0 ? 1 : 0)) % 2 ? banRed : banBlue, x, 5.6, z + .48, { cast: false, noInk: true }); BANNERS.push([b, rnd() * 6]);
    add(new T.CylinderGeometry(.03, .03, 1.25, 8), GOLD, x, 7.24, z + .48, { rz: Math.PI / 2 }); }));
  // ---------- vidrieras (pared izquierda) con haces de luz ----------
  const glassT = () => tex(256, 512, (g, w, h) => { const cols = ['#2f5fbf', '#c8302e', '#e8b830', '#3a9a5a', '#7a3a9a', '#7fb2ec'];
    for (let y = 0; y < h; y += 32) for (let x = 0; x < w; x += 32) { g.fillStyle = cols[Math.floor(rnd() * cols.length)]; g.fillRect(x, y, 32, 32); }
    g.strokeStyle = '#1b1720'; g.lineWidth = 4; for (let y = 0; y <= h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } for (let x = 0; x <= w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    drawLis(g, w / 2, h * .45, 120, '#f4d26a'); g.strokeStyle = '#1b1720'; g.lineWidth = 10; g.strokeRect(0, 0, w, h); });
  const archShape = (w, h) => { const s = new T.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h - w * .6); s.quadraticCurveTo(-w / 2, h - w * .05, 0, h); s.quadraticCurveTo(w / 2, h - w * .05, w / 2, h - w * .6); s.lineTo(w / 2, 0); s.closePath(); return s; };
  const shaftT = tex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,236,190,.55)'); gr.addColorStop(.7, 'rgba(255,226,170,.18)'); gr.addColorStop(1, 'rgba(255,220,160,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const shaftM = new T.MeshBasicMaterial({ map: shaftT, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, opacity: .55 });
  const patchT = tex(128, 256, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w * .9); gr.addColorStop(0, 'rgba(255,236,190,.65)'); gr.addColorStop(1, 'rgba(255,236,190,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const patchM = new T.MeshBasicMaterial({ map: patchT, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: .5 });
  [-11, -6, -1, 4, 9].forEach(z => { const g = new T.Group(); g.position.set(HX0 + .08, 3.4, z - 2.5); g.rotation.y = Math.PI / 2; scene.add(g);
    const sh = archShape(1.5, 4.4); add(new T.ShapeGeometry(sh), STD({ map: glassT(), emissive: '#ffffff', emissiveMap: null, emissiveIntensity: .0, roughness: .6 }), 0, 0, .02, { parent: g, cast: false, noInk: true }).material.emissiveMap = null;
    const m = g.children[g.children.length - 1]; m.material = new T.MeshBasicMaterial({ map: glassT() });
    const ex = new T.ExtrudeGeometry((() => { const o = archShape(1.9, 4.8); o.holes.push(new T.Path(archShape(1.5, 4.4).getPoints(24))); return o; })(), { depth: .18, bevelEnabled: false }); add(ex, stoneWarm, 0, -.2, -.05, { parent: g });
    // haz de luz desde la vidriera hacia el suelo (cae hacia +x y hacia el fondo)
    const q = new T.BufferGeometry(), A = [HX0 + .1, 7.4, z - 3.2], B = [HX0 + .1, 7.4, z - 1.8], C = [HX0 + 4.6, 0.02, z - 1.2], D = [HX0 + 4.6, 0.02, z - 2.8];
    q.setAttribute('position', new T.Float32BufferAttribute([...A, ...B, ...C, ...A, ...C, ...D], 3)); q.setAttribute('uv', new T.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2));
    const shf = new T.Mesh(q, shaftM); shf.renderOrder = 8; shf.userData.noInk = true; scene.add(shf);
    add(new T.PlaneGeometry(2.2, 1.6), patchM, HX0 + 4.6, .015, z - 2, { rx: -Math.PI / 2, cast: false, noInk: true }).renderOrder = 7; });
  // ventanas altas a la derecha (sin haz, solo luz de cielo)
  [-11, -6, -1, 4, 9].forEach(z => { const g = new T.Group(); g.position.set(HX1 - .08, 4.2, z - 2.5); g.rotation.y = -Math.PI / 2; scene.add(g);
    add(new T.ShapeGeometry(archShape(1.3, 3.6)), new T.MeshBasicMaterial({ map: glassT() }), 0, 0, .02, { parent: g, cast: false, noInk: true });
    const ex = new T.ExtrudeGeometry((() => { const o = archShape(1.7, 4.0); o.holes.push(new T.Path(archShape(1.3, 3.6).getPoints(24))); return o; })(), { depth: .18, bevelEnabled: false }); add(ex, stoneWarm, 0, -.2, -.05, { parent: g }); });

  // ---------- tarima, trono, tapiz y rosetón ----------
  const THRONE = new T.Vector3(0, .75, -14.0);   // asiento del trono (centro), el rey mira hacia +z
  [[0, 3.6, -11.2], [1, 3.0, -11.75], [2, 2.4, -12.3]].forEach(([k, hw, z0]) => { const y0 = k * .25; BX(-hw, hw, y0, y0 + .25, -15.6, z0, redCarpetM); add(RB(hw * 2 + .04, .05, .06, .01), GOLD, 0, y0 + .25, z0 + .01); });
  // alfombra azul desde el portón a la tarima
  add(new T.PlaneGeometry(2.6, HZ1 + 6 - (-11.2)), STD({ map: carpetT, roughness: 1 }), 0, .012, (HZ1 + 6 - 11.2) / 2, { rx: -Math.PI / 2, cast: false, noInk: true }).material.map.repeat.set(1, 8);
  // trono
  { const g = new T.Group(); g.position.copy(THRONE); scene.add(g);
    const velvet = STD({ map: tex(256, 512, (gg, w, h) => lisPattern(gg, w, h, '#22408f', '#e8b830', 96, 52)), roughness: 1 });
    add(RB(1.3, .42, 1.0, .06), GOLD, 0, .0, 0, { parent: g }); add(RB(1.1, .14, .86, .06), STD({ color: '#22408f', roughness: 1 }), 0, .28, .04, { parent: g });
    const back = new T.ExtrudeGeometry(archShape(1.4, 2.9), { depth: .18, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 2 }); add(back, GOLD, 0, .1, -.5, { parent: g });
    add(new T.ShapeGeometry(archShape(1.05, 2.4)), velvet, 0, .3, -.24, { parent: g, cast: false, noInk: true }); add(new T.TorusGeometry(.2, .035, 8, 24), GOLDD, 0, 2.55, -.24, { parent: g }); add(new T.SphereGeometry(.08, 12, 10), STD({ color: '#c8243a', roughness: .3 }), 0, 2.55, -.22, { parent: g });
    [-1, 1].forEach(sd => { add(RB(.16, .5, .9, .04), GOLD, sd * .66, .42, .05, { parent: g }); add(new T.SphereGeometry(.13, 16, 12), GOLD, sd * .66, .74, .48, { parent: g });
      add(new T.ConeGeometry(.09, .4, 12), GOLD, sd * .62, 2.86, -.42, { parent: g }); add(new T.SphereGeometry(.07, 12, 10), GOLD, sd * .62, 3.1, -.42, { parent: g }); });
    add(new T.ConeGeometry(.11, .5, 12), GOLD, 0, 3.2, -.42, { parent: g }); add(new T.SphereGeometry(.09, 12, 10), GOLD, 0, 3.5, -.42, { parent: g });
    add(RB(.9, .12, .5, .03), GOLDD, 0, -.26, .6, { parent: g }); }
  // tapiz de lises detrás del trono
  { const tp = tex(1024, 1024, (g, w, h) => { lisPattern(g, w, h, '#22408f', '#e0b03a', 128, 76, '#e8b830'); for (let x = 20; x < w; x += 18) { g.fillStyle = '#e8b830'; g.fillRect(x, h - 18, 8, 18); } });
    add(new T.PlaneGeometry(6.4, 6.6), STD({ map: tp, roughness: .95 }), 0, 4.9, HZ0 + .05, { cast: false, noInk: true }); add(new T.CylinderGeometry(.06, .06, 6.8, 12), GOLD, 0, 8.25, HZ0 + .12, { rz: Math.PI / 2 });
    [-1, 1].forEach(sd => add(new T.SphereGeometry(.12, 12, 10), GOLD, sd * 3.45, 8.25, HZ0 + .12)); }
  // rosetón
  { const rt = tex(512, 512, (g, w, h) => { g.fillStyle = '#1b1720'; g.fillRect(0, 0, w, h); const cx = w / 2, cy = h / 2; const cols = ['#2f5fbf', '#c8302e', '#e8b830', '#3a9a5a', '#7fb2ec'];
      for (let r = 5; r >= 1; r--) for (let k = 0; k < 12 + r * 4; k++) { const a0 = k / (12 + r * 4) * 6.283, a1 = (k + 1) / (12 + r * 4) * 6.283; g.fillStyle = cols[(k + r) % cols.length]; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, r * 48, a0 + .01, a1 - .01); g.closePath(); g.fill(); }
      g.strokeStyle = '#1b1720'; g.lineWidth = 6; for (let r = 1; r <= 5; r++) { g.beginPath(); g.arc(cx, cy, r * 48, 0, 7); g.stroke(); } drawLis(g, cx, cy, 70, '#f4d26a'); });
    add(new T.CircleGeometry(1.25, 48), new T.MeshBasicMaterial({ map: rt }), 0, 9.5, HZ0 + .06, { cast: false, noInk: true });
    add(new T.TorusGeometry(1.3, .12, 10, 48), stoneWarm, 0, 9.5, HZ0 + .1); }
  // candelabros de pie junto al trono y braseros al pie de la tarima
  const candelabra = (x, y, z) => { add(new T.CylinderGeometry(.05, .07, 1.9, 10), IRON, x, y + .95, z); add(new T.CylinderGeometry(.28, .32, .08, 16), IRON, x, y + .04, z);
    add(new T.TorusGeometry(.32, .025, 8, 24), IRON, x, y + 1.85, z, { rx: Math.PI / 2 }); for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283; candle(x + Math.cos(a) * .32, y + 1.86, z + Math.sin(a) * .32, .2); } candle(x, y + 1.9, z, .26); };
  candelabra(-2.4, .75, -13.3); candelabra(2.4, .75, -13.3);
  const brazier = (x, z) => { add(new T.CylinderGeometry(.42, .22, .38, 18, 1, true), STD({ color: '#8a5a2a', metalness: .4, roughness: .45, side: T.DoubleSide }), x, 1.0, z); add(new T.CylinderGeometry(.05, .08, .82, 8), IRON, x, .41, z);
    [0, 1, 2].forEach(k => { const f = flame(x + Math.cos(k * 2.1) * .14, 1.12, z + Math.sin(k * 2.1) * .14, 4.2); }); };
  brazier(-2.9, -10.6); brazier(2.9, -10.6);
  // lámparas de corona con velas
  [[-6.5], [1.5]].forEach(([z]) => { add(new T.TorusGeometry(1.15, .05, 8, 40), IRON, 0, 6.9, z, { rx: Math.PI / 2 }); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; candle(Math.cos(a) * 1.15, 6.93, z + Math.sin(a) * 1.15, .18); }
    [0, 1, 2].forEach(k => { const a = k / 3 * 6.283; const p = new T.Vector3(Math.cos(a) * 1.1, 6.9, z + Math.sin(a) * 1.1), top = new T.Vector3(0, HH - .5, z); const L = p.distanceTo(top);
      const m = add(new T.CylinderGeometry(.012, .012, L, 6), IRON, (p.x + top.x) / 2, (p.y + top.y) / 2, (p.z + top.z) / 2, { cast: false }); m.lookAt(top); m.rotateX(Math.PI / 2); }); });
  // antorchas en la pared derecha y bancos con escudos
  [-8.5, -3.5, 1.5, 6.5].forEach(z => { add(RB(.12, .5, .12, .02), IRON, HX1 - .2, 2.6, z); add(new T.CylinderGeometry(.09, .05, .28, 10), IRON, HX1 - .3, 2.95, z); flame(HX1 - .3, 3.06, z, 3.4);
    const sh = tex(256, 300, (g, w, h) => { g.fillStyle = '#22408f'; g.beginPath(); g.moveTo(10, 10); g.lineTo(w - 10, 10); g.lineTo(w - 10, h * .55); g.quadraticCurveTo(w - 10, h - 10, w / 2, h - 4); g.quadraticCurveTo(10, h - 10, 10, h * .55); g.closePath(); g.fill(); g.strokeStyle = '#e8b830'; g.lineWidth = 12; g.stroke(); drawLis(g, w / 2, h * .42, 120, '#e8b830'); });
    add(new T.PlaneGeometry(.7, .82), STD({ map: sh, transparent: true, alphaTest: .4, roughness: .7 }), HX0 + .1, 2.4, z + 1.2, { ry: Math.PI / 2, cast: false, noInk: true });
    add(RB(.45, .45, 1.8, .03), MAT.wood, HX0 + .5, .22, z + 1.2); });
  // ---------- portón doble (se abre con setDoors) y pasillo luminoso detrás ----------
  const DOORS = []; { const dT = tex(256, 512, (g, w, h) => { g.fillStyle = '#6a4226'; g.fillRect(0, 0, w, h); for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? '#5e3a20' : '#74482a'; g.fillRect(k * w / 5, 0, w / 5 - 3, h); }
      g.fillStyle = '#2a2a30'; [.15, .5, .85].forEach(f => g.fillRect(0, h * f, w, 18)); for (let k = 0; k < 7; k++) [.15, .5, .85].forEach(f => { g.beginPath(); g.arc(18 + k * 36, h * f + 9, 5, 0, 7); g.fillStyle = '#8a8a92'; g.fill(); }); noise(g, w, h, 4000, ['rgba(0,0,0,.1)']); });
    const dM = STD({ map: dT, roughness: .85 });
    [-1, 1].forEach(sd => { const piv = new T.Group(); piv.position.set(sd * 1.8, 0, HZ1 - .05); scene.add(piv); add(RB(1.78, 5.9, .14, .02), dM, -sd * .9, 2.95, 0, { parent: piv }); add(new T.TorusGeometry(.14, .03, 8, 20), IRON, -sd * 1.5, 2.8, .12, { parent: piv }); DOORS.push([piv, sd]); });
    wallXY(-2.4, 2.4, 0, 7, HZ1 + 6, STD({ map: plaster('#f2e6c8', .2), emissive: '#fff0d0', emissiveIntensity: .35 }), 3, { ry: Math.PI });
    [-1, 1].forEach(sd => wallZY(HZ1, HZ1 + 6, 0, 7, sd * 2.4, STD({ map: plaster('#efe2c2', .2), emissive: '#fff0d0', emissiveIntensity: .25 }), 3, sd));
    floorXZ(-2.4, 2.4, HZ1, HZ1 + 6, 7, STD({ color: '#efe2c2' }), 3, { rx: Math.PI / 2 }); }
  function setDoors(k) { DOORS.forEach(([p, sd]) => p.rotation.y = sd * k * 1.35); }
  // ---------- mesa del banquete (se enseña con setBanquet) ----------
  const BANQ = new T.Group(); scene.add(BANQ); const BT = new T.Vector3(0, .9, -9.6);
  { const cloth = STD({ map: tex(512, 128, (g, w, h) => { g.fillStyle = '#f4efe2'; g.fillRect(0, 0, w, h); g.fillStyle = '#22408f'; g.fillRect(0, h * .38, w, h * .24); for (let x = 20; x < w; x += 64) drawLis(g, x, h / 2, 26, '#e8b830'); noise(g, w, h, 2000, ['rgba(0,0,0,.04)']); }), roughness: .9 });
    add(RB(6.6, .1, 1.3, .03), cloth, 0, .9, BT.z, { parent: BANQ }); add(RB(6.64, .5, 1.34, .02), cloth, 0, .62, BT.z, { parent: BANQ, cast: false });
    const gob = new T.LatheGeometry([[0, 0], [.05, 0], [.052, .01], [.012, .03], [.01, .1], [.04, .12], [.05, .17], [.048, .2]].map(([r, y]) => new T.Vector2(r, y)), 20);
    for (let k = 0; k < 7; k++) { const x = -2.7 + k * .9; add(gob, GOLD, x, .95, BT.z + .22, { parent: BANQ }); add(new T.CylinderGeometry(.16, .14, .02, 20), STD({ color: '#d8d2c4', metalness: .3, roughness: .4 }), x + .25, .96, BT.z + .3, { parent: BANQ }); }
    const fowl = (x) => { add(new T.SphereGeometry(.22, 16, 12), STD({ color: '#b8642a', roughness: .5, emissive: '#3a1a08', emissiveIntensity: .2 }), x, 1.08, BT.z, { parent: BANQ, s: [1.2, .75, .9] }); [-1, 1].forEach(sd => add(new T.CapsuleGeometry(.05, .16, 4, 8), STD({ color: '#a8541e' }), x + sd * .18, 1.1, BT.z + .14, { parent: BANQ, rz: sd * .9 })); add(new T.CylinderGeometry(.34, .3, .04, 24), GOLD, x, .97, BT.z, { parent: BANQ }); };
    fowl(-1.4); fowl(1.4);
    [[-.4, '#c8302e'], [.0, '#3a9a5a'], [.35, '#e8b830']].forEach(([dx, c]) => add(new T.SphereGeometry(.07, 12, 10), STD({ color: c, roughness: .4 }), dx, 1.02, BT.z - .1, { parent: BANQ }));
    add(new T.CylinderGeometry(.3, .2, .1, 20), GOLD, 0, .99, BT.z - .1, { parent: BANQ });
    [-2.2, 2.2].forEach(x => { add(new T.CylinderGeometry(.04, .06, .5, 10), GOLD, x, 1.2, BT.z - .3, { parent: BANQ }); candle(x, 1.45, BT.z - .3, .22, BANQ); }); }
  BANQ.visible = false;
  function setBanquet(on) { BANQ.visible = !!on; }
  // luces de la sala (solo si la cámara está dentro)
  zoneLight('#ffe2c0', 9, 7, -2.4, 2.9, -13.0, inHall); zoneLight('#ffe2c0', 9, 7, 2.4, 2.9, -13.0, inHall);
  zoneLight('#fff0dc', 16, 14, 0, 6.4, -6.5, inHall); zoneLight('#fff0dc', 16, 14, 0, 6.4, 1.5, inHall);
  zoneLight('#ffc890', 6, 5, -2.9, 1.5, -10.4, inHall); zoneLight('#ffc890', 6, 5, 2.9, 1.5, -10.4, inHall);
  zoneLight('#fff0d0', 40, 12, 0, 4, HZ1 + 3, inHall);

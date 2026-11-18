  // =====================================================================================================
  // 73 · ZONAS: cada zona es un grupo que solo se ve con su ambiente (setMood). Así los decorados pueden compartir coordenadas.
  // =====================================================================================================
  const ZG = {}; const zone = (n, ...moods) => { const g = new T.Group(); g.name = n; g.userData.moods = moods.length ? moods : [n]; scene.add(g); ZG[n] = g; return g; };
  const FGO = []; const fg = m => { m.userData.fg = true; FGO.push(m); return m; };
  const TICK = [];   // animaciones por tiempo: (t) => {}
  // ---------- materiales del avión ----------
  const R_F = 3.2, LCUT0 = -6, LCUT1 = 8, TH0 = 160 * Math.PI / 180, THL = 220 * Math.PI / 180;   // fuselaje: radio y tramo abierto (por el lado +x)
  const FLOOR_Y = -.55, HOLD_Y = -2.62;
  // piel del fuselaje: u = θ/2π alrededor (y = -R·cos θ), v = z/1.2 a lo largo → blanco arriba, raya roja con filete dorado a la altura de las ventanillas, panza de aluminio
  const skinTex = (wins) => { const t = tex(1024, 256, (g, w, h) => { for (let x = 0; x < w; x++) { const th = (x + .5) / w * Math.PI * 2, y = -Math.cos(th) * R_F;
      let c = y > .55 ? '#f3f2ee' : y > .05 ? '#c42e2c' : y > -.05 ? '#e8b830' : y > -.9 ? '#f3f2ee' : '#c3c9d1'; if (y < -.9) c = new T.Color('#c3c9d1').offsetHSL(0, 0, (Math.sin(x * .31) * .02)).getStyle();
      g.fillStyle = c; g.fillRect(x, 0, 1, h); }
    // remaches y juntas de chapa
    g.strokeStyle = 'rgba(60,70,80,.18)'; g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(0, k * h / 6); g.lineTo(w, k * h / 6); g.stroke(); }
    if (wins) for (const u0 of [.295, .705]) { const x = u0 * w; g.fillStyle = '#1e2a3a'; g.beginPath(); g.roundRect(x - 9, h * .32, 18, h * .36, 7); g.fill(); g.fillStyle = 'rgba(160,200,255,.55)'; g.fillRect(x - 5, h * .36, 4, h * .14); }
    noise(g, w, h, 4000, ['rgba(0,0,0,.03)', 'rgba(255,255,255,.05)']); }); return t; };
  const SKIN = STD({ map: skinTex(true), roughness: .32, metalness: .25, envMapIntensity: 1.2 }), SKIN0 = STD({ map: skinTex(false), roughness: .32, metalness: .25, envMapIntensity: 1.2 });
  const ALU = STD({ color: '#c9ced6', roughness: .28, metalness: .75, envMapIntensity: 1.3 }), ALUD = STD({ color: '#8a9098', roughness: .35, metalness: .7 });
  const REDP = STD({ color: '#c42e2c', roughness: .35, metalness: .1 }), WHITEP = STD({ color: '#f3f2ee', roughness: .35 });
  const CUTM = STD({ color: '#e8553a', roughness: .6 });     // cara de corte (como en los dibujos técnicos)
  const GLASSD = STD({ color: '#1e2a3a', roughness: .1, metalness: .4, envMapIntensity: 1.5 });
  // forro interior: cabina beige con paneles y ventanillas; bodega gris con aislante acolchado y costillas
  const linerT = tex(1024, 512, (g, w, h) => { for (let x = 0; x < w; x++) { const th = (x + .5) / w * Math.PI * 2, y = -Math.cos(th) * R_F; g.fillStyle = y > FLOOR_Y ? '#e9dfc8' : '#6f747c'; g.fillRect(x, 0, 1, h); }
    for (let x = 0; x < w; x += 8) { const th = (x + .5) / w * Math.PI * 2, y = -Math.cos(th) * R_F; if (y < FLOOR_Y) { g.fillStyle = (x / 8) % 2 ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.05)'; g.fillRect(x, 0, 8, h); } }
    for (const u0 of [.295, .705]) { const x = u0 * w; g.fillStyle = '#cfc3a6'; g.beginPath(); g.roundRect(x - 26, h * .2, 52, h * .6, 18); g.fill(); g.fillStyle = '#9fc8ef'; g.beginPath(); g.roundRect(x - 15, h * .3, 30, h * .4, 12); g.fill(); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x - 9, h * .34, 6, h * .14); }
    g.strokeStyle = 'rgba(80,70,50,.25)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 2); g.lineTo(w, 2); g.stroke(); noise(g, w, h, 6000, ['rgba(0,0,0,.04)', 'rgba(255,255,255,.04)']); });
  const LINER = STD({ map: linerT, roughness: .8, side: T.BackSide });
  // ---------- piezas ----------
  const remapUV = (geo, th0, thL, z0, L, tile = 1.2) => { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (th0 + uv.getX(i) * thL) / (Math.PI * 2), (z0 + uv.getY(i) * L) / tile); };
  const tube = (r0, r1, z0, z1, mat, th0 = 0, thL = Math.PI * 2, parent, segs = 72) => { const L = z1 - z0, g = new T.CylinderGeometry(r1, r0, L, segs, 1, true, th0, thL); remapUV(g, th0, thL, z0, L); g.rotateX(Math.PI / 2);
    return add(g, mat, 0, 0, (z0 + z1) / 2, { parent }); };
  const lathe = (pts, mat, parent, zs = 1) => { const g = new T.LatheGeometry(pts.map(([r, z]) => new T.Vector2(r, z)), 72); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i), 0); g.rotateX(Math.PI / 2); g.scale(1, 1, zs); return add(g, mat, 0, 0, 0, { parent }); };
  const planform = (pts, thick, mat, parent, mirror) => { const s = new T.Shape(); pts.forEach(([x, z], i) => i ? s.lineTo(x, -z) : s.moveTo(x, -z)); const g = new T.ExtrudeGeometry(s, { depth: thick, bevelEnabled: true, bevelSize: thick * .45, bevelThickness: thick * .45, bevelSegments: 3, curveSegments: 4 });
    g.rotateX(-Math.PI / 2); if (mirror) g.scale(-1, 1, 1); return add(g, mat, 0, -thick / 2, 0, { parent }); };
  const finShape = (pts, thick, mat, parent) => { const s = new T.Shape(); pts.forEach(([z, y], i) => i ? s.lineTo(-z, y) : s.moveTo(-z, y)); const g = new T.ExtrudeGeometry(s, { depth: thick, bevelEnabled: true, bevelSize: thick * .4, bevelThickness: thick * .4, bevelSegments: 3 });
    g.rotateY(Math.PI / 2); return add(g, mat, -thick / 2, 0, 0, { parent }); };
  // avión completo; cut = tramo central abierto por el lado +x con cabina y bodega
  function makePlane(parent, cut) {
    const P = new T.Group(); parent.add(P);
    if (cut) { tube(R_F, R_F, -18, LCUT0, SKIN, 0, Math.PI * 2, P); tube(R_F, R_F, LCUT1, 18, SKIN, 0, Math.PI * 2, P); tube(R_F, R_F, LCUT0, LCUT1, SKIN, TH0, THL, P);
      tube(R_F - .14, R_F - .14, LCUT0, LCUT1, LINER, TH0, THL, P);
      // caras de corte a lo largo (arriba y abajo) y en los extremos del hueco
      [TH0, TH0 + THL].forEach(th => { const x = Math.sin(th) * (R_F - .07), y = -Math.cos(th) * (R_F - .07); add(new T.BoxGeometry(.16, .16, LCUT1 - LCUT0), CUTM, x, y, (LCUT0 + LCUT1) / 2, { parent: P, rz: th }); });
      // borde de la piel en los extremos del hueco: arco θ ∈ [20°, 160°] → en el plano XY, φ = θ - 90° ∈ [-70°, 70°]
      [LCUT0, LCUT1].forEach(z => { const g = new T.RingGeometry(R_F - .16, R_F + .01, 48, 1, -70 * Math.PI / 180, 140 * Math.PI / 180); const m = add(g, CUTM, 0, 0, z, { parent: P, cast: false, noInk: true }); m.material = CUTM.clone(); m.material.side = T.DoubleSide; });
      // mamparos al fondo de cabina y bodega (cierran la vista hacia el resto del avión)
      [LCUT0 + .02, LCUT1 - .02].forEach((z, i) => { const d = add(new T.CircleGeometry(R_F - .15, 64), STD({ color: '#d9cdb2', roughness: .8, side: T.DoubleSide }), 0, 0, z, { parent: P, cast: false });
        const hd = add(new T.PlaneGeometry(3.4, 2.3), STD({ color: '#5f646c', roughness: .9, side: T.DoubleSide }), 0, (FLOOR_Y + HOLD_Y) / 2 - .02, z + (i ? -.01 : .01), { parent: P, cast: false, noInk: true });
        const door = add(new T.PlaneGeometry(.9, 2.0), STD({ color: '#b8ab8e', roughness: .7, side: T.DoubleSide }), -1.2, FLOOR_Y + 1.0, z + (i ? -.015 : .015), { parent: P, cast: false, noInk: true }); }); }
    else tube(R_F, R_F, -18, 18, SKIN, 0, Math.PI * 2, P);
    // morro redondeado con cabina de mando; cola afilada
    lathe([[R_F, 18], [R_F * .97, 20.5], [R_F * .86, 22.6], [R_F * .62, 24.3], [R_F * .3, 25.4], [0, 25.8]], SKIN0, P);
    lathe([[0, -31.5], [.45, -31.2], [1.2, -29], [2.1, -25], [2.8, -21], [R_F, -18]], SKIN0, P);
    [[-.55, .9], [.55, .9]].forEach(([x], i) => add(RB(1.0, .42, .9, .12), GLASSD, x * 1.6, 1.55, 22.4, { parent: P, rx: -.5, ry: x > 0 ? -.35 : .35 }));
    add(RB(1.25, .42, .5, .12), GLASSD, 0, 1.72, 22.9, { parent: P, rx: -.55 });
    // puerta de pasajeros y portón de bodega (lado +x)
    const dg = add(new T.PlaneGeometry(1.0, 2.0), STD({ color: '#d8d6d0', roughness: .4, metalness: .3 }), 0, 0, 0, { parent: P, cast: false, noInk: true }); dg.position.set(R_F * Math.sin(1.86) + .01, .5, 14.5); dg.rotation.y = Math.PI / 2;
    // alas en flecha (raíz detrás del tramo abierto), motores colgados, deriva y estabilizadores
    const wingPts = [[2.2, -7.5], [21.5, -17.2], [21.8, -19.4], [2.2, -16.4]];
    const wingR = planform(wingPts, .42, ALU, P), wingL = planform(wingPts, .42, ALU, P, true); wingR.position.y = -1.7; wingL.position.y = -1.7; wingL.material = ALU.clone(); wingL.material.side = T.DoubleSide;
    [[7.6, -12.4], [14, -15.4]].forEach(([x, z]) => [1, -1].forEach(sd => { const E = new T.Group(); E.position.set(sd * x, -2.85, z + .6); P.add(E);
      add(new T.CylinderGeometry(.62, .55, 4.4, 28), ALU, 0, 0, 0, { parent: E, rx: Math.PI / 2 }); add(new T.TorusGeometry(.6, .1, 12, 28), ALUD, 0, 0, 2.2, { parent: E });
      add(new T.CircleGeometry(.52, 24), STD({ color: '#24262c', roughness: .6 }), 0, 0, 2.18, { parent: E, cast: false, noInk: true }); add(new T.ConeGeometry(.3, .9, 18), ALUD, 0, 0, -2.6, { parent: E, rx: -Math.PI / 2 });
      add(RB(.22, 1.1, 2.6, .08), ALU, 0, .7, -.2, { parent: E }); }));
    finShape([[-19.5, 1.6], [-27.6, 8.8], [-30.6, 8.8], [-30.4, 1.6]], .38, REDP, P);
    add(RB(.46, .36, 3.2, .1), WHITEP, 0, 6.2, -28.4, { parent: P, rx: .78 });
    const stab = [[.8, -26.3], [8.2, -30.2], [8.3, -31.4], [.8, -30.6]]; [false, true].forEach(m => { const s = planform(stab, .26, ALU, P, m); s.position.y = .9; if (m) { s.material = ALU.clone(); s.material.side = T.DoubleSide; } });
    // luces de navegación
    add(new T.SphereGeometry(.16, 12, 8), STD({ color: '#ff3a3a', emissive: '#ff2a2a', emissiveIntensity: 2 }), -21.7, -1.7, -18.6, { parent: P, cast: false, noInk: true });
    add(new T.SphereGeometry(.16, 12, 8), STD({ color: '#3aff6a', emissive: '#2aff5a', emissiveIntensity: 2 }), 21.7, -1.7, -18.6, { parent: P, cast: false, noInk: true });
    return P; }
  // ---------- equipaje ----------
  const LEATHER = ['#7a3e1e', '#3a4a6a', '#8a6a3a', '#2f5a3a', '#6a2a2a', '#c49a5a', '#4a3a3a'];
  const stickerT = tex(512, 128, (g, w, h) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, w, h); const cols = ['#e8b830', '#c42e2c', '#2f6fbf', '#f3f2ee', '#3a8a5a'];
    for (let i = 0; i < 5; i++) { g.fillStyle = cols[i]; g.beginPath(); g.ellipse(50 + i * 100, 64, 40, 28, (i - 2) * .2, 0, 7); g.fill(); g.strokeStyle = '#1b1720'; g.lineWidth = 4; g.stroke(); } });
  function suitcase(parent, x, y, z, w, h, d, col, ry = 0) { const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g);
    const M = STD({ color: col, roughness: .55 }); add(RB(w, h, d, .06), M, 0, h / 2, 0, { parent: g });
    [-.3, .3].forEach(f => add(RB(w + .02, .06, d + .02, .02), STD({ color: '#3a2a1e', roughness: .6 }), 0, h / 2 + f * h, 0, { parent: g }));
    add(new T.TorusGeometry(.1, .025, 8, 16, Math.PI), STD({ color: '#2a1a12' }), 0, h + .01, 0, { parent: g, rx: 0 });
    [-1, 1].forEach(sd => add(RB(.07, .07, .07, .02), MAT.brass, sd * (w / 2 - .08), h * .82, d / 2 + .02, { parent: g }));
    return g; }
  function mailSack(parent, x, y, z, s = 1, ry = 0) { const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry; g.scale.setScalar(s); parent.add(g);
    const m = add(new T.SphereGeometry(.5, 20, 14), STD({ color: '#9a8a62', roughness: 1 }), 0, .42, 0, { parent: g }); m.scale.set(1, .85, .8); add(new T.CylinderGeometry(.12, .2, .3, 12), STD({ color: '#8a7a52', roughness: 1 }), 0, .9, 0, { parent: g }); return g; }
  // ---------- la caja de Reg (tablones, listones, plantillas pintadas) ----------
  const CRATE_W = 1.5, CRATE_H = 1.78, CRATE_D = 1.62;
  const crateTX = planksPBR('#d6a46a', 5, 1024), crateM = PBR(crateTX, { roughness: .85, bump: 2 }), crateIn = PBR(planksPBR('#8a5a32', 5, 512), { roughness: .95, bump: 2, color: '#8a6a50' });
  const slatM = PBR(planksPBR('#8a5a2e', 3, 512), { roughness: .8, bump: 2.2 });
  const stencil = (lines, w = 512, h = 512, rot = 0) => { const t = tex(w, h, (g, W_, H_) => { g.clearRect(0, 0, W_, H_); g.save(); g.translate(W_ / 2, H_ / 2); g.rotate(rot); g.fillStyle = 'rgba(28,24,30,.86)';
      lines.forEach(([s, y, px, wgt]) => { g.font = FONT(wgt || 900, px); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 0, y); }); g.restore();
      // grano: la pintura no cubre del todo
      g.globalCompositeOperation = 'destination-out'; noise(g, W_, H_, 9000, ['rgba(0,0,0,.35)', 'rgba(0,0,0,.18)'], [1, 3]); g.globalCompositeOperation = 'source-over'; });
    return STD({ map: t, transparent: true, roughness: .9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }); };
  const STZ = stencil([['ZAPATOS', -120, 108], ['· CALZADO ·', -20, 44, 800], ['PERTH', 70, 96], ['AUSTRALIA', 150, 48, 800]]);
  const STCOD = stencil([['PORTES', -60, 86], ['DEBIDOS', 40, 86], ['↑ ARRIBA ↑', 150, 46, 800]]);
  // etiquetas de papel: correo aéreo (borde de rombos rojos y azules) y sello rojo FRÁGIL
  const paperLbl = (draw, w = 512, h = 340) => STD({ map: tex(w, h, draw), roughness: .9, polygonOffset: true, polygonOffsetFactor: -2 });
  const AIRMAIL = paperLbl((g, w, h) => { g.fillStyle = '#f6efdc'; g.fillRect(0, 0, w, h); for (let i = -2; i < w / 24 + 2; i++) { g.fillStyle = i % 2 ? '#c42e2c' : '#2f5fb0';
      [[0, 0], [0, h - 22]].forEach(([_, y]) => { g.beginPath(); g.moveTo(i * 24, y); g.lineTo(i * 24 + 14, y); g.lineTo(i * 24 + 26, y + 22); g.lineTo(i * 24 + 12, y + 22); g.fill(); }); }
    txt(g, 'VÍA AÉREA', w / 2, h * .36, 64, '#2f5fb0'); txt(g, 'PAR AVION', w / 2, h * .58, 40, '#c42e2c', 800); g.fillStyle = '#1b1720'; g.font = FONT(700, 26); g.textAlign = 'center'; g.fillText('LONDRES → PERTH', w / 2, h * .76);
    noise(g, w, h, 2500, ['rgba(0,0,0,.05)', 'rgba(120,90,40,.06)']); });
  const FRAGIL = STD({ map: tex(512, 200, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = '#c42e2c'; g.lineWidth = 10; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'FRÁGIL', w / 2, h / 2 + 4, 104, '#c42e2c');
      g.globalCompositeOperation = 'destination-out'; noise(g, w, h, 7000, ['rgba(0,0,0,.5)', 'rgba(0,0,0,.25)'], [1, 4]); g.globalCompositeOperation = 'source-over'; }), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, roughness: .9 });
  const IRON = STD({ color: '#3a3a40', roughness: .45, metalness: .6 }), ROPE = STD({ color: '#c8a868', roughness: 1 });
  // crate(parent, open): open = sin los tablones altos del frente (+x) para ver dentro; los dos tablones bajos, los postes y el larguero de arriba
  // van a la capa fg (se dibujan POR ENCIMA del personaje: así Reg queda DENTRO de la caja, con las piernas detrás de las tablas)
  function crate(parent, x, y, z, ry = 0, open = false, lid = 0) { const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g);
    const w = CRATE_W, h = CRATE_H, d = CRATE_D, th = .07;
    add(RB(w, th, d, .01), crateM, 0, th / 2, 0, { parent: g });                                  // suelo
    add(RB(th, h, d, .01), crateM, -w / 2 + th / 2, h / 2, 0, { parent: g });                     // fondo (-x)
    [-1, 1].forEach(sd => add(RB(w, h, th, .01), crateM, 0, h / 2, sd * (d / 2 - th / 2), { parent: g }));   // laterales (±z)
    const top = new T.Group(); top.position.set(-w / 2, h, 0); g.add(top); add(RB(w, th, d, .01), crateM, w / 2, th / 2, 0, { parent: top }); top.rotation.z = lid;   // tapa con bisagra en el borde -x
    if (open) { add(new T.PlaneGeometry(d - .16, h - .12), crateIn, -w / 2 + th + .005, h / 2, 0, { parent: g, ry: Math.PI / 2, cast: false, noInk: true });
      [-1, 1].forEach(sd => add(new T.PlaneGeometry(w - .14, h - .12), crateIn, 0, h / 2, sd * (d / 2 - th - .005), { parent: g, ry: sd > 0 ? Math.PI : 0, cast: false, noInk: true })); }
    const SL = .12, st = .05, front = [];
    // frente: cerrado = tablones enteros; abierto = solo dos tablones bajos (con hueco) + postes + larguero
    if (!open) add(RB(th, h, d, .01), crateM, w / 2 - th / 2, h / 2, 0, { parent: g });
    else [[.13, .2], [.36, .17]].forEach(([yy, hh]) => front.push(add(RB(th, hh, d - .04, .01), crateM, w / 2 - th / 2, yy, 0, { parent: g })));
    // listones de refuerzo en los cantos de los laterales (con diagonal)
    [-1, 1].forEach(sz => { [h - SL / 2, SL / 2].forEach(yy => add(RB(w + .02, SL, st, .01), slatM, 0, yy, sz * (d / 2 + st / 2), { parent: g }));
      [-1, 1].forEach(sx => add(RB(SL, h, st, .01), slatM, sx * (w / 2 - SL / 2), h / 2, sz * (d / 2 + st / 2), { parent: g }));
      add(RB(Math.hypot(w, h) - .2, SL * .9, st, .01), slatM, 0, h / 2, sz * (d / 2 + st / 2), { parent: g, rz: Math.atan2(h, w) * (sz > 0 ? 1 : -1) }); });
    [[h - SL / 2, d + .02, SL, 0], [SL / 2, d + .02, SL, 0], [h / 2, SL, h, -1], [h / 2, SL, h, 1]].forEach(([yy, dd, hh, zs]) => front.push(add(RB(st, hh, dd, .01), slatM, w / 2 + st / 2, yy, zs * (d / 2 - SL / 2), { parent: g })));
    // herrajes de hierro en las 8 esquinas, con clavos
    for (const sx of [-1, 1]) for (const sy of [0, 1]) for (const sz of [-1, 1]) { const cx = sx * (w / 2 + st / 2 + .005), cy = sy ? h - .1 : .1, cz = sz * (d / 2 + st / 2 + .005);
      const b1 = add(RB(.26, .2, .02, .005), IRON, cx - sx * .1, cy, cz, { parent: g }), b2 = add(RB(.02, .2, .26, .005), IRON, cx, cy, cz - sz * .1, { parent: g }); if (sx > 0) front.push(b2); }
    // asas de cuerda en los laterales
    [-1, 1].forEach(sz => add(new T.TorusGeometry(.13, .03, 8, 20, Math.PI), ROPE, 0, h * .78, sz * (d / 2 + st + .03), { parent: g, rz: Math.PI }));
    if (open) { front.push(add(new T.PlaneGeometry(.8, .3), stencil([['ZAPATOS · PERTH', 0, 120]], 1024, 384), w / 2 + .004, .25, -.25, { parent: g, ry: Math.PI / 2, cast: false, noInk: true }));
      front.push(add(new T.PlaneGeometry(.45, .3), AIRMAIL, w / 2 + .006, .26, .48, { parent: g, ry: Math.PI / 2, rz: .05, cast: false, noInk: true })); front.forEach(fg); }
    // plantillas y etiquetas: ZAPATOS + VÍA AÉREA en un lateral, PORTES DEBIDOS + FRÁGIL en el otro, ZAPATOS al fondo
    add(new T.PlaneGeometry(w * .78, w * .78), STZ, -.08, h * .5, d / 2 + st + .004, { parent: g, cast: false, noInk: true });
    add(new T.PlaneGeometry(.62, .41), AIRMAIL, .42, h * .2, d / 2 + st + .006, { parent: g, rz: .06, cast: false, noInk: true });
    add(new T.PlaneGeometry(w * .78, w * .78), STCOD, .05, h * .52, -(d / 2 + st + .004), { parent: g, ry: Math.PI, cast: false, noInk: true });
    add(new T.PlaneGeometry(.66, .26), FRAGIL, -.38, h * .2, -(d / 2 + st + .006), { parent: g, ry: Math.PI, rz: -.12, cast: false, noInk: true });
    add(new T.PlaneGeometry(d * .7, d * .7), STZ, -w / 2 - .004, h * .52, 0, { parent: g, ry: -Math.PI / 2, cast: false, noInk: true });
    if (!open) { add(new T.PlaneGeometry(d * .7, d * .7), STCOD, w / 2 + st + .006, h * .55, 0, { parent: g, ry: Math.PI / 2, cast: false, noInk: true }); add(new T.PlaneGeometry(.6, .4), AIRMAIL, w / 2 + st + .008, h * .2, .35, { parent: g, ry: Math.PI / 2, rz: -.05, cast: false, noInk: true }); }
    g.userData.top = top; return g; }
  // provisiones dentro de la caja (latas, linterna, dos botellas, manta y almohada)
  function supplies(parent, x, y, z) { const g = new T.Group(); g.position.set(x, y, z); parent.add(g);
    const canT = tex(256, 128, (gg, w, h) => { gg.fillStyle = '#c42e2c'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#f3f2ee'; gg.fillRect(0, h * .3, w, h * .4); gg.fillStyle = '#1b1720'; gg.font = FONT(900, 34); gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText('JUDÍAS', w / 2, h / 2); });
    const canM = STD({ map: canT, roughness: .4, metalness: .3 });
    [[-.42, .5], [-.28, .62], [-.5, .32]].forEach(([cx, cz], i) => add(new T.CylinderGeometry(.09, .09, .2, 18), canM, cx, .1 + (i === 1 ? .2 : 0), cz, { parent: g }));
    const bottle = (bx, bz, col, op) => { const b = new T.Group(); b.position.set(bx, 0, bz); g.add(b); const M = STD({ color: col, roughness: .08, metalness: .1, transparent: true, opacity: op, envMapIntensity: 1.6 });
      add(new T.CylinderGeometry(.1, .1, .36, 20), M, 0, .18, 0, { parent: b }); add(new T.CylinderGeometry(.04, .09, .12, 16), M, 0, .42, 0, { parent: b }); add(new T.CylinderGeometry(.045, .045, .05, 12), STD({ color: '#3a2a1e' }), 0, .5, 0, { parent: b }); return b; };
    g.userData.b1 = bottle(-.52, -.5, '#8fc8e8', .55); g.userData.b2 = bottle(-.3, -.6, '#e8d88a', .6);
    const blanket = add(RB(.9, .16, .7, .07), STD({ color: '#6a3a4a', roughness: 1 }), -.12, .08, .25, { parent: g, ry: .2 });
    add(RB(.5, .2, .34, .1), STD({ color: '#efe8d6', roughness: 1 }), -.5, .34, 0, { parent: g, rz: .25 });
    return g; }

  // ---------- ZONA «aire»: el avión en corte sobre un mar de nubes ----------
  const AIR = zone('aire', 'aire', 'aireNoche');
  const SKYAIR = new T.Mesh(new T.SphereGeometry(1900, 48, 24), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: new T.Vector3(.62, .32, .72).normalize() } },
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform vec3 sun; varying vec3 vd; void main(){ float h=vd.y; vec3 top=vec3(.07,.27,.72), mid=vec3(.27,.56,.93), hor=vec3(.74,.86,.98);
      vec3 c=h>.06?mix(mid,top,smoothstep(.06,.7,h)):mix(hor,mid,smoothstep(-.1,.06,h)); float s=max(dot(vd,sun),0.); c=mix(c,vec3(1.,.82,.58),pow(s,6.)*.55*(1.-smoothstep(0.,.5,h))); c+=vec3(1.,.92,.75)*pow(s,180.)*2.;
      gl_FragColor=vec4(c,1.); }` }));
  SKYAIR.frustumCulled = false; AIR.add(SKYAIR); SKYAIR.userData.noInk = true;
  const PLN = new T.Group(); AIR.add(PLN); const PL = makePlane(PLN, true);
  // cabina: suelo, filas de asientos y moqueta; bodega: suelo, red de carga, maletas, sacas y la caja
  { const chord = y => Math.sqrt(Math.max(0, (R_F - .15) ** 2 - y * y));
    const cw = chord(FLOOR_Y); add(RB(cw * 2, .22, LCUT1 - LCUT0 - .1, .02), STD({ color: '#5a5a62', roughness: .8 }), 0, FLOOR_Y - .11, (LCUT0 + LCUT1) / 2, { parent: PLN });
    add(new T.BoxGeometry(.18, .26, LCUT1 - LCUT0 - .1), CUTM, cw - .09, FLOOR_Y - .11, (LCUT0 + LCUT1) / 2, { parent: PLN });
    const carpet = add(new T.PlaneGeometry(cw * 2 - .2, LCUT1 - LCUT0 - .2), STD({ map: tex(256, 512, (g, w, h) => { g.fillStyle = '#2f4a7a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 14; i++) { g.fillStyle = 'rgba(232,184,48,.35)'; g.fillRect(0, i * h / 14, w, 4); } noise(g, w, h, 4000, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.05)']); }), roughness: 1 }), 0, FLOOR_Y + .005, (LCUT0 + LCUT1) / 2, { parent: PLN, rx: -Math.PI / 2, cast: false, noInk: true });
    const seatM = STD({ color: '#2a5a9a', roughness: .8 }), seatD = STD({ color: '#1e3e6e', roughness: .8 }), headM = STD({ color: '#f3f2ee', roughness: .9 });
    for (let r = 0; r < 4; r++) { const z = LCUT0 + 1.4 + r * 3.0; [[-1.95, -1.15], [.55, 1.35]].forEach(pair => pair.forEach(x => { const S = new T.Group(); S.position.set(x, FLOOR_Y, z); PLN.add(S);
      add(RB(.72, .2, .66, .06), seatM, 0, .55, 0, { parent: S }); add(RB(.72, 1.05, .2, .08), seatD, 0, 1.12, -.36, { parent: S, rx: -.12 }); add(RB(.56, .22, .06, .04), headM, 0, 1.56, -.43, { parent: S, rx: -.12 });
      [-1, 1].forEach(sd => add(RB(.08, .14, .6, .03), seatD, sd * .38, .78, -.02, { parent: S })); add(RB(.6, .4, .5, .03), STD({ color: '#3a3a42' }), 0, .25, 0, { parent: S }); })); }
    // portaequipajes con luces
    add(RB(.9, .35, LCUT1 - LCUT0 - .3, .05), STD({ color: '#e0d6bd', roughness: .7 }), -2.25, 2.25, (LCUT0 + LCUT1) / 2, { parent: PLN });
    // bodega
    const hw = chord(HOLD_Y); add(RB(hw * 2, .16, LCUT1 - LCUT0 - .1, .02), PBR(planksPBR('#6a5a48', 8, 512), { roughness: .9, bump: 1.5 }), 0, HOLD_Y - .08, (LCUT0 + LCUT1) / 2, { parent: PLN });
    add(new T.BoxGeometry(.18, .2, LCUT1 - LCUT0 - .1), CUTM, hw - .09, HOLD_Y - .08, (LCUT0 + LCUT1) / 2, { parent: PLN });
    // costillas del fuselaje dentro de la bodega
    for (let z = LCUT0 + .7; z < LCUT1; z += 1.4) { const g = new T.TorusGeometry(R_F - .2, .07, 6, 64, THL); const m = add(g, STD({ color: '#8a9098', metalness: .5, roughness: .4 }), 0, 0, z, { parent: PLN }); m.rotation.z = TH0 - Math.PI / 2; }
  }
  const CR = crate(PLN, .45, HOLD_Y, 1.0, 0, true); const SUP = supplies(CR, 0, .07, 0);
  // maletas y sacas alrededor (detrás y a los lados de la caja, sin taparla)
  [[-1.05, 3.4, .8, .62, .5, 1, .3], [-.9, -1.3, .9, .7, .52, 0, -.2], [.55, 3.6, .78, .58, .45, 2, .1], [.6, -1.6, .7, .5, .42, 3, -.4], [-1.05, 3.4 + .05, .7, .5, .46, 4, .2, .62], [.2, 5.6, .9, .66, .5, 5, .5], [-.9, 5.8, .8, .6, .5, 6, -.3], [.1, -3.8, .9, .66, .5, 0, .2], [-1.0, -3.6, .8, .6, .5, 2, -.2]]
    .forEach(([x, z, w, h, d, c, ry, yo]) => suitcase(PLN, x, HOLD_Y + (yo || 0), z, w, h, d, LEATHER[c], ry));
  [[.9, -2.8, 1.1], [-.4, -2.6, .9], [1.0, 4.9, 1.0], [-.2, 6.9, 1.1]].forEach(([x, z, s]) => mailSack(PLN, x, HOLD_Y, z, s, x));
  // red de carga tendida detrás
  { const pts = []; for (let i = 0; i <= 10; i++) { pts.push(-1.5, HOLD_Y + .1, -4.8 + i * .9, -1.5, HOLD_Y + 2.0, -4.8 + i * .9); } for (let j = 0; j <= 6; j++) { const y = HOLD_Y + .1 + j * .32; pts.push(-1.5, y, -4.8, -1.5, y, 4.2); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pts, 3)); PLN.add(new T.LineSegments(g, new T.LineBasicMaterial({ color: '#3a3a30' }))); }
  // luces de la cabina (cálidas) y de la bodega (fría, tenue) + la linterna de Reg (cálida, dentro de la caja)
  const cabL = new T.PointLight('#ffe8c8', 0, 9, 1.4); cabL.position.set(-.6, 2.2, 1); PLN.add(cabL);
  const holdL = new T.PointLight('#a8c0ff', 0, 7, 1.6); holdL.position.set(-.5, HOLD_Y + 2.0, 1); PLN.add(holdL);
  const torchL = new T.PointLight('#ffd08a', 0, 3.2, 1.8); torchL.position.set(.65, HOLD_Y + .95, 1.15); PLN.add(torchL);
  // mar de nubes (instanciado) que corre hacia atrás
  const CLOUDSEA = (() => { const geo = new T.SphereGeometry(1, 12, 8), M = STD({ color: '#ffffff', roughness: 1, emissive: '#cfdcff', emissiveIntensity: .22 }); const base = [];
    // ~170 cúmulos hechos de bolas (más altos en el centro), repartidos en 1200 × 1200 m, 45 m por debajo del avión
    for (let c = 0; c < 170; c++) { const cx = (rnd() - .5) * 1200, cz = (rnd() - .5) * 1200, R0 = 10 + rnd() * 22, n = 10 + Math.floor(rnd() * 10);
      for (let k = 0; k < n; k++) { const a = rnd() * 6.283, d = Math.sqrt(rnd()) * R0, s = (5 + rnd() * 9) * (1.25 - d / R0 * .5); base.push([cx + Math.cos(a) * d, -48 + (1 - d / R0) * R0 * .45 + rnd() * 3, cz + Math.sin(a) * d * .8, s * 1.15, s * .7, s]); } }
    // manto bajo y continuo
    for (let k = 0; k < 700; k++) { const s = 14 + rnd() * 18; base.push([(rnd() - .5) * 1300, -56 - rnd() * 4, (rnd() - .5) * 1300, s * 1.4, s * .35, s * 1.4]); }
    const im = new T.InstancedMesh(geo, M, base.length); im.castShadow = false; im.receiveShadow = false; AIR.add(im);
    const m4 = new T.Matrix4(), q = new T.Quaternion(), v = new T.Vector3(), sc = new T.Vector3();
    const set = t => { base.forEach(([x, y, z, sx, sy, sz], i) => { const zz = ((z - t * 38) % 1300 + 1950) % 1300 - 650; v.set(x, y, zz); sc.set(sx, sy, sz); m4.compose(v, q, sc); im.setMatrixAt(i, m4); }); im.instanceMatrix.needsUpdate = true; };
    set(0); return { set, im }; })();
  TICK.push(t => { CLOUDSEA.set(t); });

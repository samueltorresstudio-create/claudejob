
  // =====================================================================================================
  // JUZGADO (JX = -150): sala de vistas. Estrado al fondo (z < -4.4) mirando a +z; banquillo a la derecha; público detrás de la barandilla (z > 0.9).
  // =====================================================================================================
  const JX = -150, JH = 5.5;
  const inJ = p => Math.abs(p.x - JX) < 8 && Math.abs(p.z) < 8;
  { const X = JX;
    floorXZ(X - 7, X + 7, -7, 7, .001, STD({ map: planksT('#9a6a3e', 10), roughness: .6 }), 3);
    floorXZ(X - 7, X + 7, -7, 7, JH, MAT.cream, 3, { down: true });
    // paredes: yeso crema arriba + zócalo de paneles de madera (2,3 m)
    wallXY(X - 7, X + 7, 0, JH, -7, MAT.cream, 3); wallXY(X - 7, X + 7, 0, JH, 7, MAT.cream, 3, { ry: Math.PI });
    wallZY(-7, 7, 0, JH, X - 7, MAT.cream, 3, -1); wallZY(-7, 7, 0, JH, X + 7, MAT.cream, 3, 1);
    BX(X - 7, X + 7, 0, 2.3, -7, -6.92, MAT.woodPanel, { cast: false }); BX(X - 7, X + 7, 0, 2.3, 6.92, 7, MAT.woodPanel, { cast: false });
    BX(X - 7, X - 6.92, 0, 2.3, -7, 7, MAT.woodPanel, { cast: false }); BX(X + 6.92, X + 7, 0, 2.3, -7, 7, MAT.woodPanel, { cast: false });
    BX(X - 7, X + 7, 2.3, 2.4, -6.95, -6.86, MAT.woodDk); BX(X - 7, X + 7, 2.3, 2.4, 6.86, 6.95, MAT.woodDk); BX(X - 6.95, X - 6.86, 2.3, 2.4, -7, 7, MAT.woodDk); BX(X + 6.86, X + 6.95, 2.3, 2.4, -7, 7, MAT.woodDk);
    // techo artesonado
    for (let k = -2; k <= 2; k++) { BX(X - 7, X + 7, JH - .25, JH, k * 2.8 - .1, k * 2.8 + .1, MAT.woodDk); BX(X + k * 2.8 - .1, X + k * 2.8 + .1, JH - .25, JH, -7, 7, MAT.woodDk); }
    // alfombra roja por el pasillo central
    add(RB(1.3, .02, 6.2, .01), STD({ color: '#8a2430', roughness: 1 }), X, .012, 3.95, { cast: false });
    add(RB(1.36, .021, .06, .005), MAT.brass, X, .013, .88, { cast: false });
    // --- estrado ---
    BX(X - 2.9, X + 2.9, 0, .6, -7, -4.4, MAT.woodDk); BX(X - 2.9, X + 2.9, .6, .64, -7, -4.4, STD({ color: '#6a2a30', roughness: 1 }), { cast: false });
    BX(X - 2.7, X + 2.7, .6, 1.75, -4.78, -4.56, MAT.woodPanel); BX(X - 2.8, X + 2.8, 1.75, 1.84, -5.55, -4.46, MAT.woodDk);
    [-2.7, 2.7].forEach(sx => BX(X + sx - .1, X + sx + .1, .6, 1.75, -5.5, -4.56, MAT.woodPanel));
    for (let k = -2; k <= 2; k++) BX(X + k * 1.08 - .07, X + k * 1.08 + .07, .62, 1.72, -4.58, -4.5, MAT.woodDk);
    // placa con el nombre del juez
    sign(1.5, .3, 120, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f2d27a'); gr.addColorStop(1, '#b8892a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = '#5a3a08'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8); txt(g, 'JUEZ  R. MORA', w / 2, h / 2 + 2, 66, '#3a2604', 900); }, X, 1.4, -4.47, { d: .03 });
    // sillón del juez
    { const chM = STD({ map: tex(128, 256, (g, w, h) => { g.fillStyle = '#5a1620'; g.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) for (let j = 0; j < 7; j++) { const x = 16 + i * 32 + (j % 2) * 16, y = 18 + j * 34; const gr = g.createRadialGradient(x, y, 1, x, y, 16); gr.addColorStop(0, 'rgba(0,0,0,.45)'); gr.addColorStop(1, 'rgba(255,200,200,.06)'); g.fillStyle = gr; g.fillRect(x - 16, y - 16, 32, 32); g.fillStyle = '#d8a640'; g.beginPath(); g.arc(x, y, 2.5, 0, 7); g.fill(); } }), roughness: .9 });
    BX(X - .5, X + .5, .64, 2.55, -6.4, -6.18, chM, { r: .1 }); BX(X - .5, X + .5, .64, 1.15, -6.3, -5.6, chM, { r: .08 }); BX(X - .58, X + .58, 2.45, 2.62, -6.45, -6.12, MAT.woodDk, { r: .06 }); }
    // escudo de la justicia (balanza) entre cortinas
    sign(1.9, 1.9, 512, (g, w, h) => { g.fillStyle = '#7a4a22'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 4, 0, 7); g.fill(); g.lineWidth = 16; g.strokeStyle = '#d8a640'; g.stroke(); g.fillStyle = '#efe0b8'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 40, 0, 7); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
      g.strokeStyle = '#8a5a12'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(w / 2, 120); g.lineTo(w / 2, 370); g.moveTo(140, 170); g.lineTo(372, 170); g.moveTo(190, 400); g.lineTo(322, 400); g.stroke();
      [[150, 170], [362, 170]].forEach(([x, y]) => { g.lineWidth = 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 40, y + 100); g.moveTo(x, y); g.lineTo(x + 40, y + 100); g.stroke(); g.fillStyle = '#d8a640'; g.beginPath(); g.ellipse(x, y + 104, 54, 16, 0, 0, 7); g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); g.strokeStyle = '#8a5a12'; });
      g.fillStyle = '#d8a640'; g.beginPath(); g.arc(w / 2, 112, 18, 0, 7); g.fill(); txt(g, 'JUSTICIA', w / 2, 450, 40, '#5a3a12', 900); }, X, 4.05, -6.9, { d: .06 });
    [-1, 1].forEach(sd => { const cur = tex(128, 512, (g, w, h) => { g.fillStyle = '#9a2430'; g.fillRect(0, 0, w, h); for (let k = 0; k < 6; k++) { const gr = g.createLinearGradient(k * w / 6, 0, (k + 1) * w / 6, 0); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(.5, 'rgba(255,190,190,.18)'); gr.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = gr; g.fillRect(k * w / 6, 0, w / 6, h); } });
      add(RB(1.3, 4.3, .18, .06), STD({ map: cur, roughness: 1 }), X + sd * 2.3, 3.2, -6.84); add(new T.CylinderGeometry(.04, .04, 1.6, 8), MAT.brass, X + sd * 2.3, 5.38, -6.8, { rz: Math.PI / 2 });
      add(new T.SphereGeometry(.09, 10, 8), MAT.brass, X + sd * 1.7, 2.2, -6.7); add(new T.ConeGeometry(.08, .3, 8), STD({ color: '#d8a640' }), X + sd * 1.7, 2.0, -6.7); });
    // reloj y carteles «SILENCIO»
    const clockFace = (g, w, h, hh = 10, mm = 10) => { g.fillStyle = '#f6f0e0'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 6, 0, 7); g.fill(); g.lineWidth = 14; g.strokeStyle = INK; g.stroke(); for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; g.lineWidth = k % 3 ? 5 : 10; g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * (w / 2 - 22), h / 2 - Math.cos(a) * (w / 2 - 22)); g.lineTo(w / 2 + Math.sin(a) * (w / 2 - 40), h / 2 - Math.cos(a) * (w / 2 - 40)); g.stroke(); }
      const ah = (hh % 12 + mm / 60) / 12 * 6.283, am = mm / 60 * 6.283; g.lineCap = 'round'; g.lineWidth = 12; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.sin(ah) * w * .24, h / 2 - Math.cos(ah) * w * .24); g.stroke(); g.lineWidth = 7; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.sin(am) * w * .36, h / 2 - Math.cos(am) * w * .36); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(w / 2, h / 2, 10, 0, 7); g.fill(); };
    add(new T.CylinderGeometry(.42, .42, .08, 32), STD({ map: tex(256, 256, (g, w, h) => clockFace(g, w, h, 10, 10)) }), X + 4.6, 3.9, -6.9, { rx: Math.PI / 2 });
    const silencio = (x, y, z, ry) => sign(1.7, .5, 140, (g, w, h) => { g.fillStyle = '#3a2414'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d8a640'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'SILENCIO', w / 2, h / 2 + 4, 92, '#f2d27a', 900); }, x, y, z, { ry });
    silencio(X - 4.6, 3.75, -6.9, 0); silencio(X + 6.88, 3.4, 2.6, -Math.PI / 2);
    // contador «CONDENA» sobre el estrado (tarjetas que pasan): W2.setCondena(n, k)
    var condena = signTex(320, 200); add(RB(.62, .4, .14, .03), MAT.woodDk, X + 1.55, 2.04, -4.75); add(new T.PlaneGeometry(.56, .35), STD({ map: condena.t, roughness: .6 }), X + 1.55, 2.04, -4.675, { cast: false, noInk: true });
    // mazo (taco), lámpara verde de banquero, papeles, jarra
    add(new T.CylinderGeometry(.16, .17, .07, 20), MAT.woodDk, X + .78, 1.88, -4.95);
    { const lp = new T.Group(); lp.position.set(X + 2.25, 1.84, -5.15); scene.add(lp); add(new T.CylinderGeometry(.03, .03, .4, 8), MAT.brass, 0, .2, 0, { parent: lp }); add(new T.CylinderGeometry(.1, .12, .04, 16), MAT.brass, 0, .02, 0, { parent: lp });
      add(new T.CylinderGeometry(.1, .24, .14, 20, 1, true, 0, Math.PI), STD({ color: '#1f6a3a', emissive: '#1f6a3a', emissiveIntensity: .4, side: T.DoubleSide }), 0, .42, 0, { parent: lp, rz: Math.PI / 2, ry: Math.PI / 2 }); }
    for (let k = 0; k < 5; k++) add(RB(.5, .012, .65, .002), STD({ color: k % 2 ? '#f4f0e4' : '#ece4d0' }), X - .2 + k * .03, 1.85 + k * .013, -5.05, { ry: (k - 2) * .06, noInk: true });
    add(new T.CylinderGeometry(.07, .08, .24, 14), STD({ color: '#cfe8f0', transparent: true, opacity: .55, roughness: .1 }), X + .55, 1.96, -5.15);
    // estrado de testigos y mesa del secretario con máquina de escribir
    BX(X - 5.0, X - 3.6, 0, .35, -5.4, -3.9, MAT.woodDk); BX(X - 5.0, X - 3.6, .35, 1.4, -3.98, -3.9, MAT.woodPanel); BX(X - 3.68, X - 3.6, .35, 1.4, -5.4, -3.9, MAT.woodPanel); BX(X - 5.05, X - 3.55, 1.4, 1.46, -5.45, -3.86, MAT.woodDk);
    BX(X - 5.2, X - 3.4, .75, .82, -2.9, -2.0, MAT.woodDk); BX(X - 5.15, X - 3.45, 0, .75, -2.85, -2.8, MAT.woodPanel);
    { const tw = new T.Group(); tw.position.set(X - 4.3, .82, -2.45); scene.add(tw); add(RB(.5, .16, .36, .04), STD({ color: '#2a2c30', metalness: .3, roughness: .4 }), 0, .08, 0, { parent: tw }); add(new T.CylinderGeometry(.04, .04, .56, 12), MAT.black, 0, .2, -.12, { parent: tw, rz: Math.PI / 2 });
      add(RB(.36, .005, .32, .002), MAT.white, 0, .3, -.18, { parent: tw, rx: -.5, noInk: true }); for (let k = 0; k < 12; k++) add(new T.CylinderGeometry(.018, .018, .02, 8), MAT.white, -.16 + (k % 6) * .064, .17, .06 + Math.floor(k / 6) * .06, { parent: tw, noInk: true }); }
    for (let k = 0; k < 3; k++) add(RB(.34, .08, .46, .01), STD({ color: ['#c8a050', '#7a8a9a', '#b85a3a'][k] }), X - 3.75, .86 + k * .085, -2.2, { ry: k * .2 - .2 });
    // banquillo del acusado con barandilla de latón (el preso mira al juez, -z)
    var DK = { x0: X + 2.6, x1: X + 4.2, z0: -2.3, z1: -1.1 };
    BX(DK.x0, DK.x1, 0, .12, DK.z0, DK.z1, MAT.woodDk);
    BX(DK.x0, DK.x1, .12, 1.0, DK.z0, DK.z0 + .1, MAT.woodPanel); BX(DK.x0, DK.x0 + .1, .12, 1.0, DK.z0, DK.z1, MAT.woodPanel); BX(DK.x1 - .1, DK.x1, .12, 1.0, DK.z0, DK.z1, MAT.woodPanel);
    BX(DK.x0 - .03, DK.x1 + .03, 1.0, 1.05, DK.z0 - .03, DK.z0 + .13, MAT.woodDk); BX(DK.x0 - .03, DK.x0 + .13, 1.0, 1.05, DK.z0, DK.z1, MAT.woodDk); BX(DK.x1 - .13, DK.x1 + .03, 1.0, 1.05, DK.z0, DK.z1, MAT.woodDk);
    add(new T.CylinderGeometry(.035, .035, 1.6, 12), MAT.brass, (DK.x0 + DK.x1) / 2, 1.2, DK.z0 + .05, { rz: Math.PI / 2 }); [DK.x0 + .05, DK.x1 - .05].forEach(x => { add(new T.CylinderGeometry(.035, .035, 1.2, 12), MAT.brass, x, 1.2, (DK.z0 + DK.z1) / 2, { rx: Math.PI / 2 }); [DK.z0 + .05, DK.z1 - .05].forEach(z => add(new T.CylinderGeometry(.03, .03, .2, 10), MAT.brass, x, 1.12, z)); });
    add(new T.CylinderGeometry(.03, .03, .2, 10), MAT.brass, (DK.x0 + DK.x1) / 2, 1.12, DK.z0 + .05);
    // mesa del abogado con sillas
    BX(X - 2.0, X + .2, .74, .8, -1.7, -.8, MAT.woodDk); [[-1.95, -1.65], [.15, -1.65], [-1.95, -.85], [.15, -.85]].forEach(([a, b]) => BX(X + a - .04, X + a + .04, 0, .74, b - .04, b + .04, MAT.woodDk));
    [-1.4, -.4].forEach(a => { BX(X + a - .22, X + a + .22, .44, .5, -.6, -.18, MAT.woodDk); BX(X + a - .22, X + a + .22, .5, 1.05, -.2, -.15, MAT.woodDk); });
    add(RB(.42, .1, .3, .03), STD({ color: '#5a3a22' }), X - 1.2, .85, -1.3); for (let k = 0; k < 3; k++) add(RB(.3, .01, .4, .002), MAT.white, X - .5 + k * .05, .81 + k * .01, -1.2, { ry: k * .3, noInk: true });
    // barandilla que separa al público (z = 0.9) con hueco en el centro
    [[-6.95, -.7], [.7, 6.95]].forEach(([a, b]) => { BX(X + a, X + b, .9, .98, .84, .96, MAT.woodDk); BX(X + a, X + b, 0, .08, .84, .96, MAT.woodDk); for (let x = a + .1; x < b; x += .22) add(new T.CylinderGeometry(.035, .04, .82, 8), MAT.woodLt, X + x, .49, .9); });
    // bancos del público (4 filas)
    [2.2, 3.5, 4.8, 6.1].forEach(z => [[-6.4, -.9], [.9, 6.4]].forEach(([a, b]) => { BX(X + a, X + b, .42, .48, z - .22, z + .22, MAT.wood); BX(X + a, X + b, .48, 1.0, z + .2, z + .26, MAT.wood);
      [a + .1, (a + b) / 2, b - .1].forEach(x => BX(X + x - .04, X + x + .04, 0, .42, z - .18, z + .18, MAT.woodDk)); }));
    // ventanas altas a la izquierda (ciudad) con cortinas
    [-3.6, 0, 3.6].forEach(z => { paintedWin(X - 6.9, 2.95, z, 1.5, 2.6, Math.PI / 2, cityView, .95, MAT.woodDk); BX(X - 6.92, X - 6.6, 1.55, 1.62, z - .9, z + .9, MAT.woodDk);
      [-1, 1].forEach(sd => add(RB(.12, 3.3, .45, .05), MAT.velvet, X - 6.82, 3.35, z + sd * 1.0)); });
    // pared derecha: retratos, librería, puerta a calabozos, extintor, radiador
    const portrait = (x, y, z, cols) => sign(.9, 1.15, 300, (g, w, h) => { g.fillStyle = cols[0]; g.fillRect(0, 0, w, h); g.fillStyle = '#efe0c8'; g.beginPath(); g.arc(w / 2, h * .38, w * .26, 0, 7); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
      g.fillStyle = INK; g.beginPath(); g.ellipse(w / 2 - 26, h * .36, 9, 12, 0, 0, 7); g.ellipse(w / 2 + 26, h * .36, 9, 12, 0, 0, 7); g.fill(); g.fillStyle = cols[1]; g.beginPath(); g.moveTo(w / 2 - 50, h * .48); g.quadraticCurveTo(w / 2, h * .42, w / 2 + 50, h * .48); g.lineTo(w / 2 + 40, h * .54); g.quadraticCurveTo(w / 2, h * .5, w / 2 - 40, h * .54); g.fill();
      g.fillStyle = '#1b1720'; g.fillRect(w * .18, h * .62, w * .64, h * .38); g.fillStyle = '#f4f2ec'; g.beginPath(); g.moveTo(w / 2 - 30, h * .62); g.lineTo(w / 2, h * .72); g.lineTo(w / 2 + 30, h * .62); g.fill(); g.strokeStyle = '#d8a640'; g.lineWidth = 22; g.strokeRect(0, 0, w, h); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); }, x, y, z, { ry: -Math.PI / 2, d: .06 });
    portrait(X + 6.9, 3.6, -4.6, ['#5a6a7a', '#e8e4dc']); portrait(X + 6.9, 3.6, -2.8, ['#6a5a4a', '#a8a090']); portrait(X + 6.9, 3.6, -1.0, ['#4a5a4a', '#d8c8a0']);
    { const bc = new T.Group(); bc.position.set(X + 6.7, 0, 4.8); scene.add(bc); add(RB(.5, 2.4, 1.8, .03), MAT.woodDk, 0, 1.2, 0, { parent: bc });
      for (let r = 0; r < 4; r++) for (let j = 0; j < 12; j++) add(RB(.3, .36 + rnd() * .06, .1, .01), STD({ color: ['#7a2a2a', '#2a3a5a', '#3a5a3a', '#8a6a2a', '#5a3a5a'][(r * 3 + j) % 5] }), -.08, .32 + r * .56, -.75 + j * .135, { parent: bc, noInk: true }); }
    BX(X + 6.88, X + 6.95, 0, 2.6, 1.8, 3.1, MAT.woodDk); sign(1.0, .26, 90, (g, w, h) => { g.fillStyle = '#2a3a2a'; g.fillRect(0, 0, w, h); txt(g, 'CALABOZOS', w / 2, h / 2 + 3, 58, '#f2efe6', 900); }, X + 6.86, 2.85, 2.45, { ry: -Math.PI / 2, d: .03 });
    add(new T.CylinderGeometry(.09, .09, .5, 14), MAT.red, X + 6.7, .45, -6.2); add(new T.CylinderGeometry(.03, .05, .12, 8), MAT.black, X + 6.7, .74, -6.2);
    for (let k = 0; k < 9; k++) BX(X + 6.7, X + 6.82, .2, .85, -.3 + k * .1, -.25 + k * .1, STD({ color: '#d8d4c8', metalness: .2 }));
    // pared del fondo de la sala: puertas dobles, tablón, perchero, salida
    BX(X - 1.0, X + 1.0, 0, 2.7, 6.86, 6.92, MAT.woodPanel); BX(X - .03, X + .03, 0, 2.7, 6.84, 6.86, MAT.woodDk); [-.15, .15].forEach(x => add(new T.SphereGeometry(.05, 8, 6), MAT.brass, X + x, 1.2, 6.82));
    sign(.9, .26, 80, (g, w, h) => { g.fillStyle = '#1f8a4a'; g.fillRect(0, 0, w, h); txt(g, 'SALIDA', w / 2, h / 2 + 3, 56, '#fff', 900); }, X, 3.0, 6.88, { ry: Math.PI, glow: .8, d: .03 });
    sign(1.6, 1.1, 260, (g, w, h) => { g.fillStyle = '#b8905a'; g.fillRect(0, 0, w, h); noise(g, w, h, 3000, ['#a07a48', '#c8a070']); [['#fff8e0', 20, 20, 110, 90], ['#e0f0ff', 150, 30, 100, 80], ['#ffe0e0', 270, 16, 90, 110], ['#fff', 60, 130, 120, 100], ['#f0ffe0', 210, 140, 110, 90]].forEach(([c, x, y, a, b]) => { g.fillStyle = c; g.fillRect(x, y, a, b); g.fillStyle = 'rgba(0,0,0,.3)'; for (let k = 0; k < 4; k++) g.fillRect(x + 10, y + 16 + k * 16, a - 20, 4); g.fillStyle = '#c8302e'; g.beginPath(); g.arc(x + a / 2, y + 6, 6, 0, 7); g.fill(); }); g.strokeStyle = '#5a3a1a'; g.lineWidth = 12; g.strokeRect(0, 0, w, h); }, X + 3.6, 1.9, 6.9, { ry: Math.PI, d: .04 });
    { const cr = new T.Group(); cr.position.set(X - 3.6, 0, 6.6); scene.add(cr); add(new T.CylinderGeometry(.03, .04, 1.9, 8), MAT.woodDk, 0, .95, 0, { parent: cr }); add(new T.CylinderGeometry(.2, .22, .04, 12), MAT.woodDk, 0, .02, 0, { parent: cr });
      add(RB(.42, .95, .2, .1), STD({ color: '#5a6a7a' }), .12, 1.4, 0, { parent: cr, rz: -.08 }); add(RB(.36, .8, .2, .1), STD({ color: '#8a5a3a' }), -.12, 1.45, .05, { parent: cr, rz: .1 }); add(new T.CylinderGeometry(.03, .06, .9, 8), MAT.black, .3, .45, .1, { parent: cr, rz: -.2 }); }
    // lámparas de globo colgadas y ventilador de techo
    [-3.5, 0, 3.5].forEach(z => { add(new T.CylinderGeometry(.015, .015, .9, 6), MAT.black, X, JH - .45, z, { noInk: true }); add(new T.SphereGeometry(.26, 18, 14), STD({ color: '#fff4dc', emissive: '#ffd890', emissiveIntensity: 1.4 }), X, JH - 1.0, z, { cast: false }); });
    var FAN = new T.Group(); FAN.position.set(X + 3.5, JH - .5, 2.5); scene.add(FAN); add(new T.CylinderGeometry(.02, .02, .5, 6), MAT.black, 0, .25, 0, { parent: FAN }); add(new T.CylinderGeometry(.14, .12, .14, 14), MAT.brass, 0, 0, 0, { parent: FAN });
    var FANB = new T.Group(); FAN.add(FANB); for (let k = 0; k < 4; k++) { const b = add(RB(.75, .02, .16, .01), MAT.woodDk, .45, -.04, 0, { parent: FANB }); b.position.applyAxisAngle(new T.Vector3(0, 1, 0), k * Math.PI / 2); b.rotation.y = k * Math.PI / 2; }
    // papel de la orden de libertad (3D: va del banquillo a la cámara) — W2.setOrder(k)
    var ORDER = new T.Group(); scene.add(ORDER); var orderC = signTex(600, 800);
    add(new T.PlaneGeometry(.42, .56), STD({ map: orderC.t, roughness: .8, side: T.DoubleSide }), 0, 0, 0, { parent: ORDER, cast: false, noInk: true });
  }
  zoneLight('#ffe2b0', 5.5, 13, JX, 4.3, -3.5, inJ); zoneLight('#ffe2b0', 5.5, 13, JX, 4.3, 0, inJ); zoneLight('#ffe2b0', 5, 13, JX, 4.3, 3.5, inJ);
  zoneLight('#d8e8ff', 4, 14, JX - 5.5, 3, 0, inJ); zoneLight('#ffd6a0', 3.5, 6, JX, 3.2, -4.2, inJ); zoneLight('#9fe0a8', 1.4, 2.5, JX + 2.25, 2.1, -5.0, inJ);
  function drawCondena(n, k) { const g = condena.g, w = 320, h = 200; g.fillStyle = '#2a1c12'; g.fillRect(0, 0, w, h); txt(g, 'CONDENA', w / 2, 26, 30, '#f2d27a', 900);
    const card = (x, d, fl) => { g.save(); g.translate(x, 116); g.scale(1, fl); g.fillStyle = '#f4efe2'; g.fillRect(-58, -66, 116, 132); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(-58, -66, 116, 132); g.beginPath(); g.moveTo(-58, 0); g.lineTo(58, 0); g.stroke(); txt(g, String(d), 0, 4, 112, '#c8243a', 900); g.restore(); };
    card(100, Math.floor(n / 10), 1); const a = n % 10, b = (n + 9) % 10; card(220, k < .5 ? b : a, Math.abs(Math.cos(k * Math.PI))); txt(g, 'AÑOS', w / 2, 188, 22, '#f2d27a', 800); condena.t.needsUpdate = true; }
  drawCondena(0, 1);
  function drawOrder(k) { const g = orderC.g, w = 600, h = 800; paperBg(g, w, h, '#f6f0de'); txt(g, 'JUZGADO DE LO PENAL', w / 2, 70, 34, '#5a4a3a', 800); g.fillStyle = '#5a4a3a'; g.fillRect(60, 100, w - 120, 4);
    txt(g, 'ORDEN', w / 2, 170, 92, INK, 900); txt(g, 'Nº 707', w / 2, 250, 52, '#5a4a3a', 900);
    if (k > 0) { g.fillStyle = 'rgba(120,220,140,.75)'; g.fillRect(48, 318, (w - 96) * Math.min(1, k), 92); }
    txt(g, 'LIBERTAD', w / 2, 366, 96, INK, 900); txt(g, 'ANTICIPADA', w / 2, 452, 62, INK, 900); txt(g, 'EFECTIVA HOY', w / 2, 540, 50, '#c8243a', 900);
    g.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 3; i++) g.fillRect(70, 600 + i * 28, w - 140 - i * 60, 8);
    g.save(); g.translate(430, 700); g.rotate(-.2); g.strokeStyle = '#c8243a'; g.lineWidth = 8; g.beginPath(); g.arc(0, 0, 66, 0, 7); g.stroke(); g.beginPath(); g.arc(0, 0, 50, 0, 7); g.stroke(); txt(g, 'SELLO', 0, 2, 30, '#c8243a', 900); g.restore();
    g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(80, 730); g.bezierCurveTo(130, 690, 150, 760, 200, 720); g.bezierCurveTo(230, 700, 250, 740, 290, 716); g.stroke(); orderC.t.needsUpdate = true; }
  drawOrder(0);


  // =====================================================================================================
  // COMPLEJO (PX = 0): galería de la cárcel, celda del preso, muro exterior, callejón, túnel bajo tierra.
  // Celda del preso: x ∈ [-1.5, 1.5], z ∈ [-3.2, 0]; litera pegada a la pared del fondo (x ∈ [-1.45, .35]); váter al fondo a la derecha;
  // ventanita en el muro exterior (x = 1.5, z ∈ [-2.0, -1.2], y ∈ [1.6, 2.3]); rayas de días en la pared izquierda.
  // Corte (setSection): plano z = ZS. Túnel: y ∈ [-3.1, -1.7], z ∈ [-3.3, ZS], x ∈ [-1.3, 9.4]; pozo de la celda x ∈ [-1.3, -.5]; pozo del banco x ∈ [8.6, 9.4].
  // =====================================================================================================
  const ZS = -2.35, CAPS = new T.Group(); scene.add(CAPS); CAPS.visible = false;
  const capRect = (x0, x1, y0, y1, mat, sc = 2) => { const m = wallXY(x0, x1, y0, y1, ZS - .002, mat, sc, { parent: CAPS }); return m; };
  const inHall = p => p.x > -17 && p.x < 1.6 && p.z > -.05 && p.z < 8.1 && p.y > -.2;
  const inCell = p => p.x > -1.6 && p.x < 1.6 && p.z > -3.3 && p.z < 1.2 && p.y > -.2 && p.y < 3;
  // ---------- galería (hall) ----------
  floorXZ(-16.5, 1.5, -.02, 8, .001, MAT.hallFloor, 3);
  floorXZ(-16.5, 1.5, 0, 8, 7.4, MAT.hallWall, 3, { down: true });
  wallXY(-16.5, 1.5, 6.0, 7.4, -.001, MAT.hallWall, 3); BX(-16.5, 1.5, 2.8, 3.2, -3.2, 0, MAT.concrete, { r: .01 });                          // franja sobre las celdas y forjado del piso de arriba
  wallZY(0, 8, 0, 7.4, -16.5, MAT.hallWall, 3, -1); wallXY(-16.5, 2.3, 0, 7.4, 8, MAT.hallWall, 3, { ry: Math.PI });
  BX(-16.5, 1.5, 0, 1.1, 7.92, 8, MAT.green, { cast: false }); BX(-16.48, -16.4, 0, 1.1, 0, 8, MAT.green, { cast: false });
  for (let k = 0; k < 3; k++) paintedWin(-13 + k * 5, 5.6, 7.93, 1.6, 1.3, Math.PI, skyView, .9, MAT.bars, 5);                              // ventanas altas con barrotes
  [-12, -6, 0].forEach(x => { paintedWin(x - 1.5, 7.39, 4, 2.2, 2.2, 0, skyView, 1.0, MAT.steelDk); });
  scene.children.slice(-3).forEach(g => { g.rotation.x = -Math.PI / 2; g.position.y = 7.38; });                                             // claraboyas
  // celdas de la planta baja y de arriba (la del preso es x = 0, abajo)
  const CELLS = [0, -3, -6, -9, -12, -15];
  const barsDoor = (cx, y0, open) => { const g = new T.Group(); g.position.set(cx, y0, 0); scene.add(g);
    BX(-1.5, 1.5, 0, .1, -.08, .08, MAT.bars, { parent: g }); BX(-1.5, 1.5, 2.7, 2.8, -.08, .08, MAT.bars, { parent: g }); BX(-1.5, 1.5, 1.25, 1.33, -.06, .06, MAT.bars, { parent: g });
    for (let x = -1.42; x <= -.05; x += .17) add(new T.CylinderGeometry(.028, .028, 2.7, 8), MAT.bars, x, 1.4, 0, { parent: g });
    const door = new T.Group(); g.add(door); BX(-.04, 1.46, .1, .18, .04, .14, MAT.bars, { parent: door }); BX(-.04, 1.46, 2.62, 2.7, .04, .14, MAT.bars, { parent: door }); BX(-.04, 1.46, 1.25, 1.33, .05, .13, MAT.bars, { parent: door });
    for (let x = .04; x <= 1.42; x += .17) add(new T.CylinderGeometry(.028, .028, 2.55, 8), MAT.bars, x, 1.4, .09, { parent: door });
    add(RB(.16, .24, .12, .02), MAT.steelDk, 1.32, 1.3, .1, { parent: door }); door.position.x = open ? -1.3 : 0; return { g, door }; };
  const cellShell = (cx, y0, decor) => { if (!(y0 === 0 && decor === 'mine')) BX(cx - 1.5, cx + 1.5, y0 - .001, y0 + .001, -3.2, 0, MAT.concrete, { cast: false });
    wallXY(cx - 1.5, cx + 1.5, y0, y0 + 2.8, -3.2, MAT.cellWall, 2.4); floorXZ(cx - 1.5, cx + 1.5, -3.2, 0, y0 + 2.79, MAT.cellWall, 2.4, { down: true });
    if (decor !== 'mine') floorXZ(cx - 1.5, cx + 1.5, -3.2, 0, y0 + .002, MAT.concrete, 2.4);
    if (cx !== 0) BX(cx + 1.4, cx + 1.6, y0, y0 + 2.8, -3.2, 0, MAT.cellWall, { r: .01 }); else BX(1.4, 1.5, y0 + (y0 ? 0 : 2.8), y0 + 2.8 + (y0 ? 0 : .4), -3.2, 0, MAT.cellWall, { r: .005 });
    if (cx === -15) BX(-16.6, -16.5, y0, y0 + 2.8, -3.2, 0, MAT.cellWall, { r: .005 });
    if (decor && decor !== 'mine') { const col = decor;   // celda vecina: litera, váter, póster y manta de color
      BX(cx - 1.45, cx + .35, y0 + .38, y0 + .5, -3.12, -2.32, MAT.steelDk); BX(cx - 1.42, cx + .32, y0 + .5, y0 + .64, -3.1, -2.34, STD({ color: col, roughness: 1 }), { r: .05 });
      add(new T.CylinderGeometry(.2, .16, .38, 14), MAT.steelShiny, cx + 1.0, y0 + .19, -2.85); add(RB(.42, .5, .14, .04), MAT.steelShiny, cx + 1.0, y0 + .5, -3.12);
      sign(.5, .7, 200, (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); g.fillStyle = '#f4f0e0'; g.beginPath(); g.arc(w / 2, h * .42, 48, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8); }, cx - .6, y0 + 1.7, -3.17, { d: .02 }); } };
  CELLS.forEach((cx, i) => { cellShell(cx, 0, i === 0 ? 'mine' : ['#7a8ab8', '#b87a5a', '#6a9a6a', '#a87ab8', '#c8a050'][i - 1]); cellShell(cx, 3.2, ['#5a7a9a', '#9a5a5a', '#7a9a5a', '#8a6aa8', '#b89a5a', '#5a9a9a'][i]); });
  const MYDOOR = barsDoor(0, 0, false); CELLS.slice(1).forEach(cx => barsDoor(cx, 0, false)); CELLS.forEach(cx => barsDoor(cx, 3.2, false));
  // números pintados encima de cada celda
  CELLS.forEach((cx, i) => [0, 3.2].forEach((y, j) => sign(.5, .26, 80, (g, w, h) => { g.fillStyle = '#f2e6c0'; g.fillRect(0, 0, w, h); txt(g, String(j * 6 + i + 1).padStart(2, '0'), w / 2, h / 2 + 3, 58, '#2a2a2a', 900); }, cx + 1.1, y + 2.95, .02, { d: .02 })));
  // pasarela del piso de arriba con barandilla y columnas
  BX(-16.5, 1.5, 3.0, 3.2, 0, 1.4, MAT.concrete); for (let x = -16.3; x <= 1.4; x += .3) add(new T.CylinderGeometry(.018, .018, 1.0, 6), MAT.bars, x, 3.7, 1.35);
  [3.7, 4.2].forEach(y => add(new T.CylinderGeometry(.03, .03, 18, 8), MAT.bars, -7.5, y, 1.35, { rz: Math.PI / 2 })); [-15, -9, -3].forEach(x => BX(x - .12, x + .12, 0, 3.0, 1.23, 1.47, MAT.bars));
  // escalera metálica al fondo
  for (let k = 0; k < 14; k++) BX(-16.3, -15.2, k * .228, k * .228 + .05, 6.6 - k * .36, 6.9 - k * .36, MAT.steelDk);
  // garita de los guardias (cristal delante) x ∈ [-6.6, -2.4], z ∈ [5, 7.8]
  const BOOTH = { x0: -6.6, x1: -2.4, z0: 5.0, z1: 7.8 };
  { const B = BOOTH; BX(B.x0, B.x1, 2.6, 2.75, B.z0, B.z1, MAT.steelDk); BX(B.x0, B.x0 + .1, 0, 2.6, B.z0, B.z1, MAT.steelDk); BX(B.x1 - .1, B.x1, 0, 2.6, B.z0, B.z1, MAT.steelDk);
    BX(B.x0, B.x1, 0, 1.0, B.z0, B.z0 + .1, MAT.steelDk); BX(B.x0, B.x1, 1.0, 1.06, B.z0 - .05, B.z0 + .15, MAT.steelDk); [-5.2, -3.8].forEach(x => BX(x - .04, x + .04, 1.0, 2.6, B.z0, B.z0 + .08, MAT.steelDk));
    add(new T.PlaneGeometry(B.x1 - B.x0 - .2, 1.5), STD({ color: '#bfe0f0', transparent: true, opacity: .18, roughness: .05 }), (B.x0 + B.x1) / 2, 1.8, B.z0 + .04, { cast: false, noInk: true });
    sign(1.3, .32, 100, (g, w, h) => { g.fillStyle = '#2a3a4a'; g.fillRect(0, 0, w, h); txt(g, 'GUARDIA', w / 2, h / 2 + 3, 66, '#f2efe6', 900); }, (B.x0 + B.x1) / 2, 2.95, B.z0 + .02, { d: .04 });
    BX(B.x0 + .1, B.x1 - .1, .76, .82, 7.0, 7.7, MAT.woodDk); BX(B.x0 + .15, B.x1 - .15, 0, .76, 7.6, 7.7, MAT.woodDk);
    // monitores de vigilancia (cuadrícula) y llavero
    var CCTV = signTex(512, 256); add(RB(1.6, .8, .2, .03), MAT.black, -4.5, 1.65, 7.65); add(new T.PlaneGeometry(1.5, .72), new T.MeshBasicMaterial({ map: CCTV.t, toneMapped: false }), -4.5, 1.65, 7.54, { cast: false, noInk: true, ry: Math.PI });
    { const kr = new T.Group(); kr.position.set(-3.1, 1.7, 7.76); scene.add(kr); add(RB(.6, .4, .04, .01), MAT.woodLt, 0, 0, 0, { parent: kr }); for (let k = 0; k < 6; k++) { add(new T.TorusGeometry(.04, .01, 6, 12), MAT.brass, -.22 + k * .09, .05, -.04, { parent: kr }); add(RB(.02, .1, .01, .004), MAT.brass, -.22 + k * .09, -.04, -.04, { parent: kr, noInk: true }); } }
    var BOOTHCLOCK = signTex(256, 256); add(new T.CylinderGeometry(.22, .22, .05, 24), STD({ map: BOOTHCLOCK.t }), -5.9, 2.15, 7.76, { rx: Math.PI / 2, ry: Math.PI });
    add(new T.CylinderGeometry(.06, .07, .3, 12), STD({ color: '#c8302e' }), -5.5, .97, 7.3); add(new T.CylinderGeometry(.045, .04, .1, 10), STD({ color: '#f2efe6' }), -3.4, .87, 7.2); add(new T.CylinderGeometry(.045, .04, .1, 10), STD({ color: '#2f6fbf' }), -3.7, .87, 7.35);
    add(RB(.4, .02, .3, .005), STD({ map: tex(128, 96, (g, w, h) => { g.fillStyle = '#efe8d8'; g.fillRect(0, 0, w, h); g.fillStyle = '#333'; g.fillRect(8, 8, w - 16, 14); for (let k = 0; k < 6; k++) g.fillRect(8, 30 + k * 10, w * .4, 4); g.fillStyle = '#7a8a9a'; g.fillRect(w * .55, 30, w * .35, 50); }) }), -4.6, .83, 7.3, { ry: .2, noInk: true });
    { const lp = new T.Group(); lp.position.set(-6.0, .82, 7.35); scene.add(lp); add(new T.CylinderGeometry(.08, .1, .04, 12), MAT.black, 0, .02, 0, { parent: lp }); add(new T.CylinderGeometry(.015, .015, .45, 6), MAT.black, .05, .25, 0, { parent: lp, rz: -.3 }); add(new T.ConeGeometry(.13, .16, 14, 1, true), STD({ color: '#d8302e', side: T.DoubleSide }), .14, .48, 0, { parent: lp, rz: -.6 }); }
    [-5.3, -3.6].forEach(x => { BX(x - .22, x + .22, .44, .5, 6.4, 6.84, STD({ color: '#3a4a5a' })); BX(x - .22, x + .22, .5, 1.0, 6.82, 6.88, STD({ color: '#3a4a5a' })); add(new T.CylinderGeometry(.03, .03, .44, 6), MAT.black, x, .22, 6.62); }); }
  // otros detalles de la galería: cartel de suelo mojado, cubo de fregar, manguera de incendios, tablón, lámparas enjauladas, tuberías
  var WETSIGN = new T.Group(); WETSIGN.position.set(-1.8, 0, 2.6); WETSIGN.rotation.y = .5; scene.add(WETSIGN);
  { const ws = tex(256, 360, (g, w, h) => { g.fillStyle = '#ffd12a'; g.fillRect(0, 0, w, h); g.fillStyle = INK; g.beginPath(); g.moveTo(w / 2, 40); g.lineTo(w - 40, 170); g.lineTo(40, 170); g.closePath(); g.fill(); g.fillStyle = '#ffd12a'; g.beginPath(); g.moveTo(w / 2, 70); g.lineTo(w - 62, 156); g.lineTo(62, 156); g.closePath(); g.fill();
      g.fillStyle = INK; g.beginPath(); g.arc(w / 2 - 6, 96, 9, 0, 7); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.beginPath(); g.moveTo(w / 2 - 6, 106); g.lineTo(w / 2 + 6, 128); g.lineTo(w / 2 - 14, 150); g.moveTo(w / 2 + 6, 128); g.lineTo(w / 2 + 26, 140); g.stroke(); txt(g, 'SUELO', w / 2, 232, 52, INK, 900); txt(g, 'MOJADO', w / 2, 290, 52, INK, 900); g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); });
    [-1, 1].forEach(sd => add(RB(.42, .62, .02, .01), STD({ map: ws }), 0, .3, sd * .1, { parent: WETSIGN, rx: sd * .17, ry: sd < 0 ? Math.PI : 0 })); }
  { const bk = new T.Group(); bk.position.set(-2.8, 0, 2.1); scene.add(bk); add(new T.CylinderGeometry(.2, .17, .32, 16), STD({ color: '#ffcf3a' }), 0, .16, 0, { parent: bk }); add(new T.CylinderGeometry(.18, .18, .02, 16), STD({ color: '#8ac0d8', roughness: .2 }), 0, .3, 0, { parent: bk, noInk: true }); add(new T.TorusGeometry(.16, .012, 6, 18, Math.PI), MAT.black, 0, .34, 0, { parent: bk, rx: 0 }); }
  add(RB(.7, .9, .2, .03), STD({ color: '#c8302e' }), -10.5, 1.4, 7.88); add(new T.TorusGeometry(.2, .05, 8, 20), STD({ color: '#d8c8a0' }), -10.5, 1.4, 7.76);
  sign(1.4, 1.0, 260, (g, w, h) => { g.fillStyle = '#c8a070'; g.fillRect(0, 0, w, h); txt(g, 'NORMAS', w / 2, 44, 52, '#2a1a0a', 900); g.fillStyle = '#fff'; g.fillRect(30, 80, w - 60, h - 110); g.fillStyle = 'rgba(0,0,0,.45)'; for (let k = 0; k < 6; k++) { g.fillRect(50, 100 + k * 22, 20, 10); g.fillRect(80, 100 + k * 22, w - 150 - (k % 3) * 40, 10); } g.strokeStyle = '#5a3a1a'; g.lineWidth = 12; g.strokeRect(0, 0, w, h); }, -8.6, 1.7, 7.9, { ry: Math.PI });
  const cageLamp = (x, y, z, parent) => { add(new T.SphereGeometry(.11, 12, 10), STD({ color: '#fff4d0', emissive: '#ffe0a0', emissiveIntensity: 1.6 }), x, y, z, { cast: false, parent }); for (let k = 0; k < 4; k++) add(new T.TorusGeometry(.13, .008, 4, 14), MAT.bars, x, y, z, { ry: k * Math.PI / 4, cast: false, noInk: true, parent }); };
  CELLS.forEach(cx => { cageLamp(cx, 2.62, -1.6); cageLamp(cx, 5.82, -1.6); });
  [-14, -8, -2].forEach(x => cageLamp(x, 6.9, 4));
  add(new T.CylinderGeometry(.08, .08, 18, 10), STD({ color: '#8a7a6a', metalness: .3 }), -7.5, 7.1, 7.6, { rz: Math.PI / 2 }); add(new T.CylinderGeometry(.05, .05, 18, 10), STD({ color: '#5a6a7a', metalness: .3 }), -7.5, 6.9, 7.7, { rz: Math.PI / 2 });
  { const cl = signTex(256, 256); var HALLCLOCK = cl; add(new T.CylinderGeometry(.35, .35, .06, 24), STD({ map: cl.t }), -4.5, 4.6, 7.95, { rx: Math.PI / 2, ry: Math.PI }); }
  // ---------- celda del preso ----------
  // suelo con el agujero bajo la litera (x ∈ [-1.3, -.5], z ∈ [-3.1, ZS]) tapado con una losa suelta (CELLLID)
  BX(-1.5, 1.5, -.16, 0, -3.2, -3.1, MAT.concrete, { r: .005 }); BX(-1.5, 1.5, -.16, 0, ZS, 0, MAT.concrete, { r: .005 }); BX(-1.5, -1.3, -.16, 0, -3.1, ZS, MAT.concrete, { r: .005 }); BX(-.5, 1.5, -.16, 0, -3.1, ZS, MAT.concrete, { r: .005 });
  floorXZ(-1.5, 1.5, -3.2, 0, .002, STD({ map: tex(256, 256, (g, w, h) => { g.fillStyle = '#a8a294'; g.fillRect(0, 0, w, h); noise(g, w, h, 8000, ['#989284', '#b8b2a4', '#8a8478']); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * w / 4, 0); g.lineTo(k * w / 4, h); g.stroke(); g.beginPath(); g.moveTo(0, k * h / 4); g.lineTo(w, k * h / 4); g.stroke(); } }) }), 3.2);
  var CELLLID = BX(-1.32, -.48, .0, .03, -3.12, ZS - .02, MAT.concrete, { r: .005 });
  // litera pegada a la pared del fondo
  BX(-1.45, .35, .36, .44, -3.14, -2.3, MAT.steelDk); [[-1.42, -3.1], [.32, -3.1], [-1.42, -2.34], [.32, -2.34]].forEach(([x, z]) => BX(x - .03, x + .03, 0, .44, z - .03, z + .03, MAT.steelDk));
  var MATTRESS = new T.Group(); MATTRESS.position.set(-.55, .44, -2.72); scene.add(MATTRESS);
  add(RB(1.78, .16, .8, .06), STD({ map: tex(256, 128, (g, w, h) => { g.fillStyle = '#d8d2c0'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 22) { g.fillStyle = '#8a9ab0'; g.fillRect(x, 0, 9, h); } noise(g, w, h, 2000, ['rgba(0,0,0,.06)']); }), roughness: 1 }), 0, .08, 0, { parent: MATTRESS });
  add(RB(.42, .12, .6, .06), STD({ color: '#f2efe6', roughness: 1 }), -.62, .21, 0, { parent: MATTRESS });
  var BLANKET = add(RB(1.12, .07, .84, .04), STD({ map: tex(256, 256, (g, w, h) => { g.fillStyle = '#6a7a9a'; g.fillRect(0, 0, w, h); for (let k = 0; k < 8; k++) { g.fillStyle = k % 2 ? '#7a8aaa' : '#5a6a8a'; g.fillRect(0, k * h / 8, w, h / 16); } g.fillStyle = '#c8b070'; g.fillRect(0, h * .45, w, 10); }), roughness: 1 }), .3, .19, .02, { parent: MATTRESS });
  BX(-1.45, .35, .05, .44, ZS - .04, ZS - .01, STD({ map: tex(256, 64, (g, w, h) => { g.fillStyle = '#5a6a8a'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 12) { g.fillStyle = '#4a5a7a'; g.fillRect(x, 0, 5, h); } g.fillStyle = '#c8b070'; g.fillRect(0, h - 10, w, 6); }), roughness: 1 }), { r: .01 });   // faldón de la manta que tapa debajo de la litera
  // váter y lavabo de acero
  add(new T.CylinderGeometry(.21, .16, .38, 16), MAT.steelShiny, 1.05, .19, -2.82); add(new T.TorusGeometry(.17, .035, 8, 18), MAT.steelShiny, 1.05, .4, -2.82, { rx: Math.PI / 2 }); add(RB(.44, .52, .16, .05), MAT.steelShiny, 1.05, .56, -3.1);
  add(RB(.5, .1, .36, .04), MAT.steelShiny, 1.3, .85, -1.0); add(new T.CylinderGeometry(.015, .015, .14, 6), MAT.steelShiny, 1.42, .97, -1.0, { rz: Math.PI / 2 });
  add(RB(.03, .36, .28, .01), STD({ color: '#d8e4ec', metalness: .6, roughness: .15 }), 1.47, 1.25, -1.0);
  // ventanita con barrotes en el muro exterior (+ alféizar con cactus)
  { add(RB(.2, .06, 1.2, .01), MAT.concrete, 1.4, 1.45, -1.6); var CACTUS = new T.Group(); CACTUS.position.set(1.4, 1.48, -2.0); scene.add(CACTUS); add(new T.CylinderGeometry(.07, .055, .1, 12), STD({ color: '#c86a3a' }), 0, .05, 0, { parent: CACTUS });
    add(new T.CapsuleGeometry(.045, .12, 4, 10), STD({ color: '#4a9a4a', roughness: .9 }), 0, .19, 0, { parent: CACTUS }); add(new T.CapsuleGeometry(.025, .05, 4, 8), STD({ color: '#4a9a4a' }), .05, .2, 0, { parent: CACTUS, rz: -.7 }); add(new T.SphereGeometry(.025, 8, 6), STD({ color: '#ff6a9a', emissive: '#a02a4a', emissiveIntensity: .3 }), 0, .29, 0, { parent: CACTUS });
    for (let k = 0; k < 4; k++) add(new T.CylinderGeometry(.024, .024, 1.0, 8), MAT.bars, 1.9, 1.95, -1.93 + k * .22); add(new T.CylinderGeometry(.024, .024, 1.1, 8), MAT.bars, 1.9, 1.95, -1.6, { rx: Math.PI / 2 }); }
  // pared interior de la celda (lado del muro) con el hueco de la ventana
  BX(1.47, 1.5, 0, 2.8, -3.2, -2.15, MAT.cellWall, { cast: false, r: .003 }); BX(1.47, 1.5, 0, 2.8, -1.05, 0, MAT.cellWall, { cast: false, r: .003 }); BX(1.47, 1.5, 0, 1.45, -2.15, -1.05, MAT.cellWall, { cast: false, r: .003 }); BX(1.47, 1.5, 2.45, 2.8, -2.15, -1.05, MAT.cellWall, { cast: false, r: .003 });
  // pared izquierda (lado x = -1.4) con las rayas de los días: W2.setTally(n, k)
  var TALLY = signTex(1024, 512); add(new T.PlaneGeometry(1.9, .95), new T.MeshStandardMaterial({ map: TALLY.t, transparent: true, roughness: .9 }), -1.395, 1.6, -1.3, { ry: Math.PI / 2, cast: false, noInk: true });
  // cuadro de punto de cruz «HOGAR, DULCE HOGAR», estante con taza llena de cucharas dobladas, libros, radio y calendario
  sign(.66, .5, 300, (g, w, h) => { g.fillStyle = '#f4eedc'; g.fillRect(0, 0, w, h); for (let y = 10; y < h; y += 8) for (let x = 10; x < w; x += 8) { if (rnd() > .985) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(x, y, 3, 3); } }
    const X_ = (x, y, c) => { g.strokeStyle = c; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 3, y - 3); g.lineTo(x + 3, y + 3); g.moveTo(x + 3, y - 3); g.lineTo(x - 3, y + 3); g.stroke(); };
    txt(g, 'HOGAR,', w / 2, 52, 44, '#c8303a', 900); txt(g, 'DULCE HOGAR', w / 2, 100, 44, '#c8303a', 900);
    for (let x = 140; x < 260; x += 8) for (let y = 150; y < 210; y += 8) X_(x, y, '#3a7a5a'); for (let k = 0; k < 9; k++) for (let j = 0; j <= k; j++) X_(200 - k * 8 + j * 16 - 8, 142 - (8 - k) * 7 + 56 - 56, '#8a4a2a');
    for (let x = 60; x < 110; x += 8) for (let y = 160; y < 200; y += 8) { const dx = x - 85, dy = y - 178; if (dx * dx + dy * dy < 500) X_(x, y, '#e8506a'); }
    g.strokeStyle = '#8a5a2a'; g.lineWidth = 16; g.strokeRect(0, 0, w, h); g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(2, 2, w - 4, h - 4); }, -.55, 1.7, -3.17, { d: .03 });
  BX(.45, 1.38, 1.5, 1.54, -3.2, -2.95, MAT.woodLt); [['#c8302e', .5], ['#2f6fbf', .56], ['#e8b830', .61]].forEach(([c, x], k) => add(RB(.05, .26, .19, .01), STD({ color: c }), x, 1.67, -3.07, { rz: k === 2 ? -.25 : 0, noInk: k === 2 }));
  { const mg = new T.Group(); mg.position.set(.9, 1.54, -3.06); scene.add(mg); add(new T.CylinderGeometry(.06, .05, .13, 14), STD({ color: '#f2efe6' }), 0, .065, 0, { parent: mg }); for (let k = 0; k < 7; k++) { const s = add(new T.CylinderGeometry(.006, .006, .2, 5), MAT.steelShiny, Math.cos(k * 2) * .025, .17, Math.sin(k * 2) * .025, { parent: mg, rz: (k - 3) * .09, noInk: true }); add(new T.SphereGeometry(.016, 6, 5), MAT.steelShiny, Math.cos(k * 2) * .025 + (k - 3) * .009, .27, Math.sin(k * 2) * .025, { parent: mg, s: [1, .6, 1.3], noInk: true }); } }
  add(RB(.26, .16, .12, .02), STD({ color: '#5a4a3a' }), 1.2, 1.62, -3.06); add(new T.CylinderGeometry(.035, .035, .01, 12), STD({ color: '#d8c8a0' }), 1.16, 1.62, -2.995, { rx: Math.PI / 2, noInk: true }); add(new T.CylinderGeometry(.004, .004, .22, 4), MAT.black, 1.3, 1.8, -3.06, { rz: -.4, noInk: true });
  sign(.36, .46, 200, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#5a9ac8'; g.fillRect(8, 8, w - 16, h * .4); g.fillStyle = '#f2c84a'; g.beginPath(); g.arc(w * .7, h * .18, 16, 0, 7); g.fill(); g.fillStyle = '#4a8a4a'; g.beginPath(); g.moveTo(8, h * .46); g.lineTo(w * .4, h * .2); g.lineTo(w - 8, h * .46); g.fill(); g.fillStyle = 'rgba(0,0,0,.4)'; for (let i = 0; i < 20; i++) g.fillRect(14 + (i % 5) * 26, h * .52 + Math.floor(i / 5) * 20, 18, 12); g.fillStyle = '#c8302e'; g.fillRect(14 + 3 * 26, h * .52 + 2 * 20, 18, 12); }, 1.47, 1.95, -.45, { ry: -Math.PI / 2, d: .01 });
  // zapatillas y taburete
  [[.2, -.9], [.35, -.85]].forEach(([x, z]) => add(RB(.12, .05, .26, .03), STD({ color: '#5a7ab8' }), x, .03, z, { ry: .2 })); add(new T.CylinderGeometry(.18, .16, .04, 14), MAT.woodLt, .5, .46, -1.7); [0, 2.1, 4.2].forEach(a => add(new T.CylinderGeometry(.02, .02, .45, 6), MAT.woodDk, .5 + Math.cos(a) * .12, .22, -1.7 + Math.sin(a) * .12));
  var MUG = new T.Group(); MUG.position.set(.5, .48, -1.7); scene.add(MUG); add(new T.CylinderGeometry(.05, .045, .1, 12), STD({ color: '#e8b830' }), 0, .05, 0, { parent: MUG }); add(new T.TorusGeometry(.03, .01, 6, 10), STD({ color: '#e8b830' }), .055, .05, 0, { parent: MUG });
  // cosas que salen volando en el registro (estado W2.setMess(k)): libros, almohada, ropa por el suelo
  var MESS = new T.Group(); scene.add(MESS); MESS.visible = false;
  [[-.4, .02, -1.2, .4, '#c8302e'], [.1, .02, -.6, -.6, '#2f6fbf'], [.7, .02, -1.4, 1.2, '#e8b830'], [-1.0, .02, -.7, .2, '#5a8a5a']].forEach(([x, y, z, r, c]) => add(RB(.19, .05, .26, .01), STD({ color: c }), x, y + .025, z, { ry: r, parent: MESS }));
  add(RB(.5, .08, .3, .05), STD({ color: '#f2efe6', roughness: 1 }), .2, .05, -2.0, { ry: .7, parent: MESS }); add(RB(.6, .03, .5, .02), STD({ color: '#d8d2c0' }), -.6, .02, -1.6, { ry: -.4, parent: MESS }); add(RB(.4, .02, .3, .01), STD({ color: '#8a9ab0' }), .9, .015, -.5, { ry: 1.2, parent: MESS });
  // luces de la celda y de la galería
  var CELLLAMP = zoneLight('#ffe6b8', 5.5, 6, -.2, 2.4, -1.3, p => (inCell(p) || (p.y < 0 && p.x < 3) || SECTION)); CELLLAMP.userData.nightK = .12; var CELLSUN = zoneLight('#fff2d0', 7, 5, 2.6, 2.2, -1.6, inCell, { decay: 1.6 }); var CELLMOON = zoneLight('#7a8cff', 9, 6, 1.2, 2.0, -1.6, p => (inCell(p) || SECTION) && NIGHT > .5, { decay: 1.4 });
  zoneLight('#ffe8c8', 16, 18, -3, 5.6, 3.5, inHall); zoneLight('#ffe8c8', 14, 18, -11, 5.6, 3.5, inHall); zoneLight('#e4ecff', 9, 16, -6, 2.6, 6.5, inHall); var NIGHTFILL = zoneLight('#6a7ad8', 10, 18, -4.5, 4.5, 2.5, p => inHall(p) && NIGHT > .5); var BOOTHLAMP = zoneLight('#ffd8a0', 7, 5, -5.8, 1.5, 7.2, p => inHall(p) && NIGHT > .5); ZL.slice(-3).forEach(([l]) => l.userData.nightK = .22); zoneLight('#ffe6b8', 3, 6, -4.5, 2.2, 6.4, p => inHall(p) && p.z > 2);
  // ---------- muro exterior (x ∈ [1.5, 2.3]) con el hueco de la ventana; callejón; muro del banco con «BANCO» pintado ----------
  BX(1.5, 2.3, -1.2, 7.4, -3.6, -2.15, MAT.stone, { r: .01 }); BX(1.5, 2.3, -1.2, 7.4, -1.05, 8.0, MAT.stone, { r: .01 }); BX(1.5, 2.3, -1.2, 1.45, -2.15, -1.05, MAT.stone, { r: .01 }); BX(1.5, 2.3, 2.45, 7.4, -2.15, -1.05, MAT.stone, { r: .01 });
  BX(2.3, 2.52, 1.4, 1.45, -2.25, -.95, MAT.concrete);                                                                                        // alféizar de fuera (la paloma se posa aquí)
  for (let y = -.6; y < 7; y += 2.2) add(new T.CylinderGeometry(.06, .06, .01, 6), MAT.black, 2.31, y, 5.5);
  add(new T.CylinderGeometry(.07, .07, 7.6, 10), STD({ color: '#6a6e74', metalness: .4, roughness: .5 }), 2.42, 3.6, 3.4); add(new T.CylinderGeometry(.09, .07, .3, 10), STD({ color: '#6a6e74', metalness: .4 }), 2.48, .15, 3.4, { rz: .5 });   // bajante
  floorXZ(2.3, 5.3, -6, 10, .001, MAT.cobble, 1.5); BX(2.3, 5.3, -.15, 0, ZS, 0, MAT.cobble, { r: .002 });
  BX(2.3, 5.3, 0, 4.0, -6.2, -6.0, MAT.brickOld); BX(3.2, 4.4, 0, 2.2, -6.0, -5.95, STD({ color: '#3a4a3a', metalness: .3 }));                // tapia del fondo con portón
  // contenedores, caja, rejilla, charco, maleza
  [[3.1, -4.6, '#3a6a4a'], [4.4, -4.8, '#5a5a62']].forEach(([x, z, c]) => { BX(x - .45, x + .45, 0, .9, z - .35, z + .35, STD({ color: c, metalness: .2, roughness: .6 })); BX(x - .48, x + .48, .9, .98, z - .4, z + .38, STD({ color: c, metalness: .2 }), { rx: -.08 }); });
  BX(4.5, 5.1, 0, .45, 1.2, 1.8, MAT.wood); BX(4.6, 5.0, .45, .75, 1.3, 1.7, MAT.woodLt); add(RB(.6, .02, .4, .005), STD({ color: '#3a3e44', metalness: .5 }), 3.8, .012, .5, { noInk: true });
  add(new T.CircleGeometry(.6, 20), STD({ color: '#8aa0b0', roughness: .05, metalness: .4 }), 3.3, .006, 4.2, { rx: -Math.PI / 2, s: [1.4, 1, 1], cast: false, noInk: true });
  for (let k = 0; k < 14; k++) add(new T.ConeGeometry(.04, .2 + rnd() * .2, 4), STD({ color: '#6a9a3a' }), [2.38, 5.22][k % 2], .1, -5 + k * 1.1, { noInk: true });
  BX(5.3, 5.9, -1.2, 6.2, -3.6, 10, MAT.brick, { r: .01 });
  { const t = tex(920, 400, (g, w, h) => { g.clearRect(0, 0, w, h); g.globalAlpha = .92; txt(g, 'BANCO', w / 2, h * .46, 300, '#f2ece0', 900); g.globalAlpha = .6; txt(g, 'DESDE 1902', w / 2, h * .88, 74, '#f2ece0', 900); g.globalAlpha = 1;
    g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(0,0,0,${.3 + rnd() * .6})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 6, 2 + rnd() * 4); } for (let i = 0; i < 26; i++) { g.fillStyle = 'rgba(0,0,0,.8)'; g.fillRect(0, i * h / 26, w, 2); } });
    add(new T.PlaneGeometry(1.75, .76), new T.MeshStandardMaterial({ map: t, transparent: true, roughness: .9, depthWrite: false }), 5.295, 2.0, -1.6, { ry: -Math.PI / 2, cast: false, noInk: true }); }
  { const br = new T.Group(); br.position.set(5.2, 3.6, -1.6); scene.add(br); add(new T.CylinderGeometry(.02, .02, .5, 6), MAT.black, -.25, 0, 0, { parent: br, rz: Math.PI / 2 }); add(new T.ConeGeometry(.18, .16, 14, 1, true), STD({ color: '#2a5a3a', side: T.DoubleSide }), -.5, -.04, 0, { parent: br }); add(new T.SphereGeometry(.07, 10, 8), STD({ color: '#fff4d0', emissive: '#ffd890', emissiveIntensity: .2 }), -.5, -.1, 0, { parent: br }); var ALLEYBULB = br.children[2]; }
  // ---------- bajo tierra: tierra cortada (solo en vista de corte) y túnel ----------
  const TUN = { x0: -1.3, x1: 9.4, y0: -3.1, y1: -1.7, zb: -3.3 };
  [[-8, -1.3, -10, -.16], [-.5, 8.6, -1.7, -.16], [9.4, 16, -10, -.16], [-1.3, 9.4, -10, -3.1]].forEach(([a, b, c, d]) => capRect(a, b, c, d, MAT.earth, 2.2));
  // tapas del corte: losas, muros, cimientos, techo, piso de arriba
  capRect(-1.5, 1.5, -.16, 0, MAT.concrete); capRect(-8, 1.5, -.16, 0, MAT.concrete); capRect(1.5, 2.3, -1.2, 7.4, MAT.stoneDk, 1.6); capRect(2.3, 5.3, -.15, 0, MAT.cobble); capRect(5.3, 5.9, -1.2, 6.2, MAT.brick, 1.6);
  capRect(-8, 1.5, 2.8, 3.2, MAT.concrete); capRect(-8, 1.5, 6.0, 7.4, MAT.concrete); capRect(5.9, 16, -.16, 0, MAT.concrete); capRect(5.9, 16, 3.0, 3.3, MAT.concrete); capRect(5.9, 16, 6.2, 6.6, MAT.concrete);
  [-1.5, -4.5, -7.5].forEach(x => { capRect(x - .1, x + .1, 0, 2.8, MAT.concrete); capRect(x - .1, x + .1, 3.2, 6.0, MAT.concrete); });
  capRect(1.4, 1.5, 0, 2.8, MAT.concrete); capRect(1.4, 1.5, 3.2, 6.0, MAT.concrete); capRect(11.85, 12.0, 0, 6.2, MAT.concrete); capRect(-8, 2.3, 7.4, 7.8, MAT.stoneDk); capRect(5.3, 16, 6.6, 7.0, MAT.stoneDk);
  // tubería de alcantarilla cruzando bajo el callejón (sección redonda)
  { const pc = add(new T.RingGeometry(.28, .4, 28), STD({ color: '#6a6e74', metalness: .3 }), 3.8, -.9, ZS - .001, { parent: CAPS, cast: false, noInk: true }); add(new T.CircleGeometry(.28, 28), STD({ color: '#3a3020' }), 3.8, -.9, ZS - .0015, { parent: CAPS, cast: false, noInk: true }); }
  // interior del túnel (se ve en corte; de fuera no se ve nada)
  const tunM = STD({ map: earthT, color: '#7a6a5a', roughness: 1 });
  wallXY(TUN.x0, TUN.x1, TUN.y0, TUN.y1, TUN.zb, tunM, 2); floorXZ(TUN.x0, TUN.x1, TUN.zb, ZS, TUN.y0 + .001, STD({ map: planksT('#7a5a3a', 6), roughness: 1 }), 1.2); floorXZ(TUN.x0, TUN.x1, TUN.zb, ZS, TUN.y1, tunM, 2, { down: true });
  [[-1.3, -.5], [8.6, 9.4]].forEach(([a, b]) => { wallXY(a, b, TUN.y1, -.16, TUN.zb, tunM, 2); wallZY(TUN.zb, ZS, TUN.y1, -.16, a, tunM, 2, -1); wallZY(TUN.zb, ZS, TUN.y1, -.16, b, tunM, 2, 1);
    for (let y = TUN.y0 + .3; y < -.1; y += .32) BX(a + .18, b - .18, y, y + .05, TUN.zb + .25, TUN.zb + .32, MAT.woodLt); [a + .16, b - .16].forEach(x => BX(x - .03, x + .03, TUN.y0, -.05, TUN.zb + .25, TUN.zb + .32, MAT.woodLt)); });
  wallZY(TUN.zb, ZS, TUN.y0, TUN.y1, TUN.x0, tunM, 2, -1); wallZY(TUN.zb, ZS, TUN.y0, TUN.y1, TUN.x1, tunM, 2, 1);
  for (let x = .2; x < 8.4; x += 1.3) { [TUN.zb + .06].forEach(z => { BX(x - .06, x + .06, TUN.y0, TUN.y1, z - .04, z + .04, MAT.woodDk); }); BX(x - .06, x + .06, TUN.y1 - .1, TUN.y1, TUN.zb, ZS, MAT.woodDk); }
  const candles = []; [.9, 3.5, 6.1, 8.2].forEach(x => { add(RB(.1, .03, .1, .01), MAT.woodLt, x, TUN.y0 + .9, TUN.zb + .08); add(new T.CylinderGeometry(.025, .025, .1, 8), STD({ color: '#f4eedc' }), x, TUN.y0 + .97, TUN.zb + .08); candles.push(add(new T.SphereGeometry(.025, 8, 6), STD({ color: '#ffd060', emissive: '#ffb030', emissiveIntensity: 3 }), x, TUN.y0 + 1.05, TUN.zb + .08, { cast: false, noInk: true })); });
  [.9, 3.5, 6.1, 8.2].forEach(x => zoneLight('#ffb050', 2.6, 3.2, x, TUN.y0 + 1.05, TUN.zb + .4, () => SECTION, { decay: 1.5 }));
  zoneLight('#ffd6a8', 6, 16, 4, -2.6, 2.5, () => SECTION, { decay: 1.1 }); zoneLight('#c8b0ff', 4, 16, 1, -.5, 3, () => SECTION, { decay: 1.1 });
  // cubos de tierra, cucharas clavadas, plano del banco y cartel tachado
  [[1.8, '#7a6a5a'], [5.0, '#6a5a4a']].forEach(([x, c]) => { add(new T.CylinderGeometry(.14, .11, .24, 12), STD({ color: '#8a8e94', metalness: .4 }), x, TUN.y0 + .12, TUN.zb + .35); add(new T.SphereGeometry(.12, 10, 6), STD({ color: '#8a5a36', roughness: 1 }), x, TUN.y0 + .24, TUN.zb + .35, { s: [1, .4, 1] }); });
  for (let k = 0; k < 5; k++) { add(new T.CylinderGeometry(.008, .008, .16, 5), MAT.steelShiny, 2.6 + k * .07, TUN.y0 + .55 + (k % 2) * .06, TUN.zb + .02, { rx: Math.PI / 2 - .2, noInk: true }); add(new T.SphereGeometry(.02, 6, 5), MAT.steelShiny, 2.6 + k * .07, TUN.y0 + .55 + (k % 2) * .06, TUN.zb + .1, { s: [1, .6, 1.4], noInk: true }); }
  sign(.5, .36, 200, (g, w, h) => { paperBg(g, w, h, '#f0e8d0'); g.strokeStyle = '#2a4a8a'; g.lineWidth = 5; g.strokeRect(30, 40, 120, 90); g.strokeRect(180, 40, 90, 90); g.beginPath(); g.setLineDash([8, 6]); g.moveTo(60, 130); g.lineTo(60, 230); g.lineTo(220, 230); g.lineTo(220, 130); g.stroke(); g.setLineDash([]);
    g.strokeStyle = '#c8243a'; g.lineWidth = 6; g.beginPath(); g.arc(225, 85, 26, 0, 7); g.stroke(); g.fillStyle = '#e8b830'; g.fillRect(205, 78, 40, 14); }, 4.4, TUN.y0 + .85, TUN.zb + .02, { d: .01 });
  { const sg = new T.Group(); sg.position.set(-.2, TUN.y0 + .9, TUN.zb + .06); scene.add(sg); add(new T.CylinderGeometry(.03, .03, .9, 6), MAT.woodDk, 0, -.45, 0, { parent: sg });
    sign(.7, .22, 90, (g, w, h) => { g.fillStyle = '#c8a070'; g.fillRect(0, 0, w, h); txt(g, '← SALIDA', w / 2, h / 2 + 3, 54, '#3a2a1a', 900); g.strokeStyle = '#c8243a'; g.lineWidth = 10; g.beginPath(); g.moveTo(20, 10); g.lineTo(w - 20, h - 10); g.moveTo(w - 20, 10); g.lineTo(20, h - 10); g.stroke(); }, 0, .12, .02, { parent: sg, d: .03 });
    sign(.7, .2, 90, (g, w, h) => { g.fillStyle = '#c8a070'; g.fillRect(0, 0, w, h); txt(g, 'BANCO →', w / 2, h / 2 + 3, 56, '#1b6a3a', 900); }, .04, -.14, .03, { parent: sg, d: .03, rz: -.05 }); }
  // ---------- celda de arriba y archivo del banco (relleno de la maqueta en corte) ----------
  BX(-1.45, .35, 3.56, 3.64, -3.14, -2.3, MAT.steelDk); BX(-1.42, .32, 3.64, 3.78, -3.1, -2.34, STD({ color: '#5a7a9a', roughness: 1 }), { r: .05 });

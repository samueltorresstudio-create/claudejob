
  // =====================================================================================================
  // SALA DE GUERRA (x ∈ [53, 67], z ∈ [-7, 7], 5,5 m de alto): mesa con el mapa del Canal (Inglaterra arriba, Flandes y Francia abajo, La Esclusa),
  // barquitos de madera (azules = Francia, rojos = Inglaterra), velas, chimenea, ventana de noche con lluvia, estandartes, armero.
  // =====================================================================================================
  const GX = 60, GX0 = 53, GX1 = 67, GZ0 = -7, GZ1 = 7, GH = 5.5;
  const inWar = p => p.x > GX0 - 1 && p.x < GX1 + 1 && p.z > GZ0 - 1 && p.z < GZ1 + 1 && p.y < GH + .5;
  const MT = new T.Vector3(GX, .92, 0);   // centro del tablero del mapa
  const stoneDkW = STD({ map: tex(512, 512, (g, w, h) => { g.fillStyle = '#4a4238'; g.fillRect(0, 0, w, h); const rows = 8, bh = h / rows;
    for (let r = 0; r < rows; r++) { let x = -(r % 2) * 40; while (x < w) { const bw = 70 + rnd() * 60; const c = new T.Color('#9a8a70').offsetHSL(0, (rnd() - .5) * .05, (rnd() - .5) * .1); g.fillStyle = '#' + c.getHexString(); g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6);
      g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(x + 3, r * bh + 3, bw - 6, 3); x += bw; } } noise(g, w, h, 12000, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.04)']); blot(g, w, h, 8, 'rgba(30,20,10,.18)', 30, 90); }), roughness: .95 });
  floorXZ(GX0, GX1, GZ0, GZ1, 0, STD({ map: planksT('#6a4428', 6), roughness: .8 }), 3);
  wallZY(GZ0, GZ1, 0, GH, GX0, stoneDkW, 3, -1); wallZY(GZ0, GZ1, 0, GH, GX1, stoneDkW, 3, 1); wallXY(GX0, GX1, 0, GH, GZ0, stoneDkW, 3);
  wallXY(GX0, GX - 1, 0, GH, GZ1, stoneDkW, 3, { ry: Math.PI }); wallXY(GX + 1, GX1, 0, GH, GZ1, stoneDkW, 3, { ry: Math.PI }); wallXY(GX - 1, GX + 1, 3, GH, GZ1, stoneDkW, 3, { ry: Math.PI });
  floorXZ(GX0, GX1, GZ0, GZ1, GH, STD({ map: planksT('#3a2416'), roughness: .9 }), 3, { rx: Math.PI / 2 });
  for (let z = GZ0 + 1.2; z < GZ1; z += 2.2) add(RB(GX1 - GX0, .32, .3, .03), MAT.woodDk, GX, GH - .2, z);
  // puerta (por donde entra el mensajero) y pasillo con antorcha
  let WDOOR;
  { const dp = new T.Group(); dp.position.set(GX - 1, 0, GZ1 - .04); scene.add(dp); add(RB(.96, 2.95, .12, .02), STD({ map: planksT('#5a3a22', 4) }), .48, 1.48, 0, { parent: dp }); add(new T.TorusGeometry(.1, .025, 8, 16), MAT.bars, .82, 1.4, .1, { parent: dp });
    WDOOR = dp; floorXZ(GX - 1, GX + 1, GZ1, GZ1 + 3, 0, STD({ map: planksT('#5a3a22') }), 3); wallXY(GX - 1, GX + 1, 0, 3.2, GZ1 + 3, STD({ map: plaster('#a89070', .5), emissive: '#ffb060', emissiveIntensity: .25 }), 3, { ry: Math.PI });
    [-1, 1].forEach(sd => wallZY(GZ1, GZ1 + 3, 0, 3.2, GX + sd, STD({ map: plaster('#a89070', .5) }), 3, sd)); floorXZ(GX - 1, GX + 1, GZ1, GZ1 + 3, 3.2, STD({ color: '#3a2416' }), 3, { rx: Math.PI / 2 }); }
  // mapa del Canal pintado
  const mapT = tex(2048, 1280, (g, w, h) => { g.fillStyle = '#e8d8b0'; g.fillRect(0, 0, w, h); noise(g, w, h, 30000, ['rgba(120,90,40,.06)', 'rgba(255,255,255,.08)']); blot(g, w, h, 18, 'rgba(150,110,50,.12)', 60, 220);
    // mar
    const sea = new Path2D(); sea.moveTo(0, h * .42); sea.bezierCurveTo(w * .2, h * .5, w * .35, h * .36, w * .5, h * .44); sea.bezierCurveTo(w * .62, h * .5, w * .7, h * .38, w * .82, h * .42); sea.bezierCurveTo(w * .9, h * .44, w * .95, h * .4, w, h * .42);
    sea.lineTo(w, h * .62); sea.bezierCurveTo(w * .85, h * .66, w * .74, h * .6, w * .66, h * .66); sea.bezierCurveTo(w * .6, h * .7, w * .64, h * .76, w * .6, h * .78); sea.bezierCurveTo(w * .56, h * .74, w * .55, h * .68, w * .48, h * .68); sea.bezierCurveTo(w * .3, h * .7, w * .15, h * .64, 0, h * .7); sea.closePath();
    g.fillStyle = '#9fc6c0'; g.fill(sea); g.save(); g.clip(sea); for (let y = 0; y < h; y += 26) { g.strokeStyle = 'rgba(40,80,90,.25)'; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= w; x += 40) g.lineTo(x, y + Math.sin(x / 50 + y) * 6); g.stroke(); } g.restore();
    g.strokeStyle = '#5a3a1a'; g.lineWidth = 8; g.stroke(sea);
    // costas con sombreado de colinas
    for (let i = 0; i < 40; i++) { const x = rnd() * w, y = rnd() < .5 ? rnd() * h * .3 : h * .82 + rnd() * h * .16; g.strokeStyle = 'rgba(90,60,30,.4)'; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 18, y + 8); g.lineTo(x, y - 8); g.lineTo(x + 18, y + 8); g.stroke(); }
    // ciudades y puerto
    const town = (x, y) => { g.fillStyle = '#a8241e'; g.fillRect(x - 14, y - 14, 28, 28); g.strokeStyle = '#3a2410'; g.lineWidth = 4; g.strokeRect(x - 14, y - 14, 28, 28); g.fillStyle = '#3a2410'; g.beginPath(); g.moveTo(x - 18, y - 14); g.lineTo(x, y - 32); g.lineTo(x + 18, y - 14); g.fill(); };
    town(w * .62, h * .76); town(w * .3, h * .22); town(w * .8, h * .86); town(w * .15, h * .84);
    g.strokeStyle = '#a8241e'; g.lineWidth = 6; g.setLineDash([16, 10]); g.beginPath(); g.arc(w * .6, h * .72, 120, 0, 7); g.stroke(); g.setLineDash([]);
    txt(g, 'INGLATERRA', w * .36, h * .12, 96, '#4a2a12', 900); g.fillStyle = '#f2e2b8'; g.strokeStyle = '#5a3a1a'; g.lineWidth = 7; g.beginPath(); g.roundRect(w * .025, h * .05, w * .17, h * .16, 18); g.fill(); g.stroke(); txt(g, 'AÑO', w * .11, h * .09, 48, '#a8241e', 900); txt(g, 'MCCCXL', w * .11, h * .16, 70, '#4a2a12', 900); txt(g, 'FRANCIA', w * .3, h * .9, 96, '#4a2a12', 900); txt(g, 'FLANDES', w * .82, h * .94, 70, '#4a2a12', 900); txt(g, 'LA ESCLUSA', w * .6, h * .86, 56, '#a8241e', 900);
    // rosa de los vientos
    g.save(); g.translate(w * .9, h * .16); for (let k = 0; k < 8; k++) { g.rotate(Math.PI / 4); g.fillStyle = k % 2 ? '#a8241e' : '#2f4f8f'; g.beginPath(); g.moveTo(0, 0); g.lineTo(18, -18); g.lineTo(0, -(k % 2 ? 70 : 110)); g.lineTo(-18, -18); g.closePath(); g.fill(); } g.restore();
    // serpiente de mar
    g.strokeStyle = '#2f5a4a'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); for (let k = 0; k < 4; k++) { const x = w * .12 + k * 50; g.moveTo(x, h * .56); g.arc(x + 25, h * .56, 25, Math.PI, 0); } g.stroke();
    g.strokeStyle = '#5a3a1a'; g.lineWidth = 18; g.strokeRect(9, 9, w - 18, h - 18); });
  const MAPW = 3.2, MAPD = 2.0;
  add(RB(MAPW + .24, .12, MAPD + .24, .03), MAT.woodDk, GX, MT.y - .07, 0);
  add(new T.PlaneGeometry(MAPW, MAPD), STD({ map: mapT, roughness: .85 }), GX, MT.y - .005, 0, { rx: -Math.PI / 2, cast: false, noInk: true });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => add(RB(.16, .86, .16, .03), MAT.woodDk, GX + a * (MAPW / 2 - .1), .43, b * (MAPD / 2 - .1)));
  // posición del mapa → mundo (u, v ∈ [0, 1] sobre la textura)
  const mapP = (u, v, y = 0) => new T.Vector3(GX - MAPW / 2 + u * MAPW, MT.y + y, -MAPD / 2 + v * MAPD);
  // barquitos de madera
  const TOKENS = { fr: [], en: [] };
  const tokSail = (c1, c2, lis) => STD({ map: tex(128, 128, (g, w, h) => { for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? c2 : c1; g.fillRect(k * w / 4, 0, w / 4, h); } if (lis) drawLis(g, w / 2, h / 2, 60, '#e8b830'); }), side: T.DoubleSide, roughness: .8 });
  const sailFr = tokSail('#22408f', '#f4efe2', true), sailEn = tokSail('#a8241e', '#e8b830', false);
  const token = (fr) => { const g = new T.Group(); scene.add(g); add(RB(.17, .05, .065, .02), STD({ color: fr ? '#3a5aa8' : '#a8302a', roughness: .6 }), 0, .025, 0, { parent: g }); add(RB(.05, .04, .06, .01), MAT.woodLt, -.07, .06, 0, { parent: g });
    add(new T.CylinderGeometry(.006, .006, .16, 6), MAT.woodDk, 0, .12, 0, { parent: g, cast: false }); add(new T.PlaneGeometry(.1, .08), fr ? sailFr : sailEn, 0, .13, .012, { parent: g, cast: false, noInk: true }); return g; };
  const FRP = [[.57, .73], [.6, .73], [.63, .73], [.585, .76], [.615, .76], [.57, .79], [.6, .79], [.63, .79]];
  const ENA = [[.3, .5], [.36, .47], [.42, .52], [.34, .56], [.4, .58], [.46, .55]], ENB = [[.52, .66], [.56, .64], [.6, .63], [.64, .64], [.68, .66], [.6, .67]];
  FRP.forEach(() => TOKENS.fr.push(token(true))); ENA.forEach(() => TOKENS.en.push(token(false)));
  function setTokens(kMove = 0, kSink = 0) { TOKENS.fr.forEach((g, i) => { const [u, v] = FRP[i]; g.position.copy(mapP(u, v)); const q = clamp(kSink * 1.6 - i * .08); g.rotation.set(0, Math.PI / 2 + Math.sin(i) * .3, q * 1.5); g.position.y += q * .02; });
    TOKENS.en.forEach((g, i) => { const [u0, v0] = ENA[i], [u1, v1] = ENB[i], k = clamp(kMove * 1.2 - i * .04), e = k * k * (3 - 2 * k); g.position.copy(mapP(u0 + (u1 - u0) * e, v0 + (v1 - v0) * e)); g.rotation.set(0, Math.PI / 2 - .3 + e * .3, 0); }); }
  setTokens(0, 0);
  // velas grandes en las esquinas, candelabro en la mesa, lámpara
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { const x = GX + a * 2.2, z = b * 1.6; add(new T.CylinderGeometry(.05, .08, 1.3, 10), IRON, x, .65, z); add(new T.CylinderGeometry(.16, .2, .05, 14), IRON, x, 1.3, z); candle(x, 1.32, z, .36); });
  add(new T.CylinderGeometry(.03, .05, .3, 10), GOLDD, GX + 1.2, MT.y + .15, -.6); [-1, 0, 1].forEach(k => candle(GX + 1.2 + k * .1, MT.y + .3, -.6, .14));
  add(new T.TorusGeometry(.8, .04, 8, 30), IRON, GX, 3.6, 0, { rx: Math.PI / 2 }); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; candle(GX + Math.cos(a) * .8, 3.62, Math.sin(a) * .8, .16); }
  // chimenea con fuego (pared derecha)
  { const fx0 = GX1 - .4; BX(fx0 - .5, fx0 + .4, 0, 2.2, -1.4, 1.4, stoneDkW); BX(fx0 - .6, fx0 + .4, 2.2, 2.45, -1.6, 1.6, MAT.woodDk);
    add(RB(.2, 1.2, 1.9, .02), new T.MeshBasicMaterial({ color: '#120a06' }), fx0 - .52, .7, 0, { cast: false, noInk: true }); [-.4, 0, .4].forEach(z => flame(fx0 - .62, .12, z, 6)); [-.3, .3].forEach(z => add(new T.CylinderGeometry(.07, .07, .9, 8), MAT.woodDk, fx0 - .62, .12, z, { rx: Math.PI / 2 })); }
  // ventana de noche con lluvia (pared del fondo) — setLightning(k) la ilumina
  const rainWinT = tex(256, 384, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0e1630'); gr.addColorStop(1, '#22304e'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#0a0f1e'; g.beginPath(); g.moveTo(0, h * .75); for (let x = 0; x <= w; x += 32) g.lineTo(x, h * (.62 + rnd() * .12)); g.lineTo(w, h); g.lineTo(0, h); g.fill();
    g.strokeStyle = 'rgba(180,200,255,.35)'; g.lineWidth = 2; for (let i = 0; i < 90; i++) { const x = rnd() * w, y = rnd() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6, y + 22); g.stroke(); }
    g.strokeStyle = '#1b1720'; g.lineWidth = 10; g.strokeRect(0, 0, w, h); g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); });
  const rainWinM = STD({ map: rainWinT, emissive: '#ffffff', emissiveMap: rainWinT, emissiveIntensity: .6 });
  add(new T.PlaneGeometry(1.3, 1.9), rainWinM, GX - 3.4, 2.5, GZ0 + .06, { cast: false, noInk: true }); add(RB(1.5, .14, .3, .02), stoneDkW, GX - 3.4, 1.5, GZ0 + .12);
  function setLightning(k) { rainWinM.emissiveIntensity = .6 + k * 3; }
  // estandartes, armero, cofre, estantería con pergaminos
  [[GX + 1.6, banBlue], [GX + 3.2, banRed], [GX - 1.4, banBlue]].forEach(([x, m]) => { add(new T.PlaneGeometry(.9, 2.6), m, x, 3.2, GZ0 + .08, { cast: false, noInk: true }); add(new T.CylinderGeometry(.025, .025, 1.05, 8), GOLD, x, 4.55, GZ0 + .1, { rz: Math.PI / 2 }); });
  for (let k = 0; k < 4; k++) { add(new T.CylinderGeometry(.025, .025, 2.4, 8), MAT.woodDk, GX0 + .35, 1.2, -4 + k * .3, { rz: .08 }); add(new T.ConeGeometry(.05, .22, 8), MAT.steelShiny, GX0 + .45, 2.48, -4 + k * .3); }
  add(RB(.3, 1.2, 1.4, .02), MAT.woodDk, GX0 + .2, 1.6, -3.55);
  BX(GX0 + .1, GX0 + .6, 0, 2.6, 2.0, 4.4, MAT.woodDk); for (let s2 = 0; s2 < 4; s2++) for (let k = 0; k < 7; k++) add(new T.CylinderGeometry(.05, .05, .32, 10), STD({ color: ['#efe2c2', '#e2d2a8', '#f4ead2'][k % 3] }), GX0 + .38, .5 + s2 * .6, 2.2 + k * .3, { rz: Math.PI / 2 });
  BX(GX + 4.2, GX + 5.4, 0, .6, -6.6, -5.8, STD({ map: planksT('#7a4a26', 3) })); add(RB(1.24, .08, .84, .02), MAT.bars, GX + 4.8, .62, -6.2);
  zoneLight('#ffe0b8', 6, 8, GX, 2.8, .3, inWar); zoneLight('#ff9a50', 18, 7, GX1 - 1.2, 1, 0, inWar); zoneLight('#ffe8d0', 6, 9, GX, 4.2, 2, inWar);

  // =====================================================================================================
  // PLAZA DE NOCHE (x ∈ [104, 136], z ∈ [-22, 12]): adoquines mojados, casas de entramado con ventanas encendidas, pozo,
  // la horca en el centro del fondo con su ahorcado (silueta), cuervos (2D) y el castillo sobre la colina.
  // =====================================================================================================
  const PX = 120; const inPlaza = p => p.x > PX - 40 && p.x < PX + 40 && p.z > -60 && p.z < 30;
  const wetCobble = STD({ map: cobbleT, color: '#6a6a78', roughness: .28, metalness: .25 });
  floorXZ(PX - 26, PX + 26, -30, 16, 0, wetCobble, 3);
  const timberT = tex(512, 512, (g, w, h) => { g.fillStyle = '#d8ccb0'; g.fillRect(0, 0, w, h); noise(g, w, h, 8000, ['rgba(0,0,0,.06)', 'rgba(255,255,255,.05)']); g.fillStyle = '#3a2416'; [0, .5].forEach(f => g.fillRect(0, h * f, w, 22)); [0, .33, .66].forEach(f => g.fillRect(w * f, 0, 22, h));
    g.lineWidth = 18; g.strokeStyle = '#3a2416'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * .33, h * .5); g.moveTo(w * .66, h * .5); g.lineTo(w, 0); g.stroke(); });
  const timberM = STD({ map: timberT, roughness: .9 }), roofM = STD({ map: tex(256, 256, (g, w, h) => { g.fillStyle = '#5a2a22'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) for (let x = -(y / 16 % 2) * 12; x < w; x += 24) { g.fillStyle = `rgba(${90 + rnd() * 40},${40 + rnd() * 20},${30 + rnd() * 20},1)`; g.fillRect(x + 1, y + 1, 22, 14); } }), roughness: .9 });
  const litWin = new T.MeshBasicMaterial({ color: '#ffc870' }), darkWin = STD({ color: '#141a28' });
  const house = (x, z, w, d, h, ry) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g); add(RB(w, h, d, .03), timberM, 0, h / 2, 0, { parent: g });
    const sh = new T.Shape(); sh.moveTo(-w / 2 - .3, 0); sh.lineTo(0, w * .55); sh.lineTo(w / 2 + .3, 0); sh.closePath(); add(new T.ExtrudeGeometry(sh, { depth: d + .4, bevelEnabled: false }), roofM, 0, h, -d / 2 - .2, { parent: g });
    for (let fl = 0; fl < 2; fl++) for (let k = 0; k < Math.max(1, Math.floor(w / 1.6)); k++) { const wx = -w / 2 + .9 + k * 1.6, lit = hs2(x + k, z + fl) > .45; add(RB(.6, .8, .06, .01), lit ? litWin : darkWin, wx, 1.3 + fl * 2.2, d / 2 + .02, { parent: g, cast: false }); add(RB(.7, .08, .1, .01), MAT.woodDk, wx, 1.3 + fl * 2.2 - .44, d / 2 + .05, { parent: g }); }
    add(RB(.9, 1.8, .08, .01), MAT.woodDk, w / 2 - .8, .9, d / 2 + .02, { parent: g }); return g; };
  const hs2 = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  [[-20, -14, 5, 5, 5.5, .3], [-21, -4, 5, 5, 6.5, Math.PI / 2], [-21, 5, 5, 5, 5.2, Math.PI / 2], [20, -14, 5, 5, 6, -.3], [21, -4, 5, 5, 5.4, -Math.PI / 2], [21, 5, 5, 5, 6.2, -Math.PI / 2], [-10, -24, 6, 5, 6.2, 0], [10, -24, 6, 5, 5.6, 0], [0, -27, 5, 5, 7, 0]]
    .forEach(([x, z, w, d, h, ry]) => house(PX + x, z, w, d, h, ry));
  // horca
  const GALLOWS = new T.Vector3(PX, 0, -10);
  { const wd = STD({ map: planksT('#4a3020', 4), roughness: .9 }); BX(PX - 1.8, PX + 1.8, 0, 1.2, -11.8, -8.2, wd); for (let k = 0; k < 4; k++) BX(PX - .7, PX + .7, 0, .3 * (k + 1), -8.2 + .3 * (3 - k) + .01, -8.2 + .3 * (4 - k), wd);
    [-1, 1].forEach(sd => add(RB(.24, 4.4, .24, .03), wd, PX + sd * 1.2, 1.2 + 2.2, -10.6)); add(RB(3.0, .24, .26, .03), wd, PX, 5.4, -10.6); add(RB(.16, 1.2, .16, .02), wd, PX - .8, 4.9, -10.6, { rz: .8 });
    const rope = add(new T.CylinderGeometry(.022, .022, 1.5, 6), STD({ color: '#8a7050' }), PX + .3, 4.6, -10.6, { cast: false }); }
  const HANGED = new T.Group(); HANGED.position.set(PX + .3, 3.86, -10.6); scene.add(HANGED);
  { const dk = STD({ color: '#141218', roughness: 1 }); add(new T.SphereGeometry(.2, 14, 10), dk, 0, -.12, 0, { parent: HANGED }); add(new T.CapsuleGeometry(.2, .6, 4, 10), dk, 0, -.72, 0, { parent: HANGED }); [-1, 1].forEach(sd => add(new T.CapsuleGeometry(.06, .55, 4, 8), dk, sd * .08, -1.38, 0, { parent: HANGED })); }
  // pozo y antorchas de las casas
  { const pw = new T.Vector3(PX + 7, 0, -3); add(new T.CylinderGeometry(.9, .95, .9, 24, 1, true), stoneDkW, pw.x, .45, pw.z); add(new T.TorusGeometry(.92, .1, 8, 24), stoneDkW, pw.x, .9, pw.z, { rx: Math.PI / 2 });
    [-1, 1].forEach(sd => add(RB(.12, 2.2, .12, .02), MAT.woodDk, pw.x + sd * .8, 1.1, pw.z)); add(RB(1.9, .12, .12, .02), MAT.woodDk, pw.x, 2.2, pw.z); }
  [[-17.4, -11], [17.4, -11], [-18.4, 2], [18.4, 2]].forEach(([x, z]) => { add(RB(.1, .4, .1, .02), IRON, PX + x, 2.6, z); flame(PX + x, 2.82, z, 4); zoneLight('#ff9a48', 16, 9, PX + x, 2.9, z, inPlaza); });
  // castillo en la colina (silueta con ventanas)
  { const cm = STD({ color: '#2a2a3a', roughness: 1 }); const hill = add(new T.SphereGeometry(40, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), STD({ color: '#1a1e2a', roughness: 1 }), PX, -14, -80, { s: [1.6, .55, .6], cast: false });
    BX(PX - 14, PX + 14, 6, 16, -84, -76, cm); [-14, -5, 5, 14].forEach(x => { add(new T.CylinderGeometry(2.4, 2.6, 18, 16), cm, PX + x, 13, -76); add(new T.ConeGeometry(2.9, 5, 16), STD({ color: '#3a2a3a' }), PX + x, 24.5, -76); });
    for (let k = 0; k < 7; k++) add(RB(.7, 1.1, .1, .01), litWin, PX - 10 + k * 3.4, 11 + (k % 2) * 2.4, -75.9, { cast: false }); }
  zoneLight('#9fb4ff', 60, 50, PX, 16, 8, inPlaza); zoneLight('#ffb070', 18, 10, PX - 3, 3.2, -8.5, inPlaza);

  // =====================================================================================================
  // PUERTO DE LA ESCLUSA (x ∈ [260, 340], z ∈ [-40, 40]): mar animado, muelle de piedra con torres, el pueblo detrás,
  // la flota francesa amontonada en el puerto y la inglesa entrando. setFleet(kFuego, kHundir) la incendia y la hunde.
  // =====================================================================================================
  const HXc = 300; const inHarbor = p => p.x > HXc - 120 && p.x < HXc + 120 && p.z > -120 && p.z < 120 && p.y > -1;
  const seaU = { time: { value: 0 }, dusk: { value: 0 } };
  const sea = add(new T.PlaneGeometry(400, 400, 160, 160), new T.ShaderMaterial({ uniforms: seaU, fog: false,
    vertexShader: 'uniform float time; varying vec3 vw; varying float vh; void main(){ vec3 p=position; float h=sin(p.x*.35+time*1.3)*.12+sin(p.y*.42-time*1.1)*.1+sin((p.x+p.y)*.9+time*2.)*.04; p.z+=h; vh=h; vec4 w=modelMatrix*vec4(p,1.); vw=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader: 'uniform float time, dusk; varying vec3 vw; varying float vh; void main(){ vec3 deep=mix(vec3(.012,.07,.13),vec3(.012,.035,.075),dusk), shal=mix(vec3(.04,.22,.28),vec3(.10,.09,.13),dusk); vec3 c=mix(deep,shal,smoothstep(-.15,.22,vh)); float f=smoothstep(.235,.26,vh+sin(vw.x*3.+time*3.)*.015); c=mix(c,vec3(.8,.72,.62),f*.5); float d=length(vw.xz-cameraPosition.xz); vec3 sd2=normalize(vec3(.7,0.,-.5)); float gl=pow(max(dot(normalize(vw.xz-cameraPosition.xz),sd2.xz),0.),40.)*dusk; c+=vec3(.9,.42,.15)*gl*smoothstep(.0,.2,vh+.1); c=mix(c,mix(vec3(.30,.42,.52),vec3(.55,.28,.22),dusk),smoothstep(70.,200.,d)); gl_FragColor=vec4(c,1.); }' }),
    HXc, 0, 0, { rx: -Math.PI / 2, cast: false, noInk: true });
  // muelle, torres y pueblo
  { const qm = stoneDkW; BX(HXc - 40, HXc + 30, -.6, 1.4, -33, -27, qm); [-30, -8, 16].forEach(x => { add(new T.CylinderGeometry(2.2, 2.4, 9, 16), stoneWarm, HXc + x, 4.5, -30); add(new T.ConeGeometry(2.7, 4, 16), roofM, HXc + x, 11, -30); });
    for (let k = 0; k < 18; k++) house(HXc - 36 + k * 3.8, -37 - (k % 3) * 3, 3.2, 3.2, 4 + (k % 4), 0); add(new T.ConeGeometry(1.4, 12, 8), roofM, HXc - 4, 17, -46); BX(HXc - 6, HXc - 2, 0, 11, -48, -44, stoneWarm); }
  // coca medieval: casco con castillos a proa y popa, mástil, vela cuadrada a rayas y gallardete
  const sailT = (fr) => tex(256, 256, (g, w, h) => { for (let k = 0; k < 6; k++) { g.fillStyle = fr ? (k % 2 ? '#f4efe2' : '#22408f') : (k % 2 ? '#e8b830' : '#a8241e'); g.fillRect(k * w / 6, 0, w / 6, h); }
    if (fr) drawLis(g, w / 2, h / 2, 110, '#e8b830'); else { g.fillStyle = '#f2ede0'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8302e'; g.fillRect(w * .42, 0, w * .16, h); g.fillRect(0, h * .42, w, h * .16); }
    noise(g, w, h, 2000, ['rgba(0,0,0,.08)']); });
  const SAILFR = STD({ map: sailT(true), side: T.DoubleSide, roughness: .9 }), SAILEN = STD({ map: sailT(false), side: T.DoubleSide, roughness: .9 });
  const hullM = STD({ map: tex(512, 256, (g, w, h) => { g.fillStyle = '#6a4428'; g.fillRect(0, 0, w, h); for (let k = 0; k < 9; k++) { g.fillStyle = k % 2 ? '#5e3c22' : '#74502e'; g.fillRect(0, k * h / 9, w, h / 9 - 3); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, (k + 1) * h / 9 - 3, w, 3); } for (let i = 0; i < 60; i++) { g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(rnd() * w, Math.floor(rnd() * 9) * h / 9 + 6, 2.5, 0, 7); g.fill(); } noise(g, w, h, 4000, ['rgba(0,0,0,.08)']); }), roughness: .85, side: T.DoubleSide }), hullDk = STD({ map: planksT('#4a2e1a', 5), roughness: .85 });
  const fireM = new T.MeshBasicMaterial({ color: '#ff9a3a', transparent: true, opacity: .9, depthWrite: false, blending: T.AdditiveBlending }), fireM2 = new T.MeshBasicMaterial({ color: '#ffe08a', transparent: true, opacity: .9, depthWrite: false, blending: T.AdditiveBlending });
  // casco de coca: secciones a lo largo de x, manga que se cierra en proa y popa, fondo redondo y arrufo que sube en los extremos
  const HULLG = (() => { const L = 6.2, Bm = 2.4, D = 1.3, NX = 24, NS = 12, pos = [], uv = [], idx = [];
    for (let i = 0; i <= NX; i++) { const x = -L / 2 + i * L / NX, a = Math.abs(x) / (L / 2), hw = Bm / 2 * Math.pow(Math.max(0, 1 - Math.pow(a, 2.4)), .5) + .04, yb = -D * (1 - .75 * a * a) + .2, yt = 1.05 + .55 * Math.pow(a, 3);
      for (let j = 0; j <= NS; j++) { const th = Math.PI * j / NS, y = yt + (yb - yt) * Math.sin(th) ** .8; const z = hw * Math.cos(th) * (1 - .12 * Math.sin(th)); pos.push(x, y, z); uv.push(i / NX * 3, j / NS); } }
    for (let i = 0; i < NX; i++) for (let j = 0; j < NS; j++) { const a = i * (NS + 1) + j, b2 = a + NS + 1; idx.push(a, b2, a + 1, b2, b2 + 1, a + 1); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g; })();
  const cog = (fr) => { const g = new T.Group(); scene.add(g); const b = new T.Group(); g.add(b);
    add(HULLG, hullM, 0, 0, 0, { parent: b }); add(new T.PlaneGeometry(5.0, 1.9), hullDk, 0, 1.0, 0, { parent: b, rx: -Math.PI / 2, cast: false, noInk: true });
    add(RB(1.5, .9, 1.9, .08), hullDk, 2.3, 1.85, 0, { parent: b }); add(RB(1.4, .85, 1.8, .08), hullDk, -2.35, 1.8, 0, { parent: b });
    [[2.3, 2.36, 1.62, 2.02], [-2.35, 2.29, 1.52, 1.92]].forEach(([x, y, w, d]) => { add(RB(w, .1, d, .04), hullM, x, y, 0, { parent: b }); [-1, 1].forEach(sd => add(RB(w, .26, .08, .03), hullM, x, y + .16, sd * (d / 2 - .04), { parent: b })); });
    add(new T.CylinderGeometry(.11, .14, 8.5, 10), MAT.woodDk, 0, 5.3, 0, { parent: b }); add(new T.CylinderGeometry(.06, .06, 4.6, 8), MAT.woodDk, 0, 8.2, 0, { parent: b, rx: Math.PI / 2 });
    const sail = add(new T.PlaneGeometry(4.4, 4.6, 8, 8), fr ? SAILFR : SAILEN, 0, 5.85, .2, { parent: b, cast: false, noInk: true, ry: Math.PI / 2 }); { const pa = sail.geometry.attributes.position; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i); pa.setZ(i, (1 - (x / 2.2) ** 2) * .45 * (1 - ((y - .5) / 2.6) ** 2)); } sail.geometry.computeVertexNormals(); }
    add(new T.PlaneGeometry(1.4, .3), fr ? banBlue : banRed, 0, 9.7, .7, { parent: b, cast: false, noInk: true, ry: Math.PI / 2 });
    const fire = new T.Group(); b.add(fire); for (let k = 0; k < 5; k++) { const x = -2.4 + k * 1.2, f = add(new T.ConeGeometry(.6, 2.4, 10), fireM, x, 2.3, (k % 2 - .5) * .6, { parent: fire, cast: false, noInk: true }); f.renderOrder = 9;
      const f2 = add(new T.ConeGeometry(.32, 1.4, 10), fireM2, x, 2.0, (k % 2 - .5) * .6, { parent: fire, cast: false, noInk: true }); f2.renderOrder = 10; } fire.visible = false;
    return { g, b, fire, sail }; };
  const FLEET = { fr: [], en: [] };
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const s = cog(true); s.g.position.set(HXc - 12 + c * 4.3 + (r % 2) * 1.4 + (hs2(r, c) - .5) * .6, 0, -22 + r * 7.6 + (hs2(c, r) - .5) * 1.2); s.g.rotation.y = Math.PI / 2 + (hs2(r * 7, c) - .5) * .16; FLEET.fr.push(s); }
  for (let k = 0; k < 6; k++) { const s = cog(false); s.home = new T.Vector3(HXc - 11 + k * 4.6, 0, 22 + (k % 2) * 4); s.g.position.copy(s.home); s.g.rotation.y = Math.PI / 2 + (k - 2.5) * .04; FLEET.en.push(s); }
  const fireLights = [0, 1, 2].map(k => zoneLight('#ff7a2a', 0, 40, HXc - 8 + k * 9, 6, -14, inHarbor));
  function setFleet(kFire = 0, kSink = 0, kIn = 0) { FLEET.fr.forEach((s, i) => { const f = clamp(kFire * 2.2 - (i % 7) * .14), sk = clamp(kSink * 1.8 - (i % 5) * .15); s.fire.visible = false; s.burn = f;
      s.b.rotation.z = sk * (i % 2 ? .5 : -.42); s.b.rotation.x = sk * .25 * (i % 3 - 1); s.b.position.y = -sk * 3.2; s.sail.material = s.sail.material; });
    FLEET.en.forEach((s, i) => { s.g.position.copy(s.home).add(new T.Vector3(0, 0, -kIn * (14 + (i % 2) * 2))); });
    fireLights.forEach(l => l.userData.k = kFire); }
  setFleet(0, 0, 0);

  // =====================================================================================================
  // FONDO DEL MAR (x ∈ [400, 440]): arena, rocas, algas, casco hundido, estandarte francés que cae, yelmo; rayos de luz y niebla azul.
  // =====================================================================================================
  let KELP = [];
  const UX = 420; const inSea = p => p.x > UX - 30 && p.x < UX + 30 && p.z > -40 && p.z < 30;
  const SEABOX = add(new T.SphereGeometry(70, 32, 16), new T.MeshBasicMaterial({ color: '#2f7a8e', side: T.BackSide, fog: true }), UX, 0, -5, { cast: false, noInk: true }); SEABOX.visible = false;
  floorXZ(UX - 30, UX + 30, -40, 30, 0, STD({ map: tex(512, 512, (g, w, h) => { g.fillStyle = '#c8b48a'; g.fillRect(0, 0, w, h); noise(g, w, h, 20000, ['#b8a47a', '#d8c49a', '#a8946a'], [1, 3]); for (let y = 0; y < h; y += 20) { g.strokeStyle = 'rgba(120,100,60,.2)'; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= w; x += 20) g.lineTo(x, y + Math.sin(x / 30) * 5); g.stroke(); } }), roughness: 1 }), 4);
  { const wreck = cog(true); wreck.g.position.set(UX + 2, .3, -8); wreck.b.rotation.set(.18, .3, .42); wreck.g.position.y = -.4; FLEET.wreck = wreck;
    for (let k = 0; k < 14; k++) add(new T.DodecahedronGeometry(.5 + hs2(k, 3) * 1.2, 0), STD({ color: '#5a6a6a', roughness: 1 }), UX - 14 + hs2(k, 1) * 28, .2, -16 + hs2(k, 2) * 26);
    const kelpT = tex(64, 512, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#3f8a52'; g.beginPath(); g.moveTo(w * .5, 0); for (let y = 0; y <= h; y += 16) g.lineTo(w * (.5 + Math.sin(y / 40) * .2) + w * .22 * (1 - y / h), y); for (let y = h; y >= 0; y -= 16) g.lineTo(w * (.5 + Math.sin(y / 40) * .2) - w * .22 * (1 - y / h), y); g.fill(); g.strokeStyle = '#1f4a2a'; g.lineWidth = 3; g.stroke(); g.strokeStyle = 'rgba(200,255,200,.35)'; g.beginPath(); for (let y = 0; y <= h; y += 16) g.lineTo(w * (.5 + Math.sin(y / 40) * .2), y); g.stroke(); });
    const weedM = STD({ map: kelpT, transparent: true, alphaTest: .4, side: T.DoubleSide, roughness: .8 }); KELP = []; for (let k = 0; k < 34; k++) { const h = 1.6 + hs2(k, 7) * 3; const m = add(new T.PlaneGeometry(.5, h), weedM, UX - 16 + hs2(k, 5) * 32, h / 2, -18 + hs2(k, 6) * 30, { ry: hs2(k, 9) * 3, cast: false, noInk: true }); KELP.push([m, k]); }
    const helm = new T.LatheGeometry([[0, 0], [.22, 0], [.24, .1], [.22, .3], [.12, .42], [0, .45]].map(([r, y]) => new T.Vector2(r, y)), 18); add(helm, MAT.steelShiny, UX - 1.5, .05, 1.5, { rz: .9 }); }
  const SBAN = add(new T.PlaneGeometry(1.0, 2.6), banBlue, UX - .6, 4.5, 2.2, { cast: false, noInk: true });
  const rayM = new T.MeshBasicMaterial({ map: shaftT, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, opacity: .35 });
  for (let k = 0; k < 6; k++) { const r = add(new T.PlaneGeometry(2.2, 24), rayM, UX - 10 + k * 4, 11, -6 + (k % 3) * 3, { rz: .25, cast: false, noInk: true }); r.renderOrder = 8; }
  add(new T.PlaneGeometry(80, 80), new T.MeshBasicMaterial({ color: '#7fd0e8', side: T.DoubleSide }), UX, 22, -5, { rx: Math.PI / 2, cast: false, noInk: true });

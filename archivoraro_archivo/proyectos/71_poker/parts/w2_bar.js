
  // =====================================================================================================
  // BAR
  // =====================================================================================================
  const RH = 3.4, X0 = -7, X1 = 7, Z0 = -5, Z1 = 6;
  const TC = new T.Vector3(4.2, 0, -1.9), TR = .8, TH = .78;          // mesa de póker: centro, radio, altura del tapete
  const DT = new T.Vector3(-4.6, 0, 2.6);                                 // mesa de la cena
  const inBar = p => p.x > X0 - .1 && p.x < X1 + .1 && p.z > Z0 - .1 && p.z < Z1 + .1 && p.y > 0 && p.y < RH;
  // suelo de baldosa hidráulica y techo
  const hydT = tex(512, 512, (g, w, h) => { const s = w / 4; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const x = i * s, y = j * s; g.fillStyle = '#e8dcc4'; g.fillRect(x, y, s, s);
      g.fillStyle = '#9a3a2a'; g.beginPath(); g.moveTo(x + s / 2, y + 8); g.lineTo(x + s - 8, y + s / 2); g.lineTo(x + s / 2, y + s - 8); g.lineTo(x + 8, y + s / 2); g.closePath(); g.fill();
      g.fillStyle = '#e8dcc4'; g.beginPath(); g.arc(x + s / 2, y + s / 2, s * .22, 0, 7); g.fill(); g.fillStyle = '#2f5a6a'; g.beginPath(); g.arc(x + s / 2, y + s / 2, s * .12, 0, 7); g.fill();
      ['#2f5a6a'].forEach(c => { g.fillStyle = c; [[x, y], [x + s, y], [x, y + s], [x + s, y + s]].forEach(([cx, cy]) => { g.beginPath(); g.arc(cx, cy, s * .16, 0, 7); g.fill(); }); }); }
    g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 3; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * s, 0); g.lineTo(k * s, h); g.stroke(); g.beginPath(); g.moveTo(0, k * s); g.lineTo(w, k * s); g.stroke(); }
    noise(g, w, h, 9000, ['rgba(0,0,0,.05)', 'rgba(255,255,255,.06)']); blot(g, w, h, 12, 'rgba(80,60,30,.1)', 20, 70); });
  floorXZ(X0, X1, Z0, Z1, .001, STD({ map: hydT, roughness: .5 }), 1.6);
  const beams = STD({ map: planksT('#6a4226', 4) });
  floorXZ(X0, X1, Z0, Z1, RH, STD({ map: plaster('#efe2c4', .1) }), 3, { down: true });
  for (let x = -6; x <= 6; x += 2) BX(x - .12, x + .12, RH - .26, RH, Z0, Z1, beams);
  // paredes: azulejo hasta 1,3 m y yeso crema arriba con un friso
  const azT = tex(512, 512, (g, w, h) => { const s = w / 8; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { const x = i * s, y = j * s; g.fillStyle = '#f2ead6'; g.fillRect(x, y, s, s);
      g.strokeStyle = '#2f6a9a'; g.lineWidth = 4; g.beginPath(); g.arc(x, y, s * .5, 0, Math.PI / 2); g.stroke(); g.beginPath(); g.arc(x + s, y + s, s * .5, Math.PI, Math.PI * 1.5); g.stroke();
      g.fillStyle = '#e8b830'; g.beginPath(); g.arc(x + s / 2, y + s / 2, 5, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x + 4, y + 4, s * .4, 3); }
    g.strokeStyle = 'rgba(90,80,60,.5)'; g.lineWidth = 2; for (let k = 0; k <= 8; k++) { g.beginPath(); g.moveTo(k * s, 0); g.lineTo(k * s, h); g.stroke(); g.beginPath(); g.moveTo(0, k * s); g.lineTo(w, k * s); g.stroke(); } });
  const azM = STD({ map: azT, roughness: .35 }), wallM = STD({ map: plaster('#ead8b4', .35) }), friso = STD({ color: '#2f5a8a', roughness: .5 });
  const wallSet = (axis, c, a0, a1, face) => { if (axis === 'z') { wallXY(a0, a1, 0, 1.3, c, azM, 1.2, { ry: face < 0 ? Math.PI : 0 }); wallXY(a0, a1, 1.3, RH, c, wallM, 3, { ry: face < 0 ? Math.PI : 0 }); add(RB(a1 - a0, .1, .05, .01), friso, (a0 + a1) / 2, 1.33, c + face * .025, { cast: false }); }
    else { wallZY(a0, a1, 0, 1.3, c, azM, 1.2, face); wallZY(a0, a1, 1.3, RH, c, wallM, 3, face); add(RB(.05, .1, a1 - a0, .01), friso, c - face * .025, 1.33, (a0 + a1) / 2, { cast: false }); } };
  wallSet('z', Z0, X0, X1, 1); wallSet('x', X0, Z0, Z1, -1); wallSet('x', X1, Z0, Z1, 1); wallSet('z', Z1, X0, X1, -1);
  // ---------- ventana a la calle (pared izquierda) y puerta (fondo de la sala, z = Z1) ----------
  const nightStreet = (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0e1430'); gr.addColorStop(.75, '#2a2650'); gr.addColorStop(1, '#3a2a40'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(rnd() * w, rnd() * h * .3, 2, 2); }
    for (let b = 0; b < 6; b++) { const bx = b * 92 - 10, bw = 84, bh = h * (.45 + rnd() * .3); g.fillStyle = ['#2a2440', '#30284a', '#241f38'][b % 3]; g.fillRect(bx, h - bh, bw, bh);
      for (let yy = h - bh + 14; yy < h - 60; yy += 34) for (let xx = bx + 10; xx < bx + bw - 14; xx += 24) if (rnd() > .45) { g.fillStyle = rnd() > .3 ? '#ffd88a' : '#9ad0ff'; g.fillRect(xx, yy, 12, 18); } }
    g.fillStyle = '#1a1626'; g.fillRect(0, h * .86, w, h * .14); g.fillStyle = '#ffd890'; g.beginPath(); g.arc(w * .7, h * .55, 14, 0, 7); g.fill(); g.fillStyle = 'rgba(255,216,144,.18)'; g.beginPath(); g.moveTo(w * .7, h * .55); g.lineTo(w * .55, h); g.lineTo(w * .85, h); g.fill(); };
  [[.5, 2.5], [3.8, 2.4]].forEach(([z, ww]) => { paintedWin(X0 + .06, 1.95, z, ww, 1.5, Math.PI / 2, nightStreet, 1.0, MAT.woodDk); BX(X0, X0 + .3, 1.12, 1.2, z - ww / 2 - .1, z + ww / 2 + .1, MAT.woodDk); });
  // letrero de neón que se ve del revés en la ventana (por fuera pone «BAR»)
  { const nt = tex(256, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.save(); g.translate(w, 0); g.scale(-1, 1); g.shadowColor = '#ff4a7a'; g.shadowBlur = 18; g.strokeStyle = '#ff6a9a'; g.lineWidth = 9; g.font = FONT(900, 96); g.textAlign = 'center'; g.textBaseline = 'middle'; g.strokeText('BAR', w / 2, h / 2); g.restore(); });
    add(new T.PlaneGeometry(.9, .45), new T.MeshBasicMaterial({ map: nt, transparent: true, toneMapped: false }), X0 + .12, 2.35, 3.8, { ry: Math.PI / 2, cast: false, noInk: true }); }
  // puerta con cristal y cortina de tiras
  BX(-1.0, 1.0, 0, 2.5, Z1 - .08, Z1, MAT.woodDk); paintedWin(0, 1.6, Z1 - .1, 1.2, 1.1, Math.PI, nightStreet, .8, MAT.woodDk);
  for (let k = 0; k < 16; k++) add(RB(.1, 2.3, .01, .004), STD({ color: ['#c8302e', '#e8b830', '#2f6fbf', '#3a9a5a'][k % 4] }), -.75 + k * .1, 1.2, Z1 - .2, { cast: false, noInk: true });
  // ---------- BARRA ----------
  const BZ = -3.1;                                                                   // frente de la barra
  const barFrontT = tex(512, 256, (g, w, h) => { g.fillStyle = '#6a3a22'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(i * w / 8, 0, 4, h); g.fillStyle = 'rgba(255,220,180,.07)'; g.fillRect(i * w / 8 + 6, 0, 4, h); }
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(30,14,6,${.1 + rnd() * .2})`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const x = rnd() * w; g.moveTo(x, 0); g.bezierCurveTo(x + rnd() * 6 - 3, h * .3, x + rnd() * 6 - 3, h * .6, x, h); g.stroke(); } });
  BX(-6.4, 1.4, 0, 1.05, BZ - .7, BZ, STD({ map: barFrontT }));                        // cuerpo
  BX(-6.5, 1.5, 1.05, 1.12, BZ - .82, BZ + .1, STD({ map: planksT('#4a2a18', 3), roughness: .35 }));          // tablero
  add(new T.CylinderGeometry(.03, .03, 7.9, 8), MAT.brass, -2.5, .22, BZ + .12, { rz: Math.PI / 2 });                                   // reposapiés
  for (let x = -6.2; x <= 1.2; x += 1.2) add(new T.CylinderGeometry(.02, .02, .2, 6), MAT.brass, x, .12, BZ + .08);
  BX(1.4, 1.5, 0, 1.12, BZ - .82, -.0 - 3.0, STD({ map: barFrontT }));
  // taburetes
  const stool = (x, z) => { const g = new T.Group(); g.position.set(x, 0, z); scene.add(g); add(new T.CylinderGeometry(.22, .2, .08, 18), STD({ color: '#8a2a22', roughness: .6 }), 0, .78, 0, { parent: g }); add(new T.CylinderGeometry(.03, .04, .74, 8), MAT.steelShiny, 0, .38, 0, { parent: g }); add(new T.TorusGeometry(.17, .015, 6, 16), MAT.steelShiny, 0, .3, 0, { parent: g, rx: Math.PI / 2 }); add(new T.CylinderGeometry(.2, .22, .03, 16), MAT.steelShiny, 0, .02, 0, { parent: g }); return g; };
  [-5.6, -4.4, -3.2, -2.0, -.8].forEach(x => stool(x, BZ + .55));
  // sobre la barra: tiradores de cerveza, vitrina de tapas, cafetera, servilleteros, palilleros, caja registradora, platos de tapas, cañas
  { const tap = new T.Group(); tap.position.set(-1.2, 1.12, BZ - .35); scene.add(tap); add(RB(.5, .5, .14, .03), MAT.steelShiny, 0, .25, 0, { parent: tap });
    [-.14, .14].forEach((x, i) => { add(new T.CylinderGeometry(.025, .025, .22, 8), MAT.steelShiny, x, .52, .1, { parent: tap, rx: .4 }); add(new T.CylinderGeometry(.03, .025, .16, 8), STD({ color: i ? '#c8302e' : '#e8b830' }), x, .7, .08, { parent: tap }); });
    sign(.36, .1, 60, (g, w, h) => { g.fillStyle = '#c8302e'; g.fillRect(0, 0, w, h); txt(g, 'CERVEZA', w / 2, h / 2 + 2, 34, '#fff', 900); }, 0, .38, .075, { parent: tap, d: .01 }); }
  const VIT = new T.Group(); VIT.position.set(-4.6, 1.12, BZ - .4); scene.add(VIT);
  { add(RB(1.9, .06, .55, .02), MAT.steelShiny, 0, .03, 0, { parent: VIT }); add(new T.PlaneGeometry(1.9, .42), STD({ color: '#d8f0f8', transparent: true, opacity: .18, roughness: .05 }), 0, .27, .27, { parent: VIT, rx: -.3, cast: false, noInk: true });
    BX(-.95, .95, .45, .48, -.27, .2, MAT.steelShiny, { parent: VIT });
    const dish = (x, col, item) => { add(new T.CylinderGeometry(.17, .14, .04, 18), STD({ color: '#f4f0e6' }), x, .08, 0, { parent: VIT });
      if (item === 'tortilla') { add(new T.CylinderGeometry(.13, .14, .07, 20, 1, false, 0, Math.PI * 1.6), STD({ color: '#f2c84a', roughness: .8 }), x, .14, 0, { parent: VIT }); }
      if (item === 'croq') for (let k = 0; k < 5; k++) add(new T.CapsuleGeometry(.03, .05, 4, 8), STD({ color: '#c8843a', roughness: 1 }), x - .08 + (k % 3) * .07, .13, -.04 + Math.floor(k / 3) * .07, { parent: VIT, rz: Math.PI / 2 });
      if (item === 'bravas') for (let k = 0; k < 7; k++) add(RB(.05, .05, .05, .012), STD({ color: '#e8b048' }), x - .08 + (k % 4) * .05, .13, -.04 + Math.floor(k / 4) * .06, { parent: VIT, ry: k, noInk: true });
      if (item === 'gambas') for (let k = 0; k < 6; k++) add(new T.TorusGeometry(.03, .013, 6, 10, 4), STD({ color: '#f06a4a' }), x - .08 + (k % 3) * .07, .12, -.03 + Math.floor(k / 3) * .06, { parent: VIT, rx: Math.PI / 2, noInk: true });
      if (col) add(new T.SphereGeometry(.05, 8, 6), STD({ color: col }), x + .05, .14, .04, { parent: VIT, s: [1, .5, 1], noInk: true }); };
    dish(-.7, null, 'tortilla'); dish(-.25, null, 'croq'); dish(.2, '#d8302e', 'bravas'); dish(.65, null, 'gambas'); }
  // cafetera de bar
  { const cm = new T.Group(); cm.position.set(-2.6, 1.12, BZ - .45); scene.add(cm); add(RB(.8, .5, .45, .05), STD({ color: '#c8302e', metalness: .3, roughness: .35 }), 0, .25, 0, { parent: cm }); add(RB(.82, .08, .47, .02), MAT.steelShiny, 0, .53, 0, { parent: cm });
    [-.22, .22].forEach(x => { add(new T.CylinderGeometry(.05, .05, .08, 12), MAT.black, x, .17, .26, { parent: cm, rx: Math.PI / 2 }); add(new T.CylinderGeometry(.008, .008, .12, 6), MAT.black, x, .12, .34, { parent: cm, rz: Math.PI / 2 }); });
    for (let k = 0; k < 6; k++) add(new T.CylinderGeometry(.035, .03, .05, 12), STD({ color: '#f4f0e6' }), -.3 + k * .12, .6, 0, { parent: cm }); }
  // caja registradora (cajón que se abre): W2.setTill(k, lleno)
  const TILL = new T.Group(); TILL.position.set(.6, 1.12, BZ - .4); scene.add(TILL);
  const TILLD = new T.Group(); TILL.add(TILLD);
  { const tm = STD({ color: '#3a3e44', metalness: .4, roughness: .4 }); add(RB(.5, .16, .42, .03), tm, 0, .08, 0, { parent: TILL }); add(RB(.46, .2, .3, .03), tm, 0, .26, -.04, { parent: TILL, rx: -.35 });
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) add(RB(.07, .02, .05, .01), STD({ color: '#f2efe6' }), -.15 + i * .1, .32 - j * .035, .02 + j * .05, { parent: TILL, rx: -.35, noInk: true });
    var TILLSCR = signTex(256, 96); add(RB(.3, .1, .04, .01), tm, 0, .46, -.12, { parent: TILL }); add(new T.PlaneGeometry(.27, .08), new T.MeshBasicMaterial({ map: TILLSCR.t, toneMapped: false }), 0, .46, -.099, { parent: TILL, cast: false, noInk: true });
    add(RB(.46, .07, .4, .01), tm, 0, .0, .0, { parent: TILLD }); add(RB(.08, .02, .02, .005), MAT.brass, 0, .0, .21, { parent: TILLD });
    var TILLCASH = new T.Group(); TILLD.add(TILLCASH); for (let k = 0; k < 4; k++) add(RB(.09, .03 + k * .005, .2, .005), STD({ map: tex(64, 128, (g, w, h) => { g.fillStyle = ['#8ac87a', '#e8b07a', '#7ab0e8', '#c87a9a'][k]; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(w * .3, 0, 8, h); }) }), -.17 + k * .11, .05, .0, { parent: TILLCASH, noInk: true }); }
  // servilleteros, palilleros y platitos por la barra
  [[-5.8, -3.35], [-3.4, -3.3], [-.2, -3.35]].forEach(([x, z]) => { add(RB(.16, .14, .1, .02), MAT.steelShiny, x, 1.19, z); add(RB(.13, .1, .08, .005), MAT.white, x, 1.21, z, { noInk: true }); });
  [-5.2, -1.8].forEach(x => add(new T.CylinderGeometry(.035, .04, .09, 10), STD({ color: '#e8d8b0' }), x, 1.165, BZ - .2));
  // servilletas usadas por el suelo (clásico)
  for (let k = 0; k < 26; k++) { const x = -6 + rnd() * 7, z = BZ + .2 + rnd() * .9; add(new T.PlaneGeometry(.11, .11), STD({ color: '#fbf8f0', side: T.DoubleSide }), x, .004 + k * .0001, z, { rx: -Math.PI / 2, rz: rnd() * 6, cast: false, noInk: true }); }
  // ---------- pared del fondo: estanterías con botellas, espejo, jamones, foto de 1995, licencia, reloj, tele ----------
  const BW = Z0 + .02;
  BX(-6.4, 1.4, 0, .95, Z0, Z0 + .5, MAT.woodDk);                                              // mueble bajo
  BX(-6.45, 1.45, .95, 1.0, Z0, Z0 + .55, MAT.steelShiny);
  add(new T.PlaneGeometry(4.2, 1.0), STD({ color: '#c8d8e0', metalness: .6, roughness: .12, emissive: '#2a3038', emissiveIntensity: .4 }), -3.6, 1.95, BW + .01, { cast: false, noInk: true }); // espejo
  sign(4.4, .32, 120, (g, w, h) => { g.clearRect(0, 0, w, h); txt(g, 'BAR · CAFETERÍA · DESDE 1995', w / 2, h / 2 + 2, 70, '#d8a640', 900, 'center', 6, '#3a2a10'); }, -3.6, 1.95, BW + .02, { d: .005 });
  [[-6.2, 1.55], [-6.2, 2.4], [-1.25, 1.55], [-1.25, 2.4]].forEach(([x, y]) => 0);
  for (const y of [1.45, 2.55]) { BX(-6.3, -.9, y - .03, y, Z0, Z0 + .28, MAT.wood);
    for (let x = -6.2; x < -1.0; x += .14) { if (y === 1.45 && x > -5.7 && x < -1.6) continue; const tall = .28 + rnd() * .1, col = ['#2a5a2a', '#6a2a1a', '#c8a050', '#1a2a3a', '#e8e0d0', '#5a3a7a'][Math.floor(rnd() * 6)];
      add(new T.CylinderGeometry(.04, .045, tall, 10), STD({ color: col, roughness: .15, metalness: .1 }), x, y + tall / 2, Z0 + .14); add(new T.CylinderGeometry(.015, .03, .08, 8), STD({ color: col }), x, y + tall + .04, Z0 + .14, { noInk: true }); add(new T.PlaneGeometry(.06, .07), STD({ color: '#f2ead6' }), x, y + tall * .45, Z0 + .186, { cast: false, noInk: true }); } }
  // jamones colgados con su cono
  const JAM = []; for (let k = 0; k < 5; k++) { const g = new T.Group(); g.position.set(-5.6 + k * .55, 3.25, -4.55); scene.add(g); JAM.push(g);
    add(new T.CylinderGeometry(.006, .006, .3, 4), MAT.black, 0, -.15, 0, { parent: g, noInk: true }); add(new T.CylinderGeometry(.04, .03, .25, 8), STD({ color: '#4a2a18' }), 0, -.42, 0, { parent: g });
    const ham = add(new T.SphereGeometry(.2, 16, 12), STD({ map: tex(128, 128, (gg, w, h) => { gg.fillStyle = '#7a3a22'; gg.fillRect(0, 0, w, h); blot(gg, w, h, 8, 'rgba(240,210,160,.5)', 10, 30); noise(gg, w, h, 900, ['rgba(0,0,0,.15)']); }), roughness: .7 }), 0, -.75, 0, { parent: g, s: [.85, 1.6, .7] });
    add(new T.ConeGeometry(.12, .1, 16, 1, true), STD({ color: '#f4f0e6', side: T.DoubleSide }), 0, -1.12, 0, { parent: g, rx: Math.PI }); }
  // foto antigua de la inauguración (la pista): W2.PHOTO; lienzo que se puede animar (sepia)
  var PHOTOC = signTex(600, 440); const PHOTO = new T.Group(); PHOTO.position.set(-.35, 2.32, BW + .03); scene.add(PHOTO);
  add(RB(.92, .72, .05, .02), MAT.brass, 0, 0, 0, { parent: PHOTO }); add(new T.PlaneGeometry(.8, .6), STD({ map: PHOTOC.t, roughness: .8 }), 0, 0, .03, { parent: PHOTO, cast: false, noInk: true });
  // licencia de apertura enmarcada (a nombre del cuñado)
  var LICC = signTex(440, 600); const LIC = new T.Group(); LIC.position.set(.75, 2.3, BW + .03); scene.add(LIC);
  add(RB(.44, .58, .04, .01), MAT.woodDk, 0, 0, 0, { parent: LIC }); add(new T.PlaneGeometry(.38, .52), STD({ map: LICC.t, roughness: .8 }), 0, 0, .025, { parent: LIC, cast: false, noInk: true });
  // reloj de pared: W2.setClock(h, m)
  var CLK = signTex(256, 256); add(new T.CylinderGeometry(.32, .32, .06, 28), STD({ color: '#f6f0e0' }), 2.4, 2.55, BW + .04, { rx: Math.PI / 2 }); add(new T.PlaneGeometry(.62, .62), STD({ map: CLK.t, transparent: true }), 2.4, 2.55, BW + .072, { cast: false, noInk: true }); add(new T.TorusGeometry(.33, .03, 8, 28), STD({ color: '#2a2a30' }), 2.4, 2.55, BW + .06);
  // tele con el fútbol en la esquina
  { const tv = new T.Group(); tv.position.set(6.55, 2.7, -4.45); tv.rotation.y = -.6; scene.add(tv); add(RB(1.1, .66, .1, .03), MAT.black, 0, 0, 0, { parent: tv });
    var TVC = signTex(512, 288); add(new T.PlaneGeometry(1.0, .56), new T.MeshBasicMaterial({ map: TVC.t, toneMapped: false }), 0, 0, .052, { parent: tv, cast: false, noInk: true }); add(new T.CylinderGeometry(.02, .02, .4, 6), MAT.black, 0, .5, -.1, { parent: tv }); }
  // pizarra de raciones (izquierda de la barra) y bufanda del equipo
  sign(1.1, .8, 300, (g, w, h) => { g.fillStyle = '#20302a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a5a2a'; g.lineWidth = 18; g.strokeRect(0, 0, w, h); txt(g, 'RACIONES', w / 2, 46, 40, '#f4f0e0', 900);
    [['Croquetas', '6'], ['Bravas', '5'], ['Oreja', '7'], ['Chuletón', '28'], ['Gambas', '12']].forEach(([a, b], i) => { txt(g, a, 40, 100 + i * 34, 28, '#f4f0e0', 700, 'left'); txt(g, b + ' €', w - 40, 100 + i * 34, 28, '#ffd34a', 800, 'right'); }); }, X0 + .04, 2.1, -3.6, { ry: Math.PI / 2, d: .03 });
  { const sc = tex(512, 64, (g, w, h) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#f4f0e6' : '#2f6fbf'; g.fillRect(i * w / 16, 0, w / 16, h); } txt(g, 'AÚPA EL BARRIO', w / 2, h / 2 + 2, 30, '#c8302e', 900); });
    add(RB(2.2, .2, .02, .005), STD({ map: sc }), 4.2, 3.0, BW + .03, { rz: .04, noInk: true }); }
  // ---------- mesa de póker (rincón del fondo a la derecha) ----------
  const feltT = tex(512, 512, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); gr.addColorStop(0, '#2f8a4a'); gr.addColorStop(1, '#1f6a36'); g.fillStyle = gr; g.fillRect(0, 0, w, h); noise(g, w, h, 20000, ['rgba(0,0,0,.06)', 'rgba(255,255,255,.04)'], [1, 2]);
    g.strokeStyle = 'rgba(255,240,200,.35)'; g.lineWidth = 6; g.beginPath(); g.arc(w / 2, h / 2, w * .3, 0, 7); g.stroke(); txt(g, '♠ ♥ ♣ ♦', w / 2, h / 2, 52, 'rgba(255,240,200,.3)', 900); });
  add(new T.CylinderGeometry(TR, TR, .04, 48), STD({ map: feltT, roughness: 1 }), TC.x, TH, TC.z, { cast: false });
  add(new T.TorusGeometry(TR + .03, .06, 10, 48), STD({ map: planksT('#5a2e18', 6), roughness: .4 }), TC.x, TH, TC.z, { rx: Math.PI / 2 });
  add(new T.CylinderGeometry(TR - .05, TR - .2, .12, 40), MAT.woodDk, TC.x, TH - .08, TC.z);
  add(new T.CylinderGeometry(.12, .16, TH - .12, 16), MAT.woodDk, TC.x, (TH - .12) / 2, TC.z); add(new T.CylinderGeometry(.5, .55, .05, 24), MAT.woodDk, TC.x, .025, TC.z);
  // sillas alrededor: ángulos (0 = hacia +z = delante, hacia la cámara)
  const SEATS = { manolo: Math.PI, pepe: Math.PI + .95, luis: Math.PI - .95, toni: 0 };   // en vertical: manolo al fondo, pepe y luis en las diagonales del fondo (izq./dcha.), toni delante de espaldas
  const seatPos = (a, r = TR + .32) => new T.Vector3(TC.x + Math.sin(a) * r, 0, TC.z + Math.cos(a) * r);
  Object.values(SEATS).forEach(a => { const p = seatPos(a, TR + .45), g = new T.Group(); g.position.copy(p); g.rotation.y = a + Math.PI; scene.add(g);
    add(RB(.46, .05, .44, .02), MAT.wood, 0, .46, 0, { parent: g }); add(RB(.46, .55, .05, .02), MAT.wood, 0, .74, -.2, { parent: g }); [[-.2, -.18], [.2, -.18], [-.2, .18], [.2, .18]].forEach(([x, z]) => add(new T.CylinderGeometry(.025, .025, .46, 6), MAT.woodDk, x, .23, z, { parent: g })); });
  // lámpara verde colgada sobre la mesa y cartel de RESERVADO
  { const lp = new T.Group(); lp.position.set(TC.x, 2.4, TC.z); scene.add(lp); add(new T.CylinderGeometry(.008, .008, 1.1, 4), MAT.black, 0, .6, 0, { parent: lp, noInk: true });
    add(new T.ConeGeometry(.34, .26, 28, 1, true), STD({ color: '#1f6a3a', side: T.DoubleSide, roughness: .4 }), 0, 0, 0, { parent: lp }); add(new T.SphereGeometry(.1, 12, 10), STD({ color: '#fff6dc', emissive: '#ffe6b0', emissiveIntensity: 2.2 }), 0, -.1, 0, { parent: lp, cast: false }); }
  var RESV = sign(.34, .12, 70, (g, w, h) => { g.fillStyle = '#fbf6e8'; g.fillRect(0, 0, w, h); txt(g, 'RESERVADO', w / 2, h / 2 + 2, 34, '#c8302e', 900); }, TC.x - .42, TH + .08, TC.z + .42, { rx: -.5, ry: .5, d: .02 });
  // pizarra de partidas (pared derecha, junto a la mesa): W2.setScore(ganadas)
  var SCORE = signTex(600, 440); { const sg = new T.Group(); sg.position.set(X1 - .04, 2.0, TC.z - .3); sg.rotation.y = -Math.PI / 2; scene.add(sg); add(RB(1.25, .92, .04, .02), STD({ color: '#8a5a2a' }), 0, 0, 0, { parent: sg }); add(new T.PlaneGeometry(1.15, .84), STD({ map: SCORE.t, roughness: .9 }), 0, 0, .025, { parent: sg, cast: false, noInk: true }); }
  // trofeo de broma en la estantería de la derecha: «AL PEOR JUGADOR»
  BX(X1 - .3, X1, 1.55, 1.6, -.2, 1.2, MAT.wood);
  { const tr = new T.Group(); tr.position.set(X1 - .16, 1.6, .5); scene.add(tr); add(RB(.16, .08, .16, .02), MAT.woodDk, 0, .04, 0, { parent: tr }); add(new T.CylinderGeometry(.02, .02, .14, 8), MAT.gold, 0, .15, 0, { parent: tr }); add(new T.SphereGeometry(.09, 12, 10, 0, 6.3, 0, 1.8), MAT.gold, 0, .27, 0, { parent: tr }); [-1, 1].forEach(sd => add(new T.TorusGeometry(.04, .01, 6, 10, Math.PI), MAT.gold, sd * .1, .27, 0, { parent: tr, ry: Math.PI / 2, rz: sd * 1.5 }));
    sign(.15, .05, 60, (g, w, h) => { g.fillStyle = '#d8a640'; g.fillRect(0, 0, w, h); txt(g, 'AL PEOR', w / 2, h / 2 + 2, 30, '#3a2604', 900); }, -.081, .04, 0, { parent: tr, ry: -Math.PI / 2, d: .005 });
    var TROPHY = tr; }
  [[.9, '#c8302e'], [1.05, '#2f6fbf'], [.75, '#e8b830']].forEach(([z, c]) => add(RB(.12, .22, .05, .01), STD({ color: c }), X1 - .14, 1.71, z, { ry: .1 }));
  // diana y máquina tragaperras (pared derecha, delante)
  { const dg = new T.Group(); dg.position.set(X1 - .05, 1.75, 3.2); dg.rotation.y = -Math.PI / 2; scene.add(dg); add(new T.CylinderGeometry(.24, .24, .05, 32), STD({ map: tex(256, 256, (g, w, h) => { for (let r = 6; r > 0; r--) { g.fillStyle = r % 2 ? '#1b1b1b' : '#f2e6c0'; g.beginPath(); g.arc(w / 2, h / 2, r * 20, 0, 7); g.fill(); } for (let k = 0; k < 20; k++) { g.strokeStyle = '#c8a050'; g.lineWidth = 2; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.cos(k * .314) * 120, h / 2 + Math.sin(k * .314) * 120); g.stroke(); } g.fillStyle = '#c8302e'; g.beginPath(); g.arc(w / 2, h / 2, 10, 0, 7); g.fill(); }) }), 0, 0, 0, { parent: dg, rx: Math.PI / 2 });
    [[.05, .03], [-.08, .1]].forEach(([x, y]) => add(new T.CylinderGeometry(.006, .006, .12, 4), MAT.steelShiny, x, y, .08, { parent: dg, rx: Math.PI / 2, noInk: true })); }
  const SLOT = new T.Group(); SLOT.position.set(X1 - .45, 0, 4.6); SLOT.rotation.y = -Math.PI / 2; scene.add(SLOT);
  { add(RB(.7, 1.6, .5, .05), STD({ color: '#c8302e', metalness: .3, roughness: .35 }), 0, .8, 0, { parent: SLOT }); add(RB(.6, .3, .1, .03), STD({ color: '#ffd34a', emissive: '#ffb020', emissiveIntensity: 1.2 }), 0, 1.72, .05, { parent: SLOT, cast: false });
    var SLOTC = signTex(256, 128); add(new T.PlaneGeometry(.5, .25), new T.MeshBasicMaterial({ map: SLOTC.t, toneMapped: false }), 0, 1.15, .255, { parent: SLOT, cast: false, noInk: true });
    add(new T.CylinderGeometry(.02, .02, .35, 6), MAT.steelShiny, .4, 1.15, 0, { parent: SLOT }); add(new T.SphereGeometry(.05, 10, 8), MAT.red, .4, 1.34, 0, { parent: SLOT });
    var SLOTL = []; for (let k = 0; k < 8; k++) SLOTL.push(add(new T.SphereGeometry(.025, 8, 6), STD({ color: '#fff', emissive: '#ffd34a', emissiveIntensity: 1.5 }), -.3 + k * .085, 1.52, .26, { parent: SLOT, cast: false, noInk: true })); }
  // mesa de la cena (izquierda, junto a la ventana): mantel blanco
  const dinT = tex(256, 256, (g, w, h) => { g.fillStyle = '#f6f2e8'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(200,60,50,.35)'; g.lineWidth = 6; for (let k = 0; k < 8; k++) { g.beginPath(); g.moveTo(k * w / 8, 0); g.lineTo(k * w / 8, h); g.stroke(); g.beginPath(); g.moveTo(0, k * h / 8); g.lineTo(w, k * h / 8); g.stroke(); } });
  BX(DT.x - .9, DT.x + .9, .74, .78, DT.z - .55, DT.z + .55, STD({ map: dinT, roughness: .9 })); BX(DT.x - .92, DT.x + .92, .5, .76, DT.z - .57, DT.z + .57, STD({ map: dinT, roughness: .9 }), { cast: false });
  [[-.6, -.85], [0, -.85], [.6, -.85], [-.6, .85], [0, .85], [.6, .85]].forEach(([dx, dz]) => { const g = new T.Group(); g.position.set(DT.x + dx, 0, DT.z + dz); g.rotation.y = dz < 0 ? 0 : Math.PI; scene.add(g); add(RB(.42, .05, .4, .02), MAT.wood, 0, .46, 0, { parent: g }); add(RB(.42, .5, .05, .02), MAT.wood, 0, .72, -.18, { parent: g }); [[-.18, -.16], [.18, -.16], [-.18, .16], [.18, .16]].forEach(([x, z]) => add(new T.CylinderGeometry(.022, .022, .46, 6), MAT.woodDk, x, .23, z, { parent: g })); });
  // la cena: chuletón en piedra (humea), copas de gin-tonic, botella cara, la cuenta. Grupo DINNER (visible en las escenas de la cena)
  const DINNER = new T.Group(); scene.add(DINNER);
  { const stone = (x, z) => { add(RB(.42, .05, .28, .02), STD({ color: '#3a3a40', roughness: .9 }), DT.x + x, .8, DT.z + z, { parent: DINNER }); add(RB(.34, .045, .2, .03), STD({ map: tex(256, 128, (g, w, h) => { g.fillStyle = '#5a2a14'; g.fillRect(0, 0, w, h); for (let k = 0; k < 7; k++) { const x = 12 + k * 34; g.fillStyle = '#7a3a1c'; g.fillRect(x, 6, 30, h - 12); g.fillStyle = '#d06a5a'; g.fillRect(x + 4, 14, 22, h - 40); g.fillStyle = '#e88a7a'; g.fillRect(x + 8, 22, 12, h - 60); g.fillStyle = '#f6ead0'; g.fillRect(x + 2, h - 28, 26, 10); }
      g.strokeStyle = 'rgba(30,10,4,.7)'; g.lineWidth = 5; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(k * 46, 0); g.lineTo(k * 46 + 40, h); g.stroke(); } for (let i = 0; i < 60; i++) { g.fillStyle = '#fff'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }), roughness: .55 }), DT.x + x, .848, DT.z + z, { parent: DINNER });
    add(new T.CapsuleGeometry(.025, .16, 4, 8), STD({ color: '#f2ead6' }), DT.x + x - .02, .875, DT.z + z - .1, { parent: DINNER, rz: Math.PI / 2 }); };
    stone(-.45, -.15); stone(.45, -.15); stone(0, .2);
    [[-.7, .3], [.7, .3], [0, -.35]].forEach(([x, z]) => { const g = new T.Group(); g.position.set(DT.x + x, .78, DT.z + z); DINNER.add(g); add(new T.CylinderGeometry(.006, .006, .1, 6), STD({ color: '#e8f4f8', transparent: true, opacity: .6 }), 0, .05, 0, { parent: g });
      add(new T.SphereGeometry(.07, 16, 12, 0, 6.3, 0, 1.9), STD({ color: '#d8f0f8', transparent: true, opacity: .35, roughness: .05, side: T.DoubleSide }), 0, .17, 0, { parent: g, cast: false }); add(new T.SphereGeometry(.06, 12, 8, 0, 6.3, 1.5, 1.4), STD({ color: '#e8f8ff', transparent: true, opacity: .5 }), 0, .16, 0, { parent: g });
      add(new T.TorusGeometry(.02, .006, 6, 10), STD({ color: '#8ac83a' }), .04, .2, 0, { parent: g, noInk: true }); add(new T.SphereGeometry(.012, 6, 5), STD({ color: '#3a6a9a' }), -.02, .17, .02, { parent: g, noInk: true }); });
    const bot = new T.Group(); bot.position.set(DT.x + .1, .78, DT.z - .05); DINNER.add(bot); add(new T.CylinderGeometry(.05, .055, .26, 14), STD({ color: '#2a0a12', roughness: .15 }), 0, .13, 0, { parent: bot }); add(new T.CylinderGeometry(.018, .04, .1, 10), STD({ color: '#2a0a12' }), 0, .31, 0, { parent: bot }); add(new T.CylinderGeometry(.02, .02, .04, 8), MAT.gold, 0, .37, 0, { parent: bot });
    add(new T.CylinderGeometry(.056, .056, .1, 14, 1, true), STD({ map: tex(128, 64, (g, w, h) => { g.fillStyle = '#f2e6c0'; g.fillRect(0, 0, w, h); g.fillStyle = '#d8a640'; g.fillRect(0, 6, w, 6); g.fillRect(0, h - 12, w, 6); txt(g, 'GRAN', w / 2, 24, 16, '#5a2a1a', 900); txt(g, 'RESERVA', w / 2, 42, 14, '#5a2a1a', 900); }), side: T.DoubleSide }), 0, .12, 0, { parent: bot, cast: false, noInk: true });
    [[-.45, .3], [.45, .3]].forEach(([x, z]) => add(new T.CylinderGeometry(.13, .13, .015, 18), STD({ color: '#f4f0e6' }), DT.x + x, .79, DT.z + z, { parent: DINNER })); }
  DINNER.visible = false;
  // la cuenta en su platillo (en la mano del camarero se dibuja en 2D)
  // ---------- luces del bar ----------
  [[-4, -1.5], [0, -1.5], [-4, 2.5], [1, 2.5]].forEach(([x, z]) => { add(new T.CylinderGeometry(.01, .01, .5, 4), MAT.black, x, RH - .25, z, { noInk: true }); add(new T.SphereGeometry(.16, 14, 10), STD({ color: '#fff4dc', emissive: '#ffd890', emissiveIntensity: 1.4 }), x, RH - .55, z, { cast: false }); });
  zoneLight('#ffd9a8', 9, 9, -3.5, 2.7, -1.6, inBar); zoneLight('#ffd9a8', 8, 9, .5, 2.7, -1.5, inBar); zoneLight('#ffd0a0', 7, 9, -3.8, 2.7, 2.6, inBar); zoneLight('#ffd9a8', 6, 9, 1.5, 2.7, 3.0, inBar);
  var TABLELAMP = zoneLight('#fff0c8', 14, 4.5, TC.x, 2.05, TC.z, inBar, { decay: 1.3 }); TABLELAMP.castShadow = true; TABLELAMP.shadow.mapSize.set(1024, 1024); TABLELAMP.shadow.bias = -.002;
  zoneLight('#ffc890', 4, 5, -3.6, 1.6, BZ - .6, inBar); zoneLight('#9ab0ff', 3, 7, X0 + .6, 2.0, 2.0, inBar); zoneLight('#ff6a8a', 1.6, 3, X1 - .6, 1.4, 4.4, inBar);

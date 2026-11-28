  // =====================================================================================================
  // 73 · DECORADOS EN TIERRA (cada uno en su grupo; se encienden con su ambiente)
  //  londres  : calle de Londres con niebla, 1964 (cabina roja, buzón rojo, cartel de viajes, farolas, Big Ben al fondo)
  //  taller   : garaje del amigo (banco de trabajo, panel de herramientas, lámpara colgante) con la caja en el centro
  //  almacen  : nave de carga (moods niebla = Londres, perth = tarde en Perth, noche = Perth de noche)
  //  pista    : escala en Bombay: asfalto al sol, terminal blanca, palmeras, el avión aparcado y la caja sola en un carro
  //  casa     : salón de Perth con la fiesta de cumpleaños
  // =====================================================================================================
  const hsW = (a, b = 1) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
  const XL = {}; const pl = (name, parent, col, x, y, z, dist = 12, decay = 1.4) => { const l = new T.PointLight(col, 0, dist, decay); l.position.set(x, y, z); parent.add(l); XL[name] = l; return l; };
  const lampHead = (parent, x, y, z, col = '#ffd9a0') => { add(new T.CylinderGeometry(.02, .02, 1.2, 6), MAT.black, x, y + .6, z, { parent }); add(new T.ConeGeometry(.42, .34, 20, 1, true), STD({ color: '#2f4a3a', roughness: .5, metalness: .3, side: T.DoubleSide }), x, y, z, { parent });
    add(new T.SphereGeometry(.12, 12, 8), STD({ color: '#fff4d8', emissive: col, emissiveIntensity: 3 }), x, y - .1, z, { parent, cast: false, noInk: true }); };
  // ---------- LONDRES ----------
  const LON = zone('londres');
  { const cob = PBR(cobblePBR('#7a7680'), { roughness: .35, metalness: .1, bump: 3, envMapIntensity: 1.3 }), pave = PBR(plasterPBR('#9a968c', 512, .3), { roughness: .8, bump: 1 });
    floorXZ(-3.6, 3.6, -60, 12, 0, cob, 2.2, { parent: LON }); [-1, 1].forEach(sd => { floorXZ(sd > 0 ? 3.6 : -9, sd > 0 ? 9 : -3.6, -60, 12, .16, pave, 2, { parent: LON }); add(new T.BoxGeometry(.2, .18, 72), MAT.stoneDk, sd * 3.6, .08, -24, { parent: LON }); });
    const brick = PBR(ashlar('#8a4a36', '#6a5a50', 18, 1024), { roughness: .9, bump: 2.5 }), trim = STD({ color: '#e8e2d4', roughness: .7 });
    [-1, 1].forEach(sd => { const x = sd * 9; for (let k = 0; k < 9; k++) { const z0 = 10 - k * 7.4, h = 9 + (k % 3) * 1.4, G = new T.Group(); LON.add(G);
        BX(sd > 0 ? 9 : -12, sd > 0 ? 12 : -9, 0, h, z0 - 7.3, z0, brick, { parent: G }); BX(sd > 0 ? 8.9 : -9.1, sd > 0 ? 9.1 : -8.9, h - .5, h - .2, z0 - 7.3, z0, trim, { parent: G });
        for (let fl = 0; fl < 3; fl++) for (let w = 0; w < 2; w++) { const lit = hsW(k * 7 + fl * 3 + w + (sd > 0 ? 50 : 0), 2) > .45; const win = paintedWin(sd * 8.95, 2.4 + fl * 2.6, z0 - 1.9 - w * 3.6, 1.1, 1.6, sd > 0 ? -Math.PI / 2 : Math.PI / 2,
            (g, W_, H_) => { const gr = g.createLinearGradient(0, 0, 0, H_); gr.addColorStop(0, lit ? '#ffd88a' : '#3a4250'); gr.addColorStop(1, lit ? '#e8a050' : '#262c38'); g.fillStyle = gr; g.fillRect(0, 0, W_, H_); if (lit) { g.fillStyle = 'rgba(120,60,20,.35)'; g.fillRect(W_ * .1, H_ * .15, W_ * .35, H_ * .8); } }, lit ? 1.1 : .25, trim);
          win.parent.remove(win); G.add(win); }
        const door = add(RB(.12, 2.3, 1.1, .02), STD({ color: ['#1f3a5a', '#5a1f2a', '#1f4a32', '#2a2a30'][k % 4], roughness: .5 }), sd * 8.95, 1.15, z0 - 5.6, { parent: G }); } });
    // cabina telefónica roja (K6)
    const RED = STD({ color: '#c8202a', roughness: .35, metalness: .1, envMapIntensity: 1.2 }), GLS = STD({ color: '#ffe8b0', emissive: '#ffcf80', emissiveIntensity: .55, roughness: .2 });
    const PB = new T.Group(); PB.position.set(5.1, .16, -3.2); LON.add(PB); add(RB(1.1, .2, 1.1, .03), RED, 0, .1, 0, { parent: PB }); add(RB(1.0, 2.3, 1.0, .05), RED, 0, 1.35, 0, { parent: PB });
    [[0, .51], [Math.PI / 2, .51], [-Math.PI / 2, .51], [Math.PI, .51]].forEach(([ry]) => { const F = new T.Group(); F.rotation.y = ry; PB.add(F); for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) add(new T.PlaneGeometry(.22, .24), GLS, -.27 + c * .27, .62 + r * .29, .51, { parent: F, cast: false, noInk: true });
      sign(.7, .12, 64, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h); txt(g, 'TELEPHONE', w / 2, h / 2 + 2, h * .7, '#1b1720', 800); }, 0, 2.38, .52, { parent: F, d: .02, glow: .6 }); });
    add(new T.CylinderGeometry(.56, .56, .3, 24, 1, false, 0, Math.PI), RED, 0, 2.62, 0, { parent: PB, rz: Math.PI / 2, ry: Math.PI / 2 }); add(RB(1.12, .14, 1.12, .04), RED, 0, 2.5, 0, { parent: PB });
    pl('boothL', PB, '#ffd9a0', 0, 2.0, 0, 5, 1.5);
    // buzón rojo (pillar box)
    const BXG = new T.Group(); BXG.position.set(-4.3, .16, -21.5); LON.add(BXG); add(new T.CylinderGeometry(.34, .36, 1.45, 28), RED, 0, .72, 0, { parent: BXG }); add(new T.SphereGeometry(.38, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), RED, 0, 1.46, 0, { parent: BXG, s: [1, .55, 1] });
    add(new T.CylinderGeometry(.4, .4, .12, 28), MAT.black, 0, 1.44, 0, { parent: BXG }); add(new T.CylinderGeometry(.4, .42, .14, 28), MAT.black, 0, .07, 0, { parent: BXG }); add(RB(.36, .05, .06, .02), MAT.black, 0, 1.18, .34, { parent: BXG });
    sign(.34, .2, 64, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h); txt(g, 'POST', w / 2, h * .38, h * .38, '#c8202a'); txt(g, 'OFFICE', w / 2, h * .76, h * .3, '#c8202a', 800); }, 0, .92, .35, { parent: BXG, d: .01 });
    // cartel de viajes en la pared (billete carísimo)
    sign(2.2, 3.0, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2f7fd0'); gr.addColorStop(.6, '#ffd48a'); gr.addColorStop(1, '#e8963a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.fillStyle = '#f6f2e6'; g.beginPath(); g.ellipse(w * .5, h * .3, w * .36, h * .05, -.15, 0, 7); g.fill(); g.fillStyle = '#c8202a'; g.fillRect(w * .2, h * .29, w * .6, h * .02);
      txt(g, 'VUELE A', w / 2, h * .5, w * .1, '#1b1720', 800); txt(g, 'AUSTRALIA', w / 2, h * .6, w * .15, '#c8202a', 900, 'center', 8, '#f6f2e6'); txt(g, '£ 300', w / 2, h * .8, w * .2, '#1b1720', 900, 'center', 8, '#ffd34a');
      g.strokeStyle = '#1b1720'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); }, -8.88, 2.6, -8.0, { parent: LON, ry: Math.PI / 2, d: .03 });
    // farolas
    [[3.9, -9], [-3.9, 1.2], [3.9, 8.6], [-3.9, -16]].forEach(([x, z], i) => { const G = new T.Group(); G.position.set(x, .16, z); LON.add(G); add(new T.CylinderGeometry(.07, .1, 4.2, 10), MAT.black, 0, 2.1, 0, { parent: G });
      add(RB(.44, .6, .44, .05), STD({ color: '#ffe6b0', emissive: '#ffc870', emissiveIntensity: 1.6 }), 0, 4.4, 0, { parent: G, cast: false }); add(new T.ConeGeometry(.36, .26, 4), MAT.black, 0, 4.82, 0, { parent: G, ry: Math.PI / 4 }); pl('lamp' + i, G, '#ffc880', 0, 4.2, 0, 11, 1.3); });
    // Big Ben entre la niebla
    const BB = new T.Group(); BB.position.set(6, 0, -95); LON.add(BB); const BBM = STD({ color: '#5a5448', roughness: .9 }); add(RB(7, 46, 7, .1), BBM, 0, 23, 0, { parent: BB }); add(new T.ConeGeometry(5, 14, 4), BBM, 0, 53, 0, { parent: BB, ry: Math.PI / 4 });
    add(new T.CircleGeometry(2.6, 32), STD({ color: '#ffeec8', emissive: '#ffd890', emissiveIntensity: 1.2 }), 0, 38, 3.52, { parent: BB, cast: false, noInk: true }); }
  // ---------- TALLER ----------
  const TAL = zone('taller');
  { const brick = PBR(ashlar('#9a5a40', '#7a6a5e', 16, 1024), { roughness: .9, bump: 2.5 }), conc = PBR(plasterPBR('#8e8a82', 1024, .8), { roughness: .9, bump: 1.5 });
    floorXZ(-5, 5, -4.5, 4.5, 0, conc, 2.5, { parent: TAL }); wallXY(-5, 5, 0, 3.6, -4.5, brick, 2.4, { parent: TAL }); wallZY(-4.5, 4.5, 0, 3.6, -5, brick, 2.4, 1, { parent: TAL, ry: Math.PI / 2 }); wallZY(-4.5, 4.5, 0, 3.6, 5, brick, 2.4, -1, { parent: TAL, ry: -Math.PI / 2 });
    add(RB(10, .2, 9, .02), PBR(planksPBR('#6a4a30', 8, 512), { roughness: .9 }), 0, 3.7, 0, { parent: TAL }); for (let x = -4; x <= 4; x += 2) add(RB(.2, .3, 9, .02), MAT.woodDk, x, 3.5, 0, { parent: TAL });
    // banco de trabajo con tornillo, panel de herramientas, estante con latas de pintura, ventana con niebla
    const bench = PBR(planksPBR('#9a6a3e', 4, 512), { roughness: .8 }); add(RB(4.2, .14, 1.0, .02), bench, -1.2, 1.0, -3.85, { parent: TAL }); [-3.1, .7].forEach(x => add(RB(.12, 1.0, .9, .02), MAT.woodDk, x, .5, -3.85, { parent: TAL }));
    add(RB(.3, .25, .2, .04), STD({ color: '#3a5a8a', metalness: .4, roughness: .4 }), -2.8, 1.2, -3.5, { parent: TAL });
    add(RB(3.6, 1.6, .06, .01), STD({ map: tex(512, 256, (g, w, h) => { g.fillStyle = '#c8b48a'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 24; i++) for (let j = 0; j < 12; j++) { g.beginPath(); g.arc(10 + i * 21, 10 + j * 21, 2, 0, 7); g.fill(); }
      const tool = (x, y, w2, h2, c) => { g.fillStyle = c; g.fillRect(x, y, w2, h2); g.strokeStyle = '#1b1720'; g.lineWidth = 3; g.strokeRect(x, y, w2, h2); };
      tool(30, 30, 16, 120, '#7a4a22'); tool(18, 30, 40, 26, '#5a5a62'); tool(90, 40, 120, 30, '#c9ced6'); tool(90, 40, 30, 70, '#8a5a2a'); tool(240, 30, 10, 140, '#c8302e'); tool(232, 30, 26, 18, '#c9ced6'); tool(300, 50, 70, 70, '#e8b830'); tool(400, 30, 12, 150, '#3a6a9a'); tool(440, 40, 50, 18, '#5a5a62'); }), roughness: .9 }), -1.2, 2.3, -4.42, { parent: TAL });
    [[1.6, 1.9], [1.6, 2.6]].forEach(([x, y]) => add(RB(1.6, .06, .4, .01), MAT.woodDk, x + 1.6, y, -4.25, { parent: TAL }));
    [['#c8302e', 2.5, 2.05], ['#2f6fbf', 2.95, 2.05], ['#e8b830', 3.5, 2.05], ['#3a8a5a', 2.7, 2.75], ['#f3f2ee', 3.3, 2.75]].forEach(([c, x, y]) => add(new T.CylinderGeometry(.14, .14, .3, 16), STD({ color: c, roughness: .5, metalness: .2 }), x, y, -4.2, { parent: TAL }));
    { const wg = paintedWin(4.95, 2.1, -1.0, 1.3, 1.2, -Math.PI / 2, (g, w, h) => { g.fillStyle = '#9aa2b0'; g.fillRect(0, 0, w, h); blot(g, w, h, 6, 'rgba(255,255,255,.4)', 40, 140); }, .7); scene.remove(wg); TAL.add(wg); }
    lampHead(TAL, 0, 3.0, .2); pl('talL', TAL, '#ffd6a0', 0, 2.7, .2, 9, 1.3); pl('talF', TAL, '#b8c8e8', 3.5, 2.4, 2.5, 8, 1.6);
    // sierra de mano y tablones sueltos en el suelo, serrín
    [[-3.6, .06, 1.6, .2], [-3.4, .14, 1.9, -.1]].forEach(([x, y, z, r]) => add(RB(2.0, .06, .26, .01), PBR(planksPBR('#d6a46a', 2, 256)), x, y, z, { parent: TAL, ry: r }));
    add(new T.CircleGeometry(1.4, 24), STD({ color: '#d8b888', roughness: 1, transparent: true, opacity: .5 }), .2, .005, .6, { parent: TAL, rx: -Math.PI / 2, cast: false, noInk: true }); }
  const CRT = crate(TAL, .1, 0, .3, 0, false, 0);   // la caja del taller (tapa animable)
  const SUPT = supplies(CRT, 0, .07, 0);
  // ---------- ALMACÉN DE CARGA (Londres con niebla / Perth de tarde / Perth de noche) ----------
  const ALM = zone('almacen', 'niebla', 'perth', 'noche');
  { const conc = PBR(plasterPBR('#9a968e', 1024, .9), { roughness: .85, bump: 1.4 }), corr = PBR(texHB(512, 512, (g, H, w, h) => { for (let x = 0; x < w; x++) { const v = Math.sin(x / w * Math.PI * 16); g.fillStyle = `rgb(${120 + v * 18},${126 + v * 18},${132 + v * 18})`; g.fillRect(x, 0, 1, h); H.fillStyle = gray(128 + v * 90); H.fillRect(x, 0, 1, h); } blot(g, w, h, 10, 'rgba(90,60,30,.18)', 20, 90); }), { roughness: .5, metalness: .5, bump: 3 });
    floorXZ(-10, 10, -14, 10, 0, conc, 3, { parent: ALM }); wallZY(-14, 10, 0, 8, -10, corr, 4, 1, { parent: ALM, ry: Math.PI / 2 }); wallZY(-14, 10, 0, 8, 10, corr, 4, -1, { parent: ALM, ry: -Math.PI / 2 }); wallXY(-10, 10, 0, 8, 10, corr, 4, { parent: ALM, ry: Math.PI });
    // portón abierto al fondo (z = -14): marco y hojas corredizas a los lados
    wallXY(-10, -4.5, 0, 8, -14, corr, 4, { parent: ALM }); wallXY(4.5, 10, 0, 8, -14, corr, 4, { parent: ALM }); wallXY(-4.5, 4.5, 6, 8, -14, corr, 4, { parent: ALM });
    add(RB(.3, 6, .3, .02), STD({ color: '#d8b030', roughness: .5 }), -4.6, 3, -13.9, { parent: ALM }); add(RB(.3, 6, .3, .02), STD({ color: '#d8b030', roughness: .5 }), 4.6, 3, -13.9, { parent: ALM });
    for (let z = -12; z <= 8; z += 4) { add(RB(20, .25, .25, .02), MAT.steelDk, 0, 7.6, z, { parent: ALM }); for (let x = -9; x <= 9; x += 3) add(RB(.08, 1.3, .08, .01), MAT.steelDk, x, 7.0, z, { parent: ALM, rz: (x % 2 ? .6 : -.6) }); }
    // estanterías con cajas, sacas y maletas
    [-8.6, 8.6].forEach(x => { for (let lv = 0; lv < 3; lv++) add(RB(1.4, .1, 12, .02), MAT.steelDk, x, .6 + lv * 1.8, -2, { parent: ALM }); for (let z = -8; z <= 4; z += 4) add(RB(.1, 5.6, .1, .01), MAT.steelDk, x, 2.8, z, { parent: ALM });
      for (let lv = 0; lv < 3; lv++) for (let k = 0; k < 5; k++) { const z = -7 + k * 2.4 + hsW(lv + k, x) * .4, y = .66 + lv * 1.8; if (hsW(k, lv + x) > .5) add(RB(1.0, .9, 1.1, .03), crateM, x, y + .45, z, { parent: ALM }); else suitcase(ALM, x, y, z, .9, .62, .5, LEATHER[(k + lv) % 7], Math.PI / 2); } });
    for (let k = 0; k < 4; k++) mailSack(ALM, -6.4 + k * .9, 0, -9 + (k % 2) * .6, 1, k);
    // reloj de pared (manecillas animables)
    const CLK = new T.Group(); CLK.position.set(-9.85, 5.2, -2); CLK.rotation.y = Math.PI / 2; ALM.add(CLK); add(new T.CylinderGeometry(.75, .75, .12, 40), STD({ color: '#f6f2e6', roughness: .6 }), 0, 0, 0, { parent: CLK, rx: Math.PI / 2 });
    add(new T.TorusGeometry(.75, .07, 10, 40), MAT.black, 0, 0, .04, { parent: CLK }); for (let i = 0; i < 12; i++) add(RB(.04, .14, .02, .005), MAT.black, Math.sin(i / 12 * 6.283) * .6, Math.cos(i / 12 * 6.283) * .6, .07, { parent: CLK, rz: -i / 12 * 6.283 });
    const hH = new T.Group(), hM = new T.Group(); CLK.add(hH, hM); hH.position.z = hM.position.z = .08; add(RB(.07, .4, .02, .01), MAT.black, 0, .18, 0, { parent: hH }); add(RB(.05, .6, .02, .01), STD({ color: '#c8302e' }), 0, .27, .01, { parent: hM });
    ALM.userData.clock = (h) => { hH.rotation.z = -h / 12 * 6.283; hM.rotation.z = -h * 6.283; };
    // carteles: LONDRES (niebla) / PERTH (tarde y noche)
    const SL = sign(5, 1.0, 128, (g, w, h) => { g.fillStyle = '#1f3a6a'; g.fillRect(0, 0, w, h); txt(g, 'LONDRES · CARGA', w / 2, h / 2 + 4, h * .55, '#f6f2e6'); }, 0, 6.6, 9.85, { parent: ALM, ry: Math.PI });
    const SP = sign(5, 1.0, 128, (g, w, h) => { g.fillStyle = '#2f6a3a'; g.fillRect(0, 0, w, h); txt(g, 'PERTH · CARGA', w / 2, h / 2 + 4, h * .55, '#ffd34a'); }, 0, 6.6, 9.85, { parent: ALM, ry: Math.PI });
    ALM.userData.signs = { SL, SP };
    // fuera del portón: pista, avión aparcado (sin corte) y, en Perth, señal de canguros y eucaliptos
    floorXZ(-60, 60, -120, -14, -.01, MAT.asphalt, 6, { parent: ALM }); const PLA = makePlane(ALM, false); PLA.position.set(-6, 3.4, -52); PLA.rotation.y = -1.2; PLA.scale.setScalar(.8);
    const KS = new T.Group(); KS.position.set(6.5, 0, -20); ALM.add(KS); add(new T.CylinderGeometry(.06, .06, 2.4, 8), MAT.steel, 0, 1.2, 0, { parent: KS });
    sign(1.2, 1.2, 256, (g, w, h) => { g.fillStyle = '#ffd030'; g.fillRect(0, 0, w, h); g.strokeStyle = '#1b1720'; g.lineWidth = 14; g.strokeRect(10, 10, w - 20, h - 20); g.fillStyle = '#1b1720';
      g.beginPath(); g.ellipse(w * .5, h * .58, w * .2, h * .12, -.5, 0, 7); g.fill(); g.beginPath(); g.ellipse(w * .7, h * .36, w * .07, h * .06, 0, 0, 7); g.fill(); g.fillRect(w * .66, h * .24, w * .03, h * .1); g.fillRect(w * .73, h * .24, w * .03, h * .1);
      g.beginPath(); g.moveTo(w * .32, h * .64); g.quadraticCurveTo(w * .12, h * .8, w * .18, h * .9); g.lineWidth = 18; g.stroke(); g.fillRect(w * .42, h * .66, w * .2, h * .06); g.fillRect(w * .55, h * .66, w * .04, h * .2); }, 0, 2.6, 0, { parent: KS, rz: Math.PI / 4, d: .03 });
    ALM.userData.oz = KS; const gums = new T.Group(); ALM.add(gums); ALM.userData.gums = gums;
    [[-14, -28], [12, -34], [20, -26], [-22, -40]].forEach(([x, z]) => { add(new T.CylinderGeometry(.25, .4, 7, 10), STD({ color: '#d8ccb8', roughness: .9 }), x, 3.5, z, { parent: gums }); [0, 1, 2].forEach(k => add(new T.SphereGeometry(2.4, 14, 10), STD({ color: '#6a8a5a', roughness: 1 }), x + (k - 1) * 1.6, 7.6 + (k % 2), z, { parent: gums, s: [1, .7, 1] })); });
    // lámparas industriales
    [[-4, -6], [4, -6], [0, 2]].forEach(([x, z], i) => { lampHead(ALM, x, 6.4, z, '#ffe2b0'); pl('almL' + i, ALM, '#ffe2b0', x, 6.0, z, 14, 1.2); });
    // carro de equipaje con la caja (cerrada) encima
    const cart = new T.Group(); cart.position.set(.6, 0, -1); ALM.add(cart); add(RB(2.4, .12, 1.9, .03), MAT.steelDk, 0, .45, 0, { parent: cart });
    [[-1, -.8], [1, -.8], [-1, .8], [1, .8]].forEach(([x, z]) => add(new T.CylinderGeometry(.18, .18, .1, 16), MAT.black, x, .18, z, { parent: cart, rx: Math.PI / 2 })); add(RB(.08, .9, 1.9, .02), MAT.steelDk, -1.2, .9, 0, { parent: cart });
    ALM.userData.cart = cart; }
  const CRA = crate(ALM.userData.cart, .1, .51, 0, 0, false, 0);
  // ---------- PISTA DE BOMBAY (al sol) ----------
  const PIS = zone('pista');
  { const tar = PBR(texHB(1024, 1024, (g, H, w, h) => { g.fillStyle = '#7a7670'; g.fillRect(0, 0, w, h); speck(g, w, h, 30000, ['#6a6660', '#8a867e', '#5e5a54'], .6, 2); speck(H, w, h, 20000, [gray(90), gray(170)], .6, 2);
      g.strokeStyle = 'rgba(40,36,30,.35)'; g.lineWidth = 3; for (let i = 0; i < 6; i++) crack(g, H, rnd() * w, rnd() * h, 120, 'rgba(40,36,30,.4)'); g.fillStyle = '#f0d040'; g.fillRect(w * .48, 0, w * .04, h); }), { roughness: .85, bump: 1.5 });
    floorXZ(-80, 80, -120, 40, 0, tar, 8, { parent: PIS });
    // terminal blanca con arcos y torre de control
    const WH = PBR(plasterPBR('#f0e8d8', 1024, .5), { roughness: .8 }); BX(-40, 40, 0, 7, -62, -54, WH, { parent: PIS }); for (let x = -36; x <= 36; x += 6) add(new T.PlaneGeometry(3.4, 4), STD({ color: '#3a3a40', roughness: .8 }), x, 2.4, -53.98, { parent: PIS, cast: false, noInk: true });
    BX(12, 18, 0, 20, -60, -54, WH, { parent: PIS }); add(new T.CylinderGeometry(4.2, 4.2, 3, 8), GLASSD, 15, 21.5, -57, { parent: PIS }); add(new T.ConeGeometry(4.6, 2, 8), REDP, 15, 24, -57, { parent: PIS });
    sign(16, 2, 256, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h); txt(g, 'BOMBAY', w / 2, h / 2 + 6, h * .7, '#2f5fb0'); }, -10, 7.9, -53.9, { parent: PIS, d: .1 });
    // palmeras
    [[-30, -50], [-22, -48], [28, -49], [36, -46], [-46, -30], [44, -26]].forEach(([x, z], i) => { const G = new T.Group(); G.position.set(x, 0, z); PIS.add(G); const lean = (hsW(i, 3) - .5) * .3;
      for (let k = 0; k < 8; k++) add(new T.CylinderGeometry(.32 - k * .02, .36 - k * .02, 1.4, 10), STD({ color: k % 2 ? '#8a6a46' : '#7a5a3a', roughness: 1 }), lean * k * 1.4, .7 + k * 1.35, 0, { parent: G, rz: -lean });
      for (let f = 0; f < 8; f++) { const a = f / 8 * 6.283, fr = add(new T.ConeGeometry(.5, 5.2, 4, 1), STD({ color: f % 2 ? '#3a8a3a' : '#4a9a40', roughness: .8 }), lean * 11 + Math.cos(a) * 2.2, 11.3, Math.sin(a) * 2.2, { parent: G }); fr.rotation.set(Math.sin(a) * 1.7, 0, -Math.cos(a) * 1.7); } });
    // avión aparcado con escalerilla
    const PLB = makePlane(PIS, false); PLB.position.set(-16, 3.4, -30); PLB.rotation.y = Math.PI / 2 + .5; PLB.scale.setScalar(.75);
    add(RB(1.4, 4.2, 3.8, .05), STD({ color: '#e8e6e0', roughness: .6 }), -7, 2.1, -22, { parent: PIS, ry: .5 });
    // carro de equipaje solo, a pleno sol, con la caja
    const cart = new T.Group(); cart.position.set(0, 0, 0); PIS.add(cart); add(RB(2.4, .12, 1.9, .03), STD({ color: '#3a5a8a', roughness: .5, metalness: .3 }), 0, .45, 0, { parent: cart });
    [[-1, -.8], [1, -.8], [-1, .8], [1, .8]].forEach(([x, z]) => add(new T.CylinderGeometry(.18, .18, .1, 16), MAT.black, x, .18, z, { parent: cart, rx: Math.PI / 2 })); add(new T.CylinderGeometry(.04, .04, 1.6, 8), MAT.steelDk, 1.9, .5, 0, { parent: cart, rz: 1.3 });
    PIS.userData.cart = cart;
    // conos naranjas y un tractor de pista
    [[3, 4], [-3, 5], [5, -3]].forEach(([x, z]) => add(new T.ConeGeometry(.22, .6, 16), STD({ color: '#ff7a1a', roughness: .5 }), x, .3, z, { parent: PIS }));
    const TR = new T.Group(); TR.position.set(-7, 0, 6); TR.rotation.y = .7; PIS.add(TR); add(RB(2.2, 1.0, 1.5, .1), STD({ color: '#e8b830', roughness: .5 }), 0, .9, 0, { parent: TR }); add(RB(1.0, .9, 1.3, .1), STD({ color: '#e8b830', roughness: .5 }), -.4, 1.8, 0, { parent: TR });
    [[-.7, -.75], [.7, -.75], [-.7, .75], [.7, .75]].forEach(([x, z]) => add(new T.CylinderGeometry(.38, .38, .3, 16), MAT.black, x, .38, z, { parent: TR, rx: Math.PI / 2 })); }
  const CRP = crate(PIS.userData.cart, .1, .51, 0, 0, false, 0);
  // ---------- CASA (salón de la fiesta) ----------
  const CAS = zone('casa');
  { const wp_ = tex(512, 512, (g, w, h) => { g.fillStyle = '#f2dcb4'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(200,120,80,.22)'; g.fillRect(i * 64, 0, 22, h); } for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = 'rgba(230,140,60,.35)'; g.beginPath(); g.arc(i * 64 + 43, j * 64 + 32, 8, 0, 7); g.fill(); } });
    const WP = STD({ map: wp_, roughness: .85 }); wp_.repeat.set(1, 1);
    floorXZ(-6, 6, -4, 5, 0, PBR(planksPBR('#a86a3a', 8, 1024), { roughness: .55, bump: 1.4, envMapIntensity: .8 }), 2.5, { parent: CAS }); wallXY(-6, 6, 0, 3.4, -4, WP, 2, { parent: CAS }); wallZY(-4, 5, 0, 3.4, -6, WP, 2, 1, { parent: CAS, ry: Math.PI / 2 }); wallZY(-4, 5, 0, 3.4, 6, WP, 2, -1, { parent: CAS, ry: -Math.PI / 2 });
    add(RB(12, .1, 9, .02), STD({ color: '#f6f2e6' }), 0, 3.45, .5, { parent: CAS }); add(RB(12, .3, .12, .02), STD({ color: '#f6f2e6' }), 0, .15, -3.94, { parent: CAS });
    // ventana soleada, puerta de la calle (pared derecha), cuadros
    { const wg = paintedWin(-2.6, 1.9, -3.95, 1.8, 1.4, 0, (g, w, h) => { skyView(g, w, h); g.fillStyle = '#6a9a4a'; g.fillRect(0, h * .75, w, h * .25); }, 1.0); scene.remove(wg); CAS.add(wg); }
    const DOOR = new T.Group(); DOOR.position.set(5.95, 0, 2.6); CAS.add(DOOR); const leaf = new T.Group(); DOOR.add(leaf); leaf.position.z = -.5; add(RB(.08, 2.3, 1.0, .02), STD({ color: '#3a6a5a', roughness: .5 }), 0, 1.15, .5, { parent: leaf }); add(new T.SphereGeometry(.05, 10, 8), MAT.brass, -.06, 1.1, .9, { parent: leaf });
    add(new T.PlaneGeometry(1.0, 2.3), STD({ map: tex(128, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#8fc4ff'); gr.addColorStop(.6, '#e8f0f6'); gr.addColorStop(1, '#7aa85a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }), emissive: '#ffffff', emissiveIntensity: .0, roughness: 1 }), 5.99, 1.15, 2.6, { parent: CAS, ry: -Math.PI / 2, cast: false, noInk: true });
    CAS.userData.door = leaf;
    [[-4.6, 2.2, '#c89a5a'], [1.4, 2.4, '#5a8ac8']].forEach(([x, y, c]) => sign(.9, .7, 128, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); g.fillStyle = '#f6f2e6'; g.beginPath(); g.arc(w / 2, h * .45, h * .22, 0, 7); g.fill(); g.strokeStyle = '#6a4a22'; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12); }, x, y, -3.92, { parent: CAS, d: .04 }));
    // mesa con mantel, tarta con velas, regalos, globos y guirnalda
    const TB = new T.Group(); TB.position.set(0, 0, -.6); CAS.add(TB); add(new T.CylinderGeometry(1.25, 1.25, .08, 36), STD({ color: '#f6f2e6', roughness: .9 }), 0, .9, 0, { parent: TB }); add(new T.CylinderGeometry(1.3, 1.25, .35, 36, 1, true), STD({ color: '#f6f2e6', roughness: .9, side: T.DoubleSide }), 0, .72, 0, { parent: TB }); add(new T.CylinderGeometry(.12, .2, .9, 12), MAT.woodDk, 0, .45, 0, { parent: TB });
    add(new T.CylinderGeometry(.42, .42, .32, 32), STD({ color: '#f6c8d8', roughness: .7 }), 0, 1.1, 0, { parent: TB }); add(new T.CylinderGeometry(.44, .44, .06, 32), STD({ color: '#f6f2e6', roughness: .7 }), 0, 1.27, 0, { parent: TB });
    for (let i = 0; i < 12; i++) add(new T.SphereGeometry(.035, 8, 6), STD({ color: ['#c8302e', '#2f6fbf', '#e8b830'][i % 3] }), Math.cos(i / 12 * 6.283) * .43, 1.18, Math.sin(i / 12 * 6.283) * .43, { parent: TB, cast: false, noInk: true });
    const FLM = []; for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283, x = Math.cos(a) * .22, z = Math.sin(a) * .22; add(new T.CylinderGeometry(.018, .018, .2, 8), STD({ color: ['#2f6fbf', '#c8302e', '#e8b830', '#3a8a5a', '#f6f2e6'][i] }), x, 1.4, z, { parent: TB });
      FLM.push(add(new T.SphereGeometry(.035, 10, 8), STD({ color: '#ffe8a0', emissive: '#ffb030', emissiveIntensity: 3 }), x, 1.54, z, { parent: TB, cast: false, noInk: true, s: [1, 1.7, 1] })); }
    TICK.push(t => FLM.forEach((f, i) => f.scale.set(1, 1.6 + Math.sin(t * 19 + i * 2) * .25, 1)));
    [[.85, .2, '#2f6fbf', '#e8b830'], [-.8, .35, '#c8302e', '#f6f2e6'], [.45, -.75, '#3a8a5a', '#c8302e']].forEach(([x, z, c, rb]) => { add(RB(.32, .26, .32, .03), STD({ color: c, roughness: .5 }), x, 1.07, z, { parent: TB }); add(RB(.34, .27, .06, .01), STD({ color: rb }), x, 1.07, z, { parent: TB }); add(RB(.06, .27, .34, .01), STD({ color: rb }), x, 1.07, z, { parent: TB }); });
    const BAL = []; [[-3.6, 2.1, -3.2, '#c8302e'], [-3.1, 2.4, -3.3, '#e8b830'], [3.4, 2.2, -3.3, '#2f6fbf'], [3.9, 2.0, -2.8, '#3a8a5a'], [-5.2, 2.3, .2, '#f08a3a'], [-5.3, 2.0, 1.1, '#9a5ac8']].forEach(([x, y, z, c], i) => {
      const b = add(new T.SphereGeometry(.3, 20, 14), STD({ color: c, roughness: .25, envMapIntensity: 1.2 }), x, y, z, { parent: CAS, s: [1, 1.18, 1] }); BAL.push([b, y, i]);
      const g = new T.BufferGeometry().setFromPoints([new T.Vector3(x, y - .34, z), new T.Vector3(x + .05, .9, z + .05)]); CAS.add(new T.Line(g, new T.LineBasicMaterial({ color: '#f6f2e6' }))); });
    TICK.push(t => BAL.forEach(([b, y, i]) => b.position.y = y + Math.sin(t * 1.3 + i) * .04));
    { const pts = [], cols = ['#c8302e', '#e8b830', '#2f6fbf', '#3a8a5a', '#f08a3a']; for (let i = 0; i < 18; i++) { const u = i / 17, x = -5.6 + u * 11.2, y = 3.2 - Math.sin(u * Math.PI) * .7;
      const f = add(new T.ConeGeometry(.16, .34, 3), STD({ color: cols[i % 5], roughness: .7, side: T.DoubleSide }), x, y - .18, -3.85, { parent: CAS, rx: Math.PI, cast: false }); pts.push(new T.Vector3(x, y, -3.85)); }
      CAS.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: '#6a4a22' }))); }
    sign(3.4, .6, 128, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h); txt(g, '¡FELIZ CUMPLE!', w / 2, h / 2 + 4, h * .62, '#c8302e', 900, 'center', 6, '#ffd34a'); }, 0, 2.55, -3.9, { parent: CAS, d: .03 });
    // sofá y alfombra
    add(RB(2.6, .5, 1.0, .12), STD({ color: '#5a8a7a', roughness: .9 }), 3.6, .45, -2.9, { parent: CAS }); add(RB(2.6, .8, .3, .12), STD({ color: '#4a7a6a', roughness: .9 }), 3.6, .9, -3.35, { parent: CAS });
    add(new T.CircleGeometry(2.3, 40), STD({ color: '#b84a3a', roughness: 1 }), 0, .01, -.4, { parent: CAS, rx: -Math.PI / 2, cast: false, noInk: true });
    pl('casaL', CAS, '#ffe6c0', 0, 3.0, 0, 12, 1.2); pl('casaW', CAS, '#d8e8ff', -2.6, 1.9, -2.6, 7, 1.6); }

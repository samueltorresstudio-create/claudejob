// World «Las palomas que pilotaban misiles» (1943): varias zonas en la misma escena, misma API que world3d.js (W2).
//  LAB  (0,0,0)    laboratorio años 40: suelo de madera, zócalo verde, ventanales, palomares, mesa larga, pizarra con el misil dibujado,
//                  caja de entrenamiento con pantalla, sacos de ALPISTE, cajas U.S. ARMY, calendario 1943, reloj, estanterías, morro del misil en un soporte.
//  NOSE (40,0,0)   interior del morro: cabina metálica con 3 puestos (ventanita + pantalla con el barco) — W2.setScreen(x) mueve el barco en las pantallas.
//  MEET (80,0,0)   sala del comité: mesa larga, sillas, bandera, cuadros, carpetas.
//  STAGE(120,0,0)  escenario del premio (2024): telón rojo, foco, atril, letrero.
//  SEA (-1200,0,0) mar abierto con un buque de guerra gris y el misil planeador «Pelican» (W2.SHIP, W2.MISSILE).
window.GLC = document.getElementById("gl");
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.15; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, W / H, .05, 3000);
  const rnd = (() => { let s = 4343; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const tex = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h, c); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const STD = o => new T.MeshStandardMaterial(Object.assign({ roughness: .85, metalness: 0 }, o));
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.s) m.scale.set(...o.s); m.castShadow = o.cast !== false; m.receiveShadow = true; (o.parent || scene).add(m); if (o.noInk) m.userData.noInk = true; return m; };
  const RB = (w, h, d, r = .04) => new RoundedBoxGeometry(w, h, d, 3, r);
  const box = (w, h, d, mat, x, y, z, o = {}) => add(RB(w, h, d, o.r ?? Math.min(.04, w / 4, h / 4, d / 4)), mat, x, y + h / 2, z, o);
  const label = (txt, w, h, bg, fg, font) => tex(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = font || `900 ${h * .5}px Inter`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h / 2 + 2); });
  const sign = (txt, w, h, x, y, z, ry = 0, bg = '#f4ead2', fg = '#2a241c', parent) => { const t = label(txt, 512, Math.round(512 * h / w), bg, fg); return add(new T.PlaneGeometry(w, h), STD({ map: t, roughness: .8 }), x, y, z, { ry, noInk: true, cast: false, parent }); };
  const SUN = new T.Vector3(-.35, .62, .7).normalize();
  // ---------- cielo (solo se ve en el mar) ----------
  const sky = new T.Mesh(new T.SphereGeometry(2500, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: SUN } },
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 sun; varying vec3 vd; void main(){ float h=vd.y; vec3 top=vec3(.22,.5,.86), mid=vec3(.58,.76,.94), hor=vec3(.9,.93,.94); vec3 c=h>.1?mix(mid,top,smoothstep(.1,.7,h)):mix(hor,mid,smoothstep(-.04,.1,h)); float s=max(dot(vd,sun),0.); c+=vec3(1.,.9,.7)*(pow(s,10.)*.25+pow(s,600.)*3.); gl_FragColor=vec4(c,1.); }' }));
  sky.frustumCulled = false; scene.add(sky);
  scene.fog = new T.FogExp2('#e3ebf0', .0016);
  const hemi = new T.HemisphereLight('#f4ecdc', '#6a5a48', 1.45); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff0d6', 3.6); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); const sc = sun.shadow.camera; sc.left = -16; sc.right = 16; sc.top = 16; sc.bottom = -16; sc.near = 1; sc.far = 300; sun.shadow.bias = -.0004; sun.shadow.normalBias = .04; scene.add(sun, sun.target);
  // ---------- texturas comunes ----------
  const woodFloor = tex(512, 512, (g, w, h) => { g.fillStyle = '#9a6a42'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 32) { const off = rnd() * w; for (let x = -off; x < w; x += 170 + rnd() * 60) { g.fillStyle = `hsl(${26 + rnd() * 6},${40 + rnd() * 10}%,${30 + rnd() * 10}%)`; g.fillRect(x + 1, y + 1, 168, 30); g.strokeStyle = 'rgba(0,0,0,.25)'; g.strokeRect(x + 1, y + 1, 168, 30); for (let k = 0; k < 3; k++) { g.strokeStyle = 'rgba(0,0,0,.08)'; g.beginPath(); g.moveTo(x + 4, y + 8 + k * 8); g.bezierCurveTo(x + 60, y + 4 + k * 8, x + 100, y + 14 + k * 8, x + 164, y + 8 + k * 8); g.stroke(); } } } }, [3, 3]);
  const wallT = tex(512, 512, (g, w, h) => { g.fillStyle = '#efe4c8'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(120,100,60,${rnd() * .05})`; g.fillRect(rnd() * w, rnd() * h, 3, 3); } }, [2, 1]);
  const wainT = tex(256, 256, (g, w, h) => { g.fillStyle = '#4f7a5a'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 64) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x, 0, 4, h); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x + 6, 0, 3, h); } g.fillStyle = '#3e6247'; g.fillRect(0, 0, w, 16); }, [8, 1]);
  const metalT = tex(256, 256, (g, w, h) => { g.fillStyle = '#9aa3a6'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 64) { g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(0, y, w, 3); for (let x = 8; x < w; x += 32) { g.fillStyle = '#6a7274'; g.beginPath(); g.arc(x, y + 10, 3, 0, 7); g.fill(); } } }, [2, 2]);
  const woodM = STD({ color: '#8a5a32', roughness: .7 }), woodD = STD({ color: '#5e3a20', roughness: .7 }), brassM = STD({ color: '#d8b04a', metalness: .6, roughness: .35 });

  const OGIVE = (r, L) => { const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push(new T.Vector2(Math.max(.004, r * Math.sqrt(1 - t * t) * (1 - .15 * t)), t * L)); } return new T.LatheGeometry(pts, 40); };
  const paintM = STD({ color: '#f1efe6', roughness: .5, metalness: .1 }), olive = STD({ color: '#5d6b3c', roughness: .6 }), steelM = STD({ map: metalT, roughness: .45, metalness: .5 });
  // =====================================================================  LAB (0,0,0)
  const LX = 7, LZ = 6, LH = 4.4;
  add(new T.BoxGeometry(LX * 2, .2, LZ * 2), STD({ map: woodFloor, roughness: .6 }), 0, -.1, 0, { cast: false, noInk: true });
  add(new T.BoxGeometry(LX * 2, .2, LZ * 2), STD({ color: '#f4ecd8', emissive: '#8a7a5a', emissiveIntensity: .6 }), 0, LH + .1, 0, { cast: false, noInk: true });
  // paredes: crema arriba, zócalo verde abajo; la del fondo (z=-LZ) con 3 ventanales
  const wallM = STD({ map: wallT }), wainM = STD({ map: wainT });
  [[0, -LZ, 0, LX * 2], [-LX, 0, Math.PI / 2, LZ * 2], [LX, 0, -Math.PI / 2, LZ * 2], [0, LZ, Math.PI, LX * 2]].forEach(([x, z, ry, w], i) => {
    const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
    if (i === 0) { // fondo con huecos de ventana
      [-4.6, 0, 4.6].forEach((wx, k) => { add(new T.BoxGeometry(1.6, LH, .3), wallM, wx - 2.3 + (k === 0 ? -.8 : 0) * 0, LH / 2, 0, { parent: g, cast: false, noInk: true }); });
      add(new T.BoxGeometry(w, 1.2, .3), wainM, 0, .6, 0, { parent: g, cast: false, noInk: true }); add(new T.BoxGeometry(w, .8, .3), wallM, 0, LH - .4, 0, { parent: g, cast: false, noInk: true });
      add(new T.BoxGeometry(1.2, LH, .3), wallM, -LX + .6, LH / 2, 0, { parent: g, cast: false, noInk: true }); add(new T.BoxGeometry(1.2, LH, .3), wallM, LX - .6, LH / 2, 0, { parent: g, cast: false, noInk: true });
      [-2.3, 2.3].forEach(wx => add(new T.BoxGeometry(1.4, LH, .3), wallM, wx, LH / 2, 0, { parent: g, cast: false, noInk: true }));
      // ventanales (cristal luminoso + marcos)
      [-4.6, 0, 4.6].forEach(wx => { add(new T.PlaneGeometry(3.2, 2.4), new T.MeshBasicMaterial({ color: '#dff1ff' }), wx, 2.4, -.12, { parent: g, noInk: true, cast: false });
        [-1.6, -.53, .53, 1.6].forEach(fx => box(.08, 2.4, .1, STD({ color: '#3e6247' }), wx + fx, 1.2, .02, { parent: g }));
        [1.2, 2.4, 3.6].forEach(fy => add(new T.BoxGeometry(3.2, .08, .1), STD({ color: '#3e6247' }), wx, fy, .02, { parent: g })); });
    } else {
      add(new T.BoxGeometry(w, LH, .3), wallM, 0, LH / 2, 0, { parent: g, cast: false, noInk: true });
      add(new T.BoxGeometry(w, 1.2, .32), wainM, 0, .6, .01, { parent: g, cast: false, noInk: true });
    }
    add(new T.BoxGeometry(w, .08, .1), STD({ color: '#2f4a36' }), 0, 1.22, .2, { parent: g, cast: false });
  });
  // luz que entra por las ventanas (planos aditivos)
  const beamM = new T.MeshBasicMaterial({ color: '#fff3d0', transparent: true, opacity: .08, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide });
  // palomares (casilleros de madera abiertos por delante) en la pared izquierda
  const PIGEONHOLES = [];
  const coop = (x0, z0, cols, rows) => { const g = new T.Group(); g.position.set(x0, 0, z0); g.rotation.y = Math.PI / 2; scene.add(g);
    const cw = .7, ch = .62, dp = .55;
    add(new T.BoxGeometry(cols * cw + .1, .08, dp), woodD, 0, .5, 0, { parent: g });
    for (let r = 0; r <= rows; r++) add(new T.BoxGeometry(cols * cw + .1, .06, dp), woodM, 0, .5 + r * ch, 0, { parent: g });
    for (let c = 0; c <= cols; c++) add(new T.BoxGeometry(.06, rows * ch, dp), woodM, -cols * cw / 2 + c * cw, .5 + rows * ch / 2, 0, { parent: g });
    add(new T.BoxGeometry(cols * cw + .1, rows * ch, .04), STD({ color: '#6a4a2c' }), 0, .5 + rows * ch / 2, -dp / 2, { parent: g, cast: false });
    [-1, 1].forEach(sd => add(new T.BoxGeometry(.1, .5, .1), woodD, sd * (cols * cw / 2 - .05), .25, 0, { parent: g }));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const lx = -cols * cw / 2 + (c + .5) * cw, ly = .5 + r * ch + .03; const p = new T.Vector3(lx, ly, .05).applyAxisAngle(new T.Vector3(0, 1, 0), Math.PI / 2).add(g.position); PIGEONHOLES.push(p);
      sign(String(r * cols + c + 1).padStart(2, '0'), .14, .08, lx, ly + ch - .1, dp / 2 + .01, 0, '#f4ead2', '#2a241c', g); }
    return g; };
  coop(-LX + .45, -1.4, 6, 4); coop(-LX + .45, 3.4, 3, 4);
  // mesa larga de trabajo en el centro
  const table = (x, z, w, d, h = .9, top = woodM) => { const g = new T.Group(); g.position.set(x, 0, z); scene.add(g); box(w, .08, d, top, 0, h - .08, 0, { parent: g }); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(.08, h - .08, .08, woodD, a * (w / 2 - .1), 0, b * (d / 2 - .1), { parent: g })); return g; };
  table(1.2, .6, 4.2, 1.4);
  // caja de entrenamiento (Skinner) con pantalla redonda y comedero
  const TRAIN = new T.Group(); TRAIN.position.set(2.5, .9, .4); TRAIN.rotation.y = -Math.PI / 2; scene.add(TRAIN);
  box(.9, .7, .7, STD({ color: '#c9a46a' }), 0, 0, 0, { parent: TRAIN });
  add(new T.CircleGeometry(.2, 32), new T.MeshBasicMaterial({ color: '#9fd8a8' }), 0, .42, .356, { parent: TRAIN, noInk: true });
  add(new T.TorusGeometry(.21, .03, 8, 32), brassM, 0, .42, .36, { parent: TRAIN });
  box(.2, .06, .12, STD({ color: '#6a6f72', metalness: .4 }), .3, .1, .4, { parent: TRAIN });
  // tarro de alpiste y libreta en la mesa
  const jar = add(new T.CylinderGeometry(.12, .12, .26, 20), new T.MeshStandardMaterial({ color: '#d9eef0', transparent: true, opacity: .55, roughness: .1 }), .4, 1.03, .7, { noInk: true });
  add(new T.CylinderGeometry(.11, .11, .14, 20), STD({ color: '#d6b25a' }), .4, .97, .7); add(new T.CylinderGeometry(.13, .13, .04, 20), STD({ color: '#b8402e' }), .4, 1.17, .7);
  box(.34, .03, .24, STD({ color: '#2f5a8a' }), -.4, .9, .9, { ry: .3 });
  // morro del misil en un soporte (blanco con 3 ventanitas) — W2.NOSE_LAB
  const NOSE_LAB = new T.Group(); NOSE_LAB.position.set(-.8, 0, .6); NOSE_LAB.rotation.y = -2.2; scene.add(NOSE_LAB);
  const noseG = new T.ConeGeometry(.55, 1.5, 40, 1, true); noseG.rotateZ(-Math.PI / 2);
  const noseB = new T.Group(); noseB.position.set(0, 1.35, 0); NOSE_LAB.add(noseB);
  add(new T.CylinderGeometry(.55, .55, .9, 40), paintM, -.45, 0, 0, { rz: Math.PI / 2, parent: noseB });
  add(OGIVE(.55, 1.1), paintM, 0, 0, 0, { rz: -Math.PI / 2, parent: noseB });
  add(new T.TorusGeometry(.56, .03, 8, 40), olive, -.9, 0, 0, { ry: Math.PI / 2, parent: noseB });
  [-.5, 0, .5].forEach((a, k) => { const p = new T.Group(); p.position.set(.36, Math.sin(a) * .5, -Math.cos(a) * .5); noseB.add(p); p.lookAt(p.getWorldPosition(new T.Vector3()).add(new T.Vector3(.5, Math.sin(a), -Math.cos(a)).applyQuaternion(noseB.getWorldQuaternion(new T.Quaternion()))));
    add(new T.CylinderGeometry(.11, .11, .04, 24), STD({ color: '#24323a', roughness: .1, metalness: .3 }), 0, 0, 0, { rx: Math.PI / 2, parent: p }); add(new T.TorusGeometry(.11, .025, 8, 24), brassM, 0, 0, .02, { parent: p }); });
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([a, b]) => box(.06, 1.0, .06, STD({ color: '#3a3f44', metalness: .4 }), -.45 + a * .3, 0, b * .3, { parent: NOSE_LAB }));
  box(.8, .06, .8, STD({ color: '#3a3f44', metalness: .4 }), -.45, .95, 0, { parent: NOSE_LAB });
  // pizarra con el misil dibujado (pared derecha)
  const chalkT = tex(1024, 640, (g, w, h) => { g.fillStyle = '#26382e'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.85)'; g.fillStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(220, 330); g.lineTo(640, 330); g.quadraticCurveTo(780, 330, 820, 300); g.quadraticCurveTo(780, 270, 640, 270); g.lineTo(220, 270); g.closePath(); g.stroke();
    g.beginPath(); g.moveTo(380, 270); g.lineTo(300, 180); g.lineTo(260, 180); g.lineTo(320, 270); g.moveTo(380, 330); g.lineTo(300, 420); g.lineTo(260, 420); g.lineTo(320, 330); g.moveTo(220, 270); g.lineTo(170, 230); g.moveTo(220, 330); g.lineTo(170, 370); g.stroke();
    [0, 1, 2].forEach(k => { g.beginPath(); g.arc(700 + k * 26, 288 + (k % 2) * 16, 9, 0, 7); g.stroke(); });
    g.beginPath(); g.moveTo(710, 420); g.lineTo(712, 340); g.stroke(); g.beginPath(); g.moveTo(700, 352); g.lineTo(712, 336); g.lineTo(724, 352); g.stroke();
    g.font = '700 46px Inter'; g.fillText('3 x', 640, 480); g.beginPath(); g.ellipse(745, 470, 34, 22, 0, 0, 7); g.stroke(); g.beginPath(); g.arc(772, 452, 12, 0, 7); g.stroke(); g.beginPath(); g.moveTo(783, 452); g.lineTo(800, 456); g.stroke();
    g.font = '700 54px Inter'; g.fillText('PROYECTO PALOMA', 80, 90); g.font = '700 40px Inter'; g.fillText('¿?', 880, 560); g.fillText('1943', 860, 90); });
  const CHALK = add(new T.PlaneGeometry(3.2, 2), STD({ map: chalkT, roughness: .9 }), LX - .17, 2.45, -.4, { ry: -Math.PI / 2, noInk: true, cast: false });
  box(.1, 2.16, 3.36, woodD, LX - .12, 1.37, -.4); box(.16, .06, 3.2, woodD, LX - .2, 1.42, -.4);
  // estantería con libros y tarros (pared derecha, al fondo)
  const shelf = (x, z) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = -Math.PI / 2; scene.add(g);
    box(1.8, 2.6, .05, woodD, 0, 0, -.2, { parent: g }); [0, .7, 1.4, 2.1].forEach(y => box(1.8, .05, .4, woodM, 0, y + .1, 0, { parent: g })); [-1, 1].forEach(sd => box(.05, 2.6, .4, woodM, sd * .9, 0, 0, { parent: g }));
    const bc = ['#8a2a2a', '#2f4f7a', '#3e6247', '#c9a46a', '#5a3a6a', '#1f1f24'];
    [.15, .85].forEach(y => { let bx = -.82; while (bx < .7) { const bw = .06 + rnd() * .06, bh = .34 + rnd() * .18; box(bw, bh, .26, STD({ color: bc[Math.floor(rnd() * bc.length)] }), bx + bw / 2, y, 0, { parent: g }); bx += bw + .01; } });
    [-.6, -.2, .2, .6].forEach((jx, k) => { add(new T.CylinderGeometry(.09, .09, .26, 16), new T.MeshStandardMaterial({ color: ['#e8d9a0', '#cfe6d0', '#e8c0a0', '#dfe8f0'][k], transparent: true, opacity: .8 }), jx, 1.68, 0, { parent: g, noInk: true }); add(new T.CylinderGeometry(.095, .095, .04, 16), STD({ color: '#3a3f44' }), jx, 1.83, 0, { parent: g }); });
    box(.5, .3, .3, STD({ color: '#c9a46a' }), -.4, 2.25, 0, { parent: g }); return g; };
  shelf(LX - .3, 3.6);
  // sacos de ALPISTE y cajas U.S. ARMY en el rincón del fondo-derecha
  const sackT = label('ALPISTE', 256, 128, '#d9c8a0', '#6a3a1a', '900 46px Inter');
  const sack = (x, z, ry, s = 1) => { const m = add(new T.SphereGeometry(.38, 20, 14), STD({ color: '#d9c8a0', roughness: 1 }), x, .42 * s, z, { s: [s, 1.15 * s, .8 * s], ry }); add(new T.PlaneGeometry(.42, .2), STD({ map: sackT }), x + Math.sin(ry) * .31 * s, .44 * s, z + Math.cos(ry) * .31 * s, { ry, noInk: true, cast: false }); add(new T.CylinderGeometry(.08, .16, .14, 12), STD({ color: '#c9b890' }), x, .92 * s, z); };
  sack(5.6, -4.8, -.4); sack(4.7, -5, .2, .9); sack(5.2, -4.0, -.8, .85);
  const crateT = tex(256, 256, (g, w, h) => { g.fillStyle = '#6b7448'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 52) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, y, w, 4); } g.fillStyle = '#efe6c8'; g.font = '900 40px Inter'; g.textAlign = 'center'; g.fillText('U.S. ARMY', w / 2, h / 2 + 4); g.font = '700 22px Inter'; g.fillText('FRAGILE · 1943', w / 2, h / 2 + 40); });
  const crate = (x, y, z, s, ry) => { box(s, s, s, STD({ map: crateT }), x, y, z, { ry }); };
  crate(-5.6, 0, -4.9, .8, .2); crate(-4.8, 0, -5.1, .7, -.1); crate(-5.5, .8, -4.85, .6, .5);
  // escritorio con lámpara, teléfono y máquina de escribir (fondo izquierda)
  table(-3, -4.6, 1.8, .9, .8, woodD);
  const lamp = new T.Group(); lamp.position.set(-3.6, .8, -4.7); scene.add(lamp); add(new T.CylinderGeometry(.12, .14, .04, 16), STD({ color: '#2a5a3a' }), 0, .02, 0, { parent: lamp }); add(new T.CylinderGeometry(.015, .015, .5, 8), brassM, 0, .27, 0, { parent: lamp, rz: .2 });
  add(new T.CylinderGeometry(.06, .2, .16, 20, 1, true), STD({ color: '#2a5a3a', side: T.DoubleSide }), .08, .52, 0, { parent: lamp, rz: -.4 }); const bulb = new T.PointLight('#ffd89a', 1.6, 4, 2); bulb.position.set(.12, .45, 0); lamp.add(bulb);
  box(.36, .14, .3, STD({ color: '#1f1f24', roughness: .4 }), -2.7, .8, -4.6); box(.3, .04, .1, STD({ color: '#e9e2d0' }), -2.7, .94, -4.5);
  box(.18, .12, .22, STD({ color: '#141418', roughness: .3 }), -2.2, .8, -4.5);
  // reloj y calendario 1943 (pared del fondo, entre ventanas)
  const clockT = tex(256, 256, (g, w, h) => { g.fillStyle = '#f6efdc'; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.strokeStyle = '#1b1720'; g.lineWidth = 10; g.stroke(); g.lineWidth = 6; for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; g.beginPath(); g.moveTo(128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96); g.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); g.stroke(); } g.lineWidth = 9; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 50); g.moveTo(128, 128); g.lineTo(186, 150); g.stroke(); });
  add(new T.CylinderGeometry(.32, .32, .06, 32), STD({ map: clockT }), 2.3, 3.4, -LZ + .2, { rx: Math.PI / 2 }).material.map.rotation = 0;
  const calT = tex(256, 340, (g, w, h) => { g.fillStyle = '#fbf6ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#b8402e'; g.fillRect(0, 0, w, 90); g.fillStyle = '#fff'; g.font = '900 64px Inter'; g.textAlign = 'center'; g.fillText('1943', w / 2, 70); g.fillStyle = '#2a241c'; g.font = '700 26px Inter'; g.fillText('JUNIO', w / 2, 130); for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.fillText(String(r * 7 + c + 1).slice(0, 2), 30 + c * 33, 180 + r * 34); });
  add(new T.PlaneGeometry(.5, .66), STD({ map: calT }), -2.3, 2.3, -LZ + .17, { noInk: true, cast: false });
  // radiador bajo la ventana central y bombilla colgante
  for (let k = 0; k < 9; k++) box(.08, .7, .18, STD({ color: '#d9d6cc', metalness: .3, roughness: .5 }), -.4 + k * .1, .1, -LZ + .35);
  [[-2, 1.5], [2.5, 1.5]].forEach(([x, z]) => { add(new T.CylinderGeometry(.01, .01, 1, 6), STD({ color: '#222' }), x, LH - .5, z, { noInk: true }); add(new T.CylinderGeometry(.06, .34, .22, 24, 1, true), STD({ color: '#2a5a3a', side: T.DoubleSide }), x, LH - 1.05, z); add(new T.SphereGeometry(.07, 12, 8), new T.MeshBasicMaterial({ color: '#fff2c8' }), x, LH - 1.12, z, { noInk: true }); const pl = new T.PointLight('#ffe0a8', 2.2, 9, 2); pl.position.set(x, LH - 1.25, z); scene.add(pl); });
  // perchero con abrigo y sombrero junto a la puerta (pared delantera derecha)
  add(new T.CylinderGeometry(.03, .03, 1.9, 8), woodD, 5.6, .95, 5.3); add(new T.CylinderGeometry(.22, .25, .05, 16), woodD, 5.6, .03, 5.3);
  add(new T.CylinderGeometry(.25, .32, .9, 16), STD({ color: '#5a4a3a' }), 5.6, 1.35, 5.42, { s: [1, 1, .5] }); add(new T.CylinderGeometry(.14, .16, .14, 16), STD({ color: '#3a2a20' }), 5.6, 1.98, 5.3); add(new T.CylinderGeometry(.26, .26, .02, 20), STD({ color: '#3a2a20' }), 5.6, 1.92, 5.3);
  // =====================================================================  NOSE (40,0,0): interior del morro
  const NX = 40, NOSE = new T.Group(); NOSE.position.set(NX, 0, 0); scene.add(NOSE);
  const shellG = new T.CylinderGeometry(1.25, 1.25, 4, 40, 1, true); shellG.rotateZ(Math.PI / 2);
  add(shellG, STD({ map: metalT, side: T.BackSide, roughness: .5, metalness: .4, color: '#b8c0c2' }), 0, 1.25, 0, { parent: NOSE, noInk: true, cast: false });
  add(new T.CircleGeometry(1.25, 40), STD({ map: metalT, color: '#a8b0b2' }), -2, 1.25, 0, { ry: Math.PI / 2, parent: NOSE, noInk: true, cast: false });
  [-1.4, -.4, .6, 1.6].forEach(x => add(new T.TorusGeometry(1.22, .05, 8, 40), STD({ color: '#7a8284', metalness: .6, roughness: .4 }), x, 1.25, 0, { ry: Math.PI / 2, parent: NOSE }));
  add(new T.BoxGeometry(4, .1, 1.9), STD({ color: '#6a7274', metalness: .5, roughness: .5 }), 0, .45, 0, { parent: NOSE });
  // 3 puestos: soporte, pantalla (canvas con barco) y ventanita encima
  const scrC = document.createElement('canvas'); scrC.width = 256; scrC.height = 256; const scrT = new T.CanvasTexture(scrC); scrT.colorSpace = T.SRGBColorSpace;
  function drawScreen(sx = 0, hit = 0) { const g = scrC.getContext('2d'), w = 256, h = 256; const gr = g.createRadialGradient(128, 128, 20, 128, 128, 140); gr.addColorStop(0, '#bfeec8'); gr.addColorStop(1, '#5aa070'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(30,70,50,.35)'; for (let y = 0; y < h; y += 6) g.fillRect(0, y, w, 2); g.fillStyle = '#7fc092'; g.fillRect(0, 150, w, 106);
    const x = 128 + sx * 90; g.fillStyle = '#1e3a2a'; g.beginPath(); g.moveTo(x - 60, 140); g.lineTo(x + 60, 140); g.lineTo(x + 46, 158); g.lineTo(x - 50, 158); g.closePath(); g.fill(); g.fillRect(x - 24, 112, 40, 28); g.fillRect(x - 6, 96, 10, 16); g.fillRect(x + 22, 124, 26, 16); g.fillRect(x - 46, 128, 20, 12);
    g.strokeStyle = hit ? '#c23a3a' : 'rgba(20,40,30,.7)'; g.lineWidth = 4; g.beginPath(); g.moveTo(128, 100); g.lineTo(128, 156); g.moveTo(100, 128); g.lineTo(156, 128); g.stroke(); g.beginPath(); g.arc(128, 128, 22, 0, 7); g.stroke();
    if (hit) { g.fillStyle = 'rgba(255,240,200,.85)'; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(128 + Math.cos(k) * 14, 128 + Math.sin(k * 2) * 10, 4, 0, 7); g.fill(); } } scrT.needsUpdate = true; }
  drawScreen(0);
  const STATIONS = [];
  [-1.15, 0, 1.15].forEach((z, k) => { const g = new T.Group(); g.position.set(.9, 0, z * 0); scene.add(g); });
  [-1, 0, 1].forEach((k) => { const st = new T.Group(); st.position.set(1.1 - Math.abs(k) * .25, 0, k * 1.0); st.rotation.y = -k * .5; NOSE.add(st);
    box(.08, .55, .7, STD({ color: '#3a3f44', metalness: .4 }), .46, .5, 0, { parent: st });
    add(new T.CircleGeometry(.24, 32), new T.MeshBasicMaterial({ map: scrT }), .41, 1.05, 0, { ry: -Math.PI / 2, parent: st, noInk: true });
    add(new T.TorusGeometry(.25, .035, 8, 32), brassM, .42, 1.05, 0, { ry: Math.PI / 2, parent: st });
    add(new T.CircleGeometry(.13, 24), new T.MeshBasicMaterial({ color: '#dff4ff' }), .5, 1.62, 0, { ry: -Math.PI / 2, parent: st, noInk: true }); add(new T.TorusGeometry(.14, .03, 8, 24), brassM, .49, 1.62, 0, { ry: Math.PI / 2, parent: st });
    box(.44, .05, .44, STD({ color: '#8a5a32' }), 0, .5, 0, { parent: st }); box(.05, .1, .44, STD({ color: '#8a5a32' }), -.2, .55, 0, { parent: st });
    const lp = new T.PointLight('#c8ffd8', .8, 1.6, 2); lp.position.set(.2, 1.05, 0); st.add(lp);
    STATIONS.push(st); });
  const noseLight = new T.PointLight('#fff2d8', 3, 6, 2); noseLight.position.set(-1, 2.1, 0); NOSE.add(noseLight);
  // =====================================================================  MEET (80,0,0): sala del comité
  const MX = 80, MEET = new T.Group(); MEET.position.set(MX, 0, 0); scene.add(MEET);
  const panelT = tex(512, 256, (g, w, h) => { g.fillStyle = '#6a4228'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 128) { g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 6; g.strokeRect(x + 14, 20, 100, h - 40); g.strokeStyle = 'rgba(255,220,180,.12)'; g.lineWidth = 3; g.strokeRect(x + 20, 26, 88, h - 52); } }, [3, 1]);
  add(new T.BoxGeometry(12, .2, 10), STD({ color: '#6a2a2a', roughness: .95 }), 0, -.1, 0, { parent: MEET, cast: false, noInk: true });
  add(new T.BoxGeometry(12, .2, 10), STD({ color: '#e9dfc6' }), 0, 4.1, 0, { parent: MEET, cast: false, noInk: true });
  [[0, -5, 0, 12], [-6, 0, Math.PI / 2, 10], [6, 0, -Math.PI / 2, 10], [0, 5, Math.PI, 12]].forEach(([x, z, ry, w]) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; MEET.add(g); add(new T.BoxGeometry(w, 4, .3), STD({ map: wallT }), 0, 2, 0, { parent: g, cast: false, noInk: true }); add(new T.BoxGeometry(w, 1.6, .32), STD({ map: panelT }), 0, .8, .01, { parent: g, cast: false, noInk: true }); });
  box(5.4, .1, 1.6, STD({ color: '#5a3018', roughness: .4 }), 0, .82, 0, { parent: MEET }); [[-2.4, -.6], [2.4, -.6], [-2.4, .6], [2.4, .6]].forEach(([x, z]) => box(.12, .82, .12, woodD, x, 0, z, { parent: MEET }));
  const chair = (x, z, ry) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; MEET.add(g); box(.5, .06, .5, STD({ color: '#3a2a20' }), 0, .48, 0, { parent: g }); box(.5, .6, .06, STD({ color: '#3a2a20' }), 0, .54, -.22, { parent: g }); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(.05, .48, .05, woodD, a * .2, 0, b * .2, { parent: g })); };
  // carpetas, jarra y vasos en la mesa
  [-1.8, -.6, .6, 1.8].forEach((x, k) => { box(.4, .03, .3, STD({ color: k === 1 ? '#c9a46a' : '#e9dfc6' }), x, .92, -.4, { ry: (rnd() - .5) * .3, parent: MEET }); add(new T.CylinderGeometry(.05, .045, .14, 12), new T.MeshStandardMaterial({ color: '#dff1ff', transparent: true, opacity: .5 }), x + .3, .99, -.3, { parent: MEET, noInk: true }); });
  add(new T.CylinderGeometry(.09, .12, .3, 16), new T.MeshStandardMaterial({ color: '#cfe6f0', transparent: true, opacity: .6 }), 0, 1.07, .2, { parent: MEET, noInk: true });
  // bandera de EE. UU. (48 estrellas, 1943) en un mástil y dos cuadros
  const usT = tex(380, 200, (g, w, h) => { for (let k = 0; k < 13; k++) { g.fillStyle = k % 2 ? '#ffffff' : '#b22234'; g.fillRect(0, k * h / 13, w, h / 13 + 1); } g.fillStyle = '#3c3b6e'; g.fillRect(0, 0, w * .4, h * 7 / 13); g.fillStyle = '#fff'; for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) { g.beginPath(); g.arc(9 + c * 18, 8 + r * 17, 3.2, 0, 7); g.fill(); } });
  add(new T.CylinderGeometry(.03, .03, 2.8, 8), brassM, 4.6, 1.4, -4.2, { parent: MEET }); add(new T.SphereGeometry(.07, 12, 8), brassM, 4.6, 2.85, -4.2, { parent: MEET });
  const usF = new T.PlaneGeometry(1.3, .7, 12, 3); add(usF, new T.MeshStandardMaterial({ map: usT, side: T.DoubleSide, roughness: .8 }), 4.0, 2.3, -4.2, { parent: MEET, noInk: true });
  const portraitT = (hue) => tex(200, 260, (g, w, h) => { g.fillStyle = `hsl(${hue},25%,30%)`; g.fillRect(0, 0, w, h); g.fillStyle = '#f2ece0'; g.beginPath(); g.arc(100, 110, 50, 0, 7); g.fill(); g.fillStyle = '#2a2a33'; g.beginPath(); g.ellipse(100, 240, 80, 70, 0, 0, 7); g.fill(); g.strokeStyle = '#1b1720'; g.lineWidth = 6; g.beginPath(); g.arc(100, 110, 50, 0, 7); g.stroke(); });
  [[-2.4, 30], [0, 200], [2.4, 120]].forEach(([x, hue]) => { add(new T.PlaneGeometry(.8, 1.04), STD({ map: portraitT(hue) }), x, 2.7, -4.83, { parent: MEET, noInk: true }); box(.92, 1.16, .05, STD({ color: '#c9a04a', metalness: .5, roughness: .4 }), x, 2.12, -4.87, { parent: MEET }); });
  const mL = new T.PointLight('#ffe0a8', 3, 10, 2); mL.position.set(0, 3.4, 0); MEET.add(mL);
  add(new T.CylinderGeometry(.5, .7, .2, 24), brassM, 0, 3.6, 0, { parent: MEET });
  // =====================================================================  STAGE (120,0,0): premio 2024
  const SX = 120, STAGE = new T.Group(); STAGE.position.set(SX, 0, 0); scene.add(STAGE);
  add(new T.BoxGeometry(14, .2, 12), STD({ color: '#1a1a22' }), 0, -.1, 0, { parent: STAGE, cast: false, noInk: true });
  box(8, .6, 4, STD({ map: woodFloor, roughness: .5 }), 0, 0, -1, { parent: STAGE });
  const curtT = tex(512, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 64, 0); gr.addColorStop(0, '#7a0e1a'); gr.addColorStop(.5, '#c4202e'); gr.addColorStop(1, '#7a0e1a'); g.fillStyle = gr; for (let x = 0; x < w; x += 64) { g.save(); g.translate(x, 0); g.fillRect(0, 0, 64, h); g.restore(); } }, [6, 1]);
  add(new T.PlaneGeometry(12, 6), STD({ map: curtT, roughness: .9 }), 0, 3, -3.1, { parent: STAGE, noInk: true, cast: false });
  add(new T.PlaneGeometry(12, 1), STD({ map: curtT, color: '#c8a0a0' }), 0, 5.4, -2.9, { parent: STAGE, noInk: true, cast: false });
  const awT = tex(1024, 200, (g, w, h) => { g.fillStyle = '#141418'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2c94c'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20); g.fillStyle = '#f2c94c'; g.font = '900 96px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('IG NOBEL · 2024', w / 2, h / 2 + 4); });
  add(new T.PlaneGeometry(4.6, .9), new T.MeshBasicMaterial({ map: awT }), 0, 4.5, -2.8, { parent: STAGE, noInk: true });
  box(.7, 1.1, .5, STD({ color: '#3a2a20', roughness: .4 }), 1.8, .6, -.4, { parent: STAGE }); box(.8, .06, .6, STD({ color: '#5a3a26' }), 1.8, 1.7, -.4, { parent: STAGE }); add(new T.CylinderGeometry(.01, .01, .4, 6), STD({ color: '#222' }), 1.8, 1.95, -.25, { parent: STAGE, rz: .3 });
  const TROPHY = new T.Group(); TROPHY.position.set(0, .6, -.2); STAGE.add(TROPHY);
  add(new T.CylinderGeometry(.14, .18, .12, 20), STD({ color: '#2a2a30' }), 0, .06, 0, { parent: TROPHY }); add(new T.CylinderGeometry(.04, .06, .3, 12), brassM, 0, .27, 0, { parent: TROPHY }); add(new T.LatheGeometry([0, .02, .06, .1, .14, .17, .19].map((r, i) => new T.Vector2(Math.max(.01, r), .42 + i * .045)), 32), brassM, 0, 0, 0, { parent: TROPHY }); [-1, 1].forEach(sd => add(new T.TorusGeometry(.07, .015, 8, 16, Math.PI), brassM, sd * .19, .6, 0, { rz: -sd * Math.PI / 2, parent: TROPHY }));
  const spot = new T.SpotLight('#fff4dc', 60, 30, .35, .5, 1.5); spot.position.set(0, 9, 5); spot.target.position.set(SX, .6, -.4); scene.add(spot.target); STAGE.add(spot);
  // =====================================================================  SEA (-1200,0,0)
  const SEAX = -1200;
  const waterM = new T.ShaderMaterial({ fog: true, uniforms: Object.assign(T.UniformsUtils.clone(T.UniformsLib.fog), { time: { value: 0 }, sun: { value: SUN } }),
    vertexShader: '#include <fog_pars_vertex>\nuniform float time; varying vec3 wp; void main(){ vec3 p=position; p.y+=sin(p.x*.08+time*1.2)*.35+sin(p.z*.11+time*.9)*.28; wp=(modelMatrix*vec4(p,1.)).xyz; vec4 mvPosition=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
    fragmentShader: '#include <fog_pars_fragment>\nuniform float time; uniform vec3 sun; varying vec3 wp; void main(){ float w=sin(wp.x*.3+time*1.5)*sin(wp.z*.37-time*1.1)+sin(wp.x*.9-wp.z*.7+time*2.)*.5; vec3 deep=vec3(.06,.28,.46), lite=vec3(.2,.55,.72); vec3 c=mix(deep,lite,.5+.35*w); c+=vec3(1.)*smoothstep(1.15,1.45,w+sin(wp.x*2.1+time)*.3)*.55; gl_FragColor=vec4(c,1.);\n#include <fog_fragment>\n}' });
  const wg = new T.PlaneGeometry(1600, 1600, 160, 160); wg.rotateX(-Math.PI / 2); const water = add(wg, waterM, SEAX, 0, 0, { cast: false, noInk: true });
  // buque de guerra gris (casco extruido, superestructura, torretas, chimenea, mástil)
  const SHIP = new T.Group(); SHIP.position.set(SEAX, 0, -60); scene.add(SHIP);
  const greyM = STD({ color: '#7d878f', roughness: .6, metalness: .2 }), greyD = STD({ color: '#5a636a', roughness: .6, metalness: .2 });
  const hs = new T.Shape(); hs.moveTo(-40, 0); hs.lineTo(34, 0); hs.quadraticCurveTo(44, 0, 50, 4); hs.lineTo(40, 6); hs.lineTo(-40, 6); hs.closePath();
  const hullG = new T.ExtrudeGeometry(hs, { depth: 10, bevelEnabled: true, bevelThickness: .4, bevelSize: .3, bevelSegments: 2, curveSegments: 16 }); hullG.translate(0, -3, -5);
  const hp = hullG.attributes.position; for (let i = 0; i < hp.count; i++) { const x = hp.getX(i), y = hp.getY(i); let t = 1 - Math.pow(Math.max(0, x - 20) / 30, 1.6) * .95; t *= .55 + .45 * Math.min(1, (y + 3) / 6); hp.setZ(i, hp.getZ(i) * t); } hullG.computeVertexNormals();
  add(hullG, greyM, 0, 0, 0, { parent: SHIP });
  box(78, .3, 8, STD({ color: '#8a7a64' }), -2, 3, 0, { parent: SHIP });
  add(new T.BoxGeometry(84, .6, 10.6), STD({ color: '#8a2a2a' }), 2, -.1, 0, { parent: SHIP, cast: false, s: [1, 1, .98] });
  for (let k = 0; k < 14; k++) add(new T.CylinderGeometry(.22, .22, .1, 12), STD({ color: '#2a2e33' }), -30 + k * 4.4, 2.2, 5.05, { rx: Math.PI / 2, parent: SHIP });
  [-1, 1].forEach(sd => [-20, -10, 6].forEach(x => { add(new T.CylinderGeometry(.6, .6, 3.4, 12), STD({ color: '#e9e4d8' }), x, 5.2, sd * 3.6, { rz: Math.PI / 2, parent: SHIP }); }));
  add(new T.CylinderGeometry(1.3, 1.6, 6, 20), greyD, -20, 7.6, 0, { parent: SHIP }); box(3, .5, 3, STD({ color: '#2a2e33' }), -20, 10.6, 0, { parent: SHIP });
  add(new T.TorusGeometry(1.2, .12, 6, 20, Math.PI), greyD, 2, 21.5, 0, { parent: SHIP });
  box(16, 4, 6, greyM, -6, 3.2, 0, { parent: SHIP }); box(9, 3, 5, greyM, -4, 7.2, 0, { parent: SHIP }); box(5, 2, 4.4, greyD, -3, 10.2, 0, { parent: SHIP });
  for (let k = 0; k < 6; k++) add(new T.PlaneGeometry(.8, .5), new T.MeshBasicMaterial({ color: '#1b2026' }), -6.5 + k * 1.1, 11.4, 2.21, { parent: SHIP, noInk: true });
  add(new T.CylinderGeometry(1.6, 1.9, 7, 20), greyD, -14, 8, 0, { parent: SHIP }); box(3.6, .6, 3.6, STD({ color: '#2a2e33' }), -14, 11.4, 0, { parent: SHIP });
  add(new T.CylinderGeometry(.25, .3, 14, 8), greyD, 2, 16, 0, { parent: SHIP }); add(new T.BoxGeometry(5, .2, .2), greyD, 2, 19, 0, { parent: SHIP });
  [[18, 3.3], [28, 3.3], [-26, 3.3]].forEach(([x, y], k) => { const tg = new T.Group(); tg.position.set(x, y, 0); tg.rotation.y = k === 2 ? Math.PI : 0; SHIP.add(tg); add(new T.CylinderGeometry(2.2, 2.6, 1.8, 20), greyM, 0, .9, 0, { parent: tg }); box(3.2, 1.4, 3, greyM, .4, 1.2, 0, { parent: tg }); [-.6, .6].forEach(z => add(new T.CylinderGeometry(.18, .22, 6, 10), greyD, 4, 2, z, { parent: tg, rz: Math.PI / 2 })); });
  const flagNav = tex(160, 100, (g, w, h) => { for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#ffffff' : '#8a2a2a'; g.fillRect(0, k * h / 7, w, h / 7 + 1); } });
  add(new T.PlaneGeometry(4, 2.4), new T.MeshStandardMaterial({ map: flagNav, side: T.DoubleSide }), -38, 9, 0, { parent: SHIP, noInk: true });
  add(new T.CylinderGeometry(.12, .12, 7, 6), greyD, -40, 6.5, 0, { parent: SHIP });
  // estela del barco
  const wakeM = new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .45, depthWrite: false });
  const wake = add(new T.PlaneGeometry(140, 12), wakeM, -100, .45, 0, { rx: -Math.PI / 2, parent: SHIP, noInk: true, cast: false }); wake.scale.set(1, 1, 1);
  [-1, 1].forEach(sd => add(new T.PlaneGeometry(40, 3), wakeM, 44, .45, sd * 6, { rx: -Math.PI / 2, rz: sd * .35, parent: SHIP, noInk: true, cast: false }));
  // misil planeador «Pelican»: cuerpo, morro con 3 ventanitas, alas, cola
  const MISSILE = new T.Group(); MISSILE.position.set(SEAX + 60, 60, 80); scene.add(MISSILE);
  add(new T.CylinderGeometry(.55, .5, 4.4, 32), paintM, 0, 0, 0, { rz: Math.PI / 2, parent: MISSILE });
  add(OGIVE(.55, 1.1), paintM, 2.2, 0, 0, { rz: -Math.PI / 2, parent: MISSILE });
  [-.5, 0, .5].forEach(a => { const p = new T.Group(); p.position.set(2.56, Math.sin(a) * .5, Math.cos(a) * .5); p.lookAt(p.position.clone().add(new T.Vector3(.7, Math.sin(a), Math.cos(a)))); MISSILE.add(p); add(new T.CylinderGeometry(.1, .1, .04, 20), STD({ color: '#24323a', roughness: .1 }), 0, 0, 0, { rx: Math.PI / 2, parent: p }); add(new T.TorusGeometry(.1, .022, 8, 20), brassM, 0, 0, .02, { parent: p }); });
  add(new T.TorusGeometry(.56, .04, 8, 32), olive, 1.4, 0, 0, { ry: Math.PI / 2, parent: MISSILE });
  const wingS = new T.Shape(); wingS.moveTo(0, 0); wingS.lineTo(-1.4, 3.4); wingS.lineTo(-2.2, 3.4); wingS.lineTo(-1.6, 0); wingS.closePath();
  [-1, 1].forEach(sd => { const wgm = new T.ExtrudeGeometry(wingS, { depth: .08, bevelEnabled: false }); wgm.rotateX(-Math.PI / 2 * sd); add(wgm, olive, .6, 0, sd * .1, { parent: MISSILE }); });
  const finS = new T.Shape(); finS.moveTo(0, 0); finS.lineTo(-.9, 1.1); finS.lineTo(-1.3, 1.1); finS.lineTo(-1, 0); finS.closePath();
  const finG = new T.ExtrudeGeometry(finS, { depth: .06, bevelEnabled: false }); finG.translate(0, 0, -.03); add(finG, olive, -1.6, .4, 0, { parent: MISSILE });
  [-1, 1].forEach(sd => { const fg = new T.ExtrudeGeometry(finS, { depth: .06, bevelEnabled: false }); fg.rotateX(-Math.PI / 2 * sd); add(fg, olive, -1.6, 0, sd * .4, { parent: MISSILE }); });
  const starT = tex(128, 128, (g) => { g.fillStyle = '#5d6b3c'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#1f3a7a'; g.beginPath(); g.arc(64, 64, 52, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 18 : 44; g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } g.fill(); });
  [-1, 1].forEach(sd => add(new T.CircleGeometry(.36, 24), new T.MeshBasicMaterial({ map: starT }), -.6, 0, sd * .52, { ry: sd > 0 ? 0 : Math.PI, parent: MISSILE, noInk: true }));
  // =====================================================================  post + contorno
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .2, .5, .9); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 6, aperture: .003, maxblur: .007 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o === sky || o.userData.noInk || o.material.transparent || o.material.side === T.BackSide) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'ShapeGeometry' || ty === 'CircleGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  function setTime(t) { waterM.uniforms.time.value = t; const p = usF.attributes.position; if (!usF.userData.b) usF.userData.b = p.array.slice(); const b = usF.userData.b; for (let k = 0; k < p.count; k++) { const x = b[k * 3] + .65; p.setZ(k, Math.sin(x * 4 - t * 4) * .05 * x); } p.needsUpdate = true; }
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    const sea = pos.x < -400; scene.fog.density = sea ? .0016 : 0; sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld();
    const sz = sea ? 80 : 16; sc.left = -sz; sc.right = sz; sc.top = sz; sc.bottom = -sz; sc.updateProjectionMatrix(); sun.intensity = sea ? 4 : 3.2;
    dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  // visible(p): true si nada del 3D tapa el punto p desde la cámara (para no dibujar personajes 2D detrás de objetos)
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && o.material !== inkM && o !== sky && o !== water && !o.material.transparent && o.material.side !== T.BackSide) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  return { visible, T, scene, camera, R, setCam, setTime, proj, render, SUN, dof, bloom, comp, inkM, setScreen: drawScreen, PIGEONHOLES, TRAIN, NOSE_LAB, NOSE, NX, STATIONS, MEET, MX, STAGE, SX, TROPHY, SHIP, MISSILE, SEAX, CHALK, LX, LZ, mid: () => 0, hgt: () => 0 };
})();

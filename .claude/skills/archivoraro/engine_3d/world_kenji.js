// World «Granja de Kenji»: granja de vacas japonesa en verano. Corral de tierra con valla de madera, establo abierto con tejado de chapa,
// casa de campo japonesa con tejado de tejas (kawara) y veranda, casa del vecino, balas de paja envueltas en blanco, camioneta kei blanca,
// tractor naranja, rincón de pintura (cubos blanco y negro, brochas, plástico), abrevadero, sacos de pienso, carretilla, máquina expendedora,
// postes de luz con cables, caquis, girasoles, arrozales con agua y montes con cedros. Misma API que world3d.js (W2): stickAt()/cowAt() funcionan.
// Corral: x ∈ [-11, 11], z ∈ [-15, -1]; valla delantera en z = -1 (el vecino se apoya desde fuera, z ≈ -0.4). Las vacas van en z ≈ -7.
window.GLC = document.getElementById("gl");
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.22; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, W / H, .05, 2500);
  const rnd = (() => { let s = 4242; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const tex = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const STD = o => new T.MeshStandardMaterial(Object.assign({ roughness: .85, metalness: 0 }, o));
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.s) m.scale.set(...o.s); m.castShadow = o.cast !== false; m.receiveShadow = true; (o.parent || scene).add(m); if (o.noInk) m.userData.noInk = true; return m; };
  const RB = (w, h, d, r = .05) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001));
  const noise = (g, w, h, n, cols, sz = [1, 3]) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const s = sz[0] + rnd() * (sz[1] - sz[0]); g.fillRect(rnd() * w, rnd() * h, s, s); } };
  const blot = (g, w, h, n, col, r0, r1) => { for (let i = 0; i < n; i++) { const x = rnd() * w, y = rnd() * h, r = r0 + rnd() * (r1 - r0); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); } };
  // ---------- cielo de verano y luz (sol detrás de la cámara, a la izquierda: caras iluminadas) ----------
  const SUN = new T.Vector3(-.5, .62, .6).normalize();
  const sky = new T.Mesh(new T.SphereGeometry(2000, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: SUN }, morn: { value: 0 } },
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 sun; uniform float morn; varying vec3 vd; void main(){ float h=vd.y; vec3 top=mix(vec3(.16,.46,.9),vec3(.42,.52,.82),morn), mid=mix(vec3(.5,.74,.97),vec3(.93,.76,.74),morn), hor=mix(vec3(.88,.93,.95),vec3(.97,.83,.7),morn); vec3 c=h>.08?mix(mid,top,smoothstep(.08,.65,h)):mix(hor,mid,smoothstep(-.05,.08,h)); float s=max(dot(vd,sun),0.); c+=vec3(1.,.92,.75)*(pow(s,12.)*.2*(1.-morn*.7)); gl_FragColor=vec4(c,1.); }' }));
  sky.frustumCulled = false; scene.add(sky);
  scene.fog = new T.FogExp2('#d9e8ee', .0042);
  const hemi = new T.HemisphereLight('#d2e6ff', '#7c8a4e', 1.55); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff0d4', 4.6); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  const sc = sun.shadow.camera; sc.left = -34; sc.right = 34; sc.top = 34; sc.bottom = -34; sc.near = 1; sc.far = 320; sun.shadow.bias = -.0004; sun.shadow.normalBias = .05; scene.add(sun, sun.target);
  // nubes (algodones grandes de verano)
  const cloudM = STD({ color: '#ffffff', roughness: 1, emissive: '#7d8fa8', emissiveIntensity: .28 });
  for (let i = 0; i < 14; i++) { const g = new T.Group(), a = -Math.PI * .9 + i / 14 * Math.PI * .8, r = 380 + (i % 3) * 90; g.position.set(Math.cos(a) * r, 95 + (i % 4) * 22, Math.sin(a) * r); scene.add(g);
    for (let k = 0; k < 7; k++) { const m = add(new T.SphereGeometry(13 + (k % 3) * 8, 18, 12), cloudM, (k - 3) * 13, (k % 2) * 8 - 2 + (k === 3 ? 10 : 0), (k % 3) * 6, { parent: g, cast: false, noInk: true }); m.scale.y = .72; } }
  // ---------- suelo ----------
  const grassT = tex(512, 512, (g, w, h) => { g.fillStyle = '#6aa548'; g.fillRect(0, 0, w, h); noise(g, w, h, 34000, ['#5b9440', '#7fbb57', '#4f8436', '#93cc66'], [1, 4]); blot(g, w, h, 30, 'rgba(0,0,0,.08)', 30, 90); blot(g, w, h, 20, 'rgba(255,255,200,.07)', 30, 90); }, [60, 60]);
  const dirtT = tex(1024, 1024, (g, w, h) => { g.fillStyle = '#a98a62'; g.fillRect(0, 0, w, h); noise(g, w, h, 40000, ['#9a7b54', '#b89a70', '#8c6e48', '#c4a77c'], [1, 4]); blot(g, w, h, 60, 'rgba(60,40,20,.14)', 30, 110);
    g.fillStyle = 'rgba(70,50,30,.45)'; for (let i = 0; i < 120; i++) { const x = rnd() * w, y = rnd() * h, a = rnd() * 6; g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.ellipse(-5, 0, 4, 7, 0, 0, 7); g.ellipse(5, 0, 4, 7, 0, 0, 7); g.fill(); g.restore(); } // huellas de pezuña
    g.fillStyle = 'rgba(220,200,140,.6)'; for (let i = 0; i < 300; i++) { g.save(); g.translate(rnd() * w, rnd() * h); g.rotate(rnd() * 6); g.fillRect(0, 0, 14, 2); g.restore(); } }, [3, 2]); // paja suelta
  const ground = new T.PlaneGeometry(1400, 1400, 140, 140); ground.rotateX(-Math.PI / 2);
  const hgt = (x, z) => { const back = Math.max(0, -z - 90), side = Math.max(0, Math.abs(x) - 70); return Math.min(60, back * .35 + side * .25) * (.7 + .3 * Math.sin(x * .02 + z * .015)) + (Math.sin(x * .05) + Math.cos(z * .04)) * .25 * Math.min(1, (Math.abs(z) + Math.abs(x)) / 40); };
  { const p = ground.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, (x > -16 && x < 30 && z > -32 && z < 14) ? 0 : hgt(x, z)); } ground.computeVertexNormals(); }
  add(ground, STD({ map: grassT, roughness: 1 }), 0, 0, 0, { cast: false, noInk: true });
  add(new T.PlaneGeometry(24, 16), STD({ map: dirtT, roughness: 1 }), 0, .012, -8, { rx: -Math.PI / 2, cast: false });
  const roadT = tex(256, 1024, (g, w, h) => { g.fillStyle = '#8d8f94'; g.fillRect(0, 0, w, h); noise(g, w, h, 16000, ['#7c7e83', '#a0a2a7', '#6e7075'], [1, 3]); g.fillStyle = '#f2f0e8'; g.fillRect(10, 0, 6, h); g.fillRect(w - 16, 0, 6, h); }, [1, 30]);
  add(new T.PlaneGeometry(6, 600), STD({ map: roadT }), 0, .01, 9, { rx: -Math.PI / 2, rz: Math.PI / 2, cast: false });
  // camino de grava de la carretera a la casa
  add(new T.PlaneGeometry(4, 22), STD({ map: dirtT, color: '#d8d0c0' }), -19, .013, -6, { rx: -Math.PI / 2, cast: false });
  // ---------- valla del corral (madera) ----------
  const woodT = tex(256, 64, (g, w, h) => { g.fillStyle = '#9a6c40'; g.fillRect(0, 0, w, h); for (let i = 0; i < 18; i++) { g.strokeStyle = `rgba(60,36,18,${.2 + rnd() * .25})`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const y = rnd() * h; g.moveTo(0, y); g.bezierCurveTo(w * .3, y + rnd() * 6 - 3, w * .6, y + rnd() * 6 - 3, w, y); g.stroke(); } });
  const woodM = STD({ map: woodT, roughness: .9 }), postM = STD({ map: woodT, color: '#b08a60' });
  const fenceSeg = (x0, z0, x1, z1, gapAt) => { const L = Math.hypot(x1 - x0, z1 - z0), n = Math.round(L / 2.2), ry = -Math.atan2(z1 - z0, x1 - x0);
    for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t; add(RB(.2, 1.5, .2, .03), postM, x, .75, z, { ry }); add(new T.ConeGeometry(.15, .14, 4), postM, x, 1.57, z, { ry: ry + Math.PI / 4 }); }
    [.55, 1.15].forEach(y => { if (gapAt == null) add(RB(L, .14, .07, .02), woodM, (x0 + x1) / 2, y, (z0 + z1) / 2, { ry }); else { const a = gapAt - 1.4, b = gapAt + 1.4;
      [[x0, a], [b, x1]].forEach(([u0, u1]) => add(RB(u1 - u0, .14, .07, .02), woodM, (u0 + u1) / 2, y, z0, {})); } }); };
  fenceSeg(-11, -1, 11, -1, 6.5); fenceSeg(-11, -15, 11, -15); fenceSeg(-11, -15, -11, -1); fenceSeg(11, -15, 11, -1);
  // portón abierto
  const gate = new T.Group(); gate.position.set(5.1, 0, -1); gate.rotation.y = -1.1; scene.add(gate); [.4, .8, 1.2].forEach(y => add(RB(2.7, .1, .06, .02), STD({ color: '#c9ced6', metalness: .5, roughness: .4 }), 1.35, y, 0, { parent: gate })); add(RB(.08, 1.3, .08, .02), STD({ color: '#c9ced6', metalness: .5 }), 2.7, .65, 0, { parent: gate });
  // ---------- establo abierto (gyūsha) con tejado de chapa ----------
  const tinT = tex(512, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 32, 0); gr.addColorStop(0, '#8fa3b5'); gr.addColorStop(.5, '#c4d2de'); gr.addColorStop(1, '#8fa3b5'); g.fillStyle = gr; for (let x = 0; x < w; x += 32) { g.save(); g.translate(x, 0); g.fillRect(0, 0, 32, h); g.restore(); }
    blot(g, w, h, 18, 'rgba(160,80,40,.18)', 10, 40); }, [8, 1]);
  const barn = new T.Group(); barn.position.set(0, 0, -21); scene.add(barn);
  for (let x = -12; x <= 12; x += 4) [-4, 4].forEach(z => add(RB(.3, z < 0 ? 5.2 : 4, .3, .03), STD({ map: woodT, color: '#a07a56' }), x, z < 0 ? 2.6 : 2, z, { parent: barn }));
  const roofA = add(RB(26, .14, 9.2, .02), STD({ map: tinT, metalness: .45, roughness: .45 }), 0, 4.65, 0, { parent: barn, rx: .13 });
  add(RB(26, 2.6, .2, .02), STD({ map: woodT, color: '#9a7a5a' }), 0, 1.3, -4.05, { parent: barn }); // pared del fondo
  for (let x = -11; x <= 11; x += 2.2) add(RB(.08, 1.2, .08, .02), STD({ color: '#d9dde3', metalness: .5 }), x, .9, 3.4, { parent: barn }); // barras del comedero
  add(RB(24, .5, .9, .1), STD({ color: '#d8d2c4' }), 0, .25, 3.9, { parent: barn }); add(RB(23.6, .1, .7, .02), STD({ color: '#d4b45a' }), 0, .52, 3.9, { parent: barn }); // comedero con paja
  for (let i = 0; i < 6; i++) add(new T.IcosahedronGeometry(1.1 + rnd() * .5, 1), STD({ color: '#e2c26a', flatShading: true }), -9 + i * 3.4 + rnd(), .6, -1.6 - rnd(), { parent: barn, s: [1.2, .55, 1] }); // paja
  add(new T.CylinderGeometry(.35, .35, .6, 16), STD({ color: '#2f6fbf' }), 10.5, .3, -3, { parent: barn }); // bidón
  // ---------- casa japonesa (paredes de yeso y madera oscura, tejado de tejas, veranda) ----------
  const kawaraT = tex(256, 256, (g, w, h) => { g.fillStyle = '#3e4a5a'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 16) { const gr = g.createLinearGradient(x, 0, x + 16, 0); gr.addColorStop(0, '#2c3644'); gr.addColorStop(.5, '#5a6a7e'); gr.addColorStop(1, '#2c3644'); g.fillStyle = gr; g.fillRect(x, 0, 16, h); }
    g.fillStyle = 'rgba(0,0,0,.25)'; for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 4); }, [6, 3]);
  const plasterT = tex(512, 256, (g, w, h) => { g.fillStyle = '#efe8da'; g.fillRect(0, 0, w, h); noise(g, w, h, 4000, ['rgba(0,0,0,.05)', 'rgba(255,255,255,.08)']); g.fillStyle = '#3b2a1e'; g.fillRect(0, h * .62, w, h * .38);
    for (let x = 0; x < w; x += 64) g.fillRect(x, 0, 10, h); g.fillRect(0, 0, w, 10); g.fillRect(0, h * .6, w, 10);
    for (let x = 22; x < w; x += 128) { g.fillStyle = '#f7f3ea'; g.fillRect(x, h * .14, 76, h * .4); g.strokeStyle = '#3b2a1e'; g.lineWidth = 3; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x + k * 19, h * .14); g.lineTo(x + k * 19, h * .54); g.stroke(); } for (let k = 1; k < 3; k++) { g.beginPath(); g.moveTo(x, h * .14 + k * h * .13); g.lineTo(x + 76, h * .14 + k * h * .13); g.stroke(); } } }, [2, 1]);
  function jHouse(x, z, w, d, ry = 0, s = 1) { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; g.scale.setScalar(s); scene.add(g);
    add(RB(w, 3.2, d, .05), STD({ map: plasterT }), 0, 1.6, 0, { parent: g });
    const roof = add(new T.ConeGeometry(1, 1, 4, 1), STD({ map: kawaraT, roughness: .5, metalness: .2 }), 0, 4.7, 0, { parent: g, ry: Math.PI / 4 }); roof.scale.set((w + 2.2) * .72, 3, (d + 2.2) * .72);
    add(RB(w * .5, .35, .5, .1), STD({ color: '#2c3644' }), 0, 6.15, 0, { parent: g }); // cumbrera
    add(RB(w + .4, .25, 2.2, .04), STD({ color: '#7a5a3a' }), 0, .45, d / 2 + 1.1, { parent: g }); // veranda (engawa)
    for (let k = -1; k <= 1; k += 2) add(RB(.2, 2.6, .2, .03), STD({ color: '#3b2a1e' }), k * w * .48, 1.75, d / 2 + 2.1, { parent: g });
    add(RB(w + 1, .14, 2.6, .03), STD({ map: kawaraT }), 0, 3.1, d / 2 + 1.3, { parent: g, rx: .25 }); return g; }
  const HOUSE = jHouse(-24, -22, 11, 8, .25);
  jHouse(26, -6, 8, 7, -.6, .9); // casa del vecino
  // ---------- balas de paja envueltas, sacos, abrevadero, carretilla, manguera ----------
  const wrapM = STD({ color: '#f2f2ee', roughness: .35, metalness: .05 });
  [[15.5, -19], [17.4, -19], [16.4, -17.4], [19.3, -19], [16.4, -19, 1]].forEach(([x, z, up]) => { const b = add(new T.CylinderGeometry(.75, .75, 1.3, 28), wrapM, x, up ? 2.1 : .75, z, { rz: Math.PI / 2 }); add(new T.TorusGeometry(.76, .03, 6, 32), STD({ color: '#c8c8c4' }), x + .3, up ? 2.1 : .75, z, { ry: Math.PI / 2 }); });
  const sackT = tex(128, 128, (g, w, h) => { g.fillStyle = '#ece4d0'; g.fillRect(0, 0, w, h); g.fillStyle = '#2f7a4a'; g.fillRect(0, 40, w, 30); g.fillStyle = '#fff'; g.font = '900 24px IPAGothic'; g.textAlign = 'center'; g.fillText('飼料', w / 2, 63); });
  for (let i = 0; i < 6; i++) add(RB(.9, .35, .6, .12), STD({ map: sackT }), 13.6 + (i % 3) * .95, .18 + Math.floor(i / 3) * .36, -12.2, { ry: (i % 2) * .1 });
  add(RB(2.4, .6, .8, .12), STD({ color: '#2f7fbf', roughness: .5 }), -9.2, .3, -12, {}); add(new T.PlaneGeometry(2.2, .6), STD({ color: '#6fb6d8', roughness: .05, metalness: .3 }), -9.2, .58, -12, { rx: -Math.PI / 2, cast: false, noInk: true }); // abrevadero con agua
  const hose = new T.TorusGeometry(.4, .05, 8, 32); for (let k = 0; k < 3; k++) add(hose, STD({ color: '#3a9a4a' }), -10.2 + k * .02, .06 + k * .07, -13.4, { rx: Math.PI / 2 });
  const wb = new T.Group(); wb.position.set(8.5, 0, -12.6); wb.rotation.y = -.6; scene.add(wb); add(RB(1.1, .4, .7, .1), STD({ color: '#2f8a4a', metalness: .3 }), 0, .62, 0, { parent: wb }); add(new T.CylinderGeometry(.22, .22, .1, 16), STD({ color: '#1b1b1f' }), .62, .22, 0, { parent: wb, rx: Math.PI / 2 }); [-.25, .25].forEach(z => add(RB(1.2, .05, .05, .02), STD({ color: '#6e4a2c' }), -.8, .6, z, { parent: wb, rz: .25 }));
  add(new T.IcosahedronGeometry(.36, 1), STD({ color: '#e2c26a', flatShading: true }), 8.5, .9, -12.6, { s: [1.3, .5, 1] });
  // ---------- rincón de pintura (lo que usa Kenji) ----------
  const PAINT = new T.Vector3(-8.6, 0, -3.0);
  add(new T.PlaneGeometry(2.6, 1.8), STD({ color: '#9ec8e8', roughness: .4, transparent: true, opacity: .85 }), PAINT.x, .02, PAINT.z, { rx: -Math.PI / 2, cast: false, noInk: true });
  const bucket = (x, z, paint, label) => { const g = new T.Group(); g.position.set(x, 0, z); scene.add(g); add(new T.CylinderGeometry(.24, .2, .4, 24, 1, true), STD({ color: '#d9dde3', metalness: .4, roughness: .4, side: T.DoubleSide }), 0, .2, 0, { parent: g });
    add(new T.CircleGeometry(.23, 24), STD({ color: paint, roughness: .2 }), 0, .36, 0, { parent: g, rx: -Math.PI / 2, cast: false, noInk: true }); add(new T.TorusGeometry(.24, .015, 6, 24, Math.PI), STD({ color: '#8a8f96', metalness: .6 }), 0, .4, 0, { parent: g });
    add(new T.CylinderGeometry(.2425, .2425, .12, 24, 1, true), STD({ color: label, side: T.DoubleSide }), 0, .17, 0, { parent: g, cast: false, noInk: true });
    for (let k = 0; k < 3; k++) add(RB(.04, .18 - k * .04, .01, .005), STD({ color: paint, roughness: .2 }), Math.cos(k * 2) * .245, .3, Math.sin(k * 2) * .245, { parent: g, ry: -k * 2, noInk: true }); return g; };
  bucket(PAINT.x - .6, PAINT.z, '#f6f3ec', '#2f6fbf'); bucket(PAINT.x + .2, PAINT.z + .3, '#141214', '#c8302e');
  const brush = (x, z, ry, paint) => { const g = new T.Group(); g.position.set(x, .05, z); g.rotation.y = ry; scene.add(g); add(RB(.5, .05, .06, .02), STD({ color: '#c99a5a' }), 0, 0, 0, { parent: g }); add(RB(.14, .07, .12, .02), STD({ color: '#c9ced6', metalness: .5 }), .3, 0, 0, { parent: g }); add(RB(.16, .06, .13, .02), STD({ color: paint }), .44, 0, 0, { parent: g }); };
  brush(PAINT.x + .8, PAINT.z - .4, .5, '#f6f3ec'); brush(PAINT.x - .2, PAINT.z - .6, -.4, '#141214');
  for (let i = 0; i < 18; i++) { const r = .04 + rnd() * .08; add(new T.CircleGeometry(r, 10), STD({ color: i % 3 ? '#f6f3ec' : '#141214', roughness: .3 }), PAINT.x - 1.6 + rnd() * 4, .022, PAINT.z - 1.4 + rnd() * 2.8, { rx: -Math.PI / 2, cast: false, noInk: true }); } // gotas en el suelo
  // escalera de mano apoyada en la valla
  const lad = new T.Group(); lad.position.set(-10.7, 0, -4); lad.rotation.z = -.25; scene.add(lad); [-.25, .25].forEach(z => add(RB(.06, 2.4, .06, .02), STD({ color: '#d9dde3', metalness: .5 }), 0, 1.2, z, { parent: lad })); for (let y = .3; y < 2.3; y += .35) add(new T.CylinderGeometry(.025, .025, .5, 6), STD({ color: '#d9dde3', metalness: .5 }), 0, y, 0, { parent: lad, rx: Math.PI / 2 });
  // ---------- vehículos: camioneta kei blanca y tractor naranja ----------
  const kei = new T.Group(); kei.position.set(18, 0, 2.6); kei.rotation.y = -.35; scene.add(kei); const keiM = STD({ color: '#f2f2ee', roughness: .35, metalness: .2 });
  add(RB(3.3, .7, 1.45, .2), keiM, 0, .75, 0, { parent: kei }); add(RB(1.3, .95, 1.4, .25), keiM, 1, 1.55, 0, { parent: kei }); add(RB(1.32, .55, 1.42, .15), STD({ color: '#6f9cc0', roughness: .05, metalness: .5 }), 1.05, 1.7, 0, { parent: kei });
  [-.95, .4].forEach(x => [-.72, .72].forEach(z => add(new T.CylinderGeometry(.3, .3, .2, 18), STD({ color: '#1b1b1f' }), x + (x > 0 ? .7 : 0), .3, z, { parent: kei, rx: Math.PI / 2 })));
  [[-1.1, .4], [-.4, -.3]].forEach(([x, z]) => add(RB(.6, .4, .5, .08), STD({ color: '#e2c26a' }), x, 1.3, z, { parent: kei }));
  const trac = new T.Group(); trac.position.set(14, 0, -5.5); trac.rotation.y = -2.3; scene.add(trac); const orM = STD({ color: '#f08a24', roughness: .45, metalness: .15 });
  add(RB(2.2, .9, 1.1, .2), orM, .4, 1.1, 0, { parent: trac }); add(RB(.12, 1.6, 1.1, .03), STD({ color: '#3a3e46' }), -.5, 2, 0, { parent: trac }); add(RB(.7, .6, .1, .05), STD({ color: '#3a3e46' }), -.35, 1.6, 0, { parent: trac });
  [[-.6, .75, .9], [1.2, .45, .6]].forEach(([x, r, z]) => [-1, 1].forEach(sd => { add(new T.CylinderGeometry(r, r, .35, 22), STD({ color: '#1b1b1f' }), x, r, sd * z, { parent: trac, rx: Math.PI / 2 }); add(new T.CylinderGeometry(r * .5, r * .5, .37, 16), STD({ color: '#f2f2ee' }), x, r, sd * z, { parent: trac, rx: Math.PI / 2 }); }));
  add(new T.CylinderGeometry(.06, .06, .9, 8), STD({ color: '#3a3e46' }), 1.1, 1.9, .3, { parent: trac });
  // ---------- carretera: postes de luz con cables, máquina expendedora, buzón, cartel ----------
  const poleM = STD({ color: '#8a8478' }), POLES = [];
  for (let x = -60; x <= 60; x += 20) { add(new T.CylinderGeometry(.12, .16, 9, 10), poleM, x, 4.5, 12.6); add(RB(1.6, .12, .12, .03), poleM, x, 8.3, 12.6); add(new T.CylinderGeometry(.18, .18, .5, 10), STD({ color: '#5a5e66' }), x + .4, 7.7, 12.6); POLES.push(x); }
  for (let i = 0; i < POLES.length - 1; i++) [-.7, .7].forEach(dz => { const a = new T.Vector3(POLES[i] + dz, 8.35, 12.6), b = new T.Vector3(POLES[i + 1] + dz, 8.35, 12.6), m = a.clone().lerp(b, .5); m.y -= .6;
    add(new T.TubeGeometry(new T.QuadraticBezierCurve3(a, m, b), 20, .015, 4), STD({ color: '#1b1720' }), 0, 0, 0, { cast: false, noInk: true }); });
  const vmT = tex(256, 512, (g, w, h) => { g.fillStyle = '#e8eef2'; g.fillRect(0, 0, w, h); g.fillStyle = '#2f6fbf'; g.fillRect(0, 0, w, 60); g.fillStyle = '#fff'; g.font = '900 34px IPAGothic'; g.textAlign = 'center'; g.fillText('つめた〜い', w / 2, 44);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { g.fillStyle = ['#c8302e', '#2fa05a', '#f2c53a', '#2f6fbf', '#8a4a2a'][(r + c) % 5]; g.fillRect(16 + c * 46, 84 + r * 92, 30, 62); g.fillStyle = '#2f6fbf'; g.fillRect(14 + c * 46, 150 + r * 92, 34, 12); }
    g.fillStyle = '#1b1720'; g.fillRect(30, 380, 190, 70); g.fillStyle = '#9aa3ad'; g.fillRect(200, 300, 30, 50); });
  add(RB(1.1, 1.85, .8, .05), [STD({ color: '#d9dde3' }), STD({ color: '#d9dde3' }), STD({ color: '#d9dde3' }), STD({ color: '#d9dde3' }), STD({ map: vmT, emissive: '#ffffff', emissiveMap: vmT, emissiveIntensity: .2 }), STD({ color: '#d9dde3' })], -14.5, .93, 12.6);
  add(RB(.5, .9, .4, .1), STD({ color: '#c8302e' }), -16.2, 1.1, 12.2); add(new T.CylinderGeometry(.06, .06, .7, 8), STD({ color: '#3a3e46' }), -16.2, .35, 12.2);
  const signT = tex(512, 160, (g, w, h) => { g.fillStyle = '#f6efe0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#3b2a1e'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); g.fillStyle = '#1b1720'; g.font = '900 86px IPAGothic'; g.textAlign = 'center'; g.fillText('けんじ牧場', w / 2, 108); g.fillStyle = '#c8302e'; g.beginPath(); g.arc(w - 56, 46, 20, 0, 7); g.fill(); });
  add(RB(3, .95, .1, .03), STD({ map: signT }), 9.6, 2.2, .4, {}); [8.4, 10.8].forEach(x => add(RB(.14, 2.2, .14, .03), postM, x, 1.1, .4));
  // ---------- caquis, girasoles, arbustos ----------
  const tree = (x, z, s, fruit) => { const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g); add(new T.CylinderGeometry(.2, .3, 2.6, 8), STD({ color: '#6e4a2c' }), 0, 1.3, 0, { parent: g });
    for (let k = 0; k < 6; k++) add(new T.IcosahedronGeometry(1 + rnd() * .5, 2), STD({ color: ['#4f8f3a', '#5fa346', '#3f7f33'][k % 3], roughness: .95 }), (rnd() - .5) * 2, 3 + rnd() * 1.2, (rnd() - .5) * 2, { parent: g });
    if (fruit) for (let k = 0; k < 14; k++) { const a = rnd() * 6.28, r = 1.3 + rnd() * .5; add(new T.SphereGeometry(.13, 10, 8), STD({ color: '#f2862a', roughness: .5 }), Math.cos(a) * r, 2.8 + rnd() * 1.6, Math.sin(a) * r, { parent: g }); } };
  tree(-17, -12, 1.1, true); tree(-30, -15, 1.3, false); tree(22, -14, 1, true); tree(31, 2, 1.2, false); tree(-20, 4, .9, false);
  // ---------- al otro lado de la carretera (fondo de los planos del vecino en la valla): casa, seto con entrada y faroles, tendedero, macetas, cobertizo ----------
  // OJO: la cámara del apodo está en (8.4, 2.1, 19.6) mirando a -z → deja libre x ∈ [6, 10] para z < 20 (si no, tapa el plano). La casa va detrás de esa cámara.
  jHouse(8, 27.5, 9, 6, Math.PI, .9);
  const stoneM = STD({ color: '#a8a296', roughness: .95 }), hedgeM = STD({ color: '#3f7f33', roughness: .95, flatShading: true });
  [[-1.5, 5.4], [10.6, 14.5]].forEach(([x0, x1]) => { const w = x1 - x0, cx = (x0 + x1) / 2; add(RB(w, .7, .5, .06), stoneM, cx, .35, 14.6); for (let x = x0 + .5; x < x1; x += 1.1) add(new T.IcosahedronGeometry(.55, 1), hedgeM, x, .95, 14.6, { s: [1.1, .7, .8] }); });
  const toro = (x, z) => { const m = STD({ color: '#9a958a', roughness: .95 }); add(RB(.5, .2, .5, .04), m, x, .1, z); add(new T.CylinderGeometry(.09, .11, .8, 8), m, x, .6, z); add(RB(.42, .1, .42, .03), m, x, 1.03, z);
    add(RB(.34, .32, .34, .03), STD({ color: '#d9d2c0', emissive: '#ffcf7a', emissiveIntensity: .25 }), x, 1.24, z); add(new T.ConeGeometry(.38, .28, 4), m, x, 1.54, z, { ry: Math.PI / 4 }); add(new T.SphereGeometry(.07, 8, 6), m, x, 1.72, z); };
  toro(5.5, 15.3); toro(10.5, 15.3);                                                                   // faroles de piedra a los lados de la entrada
  { const lx = 2.4, lz = 17.6; [-1.3, 1.3].forEach(d => add(new T.CylinderGeometry(.04, .04, 2, 6), STD({ color: '#8a8478' }), lx + d, 1, lz)); add(new T.CylinderGeometry(.03, .03, 2.7, 6), STD({ color: '#c9ced6', metalness: .4 }), lx, 1.95, lz, { rz: Math.PI / 2 });
    [['#c8302e', -.95, .55], ['#f6f3ec', -.3, .7], ['#2f6fbf', .35, .5], ['#f2c53a', .95, .45]].forEach(([c, dx, h]) => add(RB(.5, h, .03, .01), STD({ color: c, roughness: .9 }), lx + dx, 1.92 - h / 2, lz, { ry: .1 })); }   // tendedero con ropa
  [[4.7, 15.2, '#c8302e'], [11.3, 15.2, '#f2c53a'], [.3, 15.2, '#e86aa0']].forEach(([x, z, c]) => { add(new T.CylinderGeometry(.2, .15, .32, 10), STD({ color: '#b0643a' }), x, .16, z); add(new T.IcosahedronGeometry(.24, 1), STD({ color: '#4f8f3a', flatShading: true }), x, .45, z); for (let k = 0; k < 4; k++) add(new T.SphereGeometry(.06, 6, 5), STD({ color: c }), x + Math.cos(k * 1.6) * .16, .58, z + Math.sin(k * 1.6) * .12); });
  { const sh = new T.Group(); sh.position.set(12.6, 0, 18.6); sh.rotation.y = -.25; scene.add(sh); add(RB(3, 2.1, 2.2, .04), STD({ color: '#7a5a3a', roughness: .9 }), 0, 1.05, 0, { parent: sh }); add(RB(3.5, .08, 2.8, .02), STD({ color: '#8d96a0', metalness: .4, roughness: .45 }), 0, 2.25, 0, { parent: sh, rx: -.18 });
    add(RB(1, 1.6, .05, .02), STD({ color: '#5a4030' }), .5, .8, -1.12, { parent: sh }); }                // cobertizo con tejado de chapa
  tree(3, 24.5, 1, true); tree(14.5, 24, .9, false); tree(-3, 21, 1.1, false);
  const sunflower = (x, z, h) => { add(new T.CylinderGeometry(.03, .04, h, 6), STD({ color: '#4a8a2a' }), x, h / 2, z, { noInk: true }); const hd = new T.Group(); hd.position.set(x, h, z + .05); hd.rotation.x = -.15; scene.add(hd);
    for (let i = 0; i < 12; i++) { const q = new T.Group(); q.rotation.z = i / 12 * 6.28; hd.add(q); add(RB(.1, .3, .02, .01), STD({ color: '#ffc81a' }), 0, .27, 0, { parent: q, noInk: true }); } add(new T.CylinderGeometry(.17, .17, .06, 16), STD({ color: '#6a3a1a' }), 0, 0, .02, { parent: hd, rx: Math.PI / 2 }); };
  for (let i = 0; i < 9; i++) sunflower(-28.5 + i * 1.1, -16.2 + (i % 2) * .5, 1.8 + (i % 3) * .3);
  for (let i = 0; i < 26; i++) add(new T.IcosahedronGeometry(.5 + rnd() * .4, 1), STD({ color: ['#4f8f3a', '#5fa346'][i % 2], flatShading: true }), -30 + rnd() * 66, .3, 4 + rnd() * 4.5, { s: [1.3, .8, 1] });
  // ---------- arrozales con agua y montes con cedros ----------
  const paddyM = STD({ color: '#7fb6c8', roughness: .08, metalness: .45 }), riceM = STD({ color: '#7ccf4f', roughness: .9 });
  const RICE = []; for (let r = 0; r < 4; r++) for (let c = -4; c <= 4; c++) { const x = c * 13, z = -42 - r * 11, y = r * .6; add(RB(12.4, .1, 10.4, .05), STD({ color: '#6a5a3a' }), x, y - .02, z, { noInk: true }); add(new T.PlaneGeometry(12, 10), paddyM, x, y + .05, z, { rx: -Math.PI / 2, cast: false, noInk: true });
    for (let k = 0; k < 6; k++) for (let j = 0; j < 8; j++) RICE.push([x - 5 + j * 1.4, y + .25, z - 4 + k * 1.6]); }
  const riceIM = new T.InstancedMesh(new T.ConeGeometry(.16, .5, 5), riceM, RICE.length); const dm = new T.Object3D(); RICE.forEach((p, i) => { dm.position.set(...p); dm.updateMatrix(); riceIM.setMatrixAt(i, dm.matrix); }); riceIM.userData.noInk = true; scene.add(riceIM);
  const cedarM = STD({ color: '#2f5a32', roughness: .95, flatShading: true }), CED = [];
  for (let i = 0; i < 420; i++) { const x = -260 + rnd() * 520, z = -95 - rnd() * 160; CED.push([x, hgt(x, z), z, 2.5 + rnd() * 2.5]); }
  for (let i = 0; i < 160; i++) { const sd = rnd() > .5 ? 1 : -1, x = sd * (75 + rnd() * 150), z = -60 + rnd() * 120; CED.push([x, hgt(x, z), z, 2.4 + rnd() * 2.4]); }
  const cedIM = new T.InstancedMesh(new T.ConeGeometry(1, 3, 6), cedarM, CED.length); CED.forEach(([x, y, z, s], i) => { dm.position.set(x, y + s * 1.4, z); dm.scale.set(s * .7, s, s * .7); dm.updateMatrix(); cedIM.setMatrixAt(i, dm.matrix); }); cedIM.castShadow = true; cedIM.userData.noInk = true; scene.add(cedIM);
  [[-160, -420, 220, 160], [40, -480, 280, 210], [220, -400, 200, 150], [-320, -360, 180, 120]].forEach(([x, z, r, h]) => { const c = new T.ConeGeometry(r, h, 9, 3); const p = c.attributes.position; for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) * (1 + (rnd() - .5) * .12)); c.computeVertexNormals(); add(c, STD({ color: '#5f7f8a', flatShading: true }), x, h / 2 - 5, z, { noInk: true, cast: false }); });
  // ---------- barbería del pueblo (junto a la carretera) con su palo giratorio ----------
  const shopT = tex(1024, 640, (g, w, h) => { g.fillStyle = '#f2ece0'; g.fillRect(0, 0, w, h); noise(g, w, h, 6000, ['rgba(0,0,0,.05)', 'rgba(255,255,255,.08)']); blot(g, w, h, 14, 'rgba(120,100,80,.12)', 30, 90);
    g.fillStyle = '#2f5f9f'; g.fillRect(0, h - 110, w, 110); for (let x = 0; x < w; x += 60) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x, h - 110, 4, 110); }
    g.fillStyle = '#3b2a1e'; g.fillRect(90, 210, 470, 320); const gr = g.createLinearGradient(100, 220, 540, 520); gr.addColorStop(0, '#bfe0f2'); gr.addColorStop(.5, '#6f9cc0'); gr.addColorStop(1, '#3d6080'); g.fillStyle = gr; g.fillRect(104, 224, 442, 292);
    g.fillStyle = '#c8302e'; g.fillRect(230, 380, 90, 110); g.fillRect(250, 330, 50, 60); g.fillStyle = '#d9dde3'; g.fillRect(270, 490, 10, 30); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(110, 460); g.lineTo(300, 226); g.lineTo(380, 226); g.lineTo(110, 512); g.fill();
    g.fillStyle = '#3b2a1e'; g.fillRect(640, 200, 230, 340); g.fillStyle = '#d9c4a0'; g.fillRect(654, 214, 202, 312); g.fillStyle = '#3b2a1e'; g.fillRect(752, 214, 6, 312); for (let y = 250; y < 520; y += 40) { g.fillRect(654, y, 202, 4); }
    g.fillStyle = '#c8a13a'; g.beginPath(); g.arc(840, 370, 9, 0, 7); g.fill();
    g.fillStyle = '#1b2a4a'; g.fillRect(70, 40, 884, 130); g.strokeStyle = '#f2ece0'; g.lineWidth = 8; g.strokeRect(84, 54, 856, 102); g.fillStyle = '#f6efe0'; g.font = '900 86px IPAGothic'; g.textAlign = 'center'; g.fillText('理容 たなか', w / 2, 136); });
  const SHOP = new T.Group(); SHOP.position.set(-28, 0, 2.6); scene.add(SHOP);
  add(RB(7, 3.6, 4.2, .05), [STD({ color: '#e8e0d0' }), STD({ color: '#e8e0d0' }), STD({ color: '#3e4a5a' }), STD({ color: '#3e4a5a' }), STD({ map: shopT }), STD({ color: '#e8e0d0' })], 0, 1.8, 0, { parent: SHOP });
  const shopRoof = add(new T.ConeGeometry(1, 1, 4, 1), STD({ map: kawaraT, roughness: .5, metalness: .2 }), 0, 4.5, 0, { parent: SHOP, ry: Math.PI / 4 }); shopRoof.scale.set(6.2, 1.8, 3.9);
  const awnT = tex(512, 64, (g, w, h) => { for (let k = 0; k < 16; k++) { g.fillStyle = k % 2 ? '#f6f3ec' : '#2f5f9f'; g.fillRect(k * w / 16, 0, w / 16, h); } });
  add(RB(6.6, .1, 1.3, .03), STD({ map: awnT }), 0, 2.95, 2.65, { parent: SHOP, rx: .32 });
  add(RB(7.4, .25, .3, .05), STD({ color: '#3e4a5a' }), 0, 3.62, 2.12, { parent: SHOP });
  // rayas en hélice SIN COSTURA (8 bandas por vuelta, múltiplo de 4 colores): al girar no se ve ninguna línea de corte
  const poleT = tex(512, 512, (g, w, h) => { const cols = ['#d23a32', '#f6f3ec', '#2f5f9f', '#f6f3ec'], N = 8, K = 9; for (let c = -2; c < N + K + 2; c++) { g.fillStyle = cols[((c % 4) + 4) % 4]; g.beginPath(); g.moveTo(c * w / N, 0); g.lineTo((c + 1) * w / N, 0); g.lineTo((c + 1 - K) * w / N, h); g.lineTo((c - K) * w / N, h); g.closePath(); g.fill(); } });
  const POLE = new T.Group(); POLE.position.set(-24.75, 1.95, 4.95); scene.add(POLE);   // delante de la fachada, a 0,25 m de la esquina (los soportes van a la pared)
  const poleCyl = add(new T.CylinderGeometry(.15, .15, 1.15, 32, 1, true), STD({ map: poleT, roughness: .25 }), 0, 0, 0, { parent: POLE, noInk: true });
  add(new T.CylinderGeometry(.19, .19, 1.2, 32, 1, true), STD({ color: '#dff0ff', transparent: true, opacity: .22, roughness: .05, metalness: .2 }), 0, 0, 0, { parent: POLE, cast: false, noInk: true });
  [.62, -.62].forEach(y => { add(new T.CylinderGeometry(.21, .21, .1, 24), STD({ color: '#c9ced6', metalness: .55, roughness: .3 }), 0, y, 0, { parent: POLE }); });
  add(new T.SphereGeometry(.17, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), STD({ color: '#c9ced6', metalness: .55, roughness: .3 }), 0, .67, 0, { parent: POLE });
  // soportes fijos a la fachada (z = 4.7): NO giran, solo gira el cilindro de rayas
  [.4, -.4].forEach(y => { add(new T.CylinderGeometry(.025, .025, .3, 8), STD({ color: '#b8bec6', metalness: .5 }), 0, y, -.2, { parent: POLE, rx: Math.PI / 2, noInk: true }); add(RB(.12, .12, .03, .01), STD({ color: '#b8bec6', metalness: .5 }), 0, y, -.25, { parent: POLE, noInk: true }); });
  // bancos y macetas delante de la barbería
  add(RB(1.8, .1, .5, .03), STD({ map: woodT, color: '#c09a70' }), -29.5, .55, 5.2); [-1, 1].forEach(sd => add(RB(.08, .5, .45, .02), STD({ color: '#3a3e46' }), -29.5 + sd * .8, .27, 5.2));
  [[-31.3, 5.1], [-26, 5.2]].forEach(([x, z]) => { add(new T.CylinderGeometry(.3, .24, .5, 16), STD({ color: '#b5603f' }), x, .25, z); add(new T.IcosahedronGeometry(.42, 1), STD({ color: '#4f8f3a', flatShading: true }), x, .75, z); });
  // ---------- post: brillo + desenfoque de fondo ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .2, .5, .92); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .003, maxblur: .006 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, time: { value: 0 }, morn: { value: 0 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float time, morn; varying vec2 vUv; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c+=vec3(-.01,.008,.028)*(1.-l); c+=vec3(.03,.014,-.016)*l; c+=vec3(.02,.0,-.012)*morn; c=mix(vec3(l),c,1.16); c=c*c*(3.-2.*c)*.3+c*.7; vec2 d=vUv-.5; c*=1.-dot(d*vec2(1.,.6),d*vec2(1.,.6))*.45; c+=(h(vUv*vec2(1080.,1920.)+time)-.5)*.022; gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  // ---------- contorno de tinta en el 3D ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o === sky || o.userData.noInk || (o.material && o.material.transparent) || Array.isArray(o.material) && false) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'CircleGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  // ---------- API ----------
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  const CLOUDS = []; scene.children.forEach(o => { if (o.isGroup && o.children.length === 7 && o.position.y > 80) CLOUDS.push([o, o.position.clone()]); });
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; poleCyl.rotation.y = -t * 2.6; CLOUDS.forEach(([o, p0]) => o.position.x = p0.x + t * 1.2); }
  let mood = 0; const SUN_DAY = SUN.clone(), SUN_MORN = new T.Vector3(.75, .3, .58).normalize();
  function setMood(m) { mood = m; SUN.copy(SUN_DAY).lerp(SUN_MORN, m).normalize(); sky.material.uniforms.morn.value = m; gradeMat.uniforms.morn.value = m; sun.color.set(m > .5 ? '#ffd8b0' : '#fff0d4'); sun.intensity = 4.6 - m * .9;
    hemi.color.set(m > .5 ? '#ffd6c8' : '#d2e6ff'); hemi.groundColor.set(m > .5 ? '#7a6a5a' : '#7c8a4e'); scene.fog.color.set(m > .5 ? '#f3d6c2' : '#d9e8ee'); R.toneMappingExposure = 1.22 - m * .05; }
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  return { T, scene, camera, R, setCam, setTime, setMood, visible, proj, render, SUN, hgt, PAINT, HOUSE, POLE, SHOP, dof, bloom, comp, inkM };
})();

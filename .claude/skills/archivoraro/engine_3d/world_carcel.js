// World «Cárcel y banco» (70 · El preso que pidió cinco años más). Misma API que world3d.js (W2).
// Zonas (x absoluta):
//   JUZGADO (JX = -150): sala con estrado, banquillo con barandilla de latón, público, ventanas, retratos, ventilador.
//   COMEDOR (KX = -90): cocina de la cárcel con cafetera industrial, pizarra del menú, buzón de quejas con telaraña.
//   COMPLEJO (PX = 0): galería de celdas de dos pisos (z ∈ [0, 8]) con la celda del preso al final (x ∈ [-1.5, 1.5], z ∈ [-3.2, 0]),
//     garita de los guardias, muro exterior (x ∈ [1.5, 2.3]) con la ventanita, callejón (x ∈ [2.3, 5.3]), muro del banco con «BANCO» pintado,
//     cámara acorazada (x ∈ [5.9, 11.9], z ∈ [-3.6, 0]), despacho del director (delante de la cámara), vestíbulo del banco (x ∈ [11.9, 26]),
//     túnel bajo tierra (y ∈ [-3.1, -1.7]) y la calle por delante (fachadas en z = 8 / z = 10).
//   W2.setSection(true) corta todo por z = -0.8 (vista en corte, como una maqueta): celda, muro, callejón, cámara y túnel.
window.GLC = document.getElementById("gl");
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.2; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, W / H, .05, 3000);
  const rnd = (() => { let s = 7070; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const tex = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const STD = o => new T.MeshStandardMaterial(Object.assign({ roughness: .85, metalness: 0 }, o));
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.s) m.scale.set(...o.s); m.castShadow = o.cast !== false; m.receiveShadow = true; (o.parent || scene).add(m); if (o.noInk) m.userData.noInk = true; return m; };
  const RB = (w, h, d, r = .05) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001));
  const BX = (x0, x1, y0, y1, z0, z1, mat, o = {}) => add(RB(x1 - x0, y1 - y0, z1 - z0, o.r ?? .02), mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, o);   // caja por esquinas
  const noise = (g, w, h, n, cols, sz = [1, 3]) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const s = sz[0] + rnd() * (sz[1] - sz[0]); g.fillRect(rnd() * w, rnd() * h, s, s); } };
  const blot = (g, w, h, n, col, r0, r1) => { for (let i = 0; i < n; i++) { const x = rnd() * w, y = rnd() * h, r = r0 + rnd() * (r1 - r0); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); } };
  const strokes = (g, w, h, n, cols, len = [6, 18], lw = [1, 3]) => { for (let i = 0; i < n; i++) { g.strokeStyle = cols[i % cols.length]; g.lineWidth = lw[0] + rnd() * (lw[1] - lw[0]); const x = rnd() * w, y = rnd() * h, a = rnd() * 6.28, L = len[0] + rnd() * (len[1] - len[0]); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); } };
  const FONT = (wgt, px) => `${wgt} ${px}px Inter, "DejaVu Sans", sans-serif`;
  const INK = '#1b1720';
  // plano vertical con UV en coordenadas del mundo (la textura casa entre piezas): normal hacia +z (o la que diga ry)
  const wallXY = (x0, x1, y0, y1, z, mat, sc = 2, o = {}) => { const g = new T.PlaneGeometry(x1 - x0, y1 - y0); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) { uv.setXY(i, (x0 + uv.getX(i) * (x1 - x0)) / sc, (y0 + uv.getY(i) * (y1 - y0)) / sc); } return add(g, mat, (x0 + x1) / 2, (y0 + y1) / 2, z, Object.assign({ cast: false, noInk: true }, o)); };
  const wallZY = (z0, z1, y0, y1, x, mat, sc = 2, face = 1, o = {}) => { const g = new T.PlaneGeometry(z1 - z0, y1 - y0); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) { uv.setXY(i, (z0 + uv.getX(i) * (z1 - z0)) / sc * face, (y0 + uv.getY(i) * (y1 - y0)) / sc); } return add(g, mat, x, (y0 + y1) / 2, (z0 + z1) / 2, Object.assign({ cast: false, noInk: true, ry: face > 0 ? -Math.PI / 2 : Math.PI / 2 }, o)); };
  const floorXZ = (x0, x1, z0, z1, y, mat, sc = 2, o = {}) => { const g = new T.PlaneGeometry(x1 - x0, z1 - z0); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) { uv.setXY(i, (x0 + uv.getX(i) * (x1 - x0)) / sc, (z0 + uv.getY(i) * (z1 - z0)) / sc); } const m = add(g, mat, (x0 + x1) / 2, y, (z0 + z1) / 2, Object.assign({ cast: false, noInk: true, rx: -Math.PI / 2 }, o)); if (o.down) m.rotation.x = Math.PI / 2; return m; };
  // cartel pintado (canvas) sobre una caja fina; devuelve la malla
  const sign = (w, h, px, draw, x, y, z, o = {}) => { const t = tex(Math.round(px * w / h), px, draw); return add(RB(w, h, o.d ?? .04, .01), STD({ map: t, roughness: .7, emissive: o.glow ? '#ffffff' : '#000000', emissiveMap: o.glow ? t : null, emissiveIntensity: o.glow || 0 }), x, y, z, o); };
  const signTex = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return { c, g: c.getContext('2d'), t }; };
  const ZL = [];   // luces por zona: [luz, intensidad, (pos) => bool]
  const zoneLight = (col, I, dist, x, y, z, test, o = {}) => { const l = new T.PointLight(col, 0, dist, o.decay ?? 1.4); l.position.set(x, y, z); if (o.shadow) { l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -.002; } scene.add(l); ZL.push([l, I, test]); return l; };

  // ---------- cielo y sol ----------
  const SUN = new T.Vector3(-.42, .62, .66).normalize();
  const skyU = { sun: { value: SUN }, morn: { value: 0 }, night: { value: 0 } };
  const sky = new T.Mesh(new T.SphereGeometry(2400, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform vec3 sun; uniform float morn, night; varying vec3 vd; float h1(vec3 p){ return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453); }
      void main(){ float h=vd.y; vec3 top=mix(vec3(.18,.47,.9),vec3(.36,.36,.70),morn), mid=mix(vec3(.52,.75,.97),vec3(.99,.62,.52),morn), hor=mix(vec3(.88,.93,.95),vec3(1.,.80,.62),morn);
      vec3 c=h>.08?mix(mid,top,smoothstep(.08,.65,h)):mix(hor,mid,smoothstep(-.05,.08,h)); float s=max(dot(vd,sun),0.); c+=vec3(1.,.9,.7)*(pow(s,10.)*(.18+morn*.5));
      vec3 nt=mix(vec3(.10,.16,.32),vec3(.03,.05,.14),smoothstep(0.,.6,h)); vec3 cell=floor(vd*380.); float st=step(.9975,h1(cell))*smoothstep(.05,.3,h); nt+=vec3(.9,.92,1.)*st;
      float m=max(dot(vd,normalize(vec3(.5,.45,-.74))),0.); nt+=vec3(1.,.97,.85)*smoothstep(.9993,.9996,m)+vec3(.35,.42,.6)*pow(m,60.)*.6; c=mix(c,nt,night); gl_FragColor=vec4(c,1.); }` }));
  sky.frustumCulled = false; scene.add(sky);
  scene.fog = new T.FogExp2('#d6e6ee', .0028);
  const hemi = new T.HemisphereLight('#d2e6ff', '#8a7a62', 1.25); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff0d4', 4.2); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  { const sc = sun.shadow.camera; sc.left = -34; sc.right = 34; sc.top = 34; sc.bottom = -34; sc.near = 1; sc.far = 320; } sun.shadow.bias = -.0004; sun.shadow.normalBias = .05; scene.add(sun, sun.target);
  const cloudM = STD({ color: '#ffffff', roughness: 1, emissive: '#7d8fa8', emissiveIntensity: .28 });
  const CLOUDS = [];
  for (let i = 0; i < 14; i++) { const g = new T.Group(), a = -Math.PI * .95 + i / 14 * Math.PI * .9, r = 420 + (i % 3) * 110; g.position.set(Math.cos(a) * r, 110 + (i % 4) * 24, Math.sin(a) * r); scene.add(g); CLOUDS.push([g, g.position.clone()]);
    for (let k = 0; k < 7; k++) { const m = add(new T.SphereGeometry(14 + (k % 3) * 8, 18, 12), cloudM, (k - 3) * 13, (k % 2) * 8 - 2 + (k === 3 ? 10 : 0), (k % 3) * 6, { parent: g, cast: false, noInk: true }); m.scale.y = .72; } }

  // ---------- texturas pintadas ----------
  const brickT = (base, mortar, rows = 16, dirt = .5) => tex(512, 512, (g, w, h) => { g.fillStyle = mortar; g.fillRect(0, 0, w, h); const bh = h / rows, bw = bh * 2.1;
    for (let r = 0; r < rows; r++) for (let x = -(r % 2) * bw / 2; x < w; x += bw) { const c = new T.Color(base).offsetHSL((rnd() - .5) * .02, (rnd() - .5) * .08, (rnd() - .5) * .1); g.fillStyle = '#' + c.getHexString(); g.fillRect(x + 2, r * bh + 2, bw - 4, bh - 4);
      g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(x + 2, r * bh + 2, bw - 4, 3); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x + 2, r * bh + bh - 5, bw - 4, 3); }
    noise(g, w, h, 9000, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.06)']); blot(g, w, h, 10, `rgba(40,30,20,${.12 * dirt})`, 30, 110); });
  const stoneBlockT = (base) => tex(512, 512, (g, w, h) => { g.fillStyle = '#5a564e'; g.fillRect(0, 0, w, h); const rows = 6, bh = h / rows;
    for (let r = 0; r < rows; r++) { let x = -(r % 2) * 60; while (x < w) { const bw = 90 + rnd() * 70; const c = new T.Color(base).offsetHSL(0, (rnd() - .5) * .04, (rnd() - .5) * .1); g.fillStyle = '#' + c.getHexString(); g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6);
      g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(x + 3, r * bh + 3, bw - 6, 4); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + bw - 8, r * bh + 3, 5, bh - 6); x += bw; } }
    noise(g, w, h, 14000, ['rgba(0,0,0,.1)', 'rgba(255,255,255,.07)']); blot(g, w, h, 14, 'rgba(60,70,50,.16)', 20, 80); strokes(g, w, h, 60, ['rgba(30,30,30,.25)'], [6, 20], [1, 2]); });
  const plaster = (base, dirt = 0) => tex(512, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); noise(g, w, h, 7000, ['rgba(0,0,0,.05)', 'rgba(255,255,255,.08)']); blot(g, w, h, 14, 'rgba(120,100,80,.09)', 30, 110);
    if (dirt) { const gr = g.createLinearGradient(0, h, 0, h * .6); gr.addColorStop(0, `rgba(70,60,40,${.45 * dirt})`); gr.addColorStop(1, 'rgba(70,60,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 10; i++) { g.strokeStyle = `rgba(60,50,40,${.3 * dirt})`; g.lineWidth = 2; g.beginPath(); let x = rnd() * w, y = rnd() * h * .6; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += rnd() * 26 - 13; y += 12 + rnd() * 18; g.lineTo(x, y); } g.stroke(); } } });
  const woodPanelT = (base) => tex(512, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); const pw = w / 2, ph = h / 2;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const x = i * pw, y = j * ph; g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x + 18, y + 18, pw - 36, ph - 36); g.fillStyle = base; g.fillRect(x + 26, y + 26, pw - 52, ph - 52);
      g.fillStyle = 'rgba(255,230,190,.12)'; g.fillRect(x + 26, y + 26, pw - 52, 6); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + 26, y + ph - 32, pw - 52, 6); }
    for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(30,16,6,${.12 + rnd() * .2})`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const y = rnd() * h; g.moveTo(0, y); g.bezierCurveTo(w * .3, y + rnd() * 8 - 4, w * .6, y + rnd() * 8 - 4, w, y); g.stroke(); } });
  const planksT = (base, n = 8) => tex(512, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); const pw = w / n;
    for (let i = 0; i < n; i++) { const c = new T.Color(base).offsetHSL(0, (rnd() - .5) * .05, (rnd() - .5) * .08); g.fillStyle = '#' + c.getHexString(); g.fillRect(i * pw, 0, pw, h); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(i * pw, 0, 3, h);
      for (let k = 0; k < 9; k++) { g.strokeStyle = `rgba(40,22,10,${.15 + rnd() * .2})`; g.lineWidth = 1; g.beginPath(); const x = i * pw + rnd() * pw; g.moveTo(x, 0); g.bezierCurveTo(x + rnd() * 6 - 3, h * .3, x + rnd() * 6 - 3, h * .6, x, h); g.stroke(); }
      const jy = rnd() * h; g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(i * pw, jy, pw, 3); g.fillStyle = '#3a2a1e'; [[.2, .1], [.8, .1]].forEach(([a]) => { g.beginPath(); g.arc(i * pw + pw * a, jy + 10, 2.5, 0, 7); g.fill(); }); } });
  const tileT = (a, b, n = 8, gl = .1) => tex(512, 512, (g, w, h) => { const s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = (i + j) % 2 ? a : b; g.fillRect(i * s, j * s, s, s); g.fillStyle = `rgba(255,255,255,${gl})`; g.fillRect(i * s + 4, j * s + 4, s * .4, 3); }
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, h); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); } noise(g, w, h, 5000, ['rgba(0,0,0,.05)', 'rgba(255,255,255,.05)']); });
  const wallTileT = (a, b) => tex(512, 512, (g, w, h) => { const s = w / 10; for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) { g.fillStyle = j > 5 ? b : a; g.fillRect(i * s, j * s, s, s); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(i * s + 3, j * s + 3, s - 6, 4); }
    g.strokeStyle = 'rgba(80,80,70,.45)'; g.lineWidth = 3; for (let i = 0; i <= 10; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, h); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); } blot(g, w, h, 8, 'rgba(90,80,50,.12)', 20, 60); });
  const metalT = (base, rivet = true) => tex(512, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); noise(g, w, h, 8000, ['rgba(0,0,0,.06)', 'rgba(255,255,255,.07)']); strokes(g, w, h, 500, ['rgba(255,255,255,.06)', 'rgba(0,0,0,.06)'], [20, 60], [1, 1]);
    const s = w / 2; g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 4; for (let i = 0; i <= 2; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, h); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); }
    if (rivet) for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 8; k++) [[i * s + 14 + k * (s - 28) / 7, j * s + 14], [i * s + 14 + k * (s - 28) / 7, j * s + s - 14], [i * s + 14, j * s + 14 + k * (s - 28) / 7], [i * s + s - 14, j * s + 14 + k * (s - 28) / 7]].forEach(([x, y]) => { g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.arc(x + 1, y + 1, 4.5, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(x - 1, y - 1, 3, 0, 7); g.fill(); }); });
  const earthT = tex(512, 512, (g, w, h) => { g.fillStyle = '#8a5a36'; g.fillRect(0, 0, w, h); for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(${90 + rnd() * 40},${50 + rnd() * 30},${20 + rnd() * 20},.35)`; g.fillRect(0, i * h / 9 + rnd() * 10, w, 20 + rnd() * 30); }
    noise(g, w, h, 16000, ['#7a4c2c', '#9c6a42', '#6a4024', '#b07a4c'], [1, 4]);
    for (let i = 0; i < 30; i++) { const x = rnd() * w, y = rnd() * h, rx = 5 + rnd() * 11, ry = 3 + rnd() * 7; g.fillStyle = ['#b0a690', '#c4baa4', '#a49a86', '#d0c6ae'][i % 4]; g.beginPath(); g.ellipse(x, y, rx, ry, rnd() * 3, 0, 7); g.fill(); g.strokeStyle = 'rgba(60,36,18,.55)'; g.lineWidth = 2; g.stroke(); g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.ellipse(x - rx * .3, y - ry * .35, rx * .35, ry * .25, 0, 0, 7); g.fill(); }
    for (let i = 0; i < 10; i++) { g.strokeStyle = 'rgba(60,36,18,.6)'; g.lineWidth = 2; g.beginPath(); let x = rnd() * w, y = rnd() * h; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += rnd() * 30 - 15; y += 8 + rnd() * 12; g.lineTo(x, y); } g.stroke(); } });
  const cobbleT = tex(512, 512, (g, w, h) => { g.fillStyle = '#5a5650'; g.fillRect(0, 0, w, h); const s = 32; for (let j = 0; j < h / s; j++) for (let i = -1; i < w / s + 1; i++) { const x = i * s + (j % 2) * s / 2, y = j * s; const c = new T.Color('#8e8a82').offsetHSL(0, 0, (rnd() - .5) * .14); g.fillStyle = '#' + c.getHexString(); g.beginPath(); g.ellipse(x + s / 2, y + s / 2, s * .44, s * .4, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.ellipse(x + s * .42, y + s * .4, s * .22, s * .12, 0, 0, 7); g.fill(); }
    blot(g, w, h, 12, 'rgba(60,80,40,.2)', 10, 40); });
  const asphaltT = tex(512, 512, (g, w, h) => { g.fillStyle = '#55575c'; g.fillRect(0, 0, w, h); noise(g, w, h, 20000, ['#4a4c51', '#64666b', '#3e4045'], [1, 3]); blot(g, w, h, 16, 'rgba(20,20,20,.15)', 20, 70); });
  const paveT = tex(512, 512, (g, w, h) => { g.fillStyle = '#b9b3a6'; g.fillRect(0, 0, w, h); const s = 64; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = `rgba(${150 + rnd() * 40},${145 + rnd() * 40},${135 + rnd() * 30},1)`; g.fillRect(i * s + 2, j * s + 2, s - 4, s - 4); } noise(g, w, h, 6000, ['rgba(0,0,0,.06)']); });
  const MAT = {
    brick: STD({ map: brickT('#a8563a', '#c9b8a0') }), brickOld: STD({ map: brickT('#9a5a40', '#8f8474', 16, 1.2) }), stone: STD({ map: stoneBlockT('#a39e92'), roughness: .95 }), stoneDk: STD({ map: stoneBlockT('#7f7a70'), roughness: .95 }),
    cellWall: STD({ map: plaster('#d9d2c0', .9) }), hallWall: STD({ map: plaster('#cfd6cf', .6) }), green: STD({ map: plaster('#5f8f78', .4) }), cream: STD({ map: plaster('#efe6d2', .2) }),
    concrete: STD({ map: tex(256, 256, (g, w, h) => { g.fillStyle = '#9c9890'; g.fillRect(0, 0, w, h); noise(g, w, h, 9000, ['#8c8880', '#aca8a0', '#7e7a72'], [1, 3]); blot(g, w, h, 10, 'rgba(60,60,40,.15)', 10, 40); }) }),
    hallFloor: STD({ map: tileT('#bdb7a6', '#a8a292', 6, .06), roughness: .55 }), marble: STD({ map: tileT('#f2efe8', '#2f2f36', 6, .15), roughness: .25 }),
    woodPanel: STD({ map: woodPanelT('#6a4226') }), woodDk: STD({ map: planksT('#5a3a22') }), wood: STD({ map: planksT('#8a5a34') }), woodLt: STD({ map: planksT('#b88a58') }),
    steel: STD({ map: metalT('#8a9098'), metalness: .35, roughness: .45 }), steelDk: STD({ map: metalT('#5a6068', false), metalness: .35, roughness: .5 }),
    bars: STD({ color: '#3a3f48', metalness: .5, roughness: .35 }), brass: STD({ color: '#d8a640', metalness: .3, roughness: .3, emissive: '#5a3a08', emissiveIntensity: .3 }),
    gold: STD({ color: '#f2c23a', metalness: .3, roughness: .25, emissive: '#7a4a00', emissiveIntensity: .45 }), earth: STD({ map: earthT, roughness: 1 }), earthDk: STD({ map: earthT, color: '#8a7a6a', roughness: 1 }),
    cobble: STD({ map: cobbleT, roughness: .9 }), asphalt: STD({ map: asphaltT, roughness: .9 }), pave: STD({ map: paveT, roughness: .9 }), red: STD({ color: '#b8303a' }), velvet: STD({ color: '#8a1f2a', roughness: 1 }),
    white: STD({ color: '#f4f2ec' }), black: STD({ color: '#24242a' }), steelShiny: STD({ color: '#c9ced6', metalness: .55, roughness: .25 }),
  };
  const paintedWin = (x, y, z, w, h, ry, draw, emis = .9, frameM = MAT.woodDk, bars = 0) => { const t = tex(512, 512, draw); const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry || 0; scene.add(g);
    add(new T.PlaneGeometry(w, h), STD({ map: t, emissive: '#ffffff', emissiveMap: t, emissiveIntensity: emis }), 0, 0, 0, { parent: g, cast: false, noInk: true });
    add(RB(w + .16, .1, .12, .02), frameM, 0, -h / 2, .02, { parent: g }); add(RB(w + .16, .1, .12, .02), frameM, 0, h / 2, .02, { parent: g }); [-1, 1].forEach(sd => add(RB(.1, h, .12, .02), frameM, sd * w / 2, 0, .02, { parent: g }));
    add(RB(.06, h, .08, .01), frameM, 0, 0, .02, { parent: g }); add(RB(w, .05, .08, .01), frameM, 0, h * .18, .02, { parent: g });
    for (let k = 1; k <= bars; k++) add(new T.CylinderGeometry(.025, .025, h, 8), MAT.bars, -w / 2 + k * w / (bars + 1), 0, .1, { parent: g }); return g; };
  const skyView = (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#5f9fe6'); gr.addColorStop(.7, '#cfe6f4'); gr.addColorStop(1, '#e8f0f2'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(255,255,255,.9)'; const x = rnd() * w, y = rnd() * h * .5; [0, 30, 60].forEach((d, k) => { g.beginPath(); g.arc(x + d, y + (k % 2) * 6, 26 - k * 3, 0, 7); g.fill(); }); } };
  const cityView = (g, w, h) => { skyView(g, w, h); for (let b = 0; b < 12; b++) { const bx = b * 46 - 10 + rnd() * 10, bw = 40 + rnd() * 24, bh = h * (.3 + rnd() * .4); g.fillStyle = ['#c9b8a0', '#b8a48c', '#d8c8b0', '#a89884'][b % 4]; g.fillRect(bx, h - bh, bw, bh);
      for (let yy = h - bh + 10; yy < h - 8; yy += 18) for (let xx = bx + 6; xx < bx + bw - 6; xx += 12) { g.fillStyle = rnd() > .3 ? '#6a8aa8' : '#e8d8a8'; g.fillRect(xx, yy, 6, 9); } } g.fillStyle = '#6f9a4a'; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(rnd() * w, h - 10, 24 + rnd() * 16, 0, 7); g.fill(); } };
  // texto pintado en canvas con borde de tinta
  const txt = (g, s, x, y, px, col = INK, wgt = 900, al = 'center', st = 0, stc = INK) => { g.font = FONT(wgt, px); g.textAlign = al; g.textBaseline = 'middle'; if (st) { g.lineWidth = st; g.strokeStyle = stc; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = col; g.fillText(s, x, y); };
  const paperBg = (g, w, h, base = '#f4ecd6') => { g.fillStyle = base; g.fillRect(0, 0, w, h); noise(g, w, h, 3000, ['rgba(0,0,0,.04)', 'rgba(255,255,255,.08)']); blot(g, w, h, 4, 'rgba(160,120,60,.1)', 20, 60); g.strokeStyle = INK; g.lineWidth = Math.max(6, w * .012); g.strokeRect(3, 3, w - 6, h - 6); };

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
  const CAR_CFG = {
    sedan: { L: 4.5, W: 1.78, wx: 1.38, r: .34, top: [[-2.25, .56], [-2.24, .8], [-2.16, .95], [-1.95, 1.0], [-1.36, 1.03], [-.78, 1.42], [.36, 1.46], [1.13, 1.03], [1.6, .96], [2.08, .88], [2.21, .83], [2.27, .7], [2.29, .46]],
      belt: x => 1.0 - x * .012, gh: [-1.36, 1.13], ws: [.36, 1.13], rw: [-1.36, -.78], A: [.98, 1.13], B: [-.24, -.12], C: [-1.36, -1.02], doors: [1.0, -.18, -1.3], hy: .74, ty: .84 },
    kei: { L: 3.4, W: 1.48, wx: 1.1, r: .29, top: [[-1.71, .5], [-1.7, 1.5], [-1.63, 1.64], [.8, 1.67], [1.42, 1.14], [1.6, 1.0], [1.68, .94], [1.73, .8], [1.74, .48]],
      belt: x => 1.03, gh: [-1.63, 1.42], ws: [.8, 1.42], rw: [-1.71, -1.63], A: [1.28, 1.42], B: [-.12, 0], C: [-1.63, -1.36], doors: [1.08, .02, -.9], hy: .84, ty: 1.02 } };
  const TOONG = (() => { const c = document.createElement('canvas'); c.width = 4; c.height = 1; const g = c.getContext('2d'); ['#6a6a6a', '#a8a8a8', '#e6e6e6', '#ffffff'].forEach((col, i) => { g.fillStyle = col; g.fillRect(i, 0, 1, 1); }); const t = new T.CanvasTexture(c); t.minFilter = t.magFilter = T.NearestFilter; t.generateMipmaps = false; return t; })();
  const TOON = (o) => new T.MeshToonMaterial(Object.assign({ gradientMap: TOONG, side: T.DoubleSide }, o));
  function car3d(o = {}) { const type = o.type || 'sedan', col = o.color || '#d2283a', C = CAR_CFG[type], g = new T.Group(), L2 = C.L / 2, W2 = C.W / 2;
    const topAt = x => { const P = C.top; if (x <= P[0][0]) return P[0][1]; for (let i = 0; i < P.length - 1; i++) if (x <= P[i + 1][0]) return P[i][1] + (P[i + 1][1] - P[i][1]) * (x - P[i][0]) / (P[i + 1][0] - P[i][0]); return P[P.length - 1][1]; };
    const botAt = x => { let y = .28 + Math.max(0, (Math.abs(x) - (L2 - .3)) / .3) * .08; [-C.wx, C.wx].forEach(wx => { const d = Math.abs(x - wx), R0 = C.r + .08; if (d < R0) y = Math.max(y, C.r + Math.sqrt(R0 * R0 - d * d)); }); return y; };
    // secciones
    const xs = new Set(); for (let i = 0; i <= 120; i++) xs.add(+(-L2 + C.L * i / 120).toFixed(4)); C.top.forEach(p => xs.add(p[0])); [-C.wx, C.wx].forEach(wx => [-1, 1].forEach(s => xs.add(+(wx + s * (C.r + .079)).toFixed(4))));
    const X = [...xs].filter(x => x >= -L2 && x <= L2).sort((a, b) => a - b), NR = 10;
    const ring = x => { const yT = topAt(x), yB = Math.min(botAt(x), yT - .05), belt = C.belt(x), gh = x > C.gh[0] && x < C.gh[1] && yT > belt + .04; const rows = [];
      const body = [[yB, .93], [yB + .04, .97], [Math.max(yB + .06, .5), 1], [.66, 1], [.69, .995], [belt - .02, .985]]; body.forEach(([y, k]) => rows.push([Math.min(Math.max(y, yB), gh ? belt : yT), k]));
      if (gh) { rows[5][0] = belt - .02; rows.push([belt + .01, .955], [lerp(belt, yT, .5), .865], [yT - .03, .77], [yT, .68]); }
      else { const yt = Math.min(yT, rows[5][0]); rows[5] = [yT - .05, .97]; rows.push([yT - .015, .9], [yT, .8], [yT + .008, .6], [yT + .012, .35]); }
      for (let i = 1; i < rows.length; i++) rows[i][0] = Math.max(rows[i][0], rows[i - 1][0] + .0005);
      return { rows, yT, gh, cy: yT + (gh ? .02 : .014) }; };
    const pos = [], uv = [], R_ = X.map(ring), NP = NR * 2 + 1;
    R_.forEach((r, i) => { const x = X[i], pts = []; for (let j = 0; j < NR; j++) pts.push([r.rows[j][0], -W2 * r.rows[j][1]]); pts.push([r.cy, 0]); for (let j = NR - 1; j >= 0; j--) pts.push([r.rows[j][0], W2 * r.rows[j][1]]);
      pts.forEach(([y, z]) => { pos.push(x, y, z); uv.push((x + L2) / C.L, y / 1.8); }); });
    const groups = { paint: [], glass: [], trim: [], black: [] }, idx = (i, j) => i * NP + j;
    const inR = (x, r) => x >= r[0] && x <= r[1];
    for (let i = 0; i < X.length - 1; i++) { const xm = (X[i] + X[i + 1]) / 2, gh = R_[i].gh && R_[i + 1].gh;
      for (let j = 0; j < NP - 1; j++) { const side = Math.min(j, NP - 2 - j), q = [idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j), idx(i + 1, j + 1), idx(i, j + 1)];
        let m = 'paint';
        if (gh) { if (side === 5) m = 'trim'; else if (side >= 6 && side <= 8) m = inR(xm, C.A) || inR(xm, C.B) ? 'black' : inR(xm, C.C) ? 'paint' : 'glass'; else if (side === 9) m = inR(xm, C.ws) || inR(xm, C.rw) ? 'glass' : 'paint'; }
        if (j >= NP - 1 - 0) continue; (groups[m]).push(...(j < NR ? q : q)); } }
    // tapas delantera y trasera (abanico al centro)
    [[0, 1], [X.length - 1, -1]].forEach(([i, dir]) => { const c0 = pos.length / 3; let cy = 0; for (let j = 0; j < NP; j++) cy += pos[(idx(i, j)) * 3 + 1]; pos.push(X[i], cy / NP, 0); uv.push((X[i] + L2) / C.L, cy / NP / 1.8);
      for (let j = 0; j < NP - 1; j++) groups.paint.push(...(dir > 0 ? [c0, idx(i, j + 1), idx(i, j)] : [c0, idx(i, j), idx(i, j + 1)])); groups.paint.push(...(dir > 0 ? [c0, idx(i, 0), idx(i, NP - 1)] : [c0, idx(i, NP - 1), idx(i, 0)])); });
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    const all = []; const ORDER = ['paint', 'glass', 'trim', 'black']; ORDER.forEach((k, mi) => { geo.addGroup(all.length, groups[k].length, mi); all.push(...groups[k]); }); geo.setIndex(all); geo.computeVertexNormals();
    // pintura con juntas de puertas y degradado
    const paintT = tex(2048, 512, (c, w, h) => { const Xp = x => (x + L2) / C.L * w, Yp = y => h - y / 1.8 * h; const gr = c.createLinearGradient(0, Yp(1.5), 0, Yp(.25)); gr.addColorStop(0, col); gr.addColorStop(1, col); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(0, Yp(C.belt(0) - .06), w, 10);
      c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(0, Yp(.42), w, Yp(.28) - Yp(.42)); c.strokeStyle = '#1b1720'; c.lineWidth = 6;
      C.doors.forEach(x => { c.beginPath(); c.moveTo(Xp(x), Yp(C.belt(x) - .01)); c.lineTo(Xp(x - .03), Yp(.4)); c.stroke(); }); c.beginPath(); c.moveTo(Xp(C.doors[0]), Yp(.4)); c.lineTo(Xp(C.doors[2]), Yp(.4)); c.stroke();
      c.beginPath(); c.moveTo(Xp(C.gh[1] + .05), Yp(C.belt(0) - .01)); c.lineTo(Xp(L2 - .35), Yp(topAt(L2 - .35) - .02)); c.stroke();          // junta del capó
      c.fillStyle = 'rgba(16,14,20,.45)'; c.beginPath(); c.arc(Xp(-L2 + .6), Yp(.86), 9, 0, 7); c.fill(); });
    paintT.wrapS = paintT.wrapT = T.ClampToEdgeWrapping;
    const paint = TOON({ color: '#ffffff', map: paintT });
    const glassT = tex(1024, 256, (c, w, h) => { c.fillStyle = '#34507a'; c.fillRect(0, 0, w, h); c.fillStyle = '#4f6f9c'; c.fillRect(0, 0, w, h * .4); c.fillStyle = 'rgba(255,255,255,.8)'; [[.36, 46], [.41, 14], [.64, 40]].forEach(([u, ww]) => { const x = u * w; c.beginPath(); c.moveTo(x, h); c.lineTo(x + 50, 0); c.lineTo(x + 50 + ww, 0); c.lineTo(x + ww, h); c.fill(); }); }); const glass = TOON({ color: '#ffffff', map: glassT, emissive: '#1a2a40', emissiveIntensity: .25 });
    const trim = TOON({ color: '#e8ecf0' }), black = TOON({ color: '#2a2c34' });
    add(geo, [paint, glass, trim, black], 0, 0, 0, { parent: g });
    // bajos y pasos de rueda oscuros
    add(RB(C.L - .5, .05, C.W * .9, .02), black, 0, .3, 0, { parent: g, noInk: true });
    [-C.wx, C.wx].forEach(wx => add(new T.CylinderGeometry(C.r + .075, C.r + .075, C.W * .9, 24, 1, true, Math.PI / 2, Math.PI), new T.MeshStandardMaterial({ color: '#0e0f12', roughness: 1, side: T.DoubleSide }), wx, C.r, 0, { parent: g, rx: Math.PI / 2, rz: Math.PI, noInk: true }));
    // ruedas: neumático torneado + llanta de 10 radios con disco y pinza roja
    const tireProf = [[.62, -.11], [.86, -.115], [.97, -.09], [1, -.04], [1, .04], [.97, .09], [.86, .115], [.62, .11]].map(([r, y]) => new T.Vector2(r * C.r, y * .9));
    const tireGeo = new T.LatheGeometry(tireProf, 36); const tireM = TOON({ color: '#2e2e36' }), rimM = TOON({ color: '#dfe3e8' });
    const WHEELS = []; [[C.wx, 1], [-C.wx, 1], [C.wx, -1], [-C.wx, -1]].forEach(([x, sd]) => { const w = new T.Group(); w.position.set(x, C.r, sd * (W2 - .13)); g.add(w);
      add(tireGeo, tireM, 0, 0, 0, { parent: w, rx: Math.PI / 2 });
      const face = new T.Group(); face.position.z = sd * .06; face.scale.z = sd; w.add(face);
      add(new T.CylinderGeometry(C.r * .64, C.r * .64, .03, 32, 1, true), rimM, 0, 0, 0, { parent: face, rx: Math.PI / 2, noInk: true });
      add(new T.CylinderGeometry(C.r * .6, C.r * .6, .01, 28), STD({ color: '#2a2c30', roughness: .6 }), 0, 0, -.03, { parent: face, rx: Math.PI / 2, noInk: true });
      add(new T.CylinderGeometry(C.r * .42, C.r * .42, .015, 24), STD({ color: '#8a8e94', metalness: .6, roughness: .5 }), 0, 0, -.02, { parent: face, rx: Math.PI / 2, noInk: true });
      add(RB(.06, C.r * .3, .05, .015), STD({ color: '#d2283a', roughness: .4 }), C.r * .2, C.r * .3, -.012, { parent: face, noInk: true });
      for (let k = 0; k < 10; k++) { const s_ = add(RB(C.r * .52, .028, .02, .008), rimM, 0, 0, .006, { parent: face, noInk: true }); s_.geometry.translate(C.r * .3, 0, 0); s_.rotation.z = k / 10 * Math.PI * 2 + (k % 2) * .12; }
      add(new T.CylinderGeometry(C.r * .13, C.r * .13, .04, 18), rimM, 0, 0, .014, { parent: face, rx: Math.PI / 2, noInk: true }); for (let k = 0; k < 5; k++) add(new T.SphereGeometry(.009, 6, 4), STD({ color: '#3a3e46' }), Math.cos(k * 1.257) * C.r * .08, Math.sin(k * 1.257) * C.r * .08, .036, { parent: face, noInk: true });
      WHEELS.push(w); });
    // frontal: faros con reflector y lente, tira LED, parrilla de panal, entradas inferiores y antinieblas
    const nose = (y) => { let x = L2; while (x > 0 && topAt(x) < y) x -= .005; return x; }, fxH = nose(C.hy), fxG = nose(C.hy - .16), honey = tex(256, 128, (c, w, h) => { c.fillStyle = '#121317'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3a3d44'; c.lineWidth = 3; for (let y = 0; y < h + 16; y += 16) for (let x = 0; x < w + 18; x += 18) { c.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; c.lineTo(x + (y / 16 % 2) * 9 + Math.cos(a) * 7, y + Math.sin(a) * 7); } c.closePath(); c.stroke(); } });
    const lensM = TOON({ color: '#fff8dc', emissive: '#fff2c0', emissiveIntensity: .6 });
    [-1, 1].forEach(sd => { const hz = sd * W2 * .6, hg = new T.Group(); hg.position.set(nose(C.hy) - .01, C.hy, hz); hg.rotation.y = -sd * .18; g.add(hg);
      add(RB(.12, .15, .42, .05), black, -.02, 0, 0, { parent: hg }); add(new T.SphereGeometry(.055, 16, 10, 0, Math.PI), trim, .02, 0, -sd * .1, { parent: hg, ry: Math.PI / 2, noInk: true }); add(new T.SphereGeometry(.045, 16, 10, 0, Math.PI), trim, .02, 0, sd * .06, { parent: hg, ry: Math.PI / 2, noInk: true });
      add(RB(.02, .025, .36, .01), STD({ color: '#ffffff', emissive: '#e8f4ff', emissiveIntensity: 2.2 }), .05, -.055, 0, { parent: hg, noInk: true }); add(RB(.04, .14, .4, .05), lensM, .05, 0, 0, { parent: hg, noInk: true, cast: false });
      add(new T.CylinderGeometry(.04, .04, .03, 16), trim, nose(.45) + .03, .45, sd * W2 * .66, { parent: g, rz: Math.PI / 2, noInk: true }); add(new T.CylinderGeometry(.032, .032, .035, 16), STD({ color: '#fff8e0', emissive: '#fff0c0', emissiveIntensity: .8 }), nose(.45) + .04, .45, sd * W2 * .66, { parent: g, rz: Math.PI / 2, noInk: true }); });
    add(RB(.05, .2, C.W * .5, .03), new T.MeshStandardMaterial({ map: honey, roughness: .5 }), fxG + .015, C.hy - .14, 0, { parent: g }); add(RB(.03, .025, C.W * .52, .01), trim, fxG + .04, C.hy - .03, 0, { parent: g, noInk: true });
    add(RB(.05, .12, C.W * .62, .03), new T.MeshStandardMaterial({ map: honey, roughness: .5 }), nose(.4) + .01, .4, 0, { parent: g, noInk: true });
    // trasera: pilotos envolventes con franja cromada, escape, luz de matrícula
    const rX = y => { let x = -L2; while (x < 0 && topAt(x) < y) x += .005; return x; }, tlx = rX(C.ty + .05), tailM = TOON({ color: '#e0283a', emissive: '#b01020', emissiveIntensity: .5 });
    [-1, 1].forEach(sd => { const tg_ = new T.Group(); tg_.position.set(tlx + .02, C.ty, sd * W2 * .7); tg_.rotation.y = sd * .3; g.add(tg_); add(RB(.08, .14, .46, .04), tailM, 0, 0, 0, { parent: tg_ }); add(RB(.09, .03, .4, .01), STD({ color: '#ffffff', emissive: '#ffe8e0', emissiveIntensity: .6 }), 0, -.03, 0, { parent: tg_, noInk: true }); });
    add(RB(.03, .04, C.W * .5, .01), trim, tlx - .01, C.ty, 0, { parent: g, noInk: true });
    add(new T.CylinderGeometry(.04, .045, .16, 14), trim, -L2 + .02, .3, -W2 * .55, { parent: g, rz: Math.PI / 2 });
    // tiradores, retrovisores con brazo, antena
    [-1, 1].forEach(sd => { const zz = sd * (W2 * .975 + .012); C.doors.slice(0, 2).forEach(x => add(RB(.15, .035, .025, .012), trim, x - .42, C.belt(x) - .12, zz, { parent: g, noInk: true }));
      const mx = C.A[0] - .05, my = C.belt(mx) + .06, mz = sd * (W2 * .95); add(RB(.12, .03, .14, .01), black, mx, my - .02, mz + sd * .06, { parent: g, noInk: true });
      const mh = add(RB(.16, .12, .22, .05), TOON({ color: col }), mx - .02, my + .04, mz + sd * .17, { parent: g }); mh.rotation.y = sd * .15;
      add(RB(.01, .09, .18, .03), TOON({ color: '#a8c8e8' }), mx - .1, my + .04, mz + sd * .17, { parent: g, noInk: true }); });
    if (type === 'kei') add(new T.PlaneGeometry(C.W * .72, .42), glass, -L2 - .006, 1.28, 0, { parent: g, ry: -Math.PI / 2, cast: false, noInk: true });
    if (type === 'sedan') add(new T.CylinderGeometry(.006, .012, .4, 6), black, -1.0, topAt(-1.0) + .18, -.35, { parent: g, rz: .4, noInk: true });
    // matrículas japonesas (blancas con letras verdes)
    const plateT = tex(512, 112, (c, w, h) => { c.fillStyle = '#f6f6f0'; c.fillRect(0, 0, w, h); c.fillStyle = '#1f4fbf'; c.fillRect(0, 0, 64, h); c.fillStyle = '#ffd34a'; for (let k = 0; k < 8; k++) { c.beginPath(); c.arc(32 + Math.cos(k * .785) * 18, 38 + Math.sin(k * .785) * 18, 3, 0, 7); c.fill(); } c.fillStyle = '#fff'; c.font = '900 30px Inter, sans-serif'; c.textAlign = 'center'; c.fillText('E', 32, 98); c.strokeStyle = '#1b1720'; c.lineWidth = 6; c.strokeRect(3, 3, w - 6, h - 6); c.fillStyle = '#1b1720'; c.font = '900 72px Inter, sans-serif'; c.fillText(o.num || '7070 KRB', w / 2 + 30, 82); });
    const plM = STD({ map: plateT, roughness: .6 }); add(new T.PlaneGeometry(.52, .115), plM, nose(.36) + .07, .36, 0, { parent: g, ry: Math.PI / 2, cast: false, noInk: true }); add(new T.PlaneGeometry(.52, .115), plM, rX(.5) - .02, .5, 0, { parent: g, ry: -Math.PI / 2, cast: false, noInk: true });
    // sombra de contacto
    const shT = tex(128, 128, (c, w, h) => { const gr = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(0,0,0,.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    add(new T.PlaneGeometry(C.L + .6, C.W + .6), new T.MeshBasicMaterial({ map: shT, transparent: true, depthWrite: false }), 0, .015, 0, { parent: g, rx: -Math.PI / 2, cast: false, noInk: true });
    g.userData.wheels = WHEELS; return g; }

  // =====================================================================================================
  // BANCO: cámara acorazada (x ∈ [5.9, 11.9], z ∈ [-3.6, 0]), despacho del director delante (x ∈ [5.9, 10.2], z ∈ [.15, 4.4]),
  // vestíbulo (x hasta 26, z hasta 10) con la puerta redonda de la cámara en x = 11.9 (z = -1.8). Archivo en el piso de arriba.
  // =====================================================================================================
  const inVault = p => p.x > 5.9 && p.x < 11.95 && p.z > -3.6 && p.z < .05 && p.y > -.2 && p.y < 3.1;
  const inBank = p => p.x > 5.9 && p.x < 26 && p.z > -3.6 && p.z < 10 && p.y > -.2 && p.y < 6.1 && !inVault(p);
  const VH = 3.0, VHOLE = { x0: 8.6, x1: 9.4, z0: -3.3, z1: ZS };
  // suelo de la cámara (losas de acero) con el hueco de la losa suelta
  const vFloorM = STD({ map: tex(256, 256, (g, w, h) => { g.fillStyle = '#7a8088'; g.fillRect(0, 0, w, h); noise(g, w, h, 8000, ['#6a7078', '#8a9098', '#5a6068']); g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4); [[14, 14], [w - 14, 14], [14, h - 14], [w - 14, h - 14]].forEach(([x, y]) => { g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }); }), metalness: .3, roughness: .5 });
  [[5.9, 11.9, -3.6, VHOLE.z0], [5.9, 11.9, VHOLE.z1, 0], [5.9, VHOLE.x0, VHOLE.z0, VHOLE.z1], [VHOLE.x1, 11.9, VHOLE.z0, VHOLE.z1]].forEach(([a, b, c, d]) => { floorXZ(a, b, c, d, .002, vFloorM, .8); BX(a, b, -.16, 0, c, d, MAT.concrete, { r: .004 }); });
  var VTILE = new T.Group(); VTILE.position.set(VHOLE.x0, .0, (VHOLE.z0 + VHOLE.z1) / 2); scene.add(VTILE); add(RB(.8, .04, .95, .006), vFloorM, .4, .02, 0, { parent: VTILE });
  // paredes de acero remachado, techo
  BX(5.9, 11.9, 0, VH, -3.8, -3.6, MAT.steel, { r: .01 }); wallZY(-3.6, 0, 0, VH, 5.905, MAT.steel, 2, -1); floorXZ(5.9, 11.9, -3.6, 0, VH, MAT.steelDk, 2, { down: true }); BX(5.9, 11.9, 0, VH, 0, .15, MAT.steel, { r: .01 });
  BX(5.9, 11.9, VH, 3.3, -3.6, .15, MAT.concrete, { r: .01 });
  { const sh = new T.Shape(); sh.moveTo(-3.6, 0); sh.lineTo(0, 0); sh.lineTo(0, VH); sh.lineTo(-3.6, VH); sh.closePath(); const hole = new T.Path(); hole.absarc(-1.8, 1.45, 1.25, 0, Math.PI * 2, true); sh.holes.push(hole);
    const eg = new T.ExtrudeGeometry(sh, { depth: .3, bevelEnabled: false, curveSegments: 40 }); const m = add(eg, MAT.steel, 12.2, 0, 0, { ry: -Math.PI / 2 }); }
  add(new T.TorusGeometry(1.3, .08, 10, 48), MAT.steelShiny, 12.22, 1.45, -1.8, { ry: Math.PI / 2 });
  // puerta redonda de la cámara (bisagra en z = -.5): W2.setVaultDoor(k)
  var VDOOR = new T.Group(); VDOOR.position.set(12.2, 0, -.5); scene.add(VDOOR);
  { const d = new T.Group(); d.position.set(0, 1.45, -1.3); VDOOR.add(d); add(new T.CylinderGeometry(1.22, 1.22, .42, 48), MAT.steelShiny, .05, 0, 0, { parent: d, rz: Math.PI / 2 });
    add(new T.CylinderGeometry(1.0, 1.0, .03, 40), STD({ map: tex(512, 512, (g, w, h) => { g.fillStyle = '#b8c0c8'; g.fillRect(0, 0, w, h); for (let r = 40; r < 256; r += 18) { g.strokeStyle = `rgba(0,0,0,${.05 + (r % 36) / 400})`; g.lineWidth = 2; g.beginPath(); g.arc(w / 2, h / 2, r, 0, 7); g.stroke(); } g.save(); g.translate(w / 2, h / 2); g.rotate(Math.PI / 2); g.scale(1, -1); txt(g, 'INVIOLABLE', 0, 164, 46, '#4a5058', 900); g.restore(); }), metalness: .5, roughness: .3 }), .27, 0, 0, { parent: d, rz: Math.PI / 2, noInk: true });
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; add(new T.CylinderGeometry(.06, .06, .5, 10), MAT.steelShiny, -.02, Math.sin(a) * 1.06, Math.cos(a) * 1.06, { parent: d, rz: Math.PI / 2 }); }
    const wh = new T.Group(); wh.position.set(.42, 0, 0); d.add(wh); add(new T.TorusGeometry(.42, .045, 10, 32), MAT.brass, 0, 0, 0, { parent: wh, ry: Math.PI / 2 }); add(new T.CylinderGeometry(.1, .1, .14, 16), MAT.brass, -.05, 0, 0, { parent: wh, rz: Math.PI / 2 });
    for (let k = 0; k < 3; k++) { const s_ = add(new T.CylinderGeometry(.03, .03, .84, 8), MAT.brass, 0, 0, 0, { parent: wh }); s_.rotation.x = k * Math.PI / 3; } d.userData.wheel = wh; VDOOR.userData.d = d;
    add(RB(.1, .5, .24, .03), MAT.steelShiny, .22, 0, -1.08, { parent: d }); }
  // estanterías con lingotes (dos módulos al fondo; hueco entre ellos sobre la losa suelta), fajos de billetes y sacos
  const GOLD = [], CASH = []; const goldGeo = (() => { const g = new T.CylinderGeometry(.075, .1, .065, 4, 1); g.rotateY(Math.PI / 4); g.scale(1.85, 1, .82); return g; })();
  const shelfUnit = (x0, x1, items) => { BX(x0, x1, 2.4, 2.45, -3.58, -3.02, MAT.steelDk); [x0, x1].forEach(x => BX(x - .04, x + .04, 0, 2.45, -3.58, -3.02, MAT.steelDk)); BX(x0, x1, 0, 2.45, -3.6, -3.58, MAT.steelDk);
    [.08, .7, 1.32, 1.94].forEach((y, si) => { BX(x0, x1, y - .04, y, -3.58, -3.02, MAT.steelDk);
      const it = items[si]; if (it === 'gold') { for (let r = 0; r < 2; r++) { const n = Math.floor((x1 - x0 - .1) / .3) - r; for (let i = 0; i < n; i++) { const m = add(goldGeo, MAT.gold, x0 + .2 + r * .15 + i * .3, y + .033 + r * .066, -3.3, { noInk: false }); m.userData.si = si; GOLD.push(m); } } }
      if (it === 'cash') { const n = Math.floor((x1 - x0 - .1) / .26); for (let i = 0; i < n; i++) for (let l = 0; l < 3; l++) { const m = add(RB(.22, .08, .12, .01), STD({ map: tex(128, 64, (g, w, h) => { g.fillStyle = '#9ab88a'; g.fillRect(0, 0, w, h); for (let k = 0; k < 8; k++) { g.fillStyle = k % 2 ? '#8aa87a' : '#b0c8a0'; g.fillRect(0, k * 8, w, 4); } g.fillStyle = '#f4f0e0'; g.fillRect(w * .42, 0, 18, h); }) }), x0 + .17 + i * .26, y + .045 + l * .085, -3.3 - (l % 2) * .03); CASH.push(m); } }
      if (it === 'bags') for (let i = 0; i < 3; i++) { const bg = new T.Group(); bg.position.set(x0 + .35 + i * .6, y, -3.28); scene.add(bg); add(new T.SphereGeometry(.2, 14, 12), STD({ color: '#c8b48a', roughness: 1 }), 0, .19, 0, { parent: bg, s: [1, 1.05, .9] }); add(new T.CylinderGeometry(.05, .09, .12, 10), STD({ color: '#b8a47a', roughness: 1 }), 0, .42, 0, { parent: bg }); add(new T.TorusGeometry(.055, .015, 6, 12), STD({ color: '#7a4a2a' }), 0, .38, 0, { parent: bg, rx: Math.PI / 2 });
        sign(.16, .16, 64, (g, w, h) => { g.fillStyle = '#c8b48a'; g.fillRect(0, 0, w, h); txt(g, '€', w / 2, h / 2 + 2, 52, '#5a3a1a', 900); }, 0, .2, .17, { parent: bg, d: .005, noInk: true }); } }); };
  shelfUnit(6.15, 8.4, ['bags', 'gold', 'gold', 'cash']); shelfUnit(9.6, 11.7, ['bags', 'gold', 'cash', 'gold']);
  // pared de cajas de seguridad a la izquierda
  sign(3.0, 2.2, 600, (g, w, h) => { g.fillStyle = '#8a9098'; g.fillRect(0, 0, w, h); const cw = w / 8, ch = h / 6; for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) { const x = i * cw, y = j * ch; g.fillStyle = '#b8c0c8'; g.fillRect(x + 4, y + 4, cw - 8, ch - 8); g.strokeStyle = '#4a5058'; g.lineWidth = 3; g.strokeRect(x + 4, y + 4, cw - 8, ch - 8); g.fillStyle = '#d8a640'; g.beginPath(); g.arc(x + cw * .75, y + ch / 2, 7, 0, 7); g.fill(); g.fillStyle = INK; g.fillRect(x + cw * .75 - 1.5, y + ch / 2 - 2, 3, 8); txt(g, String(j * 8 + i + 101), x + cw * .32, y + ch / 2, 18, '#3a4048', 800); } }, 5.93, 1.35, -1.55, { ry: Math.PI / 2, d: .03 });
  [7.4, 10.4].forEach(x => { add(new T.SphereGeometry(.12, 12, 10), STD({ color: '#fff6dc', emissive: '#ffe6b0', emissiveIntensity: 1.5 }), x, VH - .25, -1.8, { cast: false }); for (let k = 0; k < 4; k++) add(new T.TorusGeometry(.14, .008, 4, 14), MAT.bars, x, VH - .25, -1.8, { ry: k * Math.PI / 4, cast: false, noInk: true }); });
  var VLIGHTS = [zoneLight('#fff0d0', 6, 7, 7.4, VH - .4, -1.8, p => inVault(p) || SECTION), zoneLight('#fff0d0', 6, 7, 10.4, VH - .4, -1.8, p => inVault(p) || SECTION)];
  var GLINT = add(new T.SphereGeometry(.04, 8, 6), STD({ color: '#fff', emissive: '#fffbe0', emissiveIntensity: 4 }), 0, -50, 0, { cast: false, noInk: true });
  // ---------- archivo del banco en el piso de arriba (relleno del corte) ----------
  wallXY(5.9, 11.9, 3.3, 6.2, -3.6, MAT.cream, 2.5); for (let i = 0; i < 4; i++) { const x = 6.6 + i * 1.5; BX(x - .6, x + .6, 3.3, 5.4, -3.55, -3.15, MAT.woodDk); for (let r = 0; r < 4; r++) for (let j = 0; j < 8; j++) add(RB(.11, .38, .3, .01), STD({ color: ['#c8302e', '#2f6fbf', '#e8b830', '#4a8a5a', '#8a5a9a'][(i + r + j) % 5] }), x - .5 + j * .14, 3.62 + r * .48, -3.3, { noInk: true }); }
  zoneLight('#ffe8c0', 3, 7, 8.9, 5.6, -2.6, () => SECTION);
  // ---------- despacho del director ----------
  const inOff = p => p.x > 5.9 && p.x < 10.25 && p.z > .1 && p.z < 4.5 && p.y < 3.3;
  wallXY(5.9, 10.2, 0, 3.3, .151, MAT.woodPanel, 2.2); floorXZ(5.9, 10.2, .15, 4.4, .003, STD({ map: planksT('#7a4a2a', 10), roughness: .6 }), 2.4); floorXZ(5.9, 10.2, .15, 4.4, 3.3, MAT.cream, 2.4, { down: true });
  wallZY(.15, 4.4, 0, 3.3, 5.905, MAT.cream, 2.4, -1); BX(5.9, 5.96, 0, 1.0, .15, 4.4, MAT.woodPanel, { cast: false });
  [[10.15, 10.25, .15, 4.4], [5.9, 10.25, 4.35, 4.45]].forEach(([a, b, c, d]) => { BX(a, b, 0, .9, c, d, MAT.woodDk); BX(a, b, 2.9, 3.3, c, d, MAT.woodDk); });
  add(new T.PlaneGeometry(4.2, 2.0), STD({ color: '#cfe6f0', transparent: true, opacity: .14, roughness: .05 }), 8.05, 1.9, 4.4, { cast: false, noInk: true }); add(new T.PlaneGeometry(4.2, 2.0), STD({ color: '#cfe6f0', transparent: true, opacity: .14 }), 10.2, 1.9, 2.3, { ry: Math.PI / 2, cast: false, noInk: true });
  for (let z = 1.2; z < 4.4; z += 1.1) BX(10.16, 10.24, .9, 2.9, z - .03, z + .03, MAT.woodDk); for (let x = 6.9; x < 10.2; x += 1.1) BX(x - .03, x + .03, .9, 2.9, 4.36, 4.44, MAT.woodDk);
  sign(1.4, .3, 100, (g, w, h) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, w, h); txt(g, 'DIRECCIÓN', w / 2, h / 2 + 3, 70, '#d8a640', 900, 'center', 6, '#3a2a10'); }, 8.05, 2.55, 4.42, { d: .005 });
  // mesa del director
  BX(7.0, 9.4, .74, .82, 1.5, 2.5, MAT.woodDk); BX(7.05, 9.35, 0, .74, 2.4, 2.48, MAT.woodPanel); [7.05, 9.35].forEach(x => BX(x - .04, x + .04, 0, .74, 1.55, 2.45, MAT.woodPanel));
  BX(7.5, 8.9, .45, .52, .55, 1.1, STD({ color: '#3a2a2a' })); BX(7.5, 8.9, .52, 1.55, .5, .58, STD({ color: '#3a2a2a' }), { r: .08 });
  // libro de cuentas abierto: W2.setLedger(a, b, circ)
  var LEDGER = signTex(800, 520); add(RB(.9, .04, .6, .01), STD({ color: '#6a2a2a' }), 8.2, .84, 1.95); add(new T.PlaneGeometry(.86, .56), STD({ map: LEDGER.t, roughness: .8 }), 8.2, .865, 1.95, { rx: -Math.PI / 2, cast: false, noInk: true });
  // calendario de taco: W2.setCal(k) (DOMINGO 6 → LUNES 7)
  var CAL = signTex(320, 400); add(RB(.34, .44, .14, .02), STD({ color: '#2a5a3a' }), 9.05, 1.04, 1.85, { rx: -.15 }); var CALM = add(new T.PlaneGeometry(.3, .37), STD({ map: CAL.t, roughness: .7 }), 9.05, 1.04, 1.93, { rx: -.15, cast: false, noInk: true });
  var CALPAGE = new T.Group(); CALPAGE.position.set(9.05, 1.235, 1.93); scene.add(CALPAGE); var calPageC = signTex(320, 400); add(new T.PlaneGeometry(.3, .37), STD({ map: calPageC.t, roughness: .7, side: T.DoubleSide }), 0, -.185, .002, { parent: CALPAGE, cast: false, noInk: true });
  sign(.6, .14, 100, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f2d27a'); gr.addColorStop(1, '#b8892a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); txt(g, 'DIRECTOR', w / 2, h / 2 + 3, 62, '#3a2604', 900); }, 7.6, .9, 2.42, { rx: -.3, d: .03 });
  { const lp = new T.Group(); lp.position.set(7.35, .82, 1.75); scene.add(lp); add(new T.CylinderGeometry(.025, .025, .34, 8), MAT.brass, 0, .17, 0, { parent: lp }); add(new T.CylinderGeometry(.09, .1, .03, 14), MAT.brass, 0, .015, 0, { parent: lp }); add(new T.CylinderGeometry(.09, .2, .12, 18, 1, true, 0, Math.PI), STD({ color: '#1f6a3a', emissive: '#1f6a3a', emissiveIntensity: .4, side: T.DoubleSide }), 0, .36, 0, { parent: lp, rz: Math.PI / 2, ry: Math.PI / 2 }); }
  add(RB(.22, .08, .18, .03), MAT.black, 9.2, .86, 2.25); add(new T.TorusGeometry(.07, .025, 6, 14, Math.PI), MAT.black, 9.2, .95, 2.25, { rz: 0 }); add(new T.CylinderGeometry(.04, .035, .09, 12), STD({ color: '#f2efe6' }), 7.6, .865, 2.25);
  // retrato del fundador, diploma, archivador, planta, perchero con bombín, caja fuerte pequeña
  sign(.9, 1.1, 300, (g, w, h) => { g.fillStyle = '#5a4a3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#efe0c8'; g.beginPath(); g.arc(w / 2, h * .4, 70, 0, 7); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); g.fillStyle = '#e8e4dc'; g.beginPath(); g.moveTo(w / 2 - 60, h * .52); g.quadraticCurveTo(w / 2, h * .46, w / 2 + 60, h * .52); g.quadraticCurveTo(w / 2, h * .6, w / 2 - 60, h * .52); g.fill(); g.fillStyle = INK; [[-24, 0], [24, 0]].forEach(([dx]) => { g.beginPath(); g.ellipse(w / 2 + dx, h * .38, 8, 11, 0, 0, 7); g.fill(); });
    g.fillStyle = '#25222a'; g.beginPath(); g.ellipse(w / 2, h * .23, 90, 16, 0, 0, 7); g.fill(); g.fillRect(w / 2 - 56, h * .07, 112, h * .16); g.fillStyle = '#1b1720'; g.fillRect(w * .2, h * .66, w * .6, h * .34); g.strokeStyle = '#d8a640'; g.lineWidth = 24; g.strokeRect(0, 0, w, h); txt(g, '1902', w / 2, h * .9, 40, '#d8a640', 900); }, 8.2, 2.0, .2, { d: .05 });
  sign(.5, .38, 200, (g, w, h) => { g.fillStyle = '#f4eedc'; g.fillRect(0, 0, w, h); txt(g, 'DIPLOMA', w / 2, 40, 34, '#5a3a1a', 900); g.fillStyle = 'rgba(0,0,0,.4)'; for (let k = 0; k < 4; k++) g.fillRect(30, 70 + k * 18, w - 60, 6); g.fillStyle = '#c8243a'; g.beginPath(); g.arc(w - 50, h - 40, 18, 0, 7); g.fill(); g.strokeStyle = '#2a2a2a'; g.lineWidth = 12; g.strokeRect(0, 0, w, h); }, 6.6, 1.9, .19, { d: .02 });
  BX(9.5, 10.05, 0, 1.3, .2, .75, STD({ color: '#6a7078', metalness: .3, roughness: .5 })); for (let k = 0; k < 3; k++) BX(9.6, 9.95, .2 + k * .4, .45 + k * .4, .76, .78, STD({ color: '#8a9098', metalness: .3 }));
  { const pl = new T.Group(); pl.position.set(6.3, 0, 3.9); scene.add(pl); add(new T.CylinderGeometry(.22, .18, .4, 14), STD({ color: '#c86a3a' }), 0, .2, 0, { parent: pl }); for (let k = 0; k < 9; k++) add(new T.SphereGeometry(.28, 10, 8), STD({ color: '#3f8f3a', flatShading: true }), Math.cos(k) * .2, .6 + k * .1, Math.sin(k) * .18, { parent: pl, s: [1, .55, 1] }); }
  { const cr = new T.Group(); cr.position.set(9.7, 0, 3.9); scene.add(cr); add(new T.CylinderGeometry(.03, .04, 1.8, 8), MAT.woodDk, 0, .9, 0, { parent: cr }); add(new T.CylinderGeometry(.2, .22, .04, 12), MAT.woodDk, 0, .02, 0, { parent: cr }); add(new T.CylinderGeometry(.13, .13, .14, 16), STD({ color: '#25222a' }), 0, 1.9, 0, { parent: cr }); add(new T.CylinderGeometry(.21, .21, .02, 18), STD({ color: '#25222a' }), 0, 1.83, 0, { parent: cr }); add(RB(.4, .9, .18, .08), STD({ color: '#2a2d36' }), .1, 1.3, .05, { parent: cr }); }
  zoneLight('#ffe2b0', 5, 7, 8.0, 2.6, 2.6, inOff); zoneLight('#cfe0ff', 2.5, 7, 9.6, 2.0, 4.0, inOff);
  // ---------- vestíbulo del banco ----------
  floorXZ(5.9, 26, 0, 10, .001, MAT.marble, 1.6); floorXZ(11.9, 26, -3.6, 0, .001, MAT.marble, 1.6); floorXZ(5.9, 26, -3.6, 10, 6.0, MAT.cream, 3, { down: true });
  wallXY(11.9, 26, 0, 6, -3.6, MAT.cream, 3); wallZY(-3.6, 10, 0, 6, 26, MAT.cream, 3, 1); wallXY(5.9, 26, 0, 6, 10, MAT.cream, 3, { ry: Math.PI });
  BX(11.9, 26, 0, 1.2, -3.6, -3.52, MAT.woodPanel, { cast: false }); BX(25.92, 26, 0, 1.2, -3.6, 10, MAT.woodPanel, { cast: false }); BX(5.9, 26, 0, 1.2, 9.92, 10, MAT.woodPanel, { cast: false }); wallZY(4.4, 10, 0, 6, 5.905, MAT.cream, 3, -1); wallZY(0, 4.4, 3.3, 6, 5.905, MAT.cream, 3, -1);
  BX(11.9, 12.25, VH, 6, -3.6, 0, MAT.cream, { r: .01 }); wallXY(5.9, 11.9, 3.3, 6, .16, MAT.cream, 3);
  // columnas
  [[14.5, 1.8], [20, 1.8], [14.5, 6.6], [20, 6.6]].forEach(([x, z]) => { add(new T.CylinderGeometry(.42, .46, 5.2, 24), STD({ map: tileT('#f0ece4', '#e4ded2', 2, .1), roughness: .3 }), x, 2.8, z); add(RB(1.1, .2, 1.1, .03), MAT.cream, x, .1, z); add(RB(1.1, .28, 1.1, .03), MAT.cream, x, 5.86, z); add(new T.CylinderGeometry(.55, .45, .2, 24), MAT.cream, x, 5.62, z); });
  // mostrador de las cajas con cristales
  BX(17, 25, 0, 1.1, -2.5, -2.0, MAT.woodPanel); BX(16.95, 25.05, 1.1, 1.18, -2.6, -1.9, STD({ color: '#3a2a20' })); for (let k = 0; k <= 4; k++) BX(17 + k * 2 - .04, 17 + k * 2 + .04, 1.18, 2.6, -2.3, -2.2, MAT.brass);
  add(new T.PlaneGeometry(8, 1.4), STD({ color: '#d8f0f8', transparent: true, opacity: .16, roughness: .05 }), 21, 1.9, -2.25, { cast: false, noInk: true }); BX(16.95, 25.05, 2.6, 2.7, -2.35, -2.15, MAT.brass);
  for (let k = 0; k < 4; k++) sign(.6, .24, 80, (g, w, h) => { g.fillStyle = '#2a4a3a'; g.fillRect(0, 0, w, h); txt(g, 'CAJA ' + (k + 1), w / 2, h / 2 + 3, 50, '#f2d27a', 900); }, 18 + k * 2, 2.95, -2.25, { d: .03 });
  { const cl = signTex(256, 256); var BANKCLOCK = cl; add(new T.CylinderGeometry(.55, .55, .08, 32), STD({ map: cl.t }), 21, 4.4, -3.55, { rx: Math.PI / 2 }); add(new T.TorusGeometry(.56, .06, 8, 32), MAT.brass, 21, 4.4, -3.5); }
  sign(1.6, .62, 300, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f2d27a'); gr.addColorStop(1, '#b8892a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = '#5a3a08'; g.lineWidth = 10; g.strokeRect(6, 6, w - 12, h - 12); txt(g, 'CÁMARA ACORAZADA', w / 2, h * .36, 62, '#3a2604', 900); txt(g, 'INVIOLABLE DESDE 1902', w / 2, h * .7, 48, '#3a2604', 800); }, 14.0, 2.2, -3.56, { d: .03 });
  sign(1.3, 1.8, 400, (g, w, h) => { g.fillStyle = '#1f3a6a'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2d27a'; g.beginPath(); g.roundRect(w / 2 - 70, 170, 140, 120, 16); g.fill(); g.strokeStyle = '#f2d27a'; g.lineWidth = 22; g.beginPath(); g.arc(w / 2, 170, 52, Math.PI, 0); g.stroke(); g.fillStyle = '#1f3a6a'; g.beginPath(); g.arc(w / 2, 220, 16, 0, 7); g.fill(); g.fillRect(w / 2 - 6, 220, 12, 40);
    txt(g, 'SU DINERO,', w / 2, 380, 48, '#fff', 900); txt(g, 'A SALVO', w / 2, 440, 64, '#f2d27a', 900); txt(g, '100 %', w / 2, 510, 54, '#fff', 900); g.strokeStyle = '#f2d27a'; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12); }, 25.95, 2.4, 4.0, { ry: -Math.PI / 2, d: .03 });
  // timbre de alarma junto a la cámara (con piloto verde «OK»)
  { const al = new T.Group(); al.position.set(15.2, 2.75, -3.52); scene.add(al); add(new T.SphereGeometry(.3, 24, 14, 0, 6.3, 0, 1.6), STD({ color: '#d8262e', metalness: .3, roughness: .35 }), 0, 0, .02, { parent: al, rx: Math.PI / 2 }); add(new T.CylinderGeometry(.05, .05, .1, 10), MAT.steelShiny, 0, 0, .34, { parent: al, rx: Math.PI / 2 });
    add(RB(.22, .3, .1, .02), MAT.steelDk, 0, -.5, .05, { parent: al }); var ALARMLED = add(new T.SphereGeometry(.035, 10, 8), STD({ color: '#3aff7a', emissive: '#2aff6a', emissiveIntensity: 2 }), 0, -.46, .11, { parent: al, cast: false });
    sign(.5, .14, 60, (g, w, h) => { g.fillStyle = '#2a2a2a'; g.fillRect(0, 0, w, h); txt(g, 'ALARMA', w / 2, h / 2 + 2, 40, '#f2efe6', 900); }, 0, -.74, .04, { parent: al, d: .02 }); }
  // lámpara de araña, postes con cordón, planta, banco
  { const ch = new T.Group(); ch.position.set(17.2, 5.0, 3.8); scene.add(ch); add(new T.CylinderGeometry(.015, .015, 1.0, 6), MAT.brass, 0, .5, 0, { parent: ch }); add(new T.TorusGeometry(.6, .04, 8, 30), MAT.brass, 0, 0, 0, { parent: ch, rx: Math.PI / 2 }); for (let k = 0; k < 8; k++) add(new T.SphereGeometry(.09, 10, 8), STD({ color: '#fff8e0', emissive: '#ffe0a0', emissiveIntensity: 1.8 }), Math.cos(k * .785) * .6, .1, Math.sin(k * .785) * .6, { parent: ch, cast: false }); }
  [[15.5, -.6], [17.3, -.6], [19.1, -.6]].forEach(([x, z], i, A) => { add(new T.CylinderGeometry(.04, .05, 1.0, 10), MAT.brass, x, .5, z); add(new T.SphereGeometry(.07, 10, 8), MAT.brass, x, 1.02, z); if (i < A.length - 1) add(new T.TorusGeometry(.9, .03, 6, 20, Math.PI), MAT.velvet, x + .9, .95, z, { rz: Math.PI, s: [1, .25, 1] }); });
  { const pl = new T.Group(); pl.position.set(25.2, 0, 8.8); scene.add(pl); add(new T.CylinderGeometry(.3, .25, .55, 16), STD({ color: '#2a5a4a' }), 0, .27, 0, { parent: pl }); for (let k = 0; k < 7; k++) { const l = add(new T.ConeGeometry(.12, 1.4, 5), STD({ color: '#3f8f3a', flatShading: true }), Math.cos(k) * .1, 1.1, Math.sin(k) * .1, { parent: pl }); l.rotation.z = Math.cos(k * 2) * .5; l.rotation.x = Math.sin(k * 2) * .5; } }
  BX(22, 24.4, .42, .48, 8.6, 9.1, MAT.wood); BX(22, 24.4, .48, .95, 9.05, 9.12, MAT.wood); [22.2, 24.2].forEach(x => BX(x - .04, x + .04, 0, .42, 8.65, 9.05, MAT.woodDk));
  [[14.5, '#d8f0ff'], [20.5, '#d8f0ff']].forEach(([x]) => paintedWin(x, 3.0, 9.92, 1.6, 2.8, Math.PI, cityView, .9, MAT.woodDk, 3)); BX(16.2, 18.2, 0, 3.0, 9.86, 9.94, MAT.woodDk); BX(17.16, 17.24, 0, 3.0, 9.84, 9.86, MAT.brass);
  zoneLight('#ffe8c0', 7, 14, 17.2, 4.6, 3.8, inBank); zoneLight('#ffe8c0', 6, 12, 13.8, 4.4, -1.5, inBank); zoneLight('#ffe8c0', 5, 12, 22, 4.4, -.5, inBank); zoneLight('#dfe8ff', 4, 14, 20, 3.5, 7.5, inBank);
  // ---------- fachadas y calle ----------
  const outside = p => !inJ(p) && !inHall(p) && !inCell(p) && !inVault(p) && !inBank(p) && !inOff(p) && p.y > -.2 && Math.abs(p.x - KX) > 8;
  // cárcel: fachada de piedra, puerta con arco, ventanas con barrotes, almenas, alambre, torre de vigilancia
  BX(-16.5, 2.3, 0, 7.4, 8.0, 8.6, MAT.stone); BX(-16.5, 2.3, 7.4, 7.7, -3.6, 8.6, MAT.stoneDk); BX(-16.5, 2.3, 0, 7.4, -3.8, -3.6, MAT.stone);
  for (let x = -16.3; x < 2.2; x += .9) BX(x, x + .5, 7.7, 8.3, 8.2, 8.6, MAT.stone);
  for (let x = -16; x < 2; x += .8) { const c = add(new T.TorusGeometry(.18, .012, 4, 16), MAT.bars, x, 8.6, 8.4, { ry: Math.PI / 2 + .3, cast: false, noInk: true }); }
  add(new T.CylinderGeometry(.012, .012, 18.6, 4), MAT.bars, -7.1, 8.6, 8.4, { rz: Math.PI / 2, noInk: true });
  { const g = new T.Group(); g.position.set(-8, 0, 8.6); scene.add(g); const sh = new T.Shape(); sh.moveTo(-2.1, 0); sh.lineTo(-2.1, 3.0); sh.absarc(0, 3.0, 2.1, Math.PI, 0, true); sh.lineTo(2.1, 0); sh.lineTo(1.6, 0); sh.lineTo(1.6, 3.0); sh.absarc(0, 3.0, 1.6, 0, Math.PI, false); sh.lineTo(-1.6, 0); sh.closePath();
    add(new T.ExtrudeGeometry(sh, { depth: .3, bevelEnabled: false, curveSegments: 24 }), MAT.stoneDk, 0, 0, 0, { parent: g });
    const dm = STD({ map: tex(256, 256, (c, w, h) => { c.fillStyle = '#3a3f48'; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 32) { c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(x, 0, 4, h); } for (let y = 20; y < h; y += 60) for (let x = 16; x < w; x += 32) { c.fillStyle = '#6a7078'; c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); } }), metalness: .4, roughness: .5 });
    add(new T.PlaneGeometry(3.2, 4.6), dm, 0, 2.3, .02, { parent: g, cast: false, noInk: true }); add(new T.CircleGeometry(1.6, 24, 0, Math.PI), dm, 0, 3.0, .021, { parent: g, cast: false, noInk: true }); add(new T.CylinderGeometry(.02, .02, 4.6, 6), MAT.black, 0, 2.3, .05, { parent: g, noInk: true });
    sign(5.6, .7, 200, (c, w, h) => { c.fillStyle = '#5a564e'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a2824'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); txt(c, 'PRISIÓN PROVINCIAL', w / 2, h / 2 + 4, 120, '#efe6d2', 900); }, 0, 5.6, .32, { parent: g, d: .12 }); }
  for (let x = -15; x < 2; x += 2.4) [2.4, 5.4].forEach(y => { if (Math.abs(x + 8) < 2.6 && y < 5) return; paintedWin(x, y, 8.62, .7, 1.0, 0, (c, w, h) => { c.fillStyle = '#1a1c22'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,220,150,.15)'; c.fillRect(0, h * .6, w, h * .4); }, .2, MAT.stoneDk, 3); });
  { const tw = new T.Group(); tw.position.set(-17.2, 0, 8.2); scene.add(tw); add(new T.CylinderGeometry(1.5, 1.7, 10, 24), MAT.stone, 0, 5, 0, { parent: tw }); add(new T.CylinderGeometry(1.9, 1.9, .4, 24), MAT.stoneDk, 0, 10.2, 0, { parent: tw }); add(new T.CylinderGeometry(1.5, 1.5, 1.4, 24, 1, true), STD({ color: '#2a2c30', side: T.DoubleSide }), 0, 11.1, 0, { parent: tw }); add(new T.ConeGeometry(2.2, 1.6, 24), STD({ color: '#5a2a24' }), 0, 12.6, 0, { parent: tw });
    for (let k = 0; k < 6; k++) add(new T.CylinderGeometry(.06, .06, 1.4, 6), MAT.stoneDk, Math.cos(k) * 1.5, 11.1, Math.sin(k) * 1.5, { parent: tw }); add(new T.CylinderGeometry(.22, .3, .4, 14), STD({ color: '#d8d4c8', emissive: '#fff4d0', emissiveIntensity: .4 }), .9, 11.2, .9, { parent: tw, rx: .8 }); }
  BX(-30, -17.5, 0, 9, -4, 8.6, MAT.brickOld); BX(26.2, 40, 0, 10, -4, 10, MAT.brick);                                                       // edificios vecinos
  for (let x = -29; x < -18; x += 2.2) [2.5, 5.5].forEach(y => paintedWin(x, y, 8.62, 1.0, 1.4, 0, skyView, .6, MAT.white));
  for (let x = 27.5; x < 39; x += 2.4) [2.5, 5.5, 8].forEach(y => paintedWin(x, y, 10.02, 1.1, 1.5, 0, skyView, .6, MAT.white));
  // banco: fachada con pórtico de columnas, frontón con «BANCO» y escalinata
  const bankStone = STD({ map: stoneBlockT('#e2d8c4'), roughness: .8 });
  BX(5.3, 26, 0, 6.2, 10, 10.4, bankStone); BX(5.3, 26.2, 6.2, 6.6, -3.6, 10.6, MAT.stoneDk); BX(5.3, 26, 0, 6.2, -3.8, -3.6, bankStone); BX(26, 26.2, 0, 6.2, -3.6, 10.4, bankStone);
  for (let k = 0; k < 3; k++) BX(8.4, 22.6, k * .16, (k + 1) * .16, 10.4 + k * .0, 12.2 - k * .45, STD({ color: '#d8d0c0' }));
  [9, 11.6, 14.2, 16.8, 19.4, 22].forEach(x => { add(new T.CylinderGeometry(.34, .38, 5.0, 24), STD({ map: tileT('#efe8da', '#e6dece', 2, .1), roughness: .5 }), x, 3.0, 11.3); add(RB(.9, .2, .9, .03), bankStone, x, .58, 11.3); add(RB(.95, .3, .95, .03), bankStone, x, 5.6, 11.3); });
  BX(8.3, 22.7, 5.75, 6.5, 10.4, 11.85, bankStone);
  sign(9.0, .62, 160, (c, w, h) => { c.fillStyle = '#e2d8c4'; c.fillRect(0, 0, w, h); txt(c, 'B  A  N  C  O', w / 2, h / 2 + 6, 120, '#3a3428', 900); }, 15.5, 6.1, 11.86, { d: .02 });
  { const sh = new T.Shape(); sh.moveTo(-7.2, 0); sh.lineTo(7.2, 0); sh.lineTo(0, 2.1); sh.closePath(); add(new T.ExtrudeGeometry(sh, { depth: 1.4, bevelEnabled: false }), bankStone, 15.5, 6.5, 10.45);
    sign(1.6, .5, 120, (c, w, h) => { c.fillStyle = '#e2d8c4'; c.fillRect(0, 0, w, h); txt(c, '1902', w / 2, h / 2 + 4, 96, '#5a5040', 900); }, 15.5, 7.1, 11.87, { d: .02 }); }
  { const dm = STD({ map: tex(256, 256, (c, w, h) => { c.fillStyle = '#4a2e1c'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(w / 2 - 3, 0, 6, h); [[30, 30], [150, 30], [30, 150], [150, 150]].forEach(([x, y]) => { c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 6; c.strokeRect(x, y, 76, 96); }); c.fillStyle = '#d8a640'; c.fillRect(w / 2 - 20, h / 2, 10, 30); c.fillRect(w / 2 + 10, h / 2, 10, 30); }) });
    add(new T.PlaneGeometry(2.2, 3.2), dm, 15.5, 1.6 + .48, 10.41, { cast: false, noInk: true }); }
  [11.6, 19.4].forEach(x => paintedWin(x + 1.3 * Math.sign(x - 15.5), 2.6, 10.41, 1.2, 2.2, 0, (c, w, h) => { c.fillStyle = '#2a3440'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,230,180,.35)'; c.fillRect(0, h * .55, w, h * .45); }, .4, MAT.woodDk, 4));
  [8.1, 22.9].forEach(x => { add(new T.CylinderGeometry(.05, .07, 2.4, 10), MAT.black, x, 1.6, 12.3); add(new T.SphereGeometry(.22, 14, 12), STD({ color: '#fff4dc', emissive: '#ffd890', emissiveIntensity: .3 }), x, 2.95, 12.3); });
  // acera, bordillo, calzada, paso de cebra, acera de enfrente
  floorXZ(-30, 40, 8.6, 13, .12, MAT.pave, 2); BX(-30, 40, 0, .12, 12.9, 13.05, MAT.concrete); floorXZ(-30, 40, 13, 21, .001, MAT.asphalt, 3); floorXZ(-30, 40, 21, 24, .12, MAT.pave, 2); BX(-30, 40, 0, .12, 20.95, 21.1, MAT.concrete);
  for (let x = -28; x < 40; x += 4) add(RB(2, .005, .14, .002), MAT.white, x, .004, 17, { cast: false, noInk: true }); for (let k = 0; k < 8; k++) add(RB(.45, .005, 3.6, .002), MAT.white, -1.6 + k * .9, .004, 17, { cast: false, noInk: true });
  BX(-30, 40, 0, 12, 24, 26, MAT.brickOld); for (let x = -28; x < 40; x += 3.2) [1.6, 5, 8.4].forEach(y => paintedWin(x, y, 23.98, 1.2, y < 2 ? 2.4 : 1.6, Math.PI, y < 2 ? cityView : skyView, .7, MAT.white));
  // farolas, árboles, banco, buzón amarillo, boca de incendios, papelera
  const lampPost = (x, z) => { add(new T.CylinderGeometry(.07, .1, 4.2, 10), MAT.black, x, 2.22, z); add(new T.CylinderGeometry(.16, .16, .25, 10), MAT.black, x, .25, z); const b = add(new T.SphereGeometry(.24, 14, 12), STD({ color: '#fff4dc', emissive: '#ffd890', emissiveIntensity: .25 }), x, 4.5, z, { cast: false }); add(new T.ConeGeometry(.26, .24, 10), MAT.black, x, 4.78, z); return b; };
  var STREETLAMPS = [-14, -6, 4, 13, 24, 33].map(x => lampPost(x, 12.5));
  [-10, 0.5, 9.5, 29].forEach(x => { add(new T.CylinderGeometry(.1, .14, 2.4, 8), MAT.woodDk, x, 1.3, 12.2); [[0, 3.0, 0, 1.1], [.6, 2.6, .2, .8], [-.5, 3.3, -.1, .7]].forEach(([dx, y, dz, r]) => add(new T.IcosahedronGeometry(r, 1), STD({ color: '#4f8f3a', flatShading: true, roughness: .95 }), x + dx, y, 12.2 + dz)); add(RB(1.1, .05, 1.1, .01), STD({ color: '#3a3a3a', metalness: .4 }), x, .13, 12.2, { noInk: true }); });
  { const bc = new T.Group(); bc.position.set(-3.5, .12, 11.8); scene.add(bc); add(RB(1.6, .06, .45, .02), MAT.wood, 0, .45, 0, { parent: bc }); add(RB(1.6, .4, .06, .02), MAT.wood, 0, .75, -.22, { parent: bc }); [-.7, .7].forEach(x => add(RB(.06, .45, .45, .01), MAT.black, x, .22, 0, { parent: bc })); }
  { const mb = new T.Group(); mb.position.set(6.6, .12, 12.4); scene.add(mb); add(RB(.5, .6, .4, .1), STD({ color: '#f2c22a' }), 0, .8, 0, { parent: mb }); add(new T.CylinderGeometry(.25, .25, .5, 16, 1, false, 0, Math.PI), STD({ color: '#f2c22a' }), 0, 1.1, 0, { parent: mb, rz: Math.PI / 2, ry: Math.PI / 2 }); add(new T.CylinderGeometry(.06, .06, .5, 8), MAT.black, 0, .25, 0, { parent: mb });
    sign(.36, .2, 80, (c, w, h) => { c.fillStyle = '#f2c22a'; c.fillRect(0, 0, w, h); txt(c, 'CORREOS', w / 2, h / 2 + 2, 30, '#1f3a8a', 900); }, 0, .95, .21, { parent: mb, d: .005 }); }
  { const hy = new T.Group(); hy.position.set(2.0, .12, 12.4); scene.add(hy); add(new T.CylinderGeometry(.13, .15, .6, 12), MAT.red, 0, .3, 0, { parent: hy }); add(new T.SphereGeometry(.14, 12, 8, 0, 6.3, 0, 1.6), MAT.red, 0, .6, 0, { parent: hy }); add(new T.CylinderGeometry(.05, .05, .36, 8), MAT.red, 0, .4, 0, { parent: hy, rz: Math.PI / 2 }); }
  add(new T.CylinderGeometry(.22, .2, .7, 14), STD({ color: '#3a6a4a' }), -1.0, .47, 12.3);
  // coches aparcados y de policía (setPolice)
  var POLICE = new T.Group(); scene.add(POLICE); POLICE.visible = false; var SIRENS = [];

  // coche aparcado y coches de policía (código de coches toon del 69, matrícula española)
  { const c = car3d({ type: 'sedan', color: '#2f6fbf', num: '4821 KTM' }); c.position.set(-11, .0, 14.1); c.rotation.y = 0; scene.add(c); }
  [[11.2, 14.6, .12], [18.6, 14.4, -.18]].forEach(([x, z, ry], i) => { const c = car3d({ type: 'sedan', color: '#f2f4f6', num: i ? '1112 PLC' : '0911 PLC' }); c.position.set(x, 0, z); c.rotation.y = ry; POLICE.add(c);
    [-1, 1].forEach(sd => { add(RB(3.2, .16, .02, .01), STD({ color: '#1f4fbf' }), .1, .72, sd * .9, { parent: c, noInk: true }); sign(1.0, .2, 60, (g, w, h) => { g.clearRect(0, 0, w, h); txt(g, 'POLICÍA', w / 2, h / 2 + 2, 44, '#1f4fbf', 900); }, -.3, .9, sd * .905, { parent: c, ry: sd < 0 ? Math.PI : 0, d: .002, noInk: true }); });
    const bar = new T.Group(); bar.position.set(-.35, 1.5, 0); c.add(bar); add(RB(.25, .12, 1.1, .03), MAT.black, 0, 0, 0, { parent: bar });
    const r = add(RB(.22, .12, .5, .03), STD({ color: '#ff2a3a', emissive: '#ff1a2a', emissiveIntensity: 2 }), 0, .04, -.27, { parent: bar, cast: false }), b = add(RB(.22, .12, .5, .03), STD({ color: '#2a5aff', emissive: '#1a4aff', emissiveIntensity: 2 }), 0, .04, .27, { parent: bar, cast: false });
    const lr = new T.PointLight('#ff2a3a', 0, 14, 1.2), lb = new T.PointLight('#3a6aff', 0, 14, 1.2); lr.position.set(x - .3, 2.2, z - .6); lb.position.set(x - .3, 2.2, z + .6); scene.add(lr, lb); SIRENS.push({ r, b, lr, lb }); });
  // =====================================================================================================
  // COMEDOR (KX = -90): cocina de la cárcel. Mostrador al fondo (z = -3.3) con la cafetera industrial (COFFEE), pizarra del menú,
  // buzón de quejas con telaraña en la pared derecha (x = KX + 4.95), mesas con bancos delante.
  // =====================================================================================================
  const KX = -90, KH = 3.2; const inK = p => Math.abs(p.x - KX) < 5.2 && Math.abs(p.z) < 4.2;
  { const X = KX; floorXZ(X - 5, X + 5, -4, 4, .001, STD({ map: tileT('#b8503a', '#efe6d2', 8, .1), roughness: .45 }), 2.5); floorXZ(X - 5, X + 5, -4, 4, KH, MAT.white, 3, { down: true });
    const tw = STD({ map: wallTileT('#f2f0e8', '#5f9a82') }); wallXY(X - 5, X + 5, 0, KH, -4, tw, 2.2); wallXY(X - 5, X + 5, 0, KH, 4, tw, 2.2, { ry: Math.PI }); wallZY(-4, 4, 0, KH, X - 5, tw, 2.2, -1); wallZY(-4, 4, 0, KH, X + 5, tw, 2.2, 1);
    BX(X - 4.7, X + 4.7, 0, .92, -3.98, -3.3, MAT.steel); BX(X - 4.75, X + 4.75, .92, .97, -4.0, -3.25, MAT.steelShiny);
    // cafetera industrial: W2.setCoffee(k) (0 rota, 1 arreglada)
    var COFFEE = new T.Group(); COFFEE.position.set(X + .9, .97, -3.62); scene.add(COFFEE);
    add(new T.CylinderGeometry(.3, .32, .78, 28), MAT.steelShiny, 0, .39, 0, { parent: COFFEE }); add(new T.SphereGeometry(.3, 24, 12, 0, 6.3, 0, 1.4), MAT.steelShiny, 0, .78, 0, { parent: COFFEE }); add(new T.CylinderGeometry(.05, .05, .08, 12), MAT.black, 0, 1.08, 0, { parent: COFFEE });
    add(RB(.08, .1, .16, .02), MAT.black, 0, .16, .32, { parent: COFFEE }); add(new T.CylinderGeometry(.02, .02, .1, 8), MAT.steelShiny, 0, .1, .4, { parent: COFFEE });
    add(new T.CylinderGeometry(.09, .09, .03, 20), STD({ map: tex(128, 128, (g, w, h) => { g.fillStyle = '#f4f0e0'; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); g.strokeStyle = '#c8243a'; g.lineWidth = 6; g.beginPath(); g.moveTo(64, 64); g.lineTo(100, 40); g.stroke(); }) }), .16, .55, .27, { parent: COFFEE, rx: Math.PI / 2, ry: -.5 });
    var COFLED = [add(new T.SphereGeometry(.03, 10, 8), STD({ color: '#ff3a3a', emissive: '#ff2a2a', emissiveIntensity: 2 }), -.12, .62, .29, { parent: COFFEE, cast: false }), add(new T.SphereGeometry(.03, 10, 8), STD({ color: '#3a3a3a', emissive: '#2aff6a', emissiveIntensity: 0 }), -.04, .62, .3, { parent: COFFEE, cast: false })];
    var COFSIGN = new T.Group(); COFSIGN.position.set(.0, .45, .33); COFFEE.add(COFSIGN); sign(.34, .18, 90, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(240,220,120,.8)'; g.fillRect(0, 0, 30, h); g.fillRect(w - 30, 0, 30, h); txt(g, 'AVERIADA', w / 2, h / 2 + 2, 44, '#c8243a', 900); }, 0, 0, 0, { parent: COFSIGN, d: .005, rz: .08 });
    var COFPANEL = new T.Group(); COFPANEL.position.set(-.3, .2, .05); COFFEE.add(COFPANEL); add(RB(.02, .3, .26, .01), MAT.steelShiny, 0, .15, .13, { parent: COFPANEL });
    for (let k = 0; k < 6; k++) { const mg = new T.Group(); mg.position.set(X - .2 - k * .22, .97, -3.5); scene.add(mg); add(new T.CylinderGeometry(.055, .05, .11, 14), STD({ color: ['#f2efe6', '#c8302e', '#2f6fbf', '#e8b830', '#5a8a5a', '#f2efe6'][k] }), 0, .055, 0, { parent: mg }); add(new T.TorusGeometry(.035, .011, 6, 10), STD({ color: '#f2efe6' }), .06, .055, 0, { parent: mg }); }
    sign(1.9, 1.1, 360, (g, w, h) => { g.fillStyle = '#2a3a2e'; g.fillRect(0, 0, w, h); noise(g, w, h, 3000, ['rgba(255,255,255,.04)']); g.strokeStyle = '#8a5a2a'; g.lineWidth = 22; g.strokeRect(0, 0, w, h);
      txt(g, 'MENÚ', w / 2, 60, 62, '#f4f0e0', 900); txt(g, 'LUNES: LENTEJAS', 60, 140, 40, '#f4f0e0', 700, 'left'); txt(g, 'MARTES: GARBANZOS', 60, 200, 40, '#f4f0e0', 700, 'left'); txt(g, 'MIÉRCOLES:', 60, 260, 40, '#f4f0e0', 700, 'left'); txt(g, 'LENTEJAS CON GARBANZOS', 80, 310, 34, '#ffd34a', 700, 'left'); }, X - 2.6, 2.05, -3.97, { d: .04 });
    // fogón con olla, campana, estante con latas
    BX(X - 4.6, X - 3.0, .97, 1.02, -3.9, -3.35, MAT.black); add(new T.CylinderGeometry(.32, .3, .45, 20), MAT.steelShiny, X - 3.8, 1.25, -3.62); add(new T.CylinderGeometry(.33, .33, .03, 20), MAT.steelShiny, X - 3.8, 1.49, -3.62);
    add(new T.CylinderGeometry(.4, .8, .5, 4), MAT.steel, X - 3.8, 2.6, -3.6, { ry: Math.PI / 4 }); BX(X - 4.0, X - 3.6, 2.85, KH, -3.8, -3.4, MAT.steel);
    BX(X + 2.0, X + 4.6, 1.75, 1.8, -3.98, -3.6, MAT.steelDk); BX(X + 2.0, X + 4.6, 2.35, 2.4, -3.98, -3.6, MAT.steelDk);
    for (let k = 0; k < 9; k++) add(new T.CylinderGeometry(.08, .08, .2, 12), STD({ color: ['#c8302e', '#e8b830', '#3a8a5a'][k % 3] }), X + 2.2 + k * .27, 1.9, -3.78); for (let k = 0; k < 6; k++) add(RB(.28, .3, .2, .02), STD({ color: ['#d8c8a0', '#c8a070'][k % 2] }), X + 2.3 + k * .4, 2.55, -3.78);
    // buzón de quejas con telaraña (pared derecha)
    var QUEJAS = new T.Group(); QUEJAS.position.set(X + 4.86, 1.35, .4); QUEJAS.rotation.y = -Math.PI / 2; scene.add(QUEJAS);
    add(RB(.6, .5, .22, .03), MAT.woodLt, 0, 0, 0, { parent: QUEJAS }); add(RB(.36, .03, .02, .005), MAT.black, 0, .12, .115, { parent: QUEJAS, noInk: true }); add(RB(.12, .14, .04, .01), STD({ color: '#d8a640', metalness: .4 }), .2, -.12, .12, { parent: QUEJAS });
    sign(.62, .2, 80, (g, w, h) => { g.fillStyle = '#f2efe6'; g.fillRect(0, 0, w, h); txt(g, 'BUZÓN DE QUEJAS', w / 2, h / 2 + 2, 38, '#2a2a2a', 900); }, 0, .38, .02, { parent: QUEJAS, d: .02 });
    add(new T.PlaneGeometry(.7, .6), new T.MeshBasicMaterial({ map: tex(256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2; const cx = 150, cy = 110; for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 160, cy + Math.sin(a) * 160); g.stroke(); }
      for (let r = 14; r < 150; r += 16) { g.beginPath(); for (let k = 0; k <= 10; k++) { const a = k / 10 * 6.283, rr = r + Math.sin(k * 3 + r) * 3; const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; k ? g.quadraticCurveTo(cx + Math.cos(a - .3) * rr * .92, cy + Math.sin(a - .3) * rr * .92, x, y) : g.moveTo(x, y); } g.stroke(); }
      g.fillStyle = INK; g.beginPath(); g.ellipse(150, 120, 9, 12, 0, 0, 7); g.fill(); g.beginPath(); g.arc(150, 104, 7, 0, 7); g.fill(); g.lineWidth = 3; g.strokeStyle = INK; for (let k = 0; k < 4; k++) [-1, 1].forEach(sd => { g.beginPath(); g.moveTo(150, 116 + k * 4); g.quadraticCurveTo(150 + sd * 16, 104 + k * 6, 150 + sd * 22, 118 + k * 8); g.stroke(); }); }), transparent: true, depthWrite: false }), .02, .08, .13, { parent: QUEJAS, cast: false, noInk: true });
    // ventana con barrotes, reloj, cartel de lavarse las manos, mesas con bancos, tubos fluorescentes
    paintedWin(X - 4.95, 1.9, -1.0, 1.4, 1.1, Math.PI / 2, (g, w, h) => { skyView(g, w, h); g.fillStyle = '#8a8478'; g.fillRect(0, h * .55, w, h * .45); g.fillStyle = '#a8a294'; for (let x = 0; x < w; x += 60) g.fillRect(x, h * .55, 56, 26); }, .9, MAT.steelDk, 5);
    { const cl = signTex(256, 256); var KCLOCK = cl; add(new T.CylinderGeometry(.28, .28, .05, 24), STD({ map: cl.t }), X + 2.2, 2.6, 3.96, { rx: Math.PI / 2, ry: Math.PI }); }
    sign(.6, .8, 320, (g, w, h) => { g.fillStyle = '#e8f4ff'; g.fillRect(0, 0, w, h); g.fillStyle = '#2f6fbf'; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(80 + k * 22, 80, 10, 36, -.3, 0, 7); g.fill(); } g.beginPath(); g.ellipse(118, 140, 58, 42, 0, 0, 7); g.fill(); for (let k = 0; k < 6; k++) { g.fillStyle = '#7ac8ff'; g.beginPath(); g.arc(40 + k * 32, 200 + (k % 2) * 10, 8, 0, 7); g.fill(); } txt(g, 'LÁVATE', w / 2, 250, 40, '#1b3a6a', 900); txt(g, 'LAS MANOS', w / 2, 292, 34, '#1b3a6a', 900); g.strokeStyle = INK; g.lineWidth = 8; g.strokeRect(3, 3, w - 6, h - 6); }, X + 4.95, 1.6, -2.6, { ry: -Math.PI / 2, d: .02 });
    [[-2, 1.2], [2, 1.2], [-2, 3.0], [2, 3.0]].slice(0, 2).forEach(([x, z]) => { BX(X + x - 1.3, X + x + 1.3, .74, .8, z - .45, z + .45, MAT.steel); [[-1.2, -.4], [1.2, -.4], [-1.2, .4], [1.2, .4]].forEach(([a, b]) => BX(X + x + a - .03, X + x + a + .03, 0, .74, z + b - .03, z + b + .03, MAT.steelDk));
      [-1, 1].forEach(sd => BX(X + x - 1.3, X + x + 1.3, .42, .47, z + sd * .75 - .14, z + sd * .75 + .14, MAT.steel)); });
    for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) { add(RB(1.4, .06, .14, .02), STD({ color: '#f4fbff', emissive: '#e8f4ff', emissiveIntensity: 1.4 }), X - 2 + k * 4, KH - .05, -2 + j * 3, { cast: false }); } }
  zoneLight('#f2f6ff', 6, 10, KX - 2, 2.9, -1.5, inK); zoneLight('#f2f6ff', 6, 10, KX + 2, 2.9, 1, inK); zoneLight('#ffe6c0', 3, 6, KX + 1, 1.8, -2.5, inK);

  // =====================================================================================================
  // ESTADO Y API
  // =====================================================================================================
  let SECTION = false;
  const LANTERN = new T.PointLight('#ffb050', 0, 4.5, 1.4); scene.add(LANTERN);
  // relojes (todas las esferas): W2.setClocks(h, m)
  const drawClock = (S, hh, mm, face = '#f6f0e0') => { const g = S.g, w = 256, h = 256; g.clearRect(0, 0, w, h); g.fillStyle = face; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 6, 0, 7); g.fill(); g.lineWidth = 14; g.strokeStyle = INK; g.stroke();
    for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; g.lineWidth = k % 3 ? 5 : 10; g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * (w / 2 - 22), h / 2 - Math.cos(a) * (w / 2 - 22)); g.lineTo(w / 2 + Math.sin(a) * (w / 2 - 40), h / 2 - Math.cos(a) * (w / 2 - 40)); g.stroke(); }
    const ah = (hh % 12 + mm / 60) / 12 * 6.283, am = mm / 60 * 6.283; g.lineCap = 'round'; g.lineWidth = 12; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.sin(ah) * w * .24, h / 2 - Math.cos(ah) * w * .24); g.stroke(); g.lineWidth = 7; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.sin(am) * w * .36, h / 2 - Math.cos(am) * w * .36); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(w / 2, h / 2, 10, 0, 7); g.fill(); S.t.needsUpdate = true; };
  function setClocks(hh, mm) { [HALLCLOCK, BOOTHCLOCK, BANKCLOCK, KCLOCK].forEach(S => drawClock(S, hh, mm)); }
  setClocks(10, 10);
  // monitores de la garita
  function drawCCTV(t = 0, night = 0) { const g = CCTV.g, w = 512, h = 256; g.fillStyle = '#0a1210'; g.fillRect(0, 0, w, h); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const x = 8 + i * 168, y = 8 + j * 124; g.fillStyle = night ? '#1a3a2a' : '#2a4a3a'; g.fillRect(x, y, 160, 116);
      g.strokeStyle = 'rgba(160,255,190,.45)'; g.lineWidth = 3; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x + 10 + k * 36, y + 100); g.lineTo(x + 10 + k * 36, y + 30); g.stroke(); } g.fillStyle = 'rgba(160,255,190,.25)'; g.fillRect(x, y + ((t * 40 + i * 30) % 116), 160, 3); txt(g, 'CAM ' + (j * 3 + i + 1), x + 30, y + 14, 14, '#9affb8', 800); } CCTV.t.needsUpdate = true; }
  drawCCTV(0);
  // rayas de días en la pared de la celda: n rayas completas + la que dibuja ahora (k 0..1)
  function setTally(n, k = 0) { const g = TALLY.g, w = 1024, h = 512; g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(245,240,225,.92)'; g.lineCap = 'round'; const gx = 46, gy = 120;
    const pos = i => { const grp = Math.floor(i / 5), r = i % 5, col = grp % 9, row = Math.floor(grp / 9); return { grp, r, x: 30 + col * 108, y: 40 + row * 118 }; };
    const stroke = (i, kk) => { const p = pos(i); g.lineWidth = 8; g.beginPath(); if (p.r < 4) { const x = p.x + p.r * 20 + (i % 3) * 1.5; g.moveTo(x, p.y); g.lineTo(x + (i % 2) * 3, p.y + 92 * kk); } else { g.moveTo(p.x - 10, p.y + 70); g.lineTo(p.x - 10 + 92 * kk, p.y + 70 - 50 * kk); } g.stroke(); };
    for (let i = 0; i < n; i++) stroke(i, 1); if (k > 0) stroke(n, k); TALLY.t.needsUpdate = true; }
  setTally(23);
  // libro de cuentas del director
  function setLedger(gold = 200, cash = 50, circ = 0) { const g = LEDGER.g, w = 800, h = 520; g.fillStyle = '#f4ecd6'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(w / 2 - 4, 0, 8, h); for (let y = 90; y < h; y += 34) { g.fillStyle = 'rgba(80,120,180,.25)'; g.fillRect(20, y, w - 40, 2); } g.fillStyle = 'rgba(200,60,60,.35)'; g.fillRect(80, 0, 3, h); g.fillRect(w / 2 + 80, 0, 3, h);
    txt(g, 'LINGOTES', w / 4, 60, 44, '#3a2a1a', 900); txt(g, 'FAJOS', w * .75, 60, 44, '#3a2a1a', 900);
    [['200', 140], ['200', 200], ['200', 260]].forEach(([v, y]) => { txt(g, v, w / 4, y, 46, '#5a5a6a', 700); txt(g, '50', w * .75, y, 46, '#5a5a6a', 700); });
    txt(g, String(gold), w / 4, 360, 84, gold < 200 ? '#c8243a' : '#2a2a3a', 900); txt(g, String(cash), w * .75, 360, 84, cash < 50 ? '#c8243a' : '#2a2a3a', 900);
    if (circ > 0) { g.strokeStyle = '#2f5fd8'; g.lineWidth = 8; [w / 4, w * .75].forEach(cx => { g.beginPath(); g.ellipse(cx, 360, 110, 62, -.08, -1.2, -1.2 + 6.3 * Math.min(1, circ)); g.stroke(); }); } LEDGER.t.needsUpdate = true; }
  setLedger();
  // calendario de taco: k 0 → domingo 6, 1 → lunes 7 (la hoja sube y se va)
  const drawCalPage = (S, day, num, ring) => { const g = S.g, w = 320, h = 400; g.fillStyle = '#fbf8f0'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a5a3a'; g.fillRect(0, 0, w, 70); txt(g, 'BANCO', w / 2, 38, 40, '#f2d27a', 900); txt(g, day, w / 2, 112, 42, day === 'DOMINGO' ? '#c8243a' : '#3a3a3a', 900); txt(g, num, w / 2, 250, 190, '#1b1720', 900);
    if (ring) { g.strokeStyle = '#c8243a'; g.lineWidth = 12; g.beginPath(); g.ellipse(w / 2, 250, 120, 108, 0, 0, 6.3 * ring); g.stroke(); } S.t.needsUpdate = true; };
  function setCal(k, ring = 0) { drawCalPage(CAL, 'LUNES', '7', ring); drawCalPage(calPageC, 'DOMINGO', '6', 0); CALPAGE.visible = k < 1; CALPAGE.rotation.x = -k * 2.6; CALPAGE.position.y = 1.235 + k * .02; }
  setCal(0);
  // orden de libertad: pose 0 encima de la barandilla del banquillo → 1 delante de la cámara (cp, look)
  const ORD0 = { p: new T.Vector3(JX + 3.05, 1.09, -2.27), r: new T.Euler(-Math.PI / 2 + .22, 0, Math.PI - .3) };
  function setOrder(k, hl = 0, cp = null, look = null) { drawOrder(hl); if (!cp) { ORDER.position.copy(ORD0.p); ORDER.rotation.copy(ORD0.r); return; }
    const fw = look.clone().sub(cp).normalize(), tgt = cp.clone().addScaledVector(fw, .62); ORDER.position.copy(ORD0.p).lerp(tgt, k); ORDER.position.y += Math.sin(Math.PI * k) * .25;
    const q0 = new T.Quaternion().setFromEuler(ORD0.r), m = new T.Matrix4().lookAt(tgt, cp, new T.Vector3(0, 1, 0)), q1 = new T.Quaternion().setFromRotationMatrix(m); ORDER.quaternion.copy(q0).slerp(q1, k); }
  setOrder(0);
  // puerta de la celda (k 0 cerrada, 1 abierta), colchón (a: giro), desorden, losa del túnel en la celda, losa del banco, puerta de la cámara, lingotes
  function setCellDoor(k) { MYDOOR.door.position.x = -1.3 * k; }
  function setMattress(a = 0, lift = 0) { MATTRESS.rotation.x = -a; MATTRESS.position.y = .44 + lift; MATTRESS.position.z = -2.72 + Math.sin(a) * .3; }
  function setMess(on) { MESS.visible = !!on; }
  function setCellLid(k) { CELLLID.visible = k < .5; }
  function setVTile(k) { VTILE.rotation.z = k * 1.9; }
  function setVaultDoor(k, spin = 0) { VDOOR.rotation.y = -k * 1.75; VDOOR.userData.d.userData.wheel.rotation.x = spin; }
  const goldOrder = GOLD.map((m, i) => i).sort((a, b) => ((a * 37) % 11) - ((b * 37) % 11));
  function setGold(frac = 1, cashFrac = 1, missing = -1) { const n = Math.round(GOLD.length * frac); goldOrder.forEach((gi, r) => GOLD[gi].visible = r < n); if (missing >= 0) GOLD[missing].visible = false; const nc = Math.round(CASH.length * cashFrac); CASH.forEach((m, i) => m.visible = ((i * 7) % CASH.length) < nc); }
  function goldPos(i) { const p = new T.Vector3(); GOLD[i].getWorldPosition(p); return p; }
  function setGlint(p, s = 0) { if (!p || s <= 0) { GLINT.position.y = -50; return; } GLINT.position.copy(p); GLINT.scale.setScalar(s); }
  function setCoffee(k, t = 0) { COFLED[0].material.emissiveIntensity = k < 1 ? 2 + Math.sin(t * 9) * 1.2 : 0; COFLED[1].material.emissiveIntensity = k < 1 ? 0 : 2.5; COFLED[1].material.color.set(k < 1 ? '#3a3a3a' : '#3aff7a');
    COFSIGN.visible = k < 1.4; COFSIGN.position.y = .45 - Math.max(0, k - 1) * 1.2; COFSIGN.rotation.z = Math.max(0, k - 1) * 3; COFPANEL.rotation.y = k < 1 ? -1.2 * Math.min(1, k * 4) * (1 - Math.max(0, k * 4 - 3)) : 0; }
  function setPolice(on, t = 0) { POLICE.visible = !!on; SIRENS.forEach((s, i) => { const ph = (Math.floor(t * 6 + i) % 2) === 0; s.r.material.emissiveIntensity = on && ph ? 3 : .3; s.b.material.emissiveIntensity = on && !ph ? 3 : .3; s.lr.intensity = on && ph ? 12 : 0; s.lb.intensity = on && !ph ? 12 : 0; }); }
  setPolice(false); setCoffee(0); setGold(1, 1);
  function setLantern(p, I = 3) { if (!p) { LANTERN.intensity = 0; return; } LANTERN.position.copy(p); LANTERN.intensity = I; }
  function setSection(on) { SECTION = !!on; CAPS.visible = SECTION; R.clippingPlanes = SECTION ? [new T.Plane(new T.Vector3(0, 0, -1), ZS)] : []; }

  // ---------- post: brillo + desenfoque de fondo + gradación ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .22, .5, .9); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .003, maxblur: .006 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, time: { value: 0 }, morn: { value: 0 }, night: { value: 0 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float time, morn, night; varying vec2 vUv; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c+=vec3(-.01,.008,.028)*(1.-l); c+=vec3(.03,.014,-.016)*l; c+=vec3(.02,0.,-.012)*morn; c+=vec3(-.012,.0,.034)*night; c=mix(vec3(l),c,1.16); c=c*c*(3.-2.*c)*.3+c*.7; vec2 d=vUv-.5; c*=1.-dot(d,d)*(.45+night*.5); c+=(h(vUv*vec2(1080.,1920.)+time)-.5)*.022; gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { const cp = r.clippingPlanes; r.clippingPlanes = []; gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); r.clippingPlanes = cp; } });
  // ---------- contorno de tinta (con planos de corte) ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, clipping: true, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k;\n#include <clipping_planes_pars_vertex>\nvoid main(){ vec4 mvPosition=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mvPosition.xyz+=n*(-mvPosition.z)*k; gl_Position=projectionMatrix*mvPosition;\n#include <clipping_planes_vertex>\n}',
    fragmentShader: 'uniform vec3 col;\n#include <clipping_planes_pars_fragment>\nvoid main(){\n#include <clipping_planes_fragment>\ngl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o === sky || o.userData.noInk || (o.material && o.material.transparent)) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'CircleGeometry' || ty === 'RingGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  // ---------- cámara, luces por zona, ambiente ----------
  let NIGHT = 0;
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    ZL.forEach(([l, I, test]) => { const on = !!test(pos); l.visible = on; l.intensity = on ? I * (NIGHT > .5 && l.userData.nightK != null ? l.userData.nightK : 1) : 0; });
    sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; CLOUDS.forEach(([o, p0]) => o.position.x = p0.x + t * 1.2); FANB.rotation.y = t * 4.2; candles.forEach((c, i) => c.scale.setScalar(1 + Math.sin(t * 13 + i * 2) * .18)); drawCCTV(t, NIGHT); }
  const SUN_DAY = SUN.clone(), SUN_DUSK = new T.Vector3(.78, .22, .58).normalize(), MOON = new T.Vector3(.5, .45, .74).normalize();
  // m: 0 día, 1 atardecer; n: 0..1 noche (la galería y la garita se quedan con luz azul y la lámpara de mesa)
  function setMood(m = 0, n = 0) { NIGHT = n; SUN.copy(SUN_DAY).lerp(SUN_DUSK, m).lerp(MOON, n).normalize(); skyU.morn.value = m * (1 - n); skyU.night.value = n; gradeMat.uniforms.morn.value = m * (1 - n); gradeMat.uniforms.night.value = n;
    sun.color.set(n > .5 ? '#9fb4ff' : m > .5 ? '#ffc890' : '#fff0d4'); sun.intensity = lerp(lerp(4.2, 3.2, m), 1.6, n);
    hemi.color.set(n > .5 ? '#5a6ab0' : m > .5 ? '#ffd0b8' : '#d2e6ff'); hemi.groundColor.set(n > .5 ? '#1a1e30' : m > .5 ? '#7a5a4a' : '#8a7a62'); hemi.intensity = lerp(1.25, .55, n);
    scene.fog.color.set(n > .5 ? '#1c2440' : m > .5 ? '#f0c8a8' : '#d6e6ee'); R.toneMappingExposure = lerp(1.2, 1.05, n);
    CELLSUN.userData.nightK = 0;
    STREETLAMPS.forEach(l => l.material.emissiveIntensity = (n > .5 || m > .7) ? 2.2 : .25); ALLEYBULB.material.emissiveIntensity = n > .5 || m > .7 ? 2 : .2; }
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  return { T, scene, camera, R, setCam, proj, render, setTime, setMood, visible, SUN, JX, KX, ZS, TUN, BOOTH, DK, VHOLE, setCondena: drawCondena, setOrder, ORDER, setClocks, setTally, setLedger, setCal, setCellDoor, setMattress, setMess, setCellLid, setVTile, setVaultDoor,
    setGold, goldPos, GOLD, CASH, setGlint, setCoffee, setPolice, setLantern, setSection, COFFEE, QUEJAS, WETSIGN, MUG, CACTUS, MATTRESS, VDOOR, POLICE, CELLLIGHTS: null, dof, bloom, comp, inkM, get SECTION() { return SECTION; } };
})();

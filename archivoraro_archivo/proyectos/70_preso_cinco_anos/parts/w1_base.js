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

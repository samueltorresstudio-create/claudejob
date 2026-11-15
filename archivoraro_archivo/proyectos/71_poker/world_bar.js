// World «Bar» (71 · El que siempre pierde al póker). Misma API que world3d.js (W2).
// Bar español de barrio (x ∈ [-7, 7], z ∈ [-5, 6], techo 3,4 m). Barra a lo largo del fondo (z = -3.1, x ∈ [-6.4, 1.4]) con la pared de botellas,
// jamones, cafetera, caja registradora y la foto de la inauguración (1995). Mesa de póker redonda en el rincón del fondo a la derecha (TC = (4.1, -1.7))
// con lámpara verde, pizarra de partidas en la pared derecha. Mesa de cenar junto a la ventana (izquierda). Tragaperras y diana a la derecha.
window.GLC = document.getElementById("gl");
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.2; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, W / H, .05, 3000);
  const rnd = (() => { let s = 7171; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
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
  { const tr = new T.Group(); tr.position.set(X1 - .16, 1.6, .5); scene.add(tr);
    const LG = (pts, seg = 32) => new T.LatheGeometry(pts.map(([r, y]) => new T.Vector2(r, y)), seg);
    const gold = STD({ color: '#f6c94a', metalness: .55, roughness: .2, emissive: '#6a4200', emissiveIntensity: .38 }), goldIn = STD({ color: '#d9a52e', metalness: .5, roughness: .3, emissive: '#5a3800', emissiveIntensity: .3, side: T.DoubleSide });
    add(RB(.18, .05, .18, .012), MAT.woodDk, 0, .025, 0, { parent: tr }); add(RB(.14, .05, .14, .01), MAT.woodDk, 0, .075, 0, { parent: tr });   // peana de dos pisos
    add(LG([[0, .1], [.048, .1], [.048, .109], [.03, .114], [.016, .13], [.011, .16], [.02, .172], [.011, .184], [.013, .2]]), gold, 0, 0, 0, { parent: tr });   // pie, tallo con nudo
    add(LG([[.013, .2], [.035, .208], [.058, .228], [.076, .262], [.086, .3], [.089, .328], [.092, .336], [.086, .337], [.081, .31], [.072, .27], [.054, .238], [.03, .222], [0, .218]], 40), goldIn, 0, 0, 0, { parent: tr });   // copa abierta
    add(new T.TorusGeometry(.0905, .0045, 8, 40), gold, 0, .336, 0, { parent: tr, rx: Math.PI / 2 });   // borde
    const arc = Math.PI * 1.1; [-1, 1].forEach(sd => add(new T.TorusGeometry(.038, .0075, 8, 20, arc), gold, 0, .275, sd * .083, { parent: tr, ry: Math.PI / 2, rz: sd > 0 ? Math.PI - arc / 2 : -arc / 2 }));   // asas
    add(new T.TorusGeometry(.0745, .006, 6, 32), STD({ color: '#c8302e', roughness: .5 }), 0, .262, 0, { parent: tr, rx: Math.PI / 2 });   // cinta roja
    sign(.12, .036, 70, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f2d27a'); gr.addColorStop(1, '#b8862a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = '#6a4a10'; g.lineWidth = 4; g.strokeRect(4, 4, w - 8, h - 8); txt(g, 'AL PEOR', w / 2, h / 2 + 2, 38, '#2a1a04', 900); }, -.071, .075, 0, { parent: tr, ry: -Math.PI / 2, d: .004 });
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
  BX(DT.x - 1.2, DT.x + 1.2, .74, .78, DT.z - .55, DT.z + .55, STD({ map: dinT, roughness: .9 })); BX(DT.x - 1.22, DT.x + 1.22, .5, .76, DT.z - .57, DT.z + .57, STD({ map: dinT, roughness: .9 }), { cast: false });
  [[-1.02, -.85], [0, -.85], [1.02, -.85], [-.8, .85], [0, .85], [.8, .85]].forEach(([dx, dz]) => { const g = new T.Group(); g.position.set(DT.x + dx, 0, DT.z + dz); g.rotation.y = dz < 0 ? 0 : Math.PI; scene.add(g); add(RB(.42, .05, .4, .02), MAT.wood, 0, .46, 0, { parent: g }); add(RB(.42, .5, .05, .02), MAT.wood, 0, .72, -.18, { parent: g }); [[-.18, -.16], [.18, -.16], [-.18, .16], [.18, .16]].forEach(([x, z]) => add(new T.CylinderGeometry(.022, .022, .46, 6), MAT.woodDk, x, .23, z, { parent: g })); });
  // la cena: chuletón en piedra (humea), copas de gin-tonic, botella cara, la cuenta. Grupo DINNER (visible en las escenas de la cena)
  const DINNER = new T.Group(); scene.add(DINNER);
  { const stone = (x, z) => { add(RB(.42, .05, .28, .02), STD({ color: '#3a3a40', roughness: .9 }), DT.x + x, .8, DT.z + z, { parent: DINNER }); add(RB(.34, .045, .2, .03), STD({ map: tex(256, 128, (g, w, h) => { g.fillStyle = '#5a2a14'; g.fillRect(0, 0, w, h); for (let k = 0; k < 7; k++) { const x = 12 + k * 34; g.fillStyle = '#7a3a1c'; g.fillRect(x, 6, 30, h - 12); g.fillStyle = '#d06a5a'; g.fillRect(x + 4, 14, 22, h - 40); g.fillStyle = '#e88a7a'; g.fillRect(x + 8, 22, 12, h - 60); g.fillStyle = '#f6ead0'; g.fillRect(x + 2, h - 28, 26, 10); }
      g.strokeStyle = 'rgba(30,10,4,.7)'; g.lineWidth = 5; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(k * 46, 0); g.lineTo(k * 46 + 40, h); g.stroke(); } for (let i = 0; i < 60; i++) { g.fillStyle = '#fff'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }), roughness: .55 }), DT.x + x, .848, DT.z + z, { parent: DINNER });
    add(new T.CapsuleGeometry(.025, .16, 4, 8), STD({ color: '#f2ead6' }), DT.x + x - .02, .875, DT.z + z - .1, { parent: DINNER, rz: Math.PI / 2 }); };
    stone(-.62, -.15); stone(.62, -.15); stone(0, .2);
    { const LG = (pts, seg = 36, p0 = 0, pl = 6.2832) => new T.LatheGeometry(pts.map(([r, y]) => new T.Vector2(r, y)), seg, p0, pl);
      const glassM = STD({ color: '#eef8ff', transparent: true, opacity: .2, roughness: .03, metalness: .1, side: T.DoubleSide, depthWrite: false }), shineM = new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .6, depthWrite: false, side: T.DoubleSide });
      const liqM = STD({ color: '#a9e2c1', transparent: true, opacity: .78, roughness: .08, emissive: '#a9e2c1', emissiveIntensity: .32, depthWrite: false }), iceM = STD({ color: '#f8fdff', transparent: true, opacity: .72, roughness: .04, emissive: '#ffffff', emissiveIntensity: .25, depthWrite: false });
      const limeT = tex(128, 128, (g, w, h) => { g.fillStyle = '#3f7a1c'; g.beginPath(); g.arc(64, 64, 63, 0, 7); g.fill(); g.fillStyle = '#e9f5c8'; g.beginPath(); g.arc(64, 64, 55, 0, 7); g.fill(); g.fillStyle = '#b6dc5a'; g.beginPath(); g.arc(64, 64, 50, 0, 7); g.fill(); g.strokeStyle = '#eef8d0'; g.lineWidth = 4; for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + Math.cos(a) * 50, 64 + Math.sin(a) * 50); g.stroke(); } g.fillStyle = '#eef8d0'; g.beginPath(); g.arc(64, 64, 6, 0, 7); g.fill(); });
      const limeM = STD({ map: limeT, roughness: .6 }), rindM = STD({ color: '#3f7a1c', roughness: .6 });
      const prof = [[0, .0], [.04, 0], [.042, .003], [.007, .008], [.0045, .02], [.0045, .086], [.011, .096], [.036, .108], [.055, .13], [.063, .155], [.062, .18], [.056, .2], [.05, .216]];   // copa de balón
      [[-.7, .3], [.7, .3], [0, -.35]].forEach(([x, z], ci) => { const g = new T.Group(); g.position.set(DT.x + x, .78, DT.z + z); g.rotation.y = ci * 1.3; DINNER.add(g);
        const liq = add(LG([[0, .097], [.012, .098], [.035, .109], [.054, .131], [.0605, .155], [.0602, .163], [0, .163]], 32), liqM, 0, 0, 0, { parent: g, cast: false, noInk: true }); liq.renderOrder = 1;
        [[-.02, .012, .3], [.019, -.014, 1.1], [.002, .024, 1.9]].forEach(([ix, iz, r]) => { const c = add(RB(.028, .026, .028, .006), iceM, ix, .163, iz, { parent: g, ry: r, rx: r * .4, rz: r * .2, cast: false, noInk: true }); c.renderOrder = 2; });   // hielos asomando
        [[.03, .02], [-.028, -.018], [.01, -.03]].forEach(([bx, bz]) => { const b = add(new T.SphereGeometry(.006, 8, 6), STD({ color: '#2a3a6a', roughness: .4 }), bx, .157, bz, { parent: g, cast: false, noInk: true }); b.renderOrder = 2; });   // enebro
        const gl = add(LG(prof), glassM, 0, 0, 0, { parent: g, cast: false, noInk: true }); gl.renderOrder = 3;
        const sh = add(LG([[.0636, .132], [.0645, .155], [.0635, .182]], 4, 5.3, .22), shineM, 0, 0, 0, { parent: g, cast: false, noInk: true }); sh.renderOrder = 4;   // brillo vertical
        const rim = add(new T.TorusGeometry(.05, .0017, 6, 48), STD({ color: '#ffffff', transparent: true, opacity: .9, emissive: '#ffffff', emissiveIntensity: .5 }), 0, .216, 0, { parent: g, rx: Math.PI / 2, cast: false, noInk: true }); rim.renderOrder = 4; const rimInk = add(new T.TorusGeometry(.0518, .0011, 6, 48), new T.MeshBasicMaterial({ color: '#3a4652', transparent: true, opacity: .7, depthWrite: false }), 0, .2168, 0, { parent: g, rx: Math.PI / 2, cast: false, noInk: true }); rimInk.renderOrder = 4;
        const lw = new T.Group(); lw.position.set(.046, .2, 0); lw.rotation.set(0, 0, .35); g.add(lw);   // rodaja de lima en el borde
        add(new T.CylinderGeometry(.027, .027, .006, 28, 1, true), rindM, 0, 0, 0, { parent: lw, rz: Math.PI / 2, noInk: true }); [-1, 1].forEach(sd => add(new T.CircleGeometry(.027, 28), limeM, sd * .0031, 0, 0, { parent: lw, ry: sd * Math.PI / 2, noInk: true })); });
    }
    { const LG = (pts, seg = 40, p0 = 0, pl = 6.2832) => new T.LatheGeometry(pts.map(([r, y]) => new T.Vector2(r, y)), seg, p0, pl);
      const bot = new T.Group(); bot.position.set(DT.x + .1, .78, DT.z - .05); DINNER.add(bot);
      add(LG([[0, 0], [.035, 0], [.039, .007], [.0395, .2], [.037, .225], [.028, .25], [.019, .27], [.0138, .288], [.0135, .322], [.0158, .325], [.0158, .336], [0, .336]]), STD({ color: '#1e3b24', roughness: .1, metalness: .2, emissive: '#0b1c10', emissiveIntensity: .35 }), 0, 0, 0, { parent: bot });   // botella bordelesa, vidrio verde oscuro
      add(LG([[.0147, .286], [.0147, .326], [.0168, .328], [.0168, .339], [0, .339]], 28), STD({ color: '#8c1830', metalness: .45, roughness: .28 }), 0, 0, 0, { parent: bot });   // cápsula granate
      add(new T.CylinderGeometry(.0149, .0149, .008, 24, 1, true), MAT.gold, 0, .292, 0, { parent: bot, noInk: true });   // anilla dorada
      const shine = add(LG([[.0398, .03], [.0399, .195], [.035, .232]], 6, 5.55, .16), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .45, depthWrite: false }), 0, 0, 0, { parent: bot, cast: false, noInk: true }); shine.renderOrder = 2;   // reflejo
      const labT = tex(512, 256, (g, w, h) => { g.fillStyle = '#f4ead2'; g.fillRect(0, 0, w, h); g.strokeStyle = '#b8862a'; g.lineWidth = 8; g.strokeRect(150, 14, 212, h - 28); g.lineWidth = 2; g.strokeRect(160, 24, 192, h - 48);
        g.fillStyle = '#7a1426'; g.beginPath(); g.moveTo(256, 44); g.lineTo(280, 62); g.lineTo(272, 92); g.lineTo(240, 92); g.lineTo(232, 62); g.closePath(); g.fill();   // escudo
        g.fillStyle = '#d8a640'; g.beginPath(); g.arc(256, 70, 8, 0, 7); g.fill();
        txt(g, 'VIÑA DEL BARRIO', 256, 120, 26, '#3a1a10', 900); txt(g, 'GRAN', 256, 160, 34, '#7a1426', 900); txt(g, 'RESERVA', 256, 194, 30, '#7a1426', 900); txt(g, '1994', 256, 226, 22, '#8a6a2a', 800); });
      add(new T.CylinderGeometry(.04, .04, .1, 40, 1, true, -.9, 2.6), STD({ map: labT, roughness: .8, side: T.DoubleSide }), 0, .11, 0, { parent: bot, cast: false, noInk: true });   // etiqueta mirando a cámara
    }
    [[-.45, .3], [.45, .3]].forEach(([x, z]) => add(new T.CylinderGeometry(.13, .13, .015, 18), STD({ color: '#f4f0e6' }), DT.x + x, .79, DT.z + z, { parent: DINNER })); }
  DINNER.visible = false;
  // la cuenta en su platillo (en la mano del camarero se dibuja en 2D)
  // ---------- luces del bar ----------
  [[-4, -1.5], [0, -1.5], [-4, 2.5], [1, 2.5]].forEach(([x, z]) => { add(new T.CylinderGeometry(.01, .01, .5, 4), MAT.black, x, RH - .25, z, { noInk: true }); add(new T.SphereGeometry(.16, 14, 10), STD({ color: '#fff4dc', emissive: '#ffd890', emissiveIntensity: 1.4 }), x, RH - .55, z, { cast: false }); });
  zoneLight('#ffd9a8', 9, 9, -3.5, 2.7, -1.6, inBar); zoneLight('#ffd9a8', 8, 9, .5, 2.7, -1.5, inBar); zoneLight('#ffd0a0', 7, 9, -3.8, 2.7, 2.6, inBar); zoneLight('#ffd9a8', 6, 9, 1.5, 2.7, 3.0, inBar);
  var TABLELAMP = zoneLight('#fff0c8', 14, 4.5, TC.x, 2.05, TC.z, inBar, { decay: 1.3 }); TABLELAMP.castShadow = true; TABLELAMP.shadow.mapSize.set(1024, 1024); TABLELAMP.shadow.bias = -.002;
  zoneLight('#ffc890', 4, 5, -3.6, 1.6, BZ - .6, inBar); zoneLight('#9ab0ff', 3, 7, X0 + .6, 2.0, 2.0, inBar); zoneLight('#ff6a8a', 1.6, 3, X1 - .6, 1.4, 4.4, inBar);

  // =====================================================================================================
  // ESTADO Y API
  // =====================================================================================================
  // fichas de póker (instanciadas): W2.setChips(lista de [x, y, z, rotY]) — el resto se esconden
  const NCH = 140, chipGeo = new T.CylinderGeometry(.038, .038, .012, 20);
  const chipT = tex(128, 128, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.0)'; for (let k = 0; k < 8; k++) { g.save(); g.translate(w / 2, h / 2); g.rotate(k * Math.PI / 4); g.fillStyle = '#f4f0e6'; g.fillRect(-8, -64, 16, 22); g.restore(); } g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 5; g.beginPath(); g.arc(w / 2, h / 2, 30, 0, 7); g.stroke(); });
  const CHIPS = new T.InstancedMesh(chipGeo, STD({ map: chipT, roughness: .45 }), NCH); CHIPS.castShadow = true; CHIPS.receiveShadow = true; scene.add(CHIPS);
  const chipCols = ['#c8302e', '#2f6fbf', '#1b1b22', '#f2efe6', '#2f9a5a', '#e8a830'].map(c => new T.Color(c));
  for (let i = 0; i < NCH; i++) CHIPS.setColorAt(i, chipCols[(i * 7) % chipCols.length]);
  const _o = new T.Object3D();
  function setChips(list) { for (let i = 0; i < NCH; i++) { const p = list[i]; if (p) { _o.position.set(p[0], p[1], p[2]); _o.rotation.set(p[4] || 0, p[3] || 0, p[5] || 0); _o.scale.setScalar(1); } else { _o.position.set(0, -50, 0); _o.scale.setScalar(.001); } _o.updateMatrix(); CHIPS.setMatrixAt(i, _o.matrix); } CHIPS.instanceMatrix.needsUpdate = true; }
  // pila de fichas en (x, z) con n fichas, ligeramente desordenada; devuelve la lista
  const stack = (x, z, n, seed = 0, y0 = TH + .026) => Array.from({ length: n }, (_, k) => [x + Math.sin(k * 1.7 + seed) * .006, y0 + k * .0125, z + Math.cos(k * 2.3 + seed) * .006, k * .7]);
  setChips([]);
  // TORRE DE FAJOS (3D, instanciada): fajos de 100 billetes de 10 € (rojos), 20 € (azules) y 50 € (verdes), con faja de papel,
  // cantos de papel rayados y apilados «en Jenga» (cada capa girada 90°). W2.setMoney(alto, x, z) · W2.setBand(valor, y, escala)
  const FW = .156, FD = .082, FH = .026, NMB = 200, NOTE = { 10: ['#f08a72', '#a8442f'], 20: ['#7fb2ec', '#2f5f9e'], 50: ['#9fd27e', '#447a2e'] };
  const hh2 = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
  const lighten = (c, k) => { const n = parseInt(c.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, f = v => Math.round(v + (255 - v) * k); return `rgb(${f(r)},${f(g)},${f(b)})`; };
  const fajaPaint = (g, x, h, bw = 68) => { g.fillStyle = '#fbf3df'; g.fillRect(x - bw / 2, 0, bw, h); g.fillStyle = '#d23a2e'; g.fillRect(x - bw / 2, 0, 8, h); g.fillRect(x + bw / 2 - 8, 0, 8, h); g.fillStyle = '#e8b830'; g.fillRect(x - bw / 2 + 8, 0, 4, h); g.fillRect(x + bw / 2 - 12, 0, 4, h); };
  const noteTop = v => tex(512, 270, (g, w, h) => { const [c, d] = NOTE[v]; g.fillStyle = c; g.fillRect(0, 0, w, h);
    g.globalAlpha = .22; g.strokeStyle = d; g.lineWidth = 2; for (let k = 0; k < 16; k++) { g.beginPath(); for (let x = 0; x <= w; x += 6) { const y = h * .5 + Math.sin(x / 34 + k * .8) * (12 + k * 7); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } g.globalAlpha = 1;
    g.strokeStyle = d; g.lineWidth = 9; g.beginPath(); g.roundRect(14, 14, w - 28, h - 28, 20); g.stroke(); g.lineWidth = 3; g.beginPath(); g.roundRect(28, 28, w - 56, h - 56, 14); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.ellipse(w * .74, h * .5, 62, 76, 0, 0, 7); g.fill(); g.strokeStyle = d; g.lineWidth = 5; g.stroke();
    txt(g, String(v), 74, 66, 54, d, 900); txt(g, String(v), w - 74, h - 62, 44, d, 900); txt(g, String(v), w * .26, h * .52, 118, 'rgba(255,255,255,.6)', 900, 'center', 6, d); txt(g, 'EURO', w * .26, h * .82, 26, d, 800);
    fajaPaint(g, w / 2, h); g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2); txt(g, (v * 100).toLocaleString('es-ES') + ' €', 0, 2, 30, '#1b1720', 900); g.restore(); });
  // canto del fajo: 100 bordes de papel (claros) con el color del billete, sombra en las juntas y la faja en el centro
  const noteSide = (v, band) => tex(band ? 512 : 256, 64, (g, w, h) => { const [c, d] = NOTE[v]; const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, lighten(c, .45)); gr.addColorStop(.5, lighten(c, .2)); gr.addColorStop(1, c); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let y = 4; y < h - 3; y += 3) { g.fillStyle = (y * 7) % 5 < 2 ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.10)'; g.fillRect(0, y, w, 1.2); }
    g.fillStyle = d; g.fillRect(0, 0, w, 3); g.fillRect(0, h - 3, w, 3); if (band) fajaPaint(g, w / 2, h, 76); });
  const MONEY = {};
  [10, 20, 50].forEach(v => { const mk = (map, r) => STD({ map, roughness: r, emissive: '#ffffff', emissiveMap: map, emissiveIntensity: .16 }), tp = mk(noteTop(v), .7), sl = mk(noteSide(v, true), .8), ss = mk(noteSide(v, false), .8);
    const M = new T.InstancedMesh(new T.BoxGeometry(FW, FH, FD), [ss, ss, tp, tp, sl, sl], NMB); M.castShadow = true; M.receiveShadow = true; M.frustumCulled = false; scene.add(M); MONEY[v] = M; });
  // torre maciza: 8 fajos por capa (2 × 4), cada capa girada 90° respecto a la anterior; la capa de arriba cae en cascada fajo a fajo
  const GAP = .003, SLOTS = [0, 1, 2, 3, 4, 5, 6, 7].map(b => [(b % 2 ? 1 : -1) * (FW / 2 + GAP / 2), (Math.floor(b / 2) - 1.5) * (FD + GAP)]);
  const MONEY_HALF = FD * 2 + GAP * 2;   // medio ancho de la torre (para recortar lo que haya detrás)
  function setMoney(H = 0, x = TC.x, z = TC.z, y0 = TH + .002) { const nl = Math.max(0, H / FH), full = Math.floor(nl), fr = nl - full, cnt = { 10: 0, 20: 0, 50: 0 }, tops = [];
    const L = Math.min(60, full + 1);
    for (let l = 0; l < L; l++) { const odd = l % 2, rot = odd * Math.PI / 2;
      for (let b = 0; b < 8; b++) { let dy = 0; if (l === full) { const q = clamp((fr - b * .07) / .45); if (q <= 0) continue; dy = Math.pow(1 - q, 2) * .13; }
        const v = [10, 20, 50][Math.floor(hh2(l * 3.1 + 7, b * 7.7 + 3) * 3)], M = MONEY[v], i = cnt[v]++; if (i >= NMB) continue; const j = hh2(l + 1, b + 1), [sx, sz] = SLOTS[b];
        _o.position.set(x + (odd ? sz : sx) + (j - .5) * .008, y0 + FH / 2 + l * FH + dy, z + (odd ? sx : sz) + (hh2(b + 5, l + 2) - .5) * .008); _o.rotation.set(0, rot + (j - .5) * .06, 0); _o.scale.setScalar(1); _o.updateMatrix(); M.setMatrixAt(i, _o.matrix); if (l === full) tops.push([_o.position.x, _o.position.y, _o.position.z, _o.rotation.y]); } }
    [10, 20, 50].forEach(v => { const M = MONEY[v]; for (let i = cnt[v]; i < NMB; i++) { _o.position.set(0, -50, 0); _o.rotation.set(0, 0, 0); _o.scale.setScalar(.001); _o.updateMatrix(); M.setMatrixAt(i, _o.matrix); } M.instanceMatrix.needsUpdate = true; }); return { yBody: y0 + full * FH, tops, FW, FD, FH }; }
  setMoney(0);
  // faja roja con la cifra, abrazando la torre (caras de arriba y abajo invisibles)
  const BANDC = signTex(640, 180), bandM = STD({ map: BANDC.t, roughness: .4, emissive: '#ffffff', emissiveMap: BANDC.t, emissiveIntensity: .2 }), noM = new T.MeshBasicMaterial({ visible: false });
  const bandSideT = tex(256, 72, (g, w, h) => { g.fillStyle = '#c8302e'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8b830'; g.fillRect(0, 6, w, 8); g.fillRect(0, h - 14, w, 8); }), bandSideM = STD({ map: bandSideT, roughness: .4, emissive: '#ffffff', emissiveMap: bandSideT, emissiveIntensity: .2 });
  const BW2 = MONEY_HALF * 2 + .03, BAND = new T.Mesh(new T.BoxGeometry(BW2, BW2 * .28, BW2), [bandSideM, bandSideM, noM, noM, bandM, bandM]); BAND.castShadow = true; BAND.visible = false; scene.add(BAND);
  let bandLast = '';
  function setBand(val = 0, y = TH + .6, sc = 0, x = TC.x, z = TC.z) { BAND.visible = sc > .01; if (!BAND.visible) return; BAND.position.set(x, y, z); BAND.scale.set(sc, sc, sc); BAND.rotation.y = 0;
    const str = Math.round(val).toLocaleString('es-ES') + ' €'; if (str === bandLast) return; bandLast = str; const g = BANDC.g, w = 640, h = 180;
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#e2463a'); gr.addColorStop(1, '#a8241e'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e8b830'; g.fillRect(0, 14, w, 12); g.fillRect(0, h - 26, w, 12); g.fillStyle = '#fff3c0'; g.fillRect(0, 17, w, 3); g.fillRect(0, h - 23, w, 3);
    g.font = FONT(900, 104); const fw = g.measureText(str).width; txt(g, str, w / 2, h / 2 + 4, Math.min(104, 104 * 590 / fw), '#fbf6e8', 900, 'center', 12, '#1b1720'); BANDC.t.needsUpdate = true; }
  const moneyHalf = () => MONEY_HALF, bandH = () => BW2 * .28;
  // relojes / pantallas / pizarras
  function setClock(hh, mm) { const g = CLK.g, w = 256, h = 256; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); g.fillStyle = '#f6f0e0'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 6, 0, 7); g.fill(); g.lineWidth = 12; g.strokeStyle = INK; g.stroke();
    for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; g.lineWidth = k % 3 ? 5 : 10; g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * (w / 2 - 22), h / 2 - Math.cos(a) * (w / 2 - 22)); g.lineTo(w / 2 + Math.sin(a) * (w / 2 - 40), h / 2 - Math.cos(a) * (w / 2 - 40)); g.stroke(); }
    txt(g, 'BAR', w / 2, h * .68, 26, '#c8302e', 900);
    const ah = (hh % 12 + mm / 60) / 12 * 6.283, am = mm / 60 * 6.283; g.lineCap = 'round'; g.lineWidth = 12; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.sin(ah) * w * .24, h / 2 - Math.cos(ah) * w * .24); g.stroke(); g.lineWidth = 7; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.sin(am) * w * .36, h / 2 - Math.cos(am) * w * .36); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(w / 2, h / 2, 10, 0, 7); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0); CLK.t.needsUpdate = true; }
  setClock(22, 30);
  function drawTV(t) { const g = TVC.g, w = 512, h = 288; g.fillStyle = '#3a9a4a'; g.fillRect(0, 0, w, h); for (let k = 0; k < 8; k++) { g.fillStyle = k % 2 ? '#3a9a4a' : '#43a854'; g.fillRect(k * w / 8, 0, w / 8, h); } g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 4; g.strokeRect(20, 20, w - 40, h - 40); g.beginPath(); g.moveTo(w / 2, 20); g.lineTo(w / 2, h - 20); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 40, 0, 7); g.stroke();
    for (let i = 0; i < 10; i++) { const x = (w * (.15 + i * .08) + Math.sin(t * 2 + i) * 30) % w, y = h * (.3 + (i % 3) * .2) + Math.cos(t * 1.7 + i) * 20; g.fillStyle = i < 5 ? '#e8302e' : '#2f6fbf'; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); }
    g.fillStyle = '#fff'; g.beginPath(); g.arc(w / 2 + Math.sin(t * 2.6) * 120, h / 2 + Math.cos(t * 1.9) * 60, 5, 0, 7); g.fill(); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(14, 14, 120, 30); txt(g, '1 - 1', 74, 30, 22, '#fff', 900); TVC.t.needsUpdate = true; }
  function drawSlot(t) { const g = SLOTC.g, w = 256, h = 128; g.fillStyle = '#1b1720'; g.fillRect(0, 0, w, h); ['🍒', '7', '🔔'].forEach((s, i) => { g.fillStyle = '#fbf6e8'; g.fillRect(10 + i * 82, 14, 72, 100); txt(g, ['7', '★', '7'][(i + Math.floor(t * 3)) % 3], 46 + i * 82, 64, 56, i === 1 ? '#e8b830' : '#c8302e', 900); }); SLOTC.t.needsUpdate = true; SLOTL.forEach((l, i) => l.material.emissiveIntensity = (Math.floor(t * 6) + i) % 2 ? 2.2 : .4); }
  // foto de la inauguración (1995): Manolo joven detrás de la barra cortando la cinta
  function drawPhoto(colour = 0) { const g = PHOTOC.g, w = 600, h = 440; g.fillStyle = '#d8c8a0'; g.fillRect(0, 0, w, h); g.fillStyle = '#6a4a2a'; g.fillRect(0, h * .62, w, h * .38); g.fillStyle = '#8a6a4a'; g.fillRect(0, h * .6, w, 12);
    g.fillStyle = '#5a3a22'; for (let x = 30; x < w; x += 46) g.fillRect(x, 40, 22, h * .5); // botellas
    // Manolo joven: cabeza redonda, pelo negro, bigote; cinta roja
    const hx = w * .5, hy = h * .42; g.fillStyle = '#fbf8f0'; g.beginPath(); g.arc(hx, hy, 58, 0, 7); g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); g.fillStyle = '#1b1720'; g.beginPath(); g.arc(hx, hy - 20, 60, Math.PI * 1.05, Math.PI * 1.95); g.fill();
    g.fillStyle = INK; [[-20, 0], [20, 0]].forEach(([dx]) => { g.beginPath(); g.ellipse(hx + dx, hy + 4, 6, 8, 0, 0, 7); g.fill(); }); g.lineWidth = 5; g.beginPath(); g.arc(hx, hy + 16, 18, .3, Math.PI - .3); g.stroke();
    g.fillStyle = '#e8b830'; g.beginPath(); g.ellipse(hx, hy + 120, 70, 60, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
    g.strokeStyle = '#c8302e'; g.lineWidth = 12; g.beginPath(); g.moveTo(0, h * .7); g.quadraticCurveTo(w / 2, h * .78, w, h * .7); g.stroke(); g.fillStyle = '#c8302e'; g.beginPath(); g.arc(w / 2, h * .76, 18, 0, 7); g.fill();
    txt(g, 'INAUGURACIÓN · 1995', w / 2, h * .92, 40, '#3a2a1a', 900);
    if (colour < 1) { const im = g.getImageData(0, 0, w, h), d = im.data; for (let i = 0; i < d.length; i += 4) { const l = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11, s = 1 - colour; d[i] = d[i] * colour + (l * 1.07 + 18) * s; d[i + 1] = d[i + 1] * colour + (l * .95 + 6) * s; d[i + 2] = d[i + 2] * colour + (l * .78) * s; } g.putImageData(im, 0, 0); }
    g.fillStyle = 'rgba(80,60,30,.12)'; for (let i = 0; i < 400; i++) g.fillRect(rnd() * w, rnd() * h, 2, 2); g.strokeStyle = '#f4ecd8'; g.lineWidth = 16; g.strokeRect(0, 0, w, h); PHOTOC.t.needsUpdate = true; }
  drawPhoto(0);
  // licencia de apertura a nombre del cuñado (con su foto: chándal y cadena)
  function drawLicense(hl = 0) { const g = LICC.g, w = 440, h = 600; paperBg(g, w, h, '#f6efd8'); txt(g, 'LICENCIA', w / 2, 60, 46, '#3a2a1a', 900); txt(g, 'DE APERTURA', w / 2, 104, 30, '#3a2a1a', 800); g.fillStyle = '#3a2a1a'; g.fillRect(40, 128, w - 80, 4);
    g.fillStyle = '#dfe8ef'; g.fillRect(150, 150, 140, 160); g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(150, 150, 140, 160); g.fillStyle = '#fbf8f0'; g.beginPath(); g.arc(220, 215, 42, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#c8302e'; g.beginPath(); g.ellipse(220, 300, 54, 40, 0, Math.PI, 0); g.fill(); g.strokeStyle = '#e8b830'; g.lineWidth = 5; g.beginPath(); g.arc(220, 268, 22, .2, Math.PI - .2); g.stroke();
    g.fillStyle = INK; g.fillRect(196, 186, 48, 10); // gafas de sol en la frente
    if (hl > 0) { g.fillStyle = 'rgba(255,220,60,.7)'; g.fillRect(36, 356, (w - 72) * Math.min(1, hl), 56); }
    txt(g, 'TITULAR:', w / 2, 344, 26, '#5a4a3a', 800); txt(g, 'FERMÍN «EL CUÑAO»', w / 2, 386, 34, INK, 900); g.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 3; i++) g.fillRect(60, 440 + i * 24, w - 120 - i * 40, 8);
    g.save(); g.translate(330, 530); g.rotate(-.2); g.strokeStyle = '#2f5fbf'; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 46, 0, 7); g.stroke(); txt(g, 'AYTO.', 0, 2, 22, '#2f5fbf', 900); g.restore(); LICC.t.needsUpdate = true; }
  drawLicense(0);
  // pizarra de partidas ganadas en 30 años
  function setScore(mano = 0, hl = 0) { const g = SCORE.g, w = 600, h = 440; g.fillStyle = '#22322a'; g.fillRect(0, 0, w, h); noise(g, w, h, 2000, ['rgba(255,255,255,.04)']); txt(g, 'PARTIDAS GANADAS', w / 2, 48, 40, '#f4f0e0', 900); g.fillStyle = 'rgba(244,240,224,.6)'; g.fillRect(40, 76, w - 80, 3);
    [['PEPE', '512'], ['LUIS', '497'], ['TONI', '541'], ['MANOLO', String(mano)]].forEach(([n, v], i) => { const y = 130 + i * 76, hot = i === 3; if (hot && hl > 0) { g.strokeStyle = '#ffd34a'; g.lineWidth = 7; g.beginPath(); g.ellipse(w * .74, y, 70, 34, -.05, 0, 6.3 * Math.min(1, hl)); g.stroke(); }
      txt(g, n, 70, y, 44, '#f4f0e0', 800, 'left'); txt(g, v, w * .74, y, 54, hot ? '#ffd34a' : '#f4f0e0', 900); });
    SCORE.t.needsUpdate = true; }
  setScore(0);
  function setTill(k = 0, fill = 1, scr = '') { TILLD.position.z = .1 + k * .3; TILLD.position.y = .0; TILLCASH.scale.y = Math.max(.01, fill); TILLCASH.position.y = fill * .02;
    const g = TILLSCR.g; g.fillStyle = '#0a1a0e'; g.fillRect(0, 0, 256, 96); const s0 = scr || '0,00'; g.font = FONT(800, 56); const fw = g.measureText(s0).width; txt(g, s0, 240, 50, Math.min(56, 56 * 224 / fw), '#7aff8a', 800, 'right'); TILLSCR.t.needsUpdate = true; }
  setTill(0, 1, '');
  // escenarios: cena puesta; flashback de 1995 (sepia + pancarta)
  function setDinner(on) { DINNER.visible = !!on; }
  const BANNER = sign(3.2, .5, 160, (g, w, h) => { g.fillStyle = '#c8302e'; g.fillRect(0, 0, w, h); txt(g, '¡GRAN INAUGURACIÓN!', w / 2, h / 2 + 4, 96, '#fbf6e8', 900); g.strokeStyle = '#fbf6e8'; g.lineWidth = 8; g.strokeRect(8, 8, w - 16, h - 16); }, -2.6, 2.95, -4.3, { d: .02 });
  BANNER.visible = false;
  function setSepia(k) { gradeMat.uniforms.sepia.value = k; BANNER.visible = k > .5; JAM.forEach((j, i) => j.visible = k < .5 || i < 2); }
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; drawTV(t); drawSlot(t); JAM.forEach((j, i) => j.rotation.z = Math.sin(t * 1.3 + i) * .02); }

  // ---------- post: brillo + desenfoque de fondo + gradación (con sepia para el flashback) ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .24, .5, .88); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .003, maxblur: .006 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, time: { value: 0 }, sepia: { value: 0 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float time, sepia; varying vec2 vUv; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c+=vec3(-.012,.004,.03)*(1.-l); c+=vec3(.035,.016,-.018)*l; c=mix(vec3(l),c,1.14); c=c*c*(3.-2.*c)*.3+c*.7; vec3 sp=vec3(l*1.08+.06,l*.95+.02,l*.74); c=mix(c,sp,sepia); vec2 d=vUv-.5; c*=1.-dot(d,d)*(.55+sepia*.6); c+=(h(vUv*vec2(1080.,1920.)+time)-.5)*(.022+sepia*.05); gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  // ---------- contorno de tinta ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o === sky || o.userData.noInk || (o.material && o.material.transparent)) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'CircleGeometry' || ty === 'RingGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  // ---------- cámara y luz ambiente (de noche: la luz viene de las lámparas) ----------
  sun.intensity = .35; sun.color.set('#9fb4ff'); hemi.color.set('#ffe0c0'); hemi.groundColor.set('#5a3a2a'); hemi.intensity = .85; scene.fog.color.set('#2a2030'); scene.fog.density = .004; R.toneMappingExposure = 1.15;
  skyU.night.value = 1;
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    ZL.forEach(([l, I, test]) => { const on = !!test(pos); l.visible = on; l.intensity = on ? I : 0; });
    sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  function setMood() {}
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  return { T, scene, camera, R, setCam, proj, render, setTime, setMood, visible, SUN, TC, TR, TH, DT, BZ, SEATS, seatPos, X0, X1, Z0, Z1, RH,
    setChips, stack, setMoney, setBand, moneyHalf, bandH, setClock, setScore, setTill, setDinner, setSepia, drawPhoto, drawLicense, PHOTO, LIC, TILL, SLOT, TROPHY, VIT, RESV, JAM, dof, bloom, comp, inkM };
})();

// World «Las palomas que pilotaban misiles» (1943) · v2 «calidad referencia»: texturas pintadas a mano, colores saturados, sol con sombras
// de ventana y haces de luz, fondos pintados tras las ventanas y sitios llenos de objetos. Misma API que world3d.js (W2).
//  LAB  (0,0,0)    laboratorio años 40 · NOSE (40,0,0) interior del morro · MEET (80,0,0) sala del comité · STAGE (120,0,0) premio 2024
//  SEA (-1200,0,0) mar con buque de guerra (camuflaje dazzle) y el misil «Pelican».
window.GLC = document.getElementById("gl");
// (la saturación va en el shader de gradación: un filtro CSS en el canvas encarece mucho cada captura)
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.2; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, W / H, .05, 3000);
  let seed = 4343; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, rr = (a, b) => a + rnd() * (b - a);
  const tex = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h, c); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const STD = o => new T.MeshStandardMaterial(Object.assign({ roughness: .8, metalness: 0 }, o));
  // sombreado de dibujo animado: 3 bandas de luz planas (nada de degradado de plástico)
  const gradT = new T.DataTexture(new Uint8Array([70, 70, 70, 255, 150, 150, 150, 255, 220, 220, 220, 255, 255, 255, 255, 255]), 4, 1, T.RGBAFormat); gradT.minFilter = gradT.magFilter = T.NearestFilter; gradT.needsUpdate = true;
  const TOON = o => new T.MeshToonMaterial(Object.assign({ gradientMap: gradT }, o));
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.s) m.scale.set(...o.s); m.castShadow = o.cast !== false; m.receiveShadow = true; (o.parent || scene).add(m); if (o.noInk) m.userData.noInk = true; return m; };
  const RB = (w, h, d, r = .04) => new RoundedBoxGeometry(w, h, d, 3, Math.max(.002, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001)));
  const box = (w, h, d, mat, x, y, z, o = {}) => add(RB(w, h, d, o.r ?? .03), mat, x, y + h / 2, z, o);
  const cyl = (rt, rb, h, mat, x, y, z, o = {}) => add(new T.CylinderGeometry(rt, rb, h, o.seg || 20), mat, x, y + h / 2, z, o);
  const plane = (w, h, map, x, y, z, o = {}) => add(new T.PlaneGeometry(w, h), o.basic ? new T.MeshBasicMaterial({ map, transparent: !!o.alpha, side: o.ds ? T.DoubleSide : T.FrontSide }) : STD({ map, roughness: o.rough ?? .85, transparent: !!o.alpha, side: o.ds ? T.DoubleSide : T.FrontSide }), x, y, z, Object.assign({ noInk: true, cast: false }, o));
  // ---------- pinceles: texturas pintadas a mano ----------
  // pinceladas: trazos cortos con el color de debajo, un poco más claro u oscuro (textura «pintada a mano» como la referencia)
  let bseed = 777; const brnd = () => (bseed = (bseed * 16807) % 2147483647) / 2147483647, brr = (a, b) => a + brnd() * (b - a);
  const brush = (g, w, h, dens = 1) => { const rnd = brnd, rr = brr, id = g.getImageData(0, 0, w, h).data, N = Math.round(w * h / 520 * dens); g.lineCap = 'round';
    for (let i = 0; i < N; i++) { const x = rnd() * w, y = rnd() * h, o = (Math.floor(y) * w + Math.floor(x)) * 4, v = rnd() < .5 ? rr(.78, .92) : rr(1.06, 1.2), a = rnd() * Math.PI * 2, L = rr(6, 22) * Math.max(1, w / 1024);
      g.strokeStyle = `rgba(${Math.min(255, id[o] * v) | 0},${Math.min(255, id[o + 1] * v) | 0},${Math.min(255, id[o + 2] * v) | 0},${rr(.35, .7).toFixed(2)})`; g.lineWidth = rr(2, 5) * Math.max(1, w / 1024);
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * L * .5 + rr(-3, 3), y + Math.sin(a) * L * .5 + rr(-3, 3), x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); } };
  const grain = (g, w, h, a = .06, n = 1400) => { if (w * h >= 200000) brush(g, w, h); for (let i = 0; i < n; i++) { g.fillStyle = rnd() < .5 ? `rgba(0,0,0,${rnd() * a})` : `rgba(255,255,255,${rnd() * a * .8})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 3); } };
  const hsl = (h, s, l) => `hsl(${h},${s}%,${l}%)`;
  function planksT(o = {}) { const { w = 1024, h = 1024, n = 8, hue = 28, sat = 48, lit = 40, vertical = false, rep } = o;
    return tex(w, h, (g) => { g.save(); if (vertical) { g.translate(w, 0); g.rotate(Math.PI / 2); } const L = vertical ? h : w, S = vertical ? w : h, ph = S / n;
      for (let i = 0; i < n; i++) { let x = -rr(0, 300); while (x < L) { const pl = rr(260, 520), l0 = lit + rr(-7, 7), hu = hue + rr(-4, 4);
          const gr = g.createLinearGradient(0, i * ph, 0, (i + 1) * ph); gr.addColorStop(0, hsl(hu, sat, l0 + 8)); gr.addColorStop(.15, hsl(hu, sat, l0 + 2)); gr.addColorStop(.85, hsl(hu, sat, l0 - 3)); gr.addColorStop(1, hsl(hu, sat, l0 - 12)); g.fillStyle = gr; g.fillRect(x, i * ph, pl, ph);
          for (let k = 0; k < 7; k++) { g.strokeStyle = `rgba(${rnd() < .5 ? '60,30,10' : '255,230,200'},${rr(.05, .14)})`; g.lineWidth = rr(1, 2.5); const y0 = i * ph + rr(4, ph - 4); g.beginPath(); g.moveTo(x, y0); g.bezierCurveTo(x + pl * .3, y0 + rr(-6, 6), x + pl * .6, y0 + rr(-6, 6), x + pl, y0 + rr(-3, 3)); g.stroke(); }
          if (rnd() < .35) { const kx = x + rr(30, pl - 30), ky = i * ph + rr(10, ph - 10); g.fillStyle = 'rgba(70,35,12,.35)'; g.beginPath(); g.ellipse(kx, ky, rr(6, 12), rr(3, 6), 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(70,35,12,.25)'; g.beginPath(); g.ellipse(kx, ky, 18, 8, 0, 0, 7); g.stroke(); }
          g.fillStyle = 'rgba(30,15,5,.75)'; g.fillRect(x, i * ph, 3, ph); [.25, .75].forEach(f => { g.beginPath(); g.arc(x + 10, i * ph + ph * f, 3, 0, 7); g.fill(); g.beginPath(); g.arc(x + pl - 10, i * ph + ph * f, 3, 0, 7); g.fill(); });
          x += pl; }
        g.fillStyle = 'rgba(25,12,4,.85)'; g.fillRect(0, i * ph - 2, L, 4); }
      g.restore(); grain(g, w, h, .05); }, rep); }
  function wallT(base, o = {}) { return tex(1024, 1024, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h);
    if (o.stripes) for (let x = 0; x < w; x += 64) { g.fillStyle = o.stripes; g.fillRect(x, 0, 22, h); }
    if (o.damask) for (let y = 0; y < h; y += 128) for (let x = (y / 128 % 2) * 64; x < w; x += 128) { g.fillStyle = o.damask; g.beginPath(); g.ellipse(x, y, 14, 26, 0, 0, 7); g.fill(); g.beginPath(); g.arc(x, y - 34, 6, 0, 7); g.fill(); g.beginPath(); g.arc(x, y + 34, 6, 0, 7); g.fill(); }
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(90,70,40,${rr(.02, .05)})`; g.fillRect(rr(0, w), 0, rr(4, 30), h); }
    const gr = g.createLinearGradient(0, h * .55, 0, h); gr.addColorStop(0, 'rgba(60,40,20,0)'); gr.addColorStop(1, 'rgba(60,40,20,.22)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); grain(g, w, h, .05, 2500); }, o.rep); }
  function panelT(col, o = {}) { return tex(1024, 512, (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); const pw = w / (o.n || 4);
    for (let k = 0; k < (o.n || 4); k++) { const x = k * pw; g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x + 18, 30, pw - 36, h - 60); g.fillStyle = col; g.fillRect(x + 24, 36, pw - 46, h - 70); const gr = g.createLinearGradient(0, 36, 0, h - 34); gr.addColorStop(0, 'rgba(255,240,210,.18)'); gr.addColorStop(1, 'rgba(0,0,0,.12)'); g.fillStyle = gr; g.fillRect(x + 24, 36, pw - 46, h - 70); g.fillStyle = 'rgba(255,240,210,.25)'; g.fillRect(x + 18, 30, pw - 36, 4); }
    g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, 0, w, 10); g.fillStyle = 'rgba(255,240,210,.3)'; g.fillRect(0, 10, w, 4); grain(g, w, h, .06); }, o.rep); }
  const paper = (w, h, draw, col = '#f3e9cf') => tex(w, h, (g) => { g.fillStyle = col; g.fillRect(0, 0, w, h); const gr = g.createRadialGradient(w / 2, h / 2, w * .2, w / 2, h / 2, w * .8); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(120,80,30,.25)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); draw(g, w, h); grain(g, w, h, .05, 600); });
  const txt = (g, s, x, y, size, col = '#2a1c12', wgt = 900, al = 'center') => { g.font = `${wgt} ${size}px Inter`; g.textAlign = al; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(s, x, y); };
  const drawPigeon = (g, x, y, s, col = '#9aa0b4') => { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 7; g.strokeStyle = '#1b1720'; g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, 70, 46, -.15, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#4f9a7a'; g.beginPath(); g.ellipse(52, -36, 26, 30, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = col; g.beginPath(); g.arc(66, -70, 26, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#3a3540'; g.beginPath(); g.moveTo(88, -74); g.lineTo(112, -66); g.lineTo(88, -62); g.fill(); g.fillStyle = '#e8742a'; g.beginPath(); g.arc(74, -74, 7, 0, 7); g.fill(); g.fillStyle = '#6f7488'; g.beginPath(); g.moveTo(-60, -10); g.lineTo(-130, 10); g.lineTo(-60, 20); g.fill(); g.stroke(); g.restore(); };
  // ---------- sol, cielo, luces ----------
  const SUN_LAB = new T.Vector3(-.42, .5, -.76).normalize(), SUN_SEA = new T.Vector3(-.4, .55, .73).normalize(); let SUN = SUN_LAB.clone();
  const sky = new T.Mesh(new T.SphereGeometry(2500, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: SUN_SEA } },
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 sun; varying vec3 vd; void main(){ float h=vd.y; vec3 top=vec3(.12,.42,.9), mid=vec3(.42,.7,.97), hor=vec3(.86,.93,.98); vec3 c=h>.08?mix(mid,top,smoothstep(.08,.6,h)):mix(hor,mid,smoothstep(-.04,.08,h)); float s=max(dot(vd,sun),0.); c+=vec3(1.,.9,.7)*(pow(s,8.)*.3+pow(s,500.)*3.); gl_FragColor=vec4(c,1.); }' }));
  sky.frustumCulled = false; scene.add(sky);
  scene.fog = new T.FogExp2('#cfe4f4', 0);
  const hemi = new T.HemisphereLight('#dde8ff', '#6a5a48', 1.25); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff0d8', 5.2); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); const sc = sun.shadow.camera; sc.near = 1; sc.far = 400; sun.shadow.bias = -.0003; sun.shadow.normalBias = .03; sun.shadow.radius = 3; scene.add(sun, sun.target);
  const woodM = STD({ map: planksT({ w: 512, h: 512, n: 4, hue: 26, sat: 50, lit: 42 }) }), woodD = STD({ map: planksT({ w: 512, h: 512, n: 4, hue: 22, sat: 46, lit: 28 }) });
  const brassM = STD({ color: '#f0c050', metalness: .3, roughness: .3, emissive: '#4a3000', emissiveIntensity: .35 }), goldT = TOON({ color: '#f2b630', emissive: '#3a2600', emissiveIntensity: .5 }), blackM = STD({ color: '#24242a', roughness: .5 }), steelM = STD({ color: '#b8c0c6', metalness: .6, roughness: .35 });
  const greenMetal = STD({ color: '#5f8a6a', roughness: .45, metalness: .2 }), redM = STD({ color: '#c8302e', roughness: .5 }), cream = STD({ color: '#f3ead2', roughness: .6 });
  const OGIVE = (r, L) => { const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push(new T.Vector2(Math.max(.004, r * Math.sqrt(1 - t * t) * (1 - .15 * t)), t * L)); } return new T.LatheGeometry(pts, 40); };
  const seams = (g, w, h, rings, longs, dark) => { for (let k = 0; k <= rings; k++) { const v = k * h / rings; g.fillStyle = dark; g.fillRect(0, v - 3, w, 6); g.fillStyle = 'rgba(255,250,230,.35)'; g.fillRect(0, v + 3, w, 3); for (let u = 10; u < w; u += 26) { g.fillStyle = dark; g.beginPath(); g.arc(u, v + 14, 4.5, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,240,.55)'; g.beginPath(); g.arc(u - 1.2, v + 12.8, 1.8, 0, 7); g.fill(); } }
    for (let k = 0; k < longs; k++) { const u = k * w / longs; g.fillStyle = dark; g.fillRect(u - 2, 0, 4, h); } };
  const missileT = tex(1024, 1024, (g, w, h) => { const rnd = brnd, rr = brr; g.fillStyle = '#6e7a3e'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${rnd() < .5 ? '40,46,20' : '190,200,140'},${rr(.05, .12)})`; g.fillRect(rr(0, w), rr(0, h), rr(60, 300), rr(20, 90)); }
    seams(g, w, h, 6, 4, 'rgba(28,32,14,.85)');
    g.fillStyle = 'rgba(40,30,15,.12)'; for (let i = 0; i < 70; i++) g.fillRect(rr(0, w), rr(0, h), rr(3, 7), rr(40, 140));
    [0, w].forEach(x => { g.save(); g.translate(x, h * .5); g.rotate(Math.PI / 2); txt(g, 'U.S. ARMY', 0, 0, 74, '#f2d34a', 900); txt(g, 'PROJECT PIGEON · 1943', 0, 64, 30, 'rgba(242,211,74,.85)', 800); g.restore(); });
    // (u: 307 px/m alrededor, cara visible en u≈0; v: 233 px/m a lo largo, arriba = cola, abajo = morro)
    g.save(); g.beginPath(); g.rect(0, h * .962, w, h * .038); g.clip(); g.fillStyle = '#f2c230'; g.fillRect(0, h * .962, w, h * .038); g.fillStyle = '#1b1720'; for (let x = -60; x < w + 60; x += 46) { g.beginPath(); g.moveTo(x, h * .962); g.lineTo(x + 22, h * .962); g.lineTo(x + 22 + 38, h); g.lineTo(x + 38, h); g.fill(); } g.restore();
    const hatch = (cx, cy, pw, ph, label) => { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(cx - pw / 2 + 4, cy - ph / 2 + 4, pw, ph); g.fillStyle = '#76833f'; g.fillRect(cx - pw / 2, cy - ph / 2, pw, ph); g.strokeStyle = '#1e2410'; g.lineWidth = 5; g.strokeRect(cx - pw / 2, cy - ph / 2, pw, ph); g.fillStyle = 'rgba(255,255,230,.25)'; g.fillRect(cx - pw / 2 + 4, cy - ph / 2 + 4, pw - 8, 4);
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { g.fillStyle = '#b8bca8'; g.beginPath(); g.arc(cx + a * (pw / 2 - 11), cy + b * (ph / 2 - 11), 6, 0, 7); g.fill(); g.strokeStyle = '#1e2410'; g.lineWidth = 2.5; g.stroke(); g.beginPath(); g.moveTo(cx + a * (pw / 2 - 11) - 4, cy + b * (ph / 2 - 11)); g.lineTo(cx + a * (pw / 2 - 11) + 4, cy + b * (ph / 2 - 11)); g.stroke(); });
      if (label) { g.save(); g.translate(cx, cy); g.rotate(Math.PI / 2); txt(g, label, 0, 0, 20, 'rgba(20,24,10,.8)', 800); g.restore(); } };
    hatch(w * .87, h * .44, 110, 120, 'ACCESS'); hatch(w * .12, h * .62, 90, 80, ''); hatch(w * .9, h * .78, 70, 90, 'FUSE');
    const sten = (x, y, t2, sz, col) => { [x, x + w].forEach(xx => { g.save(); g.translate(xx, y); g.rotate(Math.PI / 2); txt(g, t2, 0, 0, sz, col, 800); g.restore(); }); };
    sten(w * .16, h * .4, 'NO STEP', 24, 'rgba(242,211,74,.9)'); sten(w * -.1, h * .66, 'SN 43-0017', 22, 'rgba(240,236,220,.8)'); sten(w * .1, h * .3, '▲ LIFT HERE ▲', 20, 'rgba(240,236,220,.8)');
    sten(w * -.13, h * .85, 'DANGER · LIVE PIGEONS', 22, '#e8463a');
    // emblema: paloma con gafas en un círculo (escuadrilla)
    g.save(); g.translate(w * .015, h * .215); g.scale(1, 233 / 307); g.fillStyle = '#1b1720'; g.beginPath(); g.arc(0, 0, 70, 0, 7); g.fill(); g.fillStyle = '#f2d34a'; g.beginPath(); g.arc(0, 0, 62, 0, 7); g.fill(); g.fillStyle = '#5a8ac0'; g.beginPath(); g.arc(0, 0, 52, 0, 7); g.fill(); g.rotate(Math.PI / 2); drawPigeon(g, -14, 18, .5); g.restore();
    for (let i = 0; i < 160; i++) { const x = rr(0, w), y = rr(0, h), r = rr(2, 7); g.fillStyle = 'rgba(205,200,170,.55)'; g.beginPath(); g.ellipse(x, y, r * 1.4, r, rr(0, 3), 0, 7); g.fill(); g.fillStyle = 'rgba(40,40,30,.35)'; g.beginPath(); g.ellipse(x + 1.5, y + 1.5, r * .7, r * .5, 0, 0, 7); g.fill(); }
    grain(g, w, h, .05, 2000); });
  const noseT = tex(1024, 512, (g, w, h) => { const rnd = brnd, rr = brr; g.fillStyle = '#ede3c6'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 50; i++) { g.fillStyle = `rgba(${rnd() < .5 ? '150,130,90' : '255,252,240'},${rr(.06, .14)})`; g.fillRect(rr(0, w), rr(0, h), rr(60, 300), rr(20, 70)); }
    seams(g, w, h, 3, 6, 'rgba(70,58,40,.75)'); grain(g, w, h, .05, 1500); });
  const paintM = TOON({ map: missileT }), noseM = TOON({ map: noseT }), olive = TOON({ color: '#4f5a2a' });
  // =====================================================================  LAB (0,0,0)
  const LX = 7, LZ = 6, LH = 4.4;
  add(new T.BoxGeometry(LX * 2, .2, LZ * 2), STD({ map: planksT({ n: 7, hue: 27, sat: 55, lit: 44, rep: [3.5, 3] }), roughness: .55 }), 0, -.1, 0, { cast: false, noInk: true });
  const rugT = tex(1024, 640, (g, w, h) => { g.fillStyle = '#8e2a2a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e8c06a'; g.lineWidth = 14; g.strokeRect(30, 30, w - 60, h - 60); g.strokeStyle = '#1f3a5a'; g.lineWidth = 26; g.strokeRect(62, 62, w - 124, h - 124);
    for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? '#e8c06a' : '#1f3a5a'; g.beginPath(); g.ellipse(w / 2, h / 2, 280 - k * 50, 160 - k * 28, 0, 0, 7); g.fill(); } for (let x = 0; x < w; x += 12) { g.fillStyle = '#f3e6c8'; g.fillRect(x, 0, 5, 14); g.fillRect(x, h - 14, 5, 14); } grain(g, w, h, .1, 3000); });
  plane(5.2, 3.2, rugT, 1.1, .005, .6, { rx: -Math.PI / 2 });
  add(new T.BoxGeometry(LX * 2, .2, LZ * 2), STD({ color: '#efe2c4' }), 0, LH + .1, 0, { noInk: true });
  for (let x = -6; x <= 6; x += 2) box(.24, .3, LZ * 2, woodD, x, LH - .3, 0, { cast: false });
  const wallM = STD({ map: wallT('#a8dcc0', { damask: 'rgba(255,255,255,.18)', rep: [3, 1] }) }), wainM = STD({ map: panelT('#6b3e20', { n: 4, rep: [4, 1] }) });
  const wall = (x, z, ry, w, holes) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
    const seg = (a, b, y0, y1) => add(new T.BoxGeometry(b - a, y1 - y0, .3), wallM, (a + b) / 2, (y0 + y1) / 2, 0, { parent: g, noInk: true });
    if (!holes) seg(-w / 2, w / 2, 0, LH); else { let a = -w / 2; holes.forEach(([c, hw, y0, y1]) => { seg(a, c - hw, 0, LH); seg(c - hw, c + hw, 0, y0); seg(c - hw, c + hw, y1, LH); a = c + hw; }); seg(a, w / 2, 0, LH); }
    add(new T.BoxGeometry(w, 1.25, .34), wainM, 0, .625, .02, { parent: g, noInk: true, cast: false });
    box(w, .1, .14, woodD, 0, 1.25, .2, { parent: g, cast: false }); box(w, .16, .1, woodD, 0, LH - .16, .18, { parent: g, cast: false }); return g; };
  const WINS = [-4.6, 0, 4.6];
  wall(0, -LZ, 0, LX * 2, WINS.map(c => [c, 1.45, 1.35, 3.85])); wall(-LX, 0, Math.PI / 2, LZ * 2); wall(LX, 0, -Math.PI / 2, LZ * 2); wall(0, LZ, Math.PI, LX * 2);
  const frameM = STD({ color: '#2f6a4a', roughness: .5 });
  WINS.forEach((wx, i) => { [-1.45, -.48, .48, 1.45].forEach(fx => box(.09, 2.5, .14, frameM, wx + fx, 1.35, -LZ + .02));
    [1.35, 2.18, 3.0, 3.85].forEach(fy => box(2.98, .09, .14, frameM, wx, fy - .045, -LZ + .02));
    box(3.2, .08, .4, cream, wx, 1.28, -LZ + .22);
    if (i !== 1) { const pot = new T.Group(); pot.position.set(wx + (i ? .9 : -.9), 1.36, -LZ + .24); scene.add(pot); cyl(.11, .08, .18, STD({ color: '#c0603a' }), 0, 0, 0, { parent: pot });
      for (let k = 0; k < 7; k++) add(new T.SphereGeometry(.09, 10, 8), STD({ color: k % 2 ? '#3f8a3a' : '#5aa848' }), Math.cos(k) * .08, .24 + (k % 3) * .06, Math.sin(k) * .06, { parent: pot, s: [1, 1.6, .6], rz: Math.cos(k) * .6 }); }
    add(new T.PlaneGeometry(2.9, 2.5), new T.MeshStandardMaterial({ color: '#cfe8ff', transparent: true, opacity: .1, roughness: .05 }), wx, 2.6, -LZ - .05, { noInk: true, cast: false }); });
  const cityT = tex(2048, 768, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, '#3f8ee0'); sk.addColorStop(.6, '#9fd0f5'); sk.addColorStop(1, '#e6f3ff'); g.fillStyle = sk; g.fillRect(0, 0, w, h);
    const cloud = (x, y, s) => { [[0, 0, 60], [55, 10, 46], [-55, 12, 44], [25, -30, 44], [-20, -26, 38]].forEach(([a, b, r]) => { g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x + a * s, y + b * s, r * s, 0, 7); g.fill(); }); g.fillStyle = 'rgba(160,190,220,.45)'; g.beginPath(); g.ellipse(x, y + 34 * s, 110 * s, 18 * s, 0, 0, 7); g.fill(); };
    cloud(260, 150, 1.3); cloud(900, 110, 1.0); cloud(1500, 170, 1.4); cloud(1900, 90, .9);
    for (let i = 0; i < 26; i++) { const bx = i * 82 + rr(-10, 10), bw = rr(60, 120), bh = rr(160, 400), hue = rr(8, 22); g.fillStyle = hsl(hue, rr(35, 55), rr(38, 52)); g.fillRect(bx, h - bh, bw, bh); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(bx + bw - 10, h - bh, 10, bh);
      for (let y = h - bh + 20; y < h - 30; y += 34) for (let x = bx + 10; x < bx + bw - 18; x += 24) { g.fillStyle = rnd() < .3 ? '#ffe9a8' : '#2c3a4a'; g.fillRect(x, y, 12, 18); } g.fillStyle = hsl(hue, 30, 30); g.fillRect(bx - 4, h - bh - 8, bw + 8, 10); }
    g.fillStyle = '#6a5a4a'; g.fillRect(1180, 260, 14, 200); g.fillRect(1260, 260, 14, 200); g.fillStyle = '#8a7a6a'; g.beginPath(); g.ellipse(1227, 250, 80, 26, 0, 0, 7); g.fill(); g.fillRect(1147, 170, 160, 82); g.beginPath(); g.moveTo(1140, 172); g.lineTo(1227, 110); g.lineTo(1314, 172); g.fill(); txt(g, 'GOLD MEDAL', 1227, 212, 24, '#f3e6c8');
    for (let i = 0; i < 40; i++) { const tx = rr(0, w), ty = h - rr(20, 120); g.fillStyle = hsl(rr(95, 125), 45, rr(28, 40)); g.beginPath(); g.arc(tx, ty, rr(26, 50), 0, 7); g.fill(); } });
  plane(30, 11.2, cityT, 0, 4.2, -LZ - 7, { basic: true });
  const beamT = tex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,240,200,.5)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const beamM = new T.MeshBasicMaterial({ map: beamT, transparent: true, opacity: .2, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide });
  const dirIn = SUN_LAB.clone().negate();
  WINS.forEach(wx => { for (let k = 0; k < 2; k++) { const len = 6.5, m = new T.Mesh(new T.PlaneGeometry(2.8, len), beamM); m.position.copy(new T.Vector3(wx, 2.6, -LZ + .1).addScaledVector(dirIn, len / 2));
      m.quaternion.setFromUnitVectors(new T.Vector3(0, -1, 0), dirIn); m.rotateY(k ? .6 : -.6); m.userData.noInk = true; scene.add(m); } });
  // palomares
  const PIGEONHOLES = [];
  const coop = (x0, z0, cols, rows) => { const g = new T.Group(); g.position.set(x0, 0, z0); g.rotation.y = Math.PI / 2; scene.add(g);
    const cw = .7, ch = .62, dp = .55; box(cols * cw + .12, .5, dp, woodD, 0, 0, 0, { parent: g });
    for (let r = 0; r <= rows; r++) box(cols * cw + .12, .06, dp + .04, woodM, 0, .5 + r * ch - .03, 0, { parent: g });
    for (let c = 0; c <= cols; c++) box(.06, rows * ch, dp, woodM, -cols * cw / 2 + c * cw, .5, 0, { parent: g });
    add(new T.BoxGeometry(cols * cw + .1, rows * ch, .04), STD({ color: '#4a2a14' }), 0, .5 + rows * ch / 2, -dp / 2, { parent: g, cast: false });
    box(cols * cw + .3, .12, dp + .1, woodD, 0, .5 + rows * ch, 0, { parent: g });
    const seedM = new T.MeshBasicMaterial({ color: '#d8c48a' });
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const lx = -cols * cw / 2 + (c + .5) * cw, ly = .5 + r * ch + .03; PIGEONHOLES.push(new T.Vector3(lx, ly, .05).applyAxisAngle(new T.Vector3(0, 1, 0), Math.PI / 2).add(g.position));
      const lab = paper(128, 64, (gg) => { gg.strokeStyle = '#2a1c12'; gg.lineWidth = 4; gg.strokeRect(2, 2, 124, 60); txt(gg, String(r * cols + c + 1).padStart(2, '0'), 64, 34, 36); });
      plane(.16, .08, lab, lx, ly + ch - .14, dp / 2 + .025, { parent: g });
      for (let k = 0; k < 4; k++) add(new T.PlaneGeometry(.05, .03), seedM, lx + rr(-.2, .2), ly + .005, rr(-.1, .2), { parent: g, rx: -Math.PI / 2, noInk: true, cast: false }); }
    return g; };
  coop(-LX + .45, -1.4, 6, 4); coop(-LX + .45, 3.4, 3, 4);
  const table = (x, z, w, d, h = .9, top = woodM, parent = scene) => { const g = new T.Group(); g.position.set(x, 0, z); parent.add(g); box(w, .09, d, top, 0, h - .09, 0, { parent: g });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(.09, h - .09, .09, woodD, a * (w / 2 - .12), 0, b * (d / 2 - .12), { parent: g })); box(w - .3, .08, .05, woodD, 0, .18, d / 2 - .12, { parent: g }); return g; };
  table(1.2, .6, 4.2, 1.4);
  const TRAIN = new T.Group(); TRAIN.position.set(2.5, .9, .4); TRAIN.rotation.y = -Math.PI / 2; scene.add(TRAIN);
  box(.9, .7, .7, STD({ map: planksT({ w: 256, h: 256, n: 3, hue: 34, sat: 55, lit: 58 }) }), 0, 0, 0, { parent: TRAIN });
  const TRAIN_SCR = add(new T.CircleGeometry(.2, 32), new T.MeshBasicMaterial({ color: '#9fe0b0' }), 0, .42, .356, { parent: TRAIN, noInk: true });
  add(new T.TorusGeometry(.21, .03, 8, 32), brassM, 0, .42, .36, { parent: TRAIN }); box(.22, .07, .14, steelM, .28, .08, .38, { parent: TRAIN });
  [-.3, .3].forEach(x => cyl(.04, .04, .08, redM, x, .7, .25, { parent: TRAIN })); plane(.5, .12, paper(256, 64, (g) => txt(g, 'ENTRENAMIENTO', 128, 34, 26)), 0, .14, .356, { parent: TRAIN });
  cyl(.12, .12, .26, new T.MeshStandardMaterial({ color: '#dff0f4', transparent: true, opacity: .45, roughness: .1 }), .4, .9, .75, { noInk: true }); cyl(.11, .11, .15, STD({ color: '#d6b25a' }), .4, .9, .75); cyl(.13, .13, .04, redM, .4, 1.16, .75);
  const noteT = paper(512, 320, (g, w, h) => { g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(w / 2 - 3, 0, 6, h); g.strokeStyle = '#2a3a6a'; g.lineWidth = 3; for (let y = 40; y < h; y += 26) { g.globalAlpha = .25; g.beginPath(); g.moveTo(10, y); g.lineTo(w - 10, y); g.stroke(); } g.globalAlpha = 1; drawPigeon(g, 130, 190, .9); g.strokeStyle = '#2a3a6a'; g.lineWidth = 4; g.beginPath(); g.moveTo(300, 200); g.lineTo(470, 200); g.quadraticCurveTo(500, 185, 470, 170); g.lineTo(300, 170); g.closePath(); g.stroke(); txt(g, '¡Funciona!', 380, 90, 34, '#c8302e', 700); });
  plane(.6, .38, noteT, -.35, .911, .95, { rx: -Math.PI / 2, rz: .2 });
  [[0, '#e8b84a'], [1, '#c8302e']].forEach(([k, c]) => add(new T.CylinderGeometry(.008, .008, .18, 6), STD({ color: c }), -.05 + k * .05, .915, 1.12, { rz: Math.PI / 2, ry: .4 + k * .3 }));
  const mug = new T.Group(); mug.position.set(2.9, .9, 1.05); scene.add(mug); cyl(.06, .055, .12, STD({ color: '#f3ead2' }), 0, 0, 0, { parent: mug }); add(new T.TorusGeometry(.035, .012, 6, 12), STD({ color: '#f3ead2' }), .065, .06, 0, { parent: mug }); cyl(.052, .052, .005, STD({ color: '#3a2010' }), 0, .11, 0, { parent: mug });
  [[-1.2, .3, .3], [-.9, .25, -.2]].forEach(([x, z, r]) => plane(.3, .4, paper(128, 160, (g) => { for (let y = 20; y < 150; y += 14) { g.fillStyle = 'rgba(40,40,60,.4)'; g.fillRect(12, y, rr(60, 100), 4); } }), x, .912, z, { rx: -Math.PI / 2, rz: r }));
  const flexo = new T.Group(); flexo.position.set(-.9, .9, .1); scene.add(flexo); cyl(.1, .12, .04, greenMetal, 0, 0, 0, { parent: flexo }); add(new T.CylinderGeometry(.012, .012, .5, 8), brassM, .06, .27, 0, { parent: flexo, rz: -.25 }); add(new T.CylinderGeometry(.012, .012, .35, 8), brassM, .2, .55, 0, { parent: flexo, rz: 1.0 });
  add(new T.CylinderGeometry(.05, .14, .16, 20, 1, true), STD({ color: '#3f7a5a', side: T.DoubleSide }), .36, .58, 0, { parent: flexo, rz: -.7 }); const fl = new T.PointLight('#ffd89a', 1.4, 3, 2); fl.position.set(.42, .5, 0); flexo.add(fl);
  // morro del misil en un soporte
  const NOSE_LAB = new T.Group(); NOSE_LAB.position.set(-.8, 0, .6); NOSE_LAB.rotation.y = -2.2; scene.add(NOSE_LAB);
  const noseB = new T.Group(); noseB.position.set(0, 1.35, 0); NOSE_LAB.add(noseB);
  add(new T.CylinderGeometry(.55, .55, .9, 40), paintM, -.45, 0, 0, { rz: Math.PI / 2, parent: noseB }); add(OGIVE(.55, 1.1), noseM, 0, 0, 0, { rz: -Math.PI / 2, parent: noseB });
  add(new T.TorusGeometry(.56, .035, 8, 40), olive, -.88, 0, 0, { ry: Math.PI / 2, parent: noseB }); add(new T.TorusGeometry(.56, .025, 8, 40), redM, -.02, 0, 0, { ry: Math.PI / 2, parent: noseB });
  NOSE_LAB.updateMatrixWorld(true);
  const NOSE_PORTS = [];
  [-.5, 0, .5].forEach(a => { const p = new T.Group(); p.position.set(.36, Math.sin(a) * .5, -Math.cos(a) * .5); noseB.add(p); NOSE_PORTS.push(p); p.lookAt(p.getWorldPosition(new T.Vector3()).add(new T.Vector3(.5, Math.sin(a), -Math.cos(a)).applyQuaternion(noseB.getWorldQuaternion(new T.Quaternion()))));
    add(new T.CylinderGeometry(.11, .11, .04, 24), STD({ color: '#24323a', roughness: .1, metalness: .3 }), 0, 0, 0, { rx: Math.PI / 2, parent: p }); add(new T.TorusGeometry(.11, .028, 8, 24), goldT, 0, 0, .02, { parent: p }); });
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([a, b]) => box(.07, 1.0, .07, blackM, -.45 + a * .32, 0, b * .32, { parent: NOSE_LAB })); box(.82, .07, .82, blackM, -.45, .95, 0, { parent: NOSE_LAB });
  plane(.6, .18, paper(256, 80, (g) => { g.fillStyle = '#1b1720'; g.fillRect(0, 0, 256, 80); txt(g, 'PELICAN · 1943', 128, 42, 30, '#f2c94c'); }), -.45, .82, .42, { parent: NOSE_LAB });
  // pizarra
  const chalkT = tex(1024, 640, (g, w, h) => { g.fillStyle = '#23402f'; g.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${rr(.02, .06)})`; g.beginPath(); g.ellipse(rr(0, w), rr(0, h), rr(40, 160), rr(10, 30), rr(0, 3), 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.fillStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(220, 330); g.lineTo(640, 330); g.quadraticCurveTo(780, 330, 820, 300); g.quadraticCurveTo(780, 270, 640, 270); g.lineTo(220, 270); g.closePath(); g.stroke();
    g.beginPath(); g.moveTo(380, 270); g.lineTo(300, 180); g.lineTo(260, 180); g.lineTo(320, 270); g.moveTo(380, 330); g.lineTo(300, 420); g.lineTo(260, 420); g.lineTo(320, 330); g.moveTo(220, 270); g.lineTo(170, 230); g.moveTo(220, 330); g.lineTo(170, 370); g.stroke();
    [0, 1, 2].forEach(k => { g.beginPath(); g.arc(700 + k * 26, 288 + (k % 2) * 16, 9, 0, 7); g.stroke(); });
    g.save(); g.strokeStyle = '#f2c94c'; g.beginPath(); g.moveTo(700, 420); g.quadraticCurveTo(650, 470, 600, 500); g.stroke(); g.restore();
    txt(g, 'PROYECTO PALOMA', 80, 90, 54, 'rgba(255,255,255,.92)', 700, 'left'); txt(g, '3 palomas = 1 piloto', 600, 590, 38, '#f2c94c', 700); txt(g, '1943', 930, 90, 40, 'rgba(255,255,255,.9)', 700); });
  plane(3.2, 2, chalkT, LX - .17, 2.45, -.4, { ry: -Math.PI / 2 }); box(.1, 2.16, 3.36, woodD, LX - .12, 1.37, -.4); box(.16, .06, 3.2, woodD, LX - .22, 1.42, -.4);
  [0, 1, 2].forEach(k => box(.04, .04, .1, cream, LX - .25, 1.45, -1.2 + k * .2));
  // tablón de corcho
  const corkT = tex(512, 384, (g, w, h) => { g.fillStyle = '#b8864a'; g.fillRect(0, 0, w, h); grain(g, w, h, .25, 4000); const pins = [];
    [[60, 50, 120, 90], [220, 40, 110, 140], [360, 60, 120, 100], [80, 200, 140, 110], [270, 220, 100, 130], [400, 210, 90, 120]].forEach(([x, y, pw, ph], i) => { g.fillStyle = i % 3 ? '#f6efdc' : '#fff6a8'; g.save(); g.translate(x + pw / 2, y + ph / 2); g.rotate(rr(-.12, .12)); g.fillRect(-pw / 2, -ph / 2, pw, ph); if (i === 1) drawPigeon(g, -10, 20, .45); else for (let k = 0; k < 5; k++) { g.fillStyle = 'rgba(40,40,60,.45)'; g.fillRect(-pw / 2 + 10, -ph / 2 + 16 + k * 16, pw * rr(.4, .8), 4); } g.restore(); pins.push([x + pw / 2, y + 10]); });
    g.strokeStyle = '#c8202e'; g.lineWidth = 3; g.beginPath(); pins.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); pins.forEach(([x, y]) => { g.fillStyle = '#c8202e'; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); }); });
  plane(1.6, 1.2, corkT, LX - .17, 2.2, -3.6, { ry: -Math.PI / 2 }); box(.06, 1.3, 1.7, woodD, LX - .14, 1.55, -3.6);
  // archivador, estantería, sacos, cajas
  const cab = new T.Group(); cab.position.set(6.3, 0, -5.3); scene.add(cab); box(.7, 1.6, .7, greenMetal, 0, 0, 0, { parent: cab });
  for (let k = 0; k < 4; k++) { box(.6, .34, .04, STD({ color: '#6f9a7a', metalness: .2, roughness: .4 }), 0, .1 + k * .38, .36, { parent: cab }); box(.16, .03, .04, brassM, 0, .3 + k * .38, .39, { parent: cab }); plane(.12, .05, paper(64, 32, () => { }), 0, .38 + k * .38, .381, { parent: cab }); }
  const shelf = (x, z) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = -Math.PI / 2; scene.add(g);
    box(1.8, 2.6, .05, woodD, 0, 0, -.2, { parent: g }); [0, .7, 1.4, 2.1].forEach(y => box(1.8, .05, .42, woodM, 0, y + .1, 0, { parent: g })); [-1, 1].forEach(sd => box(.06, 2.6, .42, woodM, sd * .9, 0, 0, { parent: g }));
    const bc = ['#a82a2a', '#2f5f9a', '#3e7a4a', '#d8a44a', '#6a3a7a', '#1f1f24', '#c8602e'];
    [.15, .85].forEach(y => { let bx = -.84; while (bx < .74) { const bw = rr(.05, .1), bh = rr(.32, .5); const b = box(bw, bh, .28, STD({ color: bc[Math.floor(rnd() * bc.length)], roughness: .6 }), bx + bw / 2, y, 0, { parent: g }); if (rnd() < .15) b.rotation.z = .2; bx += bw + .012; } });
    [-.6, -.2, .2, .6].forEach((jx, k) => { cyl(.09, .09, .26, new T.MeshStandardMaterial({ color: ['#f2d98a', '#bfe6c4', '#f2b48a', '#cfe0f4'][k], transparent: true, opacity: .85 }), jx, 1.55, 0, { parent: g, noInk: true }); cyl(.095, .095, .04, blackM, jx, 1.81, 0, { parent: g }); });
    box(.5, .3, .32, STD({ color: '#d8a44a' }), -.4, 2.2, 0, { parent: g }); add(new T.SphereGeometry(.13, 16, 12), STD({ color: '#5a8ac8' }), .4, 2.33, 0, { parent: g }); cyl(.02, .06, .1, brassM, .4, 2.2, 0, { parent: g }); return g; };
  shelf(LX - .3, 3.6);
  const sackT = paper(256, 160, (g) => { txt(g, 'ALPISTE', 128, 70, 50, '#8a3a1a'); txt(g, '50 lb · MINNEAPOLIS', 128, 120, 18, '#6a4a2a', 700); }, '#e2cf9c');
  const sack = (x, z, ry, s = 1) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; g.scale.setScalar(s); scene.add(g); add(new T.SphereGeometry(.38, 22, 16), STD({ color: '#e2cf9c', roughness: 1 }), 0, .42, 0, { parent: g, s: [1, 1.15, .78] }); plane(.42, .26, sackT, 0, .44, .3, { parent: g }); cyl(.08, .16, .14, STD({ color: '#d2bf8c' }), 0, .84, 0, { parent: g }); };
  sack(5.6, -4.5, -.4); sack(4.8, -4.85, .2, .9); sack(5.25, -3.7, -.8, .85);
  const seedT = tex(256, 256, (g) => { for (let i = 0; i < 500; i++) { const a = rr(0, 6.3), r = Math.pow(rnd(), 1.6) * 120; g.fillStyle = rnd() < .5 ? '#d8b860' : '#b89040'; g.beginPath(); g.ellipse(128 + Math.cos(a) * r, 128 + Math.sin(a) * r, 3, 2, a, 0, 7); g.fill(); } });
  plane(1.6, 1.6, seedT, 5.0, .006, -3.9, { rx: -Math.PI / 2, alpha: true });
  const crateT = tex(512, 512, (g, w, h) => { g.fillStyle = '#6b7a40'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 102) { g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, y, w, 6); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, y + 6, w, 4); } g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 16; g.strokeRect(8, 8, w - 16, h - 16); txt(g, 'U.S. ARMY', w / 2, h / 2 - 10, 78, '#f3ead2'); txt(g, 'FRÁGIL · 1943', w / 2, h / 2 + 70, 36, '#f3ead2', 700); grain(g, w, h, .08, 3000); });
  const crate = (x, y, z, s, ry) => box(s, s, s, STD({ map: crateT }), x, y, z, { ry, r: .02 });
  crate(-5.5, 0, -5.0, .8, .2); crate(-4.65, 0, -5.1, .7, -.1); crate(-5.4, .8, -4.95, .6, .5);
  // escritorio con máquina de escribir, teléfono y radio
  table(-3, -4.7, 1.8, .9, .8, woodD);
  const tw = new T.Group(); tw.position.set(-3.2, .8, -4.65); scene.add(tw); box(.4, .12, .32, blackM, 0, 0, 0, { parent: tw }); box(.4, .08, .14, blackM, 0, .12, -.08, { parent: tw }); add(new T.CylinderGeometry(.035, .035, .44, 12), STD({ color: '#3a3a40' }), 0, .24, -.12, { parent: tw, rz: Math.PI / 2 }); plane(.24, .2, paper(64, 64, () => { }), 0, .34, -.12, { parent: tw, rx: -.3 });
  box(.18, .1, .22, blackM, -2.45, .8, -4.55); add(new T.TorusGeometry(.06, .02, 6, 12, Math.PI), blackM, -2.45, .98, -4.55, { rx: Math.PI / 2 });
  const radio = new T.Group(); radio.position.set(-2.4, .8, -4.95); scene.add(radio); box(.42, .34, .22, STD({ map: planksT({ w: 256, h: 256, n: 3, hue: 24, sat: 50, lit: 34 }) }), 0, 0, 0, { parent: radio, r: .06 }); plane(.24, .14, tex(128, 64, (g) => { g.fillStyle = '#f2d98a'; g.fillRect(0, 0, 128, 64); g.strokeStyle = '#6a4a2a'; for (let x = 8; x < 128; x += 10) { g.beginPath(); g.moveTo(x, 30); g.lineTo(x, 50); g.stroke(); } g.fillStyle = '#c8302e'; g.fillRect(60, 20, 3, 34); }), 0, .2, .111, { parent: radio }); [-.12, .12].forEach(x => add(new T.CylinderGeometry(.03, .03, .03, 12), brassM, x, .07, .12, { parent: radio, rx: Math.PI / 2 }));
  // carteles, reloj y calendario
  const posterT = paper(512, 720, (g, w, h) => { g.fillStyle = '#1f3a6a'; g.fillRect(20, 20, w - 40, h - 40); g.fillStyle = '#c8302e'; g.fillRect(20, h - 200, w - 40, 180); for (let k = 0; k < 9; k++) { g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(w / 2, 300); g.lineTo(k * 64, 20); g.lineTo(k * 64 + 30, 20); g.fill(); } drawPigeon(g, 250, 330, 1.7); g.fillStyle = '#5a3a22'; g.fillRect(330, 180, 70, 14); g.fillStyle = '#9fd6ee'; g.beginPath(); g.arc(360, 210, 20, 0, 7); g.fill(); txt(g, '¡TÚ TAMBIÉN', w / 2, 70, 46, '#f2c94c'); txt(g, 'PUEDES PILOTAR!', w / 2, h - 140, 52, '#ffffff'); txt(g, 'U.S. ARMY · 1943', w / 2, h - 70, 30, '#f2c94c', 700); }, '#efe2c4');
  plane(.9, 1.27, posterT, -2.3, 2.6, -LZ + .17); box(.98, 1.35, .04, woodD, -2.3, 1.925, -LZ + .15);
  const clockT = tex(256, 256, (g) => { g.fillStyle = '#f6efdc'; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.strokeStyle = '#1b1720'; g.lineWidth = 12; g.stroke(); g.lineWidth = 6; for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; g.beginPath(); g.moveTo(128 + Math.cos(a) * 94, 128 + Math.sin(a) * 94); g.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); g.stroke(); } g.lineWidth = 10; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 52); g.moveTo(128, 128); g.lineTo(184, 152); g.stroke(); g.fillStyle = '#c8302e'; g.beginPath(); g.arc(128, 128, 9, 0, 7); g.fill(); });
  add(new T.CylinderGeometry(.32, .32, .07, 32), STD({ color: '#3a2a20' }), 2.3, 3.45, -LZ + .2, { rx: Math.PI / 2 }); plane(.58, .58, clockT, 2.3, 3.45, -LZ + .24);
  const calT = paper(256, 340, (g, w) => { g.fillStyle = '#c8302e'; g.fillRect(0, 0, w, 90); txt(g, '1943', w / 2, 48, 64, '#fff'); txt(g, 'JUNIO', w / 2, 125, 28); g.font = '700 22px Inter'; g.textAlign = 'center'; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const d = r * 7 + c + 1; if (d <= 30) { g.fillStyle = d === 14 ? '#c8302e' : '#2a1c12'; g.fillText(String(d), 26 + c * 34, 175 + r * 34); } } }, '#fbf6ea');
  plane(.42, .56, calT, 2.3, 2.3, -LZ + .17);
  // radiador, tuberías, ventilador de techo, lámparas
  for (let k = 0; k < 10; k++) box(.08, .72, .18, STD({ color: '#e2ddd0', metalness: .3, roughness: .45 }), -.45 + k * .1, .12, -LZ + .38);
  [[3.2, .09], [3.35, .06]].forEach(([y, r]) => add(new T.CylinderGeometry(r, r, LZ * 2, 12), STD({ color: y > 3.3 ? '#c87a3a' : '#9aa0a6', metalness: .6, roughness: .35 }), LX - .3, y, 0, { rx: Math.PI / 2 }));
  [-4, -1, 2, 5].forEach(z => add(new T.CylinderGeometry(.12, .12, .1, 16), STD({ color: '#7a8086', metalness: .6, roughness: .35 }), LX - .3, 3.2, z, { rx: Math.PI / 2 }));
  const fan = new T.Group(); fan.position.set(1.2, LH - .55, .6); scene.add(fan); cyl(.02, .02, .4, blackM, 0, 0, 0, { parent: fan }); cyl(.14, .12, .14, brassM, 0, -.08, 0, { parent: fan }); const FAN = new T.Group(); fan.add(FAN); for (let k = 0; k < 4; k++) { const b = box(.9, .02, .16, woodD, .5, -.02, 0, { parent: FAN, r: .01 }); b.position.applyAxisAngle(new T.Vector3(0, 1, 0), k * Math.PI / 2); b.rotation.y = k * Math.PI / 2; }
  [[-2.4, 3], [4, 3]].forEach(([x, z]) => { add(new T.CylinderGeometry(.01, .01, .9, 6), blackM, x, LH - .45, z, { noInk: true }); add(new T.CylinderGeometry(.07, .36, .24, 24, 1, true), STD({ color: '#2f6a4a', side: T.DoubleSide, roughness: .4 }), x, LH - 1.0, z); add(new T.SphereGeometry(.08, 12, 8), new T.MeshBasicMaterial({ color: '#fff2c8' }), x, LH - 1.08, z, { noInk: true }); const pl = new T.PointLight('#ffd9a0', 2.4, 9, 2); pl.position.set(x, LH - 1.25, z); scene.add(pl); });
  // perchero, extintor, plumas, percha de paloma
  cyl(.03, .03, 1.9, woodD, 5.6, 0, 5.3); cyl(.22, .25, .05, woodD, 5.6, 0, 5.3); add(new T.CylinderGeometry(.24, .32, .9, 16), STD({ color: '#6a5a46' }), 5.6, 1.35, 5.42, { s: [1, 1, .5] }); cyl(.14, .16, .14, STD({ color: '#3a2a20' }), 5.6, 1.91, 5.3); cyl(.27, .27, .02, STD({ color: '#3a2a20' }), 5.6, 1.9, 5.3);
  cyl(.1, .1, .5, redM, 6.5, 0, 4.4); cyl(.04, .04, .1, blackM, 6.5, .5, 4.4);
  const featherT = tex(64, 128, (g) => { g.fillStyle = '#eef0f4'; g.beginPath(); g.ellipse(32, 60, 16, 52, 0, 0, 7); g.fill(); g.strokeStyle = '#9aa0b4'; g.lineWidth = 3; g.beginPath(); g.moveTo(32, 8); g.lineTo(32, 124); g.stroke(); });
  for (let i = 0; i < 14; i++) plane(.07, .14, featherT, rr(-6, -3.5), .008, rr(-3, 4), { rx: -Math.PI / 2, rz: rr(0, 6), alpha: true });
  for (let i = 0; i < 6; i++) plane(.07, .14, featherT, rr(-1, 3), .008, rr(-1, 2.5), { rx: -Math.PI / 2, rz: rr(0, 6), alpha: true });
  cyl(.03, .03, 1.2, woodD, 3.9, 0, 1.8); add(new T.CylinderGeometry(.025, .025, .6, 8), woodD, 3.9, 1.2, 1.8, { rz: Math.PI / 2 }); cyl(.25, .28, .05, woodD, 3.9, 0, 1.8);
  // ---------- más belleza: cortinas, jaulas de alambre, taburetes, globo terráqueo, ficus, apliques, libros en el suelo ----------
  const curtLabT = tex(512, 512, (g, w, h) => { for (let x = 0; x < w; x += 48) { const gr = g.createLinearGradient(x, 0, x + 48, 0); gr.addColorStop(0, '#8a2a1a'); gr.addColorStop(.5, '#d8643a'); gr.addColorStop(1, '#8a2a1a'); g.fillStyle = gr; g.fillRect(x, 0, 48, h); } for (let y = 0; y < h; y += 40) { g.fillStyle = 'rgba(255,220,160,.12)'; g.fillRect(0, y, w, 6); } grain(g, w, h, .06); }, [2, 1]);
  const curtain = (x, z, w, sd) => { const geo = new T.PlaneGeometry(w, 2.9, 24, 8); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const u = p.getX(i) / w + .5, v = p.getY(i) / 2.9 + .5; p.setZ(i, Math.sin(u * Math.PI * 7) * .07 + (1 - v) * .05 * sd); p.setX(i, p.getX(i) * (.55 + .45 * v)); } geo.computeVertexNormals(); add(geo, STD({ map: curtLabT, side: T.DoubleSide, roughness: .9 }), x, 2.55, z, { noInk: true }); };
  WINS.forEach(wx => { curtain(wx - 1.75, -LZ + .32, .7, 1); curtain(wx + 1.75, -LZ + .32, .7, -1); box(3.9, .06, .06, brassM, wx, 4.0, -LZ + .35, { r: .02 }); });
  const wireT = tex(256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = '#d8b04a'; g.lineWidth = 5; for (let x = 0; x <= w; x += 22) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } g.lineWidth = 7; [0, h * .5, h - 4].forEach(y => { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }); });
  const wireM = new T.MeshStandardMaterial({ map: wireT, transparent: true, alphaTest: .3, side: T.DoubleSide, metalness: .3, roughness: .4 });
  const cage = (x, y, z, s = 1) => { const g = new T.Group(); g.position.set(x, y, z); g.scale.setScalar(s); scene.add(g); cyl(.24, .24, .04, woodD, 0, 0, 0, { parent: g }); add(new T.CylinderGeometry(.22, .22, .42, 24, 1, true), wireM, 0, .25, 0, { parent: g, noInk: true }); add(new T.SphereGeometry(.22, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), wireM, 0, .46, 0, { parent: g, noInk: true }); add(new T.TorusGeometry(.05, .012, 6, 16), brassM, 0, .72, 0, { parent: g }); cyl(.006, .006, .3, woodD, 0, .14, 0, { parent: g, rz: Math.PI / 2 }); return g; };
  const CAGES = [cage(3.4, .9, -.05, .9), cage(6.55, 2.55, 2.1, .8), cage(6.55, 2.55, 1.2, .8)];
  box(.4, .04, 1.5, woodD, 6.75, 2.5, 1.65); [1.1, 2.2].forEach(z => box(.04, .2, .04, woodD, 6.9, 2.32, z));
  const stool = (x, z) => { const g = new T.Group(); g.position.set(x, 0, z); scene.add(g); cyl(.2, .2, .06, woodM, 0, .66, 0, { parent: g }); [0, 1, 2].forEach(k => { const a = k * 2.094; add(new T.CylinderGeometry(.02, .025, .68, 8), woodD, Math.cos(a) * .13, .33, Math.sin(a) * .13, { parent: g, rx: Math.sin(a) * .12, rz: -Math.cos(a) * .12 }); }); add(new T.TorusGeometry(.13, .012, 6, 20), woodD, 0, .25, 0, { parent: g, rx: Math.PI / 2 }); };
  stool(.0, 1.7); stool(2.3, 1.75); stool(-3.0, -3.9);
  const globe = new T.Group(); globe.position.set(-3.8, .8, -4.75); scene.add(globe); cyl(.08, .1, .04, brassM, 0, 0, 0, { parent: globe }); cyl(.012, .012, .12, brassM, 0, .04, 0, { parent: globe });
  const globeT = tex(512, 256, (g, w, h) => { g.fillStyle = '#5aa0c8'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8d29a'; [[90, 80, 60, 50], [150, 170, 30, 50], [280, 70, 80, 40], [300, 150, 40, 50], [420, 170, 40, 25], [400, 80, 30, 30]].forEach(([x, y, a, b]) => { g.beginPath(); g.ellipse(x, y, a, b, .3, 0, 7); g.fill(); }); g.strokeStyle = 'rgba(255,255,255,.35)'; for (let x = 0; x < w; x += 42) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } });
  add(new T.SphereGeometry(.17, 32, 20), STD({ map: globeT, roughness: .4 }), 0, .32, 0, { parent: globe, rz: .4 }); add(new T.TorusGeometry(.19, .01, 6, 32, Math.PI), brassM, 0, .32, 0, { parent: globe, rz: .4 + Math.PI / 2 });
  const ficus = (x, z, s) => { const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g); cyl(.26, .2, .42, STD({ color: '#b8583a' }), 0, 0, 0, { parent: g }); cyl(.27, .27, .05, STD({ color: '#9a4a2e' }), 0, .4, 0, { parent: g }); cyl(.03, .04, 1.2, woodD, 0, .4, 0, { parent: g });
    const lm = [STD({ color: '#3f8a3a' }), STD({ color: '#5aa848' }), STD({ color: '#2f7032' })]; for (let k = 0; k < 26; k++) { const a = k * 2.4, r = .18 + (k % 4) * .08, y = 1.0 + (k % 7) * .13; add(new T.SphereGeometry(.13, 10, 8), lm[k % 3], Math.cos(a) * r, y, Math.sin(a) * r, { parent: g, s: [1, .55, .7], rz: Math.cos(a) * .5, ry: a }); } };
  ficus(-6.2, 5.2, 1); ficus(6.2, -3.0, .9);
  [[-LX + .2, 2.9, 1.2], [LX - .2, 2.9, 5.0]].forEach(([x, y, z]) => { const sd = Math.sign(-x); box(.06, .2, .12, brassM, x, y - .1, z); add(new T.CylinderGeometry(.06, .12, .18, 16, 1, true), STD({ color: '#f3e0b0', emissive: '#ffcf80', emissiveIntensity: .6, side: T.DoubleSide }), x + sd * .14, y + .08, z, { noInk: true }); const pl = new T.PointLight('#ffcf8a', 1.2, 4, 2); pl.position.set(x + sd * .2, y + .1, z); scene.add(pl); });
  [[-5.6, 4.3], [6.2, .2]].forEach(([x, z]) => { let y = 0; for (let k = 0; k < 6; k++) { const bh = rr(.05, .09); box(rr(.32, .4), bh, rr(.24, .28), STD({ color: ['#a82a2a', '#2f5f9a', '#3e7a4a', '#d8a44a', '#6a3a7a'][k % 5] }), x + rr(-.03, .03), y, z, { ry: rr(-.3, .3) }); y += bh; } });
  // =====================================================================  NOSE (40,0,0)
  const NX = 40, NOSE = new T.Group(); NOSE.position.set(NX, 0, 0); scene.add(NOSE);
  const rivetT = tex(1024, 512, (g, w, h) => { g.fillStyle = '#9fb0a8'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 128) for (let x = (y / 128 % 2) * 128 - 128; x < w; x += 256) { const gr = g.createLinearGradient(x, y, x + 256, y + 128); gr.addColorStop(0, '#b2c2ba'); gr.addColorStop(1, '#8a9a92'); g.fillStyle = gr; g.fillRect(x + 2, y + 2, 252, 124); }
    for (let y = 0; y < h; y += 128) for (let x = 0; x < w; x += 16) { g.fillStyle = '#5a6a62'; g.beginPath(); g.arc(x + 8, y + 8, 3.5, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.arc(x + 7, y + 7, 1.5, 0, 7); g.fill(); }
    for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(90,60,30,${rr(.04, .1)})`; g.beginPath(); g.ellipse(rr(0, w), rr(0, h), rr(10, 50), rr(20, 80), 0, 0, 7); g.fill(); } grain(g, w, h, .06, 3000); }, [3, 1]);
  const shellG = new T.CylinderGeometry(1.25, 1.25, 4, 48, 1, true); shellG.rotateZ(Math.PI / 2);
  add(shellG, STD({ map: rivetT, color: '#8fa69a', side: T.BackSide, roughness: .5, metalness: .3 }), 0, 1.25, 0, { parent: NOSE, noInk: true, cast: false });
  add(new T.CircleGeometry(1.25, 40), STD({ map: rivetT }), -2, 1.25, 0, { ry: Math.PI / 2, parent: NOSE, noInk: true, cast: false });
  { const cap = OGIVE(1.25, 1.6); cap.rotateZ(-Math.PI / 2); add(cap, STD({ map: rivetT, color: '#7f968a', side: T.BackSide, roughness: .5, metalness: .3 }), 2, 1.25, 0, { parent: NOSE, noInk: true, cast: false }); }
  [-1.4, -.4, .6, 1.6].forEach(x => add(new T.TorusGeometry(1.22, .06, 8, 48), STD({ color: '#6f7f78', metalness: .6, roughness: .35 }), x, 1.25, 0, { ry: Math.PI / 2, parent: NOSE }));
  const hazT = tex(512, 64, (g, w, h) => { for (let x = -64; x < w; x += 64) { g.fillStyle = '#f2c230'; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 32, 0); g.lineTo(x + 64, h); g.lineTo(x + 32, h); g.fill(); g.fillStyle = '#1b1720'; g.beginPath(); g.moveTo(x + 32, 0); g.lineTo(x + 64, 0); g.lineTo(x + 96, h); g.lineTo(x + 64, h); g.fill(); } }, [6, 1]);
  const hzG = new T.CylinderGeometry(1.215, 1.215, .18, 48, 1, true); hzG.rotateZ(Math.PI / 2); add(hzG, STD({ map: hazT, side: T.BackSide }), -.9, 1.25, 0, { parent: NOSE, noInk: true, cast: false });
  add(new T.BoxGeometry(4, .1, 1.9), STD({ map: planksT({ w: 512, h: 256, n: 3, hue: 30, sat: 40, lit: 45 }) }), 0, .45, 0, { parent: NOSE });
  const tube = (pts, r, col) => add(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p => new T.Vector3(...p))), 40, r, 8), STD({ color: col, roughness: .5 }), 0, 0, 0, { parent: NOSE });
  tube([[-1.9, 2.1, -.7], [-.5, 2.25, -.5], [.6, 2.2, -.65], [1.4, 1.9, -.85]], .035, '#c8302e'); tube([[-1.9, 2.2, -.55], [-.4, 2.32, -.3], [.8, 2.3, -.4], [1.6, 2.0, -.6]], .03, '#2f5f9a');
  tube([[-1.9, 2.15, .65], [-.4, 2.28, .45], [.7, 2.22, .6], [1.5, 1.95, .8]], .04, '#1b1720'); tube([[-1.9, .6, -1.0], [-.6, .7, -1.1], [.9, .7, -1.05]], .05, '#c87a3a');
  const gaugeT = tex(128, 128, (g) => { g.fillStyle = '#f6efdc'; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.strokeStyle = '#1b1720'; g.lineWidth = 3; for (let k = 0; k < 9; k++) { const a = Math.PI * (.75 + k * .1875); g.beginPath(); g.moveTo(64 + Math.cos(a) * 44, 64 + Math.sin(a) * 44); g.lineTo(64 + Math.cos(a) * 56, 64 + Math.sin(a) * 56); g.stroke(); } g.strokeStyle = '#c8302e'; g.lineWidth = 6; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + Math.cos(-.6) * 44, 64 + Math.sin(-.6) * 44); g.stroke(); });
  [[-1.2, 1.9, -1.0], [-1.0, 1.55, -1.12], [-1.2, 1.9, 1.0]].forEach(([x, y, z]) => { const g = new T.Group(); g.position.set(x, y, z); NOSE.add(g); g.lookAt(new T.Vector3(NX + x, y, 0)); add(new T.CylinderGeometry(.12, .12, .06, 24), brassM, 0, 0, 0, { parent: g, rx: Math.PI / 2 }); plane(.2, .2, gaugeT, 0, 0, .035, { parent: g }); });
  const redLamp = add(new T.SphereGeometry(.07, 16, 10), new T.MeshBasicMaterial({ color: '#ff4a3a' }), -1.5, 2.3, 0, { parent: NOSE, noInk: true }); const rl = new T.PointLight('#ff3a2a', .9, 3, 2); rl.position.set(-1.4, 2.2, 0); NOSE.add(rl);
  const scrC = document.createElement('canvas'); scrC.width = 256; scrC.height = 256; const scrT = new T.CanvasTexture(scrC); scrT.colorSpace = T.SRGBColorSpace;
  function drawScreen(sx = 0, hit = 0) { const g = scrC.getContext('2d'), w = 256, h = 256; const gr = g.createRadialGradient(128, 128, 20, 128, 128, 140); gr.addColorStop(0, '#c8f6d0'); gr.addColorStop(1, '#4f9a68'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#86c898'; g.fillRect(0, 150, w, 106); g.fillStyle = 'rgba(30,70,50,.3)'; for (let y = 0; y < h; y += 6) g.fillRect(0, y, w, 2);
    const x = 128 + sx * 90; g.fillStyle = '#183a26'; g.beginPath(); g.moveTo(x - 60, 140); g.lineTo(x + 60, 140); g.lineTo(x + 46, 158); g.lineTo(x - 50, 158); g.closePath(); g.fill(); g.fillRect(x - 24, 112, 40, 28); g.fillRect(x - 6, 96, 10, 16); g.fillRect(x + 22, 124, 26, 16); g.fillRect(x - 46, 128, 20, 12);
    g.strokeStyle = hit ? '#e0302e' : 'rgba(20,40,30,.8)'; g.lineWidth = 4; g.beginPath(); g.moveTo(128, 96); g.lineTo(128, 160); g.moveTo(96, 128); g.lineTo(160, 128); g.stroke(); g.beginPath(); g.arc(128, 128, 22, 0, 7); g.stroke();
    if (hit) { g.fillStyle = 'rgba(255,240,200,.9)'; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(128 + Math.cos(k) * 14, 128 + Math.sin(k * 2) * 10, 4, 0, 7); g.fill(); } } scrT.needsUpdate = true; }
  drawScreen(0);
  const STATIONS = [];
  [-1, 0, 1].forEach((k) => { const st = new T.Group(); st.position.set(1.1 - Math.abs(k) * .25, 0, k * 1.0); st.rotation.y = -k * .5; NOSE.add(st);
    box(.1, .6, .76, STD({ color: '#3a4a44', metalness: .4, roughness: .4 }), .46, .5, 0, { parent: st });
    add(new T.CircleGeometry(.24, 32), new T.MeshBasicMaterial({ map: scrT }), .405, 1.05, 0, { ry: -Math.PI / 2, parent: st, noInk: true });
    add(new T.TorusGeometry(.25, .04, 10, 32), brassM, .41, 1.05, 0, { ry: Math.PI / 2, parent: st });
    add(new T.CircleGeometry(.13, 24), new T.MeshBasicMaterial({ color: '#9fc8de' }), .5, 1.62, 0, { ry: -Math.PI / 2, parent: st, noInk: true }); add(new T.TorusGeometry(.14, .035, 8, 24), brassM, .49, 1.62, 0, { ry: Math.PI / 2, parent: st });
    box(.46, .06, .46, STD({ map: planksT({ w: 256, h: 256, n: 3, hue: 30, sat: 55, lit: 50 }) }), 0, .5, 0, { parent: st }); box(.05, .12, .46, woodD, -.21, .55, 0, { parent: st });
    cyl(.08, .07, .04, steelM, .25, .56, .16, { parent: st }); cyl(.065, .065, .01, STD({ color: '#d8b860' }), .25, .6, .16, { parent: st });
    plane(.12, .12, paper(64, 64, (g) => { g.fillStyle = '#1b1720'; g.fillRect(0, 0, 64, 64); txt(g, String(k + 2), 32, 34, 44, '#f2c94c'); }), .405, 1.4, -.28, { ry: -Math.PI / 2, parent: st });
    const lp = new T.PointLight('#bfffd0', .9, 1.6, 2); lp.position.set(.2, 1.05, 0); st.add(lp); STATIONS.push(st); });
  const noseLight = new T.PointLight('#fff2d8', 1.6, 5, 2); noseLight.position.set(-1, 2.1, 0); NOSE.add(noseLight);
  // =====================================================================  MEET (80,0,0)
  const MX = 80, MEET = new T.Group(); MEET.position.set(MX, 0, 0); scene.add(MEET);
  add(new T.BoxGeometry(12, .2, 10), STD({ map: tex(512, 512, (g, w, h) => { g.fillStyle = '#7a1f22'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 64) for (let x = (y / 64 % 2) * 32; x < w; x += 64) { g.fillStyle = '#9a3a2a'; g.beginPath(); g.moveTo(x, y + 32); g.lineTo(x + 32, y); g.lineTo(x + 64, y + 32); g.lineTo(x + 32, y + 64); g.fill(); g.fillStyle = '#e0b860'; g.beginPath(); g.arc(x + 32, y + 32, 5, 0, 7); g.fill(); } grain(g, w, h, .1, 3000); }, [6, 5]) }), 0, -.1, 0, { parent: MEET, cast: false, noInk: true });
  add(new T.BoxGeometry(12, .2, 10), STD({ color: '#efe2c4' }), 0, 4.1, 0, { parent: MEET, noInk: true });
  const mWall = STD({ map: wallT('#d9c38e', { stripes: 'rgba(160,120,60,.18)', rep: [3, 1] }) }), mPanel = STD({ map: panelT('#5a2e18', { n: 4, rep: [3, 1] }) });
  [[0, -5, 0, 12], [-6, 0, Math.PI / 2, 10], [6, 0, -Math.PI / 2, 10], [0, 5, Math.PI, 12]].forEach(([x, z, ry, w]) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; MEET.add(g); add(new T.BoxGeometry(w, 4, .3), mWall, 0, 2, 0, { parent: g, noInk: true }); add(new T.BoxGeometry(w, 1.6, .32), mPanel, 0, .8, .01, { parent: g, cast: false, noInk: true }); box(w, .1, .14, woodD, 0, 1.6, .2, { parent: g, cast: false }); });
  for (let x = -5; x <= 5; x += 2.5) box(.22, .26, 10, woodD, x, 3.84, 0, { parent: MEET, cast: false });
  box(5.4, .1, 1.6, STD({ map: planksT({ w: 512, h: 256, n: 2, hue: 20, sat: 55, lit: 26 }), roughness: .3 }), 0, .82, 0, { parent: MEET }); box(5.1, .7, 1.3, STD({ map: panelT('#6a3a1e', { n: 6 }) }), 0, .12, 0, { parent: MEET });
  [-1.8, -.6, .6, 1.8].forEach((x) => { plane(.42, .3, paper(512, 360, (g) => { g.scale(2, 2); g.save(); g.translate(128, 80); g.rotate(-.15); g.strokeStyle = '#c8302e'; g.lineWidth = 6; g.strokeRect(-100, -28, 200, 56); txt(g, 'ALTO SECRETO', 0, 2, 30, '#c8302e'); g.restore(); txt(g, 'PROYECTO PALOMA', 128, 150, 18, '#2a1c12', 700); }, '#e8cf9a'), x, .925, -.35, { parent: MEET, rx: -Math.PI / 2, rz: rr(-.15, .15) });
    add(new T.CylinderGeometry(.05, .045, .14, 12), new T.MeshStandardMaterial({ color: '#dff1ff', transparent: true, opacity: .45 }), x + .3, .99, -.25, { parent: MEET, noInk: true }); });
  [-1.2, 1.2].forEach(x => { const l = new T.Group(); l.position.set(x, .92, .2); MEET.add(l); cyl(.08, .1, .04, brassM, 0, 0, 0, { parent: l }); cyl(.012, .012, .3, brassM, 0, .04, 0, { parent: l }); add(new T.CylinderGeometry(.13, .13, .34, 16, 1, false, 0, Math.PI), STD({ color: '#1f7a4a', emissive: '#0a3a20', emissiveIntensity: .4, roughness: .2, side: T.DoubleSide }), 0, .36, 0, { parent: l, rz: Math.PI / 2 }); const pl = new T.PointLight('#ffe0a0', 1.6, 3.5, 2); pl.position.set(0, .25, 0); l.add(pl); });
  cyl(.14, .1, .06, STD({ color: '#3a3a40', metalness: .4 }), 0, .92, .35, { parent: MEET });
  const mapT = paper(1024, 640, (g, w, h) => { g.fillStyle = '#7fb8d8'; g.fillRect(30, 30, w - 60, h - 60); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; for (let x = 30; x < w; x += 80) { g.beginPath(); g.moveTo(x, 30); g.lineTo(x, h - 30); g.stroke(); } for (let y = 30; y < h; y += 80) { g.beginPath(); g.moveTo(30, y); g.lineTo(w - 30, y); g.stroke(); }
    g.fillStyle = '#e8d29a'; [[120, 160, 140, 220], [800, 120, 160, 260], [520, 470, 120, 70], [300, 380, 60, 40], [640, 260, 40, 30]].forEach(([x, y, a, b]) => { g.beginPath(); g.ellipse(x, y, a, b, rr(0, 1), 0, 7); g.fill(); });
    g.strokeStyle = '#c8302e'; g.lineWidth = 6; g.setLineDash([16, 12]); g.beginPath(); g.moveTo(220, 300); g.quadraticCurveTo(460, 200, 640, 270); g.stroke(); g.setLineDash([]); txt(g, 'OCÉANO PACÍFICO', 470, 600, 40, '#1f3a6a'); [[260, 320], [520, 230], [640, 270]].forEach(([x, y]) => { g.fillStyle = '#c8302e'; g.beginPath(); g.arc(x, y, 12, 0, 7); g.fill(); }); }, '#f3e6c8');
  plane(2.4, 1.5, mapT, 0, 2.55, -4.83, { parent: MEET }); box(2.52, 1.62, .05, woodD, 0, 1.74, -4.87, { parent: MEET });
  const usT = tex(380, 200, (g, w, h) => { for (let k = 0; k < 13; k++) { g.fillStyle = k % 2 ? '#ffffff' : '#b22234'; g.fillRect(0, k * h / 13, w, h / 13 + 1); } g.fillStyle = '#3c3b6e'; g.fillRect(0, 0, w * .4, h * 7 / 13); g.fillStyle = '#fff'; for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) { g.beginPath(); g.arc(9 + c * 18, 8 + r * 17, 3.2, 0, 7); g.fill(); } });
  cyl(.03, .03, 2.8, brassM, 4.6, 0, -4.2, { parent: MEET }); add(new T.SphereGeometry(.07, 12, 8), brassM, 4.6, 2.85, -4.2, { parent: MEET });
  const usF = new T.PlaneGeometry(1.3, .7, 12, 3); add(usF, new T.MeshStandardMaterial({ map: usT, side: T.DoubleSide, roughness: .8 }), 3.95, 2.3, -4.2, { parent: MEET, noInk: true });
  const portraitT = (hue) => paper(200, 260, (g) => { g.fillStyle = `hsl(${hue},30%,32%)`; g.fillRect(0, 0, 200, 260); g.fillStyle = '#f2ece0'; g.beginPath(); g.arc(100, 110, 50, 0, 7); g.fill(); g.fillStyle = '#2a2a33'; g.beginPath(); g.ellipse(100, 240, 80, 70, 0, 0, 7); g.fill(); g.strokeStyle = '#1b1720'; g.lineWidth = 6; g.beginPath(); g.arc(100, 110, 50, 0, 7); g.stroke(); g.fillStyle = '#1b1720'; g.fillRect(70, 100, 20, 6); g.fillRect(110, 100, 20, 6); });
  [[-3.4, 30], [3.4, 120]].forEach(([x, hue]) => { plane(.8, 1.04, portraitT(hue), x, 2.6, -4.83, { parent: MEET }); box(.94, 1.18, .05, brassM, x, 2.01, -4.87, { parent: MEET }); });
  const bookcase = (x) => { const g = new T.Group(); g.position.set(x, 0, -4.6); MEET.add(g); box(1.4, 2.6, .5, woodD, 0, 0, 0, { parent: g }); [.4, 1.1, 1.8].forEach(y => { let bx = -.62; while (bx < .56) { const bw = rr(.05, .09); box(bw, rr(.4, .55), .3, STD({ color: ['#7a1f22', '#1f3a6a', '#2f5a3a', '#c8a050', '#3a2a20'][Math.floor(rnd() * 5)] }), bx + bw / 2, y, .12, { parent: g }); bx += bw + .01; } }); };
  bookcase(-5.0); bookcase(5.1);
  const MWIN = new T.Group(); MWIN.position.set(5.85, 0, .5); MWIN.rotation.y = -Math.PI / 2; MEET.add(MWIN); plane(1.8, 2, cityT, 0, 2.2, -.25, { parent: MWIN, basic: true });
  for (let k = 0; k < 14; k++) box(1.8, .03, .1, cream, 0, 1.25 + k * .14, -.1, { parent: MWIN, rx: .5 });
  const mL = new T.PointLight('#ffe0a8', 3, 10, 2); mL.position.set(0, 3.4, 0); MEET.add(mL);
  // =====================================================================  STAGE (120,0,0)
  const SX = 120, STAGE = new T.Group(); STAGE.position.set(SX, 0, 0); scene.add(STAGE);
  add(new T.BoxGeometry(14, .2, 12), STD({ color: '#14141c' }), 0, -.1, 0, { parent: STAGE, cast: false, noInk: true });
  box(8, .6, 4, STD({ map: planksT({ n: 6, hue: 22, sat: 50, lit: 24, rep: [2, 1] }), roughness: .35 }), 0, 0, -1, { parent: STAGE });
  const curtT = tex(512, 512, (g, w, h) => { for (let x = 0; x < w; x += 64) { const gr = g.createLinearGradient(x, 0, x + 64, 0); gr.addColorStop(0, '#6a0a14'); gr.addColorStop(.45, '#d8283a'); gr.addColorStop(.55, '#e8404a'); gr.addColorStop(1, '#6a0a14'); g.fillStyle = gr; g.fillRect(x, 0, 64, h); } const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(.3, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }, [6, 1]);
  plane(12, 6, curtT, 0, 3, -3.1, { parent: STAGE });
  [-1, 1].forEach(sd => { box(.5, 6, .5, STD({ color: '#d8a83a', metalness: .6, roughness: .3 }), sd * 4.3, 0, -2.6, { parent: STAGE }); plane(2.4, 6, curtT, sd * 3.0, 3, -2.3, { parent: STAGE, ry: -sd * .25 }); });
  box(9, .6, .5, STD({ color: '#d8a83a', metalness: .6, roughness: .3 }), 0, 5.3, -2.6, { parent: STAGE });
  const awT = tex(1024, 200, (g, w, h) => { g.fillStyle = '#141418'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2c94c'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20); for (let x = 30; x < w - 20; x += 40) { g.fillStyle = (x / 40) % 2 ? '#fff2b0' : '#f2c94c'; g.beginPath(); g.arc(x, 22, 6, 0, 7); g.fill(); g.beginPath(); g.arc(x, h - 22, 6, 0, 7); g.fill(); } txt(g, 'IG NOBEL · 2024', w / 2, h / 2 + 4, 92, '#f2c94c'); });
  plane(4.6, .9, awT, 0, 4.55, -2.8, { parent: STAGE, basic: true });
  // sala cerrada (telón a los lados, techo y pared del fondo oscuros) para que ningún barrido de cámara vea el cielo
  const sideCurtM = STD({ map: curtT, roughness: .8, color: '#8a6a70' }), darkM = STD({ color: '#0d0c12', roughness: .9 });
  [-1, 1].forEach(sd => box(.3, 8, 13, sideCurtM, sd * 7, 0, 2.6, { parent: STAGE, cast: false }));
  box(14.6, .3, 13, darkM, 0, 8, 2.6, { parent: STAGE, cast: false, noInk: true });
  box(14.6, 8, .3, darkM, 0, 0, 9, { parent: STAGE, cast: false, noInk: true });
  box(14.6, 8, .3, darkM, 0, 0, -3.5, { parent: STAGE, cast: false, noInk: true });
  box(.7, 1.1, .5, STD({ map: planksT({ w: 256, h: 512, n: 2, hue: 20, sat: 50, lit: 26 }), roughness: .3 }), 1.9, .6, -.4, { parent: STAGE }); box(.8, .06, .6, woodD, 1.9, 1.7, -.4, { parent: STAGE }); add(new T.CylinderGeometry(.01, .01, .4, 6), blackM, 1.9, 1.95, -.25, { parent: STAGE, rz: .3 });
  const TROPHY = new T.Group(); TROPHY.position.set(0, .6, -.2); STAGE.add(TROPHY);
  { const blk = TOON({ color: '#22202a' }); box(.36, .1, .36, blk, 0, 0, 0, { parent: TROPHY }); box(.27, .08, .27, blk, 0, .1, 0, { parent: TROPHY });
    plane(.2, .05, paper(256, 64, (g) => { g.fillStyle = '#d9a52a'; g.fillRect(0, 0, 256, 64); g.strokeStyle = '#7a5410'; g.lineWidth = 5; g.strokeRect(4, 4, 248, 56); txt(g, 'IG NOBEL 2024', 128, 34, 30, '#3a2608'); }), 0, .14, .137, { parent: TROPHY, basic: true });
    const prof = []; for (let i = 0; i <= 14; i++) { const y = .18 + i / 14 * .26, u = (y - .18) / .26; prof.push(new T.Vector2(.032 + .05 * Math.pow(1 - u, 3) + .022 * Math.exp(-Math.pow((y - .31) / .025, 2)), y)); }
    for (let i = 1; i <= 18; i++) { const u = i / 18, y = .44 + u * .32; prof.push(new T.Vector2(.04 + .19 * Math.pow(Math.sin(u * Math.PI / 2), .7) + (u > .93 ? (u - .93) * .25 : 0), y)); }
    add(new T.LatheGeometry(prof, 48), goldT, 0, 0, 0, { parent: TROPHY });
    add(new T.CylinderGeometry(.215, .215, .01, 48), TOON({ color: '#a8761a' }), 0, .75, 0, { parent: TROPHY, noInk: true });
    [-1, 1].forEach(sd => add(new T.TorusGeometry(.075, .02, 10, 28), goldT, sd * .235, .63, 0, { parent: TROPHY }));
    add(new T.TorusGeometry(.205, .012, 8, 40), goldT, 0, .5, 0, { rx: Math.PI / 2, parent: TROPHY }); }
  const spot = new T.SpotLight('#fff4dc', 45, 30, .3, .6, 1.5); spot.position.set(0, 9, 5); spot.target.position.set(SX, .6, -.4); scene.add(spot.target); STAGE.add(spot);
  const coneM = new T.MeshBasicMaterial({ map: beamT, transparent: true, opacity: .16, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide });
  [[-3, 1], [3, -1]].forEach(([x, sd]) => add(new T.ConeGeometry(1.2, 8, 24, 1, true), coneM, x * .5, 5, 1.5, { parent: STAGE, noInk: true, cast: false, rz: sd * .35, rx: .35 }));
  for (let i = 0; i < 70; i++) add(new T.PlaneGeometry(.05, .08), new T.MeshBasicMaterial({ color: ['#f2c94c', '#e8404a', '#4ab0e8', '#5ac86a', '#ffffff'][i % 5], side: T.DoubleSide }), rr(-3, 3), rr(.8, 4), rr(-1.5, 2), { parent: STAGE, noInk: true, cast: false, rx: rr(0, 6), ry: rr(0, 6) });
  for (let i = 0; i < 9; i++) { const hx = -3.2 + i * .8 + rr(-.1, .1), hz = 3.4 + rr(-.2, .2); add(new T.SphereGeometry(.22, 16, 12), STD({ color: '#0e0e14' }), hx, .95 + rr(-.08, .08), hz, { parent: STAGE, noInk: true, cast: false }); add(new T.SphereGeometry(.38, 16, 12), STD({ color: '#0e0e14' }), hx, .45, hz, { parent: STAGE, noInk: true, cast: false, s: [1, 1, .7] }); }
  // =====================================================================  SEA (-1200,0,0)
  const SEAX = -1200;
  const waterM = new T.ShaderMaterial({ fog: true, uniforms: Object.assign(T.UniformsUtils.clone(T.UniformsLib.fog), { time: { value: 0 } }),
    vertexShader: '#include <fog_pars_vertex>\nuniform float time; varying vec3 wp; void main(){ vec3 p=position; p.y+=sin(p.x*.08+time*1.2)*.35+sin(p.z*.11+time*.9)*.28; wp=(modelMatrix*vec4(p,1.)).xyz; vec4 mvPosition=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
    fragmentShader: '#include <fog_pars_fragment>\nuniform float time; varying vec3 wp; void main(){ float w=sin(wp.x*.3+time*1.5)*sin(wp.z*.37-time*1.1)+sin(wp.x*.9-wp.z*.7+time*2.)*.5; vec3 deep=vec3(.02,.3,.52), lite=vec3(.1,.62,.78); vec3 c=mix(deep,lite,.5+.35*w); c+=vec3(1.)*smoothstep(1.15,1.45,w+sin(wp.x*2.1+time)*.3)*.6; gl_FragColor=vec4(c,1.);\n#include <fog_fragment>\n}' });
  const wg = new T.PlaneGeometry(1600, 1600, 160, 160); wg.rotateX(-Math.PI / 2); const water = add(wg, waterM, SEAX, 0, 0, { cast: false, noInk: true });
  const cloudM = STD({ color: '#ffffff', roughness: 1, emissive: '#dfeaf6', emissiveIntensity: .5 });
  [[-200, 90, -500, 30], [120, 120, -620, 40], [380, 80, -450, 26], [-420, 140, -700, 46], [0, 60, -380, 20]].forEach(([x, y, z, s]) => { const g = new T.Group(); g.position.set(SEAX + x, y, z); g.scale.setScalar(s); scene.add(g); [[0, 0, 0, 1], [1.1, -.2, .2, .8], [-1.1, -.25, .1, .75], [.4, .5, 0, .8], [-.5, .4, -.2, .7], [1.8, -.4, 0, .5], [-1.8, -.4, 0, .5]].forEach(([a, b, c, r]) => add(new T.SphereGeometry(r, 20, 14), cloudM, a, b, c, { parent: g, noInk: true, cast: false })); });
  const rockM = STD({ color: '#c89a6a', roughness: .9 }), rockD = STD({ color: '#a8784a', roughness: .9 }), green = STD({ color: '#4f9a3a', roughness: .8 });
  [[-140, -260, 30, 60], [-90, -300, 22, 44], [160, -280, 34, 70], [210, -320, 20, 40]].forEach(([x, z, r, h]) => { const g = new T.Group(); g.position.set(SEAX + x, 0, z); scene.add(g); add(new T.CylinderGeometry(r * .8, r, h, 9), rockM, 0, h / 2, 0, { parent: g }); add(new T.CylinderGeometry(r * .5, r * .75, h * .5, 8), rockD, r * .3, h * .8, 0, { parent: g }); add(new T.SphereGeometry(r * .85, 12, 8), green, 0, h + 2, 0, { parent: g, s: [1, .35, 1] }); });
  const SHIP = new T.Group(); SHIP.position.set(SEAX, 0, -60); scene.add(SHIP);
  const dazT = tex(1024, 256, (g, w, h) => { g.fillStyle = '#c8d0d6'; g.fillRect(0, 0, w, h); const cols = ['#2a3440', '#6a7a88', '#9aa8b4', '#3a4a5a']; for (let i = 0; i < 26; i++) { g.fillStyle = cols[i % 4]; g.beginPath(); const x = rr(0, w), y = rr(-40, h); g.moveTo(x, y); g.lineTo(x + rr(80, 200), y + rr(-60, 60)); g.lineTo(x + rr(40, 160), y + rr(60, 160)); g.lineTo(x - rr(0, 80), y + rr(40, 120)); g.fill(); } grain(g, w, h, .06); });
  const dazM = STD({ map: dazT, roughness: .55, metalness: .15 }), greyD = STD({ color: '#5a6672', roughness: .55, metalness: .2 }), greyM = STD({ color: '#8a96a2', roughness: .55, metalness: .2 });
  const hs = new T.Shape(); hs.moveTo(-40, 0); hs.lineTo(34, 0); hs.quadraticCurveTo(44, 0, 50, 4); hs.lineTo(40, 6); hs.lineTo(-40, 6); hs.closePath();
  const hullG = new T.ExtrudeGeometry(hs, { depth: 10, bevelEnabled: true, bevelThickness: .4, bevelSize: .3, bevelSegments: 2, curveSegments: 16 }); hullG.translate(0, -3, -5);
  const hp = hullG.attributes.position; for (let i = 0; i < hp.count; i++) { const x = hp.getX(i), y = hp.getY(i); let t = 1 - Math.pow(Math.max(0, x - 20) / 30, 1.6) * .95; t *= .55 + .45 * Math.min(1, (y + 3) / 6); hp.setZ(i, hp.getZ(i) * t); }
  hullG.computeVertexNormals(); const uvA = hullG.attributes.uv; for (let i = 0; i < uvA.count; i++) uvA.setXY(i, (hp.getX(i) + 40) / 90, (hp.getY(i) + 3) / 9 + hp.getZ(i) * .02); add(hullG, dazM, 0, 0, 0, { parent: SHIP });
  add(new T.BoxGeometry(84, .6, 10.6), STD({ color: '#9a2a22' }), 2, -.1, 0, { parent: SHIP, cast: false, s: [1, 1, .98] });
  box(78, .3, 8, STD({ map: planksT({ w: 512, h: 256, n: 6, hue: 30, sat: 30, lit: 55, rep: [8, 1] }) }), -2, 3, 0, { parent: SHIP });
  for (let k = 0; k < 14; k++) add(new T.CylinderGeometry(.22, .22, .1, 12), STD({ color: '#1b2026' }), -30 + k * 4.4, 2.2, 5.05, { rx: Math.PI / 2, parent: SHIP });
  [-1, 1].forEach(sd => [-20, -10, 6].forEach(x => add(new T.CylinderGeometry(.6, .6, 3.4, 12), STD({ color: '#f3ead2' }), x, 5.2, sd * 3.6, { rz: Math.PI / 2, parent: SHIP })));
  box(16, 4, 6, dazM, -6, 3.2, 0, { parent: SHIP }); box(9, 3, 5, dazM, -4, 7.2, 0, { parent: SHIP }); box(5, 2, 4.4, greyD, -3, 10.2, 0, { parent: SHIP });
  for (let k = 0; k < 6; k++) add(new T.PlaneGeometry(.8, .5), new T.MeshBasicMaterial({ color: '#1b2026' }), -6.5 + k * 1.1, 11.4, 2.21, { parent: SHIP, noInk: true });
  cyl(1.6, 1.9, 7, greyD, -14, 4.5, 0, { parent: SHIP }); box(3.6, .6, 3.6, blackM, -14, 11.4, 0, { parent: SHIP }); cyl(1.3, 1.6, 6, greyD, -20, 4.6, 0, { parent: SHIP }); box(3, .5, 3, blackM, -20, 10.6, 0, { parent: SHIP });
  cyl(.25, .3, 14, greyD, 2, 9, 0, { parent: SHIP }); add(new T.BoxGeometry(5, .2, .2), greyD, 2, 19, 0, { parent: SHIP }); add(new T.TorusGeometry(1.2, .12, 6, 20, Math.PI), greyD, 2, 21.5, 0, { parent: SHIP });
  [[18, 3.3], [28, 3.3], [-28, 3.3]].forEach(([x, y], k) => { const tg = new T.Group(); tg.position.set(x, y, 0); tg.rotation.y = k === 2 ? Math.PI : 0; SHIP.add(tg); add(new T.CylinderGeometry(2.2, 2.6, 1.8, 20), greyM, 0, .9, 0, { parent: tg }); box(3.2, 1.4, 3, greyM, .4, .5, 0, { parent: tg }); [-.6, .6].forEach(z => add(new T.CylinderGeometry(.18, .22, 6, 10), greyD, 4, 1.4, z, { parent: tg, rz: Math.PI / 2 })); });
  const flagNav = tex(160, 100, (g, w, h) => { for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#ffffff' : '#c8302e'; g.fillRect(0, k * h / 7, w, h / 7 + 1); } g.fillStyle = '#1f3a6a'; g.fillRect(0, 0, 60, 54); });
  add(new T.PlaneGeometry(4, 2.4), new T.MeshStandardMaterial({ map: flagNav, side: T.DoubleSide }), -42, 9, 0, { parent: SHIP, noInk: true }); cyl(.12, .12, 7, greyD, -40, 3, 0, { parent: SHIP });
  const wakeM = new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .55, depthWrite: false });
  add(new T.PlaneGeometry(140, 12), wakeM, -100, .45, 0, { rx: -Math.PI / 2, parent: SHIP, noInk: true, cast: false });
  [-1, 1].forEach(sd => add(new T.PlaneGeometry(40, 3), wakeM, 44, .45, sd * 6, { rx: -Math.PI / 2, rz: sd * .35, parent: SHIP, noInk: true, cast: false }));
  for (let i = 0; i < 18; i++) add(new T.SphereGeometry(rr(.6, 1.4), 10, 8), STD({ color: '#ffffff', emissive: '#cfe6f0', emissiveIntensity: .4 }), 46 + rr(-4, 2), rr(.2, 1.2), rr(-5.5, 5.5), { parent: SHIP, noInk: true, cast: false, s: [1, .5, 1] });
  const MISSILE = new T.Group(); MISSILE.position.set(SEAX + 60, 60, 80); scene.add(MISSILE);
  add(new T.CylinderGeometry(.55, .5, 4.4, 32), paintM, 0, 0, 0, { rz: Math.PI / 2, parent: MISSILE }); add(OGIVE(.55, 1.1), noseM, 2.2, 0, 0, { rz: -Math.PI / 2, parent: MISSILE });
  MISSILE.updateMatrixWorld(true);
  const MISSILE_PORTS = []; [.95, 1.45, 1.95].forEach(x => { const p = new T.Group(); p.position.set(x, .12, .5); MISSILE.add(p); MISSILE_PORTS.push(p); p.lookAt(p.getWorldPosition(new T.Vector3()).add(new T.Vector3(0, .22, 1))); add(new T.CylinderGeometry(.17, .17, .06, 24), STD({ color: '#24323a', roughness: .1 }), 0, 0, 0, { rx: Math.PI / 2, parent: p }); add(new T.TorusGeometry(.17, .035, 10, 28), goldT, 0, 0, .03, { parent: p }); });
  add(new T.TorusGeometry(.535, .045, 8, 32), olive, .5, 0, 0, { ry: Math.PI / 2, parent: MISSILE }); add(new T.TorusGeometry(.53, .035, 8, 32), TOON({ color: '#c8302e' }), -1.6, 0, 0, { ry: Math.PI / 2, parent: MISSILE });
  const wingS = new T.Shape(); wingS.moveTo(0, 0); wingS.lineTo(-1.2, 3.0); wingS.lineTo(-2.0, 3.0); wingS.lineTo(-1.6, 0); wingS.closePath();
  [-1, 1].forEach(sd => { const wgm = new T.ExtrudeGeometry(wingS, { depth: .1, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 1 }); wgm.rotateX(-Math.PI / 2 * sd); add(wgm, olive, .6, 0, sd * .1, { parent: MISSILE }); });
  const finS = new T.Shape(); finS.moveTo(0, 0); finS.lineTo(-.9, 1.1); finS.lineTo(-1.3, 1.1); finS.lineTo(-1, 0); finS.closePath();
  const finG = new T.ExtrudeGeometry(finS, { depth: .06, bevelEnabled: false }); finG.translate(0, 0, -.03); add(finG, olive, -1.6, .4, 0, { parent: MISSILE });
  [-1, 1].forEach(sd => { const fg = new T.ExtrudeGeometry(finS, { depth: .06, bevelEnabled: false }); fg.rotateX(-Math.PI / 2 * sd); add(fg, olive, -1.6, 0, sd * .4, { parent: MISSILE }); });
  const starT = tex(128, 128, (g) => { g.fillStyle = '#6b7a3c'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#1f3a7a'; g.beginPath(); g.arc(64, 64, 52, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 18 : 44; g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } g.fill(); });
  [-1, 1].forEach(sd => add(new T.CircleGeometry(.36, 24), new T.MeshBasicMaterial({ map: starT }), -.6, 0, sd * .53, { ry: sd > 0 ? 0 : Math.PI, parent: MISSILE, noInk: true }));
  { const steelT = TOON({ color: '#9aa2a6' }), darkT = TOON({ color: '#2a2a30' }), yelT = TOON({ color: '#f2c230' });
    add(new T.SphereGeometry(.07, 20, 14), STD({ color: '#9fd6ee', roughness: .05, metalness: .2, emissive: '#2a5a70', emissiveIntensity: .4 }), 3.27, 0, 0, { parent: MISSILE }); add(new T.TorusGeometry(.075, .02, 8, 20), goldT, 3.24, 0, 0, { ry: Math.PI / 2, parent: MISSILE });
    [-1.05, 2.12].forEach(x => { add(new T.TorusGeometry(x > 0 ? .51 : .54, .03, 8, 40), steelT, x, 0, 0, { ry: Math.PI / 2, parent: MISSILE }); for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2, r = x > 0 ? .53 : .56; add(new T.BoxGeometry(.05, .05, .05), darkT, x, Math.sin(a) * r, Math.cos(a) * r, { parent: MISSILE, rx: a }); } });
    [-.4, .95].forEach(x => { add(new T.TorusGeometry(.06, .018, 8, 16), steelT, x, .58, 0, { parent: MISSILE }); add(new T.BoxGeometry(.1, .04, .06), darkT, x, .53, 0, { parent: MISSILE }); });
    add(new T.CylinderGeometry(.012, .018, .55, 8), darkT, -.9, .78, 0, { rz: .35, parent: MISSILE }); add(new T.SphereGeometry(.03, 10, 8), TOON({ color: '#e8463a' }), -.99, 1.04, 0, { parent: MISSILE });
    add(new T.BoxGeometry(.42, .07, .08), yelT, -2.72, 1.5, 0, { parent: MISSILE }); [-1, 1].forEach(sd => add(new T.BoxGeometry(.42, .08, .07), yelT, -2.72, 0, sd * 1.5, { parent: MISSILE }));
    add(new T.CylinderGeometry(.46, .3, .35, 28), darkT, -2.35, 0, 0, { rz: Math.PI / 2, parent: MISSILE }); add(new T.CylinderGeometry(.27, .27, .02, 24), TOON({ color: '#ff9a3a', emissive: '#ff6a10', emissiveIntensity: 1.2 }), -2.53, 0, 0, { rz: Math.PI / 2, parent: MISSILE, noInk: true });
    const flameM = new T.MeshBasicMaterial({ color: '#ffb040', transparent: true, opacity: .85, blending: T.AdditiveBlending, depthWrite: false }), coreM = new T.MeshBasicMaterial({ color: '#fff4c0', transparent: true, opacity: .95, blending: T.AdditiveBlending, depthWrite: false });
    const FL = new T.Group(); FL.position.set(-2.55, 0, 0); MISSILE.add(FL); const fg = new T.ConeGeometry(.24, 1.4, 20, 1, true); fg.translate(0, -.7, 0); fg.rotateZ(-Math.PI / 2); const cg = new T.ConeGeometry(.13, .8, 16, 1, true); cg.translate(0, -.4, 0); cg.rotateZ(-Math.PI / 2);
    [fg, cg].forEach((gm, i) => { const m = new T.Mesh(gm, i ? coreM : flameM); m.userData.noInk = true; m.castShadow = false; FL.add(m); }); MISSILE.userData.flame = FL;
    const puffM = new T.MeshLambertMaterial({ color: '#f4f2ee', transparent: true, opacity: .55, depthWrite: false }); MISSILE.userData.puffs = [];
    for (let i = 0; i < 14; i++) { const p = new T.Mesh(new T.SphereGeometry(1, 12, 8), puffM.clone()); p.userData.noInk = true; p.castShadow = false; MISSILE.add(p); MISSILE.userData.puffs.push(p); } }
  // =====================================================================  post + contorno
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .14, .45, .9); comp.addPass(bloom);
  const ao = new GTAOPass(scene, camera, W, H); ao.blendIntensity = .9; ao.updateGtaoMaterial({ radius: .5, distanceExponent: 1.4, thickness: 1 }); comp.addPass(ao); const aoSet = ao.setSize.bind(ao); ao.setSize = (w, h) => aoSet(Math.round(w / 2), Math.round(h / 2)); ao.setSize(W, H);   // AO a media resolución: casi igual y 1,6 s menos por fotograma
  const dof = new BokehPass(scene, camera, { focus: 6, aperture: .003, maxblur: .008 }); comp.addPass(dof); comp.addPass(new OutputPass());
  // gradación de color de cine: sombras frías, luces cálidas, curva en S, viñeta suave y grano
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, time: { value: 0 }, warm: { value: 1 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float time, warm; varying vec2 vUv; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c+=vec3(-.012,.012,.03)*(1.-l)*warm; c+=vec3(.035,.016,-.02)*l*warm; c=mix(vec3(l),c,1.17); c=c*c*(3.-2.*c)*.35+c*.65; vec2 d=vUv-.5; c*=1.-dot(d*vec2(1.,.6),d*vec2(1.,.6))*.55; c+=(h(vUv*vec2(1080.,1920.)+time)-.5)*.018; gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o === sky || o.userData.noInk || o.material.transparent || o.material.side === T.BackSide || o.material.blending === T.AdditiveBlending) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'ShapeGeometry' || ty === 'CircleGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => { if (g.attributes[a]) g.deleteAttribute(a); }); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  function setTime(t) { { const FL = MISSILE.userData.flame; if (FL) { FL.scale.set(1 + .18 * Math.sin(t * 47) + .1 * Math.sin(t * 83), 1 + .08 * Math.sin(t * 61), 1 + .08 * Math.sin(t * 61)); }
      (MISSILE.userData.puffs || []).forEach((p, i) => { const k = ((i / 14) + t * 1.7) % 1, r = .18 + k * .9; p.position.set(-3.0 - k * 9, Math.sin(i * 1.7) * .15 * k, Math.cos(i * 2.3) * .15 * k); p.scale.setScalar(r); p.material.opacity = .5 * (1 - k); }); } waterM.uniforms.time.value = t; gradeMat.uniforms.time.value = t % 10; FAN.rotation.y = t * 2.2; const p = usF.attributes.position; if (!usF.userData.b) usF.userData.b = p.array.slice(); const b = usF.userData.b; for (let k = 0; k < p.count; k++) { const x = b[k * 3] + .65; p.setZ(k, Math.sin(x * 4 - t * 4) * .05 * x); } p.needsUpdate = true; redLamp.material.color.set(Math.sin(t * 6) > 0 ? '#ff4a3a' : '#7a1a14'); }
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    const sea = pos.x < -400, lab = Math.abs(pos.x) < 20; SUN = sea ? SUN_SEA : SUN_LAB; scene.fog.density = sea ? .0011 : 0;
    const anchor = lab ? new T.Vector3(0, 1, 0) : look; sun.position.copy(anchor).addScaledVector(SUN, sea ? 200 : 40); sun.target.position.copy(anchor); sun.target.updateMatrixWorld();
    const sz = sea ? 90 : 12; sc.left = -sz; sc.right = sz; sc.top = sz; sc.bottom = -sz; sc.updateProjectionMatrix(); sun.intensity = sea ? 4.6 : (lab ? 6.2 : 2.4); hemi.intensity = sea ? 1.5 : (lab ? 1.75 : 1.35); R.toneMappingExposure = lab ? 1.32 : 1.2; noseLight.intensity = 3.0;
    const zone = sea ? 'sea' : lab ? 'lab' : Math.abs(pos.x - NX) < 20 ? 'nose' : Math.abs(pos.x - MX) < 20 ? 'meet' : 'stage';
    if (zone !== curZone) { curZone = zone; scene.traverse(o => { if ((o.isPointLight || o.isSpotLight) && o.userData.zone) o.visible = o.userData.zone === zone; }); }
    ao.enabled = !sea && !window.__NOAO; dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  // cada luz puntual pertenece a su zona (encender todas a la vez multiplica el coste por fotograma)
  let curZone = null; const zoneOf = v => v.x < -400 ? 'sea' : Math.abs(v.x) < 20 ? 'lab' : Math.abs(v.x - NX) < 20 ? 'nose' : Math.abs(v.x - MX) < 20 ? 'meet' : 'stage';
  scene.updateMatrixWorld(true); scene.traverse(o => { if (o.isPointLight || o.isSpotLight) o.userData.zone = zoneOf(o.getWorldPosition(new T.Vector3())); });
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && o.material !== inkM && o !== sky && o !== water && !o.material.transparent && o.material.side !== T.BackSide && !o.userData.noInk) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  return { SCR_TEX: scrT, NOSE_PORTS, CAGES, ao, visible, T, scene, camera, R, setCam, setTime, proj, render, get SUN() { return SUN; }, dof, bloom, comp, inkM, setScreen: drawScreen, PIGEONHOLES, TRAIN, TRAIN_SCR, NOSE_LAB, NOSE, NX, STATIONS, MEET, MX, STAGE, SX, TROPHY, SHIP, MISSILE, MISSILE_PORTS, SEAX, LX, LZ, mid: () => 0, hgt: () => 0 };
})();

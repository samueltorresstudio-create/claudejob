// World «Akiya»: pueblo de montaña japonés con casas vacías (69 · Casas gratis en Japón). Misma API que world3d.js (W2).
// Zonas:
//   PUEBLO (x ∈ [-70, 70], carretera a lo largo de x en z = 8): casa del regalo (HOUSE, frente en z = -1.5), casa de la vecina (x = 15),
//     casas abandonadas a los lados y enfrente, muro de piedra, cuneta con rejilla, postes con cables, espejo de curva, máquina expendedora,
//     buzón, bambú, caquis, arrozales en terrazas, valle lleno de casitas (vista de dron) y montes con cedros.
//   PARADA (x = -260, z = 80): parada de autobús sola entre arrozales infinitos.
//   INTERIOR (x = 400): genkan con zapatillas + sala de tatami (mesa baja con tazas y periódico de 2003, altar con retrato, reloj parado…).
// Lazo de regalo: W2.setGift(k, t) (0 = no está; 1 = puesto) con etiqueta «¥0».
window.GLC = document.getElementById("gl");
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.2; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, W / H, .05, 3000);
  const rnd = (() => { let s = 6969; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const tex = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const STD = o => new T.MeshStandardMaterial(Object.assign({ roughness: .85, metalness: 0 }, o));
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.s) m.scale.set(...o.s); m.castShadow = o.cast !== false; m.receiveShadow = true; (o.parent || scene).add(m); if (o.noInk) m.userData.noInk = true; if (o.zone) m.userData.zone = o.zone; return m; };
  const RB = (w, h, d, r = .05) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001));
  const noise = (g, w, h, n, cols, sz = [1, 3]) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const s = sz[0] + rnd() * (sz[1] - sz[0]); g.fillRect(rnd() * w, rnd() * h, s, s); } };
  const blot = (g, w, h, n, col, r0, r1) => { for (let i = 0; i < n; i++) { const x = rnd() * w, y = rnd() * h, r = r0 + rnd() * (r1 - r0); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); } };
  const strokes = (g, w, h, n, cols, len = [6, 18], lw = [1, 3]) => { for (let i = 0; i < n; i++) { g.strokeStyle = cols[i % cols.length]; g.lineWidth = lw[0] + rnd() * (lw[1] - lw[0]); const x = rnd() * w, y = rnd() * h, a = rnd() * 6.28, L = len[0] + rnd() * (len[1] - len[0]); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); } };
  const mixHex = (a, b, t) => { const A = new T.Color(a), B = new T.Color(b); return '#' + A.lerp(B, t).getHexString(); };
  const JP = '"IPAGothic","Noto Sans CJK JP","Noto Sans JP",sans-serif';

  // ---------- cielo (día / atardecer / noche) y luz ----------
  const SUN = new T.Vector3(-.45, .6, .66).normalize();
  const skyU = { sun: { value: SUN }, morn: { value: 0 }, night: { value: 0 } };
  const sky = new T.Mesh(new T.SphereGeometry(2400, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform vec3 sun; uniform float morn, night; varying vec3 vd; float h1(vec3 p){ return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453); }
      void main(){ float h=vd.y; vec3 top=mix(vec3(.18,.47,.9),vec3(.36,.38,.72),morn), mid=mix(vec3(.52,.75,.97),vec3(.98,.66,.52),morn), hor=mix(vec3(.88,.93,.95),vec3(1.,.82,.6),morn);
      vec3 c=h>.08?mix(mid,top,smoothstep(.08,.65,h)):mix(hor,mid,smoothstep(-.05,.08,h)); float s=max(dot(vd,sun),0.); c+=vec3(1.,.9,.7)*(pow(s,10.)*(.18+morn*.5));
      vec3 nt=mix(vec3(.10,.16,.32),vec3(.03,.05,.14),smoothstep(0.,.6,h)); vec3 cell=floor(vd*380.); float st=step(.9975,h1(cell))*smoothstep(.05,.3,h); nt+=vec3(.9,.92,1.)*st;
      float m=max(dot(vd,normalize(vec3(.5,.45,-.74))),0.); nt+=vec3(1.,.97,.85)*smoothstep(.9993,.9996,m)+vec3(.35,.42,.6)*pow(m,60.)*.6; c=mix(c,nt,night); gl_FragColor=vec4(c,1.); }` }));
  sky.frustumCulled = false; scene.add(sky);
  scene.fog = new T.FogExp2('#d6e6ee', .0036);
  const hemi = new T.HemisphereLight('#d2e6ff', '#7c8a4e', 1.5); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff0d4', 4.4); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  const sc = sun.shadow.camera; sc.left = -30; sc.right = 30; sc.top = 30; sc.bottom = -30; sc.near = 1; sc.far = 320; sun.shadow.bias = -.0004; sun.shadow.normalBias = .05; scene.add(sun, sun.target);
  const cloudM = STD({ color: '#ffffff', roughness: 1, emissive: '#7d8fa8', emissiveIntensity: .28 });
  const CLOUDS = [];
  for (let i = 0; i < 16; i++) { const g = new T.Group(), a = -Math.PI * .95 + i / 16 * Math.PI * .9, r = 420 + (i % 3) * 110; g.position.set(Math.cos(a) * r, 110 + (i % 4) * 24, Math.sin(a) * r); scene.add(g); CLOUDS.push([g, g.position.clone()]);
    for (let k = 0; k < 7; k++) { const m = add(new T.SphereGeometry(14 + (k % 3) * 8, 18, 12), cloudM, (k - 3) * 13, (k % 2) * 8 - 2 + (k === 3 ? 10 : 0), (k % 3) * 6, { parent: g, cast: false, noInk: true }); m.scale.y = .72; } }

  // ---------- texturas ----------
  const grassT = tex(512, 512, (g, w, h) => { g.fillStyle = '#6ea64a'; g.fillRect(0, 0, w, h); noise(g, w, h, 30000, ['#5d9440', '#80bb58', '#4f8436', '#93cc66'], [1, 4]); strokes(g, w, h, 2600, ['rgba(40,80,20,.35)', 'rgba(170,220,120,.35)'], [5, 12], [1, 2]); blot(g, w, h, 30, 'rgba(0,0,0,.08)', 30, 90); blot(g, w, h, 20, 'rgba(255,255,200,.07)', 30, 90); }, [70, 70]);
  const wildT = tex(512, 512, (g, w, h) => { g.fillStyle = '#7a9a48'; g.fillRect(0, 0, w, h); noise(g, w, h, 30000, ['#6a8a3c', '#9ab85a', '#5a7a30', '#b8b070'], [1, 4]); strokes(g, w, h, 4000, ['rgba(50,70,20,.45)', 'rgba(200,210,120,.4)', 'rgba(150,120,60,.35)'], [8, 20], [1, 3]); }, [6, 6]);
  const roadT = tex(256, 1024, (g, w, h) => { g.fillStyle = '#8a8c90'; g.fillRect(0, 0, w, h); noise(g, w, h, 18000, ['#7a7c81', '#a0a2a7', '#6c6e73'], [1, 3]); blot(g, w, h, 30, 'rgba(40,40,40,.12)', 10, 40); g.fillStyle = '#f2f0e8'; g.fillRect(12, 0, 7, h); g.fillRect(w - 19, 0, 7, h);
    g.strokeStyle = 'rgba(30,30,30,.35)'; g.lineWidth = 2; for (let i = 0; i < 6; i++) { let x = rnd() * w, y = rnd() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += rnd() * 30 - 15; y += 20 + rnd() * 20; g.lineTo(x, y); } g.stroke(); } }, [1, 40]);
  const dirtT = tex(512, 512, (g, w, h) => { g.fillStyle = '#b09a78'; g.fillRect(0, 0, w, h); noise(g, w, h, 30000, ['#9c8664', '#c2ad88', '#8c7656', '#d0bc98'], [1, 4]); blot(g, w, h, 40, 'rgba(60,40,20,.12)', 20, 80); }, [2, 2]);
  const woodT = tex(256, 128, (g, w, h) => { g.fillStyle = '#7a5434'; g.fillRect(0, 0, w, h); for (let i = 0; i < 26; i++) { g.strokeStyle = `rgba(40,24,12,${.2 + rnd() * .3})`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const y = rnd() * h; g.moveTo(0, y); g.bezierCurveTo(w * .3, y + rnd() * 6 - 3, w * .6, y + rnd() * 6 - 3, w, y); g.stroke(); } blot(g, w, h, 6, 'rgba(0,0,0,.15)', 10, 30); });
  const darkWoodT = tex(256, 256, (g, w, h) => { g.fillStyle = '#4a3324'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 32) { g.fillStyle = `rgba(${20 + rnd() * 30},${12 + rnd() * 20},8,.35)`; g.fillRect(x, 0, 32, h); g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x, 0, 3, h); }
    for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(20,10,4,${.2 + rnd() * .3})`; g.lineWidth = 1; g.beginPath(); const x = rnd() * w; g.moveTo(x, 0); g.bezierCurveTo(x + rnd() * 6 - 3, h * .3, x + rnd() * 6 - 3, h * .6, x, h); g.stroke(); } });
  // tablas oscuras (yakisugi) envejecidas con verdín para las casas abandonadas
  const oldWoodT = tex(256, 256, (g, w, h) => { g.fillStyle = '#5a4634'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 32) { g.fillStyle = `rgba(${60 + rnd() * 40},${50 + rnd() * 30},${30 + rnd() * 20},.5)`; g.fillRect(x, 0, 32, h); g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(x, 0, 3, h); }
    blot(g, w, h, 16, 'rgba(110,130,60,.35)', 14, 50); blot(g, w, h, 10, 'rgba(200,190,170,.25)', 10, 40); noise(g, w, h, 3000, ['rgba(0,0,0,.25)', 'rgba(255,255,255,.08)']); });
  const plaster = (base, dirt) => tex(512, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); noise(g, w, h, 6000, ['rgba(0,0,0,.05)', 'rgba(255,255,255,.08)']); blot(g, w, h, 12, 'rgba(120,100,80,.10)', 30, 100);
    if (dirt) { const gr = g.createLinearGradient(0, h, 0, h * .55); gr.addColorStop(0, 'rgba(70,60,40,.55)'); gr.addColorStop(1, 'rgba(70,60,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 14; i++) { g.strokeStyle = 'rgba(60,50,40,.35)'; g.lineWidth = 2; g.beginPath(); let x = rnd() * w, y = rnd() * h * .5; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += rnd() * 30 - 15; y += 12 + rnd() * 14; g.lineTo(x, y); } g.stroke(); } blot(g, w, h, 10, 'rgba(90,110,50,.25)', 20, 60); } });
  const plasterT = plaster('#efe7d6', false), plasterOldT = plaster('#d9cfba', true);
  const kawaraT = (base, old) => tex(256, 256, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 16) { const gr = g.createLinearGradient(x, 0, x + 16, 0); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(.5, 'rgba(255,255,255,.18)'); gr.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = gr; g.fillRect(x, 0, 16, h); }
    g.fillStyle = 'rgba(0,0,0,.28)'; for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 4); if (old) { blot(g, w, h, 18, 'rgba(120,140,70,.4)', 10, 40); blot(g, w, h, 8, 'rgba(160,120,80,.3)', 8, 24); for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(20,20,20,.55)'; g.fillRect(Math.floor(rnd() * 16) * 16, Math.floor(rnd() * 8) * 32, 16, 28); } } });
  const roofT = kawaraT('#46546a', false), roofOldT = kawaraT('#5a6070', true), roofBrownT = kawaraT('#7a4e3a', true), roofBlueT = kawaraT('#3e5f86', false);
  // ventana corredera con celosía (shōji detrás del cristal)
  const winT = (shut) => tex(256, 256, (g, w, h) => { if (shut) { g.fillStyle = '#6a5440'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 22) { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(x, 0, 3, h); } blot(g, w, h, 8, 'rgba(110,130,60,.3)', 10, 30); g.strokeStyle = '#2a1e14'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); return; }
    g.fillStyle = '#3b2a1e'; g.fillRect(0, 0, w, h); g.fillStyle = '#f3ecd8'; g.fillRect(10, 10, w - 20, h - 20); g.strokeStyle = '#3b2a1e'; g.lineWidth = 5; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(10 + k * (w - 20) / 4, 10); g.lineTo(10 + k * (w - 20) / 4, h - 10); g.stroke(); } for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(10, 10 + k * (h - 20) / 5); g.lineTo(w - 10, 10 + k * (h - 20) / 5); g.stroke(); }
    g.lineWidth = 9; g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(14, h * .7); g.lineTo(w * .4, 14); g.lineTo(w * .55, 14); g.lineTo(14, h * .9); g.fill(); });
  const winOpenT = winT(false), winShutT = winT(true);
  const stoneT = tex(512, 256, (g, w, h) => { g.fillStyle = '#8f8a80'; g.fillRect(0, 0, w, h); for (let i = 0; i < 70; i++) { const x = rnd() * w, y = rnd() * h, rx = 20 + rnd() * 30, ry = 14 + rnd() * 18; g.fillStyle = ['#a8a296', '#9a948a', '#b4ae9f', '#8a8478'][i % 4]; g.beginPath(); g.ellipse(x, y, rx, ry, rnd(), 0, 7); g.fill(); g.strokeStyle = 'rgba(40,36,30,.6)'; g.lineWidth = 3; g.stroke(); }
    blot(g, w, h, 14, 'rgba(90,120,50,.35)', 14, 40); }, [3, 1]);
  const concT = tex(256, 256, (g, w, h) => { g.fillStyle = '#b4b0a6'; g.fillRect(0, 0, w, h); noise(g, w, h, 9000, ['#a29e94', '#c4c0b6', '#94908a'], [1, 3]); blot(g, w, h, 10, 'rgba(60,70,40,.18)', 10, 40); }, [4, 1]);

  // ---------- suelo y terreno ----------
  const hgt = (x, z) => { const back = Math.max(0, -z - 46), side = Math.max(0, Math.abs(x) - 95), front = Math.max(0, z - 70); let y = Math.min(80, back * .42 + side * .2 + front * .12);
    y *= (.75 + .25 * Math.sin(x * .021 + z * .013)); return y + (Math.sin(x * .07) + Math.cos(z * .05)) * .2 * Math.min(1, (Math.abs(z - 8) + Math.abs(x)) / 40); };
  const flat = (x, z) => (x > -75 && x < 75 && z > -40 && z < 60) || (x > -330 && x < -190 && z > 20 && z < 150) || (x > 360 && x < 440 && z > -30 && z < 30);
  const ground = new T.PlaneGeometry(1800, 1800, 180, 180); ground.rotateX(-Math.PI / 2);
  { const p = ground.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, flat(x, z) ? 0 : hgt(x, z)); } ground.computeVertexNormals(); }
  add(ground, STD({ map: grassT, roughness: 1 }), 0, 0, 0, { cast: false, noInk: true });
  // carretera del pueblo (a lo largo de x, z = 8) con cuneta de hormigón y rejillas
  add(new T.PlaneGeometry(5.6, 150), STD({ map: roadT }), 0, .012, 8, { rx: -Math.PI / 2, rz: Math.PI / 2, cast: false, noInk: true });
  add(RB(150, .35, .55, .03), STD({ map: concT }), 0, -.1, 5, { cast: false }); add(new T.PlaneGeometry(150, .32), STD({ color: '#3a3a36', roughness: .3 }), 0, .02, 5, { rx: -Math.PI / 2, cast: false, noInk: true });
  for (let x = -72; x < 72; x += 4.5) add(RB(.9, .04, .5, .01), STD({ color: '#3d3f44', metalness: .5, roughness: .5 }), x, .09, 5, {});
  // ---------- bloques de vegetación (instanciados): matojos, hierba alta, arbustos ----------
  const dm = new T.Object3D();
  function instanced(geo, mat, list, setup) { const im = new T.InstancedMesh(geo, mat, list.length); list.forEach((p, i) => { setup(dm, p, i); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); }); im.castShadow = true; im.receiveShadow = true; im.userData.noInk = true; scene.add(im); return im; }
  const WEEDS = [], BUSH = [];
  const weedPatch = (x0, x1, z0, z1, n, hmin = .4, hmax = 1.1) => { for (let i = 0; i < n; i++) WEEDS.push([x0 + rnd() * (x1 - x0), z0 + rnd() * (z1 - z0), hmin + rnd() * (hmax - hmin), rnd() * 6]); };
  const bushAt = (x, z, s, col) => BUSH.push([x, z, s, col]);

  // ---------- casa japonesa (kominka) con tejado de cuatro aguas de tejas ----------
  function hipRoof(w, d, rise, ov) { const W2_ = w / 2 + ov, D2 = d / 2 + ov, r = Math.max(.2, W2_ - D2), g = new T.BufferGeometry();
    const v = [[-W2_, 0, D2], [W2_, 0, D2], [r, rise, 0], [-r, rise, 0], [W2_, 0, -D2], [-W2_, 0, -D2]];
    const tri = [[0, 1, 2], [0, 2, 3], [4, 5, 3], [4, 3, 2], [1, 4, 2], [5, 0, 3]], pos = [], uv = [];
    tri.forEach(t => t.forEach(i => { pos.push(...v[i]); uv.push((v[i][0] + W2_) / 4, (Math.abs(v[i][2]) + v[i][1]) / 2.5); }));
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.computeVertexNormals(); return g; }
  const MAT = { plaster: STD({ map: plasterT }), plasterOld: STD({ map: plasterOldT }), dark: STD({ map: darkWoodT }), old: STD({ map: oldWoodT }), winO: STD({ map: winOpenT, roughness: .5 }), winS: STD({ map: winShutT }),
    stone: STD({ map: stoneT, roughness: .95 }), ridge: STD({ color: '#2f3846', roughness: .5, metalness: .2 }) };
  const HOUSES = [];
  function kominka(x, z, ry, o = {}) { const w = o.w || 10, d = o.d || 7.5, wh = o.wh || 3.1, old = !!o.old, g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
    add(RB(w + .3, .45, d + .3, .04), MAT.stone, 0, .22, 0, { parent: g });                                          // basamento de piedra
    // muros: madera oscura abajo, yeso arriba, con pilares
    add(RB(w, wh * .45, d, .03), old ? MAT.old : MAT.dark, 0, .45 + wh * .225, 0, { parent: g });
    add(RB(w - .02, wh * .55, d - .02, .03), old ? MAT.plasterOld : MAT.plaster, 0, .45 + wh * .45 + wh * .275, 0, { parent: g });
    for (let k = 0; k <= 4; k++) [-1, 1].forEach(sd => add(RB(.2, wh, .2, .02), MAT.dark, -w / 2 + k * w / 4, .45 + wh / 2, sd * (d / 2 + .02), { parent: g }));
    add(RB(w + .1, .2, d + .1, .02), MAT.dark, 0, .45 + wh * .45, 0, { parent: g });
    // ventanas laterales del frente (abiertas o con contraventanas) y puerta corredera de entrada (genkan) a la derecha
    const fz = d / 2 + .03;
    [-w * .3, -w * .05].forEach(wx => add(new T.PlaneGeometry(w * .2, wh * .5), old ? MAT.winS : MAT.winO, wx, .45 + wh * .5, fz, { parent: g, cast: false, noInk: true }));
    const door = new T.Group(); door.position.set(w * .27, .45, fz + .02); g.add(door);
    add(RB(2.3, 2.35, .14, .02), MAT.dark, 0, 1.18, -.04, { parent: door });                                          // marco
    const leafM = STD({ map: tex(128, 256, (gg, ww, hh) => { gg.fillStyle = '#3b2a1e'; gg.fillRect(0, 0, ww, hh); gg.fillStyle = old ? '#b9b2a0' : '#d9e6ec'; gg.fillRect(10, 10, ww - 20, hh - 20); gg.strokeStyle = '#3b2a1e'; gg.lineWidth = 6; for (let k = 1; k < 6; k++) { gg.beginPath(); gg.moveTo(10, 10 + k * (hh - 20) / 6); gg.lineTo(ww - 10, 10 + k * (hh - 20) / 6); gg.stroke(); } gg.beginPath(); gg.moveTo(ww / 2, 10); gg.lineTo(ww / 2, hh - 10); gg.stroke(); if (old) blot(gg, ww, hh, 6, 'rgba(80,70,50,.35)', 10, 30); }), roughness: .4 });
    const leafL = add(RB(1.05, 2.1, .06, .01), leafM, -.52, 1.1, .02, { parent: door }), leafR = add(RB(1.05, 2.1, .06, .01), leafM, .52, 1.1, .06, { parent: door });
    const dark = add(new T.PlaneGeometry(2.0, 2.05), STD({ color: '#120c08', roughness: 1 }), 0, 1.1, -.02, { parent: door, cast: false, noInk: true });
    // marquesina sobre la puerta y escalón de piedra
    add(RB(3.2, .12, 1.3, .02), STD({ map: old ? roofOldT : roofT }), 0, 2.65, .5, { parent: door, rx: .28 });
    add(RB(2.4, .18, .9, .05), MAT.stone, 0, -.36, .55, { parent: door });
    // tejado
    const rise = o.rise || 2.6, base = .45 + wh;
    add(hipRoof(w, d, rise, .95), STD({ map: o.roofT || (old ? roofOldT : roofT), roughness: .55, metalness: .15, side: T.DoubleSide }), 0, base, 0, { parent: g });
    add(RB(w + 1.9, .16, d + 1.9, .04), MAT.dark, 0, base - .02, 0, { parent: g });                                    // alero
    const r = Math.max(.2, (w - d) / 2);
    add(RB(2 * r + .7, .32, .44, .1), MAT.ridge, 0, base + rise + .12, 0, { parent: g });                            // cumbrera
    [-1, 1].forEach(sd => add(RB(.45, .55, .5, .1), MAT.ridge, sd * (r + .35), base + rise + .3, 0, { parent: g })); // onigawara
    // engawa (galería) en el lado izquierdo del frente
    if (o.engawa !== false) { add(RB(w * .5, .14, 1.0, .02), STD({ map: woodT, color: '#a07c58' }), -w * .22, .62, d / 2 + .55, { parent: g }); [-w * .46, 0].forEach(px => add(RB(.12, .5, .12, .02), MAT.dark, px, .32, d / 2 + .95, { parent: g })); }
    const H = { g, w, d, wh, door, leafL, leafR, doorDark: dark, front: () => g.localToWorld(new T.Vector3(w * .27, 0, fz + 1.2)), roofTop: base + rise };
    HOUSES.push(H); return H; }

  // ---------- el pueblo ----------
  const HOUSE = kominka(0, -5.4, 0, { w: 10.5, d: 7.6, old: true, roofT: roofOldT });                               // la casa del regalo (abandonada pero bonita)
  const NEIGH = kominka(15.5, -5.2, 0, { w: 8.6, d: 7, roofT: roofBlueT, rise: 2.3 });                             // casa de la vecina (cuidada)
  kominka(-15, -5.8, 0, { w: 9, d: 7, old: true, roofT: roofBrownT, rise: 2.3 });
  kominka(-30, -6.4, .05, { w: 9.5, d: 7.2, old: true });
  kominka(30, -6, -.04, { w: 9, d: 7, old: true, roofT: roofBrownT });
  kominka(46, -7, 0, { w: 10, d: 7.4, old: true });
  kominka(-46, -6.5, 0, { w: 8.5, d: 7, old: true, roofT: roofBlueT });
  [[-24, 21.5], [-8, 22], [9, 21.8], [26, 22.4], [42, 21.6], [-40, 22]].forEach(([x, z], i) => kominka(x, z, Math.PI, { w: 8.5 + (i % 3), d: 7, old: i !== 2, roofT: [roofOldT, roofBrownT, roofBlueT][i % 3], rise: 2.2 }));
  // caminos de losas desde la carretera hasta las puertas
  const slabM = STD({ map: stoneT, color: '#c8c2b4', roughness: .95 }), STEPS = [];
  HOUSES.forEach((H, i) => { const a = H.front(), back = H.g.rotation.y > 1; const z0 = a.z, z1 = back ? 10.6 : 4.6; const n = Math.max(2, Math.round(Math.abs(z1 - z0) / .8));
    for (let k = 0; k < n; k++) { const z = lerp(z0, z1, (k + .5) / n), x = a.x + Math.sin(k * 1.7 + i) * .18; const m = add(new T.CylinderGeometry(.42 + rnd() * .1, .45, .1, 9), slabM, x, .05, z, { ry: rnd() * 3 }); m.scale.set(1, 1, .8); if (i === 0) STEPS.push(V3(x, .1, z)); } });
  // muros de piedra bajos (ishigaki) delante de las casas, con hueco para el camino
  HOUSES.forEach(H => { const back = H.g.rotation.y > 1, cx = H.g.position.x, zz = back ? 12.4 : 3.6, gx = H.front().x; [[cx - 6.2, gx - 1.1], [gx + 1.1, cx + 6.2]].forEach(([a, b]) => { if (b - a < .5) return; add(RB(b - a, .75, .6, .08), MAT.stone, (a + b) / 2, .37, zz); add(RB(b - a, .08, .62, .03), STD({ color: '#7a7468' }), (a + b) / 2, .78, zz); }); });
  // maleza en las casas abandonadas y jardín cuidado en la de la vecina
  HOUSES.forEach((H, i) => { if (H === NEIGH) return; const cx = H.g.position.x, back = H.g.rotation.y > 1, z0 = back ? 13 : -1.6, z1 = back ? 17 : 3.3; weedPatch(cx - 6, cx - 1.6, z0, z1, 150, .3, 1.2); weedPatch(cx + 4.6, cx + 6, z0, z1, 50, .3, 1.0); });
  weedPatch(-70, 70, 13.2, 14.2, 300, .15, .45);
  // jardín de la vecina: arbustos podados, faroles de piedra, macetas, tendedero, bici
  const toro = (x, z, s = 1) => { const m = STD({ color: '#9a958a', roughness: .95 }), g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g); add(RB(.5, .2, .5, .04), m, 0, .1, 0, { parent: g }); add(new T.CylinderGeometry(.09, .11, .8, 8), m, 0, .6, 0, { parent: g }); add(RB(.42, .1, .42, .03), m, 0, 1.03, 0, { parent: g });
    const lamp = add(RB(.34, .32, .34, .03), STD({ color: '#d9d2c0', emissive: '#ffcf7a', emissiveIntensity: .1 }), 0, 1.24, 0, { parent: g }); add(new T.ConeGeometry(.38, .28, 4), m, 0, 1.54, 0, { parent: g, ry: Math.PI / 4 }); add(new T.SphereGeometry(.07, 8, 6), m, 0, 1.72, 0, { parent: g }); return lamp; };
  const LAMPS = [toro(12.2, 2.2), toro(-3.9, 2.4, .9)];
  [[11.2, 1.2], [19.6, 1.4], [20.3, -.6]].forEach(([x, z]) => bushAt(x, z, .7, '#3f7f33'));
  [[13.6, 3.0, '#c8302e'], [17.6, 3.0, '#f2c53a'], [18.6, 3.0, '#e86aa0'], [12.6, 3.0, '#f6f3ec']].forEach(([x, z, c]) => { add(new T.CylinderGeometry(.2, .15, .32, 10), STD({ color: '#b0643a' }), x, .16, z); add(new T.IcosahedronGeometry(.24, 1), STD({ color: '#4f8f3a', flatShading: true }), x, .45, z); for (let k = 0; k < 4; k++) add(new T.SphereGeometry(.06, 6, 5), STD({ color: c }), x + Math.cos(k * 1.6) * .16, .58, z + Math.sin(k * 1.6) * .16, { noInk: true }); });
  { const lx = 20.6, lz = -1.4; [-1.2, 1.2].forEach(dx => add(new T.CylinderGeometry(.04, .04, 2, 6), STD({ color: '#8a8478' }), lx + dx, 1, lz)); add(new T.CylinderGeometry(.03, .03, 2.5, 6), STD({ color: '#c9ced6', metalness: .4 }), lx, 1.95, lz, { rz: Math.PI / 2 });
    [['#c8302e', -.9, .55], ['#f6f3ec', -.3, .7], ['#2f6fbf', .3, .5], ['#f2c53a', .9, .45]].forEach(([c, dx, h]) => add(RB(.5, h, .03, .01), STD({ color: c, roughness: .9 }), lx + dx, 1.92 - h / 2, lz, { ry: .1 })); }
  const bike = (x, z, ry, col, rust) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g); const fm = STD({ color: col, metalness: .4, roughness: rust ? .9 : .4 });
    [-.55, .55].forEach(bx => { add(new T.TorusGeometry(.33, .03, 6, 24), STD({ color: '#1b1b1f' }), bx, .35, 0, { parent: g }); });
    add(new T.CylinderGeometry(.025, .025, 1.1, 6), fm, 0, .55, 0, { parent: g, rz: Math.PI / 2 }); add(new T.CylinderGeometry(.025, .025, .6, 6), fm, -.1, .65, 0, { parent: g, rz: .5 }); add(RB(.22, .06, .1, .02), STD({ color: '#1b1b1f' }), -.2, .9, 0, { parent: g });
    add(new T.CylinderGeometry(.02, .02, .5, 6), fm, .5, .75, 0, { parent: g, rz: -.3 }); add(new T.CylinderGeometry(.02, .02, .5, 6), fm, .58, .98, 0, { parent: g, rx: Math.PI / 2 }); add(RB(.32, .2, .26, .03), STD({ color: '#c9ced6', metalness: .4 }), .72, .78, 0, { parent: g }); return g; };
  bike(19.4, 2.2, .25, '#d9dde3', false); bike(-12.4, 1.8, -.3, '#8a5a3a', true);
  // ---------- casa del regalo: detalles del abandono ----------
  { const hx = HOUSE.g.position.x, fz = -5.4 + 3.8;
    add(RB(.42, .5, .25, .05), STD({ color: '#b8462e', roughness: .9 }), 4.2, 1.35, fz + .2);                       // buzón oxidado con propaganda
    [0, 1, 2].forEach(k => add(RB(.3, .02, .2, .005), STD({ color: ['#f6f3ec', '#f2c53a', '#9fd0f0'][k] }), 4.18 + k * .03, 1.62 + k * .015, fz + .2 + k * .02, { rz: .2 - k * .15, noInk: true }));
    add(new T.CylinderGeometry(.03, .03, 1.1, 6), STD({ color: '#4a4440' }), 4.2, .55, fz + .2);
    // macetas rotas y una regadera tirada
    [[-2.2, fz + 1.2], [-1.4, fz + 1.4]].forEach(([x, z], k) => { add(new T.CylinderGeometry(.22, .17, .34, 10), STD({ color: '#a8603a' }), hx + x, .17, z, { rz: k ? 1.4 : 0 }); });
    add(new T.CylinderGeometry(.14, .16, .3, 10), STD({ color: '#5a8a9a', metalness: .3 }), hx - .8, .14, fz + 2.1, { rz: 1.57, ry: .6 });
    // caqui viejo al lado
  }
  // ---------- árboles: caquis, pinos de jardín, bambú ----------
  const tree = (x, z, s, fruit, col) => { const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g); add(new T.CylinderGeometry(.18, .3, 2.6, 8), STD({ color: '#6e4a2c' }), 0, 1.3, 0, { parent: g });
    for (let k = 0; k < 6; k++) add(new T.IcosahedronGeometry(1 + rnd() * .5, 2), STD({ color: col || ['#4f8f3a', '#5fa346', '#3f7f33'][k % 3], roughness: .95 }), (rnd() - .5) * 2, 3 + rnd() * 1.2, (rnd() - .5) * 2, { parent: g });
    if (fruit) for (let k = 0; k < 16; k++) { const a = rnd() * 6.28, r = 1.3 + rnd() * .5; add(new T.SphereGeometry(.13, 10, 8), STD({ color: '#f2862a', roughness: .5 }), Math.cos(a) * r, 2.8 + rnd() * 1.6, Math.sin(a) * r, { parent: g }); } return g; };
  const pine = (x, z, s) => { const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g); add(new T.CylinderGeometry(.14, .22, 2.4, 7), STD({ color: '#5a3e2a' }), 0, 1.2, 0, { parent: g, rz: .12 });
    [[0, 2.5, 0, 1.2], [.9, 2.0, .2, .9], [-.7, 2.9, -.1, .8], [.2, 3.3, .1, .7]].forEach(([dx, y, dz, r]) => add(new T.SphereGeometry(r, 12, 8), STD({ color: '#2f6a3a', roughness: .95, flatShading: true }), dx, y, dz, { parent: g, s: [1.4, .45, 1.1] })); return g; };
  tree(-6.6, -1.4, 1.05, true); tree(-21, -1.6, .9, true); tree(25, -2, .95, false); pine(9.6, -1.2, .95); pine(11.6, 1.6, .7); tree(37, -1.8, 1, true); tree(-37, -2.2, 1.1, false);
  const BAMBOO = []; for (let i = 0; i < 90; i++) BAMBOO.push([-60 + rnd() * 12, -14 - rnd() * 10, 6 + rnd() * 5]); for (let i = 0; i < 70; i++) BAMBOO.push([52 + rnd() * 14, -13 - rnd() * 8, 6 + rnd() * 5]);
  instanced(new T.CylinderGeometry(.06, .07, 1, 6), STD({ color: '#7fae4a', roughness: .6 }), BAMBOO, (o, [x, z, h]) => { o.position.set(x, h / 2, z); o.scale.set(1, h, 1); o.rotation.set((rnd() - .5) * .12, 0, (rnd() - .5) * .12); });
  instanced(new T.ConeGeometry(.9, 2.6, 6), STD({ color: '#6aa040', roughness: .95, flatShading: true }), BAMBOO.filter((_, i) => i % 2 === 0), (o, [x, z, h]) => { o.position.set(x, h - .6, z); o.scale.set(1, 1, 1); o.rotation.set(0, rnd() * 3, 0); });
  // ---------- carretera: postes con cables, espejo de curva, máquina expendedora, buzón rojo, señal ----------
  const poleM = STD({ color: '#8a8478' }), POLES = [];
  for (let x = -66; x <= 66; x += 22) { add(new T.CylinderGeometry(.13, .17, 9, 10), poleM, x, 4.5, 11.4); add(RB(1.8, .12, .12, .03), poleM, x, 8.3, 11.4); add(new T.CylinderGeometry(.2, .2, .55, 10), STD({ color: '#5a5e66' }), x + .45, 7.6, 11.4); POLES.push(x);
    add(RB(.3, .55, .04, .01), STD({ color: '#f2c53a' }), x, 1.7, 11.24, { noInk: true }); }
  for (let i = 0; i < POLES.length - 1; i++) [-.75, .75].forEach(dz => { const a = new T.Vector3(POLES[i] + dz, 8.35, 11.4), b = new T.Vector3(POLES[i + 1] + dz, 8.35, 11.4), m = a.clone().lerp(b, .5); m.y -= .7;
    add(new T.TubeGeometry(new T.QuadraticBezierCurve3(a, m, b), 20, .016, 4), STD({ color: '#1b1720' }), 0, 0, 0, { cast: false, noInk: true }); });
  // espejo de curva naranja (detalle muy japonés)
  { const mx = -9.4, mz = 11.2; add(new T.CylinderGeometry(.06, .06, 3, 8), STD({ color: '#f08a24' }), mx, 1.5, mz); const mg = new T.Group(); mg.position.set(mx, 3.2, mz - .1); mg.rotation.y = .5; scene.add(mg);
    add(new T.CylinderGeometry(.48, .48, .1, 24), STD({ color: '#f08a24' }), 0, 0, 0, { parent: mg, rx: Math.PI / 2 }); add(new T.CircleGeometry(.4, 24), STD({ color: '#cfe6f2', roughness: .05, metalness: .8 }), 0, 0, -.06, { parent: mg, ry: Math.PI, cast: false, noInk: true }); }
  const vmT = tex(256, 512, (g, w, h) => { g.fillStyle = '#e8eef2'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8302e'; g.fillRect(0, 0, w, 60); g.fillStyle = '#fff'; g.font = `900 34px ${JP}`; g.textAlign = 'center'; g.fillText('つめた〜い', w / 2, 44);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { g.fillStyle = ['#c8302e', '#2fa05a', '#f2c53a', '#2f6fbf', '#8a4a2a'][(r + c) % 5]; g.fillRect(16 + c * 46, 84 + r * 92, 30, 62); g.fillStyle = '#2f6fbf'; g.fillRect(14 + c * 46, 150 + r * 92, 34, 12); }
    g.fillStyle = '#1b1720'; g.fillRect(30, 380, 190, 70); g.fillStyle = '#9aa3ad'; g.fillRect(200, 300, 30, 50); });
  const VM = add(RB(1.1, 1.85, .8, .05), [STD({ color: '#d9dde3' }), STD({ color: '#d9dde3' }), STD({ color: '#d9dde3' }), STD({ color: '#d9dde3' }), STD({ map: vmT, emissive: '#ffffff', emissiveMap: vmT, emissiveIntensity: .2 }), STD({ color: '#d9dde3' })], 7.2, .93, 3.9);
  add(RB(.5, .9, .4, .1), STD({ color: '#c8302e' }), 24.2, 1.1, 3.9); add(new T.CylinderGeometry(.06, .06, .7, 8), STD({ color: '#3a3e46' }), 24.2, .35, 3.9);
  // pequeño santuario (hokora) con torii rojo entre las casas de enfrente
  { const tx = 1.2, tz = 15.4, rM = STD({ color: '#d2402e', roughness: .6 }); [-.75, .75].forEach(dx => add(new T.CylinderGeometry(.08, .09, 2.1, 10), rM, tx + dx, 1.05, tz)); add(RB(2.2, .14, .2, .03), rM, tx, 2.12, tz); add(RB(2.6, .12, .26, .03), STD({ color: '#1b1720' }), tx, 2.3, tz); add(RB(1.7, .1, .14, .02), rM, tx, 1.8, tz);
    add(RB(.8, .7, .6, .05), STD({ map: woodT }), tx, .55, tz + 1.4); add(new T.ConeGeometry(.65, .45, 4), STD({ map: roofOldT }), tx, 1.12, tz + 1.4, { ry: Math.PI / 4 }); add(RB(1, .2, .8, .04), MAT.stone, tx, .1, tz + 1.4); }
  // ---------- arrozales en terrazas detrás del pueblo y valle con casitas (dron) ----------
  const paddyM = STD({ color: '#86bccc', roughness: .08, metalness: .45 }), riceM = STD({ color: '#7ccf4f', roughness: .9 }), RICE = [];
  for (let r = 0; r < 4; r++) for (let c = -5; c <= 5; c++) { const x = c * 12.5, z = -20 - r * 9, y = r * .7; add(RB(12, .2, 8.4, .05), STD({ color: '#6a5a3a' }), x, y - .08, z, { noInk: true }); add(new T.PlaneGeometry(11.6, 8), paddyM, x, y + .05, z, { rx: -Math.PI / 2, cast: false, noInk: true });
    for (let k = 0; k < 5; k++) for (let j = 0; j < 8; j++) RICE.push([x - 5 + j * 1.4, y + .25, z - 3.2 + k * 1.6]); }
  // valle: casitas sencillas (instanciadas) desperdigadas por las laderas, muchas abandonadas (tejado marrón, maleza)
  const VALLEY = []; for (let i = 0; i < 260; i++) { const a = rnd(), x = -260 + rnd() * 520, z = -60 - rnd() * 220; if (Math.abs(x) < 80 && z > -70) continue; VALLEY.push([x, hgt(x, z), z, rnd() * 3, .8 + rnd() * .5]); }
  for (let i = 0; i < 70; i++) { const sd = rnd() > .5 ? 1 : -1, x = sd * (85 + rnd() * 140), z = -40 + rnd() * 110; VALLEY.push([x, hgt(x, z), z, rnd() * 3, .8 + rnd() * .4]); }
  const vWall = new T.BoxGeometry(6, 3, 5); vWall.translate(0, 1.5, 0); const vRoof = new T.ConeGeometry(4.6, 2.4, 4); vRoof.rotateY(Math.PI / 4); vRoof.scale(1.25, 1, 1); vRoof.translate(0, 4.2, 0);
  const vWallIM = instanced(vWall, STD({ map: plasterOldT }), VALLEY, (o, [x, y, z, r, s]) => { o.position.set(x, y, z); o.rotation.set(0, r, 0); o.scale.setScalar(s); });
  const roofCols = ['#4e5868', '#7a4e3a', '#5a6070', '#3e5f86', '#6a4a3a'];
  const vRoofIM = instanced(vRoof, STD({ color: '#ffffff', roughness: .6 }), VALLEY, (o, [x, y, z, r, s]) => { o.position.set(x, y, z); o.rotation.set(0, r, 0); o.scale.setScalar(s); });
  VALLEY.forEach((_, i) => vRoofIM.setColorAt(i, new T.Color(roofCols[i % roofCols.length]))); vRoofIM.instanceColor.needsUpdate = true;
  // cedros en los montes y montañas azuladas al fondo
  const CED = []; for (let i = 0; i < 700; i++) { const x = -420 + rnd() * 840, z = -70 - rnd() * 300; CED.push([x, hgt(x, z), z, 2.5 + rnd() * 2.6]); }
  for (let i = 0; i < 260; i++) { const sd = rnd() > .5 ? 1 : -1, x = sd * (90 + rnd() * 200), z = -60 + rnd() * 200; CED.push([x, hgt(x, z), z, 2.4 + rnd() * 2.4]); }
  instanced(new T.ConeGeometry(1, 3, 6), STD({ color: '#2f5a32', roughness: .95, flatShading: true }), CED, (o, [x, y, z, s]) => { o.position.set(x, y + s * 1.4, z); o.scale.set(s * .7, s, s * .7); o.rotation.set(0, 0, 0); });
  [[-200, -560, 260, 210], [60, -640, 340, 260], [300, -520, 240, 190], [-420, -460, 220, 160], [480, -420, 200, 140]].forEach(([x, z, r, h]) => { const c = new T.ConeGeometry(r, h, 9, 3); const p = c.attributes.position; for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) * (1 + (rnd() - .5) * .12)); c.computeVertexNormals(); add(c, STD({ color: '#6a8a96', flatShading: true }), x, h / 2 - 5, z, { noInk: true, cast: false }); });
  instanced(new T.ConeGeometry(.16, .5, 5), riceM, RICE, (o, p) => { o.position.set(...p); o.scale.set(1, 1, 1); o.rotation.set(0, 0, 0); });
  // ---------- PARADA de autobús perdida entre arrozales (x ≈ -260, z ≈ 80) ----------
  const STOP = V3(-260, 0, 84), RICE2 = [];
  add(new T.PlaneGeometry(4.2, 140), STD({ map: roadT }), STOP.x, .012, STOP.z - 3.2, { rx: -Math.PI / 2, rz: Math.PI / 2, cast: false, noInk: true });
  for (let r = -5; r <= 5; r++) for (let c = -5; c <= 5; c++) { if (r === 0 || r === -1) continue; const x = STOP.x + c * 13, z = STOP.z + r * 11 + (r > 0 ? 2 : -6); add(new T.PlaneGeometry(12.4, 10.2), paddyM, x, .04, z, { rx: -Math.PI / 2, cast: false, noInk: true }); add(RB(12.8, .14, 10.6, .04), STD({ color: '#6a5a3a' }), x, -.04, z, { noInk: true, cast: false });
    for (let k = 0; k < 5; k++) for (let j = 0; j < 7; j++) RICE2.push([x - 5 + j * 1.6, .25, z - 4 + k * 2]); }
  instanced(new T.ConeGeometry(.17, .55, 5), riceM, RICE2, (o, p) => { o.position.set(...p); o.scale.set(1, 1, 1); o.rotation.set(0, 0, 0); });
  { const g = new T.Group(); g.position.copy(STOP); scene.add(g); const sm = STD({ map: oldWoodT });
    add(RB(2.6, 2.3, .1, .02), sm, 0, 1.15, -.9, { parent: g }); [-1.3, 1.3].forEach(x => add(RB(.1, 2.3, 1.9, .02), sm, x, 1.15, 0, { parent: g })); add(RB(3.1, .12, 2.3, .03), STD({ map: roofOldT }), 0, 2.4, .05, { parent: g, rx: -.12 });
    add(RB(2.2, .1, .4, .02), STD({ map: woodT }), 0, .48, -.6, { parent: g }); [-.9, .9].forEach(x => add(RB(.08, .45, .35, .02), STD({ color: '#3a3e46' }), x, .24, -.6, { parent: g }));
    add(new T.CylinderGeometry(.05, .05, 2.4, 8), STD({ color: '#d9dde3', metalness: .4 }), 1.9, 1.2, .9, { parent: g }); add(new T.CylinderGeometry(.34, .34, .06, 24), STD({ color: '#2f6fbf' }), 1.9, 2.45, .9, { parent: g, rx: Math.PI / 2 });
    add(RB(.4, .5, .05, .01), STD({ color: '#f6f3ec' }), 1.9, 1.7, .93, { parent: g, noInk: true }); }
  // ---------- INTERIOR (x = 400): genkan + sala de tatami ----------
  const IX = 400, IZ = 0, IY = .6, INT = new T.Group(); INT.position.set(IX, IY, IZ); scene.add(INT);
  add(RB(6.9, IY, 6, .01), STD({ map: woodT, color: '#6a4a30' }), IX + .8, IY / 2 - .02, IZ, { cast: false });   // tarima bajo toda la casa (el interior va elevado, como en las casas japonesas)
  const tatamiT = tex(512, 1024, (g, w, h) => { g.fillStyle = '#c9b77a'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 4) { g.fillStyle = `rgba(${120 + rnd() * 40},${110 + rnd() * 30},50,.25)`; g.fillRect(0, y, w, 2); } blot(g, w, h, 10, 'rgba(90,70,30,.12)', 30, 90);
    g.fillStyle = '#2f3a2a'; g.fillRect(0, 0, 26, h); g.fillRect(w - 26, 0, 26, h); g.fillStyle = 'rgba(255,255,255,.15)'; for (let y = 0; y < h; y += 14) { g.fillRect(4, y, 18, 6); g.fillRect(w - 22, y, 18, 6); } });
  const tatM = STD({ map: tatamiT, roughness: .9 });
  // 6 tatamis (3,6 × 5,4 m) en z ∈ [-2.7, 2.7], x ∈ [-1.8, 1.8] (local) + genkan en x ∈ [1.8, 4.2]
  [[-1.35, -1.8, 0], [-1.35, 0, 0], [-1.35, 1.8, 0], [.45, -1.35, 1], [.45, .45, 1], [.45, 2.25, 0]].forEach(([x, z, r]) => add(RB(r ? 1.8 : .9 * 2 - .02, .06, r ? .9 * 2 - .02 : 1.8, .01), tatM, x, .03, z, { parent: INT, ry: r ? Math.PI / 2 : 0, cast: false, noInk: true }));
  add(RB(4.0, .06, 5.6, .01), tatM, -.45, .02, 0, { parent: INT, cast: false, noInk: true });
  const wallInT = tex(512, 512, (g, w, h) => { g.fillStyle = '#d8c9a6'; g.fillRect(0, 0, w, h); noise(g, w, h, 12000, ['rgba(120,100,60,.12)', 'rgba(255,250,230,.1)'], [1, 3]); blot(g, w, h, 12, 'rgba(110,90,50,.15)', 30, 100); g.fillStyle = 'rgba(80,60,30,.35)'; for (let i = 0; i < 4; i++) g.fillRect(rnd() * w, rnd() * h, 2, 40 + rnd() * 60); });
  const wallInM = STD({ map: wallInT });
  // paredes: fondo (z = -2.8) con tokonoma y altar, izquierda (x = -2.5) con fusuma, derecha = shōji hacia la galería con sol, techo de madera
  add(RB(6.8, 2.6, .12, .01), wallInM, .9, 1.3, -2.86, { parent: INT }); add(RB(.12, 2.6, 5.8, .01), wallInM, -2.56, 1.3, 0, { parent: INT });
  add(RB(6.8, .1, 5.8, .01), STD({ map: woodT, color: '#a88a68' }), .9, 2.65, 0, { parent: INT }); for (let x = -2.2; x < 4.2; x += .6) add(RB(.06, .06, 5.8, .01), MAT.dark, x, 2.58, 0, { parent: INT });
  [-2.5, -.2, 1.8, 4.2].forEach(x => add(RB(.16, 2.6, .16, .02), MAT.dark, x, 1.3, -2.8, { parent: INT })); add(RB(6.8, .14, .16, .02), MAT.dark, .9, 1.95, -2.78, { parent: INT }); add(RB(6.8, .1, .16, .02), MAT.dark, .9, .06, -2.78, { parent: INT });
  // fusuma pintadas (montañas y grulla) en la pared izquierda
  const fusT = tex(512, 768, (g, w, h) => { g.fillStyle = '#e9dcbc'; g.fillRect(0, 0, w, h); blot(g, w, h, 18, 'rgba(160,140,90,.18)', 30, 110); g.fillStyle = 'rgba(70,90,80,.55)'; g.beginPath(); g.moveTo(0, h * .7); g.lineTo(w * .3, h * .35); g.lineTo(w * .55, h * .62); g.lineTo(w * .8, h * .3); g.lineTo(w, h * .55); g.lineTo(w, h); g.lineTo(0, h); g.fill();
    g.fillStyle = 'rgba(200,60,40,.8)'; g.beginPath(); g.arc(w * .72, h * .18, 34, 0, 7); g.fill(); g.strokeStyle = '#2a2a2a'; g.lineWidth = 6; g.beginPath(); g.moveTo(w * .2, h * .2); g.quadraticCurveTo(w * .3, h * .14, w * .4, h * .22); g.moveTo(w * .3, h * .17); g.lineTo(w * .26, h * .26); g.stroke();
    g.strokeStyle = '#3b2a1e'; g.lineWidth = 14; g.strokeRect(7, 7, w - 14, h - 14); g.fillStyle = '#2a2a2a'; g.beginPath(); g.ellipse(w * .85, h * .5, 10, 22, 0, 0, 7); g.fill(); });
  [-1.95, -.65, .65, 1.95].forEach((z, k) => add(RB(.05, 1.85, 1.28, .01), STD({ map: fusT }), -2.48, .98, z, { parent: INT, ry: 0 }));
  // shōji a la derecha (x = 4.2 es el genkan; los shōji van en z = 2.85, delante, con el sol entrando)
  const shojiT = tex(256, 512, (g, w, h) => { g.fillStyle = '#f4ecd4'; g.fillRect(0, 0, w, h); g.strokeStyle = '#6a4a2c'; g.lineWidth = 5; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(k * w / 4, 0); g.lineTo(k * w / 4, h); g.stroke(); } for (let k = 1; k < 8; k++) { g.beginPath(); g.moveTo(0, k * h / 8); g.lineTo(w, k * h / 8); g.stroke(); } g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12);
    g.fillStyle = 'rgba(150,130,90,.25)'; g.fillRect(w * .52, h * .4, w * .2, h * .12); g.strokeStyle = 'rgba(120,100,70,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(w * .55, h * .42); g.lineTo(w * .7, h * .5); g.stroke(); });
  const shojiM = STD({ map: shojiT, emissive: '#fff2d0', emissiveMap: shojiT, emissiveIntensity: .55 });
  [-1.8, -.6, .6, 1.8, 3.0].forEach(x => add(RB(1.18, 2.3, .05, .01), shojiM, x, 1.16, 2.86, { parent: INT, cast: false }));
  // haces de sol que entran por los shōji (aditivos)
  const beamM = new T.MeshBasicMaterial({ color: '#fff0c8', transparent: true, opacity: .14, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide });
  const BEAMS = []; [-1.2, .6, 2.2].forEach(x => { const b = add(new T.PlaneGeometry(.9, 3.6), beamM, x - .4, 1.15, 1.4, { parent: INT, rx: -1.0, ry: .25, cast: false, noInk: true }); BEAMS.push(b); });
  [-1.2, .6].forEach(x => add(new T.PlaneGeometry(1.1, 1.6), new T.MeshBasicMaterial({ color: '#fff3d0', transparent: true, opacity: .22, blending: T.AdditiveBlending, depthWrite: false }), x - .6, .065, .9, { parent: INT, rx: -Math.PI / 2, rz: .25, cast: false, noInk: true }));
  // tokonoma: rollo colgado, jarrón con rama seca
  add(RB(1.9, .18, .7, .02), STD({ map: woodT, color: '#8a6a4a' }), .8, .09, -2.45, { parent: INT });
  const scrollT = tex(128, 512, (g, w, h) => { g.fillStyle = '#e8dcc0'; g.fillRect(0, 0, w, h); g.fillStyle = '#6a4a2c'; g.fillRect(0, 0, w, 30); g.fillRect(0, h - 30, w, 30); g.fillStyle = '#1b1720'; g.font = `900 64px ${JP}`; g.textAlign = 'center'; g.fillText('一', w / 2, 150); g.fillText('期', w / 2, 230); g.fillText('一', w / 2, 310); g.fillText('会', w / 2, 390); blot(g, w, h, 6, 'rgba(120,90,40,.2)', 10, 30); });
  add(new T.PlaneGeometry(.5, 1.5), STD({ map: scrollT }), .8, 1.25, -2.79, { parent: INT, cast: false, noInk: true });
  add(new T.CylinderGeometry(.12, .16, .4, 14), STD({ color: '#3a5a7a', roughness: .3 }), 1.25, .38, -2.45, { parent: INT }); [[.0, .4], [.3, .3], [-.25, .35]].forEach(([a, h]) => add(new T.CylinderGeometry(.012, .015, h * 2, 4), STD({ color: '#5a3e2a' }), 1.25 + a * .3, .55 + h, -2.45, { parent: INT, rz: a }));
  // altar budista (butsudan) con el retrato del dueño, incienso y fruta
  const BUTSU = new T.Group(); BUTSU.position.set(2.9, 0, -2.45); INT.add(BUTSU);
  add(RB(1.1, 1.5, .55, .03), STD({ color: '#2a1a12', roughness: .5 }), 0, .75, 0, { parent: BUTSU }); add(RB(.9, 1.1, .05, .01), STD({ color: '#c89a3a', metalness: .6, roughness: .35, emissive: '#5a3a10', emissiveIntensity: .3 }), 0, .9, .26, { parent: BUTSU });
  add(RB(.95, .08, .4, .02), STD({ color: '#1b120c' }), 0, .4, .3, { parent: BUTSU }); add(new T.CylinderGeometry(.08, .1, .12, 12), STD({ color: '#c89a3a', metalness: .6 }), .25, .5, .32, { parent: BUTSU });
  for (let k = 0; k < 3; k++) add(new T.CylinderGeometry(.006, .006, .25, 4), STD({ color: '#6a4a2c' }), .23 + k * .02, .66, .32, { parent: BUTSU, noInk: true });
  [[-.25, '#f2862a'], [-.15, '#d23a32']].forEach(([x, c]) => add(new T.SphereGeometry(.07, 10, 8), STD({ color: c }), x, .5, .32, { parent: BUTSU }));
  const PORTRAIT = add(new T.PlaneGeometry(.38, .48), STD({ color: '#f2efe6', roughness: .6 }), 0, 1.0, .3, { parent: BUTSU, cast: false, noInk: true }); add(RB(.46, .56, .04, .01), STD({ color: '#1b1720' }), 0, 1.0, .28, { parent: BUTSU });
  // mesa baja (chabudai) con tazas, tetera y el periódico de 2003
  const TABLE = new T.Group(); TABLE.position.set(-.4, 0, .2); INT.add(TABLE);
  add(new T.CylinderGeometry(.75, .75, .07, 40), STD({ map: woodT, color: '#a2643a', roughness: .5 }), 0, .34, 0, { parent: TABLE }); [[.45, .45], [-.45, .45], [.45, -.45], [-.45, -.45]].forEach(([x, z]) => add(RB(.07, .3, .07, .01), STD({ color: '#5a3a22' }), x, .15, z, { parent: TABLE }));
  const cup = (x, z, tipped) => { const g = new T.Group(); g.position.set(x, .38, z); TABLE.add(g); if (tipped) g.rotation.z = 1.4; add(new T.CylinderGeometry(.06, .05, .11, 16, 1, true), STD({ color: '#d9d2c0', roughness: .3, side: T.DoubleSide }), 0, .055, 0, { parent: g }); add(new T.CircleGeometry(.055, 16), STD({ color: '#6a7a3a', roughness: .2 }), 0, .085, 0, { parent: g, rx: -Math.PI / 2, cast: false, noInk: true }); add(new T.CylinderGeometry(.061, .061, .03, 16, 1, true), STD({ color: '#3e5f86', side: T.DoubleSide }), 0, .07, 0, { parent: g, cast: false, noInk: true }); return g; };
  cup(.22, .18); cup(-.18, .3); cup(.05, -.38);
  const pot = new T.Group(); pot.position.set(-.3, .38, -.18); TABLE.add(pot); add(new T.SphereGeometry(.13, 18, 12), STD({ color: '#3a3e46', roughness: .4, metalness: .3 }), 0, .1, 0, { parent: pot, s: [1, .85, 1] }); add(new T.CylinderGeometry(.02, .03, .14, 8), STD({ color: '#3a3e46' }), .14, .14, 0, { parent: pot, rz: -.9 }); add(new T.TorusGeometry(.1, .012, 6, 18, Math.PI), STD({ color: '#6a4a2c' }), 0, .2, 0, { parent: pot, ry: Math.PI / 2 });
  const paperT = tex(512, 384, (g, w, h) => { g.fillStyle = '#e7dfc8'; g.fillRect(0, 0, w, h); blot(g, w, h, 10, 'rgba(160,130,70,.25)', 20, 80); g.fillStyle = '#1b1720'; g.font = `900 52px ${JP}`; g.textAlign = 'left'; g.fillText('信濃日報', 22, 58); g.font = '900 64px Inter, sans-serif'; g.fillStyle = '#c8302e'; g.textAlign = 'right'; g.fillText('2003', w - 20, 62);
    g.fillStyle = '#1b1720'; g.fillRect(20, 76, w - 40, 5); g.font = `900 40px ${JP}`; g.textAlign = 'left'; g.fillText('平成15年', 22, 128); for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(30,30,30,.55)'; g.fillRect(22 + (i % 3) * 160, 150 + Math.floor(i / 3) * 70, 140, 8); g.fillRect(22 + (i % 3) * 160, 166 + Math.floor(i / 3) * 70, 110, 8); }
    g.fillStyle = '#9aa3ad'; g.fillRect(340, 96, 150, 46); });
  const NEWS = add(new T.PlaneGeometry(.56, .42), STD({ map: paperT, roughness: .9, side: T.DoubleSide }), .12, .382, -.05, { parent: TABLE, rx: -Math.PI / 2, rz: .35, cast: false, noInk: true });
  // cojines (zabuton), reloj de pared parado, calendario, tele vieja, lámpara de techo con polvo
  [[-1.25, .2, '#7a2e3a'], [.5, 1.05, '#7a2e3a'], [-.4, -.75, '#3e4a6a']].forEach(([x, z, c]) => add(RB(.62, .08, .62, .04), STD({ color: c, roughness: .9 }), x, .05, z, { parent: INT }));
  const clockT = tex(256, 256, (g, w, h) => { g.fillStyle = '#f2ece0'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.fillStyle = '#1b1720'; for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28; g.fillRect(128 + Math.cos(a) * 100 - 4, 128 + Math.sin(a) * 100 - 4, 8, 8); } g.strokeStyle = '#1b1720'; g.lineWidth = 9; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + 60 * Math.cos(-2.2), 128 + 60 * Math.sin(-2.2)); g.stroke(); g.lineWidth = 6; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + 90 * Math.cos(.5), 128 + 90 * Math.sin(.5)); g.stroke(); });
  add(RB(.5, .9, .14, .04), STD({ color: '#5a3a22', roughness: .5 }), -1.4, 1.92, -2.74, { parent: INT }); add(new T.CircleGeometry(.19, 24), STD({ map: clockT }), -1.4, 2.08, -2.66, { parent: INT, cast: false, noInk: true }); add(new T.CylinderGeometry(.01, .01, .3, 4), STD({ color: '#c89a3a', metalness: .6 }), -1.4, 1.72, -2.68, { parent: INT, noInk: true }); add(new T.CylinderGeometry(.06, .06, .02, 14), STD({ color: '#c89a3a', metalness: .6 }), -1.4, 1.56, -2.67, { parent: INT, rx: Math.PI / 2, noInk: true });
  const tvM = STD({ color: '#6a6a66', roughness: .5 }); add(RB(.62, .52, .5, .06), tvM, -2.05, .5, -1.9, { parent: INT, ry: .5 }); add(RB(.44, .34, .02, .03), STD({ color: '#2a3238', roughness: .1, metalness: .4 }), -1.9, .52, -1.67, { parent: INT, ry: .5, noInk: true }); add(RB(.7, .24, .5, .02), STD({ map: woodT }), -2.05, .12, -1.9, { parent: INT, ry: .5 });
  add(new T.CylinderGeometry(.005, .005, .5, 4), STD({ color: '#1b1720' }), -.4, 2.4, .2, { parent: INT, noInk: true }); add(new T.CylinderGeometry(.08, .35, .22, 18, 1, true), STD({ color: '#e8dcc0', side: T.DoubleSide, emissive: '#fff0c8', emissiveIntensity: .1 }), -.4, 2.06, .2, { parent: INT });
  // genkan (x local 4.2…6.4): suelo de piedra más bajo, escalón de madera, zapatillas en fila, zapatero, paraguas, puerta corredera con luz
  const GK = new T.Group(); GK.position.set(5.3, 0, 0); INT.add(GK);
  const tatakiT = tex(512, 512, (g, w, h) => { g.fillStyle = '#7a7670'; g.fillRect(0, 0, w, h); noise(g, w, h, 30000, ['#6a6660', '#8a867e', '#5e5a54', '#9a958c'], [1, 4]); for (let i = 0; i < 260; i++) { g.fillStyle = ['#a8a296', '#5a5650', '#c4beb0'][i % 3]; g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 3 + rnd() * 5, 2 + rnd() * 4, rnd() * 3, 0, 7); g.fill(); } blot(g, w, h, 8, 'rgba(0,0,0,.15)', 30, 90); }, [1, 2]);
  add(RB(2.2, .1, 5.6, .02), STD({ map: tatakiT, roughness: .95 }), 0, -.3, 0, { parent: GK }); add(RB(.5, .3, 5.6, .02), STD({ map: woodT, color: '#a07c58' }), -.85, -.15, 0, { parent: GK });
  add(RB(.12, 2.9, 5.8, .01), wallInM, 1.16, 1.15, 0, { parent: GK }); add(RB(2.4, 2.9, .12, .01), wallInM, 0, 1.15, -2.86, { parent: GK });
  const SLIP = []; [['#d9c49a', -1.05], ['#3e4a6a', -.6], ['#a86a4a', -.15], ['#e89ab0', .3]].forEach(([c, z], k) => [-.075, .075].forEach(dz => { const g = new T.Group(); g.position.set(-.86 + (k % 2) * .03, .015, z + dz); g.rotation.y = Math.PI / 2 + (k - 1.5) * .04; GK.add(g);
    add(RB(.13, .028, .28, .012), STD({ color: mixHex(c, '#ffffff', .25), roughness: .8 }), 0, 0, 0, { parent: g }); add(new T.CylinderGeometry(.066, .066, .13, 14, 1, true, -Math.PI / 2, Math.PI), STD({ color: c, roughness: .7, side: T.DoubleSide }), 0, .012, .06, { parent: g, rz: Math.PI / 2 }); SLIP.push(g); }));
  [[.3, 1.6, '#1b1720'], [.55, 1.75, '#7a4a2a']].forEach(([x, z, c]) => [-.08, .08].forEach(dz => add(RB(.12, .1, .28, .05), STD({ color: c, roughness: .5 }), x + dz, -.2, z, { parent: GK, ry: .3 })));
  add(RB(.5, 1.0, 1.4, .02), STD({ map: woodT, color: '#8a6a4a' }), .82, .2, -1.9, { parent: GK }); add(new T.CylinderGeometry(.13, .11, .45, 14), STD({ color: '#4a6a5a' }), .75, -.03, 2.2, { parent: GK });
  [-.02, .04].forEach((dx, k) => add(new T.CylinderGeometry(.015, .015, .9, 6), STD({ color: k ? '#2f6fbf' : '#1b1720' }), .75 + dx, .35, 2.2 + dx, { parent: GK, rz: .08 - k * .15 }));
  const gDoorT = tex(256, 256, (g, w, h) => { g.fillStyle = '#fff6e0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#3b2a1e'; g.lineWidth = 8; for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(0, k * h / 5); g.lineTo(w, k * h / 5); g.stroke(); } g.lineWidth = 14; g.strokeRect(7, 7, w - 14, h - 14); g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke(); });
  add(RB(.06, 2.2, 2.0, .01), STD({ map: gDoorT, emissive: '#fff4d8', emissiveMap: gDoorT, emissiveIntensity: .8 }), 1.1, .8, .4, { parent: GK, cast: false });
  add(RB(2.4, 2.9, .12, .01), wallInM, 0, 1.15, 2.86, { parent: GK }); add(RB(2.5, .1, 5.8, .01), STD({ map: woodT, color: '#a88a68' }), 0, 2.62, 0, { parent: GK });
  add(RB(.12, 2.6, 5.8, .01), wallInM, 4.25 - 5.3 + 5.3 - 1.05, 1.3, 0, { parent: INT, s: [1, 1, 1] }).visible = false;
  // jardín pintado detrás de los shōji (por si se ve por un hueco) y caja exterior oscura que cierra todo
  add(RB(12, 4, .1, .01), STD({ color: '#6a8a5a' }), 1, 1.5, 3.6, { parent: INT, cast: false });
  add(RB(12, .1, 8, .01), STD({ color: '#3a2a1e' }), 1.5, 2.95, 0, { parent: INT, cast: false });
  // luz del interior (solo encendida cuando la cámara está dentro)
  const inLight = new T.PointLight('#ffe6b8', 0, 12, 1.4); inLight.position.set(IX + .5, IY + 2.2, 1.6); scene.add(inLight);
  const inFill = new T.PointLight('#d8e4ff', 0, 10, 1.6); inFill.position.set(IX - 1.5, IY + 1.8, -1); scene.add(inFill);

  // matojos y arbustos instanciados
  instanced(new T.ConeGeometry(.1, 1, 4), STD({ color: '#6f9a3c', roughness: .95 }), WEEDS, (o, [x, z, h, r]) => { o.position.set(x, h / 2, z); o.scale.set(1 + h, h, 1 + h); o.rotation.set((rnd() - .5) * .5, r, (rnd() - .5) * .5); });
  instanced(new T.IcosahedronGeometry(.5, 1), STD({ color: '#5f9a42', roughness: .95, flatShading: true }), WEEDS.filter((_, i) => i % 5 === 0), (o, [x, z, h, r]) => { o.position.set(x + .2, h * .3, z + .1); o.scale.set(h * .9, h * .55, h * .9); o.rotation.set(0, r, 0); });
  BUSH.forEach(([x, z, s, c]) => add(new T.IcosahedronGeometry(s, 2), STD({ color: c, roughness: .95, flatShading: true }), x, s * .7, z, { s: [1.2, .8, 1] }));

  // ---------- lazo de regalo sobre la casa ----------
  const GIFT = new T.Group(); scene.add(GIFT);
  const ribM = STD({ color: '#e0283c', roughness: .35, metalness: .05, emissive: '#5a0010', emissiveIntensity: .25 }), ribDk = STD({ color: '#b01a2c', roughness: .4 });
  { const H = HOUSE, x0 = H.g.position.x, z0 = H.g.position.z, w = H.w, d = H.d, wh = H.wh, base = .45 + wh, rise = 2.6, ov = .95, wd = .9;
    // cinta vertical sobre el tejado (a lo largo de z, en x = x0)
    const path = [[d / 2 + .06, .02], [d / 2 + .06, base - .02], [d / 2 + ov + .03, base + .02], [0, base + rise + .3], [-d / 2 - ov - .03, base + .02], [-d / 2 - .06, base - .02], [-d / 2 - .06, .02]];
    for (let i = 0; i < path.length - 1; i++) { const [za, ya] = path[i], [zb, yb] = path[i + 1], L = Math.hypot(zb - za, yb - ya), m = add(RB(wd, .06, L + .02, .02), ribM, x0, (ya + yb) / 2, z0 + (za + zb) / 2, { parent: GIFT, rx: Math.atan2(yb - ya, za - zb) }); }
    // cinta horizontal alrededor de los muros
    const yb = 1.7; [[0, d / 2 + .07, w + .14, wd, .06], [0, -d / 2 - .07, w + .14, wd, .06]].forEach(([x, z, a, b, c]) => add(RB(a, b, c, .02), ribM, x0 + x, yb, z0 + z, { parent: GIFT }));
    [-1, 1].forEach(sd => add(RB(.06, wd, d + .14, .02), ribM, x0 + sd * (w / 2 + .07), yb, z0, { parent: GIFT }));
    // lazo encima de la cumbrera
    const bow = new T.Group(); bow.position.set(x0, base + rise + .55, z0); GIFT.add(bow);
    [-1, 1].forEach(sd => { const l = add(new T.TorusGeometry(1.1, .32, 12, 28), ribM, sd * 1.15, .55, 0, { parent: bow, s: [1, .72, .38] }); l.rotation.z = sd * .45; });
    add(new T.SphereGeometry(.48, 18, 12), ribDk, 0, .3, 0, { parent: bow, s: [1, .9, .7] });
    [-1, 1].forEach(sd => { const t = add(RB(.6, 1.8, .08, .03), ribM, sd * .55, -.55, .25, { parent: bow }); t.rotation.z = sd * .35; t.rotation.x = .25; });
    // etiqueta «¥0» colgando del lazo
    const tagT = tex(256, 160, (g, w_, h_) => { g.fillStyle = '#fbf6e6'; g.fillRect(0, 0, w_, h_); g.strokeStyle = '#1b1720'; g.lineWidth = 10; g.strokeRect(5, 5, w_ - 10, h_ - 10); g.fillStyle = '#d2283a'; g.font = '900 110px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('¥0', w_ / 2 + 12, 118); g.fillStyle = '#1b1720'; g.beginPath(); g.arc(30, h_ / 2, 12, 0, 7); g.fill(); });
    const tag = new T.Group(); tag.position.set(x0 + .95, yb + .3, z0 + d / 2 + .16); GIFT.add(tag); add(new T.CylinderGeometry(.015, .015, .4, 4), STD({ color: '#1b1720' }), 0, -.2, 0, { parent: tag, noInk: true });
    add(RB(1.4, .9, .05, .02), STD({ map: tagT, roughness: .7 }), .1, -.82, .02, { parent: tag }); GIFT.userData = { bow, tag }; }
  GIFT.visible = false;

  // ---------- post: brillo + desenfoque de fondo + gradación ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .2, .5, .92); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .003, maxblur: .006 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, time: { value: 0 }, morn: { value: 0 }, night: { value: 0 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float time, morn, night; varying vec2 vUv; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c+=vec3(-.01,.008,.028)*(1.-l); c+=vec3(.03,.014,-.016)*l; c+=vec3(.02,0.,-.012)*morn; c+=vec3(-.01,.0,.03)*night; c=mix(vec3(l),c,1.16); c=c*c*(3.-2.*c)*.3+c*.7; vec2 d=vUv-.5; c*=1.-dot(d,d)*(.45+night*.5); c+=(h(vUv*vec2(1080.,1920.)+time)-.5)*.022; gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  // ---------- contorno de tinta ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o === sky || o.userData.noInk || (o.material && o.material.transparent)) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'CircleGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  // ---------- API ----------
  let zoneIn = false;
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    zoneIn = pos.x > IX - 10 && pos.x < IX + 10; inLight.intensity = zoneIn ? 7 : 0; inFill.intensity = zoneIn ? 2.2 : 0;
    sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; CLOUDS.forEach(([o, p0]) => o.position.x = p0.x + t * 1.2); }
  const SUN_DAY = SUN.clone(), SUN_DUSK = new T.Vector3(.78, .22, -.58).normalize(), MOON = new T.Vector3(.5, .45, -.74).normalize();
  // m: 0 día, 1 atardecer; n: 0..1 noche
  function setMood(m = 0, n = 0) { SUN.copy(SUN_DAY).lerp(SUN_DUSK, m).lerp(MOON, n).normalize(); skyU.morn.value = m * (1 - n); skyU.night.value = n; gradeMat.uniforms.morn.value = m * (1 - n); gradeMat.uniforms.night.value = n;
    sun.color.set(n > .5 ? '#9fb4ff' : m > .5 ? '#ffc890' : '#fff0d4'); sun.intensity = lerp(lerp(4.4, 3.4, m), 2.0, n);
    hemi.color.set(n > .5 ? '#6a7ac0' : m > .5 ? '#ffd0b8' : '#d2e6ff'); hemi.groundColor.set(n > .5 ? '#1a1e30' : m > .5 ? '#7a5a4a' : '#7c8a4e'); hemi.intensity = lerp(1.5, 1.0, n);
    scene.fog.color.set(n > .5 ? '#1c2440' : m > .5 ? '#f0c8a8' : '#d6e6ee'); R.toneMappingExposure = lerp(1.2, 1.05, n);
    LAMPS.forEach(l => l.material.emissiveIntensity = n > .5 ? 2.2 : .1); MAT.winO.emissive.set(n > .5 ? '#ffb860' : '#000000'); MAT.winO.emissiveIntensity = n > .5 ? .9 : 0; }
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  // regalo: k 0→1 cae desde arriba con rebote; tag se balancea
  function setGift(k, t = 0) { GIFT.visible = k > 0; if (k <= 0) return; const drop = (1 - k) * 14; GIFT.position.y = drop; const sq = k > .85 ? 1 + Math.sin((k - .85) / .15 * Math.PI) * .06 : 1; GIFT.userData.bow.scale.set(sq, 2 - sq, 1); GIFT.userData.tag.rotation.z = Math.sin(t * 2.4) * .12; GIFT.userData.tag.rotation.x = Math.sin(t * 1.7) * .08; }
  // puerta corredera de la casa: k 0 cerrada, 1 abierta (la hoja derecha se desliza a la izquierda)
  function setDoor(H, k) { H.leafR.position.x = .52 - k * 1.02; }
  return { IY, T, scene, camera, R, setCam, setTime, setMood, setGift, setDoor, visible, proj, render, SUN, hgt, HOUSE, NEIGH, HOUSES, STEPS, STOP, IX, IZ, INT, TABLE, NEWS, BUTSU, PORTRAIT, GK, SLIP, VM, dof, bloom, comp, inkM };
})();

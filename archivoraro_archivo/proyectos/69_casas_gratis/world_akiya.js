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
  const flat = (x, z) => (x > -75 && x < 75 && z > -40 && z < 60) || (x > 355 && x < 920 && z > -170 && z < 120) || (x > -330 && x < -190 && z > 20 && z < 150) || (x > 360 && x < 440 && z > -30 && z < 30);
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
  for (let i = 0; i < 260; i++) { const sd = rnd() > .5 ? 1 : -1, x = sd * (90 + rnd() * 200), z = -60 + rnd() * 200; if (Math.hypot(x + 260, z - 84) < 75) continue; CED.push([x, hgt(x, z), z, 2.4 + rnd() * 2.4]); }
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
  const gkLight = new T.PointLight('#ffe2b0', 0, 7, 1.4); gkLight.position.set(IX + 5.3, IY + 2.1, .3); scene.add(gkLight);
  const inLight = new T.PointLight('#ffe6b8', 0, 12, 1.4); inLight.position.set(IX + .5, IY + 2.2, 1.6); scene.add(inLight);
  const inFill = new T.PointLight('#d8e4ff', 0, 10, 1.6); inFill.position.set(IX - 1.5, IY + 1.8, -1); scene.add(inFill);

  // =====================================================================================================
  // ZONAS EXTRA (69): piso del protagonista (AX), ayuntamiento + inmobiliaria con el mapa de Japón (OX), concesionario (SX),
  // Tokio (TX), excavadora/billetes/monedas junto a la casa, casa nueva que envejece (NEW) con su cartel de precio.
  // =====================================================================================================
  const signTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return { c, g: c.getContext('2d'), t, draw }; };
  const room = (cx, cz, w, d, h, wallM, floorM, ceilM, o = {}) => { const g = new T.Group(); g.position.set(cx, 0, cz); scene.add(g);
    add(RB(w, .1, d, .01), floorM, 0, .05, 0, { parent: g, cast: false }); add(RB(w, .1, d, .01), ceilM, 0, h + .05, 0, { parent: g, cast: false });
    if (!o.noBack) add(RB(w, h, .12, .01), wallM, 0, h / 2, -d / 2, { parent: g }); if (!o.noFront) add(RB(w, h, .12, .01), wallM, 0, h / 2, d / 2, { parent: g });
    [-1, 1].forEach(sd => add(RB(.12, h, d, .01), wallM, sd * w / 2, h / 2, 0, { parent: g })); return g; };
  const paintedWin = (parent, x, y, z, w, h, ry, draw, emis = .9) => { const t = tex(512, 512, draw); add(new T.PlaneGeometry(w, h), STD({ map: t, emissive: '#ffffff', emissiveMap: t, emissiveIntensity: emis }), x, y, z, { parent, ry, cast: false, noInk: true });
    add(RB(w + .16, .1, .12, .02), MAT.dark, x, y - h / 2, z, { parent, ry }); add(RB(w + .16, .1, .12, .02), MAT.dark, x, y + h / 2, z, { parent, ry }); [-1, 1].forEach(sd => add(RB(.1, h, .12, .02), MAT.dark, x + Math.cos(ry || 0) * sd * w / 2, y, z - Math.sin(ry || 0) * sd * w / 2, { parent, ry })); add(RB(.08, h, .1, .02), MAT.dark, x, y, z, { parent, ry }); };
  const nightCity = (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0e1430'); gr.addColorStop(.7, '#2a2a5a'); gr.addColorStop(1, '#5a3a5a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(rnd() * w, rnd() * h * .45, 2, 2); } for (let b = 0; b < 16; b++) { const bx = b * 34 - 10 + rnd() * 10, bw = 26 + rnd() * 20, bh = h * (.25 + rnd() * .45); g.fillStyle = ['#1a1e3a', '#22264a', '#161a30'][b % 3]; g.fillRect(bx, h - bh, bw, bh);
      for (let yy = h - bh + 8; yy < h - 6; yy += 12) for (let xx = bx + 4; xx < bx + bw - 4; xx += 8) if (rnd() > .45) { g.fillStyle = rnd() > .3 ? '#ffd88a' : '#9ad0ff'; g.fillRect(xx, yy, 4, 6); } } g.fillStyle = '#ff4a5a'; g.fillRect(300, 120, 3, 3); };
  const dayView = (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#6aa8e8'); gr.addColorStop(.6, '#cfe6f4'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#7a9aa6'; g.beginPath(); g.moveTo(0, h * .62); g.lineTo(w * .3, h * .38); g.lineTo(w * .55, h * .58); g.lineTo(w * .8, h * .34); g.lineTo(w, h * .52); g.lineTo(w, h); g.lineTo(0, h); g.fill();
    g.fillStyle = '#5f9a42'; g.fillRect(0, h * .7, w, h * .3); for (let i = 0; i < 40; i++) { g.fillStyle = '#2f5a32'; const x = rnd() * w, y = h * (.6 + rnd() * .15); g.beginPath(); g.moveTo(x, y - 30); g.lineTo(x - 10, y); g.lineTo(x + 10, y); g.fill(); } for (let i = 0; i < 8; i++) { const x = rnd() * w, y = h * (.74 + rnd() * .15); g.fillStyle = '#efe6d2'; g.fillRect(x, y, 30, 16); g.fillStyle = ['#4e5868', '#7a4e3a'][i % 2]; g.beginPath(); g.moveTo(x - 6, y); g.lineTo(x + 15, y - 12); g.lineTo(x + 36, y); g.fill(); } };
  const posterT = (cols, motif) => tex(256, 360, (g, w, h) => { g.fillStyle = cols[0]; g.fillRect(0, 0, w, h); g.fillStyle = cols[1]; g.beginPath(); g.arc(w / 2, h * .42, 70, 0, 7); g.fill(); g.fillStyle = cols[2]; if (motif === 'wave') { for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(40 + k * 60, h * .75, 34, Math.PI, 0); g.fill(); } } else { g.fillRect(30, h * .72, w - 60, 40); } g.strokeStyle = '#1b1720'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); });
  // ---------- PISO del protagonista (AX = 470): de noche, sofá, ventana a la ciudad, estanterías, póster, planta, lámpara ----------
  const AX = 470, APT = room(AX, 0, 5.2, 4.6, 2.7, STD({ map: tex(512, 512, (g, w, h) => { g.fillStyle = '#c9b8d8'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 40) { g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x, 0, 18, h); } noise(g, w, h, 4000, ['rgba(0,0,0,.04)']); }) }),
    STD({ map: tex(512, 512, (g, w, h) => { g.fillStyle = '#9a6a44'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 42) { g.fillStyle = `rgba(${60 + rnd() * 30},${30 + rnd() * 20},10,.3)`; g.fillRect(0, y, w, 40); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, y + 40, w, 2); } }, [3, 3]) }), STD({ color: '#e8e2f0' }));
  paintedWin(APT, .6, 1.45, -2.24, 2.0, 1.3, 0, nightCity, 1.1);
  { const sofaM = STD({ color: '#d2643a', roughness: .9 }); add(RB(2.4, .45, .9, .12), sofaM, -.4, .32, -1.6, { parent: APT }); add(RB(2.4, .65, .25, .1), sofaM, -.4, .75, -2.0, { parent: APT }); [-1, 1].forEach(sd => add(RB(.25, .6, .9, .1), sofaM, -.4 + sd * 1.2, .45, -1.6, { parent: APT }));
    [[-1.0, '#f2c53a'], [.3, '#3e8a8a']].forEach(([x, c]) => add(RB(.5, .42, .16, .12), STD({ color: c }), x, .75, -1.82, { parent: APT, rz: .15 }));
    add(RB(2.0, .03, 1.4, .01), STD({ color: '#3a4a7a', roughness: 1 }), -.3, .11, -.4, { parent: APT, cast: false }); add(RB(.9, .35, .5, .04), STD({ map: woodT, color: '#c09a70' }), -.3, .28, -.5, { parent: APT });
    add(new T.CylinderGeometry(.09, .08, .14, 14), STD({ color: '#f2efe6' }), -.1, .53, -.5, { parent: APT }); add(new T.CylinderGeometry(.092, .092, .03, 14), STD({ color: '#c8302e' }), -.1, .6, -.5, { parent: APT });
    const shelf = new T.Group(); shelf.position.set(2.2, 0, -1.2); APT.add(shelf); add(RB(.5, 2.0, 1.2, .02), STD({ map: woodT, color: '#d8c0a0' }), 0, 1, 0, { parent: shelf }); for (let k = 0; k < 4; k++) for (let j = 0; j < 7; j++) add(RB(.28, .3 + rnd() * .08, .1, .01), STD({ color: ['#c8302e', '#2f6fbf', '#f2c53a', '#3fbf6a', '#8a4a9a', '#f2efe6'][(k + j) % 6] }), -.05, .3 + k * .48, -.45 + j * .14, { parent: shelf, noInk: true });
    add(RB(.05, .9, .65, .01), STD({ map: posterT(['#f2c53a', '#c8302e', '#1b1720'], 'wave') }), -2.52, 1.6, -.6, { parent: APT, cast: false }); add(RB(.05, .8, .6, .01), STD({ map: posterT(['#3e8a8a', '#f2efe6', '#2f3a52']) }), -2.52, 1.55, .6, { parent: APT, cast: false });
    add(new T.CylinderGeometry(.18, .14, .36, 12), STD({ color: '#f2efe6' }), 1.6, .18, -1.9, { parent: APT }); for (let k = 0; k < 6; k++) add(new T.SphereGeometry(.22, 10, 8), STD({ color: '#3f8f3a', flatShading: true }), 1.6 + Math.cos(k) * .18, .55 + k * .07, -1.9 + Math.sin(k) * .15, { parent: APT, s: [1, .6, 1] });
    add(new T.CylinderGeometry(.02, .02, 1.6, 6), STD({ color: '#1b1720' }), -1.95, .8, -1.9, { parent: APT }); add(new T.CylinderGeometry(.12, .26, .3, 16, 1, true), STD({ color: '#f2e2b0', emissive: '#ffd890', emissiveIntensity: 1.2, side: T.DoubleSide }), -1.95, 1.7, -1.9, { parent: APT });
    for (let k = 0; k < 8; k++) add(new T.SphereGeometry(.03, 6, 5), STD({ color: ['#ff6a8a', '#ffd34a', '#7ad0ff'][k % 3], emissive: ['#ff6a8a', '#ffd34a', '#7ad0ff'][k % 3], emissiveIntensity: 1.5 }), -2.4 + k * .55, 2.45, -2.18, { parent: APT, noInk: true }); }
  const aptL = new T.PointLight('#ffd0a0', 0, 9, 1.4); aptL.position.set(AX - 1.9, 1.8, -1.6); scene.add(aptL); const aptL2 = new T.PointLight('#8aa0ff', 0, 8, 1.6); aptL2.position.set(AX + .6, 1.6, -1.6); scene.add(aptL2);
  // móvil 3D (pantalla con canvas que se redibuja): W2.PHONE, W2.setPhone(estado)
  const PHONE = new T.Group(); PHONE.position.set(AX + .7, 1.25, 1.0); PHONE.scale.setScalar(.1); scene.add(PHONE); PHONE.visible = false;
  add(RB(.72, 1.46, .07, .08), STD({ color: '#1b1d24', roughness: .3, metalness: .4 }), 0, 0, 0, { parent: PHONE }); add(RB(.74, 1.48, .05, .085), STD({ color: '#c9ced6', metalness: .6, roughness: .3 }), 0, 0, -.015, { parent: PHONE });
  const scr = signTex(540, 1100); const screen = add(new T.PlaneGeometry(.66, 1.36), new T.MeshBasicMaterial({ map: scr.t, toneMapped: false }), 0, 0, .037, { parent: PHONE, cast: false, noInk: true });
  add(RB(.18, .03, .02, .01), STD({ color: '#000' }), 0, .66, .04, { parent: PHONE, noInk: true });
  function drawHouseIcon(g, x, y, s, roof = '#4e5868') { g.fillStyle = '#efe6d2'; g.fillRect(x - s * .6, y - s * .3, s * 1.2, s * .7); g.fillStyle = roof; g.beginPath(); g.moveTo(x - s * .85, y - s * .28); g.lineTo(x, y - s * .85); g.lineTo(x + s * .85, y - s * .28); g.fill(); g.fillStyle = '#3b2a1e'; g.fillRect(x + s * .15, y, s * .25, s * .4); g.fillStyle = '#9fc8e0'; g.fillRect(x - s * .4, y - s * .12, s * .3, s * .22); }
  function setPhone(o = {}) { PHONE.visible = o.show !== false; const g = scr.g, w = 540, h = 1100, sy = -(o.scroll || 0);
    g.fillStyle = '#f6f3ec'; g.fillRect(0, 0, w, h);
    g.save(); g.translate(0, sy);
    g.fillStyle = '#2f7a4a'; g.fillRect(0, 0, w, 150); g.fillStyle = '#fff'; g.font = `900 64px ${JP}`; g.textAlign = 'center'; g.fillText('空き家バンク', w / 2, 92); g.font = '700 30px Inter, sans-serif'; g.fillText('AKIYA BANK', w / 2, 132);
    drawHouseIcon(g, 70, 90, 60, '#f2c53a');
    // foto de la casa en la montaña
    const py = 180; const gr = g.createLinearGradient(0, py, 0, py + 360); gr.addColorStop(0, '#8ec8f0'); gr.addColorStop(1, '#d8eef8'); g.fillStyle = gr; g.fillRect(30, py, w - 60, 360);
    g.fillStyle = '#6a8a9a'; g.beginPath(); g.moveTo(30, py + 250); g.lineTo(170, py + 90); g.lineTo(290, py + 210); g.lineTo(400, py + 70); g.lineTo(w - 30, py + 200); g.lineTo(w - 30, py + 360); g.lineTo(30, py + 360); g.fill(); g.fillStyle = '#5f9a42'; g.fillRect(30, py + 280, w - 60, 80);
    for (let i = 0; i < 12; i++) { g.fillStyle = '#2f5a32'; const x = 50 + i * 40, y = py + 280; g.beginPath(); g.moveTo(x, y - 46); g.lineTo(x - 14, y); g.lineTo(x + 14, y); g.fill(); } drawHouseIcon(g, w / 2, py + 300, 110, '#5a6070');
    if (o.mountain) { g.strokeStyle = '#3fbf6a'; g.lineWidth = 10; g.strokeRect(30, py, w - 60, 360); }
    // camas (3 habitaciones)
    const by = 590; for (let k = 0; k < 3; k++) { const on = (o.beds || 0) > k, x = 110 + k * 160; g.fillStyle = on ? '#2f7a4a' : '#d9d2c0'; g.beginPath(); g.roundRect(x - 62, by - 52, 124, 104, 18); g.fill();
      g.fillStyle = '#fff'; g.fillRect(x - 40, by - 4, 80, 26); g.fillRect(x - 40, by - 22, 26, 20); g.fillRect(x - 44, by + 20, 8, 18); g.fillRect(x + 36, by + 20, 8, 18); }
    g.fillStyle = '#1b1720'; g.font = '900 54px Inter, sans-serif'; g.textAlign = 'left'; g.fillText('3 LDK', 40, 720); g.fillStyle = '#7a7468'; g.font = `700 36px ${JP}`; g.fillText('山の家 · 長野県', 220, 718);
    for (let k = 0; k < 3; k++) { g.fillStyle = '#d9d2c0'; g.fillRect(40, 760 + k * 34, w - 80 - k * 90, 14); }
    // precio
    g.fillStyle = '#1b1720'; g.font = `900 54px ${JP}`; g.fillText('価格', 40, 940); g.fillStyle = '#efe6d2'; g.fillRect(170, 880, w - 210, 90);
    if (o.price != null) { g.fillStyle = '#d2283a'; g.font = '900 86px Inter, sans-serif'; g.textAlign = 'center'; g.fillText(o.price, 355, 958); }
    if (o.stamp) { g.save(); g.translate(400, 1010); g.rotate(-.2); g.globalAlpha = Math.min(1, o.stamp); g.strokeStyle = '#d2283a'; g.lineWidth = 12; g.beginPath(); g.arc(0, 0, 70, 0, 7); g.stroke(); g.fillStyle = '#d2283a'; g.font = `900 40px ${JP}`; g.textAlign = 'center'; g.fillText('公式', 0, -6); g.font = `900 30px ${JP}`; g.fillText('町役場', 0, 34); g.restore(); }
    g.restore(); scr.t.needsUpdate = true; }
  setPhone({}); PHONE.visible = false;
  // ---------- AYUNTAMIENTO + INMOBILIARIA (OX = 545) ----------
  const OX = 545, OFF = room(OX, 0, 9, 7, 3.0, STD({ map: tex(512, 512, (g, w, h) => { g.fillStyle = '#e8e4d8'; g.fillRect(0, 0, w, h); noise(g, w, h, 5000, ['rgba(0,0,0,.04)']); g.fillStyle = '#a8b8c8'; g.fillRect(0, h * .8, w, h * .2); }) }),
    STD({ map: tex(512, 512, (g, w, h) => { g.fillStyle = '#c8ccc4'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 64) for (let y = 0; y < h; y += 64) { g.fillStyle = (x + y) % 128 ? '#bcc0b8' : '#d0d4cc'; g.fillRect(x + 1, y + 1, 62, 62); } }, [6, 5]) }), STD({ color: '#f2f2ee' }));
  for (let x = -3; x <= 3; x += 3) add(RB(1.6, .06, .3, .02), STD({ color: '#ffffff', emissive: '#f0f6ff', emissiveIntensity: 1.6 }), x, 2.96, -1, { parent: OFF, noInk: true });
  paintedWin(OFF, -2.5, 1.7, -3.44, 2.2, 1.4, 0, dayView, .8); paintedWin(OFF, 1.0, 1.7, -3.44, 2.2, 1.4, 0, dayView, .8);
  // mostrador con pancarta 移住歓迎
  const counterM = STD({ map: woodT, color: '#d8b890' }); add(RB(4.4, 1.05, .7, .04), counterM, -1.6, .53, .2, { parent: OFF }); add(RB(4.6, .06, .85, .02), STD({ color: '#f2efe6' }), -1.6, 1.07, .2, { parent: OFF });
  const banT = tex(1024, 200, (g, w, h) => { g.fillStyle = '#d2283a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = `900 120px ${JP}`; g.textAlign = 'center'; g.fillText('移住歓迎', w / 2, 140); for (let k = 0; k < 2; k++) { g.beginPath(); g.arc(70 + k * (w - 140), h / 2, 36, 0, 7); g.fill(); } });
  add(RB(4.2, .8, .04, .01), STD({ map: banT }), -1.6, 2.45, -3.36, { parent: OFF }); add(RB(.5, .7, .4, .04), STD({ color: '#3fbf6a' }), .4, 1.42, .1, { parent: OFF }); add(RB(.3, .2, .02, .01), STD({ color: '#f2efe6' }), .4, 1.6, .31, { parent: OFF, noInk: true });
  add(RB(.35, .08, .25, .02), STD({ color: '#c89a3a' }), -2.8, 1.12, .3, { parent: OFF }); add(new T.SphereGeometry(.06, 10, 8), STD({ color: '#c89a3a', metalness: .6 }), -2.8, 1.18, .3, { parent: OFF });
  // archivadores y estanterías con carpetas al fondo
  for (let k = 0; k < 3; k++) { add(RB(.9, 1.8, .45, .03), STD({ color: '#8a96a6', metalness: .3, roughness: .5 }), -3.9 + k * .95, .9, -3.1, { parent: OFF }); for (let j = 0; j < 9; j++) add(RB(.08, .34, .3, .01), STD({ color: ['#2f6fbf', '#c8302e', '#f2c53a', '#3fbf6a'][(k + j) % 4] }), -4.25 + k * .95 + j * .085, 1.5, -3.0, { parent: OFF, noInk: true }); }
  add(new T.CylinderGeometry(.22, .18, .45, 12), STD({ color: '#f2efe6' }), 3.9, .22, -3.0, { parent: OFF }); add(new T.IcosahedronGeometry(.5, 1), STD({ color: '#3f8f3a', flatShading: true }), 3.9, .85, -3.0, { parent: OFF, s: [1, 1.3, 1] });
  // reloj y tablón de anuncios
  add(new T.CylinderGeometry(.3, .3, .06, 24), STD({ color: '#f2efe6' }), 3.0, 2.4, -3.4, { parent: OFF, rx: Math.PI / 2 }); add(RB(1.4, 1.0, .05, .02), STD({ map: tex(256, 192, (g, w, h) => { g.fillStyle = '#b08a5a'; g.fillRect(0, 0, w, h); noise(g, w, h, 2000, ['rgba(0,0,0,.15)']); for (let k = 0; k < 6; k++) { g.fillStyle = ['#f6f3ec', '#ffe9a0', '#cfe6f2'][k % 3]; g.save(); g.translate(20 + (k % 3) * 78, 20 + Math.floor(k / 3) * 86); g.rotate((rnd() - .5) * .2); g.fillRect(0, 0, 60, 70); g.fillStyle = '#c8302e'; g.beginPath(); g.arc(30, 6, 5, 0, 7); g.fill(); g.restore(); } }) }), 3.2, 1.6, -3.4, { parent: OFF });
  // MAPA DE JAPÓN en relieve sobre una mesa grande (W2.setPins(k))
  const MAPC = V3(OX + 2.2, 0, 1.4); { add(RB(3.4, .08, 3.0, .03), STD({ map: woodT, color: '#8a6a4a' }), 2.2, .9, 1.4, { parent: OFF }); [[-1.5, -1.3], [1.5, -1.3], [-1.5, 1.3], [1.5, 1.3]].forEach(([x, z]) => add(RB(.1, .86, .1, .02), STD({ color: '#5a3a22' }), 2.2 + x, .43, 1.4 + z, { parent: OFF }));
    add(new T.PlaneGeometry(3.2, 2.8), STD({ color: '#6aa8d8', roughness: .2, metalness: .1 }), 2.2, .945, 1.4, { parent: OFF, rx: -Math.PI / 2, cast: false, noInk: true }); }
  const ISL = [[[141.2, 41.4], [140.0, 41.4], [139.8, 42.2], [140.3, 43.3], [141.4, 43.4], [141.7, 45.4], [142.0, 45.5], [143.0, 44.6], [144.3, 44.0], [145.3, 44.3], [145.6, 43.3], [144.3, 42.95], [143.3, 42.0], [141.9, 42.6], [141.2, 42.35], [140.5, 42.1]],
    [[141.2, 41.5], [141.5, 40.6], [142.0, 39.6], [141.6, 38.4], [141.0, 38.2], [140.9, 37.0], [140.6, 36.3], [140.8, 35.7], [140.4, 35.1], [139.8, 34.9], [139.6, 35.3], [139.1, 35.1], [138.8, 34.6], [138.2, 34.6], [137.0, 34.6], [136.8, 34.3], [136.0, 33.5], [135.8, 33.45], [135.2, 33.8], [135.4, 34.6], [134.2, 34.6], [133.0, 34.4], [131.9, 33.9], [130.9, 34.0], [131.0, 34.4], [132.2, 35.3], [133.3, 35.6], [134.4, 35.7], [135.4, 35.6], [136.0, 36.0], [136.8, 37.0], [137.0, 37.4], [137.3, 36.8], [138.5, 37.3], [139.4, 38.2], [139.9, 39.0], [140.0, 40.2], [140.3, 41.2]],
    [[132.6, 32.9], [132.0, 33.4], [132.6, 34.0], [133.5, 34.4], [134.6, 34.2], [134.7, 33.8], [134.2, 33.25], [133.0, 32.8]],
    [[130.9, 34.0], [131.8, 33.6], [131.6, 33.0], [131.4, 31.4], [130.7, 31.0], [130.2, 31.3], [130.2, 32.0], [129.6, 32.6], [129.7, 33.2], [130.3, 33.6]]];
  const mK = .13, mx = lon => (lon - 137.6) * mK, mz = lat => -(lat - 38.2) * mK * 1.15;
  const mapG = new T.Group(); mapG.position.set(MAPC.x, .95, MAPC.z); mapG.rotation.y = .78; scene.add(mapG);
  const landT = tex(512, 512, (g, w, h) => { g.fillStyle = '#7fbf5a'; g.fillRect(0, 0, w, h); noise(g, w, h, 20000, ['#6aa84a', '#93cc66', '#5a9a40'], [1, 4]); blot(g, w, h, 30, 'rgba(120,100,60,.25)', 20, 60); }, [1, 1]);
  const PINPTS = []; const inPoly = (x, z, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, zi] = poly[i], [xj, zj] = poly[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
  ISL.forEach(isl => { const pts = isl.map(([lo, la]) => [mx(lo), mz(la)]); const sh = new T.Shape(); pts.forEach(([x, z], i) => i ? sh.lineTo(x, -z) : sh.moveTo(x, -z));
    const geo = new T.ExtrudeGeometry(sh, { depth: .06, bevelEnabled: true, bevelThickness: .015, bevelSize: .015, bevelSegments: 2 }); geo.rotateX(-Math.PI / 2); add(geo, STD({ map: landT, roughness: .9 }), 0, 0, 0, { parent: mapG });
    let xs = pts.map(p => p[0]), zs = pts.map(p => p[1]); for (let i = 0; i < 260 && PINPTS.length < 900; i++) { const x = Math.min(...xs) + rnd() * (Math.max(...xs) - Math.min(...xs)), z = Math.min(...zs) + rnd() * (Math.max(...zs) - Math.min(...zs)); if (inPoly(x, z, pts)) PINPTS.push([x, z, rnd()]); } });
  PINPTS.sort((a, b) => a[2] - b[2]);
  const pinGeo = new T.BoxGeometry(.05, .04, .045); pinGeo.translate(0, .02, 0); const pinRoof = new T.ConeGeometry(.045, .04, 4); pinRoof.rotateY(Math.PI / 4); pinRoof.translate(0, .06, 0);
  const pinIM = new T.InstancedMesh(pinGeo, STD({ color: '#f6f0e0' }), PINPTS.length), pinRIM = new T.InstancedMesh(pinRoof, STD({ color: '#d2283a', roughness: .5 }), PINPTS.length); [pinIM, pinRIM].forEach(m => { m.userData.noInk = true; m.castShadow = true; mapG.add(m); });
  function setPins(k, t = 0) { const n = PINPTS.length; PINPTS.forEach(([x, z, r], i) => { const born = i / n, s = clamp((k - born) * 14); const e = s < 1 ? (1 + 2.7 * Math.pow(s - 1, 3) + 1.7 * Math.pow(s - 1, 2)) : 1; dm.position.set(x, .075, z); dm.rotation.set(0, r * 3, 0); dm.scale.setScalar(Math.max(.0001, e)); dm.updateMatrix(); pinIM.setMatrixAt(i, dm.matrix); pinRIM.setMatrixAt(i, dm.matrix); }); pinIM.instanceMatrix.needsUpdate = true; pinRIM.instanceMatrix.needsUpdate = true; }
  setPins(0);
  // rincón de la INMOBILIARIA (al otro lado del despacho): mesa con fichas, sello y tampón rojo
  const AGD = V3(OX - 2.6, 0, 2.2); add(RB(2.0, .08, 1.0, .03), STD({ color: '#5a6a7a', metalness: .2 }), -2.6, .78, 2.2, { parent: OFF }); [[-.9, -.4], [.9, -.4], [-.9, .4], [.9, .4]].forEach(([x, z]) => add(RB(.06, .76, .06, .01), STD({ color: '#3a3e46' }), -2.6 + x, .38, 2.2 + z, { parent: OFF }));
  const fichaT = tex(384, 512, (g, w, h) => { g.fillStyle = '#fbf8ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#2f7a4a'; g.fillRect(0, 0, w, 60); g.fillStyle = '#fff'; g.font = `900 40px ${JP}`; g.textAlign = 'center'; g.fillText('物件情報', w / 2, 44); drawHouseIcon(g, w / 2, 190, 120, '#5a6070'); for (let k = 0; k < 6; k++) { g.fillStyle = '#c9c2b0'; g.fillRect(30, 300 + k * 30, w - 60 - (k % 2) * 80, 12); } });
  const FICHA = add(new T.PlaneGeometry(.42, .56), STD({ map: fichaT, roughness: .9 }), -2.75, .825, 2.15, { parent: OFF, rx: -Math.PI / 2, rz: .12, cast: false, noInk: true });
  const stampMark = add(new T.CircleGeometry(.09, 24), new T.MeshBasicMaterial({ map: tex(256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = '#d2283a'; g.lineWidth = 16; g.beginPath(); g.arc(128, 128, 110, 0, 7); g.stroke(); g.fillStyle = '#d2283a'; g.font = `900 64px ${JP}`; g.textAlign = 'center'; g.fillText('告知', 128, 118); g.fillText('あり', 128, 190); }), transparent: true, depthWrite: false }), -2.7, .827, 2.05, { parent: OFF, rx: -Math.PI / 2, cast: false, noInk: true }); stampMark.visible = false;
  const STAMP = new T.Group(); OFF.add(STAMP); add(new T.CylinderGeometry(.05, .06, .16, 14), STD({ color: '#6a3a22', roughness: .5 }), 0, .13, 0, { parent: STAMP }); add(new T.SphereGeometry(.06, 12, 8), STD({ color: '#6a3a22' }), 0, .23, 0, { parent: STAMP }); add(new T.CylinderGeometry(.06, .06, .04, 16), STD({ color: '#d2283a' }), 0, .02, 0, { parent: STAMP });
  STAMP.position.set(-2.2, .82, 2.4); add(RB(.22, .05, .16, .02), STD({ color: '#1b1720' }), -2.15, .83, 2.55, { parent: OFF }); add(RB(.18, .02, .12, .01), STD({ color: '#d2283a' }), -2.15, .86, 2.55, { parent: OFF, noInk: true });
  function setStamp(k) { const up = k < .5 ? k / .5 : 1 - (k - .5) / .5; STAMP.position.set(lerp(-2.2, -2.7, clamp(k * 3)), .82 + Math.sin(clamp(k) * Math.PI) * .35 * (k < .55 ? 1 : 0), lerp(2.4, 2.05, clamp(k * 3))); if (k >= .55) STAMP.position.y = .82 + Math.max(0, (k - .62) * 1.2); stampMark.visible = k >= .5; }
  setStamp(0);
  const offL = new T.PointLight('#fff6e8', 0, 14, 1.2); offL.position.set(OX, 2.6, 0); scene.add(offL);
  // ---------- CONCESIONARIO (SX = 640): coche y casa sobre plataformas giratorias ----------
  const SX = 640, SHOW = room(SX, 0, 10, 11, 4.2, STD({ map: tex(512, 512, (g, w, h) => { g.fillStyle = '#e9edf2'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 128) { g.fillStyle = 'rgba(160,180,200,.25)'; g.fillRect(x, 0, 4, h); } g.fillStyle = '#d2283a'; g.fillRect(0, h * .1, w, 26); }) }),
    STD({ color: '#d8dce2', roughness: .15, metalness: .2 }), STD({ color: '#f2f4f6' }));
  for (let x = -3.5; x <= 3.5; x += 3.5) add(RB(2.2, .06, .3, .02), STD({ color: '#fff', emissive: '#ffffff', emissiveIntensity: 1.8 }), x, 4.15, 0, { parent: SHOW, noInk: true });
  paintedWin(SHOW, 0, 2.2, -5.44, 6, 2.8, 0, dayView, .7);
  for (let k = 0; k < 9; k++) add(new T.PlaneGeometry(.5, .7), STD({ color: ['#d2283a', '#f2efe6', '#2f6fbf'][k % 3], side: T.DoubleSide }), -4 + k, 3.6 + (k % 2) * .1, 2.5, { parent: SHOW, cast: false, noInk: true, rz: (k % 2 ? .1 : -.1) });
  const turn = (x) => { const g = new T.Group(); g.position.set(SX + x, 0, -.6); scene.add(g); add(new T.CylinderGeometry(1.8, 1.9, .2, 48), STD({ color: '#3a3e46', metalness: .5, roughness: .3 }), 0, .1, 0, { parent: g }); const top = new T.Group(); top.position.y = .2; g.add(top); add(new T.CylinderGeometry(1.75, 1.75, .03, 48), STD({ color: '#c9ced6', metalness: .7, roughness: .2 }), 0, .015, 0, { parent: top }); return top; };
  const TT_CAR = turn(-.9), TT_HOUSE = turn(1.1); TT_CAR.parent.position.z = -.4; TT_HOUSE.parent.position.z = -2.8;
  { const carM = STD({ color: '#d2283a', roughness: .25, metalness: .35 }), glass = STD({ color: '#6f9cc0', roughness: .05, metalness: .5 }); add(RB(2.8, .55, 1.3, .2), carM, 0, .55, 0, { parent: TT_CAR }); add(RB(1.5, .5, 1.2, .25), carM, -.15, 1.05, 0, { parent: TT_CAR }); add(RB(1.52, .38, 1.22, .18), glass, -.15, 1.08, 0, { parent: TT_CAR });
    [-.95, .95].forEach(x => [-.62, .62].forEach(z => { add(new T.CylinderGeometry(.3, .3, .2, 20), STD({ color: '#1b1b1f' }), x, .32, z, { parent: TT_CAR, rx: Math.PI / 2 }); add(new T.CylinderGeometry(.16, .16, .22, 12), STD({ color: '#c9ced6', metalness: .7 }), x, .32, z, { parent: TT_CAR, rx: Math.PI / 2 }); }));
    [-1, 1].forEach(z => add(RB(.08, .14, .26, .03), STD({ color: '#fff6c0', emissive: '#fff0a0', emissiveIntensity: 1 }), 1.4, .62, z * .42, { parent: TT_CAR, noInk: true })); }
  { const mini = kominka(SX + 1.1, -2.8, .5, { w: 3.0, d: 2.4, wh: 1.2, rise: .9, roofT: roofBlueT, engawa: false }); mini.g.position.y = .23; TT_HOUSE.attach(mini.g); }
  const tagSign = (x, txt, col) => { const t = tex(512, 256, (g, w, h) => { g.fillStyle = '#fbf8ee'; g.fillRect(0, 0, w, h); g.strokeStyle = '#1b1720'; g.lineWidth = 14; g.strokeRect(7, 7, w - 14, h - 14); if (txt === 'house') drawHouseIcon(g, w / 2, 150, 150, col); else { g.fillStyle = col; g.beginPath(); g.roundRect(110, 110, 300, 70, 20); g.fill(); g.beginPath(); g.roundRect(170, 70, 170, 60, 20); g.fill(); g.fillStyle = '#9fc8e0'; g.fillRect(190, 82, 130, 36); g.fillStyle = '#1b1720'; [170, 350].forEach(x => { g.beginPath(); g.arc(x, 186, 26, 0, 7); g.fill(); }); } });
    add(new T.CylinderGeometry(.04, .04, 1.4, 8), STD({ color: '#3a3e46', metalness: .5 }), SX + x, .7, 1.6); add(RB(1.2, .6, .04, .02), STD({ map: t }), SX + x, 1.5, 1.6); };
  tagSign(-3.1, 'car', '#d2283a'); tagSign(3.3, 'house', '#2f6fbf');
  const showL = new T.PointLight('#ffffff', 0, 16, 1.2); showL.position.set(SX, 3.6, 1); scene.add(showL);
  // ---------- TOKIO (TX = 790): calles con edificios, torre de celosía roja y blanca y una casita vieja abandonada entre bloques ----------
  const TX = 790; { const asphalt = STD({ map: roadT }); add(new T.PlaneGeometry(220, 220), STD({ color: '#8a8c90', roughness: .9 }), TX, .01, 0, { rx: -Math.PI / 2, cast: false, noInk: true });
    add(new T.PlaneGeometry(8, 220), asphalt, TX, .02, 4, { rx: -Math.PI / 2, rz: Math.PI / 2, cast: false, noInk: true }); add(new T.PlaneGeometry(8, 220), asphalt, TX + 18, .02, 0, { rx: -Math.PI / 2, cast: false, noInk: true });
    for (let x = -100; x < 100; x += 4) add(RB(2, .02, .5, .01), STD({ color: '#f2f0e8' }), TX + x, .03, 4, { cast: false, noInk: true });
    add(RB(220, .2, 2.2, .02), STD({ map: concT }), TX, .1, -1.1, { cast: false }); add(RB(220, .2, 2.2, .02), STD({ map: concT }), TX, .1, 9.1, { cast: false }); }
  const winTex = (base, lit) => tex(256, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); for (let y = 12; y < h; y += 34) for (let x = 12; x < w; x += 30) { g.fillStyle = rnd() < lit ? '#ffe9b0' : '#2a3a52'; g.fillRect(x, y, 18, 22); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x, y, 18, 4); } noise(g, w, h, 3000, ['rgba(0,0,0,.08)']); }, [1, 1]);
  const BT = [winTex('#b8bcc4', .15), winTex('#d8cfc0', .12), winTex('#8a96a6', .2), winTex('#c4a88a', .1), winTex('#e8e8e4', .14)];
  const TOK = []; for (let i = 0; i < 520; i++) { const x = TX - 140 + rnd() * 280, z = -150 + rnd() * 240; if (Math.abs(z - 4) < 9 || Math.abs(x - TX - 18) < 9 || (Math.abs(x - TX) < 5 && z < 0 && z > -12)) continue; const far = Math.abs(z - 4) > 30; TOK.push([x, z, 4 + rnd() * 5, 4 + rnd() * 5, (far ? 20 : 10) + rnd() * (far ? 60 : 30), i % 5]); }
  BT.forEach((t, k) => { const list = TOK.filter(b => b[5] === k), geo = new T.BoxGeometry(1, 1, 1); geo.translate(0, .5, 0); instanced(geo, STD({ map: t, roughness: .6 }), list, (o, [x, z, w, d, h]) => { o.position.set(x, 0, z); o.scale.set(w, h, d); o.rotation.set(0, 0, 0); }); });
  // torre de celosía (genérica) roja y blanca a lo lejos
  { const tg = new T.Group(); tg.position.set(TX + 60, 0, -110); scene.add(tg); for (let k = 0; k < 12; k++) { const y0 = k * 12, r0 = 14 * (1 - k / 13) + 1.5, r1 = 14 * (1 - (k + 1) / 13) + 1.5, col = k % 2 ? '#f2f0ea' : '#e0402e';
      for (let s = 0; s < 4; s++) { const a = s * Math.PI / 2 + Math.PI / 4, p0 = V3(Math.cos(a) * r0, y0, Math.sin(a) * r0), p1 = V3(Math.cos(a) * r1, y0 + 12, Math.sin(a) * r1); const m = p0.clone().lerp(p1, .5), L = p0.distanceTo(p1); const leg = add(new T.CylinderGeometry(.5, .5, L, 6), STD({ color: col }), m.x, m.y, m.z, { parent: tg }); leg.lookAt(tg.localToWorld(p1.clone())); leg.rotateX(Math.PI / 2); }
      add(new T.CylinderGeometry(r1 * 1.05, r1 * 1.05, .6, 4, 1, true), STD({ color: col, side: T.DoubleSide }), 0, y0 + 12, 0, { parent: tg, ry: Math.PI / 4 }); if (k === 5 || k === 8) add(RB(r1 * 1.6, 3, r1 * 1.6, .1), STD({ color: '#f2f0ea' }), 0, y0 + 12, 0, { parent: tg }); }
    add(new T.CylinderGeometry(.4, .6, 18, 8), STD({ color: '#e0402e' }), 0, 152, 0, { parent: tg }); }
  // casita vieja entre bloques (akiya de Tokio)
  const TOKIO_AKIYA = kominka(TX, -5.2, 0, { w: 6.2, d: 5, wh: 2.6, rise: 1.8, old: true, roofT: roofBrownT, engawa: false });
  [[TX - 6.4, -9, 8, 26, 9], [TX + 6.4, -9, 8, 34, 9]].forEach(([x, z, w, h, d], k) => add(RB(w, h, d, .05), STD({ map: BT[k + 1] }), x, h / 2, z, { cast: true }));
  for (let i = 0; i < 70; i++) WEEDS.push([TX - 3 + rnd() * 6, -2.6 + rnd() * 1.4, .4 + rnd() * .9, rnd() * 6]);
  add(RB(6.4, 1.6, .1, .02), STD({ color: '#c9ced6', metalness: .4, roughness: .5 }), TX, .8, -2.1, {}); for (let x = -3; x <= 3; x += .3) add(new T.CylinderGeometry(.015, .015, 1.6, 4), STD({ color: '#9aa0a8' }), TX + x, .8, -2.05, { noInk: true });
  for (let x = -60; x <= 60; x += 15) { add(new T.CylinderGeometry(.14, .18, 9, 10), poleM, TX + x, 4.5, 9.8); add(RB(1.8, .12, .12, .03), poleM, TX + x, 8.3, 9.8); }
  [[-20, '#2f6fbf'], [26, '#f2efe6'], [-44, '#d2283a']].forEach(([x, c]) => { const g = new T.Group(); g.position.set(TX + x, 0, 2.6); scene.add(g); add(RB(3.8, .6, 1.6, .18), STD({ color: c, roughness: .3, metalness: .3 }), 0, .55, 0, { parent: g }); add(RB(2, .5, 1.5, .2), STD({ color: '#6f9cc0', roughness: .05, metalness: .5 }), -.2, 1.05, 0, { parent: g }); [-1.2, 1.2].forEach(xx => [-.75, .75].forEach(z => add(new T.CylinderGeometry(.3, .3, .2, 16), STD({ color: '#1b1b1f' }), xx, .3, z, { parent: g, rx: Math.PI / 2 }))); });
  // ---------- EXCAVADORA, BILLETES y MONEDAS junto a la casa del regalo ----------
  const DIG = new T.Group(); DIG.position.set(-6.4, 0, 1.6); DIG.rotation.y = .9; scene.add(DIG); const yel = STD({ color: '#f2b62a', roughness: .45, metalness: .2 }), dkM = STD({ color: '#2a2d36', roughness: .6 });
  [-1, 1].forEach(sd => add(RB(3.2, .7, .7, .3), dkM, 0, .35, sd * .95, { parent: DIG }));
  const digTop = new T.Group(); digTop.position.y = .75; DIG.add(digTop); add(RB(2.6, .9, 2.0, .15), yel, -.3, .45, 0, { parent: digTop }); add(RB(1.1, 1.2, 1.0, .12), yel, .55, 1.4, -.45, { parent: digTop }); add(RB(1.0, 1.0, .9, .1), STD({ color: '#6f9cc0', roughness: .05, metalness: .5 }), .6, 1.45, -.45, { parent: digTop });
  add(RB(.8, .5, 1.8, .1), dkM, -1.6, .55, 0, { parent: digTop });
  const boom = new T.Group(); boom.position.set(.9, .9, .35); digTop.add(boom); add(RB(2.6, .35, .3, .08), yel, 1.2, 0, 0, { parent: boom }); const arm = new T.Group(); arm.position.set(2.5, 0, 0); boom.add(arm); add(RB(.3, 1.9, .26, .08), yel, 0, -.9, 0, { parent: arm });
  const bucket = new T.Group(); bucket.position.set(0, -1.85, 0); arm.add(bucket); add(RB(.7, .5, .6, .08), dkM, .25, -.15, 0, { parent: bucket }); for (let k = 0; k < 4; k++) add(new T.ConeGeometry(.05, .16, 4), STD({ color: '#c9ced6', metalness: .6 }), .5, -.42, -.22 + k * .15, { parent: bucket, rz: Math.PI });
  DIG.visible = false;
  function setDigger(o = {}) { DIG.visible = o.on !== false; if (!DIG.visible) return; DIG.position.set(o.x ?? -6.4, 0, o.z ?? 1.6); DIG.rotation.y = Math.PI / 2; digTop.rotation.y = o.yaw || 0; boom.rotation.z = o.boom ?? .35; arm.rotation.z = o.arm ?? -.4; bucket.rotation.z = o.bucket ?? .3; }
  const billT = tex(256, 128, (g, w, h) => { g.fillStyle = '#e8dcc0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#7a6a4a'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = '#9a8a6a'; g.beginPath(); g.arc(w * .72, h / 2, 34, 0, 7); g.fill(); g.fillStyle = '#5a4a3a'; g.font = '900 44px Inter, sans-serif'; g.textAlign = 'left'; g.fillText('10000', 22, h / 2 + 16); g.fillStyle = '#d2283a'; g.beginPath(); g.arc(w - 26, 26, 10, 0, 7); g.fill(); });
  const BILLS = new T.Group(); BILLS.position.set(-.6, 0, 4.6); scene.add(BILLS); const billM = STD({ map: billT, roughness: .8 }); const BILLN = 36;
  for (let k = 0; k < BILLN; k++) add(RB(.62, .1, .32, .01), billM, ((k % 3) - 1) * .66, .05 + Math.floor(k / 3) * .1, ((k % 2) - .5) * .02, { parent: BILLS, ry: (rnd() - .5) * .12 });
  function setBills(k) { BILLS.children.forEach((m, i) => { m.visible = k > 0 && i < Math.round(k * BILLN); }); }
  setBills(0);
  const coinM = STD({ color: '#e8b830', roughness: .25, metalness: .7, emissive: '#5a3a00', emissiveIntensity: .2 }), COINS = [];
  for (let s = 0; s < 6; s++) { const g = new T.Group(); g.position.set(-2.5 + (s % 3) * 2.5, 0, -5.8 + Math.floor(s / 3) * 2.2); scene.add(g); for (let k = 0; k < 10; k++) add(new T.CylinderGeometry(.55, .55, .14, 28), coinM, (rnd() - .5) * .05, .07 + k * .15, (rnd() - .5) * .05, { parent: g }); g.visible = false; COINS.push(g); }
  function setCoins(n, t = 0) { COINS.forEach((g, i) => { const k = clamp(n - i); g.visible = k > 0; const e = k < 1 ? (1 + 2.7 * Math.pow(k - 1, 3) + 1.7 * Math.pow(k - 1, 2)) : 1; g.scale.set(1, Math.max(.001, e), 1); }); }
  const LOT = add(new T.PlaneGeometry(10.6, 7.8), STD({ map: dirtT, roughness: 1 }), 0, .03, -5.4, { rx: -Math.PI / 2, cast: false, noInk: true }); LOT.visible = false;
  function setHouseGone(gone) { HOUSE.g.visible = !gone; LOT.visible = gone; }
  // ---------- CASA NUEVA que envejece (NEW) con cartel de precio ----------
  const NX = 61, NZ = -5.6, NEW = new T.Group(); NEW.position.set(NX, 0, NZ); scene.add(NEW);
  const newWall = STD({ color: '#f4f2ec', roughness: .7 }), newRoof = STD({ color: '#3e5f86', roughness: .45, metalness: .2 }), newTrim = STD({ color: '#5a4030' });
  add(RB(8.4, .4, 6.6, .03), MAT.stone, 0, .2, 0, { parent: NEW }); add(RB(8, 2.8, 6.2, .04), newWall, 0, 1.8, 0, { parent: NEW }); add(RB(8, 2.4, 6.2, .04), newWall, 0, 4.4, 0, { parent: NEW });
  add(hipRoof(8, 6.2, 2.1, .8), newRoof, 0, 5.6, 0, { parent: NEW }); add(RB(9.6, .14, 7.8, .03), newTrim, 0, 5.58, 0, { parent: NEW }); add(RB(8.2, .14, 6.4, .03), newTrim, 0, 3.22, 0, { parent: NEW });
  const nWin = []; [[-2.2, 1.9], [0, 1.9], [-2.2, 4.4], [1.0, 4.4], [2.6, 4.4]].forEach(([x, y]) => nWin.push(add(new T.PlaneGeometry(1.2, 1.1), MAT.winO, x, y, 3.13, { parent: NEW, cast: false, noInk: true })));
  const nDoor = add(RB(1.1, 2.1, .1, .03), STD({ color: '#8a5a3a', roughness: .5 }), 2.4, 1.45, 3.12, { parent: NEW }); add(RB(1.6, .12, 1.0, .02), newTrim, 2.4, 2.65, 3.5, { parent: NEW, rx: .2 }); add(RB(1.8, .2, 1.2, .04), MAT.stone, 2.4, .1, 3.8, { parent: NEW });
  const NWEEDS = []; for (let i = 0; i < 220; i++) NWEEDS.push([NX - 5 + rnd() * 10, NZ + 3.6 + rnd() * 3.4, .3 + rnd() * 1.3, rnd() * 6]); for (let i = 0; i < 60; i++) NWEEDS.push([NX - 4.3 + rnd() * 8.6, NZ + 3.25 + rnd() * .3, .5 + rnd() * 1.8, rnd() * 6]);
  const nwIM = new T.InstancedMesh(new T.ConeGeometry(.1, 1, 4), STD({ color: '#6f9a3c', roughness: .95 }), NWEEDS.length); nwIM.userData.noInk = true; nwIM.castShadow = true; scene.add(nwIM);
  const ivy = add(new T.PlaneGeometry(8.1, 5.4), STD({ map: tex(512, 512, (g, w, h) => { g.clearRect(0, 0, w, h); for (let i = 0; i < 900; i++) { const x = rnd() * w, y = h - Math.pow(rnd(), .6) * h; g.fillStyle = ['#3f7f33', '#5fa346', '#2f6a2a'][i % 3]; g.beginPath(); g.ellipse(x, y, 10, 6, rnd() * 3, 0, 7); g.fill(); } }), transparent: true, alphaTest: .4, roughness: .9 }), 0, 2.9, 3.135, { parent: NEW, cast: false, noInk: true });
  const priceS = signTex(512, 300); const PRICE = new T.Group(); PRICE.position.set(NX - 2.6, 0, NZ + 5.6); scene.add(PRICE); [-.8, .8].forEach(x => add(new T.CylinderGeometry(.05, .05, 1.6, 8), STD({ color: '#c9ced6', metalness: .5 }), x, .8, 0, { parent: PRICE }));
  add(RB(2.0, 1.2, .06, .02), STD({ color: '#f2efe6' }), 0, 1.9, -.02, { parent: PRICE }); add(new T.PlaneGeometry(1.9, 1.1), new T.MeshBasicMaterial({ map: priceS.t, toneMapped: false }), 0, 1.9, .015, { parent: PRICE, cast: false, noInk: true });
  function setPrice(v, flash = 0) { const g = priceS.g, w = 512, h = 300; g.fillStyle = '#fbf8ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#d2283a'; g.fillRect(0, 0, w, 80); g.fillStyle = '#fff'; g.font = `900 54px ${JP}`; g.textAlign = 'center'; g.fillText('売出中', w / 2, 60);
    g.fillStyle = v <= 0 ? '#d2283a' : '#1b1720'; g.font = `900 ${v >= 1e7 ? 70 : 84}px Inter, sans-serif`; g.fillText(v <= 0 ? '0円' : Math.round(v / 1e4).toLocaleString('en-US') + '万円', w / 2, 200); if (flash > 0) { g.fillStyle = `rgba(210,40,58,${flash})`; g.fillRect(0, 230, w, 50); } priceS.t.needsUpdate = true; }
  setPrice(30000000);
  const newCols = { wall: [new T.Color('#f4f2ec'), new T.Color('#b8ad98')], roof: [new T.Color('#3e5f86'), new T.Color('#6a6a62')], trim: [new T.Color('#5a4030'), new T.Color('#4a3a2e')] };
  function setAge(a) { newWall.color.copy(newCols.wall[0]).lerp(newCols.wall[1], a); newRoof.color.copy(newCols.roof[0]).lerp(newCols.roof[1], a); newTrim.color.copy(newCols.trim[0]).lerp(newCols.trim[1], a);
    nWin.forEach((m, i) => m.material = a > .55 + i * .06 ? MAT.winS : MAT.winO); ivy.material.opacity = 1; ivy.scale.set(1, Math.max(.001, clamp((a - .3) / .7)), 1); ivy.position.y = .35 + 2.55 * ivy.scale.y; ivy.visible = a > .32;
    NWEEDS.forEach(([x, z, h, r], i) => { const s = clamp(a * 1.6 - (i % 7) * .08) * h; dm.position.set(x, s / 2, z); dm.scale.set(1 + s, Math.max(.001, s), 1 + s); dm.rotation.set(0, r, 0); dm.updateMatrix(); nwIM.setMatrixAt(i, dm.matrix); }); nwIM.instanceMatrix.needsUpdate = true; }
  setAge(0);
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
    zoneIn = pos.x > IX - 10 && pos.x < IX + 10; inLight.intensity = zoneIn ? 7 : 0; gkLight.intensity = zoneIn ? 5 : 0; inFill.intensity = zoneIn ? 2.2 : 0; const inA = Math.abs(pos.x - AX) < 4, inO = Math.abs(pos.x - OX) < 6, inS = Math.abs(pos.x - SX) < 6; aptL.intensity = inA ? 9 : 0; aptL2.intensity = inA ? 5 : 0; offL.intensity = inO ? 14 : 0; showL.intensity = inS ? 22 : 0;
    sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; CLOUDS.forEach(([o, p0]) => o.position.x = p0.x + t * 1.2); }
  const SUN_DAY = SUN.clone(), SUN_DUSK = new T.Vector3(.78, .22, -.58).normalize(), MOON = new T.Vector3(.5, .45, -.74).normalize();
  // m: 0 día, 1 atardecer; n: 0..1 noche
  function setMood(m = 0, n = 0) { SUN.copy(SUN_DAY).lerp(SUN_DUSK, m).lerp(MOON, n).normalize(); skyU.morn.value = m * (1 - n); skyU.night.value = n; gradeMat.uniforms.morn.value = m * (1 - n); gradeMat.uniforms.night.value = n;
    sun.color.set(n > .5 ? '#9fb4ff' : m > .5 ? '#ffc890' : '#fff0d4'); sun.intensity = lerp(lerp(4.4, 3.4, m), 2.7, n);
    hemi.color.set(n > .5 ? '#6a7ac0' : m > .5 ? '#ffd0b8' : '#d2e6ff'); hemi.groundColor.set(n > .5 ? '#1a1e30' : m > .5 ? '#7a5a4a' : '#7c8a4e'); hemi.intensity = lerp(1.5, 1.35, n);
    scene.fog.color.set(n > .5 ? '#1c2440' : m > .5 ? '#f0c8a8' : '#d6e6ee'); R.toneMappingExposure = lerp(1.2, 1.15, n);
    LAMPS.forEach(l => l.material.emissiveIntensity = n > .5 ? 2.2 : .1); MAT.winO.emissive.set(n > .5 ? '#ffb860' : '#000000'); MAT.winO.emissiveIntensity = n > .5 ? .9 : 0; }
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  // regalo: k 0→1 cae desde arriba con rebote; tag se balancea
  function setGift(k, t = 0, sq = 0) { GIFT.visible = k > 0; if (k <= 0) return; GIFT.position.y = (1 - k) * 14; GIFT.userData.bow.scale.set(1 + sq, 1 - sq * 1.4, 1 + sq * .5); GIFT.userData.tag.rotation.z = Math.sin(t * 2.4) * .12 + sq * .8; GIFT.userData.tag.rotation.x = Math.sin(t * 1.7) * .08; }
  // puerta corredera de la casa: k 0 cerrada, 1 abierta (la hoja derecha se desliza a la izquierda)
  function setDoor(H, k) { H.leafR.position.x = .52 - k * 1.02; }
  return { AX, OX, SX, TX, PHONE, setPhone, MAPC, mapG, setPins, AGD, FICHA, STAMP, setStamp, TT_CAR, TT_HOUSE, TOKIO_AKIYA, DIG, setDigger, BILLS, setBills, setCoins, setHouseGone, NEW, NX, NZ, PRICE, setPrice, setAge, nDoor, OFF, APT, SHOW, IY, T, scene, camera, R, setCam, setTime, setMood, setGift, setDoor, visible, proj, render, SUN, hgt, HOUSE, NEIGH, HOUSES, STEPS, STOP, IX, IZ, INT, TABLE, NEWS, BUTSU, PORTRAIT, GK, SLIP, VM, dof, bloom, comp, inkM };
})();

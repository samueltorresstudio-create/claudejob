// Archivo Raro · mundo 3D de DIBUJO ANIMADO para «Las tres reglas secretas de los casinos» (77).
// Decorados modelados en Blender (casino.glb → glb_casino.js) con sombreado de tebeo (MeshToon), contorno negro, moqueta y pantallas pintadas en canvas.
// Cinco sitios: hall (0) sala de juego sin ventanas · office (1000) despacho · glass (2000) sala con pared de cristal · maze (3000) laberinto · lab (4000) laboratorio.
// API compatible con core3d.js y stick.js: setCam, proj, render, setTime, setMood, site, ground, charLight.
window.GLC = document.getElementById('gl');
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920, LAY = window.LAYOUT;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NoToneMapping; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(40, W / H, .1, 5000);
  const rnd = (() => { let s = 7575; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const TICK = [];

  // ---------- cielo de tebeo: degradado, sol de disco plano y nubes de borde duro con sombra ----------
  const SUN = new T.Vector3(-.5, .55, .65).normalize();
  const skyU = { sun: { value: SUN }, top: { value: new T.Color('#3f93f2') }, mid: { value: new T.Color('#7fc4ff') }, hor: { value: new T.Color('#ffeccc') }, cloud: { value: .52 }, time: { value: 0 } };
  const SKYFS = `uniform vec3 sun, top, mid, hor; uniform float cloud, time; varying vec3 vd;
    float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
    float fbm(vec2 p){ float s=0., a=.55; for(int i=0;i<4;i++){ s+=a*n2(p); p*=2.1; a*=.5; } return s; }
    void main(){ float h=vd.y; vec3 c=mix(hor, mix(mid, top, smoothstep(.15,.8,h)), smoothstep(-.02,.22,h));
      float s=max(dot(vd,sun),0.); c+=vec3(1.,.93,.65)*smoothstep(.9935,.996,s)+vec3(1.,.85,.55)*pow(s,7.)*.2;
      if(h>.02){ vec2 q=vd.xz/(h+.22)*1.5+vec2(time*.012,0.); float f=fbm(q), f2=fbm(q+vec2(.05,.1)); float cl=smoothstep(cloud,cloud+.035,f);
        vec3 cc=mix(vec3(1.), vec3(.76,.83,.97), 1.-smoothstep(cloud+.04,cloud+.2,f2)); c=mix(c,cc,cl*smoothstep(.02,.16,h)); }
      gl_FragColor=vec4(c,1.);
#include <colorspace_fragment>
    }`;
  const sky = new T.Mesh(new T.SphereGeometry(4000, 48, 24), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }', fragmentShader: SKYFS }));
  sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky);
  scene.fog = new T.FogExp2('#fde7c4', .0016);
  const hemi = new T.HemisphereLight('#ffffff', '#ffd9a0', 1.7); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff1c9', 2.4); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0004; sun.shadow.normalBias = .06; scene.add(sun, sun.target);

  // ---------- materiales de tebeo ----------
  const toonG = new T.DataTexture(new Uint8Array([120, 185, 235, 255]), 4, 1, T.RedFormat); toonG.minFilter = toonG.magFilter = T.NearestFilter; toonG.needsUpdate = true;
  const uTime = { value: 0 }, MATS = {}, SIGN = {}, PAINTED = /^(carpet|runner|wallpaper|ceilingp|parquet|tilep|plan\d|slotscr|clockface|daycity|eeg|chart|poster|art\d|icon\d)$/, TILE = { runner: 2.5, carpet: 3.2, wallpaper: 2.6, ceilingp: 3.0, parquet: 2.0, tilep: 2.0 };
  function toon(m) { if (MATS[m.name]) return MATS[m.name]; const o = new T.MeshToonMaterial({ color: m.color.clone(), gradientMap: toonG, vertexColors: !!m.vertexColors }); o.name = m.name;
    if (PAINTED.test(m.name)) { o.color.set('#ffffff'); SIGN[m.name] = o; }
    // look de dibujo animado: moteado de pincel en los colores planos y un brillo suave en el borde de las formas
    o.onBeforeCompile = sh => { sh.vertexShader = 'varying vec3 vWP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = 'varying vec3 vWP;\nfloat mh(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }\nfloat mn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(mix(mh(i), mh(i + vec3(1,0,0)), f.x), mix(mh(i + vec3(0,1,0)), mh(i + vec3(1,1,0)), f.x), f.y), mix(mix(mh(i + vec3(0,0,1)), mh(i + vec3(1,0,1)), f.x), mix(mh(i + vec3(0,1,1)), mh(i + vec3(1,1,1)), f.x), f.y), f.z); }\n' + sh.fragmentShader
        .replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb *= .90 + .20 * mn(vWP * 2.3) + .05 * mn(vWP * 9.);')
        .replace('#include <opaque_fragment>', '#include <opaque_fragment>\n { float rim = pow(1. - clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0., 1.), 3.); gl_FragColor.rgb += vec3(1., .86, .72) * rim * .11; }'); };
    return (MATS[m.name] = o); }
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0031 }, col: { value: new T.Color('#241c2c') } },
    vertexShader: `uniform float k; void main(){ vec3 p=position, n=normal; mat4 M=modelViewMatrix;
      #ifdef USE_INSTANCING
        M=modelViewMatrix*instanceMatrix;
      #endif
      vec4 mv=M*vec4(p,1.); vec3 nn=normalize(mat3(M)*n); mv.xyz+=nn*clamp(-mv.z*k,.016,.5); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.);\n#include <colorspace_fragment>\n}' });
  const hullOf = g => { let h = g.clone(); ['normal', 'uv', 'color', 'uv1'].forEach(a => h.deleteAttribute(a)); h = mergeVertices(h, 2e-3); h.computeVertexNormals(); h.clearGroups(); return h; };
  const meshesOf = o => { const L = []; o.traverse(c => { if (c.isMesh && !c.userData.ink) L.push(c); }); return L; };
  const inkify = o => meshesOf(o).forEach(me => { const h = new T.Mesh(hullOf(me.geometry), inkM); h.userData.ink = true; h.castShadow = false; h.receiveShadow = false; me.add(h); });



  // ---------- moqueta, pantallas y planos pintados en canvas ----------
  const cv = (w, h, f, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
  const KK = '#241c2c';
  const rn0 = (s0) => { let s = s0; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  function fruit(g, kind, x, y, r) {
    g.lineWidth = r * .12; g.strokeStyle = KK; g.lineJoin = 'round';
    if (kind === 0) { [[-.5, .3], [.5, .45]].forEach(([dx, dy]) => { g.fillStyle = '#e3243a'; g.beginPath(); g.arc(x + dx * r, y + dy * r, r * .42, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x + dx * r - r * .12, y + dy * r - r * .12, r * .1, 0, 7); g.fill(); });
      g.strokeStyle = '#2f9a52'; g.lineWidth = r * .12; g.beginPath(); g.moveTo(x - .5 * r, y - .1 * r); g.quadraticCurveTo(x, y - r * 1.1, x + .5 * r, y + .05 * r); g.stroke(); }
    else if (kind === 1) { g.fillStyle = '#ffe34a'; g.beginPath(); g.ellipse(x, y, r * .95, r * .62, -.3, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#fff6b0'; g.beginPath(); g.ellipse(x - r * .25, y - r * .15, r * .3, r * .12, -.3, 0, 7); g.fill(); }
    else if (kind === 2) { g.fillStyle = '#ffc928'; g.beginPath(); g.moveTo(x - r * .75, y + r * .55); g.quadraticCurveTo(x - r * .8, y - r * .8, x, y - r * .85); g.quadraticCurveTo(x + r * .8, y - r * .8, x + r * .75, y + r * .55); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#7d5230'; g.beginPath(); g.arc(x, y + r * .7, r * .2, 0, 7); g.fill(); g.stroke(); }
    else if (kind === 3) { g.fillStyle = '#4fd8ff'; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r * .8, y - r * .1); g.lineTo(x, y + r); g.lineTo(x - r * .8, y - r * .1); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x - r * .8, y - r * .1); g.lineTo(x + r * .8, y - r * .1); g.stroke(); }
    else { g.fillStyle = '#ffd34a'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); g.stroke(); } }
  const REP = c => { const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 8; return t; };
  const ornament = (g, x, y, r, gold, dark) => { g.save(); g.translate(x, y); g.strokeStyle = gold; g.fillStyle = gold; g.lineWidth = r * .09;
    for (let k = 0; k < 8; k++) { g.rotate(Math.PI / 4); g.beginPath(); g.ellipse(0, -r * .62, r * .17, r * .42, 0, 0, 7); g.stroke(); }
    g.beginPath(); g.arc(0, 0, r * .2, 0, 7); g.fill(); g.fillStyle = dark; g.beginPath(); g.arc(0, 0, r * .08, 0, 7); g.fill(); g.restore(); };
  let SG = null, EG = null;
  const SEQ = [[0, 2, 4, 1, 3], [2, 4, 0, 3, 1], [4, 0, 2, 1, 3]];
  function drawSlot(g, w, h, off, lit) { g.fillStyle = '#2a1030'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff6d8'; g.fillRect(40, 60, w - 80, h - 120); g.strokeStyle = KK; g.lineWidth = 10; g.strokeRect(40, 60, w - 80, h - 120);
    for (let i = 0; i < 3; i++) { const x0 = 56 + i * 216; g.fillStyle = '#ffffff'; g.fillRect(x0, 74, 200, h - 148); g.save(); g.beginPath(); g.rect(x0, 74, 200, h - 148); g.clip(); const o = off[i], base = Math.floor(o), fr = o - base;
      for (let j = -1; j < 4; j++) fruit(g, SEQ[i][((base + j) % 5 + 5) % 5], x0 + 100, 134 + (j - fr) * 112, 40); g.restore(); g.strokeStyle = KK; g.lineWidth = 10; g.strokeRect(x0, 74, 200, h - 148); }
    g.strokeStyle = '#e3243a'; g.lineWidth = 7; g.beginPath(); g.moveTo(34, h / 2); g.lineTo(w - 34, h / 2); g.stroke();
    const ph = lit ? Math.floor(lit * 8) % 2 : 0; for (let k = 0; k < 18; k++) { g.fillStyle = (k + ph) % 2 ? '#ffe34a' : '#ff4f9a'; g.beginPath(); g.arc(30 + k * 42, 28, 11, 0, 7); g.fill(); g.beginPath(); g.arc(30 + k * 42, h - 28, 11, 0, 7); g.fill(); } }
  function drawEEG(g, w, h, t, amp) { g.fillStyle = '#0c2236'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(120,230,255,.18)'; g.lineWidth = 2; for (let x = 0; x < w; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    [['#5fe0d4', 90], ['#ffd34a', 200], ['#ff4f9a', 310]].forEach(([c, y0], i) => { g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); for (let x = 0; x <= w; x += 5) { const u = x * .05 - t * 6 + i * 2, a = (6 + 6 * Math.sin(u * .7)) + amp * 40 * Math.max(0, Math.sin(u * 1.9)) ** 3; g.lineTo(x, y0 + Math.sin(u * 2.3) * a); } g.stroke(); }); }
  function paintSigns() {
    const S = {
      wallpaper: (() => { const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'); g.fillStyle = '#8c1f3d'; g.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#9a2a4a' : '#841a37'; g.fillRect(i * 64, 0, 64, 512); }
        for (const [x, y] of [[128, 128], [384, 128], [128, 384], [384, 384], [256, 256], [0, 256], [512, 256], [256, 0], [256, 512]]) { g.fillStyle = 'rgba(255,255,255,.06)'; g.beginPath(); g.moveTo(x, y - 80); g.lineTo(x + 56, y); g.lineTo(x, y + 80); g.lineTo(x - 56, y); g.closePath(); g.fill(); ornament(g, x, y, 54, '#e8b440', '#5a1228'); }
        g.strokeStyle = 'rgba(240,190,70,.55)'; g.lineWidth = 3; for (const k of [0, 256]) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 512); g.stroke(); } return REP(c); })(),
      runner: (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#8f1d3e'; g.fillRect(0, 0, 256, 256);
        g.fillStyle = '#6e1531'; g.fillRect(0, 0, 40, 256); g.fillRect(216, 0, 40, 256); g.strokeStyle = '#f0c24a'; g.lineWidth = 7; g.beginPath(); g.moveTo(40, 0); g.lineTo(40, 256); g.moveTo(216, 0); g.lineTo(216, 256); g.stroke();
        for (let k = 0; k < 2; k++) { const y = 64 + k * 128; g.fillStyle = '#a9304f'; g.beginPath(); g.moveTo(128, y - 62); g.lineTo(176, y); g.lineTo(128, y + 62); g.lineTo(80, y); g.closePath(); g.fill(); g.strokeStyle = '#f0c24a'; g.lineWidth = 6; g.stroke(); ornament(g, 128, y, 46, '#ffd96a', '#8f1d3e'); }
        g.fillStyle = '#2fd0c0'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(20, 32 + k * 64, 9, 0, 7); g.arc(236, 32 + k * 64, 9, 0, 7); g.fill(); } return REP(c); })(),
      ceilingp: (() => { const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'); g.fillStyle = '#6e1832'; g.fillRect(0, 0, 512, 512);
        g.strokeStyle = '#f0c24a'; g.lineWidth = 12; g.strokeRect(12, 12, 488, 488); g.fillStyle = '#4e1024'; g.fillRect(44, 44, 424, 424); g.strokeStyle = '#d9a43a'; g.lineWidth = 7; g.strokeRect(44, 44, 424, 424);
        ornament(g, 256, 256, 120, '#f0c24a', '#4e1024'); g.fillStyle = '#ff6fa8'; for (const [x, y] of [[90, 90], [422, 90], [90, 422], [422, 422]]) { g.beginPath(); g.arc(x, y, 16, 0, 7); g.fill(); g.strokeStyle = '#241c2c'; g.lineWidth = 4; g.stroke(); } return REP(c); })(),
      parquet: (() => { const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'); const cols = ['#b9824e', '#a8733f', '#c8925a', '#9d6a3a']; g.fillStyle = '#7d5230'; g.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.save(); g.translate(i * 64 + 32, j * 64 + 32); g.rotate((i + j) % 2 ? Math.PI / 4 : -Math.PI / 4); for (let k = 0; k < 3; k++) { g.fillStyle = cols[(i * 3 + j + k) % 4]; g.fillRect(-45, -30 + k * 20, 90, 18); g.strokeStyle = 'rgba(40,20,8,.55)'; g.lineWidth = 2; g.strokeRect(-45, -30 + k * 20, 90, 18); } g.restore(); } return REP(c); })(),
      tilep: (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? '#cfeae5' : '#f3f8f8'; g.fillRect(i * 128, j * 128, 128, 128); } g.strokeStyle = '#9ab8b4'; g.lineWidth = 5; g.strokeRect(0, 0, 256, 256); g.beginPath(); g.moveTo(128, 0); g.lineTo(128, 256); g.moveTo(0, 128); g.lineTo(256, 128); g.stroke(); return REP(c); })(),
      art1: cv(1024, 768, (g, w, h) => { g.fillStyle = '#ffe9b0'; g.fillRect(0, 0, w, h); [[60, 80, 300, 300, '#e3453a'], [400, 40, 260, 420, '#4f8fe8'], [700, 120, 260, 240, '#ffd34a'], [120, 430, 380, 260, '#43bd65'], [560, 420, 360, 300, '#8a63d2']].forEach(([x, y, bw, bh, c2]) => { g.fillStyle = c2; g.fillRect(x, y, bw, bh); g.strokeStyle = KK; g.lineWidth = 10; g.strokeRect(x, y, bw, bh); });
        g.fillStyle = '#fff'; g.beginPath(); g.arc(250, 230, 80, 0, 7); g.fill(); g.stroke(); g.fillStyle = KK; g.beginPath(); g.arc(250, 230, 28, 0, 7); g.fill(); }),
      art2: cv(768, 1024, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ff7a59'); gr.addColorStop(.5, '#ffd34a'); gr.addColorStop(1, '#2cc4b4'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.strokeStyle = KK; g.lineWidth = 14; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(w / 2, h * .58, 60 + i * 55, Math.PI * (.1 + i * .02), Math.PI * (1.9 - i * .02)); g.stroke(); } g.fillStyle = '#fff'; g.beginPath(); g.arc(w / 2, h * .58, 46, 0, 7); g.fill(); g.stroke(); }),
      art3: cv(1024, 768, (g, w, h) => { g.fillStyle = '#2cc4b4'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd34a'; g.beginPath(); g.arc(780, 190, 110, 0, 7); g.fill(); g.strokeStyle = KK; g.lineWidth = 10; g.stroke();
        for (let i = 0; i < 5; i++) { g.fillStyle = ['#e3453a', '#8a63d2', '#ff9a3c', '#43bd65', '#4f8fe8'][i]; g.beginPath(); g.arc(150 + i * 180, 560 + (i % 2) * 40, 80, 0, 7); g.fill(); g.stroke(); } g.fillStyle = '#fff'; g.fillRect(0, 700, w, 68); g.strokeRect(0, 700, w, 68); }),
      icon1: cv(512, 512, (g, w, h) => { g.fillStyle = '#2a1030'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2f9a52'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(180, 330); g.quadraticCurveTo(230, 90, 330, 70); g.moveTo(330, 350); g.quadraticCurveTo(320, 150, 330, 70); g.stroke(); g.fillStyle = '#4fd05a'; g.beginPath(); g.ellipse(380, 90, 70, 30, -.3, 0, 7); g.fill();
        [[170, 360], [330, 380]].forEach(([x, y]) => { g.fillStyle = '#ff2f50'; g.beginPath(); g.arc(x, y, 96, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 10; g.stroke(); g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(x - 32, y - 34, 22, 14, -.6, 0, 7); g.fill(); }); }),
      icon2: cv(512, 512, (g, w, h) => { g.fillStyle = '#2a1030'; g.fillRect(0, 0, w, h); g.fillStyle = '#3fe0ff'; g.strokeStyle = '#fff'; g.lineWidth = 14; g.lineJoin = 'round'; g.beginPath(); g.moveTo(256, 70); g.lineTo(420, 210); g.lineTo(256, 450); g.lineTo(92, 210); g.closePath(); g.fill(); g.stroke();
        g.beginPath(); g.moveTo(92, 210); g.lineTo(420, 210); g.moveTo(180, 210); g.lineTo(256, 450); g.moveTo(332, 210); g.lineTo(256, 450); g.moveTo(180, 210); g.lineTo(256, 70); g.moveTo(332, 210); g.lineTo(256, 70); g.stroke(); }),
      icon3: cv(512, 512, (g, w, h) => { g.fillStyle = '#2a1030'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffd34a'; g.lineWidth = 52; g.lineCap = 'round'; g.beginPath(); g.arc(256, 280, 130, Math.PI * .9, Math.PI * 2.1); g.stroke(); g.lineWidth = 14; g.strokeStyle = '#fff'; g.beginPath(); g.arc(256, 280, 130, Math.PI * .95, Math.PI * 2.05); g.stroke();
        g.fillStyle = '#ff9a3c'; g.strokeStyle = '#fff'; g.lineWidth = 8; for (const [x, y] of [[126, 296], [386, 296], [140, 380], [372, 380]]) { g.beginPath(); g.arc(x, y, 14, 0, 7); g.fill(); g.stroke(); } }),
      icon4: cv(512, 512, (g, w, h) => { g.fillStyle = '#2a1030'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.strokeStyle = '#ff4f9a'; g.lineWidth = 16; g.fillRect(96, 96, 320, 320); g.strokeRect(96, 96, 320, 320); g.fillStyle = '#1b1720';
        for (const [x, y] of [[170, 170], [342, 170], [256, 256], [170, 342], [342, 342]]) { g.beginPath(); g.arc(x, y, 30, 0, 7); g.fill(); } }),
      // moqueta de casino: rombos dorados sobre burdeos con flores azul petróleo
      carpet: (() => { const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'); g.fillStyle = '#80193a'; g.fillRect(0, 0, 512, 512); const rn = rn0(11);
        for (let i = -1; i < 5; i++) for (let j2 = -1; j2 < 9; j2++) { const cx = i * 128 + (j2 % 2) * 64, cy = j2 * 64; g.save(); g.translate(cx, cy); g.fillStyle = (i + j2) % 2 ? '#b0304f' : '#621329'; g.beginPath(); g.moveTo(0, -60); g.lineTo(60, 0); g.lineTo(0, 60); g.lineTo(-60, 0); g.closePath(); g.fill();
          g.strokeStyle = '#f0c24a'; g.lineWidth = 5; g.stroke(); g.fillStyle = '#ffd96a'; g.beginPath(); g.arc(0, 0, 10, 0, 7); g.fill(); g.fillStyle = '#2fd0c0'; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(Math.cos(k * 1.571) * 26, Math.sin(k * 1.571) * 26, 9, 4.5, k * 1.571, 0, 7); g.fill(); } g.fillStyle = '#ff6fa8'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(Math.cos(k * 1.571 + .785) * 40, Math.sin(k * 1.571 + .785) * 40, 4, 0, 7); g.fill(); } g.restore(); }
        return REP(c); })(),
      // pantalla de la tragaperras: tres rodillos con frutas y bombillas
      slotscr: cv(768, 512, (g, w, h) => { SG = g; drawSlot(g, w, h, [0, 0, 0], 0); }),
      // esfera de reloj sin números: solo marcas
      clockface: cv(512, 512, (g, w, h) => { g.fillStyle = '#fffbe8'; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.strokeStyle = KK; g.lineWidth = 12; g.stroke();
        for (let k = 0; k < 60; k++) { const a = k * Math.PI / 30, big = k % 5 === 0, r0 = big ? 196 : 222, r1 = 236; g.lineWidth = big ? (k % 15 === 0 ? 16 : 10) : 4; g.strokeStyle = KK; g.beginPath(); g.moveTo(256 + Math.sin(a) * r0, 256 - Math.cos(a) * r0); g.lineTo(256 + Math.sin(a) * r1, 256 - Math.cos(a) * r1); g.stroke(); } }),
      // la ciudad de día que se ve a través del cristal
      daycity: cv(2048, 360, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#46a2f6'); gr.addColorStop(.6, '#9bd6ff'); gr.addColorStop(1, '#eaf6ff'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const rn = rn0(5);
        g.fillStyle = '#fff6c0'; g.beginPath(); g.arc(1540, 80, 52, 0, 7); g.fill();
        for (let i = 0; i < 9; i++) { const cx = rn() * w, cy = 40 + rn() * 120; g.fillStyle = '#fff'; g.strokeStyle = '#a9c8e8'; g.lineWidth = 4; g.beginPath(); for (let k = 0; k < 5; k++) g.arc(cx + k * 34 - 60, cy + (k % 2) * -14, 36 + (k % 3) * 8, 0, 7); g.fill(); }
        for (let i = 0; i < 34; i++) { const bw = 70 + rn() * 80, bh = 90 + rn() * 190, x = i * 62 - 20; g.fillStyle = ['#e8c8a0', '#c8d8f0', '#f0a07a', '#d0b8e8', '#a8d8c0'][i % 5]; g.fillRect(x, h - 56 - bh, bw, bh); g.strokeStyle = KK; g.lineWidth = 4; g.strokeRect(x, h - 56 - bh, bw, bh);
          g.fillStyle = '#7fb8f0'; for (let yy = h - 56 - bh + 12; yy < h - 70; yy += 24) for (let xx = x + 10; xx < x + bw - 12; xx += 20) g.fillRect(xx, yy, 10, 14); }
        g.fillStyle = '#4dbb6a'; g.fillRect(0, h - 56, w, 56); for (let i = 0; i < 40; i++) { g.fillStyle = '#2f9a52'; g.beginPath(); g.arc(i * 52 + 20, h - 60, 24 + (i % 3) * 6, 0, 7); g.fill(); g.strokeStyle = KK; g.lineWidth = 3; g.stroke(); } }),
      // planos del casino: papel azul con líneas blancas (sin texto)
      plan1: cv(1024, 640, (g, w, h) => { g.fillStyle = '#2f5fb8'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 2; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        g.strokeStyle = '#fff'; g.lineWidth = 8; g.strokeRect(60, 60, w - 120, h - 120); [[300, 60, 300, 340], [300, 340, 560, 340], [560, 200, 560, 580], [560, 200, 820, 200], [820, 200, 820, 460], [180, 460, 440, 460], [180, 200, 180, 460]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); }); g.fillStyle = '#ffd34a'; [[240, 400], [640, 300], [900, 520]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 18, 0, 7); g.fill(); }); }),
      plan2: cv(1280, 700, (g, w, h) => { g.fillStyle = '#fff6dc'; g.fillRect(0, 0, w, h); const rn = rn0(3); g.strokeStyle = KK; g.lineWidth = 8; g.strokeRect(30, 30, w - 60, h - 60);
        for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) { g.fillStyle = ['#ffd2d8', '#cfe8ff', '#d8f0c8', '#ffe9a8'][(i + j) % 4]; g.fillRect(70 + i * 128, 70 + j * 120, 100, 92); g.strokeRect(70 + i * 128, 70 + j * 120, 100, 92); }
        const gx = i => 70 + i * 128 - 14, gy = j => 70 + j * 120 - 14, R = [[0, 5], [0, 4], [1, 4], [1, 2], [0, 2], [0, 1], [2, 1], [2, 3], [3, 3], [3, 0]];
        g.lineWidth = 9; g.strokeStyle = '#e3243a'; g.setLineDash([22, 14]); g.lineCap = 'round'; g.beginPath(); R.forEach(([i, j], k) => k ? g.lineTo(gx(i), gy(j)) : g.moveTo(gx(i), gy(j))); g.stroke(); g.setLineDash([]);
        g.fillStyle = '#e3243a'; g.beginPath(); g.moveTo(gx(3) - 22, gy(0) + 10); g.lineTo(gx(3) + 22, gy(0) + 10); g.lineTo(gx(3), gy(0) - 26); g.closePath(); g.fill(); }),
      plan3: cv(600, 800, (g, w, h) => { g.fillStyle = '#fbf0d2'; g.fillRect(0, 0, w, h); g.strokeStyle = KK; g.lineWidth = 8; g.strokeRect(24, 24, w - 48, h - 48); g.lineWidth = 6; g.beginPath(); g.moveTo(60, 620); g.lineTo(60, 420); g.lineTo(300, 300); g.lineTo(540, 420); g.lineTo(540, 620); g.closePath(); g.stroke();
        g.fillStyle = '#ffc928'; g.beginPath(); g.arc(300, 170, 80, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#e3243a'; g.fillRect(250, 450, 100, 170); g.strokeRect(250, 450, 100, 170); }),
      // pantalla del laboratorio: ondas y rejilla
      eeg: cv(640, 400, (g, w, h) => { EG = g; drawEEG(g, w, h, 0, 0); }),
      chart: cv(1024, 480, (g, w, h) => { g.fillStyle = '#fbfbf4'; g.fillRect(0, 0, w, h); g.strokeStyle = KK; g.lineWidth = 8; g.beginPath(); g.moveTo(80, 40); g.lineTo(80, h - 60); g.lineTo(w - 60, h - 60); g.stroke();
        [[150, 170], [300, 240], [450, 130], [600, 300], [750, 200]].forEach(([x, bh], i) => { g.fillStyle = ['#e3453a', '#4f8fe8', '#ffd34a', '#43bd65', '#8a63d2'][i]; g.fillRect(x, h - 60 - bh, 90, bh); g.strokeRect(x, h - 60 - bh, 90, bh); }); }),
    };
    for (const k in S) if (SIGN[k]) { SIGN[k].map = S[k]; SIGN[k].needsUpdate = true; }
  }

  // ---------- sitios, carga del GLB y objetos sueltos ----------
  const G = {}, SITES = {}, SLOTS = []; ['hall', 'office', 'glass', 'maze', 'lab'].forEach(n => { SITES[n] = new T.Group(); SITES[n].visible = false; scene.add(SITES[n]); });
  const READY_W = new Promise((resolve, reject) => {
    const b64 = window.GLB_CASINO, bin = atob(b64), buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    Promise.resolve(document.fonts && document.fonts.load ? document.fonts.load('900 100px Inter') : 0).then(() => new GLTFLoader().parse(buf.buffer, '', gl => {
      gl.scene.children.slice().forEach(o => { G[o.name] = o; });
      Object.values(G).forEach(o => meshesOf(o).forEach(me => { const ms = Array.isArray(me.material) ? me.material.map(toon) : toon(me.material); me.material = ms; me.castShadow = true; me.receiveShadow = true; { const nm0 = (Array.isArray(me.material) ? me.material[0] : me.material).name; if (PAINTED.test(nm0)) { me.receiveShadow = false; } } }));
      Object.values(G).forEach(o => meshesOf(o).forEach(me => { const nm = (Array.isArray(me.material) ? me.material[0] : me.material).name; if (PAINTED.test(nm) && !me.geometry.attributes.uv) { if (TILE[nm]) boxUV(me.geometry, TILE[nm]); else planarUV(me.geometry, null); } }));
      paintSigns(); build(); resolve(); }, e => reject(e)));
  });
  function boxUV(geo, tile) { const p = geo.attributes.position, n = geo.attributes.normal, uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) { const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i)), nz = Math.abs(n.getZ(i)); let u, v;
      if (ny >= nx && ny >= nz) { u = p.getX(i); v = p.getZ(i); } else if (nx >= nz) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
      uv[i * 2] = u / tile; uv[i * 2 + 1] = v / tile; }
    geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); }
  function planarUV(geo, force) {
    const p = geo.attributes.position; geo.computeBoundingBox(); const bb = geo.boundingBox, sz = bb.getSize(new T.Vector3()), ax = force || (sz.z <= sz.x && sz.z <= sz.y ? ['x', 'y'] : (sz.x <= sz.y ? ['z', 'y'] : ['x', 'z'])), uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) { uv[i * 2] = (p['get' + ax[0].toUpperCase()](i) - bb.min[ax[0]]) / Math.max(1e-6, sz[ax[0]]); uv[i * 2 + 1] = (p['get' + ax[1].toUpperCase()](i) - bb.min[ax[1]]) / Math.max(1e-6, sz[ax[1]]); }
    geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); }
  const place = (o, site, x, y, z, ry = 0, s = 1) => { const c = o.clone(true); c.position.set(x, y, z); c.rotation.y = ry; c.scale.setScalar(s); SITES[site].add(c); return c; };
  const LAY2 = LAY.clock; let CLOCK = null, HM = null, HH = null, CLOTH = null, PLASTIC = null, CEIL = null;
  const sunbeam = new T.CanvasTexture(((c) => { c.width = 64; c.height = 256; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, 'rgba(255,248,210,.55)'); gr.addColorStop(1, 'rgba(255,248,210,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 256); const gx = g.createLinearGradient(0, 0, 64, 0); gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(.5, 'rgba(0,0,0,0)'); gx.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = gx; g.fillRect(0, 0, 64, 256); return c; })(document.createElement('canvas')));
  const BEAMS = [];
  function build() {
    ['hall', 'office', 'glass', 'maze', 'lab'].forEach(n => { inkify(G[n]); SITES[n].add(G[n]); SITES[n].add(G[n + '_floor']); });
    inkify(G.corr); SITES.maze.add(G.corr); SITES.maze.add(G.corr_floor);
    inkify(G.maze_ceiling); CEIL = G.maze_ceiling; SITES.maze.add(CEIL);
    ['slot', 'clock_big', 'hand_min', 'hand_hour', 'cloth', 'plastic'].forEach(n => { inkify(G[n]); G[n].visible = false; });
    CLOCK = place(G.clock_big, 'hall', LAY2.x, LAY2.y, LAY2.z, 0, 1); CLOCK.visible = true; HM = place(G.hand_min, 'hall', LAY2.x, LAY2.y, LAY2.z + .3, 0, 1); HM.visible = true; HH = place(G.hand_hour, 'hall', LAY2.x, LAY2.y, LAY2.z + .27, 0, 1); HH.visible = true;
    CLOTH = place(G.cloth, 'hall', LAY2.x, LAY2.y + 3.4, LAY2.z + .5, 0, 1); CLOTH.visible = true;
    PLASTIC = place(G.plastic, 'glass', LAY.sites.glass[0], 0, LAY.glassz + .15, 0, 1); PLASTIC.scale.set(32, .001, 1); PLASTIC.visible = true;
    ['art1', 'art2', 'art3', 'icon1', 'icon2', 'icon3', 'icon4'].forEach(n => { inkify(G[n]); G[n].visible = false; });
    const put = (n, site, x, y, z, ry = 0, s = 1) => { const c = place(G[n], site, x, y, z, ry, s); c.visible = true; return c; };
    put('art1', 'hall', -6.2, 3.3, -17.55, 0, .9); put('art3', 'hall', 6.2, 3.3, -17.55, 0, .9); put('art2', 'hall', -10.2, 2.9, -17.55, 0, .8); put('art2', 'hall', 10.2, 2.9, -17.55, 0, .8);
    [-8, -2, 4, 10, 16, 22].forEach((z, k) => [-1, 1].forEach(sd => put('icon' + (1 + ((k + (sd > 0 ? 2 : 0)) % 4)), 'hall', sd * 4.6, 3.25, z, -sd * Math.PI / 2, .85)));
    const O0 = LAY.sites.office[0], L0 = LAY.sites.lab[0], G0 = LAY.sites.glass[0];
    put('art2', 'office', O0 - 4.4, 2.8, -7.72, 0, 1.0); put('art3', 'office', O0 + 4.4, 2.8, -7.72, 0, .9); put('art1', 'office', O0, 1.2, 8.95, Math.PI, .8);
    put('art1', 'lab', L0 + 1.2, 3.2, -7.55, 0, .9); put('art3', 'lab', L0 - 1.9, 3.2, -7.55, 0, .75);
    put('art1', 'glass', G0 - 13, 3.0, 26.9, Math.PI, 1.0); put('art3', 'glass', G0 + 13, 3.0, 26.9, Math.PI, 1.0);
    // rayos de sol que entran por el cristal
    for (let i = 0; i < 7; i++) { const b = new T.Mesh(new T.PlaneGeometry(2.4 + (i % 3) * .8, 15), new T.MeshBasicMaterial({ map: sunbeam, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, opacity: .32, side: T.DoubleSide }));
      b.position.set(LAY.sites.glass[0] - 12 + i * 4, 3.2, -9); b.rotation.set(-.5, 0, .22); b.renderOrder = 2; SITES.glass.add(b); BEAMS.push(b); }
  }
  // tragaperras «héroe» con pantalla pintada, para planos cortos (se coloca donde haga falta)
  const hero = (site, x, y, z, ry = 0, s = 1) => { const c = place(G.slot, site, x, y, z, ry, s); c.visible = true; SLOTS.push(c); return c; };
  const clear = () => { SLOTS.splice(0).forEach(c => c.parent && c.parent.remove(c)); };
  const clock = (hh = 8, mm = 0, cover = 0) => { if (!CLOCK) return; HM.rotation.z = -mm / 60 * Math.PI * 2; HH.rotation.z = -((hh % 12) + mm / 60) / 12 * Math.PI * 2; CLOTH.position.y = LAY2.y + 3.4 - 3.4 * cover; CLOTH.visible = cover > .001; };
  const plastic = k => { BEAMS.forEach(b => { b.material.opacity = .32 * (1 - Math.min(1, k * 1.4)); }); if (PLASTIC) { PLASTIC.scale.y = Math.max(.001, 6.2 * k); PLASTIC.position.y = 0; PLASTIC.visible = k > .001; } };
  const ceiling = on => { if (CEIL) CEIL.visible = !!on; };
  const slotScr = (off, lit = 0) => { if (SG && SIGN.slotscr) { drawSlot(SG, 768, 512, off, lit); SIGN.slotscr.map.needsUpdate = true; } };
  const eeg = (t, amp = 0) => { if (EG && SIGN.eeg) { drawEEG(EG, 640, 400, t, amp); SIGN.eeg.map.needsUpdate = true; } };
  function site(n) { Object.keys(SITES).forEach(k => SITES[k].visible = k === n); sky.visible = false; BEAMS.forEach(b => b.visible = n === 'glass'); }

  // ---------- ambientes ----------
  const MOODS = {
    casino: { sun: '#ffe0b8', sunI: 1.3, dir: [-.2, .8, .6], hemi: '#fff4e8', ground: '#c05878', hemiI: 3.0, fog: '#6a1c3c', fogD: .0026, top: '#2a0c1a', mid: '#3a1226', hor: '#4a1a30', cloud: 2, bloom: .3 },
    oficina: { sun: '#ffe3b0', sunI: 1.2, dir: [-.2, .8, .6], hemi: '#fff4e0', ground: '#b87858', hemiI: 2.8, fog: '#6a2a3a', fogD: .0028, top: '#3a1220', mid: '#4a1a2a', hor: '#5a2030', cloud: 2, bloom: .2 },
    dia: { sun: '#fff4d8', sunI: 1.6, dir: [-.3, .8, .5], hemi: '#ffffff', ground: '#ffd9a8', hemiI: 2.1, fog: '#f0d8c8', fogD: .0028, top: '#46a2f6', mid: '#9bd6ff', hor: '#eaf6ff', cloud: 2, bloom: .22 },
    laberinto: { sun: '#ffd0a8', sunI: 1.0, dir: [-.2, .9, .5], hemi: '#ffd8b0', ground: '#7a2a40', hemiI: 2.6, fog: '#4a1428', fogD: .0034, top: '#200a14', mid: '#2a0c1a', hor: '#3a1224', cloud: 2, bloom: .28 },
    lab: { sun: '#ffffff', sunI: 1., dir: [-.2, .9, .5], hemi: '#ffffff', ground: '#d8f0ea', hemiI: 2.3, fog: '#e8f6f2', fogD: .0026, top: '#cfe8e2', mid: '#dff2ee', hor: '#eef8f5', cloud: 2, bloom: .1 },
  };
  let MOOD = 'casino';
  function setMood(m) { if (!MOODS[m]) m = 'casino'; MOOD = m; const Mo = MOODS[m]; sun.color.set(Mo.sun); sun.intensity = Mo.sunI; SUN.set(...Mo.dir).normalize(); hemi.color.set(Mo.hemi); hemi.groundColor.set(Mo.ground); hemi.intensity = Mo.hemiI;
    scene.fog.color.set(Mo.fog); scene.fog.density = Mo.fogD; skyU.top.value.set(Mo.top); skyU.mid.value.set(Mo.mid); skyU.hor.value.set(Mo.hor); skyU.cloud.value = Mo.cloud; bloom.strength = Mo.bloom; }
  function setCam(pos, look, fov = 40, focus = null, ap = .0004) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    const D = Math.max(18, Math.min(150, pos.distanceTo(look) * 1.1)); const sc = sun.shadow.camera; if (sc.right !== D) { sc.left = -D; sc.right = D; sc.top = D; sc.bottom = -D; sc.near = 1; sc.far = D * 6; sc.updateProjectionMatrix(); }
    sun.position.copy(look).addScaledVector(SUN, D * 3); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  // ---------- post: brillo suave, desenfoque de fondo, color vivo ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .14, .6, .92); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .0004, maxblur: .004 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null } }, depthTest: false, depthWrite: false, vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c=mix(vec3(l),c,1.14); c=c*c*(3.-2.*c)*.2+c*.8; gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  const FGC = document.createElement('canvas'); FGC.width = W; FGC.height = H; FGC.id = 'gl2'; FGC.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none'; (document.getElementById('stage') || document.body).appendChild(FGC);
  function render() { comp.render(); }
  function setTime(t) { skyU.time.value = t; uTime.value = t; TICK.forEach(f => f(t)); }
  const ground = (x, z, siteName) => 0;
  return { T, scene, camera, R, comp, setCam, proj, render, setTime, setMood, site, ground, SUN, G, SITES, READY_W, sky, dof, bloom, inkify, toon, place, TICK, hero, clear, clock, plastic, ceiling, slotScr, eeg, get mood() { return MOOD; } };
})();

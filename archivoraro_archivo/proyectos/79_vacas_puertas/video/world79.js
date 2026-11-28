// Archivo Raro · mundo 3D (bocetos 79): establo turco de día, el prado de las gafas y el pasillo de la residencia.
// Decorados de Blender (sets79.glb → glb79.js) con sombreado de tebeo, contorno, texturas pintadas en canvas, haces de luz con polvo, cielo de día con nubes.
// Sitios: barn (0) · meadow (1000) · hall (2000).   API: setCam, proj, render, setTime, setMood, site, doorMode, setChalk.
window.GLC = document.getElementById('gl');
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920, LAY = window.LAYOUT;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NoToneMapping; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(40, W / H, .1, 900);
  const TICK = [], uTime = { value: 0 };

  // ---------- cielo de día con nubes y sol ----------
  const skyU = { top: { value: new T.Color('#3f86e0') }, hor: { value: new T.Color('#d6ecff') }, time: { value: 0 }, sunD: { value: new T.Vector3(.4, .55, -.7).normalize() } };
  const sky = new T.Mesh(new T.SphereGeometry(800, 48, 24), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform vec3 top, hor, sunD; uniform float time; varying vec3 vd;
      float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
      float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*n2(p); p*=2.1; a*=.5; } return s; }
      void main(){ float h=vd.y; vec3 c=mix(hor, top, smoothstep(-.02,.5,h)); vec2 q=vd.xz/(h+.25)*1.6+vec2(time*.02,0.);
        float cl=smoothstep(.52,.78,fbm(q))*smoothstep(.0,.18,h); vec3 cc=mix(vec3(1.),vec3(.78,.82,.9),smoothstep(.6,.9,fbm(q+vec2(.3,.6))));
        c=mix(c,cc,cl*.92); float s=max(0.,dot(vd,sunD)); c+=vec3(1.,.95,.8)*(smoothstep(.9985,.9995,s)+pow(s,60.)*.35); gl_FragColor=vec4(c,1.);
#include <colorspace_fragment>
      }` }));
  sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky);
  scene.fog = new T.FogExp2('#cfe2f2', .004);
  const hemi = new T.HemisphereLight('#ffffff', '#ffd9a0', 1.2); scene.add(hemi);
  { const es = new T.Scene(); es.background = new T.Color('#8aa8c8'); const add = (c, x, y, z, w, h, i = 2) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(i), side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); };
    add('#ffffff', 0, 9, 0, 10, 10, 2.2); add('#ffd9a0', -7, 2, -5, 6, 3); add('#a8d0ff', 7, 3, 4, 6, 3); add('#a89a80', 0, -6, 0, 12, 12, 1);
    const pm = new T.PMREMGenerator(R); scene.environment = pm.fromScene(es, 0, .1, 100).texture; }
  const SUN = new T.Vector3(-.3, .8, .5).normalize();
  const sun = new T.DirectionalLight('#fff1c9', 1.4); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0004; sun.shadow.normalBias = .06; scene.add(sun, sun.target);

  // ---------- materiales de tebeo + materiales que brillan ----------
  const MATS = {}, SIGN = {};
  const PAINTED = /^(daysign|chalk2|sack|shopsign|win_snow|barnext|snowg|stain|tvscreen|radiof|photo|kit|barnwall|barnfloor|straw|plank|roof|win_day|chalk|calendar|vrbox|tankl|grass|hills|hallwall|wainscot|lino|fluor|exitdoor|mural|exitsign|roomdoor|plate|hallwin|painting|clock|notice|keypad)$/;
  const TILE = { barnext: 2.4, snowg: 6, barnwall: 3, barnfloor: 4, straw: 1.6, plank: 2.5, roof: 2.5, grass: 5, hills: 9, hallwall: 2.5, wainscot: 2, lino: 2.2 };
  const GLOW = /^(fire|lamp|win_day|win_snow|glassw|tvscreen|fluor|exitsign|hallwin|snow)$/;
  function toon(m) { if (MATS[m.name]) return MATS[m.name]; let o;
    if (GLOW.test(m.name)) { o = new T.MeshBasicMaterial({ color: m.color.clone(), fog: m.name === 'snow' }); o.name = m.name; if (PAINTED.test(m.name)) { o.color.set('#ffffff'); SIGN[m.name] = o; } return (MATS[m.name] = o); }
    const RG = { steel: [.25, .85], galv: [.38, .75], steeld: [.35, .8], iron: [.45, .6], tankl: [.28, .8], lino: [.22, 0], rubber: [.9, 0], wood: [.6, 0], woodd: [.6, 0], rail: [.4, 0], chair: [.45, 0], blue: [.15, .1] }[m.name] || [.8, 0];
    o = new T.MeshStandardMaterial({ color: m.color.clone(), roughness: RG[0], metalness: RG[1], envMapIntensity: .55 }); o.name = m.name;
    if (PAINTED.test(m.name)) { o.color.set('#ffffff'); SIGN[m.name] = o; }
    if (m.name === 'stain') { o.transparent = true; o.depthWrite = false; }
    if (m.name === 'water') { o.roughness = .08; o.metalness = .3; o.color.set('#4a98d8'); }
    o.onBeforeCompile = sh => { sh.vertexShader = 'varying vec3 vWP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = 'varying vec3 vWP;\nfloat mh(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }\nfloat mn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(mix(mh(i), mh(i + vec3(1,0,0)), f.x), mix(mh(i + vec3(0,1,0)), mh(i + vec3(1,1,0)), f.x), f.y), mix(mix(mh(i + vec3(0,0,1)), mh(i + vec3(1,0,1)), f.x), mix(mh(i + vec3(0,1,1)), mh(i + vec3(1,1,1)), f.x), f.y), f.z); }\n' + sh.fragmentShader
        .replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb *= .93 + .12 * mn(vWP * 2.3) + .05 * mn(vWP * 9.);'); };
    return (MATS[m.name] = o); }
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0031 }, col: { value: new T.Color('#1e1418') } },
    vertexShader: `uniform float k; void main(){ vec3 p=position, n=normal; mat4 M=modelViewMatrix; vec4 mv=M*vec4(p,1.); vec3 nn=normalize(mat3(M)*n); mv.xyz+=nn*clamp(-mv.z*k,.012,.5); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.);\n#include <colorspace_fragment>\n}' });
  const hullOf = g => { let h = g.clone(); ['normal', 'uv', 'color', 'uv1'].forEach(a => h.deleteAttribute(a)); h = mergeVertices(h, 2e-3); h.computeVertexNormals(); h.clearGroups(); return h; };
  const meshesOf = o => { const L = []; o.traverse(c => { if (c.isMesh && !c.userData.ink) L.push(c); }); return L; };

  // ---------- texturas pintadas ----------
  const KK = '#1e1418';
  const rn0 = s0 => { let s = s0; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const REP = c => { const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 16; return t; };
  const cv = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 16; return t; };
  const tex = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); return REP(c); };
  const speck = (g, w, h, n, cols, r0, r1, rn) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; g.beginPath(); g.arc(rn() * w, rn() * h, r0 + rn() * (r1 - r0), 0, 7); g.fill(); } };
  const txt = (g, s, x, y, size, col, st = null, sw = 0, wt = 900, font = 'Inter') => { g.font = `${wt} ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle'; if (st) { g.strokeStyle = st; g.lineWidth = sw; g.lineJoin = 'round'; g.strokeText(s, x, y); } g.fillStyle = col; g.fillText(s, x, y); };
  let CH = null, CHN = 22, WS = null, NIGHT = 0, TVG = null;
  function drawWin(g, w, h, night) { const gr = g.createLinearGradient(0, 0, 0, h);
    if (night) { gr.addColorStop(0, '#0c1630'); gr.addColorStop(.58, '#25335a'); gr.addColorStop(.59, '#8a9ac0'); gr.addColorStop(1, '#5a6a94'); } else { gr.addColorStop(0, '#9aa6b8'); gr.addColorStop(.55, '#e4eaf2'); gr.addColorStop(.56, '#f4f8fc'); gr.addColorStop(1, '#dde6f0'); }
    g.fillStyle = gr; g.fillRect(0, 0, w, h); if (night) { g.fillStyle = '#fff8d8'; g.beginPath(); g.arc(w * .72, h * .2, 34, 0, 7); g.fill(); g.fillStyle = '#25335a'; g.beginPath(); g.arc(w * .69, h * .18, 30, 0, 7); g.fill(); }
    g.strokeStyle = night ? '#1a2440' : '#5a5048'; g.lineWidth = 6; for (const [x, s] of [[80, 1], [400, .8], [250, .6]]) { g.beginPath(); g.moveTo(x, h * .56); g.lineTo(x, h * .56 - 150 * s); g.stroke(); for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x, h * .56 - (40 + k * 25) * s); g.lineTo(x + (k % 2 ? 40 : -40) * s, h * .56 - (80 + k * 25) * s); g.stroke(); } }
    g.fillStyle = night ? '#9aaad0' : '#ffffff'; const rn = rn0(53); for (let i = 0; i < 120; i++) { g.beginPath(); g.arc(rn() * w, rn() * h * .9, 1.5 + rn() * 3, 0, 7); g.fill(); }
    g.fillStyle = night ? '#6a7aa8' : '#ffffff'; for (const [x, r] of [[60, 90], [300, 130], [480, 80]]) { g.beginPath(); g.ellipse(x, h * .6, r, 30, 0, 0, 7); g.fill(); } }
  function drawTV(g, w, h, t) { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1a3a7a'); gr.addColorStop(1, '#0a1a40'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2a5ab0'; g.fillRect(250, 30, 170, 110); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(335, 85, 50, 28, 0, 0, 7); g.fill(); g.fillStyle = '#1e1418'; g.fillRect(310, 70, 50, 16);   // recuadro: vaca con gafas
    const sh = Math.sin(t * 6) * 10; g.fillStyle = '#f4f4f0'; g.beginPath(); g.ellipse(140 + sh * .3, 330, 90, 120, 0, 0, 7); g.fill(); g.fillStyle = '#f2dcb8'; g.beginPath(); g.arc(140 + sh, 160, 62, 0, 7); g.fill();
    g.fillStyle = '#e8e8e8'; g.beginPath(); g.ellipse(140 + sh, 104, 64, 26, 0, 0, 7); g.fill(); g.strokeStyle = '#1e1418'; g.lineWidth = 6; g.beginPath(); g.arc(118 + sh, 160, 16, 0, 7); g.arc(164 + sh, 160, 16, 0, 7); g.stroke();
    g.fillStyle = '#c8342c'; g.fillRect(0, h - 64, w, 64); g.font = '900 30px Inter'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('NOTICIAS', 16, h - 32); g.globalAlpha = .9; g.fillStyle = 'rgba(255,255,255,.08)'; for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 1); g.globalAlpha = 1; }
  function chalkBg(g, w, h) { const rn = rn0(29); g.fillStyle = '#24463a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 26; i++) { g.fillStyle = 'rgba(255,255,255,.045)'; g.beginPath(); g.ellipse(rn() * w, rn() * h, 60 + rn() * 120, 20 + rn() * 40, rn() * 3, 0, 7); g.fill(); } }
  // v: número | {n, w (0–1 cuánto del número está escrito), arrow (0–1)} | {diagram (0–1)}
  function drawChalk(g, w, h, v) { chalkBg(g, w, h); const o = typeof v === 'object' ? v : { n: v };
    if (o.diagram !== undefined) { drawDiagram(g, w, h, o.diagram); return; }
    txt(g, 'LITROS POR VACA', w / 2, 92, 74, '#f4f2ea'); g.strokeStyle = '#f4f2ea'; g.lineWidth = 5; g.beginPath(); g.moveTo(170, 140); g.lineTo(w - 170, 140); g.stroke();
    const n = o.n, ww = o.w ?? 1; if (ww > 0) { g.save(); g.beginPath(); g.rect(0, 150, w * (.3 + .45 * ww), h); g.clip(); txt(g, String(n), w / 2, 330, 300, n > 22 ? '#ffe45a' : '#f4f2ea'); g.restore(); }
    const ar = o.arrow ?? (n > 22 ? 1 : 0); if (ar > 0) { g.strokeStyle = n > 22 ? '#ffe45a' : '#f4f2ea'; g.lineWidth = 12; g.lineCap = 'round'; const y0 = 440, y1 = 440 - 200 * ar; g.beginPath(); g.moveTo(w - 200, y0); g.lineTo(w - 170, y1); g.stroke(); if (ar > .9) { g.beginPath(); g.moveTo(w - 215, y1 + 30); g.lineTo(w - 170, y1); g.lineTo(w - 140, y1 + 36); g.stroke(); } }
    g.fillStyle = '#f4f2ea'; for (let k = 0; k < 5; k++) { g.fillRect(90 + k * 26, h - 110, 8, 60); } g.save(); g.translate(78, h - 80); g.rotate(-.5); g.fillRect(0, 0, 160, 8); g.restore(); }
  // diagrama de tiza: vaca nerviosa (nube con rayo, grifo cerrado, una gota) | vaca tranquila (sol, grifo abierto, chorro al cubo)
  function drawDiagram(g, w, h, k) { const C = '#f4f2ea', Y = '#ffe45a'; g.lineCap = 'round'; g.lineJoin = 'round';
    const cow = (cx, cy, s) => { g.strokeStyle = C; g.lineWidth = 7; g.beginPath(); g.ellipse(cx, cy, 120 * s, 70 * s, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(cx - 130 * s, cy - 40 * s, 45 * s, 40 * s, 0, 0, 7); g.stroke();
      for (const dx of [-80, -40, 40, 80]) { g.beginPath(); g.moveTo(cx + dx * s, cy + 60 * s); g.lineTo(cx + dx * s, cy + 140 * s); g.stroke(); } g.beginPath(); g.ellipse(cx + 10 * s, cy + 72 * s, 32 * s, 18 * s, 0, 0, 7); g.stroke(); };
    const tap = (x, y, open) => { g.strokeStyle = open ? Y : C; g.lineWidth = 9; g.beginPath(); g.moveTo(x - 30, y); g.lineTo(x + 30, y); g.moveTo(x, y); g.lineTo(x, y + 30); g.stroke(); g.beginPath(); g.arc(x, y - 18, 14, 0, 7); g.stroke();
      if (open) { g.lineWidth = 14; g.strokeStyle = '#ffffff'; g.beginPath(); g.moveTo(x, y + 34); g.bezierCurveTo(x + 6, y + 90, x - 6, y + 140, x, y + 190); g.stroke(); } else { g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x, y + 70, 8, 12, 0, 0, 7); g.fill(); } };
    const L = Math.min(1, k * 2), R = Math.max(0, k * 2 - 1);
    g.strokeStyle = C; g.lineWidth = 4; g.beginPath(); g.moveTo(w / 2, 30); g.lineTo(w / 2, h - 30); g.stroke();
    if (L > 0) { g.globalAlpha = Math.min(1, L * 1.6); cow(260, 330, 1); g.strokeStyle = C; g.lineWidth = 7; g.beginPath(); for (let i = 0; i < 5; i++) g.arc(170 + i * 45, 140, 34, Math.PI, 0); g.stroke(); g.strokeStyle = Y; g.lineWidth = 9; g.beginPath(); g.moveTo(270, 170); g.lineTo(240, 230); g.lineTo(275, 230); g.lineTo(245, 290); g.stroke();
      g.strokeStyle = C; g.lineWidth = 6; for (const [x, y] of [[110, 270], [100, 300]]) { g.beginPath(); g.moveTo(x, y); g.lineTo(x - 30, y - 10); g.stroke(); } tap(270, 470, false); txt(g, '−', 400, 560, 120, C); g.globalAlpha = 1; }
    if (R > 0) { g.globalAlpha = Math.min(1, R * 1.6); cow(780, 330, 1); g.strokeStyle = Y; g.lineWidth = 8; g.beginPath(); g.arc(800, 140, 44, 0, 7); g.stroke(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.beginPath(); g.moveTo(800 + Math.cos(a) * 60, 140 + Math.sin(a) * 60); g.lineTo(800 + Math.cos(a) * 86, 140 + Math.sin(a) * 86); g.stroke(); }
      tap(790, 470, true); g.strokeStyle = C; g.lineWidth = 7; g.beginPath(); g.moveTo(740, 650); g.lineTo(840, 650); g.lineTo(825, 700); g.lineTo(755, 700); g.closePath(); g.stroke(); txt(g, '+', 930, 560, 120, Y); g.globalAlpha = 1; } }
  let DG = null, DAYN = 1;
  function drawDay(g, w, h, n) { g.fillStyle = '#b8864e'; g.fillRect(0, 0, w, h); g.fillStyle = '#f4ecd8'; g.fillRect(16, 16, w - 32, h - 32); txt(g, 'DÍA', w / 2, 74, 62, '#7a4a24'); if (n > 0) txt(g, String(n), w / 2, 170, 120, '#c8342c'); }
  const setChalk = n => { CHN = n; if (CH && SIGN.chalk) { drawChalk(CH, 1040, 720, n); SIGN.chalk.map.needsUpdate = true; } };
  function book(g, x, y, bw, bh, col, rn) { g.fillStyle = col; g.fillRect(x, y - bh, bw, bh); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(x + 3, y - bh + 3, 4, bh - 6); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x + bw - 5, y - bh, 5, bh);
    g.fillStyle = 'rgba(255,240,200,.75)'; g.fillRect(x + 4, y - bh + bh * .2, bw - 8, 5); g.fillRect(x + 4, y - bh * .25, bw - 8, 4); g.strokeStyle = KK; g.lineWidth = 2.5; g.strokeRect(x, y - bh, bw, bh); }
  function paintSigns() {
    const S = {
      daysign: cv(360, 260, (g, w, h) => { DG = g; drawDay(g, w, h, DAYN); }),
      chalk2: cv(1040, 720, (g, w, h) => { chalkBg(g, w, h); txt(g, 'LITROS POR VACA', w / 2, 92, 74, '#f4f2ea'); g.strokeStyle = '#f4f2ea'; g.lineWidth = 5; g.beginPath(); g.moveTo(170, 140); g.lineTo(w - 170, 140); g.stroke(); txt(g, '22', w / 2, 330, 300, '#f4f2ea');
        g.strokeStyle = '#f4f2ea'; g.lineWidth = 8; g.beginPath(); g.moveTo(240, 520); g.lineTo(800, 520); g.stroke(); for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(260 + k * 95, 560); g.lineTo(260 + k * 95, 600); g.stroke(); } }),
      sack: cv(400, 600, (g, w, h) => { const rn = rn0(71); g.fillStyle = '#d8c090'; g.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++) { g.fillStyle = rn() < .5 ? 'rgba(150,120,70,.25)' : 'rgba(255,240,200,.25)'; g.fillRect(rn() * w, rn() * h, 3, 1.5); }
        g.fillStyle = '#7a1a24'; g.fillRect(30, 170, w - 60, 250); g.strokeStyle = '#e8c040'; g.lineWidth = 8; g.strokeRect(42, 182, w - 84, 226); txt(g, 'PIENSO', w / 2, 260, 78, '#f4e6c0'); txt(g, 'PREMIUM', w / 2, 345, 50, '#e8c040');
        g.fillStyle = '#e8c040'; for (let i = 0; i < 5; i++) { g.beginPath(); const x = 120 + i * 40; for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 7 : 16; g.lineTo(x + Math.cos(a) * r, 450 + Math.sin(a) * r); } g.fill(); } }),
      shopsign: cv(960, 180, (g, w, h) => { g.fillStyle = '#2c5fa8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f4ecd8'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'TIENDA DEL PUEBLO', w / 2, h / 2 + 4, 84, '#f4ecd8'); }),
      win_snow: cv(512, 512, (g, w, h) => { WS = g; drawWin(g, w, h, NIGHT); }),
      barnext: tex(512, 512, (g, w, h) => { const rn = rn0(43); for (let i = 0; i < 8; i++) { g.fillStyle = ['#a8342a', '#9a2e26', '#b23a2e', '#922a22'][i % 4]; g.fillRect(i * 64, 0, 64, h); g.strokeStyle = '#4a1410'; g.lineWidth = 5; g.strokeRect(i * 64, -5, 64, h + 10);
        g.strokeStyle = 'rgba(60,16,12,.3)'; g.lineWidth = 2; for (let k = 0; k < 4; k++) { const x = i * 64 + 8 + rn() * 48; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 5, h * .3, x - 5, h * .6, x + 3, h); g.stroke(); } }
        g.fillStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < 30; i++) g.fillRect(rn() * w, rn() * h, 3 + rn() * 8, 2); }),
      snowg: tex(1024, 1024, (g, w, h) => { const rn = rn0(47); g.fillStyle = '#eef3f8'; g.fillRect(0, 0, w, h); for (let i = 0; i < 60; i++) { g.fillStyle = i % 2 ? 'rgba(190,206,226,.35)' : 'rgba(255,255,255,.5)'; g.beginPath(); g.ellipse(rn() * w, rn() * h, 60 + rn() * 160, 20 + rn() * 60, rn() * 3, 0, 7); g.fill(); }
        speck(g, w, h, 3000, ['#ffffff', '#dfe8f2', '#d0dcea'], .6, 2, rn); }),
      stain: cv(512, 360, (g, w, h) => { g.clearRect(0, 0, w, h); for (let i = 0; i < 4; i++) { const gr = g.createRadialGradient(w / 2 + (i - 1.5) * 40, h * .4 + i * 18, 10, w / 2, h * .45, 230 - i * 40); gr.addColorStop(0, 'rgba(110,96,70,.32)'); gr.addColorStop(.7, 'rgba(120,104,76,.14)'); gr.addColorStop(1, 'rgba(120,104,76,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
        for (let i = 0; i < 5; i++) { const x = 170 + i * 45; g.strokeStyle = 'rgba(100,86,60,.25)'; g.lineWidth = 6; g.beginPath(); g.moveTo(x, h * .55); g.lineTo(x + 4, h * .95); g.stroke(); } }),
      tvscreen: cv(440, 360, (g, w, h) => { TVG = g; drawTV(g, w, h, 0); }),
      radiof: cv(360, 220, (g, w, h) => { g.fillStyle = '#7a4a24'; g.fillRect(0, 0, w, h); g.fillStyle = '#d8c8a0'; g.fillRect(20, 20, 200, 180); g.strokeStyle = '#7a4a24'; g.lineWidth = 6; for (let x = 30; x < 220; x += 14) { g.beginPath(); g.moveTo(x, 20); g.lineTo(x, 200); g.stroke(); }
        g.fillStyle = '#f2e6c0'; g.fillRect(240, 30, 100, 50); g.strokeStyle = '#3a2a14'; g.lineWidth = 3; for (let x = 250; x < 340; x += 10) { g.beginPath(); g.moveTo(x, 45); g.lineTo(x, 65); g.stroke(); } g.strokeStyle = '#c8342c'; g.lineWidth = 4; g.beginPath(); g.moveTo(300, 36); g.lineTo(300, 76); g.stroke();
        for (const x of [265, 315]) { g.fillStyle = '#3a2a14'; g.beginPath(); g.arc(x, 150, 24, 0, 7); g.fill(); g.fillStyle = '#c8a860'; g.beginPath(); g.arc(x, 150, 10, 0, 7); g.fill(); } }),
      photo: cv(360, 400, (g, w, h) => { g.fillStyle = '#f4eedc'; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 30, 0, 300); gr.addColorStop(0, '#9ad0ff'); gr.addColorStop(.6, '#cfe8ff'); gr.addColorStop(.61, '#7ab84a'); gr.addColorStop(1, '#5a9a3a'); g.fillStyle = gr; g.fillRect(24, 24, w - 48, 300);
        g.fillStyle = '#fff'; g.strokeStyle = '#1e1418'; g.lineWidth = 6; g.beginPath(); g.ellipse(180, 220, 110, 60, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#1e1418'; g.beginPath(); g.ellipse(150, 205, 30, 22, .4, 0, 7); g.fill(); g.beginPath(); g.ellipse(220, 230, 26, 18, -.3, 0, 7); g.fill();
        g.fillStyle = '#fff'; g.beginPath(); g.ellipse(285, 175, 36, 44, .3, 0, 7); g.fill(); g.stroke(); for (const x of [110, 150, 210, 250]) { g.fillStyle = '#fff'; g.fillRect(x, 260, 14, 50); g.strokeRect(x, 260, 14, 50); }
        g.fillStyle = '#2c5fa8'; g.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.lineTo(80 + Math.cos(a) * 40, 360 + Math.sin(a) * 40); g.lineTo(80 + Math.cos(a + .26) * 30, 360 + Math.sin(a + .26) * 30); } g.fill(); g.fillStyle = '#ffd34a'; g.beginPath(); g.arc(80, 360, 18, 0, 7); g.fill(); }),
      kit: cv(300, 240, (g, w, h) => { g.fillStyle = '#f4f4f0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9ced6'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8); g.fillStyle = '#16a052'; g.fillRect(w / 2 - 22, 50, 44, 140); g.fillRect(w / 2 - 70, 98, 140, 44); }),
      barnwall: tex(512, 512, (g, w, h) => { const rn = rn0(3); g.fillStyle = '#ece4d2'; g.fillRect(0, 0, w, h); speck(g, w, h, 2600, ['#e2d8c2', '#f4eedf', '#d8ccb4'], 1, 4, rn);
        for (let i = 0; i < 7; i++) { const x = rn() * w, gr = g.createLinearGradient(0, h * .55, 0, h); gr.addColorStop(0, 'rgba(120,96,60,0)'); gr.addColorStop(1, 'rgba(120,96,60,.28)'); g.fillStyle = gr; g.fillRect(x, h * .55, 40 + rn() * 80, h); }
        for (let i = 0; i < 3; i++) { g.fillStyle = 'rgba(160,140,110,.12)'; g.beginPath(); g.ellipse(rn() * w, rn() * h * .6, 30 + rn() * 60, 18 + rn() * 30, rn() * 3, 0, 7); g.fill(); }
        g.strokeStyle = 'rgba(110,90,70,.35)'; g.lineWidth = 2; for (let i = 0; i < 6; i++) { let x = rn() * w, y = rn() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (rn() - .5) * 40; y += 14; g.lineTo(x, y); } g.stroke(); } }),
      barnfloor: tex(1024, 1024, (g, w, h) => { const rn = rn0(5); g.fillStyle = '#9a948a'; g.fillRect(0, 0, w, h); speck(g, w, h, 9000, ['#8e887e', '#a8a296', '#7e786e', '#b2ac9e'], .8, 3, rn);
        for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(${90 + rn() * 30},${72 + rn() * 20},${44},.1)`; g.beginPath(); g.ellipse(rn() * w, rn() * h, 40 + rn() * 140, 20 + rn() * 70, rn() * 3, 0, 7); g.fill(); }
        g.strokeStyle = '#6e685e'; g.lineWidth = 4; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(0, k * 256); g.lineTo(w, k * 256); g.stroke(); }
        g.lineWidth = 3; for (let i = 0; i < 140; i++) { const x = rn() * w, y = rn() * h, a = rn() * 3, L = 10 + rn() * 26; g.strokeStyle = ['#e8c05a', '#c89a3a', '#f2d47a'][i % 3]; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); } }),
      straw: tex(512, 512, (g, w, h) => { const rn = rn0(7); g.fillStyle = '#c8a24a'; g.fillRect(0, 0, w, h); g.lineCap = 'round';
        for (let i = 0; i < 2600; i++) { const x = rn() * w, y = rn() * h, a = rn() * 3.14, L = 14 + rn() * 40; g.strokeStyle = ['#e8c05a', '#c89a3a', '#f4d87a', '#a87e2a', '#fff0a8'][i % 5]; g.lineWidth = 2 + rn() * 2.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); } }),
      plank: tex(512, 512, (g, w, h) => { const rn = rn0(11); for (let i = 0; i < 6; i++) { g.fillStyle = ['#8a5a34', '#7a4e2c', '#94643c', '#6e4426'][i % 4]; g.fillRect(i * 86, 0, 86, h); g.strokeStyle = '#3a2414'; g.lineWidth = 5; g.strokeRect(i * 86, -5, 86, h + 10);
        g.strokeStyle = 'rgba(40,24,12,.35)'; g.lineWidth = 2; for (let k = 0; k < 6; k++) { const x = i * 86 + 10 + rn() * 66; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 8, h * .3, x - 8, h * .6, x + 4, h); g.stroke(); }
        g.fillStyle = '#3a2414'; for (const y of [40, h - 40]) { g.beginPath(); g.arc(i * 86 + 20, y, 5, 0, 7); g.arc(i * 86 + 66, y, 5, 0, 7); g.fill(); } } }),
      roof: tex(512, 512, (g, w, h) => { const rn = rn0(13); for (let j = 0; j < 8; j++) { g.fillStyle = ['#5a3a22', '#4e321c', '#634028'][j % 3]; g.fillRect(0, j * 64, w, 64); g.strokeStyle = '#2a1a0e'; g.lineWidth = 6; g.strokeRect(-5, j * 64, w + 10, 64);
        g.strokeStyle = 'rgba(20,10,4,.35)'; g.lineWidth = 2; for (let k = 0; k < 4; k++) { const y = j * 64 + 8 + rn() * 48; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * .3, y + 5, w * .6, y - 5, w, y); g.stroke(); } } }),
      win_day: cv(512, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9ad0ff'); gr.addColorStop(.55, '#e8f6ff'); gr.addColorStop(.56, '#9ad86a'); gr.addColorStop(1, '#6ab04a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = '#fff'; for (const [x, y, r] of [[120, 120, 40], [160, 110, 52], [210, 125, 38], [380, 80, 30], [410, 70, 40]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
        g.fillStyle = '#4a8a3a'; for (const [x, r] of [[80, 70], [300, 90], [450, 60]]) { g.beginPath(); g.arc(x, 290, r, 0, 7); g.fill(); }
        const gl = g.createRadialGradient(w * .7, h * .3, 10, w * .7, h * .3, 300); gl.addColorStop(0, 'rgba(255,250,220,.85)'); gl.addColorStop(1, 'rgba(255,250,220,0)'); g.fillStyle = gl; g.fillRect(0, 0, w, h); }),
      chalk: cv(1040, 720, (g, w, h) => { CH = g; drawChalk(g, w, h, CHN); }),
      calendar: cv(330, 450, (g, w, h) => { g.fillStyle = '#fbf6ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#2c5fa8'; g.fillRect(0, 0, w, 150); g.fillStyle = '#eef3f8'; g.beginPath(); g.moveTo(0, 150); g.lineTo(90, 70); g.lineTo(160, 120); g.lineTo(240, 50); g.lineTo(w, 150); g.fill();
        txt(g, 'ENERO', w / 2, 180, 38, '#c8342c'); g.strokeStyle = '#9a9488'; g.lineWidth = 2; for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) { g.strokeRect(14 + i * 43, 210 + j * 46, 43, 46); const dn = 1 + i + j * 7; if (dn <= 31) txt(g, String(dn), 35 + i * 43, 233 + j * 46, 18, '#3a3430', null, 0, 700); }
        g.strokeStyle = '#c8342c'; g.lineWidth = 5; g.beginPath(); g.arc(35 + 3 * 43, 233 + 46, 20, 0, 7); g.stroke(); }),
      vrbox: cv(520, 360, (g, w, h) => { g.fillStyle = '#f4f4f4'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a22'; g.fillRect(0, 0, w, 70); txt(g, 'GAFAS VR', w / 2, 36, 46, '#fff');
        g.fillStyle = '#2a2a34'; g.beginPath(); g.roundRect(110, 130, 300, 150, 40); g.fill(); g.fillStyle = '#5ab8ff'; g.beginPath(); g.roundRect(140, 160, 240, 60, 20); g.fill(); g.strokeStyle = '#1a1a22'; g.lineWidth = 16; g.beginPath(); g.moveTo(110, 200); g.lineTo(40, 190); g.moveTo(410, 200); g.lineTo(480, 190); g.stroke(); }),
      tankl: tex(1024, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); for (let k = 0; k <= 8; k++) gr.addColorStop(k / 8, k % 2 ? '#c8ced6' : '#eef2f6'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = '#2c5fa8'; g.fillRect(380, 150, 264, 120); g.strokeStyle = '#fff'; g.lineWidth = 6; g.strokeRect(390, 160, 244, 100); txt(g, 'LECHE', 512, 212, 72, '#fff');
        g.strokeStyle = 'rgba(80,90,100,.5)'; g.lineWidth = 4; for (const y of [60, h - 60]) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } }),
      grass: tex(1024, 1024, (g, w, h) => { const rn = rn0(17); g.fillStyle = '#5aa83a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { g.fillStyle = ['rgba(90,180,60,.35)', 'rgba(60,140,40,.3)', 'rgba(140,200,80,.3)'][i % 3]; g.beginPath(); g.ellipse(rn() * w, rn() * h, 60 + rn() * 160, 40 + rn() * 90, rn() * 3, 0, 7); g.fill(); }
        g.lineCap = 'round'; for (let i = 0; i < 9000; i++) { const x = rn() * w, y = rn() * h, L = 8 + rn() * 18; g.strokeStyle = ['#4a9a30', '#6ac04a', '#3a8a2a', '#86d05a', '#2f7a22'][i % 5]; g.lineWidth = 2 + rn() * 2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + (rn() - .5) * 8, y - L * .5, x + (rn() - .5) * 10, y - L); g.stroke(); } }),
      hills: tex(512, 512, (g, w, h) => { const rn = rn0(19); g.fillStyle = '#6ab84a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 14; i++) { g.fillStyle = i % 2 ? 'rgba(90,160,50,.5)' : 'rgba(150,210,90,.45)'; g.fillRect(0, i * 37, w, 18); } speck(g, w, h, 900, ['#4a9a30', '#8ad060'], 1, 3, rn); }),
      hallwall: tex(512, 512, (g, w, h) => { const rn = rn0(23); g.fillStyle = '#f2e2cc'; g.fillRect(0, 0, w, h); speck(g, w, h, 1600, ['#ead8c0', '#f8eedc'], 1, 3, rn); }),
      wainscot: tex(512, 256, (g, w, h) => { g.fillStyle = '#8ab8a8'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 64) { g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x + 6, 0, 10, h); g.strokeStyle = '#5a8a7a'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } }),
      lino: tex(1024, 1024, (g, w, h) => { const rn = rn0(29); g.fillStyle = '#c9cfc2'; g.fillRect(0, 0, w, h); speck(g, w, h, 9000, ['#b4bbac', '#dce0d4', '#a8b0a0', '#e8ebe2'], .8, 2.6, rn);
        g.strokeStyle = 'rgba(90,100,90,.35)'; g.lineWidth = 3; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(0, k * 256); g.lineTo(w, k * 256); g.moveTo(k * 256, 0); g.lineTo(k * 256, h); g.stroke(); }
        g.strokeStyle = '#7aa898'; g.lineWidth = 26; g.beginPath(); g.moveTo(w * .06, 0); g.lineTo(w * .06, h); g.moveTo(w * .94, 0); g.lineTo(w * .94, h); g.stroke(); }),
      fluor: cv(256, 512, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d8e4ee'; g.lineWidth = 10; for (let x = 0; x <= w; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y <= h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } }),
      exitdoor: cv(500, 1050, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#9aa2ac'); gr.addColorStop(.5, '#b8c0ca'); gr.addColorStop(1, '#8a929c'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.strokeStyle = '#5a626c'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); g.fillStyle = '#cfe2ee'; g.fillRect(150, 120, 200, 300); g.strokeStyle = '#5a626c'; g.lineWidth = 8; g.strokeRect(150, 120, 200, 300);
        g.strokeStyle = 'rgba(80,90,100,.5)'; g.lineWidth = 2; for (let k = 0; k < 300; k += 24) { g.beginPath(); g.moveTo(150, 120 + k); g.lineTo(350, 120 + k); g.moveTo(150 + k * .66, 120); g.lineTo(150 + k * .66, 420); g.stroke(); }
        g.fillStyle = '#c8342c'; g.fillRect(60, 560, 380, 50); txt(g, 'EMPUJAR', w / 2, 586, 34, '#fff'); g.fillStyle = '#5a626c'; g.fillRect(0, h - 120, w, 120); }),
      mural: cv(500, 1050, (g, w, h) => { const rn = rn0(31);
        g.fillStyle = '#f2e2cc'; g.fillRect(0, 0, w, h);   // la misma pared: la estantería pintada «sale» de la pared
        g.fillStyle = '#7a4e2c'; g.fillRect(12, 20, w - 24, h - 40); g.fillStyle = '#4a2e18'; g.fillRect(30, 40, w - 60, h - 80);
        const shelves = [250, 470, 690, 910]; shelves.forEach(y => { g.fillStyle = '#8a5a34'; g.fillRect(30, y, w - 60, 22); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(30, y + 22, w - 60, 14); });
        [40, 272, 492, 712].forEach((y0, j) => { let x = 40; const yb = shelves[j]; while (x < w - 60) { const bw = 18 + rn() * 26, bh = 120 + rn() * 70; if (j === 1 && x > 250 && x < 340) { // maceta con planta
              g.fillStyle = '#b8603a'; g.fillRect(x, yb - 60, 70, 60); g.fillStyle = '#3f9a3a'; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(x + 35 + (k - 2.5) * 12, yb - 90 - (k % 2) * 30, 18, 40, (k - 2.5) * .3, 0, 7); g.fill(); } x += 84; continue; }
            if (j === 2 && x > 120 && x < 200) { g.fillStyle = '#e8c05a'; g.fillRect(x, yb - 130, 90, 130); g.fillStyle = '#9ad0ff'; g.fillRect(x + 10, yb - 120, 70, 70); g.fillStyle = '#6ab04a'; g.fillRect(x + 10, yb - 70, 70, 20); x += 100; continue; }
            book(g, x, yb, bw, Math.min(bh, yb - y0 - 10), ['#c8342c', '#2c5fa8', '#2f9a52', '#e0a42a', '#6a3a8a', '#e8e0c8', '#3a3a4a'][Math.floor(rn() * 7)], rn); x += bw + 2; } });
        g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(40, 40); g.lineTo(140, 40); g.lineTo(60, h - 40); g.lineTo(40, h - 40); g.fill(); }),
      exitsign: cv(700, 220, (g, w, h) => { g.fillStyle = '#16a052'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'SALIDA', w * .62, h / 2 + 4, 110, '#fff');
        g.fillStyle = '#fff'; g.beginPath(); g.arc(110, 60, 18, 0, 7); g.fill(); g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(105, 85); g.lineTo(95, 140); g.lineTo(130, 180); g.moveTo(95, 140); g.lineTo(65, 180); g.moveTo(100, 100); g.lineTo(140, 115); g.moveTo(100, 100); g.lineTo(65, 120); g.stroke(); }),
      roomdoor: cv(400, 900, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#c89a62'); gr.addColorStop(1, '#b8884e'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(90,60,30,.35)'; g.lineWidth = 3; for (let i = 0; i < 20; i++) { const x = i * 20 + 6; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 6, h * .3, x - 6, h * .6, x + 3, h); g.stroke(); }
        g.fillStyle = '#c9ced6'; g.fillRect(0, h - 120, w, 120); g.strokeStyle = '#7a5a34'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8); }),
      plate: cv(300, 220, (g, w, h) => { g.fillStyle = '#fbf8ef'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2c5fa8'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); txt(g, 'HAB.', w / 2, 60, 44, '#2c5fa8'); txt(g, '12', w / 2, 140, 90, '#1e1418'); }),
      hallwin: cv(640, 520, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffb86a'); gr.addColorStop(.5, '#ffe0a8'); gr.addColorStop(.62, '#7aa85a'); gr.addColorStop(1, '#4a7a3a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(255,240,200,.9)'; g.beginPath(); g.arc(w * .3, h * .5, 46, 0, 7); g.fill(); g.fillStyle = '#3a6a32'; for (const [x, r] of [[80, 80], [520, 110], [620, 70]]) { g.beginPath(); g.arc(x, h * .6, r, 0, 7); g.fill(); g.fillRect(x - 8, h * .6, 16, 140); }
        g.strokeStyle = '#ffffff'; g.lineWidth = 18; g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); }),
      painting: cv(500, 360, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#8ac0e8'); gr.addColorStop(.6, '#e8f0d8'); gr.addColorStop(.61, '#6aa04a'); gr.addColorStop(1, '#4a7a32'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = '#c8342c'; g.fillRect(300, 170, 110, 80); g.fillStyle = '#8a2420'; g.beginPath(); g.moveTo(290, 170); g.lineTo(355, 120); g.lineTo(420, 170); g.fill(); g.fillStyle = '#fff'; g.fillRect(330, 200, 24, 30); }),
      clock: cv(256, 256, (g, w, h) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.strokeStyle = '#1e1418'; g.lineWidth = 12; g.stroke(); for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g.lineWidth = 6; g.beginPath(); g.moveTo(128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96); g.lineTo(128 + Math.cos(a) * 110, 128 + Math.sin(a) * 110); g.stroke(); }
        g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + 50, 128 + 30); g.moveTo(128, 128); g.lineTo(128, 50); g.stroke(); }),
      notice: cv(540, 360, (g, w, h) => { g.fillStyle = '#b8864e'; g.fillRect(0, 0, w, h); speck(g, w, h, 600, ['#a87a44', '#c8966a'], 1, 3, rn0(3));
        const card = (x, y, c, r, t) => { g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = c; g.fillRect(-70, -55, 140, 110); g.fillStyle = '#c8342c'; g.beginPath(); g.arc(0, -46, 7, 0, 7); g.fill(); if (t) txt(g, t, 0, 0, 30, '#1e1418'); g.restore(); };
        card(110, 110, '#fff6b0', -.08, 'BINGO'); card(110, 250, '#ffd0e0', .06, 'JUEVES'); card(280, 140, '#d8f0ff', .04, 'MENÚ'); card(430, 120, '#fff', -.05, ''); card(380, 260, '#e0ffd0', .07, 'MÚSICA'); }),
      keypad: cv(160, 220, (g, w, h) => { g.fillStyle = '#2a2a34'; g.fillRect(0, 0, w, h); for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { g.fillStyle = '#c9ced6'; g.fillRect(22 + i * 42, 40 + j * 42, 32, 32); } g.fillStyle = '#e8423a'; g.beginPath(); g.arc(80, 20, 8, 0, 7); g.fill(); }),
    };
    for (const k in S) if (SIGN[k]) { SIGN[k].map = S[k]; SIGN[k].needsUpdate = true; }
  }

  // ---------- carga del GLB, sitios, haces de luz y polvo ----------
  const G = {}, SITES = {}; ['barn', 'meadow', 'hall', 'snow', 'long', 'vbarn', 'shop'].forEach(n => { SITES[n] = new T.Group(); SITES[n].visible = false; scene.add(SITES[n]); });
  const READY_W = new Promise((resolve, reject) => {
    const b64 = window.GLB79, bin = atob(b64), buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    Promise.resolve(document.fonts && document.fonts.load ? document.fonts.load('900 100px Inter') : 0).then(() => new GLTFLoader().parse(buf.buffer, '', gl => {
      gl.scene.children.slice().forEach(o => { G[o.name] = o; });
      Object.values(G).forEach(o => meshesOf(o).forEach(me => { me.material = Array.isArray(me.material) ? me.material.map(toon) : toon(me.material); me.castShadow = true; me.receiveShadow = true; }));
      Object.values(G).forEach(o => meshesOf(o).forEach(me => { const nm = (Array.isArray(me.material) ? me.material[0] : me.material).name; if (PAINTED.test(nm) && !me.geometry.attributes.uv) { if (TILE[nm]) boxUV(me.geometry, TILE[nm]); else planarUV(me.geometry, nm); } }));
      ['meadow_floor', 'barn_floor', 'hall_floor', 'snow_floor', 'long_floor', 'vbarn_floor', 'shop_floor'].forEach(n => G[n] && meshesOf(G[n]).forEach(me => me.castShadow = false));
      paintSigns(); build(); resolve(); }, e => reject(e)));
  });
  function boxUV(geo, tile) { const p = geo.attributes.position, n = geo.attributes.normal, uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) { const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i)), nz = Math.abs(n.getZ(i)); let u, v;
      if (ny >= nx && ny >= nz) { u = p.getX(i); v = p.getZ(i); } else if (nx >= nz) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
      uv[i * 2] = u / tile; uv[i * 2 + 1] = v / tile; }
    geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); }
  // UV plana sobre la cara grande; en cajas finas (carteles en paredes laterales) el eje fino se ignora y se respeta la orientación (texto legible)
  function planarUV(geo, nm) { const p = geo.attributes.position, uv = new Float32Array(p.count * 2); geo.computeBoundingBox(); const bb = geo.boundingBox, sz = bb.getSize(new T.Vector3());
    const ax = nm === 'sack' ? ['x', 'y'] : sz.z <= sz.x && sz.z <= sz.y ? ['x', 'y'] : (sz.x <= sz.y && sz.x <= sz.z ? ['z', 'y'] : ['x', 'z']);
    const flipU = ax[0] === 'z' && bb.min.x > 0;    // pared derecha mirando a −x: invertir para que el texto no salga en espejo
    for (let i = 0; i < p.count; i++) { let u = (p['get' + ax[0].toUpperCase()](i) - bb.min[ax[0]]) / Math.max(1e-6, sz[ax[0]]); if (ax[0] === 'z') u = flipU ? u : 1 - u; uv[i * 2] = u; uv[i * 2 + 1] = (p['get' + ax[1].toUpperCase()](i) - bb.min[ax[1]]) / Math.max(1e-6, sz[ax[1]]); }
    geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); }
  const grad = (stops, w = 64, h = 256) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, h); stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const gx = g.createLinearGradient(0, 0, w, 0); gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(.5, 'rgba(0,0,0,0)'); gx.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = gx; g.fillRect(0, 0, w, h); return new T.CanvasTexture(c); };
  const beamTex = grad([[0, 'rgba(255,255,255,.9)'], [1, 'rgba(255,255,255,0)']]);
  const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); })();
  const BEAMS = [], MOTES = [];
  function beam(site, from, to, col, w0 = .4, w1 = 1.2, op = .2) { const L = from.distanceTo(to), geo = new T.CylinderGeometry(w0, w1, L, 24, 1, true); geo.translate(0, -L / 2, 0);
    const m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: beamTex, color: col, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: op, side: T.DoubleSide, fog: false }));
    m.position.copy(from); m.lookAt(to); m.rotateX(-Math.PI / 2); m.renderOrder = 3; SITES[site].add(m); return m; }
  function pool(site, x, y, z, r, col, op = .5, sx = 1) { const m = new T.Mesh(new T.CircleGeometry(r, 40), new T.MeshBasicMaterial({ map: dotTex, color: col, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: op, fog: false }));
    m.rotation.x = -Math.PI / 2; m.scale.x = sx; m.position.set(x, y, z); m.renderOrder = 2; SITES[site].add(m); return m; }
  function motes(site, cx, cz, w, d, h, n, col, size = .05) { const geo = new T.BufferGeometry(), pos = new Float32Array(n * 3), rn = rn0(41 + n); for (let i = 0; i < n; i++) pos.set([cx + (rn() - .5) * w, .3 + rn() * h, cz + (rn() - .5) * d], i * 3);
    geo.setAttribute('position', new T.BufferAttribute(pos, 3)); const p = new T.Points(geo, new T.PointsMaterial({ size, map: dotTex, color: col, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, opacity: .8 })); p.renderOrder = 4; SITES[site].add(p); MOTES.push(p); return p; }
  function build() {
    Object.keys(G).forEach(n => { const st = n.split('_')[0]; if (SITES[st]) SITES[st].add(G[n]); });
    if (G.door_real) { SITES.hall.add(G.door_real); SITES.hall.add(G.door_mural); G.door_mural.visible = false; }
    const B0 = LAY.sites.barn[0], H0 = (LAY.sites.hall || [2000])[0];
    // establo: haces de sol entrando por las ventanas y el portón, manchas de luz en el suelo, polvo en el aire
    for (const x of [B0 - 5.2, B0 + 5.2]) { BEAMS.push(beam('barn', V3(x, 2.2, -6.0), V3(x + 1.6, 0, -2.6), '#ffe6a8', .55, 1.1, .22)); POOLS(pool('barn', x + 1.6, .02, -2.4, 1.1, '#ffe6a8', .28, 1.4)); }
    for (const z of [-3.5, .5]) { BEAMS.push(beam('barn', V3(B0 - 7.2, 2.2, z), V3(B0 - 4.2, 0, z + 1.2), '#ffe6a8', .5, 1.0, .2)); POOLS(pool('barn', B0 - 4.0, .02, z + 1.3, 1.0, '#ffe6a8', .25, 1.5)); }
    BEAMS.push(beam('barn', V3(B0 + 7.2, 1.6, 2.6), V3(B0 + 3.2, 0, 2.2), '#fff0c8', 1.2, 1.8, .2)); POOLS(pool('barn', B0 + 3.4, .02, 2.4, 1.9, '#fff0c8', .3, 1.6));
    (LAY.lamps || []).forEach(([x, y, z]) => POOLS(pool('barn', x, .02, z, 1.4, '#ffd98a', .3)));
    motes('barn', B0, -2.5, 13, 8, 2.8, 260, '#fff2cc', .045);
    // prado: mariposas y vilanos flotando
    motes('meadow', LAY.sites.meadow[0], -6, 16, 14, 2.4, 140, '#ffffff', .06);
    // pasillo: luz de tarde de la ventana en el suelo + reflejos de los fluorescentes en el linóleo
    BEAMS.push(beam('hall', V3(H0 - 1.3, 1.6, -5.2), V3(H0 + .2, 0, -4.6), '#ffc88a', .6, 1.0, .2)); POOLS(pool('hall', H0 + .1, .02, -4.6, 1.0, '#ffb86a', .55, 1.3));
    (LAY.hallLights || []).forEach(([x, y, z]) => POOLS(pool('hall', x, .015, z, .8, '#ffffff', .07, .6)));
    motes('hall', H0, -5, 2.2, 3, 2.2, 60, '#ffe8c8', .035);
    // exterior: nieve cayendo (copos que bajan con el tiempo) y luz cálida de las ventanas del establo
    { const S0 = LAY.sites.snow[0], n = 2600, geo = new T.BufferGeometry(), pos = new Float32Array(n * 3), rn = rn0(61); for (let i = 0; i < n; i++) pos.set([S0 + (rn() - .5) * 30, rn() * 24, -18 + rn() * 26], i * 3);
      geo.setAttribute('position', new T.BufferAttribute(pos, 3)); const fl = new T.Points(geo, new T.PointsMaterial({ size: .07, map: dotTex, color: '#ffffff', transparent: true, depthWrite: false, fog: true, opacity: .95 })); fl.renderOrder = 4; SITES.snow.add(fl); SNOW.push(fl); }
    for (const x of [LAY.sites.snow[0] - 4, LAY.sites.snow[0] + 4]) POOLS(pool('snow', x, .03, -4.6, 1.6, '#ffc070', .45, 1.3));
    (LAY.longLamps || []).forEach(([x, y, z]) => POOLS(pool('long', x, .02, z, 2.2, '#ffd08a', .35)));
    motes('long', LAY.sites.long[0], -16, 12, 40, 3, 300, '#ffe8b0', .05);
    addLights(); }
  const SNOW = [], STOVE = [];
  const POOLS = () => {};
  function addLights() { const B0 = LAY.sites.barn[0], M0 = LAY.sites.meadow[0], H0 = (LAY.sites.hall || [2000])[0];
    const PL = (site, c, i, x, y, z, d = 18) => { const l = new T.PointLight(c, i, d, 1.6); l.position.set(x, y, z); SITES[site].add(l); return l; };
    (LAY.lamps || []).forEach(([x, y, z]) => { const l = PL('barn', '#ffd08a', 4, x, y, z, 6); l.userData.base = 4; BARNL.push(l); });
    { const tl = PL('barn', '#a8c8ff', 1.2, B0 - 6.4, 1.75, -1.8, 4); tl.userData.base = 1.2; BARNL.push(tl); }
    PL('barn', '#ffe6b0', 6, B0 + 5.5, 1.6, 2.4, 9); PL('barn', '#fff2d8', 3, B0, 2.4, 3, 14);
    PL('meadow', '#fff4d8', 4, M0, 3, 4, 20);
    const S0 = LAY.sites.snow[0]; PL('snow', '#ffb070', 3, S0 - 4, 2.4, -5.4, 6); PL('snow', '#ffb070', 3, S0 + 4, 2.4, -5.4, 6); PL('snow', '#ffd8a0', 2, S0 - 3.55, 3.4, -4.7, 8);
    (LAY.longLamps || []).forEach(([x, y, z]) => PL('long', '#ffd08a', 5, x, y, z, 8));
    { const V0 = LAY.sites.vbarn[0]; (LAY.vlamps || []).forEach(([x, y, z]) => PL('vbarn', '#ffc880', 3.5, x, y, z, 6)); const st = PL('vbarn', '#ff8a3a', 9, V0 + 4.2, .7, -3.8, 7); st.userData.base = 9; STOVE.push(st); PL('vbarn', '#fff2d8', 2.5, V0, 2.4, 2, 12); }
    { const T0 = LAY.sites.shop[0]; PL('shop', '#ffe8c0', 6, T0, 2.3, -.8, 9); PL('shop', '#dfe8ff', 2, T0 - 3.6, 1.6, .5, 5); PL('shop', '#fff4e0', 2.5, T0, 2.0, 3, 10); }
    BARNL.push(...[]);
    (LAY.hallLights || []).forEach(([x, y, z]) => PL('hall', '#eef4ff', 1.5, x, y, z, 5));
    PL('hall', '#ffb070', 8, H0 - 1.1, 1.7, -5.2, 6); PL('hall', '#ffffff', 3, H0, 1.8, -12.3, 4); }
  function site(n) { Object.keys(SITES).forEach(k => SITES[k].visible = k === n); sky.visible = n === 'meadow' || n === 'snow'; }
  const doorMode = m => { if (!G.door_real) return; G.door_real.visible = m !== 'mural'; G.door_mural.visible = m === 'mural'; };
  const showBoxes = n => Object.keys(G).forEach(k => { const m = /^barn_bx(\d+)/.exec(k); if (m) G[k].visible = +m[1] < n; });
  const setDay = n => { DAYN = n; if (DG && SIGN.daysign) { drawDay(DG, 360, 260, n); SIGN.daysign.map.needsUpdate = true; } };

  // ---------- ambientes (color según la emoción) ----------
  const MOODS = {
    establo: { sun: '#d9e4f2', sunI: .85, dir: [.5, .9, .6], hemi: '#e6eef8', ground: '#3a3028', hemiI: .5, fog: '#b8c4d0', fogD: .02, top: '#8d98a8', hor: '#d4dae2', bloom: .22, tint: [.98, 1.0, 1.04], sat: 1.0 },
    establo27: { sun: '#ffd9a0', sunI: 1.5, dir: [.5, .9, .6], hemi: '#fff0d8', ground: '#6a4a28', hemiI: .62, fog: '#e0c090', fogD: .016, top: '#8d98a8', hor: '#d4dae2', bloom: .4, tint: [1.1, 1.0, .82], sat: 1.2 },
    noche: { sun: '#4a6fb0', sunI: .12, dir: [-.4, .8, .5], hemi: '#2a3e6a', ground: '#1a1410', hemiI: .35, fog: '#1c2a48', fogD: .022, top: '#0c1630', hor: '#25335a', bloom: .5, tint: [.92, .98, 1.08], sat: 1.0, night: 1 },
    nieve: { sun: '#dfe8f5', sunI: .45, dir: [-.3, .5, .4], hemi: '#cfd8e6', ground: '#7a8698', hemiI: .72, fog: '#c4ccd6', fogD: .018, top: '#8d98a8', hor: '#d4dae2', bloom: .14, tint: [.97, 1.0, 1.05], sat: .95 },
    prado: { sun: '#fff2d0', sunI: 1.4, dir: [-.5, .7, .4], hemi: '#cfe8ff', ground: '#6fa04a', hemiI: .85, fog: '#e8f0d8', fogD: .007, top: '#2f78e0', hor: '#dff2ff', bloom: .4, tint: [1.03, 1.0, .96], sat: .95},
    sueno: { sun: '#ffd9a0', sunI: 1.3, dir: [.3, .9, .5], hemi: '#fff0d8', ground: '#6a4a28', hemiI: .65, fog: '#f8d49a', fogD: .022, top: '#000', hor: '#000', bloom: .7, tint: [1.08, 1.0, .88], sat: 1.1 },
    tele: { sun: '#4a6fb0', sunI: .2, dir: [-.4, .8, .5], hemi: '#2a3e6a', ground: '#1a1410', hemiI: .3, fog: '#1c2a48', fogD: .02, top: '#0c1630', hor: '#25335a', bloom: .5, tint: [.97, 1.0, 1.04], sat: 1.0, night: 1 },
    vecino: { sun: '#ffb878', sunI: .8, dir: [-.4, .8, .4], hemi: '#e8c8a8', ground: '#4a3428', hemiI: .38, fog: '#a89078', fogD: .02, top: '#000', hor: '#000', bloom: .35, tint: [1.04, .98, .92], sat: 1.0},
    tienda: { sun: '#ffe8c0', sunI: .55, dir: [-.3, .9, .5], hemi: '#fff4e0', ground: '#6a4a28', hemiI: .5, fog: '#d8c8b0', fogD: .008, top: '#000', hor: '#000', bloom: .25, tint: [1.03, 1.0, .96], sat: .95},
    pasillo: { sun: '#ffc88a', sunI: .3, dir: [-.6, .7, .2], hemi: '#eef0ff', ground: '#a89878', hemiI: .45, fog: '#d8c8b0', fogD: .006, top: '#000', hor: '#000', bloom: .18, tint: [1.03, 1.0, .97], sat: 1.1 },
  };
  let MOOD = 'establo';
  function setMood(m) { if (!MOODS[m]) m = 'establo'; MOOD = m; const Mo = MOODS[m]; sun.color.set(Mo.sun); sun.intensity = Mo.sunI; SUN.set(...Mo.dir).normalize(); hemi.color.set(Mo.hemi); hemi.groundColor.set(Mo.ground); hemi.intensity = Mo.hemiI;
    scene.fog.color.set(Mo.fog); scene.fog.density = Mo.fogD; skyU.top.value.set(Mo.top); skyU.hor.value.set(Mo.hor); bloom.strength = Mo.bloom;
    gradeMat.uniforms.tint.value.set(...(Mo.tint || [1, 1, 1])); gradeMat.uniforms.sat.value = Mo.sat ?? 1.1;
    const nt = Mo.night ? 1 : 0; if (WS && nt !== NIGHT) { NIGHT = nt; drawWin(WS, 512, 512, NIGHT); SIGN.win_snow.map.needsUpdate = true; }
    BARNL.forEach(l => l.intensity = l.userData.base * (Mo.night ? 1.4 : 1)); }
  const BARNL = [];
  function setCam(pos, look, fov = 40, focus = null, ap = .0004) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    const D = Math.max(14, Math.min(80, pos.distanceTo(look) * 1.3)); const sc = sun.shadow.camera; if (sc.right !== D) { sc.left = -D; sc.right = D; sc.top = D; sc.bottom = -D; sc.near = 1; sc.far = D * 6; sc.updateProjectionMatrix(); }
    sun.position.copy(look).addScaledVector(SUN, D * 3); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  // ---------- post: brillo, desenfoque de fondo, color ----------
  const comp = new EffectComposer(R, new T.WebGLRenderTarget(W, H, { samples: 4, type: T.HalfFloatType })); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .5, .45, .93); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .0004, maxblur: .014 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, tint: { value: new T.Vector3(1.03, 1, .97) }, sat: { value: 1.12 } }, depthTest: false, depthWrite: false, vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform vec3 tint; uniform float sat; varying vec2 vUv; void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; c=c/(1.+max(c-.85,0.)*.9); c=clamp(c,0.,1.); float l=dot(c,vec3(.299,.587,.114)); c=clamp(mix(vec3(l),c,sat),0.,1.); c=c*c*(3.-2.*c)*.25+c*.75; c*=tint; float v=smoothstep(1.15,.35,length(vUv-.5)*1.6); c*=.7+.3*v; gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  function render() { comp.render(); }
  function setTime(t) { STOVE.forEach(l => l.intensity = l.userData.base * (.8 + .2 * Math.sin(t * 13) * Math.sin(t * 7.3 + 1))); skyU.time.value = t; uTime.value = t; TICK.forEach(f => f(t)); SNOW.forEach(p => { p.position.y = -((t * .9) % 12); p.position.x = Math.sin(t * .3) * .5; });
    if (TVG && SIGN.tvscreen) { drawTV(TVG, 440, 360, t); SIGN.tvscreen.map.needsUpdate = true; } MOTES.forEach((p, i) => { p.position.y = Math.sin(t * .4 + i) * .15; p.position.x = Math.sin(t * .23 + i * 2) * .3; }); }
  return { setChalk, doorMode, showBoxes, setDay, T, scene, camera, R, comp, setCam, proj, render, setTime, setMood, site, SUN, G, SITES, READY_W, sky, dof, bloom, TICK, get mood() { return MOOD; } };
})();

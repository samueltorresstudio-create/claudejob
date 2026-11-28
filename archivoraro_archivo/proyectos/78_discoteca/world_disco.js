// Archivo Raro · mundo 3D de DIBUJO ANIMADO para «La discoteca donde solo entran los feos» (78).
// Decorados de Blender (disco.glb → glb_disco.js) con sombreado de tebeo, contorno negro, texturas pintadas en canvas (ladrillo, asfalto mojado,
// baldosas, suelo de luces…), neones que brillan, haces de luz con humo, bola de espejos con destellos y niebla de color. Nivel de las referencias shorts_2026-11-24.
// Sitios: street (0) calle de noche · dance (1000) pista · aula (2000) pizarra.   API: setCam, proj, render, setTime, setMood, site, charLight.
window.GLC = document.getElementById('gl');
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920, LAY = window.LAYOUT;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NoToneMapping; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(40, W / H, .3, 700);
  const TICK = [], uTime = { value: 0 };

  // ---------- cielo nocturno: degradado azul, estrellas y luna ----------
  const skyU = { top: { value: new T.Color('#0b1030') }, hor: { value: new T.Color('#3a2a5a') }, time: { value: 0 } };
  const sky = new T.Mesh(new T.SphereGeometry(600, 48, 24), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform vec3 top, hor; uniform float time; varying vec3 vd; float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      void main(){ float h=vd.y; vec3 c=mix(hor, top, smoothstep(-.05,.45,h)); vec2 q=vd.xz/(abs(h)+.3)*60.; vec2 i=floor(q), f=fract(q)-.5; float st=step(.97,h2(i))*smoothstep(.12,.0,length(f-(vec2(h2(i+1.),h2(i+2.))-.5)*.6))*smoothstep(.06,.3,h)*(.6+.4*sin(time*3.+h2(i+3.)*20.));
        c+=vec3(st); float m=distance(vd, normalize(vec3(.35,.55,-.75))); c+=vec3(1.,.96,.82)*smoothstep(.06,.055,m)+vec3(.5,.45,.7)*smoothstep(.3,.0,m)*.25; gl_FragColor=vec4(c,1.);
#include <colorspace_fragment>
      }` }));
  sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky);
  scene.fog = new T.FogExp2('#241a3a', .02);
  const hemi = new T.HemisphereLight('#ffffff', '#ffd9a0', 1.7); scene.add(hemi);
  { const es = new T.Scene(); es.background = new T.Color('#0a0814'); const add = (c, x, y, z, w, h, i = 4) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(i), side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); };
    add('#ff3fa0', -6, 3, -6, 6, 2); add('#2fe8ff', 7, 2, -4, 5, 1.5); add('#ffcf7a', 0, 8, 2, 8, 3, 3); add('#ffcf7a', -5, 2, 7, 4, 3, 2); add('#8a5cff', 6, 4, 6, 4, 2, 2.5);
    const pm = new T.PMREMGenerator(R); scene.environment = pm.fromScene(es, 0, .1, 100).texture; }
  const SUN = new T.Vector3(-.3, .8, .5).normalize();
  const sun = new T.DirectionalLight('#fff1c9', 1.4); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0004; sun.shadow.normalBias = .06; scene.add(sun, sun.target);

  // ---------- materiales de tebeo (como el 77) + materiales que BRILLAN (neón, bombillas, ventanas encendidas, suelo de luces) ----------
  const toonG = new T.DataTexture(new Uint8Array([110, 175, 235, 255]), 4, 1, T.RedFormat); toonG.minFilter = toonG.magFilter = T.NearestFilter; toonG.needsUpdate = true;
  const MATS = {}, SIGN = {};
  const PAINTED = /^(regscreen|poster2|asphalt|sidewalk|brick|brick2|plaster|shutter|shopwin|win|neon|doorglass|ledfloor|woodfloor|wallclub|ceilclub|speaker|barmirror|board|parquet|wallcream|poster|books|list)$/;
  const TILE = { asphalt: 6, sidewalk: 3, brick: 2.4, brick2: 2.4, plaster: 3, win: 2.0, woodfloor: 4, wallclub: 3, ceilclub: 4, speaker: 1.3, parquet: 2.5, wallcream: 3, books: 2.4, shutter: 5.2 };
  const GLOW = /^(regscreen|lamp|lampwarm|neonP|neonC|neonY|neon|ledfloor|shopwin|win|poster)$/;
  const MIRROR = new T.ShaderMaterial({ uniforms: { time: uTime }, extensions: { derivatives: true },
    vertexShader: 'varying vec3 vP; varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vP=(modelViewMatrix*vec4(position,1.)).xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader: `uniform float time; varying vec3 vP; varying vec3 vW; float h(vec3 p){ return fract(sin(dot(floor(p*40.),vec3(12.9898,78.233,37.719)))*43758.5453); }
      void main(){ vec3 n=normalize(cross(dFdx(vW),dFdy(vW))); float r=h(vW); vec3 base=mix(vec3(.18,.17,.26),vec3(.75,.75,.85),r*r*r); float sp=step(.93,fract(r*7.+time*1.3)); vec3 tint=mix(vec3(1.,.4,.8),vec3(.3,.95,1.),fract(r*3.));
        float l=.55+.45*max(0.,dot(n,normalize(vec3(-.4,.6,.7)))); vec3 c=base*l+tint*.12+vec3(1.)*sp*.9; gl_FragColor=vec4(c,1.);
#include <colorspace_fragment>
      }` });
  function toon(m) { if (MATS[m.name]) return MATS[m.name]; let o; if (m.name === 'steeld') return (MATS[m.name] = MIRROR);
    if (GLOW.test(m.name)) { o = new T.MeshBasicMaterial({ color: m.color.clone(), fog: !/^(neon|neonP|neonC|neonY)$/.test(m.name) }); o.name = m.name; if (PAINTED.test(m.name)) { o.color.set(m.name === 'shopwin' ? '#8a7a6a' : '#ffffff'); SIGN[m.name] = o; } return (MATS[m.name] = o); }
    const RG = { gold: [.32, .85], goldd: [.35, .85], steel: [.22, .9], steeld: [.3, .9], iron: [.45, .6], glass: [.05, .2], doorglass: [.04, .3], asphalt: [.42, 0], sidewalk: [.75, 0], curb: [.8, 0], velvet: [.85, 0], velvetd: [.85, 0], black: [.45, .1], rubber: [.9, 0], wood: [.55, 0], woodd: [.55, 0], woodfloor: [.35, 0], bottleG: [.08, .1], bottleA: [.08, .1], bottleB: [.08, .1], bottleR: [.08, .1], barmirror: [.05, .7], hydrant: [.4, .2], bin: [.5, .3], bag: [.35, 0], speaker: [.8, 0], purple: [.8, 0], purpled: [.8, 0] }[m.name] || [.78, 0];
    o = new T.MeshStandardMaterial({ color: m.color.clone(), roughness: RG[0], metalness: RG[1], envMapIntensity: 1.0 }); o.name = m.name;
    if (PAINTED.test(m.name)) { o.color.set('#ffffff'); SIGN[m.name] = o; }
    o.onBeforeCompile = sh => { sh.vertexShader = 'varying vec3 vWP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = 'varying vec3 vWP;\nuniform vec3 RIMC;\nfloat mh(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }\nfloat mn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(mix(mh(i), mh(i + vec3(1,0,0)), f.x), mix(mh(i + vec3(0,1,0)), mh(i + vec3(1,1,0)), f.x), f.y), mix(mix(mh(i + vec3(0,0,1)), mh(i + vec3(1,0,1)), f.x), mix(mh(i + vec3(0,1,1)), mh(i + vec3(1,1,1)), f.x), f.y), f.z); }\n' + sh.fragmentShader
        .replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb *= .92 + .14 * mn(vWP * 2.3) + .05 * mn(vWP * 9.);')
        ; sh.uniforms.RIMC = RIMU; };
    return (MATS[m.name] = o); }
  const RIMU = { value: new T.Color('#ff6fd0') };
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0031 }, col: { value: new T.Color('#16121c') } },
    vertexShader: `uniform float k; void main(){ vec3 p=position, n=normal; mat4 M=modelViewMatrix; vec4 mv=M*vec4(p,1.); vec3 nn=normalize(mat3(M)*n); mv.xyz+=nn*clamp(-mv.z*k,.014,.5); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.);\n#include <colorspace_fragment>\n}' });
  const hullOf = g => { let h = g.clone(); ['normal', 'uv', 'color', 'uv1'].forEach(a => h.deleteAttribute(a)); h = mergeVertices(h, 2e-3); h.computeVertexNormals(); h.clearGroups(); return h; };
  const meshesOf = o => { const L = []; o.traverse(c => { if (c.isMesh && !c.userData.ink) L.push(c); }); return L; };
  const inkify = o => meshesOf(o).forEach(me => { const nm = (Array.isArray(me.material) ? me.material[0] : me.material).name; if (/^(ledfloor|neonP|neonC|neonY)$/.test(nm)) return; const h = new T.Mesh(hullOf(me.geometry), inkM); h.userData.ink = true; h.castShadow = false; h.receiveShadow = false; me.add(h); });

  // ---------- texturas pintadas ----------
  const KK = '#16121c';
  const rn0 = s0 => { let s = s0; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const REP = c => { const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 16; return t; };
  const cv = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 16; return t; };
  const tex = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); return REP(c); };
  const speck = (g, w, h, n, cols, r0, r1, rn) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; g.beginPath(); g.arc(rn() * w, rn() * h, r0 + rn() * (r1 - r0), 0, 7); g.fill(); } };
  const neonText = (g, txt, x, y, size, col, glow) => { g.save(); g.font = `900 ${size}px Inter`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    for (const [bl, a] of [[size * .5, .55], [size * .22, .8]]) { g.shadowColor = glow; g.shadowBlur = bl; g.strokeStyle = glow; g.globalAlpha = a; g.lineWidth = size * .09; g.strokeText(txt, x, y); }
    g.globalAlpha = 1; g.shadowBlur = size * .1; g.strokeStyle = col; g.lineWidth = size * .05; g.strokeText(txt, x, y); g.shadowBlur = 0; g.fillStyle = 'rgba(255,255,255,.08)'; g.fillText(txt, x, y); g.restore(); };
  let LG = null, RG = null;
  function drawReg(g, w, h, n) { g.fillStyle = '#0a1a10'; g.fillRect(0, 0, w, h); g.fillStyle = '#5fe08a'; g.font = '900 120px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#5fe08a'; g.shadowBlur = 20; g.fillText(n.toLocaleString('es-ES') + ' €', w / 2, h / 2 + 6); g.shadowBlur = 0; }
  const regTotal = n => { if (RG && SIGN.regscreen) { drawReg(RG, 512, 220, n); SIGN.regscreen.map.needsUpdate = true; } };
  function drawLED(g, w, h, t) { const n = 6, cs = w / n, pal = ['#ff3fa0', '#2fe8ff', '#ffe45a', '#8a5cff', '#ff8a3c', '#3dff9a'];
    g.fillStyle = '#0c0814'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const ph = Math.sin(t * 3.1 + i * 1.3 + j * .7) + Math.sin(t * 1.7 - j * 1.1 + i * .4), on = ph > -.2, c = pal[(i * 7 + j * 3 + Math.floor(t * 2.2)) % pal.length];
      const gr = g.createRadialGradient(i * cs + cs / 2, j * cs + cs / 2, 4, i * cs + cs / 2, j * cs + cs / 2, cs * .75); gr.addColorStop(0, on ? '#ffffff' : '#2a2040'); gr.addColorStop(.25, on ? c : '#1a1428'); gr.addColorStop(1, on ? c + '55' : '#120c1e');
      g.fillStyle = gr; g.fillRect(i * cs + 6, j * cs + 6, cs - 12, cs - 12); g.strokeStyle = '#05030a'; g.lineWidth = 12; g.strokeRect(i * cs, j * cs, cs, cs); } }
  function paintSigns() {
    const S = {
      asphalt: tex(1024, 1024, (g, w, h) => { const rn = rn0(3); g.fillStyle = '#2b2a36'; g.fillRect(0, 0, w, h); speck(g, w, h, 9000, ['#353442', '#22212c', '#3e3c4c', '#1c1b24'], .6, 2.4, rn);
        for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(20,18,28,.5)'; g.beginPath(); g.ellipse(rn() * w, rn() * h, 60 + rn() * 120, 30 + rn() * 70, rn() * 3, 0, 7); g.fill(); }
        g.strokeStyle = '#17161e'; g.lineWidth = 3; for (let i = 0; i < 7; i++) { let x = rn() * w, y = rn() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 8; k++) { x += (rn() - .5) * 60; y += 20 + rn() * 30; g.lineTo(x, y); } g.stroke(); }
        for (let i = 0; i < 5; i++) { const x = rn() * w, y = rn() * h, gr = g.createRadialGradient(x, y, 5, x, y, 150); gr.addColorStop(0, 'rgba(255,90,190,.35)'); gr.addColorStop(.5, 'rgba(90,220,255,.16)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, 150, 70, 0, 0, 7); g.fill(); } }),
      sidewalk: tex(512, 512, (g, w, h) => { const rn = rn0(5); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = ['#a9a39b', '#b3ada4', '#9f9991', '#aca69d'][(i + j * 3) % 4]; g.fillRect(i * 128, j * 128, 128, 128); }
        speck(g, w, h, 2500, ['#8e8880', '#c2bcb2', '#7e7870'], .6, 2, rn); g.strokeStyle = '#5e5850'; g.lineWidth = 5; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 128, 0); g.lineTo(k * 128, h); g.moveTo(0, k * 128); g.lineTo(w, k * 128); g.stroke(); }
        for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(60,54,50,.25)'; g.beginPath(); g.ellipse(rn() * w, rn() * h, 10 + rn() * 30, 6 + rn() * 14, rn() * 3, 0, 7); g.fill(); } speck(g, w, h, 18, ['#e8e2da'], 3, 5, rn); }),
      brick: tex(512, 512, (g, w, h) => { const rn = rn0(7); g.fillStyle = '#2a1820'; g.fillRect(0, 0, w, h); const bw = 64, bh = 28;
        for (let j = 0; j < h / bh + 1; j++) for (let i = -1; i < w / bw + 1; i++) { const x = i * bw + (j % 2) * bw / 2, y = j * bh, c = ['#6a2a2e', '#5a2228', '#7a3432', '#4e1e26', '#6e3030'][Math.floor(rn() * 5)];
          g.fillStyle = c; g.fillRect(x + 3, y + 3, bw - 6, bh - 6); g.fillStyle = 'rgba(255,200,180,.08)'; g.fillRect(x + 3, y + 3, bw - 6, 4); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + 3, y + bh - 7, bw - 6, 4); }
        for (let i = 0; i < 6; i++) { const x = rn() * w, gr = g.createLinearGradient(x, 0, x, h); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(10,6,12,.25)'); g.fillStyle = gr; g.fillRect(x, 0, 30 + rn() * 50, h); } }),
      brick2: tex(512, 512, (g, w, h) => { const rn = rn0(9); g.fillStyle = '#4a3a3a'; g.fillRect(0, 0, w, h); const bw = 64, bh = 28;
        for (let j = 0; j < h / bh + 1; j++) for (let i = -1; i < w / bw + 1; i++) { const x = i * bw + (j % 2) * bw / 2, y = j * bh; g.fillStyle = ['#b06a4a', '#a05e40', '#c07a54', '#985838'][Math.floor(rn() * 4)]; g.fillRect(x + 3, y + 3, bw - 6, bh - 6); g.fillStyle = 'rgba(255,230,200,.1)'; g.fillRect(x + 3, y + 3, bw - 6, 4); } }),
      plaster: tex(512, 512, (g, w, h) => { const rn = rn0(11); g.fillStyle = '#3f8a86'; g.fillRect(0, 0, w, h); speck(g, w, h, 3000, ['#4a9893', '#357a76', '#52a29c'], 1, 4, rn); g.strokeStyle = '#2a5e5a'; g.lineWidth = 2.5; for (let i = 0; i < 5; i++) { let x = rn() * w, y = rn() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (rn() - .5) * 50; y += 18; g.lineTo(x, y); } g.stroke(); } }),
      shutter: tex(1040, 600, (g, w, h) => { g.fillStyle = '#8d929c'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 24) { g.fillStyle = '#a7acb5'; g.fillRect(0, y, w, 12); g.fillStyle = '#6e737d'; g.fillRect(0, y + 20, w, 4); }
        g.lineWidth = 16; g.lineCap = 'round'; [['#ff4fb8', [[120, 380], [200, 240], [270, 400], [340, 250]]], ['#4ff0ff', [[420, 300], [520, 260], [600, 340], [700, 250], [780, 330]]], ['#ffd34a', [[160, 470], [380, 440], [620, 480], [880, 430]]]].forEach(([c, P]) => { g.strokeStyle = KK; g.lineWidth = 26; g.beginPath(); P.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.strokeStyle = c; g.lineWidth = 16; g.stroke(); });
        g.font = '900 64px Inter'; g.fillStyle = '#fff'; g.strokeStyle = KK; g.lineWidth = 10; g.strokeText('PANADERÍA', 520, 120); g.textAlign = 'center'; }),
      shopwin: cv(1000, 560, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffcf6a'); gr.addColorStop(1, '#ff8a3c'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = '#7a3a1a'; g.fillRect(0, h - 130, w, 130); g.fillStyle = '#c0602a'; for (const x of [240, 420]) { g.beginPath(); g.moveTo(x - 50, 120); g.lineTo(x + 50, 120); g.lineTo(x + 34, 380); g.lineTo(x - 34, 380); g.closePath(); g.fill(); g.strokeStyle = KK; g.lineWidth = 8; g.stroke(); g.fillRect(x - 4, 60, 8, 360); }
        g.fillStyle = '#2a1a20'; g.beginPath(); g.arc(720, 250, 70, 0, 7); g.fill(); g.fillRect(650, 300, 140, 160); g.fillStyle = '#fff'; g.fillRect(660, 240, 120, 18);
        g.strokeStyle = '#fff'; g.lineWidth = 10; g.strokeRect(10, 10, w - 20, h - 20); g.font = '900 80px Inter'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.strokeStyle = KK; g.lineWidth = 12; g.strokeText('KEBAB 24H', 500, 520 - 40); g.fillText('KEBAB 24H', 500, 520 - 40); }),
      win: tex(512, 512, (g, w, h) => { const rn = rn0(13); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const x = i * 128, y = j * 128, lit = rn() < .45;
        const gr = g.createLinearGradient(x, y, x, y + 128); if (lit) { gr.addColorStop(0, '#ffe08a'); gr.addColorStop(1, '#ffb24a'); } else { gr.addColorStop(0, '#2a3a66'); gr.addColorStop(1, '#141a36'); } g.fillStyle = gr; g.fillRect(x, y, 128, 128);
        if (lit && rn() < .6) { g.fillStyle = 'rgba(160,40,60,.55)'; g.fillRect(x, y, 34, 128); g.fillRect(x + 94, y, 34, 128); } if (lit && rn() < .35) { g.fillStyle = 'rgba(40,20,30,.6)'; g.beginPath(); g.arc(x + 64, y + 70, 16, 0, 7); g.fill(); g.fillRect(x + 48, y + 84, 32, 44); }
        if (!lit) { g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.moveTo(x + 10, y + 100); g.lineTo(x + 60, y + 10); g.lineTo(x + 80, y + 10); g.lineTo(x + 30, y + 100); g.fill(); }
        g.strokeStyle = '#1a1420'; g.lineWidth = 10; g.strokeRect(x + 4, y + 4, 120, 120); g.beginPath(); g.moveTo(x + 64, y); g.lineTo(x + 64, y + 128); g.moveTo(x, y + 64); g.lineTo(x + 128, y + 64); g.stroke(); } }),
      neon: cv(1560, 400, (g, w, h) => { g.fillStyle = '#0d0814'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2fe8ff'; g.shadowColor = '#2fe8ff'; g.shadowBlur = 30; g.lineWidth = 12; g.strokeRect(30, 30, w - 60, h - 60); g.shadowBlur = 0;
        neonText(g, 'ESPEJO', w / 2, h / 2 + 10, 250, '#ffe0f2', '#ff3fa0'); g.font = '900 54px Inter'; neonText(g, 'CLUB', w / 2, 78, 54, '#e0fcff', '#2fe8ff');
        for (const x of [130, w - 130]) { g.shadowColor = '#ffe45a'; g.shadowBlur = 25; g.fillStyle = '#fff6b0'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 22 : 52; g.lineTo(x + Math.cos(a) * r, h / 2 + Math.sin(a) * r); } g.fill(); g.shadowBlur = 0; } }),
      doorglass: cv(600, 660, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#1a1030'); gr.addColorStop(.5, '#3a1a50'); gr.addColorStop(1, '#120a20'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        const gl = g.createRadialGradient(w / 2, h * .7, 10, w / 2, h * .7, 260); gl.addColorStop(0, 'rgba(255,80,190,.55)'); gl.addColorStop(1, 'rgba(255,80,190,0)'); g.fillStyle = gl; g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(255,255,255,.16)'; for (const x of [60, 340]) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 80, 0); g.lineTo(x + 140, 0); g.lineTo(x + 60, h); g.fill(); } g.strokeStyle = '#ffc928'; g.lineWidth = 8; g.strokeRect(6, 6, w - 12, h - 12); }),
      ledfloor: cv(768, 768, (g, w, h) => { LG = g; drawLED(g, w, h, 0); }),
      woodfloor: tex(512, 512, (g, w, h) => { const rn = rn0(17); for (let j = 0; j < 8; j++) { let x = -rn() * 200; while (x < w) { const L = 140 + rn() * 220; g.fillStyle = ['#3a2430', '#44283a', '#321e2a', '#4a2c3c'][Math.floor(rn() * 4)]; g.fillRect(x, j * 64, L, 64); g.strokeStyle = '#1a0e16'; g.lineWidth = 4; g.strokeRect(x, j * 64, L, 64); x += L; } }
        g.strokeStyle = 'rgba(255,255,255,.05)'; g.lineWidth = 2; for (let i = 0; i < 40; i++) { const y = rn() * h; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * .3, y + 6, w * .6, y - 6, w, y); g.stroke(); } }),
      wallclub: tex(768, 768, (g, w, h) => { const rn = rn0(19); g.fillStyle = '#2a1840'; g.fillRect(0, 0, w, h);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const x = i * 192, y = j * 192; g.fillStyle = (i + j) % 2 ? '#3a2258' : '#33204e'; g.beginPath(); g.moveTo(x + 96, y + 8); g.lineTo(x + 184, y + 96); g.lineTo(x + 96, y + 184); g.lineTo(x + 8, y + 96); g.closePath(); g.fill(); g.strokeStyle = '#1a0e2a'; g.lineWidth = 8; g.stroke();
          g.fillStyle = 'rgba(255,255,255,.06)'; g.beginPath(); g.moveTo(x + 96, y + 16); g.lineTo(x + 176, y + 96); g.lineTo(x + 160, y + 96); g.lineTo(x + 96, y + 32); g.fill(); g.fillStyle = '#c070ff'; g.beginPath(); g.arc(x + 96, y + 96, 6, 0, 7); g.fill(); } }),
      ceilclub: tex(512, 512, (g, w, h) => { const rn = rn0(23); g.fillStyle = '#120c1c'; g.fillRect(0, 0, w, h); speck(g, w, h, 160, ['#ffffff', '#ffd0f0', '#c0f4ff'], .8, 2.2, rn); }),
      speaker: tex(256, 256, (g, w, h) => { g.fillStyle = '#1a1820'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2e2a36'; g.lineWidth = 8; g.strokeRect(8, 8, w - 16, h - 16);
        for (const [y, r] of [[80, 54], [186, 40]]) { g.fillStyle = '#0c0a10'; g.beginPath(); g.arc(128, y, r, 0, 7); g.fill(); g.strokeStyle = '#4a4656'; g.lineWidth = 6; g.stroke(); g.fillStyle = '#2a2632'; g.beginPath(); g.arc(128, y, r * .45, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.arc(128 - r * .3, y - r * .3, r * .15, 0, 7); g.fill(); } }),
      barmirror: cv(1100, 220, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#5a3a7a'); gr.addColorStop(.5, '#9a6ad0'); gr.addColorStop(1, '#4a2a6a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.18)'; for (let x = 0; x < w; x += 160) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 60, 0); g.lineTo(x + 90, 0); g.lineTo(x + 30, h); g.fill(); } }),
      board: cv(1440, 640, (g, w, h) => { const rn = rn0(29); g.fillStyle = '#1f4a3a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(255,255,255,.04)'; g.beginPath(); g.ellipse(rn() * w, rn() * h, 80 + rn() * 140, 20 + rn() * 50, rn() * 3, 0, 7); g.fill(); }
        g.fillStyle = '#f4f2ea'; g.font = '900 88px Inter'; g.textAlign = 'center'; g.fillText('EFECTO CONTRASTE', w / 2, 112); g.strokeStyle = '#f4f2ea'; g.lineWidth = 5; g.beginPath(); g.moveTo(300, 136); g.lineTo(1140, 136); g.stroke();
        const face = (x, y, r, pretty, hl) => { g.strokeStyle = hl ? '#ffd34a' : '#f4f2ea'; g.lineWidth = hl ? 7 : 5; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.beginPath(); g.arc(x - r * .35, y - r * .1, r * .1, 0, 7); g.arc(x + r * .35, y - r * .1, r * .1, 0, 7); g.stroke();
          g.beginPath(); if (pretty) { g.arc(x, y + r * .15, r * .4, .2, Math.PI - .2); } else { g.moveTo(x - r * .3, y + r * .45); g.lineTo(x + r * .3, y + r * .45); } g.stroke(); if (pretty) { g.beginPath(); g.moveTo(x + r * .9, y - r * .9); g.lineTo(x + r * 1.1, y - r * 1.1); g.moveTo(x + r * 1.1, y - r * .85); g.lineTo(x + r * .9, y - r * 1.05); g.stroke(); } };
        for (const [x, y] of [[170, 280], [330, 260], [170, 450], [330, 470]]) face(x, y, 52, true, false); face(250, 365, 60, false, true);
        for (const [x, y] of [[1110, 280], [1270, 260], [1110, 450], [1270, 470]]) { g.strokeStyle = '#f4f2ea'; g.lineWidth = 5; g.beginPath(); g.ellipse(x, y, 44, 58, .3, 0, 7); g.stroke(); g.beginPath(); g.arc(x - 18, y - 8, 7, 0, 7); g.arc(x + 20, y - 12, 4, 0, 7); g.stroke(); g.beginPath(); g.moveTo(x - 20, y + 25); g.quadraticCurveTo(x, y + 12, x + 22, y + 30); g.stroke(); } face(1190, 365, 60, false, true);
        g.fillStyle = '#ffd34a'; g.font = '900 54px Inter'; g.fillText('«normal»', 250, 590); g.fillText('«¡guapísimo!»', 1190, 590); g.fillStyle = '#f4f2ea'; g.font = '900 120px Inter'; g.fillText('=', w / 2, 400); g.font = '700 46px Inter'; g.fillText('la misma cara', w / 2, 480); }),
      parquet: tex(512, 512, (g, w, h) => { const cols = ['#b9824e', '#a8733f', '#c8925a', '#9d6a3a']; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = cols[(i * 3 + j) % 4]; g.fillRect(i * 64, j * 64, 64, 64); g.strokeStyle = 'rgba(40,20,8,.55)'; g.lineWidth = 3; g.strokeRect(i * 64, j * 64, 64, 64); } }),
      wallcream: tex(512, 512, (g, w, h) => { const rn = rn0(31); g.fillStyle = '#e9dfc8'; g.fillRect(0, 0, w, h); speck(g, w, h, 2000, ['#ddd2ba', '#f2e9d6'], 1, 3, rn); }),
      books: tex(512, 160, (g, w, h) => { const rn = rn0(37); let x = 0; while (x < w) { const bw = 14 + rn() * 26, bh = 100 + rn() * 50; g.fillStyle = ['#c8342c', '#2c5fa8', '#2f9a52', '#e0a42a', '#6a3a8a', '#e8e0c8'][Math.floor(rn() * 6)]; g.fillRect(x, h - bh, bw, bh); g.strokeStyle = KK; g.lineWidth = 3; g.strokeRect(x, h - bh, bw, bh); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(x + 3, h - bh + 12, bw - 6, 4); x += bw + 1; } }),
      poster: cv(1200, 600, (g, w, h) => { g.fillStyle = '#0a0612'; g.fillRect(0, 0, w, h); for (let i = 0; i < 14; i++) { g.strokeStyle = ['#ff3fa0', '#2fe8ff', '#8a5cff', '#ffe45a'][i % 4]; g.lineWidth = 10; g.globalAlpha = .75; g.beginPath(); for (let x = 0; x <= w; x += 10) g.lineTo(x, h / 2 + Math.sin(x * .012 + i * .6) * (40 + i * 12) * Math.sin(i + x * .003)); g.stroke(); } g.globalAlpha = 1; neonText(g, 'ESPEJO', w / 2, h / 2, 170, '#ffe0f2', '#ff3fa0'); }),
      poster2: cv(600, 840, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffd34a'); gr.addColorStop(1, '#ff6a3c'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = '#16121c'; g.font = '900 120px Inter'; g.textAlign = 'center'; g.fillText('FIESTA', w / 2, 170); g.fillText('80s', w / 2, 300); g.beginPath(); g.arc(w / 2, 520, 150, 0, 7); g.fill(); g.fillStyle = '#ffd34a'; g.beginPath(); g.arc(w / 2, 520, 40, 0, 7); g.fill();
        g.strokeStyle = '#ffd34a'; g.lineWidth = 6; for (let r = 60; r < 150; r += 20) { g.beginPath(); g.arc(w / 2, 520, r, 0, 7); g.stroke(); } g.fillStyle = '#16121c'; g.font = '900 64px Inter'; g.fillText('SÁBADO', w / 2, 760);
        g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(0, 0, w, 30); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; g.beginPath(); g.moveTo(40, 0); g.lineTo(90, h); g.stroke(); }),
      regscreen: cv(512, 220, (g, w, h) => { RG = g; drawReg(g, w, h, 1240); }),
      list: cv(400, 320, (g, w, h) => { g.fillStyle = '#fbf6e8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#9a9aa8'; g.lineWidth = 3; for (let y = 50; y < h; y += 36) { g.beginPath(); g.moveTo(20, y); g.lineTo(w - 20, y); g.stroke(); }
        g.strokeStyle = '#e3453a'; g.lineWidth = 5; for (let y = 50; y < h; y += 36) { if ((y / 36 | 0) % 2) { g.beginPath(); g.moveTo(40, y - 12); g.lineTo(w - 60, y - 10); g.stroke(); } else { g.strokeStyle = '#2f9a52'; g.beginPath(); g.moveTo(40, y - 14); g.lineTo(52, y - 4); g.lineTo(72, y - 24); g.stroke(); g.strokeStyle = '#e3453a'; } } }),
    };
    for (const k in S) if (SIGN[k]) { SIGN[k].map = S[k]; SIGN[k].needsUpdate = true; }
  }

  // ---------- carga del GLB, sitios, haces de luz, destellos y charcos ----------
  const G = {}, SITES = {}; ['street', 'dance', 'aula'].forEach(n => { SITES[n] = new T.Group(); SITES[n].visible = false; scene.add(SITES[n]); });
  const READY_W = new Promise((resolve, reject) => {
    const b64 = window.GLB_DISCO, bin = atob(b64), buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    Promise.resolve(document.fonts && document.fonts.load ? document.fonts.load('900 100px Inter') : 0).then(() => new GLTFLoader().parse(buf.buffer, '', gl => {
      gl.scene.children.slice().forEach(o => { G[o.name] = o; });
      Object.values(G).forEach(o => meshesOf(o).forEach(me => { me.material = Array.isArray(me.material) ? me.material.map(toon) : toon(me.material); me.castShadow = true; me.receiveShadow = true; }));
      Object.values(G).forEach(o => meshesOf(o).forEach(me => { const nm = (Array.isArray(me.material) ? me.material[0] : me.material).name; if (PAINTED.test(nm) && !me.geometry.attributes.uv) { if (TILE[nm]) boxUV(me.geometry, TILE[nm]); else planarUV(me.geometry, null); } }));
      paintSigns(); build(); resolve(); }, e => reject(e)));
  });
  function boxUV(geo, tile) { const p = geo.attributes.position, n = geo.attributes.normal, uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) { const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i)), nz = Math.abs(n.getZ(i)); let u, v;
      if (ny >= nx && ny >= nz) { u = p.getX(i); v = p.getZ(i); } else if (nx >= nz) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
      uv[i * 2] = u / tile; uv[i * 2 + 1] = v / tile; }
    geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); }
  function planarUV(geo) { const p = geo.attributes.position, nrm = geo.attributes.normal, uv = new Float32Array(p.count * 2); geo.computeBoundingBox(); const bb = geo.boundingBox, sz = bb.getSize(new T.Vector3());
    const ax = sz.z <= sz.x && sz.z <= sz.y ? ['x', 'y'] : (sz.x <= sz.y ? ['z', 'y'] : ['x', 'z']);
    for (let i = 0; i < p.count; i++) { uv[i * 2] = (p['get' + ax[0].toUpperCase()](i) - bb.min[ax[0]]) / Math.max(1e-6, sz[ax[0]]); uv[i * 2 + 1] = (p['get' + ax[1].toUpperCase()](i) - bb.min[ax[1]]) / Math.max(1e-6, sz[ax[1]]); }
    geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); }
  const grad = (stops, w = 64, h = 256) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, h); stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const gx = g.createLinearGradient(0, 0, w, 0); gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(.5, 'rgba(0,0,0,0)'); gx.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = gx; g.fillRect(0, 0, w, h); const t = new T.CanvasTexture(c); return t; };
  const beamTex = grad([[0, 'rgba(255,255,255,.9)'], [1, 'rgba(255,255,255,0)']]);
  const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); })();
  const BEAMS = [], POOLS = [], SPARK = [];
  const COLS = ['#ff3fa0', '#2fe8ff', '#ffe45a', '#8a5cff', '#ff3fa0', '#2fe8ff'];
  let BALL = null;
  function beam(site, from, to, col, w0 = .12, w1 = 1.6, op = .3) { const L = from.distanceTo(to), geo = new T.CylinderGeometry(w0, w1, L, 24, 1, true); geo.translate(0, -L / 2, 0);
    const m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: beamTex, color: col, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: op, side: T.DoubleSide, fog: false }));
    m.position.copy(from); m.lookAt(to); m.rotateX(-Math.PI / 2); m.renderOrder = 3; SITES[site].add(m); return m; }
  function pool(site, x, y, z, r, col, op = .5) { const m = new T.Mesh(new T.CircleGeometry(r, 40), new T.MeshBasicMaterial({ map: dotTex, color: col, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: op, fog: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.renderOrder = 2; SITES[site].add(m); return m; }
  function build() {
    [['street', 'street_floor'], ['dance', 'dance_floor'], ['aula', 'aula_floor']].forEach(([a, b]) => { SITES[a].add(G[a]); SITES[a].add(G[b]); });
    addLights();
    const S0 = LAY.sites.street[0], D0 = LAY.sites.dance[0];
    // calle: conos de luz de farolas, focos del cartel, charcos que reflejan el neón, luz rosa en la acera
    for (const x of [S0 - 6.5, S0 + 6.5, S0 - 19, S0 + 19]) { const hx = x + (x > S0 ? .75 : -.75); BEAMS.push({ m: beam('street', V3(hx, 4.1, -.5), V3(hx, 0, -.5), '#ffd98a', .12, 1.6, .16), k: .16 }); POOLS.push(pool('street', hx, .17, -.5, 2.2, '#ffcf7a', .5)); }
    POOLS.push(pool('street', S0, .2, -5.0, 2.6, '#ffc870', .45));
    POOLS.push(pool('street', S0, .2, -5.6, 2.4, '#ff3fa0', .35)); POOLS.push(pool('street', S0 - 11, .17, -4.8, 3.5, '#ffd08a', .35)); POOLS.push(pool('street', S0 + 10, .17, -5.0, 3.0, '#ffb24a', .45));
    [[S0 - 2.5, 3.0, 1.4, '#ff3fa0'], [S0 + 3.5, 5.5, 1.1, '#ffd08a'], [S0 - 7, 7.5, 1.6, '#ffcf7a']].forEach(([x, z, r, c]) => { const m = new T.Mesh(new T.CircleGeometry(r, 32), new T.MeshBasicMaterial({ color: '#141022', transparent: true, opacity: .55, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.scale.y = .55; m.position.set(x, .012, z); SITES.street.add(m); POOLS.push(pool('street', x, .02, z, r * .9, c, .35)); });
    // pista: haces de los focos que se mueven, bola de espejos que gira y destellos en paredes y suelo
    (LAY.spots || []).forEach(([x, y, z], i) => { const c = COLS[i % COLS.length]; BEAMS.push({ m: beam('dance', V3(x, y, z), V3(x, 0, -3), c, .1, .9, .26), k: .26, x, y, z, i, c }); });
    BALL = G.dance.getObjectByName ? null : null;
    const SP = new T.BufferGeometry(), N = 420, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), rn = rn0(41);
    for (let i = 0; i < N; i++) { const a = rn() * Math.PI * 2, b = rn(); let x, y, z; const r = rn();
      if (r < .4) { x = D0 + (rn() - .5) * 18; y = .5 + rn() * 2.8; z = -9.95; } else if (r < .6) { x = D0 - 8.95; y = .5 + rn() * 2.8; z = -9.5 + rn() * 15; } else if (r < .8) { x = D0 + 8.95; y = .5 + rn() * 2.8; z = -9.5 + rn() * 15; } else { x = D0 + (rn() - .5) * 16; y = .06; z = -9.5 + rn() * 15; }
      pos.set([x, y, z], i * 3); const c = new T.Color(['#ffffff', '#ffd0f0', '#c0f4ff', '#fff0b0'][i % 4]); col.set([c.r, c.g, c.b], i * 3); }
    SP.setAttribute('position', new T.BufferAttribute(pos, 3)); SP.setAttribute('color', new T.BufferAttribute(col, 3));
    const spark = new T.Points(SP, new T.PointsMaterial({ size: .16, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, sizeAttenuation: true }));
    spark.renderOrder = 4; SITES.dance.add(spark); SPARK.push(spark);
    POOLS.push(pool('dance', D0, .09, -3, 4, '#ff3fa0', .18));
    // aula: luz cálida de la lámpara sobre la mesa y la pizarra
    BEAMS.push({ m: beam('aula', V3(LAY.sites.aula[0] + 1.1, 2.25, -3), V3(LAY.sites.aula[0] + 1.1, 0, -3), '#ffe3a0', .1, 1.3, .14), k: .14 });
  }
  function addLights() { const S0 = LAY.sites.street[0], D0 = LAY.sites.dance[0], A0 = LAY.sites.aula[0];
    const PL = (site, c, i, x, y, z, d = 18) => { const l = new T.PointLight(c, i, d, 1.6); l.position.set(x, y, z); SITES[site].add(l); return l; };
    PL('street', '#ff3fa0', 5, S0, 4.4, -5.2, 6);
    PL('street', '#ffc870', 4, S0, 2.6, -4.6, 5); PL('street', '#ffd08a', 3, S0 - 11, 2.0, -4.3, 7); PL('street', '#ffe080', 6, S0 + 10, 2.5, -5.5, 7);
    for (const x of [S0 - 6.5, S0 + 6.5, S0 - 19, S0 + 19]) PL('street', '#ffd08a', 14, x + (x > S0 ? .75 : -.75), 3.9, -.5, 10);
    PL('street', '#8a9aff', 4, S0 - 3, 6, 6, 30);
    const SPL = []; (LAY.spots || []).forEach(([x, y, z], i) => { if (i % 2) return; const c = COLS[i % COLS.length]; const l = new T.SpotLight(c, 22, 8, .5, .55, 1.4); l.position.set(x, y, z); l.target.position.set(x, 0, -3); SITES.dance.add(l, l.target); SPL.push(l); });
    PL('dance', '#ff3fa0', 12, D0, .6, -3, 7); PL('dance', '#2fe8ff', 8, D0 - 7, 2.6, -2.5, 9); PL('dance', '#ffb070', 9, D0 + 7, 2.6, -3, 7); PL('dance', '#8a5cff', 12, D0, 2.8, -8.5, 10); PL('dance', '#ffd08a', 8, D0 - 12, 1.2, -4, 6);
    PL('aula', '#ffe3a0', 12, A0 + 1.1, 2.1, -3, 8); PL('aula', '#fff4e0', 3, A0, 2.0, 2, 14); }
  function site(n) { Object.keys(SITES).forEach(k => SITES[k].visible = k === n); sky.visible = n === 'street'; }

  // ---------- ambientes ----------
  const MOODS = {
    calle: { sun: '#a8b8ff', sunI: .55, dir: [-.4, .8, .5], hemi: '#8090c8', ground: '#3a2a30', hemiI: .55, fog: '#161a34', fogD: .012, top: '#0b1030', hor: '#4a2a66', bloom: .9, rim: '#ff6fd0' },
    pista: { sun: '#ff9ae0', sunI: .25, dir: [-.2, .9, .4], hemi: '#9080c0', ground: '#401830', hemiI: .5, fog: '#20122e', fogD: .022, top: '#000', hor: '#000', bloom: 1.05, rim: '#4ff0ff' },
    aula: { sun: '#fff0d0', sunI: 1.0, dir: [-.3, .8, .5], hemi: '#fff4e0', ground: '#8a6a4a', hemiI: .7, fog: '#e8dcc4', fogD: .004, top: '#000', hor: '#000', bloom: .25, rim: '#ffe0b0' },
  };
  let MOOD = 'calle';
  function setMood(m) { if (!MOODS[m]) m = 'calle'; MOOD = m; const Mo = MOODS[m]; sun.color.set(Mo.sun); sun.intensity = Mo.sunI; SUN.set(...Mo.dir).normalize(); hemi.color.set(Mo.hemi); hemi.groundColor.set(Mo.ground); hemi.intensity = Mo.hemiI;
    scene.fog.color.set(Mo.fog); scene.fog.density = Mo.fogD; skyU.top.value.set(Mo.top); skyU.hor.value.set(Mo.hor); bloom.strength = Mo.bloom; RIMU.value.set(Mo.rim); }
  function setCam(pos, look, fov = 40, focus = null, ap = .0004) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    const D = Math.max(18, Math.min(150, pos.distanceTo(look) * 1.1)); const sc = sun.shadow.camera; if (sc.right !== D) { sc.left = -D; sc.right = D; sc.top = D; sc.bottom = -D; sc.near = 1; sc.far = D * 6; sc.updateProjectionMatrix(); }
    sun.position.copy(look).addScaledVector(SUN, D * 3); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  // ---------- post: brillo fuerte en neones, desenfoque de fondo, color ----------
  const comp = new EffectComposer(R, new T.WebGLRenderTarget(W, H, { samples: 4, type: T.HalfFloatType })); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const gtao = new GTAOPass(scene, camera, W, H, undefined, { radius: .9, distanceExponent: 1.4, thickness: 1.5, scale: 1.1, samples: 12 }, { lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, rings: 2, samples: 8 }); gtao.blendIntensity = .9; /* GTAO desactivado: manchas junto a los neones */
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .7, .5, .8); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .0004, maxblur: .016 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null } }, depthTest: false, depthWrite: false, vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; c=c/(1.+max(c-.85,0.)*.9); c=clamp(c,0.,1.); float l=dot(c,vec3(.299,.587,.114)); c=clamp(mix(vec3(l),c,1.1),0.,1.); c=c*c*(3.-2.*c)*.3+c*.7; c*=vec3(1.04,1.0,.96); float v=smoothstep(1.15,.35,length(vUv-.5)*1.6); c*=.72+.28*v; gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  function render() { comp.render(); }
  function setTime(t) { skyU.time.value = t; uTime.value = t; TICK.forEach(f => f(t));
    if (LG && SIGN.ledfloor) { drawLED(LG, 768, 768, t); SIGN.ledfloor.map.needsUpdate = true; }
    BEAMS.forEach(b => { if (b.i === undefined) return; const a = t * (.9 + (b.i % 3) * .25) + b.i * 1.7, tx = LAY.sites.dance[0] + Math.sin(a) * 2.2, tz = -3 + Math.cos(a * 1.3) * 2.2; b.m.lookAt(V3(tx, 0, tz)); b.m.rotateX(-Math.PI / 2); b.m.material.opacity = b.k * (.75 + .25 * Math.sin(t * 5 + b.i)); });
    SPARK.forEach(sp => { sp.material.size = .13 + .05 * Math.sin(t * 7); const p = sp.geometry.attributes.position; sp.rotation.y = 0; sp.position.x = Math.sin(t * .6) * .9; sp.position.y = Math.cos(t * .5) * .4; }); }
  const ground = () => 0;
  return { regTotal, T, scene, camera, R, comp, setCam, proj, render, setTime, setMood, site, ground, SUN, G, SITES, READY_W, sky, dof, bloom, inkify, toon, TICK, get mood() { return MOOD; } };
})();

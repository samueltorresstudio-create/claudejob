// Archivo Raro · mundo 3D de DIBUJO ANIMADO para «El plátano de seis millones» (76).
// Decorados modelados en Blender (platano.glb → glb_platano.js) con sombreado de tebeo (MeshToon), contorno negro, cielo de nubes duras y agua de rayas blancas.
// Cuatro sitios: gallery (0), auction (1000), stage (2000), stand (3000). site(nombre) enseña uno y esconde los demás.
// API compatible con core3d.js y stick.js: setCam, proj, render, setTime, setMood, site, ground, waterY, charLight.
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
  const uTime = { value: 0 }, uRipe = { value: .3 }, MATS = {}, SIGN = {}, PAINTED = /^(paint\d|screen|backdrop|cert|subasta|art|frutas|brillo|tape)$/;
  const swayMat = m => { m.onBeforeCompile = sh => { sh.uniforms.uTime = uTime; sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
    float sw = smoothstep(2.5, 9., position.y); vec3 ip = vec3(0.);
    #ifdef USE_INSTANCING
      ip = instanceMatrix[3].xyz;
    #endif
    transformed.x += sin(uTime*1.7 + position.z*.5 + ip.x*.31 + ip.z*.17) * .32 * sw; transformed.z += cos(uTime*1.3 + position.x*.4 + ip.z*.23) * .22 * sw;`); }; };
  const ripeMat = (m, ridge) => { m.onBeforeCompile = sh => { sh.uniforms.uRipe = uRipe;
    sh.vertexShader = 'varying vec3 vP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vP = position;');
    sh.fragmentShader = 'uniform float uRipe; varying vec3 vP;\nfloat hh(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }\n' + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      float r = uRipe; vec3 green=vec3(.50,.78,.18), yel=vec3(1.,.88,.2), brn=vec3(.52,.30,.10), blk=vec3(.13,.09,.06);
      vec3 c = r<.22 ? mix(green,yel,r/.22) : r<.5 ? yel : r<.78 ? mix(yel,brn,(r-.5)/.28) : mix(brn,blk,(r-.78)/.22);
      c = mix(c, vec3(.56,.74,.16), smoothstep(.48,.70,abs(vP.x)) * (1.-smoothstep(.2,.55,r)) * .75);          // tinte verdoso en los extremos
      vec3 g = vP*7.5; vec3 cell = floor(g); vec3 fr = fract(g) - .5; float h1 = hh(cell);
      float d = length(fr + (vec3(hh(cell+1.7), hh(cell+4.1), hh(cell+9.3)) - .5) * .45);
      float spot = step(1. - smoothstep(.35, 1., r) * .55, h1) * (1. - smoothstep(.17, .27, d)) * smoothstep(.3, .45, r); c = mix(c, mix(brn, blk, .6), spot);
      float tip = smoothstep(.0,.1,abs(vP.x)-.58); c = mix(c, vec3(.35,.22,.08), tip*.5*step(.5,r));
      c *= ${ridge ? '.90' : '1.14'};
      diffuseColor.rgb = pow(c, vec3(2.2));`).replace('#include <opaque_fragment>', `#include <opaque_fragment>
      { vec3 nn = normalize(vNormal); float sp = pow(max(dot(nn, normalize(vec3(-.35,.55,.75))), 0.), 26.); float rim = pow(1. - max(dot(nn, vec3(0.,0.,1.)), 0.), 3.);
        gl_FragColor.rgb += vec3(1.,.98,.85) * sp * .38 * (1. - smoothstep(.5,.9,uRipe)) + vec3(.1,.08,.0) * rim * .5; }`); }; };
  function toon(m) { if (MATS[m.name]) return MATS[m.name]; const o = new T.MeshToonMaterial({ color: m.color.clone(), gradientMap: toonG, vertexColors: !!m.vertexColors }); o.name = m.name;
    if (m.name === 'bananaskin') ripeMat(o, false); if (m.name === 'bananaridge') ripeMat(o, true); if (PAINTED.test(m.name)) { o.color.set('#ffffff'); SIGN[m.name] = o; } return (MATS[m.name] = o); }
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0021 }, col: { value: new T.Color('#241c2c') } },
    vertexShader: `uniform float k; void main(){ vec3 p=position, n=normal; mat4 M=modelViewMatrix;
      #ifdef USE_INSTANCING
        M=modelViewMatrix*instanceMatrix;
      #endif
      vec4 mv=M*vec4(p,1.); vec3 nn=normalize(mat3(M)*n); mv.xyz+=nn*clamp(-mv.z*k,.012,.5); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.);\n#include <colorspace_fragment>\n}' });
  const hullOf = g => { let h = g.clone(); ['normal', 'uv', 'color', 'uv1'].forEach(a => h.deleteAttribute(a)); h = mergeVertices(h, 2e-3); h.computeVertexNormals(); h.clearGroups(); return h; };
  const meshesOf = o => { const L = []; o.traverse(c => { if (c.isMesh && !c.userData.ink) L.push(c); }); return L; };
  const inkify = o => meshesOf(o).forEach(me => { const h = new T.Mesh(hullOf(me.geometry), inkM); h.userData.ink = true; h.castShadow = false; h.receiveShadow = false; me.add(h); });


  // ---------- cuadros, pantalla, fondo de Hong Kong y certificado, pintados en canvas ----------
  const cv = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; };
  const KK = '#241c2c';
  const rr = (g, x, y, w, h, c, lw = 8) => { g.fillStyle = c; g.fillRect(x, y, w, h); g.strokeStyle = KK; g.lineWidth = lw; g.strokeRect(x, y, w, h); };
  function paintSigns() {
    const S = {
      // cuadros enormes y vistosos: el plátano destaca por ser lo más simple de la sala
      paint1: cv(1024, 768, (g, w, h) => { g.fillStyle = '#ffe9b0'; g.fillRect(0, 0, w, h); [[60,80,300,300,'#e3453a'],[400,40,260,420,'#4f8fe8'],[700,120,260,240,'#ffd34a'],[120,430,380,260,'#43bd65'],[560,420,360,300,'#8a63d2']].forEach(([x,y,bw,bh,c]) => rr(g,x,y,bw,bh,c));
        g.fillStyle = '#fff'; g.beginPath(); g.arc(250, 230, 80, 0, 7); g.fill(); g.stroke(); g.fillStyle = KK; g.beginPath(); g.arc(250, 230, 28, 0, 7); g.fill(); g.lineWidth = 12; g.strokeStyle = KK; g.beginPath(); g.moveTo(0, 410); g.lineTo(w, 360); g.stroke(); }),
      paint2: cv(768, 1024, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ff7a59'); gr.addColorStop(.5, '#ffd34a'); gr.addColorStop(1, '#2cc4b4'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.strokeStyle = KK; g.lineWidth = 14; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(w / 2, h * .58, 60 + i * 55, Math.PI * (.1 + i * .02), Math.PI * (1.9 - i * .02)); g.stroke(); } g.fillStyle = '#fff'; g.beginPath(); g.arc(w / 2, h * .58, 46, 0, 7); g.fill(); g.stroke(); }),
      paint3: cv(1024, 600, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#5a4aa8'); gr.addColorStop(.55, '#ff8a5c'); gr.addColorStop(1, '#ffd34a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = '#fff3c4'; g.beginPath(); g.arc(700, 270, 110, 0, 7); g.fill(); g.strokeStyle = KK; g.lineWidth = 8; g.stroke(); g.fillStyle = '#2a2a52'; g.beginPath(); g.moveTo(0, h); g.lineTo(0, 380); g.lineTo(220, 280); g.lineTo(420, 400); g.lineTo(640, 300); g.lineTo(w, 420); g.lineTo(w, h); g.fill(); g.stroke(); }),
      paint4: cv(768, 800, (g, w, h) => { g.fillStyle = '#1f3f9a'; g.fillRect(0, 0, w, h); g.fillStyle = '#e3453a'; g.beginPath(); g.arc(w / 2, h * .46, 250, 0, 7); g.fill(); g.strokeStyle = KK; g.lineWidth = 10; g.stroke(); g.fillStyle = KK; g.fillRect(0, h * .76, w, 40); g.fillStyle = '#ffd34a'; g.fillRect(0, h * .84, w, 26); }),
      // pantalla de la subasta: el lote
      screen: cv(1536, 840, (g, w, h) => { g.fillStyle = '#fff8e6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e0951c'; g.lineWidth = 18; g.strokeRect(18, 18, w - 36, h - 36);
        g.save(); g.translate(w / 2, h / 2 + 40); g.rotate(-.35); g.fillStyle = '#ffd83a'; g.strokeStyle = KK; g.lineWidth = 16; g.beginPath(); g.moveTo(-300, 30); g.bezierCurveTo(-180, 230, 200, 230, 320, -60); g.bezierCurveTo(360, -140, 300, -150, 270, -100); g.bezierCurveTo(160, 90, -160, 110, -270, -60); g.bezierCurveTo(-310, -110, -350, -40, -300, 30); g.closePath(); g.fill(); g.stroke(); g.restore();
        g.save(); g.translate(w / 2, h / 2 + 40); g.rotate(-.35 + .5); const tg = g.createLinearGradient(-90, 0, 90, 0); tg.addColorStop(0, '#9aa3b3'); tg.addColorStop(.35, '#f2f5fa'); tg.addColorStop(.7, '#cfd6e2'); tg.addColorStop(1, '#8e97a8'); g.fillStyle = tg; g.fillRect(-90, -300, 180, 520); g.strokeStyle = KK; g.lineWidth = 12; g.strokeRect(-90, -300, 180, 520); g.fillStyle = 'rgba(80,90,110,.35)'; for (let i = 0; i < 6; i++) g.fillRect(-90, -250 + i * 80, 180, 7); g.restore(); }),
      // la bahía de Hong Kong al anochecer, rascacielos con ventanas y neones
      backdrop: cv(1800, 580, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2c1f6b'); gr.addColorStop(.5, '#d8508a'); gr.addColorStop(.72, '#ffb35a'); gr.addColorStop(.73, '#2a2f6a'); gr.addColorStop(1, '#141a4a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        let s = 9; const rn = () => (s = (s * 16807) % 2147483647) / 2147483647; const base = h * .73;
        for (let i = 0; i < 26; i++) { const bw = 60 + rn() * 90, bh = 110 + rn() * 300, x = i * 70 - 20 + rn() * 30; g.fillStyle = ['#1b1a4a', '#2a2a66', '#38327e'][i % 3]; g.fillRect(x, base - bh, bw, bh); g.strokeStyle = KK; g.lineWidth = 5; g.strokeRect(x, base - bh, bw, bh);
          g.fillStyle = '#ffe58a'; for (let yy = base - bh + 14; yy < base - 12; yy += 22) for (let xx = x + 10; xx < x + bw - 10; xx += 18) if (rn() > .45) g.fillRect(xx, yy, 8, 11); if (i % 4 === 1) { g.fillStyle = KK; g.fillRect(x + bw / 2 - 3, base - bh - 50, 6, 50); g.fillStyle = '#ff4f7b'; g.beginPath(); g.arc(x + bw / 2, base - bh - 54, 8, 0, 7); g.fill(); } }
        g.fillStyle = '#ffd34a'; g.beginPath(); g.arc(1500, 180, 60, 0, 7); g.fill(); for (let i = 0; i < 60; i++) { g.fillStyle = ['#ffe58a', '#ff4f7b', '#5fe0d4'][i % 3]; g.globalAlpha = .55; g.fillRect(rn() * w, base + 8 + rn() * (h - base - 10), 6 + rn() * 40, 4); } g.globalAlpha = 1; }),
      // certificado de autenticidad con instrucciones
      cert: cv(768, 1075, (g, w, h) => { g.fillStyle = '#fbf3da'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e0951c'; g.lineWidth = 14; g.strokeRect(20, 20, w - 40, h - 40); g.fillStyle = '#2c3f86'; g.fillRect(70, 70, w - 140, 110);
        g.fillStyle = '#ffd83a'; g.beginPath(); g.arc(w / 2, 125, 38, 0, 7); g.fill(); g.fillStyle = '#2a2430'; for (let i = 0; i < 12; i++) { g.fillRect(80, 230 + i * 54, i % 4 === 3 ? 330 : w - 160, 18); }
        g.save(); g.translate(w / 2, 900); g.rotate(-.35); g.fillStyle = '#ffd83a'; g.strokeStyle = KK; g.lineWidth = 8; g.beginPath(); g.moveTo(-90, 10); g.bezierCurveTo(-50, 60, 50, 60, 90, -20); g.bezierCurveTo(100, -40, 80, -40, 72, -28); g.bezierCurveTo(40, 22, -40, 24, -78, -20); g.closePath(); g.fill(); g.stroke(); g.restore(); }),
      // cinta americana: plateada con trama de tela, brillo diagonal, rozaduras y bordes más oscuros
      tape: cv(1792, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9aa3b3'); gr.addColorStop(.08, '#c7ced9'); gr.addColorStop(.35, '#f4f7fb'); gr.addColorStop(.62, '#dfe5ee'); gr.addColorStop(.92, '#b0b9c8'); gr.addColorStop(1, '#8e97a8'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.strokeStyle = 'rgba(70,80,100,.28)'; g.lineWidth = 2; for (let x = -h; x < w; x += 9) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + h, h); g.stroke(); g.beginPath(); g.moveTo(x + h, 0); g.lineTo(x, h); g.stroke(); }
        g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.5; for (let y = 6; y < h; y += 6) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        let s = 11; const rn = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(${rn() > .5 ? '40,46,60' : '255,255,255'},${.05 + rn() * .12})`; g.beginPath(); g.ellipse(rn() * w, rn() * h, 8 + rn() * 50, 2 + rn() * 6, rn() * 3, 0, 7); g.fill(); }
        const sh = g.createLinearGradient(0, 0, w, h * .2); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(.42, 'rgba(255,255,255,0)'); sh.addColorStop(.5, 'rgba(255,255,255,.55)'); sh.addColorStop(.58, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sh; g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(60,66,84,.55)'; g.fillRect(0, 0, w, 7); g.fillRect(0, h - 7, w, 7); }),
      subasta: cv(1792, 205, (g, w, h) => { g.fillStyle = '#2c3f86'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffd34a'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28); g.fillStyle = '#ffd34a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 120px Inter'; g.fillText('CASA DE SUBASTAS', w / 2, h / 2 + 6); }),
    };
    for (const k in S) if (SIGN[k]) { SIGN[k].map = S[k]; SIGN[k].needsUpdate = true; }
  }

  // ---------- sitios, carga del GLB, plátano y láseres ----------
  const G = {}, SITES = {}, GROUND = {}; ['gallery', 'auction', 'stage', 'stand'].forEach(n => { SITES[n] = new T.Group(); SITES[n].visible = false; scene.add(SITES[n]); });
  const AXo = LAY.sites.auction[0], SXo = LAY.sites.stage[0], NXo = LAY.sites.stand[0];
  const READY_W = new Promise((resolve, reject) => {
    const b64 = window.GLB_PLATANO, bin = atob(b64), buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    Promise.resolve(document.fonts && document.fonts.load ? document.fonts.load('900 100px Inter') : 0).then(() => new GLTFLoader().parse(buf.buffer, '', gl => {
      gl.scene.children.slice().forEach(o => { G[o.name] = o; });
      Object.values(G).forEach(o => meshesOf(o).forEach(me => { const ms = Array.isArray(me.material) ? me.material.map(toon) : toon(me.material); me.material = ms; me.castShadow = true; me.receiveShadow = true; }));
      Object.values(G).forEach(o => meshesOf(o).forEach(me => { const nm = (Array.isArray(me.material) ? me.material[0] : me.material).name; if (PAINTED.test(nm) && (nm === 'tape' || !me.geometry.attributes.uv)) planarUV(me.geometry, nm === 'tape' ? ['x', 'y'] : null); }));
      paintSigns(); build(); resolve(); }, e => reject(e)));
  });
  function planarUV(geo, force) {
    const p = geo.attributes.position; geo.computeBoundingBox(); const bb = geo.boundingBox, sz = bb.getSize(new T.Vector3()), ax = force || (sz.z <= sz.x && sz.z <= sz.y ? ['x', 'y'] : (sz.x <= sz.y ? ['z', 'y'] : ['x', 'z'])), uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) { uv[i * 2] = (p['get' + ax[0].toUpperCase()](i) - bb.min[ax[0]]) / Math.max(1e-6, sz[ax[0]]); uv[i * 2 + 1] = (p['get' + ax[1].toUpperCase()](i) - bb.min[ax[1]]) / Math.max(1e-6, sz[ax[1]]); }
    geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); }
  const place = (o, site, x, y, z, ry = 0, s = 1) => { const c = o.clone(true); c.position.set(x, y, z); c.rotation.y = ry; c.scale.setScalar(s); SITES[site].add(c); return c; };
  const ray = new T.Raycaster();
  function groundAt(site, x, z) { const L = GROUND[site]; if (!L) return 0; ray.set(new T.Vector3(x, 300, z), new T.Vector3(0, -1, 0)); ray.far = 700; const h = ray.intersectObjects(L, false); return h.length ? h[0].point.y : 0; }
  const LAS = new T.Group(); let POOLL = null, POOLM = null, wall = null, wallAu = null, tapeG = null, tapeAu = null; const BEAMS = [], SPIN = [];
  const radTex = (col, a) => new T.CanvasTexture(((c) => { c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 2, 64, 64, 64); gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(.35, col.replace('A', a * .55)); gr.addColorStop(1, col.replace('A', 0)); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c; })(document.createElement('canvas')));
  function build() {
    ['gallery', 'auction', 'stage', 'stand'].forEach(n => { inkify(G[n]); SITES[n].add(G[n]); SITES[n].add(G[n + '_floor']); });
    ['banana', 'banana_big', 'wallpiece', 'tape', 'cert', 'peeled', 'emitter', 'seccam', 'beacon'].forEach(n => { inkify(G[n]); G[n].visible = false; });
    // la obra: plátano + cinta (objeto aparte, girada) pegados a la pared blanca de la galería y de la sala de subastas
    const art = (site, x, y, z, s) => { const b = place(G.wallpiece, site, x, y, z, 0, s); b.visible = true; const t = place(G.tape, site, x, y + .1 * s, z, 0, s); t.rotation.z = .5; t.visible = true; return [b, t]; };
    [wall, tapeG] = art('gallery', LAY.banana.x, LAY.banana.y, LAY.banana.z, 1.12); [wallAu, tapeAu] = art('auction', AXo + 10.5, 4.3, -16.7, .8);
    const pl = place(G.banana, 'stage', SXo + .2, 2.78, -8., .3, .42); pl.visible = true; pl.rotation.z = -.15;
    [[-1.8, 0], [-.6, 1], [.6, 2], [1.8, 3]].forEach(([dx, k]) => { for (let i = 0; i < 3; i++) { const b = place(G.banana, 'stand', NXo - 5 + dx + (i - 1) * .22, 2.03 + i * .06, 13.5 + (i - 1) * .12, .6 * i + k, .28); b.visible = true; b.rotation.z = .2 * (i - 1); } });
    // ---------- sistema de láseres de seguridad: emisores en las paredes, haces con brillo que barren la obra, puntos de impacto, cámaras y baliza ----------
    const coreM = new T.MeshBasicMaterial({ color: '#ffe3e6', fog: false }), glowM = new T.MeshBasicMaterial({ color: '#ff1f38', transparent: true, opacity: .42, depthWrite: false, blending: T.AdditiveBlending, fog: false });
    const glow2M = new T.MeshBasicMaterial({ color: '#ff3a50', transparent: true, opacity: .16, depthWrite: false, blending: T.AdditiveBlending, fog: false });
    const dotM = new T.MeshBasicMaterial({ map: radTex('rgba(255,40,60,A)', 1), transparent: true, depthWrite: false, fog: false });
    const BX_ = V3(LAY.banana.x, LAY.banana.y, LAY.banana.z + .08);
    function beam(a, b0, amp, sp, ph, kind) {
      const core = new T.Mesh(new T.CylinderGeometry(.02, .02, 1, 6), coreM), glow = new T.Mesh(new T.CylinderGeometry(.07, .07, 1, 10, 1, true), glowM), glow2 = new T.Mesh(new T.CylinderGeometry(.2, .2, 1, 10, 1, true), glow2M);
      const dot = new T.Mesh(new T.PlaneGeometry(kind === 'floor' ? 1.6 : 1.2, kind === 'floor' ? 1.6 : 1.2), dotM); if (kind === 'floor') dot.rotation.x = -Math.PI / 2; dot.renderOrder = 3;
      const em = new T.Object3D(); const emc = G.emitter.clone(true); emc.visible = true; em.add(emc); em.position.copy(a); LAS.add(core, glow, glow2, dot, em); BEAMS.push({ a, b0, amp, sp, ph, core, glow, glow2, dot, em, kind }); }
    [.8, 2., 3.3, 4.6, 6., 7.3].forEach((y, i) => { beam(V3(-11.05, y, -2.5 - i * 1.5), V3(LAY.banana.x - 1.5 + i * .45, LAY.banana.y - 1.1 + i * .38, -17.6), .55, 1.1 + i * .13, i, 'wall'); beam(V3(11.05, y + .3, -3.3 - i * 1.4), V3(LAY.banana.x + 1.5 - i * .45, LAY.banana.y + 1.1 - i * .35, -17.6), .55, .9 + i * .15, i + 2, 'wall'); });
    [-4.2, -1.4, 1.4, 4.2].forEach((x, i) => beam(V3(x, 8.7, -8.5), V3(x * .45, .03, -14.2), .7, 1.3 + i * .2, i * 1.7, 'floor'));
    [.6, 1.3, 2.1, 3., 4.].forEach((y, i) => beam(V3(-11.05, y, -5 - i * .95), V3(11.05, y, -5 - i * .95), .3, .8 + i * .17, i * 2.3, 'side'));
    // cámaras de vigilancia en las esquinas del techo y baliza de alarma giratoria
    [[-10, 8.8, 3, .55], [10, 8.8, 3, -.55]].forEach(([x, y, z, ry]) => { const c = G.seccam.clone(true); c.visible = true; c.position.set(x, y, z); c.rotation.y = Math.PI + ry; c.rotation.x = .25; LAS.add(c); });
    const bc = G.beacon.clone(true); bc.visible = true; bc.position.set(0, 8.95, -11); bc.rotation.x = Math.PI; LAS.add(bc);
    const bm = new T.MeshBasicMaterial({ color: '#ff2a3c', transparent: true, opacity: .16, depthWrite: false, blending: T.AdditiveBlending, fog: false, side: T.DoubleSide });
    const bcone = new T.Mesh(new T.CylinderGeometry(.1, 4.5, 9, 18, 1, true, 0, 1.0), bm); bcone.position.set(0, 4.4, -11); bcone.rotation.z = 0; LAS.add(bcone); SPIN.push(bcone);
    LAS.visible = false; SITES.gallery.add(LAS);
    const tmp = V3(0, 0, 0), up = V3(0, 1, 0);
    TICK.push(t => { if (!LAS.visible) return; BEAMS.forEach(B => { const b = tmp.copy(B.b0); b.x += Math.sin(t * B.sp + B.ph) * B.amp * (B.kind === 'side' ? .0 : 1); b.y += (B.kind === 'side' ? Math.sin(t * B.sp + B.ph) * B.amp : Math.cos(t * B.sp * .8 + B.ph) * B.amp * .6); if (B.kind === 'floor') b.z += Math.cos(t * B.sp + B.ph) * B.amp;
        const d = b.clone().sub(B.a), L = d.length(); d.normalize(); const mid = B.a.clone().add(b).multiplyScalar(.5);
        [B.core, B.glow, B.glow2].forEach(m => { m.position.copy(mid); m.quaternion.setFromUnitVectors(up, d); m.scale.set(1, L, 1); });
        B.dot.position.copy(b); B.dot.position.z += B.kind === 'wall' ? .06 : 0; B.dot.position.y += B.kind === 'floor' ? .03 : 0; B.dot.visible = B.kind !== 'side'; B.em.lookAt(b); });
      SPIN.forEach(m => { m.rotation.y = t * 2.4; }); });
    // charco de luz de los focos sobre la obra y el suelo (decales aditivos suaves) y luz puntual para el modo láser
    const pl2 = new T.PointLight('#ffe9b8', 0, 14, 1.6); pl2.position.set(LAY.banana.x - .6, LAY.banana.y + .6, LAY.banana.z + 3.2); SITES.gallery.add(pl2); POOLL = pl2;
    const pm = new T.MeshBasicMaterial({ map: radTex('rgba(255,244,205,A)', .9), transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, opacity: .5 }); POOLM = pm;
    const pw = new T.Mesh(new T.PlaneGeometry(9, 9), pm); pw.position.set(LAY.banana.x, LAY.banana.y + .2, LAY.banana.z + .06); pw.renderOrder = 2; SITES.gallery.add(pw);
    const pf = new T.Mesh(new T.PlaneGeometry(10, 10).rotateX(-Math.PI / 2), pm); pf.position.set(LAY.banana.x, .03, LAY.banana.z + 5); pf.renderOrder = 2; SITES.gallery.add(pf);
  }
  function site(n) { Object.keys(SITES).forEach(k => SITES[k].visible = k === n); sky.visible = n === 'stand'; }
  const ripe = v => { uRipe.value = v; };
  const lasers = on => { LAS.visible = !!on; if (POOLL) POOLL.intensity = on ? 14 : 0; };
  const poolOn = v => { if (POOLM) POOLM.opacity = v; };

  // ---------- ambientes ----------
  const MOODS = {
    galeria: { sun: '#fff8ec', sunI: 1.8, dir: [-.2, .55, .85], hemi: '#ffffff', ground: '#fff0d8', hemiI: 2.1, fog: '#f2efe8', fogD: .0012, top: '#cfe0f0', mid: '#e8ecf0', hor: '#f4f1ea', cloud: 2, bloom: .12 },
    laser: { sun: '#b8c0ff', sunI: .6, dir: [-.2, .55, .85], hemi: '#7a6ab8', ground: '#402030', hemiI: 1.15, fog: '#2a1430', fogD: .0065, top: '#101028', mid: '#181838', hor: '#241a40', cloud: 2, bloom: .32 },
    subasta: { sun: '#ffe3b0', sunI: 1.3, dir: [-.2, .55, .85], hemi: '#fff0d8', ground: '#a06048', hemiI: 1.7, fog: '#8a4a48', fogD: .0016, top: '#5a1c2c', mid: '#7a2a3a', hor: '#8a3a40', cloud: 2, bloom: .2 },
    rueda: { sun: '#b0b8ff', sunI: .9, dir: [-.2, .55, .85], hemi: '#c8c8ff', ground: '#40306a', hemiI: 1.45, fog: '#2a2358', fogD: .0018, top: '#1a1450', mid: '#2a1f6b', hor: '#3a2a80', cloud: 2, bloom: .28 },
    calle: { sun: '#fff1c9', sunI: 2.3, dir: [-.5, .6, .62], hemi: '#ffffff', ground: '#cfc8d8', hemiI: 1.75, fog: '#e9efff', fogD: .0016, top: '#3f93f2', mid: '#7fc4ff', hor: '#ffeccc', cloud: .52, bloom: .14 },
  };
  let MOOD = 'galeria';
  function setMood(m) { if (!MOODS[m]) m = 'galeria'; MOOD = m; const Mo = MOODS[m]; sun.color.set(Mo.sun); sun.intensity = Mo.sunI; SUN.set(...Mo.dir).normalize(); hemi.color.set(Mo.hemi); hemi.groundColor.set(Mo.ground); hemi.intensity = Mo.hemiI;
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
  return { T, scene, camera, R, comp, setCam, proj, render, setTime, setMood, site, ground, SUN, G, SITES, READY_W, sky, dof, bloom, inkify, toon, place, TICK, ripe, lasers, poolOn, get wallP() { return wall; }, get tapeP() { return tapeG; }, get mood() { return MOOD; }, AX: AXo, SX: SXo, NX: NXo };
})();

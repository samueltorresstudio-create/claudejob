// Archivo Raro · mundo 3D de DIBUJO ANIMADO para «El país que no existía» (75).
// Decorados modelados en Blender (poyais.glb → glb_poyais.js) con sombreado de tebeo (MeshToon), contorno negro, cielo de nubes duras y agua de rayas blancas.
// Cinco sitios, uno por zona del mundo: city (0), london (1000), port (2000), beach (3000), paris (4000). site(nombre) enseña uno y esconde los demás.
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
  const uTime = { value: 0 }, MATS = {}, SIGN = {};
  const swayMat = m => { m.onBeforeCompile = sh => { sh.uniforms.uTime = uTime; sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
    float sw = smoothstep(2.5, 9., position.y); vec3 ip = vec3(0.);
    #ifdef USE_INSTANCING
      ip = instanceMatrix[3].xyz;
    #endif
    transformed.x += sin(uTime*1.7 + position.z*.5 + ip.x*.31 + ip.z*.17) * .32 * sw; transformed.z += cos(uTime*1.3 + position.x*.4 + ip.z*.23) * .22 * sw;`); }; };
  function toon(m) { if (MATS[m.name]) return MATS[m.name]; const o = new T.MeshToonMaterial({ color: m.color.clone(), gradientMap: toonG, vertexColors: !!m.vertexColors }); o.name = m.name;
    if (/^leaf/.test(m.name)) swayMat(o); if (m.name === 'painting' || /^sign_/.test(m.name)) { o.color.set('#ffffff'); SIGN[m.name] = o; } return (MATS[m.name] = o); }
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

  // ---------- carteles y cuadro pintados en canvas ----------
  const cv = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; };
  const board = (txt, bg, fg, ed, fs = 150, sub = null) => cv(1024, 512, (g, w, h) => { g.fillStyle = ed; g.fillRect(0, 0, w, h); g.fillStyle = bg; g.fillRect(26, 26, w - 52, h - 52); g.strokeStyle = fg; g.lineWidth = 8; g.strokeRect(50, 50, w - 100, h - 100);
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${fs}px Inter`; const L = txt.split('\n'); L.forEach((s, i) => g.fillText(s, w / 2, h / 2 + (i - (L.length - 1) / 2) * fs * 1.05)); });
  function paintSigns() {
    const S = {
      sign_opera: board('ÓPERA', '#7a1f3a', '#ffd34a', '#ffd34a', 170), sign_cat: board('CATEDRAL', '#2c3f86', '#ffd34a', '#ffd34a', 128), sign_pal: board('PALACIO', '#b82e32', '#ffd34a', '#ffd34a', 150),
      sign_poyais: board('OFICINA DE POYAIS', '#2c3f86', '#ffd34a', '#ffd34a', 92), sign_bonos: board('BONOS DE\nPOYAIS', '#fbf0d2', '#c8342c', '#c8342c', 120), sign_agot: board('BONOS\nAGOTADOS', '#c8342c', '#ffffff', '#ffffff', 128),
      sign_cafe: board('CAFÉ', '#c8342c', '#ffffff', '#ffffff', 200),
      sign_post: cv(1024, 512, (g, w, h) => { g.fillStyle = '#7d5230'; g.fillRect(0, 0, w, h); g.fillStyle = '#d4a96c'; g.fillRect(22, 22, w - 44, h - 44); g.fillStyle = '#3b2a1e'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 150px Inter'; g.fillText('POYAIS', 400, 270);
        g.beginPath(); g.moveTo(790, 150); g.lineTo(960, 256); g.lineTo(790, 362); g.lineTo(790, 300); g.lineTo(700, 300); g.lineTo(700, 212); g.lineTo(790, 212); g.closePath(); g.fill(); }),
      painting: cv(1024, 768, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#5aa8ff'); gr.addColorStop(.55, '#bfe8ff'); gr.addColorStop(1, '#ffe9b0'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = '#ffd34a'; g.beginPath(); g.arc(840, 170, 70, 0, 7); g.fill(); g.fillStyle = '#41c261'; g.fillRect(0, 560, w, 208); const bl = [[90, 330, 150, 240, '#f28fa8'], [250, 270, 170, 300, '#fbf0d2'], [440, 190, 150, 380, '#fbf0d2'], [620, 330, 170, 240, '#ffd96a'], [800, 360, 150, 210, '#8ec5ff']];
        bl.forEach(([x, y, bw, bh, c]) => { g.fillStyle = c; g.fillRect(x, y + 20, bw, bh); g.strokeStyle = '#241c2c'; g.lineWidth = 6; g.strokeRect(x, y + 20, bw, bh); g.fillStyle = '#4f8fe8'; g.beginPath(); g.arc(x + bw / 2, y + 20, bw / 2.6, Math.PI, 0); g.fill(); g.stroke(); });
        g.strokeStyle = '#7d5230'; g.lineWidth = 14; g.beginPath(); g.moveTo(80, 700); g.quadraticCurveTo(110, 600, 90, 520); g.stroke(); g.fillStyle = '#2ea35a'; for (let a = 0; a < 6; a++) { g.beginPath(); g.ellipse(90 + Math.cos(a) * 44, 510 + Math.sin(a) * 18, 46, 12, a * .5, 0, 7); g.fill(); }
        g.strokeStyle = '#241c2c'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); }),
    };
    for (const k in S) if (SIGN[k]) { SIGN[k].map = S[k]; SIGN[k].needsUpdate = true; }
  }

  // ---------- agua de dibujo animado ----------
  const WU = { t: { value: 0 }, deep: { value: new T.Color('#2f9be0') }, shallow: { value: new T.Color('#5fe0d4') }, foam: { value: new T.Color('#ffffff') }, fogC: { value: new T.Color('#fde7c4') }, fogD: { value: .0016 }, shoreZ: { value: 25.1 }, shoreOn: { value: 0 }, amp: { value: 1 } };
  const water = new T.Mesh(new T.PlaneGeometry(1400, 1400, 180, 180).rotateX(-Math.PI / 2), new T.ShaderMaterial({ uniforms: WU,
    vertexShader: `uniform float t, amp; varying vec3 wp; varying float vD; void main(){ vec3 p=position; vec3 w0=(modelMatrix*vec4(p,1.)).xyz; p.y+=(sin(w0.x*.18+t*1.1)*.22+sin(w0.z*.23-t*.9)*.18)*amp; vec4 wv=modelMatrix*vec4(p,1.); wp=wv.xyz; vec4 mv=viewMatrix*wv; vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 deep, shallow, foam, fogC; uniform float t, fogD, shoreZ, shoreOn; varying vec3 wp; varying float vD;
      void main(){ vec2 p=wp.xz; float v=sin(p.x*.55+t*1.3+sin(p.y*.31+t*.7)*1.7)+sin(p.y*.8-t*1.+sin(p.x*.4)*1.2); float line=smoothstep(1.55,1.62,v);
        float k=shoreOn>.5?smoothstep(shoreZ+30.,shoreZ-4.,p.y):0.; vec3 c=mix(deep,shallow,k); c+=vec3(.05)*smoothstep(.2,1.3,v); c=mix(c,foam,line*.8);
        if(shoreOn>.5){ float e=abs(p.y-(shoreZ+.9+.7*sin(t*1.1+p.x*.15))); c=mix(c,foam,smoothstep(.55,.4,e)); float e2=abs(p.y-(shoreZ+3.2+.9*sin(t*.9+p.x*.12+1.))); c=mix(c,foam,smoothstep(.22,.1,e2)*.9); }
        c=mix(c,fogC,1.-exp(-fogD*fogD*vD*vD)); gl_FragColor=vec4(c,1.);
#include <colorspace_fragment>
      }` }));
  water.frustumCulled = false; water.renderOrder = 1; scene.add(water);
  const waterY = (x, z, t = 0) => (Math.sin(x * .18 + t * 1.1) * .22 + Math.sin(z * .23 - t * .9) * .18) * WU.amp.value;

  // ---------- sitios, carga del GLB y plantas ----------
  const G = {}, BLD = {}, SITES = {}, SHIPS = [], POOL = { bonds: [], bags: [], stacks: [] }, GROUND = {}; ['city', 'london', 'port', 'beach', 'paris'].forEach(n => { SITES[n] = new T.Group(); SITES[n].visible = false; scene.add(SITES[n]); });
  const LXo = LAY.sites.london[0], PXo = LAY.sites.port[0], BXo = LAY.sites.beach[0], PRo = LAY.sites.paris[0];
  const READY_W = new Promise((resolve, reject) => {
    const b64 = window.GLB_POYAIS, bin = atob(b64), buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    Promise.resolve(document.fonts && document.fonts.load ? document.fonts.load('900 100px Inter') : 0).then(() => new GLTFLoader().parse(buf.buffer, '', gl => {
      gl.scene.children.slice().forEach(o => { G[o.name] = o; });
      Object.values(G).forEach(o => meshesOf(o).forEach(me => { const ms = Array.isArray(me.material) ? me.material.map(toon) : toon(me.material); me.material = ms; me.castShadow = true; me.receiveShadow = true; }));
      Object.values(G).forEach(o => meshesOf(o).forEach(me => { const nm = (Array.isArray(me.material) ? me.material[0] : me.material).name; if (/^sign_|^painting$/.test(nm) && !me.geometry.attributes.uv) planarUV(me.geometry); }));
      paintSigns(); build(); resolve(); }, e => reject(e)));
  });
  function planarUV(geo) {   // los carteles salen de Blender sin UV: proyección plana sobre el eje más fino
    const p = geo.attributes.position; geo.computeBoundingBox(); const bb = geo.boundingBox, sz = bb.getSize(new T.Vector3()), ax = sz.z <= sz.x && sz.z <= sz.y ? ['x', 'y'] : (sz.x <= sz.y ? ['z', 'y'] : ['x', 'z']), uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) { uv[i * 2] = (p['get' + ax[0].toUpperCase()](i) - bb.min[ax[0]]) / Math.max(1e-6, sz[ax[0]]); uv[i * 2 + 1] = (p['get' + ax[1].toUpperCase()](i) - bb.min[ax[1]]) / Math.max(1e-6, sz[ax[1]]); }
    geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); }
  const place = (o, site, x, y, z, ry = 0, s = 1, ink = true) => { const c = o.clone(true); c.position.set(x, y, z); c.rotation.y = ry; c.scale.setScalar(s); SITES[site].add(c); return c; };
  function inst(src, list, site) {      // plantas en masa: una malla instanciada por material, con su contorno
    const M4 = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), sc = new T.Vector3(), p = new T.Vector3();
    meshesOf(src).forEach(me => { const im = new T.InstancedMesh(me.geometry, me.material, list.length), ih = new T.InstancedMesh(hullOf(me.geometry), inkM, list.length);
      list.forEach(([, x, z, ry, s], i) => { p.set(x, groundAt(site, x, z), z); e.set(0, ry, 0); q.setFromEuler(e); sc.setScalar(s); M4.compose(p, q, sc); im.setMatrixAt(i, M4); ih.setMatrixAt(i, M4); });
      im.castShadow = true; im.receiveShadow = true; ih.castShadow = false; ih.frustumCulled = false; im.frustumCulled = false; SITES[site].add(im, ih); }); }
  const ray = new T.Raycaster();
  function groundAt(site, x, z) { const L = GROUND[site]; if (!L) return 0; ray.set(new T.Vector3(x, 300, z), new T.Vector3(0, -1, 0)); ray.far = 700; const h = ray.intersectObjects(L, false); return h.length ? h[0].point.y : 0; }
  function build() {
    ['city', 'plaza', 'backstage', 'b_palace', 'b_parl', 'b_cat', 'b_opera', 'b_h1', 'b_h2', 'b_h3', 'b_h4'].forEach(n => { inkify(G[n]); SITES.city.add(G[n]); }); ['b_palace', 'b_parl', 'b_cat', 'b_opera', 'b_h1', 'b_h2', 'b_h3', 'b_h4'].forEach(n => { BLD[n.slice(2)] = G[n]; G[n].userData.home = G[n].position.clone(); }); GROUND.city = meshesOf(G.plaza);
    ['london', 'london_ground'].forEach(n => { if (n !== 'london_ground') inkify(G[n]); SITES.london.add(G[n]); }); GROUND.london = meshesOf(G.london_ground);
    ['pier', 'quay'].forEach(n => { inkify(G[n]); SITES.port.add(G[n]); }); GROUND.port = meshesOf(G.pier).filter(m => m.name.length >= 0);
    inkify(G.beach); SITES.beach.add(G.beach); GROUND.beach = meshesOf(G.beach); G.beach.traverse(o => { if (o.isMesh) o.castShadow = false; });
    inkify(G.paris); SITES.paris.add(G.paris); SITES.paris.add(G.paris_ground); GROUND.paris = meshesOf(G.paris_ground);
    ['podium', 'easel', 'bondsign', 'agotado', 'bond', 'bondstack', 'moneybag', 'signpost', 'palm', 'bigtree', 'fern', 'bush', 'ship', 'ship2'].forEach(n => { inkify(G[n]); G[n].visible = false; });
    // sitio ciudad: palmeras de tebeo alrededor y delante
    const byk = (list, k) => list.filter(a => a[0] === k);
    ['palm', 'bigtree', 'fern', 'bush'].forEach(k => inst(G[k], byk(LAY.cityp, k), 'city'));
    ['palm', 'bigtree', 'fern', 'bush'].forEach(k => inst(G[k], byk(LAY.jungle, k), 'beach')); ['palm', 'fern', 'bush'].forEach(k => inst(G[k], byk(LAY.beachp, k), 'beach'));
    [[-17, 20, .4], [-8, 23, -.6], [10, 22, .3], [19, 20, 1.1], [-30, 17, .9], [30, 16, -.8], [-1, 30, .2]].forEach(([x, z, ry], i) => { const c = place(G.palm, 'city', x, 0, z, ry, 1.15 + (i % 3) * .1); c.visible = true; });
    // sitio Londres: atrezo
    const pd = place(G.podium, 'london', LXo, 0, 2); pd.visible = true; const ea = place(G.easel, 'london', LXo - 5.4, 0, 3.6, .5); ea.visible = true; const bs = place(G.bondsign, 'london', LXo + 6.4, 0, -2.5, -.35); bs.visible = true;
    const ag = place(G.agotado, 'london', LXo + 0, 0, -22); ag.visible = false; G.agotadoOn = ag; G.podiumOn = pd; G.easelOn = ea; G.bondsignOn = bs;
    // maletas abandonadas en la playa (para «la mayoría no volvió»)
    { const mk = (c) => toon({ name: 'case_' + c, color: new T.Color(c) }); const CASES = new T.Group(); [[-1.4, 15.2, .3, '#8a5a2e'], [.4, 15.8, -.5, '#5a7aa8'], [1.8, 15.1, .9, '#a83a2a']].forEach(([x, z, r, c]) => {
        const g = new T.Group(), b = new T.Mesh(new T.BoxGeometry(.85, .55, .3), mk(c)), hd = new T.Mesh(new T.TorusGeometry(.13, .035, 6, 12, Math.PI), mk('#3a2a1e')); hd.position.y = .27; b.position.y = 0; g.add(b, hd);
        g.position.set(BXo + x, groundAt('beach', BXo + x, z) + .26, z); g.rotation.set(-.18, r, .12 * Math.sign(r)); b.castShadow = true; CASES.add(g); inkify(g); });
      CASES.visible = false; SITES.beach.add(CASES); G.cases = CASES; }
    // sitio puerto: barcos amarrados al muelle (la proa a +z), pasarela
    [['ship', PXo + 10.4, 6, 'red'], ['ship2', PXo - 100, -60, 'blue']].forEach(([n, x, z]) => { const s = place(G[n], 'port', x, 0, z, -Math.PI / 2); s.visible = true; SHIPS.push(s); });
    { const g = new T.Mesh(new T.BoxGeometry(4.2, .22, 2.2), toon({ name: 'woodplank', color: new T.Color('#b9824e') })); g.position.set(PXo + 7.5, 2.5, 6); g.rotation.z = .27; g.castShadow = true; SITES.port.add(g); inkify(g); }
    // sitio playa: cartel torcido
    { const sp = place(G.signpost, 'beach', BXo + 5, groundAt('beach', BXo + 5, 9), 9, -.5); sp.visible = true; G.signpostOn = sp; }
    // reserva de bonos y bolsas (las escenas las colocan)
    for (let i = 0; i < 40; i++) { const b = G.bond.clone(true); b.visible = false; scene.add(b); POOL.bonds.push(b); }
    for (let i = 0; i < 10; i++) { const b = G.moneybag.clone(true); b.visible = false; scene.add(b); POOL.bags.push(b); }
    for (let i = 0; i < 6; i++) { const b = G.bondstack.clone(true); b.visible = false; scene.add(b); POOL.stacks.push(b); }
  }
  function site(n) { Object.keys(SITES).forEach(k => SITES[k].visible = k === n); water.visible = n === 'port' || n === 'beach';
    if (n === 'port') { water.position.set(PXo, 0, 0); WU.shoreOn.value = 0; WU.deep.value.set('#2f9be0'); WU.shallow.value.set('#5fe0d4'); WU.amp.value = 1.2; }
    if (n === 'beach') { water.position.set(BXo, 0, 0); WU.shoreOn.value = 1; WU.shoreZ.value = 25.1; WU.deep.value.set('#23a2e8'); WU.shallow.value.set('#5ff0d0'); WU.amp.value = .8; }
    if (G.agotadoOn) G.agotadoOn.visible = false; }

  // ---------- ambientes ----------
  const MOODS = {
    poyais: { sun: '#fff1c9', sunI: 2.4, dir: [-.5, .55, .65], hemi: '#ffffff', ground: '#ffd9a0', hemiI: 1.7, fog: '#fde7c4', fogD: .0016, top: '#3f93f2', mid: '#7fc4ff', hor: '#ffeccc', cloud: .52, bloom: .14 },
    londres: { sun: '#fff5e0', sunI: 2.2, dir: [-.45, .6, .65], hemi: '#eef3ff', ground: '#d3c2b0', hemiI: 1.75, fog: '#e5eaf2', fogD: .0032, top: '#6ea3dc', mid: '#b3d0ea', hor: '#f1f1f2', cloud: .42, bloom: .1 },
    puerto: { sun: '#fff3d0', sunI: 2.5, dir: [-.6, .5, .6], hemi: '#ffffff', ground: '#cfe6ff', hemiI: 1.7, fog: '#d6efff', fogD: .0016, top: '#2f86ee', mid: '#7cc2ff', hor: '#e6f6ff', cloud: .5, bloom: .12 },
    selva: { sun: '#fff0b8', sunI: 2.3, dir: [-.4, .6, .7], hemi: '#f2ffe0', ground: '#78b45e', hemiI: 1.7, fog: '#cdebc0', fogD: .0034, top: '#58b6e8', mid: '#a9dcc8', hor: '#e8f3c8', cloud: .6, bloom: .16 },
    paris: { sun: '#ffd9b0', sunI: 2.3, dir: [-.6, .35, .7], hemi: '#fff0f0', ground: '#d8a9a0', hemiI: 1.7, fog: '#f5d8cc', fogD: .0028, top: '#7aa8e8', mid: '#f1c1b6', hor: '#ffe3c8', cloud: .46, bloom: .14 },
    tarde: { sun: '#ff9a50', sunI: 2.5, dir: [-.75, .22, .62], hemi: '#ffe0c8', ground: '#c88a78', hemiI: 1.55, fog: '#f0b890', fogD: .002, top: '#4a4a9e', mid: '#f08a6a', hor: '#ffd08a', cloud: .5, bloom: .2 },
  };
  let MOOD = 'poyais';
  function setMood(m) { if (!MOODS[m]) m = 'poyais'; MOOD = m; const M = MOODS[m]; sun.color.set(M.sun); sun.intensity = M.sunI; SUN.set(...M.dir).normalize(); hemi.color.set(M.hemi); hemi.groundColor.set(M.ground); hemi.intensity = M.hemiI;
    scene.fog.color.set(M.fog); scene.fog.density = M.fogD; skyU.top.value.set(M.top); skyU.mid.value.set(M.mid); skyU.hor.value.set(M.hor); skyU.cloud.value = M.cloud; WU.fogC.value.set(M.fog); WU.fogD.value = M.fogD; bloom.strength = M.bloom; }
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
  function setTime(t) { skyU.time.value = t; WU.t.value = t; uTime.value = t; TICK.forEach(f => f(t)); }
  const ground = (x, z, siteName) => groundAt(siteName || Object.keys(SITES).find(k => SITES[k].visible) || 'city', x, z);
  return { BLD, T, scene, camera, R, comp, setCam, proj, render, setTime, setMood, site, ground, waterY, SUN, G, SITES, SHIPS, POOL, READY_W, sky, WU, water, dof, bloom, inkify, toon, place, TICK, get mood() { return MOOD; }, LX: LXo, PX: PXo, BX: BXo, PR: PRo };
})();

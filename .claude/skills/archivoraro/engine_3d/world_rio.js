// World «río Magdalena» (Colombia): río ancho al atardecer con agua animada estilizada, orillas de barro y hierba, selva, palmeras,
// ceibas, palafitos de colores, muelle, canoas, jacintos de agua y montañas con bruma. Same API as world3d.js (W2), so stickAt() works.
window.GLC = document.getElementById("gl");
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false);
  R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.2; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, W / H, .05, 2000);
  const rnd = (() => { let s = 4242; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const tex = (w, h, draw, rep, srgb = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new T.CanvasTexture(c); if (srgb) t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const noise = (g, w, h, n, cols, sz = [1, 3]) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const s = sz[0] + rnd() * (sz[1] - sz[0]); g.fillRect(rnd() * w, rnd() * h, s, s); } };
  const STD = o => new T.MeshStandardMaterial(Object.assign({ roughness: .85, metalness: 0 }, o));
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.s) m.scale.set(...o.s); m.castShadow = o.cast !== false; m.receiveShadow = true; (o.parent || scene).add(m); return m; };
  // ---------- river course (meanders along z; water between rx(z) ± RW) ----------
  const RW = 26, mid = z => 6 * Math.sin(z * .012) + 4 * Math.sin(z * .031 + 1);
  // ---------- sky: golden hour ----------
  const SUN = new T.Vector3(-.62, .2, -.76).normalize();
  const sky = new T.Mesh(new T.SphereGeometry(1500, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: SUN } },
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 sun; varying vec3 vd; void main(){ float h=vd.y; vec3 top=vec3(.18,.42,.8), mid=vec3(.55,.66,.86), hor=vec3(1.,.72,.48); vec3 c=h>.12?mix(mid,top,smoothstep(.12,.7,h)):mix(hor,mid,smoothstep(-.04,.12,h)); float s=max(dot(vd,sun),0.); c+=vec3(1.,.62,.3)*(pow(s,6.)*.45+pow(s,60.)*.5)+vec3(1.,.9,.7)*pow(s,900.)*4.; gl_FragColor=vec4(c,1.); }' }));
  sky.frustumCulled = false; scene.add(sky);
  scene.fog = new T.FogExp2('#f2cfa8', .0016);
  const hemi = new T.HemisphereLight('#bfd6ff', '#7a6a48', 1.35); scene.add(hemi);
  const sun = new T.DirectionalLight('#ffc98a', 4.6); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  const sc = sun.shadow.camera; sc.left = -40; sc.right = 40; sc.top = 40; sc.bottom = -40; sc.near = 1; sc.far = 300; sun.shadow.bias = -.0004; sun.shadow.normalBias = .05; scene.add(sun, sun.target);
  // ---------- clouds (warm, lit from below) ----------
  const cloudM = STD({ color: '#ffffff', roughness: 1, emissive: '#ffd2b0', emissiveIntensity: .25, fog: false });
  for (let i = 0; i < 18; i++) { const g = new T.Group(), a = -2.7 + i * .32, r = 420 + (i % 3) * 120; g.position.set(Math.cos(a) * r, 110 + (i % 4) * 30, Math.sin(a) * r); scene.add(g);
    for (let k = 0; k < 7; k++) { const m = add(new T.SphereGeometry(16 + (k % 3) * 9, 18, 12), cloudM, (k - 3) * 18, (k % 2) * 8, (k % 3) * 6, { parent: g, cast: false }); m.scale.y = .62; m.userData.noInk = true; } }
  // ---------- distant mountains (hazy, layered) ----------
  [[-950, '#a59ac0', 170, .0], [-760, '#7f9a8c', 130, .0], [-580, '#5f8a5c', 90, .0]].forEach(([z, col, hh]) => { const mm = new T.MeshStandardMaterial({ color: col, roughness: 1, fog: false }); for (let i = 0; i < 10; i++) { const m = add(new T.SphereGeometry(1, 20, 12), mm, -900 + i * 190 + rnd() * 80, -10, z - rnd() * 60, { cast: false, s: [150 + rnd() * 90, hh + rnd() * 70, 90] }); m.userData.noInk = true; } });
  // ---------- terrain: banks rising from the water, mud → grass ----------
  const tw = 900, td = 1200, nx = 240, nz = 320, tg = new T.PlaneGeometry(tw, td, nx, nz); tg.rotateX(-Math.PI / 2);
  const pos = tg.attributes.position, cols = [];
  const hgt = (x, z) => { const dd = Math.abs(x - mid(z)) - RW; let h = dd < 0 ? -2.2 + dd * .02 : Math.min(5, dd * .42) * (1 - Math.exp(-dd * .15));
    h += (Math.sin(x * .09 + z * .05) + Math.sin(x * .023 - z * .07)) * .45 * Math.min(1, Math.max(0, dd) / 8); return h; };
  const cMud = new T.Color('#8a6a45'), cMudW = new T.Color('#5e4a33'), cGr = new T.Color('#5d9a3c'), cGr2 = new T.Color('#3f7d33'), cSand = new T.Color('#c7a777');
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i), h = hgt(x, z); pos.setY(i, h);
    const c = h < -.3 ? cMudW.clone() : h < .25 ? cMud.clone().lerp(cSand, .35) : h < 1.1 ? cMud.clone().lerp(cGr, (h - .25) / .85) : cGr.clone().lerp(cGr2, .5 + .5 * Math.sin(x * .2 + z * .13));
    c.offsetHSL(0, 0, (rnd() - .5) * .04); cols.push(c.r, c.g, c.b); }
  tg.setAttribute('color', new T.Float32BufferAttribute(cols, 3)); tg.computeVertexNormals();
  const terrain = add(tg, STD({ vertexColors: true, roughness: .95 }), 0, 0, 0, { cast: false }); terrain.userData.noInk = true;
  // ---------- water: stylised river shader (fresnel, sun glitter, painted ripple strokes, shore foam) ----------
  const water = new T.Mesh(new T.PlaneGeometry(tw, td, 1, 1).rotateX(-Math.PI / 2), new T.ShaderMaterial({ transparent: false,
    uniforms: { time: { value: 0 }, sun: { value: SUN }, camPos: { value: new T.Vector3() }, fogCol: { value: new T.Color('#f2cfa8') }, fogD: { value: .0016 } },
    vertexShader: 'varying vec3 wp; void main(){ vec4 w=modelMatrix*vec4(position,1.); wp=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader: `uniform float time,fogD; uniform vec3 sun,camPos,fogCol; varying vec3 wp;
      float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float n(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y); }
      float mid(float z){ return 6.*sin(z*.012)+4.*sin(z*.031+1.); }
      void main(){ vec3 V=normalize(camPos-wp); float fr=pow(1.-max(V.y,0.),3.);
        vec2 q=wp.xz*vec2(.35,.12)+vec2(0.,-time*.35); float r=n(q)+.5*n(q*2.3+3.);
        vec3 deep=vec3(.06,.24,.27), shal=vec3(.2,.42,.38), skyc=vec3(.9,.58,.4);
        vec3 c=mix(deep,shal,.25+.45*r); c=mix(c,skyc,fr*.3);
        float strk=smoothstep(.93,.95,n(wp.xz*vec2(2.6,.3)+vec2(0.,-time*.5)))*(1.-fr*.7); c=mix(c,vec3(.85,.93,.9),strk*.45);
        vec3 R=reflect(-V,vec3(0,1,0)); float g=pow(max(dot(R,sun),0.),90.)*(.5+.8*n(wp.xz*1.5+time)); c+=vec3(1.,.8,.5)*g*.9;
        float sh=abs(wp.x-mid(wp.z))-${RW}.0; float foam=smoothstep(-2.4,-.6,sh)*(.55+.45*sin(wp.z*.8+time*2.+n(wp.xz)*6.)); c=mix(c,vec3(.95,.93,.86),clamp(foam,0.,1.)*.55);
        float d=length(camPos-wp); float f=1.-exp(-fogD*fogD*d*d); c=mix(c,fogCol,f); gl_FragColor=vec4(c,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` }));
  water.position.y = -.02; water.receiveShadow = false; water.userData.noInk = true; scene.add(water);
  // ---------- vegetation ----------
  const leafCols = ['#3f8a3a', '#4f9c3f', '#2f7434', '#5aa845'];
  const roundTree = (x, z, s) => { const g = new T.Group(); g.position.set(x, hgt(x, z) - .1, z); g.scale.setScalar(s); scene.add(g); add(new T.CylinderGeometry(.22, .34, 3.4, 9), STD({ color: '#6b4a2c' }), 0, 1.7, 0, { parent: g });
    for (let k = 0; k < 6; k++) { const r = 1.1 + rnd() * .9; add(new T.IcosahedronGeometry(r, 2), STD({ color: leafCols[(k + (x | 0)) & 3], roughness: .95 }), (rnd() - .5) * 2.6, 3.6 + rnd() * 1.8, (rnd() - .5) * 2.6, { parent: g }); } return g; };
  const frondG = (() => { const sh = new T.Shape(); sh.moveTo(0, 0); sh.quadraticCurveTo(.5, .35, 2.6, .05); sh.quadraticCurveTo(.5, -.05, 0, 0); const g = new T.ShapeGeometry(sh, 10); return g; })();
  const frondM = STD({ color: '#4c9a3a', side: T.DoubleSide, roughness: .9 });
  const palm = (x, z, s) => { const g = new T.Group(); g.position.set(x, hgt(x, z) - .1, z); g.scale.setScalar(s); g.rotation.y = rnd() * 6; scene.add(g); const lean = (rnd() - .5) * .5;
    let px = 0, py = 0; for (let k = 0; k < 8; k++) { const seg = add(new T.CylinderGeometry(.16 - k * .008, .19 - k * .008, .82, 8), STD({ color: k % 2 ? '#8a6a48' : '#7a5c3c' }), px, py + .41, 0, { parent: g }); seg.rotation.z = -lean * k / 8; px += Math.sin(lean * k / 8) * .8; py += .8; }
    for (let k = 0; k < 9; k++) { const f = new T.Mesh(frondG, frondM); f.position.set(px, py, 0); f.rotation.set(-.2 - rnd() * .5, k / 9 * Math.PI * 2, -.35 - rnd() * .3, 'YXZ'); f.castShadow = true; f.userData.noInk = true; g.add(f); }
    add(new T.SphereGeometry(.28, 10, 8), STD({ color: '#6b8a2c' }), px, py - .1, 0, { parent: g }); return g; };
  const ceiba = (x, z, s) => { const g = new T.Group(); g.position.set(x, hgt(x, z) - .2, z); g.scale.setScalar(s); scene.add(g); add(new T.CylinderGeometry(.6, 1.1, 7, 10), STD({ color: '#8f7a62' }), 0, 3.5, 0, { parent: g });
    for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2; const m = add(new T.SphereGeometry(2.4 + rnd(), 14, 10), STD({ color: leafCols[k & 3] }), Math.cos(a) * 3.6, 7.4 + rnd() * .8, Math.sin(a) * 3.6, { parent: g }); m.scale.y = .55; } return g; };
  const reeds = (x, z) => { const g = new T.Group(); g.position.set(x, hgt(x, z), z); scene.add(g); for (let k = 0; k < 7; k++) { const r = add(new T.ConeGeometry(.05, 1.2 + rnd() * .8, 5), STD({ color: '#7aa64a' }), (rnd() - .5) * .9, .6, (rnd() - .5) * .9, { parent: g }); r.rotation.z = (rnd() - .5) * .4; r.userData.noInk = true; } };
  for (let i = 0; i < 260; i++) { const side = i % 2 ? 1 : -1, z = -420 + rnd() * 600, dd = RW + 6 + rnd() * 70, x = mid(z) + side * dd; const t = rnd();
    if (t < .45) roundTree(x, z, .9 + rnd() * .7); else if (t < .85) palm(x, z, .9 + rnd() * .5); else ceiba(x, z, .8 + rnd() * .4); }
  for (let i = 0; i < 160; i++) { const side = i % 2 ? 1 : -1, z = -260 + rnd() * 420, x = mid(z) + side * (RW + .5 + rnd() * 5); reeds(x, z); }
  // water hyacinths (floating patches)
  const lilyM = STD({ color: '#3f9a46', roughness: .7 }), flM = STD({ color: '#b993e8', emissive: '#6a3fb0', emissiveIntensity: .2 });
  for (let i = 0; i < 70; i++) { const z = -160 + rnd() * 260, side = rnd() < .5 ? -1 : 1, x = mid(z) + side * (RW - 2 - rnd() * 6); const g = new T.Group(); g.position.set(x, .02, z); scene.add(g);
    for (let k = 0; k < 4; k++) { const m = add(new T.SphereGeometry(.35, 10, 6), lilyM, (rnd() - .5) * 1.4, 0, (rnd() - .5) * 1.4, { parent: g, cast: false }); m.scale.y = .25; m.userData.noInk = true; }
    if (rnd() < .5) { const f = add(new T.SphereGeometry(.12, 8, 6), flM, 0, .14, 0, { parent: g, cast: false }); f.userData.noInk = true; } }
  // ---------- palafitos (stilt houses), pier, canoes ----------
  const tin = tex(128, 128, (g, w, h) => { g.fillStyle = '#9aa0a6'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 16) { g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x, 0, 5, h); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + 9, 0, 4, h); } g.fillStyle = 'rgba(160,80,40,.35)'; for (let i = 0; i < 30; i++) g.fillRect(rnd() * w, rnd() * h, 8, 3); }, [2, 1]);
  const plank = (base) => tex(128, 128, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(0, y, w, 2); } noise(g, w, h, 600, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.08)']); }, [1, 2]);
  const house = (x, z, col, ry) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g); const base = Math.max(hgt(x, z), -1.6);
    for (const [px, pz] of [[-2.2, -1.6], [2.2, -1.6], [-2.2, 1.6], [2.2, 1.6], [0, 1.6], [0, -1.6]]) add(new T.CylinderGeometry(.12, .14, 3.4, 6), STD({ color: '#6a5034' }), px, base + 1.2, pz, { parent: g });
    add(new T.BoxGeometry(5, .2, 3.8), STD({ map: plank('#9a7a52') }), 0, 2.8, 0, { parent: g });
    add(new T.BoxGeometry(4.4, 2.4, 3.2), STD({ map: plank(col) }), 0, 4.1, 0, { parent: g });
    add(new T.BoxGeometry(.9, 1.6, .08), STD({ color: '#3a2a20' }), -.8, 3.7, 1.62, { parent: g }); add(new T.BoxGeometry(.9, .7, .08), STD({ color: '#2d4060', emissive: '#ffb050', emissiveIntensity: .25 }), 1.1, 4.3, 1.62, { parent: g });
    const roof = add(new T.ConeGeometry(3.9, 1.6, 4, 1), STD({ map: tin, metalness: .3, roughness: .5 }), 0, 6.1, 0, { parent: g, s: [1.25, 1, .95] }); roof.rotation.y = Math.PI / 4;
    add(new T.BoxGeometry(5, .08, .9), STD({ map: plank('#8a6a45') }), 0, 2.85, 2.4, { parent: g }); return g; };
  [[-36, -70, '#2bb5a6', .3], [-41, -52, '#f2c14a', -.2], [-38, -96, '#e8607a', .5], [37, -120, '#5aa0e8', -.4], [42, -150, '#f29a4a', .2], [-44, -140, '#a96fe0', .1]].forEach(([x, z, c, r]) => house(mid(z) + Math.sign(x) * (RW + 4 + Math.abs(x) - 36), z, c, r));
  // pier
  const pz0 = -40, px0 = mid(pz0) - RW - 2; for (let k = 0; k < 6; k++) add(new T.CylinderGeometry(.12, .12, 3, 6), STD({ color: '#5a4630' }), px0 + k * 2, -.3, pz0 + 1, {}), add(new T.CylinderGeometry(.12, .12, 3, 6), STD({ color: '#5a4630' }), px0 + k * 2, -.3, pz0 - 1, {});
  add(new T.BoxGeometry(12, .14, 2.4), STD({ map: plank('#9a7a52') }), px0 + 5, 1.1, pz0);
  // canoe factory (also used for the hero's canoe)
  const canoeG = (() => { const g = new T.SphereGeometry(1, 28, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); g.scale(.62, .42, 3.4); return g; })();
  const canoe = (x, z, ry, col = '#8a5a32') => { const g = new T.Group(); g.position.set(x, .12, z); g.rotation.y = ry; scene.add(g); add(canoeG, STD({ color: col, side: T.DoubleSide }), 0, 0, 0, { parent: g });
    const rim = add(new T.TorusGeometry(1, .05, 6, 40), STD({ color: '#5e3a20' }), 0, 0, 0, { parent: g, rx: Math.PI / 2 }); rim.scale.set(.62, 3.4, 1);
    add(new T.BoxGeometry(1.1, .06, .25), STD({ color: '#6a4426' }), 0, -.12, .9, { parent: g }); add(new T.BoxGeometry(1.1, .06, .25), STD({ color: '#6a4426' }), 0, -.12, -1.2, { parent: g }); return g; };
  [[pz0 + 3, -1, .2], [-110, 1, -.6], [-60, 1, .9]].forEach(([z, sd, r]) => canoe(mid(z) + sd * (RW - 4), z, r, ['#8a5a32', '#2f7a8a', '#c0563a'][Math.abs(z | 0) % 3]));
  const HERO = canoe(mid(-8) + 4, -8, .25, '#3f8fa0');
  // birds: simple 3D egrets on the bank
  const egret = (x, z) => { const g = new T.Group(); g.position.set(x, hgt(x, z), z); g.rotation.y = rnd() * 6; scene.add(g); const wm = STD({ color: '#f6f4ee' });
    add(new T.SphereGeometry(.22, 10, 8), wm, 0, .75, 0, { parent: g, s: [1, .8, 1.6] }); add(new T.CylinderGeometry(.04, .05, .5, 6), wm, 0, 1.05, .25, { parent: g, rx: -.4 }); add(new T.SphereGeometry(.09, 8, 6), wm, 0, 1.3, .38, { parent: g });
    add(new T.ConeGeometry(.03, .28, 6), STD({ color: '#f2c94c' }), 0, 1.3, .58, { parent: g, rx: Math.PI / 2 }); [-1, 1].forEach(sd => add(new T.CylinderGeometry(.015, .015, .6, 4), STD({ color: '#2a2a2a' }), sd * .07, .3, 0, { parent: g })); };
  for (let i = 0; i < 10; i++) { const z = -30 - rnd() * 120, sd = rnd() < .5 ? -1 : 1; egret(mid(z) + sd * (RW + 1 + rnd() * 3), z); }
  // ---------- post: bloom + depth of field ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .28, .5, .9); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .003, maxblur: .007 }); comp.addPass(dof); comp.addPass(new OutputPass());
  // ---------- ink outlines ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o === sky || o.userData.noInk || o.material.transparent) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'ShapeGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  // ---------- API ----------
  function setTime(t) { water.material.uniforms.time.value = t; }
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    water.material.uniforms.camPos.value.copy(pos); sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld();
    dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  return { T, scene, camera, R, setCam, setTime, proj, render, SUN, mid, hgt, RW, HERO, canoe, dof, bloom, comp, inkM };
})();

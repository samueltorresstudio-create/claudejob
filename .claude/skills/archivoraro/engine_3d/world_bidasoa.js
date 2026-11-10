// World «Isla de los Faisanes»: río Bidasoa (frontera España-Francia) con el islote en medio, monumento de piedra, árboles,
// orillas con muro de piedra, casas vascas (blancas con entramado rojo/verde y tejado rojo) en Irún (oeste, x<0) y Hendaya (este, x>0),
// puente, barcas, banderas y montes verdes con bruma. Same API as world3d.js (W2), so stickAt()/hippoAt() work.
window.GLC = document.getElementById("gl");
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.2; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, W / H, .05, 2000);
  const rnd = (() => { let s = 9191; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const tex = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const STD = o => new T.MeshStandardMaterial(Object.assign({ roughness: .85, metalness: 0 }, o));
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.s) m.scale.set(...o.s); m.castShadow = o.cast !== false; m.receiveShadow = true; (o.parent || scene).add(m); if (o.noInk) m.userData.noInk = true; return m; };
  // river along z, banks at x = ±RW; island centred at (IX, IZ)
  const RW = 58, IX = 0, IZ = -30, IRX = 13, IRZ = 52;
  const SUN = new T.Vector3(-.45, .55, -.7).normalize();
  const sky = new T.Mesh(new T.SphereGeometry(1500, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: SUN } },
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 sun; varying vec3 vd; void main(){ float h=vd.y; vec3 top=vec3(.2,.48,.86), mid=vec3(.56,.74,.94), hor=vec3(.9,.92,.9); vec3 c=h>.1?mix(mid,top,smoothstep(.1,.7,h)):mix(hor,mid,smoothstep(-.04,.1,h)); float s=max(dot(vd,sun),0.); c+=vec3(1.,.9,.7)*(pow(s,10.)*.25+pow(s,600.)*3.); gl_FragColor=vec4(c,1.); }' }));
  sky.frustumCulled = false; scene.add(sky);
  scene.fog = new T.FogExp2('#dfe8ec', .0022);
  const hemi = new T.HemisphereLight('#cfe2ff', '#6f7a52', 1.5); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff1d8', 4.2); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); const sc = sun.shadow.camera; sc.left = -45; sc.right = 45; sc.top = 45; sc.bottom = -45; sc.near = 1; sc.far = 300; sun.shadow.bias = -.0004; sun.shadow.normalBias = .05; scene.add(sun, sun.target);
  const cloudM = STD({ color: '#ffffff', roughness: 1, emissive: '#e8eef6', emissiveIntensity: .3, fog: false });
  for (let i = 0; i < 18; i++) { const g = new T.Group(), a = -2.9 + i * .34, r = 420 + (i % 3) * 120; g.position.set(Math.cos(a) * r, 120 + (i % 4) * 26, Math.sin(a) * r); scene.add(g);
    for (let k = 0; k < 7; k++) { const m = add(new T.SphereGeometry(16 + (k % 3) * 9, 18, 12), cloudM, (k - 3) * 18, (k % 2) * 8, (k % 3) * 6, { parent: g, cast: false, noInk: true }); m.scale.y = .6; } }
  // Pyrenees foothills (soft green, hazy)
  [[-900, '#8fa8b8', 220], [-720, '#6f9a7a', 170], [-560, '#5a8a5a', 120]].forEach(([z, col, hh]) => { const mm = new T.MeshStandardMaterial({ color: col, roughness: 1, fog: false }); for (let i = 0; i < 10; i++) add(new T.SphereGeometry(1, 20, 12), mm, -900 + i * 190 + rnd() * 80, -10, z - rnd() * 60, { cast: false, s: [150 + rnd() * 90, hh + rnd() * 70, 90], noInk: true }); });
  // terrain: banks with a stone quay, then grass rising gently
  const tw = 900, td = 1100, tg = new T.PlaneGeometry(tw, td, 240, 300); tg.rotateX(-Math.PI / 2);
  const hgt = (x, z) => { const dd = Math.abs(x) - RW; if (dd < 0) return -2.2; return 1.6 + Math.min(6, dd * .06) + (Math.sin(x * .07 + z * .05) + Math.sin(x * .02 - z * .06)) * .4 * Math.min(1, dd / 10); };
  const pos = tg.attributes.position, cols = [], cG = new T.Color('#6fa84a'), cG2 = new T.Color('#4f8f3c'), cMud = new T.Color('#6a5a44');
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i), h = hgt(x, z); pos.setY(i, h); const c = h < 0 ? cMud.clone() : cG.clone().lerp(cG2, .5 + .5 * Math.sin(x * .2 + z * .13)); c.offsetHSL(0, 0, (rnd() - .5) * .04); cols.push(c.r, c.g, c.b); }
  tg.setAttribute('color', new T.Float32BufferAttribute(cols, 3)); tg.computeVertexNormals();
  add(tg, STD({ vertexColors: true, roughness: .95 }), 0, 0, 0, { cast: false, noInk: true });
  // stone quay walls along both banks
  const stoneT = tex(256, 128, (g, w, h) => { g.fillStyle = '#b9b1a2'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 32) for (let x = -((y / 32) % 2) * 32; x < w; x += 64) { g.fillStyle = `hsl(35,${8 + rnd() * 8}%,${62 + rnd() * 12}%)`; g.fillRect(x + 2, y + 2, 60, 28); } }, [40, 1]);
  [-1, 1].forEach(sd => add(new T.BoxGeometry(1.2, 4.2, 600), STD({ map: stoneT }), sd * (RW + .2), -.5, -100));
  // promenade railing on top of the quay
  [-1, 1].forEach(sd => { for (let k = 0; k < 60; k++) add(new T.CylinderGeometry(.06, .06, 1.1, 6), STD({ color: '#2f4f3f', metalness: .4 }), sd * (RW + .6), 2.15, -250 + k * 5); add(new T.CylinderGeometry(.05, .05, 300, 6), STD({ color: '#2f4f3f', metalness: .4 }), sd * (RW + .6), 2.7, -100, { rx: Math.PI / 2 }); });
  // water (stylised, calmer river)
  const water = new T.Mesh(new T.PlaneGeometry(tw, td).rotateX(-Math.PI / 2), new T.ShaderMaterial({ uniforms: { time: { value: 0 }, sun: { value: SUN }, camPos: { value: new T.Vector3() }, fogCol: { value: new T.Color('#dfe8ec') }, fogD: { value: .0022 } },
    vertexShader: 'varying vec3 wp; void main(){ vec4 w=modelMatrix*vec4(position,1.); wp=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader: `uniform float time,fogD; uniform vec3 sun,camPos,fogCol; varying vec3 wp;
      float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float n(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y); }
      void main(){ vec3 V=normalize(camPos-wp); float fr=pow(1.-max(V.y,0.),3.); vec2 q=wp.xz*vec2(.3,.12)+vec2(0.,-time*.25); float r=n(q)+.5*n(q*2.3+3.);
        vec3 c=mix(vec3(.12,.32,.36),vec3(.3,.5,.48),.25+.4*r); c=mix(c,vec3(.75,.85,.9),fr*.32);
        float strk=smoothstep(.93,.95,n(wp.xz*vec2(2.4,.3)+vec2(0.,-time*.4))); c=mix(c,vec3(.85,.93,.92),strk*.4);
        vec3 R=reflect(-V,vec3(0,1,0)); c+=vec3(1.,.95,.8)*pow(max(dot(R,sun),0.),120.)*.8;
        float ex=pow((wp.x-${IX}.0)/${IRX}.0,2.)+pow((wp.z-(${IZ}.0))/${IRZ}.0,2.); float foam=smoothstep(1.25,1.0,ex)*(.5+.5*sin(wp.z*.9+time*2.)); c=mix(c,vec3(.95,.95,.9),foam*.35);
        float d=length(camPos-wp); c=mix(c,fogCol,1.-exp(-fogD*fogD*d*d)); gl_FragColor=vec4(c,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` }));
  water.position.y = -.02; water.userData.noInk = true; scene.add(water);
  // ---------- the island: low grassy oval with a stone rim, trees and the stone monument ----------
  const isl = new T.Group(); isl.position.set(IX, 0, IZ); scene.add(isl);
  const ig = new T.SphereGeometry(1, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2); const ism = add(ig, STD({ color: '#76ae4e' }), 0, -.5, 0, { parent: isl, s: [IRX, 1.4, IRZ] });
  add(new T.CylinderGeometry(1, 1.06, .9, 48), STD({ color: '#a59c8a' }), 0, -.35, 0, { parent: isl, s: [IRX * 1.02, 1, IRZ * 1.02] });
  const ISLAND_Y = .85;
  const leaf = ['#3f8a3a', '#4f9c3f', '#2f7434', '#5aa845'];
  const tree = (x, z, s) => { const g = new T.Group(); g.position.set(x, Math.max(0, hgt(x, z)), z); g.scale.setScalar(s); scene.add(g); add(new T.CylinderGeometry(.22, .34, 3.4, 9), STD({ color: '#6b4a2c' }), 0, 1.7, 0, { parent: g });
    for (let k = 0; k < 6; k++) { const r = 1.1 + rnd() * .9; add(new T.IcosahedronGeometry(r, 2), STD({ color: leaf[k & 3], roughness: .95 }), (rnd() - .5) * 2.6, 3.6 + rnd() * 1.8, (rnd() - .5) * 2.6, { parent: g }); } return g; };
  [[-6, -36, 1.2], [6, -26, 1.1], [-7, 16, 1.15], [6, 28, 1.0], [0, 40, .9], [8, -2, .8], [-8, 2, .9]].forEach(([x, z, s]) => { const g = tree(IX + x, IZ + z, s); g.position.y = ISLAND_Y - .2; });
  // monument (Peace of the Pyrenees, 1659): stepped plinth + obelisk with plaques
  const mon = new T.Group(); mon.position.set(IX, ISLAND_Y, IZ - 6); scene.add(mon); const stoneM = STD({ color: '#d8cfbd' });
  add(new T.BoxGeometry(3.2, .4, 3.2), stoneM, 0, .2, 0, { parent: mon }); add(new T.BoxGeometry(2.4, .4, 2.4), stoneM, 0, .6, 0, { parent: mon }); add(new T.BoxGeometry(1.4, 2.2, 1.4), stoneM, 0, 1.9, 0, { parent: mon });
  add(new T.CylinderGeometry(.35, .6, 2.6, 4), stoneM, 0, 4.3, 0, { parent: mon, ry: Math.PI / 4 });
  const plq = tex(256, 256, (g, w, h) => { g.fillStyle = '#c9bfa9'; g.fillRect(0, 0, w, h); g.strokeStyle = '#7a6e58'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28); g.fillStyle = '#4a4232'; g.font = '900 54px Inter'; g.textAlign = 'center'; g.fillText('1659', w / 2, 120); g.font = '700 26px Inter'; g.fillText('PAZ DE LOS', w / 2, 170); g.fillText('PIRINEOS', w / 2, 204); });
  [[0, .71, 0], [0, -.71, Math.PI], [.71, 0, Math.PI / 2], [-.71, 0, -Math.PI / 2]].forEach(([x, z, r]) => { const p = add(new T.PlaneGeometry(1.1, 1.1), STD({ map: plq }), x, 1.95, z, { parent: mon, ry: r, cast: false }); });
  // ---------- Basque houses on both banks ----------
  const houseT = (beam) => tex(256, 256, (g, w, h) => { g.fillStyle = '#f4f0e6'; g.fillRect(0, 0, w, h); g.fillStyle = beam; g.fillRect(0, 0, w, 12); g.fillRect(0, h / 2 - 6, w, 12); [0, 1, 2, 3].forEach(k => g.fillRect(k * 85, 0, 10, h));
    [[40, 30], [160, 30], [40, 150], [160, 150]].forEach(([x, y]) => { g.fillStyle = beam; g.fillRect(x - 6, y - 6, 68, 84); g.fillStyle = '#2c3e52'; g.fillRect(x, y, 56, 72); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x + 4, y + 4, 18, 64); g.fillStyle = beam; g.fillRect(x - 10, y + 72, 76, 8); }); });
  const roofM = STD({ color: '#b5492f' }); const beams = ['#a8322a', '#2f6b3a', '#a8322a', '#2a4f7a'];
  const house = (x, z, w, d, fl, k, ry = 0) => { const g = new T.Group(); const y0 = hgt(x, z); g.position.set(x, y0, z); g.rotation.y = ry; scene.add(g); const t = houseT(beams[k % 4]); t.repeat.set(Math.max(1, Math.round(w / 6)), fl);
    const t2 = t.clone(); t2.repeat.set(Math.max(1, Math.round(d / 6)), fl); t2.needsUpdate = true; const m1 = STD({ map: t }), m2 = STD({ map: t2 }), hh = fl * 3.2;
    add(new T.BoxGeometry(w, hh, d), [m2, m2, roofM, roofM, m1, m1], 0, hh / 2, 0, { parent: g });
    const rf = add(new T.CylinderGeometry(0, 1, 1, 4, 1), roofM, 0, hh + 1.4, 0, { parent: g, s: [w * .78, 2.8, d * .78], ry: Math.PI / 4 }); add(new T.BoxGeometry(w + .8, .2, d + .8), STD({ color: '#7a3a26' }), 0, hh + .05, 0, { parent: g }); return g; };
  for (let i = 0; i < 16; i++) { house(-RW - 10 - (i % 2) * 12, -130 + i * 13, 10 + (i % 3) * 2, 9, 2 + (i % 2), i); house(RW + 10 + (i % 2) * 12, -136 + i * 13, 10 + ((i + 1) % 3) * 2, 9, 2 + ((i + 1) % 2), i + 1); }
  for (let i = 0; i < 40; i++) { const sd = i % 2 ? 1 : -1; tree(sd * (RW + 30 + rnd() * 60), -160 + rnd() * 220, .9 + rnd() * .6); }
  // bridge downstream (stone arches)
  const br = new T.Group(); br.position.set(0, 0, -92); scene.add(br);
  add(new T.BoxGeometry(2 * RW + 6, 1.2, 7), stoneM, 0, 4.6, 0, { parent: br }); for (let k = -2; k <= 2; k++) add(new T.BoxGeometry(2.4, 6, 6), stoneM, k * 9, 1.5, 0, { parent: br });
  [-1, 1].forEach(sd => add(new T.BoxGeometry(2 * RW + 6, .9, .3), stoneM, 0, 5.6, sd * 3.3, { parent: br }));
  // flags on each bank (Spain west, France east) - planes with canvas textures, animated by the scene via W2.flags
  const flagT = (kind) => tex(256, 160, (g, w, h) => { if (kind === 'ES') { g.fillStyle = '#c60b1e'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffc400'; g.fillRect(0, h / 4, w, h / 2); } else { ['#0055a4', '#ffffff', '#ef4135'].forEach((c, i) => { g.fillStyle = c; g.fillRect(i * w / 3, 0, w / 3 + 1, h); }); } });
  const flags = []; const flag = (x, z, kind) => { const g = new T.Group(); g.position.set(x, hgt(x, z), z); scene.add(g); add(new T.CylinderGeometry(.08, .1, 9, 8), STD({ color: '#e6e6e6', metalness: .5 }), 0, 4.5, 0, { parent: g });
    const geo = new T.PlaneGeometry(3.2, 2, 16, 4); const f = add(geo, new T.MeshStandardMaterial({ map: flagT(kind), side: T.DoubleSide, roughness: .7 }), 1.65, 7.8, 0, { parent: g, noInk: true }); f.userData.base = geo.attributes.position.array.slice(); flags.push(f); return g; };
  flag(-RW - 3, -26, 'ES'); flag(RW + 3, -34, 'FR');
  // small boats moored at the quays
  const boat = (x, z, col, ry) => { const g = new T.Group(); g.position.set(x, .1, z); g.rotation.y = ry; scene.add(g); const hg = new T.SphereGeometry(1, 24, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); hg.scale(.9, .5, 2.6); add(hg, STD({ color: col, side: T.DoubleSide }), 0, 0, 0, { parent: g }); return g; };
  boat(-RW + 3, -60, '#2f6fbf', .05); boat(RW - 3, -10, '#d6453b', -.05); boat(-RW + 3, 6, '#f2c94c', .1);
  const HERO = boat(-24, -6, '#e9e4d8', .3);
  // post
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .22, .5, .92); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .003, maxblur: .007 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o === sky || o.userData.noInk || o.material.transparent) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'ShapeGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  function setTime(t) { water.material.uniforms.time.value = t; flags.forEach((f, i) => { const p = f.geometry.attributes.position, b = f.userData.base; for (let k = 0; k < p.count; k++) { const x = b[k * 3] + 1.6; p.setZ(k, Math.sin(x * 2.2 - t * 5 + i) * .12 * (x / 3.2)); } p.needsUpdate = true; f.geometry.computeVertexNormals(); }); }
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    water.material.uniforms.camPos.value.copy(pos); sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  return { T, scene, camera, R, setCam, setTime, proj, render, SUN, hgt, RW, IX, IZ, IRX, IRZ, ISLAND_Y, HERO, MON: mon, dof, bloom, comp, inkM, mid: () => 0 };
})();

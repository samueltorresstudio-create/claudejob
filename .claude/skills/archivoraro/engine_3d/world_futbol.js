// World «Estadio de 1889» (Liverpool): campo de hierba con barro y líneas de tiza, porterías de madera blanca (sin red o con la red de Brodie,
// que se deforma cuando entra el balón), valla blanca, gradas de madera llenas de público (sprites), grada cubierta con tejado y banderines,
// casas de ladrillo adosadas con chimeneas humeando, fábricas, campanario, cielo azul con nubes. Misma API que world_kenji.js (W2).
// Campo: x ∈ [-34, 34], z ∈ [-52, 52]. Portería protagonista en z = -52 (postes en x = ±3.66, larguero a 2.44 m). La red va hacia z < -52.
window.GLC = document.getElementById("gl");
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920, FAST = !!window.FAST_PREVIEW;   // FAST: previsualización rápida (media resolución, sin post) con FAST=1 node render.js preview …
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(FAST ? .5 : 1); R.setSize(W, H, false); if (FAST) { GLC.style.width = W + 'px'; GLC.style.height = H + 'px'; } R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.2; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, W / H, .05, 2500);
  const rnd = (() => { let s = 1889; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const tex = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const STD = o => new T.MeshStandardMaterial(Object.assign({ roughness: .85, metalness: 0 }, o));
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; if (o.s) m.scale.set(...o.s); m.castShadow = o.cast !== false; m.receiveShadow = true; (o.parent || scene).add(m); if (o.noInk) m.userData.noInk = true; return m; };
  const RB = (w, h, d, r = .05) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001));
  const noise = (g, w, h, n, cols, sz = [1, 3]) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const s = sz[0] + rnd() * (sz[1] - sz[0]); g.fillRect(rnd() * w, rnd() * h, s, s); } };
  const blot = (g, w, h, n, col, r0, r1) => { for (let i = 0; i < n; i++) { const x = rnd() * w, y = rnd() * h, r = r0 + rnd() * (r1 - r0); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); } };
  // ---------- cielo, luz y niebla de ciudad industrial ----------
  const SUN = new T.Vector3(-.45, .6, .66).normalize();
  const sky = new T.Mesh(new T.SphereGeometry(2000, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: SUN }, morn: { value: 0 }, night: { value: 0 } },
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 sun; uniform float morn, night; varying vec3 vd; void main(){ float h=vd.y; vec3 top=mix(vec3(.15,.42,.86),vec3(.36,.36,.62),morn), mid=mix(vec3(.46,.7,.95),vec3(.96,.62,.46),morn), hor=mix(vec3(.86,.9,.92),vec3(1.,.8,.58),morn); vec3 c=h>.08?mix(mid,top,smoothstep(.08,.65,h)):mix(hor,mid,smoothstep(-.05,.08,h)); float s=max(dot(vd,sun),0.); c+=vec3(1.,.9,.7)*(pow(s,10.)*(.18+morn*.35)); c=mix(c,vec3(.03,.04,.1),night); gl_FragColor=vec4(c,1.); }' }));
  sky.frustumCulled = false; scene.add(sky);
  scene.fog = new T.FogExp2('#d6dfe6', .0046);
  const hemi = new T.HemisphereLight('#d6e6ff', '#6f7f48', 1.5); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff0d6', 4.5); sun.castShadow = true; sun.shadow.mapSize.set(FAST ? 1024 : 4096, FAST ? 1024 : 4096);
  const sc = sun.shadow.camera; sc.left = -40; sc.right = 40; sc.top = 40; sc.bottom = -40; sc.near = 1; sc.far = 340; sun.shadow.bias = -.0004; sun.shadow.normalBias = .05; scene.add(sun, sun.target);
  const cloudM = STD({ color: '#ffffff', roughness: 1, emissive: '#8494aa', emissiveIntensity: .3 });
  for (let i = 0; i < 16; i++) { const g = new T.Group(), a = -Math.PI * .95 + i / 16 * Math.PI * 1.9, r = 360 + (i % 3) * 90; g.position.set(Math.cos(a) * r * .9, 90 + (i % 4) * 20, -Math.abs(Math.sin(a)) * r - 60); scene.add(g);
    for (let k = 0; k < 7; k++) { const m = add(new T.SphereGeometry(12 + (k % 3) * 8, 18, 12), cloudM, (k - 3) * 12, (k % 2) * 8 - 2 + (k === 3 ? 10 : 0), (k % 3) * 6, { parent: g, cast: false, noInk: true }); m.scale.y = .72; } }
  // ---------- suelo: hierba con franjas, barro y líneas de tiza ----------
  const grassT = tex(512, 512, (g, w, h) => { g.fillStyle = '#5f9e3e'; g.fillRect(0, 0, w, h); noise(g, w, h, 36000, ['#4f8a33', '#72b04c', '#447a2c', '#86c25a'], [1, 4]); blot(g, w, h, 26, 'rgba(0,0,0,.07)', 30, 90); blot(g, w, h, 18, 'rgba(255,255,200,.06)', 30, 90); }, [70, 70]);
  add(new T.PlaneGeometry(700, 700), STD({ map: grassT, roughness: 1 }), 0, -.01, 0, { rx: -Math.PI / 2, cast: false, noInk: true });
  // capa del campo (80 × 120 m): franjas de corte, barro en las áreas y en el centro, líneas de tiza (algo gastadas)
  const PX = 36; // px por metro
  const pitchT = tex(80 * PX, 120 * PX, (g, w, h) => { g.clearRect(0, 0, w, h); const X = x => (x + 40) * PX, Z = z => (z + 60) * PX;
    for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,220,.07)' : 'rgba(0,30,0,.06)'; g.fillRect(X(-34), Z(-52 + i * 8), 68 * PX, 8 * PX); }
    const mud = (x, z, r, a) => { for (let k = 0; k < 60; k++) { const ax = x + (rnd() - .5) * r * 1.6, az = z + (rnd() - .5) * r, rr = (.25 + rnd() * .6) * r * .38 * PX; const gr = g.createRadialGradient(X(ax), Z(az), 0, X(ax), Z(az), rr); gr.addColorStop(0, `rgba(112,84,52,${a * .55})`); gr.addColorStop(.55, `rgba(122,96,60,${a * .3})`); gr.addColorStop(1, 'rgba(120,90,55,0)'); g.fillStyle = gr; g.fillRect(X(ax) - rr, Z(az) - rr, rr * 2, rr * 2); } };
    mud(0, -49.5, 7, .85); mud(0, 49.5, 7, .85); mud(0, 0, 9, .5); mud(-8, -44, 5, .35); mud(9, -40, 4, .3);
    for (let i = 0; i < 1600; i++) { const x = (rnd() - .5) * 13, z = -52 + Math.pow(rnd(), 1.6) * 10; g.fillStyle = rnd() < .5 ? 'rgba(82,58,34,.35)' : 'rgba(150,120,80,.25)'; g.beginPath(); g.ellipse(X(x), Z(z), 1.2 + rnd() * 2.6, .8 + rnd() * 1.6, rnd() * 3, 0, 7); g.fill(); } // pisadas y terrones pequeños
    for (let i = 0; i < 700; i++) { const x = (rnd() - .5) * 13, z = -52 + Math.pow(rnd(), 1.4) * 9; g.strokeStyle = 'rgba(90,140,60,.5)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(X(x), Z(z)); g.lineTo(X(x) + (rnd() - .5) * 4, Z(z) - 3 - rnd() * 4); g.stroke(); } // briznas sueltas
    g.strokeStyle = 'rgba(246,244,232,.92)'; g.lineWidth = .12 * PX; g.lineCap = 'round';
    const L = (a, b, c, d) => { g.beginPath(); g.moveTo(X(a), Z(b)); g.lineTo(X(c), Z(d)); g.stroke(); };
    L(-34, -52, 34, -52); L(-34, 52, 34, 52); L(-34, -52, -34, 52); L(34, -52, 34, 52); L(-34, 0, 34, 0);
    g.beginPath(); g.arc(X(0), Z(0), 9.15 * PX, 0, 7); g.stroke(); g.fillStyle = 'rgba(246,244,232,.95)'; g.beginPath(); g.arc(X(0), Z(0), .25 * PX, 0, 7); g.fill();
    // tiza gastada sobre el barro
    g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(0,0,0,${.3 + rnd() * .5})`; const x = (rnd() - .5) * 14, z = -52 + (rnd() - .5) * .5; g.fillRect(X(x), Z(z), 2 + rnd() * 10, 2 + rnd() * 4); } g.globalCompositeOperation = 'source-over'; });
  pitchT.wrapS = pitchT.wrapT = T.ClampToEdgeWrapping;
  add(new T.PlaneGeometry(80, 120), STD({ map: pitchT, transparent: true, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), 0, .005, 0, { rx: -Math.PI / 2, cast: false, noInk: true });
  // ---------- porterías de madera ----------
  const woodT = tex(256, 256, (g, w, h) => { g.fillStyle = '#f2efe6'; g.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(120,110,90,${.05 + rnd() * .08})`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const x = rnd() * w; g.moveTo(x, 0); g.bezierCurveTo(x + 6, h * .3, x - 6, h * .7, x + 3, h); g.stroke(); } blot(g, w, h, 6, 'rgba(110,90,60,.12)', 10, 40); });
  const postM = STD({ map: woodT, roughness: .7 });
  function goal(z0, dir) { const g = new T.Group(); g.position.set(0, 0, z0); scene.add(g);
    [-3.66, 3.66].forEach(x => add(RB(.12, 2.5, .12, .02), postM, x, 1.25, 0, { parent: g }));
    add(RB(7.44, .12, .12, .02), postM, 0, 2.44, 0, { parent: g });
    [-3.66, 3.66].forEach(x => { add(new T.CylinderGeometry(.09, .12, .08, 10), STD({ color: '#5a4a34' }), x, .03, 0, { parent: g }); });
    return g; }
  const GOAL = goal(-52, -1), GOAL2 = goal(52, 1);
  // ---------- la red de Brodie (malla que se deforma) ----------
  const netT = tex(256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(245,244,236,1)'; g.lineWidth = 7; g.lineCap = 'round';
    g.beginPath(); for (let k = -1; k <= 1; k++) { g.moveTo(k * w, 0); g.lineTo(k * w + w, h); g.moveTo(k * w + w, 0); g.lineTo(k * w, h); } g.stroke();
    g.fillStyle = 'rgba(200,196,182,1)'; [[0, 0], [w / 2, h / 2], [w, 0], [0, h], [w, h]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); }); });
  const NET = new T.Group(); NET.position.set(0, 0, -52); scene.add(NET); NET.visible = false;
  // perfil de la red (de delante a atrás): larguero (y 2.44, z 0) → arriba atrás (y 2.1, z -1.4) → abajo atrás (y 0, z -2.1)
  const NU = 46, NV = 26, netGeo = new T.BufferGeometry(); const prof = v => { const a = [0, 2.44, -1.4, 2.1], b = [-2.1, 0]; if (v < .45) { const k = v / .45; return [a[2] * k, a[1] + (a[3] - a[1]) * k]; } const k = (v - .45) / .55; return [a[2] + (b[0] - a[2]) * k, a[3] + (b[1] - a[3]) * k]; };
  const NB = []; { const pos = [], uv = [], idx = []; for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) { const u = i / NU, v = j / NV, [z, y] = prof(v), x = -3.66 + u * 7.32; pos.push(x, y, z); uv.push(u * 7.32 / .16, v * 3.3 / .16); NB.push([x, y, z, v]); }
    for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) { const a = j * (NU + 1) + i, b = a + 1, c = a + NU + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    netGeo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); netGeo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); netGeo.setIndex(idx); netGeo.computeVertexNormals(); }
  const netM = STD({ map: netT, alphaTest: .4, side: T.DoubleSide, roughness: .9 }); netT.repeat.set(1, 1);
  const netMesh = add(new T.Mesh(netGeo, netM).geometry, netM, 0, 0, 0, { parent: NET, noInk: true }); netMesh.castShadow = true;
  // laterales (triángulo + cuadrilátero) y estacas atrás
  [-3.66, 3.66].forEach(x => { const sg = new T.BufferGeometry(), P = []; for (let j = 0; j <= 10; j++) { const [z, y] = prof(j / 10); P.push(x, 0, 0, x, y, z); } const ids = []; for (let j = 0; j < 10; j++) { const a = j * 2; ids.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    sg.setAttribute('position', new T.Float32BufferAttribute(P, 3)); const uvs = []; for (let k = 0; k < P.length; k += 3) uvs.push(P[k + 2] / .16, P[k + 1] / .16); sg.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2)); sg.setIndex(ids); sg.computeVertexNormals(); add(sg, netM, 0, 0, 0, { parent: NET, noInk: true });
    add(new T.CylinderGeometry(.025, .025, 2.2, 6), STD({ color: '#8a6a44' }), x, 1.1, -2.1, { parent: NET }); });
  add(new T.CylinderGeometry(.02, .02, 7.4, 6), STD({ color: '#8a6a44' }), 0, 2.1, -1.4, { parent: NET, rz: Math.PI / 2 });
  // deformación: golpe (onda amortiguada) + bolsa donde reposa el balón
  function setNet(o = {}) { const p = netGeo.attributes.position, hit = o.hit, t = o.t ?? 0, A = o.amp ?? .55, rest = o.rest;
    for (let k = 0; k < NB.length; k++) { let [x, y, z, v] = NB[k]; let dz = 0, dy = 0;
      if (hit && t >= 0) { const d2 = (x - hit[0]) ** 2 + (y - hit[1]) ** 2, f = Math.exp(-d2 / .9) * Math.exp(-t * 3.2) * Math.cos(t * 13), push = A * f * (1 - Math.min(1, t * .15)); dz -= push * (v > .2 ? 1 : v / .2); }
      if (rest) { const d2 = (x - rest[0]) ** 2 + (y - .2) ** 2; const f = Math.exp(-d2 / .5) * (v > .5 ? (v - .5) * 2 : 0); dz -= f * .28; dy -= f * .06; }
      dz += Math.sin(x * 2.1 + (o.wind ?? 0) * 1.3 + y) * .015 * v; p.setXYZ(k, x, y + dy, z + dz); }
    p.needsUpdate = true; netGeo.computeVertexNormals(); }
  { const idx = []; for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) { const a = j * (NU + 1) + i, b = a + 1, c = a + NU + 1, d = c + 1; idx.push(a, d, b, c); }
    const lg = new T.BufferGeometry(); lg.setAttribute('position', netGeo.attributes.position); lg.setIndex(idx); const netLn = new T.LineSegments(lg, new T.LineBasicMaterial({ color: '#f4f2ea', transparent: true, opacity: .85 })); netLn.frustumCulled = false; NET.add(netLn); NET.userData.lines = netLn;
    [-3.66, 3.66].forEach(x => { const P = []; for (let j = 0; j < 12; j++) { const [z0, y0] = prof(j / 12), [z1, y1] = prof((j + 1) / 12); for (let k = 0; k < 8; k++) { const a = k / 8, b = (k + 1) / 8; P.push(x, y0 * a, z0, x, y1 * b, z1, x, y0 * b, z0, x, y1 * a, z1); } }
      const sgl = new T.BufferGeometry(); sgl.setAttribute('position', new T.Float32BufferAttribute(P, 3)); NET.add(new T.LineSegments(sgl, netLn.material)); }); }
  setNet({});
  // ---------- balón de cuero de 1889 (paneles y cordones) ----------
  const ballT = tex(512, 256, (g, w, h) => { g.fillStyle = '#8a4e26'; g.fillRect(0, 0, w, h); blot(g, w, h, 30, 'rgba(60,30,12,.25)', 10, 50); blot(g, w, h, 16, 'rgba(200,140,80,.2)', 10, 40);
    g.strokeStyle = 'rgba(40,20,8,.85)'; g.lineWidth = 4; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(i * w / 6, 0); g.bezierCurveTo(i * w / 6 + 30, h * .35, i * w / 6 - 30, h * .65, i * w / 6, h); g.stroke(); }
    g.fillStyle = '#e8d2a8'; for (let k = 0; k < 7; k++) { g.fillRect(w * .48 - 18, h * .3 + k * 14, 36, 5); } g.strokeStyle = '#3a2210'; g.lineWidth = 3; g.strokeRect(w * .48 - 6, h * .28, 12, 104); });
  const BALL = add(new T.SphereGeometry(.11, 32, 20), STD({ map: ballT, roughness: .55 }), 0, .11, -46);
  function ball(p, rot = 0, vis = true) { BALL.visible = vis; if (p) BALL.position.copy(p); BALL.rotation.set(rot * .7, rot, rot * .3); }
  // ---------- valla blanca alrededor del campo ----------
  const fenceM = STD({ color: '#f1eee4', roughness: .8 }); const FP = [];
  for (let x = -38; x <= 38; x += 2.4) { FP.push([x, -56.5]); FP.push([x, 56.5]); } for (let z = -56.5; z <= 56.5; z += 2.4) { FP.push([-38, z]); FP.push([38, z]); }
  { const im = new T.InstancedMesh(new T.BoxGeometry(.1, 1.1, .1), fenceM, FP.length), dm = new T.Object3D(); FP.forEach(([x, z], i) => { dm.position.set(x, .55, z); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); }); im.castShadow = true; im.receiveShadow = true; scene.add(im); }
  [[0, -56.5, 76, 0], [0, 56.5, 76, 0], [-38, 0, 113, 1], [38, 0, 113, 1]].forEach(([x, z, L, s]) => [.5, .95].forEach(y => add(new T.BoxGeometry(s ? .06 : L, .08, s ? L : .06), fenceM, x, y, z)));
  // ---------- gradas de madera ----------
  const plankT = tex(512, 256, (g, w, h) => { g.fillStyle = '#7a5434'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 32) { g.fillStyle = `rgba(0,0,0,${.15 + rnd() * .1})`; g.fillRect(0, y, w, 3); } for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(40,25,12,${.1 + rnd() * .15})`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const y = rnd() * h; g.moveTo(0, y); g.bezierCurveTo(w * .3, y + 4, w * .6, y - 4, w, y + 2); g.stroke(); } blot(g, w, h, 10, 'rgba(255,220,170,.08)', 20, 80); }, [8, 1]);
  const standM = STD({ map: plankT, roughness: .9 }), roofM = STD({ color: '#5d6670', metalness: .3, roughness: .5 }), rimM = STD({ color: '#2e4a3a' });
  const SEATS = []; // [x, y, z, facingYaw] para el público
  function terrace(cx, cz, len, rows, dir, axis, opt = {}) { // dir: hacia dónde sube la grada (alejándose del campo); axis 'x' = grada a lo largo de x
    const stepD = .75, stepH = .42;
    for (let r = 0; r < rows; r++) { const d = r * stepD + stepD / 2, y = (r + 1) * stepH;
      const geo = RB(axis === 'x' ? len : stepD, y, axis === 'x' ? stepD : len, .03);
      const px = axis === 'x' ? cx : cx + dir * d, pz = axis === 'x' ? cz + dir * d : cz; add(geo, standM, px, y / 2, pz);
      for (let s = -len / 2 + .5; s < len / 2 - .3; s += .62) { const jit = (rnd() - .5) * .18; SEATS.push(axis === 'x' ? [cx + s + jit, y, pz + dir * .05, axis, dir] : [px + dir * .05, y, cz + s + jit, axis, dir]); } }
    const backD = rows * stepD + .3, topY = rows * stepH;
    add(RB(axis === 'x' ? len : .3, topY + 1.4, axis === 'x' ? .3 : len, .03), standM, axis === 'x' ? cx : cx + dir * backD, (topY + 1.4) / 2, axis === 'x' ? cz + dir * backD : cz);
    if (opt.roof) { const fr = -.4, frontH = topY + 3.2, backH = topY + 4.6; // tejado de chapa sobre postes, con faldón pintado y banderines
      for (let s = -len / 2; s <= len / 2 + .01; s += len / Math.max(1, Math.round(len / 7))) { const p = axis === 'x' ? [cx + s, cz + dir * fr] : [cx + dir * fr, cz + s]; add(new T.CylinderGeometry(.09, .11, frontH, 10), STD({ color: '#2e4a3a' }), p[0], frontH / 2, p[1]); }
      const rw = backD - fr + .8, ang = Math.atan2(backH - frontH, rw), rl = Math.hypot(rw, backH - frontH);
      const roof = add(RB(axis === 'x' ? len + .6 : rl, .12, axis === 'x' ? rl : len + .6, .02), roofM, axis === 'x' ? cx : cx + dir * (fr + rw / 2), (frontH + backH) / 2 + .1, axis === 'x' ? cz + dir * (fr + rw / 2) : cz);
      if (axis === 'x') roof.rotation.x = -dir * ang; else roof.rotation.z = dir * ang;
      const signT = tex(2048, 128, (g, w, h) => { g.fillStyle = '#2e4a3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#e9d9a8'; g.fillRect(0, 10, w, 4); g.fillRect(0, h - 14, w, 4); g.font = '900 64px Inter, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#f3e6c0';
        (opt.sign || ['FOOTBALL GROUND', '★', 'HOT TEA  1d', '★', 'MEAT PIES', '★', 'KICK-OFF 3 O\'CLOCK']).forEach((t, i, a) => g.fillText(t, (i + .5) * w / a.length, h / 2 + 4)); });
      add(new T.BoxGeometry(axis === 'x' ? len : .08, .9, axis === 'x' ? .08 : len), [rimM, rimM, rimM, rimM, STD({ map: signT }), STD({ map: signT })], axis === 'x' ? cx : cx + dir * (fr - .05), frontH - .2, axis === 'x' ? cz + dir * (fr - .05) : cz, axis === 'x' ? {} : { ry: dir > 0 ? Math.PI / 2 : -Math.PI / 2 });
      // banderines de colores colgando del faldón
      const cols = ['#c8302e', '#f2c94c', '#2f6fbf', '#f4f2ec', '#2f8a4a']; const N = Math.round(len / .5);
      for (let i = 0; i < N; i++) { const s = -len / 2 + (i + .5) * len / N, sag = Math.sin((i % 14) / 14 * Math.PI) * .35; const fl = add(new T.ConeGeometry(.16, .34, 3), STD({ color: cols[i % 5], side: T.DoubleSide }), axis === 'x' ? cx + s : cx + dir * (fr - .2), frontH - .85 - sag, axis === 'x' ? cz + dir * (fr - .2) : cz + s, { rx: Math.PI, cast: false, noInk: true }); fl.scale.z = .15; } } }
  terrace(0, -58, 62, 12, -1, 'x', { roof: true, sign: ['ANFIELD ROAD END', '★', 'HOT TEA  1d', '★', 'MEAT PIES', '★', 'BOOTS & BALLS'] });
  terrace(-41, -18, 66, 10, -1, 'z', { roof: true }); terrace(41, -18, 66, 9, 1, 'z', {});
  // ---------- ciudad de 1889: casas de ladrillo adosadas, chimeneas, fábricas, campanario ----------
  const brickT = tex(512, 512, (g, w, h) => { g.fillStyle = '#9b4a32'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? -16 : 0; x < w; x += 32) { g.fillStyle = ['#a3523a', '#8e4029', '#b25e41', '#97462f'][Math.floor(rnd() * 4)]; g.fillRect(x + 1, y + 1, 30, 14); } blot(g, w, h, 14, 'rgba(30,20,20,.18)', 30, 120); }, [6, 2]);
  const winT = tex(512, 256, (g, w, h) => { g.fillStyle = '#9b4a32'; g.fillRect(0, 0, w, h); noise(g, w, h, 4000, ['#a3523a', '#8a3e28'], [2, 5]); for (let i = 0; i < 4; i++) { const x = 30 + i * 125; [[30, 60], [150, 70]].forEach(([y, hh]) => { g.fillStyle = '#e9e2cf'; g.fillRect(x - 6, y - 6, 72, hh + 12); g.fillStyle = '#2a3442'; g.fillRect(x, y, 60, hh); g.fillStyle = 'rgba(255,240,200,.25)'; g.fillRect(x + 6, y + 6, 20, hh - 12); g.fillStyle = '#e9e2cf'; g.fillRect(x + 28, y, 4, hh); g.fillRect(x, y + hh / 2 - 2, 60, 4); }); } }, [1, 1]);
  const slateM = STD({ color: '#3d4350', roughness: .7 }), chimM = STD({ map: brickT }), houseFront = STD({ map: winT }), houseSide = STD({ map: brickT });
  const HOUSES = []; // filas de casas alrededor del estadio
  function row(x0, z0, n, axis, ry) { for (let i = 0; i < n; i++) { const w = 5.2, x = axis === 'x' ? x0 + i * w : x0, z = axis === 'x' ? z0 : z0 + i * w, hh = 6.6 + (i % 3 === 0 ? .4 : 0); HOUSES.push([x, z, w, hh, ry]); } }
  row(-70, -84, 28, 'x', 0); row(-66, -98, 26, 'x', 0); row(-90, -60, 22, 'z', Math.PI / 2); row(84, -70, 24, 'z', -Math.PI / 2); row(-74, 74, 30, 'x', Math.PI);
  { const bG = new T.BoxGeometry(5.1, 1, 5.2), mats = [houseSide, houseSide, houseSide, houseSide, houseFront, houseSide]; const imF = new T.InstancedMesh(bG, mats, HOUSES.length), dm = new T.Object3D();
    const rG = new T.CylinderGeometry(.01, 3.2, 2.6, 4, 1); const imR = new T.InstancedMesh(rG, slateM, HOUSES.length); const cG = new T.BoxGeometry(.8, 1.8, .6), imC = new T.InstancedMesh(cG, chimM, HOUSES.length);
    HOUSES.forEach(([x, z, w, hh, ry], i) => { dm.position.set(x, hh / 2, z); dm.rotation.set(0, ry, 0); dm.scale.set(1, hh, 1); dm.updateMatrix(); imF.setMatrixAt(i, dm.matrix);
      dm.position.set(x, hh + 1.1, z); dm.rotation.set(0, ry + Math.PI / 4, 0); dm.scale.set(1.15, 1, 1.15); dm.updateMatrix(); imR.setMatrixAt(i, dm.matrix);
      dm.position.set(x + Math.cos(ry) * 1.6, hh + 2.2, z - Math.sin(ry) * 1.6); dm.rotation.set(0, ry, 0); dm.scale.set(1, 1, 1); dm.updateMatrix(); imC.setMatrixAt(i, dm.matrix); });
    [imF, imR, imC].forEach(m => { m.castShadow = true; m.receiveShadow = true; scene.add(m); }); }
  // humo: bocanadas que suben (animadas en setTime)
  const puffT = tex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(235,232,226,.95)'); gr.addColorStop(.45, 'rgba(210,206,200,.6)'); gr.addColorStop(1, 'rgba(200,196,190,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const SMOKE = []; const smokeSprite = (dark) => { const m = new T.Sprite(new T.SpriteMaterial({ map: puffT, color: dark ? '#8a8682' : '#ffffff', transparent: true, depthWrite: false, opacity: .7 })); scene.add(m); return m; };
  const chimDark = STD({ map: brickT, color: '#c79a86' });
  function chimney(x, z, h, r) { add(new T.CylinderGeometry(r * .78, r, h, 16), chimDark, x, h / 2, z); add(new T.CylinderGeometry(r * .92, r * .92, .9, 16), STD({ color: '#2e2622' }), x, h, z); add(new T.CylinderGeometry(r * .86, r * .86, .5, 16), STD({ color: '#2e2622' }), x, h * .72, z);
    for (let k = 0; k < 14; k++) { const m = smokeSprite(k % 3 === 0); SMOKE.push([m, x, h, z, k / 14, r]); } }
  chimney(52, -150, 27, 1.8); chimney(66, -160, 23, 1.6); chimney(-70, -152, 25, 1.7); chimney(-38, -176, 30, 2);
  for (let i = 0; i < 40; i++) { const h = HOUSES[(i * 7) % HOUSES.length]; const m = smokeSprite(false); SMOKE.push([m, h[0], h[3] + 3.2, h[1], (i * .37) % 1, .45]); }
  // fábrica y campanario
  add(RB(34, 12, 16, .1), STD({ map: brickT }), 52, 6, -122); add(new T.BoxGeometry(34.5, .6, 16.5), slateM, 52, 12.3, -122);
  for (let i = 0; i < 8; i++) add(RB(3, 4, .2, .03), STD({ color: '#2a3442', roughness: .3, metalness: .3 }), 38 + i * 4, 6, -113.9, { noInk: true });
  { const cx = -14, cz = -142; add(RB(6, 20, 6, .08), STD({ color: '#8f8a80' }), cx, 10, cz); add(new T.ConeGeometry(4.6, 16, 4), slateM, cx, 28, cz, { ry: Math.PI / 4 }); add(new T.CylinderGeometry(1.2, 1.2, .3, 20), STD({ color: '#f4f2ec' }), cx, 15, cz + 3.05, { rx: Math.PI / 2 }); }
  // ---------- público: sprites (billboards) en las gradas, cargados desde crowd/*.png (los genera bake_crowd.js) ----------
  const CROWD = { meshes: [], people: [] };
  function crowd(files, opt = {}) { const loader = new T.TextureLoader(), N = files.length / 2; // files: [idle_0..idle_N-1, cheer_0..cheer_N-1]; devuelve una promesa
    const proms = []; const texs = files.map(f => { let res; proms.push(new Promise(r => res = r)); const t = loader.load(f, res, undefined, res); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; });
    const geo = new T.PlaneGeometry(2.07, 2.83); geo.translate(0, 1.33, 0); // mismo tamaño que los personajes 2D (sprite de 520×710 unidades)
    const per = Array.from({ length: N }, () => []); SEATS.forEach((s, i) => { if (rnd() < (opt.empty ?? .04)) return; per[Math.floor(rnd() * N)].push(s); });
    for (let v = 0; v < N; v++) [0, 1].forEach(ch => { const mat = new T.MeshBasicMaterial({ map: texs[v + ch * N], alphaTest: .5, side: T.DoubleSide, color: '#f6ecdc', toneMapped: false }); const im = new T.InstancedMesh(geo, mat, per[v].length); im.userData = { v, ch, seats: per[v] }; im.frustumCulled = false; scene.add(im); CROWD.meshes.push(im); }); return Promise.all(proms); }
  let cheerK = 0, crowdT = 0, HIDE = []; function hideSeats(a) { HIDE = a || []; }
  function updCrowd() { if (!CROWD.meshes.length) return; const dm = new T.Object3D(), yaw = Math.atan2(camera.position.x, camera.position.z);
    CROWD.meshes.forEach(im => { const { ch, seats } = im.userData; seats.forEach((s, i) => { const ph = (s[0] * 1.7 + s[2] * 2.3) % 6.28, me = splitX === null ? hsh(s[0], s[2]) < cheerK : (s[0] < splitX && hsh(s[0], s[2]) < cheerK); const hid = HIDE.some(h => s[0] > h[0] && s[0] < h[1] && s[2] > h[2] && s[2] < h[3]); /* HIDE: rectángulos [x0, x1, z0, z1] */ const show = !hid && (ch ? me : !me);
      const bob = ch ? Math.abs(Math.sin(crowdT * 9 + ph)) * .12 : Math.sin(crowdT * 2.2 + ph) * .02; const yawI = Math.atan2(camera.position.x - s[0], camera.position.z - s[2]);
      dm.position.set(s[0], s[1] - .05 + bob, s[2]); dm.rotation.set(0, yawI, 0); const sc = show ? .92 + hsh(s[2], s[0]) * .16 : 0; dm.scale.set(sc, sc, sc); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); }); im.instanceMatrix.needsUpdate = true; }); }
  const hsh = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
  // ---------- cartel con el año, encima del faldón de la grada del fondo ----------
  const yearC = document.createElement('canvas'); yearC.width = 1024; yearC.height = 256; const yearT = new T.CanvasTexture(yearC); yearT.colorSpace = T.SRGBColorSpace; yearT.anisotropy = 8;
  function setYear(txt) { if (yearC._t === txt) return; yearC._t = txt; const g = yearC.getContext('2d'); g.fillStyle = '#efe6c8'; g.fillRect(0, 0, 1024, 256); g.strokeStyle = '#2e4a3a'; g.lineWidth = 18; g.strokeRect(9, 9, 1006, 238); g.fillStyle = '#1b1720'; g.font = '900 200px Inter, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 512, 140); yearT.needsUpdate = true; }
  setYear('1889'); { const dk = STD({ color: '#2e4a3a' }); add(new T.BoxGeometry(3.6, .9, .14), [dk, dk, dk, dk, STD({ map: yearT }), dk], 0, 9.15, -57.45); }
  // ---------- caja de madera y rollo de cuerda (para colgar la red) ----------
  const crateT = tex(256, 256, (g, w, h) => { g.fillStyle = '#b08450'; g.fillRect(0, 0, w, h); for (let i = 0; i < 5; i++) { g.fillStyle = 'rgba(60,35,15,.5)'; g.fillRect(0, i * 51 + 48, w, 4); } g.strokeStyle = '#6a4424'; g.lineWidth = 22; g.strokeRect(11, 11, w - 22, h - 22); g.beginPath(); g.moveTo(11, 11); g.lineTo(w - 11, h - 11); g.stroke(); noise(g, w, h, 1500, ['rgba(0,0,0,.06)', 'rgba(255,255,255,.06)']); });
  const CRATE = new T.Group(); CRATE.position.set(2.2, 0, -51.5); scene.add(CRATE); add(RB(.9, .62, .7, .03), STD({ map: crateT }), 0, .31, 0, { parent: CRATE, ry: .15 }); add(RB(.8, .6, .64, .03), STD({ map: crateT }), .03, .92, .02, { parent: CRATE, ry: -.1 });   // dos cajas apiladas (Brodie se sube para atar la red al larguero)
  for (let k = 0; k < 4; k++) add(new T.TorusGeometry(.22 - k * .01, .035, 8, 24), STD({ color: '#c9a66b' }), .95, .04 + k * .06, .25, { parent: CRATE, rx: Math.PI / 2 });
  // ---------- DESPACHO de Brodie de noche (lejos del estadio, en x = 300): mesa con lámpara de aceite, plano azul, ventana con la ciudad, papelera ----------
  const OX = 300, ROOM = new T.Group(); ROOM.position.set(OX, 0, 0); scene.add(ROOM);
  const panelT = tex(512, 512, (g, w, h) => { g.fillStyle = '#6a4630'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 64) { g.fillStyle = `rgba(30,15,8,${.25 + rnd() * .15})`; g.fillRect(x, 0, 4, h); } g.fillStyle = '#4e3020'; g.fillRect(0, h * .62, w, h * .38); g.fillStyle = '#3a2216'; g.fillRect(0, h * .6, w, 12); for (let x = 12; x < w; x += 128) { g.strokeStyle = 'rgba(20,10,5,.5)'; g.lineWidth = 5; g.strokeRect(x, h * .68, 104, h * .26); } noise(g, w, h, 5000, ['rgba(0,0,0,.05)', 'rgba(255,220,180,.04)'], [1, 4]); }, [3, 1]);
  const floorT = tex(512, 512, (g, w, h) => { g.fillStyle = '#8a5e3a'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 64) { g.fillStyle = `rgba(40,22,10,${.3 + rnd() * .2})`; g.fillRect(x, 0, 3, h); for (let k = 0; k < 3; k++) { g.fillRect(x, rnd() * h, 64, 3); } } noise(g, w, h, 6000, ['rgba(0,0,0,.06)', 'rgba(255,220,170,.05)'], [1, 5]); }, [3, 3]);
  const wallM = STD({ map: panelT, roughness: .8 }), deskM = STD({ color: '#5a3520', roughness: .55 });
  add(new T.PlaneGeometry(7, 6), STD({ map: floorT, roughness: .7 }), 0, 0, 0, { parent: ROOM, rx: -Math.PI / 2, cast: false });
  add(RB(7.2, 3.6, .2, .02), wallM, 0, 1.8, -2.6, { parent: ROOM, noInk: true }); add(RB(.2, 3.6, 6, .02), wallM, -3.5, 1.8, 0, { parent: ROOM, noInk: true }); add(RB(.2, 3.6, 6, .02), wallM, 3.5, 1.8, 0, { parent: ROOM, noInk: true }); add(RB(7.2, .2, 6.2, .02), STD({ color: '#3a2418' }), 0, 3.7, 0, { parent: ROOM, noInk: true });
  add(new T.PlaneGeometry(2.6, 1.8), STD({ color: '#7a2e2a', roughness: 1 }), .3, .012, -.4, { parent: ROOM, rx: -Math.PI / 2, cast: false }); // alfombra
  // ventana con la ciudad de noche
  const nightT = tex(512, 640, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0c1230'); gr.addColorStop(1, '#2a3a6a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#f4f0d8'; g.beginPath(); g.arc(380, 130, 46, 0, 7); g.fill(); g.fillStyle = '#0c1230'; g.beginPath(); g.arc(398, 118, 40, 0, 7); g.fill();
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,240,${.4 + rnd() * .6})`; g.fillRect(rnd() * w, rnd() * h * .6, 3, 3); } g.fillStyle = '#10142a'; for (let x = 0; x < w; x += 64) { const hh = 120 + rnd() * 120; g.fillRect(x, h - hh, 60, hh); g.fillRect(x + 20, h - hh - 40, 14, 40); g.fillStyle = '#ffcf7a'; if (rnd() < .7) g.fillRect(x + 12, h - hh + 30, 12, 16); if (rnd() < .5) g.fillRect(x + 36, h - hh + 60, 12, 16); g.fillStyle = '#10142a'; } });
  add(new T.PlaneGeometry(1.5, 1.9), STD({ map: nightT, emissive: '#ffffff', emissiveMap: nightT, emissiveIntensity: .55 }), 1.7, 2.0, -2.49, { parent: ROOM, cast: false });
  [[1.7, 2.0, 1.66, .09], [1.7, 2.95, 1.66, .1], [1.7, 1.05, 1.76, .12]].forEach(([x, y, w, hh]) => add(RB(w, hh, .1, .02), deskM, x, y, -2.46, { parent: ROOM })); [[.93], [1.7], [2.47]].forEach(([x]) => add(RB(.09, 1.9, .1, .02), deskM, x, 2.0, -2.46, { parent: ROOM }));
  // cuadros con planos de tuberías («dibujaba tuberías»)
  const pipeT = k => tex(512, 384, (g, w, h) => { g.fillStyle = '#24508a'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = '#eaf2ff'; g.lineWidth = 16; g.lineJoin = 'round'; g.beginPath(); if (k) { g.moveTo(40, 300); g.lineTo(200, 300); g.lineTo(200, 120); g.lineTo(380, 120); g.lineTo(380, 250); g.lineTo(480, 250); } else { g.moveTo(40, 90); g.lineTo(300, 90); g.lineTo(300, 300); g.lineTo(470, 300); g.moveTo(160, 90); g.lineTo(160, 340); } g.stroke();
    g.strokeStyle = '#24508a'; g.lineWidth = 8; g.stroke(); g.fillStyle = '#eaf2ff'; [[200, 300], [200, 120], [380, 120], [380, 250], [300, 90], [300, 300], [160, 90]].slice(k ? 0 : 4, k ? 4 : 7).forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 15, 0, 7); g.fill(); }); g.font = '700 22px Inter, sans-serif'; g.fillText(k ? 'SEWER  No. 7' : 'WATER MAIN', 24, 40); });
  [[-2.1, 2.15, 0], [-.75, 2.05, 1]].forEach(([x, y, k]) => { add(RB(1.16, .9, .06, .02), deskM, x, y, -2.47, { parent: ROOM }); add(new T.PlaneGeometry(1.02, .76), STD({ map: pipeT(k), roughness: .9 }), x, y, -2.43, { parent: ROOM, cast: false }); });
  // mesa, lámpara de aceite, plano, tintero, rollos
  add(RB(2.1, .09, 1.05, .03), deskM, -.9, .8, -1.25, { parent: ROOM }); [[-1.85, -1.68], [.05, -1.68], [-1.85, -.82], [.05, -.82]].forEach(([x, z]) => add(RB(.1, .78, .1, .02), deskM, x, .39, z, { parent: ROOM }));
  add(new T.PlaneGeometry(1.86, .86), STD({ color: '#2f5a3e', roughness: .8 }), -.9, .848, -1.25, { parent: ROOM, rx: -Math.PI / 2, cast: false });
  const planC = document.createElement('canvas'); planC.width = 768; planC.height = 512; const planT = new T.CanvasTexture(planC); planT.colorSpace = T.SRGBColorSpace; planT.anisotropy = 8;
  function plan(k) { const g = planC.getContext('2d'), w = 768, h = 512; g.fillStyle = '#24508a'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.16)'; g.lineWidth = 1; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = '#f2f6ff'; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 14; const k1 = Math.min(1, k * 3.3); // 1) la portería (dos palos y un larguero), vista en perspectiva
    const G = [[150, 420], [150, 150], [520, 150], [520, 420]], seg = (a, b, f) => { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); g.stroke(); };
    [0, 1, 2].forEach(i => { const f = Math.max(0, Math.min(1, k1 * 3 - i)); if (f > 0) seg(G[i], G[i + 1], f); });
    const k2 = Math.max(0, Math.min(1, (k - .3) / .7)); if (k2 > 0) { g.lineWidth = 5; const B = [[270, 380], [270, 200], [640, 200], [640, 380]]; // 2) la red: marco trasero + malla
      [[G[1], B[1]], [G[2], B[2]], [B[1], B[2]], [B[1], B[0]], [B[2], B[3]], [G[0], B[0]], [G[3], B[3]]].forEach(([a, b], i) => { const f = Math.max(0, Math.min(1, k2 * 9 - i)); if (f > 0) seg(a, b, f); });
      g.lineWidth = 2.5; const n = Math.floor(Math.max(0, k2 - .5) * 2 * 26); for (let i = 0; i < n; i++) { const u = (i % 13 + .5) / 13; if (i < 13) { g.beginPath(); g.moveTo(270 + u * 370, 200); g.lineTo(270 + u * 370, 380); g.stroke(); g.beginPath(); g.moveTo(150 + u * 370, 150); g.lineTo(270 + u * 370, 200); g.stroke(); } else { g.beginPath(); g.moveTo(270, 200 + u * 180); g.lineTo(640, 200 + u * 180); g.stroke(); g.beginPath(); g.moveTo(520, 150 + u * 270); g.lineTo(640, 200 + u * 180); g.stroke(); } } }
    g.fillStyle = '#f2f6ff'; g.font = '700 30px Inter, sans-serif'; g.fillText('GOAL  NET', 36, 60); g.font = '700 20px Inter, sans-serif'; g.fillText('J. A. BRODIE', 560, 480); planT.needsUpdate = true; }
  plan(0); add(new T.PlaneGeometry(1.12, .75), STD({ map: planT, roughness: .9 }), -.75, .853, -1.2, { parent: ROOM, rx: -Math.PI / 2, rz: .06, cast: false });
  add(new T.CylinderGeometry(.11, .14, .07, 20), STD({ color: '#b8902a', metalness: .7, roughness: .3 }), -1.7, .88, -1.5, { parent: ROOM }); add(new T.SphereGeometry(.1, 20, 14), STD({ color: '#b8902a', metalness: .7, roughness: .3 }), -1.7, .98, -1.5, { parent: ROOM });
  add(new T.CylinderGeometry(.055, .085, .3, 16, 1, true), STD({ color: '#fff2d0', transparent: true, opacity: .35, roughness: .05, emissive: '#ffb050', emissiveIntensity: .6 }), -1.7, 1.22, -1.5, { parent: ROOM, cast: false, noInk: true });
  const flame = add(new T.SphereGeometry(.04, 12, 10), new T.MeshBasicMaterial({ color: '#ffd27a' }), -1.7, 1.16, -1.5, { parent: ROOM, cast: false, noInk: true, s: [1, 1.9, 1] });
  const lampL = new T.PointLight('#ffb060', 0, 14, 1.6); lampL.position.set(-1.7, 1.3, -1.5); lampL.castShadow = true; lampL.shadow.mapSize.set(1024, 1024); lampL.shadow.bias = -.002; ROOM.add(lampL); lampL.visible = false;
  const fillL = new T.PointLight('#ffc890', 0, 16, 1.4); fillL.position.set(.6, 2.4, 1.6); ROOM.add(fillL); fillL.visible = false;
  add(new T.CylinderGeometry(.05, .06, .09, 12), STD({ color: '#1b1720', roughness: .2 }), -.1, .89, -1.6, { parent: ROOM }); [0, 1, 2].forEach(k => add(new T.CylinderGeometry(.035, .035, .8, 10), STD({ color: ['#eae2cc', '#24508a', '#eae2cc'][k] }), -1.62 + k * .05, .885 + (k === 2 ? .06 : 0), -1.0 + k * .03 - (k === 2 ? .03 : 0), { parent: ROOM, rz: Math.PI / 2, ry: .2 }));
  // silla (el pantalón colgado se dibuja en 2D), papelera de mimbre, bolas de papel
  const CHAIR = new T.Vector3(OX + 1.25, 0, -1.75); add(RB(.5, .06, .5, .02), deskM, 1.25, .5, -1.75, { parent: ROOM }); add(RB(.5, .7, .06, .02), deskM, 1.25, 1.02, -1.98, { parent: ROOM }); [[1.03, -1.95], [1.47, -1.95], [1.03, -1.55], [1.47, -1.55]].forEach(([x, z]) => add(RB(.05, .5, .05, .01), deskM, x, .25, z, { parent: ROOM }));
  const wickerT = tex(256, 128, (g, w, h) => { g.fillStyle = '#b98a4e'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 12) for (let x = (y / 12) % 2 ? 0 : 12; x < w; x += 24) { g.fillStyle = 'rgba(70,40,15,.55)'; g.fillRect(x, y, 12, 10); } g.fillStyle = '#8a5e2e'; g.fillRect(0, 0, w, 10); g.fillRect(0, h - 8, w, 8); }, [3, 1]);
  const BIN = new T.Vector3(OX + 1.6, 0, .35); add(new T.CylinderGeometry(.26, .2, .52, 24, 1, true), STD({ map: wickerT, side: T.DoubleSide }), 1.6, .26, .35, { parent: ROOM, noInk: true }); add(new T.CylinderGeometry(.2, .2, .03, 24), STD({ color: '#8a5e2e' }), 1.6, .015, .35, { parent: ROOM }); add(new T.TorusGeometry(.26, .022, 8, 28), STD({ color: '#8a5e2e' }), 1.6, .52, .35, { parent: ROOM, rx: Math.PI / 2 });
  const paperM = STD({ color: '#f1ecdc', roughness: 1, flatShading: true }); [[2.15, .2], [1.15, .75], [2.3, .9], [.9, .1]].forEach(([x, z], i) => add(new T.IcosahedronGeometry(.07, 0), paperM, x, .06, z, { parent: ROOM, ry: i }));
  const PAPER = add(new T.IcosahedronGeometry(.075, 0), paperM, 1.6, .1, .35, { parent: ROOM }); PAPER.visible = false;
  function paper(p, rot = 0, vis = true) { PAPER.visible = vis; if (p) { PAPER.position.set(p.x - OX, p.y, p.z); PAPER.rotation.set(rot, rot * 1.3, rot * .7); } }
  // ---------- red en 2D (para dibujarla ENCIMA de los personajes cuando se mira a través de ella) ----------
  function netLines(step = 1) { const p = netGeo.attributes.position, UA = 7.32 / .16, VB = 3.3 / .16, out = [];
    const at = (a, b) => { const fu = Math.max(0, Math.min(1, a / UA)) * NU, fv = Math.max(0, Math.min(1, b / VB)) * NV, i = Math.min(NU - 1, Math.floor(fu)), j = Math.min(NV - 1, Math.floor(fv)), u = fu - i, v = fv - j, q = (ii, jj) => { const k = jj * (NU + 1) + ii; return [p.getX(k), p.getY(k), p.getZ(k)]; };
      const A = q(i, j), B = q(i + 1, j), C = q(i, j + 1), D = q(i + 1, j + 1); return new T.Vector3((A[0] * (1 - u) + B[0] * u) * (1 - v) + (C[0] * (1 - u) + D[0] * u) * v, (A[1] * (1 - u) + B[1] * u) * (1 - v) + (C[1] * (1 - u) + D[1] * u) * v, (A[2] * (1 - u) + B[2] * u) * (1 - v) + (C[2] * (1 - u) + D[2] * u) * v - 52); };
    for (let n = -Math.ceil(VB); n <= Math.ceil(UA); n++) { const L = []; for (let b = Math.max(0, -n); b <= Math.min(VB, UA - n) + 1e-6; b += step) L.push(at(n + b, b)); if (L.length > 1) out.push(L); }
    for (let n = 0; n <= Math.ceil(UA + VB); n++) { const L = []; for (let b = Math.max(0, n - UA); b <= Math.min(VB, n) + 1e-6; b += step) L.push(at(n - b, b)); if (L.length > 1) out.push(L); }
    return out; }
  // ---------- post: brillo + desenfoque de fondo + grade ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .2, .5, .92); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .003, maxblur: .006 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, time: { value: 0 }, morn: { value: 0 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float time, morn; varying vec2 vUv; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c+=vec3(-.01,.006,.026)*(1.-l); c+=vec3(.032,.016,-.016)*l; c+=vec3(.05,.01,-.03)*morn; c=mix(vec3(l),c,1.14); c=c*c*(3.-2.*c)*.3+c*.7; vec2 d=vUv-.5; c*=1.-dot(d*vec2(1.,.6),d*vec2(1.,.6))*.45; c+=(h(vUv*vec2(1080.,1920.)+time)-.5)*.022; gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  // ---------- contorno de tinta en el 3D ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o === sky || o.userData.noInk || (o.material && o.material.transparent)) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'CircleGeometry' || ty === 'BufferGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  // ---------- API ----------
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; updCrowd(); }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { updCrowd(); if (FAST) R.render(scene, camera); else comp.render(); }
  const CLOUDS = []; scene.children.forEach(o => { if (o.isGroup && o.children.length === 7 && o.position.y > 80) CLOUDS.push([o, o.position.clone()]); });
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; crowdT = t; setTimeRoom(t); CLOUDS.forEach(([o, p0]) => o.position.x = p0.x + t * 1.1);
    SMOKE.forEach(([m, x, h, z, ph, r]) => { const k = (t * .1 + ph) % 1, big = r > 1; m.position.set(x + k * (big ? 14 : 4) + Math.sin(k * 6 + ph * 9) * r, h + k * (big ? 22 : 5), z - k * 3); const sz = (big ? 9 : 2.4) * (.5 + k * 1.8); m.scale.set(sz, sz, 1); m.material.opacity = .75 * Math.sin(Math.min(1, k * 1.15) * Math.PI) ** .7; }); }
  let splitX = null; function setCheer(k, sx = null) { cheerK = k; splitX = sx; }   // sx: solo celebran los asientos con x < sx
  let mood = 0; const SUN_DAY = SUN.clone(), SUN_EVE = new T.Vector3(.72, .26, .64).normalize();
  function setMood(m) { mood = m; const room = m === 2, e = room ? 0 : m; SUN.copy(SUN_DAY).lerp(SUN_EVE, e).normalize(); sky.material.uniforms.morn.value = e; sky.material.uniforms.night.value = room ? 1 : 0; gradeMat.uniforms.morn.value = room ? .5 : e;
    sun.color.set(e > .5 ? '#ffb878' : '#fff0d6'); sun.intensity = room ? 0 : 4.5 - e * .5; hemi.intensity = room ? .55 : 1.5; hemi.color.set(room ? '#6a78a8' : e > .5 ? '#ffc8b0' : '#d6e6ff'); hemi.groundColor.set(room ? '#3a2a20' : e > .5 ? '#6a5a44' : '#6f7f48');
    scene.fog.color.set(room ? '#16141c' : e > .5 ? '#f0c0a0' : '#d6dfe6'); R.toneMappingExposure = room ? 1.25 : 1.2 - e * .06; lampL.visible = fillL.visible = room; lampL.intensity = room ? 26 : 0; fillL.intensity = room ? 7 : 0; bloom.strength = room ? .5 : .2; }
  function setTimeRoom(t) { flame.scale.set(1 + Math.sin(t * 17) * .08, 1.9 + Math.sin(t * 23) * .2, 1); if (lampL.visible) lampL.intensity = 26 + Math.sin(t * 19) * 1.2 + Math.sin(t * 7.3) * .8; }
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  const hgt = () => 0;
  return { T, scene, camera, R, setCam, setTime, setMood, setCheer, hideSeats, visible, proj, render, SUN, hgt, GOAL, NET, setNet, netLines, netMesh, BALL, ball, crowd, SEATS, setYear, CRATE, OX, CHAIR, BIN, plan, paper, dof, bloom, comp, inkM };
})();

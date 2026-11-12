// World «Estadio de 1889» (Liverpool): campo de hierba con barro y líneas de tiza, porterías de madera blanca (sin red o con la red de Brodie,
// que se deforma cuando entra el balón), valla blanca, gradas de madera llenas de público (sprites), grada cubierta con tejado y banderines,
// casas de ladrillo adosadas con chimeneas humeando, fábricas, campanario, cielo azul con nubes. Misma API que world_kenji.js (W2).
// Campo: x ∈ [-34, 34], z ∈ [-52, 52]. Portería protagonista en z = -52 (postes en x = ±3.66, larguero a 2.44 m). La red va hacia z < -52.
window.GLC = document.getElementById("gl");
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
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
  const sky = new T.Mesh(new T.SphereGeometry(2000, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: SUN }, morn: { value: 0 } },
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 sun; uniform float morn; varying vec3 vd; void main(){ float h=vd.y; vec3 top=mix(vec3(.15,.42,.86),vec3(.36,.36,.62),morn), mid=mix(vec3(.46,.7,.95),vec3(.96,.62,.46),morn), hor=mix(vec3(.86,.9,.92),vec3(1.,.8,.58),morn); vec3 c=h>.08?mix(mid,top,smoothstep(.08,.65,h)):mix(hor,mid,smoothstep(-.05,.08,h)); float s=max(dot(vd,sun),0.); c+=vec3(1.,.9,.7)*(pow(s,10.)*(.18+morn*.35)); gl_FragColor=vec4(c,1.); }' }));
  sky.frustumCulled = false; scene.add(sky);
  scene.fog = new T.FogExp2('#d6dfe6', .0046);
  const hemi = new T.HemisphereLight('#d6e6ff', '#6f7f48', 1.5); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff0d6', 4.5); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
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
    for (let v = 0; v < N; v++) [0, 1].forEach(ch => { const mat = new T.MeshBasicMaterial({ map: texs[v + ch * N], alphaTest: .5, side: T.DoubleSide, color: '#e6e2dc' }); const im = new T.InstancedMesh(geo, mat, per[v].length); im.userData = { v, ch, seats: per[v] }; im.frustumCulled = false; scene.add(im); CROWD.meshes.push(im); }); return Promise.all(proms); }
  let cheerK = 0, crowdT = 0;
  function updCrowd() { if (!CROWD.meshes.length) return; const dm = new T.Object3D(), yaw = Math.atan2(camera.position.x, camera.position.z);
    CROWD.meshes.forEach(im => { const { ch, seats } = im.userData; seats.forEach((s, i) => { const ph = (s[0] * 1.7 + s[2] * 2.3) % 6.28, me = hsh(s[0], s[2]) < cheerK; const show = ch ? me : !me;
      const bob = ch ? Math.abs(Math.sin(crowdT * 9 + ph)) * .12 : Math.sin(crowdT * 2.2 + ph) * .02; const yawI = Math.atan2(camera.position.x - s[0], camera.position.z - s[2]);
      dm.position.set(s[0], s[1] - .05 + bob, s[2]); dm.rotation.set(0, yawI, 0); const sc = show ? .92 + hsh(s[2], s[0]) * .16 : 0; dm.scale.set(sc, sc, sc); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); }); im.instanceMatrix.needsUpdate = true; }); }
  const hsh = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
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
  function render() { updCrowd(); comp.render(); }
  const CLOUDS = []; scene.children.forEach(o => { if (o.isGroup && o.children.length === 7 && o.position.y > 80) CLOUDS.push([o, o.position.clone()]); });
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; crowdT = t; CLOUDS.forEach(([o, p0]) => o.position.x = p0.x + t * 1.1);
    SMOKE.forEach(([m, x, h, z, ph, r]) => { const k = (t * .1 + ph) % 1, big = r > 1; m.position.set(x + k * (big ? 14 : 4) + Math.sin(k * 6 + ph * 9) * r, h + k * (big ? 22 : 5), z - k * 3); const sz = (big ? 9 : 2.4) * (.5 + k * 1.8); m.scale.set(sz, sz, 1); m.material.opacity = .75 * Math.sin(Math.min(1, k * 1.15) * Math.PI) ** .7; }); }
  function setCheer(k) { cheerK = k; }
  let mood = 0; const SUN_DAY = SUN.clone(), SUN_EVE = new T.Vector3(.7, .22, -.68).normalize();
  function setMood(m) { mood = m; SUN.copy(SUN_DAY).lerp(SUN_EVE, m).normalize(); sky.material.uniforms.morn.value = m; gradeMat.uniforms.morn.value = m; sun.color.set(m > .5 ? '#ffc890' : '#fff0d6'); sun.intensity = 4.5 - m * .6;
    hemi.color.set(m > .5 ? '#ffd2b8' : '#d6e6ff'); hemi.groundColor.set(m > .5 ? '#6a5a44' : '#6f7f48'); scene.fog.color.set(m > .5 ? '#f0c8a8' : '#d6dfe6'); R.toneMappingExposure = 1.2 - m * .06; }
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  const hgt = () => 0;
  return { T, scene, camera, R, setCam, setTime, setMood, setCheer, visible, proj, render, SUN, hgt, GOAL, NET, setNet, BALL, ball, crowd, SEATS, dof, bloom, comp, inkM };
})();

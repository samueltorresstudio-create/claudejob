// World v2: textured (PBR-lite) city court with soft sun, AO, bloom, depth of field and haze. Full-frame 1080x1920.
window.GLC = document.getElementById("gl");
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false);
  R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.25; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, W / H, .05, 1500);
  const rnd = (() => { let s = 777; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  // ---------- canvas textures ----------
  const tex = (w, h, draw, rep, srgb = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new T.CanvasTexture(c); if (srgb) t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const noise = (g, w, h, n, cols, sz = [1, 3]) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const s = sz[0] + rnd() * (sz[1] - sz[0]); g.fillRect(rnd() * w, rnd() * h, s, s); } };
  const blot = (g, w, h, n, col, r0, r1) => { for (let i = 0; i < n; i++) { const x = rnd() * w, y = rnd() * h, r = r0 + rnd() * (r1 - r0); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); } };
  let _emWin = [];
  const brickWall = (base, mort, win) => { _emWin = []; const t = tex(512, 512, (g, w, h) => { g.fillStyle = mort; g.fillRect(0, 0, w, h);
      const bh = 16, bw = 46; for (let y = 0; y < h; y += bh) for (let x = -((y / bh) % 2) * bw / 2; x < w; x += bw) { const v = (rnd() - .5) * 26; g.fillStyle = shade(base, v); g.fillRect(x + 2, y + 2, bw - 3, bh - 3); }
      blot(g, w, h, 30, 'rgba(0,0,0,.10)', 20, 70); blot(g, w, h, 20, 'rgba(255,255,255,.07)', 20, 60);
      if (win) { // one storey (3.2 m) = 512 px tall, two windows per tile
        [[90, 120], [300, 120]].forEach(([x, y]) => { g.fillStyle = '#e9e1d2'; g.fillRect(x - 10, y - 10, 142, 222); g.fillStyle = '#2a3b52';
          const gr = g.createLinearGradient(x, y, x + 122, y + 202); gr.addColorStop(0, '#7fa4c8'); gr.addColorStop(.45, '#2c4462'); gr.addColorStop(1, '#1d2c40'); g.fillStyle = gr; g.fillRect(x, y, 122, 202);
          g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.moveTo(x, y + 150); g.lineTo(x + 90, y); g.lineTo(x + 115, y); g.lineTo(x, y + 190); g.fill();
          g.fillStyle = '#e9e1d2'; g.fillRect(x + 58, y, 6, 202); g.fillRect(x, y + 95, 122, 6); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x - 14, y + 212, 150, 10);
          if (rnd() > .5) { g.fillStyle = rnd() > .5 ? '#c96b5a' : '#e7d7a8'; g.fillRect(x + 4, y + 4, 40, 190); } _emWin.push([x, y, rnd()]); }); } }, null);
    t.userData.em = tex(512, 512, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); _emWin.forEach(([x, y, r]) => { if (r > .45) { g.fillStyle = r > .8 ? '#ffb46a' : '#ffe2a0'; g.fillRect(x, y, 122, 202); } }); }); return t; };
  const shade = (hex, v) => { const c = new T.Color(hex); c.offsetHSL(0, 0, v / 255); return '#' + c.getHexString(); };
  const courtT = tex(1024, 1920, (g, w, h) => { const k = w / 15;
    g.fillStyle = '#2e8f6c'; g.fillRect(0, 0, w, h); g.fillStyle = '#2d6fbf'; g.fillRect(.6 * k, .6 * k, w - 1.2 * k, h - 1.2 * k);
    g.fillStyle = '#e66f2c'; g.fillRect(w / 2 - 2.45 * k, .6 * k, 4.9 * k, 5.8 * k); g.fillRect(w / 2 - 2.45 * k, h - .6 * k - 5.8 * k, 4.9 * k, 5.8 * k);
    g.strokeStyle = '#f4f1ea'; g.lineWidth = .08 * k; g.strokeRect(.6 * k, .6 * k, w - 1.2 * k, h - 1.2 * k);
    g.beginPath(); g.moveTo(.6 * k, h / 2); g.lineTo(w - .6 * k, h / 2); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 1.8 * k, 0, 7); g.stroke();
    [0, 1].forEach(e => { const by = e ? h - .6 * k : .6 * k, s = e ? -1 : 1; g.strokeRect(w / 2 - 2.45 * k, e ? by - 5.8 * k : by, 4.9 * k, 5.8 * k); g.beginPath(); g.arc(w / 2, by + s * 5.8 * k, 1.8 * k, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(w / 2 - 6.6 * k, by); g.lineTo(w / 2 - 6.6 * k, by + s * 1.6 * k); g.arc(w / 2, by + s * 1.575 * k, 6.75 * k, e ? Math.PI + .2 : Math.PI - .2, e ? -.2 : .2, !e); g.lineTo(w / 2 + 6.6 * k, by); g.stroke(); });
    noise(g, w, h, 30000, ['rgba(255,255,255,.05)', 'rgba(0,0,0,.07)'], [1, 3]); blot(g, w, h, 60, 'rgba(0,0,0,.08)', 20, 90); blot(g, w, h, 40, 'rgba(255,255,255,.06)', 30, 120);
    g.strokeStyle = 'rgba(20,30,40,.35)'; g.lineWidth = 2; for (let i = 0; i < 14; i++) { let x = rnd() * w, y = rnd() * h; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 8; j++) { x += (rnd() - .5) * 60; y += rnd() * 40; g.lineTo(x, y); } g.stroke(); } });
  const asphaltT = tex(512, 512, (g, w, h) => { g.fillStyle = '#7c7f86'; g.fillRect(0, 0, w, h); noise(g, w, h, 26000, ['#6a6d74', '#8f9299', '#5d6067', '#a3a6ad'], [1, 3]); blot(g, w, h, 40, 'rgba(0,0,0,.12)', 20, 80); }, [70, 70]);
  const pavT = tex(512, 512, (g, w, h) => { g.fillStyle = '#cfc5b3'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 128) for (let x = 0; x < w; x += 128) { g.fillStyle = shade('#cfc5b3', (rnd() - .5) * 20); g.fillRect(x + 3, y + 3, 122, 122); }
    noise(g, w, h, 9000, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.08)']); blot(g, w, h, 20, 'rgba(0,0,0,.1)', 20, 60); }, [12, 18]);
  const grassT = tex(512, 512, (g, w, h) => { g.fillStyle = '#6aa548'; g.fillRect(0, 0, w, h); noise(g, w, h, 30000, ['#5b9440', '#7fbb57', '#4f8436', '#8fc865'], [1, 4]); blot(g, w, h, 30, 'rgba(0,0,0,.08)', 30, 90); }, [20, 20]);
  const fenceT = tex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(190,196,204,1)'; g.lineWidth = 2.4; for (let i = -2; i < 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64 + 128, 128); g.moveTo(i * 64 + 128, 0); g.lineTo(i * 64, 128); g.stroke(); } }, [44, 3]);
  const ballT = tex(256, 128, (g, w, h) => { g.fillStyle = '#e2702a'; g.fillRect(0, 0, w, h); noise(g, w, h, 6000, ['rgba(0,0,0,.12)', 'rgba(255,255,255,.08)'], [1, 2]); g.strokeStyle = '#2a1408'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.moveTo(w / 4, 0); g.lineTo(w / 4, h); g.moveTo(3 * w / 4, 0); g.lineTo(3 * w / 4, h); g.stroke(); g.beginPath(); g.ellipse(w / 2, h / 2, 34, h / 2, 0, 0, 7); g.stroke(); });
  const STD = (o) => new T.MeshStandardMaterial(Object.assign({ roughness: .85, metalness: 0 }, o));
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; m.castShadow = o.cast !== false; m.receiveShadow = true; (o.parent || scene).add(m); return m; };
  // ---------- sky + light ----------
  const sky = new T.Mesh(new T.SphereGeometry(900, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { sun: { value: new T.Vector3(-.5, .42, -.75).normalize() }, night: { value: 0 } },
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 sun; uniform float night; varying vec3 vd; void main(){ float h=vd.y; vec3 top=mix(vec3(.1,.36,.86),vec3(.02,.03,.1),night), mid=mix(vec3(.42,.68,.96),vec3(.07,.06,.2),night), hor=mix(vec3(1.,.84,.62),vec3(.45,.16,.42),night); vec3 c=h>.15?mix(mid,top,smoothstep(.15,.8,h)):mix(hor,mid,smoothstep(-.05,.15,h)); float s=max(dot(vd,sun),0.); c+=(1.-night)*vec3(1.,.8,.55)*(pow(s,12.)*.35+pow(s,400.)*3.); float st=step(.9985,fract(sin(dot(floor(vd*420.),vec3(12.9,78.2,37.7)))*43758.5))*night*step(.05,h); c+=vec3(st); gl_FragColor=vec4(c,1.); }' }));
  sky.frustumCulled = false; scene.add(sky);
  scene.fog = new T.FogExp2('#cfdcea', .0055);
  const hemi = new T.HemisphereLight('#bcdcff', '#b89a78', 1.6); scene.add(hemi);
  const sun = new T.DirectionalLight('#ffdcae', 5.2); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  const sc = sun.shadow.camera; sc.left = -30; sc.right = 30; sc.top = 30; sc.bottom = -30; sc.near = 1; sc.far = 260; sun.shadow.bias = -.0004; sun.shadow.normalBias = .04; sun.shadow.radius = 4; scene.add(sun, sun.target);
  const SUN = new T.Vector3(-55, 62, -75).normalize();
  // clouds: soft puffs
  const cloudM = STD({ color: '#ffffff', roughness: 1, emissive: '#6d7f99', emissiveIntensity: .25 });
  for (let i = 0; i < 16; i++) { const g = new T.Group(), a = i / 16 * Math.PI * 2 + .3, r = 240 + (i % 3) * 70; g.position.set(Math.cos(a) * r, 80 + (i % 4) * 20, Math.sin(a) * r); scene.add(g);
    for (let k = 0; k < 6; k++) { const m = add(new T.SphereGeometry(10 + (k % 3) * 6, 18, 12), cloudM, (k - 2.5) * 11, (k % 2) * 6 - 3, (k % 3) * 5, { parent: g, cast: false }); m.scale.y = .7; } }
  // ---------- ground ----------
  add(new T.PlaneGeometry(900, 900), STD({ map: asphaltT }), 0, 0, 0, { rx: -Math.PI / 2, cast: false });
  add(new T.PlaneGeometry(24, 38), STD({ map: pavT }), 0, .005, 0, { rx: -Math.PI / 2, cast: false });
  add(new T.PlaneGeometry(15, 28), STD({ map: courtT, roughness: .7 }), 0, .012, 0, { rx: -Math.PI / 2, cast: false });
  add(new T.PlaneGeometry(40, 70), STD({ map: grassT }), -34, .008, 0, { rx: -Math.PI / 2, cast: false });
  // ---------- hoop ----------
  const HOOP = { rim: new T.Vector3(0, 3.05, -12.42), poleZ: -14.9, board: -12.8 };
  const steel = STD({ color: '#8f98a3', metalness: .6, roughness: .45 }), padM = STD({ color: '#1f4f9a', roughness: .7 }), white = STD({ color: '#f2efe8', roughness: .6 });
  add(new T.CylinderGeometry(.11, .13, 4.1, 20), steel, 0, 2.05, HOOP.poleZ); add(new T.CylinderGeometry(.21, .21, 1.9, 24), padM, 0, .95, HOOP.poleZ);
  add(new T.BoxGeometry(.16, .16, 2.1), steel, 0, 3.75, (HOOP.poleZ + HOOP.board) / 2 - .05); add(new T.BoxGeometry(.12, .9, .12), steel, 0, 3.4, HOOP.board - .12);
  add(new RoundedBoxGeometry(1.8, 1.05, .06, 3, .02), STD({ color: '#f2f2f0', roughness: .3 }), 0, 3.5, HOOP.board);
  const lineM = STD({ color: '#d63c2f' }); [[0, 3.31 + .225, .59, .05], [0, 3.31 - .225, .59, .05], [-.27, 3.31, .05, .5], [.27, 3.31, .05, .5]].forEach(([x, y, w, h]) => add(new T.BoxGeometry(w, h, .07), lineM, x, y, HOOP.board + .005));
  add(new T.TorusGeometry(.23, .018, 12, 48), STD({ color: '#e5602a', metalness: .3, roughness: .5 }), 0, 3.05, HOOP.rim.z, { rx: Math.PI / 2 });
  const netG = new T.BufferGeometry(), NP = new Float32Array(12 * 4 * 12); netG.setAttribute('position', new T.BufferAttribute(NP, 3));
  const net = new T.LineSegments(netG, new T.LineBasicMaterial({ color: '#f4f1ea' })); net.frustumCulled = false; scene.add(net);
  function setNet(t, lift) { let k = 0; const P = (i, r) => { const a = i / 12 * Math.PI * 2 + (r % 2) * Math.PI / 12, rr = .23 - r * .022 + lift * r * .012, dy = -r * .1 * (1 - lift * .9) + lift * r * .02; return [Math.cos(a) * rr + Math.sin(t * 2 + i) * .01 * r, 3.05 + dy, HOOP.rim.z + Math.sin(a) * rr]; };
    for (let r = 0; r < 4; r++) for (let i = 0; i < 12; i++) { if (k + 12 > NP.length) break; const a = P(i, r), b = P(i, r + 1), c = P(i + 1, r + 1); NP.set(a, k); NP.set(b, k + 3); NP.set(a, k + 6); NP.set(c, k + 9); k += 12; } netG.attributes.position.needsUpdate = true; }
  // ---------- fence, benches, lamps, props ----------
  const fenceM = new T.MeshStandardMaterial({ map: fenceT, transparent: true, alphaTest: .35, side: T.DoubleSide, metalness: .5, roughness: .5 });
  [[-10, 0, 36, Math.PI / 2], [10, 0, 36, Math.PI / 2], [0, -18, 20, 0], [0, 18, 20, 0]].forEach(([x, z, len, ry]) => { add(new T.PlaneGeometry(len, 4), fenceM, x, 2, z, { ry });
    for (let i = 0; i <= len / 4; i++) { const u = -len / 2 + i * 4; add(new T.CylinderGeometry(.05, .05, 4.1, 10), steel, x + (ry ? 0 : u), 2.05, z + (ry ? u : 0)); }
    add(new T.CylinderGeometry(.04, .04, len, 8), steel, x, 4.05, z, ry ? { rx: Math.PI / 2 } : { rz: Math.PI / 2 }); });
  const wood = STD({ color: '#a8743f', roughness: .8 }), dark = STD({ color: '#2b2e36', metalness: .4, roughness: .5 });
  [[-8.6, -6], [-8.6, 4]].forEach(([x, z]) => { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = Math.PI / 2; scene.add(g); for (let k = 0; k < 3; k++) add(new T.BoxGeometry(2.2, .05, .14), wood, 0, .5, -.18 + k * .17, { parent: g });
    for (let k = 0; k < 2; k++) add(new T.BoxGeometry(2.2, .14, .05), wood, 0, .75 + k * .18, -.26, { parent: g }); [-1, 1].forEach(s => add(new T.BoxGeometry(.06, .5, .5), dark, s * .95, .25, 0, { parent: g })); });
  [[-10.6, -10], [-10.6, 10], [10.6, -10], [10.6, 10]].forEach(([x, z]) => { add(new T.CylinderGeometry(.07, .1, 7, 12), dark, x, 3.5, z); add(new T.BoxGeometry(.9, .14, .3), dark, x + .4, 7, z); add(new T.BoxGeometry(.6, .05, .22), STD({ color: '#fff4c8', emissive: '#fff0c0', emissiveIntensity: .6 }), x + .5, 6.92, z); });
  const FLOAT = []; const floater = (m, p, v, spin) => { m.userData.f = { p: new T.Vector3(...p), v: new T.Vector3(...v), spin }; FLOAT.push(m); return m; };
  floater(add(new T.CylinderGeometry(.04, .04, .24, 16), STD({ color: '#5fb7e6', roughness: .2, transparent: true, opacity: .85 }), 0, 0, 0), [1.25, .12, -13.75], [.03, .16, .02], [.6, .2, .3]);
  floater(add(new RoundedBoxGeometry(.34, .42, .2, 3, .05), STD({ color: '#c23b3b' }), 0, 0, 0), [-1.7, .21, -15.7], [-.02, .1, .02], [.1, .3, .05]);
  const leafM = [STD({ color: '#7fb456', side: T.DoubleSide }), STD({ color: '#d99a3c', side: T.DoubleSide })];
  for (let i = 0; i < 40; i++) floater(add(new T.PlaneGeometry(.12, .07), leafM[i % 2], 0, 0, 0, { cast: false }), [-12 + rnd() * 24, .02 + rnd() * .3, -18 + rnd() * 30], [(rnd() - .5) * .3, .05 + rnd() * .25, (rnd() - .5) * .3], [rnd() * 2, rnd() * 2, rnd() * 2]);
  // ---------- trees ----------
  const leafCol = ['#4f8f3a', '#5fa346', '#3f7f33'], trunkM = STD({ color: '#6e4a2c' });
  const tree = (x, z, s = 1) => { const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g); add(new T.CylinderGeometry(.18, .28, 3.2, 10), trunkM, 0, 1.6, 0, { parent: g });
    for (let k = 0; k < 7; k++) { const r = .9 + rnd() * .8; add(new T.IcosahedronGeometry(r, 3), STD({ color: leafCol[k % 3], roughness: .95 }), (rnd() - .5) * 2.2, 3.4 + rnd() * 1.6, (rnd() - .5) * 2.2, { parent: g }); } };
  [[-14, -14], [-16, -4], [-14, 6], [-17, 15], [-24, -10], [-27, 4], [-22, 18], [12.2, 22], [13, -24]].forEach(([x, z], i) => tree(x, z, .95 + (i % 3) * .15));
  // ---------- buildings (brick, windows per storey) ----------
  const WINM = [];
  const BPAL = [['#b5603f', '#d8cbb8'], ['#c99a6a', '#e3d6c1'], ['#8f4e3a', '#cfc2ae'], ['#d1b48a', '#efe4d0'], ['#a7a39b', '#dad6cf']];
  const building = (x, z, w, d, floors, pi, balc) => { const [b, m] = BPAL[pi % BPAL.length], hgt = floors * 3.2; const t = brickWall(b, m, true); t.repeat.set(Math.max(1, Math.round(w / 6.2)), floors);
    const t2 = t.clone(); t2.repeat.set(Math.max(1, Math.round(d / 6.2)), floors); t2.needsUpdate = true;
    const em2 = t.userData.em.clone(); em2.repeat.copy(t2.repeat); em2.needsUpdate = true; t.userData.em.repeat.copy(t.repeat);
    const mat = STD({ map: t, roughness: .9, emissiveMap: t.userData.em, emissive: '#ffd08a', emissiveIntensity: 0 }), mat2 = STD({ map: t2, roughness: .9, emissiveMap: em2, emissive: '#ffd08a', emissiveIntensity: 0 }), roof = STD({ color: '#6b6460' }); WINM.push(mat, mat2);
    add(new T.BoxGeometry(w, hgt, d), [mat2, mat2, roof, roof, mat, mat], x, hgt / 2, z);
    add(new T.BoxGeometry(w + .5, .45, d + .5), STD({ color: m }), x, hgt + .22, z); add(new T.BoxGeometry(w + .2, .25, d + .2), STD({ color: m }), x, 3.2, z);
    add(new T.CylinderGeometry(1, 1, 1.8, 16), STD({ color: '#8b8f96', metalness: .5, roughness: .5 }), x - w * .25, hgt + 1.35, z); add(new T.BoxGeometry(1.4, .9, 1), STD({ color: '#d8d8d4' }), x + w * .2, hgt + .9, z - d * .2);
    if (balc) for (let f = 1; f < floors; f++) for (let k = 0; k < Math.round(w / 6.2); k++) { const u = -w / 2 + (k + .5) * (w / Math.round(w / 6.2)); const bz = z + d / 2 + .45;
      add(new T.BoxGeometry(2.6, .12, .9), STD({ color: '#d9d2c4' }), x + u, f * 3.2, bz); add(new T.BoxGeometry(2.6, .9, .05), dark, x + u, f * 3.2 + .5, bz + .45);
      if ((f + k) % 3 === 0) add(new T.IcosahedronGeometry(.32, 2), STD({ color: '#4f8f3a' }), x + u - .8, f * 3.2 + .4, bz); } };
  building(2, -34, 26, 10, 10, 1, true); building(-24, -36, 14, 12, 6, 0); building(24, -38, 14, 14, 8, 2);
  building(-34, 32, 16, 12, 7, 3); building(-8, 38, 18, 10, 5, 4); building(16, 40, 14, 12, 9, 0); building(-50, -8, 12, 22, 5, 2); building(34, -8, 10, 30, 6, 3);
  for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2, r = 120 + (i % 4) * 22; building(Math.cos(a) * r, Math.sin(a) * r, 16 + (i % 3) * 6, 16, 6 + (i * 7) % 12, i); }
  // ---------- light shafts (fake volumetrics) ----------
  const shaftT = tex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,240,210,0)'); gr.addColorStop(.25, 'rgba(255,240,210,.55)'); gr.addColorStop(1, 'rgba(255,240,210,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const g2 = g.createLinearGradient(0, 0, w, 0); g2.addColorStop(0, 'rgba(0,0,0,1)'); g2.addColorStop(.5, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = g2; g.fillRect(0, 0, w, h); });
  const shaftM = new T.MeshBasicMaterial({ map: shaftT, transparent: true, opacity: .22, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false });
  for (let i = 0; i < 7; i++) { const s = add(new T.PlaneGeometry(3 + rnd() * 3, 60), shaftM, -12 + i * 4 + rnd() * 2, 22, -24 + rnd() * 6, { cast: false }); s.lookAt(s.position.clone().add(SUN)); s.rotateX(Math.PI / 2); s.rotation.z += .0; s.receiveShadow = false; }
  // ---------- ball ----------
  const BALL = add(new T.SphereGeometry(.12, 32, 20), STD({ map: ballT, roughness: .75 }), 0, -5, 0);
  // ---------- post: AO + bloom + DOF ----------
  const comp = new EffectComposer(R); comp.setSize(W, H);
  comp.addPass(new RenderPass(scene, camera));
  const ao = new GTAOPass(scene, camera, W, H); ao.blendIntensity = .85; ao.updateGtaoMaterial({ radius: .6, distanceExponent: 1.5, thickness: 1 }); comp.addPass(ao);
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .32, .55, .88); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 5, aperture: .0035, maxblur: .006 }); comp.addPass(dof);
  comp.addPass(new OutputPass()); ao.enabled = false;
  // ---------- neon signs (glow at night) ----------
  const neon = []; const sign = (x, y, z, w, h, col, ry = 0) => { const m = add(new RoundedBoxGeometry(w, h, .12, 3, .05), STD({ color: '#2a2230', emissive: col, emissiveIntensity: 0 }), x, y, z, { ry, cast: false }); neon.push(m); return m; };
  sign(-4.5, 7.5, -28.6, 5, .9, '#ff3fb4'); sign(6.5, 10.5, -28.6, .9, 4.5, '#38e8ff'); sign(9.5, 6.2, -28.6, 3.4, .7, '#ffd34a'); sign(-27.2, 9, -12, .8, 4, '#a46bff', Math.PI / 2);
  const PL = [['#ff3fb4', -6, 5, -16, 0], ['#38e8ff', 7, 6, -14, 0], ['#ffc76a', -10.2, 6.8, -10, 0], ['#ffc76a', -10.2, 6.8, 10, 0], ['#ffc76a', 10.9, 6.8, -10, 0], ['#ffc76a', 10.9, 6.8, 10, 0]].map(([c, x, y, z]) => { const l = new T.PointLight(c, 0, 26, 1.6); l.position.set(x, y, z); scene.add(l); return l; });
  // ---------- ink outlines on the 3D (inverted hull, constant screen width) ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (o.isMesh && o !== sky && !o.material.transparent && !Array.isArray(o.material) || (o.isMesh && Array.isArray(o.material))) { const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'CircleGeometry' || o.userData.noInk) return; toInk.push(o); } });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  function setNight(on) { sky.material.uniforms.night.value = on ? 1 : 0; sun.intensity = on ? .5 : 5.2; sun.color.set(on ? '#8f9cff' : '#ffdcae'); hemi.color.set(on ? '#5a4fb8' : '#bcdcff'); hemi.groundColor.set(on ? '#2a1438' : '#b89a78'); hemi.intensity = on ? .9 : 1.6;
    scene.fog.color.set(on ? '#1d1840' : '#cfdcea'); scene.fog.density = on ? .0055 : .0055; WINM.forEach(m => m.emissiveIntensity = on ? 1.6 : 0); neon.forEach(m => m.material.emissiveIntensity = on ? 3.2 : 0);
    PL.forEach((l, i) => l.intensity = on ? (i < 2 ? 160 : 70) : 0); bloom.strength = on ? .55 : .32; bloom.threshold = on ? .72 : .88; R.toneMappingExposure = on ? 1.1 : 1.25; }
  // ---------- API ----------
  function setCam(pos, look, fov = 45, focus = null, ap = .0035) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    sun.position.copy(look).addScaledVector(SUN, 100); sun.target.position.copy(look); sun.target.updateMatrixWorld();
    dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function floaters(g) { const gg = Math.max(0, Math.min(10, g)); FLOAT.forEach(m => { const f = m.userData.f; m.position.copy(f.p).addScaledVector(f.v, gg); m.rotation.set(f.spin[0] * gg, f.spin[1] * gg, f.spin[2] * gg); }); }
  function render() { comp.render(); }
  return { T, scene, camera, R, setCam, proj, render, floaters, setNet, BALL, HOOP, SUN, ao, dof, bloom, comp, setNight, inkM };
})();

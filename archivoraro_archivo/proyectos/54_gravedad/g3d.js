// 3D world for «10 segundos sin gravedad»: toon-shaded city court + street + café + country road, rendered with three.js
// under the SVG layer. Characters stay 2D (channel style) and are placed with G3.proj().
window.GLC = document.getElementById('gl');
const G3 = (() => {
  let W = 1080, H = 1100;
  const R = new THREE.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false);
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  R.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 1500);
  const effect = new OutlineEffect(R, { defaultThickness: 0.0042, defaultColor: [0.09, 0.08, 0.13], defaultAlpha: 1 });
  // 3-step toon ramp
  const gm = new THREE.DataTexture(new Uint8Array([105, 105, 105, 255, 185, 185, 185, 255, 255, 255, 255, 255]), 3, 1);
  gm.minFilter = gm.magFilter = THREE.NearestFilter; gm.needsUpdate = true;
  const M = (col, o = {}) => new THREE.MeshToonMaterial(Object.assign({ color: col, gradientMap: gm }, o));
  const noLine = m => { m.userData.outlineParameters = { visible: false }; return m; };
  const thin = (m, k) => { m.userData.outlineParameters = { thickness: k }; return m; };
  const tex = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
    if (o.ry) m.rotation.y = o.ry; if (o.rx) m.rotation.x = o.rx; if (o.rz) m.rotation.z = o.rz;
    m.castShadow = o.cast !== false; m.receiveShadow = o.recv !== false; (o.parent || scene).add(m); return m; };
  const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const rbox = (w, h, d, r) => new RoundedBoxGeometry(w, h, d, 3, r);
  const cyl = (r1, r2, h, n = 20) => new THREE.CylinderGeometry(r1, r2, h, n);
  const sph = (r, n = 20) => new THREE.SphereGeometry(r, n, Math.round(n * .7));
  const rnd = (() => { let s = 12345; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

  // ---------- sky, sun, fog ----------
  const SKY = { top: new THREE.Color('#3f86d8'), mid: new THREE.Color('#8fc2ee'), hor: new THREE.Color('#ffd9a6') };
  const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: SKY.top }, mid: { value: SKY.mid }, hor: { value: SKY.hor }, sun: { value: new THREE.Vector3(-.55, .45, -.7).normalize() } },
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top,mid,hor,sun; varying vec3 vd; void main(){ float h=vd.y; vec3 c=h>0.18?mix(mid,top,smoothstep(.18,.75,h)):mix(hor,mid,smoothstep(-.02,.18,h)); float s=max(dot(vd,sun),0.); c+=vec3(1.,.85,.6)*(pow(s,40.)*.6+pow(s,600.)*1.5); gl_FragColor=vec4(c,1.);\n#include <colorspace_fragment>\n}' });
  noLine(skyMat);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), skyMat); sky.frustumCulled = false; scene.add(sky);
  scene.fog = new THREE.Fog('#f2d8b6', 90, 520);
  const hemi = new THREE.HemisphereLight('#d8ecff', '#a08a72', 1.25); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff0d2', 2.6); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); const sc = sun.shadow.camera; sc.left = -26; sc.right = 26; sc.top = 26; sc.bottom = -26; sc.near = 1; sc.far = 220;
  sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03; scene.add(sun); scene.add(sun.target);
  const SUNDIR = new THREE.Vector3(-55, 70, -60).normalize();

  // ---------- textures ----------
  const courtTex = tex(1024, 1920, (g, w, h) => { const k = w / 15; // 15 x 28 m
    g.fillStyle = '#2f9a74'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2f6fbf'; g.fillRect(.6 * k, .6 * k, w - 1.2 * k, h - 1.2 * k);
    g.fillStyle = '#e9772f'; [[0, 1], [1, -1]].forEach(([e, d]) => { const y0 = e ? h - .6 * k - 5.8 * k : .6 * k; g.fillRect(w / 2 - 2.45 * k, y0, 4.9 * k, 5.8 * k); });
    g.strokeStyle = '#ffffff'; g.lineWidth = .09 * k;
    g.strokeRect(.6 * k, .6 * k, w - 1.2 * k, h - 1.2 * k);
    g.beginPath(); g.moveTo(.6 * k, h / 2); g.lineTo(w - .6 * k, h / 2); g.stroke();
    g.beginPath(); g.arc(w / 2, h / 2, 1.8 * k, 0, 7); g.stroke();
    [0, 1].forEach(e => { const by = e ? h - .6 * k : .6 * k, s = e ? -1 : 1;
      g.strokeRect(w / 2 - 2.45 * k, e ? by - 5.8 * k : by, 4.9 * k, 5.8 * k);
      g.beginPath(); g.arc(w / 2, by + s * 5.8 * k, 1.8 * k, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(w / 2 - 6.6 * k, by); g.lineTo(w / 2 - 6.6 * k, by + s * 1.6 * k);
      g.arc(w / 2, by + s * 1.575 * k, 6.75 * k, e ? Math.PI + .2 : Math.PI - .2, e ? -.2 : .2, !e); g.lineTo(w / 2 + 6.6 * k, by); g.stroke(); });
    g.globalAlpha = .07; for (let i = 0; i < 900; i++) { g.fillStyle = i % 2 ? '#fff' : '#000'; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); } g.globalAlpha = 1;
    g.fillStyle = 'rgba(255,255,255,.85)'; g.font = `900 ${1.2 * k}px Inter`; g.textAlign = 'center'; g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2); g.globalAlpha = .0; g.restore(); });
  const asphalt = tex(256, 256, (g, w, h) => { g.fillStyle = '#7d8189'; g.fillRect(0, 0, w, h); for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${i % 3 ? 0 : 255},${i % 3 ? 0 : 255},${i % 3 ? 0 : 255},.08)`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }, [60, 60]);
  const tiles = tex(256, 256, (g, w, h) => { g.fillStyle = '#d9cdb8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#b9ab94'; g.lineWidth = 4; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } }, [1, 1]);
  const grassT = tex(256, 256, (g, w, h) => { g.fillStyle = '#7fb456'; g.fillRect(0, 0, w, h); for (let i = 0; i < 600; i++) { g.fillStyle = i % 2 ? 'rgba(60,110,40,.25)' : 'rgba(190,220,120,.2)'; g.fillRect(Math.random() * w, Math.random() * h, 3, 7); } }, [30, 30]);
  const fieldT = tex(256, 256, (g, w, h) => { g.fillStyle = '#e2bf5a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? 'rgba(160,120,40,.35)' : 'rgba(255,230,140,.25)'; g.fillRect(0, i * 16, w, 7); } }, [24, 24]);
  const winTex = (wall, glass, trim) => tex(128, 128, (g, w, h) => { g.fillStyle = wall; g.fillRect(0, 0, w, h);
    g.fillStyle = trim; g.fillRect(26, 22, 76, 82); g.fillStyle = glass; g.fillRect(32, 28, 64, 70);
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(32, 70); g.lineTo(70, 28); g.lineTo(86, 28); g.lineTo(32, 86); g.fill();
    g.fillStyle = trim; g.fillRect(62, 28, 4, 70); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(22, 104, 84, 6); g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(0, 124, w, 4); });
  const ballTex = tex(256, 128, (g, w, h) => { g.fillStyle = '#ec7a2c'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2a1408'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.moveTo(w / 4, 0); g.lineTo(w / 4, h); g.moveTo(3 * w / 4, 0); g.lineTo(3 * w / 4, h); g.stroke();
    g.beginPath(); g.ellipse(w / 2, h / 2, 34, h / 2, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(0, h / 2, 34, h / 2, 0, 0, 7); g.ellipse(w, h / 2, 34, h / 2, 0, 0, 7); g.stroke(); });
  const fenceT = tex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(200,205,212,.95)'; g.lineWidth = 3; for (let i = -2; i < 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64 + 128, 128); g.moveTo(i * 64 + 128, 0); g.lineTo(i * 64, 128); g.stroke(); } }, [40, 3]);
  const awnT = (a, b) => tex(128, 32, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(i * 16, 0, 16, h); } }, [6, 1]);
  const roadT = tex(64, 512, (g, w, h) => { g.fillStyle = '#5c6068'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    g.fillStyle = '#f2f0e6'; g.fillRect(2, 0, 3, h); g.fillRect(w - 5, 0, 3, h); g.fillStyle = '#f2c94c'; for (let y = 0; y < h; y += 64) g.fillRect(w / 2 - 2, y, 4, 34); });

  const MAT = {
    court: M('#ffffff', { map: courtTex }), asphalt: M('#ffffff', { map: asphalt }), tiles: M('#ffffff', { map: tiles }), grass: M('#ffffff', { map: grassT }),
    field: M('#ffffff', { map: fieldT }), road: M('#ffffff', { map: roadT }),
    white: M('#f4f1ea'), steel: M('#9aa2ad'), dark: M('#2b2e38'), red: M('#d6453b'), orange: M('#e9772f'), blue: M('#2f6fbf'), pad: M('#1f4f9a'),
    ball: M('#ffffff', { map: ballTex }), wood: M('#a9784a'), green: M('#5fa346'), green2: M('#3f8a3c'), trunk: M('#7a5434'), curb: M('#c9c4ba'),
    glass: M('#2b3f5c'), tire: M('#22232a'), coffee: M('#5a3218'), cup: M('#f4f1ea'), cloud: thin(M('#ffffff'), .002),
  };
  MAT.fence = noLine(new THREE.MeshToonMaterial({ map: fenceT, transparent: true, alphaTest: .3, side: THREE.DoubleSide, gradientMap: gm }));

  // ---------- ground ----------
  const ground = add(new THREE.PlaneGeometry(900, 900), MAT.asphalt, 0, 0, 0, { rx: -Math.PI / 2, cast: false });
  add(new THREE.PlaneGeometry(15, 28), MAT.court, 0, .012, 0, { rx: -Math.PI / 2, cast: false });
  add(new THREE.PlaneGeometry(22, 36), MAT.tiles, 0, .006, 0, { rx: -Math.PI / 2, cast: false }).material.map.repeat.set(11, 18);
  add(new THREE.PlaneGeometry(40, 60), MAT.grass, -36, .008, 0, { rx: -Math.PI / 2, cast: false });

  // ---------- the hoop (rim centre at y 3.05, z -12.42) ----------
  const HOOP = { rim: new THREE.Vector3(0, 3.05, -12.42), poleX: 0, poleZ: -14.9, board: -12.8 };
  const hoop = new THREE.Group(); scene.add(hoop);
  add(cyl(.11, .13, 4.1), MAT.steel, 0, 2.05, HOOP.poleZ, { parent: hoop });
  add(cyl(.2, .2, 1.9), MAT.pad, 0, .95, HOOP.poleZ, { parent: hoop });
  add(box(.16, .16, 2.1), MAT.steel, 0, 3.75, (HOOP.poleZ + HOOP.board) / 2 - .05, { parent: hoop });
  add(box(.12, .9, .12), MAT.steel, 0, 3.4, HOOP.board - .12, { parent: hoop });
  add(rbox(1.8, 1.05, .06, .02), MAT.white, 0, 3.5, HOOP.board, { parent: hoop });
  add(box(.59, .45, .065), MAT.red, 0, 3.31, HOOP.board + .003, { parent: hoop });
  add(box(.5, .36, .07), MAT.white, 0, 3.31, HOOP.board + .006, { parent: hoop });
  const rim = add(new THREE.TorusGeometry(.23, .02, 10, 40), MAT.orange, 0, 3.05, HOOP.rim.z, { rx: Math.PI / 2, parent: hoop });
  add(box(.1, .04, .2), MAT.orange, 0, 3.05, HOOP.board + .1, { parent: hoop });
  // net: lines that sway (and float up without gravity)
  const NET = { n: 12, rows: 5, geo: new THREE.BufferGeometry() };
  NET.pos = new Float32Array(NET.n * NET.rows * 2 * 3 * 2); NET.geo.setAttribute('position', new THREE.BufferAttribute(NET.pos, 3));
  const net = new THREE.LineSegments(NET.geo, new THREE.LineBasicMaterial({ color: '#f4f1ea' })); net.frustumCulled = false; scene.add(net);
  function setNet(t, lift) { // lift 0 (hangs) .. 1 (floats up)
    let k = 0; const c = HOOP.rim, P = (i, r) => { const a = i / NET.n * Math.PI * 2 + (r % 2) * Math.PI / NET.n, rr = .23 - r * .022 + lift * r * .012, dy = -r * .1 * (1 - lift * .9) + lift * r * .02;
      const sw = Math.sin(t * 2.2 + i) * .012 * r; return [c.x + Math.cos(a) * rr + sw, c.y + dy, c.z + Math.sin(a) * rr]; };
    for (let r = 0; r < NET.rows - 1; r++) for (let i = 0; i < NET.n; i++) { const a = P(i, r), b = P(i, r + 1), c2 = P(i + 1, r + 1);
      NET.pos.set(a, k); NET.pos.set(b, k + 3); NET.pos.set(a, k + 6); NET.pos.set(c2, k + 9); k += 12; }
    NET.geo.attributes.position.needsUpdate = true; }

  // ---------- fence, benches, lamps around the court ----------
  [[-10, 0, 36, Math.PI / 2], [10, 0, 36, Math.PI / 2], [0, -18, 20, 0], [0, 18, 20, 0]].forEach(([x, z, len, ry]) => {
    const f = add(new THREE.PlaneGeometry(len, 4), MAT.fence, x, 2, z, { ry, cast: false }); f.material = MAT.fence;
    for (let i = 0; i <= len / 4; i++) { const u = -len / 2 + i * 4; add(cyl(.05, .05, 4.1, 8), MAT.steel, x + (ry ? 0 : u), 2.05, z + (ry ? u : 0)); }
    add(cyl(.04, .04, len, 8), MAT.steel, x, 4.05, z, ry ? { rx: Math.PI / 2 } : { rz: Math.PI / 2 }); });
  const bench = (x, z, ry) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
    add(box(2.2, .08, .5), MAT.wood, 0, .5, 0, { parent: g }); add(box(2.2, .5, .08), MAT.wood, 0, .8, -.24, { parent: g });
    [-1, 1].forEach(s => add(box(.08, .5, .5), MAT.dark, s * .95, .25, 0, { parent: g })); return g; };
  bench(-8.6, -6, Math.PI / 2); bench(-8.6, 4, Math.PI / 2);
  const lamp = (x, z) => { add(cyl(.07, .1, 7, 10), MAT.dark, x, 3.5, z); add(box(.9, .12, .3), MAT.dark, x + .4, 7, z); add(box(.6, .06, .22), M('#fff4c8'), x + .5, 6.93, z); };
  [[-10.6, -10], [-10.6, 10], [10.6, -10], [10.6, 10]].forEach(([x, z]) => lamp(x, z));

  // loose props that will float: bottle, backpack, sneaker, cans, papers, leaves
  const FLOAT = [];
  const floater = (mesh, p, v, spin) => { mesh.userData.f = { p: p.clone ? p : new THREE.Vector3(...p), v: new THREE.Vector3(...v), spin: spin || [0, 0, 0] }; FLOAT.push(mesh); return mesh; };
  floater(add(cyl(.04, .04, .24, 12), M('#5fb7e6'), 0, 0, 0), [1.25, .07, -13.75], [.03, .16, .02], [.6, .2, .3]);
  floater(add(rbox(.34, .42, .2, .05), M('#d64545'), 0, 0, 0), [-1.7, .21, -15.7], [-.02, .1, .02], [.1, .3, .05]);
  floater(add(rbox(.3, .1, .12, .04), M('#f4f1ea'), 0, 0, 0), [-1.1, .05, -12.6], [.05, .22, .03], [1.2, .4, .8]);
  for (let i = 0; i < 26; i++) { const leaf = add(new THREE.PlaneGeometry(.12, .07), noLine(M(i % 3 ? '#7fb456' : '#e3a33c', { side: THREE.DoubleSide })), 0, 0, 0, { cast: false });
    floater(leaf, [-12 + rnd() * 24, .02 + rnd() * .3, -18 + rnd() * 30], [(rnd() - .5) * .3, .05 + rnd() * .25, (rnd() - .5) * .3], [rnd() * 2, rnd() * 2, rnd() * 2]); }
  for (let i = 0; i < 8; i++) { const p = add(new THREE.PlaneGeometry(.21, .29), noLine(M('#fbfaf5', { side: THREE.DoubleSide })), 0, 0, 0, { cast: false });
    floater(p, [14 + rnd() * 10, .02, -10 + rnd() * 24], [(rnd() - .5) * .6, .15 + rnd() * .2, (rnd() - .5) * .6], [rnd(), rnd(), rnd()]); }

  // ---------- trees ----------
  const tree = (x, z, s = 1) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g);
    add(cyl(.18, .26, 3, 10), MAT.trunk, 0, 1.5, 0, { parent: g });
    [[0, 3.6, 0, 1.6], [.9, 3.1, .3, 1.1], [-.8, 3.2, -.4, 1.15], [.2, 4.4, -.2, 1.1]].forEach(([a, b, c, r]) => add(new THREE.IcosahedronGeometry(r, 2), r > 1.3 ? MAT.green : MAT.green2, a, b, c, { parent: g })); return g; };
  [[-14, -14], [-16, -4], [-14, 6], [-17, 15], [-24, -10], [-27, 4], [-22, 18], [-30, -20], [12.2, 22], [26.6, -26], [26.6, 30]].forEach(([x, z], i) => tree(x, z, .9 + (i % 3) * .15));

  // ---------- buildings ----------
  const PAL = [['#e8b48a', '#2c4a6e', '#f6efe2'], ['#c9d6c2', '#34506b', '#f2f2ea'], ['#f0d9a0', '#2f4560', '#fff7e6'], ['#d9a7a0', '#2a4158', '#f7ece6'], ['#b9c7dc', '#2b3d57', '#eef2f8'], ['#e6c7a6', '#30465f', '#fbf3e6']];
  const BLD = [];
  const building = (x, z, w, d, floors, pi, o = {}) => { const [wall, glass, trim] = PAL[pi % PAL.length], hgt = floors * 3.2;
    const mk = (ww, rep) => { const t = winTex(wall, glass, trim); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(Math.max(1, Math.round(ww / 3.4)), floors); return M('#ffffff', { map: t }); };
    const roofM = M(mix(wall, '#000000', .25));
    const mats = [mk(d), mk(d), roofM, roofM, mk(w), mk(w)];
    const b = add(box(w, hgt, d), mats, x, hgt / 2, z); BLD.push(b);
    add(box(w + .4, .5, d + .4), M(trim), x, hgt + .25, z);
    // rooftop clutter
    add(cyl(.9, .9, 1.6, 14), M('#9aa2ad'), x - w * .25, hgt + 1.3, z + d * .1); add(box(1.4, .8, 1), MAT.white, x + w * .2, hgt + .9, z - d * .2);
    add(cyl(.03, .03, 3, 6), MAT.dark, x + w * .35, hgt + 2, z + d * .3);
    // balconies on the face that looks at the court
    if (o.balc) { const [fx, fz, ry] = o.balc; for (let f = 1; f < floors; f++) for (let k = 0; k < Math.floor(w / 6.8); k++) {
      const u = -w / 2 + 3.4 + k * 6.8; const bx = x + (ry ? 0 : u) + fx, bz = z + (ry ? u : 0) + fz;
      add(box(ry ? .9 : 2.4, .12, ry ? 2.4 : .9), MAT.white, bx, f * 3.2, bz); add(box(ry ? .06 : 2.4, .8, ry ? 2.4 : .06), M(trim), bx + (ry ? fx * .45 : 0), f * 3.2 + .45, bz + (ry ? 0 : fz * .45));
      if ((f + k) % 3 === 0) add(new THREE.IcosahedronGeometry(.3, 1), MAT.green, bx, f * 3.2 + .95, bz); } }
    if (o.shop) { const [fx, fz, ry, a, bb] = o.shop; const aw = add(box(ry ? 1.6 : w * .8, .1, ry ? w * .8 : 1.6), M('#ffffff', { map: awnT(a, bb) }), x + fx * (ry ? 1 : 0) + (ry ? fx * .2 : 0), 3.3, z + (ry ? 0 : fz) + (ry ? 0 : fz * .2)); aw.rotation[ry ? 'z' : 'x'] = (ry ? 1 : -1) * Math.sign(fx || fz) * .25; }
    return b; };
  // behind the hoop: the 10-floor block (for "9 pisos")
  building(2, -34, 26, 10, 10, 2, { balc: [0, 5.4, 0] });
  building(-24, -36, 14, 12, 6, 0); building(24, -38, 14, 14, 8, 4);
  building(-34, 32, 16, 12, 7, 3); building(-8, 38, 18, 10, 5, 5); building(16, 40, 14, 12, 9, 1);
  building(-50, -8, 12, 22, 5, 4); building(-50, 22, 12, 16, 8, 2);
  // across the street (x 30+): shops + café on the ground floor
  building(34, -18, 10, 16, 6, 3, { shop: [-5, 0, 1, '#d6453b', '#f4f1ea'] }); building(34, 2, 10, 18, 7, 0, { shop: [-5, 0, 1, '#2f8f5b', '#f4f1ea'] });
  building(34, 22, 10, 16, 5, 5, { shop: [-5, 0, 1, '#2f6fbf', '#f4f1ea'] });
  // far skyline ring (cheap boxes)
  for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, r = 120 + (i % 4) * 22, f = 6 + (i * 7) % 12; building(Math.cos(a) * r, Math.sin(a) * r, 16 + (i % 3) * 6, 16, f, i); }

  // ---------- the street (x 13..21), sidewalk, crossing, café terrace ----------
  add(new THREE.PlaneGeometry(8, 400), MAT.road, 17, .01, 0, { rx: -Math.PI / 2, cast: false }).material.map.repeat.set(1, 40);
  [12.8, 21.2].forEach(x => add(box(.25, .16, 400), MAT.curb, x, .08, 0));
  add(new THREE.PlaneGeometry(8.6, 400), MAT.tiles, 25.4, .02, 0, { rx: -Math.PI / 2, cast: false });
  add(new THREE.PlaneGeometry(2.4, 400), MAT.tiles, 11.6, .02, 0, { rx: -Math.PI / 2, cast: false });
  for (let i = 0; i < 7; i++) add(new THREE.PlaneGeometry(.6, 3.6), M('#f4f1ea'), 14 + i * 1.1, .02, 26, { rx: -Math.PI / 2, cast: false });
  // café terrace (x 23..27, z 4..14)
  const CAFE = { cups: [], umb: [] };
  for (let i = 0; i < 3; i++) { const z = 5 + i * 3.4, x = 24.6;
    add(cyl(.45, .45, .05, 18), MAT.white, x, .75, z); add(cyl(.04, .04, .75, 8), MAT.dark, x, .37, z);
    const u = add(new THREE.ConeGeometry(1.7, .7, 12), M(i % 2 ? '#2f8f5b' : '#f4f1ea'), x, 2.55, z); add(cyl(.03, .03, 2.3, 6), MAT.dark, x, 1.3, z); CAFE.umb.push(u);
    [-1, 1].forEach(s => { add(box(.42, .05, .42), MAT.wood, x + s * .75, .46, z); add(box(.42, .5, .05), MAT.wood, x + s * .75, .7, z + s * .2); });
    for (let c = 0; c < 2; c++) { const cup = add(cyl(.045, .035, .08, 12), MAT.cup, x - .15 + c * .3, .82, z + .1); CAFE.cups.push(cup); } }
  // floating coffee blobs (positions set per frame)
  const COFFEE = []; for (let i = 0; i < 14; i++) { const b = add(sph(.03 + (i % 4) * .01, 12), MAT.coffee, 0, -10, 0, { cast: false }); b.visible = false; COFFEE.push(b); }
  // parked cars along the street (their bodies lift a little: the springs push)
  const carModel = (col) => { const g = new THREE.Group(); const body = new THREE.Group(); g.add(body);
    add(rbox(1.8, .62, 4.2, .18), M(col), 0, .62, 0, { parent: body }); add(rbox(1.6, .55, 2.2, .2), M(col), 0, 1.15, -.2, { parent: body });
    add(rbox(1.62, .42, 2.0, .12), MAT.glass, 0, 1.17, -.2, { parent: body }); add(box(1.5, .12, .05), M('#fff6c8'), 0, .7, 2.1, { parent: body });
    [-.62, .62].forEach(s => add(box(.3, .14, .05), M('#fff6c8'), s, .72, 2.11, { parent: body })); [-.62, .62].forEach(s => add(box(.3, .14, .05), M('#d6453b'), s, .76, -2.11, { parent: body }));
    const wheels = []; [[-.82, 1.35], [.82, 1.35], [-.82, -1.35], [.82, -1.35]].forEach(([x, z]) => { const w = add(cyl(.34, .34, .24, 18), MAT.tire, x, .34, z, { rz: Math.PI / 2, parent: g }); add(cyl(.18, .18, .26, 12), MAT.steel, 0, 0, 0, { parent: w }); wheels.push(w); });
    g.userData = { body, wheels }; scene.add(g); return g; };
  const PARKED = [];
  [['#d6453b', 19.8, -20], ['#f2c94c', 19.8, -12.5], ['#3f86d8', 19.8, 20], ['#f4f1ea', 14.2, 8, Math.PI], ['#2f8f5b', 14.2, -26, Math.PI]].forEach(([c, x, z, r]) => { const car = carModel(c); car.position.set(x, 0, z); car.rotation.y = r || 0; PARKED.push(car); });

  // ---------- country road with a curve (far away, x ≈ -400) ----------
  const ROAD = { x0: -400, z0: 80 };
  const roadPts = []; for (let i = 0; i <= 60; i++) { const s = i / 60 * 220; let x = ROAD.x0, z = ROAD.z0 - s;
    if (s > 100) { const a = (s - 100) / 70; x = ROAD.x0 - 70 * (1 - Math.cos(Math.min(a, Math.PI / 2))) - Math.max(0, a - Math.PI / 2) * 70; z = ROAD.z0 - 100 - 70 * Math.sin(Math.min(a, Math.PI / 2)); }
    roadPts.push(new THREE.Vector3(x, .03, z)); }
  const curve = new THREE.CatmullRomCurve3(roadPts);
  { const N = 240, pos = [], uv = [], idx = []; for (let i = 0; i <= N; i++) { const t = i / N, p = curve.getPointAt(t), tg = curve.getTangentAt(t), n = new THREE.Vector3(-tg.z, 0, tg.x);
      [-1, 1].forEach((s, j) => { pos.push(p.x + n.x * s * 4, .03, p.z + n.z * s * 4); uv.push(j, t * 30); }); if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    const rt = roadT.clone(); rt.wrapS = rt.wrapT = THREE.RepeatWrapping; rt.repeat.set(1, 1); rt.needsUpdate = true;
    const m = new THREE.Mesh(g, noLine(M('#ffffff', { map: rt, side: THREE.DoubleSide }))); m.receiveShadow = true; scene.add(m);
    // chevrons on the outside of the curve + guard posts along the inside
    const L = curve.getLength(), tC = 100 / L;
    for (let i = 0; i < 8; i++) { const t = tC + .01 + i * .028, p = curve.getPointAt(t), tg = curve.getTangentAt(t), n = new THREE.Vector3(-tg.z, 0, tg.x);
      const q = p.clone().addScaledVector(n, 5.8); add(cyl(.05, .05, 1.4, 8), MAT.dark, q.x, .7, q.z);
      const sg = add(box(.9, .7, .05), M('#ffffff', { map: tex(64, 64, (g2, w, h) => { g2.fillStyle = '#d6453b'; g2.fillRect(0, 0, w, h); g2.fillStyle = '#fff'; g2.beginPath(); g2.moveTo(46, 8); g2.lineTo(24, 32); g2.lineTo(46, 56); g2.lineTo(34, 56); g2.lineTo(12, 32); g2.lineTo(34, 8); g2.fill(); }) }), q.x, 1.6, q.z);
      sg.lookAt(p.x, 1.6, p.z); }
    for (let i = 0; i < 44; i++) { const t = i / 44, p = curve.getPointAt(t), tg = curve.getTangentAt(t), n = new THREE.Vector3(-tg.z, 0, tg.x);
      [-1, 1].forEach(sd => { if (sd > 0 && t > tC - .02 && t < tC + .25) return; const q = p.clone().addScaledVector(n, sd * 5.2); add(box(.12, .9, .12), MAT.white, q.x, .45, q.z); add(box(.13, .12, .13), M('#d6453b'), q.x, .82, q.z); }); } }
  add(new THREE.PlaneGeometry(500, 500), MAT.field, ROAD.x0 - 40, .015, ROAD.z0 - 120, { rx: -Math.PI / 2, cast: false });
  add(new THREE.PlaneGeometry(160, 300), MAT.grass, ROAD.x0 + 80, .02, ROAD.z0 - 100, { rx: -Math.PI / 2, cast: false });
  for (let i = 0; i < 9; i++) { const h = add(new THREE.IcosahedronGeometry(40 + i * 6, 1), M(i % 2 ? '#8fbf6a' : '#7aa95c', { flatShading: true }), ROAD.x0 - 200 + i * 60, -18, ROAD.z0 - 330 - (i % 3) * 40, { cast: false }); h.scale.y = .45; }
  for (let i = 0; i < 18; i++) tree(ROAD.x0 + 14 + (i % 3) * 9 + rnd() * 6, ROAD.z0 - i * 14 + rnd() * 6, .9 + rnd() * .5);
  const CAR = carModel('#d6453b'); CAR.position.set(ROAD.x0, 0, ROAD.z0 - 60); // lives on the country road only
  // clouds
  for (let i = 0; i < 18; i++) { const g = new THREE.Group(); const a = i / 18 * Math.PI * 2, r = 260 + (i % 3) * 80; g.position.set(Math.cos(a) * r, 70 + (i % 4) * 18, Math.sin(a) * r); scene.add(g);
    for (let k = 0; k < 5; k++) add(new THREE.IcosahedronGeometry(9 + (k % 3) * 5, 2), MAT.cloud, (k - 2) * 11, (k % 2) * 5, (k % 3) * 4, { parent: g, cast: false, recv: false }); g.lookAt(0, g.position.y, 0); }

  // ---------- the ball ----------
  const BALL = add(sph(.12, 28), MAT.ball, 0, -5, 0);

  // ---------- per-frame API ----------
  const v3 = (a) => Array.isArray(a) ? new THREE.Vector3(...a) : a;
  let shakeV = [0, 0];
  function setCam(pos, look, fov = 50, roll = 0) {
    camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(v3(pos)); camera.up.set(Math.sin(roll), Math.cos(roll), 0); camera.lookAt(v3(look));
    if (shakeV[0] || shakeV[1]) { camera.translateX(shakeV[0]); camera.translateY(shakeV[1]); }
    camera.updateMatrixWorld(); sky.position.copy(camera.position);
    const f = v3(look).clone(); sun.position.copy(f).addScaledVector(SUNDIR, 90); sun.target.position.copy(f); sun.target.updateMatrixWorld(); }
  function shake(x, y) { shakeV = [x, y]; }
  function proj(p) { const v = v3(p).clone(); const cs = v.clone().applyMatrix4(camera.matrixWorldInverse); const d = -cs.z; v.project(camera);
    const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function floaters(g) { // g = story seconds without gravity (clamped at 10), fallT = seconds after gravity returns
    const gg = Math.max(0, Math.min(10, g)), ft = Math.max(0, g - 10);
    FLOAT.forEach(m => { const f = m.userData.f; const p = f.p.clone().addScaledVector(f.v, gg);
      if (ft > 0) { p.y = Math.max(f.p.y * .3 + .02, p.y - 4.9 * ft * ft); }
      m.position.copy(p); m.rotation.set(f.spin[0] * gg, f.spin[1] * gg, f.spin[2] * gg); }); }
  function parked(g) { const gg = Math.max(0, Math.min(10, g)), ft = Math.max(0, g - 10);
    PARKED.forEach((c, i) => { // springs push the body up ~12 cm, then everything drifts up slowly
      let lift = .12 * (1 - Math.exp(-gg * 2.5)) + .015 * gg * gg * .5 + .004 * i * gg; let wl = .006 * gg * gg;
      if (ft > 0) { const fall = 4.9 * ft * ft; lift = Math.max(0, lift - fall); wl = Math.max(0, wl - fall); }
      const bounce = ft > 0 && lift === 0 ? Math.abs(Math.sin(ft * 14)) * .06 * Math.exp(-ft * 5) : 0;
      c.userData.body.position.y = lift + bounce; c.userData.wheels.forEach(w => w.position.y = .34 + wl); c.userData.body.rotation.z = Math.sin(gg * .7 + i) * .02 * Math.min(1, gg); }); }
  function render() { window.__GL_ON = true; R.setClearColor('#8fc2ee'); effect.render(scene, camera); shakeV = [0, 0]; }
  function resize(w, h) { W = w; H = h; GLC.width = w; GLC.height = h; GLC.style.width = w + 'px'; GLC.style.height = h + 'px'; R.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  return { resize, THREE, scene, camera, R, M, MAT, HOOP, BALL, CAR, CAFE, COFFEE, curve, ROAD, setCam, proj, render, setNet, floaters, parked, shake, add, sph, rbox, box, cyl, rim, hoop };
})();

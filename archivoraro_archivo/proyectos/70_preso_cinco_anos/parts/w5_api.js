
  // =====================================================================================================
  // ESTADO Y API
  // =====================================================================================================
  let SECTION = false;
  const LANTERN = new T.PointLight('#ffb050', 0, 4.5, 1.4); scene.add(LANTERN);
  // relojes (todas las esferas): W2.setClocks(h, m)
  const drawClock = (S, hh, mm, face = '#f6f0e0') => { const g = S.g, w = 256, h = 256; g.clearRect(0, 0, w, h); g.fillStyle = face; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 6, 0, 7); g.fill(); g.lineWidth = 14; g.strokeStyle = INK; g.stroke();
    for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; g.lineWidth = k % 3 ? 5 : 10; g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * (w / 2 - 22), h / 2 - Math.cos(a) * (w / 2 - 22)); g.lineTo(w / 2 + Math.sin(a) * (w / 2 - 40), h / 2 - Math.cos(a) * (w / 2 - 40)); g.stroke(); }
    const ah = (hh % 12 + mm / 60) / 12 * 6.283, am = mm / 60 * 6.283; g.lineCap = 'round'; g.lineWidth = 12; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.sin(ah) * w * .24, h / 2 - Math.cos(ah) * w * .24); g.stroke(); g.lineWidth = 7; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.sin(am) * w * .36, h / 2 - Math.cos(am) * w * .36); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(w / 2, h / 2, 10, 0, 7); g.fill(); S.t.needsUpdate = true; };
  function setClocks(hh, mm) { [HALLCLOCK, BOOTHCLOCK, BANKCLOCK, KCLOCK].forEach(S => drawClock(S, hh, mm)); }
  setClocks(10, 10);
  // monitores de la garita
  function drawCCTV(t = 0, night = 0) { const g = CCTV.g, w = 512, h = 256; g.fillStyle = '#0a1210'; g.fillRect(0, 0, w, h); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const x = 8 + i * 168, y = 8 + j * 124; g.fillStyle = night ? '#1a3a2a' : '#2a4a3a'; g.fillRect(x, y, 160, 116);
      g.strokeStyle = 'rgba(160,255,190,.45)'; g.lineWidth = 3; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x + 10 + k * 36, y + 100); g.lineTo(x + 10 + k * 36, y + 30); g.stroke(); } g.fillStyle = 'rgba(160,255,190,.25)'; g.fillRect(x, y + ((t * 40 + i * 30) % 116), 160, 3); txt(g, 'CAM ' + (j * 3 + i + 1), x + 30, y + 14, 14, '#9affb8', 800); } CCTV.t.needsUpdate = true; }
  drawCCTV(0);
  // rayas de días en la pared de la celda: n rayas completas + la que dibuja ahora (k 0..1)
  function setTally(n, k = 0) { const g = TALLY.g, w = 1024, h = 512; g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(245,240,225,.92)'; g.lineCap = 'round'; const gx = 46, gy = 120;
    const pos = i => { const grp = Math.floor(i / 5), r = i % 5, col = grp % 9, row = Math.floor(grp / 9); return { grp, r, x: 30 + col * 108, y: 40 + row * 118 }; };
    const stroke = (i, kk) => { const p = pos(i); g.lineWidth = 8; g.beginPath(); if (p.r < 4) { const x = p.x + p.r * 20 + (i % 3) * 1.5; g.moveTo(x, p.y); g.lineTo(x + (i % 2) * 3, p.y + 92 * kk); } else { g.moveTo(p.x - 10, p.y + 70); g.lineTo(p.x - 10 + 92 * kk, p.y + 70 - 50 * kk); } g.stroke(); };
    for (let i = 0; i < n; i++) stroke(i, 1); if (k > 0) stroke(n, k); TALLY.t.needsUpdate = true; }
  setTally(23);
  // libro de cuentas del director
  function setLedger(gold = 200, cash = 50, circ = 0) { const g = LEDGER.g, w = 800, h = 520; g.fillStyle = '#f4ecd6'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(w / 2 - 4, 0, 8, h); for (let y = 90; y < h; y += 34) { g.fillStyle = 'rgba(80,120,180,.25)'; g.fillRect(20, y, w - 40, 2); } g.fillStyle = 'rgba(200,60,60,.35)'; g.fillRect(80, 0, 3, h); g.fillRect(w / 2 + 80, 0, 3, h);
    txt(g, 'LINGOTES', w / 4, 60, 44, '#3a2a1a', 900); txt(g, 'FAJOS', w * .75, 60, 44, '#3a2a1a', 900);
    [['200', 140], ['200', 200], ['200', 260]].forEach(([v, y]) => { txt(g, v, w / 4, y, 46, '#5a5a6a', 700); txt(g, '50', w * .75, y, 46, '#5a5a6a', 700); });
    txt(g, String(gold), w / 4, 360, 84, gold < 200 ? '#c8243a' : '#2a2a3a', 900); txt(g, String(cash), w * .75, 360, 84, cash < 50 ? '#c8243a' : '#2a2a3a', 900);
    if (circ > 0) { g.strokeStyle = '#2f5fd8'; g.lineWidth = 8; [w / 4, w * .75].forEach(cx => { g.beginPath(); g.ellipse(cx, 360, 110, 62, -.08, -1.2, -1.2 + 6.3 * Math.min(1, circ)); g.stroke(); }); } LEDGER.t.needsUpdate = true; }
  setLedger();
  // calendario de taco: k 0 → domingo 6, 1 → lunes 7 (la hoja sube y se va)
  const drawCalPage = (S, day, num, ring) => { const g = S.g, w = 320, h = 400; g.fillStyle = '#fbf8f0'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a5a3a'; g.fillRect(0, 0, w, 70); txt(g, 'BANCO', w / 2, 38, 40, '#f2d27a', 900); txt(g, day, w / 2, 112, 42, day === 'DOMINGO' ? '#c8243a' : '#3a3a3a', 900); txt(g, num, w / 2, 250, 190, '#1b1720', 900);
    if (ring) { g.strokeStyle = '#c8243a'; g.lineWidth = 12; g.beginPath(); g.ellipse(w / 2, 250, 120, 108, 0, 0, 6.3 * ring); g.stroke(); } S.t.needsUpdate = true; };
  function setCal(k, ring = 0) { drawCalPage(CAL, 'LUNES', '7', ring); drawCalPage(calPageC, 'DOMINGO', '6', 0); CALPAGE.visible = k < 1; CALPAGE.rotation.x = -k * 2.6; CALPAGE.position.y = 1.235 + k * .02; }
  setCal(0);
  // orden de libertad: pose 0 encima de la barandilla del banquillo → 1 delante de la cámara (cp, look)
  const ORD0 = { p: new T.Vector3(JX + 3.05, 1.09, -2.27), r: new T.Euler(-Math.PI / 2 + .22, 0, Math.PI - .3) };
  function setOrder(k, hl = 0, cp = null, look = null) { drawOrder(hl); if (!cp) { ORDER.position.copy(ORD0.p); ORDER.rotation.copy(ORD0.r); return; }
    const fw = look.clone().sub(cp).normalize(), tgt = cp.clone().addScaledVector(fw, .62); ORDER.position.copy(ORD0.p).lerp(tgt, k); ORDER.position.y += Math.sin(Math.PI * k) * .25;
    const q0 = new T.Quaternion().setFromEuler(ORD0.r), m = new T.Matrix4().lookAt(tgt, cp, new T.Vector3(0, 1, 0)), q1 = new T.Quaternion().setFromRotationMatrix(m); ORDER.quaternion.copy(q0).slerp(q1, k); }
  setOrder(0);
  // puerta de la celda (k 0 cerrada, 1 abierta), colchón (a: giro), desorden, losa del túnel en la celda, losa del banco, puerta de la cámara, lingotes
  function setCellDoor(k) { MYDOOR.door.position.x = -1.3 * k; }
  function setMattress(a = 0, lift = 0) { MATTRESS.rotation.x = -a; MATTRESS.position.y = .44 + lift; MATTRESS.position.z = -2.72 + Math.sin(a) * .3; }
  function setMess(on) { MESS.visible = !!on; }
  function setCellLid(k) { CELLLID.visible = k < .5; }
  function setVTile(k) { VTILE.rotation.z = k * 1.9; }
  function setVaultDoor(k, spin = 0) { VDOOR.rotation.y = -k * 1.75; VDOOR.userData.d.userData.wheel.rotation.x = spin; }
  const goldOrder = GOLD.map((m, i) => i).sort((a, b) => ((a * 37) % 11) - ((b * 37) % 11));
  function setGold(frac = 1, cashFrac = 1, missing = -1) { const n = Math.round(GOLD.length * frac); goldOrder.forEach((gi, r) => GOLD[gi].visible = r < n); if (missing >= 0) GOLD[missing].visible = false; const nc = Math.round(CASH.length * cashFrac); CASH.forEach((m, i) => m.visible = ((i * 7) % CASH.length) < nc); }
  function goldPos(i) { const p = new T.Vector3(); GOLD[i].getWorldPosition(p); return p; }
  function setGlint(p, s = 0) { if (!p || s <= 0) { GLINT.position.y = -50; return; } GLINT.position.copy(p); GLINT.scale.setScalar(s); }
  function setCoffee(k, t = 0) { COFLED[0].material.emissiveIntensity = k < 1 ? 2 + Math.sin(t * 9) * 1.2 : 0; COFLED[1].material.emissiveIntensity = k < 1 ? 0 : 2.5; COFLED[1].material.color.set(k < 1 ? '#3a3a3a' : '#3aff7a');
    COFSIGN.visible = k < 1.4; COFSIGN.position.y = .45 - Math.max(0, k - 1) * 1.2; COFSIGN.rotation.z = Math.max(0, k - 1) * 3; COFPANEL.rotation.y = k < 1 ? -1.2 * Math.min(1, k * 4) * (1 - Math.max(0, k * 4 - 3)) : 0; }
  function setPolice(on, t = 0) { POLICE.visible = !!on; SIRENS.forEach((s, i) => { const ph = (Math.floor(t * 6 + i) % 2) === 0; s.r.material.emissiveIntensity = on && ph ? 3 : .3; s.b.material.emissiveIntensity = on && !ph ? 3 : .3; s.lr.intensity = on && ph ? 12 : 0; s.lb.intensity = on && !ph ? 12 : 0; }); }
  setPolice(false); setCoffee(0); setGold(1, 1);
  function setLantern(p, I = 3) { if (!p) { LANTERN.intensity = 0; return; } LANTERN.position.copy(p); LANTERN.intensity = I; }
  function setSection(on) { SECTION = !!on; CAPS.visible = SECTION; R.clippingPlanes = SECTION ? [new T.Plane(new T.Vector3(0, 0, -1), ZS)] : []; }

  // ---------- post: brillo + desenfoque de fondo + gradación ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .22, .5, .9); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .003, maxblur: .006 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, time: { value: 0 }, morn: { value: 0 }, night: { value: 0 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float time, morn, night; varying vec2 vUv; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c+=vec3(-.01,.008,.028)*(1.-l); c+=vec3(.03,.014,-.016)*l; c+=vec3(.02,0.,-.012)*morn; c+=vec3(-.012,.0,.034)*night; c=mix(vec3(l),c,1.16); c=c*c*(3.-2.*c)*.3+c*.7; vec2 d=vUv-.5; c*=1.-dot(d,d)*(.45+night*.5); c+=(h(vUv*vec2(1080.,1920.)+time)-.5)*.022; gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { const cp = r.clippingPlanes; r.clippingPlanes = []; gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); r.clippingPlanes = cp; } });
  // ---------- contorno de tinta (con planos de corte) ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, clipping: true, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k;\n#include <clipping_planes_pars_vertex>\nvoid main(){ vec4 mvPosition=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mvPosition.xyz+=n*(-mvPosition.z)*k; gl_Position=projectionMatrix*mvPosition;\n#include <clipping_planes_vertex>\n}',
    fragmentShader: 'uniform vec3 col;\n#include <clipping_planes_pars_fragment>\nvoid main(){\n#include <clipping_planes_fragment>\ngl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o === sky || o.userData.noInk || (o.material && o.material.transparent)) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'CircleGeometry' || ty === 'RingGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  // ---------- cámara, luces por zona, ambiente ----------
  let NIGHT = 0;
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    ZL.forEach(([l, I, test]) => { const on = !!test(pos); l.visible = on; l.intensity = on ? I * (NIGHT > .5 && l.userData.nightK != null ? l.userData.nightK : 1) : 0; });
    sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; CLOUDS.forEach(([o, p0]) => o.position.x = p0.x + t * 1.2); FANB.rotation.y = t * 4.2; candles.forEach((c, i) => c.scale.setScalar(1 + Math.sin(t * 13 + i * 2) * .18)); drawCCTV(t, NIGHT); }
  const SUN_DAY = SUN.clone(), SUN_DUSK = new T.Vector3(.78, .22, .58).normalize(), MOON = new T.Vector3(.5, .45, .74).normalize();
  // m: 0 día, 1 atardecer; n: 0..1 noche (la galería y la garita se quedan con luz azul y la lámpara de mesa)
  function setMood(m = 0, n = 0) { NIGHT = n; SUN.copy(SUN_DAY).lerp(SUN_DUSK, m).lerp(MOON, n).normalize(); skyU.morn.value = m * (1 - n); skyU.night.value = n; gradeMat.uniforms.morn.value = m * (1 - n); gradeMat.uniforms.night.value = n;
    sun.color.set(n > .5 ? '#9fb4ff' : m > .5 ? '#ffc890' : '#fff0d4'); sun.intensity = lerp(lerp(4.2, 3.2, m), 1.6, n);
    hemi.color.set(n > .5 ? '#5a6ab0' : m > .5 ? '#ffd0b8' : '#d2e6ff'); hemi.groundColor.set(n > .5 ? '#1a1e30' : m > .5 ? '#7a5a4a' : '#8a7a62'); hemi.intensity = lerp(1.25, .55, n);
    scene.fog.color.set(n > .5 ? '#1c2440' : m > .5 ? '#f0c8a8' : '#d6e6ee'); R.toneMappingExposure = lerp(1.2, 1.05, n);
    CELLSUN.userData.nightK = 0;
    STREETLAMPS.forEach(l => l.material.emissiveIntensity = (n > .5 || m > .7) ? 2.2 : .25); ALLEYBULB.material.emissiveIntensity = n > .5 || m > .7 ? 2 : .2; }
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  return { T, scene, camera, R, setCam, proj, render, setTime, setMood, visible, SUN, JX, KX, ZS, TUN, BOOTH, DK, VHOLE, setCondena: drawCondena, setOrder, ORDER, setClocks, setTally, setLedger, setCal, setCellDoor, setMattress, setMess, setCellLid, setVTile, setVaultDoor,
    setGold, goldPos, GOLD, CASH, setGlint, setCoffee, setPolice, setLantern, setSection, COFFEE, QUEJAS, WETSIGN, MUG, CACTUS, MATTRESS, VDOOR, POLICE, CELLLIGHTS: null, dof, bloom, comp, inkM, get SECTION() { return SECTION; } };
})();

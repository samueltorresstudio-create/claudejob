
  // =====================================================================================================
  // API
  // =====================================================================================================
  // ---------- post: brillo + desenfoque de fondo + gradación (con sepia para el flashback) ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .24, .5, .88); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .003, maxblur: .006 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, time: { value: 0 }, sepia: { value: 0 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float time, sepia; varying vec2 vUv; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c+=vec3(-.012,.004,.03)*(1.-l); c+=vec3(.035,.016,-.018)*l; c=mix(vec3(l),c,1.14); c=c*c*(3.-2.*c)*.3+c*.7; vec3 sp=vec3(l*1.08+.06,l*.95+.02,l*.74); c=mix(c,sp,sepia); vec2 d=vUv-.5; c*=1.-dot(d,d)*(.55+sepia*.6); c+=(h(vUv*vec2(1080.,1920.)+time)-.5)*(.022+sepia*.05); gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  // ---------- contorno de tinta ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0022 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o === sky || o.userData.noInk || (o.material && o.material.transparent)) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'CircleGeometry' || ty === 'RingGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  // ---------- ambientes por zona ----------
  const SUNH = new T.Vector3(-.62, .5, .2).normalize();   // sol de la sala: entra por las vidrieras de la izquierda
  const MOODS = {
    hall: { sun: '#fff6e8', sunI: 2.4, dir: SUNH, hemi: '#f4f0ff', ground: '#6a5a50', hemiI: 1.25, fog: '#d8d4cc', fogD: .005, exp: 1.04, night: 0, morn: 0 },
    war: { sun: '#9fb4ff', sunI: .5, dir: SUNH, hemi: '#d8d0e4', ground: '#2a2430', hemiI: .55, fog: '#16141c', fogD: .01, exp: 1.22, night: 1, morn: 0 },
    plaza: { sun: '#b8c8ff', sunI: 1.4, dir: new T.Vector3(.4, .55, -.7).normalize(), hemi: '#6a7ab8', ground: '#22222e', hemiI: .85, fog: '#1c2236', fogD: .014, exp: 1.45, night: 1, morn: 0 },
    harbor: { sun: '#ffe0c0', sunI: 2.3, dir: new T.Vector3(.7, .3, -.5).normalize(), hemi: '#b4c4dc', ground: '#3a3a48', hemiI: 1.0, fog: '#9aa6b8', fogD: .006, exp: 1.04, night: 0, morn: .35 },
    sea: { sun: '#bfefff', sunI: 1.4, dir: new T.Vector3(0, 1, .2).normalize(), hemi: '#7fd0e0', ground: '#2a5a6a', hemiI: 1.1, fog: '#2f7a8e', fogD: .055, exp: 1.12, night: 0, morn: 0 } };
  let MOOD = 'hall';
  function setMood(m) { MOOD = m; const M = MOODS[m]; sun.color.set(M.sun); sun.intensity = M.sunI; SUN.copy(M.dir); hemi.color.set(M.hemi); hemi.groundColor.set(M.ground); hemi.intensity = M.hemiI;
    scene.fog.color.set(M.fog); scene.fog.density = M.fogD; R.toneMappingExposure = M.exp; skyU.night.value = M.night; skyU.morn.value = M.morn; seaU.dusk.value = m === 'harbor' ? .3 : 0; sea.visible = m === 'harbor'; sky.visible = m !== 'sea'; SEABOX.visible = m === 'sea'; }
  setMood('hall');
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    ZL.forEach(([l, I, test]) => { const on = !!test(pos); l.visible = on; l.intensity = on ? I : 0; });
    fireLights.forEach(l => { const on = inHarbor(pos) && (l.userData.k || 0) > .02; l.visible = on; l.intensity = on ? 220 * l.userData.k : 0; });
    sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; seaU.time.value = t;
    FLAMES.forEach(([g, ph]) => { const f = 1 + Math.sin(t * 17 + ph) * .14 + Math.sin(t * 29 + ph * 2) * .08; g.scale.set(1 / Math.sqrt(f), f, 1 / Math.sqrt(f)); });
    BANNERS.forEach(([b, ph]) => b.rotation.y = Math.sin(t * .9 + ph) * .05);
    FLEET.fr.forEach((s, i) => { if (s.fire.visible) s.fire.children.forEach((f, k) => { const q = 1 + Math.sin(t * 13 + i * 2 + k) * .18; f.scale.set(1, q, 1); }); s.g.position.y = Math.sin(t * 1.1 + i) * .06; });
    FLEET.en.forEach((s, i) => s.g.rotation.z = Math.sin(t * 1.2 + i) * .03);
    HANGED.rotation.z = Math.sin(t * .8) * .05; HANGED.rotation.y = Math.sin(t * .5) * .3;
    KELP.forEach(([m, k]) => m.rotation.z = Math.sin(t * 1.1 + k) * .12); SBAN.position.y = 4.5 - (t % 8) * .3; SBAN.rotation.z = Math.sin(t * .9) * .25; SBAN.rotation.y = Math.sin(t * .6) * .4; }
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && o !== sea && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  function shipTop(i) { const s = FLEET.fr[i]; const p = new T.Vector3(0, 2.0, 0); s.b.updateMatrixWorld(true); return p.applyMatrix4(s.b.matrixWorld); }
  return { shipTop, T, scene, camera, R, setCam, proj, render, setTime, setMood, visible, SUN, THRONE, BT, HZ0, HZ1, HX0, HX1, MT, mapP, GX, GZ0, GZ1, PX, GALLOWS, HXc, UX, FLEET, HANGED, WDOOR, SBAN,
    setDoors, setBanquet, setTokens, setLightning, setFleet, dof, bloom, comp, inkM, sky, sea };
})();

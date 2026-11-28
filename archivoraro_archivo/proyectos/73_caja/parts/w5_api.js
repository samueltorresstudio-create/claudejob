
  // =====================================================================================================
  // API
  // =====================================================================================================
  // ---------- post: brillo + desenfoque de fondo + gradación (con sepia para el flashback) ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  // oclusión ambiental (rincones, juntas, pies de columnas, contacto con el suelo): quita el aspecto de plastilina
  const gtao = new GTAOPass(scene, camera, W, H, undefined, { radius: .7, distanceExponent: 1.4, thickness: 1.2, scale: 1.25, samples: 10 }, { lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, rings: 2, samples: 8 });
  gtao.blendIntensity = 1; comp.addPass(gtao);
  // limpia píxeles NaN/Inf antes del brillo (el bloom los convierte en bloques negros enormes: visto en 18,3 s y 20,9 s)
  const sanM = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, px: { value: new T.Vector2(1 / W, 1 / H) } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform vec2 px; varying vec2 vUv; bool bad(vec4 c){ return any(isnan(c)) || any(isinf(c)) || any(greaterThan(abs(c), vec4(6e4))); } void main(){ vec4 c=texture2D(tDiffuse,vUv); if(bad(c)){ vec4 s=vec4(0.); float n=0.; for(int i=0;i<8;i++){ float a=float(i)*.785398; vec4 q=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*4.); if(!bad(q)){ s+=q; n+=1.; } } c = n>0. ? s/n : vec4(0.,0.,0.,1.); } gl_FragColor=c; }' });
  const sq = new T.Mesh(new T.PlaneGeometry(2, 2), sanM); sq.frustumCulled = false; const sScene = new T.Scene(); sScene.add(sq); const sCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { sanM.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(write); r.render(sScene, sCam); } });
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .24, .5, .88); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .003, maxblur: .006 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, time: { value: 0 }, sepia: { value: 0 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float time, sepia; varying vec2 vUv; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c+=vec3(-.012,.004,.03)*(1.-l); c+=vec3(.035,.016,-.018)*l; c=mix(vec3(l),c,.98); c=c*c*(3.-2.*c)*.3+c*.7; vec3 sp=vec3(l*1.08+.06,l*.95+.02,l*.74); c=mix(c,sp,sepia); vec2 d=vUv-.5; c*=1.-dot(d,d)*(.55+sepia*.6); c+=(h(vUv*vec2(1080.,1920.)+time)-.5)*(.022+sepia*.05); gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  // ---------- contorno de tinta ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0012 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  const toInk = []; scene.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o === sky || o.userData.noInk || (o.material && o.material.transparent)) return; const ty = o.geometry.type; if (ty === 'PlaneGeometry' || ty === 'CircleGeometry' || ty === 'RingGeometry') return; toInk.push(o); });
  toInk.forEach(o => { let g = o.geometry.clone(); ['normal', 'uv'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.receiveShadow = false; o.add(h); });
  // ---------- ambientes por zona (cada mood enciende su grupo de decorado y sus luces) ----------
  const MOODS = {
    aire: { env: .5, sun: '#ffe2b8', sunI: 3.6, dir: new T.Vector3(.62, .32, .72).normalize(), hemi: '#9fc0ff', ground: '#5a6a94', hemiI: 1.0, fog: '#a8c8f0', fogD: .0009, exp: .95, night: 0, morn: 0, clouds: false, sky: false, L: { cabL: 26, holdL: 6, torchL: 3.2 } },
    aireNoche: { env: .2, sun: '#9fb4ff', sunI: .6, dir: new T.Vector3(.4, .6, -.5).normalize(), hemi: '#5a6a9a', ground: '#1a2030', hemiI: .7, fog: '#1a2236', fogD: .004, exp: 1.2, night: 1, morn: 0, L: { cabL: 30, holdL: 4, torchL: 10 } },
    londres: { env: .25, sun: '#9fb0d8', sunI: .7, dir: new T.Vector3(.3, .5, .6).normalize(), hemi: '#8a98b8', ground: '#3a3a44', hemiI: .95, fog: '#7d8698', fogD: .026, bg: '#7d8698', exp: 1.15, sky: false, clouds: false, L: { lamp0: 30, lamp1: 30, lamp2: 30, lamp3: 30, boothL: 10 } },
    taller: { env: .3, sun: '#ffe2c0', sunI: .25, dir: new T.Vector3(.5, .7, .4).normalize(), hemi: '#f0e0c8', ground: '#4a3a30', hemiI: .55, fog: '#2a2420', fogD: .01, bg: '#1b1720', exp: 1.1, sky: false, clouds: false, L: { talL: 40, talF: 8 } },
    niebla: { env: .3, sun: '#c8d0e0', sunI: .9, dir: new T.Vector3(0, .55, -.83).normalize(), hemi: '#b8c4d8', ground: '#5a5a60', hemiI: .95, fog: '#a8b0bc', fogD: .034, bg: '#a8b0bc', exp: 1.05, sky: false, clouds: false, L: { almL0: 18, almL1: 18, almL2: 18 } },
    perth: { env: .45, sun: '#ffd8a8', sunI: 3.0, dir: new T.Vector3(.15, .42, -.9).normalize(), hemi: '#ffe8c8', ground: '#6a5040', hemiI: .7, fog: '#f0d8b8', fogD: .006, exp: 1.0, night: 0, morn: .5, L: { almL0: 10, almL1: 10, almL2: 10 } },
    noche: { env: .15, sun: '#7f90c8', sunI: .3, dir: new T.Vector3(.2, .6, -.7).normalize(), hemi: '#4a5a8a', ground: '#1a1a24', hemiI: .5, fog: '#141a2a', fogD: .01, exp: 1.25, night: 1, morn: 0, L: { almL2: 24 } },
    pista: { env: .5, sun: '#fff0d0', sunI: 4.2, dir: new T.Vector3(-.3, .85, .45).normalize(), hemi: '#d8e8ff', ground: '#a89070', hemiI: 1.1, fog: '#f0e0c0', fogD: .004, exp: .98, night: 0, morn: .3 },
    casa: { env: .35, sun: '#fff2d8', sunI: 1.0, dir: new T.Vector3(.3, .6, .7).normalize(), hemi: '#fff0d8', ground: '#8a6a4a', hemiI: .7, fog: '#f2dcb4', fogD: .008, bg: '#2a2420', exp: 1.05, sky: false, clouds: false, L: { casaL: 36, casaW: 10 } },
  };
  let MOOD = 'aire'; const LIGHTS = Object.assign({ cabL, holdL, torchL }, XL);
  function setMood(m) { if (!MOODS[m]) m = 'aire'; MOOD = m; const M = MOODS[m]; scene.environmentIntensity = M.env ?? .4; sun.color.set(M.sun); sun.intensity = M.sunI; SUN.copy(M.dir); hemi.color.set(M.hemi); hemi.groundColor.set(M.ground); hemi.intensity = M.hemiI;
    scene.fog.color.set(M.fog); scene.fog.density = M.fogD; R.toneMappingExposure = M.exp; skyU.night.value = M.night; skyU.morn.value = M.morn; sky.visible = M.sky !== false; CLOUDS.forEach(([g]) => g.visible = M.clouds !== false);
    Object.values(ZG).forEach(g => g.visible = g.userData.moods.includes(m)); scene.background = M.bg ? new T.Color(M.bg) : null;
    if (ZG.almacen) { const U = ZG.almacen.userData; U.signs.SL.visible = m === 'niebla'; U.signs.SP.visible = m !== 'niebla'; U.oz.visible = U.gums.visible = m !== 'niebla'; }
    Object.entries(LIGHTS).forEach(([k, l]) => { const I = (M.L || {})[k] || 0; l.intensity = I; l.visible = I > 0; }); }
  setMood('aire');
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position); if (typeof SKYAIR !== 'undefined') SKYAIR.position.copy(camera.position);
    ZL.forEach(([l, I, test]) => { const on = !!test(pos); l.visible = on; l.intensity = on ? I : 0; });
    sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  // ---------- capa de primer término: piezas fg (brazos del trono…) recortadas de la imagen final y puestas ENCIMA de los personajes ----------
  FGO.forEach(o => o.traverse(c => c.layers.enable(1)));
  const FGC = document.createElement('canvas'); FGC.width = W; FGC.height = H; FGC.id = 'gl2'; FGC.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none';
  (document.getElementById('stage') || document.body).appendChild(FGC); const fgx = FGC.getContext('2d');
  const MC = document.createElement('canvas'); MC.width = W; MC.height = H; const MR = new T.WebGLRenderer({ canvas: MC, antialias: true, alpha: true, preserveDrawingBuffer: true }); MR.setClearColor(0x000000, 0);
  const maskM = new T.MeshBasicMaterial({ color: '#ffffff' }); let FG_ON = false; const setFg = on => { FG_ON = !!on; };
  function render() { comp.render(); fgx.clearRect(0, 0, W, H); if (!FG_ON) return;
    const lm = camera.layers.mask, bg = scene.background, fo = scene.fog, ov = scene.overrideMaterial; camera.layers.set(1); scene.background = null; scene.fog = null; scene.overrideMaterial = maskM;
    MR.render(scene, camera); camera.layers.mask = lm; scene.background = bg; scene.fog = fo; scene.overrideMaterial = ov;
    fgx.globalCompositeOperation = 'source-over'; fgx.drawImage(MC, 0, 0); fgx.globalCompositeOperation = 'source-in'; fgx.drawImage(GLC, 0, 0); fgx.globalCompositeOperation = 'source-over'; }
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; TICK.forEach(f => f(t)); }
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  return { comp, setFg, T, scene, camera, R, setCam, proj, render, setTime, setMood, visible, SUN, ZG, PLN, CR, SUP, CRT, SUPT, CRA, CRP, R_F, HOLD_Y, FLOOR_Y, CRATE_W, CRATE_H, CRATE_D, LIGHTS, crate, makePlane, suitcase, mailSack, dof, bloom, inkM, sky, get mood() { return MOOD; } };
})();

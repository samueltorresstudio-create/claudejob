// Mundo del 74 «El lago que desapareció» (Lake Peigneur, 1980). Decorados modelados en Blender (blender/lago.py → lago.glb, embebido en glb_lago.js)
// y cargados con GLTFLoader. Aquí: materiales finos, cielo, luz, agua animada (calma / remolino / lago vaciado), cascada, chorro en la mina y la sección.
// Ejes: x este, y arriba, z sur. Lago centrado en (0,0) con la plataforma en el centro; isla Jefferson al este; canal al suroeste.
// Diorama en sección en x = 3000 (cara cortada en z = 30, mina a -358…-374 m, pozo del ascensor a la izquierda).
window.GLC = document.getElementById('gl');
const W2 = (() => {
  const T = THREE, W = 1080, H = 1920, LAY = window.LAYOUT;
  const R = new T.WebGLRenderer({ canvas: GLC, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.NeutralToneMapping; R.toneMappingExposure = 1.05; R.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(40, W / H, .05, 6000);
  const rnd = (() => { let s = 7474; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const tex = (w, h, draw, rep, srgb = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); if (srgb) t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const noise = (g, w, h, n, cols, sz = [1, 3]) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const s = sz[0] + rnd() * (sz[1] - sz[0]); g.fillRect(rnd() * w, rnd() * h, s, s); } };
  const blot = (g, w, h, n, col, r0, r1) => { for (let i = 0; i < n; i++) { const x = rnd() * w, y = rnd() * h, r = r0 + rnd() * (r1 - r0); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); } };
  const strokes = (g, w, h, n, cols, len = [6, 18], lw = [1, 3]) => { for (let i = 0; i < n; i++) { g.strokeStyle = cols[i % cols.length]; g.lineWidth = lw[0] + rnd() * (lw[1] - lw[0]); const x = rnd() * w, y = rnd() * h, a = rnd() * 6.28, L = len[0] + rnd() * (len[1] - len[0]); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); } };
  const TICK = [];

  // ---------- cielo (degradado + sol + nubes pintadas en el propio cielo) ----------
  const SUN = new T.Vector3(-.55, .42, .72).normalize();
  const skyU = { sun: { value: SUN }, top: { value: new T.Color('#2f6fc4') }, mid: { value: new T.Color('#8fbde8') }, hor: { value: new T.Color('#e6eef0') }, cloud: { value: .55 }, dark: { value: 0 }, time: { value: 0 } };
  const SKYFS = `uniform vec3 sun, top, mid, hor; uniform float cloud, dark, time; varying vec3 vd;
    float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
    float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*n2(p); p*=2.03; a*=.5; } return s; }
    void main(){ float h=vd.y; vec3 c=h>.06?mix(mid,top,smoothstep(.06,.7,h)):mix(hor,mid,smoothstep(-.04,.06,h));
      float s=max(dot(vd,sun),0.); c+=vec3(1.,.88,.66)*(pow(s,8.)*.22+pow(s,300.)*2.5);
      if(h>0.){ vec2 q=vd.xz/(h+.12)*1.6+vec2(time*.004,0.); float cl=smoothstep(.5-cloud*.25,.85,fbm(q)); float sh=fbm(q*1.7+3.)*.35;
        vec3 cc=mix(vec3(1.,.98,.95),vec3(.62,.66,.74),sh+dark*.5); cc+=vec3(1.,.85,.6)*pow(s,6.)*.4; c=mix(c,cc,cl*smoothstep(0.,.12,h)*.92); }
      c=mix(c,c*vec3(.55,.58,.66),dark); gl_FragColor=vec4(c,1.); }`;
  const sky = new T.Mesh(new T.SphereGeometry(5000, 48, 24), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: 'varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }', fragmentShader: SKYFS }));
  sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky);
  scene.fog = new T.FogExp2('#cfdde4', .0011);
  // reflejo del entorno (PMREM del cielo) para metales y agua
  { const es = new T.Scene(); const sk2 = sky.clone(); sk2.material = sky.material; es.add(sk2); const pm = new T.PMREMGenerator(R); scene.environment = pm.fromScene(es, 0, .1, 6000).texture; }
  const hemi = new T.HemisphereLight('#cfe2ff', '#6a5a44', 1.1); scene.add(hemi);
  const sun = new T.DirectionalLight('#fff0d8', 3.6); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -.0005; sun.shadow.normalBias = .08; scene.add(sun, sun.target);

  // ---------- texturas pintadas ----------
  const grassT = tex(512, 512, (g, w, h) => { g.fillStyle = '#e4e4e4'; g.fillRect(0, 0, w, h); blot(g, w, h, 40, 'rgba(255,255,255,.18)', 30, 120); blot(g, w, h, 40, 'rgba(0,0,0,.16)', 30, 120);
    strokes(g, w, h, 9000, ['rgba(255,255,255,.12)', 'rgba(0,0,0,.14)', 'rgba(220,230,160,.12)'], [3, 9], [1, 2]); noise(g, w, h, 8000, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.08)']); });
  const mudT = tex(512, 512, (g, w, h) => { g.fillStyle = '#dadada'; g.fillRect(0, 0, w, h); blot(g, w, h, 60, 'rgba(0,0,0,.18)', 10, 70); blot(g, w, h, 40, 'rgba(255,255,255,.12)', 10, 50);
    for (let i = 0; i < 90; i++) { g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 1 + rnd() * 2; g.beginPath(); let x = rnd() * w, y = rnd() * h; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += rnd() * 30 - 15; y += rnd() * 30 - 15; g.lineTo(x, y); } g.stroke(); }
    noise(g, w, h, 12000, ['rgba(0,0,0,.1)', 'rgba(255,255,255,.08)']); });
  const rockT = (base, lines) => tex(512, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); blot(g, w, h, 50, 'rgba(0,0,0,.14)', 20, 90); blot(g, w, h, 40, 'rgba(255,255,255,.1)', 20, 80);
    for (let i = 0; i < lines; i++) { g.strokeStyle = `rgba(0,0,0,${.06 + rnd() * .1})`; g.lineWidth = 1 + rnd() * 3; g.beginPath(); const y = rnd() * h; g.moveTo(0, y); for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x * .02 + i) * 6 + rnd() * 3); g.stroke(); }
    noise(g, w, h, 16000, ['rgba(0,0,0,.12)', 'rgba(255,255,255,.1)'], [1, 4]); });
  const saltT = tex(512, 512, (g, w, h) => { g.fillStyle = '#d8d5ce'; g.fillRect(0, 0, w, h); for (let i = 0; i < 7; i++) { g.fillStyle = `rgba(${120 + rnd() * 40},${110 + rnd() * 30},${100 + rnd() * 30},${.12 + rnd() * .14})`; const y = rnd() * h; g.fillRect(0, y, w, 8 + rnd() * 30); }
    for (let i = 0; i < 34; i++) { g.strokeStyle = `rgba(90,80,72,${.12 + rnd() * .2})`; g.lineWidth = 2 + rnd() * 6; g.beginPath(); const y = rnd() * h; g.moveTo(0, y); for (let x = 0; x <= w; x += 24) g.lineTo(x, y + Math.sin(x * .015 + i) * 10); g.stroke(); }
    for (let i = 0; i < 500; i++) { const x = rnd() * w, y = rnd() * h, s = 3 + rnd() * 10; g.fillStyle = `rgba(255,255,255,${.15 + rnd() * .3})`; g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + s * .8, y); g.lineTo(x, y + s); g.lineTo(x - s * .8, y); g.fill(); }
    blot(g, w, h, 30, 'rgba(150,140,120,.16)', 20, 90); noise(g, w, h, 14000, ['rgba(0,0,0,.07)', 'rgba(255,255,255,.12)']); });
  const rustT = tex(512, 512, (g, w, h) => { g.fillStyle = '#e0e0e0'; g.fillRect(0, 0, w, h); blot(g, w, h, 50, 'rgba(120,50,20,.35)', 10, 60); blot(g, w, h, 30, 'rgba(0,0,0,.25)', 10, 50);
    for (let i = 0; i < 120; i++) { g.strokeStyle = `rgba(90,40,15,${.15 + rnd() * .3})`; g.lineWidth = 1 + rnd() * 3; const x = rnd() * w, y = rnd() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + rnd() * 4 - 2, y + 20 + rnd() * 70); g.stroke(); }
    noise(g, w, h, 12000, ['rgba(0,0,0,.12)', 'rgba(255,255,255,.08)']); });
  const paintT = tex(256, 256, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); blot(g, w, h, 20, 'rgba(0,0,0,.08)', 10, 50); for (let i = 0; i < 40; i++) { g.strokeStyle = 'rgba(90,50,20,.18)'; g.lineWidth = 1 + rnd() * 2; const x = rnd() * w; g.beginPath(); g.moveTo(x, rnd() * h); g.lineTo(x + rnd() * 2, h); g.stroke(); } noise(g, w, h, 4000, ['rgba(0,0,0,.06)', 'rgba(255,255,255,.06)']); });
  // UV planas por eje dominante (los modelos de Blender no traen UV)
  function boxUV(geo, sc) { const p = geo.attributes.position, n = geo.attributes.normal, uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) { const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i)), x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (ay >= ax && ay >= az) { uv[i * 2] = x / sc; uv[i * 2 + 1] = z / sc; } else if (ax >= az) { uv[i * 2] = z / sc; uv[i * 2 + 1] = y / sc; } else { uv[i * 2] = x / sc; uv[i * 2 + 1] = y / sc; } }
    geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); }

  // ---------- agua: un solo shader para el lago en calma, el remolino, el canal y la poza ----------
  const WU = () => ({ uTime: { value: 0 }, uSun: { value: SUN }, uSunCol: { value: new T.Color('#fff2dc') }, uTop: skyU.top, uMid: skyU.mid, uHor: skyU.hor,
    uDeep: { value: new T.Color('#3e4a34') }, uShal: { value: new T.Color('#7d7c52') }, uFogC: { value: scene.fog.color }, uFogD: { value: scene.fog.density },
    uVS: { value: 0 }, uVR: { value: 70 }, uVD: { value: 26 }, uLevel: { value: 0 }, uC: { value: new T.Vector2(0, 0) }, uSpin: { value: 0 }, uAlpha: { value: .86 }, uMud: { value: 0 }, uFlow: { value: new T.Vector2(0, 0) }, uClip: { value: 0 }, uDbg: { value: 0 } });
  const WVS = `uniform float uTime,uVS,uVR,uVD,uLevel; uniform vec2 uC; varying vec3 vW; varying float vD;
    float fun(vec2 p){ float r=length(p-uC), k=uVS; if(k<.001) return 0.; float R=uVR*(.4+.6*k); float q=1.-smoothstep(0.,R,r); return -(uVD*k*q*q + 60.*k*k*(1.-smoothstep(0.,7.*k+1.5,r))); }
    void main(){ vec4 w=modelMatrix*vec4(position,1.); float f=fun(w.xz); float wv=.07*sin(w.x*.35+uTime*1.3)+.05*sin(w.z*.43-uTime*1.1)+.03*sin((w.x+w.z)*.9+uTime*2.1);
      w.y=uLevel+f+wv*(1.-clamp(-f/6.,0.,1.)); vW=w.xyz; vD=-f; gl_Position=projectionMatrix*viewMatrix*w; }`;
  const WFS = `uniform float uDbg,uTime,uVS,uVR,uVD,uLevel,uSpin,uAlpha,uFogD,uMud,uClip; uniform vec2 uC,uFlow; uniform vec3 uSun,uSunCol,uTop,uMid,uHor,uDeep,uShal,uFogC; varying vec3 vW; varying float vD;
    float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
    float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<4;i++){ s+=a*n2(p); p=mat2(1.6,1.2,-1.2,1.6)*p; a*=.5; } return s; }
    float fun(vec2 p){ float r=length(p-uC), k=uVS; if(k<.001) return 0.; float R=uVR*(.4+.6*k); float q=1.-smoothstep(0.,R,r); return -(uVD*k*q*q + 60.*k*k*(1.-smoothstep(0.,7.*k+1.5,r))); }
    vec3 skyc(vec3 d){ float h=d.y; vec3 c=h>.06?mix(uMid,uTop,smoothstep(.06,.7,h)):mix(uHor,uMid,smoothstep(-.04,.06,h)); return c; }
    void main(){
      if(uClip>.5){ vec2 q=vW.xz; float a=atan(q.y,q.x); float w=1.+.06*sin(3.*a+.7)+.04*sin(5.*a-1.1); float r=sqrt((q.x/185.)*(q.x/185.)+(q.y/150.)*(q.y/150.))/w; if(r>.955) discard; }
      vec2 d=vW.xz-uC; float r=length(d)+1e-3; float ang=atan(d.y,d.x);
      // giro: cuanto más cerca del centro, más rápido (vórtice libre)
      float om=uSpin*(1.6/(1.+r/(uVR*.35+1.)));
      float a2=ang-om; vec2 sw=vec2(cos(a2),sin(a2))*r;
      vec2 P=mix(vW.xz, sw, clamp(uVS*3.,0.,1.)) + uFlow*uTime;
      // rizos: normal de ruido en dos escalas + pendiente del embudo
      float e=.6; float f0=fun(vW.xz), fx=fun(vW.xz+vec2(e,0.)), fz=fun(vW.xz+vec2(0.,e));
      vec2 g=vec2(fx-f0,fz-f0)/e;
      vec2 P1=P*.22+vec2(uTime*.08,uTime*.05), P2=P*.9+vec2(-uTime*.21,uTime*.17);
      float b0=fbm(P1), bx=fbm(P1+vec2(.05,0.)), bz=fbm(P1+vec2(0.,.05)); float c0=fbm(P2), cx=fbm(P2+vec2(.05,0.)), cz=fbm(P2+vec2(0.,.05));
      vec2 rip=vec2(bx-b0,bz-b0)*5.+vec2(cx-c0,cz-c0)*2.2;
      vec3 n=normalize(vec3(-g.x-rip.x*(1.+uVS*2.), 1., -g.y-rip.y*(1.+uVS*2.)));
      vec3 V=normalize(cameraPosition-vW); float F=.02+.98*pow(1.-max(dot(n,V),0.),5.);
      vec3 refl=skyc(reflect(-V,n)); float dep=clamp(vD/40.,0.,1.);
      vec3 body=mix(uShal,uDeep,.45+.55*dep); body=mix(body,vec3(.32,.25,.16),uMud*.6+dep*.35);
      body*=.85+.35*max(dot(n,uSun),0.); vec3 c=mix(body,refl,clamp(F*.9+.08,0.,1.));
      float sp=pow(max(dot(reflect(-uSun,n),V),0.),220.); c+=uSunCol*sp*3.2;
      // espuma en espiral (remolino) y bandas blancas
      float lr=log(r+1.); float spi=fbm(vec2(a2*2.2+lr*3.5, lr*6.-uTime*.6))+.35*fbm(vec2(a2*7.,lr*14.));
      float fine=fbm(vec2(a2*18.+lr*9., lr*40.)); float foam=(smoothstep(.66,.86,spi)*.75+smoothstep(.62,.8,fine)*.35)*clamp(uVS*2.2,0.,1.)*smoothstep(3.,14.,r)*smoothstep(uVR*1.8,uVR*.5,r);
      foam+=smoothstep(.6,.9,fbm(P*.6+uTime*.3))*clamp(uVS*2.,0.,1.)*smoothstep(uVR*.7,uVR*.2,r)*.45;
      c=mix(c,vec3(.93,.92,.86),clamp(foam,0.,.95));
      c*=1.-.62*smoothstep(6.,45.,vD); c=mix(c,vec3(.16,.13,.09),smoothstep(30.,70.,vD)*.7);
      float dist=length(cameraPosition-vW); float fg=1.-exp(-uFogD*uFogD*dist*dist); c=mix(c,uFogC,fg);
      if(uDbg>.5&&uDbg<1.5) c=body; if(uDbg>1.5&&uDbg<2.5) c=refl; if(uDbg>2.5) c=vec3(F);
      gl_FragColor=vec4(c, mix(uAlpha,1.,max(F,clamp(uVS*4.,0.,1.)))); }`;
  const waterMat = (u, o = {}) => new T.ShaderMaterial(Object.assign({ uniforms: u, vertexShader: WVS, fragmentShader: WFS, transparent: true, depthWrite: true }, o));
  // malla polar (anillos muy densos en el centro para el embudo)
  function polarGeo(Rmax, NR, NA, pw = 2.2) { const pos = [], idx = []; pos.push(0, 0, 0);
    for (let i = 1; i <= NR; i++) { const r = Rmax * Math.pow(i / NR, pw); for (let j = 0; j < NA; j++) { const a = j / NA * Math.PI * 2; pos.push(Math.cos(a) * r, 0, Math.sin(a) * r); } }
    for (let j = 0; j < NA; j++) idx.push(0, 1 + (j + 1) % NA, 1 + j);
    for (let i = 1; i < NR; i++) for (let j = 0; j < NA; j++) { const a = 1 + (i - 1) * NA + j, b = 1 + (i - 1) * NA + (j + 1) % NA, c = 1 + i * NA + j, d = 1 + i * NA + (j + 1) % NA; idx.push(a, b, d, a, d, c); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); const nr = new Float32Array(pos.length); for (let i = 1; i < nr.length; i += 3) nr[i] = 1; g.setAttribute('normal', new T.BufferAttribute(nr, 3)); g.setIndex(idx); return g; }
  const LU = WU(); const lake = new T.Mesh(polarGeo(1200, 230, 224), waterMat(LU)); lake.frustumCulled = false; lake.renderOrder = 2; scene.add(lake);
  // canal de Delcambre (tira de agua propia: sigue a nivel del mar cuando el lago se vacía)
  const CU = WU(); CU.uAlpha.value = .9; CU.uFlow.value.set(0, 0);
  const [c0, c1] = LAY.canal; const cdx = c1[0] - c0[0], cdz = c1[1] - c0[1], cL = Math.hypot(cdx, cdz), cang = Math.atan2(cdz, cdx);
  const canal = new T.Mesh(new T.PlaneGeometry(cL + 16, 34, 120, 4), waterMat(CU)); canal.geometry.rotateX(-Math.PI / 2); canal.rotation.y = -cang;
  canal.position.set((c0[0] + c1[0]) / 2 - Math.cos(cang) * 8, 0, (c0[1] + c1[1]) / 2 - Math.sin(cang) * 8); canal.visible = false; canal.renderOrder = 2; scene.add(canal);
  const CANAL_DIR = new T.Vector2(Math.cos(cang), Math.sin(cang));

  // ---------- cascada (lámina curvada con vetas que bajan, espuma y bruma) ----------
  const FU = { uTime: { value: 0 }, uK: { value: 0 }, uFogC: { value: scene.fog.color }, uFogD: { value: scene.fog.density }, uSun: { value: SUN } };
  const fallMat = new T.ShaderMaterial({ uniforms: FU, transparent: true, depthWrite: false, side: T.DoubleSide,
    vertexShader: 'varying vec2 vUv; varying vec3 vW; void main(){ vUv=uv; vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader: `uniform float uTime,uK,uFogD; uniform vec3 uFogC; varying vec2 vUv; varying vec3 vW;
      float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
      void main(){ float u=vUv.x, v=1.-vUv.y; float sp=uTime*(1.2+v*2.2);
        float st=n2(vec2(u*60., v*2.-sp*2.))*.5+n2(vec2(u*140., v*4.-sp*3.5))*.3+n2(vec2(u*20., v*1.2-sp))*.2;
        vec3 deep=vec3(.34,.42,.36), wh=vec3(.96,.97,.95); float foam=smoothstep(.3,.75,st)*(.6+.4*v)+smoothstep(.7,1.,v)*.7;
        vec3 c=mix(deep,wh,clamp(foam,0.,1.)); c+=vec3(.15)*smoothstep(0.,.08,v)*(1.-smoothstep(.08,.2,v));
        float edge=smoothstep(0.,.12,u)*smoothstep(1.,.88,u); float a=edge*uK*(.82+.18*st)*(1.-smoothstep(.9,1.,v)*.5);
        float dist=length(cameraPosition-vW); c=mix(c,uFogC,1.-exp(-uFogD*uFogD*dist*dist)); gl_FragColor=vec4(c,a); }` });
  const FALL = new T.Group(); scene.add(FALL);
  { const g = new T.PlaneGeometry(1, 1, 30, 60), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const u = p.getX(i) + .5, v = .5 - p.getY(i); const out = 9 * Math.pow(v, .55) + 2.5 * v, y = -48 * Math.pow(v, 1.15); const wdt = 26 + 10 * v; p.setXYZ(i, (u - .5) * wdt, y, out); }
    g.computeVertexNormals(); const m = new T.Mesh(g, fallMat); m.renderOrder = 5; FALL.add(m); FALL.userData.sheet = m; }
  // bruma y salpicaduras (sprites)
  const puffT = tex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.5, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const MIST = []; for (let i = 0; i < 46; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: puffT, color: '#eef2f0', transparent: true, depthWrite: false, opacity: 0, fog: true })); s.renderOrder = 6; FALL.add(s); MIST.push(s); }
  // lugar de la cascada: boca del canal sobre la pared de la cuenca hundida
  { const ang = Math.atan2(c0[1], c0[0]), er = (a) => { const w = 1 + .06 * Math.sin(3 * a + .7) + .04 * Math.sin(5 * a - 1.1); return w / Math.sqrt((Math.cos(a) / 185) ** 2 + (Math.sin(a) / 150) ** 2); }, rr = er(ang) * .95;
    FALL.position.set(Math.cos(ang) * rr, 0, Math.sin(ang) * rr); FALL.rotation.y = Math.atan2(-Math.cos(ang), -Math.sin(ang)); FALL.visible = false; FALL.userData.ang = ang; }

  // ---------- carga del GLB (modelado en Blender) ----------
  const G = {}; const ZG = {}; let BARGES = [], TREES = []; const SHRIMPS = [], ISLTREES = [], BITL = [];
  const MATBY = {};
  const READY_W = new Promise((resolve, reject) => {
    const b64 = window.GLB_LAGO, bin = atob(b64), buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    new GLTFLoader().parse(buf.buffer, '', gl => { gl.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => { MATBY[m.name] = MATBY[m.name] || []; MATBY[m.name].push(m); }); } });
      gl.scene.children.slice().forEach(o => { G[o.name] = o; }); scene.add(gl.scene); build(); resolve(); }, e => reject(e)); });
  const meshesOf = o => { const L = []; o.traverse(c => { if (c.isMesh) L.push(c); }); return L; };
  function upgradeMaterials() {
    const each = (n, f) => (MATBY[n] || []).forEach(f);
    each('terrain', m => { m.vertexColors = true; m.map = grassT; m.map.repeat.set(1, 1); m.roughness = .97; m.metalness = 0; m.color.set('#ffffff'); m.onBeforeCompile = sh => { sh.uniforms.uDrain = DRAIN; sh.uniforms.uHole = HOLE; sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWp=(modelMatrix*vec4(transformed,1.)).xyz;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp; uniform float uDrain, uHole;').replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
        if(uDrain>.5){ float a=atan(vWp.z,vWp.x); float w=1.+.06*sin(3.*a+.7)+.04*sin(5.*a-1.1); float r=sqrt((vWp.x/185.)*(vWp.x/185.)+(vWp.z/150.)*(vWp.z/150.))/w; if(r<.93) discard; }
        if(length(vWp.xz)<uHole) discard;`); }; m.needsUpdate = true; });
    each('basin_mud', m => { m.vertexColors = true; m.map = mudT; m.roughness = .85; m.envMapIntensity = .25; m.color.set('#ffffff'); m.side = THREE.DoubleSide; });
    each('lake_mud', m => { m.map = mudT; });
    ['strat_clay', 'strat_sand'].forEach(n => each(n, m => { m.map = rockT('#e2e2e2', 70); m.roughness = .95; m.map.repeat.set(2, 2); }));
    ['strat_salt', 'strat_salt_dark'].forEach(n => each(n, m => { m.map = saltT; m.roughness = .55; }));
    ['barge_rust', 'rig_hull'].forEach(n => each(n, m => { m.map = rustT; m.roughness = .7; }));
    ['rig_derrick', 'paint_white', 'paint_yellow', 'paint_red', 'paint_blue', 'boat_green', 'tin_roof', 'rig_deck', 'steel_dark'].forEach(n => each(n, m => { m.map = paintT; }));
    each('lamp_glow', m => { m.emissiveIntensity = 4; m.toneMapped = false; });
    each('glass', m => { m.metalness = .6; m.roughness = .08; m.envMapIntensity = 1.6; });
    Object.values(MATBY).flat().forEach(m => { if (m.envMapIntensity === 1) m.envMapIntensity = .8; });
    // UV para las texturas pintadas
    Object.values(G).forEach(o => meshesOf(o).forEach(me => { if (!me.geometry.attributes.uv) boxUV(me.geometry, me.name.startsWith('terrain') || o.name === 'terrain' ? 14 : (o.name === 'corte' || o.name === 'mine' ? 18 : (o.name === 'basin' ? 9 : 3))); }));
  }
  const DRAIN = { value: 0 }, HOLE = { value: 0 };
  // mallas
  const clone = (n, x, y, z, ry = 0, s = 1) => { const o = G[n].clone(true); o.position.set(x, y, z); o.rotation.y = ry; o.scale.setScalar(s); scene.add(o); return o; };
  const RIG = { main: null, corte: null }; let BASIN, TERR, CORTE, MINE, SHAFT, CAGE, BIT, HOUSE, HEAD, TUG;
  const CX = LAY.corte.cx, ZF = LAY.corte.zf, SX = LAY.corte.shaft, PIPEX = CX + 49;
  // agua de la sección: lámina de 3 m encima del fondo del lago (cara cortada), superficie, chorro en la mina, inundación y embudo
  const SU = WU(); SU.uC.value.set(PIPEX, ZF); SU.uVR.value = 28; SU.uVD.value = 12;
  const secWaterMat = new T.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uK: { value: 0 } }, transparent: true, depthWrite: false,
    vertexShader: 'varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader: `uniform float uTime; varying vec3 vW; float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
      void main(){ float d=clamp(-vW.y/3.4,0.,1.); vec3 c=mix(vec3(.42,.56,.46),vec3(.16,.26,.22),d); float ca=n2(vW.xz*.4+vec2(uTime*.3,0.))*n2(vW.xy*.7-vec2(0.,uTime*.2)); c+=vec3(.25,.3,.2)*smoothstep(.45,.7,ca)*(1.-d);
        float bub=step(.985,h2(floor(vW.xy*2.)+floor(uTime*3.))); c+=bub*.15; c=mix(c,vec3(.85,.95,.9),smoothstep(-.25,0.,vW.y)*.6); gl_FragColor=vec4(c,.72); }` });
  const jetMat = new T.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uK: { value: 0 } }, transparent: true, depthWrite: false, side: T.DoubleSide,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform float uTime,uK; varying vec2 vUv; float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
      void main(){ float st=n2(vec2(vUv.x*24.,vUv.y*6.+uTime*9.))*.6+n2(vec2(vUv.x*60.,vUv.y*14.+uTime*14.))*.4; vec3 c=mix(vec3(.30,.40,.36),vec3(.95,.97,.95),smoothstep(.45,.85,st)); float a=uK*(.35+.6*smoothstep(.3,.8,st)); gl_FragColor=vec4(c,a); }` });
  let SECW, SECTOP, JET, FLOOD, FUNNEL, PIPE_SEC;
  function build() {
    upgradeMaterials(); inkify();
    { const far = new T.Mesh(new T.RingGeometry(745, 9000, 96, 1), new T.MeshStandardMaterial({ color: '#4a5a30', roughness: 1 })); far.rotation.x = -Math.PI / 2; far.position.set(150, 1.0, 150); far.receiveShadow = true; scene.add(far); }
    TERR = G.terrain; BASIN = G.basin; BASIN.visible = false; G.crater.visible = false;
    meshesOf(TERR).forEach(m => { m.castShadow = false; m.receiveShadow = true; });
    // plataforma en el centro del lago (flota: el casco cala 1,4 m)
    RIG.main = G.rig; RIG.main.position.set(0, 0, 0);
    // barcazas amarradas junto a la boca del canal y en la orilla oeste (11 en total, como en la historia)
    const spots = [[-92, 78, .55], [-80, 94, .55], [-68, 110, .62], [-110, 58, .4], [-122, 40, .3], [-40, 120, 1.25], [-26, 112, 1.3], [-140, 20, .2], [30, 118, 1.5], [44, 110, 1.6], [-55, 60, .9]];
    BARGES = spots.map(([x, z, ry], i) => { const o = clone('barge' + (i % 4), x, 0, z, ry); o.userData.home = new T.Vector3(x, 0, z); o.userData.ry = ry; return o; });
    ['barge0', 'barge1', 'barge2', 'barge3'].forEach(n => G[n].visible = false);
    TUG = G.tug; TUG.position.set(-60, 0, 84); TUG.rotation.y = .9;
    // camaroneros y muelle en el canal (Delcambre)
    const cp = (k, off) => [c0[0] + cdx * k - CANAL_DIR.y * off, c0[1] + cdz * k + CANAL_DIR.x * off];
    [[.06, 9, 0], [.12, -10, Math.PI], [.2, 9, 0], [.3, -9, .1]].forEach(([k, off, rr]) => { const [x, z] = cp(k, off); const o = clone('shrimp', x, .3, z, -cang + rr); o.userData.home = o.position.clone(); o.userData.ry = o.rotation.y; SHRIMPS.push(o); }); G.shrimp.visible = false;
    { const [x, z] = cp(.16, 22); G.dock.position.set(x, 0, z); G.dock.rotation.y = -cang; }
    // árboles (instanciados: robles con musgo y cipreses)
    const toInst = (src, list) => { meshesOf(src).forEach(me => { const im = new T.InstancedMesh(me.geometry, me.material, list.length); const M = new T.Matrix4(), q = new T.Quaternion();
      list.forEach((t, i) => { q.setFromEuler(new T.Euler(0, t[3], 0)); M.compose(new T.Vector3(t[0], t[1], t[2]), q, new T.Vector3(t[4], t[4] * (.9 + (i % 5) * .05), t[4])); im.setMatrixAt(i, M); });
      im.castShadow = true; im.receiveShadow = true; im.userData.noInk = true; scene.add(im); TREES.push(im); }); src.visible = false; };
    toInst(G.tree_oak, LAY.trees.filter(t => !t[5])); toInst(G.tree_cypress, LAY.trees.filter(t => t[5]));
    HOUSE = G.house; HEAD = G.headframe;
    // árboles de la orilla de la isla que se irán al remolino (sueltos, para poder animarlos)
    for (let i = 0; i < 9; i++) { const a = -.5 + i * .065, er = (1 + .06 * Math.sin(3 * a + .7) + .04 * Math.sin(5 * a - 1.1)) / Math.sqrt((Math.cos(a) / 185) ** 2 + (Math.sin(a) / 150) ** 2), rr = er * (1.03 + (i % 3) * .025), x = Math.cos(a) * rr, z = Math.sin(a) * rr; const o = clone(i % 3 ? 'tree_oak' : 'tree_cypress', x, ground(x, z) - .3, z, i * 1.7, .9 + (i % 4) * .1); o.visible = true; o.traverse(c => c.visible = true); o.userData.home = o.position.clone(); ISLTREES.push(o); }
    // lecho de sal bajo la broca (primer plano del agujero)
    { const sm = new T.MeshStandardMaterial({ color: '#d8d2c6', map: saltT, roughness: .6 }); const slab = new T.Mesh(new T.CylinderGeometry(6, 6.4, 2, 48, 4), sm); slab.position.set(CX, -501.05, 400); slab.receiveShadow = true; scene.add(slab);
      const pit = new T.Mesh(new T.CircleGeometry(.2, 32), new T.MeshStandardMaterial({ color: '#2a241e', roughness: 1 })); pit.rotation.x = -Math.PI / 2; pit.position.set(CX, -500.04, 400); scene.add(pit);
      const bl = new T.PointLight('#ffd8a0', 14, 12, 1.5); bl.position.set(CX + 1.5, -497.5, 401.5); scene.add(bl); BITL.push(bl); }
    // ---- sección ----
    CORTE = G.corte; MINE = G.mine; SHAFT = G.shaft; CAGE = G.cage; BIT = G.bit;
    RIG.corte = clone('rig', PIPEX - 6, 0, ZF - 9, 0);
    clone('headframe', SX, 7.6, ZF - 4.5, 0, .8);
    CAGE.position.set(SX, -373.6, ZF - 4.5);
    // tierra y agua que siguen detrás y a los lados del diorama (horizonte creíble)
    const gm = new T.MeshStandardMaterial({ color: '#56663a', map: grassT, roughness: .97 }); grassT.repeat.set(1, 1);
    const land = new T.Mesh(new T.PlaneGeometry(1600, 1600), gm); land.rotation.x = -Math.PI / 2; land.position.set(CX - 870, 7.5, -500); land.receiveShadow = true; scene.add(land);
    SECTOP = new T.Mesh(new T.PlaneGeometry(1800, 1800, 200, 200), waterMat(SU)); SECTOP.geometry.rotateX(-Math.PI / 2); SECTOP.position.set(CX + 830, 0, ZF - 900); SECTOP.renderOrder = 2; scene.add(SECTOP);
    // recorte para que el agua de arriba no sobresalga de la cara cortada
    SU.uClip.value = 0;
    SECW = new T.Mesh(new T.BoxGeometry(212, 3.4, .4), secWaterMat); SECW.position.set(CX + 44, -1.7, ZF + .05); SECW.renderOrder = 3; scene.add(SECW);
    // tubería de perforación en la sección (desde la plataforma hasta la mina)
    PIPE_SEC = new T.Mesh(new T.CylinderGeometry(.45, .45, 1, 10), new T.MeshStandardMaterial({ color: '#7a7d80', metalness: .8, roughness: .35 })); PIPE_SEC.position.set(PIPEX, -180, ZF + .2); scene.add(PIPE_SEC);
    JET = new T.Mesh(new T.CylinderGeometry(1, 1.6, 16, 16, 1, true), jetMat); JET.position.set(PIPEX, -366, ZF - 7); JET.visible = false; scene.add(JET);
    FLOOD = new T.Mesh(new T.PlaneGeometry(300, 260, 60, 60), waterMat(Object.assign(WU(), {}))); FLOOD.geometry.rotateX(-Math.PI / 2); FLOOD.position.set(CX, -373.9, ZF - 100); FLOOD.visible = false; FLOOD.material.uniforms.uAlpha.value = .8; FLOOD.material.uniforms.uFogD.value = 0; scene.add(FLOOD);
    // embudo que se abre en la sección (agua que baja por el agujero creciente)
    const fg = new T.BufferGeometry(); const NV = 40, pos = [], idx = []; for (let i = 0; i <= NV; i++) { const v = i / NV; pos.push(-1, -v, 0, 1, -v, 0); if (i < NV) { const a = i * 2; idx.push(a, a + 1, a + 3, a, a + 3, a + 2); } }
    fg.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); fg.setIndex(idx); const fuv = []; for (let i = 0; i <= NV; i++) fuv.push(0, i / NV, 1, i / NV); fg.setAttribute('uv', new T.Float32BufferAttribute(fuv, 2));
    const funM = new T.ShaderMaterial({ uniforms: { uTime: jetMat.uniforms.uTime, uK: { value: 0 } }, transparent: true, depthWrite: false, side: T.DoubleSide,
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: `uniform float uTime,uK; varying vec2 vUv; float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
        float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
        void main(){ float u=vUv.x, v=vUv.y; float sw=n2(vec2(u*10.+v*14.-uTime*1.5, v*30.-uTime*4.))*.6+n2(vec2(u*26.-v*20.+uTime*2., v*60.-uTime*6.))*.4;
          vec3 c=mix(vec3(.20,.24,.20),vec3(.42,.50,.44),smoothstep(.35,.8,sw)); float edge=smoothstep(0.,.08,u)*smoothstep(1.,.92,u); c=mix(vec3(.85,.9,.86),c,smoothstep(0.,.06,u)*smoothstep(1.,.94,u)); c*=.8+.2*(1.-v);
          gl_FragColor=vec4(c,uK*(.92)); }` });
    FUNNEL = new T.Mesh(fg, funM); FUNNEL.position.set(PIPEX, -3.2, ZF + .15); FUNNEL.visible = false; FUNNEL.renderOrder = 4; scene.add(FUNNEL);
    // luces de la mina
    for (let i = 0; i < 6; i++) { const l = new T.PointLight('#ffd9a0', 0, 70, 1.6); l.position.set(CX - 120 + i * 48, -362, ZF - 10); scene.add(l); MINEL.push(l); }
    for (let i = 0; i < 5; i++) { const l = new T.PointLight('#ffd9a0', 0, 60, 1.6); l.position.set(CX - 100 + i * 50, -362, ZF - 70); scene.add(l); MINEL.push(l); }
    // camiones de mina
    G.minetruck.position.set(CX - 40, -374, ZF - 20); G.minetruck.rotation.y = .2; clone('minetruck', CX + 70, -374, ZF - 50, 2.8);
    // broca para el primer plano (aparte, sobre un lecho de sal)
    BIT.position.set(CX, -500, 400);
    setMood('dia');
  }
  const MINEL = [];
  // ---------- contorno de tinta ----------
  const inkM = new T.ShaderMaterial({ side: T.BackSide, uniforms: { k: { value: .0009 }, col: { value: new T.Color('#1b1720') } },
    vertexShader: 'uniform float k; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec3 n=normalize(normalMatrix*normal); mv.xyz+=n*(-mv.z)*k; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; void main(){ gl_FragColor=vec4(col,1.); }' });
  function inkify() { ['rig', 'barge0', 'barge1', 'barge2', 'barge3', 'tug', 'shrimp', 'house', 'headframe', 'minetruck', 'cage', 'dock'].forEach(n => { if (!G[n]) return;
    meshesOf(G[n]).forEach(o => { let g = o.geometry.clone(); ['normal', 'uv', 'color'].forEach(a => g.deleteAttribute(a)); g = mergeVertices(g, 1e-3); g.computeVertexNormals(); g.clearGroups(); const h = new T.Mesh(g, inkM); h.castShadow = false; h.userData.noInk = true; o.add(h); }); });
    // los clones se hicieron antes: re-clonar no hace falta, se añaden a mano
    scene.traverse(o => { if (o.isMesh && o.parent && o.parent.isObject3D && o.material === inkM) return; }); }

  // ---------- ambientes ----------
  const MOODS = {
    dia: { sun: '#fff0d8', sunI: 3.6, dir: [-.55, .42, .72], hemi: '#cfe2ff', ground: '#6a5a44', hemiI: 1.1, fog: '#cfdde4', fogD: .0011, exp: 1.05, top: '#2f6fc4', mid: '#8fbde8', hor: '#e6eef0', cloud: .55, dark: 0 },
    drama: { sun: '#ffd6a8', sunI: 2.6, dir: [-.62, .3, .72], hemi: '#b8c4d8', ground: '#6a5c4a', hemiI: 1.35, fog: '#b9c2c6', fogD: .0016, exp: 1.08, top: '#3a5a8a', mid: '#8a9ab0', hor: '#d8d4cc', cloud: .85, dark: .35 },
    corte: { sun: '#fff0d8', sunI: 3.4, dir: [-.45, .55, .7], hemi: '#d8e8ff', ground: '#8a7a62', hemiI: 1.3, fog: '#d4e0e6', fogD: .0006, exp: 1.08, top: '#2f6fc4', mid: '#8fbde8', hor: '#e6eef0', cloud: .5, dark: 0 },
    mina: { sun: '#fff0d8', sunI: 0, dir: [-.45, .55, .7], hemi: '#ffe6c0', ground: '#3a3028', hemiI: .18, fog: '#1a1612', fogD: .006, exp: 1.2, top: '#2f6fc4', mid: '#8fbde8', hor: '#e6eef0', cloud: .5, dark: 0, bg: '#0d0b09', mineL: 340 },
    bit: { sun: '#ffe8c8', sunI: 2.4, dir: [-.3, .8, .5], hemi: '#ffe6c0', ground: '#5a4a3a', hemiI: .5, fog: '#2a2018', fogD: .02, exp: 1.1, top: '#2f6fc4', mid: '#8fbde8', hor: '#e6eef0', cloud: .5, dark: 0, bg: '#17120e' },
    tarde: { sun: '#ffd2a0', sunI: 3.0, dir: [-.7, .22, .68], hemi: '#d8d0e8', ground: '#6a5040', hemiI: 1.0, fog: '#e8d6c4', fogD: .0012, exp: 1.06, top: '#3a6ab8', mid: '#a8b8d8', hor: '#f4dcc0', cloud: .45, dark: 0 },
  };
  let MOOD = 'dia';
  function setMood(m) { if (!MOODS[m]) m = 'dia'; MOOD = m; const M = MOODS[m];
    sun.color.set(M.sun); sun.intensity = M.sunI; SUN.set(...M.dir).normalize(); hemi.color.set(M.hemi); hemi.groundColor.set(M.ground); hemi.intensity = M.hemiI;
    scene.fog.color.set(M.fog); scene.fog.density = M.fogD; R.toneMappingExposure = M.exp; skyU.top.value.set(M.top); skyU.mid.value.set(M.mid); skyU.hor.value.set(M.hor); skyU.cloud.value = M.cloud; skyU.dark.value = M.dark;
    [LU, CU, SU].forEach(u => { u.uFogD.value = M.fogD; }); FU.uFogD.value = M.fogD;
    scene.background = M.bg ? new T.Color(M.bg) : null; sky.visible = !M.bg;
    MINEL.forEach(l => { l.intensity = M.mineL || 0; l.visible = !!M.mineL; }); }
  function setCam(pos, look, fov = 40, focus = null, ap = .002) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    // sombra del sol centrada en lo que mira la cámara, con tamaño según la distancia
    const D = Math.max(20, Math.min(260, pos.distanceTo(look) * 1.1)); const sc = sun.shadow.camera; if (sc.right !== D) { sc.left = -D; sc.right = D; sc.top = D; sc.bottom = -D; sc.near = 1; sc.far = D * 6; sc.updateProjectionMatrix(); }
    sun.position.copy(look).addScaledVector(SUN, D * 3); sun.target.position.copy(look); sun.target.updateMatrixWorld();
    dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }

  // ---------- estado del agua ----------
  // vórtice: k 0…1 (fuerza), spin (fase acumulada); nivel del lago; vaciado (0 lleno, 1 cuenca seca con cascada)
  const WS = { vs: 0, spin: 0, level: 0, drain: 0, fall: 0, pool: -52 };
  const sst = (a, b, x) => { const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  function funJS(x, z) { const r = Math.hypot(x, z), k = WS.vs; if (k < .001) return 0; const R = LU.uVR.value * (.4 + .6 * k), q = 1 - sst(0, R, r); return -(LU.uVD.value * k * q * q + 60 * k * k * (1 - sst(0, 7 * k + 1.5, r))); }
  // radio dentro del cual el agua baja más que el fondo (3 m): ahí se quita el fondo y se ve el cráter
  function holeR() { if (WS.vs < .02) return 0; let r = 0; for (let x = 0; x < 200; x += .5) if (funJS(x, 0) < -2.6) r = x; return r; }
  function waterY(x, z, t = 0) { return WS.level + funJS(x, z) + .07 * Math.sin(x * .35 + t * 1.3) + .05 * Math.sin(z * .43 - t * 1.1); }
  function setWater(o) { Object.assign(WS, o); LU.uVS.value = WS.vs; LU.uSpin.value = WS.spin; LU.uLevel.value = WS.drain > .5 ? WS.pool : WS.level;
    DRAIN.value = WS.drain > .5 ? 1 : 0; BASIN.visible = WS.drain > .5; canal.visible = WS.drain > .5; LU.uClip.value = WS.drain > .5 ? 1 : 0; LU.uMud.value = WS.drain > .5 ? .8 : 0;
    FALL.visible = WS.fall > 0; FU.uK.value = WS.fall;
    const hr = WS.drain > .5 ? 0 : holeR(); HOLE.value = hr; G.crater.visible = hr > 1; if (hr > 1) G.crater.scale.set((hr + 6) / 40, 1 + hr / 120, (hr + 6) / 40); }
  // ---------- post: AO, brillo, desenfoque, gradación ----------
  const comp = new EffectComposer(R); comp.setSize(W, H); comp.addPass(new RenderPass(scene, camera));
  const gtao = new GTAOPass(scene, camera, W, H, undefined, { radius: 1.2, distanceExponent: 1.4, thickness: 2, scale: 1.2, samples: 10 }, { lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, rings: 2, samples: 8 }); gtao.blendIntensity = .8; comp.addPass(gtao);
  { const oR = gtao.render.bind(gtao); gtao.render = (...a) => { const L = [FALL, SECW, JET, FUNNEL].filter(o => o && o.visible); L.forEach(o => o.visible = false); oR(...a); L.forEach(o => o.visible = true); }; }
  const sanM = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, px: { value: new T.Vector2(1 / W, 1 / H) } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform vec2 px; varying vec2 vUv; bool bad(vec4 c){ return any(isnan(c)) || any(isinf(c)) || any(greaterThan(abs(c), vec4(6e4))); } void main(){ vec4 c=texture2D(tDiffuse,vUv); if(bad(c)){ vec4 s=vec4(0.); float n=0.; for(int i=0;i<8;i++){ float a=float(i)*.785398; vec4 q=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*4.); if(!bad(q)){ s+=q; n+=1.; } } c = n>0. ? s/n : vec4(0.,0.,0.,1.); } gl_FragColor=c; }' });
  const sq = new T.Mesh(new T.PlaneGeometry(2, 2), sanM); sq.frustumCulled = false; const sScene = new T.Scene(); sScene.add(sq); const sCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { sanM.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(write); r.render(sScene, sCam); } });
  const bloom = new UnrealBloomPass(new T.Vector2(W / 2, H / 2), .22, .5, .9); comp.addPass(bloom);
  const dof = new BokehPass(scene, camera, { focus: 8, aperture: .002, maxblur: .005 }); comp.addPass(dof); comp.addPass(new OutputPass());
  const gradeMat = new T.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, time: { value: 0 } }, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float time; varying vec2 vUv; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); } void main(){ vec3 c=texture2D(tDiffuse,vUv).rgb; float l=dot(c,vec3(.299,.587,.114)); c+=vec3(-.01,.004,.026)*(1.-l); c+=vec3(.028,.014,-.014)*l; c=c*c*(3.-2.*c)*.28+c*.72; vec2 d=vUv-.5; c*=1.-dot(d,d)*.5; c+=(h(vUv*vec2(1080.,1920.)+time)-.5)*.02; gl_FragColor=vec4(c,1.); }' });
  const gq = new T.Mesh(new T.PlaneGeometry(2, 2), gradeMat); gq.frustumCulled = false; const gScene = new T.Scene(); gScene.add(gq); const gCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  comp.addPass({ enabled: true, needsSwap: true, clear: false, renderToScreen: false, setSize() { }, dispose() { }, render(r, write, read) { gradeMat.uniforms.tDiffuse.value = read.texture; r.setRenderTarget(this.renderToScreen ? null : write); r.render(gScene, gCam); } });
  // capa gl2 vacía (core3d la busca)
  const FGC = document.createElement('canvas'); FGC.width = W; FGC.height = H; FGC.id = 'gl2'; FGC.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none'; (document.getElementById('stage') || document.body).appendChild(FGC);
  function render() { comp.render(); }
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; skyU.time.value = t; [LU, CU, SU].forEach(u => u.uTime.value = t); if (FLOOD) FLOOD.material.uniforms.uTime.value = t; FU.uTime.value = t; secWaterMat.uniforms.uTime.value = t; jetMat.uniforms.uTime.value = t;
    // bruma de la cascada
    MIST.forEach((s, i) => { const ph = (t * .35 + i / MIST.length) % 1, sd = Math.sin(i * 12.9) * .5; s.position.set(sd * 34, -46 + ph * 20 + Math.sin(i) * 2, 10 + Math.cos(i * 3.1) * 8 + ph * 6); const sz = 10 + ph * 26; s.scale.set(sz, sz, 1); s.material.opacity = FU.uK.value * .2 * Math.sin(Math.PI * ph); });
    TICK.forEach(f => f(t)); }
  const ray = new T.Raycaster();
  function ground(x, z, y0 = 400) { ray.set(new T.Vector3(x, y0, z), new T.Vector3(0, -1, 0)); ray.far = 1000; const L = []; [TERR, BASIN, RIG.main, CORTE, MINE].forEach(o => o && o.visible !== false && L.push(o)); const h = ray.intersectObjects(L, true); return h.length ? h[0].point.y : 0; }
  return { gtao, T, scene, camera, R, comp, setCam, proj, render, setTime, setMood, setWater, waterY, ground, SUN, LU, SU, CU, FU, DRAIN, G, RIG, get BARGES() { return BARGES; }, SHRIMPS, ISLTREES, get TUG() { return TUG; }, FALL, MIST,
    get SECW() { return SECW; }, get JET() { return JET; }, get FLOOD() { return FLOOD; }, get FUNNEL() { return FUNNEL; }, get PIPE() { return PIPE_SEC; }, get CAGE() { return CAGE; }, get BIT() { return BIT; }, get BASIN() { return BASIN; },
    CX, ZF, SX, PIPEX, CANAL_DIR, canal, lake, dof, bloom, inkM, sky, setFg() { }, ZG, READY_W, get mood() { return MOOD; }, WS, MINEL };
})();

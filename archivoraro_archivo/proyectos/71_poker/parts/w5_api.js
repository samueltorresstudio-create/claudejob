
  // =====================================================================================================
  // ESTADO Y API
  // =====================================================================================================
  // fichas de póker (instanciadas): W2.setChips(lista de [x, y, z, rotY]) — el resto se esconden
  const NCH = 140, chipGeo = new T.CylinderGeometry(.038, .038, .012, 20);
  const chipT = tex(128, 128, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.0)'; for (let k = 0; k < 8; k++) { g.save(); g.translate(w / 2, h / 2); g.rotate(k * Math.PI / 4); g.fillStyle = '#f4f0e6'; g.fillRect(-8, -64, 16, 22); g.restore(); } g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 5; g.beginPath(); g.arc(w / 2, h / 2, 30, 0, 7); g.stroke(); });
  const CHIPS = new T.InstancedMesh(chipGeo, STD({ map: chipT, roughness: .45 }), NCH); CHIPS.castShadow = true; CHIPS.receiveShadow = true; scene.add(CHIPS);
  const chipCols = ['#c8302e', '#2f6fbf', '#1b1b22', '#f2efe6', '#2f9a5a', '#e8a830'].map(c => new T.Color(c));
  for (let i = 0; i < NCH; i++) CHIPS.setColorAt(i, chipCols[(i * 7) % chipCols.length]);
  const _o = new T.Object3D();
  function setChips(list) { for (let i = 0; i < NCH; i++) { const p = list[i]; if (p) { _o.position.set(p[0], p[1], p[2]); _o.rotation.set(p[4] || 0, p[3] || 0, p[5] || 0); _o.scale.setScalar(1); } else { _o.position.set(0, -50, 0); _o.scale.setScalar(.001); } _o.updateMatrix(); CHIPS.setMatrixAt(i, _o.matrix); } CHIPS.instanceMatrix.needsUpdate = true; }
  // pila de fichas en (x, z) con n fichas, ligeramente desordenada; devuelve la lista
  const stack = (x, z, n, seed = 0, y0 = TH + .026) => Array.from({ length: n }, (_, k) => [x + Math.sin(k * 1.7 + seed) * .006, y0 + k * .0125, z + Math.cos(k * 2.3 + seed) * .006, k * .7]);
  setChips([]);
  // TORRE DE FAJOS (3D, instanciada): fajos de 100 billetes de 10 € (rojos), 20 € (azules) y 50 € (verdes), con faja de papel,
  // cantos de papel rayados y apilados «en Jenga» (cada capa girada 90°). W2.setMoney(alto, x, z) · W2.setBand(valor, y, escala)
  const FW = .156, FD = .082, FH = .026, NMB = 200, NOTE = { 10: ['#f08a72', '#a8442f'], 20: ['#7fb2ec', '#2f5f9e'], 50: ['#9fd27e', '#447a2e'] };
  const hh2 = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
  const lighten = (c, k) => { const n = parseInt(c.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, f = v => Math.round(v + (255 - v) * k); return `rgb(${f(r)},${f(g)},${f(b)})`; };
  const fajaPaint = (g, x, h, bw = 68) => { g.fillStyle = '#fbf3df'; g.fillRect(x - bw / 2, 0, bw, h); g.fillStyle = '#d23a2e'; g.fillRect(x - bw / 2, 0, 8, h); g.fillRect(x + bw / 2 - 8, 0, 8, h); g.fillStyle = '#e8b830'; g.fillRect(x - bw / 2 + 8, 0, 4, h); g.fillRect(x + bw / 2 - 12, 0, 4, h); };
  const noteTop = v => tex(512, 270, (g, w, h) => { const [c, d] = NOTE[v]; g.fillStyle = c; g.fillRect(0, 0, w, h);
    g.globalAlpha = .22; g.strokeStyle = d; g.lineWidth = 2; for (let k = 0; k < 16; k++) { g.beginPath(); for (let x = 0; x <= w; x += 6) { const y = h * .5 + Math.sin(x / 34 + k * .8) * (12 + k * 7); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } g.globalAlpha = 1;
    g.strokeStyle = d; g.lineWidth = 9; g.beginPath(); g.roundRect(14, 14, w - 28, h - 28, 20); g.stroke(); g.lineWidth = 3; g.beginPath(); g.roundRect(28, 28, w - 56, h - 56, 14); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.ellipse(w * .74, h * .5, 62, 76, 0, 0, 7); g.fill(); g.strokeStyle = d; g.lineWidth = 5; g.stroke();
    txt(g, String(v), 74, 66, 54, d, 900); txt(g, String(v), w - 74, h - 62, 44, d, 900); txt(g, String(v), w * .26, h * .52, 118, 'rgba(255,255,255,.6)', 900, 'center', 6, d); txt(g, 'EURO', w * .26, h * .82, 26, d, 800);
    fajaPaint(g, w / 2, h); g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2); txt(g, (v * 100).toLocaleString('es-ES') + ' €', 0, 2, 30, '#1b1720', 900); g.restore(); });
  // canto del fajo: 100 bordes de papel (claros) con el color del billete, sombra en las juntas y la faja en el centro
  const noteSide = (v, band) => tex(band ? 512 : 256, 64, (g, w, h) => { const [c, d] = NOTE[v]; const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, lighten(c, .45)); gr.addColorStop(.5, lighten(c, .2)); gr.addColorStop(1, c); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let y = 4; y < h - 3; y += 3) { g.fillStyle = (y * 7) % 5 < 2 ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.10)'; g.fillRect(0, y, w, 1.2); }
    g.fillStyle = d; g.fillRect(0, 0, w, 3); g.fillRect(0, h - 3, w, 3); if (band) fajaPaint(g, w / 2, h, 76); });
  const MONEY = {};
  [10, 20, 50].forEach(v => { const mk = (map, r) => STD({ map, roughness: r, emissive: '#ffffff', emissiveMap: map, emissiveIntensity: .16 }), tp = mk(noteTop(v), .7), sl = mk(noteSide(v, true), .8), ss = mk(noteSide(v, false), .8);
    const M = new T.InstancedMesh(new T.BoxGeometry(FW, FH, FD), [ss, ss, tp, tp, sl, sl], NMB); M.castShadow = true; M.receiveShadow = true; M.frustumCulled = false; scene.add(M); MONEY[v] = M; });
  // torre maciza: 8 fajos por capa (2 × 4), cada capa girada 90° respecto a la anterior; la capa de arriba cae en cascada fajo a fajo
  const GAP = .003, SLOTS = [0, 1, 2, 3, 4, 5, 6, 7].map(b => [(b % 2 ? 1 : -1) * (FW / 2 + GAP / 2), (Math.floor(b / 2) - 1.5) * (FD + GAP)]);
  const MONEY_HALF = FD * 2 + GAP * 2;   // medio ancho de la torre (para recortar lo que haya detrás)
  function setMoney(H = 0, x = TC.x, z = TC.z, y0 = TH + .002) { const nl = Math.max(0, H / FH), full = Math.floor(nl), fr = nl - full, cnt = { 10: 0, 20: 0, 50: 0 }, tops = [];
    const L = Math.min(60, full + 1);
    for (let l = 0; l < L; l++) { const odd = l % 2, rot = odd * Math.PI / 2;
      for (let b = 0; b < 8; b++) { let dy = 0; if (l === full) { const q = clamp((fr - b * .07) / .45); if (q <= 0) continue; dy = Math.pow(1 - q, 2) * .13; }
        const v = [10, 20, 50][Math.floor(hh2(l * 3.1 + 7, b * 7.7 + 3) * 3)], M = MONEY[v], i = cnt[v]++; if (i >= NMB) continue; const j = hh2(l + 1, b + 1), [sx, sz] = SLOTS[b];
        _o.position.set(x + (odd ? sz : sx) + (j - .5) * .008, y0 + FH / 2 + l * FH + dy, z + (odd ? sx : sz) + (hh2(b + 5, l + 2) - .5) * .008); _o.rotation.set(0, rot + (j - .5) * .06, 0); _o.scale.setScalar(1); _o.updateMatrix(); M.setMatrixAt(i, _o.matrix); if (l === full) tops.push([_o.position.x, _o.position.y, _o.position.z, _o.rotation.y]); } }
    [10, 20, 50].forEach(v => { const M = MONEY[v]; for (let i = cnt[v]; i < NMB; i++) { _o.position.set(0, -50, 0); _o.rotation.set(0, 0, 0); _o.scale.setScalar(.001); _o.updateMatrix(); M.setMatrixAt(i, _o.matrix); } M.instanceMatrix.needsUpdate = true; }); return { yBody: y0 + full * FH, tops, FW, FD, FH }; }
  setMoney(0);
  // faja roja con la cifra, abrazando la torre (caras de arriba y abajo invisibles)
  const BANDC = signTex(640, 180), bandM = STD({ map: BANDC.t, roughness: .4, emissive: '#ffffff', emissiveMap: BANDC.t, emissiveIntensity: .2 }), noM = new T.MeshBasicMaterial({ visible: false });
  const bandSideT = tex(256, 72, (g, w, h) => { g.fillStyle = '#c8302e'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8b830'; g.fillRect(0, 6, w, 8); g.fillRect(0, h - 14, w, 8); }), bandSideM = STD({ map: bandSideT, roughness: .4, emissive: '#ffffff', emissiveMap: bandSideT, emissiveIntensity: .2 });
  const BW2 = MONEY_HALF * 2 + .03, BAND = new T.Mesh(new T.BoxGeometry(BW2, BW2 * .28, BW2), [bandSideM, bandSideM, noM, noM, bandM, bandM]); BAND.castShadow = true; BAND.visible = false; scene.add(BAND);
  let bandLast = '';
  function setBand(val = 0, y = TH + .6, sc = 0, x = TC.x, z = TC.z) { BAND.visible = sc > .01; if (!BAND.visible) return; BAND.position.set(x, y, z); BAND.scale.set(sc, sc, sc); BAND.rotation.y = 0;
    const str = Math.round(val).toLocaleString('es-ES') + ' €'; if (str === bandLast) return; bandLast = str; const g = BANDC.g, w = 640, h = 180;
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#e2463a'); gr.addColorStop(1, '#a8241e'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e8b830'; g.fillRect(0, 14, w, 12); g.fillRect(0, h - 26, w, 12); g.fillStyle = '#fff3c0'; g.fillRect(0, 17, w, 3); g.fillRect(0, h - 23, w, 3);
    g.font = FONT(900, 104); const fw = g.measureText(str).width; txt(g, str, w / 2, h / 2 + 4, Math.min(104, 104 * 590 / fw), '#fbf6e8', 900, 'center', 12, '#1b1720'); BANDC.t.needsUpdate = true; }
  const moneyHalf = () => MONEY_HALF, bandH = () => BW2 * .28;
  // relojes / pantallas / pizarras
  function setClock(hh, mm) { const g = CLK.g, w = 256, h = 256; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); g.fillStyle = '#f6f0e0'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 6, 0, 7); g.fill(); g.lineWidth = 12; g.strokeStyle = INK; g.stroke();
    for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; g.lineWidth = k % 3 ? 5 : 10; g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * (w / 2 - 22), h / 2 - Math.cos(a) * (w / 2 - 22)); g.lineTo(w / 2 + Math.sin(a) * (w / 2 - 40), h / 2 - Math.cos(a) * (w / 2 - 40)); g.stroke(); }
    txt(g, 'BAR', w / 2, h * .68, 26, '#c8302e', 900);
    const ah = (hh % 12 + mm / 60) / 12 * 6.283, am = mm / 60 * 6.283; g.lineCap = 'round'; g.lineWidth = 12; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.sin(ah) * w * .24, h / 2 - Math.cos(ah) * w * .24); g.stroke(); g.lineWidth = 7; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.sin(am) * w * .36, h / 2 - Math.cos(am) * w * .36); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(w / 2, h / 2, 10, 0, 7); g.fill(); g.setTransform(1, 0, 0, 1, 0, 0); CLK.t.needsUpdate = true; }
  setClock(22, 30);
  function drawTV(t) { const g = TVC.g, w = 512, h = 288; g.fillStyle = '#3a9a4a'; g.fillRect(0, 0, w, h); for (let k = 0; k < 8; k++) { g.fillStyle = k % 2 ? '#3a9a4a' : '#43a854'; g.fillRect(k * w / 8, 0, w / 8, h); } g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 4; g.strokeRect(20, 20, w - 40, h - 40); g.beginPath(); g.moveTo(w / 2, 20); g.lineTo(w / 2, h - 20); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 40, 0, 7); g.stroke();
    for (let i = 0; i < 10; i++) { const x = (w * (.15 + i * .08) + Math.sin(t * 2 + i) * 30) % w, y = h * (.3 + (i % 3) * .2) + Math.cos(t * 1.7 + i) * 20; g.fillStyle = i < 5 ? '#e8302e' : '#2f6fbf'; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); }
    g.fillStyle = '#fff'; g.beginPath(); g.arc(w / 2 + Math.sin(t * 2.6) * 120, h / 2 + Math.cos(t * 1.9) * 60, 5, 0, 7); g.fill(); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(14, 14, 120, 30); txt(g, '1 - 1', 74, 30, 22, '#fff', 900); TVC.t.needsUpdate = true; }
  function drawSlot(t) { const g = SLOTC.g, w = 256, h = 128; g.fillStyle = '#1b1720'; g.fillRect(0, 0, w, h); ['🍒', '7', '🔔'].forEach((s, i) => { g.fillStyle = '#fbf6e8'; g.fillRect(10 + i * 82, 14, 72, 100); txt(g, ['7', '★', '7'][(i + Math.floor(t * 3)) % 3], 46 + i * 82, 64, 56, i === 1 ? '#e8b830' : '#c8302e', 900); }); SLOTC.t.needsUpdate = true; SLOTL.forEach((l, i) => l.material.emissiveIntensity = (Math.floor(t * 6) + i) % 2 ? 2.2 : .4); }
  // foto de la inauguración (1995): Manolo joven detrás de la barra cortando la cinta
  function drawPhoto(colour = 0) { const g = PHOTOC.g, w = 600, h = 440; g.fillStyle = '#d8c8a0'; g.fillRect(0, 0, w, h); g.fillStyle = '#6a4a2a'; g.fillRect(0, h * .62, w, h * .38); g.fillStyle = '#8a6a4a'; g.fillRect(0, h * .6, w, 12);
    g.fillStyle = '#5a3a22'; for (let x = 30; x < w; x += 46) g.fillRect(x, 40, 22, h * .5); // botellas
    // Manolo joven: cabeza redonda, pelo negro, bigote; cinta roja
    const hx = w * .5, hy = h * .42; g.fillStyle = '#fbf8f0'; g.beginPath(); g.arc(hx, hy, 58, 0, 7); g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke(); g.fillStyle = '#1b1720'; g.beginPath(); g.arc(hx, hy - 20, 60, Math.PI * 1.05, Math.PI * 1.95); g.fill();
    g.fillStyle = INK; [[-20, 0], [20, 0]].forEach(([dx]) => { g.beginPath(); g.ellipse(hx + dx, hy + 4, 6, 8, 0, 0, 7); g.fill(); }); g.lineWidth = 5; g.beginPath(); g.arc(hx, hy + 16, 18, .3, Math.PI - .3); g.stroke();
    g.fillStyle = '#e8b830'; g.beginPath(); g.ellipse(hx, hy + 120, 70, 60, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
    g.strokeStyle = '#c8302e'; g.lineWidth = 12; g.beginPath(); g.moveTo(0, h * .7); g.quadraticCurveTo(w / 2, h * .78, w, h * .7); g.stroke(); g.fillStyle = '#c8302e'; g.beginPath(); g.arc(w / 2, h * .76, 18, 0, 7); g.fill();
    txt(g, 'INAUGURACIÓN · 1995', w / 2, h * .92, 40, '#3a2a1a', 900);
    if (colour < 1) { const im = g.getImageData(0, 0, w, h), d = im.data; for (let i = 0; i < d.length; i += 4) { const l = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11, s = 1 - colour; d[i] = d[i] * colour + (l * 1.07 + 18) * s; d[i + 1] = d[i + 1] * colour + (l * .95 + 6) * s; d[i + 2] = d[i + 2] * colour + (l * .78) * s; } g.putImageData(im, 0, 0); }
    g.fillStyle = 'rgba(80,60,30,.12)'; for (let i = 0; i < 400; i++) g.fillRect(rnd() * w, rnd() * h, 2, 2); g.strokeStyle = '#f4ecd8'; g.lineWidth = 16; g.strokeRect(0, 0, w, h); PHOTOC.t.needsUpdate = true; }
  drawPhoto(0);
  // licencia de apertura a nombre del cuñado (con su foto: chándal y cadena)
  function drawLicense(hl = 0) { const g = LICC.g, w = 440, h = 600; paperBg(g, w, h, '#f6efd8'); txt(g, 'LICENCIA', w / 2, 60, 46, '#3a2a1a', 900); txt(g, 'DE APERTURA', w / 2, 104, 30, '#3a2a1a', 800); g.fillStyle = '#3a2a1a'; g.fillRect(40, 128, w - 80, 4);
    g.fillStyle = '#dfe8ef'; g.fillRect(150, 150, 140, 160); g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(150, 150, 140, 160); g.fillStyle = '#fbf8f0'; g.beginPath(); g.arc(220, 215, 42, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#c8302e'; g.beginPath(); g.ellipse(220, 300, 54, 40, 0, Math.PI, 0); g.fill(); g.strokeStyle = '#e8b830'; g.lineWidth = 5; g.beginPath(); g.arc(220, 268, 22, .2, Math.PI - .2); g.stroke();
    g.fillStyle = INK; g.fillRect(196, 186, 48, 10); // gafas de sol en la frente
    if (hl > 0) { g.fillStyle = 'rgba(255,220,60,.7)'; g.fillRect(36, 356, (w - 72) * Math.min(1, hl), 56); }
    txt(g, 'TITULAR:', w / 2, 344, 26, '#5a4a3a', 800); txt(g, 'FERMÍN «EL CUÑAO»', w / 2, 386, 34, INK, 900); g.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 3; i++) g.fillRect(60, 440 + i * 24, w - 120 - i * 40, 8);
    g.save(); g.translate(330, 530); g.rotate(-.2); g.strokeStyle = '#2f5fbf'; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 46, 0, 7); g.stroke(); txt(g, 'AYTO.', 0, 2, 22, '#2f5fbf', 900); g.restore(); LICC.t.needsUpdate = true; }
  drawLicense(0);
  // pizarra de partidas ganadas en 30 años
  function setScore(mano = 0, hl = 0) { const g = SCORE.g, w = 600, h = 440; g.fillStyle = '#22322a'; g.fillRect(0, 0, w, h); noise(g, w, h, 2000, ['rgba(255,255,255,.04)']); txt(g, 'PARTIDAS GANADAS', w / 2, 48, 40, '#f4f0e0', 900); g.fillStyle = 'rgba(244,240,224,.6)'; g.fillRect(40, 76, w - 80, 3);
    [['PEPE', '512'], ['LUIS', '497'], ['TONI', '541'], ['MANOLO', String(mano)]].forEach(([n, v], i) => { const y = 130 + i * 76, hot = i === 3; if (hot && hl > 0) { g.strokeStyle = '#ffd34a'; g.lineWidth = 7; g.beginPath(); g.ellipse(w * .74, y, 70, 34, -.05, 0, 6.3 * Math.min(1, hl)); g.stroke(); }
      txt(g, n, 70, y, 44, '#f4f0e0', 800, 'left'); txt(g, v, w * .74, y, 54, hot ? '#ffd34a' : '#f4f0e0', 900); });
    SCORE.t.needsUpdate = true; }
  setScore(0);
  function setTill(k = 0, fill = 1, scr = '') { TILLD.position.z = .1 + k * .3; TILLD.position.y = .0; TILLCASH.scale.y = Math.max(.01, fill); TILLCASH.position.y = fill * .02;
    const g = TILLSCR.g; g.fillStyle = '#0a1a0e'; g.fillRect(0, 0, 256, 96); const s0 = scr || '0,00'; g.font = FONT(800, 56); const fw = g.measureText(s0).width; txt(g, s0, 240, 50, Math.min(56, 56 * 224 / fw), '#7aff8a', 800, 'right'); TILLSCR.t.needsUpdate = true; }
  setTill(0, 1, '');
  // escenarios: cena puesta; flashback de 1995 (sepia + pancarta)
  function setDinner(on) { DINNER.visible = !!on; }
  const BANNER = sign(3.2, .5, 160, (g, w, h) => { g.fillStyle = '#c8302e'; g.fillRect(0, 0, w, h); txt(g, '¡GRAN INAUGURACIÓN!', w / 2, h / 2 + 4, 96, '#fbf6e8', 900); g.strokeStyle = '#fbf6e8'; g.lineWidth = 8; g.strokeRect(8, 8, w - 16, h - 16); }, -2.6, 2.95, -4.3, { d: .02 });
  BANNER.visible = false;
  function setSepia(k) { gradeMat.uniforms.sepia.value = k; BANNER.visible = k > .5; JAM.forEach((j, i) => j.visible = k < .5 || i < 2); }
  function setTime(t) { gradeMat.uniforms.time.value = t % 10; drawTV(t); drawSlot(t); JAM.forEach((j, i) => j.rotation.z = Math.sin(t * 1.3 + i) * .02); }

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
  // ---------- cámara y luz ambiente (de noche: la luz viene de las lámparas) ----------
  sun.intensity = .35; sun.color.set('#9fb4ff'); hemi.color.set('#ffe0c0'); hemi.groundColor.set('#5a3a2a'); hemi.intensity = .85; scene.fog.color.set('#2a2030'); scene.fog.density = .004; R.toneMappingExposure = 1.15;
  skyU.night.value = 1;
  function setCam(pos, look, fov = 45, focus = null, ap = .003) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.lookAt(look); camera.updateMatrixWorld(); sky.position.copy(camera.position);
    ZL.forEach(([l, I, test]) => { const on = !!test(pos); l.visible = on; l.intensity = on ? I : 0; });
    sun.position.copy(look).addScaledVector(SUN, 120); sun.target.position.copy(look); sun.target.updateMatrixWorld(); dof.uniforms.focus.value = focus ?? pos.distanceTo(look); dof.uniforms.aperture.value = ap; }
  function proj(p) { const v = p.clone(), cs = v.clone().applyMatrix4(camera.matrixWorldInverse), d = -cs.z; v.project(camera); const ppm = (H / 2) / (d * Math.tan(camera.fov * Math.PI / 360)); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, d, ppm, ok: d > .1 }; }
  function render() { comp.render(); }
  function setMood() {}
  const ray = new T.Raycaster(); const solids = []; scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material !== inkM && o !== sky && !o.userData.noInk && !(o.material && o.material.transparent)) solids.push(o); });
  function visible(p, tol = .12) { const o = camera.position, d = p.clone().sub(o), L = d.length(); ray.set(o, d.normalize()); ray.far = L - tol; return ray.intersectObjects(solids, false).length === 0; }
  return { T, scene, camera, R, setCam, proj, render, setTime, setMood, visible, SUN, TC, TR, TH, DT, BZ, SEATS, seatPos, X0, X1, Z0, Z1, RH,
    setChips, stack, setMoney, setBand, moneyHalf, bandH, setClock, setScore, setTill, setDinner, setSepia, drawPhoto, drawLicense, PHOTO, LIC, TILL, SLOT, TROPHY, VIT, RESV, JAM, dof, bloom, comp, inkM };
})();

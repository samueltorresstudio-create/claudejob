// Personaje 3D «bala» (ref. precios .99): cabeza esfera, cuerpo bala, palos, manos bola, bombín; cara 2D pintada sobre la esfera.
function char3d(W, o = {}) {
  window._T = W.T; const T = W.T, g = new T.Group(), INKM = new T.MeshBasicMaterial({ color: 0x1a1214, side: T.BackSide });
  const mat = (c, r = .55, m = 0) => new T.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const add = (geo, m, ink = .012, parent = g) => { const me = new T.Mesh(geo, m); me.castShadow = true; me.receiveShadow = true; parent.add(me);
    if (ink) { const h = new T.Mesh(geo, INKM); h.userData.noInk = 1; h.onBeforeRender = () => {}; h.scale.setScalar(1); const gi = geo.clone(); gi.computeVertexNormals(); const p = gi.attributes.position, n = gi.attributes.normal; for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + n.getX(i) * ink, p.getY(i) + n.getY(i) * ink, p.getZ(i) + n.getZ(i) * ink); h.geometry = gi; me.add(h); }
    me.userData.noInk = 1; return me; };
  const LEG = o.leg ?? .56, BH = .62, HR = .3, BK = .84;
  // piernas
  [-1, 1].forEach(s => { const L = add(new T.CylinderGeometry(.014, .014, LEG, 10), mat(0x1c1416, .7), .004); L.position.set(s * .075, LEG / 2, 0);
    const f = add(new T.SphereGeometry(.03, 14, 10), mat(0x1c1416, .6), .004); f.scale.set(1, .5, 1.5); f.position.set(s * .08, .012, .02); });
  // cuerpo bala (torno): ancho abajo, estrecho arriba
  const P = [[0, 0], [.13, .005], [.2, .04], [.225, .12], [.225, .3], [.21, .45], [.18, .57], [.12, .64], [0, BH]].map(([r, y]) => new T.Vector2(r * BK, y * BH / .66));
  const body = add(new T.LatheGeometry(new T.SplineCurve(P).getPoints(40), 48), mat(o.top || 0x2a5d8a, .42), .012); body.position.y = LEG - .04;
  // detalles del cuerpo: cuello en V blanco (2 triángulos), pajarita, botones, bolsillo
  const by = LEG - .04, fz = r => Math.sqrt(Math.max(0, (.224 * BK) ** 2 - r * r));
  const tri = (pts, c, z) => { const sh = new T.Shape(); sh.moveTo(...pts[0]); pts.slice(1).forEach(p => sh.lineTo(...p)); const m = add(new T.ExtrudeGeometry(sh, { depth: .006, bevelEnabled: false }), mat(c, .6), .004); m.position.z = z; return m; };
  const cy = by + .51; [-1, 1].forEach(s => { const m = tri([[0, -.1], [s * .085, .02], [s * .004, .004]], 0xf4f1ea, fz(.03) - .022); m.position.y = cy; m.rotation.x = -.25; });
  const bow = new T.Group(); [-1, 1].forEach(s => { const c = add(new T.ConeGeometry(.026, .05, 12), mat(o.tie || 0xc8303a, .5), .003, bow); c.rotation.z = s * Math.PI / 2; c.position.x = s * .025; }); add(new T.SphereGeometry(.013, 10, 8), mat(o.tie || 0xc8303a, .5), .003, bow);
  bow.position.set(0, cy + .0, fz(0) - .005); g.add(bow);
  for (let i = 0; i < 4; i++) { const y = .42 - i * .085, b = add(new T.SphereGeometry(.012, 10, 8), mat(0xe2b84a, .3, .4), .003); b.position.set(0, by + y, .226 * BK + .002); }
  const pk = add(new T.BoxGeometry(.07, .008, .006), mat(0x1c1416, .7), 0); pk.position.set(-.085, by + .25, .175); pk.rotation.y = -.45;
  // cabeza
  const HY = by + BH + HR * .72, head = add(new T.SphereGeometry(HR, 64, 48), mat(0xf6f1e8, .62), .013); head.position.y = HY;
  const face = new T.Mesh(new T.SphereGeometry(HR * 1.004, 64, 32, Math.PI / 2 - 1.0, 2.0, .95, 1.25), new T.MeshStandardMaterial({ transparent: true, roughness: .7, depthWrite: false }));
  face.userData.noInk = 1; head.add(face);
  // bombín
  const hat = new T.Group(); hat.position.set(0, HY + HR * .47, 0); hat.rotation.z = o.hatTilt ?? .06; g.add(hat);
  const HC = o.hatCol || 0x5a3420;
  const crown = add(new T.SphereGeometry(HR * .9, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), mat(HC, .38), .01, hat); crown.scale.y = 1.0;
  const band = add(new T.CylinderGeometry(HR * .905, HR * .91, .035, 48, 1, true), mat(0x2a1810, .5), 0, hat); band.position.y = .015;
  const brim = add(new T.CylinderGeometry(HR * 1.22, HR * 1.22, .018, 48), mat(HC, .4), .008, hat); brim.position.y = -.005; brim.scale.z = .92;
  // brazos (tubos finos) y manos bola
  const arm = (s, pts) => { const sh = new T.Vector3(s * .17, by + .4, .02); const c = new T.CatmullRomCurve3([sh, ...pts.map(p => new T.Vector3(...p).add(sh))]);
    add(new T.TubeGeometry(c, 20, .012, 8), mat(0x1c1416, .7), .003); const h = add(new T.SphereGeometry(.036, 16, 12), mat(0x1c1416, .5), .004); h.position.copy(c.getPoint(1)); return h; };
  g.userData = { HY, HR, face, arm, add, mat, by };
  arm(-1, o.armL || [[-.06, -.12, .02], [-.05, -.27, .03]]); arm(1, o.armR || [[.06, -.12, .02], [.05, -.27, .03]]);
  W.scene.add(g); setFace(g, o.face || 'serio', o); return g;
}

function setFace(g, f, o = {}) { // pinta la cara en un lienzo (cejas gruesas, ojos de párpado, bigote marrón grande)
  const C = document.createElement('canvas'); C.width = 1024; C.height = 640; const x = C.getContext('2d'); x.lineCap = 'round'; x.lineJoin = 'round';
  const K = '#24181a', BR = o.brow || '#3a2418', MU = o.must || '#6a3c22', cx = 512, ey = 272, ex = 96, t = o.look || 0; x.translate(cx, ey); x.scale(1.45, 1.45); x.translate(-cx, -ey);
  const brow = (s, dy, tilt) => { const X = cx + t + s * ex; x.strokeStyle = BR; x.lineWidth = 30; x.beginPath(); x.moveTo(X - 52, ey - 78 + dy + s * tilt); x.quadraticCurveTo(X, ey - 108 + dy, X + 52, ey - 78 + dy - s * tilt); x.stroke(); };
  const lid = (s, dy = 0) => { const X = cx + t + s * ex; x.fillStyle = K; x.beginPath(); x.ellipse(X, ey + 6 + dy, 30, 22, 0, 0, Math.PI); x.fill(); x.strokeStyle = K; x.lineWidth = 20; x.beginPath(); x.moveTo(X - 44, ey + 4 + dy); x.lineTo(X + 44, ey + 4 + dy); x.stroke(); };
  const dot = s => { const X = cx + t + s * ex; x.fillStyle = K; x.beginPath(); x.ellipse(X, ey, 24, 30, 0, 0, Math.PI * 2); x.fill(); };
  const happy = s => { const X = cx + t + s * ex; x.strokeStyle = K; x.lineWidth = 20; x.beginPath(); x.moveTo(X - 40, ey + 12); x.quadraticCurveTo(X, ey - 34, X + 40, ey + 12); x.stroke(); };
  if (f === 'serio') { brow(-1, 4, 8); brow(1, 4, 8); lid(-1); lid(1); }
  if (f === 'picaro') { brow(-1, 10, 4); brow(1, -14, -6); lid(-1, 4); happy(1); }
  if (f === 'feliz') { brow(-1, -10, -4); brow(1, -10, -4); happy(-1); happy(1); }
  if (f === 'preocupado') { brow(-1, 0, -26); brow(1, 0, -26); lid(-1, 6); lid(1, 6); }
  if (f === 'sorpresa') { brow(-1, -14, 0); brow(1, -14, 0); dot(-1); dot(1); }
  // bigote: «U» invertida ancha, marrón con contorno oscuro
  const my = ey + 112, mx = cx + t; x.beginPath(); x.moveTo(mx, my - 26);
  x.bezierCurveTo(mx - 60, my - 52, mx - 150, my - 44, mx - 176, my + 10); x.bezierCurveTo(mx - 190, my + 50, mx - 186, my + 92, mx - 160, my + 92);
  x.bezierCurveTo(mx - 140, my + 92, mx - 138, my + 40, mx - 100, my + 26); x.bezierCurveTo(mx - 60, my + 12, mx - 20, my + 20, mx, my + 26);
  x.bezierCurveTo(mx + 20, my + 20, mx + 60, my + 12, mx + 100, my + 26); x.bezierCurveTo(mx + 138, my + 40, mx + 140, my + 92, mx + 160, my + 92);
  x.bezierCurveTo(mx + 186, my + 92, mx + 190, my + 50, mx + 176, my + 10); x.bezierCurveTo(mx + 150, my - 44, mx + 60, my - 52, mx, my - 26); x.closePath();
  x.fillStyle = MU; x.fill(); x.strokeStyle = K; x.lineWidth = 12; x.stroke();
  if (f === 'sorpresa') { x.fillStyle = '#4a1c1e'; x.beginPath(); x.ellipse(mx, my + 78, 22, 26, 0, 0, Math.PI * 2); x.fill(); x.strokeStyle = K; x.lineWidth = 10; x.stroke(); }
  if (f === 'picaro' || f === 'feliz') { x.strokeStyle = K; x.lineWidth = 12; x.beginPath(); x.moveTo(mx + 30, my + 62); x.quadraticCurveTo(mx + 60, my + 74, mx + 84, my + 54); x.stroke(); }
  const tex = new window._T.CanvasTexture(C); tex.colorSpace = 'srgb'; tex.anisotropy = 8;
  const m = g.userData.face.material; if (m.map) m.map.dispose(); m.map = tex; m.needsUpdate = true;
}

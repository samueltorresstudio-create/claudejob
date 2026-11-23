// Personaje 3D «bala» (ref. precios .99): cabeza esfera, cuerpo bala, palos, manos bola, bombín; cara 2D pintada sobre la esfera.
function char3d(W, o = {}) {
  window._T = W.T; const T = W.T, g = new T.Group(), INKM = new T.MeshBasicMaterial({ color: 0x1a1214, side: T.BackSide });
  const mat = (c, r = .55, m = 0) => new T.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const add = (geo, m, ink = .012, parent = g) => { const me = new T.Mesh(geo, m); me.castShadow = true; me.receiveShadow = true; parent.add(me);
    if (ink) { const h = new T.Mesh(geo, INKM); h.userData.noInk = 1; h.onBeforeRender = () => {}; h.scale.setScalar(1); const gi = geo.clone(); gi.computeVertexNormals(); const p = gi.attributes.position, n = gi.attributes.normal; for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + n.getX(i) * ink, p.getY(i) + n.getY(i) * ink, p.getZ(i) + n.getZ(i) * ink); h.geometry = gi; me.add(h); }
    me.userData.noInk = 1; return me; };
  const LEG = o.leg ?? .6, BH = .74, HR = .3, BK = 1.12;
  // piernas
  [-1, 1].forEach(s => { const L = add(new T.CylinderGeometry(.017, .017, LEG, 10), mat(0x211718, .7), .004); L.position.set(s * .1, LEG / 2, 0);
    const f = add(new T.SphereGeometry(.03, 14, 10), mat(0x1c1416, .6), .004); f.scale.set(1, .5, 1.5); f.position.set(s * .105, .012, .02); });
  // cuerpo bala (torno): ancho abajo, estrecho arriba
  const P = [[0, 0], [.13, .005], [.2, .04], [.225, .12], [.225, .3], [.21, .45], [.18, .57], [.12, .64], [0, BH]].map(([r, y]) => new T.Vector2(r * BK, y * BH / .66));
  const body = add(new T.LatheGeometry(new T.SplineCurve(P).getPoints(40), 48), mat(o.top || 0x6e1420, .45), .012); body.position.y = LEG - .04;
  // detalles del cuerpo: cuello en V blanco (2 triángulos), pajarita, botones, bolsillo
  const by = LEG - .04, fz = r => Math.sqrt(Math.max(0, (.224 * BK) ** 2 - r * r));
  const tri = (pts, c, z) => { const sh = new T.Shape(); sh.moveTo(...pts[0]); pts.slice(1).forEach(p => sh.lineTo(...p)); const m = add(new T.ExtrudeGeometry(sh, { depth: .006, bevelEnabled: false }), mat(c, .6), .004); m.position.z = z; return m; };
  const cy = by + BH * .84; [-1, 1].forEach(s => { const m = tri([[s * .006, .02], [s * .085, .02], [s * .032, -.075]], 0xf8f1df, fz(.05) - .028); m.position.y = cy; m.rotation.x = -.3; }); { const v = tri([[-.026, 0], [.026, 0], [0, -.1]], 0xf8f1df, fz(.02) - .006); v.position.y = cy - .07; v.rotation.x = -.12; }
  const bow = new T.Group(); [-1, 1].forEach(s => { const c = add(new T.ConeGeometry(.026, .05, 12), mat(o.tie || 0xc8303a, .5), .003, bow); c.rotation.z = s * Math.PI / 2; c.position.x = s * .025; }); add(new T.SphereGeometry(.013, 10, 8), mat(o.tie || 0xc8303a, .5), .003, bow);
  [[-.035,.008],[-.022,-.01],[.022,.01],[.035,-.008],[-.03,-.004],[.03,.004]].forEach(([dx,dy]) => { const d = new T.Mesh(new T.SphereGeometry(.0045, 8, 6), mat(0xf8f1df, .5)); d.position.set(dx, dy, .012); bow.add(d); });
  bow.position.set(0, cy - .07, fz(0) - .006); g.add(bow);
  for (let i = 0; i < 3; i++) { const y = BH * .44 - i * .07, b = add(new T.SphereGeometry(.012, 10, 8), mat(0xc49e36, .3, .4), .003); b.position.set(.012, by + y, .226 * BK + .002); }
  const pk = add(new T.BoxGeometry(.07, .008, .006), mat(0x1c1416, .7), 0); pk.position.set(.13, by + BH * .2, .2); pk.rotation.y = .5; const pk2 = pk.clone(); pk2.position.x = -.13; pk2.rotation.y = -.5; g.add(pk2);
  // cabeza
  const HY = by + BH + HR * .72, head = add(new T.SphereGeometry(HR, 64, 48), mat(0xf0eee8, .7), .013); head.position.y = HY;
  const face = new T.Mesh(new T.SphereGeometry(HR * 1.004, 64, 32, Math.PI / 2 - 1.0, 2.0, .95, 1.25), new T.MeshStandardMaterial({ transparent: true, roughness: .7, depthWrite: false }));
  face.userData.noInk = 1; head.add(face);
  // bombín
  const hat = new T.Group(); hat.position.set(0, HY + HR * .6, 0); hat.rotation.z = o.hatTilt ?? .06; g.add(hat);
  const HC = o.hatCol || 0x643d20;
  const crown = add(new T.SphereGeometry(HR * .78, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), mat(HC, .38), .01, hat); crown.scale.y = 1.3;
  const band = add(new T.CylinderGeometry(HR * .785, HR * .79, .05, 48, 1, true), mat(0x4a2c16, .5), 0, hat); band.position.y = .02;
  const brim = add(new T.CylinderGeometry(HR * 1.1, HR * 1.1, .016, 48), mat(0x57331b, .4), .008, hat); brim.position.y = -.005; brim.scale.z = .9; const curl = add(new T.TorusGeometry(HR * 1.1, .014, 10, 64), mat(0x57331b, .4), .005, hat); curl.rotation.x = Math.PI / 2; curl.scale.y = .9; curl.position.y = .004;
  // brazos (tubos finos) y manos bola
  const arm = (s, pts) => { const sh = new T.Vector3(s * .235, by + BH * .62, .02); const c = new T.CatmullRomCurve3([sh, ...pts.map(p => new T.Vector3(...p).add(sh))]);
    add(new T.TubeGeometry(c, 20, .012, 8), mat(0x211718, .7), .003); const h = add(new T.SphereGeometry(.04, 16, 12), mat(0x1c1416, .5), .004); h.position.copy(c.getPoint(1)); return h; };
  g.userData = { HY, HR, face, arm, add, mat, by };
  arm(-1, o.armL || [[-.06, -.12, .02], [-.05, -.27, .03]]); arm(1, o.armR || [[.06, -.12, .02], [.05, -.27, .03]]);
  W.scene.add(g); setFace(g, o.face || 'serio', o); return g;
}

function setFace(g, f, o = {}) { // pinta la cara en un lienzo (cejas gruesas, ojos de párpado, bigote marrón grande)
  const C = document.createElement('canvas'); C.width = 1024; C.height = 640; const x = C.getContext('2d'); x.lineCap = 'round'; x.lineJoin = 'round';
  const K = '#2a1a16', BR = o.brow || '#2b1b1a', MU = o.must || '#6d3921', cx = 512, ey = 272, ex = 96, t = o.look || 0; x.translate(cx, ey); x.scale(1.45, 1.45); x.translate(-cx, -ey);
  const brow = (s, dy, tilt) => { const X = cx + t + s * ex; x.strokeStyle = BR; x.lineWidth = 34; x.beginPath(); x.moveTo(X - 52, ey - 78 + dy + s * tilt); x.quadraticCurveTo(X, ey - 108 + dy, X + 52, ey - 78 + dy - s * tilt); x.stroke(); };
  const lid = (s, dy = 0) => { const X = cx + t + s * ex; x.fillStyle = K; x.beginPath(); x.ellipse(X, ey + 8 + dy, 34, 28, 0, 0, Math.PI); x.fill(); x.strokeStyle = K; x.lineWidth = 26; x.beginPath(); x.moveTo(X - 46, ey + 4 + dy); x.lineTo(X + 46, ey + 4 + dy); x.stroke(); };
  const dot = s => { const X = cx + t + s * ex; x.fillStyle = K; x.beginPath(); x.ellipse(X, ey, 24, 30, 0, 0, Math.PI * 2); x.fill(); };
  const happy = s => { const X = cx + t + s * ex; x.strokeStyle = K; x.lineWidth = 20; x.beginPath(); x.moveTo(X - 40, ey + 12); x.quadraticCurveTo(X, ey - 34, X + 40, ey + 12); x.stroke(); };
  if (f === 'serio') { brow(-1, 4, 8); brow(1, 4, 8); lid(-1); lid(1); }
  if (f === 'picaro') { brow(-1, 10, 4); brow(1, -14, -6); lid(-1, 4); happy(1); }
  if (f === 'feliz') { brow(-1, -10, -4); brow(1, -10, -4); happy(-1); happy(1); }
  if (f === 'preocupado') { brow(-1, 0, -26); brow(1, 0, -26); lid(-1, 6); lid(1, 6); }
  if (f === 'sorpresa') { brow(-1, -14, 0); brow(1, -14, 0); dot(-1); dot(1); }
  // bigote: «U» invertida ancha, marrón con contorno oscuro
  const my = ey + 112, mx = cx + t; x.beginPath(); x.moveTo(mx, my - 26);
  x.bezierCurveTo(mx - 60, my - 52, mx - 150, my - 44, mx - 176, my + 10); x.bezierCurveTo(mx - 192, my + 54, mx - 186, my + 100, mx - 158, my + 100);
  x.bezierCurveTo(mx - 132, my + 100, mx - 128, my + 64, mx - 96, my + 56); x.bezierCurveTo(mx - 60, my + 46, mx - 20, my + 44, mx, my + 50);
  x.bezierCurveTo(mx + 20, my + 44, mx + 60, my + 46, mx + 96, my + 56); x.bezierCurveTo(mx + 128, my + 64, mx + 132, my + 100, mx + 158, my + 100);
  x.bezierCurveTo(mx + 186, my + 100, mx + 192, my + 54, mx + 176, my + 10); x.bezierCurveTo(mx + 150, my - 44, mx + 60, my - 52, mx, my - 26); x.closePath();
  x.fillStyle = MU; x.fill(); x.strokeStyle = K; x.lineWidth = 14; x.stroke();
  if (f === 'sorpresa') { x.fillStyle = '#4a1c1e'; x.beginPath(); x.ellipse(mx, my + 86, 20, 24, 0, 0, Math.PI * 2); x.fill(); x.strokeStyle = K; x.lineWidth = 10; x.stroke(); }
  if (f === 'picaro' || f === 'feliz') { x.strokeStyle = K; x.lineWidth = 12; x.beginPath(); x.moveTo(mx + 20, my + 76); x.quadraticCurveTo(mx + 46, my + 90, mx + 70, my + 72); x.stroke(); }
  const tex = new window._T.CanvasTexture(C); tex.colorSpace = 'srgb'; tex.anisotropy = 8;
  const m = g.userData.face.material; if (m.map) m.map.dispose(); m.map = tex; m.needsUpdate = true;
}

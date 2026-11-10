// Archivo Raro · 3D toon characters v2 (style A: big expressive heads). Same toon ramp + outline as the world.
// C3.makeChar(o) → { root, J, pose(p) }.  o: skin, hair, hairStyle ('quiff'|'buzz'), cap, capD, capLogo, top, topD, trim, sleeves ('short'|'long'),
//   hoodie, pants, pantsStripe, shoes, sole, heavy, iris, brow.
//   pose(p): body angles (radians) + face {lid 0..1, lookX, lookY, brow, browTilt, mouth:'smile'|'o'|'open'|'line'|'grin', mouthOpen}
const C3 = (() => {
  const T = G3.THREE;
  const soft = new T.DataTexture(new Uint8Array([168, 168, 168, 255, 218, 218, 218, 255, 255, 255, 255, 255]), 3, 1); soft.minFilter = soft.magFilter = T.NearestFilter; soft.needsUpdate = true;
  const M = (col, o = {}) => new T.MeshToonMaterial(Object.assign({ color: col, gradientMap: soft }, o));
  const noLine = m => { m.userData.outlineParameters = { visible: false }; return m; };
  const thin = (m, k) => { m.userData.outlineParameters = { thickness: k }; return m; };
  const basic = c => noLine(new T.MeshBasicMaterial({ color: c }));
  const add = (g, m, parent, x = 0, y = 0, z = 0) => { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = false; parent.add(o); return o; };
  const piv = (parent, x = 0, y = 0, z = 0) => { const g = new T.Group(); g.position.set(x, y, z); parent.add(g); return g; };
  const sph = (r, w = 28, h = 20) => new T.SphereGeometry(r, w, h);
  const lathe = (pts, seg = 28) => new T.LatheGeometry(pts.map(([r, y]) => new T.Vector2(Math.max(.0005, r), y)), seg);
  // tapered limb from y=0 down to y=-len, radius r0 → r1, rounded ends (lathe profile bottom → top)
  const limb = (r0, r1, len) => { const pts = [], n = 7;
    for (let i = 0; i <= n; i++) { const a = i / n * Math.PI / 2; pts.push([r1 * Math.sin(a), -len - r1 * Math.cos(a)]); }
    for (let i = 1; i < 6; i++) { const k = 1 - i / 6; pts.push([r0 + (r1 - r0) * k + Math.sin(k * Math.PI) * r0 * .07, -len * k]); }
    for (let i = 0; i <= n; i++) { const a = Math.PI / 2 - i / n * Math.PI / 2; pts.push([r0 * Math.sin(a), r0 * Math.cos(a)]); }
    return lathe(pts, 22); };
  const tube = (pts, r, mat) => new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p => new T.Vector3(...p))), 20, r, 8, false), mat);
  function mouthSet(parent, s) { const g = piv(parent); const dark = basic('#4a1518'), tongue = basic('#e0707a'), teeth = basic('#fbf7f0'), lip = basic('#6a2424');
    const mk = (shape, m, z = 0) => { const o = new T.Mesh(new T.ShapeGeometry(shape, 24), m); o.position.z = z; g.add(o); return o; };
    const E = (rx, ry) => { const sh = new T.Shape(); sh.absellipse(0, 0, rx, ry, 0, Math.PI * 2); return sh; };
    const smile = new T.Shape(); smile.moveTo(-s, s * .25); smile.quadraticCurveTo(0, -s * .9, s, s * .25); smile.quadraticCurveTo(0, -s * .42, -s, s * .25);
    const line = new T.Shape(); line.moveTo(-s * .6, 0); line.quadraticCurveTo(0, -s * .12, s * .6, 0); line.quadraticCurveTo(0, -s * .3, -s * .6, 0);
    const open = new T.Shape(); open.moveTo(-s, s * .35); open.quadraticCurveTo(0, s * .55, s, s * .35); open.quadraticCurveTo(s * .9, -s * 1.1, 0, -s * 1.15); open.quadraticCurveTo(-s * .9, -s * 1.1, -s, s * .35);
    const tth = new T.Shape(); tth.moveTo(-s * .78, s * .3); tth.quadraticCurveTo(0, s * .48, s * .78, s * .3); tth.lineTo(s * .7, s * .08); tth.quadraticCurveTo(0, s * .2, -s * .7, s * .08);
    const M_ = { smile: [mk(smile, lip)], line: [mk(line, lip)] };
    const t1 = mk(E(s * .26, s * .16), tongue, .001); t1.position.y = -s * .3; M_.o = [mk(E(s * .42, s * .55), dark), t1];
    const t2 = mk(E(s * .5, s * .3), tongue, .001); t2.position.y = -s * .78; M_.open = [mk(open, dark), mk(tth, teeth, .001), t2];
    M_.grin = [mk(open, dark), mk(tth, teeth, .001)];
    return { g, set(type, k = 1) { Object.entries(M_).forEach(([n, arr]) => arr.forEach(m => m.visible = n === type)); g.scale.set(1, type === 'open' || type === 'o' ? .6 + .5 * k : 1, 1); } }; }

  function makeChar(o) {
    const heavy = !!o.heavy;
    const P = { headR: .215, torso: .32, shW: heavy ? .2 : .17, waist: heavy ? .15 : .118, hipW: .095, arm: .22, fore: .2, leg: .31, shin: .3, rArm: heavy ? .05 : .043, rLeg: heavy ? .07 : .062 };
    const skin = thin(M(o.skin), .0028), skinD = M(mix(o.skin, '#a0503a', .3)), top = M(o.top), topD = M(o.topD || o.top), trim = M(o.trim || '#f4f1ea');
    const pants = M(o.pants), shoeM = M(o.shoes), soleM = thin(M(o.sole || '#f4f4f0'), .002), hairM = M(o.hair), hairL = M(mix(o.hair, '#ffffff', .16));
    const root = new T.Group(); G3.scene.add(root); const J = { P };
    // ---------- pelvis + legs ----------
    J.pelvis = piv(root);
    const hip = add(lathe([[0, -.075], [P.hipW + .025, -.07], [P.hipW + .04, -.02], [P.waist * .95, .05], [0, .055]]), pants, J.pelvis); hip.scale.set(1.25, 1, .85);
    ['L', 'R'].forEach((sd, i) => { const s = i ? 1 : -1;
      const hp = J['hip' + sd] = piv(J.pelvis, s * P.hipW * .72, -.04, 0);
      add(limb(P.rLeg * 1.12, P.rLeg * .92, P.leg), pants, hp);
      if (o.pantsStripe) add(limb(.007, .007, P.leg * .9), noLine(M(o.pantsStripe)), hp, s * P.rLeg * 1.05, -.01, 0);
      const kn = J['kn' + sd] = piv(hp, 0, -P.leg, 0);
      add(limb(P.rLeg * .92, P.rLeg * .8, P.shin), pants, kn);
      const cf = add(new T.TorusGeometry(P.rLeg * .82, .013, 8, 20), M(o.cuff || mix(o.pants, '#000000', .2)), kn, 0, -P.shin + .02, 0); cf.rotation.x = Math.PI / 2;
      const ft = J['ft' + sd] = piv(kn, 0, -P.shin - .02, 0);
      const up = add(sph(.07, 24, 16), shoeM, ft, 0, -.022, .045); up.scale.set(.95, .74, 1.75);
      const so = add(new T.CylinderGeometry(.072, .076, .032, 24), soleM, ft, 0, -.07, .045); so.scale.set(.96, 1, 1.82);
      const toe = add(sph(.05, 16, 12), soleM, ft, 0, -.05, .145); toe.scale.set(1.2, .55, .8);
      for (let k = 0; k < 3; k++) { const l = add(new T.BoxGeometry(.05, .008, .012), basic('#ffffff'), ft, 0, .02 - k * .007, .035 + k * .028); l.rotation.x = -.55; }
    });
    // ---------- torso ----------
    J.spine = piv(J.pelvis, 0, .04, 0);
    const tw = P.shW, wz = .82;
    const torso = add(lathe([[0, -.02], [P.waist, -.012], [P.waist * 1.02, .06], [tw * .82, .2], [tw * .92, P.torso - .08], [tw * .78, P.torso - .02], [.06, P.torso + .01], [0, P.torso + .015]]), top, J.spine);
    torso.scale.set(1.18, 1, wz);
    const hem = add(new T.TorusGeometry(P.waist * 1.04, .017, 8, 28), o.hoodie ? topD : top, J.spine, 0, -.004, 0); hem.rotation.x = Math.PI / 2; hem.scale.set(1.18, wz, 1);
    const collar = add(new T.TorusGeometry(.058, .013, 8, 22), o.hoodie ? topD : trim, J.spine, 0, P.torso - .004, .004); collar.rotation.x = Math.PI / 2 - .25;
    if (o.hoodie) {
      const hood = add(new T.TorusGeometry(.085, .048, 12, 24, Math.PI * 1.3), topD, J.spine, 0, P.torso - .005, -.04); hood.rotation.set(Math.PI / 2 - .4, 0, Math.PI * .35);
      const pk = add(new T.CylinderGeometry(.15, .165, .1, 24, 1, false, -Math.PI * .28, Math.PI * .56), topD, J.spine, 0, .09, 0); pk.scale.set(1.15, 1, .86);
      [-.03, .03].forEach(x => { J.spine.add(tube([[x, P.torso - .02, .09], [x * 1.1, P.torso - .08, .135], [x * 1.2, P.torso - .14, .145]], .006, basic('#f1e6dc')));
        add(sph(.011), basic('#d9cdbd'), J.spine, x * 1.2, P.torso - .145, .146); }); }
    // ---------- arms ----------
    ['L', 'R'].forEach((sd, i) => { const s = i ? 1 : -1;
      const sh = J['sh' + sd] = piv(J.spine, s * tw * 1.02, P.torso - .065, 0);
      add(sph(P.rArm * 1.35), top, sh);
      const shortS = o.sleeves !== 'long';
      if (shortS) { add(lathe([[P.rArm * 1.2, -.105], [P.rArm * 1.6, -.1], [P.rArm * 1.55, -.05], [P.rArm * 1.42, 0], [0, .02]]), top, sh);
        if (o.trim) { const tr = add(new T.TorusGeometry(P.rArm * 1.58, .009, 8, 20), noLine(trim), sh, 0, -.08, 0); tr.rotation.x = Math.PI / 2; } }
      add(limb(P.rArm, P.rArm * .9, P.arm), shortS ? skin : top, sh);
      const el = J['el' + sd] = piv(sh, 0, -P.arm, 0);
      add(limb(P.rArm * .9, P.rArm * .78, P.fore), shortS ? skin : top, el);
      if (!shortS) { const cu = add(new T.TorusGeometry(P.rArm * .82, .012, 8, 18), topD, el, 0, -P.fore + .015, 0); cu.rotation.x = Math.PI / 2; }
      const hd = J['hand' + sd] = piv(el, 0, -P.fore - .005, 0);
      const palm = add(sph(.042, 18, 14), skin, hd, 0, -.035, 0); palm.scale.set(1, 1.05, .62);
      for (let f = 0; f < 4; f++) { const fp = piv(hd, (f - 1.5) * .02, -.065, .004); fp.rotation.z = (f - 1.5) * .06; fp.userData.finger = true; add(limb(.0105, .0095, .042 - Math.abs(f - 1.5) * .006), skin, fp); }
      const th = add(limb(.012, .011, .038), skin, hd, -s * .036, -.03, .012); th.rotation.set(-.3, 0, -s * .9);
    });
    // ---------- head ----------
    J.neck = piv(J.spine, 0, P.torso, 0); add(new T.CylinderGeometry(.04, .046, .07, 16), skin, J.neck, 0, .02, 0);
    J.head = piv(J.neck, 0, .045, 0); const hr = P.headR, hy = hr * .92;
    const skull = add(sph(hr, 36, 28), skin, J.head, 0, hy + .01, -.005); skull.scale.set(1, .97, .96);
    const jaw = add(sph(hr * .86, 32, 24), skin, J.head, 0, hy - hr * .2, hr * .07); jaw.scale.set(1.05, .9, .95);
    [-1, 1].forEach(s => { const e = add(sph(hr * .2), skin, J.head, s * hr * .97, hy - hr * .02, -hr * .05); e.scale.set(.55, 1, .8);
    });
    const nose = add(sph(hr * .11), skin, J.head, 0, hy - hr * .12, hr * .93); nose.scale.set(1.1, .85, .8);
    [-1, 1].forEach(s => { const b = add(new T.CircleGeometry(hr * .12, 20), noLine(new T.MeshBasicMaterial({ color: '#f2878b', transparent: true, opacity: .35 })), J.head, s * hr * .56, hy - hr * .24, hr * .8); b.rotation.y = s * .62; });
    J.eyes = [];
    [-1, 1].forEach(s => { const e = piv(J.head, s * hr * .37, hy + hr * .06, hr * .76); e.rotation.y = s * .3;
      const ball = add(sph(hr * .3, 28, 20), thin(M('#ffffff'), .0022), e); ball.scale.set(.8, .94, .42);
      const irisG = piv(e, 0, 0, hr * .124);
      add(new T.CircleGeometry(hr * .18, 28), basic(o.iris || '#5a3418'), irisG);
      add(new T.CircleGeometry(hr * .11, 24), basic('#120c10'), irisG, 0, 0, .001);
      add(new T.CircleGeometry(hr * .062, 16), basic('#ffffff'), irisG, hr * .065, hr * .075, .002);
      add(new T.CircleGeometry(hr * .025, 12), basic('#ffffff'), irisG, -hr * .05, -hr * .06, .002);
      const lidP = piv(e); const lid = add(new T.SphereGeometry(hr * .312, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), skin, lidP); lid.scale.set(.84, 1.04, .5);
      const lash = add(new T.TorusGeometry(hr * .27, hr * .02, 6, 24, Math.PI), basic('#1d1418'), lidP); lash.scale.set(.84, 1, .5); lash.rotation.x = Math.PI / 2;
      const bp = piv(J.head, s * hr * .38, hy + hr * .46, hr * .84); bp.rotation.y = s * .3;
      const brow = tube([[-hr * .16, -hr * .02, 0], [0, hr * .03, 0], [hr * .16, -hr * .015, 0]], hr * .032, basic(o.brow || o.hair)); bp.add(brow); brow.scale.x = s;
      const shut = tube([[-hr * .2, hr * .02, hr * .12], [0, -hr * .07, hr * .14], [hr * .2, hr * .02, hr * .12]], hr * .028, basic('#1d1418')); e.add(shut); shut.visible = false;
      J.eyes.push({ e, ball, irisG, lidP, bp, s, shut }); });
    const mp = piv(J.head, 0, hy - hr * .43, hr * .87); mp.rotation.x = -.18; J.mouth = mouthSet(mp, hr * .2);
    // ---------- hair ----------
    const hg = piv(J.head, 0, hy + .01, -.005);
    if (o.hairStyle === 'quiff' || o.hairStyle === 'buzz') {
      const capH = add(new T.SphereGeometry(hr * 1.045, 32, 18, 0, Math.PI * 2, 0, Math.PI * .5), hairM, hg); capH.rotation.x = -.58; capH.scale.set(1.03, .98, 1.02);
      const back = add(sph(hr * .84), hairM, hg, 0, -hr * .22, -hr * .2); back.scale.set(1.12, .9, .82);
      [-1, 1].forEach(s => { const sb = add(sph(hr * .2), hairM, hg, s * hr * .9, -hr * .02, hr * .08); sb.scale.set(.35, .8, .6); });
      for (let k = 0; k < 4; k++) { const fr = add(sph(hr * .2, 16, 12), hairM, hg, hr * (-.42 + k * .28), hr * (.6 - Math.abs(k - 1.5) * .03), hr * (.74 - Math.abs(k - 1.5) * .06)); fr.scale.set(1.1, .55, .7); fr.rotation.set(-.6, 0, (k - 1.5) * -.3); }
      if (o.hairStyle === 'quiff') for (let k = 0; k < 5; k++) { const lk = add(sph(hr * (.36 - Math.abs(k - 2) * .03), 20, 14), k % 2 ? hairL : hairM, hg, hr * (-.32 + k * .16), hr * (.8 - Math.abs(k - 2) * .07), hr * (.5 - Math.abs(k - 2) * .1));
        lk.scale.set(.75, .55, 1.45); lk.rotation.set(-.85, (k - 2) * .18, (k - 2) * -.2); } }
    if (o.cap) { const cg = piv(J.head, 0, hy + .01, -.005), capM = M(o.cap), capDM = M(o.capD || o.cap);
      const dome = add(new T.SphereGeometry(hr * 1.07, 32, 16, 0, Math.PI * 2, 0, Math.PI * .5), capM, cg, 0, hr * .22, -hr * .03); dome.scale.set(1, .82, 1.02);
      const band = add(new T.CylinderGeometry(hr * 1.07, hr * 1.08, hr * .14, 32, 1, true), capDM, cg, 0, hr * .2, -hr * .03);
      const brim = add(new T.CylinderGeometry(hr * .78, hr * .78, hr * .05, 28, 1, false, -Math.PI / 2, Math.PI), capDM, cg, 0, hr * .2, hr * .78); brim.scale.set(1, 1, .7); brim.rotation.x = .12;
      add(sph(hr * .1), capDM, cg, 0, hr * 1.1, -hr * .03).scale.y = .6;
      const logo = add(new T.CircleGeometry(hr * .17, 20), basic(o.capLogo || '#ffd34a'), cg, 0, hr * .5, hr * 1.03); logo.rotation.x = -.32;
      [-1, 1].forEach(s => { const hh = add(sph(hr * .3), hairM, cg, s * hr * .86, -hr * .02, -hr * .22); hh.scale.set(.4, .75, .9); });
      const nape = add(sph(hr * .8), hairM, cg, 0, -hr * .22, -hr * .42); nape.scale.set(1.05, .6, .55); }
    J.legLen = P.leg + P.shin + .115;
    function pose(p = {}) { const g = (k, d = 0) => p[k] ?? d;
      J.spine.rotation.set(g('spX'), g('spY'), g('spZ')); J.head.rotation.set(g('hdX'), g('hdY'), g('hdZ'));
      ['L', 'R'].forEach((sd, i) => { const s = i ? 1 : -1;
        J['sh' + sd].rotation.set(g('shX' + sd), g('shY' + sd), s * g('shZ' + sd, .14)); J['el' + sd].rotation.set(g('elX' + sd, -.2), 0, 0);
        J['hand' + sd].rotation.set(g('hX' + sd), 0, s * g('hZ' + sd)); J['hand' + sd].children.forEach(c => { if (c.userData.finger) c.rotation.x = g('curl' + sd, .3); });
        J['hip' + sd].rotation.set(g('hipX' + sd), 0, s * g('hipZ' + sd, .03)); J['kn' + sd].rotation.set(g('knX' + sd), 0, 0); J['ft' + sd].rotation.set(g('ftX' + sd), 0, 0); });
      const lid = g('lid', .06), lx = g('lookX'), ly = g('lookY'), br = g('brow'), bt = g('browTilt');
      J.eyes.forEach(E => { const cl = lid > .85; E.ball.visible = !cl; E.lidP.visible = !cl; E.shut.visible = cl; E.lidP.rotation.x = -1.05 + Math.min(lid, .8) * 2.7; E.irisG.position.x = lx * hr * .09; E.irisG.position.y = -hr * .015 + ly * hr * .1; E.irisG.visible = !cl;
        E.bp.position.y = hy + hr * (.46 + br * .08); E.bp.rotation.z = E.s * (bt * .35); });
      J.mouth.set(g('mouth', 'smile'), g('mouthOpen', 1)); root.updateMatrixWorld(true); }
    pose({}); return { root, J, pose };
  }
  return { makeChar };
})();

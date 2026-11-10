// 3D toon characters (same toon ramp + outline as the world). makeChar(o) → { root, J (joints), pose(p) }
// o.style: 'big' (big head, big eyes) | 'real' (realistic proportions) | 'blank' (faceless mannequin)
const C3 = (() => {
  const T = G3.THREE, M = G3.M;
  const noLine = m => { m.userData.outlineParameters = { visible: false }; return m; };
  const thin = (m, k) => { m.userData.outlineParameters = { thickness: k }; return m; };
  const mesh = (g, m, parent, x = 0, y = 0, z = 0) => { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; };
  const piv = (parent, x = 0, y = 0, z = 0) => { const g = new T.Group(); g.position.set(x, y, z); parent.add(g); return g; };
  const cap = (r, l) => new T.CapsuleGeometry(r, l, 6, 14);
  const sph = (r) => new T.SphereGeometry(r, 24, 16);
  function makeChar(o) {
    const st = o.style || 'big', big = st === 'big', blank = st === 'blank';
    const P = big ? { leg: .36, shin: .34, torso: .34, headR: .19, arm: .25, fore: .23, hipW: .1, shW: .19, limb: .062, neck: .05 }
                  : { leg: .43, shin: .42, torso: .44, headR: .13, arm: .29, fore: .27, hipW: .1, shW: .2, limb: .05, neck: .08 };
    if (o.heavy) { P.limb *= 1.18; P.shW *= 1.1; }
    const skin = thin(M(o.skin), .003), top = M(o.top), topD = M(o.topD || o.top), pants = M(o.pants), shoe = M(o.shoes), hairM = M(o.hair);
    const root = new T.Group(); G3.scene.add(root);
    const J = {};
    // pelvis + spine
    J.pelvis = piv(root, 0, 0, 0);
    mesh(cap(P.hipW + .03, .08), pants, J.pelvis, 0, 0, 0).rotation.z = Math.PI / 2;
    J.spine = piv(J.pelvis, 0, .04, 0);
    const torsoW = P.shW * (o.heavy ? 1.05 : .92);
    const ch = mesh(cap(torsoW * .62, P.torso - torsoW * .6), top, J.spine, 0, P.torso / 2, 0); ch.scale.set(1.18, 1, .78);
    if (o.hoodie) { mesh(new T.TorusGeometry(.085, .045, 10, 20), topD, J.spine, 0, P.torso + .01, -.035).rotation.x = Math.PI / 2 - .5;
      [-.035, .035].forEach(x => mesh(new T.CylinderGeometry(.008, .008, .16, 6), noLine(M('#f1e6dc')), J.spine, x, P.torso - .1, torsoW * .5)); }
    if (o.number) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.fillStyle = o.top; g.fillRect(0, 0, 128, 128); g.fillStyle = '#ffffff'; g.font = '900 86px Inter'; g.textAlign = 'center'; g.fillText(o.number, 64, 98);
      const tx = new T.CanvasTexture(c); tx.colorSpace = T.SRGBColorSpace; const pl = mesh(new T.PlaneGeometry(.16, .16), noLine(new T.MeshBasicMaterial({ map: tx, transparent: true })), J.spine, 0, P.torso * .55, torsoW * .62 * .78 + .005); }
    J.neck = piv(J.spine, 0, P.torso + .02, 0); mesh(new T.CylinderGeometry(.045, .05, P.neck + .04, 12), skin, J.neck, 0, P.neck / 2, 0);
    J.head = piv(J.neck, 0, P.neck, 0);
    const hr = P.headR, head = mesh(sph(hr), skin, J.head, 0, hr * .95, 0); head.scale.set(1, big ? .96 : 1.12, big ? .96 : 1.02);
    const hy = hr * .95;
    // ears, nose
    [-1, 1].forEach(s => mesh(sph(hr * .2), skin, J.head, s * hr * .98, hy, 0).scale.set(.6, 1, .8));
    if (!blank) {
      mesh(sph(hr * (big ? .1 : .13)), skin, J.head, 0, hy - hr * .08, hr * .98).scale.set(1, .9, .8);
      // eyes
      J.eyes = [];
      const ew = big ? .3 : .21, eh = big ? .38 : .27;
      [-1, 1].forEach(s => { const e = piv(J.head, s * hr * (big ? .36 : .34), hy + hr * (big ? .1 : .12), hr * .86);
        const white = mesh(sph(hr * ew), thin(M('#ffffff'), .0025), e); white.scale.set(1, eh / ew, .45);
        const pu = mesh(sph(hr * ew * .55), noLine(new T.MeshBasicMaterial({ color: '#1a1420' })), e, 0, -hr * .02, hr * ew * .3); pu.scale.set(1, eh / ew, .4);
        const hl = mesh(sph(hr * ew * .17), noLine(new T.MeshBasicMaterial({ color: '#ffffff' })), e, hr * ew * .2, hr * ew * .32, hr * ew * .45);
        const brow = mesh(new T.CapsuleGeometry(hr * .045, hr * ew * 1.1, 4, 8), M(o.hair), J.head, s * hr * (big ? .36 : .34), hy + hr * (big ? .46 : .36), hr * .93); brow.rotation.z = Math.PI / 2 + s * .12; noLine(brow.material);
        J.eyes.push({ e, white, pu, brow, s }); });
      // mouth (flat dark ellipse that can open)
      J.mouth = mesh(sph(hr * .16), noLine(new T.MeshBasicMaterial({ color: '#5a1f22' })), J.head, 0, hy - hr * (big ? .42 : .45), hr * .93); J.mouth.scale.set(1, .5, .25);
      [-1, 1].forEach(s => { const b = mesh(new T.CircleGeometry(hr * .16, 16), noLine(new T.MeshBasicMaterial({ color: '#f08f8f', transparent: true, opacity: .55 })), J.head, s * hr * .55, hy - hr * .2, hr * .84); b.rotation.y = s * .55; });
    }
    // hair
    if (o.hairStyle === 'quiff') { const hg = piv(J.head, 0, hy, 0);
      const cap1 = mesh(sph(hr * 1.05), hairM, hg, 0, hr * .22, -hr * .12); cap1.scale.set(1.03, .78, 1.0);
      const fr = mesh(sph(hr * .7), hairM, hg, -hr * .15, hr * .62, hr * .42); fr.scale.set(1.25, .55, .8); fr.rotation.z = .25;
      const q = mesh(sph(hr * .55), hairM, hg, hr * .2, hr * .86, hr * .38); q.scale.set(1.35, .85, 1.1); q.rotation.z = -.35;
      [-1, 1].forEach(s => mesh(sph(hr * .35), hairM, hg, s * hr * .78, hr * .35, -hr * .05).scale.set(.5, 1, 1));
      // cut the face free of hair: a skin "face" bulge in front
    }
    if (o.cap) { const cg = piv(J.head, 0, hy, 0); const dome = mesh(new T.SphereGeometry(hr * 1.06, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M(o.cap), cg, 0, hr * .4, -hr * .04); dome.scale.y = .9;
      const brim = mesh(new T.CylinderGeometry(hr * .72, hr * .72, hr * .06, 20, 1, false, -Math.PI / 2, Math.PI), M(o.capD || o.cap), cg, 0, hr * .44, hr * .62); brim.scale.set(1, 1, .85); brim.rotation.x = -.18;
      mesh(sph(hr * .12), M(o.capD || o.cap), cg, 0, hr * 1.36, -hr * .04);
      [-1, 1].forEach(s => mesh(sph(hr * .3), hairM, cg, s * hr * .85, -hr * .1, -hr * .2).scale.set(.45, .8, .9)); }
    // arms
    ['L', 'R'].forEach((side, i) => { const s = i ? 1 : -1;
      const sh = J['sh' + side] = piv(J.spine, s * torsoW * .98, P.torso - .05, 0);
      mesh(sph(P.limb * 1.25), o.sleeveless ? skin : top, sh);
      const up = mesh(cap(P.limb, P.arm - P.limb), o.shortSleeves ? skin : top, sh, 0, -P.arm / 2, 0);
      if (o.shortSleeves) mesh(cap(P.limb * 1.22, P.arm * .3), top, sh, 0, -P.arm * .2, 0);
      const el = J['el' + side] = piv(sh, 0, -P.arm, 0);
      mesh(cap(P.limb * .92, P.fore - P.limb), o.shortSleeves ? skin : top, el, 0, -P.fore / 2, 0);
      if (!o.shortSleeves) mesh(cap(P.limb * 1.08, .04), topD, el, 0, -P.fore + .03, 0);
      const hand = J['hand' + side] = piv(el, 0, -P.fore - .02, 0);
      mesh(sph(P.limb * 1.08), skin, hand, 0, -.03, 0).scale.set(.85, 1.15, .65);
      mesh(cap(P.limb * .32, .03), skin, hand, s * -P.limb * .75, -.01, P.limb * .4).rotation.z = s * .6; });
    // legs
    ['L', 'R'].forEach((side, i) => { const s = i ? 1 : -1;
      const hp = J['hip' + side] = piv(J.pelvis, s * P.hipW * .85, -.02, 0);
      mesh(cap(P.limb * 1.35, P.leg - P.limb), pants, hp, 0, -P.leg / 2, 0);
      const kn = J['kn' + side] = piv(hp, 0, -P.leg, 0);
      mesh(cap(P.limb * 1.15, P.shin - P.limb), pants, kn, 0, -P.shin / 2, 0);
      const ft = J['ft' + side] = piv(kn, 0, -P.shin, 0);
      const sh = mesh(new G3.THREE.CapsuleGeometry(P.limb * 1.2, .13, 4, 10), shoe, ft, 0, -.035, .05); sh.rotation.x = Math.PI / 2; sh.scale.set(1.1, 1, .8);
      mesh(new T.CylinderGeometry(P.limb * 1.25, P.limb * 1.25, .025, 12), noLine(M('#f2f2f2')), ft, 0, -.075, .05); });
    J.legLen = P.leg + P.shin + .08; J.P = P;
    function pose(p = {}) { // angles in radians: sh/el per side (x forward, z side), hip/kn per side, spine, head, face
      const g = (k, d = 0) => p[k] ?? d;
      J.spine.rotation.set(g('spX'), g('spY'), g('spZ')); J.head.rotation.set(g('hdX'), g('hdY'), g('hdZ'));
      ['L', 'R'].forEach((sd, i) => { const s = i ? 1 : -1;
        J['sh' + sd].rotation.set(g('shX' + sd), 0, s * g('shZ' + sd, .12)); J['el' + sd].rotation.set(g('elX' + sd, -.15), 0, 0);
        J['hip' + sd].rotation.set(g('hipX' + sd), 0, s * g('hipZ' + sd, .03)); J['kn' + sd].rotation.set(g('knX' + sd), 0, 0); J['ft' + sd].rotation.set(g('ftX' + sd), 0, 0); });
      if (J.eyes) { const open = g('eyeOpen', 1), lx = g('lookX'), ly = g('lookY');
        J.eyes.forEach(E => { E.e.scale.y = Math.max(.08, open); E.pu.position.x = lx * P.headR * .09; E.pu.position.y = -P.headR * .02 + ly * P.headR * .08;
          E.brow.position.y = P.headR * .95 + P.headR * ((big ? .46 : .36) + g('brow') * .1); E.brow.rotation.z = Math.PI / 2 + E.s * (.12 + g('browTilt') * .35); });
        J.mouth.scale.set(g('mouthW', 1), .2 + g('mouthOpen', .3) * .9, .25); }
      root.updateMatrixWorld(true); }
    pose({});
    return { root, J, pose };
  }
  return { makeChar };
})();

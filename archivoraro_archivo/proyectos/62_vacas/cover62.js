// Portada 62 · Las vacas cebra (póster 3D): Kenji orgulloso con la brocha junto a la vaca cebra, una mosca mareada que acaba de chocar,
// y al fondo la vaca negra cubierta de moscas. Texto abajo: gancho corto + título enorme con «CEBRA» rayado.
window.renderCover = function (o = {}) {
  const t = 12.3; window.__T = t; setup(t, 0);
  const cp = V3(o.cx ?? -1.2, o.cy ?? 3.4, o.cz ?? -2.2), cl = V3(o.lx ?? -2.4, o.ly ?? .5, o.lz ?? -9.5);
  W.setCam(cp, cl, o.f ?? 46, cp.distanceTo(cl), o.ap ?? .004); W.render();
  // posiciones propias de la portada (en vertical, cámara alta: lo lejano queda más arriba → las dos vacas se apilan)
  const Z1 = V3(o.zx ?? -2.6, 0, o.zz ?? -7.6), B3 = V3(o.bx ?? -2.2, 0, o.bz ?? -11.2), KF = V3(o.kx ?? -1.9, 0, o.kz ?? -5.2);
  const fr1 = frameOf(Z1, 1.45), fr3 = frameOf(B3, 1.4);
  const L = [
    { p: B3, f: () => cow(cowLife(t, 2, Object.assign({}, COW3O, { eyes: 'annoyed', tail: .7 })), B3, 'right') + landing(fr3, 1, bodyPts(128, 31), t, -9, 1, fr3.s * 1.25) + buzz(fr3.x, fr3.y - 330 * fr3.s, 12, 330 * fr3.s, fr3.s * 1.3, t, 4) },
    { p: Z1, f: () => cow(cowLife(t, 0, Object.assign({}, COW1_DONE, { eyes: 'lid', chew: .6, headTurn: -.25 })), Z1, 'right') },
    { p: KF, f: () => who(KENJI, { prop: 'brush', brushHand: o.bh ?? 'R', brushRot: o.br ?? -28, brushScale: .62, armR: o.arm ?? [128, 28], armL: o.armL ?? [10, 14], look: [4, 2], face: 'smug', mouth: 'smirk', brows: .2, browTilt: .3, splat: true }, KF) }];
  let s = byDist(L);
  // la mosca que se acaba de estampar contra la cebra: ojos en espiral y estrellitas
  const [FX, FY] = toScr(fr1, o.fx ?? 60, o.fy ?? -470, 1);
  s += bigFly(FX, FY, (o.fs ?? 1.15) * fr1.s / .9, t, { eye: 'spiral', legs: 'out', rot: 28 }) + stars(FX + 10, FY - 120 * fr1.s, 120 * fr1.s, t, 4, fr1.s * 1.6);
  document.getElementById('fx').innerHTML = s + `<defs><radialGradient id="vg3" cx=".5" cy=".42" r=".8"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#vg3)"/>`;
  document.getElementById('cap').innerHTML = '';
  // ---------- texto ----------
  const hook = o.hook ?? 'SE RIERON DE ÉL…', y0 = o.ty ?? 1500;
  document.getElementById('ttl').innerHTML = `<defs>
      <linearGradient id="dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0a14" stop-opacity="0"/><stop offset=".55" stop-color="#0d0a14" stop-opacity=".62"/><stop offset="1" stop-color="#0d0a14" stop-opacity=".9"/></linearGradient>
      <pattern id="zeb" patternUnits="userSpaceOnUse" width="64" height="64" patternTransform="rotate(14)"><rect width="64" height="64" fill="#ffffff"/><rect width="17" height="64" fill="#14111a"/></pattern>
      <filter id="gl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect y="1150" width="1080" height="770" fill="url(#dk)"/>
    <text x="540" y="${y0 - 205}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="84" letter-spacing="-1" fill="#ffd34a" stroke="#14111a" stroke-width="14" stroke-linejoin="round" paint-order="stroke" filter="url(#gl)">${hook}</text>
    <text x="540" y="${y0}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="196" letter-spacing="-4" fill="#ffffff" stroke="#14111a" stroke-width="18" stroke-linejoin="round" paint-order="stroke">VACAS</text>
    <text x="540" y="${y0 + 190}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="210" letter-spacing="-4" fill="url(#zeb)" stroke="#14111a" stroke-width="18" stroke-linejoin="round" paint-order="stroke">CEBRA</text>`;
};

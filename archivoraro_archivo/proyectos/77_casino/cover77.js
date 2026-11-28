// Portada 77 · Las tres reglas secretas de los casinos: el jugador hipnotizado delante de la tragaperras que celebra,
// y arriba, el reloj gigante tachado. Texto abajo: gancho corto + título enorme con «CASINOS» dorado.
window.renderCover = function (o = {}) {
  const t = o.t ?? 50; window.__T = t; setup(t, 'hall', 'casino'); W.hero('hall', o.hx ?? -.5, 0, 2.2, .1, 1); clk(480, 0);
  W.slotScr([t * 3, t * 2.6, t * 3.3], t * 2);
  const cp = V3(o.cx ?? .45, o.cy ?? 1.25, o.cz ?? 9.6), cl = V3(o.lx ?? 0, o.ly ?? 2.55, o.lz ?? -4);
  W.setCam(cp, cl, o.f ?? 30, cp.distanceTo(cl), .0004); W.render();
  const F = V3(o.jx ?? .45, 0, o.jz ?? 5.0), h = headScr(F), q = scrX(V3(0, 3.4, -17.4));
  let s = depth([man('JUG', F, { turn: -.25, face: o.face ?? 'hypno', mouth: o.mouth ?? 'pout', armR: [40, 30], armL: [30, 20], brows: .2 })]);
  s += redX(q.x, q.y, o.xs ?? 1.5, 1) + confetti(t, 40, 0) + sparkles(h.x, h.y, 260, t, 8, 1.2) + mnotes(o.nx ?? 260, o.ny ?? 820, t, 5, 1.0);
  document.getElementById('fx').innerHTML = s + `<defs><radialGradient id="vg3" cx=".5" cy=".42" r=".8"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#vg3)"/>`;
  document.getElementById('cap').innerHTML = '';
  const hook = o.hook ?? 'NO ES CASUALIDAD', y0 = o.ty ?? 1560;
  document.getElementById('ttl').innerHTML = `<defs>
      <linearGradient id="dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0a14" stop-opacity="0"/><stop offset=".5" stop-color="#0d0a14" stop-opacity=".6"/><stop offset="1" stop-color="#0d0a14" stop-opacity=".92"/></linearGradient>
      <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a0"/><stop offset=".55" stop-color="#ffc53a"/><stop offset="1" stop-color="#ff8a1c"/></linearGradient>
      <filter id="gl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect y="1180" width="1080" height="740" fill="url(#dk)"/>
    <text x="540" y="${y0 - 215}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="80" letter-spacing="-1" fill="#ffd34a" stroke="#14111a" stroke-width="14" stroke-linejoin="round" paint-order="stroke" filter="url(#gl)">${hook}</text>
    <text x="540" y="${y0 - 20}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="134" letter-spacing="-3" fill="#ffffff" stroke="#14111a" stroke-width="16" stroke-linejoin="round" paint-order="stroke">3 REGLAS DEL</text>
    <text x="540" y="${y0 + 170}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="200" letter-spacing="-5" fill="url(#gd)" stroke="#14111a" stroke-width="18" stroke-linejoin="round" paint-order="stroke" filter="url(#gl)">CASINO</text>`;
};

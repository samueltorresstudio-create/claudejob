// Ejemplo del ESTILO 3D: gancho de «10 segundos sin gravedad». Dani salta, la gravedad desaparece, Iker mira desde el poste.
// Cada escena: 1) mueve el mundo 3D, 2) coloca la cámara (W2.setCam), 3) W2.render(), 4) devuelve el SVG de personajes y efectos.
const EVS = { jump: B => ({ off: B[0].w[5], salto: B[1].w[7] }) };
const S = {};
const DANI = { outfit: 'tee', top: '#f27b2b', topD: '#b8501a', strap: '#2f3a52', number: '7', hair2: 'tupe', hairCol: '#2a1a12', shoes: '#f4f2ec', sole: '#e94b3c' };
const IKER = { outfit: 'hood', top: '#34a061', topD: '#20703f', cap: '#1f3c88', capD: '#16295e', capLogo: '#ffd34a', hair2: 'capHair', hairCol: '#5a3a22', shoes: '#2a2c34', sole: '#f4f2ec', belly: 1.12 };
W2.charLight = { tint: '#ffe2bd', k: .14, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.6 };   // la luz del sitio tiñe a los personajes
S.jump = (t, D, B) => { const E = EVS.jump(B), T0 = E.off, W = W2;
  // posición de Dani: corre botando, salta y al quitar la gravedad sigue subiendo
  const g = t < T0 ? -(T0 - t) : (t - T0) * .03; let F, H, o;
  if (t < T0 - .45) { const z = -11.2 + 5 * ((T0 - .45) - t) * .25, ph = t * 14; F = V3(.25, 0, z); H = V3(.25, 1.6, z - .15);
    o = { face: 'smug', mouth: 'smirk', legL: [Math.sin(ph) * 28, 18 + 22 * Math.max(0, Math.sin(ph))], legR: [-Math.sin(ph) * 28, 18 + 22 * Math.max(0, -Math.sin(ph))], armL: [25 - 28 * Math.sin(ph), 35], armR: [30, 50], lean: -4 };
    W.BALL.position.set(.62, .12 + Math.abs(Math.sin(t * 7)) * .78, z - .35); }
  else { const tau = Math.min(t - (T0 - .45), .45), y0 = 3.78 * tau * .3 - 4.9 * (tau * .3) ** 2 + Math.max(0, g) * 3, z = -11.2 - .6 * tau; F = V3(.25, y0 * 2.4, z); H = F.clone().addScaledVector(V3(0, .97, -.24).normalize(), 1.62);
    const sh = t > T0 + .25; o = { face: sh ? 'wide' : 'smug', mouth: sh ? (t > E.salto ? 'grin' : 'line') : 'smirk', brows: sh ? 1 : 0, armL: [150, 20], armR: [168, -10], legL: [12, 55], legR: [26, 75], sweat: t > E.salto, lean: -3 };
    W.BALL.position.copy(H).add(V3(.12, .78 + Math.max(0, t - T0) * .3, -.2)); }
  W.floaters(Math.max(0, t - T0) * .9); W.setNet(t, t > T0 ? clamp((t - T0) / 1.2) : 0);
  // cámara: plano bajo siguiendo a Dani y, tras el gancho, plano general
  const c = F.clone().lerp(H, .5); let pos, look, fov = 50, ap = .0035;
  if (t < T0) { pos = c.clone().add(V3(2.7, .05, 3.3)); look = c.clone().add(V3(-.5, .3, -1.6)); }
  else if (t < E.salto) { pos = V3(1.5, .4, -9.2); look = c.clone().add(V3(0, .5, -.3)); fov = 55; }
  else { pos = H.clone().add(V3(.8, -.25, 2.0)); look = H.clone().add(V3(0, -.2, 0)); fov = 40; ap = .006; }
  W.setCam(pos, look, fov, pos.distanceTo(c), ap); W.render();
  // personajes (de atrás hacia delante) + efectos
  let s = stickAt(Object.assign({}, IKER, { face: t > T0 + .4 ? 'wide' : 'open', mouth: t > T0 + .4 ? 'o' : 'smile', look: [-4, -6], armL: [18, 15], armR: [18, 15] }), V3(.55, 0, -14.35), V3(.55, 1.66, -14.35), W, { blur: fov < 45 ? 6 : 0 });
  s += stickAt(Object.assign({}, DANI, o), F, H, W);
  const k = (t - T0) / 1.1, p = W.proj(V3(0, 0, -11)); if (p.ok) s += ring(p.x, p.y, 1000, k, '#cdeeff');
  if (t > T0 && t < T0 + .18) s += `<rect width="1080" height="1920" fill="#eaf6ff" opacity="${(.55 * (1 - (t - T0) / .18)).toFixed(2)}"/>`;
  return s + motes(t, 30, .45); };
window.CFG = { capY: 880 };

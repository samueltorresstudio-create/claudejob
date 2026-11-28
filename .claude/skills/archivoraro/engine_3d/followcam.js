// followcam.js — cámara que SIGUE a los personajes sin recortarlos (regla del usuario 28-11-2026: cámara siempre viva + nunca recortar a nadie).
// Matemática pura (sin three.js): devuelve {pos:[x,y,z], look:[x,y,z], fov}. En el navegador: window.FC; en node: require('./followcam.js').
//
// Un SUJETO es {x,y,z,h,w}: pies en (x,y,z), altura h (m, cabeza a pies), semiancho w (m; ≈ .30·h de pie, ≈ .52·h señalando con el brazo estirado).
//   NOTA: el dibujo .99 mide ≈ 1,12·h (la cabeza sobresale) → FC.TOP = 1.12 ya está incluido en los cálculos.
//
//   FC.frame(subs, o)        encuadre mínimo que contiene a TODOS los sujetos:  {yaw, fov, asp, occ, margin, aim, elev, minD, maxD}
//   FC.follow(fn, t, o)      igual, pero fn(t) → sujetos que se MUEVEN; filtra el centro (suave) y mira al futuro (`ahead`) para que nadie salga del plano
//   FC.shot(fn, t, T, a, b)  plano de duración T que va de la configuración a → b (yaw, occ, aim, elev, fov, side…) con ease; siempre en movimiento
//   FC.audit(camFn, subsFn, T)  comprueba un plano (cada 0,1 s): devuelve las infracciones (recortes, cámara quieta)
//
// Opciones por defecto: yaw 0 (mira hacia −z; el eje derecho es +x), fov 40° vertical, asp 1080/1920, occ .55 (los sujetos ocupan el 55 % del alto del plano),
// margin .88 (usa como mucho el 88 % del ancho), aim 0 (m: sube/baja el punto de mira), side 0 (m: desplazamiento lateral), elev 0 (m: altura de cámara sobre el punto de mira).
(function (root) {
  const TOP = 1.12, D2R = Math.PI / 180;
  const lerp = (a, b, k) => a + (b - a) * k, clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const eIO = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const eMix = k => .5 * k + .5 * (.5 - Math.cos(Math.PI * k) / 2);   // casi lineal con extremos suaves: nunca «parado» al empezar ni al acabar
  const DEF = { yaw: 0, fov: 40, asp: 1080 / 1920, occ: .55, margin: .88, aim: 0, side: 0, elev: 0, minD: 1.6, maxD: 18 };

  function frame(subs, o) {
    o = Object.assign({}, DEF, o || {});
    const s = subs.filter(Boolean); if (!s.length) throw new Error('followcam: sin sujetos');
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9, ym = 1e9, yM = -1e9;
    s.forEach(q => { x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); z0 = Math.min(z0, q.z); z1 = Math.max(z1, q.z); ym = Math.min(ym, q.y); yM = Math.max(yM, q.y + q.h * TOP); });
    const f = [Math.sin(o.yaw * D2R), 0, -Math.cos(o.yaw * D2R)], r = [Math.cos(o.yaw * D2R), 0, Math.sin(o.yaw * D2R)];
    // centro en el plano del suelo: mitad del rectángulo de los sujetos (con la anchura de cada uno ya en el cálculo de la distancia)
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, H = yM - ym, cy = ym + H / 2 + o.aim;
    const tn = Math.tan(o.fov * D2R / 2);
    let d = o.minD;
    s.forEach(q => {
      const dx = (q.x - cx) * r[0] + (q.z - cz) * r[2], dz = (q.x - cx) * f[0] + (q.z - cz) * f[2];     // dz>0: más lejos de la cámara que el centro
      // ancho: |dx|+w ≤ margin·(d+dz)·tn·asp   (+ el desplazamiento lateral de la cámara)
      d = Math.max(d, (Math.abs(dx - o.side) + q.w) / (o.margin * tn * o.asp) - dz);
      // alto: el sujeto (pies a cabeza·1,12) cabe, pies y cabeza dentro con ocupación occ
      const hq = q.h * TOP, top = q.y + hq - cy, bot = cy - q.y;                                      // distancias del punto de mira a la cabeza y a los pies
      d = Math.max(d, Math.max(top, bot) / (o.margin * tn) - dz);
    });
    d = Math.max(d, H / (2 * tn * o.occ) - 0);                    // ocupación: el grupo ocupa `occ` del alto
    d = clamp(d, o.minD, o.maxD);
    const C = [cx + r[0] * o.side, cy, cz + r[2] * o.side];
    return { pos: [C[0] - f[0] * d, C[1] + o.elev, C[2] - f[2] * d], look: C, fov: o.fov, d };
  }

  // sujetos en movimiento: fn(t) → [sujetos]; mira `back` s atrás y `ahead` s adelante y encuadra la UNIÓN (así nadie sale del plano al arrancar a andar)
  function follow(fn, t, o) {
    o = Object.assign({ back: .35, ahead: .7, n: 7 }, o || {});
    let all = [];
    for (let i = 0; i < o.n; i++) { const tt = Math.max(0, t - o.back + (o.back + o.ahead) * i / (o.n - 1)); all = all.concat(fn(tt)); }
    // la unión de posiciones pasadas/futuras: cada sujeto repetido en cada instante → la caja crece con el recorrido (sin saltos: máx./mín. son continuos)
    return frame(all, o);
  }

  // un plano de duración T, de la configuración a a la b (cualquier opción numérica), con ease → la cámara se mueve SIEMPRE
  function shot(fn, t, T, a, b, o) {
    const k = eMix(clamp(t / Math.max(.001, T))), c = Object.assign({}, o || {}), ks = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
    ks.forEach(key => { const va = (a || {})[key] ?? DEF[key], vb = (b || {})[key] ?? va; c[key] = lerp(va, vb, k); });
    return follow(fn, t, c);
  }

  // proyección simple de comprobación (pinhole): devuelve [x,y] en [-1,1] (y arriba) y la profundidad
  function project(cam, p, asp) {
    const f = norm(sub(cam.look, cam.pos)), rr = norm(cross(f, [0, 1, 0])), u = cross(rr, f), v = sub(p, cam.pos), z = dot(v, f), tn = Math.tan(cam.fov * D2R / 2);
    return [dot(v, rr) / (z * tn * (asp || DEF.asp)), dot(v, u) / (z * tn), z];
  }
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  // comprobación sin render: camFn(t) → cam, subsFn(t) → sujetos. Infracciones: pies/cabeza/lados fuera, o cámara quieta ≥ 1,5 s
  function audit(camFn, subsFn, T, o) {
    o = Object.assign({ asp: DEF.asp, edge: .97, still: .3 }, o || {}); const bad = [], cams = [];
    for (let t = 0; t <= T; t += .1) {
      const cam = camFn(t); cams.push(cam);
      subsFn(t).forEach((q, i) => [[q.x, q.y, q.z], [q.x, q.y + q.h * TOP, q.z], [q.x - q.w, q.y + q.h * .5, q.z], [q.x + q.w, q.y + q.h * .5, q.z]].forEach((p, j) => {
        const [x, y, z] = project(cam, p, o.asp); if (z < .3 || Math.abs(x) > o.edge || Math.abs(y) > o.edge) bad.push({ t: +t.toFixed(1), sujeto: i, parte: ['pies', 'cabeza', 'izq', 'der'][j] });
      }));
    }
    for (let i = 0; i + 15 < cams.length; i++) { const a = cams[i], b = cams[i + 15]; if (Math.max(Math.hypot(...sub(a.pos, b.pos)), Math.hypot(...sub(a.look, b.look))) < o.still && Math.abs(a.fov - b.fov) < 2.5) bad.push({ t: +(i * .1).toFixed(1), quieta: '≥1,5 s' }); }
    return bad;
  }

  const FC = { frame, follow, shot, audit, project, DEF, TOP };
  if (typeof module !== 'undefined' && module.exports) module.exports = FC; else root.FC = FC;
})(typeof window !== 'undefined' ? window : globalThis);

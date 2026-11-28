// life.js — «vida» para los personajes .99 (pjt.js): parpadeo, mirada, cabeza, respiración, inclinación, gestos de brazos al hablar,
// balanceo de brazos al andar y sincronía labial con las palabras de la voz. Todo es función pura del tiempo T (sirve para render aleatorio por fotograma).
//
//   const L = LIFE.of(T, seed, { talk:[[s,e],…] | words:[[s,e],…], walk:{ph,amp}, look:[dx,dy] | null, mood:'feliz'|'serio'|…, gest:1 });
//   pj('guapo2d', F, face, h, { o: { ...modelo, ...L.o }, walk: L.walk });      // L.o = {blink, look, head, breath, lean, armA, talk}
//
//   LIFE.words(B, sc, li)  → [[s,e],…] de las palabras de la línea li de la escena (de los tiempos de voz BEATS) para el labial.
//   seed distinto por personaje (0,1,2…): así nadie parpadea ni gesticula a la vez.
// Unidades de armA/head: px del fotograma 1170×2080 del personaje (la mano se mueve d, el codo ≈ .6·d). head=[dx,dy,rotación en grados].
(function (root) {
  const hs = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const sm = k => k * k * (3 - 2 * k), clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));

  // parpadeo: cada 2,6–5,2 s, dura .16 s (1 = ojos cerrados). Devuelve 0/1 para o.blink
  function blink(T, seed) { const per = 2.6 + hs(seed, 1) * 2.6, ph = (T + hs(seed, 2) * per) % per; return ph < .16 ? 1 : 0; }
  // mirada: salta (con ease corto) a un punto nuevo cada 1,3–2,8 s; target = [dx,dy] la fija (mirar al otro personaje, a un objeto)
  function look(T, seed, target, amp = 1) {
    if (target) return target;
    const per = 1.3 + hs(seed, 3) * 1.5, n = Math.floor(T / per + hs(seed, 4)), f = (T / per + hs(seed, 4)) - n;
    const g = i => [(hs(i + seed * 7, 5) - .5) * 1.4 * amp, (hs(i + seed * 7, 6) - .5) * .8 * amp], a = g(n - 1), b = g(n), k = sm(clamp(f / .12));
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  }
  // boca: abierta mientras suena cada palabra (sílabas ≈ .17 s); words = [[inicio,fin],…] en segundos de la escena
  function mouth(T, words) {
    if (!words) return 0;
    for (const [s, e] of words) if (T >= s - .02 && T <= e + .05) { const d = Math.max(.12, e - s), syl = Math.max(1, Math.round(d / .17)); return .25 + .75 * Math.abs(Math.sin(Math.PI * clamp((T - s) / d) * syl)); }
    return 0;
  }
  // gestos al hablar: la mano derecha (y a veces la izquierda) sube y baja a golpes, cada ~1,1 s, con fuerza g (0 = quieto)
  function gestures(T, seed, talking, g = 1) {
    if (!talking || !g) return { L: [0, 0], R: [0, 0] };
    const per = 1.1 + hs(seed, 8) * .6, n = Math.floor(T / per), f = T / per - n, hit = Math.sin(Math.PI * clamp(f * 1.6)) * (hs(n + seed * 5, 9) > .25 ? 1 : .3);
    const side = hs(n + seed, 10) > .6;                                             // a veces gesticulan las dos manos
    return { R: [-30 * g * hit, -170 * g * hit], L: side ? [30 * g * hit, -120 * g * hit] : [0, -14 * g * Math.sin(T * 2.1 + seed)] };
  }
  // brazos al andar: el contrario a cada pierna (usa la fase de la marcha: ph)
  function swing(walk, g = 1) { if (!walk) return null; const s = Math.sin(walk.ph) * (walk.amp ?? 1) * g; return { L: [-24 * s, -36 * Math.max(0, s)], R: [24 * s, -36 * Math.max(0, -s)] }; }

  function of(T, seed = 0, op = {}) {
    const words = op.words || null, talk = op.talk ? op.talk : null;
    const talkOpen = op.words ? mouth(T, op.words) : talk ? (talk.some(([s, e]) => T > s && T < e) ? .35 + .65 * Math.abs(Math.sin(T * 17)) : 0) : 0;
    const talking = !!(op.words ? op.words.some(([s, e]) => T > s - .3 && T < e + .3) : talkOpen > 0);
    const walk = op.walk || null, ph = walk ? walk.ph : 0, wa = walk ? (walk.amp ?? 1) : 0;
    // cabeza: oscilación lenta + cabeceo al hablar + giro corto hacia donde mira
    const lk = look(T, seed, op.look, op.lookAmp ?? 1);
    const hx = lk[0] * 10 + Math.sin(T * .8 + seed) * 4, hy = Math.sin(T * 1.3 + seed * 2) * 5 + (talking ? Math.sin(T * 5.3 + seed) * 4 : 0) - wa * 6 * Math.abs(Math.sin(ph));
    const rot = Math.sin(T * .9 + seed * 3) * 1.8 + lk[0] * 2.2 + (talking ? Math.sin(T * 4.1 + seed) * 1.4 : 0) + wa * 1.2 * Math.sin(ph);
    const gst = gestures(T, seed, talking && !walk, op.gest ?? 1), sw = swing(walk, op.swing ?? 1);
    const armA = sw || gst;
    const o = { blink: blink(T, seed), look: lk, head: [hx, hy, rot], breath: Math.sin(T * 1.7 + seed * 2) * .012, lean: Math.sin(T * .6 + seed) * 1.1 + (talking ? Math.sin(T * 2.3 + seed) * .8 : 0), armA };
    if (talkOpen > 0) o.talk = talkOpen;
    return { o, walk, talking };
  }

  // palabras [[s,e],…] de la línea li de una escena a partir de BEATS/B: B[li] = {s, w:[tiempos de cada palabra], e?}. El fin de cada palabra = inicio de la siguiente − 0,03 (última: +0,35 s)
  function words(B, li, extra = .35) { const b = B[li]; if (!b || !b.w) return []; return b.w.map((s, i) => [s, (b.w[i + 1] ?? s + extra) - .03]); }

  const LIFE = { of, blink, look, mouth, gestures, swing, words };
  if (typeof module !== 'undefined' && module.exports) module.exports = LIFE; else root.LIFE = LIFE;
})(typeof window !== 'undefined' ? window : globalThis);

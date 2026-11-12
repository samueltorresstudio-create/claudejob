// bocetos del 68 (estadio de 1889 + personajes)
const W = W2, CAST = {}; (window.CAST68 || []).forEach(c => CAST[c.name] = c);
const DAY = { tint: '#ffe2bd', k: .14, rim: '#fff6e6', rimA: .5, rimX: -1, rimY: -.6 }; W.charLight = DAY;
const who = (name, o, F, h = 1.84) => stickAt(Object.assign({}, CAST[name], o), F, V3(F.x, F.y + h, F.z), W);
window.SC = {
  general: () => ({ cam: [V3(9, 5.5, -30), V3(0, 1.2, -50), 44], net: false, ball: [1.6, .11, -43.2], svg: () => who('ARBITRO', { look: [-6, 0], armR: [30, 40] }, V3(-5, 0, -41)) + who('RIVAL', { face: 'angry', armL: [40, 30], armR: [40, 30] }, V3(.4, 0, -51)) + who('DELANTERO', { face: 'smug', mouth: 'smirk', legR: [-30, 20], armL: [50, 20], armR: [20, 40], lean: -4 }, V3(2.2, 0, -42.6)) }),
  porteria: () => ({ cam: [V3(4.2, 1.5, -44.5), V3(-.4, 2.0, -57), 42], net: false, ball: [-.6, 1.7, -56.4], cheer: .7, svg: () => who('RIVAL', { face: 'angry', mouth: 'o', look: [-10, -6], armL: [150, 20], armR: [60, 40] }, V3(1.2, 0, -50.4)) }),
  red: () => ({ cam: [V3(3.4, 1.35, -46.4), V3(.4, 1.0, -53), 40], net: true, rest: [-.6], ball: [-.6, .2, -53.75], cheer: .3, svg: () => who('BRODIE', { face: 'smug', mouth: 'smile', look: [-10, 2], armL: [14, 18], armR: [118, 40] }, V3(4.4, 0, -51.4)) }),
  brodie: () => ({ cam: [V3(-34.2, 1.7, -14.8), V3(-37.6, 1.5, -17.6), 40], net: false, ball: null, svg: () => who('BRODIE', { face: 'smug', mouth: 'line', look: [8, -2], armL: [14, 22], armR: [14, 22] }, V3(-37.2, 0, -17.2)) }),
};
window.shot = function (name, o = {}) { const S = SC[name](); W.setTime(o.t ?? 3); W.setMood(0); W.setCheer(S.cheer ?? 0);
  W.NET.visible = !!S.net; if (S.net) W.setNet({ rest: S.rest }); W.ball(S.ball ? V3(...S.ball) : null, 1.2, !!S.ball);
  const [p, l, f] = S.cam; W.setCam(p, l, f, p.distanceTo(l), .0025); W.render(); document.getElementById('fx').innerHTML = S.svg ? S.svg() : ''; };
window.READY = W.crowd(window.CROWD_IMGS);

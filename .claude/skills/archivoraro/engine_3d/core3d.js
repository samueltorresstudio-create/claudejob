// Archivo Raro · núcleo del estilo 3D: línea de tiempo según la voz (voice.js de sync_voice.py), escenas S[sc](t, D, B),
// subtítulo de UNA palabra en el centro (como la referencia), golpe de corte entre escenas y corte final a negro.
// Each video defines EVS, S and optional CFG {capY, capSize, flash} in scenes_p.js.
const CFG = window.CFG || {};
function wordTimes(b) {
  if (b.words && b.words.length) return b.words.slice();
  const ws = b.cap.split(' ').map(w => w.split('|')[0]), wt = ws.map(w => w.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]/g, '').length + 1.5), tot = wt.reduce((a, c) => a + c, 0); let acc = 0;
  return ws.map((w, i) => { const s = b.lead + b.vdur * .97 * acc / tot; acc += wt[i]; return s; }); }
const BEATS = SCRIPT.map((l, i) => Object.assign({}, l, VOICE.beats[i]));
let _ss = 0; BEATS.forEach((b, i) => { if (i === 0 || BEATS[i - 1].sc !== b.sc) _ss = b.start; b.sStart = _ss; b.wt = wordTimes(b); });
BEATS.forEach(b => { const grp = BEATS.filter(x => x.sStart === b.sStart); b.sDur = grp.reduce((a, x) => a + x.d, 0); b.B = grp.map(x => ({ s: x.start - b.sStart, d: x.d, lead: x.lead, vdur: x.vdur, w: x.wt.map(w => w + x.start - b.sStart) })); });
const TOTAL = VOICE.total, CUT = TOTAL - VOICE.tail; window.TOTAL = TOTAL;
const evAbs = {}; BEATS.filter(b => b.start === b.sStart).forEach(b => { const E = (EVS[b.sc] || (() => ({})))(b.B); for (const k in E) { const v = E[k]; evAbs[b.sc + '.' + k] = Array.isArray(v) ? v.map(x => x + b.sStart) : v + b.sStart; } });
window.EVENTS = { total: TOTAL, cut: CUT, ev: evAbs, beats: BEATS.map(b => ({ start: b.start, d: b.d, sc: b.sc, cut: b.start === b.sStart, words: b.wt.map(w => w + b.start), lead: b.lead, vdur: b.vdur })) };
// all caption words (absolute time, text, colour)
const WORDS = []; BEATS.forEach(b => b.cap.split(' ').forEach((w, i) => { const [tx, c] = w.split('|'); WORDS.push([b.start + b.wt[i], tx.replace(/[.,…:;]+$/g, ''), c || '']); }));
const ACC = { y: YEL, p: PINK, b: BLUE, g: GREEN };
const fxEl = document.getElementById('fx'), capEl = document.getElementById('cap'), glEl = document.getElementById('gl');
window.render = function (T) {
  window.__T = T;
  if (T >= CUT) { glEl.style.visibility = 'hidden'; fxEl.innerHTML = ''; capEl.innerHTML = ''; return; }
  glEl.style.visibility = 'visible';
  let bi = BEATS.findIndex(b => T >= b.start && T < b.start + b.d); if (bi < 0) bi = BEATS.length - 1;
  const b = BEATS[bi], st = T - b.sStart;
  let svg = S[b.sc](st, b.sDur, b.B) || '';
  const cutK = b.start === b.sStart && bi > 0 ? st : 9;                                    // a quick white pop on every cut
  if (cutK < .1 && CFG.flash !== false) svg += `<rect width="1080" height="1920" fill="#fff" opacity="${(.18 * (1 - cutK / .1)).toFixed(3)}"/>`;
  svg += `<defs><radialGradient id="vg3" cx=".5" cy=".45" r=".8"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#vg3)"/>`;
  fxEl.innerHTML = svg;
  // caption: one word, centre of the screen, pops in, stays until the next word
  let w = null, wn = null; for (let i = 0; i < WORDS.length; i++) if (T >= WORDS[i][0] - .02) { w = WORDS[i]; wn = WORDS[i + 1]; }
  let c = ''; if (w && (!wn || T < wn[0]) && T < w[0] + 1.4) { const k = clamp((T - w[0]) / .12), sc = 1.22 - .22 * eOut(k), col = ACC[w[2]] || '#ffffff', fs = CFG.capSize || 100;
    c = `<g transform="translate(540,${CFG.capY || 880}) scale(${sc.toFixed(3)})"><text x="0" y="0" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${fs}" letter-spacing="-2" fill="${col}" stroke="#14121c" stroke-width="${fs * .17}" stroke-linejoin="round" paint-order="stroke" style="filter:drop-shadow(0 8px 0 rgba(0,0,0,.35))">${w[1]}</text></g>`; }
  capEl.innerHTML = c;
};
window.render(0);

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
// ---------- camera transitions between shots (reference style: the camera flies / whips / pushes into the next shot, with motion blur) ----------
// CFG.blurK (multiplica el desenfoque de las transiciones; <1 = más suave), CFG.antic (s de anticipación antes del cambio).
// CFG.trans: { sceneName: 'fly' | 'whip' | 'push' | 'pull' | 'swish' | 'cut' } ('swish' = barrido sin mover la cámara de sitio: úsalo entre zonas distintas del mundo, así la cámara no atraviesa paredes) (transition INTO that scene); default CFG.transDefault ('fly'). CFG.transDur (s, default .55).
// How: probe the previous scene's last camera and the new scene's camera (no rendering), then override W2.setCam while the new scene draws,
// so its 2D characters are projected with the moving camera and stay glued to the 3D world.
const TR = (() => { if (typeof W2 === 'undefined' || !W2.setCam) return null; const orig = W2.setCam.bind(W2), origR = W2.render.bind(W2), V = THREE.Vector3;
  const st = { probe: false, last: null, ov: null };
  W2.setCam = (p, l, f = 45, fo = null, ap = .003) => { if (st.probe) { st.last = { p: p.clone(), l: l.clone(), f, fo, ap }; return; } if (st.ov) { const o = st.ov(p, l, f); return orig(o.p, o.l, o.f, o.fo ?? fo, ap * (o.apK ?? 1)); } return orig(p, l, f, fo, ap); };
  W2.render = () => { if (!st.probe) origR(); };
  function probe(sc, t, D, B) { st.probe = true; st.last = null; try { S[sc](t, D, B); } catch (e) {} st.probe = false; return st.last; }
  // directional motion-blur filters applied to the whole stage
  const fsvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); fsvg.setAttribute('width', 0); fsvg.setAttribute('height', 0); fsvg.style.position = 'absolute';
  fsvg.innerHTML = '<defs><filter id="mbH" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur id="mbHs" stdDeviation="0 0"/></filter><filter id="mbV" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur id="mbVs" stdDeviation="0 0"/></filter></defs>';
  document.body.appendChild(fsvg); const stage = document.getElementById('stage') || glEl.parentElement;
  function blur(kind, amt) { if (amt < .4) { stage.style.filter = ''; return; } if (kind === 'H') { document.getElementById('mbHs').setAttribute('stdDeviation', `${amt.toFixed(1)} ${(amt * .15).toFixed(1)}`); stage.style.filter = 'url(#mbH)'; }
    else if (kind === 'R') stage.style.filter = `blur(${(amt * .45).toFixed(1)}px)`; else { document.getElementById('mbVs').setAttribute('stdDeviation', `${(amt * .15).toFixed(1)} ${amt.toFixed(1)}`); stage.style.filter = 'url(#mbV)'; } }
  return { st, probe, blur, V }; })();
const sm = x => x * x * (3 - 2 * x), sm5 = x => x * x * x * (x * (x * 6 - 15) + 10);
window.render = function (T) {
  window.__T = T;
  if (T >= CUT) { glEl.style.visibility = 'hidden'; fxEl.innerHTML = ''; capEl.innerHTML = ''; return; }
  glEl.style.visibility = 'visible';
  let bi = BEATS.findIndex(b => T >= b.start && T < b.start + b.d); if (bi < 0) bi = BEATS.length - 1;
  const b = BEATS[bi], st = T - b.sStart;
  // transition into this scene?
  const si = BEATS.findIndex(x => x.sStart === b.sStart), prev = si > 0 ? BEATS[si - 1] : null, kind = (CFG.trans || {})[b.sc] || CFG.transDefault || 'fly', TD = CFG.transDur || .55;
  let svg = '', inTr = false;
  if (TR) TR.blur('H', 0);
  if (TR && prev && kind !== 'cut' && st < TD) {
    const a = TR.probe(prev.sc, prev.sDur - .001, prev.sDur, prev.B), z = TR.probe(b.sc, st, b.sDur, b.B);
    if (a && z) { inTr = true; const k = st / TD, e = sm5(k), V = TR.V, bump = Math.sin(Math.PI * k);
      TR.st.ov = () => { let p = a.p.clone().lerp(z.p, e), l = a.l.clone().lerp(z.l, e), f = a.f + (z.f - a.f) * e;
        if (kind === 'fly' || kind === 'pull') { const back = p.clone().sub(l).normalize(), D = a.p.distanceTo(z.p) + 6; p.addScaledVector(back, bump * D * (kind === 'pull' ? .9 : .45)); p.y += bump * D * .35; f += bump * 10; }
        if (kind === 'push') { const fw = l.clone().sub(p).normalize(); p.addScaledVector(fw, bump * 5); f -= bump * 14; }
        if (kind === 'swish') { const P0 = k < .5 ? a : z, fw = P0.l.clone().sub(P0.p), yaw = (k < .5 ? 1 : -1) * bump * 1.1, c = Math.cos(yaw), s2 = Math.sin(yaw); p = P0.p.clone(); f = P0.f; l = p.clone().add(new V(fw.x * c - fw.z * s2, fw.y, fw.x * s2 + fw.z * c)); }
        if (kind === 'whip') { const fw = l.clone().sub(p), yaw = bump * .75, c = Math.cos(yaw), s2 = Math.sin(yaw); l = p.clone().add(new V(fw.x * c - fw.z * s2, fw.y, fw.x * s2 + fw.z * c)); }
        return { p, l, f, apK: 1 - bump * .8 }; };
      // first half: the previous shot keeps its characters while the camera leaves; second half: the new shot (switch hidden at peak blur)
      svg = (k < .5 ? S[prev.sc](prev.sDur - .001, prev.sDur, prev.B) : S[b.sc](st, b.sDur, b.B)) || ''; TR.st.ov = null;
      const amt = bump * (kind === 'whip' || kind === 'swish' ? 30 : kind === 'push' ? 14 : 18) * (CFG.blurK ?? 1); TR.blur(kind === 'whip' || kind === 'swish' ? 'H' : kind === 'push' ? 'R' : 'V', amt);
      if (kind === 'push' && k < .5) svg += `<rect width="1080" height="1920" fill="#fff" opacity="${(.25 * Math.sin(Math.PI * k * 2)).toFixed(3)}"/>`; } }
  if (!inTr) svg = S[b.sc](st, b.sDur, b.B) || '';
  // the previous scene accelerates into the transition: last .18 s gets a little push + blur (anticipation)
  const nb = BEATS.slice(bi).find(x => x.sStart !== b.sStart), nk = nb ? ((CFG.trans || {})[nb.sc] || CFG.transDefault || 'fly') : 'cut';
  if (TR && nb && nk !== 'cut') { const left = nb.start - T, AN = CFG.antic ?? .18; if (left < AN) TR.blur(nk === 'whip' || nk === 'swish' ? 'H' : nk === 'push' ? 'R' : 'V', (1 - left / AN) * 6 * (CFG.blurK ?? 1)); }
  const cutK = b.start === b.sStart && bi > 0 ? st : 9;                                    // hard cuts keep a quick white pop
  if (cutK < .1 && CFG.flash !== false && (!TR || kind === 'cut')) svg += `<rect width="1080" height="1920" fill="#fff" opacity="${(.18 * (1 - cutK / .1)).toFixed(3)}"/>`;
  svg += `<defs><radialGradient id="vg3" cx=".5" cy=".45" r=".8"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#vg3)"/>`;
  fxEl.innerHTML = svg;
  // caption: one word, centre of the screen, pops in, stays until the next word
  let w = null, wn = null; for (let i = 0; i < WORDS.length; i++) if (T >= WORDS[i][0] - .02) { w = WORDS[i]; wn = WORDS[i + 1]; }
  let c = ''; if (w && (!wn || T < wn[0]) && T < w[0] + 1.4) { const k = clamp((T - w[0]) / .12), sc = 1.22 - .22 * eOut(k), col = ACC[w[2]] || '#ffffff', fs = CFG.capSize || 100;
    c = `<g transform="translate(540,${CFG.capY || 880}) scale(${sc.toFixed(3)})"><text x="0" y="0" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${fs}" letter-spacing="-2" fill="${col}" stroke="#14121c" stroke-width="${fs * .17}" stroke-linejoin="round" paint-order="stroke" style="filter:drop-shadow(0 8px 0 rgba(0,0,0,.35))">${w[1]}</text></g>`; }
  capEl.innerHTML = c;
};
window.render(0);

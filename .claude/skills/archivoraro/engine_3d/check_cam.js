// Auditoría del encuadre y la cámara SIN renderizar: node check.js [salida.json]
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path'), fs = require('fs');
(async () => { const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await pg.goto('file://' + path.join(__dirname, 'index.html'), { timeout: 600000 });
  await pg.evaluate(async () => { await document.fonts.ready; await window.READY; });
  const res = await pg.evaluate(() => { const out = {}, W = W2; W.render = () => {}; const cams = []; const sc0 = W.setCam; W.setCam = (p, l, f, fo, ap) => { cams.push([p.x, p.y, p.z, l.x, l.y, l.z, f]); return sc0(p, l, f, fo, ap); };
    for (const [sc, I] of Object.entries(window.__SCENES)) { const rows = []; for (let tt = 0.05; tt < I.sDur - .02; tt += .1) { window.__PJ = []; cams.length = 0; window.__T = I.sStart + tt; try { S[sc](tt, I.sDur, I.B); } catch (e) { rows.push({ t: tt, err: String(e) }); continue; } rows.push({ t: +tt.toFixed(2), cam: cams[cams.length - 1], pj: window.__PJ.slice() }); } out[sc] = { start: I.sStart, dur: I.sDur, rows }; }
    return out; });
  fs.writeFileSync(process.argv[2] || 'check.json', JSON.stringify(res)); console.log('ok', Object.keys(res).length, 'escenas'); await br.close(); })();

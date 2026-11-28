// node shot.js out.png '{json}' [out2.png '{json}' ...]
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path');
(async () => { const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.error('PAGE ERROR', e.message)); pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error('CONSOLE', m.text().slice(0, 1500)); });
  const t0 = Date.now(); await pg.goto('file://' + path.join(__dirname, process.env.PAGE || 'test79.html')); await pg.evaluate(async () => { await document.fonts.ready; await window.READY; }); console.error('load', Date.now() - t0, 'ms');
  for (let i = 2; i < process.argv.length; i += 2) { const out = process.argv[i], o = Function('return (' + process.argv[i + 1] + ')')(); const t1 = Date.now(); await pg.evaluate(o => window.shot(o.name, o), o); await pg.evaluate(o => window.shot(o.name, o), o); await pg.screenshot({ path: path.join(__dirname, out) }); console.error(out, Date.now() - t1, 'ms'); }
  await br.close(); })();

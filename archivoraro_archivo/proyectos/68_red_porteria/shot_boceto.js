let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path');
(async () => { const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.error('PAGE ERROR', e.message)); pg.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await pg.goto('file://' + path.join(__dirname, 'boceto.html')); await pg.evaluate(async () => { await document.fonts.ready; await window.READY; });
  for (let i = 2; i < process.argv.length; i += 2) { const out = process.argv[i], o = JSON.parse(process.argv[i + 1]); await pg.evaluate(o => window.shot(o.name, o), o); await pg.waitForTimeout(300); await pg.evaluate(o => window.shot(o.name, o), o); await pg.screenshot({ path: path.join(__dirname, out) }); }
  await br.close(); })();

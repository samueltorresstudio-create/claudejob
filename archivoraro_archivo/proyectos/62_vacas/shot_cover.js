// node shot_cover.js out.png '{"cx":-1.5,...}'  → renderiza la portada (cover.html + cover62.js)
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path');
(async () => { const out = process.argv[2], o = JSON.parse(process.argv[3] || '{}');
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await pg.goto('file://' + path.join(__dirname, 'cover.html'));
  await pg.evaluate(async () => { await document.fonts.load('900 100px Inter'); await document.fonts.ready; });
  await pg.evaluate(o => window.renderCover(o), o);
  await pg.screenshot({ path: out }); await br.close(); })();

let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1170, height: 2080 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(__dirname, 'pj78.html')); await p.evaluate(async () => { await document.fonts.ready; }); await p.waitForTimeout(300);
  for (const [w, f] of JSON.parse(process.argv[2])) { await p.evaluate(([w, f]) => window.shot(w, f), [w, f]); await p.waitForTimeout(120); await p.screenshot({ path: path.join(__dirname, `pj_${w}_${f}.png`) }); }
  await b.close(); console.log('ok'); })();

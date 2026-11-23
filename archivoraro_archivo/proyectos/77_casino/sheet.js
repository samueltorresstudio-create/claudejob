// node sheet.js out.png spec.json
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path'), fs = require('fs');
(async () => { const spec = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')); const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: spec.w, height: spec.h } });
  pg.on('pageerror', e => console.error('PAGE ERROR', e.message)); await pg.goto('file://' + path.join(__dirname, 'sheet77.html'));
  await pg.evaluate(s => window.sheet(s), spec); await pg.screenshot({ path: process.argv[2] }); await br.close(); })();

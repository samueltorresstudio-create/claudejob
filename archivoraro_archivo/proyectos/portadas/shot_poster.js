// node shot_poster.js <project>/poster.html <out.png> [x=silbon.js,otro.js]  → screenshot of a dedicated poster cover
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path');
(async () => {
  const [html, out, x] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve(html) + (x ? '?' + x : ''));
  await p.waitForFunction(() => document.title === 'done', null, { timeout: 20000 });
  await p.evaluate(async () => { await document.fonts.ready });
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.resolve(out) });
  await b.close();
  console.log('ok', out);
})();

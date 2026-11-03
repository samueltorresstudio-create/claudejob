let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const v of process.argv.slice(2)) {
    await p.goto('file://' + __dirname + '/cover.html?v=' + v);
    await p.waitForTimeout(400);
    await p.screenshot({ path: __dirname + '/portada_' + v + '.png' });
  }
  await b.close();
})();

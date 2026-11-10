const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  for (const n of [1, 2, 3, 4, 5]) {
    await p.goto('file://' + __dirname + '/index.html?p=' + n);
    await p.evaluate(async () => { await document.fonts.load('900 60px Inter'); await document.fonts.load('700 24px "JetBrains Mono"'); await document.fonts.ready; });
    await p.waitForTimeout(200);
    await p.screenshot({ path: __dirname + '/catalogo_' + n + '.png' });
  }
  await b.close();
})();

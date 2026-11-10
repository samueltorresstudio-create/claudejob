const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 800, height: 800 } });
  for (const v of ['navy', 'yellow']) {
    await p.goto('file://' + __dirname + '/pfp.html?v=' + v);
    await p.waitForTimeout(400);
    await p.screenshot({ path: __dirname + '/perfil_' + v + '.png' });
  }
  await b.close();
})();

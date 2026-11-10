const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 800, height: 800 } });
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  for (const q of process.argv.slice(2)) {
    await p.goto('file://' + __dirname + '/ideas2.html?' + q);
    await p.waitForTimeout(300);
    await p.screenshot({ path: __dirname + '/idea_' + q.replace(/[^a-z0-9]+/gi, '_') + '.png' });
  }
  await b.close();
})();

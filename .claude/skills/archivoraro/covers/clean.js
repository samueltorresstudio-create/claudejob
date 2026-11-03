// renders a frame of a project without HUD, steps list or captions: node clean.js <projdir> <t> <out>
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
(async () => {
  const [dir, t, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + dir + '/index.html');
  await p.evaluate(async () => { await document.fonts.ready; });
  await p.evaluate(t => window.render(t), +t);
  await p.evaluate(() => { document.getElementById('hud').style.display = 'none'; document.getElementById('cap').style.display = 'none'; });
  await p.waitForTimeout(150);
  await p.screenshot({ path: out });
  await b.close();
})();

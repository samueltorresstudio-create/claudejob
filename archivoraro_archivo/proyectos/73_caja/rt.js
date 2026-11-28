// node rt.js name1 'json' name2 'json' … → rv/<name>.png usando test73.html (shot 'gancho' por defecto, o.scene)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.error('PAGE ERROR', e.message)); p.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text().slice(0, 300)); });
  await p.goto('file://' + path.resolve(process.env.PAGE || 'test73.html'), { timeout: 600000 }); await p.evaluate(async () => { await document.fonts.ready; });
  for (let i = 2; i < process.argv.length; i += 2) { const n = process.argv[i], o = Function('return (' + process.argv[i + 1] + ')')(); await p.evaluate(o => window.shot(o.scene || 'gancho', o), o); await p.evaluate(o => window.shot(o.scene || 'gancho', o), o); await p.screenshot({ path: 'rv/' + n + '.png' }); console.log(n); }
  await b.close(); })();

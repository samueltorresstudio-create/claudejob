const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'test.html')); await p.waitForFunction(() => document.title === 'ready', null, { timeout: 120000 });
  for (const [mode, ao, dof, bloom] of [['todo', 1, 1, 1], ['sin AO', 0, 1, 1], ['sin AO ni desenfoque', 0, 0, 1], ['solo 3D', 0, 0, 0]]) {
    await p.evaluate(([a, d, bl]) => { W2.ao.enabled = !!a; W2.dof.enabled = !!d; W2.bloom.enabled = !!bl; }, [ao, dof, bloom]);
    let tot = 0; for (const t of [0.5, 2.2, 3.5, 4.8]) { const t0 = Date.now(); await p.evaluate(t => window.render(t), t); await p.screenshot({ path: '/tmp/claude-0/-home-user-claudejob/e8526e9b-1df1-5b1c-ac97-c565bf3b54df/scratchpad/tt.png' }); tot += Date.now() - t0; }
    console.log(mode, Math.round(tot / 4), 'ms/frame'); }
  await b.close(); })();

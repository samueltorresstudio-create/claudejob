// usage: node render.js preview t1,t2,...   |   node render.js full [workers]
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const fs = require('fs'), path = require('path');
const dir = __dirname, FPS = 30;
const mode = process.argv[2] || 'preview';

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto('file://' + path.join(dir, 'index.html'));
  await page.evaluate(async () => {
    await document.fonts.load('900 100px Inter');
    await document.fonts.load('700 30px "JetBrains Mono"');
    await document.fonts.load('800 30px "JetBrains Mono"');
    await document.fonts.ready;
  });
  return page;
}

(async () => {
  const browser = await chromium.launch();
  if (mode === 'preview') {
    const times = (process.argv[3] || '1').split(',').map(Number);
    const page = await openPage(browser);
    fs.mkdirSync(path.join(dir, 'preview'), { recursive: true });
    for (const t of times) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ timeout: 300000, path: path.join(dir, 'preview', `p_${t.toFixed(2)}.png`) });
    }
    fs.writeFileSync(path.join(dir, 'events.json'), JSON.stringify(await page.evaluate(() => window.EVENTS), null, 1));
  } else {
    const W = +(process.argv[3] || 4);
    const out = path.join(dir, 'frames'); fs.mkdirSync(out, { recursive: true });
    const pages = await Promise.all(Array.from({ length: W }, () => openPage(browser)));
    const total = await pages[0].evaluate(() => window.TOTAL);
    fs.writeFileSync(path.join(dir, 'events.json'), JSON.stringify(await pages[0].evaluate(() => window.EVENTS), null, 1));
    const N = Math.round(total * FPS);
    let next = +(process.env.R0 || 0), done = 0; const R1 = Math.min(N, +(process.env.R1 || 1e9)); // optional frame range for re-renders
    await Promise.all(pages.map(async page => {
      while (true) {
        const i = next++; if (i >= R1) break;
        await page.evaluate(t => window.render(t), i / FPS);
        await page.screenshot({ timeout: 300000, path: path.join(out, `f${String(i).padStart(5, '0')}.png`) });
        if (++done % 100 === 0) console.log(`${done}/${N}`);
      }
    }));
    console.log('frames', N);
  }
  await browser.close();
})();

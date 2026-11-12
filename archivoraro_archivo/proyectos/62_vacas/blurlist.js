// lista los fotogramas con desenfoque de transición y subtítulo visible
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const path = require('path'), fs = require('fs');
(async () => { const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.goto('file://' + path.join(__dirname, 'index.html'));
  const r = await pg.evaluate(() => { const out = [], N = Math.round(TOTAL * 30); let cap = 0;
    for (let i = 0; i < N; i++) { const T = i / 30; if (T >= CUT) break;
      let bi = BEATS.findIndex(b => T >= b.start && T < b.start + b.d); if (bi < 0) bi = BEATS.length - 1;
      const b = BEATS[bi], st = T - b.sStart, si = BEATS.findIndex(x => x.sStart === b.sStart), prev = si > 0 ? BEATS[si - 1] : null,
        kind = (CFG.trans || {})[b.sc] || CFG.transDefault || 'fly', TD = CFG.transDur || .55, K = CFG.blurK ?? 1; let amt = 0;
      if (prev && kind !== 'cut' && st < TD) amt = Math.sin(Math.PI * st / TD) * (kind === 'whip' || kind === 'swish' ? 30 : kind === 'push' ? 14 : 18) * K;
      const nb = BEATS.slice(bi).find(x => x.sStart !== b.sStart), nk = nb ? ((CFG.trans || {})[nb.sc] || CFG.transDefault || 'fly') : 'cut';
      if (nb && nk !== 'cut') { const left = nb.start - T, AN = CFG.antic ?? .18; if (left < AN) amt = Math.max(amt, (1 - left / AN) * 6 * K); }
      let w = null, wn = null; for (let j = 0; j < WORDS.length; j++) if (T >= WORDS[j][0] - .02) { w = WORDS[j]; wn = WORDS[j + 1]; }
      const c = w && (!wn || T < wn[0]) && T < w[0] + 1.4;
      if (amt >= .35 && c) out.push(i); }
    return { out, N }; });
  fs.writeFileSync(path.join(__dirname, 'blur_frames.json'), JSON.stringify(r.out)); console.log('N', r.N, 'blur+cap', r.out.length); await br.close(); })();

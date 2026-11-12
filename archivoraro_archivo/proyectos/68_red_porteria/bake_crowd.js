// Genera los sprites del público (estilo de los personajes, 1889): crowd/c_NN_0.png (quieto) y crowd/c_NN_1.png (celebrando)
let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
const fs = require('fs'), path = require('path');
const VB = [-260, -690, 520, 710];
(async () => { const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 520, height: 710 } });
  await pg.setContent(`<html><body style="margin:0;background:transparent"><div id="d"></div><script>${fs.readFileSync(path.join(__dirname, 'stick.js'), 'utf8')}\n${fs.readFileSync(path.join(__dirname, 'hair.js'), 'utf8')}</script></body></html>`);
  const tops = ['#3b3f4a', '#5a4632', '#2f3a52', '#6b5a44', '#4a4a44', '#7a2e2a', '#2e4a3a', '#55504a', '#3a2e2a', '#6a6458', '#2a2a30', '#5e3a52', '#44506a', '#6a3a2a', '#3e4a3a', '#5a5248'];
  const hats = ['flatcap', 'bowler', 'flatcap', null, 'flatcap', 'bowler', 'flatcap', 'flatcap', 'bowler', 'flatcap', 'flatcap', null, 'bowler', 'flatcap', 'flatcap', 'bowler'];
  const hatC = ['#6b6458', '#25222a', '#4a443c', null, '#7a6a52', '#3a2e24', '#55606a', '#3e3a36', '#25222a', '#8a7a62', '#5a5048', null, '#2a2a30', '#6a5a44', '#4a4a52', '#4a3424'];
  const hairs = ['#5a3a22', '#2a1a12', '#b05a2a', '#1b1418', '#8a847c', '#5a3a22', '#c87a3a', '#2a1a12', '#8a847c', '#5a3a22', '#b05a2a', '#2a1a12', '#1b1418', '#c87a3a', '#5a3a22', '#2a1a12'];
  const scarf = ['#c8302e', null, '#2f4f9f', null, '#c8302e', null, null, '#f2c94c', null, '#2f4f9f', null, '#c8302e', null, null, '#c8302e', null];
  const N = tops.length;
  for (let i = 0; i < N; i++) for (const ch of [0, 1]) {
    const o = { outfit: i % 3 === 0 ? 'suit' : 'shirt', top: tops[i], topD: tops[i], pants: '#2a2a30', shirt: '#e9e4d6', hat: hats[i] || undefined, hatCol: hatC[i] || undefined,
      hairCol: hairs[i], hair2: hats[i] ? undefined : ['side', 'capHair', 'side'][i % 3], mustache: i % 4 === 1 || i === 12, beard: i % 7 === 3 ? hairs[i] : undefined, glasses: i % 6 === 4,
      scarf: scarf[i] || undefined, vest: i % 5 === 2 ? '#4a3a2a' : undefined, tie: i % 3 === 0 ? '#7a2e2a' : undefined,
      face: ch ? 'happy' : ['smug', 'neutral', 'smug', 'neutral'][i % 4], mouth: ch ? 'laugh' : ['smirk', 'line', 'o', 'smile'][i % 4], look: [((i * 37) % 14) - 7, 0], brows: ch ? .7 : 0,
      armL: ch ? [112 + (i % 3) * 8, 48] : [14, 18], armR: ch ? [116 + (i % 2) * 8, 44] : [12, 20], headSeed: i + 1, headTilt: ((i * 13) % 9) - 4, hatTilt: ((i * 7) % 7) - 3, rich: true, eyeStyle: 'palo' };
    await pg.evaluate(([o, VB]) => { document.getElementById('d').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="710" viewBox="${VB.join(' ')}">${stick(o)}</svg>`; }, [o, VB]);
    await pg.locator('svg').screenshot({ path: path.join(__dirname, 'crowd', `c_${String(i).padStart(2, '0')}_${ch}.png`), omitBackground: true });
  }
  await br.close(); console.log('crowd sprites', N * 2); })();

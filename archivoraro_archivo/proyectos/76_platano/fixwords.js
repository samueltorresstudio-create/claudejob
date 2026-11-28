// Corrige la hora de algunas palabras del subtítulo (comprobadas con Whisper y con la energía del audio).
const fs = require('fs');
global.window = {}; require('./voice.js');
const S = window.SCRIPT, V = window.VOICE;
// [línea, palabra del subtítulo, nº de aparición dentro de la línea, segundo absoluto nuevo]
const FIX = [[1, 'EN', 0, 4.77], [1, 'MIAMI,', 0, 4.91], [1, 'EN', 1, 5.48], [2, 'BLANCA,', 0, 7.17], [6, 'MÁS.', 0, 20.25], [8, 'SALE', 0, 26.47],
  [13, 'CAMBIARLO.', 0, 46.01], [13, 'ES', 1, 47.43], [15, 'POR', 0, 54.0], [15, 'UNOS', 0, 54.14], [15, 'CÉNTIMOS.', 0, 54.3], [15, 'MÁS.', 0, 58.17]];
const changed = [];
for (const [li, w, occ, t] of FIX) {
  const words = S[li].cap.split(/\s+/).filter(x => x && !/^\|/.test(x)).map(x => x.replace(/\|.*/, ''));
  let n = -1, j = words.findIndex(x => x === w && ++n === occ);
  if (j < 0) throw new Error('no encuentro ' + w);
  const b = V.beats[li], old = b.start + b.words[j]; b.words[j] = +(t - b.start).toFixed(3); changed.push([old, t]);
  if (j > 0 && b.words[j] <= b.words[j - 1]) throw new Error('orden ' + w);
  if (j + 1 < b.words.length && b.words[j] >= b.words[j + 1]) throw new Error('orden ' + w);
}
const src = fs.readFileSync('voice.js', 'utf8'), i = src.indexOf('window.VOICE');
fs.writeFileSync('voice.js', src.slice(0, i) + 'window.VOICE=' + JSON.stringify(V) + ';\n');
fs.writeFileSync('qa/changed.json', JSON.stringify(changed));
console.log('ok', changed.length);

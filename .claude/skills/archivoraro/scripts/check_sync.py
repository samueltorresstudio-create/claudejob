# Read-only check of a synced project: for every line, compare the voice stretches the sync gave it with the
# punctuation pieces of its text. A line that got a stretch from its neighbour shows up as a big mismatch.
import json, re, sys
import numpy as np, soundfile as sf
P = sys.argv[1]
s = open(P + '/voice.js').read()
sc = json.loads(s[s.index('window.SCRIPT=') + 14:s.index(';\nwindow.VOICE')])
v = json.loads(s[s.index('window.VOICE=') + 13:].rstrip().rstrip(';'))
a, SR = sf.read(P + '/voice_in.wav'); a = a / (np.abs(a).max() + 1e-9) * .9
hop = int(.01 * SR); fr = np.sqrt(np.convolve(a ** 2, np.ones(hop) / hop, 'same')[::hop])
thr = max(np.percentile(fr, 20) * 2.5, fr.max() * .02); vo = fr > thr
idx = np.where(vo)[0]; first = idx[0] / 100
segs = []; i = idx[0]
while i <= idx[-1]:
    j = i
    while j <= idx[-1] and (vo[j] or vo[j:j + 12].any()): j += 1
    segs.append((i / 100, j / 100)); i = j
    while i <= idx[-1] and not vo[i]: i += 1
off = .3 - first
bad = 0
for k, (l, b) in enumerate(zip(sc, v['beats'])):
    s0, s1 = b['start'] + b['lead'] - off, b['start'] + b['lead'] + b['vdur'] - off
    n = sum(1 for x, y in segs if x >= s0 - .05 and y <= s1 + .1)
    pieces = len([p for p in re.split(r'(?<=[,.…:;?!»])\s+', l['say']) if p.strip()])
    flag = '  <-- REVISAR' if abs(n - pieces) >= 2 else ''
    bad += bool(flag)
    print(f"{k:2d} {b['start']:6.2f} tramos={n} trozos={pieces}{flag}  {l['say'][:50]}")
print('líneas dudosas:', bad)

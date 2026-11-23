# Montaje con pausas NATURALES (medidas en sus MP3 reales): punto ≈ 0,37 s, pregunta ≈ 0,38, coma ≈ 0,25, remate 0,5–0,6.
# Cuenta el silencio que ya trae cada trozo, no recorta colas (caída natural de 150 ms), varía un poco cada pausa y no acelera.
import json, sys, numpy as np, soundfile as sf
spec = json.load(open(sys.argv[1])); PD = sys.argv[2]; N = int(sys.argv[4]) if len(sys.argv) > 4 else len(spec); SR = 24000
rng = np.random.default_rng(7)
def trim(a):
    w = int(SR * .01); e = np.array([np.sqrt(np.mean(a[i:i+w] ** 2)) for i in range(0, len(a) - w, w)]); on = np.where(e > max(.01, e.max() * .05))[0]
    if not len(on): return a
    a0 = max(0, (on[0] - 3) * w); a1 = min(len(a), (on[-1] + 15) * w); b = a[a0:a1].copy(); f = int(SR * .1); b[-f:] *= np.cos(np.linspace(0, np.pi / 2, f)) ** 2
    return b
def gap(s, nxt):
    t = s['t'].strip(); remate = nxt is not None and (nxt.get('sp', 1) < .95 or nxt['r'] == 'remate')
    g = .25 if t.endswith(',') else .38 if t.endswith('?') else .37
    if remate and not t.endswith(","): g = .5
    elif remate: g = .42
    if nxt is not None and nxt['l'] != s['l'] and g < .45: g += .08          # cambio de frase del guion: respira un poco más
    return g * rng.uniform(.9, 1.12)
out, starts, pos = [np.zeros(int(SR * .15), np.float32)], {}, int(SR * .15)
for i in range(N):
    s = spec[i]; a = trim(sf.read(f'{PD}/{i:02d}_raw.wav', dtype='float32')[0])
    if s['l'] not in starts: starts[s['l']] = pos / SR
    out.append(a); pos += len(a)
    if i < N - 1: z = np.zeros(int(SR * max(0, gap(s, spec[i + 1]) - .21)), np.float32); out.append(z); pos += len(z)   # .15 = cola que ya trae el trozo
y = np.concatenate(out); y += (rng.standard_normal(len(y)) * 10 ** (-66 / 20)).astype(np.float32)   # tono de sala muy bajo: sin silencios «muertos»
sf.write(sys.argv[3], y, SR); print(f'{len(y)/SR:.2f}s'); json.dump(starts, open(sys.argv[3] + '.starts.json', 'w'))

# Montaje con pausas NATURALES: solo donde hacen falta (v2, tras «no hacen falta tantas pausas»): seguido 0,2 s, coma 0,1, pregunta→respuesta 0,3, remate 0,42.
# Cuenta el silencio que ya trae cada trozo, no recorta colas (caída natural de 150 ms), varía un poco cada pausa y no acelera.
import json, sys, numpy as np, soundfile as sf
spec = json.load(open(sys.argv[1])); PD = sys.argv[2]; N = int(sys.argv[4]) if len(sys.argv) > 4 else len(spec); SR = 24000
rng = np.random.default_rng(7)
def trim(a):
    w = int(SR * .01); e = np.array([np.sqrt(np.mean(a[i:i+w] ** 2)) for i in range(0, len(a) - w, w)]); on = np.where(e > max(.01, e.max() * .05))[0]
    if not len(on): return a
    a0 = max(0, (on[0] - 3) * w); a1 = min(len(a), (on[-1] + 15) * w); b = a[a0:a1].copy(); f = int(SR * .1); b[-f:] *= np.cos(np.linspace(0, np.pi / 2, f)) ** 2
    return b
def squeeze(a, cap=.15):
    # pausas DENTRO del trozo (comas que mete el modelo): como mucho 0,15 s, con fundido corto para no dar golpes
    w = int(SR * .01); e = np.array([np.sqrt(np.mean(a[i:i+w] ** 2)) for i in range(0, len(a) - w, w)]); sil = e < max(.008, e.max() * .04)
    keep = np.ones(len(a), bool); i = 0; n = len(sil)
    while i < n:
        if sil[i]:
            j = i
            while j < n and sil[j]: j += 1
            if i > 0 and j < n and (j - i) * .01 > cap: c0 = i * w + int(SR * cap / 2); c1 = j * w - int(SR * cap / 2); keep[c0:c1] = False
            i = j
        else: i += 1
    return a[keep]
def words(t): return len(t.split())
def gap(s, nxt):
    # pausa solo donde hace falta: entre frases que siguen el hilo, corta; larga solo antes de un remate o tras una pregunta con respuesta seca
    t = s['t'].strip()
    if t.endswith(','): g = .1
    elif t.endswith('?') and words(nxt['t']) <= 3: g = .3                       # «¿Es de oro?» … «¡No!»
    elif nxt['r'] == 'remate' or nxt.get('sp', 1) < .95: g = .42                # golpe: «Y se venden dos.»
    else: g = .2
    if nxt['l'] != s['l'] and g < .3: g += .06                                  # cambio de frase del guion
    return g * rng.uniform(.92, 1.08)
out, starts, pos = [np.zeros(int(SR * .15), np.float32)], {}, int(SR * .15)
for i in range(N):
    s = spec[i]; a = squeeze(trim(sf.read(f'{PD}/{i:02d}_raw.wav', dtype='float32')[0]))
    if s['l'] not in starts: starts[s['l']] = pos / SR
    out.append(a); pos += len(a)
    if i < N - 1: z = np.zeros(int(SR * max(0, gap(s, spec[i + 1]) - .12)), np.float32); out.append(z); pos += len(z)   # .15 = cola que ya trae el trozo
y = np.concatenate(out); y += (rng.standard_normal(len(y)) * 10 ** (-66 / 20)).astype(np.float32)   # tono de sala muy bajo: sin silencios «muertos»
sf.write(sys.argv[3], y, SR); print(f'{len(y)/SR:.2f}s'); json.dump(starts, open(sys.argv[3] + '.starts.json', 'w'))

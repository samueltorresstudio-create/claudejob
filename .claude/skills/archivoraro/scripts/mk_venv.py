# Envolvente de la voz por fotograma (30 fps) para mover la boca de quien habla al ritmo real del audio → venv.js
import json, sys, numpy as np, soundfile as sf
x, sr = sf.read('narration.wav'); x = x if x.ndim == 1 else x.mean(1)
hop = sr // 30; n = len(x) // hop
rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
rms = np.convolve(rms, [.25, .5, .25], 'same')                     # suaviza un poco (sin perder sílabas)
g = np.percentile(rms[rms > 1e-4], 95) + 1e-9
# normalización LOCAL (máximo en ±1 s): las frases dichas bajito ([deadpan] [slowly]) también abren bien la boca; el silencio queda en 0
loc = np.array([rms[max(0, i - 30):i + 31].max() for i in range(n)])
v = np.where(rms < .06 * g, 0, np.clip(rms / np.maximum(loc, .25 * g), 0, 1))
open('venv.js', 'w').write('window.VENV=' + json.dumps([round(float(a), 3) for a in v]) + ';')
print('frames', n, 'max', v.max())

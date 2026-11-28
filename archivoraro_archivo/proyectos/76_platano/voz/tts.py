# uso: python tts.py spec.json salida.wav [i,j,...]   — spec: [{"t": texto, "r": ref, "sp": velocidad, "p": pausa_despues}]
# reutiliza parts/NN.wav salvo los índices que se pidan rehacer; limpia colas sueltas (sílabas cortadas) y suaviza los cortes
import sys, os, json, time, numpy as np, soundfile as sf
spec = json.load(open(sys.argv[1])); R = json.load(open('refs/refs.json')); redo = set(map(int, sys.argv[3].split(','))) if len(sys.argv) > 3 else None
SR = 24000
def clean(a, sr):
    w = int(sr * .02); n = len(a) // w; e = np.array([np.sqrt(np.mean(a[k*w:(k+1)*w] ** 2)) for k in range(n)]); on = e > max(.012, e.max() * .06)
    segs = []; k = 0
    while k < n:
        if on[k]:
            j = k
            while j < n and on[j]: j += 1
            segs.append([k, j]); k = j
        else: k += 1
    if not segs: return a
    # fusiona huecos cortos (pausas dentro de la frase)
    m = [segs[0]]
    for s in segs[1:]:
        if s[0] - m[-1][1] <= 9: m[-1][1] = s[1]   # ≤ 0,18 s
        else: m.append(s)
    # quita islas finales cortas (≤ 0,3 s) separadas por silencio: sílabas sueltas
    while len(m) > 1 and (m[-1][1] - m[-1][0]) <= 15: m.pop()
    while len(m) > 1 and (m[0][1] - m[0][0]) <= 6: m.pop(0)
    a0 = max(0, m[0][0] * w - int(sr * .03)); a1 = min(len(a), m[-1][1] * w + int(sr * .08)); b = a[a0:a1].copy()
    f = int(sr * .04); b[-f:] *= np.linspace(1, 0, f); b[:int(sr * .01)] *= np.linspace(0, 1, int(sr * .01)); return b
m = None; out = []; marks = []
for i, s in enumerate(spec):
    p = f"parts/{i:02d}.wav"
    if os.path.exists(p) and (redo is None or i not in redo) and redo is not None:
        a, sr = sf.read(p, dtype='float32')
    else:
        if m is None:
            import torch; from omnivoice.models.omnivoice import OmniVoice, OmniVoiceGenerationConfig
            torch.set_num_threads(4); m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32); cfg = OmniVoiceGenerationConfig(num_step=64, class_temperature=.5)
        t = time.time(); a = np.asarray(m.generate(text=s['t'], language="es", ref_audio=f"refs/{s['r']}.wav", ref_text=R[s['r']], speed=s.get('sp', 1.0), generation_config=cfg)[0], np.float32).squeeze()
        sf.write(p.replace('.wav', '_raw.wav'), a, SR); print(i, s['r'], round(time.time() - t), 's', flush=True)
        a = clean(a, SR); sf.write(p, a, SR)
    marks.append(sum(len(x) for x in out) / SR); out += [a, np.zeros(int(SR * s.get('p', .3)), np.float32)]
sf.write(sys.argv[2], np.concatenate(out), SR); json.dump(marks, open(sys.argv[2] + '.marks.json', 'w'))

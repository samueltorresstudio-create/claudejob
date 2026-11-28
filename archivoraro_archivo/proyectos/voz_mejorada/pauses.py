# mide las pausas reales de sus MP3 (ElevenLabs «Stickmans»): hueco entre palabras según la puntuación del guion
import sys, subprocess, re, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel('small', device='cpu', compute_type='int8'); G = {}
for f in sys.argv[1:]:
    x = np.frombuffer(subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    W = [w for s in m.transcribe(x, language='es', word_timestamps=True)[0] for w in s.words]
    for a, b in zip(W, W[1:]):
        t = a.word.strip(); k = '…' if t.endswith('...') or t.endswith('…') else '?' if t.endswith('?') else '.' if t.endswith('.') or t.endswith('!') else ',' if t.endswith(',') or t.endswith(':') else ' '
        # hueco real medido con la energía (Whisper alarga las palabras): silencio continuo entre a.start y b.start
        s0, s1 = int(a.start * 16000), int(b.start * 16000); seg = x[s0:s1]
        if len(seg) < 320: continue
        e = np.array([np.sqrt(np.mean(seg[i:i+320] ** 2)) for i in range(0, len(seg) - 320, 160)]); sil = e < max(.004, e.max() * .05)
        run = best = 0
        for v in sil: run = run + 1 if v else 0; best = max(best, run)
        G.setdefault(k, []).append(best * .01)
for k in ['…', '.', '?', ',', ' ']:
    v = np.array(G.get(k, [0])); print(f"'{k}' n={len(v)} mediana {np.median(v):.2f}s  p25 {np.percentile(v,25):.2f}  p75 {np.percentile(v,75):.2f}")

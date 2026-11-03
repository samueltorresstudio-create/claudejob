# Raise the narration a little on whispered lines (ElevenLabs whispers come out too quiet).
# usage: python3 -I whisper_boost.py <project_dir> [gain=1.3] [line indices...]
# With no indices it boosts every script.json line marked "whisper": true. Safe to re-run: it always starts from narration_pre_boost.wav.
import json, os, shutil, sys
import numpy as np, soundfile as sf
P = sys.argv[1]; gain = float(sys.argv[2]) if len(sys.argv) > 2 else 1.3
idx = [int(x) for x in sys.argv[3:]]
txt = open(os.path.join(P, 'voice.js'), encoding='utf-8').read()
V, _ = json.JSONDecoder().raw_decode(txt[txt.index('window.VOICE=') + len('window.VOICE='):])
if not idx:
    idx = [i for i, l in enumerate(json.load(open(os.path.join(P, 'script.json'), encoding='utf-8'))) if l.get('whisper')]
src_p, pre = os.path.join(P, 'narration.wav'), os.path.join(P, 'narration_pre_boost.wav')
if not os.path.exists(pre): shutil.copy(src_p, pre)
a, sr = sf.read(pre)
g = np.ones(len(a)); ramp = int(.04 * sr)
for k in idx:
    b = V['beats'][k]; s = int(b['start'] * sr); e = min(len(a), int((b['start'] + b['d']) * sr))
    seg = np.full(e - s, gain); n = min(ramp, (e - s) // 2)
    seg[:n] = np.linspace(1, gain, n); seg[-n:] = np.linspace(gain, 1, n); g[s:e] = seg
out = a * (g[:, None] if a.ndim > 1 else g)
sf.write(src_p, np.clip(out, -1, 1), sr)
print('boosted lines', idx, 'x', gain, '| peak', round(float(np.abs(out).max()), 3))

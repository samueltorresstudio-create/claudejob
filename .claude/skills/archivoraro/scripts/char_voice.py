# Cambia ligeramente la voz de un PERSONAJE dentro de la narración (solo en sus frases), para que no suene igual que el narrador.
# Uso: python3 -I char_voice.py <proyecto> "10.80-12.80,70.50-73.25" [semitonos=-1.5] [rasposo=3.2]
# Guarda la narración original en narration_orig.wav la primera vez y reescribe narration.wav (después: audio.py --voice + finish.py).
# Preset elegido por el usuario (62 vacas, vecino): −1,5 semitonos + saturación suave («grave y rasposo»). Solo voces propias del usuario.
import os, sys, subprocess, numpy as np, soundfile as sf
proj, spans = sys.argv[1], [tuple(map(float, s.split('-'))) for s in sys.argv[2].split(',')]
semi = float(sys.argv[3]) if len(sys.argv) > 3 else -1.5; drive = float(sys.argv[4]) if len(sys.argv) > 4 else 3.2
orig = os.path.join(proj, 'narration_orig.wav'); cur = os.path.join(proj, 'narration.wav')
if not os.path.exists(orig): os.replace(cur, orig)
x, sr = sf.read(orig); mono = x.ndim == 1; y = x.copy()
tmp_i, tmp_o = os.path.join(proj, '_cv_in.wav'), os.path.join(proj, '_cv_out.wav')
for a, b in spans:
    i0, i1 = int(a * sr), min(len(x), int(b * sr)); seg = x[i0:i1]
    sf.write(tmp_i, seg, sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp_i, '-af', f'rubberband=pitch={2 ** (semi / 12):.5f}', tmp_o], check=True)
    z, _ = sf.read(tmp_o); z = z[:len(seg)] if len(z) >= len(seg) else np.pad(z, [(0, len(seg) - len(z))] + [(0, 0)] * (z.ndim - 1))
    if drive > 0: z = np.tanh(z * drive) / np.tanh(drive); z *= np.abs(seg).max() / (np.abs(z).max() + 1e-9)
    f = int(.015 * sr); w = np.ones(len(seg)); w[:f] = np.linspace(0, 1, f); w[-f:] = np.linspace(1, 0, f)   # fundido de 15 ms en los bordes
    if not mono: w = w[:, None]
    y[i0:i1] = seg * (1 - w) + z * w
for t in (tmp_i, tmp_o):
    if os.path.exists(t): os.remove(t)
sf.write(cur, y, sr); print('voz de personaje aplicada en', spans, f'({semi:+} st, rasposo {drive})')

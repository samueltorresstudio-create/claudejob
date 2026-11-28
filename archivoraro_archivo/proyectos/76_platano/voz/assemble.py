# Une los trozos de voz con pausas escaladas y acelera (atempo) hasta la duración pedida; devuelve los inicios de cada línea en el MP3 final.
import json, sys, subprocess, numpy as np, soundfile as sf
spec = json.load(open('voz76.json')); SR = 24000; target = float(sys.argv[1]) if len(sys.argv) > 1 else 62.6
parts = [sf.read(f'parts/{i:02d}.wav', dtype='float32')[0] for i in range(len(spec))]
def build(kp):
    out, starts, pos = [np.zeros(int(SR * .15), np.float32)], {}, int(SR * .15)
    for s, a in zip(spec, parts):
        if s['l'] not in starts: starts[s['l']] = pos / SR
        out.append(a); pos += len(a); z = np.zeros(int(SR * s['p'] * kp), np.float32); out.append(z); pos += len(z)
    return np.concatenate(out), starts
kp = .72; y, st = build(kp); raw = len(y) / SR; at = min(1.07, max(1.0, raw / target))
if raw / at > target + .3: kp = .6; y, st = build(kp); raw = len(y) / SR; at = min(1.07, max(1.0, raw / target))
sf.write('voz76_join.wav', y, SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'voz76_join.wav', '-af', f'atempo={at:.4f}', '-ar', '44100', '-b:a', '192k', 'voz76.mp3'], check=True)
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'voz76.mp3'], capture_output=True, text=True).stdout)
ls = [round(st[l] / at, 3) for l in sorted(st)]; json.dump(ls, open('line_starts.json', 'w'))
print(f'raw {raw:.2f}s pausas x{kp} atempo {at:.3f} -> {dur:.2f}s'); print('LINE_STARTS=' + ','.join(f'{x:.2f}' for x in ls[1:]))

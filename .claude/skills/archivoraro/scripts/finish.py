# Encode a rendered project, check the hard cut, build a contact sheet, deliver it and append its script.
# usage: python3 finish.py <project_dir> <delivery_name> "<script header for guiones_elevenlabs.txt>"
import json, os, shutil, subprocess, sys

proj, name, header = sys.argv[1], sys.argv[2], sys.argv[3]
S = os.path.dirname(os.path.abspath(proj.rstrip('/')))
out = os.path.join(proj, 'video.mp4')
ev = json.load(open(os.path.join(proj, 'events.json')))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', os.path.join(proj, 'frames/f%05d.png'), '-i', os.path.join(proj, 'audio.wav'),
                '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
                '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-shortest', out], check=True)
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout)


def luma(ts):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(ts), '-i', out, '-frames:v', '1', '-vf', 'scale=108:192', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
    return round(sum(raw) / max(1, len(raw)), 1)


sil = subprocess.run(['ffmpeg', '-i', out, '-af', 'silencedetect=n=-50dB:d=0.2', '-f', 'null', '-'], capture_output=True, text=True).stderr
sil = [l.split('silence_start: ')[1] for l in sil.splitlines() if 'silence_start' in l]
print(f'duration {dur:.2f}s | cut {ev["cut"]:.2f} | luma before {luma(ev["cut"] - .2)} after {luma(ev["cut"] + .15)} | silence starts {sil[-1:] }')
# contact sheet
ts = [round(x * (ev['cut'] - .3) / 23 + .3, 2) for x in range(24)]
fs = []
os.makedirs(os.path.join(proj, 'preview'), exist_ok=True)
for i, x in enumerate(ts):
    f = os.path.join(proj, 'preview', f'v_{i:02d}.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(x), '-i', out, '-frames:v', '1', f])
    fs.append(f)
subprocess.run(['python3', os.path.join(S, 'tools', 'sheet.py'), os.path.join(proj, 'final_sheet.png')] + fs)
# deliver
dst = os.path.join(S, 'entregas', name + '.mp4')
shutil.copy(out, dst)
g = os.path.join(S, 'guiones_elevenlabs.txt')
txt = open(g).read()
if header not in txt:
    lines = json.load(open(os.path.join(proj, 'script.json')))
    body = '\n'.join(('"' + l['say'] + '"') if l.get('voice') == 'tv' else l['say'] for l in lines)
    open(g, 'a').write('\n\n' + header + '\n' + '-' * 71 + '\n' + body + '\n')
shutil.copy(g, os.path.join(S, 'entregas', 'guiones_elevenlabs.txt'))
print('delivered', dst)

# fake_voice.py <proj> : timeline WITHOUT an MP3 (estimated from the text, model fitted on past ElevenLabs voices).
# Writes voice.js like sync_voice.py does (no narration). Re-run sync_voice.py when the real MP3 arrives.
import json, os, re, sys
P = sys.argv[1]
c = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fake_voice_coef.json')))
script = json.load(open(os.path.join(P, 'script.json')))
beats, t = [], 0.0
for k, l in enumerate(script):
    say = re.sub(r'\[[a-z]+\]', '', l['say'])
    letters = len(re.sub(r'[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]', '', say)); words = len(say.split())
    ell = say.count('...'); stops = len(re.findall(r'[.?!:»](?!\.)', say)) - ell; commas = say.count(',')
    d = c[0]*letters + c[1]*words + c[2]*ell + c[3]*stops + c[4]*commas + c[5] + (0.3 if k == 0 else 0)
    if k == len(script) - 1: d += 1.4   # hold the last image before the cut
    lead = 0.3 if k == 0 else 0.08
    beats.append({'start': round(t, 4), 'd': round(d, 4), 'lead': lead, 'vdur': round(d - lead - .3, 4)})
    t += d
tail = 0.35
with open(os.path.join(P, 'voice.js'), 'w') as f:
    f.write('window.SCRIPT=' + json.dumps(script, ensure_ascii=False) + ';\n')
    f.write('window.VOICE=' + json.dumps({'beats': beats, 'total': round(t + tail, 4), 'tail': tail}) + ';\n')
for l, b in zip(script, beats): print(f"{b['start']:6.2f} {b['d']:5.2f}  {l['sc']:9s} {l['say'][:60]}")
print('total', round(t + tail, 2))

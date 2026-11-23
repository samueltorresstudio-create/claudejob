# compara la hora de cada palabra del subtítulo (voice.js) con Whisper sobre narration.wav
import re, json, sys, difflib, unicodedata, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
P = sys.argv[1]; s = open(P + '/voice.js').read()
SC = json.loads(re.search(r'window.SCRIPT=(\[.*?\]);', s, re.S).group(1)); V = json.loads(re.search(r'window.VOICE=(\{.*\});?', s, re.S).group(1))
def n(w): w = unicodedata.normalize('NFD', w.lower()); return re.sub(r'[^a-z0-9]', '', ''.join(c for c in w if unicodedata.category(c) != 'Mn'))
cw = []
for l, b in zip(SC, V['beats']):
    ws = [n(re.sub(r'\|\w', '', w)) for w in l['cap'].split(' ')]
    for w, t in zip(ws, b['words']): cw.append((w, b['start'] + t))
a, sr = sf.read(P + '/narration.wav', dtype='float32'); a = a.mean(1) if a.ndim > 1 else a
x = np.interp(np.arange(0, len(a), sr / 16000), np.arange(len(a)), a).astype('float32')
W = [(n(w.word), w.start) for sg in WhisperModel('small', device='cpu', compute_type='int8').transcribe(x, language='es', word_timestamps=True)[0] for w in sg.words]
sm = difflib.SequenceMatcher(None, [w for w, _ in cw], [w for w, _ in W], autojunk=False); d = []
for i, j, k in sm.get_matching_blocks():
    for q in range(k): d.append((cw[i + q][0], cw[i + q][1], W[j + q][1], cw[i + q][1] - W[j + q][1]))
e = np.array([x[3] for x in d]); print('emparejadas', len(d), 'de', len(cw), '| error medio', round(float(np.mean(np.abs(e))), 3), 'máx', round(float(np.max(np.abs(e))), 3))
for w, c, h, dd in d:
    if abs(dd) > .25: print('  ', w, round(c, 2), round(h, 2), round(dd, 2))

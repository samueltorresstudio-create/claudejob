# puntúa tomas: palabras bien dichas (Whisper) + naturalidad (variación de tono en semitonos y de energía, pausas)
import sys, re, unicodedata, difflib, numpy as np, soundfile as sf, librosa
from faster_whisper import WhisperModel
def n(s): s = unicodedata.normalize('NFD', s.lower()); return re.sub(r'[^a-z0-9 ]', '', ''.join(c for c in s if unicodedata.category(c) != 'Mn')).split()
TXT = n(sys.argv[1]); m = WhisperModel('small', device='cpu', compute_type='int8')
for f in sys.argv[2:]:
    x, sr = sf.read(f, dtype='float32'); x = x.mean(1) if x.ndim > 1 else x
    x16 = librosa.resample(x, orig_sr=sr, target_sr=16000)
    hyp = n(' '.join(s.text for s in m.transcribe(x16, language='es')[0]))
    acc = difflib.SequenceMatcher(None, TXT, hyp).ratio()
    f0, v, _ = librosa.pyin(x16, fmin=60, fmax=400, sr=16000, frame_length=1024)
    st = 12 * np.log2(f0[v] / np.nanmedian(f0[v]))
    rms = librosa.feature.rms(y=x16)[0]; db = 20 * np.log10(rms[rms > rms.max() * .05] + 1e-9)
    print(f"{f}: dur {len(x)/sr:.2f}s  acierto {acc:.2f}  tono σ {np.std(st):.2f} st  rango {np.percentile(st,95)-np.percentile(st,5):.1f} st  energía σ {np.std(db):.1f} dB")
    if acc < .97: print('   oye:', ' '.join(hyp))

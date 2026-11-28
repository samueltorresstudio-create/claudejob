import sys, json
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
out = {}
for f in sys.argv[1:]:
    import subprocess, numpy as np
    a = np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f,'-f','f32le','-ac','1','-ar','16000','-'],capture_output=True).stdout, np.float32)
    segs, _ = m.transcribe(a, language="es", word_timestamps=True)
    out[f] = [dict(s=round(s.start,2), e=round(s.end,2), t=s.text.strip()) for s in segs]
    print(f, len(out[f]), flush=True)
json.dump(out, open('voz75/trans.json','w'), ensure_ascii=False, indent=0)

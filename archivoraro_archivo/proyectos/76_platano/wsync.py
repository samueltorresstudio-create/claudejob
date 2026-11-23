import json,sys,unicodedata,re,difflib
from faster_whisper import WhisperModel
def n(s): s=unicodedata.normalize('NFD',s.lower()); return re.sub(r'[^a-z0-9]','',''.join(c for c in s if unicodedata.category(c)!='Mn'))
cap=json.load(open(sys.argv[2]))
m=WhisperModel('small',device='cpu',compute_type='int8')
import soundfile as sf,numpy as np
x,sr=sf.read(sys.argv[1],dtype='float32')
x=x.mean(1) if x.ndim>1 else x
x=np.interp(np.arange(0,len(x),sr/16000),np.arange(len(x)),x).astype('float32')
segs,_=m.transcribe(x,language='es',word_timestamps=True)
W=[(n(w.word),w.start) for s in segs for w in s.words]
json.dump([(w,float(t)) for w,t in W],open("wwords.json","w"))
A=[n(c[1]) for c in cap]; B=[w[0] for w in W]
sm=difflib.SequenceMatcher(None,A,B,autojunk=False); bad=[]; d=[]
for a,b,size in sm.get_matching_blocks():
  for k in range(size):
    c=cap[a+k]; dt=c[2]-W[b+k][1]; d.append(dt)
    if abs(dt)>.15: bad.append((c[0],c[1],c[2],round(W[b+k][1],2),round(dt,2)))
print('matched',len(d),'of',len(cap),'median dt',sorted(d)[len(d)//2] if d else None)
for x in bad: print(x)

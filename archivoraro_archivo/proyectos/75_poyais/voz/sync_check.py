import json,re,subprocess,numpy as np,unicodedata,sys
from faster_whisper import WhisperModel
P='75_poyais'; s=open(P+'/voice.js').read()
def grab(name):
    m=re.search(r'window\.'+name+r'\s*=\s*',s); d=json.JSONDecoder(); return d.raw_decode(s[m.end():])[0]
SC=grab('SCRIPT'); V=grab('VOICE')
norm=lambda w: ''.join(c for c in unicodedata.normalize('NFD',w.lower()) if c.isalnum() and unicodedata.category(c)!='Mn')
cap=[]
for l,b in zip(SC,V['beats']):
    ws=[w for w in re.split(r'\s+',l['say']) if norm(w)]
    for w,t in zip(ws,b['words']): cap.append((norm(w),b['start']+t))
a=subprocess.run(['ffmpeg','-v','error','-i','75_poyais/narration.wav','-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
x=np.frombuffer(a,np.float32)
m=WhisperModel('small',device='cpu',compute_type='int8')
segs,_=m.transcribe(x,language='es',word_timestamps=True,beam_size=5)
wh=[(norm(w.word),w.start) for sg in segs for w in sg.words if norm(w.word)]
print(len(cap),'cap words',len(wh),'whisper words')
import difflib
sm=difflib.SequenceMatcher(None,[c[0] for c in cap],[w[0] for w in wh],autojunk=False)
d=[]
for bl in sm.get_matching_blocks():
    for k in range(bl.size):
        c=cap[bl.a+k]; w=wh[bl.b+k]; d.append((c[1],w[1]-c[1],c[0]))
dd=np.array([e[1] for e in d])
print('matched',len(d),'mean %.3f med %.3f max|d| %.3f'%(dd.mean(),np.median(dd),abs(dd).max()))
for t,e,w in d:
    if abs(e)>0.2: print('OFF %.2f %+.2f %s'%(t,e,w))
for op in sm.get_opcodes():
    if op[0]!='equal': print(op[0],[c[0] for c in cap[op[1]:op[2]]],[w[0] for w in wh[op[3]:op[4]]])

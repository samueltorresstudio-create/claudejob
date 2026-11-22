import sys, json, re, subprocess, numpy as np, unicodedata, difflib
from faster_whisper import WhisperModel
m=WhisperModel("small",device="cpu",compute_type="int8"); S=json.load(open('voz75.json'))
def norm(s):
    s=unicodedata.normalize('NFD',s.lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    for a,b in [('1822','mil ochocientos veintidos'),('200.000','doscientas mil'),('200','doscientos'),('70','setenta')]: s=s.replace(a,b)
    return re.sub(r'[^a-z ]',' ',s).split()
bad=[]
for i in map(int,sys.argv[1].split(',')):
    f=f'parts/{i:02d}.wav'; x=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f,'-f','f32le','-ac','1','-ar','16000','-'],capture_output=True).stdout,np.float32)
    seg,_=m.transcribe(x,language='es',initial_prompt='Poyais, MacGregor, Edimburgo, Venezuela, cacique'); t=' '.join(z.text for z in seg)
    a,b=norm(s:=S[i]['t']),norm(t); ok=a==b
    if not ok: bad.append(i)
    print(i,ok,'|',t.strip())
print('MAL',','.join(map(str,bad)))

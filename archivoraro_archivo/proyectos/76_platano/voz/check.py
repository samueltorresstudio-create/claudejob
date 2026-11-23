import sys, json, re, subprocess, numpy as np, unicodedata, difflib
from faster_whisper import WhisperModel
m=WhisperModel("small",device="cpu",compute_type="int8"); S=json.load(open('voz76.json'))
def norm(s):
    s=unicodedata.normalize('NFD',s.lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    for a,b in [('2019','dos mil diecinueve'),('120.000','ciento veinte mil'),('6.200.000','seis millones doscientos mil'),('100.000','cien mil'),('14','catorce'),('5','cinco')]: s=s.replace(a,b)
    return re.sub(r'[^a-z ]',' ',s).split()
bad=[]
for i in map(int,sys.argv[1].split(',')):
    f=f'parts/{i:02d}.wav'; x=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f,'-f','f32le','-ac','1','-ar','16000','-'],capture_output=True).stdout,np.float32)
    seg,_=m.transcribe(x,language='es',initial_prompt='plátano, Miami, criptomonedas, frutero, céntimos'); t=' '.join(z.text for z in seg)
    a,b=norm(s:=S[i]['t']),norm(t); ok=a==b
    if not ok: bad.append(i)
    print(i,ok,'|',t.strip())
print('MAL',','.join(map(str,bad)))

# prints, per script line, the speech chunks found in the voice vs the phrases in the text (to spot mis-split lines)
import numpy as np, soundfile as sf, json, re, sys, os
P=sys.argv[1]; SR=44100
a,_=sf.read(os.path.join(P,'voice_in.wav')); a=a/(np.abs(a).max()+1e-9)*.9
hop=int(.01*SR); fr=np.sqrt(np.convolve(a**2,np.ones(hop)/hop,'same')[::hop])
thr=max(np.percentile(fr,20)*2.5,fr.max()*.02); v=fr>thr
ch=[];i=0;n=len(v)
while i<n:
    if v[i]:
        j=i
        while j<n and (v[j] or (j+12<n and v[j:j+12].any())): j+=1
        ch.append((i/100,j/100)); i=j
    else: i+=1
vj=json.loads(open(os.path.join(P,'voice.js')).read().split('window.VOICE=')[1].rstrip(';\n'))
sc=json.load(open(os.path.join(P,'script.json')))
shift=vj['beats'][0]['start']+vj['beats'][0]['lead']-ch[0][0]
st=[b['start']+b['lead']-shift for b in vj['beats']]+[999]
for k,l in enumerate(sc):
    cs=[round(c1-c0,2) for c0,c1 in ch if st[k]-.05<=c0<st[k+1]-.05]
    ph=[len(p.strip()) for p in re.split(r'(?<=[.,:?…!])\s+',l['say']) if p.strip()]
    print(k,f"{st[k]:.2f}",cs,' <-> ',ph,l['say'][:38])

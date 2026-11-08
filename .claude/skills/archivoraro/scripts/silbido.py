# Silbón whistle modelled on the user's reference (8 Nov 2026): ~13 short rising notes, ~1240 Hz → ~2370 Hz (almost an octave),
# first note a bit longer (~0.33 s), then steady ~0.17 s notes with tiny gaps, each note sliding up a little, last note fades out.
import numpy as np
SR=44100
def notes_ref(n=13,f0=1240.,f1=2370.):
    return [f0*(f1/f0)**(i/(n-1)) for i in range(n)]
def whistle(far=0.0,amp=.55,seed=1,first=.33,step=.165,gap=.035,last=.45):
    r=np.random.default_rng(seed); fs=notes_ref(); out=[]
    for i,f in enumerate(fs):
        dur=first if i==0 else (last if i==len(fs)-1 else step+(.06 if i==8 else 0))
        n=int(dur*SR); t=np.arange(n)/SR
        fin=f*(1+.018*np.clip(t/dur,0,1))                      # slides up inside the note
        vib=1+0.005*np.sin(2*np.pi*6*t)
        ph=2*np.pi*np.cumsum(fin*vib)/SR
        tone=np.sin(ph)+0.07*np.sin(2*ph)
        rel=.25 if i==len(fs)-1 else .03
        env=np.clip(t/0.02,0,1)*np.clip((dur-t)/rel,0,1)
        breath=np.convolve(r.normal(0,1,n),np.ones(8)/8,'same')*0.05
        out.append((tone*.92+breath)*env*amp*(.85+.25*i/len(fs))); out.append(np.zeros(int(gap*SR)))
    x=np.concatenate(out); y=x.copy()
    for d,g in [(0.21,.3),(0.44,.17),(0.78,.1),(1.25,.06)]:
        k=int(d*SR); y=np.concatenate([y,np.zeros(k)]); y[k:k+len(x)]+=x*g
    if far>0:
        Y=np.fft.rfft(y); fr=np.fft.rfftfreq(len(y),1/SR); Y*=1/(1+(fr/2500)**2*far*4); y=np.fft.irfft(Y,len(y))*(1-far*.7)
    return y
if __name__=='__main__':
    import soundfile as sf, subprocess, sys
    near=whistle(); farw=whistle(far=.9,seed=2)
    x=np.concatenate([near,np.zeros(int(1.0*SR)),farw]); x=x/np.abs(x).max()*.8
    sf.write(sys.argv[1]+'.wav',x,SR); subprocess.run(['ffmpeg','-v','error','-y','-i',sys.argv[1]+'.wav','-b:a','192k',sys.argv[1]+'.mp3'],check=True)
    print(round(len(near)/SR,2),'s each (incl. echo tail)')

# Painterly "cracked marble" textures for the sucesos style: domain-warped bands + Worley cell edges + grain.
import numpy as np, sys
from PIL import Image, ImageFilter
R=np.random.default_rng(11)
def up(a,h,w): return np.asarray(Image.fromarray(a.astype(np.float32),'F').resize((w,h),Image.BICUBIC))
def fbm(h,w,base,octs=6,seed=0):
    r=np.random.default_rng(seed);s=np.zeros((h,w),np.float32);a=1;t=0
    for o in range(octs):
        n=base*2**o; g=r.random((max(2,int(n*h/w))+2,n+2)).astype(np.float32)
        s+=a*up(g,h,w);t+=a;a*=.52
    return s/t
def worley(h,w,cell,seed=1,jit=.9):
    r=np.random.default_rng(seed); gh,gw=h//cell+3,w//cell+3
    px=(np.arange(gw)[None,:]-1+.5+(r.random((gh,gw))-.5)*jit)*cell; py=(np.arange(gh)[:,None]-1+.5+(r.random((gh,gw))-.5)*jit)*cell
    yy,xx=np.mgrid[0:h,0:w].astype(np.float32); ci=(yy//cell).astype(int)+1; cj=(xx//cell).astype(int)+1
    d1=np.full((h,w),1e9,np.float32); d2=d1.copy(); idv=np.zeros((h,w),np.float32); val=r.random((gh,gw)).astype(np.float32)
    for di in (-1,0,1):
        for dj in (-1,0,1):
            I=np.clip(ci+di,0,gh-1); J=np.clip(cj+dj,0,gw-1)
            d=np.hypot(xx-px[I,J],yy-py[I,J]).astype(np.float32)
            m=d<d1; d2=np.where(m,d1,np.minimum(d2,d)); idv=np.where(m,val[I,J],idv); d1=np.where(m,d,d1)
    return d1,d2,idv
def grad(v,stops):
    v=np.clip(v,0,1);out=np.zeros(v.shape+(3,),np.float32)
    xs=[s[0] for s in stops];cs=np.array([s[1] for s in stops],np.float32)
    for c in range(3): out[...,c]=np.interp(v,xs,cs[:,c])
    return out
def make(name,h,w,stops,bands=0,warp=.25,cell=46,edge=0.13,cellvar=.18,grain=10,blur=0.6,bright=1.0,vert=0.0,seed=3):
    yy=np.mgrid[0:h,0:w][0]/h
    wx=fbm(h,w,3,5,seed); wy=fbm(h,w,3,5,seed+1)
    n=fbm(h,w,4,6,seed+2)
    if bands: v=(yy*bands+wx*warp*bands*0.6+n*.25)%1
    else: v=np.clip(n*1.25-.12+(wy-.5)*warp+vert*(yy-.5),0,1)
    col=grad(v,stops)
    br=up(R.random((max(4,h//10),max(4,w//110))).astype(np.float32),h,w)   # long horizontal brush strokes
    col*=(0.9+0.2*br)[...,None]
    d1,d2,idv=worley(h,w,cell,seed+5)
    e=np.clip((d2-d1)/4.0,0,1)                       # 0 on the cell borders
    shade=1-edge*(1-e)**2 + (idv-.5)*cellvar
    col*=shade[...,None]*bright
    col+=R.normal(0,grain,col.shape[:2])[...,None]
    im=Image.fromarray(np.clip(col,0,255).astype(np.uint8))
    if blur: im=im.filter(ImageFilter.GaussianBlur(blur))
    im.save(f'tex_{name}.png'); print(name)
W=1100
make('storm',2400,W,[(0,(14,14,40)),(.35,(38,32,84)),(.6,(70,48,110)),(.85,(120,80,140)),(1,(160,110,160))],warp=.6,cell=58,edge=0.17,seed=3)
make('ice',3000,W,[(0,(4,18,40)),(.3,(14,60,96)),(.55,(30,120,150)),(.8,(110,200,220)),(1,(200,245,255))],warp=.8,cell=40,edge=0.27,seed=7)
make('snow',2400,W,[(0,(120,140,180)),(.4,(180,198,226)),(.7,(222,232,246)),(1,(250,252,255))],warp=.5,cell=52,edge=0.13,cellvar=.1,grain=6,seed=9)
make('rock',2400,W,[(0,(40,18,10)),(.3,(110,50,24)),(.55,(170,84,40)),(.8,(206,120,60)),(1,(240,170,100))],bands=0,warp=.7,cell=44,edge=0.24,seed=13)
make('strata',2600,W,[(0,(200,96,46)),(.2,(150,60,100)),(.38,(80,50,140)),(.52,(36,96,120)),(.68,(40,60,130)),(.84,(180,90,60)),(1,(200,96,46))],bands=6,warp=.35,cell=44,edge=0.23,seed=17)
make('moraine',2400,W,[(0,(36,30,32)),(.35,(84,72,68)),(.6,(126,108,94)),(.85,(170,150,126)),(1,(200,184,160))],warp=.6,cell=34,edge=0.30,cellvar=.3,seed=21)
make('dawn',2400,W,[(0,(30,24,70)),(.35,(110,60,130)),(.6,(220,110,110)),(.8,(250,170,120)),(1,(255,220,170))],warp=.15,vert=1.6,cell=70,edge=0.07,cellvar=.05,grain=5,seed=25)
make('night',2400,W,[(0,(4,4,12)),(.4,(12,14,30)),(.7,(26,28,56)),(1,(50,46,84))],warp=.5,cell=60,edge=0.15,seed=29)

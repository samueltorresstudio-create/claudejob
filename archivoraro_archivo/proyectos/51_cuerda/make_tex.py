# painterly textures (value noise + domain warp), saved as PNG next to the scenes
import numpy as np
from PIL import Image
rng=np.random.default_rng(7)
def vnoise(h,w,cells):
    g=rng.random((cells+2,int(cells*w/h)+2))
    im=Image.fromarray((g*255).astype(np.uint8)).resize((w,h),Image.BICUBIC)
    return np.asarray(im,float)/255
def fbm(h,w,base=4,oct=6):
    s=np.zeros((h,w));a=1;t=0
    for o in range(oct):
        s+=a*vnoise(h,w,base*2**o);t+=a;a*=.55
    return s/t
def grad(v,stops):
    v=np.clip(v,0,1);out=np.zeros(v.shape+(3,))
    xs=[s[0] for s in stops];cs=np.array([s[1] for s in stops],float)
    for ch in range(3): out[...,ch]=np.interp(v,xs,cs[:,ch])
    return out
def save(a,name): Image.fromarray(np.clip(a,0,255).astype(np.uint8)).save(name)
H,W=1500,1300
yy,xx=np.mgrid[0:H,0:W]/H
# 1) rock strata (cross-section of the mountain): warped bands
n=fbm(H,W,3,6); warp=fbm(H,W,2,4)
bands=(yy*5.5+warp*1.6+n*.35)%1
col=grad(bands,[(0,(214,120,60)),(.22,(150,70,110)),(.42,(70,60,140)),(.58,(40,110,130)),(.75,(190,110,70)),(1,(214,120,60))])
col*= (0.75+0.5*fbm(H,W,24,3))[...,None]
save(col,'tex_strata.png')
# 2) ice (crevasse walls)
n=fbm(H,W,4,6); v=(n*1.4+yy*.5+fbm(H,W,30,2)*.25)
col=grad((v-v.min())/(v.max()-v.min()),[(0,(8,28,52)),(.35,(30,90,130)),(.6,(90,170,200)),(.85,(170,225,240)),(1,(230,248,255))])
save(col,'tex_ice.png')
# 3) snow
n=fbm(H,W,5,6)
col=grad(n,[(0,(170,190,215)),(.45,(215,228,242)),(.7,(240,246,252)),(1,(255,255,255))])
save(col,'tex_snow.png')
# 4) storm / night sky
n=fbm(H,W,3,6); w2=fbm(H,W,8,3)
col=grad(n*.8+w2*.3+(1-yy)*.15,[(0,(10,12,30)),(.45,(30,34,70)),(.7,(70,60,110)),(1,(120,110,150))])
save(col,'tex_storm.png')
# 5) moraine (rocks and gravel, warm grey)
n=fbm(H,W,6,7); r=fbm(H,W,40,2)
col=grad(n*.7+r*.4,[(0,(50,44,46)),(.4,(110,96,88)),(.65,(150,130,112)),(1,(200,184,160))])
save(col,'tex_moraine.png')
# 6) dawn sky (peach to violet)
n=fbm(H,W,3,5)
col=grad(np.clip(yy*1.1+n*.25-.1,0,1),[(0,(40,40,90)),(.4,(140,90,150)),(.7,(250,160,120)),(1,(255,220,170))])
save(col,'tex_dawn.png')
print('ok')

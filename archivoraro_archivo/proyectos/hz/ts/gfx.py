from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/opentype/inter/Inter-Black.otf'
YEL=(255,211,74); PINK=(255,74,106)
def font(n): return ImageFont.truetype(F,n)
def ctext(d,y,txt,f,fill,W,x0=0):
    w=d.textlength(txt,font=f); d.text((x0+(W-w)/2,y),txt,font=f,fill=fill)
for n in range(1,8):
    im=Image.new('RGBA',(860,1080),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle((110,70,750,300),radius=28,fill=(15,18,32,215))
    ctext(d,88,'TSUNAMI',font(78),YEL,860)
    ctext(d,182,'MARCO Y DUQUE',font(40),(255,255,255),860)
    lab=f'PARTE {n}'+(' · FINAL' if n==7 else '')
    f=font(34); w=d.textlength(lab,font=f)
    d.rounded_rectangle((430-w/2-26,240,430+w/2+26,304),radius=32,fill=PINK)
    ctext(d,250,lab,f,(255,255,255),860)
    ctext(d,1010,'ARCHIVO RARO',font(26),(255,255,255,150),860)
    im.save(f'ts/panel_{n}.png')
    c=Image.new('RGB',(1920,1080),(12,14,26)); d=ImageDraw.Draw(c)
    ctext(d,250,'TSUNAMI · MARCO Y DUQUE',font(70),(255,255,255),1920)
    ctext(d,380,f'PARTE {n}',font(190),YEL,1920)
    if n==7: ctext(d,610,'FINAL',font(80),PINK,1920)
    ctext(d,940,'ARCHIVO RARO',font(30),(140,140,160),1920)
    c.save(f'ts/card_{n}.png')

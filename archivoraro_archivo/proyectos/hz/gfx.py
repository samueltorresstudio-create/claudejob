from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/opentype/inter/Inter-Black.otf'
YEL=(255,211,74); PINK=(255,74,106)
def font(n): return ImageFont.truetype(F,n)
def ctext(d,y,txt,f,fill,W,x0=0,stroke=0):
    w=d.textlength(txt,font=f); d.text((x0+(W-w)/2,y),txt,font=f,fill=fill,stroke_width=stroke,stroke_fill=(0,0,0))
for n in range(1,6):
    # overlay for the right panel (860x1080, transparent)
    im=Image.new('RGBA',(860,1080),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle((70,90,790,300),radius=28,fill=(15,18,32,215))
    ctext(d,118,'¿Y SI DESAPARECIERAN',font(50),(255,255,255),860)
    ctext(d,178,'LOS ADULTOS?',font(50),YEL,860)
    lab=f'PARTE {n}'+(' · FINAL' if n==5 else '')
    f=font(34); w=d.textlength(lab,font=f)
    d.rounded_rectangle((430-w/2-26,248,430+w/2+26,312),radius=32,fill=PINK)
    ctext(d,258,lab,f,(255,255,255),860)
    f2=font(26); ctext(d,990,'ARCHIVO RARO',f2,(255,255,255,150),860)
    im.save(f'panel_{n}.png')
    # title card 1920x1080
    c=Image.new('RGB',(1920,1080),(12,14,26)); d=ImageDraw.Draw(c)
    ctext(d,300,'¿Y SI DESAPARECIERAN LOS ADULTOS?',font(70),(255,255,255),1920)
    ctext(d,430,f'PARTE {n}',font(190),YEL,1920)
    if n==5: ctext(d,660,'FINAL',font(80),PINK,1920)
    ctext(d,940,'ARCHIVO RARO',font(30),(140,140,160),1920)
    c.save(f'card_{n}.png')

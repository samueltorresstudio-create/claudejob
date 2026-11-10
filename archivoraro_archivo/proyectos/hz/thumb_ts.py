from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
F='/usr/share/fonts/opentype/inter/Inter-Black.otf'
W,H=1280,720
s=Image.open('portadas/f_tsunami1.png').convert('RGB')
def enh(i): 
    i=ImageEnhance.Brightness(i).enhance(1.15); i=ImageEnhance.Contrast(i).enhance(1.15); return ImageEnhance.Color(i).enhance(1.2)
fg=enh(s.crop((0,150,1080,990)).resize((int(1080*H/840),H),Image.LANCZOS))  # 926x720
# background: same image stretched & blurred
bg=enh(s.crop((560,150,900,990))).resize((W,H),Image.LANCZOS).filter(ImageFilter.GaussianBlur(14))
bg=ImageEnhance.Brightness(bg).enhance(0.7)
im=bg.convert('RGBA')
x0=W-fg.width
m=Image.new('L',fg.size,255); md=ImageDraw.Draw(m)
for x in range(120): md.line([(x,0),(x,H)],fill=int(255*x/120))
im.paste(fg,(x0,0),m)
g=Image.new('L',(W,H),0); gd=ImageDraw.Draw(g)
for y in range(270): gd.line([(0,y),(W,y)],fill=int(175*(1-y/270)))
im=Image.composite(Image.new('RGBA',(W,H),(5,9,20,255)),im,g)
d=ImageDraw.Draw(im)
def t(x,y,s,f,col,sw=8): d.text((x,y),s,font=ImageFont.truetype(F,f),fill=col,stroke_width=sw,stroke_fill=(0,0,0))
t(36,24,'SI EL MAR SE RETIRA…',80,(255,255,255))
t(36,114,'TIENES 20 MINUTOS',98,(255,211,74))
f=ImageFont.truetype(F,36); lab='HISTORIA COMPLETA'; w=d.textlength(lab,font=f)
x1=W-36-w-44; d.rounded_rectangle((x1,632,W-36,692),radius=30,fill=(255,74,106)); d.text((x1+22,640),lab,font=f,fill=(255,255,255))
im.convert('RGB').save('entregas/miniatura_tsunami_historia_completa.jpg',quality=92)

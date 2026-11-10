from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
F='/usr/share/fonts/opentype/inter/Inter-Black.otf'
src=Image.open('portadas/f_adultos1.png').convert('RGB').crop((0,200,1080,808)).resize((1280,720),Image.LANCZOS)
src=ImageEnhance.Brightness(src).enhance(1.2); src=ImageEnhance.Contrast(src).enhance(1.12); src=ImageEnhance.Color(src).enhance(1.15)
im=src.convert('RGBA')
# darken top-left for the text
g=Image.new('L',(1280,720),0); gd=ImageDraw.Draw(g)
for y in range(260): gd.line([(0,y),(1280,y)],fill=int(170*(1-y/260)))
im=Image.composite(Image.new('RGBA',(1280,720),(5,7,18,255)),im,g)
d=ImageDraw.Draw(im)
def t(x,y,s,f,col,sw=8): d.text((x,y),s,font=ImageFont.truetype(F,f),fill=col,stroke_width=sw,stroke_fill=(0,0,0))
t(36,26,'¿Y SI DESAPARECEN',78,(255,255,255))
t(36,112,'LOS ADULTOS?',96,(255,211,74))
f=ImageFont.truetype(F,36); lab='HISTORIA COMPLETA'; w=d.textlength(lab,font=f)
x1=1244-w-44; d.rounded_rectangle((x1,632,1244,692),radius=30,fill=(255,74,106)); d.text((x1+22,640),lab,font=f,fill=(255,255,255))
im.convert('RGB').save('entregas/miniatura_desaparecen_los_adultos_horizontal.jpg',quality=92)
im.convert('RGB').save('hz/thumb_chk.png')

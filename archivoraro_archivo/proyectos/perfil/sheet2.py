from PIL import Image, ImageDraw, ImageFont
import sys
ids=[int(x) for x in sys.argv[2].split(',')]; out=sys.argv[1]; cols=4
f=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf',30)
rows=(len(ids)+cols-1)//cols
W=Image.new('RGB',(cols*420,rows*600),'#f4f4f4'); d=ImageDraw.Draw(W)
for i,n in enumerate(ids):
    im=Image.open(f'idea_c_{n}.png').convert('RGB').resize((400,400),Image.LANCZOS)
    m=Image.new('L',(400,400),0); ImageDraw.Draw(m).ellipse((0,0,399,399),fill=255)
    x,y=10+(i%cols)*420,10+(i//cols)*600
    W.paste(im,(x,y),m); W.paste(im.resize((110,110),Image.LANCZOS),(x+145,y+420),m.resize((110,110)))
    d.text((x+200,y+560),str(n),font=f,fill='#222',anchor='mm')
W.save(out)

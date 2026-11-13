#!/bin/bash
# strip.sh nombre t1,t2,... → st_<nombre>.png (6 por fila, 360 px)
cd "$(dirname "$0")"; FAST=${FAST-1} node render.js preview "$2" > prev.log 2>&1; grep -m3 "PAGE ERROR\|Error" prev.log
python3 -I - "$1" "$2" <<'PY'
import sys
from PIL import Image
name, ts = sys.argv[1], [float(x) for x in sys.argv[2].split(',')]
ims=[Image.open('preview/p_%.2f.png'%t).convert('RGB').resize((360,640)) for t in ts]; cols=min(6,len(ims)); rows=(len(ims)+cols-1)//cols
o=Image.new('RGB',(cols*360,rows*640))
for i,im in enumerate(ims): o.paste(im,((i%cols)*360,(i//cols)*640))
o.save('st_%s.png'%name)
PY

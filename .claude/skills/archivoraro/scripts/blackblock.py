# python3 -I tools/blackblock.py <proyecto> [i0] [i1] — busca fotogramas con bloques NEGRO PURO (NaN del bloom) grandes
import sys, os
from PIL import Image
P = sys.argv[1]; fr = sorted(f for f in os.listdir(os.path.join(P, 'frames')) if f.endswith('.png'))
i0 = int(sys.argv[2]) if len(sys.argv) > 2 else 0; i1 = int(sys.argv[3]) if len(sys.argv) > 3 else len(fr)
bad = []
for f in fr[i0:i1]:
    im = Image.open(os.path.join(P, 'frames', f)).convert('RGB').resize((216, 384), Image.NEAREST)
    n = sum(1 for p in (im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()) if p[0] + p[1] + p[2] <= 6)
    if n > 150: bad.append((f, n))
print(len(fr[i0:i1]), 'fotogramas ·', len(bad), 'con bloque negro'); [print(*b) for b in bad]

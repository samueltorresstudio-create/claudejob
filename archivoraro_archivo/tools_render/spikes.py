# python3 -I tools/spikes.py <proyecto> [umbral]  — busca fotogramas SUELTOS que no se parecen ni al anterior ni al siguiente
# (fallo puntual de render: el 71 tuvo uno en 57,00 s con el suelo en primer plano). Marca i si d(i-1,i) y d(i,i+1) son altos
# pero d(i-1,i+1) es bajo (los vecinos se parecen entre sí y él no).
import sys, os
from PIL import Image
P = sys.argv[1]; TH = float(sys.argv[2]) if len(sys.argv) > 2 else 3.0
fr = sorted(f for f in os.listdir(os.path.join(P, 'frames')) if f.endswith('.png'))
def th(f): return list(Image.open(os.path.join(P, 'frames', f)).convert('L').resize((54, 96)).getdata())
def d(a, b): return sum(abs(x - y) for x, y in zip(a, b)) / len(a)
T = [th(f) for f in fr]; bad = []
for i in range(1, len(T) - 1):
    a, b, c = d(T[i - 1], T[i]), d(T[i], T[i + 1]), d(T[i - 1], T[i + 1])
    if min(a, b) > TH * max(c, 2.0): bad.append((fr[i], round(a, 1), round(b, 1), round(c, 1)))
print(len(fr), 'fotogramas ·', len(bad), 'sospechosos'); [print(*x) for x in bad]

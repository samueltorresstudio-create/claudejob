# Encuadre rápido sin renderizar: python3 frame.py 'cx,cy,cz' 'lx,ly,lz' fov  NOMBRE:x,y,z ...
# Imprime, por personaje (pies en x,y,z): pantalla de pies, del centro de la cabeza (y+1.84), ancho de cabeza en px y si sale de cuadro.
import sys, math
W, H = 1080, 1920
def v(s): return [float(a) for a in s.split(',')]
C, L, fov = v(sys.argv[1]), v(sys.argv[2]), float(sys.argv[3])
f = [L[i] - C[i] for i in range(3)]; n = math.sqrt(sum(a * a for a in f)); f = [a / n for a in f]
up = [0, 1, 0]
r = [f[1] * up[2] - f[2] * up[1], f[2] * up[0] - f[0] * up[2], f[0] * up[1] - f[1] * up[0]]; n = math.sqrt(sum(a * a for a in r)); r = [a / n for a in r]
u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]]
t = math.tan(math.radians(fov) / 2)
def P(p):
    d = [p[i] - C[i] for i in range(3)]; z = sum(d[i] * f[i] for i in range(3)); x = sum(d[i] * r[i] for i in range(3)); y = sum(d[i] * u[i] for i in range(3))
    if z <= .05: return None
    ppm = (H / 2) / (z * t)
    return (W / 2 + x * ppm, H / 2 - y * ppm, ppm, z)
for a in sys.argv[4:]:
    nm, p = a.split(':'); p = v(p); fp = P(p); hp = P([p[0], p[1] + 1.84, p[2]])
    if not fp or not hp: print(nm, 'detrás de cámara'); continue
    hw = .8 * hp[2]
    out = '' if (-hw / 2 < hp[0] < W + hw / 2 and hp[1] > -hw / 2) else '  << CABEZA FUERA'
    print(f'{nm:10s} pies({fp[0]:6.0f},{fp[1]:6.0f})  cabeza({hp[0]:6.0f},{hp[1]:6.0f})  cabeza={hw:5.0f}px  dist={fp[3]:.1f}{out}')

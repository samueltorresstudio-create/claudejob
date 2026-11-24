# 78 · La discoteca donde solo entran los feos — decorados de DIBUJO ANIMADO modelados en Blender → GLB → three.js.
# Nivel de las referencias (shorts_2026-11-24): textura en todo, mucho detalle de atrezo, luces de neón y focos.
# Coordenadas de three.js (x este, y arriba, z hacia la cámara); finish() las pasa a Blender (x, -z, y).
# Sitios: street (x=0) calle de noche con la fachada, el neón, la cola y el portero · dance (1000) pista con bola de espejos · aula (2000) pizarra del concepto.
import bpy, bmesh, math, random, json, os
from mathutils import Matrix, Vector
OUT = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)
rnd = random.Random(78)
MATS = {}
def mat(name, col):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    c = tuple(int(col[i:i + 2], 16) / 255 for i in (1, 3, 5))
    b.inputs['Base Color'].default_value = (*[x ** 2.2 for x in c], 1); b.inputs['Roughness'].default_value = 1.
    MATS[name] = m; return m
exec(open(os.path.join(OUT, 'obj_base.py')).read())
def grp(o, fn, Mx):
    before = set(o.bm.verts); fn(o); new = [v for v in o.bm.verts if v not in before]; bmesh.ops.transform(o.bm, matrix=Mx, verts=new)
def TR(x=0, y=0, z=0, ry=0.): return Matrix.Translation(Vector((x, y, z))) @ Matrix.Rotation(ry, 4, 'Y')

P = dict(
    white='#ffffff', cream='#fbf0d2', black='#22202a', iron='#3a3644', steel='#c9ced6', steeld='#8d94a3', gold='#ffc928', goldd='#d98e1c',
    red='#e3453a', redd='#a8242e', velvet='#c4162e', velvetd='#7e0d1f', purple='#7a4ad0', purpled='#4a2690', plum='#3a1a52', pink='#ff3fa0', cyan='#2fe8ff',
    yellow='#ffd96a', orange='#ff9a3c', green='#2f9a52', leaf='#3faf5a', wood='#a8703e', woodd='#6a4426', concrete='#b9b4ac', curb='#d8d3c8',
    lamp='#fff2c0', lampwarm='#ffd98a', neonP='#ff4fb8', neonC='#4ff0ff', neonY='#ffe45a', glass='#9fd8ff', bottleG='#3fbf6a', bottleA='#e8962a', bottleB='#4f7fe8', bottleR='#d8344a',
    rubber='#2a2630', hydrant='#d8342c', bin='#3f6a4a', bag='#1f1c24', chalk='#f4f2ea', skin='#f4d9b4', paper='#f7f0d8',
)
M = {k: mat(k, v) for k, v in P.items()}
PAINT = ['poster2', 'asphalt', 'sidewalk', 'brick', 'brick2', 'plaster', 'shutter', 'shopwin', 'win', 'neon', 'doorglass', 'puddle', 'ledfloor', 'woodfloor', 'wallclub',
         'ceilclub', 'speaker', 'barmirror', 'board', 'parquet', 'wallcream', 'poster', 'books', 'list', 'cabinet']
for n in PAINT: M[n] = mat(n, '#ffffff')

def lamp_post(o, x, z, ry=0.):
    def f(q):
        q.cyl((0, 0, 0), (0, .25, 0), .2, M['iron'], 10); q.cyl((0, .25, 0), (0, 5.2, 0), .08, M['iron'], 8)
        q.cyl((0, 5.0, 0), (.9, 5.4, 0), .05, M['iron'], 6); q.box((1.05, 5.35, 0), (.7, .22, .42), M['iron']); q.box((1.05, 5.22, 0), (.6, .08, .34), M['lampwarm'])
        for k in range(4): q.torus((0, 1.2 + k * .9, 0), .1, .025, M['iron'], 10)
    grp(o, f, TR(x, .15, z, ry))
def stanchion(o, x, z):
    o.cyl((x, .15, z), (x, .19, z), .22, M['gold'], 14); o.cyl((x, .19, z), (x, 1.05, z), .05, M['gold'], 8); o.sph((x, 1.1, z), .09, M['gold'], seg=10, rings=6)
def rope(o, a, b, sag=.22):
    ax, az = a; bx, bz = b; pts = []
    for k in range(7):
        t = k / 6; pts.append((ax + (bx - ax) * t, 1.0 - sag * math.sin(math.pi * t), az + (bz - az) * t))
    for k in range(6): o.cyl(pts[k], pts[k + 1], .045, M['velvet'], 8)
def bottle(o, x, y, z, m, h=.34):
    o.cyl((x, y, z), (x, y + h * .62, z), .06, M[m], 8); o.cyl((x, y + h * .62, z), (x, y + h * .78, z), .06, M[m], 8, r1=.022); o.cyl((x, y + h * .78, z), (x, y + h, z), .022, M[m], 6); o.cyl((x, y + h, z), (x, y + h + .03, z), .026, M['gold'], 6)
def bulbs_row(o, x0, x1, y, z, n):
    for k in range(n): o.sph((x0 + (x1 - x0) * k / (n - 1), y, z), .085, M['lamp'], seg=8, rings=5)

# ================================================= CALLE (x = 0) =================================================
SX = 0.
SF = Obj('street_floor')
SF.box((SX, -.1, 6), (70, .2, 12), M['asphalt'])                 # calzada
SF.box((SX, .075, -4.5), (70, .15, 9), M['sidewalk'])             # acera
SF.box((SX, .08, 0), (70, .17, .32), M['curb'])                    # bordillo
SF.box((SX, .08, 12.2), (70, .17, .32), M['curb']); SF.box((SX, .075, 14.5), (70, .15, 4.4), M['sidewalk'])
SF.finish(origin=(SX, 0, 0))
ST = Obj('street')
# fachada de la discoteca: ladrillo oscuro, zócalo de piedra, cornisa, ventanas arriba
ST.box((SX, 4.75, -9.25), (18, 9.5, .5), M['brick']); ST.box((SX, .6, -8.9), (18.2, 1.2, .25), M['concrete'])
ST.box((SX, 9.6, -9.0), (18.6, .35, .9), M['concrete']); ST.box((SX, 9.9, -9.1), (18.2, .25, .6), M['iron'])
for k in range(5):
    x = SX - 7.2 + k * 3.6
    if abs(x - SX) < 2.5: continue
    ST.box((x, 7.7, -8.98), (1.6, 1.9, .1), M['win']); ST.box((x, 7.7, -8.95), (1.8, 2.1, .06), M['iron']); ST.box((x, 6.65, -8.8), (2.0, .14, .4), M['concrete'])
# entrada: marco, puertas de cristal, escalón, marquesina con bombillas
ST.box((SX, 1.8, -8.88), (3.6, 3.6, .3), M['black']); ST.box((SX, 1.75, -8.78), (3.0, 3.3, .08), M['doorglass'])
ST.box((SX, 1.75, -8.72), (.08, 3.3, .1), M['iron']); ST.cyl((SX - .25, 1.0, -8.65), (SX - .25, 2.4, -8.65), .035, M['gold'], 6); ST.cyl((SX + .25, 1.0, -8.65), (SX + .25, 2.4, -8.65), .035, M['gold'], 6)
ST.box((SX, .2, -8.3), (4.2, .1, 1.2), M['concrete'])
ST.box((SX, 4.0, -7.7), (6.4, .45, 2.6), M['black']); ST.box((SX, 4.28, -7.7), (6.6, .12, 2.8), M['gold']); ST.box((SX, 3.77, -6.4), (6.6, .18, .12), M['gold'])
bulbs_row(ST, SX - 3.1, SX + 3.1, 3.7, -6.38, 15); bulbs_row(ST, SX - 3.1, SX + 3.1, 4.36, -6.38, 15)
for sd in (-1, 1): ST.box((SX + sd * 3.25, 4.0, -7.7), (.12, .5, 2.6), M['gold'])
# letrero de neón (el texto se pinta en three.js) con caja y soportes
ST.box((SX, 6.35, -8.85), (8.2, 2.4, .2), M['black']); ST.box((SX, 6.35, -8.72), (7.8, 2.0, .06), M['neon'])
for sd in (-1, 1): ST.cyl((SX + sd * 3.6, 7.5, -8.9), (SX + sd * 3.6, 7.5, -8.6), .05, M['iron'], 6)
# focos del cartel
for sd in (-1, 1): ST.cyl((SX + sd * 2.5, 9.2, -8.95), (SX + sd * 2.5, 8.9, -8.4), .14, M['iron'], 10)
# alfombra roja, postes con cordón y la cola a la izquierda
ST.box((SX, .19, -5.2), (2.4, .04, 6.0), M['velvet']); ST.box((SX, .2, -5.2), (2.0, .04, 6.0), M['velvetd'])
for z in (-7.6, -5.4, -3.2): stanchion(ST, SX + 1.5, z)
for (a, b) in [((SX + 1.5, -7.6), (SX + 1.5, -5.4)), ((SX + 1.5, -5.4), (SX + 1.5, -3.2))]: rope(ST, a, b)
QX = [SX - 1.6 - k * 2.1 for k in range(7)]
for x in QX: stanchion(ST, x, -6.0); stanchion(ST, x, -3.6)
for k in range(len(QX) - 1): rope(ST, (QX[k], -6.0), (QX[k + 1], -6.0)); rope(ST, (QX[k], -3.6), (QX[k + 1], -3.6))
# atril del portero con la lista
ST.box((SX + 2.4, .75, -7.2), (.55, 1.2, .45), M['black']); ST.box((SX + 2.4, 1.42, -7.12), (.7, .1, .62), M['gold']); ST.box((SX + 2.4, 1.48, -7.1), (.5, .02, .4), M['list'])
ST.sph((SX + 2.6, 1.55, -7.0), .05, M['lampwarm'], seg=6, rings=4)
# vecinos: panadería cerrada (persiana) a la izquierda y un local de kebab abierto a la derecha
ST.box((SX - 18.5, 4.5, -9.3), (19, 9, .5), M['brick2']); ST.box((SX - 14, 1.7, -9.0), (5.2, 3.0, .1), M['shutter']); ST.box((SX - 14, 3.4, -8.9), (5.6, .5, .3), M['red'])
ST.box((SX - 21, 1.6, -9.0), (2.0, 3.0, .1), M['doorglass']); ST.box((SX - 21, 3.2, -8.95), (2.3, .2, .2), M['iron'])
for k in range(4):
    x = SX - 25 + k * 4.2
    for y in (5.8, 8.2): ST.box((x, y, -9.0), (1.5, 1.7, .1), M['win']); ST.box((x, y - .95, -8.85), (1.8, .12, .35), M['concrete'])
ST.box((SX + 18.5, 4.2, -9.3), (19, 8.4, .5), M['plaster']); ST.box((SX + 13.5, 1.8, -9.0), (5.0, 2.8, .1), M['shopwin']); ST.box((SX + 13.5, 3.5, -8.8), (5.4, .6, .5), M['neonY'])
ST.box((SX + 13.5, 3.8, -8.4), (5.6, .1, 1.4), M['red'])
for k in range(5):
    x = SX + 11 + k * 4
    for y in (5.6, 7.6): ST.box((x, y, -9.0), (1.4, 1.5, .1), M['win']); ST.box((x, y - .85, -8.85), (1.6, .1, .3), M['concrete'])
# canalón y escalera de incendios a la derecha de la fachada
ST.cyl((SX + 8.85, 0, -8.9), (SX + 8.85, 9.6, -8.9), .09, M['iron'], 8)
for y in (3.2, 6.2):
    ST.box((SX + 6.5, y, -8.2), (3.2, .1, 1.6), M['iron'])
    for k in range(9): ST.cyl((SX + 5.0 + k * .37, y, -7.45), (SX + 5.0 + k * .37, y + .9, -7.45), .02, M['iron'], 4)
    ST.cyl((SX + 4.9, y + .9, -7.45), (SX + 8.1, y + .9, -7.45), .03, M['iron'], 4)
# mobiliario urbano: farolas, boca de incendios, papelera, bolsas, bici, alcantarilla
for x in (SX - 9, SX + 9, SX - 26, SX + 26): lamp_post(ST, x, -.6, 0 if x < SX else math.pi)
ST.cyl((SX + 5.5, .15, -.8), (SX + 5.5, .9, -.8), .17, M['hydrant'], 10); ST.sph((SX + 5.5, .95, -.8), .17, M['hydrant'], seg=10, rings=6); ST.cyl((SX + 5.2, .65, -.8), (SX + 5.8, .65, -.8), .07, M['hydrant'], 6)
ST.cyl((SX - 6, .15, -1.0), (SX - 6, 1.1, -1.0), .32, M['bin'], 12); ST.cyl((SX - 6, 1.1, -1.0), (SX - 6, 1.16, -1.0), .36, M['iron'], 12)
for (x, z, r) in [(SX - 6.8, -1.4, .38), (SX - 7.3, -.9, .3), (SX - 5.3, -1.6, .33)]: ST.sph((x, .15 + r * .8, z), r, M['bag'], sc=(1, .85, 1), seg=10, rings=6)
for k in range(4): ST.cyl((SX + 10.5 + k * .5, .15, -1.3), (SX + 10.5 + k * .5, .8, -1.3), .03, M['steel'], 4)
ST.cyl((SX + 10.5, .8, -1.3), (SX + 12, .8, -1.3), .03, M['steel'], 4)
ST.cyl((SX - 3, .0, 5), (SX - 3, .02, 5), .45, M['iron'], 16)
# coches aparcados NO (sin vehículos protagonistas); cartel de cola pintado en un poste
ST.cyl((SX - 15.5, .15, -4.8), (SX - 15.5, 2.0, -4.8), .04, M['iron'], 6); ST.box((SX - 15.5, 2.15, -4.8), (1.3, .7, .06), M['poster'])
# edificio de enfrente (para planos inversos)
ST.box((SX, 5, 17.2), (70, 10, .5), M['brick2'])
for k in range(12):
    x = SX - 27 + k * 5
    for y in (2.2, 5.4, 8.2): ST.box((x, y, 16.9), (1.6, 1.8, .1), M['win'])

# --- más atrezo en la calle (nivel de las referencias) ---
for sd in (-1, 1):   # jardineras con arbusto a los lados de la puerta
    x = SX + sd * 2.9
    ST.box((x, .55, -8.3), (1.0, .8, .8), M['black']); ST.box((x, .97, -8.3), (1.06, .06, .86), M['gold'])
    for (dx, dy, r) in [(0, 1.45, .45), (-.28, 1.25, .32), (.3, 1.3, .34), (.05, 1.8, .3)]: ST.sph((x + dx, dy, -8.3), r, M['leaf'], seg=10, rings=7)
for (x, m) in [(SX - 5.6, 'poster'), (SX + 5.6, 'poster2'), (SX - 8.0, 'poster2')]:   # carteles en la pared
    ST.box((x, 2.4, -8.98), (1.5, 2.1, .04), M[m]); ST.box((x, 2.4, -9.0), (1.6, 2.2, .02), M['black'])
for (x, y) in [(SX - 6.5, 8.3), (SX + 4.2, 8.6), (SX - 16, 6.8), (SX + 15, 6.4)]:   # aparatos de aire acondicionado
    ST.box((x, y, -8.7), (1.0, .7, .5), M['steel']); ST.box((x - .1, y, -8.44), (.6, .55, .02), M['iron']); ST.cyl((x + .4, y - .35, -8.6), (x + .4, y - 1.2, -8.6), .02, M['iron'], 4)
# guirnaldas de bombillas desde la fachada hasta las farolas, por encima de la cola
for (x0, x1) in [(SX - 2.2, SX - 7.95), (SX - 4, SX - 7.95)]:
    pts = []
    for k in range(13):
        t = k / 12; x = x0 + (x1 - x0) * t; y = 4.7 - 1.2 * math.sin(math.pi * t) + (5.2 - 4.7) * t; z = -8.9 + (-.6 + 8.9) * t
        pts.append((x, y, z))
    for k in range(12): ST.cyl(pts[k], pts[k + 1], .012, M['iron'], 4)
    for k in range(1, 12, 1): ST.sph((pts[k][0], pts[k][1] - .08, pts[k][2]), .07, M['lamp'], seg=8, rings=5)
# cables entre fachadas (arriba) y una señal de prohibido aparcar
for k in range(3): ST.cyl((SX - 30, 9.3 - k * .3, -9 + k * .2), (SX + 30, 9.1 - k * .25, 16.9), .018, M['iron'], 4)
ST.cyl((SX + 7.5, .15, -.5), (SX + 7.5, 2.6, -.5), .04, M['iron'], 6); ST.cyl((SX + 7.5, 2.75, -.5), (SX + 7.5, 2.75, -.45), .32, M['red'], 20); ST.cyl((SX + 7.5, 2.75, -.44), (SX + 7.5, 2.75, -.42), .24, M['blue'] if 'blue' in M else M['cyan'], 20)
# bolardos en el bordillo
for x in (SX - 3, SX + 3, SX - 12, SX + 12): ST.cyl((x, .15, -.4), (x, .9, -.4), .09, M['iron'], 10); ST.sph((x, .9, -.4), .09, M['iron'], seg=8, rings=5)
ST.finish(origin=(SX, 0, 0))

# ================================================= PISTA (x = 1000) =================================================
DX = 1000.
DF = Obj('dance_floor')
DF.box((DX, -.1, -4), (30, .2, 26), M['woodfloor'])
DF.box((DX, .03, -4.5), (9, .06, 9), M['ledfloor'])

DF.finish(origin=(DX, 0, 0))
D = Obj('dance')
# paredes, techo, zócalos
D.box((DX, 4.5, -14.25), (30, 9, .5), M['wallclub']); D.box((DX - 14.75, 4.5, -4), (.5, 9, 21), M['wallclub']); D.box((DX + 14.75, 4.5, -4), (.5, 9, 21), M['wallclub'])
D.box((DX, 4.5, 6.75), (30, 9, .5), M['wallclub'])
D.box((DX, 9.1, -4), (30, .3, 21.5), M['ceilclub'])
for (c, s) in [((DX, .25, -13.95), (30, .5, .12)), ((DX - 14.45, .25, -4), (.12, .5, 21)), ((DX + 14.45, .25, -4), (.12, .5, 21))]: D.box(c, s, M['black'])
# marco de la pista (escalón de metal con tira de luz)
for (c, s) in [((DX, .08, -9.1), (9.5, .16, .3)), ((DX, .08, .1), (9.5, .16, .3)), ((DX - 4.65, .08, -4.5), (.3, .16, 9.5)), ((DX + 4.65, .08, -4.5), (.3, .16, 9.5))]: D.box(c, s, M['steel'])
for (c, s) in [((DX, .17, -8.92), (9.0, .04, .06)), ((DX, .17, -.08), (9.0, .04, .06)), ((DX - 4.47, .17, -4.5), (.06, .04, 9.0)), ((DX + 4.47, .17, -4.5), (.06, .04, 9.0))]: D.box(c, s, M['neonC'])
# estructura de focos (truss) sobre la pista, con focos móviles colgados
def truss(o, a, b, y):
    ax, az = a; bx, bz = b; L = math.hypot(bx - ax, bz - az); n = max(2, int(L / .6))
    for dy in (0, .4):
        for dd in (-.2, .2):
            ox, oz = (0, dd) if abs(bz - az) < 1e-6 else (dd, 0)
            o.cyl((ax + ox, y + dy, az + oz), (bx + ox, y + dy, bz + oz), .035, M['steel'], 6)
    for k in range(n + 1):
        t = k / n; x = ax + (bx - ax) * t; z = az + (bz - az) * t; ox, oz = (0, .2) if abs(bz - az) < 1e-6 else (.2, 0)
        o.cyl((x - ox, y, z - oz), (x + ox, y + .4, z + oz), .02, M['steel'], 4); o.cyl((x + ox, y, z + oz), (x - ox, y + .4, z - oz), .02, M['steel'], 4)
TY = 6.6
for (a, b) in [((DX - 5, -9.5), (DX + 5, -9.5)), ((DX - 5, .5), (DX + 5, .5)), ((DX - 5, -9.5), (DX - 5, .5)), ((DX + 5, -9.5), (DX + 5, .5))]: truss(D, a, b, TY)
for (x, z) in [(DX - 5, -9.5), (DX + 5, -9.5), (DX - 5, .5), (DX + 5, .5)]: D.cyl((x, TY + .4, z), (x, 9.0, z), .05, M['steel'], 6)
SPOTS = []
for k in range(6):
    x = DX - 4 + k * 1.6
    for z in (-9.5, .5):
        D.cyl((x, TY - .05, z), (x, TY - .25, z), .03, M['iron'], 4); D.box((x, TY - .35, z), (.18, .3, .18), M['iron'])
        D.cyl((x, TY - .45, z), (x, TY - .85, z + (.25 if z < 0 else -.25)), .17, M['black'], 10, r1=.2); SPOTS.append((x, TY - .85, z))
# bola de espejos con cadena
D.cyl((DX, 9.0, -4.5), (DX, 6.0, -4.5), .025, M['steel'], 4); D.ico((DX, 5.3, -4.5), .75, M['steeld'], sub=3)
# cabina del DJ al fondo: tarima, mesa, platos, altavoces apilados, pantalla de luz detrás
D.box((DX, .3, -12.6), (7, .6, 3), M['black']); D.box((DX, 1.15, -11.6), (4.4, 1.1, 1.0), M['black']); D.box((DX, 1.0, -11.08), (4.2, .08, .06), M['neonP']); D.box((DX, 1.5, -11.08), (4.2, .08, .06), M['neonC'])
D.box((DX, 1.72, -11.7), (4.6, .06, 1.2), M['iron'])
for sd in (-1, 1): D.cyl((DX + sd * 1.2, 1.75, -11.7), (DX + sd * 1.2, 1.8, -11.7), .36, M['rubber'], 20); D.cyl((DX + sd * 1.2, 1.8, -11.7), (DX + sd * 1.2, 1.83, -11.7), .06, M['steel'], 8)
D.box((DX, 1.8, -11.8), (.7, .1, .45), M['iron'])
for sd in (-1, 1):
    for k in range(3): D.box((DX + sd * 4.6, .7 + k * 1.3, -12.6), (1.3, 1.25, 1.1), M['speaker'])
D.box((DX, 5.0, -13.9), (9, 4.5, .1), M['poster'])
# columnas con tiras de luz
for (x, z) in [(DX - 8.5, -11), (DX + 8.5, -11), (DX - 8.5, 1.5), (DX + 8.5, 1.5)]:
    D.cyl((x, 0, z), (x, 9, z), .42, M['black'], 14)
    for a in range(4): D.box((x + math.cos(a * 1.571) * .42, 4.5, z + math.sin(a * 1.571) * .42), (.06, 8.6, .06), M['neonP' if a % 2 else 'neonC'])
# barra a la derecha: mostrador, encimera, tira de luz, taburetes, estantes con botellas y espejo
BX = DX + 12.2
D.box((BX, .6, -4), (1.3, 1.2, 12), M['wood']); D.box((BX - .15, 1.24, -4), (1.7, .1, 12.2), M['black']); D.box((BX - .68, .25, -4), (.06, .06, 12), M['neonP'])
for k in range(12): D.box((BX - .66, .7, -9.5 + k * 1.0), (.04, 1.0, .05), M['woodd'])
for k in range(7):
    z = -9.5 + k * 1.6; D.cyl((BX - 1.4, 0, z), (BX - 1.4, .85, z), .05, M['steel'], 6); D.cyl((BX - 1.4, .85, z), (BX - 1.4, .95, z), .28, M['velvet'], 14); D.torus((BX - 1.4, .35, z), .2, .02, M['steel'], 12)
D.box((DX + 14.45, 2.6, -4), (.1, 2.2, 11), M['barmirror'])
for y in (1.6, 2.6, 3.6):
    D.box((DX + 14.2, y, -4), (.5, .07, 11.5), M['gold'])
    for k in range(26): bottle(D, DX + 14.2, y + .04, -9.4 + k * .43, ['bottleG', 'bottleA', 'bottleB', 'bottleR'][(k + int(y * 10)) % 4], .3 + (k % 3) * .06)
# sofás de terciopelo a la izquierda con mesitas
for (z, ry) in [(-9.5, 0), (-4, 0), (1.5, 0)]:
    x = DX - 13.2
    D.box((x, .45, z), (1.3, .5, 3.4), M['purple']); D.box((x - .5, 1.0, z), (.35, 1.1, 3.4), M['purpled'])
    for sd in (-1, 1): D.box((x, .75, z + sd * 1.6), (1.3, .6, .3), M['purpled'])
    for k in range(3): D.sph((x - .15, .8, z - 1.05 + k * 1.05), .28, M['purpled'], sc=(1, .6, 1.4), seg=10, rings=6)
    D.cyl((x + 1.7, 0, z), (x + 1.7, .55, z), .08, M['gold'], 8); D.cyl((x + 1.7, .55, z), (x + 1.7, .6, z), .5, M['black'], 18)
    D.cyl((x + 1.7, .6, z), (x + 1.7, .75, z), .07, M['lampwarm'], 8)
# tubos de neón en zigzag en las paredes
for (x0, z0, ax) in [(DX - 14.45, -4, 'z'), (DX, -13.95, 'x')]:
    pts = [(-4 + k, 6.6 + (.5 if k % 2 else -.5)) for k in range(9)]
    for k in range(8):
        (u0, y0), (u1, y1) = pts[k], pts[k + 1]
        if ax == 'z': D.cyl((x0 + .1, y0, z0 + u0), (x0 + .1, y1, z0 + u1), .06, M['neonC' if ax == 'z' else 'neonP'], 8)
        else: D.cyl((x0 + u0 * 1.4 + 6, y0 + 1.0, z0 + .1), (x0 + u1 * 1.4 + 6, y1 + 1.0, z0 + .1), .06, M['neonP'], 8)
# puerta de cristal por dentro (para el reflejo del portero) en la pared delantera
D.box((DX, 1.8, 6.45), (3.6, 3.6, .3), M['black']); D.box((DX, 1.75, 6.35), (3.0, 3.3, .08), M['doorglass'])
D.finish(origin=(DX, 0, 0))

# ================================================= AULA (x = 2000) =================================================
AX = 2000.
AF = Obj('aula_floor'); AF.box((AX, -.1, 0), (16, .2, 16), M['parquet']); AF.finish(origin=(AX, 0, 0))
AU = Obj('aula')
AU.box((AX, 3.5, -6.25), (16, 7, .5), M['wallcream']); AU.box((AX - 7.75, 3.5, 0), (.5, 7, 12), M['wallcream']); AU.box((AX + 7.75, 3.5, 0), (.5, 7, 12), M['wallcream'])
AU.box((AX, .5, -5.9), (16, 1.0, .2), M['wood'])
AU.box((AX, 3.3, -5.95), (7.6, 3.6, .15), M['woodd']); AU.box((AX, 3.3, -5.85), (7.2, 3.2, .06), M['board']); AU.box((AX, 1.45, -5.7), (7.4, .1, .35), M['woodd'])
for k in range(5): AU.box((AX - 2.4 + k * .3, 1.53, -5.65), (.18, .05, .05), M['chalk'])
AU.box((AX - .8, 1.53, -5.62), (.5, .1, .14), M['wood'])
AU.box((AX + 1.4, .8, -2.6), (3.2, .1, 1.4), M['wood'])
for sx in (-1, 1):
    for sz in (-1, 1): AU.box((AX + 1.4 + sx * 1.45, .4, -2.6 + sz * .55), (.1, .8, .1), M['woodd'])
AU.box((AX + .6, .9, -2.6), (.5, .1, .7), M['paper']); AU.cyl((AX + 2.4, .85, -2.4), (AX + 2.4, 1.05, -2.4), .1, M['red'], 10)
for y in (1.0, 2.2, 3.4, 4.6):
    AU.box((AX - 6.0, y, -5.7), (2.6, .08, .6), M['wood']); AU.box((AX - 6.0, y + .45, -5.75), (2.4, .8, .45), M['books'])
AU.box((AX - 6.0, 2.8, -5.7), (2.8, 4.6, .1), M['woodd'])
AU.box((AX + 5.8, 3.6, -5.95), (2.4, 2.4, .1), M['win']); AU.box((AX + 5.8, 3.6, -5.9), (2.6, 2.6, .06), M['wood']); AU.box((AX + 5.8, 2.35, -5.75), (2.8, .12, .4), M['wood'])
AU.cyl((AX + 1.4, 7, -2.6), (AX + 1.4, 5.6, -2.6), .02, M['iron'], 4); AU.cyl((AX + 1.4, 5.6, -2.6), (AX + 1.4, 5.1, -2.6), .45, M['green'], 14, r1=.12); AU.sph((AX + 1.4, 5.15, -2.6), .16, M['lamp'], seg=8, rings=5)
AU.finish(origin=(AX, 0, 0))

lay = dict(sites=dict(street=[SX, 0], dance=[DX, 0], aula=[AX, 0]), spots=SPOTS, ball=[DX, 5.3, -4.5], queue=QX)
json.dump(lay, open(os.path.join(OUT, 'layout.json'), 'w'))
kw = dict(filepath=os.path.join(OUT, 'disco.glb'), export_format='GLB', export_apply=True)
try: bpy.ops.export_scene.gltf(**kw, export_vertex_color='ACTIVE', export_all_vertex_colors=False)
except TypeError: bpy.ops.export_scene.gltf(**kw)
print('EXPORT_OK')

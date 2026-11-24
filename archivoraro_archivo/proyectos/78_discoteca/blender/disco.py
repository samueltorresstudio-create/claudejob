# 78 · La discoteca donde solo entran los feos — decorados v3 A ESCALA REAL (puerta 2,25 m, techos 3–3,4 m) con bordes redondeados,
# como las referencias (ESCENARIOS_referencias.md). Coordenadas de three.js (x este, y arriba, z hacia la cámara).
# Sitios: street (x=0) calle de noche · dance (1000) pista · aula (2000) pizarra.
import bpy, bmesh, math, random, json, os
from mathutils import Matrix, Vector
OUT = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)
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
def OB(name, bev=.02): o = Obj(name); o.bev = bev; return o

P = dict(
    white='#ffffff', cream='#efe6d2', black='#26222c', iron='#3a3644', steel='#c9ced6', steeld='#8d94a3', gold='#e8b54a', goldd='#b8862a',
    red='#c8342c', velvet='#b0162a', velvetd='#6e0d1c', purple='#5a3a8a', purpled='#3a2460', pink='#ff3fa0', cyan='#2fe8ff', blue='#2c5fa8',
    wood='#8a5a34', woodd='#5a3a22', woodl='#b88a58', concrete='#8e8a84', curb='#a8a39a', leaf='#2f7a3a', leafd='#1f5a2a', pot='#6a4a3a',
    lamp='#fff2c0', lampwarm='#ffd98a', neonP='#ff4fb8', neonC='#4ff0ff', neonY='#ffe45a', bottleG='#3a9a5a', bottleA='#c8822a', bottleB='#3a6ac8', bottleR='#b8344a',
    rubber='#2a2630', hydrant='#c8342c', bin='#2f5a3e', bag='#1f1c24', chalk='#f4f2ea', paper='#f7f0d8', awning='#7a1a2a', green='#2f8a52',
)
M = {k: mat(k, v) for k, v in P.items()}
PAINT = ['asphalt', 'sidewalk', 'brick', 'brick2', 'plaster', 'shutter', 'shopwin', 'win', 'neon', 'doorglass', 'ledfloor', 'woodfloor', 'wallclub',
         'ceilclub', 'speaker', 'barmirror', 'board', 'parquet', 'wallcream', 'poster', 'poster2', 'books', 'list', 'menu']
for n in PAINT: M[n] = mat(n, '#ffffff')

def bush(o, x, y, z, r=.45, n=9):
    for k in range(n):
        a = k * 2.399; rr = r * (.35 + .55 * ((k * .618) % 1)); o.sph((x + math.cos(a) * rr * .9, y + r * .55 + (k % 3) * r * .22, z + math.sin(a) * rr * .6), r * (.42 + .1 * (k % 2)), M['leaf' if k % 3 else 'leafd'], seg=12, rings=8)
def planter(o, x, z, w=.9):
    o.box((x, .35, z), (w, .55, .55), M['black']); o.box((x, .64, z), (w + .06, .05, .61), M['steeld']); bush(o, x, .65, z, .4, 10)
def lamp_post(o, x, z, ry=0.):
    def f(q):
        q.cyl((0, 0, 0), (0, .3, 0), .14, M['iron'], 16); q.cyl((0, .3, 0), (0, 4.0, 0), .06, M['iron'], 12)
        q.cyl((0, 3.9, 0), (.65, 4.15, 0), .04, M['iron'], 8); q.cyl((.75, 4.2, 0), (.75, 4.02, 0), .22, M['iron'], 16, r1=.12); q.sph((.75, 4.0, 0), .1, M['lampwarm'], seg=12, rings=8)
    grp(o, f, TR(x, .15, z, ry))
def stanchion(o, x, z):
    o.cyl((x, .15, z), (x, .18, z), .17, M['gold'], 20); o.cyl((x, .18, z), (x, 1.0, z), .035, M['gold'], 12); o.sph((x, 1.04, z), .065, M['gold'], seg=14, rings=10)
def rope(o, a, b, sag=.16):
    ax, az = a; bx, bz = b; pts = [(ax + (bx - ax) * k / 8, .97 - sag * math.sin(math.pi * k / 8), az + (bz - az) * k / 8) for k in range(9)]
    for k in range(8): o.cyl(pts[k], pts[k + 1], .03, M['velvet'], 10)
def bottle(o, x, y, z, m, h=.3):
    o.cyl((x, y, z), (x, y + h * .62, z), .045, M[m], 10); o.cyl((x, y + h * .62, z), (x, y + h * .78, z), .045, M[m], 10, r1=.017); o.cyl((x, y + h * .78, z), (x, y + h, z), .017, M[m], 8); o.cyl((x, y + h, z), (x, y + h + .02, z), .02, M['gold'], 8)
def window(o, x, y, z, w=1.1, h=1.4):
    o.box((x, y, z), (w, h, .08), M['win']); o.box((x, y, z - .03), (w + .12, h + .12, .06), M['black']); o.box((x, y - h / 2 - .08, z + .1), (w + .2, .07, .22), M['concrete'])
    o.box((x, y, z + .05), (.04, h, .04), M['black']); o.box((x, y + .15, z + .05), (w, .04, .04), M['black'])
def bike(o, x, z):
    for dx in (-.5, .5): o.torus((x + dx, .48, z), .32, .025, M['rubber'], 24, axis='Z')
    for a, b in [((x - .5, .48), (x, .5)), ((x, .5), (x + .5, .48)), ((x, .5), (x - .15, .9)), ((x - .15, .9), (x + .35, .92)), ((x + .35, .92), (x + .5, .48))]: o.cyl((a[0], a[1], z), (b[0], b[1], z), .02, M['red'], 6)
    o.box((x - .2, .95, z), (.22, .05, .1), M['black']); o.cyl((x + .35, .92, z), (x + .38, 1.05, z), .02, M['iron'], 6); o.cyl((x + .38, 1.05, z - .25), (x + .38, 1.05, z + .25), .015, M['iron'], 6)

# ================================================= CALLE (x = 0) =================================================
SX = 0.
SF = OB('street_floor', 0)
SF.box((SX, -.1, 6), (60, .2, 12), M['asphalt']); SF.box((SX, .075, -3.2), (60, .15, 6.4), M['sidewalk']); SF.box((SX, .07, 12.5), (60, .14, 1.0), M['sidewalk'])
SF.finish(origin=(SX, 0, 0))
ST = OB('street', .012)
ST.box((SX, .08, 0), (60, .16, .25), M['curb'])
ST.box((SX, 3.6, -6.6), (11, 7.2, .4), M['brick']); ST.box((SX, .35, -6.35), (11, .7, .12), M['concrete'])
ST.box((SX, 3.45, -6.3), (11.2, .18, .35), M['concrete']); ST.box((SX, 7.25, -6.3), (11.4, .22, .5), M['concrete'])
for x in (SX - 3.6, SX - 1.2, SX + 1.2, SX + 3.6):
    (window(ST, x, 4.6, -6.35, 1.0, 1.3) if abs(x) > 2 else None); window(ST, x, 6.3, -6.35, 1.0, 1.1)
    if x in (SX - 3.6, SX + 3.6):
        ST.box((x, 4.0, -6.0), (1.2, .08, .45), M['iron'])
        for k in range(11): ST.cyl((x - .55 + k * .11, 4.04, -5.8), (x - .55 + k * .11, 4.5, -5.8), .012, M['iron'], 6)
        ST.cyl((x - .6, 4.5, -5.8), (x + .6, 4.5, -5.8), .02, M['iron'], 6)
# entrada: marco, doble puerta acristalada de 2,25 m, escalón
ST.box((SX, 1.25, -6.38), (2.3, 2.5, .2), M['black']); ST.box((SX, 1.17, -6.3), (1.8, 2.25, .06), M['doorglass'])
ST.box((SX, 1.17, -6.26), (.05, 2.25, .06), M['black']); ST.cyl((SX - .18, .8, -6.2), (SX - .18, 1.5, -6.2), .022, M['gold'], 10); ST.cyl((SX + .18, .8, -6.2), (SX + .18, 1.5, -6.2), .022, M['gold'], 10)
ST.box((SX, .19, -6.0), (2.6, .08, .7), M['concrete'])
# toldo de lona burdeos con faldón y bombillas
ST.box((SX, 2.85, -5.4), (3.6, .1, 2.0), M['awning']); ST.box((SX, 2.72, -4.42), (3.6, .28, .05), M['awning']); ST.box((SX, 2.92, -5.4), (3.7, .06, 2.1), M['goldd'])
for k in range(9): ST.sph((SX - 1.6 + k * .4, 2.56, -4.38), .055, M['lamp'], seg=10, rings=6)
for sd in (-1, 1): ST.cyl((SX + sd * 1.75, 2.85, -4.45), (SX + sd * 1.75, 3.45, -6.3), .025, M['iron'], 8)
# letrero de neón sobre la puerta (en el ladrillo, entre la planta baja y la primera)
ST.box((SX, 4.45, -6.36), (3.4, .95, .06), M['neon']); ST.box((SX, 4.45, -6.4), (3.55, 1.1, .05), M['black'])
# alfombra roja, postes con cordón y la cola a la izquierda
ST.box((SX, .17, -4.9), (1.5, .03, 2.4), M['velvet'])
for z in (-5.6, -4.3): stanchion(ST, SX + .95, z)
rope(ST, (SX + .95, -5.6), (SX + .95, -4.3))
QX = [SX - .95 - k * 1.6 for k in range(6)]
for x in QX: stanchion(ST, x, -4.9)
for k in range(len(QX) - 1): rope(ST, (QX[k], -4.9), (QX[k + 1], -4.9))
# atril del portero
ST.box((SX + 1.55, .65, -5.6), (.45, 1.0, .38), M['black']); ST.box((SX + 1.55, 1.18, -5.55), (.56, .06, .5), M['goldd']); ST.box((SX + 1.55, 1.22, -5.53), (.4, .02, .32), M['list'])
ST.cyl((SX + 1.75, 1.2, -5.7), (SX + 1.75, 1.42, -5.6), .012, M['gold'], 6); ST.cyl((SX + 1.75, 1.42, -5.6), (SX + 1.72, 1.38, -5.45), .05, M['gold'], 12, r1=.02)
planter(ST, SX - 1.55, -5.95, .7); planter(ST, SX + 2.55, -5.95, .7)
ST.box((SX + 3.9, 1.45, -6.38), (1.0, 1.4, .04), M['poster2']); ST.box((SX + 3.9, 1.45, -6.41), (1.08, 1.48, .02), M['black'])
ST.box((SX - 3.4, 1.45, -6.38), (1.0, 1.4, .04), M['poster2']); ST.box((SX - 3.4, 1.45, -6.41), (1.08, 1.48, .02), M['black'])
# vecino izquierdo: bar con toldo verde, mesas y sillas en la acera
ST.box((SX - 11, 3.6, -6.6), (11, 7.2, .4), M['plaster']); ST.box((SX - 11, 1.35, -6.32), (6, 2.2, .1), M['shopwin']); ST.box((SX - 11, 2.65, -5.85), (6.4, .1, 1.2), M['green']); ST.box((SX - 11, 2.55, -5.27), (6.4, .22, .04), M['green'])
for x in (SX - 13.2, SX - 11, SX - 8.8): window(ST, x, 4.6, -6.35, 1.0, 1.3); window(ST, x, 6.3, -6.35, 1.0, 1.1)
for x in (SX - 12.6, SX - 9.4):
    ST.cyl((x, .15, -4.6), (x, .87, -4.6), .03, M['steel'], 10); ST.cyl((x, .87, -4.6), (x, .9, -4.6), .38, M['steel'], 24)
    for sd in (-1, 1):
        ST.box((x + sd * .6, .6, -4.6), (.42, .05, .42), M['steel']); ST.box((x + sd * .8, .85, -4.6), (.05, .5, .42), M['steel'])
        for dx in (-.18, .18):
            for dz in (-.18, .18): ST.cyl((x + sd * .6 + dx, .15, -4.6 + dz), (x + sd * .6 + dx, .6, -4.6 + dz), .015, M['steel'], 6)
ST.box((SX - 8.3, .7, -5.2), (.5, 1.1, .05), M['menu'])
# vecino derecho: kebab
ST.box((SX + 11, 3.6, -6.6), (11, 7.2, .4), M['brick2']); ST.box((SX + 10, 1.35, -6.32), (4.8, 2.2, .1), M['shopwin']); ST.box((SX + 10, 2.75, -6.25), (5.2, .5, .22), M['neonY'])
ST.box((SX + 13.6, 1.1, -6.32), (1.0, 2.1, .1), M['shutter'])
for x in (SX + 8.8, SX + 11, SX + 13.2): window(ST, x, 4.6, -6.35, 1.0, 1.3); window(ST, x, 6.3, -6.35, 1.0, 1.1)
for x in (SX - 5.55, SX + 5.55): ST.cyl((x, 0, -6.35), (x, 7.2, -6.35), .06, M['iron'], 12)
for (x, y) in [(SX - 2.4, 5.4), (SX + 2.4, 3.95), (SX - 9.5, 5.4)]: ST.box((x, y, -6.15), (.8, .55, .4), M['steel']); ST.box((x - .08, y, -5.94), (.5, .42, .02), M['iron'])
# acera
for x in (SX - 6.5, SX + 6.5, SX - 19, SX + 19): lamp_post(ST, x, -.5, 0 if x > SX else math.pi)
ST.cyl((SX + 4.6, .15, -.6), (SX + 4.6, .72, -.6), .13, M['hydrant'], 16); ST.sph((SX + 4.6, .75, -.6), .13, M['hydrant'], seg=14, rings=8); ST.cyl((SX + 4.38, .5, -.6), (SX + 4.82, .5, -.6), .05, M['hydrant'], 10)
ST.cyl((SX - 4.4, .15, -.7), (SX - 4.4, 1.0, -.7), .25, M['bin'], 20); ST.cyl((SX - 4.4, 1.0, -.7), (SX - 4.4, 1.05, -.7), .28, M['iron'], 20)
for (x, z, r) in [(SX - 5.0, -1.0, .3), (SX - 5.35, -.6, .24), (SX - 3.85, -1.1, .26)]: ST.sph((x, .15 + r * .8, z), r, M['bag'], sc=(1, .85, 1), seg=14, rings=8)
for x in (SX - 2.4, SX + 2.4, SX - 8, SX + 8): ST.cyl((x, .15, -.35), (x, .85, -.35), .07, M['iron'], 14); ST.sph((x, .85, -.35), .07, M['iron'], seg=12, rings=6)
bike(ST, SX + 7.6, -1.6); bike(ST, SX + 8.4, -1.9)
ST.box((SX, 3.6, 13.2), (60, 7.2, .4), M['brick2'])
for k in range(13):
    x = SX - 24 + k * 4
    window(ST, x, 1.6, 12.95, 1.4, 1.6); window(ST, x, 4.6, 12.95, 1.0, 1.3)
ST.finish(origin=(SX, 0, 0))

# ================================================= PISTA (x = 1000) =================================================
DX = 1000.
DF = OB('dance_floor', 0)
DF.box((DX, -.1, -2), (20, .2, 16), M['woodfloor']); DF.box((DX, .02, -3), (5, .04, 5), M['ledfloor']); DF.finish(origin=(DX, 0, 0))
D = OB('dance', .012)
H = 3.4
D.box((DX, H / 2, -10.2), (20, H, .4), M['wallclub']); D.box((DX - 9.2, H / 2, -2), (.4, H, 16), M['wallclub']); D.box((DX + 9.2, H / 2, -2), (.4, H, 16), M['wallclub']); D.box((DX, H / 2, 6.2), (20, H, .4), M['wallclub'])
D.box((DX, H + .1, -2), (20, .2, 16.5), M['ceilclub'])
for (c, s) in [((DX, .09, -5.55), (5.3, .1, .14)), ((DX, .09, -.45), (5.3, .1, .14)), ((DX - 2.6, .09, -3), (.14, .1, 5.2)), ((DX + 2.6, .09, -3), (.14, .1, 5.2))]: D.box(c, s, M['steel'])
D.cyl((DX - 3, 3.05, -5.8), (DX + 3, 3.05, -5.8), .04, M['steel'], 10); D.cyl((DX - 3, 3.05, -.2), (DX + 3, 3.05, -.2), .04, M['steel'], 10)
SPOTS = []
for k in range(5):
    x = DX - 2.4 + k * 1.2
    for z in (-5.8, -.2):
        D.box((x, 2.92, z), (.12, .2, .12), M['iron']); D.cyl((x, 2.85, z), (x, 2.6, z + (.15 if z < -3 else -.15)), .12, M['black'], 16, r1=.14); SPOTS.append((x, 2.6, z))
D.cyl((DX, H, -3), (DX, 2.6, -3), .015, M['steel'], 6); D.ico((DX, 2.25, -3), .35, M['steeld'], sub=3)
D.box((DX, .2, -8.9), (4, .4, 2.2), M['black']); D.box((DX, .95, -8.2), (2.4, .9, .7), M['black']); D.box((DX, .75, -7.83), (2.3, .05, .03), M['neonP']); D.box((DX, 1.15, -7.83), (2.3, .05, .03), M['neonC'])
D.box((DX, 1.42, -8.25), (2.6, .05, .85), M['iron'])
for sd in (-1, 1): D.cyl((DX + sd * .7, 1.45, -8.25), (DX + sd * .7, 1.49, -8.25), .26, M['rubber'], 28); D.cyl((DX + sd * .7, 1.49, -8.25), (DX + sd * .7, 1.51, -8.25), .05, M['steel'], 12)
D.box((DX, 1.5, -8.3), (.5, .07, .35), M['iron'])
for sd in (-1, 1):
    for k in range(2): D.box((DX + sd * 2.8, .55 + k * 1.05, -9.2), (1.0, 1.0, .8), M['speaker'])
D.box((DX, 2.4, -9.95), (5.5, 1.5, .06), M['poster'])
BX = DX + 7.4
D.box((BX, .55, -3), (.8, 1.1, 8), M['wood']); D.box((BX - .1, 1.13, -3), (1.1, .06, 8.2), M['black']); D.box((BX - .42, .2, -3), (.04, .05, 8), M['neonP'])
for k in range(5):
    z = -6.4 + k * 1.6; D.cyl((BX - .95, 0, z), (BX - .95, .72, z), .035, M['steel'], 10); D.cyl((BX - .95, .72, z), (BX - .95, .8, z), .2, M['velvet'], 20); D.torus((BX - .95, .3, z), .15, .015, M['steel'], 16)
D.box((DX + 8.95, 1.9, -3), (.06, 1.6, 7), M['barmirror'])
for y in (1.3, 1.9, 2.5):
    D.box((DX + 8.75, y, -3), (.35, .04, 7.4), M['gold'])
    for k in range(20): bottle(D, DX + 8.75, y + .02, -6.5 + k * .37, ['bottleG', 'bottleA', 'bottleB', 'bottleR'][(k + int(y * 10)) % 4], .24 + (k % 3) * .04)
for z in (-6.5, -2.5, 1.5):
    x = DX - 8.4
    D.box((x, .3, z), (.9, .4, 2.6), M['purple']); D.box((x - .35, .75, z), (.25, .9, 2.6), M['purpled'])
    for sd in (-1, 1): D.box((x, .55, z + sd * 1.25), (.9, .5, .2), M['purpled'])
    D.cyl((x + 1.3, 0, z), (x + 1.3, .45, z), .05, M['gold'], 12); D.cyl((x + 1.3, .45, z), (x + 1.3, .48, z), .4, M['black'], 28); D.cyl((x + 1.3, .48, z), (x + 1.3, .6, z), .05, M['lampwarm'], 12)
    bottle(D, x + 1.45, .48, z + .15, 'bottleG', .25); D.cyl((x + 1.15, .48, z - .1), (x + 1.15, .58, z - .1), .035, M['white'], 10)
for (x, z) in [(DX - 5.5, -7.5), (DX + 5.5, -7.5), (DX - 5.5, 2.5), (DX + 5.5, 2.5)]:
    D.cyl((x, 0, z), (x, H, z), .28, M['black'], 20)
    for a in range(4): D.box((x + math.cos(a * 1.571) * .28, H / 2, z + math.sin(a * 1.571) * .28), (.04, H - .4, .04), M['neonP' if a % 2 else 'neonC'])
for k in range(8): D.cyl((DX - 9.0 + .05, 2.2 + (.25 if k % 2 else -.25), -8 + k * 1.2), (DX - 9.0 + .05, 2.2 + (-.25 if k % 2 else .25), -6.8 + k * 1.2), .035, M['neonC'], 10)
for (x, z) in [(DX - 8.6, -9.4), (DX + 4.2, -9.6)]: D.cyl((x, 0, z), (x, .6, z), .3, M['pot'], 20, r1=.24); bush(D, x, .5, z, .5, 12)
D.box((DX, 1.2, 5.95), (2.0, 2.4, .2), M['black']); D.box((DX, 1.15, 5.88), (1.7, 2.25, .06), M['doorglass'])
D.finish(origin=(DX, 0, 0))

# ================================================= AULA (x = 2000) =================================================
AX = 2000.
AF = OB('aula_floor', 0); AF.box((AX, -.1, 0), (12, .2, 12), M['parquet']); AF.finish(origin=(AX, 0, 0))
AU = OB('aula', .012)
AU.box((AX, 1.6, -5.2), (12, 3.2, .4), M['wallcream']); AU.box((AX - 6, 1.6, 0), (.4, 3.2, 10.4), M['wallcream']); AU.box((AX + 6, 1.6, 0), (.4, 3.2, 10.4), M['wallcream'])
AU.box((AX, .45, -4.95), (12, .9, .1), M['woodl']); AU.box((AX, .92, -4.9), (12, .05, .14), M['woodd'])
AU.box((AX, 1.85, -4.95), (4.2, 1.6, .1), M['woodd']); AU.box((AX, 1.85, -4.88), (3.9, 1.35, .04), M['board']); AU.box((AX, 1.05, -4.78), (4.0, .05, .22), M['woodd'])
for k in range(5): AU.box((AX - 1.4 + k * .16, 1.1, -4.75), (.1, .03, .03), M['chalk'])
AU.box((AX - .6, 1.1, -4.74), (.3, .07, .1), M['wood'])
AU.box((AX + 1.1, .76, -3.0), (1.6, .06, .8), M['woodl'])
for sx in (-1, 1):
    for sz in (-1, 1): AU.box((AX + 1.1 + sx * .72, .37, -3 + sz * .32), (.06, .74, .06), M['woodd'])
AU.box((AX + .6, .8, -3.0), (.35, .04, .45), M['paper']); AU.cyl((AX + 1.6, .79, -2.9), (AX + 1.6, .92, -2.9), .06, M['red'], 14)
for y in (.6, 1.25, 1.9, 2.55): AU.box((AX - 4.6, y, -4.9), (1.6, .05, .4), M['wood']); AU.box((AX - 4.6, y + .28, -4.92), (1.5, .5, .32), M['books'])
AU.box((AX - 4.6, 1.6, -5.0), (1.75, 2.9, .05), M['woodd'])
window(AU, AX + 4.1, 1.9, -4.98, 1.6, 1.4)
AU.cyl((AX + 1.1, 3.2, -3), (AX + 1.1, 2.5, -3), .012, M['iron'], 6); AU.cyl((AX + 1.1, 2.5, -3), (AX + 1.1, 2.25, -3), .3, M['green'], 20, r1=.08); AU.sph((AX + 1.1, 2.27, -3), .1, M['lamp'], seg=12, rings=8)
AU.cyl((AX + 3.6, 0, -4.2), (AX + 3.6, .45, -4.2), .22, M['pot'], 16, r1=.18); bush(AU, AX + 3.6, .4, -4.2, .42, 11)
AU.box((AX, 3.3, 0), (12.4, .2, 10.8), M['wallcream']); AU.cyl((AX - 2.6, 2.6, -4.97), (AX - 2.6, 2.6, -4.93), .25, M['white'], 24)
AU.finish(origin=(AX, 0, 0))

lay = dict(sites=dict(street=[SX, 0], dance=[DX, 0], aula=[AX, 0]), spots=SPOTS, ball=[DX, 2.25, -3], queue=QX)
json.dump(lay, open(os.path.join(OUT, 'layout.json'), 'w'))
kw = dict(filepath=os.path.join(OUT, 'disco.glb'), export_format='GLB', export_apply=True)
try: bpy.ops.export_scene.gltf(**kw, export_vertex_color='ACTIVE', export_all_vertex_colors=False)
except TypeError: bpy.ops.export_scene.gltf(**kw)
print('EXPORT_OK')

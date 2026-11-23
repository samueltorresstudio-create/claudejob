# 77 · Las tres reglas secretas de los casinos — decorados de DIBUJO ANIMADO modelados en Blender y exportados a GLB para three.js.
# Formas gordas y simples, colores planos y vivos; el contorno negro y el sombreado de tebeo los pone three.js.
# Coordenadas en el sistema de three.js (x este, y arriba, z hacia la cámara); finish() las pasa a Blender (x, -z, y).
# Sitios: hall (x=0) sala de juego sin ventanas · office (1000) despacho del director · glass (2000) sala con pared de cristal
#         maze (3000) laberinto de pasillos estrechos · lab (4000) laboratorio.   Uso: python3 casino.py → casino.glb + layout.json
import bpy, bmesh, math, random, json, os
from mathutils import Matrix, Vector
OUT = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)
rnd = random.Random(77)
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
    white=('#ffffff'), cream=('#fbf0d2'), paper=('#f7f0d8'), black=('#2a2430'), iron=('#3c3748'), steel=('#c9ced6'), steeld=('#9aa1ad'),
    gold=('#ffc928'), goldd=('#e0951c'), red=('#e3453a'), redd=('#b82e32'), burg=('#8a2234'), burgd=('#651728'), burgdd=('#4a1020'),
    navy=('#2c3f86'), navyd=('#1f2d63'), blue=('#4f8fe8'), green=('#2f9a52'), greenl=('#43bd65'), felt=('#1f7a4a'), teal=('#2cc4b4'), mint=('#bfe8dc'),
    pink=('#ff4f9a'), cyan=('#2fe0ff'), purple=('#8a63d2'), orange=('#ff9a3c'), yellow=('#ffd96a'), lamp=('#fff0b0'), wood=('#b9824e'), woodd=('#7d5230'),
    darkwood=('#5a3a24'), wall=('#f6f3ec'), walld=('#e4dfd3'), tile=('#dfe6ea'), tiled=('#c3ced4'), concrete=('#c9c5bd'), leaf=('#41c261'),
    slotglow=('#fff6a0'), plastic=('#17141f'), cloth=('#2b3a78'), skin=('#f4d9b4'), glass=('#bfe6ff'),
)
M = {k: mat(k, v) for k, v in P.items()}
for n in ['carpet', 'wallpaper', 'ceilingp', 'parquet', 'tilep', 'plan1', 'plan2', 'plan3', 'slotscr', 'clockface', 'daycity', 'eeg', 'poster', 'chart', 'runner', 'art1', 'art2', 'art3', 'icon1', 'icon2', 'icon3', 'icon4']: M[n] = mat(n, '#ffffff')

def sconce(o, x, y, z, ry=0.):
    def f(q):
        q.box((0, 0, 0), (.22, .5, .08), M['gold']); q.box((0, .1, .12), (.1, .1, .2), M['gold']); q.sph((0, .38, .2), .16, M['lamp'], seg=8, rings=5); q.cyl((0, .22, .2), (0, .62, .2), .02, M['gold'], 4); q.cyl((0, .5, .2), (0, .8, .2), .24, M['cream'], 10, r1=.1)
    grp(o, f, TR(x, y, z, ry))
def dice(o, x, z, s=.9, ry=0.):
    def f(q):
        q.box((0, s / 2, 0), (s, s, s), M['white'])
        for (px, py) in [(-.25, .25), (.25, -.25), (0, 0), (-.25, -.25), (.25, .25)]: q.sph((px * s, s / 2 + py * s, s / 2 + .01), s * .07, M['black'], seg=6, rings=4)
        for (px, py) in [(-.22, .22), (.22, -.22)]: q.sph((s / 2 + .01, s / 2 + py * s, px * s), s * .07, M['red'], seg=6, rings=4)
    grp(o, f, TR(x, 0, z, ry))
def chips(o, x, y, z, n=6, col='red', r=.22):
    for k in range(n): o.cyl((x, y + k * .06, z), (x, y + k * .06 + .055, z), r, M[col if k % 3 else 'white'], 12)
def canopy(o, xc, z0, z1, y=2.75):
    # marquesina de colores sobre una isla de tragaperras: barra dorada, festón de bolas y bombillas
    L = z1 - z0; o.box((xc, y, (z0 + z1) / 2), (3.1, .16, L), M['goldd']); o.box((xc, y + .12, (z0 + z1) / 2), (2.9, .1, L), M['burg'])
    n = int(L / .62)
    for k in range(n):
        z = z0 + .3 + k * .62; c = ['pink', 'cyan', 'yellow', 'orange'][k % 4]
        for sd in (-1, 1): o.sph((xc + sd * 1.5, y - .08, z), .24, M[c], (1, .6, 1), seg=8, rings=5)
        o.sph((xc, y + .22, z), .1, M['lamp'], seg=6, rings=4)
def framed_obj(name, mname, w, h, fr='gold'):
    q = Obj(name); q.box((0, 0, 0), (w + .35, h + .35, .14), M[fr]); q.box((0, 0, .08), (w, h, .06), M[mname]); q.box((0, 0, -.08), (w, h, .06), M[mname]); q.finish(origin=(0, 0, 0))
def sign_obj(name, mname, col):
    q = Obj(name); q.box((0, 0, 0), (1.8, 1.8, .22), M['plastic']); q.box((0, 0, .13), (1.6, 1.6, .05), M[mname]); q.box((0, 0, -.13), (1.6, 1.6, .05), M[mname])
    q.box((0, .93, 0), (2.0, .14, .3), M[col]); q.box((0, -.93, 0), (2.0, .14, .3), M[col]); q.box((.93, 0, 0), (.14, 2.0, .3), M[col]); q.box((-.93, 0, 0), (.14, 2.0, .3), M[col])
    for k in range(8): a = k / 8 * 2 * math.pi; q.sph((math.cos(a) * 1.05, math.sin(a) * 1.05, 0), .09, M['lamp'], seg=6, rings=4)
    q.cyl((0, 1.0, 0), (0, 2.2, 0), .03, M['iron'], 4); q.finish(origin=(0, 0, 0))

def lamp_bar(o, x, y, z, w, h=.08, d=.08, m='lamp'): o.box((x, y, z), (w, h, d), M[m])
def stool(o, x, z, col='red'):
    o.cyl((x, 0, z), (x, .5, z), .05, M['steeld'], 6); o.cyl((x, 0, z), (x, .04, z), .22, M['steeld'], 10); o.cyl((x, .5, z), (x, .62, z), .24, M[col], 12)

def slot_local(o, body='burg', glow='slotglow', hero=False):
    # máquina tragaperras mirando a +z: cuerpo, bandeja, pantalla, rótulo de bombillas, palanca y taburete
    o.box((0, .45, 0), (.92, .9, .84), M[body]); o.box((0, .45, .43), (.78, .7, .04), M['black']); o.box((0, .9, 0), (.98, .08, .9), M['gold'])
    o.box((0, .78, .5), (.72, .12, .24), M['steel']); o.box((0, .72, .5), (.6, .06, .2), M['steeld'])
    o.box((0, 1.28, .24), (.9, .78, .46), M['iron']); o.box((0, 1.28, .48), (.78, .62, .06), M['slotscr'] if hero else M[glow])
    o.box((0, 1.28, .5), (.84, .68, .02), M['gold'])
    o.box((0, 1.82, .14), (1.0, .36, .6), M['goldd']); o.box((0, 1.82, .46), (.86, .22, .04), M['lamp'])
    o.box((0, 2.04, .14), (1.06, .08, .66), M['gold'])
    o.box((.48, 1.28, .0), (.04, .5, .1), M['black']); o.cyl((.5, 1.0, .04), (.62, 1.5, .04), .035, M['steel'], 6); o.sph((.63, 1.57, .04), .09, M['red'], seg=8, rings=6)
    if hero:
        for k in range(9): o.sph((-.4 + k * .1, 1.82, .5), .035, M['lamp'], seg=6, rings=4)
        for k in range(5): o.sph((-.4 + k * .2, 2.1, .46), .05, M['pink' if k % 2 else 'cyan'], seg=6, rings=4)
    stool(o, 0, .95, 'red' if body != 'red' else 'navy')

def slot(o, x, z, ry=0., body='burg', glow='slotglow'): grp(o, lambda q: slot_local(q, body, glow), TR(x, 0, z, ry))

def chandelier(o, x, y, z, s=1.):
    o.cyl((x, y + 1.4, z), (x, y + .5, z), .05, M['iron'], 6); o.torus((x, y + .3, z), 1.2 * s, .09, M['gold'], 22); o.torus((x, y - .2, z), .75 * s, .08, M['gold'], 18); o.sph((x, y - .6, z), .3, M['gold'])
    for k in range(10): a = k / 10 * 2 * math.pi; o.cyl((x + math.cos(a) * 1.2 * s, y + .3, z + math.sin(a) * 1.2 * s), (x + math.cos(a) * 1.2 * s, y + .75, z + math.sin(a) * 1.2 * s), .05, M['gold'], 4); o.sph((x + math.cos(a) * 1.2 * s, y + .85, z + math.sin(a) * 1.2 * s), .12, M['lamp'], seg=6, rings=4)
def column(o, x, z, h=5.2, r=.42):
    o.cyl((x, 0, z), (x, h, z), r, M['burgd'], 14); o.cyl((x, 0, z), (x, .3, z), r + .12, M['gold'], 14); o.cyl((x, h - .3, z), (x, h, z), r + .12, M['gold'], 14)
def roulette(o, x, z, ry=0.):
    def f(q):
        q.box((0, .5, 0), (3.2, .9, 1.7), M['darkwood']); q.box((.2, .96, 0), (2.5, .06, 1.5), M['felt']); q.box((.2, .98, 0), (2.5, .02, .04), M['gold'])
        q.cyl((-1.2, .96, 0), (-1.2, 1.06, 0), .7, M['wood'], 20); q.cyl((-1.2, 1.06, 0), (-1.2, 1.12, 0), .5, M['black'], 20); q.cyl((-1.2, 1.12, 0), (-1.2, 1.22, 0), .12, M['gold'], 10)
        for i in range(8): q.cyl((-1.2 + math.cos(i * .785) * .4, 1.12, math.sin(i * .785) * .4), (-1.2 + math.cos(i * .785) * .4, 1.14, math.sin(i * .785) * .4), .05, M['red' if i % 2 else 'white'], 5)
        for k in range(5): q.cyl((.6 + k * .3, .99, -.3 + (k % 2) * .5), (.6 + k * .3, 1.05 + k * .02, -.3 + (k % 2) * .5), .1, M[['red', 'blue', 'white', 'gold', 'green'][k]], 10)
        for sd in (-1, 1): q.cyl((.2, 0, sd * 1.4), (.2, .55, sd * 1.4), .05, M['steeld'], 6); q.cyl((.2, .55, sd * 1.4), (.2, .66, sd * 1.4), .26, M['burg'], 12)
    grp(o, f, TR(x, 0, z, ry))
def cardtable(o, x, z, ry=0.):
    def f(q):
        q.cyl((0, 0, 0), (0, .9, 0), .55, M['darkwood'], 14); q.cyl((0, .9, 0), (0, .98, 0), 1.35, M['darkwood'], 22); q.cyl((0, .98, 0), (0, 1.0, 0), 1.2, M['felt'], 22)
        for k in range(5): q.box((-.7 + k * .35, 1.01, -.2), (.2, .01, .3), M['white'])
        for a in (-.9, -.3, .3, .9): q.cyl((math.sin(a) * 2.0, 0, math.cos(a) * 2.0), (math.sin(a) * 2.0, .5, math.cos(a) * 2.0), .05, M['steeld'], 6); q.cyl((math.sin(a) * 2.0, .5, math.cos(a) * 2.0), (math.sin(a) * 2.0, .62, math.cos(a) * 2.0), .26, M['navy'], 12)
    grp(o, f, TR(x, 0, z, ry))
def bar(o, x, z, ry=0.):
    def f(q):
        q.box((0, .6, 0), (7, 1.2, 1.2), M['darkwood']); q.box((0, 1.25, 0), (7.3, .1, 1.5), M['gold']); q.box((0, 1.5, -1.5), (7, 3.0, .3), M['burgdd'])
        for r in range(3):
            q.box((0, .9 + r * .8 + 1.2, -1.25), (6.4, .06, .4), M['gold'])
            for k in range(11): q.cyl((-3 + k * .6, 1.2 + r * .8 + 1.2 + .02, -1.25), (-3 + k * .6, 1.2 + r * .8 + 1.2 + .44, -1.25), .09, M[['green', 'cyan', 'orange', 'pink', 'yellow'][(k + r) % 5]], 8)
        for k in range(5): stool(q, -2.6 + k * 1.3, 1.5, 'burg')
    grp(o, f, TR(x, 0, z, ry))
def doorway(o, x, z, ry=0., w=3.4, h=3.8):
    def f(q):
        q.box((0, h / 2, 0), (w + .7, h + .35, .3), M['gold']); q.box((0, h / 2 - .05, .06), (w, h - .1, .3), M['darkwood']); q.box((0, h / 2 - .05, .22), (.04, h - .1, .06), M['gold'])
        for sd in (-1, 1): q.cyl((sd * .3, 1.4, .26), (sd * .3, 1.4, .36), .09, M['gold'], 8); q.box((sd * (w / 4), h / 2 + .6, .22), (w / 2 - .3, 1.2, .04), M['goldd']); q.box((sd * (w / 4), 1.0, .22), (w / 2 - .3, 1.6, .04), M['goldd'])
    grp(o, f, TR(x, 0, z, ry))
def neon_line(o, a, b, col, th=.1): o.cyl((a[0], a[1], a[2]), (b[0], b[1], b[2]), th, M[col], 6)
def wall_panels(o, x, y, z, w, ry=0., n=6, col='goldd'):
    def f(q):
        for k in range(n): q.box((-w / 2 + (k + .5) * w / n, y, 0), (w / n - .5, 2.8, .1), M['burgdd']); q.box((-w / 2 + (k + .5) * w / n, y, .02), (w / n - .3, 3.0, .06), M[col])
    grp(o, f, TR(x, 0, z, ry))
def plant(o, x, z, s=1.):
    o.cyl((x, 0, z), (x, .55 * s, z), .38 * s, M['redd'], 10)
    for k in range(7): a = k * 2.4; o.sph((x + math.cos(a) * .3 * s, 1.0 * s + (k % 3) * .22 * s, z + math.sin(a) * .3 * s), .36 * s, M['leaf'], (.55, 1.0, .55))

# ================================================= SALA DE JUEGO (x = 0): moqueta, tragaperras, techo bajo, sin ventanas =================================================
HX = 0.
HF = Obj('hall_floor'); HF.box((0, -.15, 8), (30, .3, 64), M['carpet']); HF.finish(origin=(HX, 0, 0))
HA = Obj('hall')
HA.box((0, 2.6, -18.3), (30, 5.4, .6), M['wallpaper']); HA.box((0, 5.5, -18.2), (30, .24, .6), M['gold']); HA.box((0, .14, -17.95), (30, .28, .12), M['gold'])
for sd in (-1, 1):
    HA.box((sd * 14.8, 2.6, 8), (.6, 5.4, 64), M['wallpaper']); HA.box((sd * 14.45, .14, 8), (.12, .28, 64), M['gold']); HA.box((sd * 14.4, 5.2, 8), (.3, .26, 64), M['gold'])
HA.box((0, 2.6, 40.3), (30, 5.4, .6), M['wallpaper']); HA.box((0, 5.46, 8), (30, .4, 64), M['ceilingp'])      # techo bajo
HA.box((0, .62, -17.88), (30, 1.24, .2), M['darkwood']); HA.box((0, 1.28, -17.82), (30, .12, .3), M['gold']); HA.box((0, 1.0, -17.78), (30, .06, .24), M['goldd'])
wall_panels(HA, 0, 2.2, -17.9, 26, 0., 7); wall_panels(HA, -14.4, 2.2, 8, 56, math.pi / 2, 13); wall_panels(HA, 14.4, 2.2, 8, 56, -math.pi / 2, 13)
doorway(HA, 0, 39.9, math.pi); doorway(HA, -14.35, 24, math.pi / 2, 2.8, 3.4)
for z in (4, 15, 26): chandelier(HA, 0, 4.5, z, .95)
for z in (-12, -2, 8, 18, 28, 36):
    for sd in (-1, 1): column(HA, sd * 9.0, z)
for z in (-12, 0, 12, 24, 36):
    for sd in (-1, 1): neon_line(HA, (sd * 14.2, 4.8, z), (sd * 14.2, 4.8, z + 6), 'pink' if z % 24 == 0 else 'cyan', .09)
for k in range(8):                                                   # tiras de luz del techo
    lamp_bar(HA, 0, 5.24, -14 + k * 8, 12, .06, .22)
for k, z in enumerate((0, 7, 14, 21, 28)):                      # arcos de neón sobre el pasillo central
    HA.torus((0, .0, z), 3.7, .09, M[['pink', 'cyan', 'gold'][k % 3]], 30, 'X'); HA.torus((0, .0, z), 3.35, .05, M['lamp'], 30, 'X')
# islas de tragaperras: dos filas espalda con espalda a cada lado; pasillo central libre
def island(o, xc, z0, n, bodies, step=1.36):
    for r in range(n):
        z = z0 + r * step
        slot(o, xc + .6, z, math.pi / 2, bodies[r % len(bodies)]); slot(o, xc - .6, z, -math.pi / 2, bodies[(r + 2) % len(bodies)])
for isl in (-1, 1): island(HA, isl * 5.6, -10.5, 18, ['burg', 'navy', 'green', 'red', 'purple'])
roulette(HA, -7.2, -14.2, 0.); roulette(HA, 7.2, -14.2, 0.); cardtable(HA, -2.8, -13.2); cardtable(HA, 2.8, -13.2)
bar(HA, 0, -16.9, 0.)
plant(HA, -13.2, -16.6, 1.1); plant(HA, 13.2, -16.6, 1.1)
for sd in (-1, 1): canopy(HA, sd * 5.6, -11, 14.5)
for x in (-9.5, -6.2, 6.2, 9.5): sconce(HA, x, 3.0, -17.6)
for sd in (-1, 1): dice(HA, sd * 4.6, -15.6, 1.0, sd * .4); chips(HA, -1.6, 1.25, -16.4, 7, 'red'); chips(HA, 1.4, 1.25, -16.4, 5, 'blue'); chips(HA, 2.0, 1.25, -16.4, 6, 'green')
HA.box((0, .018, 14), (5.4, .04, 52), M['gold']); HA.box((0, .024, 14), (5.0, .04, 52), M['runner'])        # alfombra central
HA.finish(origin=(HX, 0, 0))

# ================================================= DESPACHO DEL DIRECTOR (x = 1000) =================================================
OX = 1000.
OF = Obj('office_floor'); OF.box((OX, -.15, 0), (16, .3, 18), M['parquet']); OF.box((OX, .01, 2), (7, .04, 6), M['burg']); OF.finish(origin=(OX, 0, 0))
OA = Obj('office')
OA.box((OX, 2.3, -8.3), (16, 4.6, .6), M['wallpaper']); OA.box((OX, 4.5, -8.2), (16, .22, .5), M['gold']); OA.box((OX, .14, -7.95), (16, .28, .12), M['gold'])
for sd in (-1, 1): OA.box((OX + sd * 7.8, 2.3, 0), (.6, 4.6, 18), M['wallpaper']); OA.box((OX + sd * 7.5, 4.5, 0), (.5, .22, 18), M['gold']); OA.box((OX + sd * 7.5, .14, 0), (.12, .28, 18), M['gold'])
OA.box((OX, 2.3, 9.3), (16, 4.6, .6), M['wallpaper']); OA.box((OX, 4.7, 0), (16, .4, 18), M['ceilingp'])
OA.box((OX, .62, -7.9), (16, 1.24, .2), M['darkwood']); OA.box((OX, 1.28, -7.84), (16, .12, .3), M['gold'])
for k in range(4): lamp_bar(OA, OX - 4.5 + k * 3, 4.45, 0, .2, .06, 14)
# escritorio, sillón y planos
OA.box((OX, .8, -3.6), (4.4, .12, 1.8), M['wood']); OA.box((OX, .75, -3.6), (4.1, .06, 1.6), M['darkwood'])
for sx in (-1, 1): OA.box((OX + sx * 1.9, .4, -3.6), (.5, .8, 1.6), M['darkwood'])
OA.box((OX, .88, -3.3), (2.2, .02, 1.3), M['plan1'], 0., 0.)
OA.box((OX - 1.6, 1.0, -4.2), (.24, .02, .18), M['white']); OA.cyl((OX - 1.1, .96, -4.2), (OX - .8, 1.5, -4.2), .03, M['steel'], 6)
OA.cyl((OX + 1.7, .86, -4.1), (OX + 1.7, 1.4, -4.1), .03, M['gold'], 6); OA.cyl((OX + 1.7, 1.4, -4.1), (OX + 1.7, 1.55, -4.1), .26, M['green'], 10)
OA.box((OX, .5, -5.6), (1.2, 1.0, 1.0), M['burg']); OA.box((OX, 1.45, -6.05), (1.2, 1.5, .14), M['burg'])   # sillón del director
# pared del fondo: plano enorme en marco dorado
OA.box((OX, 2.9, -7.9), (6.4, 3.2, .16), M['gold']); OA.box((OX, 2.9, -7.8), (6.0, 2.8, .08), M['plan2'])
# librería y vitrina con trofeos
for sd in (-1,):
    OA.box((OX - 7.3, 2.0, -3), (.7, 4.0, 5), M['darkwood'])
    for r in range(5): OA.box((OX - 6.95, .8 + r * .75, -3), (.1, .06, 4.7), M['wood']); [OA.box((OX - 6.88, .8 + r * .75 + .3, -5 + k * .45), (.12, .5 + (k % 3) * .06, .3), M[['burg', 'navy', 'green', 'red', 'gold'][(k + r) % 5]]) for k in range(10)]
OA.box((OX + 7.3, 1.2, -2), (.7, 2.4, 3.5), M['darkwood']); OA.box((OX + 6.9, 1.3, -2), (.1, 1.8, 3.1), M['glass'])
for k in range(3): OA.cyl((OX + 6.8, 1.1 + k * .6, -3 + k * 1.0), (OX + 6.8, 1.4 + k * .6, -3 + k * 1.0), .14, M['gold'], 8); OA.sph((OX + 6.8, 1.52 + k * .6, -3 + k * 1.0), .08, M['gold'], seg=6, rings=4)
# sillones de visita, alfombra y lámpara de pie
for sx in (-1, 1): OA.box((OX + sx * 1.6, .35, 1.4), (1.2, .7, 1.1), M['navy']); OA.box((OX + sx * 1.6, .85, 1.85), (1.2, .9, .14), M['navy'])
OA.cyl((OX - 5.4, 0, 3), (OX - 5.4, 2.6, 3), .05, M['gold'], 6); OA.cyl((OX - 5.4, 2.4, 3), (OX - 5.4, 2.9, 3), .5, M['cream'], 12)
doorway(OA, OX + 7.45, 4.5, -math.pi / 2, 2.4, 3.4)
for sd in (-1, 1):                                                   # cortinas pesadas con cenefa dorada
    OA.box((OX + sd * 5.9, 2.2, -7.7), (1.4, 4.2, .3), M['redd']); OA.box((OX + sd * 5.9, 4.2, -7.62), (1.7, .5, .36), M['gold'])
    for k in range(5): OA.box((OX + sd * 5.9 - .55 + k * .28, 2.1, -7.5), (.1, 4.0, .16), M['burg'])
for x in (-3.4, 3.4): sconce(OA, OX + x, 3.2, -7.72)
OA.cyl((OX + 2.3, .88, -3.2), (OX + 2.3, 1.05, -3.2), .26, M['darkwood'], 10); OA.sph((OX + 2.3, 1.38, -3.2), .34, M['blue'], seg=12, rings=8); OA.torus((OX + 2.3, 1.38, -3.2), .4, .03, M['gold'], 16, 'X')
chips(OA, OX - 1.3, .9, -3.0, 5, 'red', .12); chips(OA, OX - 1.0, .9, -2.9, 4, 'gold', .12)
plant(OA, OX + 6.2, 7.6, .9)
OA.finish(origin=(OX, 0, 0))

# ================================================= SALA CON PARED DE CRISTAL (x = 2000) =================================================
GX = 2000.
GF = Obj('glass_floor'); GF.box((GX, -.15, 4), (32, .3, 46), M['carpet']); GF.finish(origin=(GX, 0, 0))
GA = Obj('glass')
# techo, laterales y cristal al fondo: bastidor de hierro y vigas; fuera, ciudad de día
GA.box((GX, 5.5, 4), (32, .4, 46), M['ceilingp'])
for sd in (-1, 1): GA.box((GX + sd * 15.8, 2.7, 4), (.6, 5.4, 46), M['wallpaper']); GA.box((GX + sd * 15.4, .14, 4), (.12, .28, 46), M['gold'])
GA.box((GX, 2.7, 27.3), (32, 5.4, .6), M['wallpaper'])
GA.box((GX, .12, -18.8), (32, .24, .5), M['gold']); GA.box((GX, 5.35, -18.8), (32, .5, .5), M['iron'])
for k in range(11): GA.box((GX - 15 + k * 3, 2.7, -18.8), (.22, 5.4, .3), M['iron'])
for r in (1.8, 3.6): GA.box((GX, r, -18.8), (32, .18, .3), M['iron'])
GA.box((GX, 2.9, -22), (36, 6.4, .2), M['daycity'])            # fuera: cielo azul y ciudad
doorway(GA, GX - 15.45, 20, math.pi / 2, 2.8, 3.4)
for z in (-6, 6, 18): chandelier(GA, GX, 4.5, z, .9)
for sd in (-1, 1): island(GA, GX + sd * 5.8, -13, 11, ['burg', 'navy', 'green', 'red'])
for z in (-12, 0, 12, 24):
    for sd in (-1, 1): column(GA, GX + sd * 9.4, z)
for sd in (-1, 1): canopy(GA, GX + sd * 5.8, -13, 1.5)
for sd in (-1, 1): plant(GA, GX + sd * 8.0, -16.6, 1.2); plant(GA, GX + sd * 11.5, -16.4, 1.0)
for sd in (-1, 1): GA.box((GX + sd * 4.4, .3, -15.4), (1.6, .6, 1.0), M['wood'])
GA.box((GX, .018, 4), (5.4, .04, 46), M['gold']); GA.box((GX, .024, 4), (5.0, .04, 46), M['runner'])
GA.finish(origin=(GX, 0, 0))

# ================================================= LABERINTO (x = 3000): pasillos cortos y estrechos, techo bajo =================================================
MX = 3000.
N, CELL, WT, WH = 9, 3.2, .5, 3.3
MF = Obj('maze_floor'); MF.box((MX, -.15, 0), (N * CELL + 6, .3, N * CELL + 6), M['carpet']); MF.finish(origin=(MX, 0, 0))
MA = Obj('maze')
# laberinto sin ciclos (recursive backtracker) con la salida arriba (z negativo) y la entrada abajo
mrnd = random.Random(7); vis = [[False] * N for _ in range(N)]; openE = set()
def carve(cx, cz):
    vis[cz][cx] = True; dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]; mrnd.shuffle(dirs)
    for dx, dz in dirs:
        nx, nz = cx + dx, cz + dz
        if 0 <= nx < N and 0 <= nz < N and not vis[nz][nx]: openE.add((cx, cz, nx, nz)); openE.add((nx, nz, cx, cz)); carve(nx, nz)
carve(N // 2, N - 1)
# bucles extra para que no sea un árbol puro
for _ in range(10):
    cx, cz = mrnd.randrange(1, N - 1), mrnd.randrange(1, N - 1); dx, dz = mrnd.choice([(1, 0), (0, 1)]); openE.add((cx, cz, cx + dx, cz + dz)); openE.add((cx + dx, cz + dz, cx, cz))
x0, z0 = MX - N * CELL / 2, -N * CELL / 2
def wallbox(o, x, z, sx, sz): o.box((x, WH / 2, z), (sx, WH, sz), M['wallpaper']); o.box((x, WH + .06, z), (sx + .08, .14, sz + .08), M['gold']); o.box((x, .14, z), (sx + .06, .28, sz + .06), M['gold'])
for cz in range(N + 1):
    for cx in range(N):
        edge = cz in (0, N)
        if edge and not (cz == N and cx == N // 2) and not (cz == 0 and cx == N // 2 + 2) or (not edge and (cx, cz - 1, cx, cz) not in openE):
            wallbox(MA, x0 + (cx + .5) * CELL, z0 + cz * CELL, CELL + WT, WT)
for cx in range(N + 1):
    for cz in range(N):
        edge = cx in (0, N)
        if edge or (cx - 1, cz, cx, cz) not in openE: wallbox(MA, x0 + cx * CELL, z0 + (cz + .5) * CELL, WT, CELL + WT)
for cx in range(1, N):
    for cz in range(N):
        if (cx - 1, cz, cx, cz) not in openE and mrnd.random() < .30:
            slot(MA, x0 + cx * CELL + WT / 2 + .45, z0 + (cz + .5) * CELL, math.pi / 2, ['burg', 'navy', 'green', 'red', 'purple'][(cx + cz) % 5])
MA.finish(origin=(MX, 0, 0))
MC = Obj('maze_ceiling'); MC.box((MX, WH + .5, 0), (N * CELL + 2, .5, N * CELL + 2), M['burgdd'])
for i in range(7): lamp_bar(MC, MX - 12 + i * 4, WH + .2, -12 + (i % 2) * 6, .3, .06, 5.5)
MC.finish(origin=(MX, 0, 0))

# pasillo estrecho de demostración (x = 3040): paredes a 2,8 m, nichos con tragaperras, techo bajo con tiras de luz
CX = MX + 40.
CF = Obj('corr_floor'); CF.box((CX, -.15, 0), (4.4, .3, 44), M['carpet']); CF.finish(origin=(MX, 0, 0))
CO = Obj('corr')
for sd in (-1, 1):
    for k in range(8):
        z0 = -20 + k * 5.5
        CO.box((CX + sd * 1.45, WH / 2, z0 + 1.6), (.5, WH, 3.2), M['wallpaper']); CO.box((CX + sd * 1.45, WH + .06, z0 + 1.6), (.58, .14, 3.28), M['gold']); CO.box((CX + sd * 1.45, .14, z0 + 1.6), (.56, .28, 3.26), M['gold'])
        if k % 2 == (0 if sd < 0 else 1): slot(CO, CX + sd * 1.45 - sd * .5, z0 + 4.1, -sd * math.pi / 2, ['burg', 'navy', 'green', 'red', 'purple'][(k + sd) % 5])
        else: CO.box((CX + sd * 1.45, WH / 2, z0 + 4.1), (.5, WH, 2.3), M['wallpaper']); CO.box((CX + sd * 1.45, WH + .06, z0 + 4.1), (.58, .14, 2.38), M['gold'])
CO.box((CX, WH + .5, 0), (4.4, .5, 44), M['burgdd'])
for k in range(10): lamp_bar(CO, CX, WH + .22, -19 + k * 4.2, 1.6, .06, .5)
CO.finish(origin=(MX, 0, 0))

# ================================================= LABORATORIO (x = 4000) =================================================
LX = 4000.
LF = Obj('lab_floor'); LF.box((LX, -.15, 0), (16, .3, 16), M['tilep'])
LF.finish(origin=(LX, 0, 0))
LA = Obj('lab')
LA.box((LX, 2.2, -7.9), (16, 4.4, .5), M['mint']); LA.box((LX, .1, -7.62), (16, .2, .1), M['teal'])
for sd in (-1, 1): LA.box((LX + sd * 7.9, 2.2, 0), (.5, 4.4, 16), M['mint']); LA.box((LX + sd * 7.62, .1, 0), (.1, .2, 16), M['teal'])
LA.box((LX, 2.2, 7.9), (16, 4.4, .5), M['mint']); LA.box((LX, 4.5, 0), (16, .3, 16), M['white'])
for k in range(4): lamp_bar(LA, LX - 4.5 + k * 3, 4.3, 0, .8, .06, 12, 'white')
# mesa de trabajo con monitores de ondas, torre de ordenador y matraces
LA.box((LX - 4, .75, -6.2), (5.6, .1, 1.6), M['steel']); LA.box((LX - 4, .38, -6.2), (5.4, .76, 1.4), M['white'])
LA.box((LX - 5.2, 1.5, -6.6), (1.4, 1.0, .1), M['iron']); LA.box((LX - 5.2, 1.5, -6.52), (1.25, .85, .04), M['eeg'])
LA.box((LX - 3.4, 1.4, -6.6), (1.2, .8, .1), M['iron']); LA.box((LX - 3.4, 1.4, -6.52), (1.05, .65, .04), M['eeg'])
LA.cyl((LX - 5.2, .8, -6.6), (LX - 5.2, 1.0, -6.6), .06, M['steeld'], 6); LA.cyl((LX - 3.4, .8, -6.6), (LX - 3.4, 1.0, -6.6), .06, M['steeld'], 6)
LA.box((LX - 2.4, 1.1, -6.4), (.7, 1.1, .8), M['black'])
for k, c in enumerate(['green', 'pink', 'cyan', 'orange']): LA.cyl((LX - 6.4 + k * .35, .8, -5.8), (LX - 6.4 + k * .35, 1.15, -5.8), .1, M[c], 8); LA.cyl((LX - 6.4 + k * .35, 1.15, -5.8), (LX - 6.4 + k * .35, 1.3, -5.8), .04, M['steel'], 6)
LA.box((LX + 4.5, 3.0, -7.55), (5, 2.4, .1), M['white']); LA.box((LX + 4.5, 3.0, -7.5), (5.2, 2.6, .06), M['steel'])
LA.box((LX + 4.5, 3.0, -7.44), (4.8, 2.2, .04), M['chart'])
LA.box((LX + 7.0, 1.0, -2), (.9, 2.0, 5), M['white']); [LA.cyl((LX + 6.9, 1.2 + r * .55, -3.5 + k * .9), (LX + 6.9, 1.5 + r * .55, -3.5 + k * .9), .12, M[['green', 'pink', 'cyan', 'orange', 'purple'][(k + r) % 5]], 8) for r in range(3) for k in range(5)]
# sillón del experimento con apoyo de cabeza
LA.box((LX, .3, 2.5), (1.1, .5, 1.1), M['navy']); LA.box((LX, .85, 2.9), (1.1, 1.2, .2), M['navy']); LA.box((LX, 1.6, 3.0), (.55, .3, .2), M['steel'])
for sd in (-1, 1): LA.box((LX + sd * .6, .6, 2.5), (.14, .14, .9), M['steel'])
plant(LA, LX + 6.4, 6.4, .8)
LA.box((LX - 7.6, 1.2, 2), (.7, 2.4, 3), M['white']); LA.box((LX - 7.2, 2.2, 2), (.1, 1.0, 2.6), M['glass']); LA.box((LX - 7.2, .8, 2), (.1, 1.0, 2.6), M['teal'])
for k, c in enumerate(['red', 'blue', 'green']): LA.cyl((LX - 7.2 + .1, 2.5, 1.0 + k * 1.0), (LX - 7.2 + .1, 2.8, 1.0 + k * 1.0), .12, M[c], 8)
LA.finish(origin=(LX, 0, 0))

# ================================================= OBJETOS SUELTOS (se clonan en three.js) =================================================
SL = Obj('slot'); slot_local(SL, 'burg', 'slotglow', True); SL.finish(origin=(0, 0, 0))
# reloj de pared enorme (marco, esfera pintada) y sus agujas, aparte para poder girarlas
CK = Obj('clock_big'); CK.cyl((0, 0, 0), (0, 0, .18), 1.35, M['gold'], 28); CK.cyl((0, 0, .18), (0, 0, .24), 1.18, M['clockface'], 28)
for k in range(8): a = k / 8 * 2 * math.pi; CK.sph((math.sin(a) * 1.42, math.cos(a) * 1.42, .2), .1, M['goldd'], seg=6, rings=4)
CK.finish(origin=(0, 0, 0))
CM = Obj('hand_min'); CM.box((0, .55, 0), (.12, 1.15, .06), M['black']); CM.finish(origin=(0, 0, 0))
CHh = Obj('hand_hour'); CHh.box((0, .32, 0), (.2, .8, .06), M['iron']); CHh.sph((0, 0, .03), .11, M['gold'], seg=8, rings=5); CHh.finish(origin=(0, 0, 0))
# trapo negro con pliegues (para tapar el reloj) y lámina de plástico oscuro (para tapar el cristal)
CL = Obj('cloth'); CL.box((0, 0, 0), (3.1, 3.1, .12), M['cloth'])
for k in range(7): CL.box((-1.3 + k * .43, 0, .1), (.14, 3.05, .1), M['plastic'])
CL.box((0, 1.55, .05), (3.2, .16, .2), M['plastic']); CL.finish(origin=(0, 0, 0))
PL = Obj('plastic'); PL.box((0, 0, 0), (1, 1, .06), M['plastic'])
for k in range(10): PL.box((-.45 + k * .1, 0, .05), (.012, 1, .04), M['black'])
PL.finish(origin=(0, -.5, 0))
# electrodos / gorro de la prueba se hacen en 2D; aquí queda una tragaperras de laboratorio con cable
for k in (1, 2, 3): framed_obj('art%d' % k, 'art%d' % k, 2.3 if k != 2 else 1.7, 1.7 if k != 2 else 2.3)
for k, c in zip((1, 2, 3, 4), ('pink', 'cyan', 'yellow', 'orange')): sign_obj('icon%d' % k, 'icon%d' % k, c)
lay = dict(sites=dict(hall=[HX, 0], office=[OX, 0], glass=[GX, 0], maze=[MX, 0], lab=[LX, 0]), clock=dict(x=0, y=3.4, z=-17.85), maze=dict(n=N, cell=CELL, x0=x0, z0=z0, wall=WH), glassz=-18.7)
json.dump(lay, open(os.path.join(OUT, 'layout.json'), 'w'))
kw = dict(filepath=os.path.join(OUT, 'casino.glb'), export_format='GLB', export_apply=True)
try: bpy.ops.export_scene.gltf(**kw, export_vertex_color='ACTIVE', export_all_vertex_colors=False)
except TypeError: bpy.ops.export_scene.gltf(**kw)
print('EXPORT_OK')

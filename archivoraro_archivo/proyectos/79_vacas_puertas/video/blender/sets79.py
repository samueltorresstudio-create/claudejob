# 79 · bocetos de dos ideas: «Vacas con gafas de realidad virtual» y «La puerta pintada en la pared».
# Decorados A ESCALA REAL (vaca 1,45 m a la cruz, puerta 2,1 m, techos 3–5,5 m) con bordes redondeados. Coordenadas de three.js (x este, y arriba, z hacia la cámara).
# Sitios: barn (x=0) establo turco de día · meadow (1000) el prado que ven las vacas · hall (2000) pasillo de la residencia.
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
SG_N = [0]
def SG(site, c, size, m, origin, frame=None):
    # cartel/ventana/textura de una pieza = objeto propio (si no, todas las piezas del mismo material comparten una sola caja de UV y se estiran)
    SG_N[0] += 1; o = OB(f'{site}_sg{SG_N[0]}', .004); o.box(c, size, M[m]); o.finish(origin=origin); return o
random.seed(7)
P = dict(
    white='#ffffff', cream='#efe6d2', black='#26222c', iron='#3a3644', steel='#c9ced6', galv='#a9b0b8', wood='#8a5a34', woodd='#5a3a22', woodl='#b88a58',
    beam='#6a4426', red='#c8342c', redd='#8a2420', blue='#2c5fa8', green='#2f8a52', leaf='#3f9a3a', leafd='#2a7a2c', leafl='#6ac04a', trunk='#6a4426',
    hay='#e8c05a', hayd='#c89a3a', rubber='#2a2630', lamp='#fff2c0', concrete='#9a948a', pot='#6a4a3a', yellow='#f2c230', orange='#e8742a',
    fl_w='#fff8e8', fl_y='#ffd84a', fl_p='#ff7ab8', fl_v='#9a6ae0', fl_r='#e8423a', rock='#9a9488', mount='#5a6c90', mountd='#4a5a7e', snow='#f4f6fa',
    rail='#c89a62', gold='#e8b54a', fire='#ff8a2a', stove='#2a2626', bottleA='#c8822a', bottleB='#3a6ac8', bottleG='#3a9a5a', shopwood='#9a6a3a', snowm='#eef3f8', snowd='#c8d4e2', barnred='#a8342a', barnredd='#7a2420', pine='#1f4a32', bark='#4a3626', glassw='#ffd890', smoke='#b8bcc4', water='#5aa8e0', stone='#8a8478', cream2='#e8dcc0', crt='#3a3630', tvbody='#6a5038', chair='#4a7ab0', chaird='#2e5a8a', sofa='#c86a4a', tile='#e8e4da', ceil='#f2efe8', door='#e9e2d0', doorf='#b8ae98', steeld='#7a828c',
)
M = {k: mat(k, v) for k, v in P.items()}
PAINT = ['daysign', 'chalk2', 'sack', 'shopsign', 'win_snow', 'barnext', 'snowg', 'stain', 'tvscreen', 'radiof', 'photo', 'kit', 'barnwall', 'barnfloor', 'straw', 'plank', 'roof', 'win_day', 'chalk', 'calendar', 'vrbox', 'tankl', 'grass', 'hills', 'field', 'fence',
         'hallwall', 'wainscot', 'lino', 'ceilpanel', 'fluor', 'exitdoor', 'mural', 'exitsign', 'roomdoor', 'plate', 'hallwin', 'painting', 'clock', 'notice', 'keypad']
for n in PAINT: M[n] = mat(n, '#ffffff')

def bush(o, x, y, z, r=.45, n=9, ms=('leaf', 'leafd')):
    for k in range(n):
        a = k * 2.399; rr = r * (.35 + .55 * ((k * .618) % 1)); o.sph((x + math.cos(a) * rr * .9, y + r * .55 + (k % 3) * r * .22, z + math.sin(a) * rr * .6), r * (.42 + .1 * (k % 2)), M[ms[0] if k % 3 else ms[1]], seg=12, rings=8)
def tree(o, x, z, h=4.2, r=1.6):
    o.cyl((x, 0, z), (x, h * .55, z), .22, M['trunk'], 12, r1=.15)
    for k in range(11):
        a = k * 2.399; rr = r * (.2 + .55 * ((k * .618) % 1)); o.sph((x + math.cos(a) * rr, h * .62 + (k % 4) * r * .22, z + math.sin(a) * rr * .8), r * (.55 + .12 * (k % 3)), M[['leaf', 'leafd', 'leafl'][k % 3]], seg=14, rings=9)
def bale(o, x, y, z, ry=0.):
    def f(q):
        q.box((0, .2, 0), (1.0, .4, .5), M['hay'])
        for dx in (-.25, .25): q.box((dx, .2, 0), (.03, .42, .52), M['hayd'])
    grp(o, f, TR(x, y, z, ry))
def can(o, x, z, h=.7):
    o.cyl((x, 0, z), (x, h * .7, z), .2, M['steel'], 20); o.cyl((x, h * .7, z), (x, h * .85, z), .2, M['steel'], 20, r1=.12); o.cyl((x, h * .85, z), (x, h, z), .13, M['steel'], 18)
    o.torus((x, h * .45, z), .2, .015, M['steeld'], 20); o.torus((x + .19, h * .78, z), .06, .012, M['steeld'], 10, axis='Z')

# ================================================= ESTABLO (x = 0) =================================================
BX = 0.
BF = OB('barn_floor', 0)
BF.box((BX, -.1, -1), (16, .2, 16), M['barnfloor'])
BF.finish(origin=(BX, 0, 0))
B = OB('barn', .015)
HW = 3.2
B.box((BX, HW / 2, -6.2), (16, HW, .3), M['barnwall']); B.box((BX - 7.4, HW / 2, -1), (.3, HW, 14.5), M['barnwall']); B.box((BX + 7.4, HW / 2, -1), (.3, HW, 14.5), M['barnwall'])
B.box((BX, HW / 2, 6.2), (16, HW, .3), M['barnwall'])
# frontón trasero (triángulo) de tablones
B.prism([(BX - 7.6, HW), (BX + 7.6, HW), (BX, HW + 2.6)], -6.35, -6.05, M['plank'])
# tejado a dos aguas de chapa por dentro (tablas) + cerchas de madera
for sd in (-1, 1):
    ang = math.atan2(2.6, 7.6); L = math.hypot(7.6, 2.6) + .4
    def roof(q, sd=sd): q.box((0, 0, 0), (L, .08, 13.2), M['roof'])
    grp(B, roof, Matrix.Translation(Vector((BX + sd * 3.8, HW + 1.3 + .05, -.0))) @ Matrix.Rotation(sd * -ang, 4, 'Z'))
for z in (-5.0, -2.6, -.2, 2.2, 4.6):
    B.cyl((BX - 7.3, HW, z), (BX + 7.3, HW, z), .13, M['beam'], 6)
    B.cyl((BX - 7.3, HW, z), (BX, HW + 2.55, z), .12, M['beam'], 6); B.cyl((BX + 7.3, HW, z), (BX, HW + 2.55, z), .12, M['beam'], 6)
    B.cyl((BX, HW, z), (BX, HW + 2.55, z), .1, M['beam'], 6)
    for sd in (-1, 1): B.cyl((BX + sd * 3.4, HW, z), (BX + sd * 1.6, HW + 2.0, z), .09, M['beam'], 6)
B.box((BX, HW - .05, -5.95), (15.6, .36, .3), M['beam']); B.box((BX - 7.1, HW - .05, -1), (.3, .36, 14.4), M['beam']); B.box((BX + 7.1, HW - .05, -1), (.3, .36, 14.4), M['beam'])
B.cyl((BX, HW + 2.5, -6.1), (BX, HW + 2.5, 6.1), .1, M['beam'], 8)
# zócalo de cemento y ventanas con luz de día
B.box((BX, .45, -6.03), (15.6, .9, .1), M['concrete']); B.box((BX - 7.23, .45, -1), (.1, .9, 14), M['concrete']); B.box((BX + 7.23, .45, -1), (.1, .9, 14), M['concrete'])
for x in (BX - 5.2, BX + 5.2): SG('barn', (x, 2.2, -6.04), (1.4, 1.1, .08), 'win_snow', (BX, 0, 0)); B.box((x, 2.2, -6.08), (1.56, 1.26, .06), M['woodd']); B.box((x, 1.62, -5.95), (1.6, .07, .22), M['woodd']); B.box((x, 2.2, -6.0), (.06, 1.1, .06), M['woodd'])
for z in (-3.5, .5): SG('barn', (BX - 7.24, 2.2, z), (.08, 1.1, 1.4), 'win_snow', (BX, 0, 0)); B.box((BX - 7.28, 2.2, z), (.06, 1.26, 1.56), M['woodd'])
# portón corredero a la derecha (abierto: luz del exterior)
SG('barn', (BX + 7.25, 1.5, 2.6), (.06, 3.0, 2.6), 'win_snow', (BX, 0, 0)); B.box((BX + 7.1, 1.5, 4.4), (.12, 3.0, 1.4), M['red']); B.box((BX + 7.05, 3.08, 3.0), (.1, .1, 3.8), M['iron'])
for y in (.5, 1.5, 2.5): B.box((BX + 7.02, y, 4.4), (.04, .08, 1.3), M['redd'])
# cubículos: 4 plazas con separadores de tubo galvanizado, comedero de cemento con heno delante (las vacas miran a cámara)
STALLS = []
for k in range(5):
    x = BX - 3.0 + k * 1.5
    # separadores cortos, solo en la mitad del fondo (detrás de las vacas: nada del decorado delante de ellas)
    for y in (.55, 1.05): B.cyl((x, y, -6.0), (x, y, -5.05), .035, M['galv'], 10)
    B.cyl((x, 0, -5.05), (x, 1.15, -5.05), .045, M['galv'], 10); B.cyl((x, 0, -6.0), (x, 1.15, -6.0), .045, M['galv'], 10); B.cyl((x, 1.15, -5.05), (x, 1.15, -6.0), .045, M['galv'], 10)
    if k < 4: STALLS.append([x + .75, -4.5])
# pesebre de madera con heno contra la pared del fondo (DETRÁS de las vacas: nada del decorado delante de un personaje)
B.box((BX, .75, -5.85), (7.2, .5, .5), M['wood']); B.box((BX, 1.02, -5.85), (7.3, .06, .56), M['woodd'])
for k in range(18): B.sph((BX - 3.4 + k * .4 + random.uniform(-.08, .08), 1.05, -5.85 + random.uniform(-.1, .1)), .2, M['hay' if k % 2 else 'hayd'], sc=(1.4, .7, 1), seg=10, rings=6)
for k in range(13): x = BX - 3.6 + k * .6; B.cyl((x, 1.05, -5.62), (x, 1.45, -5.95), .02, M['woodd'], 6)
B.cyl((BX - 3.65, 1.45, -5.95), (BX + 3.65, 1.45, -5.95), .03, M['woodd'], 6)
# heno suelto por el suelo, a los lados (fuera de donde se ponen los personajes)
for k in range(60):
    x = random.choice([random.uniform(-6.8, -4.2), random.uniform(4.0, 6.8)]); z = random.uniform(-5.5, 3)
    B.sph((BX + x, .02, z), random.uniform(.12, .3), M['hay' if k % 2 else 'hayd'], sc=(1.5, .18, 1), seg=8, rings=4)
# pizarra con los litros (OBJETO CLAVE con texto), calendario y estante con cubos
SG('barn', (BX + 1.4, 2.45, -6.0), (1.3, .9, .06), 'chalk', (BX, 0, 0)); B.box((BX + 1.4, 2.45, -6.03), (1.42, 1.02, .05), M['wood']); B.box((BX + 1.4, 1.95, -5.95), (1.3, .05, .12), M['wood'])
for k in range(3): B.box((BX + 1.0 + k * .12, 1.99, -5.93), (.08, .03, .03), M['white'])
SG('barn', (BX - 1.6, 2.3, -6.0), (.55, .75, .02), 'calendar', (BX, 0, 0)); B.cyl((BX - 1.6, 2.7, -6.0), (BX - 1.6, 2.7, -5.95), .015, M['iron'], 6)
B.box((BX + 3.6, 1.7, -5.85), (1.6, .05, .35), M['woodd'])
for k in range(3): B.cyl((BX + 3.0 + k * .55, 1.73, -5.85), (BX + 3.0 + k * .55, 1.98, -5.85), .13, M['galv' if k != 1 else 'red'], 14, r1=.1)
# bombillas colgando del techo
LAMPS = []
for (x, z) in [(BX - 2.5, -3.5), (BX + 2.5, -3.5), (BX, 1.0)]:
    B.cyl((x, HW + 1.6, z), (x, 2.75, z), .008, M['black'], 6); B.cyl((x, 2.8, z), (x, 2.62, z), .2, M['green'], 16, r1=.05); B.sph((x, 2.6, z), .07, M['lamp'], seg=10, rings=6); LAMPS.append([x, 2.55, z])
# pacas de heno apiladas a la izquierda, horca y carretilla
for i, (x, y, z, r) in enumerate([(-6.2, 0, -5.2, 0), (-6.2, 0, -4.6, 0), (-6.2, .4, -4.9, 0), (-6.2, 0, -3.9, 0), (-5.1, 0, -5.4, 1.571), (-6.2, .4, -4.1, 0), (-6.2, .8, -4.6, 0)]):
    bale(B, BX + x, y, z, r)
B.cyl((BX - 5.0, 0, -4.7), (BX - 5.3, 1.55, -4.9), .022, M['woodl'], 8)
for dx in (-.08, 0, .08): B.cyl((BX - 5.0 + dx, 0, -4.68), (BX - 5.02 + dx, .3, -4.7), .01, M['steel'], 6)
def barrow(q):
    q.box((0, .5, 0), (.75, .3, .55), M['green']); q.box((0, .36, 0), (.6, .06, .45), M['green']); q.torus((.48, .2, 0), .2, .05, M['rubber'], 18, axis='Z')
    for sd in (-1, 1): q.cyl((.3, .4, sd * .22), (-.75, .55, sd * .25), .025, M['iron'], 8); q.cyl((-.3, .38, sd * .2), (-.32, 0, sd * .2), .02, M['iron'], 6)
grp(B, barrow, TR(BX - 4.6, 0, -.8, .4))
# tanque de leche de acero (texto LECHE) y bidones
TK_ = OB('barn_tank', .01); TK_.cyl((BX + 5.6, .3, -4.6), (BX + 5.6, 1.6, -4.6), .62, M['tankl'], 28); TK_.finish(origin=(BX, 0, 0))
B.cyl((BX + 5.05, .4, -4.25), (BX + 5.05, 1.5, -4.25), .04, M['glassw'], 10); B.cyl((BX + 5.05, .35, -4.25), (BX + 5.05, .42, -4.25), .06, M['steeld'], 10); B.cyl((BX + 5.05, 1.48, -4.25), (BX + 5.05, 1.55, -4.25), .06, M['steeld'], 10); B.sph((BX + 5.6, 1.6, -4.6), .62, M['steel'], sc=(1, .35, 1), seg=24, rings=10)
for (dx, dz) in [(-.45, -.45), (.45, -.45), (-.45, .45), (.45, .45)]: B.cyl((BX + 5.6 + dx, 0, -4.6 + dz), (BX + 5.6 + dx * .8, .35, -4.6 + dz * .8), .03, M['steeld'], 8)
can(B, BX + 4.6, -3.6); can(B, BX + 5.1, -3.3, .62); can(B, BX + 6.4, -3.4)
# mesa con la caja de las gafas (VR) y un taburete de ordeño
B.box((BX + 4.2, .82, -1.4), (1.3, .06, .7), M['woodl'])
for sx in (-1, 1):
    for sz in (-1, 1): B.box((BX + 4.2 + sx * .58, .4, -1.4 + sz * .28), (.06, .8, .06), M['woodd'])
SG('barn', (BX + 4.0, .95, -1.4), (.5, .36, .2), 'vrbox', (BX, 0, 0)); B.box((BX + 4.0, 1.14, -1.4), (.52, .02, .22), M['cream2']); B.box((BX + 4.55, .9, -1.35), (.28, .1, .18), M['black'])
B.cyl((BX + 2.8, 0, -1.0), (BX + 2.8, .38, -1.0), .02, M['woodd'], 6); B.cyl((BX + 2.8, .38, -1.0), (BX + 2.8, .42, -1.0), .17, M['wood'], 16)
SG('barn', (BX + .8, 2.0, 6.04), (1.6, 1.1, .01), 'stain', (BX, 0, 0)); B.box((BX + 3.2, 1.6, 6.03), (.5, .7, .02), M['woodl']); B.box((BX - 2.4, 2.2, 6.03), (.9, .05, .2), M['woodd'])
SG('barn', (BX + 2.75, 2.62, -5.99), (.5, .36, .03), 'daysign', (BX, 0, 0)); B.cyl((BX + 2.55, 2.8, -5.98), (BX + 2.75, 3.0, -5.98), .006, M['iron'], 4); B.cyl((BX + 2.95, 2.8, -5.98), (BX + 2.75, 3.0, -5.98), .006, M['iron'], 4)
for k in range(10): SGo = OB(f'barn_bx{k}', .01); SGo.box((BX + 5.0 + (k % 2) * .55, .18 + (k // 2) * .37, -.3 - (k % 3) * .02), (.52, .36, .36), M['vrbox']); SGo.finish(origin=(BX, 0, 0))
# mancha de humedad en la pared del fondo (la «misma pared» que miran las vacas)
SG('barn', (BX - .6, 2.1, -6.035), (1.6, 1.1, .01), 'stain', (BX, 0, 0))
# radio vieja en el estante, botiquín, foto de la vaca premiada, abrigo y gorro en un clavo, botas junto al portón
SG('barn', (BX + 3.0, 1.96, -5.82), (.36, .22, .14), 'radiof', (BX, 0, 0)); B.box((BX + 3.0, 1.96, -5.9), (.38, .24, .1), M['woodd']); B.cyl((BX + 3.12, 2.07, -5.82), (BX + 3.25, 2.4, -5.85), .006, M['steel'], 4)
SG('barn', (BX - 3.4, 2.2, -6.0), (.45, .5, .02), 'photo', (BX, 0, 0)); B.box((BX - 3.4, 2.2, -6.02), (.52, .58, .03), M['woodl'])
SG('barn', (BX + 6.6, 1.7, -6.0), (.42, .34, .14), 'kit', (BX, 0, 0))
B.cyl((BX + 6.2, 2.0, -6.0), (BX + 6.2, 2.0, -5.9), .015, M['iron'], 6)
B.box((BX + 6.2, 1.55, -5.85), (.55, .9, .14), M['green']); B.box((BX + 6.2, 1.98, -5.85), (.3, .08, .12), M['green']); B.sph((BX + 6.2, 2.06, -5.84), .14, M['iron'], sc=(1.2, .6, 1), seg=12, rings=6)
for dx in (-.12, .12): B.cyl((BX + 6.6 + dx, 0, 4.6), (BX + 6.6 + dx, .42, 4.6), .07, M['green'], 12); B.box((BX + 6.6 + dx, .05, 4.68), (.12, .1, .26), M['green'])
# ordeñadora colgada (cubo de acero con tubos)
B.cyl((BX - 2.6, 1.6, -5.85), (BX - 2.6, 1.98, -5.85), .16, M['steel'], 16); B.cyl((BX - 2.6, 1.98, -5.85), (BX - 2.6, 2.02, -5.85), .17, M['steeld'], 16)
for k in range(4): B.cyl((BX - 2.6, 2.0, -5.85), (BX - 2.75 + k * .1, 1.45, -5.75), .012, M['rubber'], 4)
# tele vieja en una repisa (pared izquierda, para las noticias) y rollo de cuerda
B.box((BX - 7.0, 1.45, -1.8), (.4, .05, .7), M['woodd'])
for dz in (-.25, .25): B.cyl((BX - 7.2, 1.42, -1.8 + dz), (BX - 6.9, 1.2, -1.8 + dz), .02, M['iron'], 6)
B.box((BX - 6.98, 1.72, -1.8), (.42, .48, .58), M['tvbody']); SG('barn', (BX - 6.76, 1.74, -1.8), (.02, .36, .44), 'tvscreen', (BX, 0, 0))
B.cyl((BX - 7.05, 1.96, -1.7), (BX - 7.0, 2.2, -1.55), .006, M['steel'], 4); B.cyl((BX - 7.05, 1.96, -1.9), (BX - 7.0, 2.2, -2.05), .006, M['steel'], 4)
B.torus((BX - 6.6, .08, -5.4), .25, .06, M['hayd'], 18); B.torus((BX - 6.6, .18, -5.4), .2, .06, M['hayd'], 18)
B.finish(origin=(BX, 0, 0))

# ================================================= PRADO (x = 1000) — lo que ven las vacas =================================================
MX = 1000.
MF = OB('meadow_floor', 0)
MF.box((MX, -.1, -20), (120, .2, 80), M['grass'])
MF.finish(origin=(MX, 0, 0))
MD = OB('meadow', .02)
for (x, z, rx, ry, rz) in [(-30, -48, 26, 9, 14), (8, -55, 30, 12, 16), (40, -46, 22, 8, 12), (-8, -38, 18, 4.5, 9), (24, -34, 14, 3.5, 8)]:
    MD.sph((MX + x, -1, z), 1, M['hills'], sc=(rx, ry, rz), seg=40, rings=20)
for (x, z, h, r) in [(-26, -95, 34, 22), (-4, -105, 46, 26), (22, -98, 38, 22), (48, -100, 30, 18), (-14, -92, 24, 14), (34, -90, 22, 13), (8, -96, 28, 15)]:
    MD.cyl((MX + x, 0, z), (MX + x, h, z), r, M['mount'], 9, r1=.8); MD.cyl((MX + x, h * .8, z), (MX + x, h + .2, z), r * .22, M['snow'], 9, r1=.9)
    for j in range(3): dx = random.uniform(-.6, .6) * r; MD.cyl((MX + x + dx, 0, z + 4 + j), (MX + x + dx * .8, h * random.uniform(.4, .62), z + 4 + j), r * random.uniform(.45, .7), M['mountd'], 7, r1=.5)
for (x, z) in [(-6, -10), (7, -12), (-11, -7), (12, -8), (-3, -18), (9, -22)]: bush(MD, MX + x, 0, z, .9, 12, ('leafl', 'leaf'))
for (x, z, h, r) in [(-9, -16, 5.2, 2.0), (-12, -20, 4.4, 1.7), (11, -18, 6, 2.2), (15, -24, 4.8, 1.8), (-20, -28, 5, 2), (30, -30, 5.5, 2.1), (4, -32, 4.6, 1.6)]:
    tree(MD, MX + x, z, h, r)
# valla de madera que se pierde a lo lejos
FEN = [(-14 + k * 2.2, -9 - k * .9) for k in range(14)]
for (x, z) in FEN: MD.box((MX + x, .6, z), (.14, 1.2, .14), M['wood'])
for k in range(len(FEN) - 1):
    (x0, z0), (x1, z1) = FEN[k], FEN[k + 1]
    for y in (.45, .95): MD.cyl((MX + x0, y, z0), (MX + x1, y, z1), .05, M['woodl'], 8)
# flores, rocas y mariposas (posición) — margaritas por todas partes
FLW = OB('meadow_fl', 0)
FLOW = []
for cl in range(34):
    cx, cz = random.uniform(-13, 13), random.uniform(-24, 3)
    if abs(cx) < 1.8 and cz > -7: continue
    col = random.choice(['fl_w', 'fl_w', 'fl_y', 'fl_p', 'fl_v', 'fl_r'])
    for k in range(random.randint(6, 12)):
        x = cx + random.gauss(0, .55); z = cz + random.gauss(0, .45); h = random.uniform(.18, .34)
        FLW.cyl((MX + x, 0, z), (MX + x + random.uniform(-.03, .03), h, z), .01, M['leafd'], 4)
        for sd in (-1, 1): FLW.sph((MX + x + sd * .04, h * .35, z), .045, M['leaf'], sc=(1.4, .35, .7), seg=6, rings=4)
        for p_ in range(5): a_ = p_ * 1.2566; FLW.sph((MX + x + math.cos(a_) * .045, h, z + math.sin(a_) * .045), .035, M[col], sc=(1, .45, 1), seg=6, rings=4)
        FLW.sph((MX + x, h + .012, z), .025, M['fl_y' if col != 'fl_y' else 'orange'], seg=6, rings=4)
FLW.finish(origin=(MX, 0, 0))
for (x, z, r) in [(-4.5, -6, .5), (5.2, -9, .7), (-7, -12, .4), (3.4, -3.5, .3)]: MD.ico((MX + x, r * .4, z), r, M['rock'], sc=(1.3, .7, 1), sub=2)
# un riachuelo (cinta azul) y un cartel de madera «VERANO»
for k in range(16):
    x = -16 + k * 2.2; z = -14 + math.sin(k * .6) * 1.8; MD.box((MX + x, .01, z), (2.4, .02, 1.0), M['water'], ry=-math.cos(k * .6) * .5)
    for sd in (-1, 1): MD.ico((MX + x + random.uniform(-.8, .8), .05, z + sd * .62), random.uniform(.12, .22), M['stone'], sc=(1.3, .6, 1), sub=1)
MD.cyl((MX + 3.6, 0, -4.2), (MX + 3.6, 1.2, -4.2), .05, M['woodd'], 8); MD.box((MX + 3.6, 1.25, -4.18), (.9, .4, .06), M['plank'])
MD.finish(origin=(MX, 0, 0))

# ================================================= EXTERIOR NEVADO (x = 3000) =================================================
SX = 3000.
SF = OB('snow_floor', 0); SF.box((SX, -.1, -20), (140, .2, 90), M['snowg']); SF.finish(origin=(SX, 0, 0))
S = OB('snow', .02)
for k in range(40):   # montículos y ventisqueros (la nieve tiene relieve, no es un plano liso)
    x = random.uniform(-30, 30); z = random.uniform(-40, 8)
    if abs(x) < 3 and z > -8: continue
    S.sph((SX + x, -.15, z), 1, M['snowm'], sc=(random.uniform(1.5, 4), random.uniform(.35, .8), random.uniform(1, 2.5)), seg=16, rings=8)
for (x, z, rx, ry, rz) in [(-40, -70, 30, 10, 14), (10, -80, 40, 14, 18), (55, -66, 26, 9, 12)]: S.sph((SX + x, -1, z), 1, M['snowm'], sc=(rx, ry, rz), seg=32, rings=16)
# establo rojo (fachada hacia +z) con tejado nevado, portón, ventanas con luz cálida y chimenea con humo
EB = 6.5; S.box((SX, 2.2, -10), (12, 4.4, 8), M['barnext'])
S.prism([(SX - 6.2, 4.4), (SX + 6.2, 4.4), (SX, 7.0)], -14.05, -5.95, M['barnext'])
for sd in (-1, 1):
    ang = math.atan2(2.6, 6.2); L = math.hypot(6.2, 2.6) + .5
    def sroof(q, sd=sd): q.box((0, 0, 0), (L, .14, 8.6), M['iron']); q.box((0, .14, 0), (L, .16, 8.7), M['snowm'])
    grp(S, sroof, Matrix.Translation(Vector((SX + sd * 3.1, 5.75, -10))) @ Matrix.Rotation(sd * -ang, 4, 'Z'))
S.box((SX, 1.5, -5.94), (3.0, 3.0, .08), M['barnredd']); S.box((SX, 1.5, -5.9), (.08, 3.0, .06), M['white'])
for d in ((-1.5, 0), (1.5, 0)): S.box((SX + d[0], 1.5, -5.9), (.1, 3.1, .06), M['white'])
S.box((SX, 3.05, -5.9), (3.2, .1, .06), M['white']); S.cyl((SX - 1.5, 1.5, -5.88), (SX + 1.5, 0, -5.88), .03, M['white'], 6); S.cyl((SX + 1.5, 1.5, -5.88), (SX - 1.5, 0, -5.88), .03, M['white'], 6)
for x in (SX - 4.0, SX + 4.0): SG('snow', (x, 2.4, -5.95), (1.0, .9, .06), 'glassw', (SX, 0, 0)); S.box((x, 2.4, -5.92), (1.12, 1.02, .04), M['white']); S.box((x, 1.92, -5.85), (1.2, .1, .2), M['snowm'])
S.box((SX + 3.6, 5.6, -11), (.6, 2.6, .6), M['barnredd']); S.box((SX + 3.6, 6.95, -11), (.75, .12, .75), M['snowm'])
for k in range(6): S.sph((SX + 3.6 + k * .35, 7.3 + k * .55, -11 - k * .2), .3 + k * .12, M['smoke'], seg=10, rings=6)
# valla con nieve encima a los lados del camino, farola, tractor viejo cubierto de nieve, árboles desnudos y pinos
for k in range(9):
    for sd in (-1, 1):
        x = SX + sd * (2.4 + k * .1); z = -5 + k * 1.6; S.box((x, .55, z), (.12, 1.1, .12), M['wood']); S.sph((x, 1.12, z), .1, M['snowm'], sc=(1, .5, 1), seg=8, rings=4)
        if k < 8: S.cyl((x, .8, z), (SX + sd * (2.5 + k * .1), .8, z + 1.6), .04, M['woodl'], 6); S.box((x + sd * .05, .86, z + .8), (.08, .05, 1.6), M['snowm'])
def tractor(q):
    q.box((0, .9, 0), (1.4, .8, 1.0), M['orange']); q.box((-.45, 1.55, 0), (.6, .6, .9), M['orange']); q.box((-.45, 1.9, 0), (.8, .1, 1.05), M['snowm']); q.box((.2, 1.33, 0), (1.0, .08, 1.02), M['snowm'])
    for (dx, r) in ((-.5, .55), (.55, .35)):
        for sd in (-1, 1): q.torus((dx, r, sd * .6), r, r * .3, M['rubber'], 20, axis='Z')
    q.cyl((.4, 1.3, .3), (.4, 1.9, .3), .05, M['iron'], 8)
grp(S, tractor, TR(SX + 8.5, 0, -6.5, .5))
def bare(q, h=5):
    q.cyl((0, 0, 0), (0, h, 0), .2, M['bark'], 8, r1=.06)
    for k in range(7):
        a = k * 2.3; y0 = h * (.35 + .08 * k); L = h * (.45 - .04 * k)
        q.cyl((0, y0, 0), (math.cos(a) * L, y0 + L * .7, math.sin(a) * L * .6), .07, M['bark'], 6, r1=.015)
        q.sph((math.cos(a) * L * .7, y0 + L * .55, math.sin(a) * L * .4), .12, M['snowm'], sc=(1.6, .4, 1), seg=6, rings=4)
for (x, z, h) in [(-7, -12, 5.5), (-11, -6, 4.6), (9, -15, 6), (13, -3, 4.2)]: grp(S, lambda q, h=h: bare(q, h), TR(SX + x, 0, z))
for (x, z, h) in [(-16, -20, 6), (-19, -14, 5), (17, -22, 7), (21, -12, 5.5), (-24, -30, 7), (26, -30, 6)]:
    for j in range(3): S.cyl((SX + x, h * (.15 + j * .25), z), (SX + x, h * (.55 + j * .2), z), h * (.32 - j * .08), M['pine'], 9, r1=.05); S.cyl((SX + x, h * (.4 + j * .23), z), (SX + x, h * (.55 + j * .2), z), h * (.16 - j * .04), M['snowm'], 9, r1=.04)
S.cyl((SX - 4.2, 0, -4.8), (SX - 4.2, 3.6, -4.8), .06, M['iron'], 8); S.cyl((SX - 4.2, 3.6, -4.8), (SX - 3.6, 3.6, -4.8), .04, M['iron'], 6); S.sph((SX - 3.55, 3.48, -4.8), .12, M['glassw'], seg=10, rings=6)
# a lo lejos, el pueblo con su mezquita (Turquía) — cúpula y minarete
S.sph((SX - 18, 2, -55), 3.2, M['snowd'], sc=(1, .8, 1), seg=20, rings=10); S.box((SX - 18, 1, -55), (7, 2.4, 7), M['cream2']); S.cyl((SX - 13, 0, -55), (SX - 13, 11, -55), .5, M['cream2'], 12); S.cyl((SX - 13, 11, -55), (SX - 13, 13.5, -55), .55, M['iron'], 12, r1=.02)
for (x, z) in [(-28, -58), (-8, -60), (4, -62), (-34, -52)]: S.box((SX + x, 1.6, z), (5, 3.2, 4), M['cream2']); S.box((SX + x, 3.35, z), (5.4, .3, 4.4), M['snowm'])
S.finish(origin=(SX, 0, 0))

# ================================================= ESTABLO LARGO (x = 4000) — el sueño de las 180 vacas =================================================
LX = 4000.; LL = 44.
LF = OB('long_floor', 0); LF.box((LX, -.1, -LL / 2 + 6), (14, .2, LL + 4), M['barnfloor']); LF.finish(origin=(LX, 0, 0))
LB = OB('long', .015)
for sd in (-1, 1): LB.box((LX + sd * 7, 1.6, -LL / 2 + 6), (.3, 3.2, LL + 4), M['barnwall'])
LB.box((LX, 1.6, -LL + 4), (14, 3.2, .3), M['barnwall'])
for sd in (-1, 1):
    ang = math.atan2(2.2, 7); L = math.hypot(7, 2.2) + .4
    def lroof(q): q.box((0, 0, 0), (L, .08, LL + 4), M['roof'])
    grp(LB, lroof, Matrix.Translation(Vector((LX + sd * 3.5, 4.3, -LL / 2 + 6))) @ Matrix.Rotation(sd * -ang, 4, 'Z'))
LONGLAMPS = []
for k in range(15):
    z = 4 - k * 3
    LB.cyl((LX - 7, 3.2, z), (LX + 7, 3.2, z), .12, M['beam'], 6); LB.cyl((LX - 7, 3.2, z), (LX, 5.3, z), .1, M['beam'], 6); LB.cyl((LX + 7, 3.2, z), (LX, 5.3, z), .1, M['beam'], 6)
    for sd in (-1, 1):
        LB.cyl((LX + sd * 2.0, 0, z), (LX + sd * 2.0, 1.15, z), .045, M['galv'], 8)
        for y in (.55, 1.05): LB.cyl((LX + sd * 2.0, y, z), (LX + sd * 6.6, y, z), .035, M['galv'], 8)
    if k % 2 == 0: LB.cyl((LX, 3.0, z), (LX, 2.75, z), .2, M['green'], 14, r1=.05); LB.sph((LX, 2.72, z), .07, M['lamp'], seg=8, rings=6); LONGLAMPS.append([LX, 2.6, z])
for sd in (-1, 1): LB.box((LX + sd * 6.6, .75, -LL / 2 + 6), (.5, .5, LL), M['wood'])
LB.finish(origin=(LX, 0, 0))


# ================================================= ESTABLO DEL VECINO (x = 5000): estufa, sacos de pienso caro, vitaminas, pizarra con 22 =================================================
VX = 5000.
VF = OB('vbarn_floor', 0); VF.box((VX, -.1, -1), (13, .2, 13), M['barnfloor']); VF.finish(origin=(VX, 0, 0))
V = OB('vbarn', .015)
V.box((VX, 1.6, -6.2), (13, 3.2, .3), M['barnwall']); V.box((VX - 6.4, 1.6, -1), (.3, 3.2, 10.5), M['barnwall']); V.box((VX + 6.4, 1.6, -1), (.3, 3.2, 10.5), M['barnwall']); V.box((VX, 1.6, 4.2), (13, 3.2, .3), M['barnwall'])
V.box((VX, .45, -6.03), (12.6, .9, .1), M['concrete'])
V.prism([(VX - 6.6, 3.2), (VX + 6.6, 3.2), (VX, 5.4)], -6.35, -6.05, M['plank'])
for sd in (-1, 1):
    ang = math.atan2(2.2, 6.6); L = math.hypot(6.6, 2.2) + .4
    def vroof(q, sd=sd): q.box((0, 0, 0), (L, .08, 10.8), M['roof'])
    grp(V, vroof, Matrix.Translation(Vector((VX + sd * 3.3, 4.3, -1))) @ Matrix.Rotation(sd * -ang, 4, 'Z'))
for z in (-5.0, -2.6, -.2, 2.2):
    V.cyl((VX - 6.3, 3.2, z), (VX + 6.3, 3.2, z), .13, M['beam'], 6); V.cyl((VX - 6.3, 3.2, z), (VX, 5.3, z), .12, M['beam'], 6); V.cyl((VX + 6.3, 3.2, z), (VX, 5.3, z), .12, M['beam'], 6)
V.box((VX, 3.15, -5.95), (12.6, .36, .3), M['beam'])
VSTALLS = []
for k in range(4):
    x = VX - 5.4 + k * 1.5
    for y in (.55, 1.05): V.cyl((x, y, -6.0), (x, y, -5.05), .035, M['galv'], 10)
    V.cyl((x, 0, -5.05), (x, 1.15, -5.05), .045, M['galv'], 10); V.cyl((x, 0, -6.0), (x, 1.15, -6.0), .045, M['galv'], 10); V.cyl((x, 1.15, -5.05), (x, 1.15, -6.0), .045, M['galv'], 10)
    if k < 3: VSTALLS.append([x + .75, -4.5])
V.box((VX - 3.15, .75, -5.85), (4.6, .5, .5), M['wood'])
for k in range(11): V.sph((VX - 5.2 + k * .42, 1.05, -5.85), .2, M['hay' if k % 2 else 'hayd'], sc=(1.4, .7, 1), seg=10, rings=6)
# ESTUFA de hierro con fuego dentro y el tubo que sube al tejado
V.box((VX + 4.2, .5, -4.6), (.8, .9, .7), M['stove']); V.box((VX + 4.2, .98, -4.6), (.9, .06, .8), M['iron'])
for (dx, dz) in [(-.3, -.25), (.3, -.25), (-.3, .25), (.3, .25)]: V.cyl((VX + 4.2 + dx, 0, -4.6 + dz), (VX + 4.2 + dx, .08, -4.6 + dz), .05, M['iron'], 8)
V.box((VX + 4.2, .5, -4.24), (.42, .32, .02), M['fire']); V.box((VX + 4.2, .5, -4.23), (.5, .4, .01), M['iron'])
for k in range(3): V.cyl((VX + 4.02 + k * .18, .34, -4.225), (VX + 4.02 + k * .18, .66, -4.225), .012, M['iron'], 4)
V.cyl((VX + 4.2, 1.0, -4.75), (VX + 4.2, 3.0, -4.75), .09, M['stove'], 12); V.cyl((VX + 4.2, 3.0, -4.75), (VX + 4.2, 4.6, -5.6), .09, M['stove'], 12)
for k in range(4): V.box((VX + 5.2, .15 + k * .2, -4.4 + (k % 2) * .1), (.5, .14, .2), M['woodd'])
# SACOS DE PIENSO (cada saco con su texto) y botes de vitaminas en una estantería
for k, (x, y, z, ry) in enumerate([(-.6, .2, -5.3, 0), (.05, .2, -5.3, .05), (.7, .2, -5.35, -.04), (-.3, .56, -5.3, .03), (.4, .56, -5.32, -.05), (.05, .92, -5.3, .02)]):
    Sk = OB(f'vbarn_sk{k}', .06); Sk.box((VX + 1.6 + x, y, z), (.62, .36, .9), M['sack'], ry=ry); Sk.finish(origin=(VX, 0, 0))
V.box((VX + 5.3, 1.5, -5.85), (1.4, .05, .3), M['woodd']); V.box((VX + 5.3, 2.0, -5.85), (1.4, .05, .3), M['woodd'])
for k in range(7):
    for y0 in (1.53, 2.03): V.cyl((VX + 4.75 + k * .18, y0, -5.85), (VX + 4.75 + k * .18, y0 + .2, -5.85), .055, M[['bottleA', 'bottleB', 'bottleG', 'white'][(k + int(y0 * 10)) % 4]], 10); V.cyl((VX + 4.75 + k * .18, y0 + .2, -5.85), (VX + 4.75 + k * .18, y0 + .24, -5.85), .04, M['white'], 8)
SG('vbarn', (VX + 1.6, 2.4, -6.0), (1.3, .9, .06), 'chalk2', (VX, 0, 0)); V.box((VX + 1.6, 2.4, -6.03), (1.42, 1.02, .05), M['wood'])
SG('vbarn', (VX - 6.24, 2.2, -2.5), (.08, 1.1, 1.4), 'win_snow', (VX, 0, 0)); V.box((VX - 6.28, 2.2, -2.5), (.06, 1.26, 1.56), M['woodd'])
VLAMPS = []
for (x, z) in [(VX - 2.4, -3.3), (VX + 2.4, -3.3)]:
    V.cyl((x, 4.2, z), (x, 2.75, z), .008, M['black'], 6); V.cyl((x, 2.8, z), (x, 2.62, z), .2, M['red'], 16, r1=.05); V.sph((x, 2.6, z), .07, M['lamp'], seg=10, rings=6); VLAMPS.append([x, 2.55, z])
V.finish(origin=(VX, 0, 0))

# ================================================= TIENDA DEL PUEBLO (x = 6000): sacos de pienso a la izquierda, cajas de gafas a la derecha =================================================
TX = 6000.
TF = OB('shop_floor', 0); TF.box((TX, -.1, 0), (9, .2, 9), M['plank']); TF.finish(origin=(TX, 0, 0))
T_ = OB('shop', .012)
T_.box((TX, 1.5, -3.6), (9, 3.0, .3), M['hallwall']); T_.box((TX - 4.3, 1.5, 0), (.3, 3.0, 8), M['hallwall']); T_.box((TX + 4.3, 1.5, 0), (.3, 3.0, 8), M['hallwall'])
T_.box((TX, .5, -3.44), (8.6, 1.0, .02), M['wainscot']); T_.box((TX, 3.05, 0), (9, .1, 8), M['ceil'])
for sd, mat in ((-1, 'sack'), (1, 'vrbox')):
    x0 = TX + sd * 2.2
    for y in (.4, 1.1, 1.8, 2.5): T_.box((x0, y, -3.25), (2.6, .05, .4), M['shopwood'])
    for sx in (-1.3, 1.3): T_.box((x0 + sx, 1.45, -3.25), (.06, 2.9, .42), M['shopwood'])
    for y in (.43, 1.13, 1.83):
        for k in range(4):
            So = OB(f'shop_it{sd}{int(y*10)}{k}', .02); So.box((x0 - .9 + k * .6, y + (.17 if mat == 'sack' else .18), -3.25), (.5, .34 if mat == 'sack' else .36, .34), M[mat]); So.finish(origin=(TX, 0, 0))
SG('shop', (TX, 2.75, -3.42), (2.4, .45, .03), 'shopsign', (TX, 0, 0))
T_.box((TX + 3.0, .5, -1.2), (1.6, 1.0, .7), M['shopwood']); T_.box((TX + 3.0, 1.02, -1.2), (1.7, .05, .8), M['woodd'])
T_.box((TX + 3.3, 1.2, -1.25), (.45, .32, .38), M['gold']); T_.box((TX + 3.3, 1.42, -1.33), (.35, .14, .1), M['black'])
SG('shop', (TX - 4.14, 1.6, .5), (.04, 1.2, 1.2), 'win_snow', (TX, 0, 0)); T_.box((TX - 4.16, 1.6, .5), (.04, 1.32, 1.32), M['white'])
T_.cyl((TX, 3.0, -.8), (TX, 2.6, -.8), .01, M['black'], 6); T_.cyl((TX, 2.62, -.8), (TX, 2.45, -.8), .22, M['green'], 16, r1=.06); T_.sph((TX, 2.44, -.8), .07, M['lamp'], seg=10, rings=6)
T_.finish(origin=(TX, 0, 0))

lay = dict(sites=dict(vbarn=[VX, 0], shop=[TX, 0], barn=[BX, 0], meadow=[MX, 0], snow=[SX, 0], long=[LX, 0]), longLamps=LONGLAMPS, vstalls=VSTALLS, vlamps=VLAMPS, stalls=STALLS, lamps=LAMPS)
json.dump(lay, open(os.path.join(OUT, 'layout.json'), 'w'))
kw = dict(filepath=os.path.join(OUT, 'sets79.glb'), export_format='GLB', export_apply=True)
try: bpy.ops.export_scene.gltf(**kw, export_vertex_color='ACTIVE', export_all_vertex_colors=False)
except TypeError: bpy.ops.export_scene.gltf(**kw)
print('EXPORT_OK')

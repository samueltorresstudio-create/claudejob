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
random.seed(7)
P = dict(
    white='#ffffff', cream='#efe6d2', black='#26222c', iron='#3a3644', steel='#c9ced6', galv='#a9b0b8', wood='#8a5a34', woodd='#5a3a22', woodl='#b88a58',
    beam='#6a4426', red='#c8342c', redd='#8a2420', blue='#2c5fa8', green='#2f8a52', leaf='#3f9a3a', leafd='#2a7a2c', leafl='#6ac04a', trunk='#6a4426',
    hay='#e8c05a', hayd='#c89a3a', rubber='#2a2630', lamp='#fff2c0', concrete='#9a948a', pot='#6a4a3a', yellow='#f2c230', orange='#e8742a',
    fl_w='#fff8e8', fl_y='#ffd84a', fl_p='#ff7ab8', fl_v='#9a6ae0', fl_r='#e8423a', rock='#9a9488', mount='#6a7c9e', mountd='#56688a', snow='#f4f6fa',
    rail='#c89a62', chair='#4a7ab0', chaird='#2e5a8a', sofa='#c86a4a', tile='#e8e4da', ceil='#f2efe8', door='#e9e2d0', doorf='#b8ae98', steeld='#7a828c',
)
M = {k: mat(k, v) for k, v in P.items()}
PAINT = ['barnwall', 'barnfloor', 'straw', 'plank', 'roof', 'win_day', 'chalk', 'calendar', 'vrbox', 'tankl', 'grass', 'hills', 'field', 'fence',
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
    B.cyl((BX - 7.3, HW, z), (BX + 7.3, HW, z), .09, M['beam'], 8)
    B.cyl((BX - 7.3, HW, z), (BX, HW + 2.55, z), .08, M['beam'], 8); B.cyl((BX + 7.3, HW, z), (BX, HW + 2.55, z), .08, M['beam'], 8)
    B.cyl((BX, HW, z), (BX, HW + 2.55, z), .07, M['beam'], 8)
    for sd in (-1, 1): B.cyl((BX + sd * 3.4, HW, z), (BX + sd * 1.6, HW + 2.0, z), .06, M['beam'], 8)
B.cyl((BX, HW + 2.5, -6.1), (BX, HW + 2.5, 6.1), .1, M['beam'], 8)
# zócalo de cemento y ventanas con luz de día
B.box((BX, .45, -6.03), (15.6, .9, .1), M['concrete']); B.box((BX - 7.23, .45, -1), (.1, .9, 14), M['concrete']); B.box((BX + 7.23, .45, -1), (.1, .9, 14), M['concrete'])
for x in (BX - 5.2, BX + 5.2): B.box((x, 2.2, -6.04), (1.4, 1.1, .08), M['win_day']); B.box((x, 2.2, -6.08), (1.56, 1.26, .06), M['woodd']); B.box((x, 1.62, -5.95), (1.6, .07, .22), M['woodd']); B.box((x, 2.2, -6.0), (.06, 1.1, .06), M['woodd'])
for z in (-3.5, .5): B.box((BX - 7.24, 2.2, z), (.08, 1.1, 1.4), M['win_day']); B.box((BX - 7.28, 2.2, z), (.06, 1.26, 1.56), M['woodd'])
# portón corredero a la derecha (abierto: luz del exterior)
B.box((BX + 7.25, 1.5, 2.6), (.06, 3.0, 2.6), M['win_day']); B.box((BX + 7.1, 1.5, 4.4), (.12, 3.0, 1.4), M['red']); B.box((BX + 7.05, 3.08, 3.0), (.1, .1, 3.8), M['iron'])
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
for k in range(13): x = BX - 3.6 + k * .6; B.cyl((x, 1.05, -5.62), (x, 1.75, -5.95), .02, M['woodd'], 6)
B.cyl((BX - 3.65, 1.75, -5.95), (BX + 3.65, 1.75, -5.95), .03, M['woodd'], 6)
# heno suelto por el suelo, a los lados (fuera de donde se ponen los personajes)
for k in range(60):
    x = random.choice([random.uniform(-6.8, -4.2), random.uniform(4.0, 6.8)]); z = random.uniform(-5.5, 3)
    B.sph((BX + x, .02, z), random.uniform(.12, .3), M['hay' if k % 2 else 'hayd'], sc=(1.5, .18, 1), seg=8, rings=4)
# pizarra con los litros (OBJETO CLAVE con texto), calendario y estante con cubos
B.box((BX + 1.4, 2.1, -6.0), (1.3, .9, .06), M['chalk']); B.box((BX + 1.4, 2.1, -6.03), (1.42, 1.02, .05), M['wood'])
B.box((BX - 1.6, 2.25, -6.0), (.55, .75, .02), M['calendar'])
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
B.cyl((BX + 5.6, .3, -4.6), (BX + 5.6, 1.6, -4.6), .62, M['tankl'], 28); B.sph((BX + 5.6, 1.6, -4.6), .62, M['steel'], sc=(1, .35, 1), seg=24, rings=10)
for (dx, dz) in [(-.45, -.45), (.45, -.45), (-.45, .45), (.45, .45)]: B.cyl((BX + 5.6 + dx, 0, -4.6 + dz), (BX + 5.6 + dx * .8, .35, -4.6 + dz * .8), .03, M['steeld'], 8)
can(B, BX + 4.6, -3.6); can(B, BX + 5.1, -3.3, .62); can(B, BX + 6.4, -3.4)
# mesa con la caja de las gafas (VR) y un taburete de ordeño
B.box((BX + 4.2, .82, -1.4), (1.3, .06, .7), M['woodl'])
for sx in (-1, 1):
    for sz in (-1, 1): B.box((BX + 4.2 + sx * .58, .4, -1.4 + sz * .28), (.06, .8, .06), M['woodd'])
B.box((BX + 4.0, .95, -1.4), (.5, .2, .36), M['vrbox']); B.box((BX + 4.55, .9, -1.35), (.28, .1, .18), M['black'])
B.cyl((BX + 2.8, 0, -1.0), (BX + 2.8, .38, -1.0), .02, M['woodd'], 6); B.cyl((BX + 2.8, .38, -1.0), (BX + 2.8, .42, -1.0), .17, M['wood'], 16)
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
    MD.cyl((MX + x, 0, z), (MX + x, h, z), r, M['mount'], 9, r1=.8); MD.cyl((MX + x, h * .66, z), (MX + x, h + .2, z), r * .36, M['snow'], 9, r1=.9)
    MD.cyl((MX + x + r * .45, 0, z + 3), (MX + x + r * .35, h * .62, z + 3), r * .7, M['mountd'], 7, r1=.6)
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
FLOW = []
for k in range(260):
    x = random.uniform(-14, 14); z = random.uniform(-26, 4)
    if abs(x) < 1.6 and z > -6: continue
    c = random.choice(['fl_w', 'fl_w', 'fl_y', 'fl_p', 'fl_v', 'fl_r'])
    MD.cyl((MX + x, 0, z), (MX + x, .22, z), .008, M['leafd'], 4); MD.sph((MX + x, .24, z), .055, M[c], sc=(1, .5, 1), seg=8, rings=4)
    if c == 'fl_w': MD.sph((MX + x, .26, z), .022, M['fl_y'], seg=6, rings=4)
for (x, z, r) in [(-4.5, -6, .5), (5.2, -9, .7), (-7, -12, .4), (3.4, -3.5, .3)]: MD.ico((MX + x, r * .4, z), r, M['rock'], sc=(1.3, .7, 1), sub=2)
# un riachuelo (cinta azul) y un cartel de madera «VERANO»
for k in range(16):
    x = -16 + k * 2.2; z = -14 + math.sin(k * .6) * 1.8; MD.box((MX + x, .01, z), (2.4, .02, 1.0), M['blue'], ry=-math.cos(k * .6) * .5)
MD.cyl((MX + 3.6, 0, -4.2), (MX + 3.6, 1.2, -4.2), .05, M['woodd'], 8); MD.box((MX + 3.6, 1.25, -4.18), (.9, .4, .06), M['plank'])
MD.finish(origin=(MX, 0, 0))

# ================================================= PASILLO DE LA RESIDENCIA (x = 2000) =================================================
HX = 2000.; HH = 2.8; HWD = 2.6   # alto y ancho del pasillo
HF = OB('hall_floor', 0); HF.box((HX, -.1, -3), (HWD + .2, .2, 20), M['lino']); HF.finish(origin=(HX, 0, 0))
HL = OB('hall', .01)
for sd in (-1, 1):
    HL.box((HX + sd * (HWD / 2 + .1), HH / 2, -3), (.2, HH, 20), M['hallwall'])
    HL.box((HX + sd * (HWD / 2 - .005), .5, -3), (.02, 1.0, 20), M['wainscot'])
    HL.box((HX + sd * (HWD / 2 - .02), 1.0, -3), (.04, .05, 20), M['woodd'])
    # pasamanos de madera con soportes
    HL.cyl((HX + sd * (HWD / 2 - .09), .9, -12.8), (HX + sd * (HWD / 2 - .09), .9, 6.8), .035, M['rail'], 12)
    for z in range(-12, 7, 2): HL.cyl((HX + sd * (HWD / 2 - .01), .86, z), (HX + sd * (HWD / 2 - .09), .88, z), .015, M['steel'], 6)
    HL.box((HX + sd * (HWD / 2 - .01), .05, -3), (.02, .1, 20), M['woodd'])
HL.box((HX, HH + .1, -3), (HWD + .4, .2, 20), M['ceil'])
LIGHTS_H = []
for z in (-11, -8, -5, -2, 1, 4):
    HL.box((HX, HH - .01, z), (.6, .03, 1.2), M['fluor']); HL.box((HX, HH - .005, z), (.66, .02, 1.26), M['steel']); LIGHTS_H.append([HX, HH - .2, z])
# pared del fondo con la PUERTA DE SALIDA (dos versiones: real / pintada como estantería) y el cartel verde de SALIDA encima
HL.box((HX, HH / 2, -13.1), (HWD + .4, HH, .2), M['hallwall'])
HL.box((HX, .5, -12.99), (HWD, 1.0, .02), M['wainscot'])
HL.box((HX, 2.42, -12.96), (.7, .22, .08), M['exitsign'])
HL.box((HX + .95, 1.3, -12.97), (.16, .22, .04), M['keypad'])
# puertas de habitaciones a los dos lados (marco + hoja + placa con número y nombre)
ROOMS = []
for i, z in enumerate((-10.6, -7.0, -3.4, .2, 3.8)):
    for sd in (-1, 1):
        x = HX + sd * (HWD / 2 - .005)
        HL.box((x, 1.08, z), (.04, 2.16, 1.06), M['doorf']); HL.box((x - sd * .02, 1.05, z), (.03, 2.06, .92), M['roomdoor'])
        HL.cyl((x - sd * .05, 1.0, z + .35), (x - sd * .11, 1.0, z + .35), .018, M['steel'], 8); HL.box((x - sd * .11, 1.0, z + .3), (.03, .03, .12), M['steel'])
        HL.box((x - sd * .025, 1.65, z - .62), (.02, .22, .3), M['plate']); ROOMS.append([x, z, sd])
# ventana grande con luz de tarde (lado izquierdo), sillas, maceta, reloj, cuadro y tablón de avisos
HL.box((HX - HWD / 2 + .005, 1.6, -5.2), (.03, 1.3, 1.6), M['hallwin']); HL.box((HX - HWD / 2 + .02, 1.6, -5.2), (.04, 1.42, 1.72), M['white'])
HL.box((HX - HWD / 2 + .1, .93, -5.2), (.16, .05, 1.8), M['white'])
def chair(q):
    q.box((0, .45, 0), (.46, .06, .46), M['chair']); q.box((0, .78, -.21), (.46, .5, .05), M['chair'])
    for sx in (-1, 1):
        for sz in (-1, 1): q.cyl((sx * .2, 0, sz * .2), (sx * .2, .44, sz * .2), .018, M['steel'], 6)
    for sx in (-1, 1): q.box((sx * .24, .65, 0), (.04, .04, .4), M['steel'])
for z in (-5.7, -4.7): grp(HL, chair, TR(HX + HWD / 2 - .35, 0, z, -math.pi / 2))
HL.cyl((HX - HWD / 2 + .3, 0, -1.6), (HX - HWD / 2 + .3, .45, -1.6), .2, M['pot'], 16, r1=.16); bush(HL, HX - HWD / 2 + .3, .4, -1.6, .4, 11)
HL.cyl((HX + HWD / 2 - .02, 2.25, -8.8), (HX + HWD / 2 - .06, 2.25, -8.8), .17, M['clock'], 24)
HL.box((HX - HWD / 2 + .02, 1.6, -8.8), (.03, .7, 1.0), M['painting']); HL.box((HX - HWD / 2 + .01, 1.6, -8.8), (.03, .8, 1.1), M['woodl'])
HL.box((HX + HWD / 2 - .02, 1.55, -1.6), (.03, .6, .9), M['notice']); HL.box((HX + HWD / 2 - .01, 1.55, -1.6), (.02, .66, .96), M['wood'])
HL.finish(origin=(HX, 0, 0))
# las dos versiones de la puerta del fondo, como objetos separados (el mundo enciende una u otra)
DR = OB('door_real', .01); DR.box((HX, 1.05, -12.98), (1.0, 2.1, .06), M['exitdoor']); DR.box((HX, 1.08, -12.99), (1.12, 2.18, .04), M['steeld'])
DR.box((HX, 1.0, -12.92), (.85, .07, .06), M['steel']); DR.finish(origin=(HX, 0, 0))
DM = OB('door_mural', .01); DM.box((HX, 1.05, -12.98), (1.0, 2.1, .06), M['mural']); DM.finish(origin=(HX, 0, 0))

lay = dict(sites=dict(barn=[BX, 0], meadow=[MX, 0], hall=[HX, 0]), stalls=STALLS, lamps=LAMPS, hallLights=LIGHTS_H, rooms=ROOMS)
json.dump(lay, open(os.path.join(OUT, 'layout.json'), 'w'))
kw = dict(filepath=os.path.join(OUT, 'sets79.glb'), export_format='GLB', export_apply=True)
try: bpy.ops.export_scene.gltf(**kw, export_vertex_color='ACTIVE', export_all_vertex_colors=False)
except TypeError: bpy.ops.export_scene.gltf(**kw)
print('EXPORT_OK')

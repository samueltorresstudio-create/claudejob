# 76 · El plátano de seis millones — decorados de DIBUJO ANIMADO modelados en Blender y exportados a GLB para three.js.
# Formas gordas y simples, colores planos y vivos; el contorno negro y el sombreado de tebeo los pone three.js.
# Coordenadas en el sistema de three.js (x este, y arriba, z hacia la cámara); finish() las pasa a Blender (x, -z, y).
# Sitios (uno por zona): gallery (x=0), auction (1000), stage (2000), stand (3000).  Uso: python3 platano.py → platano.glb + layout.json
import bpy, bmesh, math, random, json, os
from mathutils import Matrix, Vector
OUT = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)
rnd = random.Random(76)
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
    white=('#ffffff'), wall=('#f6f3ec'), woodl=('#f0cf9a'), woodl2=('#e6bd82'), woodl3=('#c99a5c'), walld=('#e4dfd3'), floor1=('#efeae0'), floor2=('#dcd6c8'), concrete=('#c9c5bd'),
    gold=('#ffc928'), goldd=('#e0951c'), red=('#e3453a'), redd=('#b82e32'), burg=('#8a2234'), burgd=('#651728'), blue=('#4f8fe8'), bluel=('#8ec5ff'), navy=('#2c3f86'),
    green=('#43bd65'), greend=('#2f9a52'), yellow=('#ffd96a'), orange=('#ff9a3c'), pink=('#f28fa8'), purple=('#8a63d2'), teal=('#2cc4b4'),
    wood=('#b9824e'), woodd=('#7d5230'), darkwood=('#5a3a24'), iron=('#3c3748'), black=('#2a2430'), steel=('#c9ced6'), steeld=('#9aa1ad'), tape=('#e2e7ef'), taped=('#9aa3b3'),
    banana=('#ffd83a'), bananad=('#f0b81e'), stem=('#7d6a2e'), leaf=('#41c261'), skin=('#f4d9b4'), paper=('#f7f0d8'), wax=('#c8342c'), lamp=('#fff0b0'), laser=('#ff2a3c'),
    asphalt=('#4a4658'), asphaltd=('#3a3646'), sidewalk=('#cbc6d6'), brick=('#cf6d50'), brick2=('#e8a05a'), brick3=('#b4c8e8'), brick4=('#8e5a46'), stone=('#ddd6c6'), stoned=('#b8b0a2'),
    taxi=('#ffcc1f'), awn1=('#2f7fe0'), awn2=('#ffffff'), win=('#78bdff'), wind=('#2f4a8a'), cream=('#fbf0d2'), sky=('#9ed6ff'),
)
M = {k: mat(k, v) for k, v in P.items()}
M['bananaskin'] = mat('bananaskin', '#ffd83a'); M['bananaridge'] = mat('bananaridge', '#f2c428'); M['stemcut'] = mat('stemcut', '#e8dba0'); M['stemd'] = mat('stemd', '#4a3c1a'); M['tipb'] = mat('tipb', '#2a2418'); M['inkflat'] = mat('inkflat', '#241c2c'); M['laserlens'] = mat('laserlens', '#ff2a3c')
for n in ['tape_x', 'paint1', 'paint2', 'paint3', 'paint4', 'screen', 'backdrop', 'cert', 'art', 'subasta', 'frutas', 'brillo']: M[n] = mat(n, '#ffffff')

def sign(o, name, cx, cy, z, w, h, ry=0.): o.box((cx, cy, z), (w, h, .08), M[name], ry)
def framed(o, name, cx, cy, z, w, h, ry=0., fr='gold'):
    o.box((cx, cy, z), (w + .5, h + .5, .12), M[fr], ry); o.box((cx, cy, z + .07), (w, h, .06), M[name], ry)

# ---------------- el plátano (héroe) y la cinta ----------------
def banana(name, L=1.4, R=.17, bend=.95, nr=40, o=None):
    # 5 aristas marcadas (cada una con 4 vértices), cuello que se estrecha hacia el rabo, punta negra y rabo con corte claro
    o = o or Obj(name); Rc = L / bend; rings = []; sk = M['bananaskin']; rg = M['bananaridge']; st = M['stem']; sc = M['stemcut']
    prof = [(0., 1.), (.30, .95), (.50, .90), (.70, .95)]                      # (fracción de arista, radio relativo): arista viva y valle redondo
    NV = 20; uvl = o.bm.loops.layers.uv.verify(); vr = random.Random(int(L * 100))
    for i in range(nr + 1):
        t = i / nr; a = bend * (t - .5); cx = Rc * math.sin(a); cy = Rc * (1 - math.cos(a)); N = (-math.sin(a), math.cos(a))
        tt = min(1., max(0., t)); body = math.sin(math.pi * (.10 + .80 * tt)) ** .45                  # barriga
        neck = 1. - .55 * max(0., (.20 - tt) / .20) ** 1.6 - .35 * max(0., (tt - .86) / .14) ** 1.4   # cuello fino hacia el rabo y punta afilada
        r = R * (.34 + .66 * body) * neck if 0 < i < nr else R * .18
        ring = []
        for k in range(NV):
            ridge, j = divmod(k, 4); ph = (ridge + prof[j][0]) / 5 * 2 * math.pi + .35 + .05 * math.sin(t * 6.); rr = r * prof[j][1] * (1. + .035 * math.sin(t * 11. + ridge * 1.9) + .02 * math.sin(t * 27. + k))
            ring.append(o.bm.verts.new((cx + N[0] * math.cos(ph) * rr, cy + N[1] * math.cos(ph) * rr, math.sin(ph) * rr)))
        rings.append(ring)
    for i in range(nr):
        for k in range(NV):
            f = o.bm.faces.new((rings[i][k], rings[i][(k + 1) % NV], rings[i + 1][(k + 1) % NV], rings[i + 1][k]))
            f.material_index = o.mi(st if (i == 0 or i == nr - 1) else (rg if k % 4 in (3, 0) else sk))
            for lp, (uu, vv) in zip(f.loops, ((i / nr, k / NV), (i / nr, (k + 1) / NV), ((i + 1) / nr, (k + 1) / NV), ((i + 1) / nr, k / NV))): lp[uvl].uv = (uu, vv)
    c0 = o.bm.faces.new(list(reversed(rings[0]))); c1 = o.bm.faces.new(rings[-1]); c0.material_index = o.mi(st); c1.material_index = o.mi(st)
    a0 = bend * (-.5); p0 = (Rc * math.sin(a0), Rc * (1 - math.cos(a0)), 0); d0 = (-math.cos(a0), -math.sin(a0), 0)
    q0 = (p0[0] + d0[0] * L * .05, p0[1] + d0[1] * L * .05, 0); q1 = (p0[0] + d0[0] * L * .14, p0[1] + d0[1] * L * .14 + .02, 0)
    o.cyl(p0, q0, R * .26, st, 8, R * .30); o.cyl(q0, q1, R * .30, st, 8, R * .27); o.cyl(q1, (q1[0] + d0[0] * .012, q1[1] + d0[1] * .012, 0), R * .27, sc, 8, R * .27)   # rabo con corte claro
    o.cyl((q0[0] + d0[0] * .02, q0[1] + d0[1] * .02, 0), (q0[0] + d0[0] * .03, q0[1] + d0[1] * .03, 0), R * .34, M['stemd'], 8, R * .34)
    a1 = bend * .5; p1 = (Rc * math.sin(a1), Rc * (1 - math.cos(a1)), 0); d1 = (math.cos(a1), math.sin(a1), 0)
    o.sph((p1[0] + d1[0] * L * .012, p1[1] + d1[1] * L * .012, 0), R * .20, M['tipb'], (1.1, .8, .8)); o.sph((p1[0] + d1[0] * L * .028, p1[1] + d1[1] * L * .028, 0), R * .09, M['stemd'])
    return o
# --- la cinta sigue la superficie REAL del plátano (para no atravesarlo): se calcula la altura sobre la pared en cada punto de la tira ---
BR_L, BR_R, BR_BEND, BR_Z, TAPE_ANG = 1.45, .18, 1.0, .19, .5      # plátano de la obra (wallpiece) y giro de la cinta (el origen de la cinta = centro del plátano)
def _sm(k): k = max(0., min(1., k)); return k * k * (3 - 2 * k)
def tape_z(x, y, half=.85, wrinkles=True):
    X = x * math.cos(TAPE_ANG) - y * math.sin(TAPE_ANG); Yr = x * math.sin(TAPE_ANG) + y * math.cos(TAPE_ANG)
    Rc = BR_L / BR_BEND; a = math.asin(max(-.999, min(.999, X / Rc))); t = a / BR_BEND + .5; wall = .018
    lift = .06 * _sm((abs(x) - (half - .17)) / .17) ** 1.5
    if t <= .02 or t >= .98: return wall + lift, 9.
    body = math.sin(math.pi * (.10 + .80 * t)) ** .45; neck = 1. - .55 * max(0., (.20 - t) / .20) ** 1.6 - .35 * max(0., (t - .86) / .14) ** 1.4
    r = BR_R * (.34 + .66 * body) * neck * .95; dy = Yr - Rc * (1 - math.cos(a)); d = abs(dy)
    zs = lambda dd: BR_Z + math.sqrt(max(r * r - dd * dd, 0.)) + .016
    if d < .85 * r: z = zs(d)
    else: k = _sm((d - .85 * r) / (.15 * r + .12)); z = zs(.85 * r) * (1 - k) + wall * k
    if wrinkles:
        e = math.exp(-((d - r) / .10) ** 2); out = _sm((d - r * .6) / (r * .5 + .1))
        z += (.007 * math.sin(x * 60 + y * 12) + .0035 * math.sin(x * 110 - y * 26 + 1.1)) * e + .003 * math.sin(x * 30 - y * 20 + .7) * out
    return z + lift, d
def tape_obj():
    # tira de cinta americana en su propio objeto (longitud en x, ancho en y, cara hacia +z; origen = centro del plátano). Rejilla fina que sigue al plátano,
    # extremos rotos irregulares, bordes ondulados y puntas despegadas. Se gira en three.js (rotation.z = TAPE_ANG).
    o = Obj('tape'); half, w, th, NX, NY = .85, .24, .026, 150, 14
    rr = random.Random(9); endL = [half + rr.uniform(-.05, .035) for _ in range(NY + 1)]; endR = [half + rr.uniform(-.05, .035) for _ in range(NY + 1)]
    for j in range(1, NY, 3): endL[j] -= .03; endR[j] += .02
    T = []; B = []
    for i in range(NX + 1):
        tr, br = [], []
        for j in range(NY + 1):
            tj = j / NY; x = -endL[j] + (endL[j] + endR[j]) * i / NX; y = -w / 2 + w * tj + (.005 * math.sin(x * 38 + j) if j in (0, NY) else 0.)
            z = tape_z(x, y)[0]
            tr.append(o.bm.verts.new((x, y, z + th / 2))); br.append(o.bm.verts.new((x, y, z - th / 2)))
        T.append(tr); B.append(br)
    fs = []
    for i in range(NX):
        for j in range(NY):
            fs.append(o.bm.faces.new((T[i][j], T[i][j + 1], T[i + 1][j + 1], T[i + 1][j]))); fs.append(o.bm.faces.new((B[i][j], B[i + 1][j], B[i + 1][j + 1], B[i][j + 1])))
        fs.append(o.bm.faces.new((T[i][0], T[i + 1][0], B[i + 1][0], B[i][0]))); fs.append(o.bm.faces.new((T[i][NY], B[i][NY], B[i + 1][NY], T[i + 1][NY])))
    for j in range(NY):
        fs.append(o.bm.faces.new((T[0][j], B[0][j], B[0][j + 1], T[0][j + 1]))); fs.append(o.bm.faces.new((T[NX][j], T[NX][j + 1], B[NX][j + 1], B[NX][j])))
    k = o.mi(M['tape'])
    for f in fs: f.material_index = k
    return o
TP = tape_obj(); TP.finish()
def tape_ink():        # contorno plano oscuro bajo la cinta (el contorno por inversión de casco no funciona bien con tanta rejilla)
    o = Obj('tape_ink'); half, w, NX, NY = .85, .24, 150, 14
    rr = random.Random(9); endL = [half + rr.uniform(-.05, .035) for _ in range(NY + 1)]; endR = [half + rr.uniform(-.05, .035) for _ in range(NY + 1)]
    for j in range(1, NY, 3): endL[j] -= .03; endR[j] += .02
    G_ = []
    for i in range(NX + 1):
        col = []
        for j in range(NY + 1):
            x = -endL[j] + (endL[j] + endR[j]) * i / NX; y = -w / 2 + w * j / NY; ex = .012 if i in (0, NX) else 0.; ey = .012 if j in (0, NY) else 0.
            x += ex * (-1 if i == 0 else 1 if i == NX else 0); y += ey * (-1 if j == 0 else 1 if j == NY else 0)
            col.append(o.bm.verts.new((x, y, tape_z(x, y, wrinkles=False)[0] - .02)))
        G_.append(col)
    fs = [o.bm.faces.new((G_[i][j], G_[i][j + 1], G_[i + 1][j + 1], G_[i + 1][j])) for i in range(NX) for j in range(NY)]
    k = o.mi(M['inkflat'])
    for f in fs: f.material_index = k
    return o
TI = tape_ink(); TI.finish()
HB = banana('banana'); HB.finish()                                  # plátano suelto (se clona)
HR = banana('banana_big', 1.4, .17); HR.finish()
WP = Obj('wallpiece')                                               # la obra: plátano pegado a la pared (origen = pared, z=0); la cinta es el objeto `tape`
grp(WP, lambda q: banana('w', 1.45, .18, 1.0, o=q), TR(0, -.1, .19)); WP.finish()
def cert_obj():
    o = Obj('cert'); o.box((0, 0, 0), (1.0, 1.4, .03), M['cert']); o.box((0, 0, .02), (1.04, 1.44, .02), M['gold']); o.cyl((.28, -.5, .03), (.28, -.5, .05), .13, M['wax'], 10)
    o.box((.2, -.62, .03), (.08, .3, .012), M['red'], 0., 0., .2); o.box((.36, -.62, .03), (.08, .3, .012), M['red'], 0., 0., -.2); return o
CE = cert_obj(); CE.finish()
def peeled(name='peeled'):
    o = banana(name, 1.3, .15);
    for k in range(4):                                             # cáscara abierta colgando
        a = k / 4 * 2 * math.pi + .4; pos = (-.55, .35, 0); d = (math.cos(a) * .12, -.55, math.sin(a) * .12)
        o.cyl((pos[0] + math.cos(a) * .1, pos[1], math.sin(a) * .1), (pos[0] + d[0] * 1.5, pos[1] + d[1], d[2] * 1.5), .07, M['banana'], 5, .03)
    return o
PL = peeled(); PL.finish()


# ---------------- material de seguridad: emisor láser, cámara de vigilancia y baliza (se clonan en three.js) ----------------
def emitter():
    o = Obj('emitter')
    o.box((0, 0, -.08), (.62, .46, .16), M['iron']); o.box((0, 0, -.18), (.8, .6, .06), M['steeld'])                     # placa y soporte
    o.cyl((0, 0, 0), (0, 0, .34), .17, M['black'], 12, .2); o.cyl((0, 0, .32), (0, 0, .4), .13, M['laserlens'], 12, .13)  # cañón y lente roja
    for sx in (-.2, .2): o.box((sx, .2, .05), (.08, .08, .08), M['laserlens'])                                              # leds
    o.box((0, -.22, .08), (.3, .06, .1), M['steel']); return o
EM = emitter(); EM.finish()
def seccam():
    o = Obj('seccam')
    o.cyl((0, 0, 0), (0, .5, 0), .06, M['steeld'], 6); o.box((0, -.12, .2), (.34, .3, .8), M['white']); o.cyl((0, -.12, .6), (0, -.12, .74), .15, M['black'], 12, .17); o.sph((0, -.12, .76), .1, M['bluel'])
    o.box((0, .08, .2), (.2, .06, .5), M['steeld']); o.sph((.1, -.02, .0), .05, M['laserlens']); return o
SC = seccam(); SC.finish()
def beacon():
    o = Obj('beacon'); o.cyl((0, 0, 0), (0, .12, 0), .34, M['iron'], 12); o.cyl((0, .12, 0), (0, .55, 0), .3, M['laserlens'], 14, .22); o.sph((0, .55, 0), .22, M['laserlens']); return o
BE = beacon(); BE.finish()

# ---------------- ayudantes de decorado ----------------
def stanchion(o, x, z, h=1.0): o.cyl((x, 0, z), (x, h, z), .05, M['gold'], 8); o.cyl((x, 0, z), (x, .05, z), .22, M['gold'], 12); o.sph((x, h + .05, z), .1, M['gold'])
def rope(o, x0, z0, x1, z1, h=.86):
    n = 6
    for i in range(n):
        a, b = i / n, (i + 1) / n; ya = h - .12 * 4 * a * (1 - a); yb = h - .12 * 4 * b * (1 - b)
        o.cyl((x0 + (x1 - x0) * a, ya, z0 + (z1 - z0) * a), (x0 + (x1 - x0) * b, yb, z0 + (z1 - z0) * b), .045, M['red'], 6)
def spot(o, x, y, z, ry=0.):                                        # foco de carril
    o.cyl((x, y + .6, z), (x, y, z), .06, M['iron'], 6); o.cyl((x, y, z), (x, y - .5, z + .3), .24, M['iron'], 10, .13); o.sph((x, y - .52, z + .31), .14, M['lamp'])
def plant(o, x, z, s=1.):
    o.cyl((x, 0, z), (x, .8 * s, z), .45 * s, M['wood'], 10, .55 * s)
    for k in range(7):
        a = k / 7 * 2 * math.pi; o.cyl((x, .8 * s, z), (x + math.cos(a) * .9 * s, 2.3 * s, z + math.sin(a) * .9 * s), .06 * s, M['greend'], 5, .22 * s)
        o.sph((x + math.cos(a) * .9 * s, 2.3 * s, z + math.sin(a) * .9 * s), .42 * s, M['leaf'], (1, 1.7, .5))
def bench(o, x, z, ry=0.):
    grp(o, lambda q: (q.box((0, .45, 0), (3.2, .22, 1.1), M['darkwood']), [q.box((sx * 1.4, .22, 0), (.18, .44, 1.0), M['iron']) for sx in (-1, 1)]), TR(x, 0, z, ry))
def pedestal(o, x, z, kind, ry=0.):
    o.box((x, .6, z), (1.2, 1.2, 1.2), M['white']); o.box((x, 1.22, z), (1.3, .08, 1.3), M['walld'])
    if kind == 0: o.ico((x, 2.1, z), .75, M['gold'], (1, 1.15, 1), 2)
    if kind == 1: o.box((x, 2.0, z), (1.1, 1.1, 1.1), M['blue'], .5, .3, .2)
    if kind == 2: o.torus((x, 2.1, z), .55, .22, M['red'], 20, 'X')

# ---------------- GALERÍA (x = 0): feria de arte, cubo blanco con luz de cine ----------------
GX = 0.
GF = Obj('gallery_floor'); GF.box((0, -.15, -2), (24, .3, 62), M['woodl'])      # suelo SIN contorno (objeto aparte): tarima de madera clara
for i in range(24):
    if i % 2: GF.box((-12 + i + .5, .005, -2), (1, .02, 62), M['woodl2'])
for j in range(22): GF.box((0, .007, 27 - j * 2.9), (24, .02, .05), M['woodl3'])
GF.finish(origin=(GX, 0, 0))
GA = Obj('gallery')
GA.box((0, 4.6, -18.3), (24, 9.2, .6), M['white'])                    # pared del fondo
GA.box((0, .12, -17.95), (24, .24, .12), M['walld'])
for sd in (-1, 1):
    GA.box((sd * 11.9, 4.6, -2), (.6, 9.2, 62), M['white']); GA.box((sd * 11.55, .12, -2), (.12, .24, 62), M['walld'])
GA.box((0, 9.4, -2), (24, .4, 62), M['white'])
for k in range(7):                                                   # carriles de focos
    GA.box((-9 + k * 3, 9.1, -8), (.16, .12, 40), M['iron'])
for (x, z) in [(-3.2, -12.5), (-1.1, -12.5), (1.1, -12.5), (3.2, -12.5), (0, -9.5)]: spot(GA, x, 8.8, z)
BX, BY = 0., 3.1                                                     # centro del plátano en la pared
# cuadros grandes a los lados (para que el plátano destaque por ser lo más simple)
for i, (nm, w, h, z) in enumerate([('paint1', 5.4, 4.0, 12.), ('paint2', 4.0, 5.2, 2.), ('paint3', 6.0, 3.6, -9.)]):
    GA.box((-11.25, 4.6, z), (.14, h + .5, w + .5), M['gold']); GA.box((-11.18, 4.6, z), (.06, h, w), M[nm])
for i, (nm, w, h, z) in enumerate([('paint4', 4.4, 4.8, 12.), ('paint1', 6.0, 3.8, 1.), ('paint2', 3.6, 4.6, -9.)]):
    GA.box((11.25, 4.6, z), (.14, h + .5, w + .5), M['burg'] if i % 2 else M['gold']); GA.box((11.18, 4.6, z), (.06, h, w), M[nm])
for (x, z, k) in [(-8.3, 18, 0), (8.3, 19, 1), (-8.6, -6, 2), (8.6, -6, 0)]: pedestal(GA, x, z, k)
for (x, z) in [(-6.5, 6), (6.5, 14)]: bench(GA, x, z, 0.)
plant(GA, -10, 24, 1.1); plant(GA, 10, 25, 1.1); plant(GA, -10, -15, 1.2); plant(GA, 10, -15, 1.2)
for x in (-3.6, -1.8, 0, 1.8, 3.6): stanchion(GA, x, -13)
for x0, x1 in [(-3.6, -1.8), (-1.8, 0), (0, 1.8), (1.8, 3.6)]: rope(GA, x0, -13, x1, -13)
for z in (-8, -5, -2): stanchion(GA, -3.6, z); stanchion(GA, 3.6, z)
for z0, z1 in [(-13, -8), (-8, -5), (-5, -2)]: rope(GA, -3.6, z0, -3.6, z1); rope(GA, 3.6, z0, 3.6, z1)
GA.box((0, .02, -9), (7.2, .04, 11), M['red'])                       # alfombra roja de la cola
GA.finish(origin=(GX, 0, 0))

# ---------------- SUBASTA (x = 1000): sala de lujo, rojo burdeos y oro ----------------
AX = 1000.
AF = Obj('auction_floor'); AF.box((AX, -.15, -2), (34, .3, 56), M['darkwood']); AF.box((AX, .01, 2), (5.2, .04, 44), M['burg']); AF.finish(origin=(AX, 0, 0))
AU = Obj('auction')
AU.box((AX, 5, -17.3), (34, 10, .6), M['burgd']); AU.box((AX, 8.8, -17), (34, .5, .8), M['gold'])
for sd in (-1, 1): AU.box((AX + sd * 17.3, 5, -2), (.6, 10, 56), M['burgd']); AU.box((AX + sd * 16.9, 8.8, -2), (.8, .5, 56), M['gold'])
for k in range(13):                                                  # paneles dorados
    AU.box((AX - 15.6 + k * 2.6, 2.2, -16.96), (2.0, 3.2, .1), M['burg']); AU.box((AX - 15.6 + k * 2.6, 2.2, -16.9), (2.2, 3.4, .06), M['goldd'])
AU.box((AX, 10.2, -2), (34, .4, 56), M['burgd'])
AU.box((AX, .5, -13), (18, 1., 6.4), M['wood']); AU.box((AX, 1.02, -13), (18.4, .1, 6.6), M['gold'])      # estrado
AU.box((AX + 10.5, 4.3, -16.82), (4.2, 4.6, .1), M['white']); AU.box((AX, 6.3, -16.9), (11, 6.4, .14), M['gold']); AU.box((AX, 6.3, -16.8), (10.4, 5.8, .06), M['screen'])  # pantalla con el lote
def lectern(o):
    o.box((0, 1.5, 0), (2.2, 3., 1.2), M['wood']); o.box((0, 3.05, .1), (2.5, .16, 1.5), M['gold']); o.box((0, 1.6, .62), (1.7, 1.9, .06), M['burg']); o.cyl((0, 1.9, .66), (0, 1.9, .7), .5, M['gold'], 14)
grp(AU, lectern, TR(AX - 4.5, .95, -13))
for sd in (-1, 1):                                                   # cortinas
    AU.box((AX + sd * 14.8, 5., -16.4), (3.4, 9.6, .7), M['redd']); AU.cyl((AX + sd * 13.2, 3., -16.0), (AX + sd * 13.2, 3.2, -16.0), .7, M['gold'], 10)
    for k in range(4): AU.cyl((AX + sd * (13.5 + k * .9), 9, -16.0), (AX + sd * (13.5 + k * .9), .4, -16.0), .38, M['red'], 8)
def chandelier(o, x, z):
    o.cyl((x, 10.2, z), (x, 8.6, z), .06, M['iron'], 6); o.torus((x, 8.2, z), 1.5, .1, M['gold'], 24); o.torus((x, 7.5, z), 1., .09, M['gold'], 20); o.sph((x, 7.0, z), .35, M['gold'])
    for k in range(10): a = k / 10 * 2 * math.pi; o.cyl((x + math.cos(a) * 1.5, 8.2, z + math.sin(a) * 1.5), (x + math.cos(a) * 1.5, 8.7, z + math.sin(a) * 1.5), .05, M['gold'], 4); o.sph((x + math.cos(a) * 1.5, 8.8, z + math.sin(a) * 1.5), .13, M['lamp'])
chandelier(AU, AX, -2); chandelier(AU, AX, 10)
def chair(o, x, z):
    o.box((x, .5, z), (.9, .16, .9), M['red']); o.box((x, 1.1, z - .4), (.9, 1.1, .12), M['red']); o.box((x, .22, z), (.8, .44, .8), M['darkwood'])
for r in range(5):
    for c in range(5):
        for sd in (-1, 1): chair(AU, AX + sd * (3.4 + c * 1.35), 2 + r * 2.3)
AU.finish(origin=(AX, 0, 0))

# ---------------- RUEDA DE PRENSA (x = 2000): escenario oscuro con la bahía de Hong Kong al fondo ----------------
SX = 2000.
SF = Obj('stage_floor'); SF.box((SX, -.15, -2), (36, .3, 60), M['iron']); SF.box((SX, .01, 4), (4, .04, 40), M['red']); SF.finish(origin=(SX, 0, 0))
ST = Obj('stage')
ST.box((SX, 6, -16.5), (34, 12, .5), M['navy']); ST.box((SX, 6, -16.2), (30, 9.6, .08), M['backdrop'])
for sd in (-1, 1): ST.box((SX + sd * 17.3, 6, -2), (.6, 12, 60), M['black'])
ST.box((SX, 12.2, -2), (36, .4, 60), M['black'])
ST.box((SX, .45, -9), (24, .9, 9), M['black']); ST.box((SX, .93, -9), (24.4, .06, 9.4), M['gold'])
for k in range(6): ST.box((SX - 13 + k * 5.2, 5.5, -16.0), (.5, 9., .3), M['lamp'])    # tiras LED
def table(o):
    o.box((0, 1.4, 0), (9, .16, 2.4), M['white']); o.box((0, .7, .95), (9, 1.4, .1), M['white']); o.box((0, .7, -.6), (9, 1.4, .1), M['white']); o.box((0, 1.45, .6), (9.2, .05, .06), M['gold'])
    for x in (-3, -1.4, 0, 1.4, 3): o.cyl((x, 1.5, .1), (x, 2.0, .1), .04, M['iron'], 6); o.sph((x, 2.04, .1), .1, M['iron']); o.cyl((x - .1, 1.5, -.2), (x - .1, 1.52, -.2), .35, M['steeld'], 12)
    o.cyl((0, 1.5, .5), (0, 1.56, .5), .55, M['white'], 14); o.cyl((0, 1.56, .5), (0, 1.58, .5), .4, M['skin'], 14)
grp(ST, table, TR(SX, .92, -8.5))
def camera(o, x, z, ry):
    def f(q):
        for k in range(3): a = k / 3 * 2 * math.pi; q.cyl((0, 1.5, 0), (math.cos(a) * .7, 0, math.sin(a) * .7), .045, M['iron'], 5)
        q.box((0, 1.8, 0), (.7, .55, 1.1), M['black']); q.cyl((0, 1.8, .55), (0, 1.8, 1.2), .24, M['steeld'], 12, .3); q.cyl((0, 1.8, 1.18), (0, 1.8, 1.24), .27, M['bluel'], 12)
        q.box((0, 2.2, -.1), (.3, .2, .5), M['red'])
    grp(o, f, TR(x, 0, z, ry))
for i, (dx, dz, ry) in enumerate([(-8, 8, .3), (-4, 11, .15), (0, 9, 0), (4, 12, -.15), (8, 8, -.3), (-11, 3, .5), (11, 3, -.5)]): camera(ST, SX + dx, dz, ry)
ST.finish(origin=(SX, 0, 0))

# ---------------- CALLE DE NUEVA YORK con el puesto de fruta (x = 3000) ----------------
NX = 3000.
NF = Obj('stand_floor'); NF.box((NX, -.2, -2), (80, .4, 90), M['asphalt']); NF.box((NX, .02, 6), (80, .04, 8), M['asphaltd'])
for k in range(14): NF.box((NX - 36 + k * 5.4, .05, 6), (2.6, .02, .3), M['white'])
for sd, zz in ((-1, -22), (1, 22)): NF.box((NX, .15, zz), (80, .5, 8), M['sidewalk'])
for k in range(8): NF.box((NX - 4 + k * .6, .06, 14), (.35, .02, 8), M['white'])
NF.finish(origin=(NX, 0, 0))
NY = Obj('stand')
# fachada de la casa de subastas al fondo
NY.box((NX, 9, -34), (26, 18, 6), M['stone']); NY.box((NX, 18.4, -33), (28, 1.2, 8), M['stoned'])
for k in range(5): NY.cyl((NX - 9 + k * 4.5, 0, -30.4), (NX - 9 + k * 4.5, 15, -30.4), .9, M['white'], 12); NY.box((NX - 9 + k * 4.5, 15.3, -30.4), (2.2, .6, 2.2), M['stoned'])
NY.box((NX, 16.5, -30.0), (23, 2.2, 2.4), M['stone']); NY.box((NX, 17.2, -29), (14, 1.6, .2), M['subasta'])
for k in range(4): NY.box((NX, k * .4 + .2, -27.6 + k * .5), (13, .4, 1.6 + 0), M['stoned'])
NY.box((NX, 5, -30.6), (3.6, 7, .3), M['darkwood']); NY.box((NX, 8.9, -30.5), (4.6, .6, .3), M['gold'])
# casas de ladrillo a los lados
def brown(o, w, h, col, depth=12.):
    o.box((0, h / 2, -depth / 2), (w, h, depth), M[col]); o.box((0, h + .2, -depth / 2), (w + .5, .5, depth + .5), M['white'])
    for r in range(3):
        for c in range(2): cx = -w / 2 + w * (c + .5) / 2; o.box((cx, 3.2 + r * 3.8, .05), (1.3, 2.2, .1), M['white']); o.box((cx, 3.2 + r * 3.8, .1), (1.0, 1.9, .1), M['win'])
    o.box((0, 1.4, .3), (1.5, 2.8, .4), M['darkwood']); [o.box((0, .2 + k * .35, .9 + k * .0), (2.2, .3, 1.4 - k * .35), M['stoned']) for k in range(3)]
for i, (x, col) in enumerate([(-22, 'brick'), (-13.5, 'brick2'), (13.5, 'brick3'), (22, 'brick4')]): grp(NY, lambda q, col=col: brown(q, 8, 15 + (i % 2) * 2, col), TR(NX + x, 0, -24 - (i % 2) * 2))
# el puesto de fruta
def stand(o):
    o.box((0, 1.0, 0), (5, 1.1, 2.4), M['wood']); o.box((0, 1.6, 0), (5.2, .14, 2.6), M['woodd'])
    for sx in (-2.4, 2.4): o.cyl((sx, 1.6, -1.1), (sx, 5.4, -1.1), .08, M['iron'], 6); o.cyl((sx, 1.6, 1.1), (sx, 4.5, 1.1), .08, M['iron'], 6)
    for k in range(8): o.box((-2.5 + (k + .5) * .625, 4.95 - 0 * k, .1), (.62, .1, 2.9), M['awn1' if k % 2 == 0 else 'awn2'], 0., .3)
    o.box((0, 5.5, -1.2), (5.2, .5, .1), M['awn1'])
    for k in range(4): o.box((-1.8 + k * 1.2, 1.78, .1), (1.0, .26, .9), M['woodd'])
    for wx in (-2., 2.): o.cyl((wx, .5, 1.3), (wx, .5, 1.5), .5, M['iron'], 14)
grp(NY, stand, TR(NX - 5, 0, 13.5, .0))
def taxi(o):
    o.box((0, .9, 0), (5.2, 1.3, 2.4), M['taxi']); o.box((-.3, 1.9, 0), (2.8, .9, 2.2), M['taxi']); o.box((-.3, 1.95, 0), (2.9, .6, 2.25), M['win']); o.box((-.3, 2.5, 0), (.9, .3, .6), M['white'])
    for sx in (-1.6, 1.6):
        for sz in (-1.2, 1.2): o.cyl((sx, .5, sz), (sx, .5, sz + (.2 if sz > 0 else -.2)), .5, M['black'], 12)
grp(NY, taxi, TR(NX + 9, 0, 4, .0))
def hydrant(o): o.cyl((0, 0, 0), (0, 1.2, 0), .32, M['red'], 8); o.sph((0, 1.3, 0), .36, M['red']); o.cyl((-.5, .8, 0), (.5, .8, 0), .16, M['redd'], 6)
grp(NY, hydrant, TR(NX + 16, .4, 20)); lampposts = [(-18, 21), (4, 21), (22, 21)]
for (x, z) in lampposts: NY.cyl((NX + x, .4, z), (NX + x, 6.5, z), .16, M['iron'], 6); NY.box((NX + x, 6.8, z), (.8, .8, .8), M['lamp']); NY.cyl((NX + x, 7.2, z), (NX + x, 7.8, z), .5, M['iron'], 6, 0.)
NY.finish(origin=(NX, 0, 0))

# ---------------- layout para three.js ----------------
lay = dict(sites=dict(gallery=[GX, 0], auction=[AX, 0], stage=[SX, 0], stand=[NX, 0]), banana=dict(x=BX, y=BY, z=-17.7))
json.dump(lay, open(os.path.join(OUT, 'layout.json'), 'w'))
kw = dict(filepath=os.path.join(OUT, 'platano.glb'), export_format='GLB', export_apply=True)
try: bpy.ops.export_scene.gltf(**kw, export_vertex_color='ACTIVE', export_all_vertex_colors=False)
except TypeError: bpy.ops.export_scene.gltf(**kw)
print('EXPORT_OK')

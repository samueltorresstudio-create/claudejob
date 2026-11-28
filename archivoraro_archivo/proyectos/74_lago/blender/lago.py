# 74 · El lago que desapareció — escenarios modelados en Blender (bpy) y exportados a GLB para three.js.
# Coordenadas escritas en el sistema de three.js (x este, y arriba, z sur/hacia cámara); al final se pasan a Blender (x, -z, y).
# Uso: python3 lago.py  → lago.glb + layout.json
import bpy, bmesh, math, random, json, os
from mathutils import Matrix, Vector
OUT = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)
rnd = random.Random(74)

# ---------------- materiales (los nombres los usa three.js para afinar texturas) ----------------
MATS = {}
def mat(name, col, rough=.8, metal=0., emit=None, ei=0.):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    c = tuple(int(col[i:i + 2], 16) / 255 for i in (1, 3, 5))
    b.inputs['Base Color'].default_value = (*[x ** 2.2 for x in c], 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emit:
        e = tuple(int(emit[i:i + 2], 16) / 255 for i in (1, 3, 5)); b.inputs['Emission Color'].default_value = (*[x ** 2.2 for x in e], 1); b.inputs['Emission Strength'].default_value = ei
    MATS[name] = m; return m

class Obj:
    def __init__(s, name, smooth=False):
        s.name, s.bm, s.mats, s.smooth = name, bmesh.new(), [], smooth
    def mi(s, m):
        if m not in s.mats: s.mats.append(m)
        return s.mats.index(m)
    def _fin(s, geom, m, M):
        vs = [g for g in geom if isinstance(g, bmesh.types.BMVert)]
        bmesh.ops.transform(s.bm, matrix=M, verts=vs)
        k = s.mi(m); fs = set()
        for v in vs:
            for f in v.link_faces: fs.add(f)
        for f in fs: f.material_index = k
    def box(s, c, size, m, ry=0., rx=0., rz=0.):
        r = bmesh.ops.create_cube(s.bm, size=1.)
        M = Matrix.Translation(Vector(c)) @ Matrix.Rotation(ry, 4, 'Y') @ Matrix.Rotation(rx, 4, 'X') @ Matrix.Rotation(rz, 4, 'Z') @ Matrix.Diagonal((*size, 1))
        s._fin(r['verts'], m, M)
    def cyl(s, p0, p1, r, m, seg=8, r1=None, caps=True):
        p0, p1 = Vector(p0), Vector(p1); d = p1 - p0; L = d.length
        if L < 1e-6: return
        res = bmesh.ops.create_cone(s.bm, cap_ends=caps, cap_tris=False, segments=seg, radius1=r, radius2=r if r1 is None else r1, depth=L)
        q = Vector((0, 0, 1)).rotation_difference(d.normalized())
        M = Matrix.Translation((p0 + p1) / 2) @ q.to_matrix().to_4x4()
        s._fin(res['verts'], m, M)
    def sph(s, c, r, m, sc=(1, 1, 1), seg=10, rings=7):
        res = bmesh.ops.create_uvsphere(s.bm, u_segments=seg, v_segments=rings, radius=r)
        M = Matrix.Translation(Vector(c)) @ Matrix.Diagonal((*sc, 1)); s._fin(res['verts'], m, M)
    def ico(s, c, r, m, sc=(1, 1, 1), sub=1):
        res = bmesh.ops.create_icosphere(s.bm, subdivisions=sub, radius=r)
        M = Matrix.Translation(Vector(c)) @ Matrix.Diagonal((*sc, 1)); s._fin(res['verts'], m, M)
    def torus(s, c, R, r, m, seg=16, axis='Y'):
        vs = []; tot = []
        for i in range(seg):
            a = i / seg * 2 * math.pi; ring = []
            for j in range(8):
                b = j / 8 * 2 * math.pi; x = (R + r * math.cos(b)) * math.cos(a); z = (R + r * math.cos(b)) * math.sin(a); y = r * math.sin(b)
                ring.append(s.bm.verts.new((x, y, z)))
            tot.append(ring)
        for i in range(seg):
            for j in range(8):
                a, b, c2, d = tot[i][j], tot[(i + 1) % seg][j], tot[(i + 1) % seg][(j + 1) % 8], tot[i][(j + 1) % 8]
                s.bm.faces.new((a, b, c2, d))
        allv = [v for r_ in tot for v in r_]
        R_ = Matrix.Identity(4) if axis == 'Y' else Matrix.Rotation(math.pi / 2, 4, 'X')
        s._fin(allv, m, Matrix.Translation(Vector(c)) @ R_)
    def prism(s, pts, z0, z1, m):
        # polígono en el plano XY (x, y) extruido en z de z0 a z1
        a = [s.bm.verts.new((x, y, z0)) for x, y in pts]; b = [s.bm.verts.new((x, y, z1)) for x, y in pts]
        n = len(pts); fs = [s.bm.faces.new(list(reversed(a))), s.bm.faces.new(b)]
        for i in range(n): fs.append(s.bm.faces.new((a[i], a[(i + 1) % n], b[(i + 1) % n], b[i])))
        k = s.mi(m)
        for f in fs: f.material_index = k
        return a + b
    def finish(s, coll=None, origin=(0, 0, 0)):
        bm = s.bm; bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
        o = Vector(origin); bmesh.ops.transform(bm, matrix=Matrix.Translation(-o), verts=bm.verts)
        # three (x,y,z) → blender (x,-z,y)
        bmesh.ops.transform(bm, matrix=Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1))), verts=bm.verts)
        if not s.smooth: bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        me = bpy.data.meshes.new(s.name); bm.normal_update(); bm.to_mesh(me); bm.free()
        if len(me.color_attributes): me.color_attributes.active_color = me.color_attributes[0]; me.color_attributes.render_color_index = 0
        for m in s.mats: me.materials.append(m)
        for p in me.polygons: p.use_smooth = s.smooth
        ob = bpy.data.objects.new(s.name, me); ob.location = (o.x, -o.z, o.y); bpy.context.scene.collection.objects.link(ob); return ob

# ---------------- paleta ----------------
M = dict(
    rust=mat('barge_rust', '#5a3326', .75, .35), hull=mat('rig_hull', '#7a2e22', .6, .45), deck=mat('rig_deck', '#5d5a55', .85, .3),
    derr=mat('rig_derrick', '#d9462b', .5, .5), white=mat('paint_white', '#e9e4da', .55, .1), steel=mat('steel_dark', '#2e3134', .45, .7),
    yel=mat('paint_yellow', '#f2b227', .5, .3), blue=mat('paint_blue', '#2c5a8c', .5, .2), glass=mat('glass', '#89a8b8', .15, .2),
    orange=mat('life_orange', '#f26a1b', .5), pipe=mat('pipe_steel', '#6b6e70', .4, .8), roof=mat('roof_red', '#9b3b2b', .8),
    wood=mat('wood', '#7a5434', .85), wood_d=mat('wood_dark', '#4a3220', .9), bark=mat('bark', '#4b3a2c', .95),
    leaf=mat('leaf_oak', '#3f5a2a', .9), leaf2=mat('leaf_cypress', '#4d6b2e', .9), moss=mat('moss', '#8c9478', .95),
    hedge=mat('hedge', '#355024', .9), flower=mat('flower_pink', '#d86a8c', .8), flower2=mat('flower_white', '#f0e6d8', .8),
    conc=mat('concrete', '#a7a39a', .9), tin=mat('tin_roof', '#8c949a', .45, .6), black=mat('rubber_black', '#1c1c1e', .9),
    clay=mat('strat_clay', '#6e5038', .95), sand=mat('strat_sand', '#a88d64', .95), salt=mat('strat_salt', '#d9d6cf', .65),
    salt_d=mat('strat_salt_dark', '#b9b3a8', .7), mud=mat('lake_mud', '#4f4232', .9), lamp=mat('lamp_glow', '#ffe0a0', .5, 0, '#ffd890', 6.),
    red=mat('paint_red', '#b8322a', .55, .2), green_b=mat('boat_green', '#2f6b4a', .55, .2),
)

# ---------------- TERRENO ----------------
LAKE_RX, LAKE_RZ = 185., 150.
ISL = (245., -45.)
CAN0, CAN1 = (-130., 105.), (-700., 640.)
def nz(x, z):
    return (math.sin(x * .021 + 1.3) * math.cos(z * .017 - .4) * .6 + math.sin(x * .053 + z * .041) * .3 + math.sin(x * .11 - z * .09 + 2) * .12)
def lake_r(x, z):
    a = math.atan2(z, x); w = 1 + .06 * math.sin(3 * a + .7) + .04 * math.sin(5 * a - 1.1)
    return math.sqrt((x / LAKE_RX) ** 2 + (z / LAKE_RZ) ** 2) / w
def seg_d(x, z, a, b):
    ax, az = a; bx, bz = b; dx, dz = bx - ax, bz - az; t = max(0, min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)))
    return math.hypot(x - ax - t * dx, z - az - t * dz)
def sstep(a, b, x):
    t = max(0, min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t)
def height(x, z):
    r = lake_r(x, z); land = 1.3 + nz(x, z) * .5
    bed = -3.1 + nz(x * 2, z * 2) * .25 - .4 * max(0, 1 - r)
    h = bed + (land - bed) * sstep(.93, 1.07, r)
    di = math.hypot(x - ISL[0], z - ISL[1]); hill = 23 * math.exp(-(di / 75) ** 2)
    h += hill
    dc = seg_d(x, z, CAN0, CAN1)
    if dc < 22 and r > .85: h = min(h, -3.0 + (h + 3.0) * sstep(8, 20, dc))
    return h
def tcol(x, z, h):
    r = lake_r(x, z)
    if h < -1.2: c = (.33, .27, .2)
    elif h < .6: c = (.55, .47, .34)
    else:
        g = .5 + .5 * math.sin(x * .07) * math.cos(z * .05); c = (.30 + .06 * g, .42 + .05 * g, .2)
        di = math.hypot(x - ISL[0], z - ISL[1])
        if di < 70 and h > 3: c = (.27, .43, .19)
    return c
N, SZ = 300, 1500.
ter = Obj('terrain', smooth=True)
bm = ter.bm; grid = []
for j in range(N + 1):
    row = []
    for i in range(N + 1):
        x = -SZ / 2 + SZ * i / N + 150; z = -SZ / 2 + SZ * j / N + 150
        row.append(bm.verts.new((x, height(x, z), z)))
    grid.append(row)
col_layer = bm.loops.layers.color.new('Col')
k = ter.mi(M['mud'])
for j in range(N):
    for i in range(N):
        f = bm.faces.new((grid[j][i], grid[j + 1][i], grid[j + 1][i + 1], grid[j][i + 1]))
        for l in f.loops:
            v = l.vert.co; c = tcol(v.x, v.z, v.y); l[col_layer] = (*c, 1)
mter = mat('terrain', '#ffffff', .95)
ter.mats = [mter]
for f in bm.faces: f.material_index = 0
ter.finish()

# cráter del lago vaciado (embudo hasta la mina), oculto salvo en el plano de la cascada
cr = Obj('crater', smooth=True); bm = cr.bm; rings = []
RR = [(46, -3.2), (40, -6), (33, -12), (26, -22), (19, -34), (13, -48), (8, -62), (4, -78)]
for (rad, y) in RR:
    ring = []
    for i in range(48):
        a = i / 48 * 2 * math.pi; w = 1 + .12 * math.sin(5 * a + rad) + .07 * math.sin(11 * a)
        ring.append(bm.verts.new((rad * w * math.cos(a), y + rnd.uniform(-.8, .8), rad * w * math.sin(a))))
    rings.append(ring)
for j in range(len(rings) - 1):
    for i in range(48):
        bm.faces.new((rings[j][i], rings[j][(i + 1) % 48], rings[j + 1][(i + 1) % 48], rings[j + 1][i]))
cr.mats = [M['mud']]; cr.finish()


# cuenca del lago vaciado y hundido (plano de la cascada): paredes de ~45 m bajo la boca del canal y embudo hacia la mina
def edge_r(a):
    w = 1 + .06 * math.sin(3 * a + .7) + .04 * math.sin(5 * a - 1.1)
    return w / math.sqrt((math.cos(a) / LAKE_RX) ** 2 + (math.sin(a) / LAKE_RZ) ** 2)
bs = Obj('basin', smooth=True); bm = bs.bm; NA, NU = 160, 60; G = []
cl = bs.bm.loops.layers.color.new('Col')
def bprof(u, a):
    n = nz(math.cos(a) * u * 300, math.sin(a) * u * 300)
    if u > .955: return -3.0 + n * .2
    if u > .875: k = (u - .875) / .08; return -46 + 43 * (k ** 1.6) + n * 1.5
    if u > .16: return -46 - 12 * (1 - (u - .16) / .715) + n * 2.2 + 1.5 * math.sin(a * 7 + u * 30)
    return -58 - 40 * (1 - u / .16) ** 1.4
for j in range(NU + 1):
    u = .03 + .945 * j / NU; row = []
    for i in range(NA):
        a = i / NA * 2 * math.pi; r = edge_r(a) * u
        row.append(bm.verts.new((r * math.cos(a), bprof(u, a), r * math.sin(a))))
    G.append(row)
for j in range(NU):
    for i in range(NA):
        f = bm.faces.new((G[j][i], G[j][(i + 1) % NA], G[j + 1][(i + 1) % NA], G[j + 1][i]))
        for l in f.loops:
            y = l.vert.co.y; wet = max(0, min(1, (-y - 3) / 60)); c = (.52 - .12 * wet, .42 - .1 * wet, .30 - .07 * wet)
            l[cl] = (*c, 1)
bs.mats = [mat('basin_mud', '#ffffff', .6)]
for f in bm.faces: f.material_index = 0
bs.finish()
# ---------------- PLATAFORMA DE PERFORACIÓN ----------------
def rig(o, X=0., Y=0., Z=0.):
    D = 1.6  # cubierta
    o.box((X, Y - .2, Z), (34, 3.6, 15), M['hull'])
    o.box((X, Y + D + .05, Z), (33.4, .1, 14.4), M['deck'])
    # rampas de proa y popa
    for s in (-1, 1): o.box((X + s * 17.6, Y + .6, Z), (1.4, 2.2, 14.6), M['hull'], rz=s * .5)
    # subestructura y piso de perforación
    dx = X + 6; base = Y + D
    for sx in (-1, 1):
        for sz in (-1, 1): o.box((dx + sx * 4, base + 3, Z + sz * 4), (.9, 6, .9), M['derr'])
    o.box((dx, base + 6.3, Z), (10, .6, 10), M['deck'])
    # torre de perforación (celosía)
    H = 38.; b0, b1 = 4.2, 1.1
    def leg(h, sx, sz):
        w = b0 + (b1 - b0) * h / H; return (dx + sx * w, base + 6.6 + h, Z + sz * w)
    for sx in (-1, 1):
        for sz in (-1, 1): o.cyl(leg(0, sx, sz), leg(H, sx, sz), .2, M['derr'], 6)
    lv = [0, 3.5, 7, 10.5, 14, 17.5, 21, 24.5, 28, 31.5, 35, 38]
    corners = [(-1, -1), (1, -1), (1, 1), (-1, 1)]
    for li, h in enumerate(lv):
        for ci in range(4):
            a, b = corners[ci], corners[(ci + 1) % 4]
            o.cyl(leg(h, *a), leg(h, *b), .1, M['white' if li % 3 == 1 else 'derr'], 5)
            if li < len(lv) - 1:
                h2 = lv[li + 1]; o.cyl(leg(h, *a), leg(h2, *b), .07, M['derr'], 4)
    o.box((dx, base + 6.6 + H + .6, Z), (3.4, 1.2, 3.4), M['steel'])            # bloque corona
    o.box((dx + 1.9, base + 6.6 + 27, Z), (1.6, .2, 2.4), M['yel'])               # plataforma del enganchador
    o.cyl((dx, base + 6.6 + H, Z), (dx, base + 6.6 + 16, Z), .05, M['steel'], 4)  # cables
    o.box((dx, base + 6.6 + 15, Z), (1.2, 2.2, .8), M['yel'])                     # aparejo
    o.cyl((dx, base + 6.6 + 14, Z), (dx, Y - 2.4, Z), .22, M['pipe'], 10)          # tubería que baja al lago
    # caseta del perforador
    o.box((dx - 6.5, base + 7.9, Z - 3), (3.2, 2.6, 3), M['blue']); o.box((dx - 6.5, base + 8.3, Z - 1.45), (2.4, 1.1, .06), M['glass'])
    # bastidor de tubos
    for i in range(7):
        for j in range(2): o.cyl((X - 15, Y + D + .35 + j * .5, Z + 4.4 - i * .5 + j * .25), (X - 1, Y + D + .35 + j * .5, Z + 4.4 - i * .5 + j * .25), .2, M['pipe'], 7)
    o.box((X - 8, Y + D + .15, Z + 3.6), (15, .3, 4), M['steel'])
    # módulo de vivienda (2 pisos)
    o.box((X - 11, Y + D + 3, Z - 3.5), (9, 6, 6.5), M['white'])
    o.box((X - 11, Y + D + 6.15, Z - 3.5), (9.4, .3, 6.9), M['red'])
    for fl in (1.6, 4.6):
        for wx in range(4): o.box((X - 14.3 + wx * 2.2, Y + D + fl, Z - .23), (1.2, .9, .08), M['glass'])
    # tanques de lodo y generadores
    for i in range(3): o.cyl((X + 13, Y + D, Z - 5 + i * 3.4), (X + 13, Y + D + 3.2, Z - 5 + i * 3.4), 1.4, M['yel'], 14)
    o.box((X + 13.5, Y + D + 1.2, Z + 4.6), (5, 2.4, 3), M['steel']); o.box((X + 13.5, Y + D + 2.6, Z + 4.6), (5.2, .3, 3.2), M['yel'])
    # grúa
    o.cyl((X - 2, Y + D, Z - 6), (X - 2, Y + D + 5, Z - 6), .7, M['yel'], 10)
    o.cyl((X - 2, Y + D + 5, Z - 6), (X - 14, Y + D + 16, Z - 4), .3, M['yel'], 6)
    # barandillas
    for sz in (-1, 1):
        o.cyl((X - 16.6, Y + D + 1.1, Z + sz * 7.1), (X + 16.6, Y + D + 1.1, Z + sz * 7.1), .05, M['yel'], 4)
        for i in range(12): xx = X - 16.6 + i * 3.02; o.cyl((xx, Y + D, Z + sz * 7.1), (xx, Y + D + 1.1, Z + sz * 7.1), .04, M['yel'], 4)
    for sx in (-1, 1): o.cyl((X + sx * 16.6, Y + D + 1.1, Z - 7.1), (X + sx * 16.6, Y + D + 1.1, Z + 7.1), .05, M['yel'], 4)
    # salvavidas
    for i in range(3): o.torus((X - 12 + i * 10, Y + D + .7, Z + 7.25), .45, .1, M['orange'], 12, axis='X')
    # mástil y antena
    o.cyl((X - 14, Y + D + 6.3, Z - 5), (X - 14, Y + D + 12, Z - 5), .08, M['steel'], 4)
    # pilotes/anclas (spuds)
    for sx in (-1, 1): o.cyl((X + sx * 15.5, Y - 4, Z + 6.2), (X + sx * 15.5, Y + D + 9, Z + 6.2), .5, M['yel'], 8)
r_ = Obj('rig'); rig(r_); r_.finish()

# ---------------- BARCAZAS, REMOLCADOR, CAMARONEROS ----------------
def barge(o, cargo=0):
    o.box((0, 0, 0), (24, 2.6, 9), M['rust'])
    for s in (-1, 1): o.box((s * 12.4, .1, 0), (1.6, 2.2, 9), M['rust'], rz=s * .55)
    o.box((0, 1.35, 0), (22, .1, 8), M['steel'])
    for s in (-1, 1): o.box((0, 1.75, s * 4.3), (22, .8, .35), M['rust'])
    for s in (-1, 1): o.box((s * 11, 1.75, 0), (.35, .8, 8.9), M['rust'])
    if cargo == 1:
        for i in range(5):
            for j in range(3 - (i % 2)): o.cyl((-9, 1.85 + j * .6, -2 + i * .9 + (j % 2) * .45), (8, 1.85 + j * .6, -2 + i * .9 + (j % 2) * .45), .3, M['pipe'], 7)
    elif cargo == 2:
        o.box((-5, 2.8, 0), (6, 2.6, 2.4), M['blue']); o.box((3, 2.8, 0), (6, 2.6, 2.4), M['red'])
    elif cargo == 3:
        o.ico((0, 1.6, 0), 4, M['sand'], sc=(2.2, .55, .9), sub=2)
    for s in (-1, 1): o.cyl((s * 10.5, 1.4, 4.1), (s * 10.5, 2.0, 4.1), .2, M['steel'], 6)
for c in range(4):
    b = Obj('barge%d' % c); barge(b, c); b.finish()
tug = Obj('tug'); o = tug
o.box((0, 0, 0), (12, 2.4, 6), M['white']); o.box((0, -.7, 0), (12.2, 1.2, 6.2), M['red'])
for s in (-1, 1): o.box((s * 6.3, .2, 0), (1.2, 2, 6), M['white'], rz=s * .4)
o.box((1, 2.6, 0), (5, 2.6, 4.4), M['white']); o.box((1, 5.2, 0), (3.6, 2.4, 3.6), M['white']); o.box((1, 5.6, 0), (3.7, .9, 3.7), M['glass'])
o.box((1, 6.5, 0), (4.2, .2, 4.2), M['blue']); o.cyl((-1.5, 4, -1.4), (-1.5, 8, -1.4), .3, M['black'], 8); o.cyl((-1.5, 4, 1.4), (-1.5, 8, 1.4), .3, M['black'], 8)
for s in (-1, 1): o.box((6.2, .9, s * 2), (.4, 1.8, 1.4), M['black'])
for i in range(4): o.torus((-5 + i * 3, .4, 3.12), .5, .22, M['black'], 10, axis='X')
tug.finish()
sb = Obj('shrimp'); o = sb
o.box((0, 0, 0), (12, 1.8, 4), M['white']); o.box((6.4, .2, 0), (1.6, 1.4, 3.6), M['white'], rz=.5)
o.box((-.5, -.6, 0), (12.2, .5, 4.1), M['green_b']); o.box((3, 1.9, 0), (3, 2, 3), M['white']); o.box((3, 2.2, 0), (3.05, .8, 3.05), M['glass'])
o.cyl((1, 0, 0), (1, 9, 0), .14, M['wood'], 6)
for s in (-1, 1): o.cyl((1, 7, 0), (1, 2.6, s * 9), .09, M['wood'], 5)
for s in (-1, 1): o.cyl((1, 2.6, s * 9), (-3, .2, s * 9.4), .03, M['steel'], 4)
sb.finish()

# ---------------- ÁRBOLES ----------------
def oak(o):
    o.cyl((0, 0, 0), (0, 4.2, 0), .7, M['bark'], 9, r1=.45)
    for a in range(5):
        aa = a * 1.26 + .3; o.cyl((0, 3.6, 0), (math.cos(aa) * 5, 6.8 + (a % 2), math.sin(aa) * 5), .34, M['bark'], 6, r1=.14)
    for i in range(16):
        aa = i * 2.4; rr = 1.5 + (i % 4) * 1.5; y = 6.6 + (i % 3) * 1.3 + (1 if rr < 3 else 0)
        o.ico((math.cos(aa) * rr, y, math.sin(aa) * rr), 2.4 + (i % 3) * .5, M['leaf'], sc=(1.35, .72, 1.35), sub=2)
    for i in range(10):
        aa = i * 2.2 + .5; rr = 3.5 + (i % 3) * 1.4; L = 2.2 + (i % 4) * .8
        o.cyl((math.cos(aa) * rr, 6.4, math.sin(aa) * rr), (math.cos(aa) * rr * 1.03, 6.4 - L, math.sin(aa) * rr * 1.03), .3, M['moss'], 5, r1=.05)
oo = Obj('tree_oak', smooth=True); oak(oo); oo.finish()
def cypress(o):
    o.cyl((0, -.3, 0), (0, 1.8, 0), 1.4, M['bark'], 10, r1=.6)
    o.cyl((0, 1.8, 0), (0, 15, 0), .6, M['bark'], 8, r1=.22)
    for i in range(9):
        y = 6 + i * 1.15; rr = 2.9 - i * .25; aa = i * 2.1
        o.ico((math.sin(aa) * .5, y, math.cos(aa) * .5), max(.9, rr), M['leaf2'], sc=(1.25, .62, 1.25), sub=2)
    for i in range(7):
        aa = i * .9; rr = 2.2 - (i % 3) * .3; L = 1.6 + (i % 3) * .7
        o.cyl((math.cos(aa) * rr, 9 - (i % 3), math.sin(aa) * rr), (math.cos(aa) * rr * 1.05, 9 - (i % 3) - L, math.sin(aa) * rr * 1.05), .2, M['moss'], 5, r1=.03)
    for i in range(6):
        aa = i * 1.05 + .4; o.cyl((math.cos(aa) * 2.4, -.4, math.sin(aa) * 2.4), (math.cos(aa) * 2.4, .9, math.sin(aa) * 2.4), .2, M['bark'], 5, r1=.07)
cc = Obj('tree_cypress', smooth=True); cypress(cc); cc.finish()

# ---------------- ISLA: casa, jardín, castillete de la mina, almacenes ----------------
hx, hz = ISL[0] - 10, ISL[1] + 15; hy = height(hx, hz)
ho = Obj('house'); o = ho
o.box((0, 4, 0), (18, 8, 12), M['white']); o.box((0, 8.4, 0), (19, .4, 13), M['white'])
o.prism([(-10, 8.6), (10, 8.6), (0, 13)], -7, 7, M['roof'])
o.box((0, 4.2, 7.4), (20, .3, 3), M['white']); o.box((0, 8.0, 7.4), (20.4, .3, 3.2), M['roof'])
for i in range(8): o.cyl((-9.5 + i * 2.7, 0, 8.7), (-9.5 + i * 2.7, 8, 8.7), .25, M['white'], 8)
for fl in (1.8, 5.6):
    for i in range(6): o.box((-7.5 + i * 3, fl, 6.03), (1.3, 2, .1), M['glass'])
o.box((6, 12, 0), (4, 6, 4), M['white']); o.prism([(3.6, 15), (8.4, 15), (6, 18.5)], -2.2, 2.2, M['roof'])
for i in range(2): o.box((-4 + i * 9, 10.4, 0), (1, 4, 1), M['wood_d'])
o.box((0, 1.3, 13), (3, .3, 3), M['conc'])
ho.finish(origin=(0, 0, 0))
hf = Obj('headframe'); o = hf
o.box((0, .6, 0), (14, 1.2, 14), M['conc'])
for sx in (-1, 1):
    for sz in (-1, 1): o.cyl((sx * 4, 1, sz * 4), (sx * 1.6, 28, sz * 1.6), .35, M['steel'], 6)
for h in (6, 12, 18, 24):
    w = 4 - 2.4 * h / 27
    for (a, b) in [((-1, -1), (1, -1)), ((1, -1), (1, 1)), ((1, 1), (-1, 1)), ((-1, 1), (-1, -1))]:
        o.cyl((a[0] * w, h, a[1] * w), (b[0] * w, h, b[1] * w), .15, M['steel'], 4)
for sx in (-1, 1): o.cyl((sx * 1.5, 1, -9), (sx * 1.2, 26, -1.5), .3, M['steel'], 6)   # tornapuntas
o.box((0, 28.3, 0), (4.4, .6, 4.4), M['steel'])
for s in (-1, 1): o.torus((s * .9, 30.2, 0), 2, .18, M['red'], 20, axis='X')
o.box((0, 4, -16), (12, 8, 9), M['tin']); o.box((0, 8.3, -16), (12.6, .4, 9.6), M['red'])
o.box((14, 5, -4), (10, 10, 14), M['tin']); o.prism([(9, 10), (19, 10), (14, 13)], -11, 3, M['tin'])
o.cyl((9, 8, -4), (0, 18, 6), .9, M['tin'], 8)
for i in range(4): o.box((-12 + i * 3.5, 1.2, 10), (3, 2.4, 1.6), M['yel'])
hf.finish()

# ---------------- CORTE (diorama en sección): estratos, cúpula de sal y mina de cámaras y pilares ----------------
CX = 3000.; ZF = 30.; ZB = -210.
co = Obj('corte')
def wav(x, base, amp, f, ph): return base + amp * math.sin(x * f + ph) + amp * .4 * math.sin(x * f * 2.7 + ph * 2)
xs = [CX - 150 + i * 5 for i in range(61)]
# superficie: isla (izq.) más alta, lago 3 m a la dcha.
def top(x):
    lx = x - CX
    if lx < -70: return 2.5 + 6 * sstep(-70, -130, lx)
    return -3.2 + 5.7 * sstep(-60, -80, lx)
layers = [('clay', lambda x: top(x), lambda x: wav(x, -55, 6, .03, 1)), ('sand', lambda x: wav(x, -55, 6, .03, 1), lambda x: wav(x, -150, 10, .02, 2) - 30 * math.exp(-((x - CX) / 90) ** 2) * -1),
          ('salt', lambda x: wav(x, -150, 10, .02, 2) + 30 * math.exp(-((x - CX) / 90) ** 2), lambda x: -358.)]
for nm, up, dn in layers:
    pts = [(x, up(x)) for x in xs] + [(x, dn(x)) for x in reversed(xs)]
    co.prism(pts, ZB, ZF, M[nm])
# sal bajo la mina
co.prism([(CX - 150, -374), (CX + 150, -374), (CX + 150, -430), (CX - 150, -430)], ZB, ZF, M['salt'])
# pilares de la mina (cámaras de 14 m y pilares de 14 m, altura 16 m)
mine = Obj('mine')
for ix in range(-5, 6):
    for iz in range(0, 8):
        px = CX + ix * 28 + 7; pz = ZF - 7 - iz * 28
        if ix == -5 and iz == 0: continue
        mine.box((px, -366, pz), (14, 16, 14), M['salt_d'] if (ix + iz) % 2 else M['salt'])
# lámparas en pilares
for ix in range(-5, 6):
    for iz in range(0, 4):
        mine.box((CX + ix * 28 + 7, -361, ZF - 7 - iz * 28 + 7.1), (.9, .4, .2), M['lamp'])
# raíles / tubería en el suelo
for iz in range(0, 7): mine.cyl((CX - 150, -373.6, ZF - 21 - iz * 28), (CX + 150, -373.6, ZF - 21 - iz * 28), .25, M['pipe'], 6)
mine.finish(origin=(CX, 0, 0))
# pozo del ascensor (a la izquierda) — hueco abierto en la sección: marco y raíles
sh = Obj('shaft')
SX = CX - 122
for s in (-1, 1): sh.cyl((SX + s * 4, -374, ZF - 2), (SX + s * 4, 12, ZF - 2), .3, M['steel'], 6)
for y in range(-370, 12, 12): sh.cyl((SX - 4, y, ZF - 2), (SX + 4, y, ZF - 2), .2, M['steel'], 4)
sh.finish(origin=(CX, 0, 0))
cob = co.finish(origin=(CX, 0, 0))
bpy.ops.mesh.primitive_cube_add(size=1, location=(SX, -(ZF - 4.5), -180)); cut = bpy.context.object; cut.scale = (11, 11, 392); cut.name = 'cutter'
md = cob.modifiers.new('pozo', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.object = cut; md.solver = 'EXACT'
bpy.context.view_layer.objects.active = cob; bpy.ops.object.modifier_apply(modifier='pozo'); bpy.data.objects.remove(cut)
# camión de mina y cargadora
tr = Obj('minetruck'); o = tr
o.box((0, 2.2, 0), (9, 2.6, 4.2), M['yel']); o.box((-2, 4.6, 0), (5.5, 2.4, 4.4), M['yel']); o.box((3.2, 4.3, -1.2), (2, 2, 1.8), M['yel']); o.box((3.25, 4.6, -1.2), (2.05, .9, 1.6), M['glass'])
for sx in (-1, 1):
    for sz in (-1, 1): o.cyl((sx * 3.2, 1.3, sz * 2.1), (sx * 3.2, 1.3, sz * 2.9), 1.3, M['black'], 14)
o.box((4.7, 3, 0), (.3, 1, 3), M['steel']); o.box((4.8, 3.4, 1.4), (.1, .4, .4), M['lamp']); o.box((4.8, 3.4, -1.4), (.1, .4, .4), M['lamp'])
tr.finish()
cg = Obj('cage'); o = cg
o.box((0, 0, 0), (7, .3, 5), M['steel']); o.box((0, 6, 0), (7, .3, 5), M['steel'])
for sx in (-1, 1):
    for sz in (-1, 1): o.cyl((sx * 3.4, 0, sz * 2.4), (sx * 3.4, 6, sz * 2.4), .12, M['yel'], 5)
for i in range(8): o.cyl((-3.4 + i, 0, -2.4), (-3.4 + i, 6, -2.4), .04, M['steel'], 4)
for i in range(6): o.cyl((-3.4, i * 1.2, -2.4), (3.4, i * 1.2, -2.4), .04, M['steel'], 4)
o.cyl((0, 6, 0), (0, 400, 0), .06, M['steel'], 4)
cg.finish()
# broca tricónica (primer plano del agujero de 35 cm)
bit = Obj('bit', smooth=True); o = bit
gold = mat('bit_gold', '#b8924a', .35, .9); cone = mat('bit_cone', '#6a6e74', .35, .85); stud = mat('bit_stud', '#9a9ca0', .35, .7)
o.cyl((0, 1.25, 0), (0, 4.5, 0), .085, M['pipe'], 24)                       # tubería
o.cyl((0, .98, 0), (0, 1.26, 0), .11, M['steel'], 24)                       # rosca / unión
o.cyl((0, .62, 0), (0, 1.0, 0), .155, gold, 24, r1=.11)                      # cuerpo
for i in range(3):
    a = i / 3 * 2 * math.pi + .5; ca, sa = math.cos(a), math.sin(a)
    o.box((ca * .1, .5, sa * .1), (.09, .3, .13), gold, ry=-a)                # pata
    c0 = Vector((ca * .13, .38, sa * .13)); c1 = Vector((ca * .02, .1, sa * .02)); ax = (c1 - c0).normalized()
    o.cyl(tuple(c0), tuple(c1), .1, cone, 20, r1=.035)                        # cono
    up = Vector((0, 1, 0)); s1 = ax.cross(up).normalized(); s2 = ax.cross(s1).normalized()
    for row in range(3):
        f = .15 + row * .3; cc = c0.lerp(c1, f); rr = (.1 + (.035 - .1) * f) + .012
        for j in range(12 - row * 3):
            b2 = j / (12 - row * 3) * 2 * math.pi + row * .3; pos = cc + s1 * math.cos(b2) * rr + s2 * math.sin(b2) * rr
            o.sph(tuple(pos), .016, stud, seg=8, rings=5)
    o.cyl((ca * .155, .78, sa * .155), (ca * .16, .55, sa * .16), .025, M['steel'], 8)   # boquilla
bit.finish()

# ---------------- muelle del canal (Delcambre) ----------------
dk = Obj('dock'); o = dk
for i in range(14):
    o.box((i * 4, 1.5, 0), (3.8, .3, 4), M['wood'])
    for s in (-1, 1): o.cyl((i * 4 - 1.8, -3.2, s * 1.9), (i * 4 - 1.8, 2.3, s * 1.9), .2, M['wood_d'], 6)
o.box((20, 3.4, 10), (14, 6, 9), M['tin']); o.box((20, 6.6, 10), (14.6, .4, 9.6), M['red'])
dk.finish()

# ---------------- layout para three.js: árboles, posiciones ----------------
trees = []
for i in range(5200):
    x = rnd.uniform(-560, 700); z = rnd.uniform(-560, 700); h = height(x, z); r = lake_r(x, z)
    if r < 1.1 or h < 1.0: continue
    if seg_d(x, z, CAN0, CAN1) < 30: continue
    di = math.hypot(x - ISL[0], z - ISL[1])
    if math.hypot(x - hx, z - hz) < 26: continue
    if math.hypot(x - (ISL[0] + 25), z - (ISL[1] - 30)) < 32: continue
    p = .6 if di < 90 else (.5 if r < 1.5 else .22)
    if rnd.random() > p: continue
    trees.append([round(x, 1), round(h - .3, 2), round(z, 1), round(rnd.uniform(0, 6.28), 2), round(rnd.uniform(.8, 1.35), 2), 1 if (r < 1.35 or rnd.random() < .3) else 0])
lay = dict(trees=trees, lake=[LAKE_RX, LAKE_RZ], island=ISL, house=[hx, height(hx, hz), hz], headframe=[ISL[0] + 25, height(ISL[0] + 25, ISL[1] - 30), ISL[1] - 30],
           canal=[CAN0, CAN1], corte=dict(cx=CX, zf=ZF, shaft=SX))
json.dump(lay, open(os.path.join(OUT, 'layout.json'), 'w'))
# colocar casa y castillete (los demás se colocan desde three.js)
bpy.data.objects['house'].location = (hx, -hz, height(hx, hz) - .5)
hfp = lay['headframe']; bpy.data.objects['headframe'].location = (hfp[0], -hfp[2], hfp[1] - .6)
kw = dict(filepath=os.path.join(OUT, 'lago.glb'), export_format='GLB', export_apply=True)
try: bpy.ops.export_scene.gltf(**kw, export_vertex_color='ACTIVE', export_all_vertex_colors=False)
except TypeError: bpy.ops.export_scene.gltf(**kw)
print('EXPORT_OK', len(trees), 'árboles')

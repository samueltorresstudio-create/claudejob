# 75 · El país que no existía (Poyais) — decorados de DIBUJO ANIMADO modelados en Blender y exportados a GLB para three.js.
# Formas gordas y simples, colores planos y vivos; el contorno negro y el sombreado de tebeo los pone three.js.
# Coordenadas en el sistema de three.js (x este, y arriba, z hacia la cámara); finish() las pasa a Blender (x, -z, y).
# Uso: python3 poyais.py  → poyais.glb + layout.json
import bpy, bmesh, math, random, json, os
from mathutils import Matrix, Vector
OUT = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)
rnd = random.Random(75)
MATS = {}
def mat(name, col):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    c = tuple(int(col[i:i + 2], 16) / 255 for i in (1, 3, 5))
    b.inputs['Base Color'].default_value = (*[x ** 2.2 for x in c], 1); b.inputs['Roughness'].default_value = 1.
    MATS[name] = m; return m
exec(open(os.path.join(OUT, 'obj_base.py')).read())
def grp(o, fn, Mx):   # construye con fn(o) y mueve lo nuevo con la matriz Mx
    before = set(o.bm.verts); fn(o); new = [v for v in o.bm.verts if v not in before]; bmesh.ops.transform(o.bm, matrix=Mx, verts=new)
def TR(x=0, y=0, z=0, ry=0.): return Matrix.Translation(Vector((x, y, z))) @ Matrix.Rotation(ry, 4, 'Y')

# ---------------- paleta de tebeo ----------------
P = dict(
    pink=('#f28fa8'), pinkd=('#d8688a'), cream=('#fbf0d2'), creamd=('#e8d6a8'), gold=('#ffc928'), goldd=('#e0951c'), blue=('#4f8fe8'), bluel=('#8ec5ff'), navy=('#2c3f86'),
    red=('#e3453a'), redd=('#b82e32'), green=('#43bd65'), greend=('#2f9a52'), teal=('#2cc4b4'), yellow=('#ffd96a'), orange=('#ff9a3c'), purple=('#8a63d2'),
    wood=('#b9824e'), woodd=('#7d5230'), cb=('#d4a96c'), cbd=('#a8814a'), stone=('#ddd6c6'), stoned=('#b8b0a2'), roofr=('#d9553d'), roofb=('#4a70c0'), roofg=('#3fa07c'),
    leaf=('#41c261'), leaf2=('#2ea35a'), leaf3=('#7ed957'), trunk=('#a8733f'), trunk2=('#7f5430'), sand=('#f5e1a4'), sandd=('#e5c97c'), rock=('#8f8aa3'),
    white=('#ffffff'), black=('#2a2430'), win=('#78bdff'), wind=('#2f4a8a'), paper=('#f7f0d8'), wax=('#c8342c'), brick=('#cf6d50'), brick2=('#e8a05a'), brick3=('#b4c8e8'),
    cobble=('#a9a2bd'), cobbled=('#8d86a3'), grass=('#6fcb58'), mud=('#8e6b48'), swamp=('#5d8f4e'), lamp=('#ffe58a'), iron=('#3c3748'), water=('#58c0e8'), coin=('#ffd23a'),
    skin=('#f4d9b4'), plum=('#8c4f9e'), mint=('#9fe2c0'), lilac=('#c9b3f2'),
)
M = {k: mat(k, v) for k, v in P.items()}
for n in ['opera', 'cat', 'pal', 'poyais', 'bonos', 'agot', 'cafe', 'post', 'tarjeta']: M['sign_' + n] = mat('sign_' + n, '#ffffff')
M['painting'] = mat('painting', '#ffffff')

# ---------------- ayudantes de decorado ----------------
def fp(o, pts, col, z=0., d=.35, back='cb'):      # recorte de cartón: trasera de cartón y cara pintada
    o.prism(pts, z - d, z, M[back]); o.prism(pts, z, z + .1, M[col])
def fbox(o, cx, y0, w, h, col, z=0., d=.35):
    o.box((cx, y0 + h / 2, z - d / 2), (w, h, d), M['cb']); o.box((cx, y0 + h / 2, z + .04), (w + .02, h + .02, .1), M[col])
def wins(o, x0, y0, w, h, nx, ny, z, ww=1., wh=1.6, arch=False, frame='white', glass='win'):
    for i in range(nx):
        for j in range(ny):
            cx = x0 + w * (i + .5) / nx; cy = y0 + h * (j + .5) / ny
            o.box((cx, cy, z + .09), (ww + .4, wh + .4, .06), M[frame]); o.box((cx, cy, z + .13), (ww, wh, .06), M[glass])
            if arch:
                o.cyl((cx, cy + wh / 2, z + .09), (cx, cy + wh / 2, z + .12), ww / 2 + .2, M[frame], 14); o.cyl((cx, cy + wh / 2, z + .13), (cx, cy + wh / 2, z + .16), ww / 2, M[glass], 14)
            o.box((cx, cy, z + .18), (.1, wh, .05), M[frame]); o.box((cx, cy + wh * .1, z + .18), (ww, .1, .05), M[frame])
def door(o, cx, w, h, z, col='wood', arch=True, frame='white'):
    o.box((cx, h / 2, z + .1), (w + .5, h + .4, .06), M[frame]); o.box((cx, h / 2, z + .14), (w, h, .06), M[col])
    if arch:
        o.cyl((cx, h, z + .1), (cx, h, z + .13), w / 2 + .25, M[frame], 14); o.cyl((cx, h, z + .14), (cx, h, z + .17), w / 2, M[col], 14)
    o.sph((cx + w * .3, h * .45, z + .24), .1, M['gold'])
def struts(o, cx, w, h, z0=-.35, depth=7.):          # puntales de madera por detrás: se ven al girar la cámara
    for sx in (-.36, .36):
        x = cx + sx * w; o.cyl((x, h * .88, z0 - .1), (x + sx * .9, .3, z0 - depth), .2, M['woodd'], 6)
        o.box((x + sx * .9, .25, z0 - depth), (1.4, .5, 1.1), M['wood'])
        o.sph((x + sx * .9 + .5, .55, z0 - depth + .6), .55, M['cbd'], (1, .7, 1))         # saco de arena
    o.cyl((cx - w * .36, h * .45, z0 - .25), (cx + w * .36, h * .5, z0 - .25), .13, M['woodd'], 6)
def halfdome(o, cx, y, r, col, z=0., rib='goldd'):
    pts = [(cx + r * math.cos(a * math.pi / 14), y + r * 1.05 * math.sin(a * math.pi / 14)) for a in range(15)]
    fp(o, pts, col, z)
    for k in (-.55, 0., .55): o.box((cx + k * r, y + r * .5, z + .13), (.13, r * .9, .05), M[rib])
    o.cyl((cx, y + r * 1.05, z + .1), (cx, y + r * 1.05 + r * .45, z + .1), .09, M['gold'], 6); o.sph((cx, y + r * 1.05 + r * .5, z + .1), r * .12, M['gold'])
def cone(o, cx, y, w, h, col, z=0.): fp(o, [(cx - w / 2, y), (cx + w / 2, y), (cx, y + h)], col, z)
def flag(o, x, y, z, col, s=1.):
    o.cyl((x, y, z), (x, y + 3 * s, z), .07, M['iron'], 5); o.prism([(x, y + 3 * s), (x + 1.9 * s, y + 2.75 * s), (x + 1.7 * s, y + 2.35 * s), (x + 1.95 * s, y + 2.05 * s), (x, y + 2.1 * s)], z - .03, z + .03, M[col])
def lamp(o, x, z, h=4.2):
    o.cyl((x, 0, z), (x, h, z), .14, M['iron'], 6); o.cyl((x, 0, z), (x, .5, z), .3, M['iron'], 8, .14); o.box((x, h + .35, z), (.7, .85, .7), M['lamp']); o.box((x, h + .85, z), (.95, .18, .95), M['iron']); o.cyl((x, h + .9, z), (x, h + 1.4, z), .4, M['iron'], 6, 0.)
def barrel(o, x, y, z, r=.5, h=.95, col='wood'):
    o.cyl((x, y, z), (x, y + h, z), r, M[col], 10); o.cyl((x, y + h * .2, z), (x, y + h * .28, z), r * 1.04, M['iron'], 10); o.cyl((x, y + h * .72, z), (x, y + h * .8, z), r * 1.04, M['iron'], 10)
def crate(o, x, y, z, s=1., ry=0., col='wood'):
    o.box((x, y + s / 2, z), (s, s, s), M[col], ry); o.box((x, y + s / 2, z), (s * 1.04, s * .12, s * 1.04), M['woodd'], ry)
    o.box((x, y + s / 2, z), (s * 1.04, s * 1.04, s * .12), M['woodd'], ry)
def bunting(o, x0, x1, y, z, n=9, sag=.7):
    cols = ['red', 'yellow', 'blue', 'green', 'pink']
    for i in range(n):
        t = (i + .5) / n; x = x0 + (x1 - x0) * t; yy = y - sag * 4 * t * (1 - t)
        o.prism([(x - .3, yy), (x + .3, yy), (x, yy - .6)], z - .02, z + .02, M[cols[i % 5]])
    o.cyl((x0, y, z), (x1, y, z), .03, M['iron'], 4)
def sign(o, name, cx, cy, z, w, h, ry=0.): o.box((cx, cy, z), (w, h, .08), M['sign_' + name], ry)

# ---------------- árboles y plantas (objetos sueltos, se clonan en three.js) ----------------
def palm(name='palm', h=8., lean=1.6, nfr=11):
    o = Obj(name); seg = 8; pts = []
    for i in range(seg + 1): t = i / seg; pts.append((lean * t * t, h * t, 0))
    for i in range(seg): o.cyl(pts[i], pts[i + 1], .42 - .2 * i / seg, M['trunk' if i % 2 else 'trunk2'], 8, .42 - .2 * (i + 1) / seg)
    top = pts[-1]
    leaf = [(0, 0), (1.2, .85), (3, 1.15), (4.8, .6), (6.4, -1.2), (3.6, -.5), (1.4, -.4)]
    for k in range(nfr):
        a = k / nfr * 2 * math.pi + rnd.uniform(-.2, .2); sc = rnd.uniform(.85, 1.15); col = 'leaf' if k % 2 else 'leaf2'
        vs = o.prism([(x * sc, y * sc) for x, y in leaf], -.05, .05, M[col]); o._fin(vs, M[col], Matrix.Translation(Vector(top)) @ Matrix.Rotation(a, 4, 'Y') @ Matrix.Rotation(math.pi / 2 - .75, 4, 'X'))
    for k in range(3): o.sph((top[0] + .3 * math.cos(k * 2.1), top[1] - .35, top[2] + .3 * math.sin(k * 2.1)), .32, M['trunk2'])
    o.finish(); return o
def bigtree(name='bigtree', h=9.):
    o = Obj(name); o.cyl((0, 0, 0), (0, h * .7, 0), .8, M['trunk'], 8, .5); o.cyl((0, h * .35, 0), (2.2, h * .75, .6), .3, M['trunk'], 6, .22)
    for (x, y, z, r, c) in [(0, h * .95, 0, 3.8, 'leaf2'), (-2.6, h * .8, 1, 2.8, 'leaf'), (2.8, h * .82, -.6, 3., 'leaf3'), (.6, h * 1.15, .4, 2.6, 'leaf')]:
        o.ico((x, y, z), r, M[c], (1, .8, 1), 2)
    o.finish(); return o
def fern(name='fern'):
    o = Obj(name)
    leaf = [(0, 0), (1, .3), (2.2, .4), (3.2, 0), (2.2, -.3), (1, -.25)]
    for k in range(8):
        a = k / 8 * 2 * math.pi; vs = o.prism(leaf, -.04, .04, M['leaf3' if k % 2 else 'leaf']); o._fin(vs, M['leaf'], Matrix.Translation(Vector((0, .2, 0))) @ Matrix.Rotation(a, 4, 'Y') @ Matrix.Rotation(math.pi / 2 - 1.0, 4, 'X'))
    o.finish(); return o
def bush(name='bush'):
    o = Obj(name)
    for (x, y, z, r, c) in [(0, .8, 0, 1.2, 'leaf'), (1, .6, .3, .9, 'leaf3'), (-.9, .55, -.2, .85, 'leaf2')]: o.ico((x, y, z), r, M[c], (1, .85, 1), 2)
    o.finish(); return o

# ================= A · LA CIUDAD DE CARTÓN DE POYAIS (origen 0,0,0; fachadas hacia +z) =================
def b_opera(o):
    fbox(o, 0, 0, 13, 8.5, 'pink'); fbox(o, 0, 8.5, 14, .8, 'cream', .3); fp(o, [(-7.2, 9.3), (7.2, 9.3), (0, 13.4)], 'cream', .3)
    o.cyl((0, 11.0, .5), (0, 11.0, .62), 1.3, M['gold'], 18); o.cyl((0, 11.0, .62), (0, 11.0, .7), .95, M['pinkd'], 18)
    for k in (-1, 1): o.box((k * .38, 11.0, .76), (.14, 1.5, .06), M['gold'])
    o.cyl((0, 4.3, .1), (0, 4.3, .22), 3., M['gold'], 20); o.box((0, 2.2, .1), (6., 4.4, .12), M['gold']); o.cyl((0, 4.3, .22), (0, 4.3, .3), 2.4, M['redd'], 20); o.box((0, 2.2, .22), (4.8, 4.4, .12), M['redd'])
    for k in (-1.5, 1.5): o.box((k, 2.2, .34), (.9, 4.4, .06), M['red'])
    for k in (-4.6, 4.6): wins(o, k - 1, 1.5, 2, 5.5, 1, 1, 0, 1.3, 2.6, True, 'cream', 'wind')
    wins(o, -4.5, 6.4, 9, 1.6, 3, 1, 0, 1.0, 1.1, True, 'cream', 'wind')
    sign(o, 'opera', 0, 7.7, .2, 5.4, 1.3); struts(o, 0, 13, 9)
def b_cathedral(o):
    fbox(o, 0, 0, 11, 10, 'cream'); fbox(o, -4.6, 0, 3.2, 16.5, 'creamd', .5); fbox(o, 4.6, 0, 3.2, 16.5, 'creamd', .5)
    halfdome(o, -4.6, 16.5, 1.9, 'blue', .5); halfdome(o, 4.6, 16.5, 1.9, 'blue', .5); halfdome(o, 0, 10, 3.9, 'blue', -1.4)
    o.cyl((0, 7.6, .14), (0, 7.6, .22), 2.1, M['goldd'], 20); o.cyl((0, 7.6, .22), (0, 7.6, .3), 1.6, M['bluel'], 20)
    for a in range(6): o.box((0, 7.6, .34), (.12, 3.2, .05), M['goldd'], 0., 0., a * math.pi / 6)
    door(o, 0, 3.2, 4.8, 0, 'woodd', True, 'goldd'); sign(o, 'cat', 0, 5.9, .2, 4.4, 1.0)
    for k in (-4.6, 4.6): wins(o, k - 1, 7, 2, 7, 1, 2, .5, .9, 1.8, True, 'cream', 'wind')
    o.box((0, 13.6, -1.4), (.4, 2.2, .2), M['gold']); o.box((0, 14.0, -1.4), (1.4, .4, .2), M['gold'])
    struts(o, 0, 11, 10, -.35, 8)
def b_parliament(o):
    fbox(o, 0, 0, 12, 7, 'bluel'); fbox(o, 0, 7, 13, .7, 'white', .3); fp(o, [(-6.5, 7.7), (6.5, 7.7), (0, 10.6)], 'white', .3)
    o.cyl((0, 8.6, .5), (0, 8.6, .6), 1.0, M['white'], 18); o.box((0, 8.8, .66), (.1, .8, .05), M['black']); o.box((.25, 8.6, .66), (.5, .1, .05), M['black'])
    for k in range(6): o.cyl((-4.5 + k * 1.8, 0, .9), (-4.5 + k * 1.8, 6.6, .9), .38, M['cream'], 10)
    o.box((0, .25, 1.4), (12.5, .5, 2.2), M['stone']); o.box((0, .6, 1.6), (13, .3, 2.6), M['stone'])
    wins(o, -5.5, 1.4, 11, 4, 4, 1, 0, 1., 2.4, True, 'white', 'wind'); flag(o, -6, 7.7, .3, 'red'); flag(o, 6, 7.7, .3, 'navy')
    struts(o, 0, 12, 7)
def b_palace(o):
    fbox(o, 0, 0, 14, 8, 'yellow'); fbox(o, -6.6, 0, 3, 12, 'orange', .3); fbox(o, 6.6, 0, 3, 12, 'orange', .3); fbox(o, 0, 0, 5, 12.5, 'yellow', .6)
    cone(o, -6.6, 12, 3.8, 4.5, 'red', .3); cone(o, 6.6, 12, 3.8, 4.5, 'red', .3); halfdome(o, 0, 12.5, 2.6, 'red', .6, 'gold')
    door(o, 0, 2.6, 4.2, 0.6, 'redd', True, 'gold'); o.box((0, 6.8, .8), (3.6, .35, 1.2), M['goldd']); o.box((0, 7.3, 1.4), (3.6, .3, .12), M['gold'])
    for k in (-4.2, 4.2): wins(o, k - 1.2, 1.8, 2.4, 5, 1, 1, 0, 1.2, 2.6, True, 'white', 'wind')
    wins(o, -6.6 - .9, 6.8, 1.8, 4, 1, 1, .3, .9, 1.6, True, 'white', 'wind'); wins(o, 6.6 - .9, 6.8, 1.8, 4, 1, 1, .3, .9, 1.6, True, 'white', 'wind')
    flag(o, -6.6, 16.4, .3, 'blue'); flag(o, 6.6, 16.4, .3, 'blue'); struts(o, 0, 14, 8)
def b_house(o, col, roofc, w=6., h=6.):
    fbox(o, 0, 0, w, h, col); fp(o, [(-w / 2 - .5, h), (w / 2 + .5, h), (0, h + 3.2)], roofc, .2); wins(o, -w / 2 + .6, 2.2, w - 1.2, 3, 2, 1, 0, .9, 1.4, False, 'white'); door(o, 0, 1.3, 2.2, 0, 'woodd', False)
    o.box((w * .25, h + 2.2, -.1), (.8, 1.4, .8), M['brick']); struts(o, 0, w, h, -.35, 5)
CITY = Obj('city')
for (fn, x, z) in [(b_palace, -29, -2.5), (b_parliament, -13.5, .8), (b_cathedral, 2.5, 0), (b_opera, 19.5, 1.6)]: grp(CITY, fn, TR(x, 0, z))
grp(CITY, lambda o: b_house(o, 'mint', 'roofb'), TR(-44, 0, -2)); grp(CITY, lambda o: b_house(o, 'lilac', 'roofr', 6.5, 7.), TR(35, 0, -1)); grp(CITY, lambda o: b_house(o, 'yellow', 'roofg', 5.5, 5.5), TR(-52, 0, -5)); grp(CITY, lambda o: b_house(o, 'pink', 'roofb', 6, 6.5), TR(43, 0, -3))
for x in (-22, -7, 9, 24): lamp(CITY, x, 12)
bunting(CITY, -22, -7, 5.3, 12); bunting(CITY, -7, 9, 5.3, 12); bunting(CITY, 9, 24, 5.3, 12)
CITY.finish()
# fuente y plaza
G = Obj('plaza')
G.cyl((0, -.5, 0), (0, 0, 0), 260, M['grass'], 40); G.cyl((0, 0, 6), (0, .12, 6), 30, M['stone'], 40); G.cyl((0, 0, 6), (0, .18, 6), 26, M['cream'], 40)
G.box((0, .1, 48), (8, .2, 70), M['sandd']); G.box((0, .12, 48), (6.4, .2, 70), M['sand'])
G.cyl((0, 0, 13), (0, 1., 13), 3.8, M['stone'], 20); G.cyl((0, .9, 13), (0, 1.0, 13), 3.2, M['water'], 20); G.cyl((0, 1., 13), (0, 3.3, 13), .35, M['stone'], 8); G.cyl((0, 3.3, 13), (0, 3.5, 13), 1.3, M['stone'], 14); G.sph((0, 4.1, 13), .6, M['gold'])
G.finish()
# detrás del decorado: cubo de pintura, escalera y plano enrollado (para el gancho)
BK = Obj('backstage')
BK.cyl((8, 0, -9), (8, .8, -9), .42, M['red'], 10, .5); BK.cyl((8, .72, -9), (8, .8, -9), .36, M['pink'], 10); BK.cyl((8.3, .8, -8.9), (9.4, 2.2, -8.9), .05, M['woodd'], 4); BK.box((9.5, 2.35, -8.9), (.35, .35, .15), M['pink'])
for s in (-.5, .5): BK.cyl((11.5 + s, 0, -8.5), (11.5 + s * .6, 5.2, -9.5), .1, M['wood'], 5)
for k in range(7): BK.cyl((11. + .06 * k, .7 * k + .5, -8.55 - .13 * k), (12 - .06 * k, .7 * k + .5, -8.55 - .13 * k), .06, M['wood'], 4)
crate(BK, -3, 0, -9.5, 1.3, .3); crate(BK, -1.6, 0, -9.8, 1., -.2); barrel(BK, -6, 0, -9.2)
BK.finish()

# ================= B · LONDRES (ox = 1000) =================
LX = 1000.
def roof2(o, w, h, depth, col, a=.5):      # tejado a dos aguas con caballete paralelo a la fachada
    L = depth / 2 / math.cos(a) * 1.06
    o.box((0, h + math.sin(a) * L / 2 + .2, -depth / 4), (w + .8, .35, L), M[col], 0., a); o.box((0, h + math.sin(a) * L / 2 + .2, -depth * .75), (w + .8, .35, L), M[col], 0., -a)
def th(o, w, h, col, roofc, depth=9.):
    o.box((0, h / 2, -depth / 2), (w, h, depth), M[col]); o.box((0, h + .1, -depth / 2), (w + .5, .5, depth + .5), M['white']); o.box((0, .7, .05), (w + .1, 1.4, .12), M['stoned'])
    wins(o, -w / 2 + 1.9, 2.9, w - 2.6, h - 3.6, 2, 2 if h < 12 else 3, 0, .95, 1.5, False, 'white'); door(o, -w / 2 + 1.1, 1.3, 2.5, 0, 'woodd', False); o.box((-w / 2 + 1.1, .2, .9), (2.2, .4, 1.6), M['stone'])
    roof2(o, w, h + .3, depth, roofc); o.box((w * .3, h + 2.8, -depth * .7), (1., 2.2, 1.), M['brick']); o.box((w * .3, h + 4.1, -depth * .7), (1.3, .3, 1.3), M['stoned'])
def b_office(o):
    o.box((0, 7, -6), (24, 14, 12), M['cream']); o.box((0, 14.4, -6), (25, .9, 12.5), M['white']); o.box((0, 15.5, -6), (22, 1.2, 10), M['navy']); o.prism([(-9, 14.9), (9, 14.9), (0, 18.4)], -3, 1.5, M['cream'])
    for k in range(6): o.cyl((-8.75 + k * 3.5, .4, 2.6), (-8.75 + k * 3.5, 11.5, 2.6), .5, M['white'], 10)
    o.box((0, 11.9, 2.6), (20, .8, 1.3), M['white']); o.box((0, .35, 3.2), (22, .7, 4), M['stone']); o.box((0, .85, 3.5), (21, .4, 3), M['stone'])
    door(o, 0, 3.2, 5., .05, 'woodd', True, 'gold'); wins(o, -10.5, 2.6, 21, 8, 5, 1, .05, 1.6, 3.4, True, 'white', 'wind')
    sign(o, 'poyais', 0, 13.0, 2.9, 12, 2.2); flag(o, -11, 16.2, 0, 'red', 1.1); flag(o, 11, 16.2, 0, 'blue', 1.1)
LO = Obj('london')
for i in range(10):
    zc = 18 - i * 6.6; H = [11, 12.5, 10, 13, 11.5][i % 5]; cl = ['brick', 'brick2', 'brick3', 'cream', 'mint'][(i + 1) % 5]; rf = ['roofb', 'roofr', 'roofg'][i % 3]
    grp(LO, lambda o, H=H, cl=cl, rf=rf: th(o, 6.4, H, cl, rf), TR(LX - 12.5, 0, zc, math.pi / 2))
    H2 = [12, 10.5, 13, 11, 12.5][i % 5]; cl2 = ['brick3', 'cream', 'brick', 'mint', 'brick2'][i % 5]; rf2 = ['roofr', 'roofg', 'roofb'][i % 3]
    grp(LO, lambda o, H=H2, cl=cl2, rf=rf2: th(o, 6.4, H, cl, rf) if False else th(o, 6.4, H, cl, rf), TR(LX + 12.5, 0, zc - 1, -math.pi / 2))
grp(LO, b_office, TR(LX, 0, -50))
for z in (14, 2, -10, -22): lamp(LO, LX - 8.4, z, 5); lamp(LO, LX + 8.4, z + 3, 5)
bunting(LO, LX - 8.4, LX + 8.4, 8.4, 14, 11, 1.2); bunting(LO, LX - 8.4, LX + 8.4, 8.4, -10, 11, 1.2)
LO.finish(origin=(LX, 0, 0))
LG = Obj('london_ground')
LG.box((LX, -.2, -20), (17, .4, 200), M['cobble']); LG.box((LX - 9.8, -.05, -20), (3, .5, 200), M['stone']); LG.box((LX + 9.8, -.05, -20), (3, .5, 200), M['stone'])
for k in range(36):
    LG.box((LX + rnd.uniform(-7.5, 7.5), .02, 30 - k * 3.3 + rnd.uniform(-1, 1)), (rnd.uniform(.8, 1.8), .04, rnd.uniform(.7, 1.4)), M['cobbled'])
LG.box((LX, -3, -20), (400, 5, 400), M['grass']); LG.finish(origin=(LX, 0, 0))
PD = Obj('podium'); barrel(PD, 0, 0, 0, .95, 1.5, 'wood'); PD.box((0, 1.55, 0), (2.3, .16, 2.3), M['wood'], .4); PD.finish()
EA = Obj('easel')      # caballete con el cuadro de la capital
for (x, z) in ((-.9, .3), (.9, .3), (0, -.7)): EA.cyl((x * .5, 3.2, 0), (x, 0, z), .06, M['woodd'], 5)
EA.box((0, 2.3, .1), (3.1, 2.4, .1), M['gold']); EA.box((0, 2.3, .16), (2.7, 2., .06), M['painting']); EA.finish()
BO = Obj('bondsign'); BO.cyl((-1.9, 0, 0), (-1.9, 3.6, 0), .1, M['woodd'], 5); BO.cyl((1.9, 0, 0), (1.9, 3.6, 0), .1, M['woodd'], 5); BO.box((0, 3.1, .02), (4.2, 1.7, .1), M['sign_bonos']); BO.finish()
AG = Obj('agotado'); AG.cyl((-2.2, 0, 0), (-2.2, 4.2, 0), .1, M['woodd'], 5); AG.cyl((2.2, 0, 0), (2.2, 4.2, 0), .1, M['woodd'], 5); AG.box((0, 3.4, .02), (4.9, 1.9, .1), M['sign_agot']); AG.finish()
BD = Obj('bond'); BD.box((0, 0, 0), (1.1, 1.5, .03), M['paper']); BD.box((0, .5, .02), (.9, .22, .02), M['navy']); BD.sph((.3, -.45, .03), .17, M['wax'], (1, 1, .4)); BD.box((-.15, -.1, .02), (.6, .06, .02), M['black']); BD.box((-.15, .05, .02), (.6, .06, .02), M['black']); BD.finish()
BS = Obj('bondstack')
for k in range(16): BS.box((rnd.uniform(-.06, .06), .03 + k * .04, rnd.uniform(-.06, .06)), (1.1, .035, 1.5), M['paper'], rnd.uniform(-.1, .1))
BS.box((0, .72, 0), (.3, .06, 1.52), M['navy']); BS.finish()
MB = Obj('moneybag'); MB.sph((0, .55, 0), .6, M['cb'], (1, 1.05, 1)); MB.cyl((0, 1.0, 0), (0, 1.25, 0), .2, M['cb'], 8); MB.box((0, 1.1, 0), (.5, .12, .5), M['red'], .8); MB.cyl((0, .6, .55), (0, .6, .62), .22, M['coin'], 10); MB.finish()

# ================= C · PUERTO (ox = 2000) =================
PX = 2000.
def ship(name, hull, trim, sail, flagc):
    o = Obj(name)
    for (x0, x1, hw) in [(-9.5, 2.5, 3.1), (2.5, 6.5, 2.5), (6.5, 10.5, 1.5)]:
        o.prism([(x0, -1.8), (x1, -1.8), (x1 + 1.2, 3.4), (x0 - .3, 3.6)], -hw, hw, M[hull])
    o.prism([(-9.8, 1.5), (10.5, 1.5), (11.5, 2.2), (11.5, 2.6), (-9.8, 2.3)], -3.15, 3.15, M[trim]); o.box((0, 3.6, 0), (21, .3, 6.4), M['woodd'])
    o.box((-6.5, 5.1, 0), (6.5, 3, 5.8), M['wood']); o.box((-6.5, 6.8, 0), (7, .4, 6.4), M['woodd'])
    for k in range(3): o.cyl((-9.4, 4.8, -1.8 + k * 1.8), (-9.4, 4.8, -1.8 + k * 1.8), .0, M['gold'], 4); o.box((-9.4, 5.2, -1.8 + k * 1.8), (.1, 1.0, .8), M['gold']); o.box((-9.45, 5.2, -1.8 + k * 1.8), (.1, .8, .6), M['wind'])
    for (mx, mh, mr) in [(-3, 17, .38), (2, 20, .42), (7, 15, .34)]:
        o.cyl((mx, 3.6, 0), (mx, mh, 0), mr, M['woodd'], 8)
        for (yy, ww) in [(mh * .5, 9.), (mh * .78, 7.2)]:
            o.cyl((mx, yy, -ww / 2), (mx, yy, ww / 2), .2, M['woodd'], 6)
            o.sph((mx + .6, yy - 3, 0), 3.4 * ww / 9, M[sail], (.14, 1., 1.), 12, 8)
        flag(o, mx, mh, 0, flagc, 1.6)
    o.cyl((10, 3.6, 0), (15, 5.8, 0), .28, M['woodd'], 6); o.sph((11.4, 3.6, 0), .6, M['gold'], (1.5, 1, .8)); o.cyl((15, 5.8, 0), (7, 15, 0), .05, M['iron'], 4)
    for k in range(5):
        for sd in (-1, 1): o.box((-8 + k * 4.6, 4.2, sd * 3.05), (.14, .9, .14), M['woodd']); 
    for sd in (-1, 1): o.box((0, 4.35, sd * 3.05), (20, .12, .12), M['woodd'])
    o.sph((-1, 4.1, 2.2), .5, M['red']); barrel(o, 4.5, 3.6, -2, .5, .9); crate(o, 5.5, 3.6, 1.6, 1.1, .3); o.torus((1, 3.7, 1.5), .55, .16, M['cb'], 12)
    o.finish(); return o
ship('ship', 'red', 'gold', 'cream', 'red'); ship('ship2', 'navy', 'white', 'white', 'blue')
PR = Obj('pier')
PR.box((PX, 1., 8), (13, .5, 62), M['wood']); 
for k in range(31): PR.box((PX, 1.27, -21 + k * 2), (13.1, .04, .08), M['woodd'])
for sd in (-1, 1):
    for k in range(11): PR.cyl((PX + sd * 6, -4, -20 + k * 6), (PX + sd * 6, 2.4, -20 + k * 6), .4, M['woodd'], 8)
    PR.box((PX + sd * 6.3, 1.7, 8), (.3, .5, 62), M['woodd'])
for z in (-14, 0, 14, 28): PR.cyl((PX + 5.4, 1.2, z), (PX + 5.4, 2.1, z), .35, M['iron'], 8); lamp(PR, PX - 5.6, z + 5, 4)
for (x, z, s, r) in [(-3.5, -16, 1.4, .2), (-2.2, -15.5, 1.1, -.3), (-3, -14.5, 1.3, .1), (3, -17, 1.2, .4)]: crate(PR, PX + x, 1.25, z, s, r)
barrel(PR, PX - 4.5, 1.25, -12); barrel(PR, PX - 3.7, 1.25, -12.8); barrel(PR, PX + 4, 1.25, -12)
for k in range(4): PR.box((PX + 1.4, 1.65 + 0, -13 + k * .01), (.1, .1, .1), M['wood'])
PR.finish(origin=(PX, 0, 0))
QY = Obj('quay')                       # casitas del puerto, faro y colinas al fondo
for i in range(9):
    x = PX - 60 + i * 15; cl = ['brick2', 'mint', 'pink', 'yellow', 'brick3', 'lilac', 'orange', 'bluel', 'cream'][i]; w = rnd.uniform(7, 10); h = rnd.uniform(7, 11)
    grp(QY, lambda o, cl=cl, w=w, h=h: (fbox(o, 0, 0, w, h, cl), fp(o, [(-w / 2 - .5, h), (w / 2 + .5, h), (0, h + 3)], ['roofr', 'roofb', 'roofg'][i % 3], .2), wins(o, -w / 2 + .8, 2.5, w - 1.6, h - 4, 2, 2, 0, .9, 1.4, False, 'white'), door(o, w * .3, 1.4, 2.4, 0, 'woodd', False)), TR(x, 0, -48 + rnd.uniform(-3, 3)))
QY.cyl((PX + 66, 0, -46), (PX + 66, 14, -46), 3.2, M['white'], 12, 2.4)
for k in range(4): QY.cyl((PX + 66, 2 + k * 3.1, -46), (PX + 66, 3.1 + k * 3.1, -46), 3.1 - k * .22, M['red'], 12, 2.9 - k * .22)
QY.cyl((PX + 66, 14, -46), (PX + 66, 16.2, -46), 3.4, M['iron'], 12); QY.cyl((PX + 66, 16.2, -46), (PX + 66, 19, -46), 3.4, M['red'], 12, 0.); QY.sph((PX + 66, 15.5, -46), 1.1, M['lamp'])
for (x, z, r, hh, c) in [(-120, -150, 70, 30, 'leaf2'), (30, -170, 90, 40, 'leaf'), (140, -160, 70, 28, 'leaf3'), (-40, -190, 80, 36, 'leaf2'), (-190, -120, 60, 24, 'leaf')]:
    QY.sph((PX + x, -3, z), r, M[c], (1.3, hh / r, 1.0), 16, 9)
QY.box((PX, -.6, -50), (300, 1.2, 12), M['stone']); QY.finish(origin=(PX, 0, 0))

# ================= D · PLAYA DE LA SELVA (ox = 3000) =================
BXO = 3000.
def nzb(x, z): return math.sin(x * .09 + 1.3) * math.cos(z * .07) * .7 + math.sin(x * .21 + z * .17) * .35
def hbeach(x, z):
    x -= BXO
    if z > 22: y = .5 - (z - 22) * .16            # arena que baja al mar
    else: y = .5 + nzb(x, z) * (.4 + max(0, (22 - z)) * .02) + max(0, (-z - 10)) * .045
    d = math.hypot(x + 30, z - 4); y -= 1.6 * max(0, 1 - d / 15) ** .6      # charca del pantano
    return max(y, -6)
def cbeach(x, z, y):
    def mix(a, b, t): return [a[i] + (b[i] - a[i]) * t for i in range(3)]
    hx = lambda h: [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    sd, gr, jg, md = hx(P['sand']), hx(P['grass']), hx(P['leaf2']), hx(P['mud'])
    t = max(0, min(1, (22 - z) / 10)); c = mix(sd, gr, t); c = mix(c, jg, max(0, min(1, (-z - 6) / 30)))
    d = math.hypot(x - BXO + 30, z - 4); c = mix(c, md, max(0, min(1, 1.5 - d / 12)))
    if z > 30: c = mix(c, hx(P['sandd']), max(0, min(1, (z - 30) / 8)))
    return c
def terrain(name, x0, x1, z0, z1, n, hf, cf, ox):
    bm = bmesh.new(); lay = bm.verts.layers.float_color.new('Col'); vs = {}
    for i in range(n + 1):
        for j in range(n + 1):
            x = x0 + (x1 - x0) * i / n; z = z0 + (z1 - z0) * j / n; y = hf(x, z); v = bm.verts.new((x - ox, -z, y)); c = cf(x, z, y); v[lay] = (*[q ** 2.2 for q in c], 1.); vs[i, j] = v
    for i in range(n):
        for j in range(n): bm.faces.new((vs[i, j], vs[i + 1, j], vs[i + 1, j + 1], vs[i, j + 1]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(M['white']); me.color_attributes.active_color = me.color_attributes[0]; me.color_attributes.render_color_index = 0
    for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new(name, me); ob.location = (ox, 0, 0); bpy.context.scene.collection.objects.link(ob); return ob
terrain('beach', BXO - 170, BXO + 170, -170, 70, 100, hbeach, cbeach, BXO)
SP = Obj('signpost')      # cartel torcido que nadie ha arreglado
SP.cyl((0, 0, 0), (.5, 4.8, 0), .16, M['woodd'], 6); SP.box((.7, 4.4, .12), (4.0, 1.25, .14), M['sign_post'], .06, 0., -.12); SP.box((.5, 5.0, 0), (.35, .2, .35), M['woodd'])
for k in range(3): SP.sph((rnd.uniform(-.8, .8), .2, rnd.uniform(.3, 1.2)), .35, M['rock'], (1, .7, 1))
SP.finish()
# ================= E · PARÍS (ox = 4000) =================
PRX = 4000.
def mans(o, w, h, col, depth=9., rc='roofb', balc=True):
    o.box((0, h / 2, -depth / 2), (w, h, depth), M[col]); o.box((0, h + .1, -depth / 2), (w + .5, .5, depth + .5), M['white']); a = .95; L = (depth / 2) / math.cos(a) * 1.05
    o.box((0, h + math.sin(a) * L / 2 + .25, -depth / 4), (w + .6, .35, L), M[rc], 0., a); o.box((0, h + math.sin(a) * L / 2 + .25, -depth * .75), (w + .6, .35, L), M[rc], 0., -a)
    wins(o, -w / 2 + 1.3, 2.4, w - 2.6, h - 3.4, 3, 3, 0, .9, 1.9, True, 'white')
    for k in range(3): o.box((-w / 2 + 1.3 + (w - 2.6) * (k + .5) / 3, h + 2.1, .3 - depth * .5 * 0 + .1), (.9, 1., .2), M['white']); o.box((-w / 2 + 1.3 + (w - 2.6) * (k + .5) / 3, h + 2.1, .22), (.7, .8, .1), M['wind'])
    if balc:
        for k in range(3):
            cx = -w / 2 + 1.3 + (w - 2.6) * (k + .5) / 3; o.box((cx, 4.4 + 3.4 * 0, .55), (1.7, .12, 1.1), M['iron'])
            for q in range(5): o.cyl((cx - .75 + q * .375, 4.4, 1.05), (cx - .75 + q * .375, 5.3, 1.05), .04, M['iron'], 4)
            o.box((cx, 5.3, 1.05), (1.7, .08, .08), M['iron'])
    o.box((w * .3, h + 3.6, -depth * .6), (.9, 2.2, .9), M['brick']); o.box((-w * .3, h + 3.3, -depth * .62), (.9, 1.8, .9), M['brick'])
PA = Obj('paris')
for i in range(6):
    zc = 16 - i * 10; c1 = ['cream', 'brick3', 'pink', 'yellow', 'mint', 'cream'][i]; c2 = ['yellow', 'cream', 'brick3', 'lilac', 'cream', 'pink'][i]
    grp(PA, lambda o, c1=c1: mans(o, 8.5, 12, c1), TR(PRX - 14, 0, zc, math.pi / 2)); grp(PA, lambda o, c2=c2: mans(o, 8.5, 12.5, c2), TR(PRX + 14, 0, zc, -math.pi / 2))
def cafe(o):
    o.box((0, 6, -5), (18, 12, 10), M['cream']); o.box((0, 12.1, -5), (19, .6, 10.5), M['white']); mans_roof = 1.0
    wins(o, -8, 6.5, 16, 4.5, 4, 1, 0, 1.2, 2.3, True, 'white', 'wind'); o.box((0, 4.1, .5), (16.5, .35, 1.8), M['iron'])
    for k in range(10): o.prism([(-8 + k * 1.6, 3.6), (-8 + (k + 1) * 1.6, 3.6), (-8 + (k + 1) * 1.6, 3.6 - 0.001), (-8 + k * 1.6, 3.6)], 0, .02, M['white']) if False else None
    for k in range(10): o.box((-7.2 + k * 1.6, 3.5, 1.2), (1.6, .12, 3.2), M['red' if k % 2 == 0 else 'white'], 0., -.25)
    door(o, 0, 3., 3.2, .05, 'woodd', True, 'gold'); sign(o, 'cafe', 0, 9.2, .6, 8, 2.2)
    for sd in (-1, 1): o.box((sd * 6.4, 2, .25), (4.4, 3, .1), M['wind'])
grp(PA, cafe, TR(PRX, 0, -40))
for z in (10, -6, -22): lamp(PA, PRX - 9, z, 5); lamp(PA, PRX + 9, z, 5)
for (x, z) in [(-4.5, -26), (3.5, -27), (-5, -31), (4.5, -32)]:
    PA.cyl((PRX + x, .8, z), (PRX + x, .86, z), .85, M['woodd'], 12); PA.cyl((PRX + x, 0, z), (PRX + x, .8, z), .12, M['iron'], 6); PA.cyl((PRX + x, 0, z), (PRX + x, .06, z), .5, M['iron'], 10)
    for (cx, cz) in [(-1.1, .2), (1.1, -.3)]: PA.box((PRX + x + cx, .5, z + cz), (.6, .08, .6), M['red']); PA.box((PRX + x + cx, .95, z + cz - .3 * (1 if cz > 0 else -1)), (.6, .9, .08), M['red'])
PA.finish(origin=(PRX, 0, 0))
PG = Obj('paris_ground'); PG.box((PRX, -.2, -30), (19, .4, 200), M['cobble']); PG.box((PRX - 10.8, -.05, -30), (3, .5, 200), M['stone']); PG.box((PRX + 10.8, -.05, -30), (3, .5, 200), M['stone'])
for k in range(40): PG.box((PRX + rnd.uniform(-8.5, 8.5), .02, 30 - k * 3.0 + rnd.uniform(-1, 1)), (rnd.uniform(.8, 1.8), .04, rnd.uniform(.7, 1.4)), M['cobbled'])
PG.box((PRX, -3, -20), (400, 5, 400), M['grass']); PG.finish(origin=(PRX, 0, 0))
# plantas sueltas (se clonan en three.js)
palm('palm'); bigtree('bigtree'); fern('fern'); bush('bush')
# ================= layout para three.js =================
def scatter(n, fx, fz, test, kind_w):
    out = []
    for _ in range(n):
        x, z = rnd.uniform(*fx), rnd.uniform(*fz)
        if not test(x, z): continue
        k = rnd.choices(['palm', 'bigtree', 'fern', 'bush'], kind_w)[0]; out.append([k, round(x, 1), round(z, 1), round(rnd.uniform(0, 6.28), 2), round(rnd.uniform(.8, 1.4), 2)])
    return out
jung = scatter(1600, (BXO - 160, BXO + 160), (-165, 18), lambda x, z: not (abs(x - BXO) < 7 and z > -30) and hbeach(x, z) > -.5 and math.hypot(x - BXO + 30, z - 4) > 14, [3, 4, 5, 4])
beachp = scatter(26, (BXO - 70, BXO + 70), (14, 30), lambda x, z: True, [1, 0, 1, 1])
cityp = scatter(160, (-140, 140), (-120, 60), lambda x, z: (abs(x) > 62 or z < -16) and not (abs(x) < 60 and z > 40 and abs(x) < 10), [4, 4, 3, 3])
lay = dict(jungle=jung, beachp=beachp, cityp=cityp, sites=dict(city=[0, 0], london=[LX, 0], port=[PX, 0], beach=[BXO, 0], paris=[PRX, 0]))
json.dump(lay, open(os.path.join(OUT, 'layout.json'), 'w'))
kw = dict(filepath=os.path.join(OUT, 'poyais.glb'), export_format='GLB', export_apply=True)
try: bpy.ops.export_scene.gltf(**kw, export_vertex_color='ACTIVE', export_all_vertex_colors=False)
except TypeError: bpy.ops.export_scene.gltf(**kw)
print('EXPORT_OK', len(jung), 'plantas selva')

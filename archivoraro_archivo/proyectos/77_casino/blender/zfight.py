# detecta caras coplanarias que se solapan (z-fighting / parpadeo) en todos los objetos del decorado
import bpy, math, os, sys, collections
__file__ = os.path.abspath('casino.py'); exec(open('casino.py').read())
from mathutils import Vector
def clip(subj, a, b):  # Sutherland-Hodgman: recorta polígono subj por el borde a->b (convexo, antihorario)
    out = []
    def inside(p): return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= -1e-9
    def inter(p, q):
        x1, y1, x2, y2 = p[0], p[1], q[0], q[1]; x3, y3, x4, y4 = a[0], a[1], b[0], b[1]; d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
        if abs(d) < 1e-12: return q
        t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d; return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))
    for i in range(len(subj)):
        p, q = subj[i - 1], subj[i]
        if inside(q):
            if not inside(p): out.append(inter(p, q))
            out.append(q)
        elif inside(p): out.append(inter(p, q))
    return out
def area(P): return .5 * sum(P[i - 1][0] * P[i][1] - P[i][0] * P[i - 1][1] for i in range(len(P)))
def ccw(P): return P if area(P) > 0 else P[::-1]
G = collections.defaultdict(list)
for ob in bpy.data.objects:
    if ob.type != 'MESH': continue
    M = ob.matrix_world; me = ob.data
    for f in me.polygons:
        if f.area < 1e-4: continue
        n = (M.to_3x3() @ f.normal).normalized(); vs = [M @ me.vertices[i].co for i in f.vertices]
        if max(abs(n.x), abs(n.y), abs(n.z)) < .999: continue      # solo caras alineadas con los ejes (cajas)
        ax = max(range(3), key=lambda i: abs(n[i])); sg = 1 if n[ax] > 0 else -1; d = sum(v[ax] for v in vs) / len(vs)
        u, w = [i for i in range(3) if i != ax]
        G[(ax, sg, round(d / .0005))].append((ob.name, f.index, f.material_index, [(v[u], v[w]) for v in vs], d, me.materials[f.material_index].name if me.materials else ''))
hits = []
for key, L in G.items():
    # juntar también el cubo vecino de redondeo
    L2 = L + G.get((key[0], key[1], key[2] + 1), [])
    for i in range(len(L)):
        for j in range(i + 1, len(L2)):
            A, B = L[i], L2[j]
            if abs(A[4] - B[4]) > .0005: continue
            pa, pb = A[3], B[3]
            if max(p[0] for p in pa) <= min(p[0] for p in pb) or max(p[0] for p in pb) <= min(p[0] for p in pa) or max(p[1] for p in pa) <= min(p[1] for p in pb) or max(p[1] for p in pb) <= min(p[1] for p in pa): continue
            P = ccw(pa); Q = ccw(pb); R = P
            for k in range(len(Q)):
                R = clip(R, Q[k - 1], Q[k])
                if not R: break
            if R and abs(area(R)) > 2e-3: hits.append((round(abs(area(R)), 3), A[0], A[5], B[0], B[5], 'xyz'[key[0]], round(A[4], 3), [round(sum(c) / len(c), 2) for c in zip(*pa)]))
hits.sort(reverse=True)
print('Z-FIGHT', len(hits))
for h in hits: print(*h)

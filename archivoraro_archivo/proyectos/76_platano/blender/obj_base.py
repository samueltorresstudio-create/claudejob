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


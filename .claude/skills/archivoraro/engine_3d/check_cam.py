import json, sys, math
D = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'check.json')); W, H = 1080, 1920
tot_static = 0; tot_crop = 0
for sc, I in D.items():
    rows = [r for r in I['rows'] if 'cam' in r and r['cam']]
    errs = [r for r in I['rows'] if 'err' in r]
    # cámara quieta: ventanas de 1,5 s sin movimiento apreciable
    static = []; n = 15
    for i in range(0, max(0, len(rows) - n)):
        a, b = rows[i]['cam'], rows[i + n]['cam']
        mv = max(math.dist(a[0:3], b[0:3]), math.dist(a[3:6], b[3:6]))
        if mv < .30 and abs(a[6] - b[6]) < 2.5: static.append(rows[i]['t'])
    crop = {}
    for r in rows:
        for q in r['pj']:
            hp = q['h']; top = q['y'] - 1.12 * hp; wd = (.52 if q['pt'] else .30) * hp
            msg = []
            if top < 40: msg.append('cabeza')
            if q['y'] > H - 8: msg.append('pies')
            if q['x'] - wd < 10 or q['x'] + wd > W - 10: msg.append('lados')
            if 1275 < q['y'] - .93 * hp < 1460: msg.append('cara bajo el subtítulo')
            if msg: crop.setdefault(q['fn'], set()).update(msg); crop[q['fn']].add('t=%.1f' % r['t'])
    ns = len(static) * .1; nc = len(set(t for q in crop.values() for t in q if t.startswith('t=')))
    tot_static += ns
    print(f"{sc:8s} dur {I['dur']:.1f}s  cámara quieta ≥1,5 s: {ns:4.1f}s  recortes: {sorted(crop.items()) if crop else '—'}  {('ERR ' + errs[0]['err']) if errs else ''}")
print('total ventanas quietas', round(tot_static, 1))

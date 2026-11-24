import cv2, numpy as np, sys
path, cuts = sys.argv[1], [float(x) for x in sys.argv[2].split(',')]
cap = cv2.VideoCapture(path); fps = cap.get(cv2.CAP_PROP_FPS)
orb = cv2.ORB_create(1500); bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
prev=None; t=0; i=0; shot=0; acc=None; res=[]
def flush(s, a, n):
    if a is None or n < 3: return
    sc, tx, ty = a; res.append((s, n/fps, sc, tx, ty))
n=0
while True:
    ok, f = cap.read()
    if not ok: break
    t = i/fps; i+=1
    if i % 2: continue
    g = cv2.cvtColor(f[226:2306], cv2.COLOR_BGR2GRAY); g = cv2.resize(g, (390, 693))
    mask = np.ones_like(g)*255; mask[390:470,:]=0
    if shot < len(cuts) and t >= cuts[shot]:
        flush(shot, acc, n); shot+=1; prev=None; acc=None; n=0
    k, d = orb.detectAndCompute(g, mask)
    if prev is not None and d is not None and prev[1] is not None:
        m = bf.match(prev[1], d)
        if len(m) > 20:
            p0 = np.float32([prev[0][x.queryIdx].pt for x in m]); p1 = np.float32([k[x.trainIdx].pt for x in m])
            M, _ = cv2.estimateAffinePartial2D(p0, p1, method=cv2.RANSAC, ransacReprojThreshold=2)
            if M is not None:
                s = float(np.hypot(M[0,0], M[1,0])); tx, ty = M[0,2]*3, M[1,2]*3
                acc = [1,0,0] if acc is None else acc
                acc = [acc[0]*s, acc[1]+tx, acc[2]+ty]
    n += 2; prev=(k,d)
flush(shot, acc, n)
for s, dur, sc, tx, ty in res: print(f"plano {s+1}: {dur:4.1f}s  zoom x{sc:.3f}  despl x {tx:+6.0f}px  y {ty:+6.0f}px")

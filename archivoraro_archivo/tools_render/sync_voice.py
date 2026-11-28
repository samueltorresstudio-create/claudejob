# Fits an external narration (e.g. ElevenLabs, the whole script read in one file) to a video project.
# It finds the pauses between sentences, assigns one stretch of audio to each script line, and rewrites
# voice.js + narration.wav so the video is re-timed to that voice's own rhythm.
# usage: python3 -I sync_voice.py <project_dir> <audio_file>
import json, os, subprocess, sys
import numpy as np
import soundfile as sf

PROJ, AUDIO = sys.argv[1], sys.argv[2]
SR = 44100

import re as _re
def word_times(cap, chunks):
    """Start time of every caption word (s from the beat start): pauses in the voice are anchored to the
    punctuation they belong to, and words are spread over the voiced time between anchors."""
    ws = [w.split('|')[0] for w in cap.split(' ')]
    # numbers are read out in words (12:33 = «doce y treinta y tres»), so each digit weighs like ~4 letters
    wt = [len(_re.sub(r'[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]', '', w)) + 4 * len(_re.sub(r'[^0-9]', '', w)) + 1.5 for w in ws]
    cum = [0.0]
    for x in wt: cum.append(cum[-1] + x)
    tot = cum[-1]
    lens = [c[1] - c[0] for c in chunks]
    V = sum(lens)
    vb = [sum(lens[:j + 1]) for j in range(len(chunks) - 1)]          # voiced time at each pause
    brk = [i for i in range(1, len(ws)) if _re.search(r'[,.…:;?!»]$', ws[i - 1]) or ws[i].startswith('«')]
    # DP: each pause either takes a later punctuation break or stays unmatched
    PEN = 0.36
    best = {(-1, -1): (0.0, None)}
    for j in range(len(vb)):
        nb = {}
        for (pj, pb), (c, path) in best.items():
            # unmatched
            k = (j, pb); v = (c + PEN, (path, None))
            if k not in nb or v[0] < nb[k][0]: nb[k] = v
            for bi, b in enumerate(brk):
                if bi <= pb: continue
                d = V * cum[b] / tot - vb[j]
                k = (j, bi); v = (c + d * d, (path, (b, vb[j])))
                if k not in nb or v[0] < nb[k][0]: nb[k] = v
        best = nb
    _, path = min(best.values(), key=lambda x: x[0])
    anchors = []
    while path:
        path, a = path
        if a: anchors.append(a)
    anchors = [(0, 0.0)] + anchors[::-1] + [(len(ws), V * .985)]
    def real(v):
        for c0, c1 in chunks:
            if v < c1 - c0 - 1e-6: return c0 + v   # a pause boundary maps to the start of the next stretch
            v -= c1 - c0
        return chunks[-1][1]
    out = []
    for (i0, v0), (i1, v1) in zip(anchors, anchors[1:]):
        span = cum[i1] - cum[i0] or 1
        for i in range(i0, i1):
            out.append(round(real(v0 + (v1 - v0) * (cum[i] - cum[i0]) / span), 3))
    return out
TAIL_BLACK = 0.35
LEAD0 = 0.3

script = json.load(open(os.path.join(PROJ, 'script.json')))
n_lines = len(script)
tmp = os.path.join(PROJ, 'voice_in.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', AUDIO, '-ac', '1', '-ar', str(SR), tmp], check=True)
a, _ = sf.read(tmp)
a = a / (np.abs(a).max() + 1e-9) * 0.9

# 10 ms energy envelope -> voiced / silent frames
hop = int(.01 * SR)
fr = np.sqrt(np.convolve(a ** 2, np.ones(hop) / hop, 'same')[::hop])
thr = max(np.percentile(fr, 20) * 2.5, fr.max() * 0.02)
voiced = fr > thr
idx = np.where(voiced)[0]
v0, v1 = idx[0], idx[-1]
# silent gaps inside the speech (>=120 ms) are candidate sentence boundaries
gaps, i = [], v0
while i < v1:
    if not voiced[i]:
        j = i
        while j < v1 and not voiced[j]:
            j += 1
        if j - i >= 12:
            gaps.append((i, j))
        i = j
    else:
        i += 1
# pauses the energy threshold misses (a breathy or reverberant delivery) can be given by hand, in seconds of the source:
# EXTRA_GAPS="2.01-2.63,4.47-4.95"
for item in filter(None, os.environ.get('EXTRA_GAPS', '').split(',')):
    g0, g1 = (int(round(float(x) * SR / hop)) for x in item.split('-'))
    gaps.append((g0, g1))
gaps.sort()
if len(gaps) < n_lines - 1:
    sys.exit(f'found only {len(gaps)} pauses for {n_lines} lines: leave a short pause between sentences')

# expected relative length of each line (characters), used to choose which pauses are sentence breaks
w = np.array([len(l['say']) + 6 for l in script], float)
exp_frac = w / w.sum()
total = v1 - v0
G = len(gaps)
INF = 1e18
# dp[k][g]: best cost when line k ends at gap g
cost = np.full((n_lines, G), INF)
back = np.zeros((n_lines, G), int)
def seg_cost(start, end, k, gap_len):
    d = (end - start) / total
    return np.log(max(d, 1e-4) / exp_frac[k]) ** 2 - 0.15 * min(gap_len / 40, 1.0)
for g in range(G):
    cost[0][g] = seg_cost(v0, gaps[g][0], 0, gaps[g][1] - gaps[g][0])
for k in range(1, n_lines - 1):
    for g in range(k, G):
        best, arg = INF, -1
        for p in range(k - 1, g):
            if cost[k - 1][p] >= INF:
                continue
            c = cost[k - 1][p] + seg_cost(gaps[p][1], gaps[g][0], k, gaps[g][1] - gaps[g][0])
            if c < best:
                best, arg = c, p
        cost[k][g], back[k][g] = best, arg
best, arg = INF, -1
for g in range(n_lines - 2, G):
    c = cost[n_lines - 2][g] + seg_cost(gaps[g][1], v1, n_lines - 1, 40)
    if c < best:
        best, arg = c, g
ends = [arg]
for k in range(n_lines - 2, 0, -1):
    ends.append(back[k][ends[-1]])
ends = ends[::-1]
# the pause search can slip by one stretch when a line has many internal pauses: line starts can be fixed by hand,
# in seconds of the source, for lines 2..N (LINE_STARTS="7.81,15.74,...")
if os.environ.get('LINE_STARTS'):
    ts = [float(x) for x in os.environ['LINE_STARTS'].split(',')]
    if len(ts) != n_lines - 1:
        sys.exit(f'LINE_STARTS needs {n_lines - 1} times, got {len(ts)}')
    ends = [min(range(G), key=lambda g: abs(gaps[g][1] * hop / SR - x)) for x in ts]
starts = [v0] + [gaps[g][1] for g in ends]
stops = [gaps[g][0] for g in ends] + [v1]

# timeline: keep the voice's own rhythm; each beat starts a little before its sentence
beats, segs = [], []
offset = LEAD0 - starts[0] * hop / SR
for k in range(n_lines):
    s, e = starts[k] * hop / SR + offset, (stops[k] + 5) * hop / SR + offset
    lead = LEAD0 if k == 0 else 0.08
    st = s - lead
    nxt = starts[k + 1] * hop / SR + offset - 0.08 if k < n_lines - 1 else e + script[-1].get('pause', 0.7)
    # voiced stretches inside the line (seconds from the beat start), so word timing can skip the pauses
    inner = [gp for gp in gaps if starts[k] < gp[0] and gp[1] < stops[k]]
    pts = [starts[k]] + [x for gp in inner for x in gp] + [stops[k] + 5]
    ch = [[round(pts[i] * hop / SR + offset - max(0, st), 3), round(pts[i + 1] * hop / SR + offset - max(0, st), 3)] for i in range(0, len(pts), 2)]
    beats.append({'start': round(max(0, st), 4), 'd': round(nxt - max(0, st), 4), 'lead': lead, 'vdur': round(e - s, 4), 'chunks': ch, 'words': word_times(script[k]['cap'], ch)})
total_t = beats[-1]['start'] + beats[-1]['d'] + TAIL_BLACK

nar = np.zeros(int(total_t * SR) + SR)
src0 = int(starts[0] * hop)
piece = a[max(0, src0 - int(LEAD0 * SR)):]
dst0 = 0
nar[dst0:dst0 + len(piece)] = piece[: len(nar) - dst0]
# lines marked "voice": "tv" (screens, loudspeakers, phones...) get a small-speaker sound
def tv_fx(x):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < 320) | (f > 3400)] = 0
    y = np.fft.irfft(X, len(x))
    y = np.tanh(y / (np.abs(y).max() + 1e-9) * 2.5) / np.tanh(2.5)
    for dly, g in ((.017, .35), (.043, .18)):
        k = int(dly * SR)
        y[k:] += y[:-k] * g
    return y * (np.sqrt(np.mean(x ** 2)) / (np.sqrt(np.mean(y ** 2)) + 1e-9))
shift = src0 - int(LEAD0 * SR)
for k, l in enumerate(script):
    if l.get('voice') != 'tv':
        continue
    a0, a1 = max(0, starts[k] * hop - shift - int(.03 * SR)), min(len(nar), (stops[k] + 5) * hop - shift + int(.08 * SR))
    seg = nar[a0:a1].copy()
    fx = tv_fx(seg)
    fade = np.ones(len(seg))
    nf = int(.02 * SR)
    fade[:nf] = np.linspace(0, 1, nf)
    fade[-nf:] = np.linspace(1, 0, nf)
    nar[a0:a1] = seg * (1 - fade) + fx * fade
cut = int((total_t - TAIL_BLACK) * SR)
nar[cut:] = 0
nar = nar[: int(total_t * SR)]
raw = os.path.join(PROJ, 'narration_raw.wav')
sf.write(raw, nar, SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'highpass=f=60,aresample=44100', '-ac', '1',
                os.path.join(PROJ, 'narration.wav')], check=True)
with open(os.path.join(PROJ, 'voice.js'), 'w') as f:
    f.write('window.SCRIPT=' + json.dumps(script, ensure_ascii=False) + ';\n')
    f.write('window.VOICE=' + json.dumps({'beats': beats, 'total': round(total_t, 4), 'tail': TAIL_BLACK}) + ';\n')
print(f'{n_lines} lines matched from {G} pauses, total {total_t:.2f}s')
for b, l in zip(beats, script):
    print(f"{b['start']:6.2f} {b['d']:5.2f}  {l['say']}")

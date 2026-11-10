# Music + SFX for the time-freeze video. With --voice it also lays narration.wav on top and ducks the bed under it.
import json, wave, os, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
WITH_VOICE = '--voice' in sys.argv
ev = json.load(open(os.path.join(HERE, 'events.json')))
SR = 44100
T, CUT, E = ev['total'], ev['cut'], ev['ev']
N = int(T * SR) + SR
t = np.arange(N) / SR
rnd = np.random.default_rng(5)
bed = np.zeros((N, 2))
fx = np.zeros((N, 2))


def band(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def env(n, a, d):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    e[na:] = np.exp(-np.arange(n - na) / (d * SR))
    return e


def norm(x):
    m = np.abs(x).max()
    return x / m if m > 0 else x


def add(sig, when, gain=1.0, pan=0.0, to=None):
    to = fx if to is None else to
    i = int(when * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    to[i:i + len(sig), 0] += sig * gain * np.sqrt((1 - pan) / 2) * 1.414
    to[i:i + len(sig), 1] += sig * gain * np.sqrt((1 + pan) / 2) * 1.414


def tone(f, dur, a=.005, d=.2, harm=(1,)):
    n = int(dur * SR)
    x = np.arange(n) / SR
    return sum(h ** -1.2 * np.sin(2 * np.pi * f * h * x) for h in harm) * env(n, a, d)


def sweep(f0, f1, dur, d=.1):
    n = int(dur * SR)
    return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, n)) / SR) * env(n, .002, d)


def noise(dur, lo, hi, a=.005, d=.1):
    n = int(dur * SR)
    return norm(band(rnd.standard_normal(n), lo, hi)) * env(n, a, d)


def pluck(f, dur=.5):
    n = int(dur * SR)
    p = int(SR / f)
    buf = rnd.uniform(-1, 1, p)
    y = np.zeros(n)
    for i in range(n):
        y[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.995
    return y * env(n, .001, dur / 2.5)


beats = ev['beats']
sc0 = {}
for b in beats:
    sc0.setdefault(b['sc'], b['start'])
cuts = [b['start'] for b in beats if b['cut'] and b['start'] > 0]
FR = E['plaza.freeze']
TURN = E['man.turn']

# ---------- the living plaza (everything stops at the freeze) ----------
live = np.zeros(N)
murmur = band(rnd.standard_normal(N), 250, 1800) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t) * np.sin(2 * np.pi * 1.9 * t))
water = band(rnd.standard_normal(N), 1500, 7000) * 0.5
live = norm(murmur) * 0.05 + norm(water) * 0.025
cutmask = t < FR
live[~cutmask] = 0
bed[:, 0] += live
bed[:, 1] += live
for i in range(8):
    ch = np.concatenate([sweep(rnd.uniform(2800, 3600), rnd.uniform(4000, 5200), .07, .03) for _ in range(3)])
    tt = rnd.uniform(.1, FR - .3)
    add(ch[: max(0, int((FR - tt) * SR))], tt, 0.05, rnd.uniform(-.8, .8), to=bed)
C = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63]
k = 0
for tt in np.arange(0.1, FR - .05, 0.22):
    p = pluck(C[k % 6] * (1 if (k // 6) % 2 == 0 else 1.122))
    add(p[: int((FR - tt) * SR)], tt, 0.22, -.2 + .4 * (k % 2), to=bed)
    k += 1
for tt in np.arange(0.5, FR, 1.0):
    add(tone(1800, .03, .001, .006), tt, 0.05, to=bed)  # tower clock seconds

# ---------- the freeze ----------
rn = int(.7 * SR)
add(norm(band(rnd.standard_normal(rn), 300, 9000)) * np.linspace(0, 1, rn) ** 3, FR - .7, 0.22)
add(sweep(140, 30, 2.4, .8), FR, 1.0)
add(noise(1.2, 3000, 12000, .002, .25), FR, 0.15)
tn = int(6 * SR)
add(np.sin(2 * np.pi * 6200 * np.arange(tn) / SR) * env(tn, .01, 2.0), FR, 0.012)  # ears ringing

# ---------- after the freeze: drone, slow pulse, and Hugo's watch ----------
pad = np.zeros(N)
for f, g in [(55, .5), (58.27, .2), (82.41, .26), (110, .14), (164.81, .06)]:
    pad += g * np.sin(2 * np.pi * f * t + rnd.random() * 6) * (0.8 + 0.2 * np.sin(2 * np.pi * .17 * t + f))
lvl = np.clip((t - FR) / 1.5, 0, 1) * (0.6 + 0.5 * np.clip((t - sc0['avenue']) / 8, 0, 1))
lvl[t > TURN] *= 0.25
bed[:, 0] += pad * lvl * 0.2
bed[:, 1] += pad * lvl * 0.2
tick = tone(2600, .025, .0005, .005, (1, 2.3)) + noise(.025, 3000, 9000, .0005, .004) * .5
tock = tone(2000, .025, .0005, .005, (1, 2.3)) + noise(.025, 2500, 8000, .0005, .004) * .5
w0, w1 = sc0['watch'], sc0['watch'] + [b['d'] for b in beats if b['sc'] == 'watch'][0]
tt, n = FR + 1.0, 0
while tt < TURN:
    g = 0.22 if w0 <= tt < w1 else 0.09
    add(tick if n % 2 == 0 else tock, tt, g, .25 if n % 2 == 0 else -.25)
    tt += 0.5
    n += 1
kick = sweep(120, 42, .35, .09)
tt = sc0['id']
while tt < TURN:
    add(kick, tt, 0.26, to=bed)
    tt += 1.0

# ---------- scene sounds ----------
for b in E['id.beeps']:
    add(tone(1568, .08, .002, .03), b, 0.1)
add(noise(.04, 2000, 9000, .0005, .01), E['fun.snap'], 0.4)
add(noise(.06, 1000, 6000, .0005, .02), E['fun.snap'] + .07, 0.3)
add(noise(.35, 1200, 7000, .02, .12), E['note.pull'], 0.14)
add(noise(.45, 900, 6000, .03, .15), E['note.open'], 0.16)
sc = int(2.2 * SR)
scr = norm(band(rnd.standard_normal(sc), 3000, 9000)) * (np.sin(2 * np.pi * 7 * np.arange(sc) / SR) > .2) * np.linspace(1, .6, sc)
add(scr, E['note.read'], 0.03)
add(sweep(170, 55, .6, .2), E['note.mine'], 0.35)
add(sweep(180, 50, .6, .18), E['touch.no'], 0.5)
add(tone(880, .15, .002, .05, (1, 1.5)), E['touch.no'], 0.08)
st = np.arange(int(1.6 * SR)) / SR
add(norm(sum(np.sin(2 * np.pi * f * st) for f in (233.08, 246.94, 349.23))) * env(len(st), .01, .5), E['glass.show'], 0.14)
add(sweep(110, 35, 1.5, .5), E['glass.show'], 0.6)
add(noise(1.2, 150, 900, .3, .5), E['glass.move'], 0.12)
hb = sweep(70, 40, .16, .05)
r0 = sc0['run']
tt = r0 + .1
while tt < E['run.corre']:
    add(hb, tt, 0.6)
    add(hb, tt + .18, 0.42)
    tt += 0.42
add(sweep(130, 35, 1.4, .45), E['run.corre'], 0.85)
add(noise(.3, 500, 6000, .002, .1), E['run.corre'], 0.2)
step = noise(.09, 120, 900, .002, .025)
tt = sc0['avenue'] + .1
while tt < sc0['faces'] - .1:
    add(step, tt, 0.2, -.15 if int(tt * 10) % 2 else .15)
    tt += 0.36
a2 = sc0['avenue2']
rs = int((TURN - a2) * SR)
add(norm(band(rnd.standard_normal(rs), 300, 8000)) * np.linspace(0, 1, rs) ** 2.5, a2, 0.18)
# the man: the ticking stops, a boom, then his footsteps coming closer
add(sweep(110, 28, 2.6, .9), TURN, 1.0)
add(tone(70, 1.2, .002, .5, (1, 2)), TURN, 0.25)
add(sweep(150, 45, .6, .2), E['man.him'], 0.6)
heavy = norm(sweep(110, 50, .25, .06) + noise(.25, 100, 700, .002, .05) * .7)
tt, n = E['man.walk'] + .1, 0
while tt < CUT - .05:
    add(heavy, tt, 0.5 + n * .12, -.1 if n % 2 else .1)
    tt += 0.48
    n += 1

# ---------- cuts + word pops ----------
for c in cuts:
    wn = int(.34 * SR)
    w = band(rnd.standard_normal(wn), 300, 3500) * np.sin(np.linspace(0, np.pi, wn)) ** 2
    add(norm(w), c - .15, 0.1, to=bed)
blip = tone(1250, .05, .002, .012)
for b in beats:
    for w in b['words']:
        add(blip, w, 0.02, to=bed)

if WITH_VOICE:
    import soundfile as sf
    nar, nsr = sf.read(os.path.join(HERE, 'narration.wav'))
    assert nsr == SR
    nar = nar[:N] if len(nar) >= N else np.pad(nar, (0, N - len(nar)))
    e = np.convolve(np.abs(nar), np.ones(int(.15 * SR)) / int(.15 * SR), 'same')
    e = np.clip(e / (np.percentile(e[e > 1e-4], 90) + 1e-9), 0, 1)
    mix = bed * (1 - 0.55 * e)[:, None] + fx * (1 - 0.25 * e)[:, None]
    mix = mix / np.abs(mix).max() * 0.33
    mix[:, 0] += nar * 0.95
    mix[:, 1] += nar * 0.95
else:
    mix = bed + fx
mix[int(CUT * SR):] = 0  # hard cut
mix = mix[: int(T * SR)]
mix /= np.abs(mix).max() / 0.92
with wave.open(os.path.join(HERE, 'audio.wav'), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('audio', round(T, 2), 's, voice' if WITH_VOICE else 's, no voice', '| cut at', round(CUT, 2))

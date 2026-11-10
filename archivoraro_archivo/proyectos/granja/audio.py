# Soundtrack for the farm video: music bed + SFX synced to events.json
import json, wave, os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
SR = 44100
T = ev['total']
N = int(T * SR) + SR
out = np.zeros((N, 2))
t = np.arange(N) / SR
rnd = np.random.default_rng(7)
S0, LO = ev['sc0'], ev['local']


def at(sc, key, i=None):
    v = LO[sc][key]
    return S0[sc] + (v[i] if i is not None else v)


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


def add(sig, when, gain=1.0, pan=0.0):
    i = int(when * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    out[i:i + len(sig), 0] += sig * gain * np.sqrt((1 - pan) / 2) * 1.414
    out[i:i + len(sig), 1] += sig * gain * np.sqrt((1 + pan) / 2) * 1.414


def tone(f, dur, a=.005, d=.2, harm=(1,)):
    n = int(dur * SR)
    x = np.arange(n) / SR
    return sum(h ** -1.2 * np.sin(2 * np.pi * f * h * x) for h in harm) * env(n, a, d)


def pluck(f, dur=.6):
    n = int(dur * SR)
    p = int(SR / f)
    buf = rnd.uniform(-1, 1, p)
    y = np.zeros(n)
    for i in range(n):
        y[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return y * env(n, .001, dur / 2.5)


def sweep(f0, f1, dur, d=.1):
    n = int(dur * SR)
    return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, n)) / SR) * env(n, .002, d)


def noise(dur, lo, hi, a=.005, d=.1):
    n = int(dur * SR)
    return norm(band(rnd.standard_normal(n), lo, hi)) * env(n, a, d)


alert = at('farm', 'alert')
cuts = [b['start'] for b in ev['beats'] if b['cut'] and b['start'] > 0]
steps = [b['start'] for b in ev['beats'] if b['step'] is not None]
night0 = S0['loft']

# ---------- happy farm intro (until the radio alert) ----------
G = [196.0, 246.94, 293.66, 392.0, 293.66, 246.94]
k = 0
for tt in np.arange(0.0, alert - .05, 0.25):
    add(pluck(G[k % 6] * (1 if k < 6 else 1.122 if (k // 6) % 2 else 1)), tt, 0.32, -.2 + .4 * (k % 2))
    k += 1
for f in (98, 146.83, 196):
    add(tone(f, alert + .3, .3, 9, (1, 2, 3)) * np.linspace(1, 1, int((alert + .3) * SR)), 0, 0.05)
for i in range(7):  # birds
    ch = np.concatenate([sweep(rnd.uniform(2800, 3600), rnd.uniform(4000, 5200), .07, .03) for _ in range(3)])
    add(ch, rnd.uniform(.1, alert - .3), 0.05, rnd.uniform(-.8, .8))

# ---------- radio alert ----------
add(noise(.5, 800, 6000, .002, .25), alert, 0.35)
for i in range(3):
    add(tone(1046, .14, .003, .06, (1, 3)), alert + .08 + i * .18, 0.22)
add(sweep(400, 60, .6, .25), alert, 0.4)  # record-stop feel

# ---------- tension bed ----------
pad = np.zeros(N)
for f, g in [(55, .5), (65.41, .3), (82.41, .28), (110, .18), (116.54, .06)]:
    pad += g * np.sin(2 * np.pi * f * t + rnd.random() * 6) * (0.8 + 0.2 * np.sin(2 * np.pi * .17 * t + f))
lvl = np.clip((t - alert) / .6, 0, 1) * 0.9
lvl *= np.where(t > night0, 1.25, 1.0)
lvl *= np.clip((T - t) / 1.5, 0, 1)
out[:, 0] += pad * lvl * 0.16
out[:, 1] += pad * lvl * 0.16
# pulse every beat after the alert (heavier at night)
kick = sweep(120, 42, .35, .09)
tt = alert + .7
while tt < T - .5:
    add(kick, tt, 0.28 if tt < night0 else 0.38)
    tt += 0.75

# ---------- map ----------
dig = np.sign(np.sin(2 * np.pi * 3000 * np.arange(int(.012 * SR)) / SR)) * env(int(.012 * SR), .0005, .003)
for tt in np.arange(S0['map'] + 2.45, S0['water'] - .1, 0.14):
    add(dig, tt, 0.06, rnd.uniform(-.3, .3))
add(tone(880, 1.0, .002, .3, (1, 1.5)), S0['map'] + .15, 0.08)

# ---------- step stingers ----------
for s in steps:
    add(noise(.35, 1500, 8000, .3, .02)[::-1] * .6, s - .35, 0.12)
    add(sweep(160, 45, .5, .12), s, 0.55)
    add(tone(1568, .25, .001, .06, (1, 2.7)), s, 0.10)

# ---------- water ----------
w0 = at('water', 'pump0')
fill = LO['water']['fill']
w_end = w0 + 3 * fill
pour = band(rnd.standard_normal(int((w_end - w0) * SR)), 250, 2200)
pour = norm(pour) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 1.43 * np.arange(len(pour)) / SR)))
pour[: int(.1 * SR)] *= np.linspace(0, 1, int(.1 * SR))
pour[-int(.2 * SR):] *= np.linspace(1, 0, int(.2 * SR))
add(pour, S0['water'] + w0, 0.12)
for tt in np.arange(S0['water'] + w0, S0['water'] + w_end, np.pi / 9):
    add(sweep(700, 1150, .12, .05), tt, 0.05)
for j in range(3):
    add(tone(1318.5, .8, .002, .25, (1, 2)), S0['water'] + w0 + fill * (j + 1), 0.09)

# ---------- gate ----------
add(noise(.6, 300, 1200, .05, .2) * np.sin(2 * np.pi * 9 * np.arange(int(.6 * SR)) / SR), at('gate', 'close'), 0.2)
add(noise(.05, 2000, 9000, .001, .01), at('gate', 'lock'), 0.35)
add(tone(1760, .12, .001, .03), at('gate', 'lock') + .02, 0.12)
buzz = np.sign(np.sin(2 * np.pi * 110 * np.arange(int(.35 * SR)) / SR)) * env(int(.35 * SR), .005, .2)
add(band(buzz, 80, 2000), at('gate', 'cross'), 0.12)
tin, tst = at('gate', 'tIn'), at('gate', 'tStop')
dur = S0['lights'] - tin
n = int(dur * SR)
x = np.arange(n) / SR
rpm = np.interp(x, [0, tst - tin, dur], [34, 30, 26])
ph = 2 * np.cumsum(rpm) * np.pi / SR
eng = sum(np.sin(h * ph) / h for h in range(1, 9)) * (0.6 + 0.4 * np.sign(np.sin(ph / 2)))
eng = band(eng, 25, 1200) + band(rnd.standard_normal(n), 60, 400) * .3
eng = norm(eng) * np.clip(x / .5, 0, 1) * np.interp(x, [0, tst - tin, dur], [1, 1, .4])
add(eng, tin, 0.35)
add(noise(.5, 3000, 9000, .01, .15), tst, 0.12)

# ---------- lights ----------
def groan(dur=.9, f=90):
    n = int(dur * SR)
    x = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f * (1 + .06 * np.sin(2 * np.pi * 5 * x)) * np.linspace(1.1, .8, n)) / SR
    saw = sum(np.sin(h * ph) / h for h in range(1, 14))
    return norm(band(saw, 180, 1100)) * env(n, .15, dur / 2)

add(groan(), at('lights', 'seen'), 0.22, .4)
add(groan(1.1, 80), at('lights', 'seen') + .3, 0.16, .7)
for i in range(4):
    add(noise(.03, 1500, 7000, .0005, .006), at('lights', 'off', i), 0.5, -.2)
    add(tone(320, .05, .001, .015), at('lights', 'off', i), 0.2)

# ---------- animals ----------
def bark():
    n = int(.2 * SR)
    x = np.arange(n) / SR
    f = np.linspace(620, 380, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    v = sum(np.sin(h * ph) / h for h in range(1, 8)) + band(rnd.standard_normal(n), 400, 3000) * .5
    return norm(band(v, 250, 4000)) * env(n, .004, .05)


def honk():
    n = int(.24 * SR)
    x = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(np.linspace(460, 400, n) * (1 + .03 * np.sin(2 * np.pi * 30 * x))) / SR
    v = sum(np.sin(h * ph) / h ** .7 for h in range(1, 12))
    return norm(band(v, 500, 3500)) * env(n, .01, .09)

add(norm(band(rnd.standard_normal(int(1.5 * SR)), 40, 300)) * np.linspace(0, 1, int(1.5 * SR)) ** 2, at('animals', 'wave'), 0.18, -.7)
for i in range(2):
    add(bark(), at('animals', 'barks', i), 0.5, -.3)
    add(bark(), at('animals', 'barks', i) + .17, 0.35, -.3)
    add(honk(), at('animals', 'honks', i), 0.35, .4)
    add(honk(), at('animals', 'honks', i) + .14, 0.25, .5)

# ---------- night: crickets ----------
cr = np.zeros(N)
mask = (t > night0) & (t < S0['end'] + 2.9)
chirp = (np.sin(2 * np.pi * 4600 * t) * (np.sin(2 * np.pi * 30 * t) > 0) * (np.sin(2 * np.pi * 1.6 * t) > .3))
cr[mask] = chirp[mask]
out[:, 0] += cr * 0.018
out[:, 1] += np.roll(cr, 900) * 0.018

# ---------- loft ----------
for tt in np.arange(at('loft', 'climb', 0), at('loft', 'climb', 1), 0.33):
    add(noise(.12, 200, 900, .005, .04), tt, 0.25, .2)
add(noise(1.1, 300, 2500, .1, .5), at('loft', 'pull', 0), 0.18)
add(groan(1.2, 75), at('loft', 'zomb') + .3, 0.2, -.6)

# ---------- night gate ----------
for b in LO['night']['barks']:
    add(bark(), S0['night'] + b, 0.55, -.4)
fl, rv = at('night', 'flash'), at('night', 'reveal')
add(noise(.04, 1500, 6000, .0005, .01), fl, 0.5, .4)
tt = fl + .1
while tt < rv:
    add(bark(), tt, 0.4, -.4)
    tt += 1 / 3 * 2
hb = sweep(70, 40, .18, .05)
tt = fl + .2
while tt < rv - .1:
    add(hb, tt, 0.6)
    add(hb, tt + .22, 0.4)
    tt += 0.6
add(norm(band(rnd.standard_normal(int(.8 * SR)), 300, 7000)) * np.linspace(0, 1, int(.8 * SR)) ** 3, rv - .8, 0.25)
add(sweep(110, 32, 1.8, .55), rv, 0.9)
st = np.arange(int(1.4 * SR)) / SR
add(norm(sum(np.sin(2 * np.pi * f * st) for f in (233.08, 246.94, 349.23))) * env(len(st), .003, .45), at('night', 'bitten'), 0.18)

# ---------- end ----------
add(sweep(100, 30, 2.2, .7), S0['end'], 0.8)
add(norm(sum(np.sin(2 * np.pi * f * st) for f in (220, 261.63, 329.63))) * env(len(st), .01, .6), S0['end'] + .45, 0.14)

# ---------- cuts + word pops ----------
for c in cuts:
    wn = int(.36 * SR)
    w = band(rnd.standard_normal(wn), 300, 3500) * np.sin(np.linspace(0, np.pi, wn)) ** 2
    add(norm(w), c - .16, 0.14)
blip = tone(1250, .05, .002, .012)
for b in ev['beats']:
    n = b['words']
    stp = min(.24, .62 * b['d'] / n)
    for i in range(n):
        add(blip, b['start'] + .06 + i * stp, 0.03)

out = out[: int(T * SR)]
out /= np.abs(out).max() / 0.89
with wave.open(os.path.join(HERE, 'audio.wav'), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
print('audio', round(T, 2), 's')

# Music + SFX for the metro video. With --voice it lays narration.wav on top and ducks the bed under it.
import json, wave, os, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
WITH_VOICE = '--voice' in sys.argv
ev = json.load(open(os.path.join(HERE, 'events.json')))
SR = 44100
T, CUT, E = ev['total'], ev['cut'], ev['ev']
N = int(T * SR) + SR
t = np.arange(N) / SR
rnd = np.random.default_rng(17)
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


def span(a, b):
    return (t >= a) & (t < b)


beats = ev['beats']
sc0, scEnd = {}, {}
for b in beats:
    sc0.setdefault(b['sc'], b['start'])
    scEnd[b['sc']] = b['start'] + b['d']
cuts = [b['start'] for b in beats if b['cut'] and b['start'] > 0]


def span(a, b):
    return (t >= a) & (t < b)


# ---------- the train: rumble + rail joints whenever we ride ----------
ride0, ride1 = sc0['empty'], E['brake.slow'] + 2.2
rum = norm(band(rnd.standard_normal(N), 30, 220)) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.9 * t))
lvl = np.zeros(N)
lvl[span(ride0, ride1)] = 1
lvl[span(E['brake.slow'], ride1)] = np.linspace(1, 0.1, span(E['brake.slow'], ride1).sum())
lvl[span(sc0['id'], scEnd['id'])] *= 0.3
lvl[span(E['dark.close'], scEnd['dark'])] *= 0.45
bed[:, 0] += rum * lvl * 0.16
bed[:, 1] += rum * lvl * 0.16
clack = norm(band(rnd.standard_normal(int(.06 * SR)), 200, 2500)) * env(int(.06 * SR), .001, .015)
tt = ride0
while tt < E['brake.slow']:
    if not (sc0['id'] <= tt < scEnd['id']):
        add(clack, tt, 0.11, to=bed)
        add(clack, tt + .14, 0.08, to=bed)
    tt += 0.62

# ---------- platform: train arriving, door chime ----------
p0 = sc0['platform']
an = int(1.5 * SR)
ax = np.arange(an) / SR
arrive = norm(band(rnd.standard_normal(an), 40, 400)) * np.linspace(0, 1, an) ** 1.5 * np.linspace(1, .3, an)
add(arrive, p0, 0.35)
add(np.sin(2 * np.pi * np.cumsum(np.linspace(2600, 1900, int(.8 * SR))) / SR) * env(int(.8 * SR), .05, .4), p0 + .9, 0.04)
for k, f in enumerate((783.99, 659.25, 523.25)):
    add(tone(f, .5, .005, .25, (1, 2)), E['platform.board'] + k * .22, 0.08)

# ---------- tension bed ----------
pad = np.zeros(N)
for f, g in [(46.25, .5), (55, .3), (69.3, .24), (92.5, .12), (98, .06)]:
    pad += g * np.sin(2 * np.pi * f * t + rnd.random() * 6) * (0.8 + 0.2 * np.sin(2 * np.pi * .11 * t + f))
pl = np.clip((t - sc0['empty']) / 2, 0, 1) * (0.5 + 0.6 * np.clip((t - sc0['old']) / 20, 0, 1))
bed[:, 0] += pad * pl * 0.2
bed[:, 1] += pad * pl * 0.2
kick = sweep(110, 40, .35, .09)
tt = sc0['door']
while tt < CUT - .3:
    add(kick, tt, 0.25 if tt < sc0['brake'] else 0.36, to=bed)
    tt += 1.0 if tt < sc0['brake'] else 0.7

# ---------- passing stations ----------
def whoosh(dur=.9, g=.25):
    n = int(dur * SR)
    return norm(band(rnd.standard_normal(n), 300, 5000)) * np.sin(np.linspace(0, np.pi, n)) ** 2 * g
add(whoosh(), E['empty.flash'], 1.0)
w0 = sc0['window']
for k in range(int((scEnd['window'] - w0) / 1.6) + 1):
    add(whoosh(.95, .18), w0 + k * 1.6)

for b in E['id.beeps']:
    add(tone(1568, .08, .002, .03), b, 0.1)
add(noise(.25, 1000, 8000, .002, .08), E['sleep.gone'], 0.25)
add(sweep(150, 45, .7, .25), E['sleep.open'], 0.55)
add(tone(1760, .12, .002, .04), E['screen.none'] - .5, 0.08)
add(tone(1760, .12, .002, .04), E['screen.none'] - .3, 0.08)
add(sweep(160, 45, .8, .3), E['screen.none'], 0.55)
add(sweep(130, 30, 1.6, .6), E['door.up'], 0.95)
add(noise(.4, 300, 5000, .002, .12), E['door.up'], 0.25)

# ---------- the blackout ----------
fl0, off = E['dark.flick'], E['dark.off']
tt = fl0
while tt < off:
    add(noise(.05, 2000, 8000, .001, .015), tt, 0.12)
    tt += 0.12 + 0.1 * rnd.random()
add(sweep(300, 40, .8, .3), off, 0.5)
def squelch():
    n = int(.22 * SR)
    return norm(band(rnd.standard_normal(n), 120, 1400)) * env(n, .01, .06) + sweep(220, 90, .22, .05) * .4
st0, stop = E['dark.steps'], E['dark.stop']
for i in range(9):
    tt = st0 + i * .42
    if tt > stop + .3:
        break
    add(squelch(), tt, 0.35 + i * .05, -.3 if i % 2 else .3)
add(norm(band(rnd.standard_normal(int(1.4 * SR)), 150, 1200)) * np.sin(np.linspace(0, np.pi, int(1.4 * SR))) ** 2, stop + .2, 0.12)
add(sweep(90, 40, .3, .08) + noise(.3, 100, 2000, .001, .04), sc0['prints'], 0.4)
add(sweep(150, 45, .6, .2), sc0['prints'] + 1.6, 0.4)

# ---------- the old woman ----------
add(tone(880, 1.4, .1, .6, (1, 2.01)) * .5 + tone(932.33, 1.4, .1, .6), E['old.appear'], 0.04)
for k, f in enumerate((1318.5, 1174.7, 1046.5, 987.8)):
    add(tone(f, .5, .002, .3), E['old.ask'] + .1 + k * .3, 0.05)
add(sweep(150, 45, .6, .2), E['old.away'], 0.4)

# ---------- braking, doors ----------
sl = E['brake.slow']
sq = int(2.4 * SR)
sx = np.arange(sq) / SR
squeal = np.sin(2 * np.pi * np.cumsum(3100 + 300 * np.sin(2 * np.pi * 7 * sx) - 600 * sx / sx[-1]) / SR) * np.sin(np.linspace(0, np.pi, sq)) ** .5
add(squeal, sl + .2, 0.03)
add(norm(band(rnd.standard_normal(sq), 80, 900)) * np.linspace(1, 0, sq), sl, 0.2)
add(sweep(80, 40, .4, .1), sl + 2.2, 0.5)
for k, f in enumerate((659.25, 523.25)):
    add(tone(f, .6, .005, .3, (1, 2, 3)), E['brake.sign'] + k * .3, 0.08)
add(noise(1.0, 1500, 9000, .02, .35), E['doors.open'], 0.2)
for k, f in enumerate((783.99, 659.25, 523.25)):
    add(tone(f, .5, .005, .25, (1, 2)), E['doors.open'] - .7 + k * .2, 0.07)
add(sweep(110, 35, 1.8, .6), E['doors.fig'], 0.7)
add(sweep(140, 30, 1.6, .5), E['twin.face'], 0.8)
hs = int((CUT - E['twin.step']) * SR)
hx = np.arange(max(hs, 1)) / SR
if hs > SR // 10:
    riser = norm(band(rnd.standard_normal(hs), 300, 9000)) * (hx / hx[-1]) ** 2.5
    add(riser, E['twin.step'], 0.25)
    step = norm(sweep(110, 50, .25, .06) + noise(.25, 100, 700, .002, .05) * .7)
    add(step, E['twin.step'] + .1, 0.6)

# ---------- cuts + word pops ----------
for c in cuts:
    wn = int(.34 * SR)
    w = band(rnd.standard_normal(wn), 300, 3500) * np.sin(np.linspace(0, np.pi, wn)) ** 2
    add(norm(w), c - .15, 0.1, to=bed)
blip = tone(1250, .05, .002, .012)
for b in beats:
    for w in b['words']:
        add(blip, w, 0.018, to=bed)

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

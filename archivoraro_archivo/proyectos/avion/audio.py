# Music + SFX for the plane video. With --voice it lays narration.wav on top and ducks the bed under it.
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


# ---------- the cabin: constant engine hum (louder outside, dips in the dark parts) ----------
hum = norm(band(rnd.standard_normal(N), 40, 420)) * 0.8 + 0.2 * np.sin(2 * np.pi * 118 * t)
lv = np.full(N, 0.55)
lv[span(0, scEnd['sky'])] = 1.0
lv[span(sc0['knock'], T)] = 0.35
bed[:, 0] += hum * lv * 0.12
bed[:, 1] += hum * lv * 0.12
wind = norm(band(rnd.standard_normal(N), 300, 2500)) * (0.6 + 0.4 * np.sin(2 * np.pi * .3 * t))
m = span(0, scEnd['sky'])
bed[m, 0] += wind[m] * 0.05
bed[m, 1] += wind[m] * 0.05

# ---------- tension bed ----------
pad = np.zeros(N)
for f, g in [(41.2, .5), (55, .3), (61.7, .24), (82.4, .12), (87.3, .06)]:
    pad += g * np.sin(2 * np.pi * f * t + rnd.random() * 6) * (0.8 + 0.2 * np.sin(2 * np.pi * .12 * t + f))
pl = np.clip((t - sc0['cabin']) / 2, 0, 1) * (0.45 + 0.65 * np.clip((t - sc0['aisle']) / 25, 0, 1))
bed[:, 0] += pad * pl * 0.2
bed[:, 1] += pad * pl * 0.2
kick = sweep(110, 40, .35, .09)
tt = sc0['shade']
while tt < CUT - .3:
    add(kick, tt, 0.24 if tt < sc0['cockpit'] else 0.36, to=bed)
    tt += 1.0 if tt < sc0['cockpit'] else 0.7

def ding(at, g=0.16):
    add(tone(1046.5, 1.6, .002, .7, (1, 2.76)), at, g)

def bong(at):
    add(tone(659.25, .9, .004, .45, (1, 2, 3)), at, 0.12)
    add(tone(523.25, 1.2, .004, .6, (1, 2, 3)), at + .4, 0.12)

# ---------- scene sounds ----------
for i in range(14):
    add(tone(1800 + i * 90, .12, .002, .05), E['cabin.vanish'] + (i % 11) * .05, 0.03, (i % 5 - 2) / 3)
add(sweep(150, 45, .6, .2), E['cabin.you'], 0.45)
add(noise(.5, 1500, 7000, .02, .2) * .5, sc0['id'] + .1, 0.08)
for b in [E['id.age'], E['id.flight'], E['id.route']]:
    add(tone(1568, .08, .002, .03), b, 0.08)
add(noise(.25, 1000, 8000, .002, .08), E['seat.gone'], 0.25)
add(sweep(150, 45, .7, .25), E['seat.wake'], 0.5)
vib = (np.sin(2 * np.pi * 180 * np.arange(int(.5 * SR)) / SR) * (np.sin(2 * np.pi * 9 * np.arange(int(.5 * SR)) / SR) > 0))
add(vib, E['things.phone'], 0.06)
add(vib, E['things.phone'] + .7, 0.06)
bong(E['screens.msg'] - .2)
add(sweep(160, 45, .7, .25), E['screens.msg'] + .3, 0.45)
add(noise(.35, 600, 5000, .01, .1), E['shade.lift'], 0.25)
wn = int((E['outside.slam'] - sc0['outside']) * SR)
wx = np.arange(wn) / SR
add(norm(band(rnd.standard_normal(wn), 200, 2200)) * (0.5 + 0.5 * np.sin(2 * np.pi * .4 * wx)) * np.clip(wx / .4, 0, 1), sc0['outside'], 0.12)
gn = int(3.0 * SR)
gx = np.arange(gn) / SR
groan = sum(np.sin(2 * np.pi * np.cumsum(f * (1 + .05 * np.sin(2 * np.pi * 3 * gx))) / SR) / k for k, f in enumerate((38, 76, 114, 152), 1))
add(norm(groan) * np.sin(np.linspace(0, np.pi, gn)), E['outside.beast'] - .4, 0.5)
add(noise(.15, 300, 4000, .001, .04) + sweep(160, 50, .15, .05), E['outside.slam'], 0.7)
add(sweep(130, 35, 1.0, .35), E['outside.slam'], 0.6)
ding(E['belt.ding'])
add(noise(.04, 2000, 8000, .0005, .01), E['belt.buckle'] + .3, 0.35)
add(tone(2600, .05, .001, .015), E['belt.buckle'] + .32, 0.12)
for k in range(7):
    at = E['aisle.bins'] + k * .35
    add(noise(.08, 400, 4000, .001, .02) + sweep(220, 120, .08, .03) * .5, at, 0.22, (k % 2 - .5))
heavy = norm(sweep(90, 45, .3, .07) + noise(.3, 80, 600, .002, .05) * .7)
for r in range(9):
    at = E['aisle.walk'] + r * .3
    if at < E['beside.stop']:
        add(heavy, at, 0.3 + r * .04)
        add(noise(.06, 2000, 8000, .001, .015), at, 0.06)
def breath(dur, g):
    n = int(dur * SR)
    return norm(band(rnd.standard_normal(n), 200, 1600)) * np.sin(np.linspace(0, np.pi, n)) ** 2 * g
for k in range(3):
    add(breath(1.0, .22), E['beside.stop'] + .2 + k * 1.1, 1.0, .6)
add(sweep(130, 40, .9, .3), E['beside.stop'], 0.55)
ding(E['beside.off'])
add(noise(1.0, 300, 2500, .1, .4), E['cockpit.door'], 0.15)
for k in range(5):
    add(tone(1975, .07, .002, .02), E['cockpit.inside'] + .2 + k * .5, 0.05)
add(sweep(150, 45, .7, .25), E['cockpit.inside'] + .4, 0.45)
bong(E['pa.voice'] - .9)
add(norm(band(rnd.standard_normal(int(2 * SR)), 2000, 8000)) * np.linspace(1, 0, int(2 * SR)), E['pa.who'], 0.03)
add(sweep(140, 30, 1.4, .5), E['pa.who'] + .3, 0.75)
knock = norm(sweep(140, 70, .12, .03) + noise(.12, 1500, 6000, .0005, .01) * .8)
for k in E['knock.knocks']:
    add(knock, k, 0.9)
add(sweep(110, 28, 2.4, .8), E['knock.out'], 0.9)
hs = int((CUT - E['lift.lift']) * SR)
hx = np.arange(max(hs, 2)) / SR
if hs > SR // 10:
    slide = norm(band(rnd.standard_normal(hs), 500, 5000)) * (0.4 + 0.6 * (hx / hx[-1]))
    add(slide, E['lift.lift'], 0.08)
    riser = norm(band(rnd.standard_normal(hs), 300, 9000)) * (hx / hx[-1]) ** 2.5
    riser += sum(np.sin(2 * np.pi * np.cumsum(f * (1 + hx / hx[-1] * .6)) / SR) for f in (174.6, 185)) * (hx / hx[-1]) ** 2 * .5
    add(riser, E['lift.lift'], 0.28)

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

# Music + SFX for the night furniture-store video. With --voice it lays narration.wav on top and ducks the bed under it.
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
OFF = E['wardrobe.off']

# ---------- outside: night air + buzzing sign ----------
o1 = scEnd['outside']
amb = band(rnd.standard_normal(N), 60, 400) * 0.5
buzz = (np.sign(np.sin(2 * np.pi * 120 * t)) * 0.3 + np.sin(2 * np.pi * 240 * t) * 0.2)
m = span(0, o1)
bed[m, 0] += norm(amb)[m] * 0.04 + buzz[m] * 0.02
bed[m, 1] += norm(amb)[m] * 0.04 + buzz[m] * 0.02
cr = (np.sin(2 * np.pi * 4300 * t) * (np.sin(2 * np.pi * 28 * t) > 0) * (np.sin(2 * np.pi * 1.4 * t) > .4))
bed[m, 0] += cr[m] * 0.012
bed[m, 1] += np.roll(cr, 700)[m] * 0.012

# ---------- in-store muzak until the lights go off ----------
w0 = sc0['wardrobe']
chords = [(261.63, 329.63, 392.0), (220.0, 261.63, 329.63), (174.61, 220.0, 261.63), (196.0, 246.94, 293.66)]
tt, k = w0, 0
while tt < OFF:
    for f in chords[k % 4]:
        n = int(1.0 * SR)
        x = np.arange(n) / SR
        ep = (np.sin(2 * np.pi * f * x) + .3 * np.sin(2 * np.pi * 2 * f * x)) * env(n, .02, .5)
        add(ep[: int((OFF - tt) * SR)], tt, 0.05, to=bed)
    tt += 1.0
    k += 1
add(sweep(90, 30, .5, .15) + noise(.5, 60, 600, .001, .06), OFF, 0.9)
add(sweep(400, 40, 1.2, .5), OFF, 0.12)

# ---------- after lights-off: ventilation + tension bed ----------
pad = np.zeros(N)
for f, g in [(49, .5), (55, .3), (73.4, .24), (98, .12), (103.8, .06)]:
    pad += g * np.sin(2 * np.pi * f * t + rnd.random() * 6) * (0.8 + 0.2 * np.sin(2 * np.pi * .13 * t + f))
vent = norm(band(rnd.standard_normal(N), 120, 900)) * 0.4
lvl = np.clip((t - OFF) / 1.0, 0, 1) * (0.55 + 0.6 * np.clip((t - sc0['lamps']) / 20, 0, 1))
bed[:, 0] += (pad * 0.2 + vent * 0.05) * lvl
bed[:, 1] += (pad * 0.2 + vent * 0.05) * lvl
kick = sweep(110, 40, .35, .09)
tt = sc0['beds']
while tt < CUT - .3:
    add(kick, tt, 0.25 if tt < sc0['lamps'] else 0.36, to=bed)
    tt += 1.0 if tt < sc0['lamps'] else 0.7

# ---------- PA chimes ----------
def chime(at):
    add(tone(659.25, .6, .005, .3, (1, 2, 3)), at, 0.12)
    add(tone(523.25, .9, .005, .45, (1, 2, 3)), at + .32, 0.12)

chime(E['pa.voice'] - .75)
chime(E['name.pa'] - .75)
add(sweep(170, 55, .6, .2), E['pa.staff'], 0.45)

# ---------- sign: torch click ----------
add(noise(.03, 1500, 7000, .0005, .006), sc0['sign'] + .05, 0.35)

# ---------- beds: something breathing under the duvet ----------
def breath(dur, gain):
    n = int(dur * SR)
    x = np.arange(n) / SR
    return norm(band(rnd.standard_normal(n), 200, 1800)) * np.sin(np.pi * x / dur) ** 2 * gain

for tt in np.arange(E['beds.lump'] - .3, scEnd['beds'] - .4, 2.6):
    g = 0.14 if tt < E['beds.breathe'] - .5 else 0.26
    add(breath(1.1, g), tt)
    add(breath(1.3, g * .8), tt + 1.25)
add(sweep(150, 45, .8, .3), E['beds.breathe'], 0.55)
add(tone(1244.5, 1.4, .05, .6) + tone(1318.5, 1.4, .05, .6), E['beds.breathe'], 0.03)

# ---------- footsteps (arrows, kitchen, follow) ----------
step = noise(.08, 150, 1200, .002, .02)
for a, b, dt in [(sc0['arrows'], E['arrows.off'] + .4, .42), (sc0['kitchen'], scEnd['kitchen'], .33), (sc0['follow'], scEnd['follow'], .45)]:
    tt, n = a + .1, 0
    while tt < b:
        add(step, tt, 0.16, -.15 if n % 2 else .15)
        tt += dt
        n += 1
# the aisles change: warped glitch
ch = E['arrows.change']
gn = int(1.0 * SR)
gx = np.arange(gn) / SR
glitch = np.sin(2 * np.pi * np.cumsum(300 + 900 * np.sin(2 * np.pi * 3 * gx)) / SR) * (np.sin(2 * np.pi * 17 * gx) > 0) * env(gn, .01, .4)
add(glitch, ch - .2, 0.08)
add(sweep(80, 400, .8, .5) * .5 + sweep(400, 60, .8, .4) * .5, ch - .2, 0.25)
for p in E['kitchen.passes'][1:]:
    add(norm(band(rnd.standard_normal(int(.3 * SR)), 400, 6000)) * np.linspace(1, 0, int(.3 * SR)), p, 0.12)
add(sweep(160, 50, .6, .2), E['kitchen.passes'][2] + .2, 0.4)

# ---------- name: the PA calls her; she covers her mouth ----------
whisper = norm(band(rnd.standard_normal(int(2.2 * SR)), 1500, 7000)) * np.sin(np.linspace(0, np.pi, int(2.2 * SR))) ** 2
add(whisper, E['name.pa'], 0.05, -.4)
add(sweep(140, 45, .7, .25), E['name.cover'], 0.5)

# ---------- staff: door shuts, the clock spins to 03:00 ----------
add(sweep(90, 40, .3, .08) + noise(.3, 80, 800, .001, .05), E['staff.spin'] - .1, 0.6)  # staff door shuts
sp = E['staff.spin']
tt, dt = sp, .12
while tt < sp + 1.1:
    add(tone(2600, .02, .0005, .004), tt, 0.08)
    tt += dt
    dt = max(.03, dt * .82)
add(sweep(150, 45, .6, .2), E['staff.not'], 0.5)

# ---------- lamps: one lamp buzzing, the employee ----------
l0, l1 = sc0['lamps'], scEnd['lamps']
m = span(l0, l1)
hum = np.sign(np.sin(2 * np.pi * 100 * t)) * .2 + np.sin(2 * np.pi * 200 * t) * .2
bed[m, 0] += hum[m] * 0.03
bed[m, 1] += hum[m] * 0.03
add(sweep(130, 40, 1.0, .35), E['lamps.polo'], 0.6)
for i, b in enumerate(E['smile.blinks']):
    add(sweep(100 + i * 20, 35, .7, .2), b, 0.6 + i * 0.12)
    add(noise(.12, 300, 3000, .001, .03), b, 0.15)

# ---------- follow: arrows blip; wrong exit; bedrooms ----------
for tt in np.arange(sc0['follow'] + .2, E['follow.exit'], 1 / 2.2):
    add(tone(1046, .05, .002, .02), tt, 0.035)
add(np.sign(np.sin(2 * np.pi * 110 * np.arange(int(.35 * SR)) / SR)) * env(int(.35 * SR), .005, .2) * .5, E['follow.exit'] + .3, 0.1)
add(sweep(110, 35, 1.6, .55), E['follow.dorm'], 0.7)

# ---------- final bed: rustle, the hand, cut ----------
add(noise(1.2, 300, 3000, .05, .4), E['bed2.move'], 0.22)
hs = int((CUT - E['bed2.hand']) * SR)
hx = np.arange(hs) / SR
riser = norm(band(rnd.standard_normal(hs), 300, 9000)) * (hx / hx[-1]) ** 2.5
riser += sum(np.sin(2 * np.pi * np.cumsum(f * (1 + hx / hx[-1] * .6)) / SR) for f in (196, 207.65)) * (hx / hx[-1]) ** 2 * .5
add(riser, E['bed2.hand'], 0.3)

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

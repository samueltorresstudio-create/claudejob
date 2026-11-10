# Mixes narration + music bed + SFX for the blind video, ducking the bed under the voice and hard-cutting at the end
import json, wave, os
import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
SR = 44100
T, CUT, E = ev['total'], ev['cut'], ev['ev']
N = int(T * SR) + SR
t = np.arange(N) / SR
rnd = np.random.default_rng(11)
bed = np.zeros((N, 2))   # ducked under the voice
fx = np.zeros((N, 2))    # key hits, not ducked


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


beats = ev['beats']
sc0 = {}
for b in beats:
    sc0.setdefault(b['sc'], b['start'])
cuts = [b['start'] for b in beats if b['cut'] and b['start'] > 0]

# ---------- music bed ----------
city0 = sc0['city']
pad = np.zeros(N)
for f, g in [(55, .5), (65.41, .3), (82.41, .26), (98, .14), (130.81, .08)]:
    pad += g * np.sin(2 * np.pi * f * t + rnd.random() * 6) * (0.8 + 0.2 * np.sin(2 * np.pi * .21 * t + f))
lvl = np.clip((t - city0) / .4, 0, 1) * (0.7 + 0.5 * np.clip((t - sc0['aisle']) / 6, 0, 1))
bed[:, 0] += pad * lvl * 0.2
bed[:, 1] += pad * lvl * 0.2
# morning: soft major chord with a little shimmer
mn = int((city0 + .3) * SR)
mx = np.arange(mn) / SR
morning = sum(np.sin(2 * np.pi * f * mx) for f in (261.63, 329.63, 392.0, 523.25)) * np.clip(mx / .3, 0, 1) * np.clip((city0 + .3 - mx) / .3, 0, 1)
add(morning, 0, 0.05, to=bed)
# pulse from the ID card on
kick = sweep(120, 42, .35, .09)
tt = sc0['id']
while tt < CUT - .2:
    add(kick, tt, 0.3 if tt < sc0['aisle'] else 0.42, to=bed)
    tt += 0.8 if tt < sc0['aisle'] else 0.55
# ticking hi-hat from the rules on
hat = noise(.03, 6000, 14000, .0005, .008)
tt = sc0['mirror']
while tt < sc0['aisle']:
    add(hat, tt, 0.05, rnd.uniform(-.3, .3), to=bed)
    tt += 0.2

# ---------- bedroom ----------
rn = int(1.3 * SR)
rx = np.arange(rn) / SR
bell = (np.sin(2 * np.pi * 2300 * rx) + .5 * np.sin(2 * np.pi * 3450 * rx)) * (np.sin(2 * np.pi * 28 * rx) > 0)
add(bell * np.clip((1.3 - rx) / .1, 0, 1), E['bedroom.ring'], 0.07)

# ---------- city ----------
hn = int(1.6 * SR)
hx = np.arange(hn) / SR
horn = norm(band(np.sign(np.sin(2 * np.pi * 415 * hx)) + np.sign(np.sin(2 * np.pi * 523 * hx)), 200, 3000)) * np.clip((1.6 - hx) / .3, 0, 1)
add(horn, city0 + .05, 0.06, .5)
sn = int((sc0['eyes'] - city0 + .3) * SR)
sx = np.arange(sn) / SR
siren = np.sin(2 * np.pi * np.cumsum(750 + 250 * np.sin(2 * np.pi * .9 * sx)) / SR) * np.clip(sx / .5, 0, 1) * np.clip((sx[-1] - sx) / .3, 0, 1)
add(siren, city0, 0.035, -.6)
for b in E['city.bub']:
    add(sweep(500, 900, .06, .02), b, 0.12)

# ---------- eyes / id ----------
add(tone(1760, .5, .002, .15, (1, 2)), E['eyes.lock'], 0.1)
add(sweep(200, 1200, .35, .2) * .5, E['eyes.lock'] - .1, 0.06)
for b in E['id.beeps']:
    add(tone(1568, .08, .002, .03), b, 0.1)

# ---------- tv ----------
tv0 = sc0['tv']
add(noise(.12, 2000, 9000, .001, .04), tv0, 0.12)
add(noise(.2, 800, 9000, .002, .12), E['tv.sw'], 0.25)
add(sweep(140, 50, .5, .15), E['tv.sw'], 0.4)

# ---------- crowd ----------
c0 = sc0['crowd']
dig = np.sign(np.sin(2 * np.pi * 3000 * np.arange(int(.012 * SR)) / SR)) * env(int(.012 * SR), .0005, .003)
tt = c0 + .1
while tt < c0 + 1.6:
    add(dig, tt, 0.05, rnd.uniform(-.4, .4))
    tt += 0.025 + 0.06 * (tt - c0) / 1.6
add(sweep(110, 35, 1.4, .45), E['crowd.red'], 0.75)
rw = int(1.0 * SR)
add(norm(band(rnd.standard_normal(rw), 200, 3000)) * np.linspace(0, 1, rw) ** 2 * np.linspace(1, 0, rw) ** .3, E['crowd.red'], 0.12)
for k in range(2):
    add(tone(1975, .09, .001, .03), E['crowd.lock'] + k * .12, 0.12)

# ---------- mirror ----------
add(noise(.035, 1500, 8000, .0005, .008), E['mirror.gl'] + .3, 0.35)
for tg in E['mirror.tags']:
    add(tone(1318.5, .12, .002, .04), tg, 0.06)

# ---------- street ----------
st0 = sc0['street']
step = noise(.08, 120, 900, .002, .02)
tt = st0 + .1
while tt < E['street.see']:
    add(step, tt, 0.18, -.2 if int(tt * 10) % 2 else .2)
    tt += 0.39
add(sweep(180, 60, .4, .12), E['street.trap'], 0.35)
add(tone(98, .5, .002, .2, (1, 2, 3)), E['street.see'], 0.15)
add(tone(146.8, .5, .002, .25, (1, 2)) * .6 + tone(220, .5, .001, .1), E['street.fall'] - .02, 0.08)  # rope twang
thud = sweep(150, 45, .4, .08) + noise(.4, 80, 900, .001, .05) * .6
add(norm(thud), E['street.fall'] + .3, 0.8)

# ---------- market + aisle: fluorescent hum ----------
m0, end = sc0['market'], CUT
hum_n = int((end - m0) * SR)
hx = np.arange(hum_n) / SR
hum = (np.sin(2 * np.pi * 120 * hx) + .35 * np.sin(2 * np.pi * 240 * hx) + .15 * np.sign(np.sin(2 * np.pi * 120 * hx))) * np.clip(hx / .4, 0, 1)
add(hum, m0, 0.025, to=bed)
add(tone(3800, .2, .001, .05, (1, 1.7)), E['market.can'] + .45, 0.04)
add(tone(880, .4, .002, .2), E['market.quiet'], 0.04)

# ---------- aisle / girl ----------
add(sweep(90, 40, 2.0, .7), E['aisle.girl'], 0.5)
add(sweep(140, 50, .8, .3), E['aisle.hands'], 0.45)
add(sweep(110, 30, 2.4, .8), E['girl.look'], 0.95)
gl = int(2.0 * SR)
gx = np.arange(gl) / SR
screech = sum(np.sin(2 * np.pi * f * gx * (1 + .004 * np.sin(2 * np.pi * 6 * gx))) for f in (1244.5, 1318.5, 1396.9)) * env(gl, .05, .7)
add(screech, E['girl.look'], 0.035)
rs = int((CUT - E['girl.open']) * SR)
rx = np.arange(rs) / SR
riser = norm(band(rnd.standard_normal(rs), 300, 9000)) * (rx / rx[-1]) ** 2.5
riser += sum(np.sin(2 * np.pi * np.cumsum(f * (1 + rx / rx[-1] * .5)) / SR) for f in (220, 233.08)) * (rx / rx[-1]) ** 2 * .5
add(riser, E['girl.open'], 0.3)
inh = int(.45 * SR)
add(norm(band(rnd.standard_normal(inh), 500, 5000)) * np.linspace(0, 1, inh) ** 1.5, CUT - .45, 0.12)

# ---------- cuts + word pops ----------
for c in cuts:
    wn = int(.34 * SR)
    w = band(rnd.standard_normal(wn), 300, 3500) * np.sin(np.linspace(0, np.pi, wn)) ** 2
    add(norm(w), c - .15, 0.12, to=bed)
blip = tone(1250, .05, .002, .012)
for b in beats:
    for w in b['words']:
        add(blip, w, 0.022, to=bed)

# ---------- narration + ducking ----------
nar, nsr = sf.read(os.path.join(HERE, 'narration.wav'))
assert nsr == SR
nar = nar[:N] if len(nar) >= N else np.pad(nar, (0, N - len(nar)))
e = np.abs(nar)
k = int(.15 * SR)
e = np.convolve(e, np.ones(k) / k, 'same')
e = np.clip(e / (np.percentile(e[e > 1e-4], 90) + 1e-9), 0, 1)
duck = 1 - 0.55 * e
mix = (bed * duck[:, None]) + fx * (1 - 0.25 * e)[:, None]
mix = mix / np.abs(mix).max() * 0.33
mix[:, 0] += nar * 0.95
mix[:, 1] += nar * 0.95
mix[int(CUT * SR):] = 0  # the hard cut: everything stops with the picture
mix = mix[: int(T * SR)]
mix /= np.abs(mix).max() / 0.92
with wave.open(os.path.join(HERE, 'audio.wav'), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('audio', round(T, 2), 's, cut at', round(CUT, 2))

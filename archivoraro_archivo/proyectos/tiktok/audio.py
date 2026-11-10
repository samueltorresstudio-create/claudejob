# Synthesizes the soundtrack (ambient drone + SFX) synced to events.json
import json, wave, os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
SR = 44100
T = ev['total']
N = int(T * SR) + SR // 2
out = np.zeros((N, 2))
t = np.arange(N) / SR
rnd = np.random.default_rng(4)


def band(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    out[i:i + len(sig), 0] += sig * gain * l * 1.414
    out[i:i + len(sig), 1] += sig * gain * r * 1.414


def env(n, a, d):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    e[na:] = np.exp(-np.arange(n - na) / (d * SR))
    return e


impact, snap = ev['impact'], ev['snap']
cuts = [b['start'] for b in ev['beats'] if b['cut'] and b['start'] > 0]

# ---- drone pad ----
pad = np.zeros(N)
for f, g in [(55, .5), (82.41, .32), (110, .22), (130.81, .12), (164.81, .08)]:
    pad += g * np.sin(2 * np.pi * f * t + rnd.random() * 6) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.13 * t + f))
dark = 0.25 * np.sin(2 * np.pi * 58.27 * t) + 0.12 * np.sin(2 * np.pi * 116.54 * t)
wind = band(rnd.standard_normal(N), 180, 900) * 0.05
level = np.clip(t / 2.0, 0, 1) * (0.55 + 0.45 * np.clip((t - 10) / 9, 0, 1))
duck = np.ones(N)
pre = (t > impact - .55) & (t < impact)
duck[pre] = np.linspace(1, 0.05, pre.sum())
level = level * duck
tension = np.clip((t - impact) / .2, 0, 1)
fade = np.clip((T - t) / 1.2, 0, 1)
drone = (pad + wind) * level + dark * tension * level * 1.4
out[:, 0] += drone * 0.22 * fade
out[:, 1] += drone * 0.22 * fade

# ---- clock ticks until the glass ----
tick = np.sin(2 * np.pi * 2300 * np.arange(int(.02 * SR)) / SR) * env(int(.02 * SR), .001, .004)
k = 0
for tt in np.arange(0.25, impact - .6, 0.5):
    add(tick * (1 if k % 2 == 0 else .7), tt, 0.10, -0.3 if k % 2 else 0.3)
    k += 1

# ---- word pops ----
blip_n = int(.05 * SR)
blip = np.sin(2 * np.pi * 1250 * np.arange(blip_n) / SR) * env(blip_n, .002, .012)
for b in ev['beats']:
    n = b['words']
    step = min(.24, .62 * b['d'] / n)
    for i in range(n):
        add(blip, b['start'] + .06 + i * step, 0.035)

# ---- whooshes on cuts ----
wn = int(.38 * SR)
for c in cuts:
    w = band(rnd.standard_normal(wn), 300, 3500) * np.sin(np.linspace(0, np.pi, wn)) ** 2
    add(w / np.abs(w).max(), c - .17, 0.16)

# ---- globe counter: accelerating digital ticks ----
g0 = next(b['start'] for b in ev['beats'] if b['sc'] == 'globe')
dn = int(.012 * SR)
dig = np.sign(np.sin(2 * np.pi * 3200 * np.arange(dn) / SR)) * env(dn, .0005, .003)
tt = g0 + .15
while tt < g0 + 1.85:
    add(dig, tt, 0.045, rnd.uniform(-.4, .4))
    tt += 0.03 + 0.05 * ((tt - g0) / 1.85) ** 2
ding_n = int(1.2 * SR)
ding = (np.sin(2 * np.pi * 880 * np.arange(ding_n) / SR) + .4 * np.sin(2 * np.pi * 1320 * np.arange(ding_n) / SR)) * env(ding_n, .002, .35)
add(ding, g0 + 1.9, 0.12)

# ---- ID scan beeps ----
i0 = next(b['start'] for b in ev['beats'] if b['sc'] == 'id')
bn = int(.07 * SR)
beep = np.sin(2 * np.pi * 1760 * np.arange(bn) / SR) * env(bn, .002, .03)
for d in (.4, .6, 1.0, 1.35):
    add(beep, i0 + d, 0.08)

# ---- heartbeat in the silence rule ----
r0 = next(b['start'] for b in ev['beats'] if b['sc'] == 'rule')
hn = int(.18 * SR)
hb = np.sin(2 * np.pi * np.cumsum(np.linspace(70, 40, hn)) / SR) * env(hn, .004, .05)
tt = r0 + .2
while tt < impact - .6:
    add(hb, tt, 0.55)
    add(hb, tt + .22, 0.38)
    tt += 0.78

# ---- glass shatter ----
sn = int(1.4 * SR)
crash = band(rnd.standard_normal(sn), 2500, 14000) * env(sn, .001, .09)
for _ in range(14):
    f = rnd.uniform(3000, 7500)
    d = rnd.uniform(0, .25)
    pn = int(.5 * SR)
    ping = np.sin(2 * np.pi * f * np.arange(pn) / SR) * env(pn, .001, rnd.uniform(.05, .15))
    i = int(d * SR)
    crash[i:i + pn] += ping[: sn - i] * rnd.uniform(.2, .5)
thud_n = int(.4 * SR)
thud = np.sin(2 * np.pi * np.cumsum(np.linspace(140, 50, thud_n)) / SR) * env(thud_n, .001, .08)
crash[:thud_n] += thud * 1.2
add(crash / np.abs(crash).max(), impact, 0.75)

# ---- riser + boom when the eyes open ----
rn = int(.6 * SR)
riser = band(rnd.standard_normal(rn), 400, 8000) * np.linspace(0, 1, rn) ** 3
add(riser / np.abs(riser).max(), snap - .6, 0.25)
bn2 = int(2.2 * SR)
boom = np.sin(2 * np.pi * np.cumsum(np.linspace(95, 32, bn2)) / SR) * env(bn2, .002, .6)
boom += band(rnd.standard_normal(bn2), 40, 400) * env(bn2, .001, .12) * .8
add(boom / np.abs(boom).max(), snap, 0.95)
stab_n = int(1.6 * SR)
st = np.arange(stab_n) / SR
stab = sum(np.sin(2 * np.pi * f * st) for f in (220, 233.08, 311.13, 329.63)) * env(stab_n, .005, .5)
add(stab / np.abs(stab).max(), snap, 0.18)
add(boom / np.abs(boom).max(), ev['beats'][-1]['start'], 0.5)

out = out[: int(T * SR)]
out /= np.abs(out).max() / 0.89
pcm = (out * 32767).astype(np.int16)
with wave.open(os.path.join(HERE, 'audio.wav'), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('audio', T, 's')

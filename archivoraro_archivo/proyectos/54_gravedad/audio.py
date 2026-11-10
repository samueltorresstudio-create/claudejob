# Music + SFX for «10 segundos sin gravedad». --voice lays narration.wav on top and ducks the bed.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR

m = Mix(HERE, seed=54)
B = m.beats; CUT = m.CUT
rng = np.random.default_rng(9)
W = lambda i, j=None: B[i]['start'] if j is None else B[i]['words'][j]
L = lambda i: B[i]['start']

# ---- story clock (same anchors as scenes_p.js) ----
T0 = W(0, 5)
PTS = [(T0, 0), (L(3), .04), (W(3, 6), .07), (L(4), .10), (L(5), .14), (L(6), .16), (W(7, 1), .20), (W(7, 8), .55), (L(8), 2.0), (L(10), 2.9), (L(11), 3.3),
       (L(12), 4.0), (L(13), 4.9), (L(14), 5.1), (L(15), 6.2), (W(16, 1), 7.25), (L(17), 8.0), (L(18), 8.6), (L(19), 9.3), (W(20, 2), 10.0), (L(21), 10.9),
       (W(22, 7), 12.565), (L(23), 13.4), (L(24) + 2.6, 16)]
def GT(T):
    if T < T0:
        r0 = T0 - .42; pre = .42 * 1.03 / 2
        if T < r0: return -pre - (r0 - T)
        u = (T - r0) / .42; return -pre + .42 * (u - .97 * u * u / 2)
    for (a, ga), (b, gb) in zip(PTS, PTS[1:]):
        if T < b: return ga + (gb - ga) * (T - a) / (b - a)
    return PTS[-1][1] + T - PTS[-1][0]
def TofG(g):  # inverse (monotonic search)
    lo, hi = 0.0, m.T
    for _ in range(50):
        mid = (lo + hi) / 2
        if GT(mid) < g: lo = mid
        else: hi = mid
    return lo

def thump(when, gain=.2, f=130, pan=0):
    m.add(m.layer(m.hit(f, f * .45, .18, .08), m.noise(.04, 300, 2500, .001, .03) * .5), when, gain, pan)
def squeak(when, gain=.05):
    n = int(.12 * SR); tt = np.arange(n) / SR
    m.add(np.sin(2 * np.pi * (2400 + 900 * np.sin(tt * 60)) * tt) * np.sin(np.pi * tt / tt[-1]) ** 2, when, gain)
def bloop(when, gain=.05, f=420):
    n = int(.22 * SR); tt = np.arange(n) / SR
    m.add(np.sin(2 * np.pi * np.cumsum(f * (1 + 1.2 * tt / tt[-1])) / SR) * np.exp(-tt * 14), when, gain, rng.random() * .6 - .3)
def tick(when, gain=.08):
    m.add(m.layer(m.tone(2600, .03, .001, .02), m.noise(.02, 2000, 8000, .001, .01) * .4), when, gain)
def rimclang(when, gain=.3):
    m.add(m.layer(m.metal(620, 1.4, .5), m.hit(380, 200, .2, .08) * .6), when, gain, .1)
def netrattle(when, gain=.06, dur=.6):
    n = int(dur * SR); tt = np.arange(n) / SR
    m.add(m.band(rng.standard_normal(n), 2500, 9000) * (np.abs(np.sin(tt * 47)) ** 4) * np.exp(-tt * 4), when, gain)
def shimmer(a, b, gain=.05):  # weightless pad: detuned high sines that float
    n = int((b - a) * SR); tt = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * tt + 1.7 * np.sin(2 * np.pi * .23 * tt + f)) for f in (880, 1108.7, 1318.5, 1661.2, 1760 * 1.003))
    env = np.clip(tt / 1.2, 0, 1) * np.clip((b - a - tt) / .8, 0, 1)
    m.add(m.norm(x) * env, a, gain, bed=True)
def engine(a, b, gain=.08):
    n = int((b - a) * SR); tt = np.arange(n) / SR
    f = 62 + 6 * np.sin(tt * 2) + 18 * np.clip(tt / 1.5, 0, 1)  # revs up: the wheels spin free
    ph = 2 * np.pi * np.cumsum(f) / SR; x = np.sign(np.sin(ph)) * .5 + np.sin(2 * ph) * .4
    m.add(m.band(x, 40, 1600) * np.clip(tt / .3, 0, 1) * np.clip((b - a - tt) / .3, 0, 1), a, gain, .2)

# ======================= MUSIC =======================
# 0 → T0: street beat in real time (kick, snare, hats)
bt = 60 / 96
k = 0.0
while k < T0 + .05:
    m.add(m.sweep(120, 45, .3, .1), k, .32, bed=True)
    if int(round(k / bt)) % 2 == 1: m.add(m.noise(.16, 900, 6000, .002, .1), k, .16, bed=True)
    for h in (0, .5): m.add(m.noise(.04, 6000, 12000, .001, .02), k + h * bt, .06, bed=True)
    k += bt
# gravity switches off: reverse swell + low whomp, the beat dies, a floating pad takes over
m.riser(T0 - 1.0, T0, .22, f=(220, 233))
m.add(m.sweep(220, 40, 1.8, 1.4), T0, .32)
m.boom(T0, .28, 3.0)
shimmer(T0, L(8) - .2, .045)
m.drone([(55, .6), (82.4, .3), (110, .15)], T0, gain=.06, until=L(8))
m.heartbeat(T0 + .6, L(8), bpm=62, gain=.1)
# street → car: city tension, pulses
m.drone([(49, .6), (73.4, .3), (98, .12)], L(8), gain=.06, until=L(12))
m.pulses(L(8), L(11), end=L(12) - .1)
# Iker / rules: the clock is ticking
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], L(12), gain=.07, until=W(20, 2), rise=(L(14), 12))
m.heartbeat(L(12), W(20, 2) - .1, bpm=100, gain=.14)
shimmer(L(14), L(19), .03)
m.riser(L(18), W(20, 2), .3)
# a tick every story second (HUD)
for s in range(1, 11):
    tick(TofG(s), .1 if s < 9 else .16)
# after the fall: low tension until the ball lands, then release
m.drone([(41.2, .6), (61.7, .3), (82.4, .15)], L(21), gain=.07, until=W(22, 7))
m.riser(L(21) + 1, W(22, 7), .26, f=(196, 207.7))
m.drone([(65.4, .5), (98, .3), (130.8, .2), (164.8, .12)], W(22, 7) + .3, gain=.06)
m.riser(CUT - 2.4, CUT, .3)
m.whooshes_and_pops()

# ======================= SFX =======================
# city ambience on the court and the street (muffled after the gravity loss)
m.amb(m.bed_noise(150, 1200, .4, .2), 0, CUT, .012)
m.birds(.3, T0, 3, .02)
# dribbling + sneakers, then take-off
g0 = GT(0.0)
for i in range(40):  # find the ground hits of |sin(pi*(g+2)/.45)| = 0 before the jump
    g = -2 + i * .45
    if g0 < g < -.08: thump(TofG(g), .22, 150, .1)
squeak(TofG(-.35), .05); squeak(TofG(-.12), .07)
m.add(m.noise(.12, 200, 2000, .005, .08), TofG(-.08), .12)          # take-off scuff
m.add(m.layer(m.noise(.6, 2000, 9000, .2, .3)), T0 - .1, .04)       # air rushing in
for i in range(10): m.add(m.tone(1600 + i * 140, .4, .05, .3), T0 + .1 + i * .07, .012, rng.random() - .5)   # sparkles
# 10 s / slow motion: a long low "tape slow-down"
m.add(m.sweep(400, 90, 1.6, .9), L(2), .05)
# ball slips away
m.whoosh(W(3, 6), .1, .9); m.add(m.sweep(500, 1400, 1.2, .8), W(3, 6), .03)
# 30 m ghost: rising whoosh + floor dings
m.add(m.sweep(300, 1600, 2.6, 1.0), L(5) + .3, .05)
for f in range(1, 10): m.ding(L(5) + .3 + f * .29, .025, 880 + f * 60)
m.boom(W(5, 7), .2, 1.5)
# the grab
rimclang(W(7, 1), .26); netrattle(W(7, 1), .08, .9); m.add(m.hit(300, 120, .15, .05), W(7, 1), .2)
# street: murmurs (filtered noise) and bag rustle, a pop for the balloon
m.amb(m.bed_noise(300, 2500, .6, 1.3), L(8), L(10), .02)
m.add(m.noise(.5, 2000, 7000, .05, .3), L(9) + .5, .04)
m.add(m.sweep(700, 1300, .25, .15), W(9, 9), .04)
# café: cups clink and coffee bloops
for i in range(3): m.ding(L(10) + .2 + i * .35, .04, 2093 + i * 220)
for i in range(7): bloop(L(10) + .1 + i * .32, .05, 300 + i * 40)
# the car: engine revving with no grip, wind
engine(L(11), L(12) + .05, .1)
m.amb(m.bed_noise(500, 4000, .3, .6), L(11), L(12), .03)
# Iker gets ready / «¡No saltes!»
m.sting(W(12, 6), .14)
m.add(m.hit(90, 40, .5, .2), L(13), .3); m.sting(L(13), .22, (196, 207.7, 293.7, 311.1))
# rules: sneaker slips off (soft pop), rule 3 tension stab
m.add(m.sweep(900, 600, .12, .08), W(14, 4) + .1, .06); bloop(W(14, 4) + .15, .04, 600)
m.sting(W(15, 8), .14)
# the push and the catch
rimclang(W(16, 1), .2); m.whoosh(W(16, 1) + .05, .2, .7)
thump(L(17) + .05, .3, 110); m.add(m.noise(.3, 300, 2000, .01, .2), L(17) + .05, .1)
m.add(m.noise(.8, 1500, 5000, .05, .5), L(17) + .5, .04)   # sliding down the pole
thump(TofG(8.45), .18, 120); thump(TofG(8.7), .14, 100)
# second 10: silence, then BOOM
m.add(m.sweep(1800, 300, .5, .4), W(20, 2) - .5, .05)
m.boom(W(20, 2), .55, 3.0)
for i, d in enumerate([.05, .12, .2, .31, .45, .6]): thump(W(20, 2) + d, .2 - i * .015, 140 - i * 10, rng.random() - .5)
tf = W(20, 2)
m.add(m.noise(.4, 3000, 10000, .002, .3), tf + .78 + .3, .12)     # street: people land
m.add(m.layer(m.hit(70, 30, .8, .4), m.noise(.6, 100, 900, .01, .5)), tf + 1.45 + .25, .4)   # car lands in the field
m.add(m.noise(.25, 3500, 11000, .001, .18), tf + 2.05 + .3, .16); m.add(m.noise(.15, 2000, 6000, .001, .1), tf + 2.05 + .38, .1)  # cups break
# the ball falls: a long descending whistle in slow motion, then PAM and the bounce
n = int((W(22, 7) - L(21)) * SR); tt = np.arange(n) / SR; fr = 1400 - 900 * (tt / tt[-1]) ** 1.5
m.add(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.clip(tt / 1.5, 0, 1) * (.3 + .7 * (tt / tt[-1]) ** 2), L(21), .05)
m.add(m.noise(n / SR, 200, 1500, 1.5, .1), L(21), .04)
m.add(m.layer(m.hit(160, 50, .5, .2), m.noise(.08, 500, 6000, .001, .05)), W(22, 7), .55)
m.boom(W(22, 7), .35, 1.8)
netrattle(W(22, 7) + .55, .05, .5)
for i, d in enumerate([1.0, 2.6]): thump(W(22, 7) + d, .16 - i * .05, 160)
# ending: relief, then the last question
m.sting(W(24, 5), .22, (196, 233.1, 293.7, 349.2))
m.finish('--voice' in sys.argv)

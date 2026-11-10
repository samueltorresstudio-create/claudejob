# Music + SFX for «Un mundo sin voz». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

HERE = os.path.dirname(os.path.abspath(__file__))
m = Mix(HERE, seed=53)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def sung(f0, dur, vowel=(320, 800)):
    # a hummed vowel: harmonics shaped by two formants, with a slow vibrato
    n = int(dur * SR)
    x = np.arange(n) / SR
    f = f0 * (1 + .012 * np.sin(2 * np.pi * 5.2 * x) * np.clip(x / .25, 0, 1))
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.zeros(n)
    for k in range(1, 28):
        fk = k * f0
        a = np.exp(-((fk - vowel[0]) / 140) ** 2) + .55 * np.exp(-((fk - vowel[1]) / 220) ** 2) + .02 / k
        y += a * np.sin(k * ph)
    env = np.clip(x / .12, 0, 1) * np.clip((dur - x) / .25, 0, 1)
    return m.norm(y) * env


def amb(sig, a, b, gain):
    lv = np.zeros(N)
    lv[m.span(a, b)] = gain
    lv = np.convolve(lv, np.ones(int(.25 * SR)) / int(.25 * SR), 'same')
    m.bed[:, 0] += sig * lv
    m.bed[:, 1] += np.roll(sig, 400) * lv


def bird(when, gain=.03, pan=0):
    f0 = 3000 + 1500 * m.rnd.random()
    for j in range(2 + int(m.rnd.random() * 3)):
        m.add(m.sweep(f0, f0 * 1.3, .07, .03), when + j * .1, gain, pan=pan)


# ---------- beds ----------
m.drone([(65.4, .5), (98, .3), (130.8, .2), (155.6, .12)], 0, gain=.07, rise=(sc0['rule3'], 25), until=E['wardrobe.stop'])
m.drone([(43.7, .6), (65.4, .2)], E['wardrobe.stop'], gain=.09)
m.pulses(sc0['rule1'] + 3, sc0['stairs'], end=E['wardrobe.stop'])
m.riser(sc0['mouth'], CUT, gain=.32)
m.whooshes_and_pops()

# a morning with no voices: birds and far traffic only
town = m.norm(m.band(m.rnd.standard_normal(N), 60, 700))
amb(town, 0, sc0['tv'], .03)
# a sparse, glassy motif while the day is still normal-looking
tt, k = .4, 0
while tt < sc0['rule1']:
    m.add(m.tone([523.3, 659.3, 784, 659.3, 587.3, 493.9][k % 6], 1.4, .003, .6, (1, 2, 4)), tt, .035, pan=.3 if k % 2 else -.3, bed=True)
    tt += 1.1
    k += 1
for k in range(26):
    bird(m.rnd.uniform(0, sc0['tv']), .025, m.rnd.uniform(-.7, .7))
night = m.norm(m.band(m.rnd.standard_normal(N), 80, 500))
amb(night, sc0['rule3'], CUT, .012)

# ---------- intro / id / mom ----------
for k in range(10):  # lips moving: tiny dry clicks, no voice
    m.add(m.noise(.02, 1500, 5000, .001, .006), .3 + k * .62, .02, pan=m.rnd.uniform(-.6, .6))
m.add(m.layer(m.tone(392, 1.6, .02, .8, (1, 2, 3)), m.tone(587.3, 1.6, .02, .8, (1, 2))), E['intro.you'], .07)
m.add(m.hit(80, 35, 1.2, .4), E['intro.push'], .3)
m.add(m.noise(.25, 300, 4000, .05, .1), sc0['id'] + .02, .12)
m.add(m.tone(880, .3, .002, .15), E['id.age'] + .25, .06)
for k in range(6):
    m.add(m.noise(.02, 1500, 5000, .001, .006), sc0['mom'] + .3 + k * .4, .025)
m.add(m.tone(440, .15, .002, .08), E['mom.none'], .07)
m.add(m.tone(330, .25, .002, .12), E['mom.none'] + .15, .07)

# ---------- street ----------
h = m.layer(m.tone(988, 1.2, .005, .5, (1, 2, 3)), m.tone(1319, 1.2, .005, .5, (1, 2)))
for k, dl in enumerate((0, .18, .36, .54)):  # his voice bounces off the silent street
    m.add(h, E['street.hola'] + dl, .1 * .55 ** k, pan=(-.4, .4, -.2, .2)[k])
m.add(m.noise(.35, 400, 4000, .05, .1), E['street.turn'] - .1, .12)
for k in range(4):
    m.add(m.noise(.03, 1000, 4000, .001, .01), E['street.turn'] + k * .05, .08, pan=(-.7, -.3, .3, .7)[k])
m.add(m.hit(60, 28, 2.0, .8), E['street.stare'], .4)

# ---------- tv: emergency broadcast tones ----------
eas = m.layer(m.tone(853, 1.6, .01, 5.0), m.tone(960, 1.6, .01, 5.0))
m.add(eas, sc0['tv'] + .1, .06)
m.add(eas, E['tv.msg'] - .2, .05)
for k in range(14):
    m.add(m.tone(1600, .03, .001, .01), E['tv.msg'] + k * .13, .04)

# ---------- rule1: the listener (sonar pings), the empty flat ----------
for k in range(int((E['rule1.flat'] - E['rule1.hunt']) / 1.25) + 1):
    tt = E['rule1.hunt'] + k * 1.25
    for j, g in enumerate((1, .45, .2)):
        m.add(m.tone(1760, .9, .002, .35), tt + j * .22, .06 * g, pan=(.2, -.3, .4)[j])
wind = m.norm(m.band(m.rnd.standard_normal(N), 200, 1500)) * (0.6 + 0.4 * np.sin(2 * np.pi * .7 * t))
amb(wind, E['rule1.flat'], sc0['rule2'], .05)

# ---------- rule2: pencil ----------
scr = m.norm(m.band(m.rnd.standard_normal(N), 1800, 7000)) * (np.sin(2 * np.pi * 7 * t) > 0)
amb(scr, E['rule2.write'], E['rule2.write'] + 1.3, .03)
amb(scr, E['rule2.sis'], E['rule2.sis'] + 1.4, .035)
m.add(m.layer(m.tone(220, 1.5, .02, .7), m.tone(233.1, 1.5, .02, .7)), E['rule2.puzzle'], .08)

# ---------- the lullaby: far, then closer and closer, then it stops dead ----------
mel = [(440, 1), (523.3, 1), (659.3, 2), (587.3, 1), (523.3, 1), (493.9, 2), (440, 1), (493.9, 1), (523.3, 1), (493.9, 1), (440, 3)]
a, b = E['rule3.sing'], E['wardrobe.stop']
song = np.zeros(N)
tt, i, beat = a, 0, .55
while tt < b:
    f, d = mel[i % len(mel)]
    seg = sung(f, d * beat + .05, (320, 800) if i % 3 else (700, 1200))
    j = int(tt * SR)
    song[j:j + len(seg)] += seg[: max(0, N - j)]
    tt += d * beat
    i += 1
song[int(b * SR):] = 0
# distance: 1 = far (dull and quiet), 0 = right next to him
dist = np.ones(N)
lvl = np.zeros(N)
for key0, key1, d0, d1, g0, g1 in [
        (a, sc0['close'], 1, .9, .05, .07),
        (sc0['close'], E['close.near'], .9, .7, .07, .08),
        (E['close.near'], sc0['stairs'], .7, .5, .09, .11),
        (sc0['stairs'], E['stairs.stair'], .5, .4, .11, .12),
        (E['stairs.stair'], E['stairs.door'], .4, .25, .13, .15),
        (E['stairs.door'], b, .2, .05, .16, .2)]:
    mk = m.span(key0, key1)
    k = (t[mk] - key0) / max(.01, key1 - key0)
    dist[mk] = d0 + (d1 - d0) * k
    lvl[mk] = g0 + (g1 - g0) * k
lvl[t >= b] = 0
far = m.band(song, 120, 1100)
out = (far * dist + song * (1 - dist)) * lvl
m.bed[:, 0] += out * .9
m.bed[:, 1] += np.roll(out, int(.012 * SR)) * 1.0
m.add(m.tone(1047, .8, .005, .4, (1, 2)), E['rule3.nobody'], .05)

# ---------- walkers / close / stairs ----------
tt = sc0['walkers']
while tt < E['walkers.gone']:
    m.add(m.noise(.12, 200, 1500, .02, .05), tt, .03, pan=m.rnd.uniform(-.5, .5))
    tt += .16 + .1 * m.rnd.random()
m.add(m.layer(m.hit(90, 35, .8, .2), m.noise(.1, 100, 1200, .001, .04)), E['walkers.gone'] + .3, .4)
m.add(m.noise(.4, 600, 5000, .05, .12), E['close.shut'], .1)
m.add(m.layer(m.hit(140, 60, .3, .06), m.noise(.05, 1000, 5000, .001, .02)), E['close.shut'] + .35, .25)
m.add(m.hit(70, 30, 1.4, .5), E['stairs.door'], .35)

# ---------- note / wardrobe / mouth ----------
tr = m.norm(m.band(m.rnd.standard_normal(N), 2000, 6000)) * (np.sin(2 * np.pi * 9 * t) > .5)
amb(tr, sc0['note'], E['note.book'], .02)
m.add(m.layer(m.hit(55, 25, 2.0, .9), m.tone(2637, 2.0, .01, 1.2) * .1), E['note.book'] + .3, .45)
m.bed[m.span(b, b + .02)] *= 0
m.add(m.noise(.6, 300, 2000, .05, .3), E['wardrobe.from'], .05)
k_ = np.arange(int(.03 * SR)) / SR
cr = np.exp(-k_ * 90) * (np.sin(2 * np.pi * 820 * k_) + .6 * np.sin(2 * np.pi * 1530 * k_))
for j in range(30):
    m.add(cr, E['wardrobe.from'] + .3 + j * .05 + .03 * m.rnd.random(), .05)
hb = m.layer(m.hit(70, 40, .18, .05), m.hit(60, 35, .18, .05) * .7)
for k in range(8):
    m.add(hb, sc0['mouth'] + k * .45, .25)
    m.add(hb, sc0['mouth'] + k * .45 + .18, .18)

m.finish('--voice' in sys.argv)

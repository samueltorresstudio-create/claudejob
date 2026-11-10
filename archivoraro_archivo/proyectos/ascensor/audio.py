# Music + SFX for «El ascensor». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

HERE = os.path.dirname(os.path.abspath(__file__))
m = Mix(HERE, seed=41)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def metal(f0=310, dur=1.2, d=.35):  # struck steel panel: a few inharmonic partials
    return m.norm(m.layer(*[m.tone(f0 * r, dur, .001, d / (1 + i * .5)) * g for i, (r, g) in enumerate([(1, 1), (2.32, .6), (3.71, .4), (5.1, .25)])]))


def echo(sig, delays=(.11, .23, .37), fb=.45):  # stairwell echo
    out = np.pad(sig, (0, int(max(delays) * SR) + 10))
    for k, dl in enumerate(delays):
        i = int(dl * SR)
        out[i:i + len(sig)] += sig * fb ** (k + 1)
    return out


def step_sfx():
    return m.layer(m.noise(.07, 150, 1800, .002, .02), m.hit(90, 50, .1, .03) * .4)


def steps(t0, t1, every, gain, pan=0, fade=0):
    tt, k = t0, 0
    while tt < t1:
        g = gain * (1 - fade * (tt - t0) / max(.1, t1 - t0))
        m.add(echo(step_sfx()), tt, g * (.85 + .3 * m.rnd.random()), pan=pan)
        tt += every
        k += 1


def amb(sig, a, b, gain):
    lv = np.zeros(N)
    lv[m.span(a, b)] = gain
    lv = np.convolve(lv, np.ones(int(.2 * SR)) / int(.2 * SR), 'same')
    m.bed[:, 0] += sig * lv
    m.bed[:, 1] += np.roll(sig, 400) * lv


# ---------- beds ----------
m.drone([(55, .5), (82.4, .3), (110, .25), (116.5, .12)], 0, gain=.06, rise=(sc0['steps'], 30))
m.drone([(41.2, .6), (61.7, .25)], sc0['day3'], gain=.06)
m.pulses(sc0['steps'], sc0['next'])
m.riser(sc0['next'] + .5, CUT, gain=.3)
m.whooshes_and_pops()

city = m.norm(m.band(m.rnd.standard_normal(N), 60, 900))
amb(city, 0, sc0['id'], .04)
hum = m.norm(np.sin(2 * np.pi * 98 * t) + .5 * np.sin(2 * np.pi * 196 * t) + .3 * m.band(m.rnd.standard_normal(N), 80, 400))
off = E['stop.off']
amb(hum, 0, off, .05)
shaft = m.norm(m.band(m.rnd.standard_normal(N), 30, 260)) * (0.7 + 0.3 * np.sin(2 * np.pi * .2 * t))
amb(shaft, off, sc0['doors'] + 2.4, .05)
room = m.norm(m.band(m.rnd.standard_normal(N), 100, 600))
amb(room, sc0['doors'] + 2.4, CUT, .03)
buzz = m.band(np.sign(np.sin(2 * np.pi * 50 * t)), 50, 2000) * .3
amb(buzz, off, sc0['city'], .02)
amb(buzz, sc0['roof'], sc0['doors'], .006)

# ---------- stop: floors passing, the jolt and the power going out ----------
for k in range(3):
    m.add(m.tone(1047, .5, .002, .25, (1, 2)), sc0['stop'] + .1 + k * 1.1, .05)
m.add(m.layer(metal(180, 1.0, .25) * .6, m.hit(100, 35, .8, .2)), E['stop.stall'], .55)
m.add(m.sweep(220, 30, 1.2, .5), off, .35)
m.add(m.layer(m.hit(60, 25, 1.8, .7), m.noise(.3, 60, 500, .001, .15) * .4), off, .5)

# ---------- city: the whole grid goes down ----------
m.add(m.sweep(160, 20, 2.5, 1.2), E['city.wave'], .4)
for k in range(5):
    m.add(m.layer(m.hit(80, 30, .5, .12), m.noise(.15, 100, 1500, .001, .05) * .5), E['city.wave'] + .1 + k * .2, .12, pan=-.8 + k * .4)

# ---------- roof ----------
m.add(m.noise(.4, 800, 4000, .02, .15), sc0['roof'] + .5, .06)
m.add(m.sweep(200, 60, 2.0, .8), E['roof.shaft'] + .3, .2)
for k in range(6):
    m.add(metal(140 + 40 * k, 1.5, .6), E['roof.cables'] + k * .28, .1, pan=m.rnd.uniform(-.4, .4))

# ---------- battery ----------
m.add(m.tone(1760, .12, .002, .05), sc0['battery'] + .2, .06)
m.add(m.tone(440, .3, .002, .15), E['battery.pct'], .08)
m.add(m.noise(.03, 1500, 6000, .001, .01), E['battery.flash'], .2)

# ---------- steps: someone in the stairwell ----------
steps(E['steps.steps'], E['steps.stop'], .5, .12, pan=-.2)
for k in range(4):
    m.add(m.layer(metal(260, 1.4, .5), m.hit(110, 40, .4, .1)), E['steps.bang'] + k * .35, .4)
m.add(m.tone(60, 2.0, .05, 1.0), E['steps.stop'], .2)
steps(E['steps.gone'], E['steps.gone'] + 2.2, .55, .1, pan=.3, fade=.9)

# ---------- water ----------
m.add(m.noise(.25, 300, 2000, .02, .1), sc0['water'] + .3, .06)
for k in range(8):
    m.add(m.tone(500 + 90 * m.rnd.random(), .08, .002, .03), E['water.half'] + k * .09, .03)
m.add(m.noise(.15, 2000, 7000, .005, .05), E['water.cap'], .08)

# ---------- sleep: breathing, then someone on the roof of the cabin ----------
br = m.norm(m.band(m.rnd.standard_normal(N), 200, 1200)) * np.clip(np.sin(2 * np.pi * .25 * t), 0, 1) ** 2
amb(br, sc0['sleep'], E['sleep.wake'], .025)
for k in range(6):
    m.add(m.layer(metal(120, 1.0, .3) * .5, m.hit(70, 35, .4, .12)), E['sleep.walk'] + k * .45, .35, pan=-.5 + k * .2)
for k in range(10):
    m.add(m.noise(.05, 1500, 5000, .001, .02), E['sleep.walk'] + .2 + k * .2, .03)

# ---------- day 3 + doors ----------
amb(br, sc0['day3'], E['day3.steps'], .02)
steps(E['day3.steps'], sc0['doors'] + .3, .48, .12, pan=-.1)
grind = m.norm(m.band(m.rnd.standard_normal(N), 150, 1400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t))
amb(grind, E['doors.pry'], E['doors.out'] - .2, .09)
m.add(metal(200, 1.5, .5), E['doors.out'] - .25, .25)
m.add(m.noise(.6, 200, 1500, .05, .2), E['doors.out'] + .2, .06)
m.add(m.layer(m.tone(220, 2, .01, 1), m.tone(233.1, 2, .01, 1)), E['empty.none'], .1)

# ---------- next: the other lift starts with no power ----------
motor = m.norm(np.sin(2 * np.pi * (70 + 30 * np.clip((t - E['next.start']) / 3, 0, 1)) * t) + .4 * m.band(m.rnd.standard_normal(N), 60, 300))
amb(motor, E['next.start'], CUT, .07)
m.add(m.layer(metal(180, .8, .2) * .5, m.hit(90, 40, .5, .1)), E['next.start'], .3)
m.add(m.tone(1047, 1.2, .002, .6, (1, 2)), E['next.stop'], .14)
slide = m.norm(m.band(m.rnd.standard_normal(N), 100, 900))
amb(slide, E['next.open'], CUT, .06)

m.finish('--voice' in sys.argv)

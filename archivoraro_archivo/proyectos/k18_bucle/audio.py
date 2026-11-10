# Music + SFX for «El último día de cole en bucle». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=191)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def school_bell(when, dur=1.6, gain=.08):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    sig = np.sin(2 * np.pi * 1100 * tt) * (np.sin(2 * np.pi * 28 * tt) > 0) * np.minimum(1, (dur - tt) * 8)
    m.add(m.band(sig, 600, 5000), when, gain)


def tape_rewind(when, dur=1.0, gain=.06):
    m.add(m.sweep(300, 2400, dur, dur * .8), when, gain)
    m.add(m.noise(dur, 1500, 7000, .05, .3), when, gain * .6)


def scribble(when, n=6, gain=.04):
    for k in range(n):
        m.add(m.noise(.07, 2000, 6000, .005, .04), when + k * .12, gain)


# ---------- music: a happy end-of-term tune that keeps rewinding, then a music-box version of it gone wrong ----------
happy = lambda f: m.tone(f, .4, .003, .16, (1, 2, 3))
tune = [(523.3, 1), (659.3, 1), (784, 1), (1046.5, 1), (784, 1), (659.3, 1), (698.5, 1), (587.3, 1)]
for a, b in ((0, E['intro.repeat']), (sc0['loop'], E['loop.wake'] - 1.2), (E['loop.wake'], sc0['step3'])):
    m.melody(tune, a, b, .25, .03, pan=-.2, inst=happy)
m.melody([(f * .5, d) for f, d in tune], sc0['step3'], CUT, .45, .02, pan=.2, inst=lambda f: m.musicbox(f * .985))
m.drone([(55, .5), (82.4, .25), (110, .12), (116.5, .08)], sc0['step3'], gain=.05, rise=(sc0['end'], 12))
m.pulses(sc0['step4'], sc0['end'], end=E['end.close'])
m.riser(E['end.turn'] - .3, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- the bell, the rewind ----------
m.amb(m.bed_noise(300, 3000, .5, 1.5), 0, E['intro.repeat'], .025)  # classroom chatter
school_bell(E['intro.last'] - .2)
m.add(m.layer(*[m.sung(f, .6, (700, 1300)) for f in (330, 400, 470)]), E['intro.last'] + .3, .05)  # kids cheering
tape_rewind(E['intro.repeat'], 1.2)
m.whoosh(sc0['id'], .1)
m.amb(m.bed_noise(300, 3000, .5, 1.5), sc0['loop'], E['loop.wake'] - 1.2, .025)
school_bell(E['loop.bell'] - .2)
tape_rewind(E['loop.wake'] - 1.2, .9)
for k in range(6):
    m.add(m.tone(2200, .08, .001, .05), E['loop.wake'] - .2 + k * .16, .03)  # alarm clock
m.birds(E['loop.wake'], sc0['step1'], 3)
m.sting(E['loop.same'], .14)

# ---------- the notebook ----------
for w in (E['step1.mark'], E['step1.one'], E['step1.ten'], E['step1.fifty'], E['step1.ninety']):
    scribble(w, 5)
m.sting(E['step1.fri'], .14)

# ---------- the same day, to the second ----------
m.amb(m.bed_noise(300, 3000, .5, 1.5), sc0['step2'], scEnd['step2'], .02)
m.add(m.layer(*[m.sung(f, .5, (700, 1300)) for f in (300, 360)]), E['step2.joke'], .04)  # Carlos laughing
m.add(m.layer(m.hit(700, 400, .05, .02), m.noise(.3, 300, 2500, .01, .2)), E['step2.juice'] + .4, .07)  # juice splat
for k in range(5):
    m.add(m.noise(.12, 300, 1500, .005, .08), E['step2.pigeon'] + k * .2, .04)  # wings
tt = sc0['step2']
while tt < scEnd['step2']:
    m.add(m.tone(2600, .03, .001, .02), tt, .015)  # the wall clock, exactly the same
    tt += 1.0

# ---------- the teacher ----------
m.sting(E['step3.smile'], .14)
m.add(m.tone(55, 2.5, .05, 2.0), E['step3.wait'], .14, bed=True)

# ---------- day 100 ----------
school_bell(E['step4.bell'] - .2)
m.steps(E['step4.bell'] + .3, E['step4.grip'] + .5, .15, .04)  # everyone running out
m.add(m.noise(.4, 300, 2000, .02, .2), E['step4.grip'], .06)  # gripping the desk
m.heartbeat(E['step4.wait'], CUT, bpm=112, gain=.15)

# ---------- the door, the key ----------
m.add(m.creak(1.4, 30, 22), E['end.close'] - .3, .07)
m.add(m.layer(m.hit(150, 80, .2, .05), m.noise(.1, 200, 1500, .005, .08)), E['end.slow'] + .5, .1)
m.add(m.layer(m.metal(900, .4, .1) * .5, m.hit(500, 300, .05, .02)), E['end.lock'], .14)  # click
m.sting(E['end.smile'], .2)
m.add(m.tone(55, 2.5, .05, 2.0), E['end.last'], .18, bed=True)

m.finish('--voice' in sys.argv)

# Music + SFX for «Mides 2 centímetros». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=97)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd

# ---------- music: a playful, plucky adventure that turns tense at the end ----------
pluck = lambda f: m.tone(f, .4, .002, .12, (1, 2, 3))
adv = [(523.3, 1), (659.3, 1), (784, 1), (659.3, 1), (587.3, 1), (698.5, 1), (880, 2), (784, 1), (698.5, 1), (659.3, 1), (587.3, 1), (523.3, 2)]
m.melody(adv, .2, sc0['step5'], .2, .035, pan=.2, inst=pluck)
m.melody([(130.8, 2), (174.6, 2), (196, 2), (164.8, 2)], .2, sc0['step5'], .4, .05, pan=-.2, inst=lambda f: m.tone(f, .8, .005, .3, (1, 2)))
m.drone([(55, .5), (82.4, .3), (110, .2), (116.5, .12)], sc0['step5'], gain=.08, rise=(sc0['leo'], 8))
m.pulses(sc0['leo'], sc0['hand'], end=CUT - .3)
m.riser(sc0['hand'], CUT, gain=.32)
m.whooshes_and_pops()

# ---------- intro: the camera dives towards the bed ----------
m.add(m.sweep(1200, 200, 1.6, .9), E['intro.zoom'], .08)
m.ding(E['intro.zoom'] + .7, .06, 1568)
m.whoosh(sc0['id'], .1)
m.add(m.sweep(800, 200, .5, .3), E['id.now'], .1)

# ---------- wake: everything is huge, her voice a mosquito ----------
m.amb(m.bed_noise(40, 300), sc0['wake'], sc0['step2'], .03)  # the room's air, now a rumble
m.add(m.sweep(2400, 2600, 1.5, 1.0) * .3, E['wake.mosq'] - .3, .05)

# ---------- step1: the duvet falls, the jump ----------
m.add(m.noise(1.0, 60, 800, .6, .3), E['step1.drop'] - .6, .25)
m.boom(E['step1.drop'], .5, 1.6)
m.steps(E['step1.run'], E['step1.jump'], .12, .04, hi=4000)
m.whoosh(E['step1.jump'], .12)
m.add(m.hit(200, 90, .3, .06), E['step1.land'], .3)

# ---------- step2: the cat ----------
purr = m.band(m.rnd.standard_normal(N), 30, 200) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 25 * t)))
m.amb(purr, sc0['step2'], E['step2.seen'], .05)
m.add(m.sung(320, .9, (700, 1300)), E['step2.seen'], .12)  # a "mrrow?"
m.sting(E['step2.seen'] + .1, .2)
m.add(m.noise(.4, 300, 3000, .02, .15), E['step2.claw'], .15)
for k in range(4):
    m.add(m.noise(.15, 1500, 6000, .002, .05), E['step2.claw'] + .3 + k * .45, .07)  # claws on the floor
m.heartbeat(E['step2.claw'], E['step2.bored'], bpm=120, gain=.15)

# ---------- step3: kitchen ----------
m.amb(m.bed_noise(50, 400), sc0['step3'], sc0['step4'], .03)  # the fridge
m.add(m.sweep(800, 1600, .25, .1), E['step3.drop'], .08)
m.steps(E['step3.climb'], scEnd['step3'], .3, .04, lo=300, hi=3000)

# ---------- step4: jumping on the keyboard ----------
tt = E['step4.jump']
while tt < E['step4.lock'] - .1:
    m.add(m.tone(1800, .03, .001, .01), tt + .14, .05)
    tt += 1 / 3.5
m.add(m.layer(m.tone(660, .15, .002, .08), m.tone(440, .25, .002, .12)), E['step4.lock'], .12)
m.sting(E['step4.lock'] + .1, .15)

# ---------- step5: footsteps like earthquakes ----------
for k in range(3):
    m.boom(E['step5.feet'] + k * .7, .2, 1.0)
m.boom(E['step5.shoe'], .7, 1.8)
tt = E['step5.quake']
while tt < scEnd['step5'] + .2:
    m.boom(tt, .35, 1.2)
    tt += 1.05

# ---------- Leo ----------
m.add(m.sung(330, .6, (700, 1200)), sc0['leo'] + .5, .08)  # a toddler's babble
m.add(m.sung(392, .4, (500, 1500)), sc0['leo'] + 1.2, .07)
m.add(m.noise(.3, 300, 3000, .02, .1), E['leo.mouth'], .08)
m.boom(E['leo.seen'], .45)
m.heartbeat(E['leo.seen'], CUT, bpm=130, gain=.18)
m.add(m.noise(1.6, 80, 600, .8, .4), E['hand.reach'], .15)  # air pushed by the hand

m.finish('--voice' in sys.argv)

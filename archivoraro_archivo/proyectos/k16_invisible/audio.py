# Music + SFX for «Te despiertas invisible». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=173)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def splash(when, gain=.1, pan=0, big=False):
    m.add(m.layer(m.noise(.25, 300 if big else 600, 4000, .002, .15), m.hit(180 if big else 260, 90, .15, .04) * .4), when, gain, pan=pan)


# ---------- music: an airy glass shimmer for the invisible boy, then a cold low drone ----------
glass = lambda f: m.tone(f, 1.6, .02, .8, (1, 2.01, 3.02))
m.melody([(880, 2), (1046.5, 2), (987.8, 2), (784, 2), (659.3, 2), (784, 2)], 0, sc0['step3'], .4, .022, pan=.3, inst=glass)
m.drone([(65.4, .4), (98, .2), (130.8, .12)], sc0['wake'], gain=.035, until=sc0['step3'])
m.drone([(49, .6), (73.4, .3), (98, .15), (103.8, .1)], sc0['step3'], gain=.065, rise=(sc0['end'], 10))
m.pulses(sc0['step3'], sc0['end'], end=sc0['end'])
m.riser(E['end.grab'] - 1.0, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- home ----------
m.birds(0, sc0['step1'], 5)
m.add(m.sweep(1200, 300, .8, .4), E['intro.inv'] - .3, .06)  # fading out
m.whoosh(sc0['id'], .1)
m.add(m.tone(1568, .5, .002, .3, (1, 2.4)), E['id.nobody'], .03)
for k in ('wake.face', 'wake.hands', 'wake.pj'):
    m.add(m.tone(330, .25, .002, .15, (1, 2)), E[k], .04)
m.add(m.layer(m.hit(500, 300, .06, .02), m.noise(.04, 1500, 5000, .002, .02)), E['wake.ouch'], .12)

# ---------- kitchen ----------
m.amb(m.bed_noise(300, 2500, .3, .4), sc0['step1'], sc0['step3'], .012)
m.steps(E['step1.mum'] - .5, E['step1.pass'] + .3, .4, .05, pan=.3)
m.add(m.sweep(500, 700, .6, .3), E['step1.wave'], .03)
m.add(m.noise(.3, 800, 3000, .02, .15), E['step2.take'], .05)  # cookie jar
m.add(m.layer(m.sung(900, 1.6, (1000, 2200)), m.sung(950, 1.6, (1000, 2200)) * .6), E['step2.scream'], .07)  # the scream
m.add(m.layer(m.hit(900, 600, .05, .02), m.noise(.05, 1500, 5000, .002, .03)), E['step2.drop'] + .4, .1)  # cookie on the floor
m.add(m.layer(m.hit(150, 80, .2, .05), m.noise(.1, 200, 1500, .005, .08)), E['step2.out'] + .6, .08)  # front door

# ---------- outside: things moving by themselves ----------
m.birds(sc0['step3'], E['step3.puddles'], 4)
tt = E['step3.swing']
while tt < E['step3.puddles']:
    m.add(m.creak(.5, 40, 30), tt, .05, pan=.4)
    tt += 1.2
m.add(m.creak(1.0, 30, 22), E['step3.door'], .07, pan=-.4)
for i in range(6):
    splash(E['step3.prints'] + i * .45, .1 if E['step3.prints'] + i * .45 < E['step3.big'] else .14, pan=-.5 + i * .2, big=E['step3.prints'] + i * .45 > E['step3.big'])
m.sting(E['step3.same'], .16)

# ---------- the bench ----------
m.amb(m.bed_noise(150, 1200, .4, .25), sc0['step4'], CUT, .03)  # wind in the park
m.heartbeat(E['step4.still'], CUT, bpm=112, gain=.15)
for k, w in enumerate(E['end.p']):
    splash(w, .14 + k * .03, pan=-.3 + k * .1, big=True)
m.add(m.tone(55, 2.5, .05, 2.0), E['end.stop'], .16, bed=True)
m.add(m.noise(.8, 200, 1500, .1, .5), E['end.grab'], .06)
m.sting(E['end.grab'] + .05, .25)
m.add(m.sweep(400, 200, 1.6, 1.0), E['end.cold'], .03)

m.finish('--voice' in sys.argv)

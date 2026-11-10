# Music + SFX for «El escondite». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=61)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd

# ---------- music ----------
party = [(523.3, 1), (659.3, 1), (784, 1), (659.3, 1), (698.5, 1), (880, 1), (784, 2), (659.3, 1), (587.3, 1), (523.3, 2)]
m.melody(party, 0, E['intro.vanish'], .22, .07, pan=.2)
m.drone([(55, .5), (82.4, .3), (110, .2), (116.5, .1)], E['intro.vanish'], gain=.07, rise=(sc0['rule2'], 25))
# the party tune again in the empty house: slow and out of tune
slow = [(f * .97, d) for f, d in party]
m.melody(slow, sc0['empty'] + .3, sc0['note'], .5, .045, pan=-.2)
m.pulses(sc0['rule2'], sc0['steps'], end=CUT - .3)
m.riser(sc0['final'], CUT, gain=.3)
m.whooshes_and_pops()

# ---------- intro: party, then everyone pops out of existence ----------
for k in range(12):
    m.add(m.tone(1400 + 300 * (k % 3), .05, .002, .02), .3 + k * .25, .02)  # little party noises
for k in range(5):
    m.add(m.layer(m.sweep(900, 300, .12, .05), m.noise(.05, 1000, 6000, .001, .015)), E['intro.vanish'] + k * .08, .16, pan=-.6 + k * .3)
m.boom(E['intro.empty'], .25, 1.4)

# ---------- id ----------
m.whoosh(sc0['id'], .1)
m.ding(E['id.never'], .07, 1319)

# ---------- hide ----------
m.add(m.creak(.6, 30, 18), sc0['hide'] + .3, .15)
blip = m.tone(660, .08, .002, .04)
tt = E['hide.count']
while tt < E['hide.done']:
    m.add(blip, tt, .03, pan=-.3)
    tt += .18
m.ding(E['hide.done'], .08, 880)
m.add(m.tone(55, 2.5, .3, 1.5), E['hide.none'], .15, bed=True)

# ---------- empty house ----------
m.amb(m.bed_noise(80, 500), sc0['empty'], sc0['note'], .02)
m.add(m.layer(m.tone(220, 1.6, .01, .8), m.tone(233.1, 1.6, .01, .8)), E['empty.vacia'], .1)
m.sting(E['empty.phones'], .15)
m.ringtone(E['empty.ring'], sc0['note'] - .1, gain=.05)

# ---------- note ----------
m.add(m.noise(.3, 2000, 8000, .02, .08), sc0['note'] + .1, .08)
m.boom(E['note.read'] + .1, .35)

# ---------- rule1: a street where nothing moves ----------
m.amb(m.bed_noise(200, 1500, .4, .7), sc0['rule1'], sc0['rule2'], .03)
h = m.layer(m.tone(587.3, .8, .005, .4, (1, 2, 3)), m.tone(784, .8, .005, .4, (1, 2)))
for k, dl in enumerate((0, .4, .8)):
    m.add(h, E['rule1.shout'] + dl, .08 * .5 ** k, pan=(-.3, .4, -.5)[k])

# ---------- rule2: something counts in the corridor ----------
a, b = E['rule2.nums']
for k in range(3):
    m.add(m.sung(98 * (1.0 - .03 * k), .45, (500, 900)), a + k * (b - a) / 3, .2, pan=.5)
m.sting(E['rule2.notm'], .2)
m.boom(E['rule2.adult'], .4)

# ---------- rule3: running upstairs, into the wardrobe ----------
m.steps(E['rule3.run'], E['rule3.inside'], .14, .12, pan=-.2, hi=2500)
m.add(m.layer(m.hit(120, 50, .4, .08), m.noise(.08, 300, 3000, .001, .03)), E['rule3.inside'] + .3, .3)
for k in range(2):
    m.add(m.sung(92, .5, (500, 900)), E['rule3.nums'] + k * .7, .14, pan=.4)

# ---------- steps: footsteps on the wooden stairs, then right outside ----------
tt, k = E['steps.steps'], 0
while tt < E['steps.stop']:
    near = (tt - E['steps.steps']) / max(.1, E['steps.stop'] - E['steps.steps'])
    m.add(m.layer(m.step(100, 1200), m.creak(.25, 40, 25) * .3), tt, .06 + .14 * near, pan=.3 - .3 * near)
    tt += .62
m.heartbeat(E['steps.stop'], CUT - .1, bpm=100, gain=.18)
m.add(m.sung(90, .6, (500, 900)), E['steps.near'] + .4, .25)

# ---------- final: 98, 99 right outside the door ----------
for key in ('final.n98', 'final.n99'):
    m.add(m.sung(88, .8, (500, 900)), E[key], .35)
m.add(m.creak(1.0, 22, 12), E['final.n99'] + .3, .12)

m.finish('--voice' in sys.argv)

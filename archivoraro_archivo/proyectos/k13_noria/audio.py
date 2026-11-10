# Music + SFX for «Atrapada en lo alto de la noria». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=157)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def creak(when, gain=.1):
    m.add(m.creak(.7, 34, 24), when, gain)


# ---------- music: a fairground organ waltz that winds down and stops; then the night ----------
organ = lambda f: m.tone(f, .45, .01, .2, (1, 2, 3, 4, 6))
waltz = [(392, 1), (493.9, 1), (587.3, 1), (523.3, 1), (440, 1), (523.3, 1), (493.9, 1), (392, 1), (440, 1)]
m.melody(waltz, 0, E['stuck.silence'], .33, .03, pan=-.2, inst=organ)
m.melody([(98, 3), (146.8, 3), (130.8, 3), (98, 3)], 0, E['stuck.silence'], .33, .03, inst=lambda f: m.tone(f, .6, .01, .3, (1, 2)))
m.add(m.sweep(392, 180, 1.2, .9), E['stuck.silence'] - .3, .03)  # the organ dies
m.drone([(49, .5), (73.4, .25), (98, .15), (103.8, .1)], E['stuck.silence'], gain=.06, rise=(sc0['climb'], 12))
m.melody([(783.99, 2), (739.99, 2), (698.46, 2), (659.26, 2)], sc0['step4'], sc0['end'], .5, .015, pan=.3, inst=m.musicbox)
m.pulses(sc0['climb'], sc0['end'], end=sc0['end'])
m.riser(sc0['end'] - .3, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- the fair ----------
m.amb(m.bed_noise(300, 3000, .4, 1.2), 0, E['stuck.off'], .03)  # crowd chatter
m.amb(m.bed_noise(60, 500, .3, .3), 0, E['stuck.stop'], .03)  # the wheel's motor
m.whoosh(sc0['id'], .1)
m.add(m.sweep(140, 40, 1.6, 1.0), E['stuck.stop'] - .5, .1)  # motor winding down
m.add(m.layer(m.metal(300, 1.0, .4), m.hit(200, 120, .1, .03)), E['stuck.clac'], .25)
for k in range(4):
    m.add(m.layer(m.hit(400, 300, .05, .01), m.noise(.02, 2000, 6000, .001, .006)), E['stuck.off'] + k * .55, .08, pan=(-.6, -.2, .3, .7)[k])  # lights off
m.amb(m.bed_noise(200, 1500, .5, .25), E['stuck.silence'], CUT, .03)  # wind up high

# ---------- the swinging cabin ----------
creak(E['step1.sway'], .12)
creak(E['step1.creak'], .15)
creak(E['step1.fwd'], .08)
creak(E['step1.back'], .08)
m.heartbeat(E['step1.creak'], scEnd['step1'], bpm=100, gain=.1)

# ---------- the booth ----------
m.amb(np.sin(2 * np.pi * 100 * t) * .4, sc0['step2'], E['step2.shout'], .01)
m.sting(E['step2.none'], .14)
m.add(m.echo(m.sung(420, .6, (750, 1300)), (.4, .8, 1.2), .45), E['step2.shout'] + .3, .06)  # her shout echoing
m.sting(E['step2.nobody'], .12)

# ---------- SOS ----------
tt = E['step3.s1']
for d in (.12, .12, .12, .4, .4, .4, .12, .12, .12):
    m.add(m.tone(880, d, .005, .02), tt, .03)
    tt += d + .14
m.add(m.layer(*[m.tone(f, 1.5, .01, .8, (1, 2)) for f in (523.3, 659.3, 784)]), E['step3.answer'], .05)

# ---------- Pipo climbs ----------
m.steps(sc0['climb'], E['climb.mascot'], .5, .04, pan=.4)
m.sting(E['climb.balloon'], .14)
tt = E['climb.climb']
gap = .45
while tt < CUT:
    m.add(m.layer(m.metal(260 + 40 * m.rnd.random(), .25, .08) * .6, m.hit(300, 200, .05, .02)), tt, .1, pan=.3)
    tt += gap
    gap = max(.12, gap * .9)  # faster and faster
m.heartbeat(E['climb.fast'], CUT, bpm=128, gain=.16)
m.add(m.tone(55, 2.5, .05, 2.0), E['end.smile'], .2, bed=True)
m.sting(E['end.smile'], .25)

m.finish('--voice' in sys.argv)

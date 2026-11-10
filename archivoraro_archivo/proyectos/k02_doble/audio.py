# Music + SFX for «Tu doble en clase». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=71)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd

# ---------- music ----------
m.drone([(65.4, .5), (98, .3), (130.8, .2), (138.6, .1)], 0, gain=.06, rise=(sc0['recreo'], 25))
m.melody([(659.3, 1), (622.3, 1), (659.3, 1), (493.9, 1), (587.3, 1), (523.3, 1), (440, 2)], sc0['door'], sc0['rule3'], .45, .03, pan=.3)
m.pulses(sc0['rule3'], sc0['run'], end=CUT - .3)
m.riser(sc0['teacher'], CUT, gain=.3)
m.whooshes_and_pops()

# ---------- intro: late for school ----------
m.birds(0, E['intro.door'], 8)
m.amb(m.bed_noise(60, 600), 0, E['intro.door'], .03)
m.steps(.1, E['intro.door'], .2, .08, hi=2500)
bell = m.layer(*[m.tone(f, 1.6, .002, .8, (1, 2.4)) for f in (880, 1108.7)])
m.add(bell, E['intro.door'] - .5, .08)
murmur = m.bed_noise(250, 2000, .5, 1.3)
for a, b in [(E['intro.door'], sc0['id']), (sc0['door'], sc0['rule1'])]:
    m.amb(murmur, a, b, .025)
m.sting(E['intro.seat'], .18)

# ---------- id / door ----------
m.whoosh(sc0['id'], .1)
m.add(m.tone(330, .4, .002, .2, (1, 2)), E['id.late'], .08)
for k in range(3):
    m.ding(E['door.same'] + k * .85, .05, 1175 + k * 150)
m.sting(E['door.smile'], .2, (196, 207.7, 293.7))

# ---------- rule1 ----------
m.whoosh(E['rule1.both'], .12, .6)
sh = m.norm(m.band(m.rnd.standard_normal(int(1.2 * SR)), 3000, 9000)) * np.linspace(1, 0, int(1.2 * SR)) ** 2
m.add(sh, E['rule1.you'], .1)
m.boom(E['rule1.you'] + .1, .4)

# ---------- rule2: the phone call from the toilets ----------
for k in range(6):
    m.add(m.tone(1400 + 200 * m.rnd.random(), .06, .001, .03), sc0['rule2'] + .8 + k * 1.3, .03)  # drips
for k in range(2):
    m.add(m.layer(m.tone(425, .8, .01, 5)), E['rule2.call'] + .2 + k * 1.2, .04)  # ringing tone
m.amb(m.bed_noise(300, 3400), E['rule2.mom'][0], E['rule2.mom'][1], .015)
m.sting(E['rule2.before'], .22)

# ---------- rule3 ----------
m.add(m.sweep(110, 330, 1.8, 1.0), sc0['rule3'] + .2, .08)
m.add(m.tone(294, .5, .002, .2, (1, 2)), E['rule3.ask'], .05)

# ---------- playground ----------
yard = m.bed_noise(300, 3000, .6, 2.1)
m.amb(yard, sc0['recreo'], E['recreo.blink'] - .1, .03)
m.amb(yard, E['recreo.blink'] + 1.0, sc0['run'], .02)
for k in range(8):
    m.add(m.hit(140, 70, .12, .03), sc0['recreo'] + .4 + k * .55, .12, pan=.5)  # a ball bouncing
m.add(m.tone(4200, 2.2, .05, 1.5), E['recreo.blink'], .03)  # sudden ringing silence
m.boom(E['recreo.blink'], .3)
m.steps(E['stare.walk'], scEnd['stare'], .45, .1)
m.heartbeat(E['stare.turn'], scEnd['stare'], bpm=110, gain=.15)

# ---------- run ----------
m.steps(sc0['run'], scEnd['run'], .16, .12, echo=True, hi=2500)

# ---------- class: everyone turns to the door ----------
m.add(m.creak(.8, 28, 16), E['class.open'], .12)
for k in range(10):
    m.add(m.noise(.25, 150, 1200, .02, .1), E['class.turn'] + k * .04, .03, pan=m.rnd.uniform(-.7, .7))  # chairs
m.whoosh(E['class.hand'], .08)
m.heartbeat(E['class.say'], CUT, bpm=120, gain=.16)

# ---------- teacher: a chair scrapes, heels on the floor ----------
m.add(m.noise(.4, 300, 2000, .02, .15), E['teacher.up'] - .2, .08)
tt = E['teacher.walk']
k = 0
while tt < CUT - .1:
    m.add(m.layer(m.noise(.04, 1500, 6000, .001, .01), m.hit(200, 120, .05, .01) * .3), tt, .08 + .03 * k)
    tt += .42
    k += 1

m.finish('--voice' in sys.argv)

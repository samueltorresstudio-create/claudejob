# Music + SFX for «Desaparecen los adultos · Parte 3». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=223)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def grind(a, b, step=.38, gain=.1):  # the padlock being turned
    tt = a
    while tt < b:
        m.add(m.layer(m.metal(900, .15, .05) * .5, m.noise(.04, 1200, 5000, .002, .02)), tt, gain, pan=.2)
        tt += step


# ---------- music: a ticking-clock suspense line through the day, the cold drone when the sun goes down ----------
pluck = lambda f: m.tone(f, .3, .003, .12, (1, 2))
m.melody([(220, 1), (0, 1), (261.6, 1), (220, 1), (246.9, 1), (0, 1), (196, 1), (220, 1)], sc0['dani'], sc0['sunset'], .3, .05, inst=pluck)
m.drone([(55, .5), (82.4, .25), (110, .12), (116.5, .08)], 0, gain=.04, until=sc0['sunset'], rise=(sc0['step3'], 10))
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], sc0['sunset'], gain=.075, rise=(sc0['end'], 8))
m.pulses(sc0['step3'], sc0['ask'], end=sc0['ask'])
m.riser(sc0['behind'] - .2, CUT, gain=.32)
m.whooshes_and_pops()
tt = 0.0
while tt < sc0['sunset']:
    m.add(m.tone(2600, .03, .001, .02), tt, .012)  # the countdown clock
    tt += .5

# ---------- breakfast: the scan along the table ----------
m.amb(m.bed_noise(300, 3000, .5, 1.5), 0, sc0['gate'], .018)  # kids chatting
m.add(m.sweep(400, 1800, 1.6, 1.2), .3, .03)  # scanner
m.sting(E['intro.not'], .16)
m.add(m.tone(1568, .5, .002, .3, (1, 2)), E['intro.sun'], .04)
m.amb(m.bed_noise(2500, 7000, .6, 3.5), sc0['gate'], sc0['part'], .006)  # crickets
m.boom(sc0['gate'] + .05, .25, 1.4)
m.add(m.layer(m.metal(500, .4, .2) * .5, m.hit(400, 250, .05, .02)), E['gate.open'], .1)
m.boom(sc0['part'] + .05, .25, 1.4)
m.sting(E['part.three'], .14)

# ---------- Dani, the bread, the stare ----------
m.amb(m.bed_noise(300, 3000, .5, 1.5), sc0['dani'], sc0['step2'], .016)
m.add(m.tone(98, 1.5, .02, 1.2), E['dani.name'], .1, bed=True)
m.add(m.noise(.7, 200, 1500, .05, .4), E['step1.bread'] - .5, .05)  # bread sliding across the table
m.sting(E['step1.stare'], .12)

# ---------- blinking ----------
for k in range(4):
    m.add(m.tone(2400, .03, .001, .02), sc0['step2'] + .3 + k * .5, .03)
m.ding(E['watch.blinks'], .06, 1318.5)
m.sting(E['pol.noblink'], .14)
for k in range(6):
    m.add(m.tone(880 + (k % 3) * 220, .08, .002, .05), sc0['pol'] + .4 + k * .25, .02, pan=.4)  # console bleeps
m.add(m.hit(200, 90, .2, .05), E['pol.turn'], .16)
m.add(m.layer(*[m.tone(f, 1.2, .01, .6, (1, 2)) for f in (523.3, 659.3, 784)]), E['pol.false_'], .04)  # relief

# ---------- the question ----------
m.ding(E['step3.right'], .06, 1046.5)
m.add(m.tone(73.4, 2, .05, 1.5), E['step3.lost'], .12, bed=True)

# ---------- sunset, the run, Alba ----------
m.add(m.sweep(600, 120, 2.5, 1.5), sc0['sunset'], .05)
m.steps(sc0['run'], sc0['ask'], .22, .06, echo=True)
m.heartbeat(sc0['run'], CUT, bpm=116, gain=.15)
for k in range(5):
    m.add(m.tone(900 + 220 * k, .12, .002, .06), E['ask.fish'] + .1 + k * .15, .015)
m.add(m.tone(55, 3, .05, 2.4), E['end.smile'], .16, bed=True)
m.sting(E['end.none'], .22)
m.add(m.creak(1.2, 30, 20), sc0['behind'] - .2, .06)  # the classroom door
m.boom(E['behind.wrong'], .3, 1.6)

# ---------- outside: the padlock ----------
m.amb(m.bed_noise(2500, 7000, .6, 3.5), sc0['lock'], CUT, .006)
grind(E['lock.turn'], CUT)

m.finish('--voice' in sys.argv)

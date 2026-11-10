# Music + SFX for «La gravedad se apaga 60 segundos». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=101)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd
off = E['off.start']

# ---------- music: a weightless shimmering pad, a clock ticking down the minute ----------
m.drone([(110, .3), (164.8, .25), (220, .2), (329.6, .12)], off, gain=.06, until=E['leash.clip'])
glass = lambda f: m.tone(f, 1.8, .02, .9, (1, 2.01, 3.02))
m.melody([(880, 2), (1046.5, 2), (987.8, 2), (784, 2)], off + .5, E['leash.clip'], .5, .025, pan=.3, inst=glass)
m.drone([(55, .5), (82.4, .3), (110, .2), (116.5, .12)], E['leash.clip'], gain=.08, rise=(sc0['up'], 6))
m.pulses(E['leash.clip'], sc0['up'], end=CUT - .3)
m.riser(sc0['final'] - 1.0, CUT, gain=.32)
m.whooshes_and_pops()
tt = off
while tt < CUT - .2:
    m.add(m.noise(.025, 2500, 7000, .001, .007), tt, .03 if tt < sc0['leash'] else .05, bed=True)
    tt += .5

# ---------- the park before ----------
m.birds(0, off, 9)
m.amb(m.bed_noise(60, 700), 0, off, .03)
m.steps(.1, sc0['id'], .35, .04)
bell = m.layer(*[m.tone(f, 2.0, .002, 1.0, (1, 2.4)) for f in (523.3, 659.3)])
m.add(bell, E['intro.clock'], .08)
m.whoosh(sc0['id'], .1)

# ---------- gravity switches off ----------
m.add(m.sweep(220, 900, 1.6, 1.2), E['off.lift'] - .3, .12)
m.add(m.noise(1.2, 200, 3000, .4, .5), E['off.lift'], .06)
for k in range(6):
    m.add(m.tone(1400 + 200 * k, .4, .01, .25, (1, 2)), E['off.water'] + k * .15, .03)  # water drops floating
m.add(m.layer(m.metal(140, 1.6, .6) * .5, m.noise(.6, 100, 900, .05, .3)), E['off.car'], .2)
m.amb(m.bed_noise(300, 2500, .5, 1.2), E['off.people'], E['rule2.gone'] + 1, .03)  # the crowd rising
m.amb(m.bed_noise(200, 1500, .3, .4), off, CUT, .02)  # wind

# ---------- steps ----------
m.add(m.layer(m.metal(500, .6, .2) * .4, m.hit(150, 80, .2, .05)), E['rule1.grab'], .25)
m.add(m.sweep(300, 1200, 2.2, 1.4), E['rule2.man'], .1)
m.sting(E['rule2.gone'], .15)
m.whoosh(E['rule3.drop'], .1)
m.add(m.layer(m.metal(500, .6, .2) * .4, m.hit(150, 80, .2, .05)), E['rule4.hug'], .2)

# ---------- the leash: barking, letting go ----------
m.add(m.layer(m.hit(400, 300, .05, .01), m.noise(.03, 2000, 6000, .001, .01)), E['leash.clip'], .3)  # the clip opens
m.sting(E['leash.clip'] + .05, .2)
for k in range(6):
    b = m.layer(m.sung(520, .18, (900, 1700)), m.noise(.08, 600, 3000, .002, .03) * .5)
    m.add(b, E['leash.bark'] + k * .5, .12, pan=.4)
m.whoosh(E['leash.push'], .2, .6)

# ---------- up high ----------
m.amb(m.bed_noise(150, 1200, .5, .5), sc0['up'], CUT, .05)
m.boom(E['up.m40'], .45)
m.heartbeat(E['up.down'], CUT, bpm=125, gain=.16)
for key in ('final.n3', 'final.n2', 'final.n1'):
    m.add(m.layer(m.hit(90, 40, .6, .15), m.tone(880, .5, .002, .25, (1, 2)) * .35), E[key], .45)

m.finish('--voice' in sys.argv)

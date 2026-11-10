# Music + SFX for «Un millón en la mochila». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=181)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def zip_(when, gain=.08):
    n = int(.5 * SR)
    sig = m.band(m.rnd.standard_normal(n), 2000, 8000) * (np.sin(np.linspace(0, 60, n)) > 0) * np.linspace(1, .4, n)
    m.add(sig, when, gain)


def riffle(when, dur=1.2, gain=.05):  # counting banknotes
    tt = when
    while tt < when + dur:
        m.add(m.noise(.03, 2000, 7000, .001, .015), tt, gain * m.rnd.uniform(.6, 1))
        tt += .045


def keys(when, gain=.08):
    for k in range(5):
        m.add(m.tone(3200 + 400 * m.rnd.random(), .12, .001, .08, (1, 2.7)), when + k * .07, gain * m.rnd.uniform(.5, 1))


# ---------- music: a cool heist bassline, then just a drone and a ticking clock ----------
pluck = lambda f: m.tone(f, .3, .003, .12, (1, 2))
m.melody([(110, 1), (0, 1), (130.8, 1), (110, 1), (146.8, 1), (0, 1), (130.8, 1), (98, 1)], sc0['open'], sc0['night'], .25, .06, inst=pluck)
m.melody([(659.3, 3), (587.3, 1), (523.3, 4)], sc0['open'] + .5, sc0['night'], .25, .015, pan=.3, inst=m.musicbox)
m.drone([(55, .5), (82.4, .25), (110, .12), (116.5, .08)], sc0['step1'], gain=.04, rise=(sc0['step4'], 10))
m.drone([(46.2, .6), (69.3, .3), (92.5, .15)], sc0['night'], gain=.065)
m.pulses(sc0['night'], sc0['end'], end=sc0['end'])
m.riser(sc0['end'] - .3, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- the backpack ----------
m.amb(m.bed_noise(100, 900, .3, .2), 0, CUT, .012)
zip_(E['intro.open'])
riffle(E['intro.million'], 1.0, .05)
m.whoosh(sc0['id'], .1)
m.add(m.tone(1568, .4, .002, .2), E['id.berry'], .03)
zip_(E['open.open'])
m.sting(E['open.money'], .14)
riffle(E['open.count'], 2.0, .04)
m.add(m.layer(*[m.tone(f, 1.2, .01, .6, (1, 2)) for f in (523.3, 659.3, 784, 1046.5)]), E['open.exact'], .04)
m.sting(E['open.noberry'], .14)

# ---------- don't tell, don't spend ----------
m.add(m.tone(1318.5, .15, .002, .08), E['step1.friend'] - .4, .04)  # message arrives
for k in range(4):
    m.add(m.noise(.03, 3000, 7000, .001, .01), E['step1.friend'] + k * .12, .03)  # typing «nada»
m.steps(E['step1.someone'] - 1, scEnd['step1'], .55, .04, pan=.3, echo=True)
m.sting(E['step2.mark'], .14)
m.add(m.noise(.8, 200, 1500, .05, .4), E['step2.hide'], .07)  # sliding under the bed

# ---------- the bus ----------
m.amb(m.bed_noise(60, 500, .4, 1.5), E['step3.bus'], scEnd['step3'], .05)  # engine
m.add(m.layer(m.tone(880, .3, .005, .2), m.tone(660, .3, .005, .2)), E['step3.off'] - .2, .04)  # stop bell
m.add(m.noise(.6, 300, 2500, .05, .3), E['step3.off'], .06)  # doors
m.sting(E['step3.keys'], .2)
keys(E['step3.keys'] + .1, .06)

# ---------- home alone ----------
m.amb(m.bed_noise(400, 3000, .5, 2.5), sc0['night'], E['night.bell'], .008)  # TV murmuring
tt = sc0['step4']
while tt < CUT:
    m.add(m.tone(2400, .03, .001, .02), tt, .012)  # wall clock
    tt += 1.0
m.add(m.tone(784, .8, .005, .5, (1, 2)), E['night.bell'], .1)
m.add(m.tone(622.3, 1.0, .005, .6, (1, 2)), E['night.bell'] + .5, .1)
m.heartbeat(E['night.bell'] + .5, CUT, bpm=120, gain=.16)
m.add(m.tone(55, 2.5, .05, 2.0), E['peep.berry'], .16, bed=True)
m.sting(E['peep.berry'], .2)
keys(E['end.keys'], .09)
m.add(m.layer(m.metal(900, .4, .1) * .5, m.noise(.15, 1000, 5000, .002, .08)), E['end.turn'], .14)  # the key goes in
m.add(m.layer(m.metal(700, .5, .15) * .5, m.hit(500, 300, .05, .02)), E['end.turn'] + .7, .14)  # and turns

m.finish('--voice' in sys.argv)

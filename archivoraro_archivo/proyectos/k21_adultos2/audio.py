# Music + SFX for «Desaparecen los adultos · Parte 2». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=211)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def click():
    return m.layer(m.hit(1800, 1200, .04, .01), m.noise(.02, 2000, 8000, .001, .006))


def grind(a, b, step=.38, gain=.1):  # the padlock being turned
    tt = a
    while tt < b:
        m.add(m.layer(m.metal(900, .15, .05) * .5, m.noise(.04, 1200, 5000, .002, .02)), tt, gain, pan=.2)
        tt += step


# ---------- music: the cold night drone, a warm glockenspiel at sunrise, then breakfast... and the drone again ----------
glock = lambda f: m.tone(f, .7, .002, .35, (1, 2.76, 5.4))
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], 0, gain=.07, until=E['dawn.light'], rise=(sc0['more'], 8))
m.pulses(sc0['step1'], sc0['dawn'], end=E['dawn.light'])
m.melody([(523.3, 1), (659.3, 1), (784, 2), (659.3, 1), (587.3, 1), (523.3, 2)], E['dawn.light'], E['count.n1'], .34, .022, pan=.2, inst=glock)
m.drone([(65.4, .4), (98, .2), (130.8, .15)], E['dawn.light'], gain=.03, until=E['count.n16'])
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], E['count.n16'], gain=.08, rise=(sc0['end'], 6))
m.riser(sc0['end'] - .2, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- night outside: crickets, wind, the padlock ----------
m.amb(m.bed_noise(2500, 7000, .6, 3.5), 0, E['dawn.light'], .006)  # crickets
m.amb(m.bed_noise(100, 700, .4, .2), 0, E['dawn.light'], .02)  # night wind
grind(0, sc0['part'] - .1)
m.boom(sc0['part'] + .05, .25, 1.4)
m.sting(E['part.two'], .14)
for k in range(5):
    m.add(m.tone(900 + 220 * k, .12, .002, .06), sc0['recap'] + .3 + k * .17, .02)  # bubbles in the bowl
m.add(m.layer(m.tone(110, .5, .01, .3, (1, 2)), m.tone(116.5, .5, .01, .3, (1, 2))), E['recap.no'], .12)  # wrong answer
grind(E['recap.turn'] - .3, sc0['step1'] - .1, .3, .12)

# ---------- the lights go out ----------
hum = np.sin(2 * np.pi * 100 * t) * .5 + np.sin(2 * np.pi * 200 * t) * .3
m.amb(m.band(hum, 80, 1200), sc0['step1'], E['step1.off'], .012)  # fluorescent hum
m.add(m.layer(click(), m.hit(300, 120, .08, .02)), E['step1.off'], .5)
m.add(m.sweep(400, 60, .8, .6), E['step1.off'] + .05, .06)  # lights dying
m.add(m.tone(55, 2.5, .05, 2.0), E['listen.still'], .14, bed=True)
m.sting(E['listen.listen'], .1)

# ---------- names in the dark ----------
m.add(m.noise(.8, 2000, 6000, .05, .5), E['step2.no'], .02)  # «shhh»
m.heartbeat(E['call.lucas'], sc0['step3'], bpm=104, gain=.12)
m.sting(E['hide.cover'], .1)

# ---------- the torch and the ones who don't blink ----------
m.add(click(), E['torch.on'] - .1, .4)
for k in range(6):
    m.add(m.tone(2400, .03, .001, .02), E['torch.blink'] - .4 + k * .6, .03)  # the seconds counter
m.sting(E['more.alone'], .16)
m.add(m.layer(m.tone(73.4, 2, .05, 1.5), m.noise(.6, 200, 1200, .05, .4) * .4), E['more.man'], .1)
m.add(m.layer(m.tone(69.3, 2, .05, 1.5), m.noise(.6, 200, 1200, .05, .4) * .4), E['more.doc'], .1)
m.boom(E['more.smile'], .3, 1.6)
m.heartbeat(E['more.all'], sc0['dawn'], bpm=118, gain=.15)

# ---------- the long night, the sunrise ----------
tt = sc0['step4'] + .2
while tt < sc0['dawn']:
    m.add(m.tone(2600, .03, .001, .02), tt, .03)  # the clock racing
    tt += .12
m.add(m.sweep(300, 1600, 1.4, 1.0), E['dawn.light'] - .2, .04)  # shimmer as they fade
m.birds(E['dawn.light'], sc0['count'], 5)
m.add(m.layer(*[m.tone(f, 2.5, .3, 1.8, (1, 2)) for f in (261.6, 329.6, 392)]), E['safe.breath'], .05)  # relief

# ---------- breakfast: counting ----------
m.amb(m.bed_noise(300, 3000, .5, 1.5), sc0['count'], E['count.n16'], .02)  # kids chatting
for k in range(8):
    m.add(m.layer(m.metal(2600 + 300 * (k % 3), .2, .08) * .4), sc0['count'] + .5 + k * .9, .03, pan=(-.4, .3, -.1, .5)[k % 4])  # spoons on bowls
pops = [E['count.n1'], E['count.n2'], E['count.n3']] + [E['count.n3'] + .25 + (E['count.n14'] - .15 - E['count.n3'] - .25) * i / 10 for i in range(10)] + [E['count.n14'], E['count.n15']]
for i, p in enumerate(pops):
    m.add(m.tone(660 * 2 ** (i / 24), .12, .002, .08), p, .04)
m.add(m.layer(m.tone(98, 3, .01, 2.4, (1, 2)), m.tone(103.8, 3, .01, 2.4, (1, 2))), E['count.n16'], .16, bed=True)
m.sting(E['count.n16'] + .05, .22)
m.heartbeat(E['count.n16'] + .3, CUT, bpm=112, gain=.15)
m.add(m.noise(1.4, 2000, 6000, .05, .2), E['extra.more'] - .1, .02)  # pencil
m.add(m.layer(m.metal(500, .4, .2) * .5, m.hit(400, 250, .05, .02)), E['extra.nobody'], .1)  # the padlock, still shut
m.add(m.tone(55, 2.5, .05, 2.0), E['end.next'], .18, bed=True)

m.finish('--voice' in sys.argv)

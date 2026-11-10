# Music + SFX for «Un monstruo de 100 metros». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=113)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def roar(dur=2.4, f=55):
    r = m.sung(f, dur, (300, 600)) * .6 + m.band(m.rnd.standard_normal(int(dur * SR)), 80, 900) * .5
    return m.norm(r * np.sin(np.linspace(0, np.pi, len(r))) ** .5)


def stomp(gain=.6):
    return m.layer(m.hit(55, 22, 2.2, .7), m.noise(.5, 30, 300, .002, .25) * .5, m.noise(.15, 300, 3000, .001, .05) * .15)


# ---------- music ----------
m.drone([(41.2, .6), (61.7, .3), (82.4, .2), (87.3, .12)], 0, gain=.07, rise=(sc0['step3'], 20), until=E['step4.stop'])
m.drone([(36.7, .6), (55, .2)], E['step4.stop'], gain=.08)
m.pulses(sc0['step2'], sc0['step4'], end=E['step4.stop'])
m.riser(sc0['eye'] - .5, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- intro: the city wakes up, something rises from the sea ----------
m.amb(m.bed_noise(60, 800), 0, sc0['step2'] + 1, .03)
m.birds(0, E['intro.rise'], 4)
m.add(roar(2.8, 50), E['intro.rise'], .4)
m.boom(E['intro.rise'] + 1.0, .4)
m.whoosh(sc0['id'], .1)

# ---------- news ----------
m.melody([(784, 1), (988, 1), (1175, 1), (988, 1)], sc0['news'], E['news.cut'], .18, .03, inst=lambda f: m.tone(f, .3, .002, .1, (1, 2)))
m.add(m.layer(*[m.tone(f, .9, .005, .4, (1, 2, 3)) for f in (392, 493.9, 587.3)]), E['news.cut'], .1)  # breaking news sting
m.amb(m.bed_noise(250, 3000, .5, 4), E['news.cut'], sc0['step1'], .02)
m.add(roar(2.0, 60), E['news.port'], .2)
m.ding(E['news.tall'], .05, 659.3)
for k in range(3):
    m.add(m.layer(m.hit(80, 40, .3, .06), m.noise(.1, 100, 800, .002, .05)), E['news.army'] + k * .3, .1)
m.sting(E['news.who'], .15)

# ---------- balcony: phones flashing, the head turns ----------
tt = E['step1.phones']
while tt < E['step1.shut']:
    m.add(m.noise(.03, 3000, 8000, .001, .008), tt + m.rnd.random() * .2, .05, pan=m.rnd.uniform(-.8, .8))  # camera shutters
    tt += .25
m.add(roar(2.4, 52), E['step1.turn'], .45)
m.add(m.noise(.6, 600, 4000, .05, .2), E['step1.shut'], .1)  # curtain

# ---------- down the stairs to the car park ----------
m.steps(E['step2.down'], E['step2.park'], .2, .07, echo=True)
for q in (E['step2.shake'], E['step2.shake'] + 1.1):
    m.add(stomp(), q, .5)
m.amb(m.bed_noise(200, 1500, .5, 1.1), E['step2.park'], sc0['step3'], .02)  # neighbours whispering

# ---------- lights off, the torch ----------
m.add(m.layer(m.hit(400, 300, .05, .01), m.noise(.02, 2000, 6000, .001, .006)), E['step3.off'], .15)
m.add(m.tone(1760, .15, .002, .05), E['step3.torch'], .08)
m.sting(E['step3.torch'] + .1, .2)
m.add(stomp(), E['step3.late'], .55)
m.add(stomp(), E['step3.late'] + 1.0, .6)

# ---------- footsteps overhead ----------
m.add(stomp(), E['step4.dust'], .6)
m.add(stomp(), E['step4.alarm'], .65)
car_alarm = np.sign(np.sin(2 * np.pi * (700 + 300 * (np.sin(2 * np.pi * 2 * t) > 0)) * t)) * .3
m.amb(m.band(car_alarm, 300, 3000), E['step4.alarm'], E['step4.stop'] + .2, .025)
for b in E['step4.bums']:
    m.add(stomp(.8), b, .8)
m.add(m.tone(41.2, 3.0, .05, 2.5), E['step4.stop'], .2, bed=True)

# ---------- silence, sniffing, the eye ----------
tt = E['silence.sniff']
while tt < E['eye.open']:
    m.add(m.noise(.35, 200, 1500, .08, .12), tt, .16)
    tt += .7
m.heartbeat(sc0['silence'], CUT, bpm=115, gain=.17)
m.add(m.layer(m.creak(.6, 30, 18), m.noise(.3, 100, 800, .05, .2)), E['eye.open'], .2)  # eyelid sliding open
m.boom(E['eye.open'] + .3, .4)

m.finish('--voice' in sys.argv)

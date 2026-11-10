# Music + SFX for «El espejo con un segundo de retraso». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=149)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def tick(gain=.05, f=2600):
    return m.tone(f, .06, .001, .03, (1, 2.4))


def tape(when, gain=.06):
    m.add(m.sweep(900, 400, .5, .3) * .4 + m.noise(.5, 1500, 6000, .02, .3), when, gain)


# ---------- music: every note answered by its own echo a second late ----------
glass = lambda f: m.tone(f, 1.2, .01, .6, (1, 2.01, 3.02))
notes = [(587.3, 2), (698.5, 2), (659.3, 2), (523.3, 2)]
m.melody(notes, sc0['mirror'], sc0['morning'], .5, .03, pan=-.35, inst=glass)
m.melody(notes, sc0['mirror'] + 1.0, sc0['morning'] + 1.0, .5, .016, pan=.35, inst=glass)  # the reflection, late
m.drone([(55, .5), (82.4, .25), (110, .15), (116.5, .08)], sc0['mirror'], gain=.045, rise=(sc0['step4'], 10), until=sc0['morning'])
m.drone([(65.4, .4), (98, .2), (130.8, .12)], sc0['morning'], gain=.03, until=E['end.smile'])
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], E['end.smile'], gain=.08)
m.pulses(sc0['step3'], sc0['morning'], end=sc0['morning'])
m.riser(E['end.smile'] - .2, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- the bathroom ----------
m.amb(m.bed_noise(800, 3000, .3, .4), 0, sc0['id'], .012)  # tap running
m.amb(m.bed_noise(800, 3000, .3, .4), sc0['mirror'], sc0['step2'], .012)
for w in (E['intro.lift'], E['mirror.lift']):
    m.add(m.noise(.6, 2000, 7000, .02, .3), w + .1, .04)  # brushing
for w in (E['intro.lift'] + 1.0, E['mirror.lift'] + 1.0):
    m.add(m.noise(.6, 2000, 7000, .02, .3), w + .1, .02, pan=.5)  # ...and its echo
m.sting(E['intro.late'], .14)
m.whoosh(sc0['id'], .1)
m.sting(E['mirror.refl'], .14)

# ---------- blinks ----------
for b in E['step1.blinks']:
    m.add(tick(), b, .06, pan=-.3)
    m.add(tick(f=1900), b + 1.8, .06, pan=.4)
m.boom(E['step1.other'], .25, 1.5)

# ---------- covering the mirrors ----------
for k in ('step2.m1', 'step2.m2'):
    m.add(m.noise(.5, 300, 2500, .05, .3), E[k], .1)  # towel, sheet
for k in range(4):
    tape(E['step2.m3'] + k * .4)
m.add(m.layer(m.sung(400, .2, (700, 1300)), m.sung(450, .2, (700, 1300))), E['step2.mom'] + .4, .04)  # mum laughs

# ---------- shiny things ----------
for k in ('step3.tv', 'step3.win', 'step3.spoon'):
    m.add(m.tone(2093, .9, .005, .5, (1, 1.5)), E[k], .03)
m.add(m.tone(4186, .3, .002, .15), E['step3.spoon'] + .1, .02)  # spoon clink
m.sting(E['step3.down'], .18)

# ---------- night ----------
m.amb(m.bed_noise(100, 700, .3, .2), sc0['step4'], sc0['morning'], .02)
m.amb(np.sin(2 * np.pi * 100 * t) * .5, E['step4.hall'] - 1, sc0['morning'], .006)  # the hallway light hum
m.add(m.knock(), E['step4.wardrobe'], .08)

# ---------- the third morning ----------
m.birds(sc0['morning'], E['end.smile'], 4)
m.steps(sc0['morning'], E['morning.towel'], .5, .04)
m.add(m.noise(.6, 200, 1500, .02, .4), E['morning.towel'] - .3, .1)  # towel falls
m.sting(E['morning.floor'], .14)
m.add(m.layer(*[m.tone(f, 1.5, .01, .8, (1, 2)) for f in (523.3, 659.3, 784)]), E['morning.same'], .05)  # relief chord
m.add(m.noise(1.2, 200, 1500, .3, .6), E['morning.breathe'], .05)  # sigh

# ---------- the smile ----------
m.add(m.tone(55, 3, .05, 2.5), E['end.smile'], .2, bed=True)
m.add(m.sweep(300, 900, 1.6, 1.0), E['end.smile'], .03)
m.heartbeat(E['end.smile'], CUT, bpm=125, gain=.16)
m.sting(E['end.wide'], .25)

m.finish('--voice' in sys.argv)

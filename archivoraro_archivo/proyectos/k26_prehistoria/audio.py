# Music + SFX for «Despiertas en la prehistoria». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=261)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def drum(when, gain=.25, f=90):
    m.add(m.layer(m.hit(f, f * .5, .35, .1), m.noise(.05, 200, 1200, .002, .03)), when, gain)


# ---------- music: tribal drums + a wooden flute, a cold drone at night ----------
tt = 0.0
while tt < sc0['step1']:
    drum(tt, .1)
    drum(tt + .5, .06, 140)
    tt += 1.0
flute = lambda f: m.sung(f, .9, (600, 1400))
m.melody([(392, 2), (440, 1), (523.3, 3), (440, 1), (392, 2), (349.2, 3)], .2, sc0['museum'], .3, .02, pan=-.2, inst=flute)
m.drone([(55, .5), (82.4, .25), (110, .12)], sc0['museum'], gain=.035, until=sc0['step1'])
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], sc0['step1'], gain=.07, until=sc0['step2'])
m.melody([(523.3, 2), (587.3, 1), (659.3, 3), (587.3, 1), (523.3, 3)], sc0['step2'], sc0['step3'], .32, .02, pan=.2, inst=flute)
m.drone([(55, .5), (82.4, .25), (110, .12), (116.5, .08)], sc0['step3'], gain=.05, until=sc0['step4'])
m.pulses(sc0['step3'], sc0['step4'], end=sc0['step4'])
tt = sc0['step4']
while tt < sc0['sacred']:
    drum(tt, .12)
    drum(tt + .33, .07, 140)
    tt += .66 if tt > E['hunters.ring'] else 1.0
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], sc0['sacred'], gain=.08, rise=(sc0['end'], 8))
m.riser(scEnd['end'] - 4, CUT, gain=.3)
m.whooshes_and_pops()

# ---------- valley, museum, cave ----------
m.amb(m.bed_noise(300, 4000, .5, 1.5), 0, sc0['id'], .012)  # jungle
m.birds(0, sc0['id'], 5)
m.boom(E['intro.survive'] - .2, .2, 1.5)
m.whoosh(sc0['id'], .1)
m.amb(m.bed_noise(300, 3000, .5, 1.5), sc0['museum'], sc0['cave'], .015)  # kids chatting
m.steps(sc0['museum'] + .3, sc0['cave'], .3, .03, pan=.4)
m.add(m.sweep(1200, 200, 1.4, 1.0), sc0['cave'] - .6, .06)  # whoosh through time
m.amb(m.bed_noise(100, 900, .3, .2), sc0['cave'], sc0['outside'], .02)  # cave air
for k in range(4):
    m.add(m.tone(1200, .1, .002, .05), E['cave.bat'] + k * .4, .04)  # low battery beeps
m.amb(m.bed_noise(300, 4000, .5, 1.5), sc0['outside'], sc0['step1'], .015)
m.birds(sc0['outside'], E['outside.roar'], 4)
m.add(m.layer(m.sweep(220, 80, 1.6, 1.0) * .8, m.noise(1.6, 80, 900, .05, 1.0)), E['outside.roar'], .3)  # the roar
for k in range(6):
    m.add(m.noise(.12, 300, 1500, .005, .08), E['outside.roar'] + .2 + k * .12, .04)  # wings

# ---------- night ----------
m.amb(m.bed_noise(2500, 7000, .6, 3.5), sc0['step1'], sc0['step2'], .006)  # crickets
m.amb(m.bed_noise(200, 2000, .4, 2), E['step1.fire'], E['step1.smoke'], .03)  # crackling fire
m.add(m.noise(.8, 100, 800, .05, .5), E['step1.hungry'], .04)  # something in the bushes
m.add(m.layer(m.sweep(160, 90, 1.2, .8), m.noise(1.2, 60, 600, .05, .8)), E['tiger.tiger'], .18)  # growl
for k in range(4):
    m.add(m.noise(.25, 400, 2500, .02, .15), E['tiger.sniff'] + k * .35, .05)  # sniffing
m.heartbeat(sc0['tiger'], sc0['step2'], bpm=120, gain=.15)

# ---------- dawn, river, mammoths ----------
m.birds(sc0['step2'], sc0['step3'], 8)
for k in range(10):
    m.add(m.noise(.1, 300, 1500, .005, .06), E['step2.flock'] + k * .1, .03)
m.amb(m.bed_noise(800, 5000, .5, .8), sc0['river'], sc0['step4'], .02)  # river
m.steps(E['step2.follow'], sc0['river'], .35, .03)
m.sting(E['river.prints'], .12)
for k in range(3):
    m.add(m.hit(60, 35, .5, .2), E['step3.mam'] + k * .9, .1)  # heavy footsteps
m.add(m.layer(m.hit(1500, 900, .05, .01), m.noise(.08, 1500, 6000, .001, .04)), E['snap.crack'], .5)  # crack
m.add(m.layer(*[m.tone(f, 1.4, .05, .8, (1, 2, 3)) for f in (311, 370)]) * .6, E['snap.lift'], .2)  # trumpet
m.heartbeat(E['snap.crack'], sc0['step4'], bpm=126, gain=.15)

# ---------- the camp ----------
m.amb(m.bed_noise(200, 2000, .4, 2), E['step4.camp'], sc0['sacred'], .03)  # fire
m.sting(E['hunters.aim'], .14)
m.add(m.layer(m.hit(1800, 1200, .04, .01), m.noise(.02, 2000, 8000, .001, .006)), E['hunters.light'], .3)  # click
m.add(m.layer(*[m.tone(f, 2, .05, 1.2, (1, 2)) for f in (523.3, 659.3, 784)]), E['hunters.light'] + .1, .05)
for k in range(4):
    m.add(m.noise(.3, 200, 1200, .02, .2), E['hunters.kneel'] + k * .15, .05)  # kneeling

# ---------- the sacred cave ----------
m.amb(m.bed_noise(200, 2000, .4, 2), sc0['sacred'], CUT, .02)  # torches
for key in ('sacred.bison', 'sacred.mam', 'sacred.hunt'):
    m.add(m.tone(880, .5, .005, .3, (1, 2)), E[key], .03)
m.sting(E['end.face'], .2)
m.add(m.tone(55, 3, .05, 2.4), E['end.old'], .18, bed=True)

m.finish('--voice' in sys.argv)

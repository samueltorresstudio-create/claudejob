# Music + SFX for «Desaparecen los adultos · Parte 5 (final)». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=241)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd

# ---------- music: underground drone, a rising chase, then the warm breakfast tune... and the last chill ----------
glock = lambda f: m.tone(f, .7, .002, .35, (1, 2.76, 5.4))
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], 0, gain=.07, until=sc0['sun'], rise=(sc0['run'], 4))
m.pulses(sc0['sneak'], sc0['run'], end=sc0['sun'])
m.melody([(523.3, 1), (659.3, 1), (784, 2), (659.3, 1), (587.3, 1), (523.3, 2)], sc0['sun'], sc0['fish'], .34, .025, pan=.2, inst=glock)
m.drone([(65.4, .4), (98, .2), (130.8, .15)], sc0['sun'], gain=.03, until=E['fish.two'])
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], E['fish.two'], gain=.08)
m.riser(E['fish.two'] - .2, CUT, gain=.32)
m.whooshes_and_pops()

m.amb(m.bed_noise(60, 500, .4, .3), 0, sc0['sun'], .03)  # underground rumble
m.boom(sc0['part'] + .05, .25, 1.4)
m.sting(E['part.end'], .16)
m.sting(E['guard.copy'], .16)
m.add(m.tone(55, 2.5, .05, 2.0), E['guard.more'], .14, bed=True)
m.steps(sc0['sneak'], sc0['step2'], .6, .03, echo=True)
m.heartbeat(sc0['sneak'], sc0['step2'], bpm=118, gain=.15)
m.ding(E['moms.bracelet'], .05, 1568)
m.ding(E['moms.alba'], .05, 1318.5)
for k in range(5):
    m.add(m.tone(900 + 220 * k, .12, .002, .06), sc0['step3'] + .2 + k * .17, .02)  # bubbles
m.ding(E['step3.word'], .07, 1318.5)
m.add(m.noise(.6, 2000, 6000, .05, .3), E['wake.whisper'] - .2, .02)  # whisper
m.add(m.layer(*[m.tone(f, 1.6, .01, .8, (1, 2)) for f in (523.3, 659.3, 784)]), E['wake.alba'], .05)
m.add(m.layer(*[m.tone(f, 1.6, .01, .8, (1, 2)) for f in (587.3, 740, 880)]), E['wake.mom'], .05)
m.sting(E['run.wake'], .16)
m.steps(E['run.run'], sc0['sun'], .17, .06)
m.heartbeat(E['run.wake'], sc0['sun'], bpm=140, gain=.15)
m.add(m.sweep(300, 1800, 1.6, 1.2), E['sun.dust'] - .2, .05)  # the copies crumble
m.birds(sc0['sun'], sc0['fish'], 6)
m.amb(m.bed_noise(300, 2500, .4, .5), sc0['home'], sc0['fish'], .012)  # kitchen
for k in range(4):
    m.add(m.tone(1046.5 * 2 ** (k / 12), .15, .002, .1), E['home.count'] + .3 + k * .35, .04)
m.ding(E['home.all'], .05, 1568)
for k in range(4):
    m.add(m.tone(900 + 220 * k, .12, .002, .06), E['fish.bowl'] + k * .2, .015)
m.add(m.tone(55, 3, .05, 2.4), E['fish.two'], .18, bed=True)
m.sting(E['fish.same'], .24)

m.finish('--voice' in sys.argv)

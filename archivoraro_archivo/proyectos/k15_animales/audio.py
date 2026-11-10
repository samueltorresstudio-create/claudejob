# Music + SFX for «Los animales hablan». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=167)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def whisper(when, dur=1.0, gain=.05, pan=0):  # a voice-like hiss: «escondeos»
    n = int(dur * SR)
    sig = m.band(m.rnd.standard_normal(n), 1500, 7000) * np.sin(np.linspace(0, np.pi * 3, n)) ** 2
    m.add(sig, when, gain, pan=pan)


def bark(when, gain=.08, pan=0):
    m.add(m.layer(m.sung(520, .18, (900, 1700)), m.noise(.08, 600, 3000, .002, .03) * .5), when, gain, pan=pan)


def moo(when, gain=.05, pan=0):
    m.add(m.sung(120, 1.0, (400, 900)), when, gain, pan=pan)


def meow(when, gain=.04, pan=0):
    m.add(m.layer(m.sung(600, .5, (800, 1600)), m.sweep(700, 500, .5, .3) * .3), when, gain, pan=pan)


def coo(when, gain=.03, pan=0):
    m.add(m.sung(300, .4, (350, 800)), when, gain, pan=pan)


# ---------- music: a sunny village tune that turns, then a low drone under the house ----------
pluck = lambda f: m.tone(f, .45, .002, .15, (1, 2, 3))
m.melody([(523.3, 1), (659.3, 1), (784, 1), (659.3, 1), (587.3, 1), (698.5, 1), (784, 2)], sc0['id'], E['talk.open'], .3, .025, pan=-.2, inst=pluck)
m.drone([(55, .5), (82.4, .25), (110, .15), (116.5, .08)], E['talk.open'], gain=.05, rise=(sc0['step3'], 14))
m.drone([(41.2, .6), (61.7, .3), (82.4, .15)], sc0['step4'], gain=.05)
m.pulses(sc0['step2'], sc0['step4'], end=sc0['step4'])
m.riser(sc0['end'] - .3, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- the village ----------
m.birds(0, E['step2.all'], 10)
m.amb(m.bed_noise(100, 1200, .3, .3), 0, sc0['step3'], .025)
for k, (fn, pan) in enumerate(((coo, -.4), (meow, -.6), (moo, .5), (bark, 0))):
    fn(E['intro.word'] + k * .12, pan=pan)
    whisper(E['intro.word'] + k * .12, .8, .03, pan)
m.whoosh(sc0['id'], .1)

# ---------- Toby speaks ----------
m.add(m.noise(.3, 200, 1500, .02, .15), E['talk.sit'], .04)
m.sting(E['talk.speak'], .14)
whisper(E['talk.word'], 1.0, .07)
m.add(m.layer(m.tone(2200, .3, .002, .2), m.noise(.3, 1500, 6000, .002, .1)), E['talk.drop'] + .4, .12)  # glass smashes
m.add(m.noise(.6, 300, 2500, .01, .4), E['talk.drop'] + .45, .05)

# ---------- the street ----------
for w, fn, pan in ((E['street.cats'], meow, -.6), (E['street.pigeons'], coo, 0), (E['street.cows'], moo, .6)):
    fn(w, pan=pan)
    whisper(w, .8, .04, pan)
for k in range(5):
    whisper(E['street.again'] + k * .35, .5, .025, m.rnd.uniform(-.7, .7))
m.add(m.layer(*[m.sung(f, .5, (700, 1300)) for f in (300, 380, 450)]), E['street.laugh'], .03)  # people laughing

# ---------- they all look up ----------
m.amb(m.bed_noise(80, 600, .5, .2), E['step2.sky'], sc0['step3'], .04)
m.sting(E['step2.all'], .16)
m.add(m.sweep(80, 40, 3, 2), E['step2.up'], .06)

# ---------- the cellar ----------
m.steps(E['step3.down'], E['step3.down'] + 2.2, .3, .05, echo=True)
m.add(m.creak(1.2, 30, 20), E['step3.down'], .06)
m.amb(m.bed_noise(60, 300, .5, .15), E['step3.weird'], CUT, .03)  # a deep hum from outside
m.add(m.sweep(400, 1200, 2.5, 1.5), E['step3.weird'], .02)
m.add(m.layer(m.hit(400, 300, .05, .01), m.noise(.02, 2000, 6000, .001, .006)), E['step4.off'], .12)
for k in range(8):
    m.add(m.noise(.5, 300, 1800, .1, .3), E['step4.breath'] + k * .9, .03, pan=.3)  # Toby panting softly
m.heartbeat(E['step4.quiet'], CUT, bpm=110, gain=.14)

# ---------- they're here ----------
m.add(m.noise(.3, 300, 2000, .02, .2), E['end.ears'], .04)
whisper(E['end.last'], .9, .06, .2)
m.add(m.tone(55, 2.5, .05, 2.0), E['end.last'], .18, bed=True)
m.boom(E['end.ear'], .3, 2.0)  # something heavy settling over the house
for k in range(3):
    m.add(m.layer(m.hit(70, 40, .4, .1), m.noise(.15, 60, 400, .005, .1)), E['end.last'] - .8 + k * .45, .25)  # footsteps upstairs

m.finish('--voice' in sys.argv)

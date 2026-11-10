# Music + SFX for «La nota del peluche». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=163)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def breath(when, gain=.06, inhale=True, dur=.7):
    n = int(dur * SR)
    env = np.sin(np.linspace(0, np.pi, n)) ** (1.5 if inhale else 1)
    m.add(m.band(m.rnd.standard_normal(n), 300 if inhale else 200, 2500 if inhale else 1500) * env, when, gain)


# ---------- music: a lullaby on a music box, a little out of tune, then winding down ----------
lull = [(659.3, 2), (587.3, 1), (523.3, 1), (587.3, 2), (659.3, 2), (659.3, 1), (659.3, 1), (587.3, 2), (523.3, 4)]
m.melody(lull, 0, sc0['step3'], .32, .03, pan=-.2, inst=m.musicbox)
m.melody(lull, sc0['step3'], sc0['peek'], .4, .02, pan=-.2, inst=lambda f: m.musicbox(f * .97))  # slower, detuned
m.drone([(55, .5), (82.4, .25), (110, .12)], sc0['note'], gain=.035, until=sc0['step3'])
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], sc0['step3'], gain=.065, rise=(sc0['peek'], 10))
m.pulses(sc0['night'], sc0['end'], end=sc0['end'])
m.riser(E['end.turn'] - .4, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- the note ----------
m.amb(m.bed_noise(100, 900, .3, .2), 0, CUT, .015)  # quiet house
m.add(m.noise(.5, 1500, 7000, .02, .3), E['intro.note'], .05)  # paper
m.whoosh(sc0['id'], .1)
m.add(m.noise(.6, 400, 2500, .05, .3), E['note.find'], .07)  # lifting the pillow
m.add(m.noise(.4, 1500, 7000, .02, .2), E['note.close'], .05)
m.sting(E['note.print'], .16)

# ---------- the sofa, the cushions ----------
m.add(m.tone(1568, .4, .002, .25, (1, 2.4)), E['step1.look'], .03)  # button-eye glint
m.steps(E['step1.sofa'], E['step1.blanket'] + 1, .5, .04)
m.add(m.noise(.8, 300, 2000, .05, .4), E['step1.blanket'] + .8, .06)
for k in range(3):
    m.add(m.noise(.4, 200, 1500, .03, .25), E['step2.cushions'] + .5 + k * .8, .07)  # cushions stuffed under the sheet
m.add(m.layer(*[m.tone(f, 1.0, .01, .5, (1, 2)) for f in (523.3, 659.3)]), E['step2.perfect'], .04)

# ---------- lights off, the door ----------
m.add(m.layer(m.hit(400, 300, .05, .01), m.noise(.02, 2000, 6000, .001, .006)), E['step3.off'], .15)
m.add(m.creak(1.4, 30, 22), E['step3.door'] + .3, .07)
m.sting(E['step3.bye'], .14)
m.add(m.layer(m.hit(150, 80, .2, .05), m.noise(.1, 200, 1500, .005, .08)), scEnd['step3'] - .3, .12)  # door shuts
m.amb(m.bed_noise(2500, 7000, .6, 3.5), sc0['step4'], CUT, .004)
m.add(m.noise(.8, 200, 1200, .1, .4), E['step4.hear'] + .2, .04, pan=-.6)  # something down the hall

# ---------- 3 a.m. ----------
m.add(m.tone(1046.5, .3, .002, .2), sc0['night'] + .2, .02)  # clock
m.steps(E['night.pass'] - .6, E['night.door'] + .4, .55, .035)
m.add(m.creak(1.2, 26, 20), E['night.door'], .08)
m.sting(E['night.ajar'], .16)
m.heartbeat(E['night.ajar'], CUT, bpm=115, gain=.14)

# ---------- the breathing lump ----------
for w, inh in ((E['peek.breath'], True), (E['peek.breath'] + 1.3, False), (E['peek.no'] - .3, True), (E['peek.no'] + 1.0, False),
               (E['end.up1'], True), (E['end.down1'], False), (E['end.up2'], True), (E['end.down2'], False)):
    breath(w, .07, inh, .5)
m.add(m.tone(55, 2.5, .05, 2.0), E['peek.no'], .16, bed=True)
m.add(m.noise(1.6, 150, 1200, .5, .6), E['end.turn'] - .3, .08)  # the sheet sliding
m.sting(E['end.turn'] + .4, .2)

m.finish('--voice' in sys.argv)

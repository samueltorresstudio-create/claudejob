# Music + SFX for «Encerrado en el cole de noche». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=151)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def rattle(when, gain=.12, n=5):
    for k in range(n):
        m.add(m.layer(m.metal(700 + 60 * k, .12, .05) * .5, m.noise(.04, 800, 4000, .002, .02)), when + k * .09, gain)


def chime(when, gain=.06):  # the school's PA ding-dong
    m.add(m.tone(659.3, 1.0, .005, .6, (1, 2)), when, gain)
    m.add(m.tone(523.3, 1.3, .005, .8, (1, 2)), when + .45, gain)


# ---------- music: the school bell melody, slowed down and detuned ----------
bell = lambda f: m.tone(f, 1.0, .005, .5, (1, 2.4, 3.9))
m.melody([(659.3, 1), (523.3, 1), (587.3, 1), (392, 2), (392, 1), (587.3, 1), (659.3, 1), (523.3, 2)], sc0['wake'], sc0['pa'], .55, .022, pan=-.2,
         inst=lambda f: bell(f * .985))
m.drone([(49, .5), (73.4, .25), (98, .15), (103.8, .1)], sc0['wake'], gain=.055, rise=(sc0['step3'], 14))
m.pulses(sc0['step2'], sc0['pa'], end=sc0['pa'])
m.riser(sc0['end'] - .3, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- outside, the library ----------
m.amb(m.bed_noise(100, 700, .4, .2), 0, CUT, .02)  # night air / building hum
m.add(m.tone(1500, .15, .002, .08), E['intro.night'], .02)
m.whoosh(sc0['id'], .1)
m.add(m.noise(.5, 200, 1500, .05, .3), E['wake.open'], .06)  # waking up, rustle
m.sting(E['wake.none'], .14)

# ---------- the corridor: vending machine, footsteps that stop ----------
hum = np.sin(2 * np.pi * 50 * t) * .5 + np.sin(2 * np.pi * 100 * t) * .3 + np.sin(2 * np.pi * 150 * t) * .15
m.amb(hum, E['wake.hall'], sc0['step1'] + 3, .025)
m.steps(E['wake.hall'], E['wake.stop'], .55, .04)
m.steps(E['wake.steps'], E['wake.stop'], .55, .02, pan=.7, echo=True)  # someone far away, in step with him
m.sting(E['wake.stop'] + .1, .15)

# ---------- stairs and the locked office ----------
m.steps(E['step1.stairs'], E['step1.locked'], .45, .05, echo=True)
rattle(E['step1.lock'], .14, 6)
tt = E['step1.inside']
while tt < scEnd['step1']:
    m.add(m.tone(1760, .1, .002, .05), tt, .02)  # the answering machine's light beeping
    tt += .8

# ---------- exits ----------
m.amb(hum, sc0['step2'], E['step2.doors'], .015)
for w in E['step2.d']:
    m.steps(w - .6, w - .1, .2, .04)
    rattle(w, .12, 4)
m.add(m.metal(900, .8, .3), E['step2.newlock'], .05)
m.sting(E['step2.someone'], .16)

# ---------- the open classroom, the chalk ----------
m.add(m.creak(1.2, 30, 22), E['step3.one'] - .2, .08)
for k in range(5):
    m.add(m.noise(.18, 2000, 7000, .01, .1), E['step3.board'] + k * .33, .04)  # chalk on the board
m.add(m.layer(m.hit(1200, 900, .04, .01), m.tone(2400, .1, .001, .05)), E['step3.chalk'] + .1, .06)  # chalk drops and rolls
m.sting(E['step3.fresh'], .18)

# ---------- the PA ----------
m.add(m.noise(.4, 300, 3000, .01, .3), E['pa.on'], .05)  # speakers crackle on
m.amb(m.bed_noise(800, 4000, .5, 7), E['pa.on'], CUT, .008)  # line hiss
m.add(m.tone(1000, 1.0, .005, .05), E['pa.beep'], .04)
chime(E['pa.voice'] - .3, .05)
m.heartbeat(E['pa.call'], CUT, bpm=120, gain=.16)

# ---------- the office ----------
m.add(m.layer(m.hit(400, 300, .05, .01), m.noise(.02, 2000, 6000, .001, .006)), E['end.lit'], .12)  # light switch
m.add(m.tone(55, 2.5, .05, 2.0), E['end.lit'], .16, bed=True)
m.add(m.creak(2.0, 28, 16), E['end.open'] - .6, .12)

m.finish('--voice' in sys.argv)

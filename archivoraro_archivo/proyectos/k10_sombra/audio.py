# Music + SFX for «Tu sombra deja de copiarte». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=139)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def click(gain=.15):
    return m.layer(m.hit(400, 300, .05, .01), m.noise(.02, 2000, 6000, .001, .006))


# ---------- music: a sly pizzicato that tiptoes (like someone copying you a beat late), then the dark ----------
pizz = lambda f: m.tone(f, .3, .002, .09, (1, 2, 3))
m.melody([(293.7, 1), (0, 1), (349.2, 1), (0, 1), (440, 1), (415.3, 1), (349.2, 1), (0, 1)], sc0['notice'], sc0['step4'], .28, .035, pan=-.2, inst=pizz)
m.melody([(293.7, 1), (0, 1), (349.2, 1), (0, 1), (440, 1), (415.3, 1), (349.2, 1), (0, 1)], sc0['notice'] + .45, sc0['step4'], .28, .015, pan=.5, inst=pizz)  # the echo: a beat late
m.drone([(61.7, .5), (92.5, .25), (123.5, .12)], sc0['notice'], gain=.04, until=sc0['step4'])
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], sc0['step4'], gain=.065, rise=(sc0['night'], 8), until=E['dark.off'])
m.pulses(sc0['night'], E['dark.off'], end=E['dark.off'])
m.riser(E['dark.side'] - .3, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- the street ----------
m.birds(0, sc0['step2'], 7)
m.amb(m.bed_noise(100, 1200, .3, .3), 0, sc0['step2'], .03)
m.steps(0, E['intro.push'] + 1.5, .42, .05, lo=200, hi=2000)
m.sting(E['intro.stop'] + .1, .12)
m.whoosh(sc0['id'], .1)
m.steps(sc0['notice'], E['notice.stop'], .42, .05, lo=200, hi=2000)
m.add(m.noise(.8, 1500, 5000, .05, .3), E['notice.stop'] + .3, .03)  # laces
m.steps(E['notice.keep'], E['notice.halt'], .42, .025, pan=.5, lo=300, hi=3000)  # footsteps that aren't hers
m.sting(E['notice.turn'], .15)
m.add(m.sweep(500, 380, 1.2, .6), E['step1.late'], .04)
m.steps(E['step1.go'], sc0['step2'], .42, .05, lo=200, hi=2000)

# ---------- the street lamp; home with every light on ----------
hum = np.sin(2 * np.pi * 120 * t) * .6 + np.sin(2 * np.pi * 240 * t) * .3
m.amb(hum, sc0['step2'] + 1, E['step2.dark'], .012)
m.add(click(), E['step2.dark'], .15)
m.whoosh(E['step2.dark'] + .2, .14, .7)
m.amb(hum, E['step2.dark'] + 1.6, E['step2.home'], .012)
for at in (.1, .5, .8):
    m.add(click(), E['step2.on'] - .2 + at * (E['step2.all'] + .2 - E['step2.on']), .2)
m.add(m.noise(.5, 1500, 7000, .02, .2), E['step2.bill'], .06)  # paper

# ---------- dinner ----------
m.amb(m.bed_noise(300, 3000, .3, .4), sc0['step3'], sc0['step4'], .008)  # kitchen hum
for k in range(5):
    m.add(m.tone(3200, .12, .001, .08, (1, 2.7)), E['step3.eat'] + .4 + k * 1.3, .02)  # fork on the plate
for h in (E['step3.away'], E['step3.away'] + 1.0, E['step3.close']):
    m.add(m.noise(.25, 200, 2000, .02, .15), h, .08, pan=.4)  # a slide, closer each time
m.sting(E['step3.table'], .2)

# ---------- the bedroom ----------
m.add(click(), E['step4.lamp'], .12)
for k in range(3):
    m.add(m.layer(click(), m.hit(900, 700, .03, .01)), E['step4.bat'] + k * .25, .12)
m.amb(m.bed_noise(100, 700, .3, .2), sc0['step4'], CUT, .015)
m.heartbeat(E['night.still'], E['dark.off'], bpm=100, gain=.12)
fl = E['night.flick']
for k in range(6):
    m.add(m.noise(.04, 2000, 8000, .001, .02), fl + k * .083 * 3, .06)  # the bulb buzzing as it flickers

# ---------- blackout ----------
m.add(m.sweep(120, 25, 1.6, 1.2), E['dark.off'], .25)  # the whole grid dying
m.boom(E['dark.off'] + .1, .4, 2.5)
m.add(m.noise(1.4, 100, 900, .2, .8), E['dark.hood'], .05)
for k in range(4):
    m.add(m.noise(.18, 200, 1500, .02, .1), E['dark.grope'] + k * .4, .07, pan=.4)  # hand searching the table
m.sting(E['dark.gone'], .16)
m.heartbeat(E['dark.gone'], CUT, bpm=125, gain=.16)
breath = m.band(m.rnd.standard_normal(int(1.2 * SR)), 400, 3000) * np.sin(np.linspace(0, np.pi, int(1.2 * SR)))
m.add(breath, E['dark.side'], .05, pan=.35)
m.add(m.tone(55, 2.5, .05, 2.0), E['dark.last'], .18, bed=True)

m.finish('--voice' in sys.argv)

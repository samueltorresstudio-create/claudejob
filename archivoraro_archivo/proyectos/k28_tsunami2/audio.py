# Music + SFX for «Tsunami · Parte 2». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=282)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def bark(when, gain=.16, pan=.2):
    m.add(m.layer(m.hit(520, 260, .16, .06), m.noise(.14, 400, 2600, .002, .05) * .6), when, gain, pan)


def roar(when, dur, gain):
    m.add(m.layer(m.noise(dur, 30, 400, dur * .4, dur * .5), m.noise(dur, 400, 3000, dur * .5, dur * .3) * .4), when, gain)


# ---------- music ----------
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], 0, gain=.07, until=sc0['door'])
m.drone([(49, .6), (73.4, .3), (98, .15), (103.8, .08)], sc0['door'], gain=.05, until=sc0['wave2'])
m.pulses(sc0['step1'], sc0['wave2'], end=sc0['wave2'])
m.drone([(41.2, .6), (61.7, .3), (82.4, .15), (87.3, .1)], sc0['wave2'], gain=.09, until=sc0['step2'])
m.melody([(392, 2), (349.2, 1), (311.1, 3), (293.7, 2), (261.6, 4)], sc0['step2'], sc0['night'], .3, .018, pan=-.2)
m.drone([(36.7, .6), (55, .3), (73.4, .12)], sc0['night'], gain=.05, until=sc0['dawn'])
m.pulses(sc0['step4'], sc0['dawn'], end=sc0['dawn'])
m.drone([(55, .4), (82.4, .2), (110, .1)], sc0['dawn'], gain=.035, until=sc0['end'])
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], sc0['end'], gain=.08, rise=(sc0['end'], 5))
m.riser(scEnd['end'] - 4, CUT, gain=.3)
m.whooshes_and_pops()

# ---------- the sea pulls back again ----------
m.amb(m.bed_noise(150, 1500, .5, .2), 0, sc0['wave2'], .025)
m.add(m.layer(m.sweep(300, 50, 3.0, 2.6), m.noise(3.0, 60, 1000, .5, 2.0)), .2, .14)
m.add(m.noise(5, 25, 260, 2, .5), E['intro.worst'] - 1, .25)
m.heartbeat(E['intro.worst'], sc0['door'], bpm=120, gain=.14)

# ---------- the door, the strangers ----------
m.add(m.layer(m.hit(220, 90, .4, .15), m.metal(260, .8, .3) * .5), E['door.open'] - .1, .25)
m.add(m.creak(1.0), E['door.open'] - .3, .08)
bark(E['door.open'] + .2)
bark(E['door.open'] + .7, .12)
m.steps(E['door.mother'] - .4, E['door.mother'] + 1, .32, .04, pan=.4)
m.steps(E['door.men'] - .4, E['door.men'] + 1.4, .34, .05, pan=.6)
for k in range(10):
    m.add(m.tone(1300 + (k % 4) * 140, .06, .001, .04), E['door.men'] + k * .3, .02, pan=.6)  # drips
m.sting(E['door.bag'], .16)

# ---------- step 1 ----------
m.steps(E['step1.young'], E['step1.block'], .3, .05, pan=.3)
m.steps(E['step1.block'] - .6, E['step1.block'], .18, .06)
bark(E['step1.block'] + .1, .18)
bark(E['step1.block'] + .5, .14)

# ---------- the second wave ----------
roar(sc0['wave2'] - .4, 4.5, .55)
m.boom(E['wave2.arrive'], .55, 3.0)
for k in range(4):
    m.add(m.layer(m.hit(120, 40, .8, .4), m.noise(.8, 200, 4000, .01, .4)), E['wave2.arrive'] + k * .35, .16)
m.add(m.creak(2.4), E['wave2.creak'] - .3, .18)
m.add(m.noise(2.0, 25, 160, .1, 1.2), E['wave2.creak'], .4)
m.add(m.layer(m.sweep(900, 1300, .6, .4), m.sweep(1200, 1600, .6, .4) * .5), E['wave2.scream'], .07)  # scream
for k in range(4):
    bark(E['wave2.duque'] + k * .35, .17)

# ---------- afternoon / dusk ----------
m.amb(m.bed_noise(2500, 7000, .5, 3.0), sc0['step2'], sc0['night'], .005)  # cicadas-like heat hiss
m.birds(sc0['step2'], sc0['step3'], 3)
m.add(m.noise(.4, 300, 2000, .01, .2), E['step2.give'] - .2, .05)  # bottle
m.sting(E['step2.see'], .14)

# ---------- night ----------
m.amb(m.bed_noise(150, 900, .4, .1), sc0['night'], sc0['dawn'], .02)  # water lapping
m.amb(m.bed_noise(3000, 7000, .6, 3.5), sc0['night'], sc0['dawn'], .004)
for k in range(5):
    m.add(m.tone(1500 + k * 70, .08, .001, .05), sc0['night'] + 1 + k * 1.3, .02, pan=(-1) ** k * .5)
m.add(m.tone(98, 3.0, .5, 2), E['night.doze'], .06)
m.sting(E['step4.error'], .16)
for k in range(6):
    m.add(m.noise(.25, 300, 1500, .05, .15), E['step4.no'] + .5 + k * .45, .03, pan=.6)  # something dragged
m.heartbeat(E['step4.no'], sc0['dawn'], bpm=100, gain=.12)

# ---------- dawn ----------
m.birds(sc0['dawn'], CUT, 5)
m.amb(m.bed_noise(150, 900, .4, .1), sc0['dawn'], CUT, .015)
m.sting(E['end.gone'], .16)
m.add(m.layer(m.sweep(400, 600, .6, .4), m.noise(.6, 300, 2500, .02, .3) * .4), E['end.call'], .06)  # the shout
m.heartbeat(E['end.men'], CUT, bpm=140, gain=.2)

m.finish('--voice' in sys.argv)

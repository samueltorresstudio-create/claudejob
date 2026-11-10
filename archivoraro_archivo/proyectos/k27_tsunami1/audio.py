# Music + SFX for «Tsunami · Parte 1». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=271)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def bark(when, gain=.18, pan=.2):
    m.add(m.layer(m.hit(520, 260, .16, .06), m.noise(.14, 400, 2600, .002, .05) * .6), when, gain, pan)


def horn(when, gain=.07, pan=0, f=420):
    m.add(m.layer(*[m.tone(f * k, .45, .01, .3, (1, 2, 3, 4)) for k in (1, 1.26)]), when, gain, pan)


def siren(t0, t1, gain=.06):
    tt = t0
    while tt < t1:
        m.add(m.sweep(560, 900, 1.4, 1.2), tt, gain, -.3)
        m.add(m.sweep(900, 560, 1.4, 1.0), tt + 1.4, gain, -.3)
        tt += 2.8


def roar(when, dur, gain):
    m.add(m.layer(m.noise(dur, 30, 400, dur * .4, dur * .5), m.noise(dur, 400, 3000, dur * .5, dur * .3) * .4), when, gain)


# ---------- music: a cold drone that tightens, pulses once the steps start ----------
m.drone([(55, .5), (82.4, .25), (110, .12)], 0, gain=.04, until=sc0['run'])
m.melody([(440, 2), (392, 1), (349.2, 3), (329.6, 2), (293.7, 4)], sc0['id'], sc0['run'], .28, .02, pan=-.2)
m.drone([(49, .6), (73.4, .3), (98, .15), (103.8, .08)], sc0['sea'], gain=.06, until=sc0['wave'])
m.pulses(sc0['step1'], sc0['step4'], end=sc0['wave'])
m.drone([(41.2, .6), (61.7, .3), (82.4, .15), (87.3, .1)], sc0['wave'], gain=.09, until=sc0['calm'])
m.drone([(55, .4), (82.4, .2), (110, .1)], sc0['calm'], gain=.035, until=sc0['end'])
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], sc0['end'], gain=.08, rise=(sc0['end'], 6))
m.riser(scEnd['end'] - 4, CUT, gain=.3)
m.whooshes_and_pops()

# ---------- the beach in the morning ----------
m.amb(m.bed_noise(150, 1500, .6, .12), 0, sc0['id'], .03)  # surf
m.birds(0, sc0['id'], 4)
m.add(m.sweep(400, 90, 2.4, 2.0) * .6 + m.noise(2.4, 80, 900, .3, 1.5) * .5, E['intro.retire'] - .4, .12)  # the water sucked back
for k in range(int(scEnd['intro'] - E['intro.min'])):
    m.add(m.tone(1800, .03, .001, .02), E['intro.min'] + k, .05)  # clock ticks
m.boom(E['intro.min'], .3, 1.5)
m.add(m.layer(m.tone(880, .3, .005, .2, (1, 2))), E['id.age'], .04)
bark(E['duque.name'] + .2, .14)
m.steps(E['duque.where'] - .2, E['duque.where'] + .8, .45, .05, pan=.4)

# ---------- the run and the earthquake ----------
m.amb(m.bed_noise(150, 1500, .6, .12), sc0['run'], sc0['step2'], .025)
m.steps(sc0['run'] + .1, E['run.quake'] + .5, .26, .05)
m.steps(sc0['run'] + .2, E['run.quake'] + .5, .2, .025, pan=.3, lo=300, hi=2500)
m.add(m.noise(scEnd['run'] - E['run.quake'] + .6, 25, 220, .6, 1.2), E['run.quake'] - .2, .5)  # rumble
m.boom(E['run.quake'], .35, 2.0)
for k in range(5):
    m.add(m.metal(300 + k * 40, .6, .25), E['run.quake'] + .3 + k * .35, .03, pan=(-1) ** k * .5)  # lamp posts rattling
for k in range(3):
    bark(E['run.tremble'] + k * .45, .16)

# ---------- the sea pulls back ----------
m.add(m.layer(m.sweep(300, 60, 3.5, 3.0), m.noise(3.5, 60, 1200, .3, 2.4)), E['sea.retire'] - .5, .14)
for k in range(14):
    m.add(m.noise(.05, 800, 4000, .001, .02), E['sea.fish'] + k * .17 + (k % 3) * .05, .05, pan=((k * 37) % 10 - 5) / 6)  # fish flapping
m.amb(m.bed_noise(300, 3000, .5, 1.5), E['sea.people'] - .5, sc0['step1'] + 2, .02)  # crowd
for k in range(5):
    m.add(m.layer(m.tone(2600, .04, .001, .02), m.noise(.05, 2000, 6000, .001, .02)), E['sea.photos'] + k * .3, .04, pan=(-1) ** k * .4)  # camera clicks
m.sting(E['sea.knows'], .14)
m.heartbeat(E['sea.knows'], sc0['step2'], bpm=118, gain=.14)

# ---------- step 1: run ----------
bark(sc0['step1'] + .3, .14)
bark(sc0['step1'] + .9, .12)
m.steps(E['step1.go'], scEnd['step1'], .24, .05)
m.steps(E['step1.go'] + .1, scEnd['step1'], .17, .025, pan=-.3, lo=300, hi=2500)
m.add(m.noise(.2, 200, 1500, .005, .1), E['step1.leash'], .08)  # the leash snaps taut

# ---------- step 2: 90 seconds at home ----------
m.add(m.layer(m.hit(180, 60, .3, .1), m.noise(.15, 200, 2000, .002, .06)), sc0['step2'] + .05, .3)  # door bursts open
m.steps(sc0['step2'] + .1, E['step2.home'], .3, .05)
for k in range(int((scEnd['step2'] - E['step2.sec']) / .5)):
    m.add(m.tone(2200 if k % 2 else 1600, .03, .001, .02), E['step2.sec'] + k * .5, .06)  # fast ticking
for key in ('water', 'kit', 'torch', 'radio'):
    m.add(m.layer(m.noise(.12, 300, 3000, .005, .05), m.tone(660, .12, .005, .08)), E['step2.' + key], .08)
m.add(m.noise(.5, 2000, 7000, .02, .3), E['step2.radio'] + .9, .06)  # zip
bark(E['step2.home'] + .5, .1, .6)

# ---------- step 3: the jam ----------
m.amb(m.bed_noise(40, 300, .3, .5), sc0['step3'], sc0['step4'], .05)  # engines idling
for i, dt in enumerate((.3, .9, 1.6, 2.2, 2.9, 3.6, 4.1, 4.8)):
    horn(sc0['step3'] + dt, .05, pan=(-1) ** i * .5, f=380 + (i % 3) * 60)
m.steps(sc0['step3'], sc0['step4'], .24, .04)

# ---------- step 4: the fire escape ----------
m.steps(E['step4.climb'] - .3, scEnd['step4'], .22, .06, lo=400, hi=3500, echo=True)
for k in range(int((scEnd['step4'] - E['step4.climb']) / .44)):
    m.add(m.metal(520, .3, .12), E['step4.climb'] + k * .44, .02, pan=.3)

# ---------- the wave ----------
siren(E['wave.siren'] - .2, sc0['calm'] + 1, .055)
roar(E['wave.wall'] - 1, scEnd['wave'] - E['wave.wall'] + 1.2, .35)
m.heartbeat(E['wave.sees'], sc0['hit'], bpm=140, gain=.16)
m.boom(sc0['hit'], .55, 3.0)
roar(sc0['hit'], 6, .5)
for key in ('beach', 'prom', 'cars'):
    m.add(m.layer(m.hit(120, 40, .8, .4), m.noise(.8, 200, 4000, .01, .4)), E['hit.' + key], .2)
for k in range(4):
    m.add(m.metal(200 + k * 30, 1.2, .5), E['hit.cars'] + .2 + k * .3, .04, pan=(-1) ** k * .6)  # cars crunching
m.add(m.creak(2.2), E['hit.shake'], .14)
m.add(m.noise(2.2, 25, 160, .1, 1.4), E['hit.shake'], .4)

# ---------- calm, then the sea pulls back again ----------
m.amb(m.bed_noise(200, 2000, .5, .4), sc0['calm'], CUT, .02)  # water lapping
for k in range(6):
    m.add(m.tone(1400 + k * 90, .08, .001, .05), sc0['calm'] + .4 + k * .55, .025, pan=(-1) ** k * .5)  # drips
m.add(m.noise(1.2, 300, 2000, .4, .6), E['calm.breathe'] + .3, .05)  # the long breath out
m.add(m.layer(m.sweep(300, 50, 3.0, 2.6), m.noise(3.0, 60, 1000, .5, 2.0)), E['end.retire'] - .6, .16)
bark(E['end.retire'] + .3, .12)
m.heartbeat(E['end.first'], CUT, bpm=150, gain=.2)
m.add(m.noise(CUT - E['end.never'] + .2, 25, 300, 1.5, .3), E['end.never'], .35)  # the far roar building

m.finish('--voice' in sys.argv)

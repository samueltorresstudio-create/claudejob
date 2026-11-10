# Music + SFX for «Isla desierta con toda tu clase». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=127)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def gull(gain=.04, pan=0):
    for k in range(m.rnd.integers(2, 4)):
        f = m.rnd.uniform(1300, 1700)
        g = m.layer(m.sweep(f, f * .7, .28, .15), m.sweep(f * 2, f * 1.4, .28, .15) * .3)
        yield g, k * .32, gain, pan


def crackle(a, b, rate=9, gain=.05):
    tt = a
    while tt < b:
        m.add(m.noise(.012, 1500, 7000, .001, .006), tt, gain * m.rnd.uniform(.3, 1), pan=m.rnd.uniform(-.4, .4))
        tt += m.rnd.exponential(1 / rate)


def snap(gain=.4):
    return m.layer(m.noise(.05, 800, 6000, .001, .03), m.hit(300, 120, .15, .05) * .5)


# ---------- music: a bright marimba while they survive, then the dark at night ----------
mar = lambda f: m.tone(f, .5, .002, .22, (1, 4.0, 9.2))
m.melody([(523.3, 1), (659.3, 1), (784, 1), (659.3, 1), (587.3, 1), (698.5, 1), (880, 1), (698.5, 1)],
         sc0['step1'], sc0['night'], .3, .028, pan=-.2, inst=mar)
m.drone([(65.4, .5), (98, .25), (130.8, .15)], sc0['step1'], gain=.045, until=sc0['night'])
m.drone([(49, .6), (73.4, .3), (98, .15), (103.8, .1)], sc0['night'], gain=.075, rise=(sc0['morning'], 12))
m.pulses(E['night.crack'], E['morning.prints'], end=CUT - .2)
m.riser(sc0['prints'] - .4, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- the storm and the shipwreck ----------
m.amb(m.bed_noise(1500, 8000, .3, .7), 0, E['intro.push'] + .5, .05)  # rain
m.amb(m.bed_noise(80, 900, .5, .3), 0, E['intro.push'] + .5, .06)  # storm wind
m.add(m.tone(98, 2.2, .25, .8, (1, 2, 3, 4)), .05, .14)  # ship horn
m.boom(E['intro.sink'], .4)
m.add(m.layer(m.metal(90, 1.8, .7) * .5, m.noise(1.2, 60, 600, .1, .6)), E['intro.sink'] + .1, .2)
m.whoosh(E['intro.push'], .15, .6)

# ---------- the island: waves and gulls under everything in daylight ----------
waves = m.bed_noise(80, 1400, .7, .11)
m.amb(waves, E['intro.island'], sc0['night'] + .5, .045, fade=1.0)
m.amb(waves, sc0['night'], CUT, .02, fade=1.0)
m.amb(waves, sc0['morning'], CUT, .03, fade=1.0)
for tt in (E['intro.island'] + .3, sc0['shore'] + .4, sc0['step2'] + 1.0, sc0['step4'] + .5, E['morning.out'] + .3):
    for g, dt, gain, pan in gull(.035, m.rnd.uniform(-.6, .6)):
        m.add(g, tt + dt, gain, pan)
m.whoosh(sc0['id'], .1)

# ---------- the shore: no adults, someone cries, someone shouts ----------
m.sting(E['shore.none'], .14)
m.add(m.sung(330, 1.6, (450, 1000)) * np.linspace(1, .3, int(1.6 * SR)), E['shore.cry'], .05, pan=-.3)
m.add(m.echo(m.sung(290, .7, (750, 1250)), (.25, .5, .8), .5), E['shore.shout'], .12)

# ---------- water, shelter ----------
m.add(m.layer(m.hit(500, 300, .08, .02), m.noise(.04, 1000, 4000, .001, .02)), E['step1.coco'], .3)  # coconut cracks
m.amb(m.bed_noise(2000, 8000, .2, 1.3), E['step1.rain'], sc0['step2'] + .3, .04)
for k in range(5):
    m.add(m.tone(1600 + 150 * k, .2, .002, .1), E['step1.rain'] + .3 + k * .21, .02)  # drops in the shell
m.add(m.noise(1.4, 100, 1200, .4, .6), E['step2.tide'], .1)  # the tide rolling up
for k in range(6):
    m.add(m.layer(m.hit(220, 140, .12, .03), m.noise(.03, 400, 2500, .001, .02) * .4), E['step2.build'] + k * .38, .22, pan=m.rnd.uniform(-.3, .3))

# ---------- fire with a lens, stones for SOS ----------
m.add(m.tone(2093, 1.2, .3, .5, (1, 1.5)), E['step3.lens'], .025)
m.add(m.noise(1.2, 300, 3000, .3, .5), E['step3.smoke'], .05)
m.add(m.noise(.6, 60, 500, .05, .4), E['step3.warm'] - .2, .15)  # whoomph
crackle(E['step3.warm'] - .1, sc0['step4'] + .3, 10, .05)
for k in range(10):
    m.add(m.layer(m.hit(320, 200, .07, .02), m.noise(.02, 800, 3000, .001, .01) * .5), E['step4.stones'] + .1 + k * .26, .16, pan=m.rnd.uniform(-.3, .3))

# ---------- the night: fire, a branch cracks, the eyes ----------
crackle(sc0['night'], sc0['morning'], 7, .04)
m.amb(m.bed_noise(2500, 7000, .6, 3.5), sc0['night'], sc0['morning'], .008)  # crickets
m.add(snap(), E['night.crack'], .55, pan=.4)
m.sting(E['night.crack'] + .1, .14)
m.add(m.layer(m.hit(400, 300, .05, .01), m.noise(.02, 2000, 6000, .001, .006)), E['night.torch'], .15)
m.add(m.noise(.4, 500, 3000, .05, .2), E['night.none'], .05, pan=-.5)  # leaves
m.add(snap(.3), E['night.none'] + 1.0, .25, pan=-.6)
m.sting(E['night.eyes'], .25)
m.heartbeat(E['night.eyes'] - .3, sc0['morning'] + 1, bpm=110, gain=.13)

# ---------- the morning: footprints ----------
m.birds(sc0['morning'], CUT - 1, 6)
m.steps(E['morning.out'], E['morning.prints'], .5, .03, lo=100, hi=900)
m.sting(E['morning.prints'] + .2, .18)
m.add(m.tone(55, 2.5, .05, 2.0), E['morning.shoes'], .18, bed=True)
m.heartbeat(E['morning.shoes'], CUT, bpm=125, gain=.16)
m.add(snap(.3), E['prints.behind'] + .4, .45, pan=.0)  # a twig breaks right behind her

m.finish('--voice' in sys.argv)

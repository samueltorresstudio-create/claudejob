# Music + SFX for «Campamento: nunca cuentes a los de tu cabaña». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=137)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def crackle(a, b, rate=8, gain=.045):
    tt = a
    while tt < b:
        m.add(m.noise(.012, 1500, 7000, .001, .006), tt, gain * m.rnd.uniform(.3, 1), pan=m.rnd.uniform(-.4, .4))
        tt += m.rnd.exponential(1 / rate)


def paper(when, gain=.08):
    for k in range(4):
        m.add(m.noise(.08, 1500, 7000, .005, .05), when + k * .07, gain * m.rnd.uniform(.5, 1))


def owl(when, gain=.03):
    m.add(m.sung(380, .35, (350, 700)), when, gain, pan=-.5)  # hoo...
    m.add(m.sung(330, .7, (350, 700)), when + .5, gain, pan=-.5)  # ...hoooo


# ---------- music: a summer-camp ukulele feel by day, a music box that goes wrong by night ----------
pluck = lambda f: m.tone(f, .5, .002, .18, (1, 2, 3, 4.1))
m.melody([(392, 1), (493.9, 1), (587.3, 1), (493.9, 1), (440, 1), (523.3, 1), (659.3, 1), (523.3, 1)], 0, sc0['fire'], .25, .03, pan=-.2, inst=pluck)
m.drone([(55, .5), (82.4, .25), (110, .15), (116.5, .08)], sc0['fire'], gain=.05, rise=(sc0['night'], 14))
m.melody([(659.3, 2), (622.3, 2), (587.3, 2), (554.4, 2)], sc0['step4'], sc0['count'], .5, .02, pan=.3, inst=m.musicbox)
m.pulses(sc0['step2'], sc0['count'], end=E['count.seven'])
m.riser(E['count.seven'] - .2, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- arrival: forest birds, the bus, a whistle ----------
m.birds(0, sc0['fire'], 8)
m.amb(m.bed_noise(150, 1200, .4, .2), 0, sc0['fire'], .03)  # wind in the pines
m.add(m.layer(m.noise(2.5, 60, 400, .3, .8), m.tone(65, 2.5, .3, .8, (1, 2))), 0, .1)  # bus pulling away
m.add(m.layer(m.tone(2600, .5, .01, .1), m.tone(2650, .5, .01, .1)), E['intro.four'], .05)  # whistle
m.sting(E['intro.push'], .14)
m.whoosh(sc0['id'], .1)
m.add(m.layer(m.knock(), m.creak(.5, 40, 30) * .3), E['cabin.seven'], .1)  # cabin door
for k, w in enumerate(E['cabin.n']):
    m.add(m.tone(784 + 98 * k, .25, .002, .12, (1, 2)), w, .03)

# ---------- campfire: the paper ----------
crackle(sc0['fire'], sc0['step1'] + .5)
m.amb(m.bed_noise(60, 400, .4, .8), sc0['fire'], sc0['step1'], .03)
m.amb(m.bed_noise(2500, 7000, .6, 3.5), sc0['fire'], CUT, .006)  # crickets
paper(E['fire.paper'])
for s in ('step1', 'step2', 'step3', 'step4'):
    paper(sc0[s] + .1, .05)
    crackle(sc0[s], sc0[s] + 2.5, 5, .03)

# ---------- rule 1: the generator dies ----------
m.amb(m.bed_noise(40, 250, .3, 9), sc0['step1'] + 2, E['step1.off'], .05)
m.add(m.sweep(120, 30, 1.2, .8), E['step1.off'], .15)
m.add(m.layer(m.hit(300, 200, .05, .01), m.noise(.02, 2000, 6000, .001, .006)), E['step1.off'] + .05, .12)
m.add(m.noise(.4, 300, 1500, .05, .2), E['step1.hide'], .08)  # torch slides under the pillow
owl(E['step1.just'] + .3)

# ---------- rule 2: the voice from the forest ----------
m.amb(m.bed_noise(100, 700, .5, .25), E['step2.night'], scEnd['step2'], .03)
whisper = m.band(m.rnd.standard_normal(int(2.4 * SR)), 1500, 6000) * np.sin(np.linspace(0, np.pi * 3, int(2.4 * SR))) ** 2
m.add(m.echo(whisper, (.3, .6), .4), E['step2.voice'], .05, pan=.5)
m.sting(E['step2.asleep'], .18)
m.add(m.noise(.7, 200, 1500, .1, .4), E['step2.cover'], .1)  # blanket over the head
m.heartbeat(E['step2.cover'], scEnd['step2'], bpm=105, gain=.12)

# ---------- rule 3: the bell, the footsteps around the cabin ----------
m.birds(sc0['step3'] + 2, E['step3.steps'], 4)
m.steps(E['step3.steps'], E['step3.ring'], .55, .06, pan=.3, lo=80, hi=700)
bell = m.layer(*[m.tone(f, 2.5, .002, 1.2, (1, 2.4, 3.9)) for f in (523.3, 784)])
m.add(bell, E['step3.ring'], .12)
m.add(bell, E['step3.ring'] + .6, .08)
m.sting(E['step3.prints'], .16)

# ---------- rule 4 ----------
m.boom(E['step4.never'], .3, 1.5)
crackle(E['step4.serious'], scEnd['step4'], 6, .03)

# ---------- the last night: counting ----------
m.amb(m.bed_noise(100, 700, .4, .2), sc0['night'], CUT, .02)
m.add(m.layer(m.hit(400, 300, .05, .01), m.noise(.02, 2000, 6000, .001, .006)), E['night.torch'], .15)  # torch click
for k, w in enumerate(E['count.n']):
    m.add(m.tone(220 * 2 ** (k / 12), .5, .005, .3, (1, 2)), w, .06)
m.add(m.layer(m.tone(207.7, 2, .005, 1.2, (1, 2, 3)), m.tone(311.1, 2, .005, 1.2)), E['count.seven'], .14)
m.sting(E['count.seven'] + .05, .25)
m.heartbeat(E['count.seven'], CUT, bpm=125, gain=.16)
m.add(m.tone(55, 3, .05, 2.5), E['end.six'], .16, bed=True)
m.add(m.noise(1.6, 150, 1200, .5, .6), E['end.turn'] - .6, .08)  # hair rustling on the pillow

m.finish('--voice' in sys.argv)

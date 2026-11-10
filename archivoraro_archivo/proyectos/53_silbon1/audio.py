# Music + SFX for «El Silbón · Parte 1». With --voice it lays narration.wav (with the whistle gaps) on top and ducks the bed.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR
from silbido import whistle

m = Mix(HERE, seed=531)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(7)


def bone(when, gain=.18, pan=0):      # dry bone on tile: hard click + hollow knock
    m.add(m.layer(m.hit(1900, 1300, .03, .015), m.hit(420, 260, .09, .05) * .7, m.noise(.03, 2500, 9000, .001, .02) * .5), when, gain, pan)


def rattle(when, n=7, gain=.12):
    for i in range(n): bone(when + i * .055 + rng.random() * .03, gain * (.6 + .4 * rng.random()), rng.random() * .6 - .3)


def growl(a, b, gain=.16):
    n = int((b - a) * SR); tt = np.arange(n) / SR
    x = m.band(rng.normal(0, 1, n), 70, 420) * (0.55 + 0.45 * np.sin(2 * np.pi * 23 * tt)) * (0.7 + 0.3 * np.sin(2 * np.pi * 1.7 * tt))
    env = np.clip(tt / .15, 0, 1) * np.clip((b - a - tt) / .25, 0, 1)
    m.add(m.norm(x * env), a, gain)


def bark(when, gain=.16, pan=.15):
    m.add(m.layer(m.hit(620, 300, .14, .06), m.noise(.12, 500, 3200, .002, .05) * .7, m.tone(380, .1, .005, .06) * .5), when, gain, pan)


def croak(when, gain=.03, pan=0):
    m.add(m.layer(m.tone(180 + rng.random() * 60, .12, .01, .06, harm=(1, .5, .3)) * (1 + 0 * rng.random())), when, gain, pan)


def put_whistle(when, far=0.0, gain=.32, pan=0):
    m.add(whistle(far=far, amp=.6, seed=int(when * 10) % 97), when, gain, pan)


# ---------- music ----------
m.drone([(36.7, .6), (55, .3), (73.4, .1)], 0, gain=.08, until=sc0['road'])
m.pulses(0, 3.0, end=sc0['road'])
m.drone([(41.2, .5), (61.7, .25), (82.4, .1)], sc0['road'], gain=.045, until=sc0['whistle'])
m.drone([(32.7, .7), (49, .35), (65.4, .15), (69.3, .12)], sc0['whistle'], gain=.07, until=sc0['home'], rise=(sc0['growl'], 5))
m.heartbeat(sc0['whistle'] + .5, scEnd['bark'], bpm=96, gain=.13)
m.riser(sc0['reveal'] - 1.5, E['reveal.tall'], gain=.25)
m.drone([(36.7, .6), (55, .3), (77.8, .1)], sc0['home'], gain=.05, until=sc0['wake'])
m.drone([(30.9, .7), (46.2, .35), (61.7, .15), (65.4, .12)], sc0['wake'], gain=.09, rise=(sc0['count'], 6))
m.heartbeat(E['count.hears'] - .2, CUT, bpm=104, gain=.15)
m.riser(CUT - 5, CUT, gain=.3)
m.whooshes_and_pops()

# ---------- llanos at night: crickets, frogs, wind in the grass ----------
m.amb(m.bed_noise(3200, 8200, .7, 9), 0, sc0['home'], .010)
m.amb(m.bed_noise(150, 900, .5, .25), sc0['road'], sc0['home'], .016)
for k in range(46):
    w = sc0['road'] + k * .9 + rng.random() * .6
    if w < sc0['home']: croak(w, .02 + .015 * rng.random(), rng.random() * 1.2 - .6)

# ---------- hook: bones laid out on the porch tiles, a faint whistle far away ----------
for i in range(8):
    w = .05 + i * .85
    if w < E['door0.l2'] - .2: bone(w, .2)
put_whistle(.6, far=1.0, gain=.12, pan=-.4)
m.sting(E['door0.bones'], .16)
m.add(m.tone(98, 2.0, .3, 1.5), E['door0.family'], .06)
m.sting(E['door0.dawn'], .2)

# ---------- road: footsteps on dirt, the party fading behind ----------
m.steps(sc0['road'] + .2, scEnd['road'], .45, .045, lo=200, hi=2400)
party_end = scEnd['road']
for k in range(int((party_end - sc0['road']) / .25)):    # far-off party: muffled maracas + bass thump
    w = sc0['road'] + k * .25; fade = 1 - (w - sc0['road']) / (party_end - sc0['road'])
    m.add(m.noise(.05, 3000, 7000, .002, .03), w, .012 * fade, -.5)
    if k % 2 == 0: m.add(m.hit(90, 60, .12, .06), w, .05 * fade, -.5)
m.ding(E['road.mateo'], .04, 1175); m.ding(E['road.canelo'], .04, 1319)

# ---------- flashback: warm and muffled ----------
m.add(m.sweep(400, 600, .6, .3), sc0['warn'], .04)
m.add(m.creak(.7), sc0['warn'] + .2, .05)
m.sting(E['warn.back'], .12)

# ---------- the whistle, near; rule 1; then the far whistle ----------
m.steps(sc0['whistle'], E['whistle.silba'] - .3, .45, .045, lo=200, hi=2400)
put_whistle(E['whistle.silba'] + .45, far=0.0, gain=.34, pan=-.15)
m.add(m.noise(.4, 200, 1200, .02, .3), E['whistle.near'], .05)
m.sting(E['whistle.near'], .16)
m.steps(sc0['rule1'] + .2, E['rule1.acc'], .45, .045, lo=200, hi=2400)
m.steps(E['rule1.acc'], scEnd['rule1'], .3, .05, lo=200, hi=2400)
m.amb(m.bed_noise(3200, 8200, .7, 9), E['rule1.off'], E['far.far'], .004)   # crickets drop
put_whistle(E['far.far'] + .45, far=.95, gain=.22, pan=.5)

# ---------- growl, rule 2, the reveal ----------
growl(E['growl.growl'] - .2, scEnd['growl'] - .2, .17)
bark(E['growl.growl'] + 1.4, .08); bark(E['growl.l2'] + 2.5, .07)
m.add(m.noise(1.5, 200, 1500, .3, 1.0), E['growl.sees'] - .3, .05)          # leaves rustling beside the road
m.add(m.creak(1.2, 30, 16), sc0['reveal'] + .3, .1)                         # trunks creak
m.sting(E['reveal.tall'], .26)
m.boom(E['reveal.tall'], .35, 2.2)
m.add(m.noise(2.5, 100, 800, .5, 1.5), E['reveal.thin'], .06)
rattle(E['reveal.bones'] - .1, 9, .16)
rattle(E['reveal.bones'] + .6, 6, .1)
m.sting(E['reveal.bones'], .22)

# ---------- bark: the shadow walks away ----------
for i in range(6): bark(E['bark.bark'] + i * .32, .2 - i * .015, .1)
m.add(m.sweep(300, 120, 1.6, .9), E['bark.away'] - .4, .07)
m.whoosh(E['bark.away'], .12)

# ---------- rule 3: running home ----------
m.steps(sc0['rule3'], scEnd['rule3'], .22, .06, lo=200, hi=2400)
m.ding(E['rule3.dogs'], .06, 1319); m.ding(E['rule3.whip'], .07, 1568)
m.add(m.noise(.12, 1500, 7000, .001, .06), E['rule3.whip'] + .05, .15)     # whip crack
m.add(m.hit(2400, 900, .03, .01), E['rule3.whip'] + .05, .2)

# ---------- home: the door, the bar, the whip on the wall ----------
m.amb(m.bed_noise(3200, 8200, .7, 9), sc0['home'], CUT, .003)              # crickets through the walls
m.add(m.creak(.8), sc0['home'] + .2, .1)
m.add(m.layer(m.noise(.35, 300, 2000, .02, .2)), E['home.lock'], .09)     # bar sliding
m.add(m.layer(m.hit(220, 120, .1, .05), m.metal(500, .25, .15) * .5), E['home.key'], .26)
m.ding(E['home.whip'], .06, 1175)

# ---------- 3:00 ----------
m.add(m.creak(1.2, 22, 14), sc0['wake'] + .1, .08)                          # hammock ropes
for i in range(6): m.add(m.tone(1600, .03, .001, .02), sc0['wake'] + .3 + i * .5, .035)   # the wall clock ticking
m.sting(E['wake.wake'], .16)
for ev in ('count.n1', 'count.n2', 'count.n3'):
    bone(E[ev] - .05, .26, -.2)
m.add(m.noise(1.2, 200, 1200, .2, .8), E['count.door'], .04)               # something drags by the door
m.sting(E['count.hears'], .2)
m.add(m.noise(2.0, 80, 400, .8, 1.0), sc0['grandma'], .04)                 # grandma's slow breathing
m.add(m.noise(2.0, 80, 400, .8, 1.0), sc0['grandma'] + 2.4, .04)
m.sting(E['grandma.no'], .24)
m.add(m.tone(98, 2.0, .3, 1.5), E['grandma.two'], .07)
put_whistle(sc0['whip'] - .2, far=.8, gain=.14, pan=.3)                    # it is still out there

m.finish('--voice' in sys.argv)

# Music + SFX for «Hiroo Onoda · ¿Sabías que…?». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=471)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rnd = m.rnd


def stamp(when, gain=.3):
    m.add(m.layer(m.hit(180, 70, .18, .06), m.noise(.06, 300, 3000, .001, .03)), when, gain)


def paper(when, gain=.05, pan=0):
    m.add(m.noise(.12, 1500, 7000, .005, .08), when, gain, pan)


def crackle(a, b, gain=.025):
    k = a
    while k < b:
        m.add(m.noise(.02, 1000, 6000, .001, .01), k, gain + .015 * rnd.random())
        k += .22 + .35 * rnd.random()


# Japanese "in" scale (E F A B C) for the melodies
E4, F4, A4, B4, C5, E5 = 329.6, 349.2, 440.0, 493.9, 523.3, 659.3
A3, B3, C4 = 220.0, 246.9, 261.6

# ---------- music ----------
m.drone([(41.2, .6), (61.7, .3), (82.4, .12)], 0, gain=.07, until=sc0['leaflets'])
m.melody([(E4, 2), (F4, 1), (A4, 3), (B4, 1), (A4, 2), (F4, 3)], .4, sc0['arrive'], .36, .02, pan=-.2)
m.pulses(sc0['leaflets'], sc0['rule1'], end=sc0['camp'])
m.drone([(36.7, .6), (55, .3), (73.4, .12)], sc0['leaflets'], gain=.06, until=sc0['meet'])
m.pulses(sc0['rule1'], sc0['years'], end=sc0['years'])
m.drone([(32.7, .7), (49, .3), (65.4, .15)], sc0['meet'], gain=.08, until=sc0['shop'])
m.heartbeat(E['meet.appear'], sc0['shop'], bpm=96, gain=.13)
m.drone([(43.7, .6), (65.4, .3), (87.3, .12)], sc0['shop'], gain=.06, until=CUT)
m.melody([(A3, 2), (C4, 2), (E4, 3), (F4, 1), (E4, 2), (C4, 2), (B3, 4), (A3, 6)], sc0['read'], CUT - .3, .42, .022, pan=.1)
m.riser(CUT - 4.5, CUT, gain=.26)
m.whooshes_and_pops()

# ---------- hook: night jungle ----------
m.amb(m.bed_noise(3000, 8000, .6, 7), 0, sc0['arrive'], .008)
m.amb(m.bed_noise(80, 500, .4, .2), 0, sc0['arrive'], .02)
m.boom(E['hook.years'], .3)
m.sting(E['hook.years'] + .05, .16)
m.sting(E['hook.ended'], .2)

# ---------- arrive: the beach, the map ----------
m.amb(m.bed_noise(200, 2000, .5, .2), sc0['arrive'], sc0['order'], .03)
m.birds(sc0['arrive'] + .5, E['arrive.island'], 3)
m.steps(sc0['arrive'] + .1, E['arrive.island'] - .4, .4, .03, lo=300, hi=3000)
m.ding(E['arrive.name'], .06, 1047)
m.whoosh(E['arrive.island'] - .3, .2)
m.ding(E['arrive.lubang'], .08, 1319)

# ---------- order: the tent, the stamp ----------
m.amb(m.bed_noise(100, 900, .3, .1), sc0['order'], sc0['leaflets'], .015)
stamp(E['order.no'], .4)
m.add(m.knock(), E['order.no'] - .1, .06)  # heels click

# ---------- leaflets: plane, paper rain ----------
m.amb(m.bed_noise(200, 1500, .4, .2), sc0['leaflets'], sc0['trap'], .012)
m.add(m.sweep(95, 75, 4.5, 1.5), E['leaflets.plane'] - 1.0, .12)
m.add(m.noise(4.5, 60, 600, 1.5, 1.5), E['leaflets.plane'] - 1.0, .06)
for k in range(14):
    paper(E['leaflets.drop'] + k * .2 + .1 * rnd.random(), .03, rnd.uniform(-.6, .6))
m.sting(E['leaflets.text'], .16)

# ---------- trap: reading, crumpling ----------
m.amb(m.bed_noise(3000, 8000, .6, 5), sc0['trap'], sc0['rule3'], .006)
m.birds(sc0['trap'], sc0['rule3'], 4)
paper(E['trap.read'], .05)
for k in range(5):
    paper(E['trap.trap'] + k * .07, .07)
m.sting(E['trap.trap'] + .1, .14)

# ---------- camp + the three rules ----------
crackle(sc0['camp'], sc0['rule1'], .02)
m.ding(sc0['rule1'] + .1, .05, 1175)
m.add(m.knock(), sc0['rule1'] + .2, .05)
m.ding(sc0['rule2'] + .1, .05, 1175)
stamp(E['rule2.lie'], .32)
paper(E['rule2.letters'] - .2, .06)
stamp(E['rule2.family'], .28)
m.ding(sc0['rule3'] + .1, .05, 1175)
m.amb(m.bed_noise(3000, 8000, .6, 8), sc0['rule3'], sc0['years'], .007)
crackle(sc0['rule3'], sc0['years'], .025)
for k in range(5):
    m.add(m.noise(.18, 2000, 7000, .02, .1), sc0['rule3'] + .3 + k * .45, .02)  # the cloth on the barrel
m.add(m.layer(m.hit(1800, 1200, .04, .01), m.noise(.02, 2000, 8000, .001, .006)), E['rule3.rifle'], .14)  # bolt click
m.ding(E['rule3.clean'], .07, 1568)

# ---------- years: rain and sun, men leave ----------
m.amb(m.bed_noise(1500, 7000, .3, 1), sc0['years'], sc0['meet'], .02)
m.steps(E['years.surr'], E['years.surr'] + 1.4, .3, .035, pan=-.6)
m.add(m.tone(220, 1.6, .05, 1.2), E['years.die'], .05)
m.add(m.tone(196, 2.0, .05, 1.6), E['years.alone'], .06)
m.sting(E['years.alone'] + .1, .12)

# ---------- meet: night camp, the soldier appears ----------
m.amb(m.bed_noise(3000, 8000, .6, 9), sc0['meet'], sc0['shop'], .009)
crackle(sc0['meet'], sc0['shop'], .03)
m.add(m.noise(.8, 400, 3000, .05, .5), E['meet.appear'] - .3, .1)  # bushes
m.steps(E['meet.appear'], E['meet.appear'] + 1.3, .38, .04, pan=-.4)
m.sting(E['meet.appear'] + .1, .22)
m.add(m.layer(m.hit(2000, 1500, .03, .01), m.noise(.04, 2000, 9000, .001, .02)), scEnd['meet'] - .35, .2)  # camera click

# ---------- shop: Japan, a bell over the door ----------
m.amb(m.bed_noise(150, 1200, .4, .1), sc0['shop'], sc0['read'], .015)
m.ding(sc0['shop'] + .15, .06, 2093)
m.ding(sc0['shop'] + .3, .05, 2637)
m.ding(E['shop.cmd'], .05, 1047)
m.ding(E['shop.books'], .05, 1319)

# ---------- read + salute ----------
m.amb(m.bed_noise(3000, 8000, .6, 5), sc0['read'], CUT, .006)
m.birds(sc0['read'], CUT - 1, 4)
paper(E['read.read'] - .2, .07)
m.add(m.knock(), E['salute.salute'], .07)
m.add(m.metal(420, .5, .3), E['salute.give'] + .4, .05)
m.ding(E['salute.works'] + .1, .08, 1568)

# ---------- end ----------
m.sting(E['end.him'], .16)

m.finish('--voice' in sys.argv)

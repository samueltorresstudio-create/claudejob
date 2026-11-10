# Music + SFX for «Apagón · Parte 2 (día 3: la comida)». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=491)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rnd = m.rnd


def bark(when, gain=.12, pan=.2):
    m.add(m.layer(m.hit(560, 280, .16, .06), m.noise(.14, 400, 2600, .002, .05) * .6), when, gain, pan)


def knock(when, gain=.3):
    m.add(m.layer(m.hit(130, 70, .12, .05), m.noise(.04, 200, 1800, .001, .03)), when, gain)


def sizzle(a, b, gain=.03):
    m.amb(m.bed_noise(2500, 9000, .8, 6), a, b, gain)


# ---------- music ----------
m.drone([(41.2, .6), (61.7, .3), (82.4, .12)], 0, gain=.07, until=sc0['order'])
m.pulses(0, 2.5, end=sc0['hunger'])
m.drone([(36.7, .6), (55, .3), (73.4, .1)], sc0['order'], gain=.05, until=sc0['gas'])
m.drone([(32.7, .7), (49, .35), (65.4, .15), (69.3, .1)], sc0['gas'], gain=.08, until=sc0['water'])
m.heartbeat(E['gas.sleep'] - .3, scEnd['gas'], bpm=92, gain=.13)
m.drone([(36.7, .6), (55, .3), (77.8, .1)], sc0['water'], gain=.06, until=sc0['radio'])
m.drone([(30.9, .7), (46.2, .35), (61.7, .15), (65.4, .12)], sc0['radio'], gain=.09, rise=(sc0['radio'], 5))
m.pulses(sc0['tap'], scEnd['tap'] - 1, end=CUT)
m.riser(CUT - 5, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- hook: empty supermarket, trolley, then the fridge ----------
m.amb(m.bed_noise(200, 1500, .4, .3), 0, sc0['hunger'], .02)
m.add(m.noise(2.4, 300, 2500, .05, .4), 0, .05)                      # trolley wheels rattling
for k in range(8): m.add(m.metal(900 + 120 * (k % 3), .12, .08), .1 + k * .28, .025)
m.steps(0, 2.4, .2, .045)
m.boom(.05, .28)
m.add(m.creak(.6), E['hook.fridge'] - .2, .1)                         # fridge door
m.add(m.layer(m.hit(400, 200, .06, .03)), E['hook.fridge'] - .25, .08)
m.amb(m.bed_noise(180, 380, .9, 7), E['hook.fridge'], sc0['hunger'], .012)   # flies
m.sting(E['hook.smell'], .16)

# ---------- hunger: queue in the street, the push-in ----------
m.amb(m.bed_noise(250, 2200, .5, .3), sc0['hunger'], sc0['order'], .022)
m.steps(sc0['hunger'] + .2, E['hunger.you'] - .2, .38, .035, pan=.4)
m.add(m.sweep(220, 160, 1.4, .8), E['hunger.you'], .05)
m.whoosh(E['hunger.you'] - .1, .14)

# ---------- order + cook ----------
m.amb(m.bed_noise(80, 400, .3, .2), sc0['order'], sc0['gas'], .012)
for ev, f in (('order.n1', 1047), ('order.n2', 1175), ('order.n3', 1319)): m.ding(E[ev], .06, f)
m.add(m.noise(.5, 300, 2500, .02, .3), E['cook.milk'] - .5, .05)
m.add(m.layer(m.hit(200, 90, .12, .05), m.noise(.15, 300, 2500, .005, .08)), E['cook.milk'] + .25, .22)   # plof into the bin
m.add(m.creak(.5), E['cook.chicken'] - .3, .08)
m.add(m.noise(.8, 3000, 9000, .05, .5), E['cook.cold'] - .2, .03)    # frost
m.ding(E['cook.eat'], .06, 1568)
bark(E['cook.eat'] + .3, .09)

# ---------- gas: the silent killer ----------
m.add(m.noise(.25, 2000, 8000, .01, .1), E['gas.gas'] - .4, .06)     # click of the stove
m.amb(m.bed_noise(800, 3000, .5, 2), E['gas.gas'] - .3, scEnd['gas'], .015)   # burner hiss
m.add(m.noise(3.0, 60, 300, 1.0, 1.5), E['gas.co'], .08)
m.sting(E['gas.smell'], .14)
m.add(m.tone(98, 2.0, .3, 1.5), E['gas.sleep'], .07)

# ---------- balcony: sizzling pan ----------
m.amb(m.bed_noise(300, 2500, .4, .2), sc0['balcony'], sc0['ambulance'], .015)
m.birds(sc0['balcony'], sc0['ambulance'], 3)
m.steps(sc0['balcony'], E['balcony.bal'], .4, .035)
sizzle(E['balcony.bal'] - .3, scEnd['balcony'], .03)
m.add(m.sweep(700, 1000, .4, .2), E['balcony.bruno'] + .2, .04)    # Bruno whines for the food

# ---------- ambulance ----------
m.amb(m.bed_noise(150, 1200, .4, .2), sc0['ambulance'], sc0['water'], .02)
k = 0.0
while sc0['ambulance'] + k < scEnd['ambulance']:
    m.add(m.tone(960 if int(k / .5) % 2 == 0 else 720, .48, .02, .05), sc0['ambulance'] + k, .035, .3); k += .5
m.steps(E['ambulance.amb'], E['ambulance.fam'] + 1.6, .32, .04)
m.sting(E['ambulance.win'], .2)

# ---------- water + count ----------
m.amb(m.bed_noise(3000, 8000, .6, 8), sc0['water'], CUT, .005)       # crickets
m.add(m.noise(.6, 400, 3000, .05, .3), E['water.two'] - .2, .06)     # water poured
m.ding(E['water.two'], .06, 1175)
m.add(m.noise(1.2, 300, 2000, .1, .6), E['water.bruno'] + .2, .05)   # Bruno laps
m.ding(E['water.bruno'], .06, 1319)
for i in range(12): m.add(m.hit(1500, 1100, .05, .02), E['count.count'] - .2 + i / 5.5, .05)
m.ding(E['count.nine'], .08, 1568)

# ---------- radio ----------
m.add(m.layer(m.hit(1800, 1200, .04, .01), m.noise(.02, 2000, 8000, .001, .006)), E['radio.on'], .2)
m.amb(m.bed_noise(1500, 6000, .6, 3), E['radio.on'], scEnd['radio'], .012)
m.sting(E['radio.four'], .24)
m.heartbeat(E['radio.four'], CUT, bpm=96, gain=.14)

# ---------- tap: the last drops ----------
for i in range(4): m.add(m.tone(1300 - i * 50, .08, .002, .06), sc0['tap'] + .3 + i * .7, .05)
m.add(m.metal(320, .5, .3), E['tap.dry'] - .1, .05)                   # tap handle
m.add(m.noise(.5, 100, 800, .02, .3), E['tap.dry'], .06)               # empty pipe

# ---------- door ----------
for i in range(3): knock(E['door.knock'] + i * .28, .32)
for i in range(3): knock(E['door.knock'] + 1.3 + i * .28, .26)
bark(E['door.knock'] + .4, .12, -.2)
bark(E['door.knock'] + .9, .1, -.2)
m.steps(E['door.knock'] + .4, E['door.open'], .4, .04)
m.add(m.creak(.9), E['door.open'] - .2, .12)
m.sting(E['door.bottle'], .22)

m.finish('--voice' in sys.argv)

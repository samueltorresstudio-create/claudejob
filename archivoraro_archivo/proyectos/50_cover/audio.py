# Music + SFX for «Apagón · Parte 3 (día 7: el agua)». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=503)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def bark(when, gain=.12, pan=.2):
    m.add(m.layer(m.hit(560, 280, .16, .06), m.noise(.14, 400, 2600, .002, .05) * .6), when, gain, pan)


def knock(when, gain=.3):
    m.add(m.layer(m.hit(120, 60, .14, .06), m.noise(.05, 200, 1600, .001, .03)), when, gain)


def gush(a, b, gain=.05, lo=400, hi=4000):   # running water
    m.amb(m.bed_noise(lo, hi, .5, 9), a, b, gain, fade=.08)


def drip(when, gain=.06, f=1300):
    m.add(m.tone(f, .08, .002, .06), when, gain)


# ---------- music ----------
m.drone([(36.7, .6), (55, .3), (73.4, .12)], 0, gain=.08, until=sc0['door'])
m.pulses(0, 2.0, end=sc0['door'])
m.drone([(41.2, .6), (61.7, .3), (82.4, .1)], sc0['door'], gain=.05, until=sc0['termo'])
m.drone([(43.7, .5), (65.4, .3), (87.3, .1)], sc0['termo'], gain=.045, until=sc0['storm'])
m.drone([(32.7, .7), (49, .35), (65.4, .15)], sc0['storm'], gain=.07, until=sc0['gift'])
m.drone([(36.7, .6), (55, .3), (77.8, .1)], sc0['gift'], gain=.05, until=sc0['portal'])
m.drone([(30.9, .7), (46.2, .35), (61.7, .15), (65.4, .12)], sc0['portal'], gain=.09, rise=(sc0['portal'], 5))
m.heartbeat(sc0['portal'] + .3, CUT, bpm=94, gain=.14)
m.riser(CUT - 5, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- hook: the tap coughs air ----------
m.add(m.metal(320, .5, .3), .05, .07)                                   # tap handle
for k in range(9): m.add(m.noise(.12, 300 + 200 * (k % 3), 3500, .005, .08), .1 + k * .26, .12, .1)   # coughs of air
gush(0, E['hook.air'], .04)
m.add(m.noise(.9, 80, 600, .02, .5), E['hook.air'], .09)               # pipe gurgle
m.boom(.05, .25)
drip(E['hook.dry'] + .35, .07)
m.sting(E['hook.dry'], .18)

# ---------- pumps: calendar, the generator dies ----------
for i in range(7): m.add(m.noise(.08, 1500, 7000, .002, .05), .05 + sc0['pumps'] + i * .13, .05)   # pages flipping
m.amb(m.bed_noise(40, 160, .6, 14), E['pumps.pumps'] - .3, E['pumps.gen'] + .2, .1, fade=.1)        # generator rumble
m.add(m.sweep(110, 30, 1.0, .6), E['pumps.gen'], .1)                     # engine winding down
m.add(m.layer(m.hit(150, 50, .4, .2), m.metal(220, .4, .2)), E['pumps.fuel'], .3)   # CLONC
m.sting(E['pumps.fuel'] + .1, .16)

# ---------- three days ----------
m.add(m.sweep(220, 150, 1.4, .8), E['three.three'] - .2, .06)
m.whoosh(E['three.three'] - .3, .14)
m.boom(E['three.three'], .25, 1.5)

# ---------- door + the neighbour ----------
for i in range(4): knock(sc0['door'] + .1 + i * .3, .34)
for i in range(4): knock(sc0['door'] + 1.5 + i * .3, .3)
bark(sc0['door'] + .5, .12, -.2)
bark(sc0['door'] + 1.1, .1, -.2)
m.steps(sc0['door'] + .3, E['door.open'], .4, .04)
m.add(m.creak(.9), E['door.open'] - .3, .12)
m.add(m.noise(.4, 2000, 8000, .02, .3), E['door.laugh'] - .3, .05)      # flashback shimmer
m.ding(E['door.laugh'] - .2, .05, 1568)
drip(E['kids.drop'] + .55, .08, 1150)
m.sting(E['kids.drop'] + .2, .16)

# ---------- better: the idea ----------
m.ding(E['better.teach'], .08, 1319)
m.ding(E['better.teach'] + .12, .07, 1760)

# ---------- termo + cistern ----------
m.ding(E['termo.house'], .06, 1175)
m.add(m.sweep(400, 1600, .6, .2), E['termo.termo'] - .2, .04)          # x-ray scan
m.amb(m.bed_noise(300, 1500, .4, 3), E['termo.termo'], E['termo.cist'] - .2, .015)   # bubbling inside
m.ding(E['termo.eighty'], .07, 1568)
m.add(m.layer(m.hit(500, 300, .08, .04), m.noise(.1, 800, 4000, .005, .06)), E['termo.cist'] - .2, .14)   # ceramic lid
m.ding(E['termo.six'], .07, 1760)

# ---------- valve: water! ----------
m.add(m.metal(420, .4, .25), E['valve.open'], .08)
gush(E['valve.water'] - .1, scEnd['valve'], .07, 300, 3000)
m.add(m.noise(.6, 200, 2500, .05, .3), E['valve.water'] - .1, .1)
m.ding(E['valve.water'] + .3, .08, 1568)

# ---------- boil + bleach ----------
m.add(m.sweep(300, 200, .5, .2), E['boil.where'] - .4, .04)
m.add(m.noise(.5, 2000, 9000, .01, .4), E['boil.dis'], .06)            # zap the germs
m.ding(E['boil.dis'] + .1, .06, 1319)
m.add(m.noise(.25, 2000, 8000, .01, .1), E['boil.boil'] - .1, .05)       # click of the stove
m.amb(m.bed_noise(150, 900, .7, 6), E['boil.boil'], E['boil.drops'] + .1, .03)   # rolling boil
for i in range(6): m.add(m.tone(1800 - 40 * i, .03, .001, .02), E['boil.boil'] + .2 + i * .18, .03)  # stopwatch ticks
drip(E['boil.drops'] + .3 + .3, .09, 1400)
drip(E['boil.drops'] + .75 + .3, .09, 1500)
m.ding(E['boil.nop'], .06, 1175)
for i in range(6): m.add(m.tone(1800, .03, .001, .02), E['boil.wait'] + i * .25, .035)
m.ding(E['boil.half'], .07, 1568)

# ---------- storm ----------
m.amb(m.bed_noise(60, 400, .5, .2), sc0['storm'], sc0['rain'], .05)
m.boom(E['storm.thunder'], .55, 2.6)
m.add(m.noise(2.2, 40, 900, .01, 1.8), E['storm.thunder'], .25)
bark(E['storm.thunder'] + .2, .1, .3)

# ---------- rain ----------
m.amb(m.bed_noise(1500, 9000, .35, 1.5), sc0['rain'] - .3, scEnd['bruno'], .055, fade=.6)   # rain hiss
m.amb(m.bed_noise(200, 1200, .3, .5), sc0['rain'], scEnd['bruno'], .02)
for i in range(30): drip(sc0['rain'] + .2 + i * .25 + (i % 3) * .05, .02, 900 + (i * 137) % 900)   # drops on pots
m.add(m.layer(m.hit(300, 180, .1, .05), m.metal(500, .3, .2)), E['rain.collect'] - .2, .1)   # pot set down
m.add(m.layer(m.hit(320, 200, .1, .05), m.metal(600, .3, .2)), E['rain.pots'], .08)
m.add(m.layer(m.hit(260, 160, .1, .05)), E['rain.buckets'], .08)
m.add(m.noise(.6, 600, 5000, .05, .4), E['rain.plastic'] - .1, .06)     # tarp rustle
gush(E['rain.plastic'] + .4, scEnd['rain'], .04, 500, 3500)

# ---------- Bruno drinks ----------
for i in range(6): m.add(m.noise(.07, 600, 3500, .003, .05), E['bruno.drink'] + i * .2, .09)   # lap, lap

# ---------- grey water ----------
m.amb(m.bed_noise(80, 400, .3, .2), sc0['grey'], sc0['gift'], .012)
m.add(m.layer(m.hit(200, 70, .3, .15), m.noise(.1, 300, 2000, .005, .06)), E['grey.never'], .22)
m.sting(E['grey.never'] + .05, .14)
m.add(m.noise(1.2, 150, 1500, .05, .6), E['grey.chain'], .12)           # glug into the bowl
m.ding(E['grey.mop'], .06, 1319)

# ---------- gift ----------
m.amb(m.bed_noise(3000, 8000, .6, 8), sc0['gift'], CUT, .004)           # crickets
m.add(m.creak(.7), sc0['gift'] + .05, .08)
m.ding(E['gift.bottles'], .06, 1175)
bark(E['gift.bruno'] + .2, .1)
m.ding(E['gift.bruno'], .07, 1568)

# ---------- portal + end ----------
m.steps(sc0['portal'], E['portal.smell'] - .2, .4, .04, echo=True)
m.amb(m.bed_noise(180, 380, .9, 7), E['portal.smell'] - .2, scEnd['end'], .012)   # flies
m.sting(E['portal.smell'], .18)
m.add(m.tone(98, 2.0, .3, 1.5), E['end.chain'], .07)
m.sting(E['end.danger'], .24)

m.finish('--voice' in sys.argv)

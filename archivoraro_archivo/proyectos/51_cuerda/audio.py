# Music + SFX for «La cuerda» (Joe Simpson, Siula Grande 1985). With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=511)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def creak_rope(when, gain=.08):
    m.add(m.creak(.5, 30, 18), when, gain)


def windbed(a, b, gain=.05):
    m.amb(m.bed_noise(200, 2500, .7, .35), a, b, gain, fade=.4)


# ---------- music ----------
m.drone([(32.7, .7), (49, .35), (65.4, .15)], 0, gain=.08, until=sc0['mountain'])
m.pulses(0, 3.0, end=sc0['mountain'])
m.drone([(43.7, .5), (65.4, .3), (87.3, .1)], sc0['mountain'], gain=.05, until=sc0['fall'])
m.drone([(36.7, .6), (55, .3), (73.4, .12)], sc0['fall'], gain=.07, until=sc0['cut'])
m.heartbeat(sc0['stuck'], scEnd['cut'], bpm=88, gain=.15)
m.drone([(30.9, .7), (46.2, .35), (61.7, .15)], sc0['crevasse'], gain=.06, until=sc0['light'])
m.drone([(41.2, .6), (61.7, .3), (82.4, .1)], sc0['light'], gain=.05, until=sc0['fire'])
m.pulses(sc0['watch'], scEnd['watch'] - 1, end=scEnd['days'])
m.drone([(32.7, .7), (49, .35), (65.4, .15), (69.3, .1)], sc0['fire'], gain=.07, until=sc0['joe'], rise=(sc0['shout'], 4))
m.drone([(43.7, .5), (55, .35), (65.4, .3), (87.3, .12)], sc0['joe'], gain=.06, until=CUT)
m.riser(CUT - 4, CUT, gain=.28)
m.whooshes_and_pops()

# ---------- wind everywhere on the mountain ----------
windbed(0, sc0['mountain'], .07)
windbed(sc0['mountain'], sc0['fall'], .025)
windbed(sc0['fall'], sc0['crevasse'], .06)
windbed(sc0['alone'], sc0['alive'], .02)
windbed(sc0['you'], CUT, .07)

# ---------- hook ----------
creak_rope(.2); creak_rope(1.6, .07)
m.add(m.layer(m.hit(140, 60, .3, .15), m.noise(.2, 300, 3000, .005, .1)), E['hook.drag'], .3)
creak_rope(E['hook.drag'] + .1, .12)
m.add(m.metal(1400, .25, .15), E['hook.q'] + .1, .06)          # knife opens
m.sting(E['hook.q'], .2)

# ---------- mountain + fall ----------
m.ding(E['mountain.joe'], .05, 1175); m.ding(E['mountain.simon'], .05, 1319)
for i in range(19): m.add(m.tone(900 + i * 30, .05, .002, .04), E['mountain.mount'] + i * .06, .025)
m.ding(E['mountain.six'], .07, 1568)
m.add(m.noise(.8, 400, 5000, .05, .5), E['fall.slip'] - .2, .12)   # slide on the snow
m.add(m.layer(m.hit(400, 90, .12, .05), m.noise(.06, 1500, 6000, .001, .04)), E['fall.brk'], .35)   # crack
m.boom(E['fall.brk'], .3, 1.4)
m.sting(E['fall.brk'] + .1, .2)

# ---------- lowering, the edge, stuck ----------
for i in range(6): creak_rope(sc0['lower'] + .3 + i * .6, .06)
m.add(m.noise(1.5, 200, 2000, .05, 1.0), E['edge.edge'] - .2, .08)
creak_rope(E['edge.hang'], .12)
m.sting(E['edge.voidw'], .16)
m.add(m.noise(1.2, 300, 3000, .1, .8), E['stuck.give'] - .8, .1)   # snow sliding
m.add(m.layer(m.hit(200, 80, .2, .1)), E['stuck.up'], .12); m.add(m.layer(m.hit(200, 80, .2, .1)), E['stuck.down'], .12)
for i in range(8): m.add(m.tone(1700, .03, .001, .02), sc0['hour'] + i * .18, .04)   # clock ticks

# ---------- the cut ----------
m.add(m.metal(1400, .3, .2), E['cut.knife'] - .3, .07)
creak_rope(E['cut.cut'] - .5, .1)
m.add(m.layer(m.hit(900, 300, .05, .02), m.noise(.12, 1500, 9000, .001, .08)), E['cut.cut'], .45)   # SNAP
m.add(m.sweep(600, 80, .9, .5), E['cut.cut'] + .05, .1)
m.boom(E['cut.cut'] + .05, .45, 2.2)

# ---------- the crevasse ----------
m.add(m.sweep(900, 200, 1.6, .4), sc0['crevasse'], .06)
m.add(m.noise(1.8, 300, 4000, .3, .5), sc0['crevasse'], .07)
m.add(m.layer(m.hit(120, 50, .4, .2), m.noise(.3, 200, 2000, .01, .2)), scEnd['crevasse'] - .5, .45)
m.amb(m.bed_noise(60, 300, .4, .2), scEnd['crevasse'], sc0['alone'] + .3, .03)

# ---------- dawn, alive, light ----------
m.steps(sc0['alone'], scEnd['alone'], .5, .05, lo=300, hi=3000)
m.sting(E['alone.dead'], .14)
m.add(m.noise(.8, 300, 1200, .1, .5), E['alive.alive'] - .2, .06)       # a breath
m.ding(E['alive.alive'], .06, 1319)
m.amb(m.bed_noise(60, 300, .4, .2), sc0['alive'], sc0['distance'], .03)
for i in range(5): m.add(m.tone(1300 - i * 40, .08, .002, .06), sc0['light'] + .4 + i * .7, .03)  # drips
m.ding(E['light.light'], .08, 1568); m.ding(E['light.light'] + .12, .07, 1760)

# ---------- 8 km, crawl, watch, days ----------
for i in range(8): m.add(m.tone(1000 + i * 60, .05, .002, .04), E['distance.km'] + i * .12, .03)
m.sting(E['distance.food'], .1)
m.sting(E['distance.leg'], .12)
m.amb(m.bed_noise(300, 3000, .4, .3), sc0['crawl'], sc0['fire'], .025)
for i in range(12): m.add(m.noise(.25, 300, 2500, .02, .15), sc0['crawl'] + .2 + i * .55, .05)   # dragging on gravel
for i in range(4): m.add(m.tone(3200, .05, .001, .03), E['watch.watch'] + i * .5, .05)          # watch beeps
m.ding(E['watch.twenty'], .07, 1568)
m.ding(E['watch.other'], .07, 1760)

# ---------- camp: fire, the shout ----------
m.amb(m.bed_noise(800, 5000, .8, 12), sc0['fire'], sc0['shout'], .035)   # crackle
m.amb(m.bed_noise(3000, 8000, .6, 8), sc0['fire'], CUT, .004)
m.add(m.noise(1.2, 500, 4000, .1, .6), E['fire.burn'] - .2, .06)
m.sting(E['fire.clothes'], .14)
m.add(m.sweep(500, 380, .9, .5), E['shout.shout'], .05)
m.add(m.sweep(480, 360, .9, .5), E['shout.shout'] + .9, .03)
m.sting(E['shout.shout'] + .2, .22)
m.ding(E['joe.joe'], .08, 1319)
m.sting(sc0['you'] + .1, .2)

m.finish('--voice' in sys.argv)

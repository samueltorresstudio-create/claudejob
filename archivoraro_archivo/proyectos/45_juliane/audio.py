# «Juliane Koepcke» — música y efectos. Con --voice mezcla narration.wav encima.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=451)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rnd = m.rnd

def wind(a, b, gain):  m.amb(m.bed_noise(200, 3000, .7, 1.5), a, b, gain)
def jungle_amb(a, b):
    m.amb(m.bed_noise(3000, 9000, .6, 7), a, b, .008)   # insects
    m.amb(m.bed_noise(120, 900, .3, .1), a, b, .012)    # leaves, distance
    m.birds(a, b, max(2, int((b - a) / 3)))
def water(a, b, gain=.02): m.amb(m.bed_noise(300, 4000, .5, .8), a, b, gain)
def caw(when, gain=.08, pan=0): m.add(m.layer(m.sweep(900, 520, .45, .3), m.noise(.4, 600, 2400, .02, .3) * .5), when, gain, pan)

# ---------- music ----------
m.drone([(41.2, .6), (61.7, .3), (82.4, .12)], 0, gain=.05, until=sc0['cabin'])
m.melody([(523.3, 2), (587.3, 1), (659.3, 3), (587.3, 2), (523.3, 4)], sc0['cabin'], sc0['storm'], .32, .016, pan=-.2)
m.drone([(38.9, .6), (58.3, .3), (77.8, .15)], sc0['storm'], gain=.07, until=sc0['wake'])
m.pulses(sc0['storm'], sc0['fall'], end=scEnd['fall'])
m.drone([(43.7, .5), (65.4, .25), (87.3, .12)], sc0['wake'], gain=.045, until=sc0['dad'])
m.melody([(392, 2), (440, 2), (523.3, 3), (440, 2), (392, 4)], sc0['dad'], sc0['stream'], .4, .02, pan=.2)
m.drone([(46.2, .5), (69.3, .25), (92.5, .12)], sc0['stream'], gain=.045, until=sc0['seats'])
m.drone([(36.7, .6), (55, .3), (73.4, .15)], sc0['seats'], gain=.06, until=sc0['river'])
m.drone([(43.7, .5), (65.4, .25)], sc0['river'], gain=.045, until=sc0['days'])
m.melody([(349.2, 2), (311.1, 2), (293.7, 3), (261.6, 4)], sc0['days'], sc0['hut'], .45, .018)
m.drone([(38.9, .6), (58.3, .3), (77.8, .15)], sc0['hut'], gain=.055, until=sc0['rescue'])
m.melody([(392, 1), (493.9, 1), (587.3, 2), (659.3, 2), (587.3, 1), (784, 4)], sc0['rescue'], sc0['today'], .34, .022, pan=.2)
m.drone([(49, .5), (73.4, .25), (98, .12)], sc0['today'], gain=.06, rise=(sc0['today'], 6))
m.riser(CUT - 5, CUT, gain=.26)
m.whooshes_and_pops()

# ---------- hook: wind of the fall ----------
wind(0, sc0['cabin'], .05)
m.sting(E['hook.km'], .2)
m.add(m.noise(1.5, 200, 2500, .3, .8), E['hook.surv'], .08)

# ---------- cabin: the turboprops ----------
m.add(m.layer(m.tone(110, 8.5, .5, 1, (1, 2, 3)), m.noise(8.5, 80, 400, .5, 1) * .4), sc0['cabin'], .05)
m.ding(E['cabin.date'], .05, 880)

# ---------- storm: rain, lightning, the break-up ----------
m.amb(m.bed_noise(1500, 8000, .4, 2), sc0['storm'], sc0['fall'], .03)
m.add(m.noise(1.0, 200, 3000, .1, .6), E['storm.storm'], .06)
m.boom(E['storm.bolt'], .45, 2.5)
m.add(m.noise(.25, 1000, 9000, .002, .2), E['storm.bolt'], .3)
m.add(m.layer(m.metal(220, 1.4, .5), m.noise(1.2, 300, 5000, .01, .8), m.hit(80, 30, .9, .4)), E['storm.split'], .35)

# ---------- fall: roaring wind, altitude ----------
m.add(m.layer(m.noise(5.5, 200, 4000, .5, 1.0), m.sweep(500, 200, 5.5, 1.0) * .3), sc0['fall'], .14)
m.sting(E['fall.para'], .18)
m.heartbeat(sc0['fall'], scEnd['fall'], bpm=140, gain=.16)

# ---------- the jungle ----------
jungle_amb(sc0['wake'], sc0['count'])
m.add(m.layer(m.hit(70, 30, .8, .4), m.noise(.5, 100, 1500, .01, .3)), sc0['wake'] - .05, .3)   # the landing
for k in ('clav', 'arm', 'sand'): m.add(m.hit(300, 150, .15, .06), E['wake.' + k], .06)
m.amb(m.bed_noise(60, 300, .2, .1), sc0['count'], sc0['dad'], .015)
m.sting(E['count.one'], .22)
m.amb(m.bed_noise(200, 1200, .3, .1), sc0['dad'], sc0['stream'], .01)
jungle_amb(sc0['stream'], sc0['seats'])
water(sc0['stream'], sc0['candy'], .02)
m.steps(sc0['stream'] + .5, scEnd['stream'], .5, .03)
for k in ('water', 'rios', 'people'): m.ding(E['stream.' + k], .05, {'water': 1047, 'rios': 1175, 'people': 1319}[k])
m.add(m.noise(.6, 2000, 7000, .02, .3), E['candy.bag'], .06)   # the bag crinkles
m.add(m.hit(200, 90, .2, .08), E['candy.no'], .08)
jungle_amb(sc0['seats'], sc0['river'])
for i in range(4): caw(E['seats.vult'] + i * .9, .07, (-1) ** i * .4)
m.sting(E['seats.pass'], .24)
m.heartbeat(E['seats.seats'], sc0['river'], bpm=110, gain=.15)
water(sc0['river'], sc0['days'], .04)
m.add(m.noise(1.5, 300, 3000, .2, .8), E['river.float'], .06)
water(sc0['days'], sc0['hut'], .02)
m.amb(m.bed_noise(3000, 9000, .6, 7), sc0['days'], sc0['hut'], .006)
for i in range(10): m.add(m.layer(m.sweep(220, 240, .5, .2), m.sweep(240, 210, .5, .2)), E['days.worms'] + i * .45, .015, (-1) ** i * .3)   # flies
jungle_amb(sc0['hut'], CUT)
water(sc0['hut'], sc0['today'], .02)
m.steps(sc0['hut'] + 3.2, E['hut.hut'] + .6, .5, .03)
m.add(m.creak(.6), E['hut.boat'], .06)
for i in range(6): m.add(m.noise(.12, 300, 1500, .01, .08), E['hut.pour'] + i * .16, .05)   # glug glug
m.sting(E['hut.pour'] + .3, .18)
m.steps(sc0['rescue'], E['rescue.men'] + .6, .4, .035, pan=-.4)
m.add(m.noise(1.2, 2000, 9000, .2, .6), E['rescue.spirit'], .05)
m.ding(E['eleven.n11'], .08, 1319)
m.sting(E['today.mata'], .16)

m.finish('--voice' in sys.argv)

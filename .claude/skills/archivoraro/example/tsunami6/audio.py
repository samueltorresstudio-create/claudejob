# Music + SFX for «Tsunami · Parte 6». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=337)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rnd = m.rnd


def bark(when, gain=.16, pan=.2):
    m.add(m.layer(m.hit(520, 260, .16, .06), m.noise(.14, 400, 2600, .002, .05) * .6), when, gain, pan)


def rotor(when, n=14, gain=.08):  # helicopter blades
    for k in range(n):
        m.add(m.noise(.05, 80, 700, .002, .03), when + k * .11, gain)


# ---------- music ----------
m.drone([(41.2, .6), (61.7, .3), (82.4, .12)], 0, gain=.06, until=sc0['radio'])
m.pulses(sc0['alley'], sc0['fight'], end=scEnd['fight'])
m.drone([(46.2, .6), (69.3, .3), (92.5, .15)], sc0['radio'], gain=.05, until=sc0['fire'])
m.pulses(sc0['radio'], scEnd['radio'], end=scEnd['radio'])
m.melody([(392, 2), (349.2, 1), (311.1, 3), (293.7, 2), (261.6, 4)], sc0['fire'], sc0['sea'], .42, .018, pan=-.2)
m.drone([(36.7, .7), (55, .3), (73.4, .15), (77.8, .1)], sc0['sea'], gain=.09, rise=(sc0['sea'], 8))
m.riser(CUT - 6, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- hook: the wave roars behind the four of them ----------
m.amb(m.bed_noise(40, 600, .5, .3), 0, sc0['back'], .06)
m.boom(E['hook.pay'], .32)
m.sting(E['hook.pay'] + .2, .18)

# ---------- the back door: three people walking out ----------
m.amb(m.bed_noise(150, 900, .4, .1), sc0['back'], sc0['reveal'], .012)
m.steps(sc0['back'] + .2, sc0['walkie'] + 1.0, .38, .04)
m.steps(sc0['back'] + .4, sc0['walkie'] + 1.0, .31, .025, pan=.4)

# ---------- the walkie falls and talks ----------
m.add(m.layer(m.hit(800, 300, .15, .05), m.noise(.1, 1000, 5000, .002, .05)), E['walkie.drop'] + .45, .2)
m.add(m.tone(1400, .12, .005, .08), E['walkie.talk'] - .15, .07)
m.add(m.noise(.4, 1500, 6000, .01, .2), E['walkie.talk'], .1)
m.amb(m.bed_noise(1500, 6000, .6, 3), E['walkie.voice'], sc0['reveal'], .02)
m.sting(E['walkie.dog'], .24)
m.heartbeat(E['walkie.dog'], sc0['alley'], bpm=110, gain=.16)

# ---------- reveal: the pins, the map, the helicopter ----------
for d in (.2, .5, .8, 1.1):
    m.add(m.hit(900, 600, .05, .02), sc0['reveal'] + d, .06)
m.sting(E['reveal.mapa'], .14)
rotor(E['reveal.heli'], 12, .07)

# ---------- the alley: running, Duque, sneaking up ----------
m.steps(sc0['alley'], sc0['alley'] + 1.4, .24, .05)
bark(E['alley.duque'], .14, .4)
m.steps(E['alley.rule'], E['alley.rule'] + 3, .7, .022)

# ---------- the fight ----------
m.add(m.layer(m.hit(150, 50, .25, .08), m.noise(.08, 200, 3000, .001, .04)), E['fight.hit'], .5)
m.add(m.layer(m.hit(90, 40, .4, .15), m.noise(.3, 100, 1200, .005, .15)), E['fight.fall'], .3)
m.steps(E['fight.flee'], E['fight.flee'] + 1.3, .2, .05, pan=.6)
m.add(m.noise(.08, 2000, 8000, .001, .03), E['fight.limp'] - .1, .12)  # the rope comes off
m.add(m.sweep(900, 600, .4, .2), E['fight.limp'] + .3, .05)  # a whimper
bark(E['fight.wag'], .1, .3)

# ---------- the radio: click, alarm, the wave, the helicopter, the numbers ----------
m.add(m.layer(m.hit(1800, 1200, .04, .01), m.noise(.02, 2000, 8000, .001, .006)), E['radio.on'], .2)
m.add(m.noise(.6, 1000, 6000, .01, .3), E['radio.on'] + .05, .06)
for k in range(8):
    m.add(m.tone(960 if k % 2 == 0 else 770, .34, .01, .05), E['radio.alert'] + k * .38, .07)
m.add(m.noise(2.5, 40, 400, .5, 1.5), E['radio.wave'], .16)
rotor(E['radio.heli'], 14, .07)
m.ding(E['radio.h22'], .07, 1047)
m.ding(E['radio.km'], .07, 1175)
m.add(m.hit(160, 80, .25, .1), E['radio.bag'], .14)

# ---------- the cars: a door, the glovebox, what he finds ----------
m.add(m.creak(.8), sc0['cars'] + .3, .1)
m.add(m.hit(1600, 900, .05, .02), sc0['cars'] + 1.4, .08)
m.ding(E['cars.water'], .06, 1047)
m.ding(E['cars.water'] + .25, .05, 1175)
m.ding(E['cars.can'], .06, 1319)
m.add(m.noise(.05, 2000, 9000, .001, .02), E['cars.lighter'], .16)
m.add(m.noise(.3, 300, 3000, .02, .2), E['cars.lighter'] + .05, .06)

# ---------- the mountain: wind, crickets, the fire ----------
m.amb(m.bed_noise(100, 800, .4, .1), sc0['fire'], CUT, .02)
m.amb(m.bed_noise(3000, 8000, .6, 8), E['fire.night'], CUT, .006)
m.add(m.noise(.4, 300, 3000, .02, .3), E['fire.fire'], .1)  # whoosh: it catches
k = 0.0
while E['fire.fire'] + k < sc0['sea']:
    m.add(m.noise(.02, 1000, 6000, .001, .01), E['fire.fire'] + k, .03 + .02 * rnd.random())
    k += .25 + .35 * rnd.random()
m.add(m.noise(.8, 200, 1000, .1, .4), E['sleep.head'], .05)  # Duque sighs

# ---------- the sea: it pulls back again ----------
m.add(m.noise(6.0, 200, 2000, 1.5, 3.0), E['sea.ret'], .14)
m.sting(E['sea.clock'], .2)
m.heartbeat(E['sea.ret'], CUT, bpm=96, gain=.16)

m.finish('--voice' in sys.argv)

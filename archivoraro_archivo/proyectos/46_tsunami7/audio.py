# Music + SFX for «Tsunami · Parte 7» (final). With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=407)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rnd = m.rnd


def bark(when, gain=.14, pan=.2):
    m.add(m.layer(m.hit(520, 260, .16, .06), m.noise(.14, 400, 2600, .002, .05) * .6), when, gain, pan)


def rotor(a, b, gain=.06, pan=.3):  # helicopter blades, a thump every 0.11 s
    k = a
    while k < b:
        m.add(m.noise(.05, 70, 650, .002, .03), k, gain, pan)
        k += .11


def rock(when, gain=.2, pan=0):
    m.add(m.layer(m.hit(140, 60, .3, .12), m.noise(.15, 200, 2500, .002, .08)), when, gain, pan)


# ---------- music ----------
m.drone([(36.7, .7), (55, .3), (73.4, .15), (77.8, .1)], 0, gain=.07, until=sc0['wave'])
m.pulses(sc0['climb'], sc0['wave'], end=scEnd['collapse'])
m.drone([(41.2, .6), (61.7, .3), (82.4, .15)], sc0['wave'], gain=.08, until=sc0['ridge'])
m.melody([(392, 2), (349.2, 1), (311.1, 3), (293.7, 4)], sc0['ridge'], sc0['quake'], .4, .016, pan=-.2)
m.drone([(46.2, .6), (69.3, .3), (92.5, .15)], sc0['quake'], gain=.06, until=sc0['summit'])
m.pulses(sc0['quake'], sc0['slide'], end=scEnd['slide'])
m.pulses(sc0['summit'], sc0['choice'], end=sc0['takeoff'])
m.melody([(261.6, 2), (311.1, 2), (392, 3), (349.2, 1), (392, 4), (466.2, 3), (392, 5)], sc0['choice'] + 3.5, sc0['horizon'], .42, .02, pan=.1)
m.drone([(32.7, .7), (49, .35), (65.4, .15), (69.3, .12)], sc0['horizon'], gain=.1, rise=(sc0['horizon'], 3))
m.riser(CUT - 5, CUT, gain=.34)
m.whooshes_and_pops()

# ---------- hook: the sea pulls back again ----------
m.amb(m.bed_noise(200, 2000, .5, .2), 0, sc0['wake'], .03)
m.add(m.noise(5.5, 200, 2000, 1.5, 2.5), E['hook.ret'] - 1.5, .13)
m.sting(E['hook.twenty'], .2)
m.boom(E['hook.again'], .26)
m.heartbeat(E['hook.again'], sc0['wave'], bpm=100, gain=.14)

# ---------- wake: dawn, the dog lifts its head ----------
m.amb(m.bed_noise(100, 800, .4, .1), sc0['wake'], sc0['wave'], .018)
m.birds(sc0['wake'], sc0['climb'], 3)
m.add(m.noise(.6, 300, 1500, .05, .3), E['wake.wake'] + .2, .05)
bark(E['wake.wake'] + 1.4, .09, .3)

# ---------- climb: steps uphill, the sea starts roaring ----------
m.steps(sc0['climb'], sc0['wave'], .36, .04)
m.steps(sc0['climb'] + .15, sc0['wave'], .22, .018, pan=.4)
m.add(m.noise(3.0, 30, 300, .8, 1.5), E['climb.roar'] - .3, .2)
bark(E['climb.roar'] + .6, .08, .5)

# ---------- the second wave hits the hotel ----------
m.add(m.noise(4.0, 30, 500, 1.5, 1.5), E['wave.wave'] - .2, .22)
m.ding(E['wave.first'], .05, 880)
m.boom(E['wave.hit'], .45)
m.add(m.noise(2.5, 300, 6000, .02, 1.6), E['wave.hit'] + .05, .2)
m.sting(E['wave.hotel'], .14)

# ---------- collapse: creak, tilt, crash into the water ----------
m.amb(m.bed_noise(60, 900, .6, .3), sc0['collapse'], sc0['ridge'], .04)
m.add(m.creak(1.2), E['collapse.crack'] - .1, .2)
m.add(m.layer(m.hit(200, 70, .3, .1), m.noise(.12, 500, 5000, .002, .06)), E['collapse.crack'], .3)
m.add(m.creak(1.4), E['collapse.tilt'] - .2, .16)
for k in range(6):
    m.add(m.metal(300 + 90 * k, .4, .25), E['collapse.tilt'] + .15 * k, .03)
m.boom(E['collapse.fall'] + .6, .55)
m.add(m.noise(3.0, 40, 1500, .05, 2.0), E['collapse.fall'] + .5, .3)
m.add(m.noise(2.5, 800, 7000, .05, 1.8), E['collapse.fall'] + .7, .14)

# ---------- ridge: silence, wind ----------
m.amb(m.bed_noise(200, 1200, .5, .1), sc0['ridge'], sc0['quake'], .015)
m.sting(E['ridge.up'], .1)

# ---------- quake + rule two ----------
m.amb(m.bed_noise(150, 1500, .4, .1), sc0['quake'], sc0['ravine'], .015)
m.steps(sc0['quake'], E['quake.shake'], .38, .04)
m.add(m.noise(3.8, 20, 160, .3, 1.5), E['quake.shake'] - .2, .4)
for k in range(10):
    m.add(m.noise(.06, 600, 4000, .002, .04), E['quake.shake'] + .2 + k * .27 + .1 * rnd.random(), .05, rnd.uniform(-.4, .6))
bark(E['quake.shake'] + .5, .12, -.3)
bark(E['quake.shake'] + 1.1, .1, -.3)
m.steps(E['quake.away'], E['quake.away'] + 1.4, .3, .04, pan=-.3)
m.ding(E['quake.rocks'], .05, 1175)

# ---------- slide ----------
m.add(m.noise(4.2, 25, 700, .3, 2.0), E['slide.slide'] - .2, .42)
for k in range(9):
    rock(E['slide.slide'] + .3 + k * .32 + .1 * rnd.random(), .14, rnd.uniform(0, .6))
m.boom(E['slide.buried'] - .2, .35)
m.sting(E['slide.buried'] + .1, .16)

# ---------- ravine + carry: heat, steps, breathing ----------
m.amb(m.bed_noise(300, 3000, .4, .1), sc0['ravine'], sc0['summit'], .012)
m.amb(m.bed_noise(3000, 8000, .6, 6), sc0['carry'], sc0['summit'], .005)
m.steps(sc0['ravine'], E['carry.cant'], .4, .035)
m.steps(sc0['ravine'] + .1, E['carry.cant'], .24, .016, pan=.4)
m.ding(E['ravine.km'], .07, 1175)
m.ding(E['carry.rule'] + .3, .05, 1319)
m.add(m.sweep(900, 600, .5, .25), E['carry.cant'] + .3, .05)  # Duque whimpers
m.add(m.layer(m.noise(.7, 200, 1200, .1, .4)), E['carry.carry'] - .2, .1)  # effort
m.steps(E['carry.carry'] + .3, sc0['summit'], .5, .04)
for k in range(5):
    m.add(m.noise(.9, 250, 1400, .25, .5), E['carry.carry'] + .8 + k * 1.1, .035)  # heavy breathing
m.add(m.layer(m.hit(500, 300, .08, .03), m.noise(.1, 1500, 5000, .002, .05)), E['carry.water'] + .2, .06)  # empty bottle
m.sting(E['carry.water'] + .4, .1)

# ---------- summit: the helicopter is running ----------
rotor(sc0['summit'], sc0['takeoff'], .06)
m.amb(m.bed_noise(60, 400, .5, 2), sc0['summit'], sc0['cabin'], .045)
m.amb(m.bed_noise(1500, 6000, .4, 1), sc0['summit'], sc0['cabin'], .01)
m.steps(sc0['summit'], sc0['summit'] + 3.2, .5, .04)
m.sting(E['summit.clock'], .14)
m.add(m.noise(.25, 400, 3000, .01, .15), E['summit.shout'], .05)
m.sting(E['summit.dog'], .2)
m.heartbeat(E['summit.dog'], E['choice.both'], bpm=104, gain=.15)

# ---------- choice ----------
m.add(m.hit(160, 90, .15, .06), E['choice.down'] + .8, .07)
m.steps(E['choice.step'], E['choice.step'] + .7, .35, .05, pan=-.2)
m.add(m.layer(m.hit(1800, 1200, .04, .01)), E['choice.watch'] + .3, .05)
m.ding(E['choice.both'], .08, 1319)
m.ding(E['choice.both'] + .25, .06, 1568)
bark(E['choice.both'] + .5, .1, -.2)
m.steps(E['choice.both'] + .3, sc0['takeoff'], .32, .04)

# ---------- takeoff: rotor speeds up, the four arrive ----------
rotor(sc0['takeoff'], sc0['cabin'], .08, .2)
m.add(m.sweep(80, 180, 4.0, 1.0), sc0['takeoff'], .08)
m.steps(E['takeoff.four'] - .2, E['takeoff.four'] + 2.0, .18, .04, pan=-.6)
m.sting(E['takeoff.late'], .2)

# ---------- cabin: muffled rotor, calm ----------
m.amb(m.bed_noise(40, 250, .3, 3), sc0['cabin'], CUT, .05)
m.add(m.noise(1.0, 200, 900, .2, .6), E['cabin.head'] + .6, .05)  # Duque sighs

# ---------- horizon: the third wave ----------
m.add(m.noise(3.5, 25, 400, 1.2, .5), E['horizon.sea'], .26)
m.sting(E['horizon.rise'], .24)
for k in range(6):
    m.add(m.tone(960 if k % 2 == 0 else 770, .3, .01, .05), E['horizon.rise'] + k * .34, .05)

m.finish('--voice' in sys.argv)

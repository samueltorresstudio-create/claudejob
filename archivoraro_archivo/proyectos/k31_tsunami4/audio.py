# Music + SFX for «Tsunami · Parte 4». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=311)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def bark(when, gain=.16, pan=.2):
    m.add(m.layer(m.hit(520, 260, .16, .06), m.noise(.14, 400, 2600, .002, .05) * .6), when, gain, pan)


def clink(when, gain=.05, pan=0):  # a tin can rolling on the floor
    m.add(m.layer(m.tone(1400, .08, .001, .05), m.noise(.05, 2500, 7000, .001, .02)), when, gain, pan)


# ---------- music: pressure, a low drone under every scene ----------
m.drone([(49, .6), (73.4, .3), (98, .15)], 0, gain=.05, until=sc0['alley'])
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], sc0['alley'], gain=.05, until=sc0['aisle'])
m.pulses(sc0['alley'], sc0['aisle'], end=sc0['aisle'])
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], sc0['aisle'], gain=.07, rise=(scEnd['note'], 5))
m.pulses(sc0['aisle'], sc0['note'], end=sc0['note'])
m.riser(scEnd['trap'] - 4, CUT, gain=.3)
m.whooshes_and_pops()

# ---------- hook: the bag is gone ----------
m.amb(m.bed_noise(200, 1500, .4, .2), 0, sc0['alley'], .015)  # street air
m.sting(E['hook.bag'], .18)
m.add(m.layer(m.tone(880, .3, .005, .2, (1, 2))), E['hook.prueba'], .04)

# ---------- the alley: steps round the building, then the sentry ----------
m.steps(sc0['alley'] + .3, E['alley.tag'] - .2, .42, .04)
m.amb(m.bed_noise(120, 900, .3, .1), sc0['alley'], sc0['back'], .012)
m.sting(E['alley.tag'], .16)

# ---------- the stock room: he walks in between the boxes ----------
m.amb(m.bed_noise(150, 900, .4, .1), sc0['back'], sc0['front'], .015)
m.steps(E['back.enter'], E['back.enter'] + 3.0, .45, .035, pan=-.2)
for k, when in enumerate((E['back.cans'], E['back.cans'] + .3, E['back.cans'] + .7)):
    clink(when, .06, pan=(-1) ** k * .4)

# ---------- the front: the dog barks, the two men run ----------
bark(E['front.bark'], .2, .5)
bark(E['front.bark'] + .42, .18, .5)
m.steps(E['front.run'], E['front.run'] + 1.8, .28, .045, pan=.4)  # running feet
m.amb(m.bed_noise(200, 1200, .3, .2), sc0['front'], sc0['aisle'], .01)

# ---------- the aisle: the bag, the open zip, nothing to drink ----------
m.amb(m.bed_noise(100, 900, .3, .1), sc0['aisle'], sc0['note'], .012)  # fridge hum
m.steps(sc0['aisle'] + 1.2, E['aisle.bag'], .45, .035)
m.add(m.layer(m.noise(.5, 2500, 7000, .02, .2), m.hit(300, 150, .05, .02)), E['aisle.open'], .14)  # zip
m.add(m.layer(m.hit(200, 80, .2, .08), m.noise(.1, 400, 2000, .002, .04)), E['aisle.water'], .08)
m.add(m.layer(m.hit(220, 90, .2, .08), m.noise(.1, 400, 2000, .002, .04)), E['aisle.cans'], .08)

# ---------- the note: a bell, then the heartbeat ----------
m.ding(E['note.perdon'], .07)
m.heartbeat(E['note.perdon'], CUT, bpm=124, gain=.16)

# ---------- the trap: the shutter comes down, the light dies ----------
m.add(m.layer(m.metal(180, 2.0, .6), m.noise(1.8, 800, 4000, .005, .3)), E['trap.down'], .18)  # rolling shutter
m.add(m.layer(m.hit(120, 45, .5, .2), m.noise(.3, 300, 1500, .002, .1)), E['trap.dark'], .26)  # it hits the floor
m.add(m.layer(m.sweep(2000, 80, .5, .4), m.hit(80, 30, .6, .3)), E['trap.dark'] - .2, .2)  # the bulb dies
m.sting(E['trap.dark'] + .4, .2)

m.finish('--voice' in sys.argv)

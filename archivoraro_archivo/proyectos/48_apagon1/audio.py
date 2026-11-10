# Music + SFX for «Apagón · Parte 1». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=481)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rnd = m.rnd


def power_down(when, gain=.3):  # everything electric dies: a falling hum + a click
    m.add(m.sweep(120, 28, 1.4, .9), when, gain)
    m.add(m.layer(m.hit(1800, 1200, .04, .01), m.noise(.03, 2000, 8000, .001, .01)), when, .25)


def horn(when, gain=.08, pan=0):
    m.add(m.layer(m.tone(415, .55, .01, .06), m.tone(523, .55, .01, .06)), when, gain, pan)


def bark(when, gain=.12, pan=.2):
    m.add(m.layer(m.hit(560, 280, .16, .06), m.noise(.14, 400, 2600, .002, .05) * .6), when, gain, pan)


def laugh(when, gain=.05, pan=0):  # a short burst of crowd laughter
    for k in range(5):
        m.add(m.noise(.12, 300, 2500, .01, .08), when + k * .16, gain * (1 - k * .12), pan)


def strum(when, gain=.05, chord=(196.0, 246.9, 293.7, 392.0)):
    for i, f in enumerate(chord):
        m.add(m.tone(f, 1.0, .005, .8), when + i * .018, gain)


def beep(when, gain=.05):
    m.add(m.tone(1760, .07, .002, .03), when, gain)


# ---------- music ----------
m.drone([(41.2, .6), (61.7, .3), (82.4, .12)], 0, gain=.07, until=sc0['off'])
m.drone([(36.7, .6), (55, .3), (73.4, .1)], sc0['alex'], gain=.06, until=sc0['party'])
m.pulses(sc0['go'], sc0['shop'], end=scEnd['till'])
m.melody([(392, 1), (440, 1), (494, 2), (440, 1), (392, 3), (330, 2), (392, 4)], sc0['party'], sc0['radio'], .32, .016, pan=.2)
m.drone([(32.7, .7), (49, .35), (65.4, .15), (69.3, .1)], sc0['radio'], gain=.09, rise=(sc0['radio'], 5))
m.riser(CUT - 5, CUT, gain=.3)
m.whooshes_and_pops()

# ---------- hook: Spain goes dark ----------
m.amb(m.bed_noise(60, 300, .3, .2), 0, E['hook.off'], .025)
power_down(E['hook.off'], .32)
m.boom(E['hook.off'] + .2, .3)
m.sting(E['hook.month'], .2)

# ---------- teaser panels ----------
for ev in ('teaser.d1', 'teaser.d3', 'teaser.d7'):
    m.whoosh(E[ev] - .1, .14)
laugh(E['teaser.d1'] + .3, .04)
m.add(m.metal(260, .6, .3), E['teaser.d3'] + .3, .04)
for k in range(3):
    m.add(m.tone(1300 - k * 60, .08, .002, .06), E['teaser.d7'] + .4 + k * .7, .05)  # last drops

# ---------- off: the flat, then nothing ----------
m.amb(m.bed_noise(80, 400, .2, .5), sc0['off'], E['off.off'], .03)   # fridge hum
m.amb(m.bed_noise(400, 3000, .5, 4), sc0['off'], E['off.off'], .012)  # TV
power_down(E['off.off'], .34)
m.add(m.sweep(400, 900, .3, .15), E['off.off'] + .5, .03)  # Duque lifts his head... a little whine

# ---------- chaos: street, horns, the lift ----------
m.amb(m.bed_noise(100, 1200, .5, .3), sc0['chaos'], E['chaos.lift'], .03)
m.add(m.layer(m.hit(900, 600, .05, .02)), E['chaos.lights'], .05)
horn(E['chaos.honk'] - .1, .1, -.3)
horn(E['chaos.honk'] + .35, .08, .4)
m.add(m.noise(.5, 300, 3000, .02, .3), E['chaos.honk'] - .4, .08)  # brakes
m.amb(m.bed_noise(60, 300, .3, .2), E['chaos.lift'], scEnd['chaos'], .03)
for k in range(6):
    m.add(m.knock(), E['chaos.lift'] + .3 + k * .45, .1)
m.ding(E['chaos.lift'] + .1, .05, 880)

# ---------- laugh: the street party starts ----------
m.amb(m.bed_noise(300, 2500, .6, 3), sc0['laugh'], sc0['alex'], .02)
laugh(E['laugh.laugh'], .06)
laugh(E['laugh.laugh'] + 1.0, .045, .3)
laugh(E['laugh.say'] + 1.4, .05, -.2)

# ---------- alex: the thought ----------
m.heartbeat(E['alex.name'], scEnd['alex'], bpm=84, gain=.12)
m.sting(E['alex.q'], .22)

# ---------- go: leash, dog, door ----------
m.add(m.metal(1800, .3, .1), E['go.bruno'] - .3, .04)
bark(E['go.bruno'] + .1, .13)
bark(E['go.bruno'] + .4, .1)
m.add(m.creak(.8), E['go.go'], .08)
m.steps(E['go.go'], scEnd['go'], .3, .04)
m.ding(E['go.hour'], .07, 1175)

# ---------- bath: running water that fades ----------
m.amb(m.bed_noise(200, 1500, .3, .2), sc0['bath'], scEnd['bath'], .01)
m.add(m.noise(E['bath.weak'] - E['bath.fill'] + .5, 500, 5000, .2, .3), E['bath.fill'], .09)
m.add(m.noise(E['bath.half'] - E['bath.weak'] + .2, 500, 3500, .05, 1.2), E['bath.weak'], .06)
for i in range(3):
    m.add(m.metal(520 + i * 90, .35, .2), E['bath.pots'] - .3 + i * .2, .04)
m.ding(E['bath.pumps'], .05, 988)
for k in range(4):
    m.add(m.tone(1300 - k * 40, .08, .002, .06), E['bath.half'] + k * .55, .05)

# ---------- patio: the neighbour laughs ----------
m.amb(m.bed_noise(300, 2500, .4, .2), sc0['patio'], scEnd['patio'], .012)
laugh(E['patio.laugh'], .07, -.3)
laugh(E['patio.laugh'] + .8, .05, -.3)

# ---------- fridge ----------
m.add(m.noise(.1, 1500, 6000, .005, .06), E['fridge.no'], .07)  # the note slapped on the door
m.add(m.hit(300, 180, .08, .04), E['fridge.no'] + .02, .06)
m.ding(E['fridge.hours'], .07, 1319)

# ---------- shop + till ----------
m.amb(m.bed_noise(200, 1500, .4, .3), sc0['shop'], sc0['party'], .015)
m.steps(sc0['shop'], scEnd['shop'] - .5, .45, .03)
for i, ev in enumerate(('shop.cans', 'shop.water', 'shop.bat', 'shop.food')):
    m.ding(E[ev], .06, [1047, 1175, 1319, 1568][i])
for k in range(6):
    beep(E['till.calc'] - 1.2 + k * .2)
m.add(m.noise(.25, 2000, 7000, .02, .15), E['till.cash'], .05)  # notes
m.ding(E['till.three'], .07, 1175)

# ---------- party ----------
m.amb(m.bed_noise(300, 2500, .6, 2), sc0['party'], sc0['radio'], .025)
m.amb(m.bed_noise(3000, 8000, .6, 8), sc0['party'], CUT, .005)  # crickets
for k in range(10):
    strum(sc0['party'] + .3 + k * .6, .03 if k % 2 else .04)
laugh(E['party.party'], .04, .3)

# ---------- radio: click, static ----------
m.add(m.layer(m.hit(1800, 1200, .04, .01), m.noise(.02, 2000, 8000, .001, .006)), E['radio.on'], .2)
m.add(m.noise(.6, 1000, 6000, .01, .3), E['radio.on'] + .05, .06)
m.amb(m.bed_noise(1500, 6000, .6, 3), E['radio.on'], scEnd['radio'], .012)
m.sting(E['radio.nodate'], .24)
m.heartbeat(E['radio.nodate'], CUT, bpm=92, gain=.13)

# ---------- end: he keeps singing ----------
for k in range(8):
    strum(sc0['end'] + .2 + k * .6, .03, (220.0, 261.6, 329.6, 440.0))

m.finish('--voice' in sys.argv)

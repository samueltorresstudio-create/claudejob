# Music + SFX for «Tsunami · Parte 3». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=293)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def bark(when, gain=.16, pan=.2):
    m.add(m.layer(m.hit(520, 260, .16, .06), m.noise(.14, 400, 2600, .002, .05) * .6), when, gain, pan)


# ---------- music ----------
m.drone([(49, .6), (73.4, .3), (98, .15)], 0, gain=.05, until=sc0['back'])
m.melody([(440, 2), (523.3, 1), (493.9, 3), (440, 2), (392, 4)], sc0['back'], sc0['step1'], .28, .02, pan=-.2)
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], sc0['step1'], gain=.05, until=sc0['radio'])
m.pulses(sc0['step1'], sc0['radio'], end=sc0['radio'])
m.drone([(55, .4), (82.4, .2), (110, .1)], sc0['radio'], gain=.04, until=sc0['market'])
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], sc0['market'], gain=.07, rise=(sc0['end'], 5))
m.pulses(sc0['market'], sc0['end'], end=CUT)
m.riser(scEnd['end'] - 4, CUT, gain=.3)
m.whooshes_and_pops()

# ---------- roof ----------
m.birds(0, sc0['step1'], 4)
m.amb(m.bed_noise(150, 900, .4, .1), 0, sc0['step1'], .012)
for key in ('water', 'food', 'duque'):
    m.add(m.layer(m.hit(200, 80, .25, .1), m.noise(.1, 400, 2500, .002, .05)), E['recap.' + key], .12)
for k, dt in enumerate((0, .55)):
    m.add(m.layer(m.sweep(1800, 2400, .35, .25), m.sweep(2400, 1700, .35, .25) * .6), E['recap.whistle'] + .1 + dt * 1.6, .06)
bark(E['recap.bark'], .2, .6)
bark(E['recap.bark'] + .45, .16, .6)
m.steps(sc0['back'], E['back.teeth'] + .4, .42, .03, pan=.4)
m.sting(E['back.red'], .14)
m.sting(E['back.thieves'], .16)

# ---------- the lobby, the bathroom ----------
m.amb(m.bed_noise(100, 900, .5, .3), sc0['step1'], sc0['step2'], .03)  # dark water
for k in range(8):
    m.add(m.tone(900 + (k % 3) * 200, .1, .002, .06), sc0['step1'] + .5 + k * .5, .02, pan=(-1) ** k * .5)  # drips + bubbles
m.add(m.layer(m.hit(500, 300, .12, .05), m.noise(.15, 1500, 6000, .002, .05)), E['step1.sip'], .2)
m.add(m.layer(m.hit(260, 120, .25, .08), m.noise(.25, 300, 3000, .005, .1)), E['step2.open'], .18)  # the lid
m.add(m.noise(2.2, 400, 4000, .2, 1.0), E['step2.clean'] - .2, .05)  # water into the bottle
m.ding(E['step2.ten'], .08)

# ---------- the street ----------
for at in (sc0['step3'] + .3, E['street.paint']):
    m.add(m.noise(1.2, 2000, 9000, .02, .5), at, .06)  # spray can
m.amb(m.bed_noise(200, 1500, .4, .3), sc0['street'], sc0['step4'], .015)
m.steps(E['street.walk'] - .3, sc0['step4'], .4, .04)
for k in range(3):
    m.add(m.metal(240 + k * 50, .8, .35), E['street.cars'] + k * .4, .03, pan=(-1) ** k * .5)

# ---------- the radio, the map ----------
m.add(m.layer(m.hit(1800, 1200, .04, .01), m.noise(.02, 2000, 8000, .001, .006)), E['step4.radio'], .2)  # click
m.add(m.noise(.8, 1000, 6000, .01, .4), E['step4.radio'] + .05, .07)  # static
m.amb(m.bed_noise(1500, 6000, .6, 2), sc0['radio'], E['radio.km'], .006)
m.add(m.layer(m.tone(523.3, .8, .02, .5), m.tone(659.3, .8, .02, .5)), E['radio.km'], .05)

# ---------- the supermarket ----------
m.amb(m.bed_noise(150, 900, .4, .1), sc0['market'], CUT, .012)
m.add(m.noise(1.4, 2000, 9000, .02, .7), E['market.words'] - .1, .05)
m.sting(E['market.words'] + .6, .16)
m.add(m.layer(m.sweep(110, 80, 2.4, 1.6), m.noise(2.4, 60, 500, .2, 1.4)), E['end.growl'] - .1, .2)  # growl
m.add(m.metal(180, 1.6, .6), E['end.inside'] - .6, .06)  # the shutter rattles
m.heartbeat(E['end.growl'], CUT, bpm=144, gain=.2)

m.finish('--voice' in sys.argv)

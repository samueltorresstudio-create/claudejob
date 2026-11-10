# Music + SFX for «Desaparecen los adultos». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=131)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def clang(gain=.4):
    return m.layer(m.metal(420, 1.2, .5) * .6, m.metal(610, 1.0, .4) * .4, m.noise(.05, 800, 5000, .001, .03))


def click():
    return m.layer(m.hit(1800, 1200, .04, .01), m.noise(.02, 2000, 8000, .001, .006))


# ---------- music: a hopeful glockenspiel while the kids organise, a cold drone when night falls ----------
glock = lambda f: m.tone(f, .7, .002, .35, (1, 2.76, 5.4))
m.melody([(659.3, 1), (784, 1), (880, 2), (784, 1), (659.3, 1), (587.3, 2)], sc0['step1'], E['step3.night'], .32, .025, pan=.2, inst=glock)
m.drone([(55, .5), (82.4, .25), (110, .15)], sc0['home'], gain=.045, until=sc0['step1'])
m.drone([(65.4, .4), (98, .2), (130.8, .15)], sc0['step1'], gain=.035, until=E['step3.night'])
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], E['step3.night'], gain=.07, rise=(sc0['ask'], 10))
m.pulses(sc0['night'], sc0['ask'], end=CUT - .2)
m.riser(sc0['end'] - .3, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- the street: people, a car, then everyone vanishes ----------
m.amb(m.bed_noise(100, 1500, .3, .4), 0, E['intro.gone'], .04)  # city murmur
m.birds(0, sc0['id'], 3)
m.add(m.layer(m.noise(3.4, 60, 500, .3, .5), m.tone(70, 3.4, .3, .6, (1, 2))), 0, .1)  # the passing car
m.steps(0, E['intro.gone'], .3, .03)
m.add(m.sweep(1400, 300, .6, .3), E['intro.gone'], .1)
m.boom(E['intro.gone'] + .05, .3, 1.5)
for k in range(4):
    m.add(m.layer(m.hit(600, 300, .06, .02), m.noise(.03, 1500, 5000, .001, .01)), E['intro.gone'] + .15 + k * .09, .12, pan=(-.6, -.2, .3, .7)[k])  # phones hit the pavement
m.whoosh(sc0['id'], .1)

# ---------- the kitchen: coffee maker, phones buzzing ----------
m.amb(m.bed_noise(300, 2500, .4, .5), sc0['home'], E['home.parents'], .015)  # coffee maker gurgle
m.add(m.noise(1.0, 400, 2400, .1, .6), E['home.cafe'], .06)
m.sting(E['home.parents'] + .1, .14)
m.ringtone(E['home.ring'], sc0['street'] + .4, gain=.05)
buzz = np.sign(np.sin(2 * np.pi * 160 * t)) * (np.sin(2 * np.pi * 2.5 * t) > 0)
m.amb(m.band(buzz, 100, 600), E['home.ring'], sc0['street'] + .2, .02)

# ---------- the empty street, engines idling ----------
m.amb(m.bed_noise(60, 400, .4, 7), E['street.motor'] - .5, sc0['step1'], .05)  # idling engines
m.amb(m.bed_noise(200, 1200, .3, .3), sc0['street'], sc0['step1'], .025)  # wind
m.ding(E['street.doors'], .04, 880)
m.ding(E['street.doors'] + .4, .03, 880)  # car door chimes

# ---------- park, supermarket, school ----------
m.birds(sc0['step1'], sc0['step2'], 5)
m.amb(m.bed_noise(300, 3000, .5, 1.5), E['step1.kids'], sc0['step2'], .02)  # kids talking
m.amb(np.sin(2 * np.pi * 120 * t) * .6 + np.sin(2 * np.pi * 240 * t) * .3, sc0['step2'], E['step2.note'], .006)  # fridge hum
for k in range(3):
    m.add(m.tone(2600, .08, .001, .05), E['step2.shop'] + .6 + k * .45, .03)  # scanner beeps
m.add(m.noise(2.6, 2000, 6000, .05, .2), E['step2.note'] + .2, .015)  # pencil scratch
m.amb(m.bed_noise(150, 900, .3, .3), sc0['step3'], E['step3.night'], .02)
m.add(click(), E['step3.lock'], .4)
m.add(m.metal(300, .8, .3), E['step3.lock'] + .02, .08)

# ---------- the fish and the secret ----------
for k in range(6):
    m.add(m.tone(900 + 220 * k, .12, .002, .06), E['step4.fish'] + .2 + k * .17, .02)  # bubbles
m.ding(E['step4.ans'], .08, 1318.5)
for key in ('step4.h', 'step4.a'):
    m.add(m.tone(1046.5, .4, .002, .2, (1, 2)), E[key], .04)
m.add(m.tone(1568, .6, .002, .3, (1, 2)), E['step4.m'], .05)

# ---------- the night at the gate ----------
m.amb(m.bed_noise(2500, 7000, .6, 3.5), sc0['night'], CUT, .006)  # crickets
m.amb(m.bed_noise(100, 700, .4, .2), sc0['night'], CUT, .02)  # night wind
for k in range(3):
    m.add(clang(), E['night.knock'] + k * .35, .25, pan=.3)
m.steps(E['night.woman'] - .4, E['night.woman'] + 1.2, .45, .04, pan=.4)
m.sting(E['night.mama'], .16)
m.steps(E['night.run'], E['night.grab'], .2, .06)
m.add(m.hit(200, 90, .2, .05), E['night.grab'], .2)
m.heartbeat(E['night.grab'], CUT, bpm=118, gain=.16)
m.add(m.tone(55, 3, .05, 2.4), E['ask.smile'], .16, bed=True)
m.sting(E['ask.smile'] + .2, .2)
tt = E['ask.turn']
while tt < E['end.click'] - .1:
    m.add(m.layer(m.metal(900, .15, .05) * .5, m.noise(.04, 1200, 5000, .002, .02)), tt, .1, pan=.2)  # the padlock grinding
    tt += .38
m.add(clang(), E['end.pull'], .15)
m.add(m.layer(click(), m.metal(700, .5, .2) * .5), E['end.click'], .55)  # the shackle pops open

m.finish('--voice' in sys.argv)

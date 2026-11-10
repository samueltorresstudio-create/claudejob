# Music + SFX for «Apocalipsis zombi en el cole». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=83)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def groan(dur=1.2, f=85):  # zombie moan: a low hummed vowel sliding down
    g = m.sung(f, dur, (420, 700))
    return m.band(g * np.linspace(1, .6, len(g)), 60, 1800)


# ---------- music: tense pulse that speeds up, a hopeful lift at dawn, then dread ----------
m.drone([(55, .5), (82.4, .3), (110, .2), (116.5, .1)], E['intro.hand'], gain=.07, rise=(sc0['step3'], 20), until=sc0['heli'])
m.pulses(sc0['alarm'], sc0['step3'], end=sc0['heli'])
m.drone([(65.4, .4), (98, .3), (130.8, .25), (164.8, .15)], sc0['heli'], gain=.06, until=E['heli.quiet'])
m.drone([(41.2, .6), (61.7, .25), (43.7, .2)], E['heli.quiet'], gain=.09)
m.riser(sc0['mario'], CUT, gain=.32)
m.whooshes_and_pops()

# ---------- class, the hand on the window ----------
m.amb(m.bed_noise(250, 2000, .5, 1.3), 0, E['intro.hand'], .025)
m.add(m.layer(m.hit(160, 60, .3, .06), m.noise(.08, 500, 5000, .001, .03)), E['intro.hand'], .5)
m.sting(E['intro.hand'] + .05, .2)
m.whoosh(sc0['id'], .1)

# ---------- the yard ----------
m.birds(sc0['start'], E['start.bite'], 5)
m.amb(m.bed_noise(60, 600), sc0['start'], sc0['alarm'], .03)
tt = sc0['start'] + .3
while tt < E['start.bite']:
    m.add(m.noise(.3, 200, 1500, .05, .1), tt, .05)  # the dragged foot
    tt += .9
m.add(groan(1.4, 90), E['start.drag'], .12)
m.add(m.tone(2600, .5, .002, .3), E['start.bite'] - .6, .04)  # the PE teacher's whistle
m.add(groan(1.2, 110), E['start.bite'], .2)
m.boom(E['start.bite'] + .05, .45)

# ---------- alarm ----------
alarm = np.sign(np.sin(2 * np.pi * 760 * t)) * (np.sin(2 * np.pi * 2 * t) > 0)
m.amb(m.band(alarm, 300, 3000), E['alarm.bell'], E['alarm.back'] + 1.5, .03)
m.steps(E['alarm.run'], E['alarm.error'], .08, .06, hi=2600)
m.sting(E['alarm.error'], .25)
m.add(groan(1.6, 80), E['alarm.them'], .15, pan=.6)
m.steps(E['alarm.back'], scEnd['alarm'], .15, .1, hi=2600)

# ---------- canteen ----------
for k in range(8):
    m.add(m.layer(m.tone(900 + 100 * k, .06, .002, .03), m.noise(.04, 1500, 6000, .001, .01)), E['step1.bags'] + k * .25, .05)
m.add(m.layer(m.tone(220, 1.6, .01, .8), m.tone(233.1, 1.6, .01, .8)), E['step1.cut'], .12)

# ---------- library ----------
m.add(m.noise(1.4, 100, 900, .2, .6), E['step2.block'], .12)  # shelves dragged across the floor
for k in E['step2.knock']:
    m.add(m.knock(), k, .7)
    m.add(groan(.8, 75), k + .1, .1, pan=.5)
m.ding(E['step2.hold'], .05, 784)

# ---------- lockers ----------
m.add(m.layer(m.metal(300, .6, .2) * .5, m.hit(120, 60, .2, .05)), E['step3.hide'], .3)
tt = E['step3.steps']
while tt < scEnd['step3']:
    m.add(m.noise(.35, 150, 1200, .05, .12), tt, .07)
    tt += .8
m.add(groan(1.6, 70), E['step3.pass'], .18)
m.heartbeat(E['step3.steps'], scEnd['step3'], bpm=110, gain=.15)

# ---------- roof + helicopter ----------
m.amb(m.bed_noise(200, 1500, .4, .7), sc0['step4'], CUT, .02)
for k in range(15):
    m.add(m.hit(110, 70, .15, .04), E['step4.sos'] + k * .12, .06)  # tables dropped into place
blade = m.band(m.rnd.standard_normal(N), 60, 800) * (np.sin(2 * np.pi * 12 * t) > .3)
lv = np.clip((t - E['step4.look']) / 6, 0, 1) * (t > E['step4.look'])
m.bed[:, 0] += blade * lv * .05
m.bed[:, 1] += blade * lv * .05
h = m.layer(m.tone(587.3, .8, .005, .4, (1, 2, 3)), m.tone(784, .8, .005, .4, (1, 2)))
for k in range(3):
    m.add(h, E['heli.jump'] + k * .5, .05)
m.boom(E['heli.quiet'], .35)
m.sting(E['heli.arm'], .2)

# ---------- Mario breathing behind him ----------
br = m.bed_noise(200, 1500) * np.clip(np.sin(2 * np.pi * .8 * t), 0, 1) ** 3
m.amb(br, sc0['mario'], CUT, .05)
m.amb(br, E['mario.breath'], CUT, .08)
m.add(groan(2.0, 72), E['mario.breath'] + .4, .2)

m.finish('--voice' in sys.argv)

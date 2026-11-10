# Music + SFX for «Mensajes de tu yo del futuro». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=197)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def ping(when, gain=.06):  # incoming message
    m.add(m.tone(1318.5, .12, .002, .08, (1, 2)), when, gain)
    m.add(m.tone(1760, .2, .002, .12, (1, 2)), when + .09, gain)


def buzz(when, dur=.6, gain=.05):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    m.add(m.band(np.sign(np.sin(2 * np.pi * 160 * tt)) * (np.sin(2 * np.pi * 6 * tt) > 0), 100, 600), when, gain)


def knock(when, gain=.25):
    m.add(m.layer(m.hit(320, 180, .08, .03), m.noise(.04, 800, 4000, .001, .02) * .5, m.tone(2100, .2, .001, .1) * .15), when, gain)


# ---------- music: a ticking-clock synth arpeggio (time), detuning as the messages get stranger ----------
arp = lambda f: m.tone(f, .3, .003, .12, (1, 2.01))
notes = [(440, 1), (523.3, 1), (659.3, 1), (523.3, 1), (392, 1), (493.9, 1), (587.3, 1), (493.9, 1)]
m.melody(notes, sc0['msg'], sc0['step3'], .22, .025, pan=-.2, inst=arp)
m.melody(notes, sc0['step3'], sc0['end'], .3, .02, pan=-.2, inst=lambda f: arp(f * .97))
m.drone([(55, .5), (82.4, .25), (110, .12), (116.5, .08)], sc0['msg'], gain=.045, rise=(sc0['step4'], 12))
m.drone([(43.7, .6), (65.4, .3), (87.3, .15)], sc0['step4'], gain=.07)
m.pulses(sc0['step3'], sc0['end'], end=sc0['end'])
m.riser(E['end.knock'] - .4, CUT, gain=.32)
m.whooshes_and_pops()
tt = sc0['msg']
while tt < CUT:
    m.add(m.tone(2600, .03, .001, .02), tt, .012)  # a clock that never stops
    tt += .5

# ---------- the first messages ----------
m.amb(m.bed_noise(100, 900, .3, .2), 0, CUT, .012)
buzz(E['intro.msgs'], .8)
ping(E['intro.self'])
m.whoosh(sc0['id'], .1)
ping(E['msg.m1'])
ping(E['msg.m2'], .05)
m.add(m.noise(.15, 2000, 8000, .002, .1), E['msg.photo'], .05)  # photo «shutter»
m.sting(E['msg.now'], .15)

# ---------- the cat and the glass ----------
ping(E['step1.msg'])
for k, w in enumerate(E['step1.n']):
    m.add(m.tone(880 * (1 + .25 * k), .15, .002, .1), w, .05)
m.add(m.layer(m.tone(2600, .4, .002, .25, (1, 1.5, 2.3)), m.noise(.4, 2000, 8000, .002, .2)), E['step1.smash'], .14)
m.sting(E['step1.shake'], .12)

# ---------- the bus ----------
ping(E['step2.msg'])
m.amb(m.bed_noise(60, 600, .4, 1.2), E['step2.walk'], sc0['step3'], .04)  # traffic
for k in range(3):
    m.add(m.tone(420, .4, .02, .2, (1, 2)), E['step2.stuck'] + k * .7, .04, pan=-.3 + k * .3)  # horns
m.birds(E['step2.walk'], sc0['step3'], 3)

# ---------- «they» ----------
m.add(m.noise(.4, 3000, 7000, .01, .2), E['step3.ask'] - .4, .03)  # typing
ping(E['step3.reply'])
ping(E['step3.they'], .05)
m.sting(E['step3.they'] + .2, .16)
m.add(m.noise(.4, 3000, 7000, .01, .2), E['step3.who'] - .4, .03)

# ---------- 3 a.m. ----------
buzz(E['step4.three'], 1.0, .06)
ping(E['step4.msg'], .05)
ping(E['step4.enter'], .05)
m.heartbeat(E['step4.look'], CUT, bpm=112, gain=.15)
m.amb(m.bed_noise(150, 900, .4, .2), sc0['step4'], CUT, .02)  # wind outside, 3rd floor
buzz(E['end.vib'], .8, .07)
ping(E['end.msg'], .06)
m.add(m.tone(55, 2.5, .05, 2.0), E['end.open'], .18, bed=True)
for k in range(3):
    knock(E['end.knock'] + k * .32, .26)
m.sting(E['end.third'], .25)

m.finish('--voice' in sys.argv)

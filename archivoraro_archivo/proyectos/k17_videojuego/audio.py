# Music + SFX for «Dentro del videojuego con una vida». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=179)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def sq(f, dur, a=.003, d=.08, duty=.5):  # 8-bit square wave
    n = int(dur * SR)
    tt = np.arange(n) / SR
    w = np.where((tt * f) % 1 < duty, 1.0, -1.0)
    env = np.minimum(1, tt / a) * np.exp(-tt / max(d, 1e-3))
    return w * env * .5


def blip(f0, f1, dur=.12):  # chiptune sweep (jump, coin...)
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = np.linspace(f0, f1, n)
    ph = np.cumsum(f) / SR
    return np.where(ph % 1 < .5, 1.0, -1.0) * np.exp(-tt / dur * 2) * .5


def coin(when, gain=.05):
    m.add(sq(988, .07, d=.05), when, gain)
    m.add(sq(1319, .3, d=.15), when + .07, gain)


chip = lambda f: sq(f, .2, d=.09, duty=.25)
bass = lambda f: sq(f, .25, d=.12)
tune = [(659.3, 1), (659.3, 1), (0, 1), (659.3, 1), (0, 1), (523.3, 1), (659.3, 1), (0, 1), (784, 2), (0, 2), (392, 2), (0, 2)]
lows = [(130.8, 2), (196, 2), (164.8, 2), (196, 2)]

# ---------- music: a cheerful chiptune for the game... that stops dead when player 2 joins ----------
g_on, g_off = sc0['wake'], E['end.stop']
m.melody(tune, g_on, g_off, .15, .03, pan=-.1, inst=chip)
m.melody(lows, g_on, g_off, .3, .03, pan=.1, inst=bass)
m.add(m.sweep(500, 80, .9, .6), g_off, .05)  # music cuts out, like a cartridge pulled
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], g_off, gain=.075)
m.pulses(sc0['step3'], g_off, end=g_off)
m.riser(E['end.appear'], CUT, gain=.32)
m.whooshes_and_pops()

# ---------- the bedroom, falling into the screen ----------
m.amb(m.bed_noise(100, 700, .3, .2), 0, sc0['id'], .02)
m.add(sq(1046.5, .25, d=.2), E['intro.one'], .04)
m.add(m.sweep(200, 2000, 1.3, .9), E['intro.push'], .06)
m.whoosh(sc0['id'], .1)

# ---------- in the game ----------
m.add(blip(400, 1200, .3), E['wake.open'], .05)
m.add(sq(220, .6, d=.4, duty=.25), E['wake.life'], .05)
m.add(blip(800, 200, .5), E['wake.cont'], .05)
m.add(blip(600, 900, .15), E['step1.stone'], .05)
m.add(blip(900, 100, .9), E['step1.fall'], .05)  # falling...
m.add(m.noise(.4, 1000, 6000, .01, .3), E['step1.gone'], .03)  # ...and gone
for i in range(4):
    coin(E['step2.coins'] + .3 + i * .3, .04)
tt = E['step2.shroom'] - .5
while tt < scEnd['step2']:
    m.add(sq(110, .06, d=.04), tt, .03)  # mushroom footsteps
    tt += .25
tt = E['step2.clock']
while tt < scEnd['step2']:
    m.add(sq(1760, .04, d=.02), tt, .02)  # timer ticking fast
    tt += .2

# ---------- the edge of the world ----------
stat = m.band(m.rnd.standard_normal(N), 1000, 8000)
m.amb(stat, E['step3.black'] - .5, scEnd['step3'], .02)
m.sting(E['step3.like'], .16)

# ---------- running to the flag ----------
for w in (E['step4.l1'], E['step4.l2'], E['step4.l3']):
    m.add(blip(500, 1500, .25), w, .05)
tt = E['step4.run']
while tt < E['step4.flag']:
    m.add(blip(300, 900, .1), tt, .025)  # jumps
    tt += .98
tt = E['step4.four']
for k in range(4):
    m.add(sq(1760, .1, d=.06), tt + k * .5, .04)  # last seconds beeping
m.add(m.layer(*[sq(f, .8, d=.5) for f in (523.3, 659.3, 784)]), E['step4.flag'], .04)

# ---------- player 2 ----------
m.add(m.layer(sq(392, .2, d=.1), sq(523.3, .2, d=.1)), E['end.msg'], .05)
m.add(m.layer(sq(523.3, .4, d=.2), sq(784, .6, d=.3)), E['end.msg'] + .25, .05)
m.add(blip(1200, 300, .6), E['end.appear'], .05)
m.add(m.tone(55, 2.5, .05, 2.0), E['end.face'], .18, bed=True)
m.sting(E['end.inf'], .2)
tt = E['end.run'] - .3
gap = .25
while tt < CUT:
    m.add(sq(140, .05, d=.03), tt, .05)  # player 2's footsteps, faster and faster
    tt += gap
    gap = max(.1, gap * .88)
m.heartbeat(E['end.face'], CUT, bpm=130, gain=.15)

m.finish('--voice' in sys.argv)

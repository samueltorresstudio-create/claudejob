# Sound for «El Hombre de la Estática · Parte 1»: TV hiss and hum, remote clicks, knocks, heartbeats, the static swelling, a dead screen.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=301)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def hiss(a, b, gain, lo=900, hi=9000):  # TV snow
    m.amb(m.bed_noise(lo, hi, .3, 8), a, b, gain, fade=.05)


def click(when, gain=.12):
    m.add(m.layer(m.hit(2200, 1400, .03, .01), m.noise(.02, 2500, 9000, .001, .006)), when, gain)


def zap(when):  # remote click + a burst of snow
    click(when, .14)
    m.add(m.noise(.16, 800, 9000, .002, .08), when + .01, .14)


def hum(a, b, gain=.03):  # CRT-ish 50 Hz hum + a thin high whine
    n = int((b - a) * SR)
    x = np.arange(n) / SR
    sig = np.sin(2 * np.pi * 50 * x) * .6 + np.sin(2 * np.pi * 100 * x) * .3 + np.sin(2 * np.pi * 7800 * x) * .05
    sig *= np.minimum(1, np.minimum(x / .3, (b - a - x) / .3))
    m.add(sig, a, gain, bed=True)


def knock(when, gain=.3):
    m.add(m.layer(m.hit(140, 70, .18, .05), m.noise(.08, 120, 1500, .001, .04)), when, gain, -.3)


# ---------- music: no melody, only pressure ----------
m.drone([(41.2, .6), (61.7, .3), (82.4, .12)], 0, gain=.05, until=sc0['door'])
m.drone([(38.9, .6), (58.3, .3), (77.8, .15), (82.4, .1)], sc0['back'], gain=.07, until=sc0['zero'])
m.pulses(sc0['step1'], sc0['door'], end=sc0['door'])
m.pulses(sc0['step2'], sc0['zero'], end=sc0['zero'])
m.drone([(36.7, .7), (55, .3), (73.4, .15), (77.8, .1)], sc0['end'], gain=.09, rise=(sc0['end'], 7))
m.riser(scEnd['end'] - 4.5, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- 3:07 ----------
m.amb(m.bed_noise(60, 400, .2, .1), 0, E['intro.on'], .02)  # the silent flat: fridge rumble
for k in range(int(E['intro.on'] / .9)):
    m.add(m.tone(2600, .02, .001, .015), .3 + k * .9, .03)  # wall clock
m.add(m.layer(m.hit(90, 40, .5, .2), m.noise(.3, 1000, 9000, .002, .2)), E['intro.on'] - .15, .35)  # the TV thunks on
hiss(E['intro.on'] - .1, sc0['id'], .06)
hum(E['intro.on'], sc0['id'], .025)
m.sting(E['intro.dont'], .2)
m.whoosh(sc0['id'], .1)

# ---------- Víctor, the sofa, channel 0 ----------
m.add(m.layer(m.tone(880, .3, .005, .2, (1, 2))), E['id.age'], .04)
hum(sc0['sofa'], sc0['door'], .02)
for k in range(int((E['sofa.ch0'] - E['sofa.change']) / .45) + 1):
    zap(E['sofa.change'] + k * .45)
m.add(m.layer(m.sweep(180, 60, 1.2, .9), m.noise(1.2, 60, 800, .05, .9)), E['sofa.ch0'], .22)
hiss(E['sofa.ch0'], sc0['door'], .04)
m.amb(m.bed_noise(200, 1200, .6, .3), sc0['channel'], sc0['door'], .015)  # wind in the trees on the other side
for k in range(int((sc0['door'] - E['channel.counter']) / 1.0)):
    m.add(m.tone(1200, .03, .001, .02), E['channel.counter'] + k, .04)  # the counter ticking
m.sting(E['channel.someone'], .18)
m.heartbeat(E['channel.tall'], sc0['zap'], bpm=96, gain=.14)
for k in range(3):
    m.add(m.tone([660, 660, 990][k], .18, .005, .12), sc0['step1'] + .5 + k * .75, .07)
m.add(m.noise(.12, 200, 1500, .01, .06), E['step1.blink'] - .05, .05)  # the blink
m.add(m.layer(m.hit(70, 35, .8, .3), m.noise(.4, 1500, 9000, .002, .2) * .7), E['step1.blink'] + .12, .38)  # closer!
for key in ('z1', 'z2', 'z3', 'all'):
    zap(E['zap.' + key])
zap(E['zap.all'] + 1.0)

# ---------- the door ----------
m.amb(m.bed_noise(60, 400, .2, .1), sc0['door'], sc0['back'], .02)
for i in range(3):
    knock(E['door.knock'] + i * .28)
for i in range(3):
    knock(E['door.knock'] + 1.4 + i * .25, .24)
m.steps(E['door.knock'] + .4, E['door.open'] - .2, .42, .04)
m.add(m.creak(1.0), E['door.open'] - .2, .1)
m.amb(m.bed_noise(300, 3000, .4, .2), E['door.open'], sc0['back'], .01)  # hallway
m.add(m.layer(m.sweep(500, 380, .4, .3), m.noise(.4, 400, 2500, .02, .2) * .4), E['door.hears'], .04)  # her complaint
m.sting(E['door.silent'], .18)

# ---------- he fills half the screen ----------
m.steps(sc0['back'], E['back.sofa'], .38, .04)
hiss(sc0['back'], sc0['step2'], .07)
hum(sc0['back'], sc0['zero'], .03)
m.add(m.layer(m.hit(60, 30, 1.2, .5), m.noise(.6, 1000, 9000, .002, .3)), E['back.man'], .45)
m.add(m.noise(1.5, 25, 200, .05, 1), E['back.man'], .3)

# ---------- rule 2: the static swells, falls, swells ----------
lv = np.zeros(N)
def seg(a, b, v0, v1):
    i0, i1 = int(a * SR), int(b * SR)
    lv[i0:i1] = np.linspace(v0, v1, max(1, i1 - i0))
a0, aE = sc0['step2'], sc0['step3']
seg(a0, E['step2.up1'], .2, .25)
seg(E['step2.up1'], E['step2.up1'] + .5, .25, 1)
seg(E['step2.up1'] + .5, E['step2.down'], 1, 1)
seg(E['step2.down'], E['step2.down'] + .5, 1, .15)
seg(E['step2.down'] + .5, E['step2.up2'], .15, .15)
seg(E['step2.up2'], E['step2.up2'] + .4, .15, 1.1)
seg(E['step2.up2'] + .4, aE, 1.1, .4)
st = m.bed_noise(700, 9000, .2, 6)
st = np.resize(st, N) * lv
m.add(st, 0, .12)
m.heartbeat(sc0['step2'], sc0['step3'], bpm=130, gain=.2)

# ---------- rule 3: the plug ----------
hiss(sc0['step3'], E['zero.off'], .06)
m.steps(sc0['step3'] + .2, E['step3.pull'] - .2, .4, .04)
m.add(m.layer(m.noise(.25, 300, 3000, .005, .1), m.hit(300, 150, .1, .04)), E['step3.pull'], .2)  # yank
m.add(m.layer(m.hit(1600, 1000, .05, .02)), E['step3.pull'] + .35, .1)  # plug hits the floor
m.sting(E['step3.never'], .22)
m.heartbeat(E['step3.never'], E['zero.off'], bpm=150, gain=.18)

# ---------- 00:03 → 00:00, then nothing ----------
for k in range(4):
    m.add(m.tone(1500 if k < 3 else 700, .15, .002, .1), E['zero.zero'] - 3 + k, .1)
m.add(m.layer(m.sweep(2000, 80, .5, .4), m.hit(80, 30, .6, .3)), E['zero.off'] - .2, .3)  # the screen dies
m.add(m.noise(.15, 1000, 8000, .002, .1), E['zero.off'] - .2, .1)

# ---------- the reflection ----------
m.add(m.tone(55, 4.0, 1.5, 2), sc0['end'], .08)
m.add(m.layer(m.noise(.6, 200, 1500, .1, .3), m.sweep(120, 90, .6, .4)), E['end.hand'] - .1, .18)  # the hand lands
m.heartbeat(E['end.hand'], CUT, bpm=160, gain=.22)
m.add(m.noise(CUT - E['end.back'] + .2, 800, 9000, 2.0, .2), E['end.back'], .05)  # static creeping back in

m.finish('--voice' in sys.argv)

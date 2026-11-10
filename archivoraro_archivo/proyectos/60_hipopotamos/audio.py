# Music + SFX for «Los hipopótamos de Colombia» (sin voz; con --voice mezcla narration.wav cuando llegue).
# Tono: curiosidad divertida → cumbia ligera (guacharaca, bajo, marimba) en vez de suspense.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR

m = Mix(HERE, seed=60)
E, CUT = m.E, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(60)
t = lambda n: np.arange(int(n * SR)) / SR

# ---------- instruments ----------
def marimba(f, d=.45):
    x = t(d); env = np.exp(-x * 9) * np.clip(x / .004, 0, 1)
    return (np.sin(2 * np.pi * f * x) + .35 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 25) + .15 * np.sin(2 * np.pi * f * 10 * x) * np.exp(-x * 40)) * env
def bass(f, d=.42):
    x = t(d); env = np.clip(x / .01, 0, 1) * np.exp(-x * 4)
    return (np.sin(2 * np.pi * f * x) + .3 * np.sin(4 * np.pi * f * x)) * env
def guacharaca(d=.09, bright=1.0):
    x = t(d); n = rng.standard_normal(len(x)); env = np.exp(-x * 30) * np.clip(x / .003, 0, 1) * (1 + .6 * np.sin(2 * np.pi * 180 * x))
    return m.band(n, 2500 * bright, 9000) * env
def kick(d=.25):
    x = t(d); f = 90 * np.exp(-x * 18) + 45; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 9)

# ---------- music: cumbia at 96 bpm, light enough to sit under the voice ----------
BPM = 96; beat = 60 / BPM
prog = [(98.0, [392, 494, 587]), (73.4, [370, 440, 587]), (65.4, [330, 392, 523]), (73.4, [370, 440, 587])]   # G D C D
mel = [784, 659, 587, 659, 784, 880, 784, 659, 587, 494, 587, 659, 587, 494, 440, 494]
tt, i = 0.0, 0
def quiet(x):  # duck the band during the «tension» moments
    return (sc0['log'] + 1.2 < x < sc0['yawn'] + 1.6) or (sc0['stamp'] <= x < scEnd['stamp'])
while tt < CUT - .05:
    bar, b = divmod(i, 4); root, ch = prog[bar % 4]; g = .45 if quiet(tt) else 1.0
    if b in (0, 2): m.add(bass(root), tt, .34 * g, bed=True); m.add(kick(), tt, .18 * g, bed=True)
    if b in (1, 3): m.add(bass(root * 1.5), tt + beat * .5, .22 * g, bed=True)
    for h, ga in ((0, .07), (.5, .045), (.75, .05)): m.add(guacharaca(), tt + h * beat, ga * g, .25, bed=True)
    if b in (1, 3): m.add(m.noise(.12, 800, 4000, .002, .08), tt, .06 * g, -.2, bed=True)              # clap-ish
    if tt > E['hook.cuatro'] - .1:                                                                     # marimba enters with the «4»
        m.add(marimba(mel[(i * 2) % 16]), tt, .11 * g, -.15, bed=True); m.add(marimba(mel[(i * 2 + 1) % 16]), tt + beat * .5, .08 * g, -.15, bed=True)
        if b == 0: [m.add(marimba(f, .9), tt, .045 * g, .2, bed=True) for f in ch]
    tt += beat; i += 1

# ---------- helpers ----------
def thud(when, gain=.22, f=70): m.add(m.layer(m.hit(f, f * .5, .32, .14), m.noise(.08, 60, 500, .002, .06) * .6), when, gain)
def pop(when, gain=.14, f=880): m.add(m.layer(m.sweep(f * .6, f * 1.6, .09, .05), m.tone(f * 2, .06, .001, .04) * .4), when, gain)
def splash(when, gain=.3, big=1.0):
    n = m.layer(m.noise(.7 * big, 300, 5000, .003, .5 * big), m.noise(.25, 80, 600, .002, .2) * .8)
    m.add(n, when, gain); [m.add(m.tone(900 + rng.random() * 1400, .05, .001, .04), when + .08 + k * .07 * rng.random() * 3, .03) for k in range(6)]
def honk(when, gain=.3):   # hippo «wheeze-honk»: low pulsed grunts
    for k in range(5):
        x = t(.2); f = 115 - k * 8; s = (np.sign(np.sin(2 * np.pi * f * x)) * .5 + np.sin(2 * np.pi * f * x)) * np.exp(-x * 7) * np.clip(x / .01, 0, 1)
        m.add(m.layer(m.band(s, 60, 900), m.noise(.2, 200, 1500, .01, .15) * .35), when + k * .22, gain * (1 - k * .1))
def roar(when, d=1.4, gain=.35):
    x = t(d); f = 85 + 25 * np.sin(np.pi * x / d); s = np.sin(2 * np.pi * np.cumsum(f) / SR) + .6 * np.sign(np.sin(2 * np.pi * np.cumsum(f * 2.01) / SR))
    env = np.clip(x / .12, 0, 1) * np.clip((d - x) / .35, 0, 1); m.add(m.layer(m.band(s, 50, 1200) * env, m.band(rng.standard_normal(len(x)), 150, 1800) * env * .5), when, gain)
def coin(when, gain=.07): m.add(m.layer(m.tone(2637, .25, .001, .2), m.tone(3520, .2, .001, .15) * .6), when, gain, rng.random() - .5)
def boing(when, gain=.12): x = t(.35); m.add(np.sin(2 * np.pi * np.cumsum(260 + 160 * np.sin(x * 40) * np.exp(-x * 6)) / SR) * np.exp(-x * 7), when, gain)
def buzz(when, gain=.08): x = t(.28); m.add(np.sign(np.sin(2 * np.pi * 110 * x)) * np.exp(-x * 5) * .6, when, gain)
def tick(when, gain=.05): m.add(m.tone(1800, .03, .001, .02), when, gain)

# ---------- ambience: river + jungle all along ----------
m.amb(m.bed_noise(250, 1400, .5, .3), 0, CUT, .02)            # water
m.amb(m.bed_noise(4000, 9000, .6, 7), 0, CUT, .006)           # insects
m.birds(.5, CUT - 1, 22, .02)

# ---------- hook: the four walk (heavy steps), «4» ----------
for k in range(6): thud(sc0['hook'] + .3 + k * .52, .16 - k * .01, 62 + (k % 2) * 8)
pop(E['hook.cuatro'], .16, 760); m.ding(E['hook.cuatro'] + .05, .07, 1568); honk(sc0['hook'] + .9, .12)
# ---------- many: counter ticks, the fisherman ----------
w0 = m.beats[1]['words'][4]
for k in range(14): tick(w0 + k * (E['many.n180'] - w0) / 14, .04)
pop(E['many.n180'], .16, 990); m.sting(E['many.nadie'], .12, (196, 247, 294, 330)); splash(E['many.nadie'] + .2, .12, .6)
# ---------- zoo / gate / river ----------
m.whoosh(sc0['zoo'] - .1, .1); pop(E['zoo.zoo'], .12, 660); pop(E['zoo.zoo'] + .25, .12, 880)
m.add(m.creak(.8), sc0['gate'] + .2, .08); thud(E['gate.murio'] + .25, .22, 120); pop(E['gate.murio'], .1, 520)
for k in range(5): thud(E['gate.nadie'] + .1 + k * .45, .12, 64)
for k in range(4): splash(sc0['river'] + .65 + k * .32, .26, 1.1)
honk(sc0['river'] + .2, .14)
# ---------- africa vs colombia ----------
m.amb(m.bed_noise(600, 3000, .4, .5), sc0['africa'], m.beats[6]['start'], .02)   # hot wind
m.whoosh(sc0['africa'] + .05, .12); m.add(m.sweep(400, 1200, .5, .3), E['africa.seq'], .05); roar(E['africa.leo'], 1.0, .2)
m.whoosh(E['africa.col'], .14); buzz(E['africa.noseq']); buzz(E['africa.noleo'])
# ---------- paradise ----------
m.birds(sc0['paradise'], scEnd['paradise'], 8, .03)
for k, key in enumerate(('rio', 'comida', 'nadie')): pop(E['paradise.' + key], .11, 700 + k * 150)
# ---------- log: paddle strokes, the «log» opens its eyes ----------
p0 = sc0['log']
for k in range(4): m.add(m.noise(.35, 300, 2500, .05, .25), p0 + .4 + k * 1.2, .06, -.2)
m.add(m.tone(220, .4, .02, .3), E['log.tronco'], .04); m.add(m.sweep(600, 300, .3, .2), E['log.tronco'] + .05, .03)
m.sting(E['log.abre'], .2, (185, 196, 277, 294)); m.boom(E['log.abre'], .18, 1.2)
for k in range(6): m.add(m.tone(500 + k * 120, .06, .001, .05), E['log.abre'] + .1 + k * .06, .03)   # bubbles
# ---------- yawn: the hippo bursts out ----------
y0 = sc0['yawn']; splash(y0 + .35, .45, 1.6); roar(y0 + .55, 1.5, .38); m.boom(y0 + .5, .3, 1.8)
pop(E['yawn.tres'], .16, 700); m.sting(E['yawn.pel'], .12, (196, 233, 294, 349))
# ---------- vet: snoring, coins, babies ----------
for k in range(3): x = t(1.1); m.add(m.band(rng.standard_normal(len(x)), 80, 600) * np.sin(np.pi * x / 1.1) ** 2, sc0['vet'] + .2 + k * 1.4, .05)
pop(E['vet.est'], .12, 820)
for k in range(8): coin(E['vet.miles'] + k * .12)
for k in range(3): boing(E['vet.crias'] + k * .18, .13)
pop(E['vet.crias'], .12, 990)
# ---------- stamp ----------
m.add(m.layer(m.hit(140, 60, .35, .12), m.noise(.12, 200, 3000, .002, .08)), E['stamp.inv'], .45); m.boom(E['stamp.inv'], .15, 1.0)
# ---------- future: counter to 1000 ----------
m.riser(sc0['future'], E['future.mil'], .18)
f0, f1 = E['future.y2035'], E['future.mil'] + .2
for k in range(24): tick(f0 + k * (f1 - f0) / 24, .04)
pop(E['future.y2035'], .14, 880); m.sting(E['future.mil'] + .2, .16, (196, 247, 294, 392))
# ---------- end: back to the four ----------
m.whoosh(sc0['end'] - .1, .1); pop(E['end.cuatro'], .16, 760); m.ding(E['end.cuatro'] + .05, .08, 1568); honk(sc0['end'] + .5, .12)
m.whooshes_and_pops()
m.finish('--voice' in sys.argv)

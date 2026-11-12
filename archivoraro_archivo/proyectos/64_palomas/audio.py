# Música + efectos de «Las palomas que pilotaban misiles» (sin voz; con --voice mezcla narration.wav cuando llegue).
# Tono: curiosidad divertida → swing/cumbia ligera alegre (marimba, bajo, guacharaca) y efectos cómicos.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR

m = Mix(HERE, seed=64)
E, CUT = m.E, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(64)
t = lambda n: np.arange(int(n * SR)) / SR

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

# ---------- música: 100 bpm, ligera ----------
BPM = 100; beat = 60 / BPM
prog = [(110.0, [440, 554, 659]), (82.4, [415, 494, 659]), (73.4, [370, 440, 587]), (82.4, [415, 494, 659])]   # A E D E
mel = [880, 740, 659, 740, 880, 988, 880, 740, 659, 554, 659, 740, 659, 554, 494, 554]
def quiet(x):  # la banda baja en el «cancelado»
    return sc0['cancel'] + .4 < x < scEnd['cancel'] + .2
tt, i = 0.0, 0
while tt < CUT - .05:
    bar, b = divmod(i, 4); root, ch = prog[bar % 4]; g = .4 if quiet(tt) else 1.0
    if b in (0, 2): m.add(bass(root), tt, .32 * g, bed=True); m.add(kick(), tt, .16 * g, bed=True)
    if b in (1, 3): m.add(bass(root * 1.5), tt + beat * .5, .2 * g, bed=True); m.add(m.noise(.12, 800, 4000, .002, .08), tt, .05 * g, -.2, bed=True)
    for h, ga in ((0, .06), (.5, .04), (.75, .045)): m.add(guacharaca(), tt + h * beat, ga * g, .25, bed=True)
    if tt > E['hook.tres'] - .1:
        m.add(marimba(mel[(i * 2) % 16]), tt, .1 * g, -.15, bed=True); m.add(marimba(mel[(i * 2 + 1) % 16]), tt + beat * .5, .07 * g, -.15, bed=True)
        if b == 0: [m.add(marimba(f, .9), tt, .04 * g, .2, bed=True) for f in ch]
    tt += beat; i += 1

# ---------- efectos ----------
def pop(when, gain=.14, f=880): m.add(m.layer(m.sweep(f * .6, f * 1.6, .09, .05), m.tone(f * 2, .06, .001, .04) * .4), when, gain)
def coo(when, gain=.1, pan=0.0, f0=420):   # arrullo de paloma: «cu-cuuu»
    for k, (d, f) in enumerate(((.12, f0), (.3, f0 * .9))):
        x = t(d); ff = f * (1 + .06 * np.sin(2 * np.pi * 7 * x)); s = np.sin(2 * np.pi * np.cumsum(ff) / SR) + .4 * np.sin(4 * np.pi * np.cumsum(ff) / SR)
        env = np.sin(np.pi * x / d) ** 1.5; m.add(m.band(s * env, 200, 2500), when + k * .16, gain, pan)
def flap(when, gain=.08, n=4):
    for k in range(n): m.add(m.noise(.07, 600, 5000, .004, .05), when + k * .07, gain * (1 - k * .12), rng.random() - .5)
def peck(when, gain=.1): m.add(m.layer(m.tone(1800, .03, .001, .02), m.noise(.02, 1500, 6000, .001, .015)), when, gain)
def coin(when, gain=.07): m.add(m.layer(m.tone(2637, .25, .001, .2), m.tone(3520, .2, .001, .15) * .6), when, gain, rng.random() - .5)
def thud(when, gain=.22, f=80): m.add(m.layer(m.hit(f, f * .5, .32, .14), m.noise(.08, 60, 500, .002, .06) * .6), when, gain)
def boing(when, gain=.12): x = t(.35); m.add(np.sin(2 * np.pi * np.cumsum(260 + 160 * np.sin(x * 40) * np.exp(-x * 6)) / SR) * np.exp(-x * 7), when, gain)
def tick(when, gain=.05): m.add(m.tone(1800, .03, .001, .02), when, gain)
def bark(when, gain=.14):
    x = t(.16); f = 520 * np.exp(-x * 4); s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .5 + np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)
    m.add(m.band(s * np.exp(-x * 14) * np.clip(x / .006, 0, 1), 250, 3000), when, gain)
def crunch(when, gain=.08):
    for k in range(5): m.add(m.noise(.04, 1200, 7000, .002, .03), when + k * .06, gain * (1 - k * .15))
def ding(when, gain=.08, f=1568): m.add(m.layer(m.tone(f, .6, .001, .5), m.tone(f * 2.01, .4, .001, .3) * .3), when, gain)
def jet(when, d=2.0, gain=.12):
    x = t(d); n = m.band(rng.standard_normal(len(x)), 300, 4000) * np.clip(x / .3, 0, 1) * np.clip((d - x) / .4, 0, 1); m.add(n, when, gain)
def applause(a, b, gain=.08):
    n = int((b - a) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(int((b - a) * 60)):
        p = int(rng.random() * (n - 2000)); s[p:p + 1500] += m.band(rng.standard_normal(1500), 900, 6000) * np.exp(-np.arange(1500) / 180)
    m.add(s * np.clip(x / .3, 0, 1) * np.clip((b - a - x) / .5, 0, 1), a, gain)

# ambiente de laboratorio (ventilador y ciudad lejana) en las escenas del laboratorio
for sc in ('hook', 'army', 'lab', 'how', 'dog', 'train', 'crackpot', 'navy'):
    m.amb(m.bed_noise(120, 700, .3, .4), sc0[sc], scEnd[sc], .012)
for sc in ('screen', 'peck', 'three'):
    m.amb(m.bed_noise(60, 400, .2, .2), sc0[sc], scEnd[sc], .02)   # zumbido dentro del morro

# 1 gancho: tres palomas asoman
for k in range(3): boing(sc0['hook'] + .15 + k * .22, .1); coo(sc0['hook'] + .3 + k * .22, .07, (k - 1) * .4, 420 + k * 40)
pop(E['hook.tres'], .16, 760); ding(E['hook.tres'] + .05, .07)
# 2 ejército: saco de dinero
thud(E['army.dinero'] + .1, .3, 90)
for k in range(6): coin(E['army.dinero'] + .1 + k * .06)
pop(E['army.y1943'], .12, 700); pop(E['army.ejercito'], .1, 880)
# 3 laboratorio lleno de palomas
for k in range(6): coo(sc0['lab'] + .3 + k * .55, .05, rng.random() - .5, 380 + rng.random() * 120)
flap(E['lab.palomas'], .1, 8); pop(E['lab.fred'], .12, 820)
# 4 ¿cómo pilota?
m.add(m.sweep(500, 900, .3, .2), E['how.como'], .06); coo(E['how.paloma'], .09, 0, 470)
# 5 pantalla
m.add(m.tone(1200, .5, .02, .4) * .5, E['screen.pantalla'], .04); pop(E['screen.barco'], .12, 660)
for k in range(6): m.add(m.tone(880, .05, .001, .04), sc0['screen'] + .4 + k * .8, .025)        # radar
# 6 picotea
for k in range(10): peck(E['peck.picotea'] + k * .175, .12)
m.add(m.sweep(700, 400, .4, .2), E['peck.izq'] - .3, .05)
# 7 el misil gira
jet(sc0['turn'] - .1, scEnd['turn'] - sc0['turn'] + .1, .1); m.add(m.sweep(300, 900, .8, .4), E['turn.gira'], .06)
# 8 perro
bark(sc0['dog'] + .6); bark(sc0['dog'] + .85, .1); pop(E['dog.galleta'], .12, 880); crunch(E['dog.sienta'] + .45, .1)
pop(E['dog.sienta'], .1, 600); ding(E['dog.solo'], .08, 1760); bark(E['dog.solo'] + .2, .1)
# 9 entrenamiento: acierto → alpiste
for k in range(6): peck(E['train.acierta'] - .35 + k * .22, .11)
ding(E['train.acierta'], .09, 1318)
for k in range(10): m.add(m.noise(.02, 2000, 8000, .001, .015), E['train.comida'] + .1 + k * .05, .05)
for k in range(10): m.add(m.noise(.02, 2000, 8000, .001, .015), E['train.acierta'] + .15 + k * .05, .05)
# 10 tres palomas: mosca, votación
x = t(1.6); m.add(m.band(np.sign(np.sin(2 * np.pi * (220 + 30 * np.sin(x * 9)) * x)) * .4, 150, 3000) * np.sin(np.pi * x / 1.6), E['three.distrae'] - .2, .03)
for k in range(3): pop(E['three.tres'] + k * .1, .1, 660 + k * 110)
for k in range(8): peck(E['three.mayoria'] + k * .19, .1)
ding(E['three.mayoria'] + .1, .08, 1568)
# 11 comité: murmullo
for k in range(5): m.add(m.band(rng.standard_normal(int(.4 * SR)), 200, 900) * np.sin(np.linspace(0, np.pi, int(.4 * SR))), sc0['committee'] + .3 + k * .6, .025)
pop(E['committee.comite'], .1, 760)
# 12 cancelado: sello
m.add(m.layer(m.hit(140, 60, .35, .12), m.noise(.12, 200, 3000, .002, .08)), E['cancel.cancelo'], .5); m.boom(E['cancel.cancelo'], .16, 1.0)
m.add(m.sweep(400, 180, .5, .3), E['cancel.no'], .06); pop(E['cancel.y1944'], .1, 700)
# 13 chiflado: boing y risa de muelle
for k in range(4): boing(E['crackpot.chiflado'] + k * .14, .11)
flap(E['crackpot.chiflado'], .08, 5)
# 14 Marina: sábana, polvo, contador de años
m.add(m.noise(.45, 400, 6000, .02, .3), E['navy.resucito'] - .1, .14); thud(E['navy.resucito'] + .2, .12, 70)
pop(E['navy.y1948'], .12, 760); pop(E['navy.marina'], .1, 880)
for k in range(6): tick(E['navy.cinco'] - .3 + k * .22, .06)
# 15 premio: aplausos, fanfarria
applause(E['prize.premio'] - .1, CUT + .2, .1)
for k, f in enumerate((523, 659, 784, 1046)): m.add(m.tone(f, .5, .01, .35, harm=(1, 2, 3)), E['prize.premio'] + k * .12, .05)
pop(E['prize.y2024'], .12, 880); coo(E['prize.palomas'], .1, 0, 450)
m.whooshes_and_pops()
m.finish('--voice' in sys.argv)

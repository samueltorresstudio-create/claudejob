# Música + efectos de «Las vacas cebra» (sin voz; con --voice mezcla narration.wav cuando llegue).
# Tono: curiosidad divertida en el campo japonés → koto pulsado (escala pentatónica), shakuhachi suave, bajo, shaker y taiko ligero.
# Ambiente: cigarras de verano (semi), pájaros; por la mañana, gallo. Efectos: brochazos, cubo, mugidos, zumbido de moscas, golpe y mareo, clicker, barbería.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR

m = Mix(HERE, seed=62)
E, CUT = m.E, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(62)
t = lambda n: np.arange(int(n * SR)) / SR

def koto(f, d=1.2):   # cuerda pulsada (Karplus-Strong)
    n = int(d * SR); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n): out[i] = buf[i % p]; buf[i % p] = .5 * (buf[i % p] + buf[(i + 1) % p]) * .996
    return out * np.clip(np.arange(n) / (.002 * SR), 0, 1)
def flute(f, d=.9):
    x = t(d); vib = 1 + .006 * np.sin(2 * np.pi * 5 * x) * np.clip(x / .3, 0, 1); ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + .25 * np.sin(2 * ph) + .08 * np.sin(3 * ph); br = m.band(rng.standard_normal(len(x)), f * .8, f * 3) * .12
    return (s + br) * np.clip(x / .08, 0, 1) * np.clip((d - x) / .25, 0, 1)
def bass(f, d=.42):
    x = t(d); return (np.sin(2 * np.pi * f * x) + .3 * np.sin(4 * np.pi * f * x)) * np.clip(x / .01, 0, 1) * np.exp(-x * 4)
def taiko(d=.35):
    x = t(d); f = 120 * np.exp(-x * 14) + 55; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 8) + m.band(rng.standard_normal(len(x)), 80, 600) * np.exp(-x * 40) * .3
def shaker(d=.08):
    x = t(d); return m.band(rng.standard_normal(len(x)), 4000, 11000) * np.exp(-x * 45) * np.clip(x / .004, 0, 1)

# ---------- música: 104 bpm, pentatónica de re (D E F# A B) ----------
BPM = 104; beat = 60 / BPM
D4, E4, Fs4, A4, B4, D5, E5, Fs5, A5 = 293.7, 329.6, 370.0, 440.0, 493.9, 587.3, 659.3, 740.0, 880.0
roots = [73.4, 98.0, 82.4, 110.0]            # D G E A
mel = [D5, E5, Fs5, A5, Fs5, E5, D5, B4, A4, B4, D5, E5, D5, B4, A4, Fs4]
def quiet(x): return sc0['como'] - .1 < x < scEnd['como']             # la música se corta un momento en «¿Cómo es posible?»
tt, i = 0.0, 0
while tt < CUT - .05:
    bar, b = divmod(i, 4); g = .15 if quiet(tt) else 1.0
    if b in (0, 2): m.add(bass(roots[bar % 4]), tt, .3 * g, bed=True); m.add(taiko(), tt, .18 * g, bed=True)
    if b in (1, 3): m.add(bass(roots[bar % 4] * 1.5), tt + beat * .5, .18 * g, bed=True)
    for h, ga in ((0, .05), (.5, .035)): m.add(shaker(), tt + h * beat, ga * g, .3, bed=True)
    m.add(koto(mel[(i * 2) % 16]), tt, .1 * g, -.2, bed=True); m.add(koto(mel[(i * 2 + 1) % 16]), tt + beat * .5, .07 * g, -.2, bed=True)
    if b == 0 and bar % 2 == 1: m.add(flute(mel[(i + 3) % 16] / 2, beat * 3.5), tt, .05 * g, .2, bed=True)
    tt += beat; i += 1

# ---------- efectos ----------
def pop(when, gain=.12, f=880): m.add(m.layer(m.sweep(f * .6, f * 1.6, .09, .05), m.tone(f * 2, .06, .001, .04) * .4), when, gain)
def stroke(when, dur=.8, gain=.09):   # brochazo húmedo
    x = t(dur); n = m.band(rng.standard_normal(len(x)), 900, 5000) * np.sin(np.pi * x / dur) ** .8 * (1 + .4 * np.sin(2 * np.pi * 9 * x)); m.add(m.norm(n), when, gain, -.1)
def plop(when, gain=.14): x = t(.25); m.add(np.sin(2 * np.pi * np.cumsum(300 + 900 * np.exp(-x * 20)) / SR) * np.exp(-x * 14), when, gain); m.add(m.noise(.15, 800, 5000, .002, .06), when + .02, gain * .5)
def drip(when, gain=.08): x = t(.12); m.add(np.sin(2 * np.pi * np.cumsum(900 + 1200 * x / .12) / SR) * np.exp(-x * 30), when, gain)
def moo(when, gain=.14, f=120, d=1.0, pan=0.0):
    x = t(d); ff = f * (1 + .25 * np.sin(np.pi * x / d)) * (1 + .01 * np.sin(2 * np.pi * 5 * x)); ph = 2 * np.pi * np.cumsum(ff) / SR
    s = sum(np.sin(k * ph) / k for k in range(1, 12)); s = m.band(s, 80, 1800) * np.clip(x / .1, 0, 1) * np.clip((d - x) / .25, 0, 1); m.add(m.norm(s), when, gain, pan)
def buzz(a, b, gain=.05, f=190, pan=0.0, n=1):
    if b <= a: return
    x = t(b - a); s = np.zeros(len(x))
    for k in range(n): ff = f * (1 + .03 * k) * (1 + .04 * np.sin(2 * np.pi * (3 + k) * x + k)); s += np.sign(np.sin(2 * np.pi * np.cumsum(ff) / SR)) * (.6 + .4 * np.sin(2 * np.pi * (1.3 + k * .4) * x + k))
    s = m.band(s, 150, 4000) * np.clip(x / .08, 0, 1) * np.clip((b - a - x) / .12, 0, 1); m.add(m.norm(s) * min(1, .7 + .1 * n), a, gain, pan)
def swat(when, gain=.12): m.add(m.layer(m.noise(.06, 800, 6000, .001, .03), m.hit(200, 80, .1, .04) * .5), when, gain)
def thud(when, gain=.25, f=90): m.add(m.layer(m.hit(f, f * .5, .32, .14), m.noise(.08, 60, 500, .002, .06) * .6), when, gain)
def boing(when, gain=.13): x = t(.45); m.add(np.sin(2 * np.pi * np.cumsum(240 + 180 * np.sin(x * 40) * np.exp(-x * 6)) / SR) * np.exp(-x * 6), when, gain)
def tweet(when, gain=.05): [m.add(m.sweep(2600, 3600, .06, .03), when + k * .11, gain, .3) for k in range(3)]
def click(when, gain=.06): m.add(m.layer(m.tone(2400, .02, .001, .01), m.noise(.015, 2000, 8000, .001, .008)), when, gain)
def whoosh(when, gain=.12, dur=.4): m.whoosh(when, gain, dur)
def chuckle(when, gain=.06, f=220):   # risita (vocal sintética)
    for k in range(4): m.add(m.sung(f * (1 - k * .04), .12, (500, 1100)), when + k * .13, gain)
def rooster(when, gain=.08):
    for k, (f, d) in enumerate(((620, .18), (780, .18), (900, .6))): x = t(d); ff = f * (1 + .05 * np.sin(2 * np.pi * 9 * x)); s = sum(np.sin(j * 2 * np.pi * np.cumsum(ff) / SR) / j for j in range(1, 8)); m.add(m.band(s, 300, 4000) * np.sin(np.pi * x / d), when + sum((.18, .2)[:k]), gain)

# ambiente de verano: cigarras (semi) + brisa, pájaros; la barbería tiene un poco de tráfico lejano
cic = m.bed_noise(3800, 7200, .6, 7.0) * (0.55 + .45 * np.sin(2 * np.pi * .35 * m.t)); air = m.bed_noise(120, 600, .3, .2)
for sc in ('hook', 'apodo', 'valla', 'jirafa', 'moja', 'negra', 'nosevan', 'tercera', 'mosca', 'hambre', 'normal', 'negras', 'cebra', 'estampa', 'como', 'engana', 'cuenta', 'olor'):
    m.amb(cic, sc0[sc], scEnd[sc], .012); m.amb(air, sc0[sc], scEnd[sc], .01)
for sc in ('barberia', 'giran'): m.amb(m.bed_noise(80, 900, .3, .3), sc0[sc], scEnd[sc], .014)
for sc in ('manana', 'brocha'): m.amb(air, sc0[sc], scEnd[sc], .012)
m.birds(0, 20, 7, .02); m.birds(sc0['manana'], CUT, 8, .025)

# 1 gancho: tres brochazos y goteo
for k, (a, b) in enumerate(((.05, 1.05), (1.55, 2.45), (2.95, 3.85))): stroke(a, b - a, .1); drip(b + .1, .05)
pop(E['hook.cebra'], .1, 760); moo(E['hook.negra'] + .1, .07, 125, .7, .2)
# 2 pueblo: la vecina señala, el chico se ríe
whoosh(E['apodo.llaman'] - .1, .06, .25); chuckle(E['apodo.rayas'] + .05, .07, 260)
# 3-4 el vecino se apoya y suelta la broma
thud(E['valla.apoya'] + .02, .12, 140); m.add(m.noise(.05, 600, 3000, .001, .03), E['valla.apoya'] + .05, .06)
boing(E['jirafa.jirafa'] + .05, .1); chuckle(E['jirafa.cuando'] + .3, .06, 200)
# 5 moja la brocha: plop en el cubo, goteo y vuelve a pintar
stroke(sc0['moja'] + .05, max(.4, E['moja.moja'] - .35 - sc0['moja']), .08); plop(E['moja.moja'] + .1, .16); drip(E['moja.brocha'] + .3, .07); drip(E['moja.brocha'] + .45, .05); stroke(E['moja.sigue'] + .02, .9, .1)
# 6 rayas negras
for k, (a, b) in enumerate(((.1, .9), (1.25, 2.05), (2.4, 3.2))): stroke(sc0['negra'] + a, b - a, .09)
# 7 no se ven: «mmm» del vecino
m.add(m.sung(150, .7, (300, 700)), E['nosevan.ven'], .05)
# 8 la tercera ni la toca
pop(E['tercera.toca'], .1, 520); moo(E['tercera.tercera'] + .2, .06, 115, .8, -.2)
# 9-10 tú eres la mosca
buzz(sc0['mosca'], scEnd['mosca'], .07, 210); pop(E['mosca.mosca'], .1, 880); m.add(m.sweep(1800, 2600, .12, .06), E['mosca.pican'], .06)
buzz(sc0['hambre'], E['hambre.hambre'] - .05, .03, 210); m.add(m.noise(.3, 2500, 8000, .01, .2) * .5, E['hambre.hambre'], .05)
# 11 la vaca normal: llegan las moscas; mugido de harta
buzz(sc0['normal'], scEnd['normal'], .06, 180, 0, 5); buzz(sc0['normal'], E['normal.aterrizas'], .05, 220); pop(E['normal.aterrizas'], .1, 700)
moo(E['normal.ciento'] + .3, .12, 105, 1.2); for_k = [swat(E['normal.ciento'] + .2 + k * .55, .07) for k in range(4)]
# 12 rayas negras: igual
buzz(sc0['negras'], scEnd['negras'], .06, 175, 0, 5); moo(E['negras.once'] + .1, .1, 110, 1.0, .2); [swat(sc0['negras'] + .6 + k * .5, .07) for k in range(5)]
# 13 vas a por la cebra, frenas y te pasas
buzz(sc0['cebra'], E['cebra.frenas'], .07, 230); m.add(m.sweep(900, 300, .35, .2), E['cebra.frenas'], .07); m.add(m.noise(.25, 1000, 6000, .01, .1), E['cebra.frenas'], .05)
whoosh(E['cebra.pasas'] - .05, .16, .5); buzz(E['cebra.pasas'], E['cebra.pasas'] + .5, .05, 300)
# 14 te estampas contra el lomo
buzz(sc0['estampa'], E['estampa.estampas'], .07, 240); thud(E['estampa.estampas'], .3, 160); boing(E['estampa.estampas'] + .05, .14); tweet(E['estampa.estampas'] + .5, .05)
# 15 ¿cómo es posible? mareo
tweet(sc0['como'] + .1, .05); tweet(sc0['como'] + .6, .04); m.add(m.sweep(600, 300, .6, .3), E['como.posible'], .05)
# 16-17 barbería: campanita de la puerta; el palo gira
m.ding(E['barberia.palo'], .06, 1568); m.ding(E['barberia.palo'] + .15, .04, 2093)
m.add(m.sweep(400, 1200, .5, .3), E['giran.subir'], .05); m.add(m.sweep(1200, 500, .4, .25), E['giran.realidad'], .05)
x = t(1.2); m.add(m.norm(m.band(rng.standard_normal(len(x)), 500, 3000) * (.5 + .5 * np.sin(2 * np.pi * 4 * x)) * np.sin(np.pi * x / 1.2)), E['giran.giran'], .05)
# 18 cámara lenta: zumbido grave y se pasa
buzz(sc0['engana'] + .2, E['engana.tiempo'] + .3, .05, 110); m.add(m.sweep(500, 200, .4, .2), E['engana.calcula'], .06); whoosh(E['engana.frena'], .1, .6)
# 19 clicker: uno por mosca hasta 56; «la mitad»
nclk = 56; dt = (E['cuenta.cincuenta'] - .1 - E['cuenta.cuenta']) / nclk
for k in range(nclk): click(E['cuenta.cuenta'] + k * dt, .05)
pop(E['cuenta.cincuenta'], .12, 880); m.ding(E['cuenta.mitad'], .07, 1318)
# 20 olor de la pintura
buzz(sc0['olor'], scEnd['olor'], .05, 175, 0, 4); m.add(m.sweep(300, 500, .6, .4), E['olor.olor'], .04)
# 21 la mañana siguiente: gallo, moscas alrededor del vecino, manotazos
rooster(sc0['manana'] + .25, .07); buzz(sc0['manana'] + .5, scEnd['manana'], .03, 230, .2, 2)
[swat(sc0['manana'] + .6 + k * .7, .08) for k in range(3)]; thud(E['manana.apoyarse'] + .02, .1, 140)
# 22 «¿me dejas la brocha?»: final
pop(E['brocha.kenji'], .1, 660); m.add(m.sweep(500, 900, .25, .15), E['brocha.dejas'], .06)
for k, f in enumerate((587, 740, 880, 1175)): m.add(koto(f, 1.0), E['brocha.brocha'] + .25 + k * .1, .08)
m.whooshes_and_pops()
m.finish('--voice' in sys.argv)

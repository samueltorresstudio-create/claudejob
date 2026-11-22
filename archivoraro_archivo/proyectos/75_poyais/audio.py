# Música + efectos de «El país que no existía» (75). Con --voice mezcla narration.wav.
# Banda de DIBUJOS ANIMADOS: tema saltarín de pizzicato y tuba (Do mayor) mientras MacGregor engaña; trompeta triste en «no existía»;
# fanfarria en el himno; campana del barco y gaviotas; en la selva se apaga la música: insectos, zumbido de mosquitos y piano triste;
# acordeón en París; vuelve el tema en Londres; golpes de cartón al caer la ciudad; «¡ka-ching!» en los bonos agotados.
import os, sys, json
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR
import unicodedata, re

m = Mix(HERE, seed=75)
CUT = m.CUT
rng = np.random.default_rng(75)
t = lambda n: np.arange(int(n * SR)) / SR
N = lambda s: 440 * 2 ** (s / 12)          # semitonos respecto a La4
SCRIPT = json.load(open(os.path.join(HERE, 'script.json')))
norm = lambda w: re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFD', w).encode('ascii', 'ignore').decode().lower())
def W(sc, li, word, nth=0):                # instante absoluto de la n-ésima «word» en la línea li de la escena sc
    L = [(l, b) for l, b in zip(SCRIPT, m.beats) if l['sc'] == sc]
    if li >= len(L): return None
    l, b = L[li]; c = 0
    for w, tt in zip(l['cap'].split(' '), b['words']):
        if norm(w.split('|')[0]) == word:
            if c == nth: return tt
            c += 1
    return None
def S0(sc): return next((b['start'] for l, b in zip(SCRIPT, m.beats) if l['sc'] == sc), None)
sc = {k: S0(k) for k in ['gancho', 'cacique', 'pruebas', 'barcos', 'selva', 'paris', 'final']}
# ---------- instrumentos ----------
def pluck(f, d=.32): x = t(d); return sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (9 + k * 4)) / k for k in range(1, 5)) * np.clip(x / .003, 0, 1)
def tuba(f, d=.34): x = t(d); return (np.sin(2 * np.pi * f * x) + .45 * np.sin(4 * np.pi * f * x) + .2 * np.sin(6 * np.pi * f * x)) * np.exp(-x * 5) * np.clip(x / .012, 0, 1)
def brass(f, d=.4, v=0.):
    x = t(d); ph = 2 * np.pi * np.cumsum(f * (1 + v * np.sin(2 * np.pi * 5.5 * x))) / SR
    return sum(np.sin(k * ph) / k for k in range(1, 7)) * np.clip(x / .03, 0, 1) * np.clip((d - x) / .08, 0, 1)
def accordion(f, d=.4): x = t(d); s = sum(np.sin(2 * np.pi * f * k * x * (1 + det)) / k for k in range(1, 6) for det in (0, .004)); return s * (1 + .25 * np.sin(2 * np.pi * 6 * x)) * np.clip(x / .02, 0, 1) * np.clip((d - x) / .06, 0, 1)
def buzz(dur, f=640, jit=.05):
    x = t(dur); ph = 2 * np.pi * np.cumsum(f * (1 + .03 * np.sin(2 * np.pi * 7 * x) + jit * np.sin(2 * np.pi * 23 * x + 1))) / SR
    return sum(np.sin(k * ph) / k for k in range(1, 8)) * (.6 + .4 * np.sin(2 * np.pi * 3.1 * x)) * np.clip(x / .1, 0, 1) * np.clip((dur - x) / .2, 0, 1)
def bell(f=880, d=1.6): x = t(d); return sum(np.sin(2 * np.pi * f * r * x) * np.exp(-x * (2 + r)) * g for r, g in ((1, 1), (2.76, .5), (5.4, .25), (8.9, .12)))
def wahwah(t0, g=.2):   # trompeta triste: tres notas que bajan y la última temblando
    for i, (s, d, v) in enumerate([(-2, .36, 0), (-3, .36, 0), (-4, .36, 0), (-5, 1.1, .03)]): m.add(brass(N(s - 12), d, v) * (.9 if i < 3 else 1), t0 + i * .38, g, bed=True)
def kaching(when, g=.25): m.add(m.layer(m.tone(2093, .5, .002, .3), m.tone(2637, .6, .002, .4), m.noise(.12, 3000, 9000, .001, .04) * .6), when, g)
def stamp(when, g=.4): m.add(m.layer(m.hit(140, 50, .3, .08), m.noise(.15, 200, 3000, .001, .05) * .5), when, g)
def jingle(a, b, n, g=.05):
    for k in range(n): m.add(m.tone(rng.uniform(2200, 3600), .18, .001, .08), a + (b - a) * rng.random(), g * rng.uniform(.5, 1), rng.uniform(-.6, .6))
def sparkle(when, g=.05): [m.add(m.tone(f, .25, .001, .15), when + i * .05, g) for i, f in enumerate((2637, 3136, 3951))]

# ---------- tema de dibujos (Do mayor, corchea = .2 s) ----------
E8 = .2
MEL = [(4, 1), (8, 1), (11, 1), (8, 1), (9, 1), (13, 1), (11, 1), (8, 1), (6, 1), (9, 1), (8, 1), (4, 1), (6, 1), (-1, 1), (4, 2)]   # semitonos sobre C4=-9
BAS = [-21, -26, -28, -26]
def theme(a, b, g=.07, gb=.09):
    if a is None or b is None or b <= a: return
    tt, i = a, 0
    while tt < b - .05:
        s, d = MEL[i % len(MEL)]; m.add(pluck(N(s + 3)), tt, g, pan=.2 * (1 if i % 2 else -1), bed=True); tt += d * E8; i += 1
    tt, i = a, 0
    while tt < b - .05:
        m.add(tuba(N(BAS[i % 4])), tt, gb, bed=True); tt += 2 * E8; i += 1
g0, c0, p0, b0, s0, pa0, f0 = [sc[k] for k in ['gancho', 'cacique', 'pruebas', 'barcos', 'selva', 'paris', 'final']]
tEx = W('gancho', 2, 'existia') or (c0 - .8)
theme(0, tEx - .05, .08, .1)
wahwah(tEx - .05, .22)
theme(c0, s0 - .2, .07, .09)
# fanfarria del himno
tHi = W('pruebas', 0, 'himno')
if tHi:
    for i, (s, d) in enumerate([(3, .2), (3, .2), (3, .2), (7, .6), (5, .2), (3, .2), (2, .2), (3, .8)]): m.add(brass(N(s), d + .05), tHi + sum(x[1] for x in [(3, .2), (3, .2), (3, .2), (7, .6), (5, .2), (3, .2), (2, .2), (3, .8)][:i]), .1, bed=True)
# selva: sin tema; arpegio de La menor lento y piano triste
if s0:
    tt = W('selva', 1, 'no') or s0 + 7.7
    for k in range(10): m.add(pluck(N([-12, -9, -5, -9][k % 4]), .8), tt + k * .5, .05, bed=True)
    tS = W('selva', 2, 'muchos') or s0 + 10.6
    for k, s in enumerate([-12, -9, -5, -7, -9, -12]): m.add(m.musicbox(N(s - 3), 1.2), tS + k * .45, .07, bed=True)
# París: acordeón de vals (Fa mayor)
if pa0:
    tP = W('paris', 1, 'anos') or pa0 + 2.4
    for k, s in enumerate([-4, 0, 3, 0, -4, 0, 5, 3, 0]): m.add(accordion(N(s), .32), pa0 + k * .27, .06, bed=True)
    theme(tP, f0 - .1, .07, .09)
# final: tema hasta que caen los edificios; el último tramo, tema completo y acorde final
fb = W('final', 1, 'pero') or f0 + 3
theme(fb, CUT - .6, .07, .09)
m.add(m.norm(sum(brass(N(s), 1.2) for s in (3, 7, 10, 15))), CUT - 1.0, .1, bed=True)
m.whooshes_and_pops()

# ---------- ambientes ----------
city = m.bed_noise(300, 2500, .2, .2); street = m.bed_noise(150, 1600, .3, .3); sea = m.bed_noise(120, 1400, .6, .18); jung = m.bed_noise(3500, 8000, .5, 3.); cafe = m.bed_noise(250, 2200, .3, .5)
m.amb(city * .5, g0, c0, .04); m.birds(g0 + .3, c0 - .5, 4, .02)
m.amb(street, c0, b0, .05)
m.amb(sea, b0, s0, .1); m.amb(sea, s0, pa0, .07); m.amb(jung, s0, pa0, .03)
m.amb(cafe, pa0, W('paris', 1, 'anos') or pa0 + 2.4, .05); m.amb(street, W('paris', 1, 'anos') or pa0 + 2.4, f0, .05); m.amb(street, fb, CUT, .05)
# ---------- efectos ----------
tV = W('gancho', 0, 'vendio');
if tV: m.add(m.sweep(500, 1400, .18, .06), tV, .08); sparkle(tV + .1)
tC = W('gancho', 0, 'cientos')
if tC: m.steps(tC - .2, W('gancho', 1, 'tenia') or tC + 2.4, .19, .04)
for w in ('opera', 'catedral', 'palacio'):
    tt = W('gancho', 1, w)
    if tt: m.ding(tt, .08, {'opera': 1568, 'catedral': 1760, 'palacio': 2093}[w]); sparkle(tt + .05, .035)
if tEx: m.add(m.layer(m.creak(.5, 40, 20), m.noise(.2, 400, 3000, .002, .08)), tEx + .1, .12); m.add(m.hit(220, 120, .15, .05), tEx, .12)
tG = W('cacique', 0, 'general');  sparkle(tG + .1) if tG else None
tCq = W('cacique', 1, 'cacique')
if tCq: m.add(m.layer(m.sweep(300, 900, .3, .1), m.noise(.3, 800, 4000, .01, .1) * .4), tCq - .1, .14); m.add(m.hit(90, 45, .5, .2), tCq, .2)
tR = W('cacique', 1, 'rio')
if tR: m.add(m.sweep(900, 1500, .25, .1), tR, .07); [m.add(m.noise(.05, 1500, 5000, .001, .02), tR + .1 + k * .09, .05, rng.uniform(-.7, .7)) for k in range(14)]   # aplausos suaves
tPr = W('pruebas', 0, 'pruebas')
if tPr: m.add(m.sweep(400, 700, .3, .1), tPr, .07)
tCu = W('pruebas', 0, 'cuadros')
if tCu: m.add(m.noise(.25, 1500, 6000, .002, .1), tCu - .1, .06); sparkle(tCu + .1)
tOf = W('pruebas', 0, 'oficinas')
if tOf: m.steps(tOf, tOf + 1.6, .22, .035); m.ding(tOf + .3, .05, 2349)
tBo = W('pruebas', 0, 'bonos')
if tBo: jingle(tBo, (W('barcos', 0, 'y') or tBo + 2) - .1, 22, .05); kaching(W('pruebas', 0, '200000') or tBo + .8, .2)
tZ = W('barcos', 0, 'zarpo')
if tZ: m.add(bell(), tZ, .12); m.add(bell(), tZ + .55, .09); m.birds(b0 + .2, s0 - .5, 6, .03)
tO = W('barcos', 0, 'otro')
if tO: m.add(bell(740), tO, .08)
tEn = W('selva', 0, 'encontraron')
if tEn: m.add(buzz(1.4, 640), tEn + .2, .05); m.add(buzz(1.2, 700), tEn + .4, .04, .4)
tMa = W('selva', 0, 'mas')
if tMa: m.add(buzz(1.0, 600, .08), tMa, .08); m.add(buzz(.9, 760, .08), tMa + .1, .06, -.4); m.add(m.hit(300, 200, .08, .03), tMa + .5, .1)   # manotazo
tPa = W('selva', 0, 'palacio')
if tPa: m.add(buzz(1.6, 560), tPa - .1, .06); tI = W('selva', 0, 'imaginas'); m.add(m.norm(sum(pluck(N(s), .5) for s in (3, 7, 10))), (tI or tPa + .8) + .2, .07)
tSe = W('selva', 1, 'selva')
if tSe: m.add(m.layer(m.creak(.4, 30, 15), m.hit(120, 50, .4, .1)), tSe + .25, .2)
tPar = W('paris', 0, 'paris')
if tPar: m.ding(tPar, .05, 2637); m.ding(tPar + .08, .04, 3136)       # cucharilla en la taza
tVe = W('paris', 1, 'vender')
if tVe: jingle(tVe, tVe + 2.2, 16, .045); kaching(tVe + .2, .15)
tSi = W('paris', 1, 'si')
if tSi: sparkle(tSi + .7, .06)
for w, nth in (('ciudades', 0), ('gente', 0), ('opera', 0)):
    tt = W('final', 0, w)
    if tt: m.add(m.layer(m.hit(100, 40, .5, .15), m.noise(.4, 200, 2500, .003, .2) * .5), tt + .45, .3); m.add(m.creak(.3, 40, 20), tt, .06)
tB2 = W('final', 1, 'bonos')
if tB2: stamp(tB2, .35); kaching(tB2 + .15, .2)
tVd = W('final', 1, 'vendieron')
if tVd: jingle(tVd, CUT - .3, 26, .05)
m.riser(CUT - 1.8, CUT, .1)
m.finish(with_voice='--voice' in sys.argv)

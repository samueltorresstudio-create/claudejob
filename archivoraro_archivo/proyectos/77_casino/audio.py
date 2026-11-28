# Música + efectos de «Las tres reglas secretas de los casinos» (77). Con --voice mezcla narration.wav.
# Casino de dibujos: jazz travieso (bajo caminando + marimba + escobillas), ambiente de sala (murmullo y tragaperras lejanas), pasos al entrar, reloj que gira y trapo que cae,
# aspas «¡no!», fichas, rodillos que giran, palanca, «pérdida disfrazada» con fanfarria y confeti, pitidos del laboratorio, aviso del móvil y trombón triste del final.
import os, sys, json
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR
import unicodedata, re

m = Mix(HERE, seed=77)
CUT = m.CUT
rng = np.random.default_rng(77)
t = lambda n: np.arange(int(n * SR)) / SR
N = lambda s: 440 * 2 ** (s / 12)
SCRIPT = json.load(open(os.path.join(HERE, 'script.json')))
norm = lambda w: re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFD', w).encode('ascii', 'ignore').decode().lower())
def W(sc, li, word, nth=0):
    L = [(l, b) for l, b in zip(SCRIPT, m.beats) if l['sc'] == sc]
    if li >= len(L): return None
    l, b = L[li]; c = 0
    for w, tt in zip(l['cap'].split(' '), b['words']):
        if norm(w.split('|')[0]) == word:
            if c == nth: return tt
            c += 1
    return None
def S0(sc): return next((b['start'] for l, b in zip(SCRIPT, m.beats) if l['sc'] == sc), None)
def SE(sc): return next((b['start'] + b['d'] for l, b in reversed(list(zip(SCRIPT, m.beats))) if l['sc'] == sc), None)
SC = ['gancho', 'regla1', 'jefe', 'cristal', 'relojes', 'regla2', 'laberinto', 'regla3', 'perdida', 'lab', 'bolsillo', 'final']
st = {k: S0(k) for k in SC}; en = {k: SE(k) for k in SC}
# ---------- instrumentos ----------
def pluck(f, d=.32): x = t(d); return sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (9 + k * 4)) / k for k in range(1, 5)) * np.clip(x / .003, 0, 1)
def bass(f, d=.3): x = t(d); return (np.sin(2 * np.pi * f * x) + .35 * np.sin(4 * np.pi * f * x)) * np.exp(-x * 6) * np.clip(x / .008, 0, 1)
def brass(f, d=.4, v=0.):
    x = t(d); ph = 2 * np.pi * np.cumsum(f * (1 + v * np.sin(2 * np.pi * 5.5 * x))) / SR
    return sum(np.sin(k * ph) / k for k in range(1, 7)) * np.clip(x / .03, 0, 1) * np.clip((d - x) / .08, 0, 1)
def marimba(f, d=.45): x = t(d); return (np.sin(2 * np.pi * f * x) + .3 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 30)) * np.exp(-x * 7) * np.clip(x / .002, 0, 1)
def kaching(when, g=.25): m.add(m.layer(m.tone(2093, .5, .002, .3), m.tone(2637, .6, .002, .4), m.noise(.12, 3000, 9000, .001, .04) * .6), when, g)
def sparkle(when, g=.05): [m.add(m.tone(f, .25, .001, .15), when + i * .05, g) for i, f in enumerate((2637, 3136, 3951))]
def coin(when, g=.07, f=3300): m.add(m.layer(m.tone(f, .22, .001, .12, (1, 2.4)), m.tone(f * 1.5, .16, .001, .08)), when, g, rng.uniform(-.5, .5))
def coins(a, b, n, g=.05): [coin(a + (b - a) * rng.random(), g * rng.uniform(.6, 1), rng.uniform(2800, 4200)) for _ in range(n)]
def buzzer(when, g=.14): m.add(m.tone(98, .35, .004, .1, harm=(1, 3, 5, 7, 9)), when, g)
def thud(when, g=.4): m.add(m.layer(m.hit(110, 40, .4, .12), m.noise(.08, 200, 2500, .001, .05) * .5), when, g)
def whoosh(when, g=.1, dur=.45): m.whoosh(when, g, dur)
def lever(when, g=.2): m.add(m.layer(m.hit(220, 90, .16, .05), m.noise(.05, 600, 4000, .001, .03) * .6), when, g); m.add(m.hit(150, 70, .12, .05), when + .2, g * .7)
def reels(a, b, g=.05):
    tt = a
    while tt < b: m.add(m.tone(1700 + 300 * rng.random(), .02, .0005, .015), tt, g, rng.uniform(-.3, .3)); tt += .045
def beep(when, f=1200, g=.05, d=.09): m.add(m.tone(f, d, .002, d * .8), when, g, .2)
def pop(when, g=.07, f0=300, f1=900): x = t(.14); ph = 2 * np.pi * np.cumsum(f0 + (f1 - f0) * (1 - np.exp(-x * 30))) / SR; m.add(np.sin(ph) * np.exp(-x * 25), when, g)
def boing(when, g=.08, f0=180, f1=520): x = t(.35); ph = 2 * np.pi * np.cumsum(f0 + (f1 - f0) * (1 - np.exp(-x * 9)) + 30 * np.sin(2 * np.pi * 18 * x)) / SR; m.add(np.sin(ph) * np.exp(-x * 6), when, g)
def ding(when, g=.1, f=1319): m.ding(when, g, f)
def fanfare(when, g=.07): [m.add(brass(N(s), .3 if i < 3 else .8, .004), when + i * .13, g, pan=.1) for i, s in enumerate((3, 7, 10, 15))]
def sadtrombone(when, g=.09): [m.add(brass(N(s), .45 if i < 3 else 1.2, .01), when + i * .42, g) for i, s in enumerate((-2, -3, -4, -5))]
def tick(a, b, every=.5, g=.05):
    tt = a
    while tt < b: m.add(m.tone(1800 if int(round((tt - a) / every)) % 2 else 2200, .03, .001, .02), tt, g, .3); tt += every
# ---------- temas: jazz travieso (bajo caminando, marimba, escobillas) ----------
E8 = .17
MEL_JAZZ = [(3, 1), (7, 1), (10, 1), (8, 1), (7, 1), (5, 1), (3, 2), (0, 1), (3, 1), (5, 1), (7, 1), (8, 1), (10, 2), (7, 1), (5, 1)]
MEL_SLY = [(-4, 1), (-2, 1), (0, 1), (3, 1), (0, 1), (-2, 1), (-4, 2), (-7, 1), (-4, 1), (-2, 1), (-4, 2)]
BAS_JAZZ = [-21, -19, -16, -14, -12, -14, -16, -19]
def theme(a, b, mel, bas, g=.06, gb=.1, inst=marimba, swing=True):
    if a is None or b is None or b <= a: return
    tt, i = a, 0
    while tt < b - .05:
        s, d = mel[i % len(mel)]; m.add(inst(N(s + 3)), tt, g, pan=.2 * (1 if i % 2 else -1), bed=True); tt += d * E8 * (1.18 if swing and i % 2 else .94 if swing else 1); i += 1
    tt, i = a, 0
    while tt < b - .05: m.add(bass(N(bas[i % len(bas)])), tt, gb, bed=True); tt += 2 * E8; i += 1
    tt = a
    while tt < b - .05: m.add(m.noise(.07, 4000, 9000, .002, .05), tt + E8, .02, bed=True); tt += 2 * E8
g0, rg1, jf, cr, rl, rg2, lb, rg3, pe, la, bo, fi = [st[k] for k in SC]
# música por tramos
theme(0, jf, MEL_SLY, BAS_JAZZ, .055, .1)
theme(jf, rg2, MEL_JAZZ, BAS_JAZZ, .055, .09)
theme(rg2, rg3, MEL_SLY, BAS_JAZZ, .055, .1)
theme(rg3, pe, MEL_JAZZ, BAS_JAZZ, .05, .09)
theme(la, fi, MEL_SLY, BAS_JAZZ, .05, .1)
theme(fi, CUT, MEL_JAZZ, BAS_JAZZ, .05, .09)
# ambiente de sala: murmullo y tragaperras lejanas en el casino, silencio de laboratorio y despacho
for a, b in [(g0, en['regla1']), (cr, en['relojes']), (rg3, en['perdida']), (bo, CUT), (lb, en['laberinto'])]:
    if a is not None and b is not None and b > a: m.amb(m.bed_noise(300, 1800, .3, .2), a, b, .012)
for a, b, n in [(g0, en['regla1'], 26), (cr, en['relojes'], 30), (rg3, en['perdida'], 12), (bo, CUT, 14)]:
    if a is not None and b is not None: [coin(a + (b - a) * rng.random(), .02, rng.uniform(1800, 3000)) for _ in range(n)]
# ---------- gancho ----------
tSa = W('gancho', 0, 'sales'); tCa = W('gancho', 0, 'casualidad'); tOc = W('gancho', 0, 'ocho')
if tSa: m.steps(0.2, tSa - .12, .43, .05, 0, 0, 150, 1600)
if tOc: sparkle(tOc + .05, .035)
if tSa:
    whoosh(tSa - .22, .1); lever(tSa + .25, .16); reels(tSa + .2, tSa + 1.5, .04)
    for k in range(14): m.add(m.tone(1500 + k * 70, .03, .001, .02), tSa + .2 + k * .1, .035)
if tCa: whoosh(tCa - .3, .1); thud(tCa + .02, .4); m.riser(tCa - .1, tCa + .6, .06)
# ---------- regla 1 ----------
tSt = S0('regla1')
if tSt: sparkle(tSt + .2, .06); ding(tSt + .2, .06)
tV = W('regla1', 0, 'ventanas'); tR = W('regla1', 0, 'relojes')
if tV: pop(tV + .02, .08); buzzer(tV + .05, .12)
if tR: pop(tR + .02, .08); buzzer(tR + .05, .12)
# ---------- jefe ----------
tVe = W('jefe', 0, 'vegas'); tCo = W('jefe', 0, 'comprobo')
if tVe: sparkle(tVe, .05); m.add(marimba(N(10), .5), tVe, .08)
if tCo: pop(tCo + .02, .07, 400, 1400); ding(tCo + .08, .08, 1568)
# ---------- cristal ----------
tSe = W('cristal', 0, 'segun'); t85 = W('cristal', 0, '85'); t90 = W('cristal', 0, '90'); tVr = W('cristal', 0, 'ver'); tAs = W('cristal', 0, 'asi'); tTa = W('cristal', 0, 'tapo')
if tSe:
    whoosh(tSe - .2, .09)
    for k in range(5): lever(tSe + .2 + k * .55, .07)
if t85:
    for k in range(10): pop(t85 + k * .09, .04, 500 + k * 40, 1100 + k * 40)
if t90: buzzer(t90 + .4, .06)
if tVr: m.add(m.tone(880, 1.2, .1, .8, (1, 2)), tVr - .1, .05); m.steps(tVr + .3, tVr + 3.3, .3, .05, 0, 0, 200, 2000)
if tAs: whoosh(tAs - .12, .09); m.add(m.noise(1.0, 400, 3500, .1, .6) * np.sin(np.linspace(0, np.pi, SR)) ** 2, tAs + .05, .09)
if tTa: thud(tTa + .35, .3)
# ---------- relojes ----------
tSi = W('relojes', 0, 'sin'); tCu = W('relojes', 0, 'cuanto')
if rl: tick(rl, (tSi or rl + 2), .55, .05)
if tSi: boing(tSi + .35, .06); boing(tSi + .9, .05, 220, 640)
# ---------- regla 2 ----------
tRe = W('regla2', 0, 'recta')
if rg2: sparkle(rg2 + .2, .06); ding(rg2 + .2, .06, 1175)
if tRe: whoosh(tRe - .3, .07); buzzer(tRe + .12, .12); pop(tRe + .1, .07)
# ---------- laberinto ----------
tPa = W('laberinto', 0, 'pasillos'); tTe = W('laberinto', 0, 'techos'); tSg = W('laberinto', 0, 'siempre'); tEs = W('laberinto', 0, 'esquina')
if tPa: whoosh(tPa - .2, .08); m.steps(tPa, tSg - .3 if tSg else tPa + 3, .45, .05, 0, 0, 150, 1600)
if tTe: whoosh(tTe - .15, .06); m.add(m.tone(70, 2.0, .3, 1.0, (1, 2)), tTe, .05)
if tEs: sparkle(tEs, .06); boing(tEs + .15, .05, 200, 700); m.add(m.tone(1568, .6, .002, .4, (1, 2)), tEs + .1, .05)
# ---------- regla 3 ----------
tPr = W('regla3', 0, 'perder', 1)
if rg3: sparkle(rg3 + .2, .06); ding(rg3 + .2, .06, 1319)
if rg3: lever(rg3 + 1.0, .13)
if tPr: m.add(m.tone(1760, .5, .002, .35, (1, 2)), tPr, .05)
# ---------- pérdida disfrazada ----------
tDi = W('perdida', 0, 'disfrazada'); tAp = W('perdida', 0, 'apuestas'); tD10 = W('perdida', 0, 'diez'); tUn = W('perdida', 0, 'uno'); tMu = W('perdida', 0, 'musica'); tLu = W('perdida', 0, 'luces')
if tDi: pop(tDi + .1, .08, 250, 800); m.add(m.sung(200, .5, (700, 1100)), tDi + .45, .02)
if tAp: whoosh(tAp - .2, .08); lever(tAp + .05, .14)
if tD10:
    for k in range(10): coin(tD10 - .15 + k * .11 + .22, .07)
if tAp and tUn: reels(tAp + .15, tUn - .05, .045)
if tUn:
    coin(tUn + .1, .1, 2600); kaching(tUn + .2, .22); fanfare(tUn + .15, .08); sparkle(tUn + .3, .06)
    coins(tUn + .3, tUn + 3.2, 34, .06)
    for k in range(18): m.add(m.tone(1300 + (k % 6) * 180, .05, .001, .03), tUn + .3 + k * .13, .03)
# ---------- laboratorio ----------
tMi = W('lab', 0, 'midieron'); tRc = W('lab', 0, 'reaccionaba'); tRd = W('lab', 0, 'recordaban'); tTv = W('lab', 0, 'tuvieron')
if la and tMi: whoosh(tMi - .2, .07)
if tMi and tRd:
    tt = tMi
    while tt < tRd - .2: beep(tt, 1250, .035); tt += .62
if tRc:
    for k in range(9): beep(tRc + k * .15, 1250 + k * 90, .05)
if tRd:
    for k in range(5): pop(tRd + .2 + k * .24, .06, 500 + k * 80, 1100 + k * 80); sparkle(tRd + .2 + k * .24, .03)
    pop(tRd + 1.8, .05, 300, 600)
# ---------- bolsillo ----------
tRj = W('bolsillo', 0, 'reloj'); tLl = W('bolsillo', 0, 'llevas')
if tRj: pop(tRj + .05, .07); buzzer(tRj + .1, .12)
if tLl: whoosh(tLl - .2, .08); ding(tLl + .15, .1, 1568); m.add(m.tone(1568, .12, .002, .08), tLl + .35, .06); sparkle(tLl + .4, .05)
# ---------- final ----------
tCe = W('final', 0, 'celebrando'); tPi = W('final', 0, 'pierdes')
if fi:
    reels(fi, (tPi or fi + 3), .035); coins(fi, (tPi or fi + 3), 30, .05); fanfare(fi + .2, .05)
    for k in range(12): m.add(m.tone(1200 + (k % 5) * 200, .05, .001, .03), fi + .3 + k * .22, .028)
if tPi: sadtrombone(tPi - .1, .07)
m.riser(CUT - 1.8, CUT, .08)
m.finish(with_voice='--voice' in sys.argv)

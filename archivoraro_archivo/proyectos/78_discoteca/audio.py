# Música + efectos del 78 «La discoteca donde solo entran los feos». Con --voice mezcla narration.wav.
# Calle de noche: música de la discoteca amortiguada (bombo y bajo detrás de la puerta) + coches lejanos; dentro: música disco a pleno
# (bombo a negras, charles, bajo en octavas, acordes de sintetizador); aula: piano suave. Efectos en cada acción.
import os, sys, json
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR
import unicodedata, re

m = Mix(HERE, seed=78)
CUT = m.CUT
rng = np.random.default_rng(78)
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
def LS(sc, li): L = [b for l, b in zip(SCRIPT, m.beats) if l['sc'] == sc]; return L[li]['start'] if li < len(L) else None

# ---------- instrumentos ----------
def kick(): x = t(.3); f = 50 + 110 * np.exp(-x * 30); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 9)
def hat(): return m.noise(.05, 7000, 12000, .001, .03)
def clap(): return m.noise(.15, 900, 4000, .002, .08)
def sbass(f, d=.2): x = t(d); return (np.sign(np.sin(2 * np.pi * f * x)) * .4 + np.sin(2 * np.pi * f * x)) * np.exp(-x * 5) * np.clip(x / .004, 0, 1)
def chord(fs, d=.35): x = t(d); return sum(sum(np.sin(2 * np.pi * f * k * x * (1 + .003 * j)) / k for k in (1, 2, 3) for j in (-1, 1)) for f in fs) * np.clip(x / .01, 0, 1) * np.exp(-x * 4) / len(fs)
def piano(f, d=.9): x = t(d); return sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (2.5 + k * 1.5)) / k for k in (1, 2, 3, 4)) * np.clip(x / .003, 0, 1)
BPM = 118; Q = 60 / BPM
PROG = [(-12, [0, 4, 7]), (-9, [-3, 0, 4]), (-7, [-7, -3, 0]), (-5, [-5, -1, 2])]
def disco(a, b, g=1.0, muffled=False):
    if a is None or b is None or b <= a: return
    n = 0; tt = a
    while tt < b - .02:
        bar = (n // 4) % 4; root, ch = PROG[bar]
        m.add(kick(), tt, .22 * g, bed=True)
        if not muffled:
            m.add(hat(), tt + Q / 2, .05 * g, .2, bed=True)
            if n % 2: m.add(clap(), tt, .06 * g, -.1, bed=True)
            if n % 2 == 0: m.add(chord([N(c + 3) for c in ch], Q * 1.6), tt + Q * .5, .035 * g, bed=True)
        m.add(sbass(N(root - 12 + (12 if n % 2 else 0)), Q * .8), tt, (.1 if not muffled else .07) * g, bed=True)
        tt += Q; n += 1
def pianoBed(a, b, g=.05):
    if a is None or b is None or b <= a: return
    seq = [0, 4, 7, 12, 7, 4, -3, 0, 4, 9, 4, 0]; tt, i = a, 0
    while tt < b - .1: m.add(piano(N(seq[i % len(seq)])), tt, g, .15 * (1 if i % 2 else -1), bed=True); tt += .38; i += 1
def whoosh(when, g=.1, dur=.45): m.whoosh(when, g, dur)
def pop(when, g=.07, f0=300, f1=900): x = t(.14); ph = 2 * np.pi * np.cumsum(f0 + (f1 - f0) * (1 - np.exp(-x * 30))) / SR; m.add(np.sin(ph) * np.exp(-x * 25), when, g)
def buzzer(when, g=.12): m.add(m.tone(98, .35, .004, .1, harm=(1, 3, 5, 7, 9)), when, g)
def ding(when, g=.1, f=1319): m.ding(when, g, f)
def coin(when, g=.06, f=3300): m.add(m.layer(m.tone(f, .22, .001, .12, (1, 2.4)), m.tone(f * 1.5, .16, .001, .08)), when, g, rng.uniform(-.5, .5))
def kaching(when, g=.22): m.add(m.layer(m.tone(2093, .5, .002, .3), m.tone(2637, .6, .002, .4), m.noise(.12, 3000, 9000, .001, .04) * .6), when, g)
def sparkle(when, g=.05): [m.add(m.tone(f, .25, .001, .15), when + i * .05, g) for i, f in enumerate((2637, 3136, 3951))]
def camera(when, g=.15): m.add(m.layer(m.noise(.05, 2000, 8000, .001, .03), m.hit(900, 300, .08, .03)), when, g); m.add(m.noise(.12, 1500, 6000, .002, .08), when + .08, g * .6)
def scratch(when, g=.08): x = t(.3); f = 400 + 900 * np.sin(np.pi * x / .3); m.add(np.sin(2 * np.pi * np.cumsum(f) / SR) * (np.random.default_rng(1).random(len(x)) * .6 + .4) * np.exp(-x * 4), when, g)
def chalk(a, b, g=.04):
    tt = a
    while tt < b: m.add(m.noise(.08, 2500, 7000, .005, .06), tt, g, .1); tt += .11 + .05 * rng.random()
def doorThud(when, g=.25): m.add(m.layer(m.hit(120, 50, .3, .1), m.noise(.06, 200, 2000, .001, .04) * .4), when, g)
def laugh(when, g=.05):
    for k in range(5): m.add(m.sung(180 - k * 6, .14, (600, 1000)), when + k * .16, g)

SC = ['gancho', 'norma', 'mira', 'gym', 'entra', 'rival', 'pista', 'barra', 'disfraz', 'valgo', 'aula', 'psico', 'foto', 'entera', 'reflejo', 'bucle']
st = {k: S0(k) for k in SC}; en = {k: SE(k) for k in SC}
# ---------- música por sitio: calle = disco amortiguada tras la puerta; dentro = disco a pleno; aula = piano ----------
for a, b in [(0, en['gym']), (st['rival'], en['rival']), (st['disfraz'], en['valgo']), (st['bucle'], CUT)]: disco(a, b, .8, muffled=True)
for a, b in [(st['entra'], en['entra']), (st['pista'], en['barra']), (st['foto'], en['reflejo'])]: disco(a, b, 1.0)
pianoBed(st['aula'], en['psico'], .045)
# ambiente: calle (tráfico lejano), dentro (gente), aula (sala)
for a, b in [(0, en['gym']), (st['rival'], en['rival']), (st['disfraz'], en['valgo']), (st['bucle'], CUT)]: m.amb(m.bed_noise(120, 900, .3, .15), a, b, .014)
for a, b in [(st['entra'], en['entra']), (st['pista'], en['barra']), (st['foto'], en['reflejo'])]: m.amb(m.bed_noise(300, 2200, .4, .3), a, b, .016)
# ---------- gancho ----------
tFe = W('gancho', 0, 'feos'); tDi = W('gancho', 1, 'dinero')
m.steps(0.2, (LS('gancho', 1) or 3) - .2, .43, .05, 0, 0, 150, 1600)
if tFe: buzzer(tFe + .02, .1); ding(tFe + .25, .06, 1568)
if tDi: kaching(tDi, .2); [coin(tDi + .1 + k * .07, .05) for k in range(14)]; sparkle(tDi + .2, .05)
# ---------- norma ----------
tNa = W('norma', 0, 'nadie')
if st['norma']: whoosh(st['norma'] - .2, .08)
if tNa: m.add(m.tone(220, .4, .01, .3, (1, 2)), tNa, .05)
# ---------- mira ----------
tPa = W('mira', 0, 'pasa'); tFu = W('mira', 0, 'fuera')
if st['mira']: m.add(m.tone(660, 1.2, .3, .5, (1, 2)), st['mira'] + .1, .025)
if tPa: ding(tPa + .02, .09, 1568); m.steps(tPa + .1, tPa + 1.1, .4, .05, 0, 0, 150, 1600)
if tFu: buzzer(tFu + .02, .13)
# ---------- gym ----------
tGf = W('gym', 0, 'fuera')
if tGf: buzzer(tGf + .02, .13); pop(tGf + .05, .06, 500, 200)
# ---------- entra (puerta, ambiente sube) ----------
if st['entra']: doorThud(st['entra'] + .05, .2); whoosh(st['entra'] - .2, .08); ding(st['entra'] + .3, .07, 1319)
# ---------- rival ----------
tTe = W('rival', 0, 'te'); tMe = W('rival', 0, 'mes')
if tTe: laugh(tTe - .1, .05)
if tMe: pop(tMe + .1, .06)
# ---------- pista ----------
if st['pista']: whoosh(st['pista'] - .2, .09); sparkle(st['pista'] + .2, .05)
tLi = W('pista', 1, 'ligan'); tSa = W('pista', 1, 'sabado')
if tLi: m.add(m.tone(1760, .3, .002, .2, (1, 2)), tLi, .04)
if tSa: scratch(tSa - .1, .07)
# ---------- barra ----------
tDo = W('barra', 0, 'doble'); tOy = W('barra', 1, 'oye'); tNc = LS('barra', 2)
if tDo: kaching(tDo, .2); [coin(tDo + .1 + k * .06, .05) for k in range(10)]
if tOy: m.add(m.tone(523, .25, .01, .2), tOy, .03)
if tNc: m.add(m.noise(1.2, 3000, 9000, .1, .8), tNc, .006); m.add(m.tone(1200, .08, .001, .05), tNc + .5, .03)   # grillo: silencio incómodo
# ---------- disfraz ----------
tGa = W('disfraz', 0, 'gafas'); tUn = W('disfraz', 0, 'uno'); tDn = W('disfraz', 0, 'negro')
if st['disfraz']: whoosh(st['disfraz'] - .2, .08)
if tGa: pop(tGa, .07, 200, 700)
if tDn: pop(tDn, .07, 700, 300); sparkle(tDn + .1, .04)
# ---------- valgo ----------
tVf = LS('valgo', 1)
if tVf: buzzer(tVf + .05, .15); doorThud(tVf + .1, .18)
# ---------- aula ----------
tCo = LS('aula', 1); tAl = W('aula', 2, 'lado')
if st['aula']: whoosh(st['aula'] - .2, .08); pop(st['aula'] + .2, .06)
if tCo: chalk(tCo, tCo + 1.2, .04); ding(tCo + .1, .08, 1047)
if tAl: sparkle(tAl, .05)
# ---------- psico ----------
tGu = W('psico', 0, 'guapisima'); tNo = W('psico', 0, 'normal'); tPe = W('psico', 0, 'peor')
if tGu: ding(tGu, .08, 1760); sparkle(tGu + .05, .04)
if tNo: pop(tNo, .07, 500, 250)
if tPe: buzzer(tPe, .09)
# ---------- foto ----------
tFo = W('foto', 0, 'foto'); tMj = W('foto', 0, 'mejor')
if tFo: camera(tFo, .16)
if tMj: sparkle(tMj, .05)
# ---------- entera ----------
if st['entera']: whoosh(st['entera'] - .2, .1); m.riser(st['entera'], en['entera'], .05)
# ---------- reflejo ----------
tSi = W('reflejo', 0, 'sin'); tRe = W('reflejo', 0, 'reflejo')
if tSi: m.add(m.tone(110, .8, .05, .5, (1, 2, 3)), tSi, .04)
if tRe: buzzer(tRe + .05, .12); m.add(m.noise(.4, 3000, 9000, .001, .3), tRe + .1, .04)
# ---------- bucle ----------
if st['bucle']: whoosh(st['bucle'] - .2, .09)
m.riser(CUT - 1.6, CUT, .07)
m.finish(with_voice='--voice' in sys.argv)

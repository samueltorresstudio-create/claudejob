# Música + efectos de «El plátano de seis millones» (76). Con --voice mezcla narration.wav.
# Gancho de atraco (bajo sigiloso, zumbido de láseres, pitidos de alarma) · tema de dibujos con pizzicato en la feria · risas · zumbador de «¡NO!»
# · cinta que se rasga · subasta con pulso que acelera, «¡ding!» en cada paleta y martillazo con «ka-ching» · flashes y mordiscos crujientes
# · páginas que vuelan · «¡ajá!» de la idea · lluvia de plátanos con «boing» · final con subida y golpe.
import os, sys, json
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR
import unicodedata, re

m = Mix(HERE, seed=76)
CUT = m.CUT
rng = np.random.default_rng(76)
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
def L0(sc, li): L = [b for l, b in zip(SCRIPT, m.beats) if l['sc'] == sc]; return L[li]['start'] if li < len(L) else None
SC = ['gancho', 'miami', 'precio', 'dudas', 'papel', 'come', 'subasta', 'ganador', 'veras', 'certificado', 'otro', 'frutero', 'final']
st = {k: S0(k) for k in SC}
# ---------- instrumentos ----------
def pluck(f, d=.32): x = t(d); return sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (9 + k * 4)) / k for k in range(1, 5)) * np.clip(x / .003, 0, 1)
def bass(f, d=.3): x = t(d); return (np.sin(2 * np.pi * f * x) + .35 * np.sin(4 * np.pi * f * x)) * np.exp(-x * 6) * np.clip(x / .008, 0, 1)
def brass(f, d=.4, v=0.):
    x = t(d); ph = 2 * np.pi * np.cumsum(f * (1 + v * np.sin(2 * np.pi * 5.5 * x))) / SR
    return sum(np.sin(k * ph) / k for k in range(1, 7)) * np.clip(x / .03, 0, 1) * np.clip((d - x) / .08, 0, 1)
def marimba(f, d=.45): x = t(d); return (np.sin(2 * np.pi * f * x) + .3 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 30)) * np.exp(-x * 7) * np.clip(x / .002, 0, 1)
def kaching(when, g=.25): m.add(m.layer(m.tone(2093, .5, .002, .3), m.tone(2637, .6, .002, .4), m.noise(.12, 3000, 9000, .001, .04) * .6), when, g)
def sparkle(when, g=.05): [m.add(m.tone(f, .25, .001, .15), when + i * .05, g) for i, f in enumerate((2637, 3136, 3951))]
def jingle(a, b, n, g=.05):
    for k in range(n): m.add(m.tone(rng.uniform(2200, 3600), .18, .001, .08), a + (b - a) * rng.random(), g * rng.uniform(.5, 1), rng.uniform(-.6, .6))
def crunch(when, g=.3, low=1.):   # mordisco crujiente
    for k in range(5): m.add(m.noise(.05 + .02 * k, 900 * low, 6500 * low, .001, .04), when + k * .035, g * (1 - k * .12), rng.uniform(-.2, .2))
    m.add(m.hit(160 * low, 70 * low, .12, .05), when, g * .6)
def chew(a, b, g=.06):
    tt = a
    while tt < b: m.add(m.noise(.07, 400, 2500, .005, .05), tt, g); tt += .22
def rip(when, g=.18, dur=.35): x = t(dur); s = m.noise(dur, 1800, 9000, .002, dur * .8) * (1 + .6 * np.sin(2 * np.pi * 38 * x)); m.add(s, when, g)
def buzzer(when, g=.16): m.add(m.tone(98, .42, .004, .12, harm=(1, 3, 5, 7, 9)), when, g)
def shutter(when, g=.07): m.add(m.layer(m.noise(.025, 3000, 9000, .001, .015), m.hit(900, 400, .03, .01) * .5), when, g, rng.uniform(-.6, .6))
def shutters(a, b, n, g=.06): [shutter(a + (b - a) * rng.random(), g) for _ in range(n)]
def boing(when, g=.08, f0=180, f1=520): x = t(.35); ph = 2 * np.pi * np.cumsum(f0 + (f1 - f0) * (1 - np.exp(-x * 9)) + 30 * np.sin(2 * np.pi * 18 * x)) / SR; m.add(np.sin(ph) * np.exp(-x * 6), when, g)
def laugh(when, g=.05, n=6, f0=220):
    for k in range(n): m.add(m.sung(f0 * rng.uniform(.9, 1.4), .14, (750, 1250)), when + k * .16 + rng.uniform(0, .04), g * rng.uniform(.6, 1), rng.uniform(-.7, .7))
def gavel(when, g=.45): m.add(m.layer(m.hit(200, 80, .28, .07), m.noise(.06, 300, 3500, .001, .04)), when, g)
def whistle(when, g=.06): x = t(.5); m.add(np.sin(2 * np.pi * np.cumsum(2600 + 300 * np.sin(2 * np.pi * 28 * x)) / SR) * np.clip(x / .02, 0, 1) * np.clip((.5 - x) / .1, 0, 1), when, g)
def tick(a, b, every=.12, g=.05):
    tt = a
    while tt < b: m.add(m.tone(3200, .03, .001, .02), tt, g, .3); tt += every
def pages(a, n, g=.05): [m.add(m.noise(.09, 1500, 7000, .005, .07), a + k * .06, g * rng.uniform(.6, 1), rng.uniform(-.5, .5)) for k in range(n)]
# ---------- temas ----------
E8 = .19
MEL_SNEAK = [(-7, 1), (-4, 1), (-2, 1), (-1, 1), (-2, 2), (-4, 1), (-7, 1), (-9, 2), (-7, 2)]        # sigiloso (re menor)
MEL_FUN = [(3, 1), (7, 1), (10, 1), (7, 1), (8, 1), (12, 1), (10, 1), (7, 1), (5, 1), (8, 1), (7, 1), (3, 1), (5, 1), (-2, 1), (3, 2)]
BAS_SNEAK = [-26, -26, -23, -24]; BAS_FUN = [-21, -26, -28, -26]
def theme(a, b, mel, bas, g=.07, gb=.09, inst=pluck):
    if a is None or b is None or b <= a: return
    tt, i = a, 0
    while tt < b - .05:
        s, d = mel[i % len(mel)]; m.add(inst(N(s + 3)), tt, g, pan=.2 * (1 if i % 2 else -1), bed=True); tt += d * E8; i += 1
    tt, i = a, 0
    while tt < b - .05: m.add(bass(N(bas[i % 4])), tt, gb, bed=True); tt += 2 * E8; i += 1
g0, mi0, pr0, du0, pa0, co0, su0, ga0, ve0, ce0, ot0, fr0, fi0 = [st[k] for k in SC]
gB = (W('gancho', 0, 'y') or 2.5) - .22
theme(0, gB, MEL_SNEAK, BAS_SNEAK, .06, .11, marimba)
theme(mi0, co0 + 1.5, MEL_FUN, BAS_FUN, .065, .085)
theme(co0 + 1.5, su0, MEL_SNEAK, BAS_SNEAK, .06, .1, marimba)
tSu = L0('subasta', 1) or su0 + 3
# subasta: pulso que acelera hasta el martillazo
tSe = W('subasta', 2, 'seis') or su0 + 7; tDo = W('subasta', 2, 'dolares') or tSe + 1
tt, k = tSu, 0
while tt < tSe:
    m.add(bass(N(-26 + (k % 2) * 5), .2), tt, .1, bed=True); m.add(m.tone(N(15 + (k % 4)), .08, .002, .05), tt, .03, bed=True); tt += max(.14, .42 - k * .02); k += 1
m.add(m.norm(sum(brass(N(s), 1.4) for s in (3, 7, 10, 15))), max(tSe + .2, tDo - .05), .13, bed=True)
theme(ga0, ce0, MEL_FUN, BAS_FUN, .06, .08)
theme(ce0, fi0, MEL_FUN, BAS_FUN, .065, .085, marimba)
tY = W('final', 0, 'y') or fi0 + 2
theme(tY, CUT - .5, MEL_SNEAK, BAS_SNEAK, .06, .1, marimba)
m.add(m.norm(sum(brass(N(s), 1.2) for s in (-2, 2, 5, 9))), CUT - 1.0, .1, bed=True)
m.whooshes_and_pops()
# ---------- ambientes ----------
hum = m.bed_noise(60, 400, .3, 2.0); room = m.bed_noise(200, 2200, .25, .3); street = m.bed_noise(150, 1600, .3, .3); hall = m.bed_noise(180, 1800, .3, .4)
m.amb(hum, 0, gB, .05)
for a, b in ((mi0, su0 + .3), (ce0, fr0), (tY, CUT)): m.amb(room, a, b, .04)
m.amb(street, (W('subasta', 0, 'subasta') or su0 + 1.2) - .1, tSu, .06); m.amb(street, fr0, fi0, .06)
m.amb(hall, tSu, ga0, .05); m.amb(hall, ga0, ce0, .05)
# ---------- efectos ----------
for k in range(int(gB / .55)): m.add(m.tone(1760, .07, .002, .04), .2 + k * .55, .04, .5)          # pitido de la alarma
if W('gancho', 0, 'seis'): kaching(W('gancho', 0, 'seis'), .18); sparkle(W('gancho', 0, 'millones'))
shutters(gB, gB + 1.4, 8, .06); crunch(W('gancho', 0, 'comes') or gB + .6, .3); chew((W('gancho', 0, 'comes') or gB + .6) + .3, mi0 - .1, .05)
m.steps(mi0 + .2, L0('miami', 1) or mi0 + 2.4, .45, .03)
tCi = W('miami', 1, 'cinta')
if tCi: rip(tCi - .17, .2); m.add(m.hit(300, 200, .05, .02), tCi + .2, .12); sparkle(tCi + .3)
tP = W('precio', 0, '120000')
if tP: kaching(tP, .22); jingle(tP, tP + 1.6, 18, .045)
tBr = W('precio', 1, 'broma')
if tBr: laugh(tBr - .3, .05, 10, 200); laugh(tBr - .1, .04, 8, 300)
tOr = W('dudas', 0, 'oro')
if tOr: m.add(m.sweep(600, 2400, .5, .2), tOr - .3, .06); jingle(tOr - .2, tOr + .5, 10, .04)
for nth in (0, 1):
    tn = W('dudas', 0, 'no', nth)
    if tn: buzzer(tn, .14)
tGe = W('dudas', 0, 'genio')
if tGe: m.ding(tGe - .1, .07, 2093); m.ding(tGe, .06, 2637)
for w in ('venden', 'dos'):
    tt = W('dudas', 0, w)
    if tt: m.add(m.hit(500, 300, .06, .03), tt, .12); kaching(tt + .05, .12)
tPa = W('papel', 0, 'papel')
if tPa: pages(tPa - .4, 3, .06); sparkle(tPa)
tNa = W('papel', 0, 'nada')
if tNa: boing(tNa + .1, .07, 300, 160)
shutters(co0 + .1, (W('come', 0, 'un') or co0 + 1.6), 9, .06)
tUn = W('come', 0, 'un'); tAr = W('come', 0, 'arranca'); tCo = W('come', 0, 'come')
if tUn and tAr: m.steps(tUn, tAr - .45, .2, .05); boing(tAr - .4, .06, 200, 500); rip(tAr - .05, .16, .25); m.add(m.sweep(900, 300, .4, .1), tAr + .1, .05)
if tCo: crunch(tCo, .3); chew(tCo + .3, su0 - .1, .05); whistle(tCo + .2, .05); laugh(tCo - .4, .03, 4, 420)
tick(su0 + .1, (W('subasta', 0, 'subasta') or su0 + 1.2) - .15, .1, .05)
tNY = W('subasta', 0, 'nueva')
if tNY: m.add(m.tone(415, .5, .02, .2, harm=(1, 2, 3)), tNY, .05, .4)                              # bocina de taxi
t2 = L0('subasta', 2)
if t2:
    tt = t2
    while tt < tSe - .2: m.ding(tt + .05, .06, 1568 + 200 * rng.integers(0, 4)); m.add(m.noise(.06, 600, 3000, .002, .04), tt, .05); tt += .42
gavel(max(tSe + .2, tDo - .05), .5); kaching(max(tSe + .2, tDo - .05) + .1, .25); jingle(max(tSe + .2, tDo - .05), ga0 - .1, 22, .05)
shutters(ga0, ve0, 26, .055)
tCo2 = W('ganador', 0, 'come')
if tCo2: crunch(tCo2, .3); chew(tCo2 + .3, ce0 - .1, .05)
tId = W('veras', 0, 'idiota')
if tId: m.add(m.sweep(1200, 300, .25, .08), tId, .07)
tVe = W('veras', 0, 'veras')
if tVe: m.ding(tVe + .1, .06, 2637); sparkle(tVe + .2, .05)
tCa = W('certificado', 0, 'catorce')
if tCa: pages(tCa - .1, 14, .05)
tCom = W('certificado', 0, 'como'); tLo = W('certificado', 0, 'lo')
if tCom and tLo: m.add(m.sweep(300, 1400, max(.3, tLo - tCom - .3), .1), tCom, .05); boing(tCom + (tLo - tCom) * .72, .07)
tId2 = W('certificado', 0, 'idea')
if tId2: [m.add(marimba(N(s)), tId2 - .2 + i * .09, .08) for i, s in enumerate((3, 7, 10, 15))]
tCe = W('certificado', 0, 'centimos')
if tCe: [m.ding(tCe - .2 + i * .18, .05, 3136) for i in range(2)]
tOt = W('otro', 0, 'colgar')
if tOt: chew(ot0 + .1, tOt - .3, .05); boing(tOt, .07); rip((W('otro', 0, 'otro') or tOt + .4) - .1, .16, .3); sparkle(tOt + .2)
tPo = W('frutero', 0, 'por')
if tPo: m.add(m.tone(2637, .3, .002, .2), tPo + .3, .08); m.add(m.tone(3136, .4, .002, .3), tPo + .45, .07)
tDe = W('frutero', 0, 'de'); tCien = W('frutero', 0, 'cien')
if tDe:
    for k in range(34): boing(tDe + rng.uniform(.1, (fi0 - tDe) - .2) * (1 if k < 10 else 1), .04 * rng.uniform(.6, 1), rng.uniform(150, 260), rng.uniform(380, 620))
    for k in range(30): m.add(m.hit(220, 120, .07, .03), tDe + rng.uniform(.3, fi0 - tDe - .1), .05, rng.uniform(-.7, .7))
tBo = W('final', 0, 'bocado')
if tBo: crunch(tBo, .34, .7); shutters(fi0, tBo + .4, 8, .05)
tPd = W('final', 0, 'pared'); tO2 = W('final', 0, 'otro')
if tO2: boing(tO2, .07); sparkle(tO2 + .1)
if tPd: rip(tPd - .2, .14, .3)
m.riser(CUT - 1.8, CUT, .1)
m.finish(with_voice='--voice' in sys.argv)

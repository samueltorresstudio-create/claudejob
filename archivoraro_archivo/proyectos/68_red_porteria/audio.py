# Música + efectos de «La red de la portería» (68). Con --voice mezcla narration.wav.
# Música: marcha de banda inglesa de 1889 (tuba, caja, corneta, glockenspiel) en el estadio; de noche, en el despacho, caja de música suave.
# Ambiente: murmullo del público, oleadas de gritos y celebración, risas; de noche, reloj y lámpara. Efectos: chut, balón, golpes en cabezas,
# silbato del árbitro, red (siseo y vibración), papel arrugado y papelera, bolsillo que «traga», lápiz, gorras volando y corte seco final.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR

m = Mix(HERE, seed=68)
E, CUT = m.E, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(68)
t = lambda n: np.arange(int(n * SR)) / SR
def e(k, d=0.0): return E[k] + d if k in E else None
NIGHT = ('noche', 'bolsillos', 'dibuja', 'papelera', 'discutir')
def scene_at(x):
    cur = None
    for b in m.beats:
        if b['start'] <= x: cur = b['sc']
    return cur

# ---------- instrumentos ----------
def tuba(f, d=.32):
    x = t(d); ph = 2 * np.pi * f * x; s = np.sin(ph) + .5 * np.sin(2 * ph) + .25 * np.sin(3 * ph) + .1 * np.sin(4 * ph)
    return s * np.clip(x / .02, 0, 1) * np.exp(-x * 5)
def cornet(f, d=.3):
    x = t(d); vib = 1 + .005 * np.sin(2 * np.pi * 5.5 * x) * np.clip(x / .15, 0, 1); ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = sum(np.sin(k * ph) * (1 / k ** 1.1) for k in range(1, 9)); s = m.band(s, 200, 5000)
    return s * np.clip(x / .025, 0, 1) * np.clip((d - x) / .06, 0, 1)
def snare(d=.12, g=1.0):
    x = t(d); return (m.band(rng.standard_normal(len(x)), 1500, 9000) * np.exp(-x * 30) + np.sin(2 * np.pi * 190 * x) * np.exp(-x * 40) * .6) * g
def bassdrum(d=.3):
    x = t(d); f = 90 * np.exp(-x * 12) + 45; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 9)
def glock(f, d=.6):
    x = t(d); return (np.sin(2 * np.pi * f * x) + .3 * np.sin(2 * np.pi * f * 2.76 * x)) * np.exp(-x * 6) * np.clip(x / .002, 0, 1)
def mbox(f, d=.9):
    x = t(d); return (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 3.01 * x) * np.exp(-x * 8)) * np.exp(-x * 3.5) * np.clip(x / .003, 0, 1)
def cymbal(d=1.6):
    x = t(d); return m.band(rng.standard_normal(len(x)), 3500, 14000) * np.exp(-x * 2.2) * np.clip(x / .003, 0, 1)

# ---------- música: marcha en sol mayor, 112 bpm ----------
BPM = 112; beat = 60 / BPM
G2, C3, D3, E3 = 98.0, 130.8, 146.8, 164.8
roots = [(G2, D3 * .5), (C3 * .5 * 2, G2), (D3 * .5 * 2, 73.4 * 2), (G2, D3 * .5)]
G4, A4, B4, C5, D5, E5, Fs5, G5 = 392.0, 440.0, 493.9, 523.3, 587.3, 659.3, 740.0, 784.0
tune = [D5, B4, G4, B4, D5, G5, Fs5, E5, D5, C5, B4, A4, B4, D5, G4, 0,
        E5, C5, A4, C5, E5, G5, Fs5, E5, D5, B4, G4, A4, B4, A4, G4, 0]
mb = [G5, D5, B4, D5, E5, C5, A4, C5, D5, B4, G4, B4, A4, Fs5 / 2 * 2, D5, 0]
tt, i = 0.0, 0
while tt < CUT - .05:
    sc = scene_at(tt + .01); night = sc in NIGHT; bar, b = divmod(i, 4); r = roots[bar % 4]
    calm = sc in ('nada', 'arbitro') and False
    if not night:
        g = .8 if sc in ('gritos', 'arbitro', 'anulan') else 1.0
        m.add(tuba(r[0] if b in (0, 2) else r[1]), tt, .2 * g, bed=True)
        if b in (1, 3): m.add(snare(), tt, .06 * g, .2, bed=True); m.add(snare(.08, .5), tt + beat * .5, .03 * g, .2, bed=True)
        if b == 0: m.add(bassdrum(), tt, .14 * g, bed=True)
        n = tune[(i * 2) % 32], tune[(i * 2 + 1) % 32]
        if n[0]: m.add(cornet(n[0], beat * .48), tt, .055 * g, -.15, bed=True)
        if n[1]: m.add(cornet(n[1], beat * .48), tt + beat * .5, .045 * g, -.15, bed=True)
        if b == 0 and bar % 2 == 0: m.add(glock(n[0] * 2 if n[0] else G5 * 2), tt, .025 * g, .3, bed=True)
    else:
        f = mb[i % 16]
        if f: m.add(mbox(f * 2, 1.2), tt, .05, .1, bed=True)
        if b == 0: m.add(mbox(r[0] * 2, 1.6), tt, .045, -.1, bed=True)
    tt += beat; i += 1

# ---------- efectos ----------
def kick(when, gain=.3):   # golpe al balón de cuero
    m.add(m.layer(m.hit(150, 60, .18, .07), m.noise(.05, 600, 4000, .001, .025) * .7), when, gain)
def bonk(when, gain=.25):   # balón en la cabeza
    x = t(.3); m.add(m.layer(np.sin(2 * np.pi * np.cumsum(420 * np.exp(-x * 6) + 160) / SR) * np.exp(-x * 12), m.noise(.04, 800, 5000, .001, .02) * .6), when, gain)
def swoosh(when, gain=.1, dur=.35): m.whoosh(when, gain, dur)
def whistle(when, dur=.5, gain=.08, n=1):   # silbato de bola (pea whistle): dos tonos con trino
    for k in range(n):
        x = t(dur); tr = .5 + .5 * np.sign(np.sin(2 * np.pi * 34 * x)); s = np.sin(2 * np.pi * 2900 * x) * (.6 + .4 * tr) + .35 * np.sin(2 * np.pi * 3420 * x) * tr
        s += m.band(rng.standard_normal(len(x)), 2500, 4500) * .15; m.add(s * np.clip(x / .02, 0, 1) * np.clip((dur - x) / .04, 0, 1), when + k * (dur + .08), gain, .1)
def netswish(when, gain=.18):   # la red se hincha y vibra
    x = t(.9); s = m.band(rng.standard_normal(len(x)), 1200, 8000) * np.exp(-x * 5) * (1 + .6 * np.sin(2 * np.pi * 13 * x) * np.exp(-x * 3))
    m.add(m.layer(s, m.hit(110, 60, .25, .1) * .5), when, gain)
def crowd_bed():   # murmullo del público (bandas moduladas)
    s = np.zeros(m.N)
    for lo, hi, rate in ((200, 900, .6), (500, 1800, 1.1), (900, 3200, 1.7)):
        s += m.bed_noise(lo, hi, .5, rate)
    return m.norm(s)
CROWD = crowd_bed()
def roar(when, dur=2.4, gain=.22, rise=.25):   # oleada de gritos / celebración
    x = t(dur); env = np.clip(x / rise, 0, 1) ** 1.5 * np.clip((dur - x) / (dur * .55), 0, 1)
    s = sum(m.band(rng.standard_normal(len(x)), lo, hi) * (1 + .3 * np.sin(2 * np.pi * r * x + k)) for k, (lo, hi, r) in enumerate(((250, 1100, 3), (600, 2400, 5), (1500, 4500, 7))))
    m.add(m.norm(s) * env, when, gain)
def ooh(when, gain=.08, f=200):   # «¡oooh!» de la grada
    for k in range(5): m.add(m.sung(f * (1 + .06 * k), .9, (420, 900)), when + k * .03, gain * .4, (k - 2) * .2)
def shout(when, gain=.06, f=180, n=3):
    for k in range(n): m.add(m.sung(f * (1 + .1 * k), .22, (600, 1300)), when + k * .17, gain, (-1) ** k * .3)
def laughs(a, b, gain=.05, n=4):
    for k in range(n):
        tt = a + k * .11
        while tt < b: m.add(m.sung(200 + 60 * k, .11, (500, 1100)), tt, gain, (k - 1.5) * .3); tt += .16 + .02 * k
def tick(a, b, gain=.03):
    tt = a
    while tt < b: m.add(m.layer(m.tone(3200, .015, .001, .008), m.noise(.01, 2000, 7000, .001, .006)), tt, gain, -.3); tt += .5
def crumple(when, gain=.06):
    for k in range(7): m.add(m.noise(.05, 1500, 9000, .002, .03), when + k * .045 + rng.random() * .02, gain)
def plop(when, gain=.1): x = t(.25); m.add(np.sin(2 * np.pi * np.cumsum(300 + 700 * np.exp(-x * 20)) / SR) * np.exp(-x * 14), when, gain)
def gulp(when, gain=.14): x = t(.4); m.add(np.sin(2 * np.pi * np.cumsum(160 + 260 * np.exp(-x * 8)) / SR) * np.exp(-x * 7) + m.band(rng.standard_normal(len(x)), 200, 900) * np.exp(-x * 12) * .3, when, gain)
def scribble(a, b, gain=.04):
    x = t(b - a); s = m.band(rng.standard_normal(len(x)), 2500, 9000) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 6 * x))) * np.clip(x / .05, 0, 1) * np.clip((b - a - x) / .1, 0, 1); m.add(s, a, gain, .2)
def ding(when, gain=.12): m.add(m.layer(glock(1568, 1.2), glock(2093, 1.2) * .5), when, gain)

# ambiente: público en el estadio, reloj de noche
for sc in m.sc0:
    if sc in NIGHT: tick(sc0[sc], scEnd[sc]); m.amb(m.bed_noise(80, 400, .2, .1), sc0[sc], scEnd[sc], .006)
    else: m.amb(CROWD, sc0[sc], scEnd[sc], .05 if sc not in ('nada', 'liverpool') else .035)

# 1 · gol: chut, balón, golpe en una cabeza, media grada celebra y la otra protesta
g0 = sc0['gol']
kick(g0 + .30, .4); m.add(m.hit(140, 40, .45, .18), g0 + .30, .22)                     # chut con golpe grave
x_ = t(.62); m.add(m.band(rng.standard_normal(len(x_)), 70, 700) * np.sin(np.linspace(0, np.pi, len(x_))) ** 1.5, g0 + .42, .16)   # cámara lenta: soplido grave
m.add(m.sweep(110, 45, .6, .3), g0 + .44, .14)
swoosh(g0 + .84, .16, .28)                                                                 # el balón pasa rozando la cámara
bonk(g0 + 1.03, .32); ooh(g0 + 1.08, .1); swoosh(g0 + 1.08, .05, .3)                       # balonazo en la cabeza, la gorra sale volando
roar(g0 + 1.35, 3.0, .18, .2)                                                              # media grada celebra…
for k in range(6): shout(g0 + 1.55 + k * .38, .05, 150 + (k % 3) * 25, 2)                   # …y la otra protesta
swoosh(e('gol.jura', -.15), .08, .26)                                                      # barrido a la mitad enfadada
if e('gol.fuera'): shout(e('gol.fuera') - .12, .09, 185, 3)                                # «¡FUERA!»
# 2-3 · Liverpool: barridos entre los palos y el larguero; «detrás, nada»: viento y el matojo rodando
for w_ in ('liverpool.dos', 'liverpool.palos', 'liverpool.y'):
    if e(w_): swoosh(e(w_) - .1, .06, .22)
n0 = sc0['nada']; m.amb(m.bed_noise(1200, 5000, .7, .6), n0, scEnd['nada'], .03)
for k in range(9): m.add(m.noise(.07, 900, 7000, .004, .05), n0 + .25 + k * .12 + rng.random() * .03, .025, .6 - k * .14)
# 4 · el balón se pierde entre la gente (dos cabezazos) y empiezan los gritos
p0 = sc0['pierde']; swoosh(p0 + .2, .08); bonk(p0 + .75, .22); bonk(p0 + 1.35, .2); ooh(p0 + .8, .07)
if e('pierde.empiezan'): shout(e('pierde.empiezan') - .05, .07, 170, 5); roar(e('pierde.empiezan'), 1.6, .12)
# 5 · gritos: «¡Por encima!» «¡Por dentro del palo!»
if e('gritos.encima'): shout(e('gritos.encima') - .2, .05, 210, 2)
if e('gritos.dentro'): shout(e('gritos.dentro') - .1, .05, 160, 2)
# 6 · el árbitro decide a ojo
if e('arbitro.decide'): swoosh(e('arbitro.decide') - .2, .08, .5)
if e('arbitro.ojo'): whistle(e('arbitro.ojo') - .1, .35, .06)
# 7 · Brodie en la grada (desenrolla el plano)
if e('brodie.ingeniero'): m.add(m.noise(.35, 400, 5000, .02, .2), e('brodie.ingeniero') + .1, .05, -.2)
# 8 · gol anulado: chut, gol, celebración cortada por el silbato
a0 = sc0['anulan']; tin = a0 + .77; an = max(e('anulan.anulan', -.08), tin + .18)
kick(a0 + .27); swoosh(a0 + .3, .1); roar(tin, 1.0, .2, .1); whistle(an, .28, .09, 2); shout(an + .1, .06, 150, 3)
# 9-11 · noche en el despacho: no pega ojo, el bolsillo «traga» el balón, el lápiz dibuja la red
if e('noche.pega'): m.add(m.sung(150, .5, (300, 700)), e('noche.pega'), .03)
tt_ = e('bolsillos.trague', -.35); tl_ = e('bolsillos.trague', .05)
if tt_: swoosh(tt_, .05, .3); gulp(tl_); ding(e('bolsillos.balon') - .05, .1)
scribble(sc0['dibuja'] + .15, scEnd['dibuja'] - .25)
# 12-13 · los futbolistas se ríen; la sardina
laughs(sc0['rien'] + .1, scEnd['rien'], .05, 4); laughs(e('sardinas.sardinas', -.1), scEnd['sardinas'] + .1, .06, 4)
if e('sardinas.pescar'): swoosh(e('sardinas.pescar') - .3, .07, .3)
if e('sardinas.sardinas'): m.add(m.sweep(500, 1400, .12, .05), e('sardinas.sardinas') - .1, .06)
# 14-15 · la papelera: papel arrugado, lanzamiento, cae dentro
ts_ = e('papelera.si', -.05); te_ = max(ts_ + .6, e('papelera.entra', -.05))
crumple(sc0['papelera'] + .2); swoosh(ts_, .06, .5); plop(te_, .14); m.add(m.noise(.2, 600, 4000, .003, .12), te_ + .03, .05)
if e('discutir.discutir'): ding(e('discutir.discutir') + .1, .06)
# 16-17 · 1891: el primer gol a la red
d0 = sc0['disparo']; dk_ = d0 + max(.5, e('disparo.disparo') - d0 + .2); kick(dk_, .34); swoosh(dk_ + .02, .12, .4); netswish(dk_ + .42, .24); m.add(cymbal(), dk_ + .42, .08); roar(dk_ + .45, 3.2, .26, .2)
# 18 · obligatoria en la liga: silbato y aplausos
if sc0.get('liga'): whistle(sc0['liga'] + .3, .3, .05); roar(sc0['liga'], 3.3, .1, .5)
# 19 · hoy: balón a la red y el estadio entero grita a la vez
th_ = e('hoy.toca', -.12) + .3; swoosh(th_ - .3, .1, .35); netswish(th_, .22); roar(e('hoy.grita', -.12), 3.0, .3, .15); m.add(cymbal(2.2), e('hoy.grita', -.1), .1)
for k in range(10): m.add(m.noise(.12, 300, 2500, .01, .08), e('hoy.grita') + .2 + k * .09, .02, (k % 3 - 1) * .4)
# 20 · gracias: celebración, Brodie se toca el bombín; acorde final
roar(sc0['gracias'], scEnd['gracias'] - sc0['gracias'], .16, .3)
if e('gracias.dibujaba'): ding(e('gracias.dibujaba') - .1, .07)
m.add(m.layer(tuba(G2, 1.2), cornet(G4, .9) * .6, cornet(B4, .9) * .5, cornet(D5, .9) * .4), CUT - 1.0, .16, bed=True)

m.whooshes_and_pops()
m.finish('--voice' in sys.argv)

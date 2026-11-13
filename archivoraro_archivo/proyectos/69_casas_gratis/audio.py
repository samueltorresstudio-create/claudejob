# Música + efectos de «Casas gratis en Japón» (69). Con --voice mezcla narration.wav.
# Música propia: koto pulsado (Karplus-Strong) en escala pentatónica yo (alegre) con taiko y tablillas (hyōshigi);
# en los tramos de misterio (dentro de la casa, el fantasma) cambia a la escala in con un bordón grave y caja de música lejana;
# en el retrato del dueño, campanilla budista (rin). Efectos: lazo que cae y rebota, toques de móvil, sello, pasos, puerta corredera,
# chasquido de casitas en el mapa, billetes, fantasma, excavadora, «puf» de la casa, monedas, coche, cartel que baja, cámara rápida.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR

m = Mix(HERE, seed=69)
E, CUT = m.E, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(69)
t = lambda n: np.arange(int(n * SR)) / SR
def e(k, d=0.0): return E[k] + d if k in E else None
MYST = ('dentro', 'salir', 'encantadas', 'alguna', 'historia')
SAD = ('dueno',)
def scene_at(x):
    cur = None
    for b in m.beats:
        if b['start'] <= x: cur = b['sc']
    return cur

# ---------- instrumentos ----------
def koto(f, d=1.2, bright=.5):   # cuerda pulsada (Karplus-Strong)
    n = int(d * SR); P = max(2, int(SR / f)); buf = rng.uniform(-1, 1, P) * np.hanning(P) ** .3; out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % P]; nxt = (i + 1) % P; buf[i % P] = (1 - bright * .5) * buf[i % P] * .5 + buf[nxt] * .5 * (1 + bright * .5) * .996 * .5 + buf[i % P] * .0
    x = t(d); s = out * np.exp(-x * 2.2); s += np.sin(2 * np.pi * f * x) * np.exp(-x * 5) * .25 * np.clip(x / .002, 0, 1); return s
def koto_fast(f, d=1.0):   # versión rápida (sin bucle por muestra): suma de armónicos con decaimiento distinto
    x = t(d); s = sum(np.sin(2 * np.pi * f * k * x * (1 + .0006 * k * k)) * np.exp(-x * (2.0 + k * 1.3)) / k ** .9 for k in range(1, 9))
    pluck = m.band(rng.standard_normal(len(x)), 1500, 6000) * np.exp(-x * 90) * .25; return (s + pluck) * np.clip(x / .0015, 0, 1)
def taiko(d=.6, f=70):
    x = t(d); ff = f * (1 + .6 * np.exp(-x * 30)); return np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-x * 7) + m.band(rng.standard_normal(len(x)), 80, 900) * np.exp(-x * 40) * .5
def clack(d=.08):   # hyōshigi / tablilla de madera
    x = t(d); return (np.sin(2 * np.pi * 1850 * x) + .6 * np.sin(2 * np.pi * 2730 * x)) * np.exp(-x * 70) + m.band(rng.standard_normal(len(x)), 2000, 8000) * np.exp(-x * 120) * .4
def flute(f, d=.5):   # shakuhachi suave: seno con vibrato y aire
    x = t(d); vib = 1 + .006 * np.sin(2 * np.pi * 5 * x) * np.clip(x / .2, 0, 1); ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + .2 * np.sin(2 * ph) + m.band(rng.standard_normal(len(x)), f * .8, f * 3) * .25; return s * np.clip(x / .06, 0, 1) * np.clip((d - x) / .12, 0, 1)
def rin(when, gain=.12, f=880):   # campanilla budista
    x = t(4.0); s = sum(np.sin(2 * np.pi * f * r * x) * np.exp(-x * dcy) * a for r, dcy, a in ((1, .7, 1), (2.76, 1.3, .5), (5.40, 2.2, .25), (1.003, .7, .6)))
    m.add(s * np.clip(x / .002, 0, 1), when, gain)
def mbox(f, d=.9):
    x = t(d); return (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 3.01 * x) * np.exp(-x * 8)) * np.exp(-x * 3.5) * np.clip(x / .003, 0, 1)

# ---------- música: 96 bpm ----------
BPM = 96; beat = 60 / BPM
YO = [293.7, 329.6, 392.0, 440.0, 493.9, 587.3, 659.3, 784.0]          # re mi sol la si (yo, alegre)
IN = [293.7, 311.1, 392.0, 440.0, 466.2, 587.3, 622.3, 784.0]          # re mib sol la sib (in, misterio)
PAT = [0, 2, 3, 4, 3, 2, 5, 4, 3, 2, 1, 0, 2, 3, 2, -1, 4, 5, 6, 5, 4, 3, 2, 3, 4, 2, 1, 2, 3, 0, -1, -1]
cache = {}
def K(f, d=1.0):
    key = (round(f, 1), d)
    if key not in cache: cache[key] = koto_fast(f, d)
    return cache[key]
tt, i = 0.0, 0
while tt < CUT - .05:
    sc = scene_at(tt + .01); myst = sc in MYST; sad = sc in SAD; bar, b = divmod(i, 4)
    if myst:
        if b == 0: m.add(K(IN[0] / 2, 2.5), tt, .07, -.2, bed=True)
        if i % 3 == 0: n = IN[(i * 3) % 8]; m.add(K(n, 1.6), tt + beat * .5, .05, .25, bed=True)
        if b == 2 and bar % 2: m.add(mbox(IN[5] * 2, 1.4), tt, .02, .3, bed=True)
    elif sad:
        if b in (0, 2): m.add(mbox([YO[0], YO[2], YO[3], YO[1]][(i // 2) % 4] * 2, 1.6), tt, .05, .1, bed=True)
    else:
        n = PAT[(i * 2) % 32], PAT[(i * 2 + 1) % 32]
        if n[0] >= 0: m.add(K(YO[n[0]], 1.0), tt, .07, -.15, bed=True)
        if n[1] >= 0: m.add(K(YO[n[1]], .8), tt + beat * .5, .055, .15, bed=True)
        if b == 0: m.add(K(YO[0] / 2, 1.6), tt, .09, -.05, bed=True); m.add(taiko(), tt, .16, bed=True)
        if b == 2: m.add(taiko(.4, 95), tt, .1, bed=True)
        if b in (1, 3): m.add(clack(), tt, .05, .3, bed=True)
        if bar % 4 == 3 and b == 3: m.add(clack(), tt + beat * .5, .04, -.3, bed=True)
    tt += beat; i += 1
# frase de flauta en los tramos alegres largos
for sc in ('vacias', 'vecina', 'normales', 'venderla'):
    if sc in sc0:
        a = sc0[sc] + .2
        for k, f in enumerate((587.3, 659.3, 784.0, 659.3)): m.add(flute(f, .45), a + k * beat * .5, .025, .2)

# ---------- efectos ----------
def whoosh(when, gain=.1, dur=.35): m.whoosh(when, gain, dur)
def thump(when, gain=.3): m.add(m.layer(m.hit(120, 40, .5, .18), m.noise(.08, 200, 2000, .002, .05) * .6), when, gain)
def boing(when, gain=.12): x = t(.5); m.add(np.sin(2 * np.pi * np.cumsum(220 + 120 * np.sin(2 * np.pi * 9 * x) * np.exp(-x * 4)) / SR) * np.exp(-x * 5), when, gain)
def tap(when, gain=.06): m.add(m.layer(m.tone(2400, .02, .001, .01), m.noise(.015, 1500, 6000, .001, .008) * .5), when, gain)
def blip(when, gain=.06, f=1318.5): m.add(m.tone(f, .12, .002, .05, (1, 2)), when, gain)
def ding(when, gain=.1): m.ding(when, gain)
def stamp(when, gain=.28): m.add(m.layer(m.hit(160, 60, .25, .06), m.noise(.05, 300, 3000, .001, .03) * .8), when, gain)
def chaching(when, gain=.1):
    m.add(m.layer(m.tone(2637, .5, .002, .2, (1, 2.4)), m.tone(3136, .5, .002, .25, (1, 2.4)) * .7), when + .06, gain); m.add(m.noise(.12, 3000, 9000, .002, .06), when, gain * .7)
def step(when, gain=.05, pan=0): m.add(m.layer(m.hit(110, 60, .08, .03), m.noise(.04, 300, 2500, .002, .02) * .6), when, gain, pan)
def slide(when, dur=.5, gain=.1):   # puerta corredera de madera (rodar + golpe al final)
    x = t(dur); s = m.band(rng.standard_normal(len(x)), 120, 1400) * (1 + .5 * np.sin(2 * np.pi * 22 * x)) * np.sin(np.linspace(0, np.pi, len(x))) ** .5; m.add(s, when, gain); m.add(m.hit(220, 90, .12, .04), when + dur, gain * 1.2)
def pops(a, b, n, gain=.05):
    for k in range(n): u = (k / n) ** .7; m.add(m.tone(900 + 900 * rng.random(), .05, .001, .02), a + (b - a) * u, gain * (.5 + .5 * k / n), rng.uniform(-.6, .6))
def flutter(a, b, gain=.04):
    tt_ = a
    while tt_ < b: m.add(m.noise(.06, 1500, 7000, .003, .03), tt_, gain, rng.uniform(-.5, .5)); tt_ += .05 + rng.random() * .05
def ghost_woo(when, gain=.06):
    x = t(1.6); f = 330 * (1 + .25 * np.sin(np.linspace(0, np.pi, len(x)))) * (1 + .01 * np.sin(2 * np.pi * 6 * x)); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.linspace(0, np.pi, len(x))) ** 2
    m.add(m.echo(s, (.13, .29), .4) if hasattr(m, 'echo') else s, when, gain)
def poof(when, gain=.2): m.add(m.noise(.6, 150, 3000, .005, .25), when, gain); m.add(m.hit(90, 35, .5, .2), when, gain)
def coin(when, gain=.08): m.add(m.layer(m.tone(2900, .35, .001, .12, (1, 2.7)), m.tone(4100, .3, .001, .08)), when, gain, rng.uniform(-.4, .4))
def wahwah(when, gain=.08):   # «trombón triste» sintético, 3 notas que bajan
    for k, f in enumerate((233.1, 220.0, 207.7)): x = t(.42 if k < 2 else .9); s = sum(np.sin(2 * np.pi * f * h * x) / h for h in range(1, 7)) * np.clip(x / .03, 0, 1) * np.clip(((.42 if k < 2 else .9) - x) / .1, 0, 1); m.add(m.band(s, 150, 2500), when + k * .38, gain)
def engine(a, b, gain=.05):
    x = t(b - a); s = (np.sin(2 * np.pi * 42 * x) + .5 * np.sin(2 * np.pi * 84 * x)) * (1 + .3 * np.sin(2 * np.pi * 9 * x)) + m.band(rng.standard_normal(len(x)), 60, 600) * .5
    m.add(s * np.clip(x / .3, 0, 1) * np.clip((b - a - x) / .3, 0, 1), a, gain, -.2)

# ambiente por escena
WIND = m.bed_noise(300, 2200, .6, .3); CRICK = m.bed_noise(3800, 6500, .9, 7.0); ROOM = m.bed_noise(60, 300, .2, .1); CITY = m.bed_noise(80, 1400, .4, .2)
for sc in m.sc0:
    a, b = sc0[sc], scEnd[sc]
    if sc in ('encantadas', 'alguna'): m.amb(WIND, a, b, .03); m.amb(CRICK, a, b, .012)
    elif sc in ('dentro', 'salir', 'historia', 'dueno'): m.amb(ROOM, a, b, .02)
    elif sc in ('web', 'ficha', 'estafa', 'pues'): m.amb(CITY, a, b, .008)
    elif sc in ('nueve', 'pagan'): m.amb(ROOM, a, b, .012)
    else: m.amb(WIND, a, b, .012); m.birds(a + .2, b, 3, .018) if hasattr(m, 'birds') else None

# 1 · el lazo cae del cielo sobre la casa
g0 = sc0['regalo']; tl = e('regalo.regalan', .02); m.add(m.sweep(1400, 300, max(.3, tl - g0), .2), g0, .05); whoosh(tl - .25, .12, .3); thump(tl, .32); boing(tl + .02, .12); m.add(m.noise(.4, 200, 2500, .005, .2), tl + .02, .06)
# 2 · grúa sobre el valle
whoosh(sc0['vacias'] + .1, .1, .7)
# 3-6 · el móvil
for k in range(3): tap(sc0['web'] + .5 + k * .45)
if e('web.akiya'): ding(e('web.akiya'), .07)
if e('ficha._3'):
    for k in range(3): blip(e('ficha._3') + k * .17, .06, 1046.5 * (1 + k * .12))
if e('ficha.montana'): blip(e('ficha.montana'), .05, 1568)
if e('ficha._0'): stamp(e('ficha._0', -.05), .25); chaching(e('ficha._0', .3), .07)
if e('estafa.estafa'): m.add(m.sweep(240, 150, .5, .3), e('estafa.esto', -.05) or sc0['estafa'], .06)
if e('pues.no'): ding(e('pues.no', -.05), .1); blip(e('pues.no', .05), .06, 1975.5)
# 7 · pasos por la carretera y la puerta que se desliza
v0 = sc0['verla']; tc_ = e('verla.la', -.12)
k_ = 0
while v0 + .1 + k_ * .43 < tc_: step(v0 + .1 + k_ * .43, .05, (-1) ** k_ * .2); k_ += 1
if e('verla.abierta'): slide(e('verla.abierta', -.3), .55, .12); m.add(m.sweep(180, 120, .6, .3), e('verla.abierta', .1), .03)
# 8-9 · dentro: crujidos, barridos y el sobresalto
d0 = sc0['dentro']; m.add(m.creak(.5) if hasattr(m, 'creak') else m.noise(.5, 100, 800), d0 + .2, .04)
for w_ in ('dentro.tazas', 'dentro.periodico'):
    if e(w_): whoosh(e(w_, -.15), .06, .25)
if e('dentro._2003'): m.sting(e('dentro._2003'), .12)
if e('salir.salir'): m.sting(e('salir.salir', -.05), .16); m.heartbeat(e('salir.salir'), scEnd['salir'], 100, .12)
# 10 · la vecina: hojas del calendario
if e('vecina._20'): flutter(e('vecina._20', -.1), e('vecina._20', .9), .03)
# 11 · el mapa se llena de casitas
if e('nueve.japon') and e('nueve.millones'): pops(e('nueve.japon'), e('nueve.millones', .15), 70, .045)
if e('nueve._9'): thump(e('nueve._9'), .2); m.add(m.tone(523.3, 1.2, .005, .5, (1, 2, 3)), e('nueve._9'), .05)
# 12 · billetes
if e('pagan.pagan'): chaching(e('pagan.pagan', -.1), .12); flutter(e('pagan.pagan'), scEnd['pagan'], .035)
# 13-14 · el fantasma y el sello
if e('encantadas.encantadas'): m.add(m.sweep(400, 300, .5, .3), e('encantadas.encantadas', -.1), .04)
if e('alguna.alguna'): ghost_woo(e('alguna.alguna', -.25), .07); m.sting(e('alguna.alguna', -.05), .12)
if e('alguna.mala'): whoosh(e('alguna.mala', -.15), .07, .25)
if e('alguna.avisar'): stamp(e('alguna.avisar'), .3)
# 15 · un gato que bosteza
if e('normales.normales'): m.add(m.sung(520, .5, (700, 1500)) if hasattr(m, 'sung') else m.tone(520, .5), e('normales.normales', -.1), .03)
# 16 · arrozales → Tokio
n0 = sc0['nada']; tk_ = e('nada.solo', -.12); m.amb(WIND, n0, tk_, .03)
if tk_: whoosh(tk_ - .1, .1, .3); m.amb(CITY, tk_, scEnd['nada'], .05); m.add(m.tone(415, .3, .01, .1, (1, 2, 3)), tk_ + .6, .03, .5)
# 17-18 · el altar: campanilla budista; los hijos por la ciudad
if 'historia' in sc0: rin(sc0['historia'] + .25, .1)
if e('dueno.y'): whoosh(e('dueno.y', -.15), .08, .25); m.amb(CITY, e('dueno.y'), scEnd['dueno'], .05)
# 19 · excavadora, billetes, ¡puf!, monedas
r0 = sc0['tirarla']; engine(r0, e('tirarla.y', -.1) or r0 + 2, .05)
if e('tirarla.millones'): chaching(e('tirarla.millones'), .1); flutter(e('tirarla.millones'), e('tirarla.millones', .5), .03)
if e('tirarla.casa'): poof(e('tirarla.casa'), .22)
if e('tirarla.impuesto'): coin(e('tirarla.impuesto'), .1)
if e('tirarla.multiplica') and e('tirarla._6'):
    for k in range(1, 6): coin(e('tirarla.multiplica') + (e('tirarla._6', .05) - e('tirarla.multiplica')) * (k - .5) / 5, .09)
    thump(e('tirarla._6', .05), .12)
# 20 · cierran la puerta y se van
if e('dejan.dejan'): slide(e('dejan.dejan', -.2), .5, .1)
dj = e('dejan.cerrada', -.3)
if dj:
    for k in range(4): step(dj + k * .43, .04)
# 21 · «¿y venderla?» → concesionario
if e('venderla.venderla'): m.add(m.sweep(500, 800, .25, .1), e('venderla.venderla', -.15), .05)
if e('venderla.coches'): m.add(m.layer(m.tone(523.3, .9, .01, .4, (1, 2)), m.tone(659.3, .9, .01, .4, (1, 2)), m.tone(784, .9, .01, .4, (1, 2))), e('venderla.coches', -.05), .06)
# 22-23 · la casa pierde valor; cámara rápida
if e('pierden.entra'): slide(e('pierden.entra', .05), .3, .06)
if e('pierden.pierden'): wahwah(e('pierden.pierden', -.05), .07)
t0_ = sc0['treinta']; m.riser(t0_, e('treinta.nada') or scEnd['treinta'], .12) if hasattr(m, 'riser') else None
tt_ = t0_
while tt_ < (e('treinta.nada') or scEnd['treinta']): m.add(m.layer(m.tone(3200, .015, .001, .008)), tt_, .03, -.3); tt_ += .09
if e('treinta.nada'): thump(e('treinta.nada'), .18); m.add(m.sweep(300, 90, .7, .4), e('treinta.nada'), .06)
# 24 · el lazo cae otra vez
f0 = sc0['final']; tl2 = e('final.regalan', .02)
if tl2: m.add(m.sweep(1400, 300, .9, .2), tl2 - .95, .05); whoosh(tl2 - .25, .12, .3); thump(tl2, .3); boing(tl2 + .02, .12); m.sting(tl2 + .05, .1)
m.finish(with_voice='--voice' in sys.argv)

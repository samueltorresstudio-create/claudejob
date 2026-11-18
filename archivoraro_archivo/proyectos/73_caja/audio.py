# Música + efectos de «El hombre que se mandó por correo» (73). Con --voice mezcla narration.wav.
# Música propia: swing de los 60 (contrabajo pizzicato, escobillas y vibráfono) que cambia con el sitio: drone tenso en la oscuridad,
# niebla suave en Londres, punteo «caluroso» en Bombay, pitidos de censura sobre los tacos australianos y fiesta al final.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR

m = Mix(HERE, seed=73)
E, CUT = m.E, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(73)
t = lambda n: np.arange(int(n * SR)) / SR
def e(k, d=0.0): return E[k] + d if k in E else None
N = lambda s: 440 * 2 ** (s / 12)
cache = {}
def pluck(f, d=.5):
    key = ('p', round(f, 1), d)
    if key not in cache: x = t(d); cache[key] = sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (5 + k * 3)) / k ** 1.4 for k in range(1, 6)) * np.clip(x / .003, 0, 1)
    return cache[key]
def vib(f, d=.6):
    key = ('v', round(f, 1), d)
    if key not in cache: x = t(d); trem = 1 + .25 * np.sin(2 * np.pi * 6 * x); cache[key] = (np.sin(2 * np.pi * f * x) + .25 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 9)) * np.exp(-x * 2.4) * trem * np.clip(x / .004, 0, 1)
    return cache[key]
def brush(d=.18): return m.noise(d, 2500, 9000, .01, d * .8)
def kick(): x = t(.3); return np.sin(2 * np.pi * np.cumsum(70 * (1 + 1.2 * np.exp(-x * 30))) / SR) * np.exp(-x * 9)
def bleep(when, dur=.32, gain=.07): x = t(dur); m.add(np.sin(2 * np.pi * 1000 * x) * np.clip(x / .01, 0, 1) * np.clip((dur - x) / .01, 0, 1), when, gain)
def whistle(a, notes, gain=.04):
    x0 = a
    for f, d in notes: x = t(d); v = 1 + .01 * np.sin(2 * np.pi * 6 * x); m.add(np.sin(2 * np.pi * f * np.cumsum(v) / SR) * np.clip(x / .03, 0, 1) * np.clip((d - x) / .05, 0, 1), x0, gain, .2); x0 += d
def scene_at(x):
    cur = None
    for b in m.beats:
        if b['start'] <= x: cur = b['sc']
    return cur
# ---------- música: swing (ii-V-I en Do) en los tramos «normales» ----------
BPM = 120; beat = 60 / BPM
BASS = [N(-26), N(-22), N(-19), N(-17), N(-24), N(-20), N(-17), N(-15), N(-28), N(-24), N(-21), N(-19), N(-21), N(-24), N(-26), N(-27)]
SWING = {'gancho', 'londres', 'taller', 'etiqueta', 'despega', 'tapa', 'perth', 'sale', 'cumple', 'factura'}
MEL = [(N(7), 1), (N(4), .5), (N(7), .5), (N(9), 1), (N(7), 1), (N(4), 1), (N(2), .5), (N(4), .5), (N(0), 2), (N(2), 1), (N(4), .5), (N(5), .5), (N(7), 1.5), (N(4), .5), (N(2), 2)]
tt, i = 0.0, 0
while tt < CUT - .05:
    sc = scene_at(tt + .01)
    if sc in SWING and not (sc == 'londres' and tt < sc0['londres'] + 1.0):
        g = .6 if sc == 'londres' else 1.0
        m.add(pluck(BASS[i % 16], .45), tt, .16 * g, -.1, bed=True)
        m.add(brush(), tt + beat * .66, .03 * g, .3, bed=True); m.add(brush(.1), tt, .02 * g, .3, bed=True)
        if i % 4 == 0 and sc not in ('londres',): m.add(kick(), tt, .07, bed=True)
    tt += beat; i += 1
for sc in ('gancho', 'taller', 'cumple', 'factura'):
    if sc not in sc0: continue
    x0, k = sc0[sc] + (1.6 if sc == 'gancho' else .2), 0
    while x0 < scEnd[sc] - .2: f, d = MEL[k % len(MEL)]; m.add(vib(f, min(d * beat * 1.3, 1.2)), x0, .045, .25, bed=True); x0 += d * beat; k += 1
# drones de tensión / calor
def drone(a, b, freqs, gain):
    x = t(b - a); s = sum(np.sin(2 * np.pi * f * x + k) for k, f in enumerate(freqs)) * (1 + .15 * np.sin(2 * np.pi * .4 * x)); m.add(s * np.clip(x / .3, 0, 1) * np.clip((b - a - x) / .3, 0, 1), a, gain, bed=True)
for sc, fr, g in (('oscuras', (N(-33), N(-32)), .05), ('aguanta', (N(-33), N(-27)), .06), ('encasa', (N(-21), N(-17), N(-14)), .04), ('niebla', (N(-31), N(-24)), .04), ('cuece', (N(-29), N(-28)), .05)):
    if sc in sc0: drone(sc0[sc], scEnd[sc], fr, g)
# Bombay: punteo con bordón (calor)
for sc in ('despega',):
    if e('despega.escala'):
        a = e('despega.escala', -.2); drone(a, scEnd['despega'], (N(-24), N(-17)), .04)
        for k, s_ in enumerate((0, 3, 5, 7, 5, 3, 0, -2)): m.add(pluck(N(s_), .5), a + k * .22, .05, .3, bed=True)
# ---------- efectos ----------
for b in m.beats:
    if b['cut'] and b['start'] > 0: m.whoosh(b['start'] - .16, .05, .32)
ENG = m.bed_noise(60, 700, .2, .3)
for sc in ('gancho', 'oscuras', 'cuece', 'aguanta', 'encasa'):
    if sc in sc0: m.amb(ENG, sc0[sc], scEnd[sc], .05 if sc == 'gancho' else .025)
# gancho: turbulencia, la cámara sale disparada, «Australia» con campanilla
g0 = sc0['gancho']; [m.add(m.knock(), g0 + .2 + k * .55, .03, rng.uniform(-.3, .3)) for k in range(3)]; m.whoosh(g0 + 1.5, .1, 1.6)
if e('gancho.australia'): m.ding(e('gancho.australia'), .06, 1568)
# oscuras: clic de linterna, parpadeo y latido
if e('oscuras.a'): a = e('oscuras.a', -.1); [m.add(m.noise(.02, 2000, 8000, .001, .01), a + k * .07, .05) for k in range(4)]; m.add(m.hit(1800, 900, .04, .02), a + .32, .06)
if 'oscuras' in sc0: m.heartbeat(sc0['oscuras'] + .3, scEnd['oscuras'], 70, .18)
# Londres: niebla, pasos, la polilla, la foto, la bombilla
if 'londres' in sc0:
    m.amb(m.bed_noise(200, 1600, .3, .2), sc0['londres'], scEnd['londres'], .02); m.steps(sc0['londres'], e('londres.sin', -.2) or sc0['londres'] + 2.5, .42, .05)
    if e('londres.sin'): m.add(m.noise(.25, 800, 4000, .01, .1), e('londres.sin', .1), .05); [m.add(m.noise(.03, 1500, 6000, .001, .015), e('londres.sin', .4) + k * .05, .03, .4) for k in range(14)]
    if e('londres.cumpleanos'): m.add(vib(N(-5), 1.2), e('londres.cumpleanos'), .05); m.add(vib(N(-9), 1.4), e('londres.cumpleanos', .4), .05)
    if e('londres.paquete'): m.ding(e('londres.paquete', -.1), .09, 2093); m.add(vib(N(12), .8), e('londres.paquete'), .04)
# taller: martillazos, latas, botellas, trombón triste en «mejor no preguntes»
if 'taller' in sc0:
    x0 = sc0['taller'] + .35
    while x0 < (sc0['taller'] + 4.3): m.add(m.layer(m.knock(), m.hit(400, 200, .05, .03)), x0, .08, .3); x0 += .7
    for w in ('latas', 'linterna', 'botellas'):
        if e('taller.' + w): [m.add(m.tone(1800 + k * 300, .25, .001, .1, (1, 2.9)), e('taller.' + w) + k * .12, .03, -.2) for k in range(3 if w != 'linterna' else 1)]
    if e('taller.otra'): x = t(1.1); f = 300 - 120 * x / 1.1; m.add(m.band(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), 200, 2000) * np.exp(-x * 1.5), e('taller.otra', .3), .04)
# etiqueta: brochazo y golpe del sello
if 'etiqueta' in sc0: m.add(m.noise(.6, 1000, 6000, .05, .3), sc0['etiqueta'] + .2, .04, -.3)
if e('etiqueta.portes'): a = e('etiqueta.portes', .23); m.add(m.hit(160, 60, .3, .1), a, .25); m.boom(a, .12, .6)
# niebla: reloj acelerado y sirena de niebla lejana
if 'niebla' in sc0:
    x0 = sc0['niebla']
    while x0 < scEnd['niebla']: m.add(m.tone(2600, .03, .001, .02), x0, .03, -.4); x0 += .09
    x = t(2.2); m.add(np.sin(2 * np.pi * 110 * x) * np.clip(x / .3, 0, 1) * np.clip((2.2 - x) / .5, 0, 1), sc0['niebla'] + .3, .05)
# despega: rugido de reactores; en Bombay, chicharras de calor
if 'despega' in sc0: m.add(m.noise(2.5, 80, 2500, .3, 1.2), sc0['despega'], .12); m.whoosh(sc0['despega'] + .4, .1, 1.4)
if e('despega.escala'): m.amb(m.bed_noise(4000, 7000, .9, 8), e('despega.escala'), scEnd['tapa'] if 'tapa' in scEnd else CUT, .012)
# cuece: chisporroteo de sartén
if 'cuece' in sc0:
    x0 = sc0['cuece']
    while x0 < scEnd['cuece']: m.add(m.noise(.02, 3000, 9000, .001, .01), x0, .035 * rng.random(), rng.uniform(-.6, .6)); x0 += .015 + rng.random() * .03
# tapa: crujido de la tapa; la caja anda (golpes de madera); el de pista se sobresalta
if 'tapa' in sc0: m.add(m.creak(.6), sc0['tapa'] + .3, .05)
if e('tapa.pero'):
    x0 = e('tapa.pero')
    while x0 < scEnd['tapa'] - .3: m.add(m.layer(m.knock(), m.hit(250, 120, .06, .03)), x0, .07, rng.uniform(-.3, .3)); x0 += .26
    m.add(m.sweep(600, 1400, .25), e('tapa.pero', .45), .04)
# aguanta: golpe y latido
if 'aguanta' in sc0: m.boom(sc0['aguanta'], .18, .9); m.heartbeat(sc0['aguanta'] + .1, scEnd['aguanta'], 110, .2)
# Perth: tacos australianos tapados con pitidos de censura
if 'perth' in sc0:
    x0 = sc0['perth'] + .25
    while x0 < scEnd['perth'] - .3: bleep(x0, .28 + rng.random() * .15, .045); x0 += .7 + rng.random() * .3
    m.add(m.hit(120, 60, .2, .08), sc0['perth'] + .1, .08)
# está en casa: suspiro y campanilla
if 'encasa' in sc0: m.ding(sc0['encasa'] + .15, .07, 1319); m.ding(sc0['encasa'] + .35, .06, 1760)
# sale: grillos, crujido de tapa, pasitos, silbido y ronquido del vigilante
if 'sale' in sc0:
    a, b = sc0['sale'], scEnd['sale']; m.amb(m.bed_noise(4500, 6500, .9, 12), a, b, .01); m.add(m.creak(.7), a + .1, .05)
    m.steps(a + .6, b, .28, .03); whistle(e('sale.y', .2) or a + 1.8, [(N(7), .25), (N(4), .25), (N(7), .25), (N(9), .5), (N(7), .5)])
    x0 = a + .3
    while x0 < b: x = t(.8); m.add(m.band(rng.standard_normal(len(x)), 100, 600) * np.sin(np.linspace(0, np.pi, len(x))) ** 2, x0, .03, -.4); x0 += 1.6
# cumpleaños: puerta, matasuegras, risas y confeti
if 'cumple' in sc0:
    a = sc0['cumple']; m.add(m.creak(.5), a, .04); x = t(.5); m.add(m.band(np.sign(np.sin(2 * np.pi * np.cumsum(450 + 150 * x) / SR)), 300, 3000) * np.clip((.5 - x) / .1, 0, 1), a + .35, .05)
    [m.add(m.noise(.04, 2000, 9000, .001, .02), a + .4 + k * .03, .02, rng.uniform(-.8, .8)) for k in range(20)]
# factura: llaman a la puerta, papel, «chan chan» y avión de papel
if 'factura' in sc0:
    a = sc0['factura']; [m.add(m.knock(), a + .05 + k * .18, .1) for k in range(2)]; m.add(m.noise(.3, 1500, 8000, .01, .12), a + 1.0, .05)
    if e('factura.factura'): m.sting(e('factura.factura', .05), .12)
    if e('factura.el'): m.add(m.noise(.4, 1500, 8000, .02, .15), e('factura.el', .5), .04); m.whoosh(e('factura.el', .95), .08, 1.2)
# bucle: la tapa se cierra de golpe → silencio
if 'bucle' in sc0: m.add(m.layer(m.knock(), m.hit(140, 60, .2, .08)), CUT - .25, .2)
m.finish(with_voice='--voice' in sys.argv)

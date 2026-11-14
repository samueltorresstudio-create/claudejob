# Música + efectos de «El preso que pidió cinco años más» (70). Con --voice mezcla narration.wav.
# Música propia «de golpe maestro»: contrabajo pizzicato que camina en re menor, escobillas, marimba de puntillas y clarinete pícaro;
# en la noche y el túnel baja a solo bajo + reloj; en la revelación vuelve el ritmo completo. Efectos atados a cada palabra.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR

m = Mix(HERE, seed=70)
E, CUT = m.E, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(70)
t = lambda n: np.arange(int(n * SR)) / SR
def e(k, d=0.0): return E[k] + d if k in E else None
NIGHT = ('ruido', 'tunel', 'debajo')
TENSE = ('lunes', 'lingote', 'pistas', 'director')
QUIET = ('nada',)
def scene_at(x):
    cur = None
    for b in m.beats:
        if b['start'] <= x: cur = b['sc']
    return cur

# ---------- instrumentos ----------
cache = {}
def pluck(f, d=.6, bright=6, dec=4.0):   # pizzicato: suma de armónicos con decaimiento rápido
    key = ('p', round(f, 1), d, bright, dec)
    if key not in cache:
        x = t(d); s = sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (dec + k * 2.2)) / k ** 1.1 for k in range(1, bright + 1)); cache[key] = s * np.clip(x / .002, 0, 1)
    return cache[key]
def marimba(f, d=.5):
    key = ('m', round(f, 1), d)
    if key not in cache:
        x = t(d); s = np.sin(2 * np.pi * f * x) * np.exp(-x * 7) + .35 * np.sin(2 * np.pi * f * 3.93 * x) * np.exp(-x * 22) + .15 * np.sin(2 * np.pi * f * 9.2 * x) * np.exp(-x * 40); cache[key] = s * np.clip(x / .001, 0, 1)
    return cache[key]
def clar(f, d=.4):   # clarinete: armónicos impares, vibrato, ataque suave
    x = t(d); vib = 1 + .005 * np.sin(2 * np.pi * 5.5 * x) * np.clip(x / .15, 0, 1); ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = np.sin(ph) + .33 * np.sin(3 * ph) + .18 * np.sin(5 * ph) + .08 * np.sin(7 * ph); return s * np.clip(x / .03, 0, 1) * np.clip((d - x) / .06, 0, 1)
def brush(d=.18): x = t(d); return m.band(rng.standard_normal(len(x)), 1800, 9000) * np.exp(-x * 26) * (.6 + .4 * np.clip(x / .01, 0, 1))
def hat(d=.05): x = t(d); return m.band(rng.standard_normal(len(x)), 6000, 12000) * np.exp(-x * 90)
def kick(d=.3): x = t(d); return np.sin(2 * np.pi * np.cumsum(55 * (1 + 1.5 * np.exp(-x * 40))) / SR) * np.exp(-x * 12)
def tick(d=.03): x = t(d); return np.sin(2 * np.pi * 3200 * x) * np.exp(-x * 160)

# ---------- música: 112 bpm, re menor ----------
BPM = 112; beat = 60 / BPM
N = lambda s: 440 * 2 ** (s / 12)
D2, F2, G2, A2, Bb2, C3, Cs3, D3 = N(-31), N(-28), N(-26), N(-24), N(-23), N(-21), N(-20), N(-19)
# bajo que camina (Dm | Gm | A7 | Dm) — una nota por pulso
WALK = [D2, F2, A2, C3, G2, Bb2, D3, Bb2, A2, Cs3, N(-17), Cs3, D2, A2, F2, A2]
# motivo de puntillas (marimba): re fa sol lab la… (cromático pícaro)
TIP = [(0, N(-7)), (.5, N(-4)), (1, N(-2)), (1.5, N(-1)), (2, N(0)), (3, N(-7))]
tt, i = 0.0, 0
while tt < CUT - .05:
    sc = scene_at(tt + .01); bar, b = divmod(i, 4)
    if sc in QUIET: tt += beat; i += 1; continue
    bn = WALK[i % 16]
    if sc in NIGHT:
        if b in (0, 2): m.add(pluck(bn, .9, 4, 3.0), tt, .2, -.1, bed=True)
        m.add(tick(), tt, .035, .4, bed=True)
        if b == 3 and bar % 2: m.add(marimba(N(-7 + (bar % 3)), .6), tt + beat * .5, .05, .3, bed=True)
    else:
        m.add(pluck(bn, .55, 5, 4.5), tt, .24, -.1, bed=True)
        if b in (1, 3): m.add(brush(), tt, .05, .25, bed=True)
        m.add(hat(), tt + beat * .5, .025, .35, bed=True)
        if b == 0: m.add(kick(), tt, .12, bed=True)
        if sc in TENSE:
            if b in (0, 2): m.add(pluck(bn * 4, .25, 3, 9), tt + beat * .5, .05, .3, bed=True)
        elif bar % 2 == 0 and b == 0:
            for off, f in TIP: m.add(marimba(f, .4), tt + off * beat, .06, .25, bed=True)
    tt += beat; i += 1
# frases de clarinete pícaro (planos alegres y la revelación)
def phrase(a, notes, gain=.035):
    for off, f, d in notes: m.add(clar(f, d), a + off * beat, gain, -.2)
SLY = [(0, N(-7), .3), (.5, N(-4), .3), (1, N(-2), .3), (1.5, N(-1), .25), (2, N(0), .8), (3.5, N(-4), .3), (4, N(-7), .9)]
HAPPY = [(0, N(-2), .3), (.5, N(0), .3), (1, N(2), .3), (1.5, N(5), .6), (2.5, N(2), .3), (3, N(0), .8)]
for sc, ph in (('feliz', HAPPY), ('ventana', SLY), ('tunel', SLY), ('noche', SLY), ('final', SLY)):
    if sc in sc0: phrase(sc0[sc] + .25, ph)

# ---------- efectos ----------
def whoosh(when, gain=.1, dur=.35): m.whoosh(when, gain, dur)
def paper(when, gain=.06, dur=.35): m.add(m.noise(dur, 1500, 8000, .01, dur * .6) * (1 + .6 * np.sin(np.linspace(0, 40, int(dur * SR)))), when, gain, .1)
def squeak(when, gain=.04, dur=.4): x = t(dur); m.add(np.sin(2 * np.pi * np.cumsum(2400 + 500 * np.sin(2 * np.pi * 7 * x)) / SR) * np.clip(x / .02, 0, 1) * np.clip((dur - x) / .05, 0, 1) * (.5 + .5 * np.sin(2 * np.pi * 13 * x)), when, gain)
def wood(when, gain=.3): m.add(m.layer(m.hit(260, 90, .25, .07), m.noise(.06, 600, 5000, .001, .03) * .9), when, gain)
def clang(when, gain=.18): m.add(m.metal(420, 1.1, .4), when, gain); m.add(m.hit(140, 60, .2, .06), when, gain * .8)
def clink(when, gain=.08, f=2600): m.add(m.layer(m.tone(f, .5, .001, .2, (1, 2.7)), m.tone(f * 1.5, .4, .001, .12)), when, gain, rng.uniform(-.3, .3))
def chime(when, gain=.06): [m.add(marimba(f, .7), when + k * .06, gain, .2) for k, f in enumerate((N(10), N(14), N(17), N(22)))]
def sob(a, b, gain=.05):   # sollozos: «uuh» que baja, repetido
    x0 = a
    while x0 < b - .2:
        d = .32; x = t(d); f = 420 * (1 - .25 * x / d) * (1 + .03 * np.sin(2 * np.pi * 9 * x)); s = np.sin(2 * np.pi * np.cumsum(f) / SR); s = m.band(s + .3 * np.sign(s), 300, 2500) * np.sin(np.linspace(0, np.pi, len(x)))
        m.add(s, x0, gain, -.1); x0 += .38 + rng.random() * .1
def giggle(a, b, gain=.04, f0=520):
    x0 = a
    while x0 < b: d = .08; x = t(d); m.add(np.sin(2 * np.pi * f0 * (1 + .2 * rng.random()) * x) * np.sin(np.linspace(0, np.pi, len(x))), x0, gain, .2); x0 += .11
def crowd_laugh(a, b, gain=.05):
    for k in range(9):
        f0 = 180 + rng.random() * 260; x0 = a + rng.random() * .3
        while x0 < b: d = .1 + rng.random() * .05; x = t(d); s = np.sin(2 * np.pi * f0 * x) + .4 * np.sign(np.sin(2 * np.pi * f0 * x)); m.add(m.band(s, 200, 3000) * np.sin(np.linspace(0, np.pi, len(x))), x0, gain * (.5 + rng.random() * .5), rng.uniform(-.7, .7)); x0 += .15 + rng.random() * .08
def murmur(a, b, gain=.012): m.amb(m.bed_noise(250, 1200, .8, 3.0), a, b, gain)
def snore(a, b, gain=.04):
    x0 = a
    while x0 < b - .5: d = .8; x = t(d); s = m.band(rng.standard_normal(len(x)), 80, 500) * np.sin(np.linspace(0, np.pi, len(x))) ** 2 * (1 + .6 * np.sin(2 * np.pi * 28 * x)); m.add(s, x0, gain); x0 += 1.5
def scrape(a, b, gain=.05):
    x0 = a
    while x0 < b: d = .16; x = t(d); s = m.band(rng.standard_normal(len(x)), 900, 5000) * (1 + .8 * np.sin(2 * np.pi * 60 * x)) * np.sin(np.linspace(0, np.pi, len(x))); m.add(s, x0, gain, -.3); x0 += .22 + rng.random() * .1
def knock(when, gain=.15): m.add(m.layer(m.hit(320, 160, .1, .03), m.noise(.03, 800, 4000, .001, .015)), when, gain)
def thud(when, gain=.2): m.add(m.layer(m.hit(110, 40, .4, .12), m.noise(.1, 100, 1500, .002, .06) * .6), when, gain, rng.uniform(-.3, .3))
def sip(when, gain=.05): x = t(.35); m.add(m.band(rng.standard_normal(len(x)), 1200, 6000) * np.sin(np.linspace(0, np.pi, len(x))) * (1 + .7 * np.sin(2 * np.pi * 30 * x)), when, gain)
def cricket(when, gain=.03):
    for k in range(3): m.add(m.tone(4200, .05, .002, .03), when + k * .09, gain, .4)
def siren(a, b, gain=.04):
    x0, k = a, 0
    while x0 < b: m.add(m.tone(880 if k % 2 == 0 else 660, .42, .02, .05, (1, 2, 3)), x0, gain, .3); x0 += .45; k += 1
def ratchet(when, n=6, gain=.06, every=.045):
    for k in range(n): m.add(m.layer(m.tone(3000, .012, .001, .008), m.noise(.012, 2000, 7000, .001, .006)), when + k * every, gain)
def coo(when, gain=.03): x = t(.5); f = 420 * (1 + .15 * np.sin(np.linspace(0, np.pi * 2, len(x)))); m.add(m.band(np.sin(2 * np.pi * np.cumsum(f) / SR), 200, 1500) * np.sin(np.linspace(0, np.pi, len(x))) ** 2, when, gain, .4)
def chalk(a, b, gain=.035):
    x0 = a
    while x0 < b: d = .09; x = t(d); m.add(m.band(rng.standard_normal(len(x)), 2500, 9000) * np.sin(np.linspace(0, np.pi, len(x))), x0, gain, -.2); x0 += .16

ROOM = m.bed_noise(60, 300, .2, .1); CITY = m.bed_noise(80, 1400, .4, .2); NIGHTB = m.bed_noise(3800, 6500, .9, 7.0); UNDER = m.bed_noise(40, 220, .3, .15); HALL = m.bed_noise(120, 900, .3, .1)
for sc in m.sc0:
    a, b = sc0[sc], scEnd[sc]
    if sc in ('oferta', 'suplica', 'risa', 'juez', 'cinco', 'bucle'): murmur(a, b, .01); m.amb(ROOM, a, b, .015)
    elif sc in ('banco', 'final'): m.amb(CITY, a, b, .03); m.birds(a + .2, b, 3, .015)
    elif sc in ('ruido',): m.amb(NIGHTB, a, b, .01); m.amb(HALL, a, b, .012)
    elif sc in ('tunel', 'debajo'): m.amb(UNDER, a, b, .03)
    else: m.amb(HALL, a, b, .012)

# 1 · la orden de libertad sube a la cámara; rotulador sobre «LIBERTAD»
if e('oferta.libertad'): paper(e('oferta.libertad', -.25), .07, .45); whoosh(e('oferta.libertad', -.2), .06, .3); squeak(e('oferta.libertad', .1), .035, .5); m.add(m.tone(1568, .15, .002, .08), e('oferta.libertad', -.05), .04)
# 2 · sollozos; barrido al juez
if 'suplica' in sc0: sob(sc0['suplica'] + .1, e('suplica.juez', -.05) or scEnd['suplica'] - .8, .05)
if e('suplica.juez'): whoosh(e('suplica.juez', -.12), .08, .25); m.add(m.tone(196, .5, .02, .3, (1, 2)), e('suplica.dejara') or e('suplica.juez', .4), .03)
# 3 · risa contenida… y carcajada general
if 'risa' in sc0: giggle(sc0['risa'] + .2, e('risa.partio', -.05) or sc0['risa'] + .9, .025)
if e('risa.partio'): m.add(m.noise(.2, 300, 3000, .005, .1), e('risa.partio'), .06); crowd_laugh(e('risa.partio'), scEnd['risa'] + .25, .045)
if e('risa.risa'): whoosh(e('risa.risa', -.15), .07, .25)
# 4 · encogerse de hombros
if e('juez.encogio'): m.add(m.sweep(300, 600, .25, .1), e('juez.encogio', -.05), .04); m.add(m.sweep(600, 380, .25, .1), e('juez.encogio', .25), .03)
# 5 · mazazo, contador, celebración
if e('cinco.vale'): wood(e('cinco.vale'), .38); m.add(m.hit(90, 40, .5, .2), e('cinco.vale'), .2)
if e('cinco.cinco'): m.add(m.layer(m.tone(1200, .04, .001, .02), m.noise(.03, 2000, 6000)), e('cinco.cinco'), .07); m.add(m.tone(1200, .04, .001, .02), e('cinco.cinco', .1), .05)
if e('cinco.anos'): chime(e('cinco.anos', -.05), .07); m.add(m.sung(560, .5, (800, 1600)), e('cinco.anos'), .04); m.sting(e('cinco.anos', .05), .05, (293.7, 370, 440, 587.3))
# 6 · la puerta de barrotes se cierra; suspiro feliz; la galería
f0 = sc0.get('feliz')
if f0 is not None: m.add(m.noise(.6, 200, 2000, .01, .2) * .6, f0 + .15, .06); clang(f0 + .1 + (e('feliz.era', -.06) - f0 - .1) * .8 if e('feliz.era') else f0 + .8, .2)
if e('feliz.feliz'): chime(e('feliz.feliz', -.1), .05)
if e('feliz.carcel'): whoosh(e('feliz.carcel', -.6), .06, .8)
# 7 · fregona, destornillador y chispas, la cafetera revive; telaraña con grillo
if e('modelo.fregaba'): [squeak(sc0['modelo'] + .05 + k * .27, .02, .15) for k in range(3)]
if e('modelo.arreglaba'): whoosh(e('modelo.arreglaba', -.15), .06, .25); ratchet(e('modelo.arreglaba', .1), 8, .05); m.add(m.noise(.5, 2000, 9000, .002, .1) * (rng.random(int(.5 * SR)) > .7), e('modelo.arreglaba', .3), .05)
if e('modelo.guardias'): m.ding(e('modelo.guardias'), .07); m.add(m.noise(.8, 3000, 9000, .02, .5), e('modelo.guardias', .05), .05)
if e('modelo.jamas'): whoosh(e('modelo.jamas', -.25), .06, .25); cricket(e('modelo.quejaba', .1) or e('modelo.jamas', .4), .04); cricket(e('modelo.quejaba', .55) or e('modelo.jamas', .9), .03)
# 8 · ventana: paloma, «BANCO», cara de plan
if 'ventana' in sc0: coo(sc0['ventana'] + .3, .03); m.amb(CITY, sc0['ventana'], scEnd['ventana'], .015)
if e('ventana.banco'): chime(e('ventana.banco', -.05), .05)
if e('ventana.lado'): m.add(pluck(D2, 1.2, 4, 2.5), e('ventana.lado', -.1), .2); m.add(m.tone(2637, .3, .002, .1), e('ventana.lado'), .04)
# 9 · noche: reloj, ronquidos, sobresalto, rascar bajo la cama
if 'ruido' in sc0: snore(sc0['ruido'] + .1, e('ruido.oian', -.1) or sc0['ruido'] + 1.5, .035)
if e('ruido.oian'): m.sting(e('ruido.oian', -.05), .07); m.add(m.sweep(500, 1200, .2, .1), e('ruido.oian', -.05), .04)
if e('ruido.rascar'): scrape(e('ruido.rascar', -.1), scEnd['ruido'], .05)
if e('ruido.cama'): m.add(m.tone(1975, .2, .002, .1), e('ruido.cama', .1), .04)
# 10 · registro: golpes, libros, colchón, toc-toc, váter
r0 = sc0.get('registro')
if r0 is not None:
    for k in range(5): thud(r0 + .2 + k * .28, .12); whoosh(r0 + .1 + k * .28, .03, .15)
if e('registro.colchon'): m.add(m.layer(m.hit(90, 40, .5, .2), m.noise(.3, 100, 1200, .01, .2)), e('registro.colchon', -.05), .2); whoosh(e('registro.colchon', -.2), .07, .25)
if e('registro.ladrillos'): [knock(e('registro.ladrillos', -.15) + k * .24, .14) for k in range(4)]
if e('registro.vater'): m.add(m.tone(1800, .03, .001, .02), e('registro.vater', -.3), .05); m.add(m.echo(m.tone(330, .4, .01, .3, (1, 2.3)), (.07, .15), .5), e('registro.vater', .05), .04)
# 11 · nada: sorbo y un grillo
if 'nada' in sc0: sip(sc0['nada'] + .1, .06); cricket(sc0['nada'] + .55, .035)
# 12 · la calle
if e('banco.banco'): chime(e('banco.banco'), .045)
if e('banco.problema'): m.add(pluck(A2, 1.0, 4, 3), e('banco.problema'), .18); m.add(pluck(Cs3, 1.0, 4, 3), e('banco.problema', .25), .15)
# 13 · calendario, rueda y puerta de la cámara, libro de cuentas
if e('lunes.lunes'): paper(e('lunes.lunes', -.05), .07, .3); m.add(m.tone(1046, .2, .002, .1), e('lunes.lunes', .3), .03)
if e('lunes.camara'): ratchet(e('lunes.camara', -.2), 10, .06, .07); m.add(m.creak(1.0) if hasattr(m, 'creak') else m.noise(1, 60, 500), e('lunes.acorazada', .1) or e('lunes.camara', .4), .06); m.add(m.hit(70, 35, .8, .3), e('lunes.acorazada', .6) or e('lunes.camara', .9), .12)
if e('lunes.faltaba'): m.add(m.noise(.25, 3000, 8000, .01, .15), e('lunes.faltaba'), .03); m.add(m.sweep(400, 200, .5, .3), e('lunes.poco', -.05) or e('lunes.faltaba', .4), .05)
# 14 · el hueco del lingote, el fajo que falta
if e('lingote.lingote'): chime(e('lingote.lingote', -.05), .04); m.add(m.tone(196, .4, .01, .3), e('lingote.lingote', .2), .05)
if e('lingote.fajo'): whoosh(e('lingote.fajo', -.3), .06, .25); m.add(m.tone(1568, .08, .002, .05), e('lingote.alla') or e('lingote.fajo', .4), .04)
# 15 · pistas: ✔, alarma dormida, lupa
if e('pistas.rotas'): m.ding(e('pistas.rotas'), .06)
if e('pistas.alarmas'): whoosh(e('pistas.alarmas', -.3), .06, .25); snore(e('pistas.alarmas'), e('pistas.alarmas', 1.0), .03)
if e('pistas.huella'): whoosh(e('pistas.una', -.3) or e('pistas.huella', -.5), .06, .25); clink(e('pistas.huella'), .05, 3200)
# 16 · esposas, murmullo y llanto
if 'director' in sc0: murmur(sc0['director'], scEnd['director'], .02)
if e('director.detuvo'): ratchet(e('director.detuvo'), 6, .09, .04); clink(e('director.detuvo', .25), .06, 1900)
if e('director.director'): sob(e('director.director', -.1), scEnd['director'] + .2, .045)
# 17-18 · el corte: bajada por la tierra, gotas, subida a la cámara
if 'tunel' in sc0: m.add(m.sweep(220, 70, 1.5, .5), sc0['tunel'] + .5, .06); whoosh(sc0['tunel'] + .6, .07, 1.2); [m.add(m.echo(m.tone(1800 + rng.random() * 600, .05, .001, .04), (.12, .25), .5), sc0['tunel'] + 1.0 + k * .7, .03) for k in range(3)]
if e('tunel.escapar'): m.add(m.sweep(500, 300, .4, .2), e('tunel.escapar'), .04)
if 'debajo' in sc0: [m.add(m.echo(m.tone(2000 + rng.random() * 500, .05, .001, .04), (.12, .25), .5), sc0['debajo'] + .3 + k * .8, .03) for k in range(4)]
if e('debajo.subia'): m.add(m.sweep(200, 900, .9, .2), e('debajo.subia', -.2), .05)
if e('debajo.camara'): chime(e('debajo.camara', -.05), .06); m.sting(e('debajo.camara'), .05, (293.7, 349.2, 440, 587.3))
# 19 · gatea, coge el lingote, guiño; recuento al amanecer
if 'noche' in sc0:
    x0 = sc0['noche'] + .1
    while x0 < (e('noche.cogia', -.5) or sc0['noche'] + 1.5): m.add(m.noise(.12, 300, 2500, .01, .08), x0, .03, -.2); x0 += .22
if e('noche.cogia'): m.add(m.layer(m.hit(200, 120, .15, .05), m.noise(.2, 400, 3000, .01, .1)), e('noche.cogia', -.4), .08); clink(e('noche.poquito', -.2) or e('noche.cogia', .3), .08, 2200); m.add(m.tone(2637, .25, .002, .1), e('noche.poquito', .1) or e('noche.cogia', .6), .05)
if e('noche.volvia'): whoosh(e('noche.volvia', -.15), .07, .25); snore(e('noche.volvia'), scEnd['noche'], .03)
if e('noche.recuento'): [m.add(m.noise(.05, 3000, 8000, .002, .03), e('noche.recuento', -.3) + k * .15, .04) for k in range(3)]
# 20 · él mismo cierra la puerta
if e('salir.salir'): m.add(m.noise(.45, 200, 2000, .01, .2) * .6, e('salir.salir', -.15), .06); clang(e('salir.salir', .3), .18)
# 21 · tiza y cámara vacía
if 'vaciar' in sc0: chalk(sc0['vaciar'] + .1, e('vaciar.para', -.15) or sc0['vaciar'] + 1.4, .04)
if e('vaciar.vaciarla'): m.add(m.echo(m.tone(440, .6, .01, .4, (1, 2)), (.15, .3), .5), e('vaciar.vaciarla'), .04); chime(e('vaciar.vaciarla', .2), .04)
# 22 · sirenas delante del banco; guiño final
if 'final' in sc0: siren(sc0['final'] + .05, e('final.nadie', .3) or scEnd['final'], .035); murmur(sc0['final'], e('final.nadie') or scEnd['final'], .02)
if e('final.nadie'): whoosh(e('final.nadie', -.2), .09, .3); coo(e('final.nadie', .4), .03)
if e('final.lado'): m.add(m.tone(2637, .3, .002, .12, (1, 2)), e('final.lado'), .05); chime(e('final.lado', .1), .04)
# 23 · bucle: vuelve la sala
if 'bucle' in sc0: whoosh(sc0['bucle'] - .1, .06, .3)
m.finish(with_voice='--voice' in sys.argv)

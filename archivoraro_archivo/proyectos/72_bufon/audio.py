# Música + efectos de «El chiste más peligroso de Francia» (72). Con --voice mezcla narration.wav.
# Música propia de corte medieval: laúd punteado, flauta de pico con vibrato y tamboril, en re dórico; en la guerra, bordón grave y tambores lentos;
# bajo el agua todo se apaga; en el SILENCIO la música desaparece y SOLO suenan los cascabeles; en el giro, tambores y golpe; al final vuelve la melodía.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR

m = Mix(HERE, seed=72)
E, CUT = m.E, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(72)
t = lambda n: np.arange(int(n * SR)) / SR
def e(k, d=0.0): return E[k] + d if k in E else None
N = lambda s: 440 * 2 ** (s / 12)
cache = {}
def lute(f, d=.6):
    key = ('l', round(f, 1), d)
    if key not in cache:
        x = t(d); s = sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (3.6 + k * 2.4)) / k ** 1.2 for k in range(1, 8)); cache[key] = s * np.clip(x / .002, 0, 1)
    return cache[key]
def flute(f, d=.4):
    key = ('f', round(f, 1), d)
    if key not in cache:
        x = t(d); v = 1 + .006 * np.sin(2 * np.pi * 5.5 * x) * np.clip(x / .15, 0, 1); ph = 2 * np.pi * f * np.cumsum(v) / SR
        s = np.sin(ph) + .18 * np.sin(2 * ph) + .06 * np.sin(3 * ph) + m.band(rng.standard_normal(len(x)), f, f * 3) * .04
        cache[key] = s * np.clip(x / .03, 0, 1) * np.clip((d - x) / .06, 0, 1)
    return cache[key]
def tabor(d=.25): x = t(d); return m.layer(np.sin(2 * np.pi * np.cumsum(110 * (1 + .6 * np.exp(-x * 30))) / SR) * np.exp(-x * 14), m.band(rng.standard_normal(len(x)), 900, 5000) * np.exp(-x * 30) * .5)
def drum(d=.6): x = t(d); return np.sin(2 * np.pi * np.cumsum(62 * (1 + .8 * np.exp(-x * 25))) / SR) * np.exp(-x * 5)
def bell(f): return m.layer(m.tone(f, .35, .001, .12, (1, 2.76, 5.4)), m.noise(.03, 5000, 11000, .001, .01) * .3)
def jingle(when, gain=.05, n=5, span=.18, pan=0):
    for k in range(n): m.add(bell(3000 + rng.random() * 1800), when + rng.random() * span, gain * (.6 + .4 * rng.random()), pan + rng.uniform(-.3, .3))
def scene_at(x):
    cur = None
    for b in m.beats:
        if b['start'] <= x: cur = b['sc']
    return cur

# ---------- música ----------
D3, A2, D4, E4, F4, G4, A4, B4, C5, D5, E5 = N(-19), N(-24), N(-7), N(-5), N(-4), N(-2), N(0), N(2), N(3), N(5), N(7)
BPM = 104; beat = 60 / BPM
MEL = [(D5, 1), (A4, .5), (B4, .5), (C5, 1), (A4, 1), (G4, .5), (F4, .5), (E4, 1), (D4, 1), (F4, .5), (G4, .5), (A4, 1), (C5, 1), (B4, .5), (A4, .5), (G4, 1), (A4, 1),
       (D5, 1), (E5, .5), (D5, .5), (C5, 1), (A4, 1), (G4, .5), (A4, .5), (F4, 1), (E4, 1), (D4, 1.5), (E4, .5), (F4, 1), (E4, 1), (D4, 2)]
COURT = {'gorro', 'verdad', 'condicion', 'entra', 'rie', 'remate', 'bucle'}
WAR = {'guerra', 'flota', 'nadie', 'plaza', 'empujan'}
def court_end(sc):
    if sc == 'condicion': return e('condicion.si', -.1) or scEnd[sc]
    if sc == 'remate': return e('remate.hundian', -.15) or scEnd[sc]
    if sc == 'bucle': return CUT
    return scEnd[sc]
tt, i, mi, mt = 0.0, 0, 0, 0.0
while tt < CUT - .05:
    sc = scene_at(tt + .01)
    if sc in COURT and tt < court_end(sc):
        b = i % 4
        m.add(lute(D3 if b in (0, 2) else A2, .55), tt, .12, -.15, bed=True)
        if b in (1, 3): [m.add(lute(f, .4), tt + k * .03, .05, .1, bed=True) for k, f in enumerate((D4, F4, A4))]
        if b in (0, 2): m.add(tabor(), tt, .07, .2, bed=True)
        m.add(tabor(.12), tt + beat * .5, .025, .2, bed=True)
    elif sc in WAR:
        if i % 4 == 0: m.add(drum(1.2), tt, .14, bed=True)
        if i % 4 == 2 and sc in ('flota', 'empujan'): m.add(drum(.8), tt, .1, bed=True)
    tt += beat; i += 1
# melodía de flauta en los tramos de corte
for sc in ('gorro', 'verdad', 'condicion', 'entra', 'rie', 'bucle'):
    if sc not in sc0: continue
    a, b = sc0[sc] + (.6 if sc == 'gorro' else 0), court_end(sc); x0 = a; k = (0 if sc in ('gorro', 'bucle') else 8)
    while x0 < b - .1:
        f, d = MEL[k % len(MEL)]; dur = min(d * beat, b - x0); m.add(flute(f * (1 if sc != 'entra' else 2), dur * .95), x0, .05, .25, bed=True); x0 += d * beat; k += 1
# bordón grave de guerra (y apagado bajo el agua)
def drone(a, b, freqs, gain):
    x = t(b - a); s = sum(np.sin(2 * np.pi * f * x + k) for k, f in enumerate(freqs)) * (1 + .15 * np.sin(2 * np.pi * .3 * x)); m.add(s * np.clip(x / .4, 0, 1) * np.clip((b - a - x) / .4, 0, 1), a, gain, bed=True)
for sc in WAR:
    if sc in sc0: drone(sc0[sc], scEnd[sc], (N(-31), N(-24), N(-19)), .05)
if 'fondo' in sc0: drone(sc0['fondo'], scEnd['fondo'], (N(-31), N(-26)), .07)
if 'guardias' in sc0: drone(sc0['guardias'], scEnd['guardias'], (N(-31), N(-30)), .05)
if 'giro' in sc0: drone(sc0['giro'], scEnd['giro'], (N(-31), N(-24), N(-20)), .05)
# recorte de papel: pizzicato pícaro
if e('remate.hundian'):
    for k, f in enumerate((A4, F4, D4, A4, G4, E4, C5, A4, F4, D4)):
        if e('remate.hundian') + k * beat * .5 < scEnd['remate'] - .1: m.add(lute(f * 2, .3), e('remate.hundian', .1) + k * beat * .5, .06, .2, bed=True)
# alivio: acorde mayor de flauta
if 'salvas' in sc0: [m.add(flute(f, 1.2), sc0['salvas'] + .15 + k * .05, .04, .2, bed=True) for k, f in enumerate((D4, N(-3), A4))]

# ---------- efectos ----------
def laugh(a, b, gain=.05, n=3, lo=160, hi=340):
    for k in range(n):
        f0 = lo + rng.random() * (hi - lo); x0 = a + rng.random() * .2
        while x0 < b:
            d = .1 + rng.random() * .05; x = t(d); s = np.sin(2 * np.pi * f0 * x) + .4 * np.sign(np.sin(2 * np.pi * f0 * x)); m.add(m.band(s, 150, 3000) * np.sin(np.linspace(0, np.pi, len(x))), x0, gain * (.6 + .4 * rng.random()), rng.uniform(-.6, .6)); x0 += d + .05 + rng.random() * .05
def claps(a, b, gain=.03):
    x0 = a
    while x0 < b: m.add(m.noise(.03, 800, 6000, .001, .012), x0, gain * (.5 + .5 * rng.random()), rng.uniform(-.7, .7)); x0 += .03 + rng.random() * .05
def crow(when, gain=.05, pan=.3):
    for k in range(2): x = t(.22); f = 520 - 160 * x / .22; s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)); m.add(m.band(s, 400, 2600) * np.sin(np.linspace(0, np.pi, len(x))), when + k * .3, gain, pan)
def thunder(when, gain=.25): m.boom(when, gain, 2.4); m.add(m.noise(2.0, 60, 900, .01, .9), when + .05, gain * .5)
def crackle(a, b, gain=.03):
    x0 = a
    while x0 < b: m.add(m.noise(.012, 1500, 8000, .001, .006), x0, gain * rng.random(), rng.uniform(-.6, .6)); x0 += .02 + rng.random() * .06
def crash(when, gain=.25): m.boom(when, gain * .8, 1.6); [m.add(m.layer(m.hit(300 + rng.random() * 400, 120, .15, .05), m.noise(.08, 600, 5000, .001, .04)), when + k * .04 + rng.random() * .03, gain * .5, rng.uniform(-.6, .6)) for k in range(9)]
def splash(when, gain=.08): m.add(m.noise(.4, 300, 6000, .003, .2), when, gain, rng.uniform(-.4, .4)); m.add(m.hit(200, 80, .15, .05), when, gain * .6)
def bubbles(a, b, gain=.03):
    x0 = a
    while x0 < b: x = t(.06); m.add(np.sin(2 * np.pi * np.cumsum(500 + 1500 * x / .06 + rng.random() * 600) / SR) * np.sin(np.linspace(0, np.pi, len(x))), x0, gain * rng.random(), rng.uniform(-.5, .5)); x0 += .04 + rng.random() * .12
def door_bang(when, gain=.25): m.add(m.knock(), when, gain); m.boom(when, gain * .4, .8); m.add(m.creak(.5), when - .45, gain * .3) if hasattr(m, 'creak') else None
def shing(when, gain=.06): m.add(m.layer(m.tone(2400, .7, .001, .3, (1, 2.7)), m.noise(.3, 4000, 10000, .002, .2) * .5), when, gain, -.3)
def paper(when, gain=.06): m.add(m.noise(.25, 1500, 8000, .01, .12), when, gain, rng.uniform(-.3, .3))
def breath(when, gain=.06): x = t(.9); m.add(m.band(rng.standard_normal(len(x)), 300, 2500) * np.sin(np.linspace(0, np.pi, len(x))) ** 2, when, gain)

# transiciones: barridos suaves en cada corte
for b in m.beats:
    if b['cut'] and b['start'] > 0: m.whoosh(b['start'] - .16, .05, .32)
# ambientes
RAIN = m.bed_noise(1500, 9000, .3, .6); SEA = m.bed_noise(90, 900, .8, .12); HALL = m.bed_noise(120, 900, .3, .2)
for sc in ('gorro', 'verdad', 'condicion', 'rie', 'remate', 'entra', 'giro', 'salvas', 'bucle'):
    if sc in sc0: m.amb(HALL, sc0[sc], scEnd[sc], .01)
for sc in ('guerra', 'nadie'):
    if sc in sc0: m.amb(RAIN, sc0[sc], scEnd[sc], .012); crackle(sc0[sc], scEnd[sc], .012)
if 'plaza' in sc0: m.amb(RAIN, sc0['plaza'], scEnd['plaza'], .04)
if 'flota' in sc0: m.amb(SEA, sc0['flota'], scEnd['flota'], .05)
if 'fondo' in sc0: m.amb(m.bed_noise(60, 400, .6, .1), sc0['fondo'], scEnd['fondo'], .06); bubbles(sc0['fondo'], scEnd['fondo'], .03)

# 1 · gorro: baja el gorro, encaja con cascabeles; la corte aplaude en «bufón»
g0 = sc0['gorro']; m.whoosh(g0 + .1, .08, 1.0); jingle(g0 + 1.25, .08, 7, .25); m.add(m.hit(220, 120, .08, .03), g0 + 1.25, .06)
if e('gorro.bufon'): claps(e('gorro.bufon', -.1), scEnd['gorro'], .03); [m.add(flute(f * 2, .5), e('gorro.bufon', -.05) + k * .08, .04, -.2) for k, f in enumerate((D4, F4, A4))]
# 2 · verdad: cubiertos, susurro
if 'verdad' in sc0: [m.add(m.layer(m.tone(2800 + rng.random() * 900, .2, .001, .08), m.noise(.02, 2000, 7000)), sc0['verdad'] + .3 + k * .45, .02, rng.uniform(-.5, .5)) for k in range(5)]
if e('verdad.unico'): m.add(m.noise(.8, 2000, 7000, .1, .3) * .5, e('verdad.unico'), .02, .3)
# 3 · condición: malabares, risa del rey… se corta en seco; corazón y franjas negras
if 'condicion' in sc0:
    a = sc0['condicion']; b = e('condicion.si', -.1) or a + 2
    x0 = a + .2
    while x0 < b: m.add(m.noise(.04, 1500, 6000, .002, .02), x0, .02, .3); x0 += .4
    laugh(e('condicion.ria', -.2) or a + 1, b, .05, 2, 110, 200)
if e('condicion.reir'): m.add(m.sweep(400, 120, .3, .2), e('condicion.reir', -.1), .04)
if e('condicion.tu'): m.heartbeat(e('condicion.tu', -.1), scEnd['condicion'], 70, .18); m.boom(e('condicion.tu', -.05), .12, 1.2)
# 4 · guerra: tilín en 1340, trueno, puerta que se abre, gotas
if e('guerra._1340'): m.ding(e('guerra._1340', .05), .05, 1568)
if e('guerra.inglaterra'): m.add(drum(1.0), e('guerra.inglaterra', -.05), .12)
if e('guerra.y'): m.add(m.creak(.7) if hasattr(m, 'creak') else m.noise(.6, 100, 900), e('guerra.y', -.1), .08); thunder(e('guerra.y', .3), .15)
# 5 · flota: astillas, fuego
if e('flota.ingleses'): m.whoosh(e('flota.ingleses', -.2), .06, .8)
if e('flota.astillas'): crash(e('flota.astillas', -.03), .3); crackle(e('flota.astillas'), scEnd['flota'], .05)
# 6 · fondo: golpe sordo en «miles»
if e('fondo.miles'): m.boom(e('fondo.miles', -.05), .12, 2.0)
# 7 · nadie: la carta pasa de mano en mano
if 'nadie' in sc0: [paper(sc0['nadie'] + k * (scEnd['nadie'] - sc0['nadie']) / 3.2 + .1, .06) for k in range(3)]
# 8 · plaza: cuervos, cuerda que cruje, trueno en «colgado»
if 'plaza' in sc0: crow(sc0['plaza'] + .4, .04, .4); crow(sc0['plaza'] + 1.6, .03, -.3)
if e('plaza.colgado'): thunder(e('plaza.colgado', -.1), .3)
# 9 · empujan: portazo y traspiés
if 'empujan' in sc0: door_bang(sc0['empujan'] + .05, .22); m.steps(sc0['empujan'] + .3, scEnd['empujan'] - .2, .2, .06); jingle(sc0['empujan'] + .3, .05, 6, .6)
# 12 · entra: saltitos con cascabeles; grito con golpe en «cobardes»
if 'entra' in sc0:
    a, b = sc0['entra'], e('entra.majestad', -.15) or sc0['entra'] + 1.5; x0 = a + .05
    while x0 < b: jingle(x0, .04, 3, .06); m.add(m.step(), x0 + .02, .05); x0 += 1 / 2.4
if e('entra.cobardes'): m.add(m.hit(200, 70, .3, .1), e('entra.cobardes', -.04), .12); jingle(e('entra.cobardes'), .05, 6, .2)
# 13 · ríe: carcajada grave del rey; en «¿por qué?» se corta
if 'rie' in sc0: laugh(sc0['rie'] + .05, e('rie.por', -.2) or scEnd['rie'] - .8, .07, 2, 90, 150)
if e('rie.por'): m.ding(e('rie.por', -.05), .03, 1319)
# 14 · remate: papel que se rasga; ingleses quietos; franceses que saltan al agua
if e('remate.hundian'): paper(e('remate.hundian', -.15), .1); m.amb(SEA, e('remate.hundian'), scEnd['remate'], .03)
if e('remate.no'):
    v0 = e('remate.no', -.1)
    for k in range(5): splash(v0 + .1 + k * .28 + .7, .08)
# 15 · silencio: TODO se calla; solo los cascabeles
if e('silencio.solo'):
    a = e('silencio.solo', -.1); x0 = a
    while x0 < scEnd['silencio']: jingle(x0, .035, 2, .05); x0 += .3 + rng.random() * .15
if e('silencio.lo'): m.add(m.sweep(150, 60, .5, .3), e('silencio.lo', -.1), .05)
# 16 · guardias: latido y brillo de la alabarda
if 'guardias' in sc0: m.heartbeat(sc0['guardias'] + .1, scEnd['guardias'], 76, .14); shing(sc0['guardias'] + (scEnd['guardias'] - sc0['guardias']) * .55, .05)
# 17 · giro: los ojos se mueven (tambor); el rey se levanta (golpe) y grita
if e('giro.nobles'): m.add(drum(.8), e('giro.nobles', -.1), .14); m.whoosh(e('giro.sus', -.4) or e('giro.nobles', -.5), .06, .3)
if e('giro.ninguno'): m.boom(e('giro.ninguno', -.15), .25, 1.5); m.sting(e('giro.ninguno', -.1), .1, (146.8, 155.6, 207.7, 220))
if e('giro.valor'): [m.add(drum(.5), e('giro.valor') + k * .22, .1) for k in range(3)]
# 18 · salvas: resoplido de alivio
if 'salvas' in sc0: breath(sc0['salvas'] + .1, .07)
# 19 · bucle: portazo, empujón, cascabeles finales (como el gancho)
if e('bucle.adivina'): door_bang(e('bucle.adivina', -.1), .2); jingle(e('bucle.adivina', .2), .05, 6, .6)
if e('bucle.con'): jingle(e('bucle.con', .05), .08, 7, .25)
m.finish(with_voice='--voice' in sys.argv)

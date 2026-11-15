# Música + efectos de «El que siempre pierde al póker» (71). Con --voice mezcla narration.wav.
# Música propia «de tahúr»: contrabajo que camina en la menor, escobillas, piano de bar con acordes de swing y guitarra española punteada;
# el flashback de 1995 suena a disco viejo (filtrado, con crepitar); en la revelación entra un vibráfono pícaro. Efectos atados a cada palabra.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR

m = Mix(HERE, seed=71)
E, CUT = m.E, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(71)
t = lambda n: np.arange(int(n * SR)) / SR
def e(k, d=0.0): return E[k] + d if k in E else None
N = lambda s: 440 * 2 ** (s / 12)
def scene_at(x):
    cur = None
    for b in m.beats:
        if b['start'] <= x: cur = b['sc']
    return cur
cache = {}
def pluck(f, d=.6, bright=6, dec=4.0):
    key = ('p', round(f, 1), d, bright, dec)
    if key not in cache:
        x = t(d); s = sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (dec + k * 2.2)) / k ** 1.1 for k in range(1, bright + 1)); cache[key] = s * np.clip(x / .002, 0, 1)
    return cache[key]
def piano(f, d=.5):
    key = ('pi', round(f, 1), d)
    if key not in cache:
        x = t(d); s = sum(np.sin(2 * np.pi * f * k * x * (1 + .0004 * k * k)) * np.exp(-x * (3 + k * 1.6)) / k ** 1.3 for k in range(1, 8)); cache[key] = s * np.clip(x / .003, 0, 1)
    return cache[key]
def guitar(f, d=.7):   # cuerda de nailon: armónicos impares suaves y ataque blando
    key = ('g', round(f, 1), d)
    if key not in cache:
        x = t(d); s = sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (2.6 + k * 1.9)) / k ** 1.5 for k in range(1, 9)); cache[key] = s * np.clip(x / .004, 0, 1)
    return cache[key]
def vib(f, d=.8):
    key = ('v', round(f, 1), d)
    if key not in cache:
        x = t(d); s = (np.sin(2 * np.pi * f * x) + .25 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 10)) * np.exp(-x * 2.2) * (1 + .25 * np.sin(2 * np.pi * 6 * x)); cache[key] = s * np.clip(x / .002, 0, 1)
    return cache[key]
def brush(d=.18): x = t(d); return m.band(rng.standard_normal(len(x)), 1800, 9000) * np.exp(-x * 26)
def hat(d=.05): x = t(d); return m.band(rng.standard_normal(len(x)), 6000, 12000) * np.exp(-x * 90)
def kick(d=.3): x = t(d); return np.sin(2 * np.pi * np.cumsum(55 * (1 + 1.5 * np.exp(-x * 40))) / SR) * np.exp(-x * 12)

# ---------- música: 108 bpm, swing, la menor ----------
BPM = 108; beat = 60 / BPM; sw = beat * .62
A1, C2, D2, E2, F2, G2, Gs2, A2, B2, C3 = N(-36), N(-33), N(-31), N(-29), N(-28), N(-26), N(-25), N(-24), N(-22), N(-21)
WALK = [A1, C2, E2, Gs2, A2, G2, F2, E2, D2, F2, A2, C3, B2, Gs2, E2, D2]          # Am | Am | Dm | E7
CHORDS = [[N(-3), N(0), N(4)], [N(-3), N(0), N(4)], [N(-7), N(-3), N(0)], [N(-8), N(-4), N(-1)]]
SEPIA = ('suyo',)
tt, i = 0.0, 0
while tt < CUT - .05:
    sc = scene_at(tt + .01); bar, b = divmod(i, 4)
    bn = WALK[i % 16]; ch = CHORDS[(i // 4) % 4]
    if sc in SEPIA:
        if b in (0, 2): m.add(m.band(piano(bn * 4, .6), 400, 2500), tt, .1, bed=True)
    else:
        m.add(pluck(bn, .5, 5, 4.6), tt, .22, -.1, bed=True)
        if b in (1, 3): m.add(brush(), tt, .05, .25, bed=True); [m.add(piano(f, .32), tt, .035, .15, bed=True) for f in ch]
        m.add(hat(), tt + sw, .022, .35, bed=True)
        if b == 0: m.add(kick(), tt, .1, bed=True)
        if bar % 2 == 1 and b == 2: [m.add(guitar(f * 2, .6), tt + k * .09, .04, -.3, bed=True) for k, f in enumerate(ch)]
    tt += beat; i += 1
# disco viejo en el flashback: crepitar
if 'suyo' in sc0 and e('suyo.desde'):
    a = e('suyo.desde', -.3); x = t(scEnd['suyo'] - a); cr = (rng.random(len(x)) > .9985) * rng.standard_normal(len(x)) * .8 + m.band(rng.standard_normal(len(x)), 2000, 6000) * .05; m.add(cr, a, .05)
# vibráfono pícaro en la revelación y en el final
for sc in ('suyo', 'rico', 'bucle'):
    if sc in sc0:
        for k, f in enumerate((N(3), N(7), N(10), N(14), N(10))): m.add(vib(f, .7), sc0[sc] + .2 + k * beat * .5, .03, .2)

# ---------- efectos ----------
def whoosh(when, gain=.1, dur=.35): m.whoosh(when, gain, dur)
def chip(when, gain=.05, pan=0): f = 2600 + rng.random() * 1400; m.add(m.layer(m.tone(f, .05, .001, .025, (1, 2.3)), m.noise(.03, 2000, 8000, .001, .015) * .6), when, gain, pan)
def chips(a, n, span, gain=.05):
    for k in range(n): chip(a + rng.random() * span, gain * (.6 + .4 * rng.random()), rng.uniform(-.5, .5))
def card_flick(when, gain=.05): m.add(m.noise(.07, 1500, 7000, .002, .04), when, gain, rng.uniform(-.3, .3))
def card_slap(when, gain=.08): m.add(m.layer(m.hit(400, 200, .05, .02), m.noise(.04, 800, 5000, .001, .02)), when, gain)
def kaching(when, gain=.12): m.add(m.layer(m.tone(2637, .5, .002, .2, (1, 2.4)), m.tone(3136, .5, .002, .25, (1, 2.4)) * .7), when + .06, gain); m.add(m.noise(.12, 3000, 9000, .002, .06), when, gain * .7); m.add(m.hit(180, 90, .12, .04), when, gain)
def drawer(when, gain=.1): m.add(m.noise(.18, 300, 2500, .005, .1), when, gain); m.add(m.hit(150, 80, .12, .05), when + .16, gain)
def clink(when, gain=.07, f=2800): m.add(m.layer(m.tone(f, .6, .001, .25, (1, 2.7)), m.tone(f * 1.5, .5, .001, .15)), when, gain, rng.uniform(-.3, .3))
def sizzle(a, b, gain=.04): x = t(b - a); s = m.band(rng.standard_normal(len(x)), 3000, 10000) * (.6 + .4 * (rng.random(len(x)) > .97)); m.add(s * np.clip(x / .1, 0, 1) * np.clip((b - a - x) / .2, 0, 1), a, gain)
def fizz(a, b, gain=.025):
    x0 = a
    while x0 < b: m.add(m.tone(4000 + rng.random() * 3000, .02, .001, .01), x0, gain * rng.random(), rng.uniform(-.4, .4)); x0 += .015 + rng.random() * .03
def laugh(a, b, gain=.05, n=3):
    for k in range(n):
        f0 = 160 + rng.random() * 180; x0 = a + rng.random() * .2
        while x0 < b: d = .1 + rng.random() * .05; x = t(d); s = np.sin(2 * np.pi * f0 * x) + .4 * np.sign(np.sin(2 * np.pi * f0 * x)); m.add(m.band(s, 200, 3000) * np.sin(np.linspace(0, np.pi, len(x))), x0, gain * (.6 + .4 * rng.random()), rng.uniform(-.6, .6)); x0 += .15 + rng.random() * .07
def murmur(a, b, gain=.012): m.amb(m.bed_noise(250, 1200, .8, 3.0), a, b, gain)
def bills(a, b, gain=.04):
    x0 = a
    while x0 < b: m.add(m.noise(.06, 1500, 7000, .003, .03), x0, gain, rng.uniform(-.5, .5)); x0 += .05 + rng.random() * .05
def ting(when, gain=.06): m.add(m.tone(2637, .35, .002, .14, (1, 2)), when, gain); m.add(m.tone(3520, .3, .002, .1), when + .04, gain * .6)
def snip(when, gain=.08): m.add(m.layer(m.tone(3200, .03, .001, .02), m.noise(.04, 2000, 8000, .001, .02)), when, gain); m.add(m.tone(2800, .03, .001, .02), when + .07, gain * .8)
def chime(when, gain=.06): [m.add(vib(f, .7), when + k * .06, gain, .2) for k, f in enumerate((N(10), N(14), N(17), N(22)))]
def cork(when, gain=.1): x = t(.12); m.add(np.sin(2 * np.pi * np.cumsum(900 * np.exp(-x * 20) + 300) / SR) * np.exp(-x * 30), when, gain)
def moth(a, b, gain=.025): x = t(b - a); m.add(m.band(rng.standard_normal(len(x)), 150, 900) * (.5 + .5 * np.sin(2 * np.pi * 22 * x)) * np.clip(x / .1, 0, 1), a, gain, .3)
def tick(when, gain=.05): m.add(m.tone(3200, .02, .001, .012), when, gain, .3)
def bell(when, gain=.08): x = t(2.5); m.add(sum(np.sin(2 * np.pi * 523.3 * r * x) * np.exp(-x * dcy) * a for r, dcy, a in ((1, 1.2, 1), (2.76, 2.0, .4), (5.4, 3.0, .2))), when, gain)

BAR = m.bed_noise(120, 1400, .5, .3); TV = m.bed_noise(800, 3000, .6, 4.0)
for sc in m.sc0:
    a, b = sc0[sc], scEnd[sc]
    if sc == 'suyo': continue
    m.amb(BAR, a, b, .014); murmur(a, b, .008); m.amb(TV, a, b, .004)

# 1 · gancho: empuje de fichas, la torre se derrumba, guiño
g0 = sc0['gancho']; m.add(m.noise(.4, 300, 3000, .01, .2), g0 + .05, .05); chips(g0 + .45, 26, .7, .07); m.add(m.hit(200, 80, .2, .08), g0 + .5, .1)
if e('gancho.proposito'): whoosh(e('gancho.proposito', -.25), .08, .25); ting(e('gancho.proposito', .1), .07)
# 2 · cartas: se abren en abanico; brillo en «escalera»
if e('cartas.cinco'): [card_flick(e('cartas.cinco', -.1) + k * .07, .05) for k in range(5)]
if e('cartas.escalera'): chime(e('cartas.escalera', -.05), .06); m.sting(e('cartas.escalera'), .05, (220, 277.2, 329.6, 440))
# 3 · tira: las cartas vuelan a cámara lenta y patinan
if e('tira.tira'): whoosh(e('tira.tira', -.1), .07, .6); [card_slap(e('tira.tira', .55) + k * .08, .06) for k in range(5)]
# 4 · bote: arrastran las fichas
if e('bote.reparten'): chips(e('bote.reparten', -.1), 40, 1.0, .05); laugh(e('bote.reparten'), e('bote.viernes', .4) or scEnd['bote'], .03)
# 5 · cien mil: los billetes se apilan; golpe en la cifra
if 'cien' in sc0: bills(sc0['cien'] + .1, e('cien._100000') or scEnd['cien'] - .5, .03)
if e('cien._100000'): kaching(e('cien._100000'), .1)
# 6 · peor: carcajadas; brillo del trofeo
if 'peor' in sc0: laugh(sc0['peor'] + .1, e('peor.peor') or scEnd['peor'] - .5, .05, 3)
if e('peor.peor'): whoosh(e('peor.peor', -.25), .06, .25); chime(e('peor.peor', .1), .04)
# 7 · ases: las cartas se dan la vuelta una a una; sobresalto
if e('ases.mira'): whoosh(e('ases.mira', -.15), .06, .25)
a_ = e('ases.mira', .2); b_ = e('ases.poker', -.45)
if a_ and b_:
    for k in range(4): card_flick(a_ + .15 + k * (b_ - a_ - .1) / 4, .07)
if e('ases.ases'): m.sting(e('ases.ases', -.05), .07); ting(e('ases.ases'), .05)
# 8 · dudas: cuchicheos y silbido de Manolo
if 'dudas' in sc0: m.amb(m.bed_noise(1500, 5000, .9, 6.0), sc0['dudas'], scEnd['dudas'], .012); [m.add(m.tone(f, .2, .02, .08), sc0['dudas'] + .2 + k * .22, .02, .5) for k, f in enumerate((1318, 1568, 1760, 1568))]
# 9 · condición: pasos hasta la mesa; brillo en «mesa»
if 'condicion' in sc0: m.steps(sc0['condicion'] + .1, scEnd['condicion'] - .4, .42, .04) if hasattr(m, 'steps') else None
if e('condicion.mesa'): ting(e('condicion.mesa'), .05)
# 10 · sonríe: fichas que se van
if 'sonrie' in sc0: chips(sc0['sonrie'] + .15, 12, .9, .04)
# 11 · cena: platos en la mesa
if e('cena.cenar'): [m.add(m.layer(m.hit(500, 300, .06, .02), m.noise(.04, 1000, 5000)), e('cena.cenar', -.1) + k * .1, .05) for k in range(3)]
# 12 · chuletón (chisporroteo), gin-tonics (burbujas), botella (corcho), brindis
if e('chuleton.chuletones'): sizzle(sc0['chuleton'], e('chuleton.gintonics') or sc0['chuleton'] + 1, .05)
if e('chuleton.gintonics'): fizz(e('chuleton.gintonics', -.1), e('chuleton.botella') or e('chuleton.gintonics', 1), .03); clink(e('chuleton.gintonics', .1), .04, 3600)
if e('chuleton.botella'): cork(e('chuleton.botella', -.05), .1)
if e('chuleton.para'): [clink(e('chuleton.para', .2) + k * .05, .07, 2500 + k * 300) for k in range(3)]; laugh(e('chuleton.para'), scEnd['chuleton'], .03)
# 13 · guiño
if e('guino.cuenta'): m.add(m.noise(.25, 1500, 7000, .01, .15), e('guino.cuenta'), .04)
if e('guino.guina'): whoosh(e('guino.guina', -.2), .06, .25); ting(e('guino.guina', .05), .07)
# 14 · suyo: la foto se acerca; flashback: tijeras, cinta, aplausos
if e('suyo.suyo'): chime(e('suyo.suyo', -.05), .04)
if e('suyo.desde'): whoosh(e('suyo.desde', -.35), .08, .4); snip(e('suyo.desde', .25), .1); laugh(e('suyo.desde', .35), scEnd['suyo'], .02, 4)
# 15 · cuñado: risotada
if e('cunado.cunado'): laugh(e('cunado.cunado', -.1), e('cunado.asi') or e('cunado.cunado', .8), .06, 1)
# 16 · caja: billetes volando, cajón, ¡caja!, campanada de medianoche
if 'caja' in sc0: bills(sc0['caja'] + .1, e('caja.vuelve') or sc0['caja'] + 1.2, .04)
if e('caja.vuelve'): drawer(e('caja.vuelve', -.15), .1); bills(e('caja.vuelve'), e('caja.caja', .3) or e('caja.vuelve', .8), .04)
if e('caja.caja'): kaching(e('caja.caja'), .12)
if e('caja.medianoche'): [tick(e('caja.antes') + k * .25, .04) for k in range(3)] if e('caja.antes') else None; bell(e('caja.medianoche', .05), .09)
# 17 · hambre: masticar, la cuenta que se desenrolla, polilla
if 'hambre' in sc0: m.add(m.noise(1.2, 200, 3000, .05, .4) * .5, sc0['hambre'] + .3, .03)
if e('hambre.gastan'): m.add(m.sweep(600, 200, .6, .3), e('hambre.gastan'), .04); moth(e('hambre.gastan', .1), scEnd['hambre'], .025)
# 18 · treinta: tiza que rodea el cero
if 'treinta' in sc0: x = t(.6); m.add(m.band(rng.standard_normal(len(x)), 2500, 9000) * np.sin(np.linspace(0, np.pi, len(x))), sc0['treinta'] + .5, .04)
# 19 · rico: lluvia de billetes
if e('rico.rico'): kaching(e('rico.rico', -.1), .1); bills(e('rico.rico'), scEnd['rico'], .05)
# 20 · bucle: las cartas otra vez
if e('bucle.tira'): whoosh(e('bucle.tira', -.15), .07, .5); [card_slap(e('bucle.tira', .45) + k * .08, .06) for k in range(5)]; chips(e('bucle.tira', .6), 10, .5, .04)
m.finish(with_voice='--voice' in sys.argv)

# Sonido de «El Silbón · Parte 2». Con --voice pone narration.wav encima y baja la cama.
import os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from audio_core import Mix, SR
from silbido import whistle

m = Mix(HERE, seed=662)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd
rng = np.random.default_rng(66)

def bone(when, gain=.18, pan=0):      # hueso seco contra la baldosa
    m.add(m.layer(m.hit(1900, 1300, .03, .015), m.hit(420, 260, .09, .05) * .7, m.noise(.03, 2500, 9000, .001, .02) * .5), when, gain, pan)
def bark(when, gain=.16, pan=.15):
    m.add(m.layer(m.hit(620, 300, .14, .06), m.noise(.12, 500, 3200, .002, .05) * .7, m.tone(380, .1, .005, .06) * .5), when, gain, pan)
def croak(when, gain=.03, pan=0):
    m.add(m.tone(180 + rng.random() * 60, .12, .01, .06, harm=(1, .5, .3)), when, gain, pan)
def put_whistle(when, far=0.0, gain=.32, pan=0):
    m.add(whistle(far=far, amp=.6, seed=int(when * 10) % 97), when, gain, pan)
def scratch(a, b, gain=.08):          # uñas en la madera: ráfagas ásperas
    k = a
    while k < b:
        d = .12 + rng.random() * .1
        m.add(m.noise(d, 1800, 7000, .01, d * .6), k, gain * (.7 + .3 * rng.random()), .1)
        k += d + .05 + rng.random() * .08
def whine(when, dur=1.1, gain=.07):   # gemido de «perro» (demasiado agudo y largo)
    n = int(dur * SR); tt = np.arange(n) / SR
    f = 820 + 260 * np.sin(np.pi * tt / dur) + 30 * np.sin(2 * np.pi * 7 * tt)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.clip(tt / .1, 0, 1) * np.clip((dur - tt) / .3, 0, 1)
    m.add(m.band(x + .2 * rng.normal(0, 1, n), 400, 3000), when, gain, .1)
def crack(when, gain=.5):             # latigazo: chasquido + golpe en el suelo
    m.add(m.layer(m.noise(.02, 3000, 12000, .0005, .012), m.hit(2600, 1200, .02, .01), m.hit(120, 50, .25, .1) * .6), when, gain)
def creak(when, gain=.06):
    m.add(m.creak(.9), when, gain)

# ---------- música: drone grave que se va cerrando, latido, riser al final ----------
m.drone([(32.7, .7), (49, .35), (65.4, .15)], 0, gain=.07, until=sc0['nohear'])
m.drone([(36.7, .6), (55, .3), (73.4, .12)], sc0['nohear'], gain=.05, until=sc0['scratch'])
m.drone([(30.9, .7), (46.2, .35), (61.7, .15), (65.4, .12)], sc0['scratch'], gain=.07, until=sc0['silence'], rise=(sc0['rule5'], 5))
m.drone([(29.1, .7), (43.7, .35), (58.3, .15)], sc0['rule6'], gain=.08, until=sc0['dawn'])
m.drone([(41.2, .5), (61.7, .25), (82.4, .1)], sc0['dawn'], gain=.04, until=sc0['end'])
m.drone([(27.5, .7), (41.2, .35), (55, .15)], sc0['end'], gain=.09, until=CUT)
m.heartbeat(sc0['nohear'], sc0['scratch'], bpm=88, gain=.12)
m.heartbeat(sc0['rule4'], sc0['silence'], bpm=112, gain=.15)
m.heartbeat(sc0['rule6'], sc0['dawn'], bpm=124, gain=.16)
m.riser(scEnd['end'] - 4.5, CUT, gain=.32)
m.whooshes_and_pops()

# ---------- ambiente: grillos y ranas de los llanos (se callan cuando rasca) ----------
m.amb(m.bed_noise(3200, 8200, .7, 9), 0, sc0['scratch'] + .4, .009)
m.amb(m.bed_noise(3200, 8200, .7, 9), sc0['dawn'], CUT, .006)
for k in range(40):
    w = k * .9 + rng.random() * .6
    if w < sc0['scratch']: croak(w, .015 + .01 * rng.random(), rng.random() * 1.2 - .6)
m.amb(m.bed_noise(80, 400, .3, .2), sc0['scratch'], sc0['dawn'], .012)      # silencio pesado de la casa

# ---------- gancho: el silbido lejos, huesos contados ----------
put_whistle(.05, far=1.0, gain=.14, pan=-.3)
bone(E['hook.huesos'], .24); bone(E['hook.puerta'] - .1, .22); bone(E['hook.puerta'] + .4, .22); bone(E['hook.tranq'], .2)
m.sting(E['hook.silbon'], .18)
m.boom(E['hook2.duerme'] - .2, .3, 1.6)
m.sting(E['hook2.lado'], .2)

# ---------- los huesos 5, 6, 7 ----------
bone(E['nohear.todo'], .2); m.add(m.tone(98, 2.0, .3, 1.5), E['nohear.no'], .05)
bone(sc0['rule0'] + .1, .2); m.sting(E['rule0.vera'], .2)
m.add(m.layer(m.tone(1800, .03, .001, .02)), sc0['seven'] + .2, .05)       # tic del reloj
m.add(m.tone(1800, .03, .001, .02), sc0['seven'] + 1.2, .05)
bone(E['seven.siete'], .28); m.boom(E['seven.siete'], .25, 1.2)
m.add(m.noise(.5, 300, 1500, .05, .3), E['hand.aprieta'], .03)              # roce de las manos

# ---------- se para el conteo: arañazos y gemido ----------
m.sting(E['scratch.para'] + .1, .12)
scratch(E['scratch.rasca'] - .2, sc0['rule4'] + 1.5, .09)
whine(E['scratch.gime'], 1.3, .07)
scratch(sc0['rule4'] + 2.0, sc0['wakeup'] + 1.0, .05)
creak(E['wakeup.levanta'], .07)
m.steps(E['wakeup.levanta'] + .2, scEnd['wakeup'], .5, .03, lo=150, hi=1500)

# ---------- el látigo: lo descuelga, pasos ----------
m.add(m.layer(m.noise(.2, 800, 4000, .01, .15), m.hit(400, 200, .1, .05) * .5), E['whip.desc'] + .1, .08)
m.steps(E['whip.pone'] - .4, E['whip.pone'] + .4, .3, .05)

# ---------- Canelo ladra lejos (atrás) mientras siguen los arañazos ----------
for k in range(int((scEnd['rule5'] - E['bark.ladra']) / .45)):
    w = E['bark.ladra'] + k * .45 + rng.random() * .1
    far = w > sc0['still']
    bark(w, .16 if not far else .06, -.5 if far else .1)
scratch(sc0['still'], scEnd['rule5'], .1)
m.sting(E['rule5.silbon'], .26)

# ---------- tres latigazos ----------
for c in ('c1', 'c2', 'c3'): crack(E['crack.' + c], .5)
m.boom(E['crack.c3'] + .05, .25, 1.4)

# ---------- silencio… y la voz sigue contando ----------
m.add(m.tone(55, 2.2, .4, 1.6), sc0['silence'] + .2, .05)
bone(sc0['rule6'] + .2, .12); bone(sc0['rule6'] + scEnd['rule6'] / 2 - sc0['rule6'] / 2, .12)
for k in ('n10', 'n11', 'n12'): bone(E['count2.' + k], .2)
m.boom(E['count2.n12'], .4, 2.0); m.sting(E['count2.n12'] + .1, .26)

# ---------- la abuela sonríe; amanece; no se despierta ----------
m.add(m.tone(220, 1.8, .2, 1.2, harm=(1, .3)), E['smile.nada'] + .2, .03)
for i, f in enumerate((523, 659, 784)): m.add(m.tone(f, 1.2, .1, .9), sc0['dawn'] + .3 + i * .25, .02)  # gallo lejano no: campanita suave del amanecer
for k in range(4): m.bird(sc0['dawn'] + .5 + k * .7, .025, rng.random() - .5)
m.steps(E['dawn.canelo'], scEnd['dawn'], .22, .02, lo=1500, hi=5000)
m.sting(E['dead.desp'], .14)

# ---------- final: el silbido, lejísimos (o sea, pegado a él) ----------
put_whistle(E['end.silbar'] + .1, far=1.0, gain=.18, pan=-.4)
m.boom(E['end.muy'] + .3, .45, 2.0)

m.finish('--voice' in sys.argv)

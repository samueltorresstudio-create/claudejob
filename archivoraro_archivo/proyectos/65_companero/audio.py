# Sonido de «¿Y si tu compañero de piso fuera un asesino?». Con --voice pone narration.wav encima y baja la cama.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=65)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd

def news_jingle(when, gain=.07):   # sintonía de «última hora»: tres notas metálicas
    for k, f in enumerate((587.3, 784.0, 1174.7)):
        m.add(m.tone(f, .45, .004, .35, harm=(1, 2, 3)), when + k * .13, gain)
def click(when, gain=.12):
    m.add(m.layer(m.hit(2400, 1600, .03, .01), m.noise(.02, 2500, 9000, .001, .008)), when, gain)
def tv_show(a, b, gain=.016):     # el concurso de la tele, de fondo: público y musiquilla
    m.amb(m.bed_noise(300, 3000, .5, 1.3), a, b, gain)
    m.melody([(f, 1) for f in (659, 784, 880, 784, 659, 523, 587, 659)], a, b, .22, .02, pan=-.3)
def error_buzz(when, gain=.1):
    for k in range(2): m.add(m.tone(155, .14, .004, .05, harm=(1, 2, 3, 4)), when + k * .18, gain)

# ---------- música: drone de tensión que se va cerrando ----------
m.drone([(55.0, .6), (82.4, .3), (110.0, .12)], 0, gain=.04, until=sc0['sofa'])
m.drone([(49.0, .6), (73.4, .3), (98.0, .12)], sc0['news'] + .6, gain=.045, until=sc0['contract'])
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98.0, .1)], sc0['contract'], gain=.055, until=sc0['ask'])
m.drone([(43.6, .6), (65.4, .3), (87.3, .15), (92.5, .12)], sc0['up'], gain=.065, until=CUT)
m.riser(sc0['up'], CUT, gain=.3)
m.whooshes_and_pops()

# ---------- gancho: la tele grita ÚLTIMA HORA, luces de policía; golpe en «asesino» ----------
m.add(m.glitch(.35), 0, .06)
news_jingle(.02, .08)
m.amb(m.bed_noise(700, 5000, .4, 4), 0, E['hook.cut'], .02)
m.boom(E['hook.cut'], .35, 1.4)
m.sting(E['hook.asesino'], .26)

# ---------- sofá: el concurso, risas ----------
tv_show(sc0['sofa'], sc0['news'] + .2)
m.add(m.noise(1.0, 400, 3500, .1, .6), E['sofa.dani'] - .2, .05)   # risas del público

# ---------- noticia: se corta el programa ----------
m.add(m.glitch(.45), E['news.cortan'], .1)
news_jingle(E['news.cortan'] + .45, .07)
m.sting(E['news.asesinato'], .16)

# ---------- la foto: golpe y dos acercamientos ----------
m.boom(E['photo.foto'], .3, 1.2)
m.whoosh(E['photo.cicatriz'] - .2, .1, .35); m.add(m.hit(90, 50, .3, .12), E['photo.cicatriz'] + .1, .12)
m.whoosh(E['photo.jersey'] - .2, .1, .35)

# ---------- a 40 cm: latido ----------
m.boom(E['near.dani'], .3, 1.5)
m.heartbeat(E['near.dani'], sc0['victim'], bpm=92, gain=.2)
m.add(m.tone(1568, .12, .002, .1), E['near.cm'], .05)
m.add(m.noise(.25, 1500, 5000, .02, .2), sc0['near'] + .3, .03)   # palomitas

# ---------- la víctima: el nombre se escribe ----------
news_jingle(sc0['victim'] + .05, .05)
m.typing(E['victim.daniel'], 13, .045, .04)
m.sting(E['victim.daniel'] + .5, .2)

# ---------- el contrato: el bolígrafo rasca; golpe en el nombre ----------
m.amb(m.bed_noise(2000, 7000, .8, 9), sc0['contract'], E['contract.firmo'] + .4, .03)
m.boom(E['contract.contrato'], .32, 1.4)

# ---------- el mando: clic, ruido y dibujos ----------
m.add(m.noise(.3, 300, 1500, .02, .2), E['remote.coge'], .05)   # coge el mando
click(E['remote.cambia'], .16)
m.add(m.glitch(.3), E['remote.cambia'] + .02, .08)
tv_show(E['remote.cambia'] + .3, sc0['rule2'], .012)
m.melody([(f, 1) for f in (523, 659, 784, 1047, 784, 659)], E['remote.cambia'] + .3, sc0['phone'], .25, .015, pan=-.3, inst=m.musicbox)

# ---------- regla dos y el móvil ----------
m.heartbeat(sc0['rule2'], sc0['phone'], bpm=104, gain=.18)
m.typing(E['phone.escribes'] + .2, int((E['phone.policia'] - E['phone.escribes']) / .11), .05, .11)
m.whoosh(E['phone.policia'] + .25, .06, .3)   # enviar…

# ---------- no llegas a enviarlo: te arranca el móvil ----------
m.add(m.tone(1320, .05, .002, .04), E['grab.enviar'] - .3, .03)   # el pulgar sobre «enviar»
m.whoosh(E['grab.quita'] - .12, .2, .3)
m.add(m.hit(140, 60, .25, .08), E['grab.quita'] + .05, .25)
m.sting(E['grab.quita'] + .1, .26)
m.heartbeat(E['grab.manos'], sc0['rule3'], bpm=124, gain=.2)

# ---------- regla tres: latido rápido; te mira ----------
m.heartbeat(sc0['rule3'], sc0['ask'], bpm=118, gain=.22)
m.sting(E['look.pantalla'], .2)

# ---------- la pregunta: silencio casi total, solo la tele ----------
m.amb(m.bed_noise(800, 6000, .3, 3), sc0['ask'], CUT, .012)
m.boom(E['ask.tv'] + .2, .32, 1.6)
m.heartbeat(sc0['up'], CUT, bpm=70, gain=.28)

# ---------- final: golpe seco en «nada» y corte a negro ----------
m.boom(E['end.nada'], .45, 1.8)
m.sting(E['end.nada'], .3)

m.finish('--voice' in sys.argv)

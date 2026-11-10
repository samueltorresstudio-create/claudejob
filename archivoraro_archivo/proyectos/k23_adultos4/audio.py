# Music + SFX for «Desaparecen los adultos · Parte 4». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=233)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd

# ---------- music: tense pulse for the escape, the cold drone underground ----------
m.drone([(46.2, .6), (69.3, .3), (92.5, .15)], 0, gain=.06, until=sc0['step3'])
m.pulses(sc0['step1'], sc0['window'], end=sc0['window'])
m.melody([(659.3, 3), (587.3, 1), (523.3, 4)], sc0['window'], sc0['step2'], .3, .02, pan=.2, inst=m.musicbox)
m.drone([(55, .5), (82.4, .25), (110, .12)], sc0['step3'], gain=.04, until=sc0['down'])
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], sc0['down'], gain=.08, rise=(sc0['end'], 6))
m.riser(sc0['end'] - .2, CUT, gain=.32)
m.whooshes_and_pops()

m.amb(m.bed_noise(2500, 7000, .6, 3.5), 0, sc0['step3'], .006)  # crickets
m.amb(m.bed_noise(100, 700, .4, .2), 0, sc0['step3'], .018)  # night wind
m.boom(sc0['part'] + .05, .25, 1.4)
m.sting(E['part.four'], .14)
m.ding(E['dani.copy'], .05, 1046.5)
m.sting(E['dani.brother'], .12)
tt = sc0['step1']
while tt < E['escape.fall']:
    m.add(m.layer(m.metal(900, .15, .05) * .5, m.noise(.04, 1200, 5000, .002, .02)), tt, .1, pan=.2)  # padlock grinding
    tt += .3
m.add(m.layer(m.metal(420, 1.0, .4) * .6, m.hit(300, 120, .1, .04)), E['escape.fall'] + .3, .3)  # it drops
m.steps(E['escape.kids'], sc0['escape'] + 5.5, .2, .05)
m.heartbeat(E['escape.kids'], sc0['step2'], bpm=124, gain=.14)
m.sting(E['window.smile'], .18)
m.steps(sc0['step2'], sc0['shop'], .2, .05)
m.amb(np.sin(2 * np.pi * 120 * t) * .6 + np.sin(2 * np.pi * 240 * t) * .3, sc0['shop'], sc0['step3'], .006)  # fridge hum
m.add(m.noise(2.0, 2000, 6000, .05, .2), E['shop.note'] + .2, .015)  # pencil
m.birds(sc0['step3'], sc0['down'], 4)
m.steps(sc0['follow'], sc0['down'], .55, .035, pan=.3)
m.amb(m.bed_noise(60, 500, .4, .3), sc0['down'], CUT, .03)  # underground rumble
m.steps(sc0['down'], sc0['rows'], .45, .05, echo=True)
m.add(m.layer(m.hit(1800, 1200, .04, .01), m.noise(.02, 2000, 8000, .001, .006)), E['down.torch'], .3)  # torch click
m.add(m.tone(55, 3, .05, 2.4), E['rows.hundreds'], .14, bed=True)
m.sting(E['rows.mom'], .16)
m.heartbeat(sc0['end'], CUT, bpm=110, gain=.16)
m.boom(E['end.open'], .35, 1.5)

m.finish('--voice' in sys.argv)

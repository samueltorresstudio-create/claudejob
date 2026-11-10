# Music + SFX for «Apocalipsis zombi en un avión». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=251)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd

# ---------- music ----------
m.drone([(55, .5), (82.4, .25), (110, .12)], 0, gain=.04, until=sc0['phones'])
m.drone([(46.2, .6), (69.3, .3), (92.5, .15), (98, .1)], sc0['phones'], gain=.07, until=sc0['other'])
m.pulses(sc0['video'], sc0['window'], end=sc0['other'])
m.melody([(523.3, 1), (659.3, 1), (784, 2), (659.3, 1), (587.3, 2)], E['other.breathe'], sc0['bang'], .32, .02, pan=.2, inst=lambda f: m.tone(f, .7, .002, .35, (1, 2.76, 5.4)))
m.drone([(43.7, .6), (65.4, .3), (87.3, .15), (92.5, .1)], sc0['bang'], gain=.08, rise=(sc0['end'], 6))
m.riser(sc0['end'] + 1.5, CUT, gain=.3)
m.whooshes_and_pops()

# ---------- the cabin: engine hum all along ----------
m.amb(m.bed_noise(60, 500, .3, .4), 0, CUT, .05)
m.amb(m.bed_noise(300, 2500, .3, .3), sc0['id'], CUT, .012)
m.whoosh(sc0['id'], .1)
m.ding(sc0['seat'] + .3, .05, 880)
m.ding(sc0['seat'] + .7, .05, 660)  # seat-belt chime
buzz = np.sign(np.sin(2 * np.pi * 160 * t)) * (np.sin(2 * np.pi * 2.5 * t) > 0)
m.amb(m.band(buzz, 100, 600), E['phones.all'], sc0['video'] + .3, .03)
m.ringtone(E['phones.ring'], sc0['video'], gain=.04)
m.add(m.tone(1318.5, .15, .002, .08), E['video.msg'], .05)
m.amb(m.bed_noise(400, 3000, .5, 2), E['video.airport'], E['video.call'], .02)  # screams in the clip
m.sting(E['video.bite'], .18)
for k in range(3):
    m.add(m.tone(425, .9, .02, .1), E['video.call'] + .2 + k * 1.1, .04)  # ringing out
m.sting(E['video.none'], .12)
m.ding(sc0['pilot'] - .2, .06, 880)
m.ding(sc0['pilot'], .06, 660)  # PA chime
m.add(m.tone(55, 2.5, .05, 2.0), E['pilot.closed'], .16, bed=True)
m.amb(m.bed_noise(80, 600, .4, .3), sc0['window'], sc0['other'], .04)  # wind outside
m.add(m.sweep(600, 200, 2.0, 1.2), E['turn.turn'], .06)  # banking
m.ding(E['other.far'], .05, 1046.5)
m.add(m.layer(m.hit(160, 70, .25, .06), m.noise(.08, 300, 2000, .002, .05)), E['bang.bang'], .4)
m.heartbeat(E['bang.bang'] + .5, CUT, bpm=112, gain=.15)
for k in range(2):
    m.add(m.layer(m.hit(400, 200, .05, .02), m.noise(.03, 800, 4000, .001, .02)), E['toilet.call'] + k * .25, .2)
m.add(m.noise(.5, 300, 1500, .02, .3), E['bracelet.falls'], .06)
m.sting(E['bracelet.blood'], .16)
m.add(m.creak(1.0, 30, 22), E['open.open'] - .4, .06)
m.sting(E['marks.teeth'], .2)
m.add(m.tone(55, 3, .05, 2.4), E['end.someone'], .18, bed=True)
m.boom(E['end.inf'], .3, 1.5)

m.finish('--voice' in sys.argv)

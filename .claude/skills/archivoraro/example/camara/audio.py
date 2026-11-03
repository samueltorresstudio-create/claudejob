# Music + SFX for «La cámara» (YouTube, standalone). With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=331)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd

# ---------- music: a low drone that tightens, then a riser into the cut ----------
m.drone([(41.2, .6), (61.7, .3), (82.4, .12)], 0, gain=.045, until=sc0['breath'])
m.drone([(38.9, .6), (58.3, .3), (77.8, .15), (82.4, .1)], sc0['breath'], gain=.06, until=CUT)
m.riser(scEnd['end'] - 4, CUT, gain=.28)
m.whooshes_and_pops()

# ---------- cam: the camera's fan, the click, a clock ticking on the footage ----------
m.amb(m.bed_noise(60, 300, .3, .1), 0, sc0['sofa'], .015)
m.add(m.layer(m.hit(2200, 1400, .03, .01), m.noise(.02, 2500, 9000, .001, .006)), E['cam.cam'], .14)  # the red light comes on
for k in range(int((sc0['hall'] - E['cam.clock']) / 1.0)):
    m.add(m.tone(1200, .03, .001, .02), E['cam.clock'] + k, .03)  # the footage clock ticks

# ---------- hall: the figure is there, the bed creaks ----------
m.amb(m.bed_noise(120, 900, .3, .1), sc0['hall'], sc0['sofa'], .012)
m.sting(E['hall.sit'], .2)
m.add(m.creak(1.2), E['hall.sit'] + .3, .12)
m.heartbeat(E['hall.sit'], sc0['sofa'], bpm=96, gain=.14)

# ---------- sofa: the TV comes on with hiss ----------
m.amb(m.bed_noise(900, 9000, .2, 6), sc0['sofa'], sc0['rec'], .02)
m.add(m.noise(.4, 800, 6000, .02, .3), E['sofa.tv'], .08)
m.sting(E['sofa.recall'], .16)

# ---------- rec: the figure stands, turns, walks towards the lens ----------
m.add(m.creak(.8), E['rec.rise'], .14)
m.heartbeat(E['rec.rise'], sc0['breath'], bpm=118, gain=.18)
m.steps(E['rec.walk'], E['rec.close'], .42, .05)
m.sting(E['rec.close'], .24)

# ---------- breath: a breath behind the ear ----------
m.add(m.layer(m.noise(1.2, 200, 1200, .1, .5), m.noise(1.2, 300, 900, .05, .4)), E['breath.breath'], .14)
m.add(m.layer(m.noise(1.4, 200, 1200, .1, .5)), E['breath.breath'] + 1.8, .10)

# ---------- phone: the notification, the stranger standing up behind you ----------
m.ding(E['phone.ph'], .08)
m.sting(E['phone.alg'], .18)

# ---------- end: static, and the cut ----------
m.amb(m.bed_noise(800, 9000, .6, 2), sc0['end'], CUT, .02)
m.sting(E['end.cut'], .22)

m.finish('--voice' in sys.argv)

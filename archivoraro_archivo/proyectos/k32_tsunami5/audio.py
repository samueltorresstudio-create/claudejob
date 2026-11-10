# Music + SFX for «Tsunami · Parte 5». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=317)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def bark(when, gain=.16, pan=.2):
    m.add(m.layer(m.hit(520, 260, .16, .06), m.noise(.14, 400, 2600, .002, .05) * .6), when, gain, pan)


def whistle(when, gain=.08):  # two short notes, like the one on the roof
    for dt in (0, .5):
        m.add(m.layer(m.sweep(1800, 2400, .35, .25), m.sweep(2400, 1700, .35, .25) * .5), when + dt, gain)


# ---------- music: a low drone, pulses that quicken, a riser into the last cut ----------
m.drone([(41.2, .6), (61.7, .3), (82.4, .12)], 0, gain=.05, until=sc0['whistle'])
m.drone([(38.9, .6), (58.3, .3), (77.8, .15), (82.4, .1)], sc0['whistle'], gain=.07, until=sc0['arrow'])
m.pulses(sc0['hide'], sc0['whistle'], end=sc0['whistle'])
m.pulses(sc0['whistle'], sc0['arrow'], end=sc0['arrow'])
m.drone([(36.7, .7), (55, .3), (73.4, .15), (77.8, .1)], sc0['arrow'], gain=.09, rise=(sc0['arrow'], 7))
m.riser(scEnd['arrow'] - 4.5, CUT, gain=.3)
m.whooshes_and_pops()

# ---------- open: the emergency lamp hums and buzzes ----------
m.amb(m.bed_noise(60, 300, .3, .1), 0, sc0['hide'], .02)
m.add(m.tone(110, 2.0, .3, 1.2), .2, .02)
m.add(m.noise(.12, 3000, 6000, .002, .03), 1.6, .03)

# ---------- hide: two pairs of shoes stop by the shelf ----------
m.steps(sc0['hide'] + .3, E['hide.steps'], .5, .04, pan=-.3)
m.heartbeat(sc0['hide'], sc0['lucia'], bpm=112, gain=.16)
m.sting(E['hide.steps'], .14)

# ---------- lucia: a breath, a small voice from behind the freezers ----------
m.add(m.noise(1.0, 1200, 5000, .05, .5), E['lucia.voice'] - .3, .025)  # breath
m.add(m.layer(m.hit(260, 150, .08, .03)), E['lucia.face'], .05)  # freezer lid

# ---------- map: paper out of the pocket ----------
m.add(m.noise(.8, 2000, 8000, .02, .3), E['map.tap'], .06)
m.add(m.noise(.4, 1500, 6000, .02, .2), E['map.last'], .04)

# ---------- whistle, the dog barks at the shutter, the two men run ----------
whistle(E['whistle.whistle'], .08)
bark(E['whistle.bark'], .22, .5)
bark(E['whistle.bark'] + .42, .18, .5)
m.metal(180, .9, .4)
m.steps(E['run.go'], E['run.go'] + 1.6, .28, .045, pan=.4)  # running feet

# ---------- follow: the grip, the smile ----------
m.heartbeat(E['follow.grab'], sc0['enter'], bpm=120, gain=.16)
m.sting(E['follow.smile'], .12)

# ---------- enter: the door closes behind him, the mother is tied ----------
m.steps(E['enter.door'] - 1.5, E['enter.door'], .42, .035, pan=-.2)
m.add(m.layer(m.hit(120, 60, .2, .1), m.noise(.3, 300, 1500, .005, .1)), E['enter.door'], .18)  # door shuts
m.amb(m.bed_noise(200, 1000, .4, .2), sc0['enter'], sc0['confess'], .012)

# ---------- confess: a small voice at the door ----------
m.amb(m.bed_noise(120, 700, .3, .1), sc0['confess'], sc0['arrow'], .01)

# ---------- arrow: spray can and the last sting ----------
m.add(m.noise(1.2, 2000, 9000, .02, .5), E['arrow.fl'], .06)  # spray
m.sting(E['arrow.hour'], .2)
m.sting(E['arrow.msg'], .16)
m.heartbeat(E['arrow.msg'], CUT, bpm=140, gain=.18)

m.finish('--voice' in sys.argv)

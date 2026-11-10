# Music + SFX for «La canguro». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

HERE = os.path.dirname(os.path.abspath(__file__))
m = Mix(HERE, seed=23)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd


def creak(dur, f0=26, f1=14, gain=1.0):
    # stick-slip door hinge: an irregular train of tiny clicks through two wooden resonances
    n = int(dur * SR)
    x = np.arange(n) / SR
    f = np.linspace(f0, f1, n) * (1 + .35 * np.sin(2 * np.pi * .9 * x) + .15 * m.rnd.standard_normal(n).cumsum() / np.sqrt(n))
    ph = np.cumsum(np.clip(f, 4, None)) / SR
    imp = np.zeros(n)
    imp[np.nonzero(np.diff(np.floor(ph)))[0]] = 1
    k = np.arange(int(.03 * SR)) / SR
    res = np.exp(-k * 90) * (np.sin(2 * np.pi * 820 * k) + .6 * np.sin(2 * np.pi * 1530 * k) + .3 * np.sin(2 * np.pi * 2710 * k))
    y = np.convolve(imp, res)[:n]
    return m.norm(y) * np.sin(np.linspace(0, np.pi, n)) ** .3 * gain


def musicbox(f, d=.9):
    n = int(1.6 * SR)
    x = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * x) + .35 * np.sin(2 * np.pi * f * 2 * x) + .18 * np.sin(2 * np.pi * f * 3.01 * x)) * m.env(n, .002, d)


def knock(gain=1.0):
    return m.layer(m.hit(130, 48, .5, .12) * .9, m.noise(.12, 150, 1400, .001, .025) * .8)


def steps(t0, t1, every, gain, lo=150, hi=2500):
    tt = t0
    while tt < t1:
        m.add(m.noise(.09, lo, hi, .002, .025), tt, gain * (.8 + .4 * m.rnd.random()), pan=m.rnd.uniform(-.3, .3))
        tt += every


# ---------- beds ----------
# rain: loud outside, muffled through the walls inside, almost gone later on
rain = m.norm(m.band(m.rnd.standard_normal(N), 700, 7000)) * (0.85 + 0.15 * np.sin(2 * np.pi * .23 * t))
rain_in = m.norm(m.band(m.rnd.standard_normal(N), 120, 900))
lv_out = np.zeros(N)
lv_in = np.zeros(N)
for sc, a, b in [('house', 0.11, 0), ('drive', 0.13, 0)]:
    lv_out[m.span(sc0[sc], scEnd[sc])] = a
for sc in ['hall', 'note', 'monitor', 'speaker', 'basement', 'tv', 'turn', 'call', 'call2', 'nursery']:
    lv_in[m.span(sc0[sc], scEnd[sc])] = .07 if sc in ('hall', 'monitor', 'note') else .035
sm = np.ones(int(.25 * SR)) / int(.25 * SR)
lv_out = np.convolve(lv_out, sm, 'same')
lv_in = np.convolve(lv_in, sm, 'same')
m.bed[:, 0] += rain * lv_out + rain_in * lv_in
m.bed[:, 1] += np.roll(rain, 300) * lv_out + np.roll(rain_in, 200) * lv_in

# dark pad in A minor, a dissonant Bb creeps in after the TV; it drops out in the silence on the phone
m.drone([(55, .5), (110, .35), (130.8, .22), (164.8, .18)], 0, gain=.07, rise=(sc0['basement'], 20), until=E['call.silence'])
m.drone([(116.5, .3), (233.1, .15)], sc0['tv'], gain=.06, until=E['call.silence'])
m.drone([(41.2, .6), (82.4, .2)], E['call.silence'], gain=.08)

# music-box lullaby: sweet at the start, slow and out of tune at the baby's door
mel = [659.3, 784.0, 880.0, 784.0, 659.3, 587.3, 659.3, 523.3, 587.3, 659.3, 587.3, 523.3, 493.9, 440.0]
tt, i = 0.4, 0
while tt < sc0['note'] - .3:
    m.add(musicbox(mel[i % len(mel)]), tt, .05 if tt < sc0['hall'] else .035, pan=.25, bed=True)
    tt += .42 if i % 7 != 6 else .84
    i += 1
tt, i = sc0['nursery'], 0
while tt < CUT - .1:
    m.add(musicbox(mel[i] * (0.94 - .012 * i), 1.4), tt, .05, pan=-.2, bed=True)
    tt += .62 + .1 * i
    i += 1

m.pulses(sc0['basement'], E['tv.fig'])
m.riser(sc0['nursery'] + .3, CUT, gain=.3)
m.whooshes_and_pops()

# ---------- house ----------
steps(0.15, 2.6, .35, .05, 200, 2200)
m.add(m.noise(.35, 2500, 9000, .01, .1), E['house.back'], .12, pan=.5)
m.add(m.hit(90, 35, 1.4, .5), E['house.push'], .5)
buzz = np.sin(2 * np.pi * 100 * t) * (np.sin(2 * np.pi * 7 * t) > .3)
m.loop_bed(m.band(buzz, 80, 3000), m.span(E['house.push'], sc0['id']), .03)

# ---------- id ----------
m.add(m.noise(.25, 300, 4000, .05, .1), sc0['id'] + .02, .12)
m.add(m.layer(m.hit(160, 60, .3, .06), m.noise(.06, 800, 5000, .001, .02) * .6), E['id.fee'] + .05, .4)

# ---------- hall: parents rush out, door slams, the car drives away ----------
steps(sc0['hall'], E['hall.open'] + .6, .17, .07, 1500, 7000)   # heels
steps(sc0['hall'] + .08, E['hall.open'] + .7, .26, .06, 100, 1200)
m.add(m.noise(.08, 1000, 5000, .001, .02), E['hall.open'], .25, pan=.6)
op = m.span(E['hall.open'], E['hall.door'])
m.bed[op, 0] += rain[op] * .06
m.bed[op, 1] += rain[op] * .1
m.add(m.layer(m.hit(120, 38, .9, .18) * 1.2, m.noise(.2, 100, 1500, .001, .05)), E['hall.door'], .8, pan=.5)
eng_t = np.arange(int(3.2 * SR)) / SR
eng = (np.sin(2 * np.pi * np.cumsum(38 + 18 * eng_t / 3.2) / SR) + .5 * m.band(m.rnd.standard_normal(len(eng_t)), 40, 300) * 3)
eng *= np.clip(eng_t / .4, 0, 1) * np.exp(-eng_t / 1.2)
m.add(m.band(eng, 30, 400), E['hall.door'] + .6, .25, pan=.7)
m.add(m.tone(220, 2.5, .8, 1.2, (1, 2, 3)), E['hall.up'], .05, bed=True)

# ---------- note: fridge hum ----------
hum = np.sin(2 * np.pi * 50 * t) + .4 * np.sin(2 * np.pi * 100 * t) + .2 * np.sin(2 * np.pi * 150 * t)
m.loop_bed(hum, m.span(sc0['note'], scEnd['note']), .05)
m.add(m.noise(.3, 2000, 8000, .02, .08), sc0['note'] + .1, .08)

# ---------- monitor + speaker ----------
for k in range(9):
    m.add(m.tone(2400, .03, .001, .008), sc0['monitor'] + .6 + k * .7 + m.rnd.random() * .2, .03)
static = m.norm(m.band(m.rnd.standard_normal(N), 1200, 6000))
st_on = np.zeros(N)
st_on[m.span(E['monitor.voice'], E['speaker.mute'])] = 1
st_on[m.span(*E['speaker.talk'])] = 2.2
st_on = np.convolve(st_on, np.ones(800) / 800, 'same')
m.fx[:, 0] += static * st_on * .025
m.fx[:, 1] += static * st_on * .025
m.add(m.noise(.25, 1500, 7000, .001, .05), E['monitor.voice'], .2, pan=.3)
for a in E['speaker.talk']:
    m.add(m.tone(1800, .07, .002, .03), a - .05, .1)
m.add(m.layer(m.hit(70, 30, 1.6, .6), m.noise(.4, 60, 400, .001, .2) * .3), E['speaker.adult'], .55)
m.add(m.noise(.25, 300, 1600, .02, .08), E['speaker.mute'] + .05, .12)

# ---------- basement ----------
for k in E['basement.knocks']:
    m.add(knock(), k, .7, pan=.2)
tt = E['basement.voice'][0]
while tt < E['basement.voice'][1]:
    m.add(m.layer(m.noise(.05, 1800, 6500, .001, .012), m.tone(900 + m.rnd.random() * 300, .04, .001, .01) * .4), tt, .09 + .05 * np.sin(tt * 3), pan=.3)
    tt += .07 + .05 * m.rnd.random()
m.add(m.hit(60, 28, 2.0, .8), E['basement.voice'][0], .3)

# ---------- drive: thunder ----------
th = m.band(m.rnd.standard_normal(int(3.5 * SR)), 25, 260)
th *= m.env(len(th), .15, 1.1) * (1 + .6 * np.sin(np.arange(len(th)) / SR * 2 * np.pi * 3.1))
m.add(m.norm(th), E['drive.empty'] - .15, .5)

# ---------- tv ----------
m.add(m.layer(m.hit(80, 40, .3, .05), m.tone(7800, 1.0, .01, .5) * .15), E['tv.on'], .45)
snow = m.norm(m.band(m.rnd.standard_normal(N), 400, 9000))
m.loop_bed(snow, m.span(E['tv.on'], E['tv.cam']), .12)
m.loop_bed(snow * .5 + m.band(np.sin(2 * np.pi * 60 * t), 40, 400), m.span(E['tv.cam'], scEnd['tv']), .03)
clus = sum(m.tone(f, 2.5, .005, .9, (1, 2)) for f in (220, 233.1, 311.1, 329.6))
m.add(m.norm(clus), E['tv.fig'], .3)
m.add(m.hit(55, 25, 2.5, 1.0), E['tv.stare'], .6)
m.add(m.norm(m.band(m.rnd.standard_normal(int(2.2 * SR)), 2000, 8000)) * np.linspace(0, 1, int(2.2 * SR)) ** 2, E['tv.stare'], .07)

# ---------- turn ----------
m.add(m.noise(.4, 300, 3000, .15, .15), E['turn.look'] - .1, .12)
m.add(m.layer(m.sweep(400, 60, .25, .08), m.noise(.05, 500, 4000, .001, .02)), E['turn.off'], .35)

# ---------- call ----------
ring_t0, ring_t1 = E['call.ring'], E['call.pick']
tt = ring_t0
while tt < ring_t1 - .1:
    vib = np.sin(2 * np.pi * 150 * np.arange(int(.38 * SR)) / SR) * m.env(int(.38 * SR), .01, .3)
    m.add(m.band(vib, 100, 2000), tt, .18)
    for j, f in enumerate((988, 1319)):
        m.add(m.tone(f, .2, .003, .08, (1, 3)), tt + j * .13, .08)
    tt += .75
m.add(m.noise(.05, 1000, 5000, .001, .015), E['call.pick'], .2)
line = m.norm(m.band(m.rnd.standard_normal(N), 300, 3400))
m.loop_bed(line, m.span(E['call.pick'], scEnd['call2']), .012)
m.add(m.tone(55, 3.0, 1.0, 2.0), E['call.silence'], .25, bed=True)

# ---------- call2 ----------
m.add(m.layer(m.hit(140, 40, .7, .2), m.noise(.3, 200, 3000, .001, .1) * .4), E['call2.what'], .5)
m.add(m.hit(60, 26, 2.2, .9), E['call2.none'], .6)

# ---------- nursery ----------
m.add(creak(CUT - E['nursery.open']), E['nursery.open'], .3, pan=.15)
m.add(m.norm(clus) * .7, E['nursery.hand'], .22)

m.finish('--voice' in sys.argv)

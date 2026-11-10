# Music + SFX for «1999». With --voice it lays narration.wav on top and ducks the bed under it.
import os, sys
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR

HERE = os.path.dirname(os.path.abspath(__file__))
m = Mix(HERE, seed=31)
E, t, N, CUT = m.E, m.t, m.N, m.CUT
sc0, scEnd = m.sc0, m.scEnd
nums, zero = E['midnight.nums'], E['shoulder.zero']


def count_at(T):  # same countdown as the picture
    if T < nums[1]: return 10
    if T < nums[2]: return 9
    if T >= zero: return 0
    return max(1, 8 - int(8 * (T - nums[2]) / (zero - nums[2])))


def steps(t0, t1, every, gain, lo=150, hi=2500):
    tt = t0
    while tt < t1:
        m.add(m.noise(.08, lo, hi, .002, .022), tt, gain * (.8 + .4 * m.rnd.random()), pan=m.rnd.uniform(-.3, .3))
        tt += every


def square(f, dur, d=.12):
    n = int(dur * SR)
    x = np.arange(n) / SR
    return np.sign(np.sin(2 * np.pi * f * x)) * m.env(n, .002, d) * .5


def amb(lo, hi, a, b, gain, mod=.3):
    x = m.norm(m.band(m.rnd.standard_normal(N), lo, hi)) * (1 - mod + mod * np.sin(2 * np.pi * .17 * t + m.rnd.random() * 6))
    lv = np.zeros(N)
    lv[m.span(a, b)] = gain
    lv = np.convolve(lv, np.ones(int(.3 * SR)) / int(.3 * SR), 'same')
    m.bed[:, 0] += x * lv
    m.bed[:, 1] += np.roll(x, 500) * lv


# ---------- music ----------
# warm, slightly detuned 90s pad (F major 7 → D minor), darker from the photo on, gone at the touch
m.drone([(87.3, .4), (174.6, .3), (220, .22), (261.6, .18), (329.6, .12)], 0, gain=.05, until=sc0['photo'])
m.drone([(73.4, .45), (146.8, .3), (174.6, .2), (220, .16), (233.1, .1)], sc0['photo'], gain=.06, until=E['shoulder.touch'])
m.drone([(36.7, .7), (73.4, .2)], E['shoulder.touch'], gain=.12)
# the clock that runs through the whole story: soft tick-tock, louder on the night of the countdown
tt, k = .5, 0
while tt < CUT - .2:
    g = .02 if tt < sc0['midnight'] else .045
    m.add(m.noise(.03, 2500 if k % 2 else 1800, 7000, .001, .008), tt, g, pan=.3 if k % 2 else -.3, bed=True)
    tt += .5
    k += 1
m.pulses(sc0['bump'], sc0['midnight'], end=E['shoulder.touch'])
m.riser(sc0['answer'], zero, gain=.25)
m.whooshes_and_pops()

# ---------- wake ----------
amb(2000, 6000, 0, sc0['id'], .012)                      # tv snow in the room
for i, f in enumerate((1568, 2093)):
    m.add(m.tone(f, .5, .002, .2, (1, 2)), E['wake.phone'] + .2 + i * .1, .07)   # a 2026 notification in 1999
m.add(m.hit(80, 35, 1.2, .4), E['wake.push'], .4)

# ---------- id ----------
m.add(m.noise(.25, 300, 4000, .05, .1), sc0['id'] + .02, .12)
m.add(m.layer(m.hit(160, 60, .3, .06), m.noise(.06, 800, 5000, .001, .02) * .6), E['id.stamp'], .5)

# ---------- tv news ----------
for i, f in enumerate((349.2, 440, 523.3, 698.5)):
    m.add(m.tone(f, .8, .01, .35, (1, 2, 3, 4)), sc0['tvnews'] + .05 + i * .02, .06)
talk = m.band(m.rnd.standard_normal(N), 250, 2500) * (np.sin(2 * np.pi * 4.3 * t) > -.2) * (0.6 + 0.4 * np.sin(2 * np.pi * 7.1 * t))
m.loop_bed(m.norm(talk), m.span(sc0['tvnews'], scEnd['tvnews']), .025)
for i in range(12):
    m.add(m.noise(.02, 2000, 6000, .001, .006), E['tvnews.flip'] + .2 + i * .085, .12)
m.add(m.tone(1760, .6, .002, .3, (1, 2)), E['tvnews.flip'] + 1.25, .08)

# ---------- phone ----------
m.add(m.tone(660, .18, .002, .1), E['phone.nosig'], .1)
m.add(m.tone(440, .3, .002, .15), E['phone.nosig'] + .2, .1)
tt = E['phone.brick'] + .3
for f, d in [(1319, .1), (1175, .1), (740, .2), (831, .2), (1109, .1), (988, .1), (587, .2), (659, .2)]:  # an old monophonic ringtone
    m.add(square(f, d + .05), tt, .05)
    tt += d

# ---------- street + kiosk: city day ----------
amb(80, 1200, sc0['street'], sc0['family'], .03)
for h in (sc0['street'] + 1.2, sc0['kiosk'] + 3.5):
    m.add(m.layer(m.tone(392, .35, .01, .3, (1, 2, 3)), m.tone(494, .35, .01, .3, (1, 2, 3))), h, .03, pan=.6)
steps(sc0['street'], E['street.hide'], .32, .05)
m.add(m.tone(1975, .25, .002, .12), E['street.see'], .06)
m.add(m.noise(.3, 400, 4000, .05, .08), E['street.hide'], .1)
for i, f in enumerate([(697, 1209), (770, 1336), (852, 1477), (697, 1336)]):
    m.add(m.layer(m.tone(f[0], .09, .002, .2), m.tone(f[1], .09, .002, .2)), E['street.hide'] + .6 + i * .18, .05, pan=.5)
for i in range(3):
    m.add(m.tone(3200 + i * 400, .25, .001, .07, (1, 2.7)), E['kiosk.coins'] + i * .1, .07, pan=-.2)
m.add(m.noise(.2, 2500, 8000, .01, .05), E['kiosk.note'], .1)
m.add(m.layer(m.tone(220, .7, .01, .3, (1, 2)), m.tone(233, .7, .01, .3, (1, 2))), E['kiosk.look'], .14)
m.add(m.tone(523.3, .35, .005, .2, (1, 2)), E['kiosk.tag'], .07)

# ---------- family + bump: evening street ----------
amb(2500, 7000, sc0['family'], sc0['photo'], .006, mod=.8)     # swifts
amb(100, 900, sc0['family'], sc0['photo'], .02)
steps(E['family.walk'], E['family.walk'] + 1.8, .36, .05)
for i, f in enumerate((523.3, 659.3, 784, 987.8)):
    m.add(m.tone(f, 2.5, .3, 1.5, (1, 2)), E['family.mom'] + i * .12, .03, bed=True)
m.add(m.tone(55, 1.6, .02, .6), E['family.smile'], .2)
steps(sc0['bump'], E['bump.hit'], .3, .05)
m.add(m.layer(m.hit(120, 45, .5, .1), m.noise(.15, 200, 3000, .001, .05) * .6), E['bump.hit'], .55)
for i in range(10):
    m.add(m.noise(.12, 1500, 7000, .005, .04), E['bump.hit'] + .05 + i * .07, .06, pan=m.rnd.uniform(-.6, .6))
m.add(m.noise(.4, 600, 5000, .02, .12), E['bump.folder'], .08)
m.add(m.hit(65, 30, 1.6, .6), E['bump.folder'] + .9, .35)
steps(E['bump.leave'] + .2, scEnd['bump'], .34, .045)
m.add(m.tone(98, 1.8, .05, .8, (1, 2)), E['bump.leave'], .12)

# ---------- photo: glitches ----------
def glitch(dur):
    n = int(dur * SR)
    x = m.rnd.standard_normal(n)
    hold = int(SR / 900)
    x = np.repeat(x[::hold], hold)[:n]
    return m.band(x, 300, 8000) * (np.sin(np.arange(n) / SR * 2 * np.pi * 23) > 0)
for i in range(6):
    tt = E['photo.fade'] + .1 + i * .55 + m.rnd.random() * .2
    m.add(m.norm(glitch(.12 + .1 * m.rnd.random())), tt, .07 + .02 * i)
m.add(m.hit(50, 25, 2.0, .9), E['photo.glitch'], .45)

# ---------- midnight: crowd, countdown, fireworks ----------
crowd = m.norm(m.band(m.rnd.standard_normal(N), 200, 2500)) * (0.7 + 0.3 * np.sin(2 * np.pi * 1.3 * t) * np.sin(2 * np.pi * .41 * t))
lv = np.clip((t - sc0['midnight']) / .5, 0, 1) * (t < E['shoulder.touch'])
lv *= .03 + .02 * np.clip((t - nums[0]) / 8, 0, 1)
m.bed[:, 0] += crowd * lv
m.bed[:, 1] += np.roll(crowd, 900) * lv
prev = None
for i in range(int((zero + .1 - nums[0]) * 100)):
    T = nums[0] + i / 100
    c = count_at(T)
    if c != prev:
        m.add(m.layer(m.hit(90, 40, .6, .15), m.tone(880, .4, .002, .2, (1, 2)) * .3), T, .3 if c > 0 else .6)
        prev = c
# phone ringing (vibration + a modern marimba ringtone)
tt = E['ring.ring']
while tt < E['answer.pick'] - .2:
    vib = np.sin(2 * np.pi * 150 * np.arange(int(.4 * SR)) / SR) * m.env(int(.4 * SR), .01, .3)
    m.add(m.band(vib, 100, 2000), tt, .16)
    for j, f in enumerate((1047, 1319, 1568, 1319)):
        m.add(m.tone(f, .25, .002, .1, (1, 4)), tt + j * .12, .06)
    tt += 1.0
m.add(m.noise(.05, 1000, 5000, .001, .015), E['answer.pick'], .2)
line = m.norm(m.band(m.rnd.standard_normal(N), 300, 3400))
m.loop_bed(line, m.span(E['answer.pick'], E['shoulder.touch']), .012)
# fireworks at 00:00
for i, d in enumerate((0, .25, .5, .75, 1.0)):
    tt = zero + d
    m.add(m.layer(m.hit(70, 30, 1.0, .35), m.noise(.6, 300, 6000, .002, .25) * .5), tt, .35, pan=[-.5, .6, 0, -.7, .7][i])
    for j in range(14):
        m.add(m.noise(.03, 3000, 9000, .001, .01), tt + .25 + j * .04 + m.rnd.random() * .03, .03, pan=m.rnd.uniform(-.8, .8))
cheer = m.norm(m.band(m.rnd.standard_normal(N), 300, 4000))
lv = np.clip((t - zero) / .3, 0, 1) * (t < E['shoulder.touch'])
m.bed[:, 0] += cheer * lv * .09
m.bed[:, 1] += np.roll(cheer, 700) * lv * .09
# the touch: everything drops away to a ringing silence
m.add(m.layer(m.hit(55, 25, 2.5, 1.0), m.tone(2637, 2.5, .01, 1.5) * .15), E['shoulder.touch'], .6)
m.bed[t >= E['shoulder.touch']] *= .35

m.finish('--voice' in sys.argv)

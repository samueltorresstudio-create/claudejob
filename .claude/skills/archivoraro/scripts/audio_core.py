# Shared audio helpers for the videos: synth primitives, an event-synced mixer, voice ducking and the hard cut.
import json, os, wave
import numpy as np

SR = 44100


class Mix:
    def __init__(self, proj, seed=1):
        self.proj = proj
        ev = json.load(open(os.path.join(proj, 'events.json')))
        self.T, self.CUT, self.E, self.beats = ev['total'], ev['cut'], ev['ev'], ev['beats']
        self.N = int(self.T * SR) + SR
        self.t = np.arange(self.N) / SR
        self.rnd = np.random.default_rng(seed)
        self.bed = np.zeros((self.N, 2))
        self.fx = np.zeros((self.N, 2))
        self.sc0, self.scEnd = {}, {}
        for b in self.beats:
            self.sc0.setdefault(b['sc'], b['start'])
            self.scEnd[b['sc']] = b['start'] + b['d']

    # ---- primitives ----
    def band(self, x, lo, hi):
        X = np.fft.rfft(x)
        f = np.fft.rfftfreq(len(x), 1 / SR)
        X[(f < lo) | (f > hi)] = 0
        return np.fft.irfft(X, len(x))

    @staticmethod
    def env(n, a, d):
        e = np.ones(n)
        na = max(1, int(a * SR))
        e[:na] = np.linspace(0, 1, na)
        e[na:] = np.exp(-np.arange(n - na) / (d * SR))
        return e

    @staticmethod
    def norm(x):
        m = np.abs(x).max()
        return x / m if m > 0 else x

    def tone(self, f, dur, a=.005, d=.2, harm=(1,)):
        n = int(dur * SR)
        x = np.arange(n) / SR
        return sum(h ** -1.2 * np.sin(2 * np.pi * f * h * x) for h in harm) * self.env(n, a, d)

    def sweep(self, f0, f1, dur, d=.1):
        n = int(dur * SR)
        return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, n)) / SR) * self.env(n, .002, d)

    def noise(self, dur, lo, hi, a=.005, d=.1):
        n = int(dur * SR)
        return self.norm(self.band(self.rnd.standard_normal(n), lo, hi)) * self.env(n, a, d)

    def hit(self, f0=150, f1=45, dur=.6, d=.2):
        return self.sweep(f0, f1, dur, d)

    @staticmethod
    def layer(*xs):
        # sum signals of different lengths (shorter ones are zero-padded)
        n = max(len(x) for x in xs)
        return sum(np.pad(x, (0, n - len(x))) for x in xs)

    def add(self, sig, when, gain=1.0, pan=0.0, bed=False):
        to = self.bed if bed else self.fx
        i = int(when * SR)
        if i >= self.N or i < 0:
            return
        sig = sig[: self.N - i]
        to[i:i + len(sig), 0] += sig * gain * np.sqrt((1 - pan) / 2) * 1.414
        to[i:i + len(sig), 1] += sig * gain * np.sqrt((1 + pan) / 2) * 1.414

    def span(self, a, b):
        return (self.t >= a) & (self.t < b)

    def loop_bed(self, sig_full, mask, gain):
        self.bed[mask, 0] += sig_full[mask] * gain
        self.bed[mask, 1] += sig_full[mask] * gain

    # ---- common layers ----
    def drone(self, freqs, start, gain=.2, rise=None, until=None):
        t = self.t
        pad = np.zeros(self.N)
        for f, g in freqs:
            pad += g * np.sin(2 * np.pi * f * t + self.rnd.random() * 6) * (0.8 + 0.2 * np.sin(2 * np.pi * .12 * t + f))
        lvl = np.clip((t - start) / 2, 0, 1)
        if rise:
            lvl *= (0.5 + 0.6 * np.clip((t - rise[0]) / rise[1], 0, 1))
        if until:
            lvl *= (t < until)
        self.bed[:, 0] += pad * lvl * gain
        self.bed[:, 1] += pad * lvl * gain

    def pulses(self, start, fast_from, end=None):
        end = end or self.CUT - .3
        kick = self.sweep(110, 40, .35, .09)
        tt = start
        while tt < end:
            self.add(kick, tt, 0.24 if tt < fast_from else 0.36, bed=True)
            tt += 1.0 if tt < fast_from else 0.7

    def riser(self, start, end, gain=.28, f=(174.6, 185)):
        hs = int((end - start) * SR)
        if hs < SR // 10:
            return
        hx = np.arange(hs) / SR
        r = self.norm(self.band(self.rnd.standard_normal(hs), 300, 9000)) * (hx / hx[-1]) ** 2.5
        r += sum(np.sin(2 * np.pi * np.cumsum(ff * (1 + hx / hx[-1] * .6)) / SR) for ff in f) * (hx / hx[-1]) ** 2 * .5
        self.add(r, start, gain)

    def whooshes_and_pops(self):
        for b in self.beats:
            if b['cut'] and b['start'] > 0:
                wn = int(.34 * SR)
                w = self.band(self.rnd.standard_normal(wn), 300, 3500) * np.sin(np.linspace(0, np.pi, wn)) ** 2
                self.add(self.norm(w), b['start'] - .15, 0.1, bed=True)
        blip = self.tone(1250, .05, .002, .012)
        for b in self.beats:
            for w in b['words']:
                self.add(blip, w, 0.018, bed=True)

    # ---- sound effects shared by the kids' series ----
    def bed_noise(self, lo, hi, mod=0.0, rate=.2):
        x = self.norm(self.band(self.rnd.standard_normal(self.N), lo, hi))
        return x * (1 - mod + mod * np.sin(2 * np.pi * rate * self.t + self.rnd.random() * 6)) if mod else x

    def amb(self, sig, a, b, gain, fade=.25):
        lv = np.zeros(self.N)
        lv[self.span(a, b)] = gain
        k = max(1, int(fade * SR))
        lv = np.convolve(lv, np.ones(k) / k, 'same')
        self.bed[:, 0] += sig * lv
        self.bed[:, 1] += np.roll(sig, 400) * lv

    def echo(self, sig, delays=(.11, .23, .37), fb=.45):
        out = np.pad(sig, (0, int(max(delays) * SR) + 10))
        for k, dl in enumerate(delays):
            i = int(dl * SR)
            out[i:i + len(sig)] += sig * fb ** (k + 1)
        return out

    def step(self, lo=150, hi=1800):
        return self.layer(self.noise(.07, lo, hi, .002, .02), self.hit(90, 50, .1, .03) * .4)

    def steps(self, t0, t1, every, gain, pan=0, fade=0, lo=150, hi=1800, echo=False):
        tt = t0
        while tt < t1:
            g = gain * (1 - fade * (tt - t0) / max(.1, t1 - t0))
            s = self.step(lo, hi)
            self.add(self.echo(s) if echo else s, tt, g * (.85 + .3 * self.rnd.random()), pan=pan + self.rnd.uniform(-.1, .1))
            tt += every

    def metal(self, f0=310, dur=1.2, d=.35):
        return self.norm(self.layer(*[self.tone(f0 * r, dur, .001, d / (1 + i * .5)) * g for i, (r, g) in enumerate([(1, 1), (2.32, .6), (3.71, .4), (5.1, .25)])]))

    def knock(self):
        return self.layer(self.hit(130, 48, .5, .12) * .9, self.noise(.12, 150, 1400, .001, .025) * .8)

    def creak(self, dur, f0=26, f1=14):
        n = int(dur * SR)
        x = np.arange(n) / SR
        f = np.linspace(f0, f1, n) * (1 + .35 * np.sin(2 * np.pi * .9 * x))
        ph = np.cumsum(np.clip(f, 4, None)) / SR
        imp = np.zeros(n)
        imp[np.nonzero(np.diff(np.floor(ph)))[0]] = 1
        k = np.arange(int(.03 * SR)) / SR
        res = np.exp(-k * 90) * (np.sin(2 * np.pi * 820 * k) + .6 * np.sin(2 * np.pi * 1530 * k) + .3 * np.sin(2 * np.pi * 2710 * k))
        return self.norm(np.convolve(imp, res)[:n]) * np.sin(np.linspace(0, np.pi, n)) ** .3

    def bird(self, when, gain=.03, pan=0):
        f0 = 3000 + 1500 * self.rnd.random()
        for j in range(2 + int(self.rnd.random() * 3)):
            self.add(self.sweep(f0, f0 * 1.3, .07, .03), when + j * .1, gain, pan=pan)

    def birds(self, a, b, n, gain=.025):
        for _ in range(n):
            self.bird(self.rnd.uniform(a, b), gain, self.rnd.uniform(-.7, .7))

    def sung(self, f0, dur, vowel=(320, 800)):
        n = int(dur * SR)
        x = np.arange(n) / SR
        f = f0 * (1 + .012 * np.sin(2 * np.pi * 5.2 * x) * np.clip(x / .25, 0, 1))
        ph = 2 * np.pi * np.cumsum(f) / SR
        y = np.zeros(n)
        for k in range(1, 28):
            fk = k * f0
            y += (np.exp(-((fk - vowel[0]) / 140) ** 2) + .55 * np.exp(-((fk - vowel[1]) / 220) ** 2) + .02 / k) * np.sin(k * ph)
        return self.norm(y) * np.clip(x / .12, 0, 1) * np.clip((dur - x) / .25, 0, 1)

    def glitch(self, dur):
        n = int(dur * SR)
        x = self.rnd.standard_normal(n)
        hold = int(SR / 900)
        x = np.repeat(x[::hold], hold)[:n]
        return self.norm(self.band(x, 300, 8000) * (np.sin(np.arange(n) / SR * 2 * np.pi * 23) > 0))

    def heartbeat(self, t0, t1, bpm=90, gain=.25):
        hb = self.layer(self.hit(70, 40, .18, .05), self.hit(60, 35, .18, .05) * .7)
        tt = t0
        while tt < t1:
            self.add(hb, tt, gain)
            self.add(hb, tt + .18, gain * .7)
            tt += 60 / bpm

    def ringtone(self, t0, t1, notes=(1047, 1319, 1568, 1319), gain=.06, vib=True):
        tt = t0
        while tt < t1:
            if vib:
                v = np.sin(2 * np.pi * 150 * np.arange(int(.4 * SR)) / SR) * self.env(int(.4 * SR), .01, .3)
                self.add(self.band(v, 100, 2000), tt, gain * 2.5)
            for j, f in enumerate(notes):
                self.add(self.tone(f, .25, .002, .1, (1, 4)), tt + j * .12, gain)
            tt += 1.0

    def ding(self, when, gain=.1, f=1047):
        self.add(self.tone(f, 1.2, .002, .6, (1, 2)), when, gain)

    def typing(self, t0, n, gain=.04, every=.09):
        for k in range(n):
            self.add(self.noise(.02, 2000, 7000, .001, .006), t0 + k * every + self.rnd.random() * .03, gain)

    def musicbox(self, f, d=.9):
        n = int(1.6 * SR)
        x = np.arange(n) / SR
        return (np.sin(2 * np.pi * f * x) + .35 * np.sin(2 * np.pi * f * 2 * x) + .18 * np.sin(2 * np.pi * f * 3.01 * x)) * self.env(n, .002, d)

    def melody(self, notes, t0, t1, beat, gain, pan=0, inst=None, bed=True):
        tt, i = t0, 0
        while tt < t1:
            f, d = notes[i % len(notes)]
            if f:
                self.add((inst or self.musicbox)(f), tt, gain, pan=pan, bed=bed)
            tt += d * beat
            i += 1

    def sting(self, when, gain=.3, freqs=(220, 233.1, 311.1, 329.6)):
        self.add(self.norm(sum(self.tone(f, 2.5, .005, .9, (1, 2)) for f in freqs)), when, gain)

    def boom(self, when, gain=.5, dur=2.0):
        self.add(self.layer(self.hit(60, 26, dur, dur * .4), self.noise(.4, 40, 300, .001, .2) * .3), when, gain)

    def whoosh(self, when, gain=.12, dur=.4):
        n = int(dur * SR)
        w = self.band(self.rnd.standard_normal(n), 300, 3500) * np.sin(np.linspace(0, np.pi, n)) ** 2
        self.add(self.norm(w), when, gain)

    def finish(self, with_voice=False):
        if with_voice:
            import soundfile as sf
            nar, nsr = sf.read(os.path.join(self.proj, 'narration.wav'))
            assert nsr == SR
            nar = nar[:self.N] if len(nar) >= self.N else np.pad(nar, (0, self.N - len(nar)))
            e = np.convolve(np.abs(nar), np.ones(int(.15 * SR)) / int(.15 * SR), 'same')
            e = np.clip(e / (np.percentile(e[e > 1e-4], 90) + 1e-9), 0, 1)
            mix = self.bed * (1 - 0.55 * e)[:, None] + self.fx * (1 - 0.25 * e)[:, None]
            mix = mix / np.abs(mix).max() * 0.33
            mix[:, 0] += nar * 0.95
            mix[:, 1] += nar * 0.95
        else:
            mix = self.bed + self.fx
        mix[int(self.CUT * SR):] = 0  # hard cut with the picture
        mix = mix[: int(self.T * SR)]
        mix /= np.abs(mix).max() / 0.92
        with wave.open(os.path.join(self.proj, 'audio.wav'), 'wb') as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((mix * 32767).astype(np.int16).tobytes())
        print('audio', round(self.T, 2), 's,', 'voice' if with_voice else 'no voice', '| cut at', round(self.CUT, 2))

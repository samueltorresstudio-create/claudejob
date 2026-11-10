# Generates the narration with a local neural TTS (Kokoro or a native Piper voice) and derives the video timeline from it.
# usage: python3 narrate.py <models_dir> [narrator_voice] [speed]
# narrator_voice: a Kokoro voice id (em_alex...) or piper:<name>:<speaker> for a native Piper voice
import json, os, sys, subprocess
import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
MODELS = sys.argv[1]
VOICE = sys.argv[2] if len(sys.argv) > 2 else 'em_alex'
SPEED = float(sys.argv[3]) if len(sys.argv) > 3 else 1.1
TV_VOICE = 'piper:es_ES-sharvard-medium:1' if VOICE.startswith('piper:') else 'ef_dora'
TAIL_BLACK = 0.35

script = json.load(open(os.path.join(HERE, 'script.json')))
_engines = {}


def synth(text, voice, speed):
    if voice.startswith('piper:'):
        import sherpa_onnx
        _, name, sid = voice.split(':')
        if name not in _engines:
            d = os.path.join(MODELS, 'piper', 'vits-piper-' + name)
            cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
                vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=f'{d}/{name}.onnx', tokens=f'{d}/tokens.txt', data_dir=f'{d}/espeak-ng-data'),
                num_threads=4))
            _engines[name] = sherpa_onnx.OfflineTts(cfg)
        a = _engines[name].generate(text, sid=int(sid), speed=speed)
        return np.array(a.samples, dtype=np.float32), a.sample_rate
    from kokoro_onnx import Kokoro
    if 'kokoro' not in _engines:
        _engines['kokoro'] = Kokoro(os.path.join(MODELS, 'kokoro-v1.0.onnx'), os.path.join(MODELS, 'voices-v1.0.bin'))
    a, sr = _engines['kokoro'].create(text, voice=voice, speed=speed, lang='es')
    return np.asarray(a, dtype=np.float32), sr


def trim(a, sr, thr=0.012):
    env = np.convolve(np.abs(a), np.ones(int(.01 * sr)) / int(.01 * sr), 'same')
    idx = np.where(env > thr)[0]
    if len(idx) == 0:
        return a
    s, e = max(0, idx[0] - int(.02 * sr)), min(len(a), idx[-1] + int(.05 * sr))
    return a[s:e]


def tv_fx(a, sr):
    X = np.fft.rfft(a)
    f = np.fft.rfftfreq(len(a), 1 / sr)
    X[(f < 320) | (f > 3600)] = 0
    y = np.fft.irfft(X, len(a))
    y = np.tanh(y * 3) / 3
    return y / np.abs(y).max() * np.abs(a).max()


clips, beats, t = [], [], 0.0
SR = None
for i, line in enumerate(script):
    tv = line.get('voice') == 'tv'
    a, sr = synth(line['say'], TV_VOICE if tv else VOICE, 1.0 if tv else SPEED)
    SR = sr
    a = trim(a / (np.abs(a).max() + 1e-9) * 0.8, sr)
    if tv:
        a = tv_fx(a, sr)
    lead = 0.3 if i == 0 else 0.08
    vdur = len(a) / sr
    d = lead + vdur + line.get('pause', 0.2)
    beats.append({'start': round(t, 4), 'd': round(d, 4), 'lead': lead, 'vdur': round(vdur, 4)})
    clips.append((t + lead, a))
    t += d
total = t + TAIL_BLACK

nar = np.zeros(int(total * SR) + SR)
for st, a in clips:
    i = int(st * SR)
    nar[i:i + len(a)] += a
nar = nar[: int(total * SR)]
nar = nar / np.abs(nar).max() * 0.9
raw = os.path.join(HERE, 'narration_raw.wav')
sf.write(raw, nar, SR)
# broadcast-style voice chain: rumble cut, gentle compression, a touch of presence
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af',
                'highpass=f=75,acompressor=threshold=-20dB:ratio=3:attack=5:release=90:makeup=2,'
                'equalizer=f=3200:t=q:w=1.2:g=2.5,aresample=44100',
                '-ac', '1', os.path.join(HERE, 'narration.wav')], check=True)

with open(os.path.join(HERE, 'voice.js'), 'w') as f:
    f.write('window.SCRIPT=' + json.dumps(script, ensure_ascii=False) + ';\n')
    f.write('window.VOICE=' + json.dumps({'beats': beats, 'total': round(total, 4), 'tail': TAIL_BLACK}) + ';\n')
print('lines', len(beats), 'total', round(total, 2), 's')
for b, l in zip(beats, script):
    print(f"{b['start']:6.2f} {b['d']:5.2f}  {l['say']}")

# Sonido: audio.py con `audio_core.Mix`

El sonido lo genera `audio.py` con numpy (no hay archivos de audio). Lee `events.json` (que escribe `render.js`), así que **ejecuta `render.js preview …` al menos una vez antes** de `audio.py`.

```python
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from audio_core import Mix, SR
m = Mix(os.path.dirname(os.path.abspath(__file__)), seed=401)
E, t, N, CUT = m.E, m.t, m.N, m.CUT          # E['escena.evento'] = segundo absoluto de cada evento de EVS
sc0, scEnd = m.sc0, m.scEnd                  # inicio / final de cada escena
...
m.finish('--voice' in sys.argv)              # --voice mezcla narration.wav encima y baja la música bajo la voz
```

## API

**Añaden el sonido solas** (no uses `m.add`): `drone(freqs,start,gain,rise=None,until=None)`, `pulses(start,fast_from,end)`, `riser(start,end,gain)`, `whooshes_and_pops()` (transiciones entre escenas), `amb(señal,a,b,gain)`, `birds(a,b,n)`, `steps(t0,t1,cada,gain,pan)`, `heartbeat(t0,t1,bpm,gain)`, `ringtone(t0,t1)`, `ding(when,gain,f)`, `typing(t0,n)`, `melody(notas,t0,t1,beat,gain,pan)`, `sting(when,gain)`, `boom(when,gain)`, `whoosh(when,gain)`.

**Devuelven una señal** (hay que ponerla con `m.add(señal, segundo, gain, pan)`): `tone(f,dur,a,d)`, `sweep(f0,f1,dur,d)`, `noise(dur,lo,hi,a,d)`, `hit(f0,f1,dur,d)`, `metal(f0,dur,d)`, `creak(dur)`, `knock()`, `step()`, `glitch(dur)`, `musicbox(f)`, `sung(f0,dur)`, `bed_noise(lo,hi,mod,rate)` (para `amb`), y `layer(a,b,…)` para sumar varias.

Una llamada suelta a `m.metal(...)` sin `m.add` **no suena** (error real de una parte anterior).

## Estructura que funciona

1. **Cama musical**: un `drone` grave por bloque de la historia (cambia de acorde al cambiar de tono), `pulses` en las partes de acción (se aceleran hasta `fast_from`), una `melody` triste y lenta en los momentos emotivos, y un `riser` en los últimos 4–6 s que llega justo al corte. `whooshes_and_pops()` siempre.
2. **Ambiente por escena** con `amb(bed_noise(...))`: ciudad, viento, nevera, estática, mar. Cambiarlo marca el cambio de sitio aunque el espectador no lo note.
3. **Un efecto por cada cosa que se ve moverse**: pasos cuando alguien anda, golpe cuando cae algo, clic cuando se enciende algo. Sincronízalo con los eventos de `EVS` (`E['fight.hit']`).
4. **Stings** (`sting`) en las revelaciones y en el gancho; **heartbeat** desde el momento de peligro hasta que se resuelve; **boom** en el gancho fuerte o en un impacto.
5. Final: silencio total en el corte (lo hace `finish`), así el corte a negro golpea.

## Recetas

```python
def bark(when, gain=.16, pan=.2):          # ladrido
    m.add(m.layer(m.hit(520,260,.16,.06), m.noise(.14,400,2600,.002,.05)*.6), when, gain, pan)
m.add(m.layer(m.hit(150,50,.25,.08), m.noise(.08,200,3000,.001,.04)), E['x.hit'], .5)      # puñetazo
m.add(m.layer(m.hit(90,40,.4,.15), m.noise(.3,100,1200,.005,.15)), E['x.fall'], .3)        # cuerpo que cae
m.add(m.layer(m.hit(1800,1200,.04,.01), m.noise(.02,2000,8000,.001,.006)), E['x.on'], .2) # clic / interruptor
for k in range(8): m.add(m.tone(960 if k%2==0 else 770,.34,.01,.05), E['x.alert']+k*.38, .07)  # alarma de emergencia
for k in range(14): m.add(m.noise(.05,80,700,.002,.03), E['x.heli']+k*.11, .07)          # helicóptero
m.add(m.noise(2.5,40,400,.5,1.5), E['x.wave'], .16)                                        # rugido de ola
m.add(m.noise(6.0,200,2000,1.5,3.0), E['x.sea'], .14)                                      # el mar que se retira
m.add(m.noise(.05,2000,9000,.001,.02), E['x.lighter'], .16)                                # mechero
m.add(m.tone(1400,.12,.005,.08), E['x.walkie']-.15, .07); m.amb(m.bed_noise(1500,6000,.6,3), a, b, .02)  # walkie: pitido + estática
m.add(m.noise(1.2,2000,9000,.02,.5), E['x.spray'], .06)                                    # spray
m.add(m.creak(1.0), E['x.door'], .1)                                                       # puerta / cama que cruje
m.add(m.layer(m.noise(1.2,200,1200,.1,.5)), E['x.breath'], .14)                            # respiración en la oreja
k=0.0                                                                                      # hoguera que crepita
while E['x.fire']+k < fin: m.add(m.noise(.02,1000,6000,.001,.01), E['x.fire']+k, .03+.02*m.rnd.random()); k+=.25+.35*m.rnd.random()
```

Volúmenes: ambientes .006–.03, pasos .03–.05, efectos .05–.25, golpes .3–.5. La voz manda: si un efecto tapa una frase, bájalo.

## Voz

- `sync_voice.py <proyecto> <mp3>` reparte el audio de ElevenLabs entre las líneas de `script.json` (debe decir «N lines matched»). Revisa con `check_lines.py`: cada línea debe tener trozos de voz razonables.
- Si una frase se pega a la siguiente, corrige a mano `start`/`d`/`vdur` en `voice.js`.
- Los susurros de ElevenLabs salen bajos: `whisper_boost.py <proyecto> 1.3` sube un 30 % (≈2,3 dB) solo las líneas `whisper:true`. «Un poquito más, no mucho» = 1.3.

## Sonidos reales (si el usuario los da)

Si hay una carpeta `<WS>/sonidos/` con efectos o música libres de derechos (WAV/MP3), cárgalos y mézclalos como cualquier señal:

```python
import subprocess, numpy as np
def load(path, sec=None):   # cualquier formato → mono a SR
    a = subprocess.run(['ffmpeg','-v','error','-i',path,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    x = np.frombuffer(a, np.float32).copy()
    return x[:int(sec*SR)] if sec else x
m.add(load(os.path.join(WS,'sonidos','puerta.wav')), E['x.door'], .3)
m.amb(load(os.path.join(WS,'sonidos','lluvia.wav'))[:N] if len(load(...))>=N else ..., a, b, .05)   # o repítelo con np.tile hasta N
```

Música: pon la pista con `m.add(load(...), 0, .12)` y baja el `drone`; el ducking bajo la voz lo hace `finish`. Corta la música justo en `CUT`.

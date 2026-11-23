# Voz clonada en local (VoiceStudio / OmniVoice) — desde el vídeo 75

El usuario narra con **su propia voz** («Stickmans» en ElevenLabs). Desde el 75 la generamos aquí, sin ElevenLabs, con el motor de
VoiceStudio (debpalash/VoiceStudio → modelo `k2-fsa/OmniVoice`, paquete `omnivoice` de PyPI). Solo clonar SU voz (sus MP3), nunca la de otra persona.

## Instalación (una vez por sesión, ~10 min)
- Red: el entorno «claudejob» permite `huggingface.co` y `us.aws.cdn.hf.co` (+ hosts de Xet/LFS). Si una descarga da 403, mira a qué host redirige (`curl -sI .../resolve/main/model.safetensors`) y añádelo.
- `python3 -m venv ovenv && . ovenv/bin/activate && pip install omnivoice faster-whisper` (torch de PyPI, funciona en CPU; ocupa ~9 GB: borra `~/.cache/pip` después).
- faster-whisper: pásale el audio como array (ffmpeg → f32le 16 kHz); con un archivo da error de `av`.

## Herramientas (en `archivoraro_archivo/proyectos/75_poyais/voz/`)
- `refs/*.wav` + `refs/refs.json`: **banco de tonos** sacado de sus audios (texto EXACTO de cada trozo):
  `narr` (narrador intrigante, arranque del 73) · `alegre` (preso feliz, 70) · `seco` (apartes secos: «La otra… mejor no preguntes», 73) ·
  `serio` (bufón, 72) · `plan` (ocurrencia/pregunta: «volaré como paquete», 73) · `remate` (frase final con guiño, 70).
- `tts.py spec.json salida.wav [i,j]`: genera trozo a trozo con la referencia de cada tono (`num_step=64`, `class_temperature=.5`), limpia
  colas sueltas y suaviza cortes; con índices, rehace solo esos y reutiliza el resto. Spec: `{"l": línea, "t": texto, "r": tono, "sp": velocidad, "p": pausa}`.
- `check.py i,j,…`: transcribe cada trozo y lo compara palabra a palabra con el texto; lista los MAL para rehacerlos.
- Montaje: unir trozos con pausas ×0,72 y `atempo` (≤1,07) hasta la duración pedida; guardar los inicios de cada línea y compararlos con
  `sync_voice.py` (deben diferir solo en un desfase constante).

## Reglas aprendidas (75)
- **Nunca «…» al final de un trozo**: el modelo añade una sílaba cortada. Los puntos suspensivos solo dentro de la frase; la pausa la pones tú (`p`).
- El tono se controla eligiendo la referencia, no con etiquetas (no entiende [curious] etc.; solo [laughter], [sigh]).
- Remates y golpes: trozo aparte, velocidad .85–.93 y 0,4–0,5 s de pausa antes («Un detalle sin importancia. ‖ No existía.»).
- Revisar SIEMPRE con `check.py`: en el 75 salió «Las mosquitos» por «Más mosquitos» y «todo» por «todos»; se rehicieron solo esos.
- En CPU: ~100 s por trozo corto; un guion de 160 palabras (31 trozos) ≈ 55 min.
- **Comprobar la sincronía en el MP4 final** (75): medir el arranque real de la voz en `narration.wav` (RMS > 0,02) frente a
  `beat.start + lead` de `voice.js`. Salió un desfase constante de −0,13 s (voz antes que el subtítulo): se arregla retrasando la voz
  (relleno de silencio al principio de `narration.wav`, misma duración) y volviendo a mezclar, sin re-renderizar nada.
- **Números escritos en cifra** («1822», «200.000»): el reparto de tiempos por sílabas los cuenta cortos y las palabras siguientes
  salen adelantadas (+0,4 s en «zarpó»). Pasar whisper por la voz limpia, corregir esas palabras en `voice.js` y re-renderizar
  solo su tramo (las escenas que usan `wt()` de esa palabra también cambian).

## «La voz es muy robótica» (usuario, tras el 76) — cambios OBLIGATORIOS para el siguiente
Causas en el 76: 35 trozos cortísimos generados por separado (cada uno con su propia entonación, sin hilo), cambio de referencia entre
trozos (6 tonos distintos), `class_temperature=.5` (entonación plana), pausas recortadas ×0,6, `atempo` 1,07 y cortes con fundido que
se comen las respiraciones.
1. **Generar por frases largas o párrafos** (2–3 frases juntas, 8–15 s); trozo aparte SOLO para un remate.
2. **Una sola referencia por vídeo**, larga (15–20 s) y con energía de narrador contando algo increíble, sacada de sus MP3 reales; nada de saltar de tono en tono.
3. `class_temperature` ≈ .8 y **3 tomas por frase**: quedarse con la de más variación de tono (desviación de F0 y de energía) que pase `check.py`.
4. **Sin `atempo` y sin recortar pausas**: si sobra duración, se acorta el guion. Respiraciones y silencios naturales, sin fundidos al cortar.
5. Antes de generar el vídeo entero, mandar al usuario una **muestra de 2–3 frases** para que apruebe la voz.
6. Si él puede, su MP3 de ElevenLabs («Stickmans») sigue siendo lo más natural: preguntarle primero.
- **Prueba del 23-11-2026** (`proyectos/voz_mejorada/`): referencia única `ref.wav` = 0–16,95 s del MP3 real del 69 («En Japón te regalan casas…
  La puerta está abierta.»), gancho del 76 en UNA pieza, `num_step=64`, `class_temperature=.8`, 4 tomas (~5,5 min cada una en CPU).
  Descartes: una toma metió al principio el final del texto de referencia («la puerta está abierta») y otra repitió «plátano plátano»:
  **pasar siempre `score.py`** (Whisper + variación de tono) y escuchar el arranque. Sin acelerar sale ~12 s frente a 10,4 s del 76.

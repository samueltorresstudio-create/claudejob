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

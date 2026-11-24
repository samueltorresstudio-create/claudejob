# Voz clonada en local (VoiceStudio / OmniVoice) — desde el vídeo 75

> **MÉTODO POR DEFECTO desde el 23-11-2026 (elegido por el usuario: «usa la alegre en los próximos vídeos»)**
> - Referencia **`alegre`** (`refs/alegre.wav`, preso feliz del 70) para TODO el vídeo; nada de cambiar de tono por trozos.
> - **Sin trocear**: bloques de ~6 frases (≈15 s) de un tirón con `gen2.py` (`proyectos/voz_mejorada/`): `speed=1.05`, `num_step=64`,
>   `class_temperature=.3`. Las pausas las pone el modelo; no se insertan ni se recortan, y nada de `atempo`.
> - Unir los bloques con 0,25–0,35 s (o 0,45 si el siguiente empieza con un golpe) y comprobar cada bloque con `score.py`
>   (Whisper: 0 palabras mal; escuchar arranque y final por si mete restos de la referencia o repite palabras). 2 tomas por bloque.
> - Números en letra en el texto que se genera. La sincronía se saca como con un MP3 de ElevenLabs: `sync_voice.py` sobre el MP3 entero
>   (+ `LINE_STARTS` a mano si alguna línea sale dudosa) y luego `wsync.py`/`fixwords.js` para las palabras.
> - **LICENCIA (comprobado 23-11-2026 en la ficha oficial de k2-fsa/OmniVoice): el código es Apache 2.0, pero el MODELO es CC-BY-NC
>   (solo uso NO comercial) por sus datos de entrenamiento.** Ilimitado en cantidad, pero si el canal cobra (monetización, patrocinios)
>   no se puede usar: entonces ElevenLabs de pago. Recordárselo al usuario si monetiza.
> - Ritmo: ~16 s para 6 líneas cortas → guion de ~180–190 palabras para 62–65 s.

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
- **23-11-2026: el usuario prefiere la voz del 76 (trozos con tonos) a la de referencia única**, pero «tiene pausas raras, robóticas, mal
  hechas». Medido en sus MP3 reales (`pauses.py`, 5 vídeos): **punto ≈ 0,37 s (0,32–0,41), pregunta ≈ 0,38, coma ≈ 0,25**. En el 76 las
  pausas eran todas de 0,14–0,36 (mediana 0,23: pausas ×0,6 + `atempo`), iguales entre sí, con colas cortadas a 40 ms y silencio digital.
  Nuevo montaje `assemble2.py` (`proyectos/voz_mejorada/`): pausa según la puntuación medida, remate 0,5, +0,08 al cambiar de frase del
  guion, ±10 % de variación, colas naturales de 150 ms con caída suave, tono de sala a −66 dB y **sin `atempo`** (ajustar la duración con
  el guion). Sale un 20 % más largo: escribir guiones de ~175 palabras para 62–65 s.
- **Después: «hay momentos en los que no hacen falta tantas pausas»** → `assemble2.py` v2: pausa SOLO donde hace falta. Frases que siguen
  el hilo 0,2 s; trozo cortado en coma 0,1 s; pregunta con respuesta seca («¿Es de oro?» → «¡No!») 0,3 s; antes de un remate 0,42 s;
  +0,06 al cambiar de línea del guion; pausas internas que mete el modelo, como mucho 0,15 s. Primeros 25 s del 76: 27,8 s (antes 25,2
  acelerado / 30,4 con pausas «de manual»). Las pausas largas se reservan para los golpes.
- **Tampoco le valió («sigue malo, muchas pausas y robótico»)**: el problema era TROCEAR. Cada trozo acaba con entonación de final y las
  uniones suenan a robot por mucho que se ajusten las pausas. Prueba `gen2.py`: el texto entero de un tirón (6 líneas, ~16 s) con un tono
  del 76 (`alegre` o `narr`), `speed=1.05` del propio modelo, `class_temperature=.3`; el modelo pone sus pausas (0,15–0,35 s). 0 palabras
  mal en las 3 tomas, ~5 min por bloque. Si esto tampoco convence, el límite es OmniVoice: pedirle el MP3 de ElevenLabs.

## 78 · voz «como la referencia .99» (24-11-2026)
- El usuario pidió clonar la voz de la narración del .99 (otro canal): **NO se clona la voz de otra persona**; se imita solo el estilo (ritmo ~2,8 pal/s, tono cómplice, diálogos con voz de personaje, cortes secos) con SU voz.
- Primera prueba (ref `alegre` 8 s, speed .9): le gustó el ritmo, pero «tú sí, tú no» y la voz en general «robóticos».
- v2 (`proyectos/78_discoteca/voz/gen78b.py`): referencias MÁS LARGAS de sus MP3 con diálogo dentro (`preso.wav` 0–10,95 s del 70 con «Vale. Cinco años más»; `poker.wav` 0–13,8 s del 71), `class_temperature=.8`, `num_step=64`, `speed=.92`, y el diálogo escrito como tal: `y dice: «Tú, sí». «Tú… no».`. Medir con Whisper el hueco entre «tú» y «sí»: > 0,6 s suena a robot (preso_a); 0,35 s suena natural (poker_a).

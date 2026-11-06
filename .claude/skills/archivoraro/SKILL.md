---
name: archivoraro
description: Crea vídeos verticales animados para el canal «Archivo Raro» (TikTok y YouTube Shorts) de principio a fin — idea, guion para ElevenLabs, escenas animadas en SVG, subtítulos palabra a palabra, HUD, efectos de sonido, render, portada, títulos y descripciones. Úsala siempre que el usuario escriba /archivoraro o «archivoraro», pida una idea o un guion para un vídeo o una serie, pase un MP3 de ElevenLabs para montar un vídeo («aquí tienes el audio»), pida la parte siguiente de una serie, una portada, un título o una descripción para TikTok/YouTube, o quiera mejorar o corregir un vídeo animado del canal, aunque no nombre la skill.
---

# Archivo Raro

Canal en español de historias de supervivencia, misterio y terror suave, animadas en un estilo vectorial propio (personajes redondos, HUD amarillo, subtítulos grandes palabra a palabra, corte final a negro). El usuario habla español de España; contéstale siempre así, de forma directa y breve. Él pone la voz con ElevenLabs; tú haces todo lo demás.

El motor ya está hecho: personajes con decenas de rasgos, decorados, cámara, subtítulos, sonido sintetizado y render. Tu trabajo es dirigir: buena historia, buenos planos, buen sonido y cero errores de lógica. Los dos vídeos de `example/` son el listón de calidad.

## Qué hacer según lo que pida

| el usuario… | haces |
|---|---|
| escribe solo `/archivoraro` o pide ideas | 3 ideas (gancho, giro, final; 2–3 líneas cada una). Pregunta si es serie para TikTok o vídeo suelto para YouTube si no lo dice. Espera su elección. |
| elige una idea o pide el guion | Guion para ElevenLabs (ver `references/ideas.md` y `references/nivel.md`) + resumen de 5 líneas. Revisa la lógica antes de darlo. Espera el audio. |
| pasa un MP3 | Monta el vídeo completo (sección «Montar un vídeo») y entrégalo. |
| pide portada / descripción / título | `references/publishing.md`. |
| señala un fallo de un vídeo | Arréglalo, re-renderiza solo el tramo afectado y vuelve a entregar. |

No puedes generar la voz: si quiere el vídeo, necesitas su MP3. Al darle el guion, recuérdale la voz: Eleven v3, «Edoardo – Dark Measured Natural», estabilidad «Natural».

## Referencias (léelas cuando toque)

- `references/ideas.md` — fórmulas de gancho, estructura de serie y de vídeo suelto, duraciones, revisión de lógica, formato del guion para ElevenLabs.
- `references/engine.md` — cómo funciona el motor, `script.json`, `scenes_p.js`, todas las opciones de personajes, helpers y atrezo.
- `references/sound.md` — `audio.py`: API del mezclador, estructura de la banda sonora y recetas de efectos.
- `references/nivel.md` — **lista para subir el nivel**: retención (primer fotograma con acción, nada quieto más de 3 s), enfoques, acting, partículas, historia sin desviarse, voz, sonido y publicación. Repásala con cada guion y cada montaje.
- `references/lessons.md` — **lista de errores que el usuario ya detectó**. Repásala siempre antes de entregar.
- `references/publishing.md` — portada, títulos y descripciones, nombres de archivo.
- `example/tsunami6/` (82 s, serie) y `example/camara/` (66 s, YouTube) — `script.json`, `scenes_p.js` y `audio.py` de dos vídeos aprobados.

## Preparación (una vez por sesión)

El espacio de trabajo vive en el scratchpad de la sesión (lo llamaremos `WS`, por ejemplo `<scratchpad>/archivo`). Lo crea:

```bash
bash <skill>/scripts/setup_workspace.sh "$WS"     # tools/, entregas/, portadas/
```

Dependencias: `node` con Playwright y Chromium, `ffmpeg`/`ffprobe`, Python con `numpy`, `soundfile` y `Pillow`, y las fuentes **Inter** y **JetBrains Mono** (`fc-list | grep -i -E "inter|jetbrains"`). Si falta algo, instálalo antes de empezar (pip, npm, o las fuentes desde Google Fonts a `~/.fonts` + `fc-cache -f`).

## Montar un vídeo

### 1. Proyecto y guion de escenas

```bash
bash <skill>/scripts/new_project.sh "$WS" 45_nombre_corto
```

Escribe `script.json`: una entrada por frase del audio, en el mismo orden y con el texto exacto (ver `engine.md`). Agrupa las frases en escenas de 4–8 s: cada cambio de escena es un cambio de sitio, de plano o de ángulo, y eso mantiene la atención.

**Antes de programar, haz la lista de planos** (con `references/nivel.md` delante: qué pasa en el primer segundo, qué cambia cada 3 s, dónde van los 2–4 enfoques) (en tu cabeza o en un archivo): para cada escena, qué se ve, dónde está cada personaje y hacia dónde mira, qué se mueve, qué rótulo aparece y qué suena. Comprueba la geografía y la lógica con `lessons.md`: quién ve a quién, dónde está cada objeto, que lo que se dice se vea. Es mucho más barato corregir aquí que después de renderizar.

### 2. Escenas (`scenes_p.js`)

Copia la estructura de los ejemplos. Para cada escena, busca este nivel de calidad:
- **Ninguna pared vacía, nunca** (exigencia del usuario para todas las escenas): 5–6 detalles mínimo por decorado con `decorWall()` y los objetos `d*` (cuadros, estante, reloj, calendario, póster, enchufes, radiador, planta, perchero).
- **Decorado con 3–4 capas** (fondo, pared u horizonte con detalles, objetos, suelo) y luz (`dark` con huecos, `glowY`, cielo según la hora).
- **Personajes vivos**: andan (`walk`), miran a lo que importa (`look`), cambian de cara (`brows`, `mouth`, `eyes`) cuando cambia la historia; aspecto fijo en todo el vídeo.
- **Personajes grandes en el plano** (escala .6–.9, en primer plano, no muñequitos en medio de una pared) y **decorados con perspectiva y luz propia** (rayo de sol, velas, atardecer, fondo que se pierde a lo lejos).
- **Enfoques**: en 2–4 momentos clave por vídeo la cámara se mete en la cara con `focusCam` (fondo desenfocado, franjas de cine).
- **Cámara que se mueve**: un acercamiento lento (`cam` con zoom de 1.0 a 1.1) en casi todas, temblor (`shake`) en los golpes, primeros planos para los objetos clave (walkie, nota, mapa, radio).
- **Una acción por evento de la voz**: lo que se dice en ese momento pasa en pantalla a la vez (`EVS` + `prog`/`P`).
- **Máximo un rótulo a la vez**, corto, en un hueco libre; números con `countPop`; onomatopeyas con `bang`.
- En series, cuenta atrás o reloj en el HUD (`CFG.hud`) si hay urgencia; lista de pasos con `step` y `CFG.steps`.

Después:

```bash
cd "$WS/45_nombre_corto"
cat props.js props2.js cast.js scenes_p.js > scenes.js
python3 -I ../tools/sync_voice.py . /ruta/al/audio.mp3      # debe decir "N lines matched"
python3 -I ../tools/check_lines.py .
python3 -I ../tools/check_sync.py .                        # 0 líneas dudosas; si sale «REVISAR», ver abajo
python3 -I ../tools/whisper_boost.py . 1.3                  # si hay líneas whisper:true
python3 -I ../tools/extend_total.py . 62                    # solo si hace falta llegar a una duración (YouTube > 60 s)
```

**Sincronización (obligatorio comprobarla).** Si `check_sync.py` marca una línea, la búsqueda de pausas se ha comido un trozo de la frase vecina y desde ahí los subtítulos van adelantados (le pasó a «Apagón 1»: hasta 3 s). Lista los tramos de voz, decide a mano dónde empieza cada frase y vuelve a sincronizar con `LINE_STARTS="7.81,15.74,…"` (segundos del MP3 original, de la 2.ª frase a la última). `sync_voice.py` guarda además los tramos de voz de cada frase y la hora de cada palabra anclada a sus pausas, así que el resaltado palabra a palabra sigue a la voz (error < 0,1 s).

### 3. Revisión visual (obligatoria)

```bash
node render.js preview 2,6,10,…            # ~20 tiempos repartidos por todo el vídeo, 1–2 por escena
python3 ../tools/sheet.py sheet.png preview/p_2.00.png …    # hoja de contacto; ábrela con Read y mírala
```

Si la consola muestra `PAGE ERROR`, arréglalo primero. Mira la hoja con los ojos del usuario: ¿se entiende cada plano sin sonido?, ¿hay algo tapado, cortado o encima de otro texto?, ¿cada personaje se distingue?, ¿tiene lógica dónde está cada uno? Repasa `lessons.md`. Corrige y vuelve a mirar hasta que no encuentres nada.

### 4. Sonido

Escribe `audio.py` siguiendo `references/sound.md` (cama musical, ambiente por escena, un efecto por cada acción, stings en las revelaciones, riser al final) y pruébalo: `python3 -I audio.py --voice`.

### 5. Render y entrega

```bash
rm -rf frames finish.log
(bash -c 'node render.js full 4 > render.log 2>&1 && cd .. && python3 -I 45_nombre_corto/audio.py --voice > 45_nombre_corto/audio.log 2>&1 && python3 tools/finish.py 45_nombre_corto 45_nombre_corto_CON_VOZ "45 · TÍTULO (para ElevenLabs, con etiquetas)" > 45_nombre_corto/finish.log 2>&1; echo DONE >> 45_nombre_corto/finish.log' &)
```

Espera en segundo plano con `until grep -q "^DONE" finish.log …` (el render de 80–90 s tarda unos 10 minutos). Al acabar:
1. Comprueba en `finish.log` la duración y que el corte a negro está bien.
2. Mira `final_sheet.png`. Si ves algún fallo, arréglalo y re-renderiza **solo ese tramo**: `R0=<fotograma_inicial> R1=<fotograma_final> node render.js full 4` (fotograma = segundo × 30), y vuelve a ejecutar `finish.py`. Por eso no se borra `frames/` hasta que el usuario dé el vídeo por bueno.
3. Envía `<WS>/entregas/<nombre>_CON_VOZ.mp4` con `SendUserFile` (display `attach`), di cuánto dura y ofrece portada y descripciones.

## Reglas que el usuario ya ha pedido

- Hashtags solo en la descripción, nunca en el título; en TikTok la primera línea es el gancho.
- YouTube: vídeos sueltos de más de 60 s (60–70 s). TikTok: series, con la duración que pida.
- Portada con el protagonista visible y sin rótulos encima.
- Personajes distinguibles por silueta, no solo por color (reparto en `cast.js`, códigos C01–C27).
- Con cada descripción, da también un comentario para fijar con una pregunta.
- Si algo ya está publicado y tiene un fallo, no propongas resubirlo: corrígelo en la parte siguiente o con un comentario fijado.

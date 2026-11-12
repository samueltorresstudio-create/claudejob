# Archivo Raro: contexto completo para seguir trabajando (traspaso de cuenta, 10-11-2026)

Este documento resume TODO lo hablado y hecho con el usuario en la sesión larga anterior, para que una sesión nueva (otra cuenta) continúe exactamente igual, sin que se note el cambio. Léelo entero antes de responder. La skill `archivoraro` (`.claude/skills/archivoraro/`) contiene el método técnico; este archivo contiene la **historia, las preferencias y el estado**.

## 1. El usuario y el canal

- Creador del canal **«Archivo Raro»**: TikTok **@archivoraro9**, YouTube y Shorts. Español de España.
- **Contéstale siempre en español de España, directo y breve.** Sube desde el móvil.
- **Mayoría de público latinoamericano** (México, Colombia, Venezuela, Argentina, Perú…).
  - Lo que mejor funcionó fue **«Apagón» parte 1** (915 mil visitas), por el **debate en comentarios**: los latinos se reían del apagón de España y los españoles se defendían.
  - Ideas que enfrentan a países o generan discusión = más alcance.
- Metricool conectado (blogId 7875099, Europe/Madrid).
  - Mejores horas en TikTok: 10:00 y 18:00 entre semana.
  - Las series pierden apoyo en cada parte: Apagón 2 tuvo 49 mil; Apagón 3, 827 «me gusta» en 9 h.
- **Voz:** el usuario genera el MP3 en ElevenLabs.
  - Historias de miedo/suspense: Eleven v3, «Edoardo – Dark Measured Natural», estabilidad «Natural».
  - **Curiosidades nuevas: quiere OTRA voz más alegre y rápida**, y la elegirá él. Haz los vídeos **sin voz** hasta que la mande.
  - No clonar la voz de Edoardo. Nada de susurros.
  - **No volver a proponer `create_environment` para guardar la clave de ElevenLabs** (lo denegó).
- Correo del usuario: privado, no enviarlo a servicios externos.

## 2. Cómo trabaja contigo (preferencias firmes)

- Antes de un vídeo nuevo: **bocetos/fotos de los personajes Y del escenario dentro del mundo 3D**, y esperar su «sí».
  - Si pide fotos, **no hagas vídeo**.
  - Si un diseño no le gusta, rehazlo de verdad. No insistas.
- **«Ni un fallo»**: revisa hojas de fotogramas con lupa antes de enviar. Errores que ya detectó (están en `references/lessons.md`):
  - un coche dentro de la cancha;
  - un sombrero «levitando»;
  - personajes amontonados;
  - plantas delante de la cámara;
  - piernas fantasma bajo el agua;
  - un personaje encima de la canoa en vez de dentro.
- Primeros 2 s: el personaje o lo más interesante, en cámara y con acción. Gancho fortísimo.
- Datos reales: **compruébalos en la web** antes de darlos. Si las fuentes no coinciden, di la cifra prudente y cuenta como «leyenda» lo que lo sea.
- Al entregar: vídeo con `SendUserFile` (attach), título y descripción de YouTube y TikTok en bloques de código y TAMBIÉN en un .txt de texto plano (copiar el bloque y pegarlo en YouTube Studio lo pega con fondo negro), y comentario para fijar con una pregunta. TikTok: descripción corta.
- **Flechas bien hechas**: ancladas al objeto que señalan, apuntando a la dirección real, curvas limpias con contorno; nada fuera de sitio (ver estilo3d.md → «Flechas»).
- **NUNCA recuadros/etiquetas de texto arriba** («1943», «U.S. ARMY», «FRED SKINNER», «COMITÉ CIENTÍFICO»…): ni uno. Solo el subtítulo palabra a palabra. (12-11-2026)
- Vídeo de las palomas (64) rechazado: «fondos y misil parecen plastilina, detalles mal puestos, movimientos mal». Causas vistas: objetos lisos sin textura ni detalle (misil = huevo gris), todo bañado en naranja y desenfocado (DOF/bloom), personajes en primerísimo plano tapando el escenario, motas de polvo que parecen manchas, bandera de España en el uniforme de un oficial de EE. UU. La referencia tiene escenarios nítidos con textura pintada a mano, luz de día, colores variados y planos medios con el personaje dentro del escenario.
- Todo lo que aprendas, **guárdalo en la skill y haz commit y push** en la rama `claude/archivoraro-skill`.

## 3. Estilos de animación (de más nuevo a más viejo)

1. **ESTILO 3D: el actual y por defecto** (`references/estilo3d.md`, motor `engine_3d/`).
   - Mundo three.js con contorno, luz de cine, niebla y desenfoque.
   - **Personajes 2D**: cabeza redonda blanca y caras como las de la cuenta de referencia (párpado pesado, susto con dientes en rejilla, sudor).
   - Cuerpo = prenda con volumen y 2–3 detalles gruesos; pelo con mechones (`hair.js`); luz del sitio sobre el personaje.
   - Subtítulo de **una palabra** en el centro (y ≈ 1460).
   - Lo eligió a partir de 2 vídeos de referencia de una cuenta (todo 3D menos los personajes).
   - **Es una base: no copiar sus personajes.** Nuestro sello: logos «AR», el 7 de Dani…
2. **SUCESOS** (`references/sucesos.md`, `engine_sucesos/`): historias reales de una parte con siluetas sin rostro y texturas. «La cuerda» (Joe Simpson) está hecha así, **sin voz, esperando el MP3**.
3. **Estilo 2D antiguo** (`engine/`, personajes redondos con HUD amarillo): solo para retocar vídeos o series antiguos.

### Lo último que se estaba haciendo: transiciones de cámara (pedido del usuario)

- Quiere que, como en la cuenta de referencia, **entre toma y toma la cámara no corte**: debe alejarse mucho, girar o acercarse y viajar al siguiente plano, con desenfoque de movimiento.
- **Ya está implementado en `engine_3d/core3d.js`.**
  - Config: `CFG.trans = { escena: 'fly'|'pull'|'push'|'whip'|'cut' }`, `CFG.transDefault`, `CFG.transDur` (0,55 s).
  - La cámara vuela de la última toma de la escena anterior a la primera de la nueva.
  - En la primera mitad se dibujan los personajes de la escena anterior y en la segunda los de la nueva; el cambio queda oculto en el pico de desenfoque.
  - Antes de cada transición hay un pequeño desenfoque de anticipación.
- **Pendiente:**
  - probarlo en un clip (`60_hipopotamos/clip.js` renderiza tramos) y enseñárselo;
  - aplicarlo al vídeo de la Isla de los Faisanes y volver a renderizar los hipopótamos con transiciones cuando llegue su voz.

## 4. Formato de guion que se hace viral (lo nuevo)

`references/ideas.md` → «Fórmula de guion viral» (analizada a partir de los subtítulos de la cuenta de referencia):
- curiosidad real en una sola parte de 40–60 s;
- línea 1 con un hecho raro como acción y línea 2 con la reacción de los demás;
- un número exacto, la bisagra «Verás,…», «Imagina…», escalada y final que da la razón al «loco», en bucle;
- frases cortas, un plano por frase;
- música alegre (cumbia o similar), no de suspense.

**Banco de 20 ideas contrastadas:** `references/banco_ideas.md`. Las que más le gustan:
- ✅ **hipopótamos de Colombia**: hecho sin voz;
- 👉 **Isla de los Faisanes (#18)**: la ha elegido; bocetos aprobados («está bien»).

## 5. Estado de los proyectos (pendientes primero)

| proyecto | estado | siguiente paso |
|---|---|---|
| **62 · Las vacas cebra** (Japón, 2019; Ig Nobel 2025) | Vídeo CON VOZ entregado el 12-11-2026 (73,5 s; `entregas/62_vacas_cebra_CON_VOZ.mp4`); 2.ª versión: boca del vecino sincronizada con la voz, voz del vecino «grave y rasposa» (`char_voice.py`), brazos en la valla, palo de barbería arreglado, fondo con casita detrás del vecino: granja japonesa 3D (`world_kenji.js`), vacas 2D (`cow2d.js`), IK en brazos, transiciones lentas y suaves, cámara siempre en movimiento, subtítulos nítidos en las transiciones. Proyecto en `proyectos/62_vacas/`; guion y textos en `textos/` | Hecho (falta solo que el usuario lo publique) |
| **61 · Isla de los Faisanes** (España/Francia, cambia de país cada 6 meses) | **Guion ya escrito y con datos comprobados, con 4 etiquetas v3: `textos/guion_61_faisanes.txt`. Se espera el MP3.** Bocetos aprobados: mundo `world_bidasoa.js` (río, isla, monumento de 1659 «Paz de los Pirineos», casas vascas, banderas, puente) y personajes oficial español (`outfit:'navy'`, `hat:'peaked'`) y marinero francés (`outfit:'marin'`, `hat:'bachi'`). Bocetos en `proyectos/61_faisanes_bocetos/` | Escribir el guion con la fórmula viral (comprobar datos: tratado de Bayona de 1856; España del 1 de febrero al 31 de julio y Francia del 1 de agosto al 31 de enero; traspaso entre las armadas; Paz de los Pirineos de 1659 firmada allí; deshabitada y no visitable). Dárselo, esperar el «sí», hacer el vídeo **sin voz con transiciones de cámara** |
| **60 · Los hipopótamos de Colombia** | Entregado SIN VOZ (49 s): `proyectos/60_hipopotamos/`, ejemplo en la skill `example/hipopotamos_3d/` | Cuando mande el MP3 con la voz nueva: `sync_voice.py`, añadir las transiciones (`CFG.trans` ya está en `scenes_p.js`), render y audio con `--voice` |
| **52 · La cuerda (Joe Simpson)** | Entregado sin voz (estilo SUCESOS, para YouTube) | Cuando mande el MP3: sync, render con `GRAIN=1` y entrega |
| 54 · 10 segundos sin gravedad | Entregado con voz y subido (no le gustaron los personajes; de ahí salió el estilo 3D actual) | — |
| 53 · El Silbón parte 1 | Entregado con voz, portada póster (`references/portadas.md`) | Ofrecida la parte 2 (abuela sorda a los huesos; el látigo del abuelo; Canelo) |
| Apagón 1-3 | Entregados. **No seguir esa serie** | — |
| Serie kids (20 vídeos, 12-31) | Entregados (`proyectos/kids/PLAN.md`) | — |

Numeración de entregas:
- 01-11: primeros vídeos.
- 12-31: serie kids.
- 32-35: Desaparecen los adultos 2-5.
- 36: Prehistoria.
- 37-46: Tsunami 1-7 + El Hombre de la Estática + La cámara + Juliane.
- 47: Onoda.
- 48-50: Apagón.
- 51-52: La cuerda.
- 53: Silbón.
- 54: Gravedad.
- 60: Hipopótamos.
- 61: Faisanes.

## 6. Dónde está cada cosa

- **Skill:** `.claude/skills/archivoraro/`.
  - `SKILL.md` es el índice.
  - `references/`: `estilo3d`, `ideas` (+ fórmula viral), `banco_ideas`, `lessons`, `nivel`, `sound`, `portadas`, `personajes`, `publishing`, `sucesos`, `engine`.
  - `engine_3d/`: `world3d` (cancha), `world_rio` (río Magdalena), `world_bidasoa` (Faisanes), `stick`, `hair`, `hippo`, `core3d`, `util3d`, `render`, `index`, `three_post`.
  - `scripts/`: `new_3d.sh`, `sync_voice.py`, `fake_voice.py`, `finish.py`, `audio_core.py`, `silbido.py`…
  - `example/`.
- **Este archivo:** `archivoraro_archivo/`.
  - `proyectos/`: código de cada vídeo (`script.json`, `scenes_p.js`, `audio.py`, personajes propios como `silbon.js`).
  - `textos/`: todos los guiones (`guiones_elevenlabs.txt`), títulos y descripciones de YouTube.
  - `referencias/`: hojas de fotogramas de los vídeos de referencia de la cuenta 3D y de los mineros (Sabelotodo).
- **Los vídeos MP4 y los audios no están en el repo** (pesan varios GB): el usuario ya los tiene descargados.
- Para trabajar se crea el espacio en el scratchpad con `bash .claude/skills/archivoraro/scripts/setup_workspace.sh "$WS"`. Para un vídeo 3D: `bash .../scripts/new_3d.sh "$WS" 61_faisanes` y copiar el `world_*.js` que toque.

## 7. Entorno técnico (por si falla algo)

- Sin tarjeta gráfica y con 4 núcleos: el 3D tarda unos 2 s por fotograma (unos 50–60 min para 50 s de vídeo con 4 procesos).
  - Render en segundo plano y esperar con un bucle `until grep -q …`.
  - Borrar `frames/` viejos si el disco se llena.
- three.js va empaquetado en `engine_3d/three_post.js` (incluye `EffectComposer`, `GTAO`, `Bloom`, `Bokeh`, `OutputPass`, `RoundedBoxGeometry`, `mergeVertices`).
- No se puede acceder a TikTok, YouTube ni Instagram desde el entorno: el usuario sube los vídeos de referencia como archivo y se analizan fotograma a fotograma con ffmpeg.
- Fuentes Inter y JetBrains Mono instaladas en `~/.fonts`. Si faltan en la cuenta nueva, instálalas antes.

## 8. Lo último de la sesión anterior (11-11-2026)

- **Guion de los Faisanes** escrito: `textos/guion_61_faisanes.txt`. Se le propuso meter `[deadpan] [slowly] Pero no puedes.` como remate, sin respuesta aún. Siguiente paso: que mande el MP3 y hacer el vídeo con las transiciones de cámara.
- **Etiquetas de Eleven v3:** el usuario quiere variedad según la situación, sin ponerlas en cada frase. El catálogo está en `references/ideas.md`. Remate seco y alargado («Mala… idea»): `[deadpan] [slowly]` en su propia línea y con «…» dentro.
- **Guion de prueba de etiquetas** (Guerra de los Pasteles): `textos/guion_prueba_etiquetas_pasteles.txt`. Corregido en el banco: fue México quien declaró la guerra (nov. 1838) y en 1839 pagó los 600.000 pesos.
- **Prompt para ChatGPT** con las ideas al estilo de la cuenta de referencia (curiosidades de historia, ciencia, trucos y psicología, con el «loco contra todos»). Se basa en la «Fórmula de guion viral» de `ideas.md`.
- **Voz:**
  - Pidió clonar la voz del narrador de @KnoxClips7000 (la cuenta de referencia del estilo 3D) a partir de una grabación de pantalla. Dijo que era suya y se le dijo que no, porque no se puede comprobar. **No preparar audio para clonar voces de terceros.**
  - Alternativas ofrecidas:
    - Voice Design de ElevenLabs (narrador alegre en español latino neutro);
    - recuperar su cuenta de ElevenLabs (soporte) o descargar sus vídeos desde YouTube Studio.
- **Qwen3-TTS** (modelo de voz abierto de Alibaba): pidió instalarlo en la sesión, pero se interrumpió antes de hacerlo y está **sin instalar**.
  - Sin GPU irá lento.
  - Hay que comprobar si el entorno llega a huggingface.co.
  - Para clonar voces se aplica la misma regla: solo la voz del propio usuario o una con permiso.

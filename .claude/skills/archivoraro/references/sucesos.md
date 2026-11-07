# Estilo SUCESOS (historias reales de una parte)

**Cuándo:** siempre que el usuario pida un vídeo de **un suceso real impresionante en una sola parte** (rescates, supervivencia real, accidentes, hazañas: los 33 mineros, la cueva de Tailandia, Joe Simpson…), o diga «al estilo del vídeo de los mineros / Sabelotodo». **No uses aquí los personajes redondos con cara ni el HUD del canal**: el usuario lo pidió expresamente.

Referencia que mandó el usuario: cuenta «Sabelotodo», los 33 mineros de Chile (426 mil «me gusta»). Se usa **de base**, no se calca.

## Qué lo define
- **Personajes sin rostro**: siluetas articuladas (`figure()` en `sx_kit.js`) con chaqueta de plumas, cabeza lisa, gorro o pelo como única seña, manoplas, luz de contorno (`rim`). Se distinguen por el color de la chaqueta y el gorro. Nunca ojos ni boca.
- **Fondos pintados**: texturas de «mármol agrietado» (celdas de Worley + bandas onduladas, `tex_gen.py`) que se mueven en ondas lentas (`tex()`), luz y niebla encima, viñeta y grano.
- **Objetos en primer plano que cuentan la historia**: la cuerda que roza el borde, la navaja que brilla, el reloj digital, la radiografía. Los objetos importan más que las caras.
- **Comparaciones de escala**: «6.344 m ≈ 19 Torres Eiffel» apiladas, «700 m = 2 Torres Eiffel».
- **Cajas de datos** (`pill()`): número grande amarillo + unidad pequeña. **Monitor** (`monitor()`) con barra que baja de amarillo a rojo («La nieve aguanta», «Probabilidades de hallarlos con vida»).
- **Subtítulos arriba**, en minúsculas normales (no mayúsculas), 2 líneas como mucho: lo dicho en blanco, lo que viene en gris; la palabra clave marcada con `|y`/`|p`/`|b`/`|g` sale en un **recuadro azul de selección con dos tiradores**. Una o dos palabras marcadas por frase.
- **Cámara viva**: planos verticales que bajan por la cuerda o la grieta, acercamientos lentos, temblor en golpes, destello en el corte.
- **Animación con física**: caídas con rotación, extremidades que se agitan (`POSE.tumble`), estelas de movimiento (copias con alfa), impacto con polvo (`burst`, `puffAt`) y temblor. Nada de muñecos rígidos.
- **Partículas en casi todos los planos**: nieve, ráfagas (`streaks`), chispas, brasas, polvo en rayos de luz (`rays`, `beam`).
- **Gancho con pregunta al espectador** y final que vuelve a la imagen del principio (bucle): «¿La cortarías?» … «¿Y tú?».

## Motor
- `bash <skill>/scripts/new_sucesos.sh "$WS" 52_nombre` → copia `sx_kit.js`, `sx_core.js`, `index.html`, `render.js` y las texturas.
- `script.json` igual que siempre (`sc`, `say`, `cap`, `pause`, `cut`), pero `cap` en minúsculas normales y sin `hud`.
- `scenes.js`: `EVS` + `S.escena=(X,t,D,B)=>{…}` dibujando en canvas a pantalla completa (1080×1920, coordenadas de pantalla con `cam(z,cx,cy,shake)`), y al final `window.CFG={tex:['storm','ice','snow','rock','strata','moraine','dawn','night']}`.
- Sin MP3 todavía: `python3 <skill>/scripts/fake_voice.py <proyecto>` calcula los tiempos con un modelo ajustado a las voces anteriores del usuario. Cuando llegue el MP3, `sync_voice.py` y volver a renderizar: las escenas se adaptan solas porque todo cuelga de `EVS`.
- Render, sonido y entrega: igual que el estilo normal (`render.js`, `audio.py` con `audio_core`, `finish.py`).
- Ejemplo completo: `example/la_cuerda_sucesos/` (Joe Simpson, Siula Grande 1985).

## Piezas de `sx_kit.js`
`cam`, `shake`, `tex`, `texFill(path,…)`, `poly`, `jag`, `glow`, `beam`, `rays`, `shadeRect`, `snow`, `streaks`, `sparks`, `burst`, `puffAt`, `embers`, `dust`, `breath`, `rope(pts,w,{tw})`, `sag`, `pill`, `label`, `monitor`, `rock`, `figure(pose,estilo)`, `rigPts(pose).world` (manos, cadera, cabeza… para atar cuerdas u objetos), `POSE.stand/walk/descend/seatBraced/hang/climbFail/tumble/slip/lieBack/crawl/rappel/sitRock/sitFire/kneelPack`, `ground(s)`.

## Lecciones (del primer intento, que el usuario llamó «meh»)
- Caídas sin física, fondos planos y gráficos simples = «meh». Cada caída necesita rotación, extremidades agitándose, estela e impacto.
- Nada de rótulos amontonados ni onomatopeyas de cómic en este estilo: datos limpios en cajas.
- La rejilla de grano debe dibujarse sin solapar baldosas (si no, salen cuadrados).

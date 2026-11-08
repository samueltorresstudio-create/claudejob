# Entrega: portada, títulos y descripciones

## Portada (1080×1920)

Esta es la portada **rápida**, hecha a partir de un fotograma. Para «una buena portada», la de un monstruo o personaje o la de una parte 1, haz el **póster dedicado** de `portadas.md`.

1. Fotograma limpio, sin HUD ni subtítulos: `node <WS>/portadas/clean.js <ruta_absoluta_proyecto> <segundo> <WS>/portadas/cand/<nombre>.png`. Elige un segundo en el que salga el protagonista (y si puede ser, la amenaza) y **ningún** `tag`/`bang` de la escena; mira `preview/` o `final_sheet.png` para escogerlo.
2. Cópialo como `<WS>/portadas/f_<clave>.png` y añade una entrada en el objeto `C` de `cover.html`:
   `clave:{f:'f_clave.png',z:1.2,x:-40,y:-20,hook:'GANCHO CORTO',title:'<span style="color:#6cc6ff;…">TÍTULO</span>',size:200,part:'PARTE 4',cls:'p4'},`
   (`z` zoom, `x/y` desplazamiento de la imagen; `part`/`cls` solo en series; clases de color `p2 p3 p4 p5`).
3. `node <WS>/portadas/shot.js <clave>` → `<WS>/portadas/portada_<clave>.png`. Mírala antes de enviarla.

## Textos

Guárdalos en `<WS>/entregas/titulos_y_descripciones.txt` y dalos también en el chat dentro de bloques de código separados, listos para copiar (el usuario lo pide así).

- **Título de YouTube**: gancho + emoji + «(Parte N)» en series. **Nunca hashtags en el título.**
- **Descripción de YouTube**: 2–3 frases que vendan el giro sin destriparlo, luego hashtags (`#shorts` + temáticos).
- **TikTok**: **corta, una línea y poco** (el usuario lo pide así): el gancho en una frase + 1 emoji como mucho, y debajo 5–8 hashtags. Nada de párrafos ni listas de reglas.

## Comentario fijado y constancia

- Con cada descripción, da un **comentario para fijar** con una pregunta que invite a responder («¿Tú qué harías la primera hora?», «¿Te habrías subido sin tu perro?»).
- Portada: cara del protagonista grande, emoción clara, 2–3 palabras como mucho.
- Recomienda publicar siempre los mismos días y horas; con datos de Metricool, di qué horas funcionan mejor.
- Al acabar una serie, ofrece el vídeo largo en horizontal para YouTube (1920×1080, escena a la izquierda, subtítulos a la derecha, cortinillas «PARTE N», capítulos en la descripción y versión ligera de < 45 MB para que se pueda descargar desde el móvil).

## Archivos

- Vídeo final: `<WS>/entregas/<NN>_<nombre>_CON_VOZ.mp4` (lo deja `finish.py`). Envíalo con `SendUserFile` (display `attach`), igual que la portada: el usuario los descarga «como siempre».
- `finish.py` también añade el guion a `<WS>/guiones_elevenlabs.txt`.
- Numeración: sigue la del usuario (41 = Tsunami 4, 42 = Tsunami 5, 43 = La cámara, 44 = Tsunami 6…). Pregunta el número solo si no hay forma de deducirlo.

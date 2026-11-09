# Subir el nivel: lista de calidad de Archivo Raro

Repásala al escribir el guion (bloques 1, 3 y 4) y al montar (bloques 2, 5 y 6). Es lo que separa un vídeo correcto de uno que retiene.

## 1. Retención (lo que más pesa en el algoritmo)
- **Primer fotograma con acción**: algo cae, se apaga, alguien grita o una cara asustada en primer plano. Nunca un plano quieto ni un decorado vacío en el segundo 0.
- **Los 2 primeros segundos, el personaje o lo más interesante en cámara** (lo pidió el usuario): el monstruo, la amenaza o el protagonista en peligro, grande y en plano cerrado desde el fotograma 0. Nada de presentar el lugar primero; el contexto va después.
- **Nada quieto más de 2–3 s**: cada 2–3 s cambia el plano, entra un enfoque, aparece un objeto o un rótulo. En la lista de planos, marca qué pasa en cada tramo de 3 s.
- **Final en bucle** cuando se pueda: la última imagen o frase enlaza con la primera (misma imagen, misma pregunta), para que el vídeo se repita sin salto visible.

## 2. Decorados con detalles (siempre, en todas las escenas)
- **Ninguna pared vacía, nunca.** Cada decorado lleva al menos 5–6 detalles: cuadros o fotos, estante con libros y planta, reloj, calendario, póster, enchufe e interruptor, radiador, perchero, lámpara, alfombra, planta en el suelo. Interiores con `decorWall()`; exteriores con farolas, árboles, toldos, carteles, contenedores, bancos, coches aparcados, ventanas con cortinas y macetas.
- **Suelo con textura** (tarima, baldosas, asfalto con marcas), **rodapié**, **sombra en las esquinas** (`dCorner`) y **luz** (rayo de ventana, lámpara, velas).
- Los detalles cuentan la historia cuando se puede: el reloj parado a las 12:33, el calendario con el día marcado, la nevera con imanes.
- Al revisar la hoja de contacto: si hay un hueco liso de más de un tercio del plano, se rellena.

## 3. Cámara y acting
- **Enfoques (`focusCam`) en 2–4 momentos fuertes**, atados a la palabra exacta de la voz. Tipos:
  - acercamiento lento a la cara (darse cuenta de algo), 1–1,3 s;
  - detalle de una mano u objeto (radio, nota, llave, billetes): `fx,fy` en la mano;
  - golpe de zoom: el mismo `focusCam` con `k` en 0,3–0,4 s más un `boom`/`hit` seco;
  - cambio de enfoque entre dos personajes: dos `focusCam` seguidos, cambiando qué va en `fg`;
  - plano y contraplano en conversaciones tensas.
- **Expresiones exageradas** en los momentos fuertes: `eyes:'wide'`, `mouth:'o'`/`'grin'`, `brows:'up'`/`'worried'`, gotas de sudor (`sweat()`), temblor (`shake`). Lo que no se lee en el móvil no existe.
- **Grupos con `crowd()`**: misma escala y mismo suelo; caras naturales (`laugh` + ojos `happy` para reír).
- **Personajes grandes en el plano** (escala .6–.9) y **decorados con perspectiva y luz propia** (rayo de sol, velas, atardecer, fondo que se pierde a lo lejos).
- **Partículas y ambiente** en casi todas las escenas: `particles(t,'dust'|'rain'|'sparks'|'snow'|'embers',o)`. Dan vida sin distraer.

## 4. Historia (lección del tsunami: 1,3 M → 1.000 visitas)
- **Un solo tema por serie, sin desviarse.** Si el tema es el apagón, cada parte es una fase del apagón con sus reglas; la amenaza la causa el propio apagón, sin tramas de villanos ni traiciones.
- **Cada parte se entiende sola**: los primeros 3 s sitúan («Día 3 sin luz…») porque la mayoría no ha visto la anterior.
- **Cada parte necesita su propio gancho universal «Si…»**, no un «Día 3 sin luz…» que pide contexto (datos de Metricool, nov. 2026: Apagón 1 «Si mañana España se queda sin luz…» = 915 mil; Apagón 2 «Día 3 sin luz…» = 49 mil; Apagón 3 ≈ 800 «me gusta» en 9 h). Ejemplo: «Si mañana abres el grifo y no sale agua… tienes tres días». El «Día N» va en la segunda frase o en el HUD, no en el gancho.
- **El final de la parte 1 decide la serie**: el Tsunami 1 acabó en un cliffhanger con los personajes (la segunda ola) y retuvo un 31 % en la parte 2; el Apagón 1 acabó con un cierre suave y retuvo un 5 %. Cierra la parte 1 con una amenaza concreta y una pregunta.
- **Series cortas (4–5 partes)**, planificadas enteras antes de la primera, con «PARTE N» en la portada.
- **Avance en el gancho** de la parte 1 («El día 1… el día 3… el día 7…»): promete lo que viene.

## 5. Voz
- **Más energía en el gancho** (las 2 primeras frases): una etiqueta `[urgent]` o `[tense]` solo ahí; el resto, calmado. Sigue valiendo: 2–4 etiquetas por guion y nada de `[whispers]`.

## 6. Sonido
- Los efectos sintetizados se notan. Si el usuario da una carpeta de sonidos reales o música libre de derechos (`<WS>/sonidos/`), úsalos (ver `sound.md`, «Sonidos reales»). Si no la hay, ofrécelo una vez, sin insistir.
- Música con tensión que **sube en los momentos clave** (riser antes de cada enfoque fuerte) y se corta en seco en el corte a negro.

## 7. Publicación
- **Portada**: la cara del protagonista grande con una emoción clara y 2–3 palabras como mucho.
- **Comentario fijado con una pregunta** en cada vídeo («¿Tú qué harías la primera hora?»). Dáselo junto a la descripción.
- **Constancia**: mismos días y horas. Con datos de Metricool, recomienda las horas que mejor funcionan.
- Al terminar una serie, ofrece **el vídeo largo en horizontal para YouTube** con capítulos.

# Portadas buenas (póster dedicado)

**Cuándo:** el usuario pide «una buena portada», la portada de un monstruo o personaje, o el primer capítulo de una serie. El fotograma recortado de `publishing.md` vale para ir rápido. Una portada que tiene que destacar en el feed se **dibuja aparte como un póster**.

Referencia aprobada: `example/silbon1/portada_referencia.jpg` (El Silbón, parte 1). El usuario la pidió con «crea una buena portada» después de recibir la versión hecha a partir del fotograma, que era más floja.

## Plantilla

```bash
cp <WS>/portadas/poster.html <proyecto>/poster.html       # usa lib/kit/props/cast del proyecto
# edita SOLO el bloque POSTER (cielo, luna, amenaza, ojos, efecto, héroe, haz, textos)
node <WS>/portadas/shot_poster.js <proyecto>/poster.html <WS>/entregas/portada_<NN>_<nombre>_PARTE<N>.png x=silbon.js
```

- `x=` carga los archivos de personajes propios de esa serie, separados por comas.
- `P.threat` es una función que devuelve el SVG de la amenaza.
- `P.hero` usa el sistema `A()` de siempre.
- `P.effect` sirve para la seña del monstruo: notas de silbido, vaho, chispas, gotas…

## Composición que funciona

1. **La amenaza, ENORME y en contrapicado.**
   - Escala ~1,9 del personaje completo, con los pies fuera de cuadro.
   - La cabeza debe quedar a 1/4–1/3 de la altura (y ≈ 450–650): se tiene que leer en miniatura.
   - Si la cara es pequeña, la portada no funciona.
2. **Recorta la cabeza contra una luz.** Una luna gigante (r ≈ 340) o un foco detrás de la cabeza para que la silueta destaque, más un halo de color (rojo = peligro) a la altura del pecho.
3. **Ojos que brillan.** Encima del personaje, en coordenadas de pantalla:
   - un círculo de color difuminado (`glow2`, r 34);
   - un núcleo caliente `#ffe9a0` (r 12).
   - Tras el render, **haz zoom a la cara** (recorte con PIL) y comprueba que los ojos caen justo dentro de las cuencas.
4. **El protagonista, pequeño y en una esquina de abajo** (escala ~0,85, a la izquierda).
   - Expresión clara: `eyes:'wide'`, `brows:'up'`, `mouth:'o'`, sudor y mirando hacia arriba.
   - Así da escala: «el monstruo es gigante a su lado».
   - Si lo pones grande en primer plano tapa al monstruo y se cruza con sus manos (fallo de la primera versión).
5. **Una línea que une a los dos.** El haz de la linterna, una mirada o una cuerda que va del protagonista a la cara de la amenaza. Guía el ojo del espectador.
6. **La seña sonora o visual del monstruo** dibujada en el aire: las notas del silbido saliendo de él.
7. **Fondo con capas.**
   - Cielo en degradado, estrellas, siluetas del lugar (palmeras de moriche, edificios…) y niebla a la altura del suelo.
   - Viñeta, más un degradado oscuro abajo para que el texto se lea.

## Texto

- Arriba, «PARTE N» en la etiqueta amarilla del canal (mono, negro sobre `#ffd34a`). **No debe tocar el sombrero ni la cabeza**: deja al menos 60 px de aire.
- Abajo:
  - un gancho corto con brillo (`¿LO OYES?`, 2–3 palabras, amarillo);
  - el título enorme (~190 px, Inter 900, contorno oscuro de 16 px), con la palabra clave en color y brillo (`SILBÓN` en `#ff3e6c`).
- Nada más: ni subtítulos, ni HUD, ni tres frases.

## Revisión antes de enviar (míralo SIEMPRE con Read)

- [ ] ¿Se reconoce la amenaza en una miniatura de 200 px? ¿Destaca su cara?
- [ ] ¿Hay algo tapado o medio escondido? Si es así, quítalo. Al perro lo tapaba el título y se quitó.
- [ ] ¿La mano de la amenaza o algún objeto se cruza de forma rara con el protagonista?
- [ ] ¿La etiqueta «PARTE N» deja la cabeza libre?
- [ ] ¿Los ojos brillan dentro de las cuencas (zoom)?
- [ ] ¿El título se lee y no corta nada importante?

Entrega:
- Envíala con `SendUserFile` (display `render`).
- Describe en 3–4 viñetas qué tiene.
- Ofrece una variante: primer plano solo de la cara, u otro gancho.


## Portada en ESTILO 3D (póster renderizado con el mundo del vídeo) — 62 vacas, 12-11-2026

- Página propia: copia `index.html` del proyecto a `cover.html`, añade `<svg id="ttl">` encima y un `coverNN.js` con `window.renderCover(o)` que usa las mismas piezas del vídeo (`setup`, `who`, `cow`, `landing`, `bigFly`, `stars`, `byDist`). Captura con `shot_cover.js out.png '{parámetros}'` (ver `archivoraro_archivo/proyectos/62_vacas/`).
- **En vertical, cámara ALTA mirando hacia abajo**: lo lejano queda más arriba, así se apilan tres cosas sin taparse (vaca negra llena de moscas arriba, vaca cebra en medio a la izquierda, protagonista a la derecha). Posiciones propias de la portada, no las de las escenas.
- Itera con 2 variantes por render y míralas lado a lado; comprueba también a 200 px de ancho.
- Fallos que salieron: cámara demasiado cerca (la vaca tapaba todo), protagonista cortado en el borde, brocha metida en el ojo de la vaca (que toque el cuerpo o una pata), mosca cortada en el borde, vaca del fondo tapada por la cabeza del protagonista.
- Texto: gancho amarillo corto («SE RIERON DE ÉL…») + título de dos líneas (~200 px, Inter 900, contorno oscuro); la palabra clave con relleno temático (CEBRA con rayas finas: franjas negras de ~25 % para que se lea). Degradado oscuro abajo.

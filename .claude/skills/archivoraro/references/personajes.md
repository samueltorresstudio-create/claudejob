# Personajes detallados (monstruos, criaturas, protagonistas especiales)

**Cuándo:** la historia tiene un personaje que **es** el vídeo (el Silbón, la Llorona, un monstruo, una criatura) y los personajes redondos de `cast.js` se quedan cortos. Referencia aprobada:
- `example/silbon1/silbon.js` (`silbonHD`);
- `example/silbon1/personaje_referencia.jpg`.

Al primer intento («diseño B») el usuario lo llamó «muy malo: el saco está muy mal, la ropa igual y la cara también». El aprobado es el que sigue estas reglas.

## Proceso

1. **3 bocetos rápidos** (A/B/C) en una sola lámina con ideas distintas: silueta, ropa, cara. El usuario elige.
2. Sobre el elegido, haz una **versión HD** en un archivo propio (`<nombre>.js`) con su función `<nombre>HD(x, pieY, s, t, o)`:
   - coordenadas locales con los pies en y=0 y la cabeza en negativo;
   - ids únicos por instancia (`sbId`) para poder dibujar varios a la vez.
3. Enséñale un **plano entero y un primer plano de la cara** (`hd_FULL.png`, `hd_CLOSE.png`) antes de montar el vídeo.
4. Añádelo al proyecto con `cat props.js props2.js cast.js <nombre>.js scenes_p.js > scenes.js`.

## Qué lo hace «detallado» y no «muy malo»

- **Silueta exagerada y reconocible.** El Silbón mide 1.080 unidades, frente a las ~700 de un humano del canal: muy alto y muy flaco, con extremidades largas, cabeza pequeña con un sombrero ancho y un saco enorme a la espalda. Tiene que leerse incluso en negro.
- **Volumen en todo, nada plano.**
  - Cada pieza lleva un degradado de claro a medio a oscuro (`sbGrad`). La luz viene de un lado fijo: claro a la izquierda, sombra a la derecha.
  - Extremidades con forma: cónicas y algo abombadas (`sbLimb`).
  - Articulaciones marcadas, con rodillas y codos huesudos (`sbJoint`).
  - Un **reflejo de luz de luna** fino en el borde iluminado.
  - Sombra propia: el ala del sombrero sobre la cara, el lado del torso en sombra y las cuencas oscuras.
- **Contorno de tinta** `#16131b` de 5 px en todas las piezas, igual que el resto del canal, con uniones redondeadas.
- **Texturas con `<pattern>`, no colores lisos.**
  - Arpillera para el saco: cuadrícula de hilos claros y oscuros girada 10°.
  - Paja trenzada para el sombrero.
  - Encima, sombreado radial para dar volumen.
- **Ropa con historia.**
  - Bordes rotos en zigzag (no rectos), parches cosidos con puntadas y desgarros.
  - Un cinturón de cuerda con nudo; una correa cruzada del hombro a la cadera que sujeta el saco.
- **Cara pensada como la del personaje, no como un emoji.**
  - Cráneo ancho, mejillas hundidas, arco de las cejas, cuencas profundas.
  - Pupilas que brillan (degradado radial), nariz de calavera y sonrisa sin labios con dientes separados.
  - Mechones de pelo lacio que caen por delante.
  - En el Silbón, el saco se cerró con la **calavera del padre asomando** y un hueso largo.
- **Objetos que cuentan la leyenda**: el saco de huesos y el sombrero de llanero. Si la leyenda dice algo del aspecto, tiene que verse.
- **Manos y pies trabajados.** Dedos largos con falanges y curvatura (`sbHand(w, ang, g, len, curl)`), pulgar separado, pies descalzos con dedos.

## Opciones para la actuación (pásalas en `o`)

| opción | efecto |
|---|---|
| `glow` | brillo de los ojos |
| `grin` | sonrisa |
| `lean` | inclinación |
| `fade` | aparecer o desaparecer |
| `dir` | hacia dónde mira (1/-1) |
| `hatTilt` | inclinación del sombrero |
| `walk` | fase de paso (reservada para animar el caminar) |

- Con poco movimiento basta: un balanceo lento (`Math.sin(t*1.1)`) para que nunca esté quieto.
- Las escenas cambian estas opciones según la tensión: ojos que se encienden en el susto, sonrisa en la revelación.

## Errores ya vistos

- **Accesorios fuera del grupo de la cabeza.** El sombrero estaba fuera del grupo de la cabeza y quedaba desplazado al inclinarse.
  - Todo lo que va pegado a una parte (sombrero, pelo, calavera del saco) se dibuja **dentro del grupo y la transformación de esa parte**.
  - Ejemplo: `sbHat(...)` dentro del torso/cabeza.
- **Plantillas de texto anidadas** en el SVG de la cabeza rompían el código: construye las piezas en variables por separado.
- **Mezclar estilos.** El personaje especial convive con los personajes redondos del canal, así que usa la misma tinta y el mismo grosor de línea. Gana en detalle, no cambia de estilo.
- **Colores.** Para variar un animal o personaje existente (Canelo = el doberman en color canela), recolorea su paleta un momento y luego restáurala:
  - `const k={...DOB}; Object.assign(DOB,{body:…}); …; Object.assign(DOB,k)`.
  - Es mejor que dibujar uno nuevo de cero.

## Revisión

- [ ] ¿Se reconoce en silueta?
- [ ] ¿Tiene volumen?
- [ ] ¿Hay alguna pieza flotando o desplazada? Mira el `hd_CLOSE.png`.
- [ ] ¿Cada accesorio sigue a su parte en todas las poses de las escenas? Mira `final_sheet.png`.

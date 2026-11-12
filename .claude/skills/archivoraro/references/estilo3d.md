# ESTILO 3D: el estilo por defecto del canal desde noviembre de 2026

**Cuándo:** todos los vídeos nuevos, salvo que el usuario pida otra cosa. Los sucesos reales de una parte siguen usando `sucesos.md`. El motor SVG antiguo (`engine/`) queda solo para retocar vídeos o series que ya estaban hechos con él.

**Qué es:**
- Un **mundo en 3D** hecho con three.js dentro del propio render: decorados, objetos, luz y cámara.
- Encima, **personajes 2D muy simples**: cabeza redonda blanca, cuerpo en forma de judía, brazos y piernas de palo.

El usuario lo eligió a partir de dos vídeos de referencia («este estilo me encanta muchísimo, es todo 3D menos los personajes»). **Úsalos solo como base del estilo, nunca copies sus personajes ni sus diseños.** Los nuestros llevan el sello del canal: logo «AR», el 7, etc.

Referencias aprobadas:
- `example/gravedad_3d/personajes.jpg` (Dani e Iker, de día y de noche);
- `example/gravedad_3d/peinados.jpg`;
- `example/gravedad_3d/scenes_p.js` (escena completa de ejemplo).

## Motor

```bash
bash <skill>/scripts/new_3d.sh "$WS" 57_nombre        # copia engine_3d/
# script.json igual que siempre (sc, say, cap con |y |p |b |g, pause, cut). Sin hud: este estilo no lleva HUD.
python3 -I ../tools/sync_voice.py . voz.mp3 && python3 -I ../tools/check_sync.py .
cp scenes_p.js scenes.js                               # aquí no hace falta concatenar props/cast
node render.js preview 1,4,8,…                         # revisión (≈1–2 s por fotograma)
node render.js full 4 → audio.py --voice → finish.py   # igual que siempre (sin GRAIN)
```

| archivo | qué hace |
|---|---|
| `world3d.js` (`W2`) | Mundo 3D: cancha urbana con edificios de ladrillo y ventanas, valla, bancos, farolas, árboles, nubes, balón y objetos que flotan. |
| `stick.js` | Personajes 2D: `stick(o)` y `stickAt(o, pies, cabeza, W2, {blur, light})`. |
| `hair.js` | Peinados: `hair2: 'tupe' \| 'messy' \| 'side' \| 'curly' \| 'capHair'`. |
| `core3d.js` | Línea de tiempo según la voz, subtítulo de una palabra, destello en cada corte, viñeta y corte a negro. |
| `util3d.js` | Ayudas: `V3`, `L3`, `P`, `prog`, `eOut`, `motes`, `ring`, `puff`, `burstLines`. |

### Detalle de `world3d.js`

- **Técnica:** materiales con textura pintada en canvas, sol con sombras suaves, niebla, brillo (*bloom*) y desenfoque de fondo (`BokehPass`).
- **Contorno negro en el 3D:** casco invertido con grosor constante en pantalla (`inkM`).
- **Noche:** `setNight(true)` enciende ventanas y neones, pone luces de colores, cielo con estrellas y más brillo.
- **Detalle v2 (nov. 2026, pedido «escenarios más detallados»):** mural de grafiti «ARCHIVO RARO» en la fachada del fondo, carteles en la valla (torneo 3x3, fiesta del barrio, se busca perro, no balón de noche), letrero «PISTA MUNICIPAL», marcador 21-19 con reloj, fuente, papeleras con bolsa, conos, carro de balones, bici apoyada en la valla, monopatín, mochila en el banco, chaqueta en la valla, charcos que reflejan, alcantarilla, rayuela y sol de tiza, hojas secas en las esquinas, palomas, aires acondicionados, tendederos con ropa, antenas parabólicas, tiendas en el bajo con toldo y rótulo (BAR PACO, FRUTERÍA, KIOSCO), coche amarillo aparcado y máquina de bebidas. Hoja: `archivoraro_archivo/proyectos/escenarios_detalle/cancha_detalle.jpg`. **No pongas escaleras de incendios con cajas finas: el contorno negro (`inkM`) las convierte en bloques negros.** Cada sitio nuevo (`world_*.js`) debe llevar este nivel de relleno.
- **API:** `setCam(pos, look, fov, distFoco, apertura)`, `render()`, `proj(punto)` (punto 3D → pantalla, con `ppm` = píxeles por metro), `floaters(g)`, `setNet(t, lift)`, `BALL`.
- **Otros sitios:** para una historia en otro lugar (casa, colegio, cárcel, bosque…), crea su `world3d_<sitio>.js` con el mismo patrón:
  - textura pintada, objetos con volumen, paleta de color propia;
  - **llénalo de cosas:** carteles, estanterías, plantas, cuadros, lámparas.
- Guarda cada sitio en `engine_3d/` para reutilizarlo.

### Cada escena

1. Mueve el mundo (objetos, balón, flotantes).
2. Coloca la cámara: `W2.setCam(...)`.
3. Llama a `W2.render()`.
4. Devuelve el SVG de los personajes y los efectos.

Detalles:
- **Personajes:** se anclan con dos puntos 3D, los pies y el centro de la cabeza. `stickAt` calcula escala, giro y sombra en el suelo según el sol.
- **Orden:** dibuja primero el que está más lejos (`W2.proj(p).d`).
- **Desenfoque:** a los personajes fuera de foco pásales `{blur: 4–8}`.

## Personajes (lo que el usuario pidió, punto por punto)

Feedback que llevó a este diseño:
- Al primer intento le dije «personajes 3D». Respuesta: «no me gustan nada».
- A los cabezones 3D: «muy infantil, no lo hagas tan bebé».
- A las cabezas deformes: «quiero que sea redonda la cabeza».
- A la ropa con costuras: «están fatal».

Por eso:
- **Cabeza: un círculo perfecto blanco** con contorno grueso (`#1b1720`, ~10) y un sombreado suave en el lado de la sombra. Sin orejas y sin nariz.
- **Caras: pocas y muy claras**, las mismas que la referencia. Opciones en `face` y `mouth`:

  | expresión | `face` + `mouth` |
  |---|---|
  | chulo / normal (párpado pesado, medio disco negro) | `smug` + `smirk` |
  | neutro | `open` |
  | susto | `wide` (ojo redondo blanco con pupila de punto) + `grin` (dientes en rejilla) u `o` |
  | dormido | `closed` |
  | risa | `happy` + `laugh` |
  | grito | `open` |
  | enfado | `angry` |

  - Cejas gruesas cortas: `brows` (−1..1) y `browTilt`.
  - Gota de sudor: `sweat`.
  - Mirada: `look:[dx,dy]`.
- **Cuerpo = la prenda.** La judía entera es del color de la ropa, con volumen (degradado claro arriba a la izquierda, oscuro abajo a la derecha). Brazos y piernas son palos curvos (`armL/armR:[hombro,codo]`, `legL/legR:[cadera,rodilla]`, en grados). Las manos son óvalos negros.
- **Ropa: solo 2–3 detalles gruesos que se lean al instante**, nunca costuras ni bolsillos pequeños:
  - `outfit:'tee'`: cuello, `number`, y `strap` (correa cruzada con hebilla).
  - `outfit:'hood'`: capucha al cuello, cordones, bolsillo y bajo de canalé.
  - `outfit:'military'`: camuflaje, bolsillos con tapa, cinturón, cinta con el nombre (`nameTape`), pasadores (`medals`). Se combina con `hat:'helmet'` y `hair2:'buzz'`.
  - `outfit:'chef'`: chaquetilla cruzada con botones, pañuelo rojo y delantal (`apron`). Se combina con `hat:'toque'` y `prop:'pan'|'spoon'`.
  - `outfit:'cardigan'`: chaqueta de punto abierta con botones y bolsillos, camisa con cuello (`shirt`). Se combina con `hair2:'bald'`, `glasses`, `mustache`, `browCol` (cejas blancas), `wrinkles`, `cane`, `lean:4`.
  - Otros complementos: `hat:'beret'`.
  - `outfit:'cleaner'` (limpiadora, nov. 2026): uniforme de color con cuello blanco redondo, botones, delantal blanco con cinta rosa y bolsillo, cinta con el nombre (`nameTape`), bayeta opcional (`rag`). Se combina con `hat:'kerchief'` (pañuelo de lunares con lazo, `hatCol`), `gloves:'#ffd34a'` (manos con guantes de color) y `prop:'mop'` (fregona).
  - `outfit:'king'` (rey): manto rojo abierto con borde de armiño, jubón dorado, banda cruzada (`sash`), medalla y cinturón de oro con gema. Se combina con `cape` (capa por detrás con armiño abajo), `hat:'crown'` (corona con gemas), `beard` + `mustache` + `browCol` blancos y `prop:'scepter'`.
  - **Mezcla con el «estilo palo v1»** (prueba, 11-11-2026): `rich:true` añade el detalle extra de aquellos bocetos sin perder la cabeza redonda ni las caras: militar con cartucheras, tirantes, gafas en el casco y `prop:'radio'`; limpiadora con volante y spray en el delantal; rey con cuello de armiño y cruz en la corona. Más: `legLen:1.18` (piernas más largas, sube la cabeza a 1,84 m en `stickAt`), `bun` (moño detrás del pañuelo, color), `earrings` (pendientes). Hoja: `archivoraro_archivo/proyectos/bocetos_mezcla/mezcla.jpg`.
  - `eyeStyle:'palo'`: ojos del palo v1 (párpado largo y ojo en D pequeño debajo; susto con ojo blanco más grande). Pedido por el usuario para la mezcla: «deja los ojos de palo 1». Hoja: `bocetos_mezcla/mezcla2.jpg`.
  - Ejemplo de los tres (militar, limpiadora, rey) en `archivoraro_archivo/proyectos/bocetos_militar_limpiadora_rey/sheet.jpg`.
  - Ejemplo de los tres en `example/gravedad_3d/oficios.jpg`.
  - **Nuevas prendas, con el mismo criterio:**
    - cuello en V con camisa y corbata para oficinistas y jefes;
    - chaleco con pajarita;
    - uniforme con placa y gorra;
    - fajín cruzado para reyes y emperadores;
    - rayas horizontales para marineros;
    - armadura con placas;
    - correa de cámara o bolso.
  - Complementos que dicen quién es: corona, gorra con logo, gafas redondas, bigote, llaves, cámara.
- **Pelo (`hair.js`): mechones con forma.**
  - Lleva volumen detrás de la cabeza, 3–4 líneas de mechón, un brillo y una sombrita del flequillo en la frente.
  - **Ningún flequillo puede tapar las cejas.**
  - Cada personaje con un peinado distinto, para que se distinga por la silueta.
- **Siluetas distintas:** `belly` (más ancho) y alturas distintas. Los niños se hacen con menos altura entre pies y cabeza en `stickAt`.
- **Luz del sitio sobre el personaje** (lo que más se notó en la referencia):
  - Se activa con `W2.charLight = {tint, k, rim, rimA, rimX, rimY}`.
  - De día: `{tint:'#ffe2bd', k:.14, rim:'#fff6e6', rimA:.5}`.
  - De noche con neón: `{tint:'#8f80ff', k:.38, rim:'#ff5ad0', rimA:.85}`.
  - El brillo de contorno queda **por dentro** de la línea negra; si se sale, emborrona el contorno.
- **Personajes fijos:**
  - **Dani:** camiseta naranja con el 7, correa azul marino, tupé, deportivas con suela roja.
  - **Iker:** sudadera verde con capucha, gorra azul «AR», más ancho.
  - Defínelos al principio del `scenes_p.js` (ver ejemplo).

## Mundo, cámara y montaje (de las referencias)

- **Escenarios llenos de objetos.** Un color de acento por historia (rosa en la cárcel, rojo en el cañón, neón de noche).
- **Cortes cada 1–2 s y cámara siempre en movimiento:**
  - picados, contrapicados, cenitales y planos subjetivos;
  - por encima del hombro;
  - **primerísimos planos de objetos** (el botón, el rasca, la tarjeta, la bala).
- **Efectos 2D encima del 3D:** astillas, grietas, humo (`puff`), ondas (`ring`), líneas rojas de tensión (`burstLines`), destello, polvo en la luz (`motes`) y desenfoque de movimiento en los vuelos rápidos.
- **Subtítulos:** **una sola palabra** en el centro (y ≈ 880), blanca, gruesa, con borde oscuro y un pequeño salto al aparecer. Las palabras clave van en color con `|y |p |b |g`. Sin HUD ni lista de reglas: si hace falta un dato, va como objeto o cartel dentro del 3D.
- **Primer fotograma con acción y el personaje en cámara** (nivel.md §1, sigue valiendo).

## Velocidad (medida en esta máquina, sin tarjeta gráfica)

| configuración | por fotograma |
|---|---|
| con oclusión ambiental (GTAO) | 3,2 s, demasiado lento |
| **por defecto: sin GTAO, con desenfoque y brillo** | **≈1,1–1,8 s → render de 87 s en ~50–70 min con 4 procesos** |

Si el usuario pregunta cuánto tarda:
- 2–3 h por vídeo cuando hay que construir un sitio nuevo;
- 1,5–2 h si el sitio ya existe.

## Proceso con el usuario

- Personajes o sitio nuevos: **enséñale fotos primero** (hoja de personajes o un par de planos) antes de renderizar vídeo. Si pide fotos, **no hagas vídeo**.
- Antes de enviar, revisa la hoja de fotogramas con lupa:
  - que no haya objetos fuera de sitio (el error del coche dentro de la cancha);
  - personajes cortados, cámaras dentro de objetos;
  - rótulos o subtítulos tapando caras.

## Sitios y animales ya hechos

- `world_rio.js`: el **río Magdalena** con la misma API que `W2`.
  - Incluye: agua animada con brillos y espuma en la orilla, orillas de barro y hierba, selva, palmeras, ceibas, palafitos de colores, muelle, canoas (`W2.HERO`, `W2.canoe()`), jacintos de agua, garzas y montañas.
  - Más funciones: `setTime(t)` anima el agua, `mid(z)` da el centro del río, `RW` es su semianchura y `hgt(x,z)` la altura del terreno.
- `hippo.js`:
  - `hippo2(o)`: hipopótamo de frente. Estilos `'A'` (simpático) y `'B'` (salvaje); opciones `open`, `turn`, `look`, `ear`, `wet`, `blink`.
  - `hippoAt(o, pies, cabeza, W2, {water: y})`: lo ancla en el 3D y lo recorta por la línea del agua, con ondas.
- `stick.js`:
  - Nuevas opciones: `hat:'vueltiao'`, `outfit:'shirt'` (camisa con pañuelo `scarf`), `bag` (carriel cruzado), `prop:'paddle'`.
  - Ciclo de paso fluido: `walkPose(fase)` con `lift`, `bob` y `lean`. Opciones `turn` (−1..1, tres cuartos) y `view:'back'`.

## Ejemplo completo: `example/hipopotamos_3d/` (curiosidad real, nov. 2026)

Primer vídeo con la **fórmula viral** de `ideas.md` y el río 3D. Sirve de plantilla para el resto de curiosidades:
- un plano por frase;
- los cuatro hipopótamos que andan;
- multitud en el agua (`crowd`) y contador animado;
- tarjeta 2D comparativa (ÁFRICA → COLOMBIA, con tachones);
- canoa con `hullFront`;
- bostezo con salpicadura;
- sello «ESPECIE INVASORA»;
- final en bucle con el «4».

Música: cumbia ligera, no suspense (este formato es «curiosidad divertida»).

### Encuadre en vertical (errores que hubo que corregir en la revisión)

- En vertical, el ancho visible es pequeño: a 10 m con fov 40 solo caben unos 4 m. **Grupos de personajes: sepáralos en profundidad Y de lado**, o se apilan uno encima de otro.
- Los objetos altos (portón de 6 m) piden la cámara a 17–18 m y mirando a mitad de altura.
- Las vistas aéreas empinadas aplastan a los personajes 2D. Usa una cámara baja (2–4 m) y mirada casi horizontal.
- **Quita la vegetación flotante, árboles o casas que queden delante de la cámara**: un jacinto gigante en primer plano estropea el plano.
- Cámara en un primer plano sobre el agua: siempre por encima de la superficie (y ≥ 0,8), mirando hacia abajo.
- Si un elemento 3D queda raro (la avioneta del portón), **quítalo antes que dejarlo mal**.

## Palomas, laboratorio y misil (vídeo 64, nov. 2026)

- `pigeon.js`: `pigeon(o)` paloma de perfil (gris, cuello irisado, ojo naranja con párpado pesado). Opciones `peck` (picotear), `bob` (cabeceo), `walk`, `flap` (ala), `eye` ('calm'|'wide'|'closed'|'angry'), `goggles` (gafas de piloto). `pigeonAt(o, pies, cimaCabeza, W2, {shadow, blur})`; `o.flip` la gira. Altura real ≈ 0,3 m.
- `stick.js`: `outfit:'labcoat'` (bata blanca con solapas, camisa y corbata, bolis en el bolsillo, faldón largo) y `outfit:'suit'` (traje con pañuelo en el bolsillo).
- `world_palomas.js`: varias zonas en una escena: laboratorio de 1943 (palomares `W2.PIGEONHOLES`, caja de entrenamiento `TRAIN`, morro del misil `NOSE_LAB`, pizarra, sacos de ALPISTE, cajas U.S. ARMY), interior del morro (`NX`, 3 puestos con pantalla; `W2.setScreen(x, hit)` mueve el barco), sala del comité (`MX`), escenario del premio (`SX`, `TROPHY`) y mar con buque de guerra y misil (`SEAX`, `SHIP`, `MISSILE`).
- **`W2.visible(p)`** (raycast): no dibujes un personaje 2D si un objeto 3D lo tapa (las palomas de los palomares salían pintadas encima del morro). Comprueba varios puntos (patas, cabeza, lados).
- **Personajes detrás de una mesa:** recórtalos con un `clipPath` a la altura del borde de la mesa (`W2.proj(borde).y`), o las piernas salen pintadas encima del tablero.
- La cámara siempre **dentro** de la sala (una cámara fuera de la pared enseñaba un plano marrón gigante).

### Calidad «como la referencia» (el usuario: «muy normalitos, mejóralos mucho», nov. 2026)

Lo que separa un escenario normalito de uno como la referencia (aplicado en `world_palomas.js` v2, úsalo de plantilla):
- **Texturas pintadas a mano en canvas, nunca colores planos:** `planksT()` (tablas con degradado por tabla, vetas, nudos, clavos, juntas oscuras), `wallT()` (papel pintado con motivo y suciedad abajo), `panelT()` (zócalo de paneles con biselado), `paper()` (carteles y papeles envejecidos) y `grain()` (ruido).
- **Sol de verdad entrando por ventanas con hueco:** las paredes y los parteluces proyectan sombra y dejan manchas de luz en el suelo. Añade haces de luz aditivos y degradados.
- **Fondo pintado tras las ventanas** (ciudad, nubes, árboles), nunca un plano azul liso.
- **Color saturado:** `GLC.style.filter = 'saturate(1.18) contrast(1.06)'`, más exposición y luz de relleno dentro.
- **Llénalo:** alfombra, carteles con dibujo, corcho con papeles e hilo rojo, archivador, estanterías con libros de colores, tarros, radio, máquina de escribir, ventilador, tuberías, plumas y alpiste en el suelo, macetas.
- **El latón sin mapa de entorno sale negro:** metalness bajo (.3) y un poco de emisivo.
- **Un interior cerrado (morro, cabina) necesita tapas:** si queda un extremo abierto se ve el cielo.
- **Cámara:** angular (fov 55–60), baja y cerca del personaje, con un objeto grande en el plano.

### Velocidad con el mundo «de calidad» (medido en el vídeo 64)

- **Coste por fotograma:** unos 0,7 s la escena sola, 1,8 s el AO a resolución completa, 1 s el desenfoque y 0,7 s el brillo. La captura con el SVG de los personajes suma de 1,5 a 2,5 s.
- **AO a media resolución** (`ao.setSize(W/2, H/2)`): casi igual y 1,6 s menos.
- **Nada de filtros CSS en el `<canvas>`:** encarecen cada captura. La saturación va en el shader de gradación.
- **Luces puntuales por zona:** `userData.zone` y encender solo las de la zona de la cámara.
- **Resultado:** unos 4 s por fotograma con 4 páginas, unas 2 h para 60 s.
- **No lances `audio.py` mientras se renderiza:** con la CPU ocupada pasa de 50 s a más de 15 min.
- **Transición `swish`** (barrido sin mover la cámara) para pasar entre zonas distintas del mundo, así la cámara no atraviesa paredes.

### Transiciones: lecciones del vídeo de las palomas (revisión fotograma a fotograma)
- `push`/`fly` entre dos planos del MISMO cuarto pueden atravesar a un personaje 2D (se dibuja gigante) o un objeto grande (el misil): si entre las dos cámaras hay algo, usa `swish`.
- `swish` gira la cámara sin moverla, así que el cuarto de destino tiene que estar CERRADO por todos los lados (paredes, techo, pared trasera). Si no, durante el barrido se ve el cielo. El escenario del premio necesitó telón lateral + techo + paredes oscuras.
- Revisión obligatoria: tira de fotogramas cada 3 alrededor de cada cambio de escena (de −12 a +12) antes de codificar.

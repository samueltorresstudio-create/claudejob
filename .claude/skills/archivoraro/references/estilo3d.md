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

### Prohibido (feedback 12-11-2026)
- **Ni un recuadro de texto arriba** (fechas, nombres, «U.S. ARMY», «COMITÉ CIENTÍFICO»…). Solo subtítulo.
- Aspecto «plastilina»: objetos lisos de un color sin textura ni detalles (paneles, remaches, letras, desgaste), sombreado blando por todas partes, DOF y bloom fuertes, tono naranja general. Mira `archivoraro_archivo/referencias/ref3d_*` antes de diseñar: nitidez, textura pintada, luz de día, colores variados y planos medios.
- Detalles incoherentes (p. ej., bandera de España en un uniforme de EE. UU.): revisa cada insignia y cada cartel.

### Cómo se mueven los personajes (referencia «naranjas heladas», analizada fotograma a fotograma; hojas en `archivoraro_archivo/referencias/ref_naranjas_*`)
El usuario dijo que en las palomas «se mueven mal». En la referencia:
1. **Pies clavados al suelo.** Nunca se deslizan ni flotan, y nunca andan sin una animación de paso de verdad. Si un personaje cambia de sitio, es por un corte de plano, no por arrastrarlo.
2. **Una acción concreta por plano, ligada a lo que se dice**: echa agua con una lata, clava agujeros con un martillo (golpe rápido y repetido), cuelga latas en el árbol, carga un cubo agachado, rompe el hielo de una naranja. Nada de gestos genéricos (brazos que ondean, saludos, botes).
3. **Objetos de verdad en la mano** (lata, martillo, cubo, naranja), con un tamaño coherente y que interactúan con el escenario (el agua cae sobre las naranjas, la lata está en el tocón).
4. **De pose a pose**: pose fija y, en la palabra clave, cambio rápido (2–4 fotogramas) a otra pose, que se mantiene. En medio solo hay respiración o un balanceo muy sutil del cuerpo (±1–2°). Nada de rebotes constantes.
5. **Pose de esfuerzo**: rodillas dobladas, cuerpo inclinado y cara apretada (ojos «> <», dientes). Para hablar: boca abierta en las frases entre comillas («¡oye, la helada!»).
6. **Tamaño**: plano medio o de cuerpo entero (el personaje ocupa del 40 al 60 % del alto), dentro del escenario. Primer plano solo para una reacción. Muchos planos **sin personaje**: el objeto que importa (termómetro, naranja helada, reloj) con un acercamiento lento de la cámara.
7. **Cámara**: acercamiento o deriva lenta y constante en cada plano. Entre planos, barrido o vuelo largo con desenfoque.
8. **Aspecto del mundo**: low-poly estilizado, pero con **textura pintada a pinceladas** en todo (suelo, troncos, arbustos con trazos). Paleta de un solo ambiente por tramo (noche azul y violeta → amanecer rosa), luz cálida puntual (hogueras, farol). Por eso no parece plastilina.
9. Subtítulos de la referencia: 1–2 palabras, en minúscula, blanco con contorno negro, a media altura (los nuestros van en mayúscula y en color: no cambiar sin preguntar).

## Granja japonesa y vacas (62 · Las vacas cebra, nov. 2026)
- `world_kenji.js`: granja de vacas japonesa en verano (corral de tierra con huellas y paja, valla de madera con portón, establo abierto con tejado de chapa, casa japonesa con tejado de tejas y veranda, casa del vecino, balas envueltas en blanco, sacos de pienso, abrevadero, carretilla, rincón de pintura con cubos blanco y negro y brochas, camioneta kei, tractor naranja, carretera con postes y cables, máquina expendedora, buzón rojo, cartel «けんじ牧場», caquis, girasoles, arrozales con agua y montes con cedros). Corral x ∈ [-11, 11], z ∈ [-15, -1]; valla delantera en z = -1. `W2.PAINT` = rincón de pintura.
- `cow2d.js`: `cow2(o)` vaca 2D de perfil con la cabeza mirando a cámara (`stripes:'white'|'black'`, `paintTo` para pintarla a medias, `wet`, `eyes`, `mouth`, `chew`, `tail`, `twitch`, `tag`, `grass`); `cowAt(o, pies, W2, {face:'left'})`; `flySwarm(x, y, escala, n, t, {land, miss, big})` para moscas posadas o que se pasan de largo.
- `stick.js` nuevo: `hat:'tenugui'` (pañuelo japonés en la frente), `boots` (botas de agua), `prop:'brush'` + `paint` + `brushRot`, `splat` (manchas de pintura en la ropa), `noArms` (para dibujar brazos apoyados en una valla por encima de las barras).
- **Personajes detrás de una valla:** el 2D siempre queda encima del 3D. Dibuja después las barras en 2D (`rails2d` en `proyectos/62_vacas_cebra_bocetos/sheet.html`) y, si se apoya, los antebrazos encima (`leanArms`).
- Vertical: una vaca entera (≈2,3 m) necesita la cámara a ≈6,5 m con fov 46.

### Flechas en pantalla (el usuario: «hazlas bien bien, no mal puestas ni mal»)
- Usa la función `arrow(A, C, B, k, col, w)` de `archivoraro_archivo/proyectos/64_palomas/scenes_p.js`: curva suave, contorno de tinta y punta alineada con la tangente final. El trazo se dibuja en 0,3–0,4 s.
- **Siempre ancladas al objeto**: calcula A, C y B proyectando puntos 3D del objeto (`W.proj`). Nunca uses coordenadas fijas de pantalla. Si el objeto se mueve, la flecha se mueve con él.
- La punta indica exactamente la dirección real: «se va a la izquierda» es una flecha encima del barco, dentro de la pantalla, que apunta a la izquierda. «El misil gira» es una flecha que sale del morro hacia delante y se curva hacia su lado.
- Tamaño proporcional al objeto (grosor ≈ 1,5–3 % de su tamaño en píxeles). Nunca puede salirse del objeto que la contiene ni del encuadre. Compruébala en una foto de prueba antes del render.
### Movimiento con IK y acciones de verdad (vídeo 62, nov. 2026)
- `armIK(sd, objetivo, {brush, brushScale, brushRot, bob})` en `proyectos/62_vacas/scenes_p.js`: resuelve el brazo (2 segmentos 90/86) para que la mano o la punta de la brocha llegue EXACTAMENTE a un punto. `frameOf/toScr/toLoc` repiten las transformaciones de `stickAt`/`cowAt` para pasar de coordenadas del personaje o de la vaca a pantalla y al revés.
- `paintAction(...)`: la brocha baja por la raya y la raya fresca (`cow2({fresh})`) nace justo donde pasa la punta. Así nunca hay brocha «pintando en el aire».
- Un objeto que la mano tiene que tocar por dentro (cubo): dibújalo en 2D en dos capas (fondo + pintura, personaje, pared delantera) con `bucketBack/bucketFront`.
- Los brazos van DETRÁS del cuerpo en `stick()`: si el objetivo queda detrás del propio personaje en pantalla, la mano no se ve. Coloca al personaje al lado de lo que toca, no delante.
- Cámara mirando hacia +z: la derecha de la pantalla es −x del mundo. Comprueba con el producto vectorial en qué lado cae cada personaje antes de encuadrar.
- Transiciones: `push` entre planos que miran en sentidos opuestos barre el cielo; usa `swish`. `push` hacia una cara en primer plano la atraviesa; usa `swish`.
- Mañana: un cielo con mucho degradado rosa se rompe en bandas (8 bits); suaviza colores, iguala la niebla al horizonte y sube un poco el grano.
- Velocidad medida: ≈2,9 s por fotograma con 4 páginas cuando hay cientos de moscas 2D (cada mosca es un grupo SVG). 73 s de vídeo ≈ 1 h 45 min.

### Ritmo de cámara pedido por el usuario (12-11-2026)
- «La transición de cámara un poco más lenta y no tan de golpe»: `CFG.transDur: .95`, `CFG.blurK: .55` (menos desenfoque), `CFG.antic: .3` (anticipación más larga). Son los valores por defecto a partir de ahora.
- «Que la cámara nunca esté quieta, aunque se mueva un poco»: deriva tipo cámara en mano sobre `W2.setCam` (seno lento, ±5 cm de posición, 35 % en el punto de mira), además del movimiento de cada plano. Ver el bloque «cámara nunca quieta» de `proyectos/62_vacas/scenes_p.js`.
- «Cuando hay un movimiento de cámara, que el texto no se vea borroso»: el desenfoque de las transiciones se aplica SOLO a `#gl` (3D) y `#fx` (personajes), nunca a `#cap`. El subtítulo siempre nítido (ya está así en `core3d.js`). Para corregir un vídeo ya renderizado sin repetirlo entero: `FRAMES=lista.json node render.js full 4` re-renderiza solo esos fotogramas (calcula la lista replicando la lógica de transición + anticipación de `core3d.js`, como en `proyectos/62_vacas/blurlist.js`).

### Acercamiento a un objeto en la mano (contador, cartel…)
- Si la cámara se acerca a algo que lleva un personaje, la CARA debe seguir dentro del plano: encuadra cara + objeto (vacas 62: el primer intento cortaba la cabeza de Kenji en el 0056). Revisa ese plano con los tiempos de la voz real, porque al cambiar la duración de la escena el zoom puede durar más.

### Nunca un plano vacío al final de una escena
- Si el protagonista sale de cuadro (la mosca que «se pasa de largo»), que siga visible alejándose hasta el final de la escena. Con la voz real las escenas duran distinto que con la voz falsa: el hueco sin nada (solo valla y cielo) puede alargarse a casi 1 s. Revisa siempre el último segundo de cada escena tras sincronizar la voz.

### Personajes que HABLAN en pantalla (correcciones del usuario, 62 vacas)
- **Boca sincronizada con la voz real**: `python3 -I ../tools/mk_venv.py` (desde el proyecto, después de `sync_voice.py`) crea `venv.js` (envolvente de `narration.wav` por fotograma, normalizada en local para que las frases dichas bajito también abran la boca). Cárgalo en `index.html` después de `voice.js` y usa `mouthV(window.__T)` → 'open' / 'o' / 'line' (y la boca de reposo en silencio). Nunca un `talk()` con seno fijo: no coincide con la voz.
- **Que se le vea desde la primera sílaba**: si una frase de diálogo empieza justo al empezar la escena, NO uses una transición con desenfoque (`swish`/`whip`) que lo tape. Usa `'glide'` (deslizamiento suave sin desenfoque, con los personajes del plano nuevo desde el primer fotograma) y alárgala con `CFG.transDurBy = { escena: 1.4 }`.
- **Plano final de dos personajes**: los dos enteros y separados; calcula el encuadre proyectando posiciones (`W2.proj`) en vez de a ojo. Las cabezas del estilo son muy anchas (~0,9 m). Quien pide algo extiende el brazo HACIA el otro; quien tiene el objeto no se lo ofrece (lo lleva colgando en la mano).
- **Voz distinta para un personaje** (solo voces propias del usuario): `python3 -I tools/char_voice.py <proy> "a-b,c-d" -1.5 3.2` cambia solo esos tramos de `narration.wav` (guarda `narration_orig.wav`). Preset elegido por el usuario: −1,5 semitonos + saturación suave («grave y rasposo»). Pregunta siempre con 3 pruebas cortas antes de aplicarlo.

### Fondos de los planos de diálogo: nunca sosos
- Detrás de quien habla tiene que haber algo (pedido del usuario): casita, seto con faroles de piedra, tendedero con ropa de colores, macetas, cobertizo, árboles. Con el desenfoque de fondo queda rico sin distraer.
- Antes de poner objetos, mira TODAS las cámaras del vídeo (`grep "cp = V3" scenes_p.js`): en la 62 el tendedero tapaba el plano del apodo porque esa cámara estaba justo ahí. Deja libre el cono de visión de las otras cámaras, y pon lo grande detrás de ellas.
- Al cambiar el mundo, re-renderiza todas las escenas donde se vea lo nuevo (compruébalo con un preview de cada escena), no solo la que pidió el usuario.

### Brazos apoyados en una valla (personaje detrás de la valla)
- `leanArms(F, { k, lean, bob, from, ask })` devuelve `{ back, front }`: `back` (brazo desde el hombro) va ANTES de `who()` para que el hombro quede escondido detrás del cuerpo; `front` (antebrazo y mano) DESPUÉS de `rails2d`, encima de la barra. Todo en coordenadas locales con la misma inclinación (`lean`) que el personaje: si no, un brazo flota fuera del cuerpo y el otro cruza la camisa (fallo que vio el usuario).
- Codos por fuera del cuerpo (±116), manos juntas sobre la barra (±28). Para apoyarse: dos fases (suben las manos doblando el codo, luego se abren los codos), ~0,45 s, nunca de golpe.

### Palo de barbería (o cualquier cilindro que gira)
- Textura de rayas en hélice SIN COSTURA (bandas por vuelta múltiplo del nº de colores); si no, se ve una línea de corte girando («bugueado»).
- Gira SOLO el cilindro de rayas; tapas, cristal y soportes quietos. Los soportes llegan a la pared de verdad (el palo va delante de la fachada, no en el aire junto a la esquina).

### Plano final con acercamiento
- En el último plano (push-in), el sujeto (trofeo, personaje) debe caber entero hasta el último fotograma: dolly corto (≤ 0,25 m) y desplaza el `look` a la vez para mantenerlo centrado. Comprueba el fotograma final antes del render.

### Subtítulos nítidos en las transiciones (fallo detectado por el usuario)
- Doble seguridad: `core3d.js` aplica el desenfoque SOLO a `#gl` y `#fx` (nunca a `#cap`), así funciona también con `index.html` antiguos.
- Antes el desenfoque se aplicaba a `#stage`. La capa `<svg id="cap">` va FUERA de `#stage` (después del `</div>`), para que el texto se lea siempre. Ya está corregido en `engine_3d/index.html`; revisa los `index.html` de proyectos antiguos.


## Estadio de fútbol de 1889 (68 · La red de la portería, nov. 2026)
- `engine_3d/world_futbol.js`: campo con barro en las áreas y tiza gastada, porterías de madera, **red deformable** (`setNet({hit:[x,y], t, amp, rest:[x]})`: onda al entrar el balón y bolsa donde reposa), balón de cuero de 1889 (`ball(p, rot, vis)`), valla blanca, gradas de madera con tejado, faldón con letreros y banderines, casas de ladrillo, chimeneas con humo (sprites), campanario.
- **Público**: sprites de nuestros personajes pre-renderizados (`proyectos/68_red_porteria/bake_crowd.js`, 16 variantes × quieto/celebrando) metidos en `crowd.js` como data-URI (Chromium bloquea texturas `file://`). `W2.crowd(imgs)` devuelve una promesa: esperar antes de renderizar. `setCheer(k)` = fracción del público celebrando (brazos arriba, saltando).
- `stick.js` nuevo: `hat:'bowler'|'flatcap'` (ENCAJADOS en la cabeza, con patillas por debajo; el usuario: «los sombreros bien puestos, no superpuestos»), `outfit:'kit1889'` (`hoops:true` = aros horizontales como la referencia, cuello con cordón), `knickers` (bombacho hasta la rodilla), `whistle` (silbato del árbitro, encima del cuerpo).
- **Futbolistas que parezcan futbolistas** (el usuario: «ese no lo parece mucho», por el bombacho blanco largo que parecía un pijama): `fshorts` (pantalón corto a medio muslo, de color que contraste), `fsocks` + `sockTop` (medias altas con vuelta a rayas), `fboots` (botas con caña, cordones y tacos) y escudo en el pecho (`badgeCol`). Portero: jersey liso de otro color + gorra + guantes.
- Detalle del público como la referencia: variedad de gorras/bombines inclinados, bigotes, barbas, gafas, bufandas, chalecos, pelo de colores.


## Reglas del tutorial de la referencia (3 vídeos «Creatorize» sobre el estilo Ricks Clips, 12-11-2026)
El usuario los pasó como «consejos a la hora de crear los vídeos». Orden real: `video_yt` → grabación 19:37 → grabación 20:34. Leídos de los textos en pantalla (sin audio).

**Personajes**
- La MISMA cara en todos: 2 óvalos negros, boca pequeña, cejas cortas de pincel. Sin nariz, orejas ni mofletes (nariz o pestañas «rompen el estilo»). La identidad viene del SOMBRERO y del cuerpo. (Nosotros: el usuario eligió antes «ojos de palo»; no cambiarlos sin preguntar.)
- Un solo color de piel; tinta cálida, nunca negro puro; el sombrero es la forma más grande tras la cabeza; prueba de la silueta (distinguirlos en negro).
- Unidad D = ancho de la cabeza. Extremidades 0,06 D de goma, curvas suaves; manos = bolas de tinta sin dedos; ~3 cabezas de alto.

**Animación**
- Pose nueva en cada fotograma, sin desenfoque de movimiento en los personajes.
- 60–70 % del movimiento en los primeros 4–5 fotogramas, luego asentamiento lento (ease-out fuerte: usar `snap()` = outQuart en ~0,5 s).
- Personaje parado = COMPLETAMENTE quieto (sin respiración, balanceo ni bob). No usar `breathe()` en este estilo.
- La cara gira (flip) en 1 fotograma; la cara se mueve 1 fotograma ANTES que el cuerpo; la boca cambia cada ~2 fotogramas al hablar; 0 parpadeos mientras habla.

**Cámara**
- Cada plano = posición + objetivo + lente que cambian en el tiempo. Tres movimientos: push-in (acaba 1,9× más cerca, outCubic), órbita (~98°, no 180°), whip (frena en 1 fotograma, sin rebote).
- La cámara solo está quieta el 4,5 % de los fotogramas. Lente estrecha (26°): el fondo se ve grande detrás de los personajes.
- 5 estilos: cortes secos (Dread Cuts), plano único, found footage, «el observador», «a través del acero» (la cámara sigue el sonido atravesando paredes).

**Acabado («los detalles importan más que nada»)**
- Ropa con degradado suave: lado claro, lado 1,4–2× más oscuro y una raya pálida de brillo.
- Sombra de cada personaje proyectada desde el sol.
- 9 capas: mundo, niebla, bruma, desenfoque de fondo, bloom, pantalla, PERSONAJES (encima, nunca desenfocados), partículas, etalonaje.

**Rendimiento**: no actualizar ni dibujar lo que no se ve (personajes fuera de cuadro), cachear las caras. Ellos: 84 → 19 ms por fotograma.


### Montaje del 68 (red de la portería): lo que hubo que corregir en la revisión
- **Brodie en la grada tapado por la fila de delante**: un personaje que tiene que verse entre el público va en la PRIMERA fila (o subido a algo), nunca detrás de otras cabezas (las cabezas miden ~0,8 m).
- **Red invisible de lejos**: la textura con `alphaTest` desaparece a más de ~10 m. La red lleva además líneas 3D (`LineSegments` que comparten los vértices de la malla deformable): se ven a cualquier distancia y siguen el golpe del balón.
- **Planos desde detrás de la red**: ocultar la red 3D y dibujar `net2d()` ENCIMA de los personajes y el balón; el portero se tira al lado contrario para que el balón se vea entrar.
- **El delantero tapaba el balón**: en planos por detrás del que chuta, cámara alta (2,5 m) y lejos (25 m) para que la trayectoria pase por encima de su cabeza; balón 2D más grande con estela (`ball2d(p, spin, prev, big)`).
- **Carteles con texto (año) cortados**: solo el número, cartel estrecho.
- **Nada importante durante la transición**: si un gesto clave pasa al principio de una escena, acorta su transición (`transDurBy`) o empieza el gesto después.
- **Herramientas**: `FAST=1 ./strip.sh nombre t1,t2…` (previsualización a media resolución, 3× más rápida) y `node probe.js t…` / `node probe2.js t "x,y,z"` para saber dónde cae algo en pantalla sin renderizar.

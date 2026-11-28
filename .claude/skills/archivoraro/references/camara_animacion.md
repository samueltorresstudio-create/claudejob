# Cámara viva, animación de personajes y cero recortes (pedido del usuario, 28-11-2026)

**Obligatorio en TODOS los vídeos desde el 79.** El usuario lo pidió así: «cámara dinámica durante prácticamente todo el vídeo (PRIORIDAD ABSOLUTA), animación mucho más viva, PROHIBIDO cortar o recortar personajes, mejor luz y color, fluidez, que parezca un Short profesional». No es una lista para leer y asentir: se aplica en la producción y se **comprueba con números** antes de renderizar.

## 1 · Análisis del 78 (borrador v1): qué falló

Medido con `engine_3d/check_cam.js` + `check_cam.py` (audita 17 escenas sin renderizar, cada 0,1 s):
- **Cámara quieta ≥ 1,5 s: 16,8 s en total** (`psico` 4,8 s, `barra` 3,9 s, `reflejo` 3,0 s, `foto` 1,8 s, `pista` 1,4 s, `entra` 1,1 s). El plano «de explicación» era un zoom de ±3 % que a ojo es una foto.
- **Recortes en casi todas las escenas**: cabeza fuera (`entra`), pies fuera (`norma`, `gym`, `valgo`, `reflejo`), personajes en el borde lateral (`gancho`, `entera`), cara justo bajo el subtítulo (`aula`). Causa: cada plano tenía la cámara colocada **a mano** (`V3(…)` fijos) sin saber dónde acabaría cada personaje al andar.
- Los personajes andaban pero el resto del cuerpo estaba rígido: brazos fijos, cabeza fija, ojos abiertos todo el rato, boca que solo se abría con un `talk()` genérico (no con las palabras).
- Luz plana entre personaje y fondo: sin luz de contorno (rim), mismo `tintF` para todos.
- Cada cambio de plano era una transición, pero **dentro** del plano no pasaba nada: movimiento = solo en los cortes.

## 2 · Cámara (prioridad 1)

**Regla: en ningún momento hay 1,5 s con la cámara parada** (posición, mirada y fov casi iguales). Un plano de 6 s tiene que cambiar de verdad: se nota en tamaño, ángulo o altura.

### Cómo se hace: `engine_3d/followcam.js` (`FC`)
Las cámaras ya no se colocan a mano: se **calculan a partir de los personajes**. Cada sujeto = `{x,y,z,h,w}` (pies, altura, semiancho; `w` ≈ .30·h de pie y ≈ .52·h señalando con el brazo estirado).

```js
const subs = t => [ {x: xg(t), y:0, z:-4.4, h:1.85, w:.55}, {x: 1.45, y:0, z:-5.05, h:2, w:1.04} ];     // las MISMAS posiciones que usas para dibujar
const c = FC.shot(subs, t, D, { yaw:-12, occ:.50 }, { yaw:10, occ:.66, elev:.4 });                       // de a → b en D segundos
W.setCam(V3(...c.pos), V3(...c.look), c.fov);
```
- `FC.frame(subs, opts)`: encuadre mínimo que contiene a TODOS (pies, cabeza ×1,12 y brazos) con margen (88 % del ancho). Opciones: `yaw` (grados, 0 mira a −z), `fov` (40), `occ` (fracción del alto que ocupa el grupo, .45–.8), `aim` (sube/baja la mirada), `side` (desplazamiento lateral), `elev` (altura de la cámara sobre la mirada → picado/contrapicado suave), `minD/maxD`.
- `FC.follow(fn, t, opts)`: `fn(t)` da los sujetos EN MOVIMIENTO; encuadra la unión de sus posiciones de `t−.35` a `t+.7` → la cámara **va por delante** de quien anda y no lo pierde al arrancar.
- `FC.shot(fn, t, T, a, b)`: un plano de T segundos que interpola cualquier opción de `a` a `b` (ease casi lineal, nunca «parado»). **Cada plano = un `shot` con a ≠ b.**
- `FC.audit(camFn, subsFn, T)`: infracciones (pies/cabeza/lados fuera de plano, cámara quieta ≥ 1,5 s). Prueba en `engine_3d/followcam.test.js`.
- Si el grupo es ANCHO el límite es el ancho y el zoom (`occ`) ya no mueve la cámara: añade siempre un cambio de `yaw` y/o `elev` y/o `side` para que se mueva igualmente (el audit lo avisa).
- La deriva de mano (seno lento ±5 cm en `W2.setCam`) se mantiene encima de todo.

### Catálogo de movimientos (combínalos; cada plano lleva al menos DOS)
| movimiento | cómo con `FC.shot` |
|---|---|
| zoom in (momento importante) | `occ` .48 → .72 en 1,5–3 s |
| zoom out / revelar | `occ` .75 → .5 (aparece el contexto, otro personaje, el cartel) |
| trucking lateral | `side` −1,2 → +1,2 m |
| órbita suave | `yaw` −14 → +14° (nunca >35° dentro del mismo plano) |
| grúa | `elev` 0 → .8 m (+ `aim` −.1), o bajar al revés (contrapicado heroico) |
| seguimiento | `FC.follow` con el personaje andando: `yaw` casi constante y `occ` constante |
| golpe de impacto | `occ` +.12 en 0,25 s (outCubic) justo en la palabra clave + `shake` |
| dolly-in sobre objeto | para planos de objeto (cartel, tarjeta) un `cam` clásico con la cámara a 40 cm → 25 cm |

### Dirección (cada escena tiene intención)
- **Plano de situación** (llega a un sitio): amplio, grúa o travelling lateral, ≥ 2,5 s.
- **Diálogo/explicación**: plano medio con `occ` creciente (acercarse mientras se habla) y órbita pequeña; cada 2–3 palabras clave, un empujón.
- **Revelación / giro**: zoom out que descubre, o zoom in + shake en la palabra clave.
- **Andar**: `FC.follow` + que algo cruce por el fondo; nunca plano fijo con alguien andando por delante.
- Cortes dentro de una escena cada 1,4–2,6 s (ver «cámara mezcla» en `estilo3d.md`), pero **cada plano entre cortes también se mueve**. Entre sitios: `swish/whip/glide`.
- Mareo: velocidad máxima ≈ 1,2 m/s de la cámara y ≈ 25°/s de giro, salvo `whip` deliberado. Nada de movimientos que cambian de sentido (ida y vuelta) dentro de 1 s.

## 3 · Cero recortes (obligatorio, comprobado)

- Antes de renderizar: `node check_cam.js check.json && python3 check_cam.py check.json` → **0 recortes y 0 ventanas quietas** (si no, se corrige la cámara, no se ignora).
- Qué cuenta como recorte: cabeza a < 40 px del borde superior, pies fuera, personaje (con brazo) a < 10 px del lateral, cara en la banda del subtítulo (y 1275–1460).
- Los sujetos de `FC` se alimentan de las MISMAS funciones de posición que el dibujo (una sola fuente de verdad), así la cámara sabe dónde acabará cada uno.
- En planos de objeto que solo muestran un trozo (la mano con la tarjeta) no hay personaje: tampoco se enseña una cabeza cortada «de paso».
- Cuando varios interactúan, el encuadre contiene a todos los que hablan; el que no cabe se pasa a otro plano (no se corta).
- Además del informe automático, se miran fotogramas reales: inicio, medio y final de cada plano en hoja de contacto.

## 4 · Personajes vivos (`engine_3d/pj99/pjt.js` + `life.js`)

`pjt.js` admite ya (todas opcionales): `armA {L:[dx,dy],R:[dx,dy]}` (mueve la mano; codo ≈ 0,6·d), `head [dx,dy,rot°]` (cabeza gira alrededor del cuello), `blink` (0/1), `look [dx,dy]` (mirada), `breath` (escala vertical del cuerpo), `lean` (inclinación °), `walk {ph,amp}` (ciclo de andar completo: pierna que se levanta y apoya, bote, balanceo; `amp` 0–1), `talk` (0–1 apertura de boca), `shoeC` (zapatos), cara `'enfadado'`, `bald`.

`life.js` (`LIFE.of(T, seed, {words|talk, walk, look, gest, swing})`) lo da hecho en función del tiempo `T` (sirve para render aleatorio):
- **Parpadeo** cada 2,6–5,2 s (distinto por `seed`), **mirada** que salta cada 1,3–2,8 s o se fija (`look:[dx,dy]` hacia el otro personaje / objeto), **cabeza** que oscila y asiente al hablar, **respiración** e **inclinación** lentas.
- **Labial**: `LIFE.words(B, li)` convierte los tiempos de voz de la línea en `[[inicio,fin],…]`; la boca se abre una vez por sílaba (~0,17 s) SOLO mientras suena cada palabra.
- **Gestos**: al hablar sin andar, la mano derecha (a veces las dos) hace golpes cada ~1,1 s.
- **Andar**: la fase `ph` debe depender de la **distancia recorrida** (`ph = distancia / zancada·π`), no de `t·cte`, para que los pies no patinen (zancada ≈ 0,7 m). Los brazos se balancean en contrafase (`swing`).
- Usa un `seed` distinto por personaje (0,1,2…).
- Cambio de expresión en cada palabra clave (`serio → sorpresa → feliz…`), con 1–2 fotogramas de «anticipación» (cabeza atrás, ojos grandes) antes del golpe.
- Cada acción tiene inicio–desarrollo–final: nada cambia de posición de un fotograma a otro; los giros y los saltos de pose pasan por `sOut/seg` (mín. 0,25 s).

## 5 · Luz y color

- **Luz de contorno (rim)** en los personajes: borde claro del color del neón/luz dominante en un lado (filtro `tintF` por escena + un `feColorMatrix` más cálido en el lado de la luz principal). Separa personaje y fondo.
- Cada escena: **una luz principal con color propio + un contraluz distinto** (p. ej. rosa/azul en discoteca, cálida/fría en un interior). Sombras suaves bajo los pies (ya en `pjT`).
- Saturación y contraste un punto por encima del «normal»; sin quemados (clamp HDR antes del `grade`). Sin AO de pantalla (GTAO) si deja manchas.
- Profundidad: bruma de color por escena, motas de polvo, luces desenfocadas al fondo (bokeh), fondo siempre más desenfocado que el personaje.
- Coherencia de emoción: sorpresa/tensión = más frío y más contraste; alivio/triunfo = más cálido y más brillante. La identidad visual (paleta, tipo de letra, cartelería) no cambia en todo el vídeo.

## 6 · Orden de trabajo y lista de comprobación (cada vídeo)

1. **Guion de cámara por escena** (en una tabla antes de programar): intención, plano inicial → final, movimiento (de la tabla), personajes presentes y por dónde andan.
2. Escenas con `FC.shot/follow` y sujetos = las funciones de posición del dibujo; personajes con `LIFE.of`.
3. `node check_cam.js check.json && python3 check_cam.py check.json` → 0 recortes, 0 quietas. Corregir y repetir.
4. Previsualizaciones (`render.js preview`): 3 por escena (inicio, medio, fin del movimiento) en hoja de contacto; mirar cabezas, pies, brazos, cara/subtítulo.
5. Render; revisión fotograma a fotograma + tira de 10 fotogramas seguidos en cada tramo de andar (pies sin patinar) y en cada zoom (sin saltos).
6. Entrega solo si el informe de cámara está limpio y se ha visto el MP4 entero.

El check necesita en el proyecto: `window.__SCENES` (ya está en `core3d.js`) y que `pj()` guarde `(window.__PJ ||= []).push({fn, face, x:a.x, y:a.y, h:a.y-b.y, pt:!!(op.o&&op.o.point), d:a.d})` (ver `archivoraro_archivo/proyectos/78_discoteca/sc78.js`).

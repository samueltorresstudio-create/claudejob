# Motor de vídeo de Archivo Raro (SVG + Playwright)

Contenido:
1. Cómo funciona
2. script.json (una línea = una frase de la voz)
3. scenes_p.js: EVS, S.escena, CFG
4. Personajes: `A()`, `person()`, el reparto y todas las opciones
5. Helpers de escena y de cámara
6. Atrezo listo para usar (props.js / props2.js / kit.js)
7. Errores típicos del motor

## 1. Cómo funciona

Cada proyecto es una carpeta con:

| archivo | qué es |
|---|---|
| `index.html` | escenario 1080×1920; carga `lib.js`, `kit.js`, `voice.js`, `scenes.js`, `core.js` |
| `lib.js` | personajes (`person`), ojos, pelo, colores, easing, `cam`, `tag`, `bang`… |
| `kit.js` | `A()`, `kid`, fondos (`livingK`, `bedroomK`, `doorK`, `winK`, `sofaK`, `carK`…), `dark`, `countPop`, `shake`, `stranger`, `phoneK`… |
| `props.js`, `props2.js` | atrezo de la serie Tsunami (mar, olas, perro dóberman, hotel, supermercado, radio, mapa…) — reutilizable |
| `cast.js` | reparto `CAST` / `CAST_BY_ID` (27 fichas) |
| `scenes_p.js` | lo que escribes tú para cada vídeo |
| `scenes.js` | se genera: `cat props.js props2.js cast.js scenes_p.js > scenes.js` |
| `core.js` | línea de tiempo según la voz, subtítulos palabra a palabra, HUD, lista de pasos, corte a negro |
| `voice.js` | lo escribe `sync_voice.py` (tiempos reales de cada frase) |
| `render.js` | `node render.js preview t1,t2,…` → `preview/p_<t>.png`; `node render.js full 4` → `frames/` |

`core.js` llama a `S[escena](t, D, B)` en cada fotograma: `t` = segundos desde que empezó la escena, `D` = duración de la escena, `B` = sus frases (`B[i].s` inicio relativo, `B[i].w[j]` momento de la palabra j). Todo lo que devuelves es SVG en coordenadas 1080×1100 (la parte de abajo es para subtítulos, que empiezan en y≈1185).

## 2. script.json

```json
{"sc":"alley","hud":"CALLEJÓN · 13:51","say":"Marco corre al callejón.","cap":"MARCO CORRE AL CALLEJÓN.|p","pause":0.2}
```

- `sc`: escena. Frases seguidas con el mismo `sc` forman una escena.
- `hud`: texto del rótulo de arriba. Si empieza por `#` se calcula con `CFG.hud(h, bt, st, T)` (cuenta atrás, reloj…).
- `say`: texto hablado (sin etiquetas de ElevenLabs).
- `cap`: subtítulo en MAYÚSCULAS. `|p` rosa, `|y` amarillo, `|b` azul, `|g` verde detrás de una palabra la colorea (úsalo en 1–2 palabras clave por frase).
- `step`: 0,1,2… en las frases «Paso uno/dos…»; activa la lista de pasos (`CFG.steps`).
- `alert:true`: rótulo en rosa (momentos de tensión). `cut:true` en la última frase. `whisper:true` en frases susurradas (para `whisper_boost.py`).
- `voice:"tv"` en frases que son una radio/tele (solo afecta al guion exportado).

**Índices de palabras**: `B[i].w[j]` cuenta las palabras de `cap` separadas por espacios (los `|x` no cuentan como palabra). Cuenta con cuidado; un índice fuera de rango da `undefined` y la escena no anima.

Si cambias el `sc` de una línea después de sincronizar, cámbialo también dentro de `voice.js` (`window.SCRIPT` guarda una copia), o la escena no cambiará.

## 3. scenes_p.js

```js
const EVS={ alley:B=>({duque:B[0].w[4], rule:B[1].s}), ... };   // momentos clave por escena (relativos)
const S={};
S.alley=(t,D,B)=>{const E=EVS.alley(B);
  let s=fondo(t);                     // capas de atrás hacia delante
  s+=A({...MARCO,x:200,y:1010,s:.6,walk:t*7,look:[12,-4]});
  let o=cam(s,1.05,480,660,540,560);  // cámara
  if(t>E.duque) o+=tag(540,450,'DUQUE, ATADO',PINK,P(t,E.duque,.2));  // rótulos fuera de la cámara
  return o;};
window.CFG={steps:['1. …','2. …'],listEnd:'escena_final',band:{alley:'#5a4e3e',…},hud:(h,bt,st,T)=>'…'};
```

- **Rótulo de arriba (HUD)**: escribe `hud` como `«ETIQUETA · VALOR»` («VENTAJA · 44:32», «LUNES · 12:33», «SELVA · DÍA 4») y sale como tarjeta con icono (reloj si el valor es una hora, aviso si la línea es `alert`), etiqueta pequeña y valor grande. Sin `·` sale en una sola línea. `CFG.hudFrac:T=>0..1` (o `null`) añade una barra de progreso para cuentas atrás. `CFG.stepsTitle` cambia «PASOS» por «REGLAS», etc.
- `tag`, `bubble`, `bang`, `countPop` ya tienen el diseño nuevo (tarjetas con barra de color y sombra, bocadillo con contorno, textos con contorno grueso y brillo): no los imites con rectángulos propios.

- Cada escena necesita entrada en `EVS` **y** en `S`, aunque `EVS` devuelva `{}`.
- `band`: color de fondo detrás de los subtítulos para cada escena (que combine con el decorado).
- Nombres propios (`P6LUCIA`, `p6Alley`…) con prefijo del proyecto: `props2.js` ya define `LUCIA`, `RUBEN`, `MARCO`… y un nombre repetido rompe toda la página («Identifier has already been declared»).
- Suelo de los personajes: `y:1010`. Escala adultos `.6`, niños `.5` (con `A`), escenas lejanas `.36–.45`.

## 4. Personajes

`A(o)` = adulto (cuerpo alto). `person(o)` o `kid(o)` = niño (cuerpo corto). Reparto listo en `cast.js`:
`A({...CAST_BY_ID.C07.o, x:540, y:1010, s:.6})` (si la ficha tiene `kid:true`, usa `person`).

Opciones de `person`/`A` (todas opcionales):

| grupo | opciones |
|---|---|
| posición | `x, y` (pies), `s` escala, `rot`, `tilt` (cabeza), `op` opacidad |
| piel / pelo | `skin`, `hair`, `hs`: `short messy long pigtails bun bald ponytail braids wavy afro bob curly mohawk buzz sidepart spiky quiff` |
| cara | `eyes`: `open wide closed zombie blind`; `look:[dx,dy]` (−x mira a la izquierda); `brows`: `worried angry up`; `mouth`: `line o smile jag grin none`; `mopen` 0..1 (habla); `lashes`, `lip` (pintalabios), `beard`, `mustache`, `stubble`, `freckles`, `scar`, `wrinkles`, `eyepatch`, `earrings` (color), `glasses`: `sun round square`, `mask` |
| cabeza | `hat`: `straw cap beanie fedora police` + `hatCol`; `hoodUp` |
| cuerpo | `fem` (silueta), `build`: `slim heavy`, `tall` (A lo pone) |
| ropa | `top/topD` (camiseta y su sombra), `jacket`, `coat` (abrigo largo), `labcoat`, `vest`, `tie`, `scarf`, `badge`, `hood`, `strings`, `pocket`, `shortSleeves`, `skirt`, `dress`, `overalls`, `pants`, `shoes`, `backpack` |
| pose | `walk: t*7` (camina; `null` quieto), `sit:true`, `arms`, `aL/aR` (ángulo de brazos), `reachL/reachR:[dx,dy]` (lleva la mano a un punto), `handle:[x,y]` (dos manos), `phoneL/phoneR`, `cane` + `caneCol`, `bucket`, `flash:{dir,len,w}` (linterna) |
| vida | parpadea y respira solo; `blink:false` o `still:true` para fotos/portadas |

Otros: `lying(o,s)` (tumbado, cabeza a la izquierda), `SA(o)` (sentado en una silla), `stranger(x,y,s,{tilt})` (figura alta oscura, terror), `doberman(x,y,s,t,{dir,walk,run,alert,bark,head,wag})` + `dobCollar()` + `leash()`.

Para que dos personajes se distingan, cambia **silueta** (pelo, sombrero, complexión, ropa), no solo el color: la madre con moño, la niña con coletas y cuerpo de niña, el villano con capucha.

## 5. Helpers de escena y cámara

- `cam(svg, zoom, fx, fy, tx, ty, dx, dy)`: encuadra el punto (fx,fy) en (tx,ty) con zoom; `dx` para temblor (`shake(t, intensidad, px)`).
- Tiempo: `prog(t,a,b)` 0..1, `P(t,a,dur)` aparición suave, `lerp`, `clamp`, `eIn eOut eIO eBack`.
- Rótulos: `tag(x,y,'TEXTO',PINK|YEL|GREEN|BLUE, alpha)`; onomatopeya `bang(x,y,'¡PAM!',col,alpha,size)`; números `countPop('14 KM',x,y,size,t-tEvento,col)`; `brackets(cx,cy,w,h,col)`; `bubble(...)`; `soundArcs(x,y,t,col,dir)`.
- Luz: `dark(op,[[x,y,rx,ry],…])` oscuridad con huecos de luz; `url(#glowY)`, `url(#glowB)`, `url(#vig)`, `url(#beam)` ya están definidos.
- Cielos: `skyTod('day'|'afternoon'|'dusk'|'night'|'dawn')`, `skyT(k)` tormenta 0..1, `skyNight(t)`, `stars(seed,n,h,t,op)`, `moonK(x,y)`.
- `uid('x')` para ids únicos de `clipPath`/gradientes dentro de una escena.

### Cámara de enfoque (momentos clave)

`focusCam(bg, fg, k, fx, fy, o)`: separa el decorado (`bg`) de los personajes (`fg`) y, con `k` de 0 a 1 (`eIO(prog(t,a,b))`, 1–1,3 s), acerca la cámara al punto `(fx,fy)` (la cara: `x, y - s*640` para `A()` a escala `s`), desenfoca y oscurece el fondo y mete franjas de cine. Opciones: `z0` (1.05), `z1` (2.5), `blur` (7), `ty`, `bars:false`, `dx` (temblor). Úsalo en 2–4 momentos fuertes por vídeo (se apaga la luz, la noticia, el giro, la última frase), nunca en todos los planos.

### Partículas y sudor

`particles(t, kind, o)`: `'dust'` (motas en un rayo de luz), `'rain'`, `'snow'`, `'sparks'`, `'embers'` (brasas que suben). Opciones: `n` (cantidad), `x0,x1,y0,y1` (zona), `op`, `col`. Dibújalas en el decorado (debajo de los personajes) o encima para lluvia o nieve en primer plano.
`sweat(x, y, s, t)`: gotas de sudor junto a la cabeza de un personaje (`x, y` = sus pies, `s` = su escala), para miedo y esfuerzo.

### Movimiento natural (motor v4)

`A()`/`person()` ya andan con zancada larga, rodilla que se dobla, brazos que balancean con codo, rebote del cuerpo, inclinación al andar y cabeza con retraso; quietos respiran y se mueven un poco. Opciones: `stride` (1 = normal, 1.4 = correr), `lean` (grados, para frenar, asustarse o empujar), `dirW` (1/−1, hacia dónde se inclina al andar). Al frenar, mete un pequeño asentamiento (`lean` que oscila y se apaga en 0,5 s). Todos los personajes y perros llevan contorno único y sombra de volumen (filtro `chFX`, ya incluido).

## 6. Atrezo disponible

Interiores (`kit.js`): `livingK`, `bedroomK`, `classroomK`, `corridorK`, `bathroomK`, `wall`, `floorW`, `floorTiles`, `winK` (ventana con lo de fuera), `doorK` (puerta que se abre), `bedK`, `sofaK` + `sofaArmsK`, `wardrobeK`, `deskK`, `boardK`, `phoneK`, `handsPhone`, `chatK`, `idCard`, `notebookK`, `paperNote`.
Exteriores: `block` (edificios), `pavement`, `grass`, `streetLamp`, `carK`, `pine`, `rain`, `puffs`, `townRow`, `sea`, `beach`, `waveWall` (ola), `flood`, `splash`, `siren`, `hotel`, `roofScene`, `streetRuin`, `supermarket`, `lighthouse`, `boat`, `fish`, `gulls`.
Objetos: `ITEMS.water/kit/torch/radio`, `radioBig`, `mapCard` (mapa con ruta y monte), `bagOpen`, `bagClosed`, `redRag`, `sprayArrow` (flecha + hora).

Los dos ejemplos completos (`example/tsunami6`, `example/camara`) muestran cómo combinarlos: escenas con 3–4 capas de decorado, cámara viva, rótulos y efectos. Léelos antes de escribir un vídeo nuevo.

## 7. Errores típicos del motor

- Identificador repetido entre `props*.js` y tu escena → página en blanco. Prefijo propio siempre.
- `render.js preview` imprime `PAGE ERROR …`: arréglalo antes de seguir; el render completo sale negro.
- Un `tag` o un `bang` amarillo sobre pared clara no se ve: usa `PINK` o contorno.
- Texto SVG grande: añade `stroke="#000" stroke-width="8" paint-order="stroke"` para que se lea sobre cualquier fondo.
- Rótulos encima de cabezas, de la lista de pasos (y 186–250) o del HUD (y 92–168): colócalos en y≈300, 450 o 960–1050.

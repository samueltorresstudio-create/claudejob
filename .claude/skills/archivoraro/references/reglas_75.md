# Reglas obligatorias tras el 75 (el usuario, 23-11-2026) — valen para TODOS los vídeos siguientes

Críticas del usuario al vídeo 75 («errores un poco básicos»). **No se rehace el 75: se aplican desde el 76.** Repásalas ANTES de hacer la lista de planos y OTRA VEZ antes de entregar.

## 1. Lógica del escenario (nada sin sentido)
- **Cada objeto tiene que tener una razón para estar donde está.** Caso real: una palmera en mitad de un camino de tierra («¿qué hace ahí una palmera?»). Un camino, pasillo, calle o muelle es una zona **libre y de paso**: no se pone vegetación, farolas, cajas ni atrezo en medio; todo va a los lados, siguiendo el borde.
- Antes de colocar un objeto en el mundo: ¿quién lo puso?, ¿para qué sirve?, ¿molesta al que anda? Si la respuesta es «no pinta nada», no va.
- Comprobar en cada plano: nada flotando, nada incrustado en el suelo ni en otro objeto, nada a medias dentro de una pared.

## 2. Profundidad y superposición (personajes vs. objetos)
- Los personajes **nunca atraviesan ni pasan «por encima»** de un objeto: si andan junto a algo (palmera, farola, caja, valla) el objeto tiene que quedar **delante o detrás de verdad** (orden de dibujado/profundidad correcto) y el personaje tiene que ir por el hueco libre.
- Los personajes planos 2D dentro del mundo 3D: la profundidad se resuelve por la posición real en Z; comprobar con previews cercanos que el personaje queda tapado por lo que tiene delante.
- Trazar la **ruta de cada personaje** antes de renderizar y despejarla de objetos.

## 3. Cero bugs visuales (parpadeos, z-fighting, superposiciones)
- **Agua, cristales, humo, sombras y figuras planas que parpadean** («se buguean, parpadean»): es z-fighting o transparencia mal ordenada. Separar las superficies coplanares (≥ 0,02–0,05 de altura), `depthWrite=false`/`renderOrder` en lo transparente, `polygonOffset` en decales, y **mirar 3–4 fotogramas CONSECUTIVOS** del tramo (no solo uno suelto cada medio segundo) para cazar el parpadeo.
- Pasar `tools/spikes.py` SIEMPRE y además revisar fotogramas consecutivos en cada plano con agua, suelo con decales o cosas semitransparentes.
- Si algo se ve «bugueado» en un plano, no se entrega: se arregla la causa (no se tapa con la cámara).

## 4. Andar de los personajes
- **El usuario odia cómo andan** («andan súper raro, muy mal»). Reglas: pasos con balanceo de brazos opuesto a las piernas, rebote vertical suave, pies que no resbalan (la velocidad del suelo = la del paso), giro del cuerpo hacia donde van, sin deslizarse ni caminar en el sitio, sin patinar al empezar/parar (aceleración corta).
- Revisar cada tramo de caminata en fotogramas consecutivos antes de entregar; si patina o se ve rígido, rehacerlo.

## 5. Cámara y cortes
- **La cámara NO puede estar quieta más de 1–2 s**: movimiento constante (empuje, órbita, travelling, paneo) en TODOS los planos.
- **Los cambios de plano llevan transición de cámara** (whip, desplazamiento, zoom que conecta con el siguiente); prohibido el corte seco «porque sí». Ya se acordó así: si no hay movimiento de transición, no está terminado.
- En la lista de planos, anotar para cada corte: cómo se mueve la cámara al salir y al entrar.

## 6. Expresiones de los personajes
- Los personajes **cambian de expresión facial a lo largo de la escena** al ritmo de lo que se cuenta (sorpresa, duda, rabia, alegría, miedo…). No todo el rato ni a destiempo, pero ningún personaje con la misma cara más de 2–3 s mientras habla o reacciona. Planificar una expresión por evento de la voz.

## 7. Escenarios: diseñados, coherentes y con detalle SIEMPRE
- **Nada de planos con el personaje y «nada» detrás.** Cada plano, incluso los cercanos, lleva fondo con detalle (edificios, vegetación, objetos, cielo con nubes, profundidad con 3 capas). El nivel de detalle tiene que ser **parejo en todo el vídeo**: no ricos en un plano y vacíos en el siguiente.
- «Los escenarios me parecen un poquito cutres»: diseñarlos con **más intención** — composición clara, paleta definida por escena, siluetas reconocibles, escala coherente, luz con dirección, props con historia — como un decorado de dibujos animados trabajado, no volúmenes sueltos. Blender para todo lo grande; invertir más tiempo en los bocetos del escenario y que el usuario los apruebe.
- Los planos cercanos de personaje: elegir el ángulo para que el fondo cercano también esté compuesto (no una pared lisa o un suelo vacío).

## Lista de comprobación final (antes de SendUserFile)
1. ¿Hay algún objeto en un camino/pasillo de paso? ¿Alguno sin sentido? 
2. ¿Algún personaje atraviesa o pasa por encima de algo?
3. ¿Parpadeo en agua/decales/transparencias? (fotogramas consecutivos)
4. ¿Andan bien? (balanceo, sin patinar)
5. ¿Algún plano con cámara quieta > 2 s o corte seco sin transición?
6. ¿Cada personaje cambia de cara con la historia?
7. ¿Algún plano con fondo vacío o más pobre que los demás? ¿Escenarios con diseño?

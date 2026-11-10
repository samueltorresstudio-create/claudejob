# Lecciones aprendidas (feedback real del usuario)

Revisa esta lista con la hoja de contacto delante antes de entregar cualquier vídeo. Cada punto es algo que el usuario detectó y hubo que rehacer.

## Personajes

- Un personaje nuevo hecho con el cuerpo de otro y otros colores **parece el mismo**: «Lucía era el ladrón pero más bajito». Niños con cuerpo de niño (`kid`/`person`, o `A` a escala .5 con coletas), mujeres con `fem`, peinado distinto, ropa distinta. La madre llevaba moño: respétalo en todas las escenas.
- Si el guion dice cómo es alguien (moño, chaqueta roja, coletas), dibújalo así siempre, en todas las partes.
- Usa el reparto (`cast.js`) y combina rasgos del catálogo en lugar de recolorear al protagonista.

## Geografía y lógica de la escena

- Quien está escondido no puede salir al lado de quien le busca mirándole: «los ladrones están al lado de Marco, ¿cómo es que no le ven?». Separa a los personajes en el espacio, haz que miren hacia otro lado (`look`), escóndelos detrás de algo y, si hace falta, **parte la escena en dos planos** (uno del que se esconde, otro de los que buscan).
- Mantén un mapa mental del sitio: si los ladrones corren hacia la persiana, el héroe no puede aparecer luego junto a la persiana. Ni los cuatro juntos en el mismo plano si no lo están en la historia.
- Lo que se dice tiene que verse (si «se le cae un walkie», que caiga; si «se para delante del objetivo», que llene el plano).

## Composición

- «Fíjate en la pared, no hay nada, quiero detalles, que no sea un muermo, siempre, en cualquier escena». Toda pared, calle o interior lleva detalles (`decorWall`, `nivel.md` §2).
- El punto rojo parpadeante del rótulo de arriba se queda: «me gustaba más con el punto rojo que con un reloj».

- Rótulos y cuadros: «hazlos recuadros, no círculos, pero mejora el original». Estilo del canal = recuadro recto oscuro con borde amarillo y letra tipo máquina; se mejora con doble borde, esquinas, sombra e iconos cuadrados, nunca con pastillas redondeadas.

- «Tamaños descompensados y sonrisas muy raras» (la calle de «Apagón 1»): cada vecino a una escala distinta y con los pies a distinta altura, y una sonrisa enorme con los ojos cerrados. Usa `crowd()` para grupos y `mouth:'laugh', eyes:'happy'` para reír.

- «Se mueven como Legos»: piernas rectas, brazos tiesos. El motor v4 ya anda con zancada, rodillas, codos y rebote; no lo anules con `walk` lento ni con `aL/aR` fijos al andar.
- «Solo le has puesto contorno»: una mejora tiene que verse a la primera. Personajes grandes en el plano, decorado con perspectiva y luz, y enfoques en los momentos clave.
- Caras con ojos de blanco grande y pupila «daban repelús» en estilos nuevos: se mantiene el estilo original del canal.

- Nada de escenas con «solo Marco y un fondo marrón»: cada decorado lleva 3–4 capas (pared con detalles, objetos, suelo con textura, luz).
- Objetos al tamaño real: una nota de mano no puede ocupar media pantalla; un mapa tiene que parecer un mapa (costa, ciudad, ruta, monte con nombre).
- Rótulos (`tag`) que no tapen caras, ni la lista de pasos, ni el HUD; nada de texto encima de otro texto (la flecha, la hora y la frase de una pintada iban montadas una encima de otra). Si algo cruza una estantería, mueve la estantería.
- Amarillo sobre pared clara no se ve.
- Escenas nocturnas: oscuras pero legibles (`dark` .4–.5 con hueco de luz en los personajes).

## Duración y formato

- YouTube: más de 60 s, siempre (59,3 s no valió).
- Serie TikTok: lo que pida (la parte 6 pidió 80–90 s).
- Portadas: con el protagonista visible y sin rótulos del vídeo; «vaya portada más mala, solo aparece la pared y el perro». Busca un fotograma con personajes y sin `tag`/`bang` (`clean.js` quita el HUD y los subtítulos, pero no los rótulos de la escena).

## Proceso

- Descripciones de TikTok cortas: «vuelve a hacerlos cortos, de una línea y poco».

- «El audio está descoordinado con los subtítulos»: la sincronización por pausas se desfasó una frase en el gancho de «Apagón 1». Ejecuta siempre `check_sync.py` después de `sync_voice.py` y, si marca algo, fija los inicios con `LINE_STARTS`.

- Si el usuario te pasa el audio, haz el vídeo con ese audio; si pide primero el guion, revísalo por lógica antes, para que no gaste créditos de ElevenLabs en frases que habrá que regrabar.
- Conserva `frames/` hasta que el usuario dé el vídeo por bueno: un arreglo pequeño se renderiza solo en su tramo (`R0`/`R1`) en un par de minutos en lugar de diez.
- Al esperar procesos, borra el registro antiguo (`finish.log`) antes de relanzar; si no, la espera termina al instante con el «DONE» viejo.
- No uses `pkill -f` con un patrón que aparezca en tu propio comando (mata tu propio shell). Usa el truco `"[r]ender.js full"` y no metas «audio.py» en el patrón si el comando contiene ese texto.
- Antes de enviar, mira `final_sheet.png` (24 fotogramas del vídeo final). Si ves un fallo, arréglalo antes de entregar, no después.
- Responde en español de España, directo y breve; el usuario sube a TikTok y YouTube desde el móvil.

## Estilo 3D (noviembre de 2026)

- Personajes 3D hechos con piezas: «no me gustan nada». Cabezones 3D: «muy infantil, no lo hagas tan bebé». Los personajes se quedan en **2D** dentro del mundo 3D.
- Cabeza deforme u orgánica: «quiero que sea redonda». Caras: «cópialas de la captura» (párpado pesado, ojos redondos de susto, dientes en rejilla, gota de sudor).
- Ropa con costuras, bolsillos y parches pequeños: «están fatal». **El cuerpo es la prenda** con volumen, y 2–3 detalles gruesos (cuello, número, correa cruzada, corbata, pajarita, fajín, rayas).
- Pelo de casco liso: mejorable. Usa los peinados de `hair.js` (mechones, volumen detrás, brillo, sombra del flequillo).
- Coche que aparecía dentro de la cancha: «no quiero que cometas ningún error así». Cada objeto vive solo en su sitio; revisa la hoja entera antes de renderizar.
- Si pide **fotos**, no hagas vídeo.
- «Nunca tardas tanto»: el 3D con oclusión ambiental es lento. Por defecto va sin GTAO; da tiempos realistas (2–3 h con un sitio nuevo).

## Fallos de dibujo que el usuario detectó (no repetir)

- **Sombrero que «levita»** (pescador, nov. 2026):
  - El sombrero tiene que **asentarse en la cabeza**: el ala, a la altura de la frente (y ≈ −62 en la cabeza de r 100); la copa, igual de ancha que el cráneo y envolviéndolo.
  - La mitad de atrás del ala va **detrás de la cabeza** (`hatBack`).
  - Las cejas bajan para que queden bajo el ala.
  - Cualquier gorro o casco nuevo sigue esta regla. Compruébalo siempre de frente, de tres cuartos y de espaldas.
- **Fondos en 2D en un boceto** del estilo 3D: «no sé si te acuerdas que todo lo de detrás es 3D». **Los bocetos y las fotos se hacen siempre dentro del mundo 3D**, nunca sobre fondos planos.
- **Primer hipopótamo, de perfil y en bloque: «muy feo».** Los animales se diseñan como personajes:
  - de frente o de tres cuartos;
  - formas redondas;
  - cara expresiva con ojos grandes o de párpado pesado;
  - morro con mofletes, colmillos, orejas y brillo.
  - Haz dos versiones para que elija (`hippo2`, estilos A y B).
- Personaje que flota **sobre** la canoa en vez de ir dentro: los pies van al fondo del casco y el lado cercano del casco se dibuja encima de los pies.
- Animal en el agua:
  - **lo que queda bajo el agua no se dibuja** (nada de piernas fantasma transparentes);
  - el bostezo tiene que quedar **por encima** de la línea del agua.
- Personaje «normalito»: añade un objeto que le dé identidad cultural (carriel, sombrero vueltiao, canalete).

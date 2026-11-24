
## Bata de laboratorio (77)
- Al usuario le parecieron «rarísimos» los pantalones de la científica: pierna fina gris oscuro, faldones de la bata en forma de caja abierta y pierna larga (legLen 1.2).
- Ahora: bata que cae recta y casi cerrada hasta medio muslo (abertura solo abajo), bolsillo y botón; pantalón de color (azul pizarra), ancho `tw: 36`, legLen 1.05. Revisar siempre de cuerpo entero y andando.

## Errores del 77 (detectados en la revisión)
- La transición `push` dejó 8–9 fotogramas grises/negros vacíos al entrar en planos del salón (relojes y bolsillo). Usar `swish`; pasar SIEMPRE el escáner de fotogramas vacíos (desviación típica < 20) además de `spikes.py`.
- Cámara fuera de la sala del laboratorio (z > pared) → fondo plano de color. La cámara siempre dentro de las paredes del decorado.
- Bocadillos de pensamiento con posición relativa a la cabeza chocan con gorros/antenas en primeros planos: ponerlos en posición fija de pantalla.
- Subtítulos ~0,11 s por detrás de la voz: se arregla sin re-render con `VOICE_DELAY=0.1` en `audio.py --voice` (solo retrasa la voz). Comprobar con `wsync.py` + inicios de energía.

## Errores del 77 que vio el usuario en el vídeo entregado (NO repetir)
- **Andar raro**: el paso de perfil (`walk2` con piernas que giran a los lados) usado en personajes que andan HACIA la cámara o DE ESPALDAS abre las piernas en tijera. De frente/espaldas usar `walkPose` (pies que se levantan alternando, piernas paralelas). El paso de perfil solo si el personaje cruza de lado.
- **Parpadeo de los decorados**: cajas de Blender con caras exactamente en el mismo plano (molduras, paneles, paredes del laberinto que se cruzan) → z-fighting que cambia en cada fotograma. Ahora `obj_base.py` separa cada caja unos milímetros (las pequeñas quedan delante) y `blender/zfight.py` lista las caras coincidentes: pasarlo SIEMPRE tras cambiar un decorado. Revisar fotogramas SEGUIDOS (t, t+1/30, t+2/30), no sueltos: el parpadeo no se ve en una hoja de contacto.
- **Antialiasing**: el EffectComposer sin `samples` renderiza sin antialias → bordes que bailan. Usar `new EffectComposer(R, new WebGLRenderTarget(W, H, { samples: 4, type: HalfFloatType }))`.
- **Personaje detrás de una mesa**: el recorte (`clip`) va en el borde TRASERO del tablero (el más alto en pantalla con cámara por encima), no en el delantero; si no, las piernas salen pintadas encima de la mesa.
- (77) Tragaperras en pasillos estrechos: el taburete sale 0,95 m hacia delante y quedaba en el centro del pasillo; el personaje 2D que anda por ahí parecía pisarlo. En pasillos, máquinas sin taburete (`slot(..., st=False)`) y revisar siempre el suelo entre cámara y personaje.
- (77) La cámara NUNCA atraviesa a un personaje 2D: si avanza por un pasillo, el personaje va a un lado y la cámara se para antes de llegar a él (si no, la cara llena la pantalla, sale un fotograma blanco y el «?» se queda flotando). Personaje quieto = z fija; si se desplaza, con paso (walk2), nunca deslizándose.

- (24-11-2026) **Texto en el atrezo: SÍ.** Calendarios, carteles, carretes, noticiero, monitores con letras en español en 2–4 objetos clave que expliquen la historia. Lo prohibido son los rótulos flotantes sobre la imagen (etiquetas tipo «1943»). El 77 se hizo sin texto en el mundo por un malentendido.


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

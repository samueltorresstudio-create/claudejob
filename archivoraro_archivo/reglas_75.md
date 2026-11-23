
## Bata de laboratorio (77)
- Al usuario le parecieron «rarísimos» los pantalones de la científica: pierna fina gris oscuro, faldones de la bata en forma de caja abierta y pierna larga (legLen 1.2).
- Ahora: bata que cae recta y casi cerrada hasta medio muslo (abertura solo abajo), bolsillo y botón; pantalón de color (azul pizarra), ancho `tw: 36`, legLen 1.05. Revisar siempre de cuerpo entero y andando.

## Errores del 77 (detectados en la revisión)
- La transición `push` dejó 8–9 fotogramas grises/negros vacíos al entrar en planos del salón (relojes y bolsillo). Usar `swish`; pasar SIEMPRE el escáner de fotogramas vacíos (desviación típica < 20) además de `spikes.py`.
- Cámara fuera de la sala del laboratorio (z > pared) → fondo plano de color. La cámara siempre dentro de las paredes del decorado.
- Bocadillos de pensamiento con posición relativa a la cabeza chocan con gorros/antenas en primeros planos: ponerlos en posición fija de pantalla.
- Subtítulos ~0,11 s por detrás de la voz: se arregla sin re-render con `VOICE_DELAY=0.1` en `audio.py --voice` (solo retrasa la voz). Comprobar con `wsync.py` + inicios de energía.

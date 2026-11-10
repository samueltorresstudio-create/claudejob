# Ideas y guiones para Archivo Raro

## Qué funciona en este canal

Historias de supervivencia, misterio y terror suave en segunda o tercera persona, contadas como **reglas o pasos** («Paso uno: si el mar se va, tú también te vas»), con un protagonista con nombre, un detalle visual que se recuerda y un final que corta a negro en el peor momento. Lo que más visitas ha dado: «Desaparecen los adultos» (serie de 5), «Tsunami: Marco y Duque» (serie de 7), «Tu doble en clase», «Mides 2 cm», «El avión vacío», «Un millón en la mochila», «El Hombre de la Estática».

## Dos formatos

| | TikTok (series) | YouTube (vídeos sueltos) |
|---|---|---|
| estructura | partes de una serie, cada una acaba en cliffhanger | historia completa con gancho, giro y final cerrado o inquietante |
| duración | 60–90 s (lo que pida el usuario; parte 6 del tsunami: 82 s) | **más de 60 s**, 60–70 s (por debajo del minuto YouTube no lo cuenta como vídeo de más de un minuto) |
| portada | etiqueta «PARTE N» | sin parte |

Si el audio se queda corto, `extend_total.py` alarga la última escena sin voz (por ejemplo, la cámara de seguridad congelada con estática). Avísale de cuánto dura.

## Fórmulas de gancho (primera frase, 2–4 s)

- «Si un día… [algo imposible]… tienes X minutos para…»
- «Si en un tsunami te fías de cualquiera… lo pagas muy caro.» (regla + amenaza)
- «Hay una cámara en tu salón que no instalaste.» (dato inquietante en presente)
- «Lo peor de X no es Y… es Z.»
- Pregunta implícita que solo responde el final. El gancho tiene que mencionar el tema de la serie (si es un tsunami, que suene a tsunami).

## Esqueleto de un vídeo (≈15–19 frases)

1. Gancho (1 frase) + promesa (1 frase).
2. Quién y dónde (1–2 frases, con un detalle concreto: edad, hora, objeto).
3. 3–4 **pasos/reglas** útiles o creíbles, cada uno seguido de lo que pasa al aplicarlo.
4. Un giro que cambia lo que el espectador creía.
5. Final: una imagen + una frase corta (si se puede, que enlace con el gancho para que el vídeo haga bucle). En series, cliffhanger; en vídeos sueltos, cierre que deja mal cuerpo.

Las reglas deben ser verdad o sonar a verdad (supervivencia real, psicología, física). Si una regla es dudosa, no la presentes como «truco real».

## Series

- Planifica todas las partes antes de la primera (resumen de 3–5 líneas por parte) y guarda la biblia de la serie: personajes, objetos que llevan, horas, lugares, qué se ha prometido.
- Cada parte empieza donde acabó la anterior (el espectador la acaba de ver) y retoma el tema de la serie en los primeros segundos.
- Cada parte necesita su propia amenaza; si la historia se desvía (ladrones, traiciones…), vuelve al tema central con una alerta, un reloj o una cuenta atrás.
- Cuenta atrás en el HUD (`CFG.hud`) = urgencia gratis.
- **Un solo tema, sin desviarse** (el tsunami bajó de 1,3 M a 1.000 visitas al irse a ladrones y traiciones). Cada parte = una fase del tema con sus reglas.
- **Cada parte se entiende sola**: los primeros 3 s sitúan al que llega nuevo («Día 3 sin luz…»).
- **4–5 partes**, no más, salvo que el usuario pida otra cosa.
- En la parte 1, **avance en el gancho** («El día 1… el día 3… el día 7…»).

## Revisión de lógica (antes de dar el guion)

Pregúntate en cada frase: ¿de dónde sale este objeto? ¿quién lo sabe y cómo? ¿por qué no le ven / no huye / no llama? ¿cuadra la hora con lo dicho antes? Fallos reales que hubo que arreglar:
- La radio «que escucha» estaba en la mochila robada → hubo que inventar una radio de bolsillo.
- El mapa «en la mochila» que les habían vaciado → el mapa va en el bolsillo de la chaqueta.
- «No te fíes de Lucía» sin motivo, siendo una niña → hace falta una razón concreta.
- El agua de la cisterna «limpia» después de decir que el agua de la inundación es veneno.
- Una pintada con una hora que nadie explica → si pones un enigma, que se pueda entender.

Si encuentras un fallo en partes ya publicadas, no propongas resubir: arréglalo en la siguiente parte o con un comentario fijado.

## Formato para ElevenLabs

Voz del usuario: **Eleven v3, «Edoardo – Dark Measured Natural», estabilidad «Natural»**. Él genera el MP3 y te lo pasa.

- Una frase por línea, sin título, sin numeración, dentro de un bloque de código para copiar.
- **Energía en el gancho**: si va una etiqueta, que sea en la 1.ª o 2.ª frase (`[urgent]`/`[tense]`).
- Etiquetas de emoción **muy pocas** (2–4 en todo el guion), solo en los momentos especiales, al principio de la frase: `[serious] [tense] [urgent] [ominous] [sad] [hopeful]`. **Nada de `[whispers]`** (el usuario no quiere susurros).
- Diálogos entre «comillas españolas».
- Números con letra si se leen («cinco y doce», «veintidós horas»); en los subtítulos van en cifras.
- Longitud: ≈2,4 palabras por segundo con las pausas de esta voz. 60–70 s ≈ 150–170 palabras; 80–90 s ≈ 200–215 palabras.

Cuando el usuario pida ideas, da 3 opciones de 2–3 líneas cada una (gancho, giro, final). Cuando elija, escribe el guion. Si pide el resumen, da 5 líneas.

## Fórmula de guion viral (cuenta de referencia del estilo 3D, analizada en nov. 2026)

Son **vídeos sueltos de una parte, de 40–60 s**, cada uno sobre **una curiosidad real**: historia, ciencia, trucos legales o psicología. Encaja con los datos de Metricool: las series pierden apoyo en cada parte. Ejemplos transcritos: la cárcel pintada de rosa, los huecos en las vías del tren, el aceite en el mar para escapar de un pirata, el caballo más lento, el pachinko de Japón, la lanza y el escudo, el sismógrafo de los dragones, el hombre que movía los muebles un centímetro, la sala de destierro de Japón, los ataúdes con campana, el pistolero que nunca desenfundaba primero.

1. **Línea 1 = gancho: un hecho raro contado como acción concreta**, que obliga a preguntarse «¿por qué?». No hay presentación.
   - Acción absurda: «Pintaron una cárcel de rosa.» / «Apostó los ahorros de su vida al caballo más lento.»
   - Contradicción: «El juego es ilegal en Japón. Aun así, hay un salón de juego en casi cada calle.»
   - Pregunta de cada día: «¿Cómo sabe una pastilla dónde te duele?»
   - Paradoja: la lanza que lo atraviesa todo y el escudo que nada atraviesa.
2. **Línea 2: la reacción de los demás.** «Los guardias están encantados.» / «Toda la sala se ríe de él.» / «Toda la corte se echó a reír.» Así nace la tensión del «loco contra todos».
3. **Un número exacto y visual:** 15 minutos, cada 12 metros, un centímetro, 8 dragones, 100 años.
4. **La bisagra «Verás,…» / «Y es que…»**: la explicación real, en una o dos frases.
5. **Meter al espectador:** «Imagina que…», «Ganas un cubo… intentas cambiarlo… el mostrador no te da ni un yen». En segunda persona.
6. **Escalada por pasos:** «La primera noche nadie lo nota… al final de la semana la nevera tapa la puerta…».
7. **Pago final que da la razón al «loco»** y corte justo ahí. Ejemplo: la bola cae, nadie siente nada, se ríen… y días después llega un mensajero: terremoto a 600 km.

**Ritmo**
- 110–150 palabras.
- Frases de 4–10 palabras, una idea por frase. **Cada frase es un plano** (cambio cada 1–2 s) y lo que se dice se ve de forma literal.
- Tono de anécdota contada a un amigo, no de documental. Sin «hoy te voy a contar» y sin despedida.

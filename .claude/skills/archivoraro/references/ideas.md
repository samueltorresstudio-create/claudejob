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
- **Siempre con etiquetas `[...]`** cuando le pases el guion para grabar (el usuario lo recordó el 12-11-2026: «¿No añades []?»). Nunca le des la versión sin etiquetas como guion para ElevenLabs. Etiquetas SIEMPRE al principio de la línea (nunca en mitad), una frase por línea, 3–6 etiquetas; el remate final con `[deadpan] [slowly]` y puntos suspensivos (formato de `textos/guion_64_palomas_misil.txt`).
- **Energía en el gancho**: si va una etiqueta, que sea en la 1.ª o 2.ª frase (`[urgent]`/`[tense]`).
- Etiquetas de emoción **muy pocas** (2–4 en todo el guion), solo en los momentos especiales, al principio de la frase: `[serious] [tense] [urgent] [ominous] [sad] [hopeful]`. **Nada de `[whispers]`** (el usuario no quiere susurros).
- **Curiosidades (voz alegre): catálogo de etiquetas v3** (pedido del usuario: variedad según la situación, no en cada frase):
  - gancho: `[curious]` (mejor que `[excited]`: con Edoardo, `[excited]` suena demasiado fuerte; el usuario lo dijo el 12-11-2026);
  - remate seco y alargado («Mala… idea»): `[deadpan] [slowly]` en una línea aparte, con puntos suspensivos dentro;
  - humor: `[laughs]`, `[sarcastic]`, `[mischievously]`, `[playful]`;
  - sorpresa: `[surprised]`, `[amazed]`;
  - tensión: `[dramatic]`; giro serio: `[serious]`; resignación: `[sighs]`.
  - Si una etiqueta exagera, quítala y regenera solo esa frase. No alargar letras («maaala»).
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


## Cómo suenan de verdad (transcripción palabra a palabra de la cuenta de referencia, 11-11-2026)

Frases reales, tal cual: «Gambling is illegal in Japan. Yet there's a gambling hall on almost every street. Inside, thousands of machines flashing and screaming while people carry out buckets full of steel balls. Police stroll right past the door, but nobody ever gets arrested. So you win yourself a bucket, try to cash it in. But the counter won't give you a single yen…» · «How do painkillers know where the pain is? You swallow one for a headache, and then what? Does it pull out a little map?» · «A man snuck into a family's house every night and moved every single thing one inch to the left. The first night nobody notices, because who measures their couch? By the end of the week, the fridge is blocking the back door, and dad is pretty sure he's losing his mind.» · «He put a bronze ball in a dragon's mouth and told the emperor: if this ever falls out, run. The whole court burst out laughing.» · «If your ship got hit by a cannonball, you'd actually be one of the lucky ones.»

**El usuario dijo de un guion mío: «es muy IA».** Reglas para que no lo parezca:
- Frases **normales, enteras y con detalle físico concreto** (cubos de bolas de acero, la nevera tapando la puerta), no fragmentos sueltos tipo «Raya blanca. Raya negra.».
- **Humor seco y sarcástico** dentro de la frase («¿y qué hace, saca un mapita?», «porque ¿quién mide su sofá?»). Nada de exclamaciones gritadas ni frases entre comillas tipo «¡Se ha vuelto loco!».
- **Prohibido:** tríos efectistas («Sin venenos. Solo pintura.»), moralejas finales («y ya nadie se ríe»), metáforas de redacción («viven en guerra»), «imagina» + adjetivos, puntos suspensivos en cada frase.
- Bisagra natural: «Resulta que…» / «Y es que…» (equivale a su «You see,»). La segunda persona se usa para meter al espectador en la acción («ganas un cubo, vas a cambiarlo…»).
- El dato remate va seco al final, sin explicarlo de más.
- **Nunca empezar con una fecha** («En 1943, …»): la frase 1 empieza por el protagonista y su acción («Un científico metió tres palomas…»). La fecha, si hace falta, va en la frase 2 o más tarde (pedido del usuario, 12-11-2026).


### Dos guiones COMPLETOS de la referencia (transcritos palabra a palabra, 12-11-2026)

**El pistolero (57 s, curiosidad):** «The fastest gun in the West had one rule. Never draw first. Imagine you're standing in the street at noon, staring down a guy everyone calls Slow Eddie. His hands are at his sides. He hasn't even looked at his gun. He just nods at you and says, "After you." So you grab your gun faster than you've ever moved in your life, yet you're face down in the dirt before it clears the holster. How is that possible? Eddie isn't even fast. He'd lose a race to the saloon against a guy carrying two beers. But men ride in from three states away to duel him, and every one of them goes down the exact same way. The only weird thing anyone ever notices is that Eddie never looks at your face. He just stares at your hand. You see, think about the last time your phone slid off a table. You caught it before you even realized it was falling, because you never decided to catch it. Your body just did. But when you went for your gun, you had to decide the exact moment to draw. That tiny decision slowed your hand down. Eddie never decides anything. He just waits for your hand to twitch and lets his body react on its own.»

**El botón (66 s, ficción):** «There's a button in the middle of town and nobody's allowed to press it. […] two guards who never take their eyes off it. […] At night, a glow comes from the other side. And every year it gets a little dimmer. But Gary's always noticed two weird things. Under the glass, there are 47 tiny scratches nobody can explain. […] So when his friends bet him five bucks he won't press it, he can't say no. At three in the morning, the guards swap shifts and he's got about 30 seconds. […] Around the button, there are 48 scratches. Then his mom steps out of the crowd and says, "Nobody touches this. We'll build a town right here."»

**Lo que hay que copiar de ellos:**
1. **El protagonista tiene nombre o mote** (Slow Eddie, Gary) y una manía visible (Eddie mastica una paja y nunca mira a la cara).
2. **El espectador es el rival**: «Imagina que estás en la calle… frente a Eddie». Le pasa a él lo malo.
3. **Detalle cómico concreto** para exagerar: «perdería una carrera hasta el saloon contra uno que lleva dos cervezas».
4. **El héroe habla poco y tranquilo** («After you.»). Los diálogos son una frase corta, seca; nada de gritos.
5. **Bisagra con pregunta**: «¿Cómo es posible?» y luego **«Verás, piensa en la última vez que…» + algo de la vida diaria del espectador** (el móvil que se cae de la mesa). La ciencia se explica con esa comparación, no con datos de documental.
6. **Final**: o termina justo en la explicación, con frase rotunda, o con **una frase de diálogo que da la vuelta** (la madre). Sin moraleja ni epílogo.
7. Números exactos y redondos para la imagen: 47 arañazos, 30 segundos, tres estados, cinco pavos.
8. Visual: primer plano con acción (una bala volando a cámara lenta), caídas cómicas a cámara lenta en la tierra, primerísimos planos de manos y objetos, vista aérea que se abre para mostrar el sitio entero.

# 79 · Las vacas con gafas · PLAN v3 (v2 + las 4 revisiones, 28-11-2026)
Informes: `revisiones/plan_v2/1_luces.md`, `2_camara.md`, `3_personajes.md`, `4_logica.md`. Lo que se ha aplicado está aquí; lo que no, está marcado en cada informe con su motivo (rótulos flotantes prohibidos, estilo .99 aprobado por el usuario, límite de textos).

## 1. Reglas
### Prueba sin sonido
Cada frase se entiende con el volumen quitado y sin leer el subtítulo. La acción empieza 0,2–0,3 s **antes** de la palabra.

### Ritmo
- Las referencias están grabadas a 2×: en tiempo real cortan cada **3,4–3,8 s**.
- **28 planos en unos 68 s, una media de 2,4 s.** Va algo más rápido que las referencias, porque nuestro guion tiene más frases, pero nunca 4 acciones en 1 s.
- **Una acción por palabra con carga.**
- Entre cortes se alterna la escala (PG ↔ PP, PM ↔ inserto). Nunca más de 2 acercamientos seguidos.

### Cámara
- **Tipos de plano:**
  - **PM**, cortado por la cadera: plano por defecto. Con un personaje solo, la cara ocupa el 25–35 % del ancho; con dos sujetos, cada cara al 15–20 %.
  - **PP**: solo caras y reacciones, sin acciones de manos por debajo del pecho.
  - **PG**: para situar, como mucho 2 s.
- **Cámara:** altura de pecho (1,2–1,4 m), yaw de 35–40° respecto a la pared, y barrote, valla o saco desenfocado en primer término en la mitad de los planos.
- **Movimientos:** acercamiento (alrededor del 45 %), lateral (25 %), alejamiento que revela (15–20 %), grúa (10 %).
  - La órbita, como mucho ±15° (los personajes son planos).
  - Sacudida de 0,3 s en los golpes. La cámara nunca está quieta más de 1 s.
- **Zonas del cuadro:**
  - la cabeza, las manos que actúan y el objeto de la frase van entre y=350 y y=1250, fuera de la banda del subtítulo (y 1300–1430);
  - en los saltos y los brazos arriba se deja un 25 % de aire por encima.
- **Transiciones:**
  - corte seco en la palabra, por defecto;
  - **fundido con acercamiento solo en 2 sitios**: el visor (entrada y salida cuentan como uno, con máscara de lente redondeada mientras se está dentro) y la revelación de las 180 vacas.
  - Los días se ven en el **letrero DÍA de la pared**, junto a la pizarra, con un lateral que va del letrero a la acción. Sin insertos sueltos.

### Actuación (por programar)
- **Brazos con codo** (2 huesos).
- **Poses:**
  - **Brazos:** jarras, señala, brazosArriba, brazosArribaGrito, barbilla, rascaCabeza, manoOreja, cruzado.
  - **Cuerpo y gestos:** encoge, encorvado (carga pesada), niega con el índice, se tapa la boca.
  - **Reírse:** risaAtras (cabeza atrás y puño arriba), tripaRisa, palmadaRodilla.
  - **Con objetos:** cargaHombro, cargaDos, escribe, golpeaPizarra, calientaManos, dirige, empuja, paga, recibe (coge al vuelo), señalaSien.
  - **Andar y mirar:** anda en diagonal, mira por encima del hombro.
  - Se encadenan con anticipación, exageración y asentamiento.
- **Cuerpo:** se estira y se aplasta, se inclina, la cabeza gira y se ladea, salta con la sombra encogiéndose.
- **Caras nuevas:** risa, lagrimas, aburrido, platos, dientes, guiño, confiado, concentrado, sudor, tristeza, sorpresaBoca, duda.
- **Vacas:**
  - el dibujo `vaca2d` aprobado, más una **versión en 3/4** nueva del mismo dibujo;
  - poses: cabezaCaida, bostezo, mastica, ojosCerrados, balanceo, lameAire, muge, nervios (tiembla, cola que azota, gotas de sudor) y alivio.
- **El que no habla siempre reacciona**, y la reacción está escrita en cada plano.
- Personajes y vacas **de cara o en 3/4**, nunca vistos de canto.

### Luz (valores; los ajusto en la hoja de bocetos)
| sitio | luz clave | sombra | pared / suelo | otros |
|---|---|---|---|---|
| Cine, antes del 27 | #FFF4E0, 5200 K, luz de nieve por la ventana (blanda, fría; haz suave, nunca sol duro mientras nieva) | azul #4A6FA5 al 35 % | pared ocre #D9A25F, suelo más oscuro #C98A3A (separado de la pared) | rim frío #8FD0FF del lado de la ventana |
| Cine, después del 27 | 3600 K: la luz tiñe, el material no cambia | púrpura cálido #7A4A6A | pared ≈#E39A4F, suelo ≈#C98A3A; **blanco de las vacas tope #FBE6C8** (no más naranja) | ventanas naranjas, +10 % de brillo, cambio en 0,6 s empezando con el salto, sin destello; se mantiene el rim #8FD0FF; visores que iluminan los morros #3CF0B0 |
| establo del vecino | estufa #FF7A30 a la derecha (parpadeo 8 Hz ±15 %) | ventana #5A8CFF a la izquierda | | en la frase 12, −20 % de saturación y algo más oscuro: «cargado» |
| exterior nevado | plano 4 (nevada fuerte): cielo cubierto, sin sol; planos 3 y 8: sol bajo entre nubes | azul #6E8CC8 al 45 % | nieve tope #E8EEF8 | cielo cubierto #8A9AB8 → #D8DEE8 (plano 4) / #2B3F7A → #F4B98A (3 y 8); ventanas #FFB347 |
| prado | sol #FFE066 con anillo #FFB347 | verde #2F7A3A | verde #4CAF3A | cielo #3FA0F0 → #9AD8FF |
| tienda | lámpara #FFB45A | | estantes de colores saturados | |
| vecino, plano 28 (estufa apagada) | ventana #5A8CFF + luz de los visores #3CF0B0 en las caras | azul oscuro | | sin parpadeo de estufa |
| pizarra | | | #16322A con marco #7A4A25 | tiza #FFF6D0; el 27 en #FFD84A |
| 180 vacas | penumbra azul #1E2B4A | | | visores en ola, foco dorado sobre el Cine |

En todos:
- **Contorno negro** en todo el decorado.
- **Niebla 0 dentro y ≤8 % fuera, viñeta ≤10 %.**
- **Blanco de las vacas tope #F2F0EA**, y detrás de una vaca blanca el fondo siempre más oscuro o más saturado.
- **Sombra de contacto** bajo cada personaje.
- Paredes lisas y saturadas, sin puntos sucios.
- La dirección del sol es fija en cada sitio.

### Textos (solo 4 objetos)
Pizarra LITROS POR VACA (el Cine) y la del vecino, que es el mismo objeto; letrero DÍA; saco PIENSO PREMIUM; caja GAFAS VR. Todo lo demás, con iconos (la tele con un presentador, el bote de vitaminas con una pastilla dibujada, billetes).

### Estado (máquina de estados comprobada por programa)
| frases | pizarra Cine | pizarra vecino | DÍA | vacas con visor | luz Cine |
|---|---|---|---|---|---|
| 1–8 | 22 (escrito en la frase 4) | 22 (se ve en la 6) | vacío | 1A: 1 · desde la 7: 2 | fría |
| 9 | 22 | | 1 | 2, quietas | fría |
| 10 | 22→23→24 | | 5 | 2, empiezan a balancearse | fría |
| 11 en adelante | 27 | 22 | 10 | 2 | dorada |
| 16 | | | | 12 (2 + 10) | |

Lo que lleva cada uno en la mano va anotado en cada plano. La tiza no se suelta nunca: en el salto del 11 la lleva en la mano.

## 2. Lista de planos (28)
**[tipo · movimiento · entrada]** — acción por palabra · *reacción del otro* · lo que se mueve solo.

**Frase 1 (unos 6 s)** · «Este granjero le puso gafas de realidad virtual a sus vacas… mientras su vecino les compraba el pienso más caro.»
1. [PM 3/4 · acercamiento · fotograma 0] Establo del Cine. Desde el fotograma 0 tiene en las manos un visor; la vaca, en 3/4 y separada en diagonal, todavía no lleva nada.
   - *Este granjero*: levanta el visor.
   - *le puso gafas*: se lo encaja a la vaca; la correa hace clic, el visor se enciende y su luz verde ilumina el morro.
   - *a sus vacas*: la vaca pone ojos `platos`; el Cine, `confiado`, levanta el pulgar.
   - Barrote del cubículo desenfocado delante.
2. [PM contrapicado ligero · lateral · corte en «mientras»] La tienda: el tendero tras el mostrador; la caja GAFAS VR, ya en la estantería del fondo.
   - El vecino **deja los billetes de un golpe** y el tendero le da el saco PIENSO PREMIUM (las estrellas brillan).
   - El vecino se lo carga al hombro y se tambalea (`encorvado`). *El tendero cuenta los billetes.*

**Frase 2 (unos 2,4 s)** · «¿Y qué les vas a poner, el telediario?»
3. [PM · alejamiento suave · corte] Exterior nevado. El saco está apoyado en la valla de primer término.
   - El vecino señala al Cine con cara `pícaro`.
   - *el telediario*: le sale encima de la cabeza un **bocadillo de pensamiento** con una tele y un presentador, y se ríe.
   - *El Cine, al fondo al otro lado de la valla: `aburrido`, brazos cruzados.* Nieva y sale vaho.

**Frase 3 (unos 4,8 s)** · «Es invierno en Turquía: meses de nieve, y las vacas encerradas mirando la misma pared.»
4. [PG · grúa que baja · corte] El pueblo y el establo enterrados en nieve, con **un minarete al fondo** (Turquía), humo, carámbanos y la nieve hasta media ventana. Nevada fuerte.
5. [PM · lateral hacia la pared · corte] Dentro. Tres vacas en 3/4, **con la cabeza girada hacia la pared**, cara `aburrido`. Una mastica despacio y una mosca da vueltas. La cámara avanza junto a ellas hasta la mancha y la grieta de la pared. La tele vieja está apagada en el estante (queda establecida).

**Frase 4 (unos 3,6 s)** · «Y una vaca aburrida da menos leche: veintidós litros al día. Ni uno más.»
6. [grúa que baja de la cara al cubo · corte] *aburrida*: la vaca bosteza y deja caer la cabeza y las orejas. *menos leche*: la grúa baja hasta el cubo bajo la ubre, que solo recibe **gota… gota** (cubo y gota en y < 1250).
7. [PM · lateral hasta la pizarra · corte] *veintidós*: el Cine termina de escribir el 22 (trazo y polvo de tiza). *Ni uno más*: un golpe en el 22 con la tiza y **niega con el índice**. *Detrás, una vaca dormita.* El letrero DÍA, vacío, cuelga al lado.

**Frase 5 (unos 2,2 s)** · «En el pueblo ya le llaman "el Cine".»
8. [PM · lateral · corte] Calle nevada con tejados y campanario.
   - El Cine pasa en diagonal con **el visor subido en la frente**.
   - A un lado, sin taparle, dos vecinos del pueblo (otra ropa y otras caras) **con un cubo de palomitas**: uno hace la pantalla de cine con las manos y el otro se ríe comiendo palomitas.
   - *El Cine, de reojo: `duda`.*

**Frase 6 (unos 4,2 s)** · «El vecino lo tiene claro: pienso de primera, vitaminas… y una estufa en el establo.»
9. [un lateral continuo · corte] El establo del vecino, cálido de estufa, con **su pizarra con el 22** al fondo.
   - *lo tiene claro*: se toca la sien (`confiado`).
   - *pienso*: vuelca el saco y los gránulos caen en cascada.
   - *vitaminas*: agita el bote y rebotan pastillas.
   - *estufa*: la estufa, a la altura del pecho; cierra la puerta con el pie, saltan chispas y se calienta las manos.
   - *Sus vacas comen sin ganas.*

**Frase 7 (unos 3,2 s)** · «El Cine solo tiene unas gafas y dos vacas para probar.» (*ver la pregunta del final*)
10. [PP de las manos con el visor → alejamiento que revela · corte] *gafas*: levanta el visor a la luz (destello). *dos vacas*: la cámara se aleja y aparecen 2 vacas escalonadas en profundidad; él hace **«2» con los dedos**, cerca de la cámara. *Una muge (boca abierta, onda); la otra mira el visor con curiosidad.*

**Frase 8 (unos 4 s)** · «Les pone un prado de verano: hierba, flores, sol… y música clásica.»
11. [PP del visor · acercamiento que **entra** · fundido] Pulsa el botón y la cámara se mete en el visor.
12. [PG del prado · grúa que sube · con máscara de lente redondeada] *hierba*: se mece. *flores*: brotan con un rebote. *sol*: el sol enorme y sus rayos.
13. [PM · lateral · fundido de salida hacia atrás] *música clásica*: las notas salen de los visores. **Las vacas parpadean desconcertadas: todavía no se balancean.** El Cine dirige con la tiza como si fuera una batuta, muy serio.

**Frase 9 (unos 3,5 s)** · «Día uno: las vacas ni se mueven. El vecino se parte de risa.»
14. [lateral del letrero DÍA a las vacas · corte] *Día uno*: el letrero pasa a «1». *ni se mueven*: las vacas, petrificadas. **Una mosca grande** les vuela en zigzag y se les posa en el morro: ni un parpadeo.
15. [PM · alejamiento con temblor · corte] El vecino, en la puerta. La risa empieza 0,3 s antes de la palabra:
   - `risaAtras`: cabeza atrás, ojos ^^ y boca enorme;
   - se dobla sujetándose la tripa (`tripaRisa`) y le saltan lágrimas.
   - *El Cine, al fondo: suspira y deja caer los hombros.*

**Frase 10 (unos 2 s)** · «Día cinco: la pizarra empieza a subir.»
16. [grúa que sube con los números · corte] El letrero DÍA pasa a 5. En la pizarra, 22 → 23 → 24. El Cine se acerca con las cejas arriba (`platos`). *Detrás, las vacas empiezan a balancearse con los ojos cerrados.*

**Frase 11 (unos 1,8 s)** · «Día diez: veintisiete litros.»
17. [alejamiento con aire arriba · corte] El letrero DÍA pasa a 10.
   - El Cine, en 3/4 junto a la pizarra sin taparla, escribe el **27 en amarillo**.
   - **Salta con los brazos arriba**, con la tiza en la mano.
   - La luz pasa a dorada en 0,6 s, empezando con el salto (sin destello).

**Frase 12 (unos 3,3 s)** · «Y en el establo de al lado, con estufa y vitaminas… veintidós.»
18. [lateral · corte] El establo del vecino, más oscuro y apagado.
   - La estufa ruge; el vecino **suda a chorros**, se le escurre el bote y las pastillas ruedan.
   - Sus vacas, aplatanadas.
   - El lateral termina **justo en «veintidós»** en su pizarra: 22. *El vecino traga saliva.*

**Frase 13 (unos 4,5 s)** · «¿Por qué? Porque una vaca estresada retiene la leche… y una tranquila la suelta.»
19. [PM · acercamiento · corte] *¿Por qué?*: el Cine se rasca la cabeza (`rascaCabeza`).
20. [PP · acercamiento · corte] *estresada retiene*: la cara de una vaca del vecino, sin visor, junto a la estufa: tiembla, suda y tiene una nube con rayo encima. Da una coz y su cubo **vacío** rueda por la parte de abajo del plano (por encima de y=1250).
21. [PM · lateral en el mismo sentido · corte] *tranquila la suelta*: la vaca del Cine, con visor: ojos cerrados, corazones, cara de `alivio`, y **un chorro de leche** cae en su cubo.

**Frase 14 (unos 3,5 s)** · «Y a su cabeza le da igual que la hierba sea de mentira.»
22. [PP · órbita de ±15° · corte] La vaca con visor **intenta comerse la hierba**: lame el aire y mastica nada, feliz, con el reflejo verde en la cara y corazones.

**Frase 15 (unos 3 s)** · «Los expertos aún lo dudan… pero la pizarra no miente.»
23. [PM · lateral de la tele a la pizarra · corte] La tele del estante, ahora encendida: un experto con bata y corbata, **sin gafas**, niega con la cabeza y levanta una ceja. *El Cine la mira con los brazos cruzados.* *la pizarra no miente*: se gira y da dos golpes al 27 (`confiado`).

**Frase 16 (unos 3,8 s)** · «El Cine encarga diez gafas más, para sus ciento ochenta vacas.»
24. [PM · grúa que baja y sube · corte] Pide por teléfono (`manoOreja`, con la cara entre y=350 y y=750). *diez gafas*: caen **10 cajas GAFAS VR** en menos de 1 s, a ritmo de pulso, rebotan y se apilan entre y=900 y y=1250 (fuera del subtítulo).
25. [PG · alejamiento grande · fundido] *ciento ochenta vacas*: el establo largo con filas sin fin. **Se encienden 12 visores en ola** y el resto de vacas sigue sin visor. El Cine, pequeño en medio de las filas sin fin, abre los brazos.

**Frase 17 (unos 3,2 s)** · «Y el vecino vuelve a la tienda… y esta vez no compra pienso.»
26. [PM · travelling que lo acompaña en diagonal · corte] Suena la campanilla de la puerta. Entra el vecino con gorro, cabizbajo. El tendero le ofrece el saco de PIENSO y él **lo aparta con la mano**. *El tendero: `sorpresaBoca`.*

**Frase 18 (unos 1 s de voz + 2 s sin voz)** · «Compra unas gafas.»
27. [PM · acercamiento · corte] El vecino **señala la caja GAFAS VR** con un dedo enorme. *El tendero: `platos`.*
28. [PM · alejamiento que revela · corte, sin voz] Chiste final:
   - el establo del vecino con la estufa apagada y sus vacas con visor, balanceándose;
   - el vecino, con las gafas en la frente y los brazos cruzados… **se las baja a los ojos** y se pone a balancearse también.
   - Corte a negro.

## 3. Revisión con los 4 agentes
1. Este plan v3: ¿quedan BLOQUEA?
2. Bocetos: 1 fotograma por plano + tiras a 6 fps de las acciones clave + la hoja de poses y caras.
3. Vídeo final: hoja cada 0,5 s + transiciones + máquina de estados + auditor de cámara (≤1 s quieta; cabeza, manos y objeto dentro y fuera del subtítulo) + detector de fotogramas rotos.

No se avanza con un BLOQUEA abierto.

## 4. Pregunta para el usuario
La frase 7 dice «unas gafas», pero se prueban en **dos** vacas (en la historia real fueron dos). Propuesta: «El Cine solo tiene **dos gafas**… y dos vacas para probar». Si no, el Cine pasaría el mismo visor de una vaca a otra.

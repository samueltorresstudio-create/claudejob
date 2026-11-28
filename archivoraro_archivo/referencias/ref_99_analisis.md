# Referencia «Por qué los precios terminan en .99» (@AhoraEres_Tú, YouTube Shorts, 1:46) — 23-11-2026

Dos grabaciones de pantalla del usuario (≈28 s en total). Hojas: `ref_99_sheet_1..4.jpg`.

## Personajes
- Cabeza = esfera grande blanco crema (no blanco puro), contorno negro grueso (~6-8 px a 1080), ocupa ~40 % de la altura total.
- Cuerpo = «cápsula/bala» con volumen 3D (sombreado suave, brillo arriba), color plano de la prenda. Sin cuello: la cabeza se apoya encima.
- Piernas y brazos = palitos negros finos y largos; manos = bolitas negras. Las piernas son ~35-40 % de la altura (más largas que las nuestras).
- Pelo: casquete negro/castaño pegado al cráneo con borde irregular (no mechones sueltos). Mujer: pañuelo rojo de lunares blancos + melena castaña cayendo por un lado.
- Distinguir personajes SOLO por: color de prenda (granate, verde, azul, rojo, delantal blanco), sombrero/gorra y bigote.
- Vestuario con 2-4 detalles gruesos: solapas blancas en V, pajarita roja de lunares, botones dorados en columna, bolsillo con línea, corbata roja sobre cuello amarillo, delantal blanco con tirantes. Bombín marrón con brillo especular.

## Caras (2D sobre la esfera)
- Ojos = rayas/arcos gruesos (párpado), cejas = arcos gruesos encima. Ojos de punto solo en sorpresa o en secundarios.
- Bigote enorme marrón con relleno y contorno (protagonista) o bigote negro de «manillar» (cajero).
- Boca = una línea curva pequeña (sonrisa ladeada). Casi sin boca abierta.
- Expresiones: ceño fruncido (cejas en V), satisfecho (ojos cerrados en arco), pícaro (un ojo guiña + media sonrisa), preocupado (cejas en ∧, ojos caídos), sorpresa (ojos de punto + boca «o»).
- La cara se pega a la esfera y gira con ella (en ¾ se desplaza al lado).

## Luz y sombras
- Luz cálida de interior (lámparas colgantes amarillas). Toda la escena con tinte ámbar/sepia suave, sin quemar.
- En los personajes: sombreado suave de volumen (degradado oscuro hacia el lado contrario de la luz) + brillo de borde (rim) cálido. La cabeza tiene una sombra sutil abajo y un leve oscurecimiento por el ala del sombrero.
- Sombra de contacto suave en el suelo; nada de sombras duras.
- Viñeta oscura en las esquinas y motas de polvo/bokeh flotando (pocas, pequeñas).

## Fondos y escenarios 3D
- Almacén general del s. XIX: estanterías de madera hasta el techo llenas de latas/cajas de colores (rojo, verde, azul, amarillo) → mucho color y textura; mostrador de madera con cajones y tiradores de latón; caja registradora dorada; estufa de hierro; barriles de manzanas; lámparas colgantes; suelo de tablas.
- Fachada: letrero verde «ALMACÉN GENERAL», cristales con letras doradas «ABARROTES · FERRETERÍA», columnas verde agua, puertas acristaladas.
- Profundidad de campo marcada: fondo desenfocado, personaje nítido. Pero los fondos son reconocibles (no manchas).
- Atrezo con texto legible en español: cartel «99¢» con doble marco rojo, «$1,00», billete «UN DÓLAR», periódico «EL HERALDO – GRAN COSECHA».

## Cámara y movimiento
- Un plano por frase (~1-1,5 s). Primer plano del protagonista con el atrezo pegado a la cara; planos medios para grupos (5 en fila).
- Zoom lento continuo (push-in) en cada plano y pequeños travellings laterales; cortes con un desplazamiento/whip rápido.
- Animación limitada: brazos que se levantan señalando o sujetando un objeto, cruzar brazos, giro de cabeza a otro personaje, cambios de expresión en la palabra clave. Cuerpo casi rígido con un leve balanceo.
- Personajes de espaldas en primer término (sobre el hombro) para dar profundidad.

## Subtítulos
- 1-2 palabras, mayúsculas, blanco con contorno negro grueso, en el centro (~60 % de altura). Igual que los nuestros.

## Qué aplicar a lo nuestro
1. Cabeza crema (#F3E9D6 aprox.) en lugar de blanco puro, con sombreado y rim cálido.
2. Cuerpo cápsula con brillo y 2-4 detalles gruesos; piernas más largas y finas.
3. Bigotes y sombreros grandes como seña de identidad; pelo en casquete.
4. Fondos muy llenos de objetos de colores variados (no planos ni lisos), con DOF pero reconocibles.
5. Atrezo con texto en español legible pegado al personaje.
6. Push-in lento en cada plano.

## Movimiento (análisis 24-11-2026, a 8–15 fps + medición con OpenCV `proyectos/73_boceto_capsula/cam_motion.py`)

### Cámara
- **Cortes secos** entre planos (no vuela de un plano a otro). Un plano cada **1,4–2,6 s** (≈ 2–4 palabras de subtítulo).
- Cada plano cambia de tamaño o de ángulo: primer plano → plano por encima del hombro → general exterior → primerísimo plano → detalle de objeto → plano de grupo.
- **Dentro del plano la cámara nunca está quieta**: acercamiento lento del **1–6 %** por plano y deriva lateral de 10–100 px (en 1080 de ancho).
- **Plano de situación** (fachada del almacén): acercamiento fuerte + grúa hacia arriba, **zoom ×1,4–1,5 en ~4 s**, con el letrero bajando en el encuadre. Un transeúnte desenfocado pasa por delante (primer término) para dar profundidad.
- Planos de detalle (cartel «$1,00», botella) con el personaje cortado en el borde y gente al fondo.
- Desenfoque fuerte del fondo siempre; personaje nítido.

### Brazos
- Brazos de goma: **una sola curva suave**, sin codo. Grosor constante, mano bola.
- **Pose a pose**: el brazo pasa de la pose A a la B en **2–3 fotogramas (≈0,1–0,15 s)** con frenada suave y luego **se queda quieto**. Nada de balanceo continuo.
- Gestos vistos: levantar un cartel junto a la cara; sostener un objeto delante del pecho; **señalar** con el brazo totalmente recto hacia un lado; cruzar los brazos; dar un billete (brazo estirado al otro personaje); mano levantada a la altura del hombro (saludo/explicación); mano en la barbilla.
- El objeto que se sostiene va pegado a la mano y se mueve con ella.

### Cuerpo, caras y andar
- Los personajes están **casi quietos**: no hay respiración ni balanceo apreciable. La vida la dan la cámara, los brazos y la cara.
- **La cara cambia en la palabra clave** (cejas, ojos cerrados contentos, ojos de punto en la sorpresa, guiño). Cambio instantáneo, sin transición.
- Giro de cabeza = los rasgos se desplazan hacia un lado de la esfera (¾), el cuerpo apenas gira.
- **Andar**: en estos 28 s no hay un paseo completo; solo un transeúnte en primer término que cruza con un ligero bote de la cabeza. Para andar usaremos piernas de palo alternando + bote vertical pequeño (pendiente de ver un ejemplo).

### Escenarios 3D
- **Interior del almacén (s. XIX)**: estanterías de madera hasta el techo llenas de latas, cajas y frascos de colores (rojo, verde, azul, amarillo, blanco); mostrador largo de madera con cajones y tiradores de latón; caja registradora dorada; estufa de hierro barriga; barriles de manzanas; taburetes; columnas de hierro; lámparas colgantes de tulipa blanca; techo con molduras; suelo de tablas; ventanales muy luminosos al fondo.
- **Exterior**: fachada con letrero verde «ALMACÉN GENERAL» en letras doradas, cristales con rótulos dorados «ABARROTES · FERRETERÍA», columnas verde agua, puertas dobles acristaladas, cielo azul con nubes.
- **Luz**: cálida, suave, con rebote (iluminación global), ventanas quemadas con bloom, motas de polvo flotando, niebla ligera, viñeta. Sin contornos negros en el escenario (solo los personajes tienen contorno).
- Personajes 2D colocados dentro del 3D a escala (≈1,7 m), con sombra suave en el suelo y el fondo desenfocado detrás.

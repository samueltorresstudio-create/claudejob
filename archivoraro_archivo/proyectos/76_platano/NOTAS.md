# 76 · El plátano de seis millones — notas de proyecto (23-11-2026)
Guion: `archivoraro_archivo/textos/guion_76_platano.txt` (v3, estilo cuentas de referencia).
Decorados en Blender (`blender/platano.py` → `build.sh` → `glb_platano.js`, no se versiona: se regenera). Motor: copiar de `75_poyais` (three_post.js, util3d.js, stick.js, hair.js, core3d.js, render.js).
Sitios: gallery (x 0) · auction (1000) · stage (2000) · stand (3000). Suelos aparte (`*_floor`, sin contorno).
Plátano: `bananaskin` con shader de maduración (`W2.ripe(0..1)`: verde→amarillo→manchas→negro). Obra = `wallpiece` (plátano + cinta continua con arrugas). Láseres: `W2.lasers(true)` (rejilla roja + luz puntual). Charco de luz: `W2.poolOn(op)`.
Reglas aplicadas: `references/reglas_75.md` (nada en zonas de paso, fondos con detalle, cámara en movimiento, expresiones).
Lecciones: vertical estrecho → sala de 24 m de ancho; el 2D va siempre encima del 3D (tapar piernas tras la mesa con `clipAt`); el plátano mordido se dibuja como overlay SVG (`biteBanana`) calibrado con `headScr`; `shot.js` evalúa el JSON en Node → pasar objetos SVG como `holdRn:"NOMBRE(args)"`.
Gancho visual recomendado: A (láseres) → B (mordisco) → F (podredumbre/otro plátano) — ver `bocetos/hoja_gancho.jpg`.
Pendiente: aprobación de bocetos → escenas `sc76.js`, voz (clonada o ElevenLabs), render, revisión (checklist de reglas_75).

## Mejora total (23-11-2026, a petición del usuario: «todo muy simple»)
- stick.js ampliado (también vale para vídeos futuros): `trousers` (pantalón de pierna entera con raya, bajo y franja lateral `pstripe`; `jeans` con costuras), `heels` (tacón con tira), `sneaker` (zapatilla con suela y cordones), frac con faldones detrás de las piernas (`tails`) y chaleco `vestCol`, vestido con `pleats`, `hemTrim`, `buckle`, `necklace`, `bodiceTrim`. (Copia anterior: stick.before76.js.)
- Plátano: 5 aristas marcadas, cuello fino, rabo con corte claro, punta negra; shader con tinte verdoso en los extremos, manchas redondas, brillo y maduración (`ripe`).
- Cinta: objeto aparte (`tape`) con trama de tela (canvas con UV forzada x,y), brillo diagonal, rozaduras, puntas rotas en sierra y despegadas, arrugas finas.
- Láseres: 20 haces con núcleo + halo + resplandor, emisores en paredes y techo, puntos de impacto, barrido animado con `setTime`, cámaras de vigilancia y baliza giratoria.

## Plátano y cinta, 2.ª mejora (23-11-2026)
- Plátano: UV (u largo, v alrededor) exportadas desde Blender; el shader (`ripeMat`) usa `vMapUv` (hace falta `map` ficticio): aristas con línea oscura, vetas, pecas alargadas, moratones, cuello y punta verdosos, brillo y maduración. Forma orgánica (ligera variación del radio y de la torsión).
- Cinta: malla de rejilla 130×14 con arrugas suaves (sobre todo donde dobla sobre el plátano), bordes ondulados, extremos rotos irregulares y puntas despegadas; textura de tela con hilos finos, grano, rozaduras y reflejos. SIN contorno por casco invertido (con tanta malla sale con rayas): lleva un contorno plano aparte (`tape_ink`).
- Lección: planarUV fallaba en la cinta (eje más fino = y); forzar ejes x,y.

## Cinta atravesaba el plátano (corregido 23-11-2026)
Causa: la cinta era un arco fijo centrado en su propio punto medio, pero el plátano cruzaba ≈0,42 m más abajo (la tira estaba descentrada y girada 0,5 rad), así que el plátano la tapaba o la atravesaba.
Arreglo: el origen de la cinta = centro del plátano y `tape_z(x,y)` calcula la altura de cada punto sobre la superficie REAL del plátano (radio y curvatura de `banana()`), con bajada suave a la pared por los flancos. Regla: lo que se pega a un objeto debe calcularse sobre su superficie, no con un arco a ojo. Comprobar siempre con 3 ángulos (frente, lateral, picado).

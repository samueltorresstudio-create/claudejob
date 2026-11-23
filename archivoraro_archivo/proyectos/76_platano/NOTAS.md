# 76 · El plátano de seis millones — notas de proyecto (23-11-2026)
Guion: `archivoraro_archivo/textos/guion_76_platano.txt` (v3, estilo cuentas de referencia).
Decorados en Blender (`blender/platano.py` → `build.sh` → `glb_platano.js`, no se versiona: se regenera). Motor: copiar de `75_poyais` (three_post.js, util3d.js, stick.js, hair.js, core3d.js, render.js).
Sitios: gallery (x 0) · auction (1000) · stage (2000) · stand (3000). Suelos aparte (`*_floor`, sin contorno).
Plátano: `bananaskin` con shader de maduración (`W2.ripe(0..1)`: verde→amarillo→manchas→negro). Obra = `wallpiece` (plátano + cinta continua con arrugas). Láseres: `W2.lasers(true)` (rejilla roja + luz puntual). Charco de luz: `W2.poolOn(op)`.
Reglas aplicadas: `references/reglas_75.md` (nada en zonas de paso, fondos con detalle, cámara en movimiento, expresiones).
Lecciones: vertical estrecho → sala de 24 m de ancho; el 2D va siempre encima del 3D (tapar piernas tras la mesa con `clipAt`); el plátano mordido se dibuja como overlay SVG (`biteBanana`) calibrado con `headScr`; `shot.js` evalúa el JSON en Node → pasar objetos SVG como `holdRn:"NOMBRE(args)"`.
Gancho visual recomendado: A (láseres) → B (mordisco) → F (podredumbre/otro plátano) — ver `bocetos/hoja_gancho.jpg`.
Pendiente: aprobación de bocetos → escenas `sc76.js`, voz (clonada o ElevenLabs), render, revisión (checklist de reglas_75).

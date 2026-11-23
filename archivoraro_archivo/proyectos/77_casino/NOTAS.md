# 77 · Las tres reglas secretas de los casinos (23-11-2026)
Guion aprobado por el usuario: `archivoraro_archivo/textos/guion_77_casino_PROPUESTA.txt` (sin nombres propios).
Estado: **bocetos enviados el 23-11-2026, esperando el OK del usuario** antes de hacer el vídeo.

## Lo nuevo (para todos los vídeos desde el 77)
- `stick.js`: cabezas con mandíbula propia (`chin`: round/square/point/wide/long/soft), orejas (`ears`), nariz (`noseStyle`: button/round/long/hook/pointy/small),
  mejillas en gris azulado (**sin rubor rosa**, `blush` ya no dibuja nada), ojeras (`bags`), pestañas (`lashes`), cejas pobladas (`bushy`, `browW`, `browArch`),
  barba incipiente (`stubble`), pecas (`freckles`), lunar (`mole`), gorro de electrodos (`hat:'eeg'`).
- Caras nuevas (`face`): wary, tired, sly, dreamy, shock, hypno, focus, up. Bocas nuevas (`mouth`): pout, teeth, gasp, yawn, half, tsk, cheer, worry.
- `hair.js`: slick, bob, pony.
- Sitios 3D (Blender → `casino.glb` → `glb_casino.js`): hall (sala sin ventanas con arcos de neón), office, glass (pared de cristal con ciudad de día), maze (laberinto + pasillo estrecho `corr`), lab.
- Objetos sueltos: tragaperras «héroe» con pantalla pintada, reloj grande con agujas (`W.clock(h,m,cover)` y trapo), plástico negro (`W.plastic(k)`).
- `sheet77.html` + `sheet.js` + `make_sheets.py`: hojas de reparto, expresiones y caras.

## 23-11-2026 · el usuario NO aprobó las caras «C» («Nono, ¿qué le has hecho a los personajes en las caras?»)
Orejas, nariz, mandíbulas y sombreado de mejillas cambiaron el aspecto del canal. `stick.js` ahora tiene interruptores `window.FACEOPT77`
(`chin, ears, nose, cheeks, extras, shine`): A = todo a 0 (como el 76, sin rubor) · B = solo `extras` y `shine` (ojeras, pestañas, cejas pobladas, barba, pecas, brillo en el ojo) · C = todo.
Se enseñó `bocetos/comparativa_caras.png`; esperar su elección. Las caras y bocas nuevas (wary, tired, sly…, pout, teeth…) se mantienen en las tres.

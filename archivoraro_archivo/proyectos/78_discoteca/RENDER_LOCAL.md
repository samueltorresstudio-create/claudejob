# Render del 78 en el ordenador del usuario (Windows)

La sesión de la nube prepara TODO (escenas, voz `narration.wav`, mezcla `audio.wav`, `voice.js`) y lo sube a la rama
`claude/archivoraro-skill`. Aquí solo se renderizan los fotogramas y se monta el MP4.

## Preparación (una vez)
1. Instalar si faltan: Git, Node.js LTS, Python 3, ffmpeg  (`winget install Git.Git OpenJS.NodeJS.LTS Python.Python.3.12 Gyan.FFmpeg`).
2. Clonar: `git clone -b claude/archivoraro-skill https://github.com/samueltorresstudio-create/claudejob.git` (o `git pull` si ya está).
3. En `archivoraro_archivo/proyectos/78_discoteca`: `npm init -y`, `npm install playwright`, `npx playwright install chromium`.

## Render
- Comprobar que existe `audio.wav` (si no, la nube aún no ha terminado: esperar y hacer `git pull`).
- Prueba rápida: `node render.js preview 1,20,40` → mirar `preview/`.
- Completo: `node render.js full 6` (6 = pestañas en paralelo; subir/bajar según los núcleos del PC).
  Si se corta, relanzar: solo hace falta `node render.js full 6` con `R0=<fotograma>` para seguir.
- Montar: `ffmpeg -y -framerate 30 -i frames/f%05d.png -i audio.wav -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -b:a 192k -shortest 78_discoteca_CON_VOZ.mp4`
- Revisar el MP4 entero antes de darlo por bueno: cabezas cortadas, personajes atravesando decorado, fotogramas en blanco.

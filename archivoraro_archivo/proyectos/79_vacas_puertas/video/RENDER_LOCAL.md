# Render del 79 (las vacas con gafas) en el ordenador del usuario (Windows)

La nube deja TODO listo en la rama `claude/archivoraro-skill` (escenas, decorados, tiempos estimados). Este vídeo va **sin audio** por ahora.

## Preparación (una vez; si ya se hizo con el 78, saltar)
1. Instalar si faltan: Git, Node.js LTS, ffmpeg (`winget install Git.Git OpenJS.NodeJS.LTS Gyan.FFmpeg`).
2. `git pull` en la carpeta del repo (o `git clone -b claude/archivoraro-skill https://github.com/samueltorresstudio-create/claudejob.git`).
3. En `archivoraro_archivo/proyectos/79_vacas_puertas/video`: `npm init -y`, `npm install playwright`, `npx playwright install chromium`.

## Render
- Prueba rápida: `node render.js preview 2,30,60` → mirar la carpeta `preview/`.
- Completo: `node render.js full 6` (6 pestañas en paralelo; ajustar a los núcleos del PC). Son ~2.100 fotogramas (70 s a 30 fps).
  Si se corta: relanzar con `set R0=<fotograma>` y `node render.js full 6` para seguir desde ahí.
- Montar SIN audio: `ffmpeg -y -framerate 30 -i frames/f%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart 79_vacas_SIN_AUDIO.mp4`
- Revisar el MP4 entero: cabezas cortadas, personajes atravesando decorado, fotogramas en blanco.
- Subir el MP4 (o pasárselo a la nube) para la revisión final.

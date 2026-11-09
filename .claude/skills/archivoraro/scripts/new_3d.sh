#!/bin/bash
# new_3d.sh <WS> <name> : nuevo proyecto con el ESTILO 3D (mundo three.js + personajes 2D de cabeza redonda). Luego script.json + scenes_p.js + audio.py.
set -e
K="$(cd "$(dirname "$0")/.." && pwd)"; WS="$1"; P="$WS/$2"
[ -z "$2" ] && { echo "usage: new_3d.sh <workspace_dir> <project_name>"; exit 1; }
mkdir -p "$P"
cp "$K"/engine_3d/{three_post.js,util3d.js,world3d.js,stick.js,hair.js,core3d.js,render.js,index.html} "$P/"
echo "$P ready (estilo 3D). Escenas: scenes_p.js → cp scenes_p.js scenes.js (no hace falta cat de props)."

#!/bin/bash
# new_sucesos.sh <WS> <name> : project in the SUCESOS style (canvas engine, faceless figures, painterly textures).
# Then write script.json (sentence case caps) + scenes.js (EVS, S, window.CFG={tex:[...]}) + audio.py.
set -e
K="$(cd "$(dirname "$0")/.." && pwd)"; WS="$1"; P="$WS/$2"
[ -z "$2" ] && { echo "usage: new_sucesos.sh <workspace_dir> <project_name>"; exit 1; }
mkdir -p "$P"
cp "$K"/engine_sucesos/{sx_kit.js,sx_core.js,index.html} "$K"/engine/render.js "$P/"
if [ ! -f "$WS/sx_tex/tex_storm.png" ]; then mkdir -p "$WS/sx_tex"; (cd "$WS/sx_tex" && python3 "$K/engine_sucesos/tex_gen.py"); fi
cp "$WS"/sx_tex/tex_*.png "$P/"
echo "$P ready (sucesos). Timeline without MP3: python3 $K/scripts/fake_voice.py $P"

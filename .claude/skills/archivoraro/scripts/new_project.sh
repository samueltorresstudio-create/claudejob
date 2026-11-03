#!/bin/bash
# new_project.sh <WS> <name> : creates <WS>/<name> with the render engine. Then write script.json + scenes_p.js + audio.py.
set -e
K="$(cd "$(dirname "$0")/.." && pwd)"; WS="$1"; P="$WS/$2"
[ -z "$2" ] && { echo "usage: new_project.sh <workspace_dir> <project_name>"; exit 1; }
mkdir -p "$P"
cp "$K"/engine/{lib.js,kit.js,core.js,render.js,index.html,props.js,props2.js,cast.js} "$P/"
echo "$P ready. Build scenes with: cat props.js props2.js cast.js scenes_p.js > scenes.js"

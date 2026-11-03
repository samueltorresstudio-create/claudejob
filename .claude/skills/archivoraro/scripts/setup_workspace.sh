#!/bin/bash
# setup_workspace.sh <WS> : prepares an Archivo Raro workspace (tools, deliveries, covers) next to the projects.
# Layout: <WS>/tools  <WS>/entregas  <WS>/portadas  <WS>/<project>/   (finish.py relies on this layout)
set -e
K="$(cd "$(dirname "$0")/.." && pwd)"; WS="$1"
[ -z "$WS" ] && { echo "usage: setup_workspace.sh <workspace_dir>"; exit 1; }
mkdir -p "$WS/tools" "$WS/entregas" "$WS/portadas"
cp "$K"/scripts/*.py "$WS/tools/"
cp "$K/engine/cast.js" "$WS/tools/"
cp -n "$K"/covers/* "$WS/portadas/" 2>/dev/null || true
touch "$WS/guiones_elevenlabs.txt" "$WS/entregas/titulos_y_descripciones.txt"
echo "workspace ready: $WS"

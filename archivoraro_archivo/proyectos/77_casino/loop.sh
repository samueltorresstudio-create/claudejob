#!/bin/bash
# $1 = parte (0 o 1): navegador propio; vuelve a lanzar lo que falte si Chromium se cae
cd "$(dirname "$0")"; P=$1; N=$(python3 -c "import json;print(round(json.load(open('events.json'))['total']*30))")
for k in $(seq 1 40); do
  python3 -c "
import os,json; L=[i for i in range($N) if i%2==$P and not os.path.exists(f'frames/f{i:05d}.png')]; json.dump(L,open('rem_$P.json','w')); print(len(L))" > rem_$P.count
  [ "$(cat rem_$P.count)" = "0" ] && break
  FRAMES=rem_$P.json node render.js full 1 >> render_$P.log 2>&1
done
echo FIN > fin_$P

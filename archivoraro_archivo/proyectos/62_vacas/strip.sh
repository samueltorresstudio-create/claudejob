#!/bin/bash
# strip.sh name t1,t2,... : render preview frames and tile them in one row-wrapped sheet
cd "$(dirname "$0")"; N=$1; TS=$2; cp scenes_p.js scenes.js; timeout 1500 node render.js preview $TS > /dev/null 2>&1
args=(); n=0; for x in $(echo $TS | tr ',' ' '); do args+=(-i preview/p_$(printf '%.2f' $x).png); n=$((n+1)); done
f=""; for ((k=0;k<n;k++)); do f+="[$k]scale=270:480[s$k];"; done; for ((k=0;k<n;k++)); do f+="[s$k]"; done
ffmpeg -v error -y "${args[@]}" -filter_complex "${f}concat=n=$n:v=1:a=0,tile=6x$(( (n+5)/6 ))" -frames:v 1 st_$N.png

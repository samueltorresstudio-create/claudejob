set -e
D=../entregas
enc(){ in=$1; out=$2; vb=$3; tag=$4
  ffmpeg -v error -y -i $in -c:v libx264 -preset slow -tune animation -b:v ${vb}k -maxrate $((vb*3))k -bufsize $((vb*4))k -pass 1 -passlogfile pl_$tag -an -f mp4 /dev/null
  ffmpeg -v error -y -i $in -c:v libx264 -preset slow -tune animation -b:v ${vb}k -maxrate $((vb*3))k -bufsize $((vb*4))k -pass 2 -passlogfile pl_$tag -c:a aac -b:a 112k -ar 48000 -ac 2 -movflags +faststart $out
  echo "$out $(stat -c %s $out)"; }
enc $D/desaparecen_los_adultos_SERIE_COMPLETA_horizontal.mp4 $D/desaparecen_los_adultos_SERIE_COMPLETA_horizontal_LIGERO.mp4 600 a
enc $D/tsunami_SERIE_COMPLETA_horizontal.mp4 $D/tsunami_SERIE_COMPLETA_horizontal_LIGERO.mp4 420 t
echo DONE

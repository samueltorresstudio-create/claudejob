set -e
FC="[0:v]split=3[a][b][c];[a]crop=1080:1100:0:0,scale=1060:1080,setsar=1[sc];[b]crop=1080:300:0:1580,scale=860:1080,setsar=1[bg];[c]crop=1080:360:0:1140,scale=842:281,setsar=1[cap];[bg][cap]overlay=9:450[r1];[r1][1:v]overlay=0:0[rt];[sc][rt]hstack=inputs=2,fps=30,format=yuv420p[v]"
E="-c:v libx264 -preset medium -crf 19 -r 30 -c:a aac -b:a 192k -ar 48000 -ac 2"
P=(../entregas/19_desaparecen_los_adultos_CON_VOZ.mp4 ../entregas/32_desaparecen_los_adultos_parte2_CON_VOZ.mp4 ../entregas/33_desaparecen_los_adultos_parte3_CON_VOZ.mp4 ../entregas/34_desaparecen_los_adultos_parte4_CON_VOZ.mp4 ../entregas/35_desaparecen_los_adultos_parte5_FINAL_CON_VOZ.mp4)
rm -f list.txt
for n in 1 2 3 4 5; do
  ffmpeg -v error -y -loop 1 -t 2.5 -i card_$n.png -f lavfi -t 2.5 -i anullsrc=r=48000:cl=stereo -vf "fade=in:0:12,fade=out:63:12,format=yuv420p" -shortest $E c_$n.mp4
  ffmpeg -v error -y -i ${P[$((n-1))]} -i panel_$n.png -filter_complex "$FC" -map "[v]" -map 0:a $E p_$n.mp4
  echo "file 'c_$n.mp4'" >> list.txt; echo "file 'p_$n.mp4'" >> list.txt
  echo part $n ok
done
ffmpeg -v error -y -f concat -safe 0 -i list.txt -c copy -movflags +faststart ../entregas/desaparecen_los_adultos_SERIE_COMPLETA_horizontal.mp4
echo DONE

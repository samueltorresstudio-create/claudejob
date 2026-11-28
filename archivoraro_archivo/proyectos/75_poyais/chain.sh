#!/bin/bash
cd "$(dirname "$0")"; rm -f fin_0 fin_1 finish.log
./loop.sh 0 & ./loop.sh 1 & wait
cd .. && python3 -I 75_poyais/audio.py > 75_poyais/audio.log 2>&1 && python3 tools/finish.py 75_poyais 75_poyais_SIN_VOZ "75 · EL PAÍS QUE NO EXISTÍA (tiempos provisionales, sin voz)" > 75_poyais/finish.log 2>&1
echo DONE >> 75_poyais/finish.log

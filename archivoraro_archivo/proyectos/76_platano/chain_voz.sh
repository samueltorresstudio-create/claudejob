#!/bin/bash
cd "$(dirname "$0")"; rm -f fin_0 fin_1 finish.log
./loop.sh 0 & ./loop.sh 1 & wait
cd .. && python3 -I 76_platano/audio.py --voice > 76_platano/audio.log 2>&1 && python3 tools/finish.py 76_platano 76_platano_CON_VOZ "76 · EL PLÁTANO DE SEIS MILLONES (voz clonada)" > 76_platano/finish.log 2>&1
echo DONE >> 76_platano/finish.log

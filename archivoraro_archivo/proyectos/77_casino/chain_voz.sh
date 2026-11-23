#!/bin/bash
cd "$(dirname "$0")"; rm -f fin_0 fin_1 finish.log
./loop.sh 0 & ./loop.sh 1 & wait
cd .. && python3 -I 77_casino/audio.py --voice > 77_casino/audio.log 2>&1 && python3 tools/finish.py 77_casino 77_casino_CON_VOZ "77 · LAS TRES REGLAS SECRETAS DE LOS CASINOS (voz clonada)" > 77_casino/finish.log 2>&1
echo DONE >> 77_casino/finish.log

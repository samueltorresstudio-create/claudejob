#!/bin/bash
cd "$(dirname "$0")"
for i in $(seq 612 660) $(seq 1480 1750); do rm -f frames/f$(printf %05d $i).png; done
mv finish.log finish_2.log; rm -f fin_0 fin_1
./loop.sh 0 & ./loop.sh 1 & wait
cd .. && python3 tools/finish.py 77_casino 77_casino_CON_VOZ "77 · LAS TRES REGLAS SECRETAS DE LOS CASINOS (voz clonada)" > 77_casino/finish.log 2>&1
echo DONE3 >> 77_casino/finish.log

#!/bin/bash
# espera al render completo y vuelve a sacar el tramo del laboratorio (científica con pantalón nuevo)
cd "$(dirname "$0")"
until grep -q "^DONE" finish.log 2>/dev/null; do sleep 20; done
for i in $(seq 1400 1525); do rm -f frames/f$(printf %05d $i).png; done
mv finish.log finish_1.log; rm -f fin_0 fin_1
./loop.sh 0 & ./loop.sh 1 & wait
cd .. && python3 tools/finish.py 77_casino 77_casino_CON_VOZ "77 · LAS TRES REGLAS SECRETAS DE LOS CASINOS (voz clonada)" > 77_casino/finish.log 2>&1
echo DONE2 >> 77_casino/finish.log

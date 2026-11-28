#!/bin/bash
cd "$(dirname "$0")"
M='"site":"gallery","mood":"galeria","pool":.15'
./tshot.sh \
 pv/p1.png "{$M,\"pre\":[\"W.tapeP.visible=false;W.tapeP.userData.ink2.visible=false\"],\"p\":[0,3.1,-9.4],\"l\":[0,3.1,-17.7],\"f\":24}" \
 pv/p2.png "{$M,\"pre\":[\"W.wallP.visible=false\"],\"p\":[.1,3.3,-10.2],\"l\":[0,3.25,-17.7],\"f\":26}" \
 pv/p3.png "{$M,\"p\":[0,3.15,-9.4],\"l\":[0,3.1,-17.7],\"f\":24}" \
 pv/p4.png "{$M,\"p\":[-.95,3.0,-15.4],\"l\":[-.55,2.85,-17.7],\"f\":18}" \
 pv/q1.png "{$M,\"ripe\":.05,\"p\":[0,3.15,-9.4],\"l\":[0,3.1,-17.7],\"f\":24}" pv/q2.png "{$M,\"ripe\":.4,\"p\":[0,3.15,-9.4],\"l\":[0,3.1,-17.7],\"f\":24}" \
 pv/q3.png "{$M,\"ripe\":.72,\"p\":[0,3.15,-9.4],\"l\":[0,3.1,-17.7],\"f\":24,\"fx\":\"flies(560,520,3)\"}" pv/q4.png "{$M,\"ripe\":.98,\"p\":[0,3.15,-9.4],\"l\":[0,3.1,-17.7],\"f\":24,\"fx\":\"flies(540,520,7)\"}" 2>&1 | grep -v "GPU stall"
python3 -I - <<'P'
from PIL import Image
S=Image.new('RGB',(540*4,960*2))
for i,f in enumerate(['p1','p2','p3','p4','q1','q2','q3','q4']): S.paste(Image.open(f'pv/{f}.png').convert('RGB').resize((540,960)),((i%4)*540,(i//4)*960))
S.save('pv/hoja_platano_cinta.jpg',quality=88)
P

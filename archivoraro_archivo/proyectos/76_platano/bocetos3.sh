#!/bin/bash
cd "$(dirname "$0")"
M='"site":"gallery","mood":"galeria","pool":.15,"p":[1.2,3.5,-11.8],"l":[0,3.2,-17.7],"f":30'
./tshot.sh \
 pv/h1.png '{"site":"gallery","mood":"laser","lasers":true,"pool":.2,"p":[-1.5,1.3,7],"l":[0,2.7,-16],"f":50,"chars":[["GUARD",-.9,1.2,{"turn":.35,"face":"wide","mouth":"o","sweat":true,"armR":[100,50],"holdRn":"TORCH"},1.84,0]]}' \
 pv/h2.png '{"site":"gallery","mood":"laser","lasers":true,"pool":.25,"p":[0,2.3,-2.2],"l":[0,3.0,-17.7],"f":38}' \
 pv/h3.png '{"site":"stage","mood":"rueda","p":[1999.4,2.3,-5.2],"l":[2000,2.35,-9],"f":34,"chars":[["SUN",2000,-8.9,{"turn":.05,"face":"happy","mouth":"big","armR":[20,30]},1.84,.92]],"fx":"(()=>{const h=headScr(V3(2000,.92,-8.9),1.84);return biteBanana(h.x-h.ppm*.42*.27,h.y+h.ppm*.42*.72,h.ppm*.0021*1.15,-34)+flash(120,260,16)+flash(940,180,14)+flash(900,860,12)})()"}' \
 pv/h4.png "{$M,\"p\":[.55,3.45,-15.6],\"l\":[.15,3.25,-17.7],\"f\":26}" \
 pv/f1.png "{$M,\"ripe\":.05}" pv/f2.png "{$M,\"ripe\":.4}" pv/f3.png "{$M,\"ripe\":.72,\"fx\":\"flies(560,520,3)\"}" pv/f4.png "{$M,\"ripe\":.98,\"fx\":\"flies(540,520,7)\"}" 2>&1 | grep -v "GPU stall"
python3 -I - <<'P'
from PIL import Image
S=Image.new('RGB',(540*4,960*2))
for i,f in enumerate(['h1','h2','h3','h4','f1','f2','f3','f4']): S.paste(Image.open(f'pv/{f}.png').convert('RGB').resize((540,960)),((i%4)*540,(i//4)*960))
S.save('pv/hoja_gancho.jpg',quality=86)
P

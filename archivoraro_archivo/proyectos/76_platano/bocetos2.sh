#!/bin/bash
cd "$(dirname "$0")"
# escenarios con personajes: galería, láser (gancho A), subasta, rueda de prensa, puesto del frutero, mordisco (gancho B)
./tshot.sh \
 pv/e1.png '{"site":"gallery","mood":"galeria","pool":.35,"p":[6.5,2.1,-1.5],"l":[-1.2,3.0,-17.5],"f":50,"chars":[["VIS2",-2.4,-9.4,{"turn":.7,"face":"wide","mouth":"o","armR":[150,30]},1.84,0],["VIS1",-.6,-9.9,{"turn":.5,"face":"open","mouth":"smile","armR":[120,40],"holdRn":"PHONE2D"},1.84,0],["VIS3",1.2,-9.2,{"turn":.35,"face":"open","mouth":"o"},1.84,0],["GUARD",-5.2,-12.5,{"turn":.9,"face":"open","mouth":"line"},1.84,0],["EATER",3.5,-8.2,{"turn":-.4,"face":"smug","mouth":"smirk","brows":.3},1.84,0]]}' \
 pv/e2.png '{"site":"gallery","mood":"laser","lasers":true,"pool":.2,"p":[.6,1.5,6],"l":[0,2.3,-14],"f":44,"chars":[["GUARD",-.5,.5,{"turn":.35,"face":"wide","mouth":"o","sweat":true,"armR":[100,50],"holdRn":"TORCH"},1.84,0]],"fx":"star(150,420,20,.5)"}' \
 pv/e3.png '{"site":"auction","mood":"subasta","p":[1000,3.6,13],"l":[1000,3.7,-14],"f":46,"chars":[["AUCT",995.6,-12.8,{"turn":.1,"face":"open","mouth":"o","armR":[150,30],"holdRn":"GAVEL(-20)"},1.9,.95],["BID1",997.4,0,{"view":"back","armR":[160,20],"holdRn":"PADDLE2D"},1.84,0],["SUN",1000.6,1.2,{"view":"back","armR":[165,20],"holdRn":"PADDLE2D"},1.84,0],["BID3",1003.6,-.2,{"view":"back","armR":[160,20],"holdRn":"PADDLE2D"},1.84,0],["BID2",1002,-3.6,{"view":"back"},1.84,0]]}' \
 pv/e4.png '{"site":"stage","mood":"rueda","p":[2001.2,2.7,0.2],"l":[1999.8,2.7,-8],"f":44,"chars":[["SUN",2000,-6.2,{"turn":0,"face":"happy","mouth":"big","armR":[140,130],"holdRn":"PEELED2D(1.2)"},1.84,.92],["REP1",1997.7,-2.3,{"view":"back","armR":[160,20],"holdRn":"PHONE2D"},1.84,0],["REP2",2002.5,-1.6,{"view":"back","armR":[150,20],"holdRn":"MIC2D"},1.84,0]],"fx":"flash(170,330,14)+flash(900,360,12)+flash(520,250,16)+flash(960,700,10)"}' \
 pv/e5.png '{"site":"stand","mood":"calle","p":[2995,1.9,24],"l":[2995,2.4,13],"f":38,"chars":[["FRUT",2994,16.2,{"turn":.1,"face":"open","mouth":"smile","armR":[120,50],"holdRn":"BANANA2D(1.1)"},1.84,0],["VIS3",2996.4,17.2,{"turn":.5,"face":"wide","mouth":"o"},1.84,0],["VIS2",2992.2,17.8,{"turn":-.6,"face":"open","mouth":"smile"},1.84,0]]}' \
 pv/e6.png '{"site":"stage","mood":"rueda","p":[1999.4,2.3,-5.2],"l":[2000,2.35,-9],"f":34,"chars":[["SUN",2000,-8.9,{"turn":.05,"face":"happy","mouth":"big","armR":[20,30]},1.84,.92]],"fx":"(()=>{const h=headScr(V3(2000,.92,-8.9),1.84);return biteBanana(h.x-h.ppm*.42*.27,h.y+h.ppm*.42*.72,h.ppm*.0021*1.15,-34)+flash(120,260,16)+flash(940,180,14)+flash(900,860,12)})()"}' 2>&1 | grep -v "GPU stall"
python3 -I - <<'P'
from PIL import Image
E=Image.new('RGB',(540*3,960*2))
for i,f in enumerate(['e1','e2','e3','e4','e5','e6']): E.paste(Image.open(f'pv/{f}.png').convert('RGB').resize((540,960)),((i%3)*540,(i//3)*960))
E.save('pv/hoja_escenarios.jpg',quality=88)
P

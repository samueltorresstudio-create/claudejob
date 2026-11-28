#!/bin/bash
cd "$(dirname "$0")"
L='"site":"city","p":[0,1.5,50],"l":[0,1.75,40],"f":42'
./tshot.sh pv/k1.png "{$L,\"chars\":[[\"MACG\",-1.3,40,{\"turn\":.25,\"face\":\"smug\",\"mouth\":\"smirk\"}],[\"BANK\",-.45,40,{\"turn\":-.2,\"face\":\"open\",\"mouth\":\"smile\"}],[\"GENT\",.5,40,{\"turn\":.2,\"face\":\"open\",\"mouth\":\"line\"}],[\"CLERK\",1.4,40,{\"turn\":-.2,\"face\":\"open\",\"mouth\":\"line\"}]]}" \
 pv/k2.png "{$L,\"chars\":[[\"DAMA1\",-1.35,40,{\"turn\":.2,\"face\":\"open\",\"mouth\":\"smile\"}],[\"DAMA2\",-.45,40,{\"turn\":-.2,\"face\":\"happy\",\"mouth\":\"smile\"}],[\"COL1\",.5,40,{\"turn\":.2,\"face\":\"open\",\"mouth\":\"smile\"}],[\"COL2\",1.4,40,{\"turn\":-.2,\"face\":\"open\",\"mouth\":\"smile\"}]]}" \
 pv/k3.png "{$L,\"chars\":[[\"COL3\",-1.1,40,{\"turn\":.2,\"face\":\"happy\",\"mouth\":\"smile\"},1.25],[\"MARIN\",0,40,{\"turn\":-.2,\"face\":\"open\",\"mouth\":\"smile\"}],[\"GARCON\",1.1,40,{\"turn\":.2,\"face\":\"open\",\"mouth\":\"smile\"}]]}" \
 pv/e1.png '{"site":"city","p":[-8,3.2,36],"l":[3,8.5,0],"f":50,"t":2}' \
 pv/e2.png '{"site":"city","p":[30,5,-26],"l":[4,7,-2],"f":55}' \
 pv/e3.png '{"site":"london","mood":"londres","p":[1000.8,2.3,13],"l":[1000,2.6,2],"f":36,"chars":[["MACG",1000,2,{"turn":.15,"armR":[150,30],"armL":[40,20],"face":"smug","mouth":"smirk"},1.9,1.55],["BANK",997.8,.2,{"turn":-.5,"face":"wide","mouth":"o"}],["GENT",1002.4,.4,{"turn":.6,"face":"wide","mouth":"o","armL":[100,30]}],["DAMA1",995.8,-1.6,{"turn":-.4,"face":"open","mouth":"o"}],["DAMA2",1004.4,-1.4,{"turn":.5,"face":"happy","mouth":"smile"}],["CLERK",1001.2,-2.5,{"face":"wide","mouth":"o"}]]}' \
 pv/e4.png '{"site":"port","mood":"puerto","p":[2034,8,40],"l":[2008,5,8],"f":50,"chars":[["COL1",2002.2,12,{"turn":.6,"armR":[40,40]}],["COL2",2000.6,10.8,{"turn":.5,"face":"open","mouth":"smile"}],["COL3",2003.6,9.6,{"turn":.7,"face":"happy","mouth":"smile"},1.2],["MARIN",2006.4,6,{"turn":-.4}]]}' \
 pv/e5.png '{"site":"beach","mood":"selva","p":[3003.5,1.9,24],"l":[3004,3.2,9],"f":42,"chars":[["COL1",3001.4,15,{"turn":.3,"face":"wide","mouth":"o"}],["COL2",2999.8,16,{"turn":.2,"face":"wide","mouth":"o"}],["COL3",3002.9,16.4,{"turn":.3,"face":"wide","mouth":"o"},1.2]],"fx":"mosq(430,880,150,34,3.2,1.3)+mosq(780,820,110,22,3.2,1.1)"}' \
 pv/e6.png '{"site":"paris","mood":"paris","p":[4000.4,1.7,-14],"l":[4000,2.3,-30],"f":38,"chars":[["MACG",3998.6,-26,{"turn":.5,"face":"smug","mouth":"smirk"}],["GARCON",4001.6,-24,{"turn":-.4}]]}' 2>&1 | grep -v "GPU stall"
python3 -I - <<'P'
from PIL import Image
S=Image.new('RGB',(540*3,960))
for i,f in enumerate(['k1','k2','k3']): S.paste(Image.open(f'pv/{f}.png').resize((540,960)),(i*540,0))
S.save('pv/hoja_personajes.jpg',quality=90)
E=Image.new('RGB',(540*3,960*2))
for i,f in enumerate(['e1','e2','e3','e4','e5','e6']): E.paste(Image.open(f'pv/{f}.png').resize((540,960)),((i%3)*540,(i//3)*960))
E.save('pv/hoja_escenarios.jpg',quality=88)
P

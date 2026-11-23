#!/bin/bash
cd "$(dirname "$0")"
L='"site":"gallery","mood":"galeria","pool":0,"pre":["W.wallP.visible=false;W.tapeP.visible=false"],"p":[0,1.5,4.6],"l":[0,1.7,-4],"f":38'
C() { echo "{$L,\"chars\":[$1]}"; }
GL='"holdR"'
./tshot.sh pv/k1.png "$(C '["CATT",-1.2,-4,{"turn":.25,"face":"smug","mouth":"smirk"}],["GALER",-.4,-4,{"turn":-.2,"face":"open","mouth":"smile"}],["GUARD",.4,-4,{"turn":.2,"face":"open","mouth":"line"}],["EATER",1.2,-4,{"turn":-.2,"face":"smug","mouth":"smirk"}]')" \
 pv/k2.png "$(C '["SUN",-1.2,-4,{"turn":.25,"face":"happy","mouth":"smile"}],["AUCT",-.4,-4,{"turn":-.2,"face":"open","mouth":"line"}],["FRUT",.4,-4,{"turn":.2,"face":"open","mouth":"smile"}],["VIS1",1.2,-4,{"turn":-.2,"face":"open","mouth":"smile"}]')" \
 pv/k3.png "$(C '["VIS2",-1.2,-4,{"turn":.25,"face":"wide","mouth":"o"}],["VIS3",-.4,-4,{"turn":-.2,"face":"open","mouth":"smile"}],["BID1",.4,-4,{"turn":.2,"face":"open","mouth":"line"}],["BID2",1.2,-4,{"turn":-.2,"face":"open","mouth":"smile"}]')" \
 pv/k4.png "$(C '["BID3",-.8,-4,{"turn":.25,"face":"wide","mouth":"o"}],["REP1",0,-4,{"turn":0,"face":"wide","mouth":"o"}],["REP2",.8,-4,{"turn":-.25,"face":"open","mouth":"smile"}]')" 2>&1 | grep -v "GPU stall"
python3 -I - <<'P'
from PIL import Image
S=Image.new('RGB',(540*4,960))
for i,f in enumerate(['k1','k2','k3','k4']): S.paste(Image.open(f'pv/{f}.png').convert('RGB').resize((540,960)),(i*540,0))
S.save('pv/hoja_personajes.jpg',quality=90)
P

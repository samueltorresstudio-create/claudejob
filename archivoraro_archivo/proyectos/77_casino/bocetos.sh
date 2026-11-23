#!/bin/bash
cd "$(dirname "$0")"
./tshot.sh \
 pv/e1.png '{"site":"hall","cover":.5,"hh":8,"p":[0,3.3,-3.5],"l":[0,3.4,-17.8],"f":34}' \
 pv/e2.png '{"site":"hall","p":[0,1.9,27],"l":[0,2.3,8],"f":46,"chars":[["JUG",0,17,{"view":"back"}],["CLI1",-2.0,13.5,{"view":"back","turn":-.3}],["CLI2",2.1,10,{"view":"back","turn":.3}],["CROU",-3.0,-10.5,{"turn":.2,"face":"open","mouth":"smile"}]]}' \
 pv/e3.png '{"site":"office","mood":"oficina","p":[1000,1.9,2.4],"l":[1000,2.0,-6],"f":42,"chars":[["DIR",1000.2,-5.1,{"turn":.1,"face":"open","mouth":"smile","armR":[100,40],"holdRn":"BLUEPRINT2D(1.1)","clipAt":[1000,0.88,-3.0]}]]}' \
 pv/e4.png '{"site":"glass","mood":"dia","plastic":0.45,"p":[2000,1.8,9],"l":[2000,2.5,-18],"f":44,"chars":[["JUG",2000.5,-9.8,{"view":"back","face":"dreamy","mouth":"smile"}],["CLI1",1998.9,-6.2,{"turn":-.5,"face":"open","mouth":"smile"}],["CLI3",2001.8,-5.2,{"turn":.5,"face":"wary","mouth":"tsk"}]]}' \
 pv/e5.png '{"site":"hall","heroes":[["hall",-1.3,0,2,0.25,1]],"p":[.3,1.7,13],"l":[0,1.5,3.6],"f":36,"chars":[["JUG",.7,5.6,{"turn":-.25,"face":"stars","mouth":"cheer","armR":[150,30],"brows":.6}]]}' \
 pv/e6.png '{"site":"lab","mood":"lab","heroes":[["lab",4003.8,0,-3.4,-.4,1]],"p":[4000,1.9,7.6],"l":[4000,1.6,0],"f":46,"chars":[["JUG",3999.7,3.4,{"hat":"eeg","face":"hypno","mouth":"pout","turn":.3}],["CIEN",4001.7,3.0,{"turn":-.4,"face":"open","mouth":"smile","armR":[110,50],"holdRn":"CLIP2D(1)"}]]}' \
 pv/e7.png '{"site":"maze","mood":"laberinto","p":[3040,1.7,19],"l":[3040,1.6,4],"f":46,"chars":[["JUG",3040,11.6,{"view":"back","face":"wary","mouth":"tsk"}]]}' \
 pv/e8.png '{"site":"maze","mood":"laberinto","ceil":false,"p":[3000,52,1],"l":[3000,0,0],"f":34}' 2>&1 | grep -v "GPU stall"

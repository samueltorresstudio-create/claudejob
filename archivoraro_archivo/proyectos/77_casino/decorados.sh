#!/bin/bash
cd "$(dirname "$0")"
./tshot.sh \
 pv/d1.png '{"site":"hall","p":[0,2.0,34],"l":[0,2.8,-17],"f":40}' \
 pv/d2.png '{"site":"hall","cover":1,"hh":8,"p":[0,3.2,-6],"l":[0,3.2,-17.8],"f":30}' \
 pv/d3.png '{"site":"hall","p":[-3.4,1.2,14],"l":[-5.6,1.8,-2],"f":46}' \
 pv/d4.png '{"site":"hall","p":[1.0,2.0,-5],"l":[0,1.6,-17],"f":48}' \
 pv/d5.png '{"site":"office","mood":"oficina","p":[1000,2.3,7],"l":[1000,2.0,-6],"f":40}' \
 pv/d6.png '{"site":"glass","mood":"dia","p":[2000,2.2,22],"l":[2000,2.8,-18],"f":40}' \
 pv/d7.png '{"site":"maze","mood":"laberinto","p":[3040,1.7,19],"l":[3040,1.6,4],"f":46}' \
 pv/d8.png '{"site":"lab","mood":"lab","p":[4000,2.4,7.4],"l":[4000,1.9,-3],"f":44}' 2>&1 | grep -v "GPU stall"

const GOLD='#e8b73a', GOLDD='#a97c16', GOLDL='#fde59a';
const st=(w=4)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const HAIR=(col,edge)=>`<path d="M-140,-618 Q-100,-640 -40,-652 Q40,-664 140,-664 L140,-760 L-140,-760 Z" fill="${col}"/>`+
  [[-100,-648,-20,-676],[-70,-646,20,-680],[-30,-652,60,-682],[10,-660,96,-680]].map(([a,b,c,d])=>`<path d="M${a},${b} Q${(a+c)/2},${d-6} ${c},${d}" fill="none" stroke="${edge}" stroke-width="3.5" stroke-linecap="round" opacity=".7"/>`).join('')+
  `<path d="M-60,-692 Q0,-704 60,-694" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".25"/>`;
function shoe(x,y,dir,col,shine=true){return `<path d="M${x-dir*6},${y-14} Q${x+dir*30},${y-16} ${x+dir*34},${y-2} Q${x+dir*34},${y+5} ${x+dir*24},${y+5} L${x-dir*10},${y+5} Q${x-dir*14},${y-4} ${x-dir*6},${y-14} Z" fill="${col}" ${st(5)}/>`+(shine?`<path d="M${x+dir*8},${y-9} Q${x+dir*20},${y-11} ${x+dir*26},${y-6}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`:'')}
// ================= MILLONARIO =================
function millonario(ex={}){
  const chest=
    // traje con raya diplomática
    [-54,-42,-30,-18,-6,6,18,30,42,54].map(x=>`<line x1="${x}" y1="-560" x2="${x}" y2="-280" stroke="#36426a" stroke-width="1.6"/>`).join('')+
    // chaleco granate
    `<path d="M-36,-545 L-36,-388 L0,-366 L36,-388 L36,-545 Z" fill="#6e1f2e"/>`+
    [-36,-24,-12,0,12,24,36].map(x=>`<line x1="${x}" y1="-545" x2="${x}" y2="-372" stroke="#7d2a3a" stroke-width="1.5"/>`).join('')+
    // camisa y cuello
    `<path d="M-24,-545 L0,-472 L24,-545 Z" fill="#fbf9f6"/><path d="M-24,-512 L-6,-492 L-20,-478 Z M24,-512 L6,-492 L20,-478 Z" fill="#fff" ${st(3)}/>`+
    // solapas en pico con brillo satinado
    `<path d="M-62,-545 L-28,-545 L-10,-452 L-28,-440 L-8,-404 L-62,-370 Z" fill="#0f1426" ${st(3.5)}/><path d="M62,-545 L28,-545 L10,-452 L28,-440 L8,-404 L62,-370 Z" fill="#0f1426" ${st(3.5)}/>`+
    `<path d="M-30,-536 L-14,-454" stroke="#3a4670" stroke-width="3"/><path d="M30,-536 L14,-454" stroke="#3a4670" stroke-width="3"/>`+
    // botones dorados
    `<circle cx="-2" cy="-350" r="5.5" fill="${GOLD}" ${st(2.5)}/><circle cx="-2" cy="-322" r="5.5" fill="${GOLD}" ${st(2.5)}/>`+
    // bolsillo con pañuelo dorado
    `<path d="M22,-438 L50,-442" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><path d="M26,-440 L32,-458 L38,-444 L44,-460 L48,-442 Z" fill="${GOLD}" ${st(2.5)}/>`+
    // bolsillos de abajo
    `<path d="M-52,-330 L-24,-332" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><path d="M24,-332 L52,-330" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`+
    // cadena de reloj de bolsillo sobre el chaleco
    `<path d="M-34,-392 Q-20,-374 -6,-386" fill="none" stroke="${GOLD}" stroke-width="3"/>`;
  const chestOver=
    // corbata de seda dorada con nudo, rayas y pasador
    `<path d="M-10,-504 L10,-504 L8,-488 L-8,-488 Z" fill="${GOLD}" ${st(4)}/><path d="M-8,-488 L8,-488 L15,-404 L0,-388 L-15,-404 Z" fill="${GOLD}" ${st(4.5)}/>`+
    [0,1,2,3].map(i=>`<path d="M${-9-i},${-470+i*20} L${9+i},${-480+i*20}" stroke="${GOLDD}" stroke-width="4"/>`).join('')+
    `<path d="M-4,-486 L-2,-410" stroke="${GOLDL}" stroke-width="2.5" opacity=".8"/><rect x="-18" y="-446" width="36" height="6" rx="2" fill="#d9dde3" ${st(2.5)}/>`+
    // flor en el ojal
    `<path d="M-46,-492 Q-58,-498 -56,-484 Z" fill="#3f8a3a" ${st(2)}/><circle cx="-44" cy="-482" r="9" fill="#c8243a" ${st(3)}/><path d="M-48,-484 Q-44,-490 -40,-483 Q-44,-478 -47,-482" fill="none" stroke="#8a1424" stroke-width="2"/>`;
  // brazo derecho con copa, puño de camisa, gemelo, reloj y anillo
  const armR=curve('M56,-470 Q120,-440 138,-500')+
    `<g transform="rotate(-62 132 -484)"><rect x="122" y="-490" width="22" height="11" rx="3" fill="${GOLD}" ${st(3)}/><circle cx="133" cy="-484.5" r="3" fill="#fff"/></g>`+
    hand(138,-500)+`<circle cx="146" cy="-497" r="4.5" fill="${GOLD}" ${st(2)}/><circle cx="146" cy="-497" r="2" fill="#7fe0ff"/>`;
  const glass=`<g transform="translate(138,-508)"><path d="M-15,-90 L15,-90 L10,-32 Q0,-21 -10,-32 Z" fill="#fffbe8" fill-opacity=".85" ${st(4.5)}/><path d="M-12,-66 L12,-66 L9,-34 Q0,-26 -9,-34 Z" fill="#f2cf5a"/>
    <path d="M-15,-90 L15,-90" stroke="${GOLD}" stroke-width="3"/><path d="M-9,-80 L-6,-40" stroke="#fff" stroke-width="3" opacity=".8"/>
    ${[[-3,-56,2.6],[3,-48,2.2],[-1,-42,1.8],[4,-60,1.6],[0,-74,2]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('')}
    <line x1="0" y1="-24" x2="0" y2="6" ${st(4.5)}/><path d="M-14,6 L14,6" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>`;
  // brazo izquierdo con abanico de billetes
  const armL=curve('M-56,-470 Q-104,-444 -112,-404');
  const cash=`<g transform="translate(-112,-404)">${[-38,-18,2,22].map((a,i)=>`<g transform="rotate(${a-90})"><rect x="0" y="-17" width="74" height="34" rx="3" fill="${['#7fbf78','#8acb82','#7fbf78','#93d18b'][i]}" ${st(3.5)}/><rect x="6" y="-11" width="62" height="22" rx="2" fill="none" stroke="#3f7a3a" stroke-width="2"/><circle cx="37" cy="0" r="8" fill="#a9dba2" stroke="#3f7a3a" stroke-width="2"/><text x="37" y="5" text-anchor="middle" font-family="Inter" font-weight="900" font-size="13" fill="#2f6a2a">$</text></g>`).join('')}
    <rect x="-8" y="-30" width="14" height="22" rx="2" fill="#d94a4a" ${st(2.5)} transform="rotate(-8)"/></g>`+hand(-112,-404);
  const feet=shoe(-56,0,-1,'#141414')+shoe(56,0,1,'#141414');
  return Object.assign({top:'#1d2540',chest,chestOver,hair:HAIR('#3a2416','#7a5a44'),eyes:'lid',brows:[2,-10],bArcL:7,bArcR:3,mouth:'smirk',
    arms:armR+armL+cash,front:glass,feet},ex);}
// ================= COCINERO =================
function cocinero(ex={}){
  const chest=
    `<path d="M-62,-560 L22,-560 Q30,-470 24,-380 L-62,-380 Z" fill="#f2eef0"/><path d="M18,-548 Q28,-470 22,-384" fill="none" stroke="#cfc6cb" stroke-width="4"/>`+
    `<path d="M18,-548 Q28,-470 22,-384" fill="none" stroke="#d23a32" stroke-width="2" stroke-dasharray="0" opacity=".9" transform="translate(4,0)"/>`+
    [-470,-436,-402].map(y=>[-24,40].map(x=>`<circle cx="${x}" cy="${y}" r="6.5" fill="#fff" ${st(3)}/><circle cx="${x}" cy="${y}" r="2" fill="${INK}"/>`).join('')).join('')+
    // bolsillo con termómetro y boli
    `<path d="M-56,-454 L-34,-454 L-34,-426 Q-45,-420 -56,-426 Z" fill="#ece6ea" ${st(3)}/><rect x="-52" y="-478" width="5" height="30" rx="2" fill="#b8c0c8" ${st(2)}/><circle cx="-49.5" cy="-480" r="4" fill="#d23a32" ${st(2)}/><rect x="-42" y="-472" width="5" height="24" rx="2" fill="#2f5aa8" ${st(2)}/>`+
    // nombre bordado
    `<text x="-2" y="-446" text-anchor="middle" font-family="Inter" font-weight="900" font-size="12" fill="#d23a32" transform="rotate(-3 -2 -446)">CHEF</text>`;
  const apron=`<path d="M-62,-382 L62,-382 L66,-200 Q0,-188 -66,-200 Z" fill="#fff" ${st(OW)}/>`+
    [-44,-22,0,22,44].map(x=>`<path d="M${x},-378 L${x*1.06},-196" stroke="#5b86c9" stroke-width="7" opacity=".85"/>`).join('')+
    `<path d="M-62,-382 L62,-382" stroke="${INK}" stroke-width="${OW}"/><path d="M-30,-330 L30,-330 L30,-296 L-30,-296 Z" fill="none" stroke="${INK}" stroke-width="3.5"/>`+
    `<path d="M-64,-382 Q-78,-372 -86,-352 M-64,-382 Q-82,-390 -92,-372" fill="none" stroke="${INK}" stroke-width="3"/>`+
    // trapo de cuadros colgando
    `<g transform="translate(56,-380) rotate(6)"><path d="M0,0 L28,0 L30,78 L2,82 Z" fill="#fff" ${st(4)}/>${[0,1,2,3,4,5].map(r=>[0,1].map(c=>((r+c)%2)?`<rect x="${2+c*13}" y="${2+r*13}" width="13" height="13" fill="#d23a32" opacity=".85"/>`:'').join('')).join('')}<path d="M0,0 L28,0 L30,78 L2,82 Z" fill="none" ${st(4)}/></g>`;
  const scarf=`<path d="M-44,-516 Q0,-494 44,-516 L36,-496 Q0,-478 -36,-496 Z" fill="#d23a32" ${st(5)}/>`+[[-24,-504],[-6,-498],[14,-500],[30,-506]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join('')+
    `<path d="M-8,-496 L-22,-460 L-6,-468 Z M6,-496 L18,-458 L2,-466 Z" fill="#d23a32" ${st(4)}/><circle cx="0" cy="-494" r="8" fill="#b52a24" ${st(4)}/>`;
  const hat=`<path d="M-92,-664 L-98,-812 L98,-812 L92,-664 Q0,-648 -92,-664 Z" fill="#fff" ${st(OW)}/>
    ${[-66,-44,-22,0,22,44,66].map(x=>`<path d="M${x},-804 Q${x+4},-740 ${x*.95},-674" fill="none" stroke="#ddd6d9" stroke-width="5"/>`).join('')}
    <path d="M-94,-700 Q0,-686 92,-700 L92,-670 Q0,-654 -94,-670 Z" fill="#f4f0f2" ${st(4)}/>
    <g transform="translate(0,-742)"><g transform="rotate(-30)"><rect x="-3" y="-4" width="6" height="30" rx="3" fill="#d23a32"/><ellipse cx="0" cy="-12" rx="8" ry="11" fill="#d23a32"/></g><g transform="rotate(30)"><rect x="-3" y="-2" width="6" height="28" rx="3" fill="#d23a32"/><path d="M-8,-4 L-8,-24 M0,-4 L0,-24 M8,-4 L8,-24 M-8,-4 L8,-4" stroke="#d23a32" stroke-width="4" stroke-linecap="round"/></g></g>
    <path d="M-98,-810 Q-140,-834 -114,-874 Q-102,-916 -40,-904 Q-4,-936 46,-906 Q112,-920 122,-870 Q142,-834 98,-810 Q0,-794 -98,-810 Z" fill="#fff" ${st(OW)}/>
    <path d="M-80,-850 Q-60,-878 -30,-880 M10,-890 Q36,-900 60,-884 M70,-850 Q92,-848 104,-834" fill="none" stroke="#ddd6d9" stroke-width="5" stroke-linecap="round"/>`;
  const face=`<path d="M2,-554 Q-14,-566 -34,-558 Q-50,-552 -56,-564 Q-58,-542 -34,-542 Q-14,-542 2,-550 Q18,-542 38,-542 Q62,-542 60,-564 Q54,-552 38,-558 Q18,-566 2,-554 Z" fill="#4a2c1c" ${st(3)}/>`;
  const arms=curve('M-56,-470 Q-100,-430 -108,-488')+curve('M56,-470 Q94,-410 124,-420');
  const spoon=`<g transform="rotate(-22 -108 -488)"><rect x="-113" y="-610" width="10" height="126" rx="5" fill="#c8924e" ${st(4.5)}/><path d="M-110,-600 L-110,-500" stroke="#e2b27a" stroke-width="2.5"/>
    <ellipse cx="-108" cy="-626" rx="19" ry="27" fill="#c8924e" ${st(4.5)}/><ellipse cx="-108" cy="-630" rx="12" ry="17" fill="#c23a22"/><path d="M-118,-610 Q-120,-596 -116,-588" stroke="#c23a22" stroke-width="5" stroke-linecap="round" fill="none"/></g>`+hand(-108,-488);
  const pan=`<g transform="translate(126,-420) rotate(-5)"><rect x="0" y="-8" width="76" height="16" rx="7" fill="#2b2b2b" ${st(4.5)}/><circle cx="66" cy="0" r="4" fill="${INK}"/>
    <ellipse cx="136" cy="-4" rx="68" ry="21" fill="#4a4a4a" ${st(6)}/><ellipse cx="136" cy="-8" rx="56" ry="13" fill="#2a2a2a"/>
    <path d="M100,-10 Q112,-22 128,-14 Q118,-6 100,-10 Z" fill="#c8543a" ${st(2.5)}/><path d="M104,-12 Q114,-18 124,-14" stroke="#f3c2a8" stroke-width="2" fill="none"/>
    <path d="M118,-6 Q126,-28 146,-22 Q170,-28 168,-10 Q154,0 134,-2 Q118,0 118,-6 Z" fill="#fff" ${st(3.5)}/><ellipse cx="146" cy="-14" rx="12" ry="8" fill="#f6b51c" ${st(3)}/><circle cx="142" cy="-17" r="3" fill="#fff6c8"/>
    ${[[118,-40],[146,-46],[170,-38]].map(([x,y])=>`<path d="M${x},${y} q-10,-14 0,-26 q10,-12 0,-24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".75"/>`).join('')}</g>`+hand(124,-420);
  const feet=shoe(-56,0,-1,'#2b2b2b',false)+shoe(56,0,1,'#2b2b2b',false);
  return Object.assign({top:'#fbf8f8',chest,chestOver:apron+scarf,hat,face,eyes:'lid',brows:[0,0],bArcL:6,bArcR:6,mouth:'small',mouthY:50,arms:spoon+arms,front:pan,feet},ex);}
// ================= GUERRERO =================
function guerrero(ex={}){
  const mail=[];for(let r=0;r<16;r++)for(let c=0;c<12;c++)mail.push(`<path d="M${-66+c*12+(r%2)*6},${-560+r*12} a6,6 0 0 0 12,0" fill="none" stroke="#6f7984" stroke-width="2"/>`);
  const chest=`<rect x="-80" y="-570" width="160" height="300" fill="#a3adb8"/>${mail.join('')}`+
    // sobreveste azul con cruz dorada y bajo dentado
    `<path d="M-42,-560 L42,-560 L42,-336 L30,-322 L18,-336 L6,-322 L-6,-336 L-18,-322 L-30,-336 L-42,-322 Z" fill="#2f5aa8" ${st(4)}/>
     <path d="M-36,-552 L36,-552 L36,-342" fill="none" stroke="${GOLD}" stroke-width="3"/><path d="M-36,-552 L-36,-342" stroke="${GOLD}" stroke-width="3"/>
     <path d="M0,-482 L0,-392 M-22,-452 L22,-452" stroke="${GOLD}" stroke-width="10" stroke-linecap="round"/><path d="M0,-482 L0,-392 M-22,-452 L22,-452" stroke="${GOLDD}" stroke-width="3" stroke-linecap="round"/>`+
    // cinturón con hebilla y tachuelas
    `<rect x="-80" y="-384" width="160" height="18" fill="#6a4426" ${st(3.5)}/>${[-50,-34,34,50].map(x=>`<circle cx="${x}" cy="-375" r="3" fill="${GOLD}"/>`).join('')}<rect x="-12" y="-388" width="24" height="26" rx="3" fill="none" stroke="${GOLD}" stroke-width="5"/><line x1="0" y1="-384" x2="0" y2="-366" stroke="${GOLD}" stroke-width="3"/>`;
  const plates=(sd)=>[0,1,2].map(i=>`<path d="M${sd*(26+i*4)},${-530+i*14} Q${sd*(76+i*4)},${-540+i*14} ${sd*(80+i*2)},${-490+i*14} Q${sd*(58)},${-478+i*14} ${sd*(30+i*4)},${-488+i*14} Z" fill="${i%2?'#b4bcc6':'#c8cfd7'}" ${st(5)}/>`).reverse().join('')+
    [0,1,2].map(i=>`<circle cx="${sd*(56+i*3)}" cy="${-510+i*14}" r="3" fill="#7d8792"/>`).join('');
  const chestOver=plates(-1)+plates(1)+
    `<circle cx="-36" cy="-512" r="9" fill="${GOLD}" ${st(3.5)}/><circle cx="-36" cy="-512" r="3.5" fill="#c8302e"/><circle cx="36" cy="-512" r="9" fill="${GOLD}" ${st(3.5)}/><circle cx="36" cy="-512" r="3.5" fill="#c8302e"/>`+
    // vaina colgando del cinturón
    `<g transform="translate(-58,-370) rotate(24)"><rect x="-9" y="0" width="18" height="150" rx="8" fill="#5a3820" ${st(4.5)}/><rect x="-11" y="10" width="22" height="12" fill="${GOLD}" ${st(3)}/><rect x="-11" y="70" width="22" height="10" fill="${GOLD}" ${st(3)}/><path d="M-9,140 L0,166 L9,140 Z" fill="${GOLD}" ${st(3.5)}/></g>`;
  const back=`<path d="M-40,-520 Q-104,-400 -118,-260 Q-80,-248 -56,-270 Q-24,-248 8,-270 Q40,-248 76,-266 Q60,-400 40,-520 Z" fill="#244a90" ${st(OW)}/>
    <path d="M-110,-262 Q-80,-252 -56,-272 Q-24,-252 8,-272 Q40,-252 70,-268" fill="none" stroke="${GOLD}" stroke-width="5"/><path d="M-60,-420 Q-74,-350 -84,-280 M20,-430 Q30,-360 40,-286" fill="none" stroke="#1a3a74" stroke-width="5"/>`;
  const rot=`rotate(${ROT} 0 ${HY})`;
  const hat=`<g transform="${rot}"><path fill-rule="evenodd" d="M-134,${HY} Q-136,${HY-136} 0,${HY-140} Q136,${HY-136} 134,${HY} Q132,${HY+100} 84,${HY+122} L-84,${HY+122} Q-132,${HY+100} -134,${HY} Z
      M-88,${HY-10} Q-88,${HY-74} 0,${HY-76} Q88,${HY-74} 88,${HY-10} L88,${HY+42} Q86,${HY+98} 0,${HY+100} Q-86,${HY+98} -88,${HY+42} Z" fill="#b4bcc6" ${st(OW)}/>
    <path fill-rule="evenodd" d="M-100,${HY-6} Q-100,${HY-88} 0,${HY-90} Q100,${HY-88} 100,${HY-6} L100,${HY+46} Q98,${HY+110} 0,${HY+112} Q-98,${HY+110} -100,${HY+46} Z M-88,${HY-10} Q-88,${HY-74} 0,${HY-76} Q88,${HY-74} 88,${HY-10} L88,${HY+42} Q86,${HY+98} 0,${HY+100} Q-86,${HY+98} -88,${HY+42} Z" fill="${GOLD}" ${st(3.5)}/>
    <path d="M-112,${HY-92} Q-70,${HY-128} -20,${HY-132}" fill="none" stroke="#eef1f4" stroke-width="10" stroke-linecap="round"/><path d="M0,${HY-140} L0,${HY-90}" stroke="${INK}" stroke-width="5"/>
    ${[-60,-30,30,60].map(x=>`<circle cx="${x}" cy="${HY-112+Math.abs(x)*.25}" r="4.5" fill="#7d8792" ${st(2)}/>`).join('')}
    ${[[-116,HY+20],[-116,HY+44],[-116,HY+68],[116,HY+20],[116,HY+44],[116,HY+68]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="${INK}"/>`).join('')}
    <path d="M-6,${HY-136} Q-34,${HY-232} 46,${HY-250} Q24,${HY-210} 70,${HY-200} Q46,${HY-176} 78,${HY-154} Q34,${HY-144} 10,${HY-136} Z" fill="#c8302e" ${st(6)}/>
    <path d="M2,${HY-146} Q0,${HY-200} 36,${HY-232} M14,${HY-146} Q24,${HY-180} 56,${HY-196} M18,${HY-142} Q40,${HY-152} 64,${HY-158}" fill="none" stroke="#8e1c1a" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="-14" y="${HY-150}" width="28" height="16" rx="4" fill="${GOLD}" ${st(4)}/></g>`;
  const face=`<path d="M-50,-626 L-18,-578" stroke="#b5655a" stroke-width="5" stroke-linecap="round"/><path d="M-44,-614 L-34,-620 M-32,-598 L-22,-604" stroke="#b5655a" stroke-width="4" stroke-linecap="round"/>
    <path d="M40,-560 L44,-552 M52,-566 L54,-558" stroke="#a89aa0" stroke-width="3" stroke-linecap="round"/>`;
  const gaunt=(x,y,a)=>`<g transform="translate(${x},${y}) rotate(${a})"><rect x="-13" y="-12" width="26" height="24" rx="8" fill="#b4bcc6" ${st(4.5)}/><path d="M-13,-2 L13,-2 M-13,5 L13,5" stroke="${INK}" stroke-width="2.5"/></g>`;
  const arms=curve('M56,-470 Q100,-520 110,-590')+curve('M-56,-470 Q-92,-450 -104,-430');
  const sword=`<g transform="translate(110,-590) rotate(16)"><path d="M-8,-30 L-8,-226 L0,-256 L8,-226 L8,-30 Z" fill="#e8ecf0" ${st(5.5)}/><path d="M0,-224 L0,-40" stroke="#9aa4ae" stroke-width="4"/><path d="M-4,-220 L-4,-60" stroke="#fff" stroke-width="2.5"/>
    <path d="M-40,-30 Q-20,-38 0,-34 Q20,-38 40,-30 L40,-18 Q20,-24 0,-20 Q-20,-24 -40,-18 Z" fill="${GOLD}" ${st(4.5)}/><circle cx="0" cy="-26" r="6" fill="#c8302e" ${st(2.5)}/>
    <rect x="-7" y="-18" width="14" height="46" rx="4" fill="#4a2e1a" ${st(4.5)}/>${[-10,0,10,20].map(y=>`<path d="M-7,${y} L7,${y-6}" stroke="#8a5a32" stroke-width="2.5"/>`).join('')}
    <circle cx="0" cy="36" r="11" fill="${GOLD}" ${st(4.5)}/><circle cx="0" cy="36" r="4" fill="#2f5aa8"/>
    <path d="M14,-200 l6,-6 M20,-206 l4,4 M14,-200 l-4,-6" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`+gaunt(110,-590,16);
  const shield=`<g transform="translate(-124,-414)"><path d="M-70,-84 L70,-84 L68,10 Q54,74 0,102 Q-54,74 -68,10 Z" fill="#8a5a32" ${st(OW)}/>
    <path d="M-58,-72 L58,-72 L56,8 Q44,62 0,86 Q-44,62 -56,8 Z" fill="#2f5aa8" ${st(3.5)}/><path d="M0,-72 L0,86 L-44,62 Q-56,40 -56,8 L-58,-72 Z" fill="#c8302e" opacity=".9"/>
    <path d="M0,-60 L0,70 M-44,-14 L44,-14" stroke="${GOLD}" stroke-width="13" stroke-linecap="round"/><path d="M0,-60 L0,70 M-44,-14 L44,-14" stroke="${GOLDD}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="0" cy="-14" r="14" fill="${GOLD}" ${st(3.5)}/><circle cx="0" cy="-14" r="5" fill="#fff6c8"/>
    ${[[-62,-78],[0,-78],[62,-78],[-62,4],[62,4],[-40,62],[40,62],[0,94]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#c4ccd4" ${st(2)}/>`).join('')}
    <path d="M24,-56 l14,10 M30,30 l10,-6 M-40,40 l12,8" stroke="#1a3060" stroke-width="3" stroke-linecap="round"/></g>`+gaunt(-104,-430,-10);
  const sab=(x,dir)=>`<path d="M${x-dir*8},-20 L${x+dir*14},-22 Q${x+dir*44},-14 ${x+dir*46},4 L${x-dir*10},6 Z" fill="#b4bcc6" ${st(5)}/><path d="M${x},-18 L${x+dir*4},4 M${x+dir*16},-18 L${x+dir*20},4" stroke="${INK}" stroke-width="2.5"/>`;
  const knee=(x)=>`<ellipse cx="${x}" cy="-150" rx="15" ry="13" fill="#c8cfd7" ${st(4.5)}/><circle cx="${x}" cy="-150" r="3.5" fill="${GOLD}"/>`;
  return Object.assign({top:'#a3adb8',back,chest,chestOver,hat,face,eyes:'angry',brows:[18,-18],bArcL:2,bArcR:2,browY:26,mouth:'teeth',mouthY:42,arms,front:sword+shield,
    legL:'M-26,-305 Q-50,-150 -70,-12',legR:'M26,-305 Q50,-150 70,-12',feet:knee(-49)+knee(49)+sab(-70,-1)+sab(70,1)},ex);}
// ================= MILITAR =================
function militar(ex={}){
  const camo=uid('cm');
  const pat=`<defs><pattern id="${camo}" width="90" height="90" patternUnits="userSpaceOnUse"><rect width="90" height="90" fill="#6b7448"/><path d="M5,10 q18,-10 30,4 q8,14 -10,18 q-22,2 -20,-22Z" fill="#4a5232"/><path d="M50,40 q20,-8 32,6 q4,16 -16,16 q-20,-2 -16,-22Z" fill="#8f875a"/><path d="M20,60 q14,-6 24,6 q2,12 -14,12 q-14,-2 -10,-18Z" fill="#3b3326"/><path d="M60,4 q12,-2 16,8 q-4,10 -14,6Z" fill="#3b3326"/></pattern></defs>`;
  const chest=pat+`<rect x="-80" y="-560" width="160" height="300" fill="url(#${camo})"/>`+
    // bolsillos de pecho con tapa y botón
    [-1,1].map(sd=>`<rect x="${sd*26-18}" y="-478" width="36" height="38" rx="4" fill="url(#${camo})" ${st(4)}/><path d="M${sd*26-20},-478 L${sd*26+20},-478 L${sd*26+18},-462 L${sd*26-18},-462Z" fill="#4a5232" ${st(4)}/><circle cx="${sd*26}" cy="-468" r="3.5" fill="#c9b26a" ${st(2)}/>`).join('')+
    // cinta del nombre, bandera y pasadores
    `<rect x="4" y="-500" width="44" height="13" rx="2" fill="#2c3020" ${st(2.5)}/><text x="26" y="-490" text-anchor="middle" font-family="Inter" font-weight="900" font-size="10" fill="#e8e2c8">ROJAS</text>`+
    `<rect x="-50" y="-500" width="30" height="10" fill="#c23a3a" ${st(2)}/><rect x="-50" y="-500" width="10" height="10" fill="#f2c94c"/><rect x="-30" y="-500" width="10" height="10" fill="#2f6fbf"/>`+
    `<rect x="-80" y="-412" width="160" height="22" fill="#3a3324" ${st(4)}/><rect x="-13" y="-416" width="26" height="30" rx="3" fill="#c9b26a" ${st(4)}/><rect x="-6" y="-409" width="12" height="16" fill="#3a3324"/>`+
    // cartucheras en el cinturón
    [-48,30].map(x=>`<rect x="${x}" y="-394" width="20" height="26" rx="3" fill="#4a5232" ${st(3.5)}/>`).join('')+
    `<rect x="-80" y="-370" width="160" height="90" fill="url(#${camo})"/><path d="M0,-388 L0,-290" stroke="${INK}" stroke-width="3" opacity=".5"/>`;
  const chestOver=`<path d="M-36,-540 L-4,-500 L0,-534 L4,-500 L36,-540" fill="#4a5232" ${st(5)}/>`+
    [-1,1].map(sd=>`<path d="M${sd*20},-540 L${sd*58},-534 L${sd*56},-520 L${sd*22},-526Z" fill="#4a5232" ${st(4)}/><circle cx="${sd*50}" cy="-528" r="3" fill="#c9b26a"/>`).join('');
  // casco con funda de camuflaje, red y gafas
  const hat=`<g transform="rotate(${ROT} 0 ${HY}) translate(0,-46)">${pat}<path d="M-124,${HY-6} C-130,${HY-140} 124,${HY-150} 124,${HY-6} Q0,${HY-30} -124,${HY-6}Z" fill="url(#${camo})" ${st(OW)}/>
    <path d="M-132,${HY-4} Q0,${HY-34} 132,${HY-4} L128,${HY+12} Q0,${HY-18} -128,${HY+12}Z" fill="#4a5232" ${st(6)}/>
    ${[-80,-40,0,40,80].map(x=>`<path d="M${x-20},${HY-110+Math.abs(x)*.5} L${x+20},${HY-40+Math.abs(x)*.2} M${x+20},${HY-110+Math.abs(x)*.5} L${x-20},${HY-40+Math.abs(x)*.2}" stroke="#2c3020" stroke-width="2.5" opacity=".6"/>`).join('')}
    <g transform="translate(0,${HY-60})"><rect x="-70" y="-14" width="140" height="28" rx="14" fill="#2c3020" ${st(5)}/>${[-1,1].map(sd=>`<ellipse cx="${sd*34}" cy="0" rx="28" ry="15" fill="#5a8aa8" ${st(4)}/><path d="M${sd*34-16},-6 L${sd*34-4},-10" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`).join('')}</g>
    <path d="M-110,${HY+10} Q-112,${HY+80} -70,${HY+104} M110,${HY+10} Q112,${HY+80} 70,${HY+104}" stroke="#3a3324" stroke-width="6" fill="none"/></g>`;
  const face=`<path d="M-40,-520 Q0,-512 40,-520" stroke="#000" stroke-opacity=".06" stroke-width="20" fill="none"/>`;
  const arms=curve('M-56,-470 Q-76,-400 -66,-330')+hand(-66,-330)+curve('M56,-470 Q100,-450 112,-500')+hand(112,-500);
  // radio en la mano derecha con antena
  const radio=`<g transform="translate(118,-520) rotate(-8)"><rect x="-16" y="-40" width="32" height="60" rx="6" fill="#2c3020" ${st(5)}/><rect x="-10" y="-30" width="20" height="16" rx="2" fill="#9ad08a" ${st(2.5)}/><path d="M-8,-4 L8,-4 M-8,4 L8,4 M-8,12 L8,12" stroke="#6a7a5a" stroke-width="3"/><path d="M8,-40 L14,-90" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="14" cy="-92" r="5" fill="${INK}"/></g>`;
  const boot=(x,dir)=>`<path d="M${x-dir*16},-46 L${x+dir*14},-46 L${x+dir*16},-18 Q${x+dir*44},-16 ${x+dir*46},2 L${x-dir*16},4 Z" fill="#2a2620" ${st(6)}/><path d="M${x-dir*16},-4 L${x+dir*46},-2" stroke="#15161c" stroke-width="7"/>${[-36,-26].map(y=>`<path d="M${x-dir*10},${y} L${x+dir*10},${y}" stroke="#6a5a4a" stroke-width="3"/>`).join('')}`;
  const feet=boot(-46,-1)+boot(46,1);
  return Object.assign({top:'#6b7448',chest,chestOver,hat,face,eyes:'lid',brows:[10,-10],bArcL:3,bArcR:3,mouth:'small',arms,front:radio,feet,
    legL:'M-26,-305 L-46,-44',legR:'M26,-305 L46,-44'},ex);}
// ================= LIMPIADORA =================
function limpiadora(ex={}){
  const BL='#5fa8c8', BLD='#3a7a9a', PK='#e46a8a';
  const chest=[-500,-470,-440].map(y=>`<circle cx="0" cy="${y}" r="5.5" fill="#fff" ${st(2.5)}/>`).join('')+
    `<rect x="-58" y="-500" width="46" height="14" rx="3" fill="#fff" ${st(2.5)}/><text x="-35" y="-489" text-anchor="middle" font-family="Inter" font-weight="900" font-size="10" fill="${INK}">PILAR</text>`+
    `<path d="M24,-480 L52,-480 L50,-450 L26,-450Z" fill="${BLD}" ${st(3)}/><rect x="30" y="-500" width="5" height="26" rx="2" fill="#2f5aa8" ${st(2)}/><rect x="40" y="-496" width="5" height="22" rx="2" fill="${PK}" ${st(2)}/>`;
  // delantal con volante, bolsillo, bayeta y spray
  const apron=`<path d="M-62,-410 Q0,-394 62,-410 L68,-292 Q0,-280 -68,-292 Z" fill="#fbfaf6" ${st(6)}/>`+
    `<path d="M-68,-292 Q-56,-276 -44,-290 Q-32,-276 -20,-290 Q-8,-276 4,-290 Q16,-276 28,-290 Q40,-276 52,-290 Q60,-278 68,-292" fill="#fbfaf6" ${st(4)}/>`+
    `<path d="M-62,-410 Q0,-394 62,-410" stroke="${PK}" stroke-width="10"/><path d="M-64,-410 Q-84,-400 -90,-376 M-64,-410 Q-86,-418 -96,-400" fill="none" stroke="${PK}" stroke-width="7" stroke-linecap="round"/>`+
    `<path d="M-40,-370 L40,-370 L36,-320 Q0,-312 -36,-320Z" fill="#efebe2" ${st(4)}/><path d="M0,-370 L0,-318" stroke="${INK}" stroke-width="3"/>`+
    `<path d="M-30,-372 L-24,-396 L-16,-380 L-8,-398 L-4,-372Z" fill="#ffd34a" ${st(3)}/>`+
    // spray en el bolsillo
    `<g transform="translate(20,-372)"><rect x="-8" y="-30" width="16" height="30" rx="4" fill="#4fc0e8" ${st(3)}/><rect x="-5" y="-40" width="10" height="10" fill="#fff" ${st(2.5)}/><path d="M5,-38 L14,-38 L14,-34 L5,-34" fill="#fff" ${st(2)}/></g>`;
  const collar=[-1,1].map(sd=>`<path d="M${sd*2},-542 Q${sd*40},-548 ${sd*46},-522 Q${sd*24},-506 ${sd*2},-526Z" fill="#fff" ${st(5)}/>`).join('');
  // pelo recogido en moño bajo el pañuelo, pendientes
  const hair=`<path d="M-140,-600 Q-120,-640 -60,-656 L60,-656 Q120,-640 140,-600 L140,-760 L-140,-760Z" fill="#6a3a22"/>`;
  const behindHead=`<circle cx="-92" cy="-640" r="34" fill="#6a3a22" ${st(OW)}/><path d="M-110,-650 Q-92,-670 -74,-650" stroke="#8a5a3a" stroke-width="4" fill="none"/>`;
  const hat=`<g transform="rotate(${ROT} 0 ${HY})"><path d="M-116,${HY-16} C-122,${HY-110} -50,${HY-124} 0,${HY-124} C50,${HY-124} 122,${HY-110} 116,${HY-16} Q80,${HY-58} 0,${HY-62} Q-80,${HY-58} -116,${HY-16}Z" fill="${PK}" ${st(OW)}/>
    ${[[-70,-96],[-30,-108],[10,-112],[50,-104],[86,-84],[-90,-60],[-50,-76],[-10,-84],[30,-82],[70,-70]].map(([x,y])=>`<circle cx="${x}" cy="${HY+y}" r="7" fill="#fff"/>`).join('')}
    <path d="M-116,${HY-16} Q-80,${HY-58} 0,${HY-62} Q80,${HY-58} 116,${HY-16}" stroke="#b84a6a" stroke-width="7" fill="none"/>
    <g transform="translate(92,${HY-92}) rotate(30)"><path d="M0,0 Q30,-30 36,6 Q16,14 0,0Z M0,0 Q14,-40 -14,-40 Q-18,-18 0,0Z" fill="${PK}" ${st(5)}/><circle r="10" fill="#c8506e" ${st(4)}/></g>
    <path d="M-60,${HY-108} Q-10,${HY-122} 40,${HY-116}" stroke="#fff" stroke-opacity=".35" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
  const face=`<circle cx="-112" cy="-562" r="8" fill="#e7c24a" ${st(3)}/><circle cx="114" cy="-576" r="8" fill="#e7c24a" ${st(3)}/>`+
    `<path d="M-52,-560 l-10,6 M-48,-552 l-10,6" stroke="${INK}" stroke-width="3" opacity=".25" stroke-linecap="round"/>`;
  const glove=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="15" ry="17" fill="#ffd34a" ${st(5)}/><path d="M${x-14},${y-10} Q${x},${y-18} ${x+14},${y-10}" stroke="${INK}" stroke-width="4" fill="none"/>`;
  const arms=curve('M-56,-470 Q-96,-420 -100,-372')+curve('M56,-470 Q96,-440 104,-470');
  // fregona y cubo
  const mop=`<g transform="translate(104,-470) rotate(14)"><rect x="-7" y="-150" width="14" height="330" rx="6" fill="#4f8fd8" ${st(5)}/><rect x="-8" y="-162" width="16" height="22" rx="4" fill="#e94b3c" ${st(4)}/><path d="M-2,-130 L-2,160" stroke="#fff" stroke-opacity=".4" stroke-width="3"/>
    <path d="M-34,178 L34,178 L38,198 L-38,198Z" fill="#d9dde3" ${st(5)}/>${Array.from({length:10},(_,k)=>{const x=-36+k*8;return `<path d="M${x},196 Q${x-6+(k%3)*4},226 ${x-4+(k%2)*6},256" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M${x},196 Q${x-6+(k%3)*4},226 ${x-4+(k%2)*6},256" stroke="${k%2?'#f2efe6':'#e4ded0'}" stroke-width="7" fill="none" stroke-linecap="round"/>`}).join('')}</g>`+glove(104,-470);
  const bucket=`<g transform="translate(-170,0)"><path d="M-52,-110 L52,-110 L42,0 L-42,0Z" fill="#f2c53a" ${st(6)}/><path d="M-52,-110 L52,-110 L50,-96 L-50,-96Z" fill="#d9a82a" ${st(4)}/><ellipse cx="0" cy="-110" rx="50" ry="10" fill="#7ac8e8" ${st(4)}/><circle cx="-14" cy="-114" r="6" fill="#fff" opacity=".8"/><circle cx="10" cy="-112" r="4" fill="#fff" opacity=".8"/><path d="M-50,-104 Q0,-180 50,-104" stroke="${INK}" stroke-width="5" fill="none"/><rect x="-24" y="-70" width="48" height="16" rx="3" fill="#fff" opacity=".6"/></g>`;
  const feet=shoe(-56,0,-1,'#f4f2ec',false)+shoe(56,0,1,'#f4f2ec',false);
  return Object.assign({top:BL,chest,chestOver:apron+collar,hair,behindHead,hat,face,eyes:'lid',brows:[4,-6],mouth:'smirk',arms:arms+glove(-100,-372),front:mop+bucket,feet},ex);}
// ================= REY =================
function rey(ex={}){
  const RD='#b5222e', RDD='#7a1420', G='#e7c24a', GD='#b8902a';
  const erm=(d,w)=>`<path d="${d}" stroke="#f6f3ec" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  // capa por detrás con forro y armiño abajo
  const back=`<path d="M-50,-540 Q-128,-400 -140,-24 Q-60,0 0,-8 Q60,0 140,-24 Q128,-400 50,-540Z" fill="${RDD}" ${st(OW)}/>`+
    `<path d="M-100,-300 Q-116,-160 -120,-40 M100,-300 Q116,-160 120,-40" stroke="#000" stroke-opacity=".22" stroke-width="10" fill="none"/>`+
    erm('M-134,-26 Q-60,0 0,-10 Q60,0 134,-26',22)+Array.from({length:10},(_,k)=>`<path d="M${-116+k*26},${-16+Math.abs(4.5-k)*-1} l0,10" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`).join('');
  const chest=`<rect x="-80" y="-560" width="160" height="300" fill="${G}"/>`+[0,1,2,3,4,5,6].map(k=>`<path d="M-24,${-520+k*30} q24,12 48,0" stroke="${GD}" stroke-width="3" fill="none"/>`).join('')+
    // manto rojo abierto con armiño
    `<path d="M-80,-560 L-30,-560 L-22,-280 L-80,-280Z" fill="${RD}"/><path d="M80,-560 L30,-560 L22,-280 L80,-280Z" fill="${RD}"/>`+
    erm('M-30,-560 L-22,-280',22)+erm('M30,-560 L22,-280',22)+[-1,1].map(sd=>[0,1,2,3,4,5].map(k=>`<path d="M${sd*(27-k*.6)},${-536+k*44} l0,10" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`).join('')).join('')+
    // banda cruzada
    `<path d="M50,-540 L-60,-330" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M50,-540 L-60,-330" stroke="#2f5fbf" stroke-width="21" stroke-linecap="round"/><path d="M48,-536 L-58,-334" stroke="#fff" stroke-opacity=".3" stroke-width="5"/>`+
    // cinturón de oro con gema
    `<rect x="-80" y="-372" width="160" height="22" fill="${G}" ${st(4)}/><ellipse cx="0" cy="-361" rx="15" ry="12" fill="#c8243a" ${st(4)}/><circle cx="-4" cy="-365" r="3" fill="#fff" opacity=".8"/>`+
    `<path d="M-80,-340 L80,-340 L80,-280 L-80,-280Z" fill="${RD}"/>`+erm('M-22,-340 L-22,-280',20)+erm('M22,-340 L22,-280',20);
  const medal=`<g transform="translate(-40,-450)"><path d="M-9,-22 L9,-22 L6,0 L-6,0Z" fill="#c8243a" ${st(3)}/><circle cx="0" cy="12" r="14" fill="${G}" ${st(4)}/><path d="M0,2 L3,9 L10,9 L4,13 L6,20 L0,16 L-6,20 L-4,13 L-10,9 L-3,9Z" fill="#fff6c8"/></g>`;
  // cuello de armiño
  const collar=`<path d="M-70,-548 Q0,-500 70,-548 Q78,-522 56,-508 Q0,-474 -56,-508 Q-78,-522 -70,-548Z" fill="#f6f3ec" ${st(6)}/>`+[[-46,-530],[-22,-514],[0,-508],[22,-514],[46,-530]].map(([x,y])=>`<path d="M${x},${y} l0,9 M${x-4},${y+3} l8,0" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`).join('');
  // corona
  const hat=`<g transform="rotate(${ROT} 0 ${HY}) translate(0,${HY-78})"><path d="M-80,-30 Q0,-74 80,-30 L76,-4 Q0,-30 -76,-4Z" fill="#c8243a" ${st(6)}/>
    <path d="M-90,12 L-98,-66 L-60,-30 L-32,-88 L0,-44 L32,-88 L60,-30 L98,-66 L90,12 Q0,-6 -90,12Z" fill="${G}" ${st(OW)}/>
    <path d="M-90,12 Q0,-6 90,12 L88,-10 Q0,-28 -88,-10Z" fill="${GD}" ${st(5)}/>
    ${[[-98,-66],[-32,-88],[32,-88],[98,-66]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="10" fill="${G}" ${st(5)}/>`).join('')}
    ${[[-54,0,'#2f5fbf'],[0,-4,'#c8243a'],[54,0,'#2fa05a']].map(([x,y,c])=>`<ellipse cx="${x}" cy="${y}" rx="${x?10:13}" ry="${x?8:10}" fill="${c}" ${st(3.5)}/><circle cx="${x-3}" cy="${y-3}" r="2.5" fill="#fff" opacity=".8"/>`).join('')}
    <path d="M0,-44 L0,-110 M-12,-96 L12,-96" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M0,-44 L0,-110 M-12,-96 L12,-96" stroke="${G}" stroke-width="6" stroke-linecap="round"/>
    <path d="M-74,-44 L-62,-12 M-24,-66 L-16,-24" stroke="#fff6c8" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>`;
  // barba, bigote y cejas blancas
  const W='#f2efe8';
  const face=`<path d="M-96,-580 Q-104,-500 -60,-470 Q-24,-446 0,-442 Q24,-446 60,-470 Q104,-500 96,-580 Q80,-540 56,-534 Q30,-512 0,-512 Q-30,-512 -56,-534 Q-80,-540 -96,-580Z" fill="${W}" ${st(7)}/>`+
    `<path d="M-50,-490 Q-38,-470 -20,-460 M50,-490 Q38,-470 20,-460 M0,-484 L0,-452" stroke="#cfc8bc" stroke-width="4" fill="none" stroke-linecap="round"/>`+
    `<path transform="translate(0,-8)" d="M-44,-546 Q-36,-572 2,-560 Q40,-572 48,-546 Q30,-552 18,-552 Q8,-544 2,-552 Q-4,-544 -14,-552 Q-26,-552 -44,-546Z" fill="${W}" ${st(5)}/>`;
  const arms=curve('M-56,-470 Q-92,-420 -96,-372')+hand(-96,-372)+curve('M56,-470 Q100,-440 112,-480')+hand(112,-480);
  const scepter=`<g transform="translate(112,-480) rotate(8)"><rect x="-8" y="-180" width="16" height="250" rx="7" fill="${G}" ${st(5)}/>${[-130,-70,-10,50].map(y=>`<rect x="-12" y="${y}" width="24" height="12" rx="4" fill="${GD}" ${st(3.5)}/>`).join('')}<path d="M-3,-160 L-3,60" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>
    <circle cx="0" cy="-204" r="26" fill="${G}" ${st(6)}/><circle cx="0" cy="-204" r="12" fill="#c8243a" ${st(3.5)}/><circle cx="-4" cy="-208" r="4" fill="#fff" opacity=".8"/>
    <path d="M0,-230 L0,-262 M-13,-248 L13,-248" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M0,-230 L0,-262 M-13,-248 L13,-248" stroke="${G}" stroke-width="7" stroke-linecap="round"/></g>`;
  const ring=`<circle cx="-88" cy="-366" r="5" fill="${G}" ${st(2)}/><circle cx="-88" cy="-366" r="2" fill="#c8243a"/>`;
  const feet=shoe(-56,0,-1,RDD)+shoe(56,0,1,RDD);
  return Object.assign({top:RD,back,chest,chestOver:medal+collar,hat,face,eyes:'lid',brows:[6,-8],bArcL:5,bArcR:5,browY:30,mouth:'line',mouthY:44,arms:arms+ring,front:scepter,feet},ex);}

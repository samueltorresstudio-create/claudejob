// Desaparecen los adultos · Parte 3 «El niño de más» — scenes (S), key times (EVS) and config (CFG). Loaded after kit.js, before core.js.
const HUGO={skin:'#f3cfb0',hs:'messy',hair:'#b8743a',top:'#4a8ad8',topD:'#2f6ab0',pants:'#2a3a6a',shoes:'#e9e9ee'};
const ALBA={tall:false,fem:true,skin:'#f3cfb0',hs:'pigtails',hair:'#b8743a',top:'#ff8fb0',topD:'#d96a8a',pants:'#7a5aa8',shoes:'#f3eee6',lashes:true};
const MAMA={fem:true,skin:'#f1c7a5',hs:'long',hair:'#5a2a20',top:'#f6c9da',topD:'#d9a3b9',pants:'#f6c9da',shoes:'#e9e2d6',lashes:true};
const TIE_MAN={skin:'#e9bf9a',hs:'short',hair:'#4a3a30',top:'#f3f3f6',jacket:'#2f3a52',pants:'#2a2e3e',shoes:'#15161c'};
const DOCTOR={skin:'#c99272',hs:'bald',hair:'#2a1d18',top:'#7ac0c8',jacket:'#f3f3f6',pants:'#7ac0c8',shoes:'#e9e9ee',beard:'#2a1d18'};
const NEWKID={skin:'#efdccb',hs:'short',hair:'#25242c',top:'#9aa1aa',topD:'#7a818a',pants:'#3a3e4a',shoes:'#e9e9ee',still:true};

function flowersPJ(x,y,s,op=1){ // little flowers over a tall female body (pyjama print)
  let g='';[[-34,-500],[26,-468],[-6,-412],[38,-372],[-36,-342],[-28,-230],[30,-170],[-24,-90],[28,-40]].forEach(([fx,fy])=>{
    for(let k=0;k<5;k++){const a=k/5*Math.PI*2;g+=`<circle cx="${(fx+Math.cos(a)*8).toFixed(1)}" cy="${(fy+Math.sin(a)*8).toFixed(1)}" r="6" fill="#ff7aa8"/>`}
    g+=`<circle cx="${fx}" cy="${fy}" r="5" fill="#f7d23e"/>`});
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}">${g}</g>`}
// the ones who come back never blink (still:true switches blinking off)
function mama(o){return A({...MAMA,still:true,...o})+flowersPJ(o.x,o.y,o.s,o.op??1)}
function tieMan(o){const s=o.s;return A({...TIE_MAN,still:true,...o})+`<g transform="translate(${o.x},${o.y}) scale(${s})" opacity="${o.op??1}"><path d="M-10,-548 L10,-548 L15,-522 L0,-430 L-15,-522Z" fill="#c23a3a"/><rect x="-11" y="-552" width="22" height="16" fill="#9a2a2a"/></g>`}
function doctor(o){const s=o.s;return A({...DOCTOR,still:true,...o})+`<g transform="translate(${o.x},${o.y}) scale(${s})" opacity="${o.op??1}"><path d="M-40,-548 Q-46,-470 -8,-452 M40,-548 Q46,-470 8,-452" stroke="#3a3e4a" stroke-width="7" fill="none"/><circle cx="0" cy="-446" r="12" fill="#c9cdd2" stroke="#3a3e4a" stroke-width="5"/></g>`}
// black, unblinking eyes on any tall character standing at (x,y) with scale s
function creepAt(x,y,s,a){
  if(a<=0) return '';let g='';
  for(const ex of [-36,36]) g+=`<circle cx="${(x+ex*s).toFixed(1)}" cy="${(y-632*s).toFixed(1)}" r="${(27*s).toFixed(1)}" fill="#05050a" opacity="${a.toFixed(2)}"/><circle cx="${(x+ex*s+3*s).toFixed(1)}" cy="${(y-636*s).toFixed(1)}" r="${(4*s).toFixed(1)}" fill="#fff" opacity="${a.toFixed(2)}"/>`;
  return g}
function fenceK(y0,y1,o={}){ // tall bars across the frame with a gate at o.gx
  const col=o.col||'#2a3240', gx=o.gx??620;let s='';
  for(let x=-400;x<1500;x+=52) s+=`<rect x="${x}" y="${y0}" width="14" height="${y1-y0}" fill="${col}"/><polygon points="${x-6},${y0} ${x+7},${y0-34} ${x+20},${y0}" fill="${col}"/>`;
  s+=`<rect x="-600" y="${y0+40}" width="2280" height="16" fill="${col}"/><rect x="-600" y="${y1-80}" width="2280" height="16" fill="${col}"/>`;
  s+=`<rect x="${gx-12}" y="${y0-20}" width="24" height="${y1-y0+20}" fill="${mix(col,'#000000',.3)}"/>`;
  return s}
function padlock(x,y,s,rot=0,open=0){
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${rot})"><path d="M-26,-4 L-26,${-40-open*30} Q-26,${-70-open*30} 0,${-70-open*30} Q26,${-70-open*30} 26,${-40-open*30} L26,${-4-open*30}" stroke="#b8bfc8" stroke-width="12" fill="none"/><rect x="-44" y="-10" width="88" height="80" rx="12" fill="#e2b33a"/><circle cx="0" cy="24" r="10" fill="#5a3a10"/><rect x="-4" y="26" width="8" height="24" fill="#5a3a10"/></g>`}
function fishbowl(x,y,s,t){
  const fx=Math.sin(t*1.3)*50, dir=Math.cos(t*1.3)>0?1:-1;
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-150" rx="170" ry="150" fill="#bfe6ff" opacity=".55"/><ellipse cx="0" cy="-100" rx="160" ry="90" fill="#6cc6ff" opacity=".45"/>
    <g transform="translate(${fx},-120) scale(${dir},1)"><ellipse cx="0" cy="0" rx="46" ry="30" fill="#ff8a2a"/><polygon points="-40,0 -84,-30 -84,30" fill="#ff6a1a"/><circle cx="22" cy="-6" r="7" fill="#2a2233"/></g>
    <ellipse cx="0" cy="-296" rx="110" ry="14" fill="none" stroke="#bfe6ff" stroke-width="10"/><ellipse cx="-80" cy="-200" rx="18" ry="50" fill="#fff" opacity=".35"/><rect x="-200" y="0" width="400" height="20" rx="6" fill="#8a5a3a"/></g>`}
// the school gate seen from the yard. o.dawn 0..1 turns night into sunrise, o.people = svg drawn behind the bars
function yard(t,o={}){
  const dw=o.dawn||0;
  let s=skyNight(t,.7*(1-dw));
  if(dw>0) s+=`<g opacity="${dw.toFixed(3)}">${skySunset()}</g><circle cx="900" cy="${lerp(700,520,dw)}" r="${90}" fill="#ffd27a" opacity="${(dw*.9).toFixed(2)}"/>`;
  const bc=mix('#2a2a3a','#7a5a6a',dw);
  s+=`<rect x="-600" y="560" width="2280" height="340" fill="${mix('#1a1c28','#6a4a52',dw)}"/>`+block(-300,560,380,bc,{night:dw<.5,bottom:520,frame:mix('#232333','#5a4050',dw)})+block(860,520,420,bc,{night:dw<.5,bottom:520,frame:mix('#232333','#5a4050',dw)});
  s+=`<rect x="-600" y="860" width="2280" height="40" fill="${mix('#3a3e4a','#8a7a7a',dw)}"/>`+streetLamp(940,880,1-dw);
  if(dw<1) s+=`<ellipse cx="900" cy="880" rx="260" ry="40" fill="#fff2b8" opacity="${(.18*(1-dw)).toFixed(2)}"/><circle cx="1000" cy="400" r="260" fill="url(#glowY)" opacity="${(.5*(1-dw)).toFixed(2)}"/>`;
  s+=o.people||'';
  s+=fenceK(380,900,{gx:640,col:mix('#2a3240','#3a3440',dw)});
  s+=`<rect x="-600" y="900" width="2280" height="700" fill="${mix('#22242e','#5a4a4a',dw)}"/>`;
  s+=padlock(640,640,.8,o.lockRot||0,0);
  return s}
function lightSwitch(x,y,on){return `<rect x="${x-34}" y="${y-50}" width="68" height="100" rx="10" fill="#f3eee6"/><rect x="${x-12}" y="${on?y-34:y-2}" width="24" height="36" rx="6" fill="#c9c2b6"/>`}
function canteenK(t){ // long canteen wall with a serving hatch and a menu board; floor 980
  let s=wall(980,'#f2e3c4')+floorTiles(980,'#c9bfae');
  for(let x=-600;x<3200;x+=700) s+=`<rect x="${x+80}" y="260" width="420" height="200" fill="#9fd0f0"/><rect x="${x+80}" y="350" width="420" height="10" fill="#f3eee6"/><rect x="${x+284}" y="260" width="10" height="200" fill="#f3eee6"/>`;
  s+=`<rect x="-600" y="540" width="4200" height="20" fill="#e2b06a"/>`;
  s+=`<rect x="1140" y="140" width="300" height="80" rx="10" fill="#2f5a46"/><text x="1290" y="194" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="#fff">COMEDOR</text>`;
  return s}
function tableK(x0,x1,y){ // long canteen table: top at y, front panel down to y+160, bowls and cups on top
  let s=`<rect x="${x0}" y="${y}" width="${x1-x0}" height="160" fill="#b07a4a"/><rect x="${x0-10}" y="${y-16}" width="${x1-x0+20}" height="22" rx="6" fill="#c98a52"/>`;
  for(let x=x0+60;x<x1-40;x+=150) s+=`<path d="M${x-30},${y-16} Q${x},${y+4} ${x+30},${y-16}Z" fill="#f3f3f6"/><ellipse cx="${x}" cy="${y-17}" rx="30" ry="6" fill="#f2e3c4"/><rect x="${x+44}" y="${y-48}" width="22" height="32" rx="4" fill="#ffe9a8"/>`;
  return s}
// 16 kids along the table: index 14 is Alba, 15 is the one nobody let in
const ROW=Array.from({length:16},(_,i)=>({x:120+i*150,i}));
function rowKids(t,o={}){
  let s='';
  ROW.forEach(({x,i})=>{
    if(i===14) s+=A({...ALBA,x,y:950,s:.6,look:o.albaLook||[6,-2],mouth:'smile',reachR:o.spoon?[60,-330+Math.max(0,Math.sin(t*3))*-40]:null});
    else if(i===15) s+=A({...NEWKID,x,y:980,s:.5,look:o.newLook||[0,0],mouth:'smile',tilt:o.newTilt||0})+creepAt(x,980,.5,o.creep||0);
    else s+=extra(KIDS,i,{x,y:980,s:.5,look:o.look||[-4,-2],seed:i*5+2,mouth:i%3?'smile':'line'});
  });
  return s}
function pointHand(x,y,a=1){ // Hugo's arm from the bottom of the frame, pointing at (x,y)
  if(a<=0) return '';
  const bx=x-160, by=1500;
  return `<g opacity="${a.toFixed(2)}"><line x1="${bx}" y1="${by}" x2="${x-14}" y2="${y+40}" stroke="#4a8ad8" stroke-width="64" stroke-linecap="round"/><circle cx="${x-8}" cy="${y+30}" r="30" fill="#f3cfb0"/><line x1="${x}" y1="${y+18}" x2="${x+16}" y2="${y-30}" stroke="#f3cfb0" stroke-width="18" stroke-linecap="round"/></g>`}

function schoolDay(t){ // the street outside the gate in the morning
  let s=skyDay()+puffs(t,160,'#fff',.9,6,4)+`<rect x="-600" y="560" width="2280" height="340" fill="#b8b0a2"/>`;
  s+=block(-300,560,380,'#d9a988',{bottom:520})+block(860,520,420,'#a9c0d0',{bottom:520});
  s+=`<rect x="-600" y="860" width="2280" height="40" fill="#9a958c"/>`+streetLamp(940,880,0);
  s+=`<rect x="-600" y="900" width="2280" height="700" fill="#8a8478"/>`;
  return s}
// ---------- part 3 helpers ----------
const POL={skin:'#efc4a0',top:'#5a8a4a',topD:'#43683a',hs:'messy',hair:'#6a4a2a',pants:'#3a3a48',shoes:'#e9e9ee'};
// black eyes on a small character (Alba: tall:false) standing at (x,y) with scale s
function creepSmall(x,y,s,a){
  if(a<=0) return '';let g='';
  for(const ex of [-36,36]) g+=`<circle cx="${(x+ex*s).toFixed(1)}" cy="${(y-406*s).toFixed(1)}" r="${(27*s).toFixed(1)}" fill="#05050a" opacity="${a.toFixed(2)}"/><circle cx="${(x+ex*s+3*s).toFixed(1)}" cy="${(y-410*s).toFixed(1)}" r="${(4*s).toFixed(1)}" fill="#fff" opacity="${a.toFixed(2)}"/>`;
  return g}
function bread(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-22" rx="62" ry="28" fill="#d99a4a"/><path d="M-30,-40 Q-22,-22 -30,-6 M0,-46 Q8,-26 0,-4 M30,-40 Q38,-22 30,-6" stroke="#b07a3a" stroke-width="5" fill="none" stroke-linecap="round"/></g>`}
function consoleK(x,y,s=1,glow=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-70" y="-40" width="140" height="64" rx="22" fill="#2a2e3a"/><rect x="-36" y="-30" width="72" height="44" rx="4" fill="${mix('#2a3246','#7ad0ff',glow)}"/><circle cx="-52" cy="-8" r="8" fill="#e2453b"/><circle cx="52" cy="-8" r="8" fill="#45e07e"/></g>`}
function sunTag(x,y,txt,a){return tag(x,y,txt,YEL,a)}
function sunsetCity(t,k){ // k 0..1: the sun goes down behind the blocks
  let s=skySunset()+`<circle cx="620" cy="${lerp(380,700,k)}" r="110" fill="#ffd27a"/><circle cx="620" cy="${lerp(380,700,k)}" r="190" fill="url(#glowY)" opacity=".8"/>`;
  s+=block(-300,560,520,'#5a4050',{bottom:560,lit:(i,j)=>k>.5&&(i+j)%3===0?.7:0})+block(820,520,470,'#4a3a4a',{bottom:560,lit:(i,j)=>k>.6&&(i*j)%2===0?.7:0});
  s+=`<rect x="-600" y="700" width="2280" height="900" fill="#3a2e34"/>`;
  s+=fenceK(560,900,{gx:540,col:'#2a2a36'})+padlock(540,760,.7);
  s+=`<rect x="-600" y="900" width="2280" height="700" fill="#2a2228"/>`;
  return s}
function classDoor(x,o={}){ // a door on the right wall of the classroom; o.open 0..1, o.who svg standing in the doorway
  let s=`<rect x="${x-14}" y="386" width="228" height="520" fill="#d9cdb4"/><rect x="${x}" y="400" width="200" height="500" fill="#0b0b12"/>`;
  if(o.who) s+=`<g>${o.who}</g>`;
  const w=200*(1-.85*(o.open||0));
  s+=`<rect x="${x}" y="400" width="${w}" height="500" fill="#8a5a3a"/>`;
  if(w>60) s+=`<circle cx="${x+w-24}" cy="660" r="10" fill="#d9b25a"/>`;
  return s}

const MAMA_DAY={...MAMA,top:'#3f8f7a',topD:'#2f6a5a',pants:'#3a3a48'};
const DAD={skin:'#f1c7a5',hs:'short',hair:'#3a2a26',top:'#efe6d8',jacket:'#3a4a6a',pants:'#2a2a38',beard:'#3a2a26'};
function streetK(t,o={}){ // quiet street: three blocks, pavement 700-782, road below
  let s=skyDay()+puffs(t,140,'#fff',.9,8,3);
  s+=block(-260,520,240,'#e0a988',{bottom:640})+block(300,480,300,'#9fb8c9',{bottom:640})+block(820,520,200,'#c9b0d0',{bottom:640});
  s+=`<rect x="-600" y="700" width="2280" height="72" fill="#d9d2c6"/><rect x="-600" y="772" width="2280" height="12" fill="#a8a094"/><rect x="-600" y="784" width="2280" height="800" fill="#5a5e6a"/>`;
  for(let x=-500;x<1600;x+=220) s+=`<rect x="${x}" y="1000" width="120" height="14" fill="#f3eee6" opacity=".8"/>`;
  return s}
function phoneFlat(x,y,s,ring=0,t=0){ // phone lying on a surface, seen at a low angle; ring 0..1 makes it buzz and glow
  const dx=ring?Math.sin(t*70)*3*ring:0;
  return `<g transform="translate(${x+dx},${y}) scale(${s})"><path d="M-46,0 L46,0 L36,-16 L-36,-16Z" fill="#15161c"/><path d="M-40,-3 L40,-3 L32,-13 L-32,-13Z" fill="${mix('#2a3246','#9fe0ff',ring)}"/>${ring?`<circle cx="0" cy="-8" r="60" fill="url(#glowY)" opacity="${.5*ring}"/>`:''}</g>`}
function kitchenK(t,E){
  let s=wall(900,'#f3e2b8')+floorTiles(900,'#c9b8a0');
  s+=winK(660,250,300,250,skyDay()+puffs(t,300,'#fff',.9,8,5),{cur:'#7ab0d0'});
  s+=`<rect x="-200" y="600" width="660" height="300" fill="#5a8ab0"/><rect x="-200" y="588" width="680" height="22" fill="#e9e2d6"/>`;
  for(const x of [-60,160,360]) s+=`<rect x="${x-80}" y="640" width="170" height="230" rx="6" fill="#4a7aa0"/><rect x="${x-20}" y="660" width="40" height="8" rx="4" fill="#c9d2dc"/>`;
  // coffee maker, steaming
  s+=`<rect x="130" y="440" width="110" height="150" rx="10" fill="#2a2a33"/><rect x="146" y="510" width="78" height="70" rx="8" fill="#c9e0ea" opacity=".8"/><rect x="146" y="548" width="78" height="32" fill="#5a3422"/><circle cx="220" cy="460" r="6" fill="#ff4a4a"/>`;
  for(let i=0;i<3;i++){const p=((t*.6+i/3)%1);s+=`<path d="M${170+i*16},${430-p*120} q14,-16 0,-32 q-14,-16 0,-32" stroke="#fff" stroke-width="7" fill="none" opacity="${(.7*(1-p)).toFixed(2)}" stroke-linecap="round"/>`}
  // table: half-made breakfast and two phones
  s+=`<rect x="560" y="720" width="460" height="22" rx="6" fill="#b07a4a"/><rect x="590" y="742" width="20" height="160" fill="#8a5a36"/><rect x="970" y="742" width="20" height="160" fill="#8a5a36"/>`;
  s+=`<ellipse cx="660" cy="716" rx="62" ry="10" fill="#f3f3f6"/><rect x="630" y="698" width="54" height="16" rx="4" fill="#e2b06a"/><path d="M780,690 L860,690 Q852,722 820,722 Q788,722 780,690Z" fill="#e9e2d6"/><rect x="815" y="660" width="8" height="40" rx="3" fill="#c9d2dc" transform="rotate(20 820 690)"/>`;
  const ring=t>E.ring?(Math.floor(t*2.5)%2?1:.6):0;
  s+=phoneFlat(720,718,1,ring,t)+phoneFlat(930,718,1,ring?1.6-ring:0,t+.3);
  return s}
function shopK(t){
  let s=wall(900,'#eef2f4',false)+floorTiles(900,'#dfe4e8');
  for(let i=0;i<4;i++) s+=`<rect x="${-40+i*300}" y="60" width="220" height="18" rx="6" fill="#fffbe8"/>`;
  const cols=['#e2453b','#f7d23e','#3f8f7a','#6cc6ff','#ff8fb0','#e07b3b','#7a6aa8','#45e07e'];const r=rng(5);
  for(const [x0,x1] of [[-100,420],[700,1180]]){s+=`<rect x="${x0}" y="380" width="${x1-x0}" height="520" fill="#c9cfd6"/>`;
    for(let sh=0;sh<4;sh++){const y=470+sh*120;s+=`<rect x="${x0}" y="${y}" width="${x1-x0}" height="12" fill="#9aa1aa"/>`;
      for(let x=x0+10;x<x1-50;x+=58){const h=40+r()*40;s+=`<rect x="${x}" y="${y-h}" width="48" height="${h}" rx="4" fill="${cols[Math.floor(r()*8)]}"/>`}}}
  s+=`<rect x="460" y="300" width="200" height="70" rx="10" fill="#3a6ab0"/><text x="560" y="348" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#fff">CAJA 1</text>`;
  s+=`<rect x="440" y="700" width="240" height="200" fill="#9aa1aa"/><rect x="430" y="690" width="260" height="20" fill="#3a3e4a"/><rect x="560" y="610" width="110" height="80" rx="6" fill="#2a2e3a"/><rect x="570" y="620" width="90" height="40" fill="#45e07e" opacity=".5"/>`;
  return s}
function cartK(x,y,s){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-110,-200 L-130,-240 M-110,-200 L110,-200 L90,-60 L-90,-60Z" stroke="#9aa1aa" stroke-width="10" fill="#c9d2dc" fill-opacity=".35" stroke-linejoin="round"/><rect x="-80" y="-180" width="50" height="70" fill="#e2453b"/><rect x="-20" y="-170" width="60" height="60" fill="#f7f4ec"/><rect x="40" y="-190" width="40" height="80" fill="#6cc6ff"/><circle cx="-70" cy="-30" r="22" fill="#2a2e3a"/><circle cx="70" cy="-30" r="22" fill="#2a2e3a"/></g>`}
function schoolK(t,n){ // school front with its sign; floor 900
  let s=(n?skyNight(t,.6):skySunset())+`<rect x="-200" y="320" width="1480" height="600" fill="${n?'#4a3a40':'#d99a6a'}"/><rect x="-200" y="306" width="1480" height="22" fill="${n?'#3a2e34':'#b07a4a'}"/>`;
  for(let i=0;i<6;i++)for(let j=0;j<2;j++) s+=`<rect x="${-120+i*210}" y="${380+j*170}" width="130" height="110" fill="${n?(i===4&&j===0?'#ffd98a':'#1a1e2e'):'#9fd0f0'}"/><rect x="${-120+i*210}" y="${430+j*170}" width="130" height="8" fill="${n?'#3a2e34':'#f3eee6'}"/>`;
  s+=`<rect x="420" y="250" width="240" height="64" rx="8" fill="#2f5a46"/><text x="540" y="295" text-anchor="middle" font-family="Inter" font-weight="900" font-size="38" fill="#fff">COLEGIO</text>`;
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="${n?'#2a2a36':'#b8b0a2'}"/>`;
  return s}

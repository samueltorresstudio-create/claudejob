// Desaparecen los adultos · Parte 2 «Los que vuelven» — scenes (S), key times (EVS) and config (CFG). Loaded after kit.js, before core.js.
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


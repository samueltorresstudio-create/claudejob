// Shared sets and props for the kids' series (needs lib.js, loaded before scenes.js).
// Every drawing function returns an SVG string. Floor line is y=900 unless stated otherwise.
let _uid=0; const uid=p=>p+(++_uid);
const A=o=>person(Object.assign({tall:true},o));
Object.assign(TINT,{lamp:{L:[1,.88,.74],C:[1,.95,.88]},tv:{L:[.42,.52,.82],C:[.66,.76,1]},dark:{L:[.36,.35,.5],C:[.6,.58,.74]}});
const NI=c=>L('dusk',c), NIC=c=>C('dusk',c), WARM=c=>L('afternoon',c), WARMC=c=>C('afternoon',c), DK=c=>L('dark',c), DKC=c=>C('dark',c), NT=c=>L('night',c), NTC=c=>C('night',c);
const KIDS=[{skin:'#f1c7a5',top:'#7a6aa8',hs:'short',hair:'#3a2a26'},{skin:'#8d5a3f',top:'#e07b3b',hs:'short',hair:'#1d1514'},{skin:'#f3d0b5',top:'#3f8f7a',hs:'pigtails',hair:'#c9a04a',fem:true,lashes:true},
  {skin:'#c99272',top:'#d9485a',hs:'long',hair:'#2a1d18',fem:true,lashes:true},{skin:'#efc4a0',top:'#5a8a4a',hs:'messy',hair:'#6a4a2a'},{skin:'#a86f4f',top:'#d9b34a',hs:'bun',hair:'#1d1514',fem:true,lashes:true},
  {skin:'#f6d2b8',top:'#4a9ad8',hs:'messy',hair:'#d9a04a'},{skin:'#e2b08e',top:'#c86ab0',hs:'long',hair:'#5a2a20',fem:true,lashes:true}];
const ADULTS=[{skin:'#f1c7a5',top:'#efe6d8',jacket:'#3a4a6a',hs:'short',hair:'#3a2a26'},{skin:'#8d5a3f',top:'#c9d6e0',jacket:'#5a4a3a',hs:'bald',hair:'#1d1514',beard:'#2a1d18'},
  {skin:'#f3d0b5',top:'#8a5a9a',hs:'bun',hair:'#c9a04a',fem:true,lashes:true},{skin:'#c99272',top:'#3f8f7a',hs:'short',hair:'#2a1d18',fem:true,lashes:true}];
const extra=(pal,i,o={})=>{const c=pal[i%pal.length];return A({...c,topD:mix(c.top,'#000000',.25),pants:c.pants||'#3a3a48',seed:i*7+3,...o})};

// ---------- skies & outdoors ----------
function skyDay(){return `<defs><linearGradient id="kSkyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cc0ee"/><stop offset="1" stop-color="#e2f5ff"/></linearGradient></defs><rect x="-600" y="-900" width="2280" height="2400" fill="url(#kSkyD)"/>`}
function skyNight(t,st=.6){return `<defs><linearGradient id="kSkyN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a1e"/><stop offset="1" stop-color="#1e2654"/></linearGradient></defs><rect x="-600" y="-900" width="2280" height="2400" fill="url(#kSkyN)"/>`+(st>0?stars(4,60,620,t,st):'')}
function skySunset(){return `<defs><linearGradient id="kSkyS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4a9a"/><stop offset=".55" stop-color="#e98a6a"/><stop offset="1" stop-color="#ffd09a"/></linearGradient></defs><rect x="-600" y="-900" width="2280" height="2400" fill="url(#kSkyS)"/>`}
function puffs(t,y,col='#fff',op=.85,speed=10,seed=2){let s='';const r=rng(seed);for(let i=0;i<4;i++){const x=((r()*1400+t*speed*(.6+r()*.6))%1700)-300,yy=y+r()*120;s+=`<g opacity="${op}"><ellipse cx="${x}" cy="${yy}" rx="150" ry="38" fill="${col}"/><ellipse cx="${x+70}" cy="${yy-26}" rx="90" ry="34" fill="${col}"/></g>`}return s}
function block(x,w,top,col,o={}){ // apartment block; windows 80x100 on a 150 grid. o.win(i,j,wx,wy) adds svg per window, o.lit(i,j) 0..1
  let s=`<rect x="${x}" y="${top}" width="${w}" height="${1300-top}" fill="${col}"/><rect x="${x}" y="${top}" width="${w}" height="14" fill="#000" opacity=".12"/>`;
  let j=0;for(let wy=top+50;wy<(o.bottom||840);wy+=160,j++){let i=0;for(let wx=x+40;wx<x+w-80;wx+=150,i++){
    const lit=o.lit?o.lit(i,j):0;
    s+=`<rect x="${wx-6}" y="${wy-6}" width="92" height="112" fill="${o.frame||'#e9e2d6'}"/><rect x="${wx}" y="${wy}" width="80" height="100" fill="${lit?mix('#2a3048','#ffd98a',lit):(o.night?'#141826':'#8ab8d8')}"/>`;
    if(o.win) s+=o.win(i,j,wx,wy);
    s+=`<rect x="${wx+37}" y="${wy}" width="6" height="100" fill="${o.frame||'#e9e2d6'}" opacity=".9"/>`;}}
  return s}
function pavement(night,y=880){return `<rect x="-600" y="${y}" width="2280" height="90" fill="${night?'#3a3e4a':'#cfc8bc'}"/><rect x="-600" y="${y}" width="2280" height="6" fill="#000" opacity=".1"/><rect x="-600" y="${y+90}" width="2280" height="600" fill="${night?'#20232c':'#55555e'}"/>${[0,1,2,3,4,5,6,7,8].map(i=>`<rect x="${-400+i*240}" y="${y+150}" width="120" height="10" fill="#e9e2d6" opacity="${night?.3:.7}"/>`).join('')}`}
function grass(y=880,col='#5aa651',night){return `<rect x="-600" y="${y}" width="2280" height="700" fill="${night?mix(col,'#0a1020',.6):col}"/><rect x="-600" y="${y}" width="2280" height="10" fill="#000" opacity=".08"/>`}
function streetLamp(x,y=880,on=1){return `<rect x="${x-6}" y="${y-470}" width="12" height="470" fill="#2a2e3e"/><path d="M${x},${y-470} Q${x},${y-500} ${x+40},${y-500} L${x+70},${y-500}" stroke="#2a2e3e" stroke-width="10" fill="none"/><rect x="${x+50}" y="${y-506}" width="44" height="16" rx="6" fill="${on?'#ffe6a0':'#5a5e6a'}"/>`+(on?`<polygon points="${x+56},${y-492} ${x+88},${y-492} ${x+240},${y} ${x-96},${y}" fill="#ffe6a0" opacity="${.1*on}"/><circle cx="${x+72}" cy="${y-496}" r="70" fill="url(#glowY)" opacity="${on}"/>`:'')}
function carK(x,y,s,col='#c9d2dc',lights=0){
  let g=`<ellipse cx="0" cy="0" rx="170" ry="16" fill="#000" opacity=".25"/><path d="M-160,-28 L-160,-74 Q-150,-90 -118,-94 L-78,-134 Q-66,-142 -44,-142 L62,-142 Q84,-142 100,-126 L132,-94 Q160,-90 166,-68 L166,-28Z" fill="${col}"/>`;
  g+=`<path d="M-64,-130 L-38,-130 L-38,-98 L-100,-98Z M-26,-130 L58,-130 Q72,-130 84,-116 L102,-98 L-26,-98Z" fill="#26304a"/><rect x="-160" y="-60" width="326" height="10" fill="#000" opacity=".1"/>`;
  for(const wx of [-96,104]) g+=`<circle cx="${wx}" cy="-28" r="32" fill="#16181f"/><circle cx="${wx}" cy="-28" r="13" fill="#9aa3ad"/>`;
  g+=`<rect x="152" y="-80" width="14" height="16" rx="4" fill="${mix('#8a8f99','#fff2b8',lights)}"/><rect x="-160" y="-80" width="10" height="16" rx="3" fill="${mix('#6a2a2a','#ff4a4a',lights)}"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`}
function rain(t,op=1,seed=7,n=90,h=1100){const r=rng(seed);let s='';
  for(let i=0;i<n;i++){const x0=r()*1300-100,sp=1000+r()*500,ph=r(),o=.25+.35*r();const y=((t*sp/h+ph)%1)*(h+120)-80,x=x0-y*.12;
    s+=`<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x-5).toFixed(0)}" y2="${(y+42).toFixed(0)}" stroke="#b9c8ff" stroke-width="2.5" opacity="${(op*o).toFixed(2)}"/>`}
  return s}
function pine(x,y,s,col='#2f6a4a'){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-12" y="-80" width="24" height="80" fill="#5a3a26"/><polygon points="0,-420 -120,-180 120,-180" fill="${col}"/><polygon points="0,-330 -140,-80 140,-80" fill="${mix(col,'#000000',.12)}"/></g>`}
function moonK(x,y){return `<circle cx="${x}" cy="${y}" r="110" fill="#f3efe0" opacity=".07"/><circle cx="${x}" cy="${y}" r="46" fill="#f3efe0"/><circle cx="${x-14}" cy="${y-8}" r="9" fill="#dcd6c2"/>`}

// ---------- interiors ----------
function wall(y1,col,base=true){return `<rect x="-600" y="-900" width="2280" height="${y1+900}" fill="${col}"/>`+(base?`<rect x="-600" y="${y1-26}" width="2280" height="26" fill="#f3eee6"/><rect x="-600" y="${y1-26}" width="2280" height="4" fill="#000" opacity=".1"/>`:'')}
function floorW(y0,col,y1=1500){let s=`<rect x="-600" y="${y0}" width="2280" height="${y1-y0}" fill="${col}"/>`;
  for(let y=y0+16,k=0;y<y1;k++,y+=18+k*7) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#000" stroke-opacity=".13" stroke-width="3"/>`;return s}
function floorTiles(y0,col,y1=1500){let s=`<rect x="-600" y="${y0}" width="2280" height="${y1-y0}" fill="${col}"/>`;
  for(let y=y0+30,k=0;y<y1;k++,y+=30+k*12) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#000" stroke-opacity=".1" stroke-width="3"/>`;
  for(let i=-8;i<=8;i++) s+=`<line x1="${540+i*80}" y1="${y0}" x2="${540+i*240}" y2="${y1}" stroke="#000" stroke-opacity=".08" stroke-width="3"/>`;return s}
function winK(x,y,w,h,inside,o={}){ // window: frame, what's outside (svg in world coords), optional curtains (o.cur colour, o.shut 0..1)
  const id=uid('wk');let s=`<rect x="${x-12}" y="${y-12}" width="${w+24}" height="${h+24}" fill="${o.frame||'#f3eee6'}"/><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inside}</g>`;
  s+=`<rect x="${x+w/2-4}" y="${y}" width="8" height="${h}" fill="${o.frame||'#f3eee6'}"/>`;
  if(o.cur){const sh=o.shut||0;s+=`<path d="M${x-40},${y-30} L${x+50+sh*(w/2-50)},${y-30} L${x+60+sh*(w/2-60)},${y+h+30} L${x-40},${y+h+30}Z" fill="${o.cur}"/><path d="M${x+w+40},${y-30} L${x+w-50-sh*(w/2-50)},${y-30} L${x+w-60-sh*(w/2-60)},${y+h+30} L${x+w+40},${y+h+30}Z" fill="${mix(o.cur,'#000000',.12)}"/>`;}
  return s}
function doorK(x,y,w,h,o={}){ // door hinged on the left, o.open 0..1 swings inwards, o.inside svg behind it, o.col, o.label
  const op=o.open||0, id=uid('dk');
  let s=`<rect x="${x-14}" y="${y-14}" width="${w+28}" height="${h+14}" fill="${o.frame||'#f3eee6'}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.dark||'#07060a'}"/>`;
  if(op>0&&o.inside) s+=`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${o.inside}</g>`;
  const lw=w*Math.cos(op*Math.PI/2*.92), sh=op*h*.06, col=o.col||'#8a5a3a';
  s+=`<path d="M${x},${y} L${x+lw},${y+sh} L${x+lw},${y+h-sh*.4} L${x},${y+h}Z" fill="${col}"/>`;
  if(lw>w*.2){s+=`<path d="M${x+lw*.12},${y+h*.08} L${x+lw*.88},${y+h*.08+sh*.8} L${x+lw*.88},${y+h*.44} L${x+lw*.12},${y+h*.44}Z M${x+lw*.12},${y+h*.52} L${x+lw*.88},${y+h*.52} L${x+lw*.88},${y+h*.92-sh*.3} L${x+lw*.12},${y+h*.92}Z" fill="#000" opacity=".08"/><circle cx="${x+lw*.86}" cy="${y+h*.52}" r="${w*.05}" fill="#d9b25a"/>`;
    if(o.label) s+=`<g transform="translate(${x+lw*.5},${y+h*.22}) scale(${lw/w},1)"><rect x="-60" y="-26" width="120" height="52" rx="10" fill="${o.labelCol||'#f3eee6'}"/><text x="0" y="12" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#2a2233">${o.label}</text></g>`;}
  if(o.under) s+=`<rect x="${x+2}" y="${y+h-6}" width="${w-4}" height="6" fill="${o.under}"/>`;
  return s}
function bedK(x,y,o={}){ // bed seen from the side-front; x = left end, y = floor
  const c=o.col||'#5a7ab0';
  let s=`<rect x="${x}" y="${y-300}" width="80" height="300" rx="10" fill="${o.wood||'#8a5a3a'}"/><rect x="${x+30}" y="${y-226}" width="170" height="56" rx="24" fill="#f3eee6"/>`;
  s+=`<rect x="${x}" y="${y-240}" width="${o.w||520}" height="140" rx="14" fill="${c}"/><rect x="${x}" y="${y-100}" width="${o.w||520}" height="100" fill="${mix(c,'#000000',.25)}"/>`;
  if(o.lump) s+=`<ellipse cx="${x+(o.w||520)*.6}" cy="${y-240}" rx="${150*o.lump}" ry="${46*o.lump}" fill="${c}"/>`;
  return s}
function bedroomK(t,o={}){ // kid's room: o.night, o.poster, o.bed(false), o.wardrobe(open), o.lamp
  const n=o.night;
  let s=wall(900,n?'#2e3250':(o.wallCol||'#cfe0d0'))+floorW(900,n?'#2a2228':'#9a7a5a');
  s+=winK(660,230,240,280,(n?skyNight(t,.8)+moonK(180+660,120+230):skyDay()+puffs(t,280,'#fff',.9,8)),{cur:n?'#3a3060':'#d96a5a',shut:o.shut||0});
  if(o.poster!==false) s+=`<rect x="120" y="240" width="170" height="230" fill="${n?'#3a2a4a':'#2a2440'}"/><circle cx="205" cy="330" r="50" fill="${n?'#6a3a4a':'#45e07e'}"/><text x="205" y="440" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="${n?'#7a6a50':'#f7d23e'}">${o.poster||'GOL!'}</text>`;
  if(o.bed!==false) s+=bedK(70,900,{col:n?'#3a3a5a':'#5a7ab0',lump:o.lump});
  return n?NT(s):s}
function wardrobeK(x,y,o={}){ // two-door wardrobe; x,y = top-left, 480x730; o.gap, o.eyes
  let s=`<rect x="${x}" y="${y}" width="480" height="730" fill="#4a3a30"/><rect x="${x+16}" y="${y+16}" width="220" height="698" fill="#5a4636"/><rect x="${x+244}" y="${y+16}" width="220" height="698" fill="#5a4636"/>`;
  const g=o.gap||0;
  s+=`<rect x="${x+240-g/2}" y="${y+16}" width="${g+4}" height="698" fill="#020204"/>`;
  if(o.eyes>0) s+=`<circle cx="${x+236}" cy="${y+250}" r="4" fill="#fff" opacity="${o.eyes}"/><circle cx="${x+246}" cy="${y+251}" r="4" fill="#fff" opacity="${o.eyes}"/>`;
  s+=`<circle cx="${x+228-g/2}" cy="${y+390}" r="9" fill="#c9b27a"/><circle cx="${x+252+g/2}" cy="${y+390}" r="9" fill="#c9b27a"/>`;
  return s}
function sofaK(cx,y,w,col){const D=mix(col,'#000000',.22),Lc=mix(col,'#ffffff',.12);
  return `<rect x="${cx-w/2+30}" y="${y-330}" width="${w-60}" height="210" rx="34" fill="${col}"/>`+[0,1].map(i=>`<rect x="${cx-w/2+56+i*(w-112)/2}" y="${y-312}" width="${(w-112)/2-8}" height="150" rx="26" fill="${Lc}"/>`).join('')+
    `<rect x="${cx-w/2}" y="${y-150}" width="${w}" height="136" rx="20" fill="${D}"/>`+[0,1].map(i=>`<rect x="${cx-w/2+70+i*(w-140)/2}" y="${y-172}" width="${(w-140)/2-8}" height="64" rx="18" fill="${col}"/>`).join('')}
function sofaArmsK(cx,y,w,col){const D=mix(col,'#000000',.3);return [-1,1].map(sd=>`<rect x="${cx+sd*(w/2-40)-48}" y="${y-250}" width="96" height="236" rx="34" fill="${D}"/>`).join('')}
function livingK(t,o={}){ // sofa wall, window, lamp, TV off-screen
  let s=wall(900,o.wallCol||'#c9b8a6')+winK(780,300,200,280,o.night?skyNight(t):skyDay(),{cur:'#8a4a5a'})+floorW(900,'#7a5640');
  s+=`<rect x="250" y="250" width="300" height="200" fill="#2a2622"/><rect x="262" y="262" width="276" height="176" fill="#6a8aa8"/><path d="M262,438 L360,330 L430,400 L480,350 L538,420 L538,438Z" fill="#3a5a4a"/>`;
  s+=`<rect x="135" y="470" width="10" height="430" fill="#3a2e28"/><path d="M80,470 L200,470 L180,370 L100,370Z" fill="#fff1c8"/>`+sofaK(540,900,660,o.sofa||'#3f6f74');
  return s}
function classroomK(t,o={}){ // facing the pupils: back wall with windows, corkboard, clock; floor at 900. o.night
  const n=o.night;
  let s=wall(900,n?'#2a2e48':'#e9dcc0')+floorTiles(900,n?'#22242e':'#b8b0a0');
  for(const x of [40,300]) s+=winK(x,200,200,300,n?skyNight(t,.5):skyDay()+puffs(t,240,'#fff',.9,6,x),{frame:n?'#4a4e66':'#f3eee6'});
  s+=`<rect x="560" y="210" width="300" height="200" fill="${n?'#4a3a30':'#c9945a'}"/>`+[0,1,2,3,4].map(i=>`<rect x="${580+(i%3)*90}" y="${226+Math.floor(i/3)*90}" width="70" height="70" fill="${['#ff8fb0','#8ac8f0','#f7d23e','#9ae09a','#fff'][i]}" opacity="${n?.4:1}" transform="rotate(${(i%2?4:-5)} ${615+(i%3)*90} ${261+Math.floor(i/3)*90})"/>`).join('');
  s+=`<circle cx="960" cy="260" r="56" fill="#fff" stroke="#2a2233" stroke-width="7"/><line x1="960" y1="260" x2="${960+30*Math.sin((o.h??9)/12*Math.PI*2)}" y2="${260-30*Math.cos((o.h??9)/12*Math.PI*2)}" stroke="#2a2233" stroke-width="6" stroke-linecap="round"/><line x1="960" y1="260" x2="${960+42*Math.sin((o.m??0)/60*Math.PI*2)}" y2="${260-42*Math.cos((o.m??0)/60*Math.PI*2)}" stroke="#2a2233" stroke-width="4" stroke-linecap="round"/>`;
  return n?NT(s):s}
function deskK(x,y,s=1,col='#c9945a'){ // pupil desk seen from the front; y = floor
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-130" y="-250" width="260" height="22" rx="6" fill="${col}"/><rect x="-118" y="-228" width="236" height="120" fill="${mix(col,'#000000',.2)}"/><rect x="-118" y="-108" width="12" height="108" fill="#5a5e6a"/><rect x="106" y="-108" width="12" height="108" fill="#5a5e6a"/></g>`}
function boardK(x,y,w,h,lines=[],o={}){ // whiteboard with handwriting
  let s=`<rect x="${x-14}" y="${y-14}" width="${w+28}" height="${h+40}" fill="#9aa1aa"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.green?'#2f5a46':'#f7f7f2'}"/>`;
  lines.forEach(([tx,rv,col],i)=>{s+=`<text x="${x+40}" y="${y+80+i*(o.lh||70)}" font-family="Inter" font-weight="800" font-style="italic" font-size="${o.size||52}" fill="${col||(o.green?'#f3eee6':'#2a3a8a')}">${tx.slice(0,Math.ceil(tx.length*clamp(rv??1)))}</text>`});
  return s}
function corridorK(t,o={}){ // school corridor: lockers on the back wall, tiled floor, ceiling lights
  const n=o.night;
  let s=wall(900,n?'#2a2e40':'#d9e2e9')+`<rect x="-600" y="-900" width="2280" height="1030" fill="${n?'#1e2232':'#c9d4dc'}"/>`+floorTiles(900,n?'#1e2028':'#c9c2b6');
  for(let i=0;i<5;i++) s+=`<rect x="${-20+i*240}" y="40" width="160" height="22" rx="6" fill="${n?(o.lights?'#fffbe0':'#3a3e4a'):'#fffbe8'}"/>`;
  for(let i=0;i<9;i++){const x=-40+i*130,c=o.lockCol||'#3f6fb5';s+=`<rect x="${x}" y="330" width="120" height="570" fill="${n?mix(c,'#000000',.5):c}"/><rect x="${x+10}" y="340" width="100" height="550" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="4"/>${[0,1,2,3].map(k=>`<rect x="${x+30}" y="${360+k*14}" width="60" height="6" fill="#000" opacity=".25"/>`).join('')}<rect x="${x+92}" y="600" width="10" height="40" rx="4" fill="#c9cdd2"/><text x="${x+60}" y="870" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="22" fill="#fff" opacity=".6">${(o.num0||100)+i}</text>`}
  s+=`<rect x="420" y="180" width="240" height="70" rx="8" fill="#1f5a3a"/><text x="540" y="228" text-anchor="middle" font-family="Inter" font-weight="900" font-size="36" fill="#7dffb0" opacity="${n?.9:.6}">SALIDA</text>`;
  return s}
function bathroomK(t,o={}){ // mirror over the sink; mirror rect x 330..750, y 160..640; o.reflect = svg drawn inside the mirror
  let s=wall(900,o.night?'#2a3040':'#d9eef0')+floorTiles(900,o.night?'#20242c':'#e9e9f0');
  for(let y=-200;y<900;y+=60) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#fff" stroke-opacity="${o.night?.04:.35}" stroke-width="3"/>`;
  const id=uid('mi');
  s+=`<rect x="310" y="140" width="460" height="520" rx="20" fill="#b9c1c8"/><clipPath id="${id}"><rect x="330" y="160" width="420" height="480" rx="12"/></clipPath><rect x="330" y="160" width="420" height="480" rx="12" fill="${o.night?'#3a4454':'#c9e0ea'}"/><g clip-path="url(#${id})">${o.reflect||''}<path d="M360,170 L460,170 L350,330Z" fill="#fff" opacity=".18"/></g>`;
  s+=`<rect x="300" y="700" width="480" height="60" rx="14" fill="#f3f3f6"/><rect x="340" y="760" width="400" height="140" fill="#e2e4ea"/><rect x="520" y="660" width="40" height="44" rx="8" fill="#9aa1aa"/>`;
  return s}

// ---------- props ----------
function bubble(x,y,w,h,txt,o={}){ // comic speech bubble sized to its text; short wide tail to (o.tx,o.ty)
  const col=o.col||'#fff', fg=o.fg||'#1d1b2a', op=o.op??1, K='#1d1b2a', sz=o.size||40, k=.85+.15*eBack(clamp(op));
  w=Math.max(160,txt.length*sz*.6+70); h=Math.max(h,sz*1.9);
  const r=12, tx=o.tx??x-40, ty=o.ty??y+h/2+60, bx=clamp((tx-x)/(w/2),-.75,.75)*w/2+x, by=ty<y?y-h/2:y+h/2, sgn=ty<y?-1:1;
  const tail=`M${bx-28},${by-sgn*6} Q${bx-6},${by+sgn*(Math.abs(ty-by)*.45)} ${tx},${ty} Q${bx+10},${by+sgn*(Math.abs(ty-by)*.35)} ${bx+30},${by-sgn*6}Z`;
  return `<g opacity="${clamp(op*1.5).toFixed(2)}" transform="translate(${x},${y}) scale(${k.toFixed(3)}) translate(${-x},${-y})"><g transform="translate(5,8)" opacity=".28"><path d="${tail}" fill="#000"/><rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="${r}" fill="#000"/></g>
    <path d="${tail}" fill="${col}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="${r}" fill="${col}" stroke="${K}" stroke-width="5"/><path d="${tail}" fill="${col}" transform="translate(0,${-sgn*7})"/>
    <text x="${x}" y="${y+sz*.36}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${sz}" fill="${fg}" ${o.italic?'font-style="italic"':''}>${txt}</text></g>`}
const dots=t=>['·','··','···'][Math.floor(t*3)%3];
function noteK(x,y,s,col='#f7d23e',op=1){return `<g transform="translate(${x},${y}) scale(${s}) rotate(-12)" opacity="${op}"><ellipse cx="0" cy="0" rx="16" ry="12" fill="${col}"/><rect x="12" y="-62" width="6" height="62" fill="${col}"/><path d="M18,-62 q22,10 18,32 q-6,-14 -18,-16Z" fill="${col}"/></g>`}
function dark(op,holes=[],col='#04050a'){ // darkness with soft holes of light, holes: [x,y,rx,ry]
  if(op<=0) return '';
  const id=uid('dk');
  return `<defs><radialGradient id="kHole"><stop offset="0" stop-color="#000"/><stop offset=".55" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <mask id="${id}" maskUnits="userSpaceOnUse" x="-900" y="-900" width="2900" height="2900"><rect x="-900" y="-900" width="2900" height="2900" fill="#fff"/>${holes.map(([x,y,rx,ry])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#kHole)"/>`).join('')}</mask></defs>
    <rect x="-900" y="-900" width="2900" height="2900" fill="${col}" opacity="${op}" mask="url(#${id})"/>`}
function stranger(x,y,s,o={}){ // tall thin figure: dark coat, pale long face, black eyes. o.tilt o.glint o.smile o.op
  let g=`<path d="M-74,0 L-86,-520 Q-88,-604 -40,-622 L40,-622 Q88,-604 86,-520 L74,0Z" fill="#101118"/>`;
  g+=`<path d="M-78,-590 Q-122,-380 -110,-150" stroke="#101118" stroke-width="36" stroke-linecap="round" fill="none"/><path d="M78,-590 Q122,-380 110,-150" stroke="#101118" stroke-width="36" stroke-linecap="round" fill="none"/>`;
  for(const sd of [-1,1]) for(let f=0;f<4;f++) g+=`<line x1="${sd*(102+f*5)}" y1="-150" x2="${sd*(98+f*7)}" y2="${-84+f%2*8}" stroke="#d6d3c8" stroke-width="9" stroke-linecap="round"/>`;
  g+=`<g transform="rotate(${o.tilt||0} 0 -640)"><rect x="-15" y="-668" width="30" height="56" fill="#cfccc0"/><ellipse cx="0" cy="-748" rx="70" ry="98" fill="#dcd9ce"/><path d="M-74,-756 Q-76,-852 0,-850 Q76,-852 74,-756 L66,-712 Q62,-800 0,-798 Q-62,-800 -66,-712Z" fill="#0b0b10"/>`;
  g+=`<ellipse cx="-27" cy="-752" rx="16" ry="21" fill="#07070a"/><ellipse cx="27" cy="-752" rx="16" ry="21" fill="#07070a"/>`;
  if(o.glint) g+=`<circle cx="-25" cy="-752" r="${4.5*o.glint}" fill="#fff"/><circle cx="29" cy="-752" r="${4.5*o.glint}" fill="#fff"/>`;
  g+=`<path d="M-34,-684 Q0,-${670-(o.smile||0)*14} 34,-684" stroke="#3a3436" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${o.op??1}">${g}</g>`}
function fingersK(ex,y,a,col='#c9c6bb',dir=1){ // long fingers curling round an edge at x=ex (dir 1: from the right side)
  let f='';const len=[40,50,47,34];
  for(let i=0;i<4;i++){const yy=y+i*17,L_=len[i]*a,bx=ex+dir*14;
    f+=`<path d="M${bx},${yy} L${ex-dir*4},${yy-2} Q${ex-dir*L_*.55},${yy-4} ${ex-dir*L_},${yy+6}" stroke="${col}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    if(a>.3) f+=`<ellipse cx="${ex-dir*(L_-3)}" cy="${yy+5}" rx="4" ry="3" fill="#4a3a3a"/>`;}
  return f}
function notebookK(x,y,s,lines,o={}){ // open notebook with handwriting: lines [[text, reveal 0..1, side -1|1, colour]]
  let g=`<rect x="-300" y="-210" width="600" height="420" rx="14" fill="${o.cover||'#2f4a7a'}"/><rect x="-286" y="-196" width="282" height="392" fill="#fffdf3"/><rect x="4" y="-196" width="282" height="392" fill="#fffdf3"/>`;
  for(let i=0;i<8;i++) g+=`<line x1="-280" y1="${-150+i*46}" x2="280" y2="${-150+i*46}" stroke="#9fc0e0" stroke-width="2" opacity=".6"/>`;
  g+=`<rect x="-6" y="-196" width="12" height="392" fill="#d9d2c4"/>`;
  lines.forEach(([tx,rv,side,col],i)=>{const n=Math.ceil(tx.length*clamp(rv));g+=`<text x="${side>0?20:-270}" y="${-110+i*60}" font-family="Inter" font-weight="800" font-style="italic" font-size="${o.size||34}" fill="${col||'#283a8a'}">${tx.slice(0,n)}</text>`});
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${o.rot||-3})">${g}</g>`}
function paperNote(x,y,s,title,lines,o={}){ // sticky/paper note with a title and handwritten lines
  let g=`<rect x="-260" y="-300" width="520" height="${o.h||560}" fill="${o.col||'#fff6c8'}"/>`;
  for(let i=0;i<10;i++) g+=`<line x1="-260" y1="${-170+i*48}" x2="260" y2="${-170+i*48}" stroke="#9fc0e0" stroke-width="2" opacity=".5"/>`;
  g+=`<text x="0" y="-210" text-anchor="middle" font-family="Inter" font-weight="900" font-style="italic" font-size="58" fill="${o.ink||'#283a8a'}">${title}</text>`;
  lines.forEach(([tx,rv],i)=>{g+=`<text x="-226" y="${-130+i*48}" font-family="Inter" font-weight="700" font-style="italic" font-size="36" fill="${o.ink||'#283a8a'}">${tx.slice(0,Math.ceil(tx.length*clamp(rv??1)))}</text>`});
  return `<g transform="translate(${x},${y}) rotate(${o.rot??-3}) scale(${s})"><rect x="-252" y="-292" width="520" height="${o.h||560}" fill="#000" opacity=".14"/>${g}<circle cx="0" cy="-300" r="24" fill="#e2453b"/></g>`}
function firework(cx,cy,r,col,a){if(a<=0||a>=1)return'';let s='';for(let i=0;i<16;i++){const an=i/16*Math.PI*2,rr=r*eOut(a);s+=`<line x1="${(cx+Math.cos(an)*rr*.55).toFixed(1)}" y1="${(cy+Math.sin(an)*rr*.55+a*a*40).toFixed(1)}" x2="${(cx+Math.cos(an)*rr).toFixed(1)}" y2="${(cy+Math.sin(an)*rr+a*a*60).toFixed(1)}" stroke="${col}" stroke-width="${(7*(1-a)+2).toFixed(1)}" stroke-linecap="round" opacity="${(1-a*a).toFixed(2)}"/>`}return s}
function bigText(txt,x,y,size,col='#fff',a=1,glow='#ffd76a'){return a>0?`<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${size}" fill="${col}" opacity="${a.toFixed(2)}" stroke="#11131f" stroke-width="${(size*.14).toFixed(1)}" stroke-linejoin="round" paint-order="stroke" style="filter:drop-shadow(0 0 22px ${col}88) drop-shadow(0 8px 0 rgba(0,0,0,.35))">${txt}</text>`:''}
function countPop(txt,x,y,size,k,col='#fff'){return `<g transform="translate(${x},${y}) scale(${(1+.3*Math.exp(-k*8)).toFixed(3)}) translate(${-x},${-y})">${bigText(txt,x,y,size,col,1)}</g>`}
function shake(t,a,amt=10){return a>0?Math.sin(t*61)*amt*a:0}
// ---------- phones ----------
function phoneK(x,y,s,screen,rot=0){ // 300x620 handset; screen content in local coords 0..280 x 0..590
  const id=uid('ph');
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-150" y="-310" width="300" height="620" rx="46" fill="#15161c"/><rect x="-146" y="-306" width="292" height="612" rx="44" fill="none" stroke="#4a4f5a" stroke-width="3"/>
    <clipPath id="${id}"><rect x="-140" y="-295" width="280" height="590" rx="36"/></clipPath><g clip-path="url(#${id})"><g transform="translate(-140,-295)">${screen}</g></g><rect x="-36" y="-288" width="72" height="20" rx="10" fill="#000"/></g>`}
function statusK(o={}){const col=o.col||'#fff';return `<text x="26" y="44" font-family="Inter" font-weight="700" font-size="20" fill="${col}">${o.left||'9:41'}</text><rect x="214" y="28" width="38" height="18" rx="5" fill="none" stroke="${col}" stroke-width="2.5"/><rect x="218" y="32" width="${30*(o.bat??.8)}" height="10" rx="2" fill="${(o.bat??.8)<.2?PINK:col}"/>`}
function chatK(title,msgs,o={}){ // chat screen: msgs [[text, side(-1 them/1 me), reveal]]
  let s=`<rect width="280" height="590" fill="#0f1420"/><rect width="280" height="96" fill="#1b2232"/>`+statusK({left:o.time||'23:58'});
  s+=`<circle cx="44" cy="70" r="18" fill="${o.avatar||'#3f6fb5'}"/><text x="72" y="78" font-family="Inter" font-weight="800" font-size="22" fill="#fff">${title}</text>`;
  let y=130;msgs.forEach(([tx,side,rv])=>{if((rv??1)<=0)return;const lines=tx.split('|'),w=Math.min(220,Math.max(...lines.map(l=>l.length))*11+30),h=lines.length*26+18,x=side>0?262-w:18;
    s+=`<g opacity="${clamp((rv??1)*3)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${side>0?'#2f8a5a':'#2a3246'}"/>${lines.map((l,i)=>`<text x="${x+15}" y="${y+28+i*26}" font-family="Inter" font-weight="600" font-size="19" fill="#fff">${l}</text>`).join('')}</g>`;y+=h+12;});
  return s}
function handsPhone(x,y,s,screen,skin,sleeve){ // two hands holding a phone (first-person view)
  const hand=(hx,hy,sd)=>`<path d="M${hx+sd*40},${hy+700} L${hx+sd*10},${hy+60}" stroke="${sleeve}" stroke-width="120" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="62" fill="${skin}"/><circle cx="${hx-sd*44}" cy="${hy-50}" r="26" fill="${skin}"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${hand(-170,240,-1)+hand(170,260,1)}${phoneK(0,0,1,screen)}<circle cx="-150" cy="150" r="34" fill="${skin}"/><circle cx="150" cy="170" r="34" fill="${skin}"/></g>`}
// ---------- the ID card scene shared by every video ----------
function idCard(t,D,o){ // o: {who, header, col, name, age, ageAt, rows:[[label,value,showAt,colour]], bg}
  let s=`<rect width="1080" height="1100" fill="${o.bg||'#181b34'}"/>`;
  for(let x=0;x<=1080;x+=60) s+=`<line x1="${x}" y1="0" x2="${x}" y2="1100" stroke="#fff" stroke-opacity=".05" stroke-width="1.5"/>`;
  s+=A({...o.who,x:250,y:1070,s:.9,look:[11,0]});
  const ca=eOut(prog(t,.03,.3));
  let c=`<rect x="0" y="0" width="560" height="${o.h||480}" rx="26" fill="#f7f4ec"/><rect x="0" y="0" width="560" height="96" rx="26" fill="${o.col||'#3a6fb5'}"/><rect x="0" y="60" width="560" height="36" fill="${o.col||'#3a6fb5'}"/>`;
  c+=`<text x="30" y="64" font-family="${MONO}" font-weight="800" font-size="30" fill="#fff" letter-spacing="3">${o.header||'IDENTIFICACIÓN'}</text>`;
  c+=`<text x="30" y="150" font-family="${MONO}" font-weight="700" font-size="20" fill="#8a8f99">NOMBRE</text><text x="30" y="210" font-family="Inter" font-weight="900" font-size="64" fill="#1f2a3a">${o.name.slice(0,Math.ceil(prog(t,.1,.35)*o.name.length))}</text>`;
  c+=`<text x="380" y="150" font-family="${MONO}" font-weight="700" font-size="20" fill="#8a8f99">EDAD</text><text x="380" y="210" font-family="Inter" font-weight="900" font-size="64" fill="#1f2a3a" opacity="${prog(t,o.ageAt,o.ageAt+.12)}">${o.age}</text>`;
  (o.rows||[]).forEach(([lab,val,at,col],i)=>{c+=`<g opacity="${prog(t,at,at+.15)}"><text x="30" y="${290+i*90}" font-family="${MONO}" font-weight="700" font-size="20" fill="#8a8f99">${lab}</text><text x="30" y="${345+i*90}" font-family="Inter" font-weight="900" font-size="46" fill="${col||'#1f2a3a'}">${val}</text></g>`});
  s+=`<g opacity="${ca}" transform="translate(${470+(1-ca)*50},300) rotate(${lerp(6,-3,ca)})">${c}</g>`;
  return cam(s,1+.03*t/D);
}

// ---- focus shot: the camera pushes in on a character at an important moment ----
// focusCam(bg, fg, k, fx, fy, o): bg = background svg, fg = characters svg, k = push progress 0..1 (use eIO(prog(t,a,b))),
// (fx,fy) = the point to push into (usually the face: x, y - s*640 for A() at scale s). o.z0 start zoom (1.05), o.z1 end zoom (2.5),
// o.ty where the face ends on screen (560), o.blur max background blur (7), o.bars cinema bars (true), o.dx camera shake.
function focusCam(bg,fg,k,fx,fy,o={}){
  const z=lerp(o.z0??1.05,o.z1??2.5,k), cx=lerp(o.cx??540,fx,k), cy=lerp(o.cy??560,fy,k), ty=lerp(560,o.ty??560,k);
  const id=uid('dof'), b=(o.blur??7)*k, T=c=>`<g transform="translate(${(540+(o.dx||0)).toFixed(1)},${ty.toFixed(1)}) scale(${z.toFixed(4)}) translate(${(-cx).toFixed(1)},${(-cy).toFixed(1)})">${c}</g>`;
  let s=`<defs><filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${b.toFixed(2)}"/></filter></defs>`;
  s+=T(`<g filter="url(#${id})">${bg}</g><rect x="-900" y="-900" width="2900" height="2900" fill="#000" opacity="${(.28*k).toFixed(2)}"/>`)+T(fg);
  if(o.bars!==false&&k>.02) s+=`<rect x="0" y="0" width="1080" height="${(70*k).toFixed(1)}" fill="#000"/><rect x="0" y="${(1100-70*k).toFixed(1)}" width="1080" height="${(70*k).toFixed(1)}" fill="#000"/>`;
  return s}

// ---- ambience particles: dust in a light beam, rain, snow, sparks, embers ----
function particles(t,kind,o={}){
  const r=rng(o.seed||kind.length*13), n=o.n||({dust:26,rain:70,snow:50,sparks:18,embers:22}[kind]), x0=o.x0??-100, x1=o.x1??1180, y0=o.y0??-100, y1=o.y1??1100, op=o.op??1;
  let s='';
  for(let i=0;i<n;i++){const bx=x0+r()*(x1-x0), by=y0+r()*(y1-y0), sp=.6+r()*.8, ph=r()*10;
    if(kind==='dust'){const x=bx+Math.sin(t*.4*sp+ph)*24, y=by+Math.cos(t*.3*sp+ph)*18;s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.5+r()*2.5).toFixed(1)}" fill="${o.col||'#fff6d8'}" opacity="${(op*(.35+.4*Math.abs(Math.sin(t*1.3+ph)))).toFixed(2)}"/>`;}
    else if(kind==='rain'){const H=y1-y0, y=y0+((by-y0+t*1400*sp)%H), x=bx-(y-y0)*.12;s+=`<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x-6).toFixed(1)}" y2="${(y+38*sp).toFixed(1)}" stroke="${o.col||'#cfe2f0'}" stroke-width="2.5" opacity="${(.55*op).toFixed(2)}" stroke-linecap="round"/>`;}
    else if(kind==='snow'){const H=y1-y0, y=y0+((by-y0+t*90*sp)%H), x=bx+Math.sin(t*1.2+ph)*20;s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2.5+r()*3.5).toFixed(1)}" fill="${o.col||'#fff'}" opacity="${(.85*op).toFixed(2)}"/>`;}
    else {const p=((t*(kind==='sparks'?1.6:.45)*sp+ph)%1), x=bx+Math.sin(ph+t*2)*(kind==='sparks'?60:22)*p, y=by-p*(kind==='sparks'?160:320);
      s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(kind==='sparks'?2.5:3.2).toFixed(1)}" fill="${o.col||(kind==='sparks'?'#ffe27a':'#ff9a3a')}" opacity="${(op*(1-p)).toFixed(2)}"/>`;}}
  return s}
// ---- sweat drops next to a character's head (x,y = feet, s = scale) ----
function sweat(x,y,s,t){let g='';for(const [dx,dy,ph] of [[96,-720,0],[-104,-690,.5]]){const p=(t*.9+ph)%1, yy=dy+p*50;
  g+=`<path d="M${dx},${yy-38} Q${dx+20},${yy} ${dx},${yy+16} Q${dx-20},${yy} ${dx},${yy-38}Z" fill="#bfe6ff" stroke="#1d1b2a" stroke-width="4" opacity="${(1-p*.6).toFixed(2)}"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`}

// ---- crowd: a group with coherent sizes. Everyone in a row shares the same scale and the same floor line;
// kids (cast kid:true or o.kid) use the child body at the SAME scale (same head, shorter body), never a smaller scale.
// list: [{c:'C12'|{...look}, x?, mouth, eyes, look, phoneR, ...}], o: {y (front floor, 1010), s (.58), x0, x1, rows (1|2), gap}
function crowd(list,o={}){
  const rows=o.rows||(list.length>6?2:1), s=o.s??.58, y=o.y??1010, x0=o.x0??120, x1=o.x1??960;
  const order=list.map((p,i)=>({...p,row:p.row??(rows===2?(i%2):0)}));
  let out='';
  for(const row of rows===2?[1,0]:[0]){
    const ps=order.filter(p=>p.row===row), n=ps.length, rs=row===1?s*.86:s, ry=row===1?y-70:y;
    ps.forEach((p,i)=>{const base=typeof p.c==='string'?{...CAST_BY_ID[p.c].o}:(p.c||{}), isKid=p.kid??(typeof p.c==='string'&&CAST_BY_ID[p.c].kid);
      const x=p.x??(n===1?(x0+x1)/2:lerp(x0,x1,i/(n-1))+(row===1?(x1-x0)/(2*Math.max(1,n-1)):0));
      const fn=isKid?kid:A, q={...base,...p};delete q.c;delete q.row;delete q.kid;
      out+=fn({look:[0,0],...q,x,y:ry,s:isKid?rs*.92:rs});});}
  return out}

// ================= WALL & ROOM DETAILS — no empty walls, ever =================
// Each returns svg at (x,y) = its anchor (top-left for frames/posters, bottom-centre for floor items), s = scale.
const D_K='#2a2420';
function dFrame(x,y,s=1,o={}){const w=o.w||150,h=o.h||110,f=o.frame||'#5a3e2a',pic=o.pic||'land';let g=`<rect x="4" y="6" width="${w}" height="${h}" fill="#000" opacity=".18"/><rect width="${w}" height="${h}" fill="${f}"/><rect x="10" y="10" width="${w-20}" height="${h-20}" fill="#f3eee2"/>`;
  if(pic==='land') g+=`<rect x="16" y="16" width="${w-32}" height="${h-32}" fill="#9cc4dc"/><path d="M16,${h-16} L${w*.38},${h*.45} L${w*.6},${h-30} L${w*.75},${h*.55} L${w-16},${h-16}Z" fill="#5a8a5a"/><circle cx="${w*.75}" cy="${h*.32}" r="${h*.09}" fill="#ffe08a"/>`;
  else if(pic==='photo') g+=`<rect x="16" y="16" width="${w-32}" height="${h-32}" fill="#c8b8a0"/><circle cx="${w*.38}" cy="${h*.45}" r="${h*.13}" fill="#e2b08a"/><circle cx="${w*.62}" cy="${h*.48}" r="${h*.12}" fill="#d9a07a"/><rect x="${w*.26}" y="${h*.58}" width="${w*.48}" height="${h*.26}" fill="#5a6a8a"/>`;
  else if(pic==='abstract') g+=`<rect x="16" y="16" width="${w-32}" height="${h-32}" fill="#e9dcc0"/><circle cx="${w*.4}" cy="${h*.5}" r="${h*.2}" fill="#d4782a"/><rect x="${w*.5}" y="${h*.3}" width="${w*.25}" height="${h*.4}" fill="#3a6aa8"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`}
function dShelf(x,y,s=1,o={}){const w=o.w||240;let g=`<rect x="0" y="0" width="${w}" height="14" fill="#6a4a30"/><rect x="0" y="14" width="${w}" height="4" fill="#000" opacity=".2"/><path d="M20,14 l0,22 l14,-22Z M${w-34},14 l14,22 l0,-22Z" fill="#4a3220"/>`;
  const r=rng(o.seed||x);let bx=12;const cols=['#c23a3a','#3a6aa8','#e0b04a','#3a8a5a','#e9e4d8','#7a4a8a'];
  for(let i=0;i<5&&bx<w*.55;i++){const bw=14+r()*10,bh=44+r()*22;g+=`<rect x="${bx}" y="${-bh}" width="${bw}" height="${bh}" fill="${cols[Math.floor(r()*6)]}"/><rect x="${bx}" y="${-bh+8}" width="${bw}" height="4" fill="#fff" opacity=".25"/>`;bx+=bw+3;}
  g+=`<path d="M${w*.68},0 l-12,-40 l40,0 l-12,40Z" fill="#c2603a"/>`+[0,1,2,3].map(i=>`<path d="M${w*.68+8},-40 Q${w*.68-20+i*16},${-90+i*6} ${w*.68-14+i*16},${-70+i*8}" stroke="#3a7a4a" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('');
  g+=`<rect x="${w*.84}" y="-30" width="26" height="30" rx="4" fill="#e9e4d8"/><rect x="${w*.84+4}" y="-24" width="18" height="10" fill="#9aa3ad"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`}
function dClock(x,y,s=1,t=0,o={}){const r=o.r||46, stopped=o.stopped;const hA=stopped?(o.h??12.55)*30:(t*.5)%360, mA=stopped?(o.m??33)*6:(t*6)%360;
  return `<g transform="translate(${x},${y}) scale(${s})"><circle r="${r+8}" fill="#2a2e3a"/><circle r="${r}" fill="#f3eee6"/>${[...Array(12)].map((_,i)=>`<rect x="-2" y="${-r+4}" width="4" height="${i%3?7:12}" fill="#2a2e3a" transform="rotate(${i*30})"/>`).join('')}<rect x="-3" y="${-r*.5}" width="6" height="${r*.5}" fill="#2a2e3a" transform="rotate(${hA})"/><rect x="-2" y="${-r*.75}" width="4" height="${r*.75}" fill="#2a2e3a" transform="rotate(${mA})"/><circle r="5" fill="#c23a3a"/></g>`}
function dSocket(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-20" y="-20" width="40" height="40" rx="5" fill="#f3eee6" stroke="#c9c2b0" stroke-width="2"/><circle cx="-7" cy="0" r="3.5" fill="#6a6a6a"/><circle cx="7" cy="0" r="3.5" fill="#6a6a6a"/></g>`}
function dSwitch(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-18" y="-26" width="36" height="52" rx="5" fill="#f3eee6" stroke="#c9c2b0" stroke-width="2"/><rect x="-8" y="-14" width="16" height="28" rx="3" fill="#e2dccf" stroke="#b8b0a2" stroke-width="2"/></g>`}
function dCalendar(x,y,s=1,o={}){let g=`<rect x="3" y="5" width="110" height="140" fill="#000" opacity=".15"/><rect width="110" height="140" fill="#fff"/><rect width="110" height="34" fill="${o.col||'#c23a3a'}"/><text x="55" y="24" text-anchor="middle" font-family="Inter" font-weight="900" font-size="16" fill="#fff">${o.month||'NOVIEMBRE'}</text>`;
  for(let r=0;r<4;r++) for(let c=0;c<5;c++) g+=`<rect x="${10+c*19}" y="${44+r*22}" width="13" height="13" fill="${o.mark&&r===1&&c===2?'#c23a3a':'#d9d4ca'}"/>`;
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${o.rot??-2})"><circle cx="55" cy="-8" r="5" fill="#9aa3ad"/>${g}</g>`}
function dPoster(x,y,s=1,o={}){const w=o.w||130,h=o.h||180,c1=o.c1||'#3a4a8a',c2=o.c2||'#ffd34a';return `<g transform="translate(${x},${y}) scale(${s}) rotate(${o.rot??1.5})"><rect x="4" y="6" width="${w}" height="${h}" fill="#000" opacity=".15"/><rect width="${w}" height="${h}" fill="${c1}"/><circle cx="${w/2}" cy="${h*.42}" r="${w*.28}" fill="${c2}"/><rect x="${w*.15}" y="${h*.78}" width="${w*.7}" height="10" fill="#fff" opacity=".8"/><rect x="${w*.25}" y="${h*.86}" width="${w*.5}" height="7" fill="#fff" opacity=".5"/><circle cx="8" cy="8" r="4" fill="#c9c2b0"/><circle cx="${w-8}" cy="8" r="4" fill="#c9c2b0"/></g>`}
function dSconce(x,y,s=1,on=1){return `<g transform="translate(${x},${y}) scale(${s})">${on?'<circle cx="0" cy="10" r="120" fill="url(#glowY)" opacity=".6"/>':''}<rect x="-6" y="0" width="12" height="40" fill="#2a2e3a"/><path d="M-34,-6 L34,-6 L22,-50 L-22,-50Z" fill="${on?'#fff2c8':'#d8cfba'}" stroke="#a8a090" stroke-width="2"/></g>`}
function dRadiator(x,y,s=1,o={}){const n=o.n||8;let g='';for(let i=0;i<n;i++) g+=`<rect x="${i*22}" y="-110" width="18" height="110" rx="7" fill="#e9e4d8" stroke="#c9c2b0" stroke-width="2"/>`;return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-6" y="-8" width="${n*22+10}" height="10" fill="#c9c2b0"/>${g}</g>`}
function dPlant(x,y,s=1,o={}){const pot=o.pot||'#b8603a';let g=`<path d="M-34,0 L-26,-70 L26,-70 L34,0Z" fill="${pot}"/><rect x="-30" y="-78" width="60" height="12" fill="${mix(pot,'#000000',.15)}"/>`;
  for(let i=0;i<7;i++){const a=-75+i*25;g+=`<g transform="translate(0,-76) rotate(${a})"><path d="M0,0 Q16,-60 0,-${110+(i%3)*20} Q-16,-60 0,0Z" fill="${i%2?'#3a7a4a':'#4f9a5a'}"/></g>`;}
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`}
function dHooks(x,y,s=1,o={}){let g=`<rect x="0" y="0" width="200" height="16" fill="#6a4a30"/>`+[30,100,170].map(hx=>`<rect x="${hx-4}" y="12" width="8" height="22" fill="#2a2420"/>`).join('');
  if(o.coat!==false) g+=`<path d="M86,30 L70,40 L60,150 L140,150 L130,40 L114,30Z" fill="${o.coat||'#8a5a3a'}"/><path d="M100,30 L100,150" stroke="#000" opacity=".15" stroke-width="4"/>`;
  if(o.bag) g+=`<path d="M160,30 Q170,60 180,40" stroke="#5a4030" stroke-width="5" fill="none"/><rect x="152" y="54" width="42" height="50" rx="8" fill="${o.bag}"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`}
function dWallpaper(o={}){ // pattern over a wall rectangle: 'stripes' | 'dots' | 'diamonds' | 'tiles'
  const x0=o.x0??-600, y0=o.y0??-900, w=o.w??2280, h=o.h??1790, c=o.col||'#000', op=o.op??.035, k=o.kind||'stripes';let s='';
  if(k==='stripes') for(let x=x0;x<x0+w;x+=48) s+=`<rect x="${x}" y="${y0}" width="16" height="${h}" fill="${c}" opacity="${op}"/>`;
  else if(k==='dots') for(let y=y0;y<y0+h;y+=60) for(let x=x0+((y/60)%2)*30;x<x0+w;x+=60) s+=`<circle cx="${x}" cy="${y}" r="4" fill="${c}" opacity="${op*2}"/>`;
  else if(k==='diamonds') for(let y=y0;y<y0+h;y+=70) for(let x=x0+((y/70)%2)*40;x<x0+w;x+=80) s+=`<path d="M${x},${y-12} l12,12 l-12,12 l-12,-12Z" fill="${c}" opacity="${op*1.8}"/>`;
  else if(k==='tiles') for(let y=y0;y<y0+h;y+=64) s+=`<line x1="${x0}" y1="${y}" x2="${x0+w}" y2="${y}" stroke="${c}" stroke-opacity="${op*3}" stroke-width="3"/>`+'';
  return s}
function dBaseboard(y,col='#efe6d6'){return `<rect x="-600" y="${y-24}" width="2280" height="24" fill="${col}"/><rect x="-600" y="${y-4}" width="2280" height="5" fill="#000" opacity=".18"/>`}
function dCorner(op=.25){return `<radialGradient id="dcv" cx=".5" cy=".45" r=".7"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1a10" stop-opacity="${op}"/></radialGradient><rect x="-600" y="-900" width="2280" height="2400" fill="url(#dcv)"/>`}
// a lived-in wall in one call: wallpaper + baseboard + the items you list (kind, x, y, scale, options).
// e.g. decorWall({floor:900, items:[['frame',120,300,1,{pic:'photo'}],['shelf',420,330],['clock',900,260],['socket',640,820],['plant',980,900]]})
function decorWall(o={}){const F={frame:dFrame,shelf:dShelf,clock:(x,y,s,op)=>dClock(x,y,s,window.__T||0,op),socket:dSocket,switch:dSwitch,calendar:dCalendar,poster:dPoster,sconce:dSconce,radiator:dRadiator,plant:dPlant,hooks:dHooks};
  let s=dWallpaper({kind:o.paper||'stripes',col:o.paperCol,op:o.paperOp,h:(o.floor??900)+900});
  for(const [k,x,y,sc,op] of (o.items||[])) s+=F[k]?F[k](x,y,sc??1,op||{}):'';
  if(o.floor!==null) s+=dBaseboard(o.floor??900,o.base);
  return s}

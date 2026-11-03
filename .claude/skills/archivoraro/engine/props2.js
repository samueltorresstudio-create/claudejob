// Tsunami parts 2-3 — extra props: the other survivors, night on the roof, the ruined town, water, the radio, the supermarket.
const LUCIA={skin:'#f1c7a5',hs:'pigtails',hair:'#6a3a24',top:'#e07bb0',topD:'#b85a8a',pants:'#3a4a6a',shoes:'#e9e9ee',fem:true,lashes:true,seed:51};
const ELENA={skin:'#e9c3a2',hs:'bun',hair:'#5a3a24',top:'#6a8ab8',topD:'#4a6a98',pants:'#3a3a48',shoes:'#2a2a33',fem:true,lashes:true,seed:52};
const RUBEN={skin:'#d6a07a',hs:'messy',hair:'#1d1514',top:'#e9e4d8',topD:'#c9c2b0',jacket:'#c23a3a',pants:'#2a3a5a',shoes:'#1d1d22',seed:53};
const TONI={skin:'#c99272',hs:'bald',hair:'#2a1d18',beard:'#4a3a30',top:'#5a6a7a',topD:'#3a4a5a',pants:'#3a3a32',shoes:'#2a2a2a',seed:54};
const kid=o=>person(o);

function drips(x,y,t,w=120,n=5,seed=1){ // water dripping off wet clothes
  const r=rng(seed);let s='';
  for(let i=0;i<n;i++){const ox=x+(r()-.5)*w, p=((t*1.4+r())%1);s+=`<ellipse cx="${ox.toFixed(0)}" cy="${(y+p*120).toFixed(0)}" rx="4" ry="7" fill="#9fd0ff" opacity="${(.8*(1-p)).toFixed(2)}"/>`}
  return s}
function bagClosed(x,y,s=1,o={}){ // the grab bag standing on the ground
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${o.op??1}"><ellipse cx="0" cy="4" rx="110" ry="14" fill="#000" opacity=".2"/><path d="M-100,0 L100,0 L92,-190 Q0,-226 -92,-190Z" fill="${PACK}"/><path d="M-92,-190 Q0,-226 92,-190 L84,-150 Q0,-178 -84,-150Z" fill="#3a3e2a"/><rect x="-56" y="-120" width="112" height="76" rx="12" fill="#4a5034"/><path d="M-30,-212 Q0,-250 30,-212" stroke="#3a3e2a" stroke-width="12" fill="none"/>${o.tied?`<path d="M80,-60 Q${o.tied[0]},${o.tied[1]+60} ${o.tied[0]},${o.tied[1]}" stroke="${YEL}" stroke-width="6" stroke-dasharray="14 10" fill="none"/>`:''}</g>`}
function roofHut(x,y,open=0){ // stairwell hut on the roof with a metal door. y = roof level
  let s=`<rect x="${x-150}" y="${y-330}" width="300" height="330" fill="#b8b0a4"/><rect x="${x-160}" y="${y-350}" width="320" height="26" fill="#9a948a"/><rect x="${x+110}" y="${y-330}" width="40" height="330" fill="#000" opacity=".08"/>`;
  s+=`<rect x="${x-70}" y="${y-250}" width="140" height="250" fill="#141418"/>`;
  const w=140*(1-open);
  s+=`<path d="M${x-70},${y-250} L${x-70+w},${y-250+open*14} L${x-70+w},${y-open*14} L${x-70},${y}Z" fill="#6a7480"/><circle cx="${x-70+w*.85}" cy="${y-120}" r="7" fill="#c9c2b0" opacity="${1-open}"/>`;
  s+=`<rect x="${x-60}" y="${y-300}" width="120" height="32" fill="#2f8a5a"/><text x="${x}" y="${y-276}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="20" fill="#fff">SALIDA</text>`;
  return s}
function skyTod(kind){ // day / afternoon / dusk / night / dawn gradients
  const G={day:['#7a9ab8','#c9cfd2'],afternoon:['#5aa4d8','#ffe2b0'],dusk:['#2a2e5a','#e08a6a'],night:['#070a1c','#1a2244'],dawn:['#4a5a8a','#ffb48a']}[kind]||['#7a9ab8','#c9cfd2'];
  const id=uid('st');return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${G[0]}"/><stop offset="1" stop-color="${G[1]}"/></linearGradient></defs><rect x="-600" y="-1900" width="2280" height="3400" fill="url(#${id})"/>`}
function moonT(x,y,t){return `<circle cx="${x}" cy="${y}" r="160" fill="#f3efe0" opacity=".06"/><circle cx="${x}" cy="${y}" r="52" fill="#f3efe0"/><circle cx="${x-16}" cy="${y-10}" r="10" fill="#dcd6c2"/><circle cx="${x+14}" cy="${y+14}" r="7" fill="#dcd6c2"/>`}
function roofScene(t,o={}){ // the hotel roof looking at the drowned town. o.sky, o.flood, o.ret, o.far, o.mud, o.waveBase/waveH
  const H=460, night=o.sky==='night', shore=lerp(590,H+14,o.ret||0);
  let s=skyTod(o.sky||'day');
  if(night) s+=stars(3,90,520,t,.9)+moonT(820,250,t);
  if(o.sky==='dawn') s+=`<circle cx="760" cy="470" r="70" fill="#ffd9a0"/><circle cx="760" cy="470" r="220" fill="url(#glowY)"/>`;
  if(o.sky==='afternoon') s+=sunT(840,260,60);
  let b=sea(t,H,shore,{col:night?'#1e2e44':'#4a7a94',foam:!night});
  if(o.far) b+=waveWall(t,H+8,o.far,{seed:4,top:'#3a4650',mid:'#26323a',bot:'#1e282e'});
  b+=`<rect x="-600" y="${shore}" width="2280" height="${700-shore}" fill="${o.mud?'#7a6a50':'#6a6e62'}"/>`;
  if(o.waveH&&o.waveBase<700) b+=waveWall(t,o.waveBase,o.waveH);
  b+=lighthouse(930,605,.5,t)+`<rect x="-600" y="628" width="2280" height="14" fill="#a89a84"/>`;
  b+=townRow(720,2,{sc:.55})+townRow(820,6,{sc:.75});
  if(o.flood) b+=flood(t,o.flood,{rough:o.rough,debris:true,flow:o.flow??14});
  b+=townRow(960,9,{sc:1});
  if(o.mud){b+=`<rect x="-600" y="830" width="2280" height="200" fill="#7a6a50"/>`;const r=rng(31);for(let i=0;i<10;i++){const x=-100+i*140+r()*40;b+=`<g transform="translate(${x},${840+r()*30}) rotate(${(r()-.5)*40}) scale(.32)">${carK(0,0,1,['#c23a3a','#3a5a8a','#e9e4d8','#e0b04a'][i%4],0)}</g>`}
    b+=`<g transform="translate(260,700) rotate(-12)">${boat(0,0,.5,0,'#f0d9a8')}</g>`;}
  if(o.flood2) b+=flood(t,o.flood2,{rough:o.rough,debris:true,flow:o.flow??14,seed:5});
  s+=night?NT(b):o.sky==='dawn'?L('dusk',b):o.sky==='dusk'?L('sunset',b):b;
  const roof=roofEdge(930)+(o.hut!=null?roofHut(860,930,o.hut):'');
  s+=night?NT(roof):o.sky==='dawn'?L('dusk',roof):o.sky==='dusk'?L('sunset',roof):roof;
  return s}
const nightC=(night,c)=>night?NTC(c):c;
function lying(o,s){ // a tall character lying on their side on the ground, head to the left
  return A({...o,rot:-90,y:o.y-92*o.s,still:true})}

// ---------- part 3 ----------
function redRag(x,y,s=1,rot=0){return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-40,-14 L30,-24 L44,-4 L36,18 L-30,22 L-46,6Z" fill="#c23a3a"/><path d="M-40,-14 L30,-24 L28,-14 L-36,-4Z" fill="#8a2a2a"/><path d="M36,18 L44,26 M30,20 L32,32 M-30,22 L-34,32" stroke="#c23a3a" stroke-width="5" stroke-linecap="round"/></g>`}
function lobby(t){ // flooded hotel ground floor: muddy water with a petrol sheen, floating junk and broken glass
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#8a8274"/><rect x="-600" y="-900" width="2280" height="1500" fill="#a89e8c"/>`;
  s+=`<rect x="80" y="260" width="420" height="300" fill="#4a5a60"/><path d="M120,300 L240,420 L180,520 M300,280 L360,400 L440,360" stroke="#d9e6ec" stroke-width="5" fill="none"/>`;
  s+=`<rect x="640" y="200" width="300" height="70" fill="#3a3e4a"/><text x="790" y="248" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="34" fill="#ffd34a">RECEPCIÓN</text>`;
  s+=`<rect x="-600" y="640" width="2280" height="900" fill="#5e5a48"/>`;
  let p='M-600,640';for(let x=-600;x<=1680;x+=40) p+=` L${x},${(640+Math.sin(x*.02+t*1.6)*4).toFixed(1)}`;s+=`<path d="${p}" stroke="#8a8670" stroke-width="6" fill="none"/>`;
  const id=uid('sheen');
  s+=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#ff5a8a"/><stop offset=".3" stop-color="#ffd34a"/><stop offset=".6" stop-color="#45e07e"/><stop offset="1" stop-color="#6cc6ff"/></linearGradient></defs>`;
  for(let i=0;i<5;i++){const x=((i*300+t*14)%1500)-200;s+=`<ellipse cx="${x}" cy="${720+i*40}" rx="${120+i*10}" ry="${18+i*3}" fill="url(#${id})" opacity="${(.28+.1*Math.sin(t*2+i)).toFixed(2)}"/>`}
  const r=rng(41);
  for(let i=0;i<12;i++){const x=((r()*1400+t*10)%1500)-200, y=680+r()*300, k=Math.sin(t*2+i)*3;
    s+=i%3===0?`<polygon points="${x},${y+k} ${x+26},${y-18+k} ${x+40},${y+4+k}" fill="#cfe6f0" opacity=".8"/>`:i%3===1?`<rect x="${x}" y="${y+k}" width="60" height="14" rx="4" fill="#7a5a3a" transform="rotate(${r()*40-20} ${x} ${y})"/>`:`<circle cx="${x}" cy="${y+k}" r="10" fill="#e9e4d8"/>`}
  for(let i=0;i<8;i++){const p2=((t*.6+i/8)%1);s+=`<circle cx="${200+i*110}" cy="${700+((i*53)%200)-p2*40}" r="${3+p2*4}" fill="none" stroke="#9a9680" stroke-width="2" opacity="${(1-p2).toFixed(2)}"/>`}
  // stairs coming down into the water on the left
  for(let i=0;i<4;i++) s+=`<rect x="${-20+i*60}" y="${520+i*44}" width="${520-i*60}" height="44" fill="${i%2?'#c9c2b0':'#bdb5a4'}"/>`;
  return s}
function bathroom(t,o={}){ // hotel bathroom: tiles, toilet with the cistern lid off
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#dfe6e8"/>`;
  for(let x=-600;x<1700;x+=80) s+=`<line x1="${x}" y1="-900" x2="${x}" y2="880" stroke="#c4ced2" stroke-width="3"/>`;
  for(let y=0;y<880;y+=80) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#c4ced2" stroke-width="3"/>`;
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#9aa4a8"/><path d="M-600,880 L1680,880" stroke="#7a8488" stroke-width="10"/>`;
  s+=`<rect x="620" y="320" width="220" height="150" rx="10" fill="#c9d6dc"/><rect x="636" y="336" width="188" height="118" fill="#e9f2f6"/><path d="M660,360 L700,420" stroke="#fff" stroke-width="6"/>`;
  // toilet
  s+=`<rect x="340" y="560" width="300" height="190" rx="18" fill="#f6f8f8"/><rect x="340" y="560" width="300" height="190" rx="18" fill="none" stroke="#cfd8dc" stroke-width="6"/>`;
  const lvl=o.level??1;s+=`<rect x="360" y="${600+(1-lvl)*130}" width="260" height="${130*lvl}" fill="#9fd8f8" opacity=".85"/><path d="M360,${600+(1-lvl)*130} q65,-6 130,0 t130,0" stroke="#e8f8ff" stroke-width="4" fill="none" opacity="${lvl>.05?.9:0}"/>`;
  if(!o.lidOff) s+=`<rect x="330" y="540" width="320" height="34" rx="10" fill="#e9eef0"/>`;
  s+=`<path d="M380,750 L600,750 L570,860 Q490,900 410,860Z" fill="#f6f8f8"/><ellipse cx="490" cy="790" rx="150" ry="40" fill="#e9eef0"/><ellipse cx="490" cy="792" rx="110" ry="24" fill="#cfe2ea"/><rect x="430" y="860" width="120" height="30" fill="#e9eef0"/>`;
  return s}
function streetRuin(t,scroll=0){ // the harbour street after the water: mud, piled cars, a boat on a roof
  let s=skyTod('day')+`<rect x="-600" y="-900" width="2280" height="2400" fill="none"/>`;
  s+=block(-140,420,260,'#c9b8a2',{frame:'#b8ab98'})+block(300,380,160,'#d9c6ae',{frame:'#c9bca8'})+block(700,460,230,'#bfae98',{frame:'#b0a088'});
  s+=`<rect x="-600" y="600" width="2280" height="12" fill="#6a5a44" opacity=".6"/>`; // the water line on the walls
  s+=`<g transform="translate(${470-scroll*.2},150) rotate(-14)">${boat(0,0,.9,0,'#e9e4d8','#3a6aa8')}</g>`;
  s+=`<rect x="-600" y="820" width="2280" height="800" fill="#7a6a50"/>`;
  const r=rng(77);
  for(let i=0;i<12;i++){const x=-300+i*170+r()*30-scroll*.5;s+=`<ellipse cx="${x}" cy="${850+r()*120}" rx="${30+r()*50}" ry="8" fill="#5a4a36" opacity=".6"/>`}
  s+=`<g transform="translate(${140-scroll*.4},900) rotate(-18)">${carK(0,0,.7,'#3a5a8a',0)}</g><g transform="translate(${180-scroll*.4},820) rotate(12)">${carK(0,0,.62,'#c23a3a',0)}</g>`;
  s+=`<g transform="translate(${900-scroll*.4},910) rotate(160)">${carK(0,0,.7,'#e9e4d8',0)}</g><g transform="translate(${860-scroll*.4},860) rotate(-6)">${carK(0,0,.6,'#e0b04a',0)}</g>`;
  for(let i=0;i<7;i++){const x=-200+i*230+r()*60-scroll*.6;s+=`<rect x="${x}" y="${930+r()*60}" width="${80+r()*60}" height="14" rx="4" fill="#6a4a30" transform="rotate(${(r()-.5)*50} ${x} 950)"/>`}
  return s}
function sprayArrow(x,y,s,a,txt){ // spray-painted arrow + time on a wall
  if(a<=0) return '';const L_=200*clamp(a*1.4);
  return `<g transform="translate(${x},${y}) scale(${s})" opacity=".92"><path d="M0,0 L${L_},0" stroke="#ff8a2a" stroke-width="18" stroke-linecap="round"/>${a>.7?`<path d="M${L_-50},-40 L${L_},0 L${L_-50},40" stroke="#ff8a2a" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`:''}${a>.8?`<text x="10" y="70" font-family="Inter" font-weight="900" font-style="italic" font-size="52" fill="#ff8a2a">${txt}</text>`:''}</g>`}
function radioBig(x,y,s,t,on){ // handheld emergency radio, close-up
  let g=`<rect x="-200" y="-150" width="400" height="300" rx="34" fill="#5a6040"/><rect x="-200" y="-150" width="400" height="40" rx="20" fill="#4a5034"/>`;
  g+=`<circle cx="-80" cy="20" r="96" fill="#2a2e22"/>`;for(let i=0;i<6;i++) for(let j=0;j<6;j++){const px=-80+(i-2.5)*26, py=20+(j-2.5)*26;if(Math.hypot(px+80,py-20)<84) g+=`<circle cx="${px}" cy="${py}" r="6" fill="#14160f"/>`}
  g+=`<rect x="50" y="-80" width="120" height="60" rx="8" fill="${on?'#cfe6a8':'#6a7a5a'}"/><text x="110" y="-38" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="26" fill="#2a3a1a">${on?'98.4':'---'}</text>`;
  g+=`<circle cx="110" cy="50" r="34" fill="#3a3e2a"/><line x1="110" y1="50" x2="${110+Math.cos(t*2)*24}" y2="${50+Math.sin(t*2)*24}" stroke="#c9c2b0" stroke-width="6"/>`;
  g+=`<line x1="150" y1="-150" x2="230" y2="-360" stroke="#2a2e22" stroke-width="10" stroke-linecap="round"/>`;
  if(on) g+=soundArcs(-80,20,t,'#cfe6a8',-1)+`<g transform="translate(-180,0)">${soundArcs(0,20,t,'#cfe6a8',-1)}</g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`}
function mapCard(t,k){ // route from the port to Monte San Telmo, drawn as it is said
  let s=`<rect x="90" y="260" width="900" height="640" rx="24" fill="#f3ead6"/><rect x="90" y="260" width="900" height="640" rx="24" fill="none" stroke="#c9b48a" stroke-width="6"/>`;
  s+=`<path d="M90,700 Q300,640 420,760 Q520,860 700,820 L700,900 L90,900Z" fill="#9fc6dc"/>`; // the sea
  s+=`<path d="M720,560 L820,380 L920,560Z" fill="#7a9a5a"/><path d="M790,430 L820,380 L850,430Z" fill="#f3f0e6"/>`;
  s+=`<circle cx="260" cy="660" r="16" fill="#c23a3a"/><text x="260" y="630" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="24" fill="#3a2a1a">PUERTO ARENA</text>`;
  s+=`<text x="820" y="350" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="24" fill="#3a2a1a">MONTE SAN TELMO</text>`;
  const path='M260,660 Q380,520 500,600 Q640,690 700,520 Q740,450 800,500', id=uid('rt');
  s+=`<path id="${id}" d="${path}" stroke="#c23a3a" stroke-width="10" stroke-dasharray="${(1400*k).toFixed(0)} 2000" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="${path}" stroke="#3a2a1a" stroke-width="3" stroke-dasharray="6 12" fill="none" opacity=".4"/>`;
  if(k>.95){s+=`<g transform="translate(800,470)"><ellipse cx="0" cy="0" rx="40" ry="16" fill="#3a3e4a"/><rect x="-60" y="-24" width="120" height="6" fill="#3a3e4a" transform="rotate(${t*900%360})"/></g>`}
  return s}
function supermarket(t,o={}){ // shop front with a half-closed metal shutter and red spray paint
  let s=skyTod('day')+`<rect x="-600" y="180" width="2280" height="700" fill="#e2d6c2"/><rect x="-600" y="180" width="2280" height="20" fill="#000" opacity=".1"/>`;
  s+=`<rect x="120" y="230" width="840" height="110" fill="#2f8a5a"/><text x="540" y="305" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#fff">SUPER<tspan fill="#ffd34a">MAR</tspan></text>`;
  s+=`<rect x="-600" y="600" width="2280" height="12" fill="#6a5a44" opacity=".6"/>`;
  const sh=o.shut??.82, top=380, bot=880, sy=top+(bot-top)*sh;
  s+=`<rect x="160" y="${top}" width="760" height="${bot-top}" fill="#120f0c"/>`;
  if(o.inside) s+=o.inside;
  s+=`<rect x="160" y="${top}" width="760" height="${sy-top}" fill="#9aa3ad"/>`;
  for(let y=top+20;y<sy;y+=26) s+=`<line x1="160" y1="${y}" x2="920" y2="${y}" stroke="#7a838d" stroke-width="4"/>`;
  s+=`<rect x="160" y="${sy-16}" width="760" height="16" fill="#6a737d"/>`;
  if(o.graffiti){const n=Math.ceil('ESTO ES NUESTRO'.length*clamp(o.graffiti));s+=`<text x="540" y="${top+180}" text-anchor="middle" font-family="Inter" font-weight="900" font-style="italic" font-size="86" fill="#d42a2a" transform="rotate(-4 540 ${top+180})" opacity=".92">${'ESTO ES NUESTRO'.slice(0,n)}</text>`;
    for(let i=0;i<5;i++) s+=`<line x1="${250+i*130}" y1="${top+195}" x2="${250+i*130}" y2="${top+225+i%3*14}" stroke="#d42a2a" stroke-width="5" opacity="${clamp(o.graffiti*2-1)}"/>`;}
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#7a6a50"/>`;
  s+=`<g transform="translate(1000,880)"><rect x="-70" y="-120" width="140" height="80" fill="none" stroke="#9aa3ad" stroke-width="6"/><circle cx="-50" cy="-20" r="14" fill="#3a3e4a"/><circle cx="50" cy="-20" r="14" fill="#3a3e4a"/></g>`;
  return s}
const seatBox=(x,y,s)=>`<rect x="${(x-100*s).toFixed(1)}" y="${(y-178*s).toFixed(1)}" width="${(200*s).toFixed(1)}" height="${(178*s).toFixed(1)}" rx="${(8*s).toFixed(1)}" fill="#8a8478"/><rect x="${(x-100*s).toFixed(1)}" y="${(y-178*s).toFixed(1)}" width="${(200*s).toFixed(1)}" height="${(16*s).toFixed(1)}" fill="#a8a294"/><rect x="${(x-80*s).toFixed(1)}" y="${(y-140*s).toFixed(1)}" width="${(160*s).toFixed(1)}" height="${(90*s).toFixed(1)}" fill="none" stroke="#6a665c" stroke-width="${(5*s).toFixed(1)}"/>`;
const SA=o=>seatBox(o.x,o.y,o.s)+A({...o,sit:true}), SK=o=>seatBox(o.x,o.y,o.s)+kid({...o,sit:true});

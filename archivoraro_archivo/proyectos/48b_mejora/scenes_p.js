// ================= APAGÓN · PARTE 1 =================
const EVS={
  hook:B=>({off:B[0].w[5],month:B[0].w[12]}),
  teaser:B=>({d1:B[0].w[0],d3:B[0].w[8],d7:B[0].w[15]}),
  off:B=>({off:B[0].w[3]}),
  chaos:B=>({lights:B[0].w[3],honk:B[0].w[6],lift:B[0].w[7]}),
  laugh:B=>({laugh:B[0].w[7],say:B[0].w[9]}),
  alex:B=>({name:B[0].w[1],q:B[0].w[7]}),
  go:B=>({bruno:B[0].w[2],go:B[0].w[8],hour:B[0].w[12]}),
  bath:B=>({fill:B[0].w[2],pots:B[0].w[8],pumps:B[0].w[12],weak:B[1].w[3],half:B[1].w[10]}),
  patio:B=>({laugh:B[0].w[5]}),
  fridge:B=>({no:B[0].w[2],hours:B[0].w[10]}),
  shop:B=>({cans:B[0].w[6],water:B[0].w[7],bat:B[0].w[8],food:B[0].w[10]}),
  till:B=>({calc:B[0].w[8],cash:B[0].w[9],three:B[0].w[14]}),
  party:B=>({party:B[0].w[7],candles:B[0].w[8],guitars:B[0].w[9],sing:B[0].w[11]}),
  radio:B=>({on:B[0].w[1],voice:B[1].s,grave:B[1].w[4],nodate:B[1].w[8]}),
  end:B=>({sing:B[0].w[9],know:B[0].w[11]}),
};
const S={};

// ---------- cast ----------
const ALEX={skin:'#e2b08a',hs:'quiff',hair:'#3a2a20',stubble:true,top:'#3a5a7a',topD:'#2a4260',hood:true,strings:true,pants:'#2e3440',shoes:'#e9e4d8',seed:101};
const VEC5={skin:'#d9a07a',hs:'bald',hair:'#5a4a40',mustache:'#4a3a30',build:'heavy',top:'#f3f0e6',topD:'#d9d4c8',shortSleeves:true,pants:'#3a4a6a',shoes:'#2a2a2e',seed:102};
const CAJERA={fem:true,skin:'#c98c64',hs:'ponytail',hair:'#2a1a12',top:'#2f8a5a',topD:'#1f6a42',lashes:true,earrings:'#f1c84b',seed:103};
const ELEV={fem:true,skin:'#f1c6a4',hs:'bob',hair:'#8a5a3a',top:'#c23a5a',topD:'#9a2a42',jacket:'#2a2e3a',lashes:true,seed:104};
const CB=id=>({...CAST_BY_ID[id].o});

// ---------- Bruno, the German shepherd (the dobermann rig, re-coloured + saddle, bushy tail, dark muzzle) ----------
const GSD={body:'#b5803f',tan:'#e0b070',ear:'#1d1a1c',black:'#1d1a1c'};
function shepherd(x,y,s,t,o={}){
  const keep={...DOB};DOB.body=GSD.body;DOB.tan=GSD.tan;DOB.ear=GSD.ear;
  let g=doberman(x,y,s,t,o);
  Object.assign(DOB,keep);
  const dir=o.dir||1, run=o.run!=null, ph=run?o.run:o.walk, alert=o.alert??.6;
  const bob=ph==null?Math.sin(t*2.4)*1.6:(run?-Math.abs(Math.sin(ph))*18:-Math.abs(Math.sin(ph*2))*4);
  const pitch=run?Math.sin(ph)*5:0;
  const ha=(o.head??0)+alert*6+(ph==null?Math.sin(t*1.4)*2:Math.sin(ph*2)*2);
  const wag=Math.sin(t*(o.wag?14:4))*(o.wag?18:6);
  let ov=`<g transform="scale(.86,1)"><path d="M-150,-196 C-142,-236 -60,-242 0,-240 L92,-238 C124,-238 134,-226 124,-198 C60,-186 -60,-186 -150,-196Z" fill="${GSD.black}"/>`;
  ov+=`<g transform="rotate(${wag.toFixed(1)} -150 -206)"><path d="M-150,-206 Q-205,-214 -228,-252" stroke="#6a4a26" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M-200,-226 Q-218,-240 -228,-252" stroke="${GSD.black}" stroke-width="24" fill="none" stroke-linecap="round"/></g></g>`;
  ov+=`<g transform="translate(144,-326) rotate(${(-ha).toFixed(1)})"><ellipse cx="2" cy="-16" rx="30" ry="16" fill="${GSD.black}" opacity=".85"/>`;
  ov+=o.bark?`<path d="M60,-16 L120,-4 Q128,4 122,10 L70,8Z" fill="${GSD.black}"/>`:`<path d="M54,-18 L120,-4 Q132,6 122,20 L64,24Z" fill="${GSD.black}"/>`;
  ov+=`<ellipse cx="124" cy="4" rx="11" ry="9" fill="#0c0b0e"/>`+(o.tongue?`<path d="M96,22 q8,22 22,18 q4,-10 -4,-20Z" fill="#e0607a"/>`:'')+`</g>`;
  g+=`<g transform="translate(${x},${y}) scale(${dir*s},${s})"><g transform="translate(0,${bob.toFixed(1)}) rotate(${pitch.toFixed(2)} 0 -170)">${ov}</g></g>`;
  return g}
const a1DogHead=(hx,hy,o={})=>{const B=GSD.body,K=GSD.black;
  let g=`<path d="M${hx-30},${hy-30} L${hx-18},${hy-104} L${hx+12},${hy-34}Z" fill="${K}"/><path d="M${hx-20},${hy-38} L${hx-16},${hy-86} L${hx+2},${hy-40}Z" fill="#6a4a2a"/>`;
  g+=`<ellipse cx="${hx}" cy="${hy}" rx="54" ry="44" fill="${B}"/><ellipse cx="${hx-6}" cy="${hy-24}" rx="36" ry="18" fill="${K}" opacity=".8"/>`;
  g+=`<path d="M${hx+20},${hy-26} L${hx+104},${hy-6} Q${hx+118},${hy+10} ${hx+104},${hy+24} L${hx+24},${hy+34}Z" fill="${K}"/>`;
  g+=`<ellipse cx="${hx+106}" cy="${hy-4}" rx="13" ry="10" fill="#0c0a0e"/>`;
  g+=o.eyes==='closed'?`<path d="M${hx+8},${hy-10} q12,7 24,0" stroke="#0c0a0e" stroke-width="5" fill="none" stroke-linecap="round"/>`:`<circle cx="${hx+22}" cy="${hy-10}" r="9" fill="#2a1a10"/><circle cx="${hx+25}" cy="${hy-13}" r="3" fill="#fff"/>`;
  return g};
const dogLie=(x,y,s,t,o={})=>{ // Bruno lying down, facing right (o.dir -1 left), o.head 0..1
  const B=GSD.body,T=GSD.tan,K=GSD.black,hu=o.head??0,br=Math.sin(t*2.2)*2;
  let g=`<ellipse cx="40" cy="4" rx="230" ry="14" fill="#000" opacity=".2"/>`;
  g+=`<path d="M-150,-30 Q-210,-20 -236,-4" stroke="#6a4a26" stroke-width="26" fill="none" stroke-linecap="round"/>`;
  g+=`<path d="M-162,-6 C-172,-70 -122,-${(112+br).toFixed(1)} -40,-${(116+br).toFixed(1)} L80,-${(118+br).toFixed(1)} C134,-120 166,-90 166,-40 L166,-6Z" fill="${B}"/>`;
  g+=`<path d="M-140,-70 C-120,-108 -40,-${(114+br).toFixed(1)} 40,-${(116+br).toFixed(1)} L90,-110 C80,-80 -60,-70 -140,-70Z" fill="${K}"/>`;
  g+=`<ellipse cx="-100" cy="-50" rx="60" ry="44" fill="${mix(B,'#000000',.08)}"/><ellipse cx="-36" cy="-8" rx="36" ry="10" fill="${T}"/>`;
  g+=`<path d="M120,-22 L250,-14" stroke="${T}" stroke-width="26" stroke-linecap="round"/><path d="M110,-26 L236,-30" stroke="${mix(T,'#000000',.2)}" stroke-width="22" stroke-linecap="round"/>`;
  const hx=210, hy=lerp(-58,-186,hu);
  g+=`<path d="M96,-112 L${hx-34},${hy-30} L${hx+6},${hy+34} L156,-30Z" fill="${B}"/>`+a1DogHead(hx,hy,o);
  return `<g transform="translate(${x},${y}) scale(${(s*(o.dir||1)).toFixed(3)},${s})">${g}</g>`};

// ---------- props ----------
const candle=(x,y,s,t,k=1)=>{const f=1+.08*Math.sin(t*17+x)+.05*Math.sin(t*9+y);
  return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="0" cy="-60" r="${(150*k).toFixed(0)}" fill="url(#glowY)" opacity="${(.8*k).toFixed(2)}"/><rect x="-10" y="-46" width="20" height="46" rx="3" fill="#f3eee2"/><line x1="0" y1="-46" x2="0" y2="-54" stroke="#2a2a2e" stroke-width="3"/><path d="M0,${(-54-30*f).toFixed(1)} Q12,-62 0,-52 Q-12,-62 0,${(-54-30*f).toFixed(1)}Z" fill="#ffd76a"/><path d="M0,${(-54-16*f).toFixed(1)} Q5,-58 0,-53 Q-5,-58 0,${(-54-16*f).toFixed(1)}Z" fill="#fff6d8"/></g>`};
const guitar=(x,y,s,rot,t,strum=0)=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="40" y="-12" width="170" height="24" fill="#5a3a22"/><rect x="200" y="-18" width="40" height="36" rx="6" fill="#3a2414"/><circle cx="0" cy="0" r="62" fill="#d48a3a"/><circle cx="-56" cy="0" r="52" fill="#d48a3a"/><circle cx="-6" cy="0" r="16" fill="#3a2414"/>${[-6,-2,2,6].map(d=>`<line x1="-60" y1="${d}" x2="236" y2="${d}" stroke="#f3eee6" stroke-width="1.5" opacity=".8"/>`).join('')}${strum?`<path d="M-20,${(-30+Math.sin(t*20)*8).toFixed(1)} l20,40" stroke="#fff" stroke-width="2" opacity=".5"/>`:''}</g>`;
const tLight=(x,y,state,t)=>{ // traffic light on a pole; state: 'green','off'
  const on=c=>`fill="${c}"`;
  return `<rect x="${x-7}" y="${y-430}" width="14" height="430" fill="#2a2e3a"/><rect x="${x-34}" y="${y-560}" width="68" height="170" rx="12" fill="#1d2026"/>`+
    `<circle cx="${x}" cy="${y-528}" r="20" ${on(state==='red'?'#ff3a3a':'#3a2626')}/><circle cx="${x}" cy="${y-475}" r="20" ${on(state==='amber'?'#ffb02a':'#3a3226')}/><circle cx="${x}" cy="${y-422}" r="20" ${on(state==='green'?'#3aff8a':'#24362c')}/>`+
    (state==='green'?`<circle cx="${x}" cy="${y-422}" r="50" fill="#3aff8a" opacity=".15"/>`:'')};
const facade=(x,w,top,col,o={})=>{ // Spanish apartment facade: balconies, rolling shutters; o.night, o.lit(i,j) 0..1 candle glow
  let s=`<rect x="${x}" y="${top}" width="${w}" height="${1300-top}" fill="${col}"/><rect x="${x}" y="${top}" width="${w}" height="16" fill="#000" opacity=".15"/>`;
  const cols=Math.floor((w-40)/120);let j=0;
  for(let wy=top+40;wy<840;wy+=150,j++){for(let i=0;i<cols;i++){const wx=x+30+i*120+(w-40-cols*120)/2;
    const sh=((i*7+j*3+(o.seed||0))%5)/8;
    const lit=o.lit?o.lit(i,j):0, glass=o.night?(lit>0?mix('#2a2018','#ffb860',lit*.8):'#14182a'):(o.dim?'#4a5a6a':'#8ab0c8');
    s+=`<rect x="${wx}" y="${wy}" width="70" height="96" fill="${glass}"/><rect x="${wx}" y="${wy}" width="70" height="${(96*sh).toFixed(0)}" fill="${mix(col,'#5a4a3a',.35)}"/>`;
    for(let k=1;k<sh*96/8;k++) s+=`<line x1="${wx}" y1="${wy+k*8}" x2="${wx+70}" y2="${wy+k*8}" stroke="#000" stroke-opacity=".12" stroke-width="2"/>`;
    s+=`<rect x="${wx-10}" y="${wy+92}" width="90" height="8" fill="${mix(col,'#000000',.25)}"/><path d="M${wx-10},${wy+100} L${wx-10},${wy+70} L${wx+80},${wy+70} L${wx+80},${wy+100}" stroke="#2a2e3a" stroke-width="4" fill="none"/>`;
    for(let k=0;k<6;k++) s+=`<line x1="${wx-4+k*16}" y1="${wy+70}" x2="${wx-4+k*16}" y2="${wy+100}" stroke="#2a2e3a" stroke-width="3"/>`;
    if(lit>0) s+=`<circle cx="${wx+35}" cy="${wy+70}" r="${(70*lit).toFixed(0)}" fill="url(#glowY)" opacity="${(.7*lit).toFixed(2)}"/>`;}}
  return s};
const street=(t,o={})=>{ // facades + pavement + road; o.night o.lit o.dim
  let s=o.night?skyNight(t)+stars(11,80,420,t,.9):skyTod('day');
  s+=facade(-260,440,170,'#d8b48a',{...o,seed:1})+facade(190,380,120,'#c98a6a',{...o,seed:2})+facade(580,460,200,'#e2d2b4',{...o,seed:3})+facade(1050,300,150,'#b8a48a',{...o,seed:4});
  for(const [x,w,top] of [[-260,440,170],[190,380,120],[580,460,200],[1050,300,150]]) s+=`<rect x="${x-8}" y="${top-14}" width="${w+16}" height="22" fill="#000" opacity=".18"/><rect x="${x+w-26}" y="${top}" width="26" height="${860-top}" fill="#000" opacity=".1"/>`;
  s+=`<linearGradient id="hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="${o.night?'#1a2040':'#fff2e0'}" stop-opacity=".25"/></linearGradient><rect x="-600" y="400" width="2280" height="460" fill="url(#hz)"/>`;
  s+=`<rect x="-600" y="860" width="2280" height="70" fill="${o.night?'#3a3a40':'#a8a49a'}"/><rect x="-600" y="860" width="2280" height="8" fill="#000" opacity=".1"/><rect x="-600" y="922" width="2280" height="10" fill="${o.night?'#4a4a52':'#c8c4ba'}"/>`;
  for(const x of [60,760]) s+=`<rect x="${x}" y="600" width="12" height="270" fill="#2a2e3a"/><path d="M${x+6},600 q0,-30 40,-30 l26,0" stroke="#2a2e3a" stroke-width="9" fill="none"/><rect x="${x+56}" y="566" width="40" height="14" rx="5" fill="#3a3e4a"/>`;
  for(const x of [380,960]) s+=`<rect x="${x-8}" y="720" width="16" height="150" fill="#5a3e2a"/><circle cx="${x}" cy="690" r="70" fill="${o.night?'#1a2a20':'#4f8a4a'}"/><circle cx="${x-36}" cy="720" r="46" fill="${o.night?'#162418':'#457a40'}"/><circle cx="${x+40}" cy="716" r="50" fill="${o.night?'#1c2c22':'#5a9a50'}"/>`;
  s+=`<rect x="-600" y="930" width="2280" height="700" fill="${o.night?'#1d1f26':'#4a4c52'}"/>`;
  for(let i=0;i<8;i++) s+=`<rect x="${-200+i*200}" y="1010" width="110" height="10" fill="#e9e4d8" opacity="${o.night?.3:.8}"/>`;
  if(o.night) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a0f24" opacity=".35"/>`;
  return s};

// ---------- Spain from space ----------
const IBERIA=[[90,170],[130,140],[220,150],[330,140],[430,150],[520,160],[560,170],[600,190],[700,210],[780,230],[820,250],[790,300],[740,350],[690,390],[660,420],[620,480],[610,530],[650,560],[610,600],[580,640],[540,700],[480,710],[400,720],[330,760],[300,730],[270,700],[230,690],[160,690],[110,690],[90,680],[110,600],[100,520],[80,440],[70,360],[80,280],[60,240],[70,200]];
const FRANCE=[[560,170],[520,40],[600,-60],[900,-80],[1050,60],[1000,200],[900,230],[820,250],[780,230],[700,210],[600,190]];
const AFRICA=[[100,830],[330,800],[450,815],[600,800],[760,840],[800,980],[100,980]];
const inPoly=(x,y,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi)) c=!c;}return c};
const CITIES=[[380,410,3],[770,290,2.4],[615,500,2],[255,640,2],[570,285,1.6],[470,175,1.6],[390,705,1.6],[560,620,1.4],[330,290,1.4],[115,175,1.3],[85,240,1.2],[430,670,1.3],[610,580,1.4],[320,600,1.2],[200,340,1],[490,520,1],[700,330,1.2],[260,470,1]];
const LIGHTS=(()=>{const r=rng(91);const L=CITIES.map(([x,y,k])=>[x,y,k]);let n=0;while(n<170){const x=60+r()*780, y=140+r()*600;if(inPoly(x,y,IBERIA)){L.push([x,y,.35+r()*.6]);n++;}}return L})();
const LIGHTS_FR=(()=>{const r=rng(17);const L=[];let n=0;while(n<70){const x=520+r()*520, y=-70+r()*300;if(inPoly(x,y,FRANCE)){L.push([x,y,.35+r()*.7]);n++;}}L.push([760,40,2.4]);return L})();
const LIGHTS_AF=[[300,840,1.2],[360,850,.8],[520,850,1],[650,860,.8],[420,880,.6]];
const iberia=(t,off)=>{ // off: time since the blackout started (s), <0 = not yet
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#050816"/>`;
  s+=stars(3,60,1100,t,.5);
  const poly=P=>P.map(p=>p.join(',')).join(' ');
  let g=`<polygon points="${poly(FRANCE)}" fill="#141a2a"/><polygon points="${poly(AFRICA)}" fill="#141a2a"/><polygon points="${poly(IBERIA)}" fill="#161c2e" stroke="#2a3450" stroke-width="3"/>`;
  g+=`<ellipse cx="790" cy="470" rx="30" ry="14" fill="#161c2e"/><ellipse cx="840" cy="450" rx="14" ry="8" fill="#161c2e"/>`;
  const dot=(x,y,k,a)=>a<=0?'':`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2.6*k+1).toFixed(1)}" fill="#ffd98a" opacity="${a.toFixed(2)}"/>`+(k>1?`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(12*k).toFixed(1)}" fill="#ffb84a" opacity="${(.18*a).toFixed(2)}"/>`:'');
  for(const [x,y,k] of LIGHTS_FR) g+=dot(x,y,k,.9);
  for(const [x,y,k] of LIGHTS_AF) g+=dot(x,y,k,.8);
  for(const [x,y,k] of LIGHTS){const pt=y>260&&x<160;
    let a=.95;if(!pt&&off>=0){const d=Math.hypot(x-380,y-410)/600*1.4;a=.95*(1-prog(off,d,d+.18));}
    g+=dot(x,y,k,a);}
  g+=`<text x="430" y="470" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#fff" opacity="${(off>0?.55*prog(off,1.2,2):0).toFixed(2)}" letter-spacing="8">ESPAÑA</text>`;
  g+=`<text x="820" y="80" text-anchor="middle" font-family="Inter" font-weight="800" font-size="26" fill="#fff" opacity=".35" letter-spacing="4">FRANCIA</text><text x="30" y="560" font-family="Inter" font-weight="800" font-size="22" fill="#fff" opacity=".3" letter-spacing="2" transform="rotate(-80 30 560)">PORTUGAL</text>`;
  s+=`<g transform="translate(31,160) scale(1.15)">${g}</g>`;
  return s};

// ---------- interiors ----------
const flat=(t,o={})=>{ // Álex's living room: wall, window to the street, TV, lamp, router, shelf clock, rug
  const on=o.on??1, night=o.night;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${night?'#2a2630':'#d8c8b0'}"/><rect x="-600" y="900" width="2280" height="700" fill="${night?'#2a2018':'#8a6448'}"/><rect x="-600" y="890" width="2280" height="14" fill="#000" opacity=".15"/>`;
  for(let x=-600;x<1700;x+=48) s+=`<rect x="${x}" y="-900" width="16" height="1790" fill="#000" opacity=".025"/>`;
  s+=`<rect x="-600" y="876" width="2280" height="24" fill="${night?'#3a3230':'#efe6d6'}"/><rect x="-600" y="896" width="2280" height="6" fill="#000" opacity=".2"/>`;
  for(let i=0;i<=14;i++) s+=`<line x1="${-140+i*100}" y1="904" x2="${-700+i*190}" y2="1600" stroke="#000" stroke-width="3" opacity=".12"/>`;
  for(const y of [960,1040]) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#000" stroke-width="2" opacity=".07"/>`;
  s+=`<rect x="480" y="300" width="170" height="125" fill="#f3eee6" stroke="#5a3e2a" stroke-width="8"/><rect x="494" y="314" width="142" height="97" fill="${night?'#1a2030':'#8aa8c0'}"/><path d="M494,411 L548,360 L586,392 L612,370 L636,411Z" fill="${night?'#141a24':'#5a7a5a'}"/>`;
  s+=`<path d="M930,900 l-26,-80 l84,0 l-26,80Z" fill="#a85a3a"/>`+[0,1,2,3,4].map(i=>`<path d="M946,822 Q${900+i*24},${720-i*8} ${916+i*24},${690+i*10}" stroke="#3a7a4a" stroke-width="12" fill="none" stroke-linecap="round"/>`).join('');
  if(!night) s+=`<path d="M700,630 L960,630 L1060,1100 L520,1100Z" fill="#fff4d0" opacity=".22"/><path d="M700,250 L960,250 L960,630 L700,630Z" fill="#fff4d0" opacity=".06"/>`;
  s+=`<radialGradient id="rmv" cx=".5" cy=".45" r=".7"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1a10" stop-opacity=".28"/></radialGradient><rect x="-600" y="-900" width="2280" height="1800" fill="url(#rmv)"/>`;
  // window with the city outside
  const out=night?skyNight(t)+stars(5,50,500,t,.8)+`<rect x="600" y="420" width="400" height="300" fill="#0e1220"/>`:skyTod('day')+`<rect x="640" y="330" width="120" height="400" fill="#c98a6a"/><rect x="770" y="300" width="150" height="430" fill="#d8b48a"/><rect x="930" y="360" width="120" height="370" fill="#b8a48a"/>`;
  s+=winK(700,250,260,380,out,{cur:'#4a6a8a'});
  // TV on a cabinet
  s+=`<rect x="70" y="700" width="400" height="200" fill="#5a3e2a"/><rect x="70" y="700" width="400" height="16" fill="#3a2818"/><rect x="100" y="470" width="340" height="210" rx="8" fill="#15171c"/>`;
  if(on>0){s+=`<rect x="114" y="484" width="312" height="182" fill="#3a6aa8" opacity="${on}"/><rect x="114" y="610" width="312" height="30" fill="#c23a3a" opacity="${on}"/><text x="270" y="632" text-anchor="middle" font-family="Inter" font-weight="900" font-size="18" fill="#fff" opacity="${on}">ÚLTIMA HORA</text><circle cx="220" cy="560" r="30" fill="#e2b08a" opacity="${on}"/><rect x="190" y="590" width="60" height="30" fill="#2a2e3a" opacity="${on}"/>`;}
  s+=`<rect x="250" y="680" width="40" height="20" fill="#15171c"/>`;
  // router + clock on the cabinet
  s+=`<rect x="360" y="676" width="80" height="24" rx="6" fill="#e9e4d8"/>`+[0,1,2].map(i=>`<circle cx="${376+i*16}" cy="688" r="4" fill="${on>0&&Math.sin(t*9+i*2)>-.3?'#3aff8a':'#3a3a3e'}"/>`).join('');
  s+=`<rect x="90" y="650" width="110" height="46" rx="6" fill="#1d1f26"/><text x="145" y="684" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="30" fill="${on>0?'#ff4a4a':'#2a2a2e'}">${o.clock||'12:33'}</text>`;
  // floor lamp
  s+=`<rect x="1010" y="520" width="10" height="380" fill="#2a2e3a"/><path d="M970,520 L1060,520 L1040,450 L990,450Z" fill="#f3eee2"/>`;
  if(on>0) s+=`<circle cx="1015" cy="520" r="200" fill="url(#glowY)" opacity="${(.5*on).toFixed(2)}"/>`;
  s+=`<ellipse cx="540" cy="1000" rx="420" ry="60" fill="${night?'#3a2a3a':'#a84a3a'}" opacity=".8"/>`;
  return s};

// ---------- scenes ----------
S.hook=(t,D,B)=>{const E=EVS.hook(B), k=eIO(prog(t,0,D));
  let s=iberia(t,t-E.off);
  let o=cam(s,lerp(1.0,1.1,k),540,600,540,600);
  if(t>E.month) o+=countPop('1 MES',540,300,140,t-E.month,PINK);
  return o;};

S.teaser=(t,D,B)=>{const E=EVS.teaser(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0c0e18"/>`;
  const H=290;
  const panel=(i,ev,inner,label,col)=>{const a=prog(t,ev-.15,ev+.35);if(a<=0) return '';const y=190+i*(H+12), id='tz'+i, dim=(i<2&&t>[E.d3,E.d7][i])?.5:0;
    return `<g transform="translate(${((1-eOut(a))*(i%2?-1100:1100)).toFixed(1)},0)"><clipPath id="${id}"><rect x="30" y="${y}" width="1020" height="${H}" rx="18"/></clipPath><g clip-path="url(#${id})">${inner(y)}<rect x="30" y="${y}" width="1020" height="${H}" fill="#000" opacity="${dim}"/></g><rect x="30" y="${y}" width="1020" height="${H}" rx="18" fill="none" stroke="${col}" stroke-width="6"/>${tag(140,y+38,label,col,1)}</g>`};
  s+=panel(0,E.d1,y=>{let g=`<rect x="30" y="${y}" width="1020" height="${H}" fill="#141a30"/>`+stars(2,30,y+80,t,.8);
    for(let i=0;i<6;i++) g+=`<rect x="${60+i*170}" y="${y+40}" width="150" height="${H}" fill="${['#3a2e2a','#2e2a36','#36302a'][i%3]}"/><rect x="${90+i*170}" y="${y+70}" width="40" height="50" fill="${i%2?'#ffb860':'#1a1a24'}" opacity=".8"/>`;
    g+=`<rect x="30" y="${y+H-40}" width="1020" height="40" fill="#1d1f26"/>`;
    for(let i=0;i<5;i++) g+=A({...CB(['C12','C16','C04','C19','C22'][i]),x:200+i*170,y:y+H-20,s:.3,mouth:'grin',eyes:Math.sin(t*6+i)>0?'closed':'open',look:[0,-4]});
    g+=candle(120,y+H-20,.8,t)+candle(960,y+H-20,.8,t+1)+candle(540,y+H-20,.6,t+2);return g;},'DÍA 1',YEL);
  s+=panel(1,E.d3,y=>{let g=`<rect x="30" y="${y}" width="1020" height="${H}" fill="#d9dde0"/>`;
    for(let r=0;r<3;r++) g+=`<rect x="40" y="${y+90+r*80}" width="1000" height="12" fill="#8a9098"/>`;
    g+=`<rect x="250" y="${y+60}" width="34" height="30" fill="#c23a3a"/><rect x="760" y="${y+220}" width="30" height="30" fill="#e0b04a"/>`;
    g+=`<g transform="rotate(-6 820 ${y+120})"><rect x="700" y="${y+90}" width="240" height="64" fill="#f3eee2"/><text x="820" y="${y+136}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="38" fill="#c23a3a">AGOTADO</text></g>`;
    g+=A({...CB('C19'),x:470,y:y+H+10,s:.34,look:[8,-6],brows:'worried',mouth:'o'});return g;},'DÍA 3',PINK);
  s+=panel(2,E.d7,y=>{let g=`<rect x="30" y="${y}" width="1020" height="${H}" fill="#cfe2ea"/>`;for(let x=30;x<1060;x+=60) g+=`<line x1="${x}" y1="${y}" x2="${x}" y2="${y+H}" stroke="#b8ccd6" stroke-width="3"/>`;
    g+=`<rect x="300" y="${y+210}" width="480" height="80" fill="#f6f8f8"/><rect x="340" y="${y+220}" width="400" height="40" rx="18" fill="#dfe8ec"/><path d="M520,${y+60} L520,${y+120} L600,${y+120} L600,${y+150}" stroke="#9aa3ad" stroke-width="26" fill="none" stroke-linecap="round"/><rect x="486" y="${y+40}" width="70" height="26" rx="8" fill="#7a838d"/>`;
    const p=(t*.7)%1;g+=`<ellipse cx="600" cy="${(y+164+p*50).toFixed(1)}" rx="7" ry="10" fill="#6cc6ff" opacity="${(1-p).toFixed(2)}"/>`;
    g+=`<g transform="translate(850,${y+260})"><path d="M-30,-90 L30,-90 L24,0 L-24,0Z" fill="#e9f6fb" stroke="#9aa3ad" stroke-width="4"/></g>`;return g;},'DÍA 7',BLUE);
  return s;};

S.off=(t,D,B)=>{const E=EVS.off(B), on=1-prog(t,E.off,E.off+.12);
  let s=flat(t,{on});
  s+=sofaK(560,1010,520,'#5a6a7a');
  s+=A({...ALEX,x:520,y:1010,s:.58,sit:true,look:t>E.off?[8,-8]:[-10,0],brows:t>E.off?'up':null,mouth:t>E.off?'o':'line'});
  s+=sofaArmsK(560,1010,520,'#5a6a7a');
  s+=dogLie(760,1040,.36,t,{head:t>E.off+.3?.9:.1,eyes:t>E.off+.3?'open':'closed'});
  if(on<1) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1a1a2a" opacity="${(.28*(1-on)).toFixed(2)}"/>`;
  let o=cam(s,lerp(1.0,1.08,prog(t,0,D)),540,700,540,620,t>E.off?shake(t,1-prog(t,E.off,E.off+.4),4):0);
  o+=bang(800,330,'¡CLAC!',PINK,P(t,E.off,.1)*(1-P(t,E.off+1,.3)),80);
  return o;};

S.chaos=(t,D,B)=>{const E=EVS.chaos(B);
  if(t<E.lift-.15){
    let s=street(t,{dim:true});
    s+=tLight(820,930,t<E.lights?'green':'off',t);
    const c1=lerp(-300,520,eOut(prog(t,E.honk-1.2,E.honk))), c2=lerp(1400,700,eOut(prog(t,E.honk-1.0,E.honk+.1)));
    s+=carK(c1,990,1.0,'#c23a3a')+carK(c2,1080,1.1,'#3a6aa8');
    let o=cam(s,1.05,560,760,540,620,t>E.honk?shake(t,1-prog(t,E.honk,E.honk+.6),5):0);
    if(t>E.lights&&t<E.honk) o+=tag(320,300,'SEMÁFOROS APAGADOS',PINK,P(t,E.lights,.2));
    o+=bang(330,560,'¡PIIII!',YEL,P(t,E.honk,.1)*(1-P(t,E.lift-.4,.2)),84)+bang(800,640,'¡PI-PI!',YEL,P(t,E.honk+.25,.1)*(1-P(t,E.lift-.4,.2)),64);
    return o;}
  // inside the stuck lift
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#8a9098"/>`;
  for(let x=-600;x<1700;x+=90) s+=`<rect x="${x}" y="-900" width="4" height="2400" fill="#fff" opacity=".12"/>`;
  s+=`<rect x="300" y="180" width="480" height="830" fill="#a8b0b8"/><line x1="540" y1="180" x2="540" y2="1010" stroke="#6a727a" stroke-width="8"/>`;
  s+=`<rect x="830" y="420" width="90" height="240" rx="8" fill="#5a6068"/>`+[0,1,2,3,4,5].map(i=>`<circle cx="875" cy="${450+i*36}" r="12" fill="#3a3e46" stroke="#9aa3ad" stroke-width="2"/>`).join('');
  s+=`<rect x="-600" y="1010" width="2280" height="600" fill="#5a5e66"/>`;
  const knock=Math.sin(t*14)>.3;
  s+=A({...ELEV,x:600,y:1010,s:.6,look:[-6,-4],brows:'worried',eyes:'wide',mouth:'o',reachR:[knock?180:200,-520]});
  s+=`<circle cx="540" cy="160" r="40" fill="#ffd76a" opacity="${.5+.4*Math.sin(t*20)}"/>`;
  s+=dark(.5,[[560,620,360,420]]);
  let o=cam(s,1.1,560,640,540,620,shake(t,.25,3));
  o+=tag(540,330,'ATRAPADA EN EL ASCENSOR',PINK,P(t,E.lift,.2));
  o+=bang(860,560,'¡TOC TOC!',YEL,knock?1:.6,56);
  return o;};

S.laugh=(t,D,B)=>{const E=EVS.laugh(B);
  let s=street(t,{dim:true});
  s+=tLight(980,930,'off',t);
  const crowd=[['C12',120,.56,'phone'],['C19',300,.54,''],['C03',470,.6,''],['C16',660,.55,'phone'],['C24',800,.42,''],['C08',920,.58,'']];
  crowd.forEach(([id,x,sc,ph],i)=>{const c=CB(id);const lau=t>E.laugh;const P0=CAST_BY_ID[id].kid?kid:A;
    s+=P0({...c,x,y:930+(i%2)*40,s:sc,look:[0,-6],mouth:lau?'grin':'smile',eyes:lau&&Math.sin(t*6+i)>0?'closed':'open',brows:null,phoneR:ph==='phone'});});
  let o=cam(s,lerp(1.0,1.08,prog(t,0,D)),540,700,540,620);
  if(t>E.say) o+=bubble(560,320,560,110,'«¡EN 2 HORAS VUELVE!»',{tx:470,ty:470,size:42,op:P(t,E.say,.2)});
  return o;};

S.alex=(t,D,B)=>{const E=EVS.alex(B), k=eIO(prog(t,0,D));
  const out=street(t,{dim:true});
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#cbbba3"/>`;
  s+=winK(560,180,460,620,`<g transform="translate(560,180) scale(.5) translate(-200,200)">${out}</g>`,{cur:'#4a6a8a'});
  s+=`<rect x="-600" y="900" width="2280" height="700" fill="#8a6448"/>`;
  s+=shepherd(600,1010,.42,t,{dir:-1,alert:.8,head:22,seed:9});
  s+=A({...ALEX,x:330,y:1010,s:.62,look:t>E.q?[0,0]:[12,4],brows:t>E.q?'worried':null,mouth:'line'});
  let o=cam(s,lerp(1.0,1.3,k),360,620,480,600);
  if(t>E.name&&t<E.q) o+=tag(780,330,'ÁLEX · 31 AÑOS',GREEN,P(t,E.name,.2));
  if(t>E.q) o+=countPop('¿Y SI NO VUELVE?',540,300,84,t-E.q,PINK);
  return o;};

S.go=(t,D,B)=>{const E=EVS.go(B), out=eIO(prog(t,E.go,E.go+1.8));
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#d8c8b0"/><rect x="-600" y="900" width="2280" height="700" fill="#8a6448"/>`;
  s+=doorK(640,500,260,410,{open:prog(t,E.go,E.go+.6)*.8,col:'#7a5434',dark:'#2a2622'});
  s+=`<rect x="380" y="420" width="160" height="14" fill="#5a3e2a"/>`+[0,1,2].map(i=>`<rect x="${400+i*50}" y="420" width="8" height="30" fill="#3a2818"/>`).join('');
  s+=`<path d="M400,440 L370,470 L360,600 L450,600 L440,470Z" fill="#6a4a3a"/><path d="M400,440 L405,520" stroke="#4a3428" stroke-width="4"/>`;
  const grab=t>E.bruno-.3;
  if(!grab) s+=`<path d="M510,440 q10,50 -6,90" stroke="#c23a3a" stroke-width="7" fill="none"/>`;
  const ax=lerp(350,760,out), dx=lerp(560,900,out);
  const jump=t>E.bruno&&t<E.go?Math.abs(Math.sin(t*7))*20:0;
  s+=`<g transform="translate(0,${(-jump).toFixed(1)})">${shepherd(dx,1010,.44,t,{alert:1,wag:true,bark:t>E.bruno&&t<E.bruno+.6,walk:out>0&&out<1?t*9:null,tongue:t>E.bruno+.6,seed:9})}</g>`;
  if(grab){const hand=[ax+.62*120,1010-.62*420], col=dobCollar(dx,1010-jump,.44,1);s+=leash(hand,col,30,'#c23a3a');}
  s+=A({...ALEX,x:ax,y:1010,s:.62,walk:out>0&&out<1?t*7:null,look:[12,-2],brows:'angry',mouth:'line',reachR:grab?[120,-420]:null,reachL:!grab?[150,-560]:null,backpack:'#2a3a2a'});
  let o=cam(s,lerp(1.05,1.12,prog(t,0,D)),560,720,540,620);
  if(t>E.bruno&&t<E.hour) o+=tag(820,330,'BRUNO',YEL,P(t,E.bruno,.2));
  if(t>E.hour) o+=countPop('1 HORA',540,300,120,t-E.hour,PINK);
  return o;};

S.bath=(t,D,B)=>{const E=EVS.bath(B), l2=t>B[1].s;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#dfe8ea"/>`;
  for(let x=-600;x<1700;x+=70) s+=`<line x1="${x}" y1="-900" x2="${x}" y2="900" stroke="#c4d0d4" stroke-width="3"/>`;
  for(let y=-200;y<900;y+=70) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#c4d0d4" stroke-width="3"/>`;
  s+=`<rect x="-600" y="900" width="2280" height="700" fill="#9aa4a8"/>`;
  // the tub (side view), tap on the left
  const lvl=lerp(0,.5,eOut(prog(t,E.fill,E.half))), flow=t<E.weak?1:lerp(1,0,prog(t,E.weak,E.half+.1));
  const TX=180, TW=560, TY=700, TH=230;
  s+=`<rect x="${TX-20}" y="${TY-420}" width="18" height="300" fill="#9aa3ad"/><rect x="${TX-20}" y="${TY-130}" width="90" height="20" rx="8" fill="#9aa3ad"/><rect x="${TX+52}" y="${TY-118}" width="18" height="30" fill="#9aa3ad"/><circle cx="${TX-12}" cy="${TY-440}" r="26" fill="#7a838d"/>`;
  s+=`<rect x="${TX}" y="${TY}" width="${TW}" height="${TH}" rx="40" fill="#f6f8f8"/>`;
  const wy=TY+TH-30-(TH-60)*lvl;
  if(lvl>0) s+=`<clipPath id="tubw"><rect x="${TX+20}" y="${TY}" width="${TW-40}" height="${TH-20}" rx="30"/></clipPath><g clip-path="url(#tubw)"><rect x="${TX+20}" y="${wy.toFixed(1)}" width="${TW-40}" height="${TH}" fill="#7cc6ee" opacity=".9"/><path d="M${TX+20},${wy.toFixed(1)} q70,${(Math.sin(t*8)*4).toFixed(1)} 140,0 t140,0 t140,0 t140,0" stroke="#e8f8ff" stroke-width="5" fill="none"/></g>`;
  s+=`<rect x="${TX}" y="${TY}" width="${TW}" height="34" rx="16" fill="#e9eef0"/><rect x="${TX+30}" y="${TY+TH-4}" width="40" height="40" fill="#c9d2d6"/><rect x="${TX+TW-70}" y="${TY+TH-4}" width="40" height="40" fill="#c9d2d6"/>`;
  if(t>E.fill&&flow>0){const w=Math.max(2,16*flow);s+=`<rect x="${TX+61-w/2}" y="${TY-88}" width="${w.toFixed(1)}" height="${(wy-(TY-88)).toFixed(1)}" fill="#7cc6ee" opacity=".85"/>`;}
  if(flow<=0.05&&t>E.half-.5){const p=(t*1.3)%1;s+=`<ellipse cx="${TX+61}" cy="${(TY-80+p*90).toFixed(1)}" rx="5" ry="8" fill="#7cc6ee" opacity="${(1-p).toFixed(2)}"/>`;}
  if(t>E.half) s+=`<line x1="${TX+20}" y1="${(TY+TH/2).toFixed(0)}" x2="${TX+TW-20}" y2="${(TY+TH/2).toFixed(0)}" stroke="${PINK}" stroke-width="5" stroke-dasharray="14 10"/>`;
  // pots on the floor
  for(let i=0;i<3;i++){const a=prog(t,E.pots-.4+i*.2,E.pots+i*.2), x=120+i*110;if(a>0) s+=`<g transform="translate(${x},935) scale(${eBack(a).toFixed(3)})"><rect x="-40" y="-70" width="80" height="70" rx="8" fill="#9aa3ad"/><rect x="-46" y="-74" width="92" height="12" rx="6" fill="#7a838d"/><rect x="-36" y="-62" width="72" height="12" fill="#7cc6ee"/><rect x="-70" y="-60" width="26" height="8" fill="#5a6068"/><rect x="44" y="-60" width="26" height="8" fill="#5a6068"/></g>`;}
  s+=shepherd(760,1040,.38,t,{dir:-1,alert:.7,head:l2?-10:6,tongue:l2,seed:9});
  s+=A({...ALEX,x:900,y:1010,s:.6,look:[-12,4],brows:l2?'worried':null,mouth:'line',reachL:[-130,-330]});
  s+=`<g transform="translate(${900-.6*130},${1010-.6*330})"><rect x="-40" y="-10" width="80" height="64" rx="8" fill="#9aa3ad"/><rect x="-46" y="-14" width="92" height="12" rx="6" fill="#7a838d"/></g>`;
  let o=cam(s,lerp(1.02,1.1,prog(t,0,D)),560,720,540,640);
  if(t>E.pumps&&!l2){o+=`<g opacity="${P(t,E.pumps,.25)}" transform="translate(-170,-60)"><circle cx="820" cy="420" r="120" fill="#11131f" fill-opacity=".9" stroke="#fff" stroke-width="5"/><rect x="770" y="330" width="90" height="170" fill="#c98a6a"/>${[0,1,2,3].map(i=>`<rect x="782" y="${342+i*36}" width="24" height="22" fill="#8ab0c8"/><rect x="826" y="${342+i*36}" width="24" height="22" fill="#8ab0c8"/>`).join('')}<path d="M876,500 L876,350" stroke="#6cc6ff" stroke-width="8" stroke-dasharray="10 8"/><circle cx="876" cy="508" r="14" fill="#3a3e46"/><text x="876" y="514" text-anchor="middle" font-family="Inter" font-weight="900" font-size="14" fill="#ffd34a">⚡</text><path d="M850,360 L902,412 M902,360 L850,412" stroke="${PINK}" stroke-width="10" stroke-linecap="round"/></g>`;}
  if(t>E.half) o+=tag(540,330,'MEDIA BAÑERA',PINK,P(t,E.half,.2));
  return o;};

S.patio=(t,D,B)=>{const E=EVS.patio(B), lau=t>E.laugh;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#cdb898"/>`;
  for(let y=-200;y<1200;y+=46) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#b8a282" stroke-width="2"/>`;
  s+=`<rect x="470" y="-900" width="22" height="2400" fill="#8a8f99"/>`;
  s+=`<path d="M-100,560 Q300,600 700,560" stroke="#3a3a3e" stroke-width="3" fill="none"/>`+[['#c23a3a',80],['#3a6aa8',200],['#f3eee6',330],['#e0b04a',460]].map(([c,x])=>`<rect x="${x}" y="${572+Math.sin(t*2+x)*3}" width="70" height="90" fill="${c}"/>`).join('');
  // Álex's window (6th), upper right
  s+=`<rect x="620" y="120" width="300" height="300" fill="#2a2622"/>`;
  s+=`<clipPath id="pw1"><rect x="620" y="120" width="300" height="300"/></clipPath><g clip-path="url(#pw1)">${A({...ALEX,x:770,y:620,s:.62,look:[-12,10],brows:lau?'angry':null,mouth:'line',reachL:[-150,-420],reachR:[150,-420]})}</g>`;
  s+=`<g transform="translate(770,392)"><rect x="-80" y="-50" width="160" height="60" rx="8" fill="#9aa3ad"/><rect x="-70" y="-46" width="140" height="12" fill="#7cc6ee"/></g>`;
  s+=`<rect x="606" y="410" width="328" height="20" fill="#e9e4d8"/><rect x="606" y="110" width="328" height="14" fill="#e9e4d8"/>`;
  // the neighbour's window (5th), lower left
  s+=`<rect x="80" y="700" width="320" height="330" fill="#2a2622"/>`;
  const bob=lau?Math.abs(Math.sin(t*9))*6:0;
  s+=`<clipPath id="pw2"><rect x="80" y="700" width="320" height="330"/></clipPath><g clip-path="url(#pw2)"><g transform="translate(0,${(-bob).toFixed(1)})">${A({...VEC5,x:240,y:1230,s:.64,look:[10,-12],eyes:lau?'closed':'open',mouth:lau?'grin':'smile',reachL:[-120,-330],reachR:[120,-330]})}</g></g>`;
  s+=`<rect x="66" y="1020" width="348" height="22" fill="#e9e4d8"/><rect x="66" y="690" width="348" height="14" fill="#e9e4d8"/>`;
  let o=cam(s,1.0,540,600,540,600);
  o+=bubble(560,580,620,110,'«¿TE VAS A DAR UN BAÑO?»',{tx:330,ty:700,size:38,op:P(t,.3,.2)});
  if(lau) o+=bang(560,900,'¡JA, JA, JA!',YEL,P(t,E.laugh,.1),56);
  if(t<E.laugh) o+=tag(240,1060,'EL VECINO DEL 5.º',YEL,P(t,.1,.2));
  return o;};

S.fridge=(t,D,B)=>{const E=EVS.fridge(B), note=prog(t,E.no-.3,E.no+.1);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#e9e2d2"/>`;
  for(let x=-600;x<1700;x+=60) for(let y=500;y<820;y+=60) s+=`<rect x="${x+2}" y="${y+2}" width="56" height="56" fill="#f3eee6"/>`;
  s+=`<rect x="-600" y="820" width="2280" height="20" fill="#3a3e46"/><rect x="-600" y="840" width="2280" height="160" fill="#6a4a2e"/><rect x="-600" y="1000" width="2280" height="600" fill="#b8b0a4"/>`;
  s+=`<rect x="60" y="250" width="300" height="260" fill="#6a4a2e"/><rect x="70" y="260" width="135" height="240" fill="#7a5434"/><rect x="215" y="260" width="135" height="240" fill="#7a5434"/>`;
  // fridge
  s+=`<rect x="420" y="240" width="300" height="770" rx="22" fill="#f3f5f6"/><rect x="420" y="500" width="300" height="10" fill="#c9d2d6"/><rect x="680" y="300" width="14" height="160" rx="6" fill="#9aa3ad"/><rect x="680" y="560" width="14" height="200" rx="6" fill="#9aa3ad"/>`;
  s+=`<rect x="440" y="280" width="60" height="40" fill="#e0b04a" transform="rotate(-6 470 300)"/><rect x="520" y="300" width="50" height="50" fill="#6cc6ff" transform="rotate(5 545 325)"/>`;
  if(note>0) s+=`<g transform="translate(570,640) rotate(-4) scale(${eBack(clamp(note)).toFixed(3)})"><rect x="-110" y="-70" width="220" height="140" fill="#ffe36a"/><text x="0" y="-8" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="#c23a3a">NO</text><text x="0" y="40" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="#c23a3a">ABRIR</text></g>`;
  s+=shepherd(330,1040,.42,t,{dir:1,alert:.6,head:12,tongue:true,seed:9});
  s+=A({...ALEX,x:860,y:1040,s:.62,look:[-12,0],mouth:'line',reachL:note<1?[-200,-560]:null});
  let o=cam(s,lerp(1.02,1.1,prog(t,0,D)),560,700,540,640);
  if(t>E.hours) o+=countPop('4 H',800,320,120,t-E.hours,BLUE)+`<g opacity="${P(t,E.hours,.3)}" transform="translate(480,120)"><rect x="290" y="270" width="26" height="110" rx="13" fill="#fff"/><rect x="296" y="300" width="14" height="74" rx="7" fill="#3aa0e8"/><circle cx="303" cy="386" r="22" fill="#3aa0e8"/><text x="336" y="350" font-family="${MONO}" font-weight="800" font-size="34" fill="#11131f">4 °C</text></g>`;
  return o;};

const shelfRow=(x0,y,w,seed,stock=1)=>{let s=`<rect x="${x0}" y="${y}" width="${w}" height="14" fill="#8a9098"/>`;const r=rng(seed);const cols=['#c23a3a','#3a6aa8','#e0b04a','#3a8a5a','#e9e4d8','#d4782a','#7a4a8a'];let x=x0+8;
  while(x<x0+w-30){const ww=24+r()*30, h=40+r()*50;if(r()<stock) s+=`<rect x="${x.toFixed(0)}" y="${(y-h).toFixed(0)}" width="${ww.toFixed(0)}" height="${h.toFixed(0)}" rx="4" fill="${cols[Math.floor(r()*cols.length)]}"/>`;x+=ww+4;}return s};
const shopIn=(t,o={})=>{let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#d9dde0"/><rect x="-600" y="-900" width="2280" height="1100" fill="#c9ced2"/>`;
  for(let i=0;i<6;i++) s+=`<rect x="${-300+i*260}" y="120" width="140" height="18" fill="#9aa3ad"/>`;
  s+=`<rect x="-600" y="960" width="2280" height="700" fill="#b8bcc0"/>`;for(let x=-600;x<1700;x+=110) s+=`<line x1="${x}" y1="960" x2="${(x-540)*1.8+540}" y2="1600" stroke="#9ea2a6" stroke-width="3"/>`;
  for(const y of [1000,1060,1140]) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#9ea2a6" stroke-width="2"/>`;
  s+=`<rect x="-600" y="960" width="2280" height="160" fill="#fff" opacity=".12"/>`;
  for(let i=0;i<5;i++) s+=`<rect x="${-120+i*280}" y="40" width="200" height="26" rx="6" fill="#e9ecee" stroke="#9aa3ad" stroke-width="4"/>`;
  return s};

S.shop=(t,D,B)=>{const E=EVS.shop(B);
  let s=shopIn(t);
  for(const [x0,w] of [[-300,560],[620,700]]){s+=`<rect x="${x0}" y="300" width="${w}" height="660" fill="#e9ecee"/>`;for(let r=0;r<5;r++) s+=shelfRow(x0+10,400+r*130,w-20,x0+r*13,.9);}
    s+=`<circle cx="540" cy="260" r="40" fill="#fff" opacity="${.3+.2*Math.sin(t*3)}"/>`;
  const ax=lerp(260,520,eIO(prog(t,0,D)));
  s+=A({...ALEX,x:ax,y:1010,s:.62,walk:t<D-.5?t*6:null,look:[12,-6],mouth:'line',reachR:[150,-500]});
  s+=`<g transform="translate(${ax-.62*150},${1010-.62*330})"><rect x="-60" y="-10" width="120" height="70" rx="8" fill="#c23a3a" opacity=".9"/><rect x="-40" y="-30" width="30" height="30" fill="#e0b04a"/><rect x="0" y="-36" width="26" height="36" fill="#6cc6ff"/></g>`;
  s+=dark(.25,[[540,600,700,600]]);
  let o=cam(s,lerp(1.02,1.1,prog(t,0,D)),540,700,540,640);
  const it=[[E.cans,'LATAS',`<rect x="-34" y="-50" width="68" height="70" rx="8" fill="#c9c2b0"/><rect x="-34" y="-34" width="68" height="34" fill="#c23a3a"/>`],
    [E.water,'AGUA',`<rect x="-22" y="-74" width="44" height="96" rx="12" fill="#6cc6ff"/><rect x="-12" y="-90" width="24" height="18" rx="4" fill="#2a6aa8"/>`],
    [E.bat,'PILAS',`<rect x="-40" y="-46" width="30" height="70" rx="6" fill="#2a2e3a"/><rect x="-40" y="-46" width="30" height="22" fill="#e0b04a"/><rect x="8" y="-46" width="30" height="70" rx="6" fill="#2a2e3a"/><rect x="8" y="-46" width="30" height="22" fill="#e0b04a"/>`],
    [E.food,'PIENSO',`<path d="M-44,30 L-38,-60 L38,-60 L44,30Z" fill="#b5803f"/><text x="0" y="-10" text-anchor="middle" font-family="Inter" font-weight="900" font-size="16" fill="#fff">DOG</text>`]];
  it.forEach(([ev,lab,svg],i)=>{const a=prog(t,ev-.05,ev+.3);if(a>0){const x=[760,950,760,950][i], y=[400,400,600,600][i];o+=`<g transform="translate(${x},${y}) scale(${eBack(a).toFixed(3)})"><circle cx="0" cy="-10" r="84" fill="#11131f" fill-opacity=".9" stroke="#fff" stroke-width="5"/>${svg}<text x="0" y="62" text-anchor="middle" font-family="Inter" font-weight="900" font-size="22" fill="#ffd34a">${lab}</text></g>`;}});
  return o;};

S.till=(t,D,B)=>{const E=EVS.till(B);
  let s=shopIn(t);
  // shop window to the street: people still laughing, Bruno tied to a post
  s+=`<rect x="560" y="260" width="520" height="480" fill="#9ac0d4"/><clipPath id="tw"><rect x="560" y="260" width="520" height="480"/></clipPath><g clip-path="url(#tw)"><g transform="translate(560,260) scale(.5) translate(0,-360)">${street(t,{dim:true})}</g>`;
  s+=`<g>${A({...CB('C12'),x:900,y:700,s:.28,mouth:'grin',phoneR:true})}${A({...CB('C16'),x:1000,y:700,s:.28,mouth:'grin'})}</g>`;
  s+=`<rect x="660" y="560" width="10" height="160" fill="#5a5e66"/>`+leash([665,620],dobCollar(720,720,.22,1),20,'#c23a3a')+shepherd(720,720,.22,t,{alert:.9,head:10,seed:9})+`</g>`;
  s+=`<rect x="552" y="252" width="536" height="496" fill="none" stroke="#5a6068" stroke-width="16"/><line x1="820" y1="260" x2="820" y2="740" stroke="#5a6068" stroke-width="10"/>`;
  // checkout
  s+=A({...CAJERA,x:250,y:1010,s:.6,look:[10,6],mouth:'line',reachL:[-60,-430],reachR:[60,-430]});
  s+=`<rect x="20" y="760" width="520" height="250" fill="#5a6068"/><rect x="0" y="740" width="560" height="30" fill="#3a3e46"/>`;
  s+=`<g transform="translate(250,${1010-.6*440})"><rect x="-38" y="-52" width="76" height="104" rx="8" fill="#2a2e3a"/><rect x="-30" y="-44" width="60" height="22" fill="#cfe6a8"/><text x="26" y="-27" text-anchor="end" font-family="${MONO}" font-weight="800" font-size="16" fill="#2a3a1a">47,80</text>${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${-26+c*20}" y="${-14+r*20}" width="14" height="14" rx="3" fill="#9aa3ad"/>`).join('')).join('')}</g>`;
  s+=`<g transform="translate(160,880) rotate(-5)"><rect x="-110" y="-46" width="220" height="92" fill="#c9a87a"/><text x="0" y="-6" text-anchor="middle" font-family="Inter" font-weight="900" font-style="italic" font-size="34" fill="#2a2620">SOLO</text><text x="0" y="32" text-anchor="middle" font-family="Inter" font-weight="900" font-style="italic" font-size="34" fill="#2a2620">EFECTIVO</text></g>`;
  // queue: Álex paying + two more
  s+=A({...CB('C02'),x:880,y:1040,s:.56,look:[-10,0],mouth:'line',cane:true})+A({...CB('C19'),x:740,y:1030,s:.56,look:[-10,0],mouth:'line'});
  const pay=t>E.cash-.2;
  s+=A({...ALEX,x:600,y:1020,s:.62,look:[-12,4],mouth:'line',reachL:pay?[-170,-430]:null});
  if(pay) s+=`<g transform="translate(${600-.62*170},${1020-.62*430})"><rect x="-30" y="-16" width="60" height="32" rx="3" fill="#7ab86a"/><rect x="-24" y="-10" width="60" height="32" rx="3" fill="#8ac87a"/><text x="6" y="12" text-anchor="middle" font-family="Inter" font-weight="900" font-size="16" fill="#2a4a2a">50</text></g>`;
  s+=dark(.2,[[540,700,800,600]]);
  let o=cam(s,1.0,540,640,540,620);
  if(t>E.calc&&t<E.cash) o+=tag(270,420,'CON CALCULADORA',YEL,P(t,E.calc,.2));
  if(t>E.cash&&t<E.three) o+=brackets(160,880,260,130,GREEN);
  if(t>E.three) o+=countPop('3 EN LA COLA',740,330,72,t-E.three,YEL);
  return o;};

S.party=(t,D,B)=>{const E=EVS.party(B), k=prog(t,0,D);
  const lit=(i,j)=>((i*3+j*5)%4===0)?.9:0;
  let s=street(t,{night:true,lit});
  // people on balconies with candles, one with a guitar
  s+=A({...CB('C16'),x:330,y:640,s:.34,mouth:'grin',eyes:'closed',look:[0,-6]})+guitar(330,560,.32,-20,t,1)+candle(270,640,.55,t);
  s+=A({...CB('C13'),x:750,y:490,s:.32,mouth:'o',look:[0,-8]})+candle(820,490,.5,t+2);
  s+=A({...CB('C04'),x:140,y:790,s:.32,mouth:'grin',look:[2,-6]})+candle(80,790,.5,t+1);
  // the street below: a group singing around candles
  for(let i=0;i<5;i++) s+=A({...CB(['C12','C19','C03','C22','C18'][i]),x:240+i*150,y:930,s:.4,mouth:i%2?'o':'grin',eyes:Math.sin(t*4+i)>0?'closed':'open',look:[0,-8]});
  s+=candle(560,960,.8,t+3)+candle(380,960,.7,t+4);
  s+=dark(.35,[[330,560,180,180],[760,480,140,140],[560,860,420,200]]);
  let o=cam(s,lerp(1.0,1.1,eIO(k)),540,640,540,620);
  if(t>E.guitars) for(let i=0;i<3;i++){const p=((t-E.guitars)*.8+i/3)%1;o+=`<text x="${(380+i*40+p*80).toFixed(0)}" y="${(520-p*120).toFixed(0)}" font-family="Inter" font-weight="900" font-size="44" fill="#ffd34a" opacity="${(1-p).toFixed(2)}">♪</text>`;}
  return o;};

S.radio=(t,D,B)=>{const E=EVS.radio(B), on=t>E.on, l2=t>E.voice;
  let s=flat(t,{on:0,night:true,clock:''});
  s+=sofaK(560,1010,520,'#3a4450');
  s+=A({...ALEX,x:480,y:1010,s:.58,sit:true,look:l2?[8,6]:[10,8],brows:t>E.grave?'worried':null,mouth:'line'});
  s+=sofaArmsK(560,1010,520,'#3a4450');
  s+=dogLie(840,1050,.34,t,{dir:-1,head:l2?.7:.2,eyes:'open'});
  s+=`<rect x="580" y="900" width="200" height="16" fill="#3a2818"/>`+candle(740,900,.7,t);
  s+=`<g transform="translate(650,880) scale(.42)">${radioBig(0,0,1,t,on)}</g>`;
  s+=dark(.55,[[650,840,330,260]]);
  const z=l2?lerp(1.15,1.4,eIO(prog(t,E.voice,E.voice+2))):1.12;
  let o=cam(s,z,l2?640:600,820,540,700);
  if(t>E.nodate) o+=tag(540,330,'SIN FECHA DE VUELTA',PINK,P(t,E.nodate,.2));
  return o;};

S.end=(t,D,B)=>{const E=EVS.end(B), k=eIO(prog(t,0,D));
  let s=skyNight(t)+stars(21,120,700,t,1);
  s+=`<rect x="-600" y="180" width="2280" height="1500" fill="#5a4a3e"/>`;
  for(let y=180;y<1700;y+=46) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#4a3c32" stroke-width="2"/>`;
  // Álex's balcony (6th) up on the left
  s+=`<rect x="-200" y="230" width="640" height="330" fill="#1a1612"/>`;
  s+=shepherd(120,560,.3,t,{alert:.6,head:-24,seed:9});
  s+=A({...ALEX,x:280,y:560,s:.46,look:[10,12],brows:'worried',mouth:'line'});
  s+=`<rect x="-220" y="556" width="680" height="16" fill="#2a2e3a"/>`+Array.from({length:17},(_,i)=>`<rect x="${-210+i*40}" y="450" width="6" height="106" fill="#2a2e3a"/>`).join('')+`<rect x="-220" y="446" width="680" height="10" fill="#2a2e3a"/><rect x="-220" y="572" width="680" height="24" fill="#4a3c32"/>`;
  // the neighbour's balcony (5th) below on the right
  s+=`<rect x="360" y="700" width="760" height="380" fill="#1a1612"/><rect x="400" y="720" width="300" height="340" fill="#2a2018"/>`;
  s+=candle(980,1050,.8,t);
  s+=A({...VEC5,x:700,y:1060,s:.58,look:[0,-8],eyes:'closed',mouth:t>E.know?'o':'grin',mopen:.4+.3*Math.sin(t*8)});
  s+=guitar(700,1060-.58*300,.56,-14,t,1);
  s+=`<rect x="340" y="1050" width="780" height="16" fill="#2a2e3a"/>`+Array.from({length:20},(_,i)=>`<rect x="${350+i*39}" y="950" width="6" height="100" fill="#2a2e3a"/>`).join('')+`<rect x="340" y="946" width="780" height="10" fill="#2a2e3a"/>`;
  s+=dark(.45,[[700,900,360,260],[200,430,320,240]]);
  let o=cam(s,lerp(1.0,1.3,k),lerp(540,700,k),lerp(640,840,k),540,640);
  for(let i=0;i<2;i++){const p=((t*.7)+i/2)%1;o+=`<text x="${(lerp(800,860,k)+p*60).toFixed(0)}" y="${(lerp(760,700,k)-p*100).toFixed(0)}" font-family="Inter" font-weight="900" font-size="42" fill="#ffd34a" opacity="${(.8*(1-p)).toFixed(2)}">♪</text>`;}
  return o;};

// HUD: one-hour head start, then clock
window.CFG={steps:['1. LLENA LA BAÑERA Y OLLAS','2. NO ABRAS LA NEVERA','3. COMPRA ANTES QUE NADIE'],listEnd:'party',
  hud:(h,bt,st,T)=>{const a=BEATS.find(b=>b.sc==='go').start, b=BEATS.find(b=>b.sc==='party').start;
    const sec=Math.max(0,3600-prog(T,a,b)*3240);const m=Math.floor(sec/60), s=Math.floor(sec%60);
    return 'VENTAJA · '+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');},
  band:{hook:'#050816',teaser:'#0c0e18',off:'#5a4030',chaos:'#3a3c42',laugh:'#3a3c42',alex:'#5a4030',go:'#5a4030',bath:'#6a7478',patio:'#8a7a5e',fridge:'#7a7468',shop:'#8a8c90',till:'#8a8c90',party:'#14161e',radio:'#1a1410',end:'#2a221c'}};

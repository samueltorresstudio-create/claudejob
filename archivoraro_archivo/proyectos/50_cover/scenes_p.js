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

// ---------- props ----------
const fridgeK=(x,y,k,o={})=>{ // fridge, door hinged on the right, k 0..1 open. o.note: the «NO ABRIR» post-it from part 1
  let s=`<rect x="${x}" y="${y-760}" width="300" height="760" rx="22" fill="#f3f5f6"/><rect x="${x}" y="${y-500}" width="300" height="8" fill="#c9d2d6"/>`;
  if(k>0){ // inside
    s+=`<rect x="${x+14}" y="${y-746}" width="272" height="732" rx="12" fill="#e9f2f6"/>`;
    for(const sy of [y-560,y-400,y-250]) s+=`<rect x="${x+14}" y="${sy}" width="272" height="8" fill="#b8c8d0"/>`;
    s+=`<rect x="${x+40}" y="${y-640}" width="50" height="80" fill="#f3f0e6" stroke="#9aa3ad" stroke-width="3"/><rect x="${x+40}" y="${y-640}" width="50" height="22" fill="#3a6aa8"/>`; // milk
    s+=`<ellipse cx="${x+190}" cy="${y-580}" rx="60" ry="22" fill="#e8c890"/><path d="M${x+150},${y-590} q40,-20 80,0" stroke="#7a9a3a" stroke-width="10" fill="none"/>`; // cheese + lettuce
    s+=`<rect x="${x+60}" y="${y-460}" width="90" height="60" rx="8" fill="#c8705a"/><rect x="${x+170}" y="${y-450}" width="70" height="50" rx="6" fill="#e0b04a"/>`;
    s+=`<rect x="${x+40}" y="${y-300}" width="220" height="50" rx="8" fill="#9ac46a" opacity=".7"/>`;
  }
  const dw=300*(1-k*.85);
  s+=`<rect x="${x+300-dw}" y="${y-760}" width="${dw}" height="760" rx="22" fill="${k>0?'#e3e8ea':'#f3f5f6'}" stroke="#c9d2d6" stroke-width="4"/>`;
  if(k<.3){s+=`<rect x="${x+262}" y="${y-700}" width="14" height="160" rx="6" fill="#9aa3ad"/><rect x="${x+262}" y="${y-460}" width="14" height="200" rx="6" fill="#9aa3ad"/>`;
    s+=`<rect x="${x+30}" y="${y-720}" width="60" height="40" fill="#e0b04a" transform="rotate(-6 ${x+60} ${y-700})"/><rect x="${x+120}" y="${y-700}" width="46" height="46" fill="#6cc6ff" transform="rotate(5 ${x+143} ${y-677})"/><circle cx="${x+210}" cy="${y-690}" r="18" fill="#ff6a8a"/>`;
    if(o.note) s+=`<g transform="translate(${x+150},${y-380}) rotate(-4)"><rect x="-80" y="-50" width="160" height="100" fill="#ffe36a"/><text x="0" y="-6" text-anchor="middle" font-family="Inter" font-weight="900" font-size="32" fill="#c23a3a">NO</text><text x="0" y="32" text-anchor="middle" font-family="Inter" font-weight="900" font-size="28" fill="#c23a3a">ABRIR</text></g>`;}
  return s};
const kitchen=(t,o={})=>{ const night=o.night;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${night?'#3a3430':'#e9e2d2'}"/>`;
  s+=decorWall({floor:null,paper:'dots',paperOp:.03,items:[['calendar',40,400,.9,{month:'NOVIEMBRE',mark:true}],['clock',610,330,.8,{stopped:true,h:12.55,m:33}],['shelf',300,440,.9,{w:230,seed:7}],['socket',560,640,.9]]});
  // backsplash tiles + counter + upper cabinets
  s+=`<rect x="-600" y="560" width="1260" height="260" fill="${night?'#4a4a48':'#f3f0e6'}"/>`;for(let x=-600;x<660;x+=52) for(let y=560;y<820;y+=52) s+=`<rect x="${x+2}" y="${y+2}" width="48" height="48" fill="none" stroke="${night?'#3a3a38':'#d9d4c8'}" stroke-width="3"/>`;
  s+=`<rect x="-600" y="820" width="1260" height="20" fill="#3a3e46"/><rect x="-600" y="840" width="1260" height="170" fill="#7a5434"/>`;for(let x=-560;x<640;x+=170) s+=`<rect x="${x}" y="860" width="150" height="130" rx="6" fill="none" stroke="#5a3e24" stroke-width="5"/><rect x="${x+65}" y="880" width="20" height="6" rx="3" fill="#c9c2b0"/>`;
  s+=`<rect x="-600" y="-900" width="1260" height="1050" fill="none"/>`;
  // sink + tap on the counter
  s+=`<rect x="120" y="808" width="230" height="16" rx="6" fill="#9aa3ad"/><path d="M230,808 L230,720 Q230,690 260,690 L290,690 L290,708" stroke="#9aa3ad" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  s+=`<rect x="-500" y="790" width="70" height="30" rx="4" fill="#5a3a24"/><rect x="-420" y="770" width="40" height="50" rx="6" fill="#c23a3a"/>`; // board + jar
  s+=fridgeK(700,1010,o.fridge||0,{note:o.note});
  s+=`<rect x="-600" y="1010" width="2280" height="600" fill="${night?'#2a2420':'#b8b0a4'}"/>`;for(let x=-600;x<1700;x+=90) s+=`<line x1="${x}" y1="1010" x2="${(x-540)*1.6+540}" y2="1600" stroke="#000" stroke-width="3" opacity=".1"/>`;
  s+=`<rect x="-600" y="1060" width="2280" height="3" fill="#000" opacity=".08"/>`;
  if(!night) s+=`<path d="M-200,200 L60,200 L360,1100 L-400,1100Z" fill="#fff4d0" opacity=".14"/>`+particles(t,'dust',{x0:-150,x1:300,y0:250,y1:1000,n:16});
  s+=dCorner(.22);
  return s};
const binK=(x,y)=>`<path d="M${x-55},${y} L${x-45},${y-150} L${x+45},${y-150} L${x+55},${y}Z" fill="#5a6068"/><rect x="${x-62}" y="${y-166}" width="124" height="20" rx="6" fill="#3a3e46"/>`;
const milkK=(x,y,s,rot=0)=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-25" y="-40" width="50" height="80" fill="#f3f0e6" stroke="#9aa3ad" stroke-width="3"/><path d="M-25,-40 L0,-58 L25,-40Z" fill="#e2dccf" stroke="#9aa3ad" stroke-width="3"/><rect x="-25" y="-20" width="50" height="22" fill="#3a6aa8"/></g>`;
const chickenK=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-60" y="-30" width="120" height="60" rx="10" fill="#e9e4d8" opacity=".9"/><ellipse cx="0" cy="0" rx="48" ry="22" fill="#f0c8a0"/><ellipse cx="-30" cy="-6" rx="18" ry="10" fill="#e8b890"/><rect x="-60" y="-30" width="120" height="60" rx="10" fill="#cfe6f6" opacity=".35"/></g>`;
const campStove=(x,y,s,t,on=1)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-40" y="-60" width="80" height="60" rx="14" fill="#3a6aa8"/><rect x="-40" y="-48" width="80" height="10" fill="#ffd34a"/><rect x="-50" y="-74" width="100" height="14" rx="4" fill="#2a2e36"/>${on?`<path d="M-30,-74 q8,${-14-4*Math.sin(t*20)} 16,0 q8,${-16-4*Math.sin(t*17)} 16,0 q8,${-14-4*Math.sin(t*23)} 16,0 q8,${-16-4*Math.sin(t*19)} 16,0" fill="#5ab4ff" opacity=".9"/>`:''}</g>`;
const panK=(x,y,s,t,food=1)=>`<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="80" ry="18" fill="#2a2e36"/><rect x="74" y="-8" width="110" height="14" rx="6" fill="#1d1f26"/>${food?`<ellipse cx="-14" cy="-6" rx="34" ry="10" fill="#d89a5a"/><ellipse cx="22" cy="-4" rx="26" ry="8" fill="#c8844a"/>`:''}${[0,1,2].map(i=>{const p=(t*1.3+i/3)%1;return `<path d="M${-30+i*28},${-14-p*80} q10,-12 0,-24" stroke="#fff" stroke-width="6" fill="none" opacity="${(.5*(1-p)).toFixed(2)}" stroke-linecap="round"/>`}).join('')}</g>`;
const bottleK=(x,y,s,lvl=1,o={})=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-26" y="-110" width="52" height="110" rx="12" fill="#dff2ff" opacity=".55" stroke="#9fc6dc" stroke-width="3"/>${lvl>0?`<rect x="-24" y="${(-108*lvl).toFixed(1)}" width="48" height="${(108*lvl).toFixed(1)}" rx="10" fill="#5ab4ff" opacity=".8"/>`:''}<rect x="-14" y="-128" width="28" height="20" rx="4" fill="${o.cap||'#2a6aa8'}"/><rect x="-26" y="-70" width="52" height="26" fill="#fff" opacity=".6"/></g>`;
const ambulanceK=(x,y,s,t)=>{const fl=Math.sin(t*14)>0;
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="280" ry="20" fill="#000" opacity=".3"/><path d="M-260,-40 L-260,-300 L120,-300 L120,-40Z" fill="#f3f3ee"/><path d="M120,-220 L210,-220 L270,-140 L270,-40 L120,-40Z" fill="#f3f3ee"/><path d="M130,-210 L200,-210 L248,-146 L130,-146Z" fill="#26304a"/>
  <rect x="-260" y="-150" width="530" height="26" fill="#d42a2a"/><rect x="-260" y="-118" width="530" height="12" fill="#f0c419"/><text x="-70" y="-190" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="#d42a2a">AMBULANCIA</text>
  <path d="M-30,-270 l0,60 M-60,-240 l60,0" stroke="#d42a2a" stroke-width="16"/><rect x="-200" y="-322" width="90" height="22" rx="6" fill="${fl?'#3a8aff':'#1a3a7a'}"/><rect x="0" y="-322" width="90" height="22" rx="6" fill="${fl?'#1a3a7a':'#3a8aff'}"/>
  <circle cx="-160" cy="-30" r="44" fill="#1d1d22"/><circle cx="160" cy="-30" r="44" fill="#1d1d22"/><circle cx="-160" cy="-30" r="18" fill="#9aa3ad"/><circle cx="160" cy="-30" r="18" fill="#9aa3ad"/></g>`};
const stretcher=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-110" width="300" height="20" rx="6" fill="#9aa3ad"/><path d="M-130,-90 L-120,0 M130,-90 L120,0" stroke="#5a6068" stroke-width="8"/><circle cx="-120" cy="0" r="12" fill="#2a2e36"/><circle cx="120" cy="0" r="12" fill="#2a2e36"/><path d="M-140,-112 Q-100,-150 0,-146 Q100,-150 140,-112Z" fill="#e9e4d8"/><circle cx="-110" cy="-128" r="22" fill="#e8b48c"/><rect x="-80" y="-140" width="40" height="18" fill="#cfe6f6" opacity=".8"/></g>`;
const pumpIcon=(fuel)=>`<g><rect x="-70" y="-30" width="140" height="80" fill="#9aa3ad"/><rect x="-60" y="-70" width="40" height="40" fill="#7a838d"/><path d="M-40,-70 l0,-30 l40,0" stroke="#5a6068" stroke-width="10" fill="none"/><path d="M70,0 l40,0" stroke="#5ab4ff" stroke-width="14"/><text x="0" y="22" text-anchor="middle" font-family="Inter" font-weight="900" font-size="20" fill="#1d1f26">BOMBEO</text>
  <path d="M-46,96 A50,50 0 0 1 46,96" stroke="#3a3e46" stroke-width="10" fill="none"/><path d="M-46,96 A50,50 0 0 1 ${(-46*Math.cos(Math.PI*(1-fuel))).toFixed(1)},${(96-46*Math.sin(Math.PI*fuel)).toFixed(1)}" stroke="${fuel<.3?'#ff4a6a':'#45e07e'}" stroke-width="10" fill="none"/><line x1="0" y1="96" x2="${(-40*Math.cos(Math.PI*fuel)).toFixed(1)}" y2="${(96-40*Math.sin(Math.PI*fuel)).toFixed(1)}" stroke="#fff" stroke-width="5"/><text x="-56" y="118" font-family="Inter" font-weight="900" font-size="18" fill="#ff4a6a">E</text><text x="48" y="118" font-family="Inter" font-weight="900" font-size="18" fill="#45e07e">F</text></g>`;
const iconCard=(x,y,a,svg,label,col)=>a<=0?'':`<g transform="translate(${x},${y}) scale(${eBack(clamp(a)).toFixed(3)})"><rect x="-96" y="-96" width="192" height="200" fill="#11131f" fill-opacity=".92" stroke="${col}" stroke-width="4"/><rect x="-96" y="-96" width="192" height="12" fill="${col}"/>${svg}<text x="0" y="86" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="22" fill="${col}">${label}</text></g>`;
const noseX=(x,y,a)=>a<=0?'':`<g opacity="${clamp(a)}" transform="translate(${x},${y})"><path d="M-12,-30 Q-20,10 -4,18 Q12,22 14,8" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-40,-40 L40,40 M40,-40 L-40,40" stroke="#ff4a6a" stroke-width="10" stroke-linecap="round"/></g>`;
// ================= APAGÓN · PARTE 3 (día 7: el agua) =================
const EVS={
  hook:B=>({air:B[0].w[2],dry:B[0].w[7]}),
  pumps:B=>({pumps:B[0].w[5],fuel:B[0].w[12],gen:B[0].w[11]}),
  three:B=>({water:B[0].w[2],three:B[0].w[6]}),
  door:B=>({knock:B[0].w[1],open:B[0].w[6],vec:B[0].w[8],laugh:B[0].w[14]}),
  kids:B=>({kids:B[0].w[1],drop:B[0].w[8]}),
  better:B=>({no:B[0].w[1],bottles:B[0].w[5],teach:B[0].w[7],better:B[0].w[9]}),
  termo:B=>({house:B[0].w[9],termo:B[1].w[1],eighty:B[1].w[4],cist:B[1].w[7],six:B[1].w[10]}),
  valve:B=>({open:B[0].w[2],water:B[0].w[10]}),
  boil:B=>({where:B[0].w[6],dis:B[0].w[8],boil:B[1].s,minute:B[1].w[2],drops:B[1].w[4],bleach:B[1].w[7],nop:B[1].w[9],wait:B[1].w[13],half:B[1].w[15]}),
  storm:B=>({thunder:B[0].w[3]}),
  rain:B=>({rain:B[0].w[3],collect:B[0].w[4],l2:B[1].s,pots:B[1].w[0],buckets:B[1].w[1],plastic:B[1].w[4],bar:B[1].w[14]}),
  bruno:B=>({drink:B[0].w[1]}),
  grey:B=>({never:B[0].w[6],wc:B[0].w[9],l2:B[1].s,chain:B[1].w[2],mop:B[1].w[6]}),
  gift:B=>({back:B[0].w[4],bottles:B[0].w[7],bruno:B[0].w[12]}),
  portal:B=>({portal:B[0].w[3],smell:B[0].w[5]}),
  end:B=>({chain:B[0].w[7],l2:B[1].s,days:B[1].w[3],danger:B[1].w[7]}),
};
const S={};
const VEC5S={...VEC5,top:'#cfcac0',topD:'#b0aa9e'};          // same neighbour as parts 1–2 (grey vest from day 3 on)
const SON={...CAST_BY_ID.C24.o,backpack:null,mouth:'line'}, DAUGHTER={...CAST_BY_ID.C25.o,mouth:'line'};
const faceY=(y,s)=>y-s*640;
const KS=.92; // kids: same head scale, child body

// ---------- props ----------
const termoK=(x,y,s,t,o={})=>{ // electric water heater on the wall, (x,y)=top centre. o.xray 0..1, o.lvl, o.valve 0..1
  const lv=o.lvl??1, xr=o.xray||0, id=uid('tm');
  let g=`<rect x="-118" y="60" width="14" height="40" fill="#7a838d"/><rect x="104" y="60" width="14" height="40" fill="#7a838d"/><rect x="-118" y="280" width="14" height="40" fill="#7a838d"/><rect x="104" y="280" width="14" height="40" fill="#7a838d"/>`;
  g+=`<rect x="-104" y="0" width="208" height="380" rx="96" fill="#f3f5f6" stroke="#b9c2c8" stroke-width="5"/>`;
  g+=`<clipPath id="${id}"><rect x="-90" y="16" width="180" height="348" rx="84"/></clipPath>`;
  if(xr>0){const top=16+(1-lv)*348;
    g+=`<g clip-path="url(#${id})" opacity="${xr.toFixed(2)}"><rect x="-90" y="16" width="180" height="348" fill="#12324a"/><rect x="-90" y="${top.toFixed(1)}" width="180" height="${(364-top).toFixed(1)}" fill="#3aa0e8"/>`+
      `<path d="M-90,${top.toFixed(1)} q45,${(-8*Math.sin(t*4)).toFixed(1)} 90,0 t90,0" stroke="#bfe8ff" stroke-width="5" fill="none"/>`;
    for(let i=0;i<7;i++){const p=(t*.5+i/7)%1;g+=`<circle cx="${(-60+i*20+Math.sin(t*3+i)*6).toFixed(1)}" cy="${(350-p*(350-top)).toFixed(1)}" r="${3+i%3*2}" fill="#dff4ff" opacity="${(.7*(1-p)).toFixed(2)}"/>`;}
    const sc=16+((t*.9)%1)*348;g+=`<rect x="-90" y="${sc.toFixed(1)}" width="180" height="6" fill="#9ff6ff" opacity=".6"/>`;
    for(let yy=40;yy<364;yy+=40) g+=`<line x1="-90" y1="${yy}" x2="90" y2="${yy}" stroke="#9ff6ff" stroke-width="1.5" opacity=".25"/>`;
    g+=`</g><rect x="-104" y="0" width="208" height="380" rx="96" fill="none" stroke="#6cc6ff" stroke-width="${(6*xr).toFixed(1)}"/>`;}
  else g+=`<rect x="-96" y="10" width="60" height="360" rx="30" fill="#fff" opacity=".7"/><rect x="44" y="20" width="44" height="340" rx="22" fill="#000" opacity=".06"/>`;
  g+=`<rect x="-52" y="120" width="104" height="42" rx="6" fill="#3a6aa8"/><text x="0" y="150" text-anchor="middle" font-family="Inter" font-weight="900" font-size="24" fill="#fff">80 L</text>`;
  g+=`<circle cx="0" cy="262" r="26" fill="#e9ecee" stroke="#9aa3ad" stroke-width="4"/><line x1="0" y1="262" x2="14" y2="250" stroke="#c23a3a" stroke-width="4"/><circle cx="60" cy="300" r="6" fill="${o.led?'#3aff8a':'#3a3a3e'}"/>`;
  g+=`<rect x="-62" y="372" width="18" height="140" fill="#9aa3ad"/><rect x="-66" y="420" width="26" height="10" fill="#3a8aff"/><rect x="44" y="372" width="18" height="140" fill="#9aa3ad"/><rect x="40" y="420" width="26" height="10" fill="#e04a3a"/>`;
  g+=`<rect x="-8" y="372" width="16" height="46" fill="#c9a050"/><g transform="translate(0,404) rotate(${((o.valve||0)*90).toFixed(1)})"><rect x="-32" y="-7" width="64" height="14" rx="7" fill="#c23a3a"/><circle cx="0" cy="0" r="8" fill="#8a1a1a"/></g><rect x="-11" y="416" width="22" height="18" rx="3" fill="#b08a40"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`};
const termoSpout=(x,y,s)=>[x,y+432*s];
const washer=(x,y,s,t,o={})=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-120" y="-300" width="240" height="300" rx="14" fill="#f3f5f6" stroke="#c9d2d6" stroke-width="5"/><rect x="-120" y="-300" width="240" height="60" rx="14" fill="#e3e8ea"/><circle cx="70" cy="-270" r="14" fill="#9aa3ad"/><rect x="-100" y="-282" width="80" height="22" rx="4" fill="#1d1f26"/><circle cx="0" cy="-120" r="86" fill="#c9d2d6"/><circle cx="0" cy="-120" r="66" fill="#2a3a4a"/><path d="M-40,-150 Q-10,-170 30,-150" stroke="#fff" stroke-width="6" fill="none" opacity=".4"/></g>`;
const bucketK=(x,y,s,lvl=0,o={})=>{const c=o.col||'#3a8ad8', w=o.grey?'#8a8f86':'#5ab4ff';
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70,-150 L70,-150 L56,0 L-56,0Z" fill="${c}"/><path d="M-70,-150 L70,-150 L56,0 L-56,0Z" fill="#000" opacity=".12" transform="translate(40,0) scale(.45,1)"/>${lvl>0?`<ellipse cx="0" cy="${(-150+150*(1-lvl)*.9).toFixed(1)}" rx="${(64-12*(1-lvl)).toFixed(1)}" ry="12" fill="${w}"/>`:`<ellipse cx="0" cy="-150" rx="70" ry="14" fill="${mix(c,'#000000',.4)}"/>`}<ellipse cx="0" cy="-150" rx="70" ry="14" fill="none" stroke="${mix(c,'#ffffff',.3)}" stroke-width="6"/><path d="M-68,-140 Q0,-250 68,-140" stroke="#5a6068" stroke-width="6" fill="none"/>${o.grey&&lvl>0?[0,1,2,3].map(i=>`<circle cx="${-30+i*20}" cy="${(-154+150*(1-lvl)*.9).toFixed(1)}" r="${8+i%2*4}" fill="#f3f3ee" opacity=".8"/>`).join(''):''}</g>`};
const potK=(x,y,s,lvl=0,o={})=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-90" y="-110" width="180" height="110" rx="12" fill="${o.col||'#9aa3ad'}"/><rect x="-90" y="-110" width="40" height="110" rx="12" fill="#fff" opacity=".2"/><rect x="-112" y="-96" width="24" height="12" rx="5" fill="#2a2e36"/><rect x="88" y="-96" width="24" height="12" rx="5" fill="#2a2e36"/><ellipse cx="0" cy="-110" rx="90" ry="16" fill="${lvl>0?'#5ab4ff':'#5a6068'}"/><ellipse cx="0" cy="-110" rx="90" ry="16" fill="none" stroke="#c9d2d6" stroke-width="5"/></g>`;
const barreno=(x,y,s,lvl,t)=>{let g=`<ellipse cx="0" cy="4" rx="170" ry="22" fill="#000" opacity=".25"/><path d="M-160,-120 L160,-120 L130,0 L-130,0Z" fill="#3aa86a"/><path d="M-160,-120 L-120,-120 L-100,0 L-130,0Z" fill="#fff" opacity=".15"/>`;
  g+=`<ellipse cx="0" cy="-120" rx="160" ry="30" fill="#1f6a42"/>`;
  if(lvl>0){const ry=26*(.7+.3*lvl), rx=150*(.85+.15*lvl);g+=`<ellipse cx="0" cy="${(-120+20*(1-lvl)).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="#5ab4ff"/>`;
    for(let i=0;i<3;i++){const p=(t*1.2+i/3)%1;g+=`<ellipse cx="${(-60+i*60).toFixed(0)}" cy="${(-120+20*(1-lvl)).toFixed(1)}" rx="${(10+p*50).toFixed(1)}" ry="${(3+p*9).toFixed(1)}" fill="none" stroke="#dff4ff" stroke-width="3" opacity="${(1-p).toFixed(2)}"/>`;}}
  g+=`<ellipse cx="0" cy="-120" rx="160" ry="30" fill="none" stroke="#5ad88a" stroke-width="8"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`};
const bleachK=(x,y,s,o={})=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M-60,0 L-60,-200 Q-60,-240 -20,-250 L-20,-290 L30,-290 L30,-250 Q60,-240 60,-200 L60,0Z" fill="#f3f3ee" stroke="#c9d2d6" stroke-width="4"/><path d="M30,-200 Q90,-200 90,-140 Q90,-90 60,-90" stroke="#f3f3ee" stroke-width="18" fill="none"/><rect x="-24" y="-310" width="58" height="26" rx="5" fill="#c23a3a"/><rect x="-56" y="-170" width="112" height="120" fill="#3a6aa8"/><text x="0" y="-122" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#fff">LEJÍA</text><rect x="-50" y="-100" width="100" height="40" fill="${o.ok?'#45e07e':'#fff'}"/><text x="0" y="-72" text-anchor="middle" font-family="Inter" font-weight="900" font-size="15" fill="#11131f">SIN PERFUME</text></g>`;
const literBottle=(x,y,s,o={})=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-70" y="-300" width="140" height="300" rx="30" fill="#dff2ff" opacity=".55" stroke="#9fc6dc" stroke-width="5"/><rect x="-64" y="-240" width="128" height="236" rx="26" fill="${o.cloud?'#b8c8a8':'#7cc8ff'}" opacity=".8"/>${o.open?'':'<rect x="-30" y="-340" width="60" height="44" rx="6" fill="#2a6aa8"/>'}<rect x="-70" y="-180" width="140" height="56" fill="#fff" opacity=".75"/><text x="0" y="-140" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#2a6aa8">1 L</text></g>`;
const germ=(x,y,s,t,ph=0,col='#7ad04a')=>{const w=Math.sin(t*5+ph)*.12;let g=`<ellipse cx="0" cy="0" rx="${(34*(1+w)).toFixed(1)}" ry="${(26*(1-w)).toFixed(1)}" fill="${col}" stroke="#2a5a1a" stroke-width="4"/>`;
  for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.sin(t*4+ph+i)*.15;g+=`<line x1="${(30*Math.cos(a)).toFixed(1)}" y1="${(24*Math.sin(a)).toFixed(1)}" x2="${(46*Math.cos(a)).toFixed(1)}" y2="${(38*Math.sin(a)).toFixed(1)}" stroke="#2a5a1a" stroke-width="4" stroke-linecap="round"/>`;}
  g+=`<circle cx="-10" cy="-4" r="6" fill="#fff"/><circle cx="10" cy="-4" r="6" fill="#fff"/><circle cx="-9" cy="-3" r="3" fill="#11131f"/><circle cx="11" cy="-3" r="3" fill="#11131f"/><path d="M-10,10 q10,6 20,0" stroke="#11131f" stroke-width="3" fill="none"/>`;
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${(Math.sin(t*2+ph)*14).toFixed(1)})">${g}</g>`};
const stopwatch=(x,y,s,frac,col='#ffd34a')=>{const a=frac*Math.PI*2-Math.PI/2;
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-16" y="-126" width="32" height="24" rx="5" fill="#2a2e36"/><circle cx="0" cy="0" r="104" fill="#11131f" stroke="${col}" stroke-width="10"/><path d="M0,0 L0,-90 A90,90 0 ${frac>.5?1:0} 1 ${(90*Math.cos(a)).toFixed(1)},${(90*Math.sin(a)).toFixed(1)}Z" fill="${col}" opacity=".35"/>${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<line x1="0" y1="-92" x2="0" y2="-78" stroke="#fff" stroke-width="5" transform="rotate(${i*30})"/>`).join('')}<line x1="0" y1="0" x2="${(80*Math.cos(a)).toFixed(1)}" y2="${(80*Math.sin(a)).toFixed(1)}" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle r="10" fill="${col}"/></g>`};
const bulb=(x,y,s,a)=>a<=0?'':`<g transform="translate(${x},${y}) scale(${(s*(.6+.4*eBack(clamp(a)))).toFixed(3)})" opacity="${clamp(a*2).toFixed(2)}"><circle r="110" fill="url(#glowY)"/><path d="M-40,20 Q-70,-10 -60,-50 Q-50,-96 0,-100 Q50,-96 60,-50 Q70,-10 40,20Z" fill="#ffe36a" stroke="#11131f" stroke-width="7"/><rect x="-28" y="20" width="56" height="34" rx="6" fill="#9aa3ad" stroke="#11131f" stroke-width="6"/>${[-1,0,1].map(i=>`<line x1="${i*60}" y1="-130" x2="${i*92}" y2="-170" stroke="#ffe36a" stroke-width="10" stroke-linecap="round" transform="rotate(${i*20})"/>`).join('')}</g>`;
const stink=(x,y,t,a,n=4,sp=240)=>{let s='';for(let i=0;i<n;i++){const p=(t*.45+i/n)%1;s+=`<path d="M${x+i*46-n*23},${(y-p*sp).toFixed(1)} q22,-22 0,-44 q-22,-22 0,-44" stroke="#8ab84a" stroke-width="11" fill="none" opacity="${(a*.85*Math.sin(p*Math.PI)).toFixed(2)}" stroke-linecap="round"/>`;}return s};
const flies=(x,y,t,n=4,r=60)=>Array.from({length:n},(_,i)=>`<g transform="translate(${(x+Math.sin(t*9+i*2)*r).toFixed(0)},${(y+Math.cos(t*7+i)*r*.7).toFixed(0)})"><ellipse cx="-6" cy="-5" rx="7" ry="4" fill="#dff" opacity=".7"/><circle r="5" fill="#1d1d22"/></g>`).join('');
const xMark=(x,y,s,a)=>a<=0?'':`<g transform="translate(${x},${y}) scale(${(s*(.5+.5*eBack(clamp(a)))).toFixed(3)})" opacity="${clamp(a*2).toFixed(2)}"><circle r="120" fill="none" stroke="#ff3e6c" stroke-width="22"/><path d="M-84,-84 L84,84" stroke="#ff3e6c" stroke-width="22" stroke-linecap="round"/></g>`;
const handIn=(x,y,rot,s,skin='#e2b08a',sleeve='#3a5a7a')=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="0" y="-36" width="420" height="72" rx="30" fill="${sleeve}"/><rect x="0" y="-36" width="40" height="72" rx="14" fill="${mix(sleeve,'#000000',.25)}"/><ellipse cx="-30" cy="0" rx="58" ry="44" fill="${skin}" stroke="${mix(skin,'#000000',.3)}" stroke-width="4"/><path d="M-70,-24 q-30,4 -36,22 M-74,4 q-30,6 -34,22 M-66,26 q-22,8 -24,22" stroke="${skin}" stroke-width="22" stroke-linecap="round" fill="none"/></g>`;
const polaroid=(x,y,a,inner,label)=>{if(a<=0) return '';const id=uid('pl');
  return `<g transform="translate(${x},${y}) rotate(-5) scale(${(.7+.3*eBack(clamp(a))).toFixed(3)})" opacity="${clamp(a*2).toFixed(2)}"><rect x="-196" y="-176" width="392" height="400" fill="#000" opacity=".3" transform="translate(10,12)"/><rect x="-196" y="-176" width="392" height="400" fill="#f3efe4"/><clipPath id="${id}"><rect x="-172" y="-152" width="344" height="300"/></clipPath><g clip-path="url(#${id})"><rect x="-172" y="-152" width="344" height="300" fill="#e8c890"/>${inner}<rect x="-172" y="-152" width="344" height="300" fill="#a86a2a" opacity=".22"/></g><text x="0" y="200" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="34" fill="#2a2620">${label}</text></g>`};

// ---------- sets ----------
const sinkClose=(t,o={})=>{ // morning kitchen sink close-up: tiles, window light, tap
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#e9e2d2"/>`;for(let x=-600;x<1700;x+=90) for(let y=-200;y<760;y+=90) s+=`<rect x="${x+3}" y="${y+3}" width="84" height="84" fill="#f3efe6" stroke="#d6cfc0" stroke-width="5"/>`;
  s+=winK(-120,-120,380,420,skyTod('day')+`<rect x="-100" y="80" width="160" height="300" fill="#c98a6a"/><rect x="80" y="40" width="160" height="340" fill="#d8b48a"/>`,{cur:'#c96a4a'});
  s+=`<path d="M-120,300 L260,300 L700,900 L120,900Z" fill="#fff4d0" opacity=".2"/>`;
  s+=`<rect x="-600" y="760" width="2280" height="40" fill="#3a3e46"/><rect x="-600" y="800" width="2280" height="400" fill="#7a5434"/>`;for(let x=-560;x<1700;x+=220) s+=`<rect x="${x}" y="830" width="200" height="300" rx="6" fill="none" stroke="#5a3e24" stroke-width="6"/>`;
  s+=`<path d="M220,770 L860,770 L820,960 L260,960Z" fill="#9aa3ad"/><path d="M250,780 L830,780 L800,940 L280,940Z" fill="#7a838d"/>`;
  s+=`<rect x="880" y="640" width="60" height="130" rx="10" fill="#45b06a"/><rect x="896" y="610" width="28" height="34" fill="#2a2e36"/><rect x="300" y="736" width="90" height="34" rx="6" fill="#ffd34a"/><rect x="300" y="736" width="90" height="12" fill="#3a8a5a"/>`;
  s+=`<rect x="960" y="560" width="160" height="210" fill="none" stroke="#9aa3ad" stroke-width="8"/>`+[0,1,2].map(i=>`<ellipse cx="${990+i*44}" cy="660" rx="18" ry="80" fill="#e9e4d8" stroke="#9aa3ad" stroke-width="4"/>`).join('');
  s+=`<rect x="-80" y="600" width="70" height="170" rx="8" fill="#dff2ff" opacity=".5" stroke="#9fc6dc" stroke-width="4"/><path d="M-60,600 l0,-30 l30,0 l0,30" fill="#c9d2d6"/>`;
  s+=dPlant(140,770,.7,{pot:'#c86a4a'});
  return s};
const tapK=(t,hd=0)=>`<path d="M540,770 L540,380 Q540,300 620,300 L700,300 L700,350" stroke="#c9d2d6" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M548,770 L548,390 Q548,316 620,312" stroke="#fff" stroke-width="8" fill="none" opacity=".6"/><rect x="510" y="250" width="60" height="30" rx="8" fill="#9aa3ad" transform="rotate(${hd} 540 265)"/>`;
const galeria=(t,o={})=>{ // utility room (galería): termo on the wall, washer, window, shelf. o.tx termo x, o.wx window x, o.wall
  const wc=o.wall||'#e6dcc8', tx=o.tx??230, wx=o.wx??700;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${wc}"/>`;
  s+=decorWall({floor:null,paper:'dots',paperOp:.05,items:[['calendar',tx>540?60:950,250,.85,{month:'NOVIEMBRE',mark:true}],['shelf',tx>540?120:380,400,.9,{w:230,seed:o.seed||3}],['socket',tx>540?560:620,600,.9],['clock',tx>540?400:560,250,.6,{stopped:true,h:12.55,m:33}]]});
  s+=`<rect x="-600" y="640" width="2280" height="380" fill="${mix(wc,'#ffffff',.35)}"/>`;for(let x=-600;x<1700;x+=60) for(let y=640;y<1010;y+=60) s+=`<rect x="${x+2}" y="${y+2}" width="56" height="56" fill="none" stroke="${mix(wc,'#000000',.12)}" stroke-width="3"/>`;
  s+=winK(wx,230,280,330,skyTod('day')+`<rect x="${wx}" y="380" width="120" height="300" fill="#c98a6a"/><rect x="${wx+130}" y="330" width="150" height="350" fill="#d8b48a"/>`,{cur:o.cur||'#5a8a6a'});
  s+=`<path d="M${wx},560 L${wx+280},560 L${wx+420},1100 L${wx-160},1100Z" fill="#fff4d0" opacity=".14"/>`;
  s+=`<path d="M-600,1010 L1680,1010 L1680,1600 L-600,1600Z" fill="${o.floor||'#b8a898'}"/>`;for(let x=-600;x<1700;x+=90) s+=`<line x1="${x}" y1="1010" x2="${(x-540)*1.6+540}" y2="1600" stroke="#000" stroke-width="3" opacity=".1"/>`;
  s+=`<rect x="-600" y="1004" width="2280" height="12" fill="#000" opacity=".15"/>`;
  s+=particles(t,'dust',{x0:wx-60,x1:wx+340,y0:560,y1:1000,n:14});
  s+=dCorner(.2);
  return s};
const hallBg=(t,o={})=>{ // Álex's entrance hall, front door open on the right to the landing
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${o.night?'#4a3e38':'#cdb89c'}"/>`;
  s+=decorWall({floor:1010,paper:'stripes',paperCol:'#000',paperOp:.05,base:'#5a4a3a',items:[['frame',80,330,.9,{pic:'photo'}],['frame',260,360,.7,{pic:'land'}],['hooks',60,560,.9,{coat:'#4a6a8a',bag:'#2a3a2a'}],['switch',560,600,1],['shelf',260,520,.8,{w:200,seed:5}]]});
  s+=`<rect x="700" y="380" width="320" height="630" fill="${o.night?'#141210':'#6a6258'}"/><rect x="700" y="380" width="320" height="630" fill="url(#glowY)" opacity="${o.night?.4:.15}"/>`;
  s+=`<rect x="690" y="370" width="340" height="16" fill="#5a3e24"/><rect x="690" y="370" width="12" height="640" fill="#5a3e24"/><rect x="1018" y="370" width="12" height="640" fill="#5a3e24"/>`;
  s+=`<g transform="translate(700,380) skewY(8) scale(.18,1)"><rect width="300" height="630" fill="#7a5434"/></g>`;
  s+=`<rect x="-600" y="1010" width="2280" height="600" fill="${o.night?'#2a2018':'#8a6448'}"/>`;for(let x=-600;x<1700;x+=100) s+=`<line x1="${x}" y1="1010" x2="${(x-540)*1.5+540}" y2="1600" stroke="#000" stroke-width="3" opacity=".12"/>`;
  s+=`<ellipse cx="420" cy="1060" rx="300" ry="40" fill="#a84a3a" opacity=".8"/>`;
  s+=dCorner(.25);
  return s};
const landing=(t,o={})=>{ // the stair landing outside Álex's door
  const n=o.night;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${n?'#3a3a44':'#b9b2a4'}"/>`;
  s+=`<rect x="-600" y="640" width="2280" height="380" fill="${n?'#2e2e36':'#8a8478'}"/><rect x="-600" y="636" width="2280" height="10" fill="#000" opacity=".15"/>`;
  s+=`<rect x="760" y="200" width="200" height="300" fill="${n?'#141a2a':'#9ac0d8'}" stroke="#e9e4d8" stroke-width="12"/><line x1="860" y1="200" x2="860" y2="500" stroke="#e9e4d8" stroke-width="8"/>`;
  if(!n) s+=`<path d="M760,500 L960,500 L1100,1100 L600,1100Z" fill="#fff4d0" opacity=".14"/>`;
  s+=`<g transform="translate(120,260)"><rect width="120" height="80" fill="#2a2e3a"/><text x="60" y="56" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#e9e4d8">2.º</text></g>`;
  s+=`<path d="M-100,1010 L340,560" stroke="#3a3a3e" stroke-width="12"/>`+[0,1,2,3,4,5].map(i=>`<line x1="${-60+i*70}" y1="${970-i*72}" x2="${-60+i*70}" y2="${1040-i*72}" stroke="#3a3a3e" stroke-width="6"/>`).join('');
  s+=`<rect x="560" y="300" width="70" height="40" rx="4" fill="#e9e4d8"/><circle cx="595" cy="320" r="8" fill="${n?'#3a3a3e':'#c23a3a'}"/>`;
  s+=`<rect x="-600" y="1010" width="2280" height="600" fill="${n?'#24242a':'#9a948a'}"/>`;for(let x=-600;x<1700;x+=120) s+=`<line x1="${x}" y1="1010" x2="${(x-540)*1.5+540}" y2="1600" stroke="#000" stroke-width="3" opacity=".1"/>`;
  s+=`<g transform="translate(360,250) rotate(2)"><rect x="0" y="0" width="220" height="170" fill="#8a6a4a"/><rect x="12" y="12" width="196" height="146" fill="#c9b090"/><rect x="28" y="24" width="110" height="80" fill="#fff" transform="rotate(-4 83 64)"/><text x="83" y="52" text-anchor="middle" font-family="Inter" font-weight="900" font-size="18" fill="#c23a3a">AVISO</text><text x="83" y="78" text-anchor="middle" font-family="Inter" font-weight="800" font-size="12" fill="#2a2620">SIN AGUA</text><rect x="130" y="60" width="64" height="80" fill="#ffe36a" transform="rotate(6 162 100)"/><circle cx="83" cy="26" r="5" fill="#c23a3a"/></g>`;
  s+=dPlant(1000,1010,.8,{pot:'#7a5a4a'});
  return s};
const balconyBg=(t,o={})=>{ // looking out from Álex's balcony: buildings across, sky (o.storm 0..1), railing, tiled floor
  const st=o.storm||0;
  let s=skyTod('day')+`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a3040" opacity="${(.75*st).toFixed(2)}"/>`;
  for(let i=0;i<5;i++){const x=((i*330+t*(8+st*30))%1700)-300;s+=`<ellipse cx="${x}" cy="${120+i%2*70}" rx="${220+i*20}" ry="70" fill="${mix('#ffffff','#3a4050',st)}" opacity=".85"/>`;}
  s+=facade(-260,500,260,'#c98a6a',{seed:7,dim:st>.4})+facade(260,420,200,'#e2d2b4',{seed:8,dim:st>.4})+facade(700,480,240,'#b8a48a',{seed:9,dim:st>.4});
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1a2030" opacity="${(.35*st).toFixed(2)}"/>`;
  s+=`<rect x="-600" y="700" width="2280" height="14" fill="#2a2e3a"/>`+Array.from({length:44},(_,i)=>`<rect x="${-560+i*52}" y="714" width="7" height="150" fill="#2a2e3a"/>`).join('')+`<rect x="-600" y="860" width="2280" height="16" fill="#6a5a4a"/>`;
  s+=`<rect x="-600" y="876" width="2280" height="800" fill="#c98a5a"/>`;for(let x=-600;x<1700;x+=80) s+=`<line x1="${x}" y1="876" x2="${(x-540)*1.7+540}" y2="1600" stroke="#8a5a3a" stroke-width="3" opacity=".5"/>`;for(let y of [930,1000,1090]) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#8a5a3a" stroke-width="3" opacity=".4"/>`;
  s+=dPlant(1040,900,.9)+dPlant(-20,920,.8,{pot:'#7a8a9a'});
  return s};
const portalBg=(t,o={})=>{ // the building's portal at night: mailboxes, dead lift, stairs, glass street door
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#3a3a40"/>`;
  s+=`<rect x="-600" y="600" width="2280" height="410" fill="#4a4040"/>`+Array.from({length:30},(_,i)=>`<rect x="${-600+i*80}" y="600" width="78" height="410" fill="none" stroke="#3a3232" stroke-width="3"/>`).join('');
  s+=`<rect x="40" y="300" width="300" height="240" fill="#6a6a70"/>`;for(let r=0;r<4;r++) for(let c=0;c<4;c++) s+=`<rect x="${52+c*72}" y="${312+r*56}" width="64" height="48" fill="#8a8a90" stroke="#5a5a60" stroke-width="3"/><rect x="${64+c*72}" y="${324+r*56}" width="40" height="6" fill="#2a2a2e"/>`;
  s+=`<rect x="420" y="320" width="230" height="690" fill="#7a838d"/><line x1="535" y1="320" x2="535" y2="1010" stroke="#5a6068" stroke-width="6"/><g transform="translate(535,560) rotate(-4)"><rect x="-110" y="-44" width="220" height="88" fill="#f3eee2"/><text x="0" y="-6" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#c23a3a">NO</text><text x="0" y="28" text-anchor="middle" font-family="Inter" font-weight="900" font-size="26" fill="#c23a3a">FUNCIONA</text></g>`;
  s+=`<rect x="430" y="270" width="210" height="40" fill="#1d1f26"/><text x="535" y="300" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="26" fill="#3a2a2a">- -</text>`;
  for(let i=0;i<7;i++) s+=`<rect x="${720+i*60}" y="${1010-(i+1)*70}" width="${400-i*60}" height="70" fill="${mix('#5a5050','#2a2626',i/7)}"/><rect x="${720+i*60}" y="${1010-(i+1)*70}" width="${400-i*60}" height="8" fill="#000" opacity=".2"/>`;
  s+=`<path d="M720,1010 L1140,520" stroke="#2a2a2e" stroke-width="10"/>`;
  s+=`<rect x="-600" y="1010" width="2280" height="600" fill="#2a2a2e"/>`;for(let x=-600;x<1700;x+=100) for(let y=1010;y<1600;y+=60) s+=`<rect x="${x+((y/60)%2)*50}" y="${y}" width="98" height="58" fill="none" stroke="#1d1d22" stroke-width="3"/>`;
  return s};
const pumpStation=(t,run)=>{ // the municipal pumping station; run 1..0 = generator running / dead
  let s=skyTod('day')+`<rect x="-600" y="-900" width="2280" height="2400" fill="#8a9098" opacity=".35"/>`+puffs(t,140,'#e9ecee',.7,6,3);
  s+=`<rect x="-600" y="640" width="2280" height="400" fill="#9aa86a"/>`+`<path d="M-600,660 Q0,600 600,650 T1680,640 L1680,700 L-600,700Z" fill="#7a8a52"/>`;
  s+=`<rect x="60" y="400" width="560" height="460" fill="#c9c2b0"/><rect x="60" y="400" width="560" height="30" fill="#8a8478"/><path d="M40,400 L340,300 L640,400Z" fill="#8a5a4a"/>`;
  s+=`<rect x="90" y="450" width="500" height="70" fill="#2a4a7a"/><text x="340" y="497" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#fff">ESTACIÓN DE BOMBEO</text>`;
  for(let i=0;i<3;i++) s+=`<rect x="${110+i*170}" y="560" width="110" height="130" fill="${run>.5?'#ffe8a0':'#2a3040'}"/><rect x="${110+i*170}" y="560" width="110" height="130" fill="none" stroke="#6a6458" stroke-width="8"/>`;
  s+=`<rect x="250" y="720" width="150" height="140" fill="#5a5048"/>`;
  s+=`<rect x="-600" y="800" width="1300" height="46" fill="#3a7ac8"/><rect x="-600" y="800" width="1300" height="12" fill="#fff" opacity=".25"/>`+[-400,-100,620].map(x=>`<rect x="${x}" y="790" width="22" height="66" fill="#2a5a9a"/>`).join('');
  // generator
  s+=`<rect x="680" y="620" width="320" height="240" rx="10" fill="#f0c419"/><rect x="680" y="620" width="320" height="30" rx="10" fill="#c9a010"/><text x="840" y="700" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#2a2620">GENERADOR</text>`;
  for(let i=0;i<5;i++) s+=`<rect x="${700+i*24}" y="730" width="14" height="100" rx="4" fill="#c9a010"/>`;
  s+=`<rect x="940" y="540" width="26" height="90" fill="#5a6068"/>`;
  if(run>0) for(let i=0;i<4;i++){const p=(t*1.6+i/4)%1;s+=`<circle cx="${(953+p*60+Math.sin(t*5+i)*10).toFixed(0)}" cy="${(530-p*200).toFixed(0)}" r="${(16+p*40).toFixed(0)}" fill="#5a5a60" opacity="${(run*.55*(1-p)).toFixed(2)}"/>`;}
  s+=`<circle cx="960" cy="660" r="12" fill="${run>.5?'#3aff8a':(Math.sin(t*10)>0?'#ff3a3a':'#5a1a1a')}"/>`;
  // fence
  s+=`<rect x="-600" y="960" width="2280" height="12" fill="#5a6068"/>`;for(let x=-600;x<1700;x+=40) s+=`<line x1="${x}" y1="860" x2="${x+40}" y2="1010" stroke="#7a838d" stroke-width="3" opacity=".6"/><line x1="${x+40}" y1="860" x2="${x}" y2="1010" stroke="#7a838d" stroke-width="3" opacity=".6"/>`;
  s+=`<rect x="-600" y="856" width="2280" height="8" fill="#5a6068"/>`+[-300,100,500,900].map(x=>`<rect x="${x}" y="840" width="14" height="180" fill="#4a5058"/>`).join('');
  s+=`<rect x="-600" y="1010" width="2280" height="600" fill="#6a6a62"/>`;
  return s};

// ================= scenes =================
S.hook=(t,D,B)=>{const E=EVS.hook(B), dry=t>E.dry;
  let s=sinkClose(t);
  const hd=-20*eOut(prog(t,0,.3))-40*eOut(prog(t,E.air,E.air+.3));
  s+=tapK(t,hd);
  if(!dry){ // coughing tap: bursts of water and air
    for(let i=0;i<5;i++){const p=((t*2.6)+i/5)%1, burst=Math.sin(t*19+i)>-.2;
      if(burst) s+=`<ellipse cx="${(700+Math.sin(i*3+t*9)*8).toFixed(0)}" cy="${(360+p*400).toFixed(0)}" rx="${(10+p*6).toFixed(0)}" ry="${(18+p*10).toFixed(0)}" fill="#6cc6ff" opacity="${(.9-p*.4).toFixed(2)}"/>`;
      else s+=`<circle cx="${(700+Math.sin(i*5)*30).toFixed(0)}" cy="${(370+p*120).toFixed(0)}" r="${(10+p*26).toFixed(0)}" fill="#fff" opacity="${(.7*(1-p)).toFixed(2)}"/>`;}
    s+=particles(t,'sparks',{x0:640,x1:760,y0:760,y1:790,n:10,col:'#bfe6ff'});}
  else {const p=prog(t,E.dry,E.dry+.8);if(p<1) s+=`<ellipse cx="700" cy="${(380+p*380).toFixed(0)}" rx="10" ry="15" fill="#6cc6ff"/>`;}
  s+=`<rect x="630" y="660" width="90" height="110" fill="#dff2ff" opacity=".45" stroke="#9fc6dc" stroke-width="4"/><rect x="634" y="${dry?750:720}" width="82" height="${dry?16:46}" fill="#6cc6ff" opacity=".6"/>`;
  s+=handIn(560,250,-12,.9);   // Álex's hand on the handle, from the right
  const shk=shake(t,dry?0:.9,7);
  let o=cam(s,lerp(1.25,1.08,eOut(prog(t,0,E.dry+.6))),620,500,540,560,shk);
  if(!dry) o+=bang(860,420,'¡PFFF!',BLUE,P(t,E.air-.1,.12),84);
  if(dry) o+=bang(300,440,'...',YEL,P(t,E.dry+.1,.15),110);
  return o;};

S.pumps=(t,D,B)=>{const E=EVS.pumps(B), run=1-prog(t,E.gen,E.fuel+.3), dead=t>E.fuel;
  if(t<E.pumps-.3){ // the calendar page: DÍA 7
    let s=sinkClose(t)+`<rect x="-600" y="-900" width="2280" height="2400" fill="#11131f" opacity=".55"/>`;
    for(let i=0;i<6;i++){const p=eIO(prog(t,i*.13,i*.13+.25));s+=`<g transform="translate(540,560) rotate(${(-p*70).toFixed(1)}) translate(0,${(p*-300).toFixed(1)})" opacity="${(1-p).toFixed(2)}"><rect x="-200" y="-240" width="400" height="460" fill="#fff"/><rect x="-200" y="-240" width="400" height="90" fill="#c23a3a"/><text x="0" y="120" text-anchor="middle" font-family="Inter" font-weight="900" font-size="230" fill="#2a2620">${i+1}</text></g>`;}
    s+=`<g transform="translate(540,560)"><rect x="-200" y="-240" width="400" height="460" fill="#fff"/><rect x="-200" y="-240" width="400" height="90" fill="#c23a3a"/><text x="0" y="-178" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="#fff">NOVIEMBRE</text><text x="0" y="120" text-anchor="middle" font-family="Inter" font-weight="900" font-size="230" fill="#c23a3a">7</text></g>`;
    return cam(s,lerp(1.0,1.08,prog(t,0,E.pumps)),540,560,540,560);}
  let bg=pumpStation(t,run);
  let fg=A({...CB('C03'),x:520,y:1010,s:.62,look:[12,-4],brows:'worried',eyes:dead?'wide':'open',mouth:dead?'o':'line',reachR:[260,-560]});
  if(dead) fg+=sweat(520,1010,.62,t);
  const k=eIO(prog(t,E.fuel-.5,E.fuel+.5));
  let o=focusCam(bg,fg,k*.6,840,650,{z0:1.05,z1:1.5,bars:false});
  o+=iconCard(860,330,prog(t,E.pumps,E.pumps+.35),pumpIcon(lerp(.5,0,prog(t,E.pumps+.4,E.fuel))).replace('<g>','<g transform="translate(0,-30) scale(.8)">'),dead?'SIN GASOIL':'GASOIL',PINK);
  if(dead) o+=bang(300,330,'¡CLONC!',PINK,P(t,E.fuel,.12),80);
  return o;};

S.three=(t,D,B)=>{const E=EVS.three(B), k=eIO(prog(t,E.three-.5,E.three+.6));
  let bg=kitchen(t,{fridge:0,note:true});
  let fg=shepherd(640,1010,.42,t,{dir:-1,alert:.8,head:16,seed:9})+`<path d="M560,1010 l-46,0 l-10,-34 l66,0Z" fill="#c23a3a"/>`;
  fg+=A({...ALEX,x:400,y:1010,s:.64,look:k>.5?[0,0]:[-10,4],brows:'worried',eyes:t>E.three?'wide':'open',mouth:t>E.three?'o':'line',reachR:[120,-470]});
  fg+=`<g transform="translate(${400+.64*120},${1010-.64*500})"><path d="M-26,-60 L26,-60 L20,20 L-20,20Z" fill="#dff2ff" opacity=".6" stroke="#9fc6dc" stroke-width="4"/></g>`;
  if(t>E.three) fg+=sweat(400,1010,.64,t);
  let o=focusCam(bg,fg,k,400,faceY(1010,.64),{z0:1.06,z1:2.2});
  if(t>E.water&&t<E.three-.2) o+=tag(760,420,'SIN AGUA',BLUE,P(t,E.water,.2));
  if(t>E.three) o+=countPop('3 DÍAS',540,330,150,t-E.three,PINK);
  return o;};

S.door=(t,D,B)=>{const E=EVS.door(B), op=eOut(prog(t,E.open-.3,E.open+.4)), kf=eIO(prog(t,E.vec,E.vec+.9)), fl=P(t,E.laugh-.25,.25);
  const knock=t<E.open-.2&&Math.sin(t*16)>.2;
  let bg=`<rect x="-600" y="-900" width="2280" height="2400" fill="#8a7a68"/>`+decorWall({floor:1010,paper:'stripes',paperCol:'#000',paperOp:.05,base:'#5a4a3a',items:[['hooks',100,330,1,{coat:'#4a6a8a',bag:'#2a3a2a'}],['frame',100,560,.8,{pic:'photo'}],['switch',880,600,1],['calendar',880,300,.8,{month:'NOVIEMBRE',mark:true}]]});
  bg+=`<rect x="380" y="400" width="300" height="610" fill="#9a948a"/><rect x="380" y="400" width="300" height="200" fill="#b9b2a4"/>`;
  bg+=`<g opacity="${op.toFixed(2)}">${A({...VEC5S,x:530,y:1010,s:.62,look:[0,2],brows:'worried',mouth:'line',reachR:[-120,-560],reachL:[120,-420]})}${bottleK(530-.62*120,1010-.62*380,.9,0,{cap:'#9aa3ad'})}</g>`;
  bg+=`<g transform="translate(380,400) scale(${(1-op*.85).toFixed(3)},1)"><rect x="0" y="0" width="300" height="610" fill="#7a5434"/><rect x="18" y="18" width="264" height="260" fill="none" stroke="#5a3e24" stroke-width="8"/><rect x="18" y="310" width="264" height="280" fill="none" stroke="#5a3e24" stroke-width="8"/><circle cx="262" cy="330" r="14" fill="#c9a050"/><circle cx="150" cy="150" r="10" fill="#1d1d22"/></g>`;
  bg+=`<rect x="370" y="390" width="320" height="16" fill="#5a3e24"/><rect x="370" y="390" width="12" height="620" fill="#5a3e24"/><rect x="678" y="390" width="12" height="620" fill="#5a3e24"/>`;
  bg+=`<rect x="-600" y="1010" width="2280" height="600" fill="#6a4a34"/>`+dPlant(980,1010,.8);
  let fg=shepherd(820,1010,.42,t,{dir:-1,alert:1,bark:knock,head:12,seed:9});
  fg+=A({...ALEX,x:lerp(980,760,eIO(prog(t,.3,E.open))),y:1040,s:.68,walk:t>.3&&t<E.open?t*7:null,dirW:-1,look:[-12,-2],brows:'worried',mouth:'line'});
  const shk=knock?Math.sin(t*60)*5:0;
  let o=focusCam(bg,fg,kf,530,faceY(1010,.62),{z0:1.04,z1:2.0,dx:shk});
  if(t<E.open) o+=bang(560,330,'¡POM, POM!',YEL,1,80);
  if(fl>0){const inner=`<rect x="-172" y="-152" width="344" height="300" fill="#d8b48a"/>`+`${A({...VEC5,x:0,y:420,s:.7,look:[6,-4],eyes:'happy',mouth:'laugh'})}<rect x="-172" y="120" width="344" height="30" fill="#2a2e3a"/>`;
    o+=polaroid(800,330,fl,inner,'DÍA 1');}
  return o;};

S.kids=(t,D,B)=>{const E=EVS.kids(B), kk=eOut(prog(t,E.kids-.2,E.kids+.5)), kd=eIO(prog(t,E.drop-.4,E.drop+.4));
  let bg=landing(t);
  let fg=kid({...SON,x:lerp(470,300,kk),y:1010,s:.7*KS,look:[8,-2],brows:'worried',mouth:'line'})+kid({...DAUGHTER,x:lerp(610,790,kk),y:1010,s:.7*KS,look:[-8,-2],brows:'worried',mouth:'line'});
  fg+=A({...VEC5S,x:540,y:1010,s:.7,look:[0,4],brows:'worried',mouth:t>E.drop?'o':'line',reachR:[150,-560]});
  const bx=540+.7*150, by=1010-.7*600, sh=t>E.drop-.3?Math.sin(t*30)*10*(1-prog(t,E.drop+.4,E.drop+.9)):0;
  fg+=`<g transform="translate(${(bx+sh).toFixed(1)},${by}) rotate(180)">${bottleK(0,0,1,0,{cap:'#9aa3ad'})}</g>`;
  const dp=prog(t,E.drop,E.drop+.7);if(t>E.drop&&dp<1) fg+=`<ellipse cx="${bx}" cy="${(by+150+dp*300).toFixed(0)}" rx="7" ry="11" fill="#6cc6ff"/>`;
  let o=focusCam(bg,fg,kd,bx,by+60,{z0:1.08,z1:1.9});
  if(t>E.drop+.2) o+=countPop('0 L',540,330,140,t-E.drop-.2,PINK);
  return o;};

S.better=(t,D,B)=>{const E=EVS.better(B), shakeHead=t>E.no&&t<E.teach-.2, up=t>E.teach;
  let bg=hallBg(t);
  bg+=`<rect x="100" y="760" width="280" height="250" fill="#6a4a30"/><rect x="100" y="760" width="280" height="14" fill="#4a3220"/>`;
  for(let i=0;i<6;i++) bg+=bottleK(130+i*44,760,.62,1);
  for(let i=0;i<5;i++) bg+=bottleK(150+i*44,900,.62,1);
  let fg=A({...VEC5S,x:860,y:1010,s:.62,look:[-12,0],brows:up?'up':'worried',mouth:up?'o':'line',reachL:[-100,-420]})+bottleK(860-.62*100,1010-.62*380,.85,0,{cap:'#9aa3ad'});
  fg+=A({...ALEX,x:520,y:1010,s:.66,look:shakeHead?[Math.sin(t*14)*14,0]:[12,-2],brows:up?'up':null,eyes:up?'wide':'open',mouth:up?'smile':'line',reachR:up?[90,-820]:null});
  const k=eIO(prog(t,E.teach-.3,E.teach+.6));
  let o=focusCam(bg,fg,k,600,faceY(1010,.66)+60,{z0:1.04,z1:1.6});
  if(t>E.bottles-.3&&t<E.teach) o+=tag(250,560,'SUS BOTELLAS',BLUE,P(t,E.bottles-.3,.2));
  o+=bulb(330,330,.8,prog(t,E.teach,E.teach+.4));
  if(t>E.better) o+=tag(540,880,'ALGO MEJOR',GREEN,P(t,E.better,.2));
  return o;};

S.termo=(t,D,B)=>{const E=EVS.termo(B);
  if(t<E.cist-.25){ // the utility room: Álex points at the termo, x-ray reveal
    const pt=t>E.house-.4, k=eIO(prog(t,E.termo-.4,E.termo+.6)), xr=prog(t,E.termo,E.termo+.6);
    let bg=galeria(t)+washer(560,1010,.95,t)+bucketK(760,1010,.7,0,{col:'#c23a3a'})+`<path d="M800,1010 L870,640" stroke="#c9a050" stroke-width="12"/><path d="M850,640 l40,0 l-6,-60 l-28,0Z" fill="#3aa86a"/>`;
    let fg=termoK(230,200,.95,t,{xray:xr,lvl:.92});
    fg+=A({...VEC5S,x:880,y:1010,s:.6,look:[-12,-4],brows:'worried',mouth:k>.5?'o':'line'});
    fg+=A({...ALEX,x:470,y:1010,s:.64,look:[-14,-8],dirW:-1,mouth:'smile',reachL:pt?[-330,-760]:null});
    let o=focusCam(bg,fg,k,240,420,{z0:1.04,z1:1.9});
    if(t>E.house&&t<E.termo) o+=tag(700,300,'EN CASA',GREEN,P(t,E.house,.2));
    if(t>E.eighty) o+=countPop('80 L',780,360,150,t-E.eighty,BLUE);
    return o;}
  // the bathroom: lid off the cistern
  const lid=eOut(prog(t,E.cist-.25,E.cist+.3)), k=eIO(prog(t,E.six-.4,E.six+.5));
  let bg=bathroom(t,{lidOff:lid>.5,level:1})+`<rect x="880" y="520" width="16" height="200" fill="#9aa3ad"/><rect x="860" y="560" width="70" height="120" rx="10" fill="#6cc6ff"/><circle cx="160" cy="640" r="34" fill="#f3f3f6" stroke="#c9d2d6" stroke-width="6"/><rect x="140" y="560" width="40" height="60" fill="#9aa3ad"/>`+dPlant(80,880,.8);
  let fg='';
  if(lid<=.5) fg+=`<rect x="330" y="540" width="320" height="34" rx="10" fill="#e9eef0"/>`;
  if(lid>.5) fg+=`<g transform="translate(250,880) rotate(-80)"><rect x="0" y="-17" width="320" height="34" rx="10" fill="#e9eef0" stroke="#c9d2d6" stroke-width="4"/></g>`;
  fg+=A({...ALEX,x:780,y:1010,s:.64,look:[-12,6],mouth:'smile',reachL:lid>.5?[-300,-560]:[-360,-600]});
  fg+=A({...VEC5S,x:1000,y:1010,s:.6,look:[-12,4],brows:'up',mouth:'o'});
  let o=cam(bg+fg,lerp(1.04,1.45,k),lerp(540,560,k),lerp(640,700,k),540,600);
  if(lid>.5) o+=`<g transform="translate(540,600) scale(${lerp(1.04,1.45,k).toFixed(3)}) translate(${-lerp(540,560,k)},${-lerp(640,700,k)})">`+[0,1,2].map(i=>{const p=(t*.8+i/3)%1;return `<rect x="370" y="${(600+p*120).toFixed(0)}" width="240" height="6" fill="#bfe8ff" opacity="${(.6*(1-p)).toFixed(2)}"/>`}).join('')+`</g>`;
  if(t>E.six) o+=countPop('+6 L',300,480,130,t-E.six,BLUE);
  return o;};

S.valve=(t,D,B)=>{const E=EVS.valve(B), turn=eIO(prog(t,E.open,E.open+.5)), flow=prog(t,E.water-.15,E.water+.2), lvl=clamp(prog(t,E.water,D+.6))*.75;
  const k=eIO(prog(t,E.open-.4,E.open+.4))*(1-eIO(prog(t,E.water-.1,E.water+.5)));
  const TX=760, TY=200, TS=.95, [sx,sy]=termoSpout(TX,TY,TS);
  let bg=galeria(t,{tx:TX,wx:90,wall:'#cfdcd6',cur:'#c96a4a',seed:6})+washer(230,1010,.9,t);
  let fg=termoK(TX,TY,TS,t,{valve:turn});
  if(flow>0){fg+=`<path d="M${sx-10},${sy} L${sx+10},${sy} L${sx+16},${lerp(sy,880,flow).toFixed(0)} L${sx-16},${lerp(sy,880,flow).toFixed(0)}Z" fill="#6cc6ff" opacity=".9"/><path d="M${sx-3},${sy} L${sx-5},${lerp(sy,880,flow).toFixed(0)}" stroke="#dff4ff" stroke-width="4"/>`;
    fg+=particles(t,'sparks',{x0:sx-60,x1:sx+60,y0:870,y1:890,n:12,col:'#bfe6ff'});}
  fg+=bucketK(sx,1010,.95,lvl,{col:'#e0b04a'});
  const happy=t>E.water+.2;
  fg+=crowd([{c:SON,kid:true,mouth:happy?'laugh':'line',eyes:happy?'happy':'open',brows:happy?null:'worried',look:[10,-2],reachR:happy?[40,-620]:null},{c:DAUGHTER,kid:true,mouth:happy?'laugh':'line',eyes:happy?'happy':'open',brows:happy?null:'worried',look:[10,-2],reachL:happy?[-40,-620]:null}],{y:1010,s:.62,x0:140,x1:330});
  fg+=A({...VEC5S,x:600,y:1010,s:.64,look:happy?[-10,-4]:[12,10],brows:happy?'up':'worried',mouth:happy?'laugh':'line',eyes:happy?'happy':'open',reachR:happy?null:[230,-600]});
  let o=focusCam(bg,fg,k,sx,sy-20,{z0:1.04,z1:2.2});
  if(flow>0&&t<E.water+1) o+=bang(880,640,'¡FSSSH!',BLUE,P(t,E.water,.12),76);
  if(happy) o+=tag(760,460,'80 LITROS',GREEN,P(t,E.water+.2,.2));
  return o;};

S.boil=(t,D,B)=>{const E=EVS.boil(B);
  if(t<E.boil-.15){ // where does it come from? germs under the magnifier
    const z=prog(t,E.where-.5,E.where), dis=t>E.dis;
    let bg=kitchen(t,{fridge:0,note:true});
    let fg=A({...ALEX,x:330,y:1010,s:.66,look:[10,-2],brows:'worried',mouth:'line',reachR:[180,-470],reachL:[200,-460]});
    fg+=potK(330+.66*190,1010-.66*430,.8,1,{col:'#7a838d'})+`<ellipse cx="${330+.66*190}" cy="${1010-.66*430-88}" rx="70" ry="12" fill="#b8c8a8"/>`;
    fg+=shepherd(120,1010,.4,t,{dir:1,alert:.6,head:10,seed:9});
    let o=cam(bg+fg,lerp(1.04,1.1,prog(t,0,D)),520,640,540,600);
    if(z>0){const R=170*eBack(clamp(z)), cx=770, cy=430, id=uid('mg');
      o+=`<g><circle cx="${cx}" cy="${cy}" r="${(R+16).toFixed(0)}" fill="#2a2e36"/><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R.toFixed(0)}"/></clipPath><g clip-path="url(#${id})"><rect x="${cx-200}" y="${cy-200}" width="400" height="400" fill="#b8d8a8"/>`;
      for(let i=0;i<5;i++) o+=germ(cx-110+i*55,cy-60+((i*37)%120),.85,t,i);
      if(dis) o+=`<rect x="${cx-200}" y="${cy-200}" width="400" height="400" fill="#6cc6ff" opacity="${(.5*prog(t,E.dis,E.dis+.4)).toFixed(2)}"/>`;
      o+=`</g><path d="M${cx-R*.7},${cy+R*.7} L${cx-R*1.25},${cy+R*1.25}" stroke="#2a2e36" stroke-width="30" stroke-linecap="round"/><circle cx="${cx-50}" cy="${cy-60}" r="30" fill="#fff" opacity=".25"/></g>`;
      if(dis) o+=xMark(cx,cy,1.1,prog(t,E.dis,E.dis+.3));}
    if(t>E.where-.5&&!dis) o+=bang(930,280,'¿?',YEL,P(t,E.where-.4,.15),110);
    return o;}
  if(t<E.drops+.1){ // boil it one minute, on the balcony
    const fr=clamp(prog(t,E.boil,E.drops)*1.2);
    let s=balconyBg(t)+`<rect x="320" y="880" width="320" height="16" fill="#6a4a30"/><rect x="340" y="896" width="12" height="160" fill="#5a3e24"/><rect x="608" y="896" width="12" height="160" fill="#5a3e24"/>`+campStove(480,880,1.2,t);
    s+=potK(480,800,.9,1);
    for(let i=0;i<7;i++){const p=(t*2.2+i/7)%1;s+=`<circle cx="${(420+i*20).toFixed(0)}" cy="${(700-p*30).toFixed(0)}" r="${(6+p*8).toFixed(0)}" fill="#dff4ff" opacity="${(1-p).toFixed(2)}"/>`;}
    for(let i=0;i<4;i++){const p=(t*.9+i/4)%1;s+=`<path d="M${420+i*40},${(680-p*220).toFixed(0)} q24,-30 0,-60 q-24,-30 0,-60" stroke="#fff" stroke-width="12" fill="none" opacity="${(.55*(1-p)).toFixed(2)}" stroke-linecap="round"/>`;}
    s+=A({...ALEX,x:800,y:1030,s:.64,look:[-12,4],mouth:'line',reachL:[-200,-400]});
    let o=cam(s,lerp(1.02,1.12,prog(t,E.boil,E.drops)),560,700,540,620);
    o+=stopwatch(300,470,.72,fr,YEL);
    if(t>E.minute) o+=countPop('1 MIN',300,650,84,t-E.minute,YEL);
    return o;}
  // bleach: two drops per litre, wait half an hour
  const T1=E.drops+.3, T2=E.drops+.75, d1=t>T1, d2=t>T2, ok=t>E.nop;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#d8c8b0"/>`+decorWall({floor:null,paper:'dots',paperOp:.04,items:[['frame',620,240,.8,{pic:'land'}],['clock',940,280,.7,{stopped:true,h:12.55,m:33}],['shelf',40,420,.8,{w:220,seed:4}]]});
  s+=`<rect x="-600" y="960" width="2280" height="800" fill="#8a6448"/><rect x="-600" y="960" width="2280" height="24" fill="#6a4a30"/>`;
  s+=literBottle(720,1040,.9,{open:true})+bleachK(330,1040,1,{ok});
  const dy=prog(t,E.bleach-.2,E.bleach+.4);
  const out=eIO(prog(t,E.wait-.3,E.wait+.3));
  s+=`<g transform="translate(720,${(560-dy*20-out*500).toFixed(0)})"><rect x="-14" y="-60" width="28" height="90" rx="6" fill="#dff2ff" opacity=".7" stroke="#9fc6dc" stroke-width="4"/><rect x="-22" y="-120" width="44" height="64" rx="18" fill="#c23a3a"/><path d="M-6,30 L0,56 L6,30Z" fill="#dff2ff"/></g>`;
  for(const [on,ts] of [[d1,T1],[d2,T2]]){if(!on) continue;const p=prog(t,ts,ts+.45);if(p<1) s+=`<ellipse cx="720" cy="${(620+p*110).toFixed(0)}" rx="10" ry="15" fill="#fff6c0" stroke="#d8c060" stroke-width="3"/>`;else s+=`<ellipse cx="720" cy="${(745+(ts===T1?0:6))}" rx="${(10+prog(t,ts+.45,ts+1)*40).toFixed(0)}" ry="6" fill="none" stroke="#fff" stroke-width="3" opacity="${(1-prog(t,ts+.45,ts+1)).toFixed(2)}"/>`;}
  s+=handIn(750,450-out*500,-35,.8);
  let o=cam(s,lerp(1.38,1.3,prog(t,E.drops,D)),540,800,540,600);
  if(d1&&t<E.wait) o+=countPop(d2?'2 GOTAS':'1 GOTA',330,470,90,t-(d2?T2:T1),YEL);
  if(ok&&t<E.wait) o+=tag(300,580,'SIN PERFUME',GREEN,P(t,E.nop,.2));
  if(t>E.wait-.1){o+=stopwatch(780,330,.75,clamp(prog(t,E.wait,D)*1.4),BLUE);if(t>E.half) o+=countPop('30 MIN',780,500,90,t-E.half,BLUE);}
  return o;};

S.storm=(t,D,B)=>{const E=EVS.storm(B), st=clamp(.4+prog(t,0,E.thunder)*.6), fl=t>E.thunder&&t<E.thunder+.5&&Math.sin((t-E.thunder)*40)>-.3;
  let s=balconyBg(t,{storm:st});
  if(t>E.thunder&&t<E.thunder+.45) s+=`<path d="M720,-60 L640,160 L700,170 L600,420 L680,430 L560,700" stroke="#fff6c0" stroke-width="14" fill="none" stroke-linejoin="round"/><path d="M720,-60 L640,160 L700,170 L600,420 L680,430 L560,700" stroke="#fff" stroke-width="5" fill="none"/>`;
  s+=particles(t,'rain',{op:.3*st,n:40});
  s+=shepherd(760,1040,.44,t,{dir:-1,alert:1,head:30,bark:t>E.thunder+.1&&t<E.thunder+.6,seed:9});
  s+=A({...ALEX,x:420,y:1040,s:.66,look:[6,-14],brows:t>E.thunder?'up':null,eyes:t>E.thunder?'wide':'open',mouth:t>E.thunder?'o':'line'});
  let o=cam(s,lerp(1.0,1.08,prog(t,0,D)),540,620,540,600,t>E.thunder?shake(t,1-prog(t,E.thunder,E.thunder+.6),9):0);
  if(fl) o+=`<rect x="0" y="0" width="1080" height="1100" fill="#fff" opacity=".55"/>`;
  o+=bang(540,330,'¡BRRROOOM!',YEL,P(t,E.thunder,.12),96);
  return o;};

S.rain=(t,D,B)=>{const E=EVS.rain(B), wet=prog(t,E.rain-.3,E.rain+.5);
  const fill=(t0)=>clamp(prog(t,t0,D+1)*1.2);
  let s=balconyBg(t,{storm:.85})+particles(t,'rain',{op:.4+.5*wet,n:60+Math.round(50*wet)});
  if(t<E.l2-.2){ // Álex puts out the first pot as the rain starts
    s+=potK(560,1020,1.1,wet>.5?.2:0);
    s+=shepherd(880,1030,.44,t,{dir:-1,alert:.8,head:12,seed:9});
    s+=A({...ALEX,x:420,y:1030,s:.68,look:[12,10],mouth:'smile',reachR:[200,-300],reachL:[180,-300]});
    s+=particles(t,'rain',{op:.8*wet,n:40,y0:-200,y1:1100});
    let o=cam(s,lerp(1.1,1.04,prog(t,0,E.l2)),540,700,540,620);
    if(t>E.collect) o+=tag(760,440,'RECOGE TODO',GREEN,P(t,E.collect,.2));
    return o;}
  // wide: pots, buckets, plastic sheet funnelling into the barreño
  const pa=P(t,E.pots,.25), pb=P(t,E.buckets,.25), pl=eOut(prog(t,E.plastic-.2,E.plastic+.5)), str=prog(t,E.plastic+.4,E.plastic+.8);
  const k=eIO(prog(t,E.bar-.3,E.bar+.6));
  let bg=s;
  let fg='';
  if(pl>0){const qx=lerp(120,640,pl), lx=lerp(150,880,pl), ly=lerp(720,905,pl);
    fg+=`<path d="M120,705 L${qx},705 Q${lerp(200,760,pl)},${lerp(720,820,pl)} ${lx},${ly} Q${lerp(140,520,pl)},${lerp(715,860,pl)} 120,705Z" fill="#3a7ad8" opacity=".85" stroke="#1f4f9a" stroke-width="6" stroke-linejoin="round"/>`;
    for(let i=1;i<4;i++) fg+=`<path d="M${lerp(120,qx,i/4)},708 Q${lerp(lerp(140,520,pl),lerp(200,760,pl),i/4)},${lerp(760,850,pl*i/4)} ${lx},${ly}" stroke="#9ac8ff" stroke-width="4" fill="none" opacity=".6"/>`;
    fg+=`<path d="M100,690 l40,30 M${qx-20},690 l40,30" stroke="#e0b04a" stroke-width="6"/>`;
    fg+=`<circle cx="120" cy="705" r="9" fill="#c23a3a"/><circle cx="${lerp(120,640,pl)}" cy="705" r="9" fill="#c23a3a"/>`;
    for(let i=0;i<4;i++){const p=(t*1.5+i/4)%1;fg+=`<circle cx="${lerp(300,850,p).toFixed(0)}" cy="${lerp(740,895,p).toFixed(0)}" r="6" fill="#dff4ff" opacity="${(pl*.8).toFixed(2)}"/>`;}}
  if(str>0) fg+=`<path d="M872,905 L888,905 L892,${lerp(905,980,str).toFixed(0)} L868,${lerp(905,980,str).toFixed(0)}Z" fill="#6cc6ff"/>`;
  fg+=barreno(880,1040,.9,str>0?fill(E.plastic+.6)*.8:0,t);
  if(pa>0) fg+=`<g opacity="${pa}">${potK(140,1000,.8,fill(E.pots))}${potK(420,1060,.75,fill(E.pots),{col:'#c23a3a'})}</g>`;
  if(pb>0) fg+=`<g opacity="${pb}">${bucketK(280,990,.75,fill(E.buckets)*.7)}${bucketK(620,1050,.7,fill(E.buckets)*.7,{col:'#e0b04a'})}</g>`;
  fg+=A({...ALEX,x:560,y:1000,s:.6,look:pl>0?[14,4]:[-10,8],mouth:'smile',reachR:pl>0&&pl<1?[200,-560]:null});
  fg+=shepherd(1000,1080,.4,t,{dir:-1,alert:.8,head:-6,seed:9});
  fg+=particles(t,'rain',{op:.7,n:30});
  let o=focusCam(bg,fg,k,880,960,{z0:1.02,z1:1.8});
  if(t>E.plastic&&k<.3) o+=tag(700,440,'PLÁSTICO = EMBUDO',BLUE,P(t,E.plastic,.2));
  return o;};

S.bruno=(t,D,B)=>{const E=EVS.bruno(B), lap=t>E.drink-.2;
  let bg=balconyBg(t,{storm:.8})+A({...ALEX,x:840,y:1060,s:.66,look:[-12,10],eyes:'happy',mouth:'laugh'});
  let fg=`<g transform="translate(540,1180) scale(2.2)">${barreno(0,0,1,.85,t)}</g>`;
  const dip=lap?4*Math.sin(t*12):0;
  fg+=`<g transform="translate(330,${640+dip}) rotate(${35+dip}) scale(2)"><path d="M-160,40 Q-120,-30 -40,-20 L20,40 Q-40,120 -160,140Z" fill="${GSD.body}"/><path d="M-160,40 Q-120,-30 -40,-20 L-20,0 Q-80,-6 -150,60Z" fill="${GSD.black}"/>${a1DogHead(0,0,{eyes:lap?'closed':'open'})}${lap?`<path d="M96,22 q${(6+6*Math.sin(t*12)).toFixed(1)},30 22,26 q4,-12 -4,-26Z" fill="#e0607a"/>`:''}</g>`;
  if(lap) for(let i=0;i<4;i++){const p=(t*2+i/4)%1;fg+=`<circle cx="${(480+Math.sin(i*2.3)*60*p).toFixed(0)}" cy="${(800-Math.sin(p*Math.PI)*60).toFixed(0)}" r="7" fill="#bfe6ff" opacity="${(1-p).toFixed(2)}"/>`;}
  fg+=particles(t,'rain',{op:.6,n:30});
  let o=focusCam(bg,fg,.55,520,700,{z0:1.0,z1:1.15,bars:false});
  o+=bang(780,380,'¡LAP, LAP!',BLUE,P(t,E.drink+.1,.12),70);
  return o;};

S.grey=(t,D,B)=>{const E=EVS.grey(B);
  let bg=bathroom(t,{level:.3})+`<rect x="880" y="520" width="16" height="200" fill="#9aa3ad"/><rect x="860" y="560" width="70" height="120" rx="10" fill="#6cc6ff"/><circle cx="160" cy="640" r="34" fill="#f3f3f6" stroke="#c9d2d6" stroke-width="6"/><rect x="140" y="560" width="40" height="60" fill="#9aa3ad"/>`+dPlant(80,880,.8);
  bg+=`<rect x="330" y="540" width="320" height="34" rx="10" fill="#e9eef0"/>`;
  if(t<E.l2-.2){ // bottle over the toilet → big NO
    const no=prog(t,E.never,E.never+.3);
    let fg=A({...ALEX,x:780,y:1010,s:.64,look:[-12,8],eyes:no>0?'wide':'open',mouth:no>0?'o':'line',reachL:[-300,-480]});
    fg+=`<g transform="translate(${780-.64*300},${1010-.64*480}) rotate(${(lerp(0,-100,eOut(prog(t,.2,E.never-.2)))*(1-no*.6)).toFixed(1)})">${bottleK(0,0,1.1,.9)}</g>`;
    let o=cam(bg+fg,lerp(1.04,1.12,prog(t,0,E.l2)),540,700,540,600,no>0?shake(t,1-prog(t,E.never,E.never+.4),6):0);
    o+=xMark(560,560,1,no);
    if(t>E.wc) o+=tag(540,860,'NUNCA AL VÁTER',PINK,P(t,E.wc,.2));
    return o;}
  // grey water from the mop bucket into the bowl
  const pour=eIO(prog(t,E.chain-.4,E.chain+.4)), flow=t>E.chain;
  bg+=`<g transform="translate(980,1010)"><path d="M-80,0 L-70,-160 L70,-160 L80,0Z" fill="#3a8ad8"/></g><path d="M1010,860 L1100,300" stroke="#c9a050" stroke-width="12"/>`;
  let fg=A({...ALEX,x:760,y:1010,s:.64,look:[-12,8],mouth:'line',reachL:[-250,-520],reachR:[-170,-400]});
  fg+=`<g transform="translate(${760-.64*230},${1010-.64*480}) rotate(${(-70*pour).toFixed(1)})">${bucketK(0,80,.8,.7,{grey:true,col:'#c23a3a'})}</g>`;
  if(flow) fg+=`<path d="M${760-.64*230-90},${1010-.64*480+20} Q490,700 490,780" stroke="#8a8f86" stroke-width="${(24*clamp(prog(t,E.chain,E.chain+.3))).toFixed(1)}" fill="none" stroke-linecap="round"/>`+particles(t,'sparks',{x0:430,x1:550,y0:770,y1:790,n:10,col:'#c9ccc0'});
  let o=cam(bg+fg,lerp(1.06,1.14,prog(t,E.l2,D)),560,720,540,600);
  if(t>E.mop) o+=tag(720,460,'AGUA DE FREGAR',GREEN,P(t,E.mop,.2));
  if(flow&&t<E.mop) o+=bang(300,520,'¡GLUG!',BLUE,P(t,E.chain+.1,.12),70);
  return o;};

S.gift=(t,D,B)=>{const E=EVS.gift(B), op=eOut(prog(t,0,.5)), kb=eIO(prog(t,E.bruno-.3,E.bruno+.6));
  const give=eIO(prog(t,E.bruno-.2,E.bruno+.4));
  let bg=landing(t,{night:true})+candle(960,860,.9,t);
  let fg=kid({...SON,x:250,y:1010,s:.66*KS,look:[10,-2],eyes:'happy',mouth:'smile'})+kid({...DAUGHTER,x:830,y:1010,s:.66*KS,look:[-10,-2],eyes:'happy',mouth:'smile'});
  fg+=A({...VEC5S,x:480,y:1010,s:.66,look:[8,6],mouth:t>E.bottles?'smile':'line',eyes:t>E.bottles?'happy':'open',reachR:[160,-480],reachL:[-140,-460]});
  fg+=bottleK(480-.66*140,1010-.66*400,.9,1);
  const bx=lerp(480+.66*160,640,give), by=lerp(1010-.66*420,980,give);
  fg+=bottleK(bx,by,.9,1)+(give>.6?`<g transform="translate(${bx},${by-60})"><circle r="16" fill="#ffd34a"/><circle cx="-16" cy="-18" r="8" fill="#ffd34a"/><circle cx="0" cy="-24" r="8" fill="#ffd34a"/><circle cx="16" cy="-18" r="8" fill="#ffd34a"/></g>`:'');
  fg+=shepherd(760,1040,.44,t,{dir:-1,alert:1,head:give>.5?-10:14,wag:t>E.bruno-.3,tongue:t>E.bruno,seed:9});
  fg+=A({...ALEX,x:980,y:1060,s:.7,look:[-12,2],mouth:t>E.bottles?'smile':'line'});
  fg+=dark(.45,[[540,700,520,520],[960,820,220,220]]);
  let o=focusCam(bg,fg,kb,700,880,{z0:1.04,z1:1.8});
  if(t>E.bottles&&t<E.bruno-.3) o+=countPop('2 BOTELLAS',540,330,96,t-E.bottles,BLUE);
  if(t>E.bruno) o+=tag(540,330,'PARA BRUNO',YEL,P(t,E.bruno,.2));
  return o;};

S.portal=(t,D,B)=>{const E=EVS.portal(B), sm=prog(t,E.smell-.3,E.smell+.3), wx=lerp(160,460,eIO(prog(t,0,E.smell)));
  let bg=portalBg(t);
  let fg=stink(560,1000,t,.4+.6*sm,5,300)+stink(900,700,t,.3+.5*sm,3,260);
  fg+=shepherd(wx+260,1010,.42,t,{dir:1,walk:sm<.5?t*9:null,alert:.6,head:sm>.5?-24:8,seed:9});
  fg+=A({...ALEX,x:wx,y:1010,s:.66,walk:sm<.5?t*7:null,look:[10,-2],brows:'worried',eyes:sm>.5?'closed':'open',mouth:sm>.5?'o':'line',reachR:[150,-420],reachL:sm>.5?[40,-640]:null});
  fg+=candle(wx+.66*150,1010-.66*400,.7,t,1.4);
  if(sm>.3) fg+=flies(wx+120,560,t,4,70);
  fg+=dark(.62,[[wx+100,700,380,380]]);
  let o=cam(bg+fg,lerp(1.02,1.1,prog(t,0,D)),540,700,540,600);
  o+=bang(820,380,'¡PUAJ!',GREEN,P(t,E.smell,.12),84);
  return o;};

S.end=(t,D,B)=>{const E=EVS.end(B);
  if(t<E.l2-.2){ // the whole building at night, every flat without a flush
    const lit=(i,j)=>((i*5+j*3)%4===0?.7:0);
    let s=street(t,{night:true,lit});
    for(const [x,y] of [[60,320],[300,260],[500,420],[700,330],[880,480],[180,560],[620,600]]) s+=stink(x,y,t+x*.01,.75,3,160);
    s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#3a6a2a" opacity="${(.12+.1*prog(t,0,D)).toFixed(2)}"/>`;
    let o=cam(s,lerp(1.0,1.1,prog(t,0,E.l2)),540,520,540,560);
    if(t>E.chain-.2) o+=iconCard(540,600,prog(t,E.chain-.2,E.chain+.15),`<g transform="translate(0,-14) scale(.5)"><rect x="-70" y="-120" width="140" height="80" rx="10" fill="#f3f3f6"/><path d="M-90,-30 L90,-30 L70,40 Q0,80 -70,40Z" fill="#f3f3f6"/><rect x="-40" y="40" width="80" height="40" fill="#e9eef0"/></g><path d="M-60,-70 L60,50 M60,-70 L-60,50" stroke="#ff3e6c" stroke-width="12" stroke-linecap="round"/>`,'SIN CADENA',PINK);
    return o;}
  // Álex at his window, candle in hand, the green haze outside
  const k=eIO(prog(t,E.l2,E.danger+.3));
  let bg=flat(t,{on:0,night:true,clock:''})+`<rect x="700" y="250" width="260" height="380" fill="#3a6a2a" opacity=".35"/>`+stink(830,600,t,.8,3,220);
  let fg=A({...ALEX,x:560,y:1010,s:.68,look:[12,-4],brows:'worried',eyes:t>E.danger?'wide':'open',mouth:t>E.danger?'o':'line',reachR:[140,-420]})+candle(560+.68*140,1010-.68*410,.7,t,1.3);
  fg+=dogLie(860,1050,.34,t,{dir:-1,head:.6,eyes:'open'});
  if(t>E.danger) fg+=sweat(560,1010,.68,t);
  fg+=dark(.55,[[650,760,360,360]]);
  let o=focusCam(bg,fg,k,560,faceY(1010,.68),{z0:1.04,z1:2.1});
  if(t>E.danger){o+=germ(220,380,1.4,t,0)+germ(880,300,1.1,t,2)+germ(820,840,1.2,t,4);o+=tag(800,620,'INFECCIONES',PINK,P(t,E.danger,.2));}
  return o;};

window.CFG={steps:['1. BUSCA EL AGUA DE CASA','2. DESINFÉCTALA','3. RECOGE LA LLUVIA','4. LA QUE BEBES, NO AL VÁTER'],listEnd:'gift',
  band:{hook:'#3a2818',pumps:'#4a4a42',three:'#b8b0a4',door:'#3a2a20',kids:'#4a463e',better:'#3a2a20',termo:'#5a5048',valve:'#4a5450',boil:'#3a2818',storm:'#1d2230',rain:'#3a2a20',bruno:'#2a3040',grey:'#5a6468',gift:'#1d1f26',portal:'#1a1a1e',end:'#11131a'}};

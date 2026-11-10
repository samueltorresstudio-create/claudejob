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


// ---------- key times per scene (scene-relative) ----------
const EVS={
  hook:B=>({pay:B[0].w[8]}),
  back:B=>({out:B[0].w[6]}),
  walkie:B=>({drop:B[0].w[5],talk:B[0].w[11],voice:B[1].s,dog:B[1].w[4]}),
  reveal:B=>({mapa:B[0].w[6],heli:B[0].w[12]}),
  alley:B=>({duque:B[0].w[4],rule:B[1].s}),
  fight:B=>({hit:B[0].w[1],fall:B[0].w[8],flee:B[0].w[11],limp:B[0].w[12],wag:B[0].w[15]}),
  radio:B=>({on:B[0].w[1],alert:B[0].w[6],wave:B[0].w[11],heli:B[1].s,h22:B[2].w[0],km:B[2].w[2],bag:B[2].w[6]}),
  cars:B=>({water:B[1].w[1],can:B[1].w[5],lighter:B[1].w[10]}),
  fire:B=>({night:B[1].s,fire:B[1].w[9]}),
  sleep:B=>({head:B[1].w[3],tomorrow:B[1].w[7]}),
  sea:B=>({clock:B[0].w[3],ret:B[0].w[7]}),
};
const S={};

// ---------- cast ----------
const P6LUCIA={skin:'#c98c64',hs:'pigtails',hair:'#3a2418',top:'#8a6aa8',topD:'#6a4a88',pants:'#3a3a4a',shoes:'#3a332c',seed:61};
const P6MOM={skin:'#c98c64',hs:'bun',hair:'#3a2a24',top:'#6a7a8a',topD:'#4a5a6a',pants:'#2a2e38',shoes:'#3a332c',seed:88};
const P6RED={...RUBEN};
const P6DARK={...RUBEN,skin:'#b98058',top:'#3a3f4e',topD:'#2a2e3a',jacket:'#3a3f4e',hair:'#2a2420',hs:'short',seed:31};

// ---------- props ----------
const p6Crate=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-70" y="-120" width="140" height="120" fill="#a8844f"/><rect x="-70" y="-120" width="140" height="120" fill="none" stroke="#6a5030" stroke-width="6"/><path d="M-70,-120 L70,0 M70,-120 L-70,0" stroke="#7a5e38" stroke-width="5"/></g>`;
const p6Alley=t=>{ // the back of the supermarket: wall, pipes, a vent, the back door, a dumpster, puddles
  let s=skyTod('afternoon');
  s+=`<rect x="-600" y="180" width="2280" height="740" fill="#cfc3ad"/><rect x="-600" y="180" width="2280" height="18" fill="#000" opacity=".12"/>`;
  for(let i=0;i<6;i++) s+=`<rect x="${-400+i*360}" y="240" width="300" height="12" fill="#000" opacity=".05"/>`;
  s+=`<rect x="960" y="180" width="22" height="740" fill="#8a8f99"/><rect x="950" y="700" width="42" height="18" fill="#6a6f79"/>`;
  s+=`<rect x="430" y="300" width="160" height="90" fill="#9aa3ad"/>`;
  for(let i=0;i<5;i++) s+=`<line x1="440" y1="${312+i*16}" x2="580" y2="${312+i*16}" stroke="#6a737d" stroke-width="5"/>`;
  s+=doorK(100,480,200,420,{open:.75,col:'#6a737d',dark:'#0c0b0a'});
  s+=`<rect x="680" y="760" width="250" height="140" rx="8" fill="#2f5a4a"/><rect x="672" y="748" width="266" height="20" fill="#1f3f33"/>`;
  s+=`<rect x="-600" y="900" width="2280" height="700" fill="#6a6258"/>`;
  s+=`<ellipse cx="560" cy="1010" rx="180" ry="18" fill="#8aa0ac" opacity=".35"/><ellipse cx="220" cy="1060" rx="120" ry="12" fill="#8aa0ac" opacity=".3"/>`;
  s+=p6Crate(360,900,.9)+p6Crate(1040,900,1.0);
  return s};
const walkieBig=(x,y,s,t,on)=>{
  let g=`<rect x="-80" y="-170" width="160" height="320" rx="24" fill="#2a2e36"/><rect x="40" y="-290" width="20" height="130" rx="8" fill="#1d2026"/>`;
  g+=`<rect x="-50" y="-140" width="100" height="50" rx="8" fill="${on?'#a8f0c0':'#33403a'}"/>`;
  if(on) g+=`<text x="0" y="-104" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="24" fill="#1a3a20">CH 3</text>`;
  for(let i=0;i<5;i++) g+=`<line x1="-50" y1="${-60+i*20}" x2="50" y2="${-60+i*20}" stroke="#14161c" stroke-width="8" stroke-linecap="round"/>`;
  g+=`<circle cx="50" cy="-150" r="8" fill="${on&&Math.floor(t*4)%2?'#3aff6a':'#1a3a22'}"/><rect x="-96" y="-60" width="16" height="80" rx="6" fill="#1d2026"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`};
const heliIcon=(x,y,s,t,col='#e9e4d8')=>`<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="70" ry="40" fill="${col}"/><rect x="50" y="-10" width="120" height="16" fill="${col}"/><rect x="160" y="-34" width="12" height="40" fill="${col}"/><line x1="${(-110*Math.cos(t*30)).toFixed(1)}" y1="-52" x2="${(110*Math.cos(t*30)).toFixed(1)}" y2="-52" stroke="${col}" stroke-width="8" stroke-linecap="round"/><rect x="-4" y="-52" width="8" height="14" fill="${col}"/><rect x="-40" y="-20" width="50" height="30" rx="8" fill="#6cc6ff"/><line x1="-50" y1="48" x2="50" y2="48" stroke="${col}" stroke-width="6"/><line x1="-30" y1="36" x2="-30" y2="48" stroke="${col}" stroke-width="5"/><line x1="30" y1="36" x2="30" y2="48" stroke="${col}" stroke-width="5"/></g>`;
const p6Polaroid=(cx,cy,o,a,rot)=>{ // an instant photo pinned to the board
  if(a<=0) return '';
  const id=uid('pol'), k=eBack(clamp(a));
  return `<g transform="translate(${cx},${cy}) rotate(${rot}) scale(${k.toFixed(3)}) translate(${-cx},${-cy})"><rect x="${cx-120}" y="${cy-130}" width="240" height="280" fill="#f3eee6"/><clipPath id="${id}"><rect x="${cx-105}" y="${cy-115}" width="210" height="210"/></clipPath><rect x="${cx-105}" y="${cy-115}" width="210" height="210" fill="#9aa3ad"/><g clip-path="url(#${id})">${A({...o,x:cx,y:cy-10+650*.5,s:.5,mouth:'smile',brows:'angry',look:[0,0]})}</g><circle cx="${cx}" cy="${cy-122}" r="10" fill="#d42a2a"/></g>`};
const tinFound=`<rect x="-36" y="-56" width="72" height="62" rx="8" fill="#c9c2b0"/><rect x="-36" y="-42" width="72" height="28" fill="#3f86b8"/><text x="0" y="-21" text-anchor="middle" font-family="Inter" font-weight="900" font-size="18" fill="#fff">ATÚN</text>`;
const lighterFound=t=>`<rect x="-16" y="-60" width="32" height="70" rx="6" fill="#ff8a2a"/><rect x="-14" y="-76" width="28" height="18" fill="#9aa3ad"/><path d="M0,-80 Q-12,-100 0,-${(118+6*Math.sin(t*14)).toFixed(0)} Q12,-100 0,-80Z" fill="#ffd76a"/>`;
const p6Found=(x,y,svg,a)=>a<=0?'':`<g transform="translate(${x},${y}) scale(${eBack(clamp(a)).toFixed(3)})"><circle cx="0" cy="-30" r="78" fill="#11131f" fill-opacity=".85" stroke="#fff" stroke-width="4"/>${svg}</g>`;
const p6Fire=(x,y,k,t)=>{ // a fire the size of a hand: stones, flames, sparks
  let s='';
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;s+=`<ellipse cx="${(x+Math.cos(a)*46).toFixed(0)}" cy="${(y+Math.sin(a)*14).toFixed(0)}" rx="16" ry="10" fill="#5a5a60"/>`;}
  s+=`<path d="M${x-30},${y} L${x+30},${y-8} M${x-26},${y-8} L${x+26},${y}" stroke="#5a3a26" stroke-width="10" stroke-linecap="round"/>`;
  if(k<=0) return s;
  const h=(70+12*Math.sin(t*13)+8*Math.sin(t*7.3))*k, w=26*k;
  s+=`<circle cx="${x}" cy="${y-30}" r="${(240*k).toFixed(0)}" fill="url(#glowY)" opacity="${(.7*k).toFixed(2)}"/>`;
  s+=`<path d="M${x-w},${y-4} Q${x-w*1.2},${y-h*.5} ${x+Math.sin(t*9)*6},${y-h} Q${x+w*1.2},${y-h*.5} ${x+w},${y-4}Z" fill="#ff8a2a"/>`;
  s+=`<path d="M${x-w*.5},${y-4} Q${x-w*.6},${y-h*.35} ${x+Math.sin(t*11)*4},${y-h*.65} Q${x+w*.6},${y-h*.35} ${x+w*.5},${y-4}Z" fill="#ffd76a"/>`;
  for(let i=0;i<4;i++){const p=(t*.8+i/4)%1;s+=`<circle cx="${(x+Math.sin(i*2+t*3)*20).toFixed(1)}" cy="${(y-h-p*120).toFixed(1)}" r="3" fill="#ffd76a" opacity="${(k*(1-p)).toFixed(2)}"/>`;}
  return s};
const p6Slope=(t,n)=>{ // the mountain path at dusk/night: sky, moon, stars, slope, pines
  let s=skyTod('dusk')+`<g opacity="${n.toFixed(2)}">${skyNight(t)}${stars(4,70,600,t,.9)}${moonK(840,260)}</g>`;
  s+=`<path d="M-600,760 Q200,640 1680,560 L1680,1600 L-600,1600Z" fill="#14281e"/>`;
  for(const [x,y,k] of [[-60,820,1.1],[120,790,.8],[880,640,.9],[1010,620,1.2],[760,660,.7]]) s+=pine(x,y,k,'#10221a');
  s+=`<path d="M-600,920 Q300,880 1680,880 L1680,1600 L-600,1600Z" fill="#1f3a2a"/>`;
  for(const [x,y,k] of [[-120,1000,1.5],[1100,960,1.6]]) s+=pine(x,y,k,'#0c1a12');
  return s};

// ---------- the countdown in the HUD ----------
const p6Clock=sec=>{sec=Math.max(0,Math.floor(sec));return [Math.floor(sec/3600),Math.floor(sec/60)%60,sec%60].map(v=>String(v).padStart(2,'0')).join(':')};

// ---------- scenes ----------
S.hook=(t,D,B)=>{const E=EVS.hook(B), wk=prog(t,0,D);
  let s=skyT(.85)+townRow(760,21,{sc:.9,cols:['#6a7078','#5a6068','#7a8088','#4a5058','#626870']});
  s+=waveWall(t,820,lerp(160,380,eIO(wk)),{seed:4});
  s+=`<rect x="-600" y="820" width="2280" height="800" fill="#3a3a38"/>`;
  s+=`<rect x="-600" y="700" width="2280" height="900" fill="#000" opacity=".35"/>`;
  s+=A({...P6DARK,x:180,y:1030,s:.6,look:[6,-2],brows:'angry',mouth:'smile'});
  s+=A({...P6MOM,x:400,y:1030,s:.6,look:[4,-2],brows:'angry',mouth:'smile'});
  s+=A({...P6LUCIA,x:600,y:1030,s:.5,look:[-4,-2],brows:'angry',mouth:'smile'});
  s+=A({...P6RED,x:840,y:1030,s:.6,look:[-6,-2],brows:'angry',mouth:'smile'});
  let o=cam(s,lerp(1.0,1.1,eIO(wk)),540,700,540,600);
  if(t>E.pay) o+=tag(540,450,'NO TE FÍES DE NADIE',PINK,P(t,E.pay,.2));
  return o;};

S.back=(t,D,B)=>{const E=EVS.back(B), k=eOut(prog(t,E.out-.6,D));
  let s=p6Alley(t);
  s+=A({...P6MOM,x:lerp(200,560,k),y:1010,s:.6,walk:k<1?t*7:null,look:[10,-2],mouth:'line'});
  s+=A({...P6LUCIA,x:lerp(120,720,k),y:1010,s:.5,walk:k<1?t*8:null,look:[10,-2],mouth:'line'});
  s+=A({...MARCO,x:lerp(80,340,k),y:1010,s:.6,walk:k<1?t*7:null,look:[10,-4],brows:'worried',mouth:'line'});
  return cam(s,1.05,480,640,540,560);};

S.walkie=(t,D,B)=>{const E=EVS.walkie(B);
  if(t<E.talk-.2){ // walking out; the walkie drops from the mother's pocket
    let s=p6Alley(t);
    const fall=prog(t,E.drop,E.drop+.45), wy=lerp(880,1000,eIn(fall));
    s+=A({...P6MOM,x:620,y:1010,s:.6,walk:t*6,look:[10,-2],mouth:'line'});
    s+=A({...P6LUCIA,x:780,y:1010,s:.5,walk:t*7,look:[10,-2],mouth:'line'});
    if(t>E.drop) s+=`<g transform="translate(600,${wy.toFixed(0)}) rotate(${(fall*80).toFixed(0)}) scale(.28)">${walkieBig(0,0,1,t,false)}</g>`;
    s+=A({...MARCO,x:380,y:1010,s:.6,look:t>E.drop?[10,8]:[10,-4],brows:'worried',mouth:t>E.drop?'o':'line'});
    let o=cam(s,1.05,520,700,540,560);
    if(t>E.drop) o+=tag(540,300,'WALKIE-TALKIE',YEL,P(t,E.drop,.2));
    return o;}
  // close-up: the walkie in Marco's hand, the voice of one of the men
  const on=t>E.talk;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#6a6258"/><rect x="-600" y="-900" width="2280" height="1800" fill="#cfc3ad" opacity=".55"/>`;
  s+=`<circle cx="540" cy="620" r="460" fill="url(#glowY)" opacity=".25"/>`;
  s+=`<path d="M1300,1400 L760,880" stroke="${MARCO.top}" stroke-width="150" stroke-linecap="round"/>`;
  s+=walkieBig(540,640,1.6,t,on);
  s+=`<ellipse cx="640" cy="860" rx="90" ry="70" fill="${MARCO.skin}"/>`;
  if(on) s+=soundArcs(460,560,t,'#a8f0c0',-1)+soundArcs(620,560,t,'#a8f0c0',1);
  let o=cam(s,lerp(1,1.08,prog(t,E.talk,D)),540,640,540,560,t>E.dog?shake(t,1-prog(t,E.dog,E.dog+.5),4):0);
  if(t>E.dog) o+=tag(540,1000,'TIENEN A DUQUE',PINK,P(t,E.dog,.2));
  return o;};

S.reveal=(t,D,B)=>{const E=EVS.reveal(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#6a4a2e"/>`;
  const r=rng(77);for(let i=0;i<120;i++) s+=`<circle cx="${(r()*1080).toFixed(0)}" cy="${(r()*1300).toFixed(0)}" r="${(2+r()*3).toFixed(1)}" fill="#4a321e" opacity=".5"/>`;
  const pins=[[250,420,P6MOM,-6,.2],[830,420,P6LUCIA,5,.5],[250,860,P6RED,4,.8],[830,860,P6DARK,-4,1.1]];
  const ctr=[540,640];
  for(const [x,y,,,d] of pins){const a=prog(t,d+.5,d+1.1);if(a>0) s+=`<line x1="${x}" y1="${y-122}" x2="${lerp(x,ctr[0],a).toFixed(0)}" y2="${lerp(y-122,ctr[1],a).toFixed(0)}" stroke="#d42a2a" stroke-width="6"/>`;}
  const ma=prog(t,E.mapa-.2,E.mapa+.3);
  if(ma>0) s+=`<g transform="translate(540,640) scale(${(.34*eBack(clamp(ma))).toFixed(3)}) translate(-540,-580)">${mapCard(t,1)}</g>`;
  for(const [x,y,o,rot,d] of pins) s+=p6Polaroid(x,y,o,prog(t,d,d+.4),rot);
  if(t>E.heli) s+=heliIcon(540,980,1.1*eBack(clamp(prog(t,E.heli,E.heli+.4))),t);
  return cam(s,lerp(1.0,1.06,prog(t,0,D)),540,640,540,560);};

S.alley=(t,D,B)=>{const E=EVS.alley(B), rule=t>B[1].s;
  const mk=eOut(prog(t,0,1.4)), sneak=eIO(prog(t,B[1].s,D));
  let s=p6Alley(t);
  const dx=620;
  s+=leash(dobCollar(dx,1000,.46,1),[972,820],30);
  s+=doberman(dx,1000,.46,t,{alert:1,head:-6,bark:Math.sin(t*6)>.6,seed:9});
  s+=A({...P6RED,x:470,y:1010,s:.6,look:[12,-4],brows:'angry',mouth:'line'});
  s+=A({...P6DARK,x:820,y:1010,s:.6,look:[-12,-4],brows:'angry',mouth:'line'});
  s+=A({...MARCO,x:rule?lerp(200,350,sneak):lerp(-120,200,mk),y:1010,s:.6,walk:(mk<1||(rule&&sneak<1))?t*(rule?4:10):null,look:[12,-4],brows:'angry',mouth:'line'});
  let o=cam(s,1.05,480,660,540,560);
  if(t>E.duque&&!rule) o+=tag(540,450,'DUQUE, ATADO',PINK,P(t,E.duque,.2));
  if(rule) o+=tag(540,450,'DE ESPALDAS',YEL,P(t,B[1].s+.3,.2));
  return o;};

S.fight=(t,D,B)=>{const E=EVS.fight(B);
  const lunge=eOut(prog(t,E.hit-.25,E.hit)), back=eIO(prog(t,E.hit+.2,E.hit+.8));
  const flee=eIn(prog(t,E.flee,E.flee+1.2)), limp=eIO(prog(t,E.limp,E.limp+1.6));
  let s=p6Alley(t);
  const dx=lerp(620,470,limp);
  if(t<E.limp) s+=leash(dobCollar(dx,1000,.46,1),[972,820],30);
  else s+=`<path d="M972,820 Q960,860 948,880" stroke="#7a3a2a" stroke-width="5" fill="none"/>`;
  const lim=t>E.limp?Math.abs(Math.sin(t*5))*7:0;
  s+=`<g transform="translate(0,${(-lim).toFixed(1)})">`+doberman(dx,1000,.46,t,{dir:t>E.limp?-1:1,walk:(limp>0&&limp<1)?t*6:null,alert:.7,head:-4,wag:t>E.wag,seed:9})+`</g>`;
  if(t<E.fall) s+=A({...P6RED,x:470+lunge*20,y:1010,s:.6,look:[12,-4],brows:t>E.hit?'worried':'angry',mouth:t>E.hit?'o':'line',eyes:t>E.hit?'wide':'open'});
  else s+=lying({...P6RED,x:600,y:1010,s:.6,eyes:'closed',mouth:'o'},.6);
  s+=A({...P6DARK,x:lerp(820,1320,flee),y:1010,s:.6,walk:flee>0&&flee<1?t*14:null,look:t>E.hit?[12,-4]:[-12,-4],eyes:t>E.hit?'wide':'open',brows:'worried',mouth:t>E.hit?'o':'line'});
  s+=A({...MARCO,x:lerp(350,400,lunge)-30*back,y:1010,s:.6,look:[12,-4],brows:'angry',mouth:'line',reachR:lunge>0&&back<1?[180,-430]:null});
  let o=cam(s,1.05,500,660,540,560,shake(t,1-prog(t,E.hit,E.hit+.5),9));
  o+=bang(500,540,'¡PAM!',PINK,P(t,E.hit,.1)*(1-P(t,E.hit+.9,1.2)),90);
  if(t>E.flee&&t<E.limp) o+=tag(540,450,'UNO HUYE',PINK,P(t,E.flee,.2));
  if(t>E.limp) o+=tag(540,450,'DUQUE, LIBRE',GREEN,P(t,E.limp,.2));
  return o;};

S.radio=(t,D,B)=>{const E=EVS.radio(B), on=t>E.on, al=t>E.alert, h=t>E.heli;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a2622"/><circle cx="540" cy="620" r="460" fill="url(#glowY)" opacity=".45"/>`;
  if(al) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#ff2a2a" opacity="${(Math.sin(t*9)>0?.16:.05).toFixed(2)}"/>`;
  const up=eIO(prog(t,B[2].s-.2,B[2].s+.4));
  s+=radioBig(540,lerp(640,560,up),lerp(1.25,.9,up),t,on);
  if(al&&!h) s+=`<g transform="translate(540,420)"><rect x="-300" y="-46" width="600" height="80" rx="10" fill="#d42a2a"/><text x="0" y="10" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="#fff">⚠ ALERTA DE TSUNAMI</text></g>`;
  if(t>E.wave&&!h) s+=`<g opacity=".9"><clipPath id="rw"><rect x="200" y="860" width="680" height="200" rx="16"/></clipPath><rect x="200" y="860" width="680" height="200" rx="16" fill="#9fc6dc"/><g clip-path="url(#rw)">${waveWall(t,1060,lerp(40,170,prog(t,E.wave,E.wave+1.2)),{seed:3})}</g></g>`;
  if(h&&up<.5) s+=heliIcon(540,350,1.1,t)+`<text x="540" y="1010" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#ffd34a">MAÑANA · 12:00</text>`;
  let o=cam(s,1.0,540,620,540,560);
  if(t>E.h22) o+=countPop('22 H',220,1010,92,t-E.h22,YEL);
  if(t>E.km) o+=countPop('14 KM',540,1010,92,t-E.km,PINK);
  if(t>E.bag) o+=`<g transform="translate(860,1030) scale(${(.5*eBack(clamp(prog(t,E.bag,E.bag+.4)))).toFixed(3)})">${bagOpen(0,0,1,0)}</g><text x="860" y="1100" text-anchor="middle" font-family="Inter" font-weight="900" font-size="36" fill="#fff" opacity="${P(t,E.bag,.3)}">VACÍA</text>`;
  return o;};

S.cars=(t,D,B)=>{const E=EVS.cars(B), reach=Math.sin(t*3)*30;
  let s=streetRuin(t,0);
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#ffb070" opacity=".08"/>`;
  s+=carK(760,1010,1.7,'#8a9aa8');
  s+=`<path d="M590,880 L470,840 L470,990 L590,1000Z" fill="#7a8a98"/><path d="M500,870 L570,890 L570,930 L500,915Z" fill="#26304a"/>`;
  s+=doberman(230,1000,.44,t,{alert:.7,head:6,wag:t>E.water,seed:9});
  s+=A({...MARCO,x:440,y:1010,s:.6,look:[12,2],brows:t>E.water?null:'worried',mouth:t>E.water?'smile':'line',reachR:[200,-300+reach]});
  let o=cam(s,1.05,520,660,540,560);
  o+=p6Found(300,470,`<g transform="scale(.8)">${ITEMS.water}</g>`,prog(t,E.water,E.water+.35));
  o+=p6Found(470,470,`<g transform="scale(.8)">${ITEMS.water}</g>`,prog(t,E.water+.25,E.water+.6));
  o+=p6Found(640,470,tinFound,prog(t,E.can,E.can+.35));
  o+=p6Found(810,470,lighterFound(t),prog(t,E.lighter,E.lighter+.35));
  return o;};

S.fire=(t,D,B)=>{const E=EVS.fire(B), n=prog(t,E.night-.4,E.night+1.4), k=eOut(prog(t,E.fire,E.fire+.8));
  let s=p6Slope(t,n);
  s+=`<ellipse cx="370" cy="950" rx="110" ry="52" fill="#4a4a50"/>`;
  s+=A({...MARCO,x:370,y:1010,s:.6,sit:true,look:[12,8],brows:'worried',mouth:'line',reachR:k<1&&t>E.fire-.6?[160,-140]:null});
  s+=doberman(720,1000,.44,t,{dir:-1,alert:.3,head:-12,seed:9});
  s+=p6Fire(540,1000,k,t);
  s+=dark(.55*n,[[540,960,340,260]]);
  let o=cam(s,lerp(1.0,1.08,prog(t,0,D)),540,700,540,600);
  if(t>E.fire) o+=tag(540,450,'DEL TAMAÑO DE UNA MANO',YEL,P(t,E.fire,.2));
  return o;};

S.sleep=(t,D,B)=>{const E=EVS.sleep(B), hk=eIO(prog(t,E.head-.4,E.head+.6));
  let s=p6Slope(t,1);
  s+=p6Fire(900,1000,.45,t);
  s+=lying({...MARCO,x:690,y:1000,s:.6,eyes:'closed',mouth:'line'},.6);
  s+=doberman(lerp(200,280,hk),1000,.44,t,{dir:1,alert:0,head:lerp(-6,-30,hk),seed:9});
  s+=dark(.42,[[560,950,460,280]]);
  let o=cam(s,lerp(1.05,1.2,eIO(prog(t,0,D))),520,900,540,640);
  if(t>E.tomorrow) o+=heliIcon(540,380,.8,t,'#ffd34a')+tag(540,480,'MAÑANA: EVACUACIÓN',YEL,P(t,E.tomorrow,.2));
  return o;};

S.sea=(t,D,B)=>{const E=EVS.sea(B), rk=eIO(prog(t,E.ret,E.ret+6)), shore=lerp(800,620,rk);
  let s=skyTod('dawn')+`<circle cx="760" cy="470" r="70" fill="#ffd9a0"/><circle cx="760" cy="470" r="240" fill="url(#glowY)"/>`;
  s+=sea(t,520,shore,{col:'#4a7a98'});
  s+=`<rect x="-600" y="${shore.toFixed(1)}" width="2280" height="${(820-shore).toFixed(1)}" fill="#8a7a5a"/>`;
  if(rk>.1){const r=rng(5);for(let i=0;i<10;i++){const fx=-100+r()*1300, fy=lerp(shore,810,r());s+=fish(fx,fy,.9,t,i);}}
  s+=townRow(900,7,{sc:.55,cols:['#8a8478','#7a746a','#9a9488','#6a645a','#8a8070']});
  s+=`<path d="M-600,980 Q300,900 1680,940 L1680,1600 L-600,1600Z" fill="#14281e"/>`;
  for(const [x,y,k] of [[-80,1040,1.3],[1080,1000,1.4],[980,1020,.9]]) s+=pine(x,y,k,'#0c1a12');
  s+=`<g transform="translate(380,1080) scale(.5)">${lying({...MARCO,x:0,y:0,s:.6,eyes:'closed',mouth:'line'},.6)}${doberman(150,0,.44,t,{dir:-1,alert:0,head:-28,seed:9})}</g>`;
  let o=cam(s,lerp(1.0,1.12,eIO(prog(t,0,D+4))),540,640,540,560);
  if(t>E.clock) o+=`<text x="540" y="360" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="130" fill="#ff4a6a" stroke="#000" stroke-width="10" paint-order="stroke" opacity="${P(t,E.clock,.3)}">05:12</text>`;
  if(t>E.ret+.6) o+=tag(540,470,'EL MAR SE RETIRA',PINK,P(t,E.ret+.6,.2));
  return o;};

// HUD: from the radio onwards, the countdown to the last helicopter (noon tomorrow)
window.CFG={steps:['1. ATACA AL QUE TE DA LA ESPALDA','2. BUSCA EN LOS COCHES','3. FUEGO PEQUEÑO','4. DUERME CON TU PERRO'],listEnd:'sea',
  hud:(h,bt,st,T)=>{
    const sc=n=>BEATS.find(b=>b.sc===n).start;
    const K=[[BEATS[9].start,22*3600],[sc('cars'),21.5*3600],[sc('fire'),15*3600],[sc('sleep'),12.5*3600],[sc('sea'),6.8*3600],[TOTAL,6.8*3600-120]];
    let v=K[0][1];
    for(let i=0;i<K.length-1;i++) if(T>=K[i][0]&&T<=K[i+1][0]){v=lerp(K[i][1],K[i+1][1],prog(T,K[i][0],K[i+1][0]));break;}
    if(T>K[K.length-1][0]) v=K[K.length-1][1];
    return 'HELICÓPTERO · '+p6Clock(v);},
  band:{hook:'#2a2e34',back:'#5a4e3e',walkie:'#5a4e3e',reveal:'#4a321e',alley:'#5a4e3e',fight:'#5a4e3e',radio:'#2a2622',cars:'#5a4e3e',fire:'#14281e',sleep:'#0c1a12',sea:'#14281e'}};

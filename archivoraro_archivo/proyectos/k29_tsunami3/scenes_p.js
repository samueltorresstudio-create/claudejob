// ---------- key times per scene (scene-relative) ----------
const EVS={
  intro:B=>({rob:B[0].w[7],alive:B[1].w[9]}),
  recap:B=>({water:B[0].w[5],food:B[0].w[7],duque:B[0].w[10],whistle:B[1].s,two:B[1].w[3],bark:B[1].w[9]}),
  back:B=>({limp:B[0].w[2],teeth:B[0].w[5],red:B[0].w[10],jacket:B[1].w[2],thieves:B[1].w[7]}),
  step1:B=>({lobby:B[1].s,gas:B[1].w[1],sewer:B[1].w[2],glass:B[1].w[6],sip:B[1].w[8]}),
  step2:B=>({bath:B[1].s,open:B[1].w[1],tank:B[1].w[3],clean:B[1].w[9],ten:B[1].w[11]}),
  step3:B=>({}),
  street:B=>({paint:B[0].w[4],hour:B[0].w[9],walk:B[1].s,cars:B[1].w[4],boat:B[1].w[9]}),
  step4:B=>({radio:B[0].w[4]}),
  radio:B=>({safe:B[0].w[1],mount:B[0].w[4],heli:B[0].w[9],h72:B[0].w[11],km:B[1].s,hurt:B[1].w[5]}),
  market:B=>({shop:B[0].w[5],food:B[0].w[6],shutter:B[1].w[3],painted:B[1].w[6],words:B[1].w[9]}),
  end:B=>({sniff:B[0].w[1],growl:B[0].w[8],thieves:B[1].w[2],inside:B[1].w[4]}),
};
const S={};
const ROOFY=1005;
const icon=(k,x,y,a,x_)=>{ // round icon with a red cross over it
  if(a<=0) return '';const g={water:ITEMS.water,food:`<rect x="-36" y="-80" width="72" height="90" rx="10" fill="#c9c2b0"/><rect x="-36" y="-56" width="72" height="40" fill="#c23a3a"/><ellipse cx="0" cy="-80" rx="36" ry="10" fill="#e9e4d8"/>`,
    dog:`<g transform="scale(.42) translate(-180,240)">${doberman(0,0,1,0,{alert:1,still:true})}</g>`}[k];
  return `<g transform="translate(${x},${y}) scale(${eBack(a).toFixed(3)})"><circle cx="0" cy="-40" r="92" fill="#11131f" fill-opacity=".9" stroke="#fff" stroke-width="4"/><g transform="translate(0,${k==='dog'?-10:0})">${g}</g>${x_>0?`<path d="M-60,-100 L60,20 M60,-100 L-60,20" stroke="${PINK}" stroke-width="16" stroke-linecap="round" opacity="${clamp(x_*3)}"/>`:''}</g>`};
S.intro=(t,D,B)=>{ // alone on the roof: no bag, no dog
  const E=EVS.intro(B);
  let s=roofScene(t,{sky:'day',mud:true,hut:1});
  s+=`<rect x="400" y="${ROOFY-70}" width="90" height="70" rx="10" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="12 10" opacity=".7"/>`;
  s+=`<path d="M120,${ROOFY-4} Q170,${ROOFY-20} 230,${ROOFY-2} T330,${ROOFY-6}" stroke="#7a3a2a" stroke-width="6" fill="none"/>`;
  s+=A({...MARCO,x:300,y:ROOFY+5,s:.62,look:[Math.sin(t*1.2)*10,4],brows:'worried',mouth:'line'});
  const zk=eIO(prog(t,0,D));
  let o=cam(s,lerp(1.0,1.5,zk),lerp(540,330,zk),lerp(640,640,zk),540,560);
  if(t>E.rob) o+=tag(540,380,'SIN MOCHILA · SIN DUQUE',PINK,P(t,E.rob,.2));
  return o;
};
S.recap=(t,D,B)=>{ // no water, no food, no Duque; he whistles... and a bark answers from the street
  const E=EVS.recap(B), wh=t>E.whistle&&t<E.bark;
  let s=roofScene(t,{sky:'day',mud:true,hut:1});
  s+=A({...MARCO,x:420,y:ROOFY+5,s:.62,look:t>E.bark?[8,8]:[0,-2],eyes:t>E.bark?'wide':'open',brows:'worried',mouth:wh?'o':'line',reachR:wh?[44,-585]:null});
  if(wh) s+=soundArcs(500,620,t,'#fff',1);
  if(t>E.bark) s+=bang(820,860,'¡GUAU!',YEL,P(t,E.bark,.15),80)+soundArcs(820,900,t,YEL,-1);
  let o=cam(s,1.06,540,650,540,560,t>E.bark?shake(t,1-prog(t,E.bark,E.bark+.6),5):0);
  if(t<E.whistle+.3){const out=1-P(t,E.whistle,.3);
    o+=`<g opacity="${out}">`+icon('water',260,400,prog(t,E.water-.3,E.water),prog(t,E.water,E.water+.4))+icon('food',540,400,prog(t,E.food-.3,E.food),prog(t,E.food,E.food+.4))+icon('dog',820,400,prog(t,E.duque-.3,E.duque),prog(t,E.duque,E.duque+.4))+`</g>`;}
  return o;
};
S.back=(t,D,B)=>{ // Duque comes back limping with a strip of red cloth in his teeth
  const E=EVS.back(B);
  if(t<B[1].s){
    let s=roofScene(t,{sky:'day',mud:true,hut:1});
    const k=prog(t,0,E.teeth+.2), dx=lerp(880,600,eOut(k)), lim=Math.abs(Math.sin(t*5))*8;
    s+=SA({...MARCO,x:300,y:ROOFY+5,s:.62,look:[11,2],eyes:'open',brows:null,mouth:k>.6?'smile':'o',reachR:k>.8?[200,-260]:null});
    s+=`<g transform="translate(0,${(-lim).toFixed(1)}) rotate(${(Math.sin(t*5)*3).toFixed(1)} ${dx} ${ROOFY})">`+doberman(dx,ROOFY-5,.52,t,{dir:-1,walk:k<1?t*6:null,alert:.5,head:-4,seed:8})+`</g>`;
    s+=redRag(dx-.52*250,ROOFY-5-.52*300-lim,.7,20);
    let o=cam(s,lerp(1.05,1.35,eIO(prog(t,E.teeth-.4,E.teeth+.6))),lerp(560,560,1),lerp(650,760,eIO(prog(t,E.teeth-.4,E.teeth+.6))),540,560);
    if(t>E.limp&&t<E.teeth) o+=tag(540,450,'COJEANDO',YEL,P(t,E.limp,.2));
    if(t>E.red) o+=tag(540,450,'TELA ROJA',PINK,P(t,E.red,.2));
    return o;
  }
  // the cloth in Marco's hand; a flash of the man in the red jacket
  const st=t-B[1].s;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a2622"/><circle cx="540" cy="640" r="420" fill="url(#glowY)"/>`;
  s+=`<g transform="translate(540,700)"><circle cx="-60" cy="60" r="90" fill="${MARCO.skin}"/><circle cx="60" cy="70" r="80" fill="${MARCO.skin}"/>${redRag(0,0,4.4,-8)}</g>`;
  const fl=P(t,E.jacket-.2,.25);
  if(fl>0) s+=`<g opacity="${fl}"><circle cx="820" cy="380" r="170" fill="#e9e4d8"/><clipPath id="flc"><circle cx="820" cy="380" r="160"/></clipPath><g clip-path="url(#flc)">${A({...RUBEN,x:820,y:900,s:.8,look:[-6,0],brows:'angry',mouth:'line'})}</g><circle cx="820" cy="380" r="166" fill="none" stroke="${PINK}" stroke-width="8"/></g>`;
  let o=cam(s,1+.05*st,540,620,540,560);
  if(t>E.thieves) o+=tag(540,960,'UNO DE LOS LADRONES',PINK,P(t,E.thieves,.2));
  return o;
};
S.step1=(t,D,B)=>{ // the flooded lobby: petrol, sewage, glass. Not a single sip
  const E=EVS.step1(B);
  let s=lobby(t);
  const drink=t<E.sip?eIO(prog(t,.3,1.2)):1-eIO(prog(t,E.sip,E.sip+.4));
  s+=A({...MARCO,x:200,y:564,s:.55,look:[11,6],brows:'angry',mouth:t>E.sip-.4?'o':'line',reachR:t>E.sip-.5?[200,-200]:null});
  s+=doberman(400,640,.48,t,{alert:.6,head:lerp(0,-30,drink),seed:9});
  const lab=(at,x,y,txt)=>t>at?tag(x,y,txt,PINK,P(t,at,.2)):'';
  let o=cam(s,1.05,540,440,540,560);
  o+=lab(E.gas,800,560,'GASOLINA')+lab(E.sewer,800,630,'CLOACAS')+lab(E.glass,800,700,'CRISTALES');
  if(t>E.sip) o+=`<g opacity="${P(t,E.sip,.2)}"><circle cx="540" cy="460" r="70" fill="${PINK}"/><path d="M505,425 L575,495 M575,425 L505,495" stroke="#fff" stroke-width="14" stroke-linecap="round"/></g>`;
  return o;
};
S.step2=(t,D,B)=>{ // the cistern of a hotel bathroom: 10 litres of clean water
  const E=EVS.step2(B), lidOff=t>E.open;
  let s=bathroom(t,{lidOff,level:t>E.ten?lerp(1,.75,prog(t,E.ten,D)):1});
  if(lidOff) s+=`<rect x="720" y="${lerp(540,700,eOut(prog(t,E.open,E.open+.4)))}" width="40" height="320" rx="10" fill="#e9eef0" transform="rotate(-10 740 860)"/>`;
  const bot=t>E.clean;
  s+=A({...MARCO,x:820,y:1000,s:.62,look:[-11,8],brows:t>E.clean?null:'worried',mouth:t>E.clean?'smile':'line',reachL:lidOff?[-480,-560]:null});
  if(bot) s+=`<g transform="translate(560,640) scale(.7)">${ITEMS.water}</g>`;
  s+=doberman(140,1000,.48,t,{alert:.8,head:6,wag:t>E.clean,seed:9});
  let o=cam(s,1.04,540,640,540,560);
  if(t>E.tank&&t<E.clean) o+=tag(540,450,'CISTERNA',YEL,P(t,E.tank,.2));
  if(t>E.clean&&t<E.ten) o+=tag(540,450,'AGUA LIMPIA',BLUE,P(t,E.clean,.2));
  if(t>E.ten) o+=countPop('10 L',540,470,120,t-E.ten,GREEN);
  return o;
};
const SPRAY=(x,y)=>`<g transform="translate(${x},${y}) rotate(20)"><rect x="-14" y="-40" width="28" height="70" rx="6" fill="#ff8a2a"/><rect x="-8" y="-52" width="16" height="14" fill="#3a3e4a"/></g>`;
S.step3=(t,D,B)=>{ // painting the first arrow
  let s=streetRuin(t,0);
  const a=prog(t,.2,D+.3);
  s+=sprayArrow(380,520,1.1,a,'08:10');
  s+=A({...MARCO,x:240,y:1000,s:.6,look:[11,-6],mouth:'line',reachR:[260,-760+Math.sin(t*4)*20]});
  s+=SPRAY(240+.6*260,1000-.6*760+Math.sin(t*4)*12)+doberman(80,1000,.45,t,{alert:.6,seed:9});
  return cam(s,1.25,420,620,540,560);
};
S.street=(t,D,B)=>{ // arrows on every corner; the street is a car cemetery, a boat on a roof
  const E=EVS.street(B), walking=t>E.walk-.3, sc=walking?(t-E.walk+.3)*120:0;
  let s=streetRuin(t,sc);
  if(!walking){s+=sprayArrow(380,520,1.1,1,'08:10')+sprayArrow(740,480,.9,prog(t,E.paint-.3,E.hour+.4),'08:25');
    s+=A({...MARCO,x:620,y:1000,s:.6,look:[11,-6],mouth:'line',reachR:[230,-760+Math.sin(t*4)*20]})+SPRAY(620+.6*230,1000-.6*760+Math.sin(t*4)*12)+doberman(430,1000,.45,t,{alert:.6,seed:9});}
  else {s+=sprayArrow(380-sc*.6,520,1.1,1,'08:10');
    const lim=Math.abs(Math.sin(t*5))*6;
    s+=A({...MARCO,x:420,y:1010,s:.58,walk:t*7,look:[10,-4],brows:'worried',mouth:'line'});
    s+=`<g transform="translate(0,${(-lim).toFixed(1)})">`+doberman(640,1000,.45,t,{walk:t*6,alert:.5,head:-4,seed:9})+`</g>`;
    if(t>E.boat) s+=brackets(470-sc*.2,110,420,220,BLUE);}
  let o=cam(s,1.0,540,600,540,560);
  if(walking&&t>E.cars&&t<E.boat) o+=tag(540,450,'CEMENTERIO DE COCHES',PINK,P(t,E.cars,.2));
  if(t>E.boat) o+=tag(540,450,'UN BARCO EN EL TEJADO',BLUE,P(t,E.boat,.2));
  return o;
};
function carDash(t,on,o={}){ // inside an abandoned car full of mud: the dashboard radio still has battery
  let s=skyTod('day')+`<rect x="-600" y="-900" width="2280" height="2400" fill="none"/>`;
  s+=`<rect x="-200" y="250" width="380" height="500" fill="#c9b8a2"/><rect x="200" y="320" width="320" height="430" fill="#d9c6ae"/><rect x="560" y="280" width="420" height="470" fill="#bfae98"/>`;
  for(let i=0;i<9;i++) s+=`<rect x="${-160+i*130}" y="${360+(i%3)*90}" width="60" height="70" fill="#7a9cb8" opacity=".8"/>`;
  s+=`<rect x="-600" y="600" width="2280" height="12" fill="#6a5a44" opacity=".6"/><rect x="-600" y="700" width="2280" height="400" fill="#7a6a50"/>`;
  s+=`<g transform="translate(760,700) rotate(-12)">${carK(0,0,.7,'#c23a3a',0)}</g>`;
  // windshield frame + cracks + mud
  s+=`<path d="M-600,-900 L1680,-900 L1680,150 Q540,90 -600,150Z" fill="#1d1f26"/><path d="M-600,150 L-80,150 L-20,760 L-600,760Z M1680,150 L1160,150 L1100,760 L1680,760Z" fill="#1d1f26"/>`;
  s+=`<path d="M300,300 L360,380 L330,460 M360,380 L460,400 L520,360 M360,380 L380,500" stroke="#e9eef0" stroke-width="3" fill="none" opacity=".7"/>`;
  s+=`<path d="M-20,560 Q200,520 400,600 Q600,660 820,580 Q980,540 1100,600 L1100,760 L-20,760Z" fill="#6a5a40" opacity=".55"/>`;
  // dashboard
  s+=`<path d="M-600,720 Q540,640 1680,720 L1680,1600 L-600,1600Z" fill="#2a2c34"/><path d="M-600,720 Q540,640 1680,720" stroke="#3a3c46" stroke-width="16" fill="none"/>`;
  s+=`<path d="M-600,760 Q540,690 1680,760" stroke="#7a6a50" stroke-width="10" fill="none" opacity=".5"/>`;
  s+=`<circle cx="160" cy="980" r="250" fill="none" stroke="#14151a" stroke-width="44"/><rect x="140" y="760" width="40" height="240" fill="#14151a" transform="rotate(-30 160 980)"/>`;
  // radio in the centre console
  s+=`<rect x="440" y="760" width="320" height="200" rx="16" fill="#14151a"/><rect x="470" y="784" width="260" height="70" rx="8" fill="${on?'#a8f0c0':'#2a3a30'}"/>`;
  if(on) s+=`<text x="600" y="834" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="40" fill="#1a3a20">FM 98.4</text><rect x="470" y="784" width="260" height="70" rx="8" fill="#a8f0c0" opacity="${(.15+.1*Math.sin(t*9)).toFixed(2)}"/>`;
  s+=`<circle cx="510" cy="910" r="30" fill="#3a3c46"/><circle cx="690" cy="910" r="30" fill="#3a3c46"/><line x1="690" y1="910" x2="${(690+Math.cos(o.knob??0)*22).toFixed(1)}" y2="${(910+Math.sin(o.knob??0)*22).toFixed(1)}" stroke="#c9c2b0" stroke-width="6"/>`;
  for(let i=0;i<4;i++) s+=`<rect x="${560+i*24}" y="${885+(on?Math.sin(t*20+i)*3:0)}" width="14" height="50" rx="4" fill="#2a2c34"/>`;
  if(on) s+=soundArcs(780,860,t,'#a8f0c0',1)+soundArcs(420,860,t,'#a8f0c0',-1);
  // Marco's hand on the knob; Duque's head from the passenger seat
  if(o.hand!==false) s+=`<path d="M1300,1300 L${700+40},${930}" stroke="${MARCO.top}" stroke-width="90" stroke-linecap="round"/><circle cx="705" cy="925" r="38" fill="${MARCO.skin}"/>`;
  s+=`<g transform="translate(980,1120)">${doberman(0,0,.9,t,{dir:-1,alert:on?1:.6,head:on?8:0,seed:9})}</g>`;
  return s}
S.step4=(t,D,B)=>{ // Marco's small pocket radio (the big one was in the stolen bag)
  const E=EVS.step4(B), on=t>E.radio;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#3a3630"/><circle cx="540" cy="620" r="460" fill="url(#glowY)" opacity=".6"/>`;
  s+=radioBig(540,640,1.25,t,on);
  return cam(s,lerp(1,1.08,prog(t,0,D)),540,620,540,560);
};
S.radio=(t,D,B)=>{ // the voice on the radio; then the map: 14 km with a hurt dog
  const E=EVS.radio(B);
  if(t<E.km-.1){
    let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#3a3630"/><circle cx="540" cy="620" r="460" fill="url(#glowY)" opacity=".6"/>`;
    s+=radioBig(540,700,1.0,t,true);
    let o=cam(s,1.0,540,620,540,560);
    if(t>E.mount) o+=tag(540,420,'MONTE SAN TELMO',GREEN,P(t,E.mount,.2));
    if(t>E.h72) o+=countPop('72 H',540,1000,110,t-E.h72,YEL);
    return o;
  }
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a2622"/>`+mapCard(t,eIO(prog(t,E.km-.1,E.km+1.4)));
  let o=cam(s,1.0,540,580,540,560);
  o+=countPop('14 KM',540,470,90,t-E.km,PINK);
  if(t>E.hurt) o+=tag(540,960,'CON UN PERRO HERIDO',PINK,P(t,E.hurt,.2));
  return o;
};
S.market=(t,D,B)=>{ // a supermarket on the way... with three words sprayed on the shutter
  const E=EVS.market(B);
  let s=supermarket(t,{shut:.84,graffiti:prog(t,E.words-.2,E.words+1.0)});
  const k=eOut(prog(t,0,E.food+.4));
  s+=A({...MARCO,x:lerp(-80,250,k),y:1010,s:.58,walk:k<1?t*7:null,look:[10,-4],brows:t>E.shutter?'worried':null,mouth:'line'});
  s+=doberman(lerp(-280,60,k),1000,.45,t,{walk:k<1?t*6:null,alert:t>E.shutter?1:.5,seed:9});
  const zk=eIO(prog(t,E.shutter-.3,E.painted+.4));
  let o=cam(s,lerp(1.0,1.25,zk),lerp(540,560,zk),lerp(620,560,zk),540,560);
  if(t>E.food&&t<E.shutter) o+=tag(540,450,'COMIDA PARA SEMANAS',GREEN,P(t,E.food,.2));
  return o;
};
S.end=(t,D,B)=>{ // Duque smells the red cloth and growls at the shutter. A red sleeve under it
  const E=EVS.end(B), gr=t>E.growl;
  const hand=eOut(prog(t,E.thieves-.4,E.inside));
  const inside=hand>0?`<rect x="${lerp(620,560,hand)}" y="806" width="200" height="40" fill="#8a2a2a"/><circle cx="${lerp(600,545,hand)}" cy="826" r="22" fill="#d6a07a"/><path d="M${lerp(585,530,hand)},812 L${lerp(560,505,hand)},800 M${lerp(582,527,hand)},826 L${lerp(552,497,hand)},826 M${lerp(585,530,hand)},840 L${lerp(560,505,hand)},852" stroke="#d6a07a" stroke-width="12" stroke-linecap="round"/><g opacity="${hand}"><ellipse cx="420" cy="836" rx="12" ry="7" fill="#ffd34a" opacity=".0"/></g>`:'';
  let s=supermarket(t,{shut:.84,graffiti:1,inside});
  s+=A({...MARCO,x:250,y:1010,s:.58,look:[10,0],eyes:gr?'wide':'open',brows:'worried',mouth:'line',reachR:t<E.growl?[200,-300]:null});
  if(t<E.growl) s+=redRag(250+.58*200,1010-.58*300,1.1,10);
  s+=doberman(320,1000,.48,t,{alert:gr?1:.6,head:gr?-6:-18,bark:gr&&Math.sin(t*9)>-.2,seed:9});
  if(gr) s+=bang(560,700,'GRRR...',PINK,P(t,E.growl,.15)*(1-P(t,E.thieves,.3)),58);
  const zk=eIO(prog(t,E.thieves-.5,D));
  return cam(s,lerp(1.1,2.8,zk),lerp(480,560,zk),lerp(640,820,zk),540,560);
};
window.CFG={steps:['1. ESE AGUA NO SE BEBE','2. AGUA DONDE NADIE MIRA','3. MARCA TU CAMINO','4. RADIO CADA HORA'],listEnd:'market',
  band:{intro:'#4a4844',recap:'#4a4844',back:'#3a342e',step1:'#4a4638',step2:'#5a6266',step3:'#5a4e3e',street:'#5a4e3e',step4:'#2a2622',radio:'#2a2622',market:'#5a4e3e',end:'#2a2622'}};

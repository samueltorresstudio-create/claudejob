// ---------- key times per scene (scene-relative) ----------
const EVS={
  intro:B=>({first:B[0].w[4],worst:B[1].w[1]}),
  recap:B=>({retire:B[0].w[13]}),
  door:B=>({open:B[0].w[7],mother:B[1].w[1],lucia:B[1].w[5],men:B[1].w[8],look:B[2].s,bag:B[2].w[8]}),
  step1:B=>({young:B[1].s,block:B[1].w[11]}),
  wave2:B=>({arrive:B[0].w[4],floor:B[0].w[9],roof:B[1].s,creak:B[1].w[2],scream:B[1].w[4],duque:B[1].w[6]}),
  step2:B=>({aft:B[1].s,give:B[1].w[5],men:B[1].w[8],see:B[1].w[12]}),
  step3:B=>({card:B[0].w[2]}),
  night:B=>({light:B[0].w[7],quiet:B[0].w[15],watch:B[1].s,three:B[1].w[7],doze:B[2].w[7]}),
  step4:B=>({tied:B[0].w[6],no:B[1].s,error:B[1].w[7]}),
  dawn:B=>({down:B[0].w[4],dump:B[0].w[9]}),
  end:B=>({gone:B[0].w[4],men:B[0].w[9],call:B[1].w[2],none:B[1].w[5]}),
};
const S={};
const ROOFY=1005;
S.intro=(t,D,B)=>{ // the sea pulls back again; far out, the second wave
  const E=EVS.intro(B), far=lerp(20,110,eIO(prog(t,0,D)));
  let s=roofScene(t,{sky:'day',ret:.85,flood:790,flood2:810,far,flow:120});
  s+=bagClosed(350,ROOFY,.42)+doberman(480,ROOFY-5,.52,t,{alert:1,head:10,bark:Math.sin(t*6)>.6,seed:8});
  s+=A({...MARCO,x:210,y:ROOFY+5,s:.62,look:[6,-10],eyes:'wide',brows:'worried',mouth:'o'});
  const zk=eIO(prog(t,E.worst-.6,D));
  let o=cam(s,lerp(1.05,1.55,zk),lerp(520,560,zk),lerp(640,470,zk),540,560,shake(t,.12,3));
  if(t>E.worst) o+=brackets(560,470,900,260,PINK)+tag(560,680,'OLA 2',PINK,P(t,E.worst,.2));
  return o;
};
S.recap=(t,D,B)=>{ // recap: the two of them on the roof of the hotel
  const E=EVS.recap(B);
  let s=roofScene(t,{sky:'day',ret:lerp(.85,.95,prog(t,0,D)),flood:lerp(790,820,prog(t,0,D)),flood2:830,far:lerp(110,140,prog(t,0,D)),flow:140,hut:0});
  s+=bagClosed(350,ROOFY,.42)+doberman(480,ROOFY-5,.52,t,{alert:1,head:8,seed:8});
  s+=A({...MARCO,x:210,y:ROOFY+5,s:.62,look:[8,-8],brows:'worried',mouth:'line'});
  let o=cam(s,lerp(1.25,1.0,eIO(prog(t,0,D*.7))),lerp(380,540,eIO(prog(t,0,D*.7))),lerp(760,640,eIO(prog(t,0,D*.7))),540,560);
  if(t<1.6) o+=tag(540,450,'ANTES: PARTE 1',YEL,P(t,.1,.2)*(1-P(t,1.3,.3)));
  if(t>E.retire) o+=tag(540,450,'EL MAR SE VA OTRA VEZ',PINK,P(t,E.retire,.2));
  return o;
};
S.door=(t,D,B)=>{ // the roof door opens: a mother and her daughter, two soaked men; one stares at the bag
  const E=EVS.door(B), open=eOut(prog(t,E.open-.3,E.open+.3));
  let s=roofScene(t,{sky:'day',ret:.95,flood:820,flood2:830,far:140,flow:30,hut:open});
  s+=bagClosed(350,ROOFY,.42)+doberman(480,ROOFY-5,.52,t,{alert:1,head:4,bark:t>E.open&&t<E.mother&&Math.sin(t*7)>.4,dir:1,seed:8});
  s+=A({...MARCO,x:210,y:ROOFY+5,s:.62,look:[11,-2],brows:t>E.look?'angry':'worried',mouth:'line'});
  const walk=(at,x1)=>{const k=prog(t,at-.4,at+.9);return [lerp(860,x1,eOut(k)),k>0&&k<1]};
  if(t>E.mother-.5){const [ex,ew]=walk(E.mother,660), [lx,lw]=walk(E.lucia-.2,580);
    s+=A({...ELENA,x:ex,y:ROOFY,s:.6,walk:ew?t*8:null,look:[-8,0],brows:'worried',mouth:'line'})+drips(ex,ROOFY-300,t,90,4,2);
    s+=kid({...LUCIA,x:lx,y:ROOFY+6,s:.6,walk:lw?t*9:null,look:[-8,-2],brows:'worried',mouth:'line'});}
  if(t>E.men-.5){const [rx,rw]=walk(E.men,880), [tx,tw]=walk(E.men+.5,1010);
    s+=A({...TONI,x:tx,y:ROOFY-4,s:.6,walk:tw?t*8:null,look:[-10,2],brows:'angry',mouth:'line'})+drips(tx,ROOFY-320,t,100,5,3);
    s+=A({...RUBEN,x:rx,y:ROOFY,s:.62,walk:rw?t*8:null,look:t>E.look?[-11,6]:[-8,0],brows:t>E.look?'angry':null,mouth:'line'})+drips(rx,ROOFY-320,t,100,5,4);}
  const zk=eIO(prog(t,E.look-.2,E.look+.8)), zb=eIO(prog(t,E.bag-.3,E.bag+.5));
  let o=cam(s,lerp(1.0,lerp(2.0,1.6,zb),zk),lerp(600,lerp(880,520,zb),zk),lerp(640,lerp(620,880,zb),zk),540,560);
  if(t>E.men&&t<E.look) o+=tag(540,450,'EMPAPADOS',BLUE,P(t,E.men,.2));
  if(t>E.bag) o+=tag(540,450,'LA MOCHILA',PINK,P(t,E.bag,.2));
  return o;
};
S.step1=(t,D,B)=>{ // the young one wants to go down for his car; Marco blocks the door
  const E=EVS.step1(B), mv=eIO(prog(t,E.young,E.block)), bl=eIO(prog(t,E.block-.6,E.block+.2));
  let s=roofScene(t,{sky:'day',ret:lerp(.95,.6,prog(t,0,D)),flood:820,flood2:830,far:lerp(140,220,prog(t,0,D)),flow:30,hut:1});
  s+=A({...ELENA,x:80,y:ROOFY,s:.6,look:[10,0],brows:'worried'})+kid({...LUCIA,x:170,y:ROOFY+6,s:.6,look:[10,-2],brows:'worried'});
  s+=A({...TONI,x:960,y:ROOFY-4,s:.6,look:[-8,0],brows:'angry'});
  s+=bagClosed(300,ROOFY,.42);
  const rx=lerp(520,700,mv), mx=lerp(380,820,bl);
  s+=A({...MARCO,x:mx,y:ROOFY+5,s:.62,walk:bl>0&&bl<1?t*10:null,aL:bl>.9?80:10,aR:bl>.9?80:10,look:[-10,0],brows:'angry',mouth:'line'});
  s+=A({...RUBEN,x:rx,y:ROOFY,s:.62,walk:mv>0&&mv<1?t*8:null,look:[10,0],brows:'angry',mouth:t>E.block?'o':'line',reachR:t<E.young?[150,-520]:null});
  s+=doberman(lerp(440,560,bl),ROOFY-5,.52,t,{alert:1,head:2,bark:t>E.block&&Math.sin(t*7)>.3,seed:8});
  let o=cam(s,1.08,540,650,540,560);
  if(t>E.young&&t<E.block) o+=tag(540,450,'«VOY A POR MI COCHE»',YEL,P(t,E.young,.2));
  if(t>E.block) o+=tag(540,450,'EL AGUA VUELVE',PINK,P(t,E.block,.2));
  return o;
};
S.wave2=(t,D,B)=>{ // the second wave climbs to the 8th floor; on the roof, Duque stands in front of Lucía
  const E=EVS.wave2(B);
  if(t<E.roof){ // side view of the hotel: the water climbs the facade
    const HX=310, HY=1000, lvl=lerp(1020,HY-8*190,eOut(prog(t,E.arrive-.6,E.floor+.4)));
    let s=skyT(.85)+townRow(1000,5,{sc:.9})+hotel(HX,HY)+waveWall(t,lvl+10,lerp(40,120,prog(t,0,E.roof)),{seed:3});
    s+=flood(t,lvl,{rough:true,debris:true,flow:220});
    for(let i=0;i<4;i++) s+=splash(HX+80+i*110,lvl,t,prog(t,E.arrive+i*.25,E.arrive+i*.25+1.2),1.6);
    const ry=HY-12*190;s+=A({...MARCO,x:HX+140,y:ry,s:.22})+A({...ELENA,x:HX+220,y:ry,s:.21})+A({...RUBEN,x:HX+330,y:ry,s:.22});
    if(t>E.floor) s+=`<line x1="${HX-200}" y1="${HY-8*190}" x2="${HX+700}" y2="${HY-8*190}" stroke="${PINK}" stroke-width="10" stroke-dasharray="30 20"/>`;
    let o=cam(s,.42,HX+280,-160,540,560,shake(t,.4,5));
    if(t>E.floor) o+=tag(540,450,'PLANTA 8',PINK,P(t,E.floor,.2));
    return o;
  }
  const st=t-E.roof, dk=eIO(prog(t,E.duque-.3,E.duque+.6));
  let s=roofScene(t,{sky:'day',flood:690,flood2:720,rough:true,flow:200});
  s+=splash(500,900,t,prog(st,0,1.4),1.4)+splash(820,900,t,prog(st,.8,2.2),1.2);
  s+=bagClosed(300,ROOFY,.42)+A({...MARCO,x:160,y:ROOFY+5,s:.62,look:[10,-4],eyes:'wide',brows:'worried',mouth:'o'});
  s+=A({...ELENA,x:820,y:ROOFY,s:.6,look:[-8,2],eyes:'wide',brows:'worried',mouth:'o'});
  s+=kid({...LUCIA,x:680,y:ROOFY+6,s:.6,look:[6,-4],eyes:'wide',brows:'worried',mouth:t>E.scream?'o':'line',handle:t>E.scream&&t<E.duque+1?[0,-330]:null});
  s+=doberman(lerp(420,540,dk),ROOFY-5,.52,t,{dir:dk>.5?1:1,alert:1,head:-4,bark:t>E.duque&&Math.sin(t*7)>.2,walk:dk>0&&dk<1?t*10:null,seed:8});
  if(t>E.scream) s+=soundArcs(680,560,t,'#fff',1)+soundArcs(680,560,t,'#fff',-1);
  const sh=t>E.creak?1-prog(t,E.creak+1.2,E.creak+2.2):0;
  return cam(s,lerp(1.0,1.25,dk),lerp(540,600,dk),lerp(640,760,dk),540,560,shake(t,sh,12),shake(t+.3,sh,6));
};
S.step2=(t,D,B)=>{ // afternoon heat: Marco gives Lucía water; the two men see everything
  const E=EVS.step2(B), aft=t>E.aft-.3, give=t>E.give;
  let s=roofScene(t,{sky:'afternoon',flood:760,flood2:790,flow:10,hut:1});
  s+=bagClosed(130,ROOFY,.42,{});
  if(aft&&t<E.give+.6) s+=`<g transform="translate(160,860) scale(.8)">${ITEMS.water}</g>`;
  s+=SA({...MARCO,x:300,y:ROOFY+5,s:.62,sit:true,look:[10,4],brows:null,mouth:'line',reachR:give?[190,-260]:null});
  s+=SK({...LUCIA,x:520,y:ROOFY+6,s:.62,sit:true,look:[-8,2],eyes:'open',brows:give?null:'worried',mouth:give?'smile':'line',reachL:give?[-120,-200]:null});
  if(give) s+=`<g transform="translate(${430},${ROOFY-150}) rotate(-20) scale(.55)">${ITEMS.water}</g>`;
  s+=SA({...ELENA,x:640,y:ROOFY,s:.6,sit:true,look:[-8,0],eyes:'closed',mouth:'line'});
  s+=A({...RUBEN,x:820,y:ROOFY-10,s:.58,look:[-11,4],brows:'angry',mouth:'line'})+A({...TONI,x:960,y:ROOFY-14,s:.56,look:[-11,4],brows:'angry',mouth:'line'});
  s+=doberman(lerp(-60,40,eOut(prog(t,0,1))),ROOFY-5,.5,t,{alert:.3,head:-6,seed:8});
  if(t>E.see) s+=brackets(890,640,320,260,PINK);
  const zm=eIO(prog(t,E.men-.2,E.men+.7));
  let o=cam(s,lerp(1.02,1.4,zm),lerp(480,820,zm),lerp(660,700,zm),540,560);
  if(!aft) o+=tag(540,450,'38 °C · SIN SOMBRA',YEL,P(t,.3,.2));
  if(t>E.see) o+=tag(540,450,'LO VEN TODO',PINK,P(t,E.see,.2));
  return o;
};
S.step3=(t,D,B)=>{ // dusk: the watch rota
  const E=EVS.step3(B), k=P(t,E.card-.3,.4);
  let s=roofScene(t,{sky:'dusk',flood:760,flood2:790,flow:8,hut:1});
  s+=L('sunset',SA({...MARCO,x:240,y:ROOFY+5,s:.62,sit:true,look:[10,0],mouth:'line'})+SA({...ELENA,x:520,y:ROOFY,s:.6,sit:true,look:[-8,0]})+SK({...LUCIA,x:400,y:ROOFY+6,s:.6,sit:true,eyes:'closed',tilt:12})+SA({...RUBEN,x:820,y:ROOFY-10,s:.58,sit:true,look:[-10,2],brows:'angry'}));
  let o=cam(s,1.08,540,680,540,560);
  if(k>0){let c=`<rect x="-300" y="-150" width="600" height="300" rx="20" fill="#11131f" fill-opacity=".92" stroke="${BLUE}" stroke-width="4"/><text x="0" y="-90" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="30" fill="${BLUE}" letter-spacing="3">TURNOS DE GUARDIA</text>`;
    c+=`<text x="-250" y="-10" font-family="Inter" font-weight="900" font-size="44" fill="#fff">MARCO</text><text x="250" y="-10" text-anchor="end" font-family="${MONO}" font-weight="800" font-size="36" fill="${YEL}">22:00–03:00</text>`;
    c+=`<g opacity="${P(t,E.card+.5,.3)}"><text x="-250" y="80" font-family="Inter" font-weight="900" font-size="44" fill="#fff">ELENA</text><text x="250" y="80" text-anchor="end" font-family="${MONO}" font-weight="800" font-size="36" fill="${YEL}">03:00–07:00</text></g>`;
    o+=`<g transform="translate(540,${lerp(780,740,k)}) scale(.9)" opacity="${k}">${c}</g>`;}
  return o;
};
S.night=(t,D,B)=>{ // no lights in the whole town; Marco's watch, then Elena's... and she falls asleep
  const E=EVS.night(B), swap=t>E.three, doze=eIO(prog(t,E.doze-.4,E.doze+.6));
  let s=roofScene(t,{sky:'night',flood:760,flood2:790,flow:6,hut:1});
  let c='';
  c+=SK({...LUCIA,x:770,y:ROOFY+6,s:.58,sit:true,eyes:'closed',tilt:18,still:true});
  c+=SA({...RUBEN,x:900,y:ROOFY-8,s:.56,sit:true,eyes:t>E.doze?'open':'closed',look:[-11,2],still:true})+SA({...TONI,x:1020,y:ROOFY-10,s:.56,sit:true,eyes:'closed',tilt:-14,still:true});
  if(!swap) c+=A({...ELENA,x:700,y:ROOFY-55,s:.6,rot:-90,eyes:'closed',still:true});
  else c+=SA({...ELENA,x:640,y:ROOFY,s:.6,sit:true,eyes:doze>.5?'closed':'open',tilt:doze*22,look:[6,0],mouth:'line'});
  if(!swap) c+=SA({...MARCO,x:230,y:ROOFY+5,s:.62,sit:true,look:[Math.sin(t*.8)*10,-2],brows:'worried',mouth:'line'});
  else c+=A({...MARCO,x:520,y:ROOFY-55,s:.62,rot:-90,eyes:'closed',still:true});
  c+=bagClosed(swap?548:105,ROOFY,.4)+doberman(swap?60:-10,ROOFY-5,.5,t,{alert:.2,head:-10,seed:8});
  s+=NTC(c);
  if(t>E.doze) s+=`<g opacity="${P(t,E.doze,.4)}"><circle cx="887" cy="711" r="4.5" fill="#fff"/><circle cx="913" cy="711" r="4.5" fill="#fff"/></g>`;
  for(let i=0;i<3&&doze>.5;i++){const p=(t*.5+i/3)%1;s+=`<text x="${680+p*60}" y="${600-p*110}" font-family="${MONO}" font-weight="800" font-size="${30+p*18}" fill="#9fb0e0" opacity="${Math.sin(p*Math.PI).toFixed(2)}">z</text>`}
  const zw=eIO(prog(t,E.watch-.2,E.watch+1)), zd=eIO(prog(t,E.doze-.6,E.doze+.6));
  let o=cam(s,lerp(lerp(1.0,1.2,zw),1.6,zd),lerp(lerp(540,420,zw),720,zd),lerp(lerp(560,700,zw),690,zd),540,560);
  if(t>E.light&&t<E.watch) o+=tag(540,450,'0 LUCES',YEL,P(t,E.light,.2));
  return o;
};
S.step4=(t,D,B)=>{ // the bag should be tied to his wrist; it isn't. A hand comes out of the dark
  const E=EVS.step4(B), no=t>E.no, hand=eIO(prog(t,E.no+.4,D+.2));
  let s=roofScene(t,{sky:'night',flood:760,flood2:790,flow:6,hut:1});
  let c=A({...MARCO,x:620,y:ROOFY-55,s:.62,rot:-90,eyes:'closed',still:true});
  c+=bagClosed(720,ROOFY,.46,{tied:!no&&t>E.tied?[-180,-60]:null});
  s+=NTC(c);
  if(no) s+=`<g opacity="${P(t,E.no,.2)}"><path d="M560,880 L660,980 M660,880 L560,980" stroke="${PINK}" stroke-width="14" stroke-linecap="round"/></g>`;
  if(hand>0){const hx=lerp(1250,800,hand), hy=ROOFY-70;s+=`<path d="M1400,${hy+20} L${hx+40},${hy}" stroke="#8a2a2a" stroke-width="56" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="30" fill="#b9825e"/><path d="M${hx-26},${hy-14} L${hx-58},${hy-20} M${hx-28},${hy} L${hx-62},${hy+2} M${hx-24},${hy+14} L${hx-54},${hy+22}" stroke="#b9825e" stroke-width="14" stroke-linecap="round"/>`;}
  s+=dark(.35,[[660,880,600,320]]);
  let o=cam(s,lerp(1.7,1.9,prog(t,0,D)),660,830,540,560);
  if(t>E.tied&&!no) o+=tag(540,450,'ATADA A LA MUÑECA',GREEN,P(t,E.tied,.2));
  if(t>E.error) o+=tag(540,450,'ERROR N.º 1',PINK,P(t,E.error,.2));
  return o;
};
S.dawn=(t,D,B)=>{ // dawn: the water has gone down; the town is a rubbish tip
  const E=EVS.dawn(B), lw=eIO(prog(t,0,E.down+.6));
  let s=roofScene(t,{sky:'dawn',mud:true,flood:lerp(760,1100,lw),flow:4,hut:1});
  s+=L('dusk',kid({...LUCIA,x:760,y:ROOFY-40,s:.58,rot:-90,eyes:'closed',still:true})+SA({...ELENA,x:300,y:ROOFY,s:.6,sit:true,eyes:'closed',tilt:22}));
  let o=cam(s,lerp(1.0,1.18,prog(t,0,D)),540,lerp(640,700,prog(t,0,D)),540,560);
  if(t>E.dump) o+=tag(540,450,'BARRO Y ESCOMBROS',YEL,P(t,E.dump,.2));
  return o;
};
S.end=(t,D,B)=>{ // the bag is gone, the men are gone... and Duque doesn't answer
  const E=EVS.end(B), up=t>E.gone-.8, call=t>E.call-.3;
  let s=roofScene(t,{sky:'dawn',mud:true,flow:4,hut:1});
  let c=kid({...LUCIA,x:1060,y:ROOFY-40,s:.58,rot:-90,eyes:'closed',still:true})+SA({...ELENA,x:640,y:ROOFY,s:.6,sit:true,eyes:'closed',tilt:22});
  c+=`<rect x="380" y="${ROOFY-70}" width="90" height="70" rx="10" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="12 10" opacity="${up?.8:0}"/>`;
  // the cut leash on the ground
  c+=`<path d="M120,${ROOFY-4} Q170,${ROOFY-20} 230,${ROOFY-2} T330,${ROOFY-6}" stroke="#7a3a2a" stroke-width="6" fill="none"/><path d="M330,${ROOFY-6} l12,-8 M330,${ROOFY-6} l14,2 M330,${ROOFY-6} l10,10" stroke="#7a3a2a" stroke-width="3"/>`;
  c+=call?A({...MARCO,x:300,y:ROOFY+5,s:.62,look:[Math.sin(t*1.5)*10,-2],eyes:'wide',brows:'worried',mouth:'o',reachR:[60,-560]})
         :SA({...MARCO,x:300,y:ROOFY+5,s:.62,sit:true,look:up?[Math.sin(t*3)*11,2]:[8,0],eyes:up?'wide':'open',brows:'worried',mouth:up?'o':'line'});
  s+=L('dusk',c);
  if(call) s+=bang(560,560,'¡DUQUE!',YEL,P(t,E.call-.2,.15),70);
  const zk=eIO(prog(t,E.none-.3,D));
  let o=cam(s,lerp(1.1,2.3,zk),lerp(540,240,zk),lerp(680,960,zk),540,560);
  if(t>E.gone&&t<E.call-.3) o+=tag(540,450,'NO ESTÁ',PINK,P(t,E.gone,.2));
  return o;
};
window.CFG={steps:['1. NO BAJES','2. NO ENSEÑES LO QUE TIENES','3. DUERME POR TURNOS','4. MOCHILA ATADA'],listEnd:'dawn',
  band:{intro:'#3a3c3e',recap:'#3a3c3e',door:'#4a4844',step1:'#4a4844',wave2:'#34383c',step2:'#5a4a3a',step3:'#3a2a3a',night:'#0e1222',step4:'#0a0c16',dawn:'#4a3a40',end:'#2a2228'}};

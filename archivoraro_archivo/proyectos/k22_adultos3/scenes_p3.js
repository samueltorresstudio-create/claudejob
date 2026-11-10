// ---------- part 3 helpers ----------
const POL={skin:'#efc4a0',top:'#5a8a4a',topD:'#43683a',hs:'messy',hair:'#6a4a2a',pants:'#3a3a48',shoes:'#e9e9ee'};
// black eyes on a small character (Alba: tall:false) standing at (x,y) with scale s
function creepSmall(x,y,s,a){
  if(a<=0) return '';let g='';
  for(const ex of [-36,36]) g+=`<circle cx="${(x+ex*s).toFixed(1)}" cy="${(y-406*s).toFixed(1)}" r="${(27*s).toFixed(1)}" fill="#05050a" opacity="${a.toFixed(2)}"/><circle cx="${(x+ex*s+3*s).toFixed(1)}" cy="${(y-410*s).toFixed(1)}" r="${(4*s).toFixed(1)}" fill="#fff" opacity="${a.toFixed(2)}"/>`;
  return g}
function bread(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-22" rx="62" ry="28" fill="#d99a4a"/><path d="M-30,-40 Q-22,-22 -30,-6 M0,-46 Q8,-26 0,-4 M30,-40 Q38,-22 30,-6" stroke="#b07a3a" stroke-width="5" fill="none" stroke-linecap="round"/></g>`}
function consoleK(x,y,s=1,glow=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-70" y="-40" width="140" height="64" rx="22" fill="#2a2e3a"/><rect x="-36" y="-30" width="72" height="44" rx="4" fill="${mix('#2a3246','#7ad0ff',glow)}"/><circle cx="-52" cy="-8" r="8" fill="#e2453b"/><circle cx="52" cy="-8" r="8" fill="#45e07e"/></g>`}
function sunTag(x,y,txt,a){return tag(x,y,'☀ '+txt,YEL,a)}
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

// ---------- key times per scene (scene-relative) ----------
const EVS={
  intro:B=>({humans:B[0].w[4],not:B[0].w[5],hugo:B[1].w[2],sun:B[1].w[12]}),
  gate:B=>({night:B[0].w[1],open:B[0].w[2],fence:B[0].w[4]}),
  part:B=>({three:B[0].w[1]}),
  dani:B=>({name:B[0].w[6],smile:B[1].w[0],always:B[1].w[5],nobody:B[2].w[0],but:B[2].w[5]}),
  step1:B=>({know:B[0].w[7],sit:B[1].w[2],nothing:B[1].w[6],bread:B[2].w[4],stare:B[2].w[7]}),
  step2:B=>({blink:B[0].w[4]}),
  watch:B=>({morning:B[0].w[5],blinks:B[1].w[1],all:B[1].w[3]}),
  pol:B=>({other:B[0].w[3],noblink:B[0].w[9],pol:B[0].w[10],turn:B[1].w[2],rub:B[2].w[2],game:B[2].w[8],false_:B[3].w[0]}),
  step3:B=>({group:B[0].w[9],ask:B[1].s,answer:B[2].s,right:B[3].w[2],lost:B[3].w[6]}),
  step4:B=>({protect:B[0].w[6]}),
  sunset:B=>({hide:B[0].w[4]}),
  run:B=>({alba:B[0].w[5]}),
  ask:B=>({alone:B[0].w[2],q:B[1].s,fish:B[1].w[5]}),
  end:B=>({look:B[0].w[2],smile:B[0].w[3],none:B[1].w[2]}),
  behind:B=>({dani:B[0].w[3],whisper:B[1].s,wrong:B[1].w[2]}),
  lock:B=>({out:B[0].w[1],turn:B[0].w[5],lock:B[0].w[7]}),
};

// ---------- scenes ----------
const S={};
S.intro=(t,D,B)=>{ // breakfast table: a scanner sweeps along the sixteen kids
  const E=EVS.intro(B);
  let s=canteenK(t)+rowKids(t,{spoon:true});
  s+=tableK(-60,2560,830);
  const sweep=prog(t,.2,E.not), sx=lerp(ROW[0].x,ROW[15].x,eIO(sweep));
  if(t<E.hugo) s+=brackets(sx,620,170,230,t>E.not?PINK:YEL);
  if(t>E.humans&&t<E.hugo) ROW.forEach(({x},i)=>{if(Math.abs(x-sx)<700) s+=bigText('?',x,560,70,'#fff',P(t,E.humans+i*.02,.2)*.9,'#ff3e6c')});
  if(t>E.not&&t<E.hugo) s+=tag(sx,880,'1 DE 16',PINK,P(t,E.not,.2));
  if(t>E.sun) s+=sunTag(1290,420,'QUEDAN 8 H',P(t,E.sun,.2));
  const fx=t<E.hugo?clamp(sx,480,2140):lerp(clamp(ROW[15].x,480,2140),1290,eIO(prog(t,E.hugo,E.hugo+1)));
  const z=t<E.hugo?1.25:lerp(1.25,1.05,eIO(prog(t,E.hugo,E.hugo+1)));
  return cam(s,z,fx,t<E.hugo?640:lerp(640,560,eIO(prog(t,E.hugo,E.hugo+1))),540,600);
};
S.gate=(t,D,B)=>{ // tonight: the three of them wait at the gate
  const E=EVS.gate(B);
  const ppl=doctor({x:470,y:860,s:.58,look:[0,0],mouth:'grin'})+tieMan({x:1020,y:860,s:.58,look:[0,0],mouth:'grin'})+mama({x:780,y:880,s:.62,look:[0,0],mouth:'grin'})
    +creepAt(470,860,.58,1)+creepAt(1020,860,.58,1)+creepAt(780,880,.62,1);
  let s=yard(t,{people:ppl});
  s+=dark(.6,[[780,520,200,260],[470,520,150,220],[1020,520,150,220],[640,640,120,120]]);
  if(t>E.open) s+=brackets(640,640,150,150,PINK)+tag(640,780,'DESDE DENTRO',PINK,P(t,E.open,.2));
  return cam(s,lerp(1.15,1.35,prog(t,0,D)),700,580,540,560);
};
S.part=(t,D,B)=>{ // title card, like part 2
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#07080f"/>`+stars(9,50,900,t,.5);
  s+=`<circle cx="540" cy="560" r="420" fill="url(#glowY)" opacity=".35"/>`;
  s+=`<g opacity=".35">${fenceK(700,1100,{gx:540,col:'#1a1e2e'})}</g>`;
  s+=`<text x="540" y="420" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="40" letter-spacing="6" fill="${YEL}" opacity="${P(t,0,.3).toFixed(2)}">DESAPARECEN LOS ADULTOS</text>`;
  s+=countPop('PARTE 3',540,640,190,t,'#fff');
  s+=padlock(540,860,1.1,Math.sin(t*3)*6,0);
  return cam(s,1+.04*t/D,540,600,540,560);
};
S.dani=(t,D,B)=>{ // meet Dani: smiling, at the end of the table next to Alba
  const E=EVS.dani(B), wide=t>E.nobody;
  let s=canteenK(t)+rowKids(t,{spoon:true,look:wide?[0,-4]:[-4,-2]});
  s+=tableK(-60,2560,830);
  if(wide) ROW.forEach(({x},i)=>{if(i<14&&Math.abs(x-1900)<760) s+=bigText('?',x+30,560,60,'#fff',P(t,E.nobody+(i%5)*.06,.2)*.9,'#6cc6ff')});
  if(t>E.name&&!wide) s+=brackets(ROW[15].x,650,170,220,PINK)+tag(ROW[15].x,480,'DANI',PINK,P(t,E.name,.2));
  if(t>E.always&&!wide) s+=tag(ROW[15].x-60,900,'«SIEMPRE HE ESTADO AQUÍ»',YEL,P(t,E.always,.2));
  const zw=eIO(prog(t,E.nobody-.2,E.nobody+.6));
  return cam(s,lerp(2,1.15,zw),lerp(2290,1900,zw),lerp(660,640,zw),540,600);
};
S.step1=(t,D,B)=>{ // Hugo sits across from Dani; Dani slides him the bread and keeps staring
  const E=EVS.step1(B);
  let s=canteenK(t);
  const hy=lerp(1100,1000,eOut(prog(t,E.sit-.4,E.sit+.3)));
  s+=A({...HUGO,x:330,y:hy,s:.62,look:t>E.stare?[6,-2]:[2,-2],brows:t>E.stare?'worried':null,mouth:t>E.nothing&&t<E.stare?'smile':'line'});
  s+=A({...NEWKID,x:760,y:1000,s:.62,look:[-8,-1],mouth:'smile'});
  s+=tableK(60,1020,814);
  const bx=lerp(700,420,eIO(prog(t,E.bread-.6,E.bread+.3)));
  s+=bread(bx,814,1);
  if(t>E.know) s+=tag(330,330,'DISIMULA',YEL,P(t,E.know,.2)*(1-P(t,E.stare,.2)));
  if(t>E.stare){s+=`<path d="M720,${1000-632*.62} L420,${1000-632*.62}" stroke="${PINK}" stroke-width="5" stroke-dasharray="14 12" opacity="${P(t,E.stare,.3).toFixed(2)}"/>`;s+=tag(760,330,'NO DEJA DE MIRARLE',PINK,P(t,E.stare,.2));}
  return cam(s,1.1,540,600,540,560);
};
S.step2=(t,D,B)=>{ // close on Dani's eyes
  const E=EVS.step2(B);
  let s=canteenK(t)+`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity=".25"/>`;
  s+=A({...NEWKID,x:540,y:560+638*1.7,s:1.7,look:[-6,0],mouth:'smile'});
  s+=`<rect x="-600" y="880" width="2280" height="900" fill="#c98a52"/><rect x="-600" y="866" width="2280" height="22" fill="#e0a868"/>`;
  if(t>E.blink) s+=brackets(540,570,360,140,YEL)+tag(540,800,'¿PARPADEA?',YEL,P(t,E.blink,.2));
  return cam(s,1.04,540,600,540,560);
};
S.watch=(t,D,B)=>{ // all morning: Hugo watches from his desk; then Dani blinks
  const E=EVS.watch(B);
  if(t<B[1].s){
    const k=prog(t,0,B[1].s), h=10+k*3;
    let s=classroomK(t,{h,m:(k*180)%60});
    s+=deskK(300,1000,.9)+deskK(800,1000,.9);
    s+=extra(KIDS,2,{x:560,y:930,s:.5,look:[0,-2]})+A({...HUGO,x:300,y:960,s:.6,look:[8,-1],brows:'worried'})+A({...NEWKID,x:800,y:960,s:.6,look:[0,0],mouth:'smile'});
    s+=deskK(300,1040,.9).replace('<g ','<g opacity="0" ')+`<path d="M340,${960-632*.6} L760,${960-632*.6}" stroke="${YEL}" stroke-width="4" stroke-dasharray="12 12" opacity=".7"/>`;
    s+=sunTag(540,330,'QUEDAN 6 H',P(t,.2,.2));
    return cam(s,1.06,540,600,540,560);
  }
  let s=canteenK(t)+`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity=".25"/>`;
  const shut=t>E.blinks&&t<E.blinks+.18;
  s+=A({...NEWKID,x:540,y:560+638*1.7,s:1.7,look:[-6,0],mouth:'smile',eyes:shut?'closed':'open'});
  s+=`<rect x="-600" y="880" width="2280" height="900" fill="#c98a52"/><rect x="-600" y="866" width="2280" height="22" fill="#e0a868"/>`;
  if(t>E.blinks) s+=brackets(540,570,360,140,GREEN)+tag(540,800,'PARPADEA ✓',GREEN,P(t,E.blinks,.2));
  return cam(s,1.04,540,600,540,560);
};
S.pol=(t,D,B)=>{ // false alarm: Pol hasn't blinked for ages... he was playing the console
  const E=EVS.pol(B);
  const KX=[150,330,510,700,880], polX=880;
  let s=canteenK(t);
  const turned=t>E.turn, rub=t>E.rub&&t<E.false_+.4;
  KX.forEach((x,i)=>{if(i===4) return;
    s+=extra(KIDS,[0,2,6,1][i],{x,y:980,s:.55,seed:i*9+4,look:turned?[8,-1]:[0,-2],eyes:turned&&t<E.false_?'wide':'open',mouth:t>E.false_+.2?'smile':'line',brows:turned&&t<E.false_?'worried':null});});
  s+=A({...POL,x:polX,y:980,s:.55,look:[0,4],eyes:t<E.rub?'wide':'open',blink:false,still:t<E.rub,handle:rub?[0,-628]:null,mouth:t>E.false_?'smile':'line'});
  s+=tableK(0,1080,815);
  s+=consoleK(polX,800,1,t<E.rub?1:.3);
  if(t>E.noblink&&t<E.turn) s+=brackets(polX,980-632*.55,160,90,PINK);
  if(t>E.pol&&t<E.rub) s+=tag(polX-60,330,'POL · SIN PARPADEAR',PINK,P(t,E.pol,.2));
  if(turned&&t<E.rub) KX.slice(0,4).forEach((x,i)=>{s+=bang(x,560,'!',PINK,P(t,E.turn+i*.08,.15),70)});
  if(t>E.game&&t<E.false_) s+=tag(polX-80,640,'1 H DE CONSOLA',BLUE,P(t,E.game,.2));
  if(t>E.false_) s+=tag(540,330,'FALSA ALARMA',GREEN,P(t,E.false_,.2));
  const zp=eIO(prog(t,E.other-.2,E.pol+.2)), zb=eIO(prog(t,E.turn-.2,E.turn+.4));
  const z=t<E.turn?lerp(1.05,1.6,zp):lerp(1.6,1.05,zb);
  return cam(s,z,t<E.turn?lerp(540,800,zp):lerp(800,540,zb),t<E.turn?lerp(600,560,zp):lerp(560,600,zb),540,560);
};
S.step3=(t,D,B)=>{ // the question only the group knows — and Dani gets it right
  const E=EVS.step3(B);
  let s=classroomK(t,{h:7,m:0});
  s+=boardK(470,190,440,200,[['¿QUÉ GRITAMOS',1],['EL 1.er DÍA?',1]],{green:true,size:44,lh:64});
  s+=deskK(560,1000,.9)+deskK(860,1000,.9);
  s+=extra(KIDS,5,{x:560,y:960,s:.55,look:[-8,-2]})+A({...NEWKID,x:860,y:960,s:.55,look:[-8,-2],mouth:t>E.answer?'o':'smile'});
  s+=A({...HUGO,x:220,y:1000,s:.66,look:[8,-2],brows:t>E.lost?'worried':null,mouth:t>E.ask&&t<E.answer?(Math.floor(t*7)%2?'o':'line'):'line'});
  if(t>E.ask&&t<E.answer+.2) s+=bubble(380,520,560,90,'¿QUÉ GRITAMOS EN EL PARQUE?',{size:34,tx:260,ty:600});
  if(t>E.answer) s+=bubble(700,520,520,90,'¡JUNTOS TENEMOS UN PLAN!',{size:36,tx:840,ty:600,col:'#ffd6e4',op:1-P(t,E.right+.6,.3)});
  if(t>E.right) s+=tag(860,470,'CORRECTO ✓',GREEN,P(t,E.right,.2));
  if(t>E.lost) s+=sunTag(540,330,'QUEDA 1 H',P(t,E.lost,.2));
  return cam(s,1.06,540,600,540,560);
};
S.step4=(t,D,B)=>{ // Hugo holds Alba's hand: protect your own
  const E=EVS.step4(B);
  let s=corridorK(t,{night:false});
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#ff8a4a" opacity=".16"/>`;
  s+=A({...ALBA,x:420,y:1010,s:.7,look:[6,-6],reachR:[110,-240]})+A({...HUGO,x:560,y:1000,s:.66,look:[-6,-4],brows:'worried'});
  if(t>E.protect) s+=tag(540,420,'ALBA',BLUE,P(t,E.protect,.2));
  return cam(s,1.08,500,620,540,560);
};
S.sunset=(t,D,B)=>{ // the sun sinks behind the blocks
  const E=EVS.sunset(B);
  let s=sunsetCity(t,eIO(prog(t,0,D)));
  s+=sunTag(540,330,`QUEDAN ${Math.max(0,Math.ceil((1-prog(t,0,D))*59))} MIN`,1);
  return cam(s,1.05,540,600,540,560);
};
S.run=(t,D,B)=>{ // Hugo runs down the darkening corridor
  const E=EVS.run(B);
  let s=corridorK(t,{night:true,lights:false});
  const x=lerp(-120,1180,prog(t,0,D));
  s+=NTC(A({...HUGO,x,y:1000,s:.64,walk:t*13,look:[10,0],brows:'worried',mouth:'o'}));
  s+=dark(.5,[[x,620,300,420]]);
  if(t>E.alba) s+=tag(540,420,'¿ALBA?',YEL,P(t,E.alba,.2));
  return cam(s,1.06,540,600,540,560);
};
S.ask=(t,D,B)=>{ // Alba alone in the classroom; the secret question
  const E=EVS.ask(B);
  let s=classroomK(t,{night:true,h:9,m:0});
  s+=deskK(620,1000,.9);
  const hx=lerp(-60,330,eOut(prog(t,0,E.alone)));
  s+=NTC(A({...ALBA,x:620,y:1000,s:.8,look:t<E.alone?[0,2]:[-8,-2],mouth:'line'})+A({...HUGO,x:hx,y:1000,s:.7,walk:t<E.alone?t*10:null,look:[8,-2],brows:'worried'}));
  s+=dark(.45,[[540,620,420,420]]);
  if(t>E.alone&&t<E.q) s+=tag(620,430,'SOLA',BLUE,P(t,E.alone,.2));
  if(t>E.q) s+=bubble(420,430,560,90,'¿CÓMO SE LLAMA NUESTRO PEZ?',{size:34,tx:330,ty:520});
  const zp=eIO(prog(t,E.q-.2,D));
  return cam(s,lerp(1.06,1.35,zp),lerp(540,500,zp),lerp(600,620,zp),540,560);
};
S.end=(t,D,B)=>{ // close on Alba: she smiles... and her eyes go black
  const E=EVS.end(B);
  let s=classroomK(t,{night:true,h:9,m:0});
  s+=deskK(620,1000,.9);
  s+=NTC(A({...ALBA,x:620,y:1000,s:.8,look:[-8,-2],mouth:t>E.smile?'smile':'line',still:true}))+creepSmall(620,1000,.8,prog(t,E.none-.15,E.none+.25));
  s+=dark(.4,[[620,670,260,260]]);
  if(t>E.none) s+=tag(620,880,'NO CONTESTA',PINK,P(t,E.none,.2));
  const zp=eIO(prog(t,0,D));
  return cam(s,lerp(1.9,2.4,zp),620,lerp(690,680,zp),540,560);
};
S.behind=(t,D,B)=>{ // Dani in the doorway behind Hugo
  const E=EVS.behind(B);
  let s=classroomK(t,{night:true,h:9,m:1});
  s+=classDoor(820,{open:prog(t,0,E.dani),who:A({...NEWKID,x:920,y:1000,s:.66,look:[-8,-2],mouth:t>E.whisper?(Math.floor(t*7)%2?'o':'smile'):'smile'})});
  s+=deskK(560,1000,.9);
  s+=NTC(A({...ALBA,x:560,y:1000,s:.8,look:[-8,-2],mouth:'smile',still:true})+A({...HUGO,x:300,y:1000,s:.7,look:t>E.dani?[10,-2]:[8,-2],eyes:t>E.dani?'wide':'open',brows:'worried',mouth:'o'}))+creepSmall(560,1000,.8,1);
  s+=dark(.45,[[560,620,520,460]]);
  if(t>E.whisper) s+=bubble(720,360,540,90,'TE HAS EQUIVOCADO DE NIÑO',{size:32,tx:900,ty:430,col:'#ffd6e4'});
  return cam(s,1.06,580,600,540,560);
};
S.lock=(t,D,B)=>{ // outside, someone turns the padlock
  const E=EVS.lock(B);
  const turn=t>E.turn?Math.sin((t-E.turn)*9)*14+(t-E.turn)*30:0;
  const w=mama({x:780,y:880,s:.62,look:[0,0],mouth:'grin',reachL:t>E.out+.3?[(640-780)/.62,(640-880)/.62]:null});
  let s=yard(t,{people:w+creepAt(780,880,.62,1),lockRot:turn});
  s+=dark(.6,[[780,520,220,260],[640,640,140,140]]);
  const zp=eIO(prog(t,0,D));
  return cam(s,lerp(1.3,2.2,zp),lerp(720,660,zp),lerp(580,620,zp),540,560);
};

window.CFG={steps:['1. DISIMULA','2. ¿PARPADEA?','3. LA PREGUNTA','4. PROTEGE A LOS TUYOS'],listEnd:'ask',
  band:{intro:'#3a3020',gate:'#08090e',part:'#07080f',dani:'#3a3020',step1:'#3a3020',step2:'#2a2420',watch:'#3a3020',pol:'#3a3020',step3:'#3a3020',step4:'#3a2a20',sunset:'#3a2a30',run:'#0e1020',ask:'#141628',end:'#0a0b12',behind:'#0a0b12',lock:'#06070a'}};

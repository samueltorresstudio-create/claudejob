function bracelet(o){ // beads round the left wrist of a tall character drawn with arms down
  const [hx,hy]=personHand({tall:true,fem:!!o.fem,s:o.s,x:o.x,y:o.y},-1,10);
  const cols=['#ff3e6c','#f7d23e','#45e07e','#6cc6ff','#ff8fb0','#f7d23e'];let g='';
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;g+=`<circle cx="${(hx+Math.cos(a)*17*o.s/.62).toFixed(1)}" cy="${(hy-26*o.s/.62+Math.sin(a)*6*o.s/.62).toFixed(1)}" r="${(6*o.s/.62).toFixed(1)}" fill="${cols[i]}"/>`}
  return g}
function stairsUp(t){ // inside the stairwell looking up: steps climbing to a bright exit
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#141824"/>`;
  s+=`<polygon points="760,-200 1300,-200 1300,420 760,420" fill="#fff4cf"/><circle cx="1000" cy="200" r="460" fill="url(#glowY)"/>`;
  for(let i=0;i<16;i++){const x=-200+i*70,y=1120-i*52;s+=`<rect x="${x}" y="${y}" width="900" height="16" fill="#262c3c"/><rect x="${x}" y="${y+16}" width="900" height="36" fill="#1c2130"/>`}
  return s}
function fishPair(x,y,s,t,two,front){ // the bowl; two identical fish swimming in perfect sync, then both turn to face you
  const fx=Math.sin(t*1.3)*40, dir=Math.cos(t*1.3)>0?1:-1;
  const fish=(ox,op)=>front?`<g transform="translate(${ox},-120)" opacity="${op}"><circle r="40" fill="#ff8a2a"/><path d="M-40,0 L-64,-26 L-64,26Z M40,0 L64,-26 L64,26Z" fill="#ff6a1a" opacity=".6"/><circle cx="-15" cy="-6" r="11" fill="#fff"/><circle cx="15" cy="-6" r="11" fill="#fff"/><circle cx="-15" cy="-5" r="6" fill="#2a2233"/><circle cx="15" cy="-5" r="6" fill="#2a2233"/><ellipse cx="0" cy="18" rx="8" ry="5" fill="#a8401a"/></g>`
    :`<g transform="translate(${ox+fx},-120) scale(${dir},1)" opacity="${op}"><ellipse cx="0" cy="0" rx="46" ry="30" fill="#ff8a2a"/><polygon points="-40,0 -84,-30 -84,30" fill="#ff6a1a"/><circle cx="22" cy="-6" r="7" fill="#2a2233"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-150" rx="170" ry="150" fill="#bfe6ff" opacity=".55"/><ellipse cx="0" cy="-100" rx="160" ry="90" fill="#6cc6ff" opacity=".45"/>
    ${fish(two>0?-50:0,1)}${two>0?fish(50,two):''}
    <ellipse cx="0" cy="-296" rx="110" ry="14" fill="none" stroke="#bfe6ff" stroke-width="10"/><ellipse cx="-80" cy="-200" rx="18" ry="50" fill="#fff" opacity=".35"/><rect x="-200" y="0" width="400" height="20" rx="6" fill="#8a5a3a"/></g>`}
function metroEntranceDay(t){ // the same entrance seen from the street
  let s=`<rect x="300" y="760" width="480" height="300" fill="#0b0c12"/>`;
  for(let i=0;i<6;i++) s+=`<rect x="${300+i*14}" y="${770+i*46}" width="${480-i*28}" height="10" fill="#2a2e3a" opacity="${(1-i*.15).toFixed(2)}"/>`;
  s+=`<rect x="280" y="700" width="20" height="360" fill="#5a6070"/><rect x="780" y="700" width="20" height="360" fill="#5a6070"/><rect x="280" y="700" width="520" height="16" fill="#5a6070"/>`;
  s+=`<rect x="836" y="420" width="16" height="300" fill="#3a3e4a"/><rect x="784" y="330" width="120" height="120" rx="14" fill="#c23a3a" transform="rotate(45 844 390)"/><text x="844" y="414" text-anchor="middle" font-family="Inter" font-weight="900" font-size="72" fill="#fff">M</text>`;
  return s}

// ---------- key times per scene (scene-relative) ----------
const EVS={
  intro:B=>({adults:B[0].w[5],under:B[0].w[9],sunset:B[1].w[3]}),
  part:B=>({five:B[0].w[1],end:B[0].w[3]}),
  guard:B=>({copy:B[0].w[6],watch:B[0].w[8],more:B[1].w[2],rows:B[1].w[6]}),
  step1:B=>({look:B[0].w[4],eyes:B[0].w[7]}),
  sneak:B=>({down:B[0].w[6],guard:B[1].w[1],side:B[1].w[5],past:B[1].w[7]}),
  step2:B=>({yours:B[0].w[5]}),
  moms:B=>({three:B[0].w[1],same:B[0].w[7],bracelet:B[1].w[5],alba:B[2].w[7]}),
  step3:B=>({word:B[0].w[6]}),
  wake:B=>({whisper:B[0].w[5],alba:B[1].w[1],mom:B[1].w[6]}),
  run:B=>({wake:B[0].w[2],run:B[0].w[5],light:B[0].w[8]}),
  sun:B=>({copies:B[0].w[5],dust:B[0].w[7]}),
  home:B=>({normal:B[0].w[6],count:B[1].w[1],all:B[1].w[6]}),
  fish:B=>({bowl:B[0].w[3],two:B[1].w[2],same:B[1].w[4]}),
};
const S={};
const GUARDS=[3,10,17];
S.intro=(t,D,B)=>{ // the platform full of sleeping adults
  const E=EVS.intro(B);
  let s=metroK(t)+sleepers(t);
  s+=mama({x:540,y:980,s:.62,eyes:'open',look:[0,0],mouth:'line'})+creepAt(540,980,.62,1);
  s+=dark(.55,[[540,680,700,380]]);
  if(t>E.adults&&t<B[1].s) s+=tag(540,860,'TODOS LOS ADULTOS',YEL,P(t,E.adults,.2));
  if(t>E.sunset) s+=tag(540,860,'HASTA EL ATARDECER',YEL,P(t,E.sunset,.2));
  const zp=eIO(prog(t,0,D));
  return cam(s,lerp(1.6,1.05,zp),540,lerp(640,640,zp),540,560);
};
S.part=(t,D,B)=>{
  const E=EVS.part(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#07080f"/>`+stars(9,50,900,t,.5);
  s+=`<circle cx="540" cy="560" r="420" fill="url(#glowY)" opacity=".35"/><g opacity=".35">${fenceK(700,1100,{gx:540,col:'#1a1e2e'})}</g>`;
  s+=`<text x="540" y="420" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="40" letter-spacing="6" fill="${YEL}" opacity="${P(t,0,.3).toFixed(2)}">DESAPARECEN LOS ADULTOS</text>`;
  s+=countPop('PARTE 5',540,640,190,t,'#fff');
  if(t>E.end) s+=tag(540,760,'EL FINAL',PINK,P(t,E.end,.2));
  s+=padlock(540,900,1,Math.sin(t*3)*6,1);
  return cam(s,1+.04*t/D,540,600,540,560);
};
S.guard=(t,D,B)=>{
  const E=EVS.guard(B);
  if(t<B[1].s){ // the "mum" at the front was a guard
    let s=metroK(t)+sleepers(t);
    s+=mama({x:600,y:980,s:.62,eyes:'open',look:[-6,0],mouth:'grin'})+creepAt(600,980,.62,1);
    s+=NTC(A({...HUGO,x:lerp(330,230,prog(t,0,1)),y:1000,s:.6,look:[8,-4],brows:'worried',mouth:'o'}));
    s+=dark(.55,[[520,660,360,400]]);
    if(t>E.copy) s+=tag(760,840,'COPIA',PINK,P(t,E.copy,.2));
    if(t>E.watch) s+=tag(760,900,'VIGILANTE',PINK,P(t,E.watch,.2));
    return cam(s,1.4,500,640,540,560);
  }
  // more of them hidden among the rows
  let s=metroK(t)+sleepers(t,{guards:GUARDS});
  s+=dark(.5,[[540,700,720,380]]);
  if(t>E.more){let n=0;ROWS.forEach(r=>r.xs.forEach(x=>{const i=n++;if(GUARDS.includes(i)) s+=brackets(x,r.y-600*r.s,150*r.s/.4,200*r.s/.4,PINK);}));}
  if(t>E.rows) s+=tag(540,920,'HAY MÁS',PINK,P(t,E.rows,.2));
  return cam(s,1.05,540,660,540,560);
};
S.step1=(t,D,B)=>{ // close on a guard's black eyes: don't look
  const E=EVS.step1(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#141824"/>`;
  s+=tieMan({x:540,y:560+638*1.7,s:1.7,look:[0,0],mouth:'line'})+creepAt(540,560+638*1.7,1.7,1);
  s+=`<rect x="-600" y="900" width="2280" height="900" fill="#141824"/>`;
  if(t>E.eyes) s+=`<path d="M300,470 L780,700 M780,470 L300,700" stroke="${PINK}" stroke-width="22" stroke-linecap="round" opacity="${P(t,E.eyes,.2).toFixed(2)}"/>`+tag(540,820,'NO LES MIRES',PINK,P(t,E.eyes,.2));
  return cam(s,1.04,540,600,540,560);
};
S.sneak=(t,D,B)=>{ // the kids creep past, eyes on the floor; a guard walks by
  const E=EVS.sneak(B);
  let s=metroK(t)+sleepers(t,{guards:GUARDS});
  const gk=prog(t,E.guard-.6,E.past+1.2), gx=lerp(1250,-200,gk);
  s+=tieMan({x:gx,y:900,s:.52,walk:t*6,look:[-8,0],mouth:'line'})+creepAt(gx,900,.52,1);
  const kx=lerp(-80,420,prog(t,0,D));
  s+=NTC(A({...HUGO,x:kx+200,y:1060,s:.6,walk:t*5,look:[2,9],brows:'worried'})+A({...NEWKID,x:kx+60,y:1060,s:.58,walk:t*5+1,look:[2,9],brows:'worried'})+extra(KIDS,2,{x:kx-80,y:1060,s:.56,walk:t*5+2,look:[2,9],brows:'worried'}));
  s+=dark(.5,[[540,760,700,420]]);
  if(t>E.down&&t<B[1].s) s+=tag(540,600,'MIRANDO AL SUELO',BLUE,P(t,E.down,.2));
  if(t>E.past) s+=tag(540,600,'SIGUE DE LARGO',GREEN,P(t,E.past,.2));
  return cam(s,1.06,540,660,540,560);
};
S.step2=(t,D,B)=>{ // Hugo's torch moves along the faces
  const E=EVS.step2(B);
  let s=metroK(t)+sleepers(t,{guards:GUARDS});
  const bx=200+((t*260)%700);
  s+=dark(.62,[[bx,600,200,260]]);
  if(t>E.yours) s+=tag(540,900,'ALGO QUE SOLO TÚ SEPAS',YEL,P(t,E.yours,.2));
  return cam(s,1.1,540,640,540,560);
};
S.moms=(t,D,B)=>{ // three identical mums — only one wears Alba's bracelet; the real Alba sleeps beside her
  const E=EVS.moms(B);
  let s=metroK(t);
  const MX=[260,540,820];
  MX.forEach((x,i)=>{s+=mama({x,y:1000,s:.6,eyes:'closed',look:[0,0],mouth:'line'});});
  s+=bracelet({x:820,y:1000,s:.6,fem:true});
  const aA=prog(t,E.alba-.3,E.alba+.2);
  if(aA>0) s+=`<g opacity="${aA.toFixed(2)}">${A({...ALBA,x:990,y:1010,s:.62,eyes:'closed',look:[0,0],mouth:'line',still:true})}</g>`;
  const holes=t<E.bracelet?[[540,680,520,400]]:t<E.alba?[[820,640,220,380]]:[[900,660,300,380]];
  s+=dark(.6,holes);
  if(t>E.three&&t<E.bracelet) MX.forEach((x,i)=>{s+=tag(x,1000-760*.6,String(i+1)+' ?',YEL,P(t,E.three+i*.15,.2))});
  if(t>E.bracelet){const [hx,hy]=personHand({tall:true,fem:true,s:.6,x:820,y:1000},-1,10);s+=brackets(hx,hy-16,110,90,YEL)+tag(hx,hy+70,'LA PULSERA',YEL,P(t,E.bracelet,.2));}
  if(t>E.alba) s+=tag(990,560,'ALBA',GREEN,P(t,E.alba,.2));
  const zp=eIO(prog(t,E.bracelet-.2,E.bracelet+.5));
  return cam(s,lerp(1.05,1.45,zp),lerp(540,840,zp),lerp(640,700,zp),540,560);
};
S.step3=(t,D,B)=>{ // the secret word
  const E=EVS.step3(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a2440"/>`;
  for(let x=-600;x<1700;x+=60) s+=`<line x1="${x}" y1="-900" x2="${x}" y2="1500" stroke="#fff" stroke-opacity=".04" stroke-width="2"/>`;
  s+=fishbowl(540,820,1,t);
  if(t>E.word) s+=tag(540,420,'BURBUJA',YEL,P(t,E.word,.25));
  return cam(s,1.04,540,600,540,560);
};
S.wake=(t,D,B)=>{ // «Burbuja»: Alba opens her eyes, then mum
  const E=EVS.wake(B);
  let s=metroK(t);
  const aOpen=t>E.alba, mOpen=t>E.mom;
  s+=mama({x:760,y:1000,s:.6,eyes:mOpen?'open':'closed',look:mOpen?[-6,2]:[0,0],mouth:mOpen?'smile':'line'})+bracelet({x:760,y:1000,s:.6,fem:true});
  s+=A({...ALBA,x:520,y:1010,s:.66,eyes:aOpen?'open':'closed',look:aOpen?[-6,-2]:[0,0],mouth:aOpen?'smile':'line',still:!aOpen});
  s+=NTC(A({...HUGO,x:330,y:1000,s:.64,look:[8,2],brows:aOpen?null:'worried',mouth:aOpen?'smile':'line'}));
  s+=dark(.55,[[560,660,460,400]]);
  if(t>E.whisper&&t<E.alba+.3) s+=bubble(560,500,300,80,'BURBUJA',{size:38,tx:400,ty:560,italic:true});
  if(t>E.alba) s+=tag(520,1010-600*.66-40,'DESPIERTA',GREEN,P(t,E.alba,.2));
  if(t>E.mom) s+=tag(760,330,'MAMÁ',GREEN,P(t,E.mom,.2));
  return cam(s,1.12,560,640,540,560);
};
S.run=(t,D,B)=>{ // everyone runs up the stairs towards the light; the guards wake behind them
  const E=EVS.run(B);
  let s=stairsUp(t);
  const k=prog(t,E.run-.3,D);
  const up=(i)=>{const p=clamp(k*1.3-i*.12);return [lerp(380,860,p),lerp(1050,560,p)]};
  const g=(x,y,o)=>A(o);
  const crew=[['H',0],['A',1],['M',2],['D',3]];
  crew.forEach(([w,i])=>{const [x,y]=up(i), sc=.55;
    s+=w==='H'?A({...HUGO,x,y,s:sc,walk:t*11+i,look:[8,-4],mouth:'o'}):w==='A'?A({...ALBA,x,y,s:sc,walk:t*11+i,look:[8,-4]}):w==='M'?mama({x,y,s:sc,walk:t*11+i,look:[8,-4],mouth:'o'}):A({...NEWKID,x,y,s:sc,walk:t*11+i,look:[8,-4]});});
  if(t>E.wake){const gx=lerp(60,260,prog(t,E.wake,D));s+=tieMan({x:gx,y:1080,s:.55,walk:t*8,look:[8,-2],mouth:'grin'})+creepAt(gx,1080,.55,1)+mama({x:gx-170,y:1120,s:.55,walk:t*8+1,look:[8,-2],mouth:'grin'})+creepAt(gx-170,1120,.55,1);}
  if(t>E.light) s+=tag(1000,460,'LA LUZ',YEL,P(t,E.light,.2));
  return cam(s,1.06,600,640,540,560);
};
S.sun=(t,D,B)=>{ // in the sunlight the copies fall apart like dust
  const E=EVS.sun(B);
  let s=streetK(t)+metroEntranceDay(t)+`<rect x="-600" y="-900" width="2280" height="2400" fill="#ffd27a" opacity=".18"/>`;
  const fade=1-prog(t,E.dust-.2,E.dust+1.2);
  let ppl='';
  if(fade>0){ppl+=`<g opacity="${fade.toFixed(3)}">`+tieMan({x:430,y:1000,s:.5,look:[0,0],mouth:'grin'})+creepAt(430,1000,.5,1)+doctor({x:620,y:1000,s:.5,look:[0,0],mouth:'grin'})+creepAt(620,1000,.5,1)+'</g>';
    if(fade<1) for(let i=0;i<22;i++){const r=rng(i+9);ppl+=`<circle cx="${380+r()*300}" cy="${1000-r()*330-(1-fade)*160}" r="${4+r()*6}" fill="#ffe2a8" opacity="${(fade*.9).toFixed(2)}"/>`}}
  s+=ppl;
  s+=A({...HUGO,x:200,y:1010,s:.55,look:[8,-2],mouth:'smile'})+A({...ALBA,x:90,y:1015,s:.58,look:[8,-2],mouth:'smile'})+mama({x:960,y:1010,s:.55,look:[-8,-2],mouth:'smile'});
  if(t>E.dust) s+=tag(540,420,'POLVO',YEL,P(t,E.dust,.2));
  return cam(s,1.04,520,640,540,560);
};
S.home=(t,D,B)=>{ // days later: breakfast, everyone home
  const E=EVS.home(B);
  let s=kitchenK(t,{ring:1e9});
  const fam=[['H',250],['A',390],['M',620],['P',820]];
  fam.forEach(([w,x])=>{s+=w==='H'?A({...HUGO,x,y:1010,s:.6,look:[6,-2],mouth:'smile'}):w==='A'?A({...ALBA,x,y:1015,s:.62,look:[6,-2],mouth:'smile'}):w==='M'?A({...MAMA_DAY,x,y:1010,s:.6,look:[-6,-2],mouth:'smile'}):A({...DAD,x,y:1010,s:.6,look:[-6,-2],mouth:'smile'});});
  if(t>E.count) fam.forEach(([w,x],i)=>{const at=E.count+.3+i*.35;if(t>at) s+=countPop(String(i+1),x,w==='A'?700:560,70,t-at,'#fff')});
  if(t>E.all) s+=tag(540,330,'TODOS ✓',GREEN,P(t,E.all,.2));
  return cam(s,1.06,540,620,540,560);
};
S.fish=(t,D,B)=>{ // the bowl: two identical fish... both turn to look at you
  const E=EVS.fish(B);
  let s=kitchenK(t,{ring:1e9})+`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity="${(.2+.3*prog(t,E.two,D)).toFixed(2)}"/>`;
  s+=fishPair(540,820,1.4,t,prog(t,E.two-.2,E.two+.2),t>E.same);
  const zp=eIO(prog(t,0,D));
  return cam(s,lerp(1.1,1.8,zp),540,lerp(640,600,zp),540,560,t>E.same?shake(t,1-prog(t,E.same,E.same+.4),4):0);
};
window.CFG={steps:['1. NO LES MIRES','2. BUSCA A LOS TUYOS','3. LA PALABRA SECRETA'],listEnd:'run',
  band:{intro:'#0e1018',part:'#07080f',guard:'#0e1018',step1:'#141824',sneak:'#0e1018',step2:'#0e1018',moms:'#0e1018',step3:'#2a2440',wake:'#0e1018',run:'#141824',sun:'#3a3020',home:'#3a3020',fish:'#2a2420'}};

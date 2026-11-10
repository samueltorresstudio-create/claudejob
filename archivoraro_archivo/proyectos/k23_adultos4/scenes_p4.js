// ---------- key times per scene (scene-relative) ----------
const EVS={
  intro:B=>({sister:B[0].w[5],leave:B[0].w[8],push:B[1].s}),
  part:B=>({four:B[0].w[1]}),
  dani:B=>({copy:B[0].w[4],brother:B[0].w[12],escaped:B[1].s,hole:B[1].w[11]}),
  step1:B=>({go:B[0].w[2],enter:B[0].w[6]}),
  escape:B=>({fall:B[0].w[2],kids:B[0].w[6],hole:B[0].w[10],back:B[1].w[2]}),
  window:B=>({alba:B[0].w[3],bye:B[0].w[6],smile:B[0].w[10]}),
  step2:B=>({hide:B[0].w[2],dawn:B[0].w[5]}),
  shop:B=>({nolight:B[0].w[7],nospeak:B[0].w[9],note:B[1].s,back:B[1].w[8]}),
  step3:B=>({follow:B[0].w[2],see:B[0].w[6]}),
  follow:B=>({copies:B[0].w[5],line:B[0].w[9]}),
  metro:B=>({metro:B[0].w[8],old:B[0].w[9]}),
  down:B=>({torch:B[0].w[5]}),
  rows:B=>({hundreds:B[0].w[2],asleep:B[0].w[5],front:B[1].w[1],mom:B[1].w[5]}),
  end:B=>({near:B[0].w[2],open:B[1].w[2]}),
};
const S={};
S.intro=(t,D,B)=>{ // where part 3 ended: fake Alba, Hugo, Dani at the door
  const E=EVS.intro(B);
  let s=classroomK(t,{night:true,h:9,m:1});
  s+=classDoor(820,{open:1,who:A({...NEWKID,x:920,y:1000,s:.66,look:[-8,-2],mouth:'line',brows:'worried'})});
  s+=deskK(560,1000,.9);
  s+=NTC(A({...ALBA,x:560,y:1000,s:.8,look:[-8,-2],mouth:'smile',still:true})+A({...HUGO,x:300,y:1000,s:.7,look:t>E.leave?[10,-2]:[8,-2],brows:'worried',mouth:'o'}))+creepSmall(560,1000,.8,1);
  s+=dark(.45,[[560,620,520,460]]);
  if(t>E.sister&&t<E.leave) s+=tag(560,430,'NO ES ALBA',PINK,P(t,E.sister,.2));
  if(t>E.leave) s+=tag(900,330,'¡VAMOS!',YEL,P(t,E.leave,.2));
  const zp=eIO(prog(t,0,E.leave));
  return cam(s,lerp(1.5,1.06,zp),lerp(560,580,zp),lerp(660,600,zp),540,560);
};
S.part=(t,D,B)=>{
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#07080f"/>`+stars(9,50,900,t,.5);
  s+=`<circle cx="540" cy="560" r="420" fill="url(#glowY)" opacity=".35"/><g opacity=".35">${fenceK(700,1100,{gx:540,col:'#1a1e2e'})}</g>`;
  s+=`<text x="540" y="420" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="40" letter-spacing="6" fill="${YEL}" opacity="${P(t,0,.3).toFixed(2)}">DESAPARECEN LOS ADULTOS</text>`;
  s+=countPop('PARTE 4',540,640,190,t,'#fff')+padlock(540,860,1.1,Math.sin(t*3)*6,0);
  return cam(s,1+.04*t/D,540,600,540,560);
};
S.dani=(t,D,B)=>{
  const E=EVS.dani(B);
  if(t<E.escaped){ // Dani is on their side: he lost his brother too
    let s=classroomK(t,{night:true,h:9,m:2});
    s+=NTC(A({...NEWKID,x:420,y:1060,s:.8,look:[6,-2],brows:'worried',mouth:'line'}));
    s+=dark(.4,[[420,600,300,420]]);
    if(t>E.copy) s+=tag(420,330,'NO ES UNA COPIA',GREEN,P(t,E.copy,.2));
    s+=photoCard(760,560,KIDS[6],'MI HERMANO',P(t,E.brother-.3,.3));
    if(t>E.brother) s+=`<path d="M650,420 L870,700 M870,420 L650,700" stroke="${PINK}" stroke-width="16" stroke-linecap="round" opacity="${P(t,E.brother,.2).toFixed(2)}"/>`;
    return cam(s,1.06,560,600,540,560);
  }
  // the gap in the fence he came through
  let s=yard(t,{});
  s=s.replace(fenceK(380,900,{gx:640,col:'#2a3240'}),fenceHole(380,900,{gx:640,hx:240}));
  const k=prog(t,E.escaped,E.hole);
  s+=NTC(A({...NEWKID,x:lerp(-80,240,k),y:lerp(860,1000,k),s:lerp(.5,.6,k),walk:k<1?t*9:null,look:[8,0]}));
  s+=dark(.35,[[240,700,320,360]]);
  if(t>E.hole) s+=brackets(240,780,180,240,YEL)+tag(240,560,'EL HUECO',YEL,P(t,E.hole,.2));
  return cam(s,1.15,420,640,540,560);
};
S.step1=(t,D,B)=>{ // the woman is turning the padlock: go now
  const E=EVS.step1(B);
  const turn=Math.sin(t*9)*14+t*40;
  const w=mama({x:780,y:880,s:.62,look:[0,0],mouth:'grin',reachL:[(640-780)/.62,(640-880)/.62]});
  let s=yard(t,{people:w+creepAt(780,880,.62,1),lockRot:turn});
  s+=dark(.6,[[780,520,220,260],[640,640,140,140]]);
  if(t>E.go) s+=tag(560,760,'¡AHORA!',YEL,P(t,E.go,.2));
  return cam(s,lerp(1.4,1.8,prog(t,0,D)),680,600,540,560);
};
S.escape=(t,D,B)=>{
  const E=EVS.escape(B);
  if(t<B[1].s){ // the padlock drops; the kids slip out through the gap, one by one
    const fall=prog(t,E.fall-.1,E.fall+.4);
    let s=yard(t,{people:mama({x:780,y:880,s:.62,look:[0,0],mouth:'grin'})+creepAt(780,880,.62,1)});
    s=s.replace(padlock(640,640,.8,0,0),padlock(640+fall*30,640+fall*270,.8,fall*160,1));
    s=s.replace(fenceK(380,900,{gx:640,col:'#2a3240'}),fenceHole(380,900,{gx:640,hx:240}));
    const kids=[[KIDS,1],[KIDS,4],[KIDS,2],['D'],['H']];
    kids.forEach((c,i)=>{const st=E.kids+i*.45, k=prog(t,st,st+1.6);
      if(k<=0||k>=1) return;
      const x=lerp(760,180,k), sc=.55;
      const who=c[0]==='D'?A({...NEWKID,x,y:1010,s:sc,walk:t*10+i,look:[-8,0]}):c[0]==='H'?A({...HUGO,x,y:1010,s:sc,walk:t*10+i,look:[-8,0]}):extra(c[0],c[1],{x,y:1010,s:sc,walk:t*10+i,look:[-8,0]});
      s+=NTC(who);});
    s+=dark(.5,[[240,720,300,320],[780,520,220,260]]);
    if(t>E.fall) s+=bang(660,560,'¡CLANG!',YEL,prog(t,E.fall,E.fall+.1)*(1-prog(t,E.fall+.8,E.fall+1.1)),64);
    if(t>E.hole) s+=tag(240,560,'POR EL HUECO',YEL,P(t,E.hole,.2));
    return cam(s,1.06,500,620,540,560);
  }
  // outside the fence: Hugo stops and looks back at the school
  let s=schoolK(t,true);
  s+=fenceHole(380,900,{hx:240,col:'#2a3240'});
  s+=`<rect x="-600" y="900" width="2280" height="700" fill="#22242e"/>`;
  s+=NTC(A({...HUGO,x:600,y:1100,s:.8,look:t>E.back-.3?[10,-6]:[-8,0],brows:'worried'})+A({...NEWKID,x:300,y:1110,s:.76,look:[-8,0],walk:t*8}));
  s+=dark(.4,[[600,700,360,460]]);
  return cam(s,1.06,540,640,540,560);
};
S.window=(t,D,B)=>{ // in the lit window, "Alba" waves goodbye, smiling
  const E=EVS.window(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#3a2e34"/>`;
  for(let y=-900;y<1500;y+=70) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#000" stroke-opacity=".12" stroke-width="4"/>`;
  const wave=t>E.bye?Math.sin(t*7)*40:0;
  const inside=`<rect x="-600" y="-900" width="2280" height="2400" fill="#ffe2a0"/><rect x="200" y="760" width="700" height="200" fill="#c99a5a"/>`+A({...ALBA,x:540,y:960,s:.95,look:[0,0],mouth:t>E.smile?'grin':'smile',still:true,reachR:t>E.bye?[90+wave*.5,-560]:null})+creepSmall(540,960,.95,1);
  s+=winK(290,300,500,520,inside,{frame:'#e9e2d6'});
  s+=`<circle cx="540" cy="560" r="520" fill="url(#glowY)" opacity=".35"/>`;
  if(t>E.bye) s+=tag(540,880,'ADIÓS, HUGO',PINK,P(t,E.bye,.2));
  const zp=eIO(prog(t,0,D));
  return cam(s,lerp(1.05,1.35,zp),540,lerp(560,600,zp),540,560);
};
S.step2=(t,D,B)=>{ // run to the supermarket through the dark street
  const E=EVS.step2(B);
  let s=NT(streetK(t));
  const x=lerp(-200,900,prog(t,0,D));
  s+=NTC(A({...HUGO,x,y:790,s:.52,walk:t*11,look:[8,0]})+A({...NEWKID,x:x-120,y:790,s:.5,walk:t*11+1,look:[8,0]})+extra(KIDS,2,{x:x-240,y:790,s:.48,walk:t*11+2,look:[8,0]}));
  s+=dark(.45,[[x,640,400,300]]);
  if(t>E.hide) s+=tag(820,420,'AL SÚPER',YEL,P(t,E.hide,.2));
  return cam(s,1.06,540,600,540,560);
};
S.shop=(t,D,B)=>{
  const E=EVS.shop(B);
  if(t<E.note){ // a silent night between the shelves
    let s=NT(shopK(t));
    s+=NTC(extra(KIDS,1,{x:180,y:1000,s:.55,sit:true,eyes:'closed',look:[0,0]})+extra(KIDS,2,{x:330,y:1000,s:.55,sit:true,eyes:'closed',rot:6,look:[0,0]})+A({...NEWKID,x:880,y:1000,s:.58,sit:true,eyes:'closed',look:[0,0]})+A({...HUGO,x:640,y:1000,s:.62,sit:true,look:[-4,2],brows:'worried'}));
    s+=dark(.55,[[600,640,520,360]]);
    if(t>E.nolight) s+=tag(540,330,'SIN LUCES',BLUE,P(t,E.nolight,.2));
    if(t>E.nospeak) s+=tag(540,390,'SIN HABLAR',BLUE,P(t,E.nospeak,.2));
    return cam(s,1.06,540,620,540,560);
  }
  const k=t-E.note;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a2e3a"/>`;
  s+=notebookK(540,620,1.4,[['LECHE x2',1,-1],['PAN x6',1,-1],['AGUA x12',1,-1],['CHOCOLATE x1',1,1],['(PARA ALBA)',1,1],['LO DEVOLVEREMOS',1,1,'#c23a3a']],{size:27});
  s+=`<circle cx="540" cy="620" r="420" fill="url(#glowY)" opacity=".25"/>`;
  if(t>E.back) s+=brackets(800,870,440,90,YEL);
  return cam(s,1+.04*k/(D-E.note),540,620,540,560);
};
function dawnStreet(t){return `<g opacity=".55">${skySunset()}</g>`}
S.step3=(t,D,B)=>{ // at dawn the kids hide behind a car
  const E=EVS.step3(B);
  let s=streetK(t)+dawnStreet(t);
  s+=`<rect x="-600" y="700" width="2280" height="900" fill="#ff9a5a" opacity=".12"/>`;
  s+=A({...HUGO,x:300,y:960,s:.6,look:[10,-2],brows:'worried'})+A({...NEWKID,x:180,y:960,s:.58,look:[10,-2]});
  s+=carK(330,1010,.95,'#3a6ab0',0);
  if(t>E.see) s+=tag(540,420,'SIN QUE TE VEAN',YEL,P(t,E.see,.2));
  return cam(s,1.08,480,640,540,560);
};
S.follow=(t,D,B)=>{ // the copies walk away in a line down the middle of the street
  const E=EVS.follow(B);
  let s=streetK(t)+dawnStreet(t);
  const lineup=[['M',0],['T',1],['A',0],['D',2],['A',3],['A',1]];
  lineup.forEach(([w,i],k)=>{const x=lerp(1250,-500,prog(t,0,D*1.6))+k*230+0;
    const o={x,y:1010,s:.5,walk:t*7+k,look:[-8,0],mouth:'grin'};
    s+=(w==='M'?mama(o):w==='T'?tieMan(o):w==='D'?doctor(o):extra(ADULTS,i,{...o,still:true}))+creepAt(x,1010,.5,1);});
  s+=A({...HUGO,x:80,y:820,s:.48,look:[10,0],brows:'worried'})+carK(120,860,.75,'#e2453b',0);
  if(t>E.copies) s+=tag(700,420,'LAS COPIAS',PINK,P(t,E.copies,.2));
  if(t>E.line) s+=tag(700,480,'EN FILA',PINK,P(t,E.line,.2));
  return cam(s,1.04,540,640,540,560);
};
function metroEntrance(t){ // street-level entrance: railings, a red M sign and stairs going down into the dark
  let s=`<rect x="300" y="760" width="480" height="300" fill="#0b0c12"/>`;
  for(let i=0;i<6;i++) s+=`<rect x="${300+i*14}" y="${770+i*46}" width="${480-i*28}" height="10" fill="#2a2e3a" opacity="${(1-i*.15).toFixed(2)}"/>`;
  s+=`<rect x="280" y="700" width="20" height="360" fill="#5a6070"/><rect x="780" y="700" width="20" height="360" fill="#5a6070"/><rect x="280" y="700" width="520" height="16" fill="#5a6070"/>`;
  s+=`<rect x="836" y="420" width="16" height="300" fill="#3a3e4a"/><rect x="784" y="330" width="120" height="120" rx="14" fill="#c23a3a" transform="rotate(45 844 390)"/><text x="844" y="414" text-anchor="middle" font-family="Inter" font-weight="900" font-size="72" fill="#fff">M</text>`;
  return s}
S.metro=(t,D,B)=>{ // they go down the stairs of an abandoned station
  const E=EVS.metro(B);
  let s=streetK(t)+dawnStreet(t)+metroEntrance(t);
  ['M','T','D'].forEach((w,k)=>{const p=prog(t,k*.7,k*.7+2.2);if(p>=1) return;
    const x=lerp(700,540,p), y=lerp(1000,1150,p), sc=lerp(.45,.4,p);
    const o={x,y,s:sc,walk:t*6+k,look:[-6,2],mouth:'grin',op:1-p*.6};
    s+=`<g clip-path="none">${w==='M'?mama(o):w==='T'?tieMan(o):doctor(o)}</g>`;});
  s+=`<rect x="300" y="1060" width="480" height="300" fill="#0b0c12"/>`;
  if(t>E.metro) s+=tag(844,560,'METRO',YEL,P(t,E.metro,.2));
  if(t>E.old) s+=tag(844,620,'CERRADO DESDE 1998',PINK,P(t,E.old,.2));
  return cam(s,1.06,600,640,540,560);
};
S.down=(t,D,B)=>{ // Hugo goes down after them with the torch
  const E=EVS.down(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0e1018"/>`;
  for(let i=0;i<14;i++) s+=`<rect x="${-200+i*90}" y="${420+i*48}" width="1400" height="14" fill="#1e2230"/>`;
  const k=prog(t,0,D), x=lerp(160,620,k), y=lerp(820,1080,k);
  s+=`<polygon points="${x+80},${y-430} ${x+900},${y-700} ${x+900},${y+60}" fill="#fff6c8" opacity="${t>E.torch?.22:.08}"/>`;
  s+=NTC(A({...HUGO,x,y,s:.66,walk:t*7,look:[10,2],brows:'worried',reachR:[200,-420]})+A({...NEWKID,x:x-170,y:y-90,s:.6,walk:t*7+1,look:[10,2],brows:'worried'}));
  s+=`<g transform="translate(${x+128},${y-275}) rotate(-20)"><rect x="-40" y="-14" width="90" height="28" rx="8" fill="#3a3f52"/><rect x="46" y="-18" width="12" height="36" rx="4" fill="${YEL}"/></g>`;
  s+=dark(.55,[[x+300,y-300,520,320]]);
  return cam(s,1.06,540,640,540,560);
};
S.rows=(t,D,B)=>{ // hundreds of adults, asleep on their feet — and mum at the front
  const E=EVS.rows(B);
  let s=metroK(t)+sleepers(t);
  s+=mama({x:540,y:980,s:.62,eyes:'closed',look:[0,0],mouth:'line'});
  const beam=t>E.front?[[540,640,240,320]]:[[540,700,700,380]];
  s+=dark(.62,beam);
  if(t>E.hundreds&&t<E.front) s+=tag(840,600,'CIENTOS',PINK,P(t,E.hundreds,.2));
  if(t>E.asleep&&t<E.front) s+=tag(840,660,'DORMIDOS · DE PIE',PINK,P(t,E.asleep,.2));
  if(t>E.mom) s+=brackets(540,620,200,260,YEL)+tag(540,430,'MAMÁ',YEL,P(t,E.mom,.2));
  const zp=eIO(prog(t,E.front-.2,E.mom+.4));
  return cam(s,lerp(1.05,1.6,zp),540,lerp(640,640,zp),540,560);
};
S.end=(t,D,B)=>{ // Hugo steps closer... and she opens her eyes. Black.
  const E=EVS.end(B), op=t>E.open;
  let s=metroK(t)+sleepers(t);
  s+=mama({x:600,y:980,s:.62,eyes:op?'open':'closed',look:[0,0],mouth:'line'})+creepAt(600,980,.62,op?1:0);
  const hx=lerp(60,330,eOut(prog(t,0,E.near+.8)));
  s+=NTC(A({...HUGO,x:hx,y:1000,s:.6,walk:t<E.near+.8?t*6:null,look:[8,-4],brows:'worried',mouth:op?'o':'line'}));
  s+=dark(.6,[[520,660,320,380]]);
  const zp=eIO(prog(t,E.open-.1,E.open+.3));
  return cam(s,lerp(1.3,2.2,zp),lerp(500,600,zp),lerp(660,600,zp),540,560,op?shake(t,1-prog(t,E.open,E.open+.4),5):0);
};
window.CFG={steps:['1. HUYE','2. ESCÓNDETE','3. SÍGUELOS'],listEnd:'rows',
  band:{intro:'#0a0b12',part:'#07080f',dani:'#0e1020',step1:'#08090e',escape:'#0a0b12',window:'#2a2028',step2:'#0e1020',shop:'#141628',step3:'#3a2a30',follow:'#3a2a30',metro:'#3a2a30',down:'#0a0b10',rows:'#0e1018',end:'#0a0b10'}};

// ---------- key times per scene (scene-relative) ----------
const EVS={
  intro:B=>({pre:B[0].w[7],survive:B[1].w[8]}),
  id:B=>({age:B[0].w[1]}),
  museum:B=>({asleep:B[0].w[3],museum:B[0].w[6],trip:B[0].w[9]}),
  cave:B=>({wake:B[0].w[2],cave:B[0].w[5],phone:B[0].w[8],bat:B[0].w[11]}),
  outside:B=>({nob:B[0].w[3],jungle:B[0].w[5],volc:B[0].w[6],roar:B[0].w[9]}),
  step1:B=>({fire:B[0].w[4],see:B[0].w[7],smoke:B[1].s,far:B[1].w[6],hungry:B[1].w[14]}),
  tiger:B=>({tiger:B[0].w[1],fangs:B[0].w[5],sniff:B[0].w[6]}),
  step2:B=>({birds:B[0].w[5],water:B[0].w[8],dawn:B[1].s,flock:B[1].w[3],valley:B[1].w[7],follow:B[1].w[11]}),
  river:B=>({river:B[0].w[2],clean:B[0].w[4],prints:B[0].w[6],mud:B[0].w[10]}),
  step3:B=>({herd:B[0].w[7],mam:B[1].w[3],giants:B[1].w[8],calm:B[1].w[9]}),
  snap:B=>({back:B[0].w[3],crack:B[0].w[8],lift:B[1].w[2],lie:B[1].w[7],hold:B[1].w[12]}),
  step4:B=>({humans:B[0].w[5],care:B[0].w[8],sunset:B[1].s,smoke:B[1].w[3],camp:B[1].w[5],spears:B[1].w[7]}),
  hunters:B=>({ring:B[0].w[3],aim:B[0].w[6],phone:B[1].w[3],light:B[1].w[5],kneel:B[2].w[3],fire:B[2].w[8]}),
  sacred:B=>({night:B[0].w[1],sacred:B[0].w[7],paint:B[1].w[4],bison:B[1].w[5],mam:B[1].w[6],hunt:B[1].w[7]}),
  end:B=>({kid:B[0].w[5],face:B[0].w[8],light:B[0].w[11],old:B[1].w[4],before:B[1].w[9]}),
};

const S={};
S.intro=(t,D,B)=>{ // the prehistoric valley; Teo alone on a rock
  const E=EVS.intro(B);
  let s=skyPre(0)+clouds(t,3,.9)+volcano(800,720,1.25,t)+birds(lerp(-100,1200,(t*.08)%1),300,t,7,5)+jungleBack(t,760,'#4f8a4a');
  s+=palm(90,900,1.05,t,0)+palm(1010,920,1.15,t,1.2,'#357a42')+rock(540,960,1.2,'#6a5a50');
  const look=Math.sin(t*1.1)>0?[9,-3]:[-9,-3];
  s+=A({...TEO,x:540,y:850,s:.6,look,brows:t>B[1].s?'worried':null,mouth:t>B[1].s?'o':'line'});
  s+=fern(250,1000,1.1,t,0)+fern(860,1010,1.2,t,2)+leaves(t,2,7);
  if(t>E.pre) s+=tag(540,330,'30.000 AÑOS ATRÁS',YEL,P(t,E.pre,.2)*(1-P(t,B[1].s,.2)));
  const zp=eIO(prog(t,0,D));
  return cam(s,lerp(1.02,1.35,zp),lerp(560,540,zp),lerp(600,640,zp),540,560,t>E.survive?shake(t,.3,3):0);
};
S.id=(t,D,B)=>{const E=EVS.id(B);
  return idCard(t,D,{who:TEO,header:'IDENTIFICACIÓN',col:'#e07b3b',name:'TEO',age:'12',ageAt:E.age,rows:[['EXCURSIÓN','MUSEO DE CIENCIAS',.5,'#1f2a3a'],['ESTADO','PERDIDO EN EL TIEMPO',E.age+.4,'#c23a3a']],h:500});};
S.museum=(t,D,B)=>{ // asleep on the bench in front of the mammoth skeleton while the class leaves
  const E=EVS.museum(B), dim=prog(t,E.trip,D);
  let s=museum(t,{dim});
  s+=`<rect x="80" y="880" width="380" height="30" rx="8" fill="#6a5040"/><rect x="100" y="910" width="18" height="70" fill="#4a3428"/><rect x="420" y="910" width="18" height="70" fill="#4a3428"/>`;
  s+=A({...TEO,x:260,y:1060,s:.62,sit:true,eyes:'closed',tilt:-14,look:[0,0],still:true});
  for(let i=0;i<3;i++){const p=(t*.5+i/3)%1;s+=`<text x="${330+p*60}" y="${560-p*110}" font-family="${MONO}" font-weight="800" font-size="${34+p*20}" fill="#6a5a50" opacity="${Math.sin(p*Math.PI).toFixed(2)}">z</text>`}
  const kx=lerp(700,1250,prog(t,.3,D));
  s+=extra(KIDS,1,{x:kx,y:1000,s:.5,walk:t*9,look:[8,0]})+extra(KIDS,2,{x:kx+130,y:1005,s:.5,walk:t*9+1,look:[8,0]})+extra(KIDS,6,{x:kx-140,y:1000,s:.5,walk:t*9+2,look:[8,0]});
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a0c18" opacity="${(.65*dim).toFixed(2)}"/>`;
  return cam(s,lerp(1.05,1.2,prog(t,0,D)),lerp(520,420,prog(t,0,D)),620,540,560);
};
function phoneBattery(t){ // phone screen: no signal, 3 % battery blinking
  const on=Math.floor(t*2.5)%2;
  return `<rect width="280" height="590" fill="#1a2440"/><text x="26" y="44" font-family="Inter" font-weight="700" font-size="20" fill="#fff">--:--</text><text x="140" y="44" text-anchor="middle" font-family="Inter" font-weight="700" font-size="16" fill="#ff8a8a">SIN SERVICIO</text>`
   +`<rect x="214" y="28" width="38" height="18" rx="5" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="218" y="32" width="3" height="10" fill="${PINK}"/>`
   +`<text x="140" y="250" text-anchor="middle" font-family="Inter" font-weight="900" font-size="110" fill="${on?PINK:'#ff8aa0'}">3%</text><text x="140" y="310" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="20" fill="#fff">BATERÍA BAJA</text>`
   +`<rect x="60" y="420" width="160" height="60" rx="30" fill="#fff" opacity=".15"/><text x="140" y="458" text-anchor="middle" font-family="Inter" font-weight="800" font-size="22" fill="#fff">🔦 LINTERNA</text>`}
S.cave=(t,D,B)=>{
  const E=EVS.cave(B);
  if(t<E.phone-.15){ // waking up in a cave
    const out=skyPre(0)+jungleBack(t,700,'#5a9a52')+volcano(560,720,.9,t);
    let s=caveIn(t,{outside:out})+rock(170,930,1.1)+rock(930,950,1.2,'#3f2f28');
    const up=eOut(prog(t,E.wake-.4,E.wake+.6));
    s+=A({...TEO,x:520,y:1070,s:.66,sit:true,eyes:t<E.wake?'closed':'wide',tilt:lerp(-30,0,up),look:t>E.cave?[Math.sin(t*2)*9,-3]:[0,0],brows:t>E.cave?'worried':null,mouth:t>E.cave?'o':'line'});
    if(t>E.cave) s+=tag(540,430,'UNA CUEVA',YEL,P(t,E.cave,.2));
    return cam(s,lerp(1.15,1.05,up),540,lerp(680,640,up),540,560);
  }
  // the phone
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a1e1a"/>`+motes(t,7,16,[100,200,880,700]);
  s+=handsPhone(540,560,1.15,phoneBattery(t),TEO.skin,TEO.top);
  if(t>E.bat) s+=tag(540,960,'3 % DE BATERÍA',PINK,P(t,E.bat,.2));
  return cam(s,lerp(1,1.08,prog(t,E.phone,D)),540,560,540,560);
};
S.outside=(t,D,B)=>{ // no buildings: jungle, volcanoes... and a roar
  const E=EVS.outside(B), roar=t>E.roar;
  let s=skyPre(.15)+clouds(t,5,.8)+volcano(260,700,.9,t,{glow:.6})+volcano(860,740,1.3,t)+jungleBack(t,720,'#4f8a4a');
  s+=palm(150,860,1.2,t,0)+palm(950,880,1.3,t,1.4,'#357a42');
  if(roar){s+=birds(540+(t-E.roar)*220,520-(t-E.roar)*120,t,14,8,420);s+=soundArcs(540,700,t,'#fff',1)+soundArcs(540,700,t,'#fff',-1);}
  s+=`<path d="M-600,880 Q540,840 1680,890 L1680,1600 L-600,1600Z" fill="#4a3a30"/>`;
  s+=A({...TEO,x:540,y:1000,s:.6,look:roar?[0,-6]:[Math.sin(t*1.5)*9,-4],eyes:roar?'wide':'open',brows:roar?'worried':null,mouth:roar?'o':'line'});
  s+=fern(140,1030,1,t,1)+fern(940,1040,1.1,t,3)+leaves(t,6,6);
  if(t>E.nob&&t<E.jungle) s+=tag(540,430,'0 EDIFICIOS',YEL,P(t,E.nob,.2));
  if(roar) s+=bang(540,470,'¡GRRR!',PINK,P(t,E.roar,.15),80);
  const zp=eIO(prog(t,0,E.roar));
  return cam(s,lerp(1.25,1.05,zp),540,lerp(700,620,zp),540,560,roar?shake(t,1-prog(t,E.roar,E.roar+1.2),10):0);
};
S.step1=(t,D,B)=>{
  const E=EVS.step1(B);
  if(t<E.smoke){ // a small fire inside the cave
    const out=skyPre(2)+stars(4,40,600,t,.6);
    let s=caveIn(t,{outside:out,light:false})+rock(940,950,1.2,'#3f2f28');
    const fa=eOut(prog(t,E.fire-.3,E.fire+.6));
    s+=fire(620,960,.9,t,fa);
    s+=smokeCol(620,880,t,.9*fa,'#6a6268');
    s+=NTC(A({...TEO,x:400,y:1060,s:.66,sit:true,look:[8,2],reachR:[180,-260],mouth:'line'}));
    s+=dark(.45,[[600,760,380,320]]);
    if(t>E.see) s+=tag(560,430,'EL HUMO SALE FUERA',PINK,P(t,E.see,.2));
    return cam(s,1.08,540,640,540,560);
  }
  // from far away: the smoke over the cliff... and eyes in the dark
  let s=skyPre(2)+stars(5,60,700,t,.7);
  s+=`<path d="M-600,1000 L-600,560 Q100,520 300,600 Q500,700 1680,640 L1680,1000Z" fill="#2a2a3a"/><ellipse cx="300" cy="700" rx="70" ry="50" fill="#0a0a12"/><ellipse cx="300" cy="700" rx="60" ry="40" fill="#ff8a2a" opacity="${(.35+.1*Math.sin(t*9)).toFixed(2)}"/>`;
  s+=smokeCol(320,640,t,1.4,'#5a5868');
  s+=jungleBack(t,900,'#1a2a24');
  if(t>E.hungry-.4){const a=P(t,E.hungry-.4,.4);for(const [ex,ey] of [[760,860],[860,880]]) s+=`<g opacity="${(a*(.6+.4*Math.abs(Math.sin(t*2)))).toFixed(2)}"><ellipse cx="${ex}" cy="${ey}" rx="16" ry="10" fill="#ffd34a"/><ellipse cx="${ex+44}" cy="${ey}" rx="16" ry="10" fill="#ffd34a"/><ellipse cx="${ex}" cy="${ey}" rx="4" ry="9" fill="#1a1414"/><ellipse cx="${ex+44}" cy="${ey}" rx="4" ry="9" fill="#1a1414"/></g>`;}
  if(t>E.far) s+=tag(700,500,'SE VE DESDE LEJOS',YEL,P(t,E.far,.2));
  return cam(s,lerp(1.05,1.25,prog(t,E.smoke,D)),lerp(420,760,eIO(prog(t,E.hungry-1,D))),640,540,560);
};
S.tiger=(t,D,B)=>{ // a sabre-tooth sniffs at the cave mouth; Teo hides behind a rock
  const E=EVS.tiger(B);
  const out=skyPre(2)+stars(6,40,600,t,.5)+`<rect x="-600" y="700" width="2280" height="900" fill="#1a2a24"/>`;
  let s=caveIn(t,{outside:out,light:false});
  const tx=lerp(1100,700,eOut(prog(t,0,E.fangs+.6)));
  s+=NTC(tiger(tx,880,.85,t,{walk:t<E.fangs+.6?t*6:null,sniff:prog(t,E.sniff-.3,E.sniff+.4),glow:true}));
  s+=smokeCol(330,900,t,.4,'#4a4448');
  s+=NTC(A({...TEO,x:220,y:1080,s:.64,sit:true,look:[10,-2],eyes:'wide',brows:'worried',mouth:'line',handle:[0,-560]}))+rock(260,1060,1.3,'#2a201c');
  s+=dark(.35,[[700,700,420,320]]);
  if(t>E.fangs) s+=tag(600,430,'DIENTES DE SABLE',PINK,P(t,E.fangs,.2));
  return cam(s,lerp(1.05,1.2,prog(t,0,D)),lerp(560,520,prog(t,0,D)),640,540,560);
};
S.step2=(t,D,B)=>{ // dawn: a flock flies to the valley and Teo follows it
  const E=EVS.step2(B), k=prog(t,E.dawn,D);
  let s=skyPre(lerp(.6,.25,prog(t,0,D)))+`<circle cx="840" cy="${lerp(820,600,prog(t,0,D))}" r="110" fill="#ffd27a"/><circle cx="840" cy="${lerp(820,600,prog(t,0,D))}" r="230" fill="url(#glowY)"/>`;
  s+=volcano(200,760,.8,t,{glow:.4})+jungleBack(t,760,'#4f8a4a');
  s+=birds(lerp(-100,1180,prog(t,.2,D)),lerp(420,330,prog(t,.2,D)),t,16,9,360);
  s+=`<path d="M-600,900 Q540,860 1680,910 L1680,1600 L-600,1600Z" fill="#6a5a3a"/>`;
  const tx=lerp(-80,760,eIO(k));
  if(t>E.dawn-.3) s+=A({...TEO,x:tx,y:960,s:.56,walk:k<1?t*8:null,look:[8,-6],mouth:'line'});
  s+=fern(80,1020,1,t,0)+fern(1000,1030,1.1,t,2)+leaves(t,3,6);
  if(t>E.birds&&t<E.dawn) s+=tag(700,520,'PÁJAROS = AGUA',BLUE,P(t,E.birds,.2));
  if(t>E.valley) s+=tag(860,430,'EL VALLE →',YEL,P(t,E.valley,.2));
  return cam(s,1.06,lerp(480,620,prog(t,0,D)),620,540,560);
};
S.river=(t,D,B)=>{ // the river: clean water... and huge prints in the mud
  const E=EVS.river(B);
  let s=skyPre(.1)+clouds(t,7,.8)+jungleBack(t,560,'#4f8a4a')+palm(900,640,.9,t,1);
  s+=river(t,600,760)+`<rect x="-600" y="760" width="2280" height="900" fill="#7a5a3a"/><path d="M-600,760 Q540,790 1680,760" stroke="#5a3e2a" stroke-width="20" fill="none"/>`;
  const prints=[[260,960],[460,900],[660,970],[860,905]];
  prints.forEach(([x,y],i)=>{s+=footprint(x,y,1.15,P(t,E.prints+i*.18,.25))});
  s+=A({...TEO,x:120,y:960,s:.58,look:t>E.prints?[10,6]:[10,-2],eyes:t>E.prints?'wide':'open',mouth:t>E.prints?'o':'smile'});
  if(t>E.clean&&t<E.prints) s+=tag(540,520,'AGUA LIMPIA',BLUE,P(t,E.clean,.2));
  if(t>E.prints) s+=brackets(560,935,700,170,PINK)+tag(560,820,'HUELLAS ENORMES',PINK,P(t,E.prints,.2));
  return cam(s,lerp(1.05,1.2,prog(t,E.prints-.3,D)),lerp(540,560,prog(t,0,D)),lerp(620,700,eIO(prog(t,E.prints-.3,D))),540,560);
};
const HERD=[{x:560,s:.62,ph:0,c:'#7a4a2a'},{x:900,s:.7,ph:1.5,c:'#6a3e24'},{x:1260,s:.6,ph:3,c:'#83502e'},{x:760,s:.34,ph:2,c:'#9a6038',baby:true}];
function herd(t,lift,y=820){let s='';HERD.forEach((m,i)=>{const L=clamp(lift*(1+i*.15));s+=mammoth(m.x,y+(m.baby?20:0),m.s,t+m.ph,{lift:L,drink:L>.1?0:clamp(.5+.5*Math.sin(t*.8+m.ph)),col:m.c,dir:-1})});return s}
S.step3=(t,D,B)=>{ // the mammoth herd drinking at the shore
  const E=EVS.step3(B);
  let s=skyPre(.1)+clouds(t,8,.8)+volcano(980,600,.8,t,{glow:.3})+jungleBack(t,560,'#4f8a4a');
  s+=river(t,600,760)+`<rect x="-600" y="760" width="2280" height="900" fill="#7a5a3a"/>`;
  s+=herd(t,0);
  s+=fern(140,1010,1.3,t,0)+A({...TEO,x:120,y:1000,s:.5,look:[10,-3],brows:'worried'})+fern(40,1040,1.2,t,1.5)+leaves(t,9,5);
  if(t>E.mam) s+=tag(760,330,'MAMUTS',YEL,P(t,E.mam,.2));
  if(t>E.giants) s+=tag(760,390,'4 METROS',PINK,P(t,E.giants,.2));
  return cam(s,lerp(1.15,1.02,eIO(prog(t,0,D))),lerp(700,620,prog(t,0,D)),640,540,560);
};
S.snap=(t,D,B)=>{ // a twig snaps; the mammoths lift their heads; Teo lies flat in the grass
  const E=EVS.snap(B), lift=eOut(prog(t,E.lift-.4,E.lift+.4))*(1-prog(t,E.hold,D+1));
  let s=skyPre(.1)+jungleBack(t,560,'#4f8a4a')+river(t,600,760)+`<rect x="-600" y="760" width="2280" height="900" fill="#7a5a3a"/>`;
  s+=herd(t,lift);
  if(t>E.lift) s+=soundArcs(800,520,t,'#fff',-1)+bang(780,460,'¡HRAAA!',PINK,P(t,E.lift,.15)*(1-P(t,E.lift+1.2,.3)),56);
  const down=eIO(prog(t,E.lie-.2,E.lie+.6));
  const bx=lerp(240,180,prog(t,E.back-.3,E.crack));
  s+=A({...TEO,x:bx,y:1000+down*30,s:.55,rot:down*82,look:t>E.crack?[10,-4]:[6,-2],eyes:t>E.crack?'wide':'open',brows:t>E.crack?'worried':null,mouth:t>E.crack&&down<.5?'o':'line'});
  if(t>E.crack){s+=`<path d="M150,1000 L190,990 M196,996 L240,1004" stroke="#5a3a24" stroke-width="10" stroke-linecap="round"/>`+bang(220,900,'¡CRAC!',YEL,P(t,E.crack,.12)*(1-P(t,E.crack+.8,.3)),58);}
  s+=grassFront(1080,t,'#5a8a3a',lerp(120,220,down));
  if(t>E.hold) s+=tag(540,960,'SIN RESPIRAR',BLUE,P(t,E.hold,.2));
  return cam(s,1.06,lerp(560,520,down),660,540,560,t>E.crack&&t<E.crack+.4?shake(t,1,5):0);
};
S.step4=(t,D,B)=>{
  const E=EVS.step4(B);
  if(t<E.camp){ // sunset on a hill: a thin column of smoke in the distance
    let s=skyPre(1)+`<circle cx="540" cy="760" r="140" fill="#ffb05a"/><circle cx="540" cy="760" r="300" fill="url(#glowY)"/>`;
    s+=`<path d="M-600,760 Q300,700 600,740 Q900,780 1680,720 L1680,1600 L-600,1600Z" fill="#5a3a3a"/>`+smokeCol(820,730,t,.8,'#6a5a62');
    s+=`<path d="M-600,960 Q540,860 1680,980 L1680,1600 L-600,1600Z" fill="#3a2a2a"/>`;
    s+=L('sunset',A({...TEO,x:300,y:940,s:.6,look:[10,-2],mouth:t>E.smoke?'o':'line'}));
    if(t>E.smoke) s+=brackets(830,600,140,240,YEL)+tag(830,450,'HUMO',YEL,P(t,E.smoke,.2));
    if(t>E.care&&t<E.sunset) s+=tag(540,430,'CON CUIDADO',PINK,P(t,E.care,.2));
    return cam(s,lerp(1.05,1.2,prog(t,0,E.camp)),lerp(540,620,prog(t,0,E.camp)),620,540,560);
  }
  // the camp: tents, a fire, spears, skins
  let s=skyPre(1.3)+`<rect x="-600" y="760" width="2280" height="900" fill="#4a3428"/>`;
  s+=tent(240,860,1,'#9a6a3a')+tent(840,850,1.1,'#8a5a30')+fire(540,900,.9,t,1);
  for(let i=0;i<5;i++) s+=`<line x1="${640+i*18}" y1="900" x2="${700+i*26}" y2="${560+i*6}" stroke="#7a5a3a" stroke-width="9" stroke-linecap="round"/><polygon points="${700+i*26},${560+i*6} ${692+i*26},${590+i*6} ${712+i*26},${588+i*6}" fill="#5a5e6a"/>`;
  s+=`<rect x="380" y="640" width="12" height="260" fill="#5a3a24"/><rect x="560" y="640" width="12" height="260" fill="#5a3a24"/><rect x="370" y="636" width="212" height="10" fill="#5a3a24"/><path d="M400,650 L470,650 L480,740 L392,760Z" fill="#c99a6a"/>`;
  s+=dark(.3,[[540,800,520,320]]);
  if(t>E.spears) s+=tag(760,520,'LANZAS',PINK,P(t,E.spears,.2));
  return cam(s,1.06,540,660,540,560);
};
S.hunters=(t,D,B)=>{ // the hunters surround him; the torch of his phone; they kneel
  const E=EVS.hunters(B);
  const ring=eOut(prog(t,0,E.ring+.4)), light=t>E.light, kn=eIO(prog(t,E.kneel-.5,E.kneel+.4));
  let s=skyPre(1.4)+`<rect x="-600" y="760" width="2280" height="900" fill="#3a2a22"/>`+tent(900,790,.8,'#8a5a30')+fire(140,880,.7,t,1);
  const H=[[lerp(-200,170,ring),1010,.6,1,0],[lerp(1280,910,ring),1010,.6,-1,1],[lerp(-100,300,ring),880,.48,1,2],[lerp(1200,790,ring),880,.48,-1,3]];
  H.filter(h=>h[1]<900).forEach(([x,y,sc,dir,i])=>{s+=hunter({x,y,s:sc,dir,i,spear:t>E.aim?-4:-30,kneel:kn,eyes:light?'wide':'open',brows:light?'up':'angry',mouth:light?'o':'line'})});
  s+=A({...TEO,x:540,y:960,s:.62,look:light?[4,-4]:[Math.sin(t*3)*9,-2],eyes:t<E.phone?'wide':'open',brows:light?null:'worried',mouth:'line',
    reachR:t>E.phone?[150,-560]:null,phoneR:t>E.phone,flash:light?{dir:-70,len:820,w:150}:null});
  H.filter(h=>h[1]>=900).forEach(([x,y,sc,dir,i])=>{s+=hunter({x,y,s:sc,dir,i,spear:t>E.aim?-6:-30,kneel:kn,eyes:light?'wide':'open',brows:light?'up':'angry',mouth:light?'o':'line'})});
  if(light) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#fff6c8" opacity="${(.25*(1-prog(t,E.light,E.light+.5))).toFixed(2)}"/>`;
  s+=dark(light?.25:.45,[[540,700,560,420],[140,800,200,200]]);
  if(t>E.aim&&!light) s+=tag(540,430,'RODEADO',PINK,P(t,E.aim,.2));
  if(t>E.kneel) s+=tag(540,560,'«FUEGO EN LA MANO»',YEL,P(t,E.fire-.6,.2));
  return cam(s,lerp(1.1,1.02,ring),540,640,540,560,t>E.aim&&t<E.light?shake(t,.3,3):0);
};
S.sacred=(t,D,B)=>{ // the sacred cave: torchlight sweeps across the paintings
  const E=EVS.sacred(B);
  let s=caveWall(t);
  s+=paintBison(250,520,1.3,P(t,E.bison-.2,.4))+paintMammoth(800,500,1.2,P(t,E.mam-.2,.4))+paintHunter(560,700,1.1,P(t,E.hunt-.2,.4))+paintHunter(680,720,1,P(t,E.hunt,.4),-1);
  s+=paintHand(140,800,1.2,P(t,E.paint,.4))+paintHand(960,820,1,P(t,E.paint+.3,.4));
  s+=paintKid(540,560,1,P(t,0,.01)*0,t);
  const lx=t<E.paint?540:lerp(250,800,eIO(prog(t,E.bison-.3,E.hunt+.6)));
  s+=torch(120,1000,1,t)+torch(960,1000,1,t);
  s+=dark(.7,[[lx,600,360,360],[120,880,180,200],[960,880,180,200]],'#120a06');
  if(t<E.paint){s+=A({...TEO,x:540,y:1080,s:.66,look:[0,-6],eyes:'wide',mouth:'o'});s+=hunter({x:300,y:1080,s:.6,dir:1,i:0,kneel:0,spear:-70,brows:null,eyes:'open'});}
  if(t>E.sacred&&t<E.paint) s+=tag(540,430,'CUEVA SAGRADA',YEL,P(t,E.sacred,.2));
  return cam(s,1.04+.04*prog(t,0,D),540,640,540,560);
};
S.end=(t,D,B)=>{ // the boy in the centre, with Teo's face and a light in his hand
  const E=EVS.end(B);
  let s=caveWall(t)+paintBison(150,520,1.1,1)+paintMammoth(930,500,1,1)+paintHunter(300,780,.9,1)+paintHunter(800,790,.9,1,-1);
  s+=paintKid(540,620,1.4,P(t,E.kid-.3,.6),t);
  if(t>E.face) s+=brackets(540,620-120*1.4,180,180,PINK);
  if(t>E.light) s+=`<circle cx="${540+73*1.4}" cy="${620-68*1.4}" r="150" fill="url(#glowY)" opacity="${(.6+.3*Math.sin(t*5)).toFixed(2)}"/>`;
  s+=torch(120,1000,1,t)+torch(960,1000,1,t);
  for(let i=0;i<10;i++){const p=((t*.15+i/10)%1);s+=`<circle cx="${200+i*70}" cy="${100+p*800}" r="2.5" fill="#d9c0a0" opacity="${(.5*Math.sin(p*Math.PI)).toFixed(2)}"/>`}
  s+=dark(.5,[[540,560,420,460],[120,880,180,200],[960,880,180,200]],'#120a06');
  if(t>E.old) s+=tag(540,960,'MUY ANTIGUA',PINK,P(t,E.old,.2));
  const zp=eIO(prog(t,E.before-1.2,D));
  return cam(s,lerp(1.05,1.9,zp),540,lerp(600,450,zp),540,560);
};
window.CFG={steps:['1. SIN FUEGO','2. SIGUE A LOS PÁJAROS','3. LEJOS DE LA MANADA','4. BUSCA HUMANOS'],listEnd:'sacred',
  band:{intro:'#3a5a3a',id:'#181b34',museum:'#4a3a2a',cave:'#2a1e1a',outside:'#3a3a2a',step1:'#14121e',tiger:'#14121e',step2:'#4a3a2a',river:'#4a3a2a',step3:'#4a3a2a',snap:'#3a4a2a',step4:'#3a2422',hunters:'#2a1e1a',sacred:'#2a1a12',end:'#1a100a'}};

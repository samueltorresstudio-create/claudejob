// ================= EL SILBÓN · PARTE 2 ================= (estilo 2D original, mejorado). Reusa silbon.js + sb_sets.js de la parte 1.
const EVS={
  hook:B=>({silbon:B[0].w[3],huesos:B[0].w[5],puerta:B[0].w[8],tranq:B[0].w[9],salvas:B[0].w[12]}),
  hook2:B=>({problema:B[0].w[1],duerme:B[0].w[4],lado:B[0].w[7]}),
  nohear:B=>({mateo:B[0].w[0],todo:B[0].w[3],abuela:B[0].w[5],no:B[0].w[12],nada:B[0].w[14]}),
  rule0:B=>({ella:B[0].w[2],contar:B[0].w[11],vera:B[0].w[13],amanecer:B[0].w[15]}),
  seven:B=>({tres:B[0].w[2],siete:B[0].w[6]}),
  hand:B=>({aprieta:B[0].w[2],abuela:B[0].w[5],escucha:B[0].w[6]}),
  scratch:B=>({para:B[0].w[4],ruido:B[0].w[8],rasca:B[0].w[10],gime:B[0].w[14],perro:B[0].w[17]}),
  rule4:B=>({rasca:B[0].w[3],ladra:B[0].w[6],perro:B[0].w[10]}),
  wakeup:B=>({desp:B[0].w[3],canelo:B[0].w[5],frio:B[0].w[8],levanta:B[0].w[11],abrir:B[0].w[13]}),
  whip:B=>({desc:B[0].w[1],latigo:B[0].w[3],pone:B[0].w[8],puerta:B[0].w[12]}),
  bark:B=>({ladra:B[0].w[2],loco:B[0].w[4],atras:B[0].w[9]}),
  still:B=>({puerta:B[0].w[3],siguen:B[0].w[6]}),
  rule5:B=>({lejos:B[0].w[6],cerca:B[0].w[10],silbon:B[0].w[16]}),
  crack:B=>({chas:B[0].w[2],suelo:B[0].w[7],c1:B[0].w[8],c2:B[0].w[9],c3:B[0].w[10]}),
  silence:B=>({paran:B[0].w[2],silencio:B[0].w[3]}),
  rule6:B=>({pare:B[0].w[3],ido:B[0].w[9]}),
  count2:B=>({fuera:B[0].w[1],voz:B[0].w[3],n10:B[0].w[7],n11:B[0].w[8],n12:B[0].w[9]}),
  smile:B=>({sonrie:B[0].w[5],ves:B[0].w[6],ido:B[0].w[10],nada:B[0].w[14]}),
  dawn:B=>({sol:B[0].w[5],canelo:B[0].w[6],cola:B[0].w[10]}),
  dead:B=>({abuela:B[0].w[1],no:B[0].w[2],desp:B[0].w[4]}),
  end:B=>({noche:B[0].w[1],tres:B[0].w[4],silbar:B[0].w[7],lejos:B[0].w[8],muy:B[0].w[10]}),
};
const S={};
const s2Face=(x,y,s)=>[x+60*s,y-940*s];   // cara del Silbón (silbonHD con pies en x,y)

// ---------- luz: quinqué (lámpara de aceite) con llama viva ----------
function s2Lamp(x,y,s,t,on=1){const f=1+.07*Math.sin(t*15)+.05*Math.sin(t*7.3);
  let g=`<path d="M-34,0 L34,0 L26,-30 L-26,-30Z" fill="#7a5a2a"/><ellipse cx="0" cy="-30" rx="40" ry="14" fill="#9a7a3a"/><rect x="-6" y="-58" width="12" height="28" fill="#5a4220"/>`;
  g+=`<path d="M-30,-60 Q-40,-120 -18,-150 L18,-150 Q40,-120 30,-60Z" fill="#e8f0ff" opacity=".35" stroke="#c9d4e6" stroke-width="3"/>`;
  if(on>0) g+=`<path d="M0,${(-70-40*f*on).toFixed(1)} Q14,-80 0,-62 Q-14,-80 0,${(-70-40*f*on).toFixed(1)}Z" fill="#ffd76a" opacity="${on}"/><path d="M0,${(-74-22*f*on).toFixed(1)} Q6,-76 0,-66 Q-6,-76 0,${(-74-22*f*on).toFixed(1)}Z" fill="#fff6d0" opacity="${on}"/>`;
  else g+=[0,1,2].map(i=>`<path d="M0,-66 q${-10+i*8},-40 ${4+i*6},-${80+i*30}" stroke="#bbb" stroke-width="3" fill="none" opacity="${(.25-i*.06).toFixed(2)}"/>`).join('');
  return `<g transform="translate(${x},${y}) scale(${s})">${on>0?`<circle cx="0" cy="-90" r="${(300*f).toFixed(0)}" fill="url(#glowY)" opacity="${(.9*on).toFixed(2)}"/>`:''}${g}</g>`}
// sombras de la llama que respiran en la pared
const s2Flicker=(t,k=1)=>`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity="${(k*(.05+.05*Math.sin(t*13)+.03*Math.sin(t*29))).toFixed(3)}"/>`;
// polvo en el haz de luna
const s2Dust=(t,x0,x1,y0,y1,n=16)=>particles(t,'dust',{n,x0,x1,y0,y1,op:.45});

// ---------- el dormitorio: plano de las camas (A) ----------
// ventana (izq.) con barrotes y luna; foto del abuelo; crucifijo; calendario; reloj a las 3; cama de la abuela con mosquitero; chinchorro de Mateo (dcha.)
function s2Win(x,y,w,h,t,o={}){const id=uid('w2');
  let inside=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0c1230"/>`+`<circle cx="${x+w*.7}" cy="${y+h*.25}" r="${w*.22}" fill="#f6f0dc"/><circle cx="${x+w*.7}" cy="${y+h*.25}" r="${w*.6}" fill="#fff8e0" opacity=".12"/>`+moriche(x+w*.25,y+h,h*.8,'#05070f')+moriche(x+w*.9,y+h+10,h*.6,'#070a16');
  if(o.dawn) inside=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f6c890"/><rect x="${x}" y="${y+h*.55}" width="${w}" height="${h*.45}" fill="#f0a070"/><circle cx="${x+w*.4}" cy="${y+h*.62}" r="${w*.2}" fill="#fff4c8"/>`+moriche(x+w*.25,y+h,h*.8,'#5a3a30');
  if(o.sil>0){const sx=x+w*.5-60*o.ss, sy=y+h+(o.sy||0); inside+=`<g opacity="${o.sil}">${silbonHD(sx,sy+1100*o.ss*.15,o.ss,t,{glow:1,grin:1})}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#05060f" opacity=".55"/></g>`;
    const [ex,ey]=s2Face(sx,sy+1100*o.ss*.15,o.ss); inside+=`<g opacity="${o.sil}"><circle cx="${ex-8*o.ss}" cy="${ey-35*o.ss}" r="${26*o.ss}" fill="#ff3020" opacity=".55" filter="url(#chFX)"/><circle cx="${ex+42*o.ss}" cy="${ey-35*o.ss}" r="${26*o.ss}" fill="#ff3020" opacity=".55"/><circle cx="${ex-8*o.ss}" cy="${ey-35*o.ss}" r="${8*o.ss}" fill="#ffe9a0"/><circle cx="${ex+42*o.ss}" cy="${ey-35*o.ss}" r="${8*o.ss}" fill="#ffe9a0"/></g>`;}
  let s=`<rect x="${x-18}" y="${y-18}" width="${w+36}" height="${h+36}" fill="#4a3020"/><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inside}</g>`;
  s+=[...Array(5)].map((_,i)=>`<rect x="${x+w*(i+1)/6-5}" y="${y}" width="10" height="${h}" fill="#2a1a10"/>`).join('')+`<rect x="${x}" y="${y+h/2-5}" width="${w}" height="10" fill="#2a1a10"/>`;
  s+=`<rect x="${x-26}" y="${y+h+8}" width="${w+52}" height="18" fill="#5a3a22"/>`;
  return s}
function s2Wall(t){ // pared de bahareque encalada con vigas
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#b8ab92"/>`;
  for(let i=0;i<60;i++){const r=rng(i+21);s+=`<path d="M${-500+r()*2000},${80+r()*850} l${r()*40-20},${r()*36}" stroke="#8a7e66" stroke-width="2" opacity=".5"/>`;}
  for(let i=0;i<9;i++){const r=rng(i+71);s+=`<ellipse cx="${-400+r()*1800}" cy="${200+r()*700}" rx="${30+r()*50}" ry="${14+r()*20}" fill="#9a8c70" opacity=".35"/>`;}
  s+=[0,1,2,3].map(i=>`<rect x="-600" y="${40+i*14}" width="2280" height="10" fill="#4a3220"/>`).join('')+[...Array(14)].map((_,i)=>`<rect x="${-560+i*160}" y="0" width="22" height="100" fill="#3a2414"/>`).join('');
  return s}
const s2Floor=(y=1010)=>{let s=`<rect x="-600" y="${y}" width="2280" height="700" fill="#8a4a32"/>`;for(let x=-600;x<1700;x+=100) s+=`<line x1="${x}" y1="${y}" x2="${(x-540)*1.5+540}" y2="${y+600}" stroke="#5a2e1e" stroke-width="3"/>`;for(const yy of [y+50,y+120]) s+=`<line x1="-600" y1="${yy}" x2="1680" y2="${yy}" stroke="#5a2e1e" stroke-width="2"/>`;return s+`<rect x="-600" y="${y-10}" width="2280" height="14" fill="#5a3a22"/>`};
const s2Photo=(x,y)=>`<g transform="translate(${x},${y})"><rect x="0" y="0" width="120" height="150" fill="#6a4a2a"/><rect x="10" y="10" width="100" height="130" fill="#d8c8a0"/><circle cx="60" cy="70" r="22" fill="#8a7050"/><path d="M28,58 q32,-24 64,0Z" fill="#5a4a30"/><path d="M20,58 l80,0" stroke="#5a4a30" stroke-width="6"/><rect x="40" y="92" width="40" height="48" fill="#6a5a40"/><rect x="10" y="10" width="100" height="130" fill="#a86a2a" opacity=".25"/><path d="M-6,-6 L60,-40 L126,-6" stroke="#2a1a10" stroke-width="3" fill="none"/></g>`;
const s2Cross=(x,y)=>`<g transform="translate(${x},${y})"><rect x="-6" y="-60" width="12" height="120" fill="#4a3220"/><rect x="-34" y="-30" width="68" height="12" fill="#4a3220"/><path d="M-30,64 q30,30 60,0" stroke="#c9a050" stroke-width="3" fill="none"/></g>`;
// la cama de la abuela (cabecera a la izquierda), mosquitero; o.who: opciones de la abuela tumbada; o.empty
function s2Bed(x0,x1,t,o={}){let s=`<rect x="${x0}" y="820" width="${x1-x0}" height="190" fill="#5a3a22"/><rect x="${x0}" y="780" width="${x1-x0}" height="60" rx="20" fill="#e8e0d0"/><rect x="${x0-20}" y="620" width="40" height="390" fill="#4a3020"/><rect x="${x1-20}" y="700" width="40" height="310" fill="#4a3020"/><circle cx="${x0}" cy="616" r="16" fill="#6a4628"/><circle cx="${x1}" cy="696" r="16" fill="#6a4628"/>`;
  s+=`<rect x="${x0+20}" y="752" width="130" height="52" rx="20" fill="#f3eee6"/>`;
  if(!o.empty) s+=lying({...ABUELA,x:x0+425+(o.dx||0),y:820,s:.5,eyes:'closed',mouth:'smile',...(o.who||{})},.5);
  s+=`<path d="M${x0+150},800 Q${(x0+x1)/2+60},${o.empty?790:740} ${x1},800 L${x1},850 L${x0+150},850Z" fill="#8a6a9a"/>`+[0,1,2,3].map(i=>`<path d="M${x0+190+i*70},810 l20,30" stroke="#6a4a7a" stroke-width="4"/>`).join('');
  if(o.net!==false) s+=`<path d="M${x0-30},300 Q${(x0+x1)/2},260 ${x1+30},300 L${x1+60},1010 L${x0-60},1010Z" fill="#f3f3ff" opacity=".1"/>`+[0,1,2,3,4].map(i=>`<path d="M${x0-10+i*(x1-x0)/4},300 q10,350 -10,710" stroke="#fff" stroke-width="2" opacity=".16"/>`).join('');
  return s}
// el chinchorro de Mateo (hamaca) con él dentro; o.m: opciones de Mateo; o.empty
function s2Cot(x0,x1,t,o={}){ // el catre de Mateo (cabecera a la izquierda), manta azul
  let s=`<rect x="${x0}" y="850" width="${x1-x0}" height="160" fill="#4a3020"/><rect x="${x0}" y="810" width="${x1-x0}" height="56" rx="18" fill="#ddd6c8"/><rect x="${x0-16}" y="680" width="34" height="330" fill="#3a2414"/><circle cx="${x0}" cy="676" r="14" fill="#5a3a22"/>`;
  s+=`<rect x="${x0+14}" y="784" width="120" height="48" rx="18" fill="#f3eee6"/>`;
  if(!o.empty) s+=lying({...MATEO,x:x0+85+313,y:830,s:.46,...(o.m||{})},.46);
  s+=`<path d="M${x0+130},828 Q${(x0+x1)/2+60},${o.empty?820:772} ${x1},826 L${x1},876 L${x0+130},876Z" fill="#3a5a8a"/>`+[0,1,2,3].map(i=>`<path d="M${x0+170+i*60},830 l0,40" stroke="#2a4a7a" stroke-width="5"/>`).join('');
  return s}
function s2RoomA(t,o={}){
  let s=s2Wall(t)+s2Win(60,250,240,320,t,o.win||{})+s2Photo(380,290)+s2Cross(580,250)+dCalendar(640,330,.8,{month:'NOVIEMBRE',mark:true})+dClock(900,300,.85,t,{stopped:true,h:o.clockH??3,m:o.clockM??0});
  s+=dShelf(780,520,.9,{w:220,seed:9});
  s+=s2Floor();
  // haz de luna desde la ventana
  if(!o.noBeam) s+=`<path d="M60,250 L300,250 L700,1010 L160,1010Z" fill="${o.win&&o.win.dawn?'#ffd8a0':'#9ab0ff'}" opacity="${o.win&&o.win.dawn?.14:.09}"/>`;
  s+=s2Bed(90,560,t,o.bed||{});
  // mesita con el quinqué entre la cama y la hamaca
  s+=`<rect x="580" y="880" width="110" height="130" fill="#5a3a22"/><rect x="570" y="870" width="130" height="16" fill="#6a4628"/>`+s2Lamp(635,872,.62,t,o.lamp??1);
  s+=s2Cot(730,1100,t,o.ham||{});
  if(!o.noDust) s+=s2Dust(t,120,560,300,950);
  const dk=o.dark??.55;
  s+=dark(dk,[[635,760,(o.lamp??1)>0?460:120,(o.lamp??1)>0?380:120],[200,560,240,420]]);
  return s}

// ---------- la puerta (plano B): puerta de madera con tranca, el látigo en la pared, sombrero, botas ----------
function s2Door(x,y,w,h,o={}){const op=o.open||0;
  let s=`<rect x="${x-18}" y="${y-18}" width="${w+36}" height="${h+18}" fill="#3a2414"/>`;
  if(op>0) s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.outside||'#ffd8a0'}"/>`+(o.outsideSvg||'');
  else s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0a0806"/>`;
  const lw=w*(1-op*.82), dx=(o.rattle||0);
  s+=`<g transform="translate(${dx.toFixed(1)},0)">`+[0,1,2,3].map(i=>`<rect x="${x+i*lw/4+2}" y="${y+2}" width="${lw/4-4}" height="${h-4}" fill="#6a4628" stroke="#3a2414" stroke-width="3"/>`).join('');
  for(let i=0;i<10;i++){const r=rng(i+5);s+=`<path d="M${x+r()*lw},${y+r()*h} l${r()*14},${r()*40}" stroke="#4a3020" stroke-width="2" opacity=".6"/>`;}
  if(op<.1){s+=`<rect x="${x-10}" y="${y+h*.55}" width="${w+20}" height="24" rx="6" fill="#3a2414"/><circle cx="${x+w-40}" cy="${y+h*.45}" r="10" fill="#2a2a2e"/>`;}
  s+=`</g>`;
  // la rendija de luz de luna por debajo
  if(op<.1) s+=`<rect x="${x}" y="${y+h-12}" width="${w}" height="12" fill="${o.dawn?'#ffe2b0':'#dfe6ff'}" opacity=".85"/>`;
  return s}
// el látigo colgado (o en la mano): x,y = clavo
const s2WhipHang=(x,y)=>`<circle cx="${x}" cy="${y}" r="6" fill="#2a2a2e"/><path d="M${x},${y} q-40,30 -36,90 q4,40 40,52 q40,10 30,50" stroke="#2a1a10" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${x},${y} q-40,30 -36,90 q4,40 40,52 q40,10 30,50" stroke="#5a3a20" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="${x-6}" y="${y-4}" width="16" height="70" rx="6" fill="#6a4628" stroke="#2a1a10" stroke-width="3" transform="rotate(-20 ${x} ${y})"/>`;
function s2RoomB(t,o={}){
  let s=s2Wall(t)+dClock(900,250,.85,t,{stopped:true,h:o.clockH??3,m:o.clockM??0})+`<circle cx="160" cy="300" r="5" fill="#2a2a2e"/><g transform="translate(160,316)"><ellipse cx="0" cy="40" rx="80" ry="14" fill="#8a7450"/><path d="M-36,40 Q-34,-6 0,-8 Q34,-6 36,40Z" fill="#8a7450"/><rect x="-36" y="26" width="72" height="10" fill="#3a2a1a"/></g>`;
  s+=dCalendar(860,420,.75,{month:'NOVIEMBRE',mark:true,rot:3});
  if(!o.whipGone) s+=s2WhipHang(230,520);
  else s+=`<circle cx="230" cy="520" r="6" fill="#2a2a2e"/>`;
  s+=s2Floor();
  s+=s2Door(380,380,330,630,{open:o.open||0,rattle:o.rattle||0,dawn:o.dawn,outside:o.outside,outsideSvg:o.outsideSvg});
  // botas de goma, una estera y una escoba junto a la puerta
  s+=`<path d="M780,900 L796,1004 L846,1004 L838,900Z" fill="#1d1d22"/><path d="M836,912 L852,1004 L898,1004 L890,912Z" fill="#26262c"/>`;
  s+=`<rect x="420" y="1020" width="250" height="40" rx="6" fill="#9a7a4a" opacity=".85"/>`;
  s+=`<path d="M1010,420 L960,980" stroke="#8a6a3a" stroke-width="10"/><path d="M930,960 L1000,960 L1010,1040 L920,1040Z" fill="#b89a50"/>`;
  // el quinqué en el suelo, a la izquierda (luz)
  s+=`<rect x="20" y="900" width="120" height="110" fill="#5a3a22"/>`+s2Lamp(80,900,.6,t,o.lamp??1);
  if(o.dawn) s+=`<path d="M380,380 L710,380 L1100,1500 L-100,1500Z" fill="#ffd8a0" opacity="${(o.open||0)*.25}"/>`;
  s+=s2Dust(t,300,800,300,1000,12);
  s+=dark(o.dark??.55,[[90,820,420,380],[545,700,300,420]]);
  return s}

// ---------- la rendija de la puerta (plano C): huesos que se cuentan, dedos que rascan ----------
function s2Gap(t,o={}){
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a0812"/><rect x="100" y="-200" width="880" height="960" fill="#3a2414"/>`+[0,1,2,3].map(i=>`<rect x="${110+i*218}" y="-200" width="212" height="954" fill="#4a3020" stroke="#22140a" stroke-width="4"/>`).join('');
  for(let i=0;i<14;i++){const r=rng(i+40);s+=`<path d="M${120+r()*840},${-150+r()*850} l${r()*10},${30+r()*60}" stroke="#2a180c" stroke-width="3" opacity=".7"/>`;}
  s+=`<rect x="760" y="360" width="190" height="24" rx="8" fill="#22140a"/><rect x="930" y="350" width="26" height="44" fill="#2a2a2e"/>`;
  s+=`<rect x="-600" y="776" width="2280" height="800" fill="#2a1a14"/>`;for(let x=-600;x<1700;x+=110) s+=`<line x1="${x}" y1="776" x2="${(x-540)*1.8+540}" y2="1500" stroke="#1a0e0a" stroke-width="3"/>`;
  s+=`<rect x="100" y="756" width="880" height="20" fill="#dfe6ff"/><path d="M100,776 L980,776 L1200,1100 L-120,1100Z" fill="#cfd8ff" opacity=".16"/>`;
  // huesos contados: sombras en la rendija
  const n=o.bones||0;
  for(let i=0;i<n;i++) s+=`<path d="M${150+i*62},766 l40,0" stroke="#0a0812" stroke-width="10" stroke-linecap="round"/><circle cx="${148+i*62}" cy="766" r="7" fill="#0a0812"/><circle cx="${192+i*62}" cy="766" r="7" fill="#0a0812"/>`;
  // los pies (sombra) y, si rasca, cuatro dedos larguísimos que se meten por la rendija
  s+=`<rect x="${760+Math.sin(t*1.5)*12}" y="756" width="170" height="20" fill="#0a0812"/>`;
  const sc=o.scratch||0;
  if(sc>0) for(let i=0;i<4;i++){const ph=t*9+i*1.3, ext=sc*(26+14*Math.sin(ph)), fx=420+i*42+Math.sin(ph*.5)*8;
    s+=`<path d="M${fx},${756} L${fx+4},${776+ext}" stroke="#4f5a44" stroke-width="13" stroke-linecap="round"/><path d="M${fx+4},${770+ext} l2,12" stroke="#efe6cc" stroke-width="6" stroke-linecap="round"/>`;}
  // astillas que saltan
  if(sc>0){const r=rng(Math.floor(t*12));for(let i=0;i<5;i++) s+=`<rect x="${400+r()*200}" y="${700+r()*60-((t*60)%40)}" width="10" height="3" fill="#8a6a3a" transform="rotate(${r()*90} 500 720)" opacity=".8"/>`;}
  s+=`<rect x="150" y="840" width="300" height="70" rx="8" fill="#9a7a4a" opacity=".85"/>`+[0,1,2,3,4,5].map(i=>`<line x1="${160+i*50}" y1="842" x2="${170+i*50}" y2="908" stroke="#7a5a30" stroke-width="3"/>`).join('');
  s+=dark(.45,[[540,800,620,220]]);
  return s}
// contador de huesos grande (rosa) en pantalla
const s2Num=(n,t,t0,x=540,y=420,size=170)=>t<t0?'':countPop(String(n),x,y,size,t-t0,PINK);

// ================= escenas =================
S.hook=(t,D,B)=>{const E=EVS.hook(B);
  if(t<E.puerta-.1){ // fotograma 0: la cara del Silbón entre los barrotes de la ventana, contando un hueso
    const SX=330,SY=2150,SS=1.55, [fx,fy]=s2Face(SX,SY,SS);
    let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0c1230"/>`+stars(7,140,900,t,.9)+`<circle cx="860" cy="200" r="120" fill="#f6f0dc"/><circle cx="860" cy="200" r="380" fill="#fff8e0" opacity=".1"/>`+moriche(980,1100,700,'#05070f');
    s+=silbonHD(SX,SY,SS,t,{glow:1,grin:1,lean:Math.sin(t*.8)*2});
    // la mano huesuda con un hueso, delante de la cara
    const hb=t>E.huesos-.2?eOut(prog(t,E.huesos-.2,E.huesos+.3)):0;
    s+=`<g transform="translate(${fx-40},${fy+300-120*hb}) rotate(${-20+10*Math.sin(t*3)})" filter="url(#chFX)"><path d="M-60,0 L60,0" stroke="#16131b" stroke-width="26" stroke-linecap="round"/><path d="M-60,0 L60,0" stroke="#efe6cc" stroke-width="16" stroke-linecap="round"/>${[[-62,-9],[-62,9],[62,-9],[62,9]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="12" fill="#efe6cc" stroke="#16131b" stroke-width="4"/>`).join('')}</g>`;
    // barrotes de la ventana delante
    s+=[...Array(5)].map((_,i)=>`<rect x="${-40+i*270}" y="-900" width="40" height="2400" fill="#2a1a10"/>`).join('')+`<rect x="-600" y="840" width="2280" height="40" fill="#2a1a10"/>`;
    s+=`<circle cx="${fx-12}" cy="${fy-54}" r="40" fill="#ff3020" opacity=".35"/><circle cx="${fx+62}" cy="${fy-54}" r="40" fill="#ff3020" opacity=".35"/>`;
    return cam(s,lerp(1.0,1.12,prog(t,0,E.puerta)),fx+20,fy+40,540,520,shake(t,.25,2))+(t>E.huesos?s2Num(1,t,E.huesos,860,820,120):'')};
  if(t<E.tranq-.05){ // su puerta: la rendija, los huesos que se cuentan
    const n=t<E.puerta+.4?2:3; return cam(s2Gap(t,{bones:n}),1.25,540,760,540,620)+s2Num(n,t,n===2?E.puerta-.1:E.puerta+.4)};
  // Mateo en el chinchorro, con los ojos como platos: él sí lo oye
  const bg=s2RoomA(t,{ham:{m:{eyes:'wide',mouth:'o',brows:'up'}}});
  const k=eIO(prog(t,E.tranq-.05,E.tranq+.4));
  return cam(bg,lerp(1.7,2.7,k),800,745,540,560)+s2Num(4,t,E.tranq,860,300,120)};

S.hook2=(t,D,B)=>{const E=EVS.hook2(B);
  // la abuela dormida… y detrás, en la ventana, la silueta con ojos que brillan
  const sil=P(t,E.duerme-.3,.6);
  const bg=s2RoomA(t,{win:{sil,ss:.42,sy:40}});
  const k=eIO(prog(t,0,E.lado+.3));
  return cam(bg,lerp(1.6,2.0,k),lerp(260,210,k),lerp(640,600,k),540,560,shake(t,.15,2))};

S.nohear=(t,D,B)=>{const E=EVS.nohear(B);
  // plano de las dos camas: él con los ojos abiertos, ella dormida y sonriendo
  const bg=s2RoomA(t,{ham:{m:{eyes:'wide',mouth:'line',brows:'up',look:[-8,0]}},bed:{who:{eyes:'closed',mouth:'smile'}}});
  const toG=eIO(prog(t,E.abuela-.2,E.abuela+.6));
  let o=cam(bg,lerp(2.3,2.2,toG),lerp(800,210,toG),lerp(745,740,toG),540,560);
  // un hueso más (5)
  o+=s2Num(5,t,E.todo,860,300,110);
  if(t>E.no-.1) o+=`<g opacity="${P(t,E.no,.3).toFixed(2)}"><circle cx="420" cy="560" r="70" fill="none" stroke="${PINK}" stroke-width="8"/><path d="M370,510 L470,610" stroke="${PINK}" stroke-width="8"/></g>`;
  return o};

S.rule0=(t,D,B)=>{const E=EVS.rule0(B);
  // la rendija otra vez: sexto hueso; el reloj; «no verá el amanecer» → la llama del quinqué se encoge
  const k=eIO(prog(t,0,D));
  let o=cam(s2Gap(t,{bones:6}),lerp(1.15,1.35,k),540,760,540,620);
  o+=s2Num(6,t,.1,860,300,110);
  if(t>E.vera-.1) o+=`<rect x="0" y="0" width="1080" height="1100" fill="#000" opacity="${(.35*P(t,E.vera,.4)).toFixed(2)}"/>`;
  return o};

S.seven=(t,D,B)=>{const E=EVS.seven(B);
  // el reloj a las tres en primer plano → corte al séptimo hueso
  if(t<E.siete-.25){const bg=s2RoomA(t,{noDust:true});return cam(bg,lerp(3.0,3.3,prog(t,0,E.siete)),900,300,540,520)};
  return cam(s2Gap(t,{bones:7}),1.35,540,760,540,620,shake(t,Math.exp(-(t-E.siete)*6),8))+s2Num(7,t,E.siete,540,380,230)};

S.hand=(t,D,B)=>{const E=EVS.hand(B);
  // primer plano de las dos manos: la joven aprieta la vieja (luz del quinqué)
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a1a12"/><rect x="-600" y="560" width="2280" height="900" fill="#e8e0d0"/>`+[0,1,2,3,4].map(i=>`<path d="M${-200+i*300},560 q60,200 -20,540" stroke="#c9c0ae" stroke-width="6" fill="none"/>`).join('');
  s+=`<circle cx="760" cy="300" r="520" fill="url(#glowY)" opacity=".8"/>`;
  const sq=eOut(prog(t,E.aprieta-.1,E.aprieta+.3));
  // mano de la abuela (arrugas, anillo), reposando
  s+=`<g filter="url(#chFX)"><path d="M-200,820 L380,760" stroke="${ABUELA.top}" stroke-width="150" stroke-linecap="round"/><ellipse cx="460" cy="760" rx="110" ry="80" fill="${ABUELA.skin}"/>${[0,1,2,3].map(i=>`<ellipse cx="${560+i*6}" cy="${712+i*32}" rx="52" ry="20" fill="${ABUELA.skin}" stroke="#000" stroke-opacity=".12" stroke-width="3"/>`).join('')}<path d="M420,730 q20,-10 40,0 M430,770 q20,-10 40,0" stroke="#a8805a" stroke-width="3" fill="none"/><rect x="548" y="736" width="14" height="26" rx="5" fill="#e0b84a"/></g>`;
  // mano de Mateo (manga azul) que entra y aprieta
  const mx=lerp(1200,700,sq);
  s+=`<g filter="url(#chFX)"><path d="M${mx+100},600 L${mx+600},420" stroke="${MATEO.top}" stroke-width="170" stroke-linecap="round"/><ellipse cx="${mx}" cy="640" rx="120" ry="90" fill="${MATEO.skin}"/>${[0,1,2,3].map(i=>`<ellipse cx="${mx-110+i*10}" cy="${610+i*34}" rx="58" ry="22" fill="${MATEO.skin}" stroke="#000" stroke-opacity=".12" stroke-width="3"/>`).join('')}</g>`;
  if(t>E.abuela) s+=soundArcs(820,300,t,'#fff',-1);
  return cam(s,lerp(1.05,1.2,prog(t,0,D)),560,700,540,560,shake(t,sq>.9?.2:0,2))+s2Num(7,t,0,900,250,90)};

S.scratch=(t,D,B)=>{const E=EVS.scratch(B);
  // se para el conteo; empiezan los arañazos (la puerta tiembla); gemido
  if(t<E.rasca-.2){ // la habitación en silencio, el haz de luna; el reloj quieto
    const bg=s2RoomB(t,{});return cam(bg,lerp(1.1,1.25,prog(t,0,E.rasca)),545,680,540,560)};
  const sc=P(t,E.rasca-.2,.3), rat=Math.sin(t*38)*4*sc;
  if(t<E.gime-.15) return cam(s2Gap(t,{bones:7,scratch:sc}),1.45,520,760,540,620,rat*1.5)+bang(780,360,'RAS RAS',PINK,P(t,E.rasca,.15),64);
  const bg=s2RoomB(t,{rattle:rat});
  let o=cam(bg,lerp(1.25,1.45,prog(t,E.gime,D)),545,700,540,560,rat);
  o+=soundArcs(545,980,t,'#dfe6ff',1);
  return o};

S.rule4=(t,D,B)=>{const E=EVS.rule4(B);
  // Mateo, sentado en el chinchorro, mira la puerta: cara de terror, sudor
  const bg=s2RoomA(t,{ham:{m:{eyes:'wide',mouth:'jag',brows:'up',look:[10,0]}}});
  const k=eIO(prog(t,0,D));
  return cam(bg,lerp(2.5,2.9,k),800,745,540,560,shake(t,.3,2))};

S.wakeup=(t,D,B)=>{const E=EVS.wakeup(B);
  // la abuela abre los ojos, se incorpora y se levanta hacia la puerta
  const up=t>E.levanta-.2;
  if(!up){const bg=s2RoomA(t,{bed:{who:{eyes:t>E.desp-.1?'open':'closed',mouth:t>E.canelo&&t<E.frio+.4?'o':'smile',mopen:t>E.canelo&&t<E.frio+.4?.3+.3*Math.sin(t*12):null,look:[6,-2]}}});
    return cam(bg,2.4,215,740,540,560)};
  // de pie, andando hacia la derecha (hacia la puerta)
  const w=eIO(prog(t,E.levanta-.2,D));
  let s=s2RoomB(t,{});
  s+=A({...ABUELA,x:lerp(-60,250,w),y:1010,s:.62,walk:t*5,look:[10,0],mouth:'smile',eyes:'open',stride:.7});
  return cam(s,1.15,450,640,540,560)};

S.whip=(t,D,B)=>{const E=EVS.whip(B);
  // Mateo coge el látigo del clavo y se pone delante de la puerta, entre ella y la puerta
  const got=t>E.desc+.2, step=eIO(prog(t,E.pone-.4,E.pone+.4));
  let s=s2RoomB(t,{whipGone:got});
  s+=A({...ABUELA,x:150,y:1010,s:.6,look:[10,0],mouth:'line',eyes:'open',brows:'worried'});
  const mx=lerp(260,545,step);
  s+=A({...MATEO,x:mx,y:1015,s:.66,walk:step>0&&step<1?t*7:null,look:[-10,0],brows:'angry',mouth:'line',aR:got?-40:null});
  if(got){ // el látigo en su mano derecha, colgando
    const hx=mx+.66*120, hy=1015-.66*560;
    s+=`<path d="M${hx},${hy} q30,60 10,140 q-20,80 30,160 q30,40 70,50" stroke="#2a1a10" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${hx},${hy} q30,60 10,140 q-20,80 30,160 q30,40 70,50" stroke="#5a3a20" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="${hx-8}" y="${hy-60}" width="16" height="70" rx="6" fill="#6a4628" stroke="#2a1a10" stroke-width="3"/>`;}
  const k=eIO(prog(t,0,E.latigo+.3));
  return cam(s,lerp(1.9,1.2,k),lerp(230,460,k),lerp(560,640,k),540,560)};

S.bark=(t,D,B)=>{const E=EVS.bark(B);
  // el patio de atrás: Canelo ladra como loco hacia la casa
  let s=llanos(t,{hz:640,moonX:860});
  s+=`<rect x="-600" y="640" width="2280" height="900" fill="#141a14"/>`+moriche(120,700,420,'#05070f')+moriche(260,690,300,'#070a14');
  // la parte de atrás de la casa (derecha): pared encalada, ventanuco, tejas
  s+=`<rect x="640" y="300" width="900" height="720" fill="#8a8476"/><rect x="620" y="270" width="940" height="50" fill="#6a3a2a"/>`+[...Array(8)].map((_,i)=>`<rect x="${620+i*80}" y="240" width="78" height="40" rx="10" fill="#7a3a2a" stroke="#4a2018" stroke-width="3"/>`).join('');
  s+=`<rect x="760" y="460" width="120" height="120" fill="#141a2a" stroke="#3a2414" stroke-width="10"/>`+[0,1,2].map(i=>`<rect x="${785+i*30}" y="465" width="6" height="110" fill="#2a1a10"/>`).join('');
  s+=`<rect x="-600" y="1010" width="2280" height="600" fill="#2a2418"/>`+[...Array(20)].map((_,i)=>{const r=rng(i+9);return `<path d="M${-200+r()*1500},${1010+r()*60} l${r()*10-5},-${20+r()*20}" stroke="#3a4a2a" stroke-width="4"/>`}).join('');
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a1030" opacity=".35"/>`;
  const b=Math.sin(t*10)>0;
  s+=canelo(380,1040,.62,t,{dir:1,alert:1,bark:b,head:14,hackles:true});
  if(b) s+=bang(600,700,'¡GUAU!',YEL,.9,64);
  s+=particles(t,'dust',{n:10,x0:0,x1:1080,y0:600,y1:1000,op:.4,col:'#d0ff7a'});   // luciérnagas
  return cam(s,lerp(1.1,1.25,prog(t,0,D)),480,820,540,600,shake(t,b?.3:0,3))};

S.still=(t,D,B)=>{const E=EVS.still(B);
  // vuelta a la puerta: siguen los arañazos (tiembla); Mateo de espaldas con el látigo
  const rat=Math.sin(t*38)*4;
  let s=s2RoomB(t,{whipGone:true,rattle:rat});
  s+=A({...MATEO,x:545,y:1080,s:.75,look:[0,-4],brows:'worried',mouth:'line'});
  let o=cam(s,lerp(1.3,1.5,prog(t,0,D)),545,640,540,560,rat*.6);
  o+=bang(545,330,'RAS... RAS...',PINK,P(t,E.puerta,.2),60);
  return o};

S.rule5=(t,D,B)=>{const E=EVS.rule5(B);
  // corte de la casa: Canelo ladra lejos (atrás), y en la puerta de delante, el Silbón rascando: enorme, más alto que la puerta
  let s=porch(t);
  const SX=640,SY=1060,SS=.78, sc=Math.sin(t*9)*10;
  s+=silbonHD(SX,SY,SS,t,{glow:1,grin:1,lean:-8});
  // su mano larga rascando la madera
  s+=`<defs>${sbGrad('s2hg',0,0,1,0,[[0,SB.skinL],[.4,SB.skin],[1,SB.skinD]])}</defs>`+sbLimb([SX-20,SY-640],[580,SY-360+sc],22,16,'s2hg')+sbHand([580,SY-360+sc],200,'s2hg',.8,.4);
  for(let i=0;i<4;i++) s+=`<path d="M${540-i*8},${600+i*14} l-30,60" stroke="#2a1a10" stroke-width="4"/>`;
  // recuadro: Canelo, lejos, en el patio de atrás
  const ca=P(t,.1,.3);
  let inset=`<rect x="0" y="0" width="300" height="240" fill="#141a2a"/>`+`<g transform="translate(150,230) scale(.45) translate(-380,-1040)">${canelo(380,1040,.62,t,{dir:1,alert:1,bark:Math.sin(t*10)>0,head:14,hackles:true})}</g>`;
  s=cam(s,lerp(1.05,1.2,prog(t,0,D)),560,620,540,560);
  s+=`<g opacity="${ca.toFixed(2)}" transform="translate(40,560)"><rect x="-6" y="-6" width="312" height="252" fill="#ffd34a"/><svg width="300" height="240">${inset}</svg><rect x="0" y="210" width="300" height="30" fill="#000" opacity=".6"/><text x="150" y="232" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="22" fill="#ffd34a">CANELO · ATRÁS</text></g>`;
  if(t>E.silbon-.1) s+=`<rect x="0" y="0" width="1080" height="1100" fill="#ff1a2a" opacity="${(.25*Math.exp(-(t-E.silbon)*4)).toFixed(3)}"/>`;
  return s};

S.crack=(t,D,B)=>{const E=EVS.crack(B);
  // tres chasquidos contra el suelo: onda expansiva, temblor, polvo
  const cs=[E.c1,E.c2,E.c3];let last=-99;for(const c of cs) if(t>=c-.08) last=c;
  const hit=last>0?Math.exp(-(t-last)*7):0;
  let s=s2RoomB(t,{whipGone:true});
  s+=A({...MATEO,x:520,y:1015,s:.7,look:[2,4],brows:'angry',mouth:'jag',aR:hit>.3?20:-60});
  // el látigo: arco en el aire → latigazo contra el suelo
  const hx=520+.7*120, hy=1015-.7*560, k=hit>.3?1:0;
  s+=k?`<path d="M${hx},${hy} Q${hx+200},${hy+60} ${hx+260},1012" stroke="#2a1a10" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${hx},${hy} Q${hx+200},${hy+60} ${hx+260},1012" stroke="#5a3a20" stroke-width="6" fill="none"/>`
       :`<path d="M${hx},${hy} Q${hx+80},${hy-260} ${hx+260},${hy-200}" stroke="#2a1a10" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${hx},${hy} Q${hx+80},${hy-260} ${hx+260},${hy-200}" stroke="#5a3a20" stroke-width="6" fill="none"/>`;
  if(hit>0){const r=(1-hit)*420;s+=`<ellipse cx="${hx+260}" cy="1012" rx="${r}" ry="${r*.25}" fill="none" stroke="#fff6d0" stroke-width="${8*hit}" opacity="${hit}"/>`+particles(t,'dust',{n:14,x0:hx+120,x1:hx+400,y0:900,y1:1010,op:hit});}
  let o=cam(s,1.2,560,660,540,560,shake(t,hit,14));
  const nn=cs.filter(c=>t>=c-.08).length;
  if(hit>.05) o+=bang(760,380,'¡CHAS!',YEL,hit,90)+countPop(String(nn),300,380,120,t-last,YEL);
  if(t<E.c1&&t>E.chas) o+=`<path d="M0,0 L1080,0" stroke="#000" opacity="0"/>`;
  return o};

S.silence=(t,D,B)=>{const E=EVS.silence(B);
  // los arañazos paran: la puerta quieta, la llama tiembla, todo quieto
  const s=s2RoomB(t,{whipGone:true})+A({...MATEO,x:545,y:1080,s:.75,look:[0,-4],brows:'worried',mouth:'line'});
  return cam(s,lerp(1.35,1.6,eIO(prog(t,0,D))),545,700,540,560)};

S.rule6=(t,D,B)=>{const E=EVS.rule6(B);
  // la rendija: la sombra de los pies SIGUE ahí; dos huesos más en silencio (8, 9)
  const n=t<D*.5?8:9;
  const s=s2Gap(t,{bones:n});
  return cam(s,lerp(1.4,1.9,eIO(prog(t,0,D))),850,760,540,600)+s2Num(n,t,n===8?.05:D*.5,880,300,110)};

S.count2=(t,D,B)=>{const E=EVS.count2(B);
  // «diez… once… doce»: los huesos completan la fila; el último cae con fuerza
  const n=t<E.n10-.1?9:t<E.n11-.1?10:t<E.n12-.1?11:12;
  const last=n===10?E.n10:n===11?E.n11:n===12?E.n12:-1;
  const s=s2Gap(t,{bones:n});
  let o=cam(s,lerp(1.15,1.05,prog(t,0,D)),540,760,540,620,shake(t,n===12?Math.exp(-(t-E.n12)*4):0,10));
  if(last>0) o+=s2Num(n,t,last,540,380,n===12?260:200);
  if(n===12) o+=`<rect x="0" y="0" width="1080" height="1100" fill="#ff1a2a" opacity="${(.3*Math.exp(-(t-E.n12)*3)).toFixed(3)}"/>`;
  return o};

S.smile=(t,D,B)=>{const E=EVS.smile(B);
  // la abuela, sentada en la cama, sonríe tranquila; detrás, Mateo con el látigo, horrorizado
  let s=s2RoomA(t,{bed:{empty:true},ham:{empty:true}});
  s+=A({...ABUELA,x:360,y:1000,s:.66,sit:true,look:[8,-2],mouth:t>E.ves&&t<E.nada+.3?'o':'smile',mopen:t>E.ves&&t<E.nada+.3?.2+.25*Math.sin(t*12):null,eyes:'open'});
  s+=A({...MATEO,x:720,y:1015,s:.66,look:[-10,0],eyes:'wide',brows:'up',mouth:'line'})+sweat(720,1015,.66,t);
  const k=eIO(prog(t,0,D));
  return cam(s,lerp(1.6,2.0,k),lerp(420,380,k),lerp(660,640,k),540,560)};

S.dawn=(t,D,B)=>{const E=EVS.dawn(B);
  // amanece: la puerta abierta, luz naranja; Canelo entra moviendo la cola
  const op=eIO(prog(t,0,E.sol));
  const out=`<rect x="380" y="380" width="330" height="630" fill="#f6c890"/><rect x="380" y="720" width="330" height="290" fill="#c8a070"/><circle cx="560" cy="700" r="60" fill="#fff4c8"/>`+moriche(470,760,260,'#7a4a30');
  let s=s2RoomB(t,{open:op,dawn:true,outsideSvg:out,lamp:0,dark:.2,clockH:5,clockM:0,whipGone:true});
  const w=eOut(prog(t,E.canelo-.2,D));
  s+=canelo(lerp(560,380,w),1040,.55,t,{dir:-1,walk:t*6,wag:true,head:6});
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#ffb070" opacity=".08" style="mix-blend-mode:screen"/>`;
  return cam(s,lerp(1.1,1.2,prog(t,0,D)),540,640,540,560)};

S.dead=(t,D,B)=>{const E=EVS.dead(B);
  // la abuela en la cama, quieta. El quinqué apagado echa humo. Mateo, a su lado, le coge la mano.
  let s=s2RoomA(t,{win:{dawn:true},lamp:0,dark:.25,clockH:5,clockM:1,ham:{empty:true},bed:{who:{eyes:'closed',mouth:'line'}}});
  s+=A({...MATEO,x:600,y:1050,s:.7,look:[-8,4],brows:'worried',mouth:'line',eyes:'open',reachL:[-120,-240]});
  const k=eIO(prog(t,0,D));
  return cam(s,lerp(1.6,1.9,k),lerp(400,330,k),lerp(690,700,k),540,560)+`<rect x="0" y="0" width="1080" height="1100" fill="#000" opacity="${(.15*k).toFixed(2)}"/>`};

S.end=(t,D,B)=>{const E=EVS.end(B);
  // la noche siguiente: la cama de la abuela vacía; Mateo solo en el chinchorro; el silbido lejos… y en la ventana, pegados a los barrotes, dos ojos
  const eyes=t>E.muy?P(t,E.muy,.25):0;
  let s=s2RoomA(t,{bed:{empty:true,net:false},ham:{m:{eyes:'wide',mouth:'o',brows:'up',look:[-12,-4]}},lamp:.6,dark:.65});
  s+=whistleDots(t,E.silbar,150,420,true);
  if(eyes>0) s+=`<g opacity="${eyes.toFixed(2)}"><circle cx="150" cy="390" r="30" fill="#ff3020" opacity=".55"/><circle cx="215" cy="392" r="30" fill="#ff3020" opacity=".55"/><circle cx="150" cy="390" r="9" fill="#ffe9a0"/><circle cx="215" cy="392" r="9" fill="#ffe9a0"/></g>`;
  const k=eIO(prog(t,0,E.lejos)), z=eIO(prog(t,E.muy-.2,E.muy+.5));
  return cam(s,lerp(lerp(2.4,1.3,k),2.8,z),lerp(lerp(800,560,k),185,z),lerp(lerp(745,620,k),400,z),540,560)};

window.CFG={steps:['4. SI RASCA Y NO LADRA, NO ES TU PERRO','5. PERRO LEJOS Y ALGO CERCA: ES ÉL','6. QUE PARE NO ES QUE SE VAYA'],stepsTitle:'REGLAS',listEnd:'count2',
  band:{hook:'#0c1230',hook2:'#141018',nohear:'#141018',rule0:'#0a0812',seven:'#0a0812',hand:'#2a1a12',scratch:'#0a0812',rule4:'#141018',wakeup:'#141018',whip:'#141018',bark:'#0a1030',still:'#0a0812',rule5:'#0a0d1c',crack:'#141018',silence:'#0a0812',rule6:'#0a0812',count2:'#0a0812',smile:'#141018',dawn:'#2a1a10',dead:'#1a1410',end:'#05050c'}};

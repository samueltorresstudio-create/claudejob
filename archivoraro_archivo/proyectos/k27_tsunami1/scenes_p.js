// ---------- key times per scene (scene-relative) ----------
const EVS={
  intro:B=>({retire:B[0].w[8],min:B[1].w[1]}),
  id:B=>({age:B[0].w[1],mil:B[0].w[3]}),
  duque:B=>({name:B[0].w[1],breed:B[0].w[3],where:B[0].w[4]}),
  run:B=>({quake:B[0].w[12],tremble:B[0].w[14]}),
  sea:B=>({retire:B[0].w[5],meters:B[0].w[7],fish:B[0].w[11],people:B[1].w[1],photos:B[1].w[5],knows:B[1].w[6]}),
  step1:B=>({go:B[0].w[9],pull:B[1].s,leash:B[1].w[3],animals:B[1].w[8]}),
  step2:B=>({grab:B[0].w[2],home:B[1].s,sec:B[1].w[0],water:B[1].w[4],kit:B[1].w[5],torch:B[1].w[6],radio:B[1].w[8]}),
  step3:B=>({car:B[0].w[4],jam:B[1].s,road:B[1].w[8],nobody:B[1].w[10]}),
  step4:B=>({up:B[0].w[7],hotel:B[1].s,floors:B[1].w[3],climb:B[1].w[7]}),
  wave:B=>({siren:B[0].w[1],sees:B[0].w[10],wall:B[1].w[1],taller:B[1].w[6],faro:B[1].w[9]}),
  hit:B=>({swallow:B[0].w[3],beach:B[0].w[5],prom:B[0].w[7],cars:B[0].w[10],shake:B[1].w[2],duque:B[1].w[3],stare:B[1].w[6]}),
  calm:B=>({calm:B[0].w[4],breathe:B[0].w[6]}),
  end:B=>({sea:B[0].w[4],again:B[0].w[5],retire:B[0].w[7],first:B[1].w[2],never:B[1].w[8],big:B[1].w[12]}),
};
const clock=(sec)=>`${pad2(Math.floor(sec/60))}:${pad2(Math.floor(sec%60))}`;

const S={};
S.intro=(t,D,B)=>{ // the beach at sunrise: the sea pulls back while Marco and Duque watch from the promenade
  const E=EVS.intro(B), ret=.8*eIO(prog(t,.15,E.min+.4));
  let s=beach(t,{ret,fish:t>E.retire});
  s+=promenade(900,t)+railing(905);
  s+=palmT(70,905,.75,t,0,20)+palmT(1020,905,.8,t,1.3,-20)+lamp(300,905,.8)+lamp(820,905,.8);
  s+=doberman(560,1070,.55,t,{dir:-1,alert:t>E.retire?1:.5,head:t>E.retire?8:0});
  s+=A({...MARCO,x:800,y:1080,s:.6,look:t>E.retire?[-6,-8]:[-10,-2],brows:t>E.retire?'worried':null,mouth:t>E.min?'line':'smile'});
  const zp=eIO(prog(t,0,D));
  let o=cam(s,lerp(1.0,1.14,zp),540,lerp(640,600,zp),540,560,t>E.min?shake(t,.25,3):0);
  if(t>E.min) o+=countPop(clock(1200-(t-E.min)),540,470,150,t-E.min,PINK);
  return o;
};
S.id=(t,D,B)=>{const E=EVS.id(B);
  return idCard(t,D,{who:MARCO,header:'IDENTIFICACIÓN',col:'#4f5a3a',name:'MARCO',age:'42',ageAt:E.age,rows:[['PASADO','EX MILITAR',E.mil,'#1f2a3a'],['ESPECIALIDAD','RESCATE',E.mil+.5,'#c23a3a']],h:500});};
S.duque=(t,D,B)=>{ // Duque's file card; then Marco walks in beside him
  const E=EVS.duque(B), mk=eIO(prog(t,E.where-.2,E.where+.8));
  let s=`<rect width="1080" height="1100" fill="#181b34"/>`;
  for(let x=0;x<=1080;x+=60) s+=`<line x1="${x}" y1="0" x2="${x}" y2="1100" stroke="#fff" stroke-opacity=".05" stroke-width="1.5"/>`;
  s+=`<ellipse cx="540" cy="1040" rx="620" ry="90" fill="#2a2e52"/><circle cx="420" cy="780" r="420" fill="url(#glowB)"/>`;
  s+=doberman(lerp(230,300,mk),1040,1.0,t,{alert:1,head:mk*16,wag:mk>.6,seed:1});
  if(mk>0) s+=A({...MARCO,x:lerp(1320,800,mk),y:1075,s:.9,walk:mk<.98?t*9:null,look:[-11,3],mouth:'smile'});
  const ca=eOut(prog(t,.03,.3))*(1-eIO(prog(t,E.where-.3,E.where+.2)));
  if(ca>0){
    let c=`<rect x="0" y="0" width="540" height="400" rx="26" fill="#f7f4ec"/><rect x="0" y="0" width="540" height="96" rx="26" fill="#8a2a2a"/><rect x="0" y="60" width="540" height="36" fill="#8a2a2a"/>`;
    c+=`<text x="30" y="64" font-family="${MONO}" font-weight="800" font-size="30" fill="#fff" letter-spacing="3">FICHA K9</text>`;
    c+=`<text x="30" y="150" font-family="${MONO}" font-weight="700" font-size="20" fill="#8a8f99">NOMBRE</text><text x="30" y="210" font-family="Inter" font-weight="900" font-size="64" fill="#1f2a3a">${'DUQUE'.slice(0,Math.ceil(prog(t,E.name-.1,E.name+.2)*5))}</text>`;
    c+=`<g opacity="${prog(t,E.breed,E.breed+.15)}"><text x="30" y="270" font-family="${MONO}" font-weight="700" font-size="20" fill="#8a8f99">RAZA</text><text x="30" y="320" font-family="Inter" font-weight="900" font-size="44" fill="#1f2a3a">DÓBERMAN</text></g>`;
    c+=`<g opacity="${prog(t,E.breed+.4,E.breed+.55)}"><text x="30" y="365" font-family="${MONO}" font-weight="700" font-size="20" fill="#c23a3a">EX PERRO MILITAR</text></g>`;
    s+=`<g opacity="${ca}" transform="translate(${500+(1-ca)*50},270) rotate(${lerp(6,-3,ca)})">${c}</g>`;
  }
  return cam(s,1+.04*t/D);
};
S.run=(t,D,B)=>{ // side-on morning run along the promenade; the ground starts to shake
  const E=EVS.run(B), dq=Math.max(.3,E.tremble-E.quake), u=Math.min(t,E.quake), p=prog(t,E.quake,E.tremble), pos=320*(u+dq*(p-p*p/2));
  const moving=p<.97, q=t>E.quake?.5+.5*prog(t,E.quake,E.tremble):0;
  let s=seaSide(t,760,{scroll:pos});
  if(t>E.quake) s+=gulls(300+(t-E.quake)*120,360-(t-E.quake)*160,t,8,3,400,'#ffffff');
  s+=railing(770,pos*.9);
  s+=promenade(770,t,{scroll:pos});
  for(let i=0;i<6;i++){const x=((i*420-pos)%2520+2520)%2520-500;
    s+=i%2?palmT(x,775,.62,t,i,12):lamp(x,775,.75,shake(t+i,q,4));}
  if(t>E.tremble){const a=P(t,E.tremble,.4);s+=`<path d="M120,980 L190,1000 L170,1030 L260,1050 M660,990 L720,1020 L700,1050 L790,1070" stroke="#4a4038" stroke-width="7" fill="none" stroke-linecap="round" opacity="${a}"/>`;}
  const ph=pos/320*11, sw=Math.sin(ph);
  s+=doberman(720,1010,.5,t,moving?{run:pos/320*13,alert:.7}:{alert:1,bark:Math.sin(t*8)>.3,head:6,seed:2});
  s+=A({...MARCO,x:430,y:1030,s:.62,walk:moving?ph:null,aL:moving?25+sw*35:10,aR:moving?25-sw*35:10,look:moving?[10,-2]:[4,8],eyes:moving?'open':'wide',brows:moving?null:'worried',mouth:moving?'line':'o'});
  let o=cam(s,1.04,540,640,540,560,shake(t,q,10),shake(t+.3,q,6));
  if(t>E.quake) o+=tag(540,440,'TERREMOTO',PINK,P(t,E.quake,.2));
  return o;
};
S.sea=(t,D,B)=>{ // the sea retreats hundreds of metres; people walk down to film it; Marco knows
  const E=EVS.sea(B), ret=lerp(.2,.86,eIO(prog(t,E.retire-.5,E.meters+.9)));
  let s=beach(t,{ret,fish:t>E.fish-.3});
  if(t>E.people-.6){const k=prog(t,E.people-.6,D);
    for(let i=0;i<6;i++){const x=120+i*165+Math.sin(i*2)*30, y=lerp(900,790,clamp(k*1.3-i*.08)), sc=lerp(.24,.19,clamp(k*1.3-i*.08)), ph=t>E.photos&&i%2===0;
      s+=extra(ADULTS,i,{x,y,s:sc,walk:!ph?t*7+i:null,reachR:ph?[50,-600]:null,phoneR:ph,look:[0,-6]});}}
  s+=promenade(930,t)+railing(935);
  s+=doberman(620,1090,.55,t,{dir:-1,alert:1,bark:t>E.fish&&Math.sin(t*7)>.4,head:6,seed:3});
  s+=A({...MARCO,x:870,y:1100,s:.62,look:t>E.knows?[-4,-2]:[-10,-8],eyes:t>E.knows?'open':'wide',brows:'worried',mouth:'line'});
  const zk=eIO(prog(t,E.knows-.2,E.knows+.9));
  let o=cam(s,lerp(1.0,1.9,zk),lerp(540,860,zk),lerp(600,700,zk),540,560);
  if(t>E.meters&&t<E.people) o+=tag(540,450,'−400 METROS',PINK,P(t,E.meters,.2));
  if(t>E.photos&&zk<.3) o+=tag(540,450,'NADIE SE VA',YEL,P(t,E.photos,.2));
  return o;
};
function sideBeachBack(t,scroll){ // side view behind the promenade after the sea has pulled back: dry seabed, stranded boats, people with phones
  let s=skyT(.15)+sunT(820,330,56)+`<rect x="-600" y="560" width="2280" height="30" fill="#3f86b8"/><path d="M-600,590 L1680,590" stroke="#f6fbff" stroke-width="5"/>`;
  s+=`<rect x="-600" y="590" width="2280" height="200" fill="#a88e62"/>`;
  for(let i=0;i<4;i++){const x=((i*560+scroll*.5)%2240+2240)%2240-500;s+=boat(x,650+(i%2)*40,.36,i%2?-8:6,i%2?'#e9e4d8':'#f0d9a8')}
  for(let i=0;i<6;i++){const x=((i*330+80+scroll*.6)%1980+1980)%1980-450;s+=extra(ADULTS,i,{x,y:700+(i%3)*12,s:.17,reachR:[50,-600],phoneR:true,look:[8,-4]})}
  return s}
S.step1=(t,D,B)=>{ // turn your back on the sea and run; Duque pulls the leash, he felt it first
  const E=EVS.step1(B), go=t>E.go, sc=go?360*(t-E.go):0, pull=t>E.pull;
  let s=sideBeachBack(t,sc)+railing(790,-sc*.9)+promenade(790,t,{scroll:-sc});
  for(let i=0;i<5;i++){const x=((i*480+sc)%2400+2400)%2400-600;s+=i%2?palmT(x,795,.6,t,i,10):lamp(x,795,.72)}
  const mx=go?520:600, ph=sc/320*11, sw=Math.sin(ph);
  const dx=pull?mx-300:mx-240, dog={dir:-1,alert:1,seed:4};
  if(go) dog.run=sc/320*13; else {dog.bark=Math.sin(t*8)>.3;dog.head=6;}
  s+=doberman(dx,1030,.5,t,dog);
  const mo={...MARCO,x:mx,y:1040,s:.62,rot:pull?-6:0,look:go?[-11,-2]:[10,-6],brows:'worried',mouth:'line'};
  if(go){mo.walk=ph;mo.aR=25+sw*30;mo.reachL=[-190,-300];} else mo.reachL=[-170,-320];
  s+=A(mo);
  const hand=handAt(mx,1040,.62,mo.reachL), col=dobCollar(dx,1030,.5,-1);
  s+=leash(hand,col,pull?2:30);
  let o=cam(s,1.04,540,640,540,560);
  if(t>E.animals) o+=tag(540,450,'LO SIENTEN ANTES',YEL,P(t,E.animals,.2));
  return o;
};
S.step2=(t,D,B)=>{ // 90 seconds at home: water, first-aid kit, torch, radio
  const E=EVS.step2(B);
  let s=homeIn(t);
  const open=eOut(prog(t,0,.35));
  s+=`<rect x="852" y="412" width="176" height="488" fill="#2a2622" opacity="${open}"/><path d="M1028,412 L${lerp(1028,1068,open)},${lerp(412,380,open)} L${lerp(1028,1068,open)},${lerp(900,930,open)} L1028,900Z" fill="#9a6a48" opacity="${open}"/>`;
  s+=`<rect x="400" y="840" width="380" height="24" fill="#6a4a34"/><rect x="420" y="864" width="20" height="200" fill="#5a3e2c"/><rect x="740" y="864" width="20" height="200" fill="#5a3e2c"/>`;
  const items=[['water','AGUA',E.water,'#6cc6ff'],['kit','BOTIQUÍN',E.kit,PINK],['torch','LINTERNA',E.torch,YEL],['radio','RADIO',E.radio,GREEN]], drop=prog(t,E.radio+.5,E.radio+1.1);
  s+=bagOpen(590,842,.9,drop);
  items.forEach(([k,lab,at,col],i)=>{if(t<at-.1)return;const a=eBack(prog(t,at-.1,at+.25)), x0=480+i*120, y0=610, x=lerp(x0,590,eIO(drop)), y=lerp(y0,720,eIO(drop));
    if(drop<1) s+=`<g transform="translate(${x},${y}) scale(${(a*(1-drop*.4)).toFixed(3)})">${ITEMS[k]}</g>`;
    if(drop<.2) s+=`<text x="${x0}" y="${y0+70}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="24" fill="${mix(col,'#000000',.35)}" opacity="${(a*(1-drop*5)).toFixed(2)}">${lab}</text>`;});
  const walkIn=prog(t,.1,E.home), mx=lerp(980,360,eIO(walkIn)), here=walkIn>=1;
  s+=doberman(lerp(1100,960,eOut(prog(t,.2,E.home+.3))),1070,.5,t,{dir:-1,alert:1,bark:here&&Math.sin(t*7)>.5,walk:walkIn<1?t*9:null,seed:5});
  s+=A({...MARCO,x:mx,y:1080,s:.62,walk:here?null:t*10,reachR:here?[228,-500+Math.sin(t*9)*14]:null,look:here?[8,4]:[-10,0],brows:'worried',mouth:'line'});
  let o=cam(s,1.03,540,640,540,560);
  if(t>E.sec){const left=Math.max(0,90-(t-E.sec)*7);
    o+=`<circle cx="900" cy="330" r="70" fill="#11131f" fill-opacity=".86" stroke="${PINK}" stroke-width="6"/><path d="M900,260 A70,70 0 ${left>45?1:0},1 ${(900+70*Math.sin(left/90*2*Math.PI)).toFixed(1)},${(330-70*Math.cos(left/90*2*Math.PI)).toFixed(1)}" stroke="${YEL}" stroke-width="10" fill="none"/>`;
    o+=`<text x="900" y="352" text-anchor="middle" font-family="Inter" font-weight="900" font-size="58" fill="#fff">${Math.ceil(left)}</text>`;}
  return o;
};
S.step3=(t,D,B)=>{ // the jam: every car stuck on the same road; Marco and Duque go past on foot
  const E=EVS.step3(B);
  let s=skyT(.2)+block(-120,400,250,'#d9c6ae')+block(300,440,170,'#e9dccb')+block(760,420,240,'#c9b8a2');
  s+=`<rect x="-600" y="760" width="2280" height="80" fill="#cfc8bc"/><rect x="-600" y="840" width="2280" height="700" fill="#3a3e4a"/>`;
  for(let i=0;i<12;i++) s+=`<rect x="${-300+i*180}" y="996" width="90" height="10" fill="#e9e4d8" opacity=".6"/>`;
  const k=prog(t,.1,D+.4), rx=lerp(-160,1180,k);
  s+=doberman(rx+170,845,.36,t,{run:t*14,alert:1,seed:6});
  s+=A({...MARCO,backpack:PACK,x:rx,y:850,s:.42,walk:t*12,aL:25+Math.sin(t*12)*30,aR:25-Math.sin(t*12)*30,look:[10,-2],brows:'worried',mouth:'line'});
  const heads=(y,sc,seed,shift=0)=>{const r=rng(seed);let g='';for(let i=0;i<9;i++){const x=-260+i*(370*sc)+r()*40+shift;r();g+=`<circle cx="${(x-50*sc).toFixed(0)}" cy="${(y-108*sc).toFixed(0)}" r="${(20*sc).toFixed(1)}" fill="${['#e9c3a2','#8d5a3f','#d6a07a','#c99272'][i%4]}"/>`}return g};
  s+=heads(930,.8,3)+carRow(t,930,.8,3)+heads(1085,1.0,7,-120)+carRow(t,1085,1.0,7,{shift:-120});
  [[E.car+.2,260,840],[E.road,720,860],[E.road+.7,420,1000],[E.nobody,880,1010],[E.nobody+.6,180,860]].forEach(([at,x,y])=>{if(t>at) s+=bang(x,y-90,'¡PIII!',YEL,P(t,at,.12)*(1-P(t,at+.7,.3)),46)});
  let o=cam(s,1.05,lerp(470,620,prog(t,0,D)),660,540,560);
  if(t>E.car-.2&&t<E.jam) o+=tag(540,450,'A PIE',YEL,P(t,E.car-.2,.2));
  if(t>E.road) o+=tag(540,450,'ATASCO',PINK,P(t,E.road,.2));
  return o;
};
S.step4=(t,D,B)=>{ // up, not away: the 12-floor hotel and its fire escape
  const E=EVS.step4(B), HX=150, HY=1000;
  let s=skyT(.4)+townRow(1000,5,{sc:.9})+hotel(HX,HY)+townRow(1120,8,{sc:1.2});
  s+=`<rect x="-600" y="${HY}" width="2280" height="900" fill="#b8b0a4"/>`;
  const p=eIO(prog(t,E.climb-.2,D+.3))*.985, climbing=t>E.climb-.2;
  if(!climbing){
    s+=doberman(700,HY,.3,t,{alert:1,head:20,seed:7});
    s+=A({...MARCO,backpack:PACK,x:860,y:HY,s:.36,look:[-4,-11],eyes:'wide',brows:'worried',mouth:'o'});
  } else {
    const [dx,dy,dd]=escapePos(HX,HY,Math.max(0,p-.012)), [mx,my,md]=escapePos(HX,HY,p);
    s+=doberman(dx,dy,.2,t,{run:t*13,dir:dd,alert:1,seed:7});
    s+=A({...MARCO,backpack:PACK,x:mx,y:my,s:.25,walk:t*11,look:[md*11,-6],brows:'worried',mouth:'line'});
  }
  const [cx,cy]=escapePos(HX,HY,p);
  const kUp=eIO(prog(t,E.up-.3,E.hotel+.2)), kF=eIO(prog(t,E.climb-.4,E.climb+.6));
  const z=lerp(lerp(1.0,.42,kUp),.9,kF), fx=lerp(lerp(780,430,kUp),cx,kF), fy=lerp(lerp(820,-160,kUp),cy-90,kF);
  let o=cam(s,z,fx,fy,540,560);
  if(t>E.floors&&t<E.climb) o+=tag(540,450,'12 PLANTAS',YEL,P(t,E.floors,.2));
  if(climbing) o+=tag(820,450,`PLANTA ${Math.min(12,Math.floor(p*12)+1)}`,GREEN,P(t,E.climb,.2));
  return o;
};
function roofView(t,o={}){ // from the hotel roof: horizon, lighthouse, town rooftops, the roof parapet. o.storm, o.waveBase, o.waveH, o.flood, o.ret, o.far (second wave)
  const H=460, shore=lerp(590,H+14,o.ret||0);
  let s=skyT(o.storm??.4)+sea(t,H,shore,{col:'#4a7a94'});
  if(o.far) s+=waveWall(t,H+8,o.far,{seed:4,top:'#3a4650',mid:'#26323a',bot:'#1e282e'});
  s+=`<rect x="-600" y="${shore}" width="2280" height="${700-shore}" fill="${o.wet?'#6a6e62':'#c9b07a'}"/><rect x="-600" y="${shore}" width="2280" height="${Math.max(0,(o.ret||0)*60)}" fill="#a88e62"/>`;
  if(o.waveH&&o.waveBase<700) s+=waveWall(t,o.waveBase,o.waveH);
  s+=lighthouse(930,605,.5,t);
  s+=`<rect x="-600" y="628" width="2280" height="14" fill="#d8cfc2"/>`;
  s+=townRow(720,2,{sc:.55})+townRow(820,6,{sc:.75});
  if(o.waveH&&o.waveBase>=700) s+=waveWall(t,o.waveBase,o.waveH,{seed:12});
  if(o.flood) s+=flood(t,o.flood,{rough:o.rough,debris:true,flow:o.flow??30});
  s+=townRow(960,9,{sc:1});
  if(o.flood2) s+=flood(t,o.flood2,{rough:o.rough,debris:true,flow:o.flow??30,seed:5});
  s+=siren(980,700,t,o.siren)+roofEdge(930);
  return s}
S.wave=(t,D,B)=>{ // sirens; from the roof Marco sees the grey wall coming, taller than the lighthouse
  const E=EVS.wave(B), k=eIO(prog(t,E.wall-.8,D)), base=lerp(462,600,k), h=lerp(0,330,k);
  let s=roofView(t,{storm:lerp(.4,.8,k),waveBase:base,waveH:h,siren:t>E.siren-.2});
  s+=doberman(430,1000,.52,t,{alert:1,head:10,bark:t<E.sees&&Math.sin(t*6)>.6,seed:8});
  s+=A({...MARCO,backpack:PACK,x:210,y:1010,s:.62,look:[8,-9],eyes:t>E.sees?'wide':'open',brows:'worried',mouth:t>E.sees?'o':'line'});
  const zk=eIO(prog(t,E.sees-.2,E.sees+1.2))*(1-.5*eIO(prog(t,E.taller,D)));
  let o=cam(s,lerp(1.0,1.35,zk),lerp(540,700,zk),lerp(620,480,zk),540,560,shake(t,k*.4,4));
  if(t>E.faro) o+=tag(540,450,'MÁS ALTA QUE EL FARO',PINK,P(t,E.faro,.2));
  return o;
};
S.hit=(t,D,B)=>{ // the wave swallows beach, promenade and cars; the building shakes; Duque just stares
  const E=EVS.hit(B), k=eIO(prog(t,0,E.cars+.6));
  const base=lerp(600,980,k), h=lerp(330,70,k);
  const lvl=lerp(990,745,eOut(prog(t,E.beach-.3,E.cars+1.2)));
  let s=roofView(t,{storm:.8,waveBase:base,waveH:h,flood:lvl-20,flood2:lvl,wet:t>E.beach,rough:true,flow:160,siren:true});
  [[E.beach,260,700],[E.prom,640,760],[E.cars,880,820],[E.shake,420,840]].forEach(([at,x,y])=>{s+=splash(x,y,t,prog(t,at-.1,at+1.1),1.1)});
  s+=doberman(430,1000,.52,t,{alert:1,head:t>E.stare?-6:4,seed:8});
  s+=A({...MARCO,backpack:PACK,x:210,y:1010,s:.62,look:[8,-4],eyes:'wide',brows:'worried',mouth:'o',reachR:t>E.duque?[150,-300]:null});
  const zk=eIO(prog(t,E.duque-.3,E.duque+.9));
  const sh=Math.max(.5*(1-k),t>E.shake?1-prog(t,E.shake+1,E.shake+2):0);
  return cam(s,lerp(1.0,1.9,zk),lerp(540,520,zk),lerp(620,860,zk),540,560,shake(t,sh,12),shake(t+.4,sh,7));
};
S.calm=(t,D,B)=>{ // the water settles over the town; Marco breathes for the first time
  const E=EVS.calm(B), cal=eIO(prog(t,0,E.calm+.4));
  let s=roofView(t,{storm:lerp(.7,.45,cal),flood:735,flood2:750,wet:true,rough:cal<.5,flow:lerp(80,12,cal)});
  s+=doberman(470,995,.52,t,{alert:.4,head:-8,seed:8});
  const br=t>E.breathe&&t<E.breathe+1.1;
  s+=A({...MARCO,backpack:PACK,x:250,y:1000,s:.62,sit:true,eyes:br?'closed':'open',look:[8,-2],brows:br?null:'worried',mouth:br?'o':'line'});
  if(br){const p=prog(t,E.breathe+.4,E.breathe+1.4);s+=`<circle cx="${290+p*60}" cy="${640-p*30}" r="${10+p*26}" fill="#fff" opacity="${(.35*(1-p)).toFixed(2)}"/>`}
  return cam(s,lerp(1.25,1.08,prog(t,0,D)),lerp(420,520,prog(t,0,D)),lerp(760,680,prog(t,0,D)),540,560);
};
S.end=(t,D,B)=>{ // the sea pulls back again... and far out, a darker, bigger line rises
  const E=EVS.end(B), r=eIO(prog(t,E.sea-.3,E.retire+1)), far=lerp(0,150,eIO(prog(t,E.first-.4,D)));
  let s=roofView(t,{storm:lerp(.45,.9,prog(t,0,D)),ret:r*.9,flood:lerp(735,790,r),flood2:lerp(750,810,r),flow:lerp(12,140,r),far});
  s+=doberman(470,1000,.52,t,{alert:1,head:12,seed:8,bark:t>E.retire&&t<E.first&&Math.sin(t*7)>.5});
  s+=A({...MARCO,backpack:PACK,x:250,y:1010,s:.62,look:[6,-10],eyes:'wide',brows:'worried',mouth:'o'});
  const zk=eIO(prog(t,E.first-.6,D));
  let o=cam(s,lerp(1.05,1.8,zk),lerp(520,540,zk),lerp(640,440,zk),540,560,shake(t,.15*zk,3));
  if(t>E.never) o+=brackets(540,440,940,320,PINK)+tag(540,660,'OLA 2',PINK,P(t,E.never,.2));
  return o;
};
window.CFG={steps:['1. SI EL MAR SE VA, CORRE','2. SOLO LO VITAL','3. OLVIDA EL COCHE','4. SUBE'],listEnd:'wave',
  band:{intro:'#5a4e3a',id:'#181b34',duque:'#181b34',run:'#5e5850',sea:'#5a4e3a',step1:'#5e5850',step2:'#4a3a2e',step3:'#2e3038',step4:'#4a4844',wave:'#4a4844',hit:'#3a3c3e',calm:'#3e3e3c',end:'#26282c'}};

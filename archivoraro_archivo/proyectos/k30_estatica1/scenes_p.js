// ---------- key times per scene (scene-relative) ----------
const EVS={
  intro:B=>({time:B[0].w[3],on:B[0].w[10],dont:B[1].w[2],yet:B[1].w[3]}),
  id:B=>({age:B[0].w[1],weeks:B[0].w[4]}),
  sofa:B=>({change:B[0].w[4],nope:B[0].w[10],ch0:B[0].w[13]}),
  channel:B=>({forest:B[0].w[4],counter:B[0].w[7],ten:B[0].w[8],someone:B[1].w[5],tall:B[1].w[7],still:B[1].w[9]}),
  step1:B=>({three:B[0].w[7],blink:B[1].w[1],closer:B[1].w[6]}),
  zap:B=>({z1:B[0].w[0],z2:B[0].w[3],z3:B[0].w[6],all:B[0].w[7]}),
  door:B=>({knock:B[0].w[2],open:B[1].s,neigh:B[1].w[2],hears:B[1].w[8],but:B[1].w[12],silent:B[1].w[17]}),
  back:B=>({sofa:B[0].w[4],man:B[0].w[6],half:B[0].w[8]}),
  step2:B=>({hear:B[0].w[3],breath:B[1].w[1],up1:B[1].w[5],down:B[1].w[7],up2:B[1].w[9]}),
  step3:B=>({pull:B[1].w[1],sees:B[1].w[7],never:B[1].w[10]}),
  zero:B=>({zero:B[0].w[4],off:B[1].w[3],silence:B[1].w[4]}),
  end:B=>({refl:B[0].w[2],himself:B[0].w[9],behind:B[1].w[1],hand:B[1].w[3],shoulder:B[1].w[8],back:B[2].w[6],victor:B[2].w[8],giving:B[2].w[12]}),
};
const S={};
const lit=(c,k=1)=>NTC(c); // characters in the dark flat
S.intro=(t,D,B)=>{ // 3:07 — the TV switches itself on behind Víctor's head
  const E=EVS.intro(B), on=t>E.on-.15, pw=prog(t,E.on-.15,E.on+.1);
  const scr=on?snowScreen(t)+(pw<1?`<rect width="${TVW}" height="${TVH}" fill="#fff" opacity="${(1-pw).toFixed(2)}"/>`:''):`<rect width="${TVW}" height="${TVH}" fill="#07080c"/>`;
  let s=flat(t,{screen:scr,on,glow:on?flick(t,2):0});
  if(!on) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity=".35"/>`;
  s+=sofaBack(880)+lit(backHead(520,840,.95));
  const zp=eIO(prog(t,0,D)), kick=t>E.dont?eOut(prog(t,E.dont,E.dont+.4)):0;
  let o=cam(s,lerp(1.0,1.18,zp)+kick*.25,540,lerp(600,560,zp),540,560,t>E.dont?shake(t,1-prog(t,E.dont,E.dont+.6),6):0);
  if(t>E.time&&!on) o+=brackets(950,355,170,90,PINK);
  return o;
};
S.id=(t,D,B)=>{const E=EVS.id(B);
  return idCard(t,D,{who:VICTOR,header:'IDENTIFICACIÓN',col:'#3a4a7a',bg:'#12152a',name:'VÍCTOR',age:'22',ageAt:E.age,rows:[['DUERME','2 H POR NOCHE',E.weeks-.3,'#c23a3a'],['DESDE HACE','3 SEMANAS',E.weeks+.2,'#1f2a3a']],h:500})+cam(eyeBags(250,1070,.9),1+.03*t/D);};
S.sofa=(t,D,B)=>{ // front view: Víctor on the sofa, lit by channels flicking past... then by the cold light of channel 0
  const E=EVS.sofa(B), ch0=t>E.ch0-.2, hop=Math.floor(t*2.2);
  const col=ch0?'#cfe6ff':['#ffb36a','#7ad0ff','#ff7ab0','#a0ff9a','#ffe27a'][hop%5];
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#141828"/><rect x="-600" y="900" width="2280" height="700" fill="#1b1d2a"/>`;
  s+=`<rect x="700" y="230" width="200" height="270" fill="#2a2e40"/>`+nightCity(712,242,176,246,t)+`<rect x="797" y="230" width="6" height="270" fill="#2a2e40"/>`;
  s+=`<rect x="120" y="360" width="220" height="12" fill="#2a2a36"/><rect x="160" y="310" width="140" height="50" rx="6" fill="#0c0c10"/>`+osd('03:07',230,346,'#ff3a3a',30,'middle');
  s+=sofaK(540,960,760,'#2e3348');
  let c=A({...VICTOR,x:540,y:965,s:.62,sit:true,look:[0,-2],eyes:t>E.nope?'wide':'open',brows:t>E.nope?'worried':null,mouth:t>E.ch0?'o':'line',reachR:[120,-290]});
  s+=lit(c)+lit(sofaArmsK(540,960,760,'#2e3348'))+eyeBags(540,965,.62,true);
  const hx=540+.62*120, hy=965-.62*290;s+=lit(remote(hx,hy-14,1.1,-20));
  s+=glowCol(540,620,620,560,col,.3*flick(t,ch0?2:1));
  if(t>E.change&&!ch0&&Math.floor(t*2.2)!==Math.floor((t-.05)*2.2)) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#fff" opacity=".06"/>`;
  let o=cam(s,lerp(1.0,1.35,eIO(prog(t,0,D))),540,lerp(640,590,eIO(prog(t,0,D))),540,560);
  if(t>E.ch0) o+=tag(540,450,'CANAL 0',GREEN,P(t,E.ch0,.2));
  return o;
};
const counterAt=(sc,t,E)=>({channel:600-Math.max(0,t-(E.counter??0)),step1:571-t,zap:482-t*6,back:224-t,step2:183-t,step3:121-t})[sc];
S.channel=(t,D,B)=>{ // inside the screen: static, a forest, a counter... and someone far away
  const E=EVS.channel(B), clear=prog(t,E.forest-.4,E.forest+.6);
  const scr=forestChannel(t,{dist:0,noise:lerp(1,.4,clear),noiseN:lerp(320,140,clear),counter:t>E.counter?counterAt('channel',t,E):null,man:t>E.someone-.3,glitch:.25});
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#07080c"/>`+tvSet(540,520,1.75,scr,{glow:flick(t),stand:false});
  const zk=eIO(prog(t,E.someone-.2,E.tall+.3));
  let o=cam(s,lerp(1.0,2.4,zk),540,lerp(520,575,zk),540,560);
  if(t>E.ten&&t<E.someone) o+=tag(780,460,'10:00',GREEN,P(t,E.ten,.2));
  if(t>E.tall) o+=brackets(540,560,200,330,PINK)+tag(540,780,'MUY ALTO',PINK,P(t,E.tall,.2));
  return o;
};
S.step1=(t,D,B)=>{ // count to three... blink... and he's closer
  const E=EVS.step1(B), after=t>E.blink+.12, d=after?lerp(.3,.38,prog(t,E.blink,D)):0;
  const scr=forestChannel(t,{dist:d,counter:counterAt('step1',t,E),glitch:after?.5:.25});
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#07080c"/>`+tvSet(540,520,1.75,scr,{glow:flick(t),stand:false});
  const zk=after?eOut(prog(t,E.blink+.1,E.blink+.5)):0;
  let o=cam(s,lerp(1.15,1.05,zk),540,lerp(540,560,zk),540,560,after?shake(t,1-prog(t,E.blink+.1,E.blink+.6),9):0);
  const c0=B[0].s+.5;for(let i=0;i<3;i++){const at=c0+i*.75;if(t>at&&t<B[1].s) o+=countPop(String(i+1),540,960-480,170,t-at,i===2?PINK:'#fff').replace('<g ','<g opacity="'+(1-prog(t,at+.6,at+.75)).toFixed(2)+'" ')}
  o+=eyelids(t>E.blink-.08&&t<E.blink+.2?Math.sin(prog(t,E.blink-.08,E.blink+.2)*Math.PI):0);
  if(t>E.closer) o+=tag(540,450,'MÁS CERCA',PINK,P(t,E.closer,.2));
  return o;
};
S.zap=(t,D,B)=>{ // every channel is the forest — and he's closer on each one
  const E=EVS.zap(B), zs=[E.z1,E.z2,E.z3,E.all,E.all+1.0], i=zs.filter(z=>t>z).length;
  const flash=zs.some(z=>t>z&&t<z+.14), chs=['CANAL 0','CANAL 1','CANAL 2','CANAL 27','CANAL 48','CANAL 99'];
  const scr=flash?snowScreen(t):forestChannel(t,{dist:.38+i*.07,counter:counterAt('zap',t,E),ch:chs[i],glitch:.4,manX:(i%2?-60:60)});
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#07080c"/>`+tvSet(540,500,1.6,scr,{glow:flick(t),stand:false});
  const press=zs.some(z=>t>z-.08&&t<z+.08)?1:0;
  s+=`<g transform="translate(860,${930+press*14}) rotate(-24)">`+lit(`<circle cx="0" cy="90" r="120" fill="${VICTOR.skin}"/><rect x="-80" y="140" width="160" height="300" fill="${VICTOR.top}"/>`+remote(0,-40,2.4,0)+`<ellipse cx="-30" cy="-${70+press*10}" rx="34" ry="24" fill="${VICTOR.skin}"/>`)+`</g>`;
  let o=cam(s,1.05,540,560,540,560);
  if(t>E.all) o+=tag(540,450,'TODOS LOS CANALES',PINK,P(t,E.all,.2));
  return o;
};
S.door=(t,D,B)=>{ // knocks at 3 am: the neighbour hears static... the TV is on mute
  const E=EVS.door(B), open=eOut(prog(t,E.open-.2,E.open+.4)), wk=prog(t,E.knock+.3,E.open-.2);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#12141f"/><rect x="-600" y="900" width="2280" height="700" fill="#1a1a24"/>`;
  for(let y=920;y<1500;y+=34) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#000" stroke-opacity=".2" stroke-width="3"/>`;
  const hall=`<rect x="-600" y="-900" width="2280" height="2400" fill="#e9c88a"/><rect x="380" y="840" width="340" height="80" fill="#c9a86a"/>`+(open>.3?A({...VECINA,x:560,y:905,s:.62,look:t>E.but?[-10,2]:[-4,2],eyes:t>E.silent?'wide':'open',brows:t>E.silent?'worried':'angry',mouth:t>E.hears&&t<E.but?'o':'line',reachR:t>E.neigh&&t<E.but?[60,-560]:null}):'');
  s+=doorK(400,330,320,575,{open,inside:hall,col:'#3a2e28',frame:'#2a2a36'});
  if(open<.1){const k=t>E.knock&&t<E.knock+1.4?Math.sin(t*40)*3:0;s+=`<rect x="${400+k}" y="330" width="320" height="575" fill="#3a2e28" opacity="0"/>`;
    s+=`<rect x="400" y="900" width="320" height="8" fill="#e9c88a" opacity=".85"/><ellipse cx="${520+Math.sin(t*2)*20}" cy="904" rx="26" ry="5" fill="#000" opacity=".8"/><ellipse cx="${600+Math.sin(t*2+1)*20}" cy="904" rx="26" ry="5" fill="#000" opacity=".8"/>`;
    s+=`<circle cx="560" cy="580" r="7" fill="#e9c88a" opacity=".8"/>`;}
  s+=`<path d="M-600,-900 L200,-900 L200,1500 L-600,1500Z" fill="#9fd0ff" opacity="${(.04*flick(t)).toFixed(3)}"/>`;
  const vx=lerp(100,330,eIO(wk));
  s+=lit(A({...VICTOR,x:vx,y:960,s:.66,walk:wk>0&&wk<1?t*7:null,look:t>E.but?[-11,0]:[10,-2],eyes:t>E.silent?'wide':'open',brows:'worried',mouth:'line'}))+eyeBags(vx,960,.66);
  let o=cam(s,1.06,540,640,540,560,t>E.knock&&t<E.knock+1.2?shake(t,.5,4):0);
  if(t>E.knock&&t<E.open) o+=bang(560,470,'TOC, TOC, TOC',YEL,P(t,E.knock,.12)*(1-P(t,E.open-.4,.3)),58);
  if(t>E.hears&&t<E.but) o+=bubble(740,430,330,90,'¡ESA ESTÁTICA!',{});
  if(t>E.but){o+=`<g opacity="${P(t,E.but,.2)}"><rect x="40" y="400" width="280" height="90" rx="12" fill="#11131f" stroke="${PINK}" stroke-width="3"/><text x="70" y="458" font-family="${MONO}" font-weight="800" font-size="32" fill="${PINK}">VOL ▮▯▯▯ 0</text></g>`;}
  return o;
};
S.back=(t,D,B)=>{ // back to the sofa... he now fills half the screen
  const E=EVS.back(B), sit=eOut(prog(t,0,E.sofa)), d=t>E.man-.4?.78:.45;
  const scr=forestChannel(t,{dist:d,counter:counterAt('back',t,E),glitch:t>E.man?.7:.3,noise:t>E.man?.6:.45});
  let s=flat(t,{screen:scr,glow:flick(t,2)});
  s+=sofaBack(880)+lit(backHead(lerp(900,520,sit),lerp(1000,840,sit),.95));
  const zk=eIO(prog(t,E.man-.3,E.half+.2));
  let o=cam(s,lerp(1.1,2.0,zk),540,lerp(620,545,zk),540,560,t>E.man?shake(t,1-prog(t,E.man,E.man+.7),10):0);
  if(t>E.half) o+=tag(540,860,'MEDIA PANTALLA',PINK,P(t,E.half,.2));
  return o;
};
S.step2=(t,D,B)=>{ // frozen on the sofa while the static swells and fades
  const E=EVS.step2(B);
  const lvl=t<E.up1?.35:t<E.down?lerp(.35,1,prog(t,E.up1,E.up1+.5)):t<E.up2?lerp(1,.25,prog(t,E.down,E.down+.5)):lerp(.25,1,prog(t,E.up2,E.up2+.4));
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#141828"/><rect x="-600" y="900" width="2280" height="700" fill="#1b1d2a"/>`;
  s+=`<rect x="700" y="230" width="200" height="270" fill="#2a2e40"/>`+nightCity(712,242,176,246,t)+`<rect x="797" y="230" width="6" height="270" fill="#2a2e40"/>`;
  s+=sofaK(540,960,760,'#2e3348')+lit(A({...VICTOR,x:540,y:965,s:.62,sit:true,still:true,blink:false,look:[0,-2],eyes:'wide',brows:'worried',mouth:'line'}))+lit(sofaArmsK(540,960,760,'#2e3348'))+eyeBags(540,965,.62,true);
  s+=glowCol(540,620,620,560,'#cfe6ff',.25+.2*lvl*Math.abs(Math.sin(t*30)));
  s+=`<g opacity="${(lvl*.55).toFixed(2)}">${noiseRects(t,1080,1100,260,1,5)}</g>`;
  const zk=eIO(prog(t,E.breath-.3,D));
  let o=cam(s,lerp(1.15,1.9,zk),540,lerp(700,630,zk),540,560,shake(t,lvl*.4,3));
  // static meter on the side
  o+=`<rect x="990" y="420" width="44" height="380" rx="10" fill="#11131f" fill-opacity=".85" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>`;
  for(let i=0;i<12;i++){const on=i/12<lvl;o+=`<rect x="998" y="${780-i*30}" width="28" height="22" rx="4" fill="${i>8?PINK:i>5?YEL:GREEN}" opacity="${on?.95:.15}"/>`}
  o+=osd('ESTÁTICA',1012,830,'#fff',18,'middle');
  return o;
};
S.step3=(t,D,B)=>{ // pull the plug... there never was one plugged in
  const E=EVS.step3(B), pulled=t>E.pull, pk=eOut(prog(t,E.pull,E.pull+.35));
  const scr=forestChannel(t,{dist:.72,counter:counterAt('step3',t,E),glitch:.5,noise:.55});
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#151a2a"/><rect x="-600" y="840" width="2280" height="800" fill="#1d1f2c"/>`;
  s+=`<rect x="420" y="720" width="440" height="40" fill="#14141a"/><rect x="440" y="760" width="24" height="80" fill="#14141a"/><rect x="816" y="760" width="24" height="80" fill="#14141a"/>`;
  s+=tvSet(640,470,.9,scr,{glow:flick(t,2),stand:true});
  // wall socket with its child-safety caps still in
  s+=`<rect x="100" y="740" width="70" height="90" rx="10" fill="#d9d6cc"/><circle cx="122" cy="785" r="8" fill="#ff7a3a"/><circle cx="148" cy="785" r="8" fill="#ff7a3a"/>`;
  const vx=lerp(340,300,pk), hand=[vx+.62*150,940-.62*420];
  const plug=pulled?[lerp(150,hand[0],pk),lerp(800,hand[1],pk)]:[200,812];
  s+=`<path d="M860,640 Q840,760 700,830 Q500,860 ${plug[0]+20},${plug[1]}" stroke="#0c0c10" stroke-width="9" fill="none"/>`;
  s+=`<g transform="translate(${plug[0]},${plug[1]}) rotate(${pulled?-30:0})"><rect x="-26" y="-16" width="44" height="32" rx="6" fill="#1a1a20"/><line x1="-26" y1="-7" x2="-44" y2="-7" stroke="#c9c2b0" stroke-width="5"/><line x1="-26" y1="7" x2="-44" y2="7" stroke="#c9c2b0" stroke-width="5"/></g>`;
  s+=lit(A({...VICTOR,x:vx,y:940,s:.62,look:t>E.sees?[11,-2]:[-6,6],eyes:t>E.sees?'wide':'open',brows:'worried',mouth:t>E.never?'o':'line',reachR:pulled?[150,-420]:[-20,-260],walk:t<B[1].s-.2?t*6:null}))+eyeBags(vx,940,.62);
  if(t>E.never) s+=brackets(135,785,130,120,PINK);
  let o=cam(s,lerp(1.0,1.12,prog(t,0,D)),lerp(520,480,prog(t,E.sees,D)),620,540,560,pulled&&t<E.pull+.4?shake(t,.6,5):0);
  if(t>E.never) o+=tag(540,450,'NUNCA ESTUVO ENCHUFADA',PINK,P(t,E.never,.2));
  return o;
};
S.zero=(t,D,B)=>{ // 00:03... 00:00 — his faceless head fills the screen; then the screen dies
  const E=EVS.zero(B), left=Math.max(0,3-(t-(E.zero-3))), off=t>E.off-.2, ok=prog(t,E.off-.2,E.off+.25);
  let scr;
  if(!off){scr=forestChannel(t,{dist:.96,counter:left,glitch:.6,noise:.5});scr+=`<text x="${TVW/2}" y="${TVH/2+50}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="150" fill="#ff5a7a" opacity=".9" style="filter:drop-shadow(0 0 16px #ff5a7a)">${mmss(left)}</text>`;}
  else {const h=lerp(TVH,2,clamp(ok*2)), w=lerp(TVW,6,clamp(ok*2-1));scr=`<rect width="${TVW}" height="${TVH}" fill="#000"/>`+(ok<1?`<rect x="${(TVW-w)/2}" y="${(TVH-h)/2}" width="${w}" height="${h}" fill="#fff"/>`:'');}
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${off?'#000':'#07080c'}"/>`+tvSet(540,520,1.75,scr,{glow:off?0:flick(t,3),stand:false,led:off?'#2a1010':'#ff3a3a'});
  return cam(s,off?1.0:lerp(1.0,1.1,prog(t,0,E.off)),540,520,540,560,!off?shake(t,.3,4):0);
};
S.end=(t,D,B)=>{ // in the black glass: himself... and behind him, a hand on his shoulder
  const E=EVS.end(B), mk=prog(t,E.behind-.3,E.hand+.3), hand=eOut(prog(t,E.hand-.2,E.shoulder));
  let r=`<rect width="${TVW}" height="${TVH}" fill="#3a4462"/>`;
  r+=`<rect x="300" y="40" width="110" height="140" fill="#1a2238"/><rect x="20" y="170" width="520" height="120" rx="30" fill="#1a1d2c"/>`;
  r+=staticMan(120,1100,1.2,t,{op:lerp(.1,1,mk),reach:hand>0?[lerp(130,85,hand),lerp(-640,-698,hand)]:null});
  r+=A({...VICTOR,x:280,y:650,s:.76,look:t>E.hand?[-8,-2]:[0,0],eyes:t>E.hand?'wide':'open',brows:'worried',mouth:t>E.victor?'o':'line',still:t>E.hand});
  if(hand>.95) r+=`<g transform="translate(222,262) rotate(-80)"><ellipse cx="0" cy="0" rx="17" ry="23" fill="#e9e6dc"/>${[-14,-5,5,14].map(fx=>`<path d="M${fx},14 Q${fx*1.4},56 ${fx+4},92" stroke="#e9e6dc" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
  const scr=`<g opacity=".7"><g transform="translate(${TVW},0) scale(-1,1)">${r}</g></g><rect width="${TVW}" height="${TVH}" fill="#2a3a6a" opacity=".18"/><path d="M60,0 L200,0 L80,${TVH} L-60,${TVH}Z" fill="#fff" opacity=".05"/><path d="M380,0 L420,0 L300,${TVH} L260,${TVH}Z" fill="#fff" opacity=".04"/>`;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#030305"/>`+tvSet(540,520,1.75,scr,{glow:0,stand:false,led:'#2a1010'});
  const zk=eIO(prog(t,E.back-.4,D)), zh=eIO(prog(t,E.hand-.4,E.shoulder+.4))*(1-zk);
  const hx=540-490+(TVW-222)*1.75, hy=520-275.6+262*1.75;
  let o=cam(s,lerp(lerp(1.05,1.6,zh),2.4,zk),lerp(lerp(540,hx,zh),540,zk),lerp(lerp(540,hy,zh),533,zk),540,560);
  if(t>E.shoulder&&t<E.back) o+=brackets(540,560,300,260,PINK);
  return o;
};
window.CFG={steps:['1. NO LE MIRES +3 SEGUNDOS','2. ESTÁTICA = NO TE MUEVAS','3. DESENCHUFA LAS PANTALLAS','4. NUNCA LE DES LA ESPALDA'],
  band:{intro:'#0e1018',id:'#12152a',sofa:'#0e1018',channel:'#07080c',step1:'#07080c',zap:'#07080c',door:'#0e1018',back:'#0e1018',step2:'#0e1018',step3:'#0e1018',zero:'#000000',end:'#030305'}};

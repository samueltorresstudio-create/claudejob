// «Juliane Koepcke: cayó 3 km y sobrevivió» — vídeo suelto para YouTube
const EVS={
  hook:B=>({km:B[0].w[9],surv:B[0].w[14]}),
  cabin:B=>({date:B[0].w[1],jul:B[0].w[6],mom:B[0].w[11],selva:B[0].w[14]}),
  storm:B=>({storm:B[0].w[5],bolt:B[0].w[7],split:B[0].w[12]}),
  fall:B=>({m3000:B[0].w[6],para:B[0].w[9]}),
  wake:B=>({sola:B[0].w[7],clav:B[0].w[10],arm:B[0].w[13],sand:B[0].w[19]}),
  count:B=>({n92:B[0].w[1],one:B[0].w[5]}),
  dad:B=>({dad:B[0].w[2],rules:B[0].w[8]}),
  stream:B=>({water:B[0].w[9],rios:B[0].w[16],people:B[0].w[21]}),
  candy:B=>({no:B[0].w[2],bag:B[0].w[12]}),
  seats:B=>({vult:B[0].w[4],seats:B[0].w[10],pass:B[0].w[14]}),
  river:B=>({float:B[0].w[7],bank:B[0].w[10]}),
  days:B=>({wound:B[0].w[4],worms:B[0].w[13]}),
  hut:B=>({hut:B[1].w[5],boat:B[1].w[7],fuel:B[1].w[10],pour:B[1].w[14],worms:B[1].w[22]}),
  rescue:B=>({men:B[0].w[4],spirit:B[0].w[16]}),
  eleven:B=>({n11:B[0].w[3]}),
  today:B=>({back:B[0].w[2],bio:B[0].w[5],selva:B[0].w[10],mata:B[0].w[15]}),
};
const S={};

// ---------- reparto ----------
const JUL={fem:true,skin:'#f6cfae',hs:'long',hair:'#c9a060',top:'#e9e4d8',topD:'#c9c2b0',dress:true,shortSleeves:true,lashes:true,shoes:'#8a6a4a',seed:71};
const JMOM={fem:true,skin:'#f1c6a4',hs:'bun',hair:'#5a3a24',top:'#3a5a8a',topD:'#2a4270',lashes:true,earrings:'#f1c84b',pants:'#2a2e38',seed:72};
const JDAD={skin:'#f1c6a4',hs:'sidepart',hair:'#8a6a4a',beard:'#7a5a3a',glasses:'round',top:'#b8a070',topD:'#98804a',vest:'#6a5a3a',pants:'#5a4a38',shoes:'#3a2e28',seed:73};
const JKID={...JUL,hs:'pigtails',seed:78};
const WK1={skin:'#9a6a48',hs:'short',hair:'#15100e',hat:'straw',top:'#e9e4d8',topD:'#c9c2b0',pants:'#4a4038',shoes:'#2a2620',seed:74};
const WK2={skin:'#8a5a3e',hs:'buzz',hair:'#15100e',top:'#c23a3a',topD:'#9a2a2a',pants:'#3a3a30',shoes:'#2a2620',stubble:true,seed:75};
const WK3={skin:'#a87050',hs:'messy',hair:'#2a1a12',hat:'cap',hatCol:'#3f6fb5',top:'#4f8a5a',topD:'#2f6a3a',pants:'#3a3e4a',shoes:'#2a2620',seed:76};
const JOLD={fem:true,skin:'#f1c6a4',hs:'bob',hair:'#c9b89a',glasses:'round',wrinkles:true,top:'#e9e4d8',topD:'#c9c2b0',vest:'#6a7a4a',pants:'#5a5040',shoes:'#3a2e28',lashes:true,seed:77};

// ---------- atrezo ----------
const jCloud=(x,y,s,col='#ffffff',op=1)=>`<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})" opacity="${op}"><ellipse cx="0" cy="0" rx="120" ry="46" fill="${col}"/><ellipse cx="-70" cy="10" rx="80" ry="38" fill="${col}"/><ellipse cx="70" cy="12" rx="86" ry="36" fill="${col}"/><ellipse cx="10" cy="-30" rx="70" ry="40" fill="${col}"/></g>`;
const jPlane=(x,y,s,t,o={})=>{ // side view of a four-engine turboprop; o.split 0..1 breaks it in two
  const sp=o.split||0, wb=Math.sin(t*2)*2;
  const props=xs=>xs.map(px=>`<g transform="translate(${px},18)"><rect x="-20" y="-14" width="56" height="28" rx="12" fill="#b9c0c8"/><ellipse cx="-24" cy="0" rx="6" ry="${(30+6*Math.sin(t*60)).toFixed(0)}" fill="#3a3e4a" opacity=".55"/></g>`).join('');
  const front=`<path d="M-40,-36 L210,-36 Q280,-34 300,0 Q280,34 210,36 L-40,36Z" fill="#e9eef2"/><path d="M-40,-8 L270,-8" stroke="#c23a3a" stroke-width="8"/>`+[0,1,2,3,4,5].map(i=>`<rect x="${-10+i*34}" y="-24" width="16" height="16" rx="6" fill="#4a6a8a"/>`).join('')+`<path d="M250,-22 L286,-12 L290,0 L252,0Z" fill="#2a3a5a"/><path d="M40,6 L130,6 L60,96 L20,96Z" fill="#c9d2dc"/>`+props([50,100]);
  const rear=`<path d="M-40,-36 L-260,-30 Q-290,-26 -300,-6 L-300,10 Q-280,30 -250,32 L-40,36Z" fill="#e9eef2"/><path d="M-300,-8 L-40,-8" stroke="#c23a3a" stroke-width="8"/><path d="M-250,-30 L-290,-120 L-250,-120 L-200,-34Z" fill="#c9d2dc"/><path d="M-270,-110 L-250,-110 L-232,-60 L-250,-60Z" fill="#c23a3a"/>`+[0,1,2,3,4].map(i=>`<rect x="${-200+i*34}" y="-24" width="16" height="16" rx="6" fill="#4a6a8a"/>`).join('');
  let g=`<g transform="translate(${-sp*60},${sp*90}) rotate(${(-sp*25).toFixed(1)} -40 0)">${rear}</g><g transform="translate(${sp*40},${sp*30}) rotate(${(sp*14).toFixed(1)} -40 0)">${front}</g>`;
  if(sp>0){for(let i=0;i<8;i++){const a=i*0.8, d=sp*(80+i*30);g+=`<rect x="${(-40+Math.cos(a)*d).toFixed(0)}" y="${(Math.sin(a)*d*.6).toFixed(0)}" width="${10+i%3*8}" height="${8+i%2*6}" fill="${i%2?'#e9eef2':'#9aa3ad'}" transform="rotate(${(t*200+i*40)%360} ${(-40+Math.cos(a)*d).toFixed(0)} ${(Math.sin(a)*d*.6).toFixed(0)})"/>`;}
    g+=`<circle cx="-40" cy="0" r="${(30+sp*60).toFixed(0)}" fill="#ffb45a" opacity="${(.7*(1-sp)).toFixed(2)}"/>`;}
  return `<g transform="translate(${x},${(y+wb).toFixed(1)}) scale(${s})">${g}</g>`};
const jSeatRow=(x,y,s,rot=0,col='#3f6fb5')=>`<g transform="translate(${x},${y}) rotate(${rot.toFixed(1)}) scale(${s})">`+[-1,0,1].map(i=>`<rect x="${i*150-62}" y="-330" width="124" height="230" rx="22" fill="${col}"/><rect x="${i*150-62}" y="-330" width="124" height="40" rx="18" fill="${mix(col,'#ffffff',.2)}"/><rect x="${i*150-70}" y="-110" width="140" height="60" rx="16" fill="${mix(col,'#000000',.2)}"/>`).join('')+`<rect x="-230" y="-60" width="460" height="18" fill="#6a737d"/><rect x="-200" y="-44" width="14" height="44" fill="#6a737d"/><rect x="186" y="-44" width="14" height="44" fill="#6a737d"/></g>`;
const jungle=(t,o={})=>{ // dense rainforest: mist, light rays, trunks, canopy, vines, leaf litter
  const tone=o.tone||0;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${mix('#0e2418','#000000',tone)}"/>`;
  s+=`<rect x="-600" y="-900" width="2280" height="1500" fill="${mix('#2f5a3a','#000000',tone)}" opacity=".55"/>`;
  for(const [x,w] of [[-60,40],[180,30],[420,46],[700,34],[960,40]]) s+=`<rect x="${x}" y="-200" width="${w}" height="1200" fill="${mix('#1a3a24','#000000',tone)}" opacity=".7"/>`;
  for(let i=0;i<4;i++){const x=80+i*260+Math.sin(t*.3+i)*20;s+=`<path d="M${x},-200 L${x+90},-200 L${x+330},1100 L${x+170},1100Z" fill="#fff6c8" opacity="${(.06*(1-tone)).toFixed(3)}"/>`;}
  for(const [x,y,r] of [[0,120,220],[330,60,250],[700,110,240],[1060,80,230],[-200,300,180],[1240,320,200]]) s+=`<circle cx="${x}" cy="${y+Math.sin(t*.8+x)*6}" r="${r}" fill="${mix('#1f4a2e','#000000',tone)}"/>`;
  for(const [x,w] of [[60,70],[880,80]]) s+=`<rect x="${x}" y="200" width="${w}" height="800" fill="${mix('#3a2a1e','#000000',tone)}"/><rect x="${x+10}" y="200" width="12" height="800" fill="#000" opacity=".15"/>`;
  for(const [x0,x1,y0] of [[140,300,180],[760,920,140],[420,560,240]]) s+=`<path d="M${x0},${y0} Q${(x0+x1)/2},${y0+260+Math.sin(t+x0)*10} ${x1},${y0}" stroke="${mix('#3a7a3a','#000000',tone)}" stroke-width="7" fill="none"/>`;
  for(let i=0;i<14;i++){const a=i*0.45, x=(i*97)%1100-20, y=380+(i*53)%380;s+=`<ellipse cx="${x}" cy="${y}" rx="70" ry="22" fill="${mix(i%2?'#2f6a3a':'#3f7a3a','#000000',tone)}" transform="rotate(${(-30+i*17+Math.sin(t+i)*4).toFixed(1)} ${x} ${y})"/>`;}
  s+=`<rect x="-600" y="${o.ground||900}" width="2280" height="800" fill="${mix('#2a3a1e','#000000',tone)}"/>`;
  for(let i=0;i<24;i++){const x=(i*61)%1180-50, y=(o.ground||900)+20+(i*37)%160;s+=`<ellipse cx="${x}" cy="${y}" rx="${18+i%4*6}" ry="7" fill="${mix(i%3?'#4a5a2a':'#6a5a30','#000000',tone)}" opacity=".8"/>`;}
  return s};
const ferns=(t,tone=0)=>{let s='';for(const [x,y,sc,dir] of [[-40,1120,1.1,1],[1120,1110,1.2,-1]]){for(let i=0;i<7;i++){const a=(-80+i*22+Math.sin(t*1.2+i)*3)*dir;s+=`<g transform="translate(${x},${y}) rotate(${a.toFixed(1)}) scale(${sc})"><path d="M0,0 Q20,-140 0,-280 Q-20,-140 0,0Z" fill="${mix(i%2?'#1a4a24':'#22582c','#000000',tone)}"/></g>`;}}return s};
const waterBand=(t,y0,y1,col='#5a7a6a')=>{let s=`<rect x="-600" y="${y0}" width="2280" height="${y1-y0}" fill="${col}"/>`;
  for(let i=0;i<22;i++){const d=(i*37)%100/100, y=y0+8+d*(y1-y0-16), x=((i*173+t*(30+d*50))%1800)-360;s+=`<path d="M${x.toFixed(0)},${y.toFixed(0)} q30,-5 60,0" stroke="#d9efe8" stroke-width="${(2+d*3).toFixed(1)}" fill="none" opacity="${(.25+.2*Math.sin(t*2+i)).toFixed(2)}"/>`;}
  return s};
const vulture=(x,y,s,t,ph)=>{const f=Math.sin(t*5+ph);return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})"><path d="M-90,${(-20*f).toFixed(1)} Q-40,${(-10-14*f).toFixed(1)} 0,0 Q40,${(-10-14*f).toFixed(1)} 90,${(-20*f).toFixed(1)} Q40,8 0,10 Q-40,8 -90,${(-20*f).toFixed(1)}Z" fill="#15161c"/><circle cx="0" cy="-4" r="9" fill="#c9a0a0"/></g>`};
const hutK=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-170" y="-200" width="340" height="200" fill="#8a6a44"/>${[0,1,2,3,4,5].map(i=>`<line x1="-170" y1="${-190+i*34}" x2="170" y2="${-190+i*34}" stroke="#6a4e30" stroke-width="5"/>`).join('')}<path d="M-210,-190 L0,-330 L210,-190Z" fill="#c9a860"/><path d="M-210,-190 L0,-330 L210,-190" stroke="#a88840" stroke-width="10" fill="none"/><rect x="-40" y="-130" width="80" height="130" fill="#2a1e14"/><rect x="-190" y="-10" width="16" height="60" fill="#6a4e30"/><rect x="174" y="-10" width="16" height="60" fill="#6a4e30"/></g>`;
const canoe=(x,y,s,t)=>`<g transform="translate(${x},${(y+Math.sin(t*2)*3).toFixed(1)}) scale(${s})"><path d="M-200,-20 Q0,40 200,-20 L180,-40 L-180,-40Z" fill="#7a5a3a"/><path d="M-180,-40 L180,-40" stroke="#5a3e24" stroke-width="6"/><rect x="150" y="-90" width="40" height="50" rx="6" fill="#3a3e4a"/></g>`;
const fuelCan=(x,y,s,rot=0)=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-40" y="-90" width="80" height="100" rx="10" fill="#c23a3a"/><rect x="-30" y="-110" width="20" height="24" fill="#9a2a2a"/><path d="M-30,-60 L30,-20 M30,-60 L-30,-20" stroke="#9a2a2a" stroke-width="6"/></g>`;
const candyBag=(x,y,s,t)=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M-90,-120 L90,-120 L110,80 Q0,110 -110,80Z" fill="#f3eee6" opacity=".9"/><path d="M-90,-120 L90,-120 L80,-150 L-80,-150Z" fill="#ff6fa0"/>${[['#ff3e6c',-50,-40],['#f2c94c',10,-60],['#45e07e',50,-10],['#6cc6ff',-30,20],['#ff8a2a',30,40],['#c96cff',-60,50]].map(([c,cx,cy])=>`<circle cx="${cx}" cy="${cy}" r="22" fill="${c}"/><path d="M${cx-34},${cy} L${cx-22},${cy-8} L${cx-22},${cy+8}Z M${cx+34},${cy} L${cx+22},${cy-8} L${cx+22},${cy+8}Z" fill="${c}"/>`).join('')}</g>`;
const xMark=(x,y,a)=>a<=0?'':`<g opacity="${clamp(a)}"><circle cx="${x}" cy="${y}" r="70" fill="${PINK}"/><path d="M${x-34},${y-34} L${x+34},${y+34} M${x+34},${y-34} L${x-34},${y+34}" stroke="#fff" stroke-width="16" stroke-linecap="round"/></g>`;
const seatIcon=(x,y,col)=>`<rect x="${x-9}" y="${y-14}" width="18" height="20" rx="5" fill="${col}"/><rect x="${x-11}" y="${y+4}" width="22" height="8" rx="3" fill="${col}"/>`;
const sepia=a=>`<rect x="-600" y="-900" width="2280" height="2400" fill="#a8783a" opacity="${(.3*a).toFixed(2)}"/>`;

// ---------- escenas ----------
S.hook=(t,D,B)=>{const E=EVS.hook(B), k=eIO(prog(t,0,D));
  let s=skyT(.15);
  for(let i=0;i<7;i++){const y=((i*260-t*520)%1800+1800)%1800-500;s+=jCloud((i*331)%1100,y,.9+i%3*.3,'#ffffff',.85);}
  s+=`<rect x="-600" y="${lerp(1300,980,k).toFixed(0)}" width="2280" height="900" fill="#1f4a2e"/>`;
  for(let i=0;i<12;i++) s+=`<circle cx="${i*100-40}" cy="${lerp(1300,980,k)+10}" r="70" fill="${i%2?'#2f6a3a':'#24592f'}"/>`;
  const spin=Math.sin(t*1.6)*14;
  s+=`<g transform="rotate(${spin.toFixed(1)} 540 640)">`+jSeatRow(540,760,.75,0)+A({...JUL,x:540,y:820,s:.5,sit:true,eyes:'wide',mouth:'o',brows:'worried',look:[0,6]})+`</g>`;
  let o=cam(s,lerp(1,1.1,k),540,640,540,560,shake(t,.4,4));
  if(t>E.km) o+=countPop('3 KM',540,330,120,t-E.km,YEL);
  if(t>E.surv) o+=tag(540,1000,'Y SOBREVIVIÓ',GREEN,P(t,E.surv,.2));
  return o;};

S.cabin=(t,D,B)=>{const E=EVS.cabin(B), k=eIO(prog(t,0,D));
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#d9d0bc"/><path d="M-600,180 Q540,60 1680,180 L1680,-900 L-600,-900Z" fill="#c9c0aa"/>`;
  s+=`<rect x="-600" y="150" width="2280" height="40" fill="#b9b09a"/>`;
  const win=(x)=>{const id=uid('w');return `<rect x="${x-10}" y="290" width="200" height="250" rx="70" fill="#9a9280"/><clipPath id="${id}"><rect x="${x}" y="300" width="180" height="230" rx="62"/></clipPath><g clip-path="url(#${id})"><rect x="${x}" y="300" width="180" height="230" fill="#7cb0d8"/><rect x="${x}" y="440" width="180" height="90" fill="#2f6a3a"/>${[0,1,2].map(i=>`<circle cx="${x+((i*70+t*40)%220)-20}" cy="${450+i*10}" r="${24+i*6}" fill="#24592f"/>`).join('')}${jCloud(x+((t*30)%260)-40,360,.35)}</g>`;};
  s+=win(40)+win(860);
  s+=`<rect x="-600" y="900" width="2280" height="700" fill="#5a5a6a"/><rect x="460" y="900" width="160" height="700" fill="#8a3a3a" opacity=".6"/>`;
  for(const x of [330,760]) s+=`<rect x="${x-130}" y="420" width="260" height="440" rx="30" fill="#3f6fb5"/><rect x="${x-130}" y="420" width="260" height="60" rx="26" fill="#6a8fcf"/><rect x="${x-150}" y="780" width="300" height="110" rx="26" fill="#2f5a9f"/><rect x="${x-160}" y="700" width="30" height="190" rx="12" fill="#2a4a80"/><rect x="${x+130}" y="700" width="30" height="190" rx="12" fill="#2a4a80"/>`;
  s+=A({...JMOM,x:330,y:1000,s:.6,sit:true,look:[10,-2],mouth:t>E.mom?'smile':'line'});
  s+=A({...JUL,x:760,y:1000,s:.56,sit:true,look:[-12,-2],mouth:'smile'});
  let o=cam(s,lerp(1.02,1.1,k),540,640,540,560);
  if(t>E.jul&&t<E.selva) o+=tag(540,320,'JULIANE · 17 AÑOS',YEL,P(t,E.jul,.2));
  if(t>E.selva) o+=tag(540,320,'RUMBO A PUCALLPA',GREEN,P(t,E.selva,.2));
  return o;};

S.storm=(t,D,B)=>{const E=EVS.storm(B), sp=eOut(prog(t,E.split,E.split+1.6)), flash=t>E.bolt&&t<E.bolt+.25;
  let s=skyT(1)+`<rect x="-600" y="-900" width="2280" height="2400" fill="#0c0f18" opacity="${lerp(.2,.55,prog(t,0,E.storm))}"/>`;
  for(let i=0;i<9;i++) s+=jCloud(((i*241-t*60)%1500+1500)%1500-200,140+(i*97)%700,1.2+i%3*.4,'#3a4050',.9);
  s+=jPlane(lerp(380,640,prog(t,0,D)),560,1.1,t,{split:sp});
  for(let i=0;i<9;i++) s+=jCloud(((i*311-t*120)%1600+1600)%1600-250,600+(i*71)%500,1.4,'#2a2e3a',.95);
  s+=rain(t,.8,7,90,1100);
  if(t>E.bolt&&t<E.bolt+.5) s+=`<path d="M720,-80 L640,180 L700,190 L600,440 L660,450 L560,560" stroke="#fff6c8" stroke-width="12" fill="none" stroke-linejoin="round"/>`;
  if(flash) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#fff" opacity=".55"/>`;
  return cam(s,1.05,540,560,540,560,shake(t,t>E.bolt?1-prog(t,E.bolt,E.bolt+1.5):0,12));};

S.fall=(t,D,B)=>{const E=EVS.fall(B), k=prog(t,0,D);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${mix('#4a5a6a','#7cb0d8',k)}"/>`;
  for(let i=0;i<10;i++){const y=((i*230-t*900)%2200+2200)%2200-700;s+=jCloud((i*271)%1200-60,y,1+i%3*.4,'#e9eef2',.7);}
  if(k>.55){const g=lerp(1500,900,eIn(prog(k,.55,1)));s+=`<rect x="-600" y="${g}" width="2280" height="900" fill="#1f4a2e"/>`;for(let i=0;i<12;i++) s+=`<circle cx="${i*100-40}" cy="${g+10}" r="80" fill="${i%2?'#2f6a3a':'#24592f'}"/>`;}
  const spin=t*70;
  s+=`<g transform="rotate(${(Math.sin(t*1.3)*35).toFixed(1)} 540 600)">`+jSeatRow(540,700,.7,0)+A({...JUL,x:540,y:760,s:.48,sit:true,eyes:'closed',mouth:'o'})+`</g>`;
  for(let i=0;i<14;i++){const y=((i*137-t*1600)%1400+1400)%1400-200;s+=`<line x1="${(i*83)%1080}" y1="${y}" x2="${(i*83)%1080}" y2="${y+90}" stroke="#fff" stroke-width="3" opacity=".4"/>`;}
  let o=cam(s,1.05,540,600,540,560,shake(t,.5,5));
  const alt=Math.max(0,Math.round(3000*(1-eIn(k))/10)*10);
  o+=`<text x="1000" y="330" text-anchor="end" font-family="${MONO}" font-weight="800" font-size="74" fill="#fff" stroke="#000" stroke-width="8" paint-order="stroke">${alt} m</text>`;
  if(t>E.para) o+=tag(540,1000,'SIN PARACAÍDAS',PINK,P(t,E.para,.2));
  return o;};

S.wake=(t,D,B)=>{const E=EVS.wake(B), up=eIO(prog(t,E.sola-.4,E.sola+.8));
  let s=jungle(t);
  s+=jSeatRow(820,960,.5,-24,'#2f5a8f');
  s+=up<.5?lying({...JUL,x:520,y:1000,s:.56,eyes:t<.8?'closed':'open',mouth:'line'},.56):A({...JUL,x:460,y:1010,s:.56,sit:true,look:[8,4],brows:'worried',mouth:'o',eyes:'wide'});
  if(up>=.5) s+=`<path d="M420,820 L470,850" stroke="#b5584a" stroke-width="7" stroke-linecap="round"/>`;
  s+=ferns(t);
  let o=cam(s,lerp(1.08,1,eIO(prog(t,0,1.5))),540,700,540,600);
  const tags=[[E.sola,E.clav,'SOLA',PINK],[E.clav,E.arm,'CLAVÍCULA ROTA',PINK],[E.arm,E.sand,'HERIDA EN EL BRAZO',PINK],[E.sand,D+1,'1 SANDALIA',YEL]];
  for(const [a,b,txt,col] of tags) if(t>a&&t<b) o+=tag(540,330,txt,col,P(t,a,.2));
  return o;};

S.count=(t,D,B)=>{const E=EVS.count(B), one=t>E.one;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#11131c"/>`;
  let n=0;
  for(let r=0;r<8;r++) for(let c=0;c<12;c++){if(n>=92) break;const x=150+c*70, y=380+r*64, me=n===41;
    const a=prog(t,.2+n*.012,.5+n*.012);
    if(a>0) s+=`<g opacity="${a.toFixed(2)}">`+seatIcon(x,y,one?(me?YEL:'#3a3e4a'):'#6cc6ff')+`</g>`;
    if(me&&one) s+=`<circle cx="${x}" cy="${y-2}" r="${(26+4*Math.sin(t*6)).toFixed(1)}" fill="none" stroke="${YEL}" stroke-width="5"/>`;
    n++;}
  let o=cam(s,1,540,620,540,560);
  if(t>E.n92&&!one) o+=countPop('92',540,300,140,t-E.n92,BLUE);
  if(one) o+=countPop('1',540,300,160,t-E.one,YEL);
  return o;};

S.dad=(t,D,B)=>{const E=EVS.dad(B), k=eIO(prog(t,0,D));
  let s=jungle(t,{tone:-.0});
  s+=`<path d="M-600,980 Q300,940 1680,1000 L1680,1060 Q300,1000 -600,1040Z" fill="#6a9aa0"/>`;
  s+=A({...JDAD,x:380,y:1010,s:.6,look:[10,4],mouth:'smile',reachR:[260,-330]});
  s+=person({...JKID,x:700,y:1010,s:.5,look:[-10,-4],mouth:'smile',eyes:'wide'});
  s+=sepia(1)+`<rect x="-600" y="-900" width="2280" height="2400" fill="url(#vig)"/>`;
  let o=cam(s,lerp(1,1.08,k),540,700,540,600);
  if(t>E.dad&&t<E.rules) o+=tag(540,330,'SU PADRE · BIÓLOGO',YEL,P(t,E.dad,.2));
  if(t>E.rules) o+=tag(540,330,'LAS REGLAS DE LA SELVA',GREEN,P(t,E.rules,.2));
  return o;};

S.stream=(t,D,B)=>{const E=EVS.stream(B), wk=prog(t,.5,D);
  let s=jungle(t);
  s+=`<path d="M-600,1010 Q200,930 600,980 T1680,960 L1680,1060 Q900,1060 600,1050 T-600,1080Z" fill="#5a8a8a"/>`;
  for(let i=0;i<6;i++){const x=((i*230+t*90)%1400)-200;s+=`<path d="M${x},1010 q30,-6 60,0" stroke="#d9efe8" stroke-width="4" fill="none" opacity=".6"/>`;}
  s+=A({...JUL,x:lerp(240,620,wk),y:960,s:.5,walk:t*6,look:[10,4],brows:'worried',mouth:'line'});
  s+=ferns(t);
  let o=cam(s,1.04,540,700,540,600);
  const chip=(x,lab,col,a)=>a<=0?'':`<g transform="translate(${x},330) scale(${eBack(clamp(a)).toFixed(3)})"><rect x="-120" y="-44" width="240" height="88" rx="44" fill="#11131f" fill-opacity=".9" stroke="${col}" stroke-width="5"/><text x="0" y="14" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="${col}">${lab}</text></g>`;
  o+=chip(200,'ARROYO',BLUE,prog(t,E.water,E.water+.4))+chip(540,'RÍO',BLUE,prog(t,E.rios,E.rios+.4))+chip(880,'PERSONAS',GREEN,prog(t,E.people,E.people+.4));
  if(t>E.rios) o+=`<path d="M330,330 L400,330 M670,330 L740,330" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="${P(t,E.rios,.3)}"/>`;
  return o;};

S.candy=(t,D,B)=>{const E=EVS.candy(B), bag=eBack(clamp(prog(t,E.bag,E.bag+.5)));
  let s=jungle(t,{tone:.25});
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity=".25"/>`;
  for(const [x,y,c] of [[260,520,'#8a2a6a'],[340,560,'#c23a3a'],[220,600,'#6a2a8a'],[300,630,'#d4a020']]) s+=`<circle cx="${x}" cy="${y}" r="38" fill="${c}"/><circle cx="${x-10}" cy="${y-12}" r="9" fill="#fff" opacity=".4"/>`;
  s+=xMark(280,560,prog(t,E.no,E.no+.3));
  s+=A({...JUL,x:720,y:1010,s:.56,sit:true,look:t>E.bag?[0,10]:[-12,-2],brows:'worried',mouth:'line',handle:t>E.bag?[0,-150]:null});
  if(bag>0) s+=`<g transform="translate(720,850) scale(${(bag*.55).toFixed(3)}) translate(-720,-850)">${candyBag(720,850,1,t)}</g>`;
  let o=cam(s,lerp(1,1.08,prog(t,0,D)),540,640,540,560);
  if(t>E.no&&t<E.bag) o+=tag(540,330,'FRUTAS DESCONOCIDAS',PINK,P(t,E.no,.2));
  if(t>E.bag) o+=tag(540,330,'SOLO CARAMELOS',YEL,P(t,E.bag,.2));
  return o;};

S.seats=(t,D,B)=>{const E=EVS.seats(B), seen=t>E.seats;
  let s=jungle(t,{tone:.15});
  for(let i=0;i<4;i++){const a=t*.7+i*1.6;s+=vulture(640+Math.cos(a)*280,360+Math.sin(a)*80,1.4,t,i);}
  s+=jSeatRow(760,980,.6,-8,'#2f5a8f');
  if(t>E.pass) for(const x of [-150,0,150]) s+=`<g transform="translate(760,980) rotate(-8) scale(.6)"><ellipse cx="${x}" cy="-200" rx="56" ry="70" fill="#14161c" opacity=".85"/><circle cx="${x}" cy="-300" r="46" fill="#14161c" opacity=".85"/></g>`;
  s+=A({...JUL,x:270,y:1010,s:.52,look:seen?[12,0]:[6,-12],eyes:t>E.pass?'wide':'open',brows:'worried',mouth:t>E.pass?'o':'line',handle:t>E.pass?[0,-430]:null});
  s+=ferns(t,.15);
  let o=cam(s,lerp(1,1.1,eIO(prog(t,E.seats-.5,D))),600,700,540,600);
  if(t>E.vult&&t<E.seats) o+=tag(540,450,'BUITRES',PINK,P(t,E.vult,.2));
  if(t>E.pass) o+=tag(540,450,'NO MIRA ATRÁS',YEL,P(t,E.pass+.3,.2));
  return o;};

S.river=(t,D,B)=>{const E=EVS.river(B), dx=lerp(220,760,prog(t,0,D));
  let s=jungle(t,{ground:1200});
  s+=waterBand(t,620,1200,'#5a7a6a');
  const id=uid('rv');
  s+=`<clipPath id="${id}"><rect x="-600" y="-900" width="2280" height="${(1500+Math.sin(t*2)*6).toFixed(0)}"/></clipPath>`;
  const by=900+Math.sin(t*2)*6;
  s+=`<g>${A({...JUL,x:dx,y:by+260*.5,s:.5,eyes:'open',brows:'worried',mouth:'line',look:[10,0],still:true})}</g>`;
  s+=`<rect x="-600" y="${by.toFixed(1)}" width="2280" height="400" fill="#5a7a6a"/>`+`<ellipse cx="${dx}" cy="${by.toFixed(1)}" rx="90" ry="12" fill="#d9efe8" opacity=".6"/>`;
  s+=waterBand(t,by+10,1300,'#4a6a5c');
  for(let i=0;i<8;i++) s+=`<ellipse cx="${i*150-40}" cy="1200" rx="120" ry="80" fill="#1a4a24"/>`;
  s+=`<rect x="-600" y="560" width="2280" height="80" fill="#1f4a2e"/>`;for(let i=0;i<10;i++) s+=`<circle cx="${i*120-30}" cy="580" r="70" fill="${i%2?'#24592f':'#1a4a24'}"/>`;
  let o=cam(s,1.04,540,760,540,600);
  if(t>E.float&&t<E.bank) o+=tag(540,470,'RÍO ABAJO',BLUE,P(t,E.float,.2));
  if(t>E.bank) o+=tag(540,470,'ORILLA IMPENETRABLE',GREEN,P(t,E.bank,.2));
  return o;};

S.days=(t,D,B)=>{const E=EVS.days(B), cyc=t*1.4;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${mix('#7cb0d8','#14182a',(Math.sin(cyc)+1)/2)}"/>`;
  s+=`<circle cx="${540+Math.cos(cyc)*420}" cy="${520-Math.sin(cyc)*260}" r="50" fill="#ffe7a0"/>`;
  s+=waterBand(t,700,1100,'#5a7a6a');
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#4a5a2a"/>`;for(let i=0;i<10;i++) s+=`<circle cx="${i*120-30}" cy="700" r="80" fill="${i%2?'#24592f':'#1a4a24'}"/>`;
  s+=A({...JUL,x:420,y:1010,s:.54,sit:true,eyes:'closed',brows:'worried',mouth:'line'});
  s+=ferns(t,.1);
  let o=cam(s,1.03,540,700,540,600);
  const day=5+Math.min(2,Math.floor(t/ (D/3)));
  if(t<E.wound) o+=countPop('DÍA '+day,540,480,90,t%(D/3),YEL);
  if(t>E.wound){const a=P(t,E.wound,.3);o+=`<g opacity="${a}"><circle cx="760" cy="420" r="150" fill="${JUL.skin}" stroke="#fff" stroke-width="8"/><ellipse cx="760" cy="420" rx="70" ry="34" fill="#b5584a"/><ellipse cx="760" cy="420" rx="40" ry="16" fill="#8a2a2a"/>`;
    if(t>E.worms) for(let i=0;i<6;i++) o+=`<path d="M${730+i*12},${410+(i%2)*14} q6,${(-6+Math.sin(t*8+i)*4).toFixed(1)} 12,0" stroke="#f3eee6" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    o+=`</g>`;}
  return o;};

S.hut=(t,D,B)=>{const E=EVS.hut(B), arrive=eOut(prog(t,B[1].s,E.hut+.6)), pour=t>E.pour;
  let s=jungle(t,{ground:920});
  s+=waterBand(t,960,1300,'#5a7a6a');
  if(t>E.hut-.3) s+=hutK(700,920,1);
  if(t>E.boat-.3) s+=canoe(820,1040,.9,t);
  if(t>E.fuel-.3&&!pour) s+=fuelCan(480,920,.8);
  const jx=lerp(-80,380,arrive);
  s+=A({...JUL,x:jx,y:930,s:.52,walk:arrive<1?t*6:null,look:[10,2],brows:'worried',mouth:pour?'o':'line',eyes:pour?'closed':'open',reachR:pour?[160,-300]:null});
  if(pour){s+=fuelCan(jx+120,690,.6,-110);for(let i=0;i<5;i++){const p=(t*2+i/5)%1;s+=`<circle cx="${(jx+70-p*20).toFixed(0)}" cy="${(700+p*80).toFixed(0)}" r="5" fill="#f2c94c" opacity="${(1-p).toFixed(2)}"/>`;}}
  s+=ferns(t);
  let o=cam(s,1.04,540,700,540,600);
  if(t<B[1].s) o+=tag(540,470,'CON LO QUE TENGAS',GREEN,P(t,.2,.2));
  if(t>E.hut&&t<E.pour) o+=tag(700,470,'CABAÑA · BARCA · GASOLINA',YEL,P(t,E.hut,.2));
  if(t>E.pour) o+=tag(720,470,'GASOLINA EN LA HERIDA',PINK,P(t,E.pour,.2));
  return o;};

S.rescue=(t,D,B)=>{const E=EVS.rescue(B), k=eOut(prog(t,0,E.men+.6)), sp=t>E.spirit;
  let s=jungle(t,{ground:920});
  s+=waterBand(t,960,1300,'#5a7a6a')+hutK(780,920,1)+canoe(300,1050,.8,t);
  if(sp) s+=`<circle cx="760" cy="760" r="${(220+12*Math.sin(t*4)).toFixed(0)}" fill="url(#glowB)" opacity=".9"/>`;
  s+=A({...JUL,x:760,y:930,s:.5,sit:true,look:[-10,0],eyes:'open',brows:'worried',mouth:'line'});
  s+=A({...WK1,x:lerp(-200,200,k),y:930,s:.58,walk:k<1?t*7:null,look:[12,0],eyes:sp?'wide':'open',mouth:sp?'o':'line',aL:sp?150:null,aR:sp?150:null});
  s+=A({...WK2,x:lerp(-340,360,k),y:940,s:.58,walk:k<1?t*7:null,look:[12,0],eyes:sp?'wide':'open',mouth:'o'});
  s+=A({...WK3,x:lerp(-460,500,k),y:950,s:.58,walk:k<1?t*7:null,look:[12,0],eyes:'wide',mouth:'line'});
  s+=ferns(t);
  let o=cam(s,1.04,540,700,540,600);
  if(t>E.men&&!sp) o+=tag(540,330,'TRABAJADORES DE LA SELVA',GREEN,P(t,E.men,.2));
  if(sp) o+=tag(540,330,'¿UN ESPÍRITU DEL AGUA?',BLUE,P(t,E.spirit,.2));
  return o;};

S.eleven=(t,D,B)=>{const E=EVS.eleven(B);
  let s=jungle(t,{ground:1300})+waterBand(t,700,1300,'#5a7a6a');
  for(let i=0;i<10;i++) s+=`<circle cx="${i*120-30}" cy="700" r="80" fill="${i%2?'#24592f':'#1a4a24'}"/>`;
  const cx=lerp(200,700,prog(t,0,D));
  s+=canoe(cx,1000,1.1,t)+A({...WK1,x:cx-120,y:990,s:.45,sit:true,look:[10,0],still:true})+A({...JUL,x:cx+40,y:990,s:.42,sit:true,look:[10,-4],mouth:'smile',still:true});
  let o=cam(s,1.03,540,700,540,600);
  if(t>E.n11){o+=countPop('11 DÍAS',540,330,120,t-E.n11,YEL);for(let i=0;i<11;i++) o+=`<line x1="${300+i*44}" y1="420" x2="${300+i*44+(i%5===4?-150:0)}" y2="${i%5===4?470:500}" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="${prog(t,E.n11+i*.08,E.n11+i*.08+.15)}"/>`;}
  return o;};

S.today=(t,D,B)=>{const E=EVS.today(B), zk=eIO(prog(t,E.selva-.5,D));
  let s=jungle(t);
  s+=`<g transform="translate(820,920)"><rect x="-150" y="-260" width="300" height="260" fill="#7a5a3a"/><path d="M-180,-250 L0,-360 L180,-250Z" fill="#4a6a3a"/><rect x="-110" y="-200" width="80" height="70" fill="#9fd0e8"/><rect x="40" y="-170" width="70" height="170" fill="#3a2a1e"/><rect x="-140" y="-330" width="160" height="40" rx="6" fill="#e9e4d8"/><text x="-60" y="-302" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="22" fill="#2f5a3a">PANGUANA</text></g>`;
  s+=A({...JOLD,x:420,y:1010,s:.6,look:[8,-6],mouth:'smile',reachR:[150,-330]});
  s+=`<rect x="530" y="660" width="70" height="90" rx="6" fill="#e9e4d8" transform="rotate(-10 565 705)"/>`;
  s+=ferns(t);
  if(t>E.mata) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity="${(.35*prog(t,E.mata,E.mata+1)).toFixed(2)}"/>`;
  let o=cam(s,lerp(1.1,.95,zk),540,700,540,600);
  if(t>E.bio&&t<E.selva+1.5) o+=tag(540,330,'BIÓLOGA',GREEN,P(t,E.bio,.2));
  return o;};

window.CFG={steps:['1. BUSCA AGUA QUE CORRA','2. NADA QUE NO CONOZCAS','3. DÉJATE LLEVAR POR EL RÍO','4. CURA LAS HERIDAS'],listEnd:'rescue',
  band:{hook:'#1f4a2e',cabin:'#5a5a6a',storm:'#0c0f18',fall:'#1f4a2e',wake:'#2a3a1e',count:'#11131c',dad:'#4a4a2a',stream:'#2a3a1e',candy:'#1a2a18',seats:'#22301a',river:'#1a4a24',days:'#4a5a2a',hut:'#2a3a1e',rescue:'#2a3a1e',eleven:'#4a6a5c',today:'#2a3a1e'}};

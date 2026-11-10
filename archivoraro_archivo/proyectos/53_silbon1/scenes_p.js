// ================= EL SILBÓN · PARTE 1 =================
const EVS={
  door0:B=>({bones:B[0].w[9],listen:B[0].w[16],l2:B[1].s,family:B[1].w[8],dawn:B[1].w[12]}),
  road:B=>({llanos:B[0].w[1],mateo:B[0].w[4],party:B[0].w[10],road:B[0].w[13],solo:B[0].w[16],canelo:B[0].w[18],abuela:B[0].w[23]}),
  warn:B=>({warn:B[0].w[5],whistle:B[0].w[8],back:B[0].w[11]}),
  whistle:B=>({half:B[0].w[3],silba:B[0].w[5],wend:B[1].s-.15,near:B[1].w[1]}),
  rule1:B=>({near:B[0].w[6],far:B[0].w[10],walk:B[0].w[11],l2:B[1].s,acc:B[1].w[1],off:B[1].w[5]}),
  far:B=>({back:B[0].w[2],soft:B[0].w[3],far:B[0].w[4]}),
  growl:B=>({stop:B[0].w[4],growl:B[0].w[7],dark:B[0].w[10],side:B[0].w[13],l2:B[1].s,move:B[1].w[12],sees:B[1].w[15]}),
  reveal:B=>({trees:B[0].w[2],tall:B[0].w[6],thin:B[0].w[10],sack:B[0].w[16],bones:B[0].w[22]}),
  bark:B=>({bark:B[0].w[1],away:B[0].w[6]}),
  rule3:B=>({dogs:B[0].w[8],whip:B[0].w[11]}),
  home:B=>({lock:B[0].w[5],key:B[0].w[7],wall:B[0].w[10],whip:B[0].w[12]}),
  wake:B=>({three:B[0].w[2],wake:B[0].w[6]}),
  count:B=>({door:B[0].w[3],bones:B[0].w[7],n1:B[0].w[8],n2:B[0].w[9],n3:B[0].w[10],l2:B[1].s,hears:B[1].w[2]}),
  grandma:B=>({abuela:B[0].w[1],bed:B[0].w[4],no:B[0].w[8],l2:B[1].s,two:B[1].w[1],dawn:B[1].w[5]}),
  whip:B=>({one:B[0].w[3],save:B[0].w[6]}),
};
const S={};
const MATEO={skin:'#c98c64',hs:'short',hair:'#1d1514',top:'#3a6a8a',topD:'#2a5070',hood:true,strings:true,pants:'#2a2e3a',shoes:'#e9e4d8',seed:211};
const ABUELA={...CAST_BY_ID.C15.o,top:'#d8c0a8',topD:'#b89a80',jacket:'#5a4a6a',skirt:'#3a3040',glasses:'round'};
const faceY=(y,s)=>y-s*640;
function canelo(x,y,s,t,o={}){const keep={...DOB};DOB.body='#a8642c';DOB.tan='#e8b47a';DOB.ear='#7a4418';const g=doberman(x,y,s,t,o);Object.assign(DOB,keep);
  let ov='';if(o.hackles){const d=o.dir||1;for(let i=0;i<7;i++){const hx=x+d*s*(-90+i*24),hy=y-s*(232+Math.sin(i*1.7)*4);ov+=`<path d="M${hx},${hy} l${d*s*6},${-s*(14+Math.sin(t*20+i)*4)}" stroke="#7a4418" stroke-width="${s*10}" stroke-linecap="round"/>`;}}
  return g+ov}
const sbFlash=(x,y,dir,len,on=1)=>on<=0?'':`<path d="M${x},${y-10} L${x+dir*len},${y-len*.3} L${x+dir*len},${y+len*.3} L${x},${y+10}Z" fill="#fff6c0" opacity="${(.16*on).toFixed(2)}"/><circle cx="${x}" cy="${y}" r="10" fill="#fff6c0" opacity="${on}"/>`;

// ---------- sets ----------
function moriche(x,y,h,col='#0a0e1a'){let s=`<path d="M${x},${y} Q${x+6},${y-h*.5} ${x+3},${y-h}" stroke="${col}" stroke-width="${Math.max(5,h*.05)}" fill="none"/>`;
  for(let i=0;i<11;i++){const a=(-170+i*16)*Math.PI/180;s+=`<path d="M${x+3},${y-h} q${(Math.cos(a)*h*.28).toFixed(1)},${(Math.sin(a)*h*.28-h*.06).toFixed(1)} ${(Math.cos(a)*h*.5).toFixed(1)},${(Math.sin(a)*h*.4+h*.14).toFixed(1)}" stroke="${col}" stroke-width="${Math.max(3,h*.03)}" fill="none" stroke-linecap="round"/>`;}return s}
function llanos(t,o={}){const hz=o.hz??620, pan=o.pan||0;
  let s=`<defs><linearGradient id="llsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03050f"/><stop offset=".65" stop-color="#121a40"/><stop offset="1" stop-color="#2a2850"/></linearGradient>
    <radialGradient id="llmn"><stop offset="0" stop-color="#fff8e0" stop-opacity=".5"/><stop offset="1" stop-color="#fff8e0" stop-opacity="0"/></radialGradient>
    <linearGradient id="llmist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a9ad0" stop-opacity="0"/><stop offset=".5" stop-color="#8a9ad0" stop-opacity=".22"/><stop offset="1" stop-color="#8a9ad0" stop-opacity="0"/></linearGradient></defs>`;
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="url(#llsk)"/>`+stars(9,170,hz,t,.95);
  const mx=(o.moonX??260)-pan*.1;s+=`<circle cx="${mx}" cy="240" r="320" fill="url(#llmn)"/><circle cx="${mx}" cy="240" r="84" fill="#f6f0dc"/><circle cx="${mx-24}" cy="222" r="15" fill="#e2dcc4"/><circle cx="${mx+26}" cy="262" r="10" fill="#e2dcc4"/><circle cx="${mx+12}" cy="210" r="7" fill="#e2dcc4"/>`;
  s+=puffs(t,170,'#3a4270',.35,5,6);
  // far line + distant palms + a far house with a light
  s+=`<path d="M-600,${hz} Q0,${hz-16} 600,${hz-6} T1680,${hz-10} L1680,1500 L-600,1500Z" fill="#11162a"/>`;
  for(const [x,h] of [[-80,120],[40,150],[90,110],[760,170],[830,130],[900,150],[1020,110]]) s+=moriche(x-pan*.2,hz+4,h,'#0b0f1e');
  if(o.farHouse) s+=`<rect x="${560-pan*.2}" y="${hz-28}" width="46" height="28" fill="#0b0f1e"/><path d="M${552-pan*.2},${hz-28} l31,-18 l31,18Z" fill="#0b0f1e"/><rect x="${574-pan*.2}" y="${hz-18}" width="10" height="10" fill="#ffcf7a"/><circle cx="${579-pan*.2}" cy="${hz-13}" r="24" fill="#ffcf7a" opacity=".2"/>`;
  if(o.party){const px=180-pan*.2;s+=`<rect x="${px}" y="${hz-34}" width="80" height="34" fill="#0b0f1e"/>`;for(let i=0;i<9;i++){const on=Math.sin(t*4+i*1.3)>0;s+=`<circle cx="${px-30+i*16}" cy="${hz-44+Math.sin(i)*4}" r="3.5" fill="${['#ff5a6a','#ffd34a','#5ad0ff'][i%3]}" opacity="${on?1:.35}"/>`;}s+=`<circle cx="${px+40}" cy="${hz-30}" r="70" fill="#ffb060" opacity=".12"/>`;}
  // ground + road (perspective) + grass
  s+=`<path d="M-600,${hz+10} Q540,${hz-4} 1680,${hz+10} L1680,1500 L-600,1500Z" fill="#161d30"/>`;
  const vx=540-pan*.4;s+=`<path d="M${vx-30},${hz+6} L${vx+30},${hz+6} L${vx+520},1500 L${vx-520},1500Z" fill="#3a3248"/><path d="M${vx-10},${hz+6} L${vx+10},${hz+6} L${vx+170},1500 L${vx-170},1500Z" fill="#4a4058" opacity=".55"/>`;
  for(let i=0;i<10;i++){const k=i/10,y=hz+20+k*k*900;s+=`<ellipse cx="${vx+Math.sin(i*2.3)*200*k}" cy="${y}" rx="${6+k*30}" ry="${2+k*6}" fill="#2a2436" opacity=".7"/>`;}
  const r=rng(5);for(let i=0;i<120;i++){const x=-300+r()*1700,y=hz+14+r()*900,k=(y-hz)/900,h=6+k*44;if(Math.abs(x-vx)<40+k*560) continue;const sw=Math.sin(t*1.4+i)*3*k;s+=`<path d="M${x},${y} q${-4+sw},${-h*.6} ${-8+sw},${-h} M${x},${y} q${2+sw},${-h*.7} ${3+sw},${-h*1.2} M${x},${y} q${6+sw},${-h*.5} ${10+sw},${-h*.9}" stroke="#25332a" stroke-width="${1.5+k*2.5}" fill="none"/>`;}
  s+=`<rect x="-600" y="${hz-40}" width="2280" height="160" fill="url(#llmist)"/>`;
  if(o.fireflies!==false) for(let i=0;i<18;i++){const x=((i*157+t*14)%1300)-100,y=hz+40+((i*97)%380)+Math.sin(t*1.7+i)*20,a=Math.max(0,Math.sin(t*2.3+i*1.7));s+=`<circle cx="${x}" cy="${y}" r="3.5" fill="#d8ff6a" opacity="${(.2+.8*a).toFixed(2)}"/><circle cx="${x}" cy="${y}" r="14" fill="#d8ff6a" opacity="${(.12*a).toFixed(2)}"/>`;}
  return s}
function treeline(t,x0,x1,y,o={}){ // dark wall of trees/bush beside the road
  let s=`<path d="M${x0},${y} `;for(let x=x0;x<=x1;x+=40) s+=`L${x},${y-160-((x*7)%90)-Math.sin(x*.05)*30} `;s+=`L${x1},${y+300} L${x0},${y+300}Z" fill="${o.col||'#070a14'}"/>`;
  for(let x=x0+20;x<x1;x+=110) s+=`<path d="M${x},${y+20} L${x+6},${y-200-((x*13)%80)}" stroke="#050710" stroke-width="16"/>`;
  return s}
function porch(t,o={}){ // llanero house front at night: whitewashed adobe, wooden door, shuttered window, tiles, hammock
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a0d1c"/>`+stars(3,60,300,t,.7);
  s+=`<rect x="-600" y="120" width="2280" height="900" fill="#c9c2b0"/>`;
  for(let i=0;i<40;i++){const r=rng(i+3);s+=`<path d="M${-500+r()*2000},${150+r()*800} l${r()*30-15},${r()*30}" stroke="#9a9280" stroke-width="2" opacity=".6"/>`;}
  s+=`<rect x="-600" y="120" width="2280" height="30" fill="#5a3e2a"/>`+[...Array(30)].map((_,i)=>`<rect x="${-600+i*80}" y="80" width="78" height="44" rx="10" fill="#8a4a32" stroke="#5a2e1e" stroke-width="3"/>`).join('');
  s+=`<rect x="-600" y="80" width="2280" height="50" fill="#000" opacity=".15"/>`;
  // door
  s+=`<rect x="280" y="330" width="300" height="690" fill="#5a3a22"/>`+[0,1,2,3].map(i=>`<rect x="${288+i*72}" y="338" width="66" height="674" fill="#6a4628" stroke="#3a2414" stroke-width="3"/>`).join('')+`<rect x="268" y="318" width="324" height="14" fill="#3a2414"/><circle cx="548" cy="680" r="9" fill="#2a2a2e"/>`;
  // window with shutters (grandma inside)
  s+=`<rect x="720" y="380" width="260" height="260" fill="#141a2a" stroke="#3a2414" stroke-width="14"/>`+[0,1,2,3,4,5].map(i=>`<rect x="${736+i*40}" y="390" width="10" height="240" fill="#2a2a2e"/>`).join('');
  // details: horseshoe, hanging plants, hammock hooks, a lamp, bench, clay pots
  s+=`<path d="M160,420 q-22,-6 -22,22 q0,22 22,26 M160,420 q22,-6 22,22 q0,22 -22,26" stroke="#7a7a80" stroke-width="7" fill="none"/>`;
  s+=`<path d="M60,140 l0,120" stroke="#3a2e22" stroke-width="3"/><path d="M30,300 q30,-46 60,0 q-30,30 -60,0Z" fill="#a85a3a"/>`+[0,1,2,3,4].map(i=>`<path d="M60,262 q${-30+i*15},20 ${-36+i*18},70" stroke="#2f6a3a" stroke-width="6" fill="none"/>`).join('');
  s+=`<rect x="640" y="520" width="20" height="40" fill="#2a2a2e"/><path d="M630,520 l40,0 l-6,-30 l-28,0Z" fill="#ffcf7a" opacity="${o.lamp??0}"/>`;
  s+=`<rect x="-600" y="1010" width="2280" height="600" fill="#6a3a2a"/>`;for(let x=-600;x<1700;x+=90) s+=`<line x1="${x}" y1="1010" x2="${(x-540)*1.5+540}" y2="1600" stroke="#3a1e14" stroke-width="3"/>`;for(const y of [1060,1140]) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#3a1e14" stroke-width="3"/>`;
  s+=`<path d="M40,1010 l-20,-120 l90,0 l-20,120Z" fill="#9a5a3a"/>`+[0,1,2].map(i=>`<path d="M60,890 q${-20+i*20},-60 ${-30+i*30},-90" stroke="#3a7a3a" stroke-width="8" fill="none"/>`).join('');
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a1030" opacity=".45"/>`;     // night tint
  s+=`<path d="M-600,120 L1680,120 L1680,180 L-600,300Z" fill="#000" opacity=".3"/>`;      // eave shadow
  return s}
function interior(t,o={}){ // inside the house at night: adobe, beams, crucifix, calendar, grandfather's photo, the whip, hat, shelf, clock
  const lit=o.lit??.2;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#b8ab92"/>`;
  for(let i=0;i<50;i++){const r=rng(i+11);s+=`<path d="M${-500+r()*2000},${80+r()*850} l${r()*40-20},${r()*36}" stroke="#8a7e66" stroke-width="2" opacity=".5"/>`;}
  s+=[0,1,2,3].map(i=>`<rect x="-600" y="${40+i*14}" width="2280" height="10" fill="#4a3220"/>`).join('')+[...Array(14)].map((_,i)=>`<rect x="${-560+i*160}" y="0" width="22" height="100" fill="#3a2414"/>`).join('');
  // crucifix, calendar, photo of the grandfather (llanero with hat), the whip on a nail, a hat on a hook, shelf with candles, wall clock
  s+=`<g transform="translate(110,250)"><rect x="-6" y="-60" width="12" height="120" fill="#4a3220"/><rect x="-34" y="-30" width="68" height="12" fill="#4a3220"/></g>`;
  s+=dCalendar(170,330,.8,{month:'NOVIEMBRE',mark:true});
  s+=`<g transform="translate(330,300)"><rect x="0" y="0" width="120" height="150" fill="#6a4a2a"/><rect x="10" y="10" width="100" height="130" fill="#d8c8a0"/><circle cx="60" cy="70" r="22" fill="#8a7050"/><path d="M28,58 q32,-24 64,0Z" fill="#5a4a30"/><path d="M20,58 l80,0" stroke="#5a4a30" stroke-width="6"/><rect x="40" y="92" width="40" height="48" fill="#6a5a40"/><rect x="10" y="10" width="100" height="130" fill="#a86a2a" opacity=".25"/></g>`;
  const wx=o.whipX??560, wy=o.whipY??330, glint=o.glint||0;
  s+=`<circle cx="${wx}" cy="${wy}" r="6" fill="#2a2a2e"/><path d="M${wx},${wy} q-40,30 -36,90 q4,40 40,52 q40,10 30,50" stroke="#2a1a10" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${wx},${wy} q-40,30 -36,90 q4,40 40,52 q40,10 30,50" stroke="#5a3a20" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  s+=`<rect x="${wx-6}" y="${wy-4}" width="16" height="70" rx="6" fill="#6a4628" stroke="#2a1a10" stroke-width="3" transform="rotate(-20 ${wx} ${wy})"/>`;
  if(glint>0) s+=`<circle cx="${wx-26}" cy="${wy+80}" r="${40*glint}" fill="#fff6d0" opacity="${(.35*glint).toFixed(2)}"/><path d="M${wx-26},${wy+40} l0,80 M${wx-66},${wy+80} l80,0" stroke="#fff" stroke-width="3" opacity="${glint}"/>`;
  s+=`<circle cx="760" cy="300" r="5" fill="#2a2a2e"/><g transform="translate(760,316)"><ellipse cx="0" cy="40" rx="80" ry="14" fill="#8a7450"/><path d="M-36,40 Q-34,-6 0,-8 Q34,-6 36,40Z" fill="#8a7450"/><rect x="-36" y="26" width="72" height="10" fill="#3a2a1a"/></g>`;
  s+=dShelf(840,470,.9,{w:200,seed:9})+`<g transform="translate(900,470)">${candleSV(0,0,.7,t,lit>0.3?1:0)}</g>`;
  s+=dClock(980,250,.8,t,{stopped:true,h:o.clockH??3,m:o.clockM??0});
  s+=`<rect x="-600" y="1010" width="2280" height="600" fill="#8a4a32"/>`;for(let x=-600;x<1700;x+=100) s+=`<line x1="${x}" y1="1010" x2="${(x-540)*1.5+540}" y2="1600" stroke="#5a2e1e" stroke-width="3"/>`;
  s+=`<rect x="-600" y="1000" width="2280" height="14" fill="#5a3a22"/>`;
  return s}
const candleSV=(x,y,s,t,on=1)=>{const f=1+.08*Math.sin(t*17)+.05*Math.sin(t*9);return `<g transform="translate(${x},${y}) scale(${s})">${on?`<circle cx="0" cy="-60" r="160" fill="url(#glowY)" opacity=".75"/>`:''}<rect x="-10" y="-46" width="20" height="46" fill="#f3eee2"/>${on?`<path d="M0,${(-54-30*f).toFixed(1)} Q12,-62 0,-52 Q-12,-62 0,${(-54-30*f).toFixed(1)}Z" fill="#ffd76a"/>`:''}</g>`};
function bonesRow(x,y,n,k=1,sc=1){let s='';for(let i=0;i<n;i++){const bx=x+i*62*sc,a=i===n-1?k:1;s+=`<g transform="translate(${bx},${y - (1-a)*40*sc}) rotate(${-8+i*9}) scale(${sc})" opacity="${a}"><path d="M-24,0 L24,0" stroke="#16131b" stroke-width="16" stroke-linecap="round"/><path d="M-24,0 L24,0" stroke="#efe6cc" stroke-width="9" stroke-linecap="round"/><circle cx="-26" cy="-5" r="7" fill="#efe6cc" stroke="#16131b" stroke-width="3"/><circle cx="-26" cy="5" r="7" fill="#efe6cc" stroke="#16131b" stroke-width="3"/><circle cx="26" cy="-5" r="7" fill="#efe6cc" stroke="#16131b" stroke-width="3"/><circle cx="26" cy="5" r="7" fill="#efe6cc" stroke="#16131b" stroke-width="3"/></g>`;}return s}
function whistleDots(t,t0,x0,y0,far){ // one glowing dot per note, rising like the whistle (13 notes, first longer)
  let s='';const durs=[.33,...Array(11).fill(.2),.5];let acc=0;
  for(let i=0;i<13;i++){const tt=t-t0-acc;acc+=durs[i];if(tt<0) break;const a=Math.max(0,1-tt/2.2)*(far?.5:1), x=x0+i*(far?6:26), y=y0-i*(far?6:26);
    s+=`<circle cx="${x}" cy="${y}" r="${far?4:8}" fill="#e8f4ff" opacity="${a.toFixed(2)}"/><circle cx="${x}" cy="${y}" r="${far?16:34}" fill="#bfe0ff" opacity="${(a*.3).toFixed(2)}"/>`;}
  return s}

// ================= scenes =================
S.door0=(t,D,B)=>{const E=EVS.door0(B);
  if(t<E.l2-.1){ // close on the porch floor at the foot of the door: a bony hand laying bones out, one by one
    const n=Math.min(6,1+Math.floor(t/0.85)), k=prog(t%0.85,0,.35);
    let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0c0a14"/>`;
    s+=`<rect x="120" y="-200" width="880" height="840" fill="#3a2414"/>`+[0,1,2,3].map(i=>`<rect x="${128+i*218}" y="-200" width="212" height="834" fill="#4a3020" stroke="#22140a" stroke-width="4"/>`).join('')+[0,1,2,3].map(i=>`<path d="M${150+i*218},${100+i*30} q60,-10 140,6" stroke="#2a1a0e" stroke-width="3" fill="none"/>`).join('');
    s+=`<rect x="100" y="630" width="920" height="22" fill="#2a1a0e"/>`;
    s+=`<path d="M-600,652 L1680,652 L1680,1500 L-600,1500Z" fill="#5a3022"/>`;for(let x=-600;x<1700;x+=110) s+=`<line x1="${x}" y1="652" x2="${(x-540)*1.9+540}" y2="1500" stroke="#3a1c12" stroke-width="3"/>`;for(const y of [720,820,960]) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#3a1c12" stroke-width="3"/>`;
    s+=`<path d="M-600,652 L300,652 L900,1500 L-600,1500Z" fill="#cfd8ff" opacity=".1"/>`;
    s+=sbSack(170,560,{bur:'bonebur',shade:'boneshade'}).replace('<path','<defs><pattern id="bonebur" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#9c7c4c"/><path d="M0,3 H12 M0,9 H12" stroke="#5e4828" stroke-width="2.4" opacity=".6"/></pattern><radialGradient id="boneshade"><stop offset=".4" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient></defs><path');
    s+=bonesRow(400,880,n,k,1.5);
    const bx=400+(n-1)*93, hy=lerp(700,800,k);
    s+=`<defs>${sbGrad('hgrad',0,0,1,0,[[0,SB.skinL],[.4,SB.skin],[1,SB.skinD]])}</defs><g transform="translate(${bx+60},${hy}) scale(1.5) translate(${-bx-60},${-hy})">`+sbLimb([bx+460,hy-640],[bx+60,hy-40],46,30,'hgrad')+sbHand([bx+60,hy-40],100,'hgrad',1.1,.45)+`</g>`;
    s+=dark(.5,[[520,860,620,320]]);
    let o=cam(s,lerp(1.0,1.1,eIO(prog(t,0,E.l2))),540,lerp(700,740,prog(t,0,E.l2)),540,560,shake(t,.2,1.5));
    if(t>E.bones) o+=tag(780,330,'HUESOS',PINK,P(t,E.bones,.2));
    if(t>E.listen) o+=bang(280,330,'CLAC...',YEL,P(t,E.listen,.15),70);
    return o;}
  // tilt up to the window: grandma asleep inside
  const up=eIO(prog(t,E.l2-.1,E.l2+1.2)), kf=eIO(prog(t,E.family-.3,E.family+.8));
  let bg=porch(t);
  bg+=`<rect x="690" y="350" width="320" height="320" fill="#141a2a" stroke="#3a2414" stroke-width="16"/>`;
  let fg=`<defs><clipPath id="winclip"><rect x="698" y="358" width="304" height="304"/></clipPath></defs><g clip-path="url(#winclip)"><rect x="690" y="350" width="330" height="330" fill="#2a2c44"/><circle cx="760" cy="400" r="120" fill="#9ab0ff" opacity=".15"/>`;
  fg+=`<rect x="700" y="560" width="300" height="110" fill="#5a3a22"/><rect x="700" y="540" width="300" height="40" rx="12" fill="#e8e0d0"/>`+lying({...ABUELA,x:930,y:556,s:.34,eyes:'closed',mouth:'smile'},.34)+`<path d="M760,560 Q850,530 1000,556 L1000,600 L760,600Z" fill="#8a6a9a"/></g>`;
  fg+=[0,1,2,3,4].map(i=>`<rect x="${730+i*58}" y="360" width="7" height="300" fill="#1a1a1e"/>`).join('')+`<rect x="690" y="350" width="320" height="320" fill="none" stroke="#3a2414" stroke-width="16"/>`;
  let o=focusCam(bg,fg,Math.max(kf*.9,0),860,560,{z0:lerp(1.3,1.05,up),z1:2.6,cx:lerp(520,620,up),cy:lerp(900,560,up)});
  if(t>E.dawn) o+=tag(540,880,'NO VERÁ EL AMANECER',PINK,P(t,E.dawn,.2));
  return o;};

S.road=(t,D,B)=>{const E=EVS.road(B), k=prog(t,0,D);
  if(t<E.mateo-.2){ // wide: the llanos at night, party lights far behind
    let s=llanos(t,{party:true,farHouse:true,pan:k*120});
    s+=A({...MATEO,x:540,y:820,s:.22,walk:t*6,dirW:1,look:[0,4]})+canelo(590,822,.16,t,{walk:t*8,dir:1});
    let o=cam(s,lerp(1.0,1.12,prog(t,0,E.mateo)),540,620,540,560);
    if(t>E.llanos) o+=tag(540,330,'LOS LLANOS · VENEZUELA',YEL,P(t,E.llanos,.25));
    return o;}
  // medium: Mateo walking towards camera with his torch, Canelo trotting
  let s=llanos(t,{party:true,pan:200+k*80})+treeline(t,780,1700,820,{col:'#080b16'});
  const wx=lerp(470,520,prog(t,E.mateo,D));
  s+=sbFlash(wx+.62*170,1010-.62*430,1,420,1);
  s+=canelo(wx+190,1012,.4,t,{walk:t*9,dir:1,alert:.6,head:t>E.canelo?18:6,wag:t>E.canelo});
  s+=A({...MATEO,x:wx,y:1010,s:.62,walk:t*6.2,dirW:1,look:t>E.canelo?[14,6]:[8,-2],mouth:t>E.party&&t<E.road?'smile':'line',reachR:[170,-430]});
  let o=cam(s,lerp(1.02,1.1,prog(t,E.mateo,D)),540,700,540,600);
  if(t>E.mateo&&t<E.solo) o+=tag(300,430,'MATEO · 17',BLUE,P(t,E.mateo,.2));
  if(t>E.canelo) o+=tag(790,430,'CANELO',YEL,P(t,E.canelo,.2));
  return o;};

S.warn=(t,D,B)=>{const E=EVS.warn(B);
  // flashback, earlier that night: grandma at the door, finger up
  let bg=porch(t,{lamp:1})+`<circle cx="650" cy="510" r="260" fill="url(#glowY)" opacity=".6"/>`;
  let fg=A({...ABUELA,x:430,y:1010,s:.66,look:[12,-2],brows:'worried',mouth:t>E.warn?'o':'line',reachR:t>E.warn?[90,-760]:null});
  fg+=A({...MATEO,x:760,y:1010,s:.64,look:[-12,-2],mouth:'smile',eyes:t>E.back?'wide':'open'});
  fg+=canelo(940,1012,.4,t,{dir:-1,alert:.5,head:10,wag:true});
  const k=eIO(prog(t,E.whistle-.4,E.whistle+.6));
  let o=focusCam(bg,fg,k,430,faceY(1010,.66),{z0:1.04,z1:1.8});
  o=`<g filter="url(#sepia)">${o}</g><defs><filter id="sepia"><feColorMatrix type="matrix" values="0.45 0.6 0.15 0 0.04  0.38 0.55 0.13 0 0.02  0.28 0.42 0.1 0 0  0 0 0 1 0"/></filter></defs>`;
  o+=`<rect x="0" y="0" width="1080" height="1100" fill="none" stroke="#f3eee2" stroke-width="22" opacity=".85"/>`;
  if(t>E.warn) o+=bubble(560,300,0,0,'«SI OYES SILBAR, NO MIRES ATRÁS»',{op:P(t,E.warn,.25),tx:430,ty:faceY(1010,.66)-40,size:40});
  o+=`<text x="60" y="1060" font-family="${MONO}" font-weight="800" font-size="30" fill="#f3eee2" opacity=".85">ESA TARDE · 19:40</text>`;
  return o;};

S.whistle=(t,D,B)=>{const E=EVS.whistle(B), stop=t>E.silba-.2, k=eIO(prog(t,E.silba,E.silba+1.6))*(1-eIO(prog(t,E.wend,E.wend+.3)))*.9+eIO(prog(t,E.near-.1,E.near+.4))*.0;
  let bg=llanos(t,{pan:240})+treeline(t,-600,260,840)+treeline(t,800,1700,840);
  let fg=sbFlash(500+.62*170,1010-.62*430,1,380,1);
  fg+=canelo(700,1012,.4,t,{walk:stop?null:t*9,dir:1,alert:stop?1:.6,head:stop?28:6});
  fg+=A({...MATEO,x:500,y:1010,s:.62,walk:stop?null:t*6.2,dirW:1,look:stop?[0,-6]:[8,-2],brows:stop?'up':null,eyes:stop?'wide':'open',mouth:stop?'o':'line',reachR:[170,-430]});
  if(stop) fg+=sweat(500,1010,.62,t);
  if(t>E.silba) fg+=whistleDots(t,E.silba+.45,160,640,false);
  const near=t>E.wend;
  if(near) fg+=soundArcs(500-60,faceY(1010,.62),t,'#e8f4ff',-1,4)+soundArcs(500+70,faceY(1010,.62),t,'#e8f4ff',1,4);
  let o=focusCam(bg,fg,Math.max(k,near?eIO(prog(t,E.wend,E.wend+.5))*1:0),500,faceY(1010,.62),{z0:1.04,z1:near?2.4:1.8});
  if(near) o+=tag(540,880,'MUY CERCA',PINK,P(t,E.near,.2));
  else if(t>E.silba) o+=bang(800,360,'♪',BLUE,P(t,E.silba,.2),120);
  return o;};

S.rule1=(t,D,B)=>{const E=EVS.rule1(B), fast=t>E.acc, wk=t*(fast?8.5:6.2);
  let s=llanos(t,{pan:260+t*30,fireflies:true})+treeline(t,-600,200,840)+treeline(t,880,1700,840);
  // far away on the horizon, almost invisible: a very tall thin figure (it IS far)
  if(t<E.l2) s+=`<g opacity="${(.5*P(t,E.far,.4)).toFixed(2)}">${silbonHD(980,632,.06,t,{glow:.6})}</g>`;
  s+=sbFlash(520+.62*170,1010-.62*430,1,380,1);
  s+=canelo(700,1012,.4,t,{walk:t*(fast?12:9),dir:1,alert:.7,head:6});
  s+=A({...MATEO,x:520,y:1010,s:.62,walk:wk,stride:fast?1.3:1,lean:fast?8:2,dirW:1,look:[10,-2],brows:'worried',mouth:'line',reachR:[170,-430]});
  if(t>E.off) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity="${(.15*P(t,E.off,.4)).toFixed(2)}"/>`;
  let o=cam(s,lerp(1.02,1.12,prog(t,0,D)),560,700,540,600,fast?shake(t,.3,2):0);
  if(t>E.near&&t<E.l2) o+=tag(760,460,'CERCA = LEJOS',BLUE,P(t,E.near,.2));
  if(t>E.far&&t<E.l2) o+=`<g opacity="${P(t,E.far,.3)}"><path d="M940,560 q30,-40 40,-10" stroke="#ffd34a" stroke-width="5" fill="none"/></g>`;
  if(t>E.off) o+=tag(760,460,'SILENCIO',BLUE,P(t,E.off,.2));
  return o;};

S.far=(t,D,B)=>{const E=EVS.far(B), turn=eIO(prog(t,E.far+.2,D));
  // the whistle comes back far away... but legs between the trees right beside the road
  let bg=llanos(t,{pan:300})+treeline(t,-600,320,860)+treeline(t,760,1700,860);
  let fg='';
  // far whistle dots tiny on the horizon
  if(t>E.far) fg+=whistleDots(t,E.far+.45,860,600,true);
  // legs among the trunks on the right (very close)
  fg+=`<g opacity="${(.35+.5*turn).toFixed(2)}">${silbonHD(900,1040,.62,t,{glow:0,fade:1})}</g><rect x="760" y="0" width="900" height="1100" fill="#03040a" opacity="${(.82-.35*turn).toFixed(2)}"/>`;
  fg+=sbFlash(420+.62*170,1010-.62*430,1,300,1);
  fg+=canelo(600,1012,.4,t,{dir:1,alert:1,head:t>E.far?-4:10});
  fg+=A({...MATEO,x:420,y:1010,s:.62,look:t>E.far?[14,-2]:[0,-8],brows:'worried',eyes:t>E.far+.4?'wide':'open',mouth:'line',reachR:[170,-430]});
  let o=focusCam(bg,fg,eIO(prog(t,E.back,E.back+1.2))*.6,560,700,{z0:1.02,z1:1.35,bars:false});
  if(t>E.soft&&t<E.far) o+=bang(860,400,'♪',BLUE,P(t,E.soft,.2)*.6,70);
  if(t>E.far) o+=tag(300,460,'LEJÍSIMOS...',PINK,P(t,E.far,.2));
  return o;};

S.growl=(t,D,B)=>{const E=EVS.growl(B);
  if(t<E.l2-.1){ // close on Canelo: stops dead, hackles up, growls at the dark beside the road
    const g=t>E.growl-.2;
    let bg=llanos(t,{pan:320})+treeline(t,580,1700,880,{col:'#05070e'});
    let fg=A({...MATEO,x:250,y:1060,s:.62,look:[14,6],brows:'worried',mouth:'line',reachR:[170,-430]})+sbFlash(250+.62*170,1060-.62*430,1,260,1);
    fg+=canelo(560,1060,.66,t,{dir:1,alert:1,bark:g&&Math.sin(t*9)>0,head:g?-14:10,hackles:g});
    const k=eIO(prog(t,E.stop-.2,E.stop+.6));
    let o=focusCam(bg,fg,k,640,800,{z0:1.02,z1:1.6,dx:g?Math.sin(t*40)*2:0});
    if(g) o+=bang(860,560,'GRRR...',PINK,P(t,E.growl,.12),78);
    if(t>E.dark) o+=`<g opacity="${P(t,E.dark,.4)}"><path d="M880,760 q60,-20 120,0" stroke="#ff3e6c" stroke-width="4" stroke-dasharray="10,10" fill="none"/></g>`;
    return o;}
  // rule 2: Mateo frozen, the dog sees what he doesn't
  const fr=t>E.move-.3;
  let bg=llanos(t,{pan:320})+treeline(t,620,1700,880,{col:'#05070e'});
  let fg=sbFlash(420+.66*170,1040-.66*430,1,300,.9)+canelo(640,1042,.42,t,{dir:1,alert:1,bark:Math.sin(t*7)>.6,head:-14,hackles:true});
  fg+=A({...MATEO,x:420,y:1040,s:.66,look:[14,4],brows:'worried',eyes:'wide',mouth:'line',reachR:[170,-430]})+sweat(420,1040,.66,t);
  if(t>E.sees) fg+=`<g opacity="${P(t,E.sees,.4)}"><circle cx="930" cy="560" r="5" fill="#fff4c0"/><circle cx="958" cy="560" r="5" fill="#fff4c0"/><circle cx="944" cy="560" r="40" fill="#fff4c0" opacity=".08"/></g>`;
  let o=focusCam(bg,fg,eIO(prog(t,E.move-.4,E.move+.4)),420,faceY(1040,.66),{z0:1.04,z1:1.9});
  if(t>E.move) o+=tag(540,880,'NO TE MUEVAS',PINK,P(t,E.move,.2));
  return o;};

S.reveal=(t,D,B)=>{const E=EVS.reveal(B);
  // tilt up the Silbón among the palms: feet → legs → ribs → face → sack
  const SX=600, SY=1010, SS=.92;
  let w=llanos(t,{pan:340,hz:620,fireflies:false})+treeline(t,-600,200,860,{col:'#05070e'});
  w+=moriche(320,1010,620,'#070a14')+moriche(900,1010,700,'#070a14');
  w+=`<ellipse cx="${SX}" cy="${SY+6}" rx="260" ry="40" fill="#9fb0d8" opacity=".18"/>`;
  const glow=t>E.bones-.2?1:(t>E.tall?.4:0);
  w+=silbonHD(SX,SY,SS,t,{glow,grin:t>E.bones?1:.6,lean:Math.sin(t*.8)*2});
  // Mateo tiny in the foreground, looking up
  w+=sbFlash(160+.5*170,1100-.5*430,1,260,.8)+A({...MATEO,x:160,y:1100,s:.5,look:[10,-14],brows:'up',eyes:'wide',mouth:'o',reachR:[170,-430]});
  w+=particles(t,'dust',{x0:200,x1:1000,y0:200,y1:1000,n:20,col:'#cfe0ff'});
  // camera path
  const p1=eIO(prog(t,0,E.tall)), p2=eIO(prog(t,E.thin-.3,E.thin+.6)), p3=eIO(prog(t,E.sack-.4,E.sack+.4)), p4=eIO(prog(t,E.bones-.3,E.bones+.6));
  let z=lerp(2.2,1.9,p1), cx=lerp(SX,SX+20,p1), cy=lerp(SY-80,SY-SS*960,p1);
  z=lerp(z,.92,p2); cx=lerp(cx,560,p2); cy=lerp(cy,590,p2);
  z=lerp(z,2.0,p3); cx=lerp(cx,SX+SS*170,p3); cy=lerp(cy,SY-SS*820,p3);
  z=lerp(z,2.3,p4); cx=lerp(cx,SX+SS*80,p4); cy=lerp(cy,SY-SS*900,p4);
  let o=cam(w,z,cx,cy,540,560,t>E.bones?shake(t,1-prog(t,E.bones,E.bones+.8),6):0);
  if(t>E.tall&&t<E.thin) o+=tag(540,900,'MÁS ALTO QUE LOS ÁRBOLES',PINK,P(t,E.tall,.2));
  if(t>E.bones) o+=bang(800,330,'CLAC CLAC',YEL,P(t,E.bones,.12),70);
  return o;};

S.bark=(t,D,B)=>{const E=EVS.bark(B), away=eIO(prog(t,E.away-.4,D+.4));
  let s=llanos(t,{pan:340})+treeline(t,-600,200,860,{col:'#05070e'});
  s+=`<g opacity="${(1-away*.85).toFixed(2)}">${silbonHD(lerp(780,980,away),lerp(1000,880,away),lerp(.78,.55,away),t,{glow:1-away,lean:-6*away})}</g>`;
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a0c20" opacity="${(.15+.35*away).toFixed(2)}"/>`;
  s+=sbFlash(220+.6*170,1060-.6*430,1,300,.8)+A({...MATEO,x:220,y:1060,s:.6,look:[12,-10],brows:'up',eyes:'wide',mouth:'o',reachR:[170,-430]});
  const b=t>E.bark-.2&&(Math.sin(t*14)>-.2);
  s+=canelo(470,1064,.5,t,{dir:1,alert:1,bark:b,head:16,hackles:true});
  let o=cam(s,lerp(1.1,1.0,prog(t,0,D)),540,680,540,600,t>E.bark?shake(t,.6,5):0);
  if(t>E.bark) o+=bang(700,420,'¡GUAU! ¡GUAU!',YEL,P(t,E.bark,.12),76);
  return o;};

S.rule3=(t,D,B)=>{const E=EVS.rule3(B), run=t*10;
  let s=llanos(t,{pan:380+t*60,farHouse:true});
  s+=canelo(lerp(300,620,prog(t,0,D)),1012,.42,t,{run:t*12,dir:1,alert:.7});
  s+=A({...MATEO,x:lerp(160,480,prog(t,0,D)),y:1010,s:.62,walk:run,stride:1.4,lean:10,dirW:1,look:[12,-2],brows:'worried',mouth:'o',reachR:[170,-430]});
  let o=cam(s,1.05,540,700,540,600,shake(t,.4,2));
  o+=iconCard(330,440,prog(t,E.dogs-.2,E.dogs+.15),`<g transform="translate(0,-10) scale(.34)">${canelo(0,120,1,t,{dir:1,bark:true,alert:1})}</g>`,'PERROS',GREEN);
  o+=iconCard(750,440,prog(t,E.whip-.2,E.whip+.15),`<path d="M-50,40 q10,-50 40,-60 q40,-14 50,-60" stroke="#2a1a10" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-50,40 q10,-50 40,-60 q40,-14 50,-60" stroke="#8a5a30" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="-62" y="30" width="22" height="50" rx="8" fill="#6a4628" stroke="#2a1a10" stroke-width="3" transform="rotate(-30 -50 50)"/>`,'LÁTIGO',PINK);
  return o;};

S.home=(t,D,B)=>{const E=EVS.home(B), lock=t>E.key-.3, k=eIO(prog(t,E.wall-.3,E.whip+.4));
  let bg=interior(t,{lit:.6,glint:t>E.whip?1:0});
  // the door (right) with a wooden bar that slides shut
  bg+=`<rect x="760" y="560" width="280" height="450" fill="#5a3a22"/>`+[0,1,2,3].map(i=>`<rect x="${766+i*68}" y="566" width="62" height="438" fill="#6a4628" stroke="#3a2414" stroke-width="3"/>`).join('');
  const bx=lerp(1040,880,eOut(prog(t,E.lock,E.key)));
  bg+=`<rect x="${bx}" y="760" width="170" height="20" rx="6" fill="#3a2414"/><rect x="1020" y="750" width="22" height="40" fill="#2a2a2e"/>`;
  bg+=candleSV(150,820,.9,t,1);
  bg+=dark(.72,[[150,760,380,380],[560,420,320,280],[760,760,300,360]]);
  let fg=canelo(560,1012,.42,t,{dir:1,alert:.5,head:4});
  fg+=A({...MATEO,x:760,y:1010,s:.64,look:k>.3?[-14,-8]:[12,-2],brows:'worried',mouth:'line',reachR:lock&&!k?[150,-430]:null});
  let o=focusCam(bg,fg,k,500,420,{z0:1.04,z1:2.1});
  if(t>E.lock&&t<E.wall) o+=bang(860,420,'¡CLAC!',YEL,P(t,E.key,.12),70);
  if(t>E.whip) o+=tag(540,880,'EL LÁTIGO DEL ABUELO',YEL,P(t,E.whip,.2));
  return o;};

S.wake=(t,D,B)=>{const E=EVS.wake(B), op=t>E.wake-.15, kc=eIO(prog(t,E.three-.4,E.three+.4))*(1-eIO(prog(t,E.wake-.4,E.wake)));
  let bg=interior(t,{lit:0,clockH:3,clockM:0})+`<rect x="-600" y="-900" width="2280" height="2400" fill="#060818" opacity=".72"/>`;
  bg+=`<path d="M300,120 L520,120 L700,1010 L80,1010Z" fill="#9ab0ff" opacity=".08"/>`;
  // hammock (chinchorro) with Mateo, big in frame
  let fg=`<path d="M-80,560 Q540,1010 1160,560" stroke="#c9a070" stroke-width="12" fill="none"/>`;
  fg+=lying({...MATEO,x:600,y:860,s:.62,eyes:op?'wide':'closed',mouth:op?'o':'line',brows:op?'up':null},.62);
  fg+=`<path d="M-80,560 Q540,1040 1160,560 L1160,610 Q540,1100 -80,610Z" fill="#c25a3a"/>`+[...Array(11)].map((_,i)=>{const x=-20+i*110,y=600+Math.sin((i/10)*Math.PI)*400;return `<path d="M${x},${y} l0,50" stroke="#e8c070" stroke-width="6"/>`}).join('')+`<path d="M-80,585 Q540,1070 1160,585" stroke="#e8c070" stroke-width="5" fill="none" opacity=".7"/>`;
  if(op) fg+=sweat(600,860,.62,t);
  let o=kc>0.01?focusCam(bg,fg,kc,980,250,{z0:1.04,z1:2.6}):focusCam(bg,fg,eIO(prog(t,E.wake-.1,D))*.8,420,800,{z0:1.04,z1:2});
  if(t>E.three-.2&&t<E.wake) o+=countPop('3:00',540,820,140,t-E.three,PINK);
  return o;};
const dogLieC=(x,y,s,t)=>{const keep={...DOB};DOB.body='#a8642c';DOB.tan='#e8b47a';DOB.ear='#7a4418';const g=`<g transform="translate(${x},${y}) scale(1,.55) translate(${-x},${-y})">${doberman(x,y,s,t,{dir:-1,alert:.3,head:-20})}</g>`;Object.assign(DOB,keep);return g};

S.count=(t,D,B)=>{const E=EVS.count(B);
  if(t<E.l2-.1){ // the bottom of the door from inside: moonlight in the gap, a shadow, bones being counted
    let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a0812"/><rect x="100" y="-200" width="880" height="960" fill="#3a2414"/>`+[0,1,2,3].map(i=>`<rect x="${110+i*218}" y="-200" width="212" height="954" fill="#4a3020" stroke="#22140a" stroke-width="4"/>`).join('');
    s+=`<rect x="760" y="360" width="190" height="24" rx="8" fill="#22140a"/><rect x="930" y="350" width="26" height="44" fill="#2a2a2e"/>`;
    s+=`<rect x="-600" y="776" width="2280" height="800" fill="#2a1a14"/>`;for(let x=-600;x<1700;x+=110) s+=`<line x1="${x}" y1="776" x2="${(x-540)*1.8+540}" y2="1500" stroke="#1a0e0a" stroke-width="3"/>`;
    // the bright gap under the door, moonlight spilling in
    s+=`<rect x="100" y="756" width="880" height="20" fill="#dfe6ff"/><path d="M100,776 L980,776 L1200,1100 L-120,1100Z" fill="#cfd8ff" opacity=".16"/>`;
    const n=t<E.n1?0:t<E.n2?1:t<E.n3?2:3;
    for(let i=0;i<n;i++) s+=`<path d="M${330+i*110},766 l60,0" stroke="#0a0812" stroke-width="12" stroke-linecap="round"/><circle cx="${328+i*110}" cy="766" r="8" fill="#0a0812"/><circle cx="${392+i*110}" cy="766" r="8" fill="#0a0812"/>`;
    for(let i=0;i<4;i++){const fx=700+i*30+Math.sin(t*3+i)*24;s+=`<rect x="${fx}" y="756" width="12" height="20" fill="#0a0812"/>`;}
    s+=`<rect x="${780+Math.sin(t*1.5)*20}" y="756" width="170" height="20" fill="#0a0812"/>`;
    // details by the door: rubber boots, a straw mat, a broom
    s+=`<rect x="150" y="840" width="300" height="70" rx="8" fill="#9a7a4a" opacity=".85"/>`+[0,1,2,3,4,5].map(i=>`<line x1="${160+i*50}" y1="842" x2="${170+i*50}" y2="908" stroke="#7a5a30" stroke-width="3"/>`).join('');
    s+=`<path d="M40,640 L60,900 L110,900 L100,640Z" fill="#1d1d22"/><path d="M10,880 L110,880 L110,910 L10,910Z" fill="#1d1d22"/>`;
    s+=`<path d="M1010,300 L960,860" stroke="#8a6a3a" stroke-width="10"/><path d="M930,840 L1000,840 L1010,930 L920,930Z" fill="#b89a50"/>`;
    s+=dark(.45,[[540,800,620,220]]);
    let o=cam(s,lerp(1.15,1.4,prog(t,0,E.l2)),540,760,540,620);
    if(t>E.n1) o+=countPop(n===1?'1':n===2?'2':'3',540,420,180,t-(n===1?E.n1:n===2?E.n2:E.n3),PINK);
    return o;}
  // Mateo hears it
  let bg=interior(t,{lit:0})+`<rect x="-600" y="-900" width="2280" height="2400" fill="#060818" opacity=".75"/>`;
  let fg=lying({...MATEO,x:540,y:880,s:.5,eyes:'wide',mouth:'o',brows:'up'},.5)+`<path d="M60,700 Q420,1000 820,700 L820,730 Q420,1040 60,730Z" fill="#c25a3a" opacity=".9"/>`+sweat(540,880,.5,t);
  return focusCam(bg,fg,eIO(prog(t,E.l2-.1,E.l2+.5)),360,850,{z0:1.3,z1:2.6});};

S.grandma=(t,D,B)=>{const E=EVS.grandma(B);
  let bg=interior(t,{lit:0})+`<rect x="-600" y="-900" width="2280" height="2400" fill="#060818" opacity=".6"/><path d="M200,120 L420,120 L640,1010 L0,1010Z" fill="#9ab0ff" opacity=".1"/>`;
  // grandma's bed with a mosquito net, rosary
  let fg=`<rect x="160" y="820" width="760" height="190" fill="#5a3a22"/><rect x="160" y="780" width="760" height="60" rx="20" fill="#e8e0d0"/><rect x="140" y="640" width="40" height="370" fill="#4a3020"/><rect x="900" y="700" width="40" height="310" fill="#4a3020"/>`;
  fg+=lying({...ABUELA,x:700,y:800,s:.5,eyes:'closed',mouth:'smile'},.5)+`<path d="M300,800 Q600,740 900,800 L900,840 L300,840Z" fill="#8a6a9a"/>`;
  fg+=`<path d="M150,300 Q540,260 930,300 L960,1010 L120,1010Z" fill="#f3f3ff" opacity=".12"/>`+[0,1,2,3,4].map(i=>`<path d="M${170+i*190},300 q10,350 -10,710" stroke="#fff" stroke-width="2" opacity=".18"/>`).join('');
  fg+=`<path d="M560,830 q20,30 50,20" stroke="#c9a050" stroke-width="3" fill="none"/>`;
  const k=eIO(prog(t,E.bed,E.no+.4));
  let o=focusCam(bg,fg,k,520,760,{z0:1.04,z1:2.2});
  if(t>E.no-.1&&t<E.l2) o+=tag(540,880,'NO LO OYE',PINK,P(t,E.no,.2));
  if(t>E.two) o+=countPop('2 HORAS',540,440,120,t-E.two,YEL);
  return o;};

S.whip=(t,D,B)=>{const E=EVS.whip(B), k=eIO(prog(t,0,D*.8));
  let bg=interior(t,{lit:0,glint:.6+.4*Math.sin(t*3)})+`<rect x="-600" y="-900" width="2280" height="2400" fill="#060818" opacity=".55"/><path d="M380,120 L640,120 L700,600 L320,600Z" fill="#cfd8ff" opacity=".12"/>`;
  let o=cam(bg,lerp(1.6,2.5,k),540,lerp(440,420,k),540,560);
  if(t>E.save) o+=`<rect x="0" y="0" width="1080" height="1100" fill="#ff3e6c" opacity="${(.08*Math.abs(Math.sin(t*4))).toFixed(2)}"/>`;
  return o;};

window.CFG={steps:['1. SI SUENA CERCA, ESTÁ LEJOS','2. SI TU PERRO GRUÑE, NO TE MUEVAS','3. LE ASUSTAN LOS PERROS Y EL LÁTIGO'],listEnd:'home',
  hud:(h,bt,st,T)=>{const left=Math.max(0,7200-Math.floor((T-90)*37));return `AMANECER · ${Math.floor(left/3600)}:${String(Math.floor(left%3600/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`},
  band:{door0:'#1a1210',road:'#121628',warn:'#3a3024',whistle:'#0e1222',rule1:'#0e1222',far:'#0a0c18',growl:'#0a0c18',reveal:'#080a14',bark:'#0a0c18',rule3:'#0e1222',home:'#3a2a1c',wake:'#0a0a14',count:'#0a0812',grandma:'#0a0a14',whip:'#0a0a14'}};

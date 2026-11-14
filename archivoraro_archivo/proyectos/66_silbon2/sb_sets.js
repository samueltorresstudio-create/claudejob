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

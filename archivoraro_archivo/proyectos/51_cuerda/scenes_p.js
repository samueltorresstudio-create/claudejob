// ================= LA CUERDA (Joe Simpson y Simon Yates, Siula Grande, Perú, 1985) =================
// Style: painterly textures (PNG), objects in close-up, small round characters, data pills, scale comparisons.
const EVS={
  hook:B=>({rope:B[0].w[2],friend:B[0].w[8],drag:B[0].w[10],q:B[0].w[13]}),
  mountain:B=>({joe:B[0].w[2],simon:B[0].w[4],mount:B[0].w[8],six:B[0].w[10]}),
  fall:B=>({slip:B[0].w[1],brk:B[0].w[4]}),
  lower:B=>({low:B[0].w[2],stages:B[0].w[5],storm:B[0].w[9]}),
  edge:B=>({edge:B[0].w[7],hang:B[0].w[11],voidw:B[0].w[14]}),
  stuck:B=>({up:B[0].w[3],down:B[0].w[7],l2:B[1].s,snow:B[1].w[2],give:B[1].w[9]}),
  hour:B=>({hour:B[0].w[3]}),
  cut:B=>({knife:B[0].w[4],cut:B[0].w[6]}),
  crevasse:B=>({fall:B[0].w[1],crev:B[0].w[5]}),
  alone:B=>({dead:B[0].w[4],back:B[0].w[6]}),
  alive:B=>({alive:B[0].w[3]}),
  light:B=>({deep:B[0].w[3],exit:B[0].w[7],light:B[0].w[10]}),
  distance:B=>({km:B[0].w[2],food:B[0].w[5],leg:B[0].w[8]}),
  crawl:B=>({}),
  watch:B=>({watch:B[0].w[2],goal:B[0].w[7],rock:B[0].w[11],twenty:B[0].w[13],other:B[0].w[17]}),
  days:B=>({}),
  fire:B=>({burn:B[0].w[6],clothes:B[0].w[8],dawn:B[0].w[10]}),
  shout:B=>({dark:B[0].w[4],hear:B[0].w[5],shout:B[0].w[8]}),
  joe:B=>({joe:B[0].w[1]}),
  friends:B=>({blame:B[0].w[2],same:B[0].w[9]}),
  you:B=>({}),
};
const S={};
const JOE={skin:'#e8b48c',hs:'messy',hair:'#3a2418',stubble:true,top:'#d8452f',topD:'#a8301f',pants:'#2a3040',shoes:'#5a3a24',seed:301};
const SIMON={skin:'#f1c6a4',hs:'short',hair:'#d9b050',hat:'beanie',hatCol:'#f0c419',top:'#2f6ab8',topD:'#1f4a8a',pants:'#3a3a44',shoes:'#5a3a24',seed:302};
const RICH={skin:'#e0a77e',hs:'buzz',hair:'#2a2020',beard:'#3a2a20',top:'#3a7a4a',topD:'#2a5a3a',pants:'#3a3a44',shoes:'#5a3a24',seed:303};
const faceY=(y,s)=>y-s*640, waist=(x,y,s)=>[x,y-s*330];
const ROPE='#e0662a', ROPE2='#ffb04a', GLOVE='#2a3448';

// ---------- texture + style helpers ----------
const tex=(n,op=1,x=-600,y=-900,w=2280,h=2400)=>`<image href="tex_${n}.png" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" opacity="${op}"/>`;
const texPoly=(pts,n,o={})=>{const id=uid('tp');return `<clipPath id="${id}"><path d="${pts}"/></clipPath><g clip-path="url(#${id})">${tex(n,1,o.x??-600,o.y??-900,o.w??2280,o.h??2400)}${o.tint?`<rect x="-600" y="-900" width="2280" height="2400" fill="${o.tint}" opacity="${o.tintOp??.3}"/>`:''}</g>${o.edge?`<path d="${pts}" fill="none" stroke="${o.edge}" stroke-width="${o.ew||6}" stroke-linejoin="round"/>`:''}`};
const wind=(t,n=60,op=.7,ang=.35,sp=1600)=>{const r=rng(17);let s='';for(let i=0;i<n;i++){const x0=r()*1700-300, y0=r()*1500-200, v=sp*(.6+r()*.7), L=30+r()*50, p=((t*v/1500)+r())%1, y=y0+p*1500-700, x=x0+p*1500*ang-300;
  s+=`<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x+L*ang).toFixed(0)}" y2="${(y+L).toFixed(0)}" stroke="#fff" stroke-width="${(2+r()*3).toFixed(1)}" opacity="${(op*(.4+.6*r())).toFixed(2)}" stroke-linecap="round"/>`;}return s};
const dpill=(x,y,big,small,a,col='#ffd34a')=>{if(a<=0) return '';const w=big.length*44+(small?small.length*20:0)+70;
  return `<g transform="translate(${x},${y}) scale(${(.6+.4*eBack(clamp(a))).toFixed(3)})" opacity="${clamp(a*2).toFixed(2)}"><rect x="${-w/2+6}" y="-48" width="${w}" height="104" rx="22" fill="#000" opacity=".35"/><rect x="${-w/2}" y="-54" width="${w}" height="104" rx="22" fill="#14121c" fill-opacity=".9" stroke="#ffffff" stroke-opacity=".12" stroke-width="3"/><text x="0" y="22" text-anchor="middle" font-family="Inter" font-weight="900"><tspan font-size="74" fill="${col}">${big}</tspan>${small?`<tspan font-size="34" fill="${col}" dx="10">${small}</tspan>`:''}</text></g>`};
const rope=(pts,o={})=>{const d='M'+pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' L');const w=o.w||9;
  return `<path d="${d}" stroke="#5a2a10" stroke-width="${w+5}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${o.col||ROPE}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${ROPE2}" stroke-width="${w*.35}" fill="none" stroke-dasharray="${w*1.2},${w*1.4}" stroke-linecap="round"/>`};
const curve=(x1,y1,x2,y2,sag,n=14)=>Array.from({length:n+1},(_,i)=>{const k=i/n;return [lerp(x1,x2,k),lerp(y1,y2,k)+Math.sin(k*Math.PI)*sag]});
const knifeK=(x,y,s,open,rot=0)=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><g transform="rotate(${(-170*(1-open)).toFixed(1)} 70 0)"><path d="M70,-12 L230,-6 Q250,0 230,8 L70,10Z" fill="#d9dfe6" stroke="#8a939d" stroke-width="3"/><path d="M80,-6 L224,-2" stroke="#fff" stroke-width="3" opacity=".7"/></g><rect x="-90" y="-26" width="170" height="52" rx="22" fill="#c8202a"/><rect x="-90" y="-26" width="170" height="16" rx="8" fill="#e8484f" opacity=".6"/><g transform="translate(-10,0)"><rect x="-12" y="-4" width="24" height="8" fill="#fff"/><rect x="-4" y="-12" width="8" height="24" fill="#fff"/></g><circle cx="66" cy="0" r="7" fill="#9aa3ad"/></g>`;
const glove=(x,y,rot,s,col=GLOVE)=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="40" y="-46" width="380" height="92" rx="40" fill="${SIMON.top}"/><rect x="40" y="-46" width="380" height="20" rx="10" fill="#fff" opacity=".15"/><rect x="20" y="-56" width="70" height="112" rx="22" fill="#1d1f2a"/><ellipse cx="-40" cy="0" rx="86" ry="70" fill="${col}"/><ellipse cx="-30" cy="-58" rx="40" ry="26" fill="${col}" transform="rotate(-25 -30 -58)"/><path d="M-110,-10 q30,-30 70,-16" stroke="#fff" stroke-width="6" opacity=".18" fill="none" stroke-linecap="round"/><path d="M-60,30 q30,10 60,-6" stroke="#000" stroke-width="5" opacity=".25" fill="none"/></g>`;
const handIn=(x,y,rot,s,skin='#e2b08a',sleeve='#3a5a7a')=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="0" y="-36" width="420" height="72" rx="30" fill="${sleeve}"/><ellipse cx="-30" cy="0" rx="58" ry="44" fill="${skin}" stroke="${mix(skin,'#000000',.3)}" stroke-width="4"/><path d="M-70,-24 q-30,4 -36,22 M-74,4 q-30,6 -34,22 M-66,26 q-22,8 -24,22" stroke="${skin}" stroke-width="22" stroke-linecap="round" fill="none"/></g>`;
const eiffel=(x,y,h,a=1,col='#ffd36a')=>{const w=h*.62;return `<g transform="translate(${x},${y})" opacity="${a}"><path d="M${-w/2},0 Q${-w*.18},${-h*.35} ${-w*.06},${-h*.82} L0,${-h} L${w*.06},${-h*.82} Q${w*.18},${-h*.35} ${w/2},0 L${w*.26},0 Q0,${-h*.24} ${-w*.26},0Z" fill="none" stroke="${col}" stroke-width="${Math.max(3,h*.06)}"/><line x1="${-w*.3}" y1="${-h*.28}" x2="${w*.3}" y2="${-h*.28}" stroke="${col}" stroke-width="${Math.max(2,h*.03)}"/><line x1="${-w*.14}" y1="${-h*.58}" x2="${w*.14}" y2="${-h*.58}" stroke="${col}" stroke-width="${Math.max(2,h*.025)}"/></g>`};
const xMark=(x,y,s,a)=>a<=0?'':`<g transform="translate(${x},${y}) scale(${(s*(.5+.5*eBack(clamp(a)))).toFixed(3)})" opacity="${clamp(a*2).toFixed(2)}"><circle r="70" fill="#14121c" fill-opacity=".85" stroke="#ff3e6c" stroke-width="12"/><path d="M-32,-32 L32,32 M32,-32 L-32,32" stroke="#ff3e6c" stroke-width="14" stroke-linecap="round"/></g>`;
const tent=(x,y,s,lit=0)=>`<g transform="translate(${x},${y}) scale(${s})">${lit?`<circle cx="0" cy="-60" r="200" fill="url(#glowY)" opacity="${lit}"/>`:''}<path d="M-120,0 L0,-150 L120,0Z" fill="#e0b04a"/><path d="M0,-150 L120,0 L40,0Z" fill="#b8862a"/><path d="M-30,0 L0,-90 L30,0Z" fill="${lit?'#ffd88a':'#3a2a1a'}"/><line x1="0" y1="-150" x2="0" y2="-176" stroke="#5a4a3a" stroke-width="6"/></g>`;
const fireK=(x,y,s,t)=>{const f=1+.12*Math.sin(t*15)+.08*Math.sin(t*23);return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="0" cy="-60" r="260" fill="url(#glowY)" opacity=".9"/><path d="M-70,0 L70,-14 M-70,-14 L70,0" stroke="#5a3a24" stroke-width="18" stroke-linecap="round"/><path d="M-60,-6 Q-70,${(-90*f).toFixed(0)} -10,${(-170*f).toFixed(0)} Q0,-100 20,${(-150*f).toFixed(0)} Q60,${(-80*f).toFixed(0)} 60,-6Z" fill="#ff7a2a"/><path d="M-34,-6 Q-30,${(-70*f).toFixed(0)} 0,${(-110*f).toFixed(0)} Q30,-60 34,-6Z" fill="#ffd34a"/></g>`};
const watchK=(x,y,s,txt,a=1)=>`<g transform="translate(${x},${y}) scale(${s})" opacity="${a}"><rect x="-60" y="-230" width="120" height="460" rx="20" fill="#2a2a30"/><rect x="-130" y="-110" width="260" height="220" rx="40" fill="#3a3a42" stroke="#9aa3ad" stroke-width="8"/><rect x="-100" y="-70" width="200" height="120" rx="10" fill="#b8c8a0"/><text x="0" y="22" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="76" fill="#1d2a1a">${txt}</text><text x="0" y="-80" text-anchor="middle" font-family="Inter" font-weight="900" font-size="20" fill="#d9dfe6">DIGITAL</text></g>`;
const boulder=(x,y,s,col='#7a6a5e')=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M-80,0 Q-90,-60 -40,-84 Q10,-104 60,-70 Q96,-40 84,0Z" fill="${col}"/><path d="M-40,-84 Q10,-104 60,-70 Q20,-60 -30,-62Z" fill="#fff" opacity=".18"/><path d="M20,-20 Q60,-30 84,0 L20,0Z" fill="#000" opacity=".2"/></g>`;
const breath=(x,y,t,op=.6)=>{const p=(t*.7)%1;return `<ellipse cx="${(x+p*50).toFixed(0)}" cy="${(y-p*30).toFixed(0)}" rx="${(10+p*30).toFixed(0)}" ry="${(8+p*18).toFixed(0)}" fill="#fff" opacity="${(op*(1-p)).toFixed(2)}"/>`};
const vignette=(op=.5)=>`<radialGradient id="vgn"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient><rect x="-600" y="-900" width="2280" height="2400" fill="url(#vgn)"/>`;

// ---------- sets ----------
const abyssBg=(t)=>tex('storm')+`<linearGradient id="aby" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#03040c" stop-opacity=".95"/></linearGradient><rect x="-600" y="300" width="2280" height="1200" fill="url(#aby)"/>`;
const ledge=(t)=>texPoly('M-600,520 L80,560 L420,640 L700,760 L760,820 L740,1500 L-600,1500Z','snow',{edge:'#ffffff',ew:5})+`<path d="M700,760 L760,820 L740,1500 L690,1500 L700,900Z" fill="#1d2a40" opacity=".55"/>`;
// Simon braced in his snow seat, big in frame, the rope running over the edge (o.slide px, o.knife 0..1, o.cut 0..1, o.face)
const SX=300, SY=900, SS=.8;
const simonBg=(t,o={})=>{let s=abyssBg(t)+wind(t,40,.4);
  s+=texPoly('M-600,860 L180,880 L560,866 L790,836 L812,1500 L-600,1500Z','snow',{edge:'#ffffff',ew:6});
  s+=`<path d="M790,836 L812,1500 L760,1500 L770,900Z" fill="#1d2a40" opacity=".6"/>`;
  s+=`<path d="M120,900 Q300,820 480,900 L480,930 L120,930Z" fill="#c9d6e8"/><path d="M120,900 Q300,820 480,900" stroke="#fff" stroke-width="5" fill="none"/>`;
  if(o.crack){for(let i=0;i<5;i++){const L=clamp(o.crack*1.4-i*.15)*110;if(L>0) s+=`<path d="M${180+i*60},905 l${(i%2?14:-10)},${(L*.4).toFixed(0)} l${(i%2?-8:12)},${(L*.6).toFixed(0)}" stroke="#4a5a7a" stroke-width="5" fill="none"/>`;}}
  return s};
const simonFg=(t,o={})=>{const sl=o.slide||0, x=SX+sl, kn=o.knife||0, cu=o.cut||0, jig=Math.sin(t*23)*3+(o.jerk||0);
  const hL=[x+230*SS,SY-250*SS], hR0=[x+260*SS,SY-232*SS];
  let rR=kn>0?(cu>0?[lerp(120,270,eOut(clamp(cu*3))),lerp(-480,-250,eOut(clamp(cu*3)))]:[120,-480]):[260,-232];
  const hR=[x+rR[0]*SS,SY+rR[1]*SS];
  let s='';
  if(cu<.34) s+=rope([[hL[0]-60,hL[1]+60],[hL[0],hL[1]],[hR0[0],hR0[1]],[650,780+jig],[790,836],[805,1400]],{w:13});
  else {const p=prog(cu,.34,1);s+=rope([[hL[0]-60,hL[1]+60],[hL[0],hL[1]],[hL[0]+60+p*40,hL[1]+20+p*80]],{w:13})+rope([[lerp(650,800,p),lerp(780,1000,p)],[790,836+p*200],[805,1400+p*400]],{w:13});}
  s+=A({...SIMON,x,y:SY,s:SS,sit:true,look:o.look||[12,6],brows:o.brows||'worried',eyes:o.eyes||'open',mouth:o.mouth||'line',reachL:[230,-250],reachR:rR});
  s+=texPoly(`M${x-200},${SY+60} L${x-180},${SY-SS*210} Q${x-60},${SY-SS*300} ${x+60},${SY-SS*270} Q${x+170},${SY-SS*240} ${x+200},${SY-SS*170} L${x+230},${SY+60}Z`,'snow',{edge:'#ffffff',ew:6})+`<path d="M${x-170},${SY-SS*200} Q${x},${SY-SS*290} ${x+190},${SY-SS*180}" stroke="#9fb4d0" stroke-width="5" fill="none" opacity=".6"/>`;   // he is dug into the snow seat
  if(kn>0) s+=knifeK(hR[0]+10,hR[1]-10,.55,clamp(kn*1.6-.4),cu>0?lerp(-70,10,clamp(cu*3)):-70);
  if(o.sweat) s+=sweat(x,SY,SS,t);
  s+=breath(x+70,SY-SS*600,t,.5);
  return s};

// ================= scenes =================
S.hook=(t,D,B)=>{const E=EVS.hook(B), dr=t>E.drag, jerk=dr&&t<E.drag+.5?Math.sin((t-E.drag)*40)*14*(1-prog(t,E.drag,E.drag+.5)):0;
  const sl=40*eOut(prog(t,E.drag,E.drag+.4)), kn=prog(t,E.q-.5,E.q+.4), k=eIO(prog(t,E.q-.3,E.q+.7));
  const bg=simonBg(t), fg=simonFg(t,{slide:sl,jerk,knife:kn,eyes:dr?'wide':'open',mouth:dr?'o':'line',sweat:dr,look:kn>0?[0,-4]:[12,8]})+wind(t,40,.8,.4,2200);
  let o=focusCam(bg,fg+vignette(.5),k,SX+sl+60,SY-SS*560,{z0:1.08,z1:1.75});
  o=`<g transform="translate(${shake(t,dr?1-prog(t,E.drag,E.drag+.6):.2,dr?10:3)},0)">${o}</g>`;
  if(dr&&t<E.q-.3) o+=bang(800,330,'¡TIRA!',PINK,P(t,E.drag,.12),84);
  if(t>E.q) o+=bigText('?',880,420,220,'#ffd34a',P(t,E.q+.2,.2));
  return o;};

S.mountain=(t,D,B)=>{const E=EVS.mountain(B);
  // Siula Grande: west face, climbers on the ridge; then the scale comparison with Eiffel towers
  let s=tex('dawn',1)+`<rect x="-600" y="-900" width="2280" height="2400" fill="#6cc0ee" opacity=".35"/>`+puffs(t,160,'#fff',.6,6,5);
  s+=texPoly('M-600,1100 L-300,620 L-100,700 L120,380 L300,160 L420,60 L520,180 L700,300 L900,560 L1100,620 L1680,1100Z','snow',{edge:'#ffffff',ew:4});
  s+=texPoly('M300,160 L420,60 L360,300 L250,520 L120,380Z M520,180 L700,300 L620,420 L560,330Z','strata',{tint:'#1a1a2a',tintOp:.45});
  s+=`<path d="M420,60 L400,200 L330,330 L250,500 M420,60 L470,240 L560,420 L650,640" stroke="#9fb0c8" stroke-width="5" fill="none" opacity=".6"/>`;
  s+=`<rect x="-600" y="1000" width="2280" height="500" fill="#e9f0f8"/>`;
  // climbers on the ridge (roped)
  const cx=lerp(420,470,prog(t,0,D)), cy=lerp(70,240,prog(t,0,D));
  const j=[cx+30,cy+60], si=[cx-20,cy+10];
  s+=rope(curve(si[0],si[1]-34*.1,j[0],j[1]-30*.1,8,8),{w:2.5});
  s+=A({...SIMON,x:si[0],y:si[1],s:.1,walk:t*5,dirW:1,look:[6,4]})+A({...JOE,x:j[0],y:j[1],s:.1,walk:t*5,dirW:1,look:[6,4]});
  // zoom in on the pair at the names, then pull out for the size
  const kin=eIO(prog(t,E.joe-.4,E.joe+.4))*(1-eIO(prog(t,E.mount-.3,E.mount+.4)));
  s+=wind(t,20,.3,.6,1000);
  let o=cam(s,lerp(1.02,4.2,kin),lerp(520,cx+5,kin),lerp(600,cy-20,kin),540,560);
  if(kin>.6){o+=tag(300,420,'SIMON',BLUE,P(t,E.simon,.2))+tag(800,520,'JOE',PINK,P(t,E.joe,.2));}
  if(t>E.mount){const k=prog(t,E.mount,E.six+.4);for(let i=0;i<19;i++) o+=eiffel(850,1080-i*49,50,clamp(k*19-i));
    o+=dpill(330,860,'6.344','m',P(t,E.six,.3));if(t>E.six+.3) o+=tag(820,170,'= 19 TORRES EIFFEL',YEL,P(t,E.six+.3,.2));}
  if(t<E.joe-.4) o+=dpill(540,880,'PERÚ','1985',P(t,0,.4));
  return o;};

S.fall=(t,D,B)=>{const E=EVS.fall(B), sl=eIn(prog(t,E.slip-.3,E.brk-.1)), down=t>E.brk-.1, xr=prog(t,E.brk,E.brk+.4);
  let s=tex('storm')+wind(t,30,.35);
  s+=texPoly('M-600,300 L1680,1000 L1680,1500 L-600,1500Z','snow',{edge:'#ffffff',ew:5});
  for(let i=0;i<5;i++) s+=boulder(-200+i*300,460+i*190,.8,'#4a4a58');
  const jx=lerp(200,700,sl), jy=lerp(420,760,sl)+35;
  if(!down) s+=A({...JOE,x:jx,y:jy,s:.5,rot:-30-sl*80,look:[6,-6],eyes:'wide',mouth:'o',brows:'up',reachL:[-160,-560],reachR:[200,-540]});
  else s+=lying({...JOE,x:700,y:830,s:.5,eyes:'closed',mouth:'o',brows:'worried'},.5);
  if(sl>0&&!down) for(let i=0;i<6;i++){const p=(t*3+i/6)%1;s+=`<circle cx="${(jx-40-p*120).toFixed(0)}" cy="${(jy-10-p*60).toFixed(0)}" r="${(8+p*14).toFixed(0)}" fill="#fff" opacity="${(.8*(1-p)).toFixed(2)}"/>`;}
  s+=vignette(.5);
  let o=cam(s,lerp(1.15,1.3,prog(t,0,D)),lerp(400,680,sl),650,540,580,down?shake(t,1-prog(t,E.brk-.1,E.brk+.4),12):0);
  if(down){ // x-ray of the leg
    const R=190*eBack(clamp(xr*1.4)),cx=540,cy=430,id=uid('xr'),pulse=.5+.5*Math.sin(t*12);
    o+=`<circle cx="${cx}" cy="${cy}" r="${(R+12).toFixed(0)}" fill="#ff3e6c" opacity="${(.35+.3*pulse).toFixed(2)}"/><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R.toFixed(0)}"/></clipPath><g clip-path="url(#${id})"><rect x="${cx-220}" y="${cy-220}" width="440" height="440" fill="#0e1830"/>`;
    o+=`<path d="M${cx-30},${cy-220} L${cx-24},${cy-20} M${cx+18},${cy-220} L${cx+22},${cy-30}" stroke="#d9ecff" stroke-width="34" stroke-linecap="round"/><circle cx="${cx-6}" cy="${cy-10}" r="40" fill="#d9ecff"/><path d="M${cx-20},${cy+30} L${cx-30},${cy+220} M${cx+20},${cy+30} L${cx+30},${cy+220}" stroke="#d9ecff" stroke-width="30" stroke-linecap="round"/>`;
    o+=`<path d="M${cx-60},${cy+80} L${cx-20},${cy+60} L${cx-34},${cy+96} L${cx+10},${cy+86} L${cx-4},${cy+120} L${cx+50},${cy+104}" stroke="#ff3e6c" stroke-width="9" fill="none" stroke-linejoin="round"/></g>`;
    o+=bang(800,300,'¡CRAC!',PINK,P(t,E.brk,.12),96);}
  return o;};

S.lower=(t,D,B)=>{const E=EVS.lower(B), st=prog(t,E.storm-.6,E.storm+.4);
  let s=tex('storm')+`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a0c20" opacity="${(.25+.3*st).toFixed(2)}"/>`;
  s+=texPoly('M-600,450 L240,450 L1680,1300 L-600,1500Z','snow',{edge:'#ffffff',ew:5,tint:'#2a3060',tintOp:.25});
  s+=`<path d="M140,450 Q240,420 320,450 L320,480 L140,480Z" fill="#c9d6e8"/>`;      // snow seat
  const stage=t<E.stages?prog(t,E.low-.3,E.stages)*.5:.5+Math.min(1.5,(t-E.stages)*.9)*.33;
  const k=stage%1, step=Math.floor(stage), q=clamp(step*.33+eOut(clamp(k*1.6))*.33);
  const jx=lerp(480,920,q), jy=lerp(640,920,q);
  const [hx,hy]=waist(240,450,.5);
  s+=A({...SIMON,x:240,y:450,s:.5,sit:true,look:[10,8],brows:'worried',mouth:'line',reachR:[180,-260],reachL:[150,-200]});
  s+=rope(curve(hx+40,hy+30,jx-20,jy-30,10),{w:7});
  s+=A({...JOE,x:jx,y:jy+30,s:.5,rot:-58,look:[-6,-8],brows:'worried',mouth:'line',reachL:[-120,-560]});
  s+=wind(t,40+Math.round(60*st),.5+.4*st,.5,2000);
  let o=cam(s,lerp(1.02,1.1,prog(t,0,D)),lerp(520,640,q),640,540,600);
  o+=dpill(800,330,'90','m de cuerda',P(t,E.low,.3));
  if(t>E.stages) o+=tag(330,520,`TRAMO ${Math.min(3,1+Math.floor((t-E.stages)*1.6))}`,YEL,P(t,E.stages,.2));
  return o;};

S.edge=(t,D,B)=>{const E=EVS.edge(B), pan=eIO(prog(t,E.edge-.2,E.hang+.2));
  // tall world: the slope and the edge at the top, Joe hanging in the void below
  let w=tex('storm',1,-600,-1700,2280,3400)+`<rect x="-600" y="-200" width="2280" height="1700" fill="#03040c" opacity=".55"/>`;
  w+=texPoly('M-600,-480 L120,-480 L660,-80 L700,40 L640,60 L580,1500 L-600,1500Z','ice',{edge:'#bfe8ff',ew:5,tint:'#0a1a30',tintOp:.35});
  w+=texPoly('M-600,-480 L120,-480 L660,-80 L700,40 L560,-40 L-600,-300Z','snow',{edge:'#ffffff',ew:5});
  const sw=Math.sin(t*1.3)*6, jx=760+sw, jy=760;
  w+=rope([[-80,-400],[300,-300],[600,-110],[702,36],[jx-4,jy-.48*640]],{w:8});
  w+=A({...JOE,x:jx,y:jy,s:.48,rot:sw*.5,look:[-6,10],brows:'worried',eyes:t>E.hang?'wide':'open',mouth:'o',reachL:[-20,-760],reachR:[20,-740]});
  w+=`<path d="M560,1200 Q760,1150 980,1220 L1100,1500 L460,1500Z" fill="#000"/>`;   // the crevasse below
  w+=wind(t,50,.5,.5,2200);
  const oy=lerp(-200,560,pan), fz=eIO(prog(t,E.hang+.2,E.voidw+.2));
  let o=cam(w,lerp(lerp(1.15,1.0,pan),1.9,fz),lerp(lerp(380,700,pan),jx,fz),lerp(oy,jy-.48*520,fz),540,560);
  if(t>E.voidw) o+=dpill(820,600,'VACÍO','',P(t,E.voidw,.3),'#ff3e6c');
  if(t>E.edge&&pan<.4) o+=tag(780,330,'EL BORDE',YEL,P(t,E.edge,.2));
  return o;};

S.stuck=(t,D,B)=>{const E=EVS.stuck(B);
  if(t<E.l2-.2){ // two stacked panels: Joe can't climb / Simon can't go down
    let top=tex('storm')+`<rect x="-600" y="-900" width="2280" height="2400" fill="#03040c" opacity=".45"/>`+rope([[540,-200],[540+Math.sin(t*1.3)*6,340]],{w:9});
    const climb=Math.sin(t*7);
    top+=A({...JOE,x:540+Math.sin(t*1.3)*6,y:660,s:.5,look:[0,-12],brows:'worried',eyes:'wide',mouth:'o',reachL:[-20,-720+climb*40],reachR:[20,-720-climb*40]});
    top+=`<circle cx="${540-.5*30}" cy="${660-.5*720}" r="18" fill="#9fd8ff" opacity=".7"/><circle cx="${540+.5*30}" cy="${660-.5*720}" r="18" fill="#9fd8ff" opacity=".7"/>`+wind(t,30,.5);
    let bot=tex('storm')+texPoly('M-600,560 L1680,560 L1680,1500 L-600,1500Z','snow',{edge:'#fff'})+`<path d="M300,560 Q400,520 500,560 L500,600 L300,600Z" fill="#c9d6e8"/>`;
    bot+=A({...SIMON,x:400,y:580,s:.55,sit:true,look:[14,10],brows:'worried',mouth:'line',reachR:[260,-250],reachL:[220,-220]})+rope([[580,440],[1300,700]],{w:9})+wind(t,30,.5);
    const id1=uid('pa'),id2=uid('pb');
    let o=`<clipPath id="${id1}"><rect x="30" y="140" width="1020" height="440"/></clipPath><clipPath id="${id2}"><rect x="30" y="600" width="1020" height="460"/></clipPath>`;
    o+=`<rect x="0" y="0" width="1080" height="1100" fill="#0b0c16"/>`;
    o+=`<g clip-path="url(#${id1})"><g transform="translate(0,-110) scale(1)">${top}</g></g><g clip-path="url(#${id2})"><g transform="translate(0,430)">${bot}</g></g>`;
    o+=`<rect x="30" y="140" width="1020" height="440" fill="none" stroke="#fff" stroke-width="6"/><rect x="30" y="600" width="1020" height="460" fill="none" stroke="#fff" stroke-width="6"/>`;
    o+=xMark(900,300,1,prog(t,E.up-.1,E.up+.3))+xMark(900,760,1,prog(t,E.down-.1,E.down+.3));
    o+=`<text x="70" y="200" font-family="${MONO}" font-weight="800" font-size="30" fill="#ffd34a">JOE</text><text x="70" y="660" font-family="${MONO}" font-weight="800" font-size="30" fill="#6cc6ff">SIMON</text>`;
    return o;}
  // the snow seat gives way
  const g=prog(t,E.snow,D+.5), give=t>E.give;
  const bg=simonBg(t,{crack:g}), fg=simonFg(t,{slide:g*55,eyes:give?'wide':'open',mouth:give?'o':'line',sweat:true});
  let snowf='';if(g>0) for(let i=0;i<6;i++){const p=(t*1.5+i/6)%1;snowf+=`<circle cx="${(420+i*30+p*120).toFixed(0)}" cy="${(910+p*160).toFixed(0)}" r="${(6+i%3*3)}" fill="#fff" opacity="${(g*(1-p)).toFixed(2)}"/>`;}
  let o=focusCam(bg,fg+snowf+wind(t,50,.7,.45,2200),eIO(prog(t,E.give-.6,E.give+.4))*.7,SX+60,SY-SS*450,{z0:1.06,z1:1.6,bars:false});
  if(give) o=`<g transform="translate(${shake(t,.5,4)},0)">${o}</g>`;
  // the «snow holding» meter, like a probability bar
  const v=1-g*.95, bc=v>.5?'#45e07e':v>.25?'#ffd34a':'#ff3e6c';
  o+=`<g transform="translate(140,270)"><rect x="-10" y="-60" width="820" height="130" rx="18" fill="#14121c" fill-opacity=".9"/><text x="20" y="-14" font-family="Inter" font-weight="900" font-size="34" fill="#fff">La nieve aguanta</text><rect x="20" y="16" width="760" height="30" rx="15" fill="#2a2a36"/><rect x="20" y="16" width="${(760*v).toFixed(0)}" height="30" rx="15" fill="${bc}"/></g>`;
  return o;};

S.hour=(t,D,B)=>{const E=EVS.hour(B), a=prog(t,0,D+.2)*360;
  let s=tex('storm')+wind(t,70,.6,.5,2400)+vignette(.6);
  s+=`<g transform="translate(540,560)"><circle r="300" fill="#14121c" stroke="#ffd34a" stroke-width="16"/><path d="M0,0 L0,-270 A270,270 0 ${a>180?1:0} 1 ${(270*Math.sin(a*Math.PI/180)).toFixed(1)},${(-270*Math.cos(a*Math.PI/180)).toFixed(1)}Z" fill="#ffd34a" opacity=".3"/>${Array.from({length:12},(_,i)=>`<line x1="0" y1="-280" x2="0" y2="-240" stroke="#fff" stroke-width="8" transform="rotate(${i*30})"/>`).join('')}<line x1="0" y1="0" x2="${(240*Math.sin(a*Math.PI/180)).toFixed(1)}" y2="${(-240*Math.cos(a*Math.PI/180)).toFixed(1)}" stroke="#fff" stroke-width="14" stroke-linecap="round"/><circle r="20" fill="#ffd34a"/></g>`;
  let o=cam(s,lerp(1.0,1.08,prog(t,0,D)),540,560,540,560);
  o+=dpill(540,960,'≈ 1','HORA',P(t,E.hour-.4,.3));
  return o;};

S.cut=(t,D,B)=>{const E=EVS.cut(B), cu=prog(t,E.cut-.25,E.cut+.5), kn=prog(t,E.knife-1,E.knife+.2);
  const kf=eIO(prog(t,E.knife-.8,E.knife))*(1-eIO(prog(t,E.cut-.4,E.cut+.1)));
  const bg=simonBg(t), fg=simonFg(t,{knife:kn,cut:cu,eyes:t>E.knife+.3&&t<E.cut?'closed':'wide',mouth:'line',brows:'worried',sweat:true,look:[0,-2]})+wind(t,40,.8,.4,2200);
  let o=focusCam(bg,fg,Math.max(kf,.35*(1-prog(t,E.cut+.2,D))),SX+60,SY-SS*560,{z0:1.06,z1:2.0});
  if(t>E.cut&&t<E.cut+.12) o+=`<rect x="0" y="0" width="1080" height="1100" fill="#fff" opacity=".8"/>`;
  if(t>E.cut) o=`<g transform="translate(${shake(t,1-prog(t,E.cut,E.cut+.7),14)},0)">${o}</g>`+bang(800,330,'¡ZAS!',PINK,P(t,E.cut,.1),110);
  return o;};

S.crevasse=(t,D,B)=>{const E=EVS.crevasse(B), f=eIn(prog(t,E.fall-.3,D-.5)), land=t>D-.5;
  // falling between two ice walls; the camera follows him down
  let w=`<rect x="-600" y="-2000" width="2280" height="4500" fill="#020610"/>`;
  w+=texPoly('M-600,-2000 L330,-2000 L300,-1500 L360,-1000 L280,-500 L340,0 L260,500 L330,1000 L300,1500 L-600,1500Z','ice',{x:-600,y:-2000,w:1200,h:3500,edge:'#bfe8ff',ew:5,tint:'#000814',tintOp:.25});
  w+=texPoly('M1680,-2000 L760,-2000 L800,-1500 L740,-1000 L820,-500 L760,0 L840,500 L770,1000 L800,1500 L1680,1500Z','ice',{x:600,y:-2000,w:1200,h:3500,edge:'#bfe8ff',ew:5,tint:'#000814',tintOp:.25});
  w+=`<path d="M300,1300 Q540,1260 800,1300 L800,1360 Q540,1330 300,1360Z" fill="#cfe8f6"/>`;   // ice bridge
  const jy=lerp(-1600,1300,f);
  if(!land){w+=A({...JOE,x:540,y:jy,s:.42,rot:t*260%360,eyes:'wide',mouth:'o',brows:'up',reachL:[-200,-500],reachR:[200,-520]});
    for(let i=0;i<10;i++) w+=`<line x1="${400+i*28}" y1="${jy-300-i*40%120}" x2="${400+i*28}" y2="${jy-600-i*40%120}" stroke="#bfe8ff" stroke-width="3" opacity=".5"/>`;}
  else w+=lying({...JOE,x:620,y:1310,s:.42,eyes:'closed',mouth:'line'},.42)+`<circle cx="560" cy="1290" r="${(40+prog(t,D-.5,D)*120).toFixed(0)}" fill="#fff" opacity="${(.7*(1-prog(t,D-.5,D))).toFixed(2)}"/>`;
  const cy=land?1150:jy-150;
  let o=cam(w,1.0,540,cy,540,560,land?shake(t,1-prog(t,D-.5,D),12):0);
  if(t>E.crev&&!land) o+=tag(540,880,'GRIETA',BLUE,P(t,E.crev,.2));
  return o;};

S.alone=(t,D,B)=>{const E=EVS.alone(B), wk=prog(t,0,D);
  let s=tex('dawn')+`<circle cx="840" cy="420" r="70" fill="#fff3d0" opacity=".9"/>`;
  s+=texPoly('M-600,560 L200,520 L600,560 L1680,520 L1680,1500 L-600,1500Z','snow',{edge:'#fff'})+`<rect x="-600" y="520" width="2280" height="980" fill="#ffb08a" opacity=".15"/>`;
  s+=`<path d="M40,640 L120,628 L180,650 L260,636 L330,660 L320,690 L250,672 L170,690 L100,668 L40,684Z" fill="#0a1830"/><path d="M40,640 L120,628 L180,650 L260,636 L330,660" stroke="#bfe8ff" stroke-width="4" fill="none"/>`;   // the crevasse behind him
  s+=tent(980,640,.35);
  const x=lerp(380,700,wk);
  for(let i=0;i<10;i++){const fx=x-60-i*40;if(fx>320) s+=`<ellipse cx="${fx}" cy="${1010+(i%2)*10}" rx="14" ry="6" fill="#9ab0c8"/>`;}
  s+=A({...SIMON,x,y:1010,s:.62,walk:t*5,stride:.7,look:t>E.back?[-12,6]:[8,10],brows:'worried',mouth:'line',eyes:t>E.dead?'closed':'open'});
  s+=`<path d="M-600,1100 L1680,1100" stroke="#000" opacity=".0"/>`;
  let o=cam(s,lerp(1.02,1.1,wk),lerp(520,600,wk),640,540,560);
  if(t>E.dead) o+=tag(250,330,'LO DA POR MUERTO',PINK,P(t,E.dead,.2));
  if(t>E.back) o+=tag(880,520,'CAMPAMENTO',YEL,P(t,E.back,.2));
  return o;};

S.alive=(t,D,B)=>{const E=EVS.alive(B), on=t>E.alive-.2, k=eIO(prog(t,0,D));
  let bg=`<rect x="-600" y="-900" width="2280" height="2400" fill="#020610"/>`+texPoly('M-600,-900 L330,-900 L300,400 L340,1500 L-600,1500Z','ice',{tint:'#000814',tintOp:.55})+texPoly('M1680,-900 L760,-900 L800,400 L770,1500 L1680,1500Z','ice',{tint:'#000814',tintOp:.55});
  bg+=`<path d="M300,830 Q540,800 800,830 L800,890 Q540,860 300,890Z" fill="#9fc0d8"/>`;
  let fg=lying({...JOE,x:620,y:840,s:.5,eyes:on?'wide':'closed',mouth:'line',brows:on?'up':'worried'},.5);
  if(on) fg+=`<path d="M380,${840-.5*80} L-100,300 L-100,700Z" fill="#fff6c0" opacity=".25"/>`+breath(330,800,t,.7);
  let o=focusCam(bg,fg,k,420,800,{z0:1.1,z1:2.2});
  return o;};

S.light=(t,D,B)=>{const E=EVS.light(B), dn=eIO(prog(t,0,E.deep+.3)), li=prog(t,E.exit-.4,E.light);
  let w=`<rect x="-600" y="-1500" width="2280" height="3200" fill="#020610"/>`;
  w+=texPoly('M-600,-1500 L330,-1500 L280,-600 L340,200 L260,1000 L330,1700 L-600,1700Z','ice',{x:-600,y:-1500,w:1200,h:3200,tint:'#000814',tintOp:.4});
  w+=texPoly('M1680,-1500 L760,-1500 L800,-600 L740,200 L900,700 L1000,700 L1000,1000 L770,1100 L800,1700 L1680,1700Z','ice',{x:600,y:-1500,w:1200,h:3200,tint:'#000814',tintOp:.4});
  // the hole with daylight, low on the right
  w+=`<path d="M900,700 L1000,700 L1000,1000 L860,1000Z" fill="#fff6c0" opacity="${(.3+.7*li).toFixed(2)}"/>`;
  if(li>0) w+=`<path d="M900,700 L1000,700 L560,1300 L200,1300Z" fill="#fff6c0" opacity="${(.28*li).toFixed(2)}"/>`+particles(t,'dust',{x0:300,x1:900,y0:800,y1:1250,n:18,op:li});
  w+=`<path d="M260,1260 Q540,1230 860,1260 L860,1320 Q540,1290 260,1320Z" fill="#9fc0d8"/>`;
  const jy=lerp(-200,1240,dn), jx=t<E.exit?540:lerp(540,820,eIO(prog(t,E.exit,D)));
  w+=rope([[540,-1500],[540,jy-.44*500]],{w:6});
  if(t<E.exit) w+=A({...JOE,x:jx,y:jy,s:.44,sit:true,look:[4,12],brows:'worried',mouth:'line',reachL:[-10,-600],reachR:[10,-440]});
  else w+=lying({...JOE,x:jx,y:1250,s:.44,dir:-1,eyes:'open',mouth:'line'},.44);
  let o=cam(w,1.0,540,lerp(-100,900,dn),540,560);
  if(t>E.deep&&t<E.exit) o+=tag(300,330,'MÁS HONDO',BLUE,P(t,E.deep,.2));
  if(t>E.light) o+=tag(760,330,'¡UNA SALIDA!',YEL,P(t,E.light,.2));
  return o;};

S.distance=(t,D,B)=>{const E=EVS.distance(B);
  // top-down map of the glacier and the moraine, the path to the camp
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#14121c"/>`;
  s+=texPoly('M60,160 L1020,160 L1020,1060 L60,1060Z','moraine',{x:60,y:160,w:960,h:900});
  s+=texPoly('M60,160 L700,160 Q560,400 600,600 Q300,700 60,640Z','ice',{x:60,y:160,w:960,h:900,tint:'#ffffff',tintOp:.35});
  s+=`<rect x="60" y="160" width="960" height="900" fill="none" stroke="#fff" stroke-width="6"/>`;
  const path=[[220,300],[360,420],[480,560],[560,700],[700,780],[820,880],[900,960]];
  const k=prog(t,E.km-.5,D);let d='M'+path[0].join(',');for(let i=1;i<path.length;i++) d+=' L'+path[i].join(',');
  s+=`<path d="${d}" stroke="#ffd34a" stroke-width="10" fill="none" stroke-dasharray="20,16" pathLength="100" stroke-dashoffset="0" opacity=".35"/>`;
  s+=`<path d="${d}" stroke="#ffd34a" stroke-width="10" fill="none" pathLength="100" stroke-dasharray="${(k*100).toFixed(1)},200"/>`;
  s+=xMark(220,300,.6,1)+tent(900,980,.5,.6);
  let o=cam(s,lerp(1.0,1.05,prog(t,0,D)),540,610,540,600);
  o+=dpill(540,640,`${Math.round(8*clamp(k*1.6))}`,'km',P(t,E.km-.3,.3));
  if(t>E.food){o+=`<g transform="translate(250,880)" opacity="${P(t,E.food,.2)}"><rect x="-50" y="-60" width="100" height="120" rx="10" fill="#c9c2b0"/><rect x="-50" y="-30" width="100" height="44" fill="#c23a3a"/></g>`+xMark(250,880,.9,prog(t,E.food,E.food+.3));}
  if(t>E.leg) o+=`<g transform="translate(830,880)" opacity="${P(t,E.leg,.2)}"><rect x="-80" y="-80" width="160" height="160" rx="20" fill="#14121c" stroke="#ff3e6c" stroke-width="8"/><path d="M-10,-60 L-10,-6 M12,-60 L12,-10 M-8,10 L-14,60 M14,8 L18,60" stroke="#d9ecff" stroke-width="16" stroke-linecap="round"/><path d="M-36,0 L-6,-8 L-14,14 L22,4" stroke="#ff3e6c" stroke-width="7" fill="none"/></g>`;
  return o;};

const crawler=(x,y,s,t,mv=1)=>{const ph=t*4*mv; // face down, pulling himself forward (to the left) with his arms
  return A({...JOE,x,y:y-80*s,s,rot:-84,look:[0,-12],brows:'worried',mouth:'line',eyes:'open',reachL:[-60+Math.sin(ph)*30,-820+Math.sin(ph)*110],reachR:[60-Math.sin(ph)*30,-820-Math.sin(ph)*110]})+breath(x-s*700,y-s*120,t,.4)};

S.crawl=(t,D,B)=>{
  let s=tex('moraine')+`<rect x="-600" y="-900" width="2280" height="1460" fill="#9fb0c8"/>`+puffs(t,250,'#fff',.6,5,4)+texPoly('M-600,560 L1680,520 L1680,1500 L-600,1500Z','moraine',{edge:'#3a3030'});
  for(let i=0;i<9;i++) s+=boulder(-200+i*170,620+(i%3)*30,.6+(i%2)*.3,['#7a6a5e','#5a4e48','#8a7a6a'][i%3]);
  const x=lerp(760,640,prog(t,0,D+1));
  s+=`<path d="M${x+300},1012 L${x+1000},1022" stroke="#5a4a40" stroke-width="14" opacity=".35"/>`+crawler(x,1010,.7,t);
  s+=particles(t,'dust',{x0:300,x1:900,y0:800,y1:1000,n:10,col:'#d9c9b0'});
  let o=cam(s,lerp(1.3,1.4,prog(t,0,D)),lerp(420,380,prog(t,0,D)),880,540,640);
  return o;};

S.watch=(t,D,B)=>{const E=EVS.watch(B);
  const left=Math.max(0,20*60-(t-E.goal)*360), mm=Math.floor(left/60), txt=t<E.goal?'14:07':`${String(mm).padStart(2,'0')}:${String(Math.floor(left%60)).padStart(2,'0')}`;
  if(t<E.rock-.3){ // the watch, close
    let s=tex('moraine')+`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity=".35"/>`+handIn(560,690,-90,1.1,JOE.skin,JOE.top)+watchK(560,560,1.3,txt);
    let o=cam(s,lerp(1.0,1.1,prog(t,0,E.rock)),540,560,540,560);
    if(t>E.goal) o+=tag(540,880,'UNA META',YEL,P(t,E.goal,.2));
    return o;}
  let s=tex('moraine')+`<rect x="-600" y="-900" width="2280" height="1460" fill="#9fb0c8"/>`+puffs(t,250,'#fff',.6,5,4)+texPoly('M-600,520 L1680,480 L1680,1500 L-600,1500Z','moraine',{edge:'#3a3030'});
  const second=t>E.other;
  const rx=second?260:620, ry=second?700:780;
  for(let i=0;i<7;i++) s+=boulder(-100+i*190,560+(i%3)*24,.5,['#7a6a5e','#5a4e48','#8a7a6a'][i%3]);
  s+=boulder(620,780,1.1,'#8a7a6a')+boulder(260,700,.9,'#7a6a5e');
  s+=crawler(lerp(980,900,prog(t,E.rock,D)),1010,.5,t);
  let o=cam(s,1.05,540,700,540,600);
  o+=brackets(rx,ry-60,second?200:240,second?160:200,YEL);
  o+=dpill(rx,ry-210,'20','min',P(t,second?E.other:E.twenty,.3));
  if(second) o+=tag(620,620,'✓',GREEN,1);
  return o;};

S.days=(t,D,B)=>{const k=prog(t,0,D);
  let s=tex(k<.5?'dawn':'storm')+texPoly('M-600,600 L1680,560 L1680,1500 L-600,1500Z','moraine',{edge:'#3a3030'});
  const a=k*Math.PI*3;s+=`<circle cx="${540+Math.cos(a)*420}" cy="${560-Math.abs(Math.sin(a))*380}" r="60" fill="${Math.sin(a)>0?'#fff3a0':'#e9ecf4'}"/>`;
  s+=crawler(lerp(900,300,k),1010,.42,t,2);
  let o=cam(s,1.0,540,600,540,600);
  for(let i=0;i<3;i++) if(k>i*.28) o+=`<line x1="${420+i*60}" y1="300" x2="${420+i*60}" y2="${300+170*P(t,i*.28*D,.15)}" stroke="#fff" stroke-width="20" stroke-linecap="round"/>`;
  o+=dpill(540,560,'3','días',P(t,0,.3),'#ff3e6c');
  return o;};

S.fire=(t,D,B)=>{const E=EVS.fire(B);
  let s=skyNight(t)+stars(21,60,500,t,.9)+texPoly('M-600,700 L1680,660 L1680,1500 L-600,1500Z','moraine',{tint:'#0a0c20',tintOp:.6});
  s+=`<path d="M-600,700 L-200,480 L100,620 L400,420 L800,600 L1100,460 L1680,660Z" fill="#141a30"/>`;
  s+=tent(820,900,.9,.4)+tent(160,860,.6,0);
  s+=fireK(470,980,.9,t)+particles(t,'embers',{x0:400,x1:540,y0:800,y1:960,n:16});
  if(t>E.burn-.3){const b=prog(t,E.burn-.3,E.burn+.6);s+=`<g transform="translate(470,940) rotate(-10)" opacity="${(1-b*.6).toFixed(2)}"><path d="M-60,-40 L60,-40 L70,30 L-70,30Z" fill="${JOE.top}"/><path d="M-60,-40 L-100,10 M60,-40 L100,10" stroke="${JOE.top}" stroke-width="30" stroke-linecap="round"/></g>`;}
  s+=A({...SIMON,x:250,y:1010,s:.6,sit:true,look:[10,8],brows:'worried',mouth:'line',eyes:'open'});
  s+=A({...RICH,x:700,y:1020,s:.6,look:[-6,10],mouth:'line',reachR:[120,-200]})+`<rect x="760" y="900" width="90" height="120" rx="20" fill="#5a6a3a"/><rect x="770" y="880" width="70" height="30" rx="10" fill="#4a5a2a"/>`;
  s+=dark(.45,[[470,900,420,360],[820,860,200,160]]);
  let o=cam(s,lerp(1.05,1.15,prog(t,0,D)),480,820,540,620);
  if(t>E.clothes&&t<E.dawn) o+=tag(470,330,'LA ROPA DE JOE',PINK,P(t,E.clothes,.2));
  if(t>E.dawn) o+=dpill(540,330,'MAÑANA','se van',P(t,E.dawn,.3));
  return o;};

S.shout=(t,D,B)=>{const E=EVS.shout(B), up=eOut(prog(t,E.hear,E.hear+.6)), k=eIO(prog(t,E.shout-.2,E.shout+.8));
  let bg=`<rect x="-600" y="-900" width="2280" height="2400" fill="#07060c"/><path d="M-200,1100 L540,120 L1280,1100Z" fill="#5a4220"/><path d="M-200,1100 L540,120 L540,1100Z" fill="#6a5028"/>`+candle(860,1000,.9,t,1.2);
  bg+=`<rect x="-100" y="960" width="900" height="120" rx="50" fill="#2a4a7a"/>`;
  let fg=up<.05?lying({...SIMON,x:420,y:1010,s:.62,eyes:'closed',mouth:'line'},.62):A({...SIMON,x:380,y:1080,s:.62,rot:lerp(-60,0,up),sit:up>.5,look:[-12,-4],brows:up>0?'up':'worried',eyes:up>0?'wide':'closed',mouth:up>0?'o':'line'});
  fg+=dark(.5,[[700,900,420,380]]);
  let o=focusCam(bg,fg,k,380,1080-.62*640*up-.62*300*(1-up),{z0:1.04,z1:1.9});
  if(t>E.shout){o+=soundArcs(120,420,t,YEL,1);o+=bubble(260,300,300,90,'«¡SIIIMON!»',{op:P(t,E.shout,.2),tx:80,ty:440,size:52});}
  return o;};

S.joe=(t,D,B)=>{const k=eIO(prog(t,0,D*.8));
  let bg=`<rect x="-600" y="-900" width="2280" height="2400" fill="#05050a"/>`+texPoly('M-600,700 L1680,680 L1680,1500 L-600,1500Z','moraine',{tint:'#000',tintOp:.6})+`<path d="M1200,200 L300,820 L700,1100Z" fill="#fff6c0" opacity=".22"/>`;
  let fg=lying({...JOE,x:620,y:960,s:.6,eyes:'open',mouth:'o',brows:'worried'},.6);
  fg+=dark(.6,[[560,900,360,240]]);
  return focusCam(bg,fg,k,420,900,{z0:1.1,z1:2.0});};

S.friends=(t,D,B)=>{const E=EVS.friends(B);
  let s=tex('dawn')+`<circle cx="540" cy="620" r="120" fill="#fff3d0" opacity=".8"/>`+texPoly('M-600,700 L-100,520 L300,640 L700,500 L1680,700 L1680,1500 L-600,1500Z','snow',{tint:'#ffb08a',tintOp:.25});
  s+=`<path d="M240,1010 Q240,850 400,836 L700,836 Q840,850 840,1010Z" fill="#6a5a50"/><path d="M260,900 Q300,846 400,840 L700,840 Q800,846 830,900Z" fill="#fff" opacity=".12"/>`;
  s+=A({...JOE,x:430,y:1000,s:.62,sit:true,look:[10,0],mouth:t>E.same?'smile':'line',eyes:t>E.same?'happy':'open'});
  s+=A({...SIMON,x:650,y:1000,s:.62,sit:true,look:[-10,0],mouth:t>E.same?'smile':'line',brows:'worried',reachL:[-180,-440]});
  let o=cam(s,lerp(1.05,1.2,prog(t,0,D)),540,780,540,600);
  o+=`<rect x="0" y="0" width="1080" height="1100" fill="#ffb060" opacity=".08"/>`;
  if(t>E.blame) o+=tag(540,330,'NUNCA LE CULPÓ',GREEN,P(t,E.blame,.2));
  return o;};

S.you=(t,D,B)=>{
  const bg=simonBg(t), fg=simonFg(t,{knife:1,eyes:'wide',mouth:'line',sweat:true,look:[0,-4]})+wind(t,40,.8,.4,2200);
  let o=focusCam(bg,fg,eIO(prog(t,0,D*.7)),SX+60,SY-SS*560,{z0:1.3,z1:1.9});
  o+=bigText('¿Y TÚ?',540,330,150,'#ffd34a',P(t,.1,.3));
  return o;};

window.CFG={band:{hook:'#0b0c16',mountain:'#2a2a3a',fall:'#1a1c2e',lower:'#14162a',edge:'#07080f',stuck:'#0b0c16',hour:'#0b0c16',cut:'#07080f',crevasse:'#020610',alone:'#3a2a3a',alive:'#020610',light:'#020610',distance:'#14121c',crawl:'#3a3236',watch:'#2a2426',days:'#1a1a24',fire:'#07080f',shout:'#07060c',joe:'#05050a',friends:'#3a2a2a',you:'#07080f'}};

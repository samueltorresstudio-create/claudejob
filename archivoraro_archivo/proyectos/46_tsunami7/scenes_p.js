// ================= TSUNAMI · PARTE 7 (final) =================
// ---------- key times per scene (scene-relative) ----------
const EVS={
  hook:B=>({ret:B[0].w[6],twenty:B[0].w[11],again:B[0].w[13]}),
  wake:B=>({wake:B[0].w[2]}),
  climb:B=>({rule:B[0].w[7],dark:B[1].w[1],roar:B[1].w[6]}),
  wave:B=>({wave:B[0].w[1],first:B[0].w[4],hit:B[0].w[9],hotel:B[0].w[11]}),
  collapse:B=>({crack:B[0].w[2],tilt:B[0].w[4],fall:B[0].w[7]}),
  ridge:B=>({betray:B[0].w[4],up:B[0].w[6]}),
  quake:B=>({shake:B[0].w[5],rule:B[1].s,away:B[1].w[8],rocks:B[1].w[12]}),
  slide:B=>({slide:B[0].w[1],buried:B[0].w[10]}),
  ravine:B=>({ravine:B[0].w[3],km:B[0].w[4]}),
  carry:B=>({rule:B[0].w[2],cant:B[1].w[2],carry:B[1].w[7],water:B[1].w[12]}),
  summit:B=>({clock:B[0].w[2],heli:B[0].w[4],rotor:B[0].w[8],shout:B[1].w[2],dog:B[1].w[6]}),
  choice:B=>({down:B[0].w[1],step:B[0].w[8],no:B[0].w[14],watch:B[1].w[2],both:B[1].w[5]}),
  takeoff:B=>({four:B[0].w[2],mom:B[0].w[9],nomap:B[0].w[14],late:B[0].w[16]}),
  cabin:B=>({head:B[0].w[1]}),
  horizon:B=>({sea:B[0].w[3],rise:B[0].w[6]}),
};
const S={};

// ---------- cast (same look as part 6) ----------
const P7MOM={skin:'#c98c64',hs:'bun',hair:'#3a2a24',top:'#6a7a8a',topD:'#4a5a6a',pants:'#2a2e38',shoes:'#3a332c',fem:true,seed:88};
const P7LUCIA={skin:'#c98c64',hs:'pigtails',hair:'#3a2418',top:'#8a6aa8',topD:'#6a4a88',pants:'#3a3a4a',shoes:'#3a332c',fem:true,seed:61};
const P7RED={...RUBEN};
const P7DARK={...RUBEN,skin:'#b98058',top:'#3a3f4e',topD:'#2a2e3a',jacket:'#3a3f4e',hair:'#2a2420',hs:'short',seed:31};
const P7RESC={skin:'#c99272',hs:'short',hair:'#2a1d18',top:'#ff7a1a',topD:'#d45a0a',pants:'#e06a14',shoes:'#2a2a2e',hat:'cap',hatCol:'#f3f0e6',seed:71};
const P7OLD1={...CAST_BY_ID.C15.o}, P7OLD2={...CAST_BY_ID.C02.o};

// ---------- Duque lying down / carried ----------
const p7DogHead=(hx,hy,o={})=>{ // doberman head facing right, centre (hx,hy)
  const B=DOB.body,T=DOB.tan;
  let g=`<path d="M${hx-26},${hy-30} L${hx-14},${hy-96} L${hx+12},${hy-34}Z" fill="${DOB.ear}"/>`;
  g+=`<ellipse cx="${hx}" cy="${hy}" rx="54" ry="44" fill="${B}"/>`;
  g+=`<path d="M${hx+20},${hy-26} L${hx+104},${hy-6} Q${hx+118},${hy+10} ${hx+104},${hy+24} L${hx+24},${hy+34}Z" fill="${B}"/>`;
  g+=`<path d="M${hx+30},${hy+8} L${hx+100},${hy+16} Q${hx+106},${hy+28} ${hx+92},${hy+32} L${hx+26},${hy+36}Z" fill="${T}"/>`;
  g+=`<ellipse cx="${hx+106}" cy="${hy-4}" rx="13" ry="10" fill="#0c0a0e"/>`;
  g+=`<circle cx="${hx+22}" cy="${hy-26}" r="7" fill="${T}"/>`;
  g+=o.eyes==='closed'?`<path d="M${hx+10},${hy-12} q12,7 24,0" stroke="#0c0a0e" stroke-width="5" fill="none" stroke-linecap="round"/>`
    :`<circle cx="${hx+22}" cy="${hy-12}" r="9" fill="#2a1a10"/><circle cx="${hx+25}" cy="${hy-15}" r="3" fill="#fff"/>`;
  return g};
const p7DogLie=(x,y,s,t,o={})=>{ // lying on its belly, facing right (o.dir -1 left); o.head 0 resting..1 up
  const B=DOB.body,T=DOB.tan,hu=o.head??0,br=Math.sin(t*2.2)*2;
  let g=`<ellipse cx="40" cy="4" rx="230" ry="14" fill="#000" opacity=".2"/>`;
  g+=`<path d="M-150,-40 Q-200,-30 -222,-8" stroke="${B}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  g+=`<path d="M-162,-6 C-172,-70 -122,-${(112+br).toFixed(1)} -40,-${(116+br).toFixed(1)} L80,-${(118+br).toFixed(1)} C134,-120 166,-90 166,-40 L166,-6Z" fill="${B}"/>`;
  g+=`<ellipse cx="-100" cy="-54" rx="62" ry="48" fill="${mix(B,'#ffffff',.07)}"/><ellipse cx="-36" cy="-8" rx="36" ry="10" fill="${T}"/>`;
  g+=`<path d="M120,-22 L250,-14" stroke="${B}" stroke-width="26" stroke-linecap="round"/><ellipse cx="264" cy="-10" rx="24" ry="10" fill="${T}"/>`;
  g+=`<path d="M110,-26 L236,-30" stroke="${mix(B,'#000000',.3)}" stroke-width="22" stroke-linecap="round"/><ellipse cx="248" cy="-26" rx="20" ry="9" fill="${mix(T,'#000000',.3)}"/>`;
  g+=`<ellipse cx="154" cy="-64" rx="16" ry="22" fill="${T}"/>`;
  const hx=210, hy=lerp(-58,-186,hu);
  g+=`<path d="M96,-112 L${hx-34},${hy-30} L${hx+6},${hy+34} L156,-30Z" fill="${B}"/>`;
  g+=p7DogHead(hx,hy,o);
  return `<g transform="translate(${x},${y}) scale(${(s*(o.dir||1)).toFixed(3)},${s})">${g}</g>`};
// fireman's carry, drawn in Marco's own coordinates (feet at 0,0; shoulders at y≈-518)
const p7CarryBack=(x,y,s,bob)=>`<g transform="translate(${x},${(y+bob*s).toFixed(1)}) scale(${s})"><path d="M-214,-566 C-214,-626 -160,-656 -64,-656 L84,-656 C170,-656 214,-626 214,-572 C214,-526 176,-510 104,-514 L-126,-514 C-186,-514 -214,-534 -214,-566Z" fill="${DOB.body}"/><path d="M-212,-590 Q-250,-560 -246,-520" stroke="${DOB.body}" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
const p7CarryFront=(x,y,s,bob,o={})=>{
  const B=DOB.body,T=DOB.tan;
  let g=`<path d="M-176,-560 L-150,-420 M-140,-560 L-112,-416" stroke="${B}" stroke-width="26" stroke-linecap="round"/><ellipse cx="-146" cy="-408" rx="18" ry="11" fill="${T}"/><ellipse cx="-108" cy="-404" rx="18" ry="11" fill="${T}"/>`;
  g+=`<path d="M150,-560 L132,-420 M184,-556 L170,-416" stroke="${B}" stroke-width="24" stroke-linecap="round"/><ellipse cx="134" cy="-408" rx="17" ry="10" fill="${T}"/><ellipse cx="172" cy="-404" rx="17" ry="10" fill="${T}"/>`;
  g+=`<path d="M150,-626 L214,-660 L236,-600 L176,-560Z" fill="${B}"/>`+p7DogHead(232,-640,o);
  g+=`<circle cx="-128" cy="-420" r="19" fill="${MARCO.skin}"/><circle cx="152" cy="-420" r="19" fill="${MARCO.skin}"/>`;
  return `<g transform="translate(${x},${(y+bob*s).toFixed(1)}) scale(${s})">${g}</g>`};
const p7Carry=(x,y,s,t,o={})=>{ // Marco walking with Duque on his shoulders
  const bob=o.walk!=null?-Math.abs(Math.cos(o.walk))*7:0;
  return p7CarryBack(x,y,s,bob)+A({...MARCO,x,y,s,walk:o.walk,look:o.look||[6,-2],brows:o.brows||'worried',mouth:o.mouth||'line',reachL:[-128,-420],reachR:[152,-420]})+p7CarryFront(x,y,s,bob,{eyes:o.dogEyes||'open'})};

// ---------- the helicopter ----------
const p7Heli=(x,y,s,t,o={})=>{ // side view, nose to the left; (x,y) = bottom of the skids
  const spin=o.spin??1, R='#d23a2a', W='#f3f0e6';
  let g=`<path d="M-250,0 L210,0 Q236,0 246,-18" stroke="#2a2e36" stroke-width="12" fill="none" stroke-linecap="round"/><line x1="-130" y1="0" x2="-110" y2="-62" stroke="#2a2e36" stroke-width="10"/><line x1="110" y1="0" x2="96" y2="-62" stroke="#2a2e36" stroke-width="10"/>`;
  g+=`<polygon points="180,-236 540,-206 540,-184 180,-128" fill="${R}"/><rect x="250" y="-206" width="230" height="14" fill="${W}" transform="rotate(4 250 -206)"/>`;
  g+=`<path d="M520,-210 L560,-300 L590,-300 L566,-190Z" fill="${R}"/>`;
  const tr=t*40*spin;g+=`<ellipse cx="560" cy="-226" rx="54" ry="54" fill="#2a2e36" opacity="${(.18*spin).toFixed(2)}"/><line x1="${(560+50*Math.cos(tr)).toFixed(1)}" y1="${(-226+50*Math.sin(tr)).toFixed(1)}" x2="${(560-50*Math.cos(tr)).toFixed(1)}" y2="${(-226-50*Math.sin(tr)).toFixed(1)}" stroke="#2a2e36" stroke-width="8" stroke-linecap="round"/><circle cx="560" cy="-226" r="8" fill="#5a5e66"/>`;
  g+=`<path d="M-300,-140 Q-300,-252 -170,-264 L120,-264 Q196,-258 206,-200 L206,-92 Q196,-60 150,-60 L-220,-60 Q-300,-70 -300,-140Z" fill="${R}"/>`;
  g+=`<path d="M-298,-118 L206,-118 L206,-96 L-292,-96Z" fill="${W}"/>`;
  g+=`<path d="M-292,-150 Q-288,-238 -190,-250 L-150,-250 L-150,-150Z" fill="#7cc8f0"/><path d="M-270,-170 Q-262,-226 -200,-236" stroke="#fff" stroke-width="8" fill="none" opacity=".5"/>`;
  g+=`<rect x="-126" y="-246" width="170" height="172" rx="10" fill="#15171c"/>`;
  if(o.inside) g+=`<clipPath id="p7door"><rect x="-126" y="-246" width="170" height="172" rx="10"/></clipPath><g clip-path="url(#p7door)">${o.inside}</g>`;
  g+=`<rect x="${o.doorOpen===false?-126:50}" y="-250" width="150" height="180" rx="8" fill="${mix(R,'#000000',.12)}"/><rect x="${o.doorOpen===false?-104:72}" y="-226" width="100" height="70" rx="8" fill="#7cc8f0" opacity=".8"/>`;
  g+=`<text x="${o.doorOpen===false?120:-20}" y="-30" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="${W}" opacity="0">.</text>`;
  g+=`<text x="360" y="-150" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="${W}">RESCATE</text>`;
  g+=`<rect x="-16" y="-300" width="32" height="40" fill="#3a3e46"/><rect x="-60" y="-276" width="120" height="16" rx="6" fill="#5a5e66"/>`;
  const a=t*24*spin;
  g+=`<ellipse cx="0" cy="-306" rx="460" ry="18" fill="#2a2e36" opacity="${(.22*spin).toFixed(2)}"/>`;
  for(const ph of [0,Math.PI/2]) g+=`<line x1="${(-460*Math.cos(a+ph)).toFixed(1)}" y1="${(-306-14*Math.sin(a+ph)).toFixed(1)}" x2="${(460*Math.cos(a+ph)).toFixed(1)}" y2="${(-306+14*Math.sin(a+ph)).toFixed(1)}" stroke="#1d2026" stroke-width="12" stroke-linecap="round"/>`;
  g+=`<circle cx="0" cy="-306" r="14" fill="#3a3e46"/>`;
  return `<g transform="translate(${x},${y}) rotate(${o.rot||0}) scale(${s})">${g}</g>`};

// ---------- the valley seen from the hillside (hook, wave, ridge) ----------
const P7H={x:620,y:760,k:.17};
const p7Hotel=(cx,gy,k,o={})=>`<g transform="translate(${cx},${gy}) scale(${k}) translate(-230,0)">${hotel(0,0,o)}</g>`;
const p7View=(t,o={})=>{
  const H=470, shore=o.shore??640;
  let s=skyTod('dawn')+`<circle cx="860" cy="${H-30}" r="56" fill="#ffd9a0"/><circle cx="860" cy="${H-30}" r="230" fill="url(#glowY)"/>`;
  s+=gulls(300,300,t,4,3);
  s+=sea(t,H,shore,{col:'#4a7a98'});
  if(shore<638){ // the sea bed left uncovered
    s+=`<rect x="-600" y="${shore.toFixed(1)}" width="2280" height="${(642-shore).toFixed(1)}" fill="#8a7a5a"/>`;
    const r=rng(17);for(let i=0;i<9;i++) s+=`<ellipse cx="${(-80+r()*1240).toFixed(0)}" cy="${(lerp(shore,640,.3+r()*.7)).toFixed(0)}" rx="${(30+r()*60).toFixed(0)}" ry="5" fill="#6a8aa0" opacity=".5"/>`;
    if(o.fish){const r2=rng(5);for(let i=0;i<9;i++){const fx=-60+r2()*1200, fy=lerp(shore+8,632,r2());if(fy>shore+6) s+=fish(fx,fy,.5,t,i);}}
    s+=`<g transform="translate(180,626) rotate(-14)">${boat(0,0,.32,0,'#e9e4d8','#3a6aa8')}</g><g transform="translate(900,630) rotate(10)">${boat(0,0,.28,0,'#f0d9a8','#c23a3a')}</g>`;
  }
  s+=`<rect x="-600" y="636" width="2280" height="10" fill="#a89a84"/>`;
  const greys=['#c9bcaa','#b9ab98','#d8ccb8','#a89c8a','#c2b49e'];
  const layers=[[700,townRow(700,2,{sc:.45,cols:greys})],[P7H.y,o.hotel==='gone'?'':p7Hotel(P7H.x,P7H.y,P7H.k)],[800,townRow(800,6,{sc:.6,cols:greys})],[870,townRow(870,9,{sc:.75,cols:greys})]];
  const wb=o.waveBase??-1;let waveDone=wb<0;
  for(const [ly,svg] of layers){if(!waveDone&&ly>wb){s+=waveWall(t,wb,o.waveH,{seed:4,top:'#4a5e6c',mid:'#2e3e4a',bot:'#22303a'});waveDone=true;} s+=svg;}
  if(!waveDone) s+=waveWall(t,wb,o.waveH,{seed:4,top:'#4a5e6c',mid:'#2e3e4a',bot:'#22303a'});
  if(o.flood!=null) s+=flood(t,o.flood,{rough:true,debris:true,flow:26,col:'#5e6a62'});
  if(o.after) s+=o.after;
  // the hillside in front
  s+=`<path d="M-600,930 Q300,880 1680,850 L1680,1600 L-600,1600Z" fill="#1f3a2a"/>`;
  for(const [x,y,k] of [[-40,1000,1.0],[90,980,.7],[1030,940,1.1],[950,960,.75]]) s+=pine(x,y,k,'#12261a');
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1e2654" opacity="${o.dim??.12}"/>`;
  return s};

// ---------- the dawn hillside where they slept (part 6) ----------
const p7Camp=(t,n)=>{ // n = how much night is left
  let s=skyTod('dawn')+`<g opacity="${n.toFixed(2)}">${skyNight(t)}${stars(4,60,520,t,.8)}</g>`;
  s+=`<path d="M-600,760 Q200,640 1680,560 L1680,1600 L-600,1600Z" fill="#1f3a2a"/>`;
  for(const [x,y,k] of [[-60,820,1.1],[120,790,.8],[880,640,.9],[1010,620,1.2],[760,660,.7]]) s+=pine(x,y,k,'#163024');
  s+=`<path d="M-600,920 Q300,880 1680,880 L1680,1600 L-600,1600Z" fill="#2a4a32"/>`;
  for(const [x,y,k] of [[-120,1000,1.5],[1100,960,1.6]]) s+=pine(x,y,k,'#10221a');
  // last night's fire: stones, black wood, a thread of smoke
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;s+=`<ellipse cx="${(860+Math.cos(a)*46).toFixed(0)}" cy="${(1000+Math.sin(a)*14).toFixed(0)}" rx="16" ry="10" fill="#5a5a60"/>`;}
  s+=`<path d="M830,1000 L890,992 M834,992 L886,1000" stroke="#2a2420" stroke-width="10" stroke-linecap="round"/>`;
  for(let i=0;i<5;i++){const p=(t*.25+i/5)%1;s+=`<circle cx="${(860+Math.sin(p*6+i)*18).toFixed(1)}" cy="${(980-p*260).toFixed(1)}" r="${(10+p*26).toFixed(1)}" fill="#c9c2b0" opacity="${(.35*(1-p)).toFixed(2)}"/>`;}
  return s};

// ---------- the steep path up: a slope that climbs to the right ----------
const p7ClimbY=x=>1010-(x-300)*.36;
const p7Climb=(t,n)=>{
  let s=skyTod('dawn')+`<g opacity="${n.toFixed(2)}">${skyNight(t)}${stars(8,50,420,t,.7)}</g>`;
  // far below on the left: the town and the dark sea
  s+=`<g transform="translate(-60,560) scale(.55)">${sea(t,0,260,{col:'#2e4a62'})}</g>`;
  s+=townRow(760,13,{sc:.4,cols:['#7a7e88','#6a6e78','#8a8e96','#5a5e68','#72767e']});
  s+=`<rect x="-600" y="760" width="2280" height="900" fill="#25332c"/>`;
  s+=`<path d="M-600,${p7ClimbY(-600)+120} L1680,${p7ClimbY(1680)+120} L1680,1600 L-600,1600Z" fill="#2a4630"/>`;
  s+=`<path d="M-600,${p7ClimbY(-600)} L1680,${p7ClimbY(1680)} L1680,${p7ClimbY(1680)+40} L-600,${p7ClimbY(-600)+40}Z" fill="#8a7a5a"/>`;
  const r=rng(12);for(let i=0;i<16;i++){const x=-400+i*140+r()*40;s+=`<ellipse cx="${x.toFixed(0)}" cy="${(p7ClimbY(x)+10+r()*20).toFixed(0)}" rx="${(8+r()*10).toFixed(0)}" ry="5" fill="#6a5a44"/>`;}
  // pines above the path (behind) and below it (in front)
  for(const x of [-300,40,420,760,1100,1400]) s=s.replace('<!--P-->','')+pine(x,p7ClimbY(x)-6,.9,'#183326');
  return s};
const p7ClimbFront=t=>{let s='';for(const x of [-420,1500]) s+=pine(x,p7ClimbY(x)+170,1.3,'#0f2018');return s};

// ---------- the mountain path with the loose slope (quake, slide) ----------
const p7SlopeY=x=>x<430?1010:x<900?lerp(1010,420,(x-430)/470):lerp(420,140,(x-900)/800);
const P7ROCKS=[[560,30,0,640],[660,44,1,760],[770,36,2,700],[860,52,3,900],[980,40,4,1040],[1120,48,5,820]];
const p7RockPos=(i,k)=>{const [x,r,,tx]=P7ROCKS[i];const y0=p7SlopeY(x)-r*.7, ee=eIn(clamp(k));return [lerp(x,tx,ee),lerp(y0,1000-r*.8,ee),ee*720*(i%2?1:-1)]};
const p7Rock=(x,y,r,rot)=>`<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)})"><path d="M${-r},${r*.2} Q${-r},${-r*.8} ${-r*.1},${-r} Q${r*.9},${-r*.9} ${r},${r*.1} Q${r*.7},${r*.8} 0,${r*.8} Q${-r*.8},${r*.8} ${-r},${r*.2}Z" fill="#8a8478"/><path d="M${-r*.6},${-r*.5} Q${-r*.1},${-r*.85} ${r*.5},${-r*.6}" stroke="#a8a294" stroke-width="${(r*.18).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="M${-r*.2},${r*.5} Q${r*.4},${r*.4} ${r*.7},0" stroke="#6a665c" stroke-width="${(r*.12).toFixed(1)}" fill="none"/></g>`;
const p7Ledge=(t,o={})=>{
  const k=o.slide||0;
  let s=skyTod('day')+sunT(200,260,46);
  s+=puffs(t,330,'#fff',.7,6,3);
  // far left: the sea and the drowned coast, far below
  s+=sea(t,520,640,{col:'#5a8aa8'})+`<rect x="-600" y="636" width="2280" height="20" fill="#7a6a50"/>`;
  s+=`<path d="M-600,700 Q-200,620 200,690 Q420,730 600,680 L600,1100 L-600,1100Z" fill="#7a9a6a"/>`;
  s+=`<path d="M-600,800 Q-100,740 300,800 Q480,830 600,800 L600,1100 L-600,1100Z" fill="#5f8256"/>`;
  for(const [x,y,c] of [[-100,800,.6],[140,790,.5],[330,810,.55]]) s+=pine(x,y,c,'#3e6a44');
  // the slope (ladera) on the right
  s+=`<path d="M430,1010 L900,420 L1700,140 L1700,1600 L430,1600Z" fill="#8a6e4e"/>`;
  s+=`<path d="M430,1010 L900,420 L1700,140" stroke="#6a5038" stroke-width="10" fill="none"/>`;
  for(let i=0;i<7;i++) s+=`<path d="M${520+i*90},${1010-i*18} L${900+i*70},${470+i*60}" stroke="#7a5e40" stroke-width="6" opacity=".7"/>`;
  for(const [x,y] of [[640,640],[1180,320],[1300,520],[780,860]]) s+=`<ellipse cx="${x}" cy="${y}" rx="40" ry="18" fill="#5f8256"/><ellipse cx="${x+30}" cy="${y-8}" rx="26" ry="14" fill="#6f9264"/>`;
  // loose rocks (they fall when the slope goes)
  P7ROCKS.forEach(([x,r],i)=>{const kk=prog(k,.05+i*.06,.55+i*.06), [px,py,rot]=p7RockPos(i,kk);s+=p7Rock(px,py,r,rot)});
  // the signpost on the path
  s+=`<rect x="892" y="800" width="16" height="210" fill="#6a4a2e"/><path d="M800,800 L1000,800 L1034,836 L1000,872 L800,872Z" fill="#a87a4a"/><text x="906" y="848" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#fff4e0">SAN TELMO</text>`;
  // the path and the drop below it
  s+=`<rect x="-600" y="990" width="2280" height="60" fill="#b0966e"/><rect x="-600" y="990" width="2280" height="8" fill="#000" opacity=".1"/>`;
  s+=`<path d="M-600,1050 L1680,1050 L1680,1600 L-600,1600Z" fill="#4a6a3e"/>`;
  const r=rng(3);for(let i=0;i<14;i++) s+=`<ellipse cx="${(-300+i*130+r()*40).toFixed(0)}" cy="${(1010+r()*30).toFixed(0)}" rx="${(6+r()*8).toFixed(0)}" ry="4" fill="#8a7454"/>`;
  return s};
const p7Slide=(t,k)=>{ // the mass of earth that buries the path, plus dust
  if(k<=0) return '';
  const h=300*eOut(clamp(k*1.2));
  let s=`<path d="M430,1010 L900,420 L1000,385 Q${lerp(1000,760,k)},${lerp(400,760,k)} ${lerp(980,560,k)},1050 L1340,1050 Q${lerp(1100,1240,k)},${lerp(600,900,k)} 1100,350Z" fill="#7a5e42" opacity="${clamp(k*3).toFixed(2)}"/>`;
  s+=`<path d="M430,1060 Q620,${1060-h*.7} 860,${1060-h} Q1120,${1060-h*.9} 1360,1060Z" fill="#6e553c"/>`;
  const r=rng(9);for(let i=0;i<16;i++){const x=480+r()*820, y=1060-r()*h*.8;s+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(10+r()*20).toFixed(0)}" ry="${(8+r()*12).toFixed(0)}" fill="${r()>.5?'#8a8478':'#5a4a36'}"/>`;}
  for(let i=0;i<10;i++){const p=clamp(k*1.3-i*.05), x=500+i*90+Math.sin(i)*30, y=980-p*260-i%3*40;if(p>0) s+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(60+p*120).toFixed(0)}" fill="#c4b49a" opacity="${(.55*(1-p*.6)).toFixed(2)}"/>`;}
  return s};

// ---------- the ravine (barranco) ----------
const p7Ravine=(t,o={})=>{
  const noon=o.noon||0;
  let s=skyTod('day');
  if(noon) s+=`<circle cx="560" cy="150" r="60" fill="#fff4c8"/><circle cx="560" cy="150" r="260" fill="url(#glowY)" opacity="${noon.toFixed(2)}"/>`;
  s+=`<path d="M380,560 Q540,480 700,560 L700,700 L380,700Z" fill="#9ab07a"/>`;
  s+=`<path d="M-600,-300 L320,-300 L440,560 L370,820 L-600,1120Z" fill="#a8704a"/>`;
  s+=`<path d="M1680,-300 L780,-300 L650,560 L730,840 L1680,1120Z" fill="#94603e"/>`;
  for(let i=0;i<8;i++){s+=`<path d="M-600,${-100+i*130} L${330+i*8},${-60+i*90}" stroke="#8a5a3a" stroke-width="7" opacity=".7"/><path d="M1680,${-60+i*130} L${770-i*8},${-30+i*90}" stroke="#7a4e32" stroke-width="7" opacity=".7"/>`;}
  s+=`<path d="M370,820 L440,560 L650,560 L730,840 L1680,1120 L1680,1600 L-600,1600 L-600,1120Z" fill="#c4a67c"/>`;
  s+=`<path d="M545,560 Q520,700 570,820 Q640,940 560,1100" stroke="#8ab8cc" stroke-width="${lerp(10,4,noon).toFixed(0)}" fill="none" opacity=".75"/>`;
  const r=rng(23);for(let i=0;i<18;i++){const y=600+r()*480, x=lerp(400,-200,(y-560)/560)+r()*lerp(260,1500,(y-560)/560);s+=p7Rock(x,y,lerp(8,34,(y-560)/540),r()*360);}
  s+=`<path d="M-600,1080 L1680,1080 L1680,1600 L-600,1600Z" fill="#a88a60"/>`;
  if(noon){s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#ffcf8a" opacity="${(.14*noon).toFixed(2)}"/>`;
    for(let i=0;i<6;i++){const y=860+i*30, ph=t*4+i;let p=`M-100,${y}`;for(let x=-100;x<=1200;x+=60) p+=` L${x},${(y+Math.sin(x*.03+ph)*4).toFixed(1)}`;s+=`<path d="${p}" stroke="#fff" stroke-width="2" fill="none" opacity=".12"/>`;}}
  return s};
const p7Bottle=(x,y,s,lvl)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-26" y="-90" width="52" height="110" rx="14" fill="#dff2ff" opacity=".55"/><rect x="-26" y="${(20-110*lvl).toFixed(1)}" width="52" height="${(110*lvl).toFixed(1)}" rx="${lvl>.1?12:2}" fill="#3aa0e8"/><rect x="-26" y="-90" width="52" height="110" rx="14" fill="none" stroke="#cfe6f6" stroke-width="5"/><rect x="-14" y="-108" width="28" height="20" rx="4" fill="#2a6aa8"/></g>`;
const p7Found=(x,y,svg,a)=>a<=0?'':`<g transform="translate(${x},${y}) scale(${eBack(clamp(a)).toFixed(3)})"><circle cx="0" cy="-30" r="78" fill="#11131f" fill-opacity=".85" stroke="#fff" stroke-width="4"/>${svg}</g>`;
const p7Lighter=`<rect x="-16" y="-60" width="32" height="70" rx="6" fill="#ff8a2a"/><rect x="-14" y="-76" width="28" height="18" fill="#9aa3ad"/>`;

// ---------- the summit of San Telmo ----------
const p7Summit=(t,o={})=>{
  let s=skyTod('day')+sunT(880,230,52)+puffs(t,280,'#fff',.8,8,6);
  s+=sea(t,560,700,{col:'#5a8aa8'});
  s+=`<path d="M-600,700 Q-100,600 300,660 Q700,720 1100,620 L1680,640 L1680,1100 L-600,1100Z" fill="#7a98a8"/>`;
  s+=`<path d="M-600,780 Q0,700 500,770 Q900,820 1680,720 L1680,1100 L-600,1100Z" fill="#6a8a6a"/>`;
  s+=`<path d="M-600,900 Q540,850 1680,890 L1680,1600 L-600,1600Z" fill="#8a9a5a"/>`;
  const r=rng(44);for(let i=0;i<22;i++){const x=-300+r()*1700, y=910+r()*160, bend=o.wash?Math.sin(t*14+i)*8+(x<720?-10:10):0;s+=`<path d="M${x.toFixed(0)},${y.toFixed(0)} l${(-6+bend).toFixed(0)},-22 M${(x+8).toFixed(0)},${y.toFixed(0)} l${(2+bend).toFixed(0)},-28 M${(x+16).toFixed(0)},${y.toFixed(0)} l${(8+bend).toFixed(0)},-20" stroke="#6a7a3e" stroke-width="5" stroke-linecap="round"/>`;}
  for(const [x,y,rr] of [[40,1060,34],[1000,1070,40],[260,930,20]]) s+=p7Rock(x,y,rr,0);
  // summit sign
  s+=`<rect x="146" y="820" width="16" height="190" fill="#6a4a2e"/><rect x="44" y="760" width="220" height="92" rx="8" fill="#a87a4a"/><text x="154" y="798" text-anchor="middle" font-family="Inter" font-weight="900" font-size="26" fill="#fff4e0">MONTE</text><text x="154" y="834" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#fff4e0">SAN TELMO</text>`;
  // windsock
  const fl=Math.sin(t*(o.wash?18:5))*(o.wash?10:4);
  s+=`<rect x="1030" y="700" width="8" height="310" fill="#9aa3ad"/><g transform="translate(1034,712) rotate(${(o.wash?-6:14)+fl})"><path d="M0,-18 L-130,-10 L-130,10 L0,18Z" fill="#ff7a1a"/><path d="M-44,-15 L-86,-12 L-86,12 L-44,15Z" fill="#fff"/></g>`;
  // helipad
  s+=`<ellipse cx="740" cy="1012" rx="300" ry="46" fill="#6a6e72"/><ellipse cx="740" cy="1012" rx="250" ry="36" fill="none" stroke="#f3f0e6" stroke-width="6"/><text x="740" y="1030" text-anchor="middle" font-family="Inter" font-weight="900" font-size="60" fill="#f3f0e6" transform="translate(740,1018) scale(1.6,.42) translate(-740,-1018)">H</text>`;
  if(o.wash){for(let i=0;i<8;i++){const p=(t*1.4+i/8)%1, dir=i%2?1:-1;s+=`<path d="M${(740+dir*(120+p*420)).toFixed(0)},${1000-i%3*20} l${dir*60},0" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="${(.5*(1-p)).toFixed(2)}"/>`;}}
  return s};

// ---------- inside the helicopter ----------
const p7Cabin=(t,view)=>{
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#5e665c"/>`;
  for(let i=0;i<7;i++) s+=`<rect x="${-200+i*220}" y="-900" width="22" height="1900" fill="#4e564c"/>`;
  s+=`<rect x="-600" y="250" width="2280" height="16" fill="#4a5048"/><rect x="-600" y="1010" width="2280" height="600" fill="#2e322e"/>`;
  for(let i=0;i<10;i++) s+=`<rect x="${-200+i*150}" y="1030" width="90" height="10" rx="4" fill="#3e423e"/>`;
  // porthole with the sky outside
  const id=uid('win');
  s+=`<clipPath id="${id}"><circle cx="820" cy="520" r="120"/></clipPath><g clip-path="url(#${id})">${view}</g><circle cx="820" cy="520" r="120" fill="none" stroke="#3a3e3a" stroke-width="26"/><path d="M740,470 Q770,430 820,420" stroke="#fff" stroke-width="8" fill="none" opacity=".35"/>`;
  s+=`<circle cx="820" cy="520" r="360" fill="url(#glowY)" opacity=".25"/>`;
  // bench + webbing + extinguisher
  s+=`<rect x="-600" y="790" width="1500" height="30" rx="8" fill="#c23a3a"/><rect x="-600" y="820" width="1500" height="190" fill="#3a3e46"/>`;
  for(let i=0;i<6;i++) s+=`<rect x="${-100+i*170}" y="560" width="16" height="230" fill="#d4a63a" opacity=".85"/>`;
  s+=`<rect x="1010" y="640" width="56" height="150" rx="20" fill="#d23a2a"/><rect x="1022" y="610" width="32" height="34" fill="#2a2e36"/>`;
  return s};

// ---------- the countdown in the HUD ----------
const p7Clock=sec=>{sec=Math.max(0,Math.floor(sec));return [Math.floor(sec/3600),Math.floor(sec/60)%60,sec%60].map(v=>String(v).padStart(2,'0')).join(':')};

// ================= scenes =================
S.hook=(t,D,B)=>{const E=EVS.hook(B), rk=eIO(prog(t,0,D));
  let s=p7View(t,{shore:lerp(636,520,rk),fish:true});
  let o=cam(s,lerp(1.0,1.12,rk),560,640,540,600);
  if(t>E.twenty) o+=countPop('20 MIN',540,290,120,t-E.twenty,YEL);
  if(t>E.again) o+=tag(300,460,'OTRA VEZ',PINK,P(t,E.again,.2));
  return o;};

S.wake=(t,D,B)=>{const E=EVS.wake(B), up=eOut(prog(t,E.wake+.2,E.wake+.9)), stand=t>E.wake+1.3;
  let s=p7Camp(t,lerp(.45,.25,prog(t,0,D)));
  s+=A({...MARCO,x:420,y:1010,s:.6,look:[10,8],brows:'worried',mouth:t>E.wake-.2&&t<E.wake+.8?'o':'line',reachR:t>E.wake-.4&&!stand?[190,-260]:null});
  if(!stand) s+=p7DogLie(720,1012,.46,t,{dir:-1,head:up,eyes:up>.3?'open':'closed'});
  else s+=doberman(700,1012,.46,t,{dir:-1,alert:1,head:8,seed:9});
  s+=dark(.38,[[560,900,420,260]]);
  let o=cam(s,lerp(1.05,1.14,prog(t,0,D)),560,860,540,760);
  o+=countPop('05:12',540,300,130,t,PINK);
  return o;};

S.climb=(t,D,B)=>{const E=EVS.climb(B), k=prog(t,0,D), n=lerp(.35,.6,eIO(prog(t,E.dark-.3,E.dark+.8)));
  const mx=lerp(160,620,k), dx=mx+190;
  let s=p7Climb(t,n);
  const roar=prog(t,E.roar-.3,D);
  if(roar>0){ // the sea far below starts to roar: a white line in the dark
    s+=`<path d="M-600,${(600-roar*20).toFixed(1)} Q-200,${(590-roar*30).toFixed(1)} 300,${(605-roar*20).toFixed(1)}" stroke="#eef4f6" stroke-width="${(4+roar*8).toFixed(1)}" fill="none" opacity="${(.4+roar*.5).toFixed(2)}"/>`;
    s+=soundArcs(120,560,t,'#cfe6f6',1);}
  s+=doberman(dx,p7ClimbY(dx)+4,.42,t,{walk:t*9,alert:.8,head:t>E.roar?-4:6,dir:t>E.roar+.4&&t<E.roar+1.6?-1:1,seed:9});
  s+=A({...MARCO,x:mx,y:p7ClimbY(mx)+6,s:.58,walk:t*7,look:[12,-6],brows:'worried',mouth:'line'});
  s+=p7ClimbFront(t);
  s+=dark(n*.75,[[mx+90,p7ClimbY(mx)-150,300,260]]);
  let o=cam(s,1.12,mx+120,p7ClimbY(mx)-160,540,600,t>E.roar?shake(t,.4,3):0);
  if(t>E.rule&&t<B[1].s) o+=tag(760,450,'NO MIRES ATRÁS',YEL,P(t,E.rule,.2)*(1-P(t,B[1].s-.2,.2)));
  if(t>E.roar) o+=bang(250,1000,'RRRUUUM',BLUE,P(t,E.roar,.2),64);
  return o;};

S.wave=(t,D,B)=>{const E=EVS.wave(B);
  const app=eIn(prog(t,0,E.hit)), hit=prog(t,E.hit,E.hit+1.6);
  const wb=t<E.hit?lerp(500,756,app):lerp(756,900,eOut(hit)), wh=t<E.hit?lerp(40,250,app):lerp(250,0,eIn(hit));
  const fl=t>E.hit?lerp(905,540,eOut(prog(t,E.hit+.15,E.hit+1.4))):null;
  let after='';
  if(t>E.first&&t<E.hit+.2){ // where the first wave reached (floor 4) vs this one
    const y1=P7H.y-4*190*P7H.k, a=P(t,E.first,.3);
    after+=`<line x1="${P7H.x-70}" y1="${y1}" x2="${P7H.x+70}" y2="${y1}" stroke="#ffd34a" stroke-width="5" stroke-dasharray="12 8" opacity="${a}"/>`;}
  if(t>E.hit) after+=splash(P7H.x,620,t,prog(t,E.hit,E.hit+1.3),1.3)+splash(P7H.x-30,540,t,prog(t,E.hit+.3,E.hit+1.6),1.0);
  let s=p7View(t,{shore:520,waveBase:wb,waveH:wh,flood:fl,after,dim:.18});
  s+=doberman(860,1062,.3,t,{dir:-1,alert:1,head:-10,seed:9});
  s+=A({...MARCO,x:960,y:1066,s:.4,look:[-12,4],brows:'worried',mouth:t>E.hit?'o':'line',eyes:t>E.hit?'wide':'open'});
  const z=lerp(1.0,1.18,eIO(prog(t,E.hit-.4,D)));
  let o=cam(s,z,lerp(560,P7H.x,eIO(prog(t,E.hit-.4,D))),lerp(700,640,eIO(prog(t,E.hit-.4,D))),540,620,shake(t,1-prog(t,E.hit,E.hit+1),9));
  if(t>E.first&&t<E.hit) o+=tag(820,560,'1ª OLA',YEL,P(t,E.first,.2));
  if(t>E.hotel) o+=tag(840,520,'HOTEL MIRADOR',PINK,P(t,E.hotel,.2));
  return o;};

S.collapse=(t,D,B)=>{const E=EVS.collapse(B);
  const crack=prog(t,E.crack-.1,E.crack+.6), tilt=eIO(prog(t,E.tilt-.2,E.tilt+.8)), fall=eIn(prog(t,E.fall-.1,E.fall+1.5));
  const WL=760, gx=640, gy=1100, k=.36, px=gx-83;
  let s=skyTod('dawn')+skyT(.4);
  s+=townRow(700,3,{sc:.6,cols:['#9a9488','#8a8478','#aaa498','#7a746a','#928c80']});
  let h=p7Hotel(gx,gy,k);
  if(crack>0){const L=1200*crack;h+=`<path d="M${gx-90},520 L${gx-60},560 L${gx-74},610 L${gx-40},660 L${gx-54},720 M${gx+80},360 L${gx+52},420 L${gx+80},470 L${gx+60},540" stroke="#1d1d22" stroke-width="7" fill="none" stroke-dasharray="${L.toFixed(0)} 2000"/><path d="M${gx-60},740 L${gx-20},710 L${gx+30},750 L${gx+70},700" stroke="#1d1d22" stroke-width="6" fill="none" stroke-dasharray="${L.toFixed(0)} 2000"/>`;}
  const ang=-5*tilt-38*fall, drop=820*fall;
  s+=`<g transform="translate(${(-60*fall).toFixed(1)},${drop.toFixed(1)}) rotate(${ang.toFixed(2)} ${px} ${WL})">${h}</g>`;
  if(t>E.tilt){const r=rng(6);for(let i=0;i<10;i++){const p=((t-E.tilt)*.9+r())%1;s+=`<rect x="${(gx-90+r()*200).toFixed(0)}" y="${(300+r()*300+p*500).toFixed(0)}" width="${(10+r()*16).toFixed(0)}" height="${(8+r()*10).toFixed(0)}" fill="#b8b0a4" opacity="${(1-p).toFixed(2)}"/>`;}}
  s+=flood(t,WL,{rough:true,debris:true,flow:46,col:'#5e6a62'});
  s+=splash(gx-40,WL,t,prog(t,E.fall+.5,E.fall+1.9),2.4)+splash(gx+80,WL,t,prog(t,E.fall+.8,E.fall+2.1),1.8);
  const dk=prog(t,E.fall+.4,D+1);
  if(dk>0) for(let i=0;i<9;i++){const x=gx-220+i*60, y=WL-20-dk*220-(i%3)*40;s+=`<circle cx="${x}" cy="${y.toFixed(0)}" r="${(60+dk*130+(i%4)*14).toFixed(0)}" fill="#bdb3a2" opacity="${(.6*(1-dk*.5)).toFixed(2)}"/>`;}
  let o=cam(s,lerp(1.0,1.08,prog(t,0,D)),540,560,540,560,shake(t,Math.max(1-prog(t,E.crack,E.crack+.5),(t>E.fall?1-prog(t,E.fall,E.fall+1.6):0)),t>E.fall?14:6));
  o+=bang(300,560,'CRAC',PINK,P(t,E.crack,.1)*(1-P(t,E.crack+.8,.3)),80);
  return o;};

S.ridge=(t,D,B)=>{const E=EVS.ridge(B);
  const ga=P(t,E.betray,.5), ua=P(t,E.up,.3);
  let after='';
  const dk=.5+.5*prog(t,0,D);
  for(let i=0;i<7;i++){const x=P7H.x-80+i*28, y=P7H.y-140-dk*80-(i%3)*20;after+=`<circle cx="${x}" cy="${y.toFixed(0)}" r="${(30+dk*30).toFixed(0)}" fill="#bdb3a2" opacity="${(.35*(1-dk*.4)).toFixed(2)}"/>`;}
  if(ga>0){const top=P7H.y-12*190*P7H.k, w=460*P7H.k;after+=`<rect x="${P7H.x-w/2}" y="${top}" width="${w}" height="${P7H.y-top}" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-width="3" stroke-dasharray="10 8" opacity="${ga}"/>`;
    if(ua>0) after+=`<g opacity="${ua}">${A({...MARCO,x:P7H.x-8,y:top,s:.07,still:true,op:.85})}${doberman(P7H.x+16,top,.05,t,{seed:9})}</g>`;}
  let s=p7View(t,{shore:600,flood:600,hotel:'gone',after,dim:.1});
  s+=`<path d="M560,1100 Q600,1000 700,980 L1680,960 L1680,1600 L560,1600Z" fill="#3a3a36"/><path d="M640,1000 Q760,970 1680,966" stroke="#5a5a54" stroke-width="10" fill="none"/>`;
  s+=doberman(720,1000,.44,t,{dir:-1,alert:.5,head:-16,seed:9});
  s+=A({...MARCO,x:900,y:1000,s:.6,look:[-12,6],brows:'worried',mouth:'line'});
  let o=cam(s,lerp(1.04,1.1,prog(t,0,D)),560,640,540,600);
  if(ua>0) o+=tag(P7H.x+60,330,'ALLÍ ARRIBA',YEL,ua);
  return o;};

S.quake=(t,D,B)=>{const E=EVS.quake(B), rule=t>E.rule;
  const q=t>E.shake?Math.max(0,1-prog(t,E.shake+2.2,E.shake+3.4)):0;
  const walk1=prog(t,0,E.shake), back=eIO(prog(t,E.away,E.away+1.4));
  const mx=t<E.shake?lerp(300,560,walk1):lerp(560,300,back), dx=t<E.shake?mx-170:lerp(390,150,eIO(prog(t,E.away-.2,E.away+1.0)));
  let s=p7Ledge(t);
  if(t>E.shake){const r=rng(31);for(let i=0;i<16;i++){const st=E.shake+r()*2.6, p=prog(t,st,st+.9), x0=520+r()*700;if(p>0&&p<1){const y0=p7SlopeY(x0);s+=p7Rock(x0-p*60,y0+p*p*(1000-y0),6+r()*8,p*400);}}}
  const scared=t>E.shake;
  s+=doberman(dx,1004,.42,t,{dir:rule&&back<1&&back>0?-1:1,walk:(t<E.shake||(back>0&&back<1))?t*9:null,alert:1,bark:scared&&!rule&&Math.sin(t*7)>.5,head:scared?10:2,seed:9});
  s+=A({...MARCO,x:mx,y:1010,s:.6,walk:(t<E.shake||(back>0&&back<1))?t*7:null,look:rule?(back<1?[-12,-2]:[12,-10]):scared?[10,-8]:[12,-2],brows:'worried',eyes:scared&&!rule?'wide':'open',mouth:scared&&!rule?'o':'line',aL:q>.2?70:null,aR:q>.2?70:null});
  let o=cam(s,1.06,600,700,540,600,shake(t,q,12));
  if(scared&&!rule) o+=tag(820,560,'RÉPLICA',PINK,P(t,E.shake,.2));
  if(t>E.rocks){o+=brackets(604,579,120,110,PINK)+brackets(816,326,140,130,PINK);o+=tag(800,560,'ROCAS SUELTAS',PINK,P(t,E.rocks,.2));}
  return o;};

S.slide=(t,D,B)=>{const E=EVS.slide(B), k=prog(t,E.slide-.3,E.buried+.4);
  let s=p7Ledge(t,{slide:k})+p7Slide(t,k);
  s+=doberman(110,1004,.42,t,{dir:1,alert:1,bark:Math.sin(t*7)>.5&&t<E.buried,head:6,seed:9});
  s+=A({...MARCO,x:240,y:1010,s:.6,look:[12,-6],brows:'worried',eyes:'wide',mouth:'o',aL:60,aR:60});
  let o=cam(s,lerp(1.0,.96,prog(t,0,D)),560,700,540,600,shake(t,1-prog(t,E.buried,E.buried+1.5),14));
  o+=bang(640,380,'¡BRRROOOM!',PINK,P(t,E.slide,.1)*(1-P(t,E.buried-.3,.3)),66);
  if(t>E.buried) o+=tag(780,450,'CAMINO ENTERRADO',PINK,P(t,E.buried,.2));
  return o;};

S.ravine=(t,D,B)=>{const E=EVS.ravine(B), k=prog(t,0,D);
  let s=p7Ravine(t,{noon:.3});
  const mx=lerp(160,460,k);
  s+=doberman(mx+180,1004,.42,t,{walk:t*8,alert:.6,head:-2,seed:9});
  s+=A({...MARCO,x:mx,y:1010,s:.6,walk:t*7,look:[12,-4],brows:'worried',mouth:'line'});
  let o=cam(s,lerp(1.08,1.0,eIO(k)),540,720,540,600);
  if(t>E.ravine) o+=tag(800,400,'BARRANCO',YEL,P(t,E.ravine,.2));
  if(t>E.km) o+=countPop('+3 KM',800,540,110,t-E.km,PINK);
  return o;};

S.carry=(t,D,B)=>{const E=EVS.carry(B), l2=t>B[1].s;
  let s=p7Ravine(t,{noon:1});
  const walkA=prog(t,0,E.cant), walkB=prog(t,E.carry+.3,D);
  if(t<E.carry){
    const mx=lerp(220,420,walkA), lim=Math.abs(Math.sin(t*5))*6, stop=t>E.cant;
    if(!stop) s+=`<g transform="translate(0,${(-lim).toFixed(1)})">${doberman(mx-170,1004,.42,t,{walk:t*6,alert:.4,head:-14,seed:9})}</g>`;
    else s+=p7DogLie(mx-200,1006,.42,t,{head:.15,eyes:'closed'});
    s+=A({...MARCO,x:mx,y:1010,s:.6,walk:stop?null:t*6,look:stop?[-12,6]:[12,-2],brows:'worried',mouth:stop?'o':'line',reachL:t>E.carry-.6?[-170,-120]:null});
  } else {
    const mx=lerp(420,560,walkB);
    s+=p7Carry(mx,1010,.6,t,{walk:t*5,look:[10,-2],dogEyes:'closed'});
  }
  let o=cam(s,lerp(1.04,1.1,prog(t,0,D)),520,720,540,600);
  const lv=t<E.water?.35:lerp(.35,0,prog(t,E.water,E.water+1));
  if(!l2||t>E.water){o+=p7Found(900,450,p7Bottle(0,10,.75,lv),P(t,l2?E.water:E.rule,.35));}
  if(!l2) o+=p7Found(720,450,p7Lighter,P(t,E.rule+.3,.35));
  if(t>E.water+.6) o+=tag(900,580,'SIN AGUA',BLUE,P(t,E.water+.6,.2));
  return o;};

S.summit=(t,D,B)=>{const E=EVS.summit(B), arr=eOut(prog(t,0,3.2)), l2=t>B[1].s;
  let s=p7Summit(t,{wash:true});
  const heliIn='';
  s+=p7Heli(780,960,1.05,t,{});
  s+=A({...P7OLD1,x:770,y:1000,s:.5,look:[4,-4],brows:'worried',mouth:'line'});
  s+=A({...P7OLD2,x:lerp(1000,900,prog(t,0,D)),y:1010,s:.52,walk:t*4,look:[-8,-2],brows:'worried',mouth:'line',cane:true});
  const stop=t>E.shout;
  s+=A({...P7RESC,x:640,y:1010,s:.6,look:[-12,-4],brows:stop?'angry':null,mouth:stop&&t<E.dog+1.2?'o':'line',mopen:stop?.6+.3*Math.sin(t*16):0,reachL:stop?[-180,-640]:null});
  const mx=lerp(-120,270,arr);
  s+=p7Carry(mx,1010,.6,t,{walk:arr<1?t*6:null,look:l2?[10,-4]:[12,-6],brows:'worried',mouth:t>E.dog?'o':'line'});
  let o=cam(s,lerp(1.0,1.06,prog(t,0,D)),540,760,540,600);
  if(t>E.clock&&!l2) o+=countPop('11:56',540,300,110,t-E.clock,YEL);
  if(stop) o+=tag(540,330,'SOLO PERSONAS',PINK,P(t,E.shout,.2));
  return o;};

S.choice=(t,D,B)=>{const E=EVS.choice(B);
  const put=prog(t,E.down,E.down+.9), back=eIO(prog(t,E.step,E.step+.7)), go=eIO(prog(t,E.both+.3,D+.6));
  let s=p7Summit(t,{wash:true});
  s+=p7Heli(840,960,1.05,t,{});
  const watch=t>E.watch&&t<E.both, wave=t>E.both;
  s+=A({...P7RESC,x:730,y:1010,s:.6,look:watch?[-4,8]:[-12,-4],brows:watch?'worried':null,mouth:wave?'smile':'line',reachL:watch?[-40,-470]:wave?[-170,-700+Math.sin(t*10)*40]:null});
  let mx=lerp(420,340,back), dogX=lerp(260,250,back);
  if(go>0){mx=lerp(340,560,go);dogX=lerp(250,470,go);}
  const shakeNo=t>E.no&&t<E.no+1?Math.sin((t-E.no)*16)*8:0;
  if(t<E.down) s+=p7Carry(mx,1010,.6,t,{look:[10,-4]});
  else if(put<1){const k=eIO(put);s+=`<g transform="rotate(${lerp(0,-8,Math.sin(k*Math.PI))} ${dogX} 1004)">`+doberman(lerp(mx-60,dogX,k),lerp(700,1004,k),.42,t,{alert:.4,head:-8,seed:9})+`</g>`;
    s+=A({...MARCO,x:mx,y:1010,s:.6,look:[-12,10],brows:'worried',mouth:'line',reachL:[lerp(-100,-260,k),lerp(-420,-260,k)],reachR:[lerp(150,-40,k),lerp(-420,-300,k)]});}
  else {s+=doberman(dogX,1004,.42,t,{walk:go>0&&go<1?t*7:null,alert:.6,head:go>0?0:16,wag:wave,seed:9});
    s+=A({...MARCO,x:mx,y:1010,s:.6,walk:(back>0&&back<1)||(go>0&&go<1)?t*6:null,look:wave?[12,-4]:[10,-4],tilt:shakeNo,brows:wave?null:'angry',mouth:wave?'smile':'line',reachL:!wave&&back>=1?[-150,-260]:null});}
  let o=cam(s,1.18,560,800,540,640);
  if(watch) o+=p7Found(860,500,`<rect x="-60" y="-70" width="120" height="80" rx="16" fill="#1d2026"/><text x="0" y="-16" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="40" fill="#ff4a6a">11:59</text>`,prog(t,E.watch,E.watch+.35));
  if(t>E.no&&t<E.watch) o+=tag(540,300,'SIN DUQUE, NO',YEL,P(t,E.no,.2));
  if(wave) o+=tag(540,300,'LOS DOS',GREEN,P(t,E.both,.2));
  return o;};

S.takeoff=(t,D,B)=>{const E=EVS.takeoff(B), lift=eIn(prog(t,0,D)*1.15);
  let s=p7Summit(t,{wash:lift<.6});
  const hy=lerp(960,330,clamp(lift)), hx=lerp(840,960,clamp(lift)), hs=lerp(1.05,.75,clamp(lift));
  s+=`<ellipse cx="${hx-20}" cy="1012" rx="${(380*(1-clamp(lift)*.7)).toFixed(0)}" ry="${(26*(1-clamp(lift)*.7)).toFixed(0)}" fill="#000" opacity="${(.25*(1-clamp(lift))).toFixed(2)}"/>`;
  const inside=`<g transform="translate(-40,0)">${doberman(-20,-80,.22,t,{dir:-1,alert:.3,head:4,seed:9})}${A({...MARCO,x:20,y:-74,s:.26,look:[-10,4],brows:'worried',mouth:'line'})}</g>`;
  s+=p7Heli(hx,hy,hs,t,{rot:-6*clamp(lift*3),inside});
  const ar=eOut(prog(t,E.four-.2,E.four+2.2));
  const group=[[P7MOM,-40,.6],[P7LUCIA,80,.5],[P7RED,190,.6],[P7DARK,310,.6]];
  for(const [c,x0,sc] of group){const x=lerp(x0-420,x0+80,ar), still=ar>=1;
    s+=A({...c,x,y:1010,s:sc,walk:still?null:t*9,look:still?[10,-12]:[12,-4],brows:t>E.late?'worried':'angry',mouth:t>E.late?'o':'line',eyes:t>E.late?'wide':'open'});}
  let o=cam(s,lerp(1.0,.95,prog(t,0,D)),540,700,540,600);
  if(t>E.nomap&&t<E.late) o+=p7Found(300,330,`<g transform="scale(.16) translate(-540,-640)">${mapCard(t,1)}</g><path d="M-44,-74 L44,14 M44,-74 L-44,14" stroke="#ff4a6a" stroke-width="12" stroke-linecap="round"/>`,prog(t,E.nomap,E.nomap+.35));
  if(t>E.late) o+=tag(300,300,'TARDE',PINK,P(t,E.late,.2));
  return o;};

S.cabin=(t,D,B)=>{const E=EVS.cabin(B), rest=eIO(prog(t,E.head,E.head+1.2));
  const view=skyTod('day')+puffs(t,400,'#fff',.9,40,7)+`<path d="M600,${700-t*20} Q760,${560-t*20} 900,${680-t*20} L1100,${720-t*20} L1100,900 L600,900Z" fill="#6a8a6a"/>`;
  let s=p7Cabin(t,view);
  s+=seatBox(380,1010,.6)+A({...MARCO,x:380,y:1010,s:.6,sit:true,look:[10,8],brows:'worried',mouth:rest>.6?'smile':'line',eyes:rest>.8?'closed':'open',reachR:[lerp(150,95,rest),lerp(-330,-260,rest)]});
  s+=p7DogLie(560,1012,.6,t,{dir:-1,head:lerp(1.3,1.18,rest),eyes:rest>.5?'closed':'open'});
  s+=seatBox(800,1010,.6)+A({...P7RESC,x:800,y:1010,s:.6,sit:true,look:[-10,6],mouth:'smile'});
  let o=cam(s,lerp(1.05,1.16,eIO(prog(t,0,D))),520,860,540,640,Math.sin(t*30)*1.2);
  return o;};

S.horizon=(t,D,B)=>{const E=EVS.horizon(B), rise=prog(t,E.rise-.4,D+.3);
  const id=uid('pw'), cx=540, cy=560, R=420, bob=Math.sin(t*1.6)*6;
  let v=skyTod('day')+`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a3a50" opacity="${(.35*prog(t,E.sea,D)).toFixed(2)}"/>`;
  v+=sea(t,330,760,{col:'#3a6a88'});
  v+=waveWall(t,338,lerp(0,230,eIn(clamp(rise))),{seed:7,top:'#3a4e5c',mid:'#26343e',bot:'#1e2830'});
  v+=`<path d="M-600,640 Q200,600 600,630 Q900,650 1680,610 L1680,1600 L-600,1600Z" fill="#6a8a6a"/>`;
  v+=townRow(690,4,{sc:.22,cols:['#9a9488','#8a8478','#aaa498','#7a746a','#928c80']})+`<path d="M-600,672 Q300,660 1680,668 L1680,700 L-600,704Z" fill="#5e6a62"/>`;
  v+=`<path d="M-600,760 Q200,720 600,780 L1680,740 L1680,1600 L-600,1600Z" fill="#5f7f58"/>`;
  v+=`<path d="M-160,1100 L380,780 L460,780 L1000,1100Z" fill="#7a8a5a"/><path d="M380,780 L460,780 L560,860 Q420,830 300,830Z" fill="#8a9a64"/><ellipse cx="420" cy="784" rx="34" ry="6" fill="#6a6e72"/>`;
  for(let i=0;i<4;i++) v+=`<rect x="${392+i*15}" y="${i===1?762:756}" width="7" height="${i===1?16:22}" rx="3" fill="${['#6a7a8a','#8a6aa8','#c23a3a','#3a3f4e'][i]}"/>`;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#5e665c"/>`;
  s+=`<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(0,${bob.toFixed(1)})">${v}</g></g>`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#3a3e3a" stroke-width="54"/><path d="M${cx-300},${cy-200} Q${cx-220},${cy-320} ${cx-80},${cy-360}" stroke="#fff" stroke-width="12" fill="none" opacity=".25"/>`;
  if(rise>0) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#ff2a2a" opacity="${(Math.sin(t*9)>0?.12:.04).toFixed(2)}"/>`;
  let o=cam(s,lerp(1.0,1.12,eIO(prog(t,0,D))),540,520,540,560);
  return o;};

// HUD: countdown to the last helicopter (12:00). It is 05:12 when the sea goes out again.
window.CFG={steps:['1. SI EL MAR SE RETIRA, SUBE','2. CUIDADO CON LAS RÉPLICAS','3. SOLO LO IMPRESCINDIBLE'],listEnd:'summit',
  hud:(h,bt,st,T)=>{
    const sc=n=>BEATS.find(b=>b.sc===n).start;
    const K=[[0,6.8*3600],[sc('climb'),6.8*3600-60],[sc('wave'),6.47*3600],[sc('ridge'),6.45*3600],[sc('quake')-.01,6.43*3600],[sc('quake'),5.2*3600],[sc('ravine'),5.05*3600],[sc('carry'),2.6*3600],[sc('summit'),240],[sc('choice'),110],[sc('takeoff'),0]];
    let v=K[K.length-1][1];
    for(let i=0;i<K.length-1;i++) if(T>=K[i][0]&&T<=K[i+1][0]){v=lerp(K[i][1],K[i+1][1],prog(T,K[i][0],K[i+1][0]));break;}
    return 'HELICÓPTERO · '+p7Clock(v);},
  band:{hook:'#1f3a2a',wake:'#10221a',climb:'#0f2018',wave:'#1f3a2a',collapse:'#5e6a62',ridge:'#3a3a36',quake:'#4a6a3e',slide:'#4a6a3e',ravine:'#a88a60',carry:'#a88a60',summit:'#8a9a5a',choice:'#8a9a5a',takeoff:'#8a9a5a',cabin:'#2e322e',horizon:'#3a3e3a'}};

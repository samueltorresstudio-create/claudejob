// Tsunami — props. Marco, Duque (the dobermann), the sea that pulls back, the wave and the flooded town. Everything keeps moving.
const MARCO={skin:'#d6a07a',hs:'short',hair:'#2a2420',beard:'#3a2e26',top:'#4f5a3a',topD:'#3a4229',pants:'#2a2e38',shoes:'#3a332c',seed:42};
const PACK='#5a6040';
const sway=(t,ph=0,a=1)=>Math.sin(t*1.3+ph)*a;

// ---------- sky, sea, beach ----------
function skyT(k=0){ // k 0 clear morning → 1 grey storm light
  const top=mix('#7cc0ea','#56606c',k), bot=mix('#ffe9c8','#a3a8aa',k), id=uid('sk');
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-600" y="-1900" width="2280" height="3400" fill="url(#${id})"/>`}
function sunT(x,y,r=70){return `<circle cx="${x}" cy="${y}" r="${r*3}" fill="url(#glowY)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffe7a0"/>`}
function gulls(x,y,t,n,seed=5,spread=300,col='#f6f6f6'){ // gulls gliding, each flapping on its own beat
  const r=rng(seed);let s='';
  for(let i=0;i<n;i++){const bx=x+(r()-.5)*spread+Math.sin(t*.7+i)*20, by=y+(r()-.5)*spread*.4+Math.sin(t*1.6+i)*10, f=Math.sin(t*9+i*1.9), sc=.7+r()*.6;
    s+=`<path d="M${bx-18*sc},${by} Q${bx-9*sc},${by-12*sc*f} ${bx},${by} Q${bx+9*sc},${by-12*sc*f} ${bx+18*sc},${by}" stroke="${col}" stroke-width="${4*sc}" fill="none" stroke-linecap="round"/>`}
  return s}
function sea(t,y0,y1,o={}){ // open sea between horizon y0 and shoreline y1, with drifting glints and a foam edge
  const col=o.col||'#3f86b8', far=mix(col,'#cfe6f0',.4), id=uid('sea');
  let s=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${far}"/><stop offset="1" stop-color="${col}"/></linearGradient></defs><rect x="-600" y="${y0}" width="2280" height="${Math.max(0,y1-y0)}" fill="url(#${id})"/>`;
  const r=rng(o.seed||3), h=y1-y0;
  if(h>8) for(let i=0;i<30;i++){const d=r(), y=y0+4+d*(h-8), x=((r()*1700+t*(8+d*30))%1800)-360, w=16+d*46;
    s+=`<path d="M${x.toFixed(1)},${y.toFixed(1)} q${w/2},${-3-d*4} ${w},0" stroke="#eaf7ff" stroke-width="${(1.5+d*3).toFixed(1)}" fill="none" stroke-linecap="round" opacity="${(.3+.25*Math.sin(t*2+i)).toFixed(2)}"/>`}
  if(o.foam!==false){let p=`M-600,${y1}`;for(let x=-600;x<=1680;x+=40) p+=` L${x},${(y1+Math.sin(x*.02+t*2.2)*4).toFixed(1)}`;s+=`<path d="${p}" stroke="#f6fbff" stroke-width="7" fill="none" opacity=".85"/>`}
  return s}
function boat(x,y,s,rot=0,col='#e9e4d8',stripe='#c23a3a'){
  return `<g transform="translate(${x},${y}) rotate(${rot.toFixed(1)}) scale(${s})"><ellipse cx="0" cy="6" rx="130" ry="12" fill="#000" opacity=".18"/><path d="M-130,-50 L130,-50 Q120,0 80,4 L-90,4 Q-124,-10 -130,-50Z" fill="${col}"/><rect x="-128" y="-42" width="254" height="10" fill="${stripe}"/><rect x="-40" y="-100" width="80" height="50" rx="6" fill="#f6f2ea"/><rect x="-28" y="-90" width="24" height="20" fill="#7aa8c8"/><rect x="6" y="-90" width="24" height="20" fill="#7aa8c8"/><line x1="70" y1="-50" x2="70" y2="-190" stroke="#5a4a3a" stroke-width="6"/></g>`}
function fish(x,y,s,t,ph=0){ // a fish flapping on the wet sand
  const j=Math.max(0,Math.sin(t*5+ph)), a=Math.sin(t*14+ph)*25;
  return `<g transform="translate(${x},${(y-j*34*s).toFixed(1)}) rotate(${a.toFixed(1)}) scale(${s})"><ellipse cx="0" cy="0" rx="26" ry="10" fill="#b9c6d0"/><path d="M22,0 L40,-12 L40,12Z" fill="#9aa8b4"/><circle cx="-14" cy="-3" r="3" fill="#1a1a22"/></g>`}
function lighthouse(x,y,s,t){ // red-and-white lighthouse on a rock
  let g=`<path d="M-120,0 Q-110,-60 -40,-70 Q40,-80 110,-50 Q130,-20 120,0Z" fill="#5a5048"/>`;
  g+=`<path d="M-34,-60 L-24,-360 L24,-360 L34,-60Z" fill="#f4f0e8"/>`;
  for(const [a,b] of [[-130,-170],[-230,-270]]) g+=`<path d="M${-34+(-a-60)/300*10},${a} L${-34+(-b-60)/300*10},${b} L${34-(-b-60)/300*10},${b} L${34-(-a-60)/300*10},${a}Z" fill="#c23a3a"/>`;
  g+=`<rect x="-30" y="-372" width="60" height="14" fill="#2a2a33"/><rect x="-20" y="-420" width="40" height="48" fill="#ffe7a0" opacity="${(.7+.3*Math.sin(t*3)).toFixed(2)}"/><path d="M-28,-420 L0,-450 L28,-420Z" fill="#c23a3a"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`}
function beach(t,o={}){ // the beach seen from the promenade. o.ret 0..1 = how far the sea has pulled back
  const H=o.horizon??520, shore0=o.shore??760, ret=o.ret||0, shore=lerp(shore0,H+30,ret);
  let s=skyT(o.storm||0)+sunT(840,300,60)+gulls(lerp(200,900,(t*.03)%1),330,t,5,4,360);
  s+=lighthouse(960,H+6,.42,t);
  s+=sea(t,H,shore,{col:mix('#3f86b8','#4a6a7a',ret*.6)});
  // wet sand revealed as the water leaves: darker, with seaweed and stranded boats and fish
  s+=`<rect x="-600" y="${shore}" width="2280" height="${shore0-shore+2}" fill="#a88e62"/>`;
  if(ret>.05){const r=rng(11);for(let i=0;i<22;i++){const yy=lerp(shore,shore0,r()), xx=-100+r()*1300;s+=`<ellipse cx="${xx.toFixed(0)}" cy="${yy.toFixed(0)}" rx="${(8+r()*22).toFixed(0)}" ry="4" fill="#5a6a3a" opacity=".55"/>`}
    for(const [bx,f,rt,c] of [[260,.35,-9,'#e9e4d8'],[700,.6,7,'#f0d9a8']]) s+=boat(bx,lerp(shore0,shore,f)+10,.42,rt*clamp(ret*2),c);
    if(o.fish) {const r2=rng(4);for(let i=0;i<9;i++){const fx=-40+r2()*1160, fy=lerp(shore+20,shore0-10,r2());s+=fish(fx,fy,.8+r2()*.4,t,i*1.3)}}}
  s+=`<rect x="-600" y="${shore0}" width="2280" height="800" fill="#e6cf9c"/><path d="M-600,${shore0} Q540,${shore0+16} 1680,${shore0}" stroke="#c9b07a" stroke-width="8" fill="none"/>`;
  return s}
function promenade(y,t,o={}){ // railing + lamp posts in the foreground
  let s=`<rect x="-600" y="${y}" width="2280" height="900" fill="${o.col||'#d8cfc2'}"/><rect x="-600" y="${y}" width="2280" height="10" fill="#000" opacity=".1"/>`;
  for(let i=0;i<9;i++){const tx=((i*240-(o.scroll||0))%2160+2160)%2160-540;s+=`<rect x="${tx}" y="${y+60}" width="120" height="10" fill="#000" opacity=".06"/>`}
  return s}
function railing(y,scroll=0,col='#2f3a4a'){let s=`<rect x="-600" y="${y-90}" width="2280" height="9" fill="${col}"/><rect x="-600" y="${y-50}" width="2280" height="6" fill="${col}"/>`;
  for(let i=0;i<40;i++){const x=((i*60-scroll)%2400+2400)%2400-600;s+=`<rect x="${x}" y="${y-90}" width="7" height="90" fill="${col}"/>`}return s}
function palmT(x,y,s,t,ph=0,lean=0){ // promenade palm, fronds swaying
  const sw=sway(t,ph,4);let g='';
  for(let i=0;i<10;i++){const yy=-i*48, xx=Math.sin(i*.2)*lean;g+=`<ellipse cx="${xx.toFixed(1)}" cy="${yy}" rx="${22-i}" ry="27" fill="${i%2?'#8a6a48':'#9a7a54'}"/>`}
  const tp=[Math.sin(9*.2)*lean,-9*48];
  for(let k=0;k<8;k++){const a=-170+k*23+sw*(k%2?1.6:-1.1);g+=`<g transform="translate(${tp[0].toFixed(1)},${tp[1]}) rotate(${a.toFixed(1)})"><path d="M0,0 Q95,-34 200,18 Q95,2 0,14Z" fill="${k%2?'#3f8a4a':'#2f7040'}"/></g>`}
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`}
function lamp(x,y,s=1,sw=0){return `<g transform="translate(${x},${y}) scale(${s}) rotate(${sw.toFixed(2)})"><rect x="-6" y="-460" width="12" height="460" fill="#2f3a4a"/><path d="M0,-460 Q0,-490 36,-490 L60,-490" stroke="#2f3a4a" stroke-width="10" fill="none"/><path d="M44,-494 L80,-494 L72,-470 L52,-470Z" fill="#2f3a4a"/></g>`}
function seaSide(t,y,o={}){ // side view: sea behind the promenade railing (for the run)
  let s=skyT(o.storm||0)+sunT(820,330,56)+gulls(lerp(1100,-100,(t*.05)%1),360,t,4,8,300);
  s+=lighthouse(lerp(900,700,clamp((o.scroll||0)/6000)),y-150,.36,t)+sea(t,y-170,y-40,{foam:false});
  return s}

// ---------- the town ----------
function townRow(y,seed,o={}){ // distant blocks with windows (rooftop view); o.cols, o.sc scale
  const r=rng(seed);let s='';let x=-300;
  while(x<1500){const w=(90+r()*130)*(o.sc||1), h=(120+r()*220)*(o.sc||1), c=(o.cols||['#e9dccb','#d9c6ae','#f0e6d8','#c9b8a2','#e2d2bc'])[Math.floor(r()*5)];
    s+=`<rect x="${x.toFixed(0)}" y="${(y-h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+400).toFixed(0)}" fill="${c}"/><rect x="${x.toFixed(0)}" y="${(y-h).toFixed(0)}" width="${w.toFixed(0)}" height="8" fill="#000" opacity=".12"/>`;
    for(let wy=y-h+24*(o.sc||1);wy<y+200;wy+=46*(o.sc||1)) for(let wx=x+14*(o.sc||1);wx<x+w-24*(o.sc||1);wx+=34*(o.sc||1)) s+=`<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="${(16*(o.sc||1)).toFixed(0)}" height="${(22*(o.sc||1)).toFixed(0)}" fill="${o.win||'#7aa0be'}" opacity=".8"/>`;
    s+=`<rect x="${(x+w).toFixed(0)}" y="${(y-h).toFixed(0)}" width="6" height="${(h+400).toFixed(0)}" fill="#000" opacity=".08"/>`;
    x+=w+6+r()*16;}
  return s}
function hotel(x,y,o={}){ // 12-floor concrete hotel; y = ground. 190 px per floor, fire escape on the right side
  const W=460, F=190, top=y-12*F;
  let s=`<rect x="${x}" y="${top}" width="${W}" height="${12*F}" fill="#d8d2c8"/><rect x="${x+W-60}" y="${top}" width="60" height="${12*F}" fill="#000" opacity=".08"/>`;
  for(let f=0;f<12;f++){const fy=y-(f+1)*F;s+=`<rect x="${x}" y="${fy+F-14}" width="${W}" height="14" fill="#b8b0a4"/>`;
    for(let i=0;i<3;i++) s+=`<rect x="${x+40+i*135}" y="${fy+40}" width="100" height="110" fill="${o.lit&&((f+i)%3===0)?'#ffd98a':'#7a9cb8'}"/><rect x="${x+40+i*135}" y="${fy+40}" width="100" height="10" fill="#fff" opacity=".25"/>`}
  s+=`<rect x="${x-10}" y="${top-30}" width="${W+20}" height="34" fill="#a8a094"/><rect x="${x+90}" y="${top-120}" width="280" height="90" fill="#2a2e3a"/><text x="${x+230}" y="${top-60}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="36" fill="#ffd34a">MIRADOR</text>`;
  s+=`<rect x="${x+150}" y="${y-140}" width="160" height="140" fill="#3a3e4a"/><rect x="${x+120}" y="${y-160}" width="220" height="26" fill="#c23a3a"/>`;
  // fire escape: landings + zigzag flights, painted dark red
  const ex=x+W;
  for(let f=0;f<=12;f++){const ly=y-f*F;s+=`<rect x="${ex}" y="${ly-8}" width="130" height="10" fill="#6a2a2a"/><line x1="${ex+130}" y1="${ly-8}" x2="${ex+130}" y2="${ly-60}" stroke="#6a2a2a" stroke-width="5"/>`;
    if(f<12){const a=f%2===0?[ex+10,ly-8,ex+120,ly-F-8]:[ex+120,ly-8,ex+10,ly-F-8];s+=`<line x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}" stroke="#7a3030" stroke-width="10"/>`;
      for(let k=1;k<8;k++){const px=lerp(a[0],a[2],k/8), py=lerp(a[1],a[3],k/8);s+=`<line x1="${px-10}" y1="${py}" x2="${px+10}" y2="${py}" stroke="#7a3030" stroke-width="4"/>`}}}
  s+=`<line x1="${ex+130}" y1="${top}" x2="${ex+130}" y2="${y}" stroke="#6a2a2a" stroke-width="4"/>`;
  return s}
function escapePos(x,y,p){ // a point on the fire escape at progress p (0 ground → 1 roof)
  const W=460,F=190, f=Math.min(11.999,p*12), i=Math.floor(f), k=f-i, ex=x+W;
  const xx=i%2===0?lerp(ex+20,ex+110,k):lerp(ex+110,ex+20,k);
  return [xx,y-8-f*F, i%2===0?1:-1]}
function carRow(t,y,s,seed,o={}){ // a jam of cars that barely move; brake lights on
  const r=rng(seed);let g='';const cols=['#c23a3a','#e9e4d8','#3a5a8a','#2a2e3a','#e0b04a','#7a8a94','#4a7a5a'];
  for(let i=0;i<9;i++){const x=-260+i*(370*s)+r()*40+(o.shift||0), jig=Math.sin(t*20+i)*1.2*(o.idle??1);g+=carK(x,y+jig,s,cols[Math.floor(r()*cols.length)],o.lights??1)}
  return g}
function homeIn(t){ // Marco's flat: wall, window to the sea, shelf, door
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#d9cfbf"/><rect x="-600" y="900" width="2280" height="700" fill="#8a6a4e"/><rect x="-600" y="890" width="2280" height="14" fill="#6a4e38"/>`;
  s+=`<rect x="90" y="300" width="300" height="300" fill="#f3eee6"/>`;
  s+=`<rect x="100" y="470" width="280" height="120" fill="#4a7a9a"/><rect x="100" y="310" width="280" height="160" fill="#a8d4ee"/><path d="M100,470 L380,470" stroke="#fff" stroke-width="3"/>`;
  s+=`<rect x="234" y="300" width="12" height="300" fill="#f3eee6"/><rect x="90" y="440" width="300" height="12" fill="#f3eee6"/>`;
  s+=`<rect x="840" y="400" width="200" height="500" fill="#8a5a3a"/><rect x="852" y="412" width="176" height="488" fill="#9a6a48"/><circle cx="870" cy="660" r="9" fill="#e0b04a"/>`;
  s+=`<rect x="440" y="330" width="320" height="14" fill="#7a5a40"/><rect x="460" y="270" width="40" height="60" fill="#3a5a8a"/><rect x="510" y="290" width="30" height="40" fill="#c23a3a"/>`;
  s+=`<rect x="560" y="250" width="110" height="80" fill="#2a2e3a"/><rect x="568" y="258" width="94" height="64" fill="#6a7a5a"/><text x="615" y="300" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="14" fill="#e9e4d8">UME</text>`;
  return s}

// ---------- items for the grab bag ----------
const ITEMS={
  water:`<rect x="-22" y="-80" width="44" height="100" rx="12" fill="#6cc6ff" opacity=".85"/><rect x="-12" y="-96" width="24" height="18" rx="4" fill="#2a6aa8"/><rect x="-22" y="-40" width="44" height="26" fill="#fff" opacity=".6"/>`,
  kit:`<rect x="-50" y="-70" width="100" height="80" rx="10" fill="#f6f2ea"/><rect x="-10" y="-58" width="20" height="56" fill="#d23a3a"/><rect x="-28" y="-40" width="56" height="20" fill="#d23a3a"/><rect x="-20" y="-84" width="40" height="16" rx="6" fill="none" stroke="#b8b0a4" stroke-width="6"/>`,
  torch:`<rect x="-14" y="-86" width="28" height="90" rx="8" fill="#2a2e3a"/><path d="M-24,-86 L24,-86 L18,-110 L-18,-110Z" fill="#3a3e4a"/><ellipse cx="0" cy="-110" rx="18" ry="6" fill="#ffe7a0"/>`,
  radio:`<rect x="-56" y="-70" width="112" height="76" rx="10" fill="#5a6040"/><circle cx="-22" cy="-32" r="22" fill="#2a2e22"/><rect x="10" y="-56" width="34" height="16" fill="#cfe6a8"/><line x1="40" y1="-70" x2="70" y2="-130" stroke="#2a2e22" stroke-width="5"/>`};
function bagOpen(x,y,s,fill=0){return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-110,0 L110,0 L96,-170 Q0,-190 -96,-170Z" fill="${PACK}"/><path d="M-96,-170 Q0,-${200+fill*10} 96,-170 L80,-150 Q0,-165 -80,-150Z" fill="#3a3e2a"/><rect x="-60" y="-110" width="120" height="70" rx="10" fill="#4a5034"/><path d="M-80,-170 Q-100,-240 -40,-250" stroke="#3a3e2a" stroke-width="10" fill="none"/></g>`}

// ---------- water ----------
function waveWall(t,base,h,o={}){ // the incoming wave: a grey wall with a churning white crest. base = its foot, h = height
  if(h<=0) return '';
  const id=uid('ww');let top='';
  for(let x=-600;x<=1680;x+=30){const y=base-h*(1+.06*Math.sin(x*.012+t*3)+.03*Math.sin(x*.031-t*5));top+=(x===-600?'M':'L')+x+','+y.toFixed(1)+' '}
  let s=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.top||'#5f7482'}"/><stop offset=".6" stop-color="${o.mid||'#3c4f5c'}"/><stop offset="1" stop-color="${o.bot||'#2e3d48'}"/></linearGradient></defs>`;
  s+=`<path d="${top} L1680,${base+4} L-600,${base+4}Z" fill="url(#${id})"/>`;
  for(let i=0;i<9;i++){const x=((i*170+t*40)%1900)-400;s+=`<path d="M${x},${base-h*.75} q60,${h*.2} 40,${h*.6}" stroke="#8aa0ac" stroke-width="${Math.max(2,h*.03).toFixed(1)}" fill="none" opacity=".35"/>`}
  // crest foam + spray
  s+=`<path d="${top}" stroke="#eef4f6" stroke-width="${Math.max(5,h*.09).toFixed(1)}" fill="none" stroke-linejoin="round"/>`;
  const r=rng(o.seed||9);for(let i=0;i<46;i++){const x=-500+r()*2100, p=((t*.9+r())%1), y=base-h*(1.05+.06*Math.sin(x*.012+t*3))-p*h*.35, rr=(3+r()*8)*Math.max(.5,h/220);
    s+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="#f4f8fa" opacity="${(.8*(1-p)).toFixed(2)}"/>`}
  return s}
function flood(t,y,o={}){ // muddy flood water with ripples and debris; y = water level
  const col=o.col||'#6a6e62';
  let s=`<rect x="-600" y="${y}" width="2280" height="2000" fill="${col}"/>`;
  let p=`M-600,${y}`;for(let x=-600;x<=1680;x+=40) p+=` L${x},${(y+Math.sin(x*.025+t*(o.rough?6:2))*(o.rough?10:3)).toFixed(1)}`;
  s+=`<path d="${p}" stroke="${o.foam||'#e6ece8'}" stroke-width="${o.rough?12:6}" fill="none" opacity=".9"/>`;
  const r=rng(o.seed||21);
  for(let i=0;i<24;i++){const x=((r()*1800+t*(o.flow??30)*(.6+r()*.8))%1900)-400, yy=y+20+r()*600;s+=`<path d="M${x.toFixed(0)},${yy.toFixed(0)} q24,-6 48,0" stroke="#9aa094" stroke-width="4" fill="none" opacity=".5"/>`}
  if(o.debris){for(let i=0;i<8;i++){const x=((r()*1700+t*(o.flow??30)*.8)%1900)-400, yy=y+30+r()*400+Math.sin(t*2+i)*4, a=Math.sin(t+i)*10+r()*60;
    s+=i%3===0?`<g transform="translate(${x.toFixed(0)},${yy.toFixed(0)}) rotate(${a.toFixed(0)})"><rect x="-70" y="-8" width="140" height="16" rx="4" fill="#7a5a3a"/></g>`
      :i%3===1?`<circle cx="${x.toFixed(0)}" cy="${yy.toFixed(0)}" r="18" fill="none" stroke="#1d1d22" stroke-width="10"/>`
      :`<g transform="translate(${x.toFixed(0)},${yy.toFixed(0)}) rotate(${(a*.3).toFixed(0)}) scale(.5)"><path d="M-160,-28 L-160,-74 Q-150,-90 -118,-94 L-78,-134 L62,-142 L132,-94 Q160,-90 166,-68 L166,-28Z" fill="${['#c23a3a','#3a5a8a','#e9e4d8'][i%3]}"/></g>`}}
  return s}
function splash(x,y,t,k,sc=1){ // a burst of spray where the water hits a wall (k 0..1 progress)
  if(k<=0||k>=1) return '';let s='';const r=rng(Math.floor(x));
  for(let i=0;i<18;i++){const a=-Math.PI*(.15+r()*.7), v=(180+r()*260)*sc, px=x+Math.cos(a)*v*k, py=y+Math.sin(a)*v*k+300*k*k*sc;
    s+=`<circle cx="${px.toFixed(0)}" cy="${py.toFixed(0)}" r="${((6+r()*16)*sc*(1-k*.5)).toFixed(1)}" fill="#eef4f6" opacity="${(1-k).toFixed(2)}"/>`}
  return s}
function siren(x,y,t,on){ // a warning siren on a pole, with sound rings
  let s=`<rect x="${x-5}" y="${y}" width="10" height="200" fill="#3a3e4a"/><path d="M${x-30},${y} L${x+30},${y} L${x+20},${y-40} L${x-20},${y-40}Z" fill="#9aa3ad"/><circle cx="${x}" cy="${y-20}" r="10" fill="${on&&Math.floor(t*4)%2?'#ff4a4a':'#7a2a2a'}"/>`;
  if(on) s+=soundArcs(x+40,y-20,t,'#fff',1)+soundArcs(x-40,y-20,t,'#fff',-1);
  return s}
function roofEdge(y,col='#9a948a'){return `<rect x="-600" y="${y}" width="2280" height="900" fill="${col}"/><rect x="-600" y="${y-40}" width="2280" height="44" fill="${mix(col,'#ffffff',.15)}"/><rect x="-600" y="${y}" width="2280" height="8" fill="#000" opacity=".15"/>`}

// ---------- Duque, the dobermann ----------
const DOB={body:'#1f1c22',tan:'#b9662c',ear:'#3a2a2e'};
function doberman(x,y,s,t,o={}){ // side view facing right (o.dir -1 faces left). o.walk / o.run gait phase, o.alert 0..1, o.bark, o.head (deg, + = nose up)
  const dir=o.dir||1, run=o.run!=null, ph=run?o.run:o.walk, B=DOB.body, T=DOB.tan, far=mix(B,'#000000',.4);
  const bob=ph==null?Math.sin(t*2.4)*1.6:(run?-Math.abs(Math.sin(ph))*18:-Math.abs(Math.sin(ph*2))*4);
  const pitch=run?Math.sin(ph)*5:0, alert=o.alert??.6;
  const leg=(hx,hy,a1,a2,L1,L2,w,col)=>{const kx=hx+Math.sin(rad(a1))*L1, ky=hy+Math.cos(rad(a1))*L1, fx=kx+Math.sin(rad(a2))*L2, fy=ky+Math.cos(rad(a2))*L2;
    return `<path d="M${hx},${hy} L${kx.toFixed(1)},${ky.toFixed(1)} L${fx.toFixed(1)},${fy.toFixed(1)}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><line x1="${(kx*.3+fx*.7).toFixed(1)}" y1="${(ky*.3+fy*.7).toFixed(1)}" x2="${fx.toFixed(1)}" y2="${fy.toFixed(1)}" stroke="${col===B?T:mix(T,'#000000',.4)}" stroke-width="${(w*.8).toFixed(1)}" stroke-linecap="round"/><ellipse cx="${(fx+7).toFixed(1)}" cy="${(fy+3).toFixed(1)}" rx="15" ry="8" fill="${col===B?T:mix(T,'#000000',.4)}"/>`};
  const g4=(i,front,col)=>{ // gait per leg
    const off=run?[0,.6,Math.PI,Math.PI+.6][i]:[0,Math.PI,Math.PI,0][i], amp=run?40:18;
    const sw=ph==null?0:Math.sin(ph+off), lift=ph==null?0:Math.max(0,Math.cos(ph+off));
    return front?leg(i===0?92:112,-150,sw*amp,sw*amp-lift*(run?60:34),78,80,22,col):leg(i===2?-118:-98,-158,26+sw*amp,-32+sw*amp*.7-lift*(run?30:16),82,96,24,col)};
  let g=`<ellipse cx="0" cy="6" rx="${run?190:170}" ry="16" fill="#000" opacity=".2"/>`;
  let b=g4(1,true,far)+g4(3,false,far);
  // tail: medium, carried up a little, wagging
  b+=`<path d="M-150,-206 Q-190,-214 -212,-246" stroke="${B}" stroke-width="13" fill="none" stroke-linecap="round" transform="rotate(${(Math.sin(t*(o.wag?14:4))*(o.wag?18:6)).toFixed(1)} -150 -206)"/>`;
  b+=`<path d="M-154,-190 C-156,-228 -112,-236 -60,-230 L60,-234 C112,-238 150,-226 160,-188 C168,-146 140,-116 104,-126 C62,-138 4,-146 -60,-146 C-112,-146 -152,-156 -154,-190Z" fill="${B}"/>`;
  b+=`<path d="M-120,-226 C-60,-238 60,-240 140,-224" stroke="#fff" stroke-opacity=".08" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  b+=`<ellipse cx="150" cy="-160" rx="17" ry="24" fill="${T}"/>`;
  // neck + collar
  b+=`<path d="M56,-232 L124,-332 L196,-306 L168,-172 C150,-150 104,-176 56,-232Z" fill="${B}"/>`;
  b+=`<path d="M112,-280 L178,-252" stroke="${o.collar||'#8a2a2a'}" stroke-width="16" stroke-linecap="round"/><circle cx="160" cy="-246" r="7" fill="#c9c2b0"/>`;
  b+=g4(0,true,B)+g4(2,false,B);
  // head
  const ha=(o.head??0)+alert*6+(ph==null?Math.sin(t*1.4)*2:Math.sin(ph*2)*2);
  let h=`<ellipse cx="8" cy="0" rx="46" ry="36" fill="${B}"/>`;
  const earA=lerp(-26,0,alert)+Math.sin(t*3)*2;
  h+=`<g transform="rotate(${earA.toFixed(1)} 4 -24)"><path d="M-16,-22 L0,-112 L26,-26Z" fill="${B}"/><path d="M-6,-34 L1,-90 L16,-34Z" fill="${DOB.ear}"/></g>`;
  if(o.bark){h+=`<path d="M30,-22 L120,-4 Q130,4 122,14 L40,18Z" fill="${B}"/><path d="M40,18 L118,14 L60,24Z" fill="#5a1a22"/><g transform="rotate(16 40 22)"><path d="M40,22 L112,26 Q108,40 96,40 L44,38Z" fill="${T}"/><path d="M90,26 L94,34 L98,26Z" fill="#fff"/></g>`}
  else h+=`<path d="M30,-22 L120,-4 Q132,6 122,20 L36,34Z" fill="${B}"/><path d="M46,22 L118,16 Q114,30 98,32 L48,36Z" fill="${T}"/>`;
  h+=`<circle cx="40" cy="20" r="14" fill="${T}"/><circle cx="22" cy="-24" r="8" fill="${T}"/>`;
  const blink=((t+(o.seed||0))%4.3)<.12;
  h+=blink?`<path d="M18,-10 L32,-10" stroke="#120e10" stroke-width="4" stroke-linecap="round"/>`:`<circle cx="25" cy="-10" r="7" fill="#2a160c"/><circle cx="27" cy="-12" r="2.4" fill="#fff"/>`;
  h+=`<ellipse cx="124" cy="4" rx="11" ry="9" fill="#0c0b0e"/><circle cx="121" cy="1" r="3" fill="#fff" opacity=".35"/>`;
  b=`<g transform="scale(.86,1)">${b}</g><g transform="translate(144,-326) rotate(${(-ha).toFixed(1)})">${h}</g>`;
  g+=`<g transform="translate(0,${bob.toFixed(1)}) rotate(${pitch.toFixed(2)} 0 -170)">${b}</g>`;
  return `<g transform="translate(${x},${y}) scale(${dir*s},${s})">${g}</g>`}
const dobCollar=(x,y,s,dir=1)=>[x+dir*138*s,y-246*s];
function leash(a,b,slack=40,col='#7a3a2a'){const mx=(a[0]+b[0])/2, my=Math.max(a[1],b[1])+slack;return `<path d="M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"/>`}
const handAt=(x,y,s,loc)=>[x+loc[0]*s,y+loc[1]*s];

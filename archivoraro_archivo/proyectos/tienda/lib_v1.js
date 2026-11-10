// ---------- helpers ----------
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const prog=(t,a,b)=>clamp((t-a)/(b-a));
const eOut=t=>1-Math.pow(1-t,3);
const eIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const eBack=t=>{const c1=1.9,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)};
const rad=d=>d*Math.PI/180;
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hex2rgb(h){h=h.replace('#','');return[0,2,4].map(i=>parseInt(h.substr(i,2),16))}
function mix(a,b,t){const A=hex2rgb(a),B=hex2rgb(b);return'#'+A.map((v,i)=>Math.round(lerp(v,B[i],t)).toString(16).padStart(2,'0')).join('')}
const pad2=n=>String(n).padStart(2,'0');

const INK='#2a2233', YEL='#e8c547', PINK='#ff3e6c', GREEN='#45e07e', BLUE='#6cc6ff';
const ACC={y:'#f7d23e',p:'#ff3e6c',g:'#45e07e',b:'#6cc6ff'};
const MONO='JetBrains Mono';

// ---------- character ----------
function eyesSvg(type,look){
  if(type==='closed') return [-36,36].map(ex=>`<path d="M${ex-20},6 Q${ex},20 ${ex+20},6" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('');
  let s='';
  if(type==='zombie'){
    s+=`<ellipse cx="-36" cy="26" rx="24" ry="9" fill="#4b3a5a" opacity=".3"/><ellipse cx="36" cy="26" rx="24" ry="9" fill="#4b3a5a" opacity=".3"/>`;
    s+=`<circle cx="-36" cy="6" r="25" fill="#f4f1d8" stroke="${INK}" stroke-width="7"/><circle cx="36" cy="6" r="22" fill="#f4f1d8" stroke="${INK}" stroke-width="7"/>`;
    s+=`<circle cx="-42" cy="2" r="5" fill="${INK}"/><circle cx="42" cy="12" r="5" fill="${INK}"/>`;
    return s;
  }
  if(type==='blind'){
    for(const ex of [-36,36]) s+=`<circle cx="${ex}" cy="6" r="25" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="${ex+look[0]*.3}" cy="${6+look[1]*.3}" r="12.5" fill="#cdd5e5" stroke="#b4bed2" stroke-width="2"/>`;
    return s;
  }
  for(const ex of [-36,36]){
    s+=`<circle cx="${ex}" cy="6" r="25" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
    const pr=type==='wide'?7.5:11;
    s+=`<circle cx="${ex+look[0]}" cy="${6+look[1]}" r="${pr}" fill="${INK}"/>`;
    s+=`<circle cx="${ex+look[0]+3.5}" cy="${6+look[1]-4}" r="3.2" fill="#fff"/>`;
  }
  return s;
}
function hairSvg(hs,col,back){
  if(back&&hs==='pigtails') return `<ellipse cx="-118" cy="46" rx="30" ry="56" fill="${col}" transform="rotate(18 -118 46)"/><ellipse cx="118" cy="46" rx="30" ry="56" fill="${col}" transform="rotate(-18 118 46)"/><circle cx="-100" cy="-4" r="12" fill="#ff6fa0"/><circle cx="100" cy="-4" r="12" fill="#ff6fa0"/>`;
  if(back) return hs==='long'?`<path d="M-102,0 C-112,-96 112,-96 102,0 L108,150 Q0,170 -108,150Z" fill="${col}"/>`:'';
  switch(hs){
    case 'messy': return `<path d="M-96,10 C-106,-62 -60,-110 0,-110 C64,-110 106,-64 96,10 L86,-16 L70,-38 L54,-24 L36,-48 L16,-30 L-4,-52 L-24,-32 L-44,-50 L-60,-28 L-80,-34Z" fill="${col}"/>
      <path d="M-20,-108 L-6,-132 L4,-108Z M8,-108 L30,-126 L28,-102Z" fill="${col}"/>`;
    case 'short': return `<path d="M-94,6 C-100,-72 -50,-104 0,-104 C56,-104 100,-72 94,6 L86,-26 C60,-48 -60,-48 -86,-26Z" fill="${col}"/>`;
    case 'pigtails':
    case 'long': return `<path d="M-98,4 C-102,-80 -42,-110 0,-108 C46,-110 102,-80 98,4 C84,-38 34,-60 2,-60 C-30,-60 -82,-40 -98,4Z" fill="${col}"/>`;
    case 'bun': return `<circle cx="0" cy="-116" r="36" fill="${col}"/><path d="M-94,6 C-100,-74 -50,-104 0,-104 C56,-104 100,-74 94,6 L86,-30 C50,-58 -50,-58 -86,-30Z" fill="${col}"/>`;
    case 'bald': return `<path d="M-94,0 C-96,-30 -88,-40 -80,-44 L-78,-6Z M94,0 C96,-30 88,-40 80,-44 L78,-6Z" fill="${col}"/>`;
  }
  return '';
}
function person(o){
  const d=Object.assign({x:0,y:0,s:1,rot:0,skin:'#f6cfae',top:'#d9493f',topD:'#a8352f',pants:'#2c3354',shoes:'#1b1d2b',
    hair:'#3a2a26',hs:'short',eyes:'open',look:[0,0],mouth:'line',arms:'down',walk:null,hood:false,strings:false,pocket:false,
    brows:null,op:1,tilt:0,hat:null,hoodUp:false,mask:false,lashes:false,glasses:null,cane:false,mopen:null,beard:null,overalls:null,backpack:null,aL:null,aR:null,handle:null,bucket:false,flash:null},o);
  // body proportions: tall = ~4 heads high (adults), default = the original chibi build (kids)
  const TB=d.tall?{S:-548,H:-306,arm:205,leg:42}:{S:-322,H:-128,arm:140,leg:46};
  const Sy=TB.S, Hy=TB.H, SHy=Sy+24, HIP=Hy-22, ARM=TB.arm;
  const ph=d.walk, sw=ph==null?0:Math.sin(ph);
  const bob=ph==null?0:-Math.abs(Math.cos(ph))*7;
  const armC=mix(d.top,d.topD,.35);
  const pants=d.overalls||d.pants;
  let legs='';
  const legDx=[22*sw,-22*sw], lift=ph==null?[0,0]:[Math.max(0,Math.cos(ph))*12,Math.max(0,-Math.cos(ph))*12];
  [-1,1].forEach((side,i)=>{
    const fx=side*28+legDx[i], fy=-30-lift[i];
    legs+=`<line x1="${side*26}" y1="${HIP}" x2="${fx}" y2="${fy}" stroke="${pants}" stroke-width="${TB.leg}" stroke-linecap="round"/>`;
    legs+=`<ellipse cx="${fx+side*4}" cy="${fy+12}" rx="31" ry="16" fill="${d.shoes}"/>`;
  });
  let back='';
  if(d.backpack) back=`<rect x="-92" y="${Sy-18}" width="184" height="${Hy-Sy-4}" rx="30" fill="${d.backpack}"/>`;
  let torso=`<path d="M-72,${Sy} Q0,${Sy-14} 72,${Sy} Q98,${Sy+6} 102,${Sy+38} L106,${Hy-24} Q106,${Hy} 84,${Hy} L-84,${Hy} Q-106,${Hy} -106,${Hy-24} L-102,${Sy+38} Q-98,${Sy+6} -72,${Sy}Z" fill="${d.top}"/>`;
  torso+=`<rect x="-106" y="${Hy-20}" width="212" height="20" rx="10" fill="${d.topD}"/>`;
  if(d.pocket) torso+=`<path d="M-56,${Hy-98} L56,${Hy-98} L70,${Hy-34} L-70,${Hy-34}Z" fill="${d.topD}" opacity=".55"/>`;
  if(d.strings) torso+=`<path d="M-18,${Sy+10} L-22,${Sy+60} M18,${Sy+10} L22,${Sy+60}" stroke="#f1e6dc" stroke-width="6" stroke-linecap="round"/>`;
  if(!d.hood) torso+=`<path d="M-26,${Sy-4} L0,${Sy+32} L26,${Sy-4}Z" fill="${d.skin}"/><path d="M-26,${Sy-4} L0,${Sy+32} L26,${Sy-4}Z" fill="#000" opacity=".1"/>`;
  if(d.overalls){
    const ov=d.overalls;
    torso+=`<rect x="-106" y="${Hy-48}" width="212" height="50" rx="12" fill="${ov}"/><path d="M-58,${Sy+50} L58,${Sy+50} L62,${Hy-42} L-62,${Hy-42}Z" fill="${ov}"/>`;
    torso+=`<path d="M-50,${Sy+54} L-64,${Sy} M50,${Sy+54} L64,${Sy}" stroke="${ov}" stroke-width="18" stroke-linecap="round"/>`;
    torso+=`<circle cx="-46" cy="${Sy+62}" r="7" fill="#f1c84b"/><circle cx="46" cy="${Sy+62}" r="7" fill="#f1c84b"/><rect x="-30" y="${Sy+80}" width="60" height="42" rx="6" fill="#000" opacity=".13"/>`;
  }
  if(d.backpack) torso+=`<path d="M-62,${Sy} L-70,${Hy-72} M62,${Sy} L70,${Hy-72}" stroke="${mix(d.backpack,'#000000',.25)}" stroke-width="16" stroke-linecap="round"/>`;
  let arms='', front='';
  const hand=(x,y)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="21" fill="${d.skin}"/>`;
  const limb=pts=>`<polyline points="${pts}" stroke="${armC}" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(d.handle){
    const [hx,hy]=d.handle;
    // hands raised above the shoulders (e.g. covering the mouth) must be drawn over the face
    const hs_=(hy<SHy-40)?limb(`-84,${SHy} -126,${SHy+40} ${hx-16},${hy+6}`)+limb(`84,${SHy} 126,${SHy+40} ${hx+16},${hy+6}`)+hand(hx-16,hy)+hand(hx+16,hy)
      :limb(`-84,${SHy} -40,${SHy+88} ${hx-14},${hy}`)+limb(`84,${SHy} ${(84+hx)/2+30},${(SHy+hy)/2+30} ${hx+14},${hy}`)+hand(hx-14,hy)+hand(hx+14,hy);
    if(hy<SHy-40) front+=hs_; else arms+=hs_;
  } else if(d.aL!=null||d.arms==='down'){
    const aL=d.aL!=null?d.aL:12+(ph==null?0:sw*8), aR=d.aR!=null?d.aR:12-(ph==null?0:sw*8);
    for(const [side,a] of [[-1,aL],[1,aR]]){
      const sx=side*84, ex=sx+side*ARM*Math.sin(rad(a)), ey=SHy+ARM*Math.cos(rad(a));
      if(side===1&&d.cane) arms+=`<line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${(ex+90).toFixed(1)}" y2="-4" stroke="#f4f4f4" stroke-width="9" stroke-linecap="round"/><line x1="${(ex+78).toFixed(1)}" y1="${(-4-(4-ey)*.12).toFixed(1)}" x2="${(ex+90).toFixed(1)}" y2="-4" stroke="#e2453b" stroke-width="10" stroke-linecap="round"/>`;
      arms+=limb(`${sx},${SHy} ${ex.toFixed(1)},${ey.toFixed(1)}`)+hand(ex,ey+(a<60?10:0));
      if(side===-1&&d.bucket) arms+=`<path d="M${ex-30},${ey+22} L${ex+30},${ey+22} L${ex+24},${ey+86} L${ex-24},${ey+86}Z" fill="#9aa3ad"/><path d="M${ex-30},${ey+22} Q${ex},${ey-14} ${ex+30},${ey+22}" stroke="#6d7680" stroke-width="5" fill="none"/>`;
      if(side===1&&d.flash){
        const fx=ex+side*10*Math.sin(rad(a)), fy=ey+10*Math.cos(rad(a));
        front+=`<g transform="translate(${fx.toFixed(1)},${fy.toFixed(1)}) rotate(${d.flash.dir})"><polygon points="0,-10 ${d.flash.len||700},-${d.flash.w||170} ${d.flash.len||700},${d.flash.w||170} 0,10" fill="url(#beam)"/><rect x="-26" y="-12" width="40" height="24" rx="6" fill="#3a3f48"/></g>`;
      }
    }
  }
  let h='';
  h+=`<rect x="-18" y="62" width="36" height="40" fill="${d.skin}"/><rect x="-18" y="62" width="36" height="40" fill="#000" opacity=".13"/>`;
  h+=hairSvg(d.hs,d.hair,true);
  h+=`<circle cx="-90" cy="12" r="17" fill="${d.skin}"/><circle cx="90" cy="12" r="17" fill="${d.skin}"/>`;
  h+=`<circle cx="0" cy="0" r="92" fill="${d.skin}"/>`;
  h+=hairSvg(d.hs,d.hair,false);
  h+=`<ellipse cx="-60" cy="40" rx="16" ry="10" fill="#f08f8f" opacity=".5"/><ellipse cx="60" cy="40" rx="16" ry="10" fill="#f08f8f" opacity=".5"/>`;
  if(d.beard) h+=`<path d="M-88,16 C-88,98 -42,116 0,116 C42,116 88,98 88,16 C72,54 40,76 0,76 C-40,76 -72,54 -88,16Z" fill="${d.beard}"/>
    <path d="M-32,46 Q-14,34 0,43 Q14,34 32,46 Q14,54 0,49 Q-14,54 -32,46Z" fill="${d.beard}"/>`;
  if(d.hat==='straw') h+=`<path d="M-76,-64 L-64,-132 Q0,-146 64,-132 L76,-64Z" fill="#eec36c"/><rect x="-71" y="-102" width="142" height="18" fill="#b5482f"/>
    <ellipse cx="0" cy="-62" rx="152" ry="26" fill="#e2b257"/><path d="M-120,-60 Q0,-46 120,-60" stroke="#c99a45" stroke-width="4" fill="none"/>`;
  if(d.hoodUp) h+=`<path d="M-120,70 C-132,-92 -66,-142 0,-142 C66,-142 132,-92 120,70 L100,92 C110,-40 64,-110 0,-110 C-64,-110 -110,-40 -100,92Z" fill="${d.top}"/><path d="M-100,92 C-110,-40 -64,-110 0,-110 C64,-110 110,-40 100,92" fill="none" stroke="${d.topD}" stroke-width="7"/>`;
  h+=eyesSvg(d.eyes,d.look);
  if(d.lashes&&d.eyes!=='closed') h+=`<path d="M-58,-10 L-70,-20 M-50,-17 L-58,-29 M58,-10 L70,-20 M50,-17 L58,-29" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  if(d.glasses==='sun') h+=`<g opacity="${d.glassesOp??1}" transform="translate(0,${d.glassesY??0})"><rect x="-70" y="-22" width="64" height="50" rx="16" fill="#15161f"/><rect x="6" y="-22" width="64" height="50" rx="16" fill="#15161f"/><path d="M-8,-8 Q0,-14 8,-8" stroke="#15161f" stroke-width="7" fill="none"/><path d="M-70,-12 L-92,-6 M70,-12 L92,-6" stroke="#15161f" stroke-width="7"/><path d="M-58,-12 L-40,-12 M18,-12 L36,-12" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/></g>`;
  if(d.brows==='worried') h+=`<path d="M-56,-28 L-20,-38 M20,-38 L56,-28" stroke="${d.hair}" stroke-width="7" stroke-linecap="round"/>`;
  if(d.brows==='up') h+=`<path d="M-54,-38 Q-36,-48 -18,-40 M18,-40 Q36,-48 54,-38" stroke="${d.hair}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  if(d.brows==='angry') h+=`<path d="M-56,-38 L-20,-28 M20,-28 L56,-38" stroke="${d.hair}" stroke-width="7" stroke-linecap="round"/>`;
  h+=`<path d="M-3,22 Q7,30 -2,37" stroke="#000" stroke-opacity=".18" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const M={line:`<path d="M-12,58 L12,58" stroke="#6b2f35" stroke-width="6" stroke-linecap="round"/>`,
    o:`<ellipse cx="0" cy="60" rx="10" ry="13" fill="#6b2f35"/>`,
    smile:`<path d="M-16,52 Q0,66 16,52" stroke="#6b2f35" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    jag:`<path d="M-22,48 L22,48 L17,70 L-17,70Z" fill="#3a1d22"/><path d="M-15,48 L-11,57 L-7,48Z M5,48 L9,57 L13,48Z" fill="#fff"/>`,
    grin:`<path d="M-46,40 Q0,92 46,40 Q0,58 -46,40Z" fill="#5a2430"/><path d="M-38,46 Q0,60 38,46" stroke="#fff" stroke-width="7" fill="none"/>`,
    none:''};
  h+=d.mopen!=null?`<ellipse cx="0" cy="${58+d.mopen*6}" rx="${(10+d.mopen*6).toFixed(1)}" ry="${(2.5+d.mopen*15).toFixed(1)}" fill="#5a2430"/>`:(M[d.mouth]||'');
  if(d.mask) h+=`<path d="M-76,12 Q0,2 76,12 L68,72 Q0,100 -68,72Z" fill="#d5e6f0"/><path d="M-60,32 Q0,24 60,32 M-62,52 Q0,46 62,52" stroke="#b4cad8" stroke-width="4" fill="none"/><path d="M-76,16 L-94,6 M76,16 L94,6" stroke="#d5e6f0" stroke-width="5"/>`;
  return `<g transform="translate(${d.x.toFixed(1)},${d.y.toFixed(1)}) rotate(${d.rot}) scale(${d.s})" opacity="${d.op}">
    <g transform="translate(0,${bob})">${back}${legs}${torso}${arms}
    <g transform="translate(0,${Sy-90}) rotate(${d.tilt})">${h}</g>${front}</g></g>`;
}
const FARMER={skin:'#f3c7a1',top:'#d8574a',topD:'#a63d33',hs:'short',hair:'#5a3a24',hat:'straw',beard:'#6b4428',overalls:'#3f6fb5'};
const ZOMBIE={skin:'#a8c48f',top:'#6b7a5a',topD:'#4b563f',pants:'#3f4636',hs:'messy',hair:'#3b3f2a',eyes:'zombie',mouth:'jag',aL:100,aR:95};
const NEIGHBOR={skin:'#e9b48e',top:'#4f7a9a',topD:'#3a5a73',pants:'#4a3d33',hs:'bald',hair:'#8a7f76',backpack:'#7a5a3a',brows:'worried',mouth:'o'};
function zombie(x,y,s,t,ph,extra={}){
  return person(Object.assign({},ZOMBIE,{x,y,s,walk:t*5+ph,tilt:-8+5*Math.sin(t*2+ph),rot:2*Math.sin(t*2.5+ph)},extra));
}

// ---------- props ----------
function dog(x,y,s,o={}){
  const {dir=1,alert=0,bark=false,t=0}=o;
  const wag=Math.sin(t*14)*(18+alert*10);
  let g=`<path d="M-72,-96 Q-112,-128 -104,-${150+alert*14}" stroke="#9a5f33" stroke-width="17" fill="none" stroke-linecap="round" transform="rotate(${wag.toFixed(1)} -72 -96)"/>`;
  for(const lx of [-52,-26,30,56]) g+=`<rect x="${lx-9}" y="-62" width="18" height="62" rx="8" fill="#9a5f33"/>`;
  g+=`<ellipse cx="0" cy="-80" rx="86" ry="44" fill="#b0703f"/><ellipse cx="-6" cy="-62" rx="52" ry="20" fill="#d9a675" opacity=".6"/>`;
  g+=`<g transform="translate(80,${-134-alert*14})"><rect x="-34" y="26" width="46" height="14" rx="7" fill="#d9493f"/>`;
  g+=`<circle cx="0" cy="0" r="46" fill="#b0703f"/><ellipse cx="38" cy="14" rx="31" ry="21" fill="#d9a675"/><circle cx="64" cy="6" r="9" fill="${INK}"/>`;
  g+=`<circle cx="10" cy="-10" r="8.5" fill="${INK}"/><circle cx="12.5" cy="-13" r="2.8" fill="#fff"/>`;
  g+=bark?`<path d="M36,28 L68,24 L50,46Z" fill="#5a2a2a"/>`:`<path d="M42,30 Q54,35 64,28" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  g+=`<ellipse cx="-22" cy="-6" rx="15" ry="31" fill="#7a4a26" transform="rotate(${lerp(18,160,alert).toFixed(1)} -22 -36)"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s*dir},${s})">${g}</g>`;
}
function goose(x,y,s,o={}){
  const {dir=1,alert=0,t=0,ph=0,honk=false}=o;
  const peck=(1-alert)*Math.max(0,Math.sin(t*3+ph));
  const hx=lerp(56+peck*26,44,alert), hy=lerp(-112+peck*84,-178,alert);
  let g=`<path d="M-10,-22 L-12,0 M12,-22 L14,0" stroke="#f08a24" stroke-width="7" stroke-linecap="round"/><ellipse cx="-14" cy="2" rx="12" ry="5" fill="#f08a24"/><ellipse cx="16" cy="2" rx="12" ry="5" fill="#f08a24"/>`;
  g+=`<path d="M-72,-56 L-96,-74 L-84,-46Z" fill="#ecece5"/><path d="M-74,-56 Q-62,-92 0,-82 Q52,-76 58,-52 Q52,-18 0,-15 Q-52,-15 -74,-56Z" fill="#f6f6f1"/><path d="M-44,-62 Q0,-78 32,-56 Q0,-40 -44,-62Z" fill="#dcdcd3"/>`;
  g+=`<path d="M40,-64 Q${((40+hx)/2+10).toFixed(1)},${((-64+hy)/2).toFixed(1)} ${hx.toFixed(1)},${hy.toFixed(1)}" stroke="#f6f6f1" stroke-width="21" fill="none" stroke-linecap="round"/>`;
  g+=`<circle cx="${hx}" cy="${hy}" r="17" fill="#f6f6f1"/><polygon points="${hx+12},${hy-5} ${hx+40},${hy+(honk?-6:1)} ${hx+12},${hy+8}" fill="#f08a24"/>`;
  if(honk) g+=`<polygon points="${hx+12},${hy+6} ${hx+36},${hy+16} ${hx+12},${hy+10}" fill="#f08a24"/>`;
  g+=`<circle cx="${hx+4}" cy="${hy-5}" r="3.8" fill="${INK}"/>`;
  return `<g transform="translate(${x},${y}) scale(${s*dir},${s})">${g}</g>`;
}
function chicken(x,y,s,t,ph,dir=1,jump=0){
  const peck=jump>0?0:Math.max(0,Math.sin(t*4+ph));
  let g=`<path d="M-6,-14 L-8,0 M6,-14 L8,0" stroke="#f0a020" stroke-width="5" stroke-linecap="round"/>`;
  g+=`<g transform="rotate(${(peck*38).toFixed(1)} 0 -14)"><path d="M-26,-44 L-44,-70 L-20,-58Z" fill="#efe6d2"/><ellipse cx="0" cy="-38" rx="31" ry="25" fill="#fbf6ea"/>`;
  g+=`<circle cx="22" cy="-62" r="15" fill="#fbf6ea"/><circle cx="16" cy="-78" r="6" fill="#e2453b"/><circle cx="24" cy="-80" r="6" fill="#e2453b"/><circle cx="31" cy="-76" r="5" fill="#e2453b"/>`;
  g+=`<polygon points="34,-65 47,-61 34,-56" fill="#f0a020"/><ellipse cx="33" cy="-51" rx="4" ry="6" fill="#e2453b"/><circle cx="25" cy="-65" r="2.8" fill="${INK}"/></g>`;
  return `<g transform="translate(${x},${y-jump}) scale(${s*dir},${s})">${g}</g>`;
}
function wheel(cx,cy,r,a){
  let w=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#22242c"/>`;
  for(let k=0;k<12;k++){const an=rad(a+k*30);w+=`<circle cx="${(cx+Math.cos(an)*(r-3)).toFixed(1)}" cy="${(cy+Math.sin(an)*(r-3)).toFixed(1)}" r="${r*.12}" fill="#16171d"/>`}
  w+=`<circle cx="${cx}" cy="${cy}" r="${r*.48}" fill="#f2c84b"/>`;
  for(let k=0;k<4;k++){const an=rad(a+k*45);w+=`<line x1="${(cx-Math.cos(an)*r*.4).toFixed(1)}" y1="${(cy-Math.sin(an)*r*.4).toFixed(1)}" x2="${(cx+Math.cos(an)*r*.4).toFixed(1)}" y2="${(cy+Math.sin(an)*r*.4).toFixed(1)}" stroke="#c99f2e" stroke-width="5"/>`}
  return w+`<circle cx="${cx}" cy="${cy}" r="${r*.13}" fill="#8a6d1d"/>`;
}
function tractor(x,y,s,o={}){
  const {dir=1,wr=0,t=0,smoke=1,driver=''}=o;
  let g=`<rect x="-92" y="-256" width="116" height="160" fill="#bfe6ff" opacity=".35"/>${driver}`;
  g+=`<path d="M-96,-96 L-96,-256 L26,-256 L26,-96" fill="none" stroke="#3f9b4b" stroke-width="14"/><rect x="-110" y="-278" width="150" height="24" rx="7" fill="#2f7a3a"/>`;
  g+=`<rect x="18" y="-162" width="146" height="84" rx="12" fill="#3f9b4b"/><rect x="152" y="-150" width="16" height="58" rx="4" fill="#2f7a3a"/><rect x="40" y="-150" width="90" height="10" rx="5" fill="#57b864"/>`;
  g+=`<rect x="-124" y="-112" width="296" height="46" rx="12" fill="#2f7a3a"/><rect x="98" y="-222" width="13" height="64" fill="#3a3f48"/>`;
  g+=wheel(-50,-70,74,wr)+wheel(120,-42,42,wr*1.7);
  for(let i=0;i<5&&smoke>0;i++){const p=(t*1.4+i/5)%1;g+=`<circle cx="${104-p*30}" cy="${-228-p*130}" r="${10+p*24}" fill="#a3a8b2" opacity="${((1-p)*.55*smoke).toFixed(2)}"/>`}
  return `<g transform="translate(${x.toFixed(1)},${y}) scale(${s*dir},${s})">${g}</g>`;
}
function house(x,y,s,lit=[0,0,0,0],porch=0){
  let g=`<rect x="92" y="-372" width="40" height="90" fill="#8a5a4a"/>`;
  g+=`<rect x="-170" y="-252" width="340" height="252" fill="#efe7d6"/><rect x="-170" y="-252" width="340" height="18" fill="#000" opacity=".06"/>`;
  g+=`<polygon points="-204,-246 0,-392 204,-246" fill="#5a5f80"/><polyline points="-204,-246 0,-392 204,-246" fill="none" stroke="#454a68" stroke-width="12" stroke-linejoin="round"/>`;
  [[-130,-214],[70,-214],[-130,-114],[70,-114]].forEach(([wx,wy],i)=>{
    g+=`<rect x="${wx-6}" y="${wy-6}" width="72" height="76" rx="4" fill="#fff"/><rect x="${wx}" y="${wy}" width="60" height="64" fill="${mix('#2c3456','#ffd76a',lit[i])}"/>`;
    g+=`<rect x="${wx+27}" y="${wy}" width="6" height="64" fill="#fff"/><rect x="${wx}" y="${wy+29}" width="60" height="6" fill="#fff"/>`;
  });
  g+=`<rect x="-34" y="-124" width="68" height="124" fill="#8a5a3a"/><circle cx="20" cy="-60" r="5" fill="#f1c84b"/>`;
  g+=`<rect x="42" y="-152" width="18" height="24" rx="4" fill="${mix('#4a4f68','#ffe9a6',porch)}"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
}
function houseGlow(x,y,s,lit=[0,0,0,0],porch=0){
  let g='';
  [[-130,-214],[70,-214],[-130,-114],[70,-114]].forEach(([wx,wy],i)=>{ if(lit[i]<=0) return;
    g+=`<rect x="${wx}" y="${wy}" width="60" height="64" fill="#ffd76a" opacity="${lit[i]}"/><rect x="${wx+27}" y="${wy}" width="6" height="64" fill="#fff" opacity="${lit[i]}"/><rect x="${wx}" y="${wy+29}" width="60" height="6" fill="#fff" opacity="${lit[i]}"/>`;
    g+=`<circle cx="${wx+30}" cy="${wy+32}" r="90" fill="url(#glowY)" opacity="${lit[i]}"/>`;});
  if(porch>0) g+=`<rect x="42" y="-152" width="18" height="24" rx="4" fill="#ffe9a6" opacity="${porch}"/><circle cx="51" cy="-140" r="120" fill="url(#glowY)" opacity="${porch}"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
}
function barn(x,y,s,o={}){
  const {loft='closed'}=o;
  let g=`<path d="M-150,0 L-150,-260 L-110,-350 L0,-395 L110,-350 L150,-260 L150,0Z" fill="#c8463d"/>`;
  for(let px=-124;px<=124;px+=31) g+=`<line x1="${px}" y1="-${px*px<12000?370:300}" x2="${px}" y2="0" stroke="#b03b33" stroke-width="3"/>`;
  g+=`<path d="M-174,-248 L-120,-362 L0,-414 L120,-362 L174,-248" fill="none" stroke="#7a2e2a" stroke-width="26" stroke-linejoin="round" stroke-linecap="round"/>`;
  g+=`<rect x="-150" y="-260" width="10" height="260" fill="#f3eee6"/><rect x="140" y="-260" width="10" height="260" fill="#f3eee6"/>`;
  g+=`<rect x="-74" y="-178" width="148" height="178" fill="#c8463d" stroke="#f3eee6" stroke-width="10"/><path d="M-74,-178 L74,0 M74,-178 L-74,0 M0,-178 L0,0" stroke="#f3eee6" stroke-width="8"/>`;
  if(loft==='open') g+=`<rect x="-44" y="-338" width="88" height="76" fill="#2a1512" stroke="#f3eee6" stroke-width="8"/><path d="M-40,-266 Q-20,-290 0,-272 Q20,-292 40,-266Z" fill="#e9c45a"/>`;
  else g+=`<rect x="-44" y="-338" width="88" height="76" fill="#c8463d" stroke="#f3eee6" stroke-width="8"/><path d="M-44,-338 L44,-262 M44,-338 L-44,-262" stroke="#f3eee6" stroke-width="6"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
}
function silo(x,y,s){
  let g=`<rect x="-56" y="-360" width="112" height="360" fill="#c5ccd4"/><rect x="-56" y="-360" width="34" height="360" fill="#fff" opacity=".25"/>`;
  for(let k=1;k<6;k++) g+=`<rect x="-56" y="${-k*60}" width="112" height="6" fill="#a9b1bb"/>`;
  g+=`<path d="M-62,-358 Q0,-450 62,-358Z" fill="#9aa4b0"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
}
function well(x,y,s){
  let g=`<rect x="-80" y="-252" width="14" height="180" fill="#8a5a3a"/><rect x="66" y="-252" width="14" height="180" fill="#8a5a3a"/>`;
  g+=`<polygon points="-108,-240 0,-312 108,-240" fill="#7a2e2a"/><line x1="-72" y1="-206" x2="72" y2="-206" stroke="#6b4a3a" stroke-width="9"/>`;
  g+=`<line x1="0" y1="-206" x2="0" y2="-150" stroke="#c9b38a" stroke-width="4"/><path d="M-18,-150 L18,-150 L14,-118 L-14,-118Z" fill="#8a6a4a"/>`;
  g+=`<rect x="-92" y="-92" width="184" height="92" rx="8" fill="#a3a9b1"/>`;
  for(let r=0;r<3;r++)for(let c=0;c<5;c++) g+=`<rect x="${-88+c*36+(r%2)*18}" y="${-86+r*30}" width="32" height="24" rx="4" fill="#b7bdc4"/>`;
  g+=`<ellipse cx="0" cy="-92" rx="96" ry="18" fill="#8d939b"/><ellipse cx="0" cy="-92" rx="74" ry="11" fill="#2a3040"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
}
function barrel(x,y,s,level){
  let g=`<rect x="-46" y="-150" width="92" height="150" rx="14" fill="#2f7fc1"/><rect x="-46" y="-112" width="92" height="9" fill="#23629a"/><rect x="-46" y="-44" width="92" height="9" fill="#23629a"/>`;
  g+=`<ellipse cx="0" cy="-150" rx="46" ry="10" fill="#3a8fd4"/><rect x="-12" y="-136" width="24" height="122" rx="6" fill="#d8f1ff"/>`;
  g+=`<rect x="-12" y="${-14-122*level}" width="24" height="${122*level}" rx="6" fill="#1b67ad"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
}
function fence(x1,x2,y,s=1){
  let g=`<rect x="${x1}" y="${y-82*s}" width="${x2-x1}" height="${11*s}" fill="#b07a4f"/><rect x="${x1}" y="${y-46*s}" width="${x2-x1}" height="${11*s}" fill="#b07a4f"/>`;
  for(let px=x1+10;px<=x2;px+=80*s) g+=`<rect x="${px-7*s}" y="${y-104*s}" width="${14*s}" height="${104*s}" rx="${3*s}" fill="#946339"/>`;
  return g;
}
function tree(x,y,s,c='#5aa651'){
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-11" y="-70" width="22" height="70" fill="#7a5235"/><circle cx="0" cy="-118" r="56" fill="${c}"/><circle cx="-40" cy="-86" r="40" fill="${c}"/><circle cx="40" cy="-86" r="40" fill="${c}"/><circle cx="-14" cy="-134" r="22" fill="#fff" opacity=".12"/></g>`;
}
function clouds(t,seed,op=1){
  const r=rng(seed);let s='';
  for(let i=0;i<4;i++){const x=((r()*1300+t*14*(.6+r()))%1400)-160,y=110+r()*300,k=.7+r()*.6;
    s+=`<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${k.toFixed(2)})" opacity="${op}"><rect x="-80" y="-20" width="170" height="40" rx="20" fill="#fff"/><circle cx="-24" cy="-26" r="36" fill="#fff"/><circle cx="26" cy="-34" r="44" fill="#fff"/></g>`;}
  return s;
}
function stars(seed,n,h,t,op=1){const r=rng(seed);let s='';for(let i=0;i<n;i++){const x=r()*1080,y=r()*h,a=(.25+.5*Math.abs(Math.sin(t*2+i)))*op;s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.5+r()*2).toFixed(1)}" fill="#fff" opacity="${a.toFixed(2)}"/>`}return s}
function hills(c1='#9fd38a',c2='#86c56f',base=0){
  return `<path d="M0,${700+base} Q180,${610+base} 360,${670+base} T720,${650+base} T1080,${640+base} L1080,1100 L0,1100Z" fill="${c1}"/>
    <path d="M0,${770+base} Q220,${700+base} 470,${750+base} T1080,${730+base} L1080,1100 L0,1100Z" fill="${c2}"/>`;
}
const SKY={morning:['#7cc8f0','#dff4ff'],noon:['#5db7ea','#c6ecff'],afternoon:['#6aa9dc','#ffe1b0'],sunset:['#3d3f8f','#ff9e5e'],dusk:['#1f2456','#6a4c8c'],night:['#0b0f2c','#1c2350']};
function sky(tod){const [a,b]=SKY[tod];return `<defs><linearGradient id="sky${tod}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="1080" height="1100" fill="url(#sky${tod})"/>`}
function sun(x,y,r,c='#ffe38a'){return `<circle cx="${x}" cy="${y}" r="${r*2.2}" fill="${c}" opacity=".18"/><circle cx="${x}" cy="${y}" r="${r*1.5}" fill="${c}" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`}
function moon(x,y){return `<circle cx="${x}" cy="${y}" r="110" fill="#f3efe0" opacity=".07"/><circle cx="${x}" cy="${y}" r="46" fill="#f3efe0"/><circle cx="${x-14}" cy="${y-8}" r="9" fill="#dcd6c2"/><circle cx="${x+12}" cy="${y+14}" r="6" fill="#dcd6c2"/>`}
// colour grading by time of day: L = landscape, C = characters (kept a bit brighter)
const TINT={afternoon:{L:[1,.94,.84],C:[1,.97,.92]},sunset:{L:[.92,.66,.62],C:[1,.84,.78]},dusk:{L:[.46,.46,.7],C:[.72,.72,.9]},night:{L:[.28,.32,.58],C:[.6,.62,.86]}};
function L(tod,c){return TINT[tod]?`<g filter="url(#fL_${tod})">${c}</g>`:c}
function C(tod,c){return TINT[tod]?`<g filter="url(#fC_${tod})">${c}</g>`:c}
function tintDefs(){let s='';for(const k in TINT)for(const w of ['L','C']){const [r,g,b]=TINT[k][w];
  s+=`<filter id="f${w}_${k}" filterUnits="userSpaceOnUse" x="-600" y="-600" width="2400" height="2600" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${r} 0 0 0 0 0 ${g} 0 0 0 0 0 ${b} 0 0 0 0 0 1 0"/></filter>`}
  return s+`<filter id="fsil" filterUnits="userSpaceOnUse" x="-600" y="-600" width="2400" height="2600"><feColorMatrix type="matrix" values="0 0 0 0 .04 0 0 0 0 .05 0 0 0 0 .1 0 0 0 1 0"/></filter>`;}
function cam(content,z=1,fx=540,fy=550,tx=540,ty=550,dx=0,dy=0){
  return `<g transform="translate(${(tx+dx).toFixed(1)},${(ty+dy).toFixed(1)}) scale(${z.toFixed(4)}) translate(${-fx},${-fy})">${content}</g>`;
}
function pill(x,y,text,bg,fg,size=24,op=1,sc=1){
  const w=text.length*size*.62+size*1.6,h=size*1.9;
  return `<g opacity="${op}" transform="translate(${x},${y}) scale(${sc})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${h/2}" fill="${bg}"/><text x="0" y="${size*.36}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="${size}" fill="${fg}" letter-spacing="2">${text}</text></g>`;
}
function tag(x,y,text,col,op=1){ // outlined annotation box like the original's labels
  const size=27,w=text.length*size*.62+34,h=48;
  return `<g opacity="${op}"><rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" fill="#11131f" fill-opacity=".86" stroke="${col}" stroke-width="2.5"/><text x="${x}" y="${y+10}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="${size}" fill="${col}" letter-spacing="2">${text}</text></g>`;
}
function brackets(cx,cy,w,h,col,L=30,sw=6){let s='';for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const X=cx+sx*w/2,Y=cy+sy*h/2;s+=`<path d="M${X},${Y-sy*L} L${X},${Y} L${X-sx*L},${Y}" fill="none" stroke="${col}" stroke-width="${sw}"/>`}return s}
function bang(x,y,txt,col,a,size=70){return a>0?`<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${size}" fill="${col}" opacity="${a.toFixed(2)}" transform="translate(${x},${y}) scale(${(.6+.4*eBack(a)).toFixed(3)}) translate(${-x},${-y})">${txt}</text>`:''}
function soundArcs(x,y,t,col,dir=1,n=3){let s='';for(let i=0;i<n;i++){const p=(t*1.6+i/n)%1;const r=20+p*70;s+=`<path d="M${x+dir*r*.5},${y-r*.8} Q${x+dir*r},${y} ${x+dir*r*.5},${y+r*.8}" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round" opacity="${(1-p).toFixed(2)}"/>`}return s}


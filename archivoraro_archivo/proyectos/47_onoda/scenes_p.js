// ================= HIROO ONODA · ¿Sabías que…? (YouTube) =================
const EVS={
  hook:B=>({years:B[0].w[9],ended:B[0].w[17]}),
  arrive:B=>({name:B[0].w[4],island:B[0].w[9],lubang:B[0].w[11]}),
  order:B=>({no:B[0].w[2]}),
  leaflets:B=>({ends:B[0].w[5],plane:B[0].w[6],drop:B[0].w[9],text:B[0].w[11]}),
  trap:B=>({read:B[0].w[1],trap:B[0].w[8]}),
  camp:B=>({}),
  rule1:B=>({order:B[0].w[7],boss:B[0].w[10]}),
  rule2:B=>({lie:B[0].w[9],letters:B[0].w[12],family:B[0].w[16]}),
  rule3:B=>({rifle:B[0].w[3],clean:B[0].w[5]}),
  years:B=>({surr:B[0].w[6],die:B[0].w[8],alone:B[0].w[13]}),
  meet:B=>({camp:B[0].w[4],appear:B[0].w[9],uniform:B[0].w[13],rifle:B[0].w[16],talk:B[1].s,boss:B[1].w[7]}),
  shop:B=>({cmd:B[0].w[5],books:B[0].w[7]}),
  read:B=>({read:B[0].w[6]}),
  salute:B=>({salute:B[0].w[1],give:B[0].w[3],works:B[0].w[6]}),
  end:B=>({him:B[0].w[10]}),
};
const S={};

// ---------- cast ----------
const ONO={skin:'#e9bf94',hs:'buzz',hair:'#15100d',hat:'cap',hatCol:'#7a6c42',top:'#8a7c4a',topD:'#6a5e34',pants:'#7a6c42',shoes:'#3a2e22',build:'slim',pocket:true,seed:81};
const ONO74={...ONO,top:'#7b714e',topD:'#5b5232',hatCol:'#686038',pants:'#6a6040',wrinkles:true,seed:82};
const TANI44={skin:'#e2b48a',hs:'short',hair:'#1a1410',hat:'cap',hatCol:'#4f4830',glasses:'round',mustache:'#1a1410',top:'#5f583c',topD:'#433e28',pants:'#4f4830',shoes:'#2a221a',badge:true,seed:91};
const TANI74={skin:'#dcae86',hs:'sidepart',hair:'#d8d4cc',glasses:'round',mustache:'#d8d4cc',wrinkles:true,top:'#e9e4d8',topD:'#c9c2b0',jacket:'#6a5a48',tie:'#3a4a6a',pants:'#4a4038',shoes:'#2a221a',seed:92};
const SUZ={skin:'#e6ba8e',hs:'long',hair:'#1a1410',stubble:true,top:'#c23a3a',topD:'#9a2a2a',pants:'#3a4a6a',shoes:'#5a4a3a',backpack:'#3a6a8a',seed:93};
const AKA={...ONO,hs:'short',build:null,pocket:false,skin:'#e2b088',seed:84};
const SHI={...ONO,build:'heavy',mustache:'#15100d',skin:'#deac80',seed:85};
const KOZ={...ONO,hs:'short',stubble:true,skin:'#ecc49a',build:null,seed:86};
const JP="'WenQuanYi Zen Hei','IPAGothic',sans-serif";

// ---------- props ----------
const o8Rifle=(x1,y1,x2,y2,o={})=>{ // stock end (x1,y1) → muzzle (x2,y2)
  const L=Math.hypot(x2-x1,y2-y1), a=Math.atan2(y2-y1,x2-x1)*180/Math.PI, w=o.w||1;
  let g=`<path d="M0,${-13*w} L${L*.3},${-7*w} L${L*.3},${7*w} L0,${15*w} Q${-6*w},0 0,${-13*w}Z" fill="#8a5a32"/>`;
  g+=`<rect x="${L*.29}" y="${-7*w}" width="${L*.13}" height="${12*w}" fill="#3a3a3e"/><path d="M${L*.36},${-6*w} L${L*.37},${-20*w}" stroke="#3a3a3e" stroke-width="${5*w}" stroke-linecap="round"/><circle cx="${L*.37}" cy="${-21*w}" r="${5*w}" fill="#3a3a3e"/>`;
  g+=`<rect x="${L*.42}" y="${-6*w}" width="${L*.38}" height="${10*w}" rx="${3*w}" fill="#7a4e2a"/>`;
  g+=`<rect x="${L*.78}" y="${-3.5*w}" width="${L*.22}" height="${6*w}" fill="#2a2a2e"/><rect x="${L*.6}" y="${-5*w}" width="${6*w}" height="${10*w}" fill="#2a2a2e"/>`;
  g+=`<path d="M${L*.33},${7*w} q${L*.03},${10*w} ${L*.07},0" stroke="#2a2a2e" stroke-width="${3*w}" fill="none"/>`;
  if(o.shine) g+=`<path d="M${L*.45},${-3*w} L${L*.95},${-1.5*w}" stroke="#fff" stroke-width="${2*w}" opacity="${o.shine.toFixed(2)}"/>`;
  return `<g transform="translate(${x1.toFixed(1)},${y1.toFixed(1)}) rotate(${a.toFixed(2)})">${g}</g>`};
const o8Sling=(x,y,s)=>o8Rifle(x+60*s,y-300*s,x+128*s,y-960*s,{w:s/.6}); // rifle on the shoulder strap (draw before the character)
const o8Patches=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-58" y="-450" width="34" height="30" fill="#9a8a5a" transform="rotate(-8 -40 -435)"/><path d="M-58,-450 l34,0 M-58,-422 l34,0" stroke="#5a5030" stroke-width="3" stroke-dasharray="5 4" transform="rotate(-8 -40 -435)"/><rect x="22" y="-360" width="30" height="26" fill="#6e6440" transform="rotate(6 37 -347)"/><path d="M-30,-160 l14,22 l8,-18" stroke="#4a4228" stroke-width="5" fill="none"/></g>`;
const o8Stamp=(x,y,txt,a,rot=-6,col='#d42a2a',size=64)=>{if(a<=0) return '';const k=1+1.2*Math.exp(-clamp(a)*10), w=txt.length*size*.66+60;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k.toFixed(3)})" opacity="${clamp(a*3).toFixed(2)}"><rect x="${-w/2}" y="${-size*.8}" width="${w}" height="${size*1.6}" rx="10" fill="none" stroke="${col}" stroke-width="10"/><text x="0" y="${size*.35}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${size}" fill="${col}" letter-spacing="4">${txt}</text></g>`};
const o8Leaf=(x,y,s,rot)=>`<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s})"><rect x="-50" y="-34" width="100" height="68" fill="#f3eee2"/><rect x="-38" y="-24" width="40" height="10" fill="#c23a3a"/><rect x="-38" y="-6" width="76" height="5" fill="#7a7468"/><rect x="-38" y="4" width="70" height="5" fill="#7a7468"/><rect x="-38" y="14" width="56" height="5" fill="#7a7468"/></g>`;
const o8LeafBig=(cx,cy,k,o={})=>{if(k<=0) return '';
  let g=`<rect x="-300" y="-210" width="600" height="420" fill="#f3eee2"/><rect x="-300" y="-210" width="600" height="420" fill="none" stroke="#d8cfba" stroke-width="6"/>`;
  g+=`<text x="0" y="-80" text-anchor="middle" font-family="${JP}" font-size="110" fill="#c23a3a">終戦</text>`;
  g+=`<text x="0" y="20" text-anchor="middle" font-family="Inter" font-weight="900" font-size="48" fill="#2a2620">LA GUERRA HA</text><text x="0" y="78" text-anchor="middle" font-family="Inter" font-weight="900" font-size="48" fill="#2a2620">TERMINADO</text>`;
  g+=`<text x="0" y="140" text-anchor="middle" font-family="Inter" font-weight="700" font-size="26" fill="#6a6458">RENDÍOS Y VOLVED A CASA · AGOSTO 1945</text>`;
  if(o.stamp) g+=o8Stamp(0,40,o.stampTxt||'MENTIRA',o.stamp,-10);
  return `<g transform="translate(${cx},${cy}) rotate(${o.rot??-3}) scale(${(eBack(clamp(k))*(o.s||1)).toFixed(3)})">${g}</g>`};
const o8Letter=(cx,cy,k,o={})=>{if(k<=0) return '';
  let g=`<rect x="-310" y="-250" width="620" height="500" fill="#efe6cf"/><rect x="-310" y="-250" width="620" height="500" fill="none" stroke="#cdbf9e" stroke-width="6"/>`;
  for(let i=0;i<7;i++) g+=`<path d="M40,${-150+i*48} q60,${-6+i%2*8} 120,0 t110,0" stroke="#3a3428" stroke-width="5" fill="none" opacity=".7"/>`;
  g+=`<text x="150" y="-190" text-anchor="middle" font-family="${JP}" font-size="44" fill="#3a3428">寛郎へ</text>`;
  // the family photo, pinned to the letter
  g+=`<g transform="rotate(-5)"><rect x="-280" y="-200" width="290" height="330" fill="#fbf8f0"/><rect x="-262" y="-182" width="254" height="250" fill="#b8ab90"/>`;
  g+=`<clipPath id="o8ph"><rect x="-262" y="-182" width="254" height="250"/></clipPath><g clip-path="url(#o8ph)">${A({skin:'#e2b48a',hs:'sidepart',hair:'#c9c2b0',glasses:'round',wrinkles:true,top:'#3a3a40',topD:'#2a2a30',jacket:'#3a3a40',x:-190,y:160,s:.3,still:true,mouth:'smile'})}${A({skin:'#e9bf94',hs:'short',hair:'#1a1410',top:'#e9e4d8',topD:'#c9c2b0',jacket:'#4a4a52',x:-80,y:160,s:.3,still:true,mouth:'smile'})}</g>`;
  g+=`<rect x="-262" y="-182" width="254" height="250" fill="#a87838" opacity=".25"/><text x="-135" y="110" text-anchor="middle" font-family="Inter" font-weight="800" font-size="24" fill="#5a5040">PAPÁ Y TOSHIO</text></g>`;
  if(o.stamp) g+=o8Stamp(0,40,'¿FALSA?',o.stamp,-12);
  return `<g transform="translate(${cx},${cy}) rotate(${o.rot??2}) scale(${eBack(clamp(k)).toFixed(3)})">${g}</g>`};
const o8Plane=(x,y,s,t)=>{const p=Math.cos(t*60);
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})"><path d="M-170,0 Q-170,-26 -120,-28 L150,-18 Q190,-14 200,0 Q190,14 150,16 L-120,22 Q-170,22 -170,0Z" fill="#6a7a6a"/><path d="M-60,-6 L40,-6 L90,-90 L50,-90Z" fill="#5a6a5a"/><path d="M-60,8 L40,8 L80,70 L40,70Z" fill="#4a5a4a"/><path d="M150,-14 L200,-70 L222,-70 L200,-2Z" fill="#5a6a5a"/><path d="M-110,-24 Q-90,-44 -50,-28Z" fill="#9ac6e0"/><rect x="-180" y="-8" width="14" height="16" fill="#3a3a3e"/><ellipse cx="-184" cy="0" rx="6" ry="${(40*Math.abs(p)+6).toFixed(1)}" fill="#2a2a2e" opacity=".5"/></g>`};
const o8Fire=(x,y,k,t)=>{let s='';
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;s+=`<ellipse cx="${(x+Math.cos(a)*46).toFixed(0)}" cy="${(y+Math.sin(a)*14).toFixed(0)}" rx="16" ry="10" fill="#5a5a60"/>`;}
  s+=`<path d="M${x-30},${y} L${x+30},${y-8} M${x-26},${y-8} L${x+26},${y}" stroke="#5a3a26" stroke-width="10" stroke-linecap="round"/>`;
  const h=(70+12*Math.sin(t*13)+8*Math.sin(t*7.3))*k, w=26*k;
  s+=`<circle cx="${x}" cy="${y-30}" r="${(260*k).toFixed(0)}" fill="url(#glowY)" opacity="${(.75*k).toFixed(2)}"/>`;
  s+=`<path d="M${x-w},${y-4} Q${x-w*1.2},${y-h*.5} ${(x+Math.sin(t*9)*6).toFixed(1)},${(y-h).toFixed(1)} Q${x+w*1.2},${y-h*.5} ${x+w},${y-4}Z" fill="#ff8a2a"/>`;
  s+=`<path d="M${x-w*.5},${y-4} Q${x-w*.6},${y-h*.35} ${(x+Math.sin(t*11)*4).toFixed(1)},${(y-h*.65).toFixed(1)} Q${x+w*.6},${y-h*.35} ${x+w*.5},${y-4}Z" fill="#ffd76a"/>`;
  for(let i=0;i<4;i++){const p=(t*.8+i/4)%1;s+=`<circle cx="${(x+Math.sin(i*2+t*3)*20).toFixed(1)}" cy="${(y-h-p*120).toFixed(1)}" r="3" fill="#ffd76a" opacity="${(k*(1-p)).toFixed(2)}"/>`;}
  return s};
const o8Hut=(x,y,s)=>{let g=`<path d="M-230,0 L-200,-260 L230,-200 L240,0Z" fill="#2a1e12" opacity=".5"/><path d="M-260,-250 L260,-190 L230,-150 L-250,-210Z" fill="#9a8a4a"/>`;
  for(let i=0;i<12;i++) g+=`<path d="M${-250+i*44},${-250+i*5} q12,40 -4,${70+i%3*12}" stroke="#7a6a34" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  g+=`<rect x="-220" y="-215" width="14" height="215" fill="#5a4026"/><rect x="200" y="-160" width="14" height="160" fill="#5a4026"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`};
const o8Log=(x,y,w)=>`<rect x="${x-w/2}" y="${y-60}" width="${w}" height="60" rx="28" fill="#6a4a2e"/><ellipse cx="${x+w/2-6}" cy="${y-30}" rx="14" ry="28" fill="#a87c52"/><ellipse cx="${x+w/2-6}" cy="${y-30}" rx="7" ry="14" fill="#8a6440"/>`;
const o8Bubble=(cx,cy,r,inner,a)=>{if(a<=0) return '';const id=uid('bb'), k=eBack(clamp(a));
  return `<g transform="translate(${cx},${cy}) scale(${k.toFixed(3)}) translate(${-cx},${-cy})"><circle cx="${cx-r*.9}" cy="${cy+r*1.05}" r="${r*.12}" fill="#f3eee6"/><circle cx="${cx-r*1.15}" cy="${cy+r*1.35}" r="${r*.07}" fill="#f3eee6"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#f3eee6"/><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r-10}"/></clipPath><g clip-path="url(#${id})">${inner}</g><circle cx="${cx}" cy="${cy}" r="${r-10}" fill="#a87838" opacity=".18"/></g>`};
const o8Found=(x,y,svg,a,r=110)=>a<=0?'':`<g transform="translate(${x},${y}) scale(${eBack(clamp(a)).toFixed(3)})"><circle cx="0" cy="0" r="${r}" fill="#11131f" fill-opacity=".9" stroke="#fff" stroke-width="5"/>${svg}</g>`;
const o8Sparkle=(x,y,t,a,sz=30)=>{if(a<=0) return '';const k=sz*(.7+.3*Math.sin(t*12));return `<path d="M${x},${y-k} L${x+k*.25},${y-k*.25} L${x+k},${y} L${x+k*.25},${y+k*.25} L${x},${y+k} L${x-k*.25},${y+k*.25} L${x-k},${y} L${x-k*.25},${y-k*.25}Z" fill="#fff6c8" opacity="${clamp(a).toFixed(2)}"/>`};
const o8Fireflies=(t,n,op)=>{let s='';const r=rng(77);for(let i=0;i<n;i++){const x=r()*1100, y=200+r()*800, ph=r()*6;s+=`<circle cx="${(x+Math.sin(t*.7+ph)*30).toFixed(1)}" cy="${(y+Math.cos(t*.5+ph)*20).toFixed(1)}" r="4" fill="#e8ff8a" opacity="${(op*(.4+.6*Math.abs(Math.sin(t*2+ph)))).toFixed(2)}"/>`;}return s};

// ---------- the jungle of Lubang ----------
const o8Jungle=(t,o={})=>{ // o.tone darkness 0..1, o.night 0..1, o.warm sunset
  const tone=o.tone||0, M=c=>mix(c,'#000000',tone);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${M('#123020')}"/>`;
  s+=`<rect x="-600" y="-900" width="2280" height="1500" fill="${M('#2f5a3a')}" opacity=".55"/>`;
  for(const [x,w] of [[-60,40],[180,30],[420,46],[700,34],[960,40]]) s+=`<rect x="${x}" y="-200" width="${w}" height="1200" fill="${M('#1a3a24')}" opacity=".7"/>`;
  if(!o.night) for(let i=0;i<4;i++){const x=80+i*260+Math.sin(t*.3+i)*20;s+=`<path d="M${x},-200 L${x+90},-200 L${x+330},1100 L${x+170},1100Z" fill="${o.warm?'#ffc890':'#fff6c8'}" opacity="${(.07*(1-tone)).toFixed(3)}"/>`;}
  for(const [x,y,r] of [[0,120,220],[330,60,250],[700,110,240],[1060,80,230],[-200,300,180],[1240,320,200]]) s+=`<circle cx="${x}" cy="${(y+Math.sin(t*.8+x)*6).toFixed(1)}" r="${r}" fill="${M('#1f4a2e')}"/>`;
  for(const [x,w] of [[60,70],[880,80]]) s+=`<rect x="${x}" y="200" width="${w}" height="800" fill="${M('#3a2a1e')}"/><rect x="${x+10}" y="200" width="12" height="800" fill="#000" opacity=".15"/>`;
  for(const [x0,x1,y0] of [[140,300,180],[760,920,140],[420,560,240]]) s+=`<path d="M${x0},${y0} Q${(x0+x1)/2},${(y0+260+Math.sin(t+x0)*10).toFixed(1)} ${x1},${y0}" stroke="${M('#3a7a3a')}" stroke-width="7" fill="none"/>`;
  for(let i=0;i<14;i++){const x=(i*97)%1100-20, y=380+(i*53)%380;s+=`<ellipse cx="${x}" cy="${y}" rx="70" ry="22" fill="${M(i%2?'#2f6a3a':'#3f7a3a')}" transform="rotate(${(-30+i*17+Math.sin(t+i)*4).toFixed(1)} ${x} ${y})"/>`;}
  // banana plants
  for(const [x,y,sc] of [[260,960,.9],[820,950,1]]){for(let i=0;i<5;i++){const a=-70+i*35+Math.sin(t*1.1+i)*3;s+=`<g transform="translate(${x},${y-200*sc}) rotate(${a.toFixed(1)}) scale(${sc})"><path d="M0,0 Q60,-30 170,-10 Q60,20 0,0Z" fill="${M(i%2?'#4a8a3a':'#3a7a2e')}"/></g>`;}s+=`<rect x="${x-10}" y="${y-200*sc}" width="20" height="${200*sc}" fill="${M('#5a7a3a')}"/>`;}
  const G=o.ground||900;
  s+=`<rect x="-600" y="${G}" width="2280" height="800" fill="${M('#2a3a1e')}"/>`;
  for(let i=0;i<24;i++){const x=(i*61)%1180-50, y=G+20+(i*37)%160;s+=`<ellipse cx="${x}" cy="${y}" rx="${18+i%4*6}" ry="7" fill="${M(i%3?'#4a5a2a':'#6a5a30')}" opacity=".8"/>`;}
  if(o.warm) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#ff9a50" opacity=".14"/>`;
  if(o.night) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a1430" opacity="${(.55*o.night).toFixed(2)}"/>`;
  return s};
const o8Fronds=(t,tone=0,op=1)=>{let s='';const M=c=>mix(c,'#000000',tone);
  for(const [x,y,sc,dir,base] of [[-60,1140,1.3,1,-80],[1140,1130,1.4,-1,-80],[-80,-40,1.1,1,40],[1160,-20,1.2,-1,40]]){for(let i=0;i<6;i++){const a=(base+i*24+Math.sin(t*1.2+i)*3)*dir;s+=`<g transform="translate(${x},${y}) rotate(${a.toFixed(1)}) scale(${sc})"><path d="M0,0 Q26,-150 0,-300 Q-26,-150 0,0Z" fill="${M(i%2?'#14381e':'#1b4624')}" opacity="${op}"/></g>`;}}
  return s};

// ---------- other places ----------
const o8Beach=t=>{
  let s=skyTod('dawn')+`<circle cx="820" cy="430" r="66" fill="#ffd9a0"/><circle cx="820" cy="430" r="260" fill="url(#glowY)"/>`;
  s+=sea(t,470,800,{col:'#3a6a8a'});
  s+=`<path d="M-600,470 L200,470 L300,440 L420,470 L1680,470" fill="none"/><path d="M600,470 Q700,420 820,440 Q900,425 1000,470Z" fill="#2a4a3a" opacity=".8"/>`;
  s+=`<path d="M-600,780 Q300,740 1680,790 L1680,1600 L-600,1600Z" fill="#d8c08a"/><path d="M-600,780 Q300,740 1680,790" stroke="#f3eee6" stroke-width="8" fill="none" opacity=".7"/>`;
  for(let i=0;i<10;i++) s+=`<ellipse cx="${-50+i*130}" cy="${880+(i*37)%120}" rx="${10+i%3*6}" ry="4" fill="#b89a6a"/>`;
  for(const [x,y,sc,dir] of [[960,940,1.2,-1],[60,960,1,1]]){s+=`<path d="M${x},${y} Q${x+dir*40},${y-260*sc} ${x+dir*20},${y-520*sc}" stroke="#7a5a3a" stroke-width="${22*sc}" fill="none"/>`;
    for(let i=0;i<6;i++){const a=-150+i*55+Math.sin(t*1.3+i)*4;s+=`<g transform="translate(${x+dir*20},${y-520*sc}) rotate(${a.toFixed(1)}) scale(${sc})"><path d="M0,0 Q90,-40 200,10 Q90,10 0,0Z" fill="${i%2?'#2f6a3a':'#3f7a3a'}"/></g>`;}}
  // the landing boat in the shallows
  s+=`<g transform="translate(200,${(800+Math.sin(t*2)*3).toFixed(1)})"><path d="M-220,-80 L200,-80 L180,0 L-200,0Z" fill="#5a6058"/><rect x="-220" y="-100" width="420" height="22" fill="#6a7068"/><path d="M200,-100 L260,-10 L180,0Z" fill="#4a5048"/></g>`;
  s+=`<path d="M-600,812 q120,-10 240,0 t240,0" stroke="#f3eee6" stroke-width="5" fill="none" opacity=".6"/>`;
  return s};
const o8Map=(t,k)=>{ // the Philippines, with Lubang marked
  let s=`<rect x="110" y="230" width="860" height="760" rx="26" fill="#9fc6dc"/><rect x="110" y="230" width="860" height="760" rx="26" fill="none" stroke="#f3ead6" stroke-width="12"/>`;
  for(let i=1;i<6;i++) s+=`<line x1="110" y1="${230+i*127}" x2="970" y2="${230+i*127}" stroke="#fff" stroke-opacity=".25" stroke-width="2"/><line x1="${110+i*143}" y1="230" x2="${110+i*143}" y2="990" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`;
  const land='#c9b48a';
  s+=`<path d="M470,290 Q520,270 560,300 L575,380 Q600,420 585,470 L610,520 Q640,560 610,600 L560,585 Q520,560 500,520 L470,470 Q440,420 455,370Z" fill="${land}"/>`; // Luzon
  s+=`<path d="M455,640 Q490,615 515,650 Q520,700 480,720 Q445,700 455,640Z" fill="${land}"/>`; // Mindoro
  s+=`<ellipse cx="415" cy="612" rx="16" ry="9" fill="#e0a040"/>`; // Lubang
  s+=`<path d="M560,660 Q600,640 640,670 L700,700 Q720,740 680,760 L620,740 Q580,720 560,690Z" fill="${land}"/><path d="M610,770 Q650,760 690,790 Q680,830 640,830 Q600,810 610,770Z" fill="${land}"/>`; // Visayas
  s+=`<path d="M610,860 Q680,830 760,860 Q800,900 770,950 Q700,975 640,950 Q600,910 610,860Z" fill="${land}"/>`; // Mindanao
  s+=`<path d="M300,780 L330,770 L430,690 L445,700 L345,800 L310,810Z" fill="${land}"/>`; // Palawan
  s+=`<circle cx="520" cy="545" r="8" fill="#3a2a1a"/><text x="535" y="552" font-family="Inter" font-weight="800" font-size="24" fill="#3a2a1a">Manila</text>`;
  s+=`<text x="800" y="420" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="#2a3a4a" opacity=".7">FILIPINAS</text>`;
  s+=`<path d="M540,240 L540,280" stroke="#3a2a1a" stroke-width="5"/><text x="560" y="275" font-family="Inter" font-weight="800" font-size="22" fill="#3a2a1a">↑ JAPÓN</text>`;
  if(k>0){const p=(t*1.4)%1;s+=`<circle cx="415" cy="612" r="${(16+p*70).toFixed(1)}" fill="none" stroke="#d42a2a" stroke-width="6" opacity="${(1-p).toFixed(2)}"/><path d="M415,604 C395,560 395,536 415,532 C435,536 435,560 415,604Z" fill="#d42a2a" transform="translate(0,${(-14*eOut(k)).toFixed(1)})"/>`;
    s+=`<text x="300" y="600" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="#d42a2a" opacity="${clamp(k*2).toFixed(2)}">LUBANG</text>`;}
  return s};
const o8Tent=(t)=>{ // officers' tent in 1944: canvas, lantern, map table
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#7a6a4a"/><path d="M-600,-900 L540,180 L1680,-900Z" fill="#8a7a58"/><path d="M540,180 L540,1000" stroke="#5a4c32" stroke-width="14"/>`;
  for(let i=0;i<8;i++) s+=`<path d="M${-200+i*180},1000 L540,180" stroke="#6a5c40" stroke-width="4" opacity=".6"/>`;
  s+=`<circle cx="540" cy="300" r="360" fill="url(#glowY)" opacity=".55"/><path d="M540,180 L540,250" stroke="#2a2a2e" stroke-width="4"/><rect x="522" y="250" width="36" height="46" rx="8" fill="#ffd76a"/><rect x="518" y="246" width="44" height="10" fill="#3a3a3e"/>`;
  s+=`<rect x="-600" y="1000" width="2280" height="600" fill="#4a3e2a"/>`;
  s+=`<rect x="380" y="820" width="320" height="18" fill="#6a4a2e"/><rect x="400" y="836" width="14" height="170" fill="#5a3e24"/><rect x="666" y="836" width="14" height="170" fill="#5a3e24"/><g transform="translate(540,814) scale(.25,.08) translate(-540,-610)">${o8Map(t,0)}</g>`;
  return s};
const o8Shop=t=>{ // Taniguchi's bookshop, Japan 1974
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#e9dcc4"/><rect x="-600" y="1000" width="2280" height="600" fill="#8a6a4a"/>`;
  const cols=['#c23a3a','#3a6aa8','#e0b04a','#3a8a5a','#7a4a8a','#e9e4d8','#2a2e3a','#d4782a'];
  for(const x0 of [-120,690]){s+=`<rect x="${x0}" y="200" width="510" height="800" fill="#6a4a2e"/>`;
    for(let r=0;r<5;r++){const y=230+r*150;s+=`<rect x="${x0+15}" y="${y+120}" width="480" height="14" fill="#4a321e"/>`;
      let x=x0+22;const rr=rng(r*7+x0);while(x<x0+480){const w=18+rr()*20, h=80+rr()*36;s+=`<rect x="${x.toFixed(0)}" y="${(y+120-h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${cols[Math.floor(rr()*cols.length)]}"/>`;x+=w+3;}}}
  s+=`<rect x="420" y="220" width="240" height="190" fill="#bcd8e8"/><rect x="420" y="220" width="240" height="190" fill="none" stroke="#6a4a2e" stroke-width="12"/><line x1="540" y1="220" x2="540" y2="410" stroke="#6a4a2e" stroke-width="8"/>`;
  s+=`<rect x="440" y="120" width="200" height="70" fill="#2a2e3a"/><text x="540" y="172" text-anchor="middle" font-family="${JP}" font-size="46" fill="#ffd34a">書店</text>`;
  s+=`<circle cx="540" cy="300" r="380" fill="url(#glowY)" opacity=".25"/>`;
  return s};
const o8ShopCounter=()=>`<rect x="280" y="800" width="520" height="210" fill="#7a5434"/><rect x="270" y="790" width="540" height="22" fill="#5a3e24"/><rect x="330" y="760" width="90" height="30" fill="#3a6aa8"/><rect x="340" y="736" width="80" height="26" fill="#c23a3a"/><rect x="690" y="740" width="70" height="52" rx="6" fill="#2a2e3a"/><rect x="700" y="748" width="50" height="22" fill="#cfe6a8"/>`;

const o8Lit=(op,holes)=>dark(op,holes);

// ================= scenes =================
S.hook=(t,D,B)=>{const E=EVS.hook(B), k=eIO(prog(t,0,D));
  let s=o8Jungle(t,{tone:.35,night:1});
  for(let i=0;i<3;i++){const x=200+i*300;s+=`<path d="M${x},-200 L${x+70},-200 L${x+260},1100 L${x+120},1100Z" fill="#cfe0ff" opacity=".06"/>`;}
  s+=o8Fireflies(t,22,.9);
  s+=o8Sling(600,1010,.62)+A({...ONO74,x:600,y:1010,s:.62,look:[-10,-2],brows:'angry',mouth:'line'})+o8Patches(600,1010,.62);
  const part=lerp(0,120,k);
  s+=`<g transform="translate(${-part},0)">${o8Fronds(t,.5)}</g>`;
  s+=dark(.45,[[600,640,320,340]]);
  let o=cam(s,lerp(1.0,1.3,k),600,640,540,640);
  if(t>E.years) o+=countPop('29 AÑOS',540,330,130,t-E.years,YEL);
  if(t>E.ended) o+=tag(540,450,'LA GUERRA ACABÓ EN 1945',PINK,P(t,E.ended,.2));
  return o;};

S.arrive=(t,D,B)=>{const E=EVS.arrive(B), mp=prog(t,E.island-.4,E.island+.3);
  if(mp<1){
    const k=prog(t,0,E.island);
    let s=o8Beach(t);
    const x=lerp(250,520,eOut(k));
    s+=`<rect x="${x-120}" y="1006" width="240" height="8" fill="#000" opacity=".08"/>`;
    s+=o8Sling(x,1010,.6)+A({...ONO,x,y:1010,s:.6,walk:k<1?t*7:null,look:[10,-2],backpack:'#5a5034',mouth:'line'});
    let o=cam(s,lerp(1.0,1.08,k),520,700,540,620);
    if(t<E.name) o+=countPop('1944',540,320,120,t,YEL);
    if(t>E.name) o+=tag(540,330,'HIROO ONODA · 22 AÑOS',GREEN,P(t,E.name,.2));
    if(mp>0) o+=`<rect x="0" y="0" width="1080" height="1100" fill="#9fc6dc" opacity="${mp.toFixed(2)}"/>`;
    return o;}
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a3a4a"/>`;
  s+=`<g transform="translate(540,610) scale(${lerp(1.25,1,eOut(prog(t,E.island,E.island+1))).toFixed(3)}) translate(-540,-610)">${o8Map(t,prog(t,E.lubang-.2,E.lubang+.4))}</g>`;
  return s;};

S.order=(t,D,B)=>{const E=EVS.order(B), sal=t>E.no-.1;
  let s=o8Tent(t);
  s+=A({...TANI44,x:720,y:1010,s:.6,look:[-12,-2],brows:'angry',mouth:t<E.no+.6?'o':'line',mopen:t<E.no+.6?.5+.3*Math.sin(t*14):0,reachL:[-170,-560]});
  s+=o8Sling(330,1010,.6)+A({...ONO,x:330,y:1010,s:.6,look:[12,-4],brows:sal?'angry':null,mouth:'line',reachR:sal?[64,-726]:null});
  let o=cam(s,lerp(1.05,1.15,prog(t,0,D)),520,720,540,620);
  o+=o8Stamp(540,320,'NO RENDIRSE JAMÁS',P(t,E.no,.3),-6,'#e0303a',56);
  return o;};

S.leaflets=(t,D,B)=>{const E=EVS.leaflets(B);
  let s=skyTod('day')+puffs(t,300,'#fff',.85,8,4);
  const px=lerp(1300,-300,prog(t,E.plane-1.2,E.drop+1.4));
  s+=o8Plane(px,360,.9,t);
  if(t>E.drop){const r=rng(5);for(let i=0;i<36;i++){const st=E.drop+r()*.9, p=prog(t,st,st+3.2), x0=lerp(1300,-300,prog(st,E.plane-1.2,E.drop+1.4))+r()*80;
    if(p>0) s+=o8Leaf(x0+Math.sin(t*3+i)*40-p*60,380+p*800+r()*40,.55+r()*.3,Math.sin(t*4+i)*40+i*20);}}
  // canopy seen from below
  s+=`<path d="M-600,1100 L-600,820 Q-300,700 0,820 Q200,740 400,830 Q600,760 800,830 Q1000,740 1680,820 L1680,1100Z" fill="#1f4a2e"/>`;
  for(let i=0;i<12;i++) s+=`<circle cx="${-100+i*110}" cy="${860+(i%3)*30}" r="${70+(i%4)*14}" fill="${i%2?'#2a5a34':'#1a4026'}"/>`;
  s+=`<rect x="-600" y="1000" width="2280" height="600" fill="#123020"/>`;
  let o=cam(s,1.0,540,600,540,600);
  if(t>E.ends&&t<E.text) o+=tag(540,580,'FIN DE LA GUERRA',GREEN,P(t,E.ends,.2));
  o+=o8LeafBig(540,560,prog(t,E.text-.1,E.text+.35),{s:1.15});
  return o;};

S.trap=(t,D,B)=>{const E=EVS.trap(B), cr=prog(t,E.trap,E.trap+.4);
  let s=o8Jungle(t,{tone:.15});
  s+=A({...AKA,x:170,y:960,s:.5,look:[10,2],brows:'worried',mouth:'line'})+A({...SHI,x:900,y:960,s:.5,look:[-10,2],brows:'worried',mouth:'line'})+A({...KOZ,x:780,y:950,s:.46,look:[-10,2],mouth:'line'});
  const hx=480, hy=1010-.62*430;
  s+=o8Sling(480,1010,.62)+A({...ONO,x:480,y:1010,s:.62,look:t<E.trap?[0,9]:[6,-2],brows:t>E.trap?'angry':null,mouth:'line',reachL:[lerp(-60,-14,cr),-430],reachR:[lerp(60,14,cr),-430]});
  if(cr<1) s+=`<g transform="translate(${hx},${hy-10}) scale(${lerp(1,.35,cr).toFixed(3)}) rotate(${(cr*30).toFixed(0)})">${o8Leaf(0,0,1,0)}</g>`;
  else s+=`<circle cx="${hx}" cy="${hy-10}" r="16" fill="#e9e2d2"/><path d="M${hx-10},${hy-16} l12,6 l6,-10" stroke="#a8a294" stroke-width="3" fill="none"/>`;
  s+=o8Fronds(t,.2);
  let o=cam(s,lerp(1.05,1.2,prog(t,0,D)),500,720,540,640);
  if(t>E.trap) o+=tag(540,420,'«ES UNA TRAMPA»',PINK,P(t,E.trap,.2));
  return o;};

S.camp=(t,D,B)=>{
  let s=o8Jungle(t,{tone:.2});
  s+=o8Fire(640,1010,.45,t);
  s+=o8Log(330,1010,420)+A({...AKA,x:230,y:1010,s:.52,sit:true,look:[6,4],mouth:'line'})+A({...SHI,x:430,y:1010,s:.52,sit:true,look:[-6,4],mouth:'line'});
  s+=A({...KOZ,x:600,y:990,s:.5,look:[8,0],mouth:'line'});
  s+=o8Sling(800,1010,.6)+A({...ONO,x:800,y:1010,s:.6,look:[-12,-4],brows:'angry',mouth:'line'});
  s+=o8Fronds(t,.25);
  return cam(s,lerp(1.1,1.0,eIO(prog(t,0,D))),560,700,540,620);};

S.rule1=(t,D,B)=>{const E=EVS.rule1(B);
  let s=o8Jungle(t,{tone:.2});
  s+=o8Sling(420,1010,.62)+A({...ONO,x:420,y:1010,s:.62,look:[10,-6],brows:'angry',mouth:'line',reachR:[64,-726]});
  s+=o8Fronds(t,.25);
  let o=cam(s,1.25,440,700,440,700);
  const inner=`<rect x="560" y="300" width="440" height="440" fill="#8a7a58"/>`+A({...TANI44,x:780,y:880,s:.6,look:[-6,0],brows:'angry',mouth:'o',mopen:.4+.3*Math.sin(t*14),still:false});
  o+=o8Bubble(790,470,170,inner,prog(t,.2,.7));
  if(t>E.order) o+=tag(790,690,'SIN ORDEN, NO',YEL,P(t,E.order,.2));
  return o;};

S.rule2=(t,D,B)=>{const E=EVS.rule2(B), lt=t>E.letters-.25;
  let s=o8Jungle(t,{tone:.3});
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity=".35"/>`;
  let o=cam(s,1.1,540,600,540,600);
  if(!lt){o+=o8LeafBig(540,600,prog(t,0,.35),{s:1.05,rot:4,stamp:prog(t,E.lie,E.lie+.3)});}
  else {o+=o8LeafBig(380,500,1,{s:.6,rot:-14,stamp:1})+o8Letter(560,620,prog(t,E.letters-.25,E.letters+.2),{stamp:prog(t,E.family,E.family+.3)});}
  return o;};

S.rule3=(t,D,B)=>{const E=EVS.rule3(B), sh=prog(t,E.clean,E.clean+.6);
  let s=o8Jungle(t,{tone:.4,night:1});
  s+=o8Log(470,1010,260);
  const rx1=330, ry=1010-.6*290, rx2=760;
  s+=A({...ONO,x:470,y:1010,s:.6,sit:true,look:[8,8],brows:'angry',mouth:'line',reachL:[-150,-290],reachR:[lerp(30,170,(Math.sin(t*5)+1)/2),-296]});
  s+=o8Rifle(rx1,ry,rx2,ry-10,{w:1,shine:sh});
  const cx=470+.6*lerp(30,170,(Math.sin(t*5)+1)/2);
  s+=`<ellipse cx="${cx.toFixed(1)}" cy="${(ry-2).toFixed(1)}" rx="20" ry="13" fill="#e9e2d2"/>`;
  s+=o8Fire(820,1010,1,t);
  s+=dark(.35,[[620,900,420,280]]);
  let o=cam(s,1.18,560,820,540,660);
  if(sh>0){o+=o8Sparkle(780,600,t,sh,34)+o8Sparkle(620,615,t+1,sh,22);o+=tag(760,420,'SIEMPRE LISTO',GREEN,P(t,E.clean,.2));}
  return o;};

S.years=(t,D,B)=>{const E=EVS.years(B);
  const rainy=Math.floor(t/1.1)%2===0;
  let s=o8Jungle(t,{tone:rainy?.3:.1});
  const vine=prog(t,0,D);
  s+=`<path d="M-20,180 Q${lerp(60,140,vine)},${lerp(260,560,vine)} ${lerp(40,220,vine)},${lerp(300,900,vine)}" stroke="#3a7a3a" stroke-width="10" fill="none"/><path d="M1100,140 Q${lerp(1040,960,vine)},${lerp(260,560,vine)} ${lerp(1060,880,vine)},${lerp(260,880,vine)}" stroke="#3a7a3a" stroke-width="10" fill="none"/>`;
  const out=eIn(prog(t,E.surr,E.surr+1.4)), f1=prog(t,E.die,E.die+.9), f2=prog(t,E.alone-.3,E.alone+.6);
  s+=A({...AKA,x:lerp(220,-260,out),y:1010,s:.55,walk:out>0&&out<1?t*7:null,look:out>0?[-12,0]:[2,0],mouth:'line',op:1});
  if(out>0&&out<1){const ax=lerp(220,-260,out);s+=`<path d="M${ax+60},${1010-.55*560} l0,-90" stroke="#5a4026" stroke-width="6"/><path d="M${ax+60},${1010-.55*560-90} l50,12 l-50,14Z" fill="#f3f0e6"/>`;}
  s+=`<g opacity="${(1-f1).toFixed(2)}">${A({...SHI,x:660,y:1010,s:.55,look:[-2,0],mouth:'line'})}</g>`;
  s+=`<g opacity="${(1-f2).toFixed(2)}">${A({...KOZ,x:860,y:1010,s:.55,look:[-4,0],mouth:'line'})}</g>`;
  s+=o8Sling(440,1010,.6)+A({...ONO,x:440,y:1010,s:.6,look:t>E.alone?[0,4]:[4,0],brows:t>E.die?'worried':null,mouth:'line',wrinkles:t>E.alone});
  if(rainy) s+=rain(t,.5,4,70,1100);
  s+=o8Fronds(t,.25);
  const z=lerp(1.0,1.18,eIO(prog(t,E.alone-.5,D)));
  let o=cam(s,z,lerp(540,440,eIO(prog(t,E.alone-.5,D))),720,540,640);
  if(t>E.surr&&t<E.die) o+=tag(780,440,'UNO SE RINDE',YEL,P(t,E.surr,.2));
  if(t>E.die&&t<E.alone) o+=tag(780,440,'OTROS MUEREN',PINK,P(t,E.die,.2));
  if(t>E.alone) o+=tag(780,440,'SOLO',PINK,P(t,E.alone,.2));
  return o;};

S.meet=(t,D,B)=>{const E=EVS.meet(B), l2=t>E.talk;
  let s=o8Jungle(t,{tone:.35,night:1});
  s+=`<g transform="translate(990,1010)"><path d="M-160,0 L0,-230 L160,0Z" fill="#e07a2a"/><path d="M0,-230 L-40,0 L40,0Z" fill="#7a3a12"/><path d="M-160,0 L0,-230" stroke="#b85a1a" stroke-width="8"/></g>`;
  s+=o8Fire(590,1010,1,t);
  const up=t>E.appear+.2;
  if(!up) s+=o8Log(700,1010,200)+A({...SUZ,x:700,y:1010,s:.58,sit:true,look:[-8,6],mouth:'smile'});
  else s+=A({...SUZ,x:740,y:1010,s:.58,look:[-12,-2],eyes:l2?'open':'wide',brows:'worried',mouth:l2?'line':'o',reachR:l2?[60,-470]:null});
  if(up&&l2) s+=`<rect x="${740+.58*40}" y="${1010-.58*500}" width="34" height="24" rx="4" fill="#2a2a2e"/><circle cx="${740+.58*40+17}" cy="${1010-.58*500+12}" r="7" fill="#6a7a8a"/>`;
  const ox=lerp(-160,300,eOut(prog(t,E.appear-.2,E.appear+1.3)));
  s+=o8Sling(ox,1010,.62)+A({...ONO74,x:ox,y:1010,s:.62,walk:ox<299?t*7:null,look:[12,-2],brows:'angry',mouth:l2&&t<D-.4?'o':'line',mopen:l2?.4+.3*Math.sin(t*13):0})+o8Patches(ox,1010,.62);
  s+=`<g transform="translate(${lerp(-80,-220,eOut(prog(t,E.appear-.2,E.appear+.8)))},0)">${o8Fronds(t,.4)}</g>`;
  s+=dark(.4,[[560,850,460,320]]);
  const z=l2?lerp(1.05,1.22,eIO(prog(t,E.talk,E.talk+1.5))):1.05;
  let o=cam(s,z,l2?520:560,780,540,640);
  if(t>E.uniform&&!l2){o+=brackets(lerp(540,300*1.05-48,1),700,230,520,YEL);o+=tag(300,400,'UNIFORME DE 1944',YEL,P(t,E.uniform,.2));}
  if(t>D-.35){o+=`<rect x="0" y="0" width="1080" height="1100" fill="#fff" opacity="${(1-prog(t,D-.35,D)).toFixed(2)}"/>`;}
  return o;};

S.shop=(t,D,B)=>{const E=EVS.shop(B);
  let s=o8Shop(t);
  s+=A({...TANI74,x:540,y:1010,s:.6,look:[-4,2],mouth:'line',reachR:[120,-420]});
  s+=o8ShopCounter();
  s+=`<rect x="${540+.6*100}" y="${1010-.6*470}" width="60" height="44" fill="#3a8a5a" transform="rotate(-10 ${540+.6*130} ${1010-.6*450})"/>`;
  let o=cam(s,lerp(1.0,1.1,prog(t,0,D)),540,640,540,620);
  if(t>E.cmd){o+=o8Found(230,470,`<clipPath id="o8pol"><circle cx="0" cy="0" r="100"/></clipPath><g clip-path="url(#o8pol)"><rect x="-110" y="-110" width="220" height="220" fill="#8a7a58"/>${A({...TANI44,x:0,y:330,s:.5,still:true,mouth:'line',brows:'angry'})}<rect x="-110" y="-110" width="220" height="220" fill="#a87838" opacity=".3"/></g><text x="0" y="148" text-anchor="middle" font-family="Inter" font-weight="900" font-size="30" fill="#fff">1944</text>`,prog(t,E.cmd-.1,E.cmd+.3),110);
    o+=tag(760,330,'MAYOR TANIGUCHI',YEL,P(t,E.cmd,.2));}
  if(t>E.books) o+=tag(760,400,'AHORA, LIBRERO',GREEN,P(t,E.books,.2));
  return o;};

S.read=(t,D,B)=>{const E=EVS.read(B), op=prog(t,E.read-.3,E.read+.2);
  let s=o8Jungle(t,{tone:.05});
  s+=o8Sling(320,1010,.62)+A({...ONO74,x:320,y:1010,s:.62,look:[12,-2],brows:'worried',mouth:'line',aL:4,aR:4})+o8Patches(320,1010,.62);
  s+=A({...TANI74,x:720,y:1010,s:.6,look:[-6,8],mouth:t>E.read?'o':'line',mopen:t>E.read?.35+.25*Math.sin(t*12):0,reachL:[-60,-440],reachR:[40,-440]});
  const px=720-.6*10, py=1010-.6*470;
  s+=`<g transform="translate(${px},${py}) scale(${lerp(.4,1,op).toFixed(3)},1)"><rect x="-60" y="-40" width="120" height="84" fill="#f3eee2"/>${[0,1,2,3].map(i=>`<rect x="-46" y="${-28+i*16}" width="${80-i%2*20}" height="5" fill="#7a7468"/>`).join('')}</g>`;
  s+=o8Fronds(t,.15);
  let o=cam(s,lerp(1.02,1.12,prog(t,0,D)),520,720,540,640);
  if(t>E.read) o+=o8Found(540,380,`<rect x="-80" y="-56" width="160" height="112" fill="#f3eee2"/><text x="0" y="-18" text-anchor="middle" font-family="${JP}" font-size="30" fill="#c23a3a">命令</text><text x="0" y="16" text-anchor="middle" font-family="Inter" font-weight="900" font-size="20" fill="#2a2620">CESE DE TODO</text><text x="0" y="40" text-anchor="middle" font-family="Inter" font-weight="900" font-size="20" fill="#2a2620">COMBATE</text>`,prog(t,E.read,E.read+.35),100);
  return o;};

S.salute=(t,D,B)=>{const E=EVS.salute(B), sal=t>E.salute-.15&&t<E.give-.2, give=eIO(prog(t,E.give-.2,E.give+.6));
  let s=o8Jungle(t,{tone:.05});
  if(t<E.give-.2) s+=o8Sling(380,1010,.62);
  s+=A({...TANI74,x:700,y:1010,s:.6,look:[-10,-2],brows:'worried',mouth:'line',reachL:give>.6?[-120,-440]:null});
  s+=A({...ONO74,x:380,y:1010,s:.62,look:[12,-2],brows:'worried',mouth:'line',eyes:sal?'open':'open',reachR:sal?[64,-726]:give>0?[lerp(40,150,give),-440]:null,reachL:give>0?[lerp(-40,60,give),-440]:null})+o8Patches(380,1010,.62);
  if(give>0){const y=1010-.62*440, x1=380+.62*lerp(-80,20,give), x2=380+.62*lerp(330,520,give);s+=o8Rifle(x1,y+6,x2,y-6,{w:1,shine:prog(t,E.works,E.works+.5)});}
  s+=o8Fronds(t,.15);
  let o=cam(s,lerp(1.1,1.2,prog(t,0,D)),540,720,540,640);
  if(t>E.works){const a=prog(t,E.works,E.works+.35);o+=o8Found(540,350,`<g transform="scale(.9)">${o8Rifle(-100,40,110,-40,{w:1.4,shine:1})}</g>`+o8Sparkle(40,-20,t,1,26),a,110);
    o+=tag(540,210,'TODAVÍA FUNCIONABA',GREEN,P(t,E.works+.2,.2));}
  return o;};

S.end=(t,D,B)=>{const E=EVS.end(B), k=prog(t,0,D);
  let s=o8Jungle(t,{tone:.1,warm:1});
  s+=`<rect x="380" y="200" width="320" height="800" fill="#ffc890" opacity=".22"/>`;
  const ox=lerp(560,700,eIO(prog(t,0,E.him-.6)));
  s+=A({...ONO74,x:ox,y:1010,s:.6,walk:ox<699?t*5:null,look:t>E.him-.8?[-12,2]:[10,-2],brows:'worried',mouth:'line'})+o8Patches(ox,1010,.6);
  s+=o8Fronds(t,.3);
  s+=dark(.25*k,[[ox,700,300,360]]);
  return cam(s,lerp(1.18,1.0,eIO(k)),ox,700,540,640);};

window.CFG={steps:['1. SIN ORDEN, NO TE RINDES','2. EL ENEMIGO MIENTE','3. EL RIFLE, SIEMPRE LIMPIO'],listEnd:'meet',
  hud:(h,bt,st,T)=>{const b=BEATS.find(x=>x.sc==='years'), e=BEATS.find(x=>x.sc==='meet');
    const y=Math.round(lerp(1946,1972,prog(T,b.start,e.start-.6)));return 'LUBANG · '+y;},
  band:{hook:'#0e1c14',arrive:'#b89a6a',order:'#4a3e2a',leaflets:'#123020',trap:'#22301a',camp:'#22301a',rule1:'#22301a',rule2:'#1a2416',rule3:'#0e1810',years:'#22301a',meet:'#0e1810',shop:'#8a6a4a',read:'#2a3a1e',salute:'#2a3a1e',end:'#3a3220'}};

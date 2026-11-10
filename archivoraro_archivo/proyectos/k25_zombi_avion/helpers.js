// Apocalipsis zombi en un avión — scenes. Aircraft pieces come from «El avión vacío».
const PAX=[{skin:'#f1c7a5',top:'#7a6aa8',hs:'short',hair:'#3a2a26'},{skin:'#8d5a3f',top:'#c77b3b',hs:'bald',hair:'#1d1514'},
  {skin:'#d9a57f',top:'#3f8f7a',hs:'long',hair:'#6b4428',lashes:true},{skin:'#f6cfae',top:'#b24e5a',hs:'bun',hair:'#c79a5a',lashes:true},{skin:'#b9825e',top:'#4f6fa0',hs:'messy',hair:'#1f1714'}];
const pax=(i,x,y,s,o={})=>{const p=PAX[i%PAX.length];return A(Object.assign({x,y,s,sit:true,skin:p.skin,top:p.top,topD:mix(p.top,'#000000',.28),hs:p.hs,hair:p.hair,lashes:p.lashes,pants:'#2e3350',mouth:'line'},o))};
const SH=-524, ARM=205;
function plane(x,y,s,t){
  let g=`<path d="M-520,-40 Q-560,0 -520,40 L460,46 Q560,40 600,0 Q560,-44 460,-46Z" fill="#e9edf2"/><path d="M-520,10 L560,16 Q560,40 460,46 L-520,40 Q-556,26 -520,10Z" fill="#c9d0d9"/>`;
  g+=`<path d="M-470,-40 L-560,-210 L-480,-210 L-380,-40Z" fill="#d6dce4"/><path d="M-470,-40 L-560,-210 L-520,-210 L-430,-40Z" fill="#2f6fb5"/>`;
  g+=`<path d="M-80,20 L-260,190 L-150,190 L120,24Z" fill="#aeb7c2"/><rect x="-200" y="100" width="130" height="44" rx="22" fill="#9aa3ad"/>`;
  for(let i=0;i<22;i++){const wx=-420+i*40, lit=i===13;g+=`<ellipse cx="${wx}" cy="-12" rx="9" ry="12" fill="${lit?'#ffe1a1':'#2a3550'}"/>`;if(lit) g+=`<circle cx="${wx}" cy="-12" r="40" fill="url(#glowY)"/>`}
  g+=`<path d="M520,-30 Q560,-10 580,0 L520,0Z" fill="#2a3550"/>`;
  g+=`<circle cx="-500" cy="-200" r="7" fill="#ff4a4a" opacity="${Math.floor(t*1.5)%2?1:.2}"/>`;
  return `<g transform="translate(${x},${y.toFixed(1)}) scale(${s})">${g}</g>`;
}
function cloudBank(y,col,off,sc=1){let s='';for(let i=-1;i<8;i++){const x=((i*260-off)%1820+1820)%1820-260;s+=`<ellipse cx="${x.toFixed(0)}" cy="${y}" rx="${190*sc}" ry="${70*sc}" fill="${col}"/><ellipse cx="${(x+120).toFixed(0)}" cy="${y-30*sc}" rx="${130*sc}" ry="${60*sc}" fill="${col}"/>`}return s}
function cabinAisle(t,o={}){ // looking down the aisle
  const light=o.light??1, binOpen=o.binOpen||(()=>0), flick=o.flick||(()=>1);
  let s=`<rect width="1080" height="1100" fill="#cfd3dc"/><polygon points="0,0 1080,0 640,380 440,380" fill="#e9ebf0"/>`;
  s+=`<polygon points="512,0 568,0 546,380 534,380" fill="${mix('#5a6280','#fff7dd',light)}"/>`;
  for(const side of [-1,1]){
    const X=x=>side<0?x:1080-x;
    s+=`<polygon points="${X(0)},30 ${X(440)},385 ${X(440)},445 ${X(0)},330" fill="#f2efe8"/>`;
    for(let k=0;k<7;k++){const u0=Math.pow(k/7,1.3),u1=Math.pow((k+1)/7,1.3),xa=lerp(0,440,u0),xb=lerp(0,440,u1),ya=lerp(30,385,u0),yb=lerp(30,385,u1),ha=lerp(300,60,u0),hb=lerp(300,60,u1);
      const op=binOpen(6-k);
      s+=`<line x1="${X(xa)}" y1="${ya}" x2="${X(xa)}" y2="${ya+ha}" stroke="#d6d2c8" stroke-width="${lerp(5,1,u0)}"/>`;
      if(op>0) s+=`<polygon points="${X(xa)},${ya} ${X(xb)},${yb} ${X(xb)},${yb-hb*.5*op} ${X(xa)},${ya-ha*.5*op}" fill="#dcd8cf"/><polygon points="${X(xa)},${ya} ${X(xb)},${yb} ${X(xb)},${yb+hb*.8} ${X(xa)},${ya+ha*.8}" fill="#2a2f3c" opacity="${op}"/>`;}
    s+=`<polygon points="${X(0)},330 ${X(440)},445 ${X(440)},540 ${X(0)},640" fill="#dfe2e8"/>`;
    for(let k=0;k<6;k++){const u=Math.pow((k+.5)/6,1.3),wx=lerp(30,420,u),wy=lerp(380,470,u),sc=lerp(1,.15,u);s+=`<rect x="${X(wx)-22*sc}" y="${wy-26*sc}" width="${44*sc}" height="${56*sc}" rx="${18*sc}" fill="${o.shades?'#e9ebf0':'#1a2133'}" stroke="#b9bec8" stroke-width="${3*sc}"/>`}
  }
  s+=`<polygon points="0,1100 1080,1100 600,540 480,540" fill="#3a4370"/>`;
  for(let k=0;k<10;k++){const u=Math.pow(k/10,1.6);s+=`<line x1="${lerp(480,0,u)}" y1="${lerp(540,1100,u)}" x2="${lerp(600,1080,u)}" y2="${lerp(540,1100,u)}" stroke="#333b63" stroke-width="2"/>`}
  if(o.shadow!=null){const u=o.shadow, y=lerp(560,1080,u), w=lerp(20,180,u);s+=`<ellipse cx="540" cy="${y}" rx="${w}" ry="${w*.28}" fill="#000" opacity=".35"/>`}
  // seat rows, far to near
  for(let r=8;r>=0;r--){const u=Math.pow((9-r)/9,1.5), yb=lerp(560,1150,u), sc=lerp(.14,1.35,u), half=lerp(40,250,u);
    for(const side of [-1,1]){const fl=flick(r);
      for(let c=0;c<2;c++){const x=540+side*(half+c*112*sc+56*sc);
        s+=`<rect x="${(x-50*sc).toFixed(1)}" y="${(yb-260*sc).toFixed(1)}" width="${(100*sc).toFixed(1)}" height="${(240*sc).toFixed(1)}" rx="${(22*sc).toFixed(1)}" fill="${mix('#22365c','#2f4f8f',fl)}"/><rect x="${(x-42*sc).toFixed(1)}" y="${(yb-250*sc).toFixed(1)}" width="${(84*sc).toFixed(1)}" height="${(46*sc).toFixed(1)}" rx="${(10*sc).toFixed(1)}" fill="#eef0f4"/>`;
        if(o.heads&&o.heads(r,side,c)>0){const a=o.heads(r,side,c),p=PAX[(r*4+c+side+8)%5];s+=`<g opacity="${a.toFixed(2)}"><circle cx="${x}" cy="${(yb-270*sc).toFixed(1)}" r="${(40*sc).toFixed(1)}" fill="${p.hair}"/></g>`}}}}
  s+=`<rect width="1080" height="1100" fill="#0b1030" opacity="${(.55*(1-light)).toFixed(2)}"/>`;
  return s;
}
function oval(x,y,w,h,inner,shade=1,tilt=0){ // airplane window: shade = how much of it is covered (1 = closed)
  let s=`<rect x="${x-w/2-34}" y="${y-h/2-34}" width="${w+68}" height="${h+68}" rx="${(w+68)/2}" fill="#eceef2"/><rect x="${x-w/2-12}" y="${y-h/2-12}" width="${w+24}" height="${h+24}" rx="${(w+24)/2}" fill="#c9ced6"/>`;
  s+=`<defs><clipPath id="ov${Math.round(x)}"><rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="${w/2}"/></clipPath></defs><g clip-path="url(#ov${Math.round(x)})">${inner}`;
  const sh=h*shade;
  s+=`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${sh.toFixed(1)}" fill="#cfd3d9"/>`;
  for(let ry=y-h/2+18;ry<y-h/2+sh-20;ry+=26) s+=`<rect x="${x-w/2}" y="${ry.toFixed(1)}" width="${w}" height="3" fill="#b9bec6"/>`;
  s+=`<rect x="${x-w/2}" y="${(y-h/2+sh-18).toFixed(1)}" width="${w}" height="18" fill="#9aa3ad"/><rect x="${x-w*.16}" y="${(y-h/2+sh-40).toFixed(1)}" width="${w*.32}" height="22" rx="11" fill="#6a7080"/></g>`;
  return s;
}
function voidOutside(x,y,w,h,t,o={}){
  let s=`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" fill="#8f9399"/>`;
  for(let i=0;i<7;i++){const fx=((i*170-t*40)%(w+300))+x-w/2-150, fy=y-h/2+(i*97)%h;s+=`<ellipse cx="${fx.toFixed(0)}" cy="${fy}" rx="${160+i*14}" ry="${60+i*6}" fill="#b5b9bf" opacity=".35"/>`}
  if(o.beast!=null){const ex=lerp(x+w*.75,x-w*.95,o.beast), bx=ex+w*.62;
    s+=`<ellipse cx="${bx.toFixed(0)}" cy="${y+40}" rx="${w*1.1}" ry="${h*.6}" fill="#33363d"/><ellipse cx="${bx.toFixed(0)}" cy="${y-h*.18}" rx="${w*.9}" ry="${h*.18}" fill="#3d4048"/>`;
    s+=`<ellipse cx="${ex.toFixed(0)}" cy="${y-10}" rx="${w*.2}" ry="${w*.15}" fill="#e9e1c8"/><ellipse cx="${ex.toFixed(0)}" cy="${y-10}" rx="${w*.06}" ry="${w*.14}" fill="#14161c"/><ellipse cx="${ex.toFixed(0)}" cy="${y-10}" rx="${w*.26}" ry="${w*.2}" fill="none" stroke="#26282e" stroke-width="${w*.04}"/>`;}
  return s;
}

// ---------- scene key times ----------
function seatRow(t,o={}){ // facing a row of three seats, window on the left wall
  let s=`<rect width="1080" height="1100" fill="#cfd3dc"/><rect width="1080" height="200" fill="#e9ebf0"/><rect x="0" y="160" width="1080" height="70" fill="#f2efe8"/>`;
  s+=oval(110,470,150,210,voidOutside(110,470,150,210,t),o.shade??1);
  for(const x of [330,560,790]) s+=`<rect x="${x-110}" y="380" width="220" height="460" rx="40" fill="#2f4f8f"/><rect x="${x-96}" y="392" width="192" height="92" rx="20" fill="#eef0f4"/>`;
  s+=`<rect x="190" y="760" width="740" height="120" rx="30" fill="#35508f"/><rect y="880" width="1080" height="220" fill="#3a4370"/>`;
  return s;
}
function armrests(){let s='';for(const x of [215,445,675,905]) s+=`<rect x="${x-16}" y="740" width="32" height="140" rx="12" fill="#4a5a80"/><rect x="${x-22}" y="730" width="44" height="26" rx="10" fill="#5a6a90"/>`;return s}

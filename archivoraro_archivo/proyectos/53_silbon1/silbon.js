// El Silbón — detailed character (SVG, channel style with ink outline + volume). silbonHD(x, feetY, s, t, o)
// local units: feet at y=0, hat top ≈ -1080. o.grin 0..1, o.glow 0..1, o.walk (phase) for later animation
const SB={skin:'#8e9a7a',skinL:'#c2cca6',skinD:'#4f5a44',bone:'#efe6cc',boneD:'#b5a988',shirt:'#d2c6a2',shirtL:'#e8dfc0',shirtD:'#8f8462',
  pants:'#4f4538',pantsD:'#2c261f',sack:'#9c7c4c',sackD:'#5e4828',sackL:'#c8a46a',rope:'#8a7046',ropeL:'#b8985e',hat:'#9a8258',hatD:'#5a4a30',hatL:'#c4a878',
  hair:'#100c12',ink:'#16131b',eye:'#fff4c0'};
let _sbn=0;
const sbId=p=>p+(++_sbn);
const pth=pts=>'M'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L');
function sbGrad(id,x1,y1,x2,y2,stops){return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}" stop-opacity="${a??1}"/>`).join('')}</linearGradient>`}
// tapered, slightly bulging limb with gradient fill and moon rim on the left edge
function sbLimb(a,b,wa,wb,grad,o={}){const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,m=[(a[0]+b[0])/2,(a[1]+b[1])/2],wm=(wa+wb)/2*(o.bulge??1.05);
  const d=`M${(a[0]+nx*wa/2).toFixed(1)},${(a[1]+ny*wa/2).toFixed(1)} Q${(m[0]+nx*wm/2).toFixed(1)},${(m[1]+ny*wm/2).toFixed(1)} ${(b[0]+nx*wb/2).toFixed(1)},${(b[1]+ny*wb/2).toFixed(1)} L${(b[0]-nx*wb/2).toFixed(1)},${(b[1]-ny*wb/2).toFixed(1)} Q${(m[0]-nx*wm/2).toFixed(1)},${(m[1]-ny*wm/2).toFixed(1)} ${(a[0]-nx*wa/2).toFixed(1)},${(a[1]-ny*wa/2).toFixed(1)} Z`;
  return `<path d="${d}" fill="url(#${grad})" stroke="${SB.ink}" stroke-width="${o.sw||5}" stroke-linejoin="round"/>`+(o.rim!==false?`<path d="M${(a[0]-nx*wa/2+2).toFixed(1)},${(a[1]-ny*wa/2).toFixed(1)} Q${(m[0]-nx*wm/2+2).toFixed(1)},${(m[1]-ny*wm/2).toFixed(1)} ${(b[0]-nx*wb/2+2).toFixed(1)},${(b[1]-ny*wb/2).toFixed(1)}" stroke="#c9dcff" stroke-width="3" fill="none" opacity=".5"/>`:'')}
const sbJoint=(p,r,g)=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="${r}" ry="${r*.86}" fill="url(#${g})" stroke="${SB.ink}" stroke-width="5"/><path d="M${p[0]-r*.5},${p[1]-r*.3} q${r*.4},-${r*.3} ${r*.8},0" stroke="${SB.skinL}" stroke-width="2.5" fill="none" opacity=".7"/>`;
// long bony hand: wrist, direction angle (deg; 90=down), finger curl
function sbHand(w,ang,g,len=1,curl=.15){let s='';const a0=ang*Math.PI/180,px=Math.cos(a0+Math.PI/2),py=Math.sin(a0+Math.PI/2);
  const pc=[w[0]+Math.cos(a0)*26,w[1]+Math.sin(a0)*26];
  s+=`<path d="M${(w[0]+px*14).toFixed(1)},${(w[1]+py*14).toFixed(1)} L${(pc[0]+px*24+Math.cos(a0)*20).toFixed(1)},${(pc[1]+py*24+Math.sin(a0)*20).toFixed(1)} L${(pc[0]-px*24+Math.cos(a0)*20).toFixed(1)},${(pc[1]-py*24+Math.sin(a0)*20).toFixed(1)} L${(w[0]-px*14).toFixed(1)},${(w[1]-py*14).toFixed(1)}Z" fill="url(#${g})" stroke="${SB.ink}" stroke-width="5" stroke-linejoin="round"/>`;
  for(let i=0;i<5;i++){const thumb=i===0, off=thumb?24:(i-2.5)*12, aa=a0+(thumb?-.55:(i-2.5)*.07);
    const base=[pc[0]+px*off+Math.cos(a0)*(thumb?4:20),pc[1]+py*off+Math.sin(a0)*(thumb?4:20)];
    const l1=(thumb?30:48-Math.abs(i-2.5)*4)*len,l2=(thumb?24:42-Math.abs(i-2.5)*4)*len,k=[base[0]+Math.cos(aa)*l1,base[1]+Math.sin(aa)*l1],a2=aa+curl*(1+i*.15),tip=[k[0]+Math.cos(a2)*l2,k[1]+Math.sin(a2)*l2];
    const d=`M${base[0].toFixed(1)},${base[1].toFixed(1)} L${k[0].toFixed(1)},${k[1].toFixed(1)} L${tip[0].toFixed(1)},${tip[1].toFixed(1)}`;
    s+=`<path d="${d}" stroke="${SB.ink}" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${SB.skin}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    s+=`<ellipse cx="${k[0].toFixed(1)}" cy="${k[1].toFixed(1)}" rx="6" ry="5" fill="${SB.skinL}" stroke="${SB.ink}" stroke-width="2.5"/><path d="M${tip[0].toFixed(1)},${tip[1].toFixed(1)} l${(Math.cos(a2)*10).toFixed(1)},${(Math.sin(a2)*10).toFixed(1)}" stroke="#2c2618" stroke-width="5.5" stroke-linecap="round"/>`;}
  return s}
function sbFoot(a,dir,g){const [x,y]=a;return `<path d="M${x-18*dir},${y-6} Q${x-20*dir},${y+30} ${x},${y+40} L${x+74*dir},${y+44} Q${x+92*dir},${y+44} ${x+86*dir},${y+30} Q${x+40*dir},${y+16} ${x+16*dir},${y-8}Z" fill="url(#${g})" stroke="${SB.ink}" stroke-width="5" stroke-linejoin="round"/>`+
  [0,1,2,3].map(i=>`<path d="M${x+(52+i*9)*dir},${y+30} l${(10)*dir},${12}" stroke="${SB.ink}" stroke-width="4" stroke-linecap="round"/>`).join('')+`<circle cx="${x+4*dir}" cy="${y+18}" r="7" fill="${SB.skinL}" stroke="${SB.ink}" stroke-width="2.5"/>`}
// burlap sack hanging on his back; opening at (ox,oy), a skull and a femur sticking out
function sbSack(ox,oy,ids){const {bur,shade}=ids;
  const body=`M${ox-40},${oy+16} C${ox-110},${oy+70} ${ox-100},${oy+300} ${ox-40},${oy+380} C${ox},${oy+430} ${ox+120},${oy+420} ${ox+150},${oy+330} C${ox+190},${oy+210} ${ox+120},${oy+40} ${ox+40},${oy+10} Z`;
  let s=`<path d="${body}" fill="url(#${bur})" stroke="${SB.ink}" stroke-width="6"/><path d="${body}" fill="url(#${shade})"/>`;
  for(const [bx,by,r,rot] of [[10,150,40,-10],[70,240,36,15],[0,320,32,-4],[100,140,26,30]]) s+=`<g transform="rotate(${rot} ${ox+bx} ${oy+by})"><path d="M${ox+bx-r},${oy+by} q${r},${-r*.8} ${2*r},0" stroke="${SB.sackL}" stroke-width="5" fill="none" opacity=".7"/><path d="M${ox+bx-r+4},${oy+by+6} q${r-4},${r*.45} ${2*r-8},0" stroke="${SB.sackD}" stroke-width="5" fill="none" opacity=".8"/></g>`;
  s+=`<path d="M${ox+128},${oy+120} Q${ox+160},${oy+220} ${ox+132},${oy+320}" stroke="${SB.sackD}" stroke-width="5" fill="none" stroke-dasharray="11,8"/>`;
  s+=`<g transform="rotate(-14 ${ox+10} ${oy+260})"><rect x="${ox-26}" y="${oy+232}" width="64" height="58" fill="#7c6a48" stroke="${SB.ink}" stroke-width="3.5"/>${[0,1,2,3,4,5].map(i=>`<path d="M${ox-24+i*12},${oy+228} l3,9" stroke="${SB.ink}" stroke-width="2.5"/>`).join('')}</g>`;
  // femur
  s+=`<g transform="translate(${ox+44},${oy+6}) rotate(28)"><path d="M0,0 L0,-120" stroke="${SB.ink}" stroke-width="26" stroke-linecap="round"/><path d="M0,0 L0,-120" stroke="${SB.bone}" stroke-width="16" stroke-linecap="round"/><path d="M-4,-10 L-4,-110" stroke="${SB.boneD}" stroke-width="4"/><circle cx="-10" cy="-126" r="14" fill="${SB.bone}" stroke="${SB.ink}" stroke-width="4"/><circle cx="10" cy="-128" r="14" fill="${SB.bone}" stroke="${SB.ink}" stroke-width="4"/></g>`;
  // the father's skull peeking out
  s+=`<g transform="translate(${ox+14},${oy-22}) rotate(14)"><path d="M-34,4 Q-38,-54 0,-58 Q38,-54 34,4 Q30,20 16,22 L16,36 L-16,36 L-16,22 Q-30,20 -34,4Z" fill="${SB.bone}" stroke="${SB.ink}" stroke-width="5"/><path d="M-30,-26 Q-34,0 -24,14" stroke="${SB.boneD}" stroke-width="5" fill="none"/>
    <path d="M-24,-14 Q-13,-26 -3,-12 Q-6,2 -15,2 Q-24,0 -24,-14Z" fill="#120d10"/><path d="M24,-14 Q13,-26 3,-12 Q6,2 15,2 Q24,0 24,-14Z" fill="#120d10"/><path d="M0,6 l-6,11 h12z" fill="#120d10"/>${[-10,-3,4,11].map(x=>`<path d="M${x},24 v12" stroke="${SB.ink}" stroke-width="3"/>`).join('')}<path d="M-12,-44 l6,10 l-4,8" stroke="${SB.boneD}" stroke-width="2.5" fill="none"/></g>`;
  // gathered neck tied with rope
  s+=`<path d="M${ox-44},${oy+18} Q${ox},${oy-6} ${ox+46},${oy+14} L${ox+36},${oy+40} Q${ox},${oy+26} ${ox-34},${oy+42} Z" fill="${SB.sackD}" stroke="${SB.ink}" stroke-width="5"/>`;
  s+=`<path d="M${ox-40},${oy+34} Q${ox},${oy+50} ${ox+42},${oy+30}" stroke="${SB.ink}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M${ox-40},${oy+34} Q${ox},${oy+50} ${ox+42},${oy+30}" stroke="${SB.rope}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${ox-40},${oy+34} Q${ox},${oy+50} ${ox+42},${oy+30}" stroke="${SB.ropeL}" stroke-width="3" stroke-dasharray="7,7" fill="none"/>`;
  return s}
function sbHat(x,y,w,rot,ids){let s=`<g transform="translate(${x},${y}) rotate(${rot})">`;
  let brim='M'+(-w)+',0';for(let i=0;i<=40;i++){const a=Math.PI+i/40*Math.PI;brim+=` L${(Math.cos(a)*w).toFixed(1)},${(Math.sin(a)*w*.19+(i%2?2:-2)).toFixed(1)}`;}
  for(let i=0;i<=40;i++){const a=i/40*Math.PI;brim+=` L${(Math.cos(a)*w+(i%3?0:3)).toFixed(1)},${(Math.sin(a)*w*.26+(i%2?6:0)).toFixed(1)}`;}
  s+=`<path d="${brim}Z" fill="url(#${ids.straw})" stroke="${SB.ink}" stroke-width="6" stroke-linejoin="round"/><path d="${brim}Z" fill="url(#${ids.hatShade})"/>`;
  for(let i=0;i<18;i++){const a=i/18*Math.PI,px=Math.cos(a)*w,py=Math.sin(a)*w*.26;s+=`<path d="M${px.toFixed(1)},${py.toFixed(1)} l${(Math.cos(a)*12).toFixed(1)},${(6+i%3*5)}" stroke="${SB.hatD}" stroke-width="3" stroke-linecap="round"/>`;}
  s+=`<path d="M${-w*.24},${w*.2} l-10,22 m40,-18 l2,24 m40,-24 l12,18" stroke="${SB.hatD}" stroke-width="3"/>`;
  s+=`<path d="M${-w*.42},-6 Q${-w*.47},${-w*.58} ${-w*.12},${-w*.63} Q0,${-w*.5} ${w*.12},${-w*.63} Q${w*.47},${-w*.58} ${w*.42},-6 Z" fill="url(#${ids.straw})" stroke="${SB.ink}" stroke-width="6" stroke-linejoin="round"/>`;
  s+=`<path d="M${-w*.42},-6 Q${-w*.47},${-w*.58} ${-w*.12},${-w*.63} L${-w*.1},-6Z" fill="#000" opacity=".2"/>`;
  s+=`<path d="M${-w*.43},-8 Q0,${-w*.03} ${w*.43},-8 L${w*.42},${-w*.15} Q0,${-w*.2} ${-w*.42},${-w*.15} Z" fill="#2a1e16" stroke="${SB.ink}" stroke-width="4"/>`;
  s+=`<path d="M${w*.12},${-w*.48} q8,-8 16,0 q-2,10 -8,10 q-8,0 -8,-10Z" fill="#06050a" stroke="${SB.ink}" stroke-width="2.5"/><path d="M${-w*.34},${-w*.4} q${w*.1},${-w*.12} ${w*.22},-${w*.1}" stroke="${SB.hatL}" stroke-width="3" fill="none" opacity=".55"/>`;
  return s+`</g>`}
function sbHead(cx,cy,o,ids){let s='';const glow=o.glow??1,grin=o.grin??1;
  // straggly long hair (behind)
  for(let i=0;i<12;i++){const side=i<6?-1:1,k=i%6,x=cx+side*(34+k*4),len=110+((i*41)%70);s+=`<path d="M${x},${cy-52} q${side*(8+k*3)},${len*.45} ${side*(k*2-2)},${len}" stroke="${SB.hair}" stroke-width="${8-k%3*2}" fill="none" stroke-linecap="round"/>`;}
  // skull-like head: wide cranium, cheekbones, narrow long jaw
  const head=`M${cx-56},${cy-56} Q${cx-64},${cy-6} ${cx-54},${cy+22} Q${cx-46},${cy+40} ${cx-40},${cy+62} Q${cx-30},${cy+100} ${cx},${cy+108} Q${cx+30},${cy+100} ${cx+40},${cy+62} Q${cx+46},${cy+40} ${cx+54},${cy+22} Q${cx+64},${cy-6} ${cx+56},${cy-56} Q${cx},${cy-84} ${cx-56},${cy-56}Z`;
  s+=`<path d="${head}" fill="url(#${ids.face})" stroke="${SB.ink}" stroke-width="6"/>`;
  // hollow cheeks + temples
  s+=`<path d="M${cx-44},${cy+28} Q${cx-30},${cy+30} ${cx-22},${cy+64} Q${cx-36},${cy+70} ${cx-42},${cy+56}Z" fill="${SB.skinD}" opacity=".75"/><path d="M${cx+44},${cy+28} Q${cx+30},${cy+30} ${cx+22},${cy+64} Q${cx+36},${cy+70} ${cx+42},${cy+56}Z" fill="${SB.skinD}" opacity=".6"/>`;
  s+=`<path d="M${cx-50},${cy+18} q14,-10 30,-2 M${cx+20},${cy+16} q16,-8 30,2" stroke="${SB.skinL}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  // brow ridge + deep sockets + pinpoint glowing eyes
  s+=`<path d="M${cx-48},${cy-14} Q${cx-24},${cy-30} ${cx-4},${cy-14} Q${cx-6},${cy+10} ${cx-24},${cy+12} Q${cx-46},${cy+10} ${cx-48},${cy-14}Z" fill="#080609" stroke="${SB.ink}" stroke-width="3"/>`;
  s+=`<path d="M${cx+48},${cy-14} Q${cx+24},${cy-30} ${cx+4},${cy-14} Q${cx+6},${cy+10} ${cx+24},${cy+12} Q${cx+46},${cy+10} ${cx+48},${cy-14}Z" fill="#080609" stroke="${SB.ink}" stroke-width="3"/>`;
  if(glow>0) for(const ex of [cx-24,cx+24]) s+=`<circle cx="${ex}" cy="${cy-2}" r="22" fill="url(#${ids.eye})" opacity="${glow}"/><circle cx="${ex}" cy="${cy-2}" r="4.5" fill="${SB.eye}" opacity="${glow}"/>`;
  s+=`<path d="M${cx-52},${cy-20} Q${cx-26},${cy-38} ${cx-2},${cy-22} M${cx+2},${cy-22} Q${cx+26},${cy-38} ${cx+52},${cy-20}" stroke="${SB.ink}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  // skull nose: narrow bridge, two dark nostril slits
  s+=`<path d="M${cx},${cy-10} Q${cx+5},${cy+16} ${cx+7},${cy+34}" stroke="${SB.skinD}" stroke-width="4" fill="none"/><path d="M${cx-2},${cy+30} q-8,6 -2,12 M${cx+6},${cy+30} q8,6 2,12" stroke="${SB.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  // lipless grin: long irregular teeth
  s+=`<path d="M${cx-34},${cy+58} Q${cx},${cy+66+10*grin} ${cx+34},${cy+58} Q${cx},${cy+76+18*grin} ${cx-34},${cy+58}Z" fill="#1c0c10" stroke="${SB.ink}" stroke-width="4"/>`;
  for(const [dx,h,w] of [[-26,9,6],[-18,13,7],[-9,15,7],[0,14,7],[9,15,7],[18,12,6],[25,8,5]]) s+=`<path d="M${cx+dx},${cy+60+Math.abs(dx)*.1} l${w},0 l-1,${h*grin} q-${w/2-1},3 -${w-2},0Z" fill="${SB.bone}" stroke="${SB.ink}" stroke-width="1.6"/>`;
  s+=`<path d="M${cx-38},${cy+54} q8,6 4,14 M${cx+38},${cy+54} q-8,6 -4,14" stroke="${SB.ink}" stroke-width="3.5" fill="none"/>`;
  s+=`<path d="M${cx-20},${cy+92} q20,10 40,0" stroke="${SB.skinD}" stroke-width="4" fill="none"/>`;
  // shadow of the hat brim on the upper face
  s+=`<path d="${head}" fill="url(#${ids.brimShadow})"/>`;
  return s}
function silbonHD(x,y,s,t,o={}){
  const ids={skin:sbId('sk'),face:sbId('fc'),shirt:sbId('sh'),pants:sbId('pa'),bur:sbId('bu'),shade:sbId('sd'),straw:sbId('st'),hatShade:sbId('hs'),brimShadow:sbId('bs'),eye:sbId('ey'),torsoSh:sbId('ts')};
  let d=`<defs>${sbGrad(ids.skin,0,0,1,0,[[0,SB.skinL],[.35,SB.skin],[1,SB.skinD]])}${sbGrad(ids.shirt,0,0,1,1,[[0,SB.shirtL],[.5,SB.shirt],[1,SB.shirtD]])}${sbGrad(ids.pants,0,0,1,0,[[0,'#6a5e4c'],[.5,SB.pants],[1,SB.pantsD]])}
    <radialGradient id="${ids.face}" cx=".38" cy=".4" r=".75"><stop offset="0" stop-color="${SB.skinL}"/><stop offset=".55" stop-color="${SB.skin}"/><stop offset="1" stop-color="${SB.skinD}"/></radialGradient>
    <radialGradient id="${ids.eye}"><stop offset="0" stop-color="${SB.eye}" stop-opacity=".9"/><stop offset=".3" stop-color="${SB.eye}" stop-opacity=".35"/><stop offset="1" stop-color="${SB.eye}" stop-opacity="0"/></radialGradient>
    ${sbGrad(ids.brimShadow,0,0,0,1,[[0,'#000',.75],[.38,'#000',.35],[.55,'#000',0]])}${sbGrad(ids.hatShade,0,0,0,1,[[0,'#000',0],[1,'#000',.35]])}${sbGrad(ids.torsoSh,0,0,1,0,[[0,'#000',0],[.6,'#000',0],[1,'#000',.45]])}
    <pattern id="${ids.bur}" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(10)"><rect width="12" height="12" fill="${SB.sack}"/><path d="M0,3 H12 M0,9 H12" stroke="${SB.sackD}" stroke-width="2.4" opacity=".6"/><path d="M3,0 V12 M9,0 V12" stroke="${SB.sackL}" stroke-width="2" opacity=".4"/></pattern>
    <radialGradient id="${ids.shade}" cx=".3" cy=".3" r=".85"><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
    <pattern id="${ids.straw}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><rect width="10" height="10" fill="${SB.hat}"/><path d="M0,5 H10" stroke="${SB.hatD}" stroke-width="2.2" opacity=".55"/><path d="M5,0 V10" stroke="${SB.hatL}" stroke-width="1.6" opacity=".45"/></pattern></defs>`;
  const sway=Math.sin(t*1.1)*1.5;let g=d;
  // ---- sack on his back (behind everything): opening just over the right shoulder
  g+=sbSack(176,-836,ids);
  // ---- legs: knobby knees, ragged pants, bare feet
  const hipL=[-34,-480],knL=[-50,-262],anL=[-46,-46], hipR=[34,-480],knR=[50,-264],anR=[56,-46];
  g+=sbLimb(knR,anR,30,22,ids.skin,{rim:false})+sbJoint(knR,22,ids.skin)+sbFoot(anR,1,ids.skin);
  g+=sbLimb(knL,anL,30,22,ids.skin)+sbJoint(knL,22,ids.skin)+sbFoot(anL,-1,ids.skin);
  const rag=(x0,x1,y0)=>{let p='';const n=7;for(let i=0;i<=n;i++){const x=x1+(x0-x1)*i/n;p+=` L${x.toFixed(1)},${(y0+(i%2?26:2)+(i%3)*4).toFixed(1)}`;}return p};
  g+=`<path d="M-92,-500 L88,-500 Q96,-400 90,-330 L86,-200${rag(14,88,-200)} L10,-330 L-8,-330 L-14,-200${rag(-92,-14,-200)} L-94,-330 Q-100,-410 -92,-500 Z" fill="url(#${ids.pants})" stroke="${SB.ink}" stroke-width="6" stroke-linejoin="round"/>`;
  g+=`<path d="M0,-330 L2,-480" stroke="${SB.pantsD}" stroke-width="5"/><path d="M-70,-420 q20,30 10,70 M60,-430 q-14,40 0,80" stroke="${SB.pantsD}" stroke-width="4" fill="none" opacity=".7"/>`;
  g+=`<g transform="rotate(5 56 -380)"><rect x="34" y="-410" width="46" height="50" fill="#6e5e48" stroke="${SB.ink}" stroke-width="3.5"/>${[0,1,2,3].map(i=>`<path d="M${36+i*12},-414 l2,9" stroke="${SB.ink}" stroke-width="2.5"/>`).join('')}</g><ellipse cx="-58" cy="-300" rx="14" ry="20" fill="#000" opacity=".25"/>`;
  // ---- hunched torso (leans forward)
  g+=`<g transform="rotate(${6+sway+(o.lean||0)} 0 -490)">`;
  const torso=`M-92,-490 Q-108,-660 -92,-800 Q-66,-858 0,-862 Q66,-858 94,-800 Q112,-660 92,-490 Z`;
  g+=`<path d="${torso}" fill="url(#${ids.skin})" stroke="${SB.ink}" stroke-width="6"/>`;
  // ribs: curved, shorter toward the bottom, sunken belly, sternum
  g+=`<path d="M-8,-820 L-6,-650" stroke="${SB.skinD}" stroke-width="9" stroke-linecap="round"/><path d="M-12,-820 L-10,-660" stroke="${SB.skinL}" stroke-width="3"/>`;
  for(let i=0;i<7;i++){const yy=-800+i*30,w=74-i*5,dip=16+i*2;for(const sd of [-1,1]){g+=`<path d="M${sd*8},${yy} Q${sd*w*.6},${yy-dip*.2} ${sd*w},${yy+dip}" stroke="${SB.skinD}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M${sd*8},${yy-6} Q${sd*w*.6},${yy-dip*.4} ${sd*(w-6)},${yy+dip-8}" stroke="${SB.skinL}" stroke-width="3" fill="none" opacity=".75"/>`;}}
  g+=`<path d="M-56,-590 Q0,-540 56,-590 Q40,-520 0,-506 Q-40,-520 -56,-590Z" fill="${SB.skinD}" opacity=".55"/>`;
  g+=`<path d="${torso}" fill="url(#${ids.torsoSh})"/>`;
  // torn shirt hanging open: ragged edges, folds, stains, one button left
  const ragE=(pts)=>pts.map((p,i)=>[p[0]+(i%2?6:-4),p[1]]);
  g+=`<path d="${pth([[-98,-486],[-112,-640],[-100,-790],[-66,-850],[-30,-844],...ragE([[-46,-790],[-50,-730],[-40,-680],[-48,-620],[-38,-560],[-50,-500]]),[-62,-470],[-74,-500],[-86,-466]])}Z" fill="url(#${ids.shirt})" stroke="${SB.ink}" stroke-width="5" stroke-linejoin="round"/>`;
  g+=`<path d="${pth([[98,-486],[112,-640],[100,-790],[66,-850],[32,-844],...ragE([[50,-786],[56,-720],[46,-660],[58,-600],[46,-540],[56,-494]]),[70,-466],[82,-498],[94,-470]])}Z" fill="url(#${ids.shirt})" stroke="${SB.ink}" stroke-width="5" stroke-linejoin="round"/>`;
  g+=`<path d="M-84,-760 q10,60 -4,140 M-70,-700 q8,40 0,90 M84,-760 q-10,60 4,140 M72,-690 q-6,40 4,80" stroke="${SB.shirtD}" stroke-width="4" fill="none" opacity=".8"/>`;
  g+=`<ellipse cx="-80" cy="-560" rx="16" ry="24" fill="#7a6a48" opacity=".45"/><ellipse cx="86" cy="-700" rx="12" ry="18" fill="#7a6a48" opacity=".4"/><circle cx="-44" cy="-760" r="6" fill="#5a4a34" stroke="${SB.ink}" stroke-width="2"/><path d="M-46,-700 l-6,6 m0,-6 l6,6" stroke="#5a4a34" stroke-width="3"/>`;
  g+=`<path d="M-66,-850 L-44,-826 L-30,-846 M66,-850 L46,-826 L32,-846" fill="${SB.shirtD}" stroke="${SB.ink}" stroke-width="4"/>`;
  // rope belt
  g+=`<path d="M-100,-506 Q0,-478 100,-506" stroke="${SB.ink}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M-100,-506 Q0,-478 100,-506" stroke="${SB.rope}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M-100,-506 Q0,-478 100,-506" stroke="${SB.ropeL}" stroke-width="4" stroke-dasharray="8,8" fill="none"/><path d="M-26,-490 q-8,40 4,74 M-18,-490 q12,34 2,68" stroke="${SB.rope}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  // the sack's strap across the chest (right shoulder → left hip)
  g+=`<path d="M108,-818 Q120,-840 150,-820" stroke="${SB.rope}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  g+=`<path d="M70,-846 Q10,-700 -94,-540" stroke="${SB.ink}" stroke-width="19" fill="none" stroke-linecap="round"/><path d="M70,-846 Q10,-700 -94,-540" stroke="${SB.rope}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M70,-846 Q10,-700 -94,-540" stroke="${SB.ropeL}" stroke-width="4" stroke-dasharray="9,8" fill="none"/>`;
  // collarbones + neck (forward)
  g+=`<path d="M-64,-832 Q-30,-818 -8,-826 M64,-832 Q30,-818 8,-826" stroke="${SB.skinD}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  g+=sbLimb([0,-846],[20,-916],46,36,ids.skin,{bulge:.9})+`<path d="M-10,-850 L10,-910 M14,-850 L26,-910" stroke="${SB.skinD}" stroke-width="3.5"/>`;
  // right arm: grips the strap at the chest
  const shR=[70,-820],elR=[112,-680],hR=[48,-720];
  g+=sbLimb(shR,[96,-740],52,46,ids.shirt,{rim:false})+`<path d="M78,-740 l10,14 l10,-12 l10,14 l8,-12" stroke="${SB.ink}" stroke-width="4" fill="none"/>`;
  g+=`<path d="M78,-800 q14,20 10,46 M92,-806 q10,24 6,50" stroke="${SB.shirtD}" stroke-width="4" fill="none"/>`;
  g+=sbLimb([96,-740],elR,26,22,ids.skin,{rim:false})+sbJoint(elR,16,ids.skin)+sbLimb(elR,hR,22,18,ids.skin,{rim:false});
  g+=sbHand(hR,-150,ids.skin,.8,1.5);
  // left arm hanging to the knee, sleeve torn at the elbow
  const shL=[-76,-820],elL=[-118,-620],wrL=[-130,-420];
  g+=sbLimb(shL,[-100,-712],54,46,ids.shirt)+`<path d="M-124,-712 l8,16 l10,-12 l8,16 l10,-14 l8,12" stroke="${SB.ink}" stroke-width="4" fill="none"/>`;
  g+=`<path d="M-84,-800 q-14,30 -12,70 M-100,-790 q-10,30 -6,62" stroke="${SB.shirtD}" stroke-width="4" fill="none"/>`;
  g+=sbLimb([-100,-708],elL,26,24,ids.skin)+sbJoint(elL,17,ids.skin)+sbLimb(elL,wrL,24,17,ids.skin);
  g+=sbHand(wrL,95,ids.skin,1.3,.16);
  // head (jutting forward) + hat
  g+=sbHead(34,-978,o,ids);
  g+=sbHat(36,-1034,150,-4+(o.hatTilt||0),ids);   // sits on the skull, brim at the brow
  g+=`</g>`;
  return `<g transform="translate(${x},${y}) scale(${(s*(o.dir||1)).toFixed(4)},${s})" opacity="${o.fade??1}">${g}</g>`}

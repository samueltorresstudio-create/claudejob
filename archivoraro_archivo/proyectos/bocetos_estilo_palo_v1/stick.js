// Archivo Raro · stickman. Proporciones calcadas del fotograma de referencia (hombre de la corbata):
// cabeza 1,17 veces más ancha que alta · cuerpo 0,57 del ancho de la cabeza y 1,07 de su altura · piernas 1,6 de su altura
const INK='#1a0f13', SKIN='#f6e7eb', SHADE='#dcc6d3', OW=9, LW=8.2;
let _id=0; const uid=p=>p+(++_id);
const HY=-598, RX=114, RY=106, ROT=8;
function stroke(pts,w=LW){return `<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`}
function curve(d,w=LW){return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`}
const HEAD=`<ellipse cx="0" cy="${HY}" rx="${RX}" ry="${RY}" transform="rotate(${ROT} 0 ${HY})"/>`;
const headShape=(attrs)=>`<ellipse cx="0" cy="${HY}" rx="${RX}" ry="${RY}" transform="rotate(${ROT} 0 ${HY})" ${attrs}/>`;
function brow(x,y,ang,len,arc,th=8.5){return `<path transform="translate(${x},${y}) rotate(${ang})" d="M${-len/2},${arc*.4} Q0,${-arc} ${len/2},${arc*.4}" fill="none" stroke="${INK}" stroke-width="${th}" stroke-linecap="round"/>`}
function eye(x,y,type,sd,o){switch(type){
  case 'lid': return `<g transform="translate(${x},${y}) rotate(${sd*(o.lidTilt??2)})"><line x1="-20" y1="0" x2="20" y2="0" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/><path d="M-9,0 Q-9,15 0,15 Q9,15 9,0 Z" fill="${INK}"/></g>`;
  case 'wide': return `<circle cx="${x}" cy="${y+4}" r="21" fill="#fff" stroke="${INK}" stroke-width="6.5"/><circle cx="${x+(o.px||0)}" cy="${y+4+(o.py||0)}" r="6" fill="${INK}"/>`;
  case 'happy': return curve(`M${x-15},${y+8} Q${x},${y-10} ${x+15},${y+8}`,7);
  case 'angry': return `<g transform="translate(${x},${y}) rotate(${sd*-14})"><line x1="-18" y1="0" x2="18" y2="0" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/><path d="M-9,0 Q-9,14 0,14 Q9,14 9,0 Z" fill="${INK}"/></g>`;}}
function head(o){const g=uid('hg'), c=uid('hc');
  let s=`<defs><radialGradient id="${g}" cx=".62" cy=".32" r=".82"><stop offset=".62" stop-color="${o.skin||SKIN}"/><stop offset="1" stop-color="${SHADE}"/></radialGradient><clipPath id="${c}">${HEAD}</clipPath></defs>`;
  s+=headShape(`fill="url(#${g})"`);
  s+=`<g clip-path="url(#${c})">${o.hair||''}</g>`;
  s+=headShape(`fill="none" stroke="${INK}" stroke-width="${OW}"`);
  s+=o.hairOver||'';
  const lx=o.lx||0, ey=HY+(o.eyeY??-6), ex=30;
  for(const sd of [-1,1]) s+=eye(sd*ex+lx,ey,o.eyes||'lid',sd,o);
  const B=o.brows||[0,0], by=ey-(o.browY??30);
  s+=brow(-ex+lx-2,by-(o.bL||0),B[0],o.bLenL||38,o.bArcL??6)+brow(ex+lx+2,by-(o.bR||0),B[1],o.bLenR||38,o.bArcR??6);
  s+=o.face||'';
  const my=ey+(o.mouthY??43), mx=lx+(o.mx||2);
  switch(o.mouth||'small'){
    case 'small': s+=`<path d="M${mx-11},${my+2} Q${mx},${my-7} ${mx+11},${my+2} Q${mx},${my+4} ${mx-11},${my+2} Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;break;
    case 'smirk': s+=curve(`M${mx-13},${my+2} Q${mx},${my+5} ${mx+14},${my-6}`,6);break;
    case 'smile': s+=curve(`M${mx-14},${my-3} Q${mx},${my+10} ${mx+14},${my-3}`,6);break;
    case 'grin': s+=`<path d="M${mx-24},${my-8} L${mx+24},${my-8} Q${mx+20},${my+20} ${mx},${my+20} Q${mx-20},${my+20} ${mx-24},${my-8} Z" fill="${INK}"/><path d="M${mx-18},${my-6} L${mx+18},${my-6} L${mx+16},${my+2} L${mx-16},${my+2} Z" fill="#fff"/>`;break;
    case 'teeth': s+=`<rect x="${mx-19}" y="${my-11}" width="38" height="24" rx="4" fill="#fff" stroke="${INK}" stroke-width="5.5"/><line x1="${mx-19}" y1="${my+1}" x2="${mx+19}" y2="${my+1}" stroke="${INK}" stroke-width="3"/>`+[-6,6].map(d=>`<line x1="${mx+d}" y1="${my-11}" x2="${mx+d}" y2="${my+13}" stroke="${INK}" stroke-width="3"/>`).join('');break;
    case 'o': s+=`<ellipse cx="${mx}" cy="${my+2}" rx="9" ry="12" fill="${INK}"/>`;break;
    case 'frown': s+=curve(`M${mx-14},${my+5} Q${mx},${my-6} ${mx+14},${my+5}`,6);break;}
  s+=o.overFace||'';
  return s+(o.hat||'');}
// cuerpo: tubo con laterales algo abombados y fondo en U; arriba más estrecho, metido bajo la cabeza
const TORSO='M-44,-545 C-60,-480 -62,-380 -58,-334 C-55,-298 -34,-290 0,-290 C34,-290 55,-298 58,-334 C62,-380 60,-480 44,-545 Z';
function body(o){let s=o.back||'';
  const L=o.legL||'M-26,-305 L-56,0', R=o.legR||'M26,-305 L56,0';
  s+=curve(L)+curve(R);
  if(o.feet) s+=o.feet; else if(!o.legL){s+=curve('M-56,0 L-62,4',10)+curve('M56,0 L62,4',10);}
  s+=o.armBack||'';
  const g=uid('tg'), c=uid('tc'), col=o.top||SKIN;
  s+=`<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1830" stop-opacity=".16"/></linearGradient><clipPath id="${c}"><path d="${TORSO}"/></clipPath></defs>`;
  s+=`<path d="${TORSO}" fill="${col}"/><g clip-path="url(#${c})">${o.chest||''}<rect x="-80" y="-560" width="160" height="300" fill="url(#${g})"/></g><path d="${TORSO}" fill="none" stroke="${INK}" stroke-width="${OW}"/>`;
  return s+(o.chestOver||'');}
const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="9" fill="${SKIN}" stroke="${INK}" stroke-width="5"/>`;
function arm(d,hx,hy){return curve(d)+hand(hx,hy)}
function figure(o,x,y,s){return `<g transform="translate(${x},${y}) scale(${s})">`+body(o)+(o.arms||'')+head(o)+(o.front||'')+`</g>`}

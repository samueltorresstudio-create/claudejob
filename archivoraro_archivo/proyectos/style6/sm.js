// ===== Archivo Raro · stickman style =====
// Big white head with volume, expressive brows and half-lids, small clothed torso, thin ink limbs.
const SMK='#1b1a22';
const smMix=(a,b,k)=>{const h=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));const A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('')};
let __sm=0;
function SM(o){
  const d=Object.assign({x:0,y:0,s:1,top:'#3a5a7a',expr:'neutral',look:[0,0],armL:'down',armR:'down',legs:'stand',head:'#f7f5f0',flip:1},o);
  const id='sm'+(++__sm), K=SMK, W=8;
  const R=100, hy=-470, tw=d.tw||62, tTop=-372, tBot=-205;           // head radius, head centre, torso half-width
  let g=`<ellipse cx="0" cy="4" rx="95" ry="13" fill="#000" opacity=".22"/>`;
  const line=(p,w=W+1)=>`<path d="${p}" stroke="${K}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  // legs
  const legs={stand:[[-24,-6,-30,0],[24,6,30,0]],walk:[[-20,-40,-52,0],[20,30,56,0]],run:[[-26,-90,-110,-40],[22,70,70,0]],sit:[[-26,-160,-60,-150],[26,-160,60,-150]]}[d.legs];
  for(const [hx,kx,fx,fy] of legs){const ky=fy===0?-100:(fy+tBot)/2;g+=line(`M${hx},${tBot-6} Q${kx},${ky} ${fx},${fy-8}`);
    g+=`<path d="M${fx-14},${fy-6} C${fx-14},${fy-22} ${fx+30},${fy-22} ${fx+34},${fy-6} C${fx+34},${fy+2} ${fx-14},${fy+2} ${fx-14},${fy-6}Z" fill="${d.shoes||K}" stroke="${K}" stroke-width="5"/>`;}
  // arms (behind/in front of torso): returns path to a hand point
  const armPath=(side,a)=>{const sx=side, P0=[sx*(tw-8),tTop+26];
    const H={down:[sx*(tw+26),-232],wave:[sx*(tw+70),-560],hip:[sx*(tw+40),-300],point:[sx*(tw+150),-420],hold:[sx*16,-290],up:[sx*(tw+40),-640],face:[sx*30,-450]}[a]||a;
    const E=[(P0[0]+H[0])/2+sx*30,(P0[1]+H[1])/2+18];
    return {p:`M${P0[0]},${P0[1]} Q${E[0]},${E[1]} ${H[0]},${H[1]}`,H};};
  const AL=armPath(-1,d.armL), AR=armPath(1,d.armR);
  const hand=H=>`<circle cx="${H[0]}" cy="${H[1]}" r="13" fill="${d.head}" stroke="${K}" stroke-width="5.5"/>`;
  const behind=a=>a==='hold'||a==='face';
  if(!behind(d.armL)) g+=line(AL.p)+hand(AL.H);
  if(!behind(d.armR)) g+=line(AR.p)+hand(AR.H);
  // torso: small clothed body with detail
  const T=`M${-tw+10},${tTop} C${-tw-8},${tTop+10} ${-tw-6},${tBot-30} ${-tw+6},${tBot} Q0,${tBot+12} ${tw-6},${tBot} C${tw+6},${tBot-30} ${tw+8},${tTop+10} ${tw-10},${tTop} Q0,${tTop-12} ${-tw+10},${tTop}Z`;
  g+=`<path d="${T}" fill="${d.top}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>`;
  g+=`<clipPath id="${id}t"><path d="${T}"/></clipPath><g clip-path="url(#${id}t)"><path d="M${tw*.25},${tTop-20} C${tw*.6},${tTop+60} ${tw*.5},${tBot-20} ${tw*.3},${tBot+20} L${tw+20},${tBot+20} L${tw+20},${tTop-20}Z" fill="#000" opacity=".16"/>`;
  if(d.pants) g+=`<rect x="${-tw-10}" y="${tBot-42}" width="${2*tw+20}" height="60" fill="${d.pants}"/><rect x="${-tw-10}" y="${tBot-46}" width="${2*tw+20}" height="8" fill="${smMix(d.pants,'#000000',.3)}"/>`;
  g+=`</g>`;
  if(d.outfit==='hoodie') g+=`<path d="M-30,${tTop-4} Q0,${tTop+26} 30,${tTop-4}" stroke="${smMix(d.top,'#000000',.3)}" stroke-width="5" fill="none"/><path d="M-12,${tTop+18} l-3,46 M12,${tTop+18} l3,46" stroke="#f3eee6" stroke-width="4.5" stroke-linecap="round"/><path d="M-34,${tBot-70} L34,${tBot-70} L28,${tBot-40} L-28,${tBot-40}Z" fill="none" stroke="${smMix(d.top,'#000000',.3)}" stroke-width="4"/>`;
  if(d.outfit==='tank') g+=`<path d="M-26,${tTop-4} Q0,${tTop+40} 26,${tTop-4}" fill="${d.skinV||'#f7f5f0'}" stroke="${K}" stroke-width="5"/>`;
  if(d.outfit==='polo') g+=`<path d="M-22,${tTop-4} L0,${tTop+22} L22,${tTop-4}" fill="${smMix(d.top,'#ffffff',.25)}" stroke="${K}" stroke-width="5"/><circle cx="0" cy="${tTop+40}" r="4" fill="${K}"/><circle cx="0" cy="${tTop+58}" r="4" fill="${K}"/>`;
  if(d.outfit==='uniform') g+=`<path d="M-6,${tTop+6} L-6,${tBot-50}" stroke="${smMix(d.top,'#000000',.4)}" stroke-width="4"/>`+[0,1,2].map(i=>`<circle cx="6" cy="${tTop+30+i*34}" r="5" fill="#e8c24a" stroke="${K}" stroke-width="2.5"/>`).join('')+`<path d="M${tw-34},${tTop+30} l14,-6 l6,14 l-14,6Z" fill="#e8c24a" stroke="${K}" stroke-width="3"/>`;
  if(d.badge) g+=`<rect x="${-tw+16}" y="${tTop+40}" width="34" height="20" rx="3" fill="#f3eee6" stroke="${K}" stroke-width="3"/>`;
  if(d.bow) g+=`<path d="M0,${tTop+4} L-22,${tTop-8} L-22,${tTop+16}Z M0,${tTop+4} L22,${tTop-8} L22,${tTop+16}Z" fill="${d.bow}" stroke="${K}" stroke-width="4"/><circle cx="0" cy="${tTop+4}" r="6" fill="${d.bow}" stroke="${K}" stroke-width="3"/>`;
  if(d.prop) g+=d.prop;  // something held in front of the chest
  if(behind(d.armL)) g+=line(AL.p)+hand(AL.H);
  if(behind(d.armR)) g+=line(AR.p)+hand(AR.H);
  // head: white ball with volume
  const hairBack={ponytail:`<path d="M60,${hy-40} C140,${hy-20} 150,${hy+80} 120,${hy+140} C112,${hy+70} 100,${hy+30} 60,${hy+10}Z" fill="${d.hair}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>`}[d.hs]||'';
  g+=hairBack;
  g+=`<circle cx="0" cy="${hy}" r="${R}" fill="${smMix(d.head,'#9a9080',.22)}"/>`;
  g+=`<clipPath id="${id}h"><circle cx="0" cy="${hy}" r="${R}"/></clipPath><g clip-path="url(#${id}h)"><circle cx="-14" cy="${hy-16}" r="${R-4}" fill="${d.head}"/><ellipse cx="-38" cy="${hy-50}" rx="26" ry="14" fill="#fff" opacity=".7" transform="rotate(-30 -38 ${hy-50})"/></g>`;
  g+=`<circle cx="0" cy="${hy}" r="${R}" fill="none" stroke="${K}" stroke-width="${W}"/>`;
  // face
  const E=d.expr, [lx,ly]=d.look, ey=hy-6, ex=34;
  let f='';
  const lid={neutral:.45,smug:.55,tired:.62,worried:.2,angry:.4,scared:0,happy:0,surprised:0,sad:.35}[E]??.4;
  for(const sx of [-1,1]){const cx=sx*ex+lx, cy=ey+ly;
    if(E==='happy'){f+=`<path d="M${cx-14},${cy+4} Q${cx},${cy-12} ${cx+14},${cy+4}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>`;continue;}
    if(E==='scared'||E==='surprised'){f+=`<circle cx="${cx}" cy="${cy}" r="20" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="${cx+lx*.3}" cy="${cy+ly*.3}" r="5.5" fill="${K}"/>`;continue;}
    f+=`<ellipse cx="${cx}" cy="${cy}" rx="10" ry="12" fill="${K}"/><circle cx="${cx-3}" cy="${cy-4}" r="3" fill="#fff"/>`;
    if(lid>0) f+=`<path d="M${cx-17},${cy-12+lid*14} L${cx+17},${cy-12+lid*14+(E==='angry'?-sx*4:0)}" stroke="${K}" stroke-width="6" stroke-linecap="round"/><rect x="${cx-16}" y="${cy-30}" width="32" height="${18+lid*14-2}" fill="${d.head}"/>`;}
  // brows: thick and expressive
  const bt={neutral:[0,0],smug:[6,-10],tired:[2,2],worried:[-12,6],angry:[14,-4],scared:[-16,-14],happy:[-4,-6],surprised:[-14,-14],sad:[-12,8]}[E]||[0,0];
  for(const sx of [-1,1]){const inY=ey-38+(sx===1&&E==='smug'?-10:0)-(bt[1]>0?0:0), cx=sx*ex+lx*.5;
    const yIn=ey-36+bt[0]*(1)+(E==='smug'&&sx===1?-12:0), yOut=ey-40+bt[1]+(E==='smug'&&sx===1?-6:0);
    f+=`<path d="M${cx-sx*16},${yIn} L${cx+sx*20},${yOut}" stroke="${d.brow||K}" stroke-width="10" stroke-linecap="round"/>`;}
  // mouth
  const my=hy+48;
  f+={neutral:`<path d="M-14,${my} L14,${my}" stroke="${K}" stroke-width="6" stroke-linecap="round"/>`,
      smug:`<path d="M-16,${my+2} Q4,${my+6} 18,${my-6}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      tired:`<path d="M-12,${my+2} L12,${my}" stroke="${K}" stroke-width="6" stroke-linecap="round"/>`,
      worried:`<path d="M-16,${my+6} Q0,${my-6} 16,${my+6}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      sad:`<path d="M-16,${my+6} Q0,${my-6} 16,${my+6}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      angry:`<path d="M-18,${my+4} Q0,${my-4} 18,${my+4}" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      happy:`<path d="M-26,${my-8} Q0,${my+30} 26,${my-8}Z" fill="#7a2230" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M-18,${my-4} Q0,${my+4} 18,${my-4}" fill="#fff"/>`,
      scared:`<rect x="-22" y="${my-10}" width="44" height="26" rx="10" fill="#fff" stroke="${K}" stroke-width="5"/><path d="M-22,${my+3} L22,${my+3} M-8,${my-10} L-8,${my+16} M8,${my-10} L8,${my+16}" stroke="${K}" stroke-width="3"/>`,
      surprised:`<ellipse cx="0" cy="${my+2}" rx="11" ry="14" fill="#7a2230" stroke="${K}" stroke-width="5"/>`,
      sing:`<ellipse cx="0" cy="${my+2}" rx="16" ry="18" fill="#7a2230" stroke="${K}" stroke-width="5"/><path d="M-10,${my+12} Q0,${my+4} 10,${my+12}" fill="#e0607a"/>`}[E]||'';
  if(d.mustache) f+=`<path d="M-40,${my-14} C-30,${my-34} -8,${my-32} 0,${my-24} C8,${my-32} 30,${my-34} 40,${my-14} C30,${my-10} 12,${my-16} 0,${my-18} C-12,${my-16} -30,${my-10} -40,${my-14}Z" fill="${d.mustache}" stroke="${K}" stroke-width="4"/>`;
  if(d.stubble) f+=`<path d="M-62,${hy+40} Q0,${hy+120} 62,${hy+40}" stroke="${d.hair}" stroke-width="14" fill="none" opacity=".18"/>`;
  if(d.glasses) f+=`<g fill="#fff" fill-opacity=".1" stroke="${K}" stroke-width="5"><circle cx="-34" cy="${ey}" r="24"/><circle cx="34" cy="${ey}" r="24"/></g><path d="M-10,${ey} L10,${ey}" stroke="${K}" stroke-width="5"/>`;
  g+=f;
  // hair / hats on top
  const H={quiff:`<path d="M-97,${hy-4} C-104,${hy-70} -86,${hy-100} -64,${hy-110} L-70,${hy-146} L-30,${hy-122} L-14,${hy-162} L18,${hy-124} L48,${hy-156} L58,${hy-114} L96,${hy-128} L86,${hy-90} C100,${hy-70} 104,${hy-40} 97,${hy-4} C86,${hy-46} 60,${hy-66} 30,${hy-68} C10,${hy-78} -22,${hy-76} -46,${hy-62} C-68,${hy-56} -88,${hy-36} -97,${hy-4}Z" fill="${d.hair}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/><path d="M-50,${hy-96} C-24,${hy-108} 14,${hy-108} 36,${hy-98}" stroke="${smMix(d.hair||'#333333','#ffffff',.25)}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    ponytail:`<path d="M-98,${hy-10} C-104,${hy-110} -20,${hy-128} 30,${hy-112} C80,${hy-100} 106,${hy-60} 98,${hy-10} C80,${hy-60} 40,${hy-80} 0,${hy-76} C-40,${hy-74} -80,${hy-50} -98,${hy-10}Z" fill="${d.hair}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/><circle cx="72" cy="${hy-70}" r="10" fill="#e0607a" stroke="${K}" stroke-width="4"/>`,
    bald:`<path d="M-98,${hy+6} C-104,${hy-30} -96,${hy-50} -84,${hy-60} C-80,${hy-30} -84,${hy-10} -80,${hy+14}Z M98,${hy+6} C104,${hy-30} 96,${hy-50} 84,${hy-60} C80,${hy-30} 84,${hy-10} 80,${hy+14}Z" fill="${d.hair}" stroke="${K}" stroke-width="5"/>`,
    police:`<path d="M-104,${hy-56} L104,${hy-56} L112,${hy-40} L-112,${hy-40}Z" fill="#1d1f2a" stroke="${K}" stroke-width="6"/><path d="M-90,${hy-56} C-110,${hy-130} -40,${hy-150} 0,${hy-148} C60,${hy-150} 120,${hy-130} 96,${hy-56}Z" fill="#2a3a6a" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/><rect x="-96" y="${hy-74}" width="192" height="18" fill="#1d1f2a"/><path d="M0,${hy-118} l12,10 l-4,16 l-16,0 l-4,-16Z" fill="#e8c24a" stroke="${K}" stroke-width="3"/><path d="M-80,${hy-40} Q0,${hy-10} 80,${hy-40}" fill="#111" stroke="${K}" stroke-width="5"/>`,
    beanie:`<path d="M-100,${hy-24} C-104,${hy-120} 104,${hy-120} 100,${hy-24}Z" fill="${d.hat||'#c23a3a'}" stroke="${K}" stroke-width="${W}"/><rect x="-104" y="${hy-44}" width="208" height="28" rx="10" fill="${smMix(d.hat||'#c23a3a','#000000',.2)}" stroke="${K}" stroke-width="6"/>`}[d.hs]||'';
  g+=H;
  if(d.blush) g+=`<ellipse cx="-58" cy="${hy+24}" rx="16" ry="9" fill="#ff7f86" opacity=".4"/><ellipse cx="58" cy="${hy+24}" rx="16" ry="9" fill="#ff7f86" opacity=".4"/>`;
  return `<g transform="translate(${d.x},${d.y}) scale(${d.s*d.flip},${d.s})">${g}</g>`;
}
// Bruno in the same style: German shepherd, ink outline, dot eyes with brows, thin legs
function SMdog(o){
  const d=Object.assign({x:0,y:0,s:1,expr:'alert',dir:1,look:[0,0],tongue:false,wag:0},o), K=SMK;
  let g=`<ellipse cx="0" cy="4" rx="120" ry="12" fill="#000" opacity=".22"/>`;
  const line=p=>`<path d="${p}" stroke="${K}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  for(const [x0,x1] of [[-70,-80],[-40,-36],[50,46],[80,88]]) g+=line(`M${x0},-110 L${x1},-8`)+`<ellipse cx="${x1+8}" cy="-6" rx="16" ry="9" fill="#e0b070" stroke="${K}" stroke-width="5"/>`;
  g+=`<path d="M-100,-150 Q-150,${-180+d.wag} -160,${-240+d.wag}" stroke="${K}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M-100,-150 Q-150,${-180+d.wag} -160,${-240+d.wag}" stroke="#7a5428" stroke-width="18" fill="none" stroke-linecap="round"/>`;
  const body=`M-110,-150 C-112,-200 -60,-210 0,-208 C60,-210 110,-200 108,-150 C106,-110 60,-100 0,-102 C-60,-100 -108,-110 -110,-150Z`;
  g+=`<path d="${body}" fill="#c08a46" stroke="${K}" stroke-width="8"/><clipPath id="dgb"><path d="${body}"/></clipPath><g clip-path="url(#dgb)"><path d="M-120,-170 C-60,-226 40,-226 100,-176 C40,-150 -60,-150 -120,-170Z" fill="#1d1a1c"/><path d="M20,-200 L120,-200 L120,-90 L40,-90Z" fill="#000" opacity=".12"/></g>`;
  // head
  const hx=118, hy=-238;
  g+=`<path d="M${hx-34},${hy-50} L${hx-48},${hy-128} L${hx-4},${hy-62}Z M${hx+20},${hy-62} L${hx+40},${hy-134} L${hx+56},${hy-50}Z" fill="#1d1a1c" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>`;
  g+=`<circle cx="${hx}" cy="${hy}" r="66" fill="#c08a46" stroke="${K}" stroke-width="8"/>`;
  g+=`<path d="M${hx+10},${hy+4} C${hx+70},${hy-6} ${hx+104},${hy+10} ${hx+100},${hy+34} C${hx+96},${hy+60} ${hx+30},${hy+60} ${hx+6},${hy+44}Z" fill="#e0b070" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>`;
  g+=`<path d="M${hx-30},${hy-50} C${hx},${hy-74} ${hx+40},${hy-60} ${hx+50},${hy-30} C${hx+20},${hy-40} ${hx-10},${hy-34} ${hx-30},${hy-50}Z" fill="#1d1a1c"/>`;
  g+=`<ellipse cx="${hx+96}" cy="${hy+18}" rx="15" ry="11" fill="${K}"/>`;
  if(d.tongue) g+=`<path d="M${hx+40},${hy+52} q10,34 30,26 q6,-14 -6,-28Z" fill="#e0607a" stroke="${K}" stroke-width="4"/>`;
  for(const ex of [-6,40]){g+=`<ellipse cx="${hx+ex+d.look[0]}" cy="${hy-6+d.look[1]}" rx="8" ry="10" fill="${K}"/><circle cx="${hx+ex-2+d.look[0]}" cy="${hy-10+d.look[1]}" r="2.6" fill="#fff"/>`;
    const tilt=d.expr==='worried'?8:d.expr==='angry'?-8:0;g+=`<path d="M${hx+ex-14},${hy-30-tilt*(ex<0?-1:1)} L${hx+ex+12},${hy-30+tilt*(ex<0?-1:1)}" stroke="${K}" stroke-width="7" stroke-linecap="round"/>`;}
  g+=`<path d="M${hx-40},${hy+44} L${hx+10},${hy+60}" stroke="#c23a3a" stroke-width="12" stroke-linecap="round"/>`;
  return `<g transform="translate(${d.x},${d.y}) scale(${d.s*d.dir},${d.s})">${g}</g>`;
}

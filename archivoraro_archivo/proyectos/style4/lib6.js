// ===== Archivo Raro · character style v5 =====
// Realistic proportions, simple friendly faces (dot eyes, small brows, tiny nose and mouth),
// one continuous silhouette, halftone-dot shading and the channel's signature: a yellow "misprint"
// echo of the silhouette, offset behind every character (o.echo to change the colour, o.echo:false to hide it).
const INK5='#262331';
const sh5=(c,k)=>mix(c,'#1c1828',k), ti5=(c,k)=>mix(c,'#ffffff',k);
let __p6=0;
function P6(o){
  const d=Object.assign({x:0,y:0,s:1,skin:'#e8b48c',hair:'#3a2a20',hs:'short',top:'#3a5a7a',pants:'#2e3440',shoes:'#e9e4d8',
    outfit:'tee',build:'regular',fem:false,kid:false,expr:'neutral',look:[0,0],arms:'down',eyes:'open',echo:'#ffd34a'},o);
  const id='p6_'+(++__p6), K=d.kid;
  const ST=d.style||'riso';
  const lum=c=>{const [r,g,b]=hex2rgb(c);return (r*.3+g*.59+b*.11)/255;};
  const gray=c=>{const v=Math.round(40+lum(c)*200);const h=v.toString(16).padStart(2,'0');return '#'+h+h+h;};
  if(ST==='ink'){const keep=d.accent;for(const k of ['top','pants','shoes','hair','jacket','tie','skirt','mustache','beard']) if(d[k]&&d[k]!==keep) d[k]=gray(d[k]);d.skin='#f6f2ea';}
  if(ST==='neon'){for(const k of ['top','pants','shoes','jacket','tie','skirt']) if(d[k]) d[k]=mix(d[k],'#141826',.82);d.skin=mix(d.skin,'#141826',.78);d.hair=mix(d.hair,'#0a0c14',.6);if(d.mustache) d.mustache=mix(d.mustache,'#0a0c14',.6);}
  // proportions: adult ≈ 5.2 heads, kid ≈ 3.8 heads
  const hipY=K?-205:-345, shY=K?-338:-575, neckY=K?-360:-602, hc=K?-436:-684, HS=K?1.0:.96;
  const bw={slim:.9,regular:1,heavy:1.2}[d.build]||1;
  const SW=(K?58:88)*(d.fem?.88:1)*bw, WW=(K?50:68)*(d.fem?.8:1)*bw*(d.build==='heavy'?1.2:1), HW=(K?52:74)*(d.fem?1.06:1)*bw;
  const ow={riso:4.5,ink:4}[ST]||0, shapes=[];
  const add=(p,fill)=>shapes.push({p,fill}), addS=(p,col,w)=>shapes.push({p,stroke:col,w});
  // ---- legs ----
  const gap=K?5:7;
  if(d.skirt){
    add(`M${-HW},${hipY} L${-HW-20},${hipY+(K?95:150)} Q0,${hipY+(K?110:166)} ${HW+20},${hipY+(K?95:150)} L${HW},${hipY}Z`,d.skirt);
    for(const sx of [-1,1]) add(`M${sx*8},${hipY+90} L${sx*10},-14 L${sx*(K?30:40)},-14 L${sx*(K?34:46)},${hipY+90}Z`,d.legs||d.skin);
  } else add(`M${-HW},${hipY} C${-HW-2},${hipY+90} ${-HW+6},-160 ${-HW+10},-14 L${-gap},-14 L${-gap+2},${hipY+(K?60:96)} Q0,${hipY+(K?52:86)} ${gap-2},${hipY+(K?60:96)} L${gap},-14 L${HW-10},-14 C${HW-6},-160 ${HW+2},${hipY+90} ${HW},${hipY}Z`,d.pants);
  for(const sx of [-1,1]){const cx=sx*(HW*.5);add(`M${cx-sx*24},-18 C${cx-sx*28},0 ${cx-sx*16},4 ${cx},4 L${cx+sx*34},4 C${cx+sx*46},4 ${cx+sx*44},-14 ${cx+sx*28},-20Z`,d.shoes);}
  // ---- neck + torso ----
  add(`M-${K?11:14},${neckY-14} L-${K?12:15},${shY+8} Q0,${shY+16} ${K?12:15},${shY+8} L${K?11:14},${neckY-14}Z`,d.skin);
  if(d.outfit==='hoodie') add(`M${-SW+10},${shY+6} C${-SW+2},${shY-30} ${SW-2},${shY-30} ${SW-10},${shY+6}Z`,sh5(d.top,.12));
  const tB=hipY+12, belly=d.build==='heavy'?20:0;
  add(`M${-SW+8},${shY} C${-SW-6},${shY+4} ${-SW-6},${shY+50} ${-SW+2},${shY+90} C${-WW-belly},${(shY+tB)/2+30} ${-HW-3},${tB-26} ${-HW-2},${tB} Q0,${tB+14} ${HW+2},${tB} C${HW+3},${tB-26} ${WW+belly},${(shY+tB)/2+30} ${SW-2},${shY+90} C${SW+6},${shY+50} ${SW+6},${shY+4} ${SW-8},${shY} Q0,${shY-14} ${-SW+8},${shY}Z`,d.top);
  if(d.jacket){const J=d.jacket;
    add(`M${-SW+8},${shY} C${-SW-6},${shY+4} ${-SW-6},${shY+50} ${-SW+2},${shY+90} C${-WW},${(shY+tB)/2+30} ${-HW-3},${tB-26} ${-HW-2},${tB+4} L-14,${tB+10} L-22,${shY+56} L-12,${shY-4}Z`,J);
    add(`M${SW-8},${shY} C${SW+6},${shY+4} ${SW+6},${shY+50} ${SW-2},${shY+90} C${WW},${(shY+tB)/2+30} ${HW+3},${tB-26} ${HW+2},${tB+4} L14,${tB+10} L22,${shY+56} L12,${shY-4}Z`,J);}
  // ---- arms ----
  const sl=K?25:33;
  const armPts=side=>{const sx=side, b=[sx*(SW-10),shY+18], a=(side<0?d.armL:d.armR)||d.arms, L=K?1:1;
    if(a==='wave') return [b,[sx*(SW+52),shY+36],[sx*(SW+70),shY-(K?60:90)]];
    if(a==='hips') return [b,[sx*(SW+46),shY+(K?80:120)],[sx*(WW+8),hipY-20]];
    if(a==='front') return [b,[sx*(SW+10),shY+(K?90:140)],[sx*(SW-30),shY+(K?150:220)]];
    if(a==='point') return [b,[sx*(SW+60),shY+30],[sx*(SW+130),shY-10]];
    return [b,[sx*(SW+8),shY+(K?88:140)],[sx*(SW+4),shY+(K?172:262)]];};
  const sleeve=d.outfit==='tee'||d.outfit==='polo'?.42:d.outfit==='tank'?0:1, hands=[];
  for(const side of [-1,1]){const [P0,E,H]=armPts(side), armC=d.jacket||d.top, arm=`M${P0[0]},${P0[1]} Q${E[0]},${E[1]} ${H[0]},${H[1]}`;
    if(sleeve>=1) addS(arm,armC,sl);
    else {addS(arm,d.skin,sl*.74);
      if(sleeve>0){const t=sleeve, q=[P0[0]+(E[0]-P0[0])*t,P0[1]+(E[1]-P0[1])*t], m=[(1-t)*(1-t)*P0[0]+2*(1-t)*t*E[0]+t*t*H[0],(1-t)*(1-t)*P0[1]+2*(1-t)*t*E[1]+t*t*H[1]];
        addS(`M${P0[0]},${P0[1]} Q${q[0]},${q[1]} ${m[0]},${m[1]}`,armC,sl*1.06);}}
    hands.push(H);}
  for(const H of hands){const r=K?12:15;add(`M${H[0]-r},${H[1]-2} C${H[0]-r},${H[1]+r*1.5} ${H[0]+r},${H[1]+r*1.5} ${H[0]+r},${H[1]-2} C${H[0]+r},${H[1]-r} ${H[0]-r},${H[1]-r} ${H[0]-r},${H[1]-2}Z`,d.skin);}
  // ---- head (local coords, scaled by HS around the head centre) ----
  const face=`M-58,-6 C-60,-56 -34,-78 0,-78 C34,-78 60,-56 58,-6 C56,40 32,70 0,70 C-32,70 -56,40 -58,-6Z`;
  const ears=`M-57,0 c-15,-4 -18,24 -1,26Z M57,0 c15,-4 18,24 1,26Z`;
  const hb={long:`M-64,-8 C-74,-94 74,-94 64,-8 L74,92 Q0,108 -74,92Z`,bun:`M-26,-86 a28,28 0 1,0 52,0 a28,28 0 1,0 -52,0Z`,
    ponytail:`M40,-56 C96,-48 98,30 78,80 C68,34 64,0 32,-24Z`,pigtails:`M-62,-14 C-112,-6 -118,64 -94,90 C-82,48 -76,22 -54,8Z M62,-14 C112,-6 118,64 94,90 C82,48 76,22 54,8Z`}[d.hs];
  const hf={short:`M-60,-10 C-66,-70 -34,-92 2,-90 C38,-92 68,-70 60,-10 C54,-38 40,-48 22,-44 C8,-54 -14,-54 -30,-42 C-44,-48 -56,-36 -60,-10Z`,
    quiff:`M-60,-10 C-68,-74 -40,-100 -4,-102 C20,-114 58,-104 64,-78 C68,-56 66,-32 60,-10 C54,-38 40,-48 22,-44 C8,-54 -14,-54 -30,-42 C-44,-48 -56,-36 -60,-10Z`,
    sidepart:`M-60,-8 C-68,-74 -30,-92 6,-88 C42,-86 68,-68 60,-8 C56,-34 46,-46 30,-50 C8,-48 -16,-58 -24,-72 C-36,-50 -52,-36 -60,-8Z`,
    bun:`M-60,-8 C-66,-74 -32,-90 2,-88 C36,-90 66,-74 60,-8 C52,-42 32,-60 0,-60 C-32,-60 -52,-42 -60,-8Z`,
    ponytail:`M-60,-8 C-66,-74 -32,-90 2,-88 C36,-90 66,-74 60,-8 C48,-48 24,-58 -6,-52 C-24,-48 -48,-34 -60,-8Z`,
    long:`M-62,8 C-70,-74 -32,-92 4,-88 C40,-88 70,-68 62,8 C58,-32 40,-54 16,-54 C0,-32 -24,-40 -40,-50 C-52,-32 -60,-14 -62,8Z`,
    pigtails:`M-60,-8 C-66,-74 -32,-90 2,-88 C36,-90 66,-74 60,-8 C52,-44 30,-56 4,-56 C-20,-50 -46,-38 -60,-8Z`,
    bald:`M-59,-2 C-62,-24 -58,-36 -52,-40 C-48,-24 -50,-10 -46,4Z M59,-2 C62,-24 58,-36 52,-40 C48,-24 50,-10 46,4Z`}[d.hs]||'';
  const heads=[];if(hb) heads.push({p:hb,fill:d.hair});heads.push({p:ears,fill:d.skin},{p:face,fill:d.skin});if(hf) heads.push({p:hf,fill:d.hair});
  const G=p=>`<g transform="translate(0,${hc}) scale(${HS})">${p}</g>`;
  // ---- render passes ----
  const solid=(s,col,extra=0)=>s.stroke?`<path d="${s.p}" stroke="${col}" stroke-width="${s.w+extra}" fill="none" stroke-linecap="round"/>`:`<path d="${s.p}" fill="${col}" stroke="${col}" stroke-width="${extra}" stroke-linejoin="round"/>`;
  const sil=(col,extra)=>shapes.map(s=>solid(s,col,extra)).join('')+G(heads.map(s=>solid(s,col,extra/HS)).join(''));
  let out=`<defs><pattern id="${id}ht" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="3.5" cy="3.5" r="1.7" fill="#1c1828"/></pattern></defs>`;
  out+=`<ellipse cx="0" cy="4" rx="${HW+46}" ry="12" fill="#000" opacity=".18"/>`;
  if(d.style==='flat') out+=`<path d="M${-HW},0 L${HW},0 L${HW+260},70 L${-HW+170},70Z" fill="#3a2a1a" opacity=".14"/>`;
  out+=`<defs><pattern id="${id}hx" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="8" stroke="#111" stroke-width="2.2"/></pattern>
    <linearGradient id="${id}gr" x1="0" x2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1c1828" stop-opacity=".35"/></linearGradient>
    <filter id="${id}pp" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="4" dy="6" stdDeviation="2.5" flood-color="#2a1e10" flood-opacity=".45"/></filter>
    <filter id="${id}nb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>`;
  if(ST==='riso'&&d.echo) out+=`<g transform="translate(9,-7)" opacity=".95">${sil(d.echo,ow*2)}</g>`;   // signature misprint echo
  if(ST==='neon') out+=`<g filter="url(#${id}nb)" opacity=".95"><g transform="translate(-6,-2)">${sil('#39e6ff',8)}</g><g transform="translate(6,-2)">${sil('#ff3ea5',8)}</g></g><g transform="translate(-3,-1)">${sil('#9ff4ff',3)}</g><g transform="translate(3,-1)">${sil('#ff9ad2',3)}</g>`;
  if(ow) out+=sil(INK5,ow*2);
  const partF=ST==='paper'?` filter="url(#${id}pp)"`:'';
  out+=shapes.map(s=>{const f=s.stroke?(ow?`<path d="${s.p}" stroke="${INK5}" stroke-width="${s.w+4}" fill="none" stroke-linecap="round" opacity=".7"/>`:ST==='flat'?`<path d="${s.p}" stroke="${sh5(s.stroke,.18)}" stroke-width="${s.w+3}" fill="none" stroke-linecap="round"/>`:'')+solid(s,s.stroke):solid(s,s.fill);return ST==='paper'?`<g${partF}>${f}${s.stroke?'':`<path d="${s.p}" fill="none" stroke="#fff8ec" stroke-width="2.5" opacity=".7"/>`}</g>`:f}).join('');
  // clothing details
  const tT=shY;
  if(d.outfit==='hoodie') out+=`<path d="M${-SW+14},${tT+3} C-18,${tT+32} 18,${tT+32} ${SW-14},${tT+3}" stroke="${sh5(d.top,.25)}" stroke-width="5" fill="none"/><path d="M-10,${tT+24} l-3,56 M10,${tT+24} l3,56" stroke="#f3eee6" stroke-width="4" stroke-linecap="round"/><path d="M${-WW+8},${tB-34} L${WW-8},${tB-34} L${WW-16},${tB-84} Q0,${tB-92} ${-WW+16},${tB-84}Z" fill="none" stroke="${sh5(d.top,.28)}" stroke-width="3.5"/>`;
  if(d.outfit==='polo'||d.outfit==='shirt') out+=`<path d="M-20,${tT-4} L0,${tT+24} L20,${tT-4} L11,${tT+18} L0,${tT+28} L-11,${tT+18}Z" fill="${ti5(d.top,.25)}" stroke="${sh5(d.top,.3)}" stroke-width="2.5"/>`;
  if(d.badge) out+=`<rect x="${-SW+20}" y="${tT+50}" width="34" height="20" rx="3" fill="#f3eee6" stroke="${INK5}" stroke-width="2.5"/><rect x="${-SW+25}" y="${tT+57}" width="22" height="3" fill="#9aa3ad"/>`;
  if(d.jacket){out+=`<path d="M-12,${tT-4} L-22,${tT+56} L-4,${tT+36}Z M12,${tT-4} L22,${tT+56} L4,${tT+36}Z" fill="${sh5(d.jacket,.22)}"/>`;
    if(d.tie) out+=`<path d="M-7,${tT+4} L7,${tT+4} L5,${tT+18} L9,${tT+86} L0,${tT+98} L-9,${tT+86} L-5,${tT+18}Z" fill="${d.tie}"/>`;}
  if(!d.skirt) out+=`<path d="M0,${hipY+(K?30:48)} L0,${hipY+(K?54:84)}" stroke="${sh5(d.pants,.35)}" stroke-width="3"/>`;
  // halftone shading on the right side of the body
  const mask=shapes.map(s=>s.stroke?`<path d="${s.p}" stroke="#fff" stroke-width="${s.w}" fill="none" stroke-linecap="round"/>`:`<path d="${s.p}" fill="#fff"/>`).join('');
  out+=`<mask id="${id}m" maskUnits="userSpaceOnUse" x="-400" y="-900" width="800" height="1000"><rect x="-400" y="-900" width="800" height="1000" fill="#000"/>${mask}</mask>`;
  {const shp=`M${SW*.3},${shY-30} C${SW*.8},${shY+150} ${HW*.5},${hipY} ${HW*.3},20 L400,100 L400,-900Z`;
  if(ST==='riso') out+=`<g mask="url(#${id}m)"><path d="${shp}" fill="url(#${id}ht)" opacity=".38"/></g>`;
  if(ST==='ink') out+=`<g mask="url(#${id}m)"><path d="${shp}" fill="url(#${id}hx)" opacity=".45"/></g>`;
  if(ST==='flat') out+=`<g mask="url(#${id}m)"><rect x="-200" y="-900" width="400" height="1000" fill="url(#${id}gr)"/></g>`;}
  // ---- face: simple and friendly ----
  let h=heads.filter(s=>s.p!==hf).map(s=>solid(s,s.fill)).join('');
  h+=`<clipPath id="${id}f"><path d="${face}"/></clipPath><g clip-path="url(#${id}f)">${ST==='riso'?`<path d="M22,-90 C70,-70 70,40 0,80 L120,80 L120,-90Z" fill="url(#${id}ht)" opacity=".28"/>`:ST==='ink'?`<path d="M22,-90 C70,-70 70,40 0,80 L120,80 L120,-90Z" fill="url(#${id}hx)" opacity=".35"/>`:ST==='flat'?`<rect x="-80" y="-90" width="160" height="170" fill="url(#${id}gr)"/>`:''}</g>`;
  if(d.stubble) h+=`<path d="M-48,26 C-42,58 -22,70 0,70 C22,70 42,58 48,26 C34,42 20,48 0,50 C-20,48 -34,42 -48,26Z" fill="${d.hair}" opacity=".14"/>`;
  if(d.beard) h+=`<path d="M-54,6 C-50,66 -24,82 0,82 C24,82 50,66 54,6 C42,34 26,40 0,40 C-26,40 -42,34 -54,6Z" fill="${d.beard}"/>`;
  if(d.wrinkles) h+=`<path d="M-44,-14 q-5,5 -3,11 M44,-14 q5,5 3,11 M-24,42 q-6,6 -4,12 M24,42 q6,6 4,12" stroke="${sh5(d.skin,.32)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const E=d.expr, [lx,ly]=d.look, ex=22, ey=-6;
  // eyes: dots with a tiny highlight
  for(const sx of [-1,1]){const cx=sx*ex+lx*.35, cy=ey+ly*.3;
    if(d.eyes==='closed'||E==='happy') h+=`<path d="M${cx-8},${cy+1} Q${cx},${cy-6} ${cx+8},${cy+1}" stroke="${INK5}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    else {const big=d.eyes==='wide'||E==='scared'||E==='surprised';
      h+=`<ellipse cx="${cx}" cy="${cy}" rx="${big?7:5.6}" ry="${big?9:7.4}" fill="${ST==='neon'?'#f4fbff':INK5}"/><circle cx="${cx-1.8}" cy="${cy-2.6}" r="${big?2.4:2}" fill="#fff"/>`;
      if(d.lashes) h+=`<path d="M${cx+sx*4.5},${cy-3} l${sx*5.5},-2.5" stroke="${INK5}" stroke-width="2.6" stroke-linecap="round"/>`;}}
  // brows
  const bc=d.browCol||sh5(d.hair,.1), lift={worried:1,sad:1,scared:1,surprised:2,angry:-1}[E]||0;
  for(const sx of [-1,1]){const x0=sx*12, x1=sx*32, yIn=ey-22-(lift===1?4:lift===2?6:lift===-1?-4:0), yOut=ey-24-(lift===2?6:0)+(lift===1?2:0);
    h+=`<path d="M${x0},${yIn} Q${(x0+x1)/2},${Math.min(yIn,yOut)-4} ${x1},${yOut}" stroke="${bc}" stroke-width="${d.fem||K?4:5}" fill="none" stroke-linecap="round"/>`;}
  // nose + cheeks
  h+=`<path d="M0,6 q4,8 -2,12" stroke="${sh5(d.skin,.28)}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  h+=`<ellipse cx="-34" cy="20" rx="10" ry="6" fill="#ff7f86" opacity="${d.fem||K?.35:.2}"/><ellipse cx="34" cy="20" rx="10" ry="6" fill="#ff7f86" opacity="${d.fem||K?.35:.2}"/>`;
  // mouth
  const my=36;
  h+={neutral:`<path d="M-8,${my} Q0,${my+2} 8,${my}" stroke="${INK5}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`,
      smile:`<path d="M-12,${my-3} Q0,${my+8} 12,${my-3}" stroke="${INK5}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`,
      happy:`<path d="M-14,${my-4} Q0,${my+14} 14,${my-4}Z" fill="#8a3038" stroke="${INK5}" stroke-width="3" stroke-linejoin="round"/>`,
      worried:`<path d="M-10,${my+3} Q0,${my-4} 10,${my+3}" stroke="${INK5}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`,
      sad:`<path d="M-10,${my+3} Q0,${my-4} 10,${my+3}" stroke="${INK5}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`,
      angry:`<path d="M-10,${my+1} L10,${my-1}" stroke="${INK5}" stroke-width="3.6" stroke-linecap="round"/>`,
      scared:`<ellipse cx="0" cy="${my+1}" rx="6" ry="8" fill="#8a3038" stroke="${INK5}" stroke-width="3"/>`,
      surprised:`<ellipse cx="0" cy="${my+1}" rx="6" ry="8" fill="#8a3038" stroke="${INK5}" stroke-width="3"/>`}[E]||'';
  if(d.mustache) h+=`<path d="M-24,${my-8} C-16,${my-17} -4,${my-15} 0,${my-10} C4,${my-15} 16,${my-17} 24,${my-8} C18,${my-2} 8,${my-4} 0,${my-6} C-8,${my-4} -18,${my-2} -24,${my-8}Z" fill="${d.mustache}"/>`;
  if(hf) h+=`<path d="${hf}" fill="${d.hair}"/>`+(d.hs!=='bald'?`<path d="M-36,-72 C-18,-84 12,-86 30,-78" stroke="${ti5(d.hair,.28)}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>`:'');
  if(d.hs==='bald') h+=`<ellipse cx="-18" cy="-58" rx="14" ry="7" fill="#fff" opacity=".25" transform="rotate(-20 -18 -58)"/>`;
  if(d.hs==='pigtails') h+=`<circle cx="-60" cy="-10" r="6" fill="${d.tieCol||'#e0607a'}" stroke="${INK5}" stroke-width="2.5"/><circle cx="60" cy="-10" r="6" fill="${d.tieCol||'#e0607a'}" stroke="${INK5}" stroke-width="2.5"/>`;
  if(d.earrings) h+=`<circle cx="-62" cy="26" r="4" fill="${d.earrings}"/><circle cx="62" cy="26" r="4" fill="${d.earrings}"/>`;
  if(d.glasses) h+=`<g fill="#fff" fill-opacity=".14" stroke="${INK5}" stroke-width="3.5"><circle cx="-22" cy="-6" r="15"/><circle cx="22" cy="-6" r="15"/></g><path d="M-7,-8 Q0,-12 7,-8 M-37,-9 L-56,-14 M37,-9 L56,-14" stroke="${INK5}" stroke-width="3.5" fill="none"/>`;
  out+=G(h);
  if(ST==='ink') out=`<defs><filter id="${id}wb" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="${__p6}"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter></defs><g filter="url(#${id}wb)">${out}</g>`;
  if(ST==='paper') out=`<defs><filter id="${id}tx" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .3  0 0 0 0 .22  0 0 0 0 .12  0 0 0 .1 0" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in" result="gt"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gt"/></feMerge></filter></defs><g filter="url(#${id}tx)">${out}</g>`;
  return `<g transform="translate(${d.x},${d.y}) scale(${d.s})">${out}</g>`;
}

// ===== Archivo Raro · character style v4 =====
// One silhouette: every part is drawn twice, first as a thick ink outline, then filled on top, so the figure
// reads as a single shape with one clean contour (no seams between neck, arms, torso and legs).
// Feet at (0,0); adult ≈ 720 units tall. Light comes from the top-left; the right side gets a soft shadow.
const INK4='#23202b';
const shade4=(c,k)=>mix(c,'#1a1626',k), tint4=(c,k)=>mix(c,'#ffffff',k);
let __p4=0;
function P4(o){
  const d=Object.assign({x:0,y:0,s:1,skin:'#e8b48c',hair:'#3a2a20',hs:'short',top:'#3a5a7a',pants:'#2e3440',shoes:'#e9e4d8',
    outfit:'tee',build:'regular',fem:false,kid:false,expr:'neutral',look:[0,0],arms:'down',eyes:'open'},o);
  const id='p4_'+(++__p4);
  const K=d.kid;
  // key heights / widths
  const footY=0, hipY=K?-175:-268, shY=K?-300:-462, neckY=K?-335:-505, hc=K?-418:-588, hsc=K?1.02:1;
  const bw={slim:.9,regular:1,heavy:1.22}[d.build]||1;
  const SW=(K?68:96)*(d.fem?.9:1)*bw, WW=(K?58:78)*(d.fem?.78:1)*bw*(d.build==='heavy'?1.15:1), HW=(K?60:84)*(d.fem?1.06:1)*bw;
  const ow=6; // outline width
  const shapes=[]; // {d, fill} or {stroke, w, d}
  const add=(p,fill)=>shapes.push({p,fill});
  const addS=(p,col,w)=>shapes.push({p,stroke:col,w});
  // ---- legs / pants (one shape, two legs) ----
  const lg=K?20:30;
  const pantsCol=d.pants;
  if(d.skirt){
    add(`M${-HW},${hipY+6} L${-HW-26},${hipY+(K?110:170)} Q0,${hipY+(K?130:190)} ${HW+26},${hipY+(K?110:170)} L${HW},${hipY+6}Z`,d.skirt);
    for(const sx of [-1,1]) add(`M${sx*12-lg/2*sx},${hipY+100} L${sx*(12)-lg/2*sx},${footY-14} L${sx*(12+lg*1.6)},${footY-14} L${sx*(12+lg*1.6)},${hipY+100}Z`,d.skin);
  } else {
    add(`M${-HW},${hipY} C${-HW-2},${hipY+60} ${-HW+8},${footY-120} ${-HW+12},${footY-16} L${-12},${footY-16} L${-6},${hipY+(K?70:110)} Q0,${hipY+(K?62:100)} 6,${hipY+(K?70:110)} L12,${footY-16} L${HW-12},${footY-16} C${HW-8},${footY-120} ${HW+2},${hipY+60} ${HW},${hipY}Z`,pantsCol);
  }
  // shoes
  for(const sx of [-1,1]){const cx=sx*(HW*.55);add(`M${cx-sx*30},${footY-22} C${cx-sx*34},${footY-2} ${cx-sx*20},${footY+4} ${cx},${footY+4} L${cx+sx*42},${footY+4} C${cx+sx*58},${footY+4} ${cx+sx*56},${footY-20} ${cx+sx*36},${footY-26} Z`,d.shoes);}
  // ---- torso ----
  const tTop=shY, tBot=hipY+(d.outfit==='tank'?6:14);
  const belly=d.build==='heavy'?26:0;
  const torso=`M${-SW+8},${tTop} C${-SW-10},${tTop+6} ${-SW-8},${tTop+60} ${-SW+2},${tTop+110} C${-WW-belly},${(tTop+tBot)/2+40} ${-HW-4},${tBot-30} ${-HW-2},${tBot} Q0,${tBot+18} ${HW+2},${tBot} C${HW+4},${tBot-30} ${WW+belly},${(tTop+tBot)/2+40} ${SW-2},${tTop+110} C${SW+8},${tTop+60} ${SW+10},${tTop+6} ${SW-8},${tTop} Q0,${tTop-20} ${-SW+8},${tTop}Z`;
  // neck
  add(`M-${K?14:19},${neckY-10} L-${K?15:20},${shY+8} Q0,${shY+20} ${K?15:20},${shY+8} L${K?14:19},${neckY-10}Z`,d.skin);
  if(d.outfit==='hoodie') add(`M${-SW+14},${tTop+8} C${-SW+4},${tTop-34} ${SW-4},${tTop-34} ${SW-14},${tTop+8}Z`,shade4(d.top,.12)); // hood behind the neck
  add(torso,d.top);
  if(d.jacket){const J=d.jacket;
    add(`M${-SW+8},${tTop} C${-SW-10},${tTop+6} ${-SW-8},${tTop+60} ${-SW+2},${tTop+110} C${-WW},${(tTop+tBot)/2+40} ${-HW-4},${tBot-30} ${-HW-2},${tBot+4} L-20,${tBot+14} L-30,${tTop+60} L-16,${tTop-4}Z`,J);
    add(`M${SW-8},${tTop} C${SW+10},${tTop+6} ${SW+8},${tTop+60} ${SW-2},${tTop+110} C${WW},${(tTop+tBot)/2+40} ${HW+4},${tBot-30} ${HW+2},${tBot+4} L20,${tBot+14} L30,${tTop+60} L16,${tTop-4}Z`,J);}
  // ---- arms (single smooth strokes) ----
  const sl=K?30:40;
  const armPts=side=>{const sx=side, base=[sx*(SW-14),shY+22];
    const a=(side<0?d.armL:d.armR)||d.arms;
    if(a==='wave') return [base,[sx*(SW+70),shY+(K?40:30)],[sx*(SW+96),shY-(K?70:100)]];
    if(a==='hips') return [base,[sx*(SW+58),shY+110],[sx*(WW+12),hipY-30]];
    if(a==='front') return [base,[sx*(SW+14),shY+130],[sx*(SW-40),shY+(K?160:206)]];
    if(a==='cross') return [base,[sx*(SW+10),shY+110],[-sx*(SW-30),shY+120]];
    if(a==='point') return [base,[sx*(SW+70),shY+30],[sx*(SW+150),shY-20]];
    return [base,[sx*(SW+12),shY+(K?92:132)],[sx*(SW+6),shY+(K?182:252)]];};
  const sleeveLen=d.outfit==='tee'||d.outfit==='polo'?.45:d.outfit==='tank'?0:1;
  const hands=[];
  for(const side of [-1,1]){const [P0,E,H]=armPts(side);
    const arm=`M${P0[0]},${P0[1]} Q${E[0]},${E[1]} ${H[0]},${H[1]}`;
    const armCol=d.jacket||d.top;
    if(sleeveLen>=1) addS(arm,armCol,sl);
    else { addS(arm,d.skin,sl*.72);
      if(sleeveLen>0){const t=sleeveLen, m1=[(1-t)*(1-t)*P0[0]+2*(1-t)*t*E[0]+t*t*H[0],(1-t)*(1-t)*P0[1]+2*(1-t)*t*E[1]+t*t*H[1]];
        const q=[P0[0]+(E[0]-P0[0])*t,P0[1]+(E[1]-P0[1])*t];addS(`M${P0[0]},${P0[1]} Q${q[0]},${q[1]} ${m1[0]},${m1[1]}`,armCol,sl*1.05);}}
    hands.push(H);}
  for(const H of hands) add(`M${H[0]-18},${H[1]-4} C${H[0]-20},${H[1]+22} ${H[0]+20},${H[1]+22} ${H[0]+18},${H[1]-4} C${H[0]+16},${H[1]-20} ${H[0]-16},${H[1]-20} ${H[0]-18},${H[1]-4}Z`,d.skin);
  // ---- head: back hair, ears, face ----
  const g=(p)=>`<g transform="translate(0,${hc}) scale(${hsc})">${p}</g>`;
  const hairBack={long:`M-84,-10 C-96,-110 96,-110 84,-10 L92,110 Q0,130 -92,110Z`,bun:`M-30,-106 a34,34 0 1,0 60,0 a34,34 0 1,0 -60,0Z`,
    ponytail:`M50,-70 C120,-60 120,40 96,96 C84,40 80,0 40,-30Z`,pigtails:`M-80,-20 C-140,-10 -150,80 -118,110 C-104,60 -96,30 -70,10Z M80,-20 C140,-10 150,80 118,110 C104,60 96,30 70,10Z`}[d.hs];
  const face=`M-74,-10 C-76,-74 -42,-96 0,-96 C42,-96 76,-74 74,-10 C72,48 40,84 0,84 C-40,84 -72,48 -74,-10Z`;
  const ears=`M-74,-2 c-20,-6 -24,30 -2,34Z M74,-2 c20,-6 24,30 2,34Z`;
  const headShapes=[];
  if(hairBack) headShapes.push({p:hairBack,fill:d.hair});
  headShapes.push({p:ears,fill:d.skin},{p:face,fill:d.skin});
  // front hair
  const hairFront={
    short:`M-77,-14 C-84,-88 -44,-112 2,-110 C48,-112 86,-86 77,-14 C70,-46 54,-58 32,-54 C12,-66 -16,-66 -36,-52 C-54,-58 -70,-46 -77,-14Z`,
    quiff:`M-77,-14 C-86,-92 -52,-122 -6,-124 C26,-140 74,-128 82,-96 C88,-70 84,-40 77,-14 C70,-46 52,-58 30,-52 C10,-64 -18,-64 -38,-50 C-56,-56 -70,-44 -77,-14Z`,
    sidepart:`M-77,-10 C-86,-90 -40,-112 6,-108 C52,-106 86,-84 77,-10 C72,-40 60,-56 40,-60 C10,-58 -20,-70 -30,-86 C-46,-60 -66,-44 -77,-10Z`,
    bun:`M-77,-10 C-84,-90 -40,-110 2,-108 C46,-110 84,-90 77,-10 C66,-50 40,-74 0,-74 C-40,-74 -66,-50 -77,-10Z`,
    ponytail:`M-77,-10 C-84,-90 -40,-110 2,-108 C46,-110 84,-90 77,-10 C62,-58 30,-70 -6,-62 C-30,-58 -60,-40 -77,-10Z`,
    long:`M-80,10 C-90,-90 -40,-112 4,-108 C50,-108 90,-84 80,10 C74,-40 50,-66 20,-66 C0,-40 -30,-50 -50,-60 C-66,-40 -76,-16 -80,10Z`,
    pigtails:`M-77,-10 C-84,-90 -40,-110 2,-108 C46,-110 84,-90 77,-10 C70,-50 40,-60 10,-56 L0,-80 L-10,-56 C-40,-60 -70,-50 -77,-10Z`,
    bald:`M-76,-4 C-80,-30 -74,-44 -66,-50 C-62,-30 -64,-14 -60,4Z M76,-4 C80,-30 74,-44 66,-50 C62,-30 64,-14 60,4Z`}[d.hs]||'';
  // ---- render: outline pass, fill pass ----
  let body='';
  const outline=s=>s.stroke?`<path d="${s.p}" stroke="${INK4}" stroke-width="${s.w+ow*2}" fill="none" stroke-linecap="round"/>`:`<path d="${s.p}" fill="${INK4}" stroke="${INK4}" stroke-width="${ow*2}" stroke-linejoin="round"/>`;
  const fill=s=>s.stroke?`<path d="${s.p}" stroke="${INK4}" stroke-width="${s.w+5}" fill="none" stroke-linecap="round" opacity=".85"/><path d="${s.p}" stroke="${s.stroke}" stroke-width="${s.w}" fill="none" stroke-linecap="round"/>`:`<path d="${s.p}" fill="${s.fill}"/>`;
  const headOutline=headShapes.map(outline).join('')+(hairFront?`<path d="${hairFront}" fill="${INK4}" stroke="${INK4}" stroke-width="${ow*2}" stroke-linejoin="round"/>`:'');
  body+=`<ellipse cx="0" cy="6" rx="${HW+60}" ry="16" fill="#000" opacity=".2"/>`;
  body+=shapes.map(outline).join('')+g(headOutline);
  body+=shapes.map(fill).join('');
  // clothing details
  if(d.outfit==='hoodie'){
    body+=`<path d="M${-SW+18},${tTop+4} C${-24},${tTop+40} ${24},${tTop+40} ${SW-18},${tTop+4}" stroke="${shade4(d.top,.25)}" stroke-width="6" fill="none"/>`;
    body+=`<path d="M-14,${tTop+30} l-4,70 M14,${tTop+30} l4,70" stroke="#f3eee6" stroke-width="5" stroke-linecap="round"/><circle cx="-18" cy="${tTop+102}" r="5" fill="#f3eee6"/><circle cx="18" cy="${tTop+102}" r="5" fill="#f3eee6"/>`;
    body+=`<path d="M${-WW+8},${tBot-40} L${WW-8},${tBot-40} L${WW-18},${tBot-100} Q0,${tBot-110} ${-WW+18},${tBot-100}Z" fill="none" stroke="${shade4(d.top,.28)}" stroke-width="4"/>`;}
  if(d.outfit==='polo'||d.outfit==='shirt'){body+=`<path d="M-26,${tTop-6} L0,${tTop+30} L26,${tTop-6} L14,${tTop+22} L0,${tTop+34} L-14,${tTop+22}Z" fill="${tint4(d.top,.25)}" stroke="${shade4(d.top,.3)}" stroke-width="3"/>`;
    if(d.outfit==='polo') body+=`<circle cx="0" cy="${tTop+48}" r="4" fill="${shade4(d.top,.4)}"/><circle cx="0" cy="${tTop+66}" r="4" fill="${shade4(d.top,.4)}"/>`;}
  if(d.badge) body+=`<rect x="${-SW+26}" y="${tTop+60}" width="44" height="26" rx="4" fill="#f3eee6" stroke="${INK4}" stroke-width="3"/><rect x="${-SW+32}" y="${tTop+68}" width="30" height="4" fill="#9aa3ad"/><rect x="${-SW+32}" y="${tTop+76}" width="20" height="4" fill="#9aa3ad"/>`;
  if(false){const J=d.jacket;
    body+=`<path d="M${-SW+8},${tTop} C${-SW-10},${tTop+6} ${-SW-8},${tTop+60} ${-SW+2},${tTop+110} C${-WW},${(tTop+tBot)/2+40} ${-HW-4},${tBot-30} ${-HW-2},${tBot+4} L-20,${tBot+14} L-30,${tTop+60} L-16,${tTop-4}Z" fill="${J}"/><path d="M${SW-8},${tTop} C${SW+10},${tTop+6} ${SW+8},${tTop+60} ${SW-2},${tTop+110} C${WW},${(tTop+tBot)/2+40} ${HW+4},${tBot-30} ${HW+2},${tBot+4} L20,${tBot+14} L30,${tTop+60} L16,${tTop-4}Z" fill="${J}"/>`;
    body+=`<path d="M-16,${tTop-4} L-30,${tTop+60} L-6,${tTop+40}Z M16,${tTop-4} L30,${tTop+60} L6,${tTop+40}Z" fill="${shade4(J,.2)}"/>`;
    if(d.tie) body+=`<path d="M-9,${tTop+4} L9,${tTop+4} L6,${tTop+22} L12,${tTop+96} L0,${tTop+112} L-12,${tTop+96} L-6,${tTop+22}Z" fill="${d.tie}"/>`;}
  if(d.jacket){const J=d.jacket;body+=`<path d="M-16,${tTop-4} L-30,${tTop+60} L-6,${tTop+40}Z M16,${tTop-4} L30,${tTop+60} L6,${tTop+40}Z" fill="${shade4(J,.2)}"/>`;
    if(d.tie) body+=`<path d="M-9,${tTop+4} L9,${tTop+4} L6,${tTop+22} L12,${tTop+96} L0,${tTop+112} L-12,${tTop+96} L-6,${tTop+22}Z" fill="${d.tie}"/>`;}
  if(d.outfit==='tank') body+=`<path d="M${-SW+30},${tTop-2} Q0,${tTop+50} ${SW-30},${tTop-2}" fill="${d.skin}"/>`;
  // seam + crease lines (thin, not full outlines)
  if(!d.skirt) body+=`<path d="M0,${hipY+(K?40:60)} L0,${hipY+(K?66:104)}" stroke="${shade4(pantsCol,.35)}" stroke-width="4"/>`;
  // ---- shading: right side of the silhouette ----
  const clipBody=shapes.map(s=>s.stroke?`<path d="${s.p}" stroke="#fff" stroke-width="${s.w}" fill="none" stroke-linecap="round"/>`:`<path d="${s.p}"/>`).join('');
  body+=`<mask id="${id}m" maskUnits="userSpaceOnUse" x="-400" y="-900" width="800" height="1000"><rect x="-400" y="-900" width="800" height="1000" fill="#000"/><g fill="#fff">${clipBody}</g></mask>`;
  body+=`<g mask="url(#${id}m)"><path d="M${SW*.25},${shY-40} C${SW*.7},${shY+120} ${HW*.4},${hipY} ${HW*.2},${footY+20} L400,100 L400,-900Z" fill="#1a1626" opacity=".16"/><path d="M${-SW-30},${shY-20} L${-SW+10},${shY-20} L${-SW-6},${footY} L${-SW-40},${footY}Z" fill="#fff" opacity=".04"/></g>`;
  // ---- face ----
  let h=headShapes.map(fill).join('');
  h+=`<path d="M20,-96 C60,-86 80,-50 74,-10 C70,48 40,84 0,84 C30,60 46,10 20,-96Z" fill="#1a1626" opacity=".08"/>`;
  h+=`<path d="M-80,4 c-10,-2 -12,16 -2,18 M80,4 c10,-2 12,16 2,18" stroke="${shade4(d.skin,.3)}" stroke-width="3" fill="none"/>`;
  if(d.stubble) h+=`<path d="M-62,30 C-56,72 -28,84 0,84 C28,84 56,72 62,30 C46,50 28,60 0,62 C-28,60 -46,50 -62,30Z" fill="${d.hair}" opacity=".16"/>`;
  if(d.beard) h+=`<path d="M-70,6 C-66,80 -30,100 0,100 C30,100 66,80 70,6 C56,40 34,48 0,48 C-34,48 -56,40 -70,6Z" fill="${d.beard}"/>`;
  if(d.wrinkles) h+=`<path d="M-40,-62 q10,-4 20,0 M20,-62 q10,-4 20,0 M-56,-16 q-6,6 -4,14 M56,-16 q6,6 4,14 M-30,40 q-8,8 -6,16 M30,40 q8,8 6,16" stroke="${shade4(d.skin,.35)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  // eyes
  const ex=27, ey=-14, [lx,ly]=d.look, op=d.eyes;
  for(const sx of [-1,1]){const cx=sx*ex;
    if(op==='closed'){h+=`<path d="M${cx-14},${ey} Q${cx},${ey+9} ${cx+14},${ey}" stroke="${INK4}" stroke-width="5" fill="none" stroke-linecap="round"/>`;continue;}
    const ry=op==='wide'?20:op==='half'?10:17, rx=15;
    h+=`<ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ry}" fill="#fbfaf7"/>`;
    const ir=op==='wide'?8:10;
    h+=`<clipPath id="${id}e${sx}"><ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ry}"/></clipPath><g clip-path="url(#${id}e${sx})"><circle cx="${cx+lx*.8}" cy="${ey+2+ly*.6}" r="${ir}" fill="${d.iris||'#5a3a24'}"/><circle cx="${cx+lx*.8}" cy="${ey+2+ly*.6}" r="${ir*.5}" fill="#120e10"/><circle cx="${cx+lx*.8-3.5}" cy="${ey-2+ly*.6}" r="3.4" fill="#fff"/>`;
    if(op==='half') h+=`<rect x="${cx-16}" y="${ey-20}" width="32" height="14" fill="${d.skin}"/>`;
    h+=`</g><path d="M${cx-rx-2},${ey-2} Q${cx},${ey-ry-6} ${cx+rx+2},${ey-2}" stroke="${INK4}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    if(d.lashes) h+=`<path d="M${cx+sx*rx},${ey-6} l${sx*7},-6" stroke="${INK4}" stroke-width="3.5" stroke-linecap="round"/>`;}
  // brows
  const E=d.expr, bc=d.browCol||shade4(d.hair,.15);
  const bro={neutral:[0,0],smile:[-2,-2],happy:[-4,-4],worried:[8,-6],sad:[8,-6],angry:[-8,6],scared:[10,-10],surprised:[-10,-10]}[E]||[0,0];
  for(const sx of [-1,1]){const x0=sx*12,x1=sx*44,y0=ey-30+bro[0]*.0-(E==='worried'||E==='scared'||E==='sad'?6:0)+(E==='angry'?6:0), y1=ey-30-(E==='angry'?-2:0)-(E==='surprised'||E==='scared'?6:0);
    h+=`<path d="M${x0},${y0} Q${(x0+x1)/2},${Math.min(y0,y1)-6} ${x1},${y1}" stroke="${bc}" stroke-width="${d.fem?6:8}" fill="none" stroke-linecap="round"/>`;}
  // nose
  h+=`<path d="M-2,4 C4,14 6,22 -4,26" stroke="${shade4(d.skin,.3)}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  // cheeks
  h+=`<ellipse cx="-46" cy="28" rx="13" ry="8" fill="#ff7a7a" opacity="${d.fem||K?.28:.16}"/><ellipse cx="46" cy="28" rx="13" ry="8" fill="#ff7a7a" opacity="${d.fem||K?.28:.16}"/>`;
  // mouth
  const my=52;
  const mouth={neutral:`<path d="M-12,${my} Q0,${my+3} 12,${my}" stroke="${INK4}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    smile:`<path d="M-18,${my-4} Q0,${my+12} 18,${my-4}" stroke="${INK4}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    happy:`<path d="M-22,${my-6} Q0,${my+22} 22,${my-6}Z" fill="#7a2a32" stroke="${INK4}" stroke-width="4" stroke-linejoin="round"/><path d="M-16,${my-3} Q0,${my+3} 16,${my-3}" fill="#fff"/>`,
    worried:`<path d="M-14,${my+4} Q0,${my-6} 14,${my+4}" stroke="${INK4}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    sad:`<path d="M-14,${my+4} Q0,${my-6} 14,${my+4}" stroke="${INK4}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    angry:`<path d="M-14,${my+2} L14,${my-1}" stroke="${INK4}" stroke-width="4.5" stroke-linecap="round"/>`,
    scared:`<ellipse cx="0" cy="${my+2}" rx="9" ry="12" fill="#5a1a24" stroke="${INK4}" stroke-width="4"/>`,
    surprised:`<ellipse cx="0" cy="${my+2}" rx="9" ry="12" fill="#5a1a24" stroke="${INK4}" stroke-width="4"/>`}[E];
  h+=mouth;
  if(d.lip) h=h.replace('#7a2a32',d.lip);
  if(d.mustache) h+=`<path d="M-32,40 C-22,28 -6,30 0,36 C6,30 22,28 32,40 C26,48 10,46 0,42 C-10,46 -26,48 -32,40Z" fill="${d.mustache}"/>`;
  if(hairFront) h+=`<path d="${hairFront}" fill="${d.hair}"/><path d="M-50,-90 C-30,-104 10,-106 30,-96" stroke="${tint4(d.hair,.25)}" stroke-width="5" fill="none" stroke-linecap="round" opacity="${d.hs==='bald'?0:.7}"/>`;
  if(d.hs==='bald') h+=`<ellipse cx="-24" cy="-74" rx="18" ry="9" fill="#fff" opacity=".22" transform="rotate(-20 -24 -74)"/>`;
  if(d.hs==='pigtails') h+=`<circle cx="-78" cy="-14" r="8" fill="${d.tieCol||'#e0607a'}" stroke="${INK4}" stroke-width="3"/><circle cx="78" cy="-14" r="8" fill="${d.tieCol||'#e0607a'}" stroke="${INK4}" stroke-width="3"/>`;
  if(d.earrings) h+=`<circle cx="-80" cy="34" r="5" fill="${d.earrings}"/><circle cx="80" cy="34" r="5" fill="${d.earrings}"/>`;
  if(d.glasses) h+=`<g fill="#ffffff" fill-opacity=".12" stroke="${INK4}" stroke-width="4.5"><circle cx="-27" cy="-12" r="22"/><circle cx="27" cy="-12" r="22"/></g><path d="M-6,-14 Q0,-20 6,-14 M-49,-16 L-74,-22 M49,-16 L74,-22" stroke="${INK4}" stroke-width="4.5" fill="none"/>`;
  body+=g(h);
  return `<g transform="translate(${d.x},${d.y}) scale(${d.s})">${body}</g>`;
}

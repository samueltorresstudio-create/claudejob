// Animales en el estilo del canal, versión adulta: de pie, de lado, cabeza girada a cámara
const S4=(w=OW)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
function shaded(path,fill,shade,dx=14,dy=-12){const c=uid('ac');return `<defs><clipPath id="${c}"><path d="${path}"/></clipPath></defs><path d="${path}" fill="${shade}"/><g clip-path="url(#${c})"><path d="${path}" fill="${fill}" transform="translate(${dx},${dy})"/></g><path d="${path}" fill="none" ${S4()}/>`}
function clipTo(path,inner){const c=uid('cc');return `<defs><clipPath id="${c}"><path d="${path}"/></clipPath></defs><g clip-path="url(#${c})">${inner}</g>`}
// ojo adulto: iris pequeño, pupila, párpado pesado
function aEye(x,y,o,sd,iris,r=17,lidCol='#ddd',slit=false){const e=o.eyes||'lid', c=uid('ec');
  if(e==='wide'){r*=1.2}
  let s=`<defs><clipPath id="${c}"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.9}"/></clipPath></defs><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.9}" fill="#fff"/>`;
  const ir=r*.8, px=x+(o.look?o.look[0]:sd*0)+(e==='wide'?0:2), py=y+(o.look?o.look[1]:0)+1;
  s+=`<g clip-path="url(#${c})"><circle cx="${px}" cy="${py}" r="${ir}" fill="${iris}"/>`+(slit&&e!=='wide'?`<ellipse cx="${px}" cy="${py}" rx="${ir*.22}" ry="${ir*.85}" fill="${INK}"/>`:`<circle cx="${px}" cy="${py}" r="${ir*(e==='wide'?.35:.5)}" fill="${INK}"/>`)+`<circle cx="${px+ir*.35}" cy="${py-ir*.4}" r="${ir*.22}" fill="#fff"/>`;
  if(e!=='wide'){const t=e==='angry'?sd*-20:sd*-6, ly=e==='angry'?-r*.05:-r*.3;
    s+=`<rect x="${x-r*2}" y="${y-r*3}" width="${r*4}" height="${r*3+ly}" fill="${lidCol}" transform="rotate(${t} ${x} ${y})"/>`;
    s+=`</g><line x1="${x-r-6}" y1="${y+ly}" x2="${x+r+6}" y2="${y+ly}" stroke="${INK}" stroke-width="6.5" stroke-linecap="round" transform="rotate(${t} ${x} ${y})"/>`;}
  else s+='</g>';
  return s+`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.9}" fill="none" stroke="${INK}" stroke-width="5.5"/>`;}
function heavyBrow(x,y,ang,len=46,th=12){return `<path transform="translate(${x},${y}) rotate(${ang})" d="M${-len/2},4 Q${-len*.1},${-th} ${len/2},-2 Q${len*.1},${-2} ${-len/2},4 Z" fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`}
// pata articulada: línea central con anchos [x,y,w]; relleno cerrado y contorno abierto (sin corte arriba)
function leg(pts,col,shade,claws=false){const L=pts.map(([x,y,w])=>[x-w,y]), R=pts.map(([x,y,w])=>[x+w,y]).reverse();
  const f=pts[pts.length-1], fx=f[0], fw=f[2];
  const sm=(P)=>{let d=`M${P[0][0]},${P[0][1]}`;for(let i=1;i<P.length;i++){const m=[(P[i-1][0]+P[i][0])/2,(P[i-1][1]+P[i][1])/2];d+=` Q${P[i-1][0]},${P[i-1][1]} ${m[0]},${m[1]}`;}return d+` L${P[P.length-1][0]},${P[P.length-1][1]}`};
  const left=sm(L), right=sm(R);
  const paw=` Q${fx-fw-8},2 ${fx-fw+6},2 L${fx+fw+18},2 Q${fx+fw+26},-14 `;
  const fill=left+paw+right.replace(/^M/,'L')+' Z';
  const c=uid('lc');
  let s=`<defs><clipPath id="${c}"><path d="${fill}"/></clipPath></defs><path d="${fill}" fill="${shade}"/><g clip-path="url(#${c})"><path d="${fill}" fill="${col}" transform="translate(-9,0)"/></g>`;
  s+=`<path d="${left+paw+right.replace(/^M/,'L')}" fill="none" ${S4()}/>`;
  s+=`<path d="M${fx},-16 L${fx},0 M${fx+13},-16 L${fx+13},0" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  if(claws) s+=[fx-fw+4,fx+6,fx+fw+14].map(cx=>`<path d="M${cx},0 l6,9 l3,-9" fill="#f2ead8" ${S4(2.5)}/>`).join('');
  return s;}
const hind=(x,col,sh,cl,wt=1)=>leg([[x,-300,48*wt],[x-14,-200,40*wt],[x+20,-120,22*wt],[x+8,-60,20*wt],[x+12,-22,22*wt]],col,sh,cl);
const fore=(x,col,sh,cl,wt=1)=>leg([[x,-300,38*wt],[x+4,-200,28*wt],[x,-110,22*wt],[x+4,-60,21*wt],[x+10,-22,22*wt]],col,sh,cl);
// ===================== LEÓN =====================
function leon(o={},only=false){const FUR='#d9a05a', FURS='#b98040', FURL='#ecc488', MANE='#8e3f17', MANEM='#b4561f', MANEL='#cf7a34', MUZ='#f4e2c4';
  const HX=196, HC=-430;
  const lobes=(R,n,cx,cy,sx=1,sy=1)=>{let d='';for(let i=0;i<n;i++){const a0=i/n*2*Math.PI, a1=(i+1)/n*2*Math.PI, am=(a0+a1)/2;
    const p=(a,r)=>`${(cx+Math.cos(a)*r*sx).toFixed(1)},${(cy+Math.sin(a)*r*sy).toFixed(1)}`;
    d+=(i?'':`M${p(a0,R)} `)+`Q${p(am,R*1.24)} ${p(a1,R)} `;}return d+'Z'};
  let h='';
  h+=`<path d="${lobes(150,15,HX-6,HC+30,1,1.12)}" fill="${MANE}" ${S4()}/><path d="${lobes(124,13,HX-2,HC+24,1,1.1)}" fill="${MANEM}" ${S4(5)}/><path d="${lobes(100,12,HX,HC+16,1,1.08)}" fill="${MANEL}" ${S4(4)}/>`;
  h+=[...Array(18)].map((_,i)=>{const a=i/18*2*Math.PI+.15,r1=108,r2=170;return `<path d="M${(HX+Math.cos(a)*r1).toFixed(0)},${(HC+24+Math.sin(a)*r1*1.1).toFixed(0)} Q${(HX+Math.cos(a+.08)*(r1+r2)/2).toFixed(0)},${(HC+24+Math.sin(a+.08)*(r1+r2)/2*1.1).toFixed(0)} ${(HX+Math.cos(a+.04)*r2).toFixed(0)},${(HC+24+Math.sin(a+.04)*r2*1.1).toFixed(0)}" fill="none" stroke="#6a2a0e" stroke-width="4" stroke-linecap="round" opacity=".8"/>`}).join('');
  h+=[-1,1].map(sd=>`<path d="M${HX+sd*58},${HC-68} Q${HX+sd*70},${HC-112} ${HX+sd*94},${HC-84} Q${HX+sd*96},${HC-60} ${HX+sd*76},${HC-50} Z" fill="${FUR}" ${S4(6)}/><path d="M${HX+sd*70},${HC-76} Q${HX+sd*78},${HC-94} ${HX+sd*86},${HC-80}" fill="none" stroke="#7a4a2a" stroke-width="5" stroke-linecap="round"/>`).join('');
  // cara alargada de león adulto
  const face=`M${HX-74},${HC-30} C${HX-80},${HC-96} ${HX-30},${HC-104} ${HX},${HC-104} C${HX+34},${HC-104} ${HX+82},${HC-94} ${HX+76},${HC-30} C${HX+74},${HC+20} ${HX+62},${HC+70} ${HX+40},${HC+98} Q${HX},${HC+120} ${HX-40},${HC+98} C${HX-62},${HC+70} ${HX-74},${HC+20} ${HX-74},${HC-30} Z`;
  h+=shaded(face,FUR,FURS,8,-8);
  h+=clipTo(face,`<path d="M${HX-60},${HC+30} Q${HX-30},${HC+10} ${HX},${HC+22} Q${HX+30},${HC+10} ${HX+60},${HC+30} L${HX+60},${HC+140} L${HX-60},${HC+140} Z" fill="${MUZ}"/><path d="M${HX-12},${HC-70} Q${HX},${HC-20} ${HX-8},${HC+10} M${HX+12},${HC-70} Q${HX+4},${HC-20} ${HX+10},${HC+10}" fill="none" stroke="${FURS}" stroke-width="5" stroke-linecap="round"/>`);
  h+=`<path d="${face}" fill="none" ${S4()}/>`;
  h+=aEye(HX-34,HC-30,o,-1,'#e8a91c',16,FUR)+aEye(HX+34,HC-30,o,1,'#e8a91c',16,FUR);
  const B=o.brows||[14,-14];h+=heavyBrow(HX-36,HC-54-(o.bL||0),B[0])+heavyBrow(HX+36,HC-54-(o.bR||0),B[1]);
  // nariz ancha, boca, mentón, puntos
  h+=`<path d="M${HX-26},${HC+20} L${HX+26},${HC+20} Q${HX+20},${HC+44} ${HX},${HC+50} Q${HX-20},${HC+44} ${HX-26},${HC+20} Z" fill="#5a2a22" ${S4(5)}/><path d="M${HX-14},${HC+26} Q${HX-4},${HC+22} ${HX},${HC+30}" stroke="#a0605a" stroke-width="3" fill="none"/>`+curve(`M${HX},${HC+50} L${HX},${HC+64}`,5);
  const m=o.mouth||'flat';
  if(m==='flat') h+=`<path d="M${HX-30},${HC+70} Q${HX-14},${HC+80} ${HX},${HC+66} Q${HX+14},${HC+80} ${HX+30},${HC+70}" fill="none" ${S4(5.5)}/>`;
  if(m==='roar') h+=`<path d="M${HX-40},${HC+64} Q${HX},${HC+150} ${HX+40},${HC+64} Q${HX},${HC+74} ${HX-40},${HC+64} Z" fill="#3a1010" ${S4(6)}/><path d="M${HX-20},${HC+110} Q${HX},${HC+132} ${HX+20},${HC+110} Q${HX},${HC+118} ${HX-20},${HC+110} Z" fill="#d9536a"/><path d="M${HX-34},${HC+68} L${HX-27},${HC+92} L${HX-20},${HC+70} M${HX+34},${HC+68} L${HX+27},${HC+92} L${HX+20},${HC+70}" fill="#fff" ${S4(3)}/><path d="M${HX-26},${HC+126} L${HX-20},${HC+106} L${HX-14},${HC+128} M${HX+26},${HC+126} L${HX+20},${HC+106} L${HX+14},${HC+128}" fill="#fff" ${S4(3)}/>`;
  if(m==='o') h+=`<ellipse cx="${HX}" cy="${HC+80}" rx="11" ry="14" fill="${INK}"/>`;
  h+=[[-40,46],[-50,58],[-36,64],[40,46],[50,58],[36,64]].map(([x,y])=>`<circle cx="${HX+x}" cy="${HC+y}" r="3.2" fill="#8a5a3a"/>`).join('');
  h+=[-1,1].map(sd=>`<path d="M${HX+sd*54},${HC+54} L${HX+sd*112},${HC+42} M${HX+sd*54},${HC+64} L${HX+sd*114},${HC+68}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`).join('');
  h+=`<path d="M${HX-50},${HC-6} L${HX-62},${HC+6} M${HX+50},${HC-6} L${HX+62},${HC+6}" stroke="#a87038" stroke-width="3.5" stroke-linecap="round"/>`;
  h+=o.overFace||'';
  if(only) return h;
  let s='';
  // cola
  s+=`<path d="M-200,-300 Q-286,-300 -290,-200 Q-292,-130 -250,-110" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M-200,-300 Q-286,-300 -290,-200 Q-292,-130 -250,-110" fill="none" stroke="${FUR}" stroke-width="14" stroke-linecap="round"/>`;
  s+=`<path d="M-262,-120 Q-280,-80 -244,-74 Q-214,-80 -226,-112 Q-236,-130 -262,-120 Z" fill="${MANE}" ${S4(6)}/><path d="M-252,-104 L-236,-86" stroke="#6a2a0e" stroke-width="3.5"/>`;
  // patas del fondo (más oscuras)
  s+=hind(-130,FURS,'#9a6a34',false,.85)+fore(120,FURS,'#9a6a34',false,.85);
  // cuerpo largo y musculoso
  const body='M-218,-290 C-232,-370 -150,-392 -40,-384 C60,-376 150,-392 200,-352 C232,-320 222,-232 190,-206 C120,-172 -20,-186 -130,-190 C-196,-194 -212,-236 -218,-290 Z';
  s+=shaded(body,FUR,FURS,10,-12);
  s+=clipTo(body,`<path d="M-200,-200 Q-40,-230 200,-210 L200,-160 L-200,-160 Z" fill="${FURL}"/>`);
  s+=`<path d="${body}" fill="none" ${S4()}/>`;
  // músculos: hombro, costillas, muslo
  s+=`<path d="M120,-360 Q90,-300 116,-230" fill="none" stroke="${FURS}" stroke-width="6" stroke-linecap="round"/><path d="M-40,-330 Q-30,-300 -40,-260 M-10,-336 Q0,-300 -8,-262" fill="none" stroke="${FURS}" stroke-width="4" stroke-linecap="round" opacity=".7"/><path d="M-150,-350 Q-110,-300 -150,-230" fill="none" stroke="${FURS}" stroke-width="6" stroke-linecap="round"/>`;
  // patas de delante
  s+=hind(-170,FUR,FURS,true)+fore(150,FUR,FURS,true);
  // melena por el pecho
  s+=`<path d="M100,-420 Q140,-270 210,-250 Q260,-300 270,-360 Z" fill="${MANE}" ${S4()}/>`;
  return s+h;}
// ===================== PERRO (pastor alemán) =====================
function perro(o={},only=false){const TAN='#c98a4a', TANS='#a86e36', TANL='#e2b47a', BLK='#2a2224', BLKS='#1a1416';
  const HX=200, HC=-450;
  let h='';
  // orejas puntiagudas
  h+=[-1,1].map(sd=>`<path d="M${HX+sd*30},${HC-60} L${HX+sd*70},${HC-150} L${HX+sd*86},${HC-50} Z" fill="${BLK}" ${S4()}/><path d="M${HX+sd*44},${HC-70} L${HX+sd*68},${HC-126} L${HX+sd*76},${HC-66} Z" fill="#c98a7a"/>`).join('');
  const head=`M${HX-78},${HC-20} C${HX-84},${HC-80} ${HX-40},${HC-96} ${HX},${HC-96} C${HX+40},${HC-96} ${HX+84},${HC-80} ${HX+78},${HC-20} C${HX+74},${HC+30} ${HX+48},${HC+60} ${HX+30},${HC+96} Q${HX},${HC+118} ${HX-30},${HC+96} C${HX-48},${HC+60} ${HX-74},${HC+30} ${HX-78},${HC-20} Z`;
  h+=shaded(head,TAN,TANS,8,-8);
  h+=clipTo(head,`<path d="M${HX-90},${HC-100} L${HX+90},${HC-100} L${HX+90},${HC-50} Q${HX+40},${HC-20} ${HX+20},${HC+20} L${HX-20},${HC+20} Q${HX-40},${HC-20} ${HX-90},${HC-50} Z" fill="${BLK}" opacity=".92"/><path d="M${HX-30},${HC+40} Q${HX},${HC+30} ${HX+30},${HC+40} L${HX+40},${HC+140} L${HX-40},${HC+140} Z" fill="${BLK}" opacity=".9"/><ellipse cx="${HX-34}" cy="${HC-34}" rx="16" ry="10" fill="${TANL}"/><ellipse cx="${HX+34}" cy="${HC-34}" rx="16" ry="10" fill="${TANL}"/>`);
  h+=`<path d="${head}" fill="none" ${S4()}/>`;
  h+=aEye(HX-32,HC-14,o,-1,'#6a3a1a',15,BLK)+aEye(HX+32,HC-14,o,1,'#6a3a1a',15,BLK);
  const B=o.brows||[10,-10];h+=heavyBrow(HX-34,HC-38-(o.bL||0),B[0],38,10).replace(`fill="${INK}"`,`fill="${INK}"`)+heavyBrow(HX+34,HC-38-(o.bR||0),B[1],38,10);
  // hocico largo con nariz grande
  h+=`<path d="M${HX-24},${HC+52} L${HX+24},${HC+52} Q${HX+22},${HC+76} ${HX},${HC+82} Q${HX-22},${HC+76} ${HX-24},${HC+52} Z" fill="#111" ${S4(5)}/><ellipse cx="${HX-8}" cy="${HC+58}" rx="7" ry="4" fill="#fff" opacity=".6"/>`;
  const m=o.mouth||'flat';
  if(m==='flat') h+=`<path d="M${HX-28},${HC+98} Q${HX},${HC+104} ${HX+28},${HC+98}" fill="none" stroke="${TANL}" stroke-width="5" stroke-linecap="round"/>`;
  if(m==='pant') h+=`<path d="M${HX-30},${HC+92} Q${HX},${HC+130} ${HX+30},${HC+92} Q${HX},${HC+100} ${HX-30},${HC+92} Z" fill="#3a1a1a" ${S4(5)}/><path d="M${HX-12},${HC+100} Q${HX-14},${HC+140} ${HX},${HC+146} Q${HX+14},${HC+140} ${HX+12},${HC+100} Z" fill="#e2647e" ${S4(4.5)}/>`;
  if(m==='bark') h+=`<path d="M${HX-34},${HC+90} Q${HX},${HC+156} ${HX+34},${HC+90} Q${HX},${HC+98} ${HX-34},${HC+90} Z" fill="#3a1a1a" ${S4(5.5)}/><path d="M${HX-28},${HC+92} L${HX-22},${HC+108} L${HX-16},${HC+94} M${HX+28},${HC+92} L${HX+22},${HC+108} L${HX+16},${HC+94}" fill="#fff" ${S4(3)}/>`;
  if(m==='growl') h+=`<path d="M${HX-30},${HC+88} Q${HX},${HC+80} ${HX+30},${HC+88} L${HX+30},${HC+106} Q${HX},${HC+114} ${HX-30},${HC+106} Z" fill="#fff" ${S4(5)}/>`+[-18,-6,6,18].map(x=>`<path d="M${HX+x},${HC+86} L${HX+x},${HC+110}" stroke="${INK}" stroke-width="3"/>`).join('')+`<path d="M${HX-22},${HC+86} l4,10 l4,-10 M${HX+14},${HC+86} l4,10 l4,-10" fill="#fff" ${S4(2.5)}/><path d="M${HX-30},${HC+40} Q${HX-20},${HC+46} ${HX-14},${HC+40} M${HX+14},${HC+40} Q${HX+20},${HC+46} ${HX+30},${HC+40}" stroke="${INK}" stroke-width="3.5" fill="none"/>`;
  h+=o.overFace||'';
  if(only) return h;
  let s='';
  // cola peluda colgando
  s+=`<path d="M-210,-320 Q-280,-280 -300,-180 Q-306,-140 -280,-120 Q-262,-160 -250,-200 Q-228,-270 -196,-292 Z" fill="${TAN}" ${S4()}/><path d="M-300,-180 Q-306,-140 -280,-120 Q-276,-150 -270,-170 Z" fill="${BLK}"/><path d="M-270,-250 Q-262,-230 -270,-206" fill="none" stroke="${TANS}" stroke-width="4"/>`;
  s+=hind(-130,TANS,'#8a5628',false,.7)+fore(110,TANS,'#8a5628',false,.7);
  const body='M-214,-300 C-226,-372 -140,-394 -40,-386 C60,-380 140,-400 196,-370 C226,-340 218,-260 186,-236 C120,-206 -10,-220 -120,-222 C-192,-224 -208,-252 -214,-300 Z';
  s+=shaded(body,TAN,TANS,10,-12);
  // silla de montar negra en el lomo
  s+=clipTo(body,`<path d="M-230,-400 L170,-410 Q150,-330 60,-310 Q-60,-296 -160,-320 Q-210,-330 -230,-300 Z" fill="${BLK}"/><path d="M-160,-360 Q-60,-372 60,-360" fill="none" stroke="#4a3e40" stroke-width="5" stroke-linecap="round"/><path d="M-200,-240 Q-40,-262 190,-246 L190,-200 L-200,-200 Z" fill="${TANL}"/>`);
  s+=`<path d="${body}" fill="none" ${S4()}/>`;
  s+=`<path d="M120,-350 Q100,-300 118,-246" fill="none" stroke="${TANS}" stroke-width="5" stroke-linecap="round"/><path d="M-150,-330 Q-118,-286 -150,-236" fill="none" stroke="${TANS}" stroke-width="5" stroke-linecap="round"/>`;
  s+=hind(-168,TAN,TANS,false,.78)+fore(150,TAN,TANS,false,.75);
  // cuello y collar de cuero con chapa
  s+=`<path d="M120,-380 Q150,-300 200,-280 Q250,-300 262,-380 Q200,-420 120,-380 Z" fill="${TAN}" ${S4()}/><path d="M160,-372 Q200,-356 246,-376" fill="none" stroke="${BLK}" stroke-width="22"/>`;
  s+=`<path d="M138,-350 Q200,-318 256,-350 L252,-330 Q200,-298 142,-330 Z" fill="#6a3a1e" ${S4(5)}/>`+[160,184,216,240].map(x=>`<circle cx="${x}" cy="${-338+Math.abs(x-200)*.25}" r="3.5" fill="#d9dde3"/>`).join('')+
    `<circle cx="200" cy="-306" r="5" fill="none" stroke="#c9ced6" stroke-width="3.5"/><path d="M200,-300 L212,-276 L200,-262 L188,-276 Z" fill="#c9ced6" ${S4(3.5)}/>`;
  return s+h;}
// ===================== GALLINA (roja de campo) =====================
function gallina(o={},only=false){const RED='#a8452a', REDS='#86321e', REDL='#c8653a', GOLDN='#d9973a', COMB='#d8322e', LEG='#e8b83a';
  const HX=150, HC=-470;
  let h='';
  // cresta de sierra
  h+=`<path d="M${HX-50},${HC-50} L${HX-56},${HC-92} L${HX-34},${HC-74} L${HX-30},${HC-118} L${HX-8},${HC-86} L${HX+4},${HC-126} L${HX+20},${HC-88} L${HX+38},${HC-114} L${HX+42},${HC-76} L${HX+64},${HC-90} L${HX+56},${HC-46} Z" fill="${COMB}" ${S4(6.5)}/>`;
  const head=`M${HX-58},${HC-10} C${HX-62},${HC-60} ${HX-24},${HC-74} ${HX+6},${HC-72} C${HX+44},${HC-70} ${HX+70},${HC-44} ${HX+68},${HC-6} C${HX+66},${HC+34} ${HX+40},${HC+56} ${HX+4},${HC+56} C${HX-34},${HC+56} ${HX-56},${HC+30} ${HX-58},${HC-10} Z`;
  h+=shaded(head,GOLDN,'#b8782a',6,-6);
  h+=`<ellipse cx="${HX+30}" cy="${HC+6}" rx="20" ry="16" fill="#e8584a" opacity=".85"/>`;
  // ojo de perfil con párpado y ceja
  h+=aEye(HX+24,HC-14,o,1,'#e8a020',15,GOLDN);
  const B=o.brows||[-14];h+=heavyBrow(HX+24,HC-38-(o.bR||0),B[1]??B[0]??-14,36,10);
  // pico ganchudo
  const bo=o.beak==='open';
  h+=`<path d="M${HX+56},${HC+2} Q${HX+100},${HC+4} ${HX+112},${HC+26} Q${HX+90},${HC+20} ${HX+56},${HC+22} Z" fill="${LEG}" ${S4(5)}/>`;
  h+=bo?`<path d="M${HX+56},${HC+24} Q${HX+86},${HC+34} ${HX+100},${HC+50} Q${HX+76},${HC+48} ${HX+54},${HC+38} Z" fill="#d9a22a" ${S4(5)}/><path d="M${HX+56},${HC+22} L${HX+92},${HC+30}" stroke="#7a2a1a" stroke-width="4"/>`:`<path d="M${HX+56},${HC+22} Q${HX+80},${HC+24} ${HX+96},${HC+30} Q${HX+76},${HC+36} ${HX+56},${HC+34} Z" fill="#d9a22a" ${S4(5)}/>`;
  h+=`<circle cx="${HX+70}" cy="${HC+8}" r="2.5" fill="${INK}"/>`;
  // barbillas
  h+=`<path d="M${HX+50},${HC+34} Q${HX+40},${HC+84} ${HX+60},${HC+88} Q${HX+80},${HC+82} ${HX+70},${HC+36} Z" fill="${COMB}" ${S4(5.5)}/>`;
  h+=o.overFace||'';
  if(only) return h;
  let s='';
  // patas escamosas con garras
  const leg=(x,dx)=>`<path d="M${x},-170 L${x+dx},-20" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${x},-170 L${x+dx},-20" stroke="${LEG}" stroke-width="8" stroke-linecap="round"/>`+
    [-110,-90,-70,-50].map(y=>{const t=(y+170)/150;return `<path d="M${x+dx*t-5},${y} L${x+dx*t+5},${y-3}" stroke="#a87a18" stroke-width="2.5"/>`}).join('')+
    [[-34,4],[40,6],[20,8],[-14,-6]].map(([fx,fy])=>`<path d="M${x+dx},-20 L${x+dx+fx},${fy}" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M${x+dx},-20 L${x+dx+fx},${fy}" stroke="${LEG}" stroke-width="7" stroke-linecap="round"/>`).join('')+
    [[-34,4],[40,6],[20,8]].map(([fx,fy])=>`<path d="M${x+dx+fx},${fy} l${fx>0?8:-8},2" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`).join('');
  s+=leg(-10,-6)+leg(46,6);
  // cola negra verdosa: plumas anchas curvadas
  s+=[[-236,-500,.34],[-290,-440,.34],[-310,-360,.32],[-290,-280,.3]].map(([tx,ty,k],i)=>{const bx=-130,by=-310, mx=(bx+tx)/2, my=(by+ty)/2, nx=-(ty-by)*k, ny=(tx-bx)*k;
    return `<path d="M${bx},${by} Q${mx+nx*1.4},${my+ny*1.4} ${tx},${ty} Q${mx-nx*.2},${my-ny*.2} ${bx},${by} Z" fill="${['#28382e','#1e2a24','#2f4436','#1e2a24'][i]}" ${S4(6)}/><path d="M${bx},${by} Q${mx+nx*.6},${my+ny*.6} ${tx},${ty}" fill="none" stroke="#5a9a70" stroke-width="3.5" opacity=".8"/>`}).join('');
  // cuerpo
  const body='M-170,-300 C-180,-380 -80,-400 10,-380 C90,-364 140,-330 150,-270 C160,-200 110,-150 30,-146 C-60,-142 -150,-180 -170,-300 Z';
  s+=shaded(body,RED,REDS,10,-12);
  s+=clipTo(body,[...Array(5)].map((_,r)=>[...Array(6)].map((_,c)=>{const x=-130+c*44+(r%2)*22, y=-340+r*36;return `<path d="M${x-16},${y} Q${x},${y+16} ${x+16},${y}" fill="none" stroke="${REDS}" stroke-width="4" stroke-linecap="round"/>`}).join('')).join(''));
  s+=`<path d="${body}" fill="none" ${S4()}/>`;
  // ala
  s+=`<path d="M-120,-330 Q-30,-356 50,-310 Q76,-260 30,-224 Q-40,-200 -110,-230 Q-140,-270 -120,-330 Z" fill="${REDL}" ${S4(6.5)}/>`+
    [[-90,-246],[-50,-236],[-10,-238],[26,-250]].map(([x,y])=>`<path d="M${x-18},${y-8} Q${x},${y+16} ${x+18},${y-8}" fill="#a8452a" ${S4(4)}/>`).join('')+
    `<path d="M-100,-300 Q-20,-320 40,-290" fill="none" stroke="${REDS}" stroke-width="4" stroke-linecap="round"/><path d="M-104,-276 Q-30,-292 46,-266" fill="none" stroke="${REDS}" stroke-width="4" stroke-linecap="round"/>`;
  // cuello con plumas doradas (gola)
  s+=`<path d="M70,-500 Q40,-420 60,-350 Q110,-320 170,-340 Q210,-400 200,-460 Q150,-520 70,-500 Z" fill="${GOLDN}" ${S4()}/>`+
    [[80,-440],[110,-420],[140,-430],[90,-390],[124,-376],[160,-392],[170,-440]].map(([x,y])=>`<path d="M${x-8},${y-14} Q${x},${y+14} ${x+8},${y-14}" fill="none" stroke="#b8782a" stroke-width="4" stroke-linecap="round"/>`).join('');
  return s+h;}
// ===================== GALLINA (versión redondita, la que gustó) =====================
function shadeClip(path,fill,shadeCol,dx=18,dy=-14){const c=uid('ac');return `<defs><clipPath id="${c}"><path d="${path}"/></clipPath></defs><path d="${path}" fill="${shadeCol}"/><g clip-path="url(#${c})"><path d="${path}" fill="${fill}" transform="translate(${dx},${dy})"/></g>`}
function gallina(o={},only=false){const HX=22, HC=-404, WH='#fbf6ee', WHS='#ddd2c4', RED='#d8322e', BEAK='#f2a42a';
  let h='';
  h+=`<path d="M${HX-50},${HC-62} Q${HX-62},${HC-112} ${HX-28},${HC-110} Q${HX-22},${HC-148} ${HX+8},${HC-130} Q${HX+30},${HC-156} ${HX+46},${HC-120} Q${HX+76},${HC-112} ${HX+60},${HC-70} Z" fill="${RED}" ${S4()}/><path d="M${HX-24},${HC-100} Q${HX-20},${HC-84} ${HX-10},${HC-76} M${HX+16},${HC-110} Q${HX+18},${HC-92} ${HX+26},${HC-80}" fill="none" stroke="#a81e1e" stroke-width="4" stroke-linecap="round"/>`;
  const headP=`M${HX-92},${HC} C${HX-94},${HC-70} ${HX-48},${HC-90} ${HX},${HC-90} C${HX+52},${HC-90} ${HX+94},${HC-66} ${HX+92},${HC} C${HX+90},${HC+64} ${HX+50},${HC+84} ${HX},${HC+84} C${HX-50},${HC+84} ${HX-90},${HC+62} ${HX-92},${HC} Z`;
  h+=shadeClip(headP,WH,WHS,10,-8)+`<path d="${headP}" fill="none" ${S4()}/>`;
  h+=`<ellipse cx="${HX-56}" cy="${HC+22}" rx="16" ry="10" fill="#f28a8a" opacity=".55"/><ellipse cx="${HX+66}" cy="${HC+16}" rx="12" ry="9" fill="#f28a8a" opacity=".55"/>`;
  const ex=o.eyes||'lid';
  const hEye=(x,sd)=>ex==='lid'||ex==='angry'?`<g transform="translate(${x},${HC-6}) rotate(${sd*(ex==='angry'?-14:2)})"><line x1="-17" y1="0" x2="17" y2="0" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/><path d="M-8,0 Q-8,14 0,14 Q8,14 8,0 Z" fill="${INK}"/></g>`:eye(x,HC-6,ex,sd,o);
  h+=hEye(HX-20,-1)+hEye(HX+38,1);
  const B=o.brows||[0,-6];h+=brow(HX-20,HC-34-(o.bL||0),B[0],32,o.arcL??6,8.5)+brow(HX+40,HC-34-(o.bR||0),B[1],32,o.arcR??4,8.5);
  const bo=o.beak==='open';
  h+=`<path d="M${HX+2},${HC+60} Q${HX-8},${HC+98} ${HX+12},${HC+102} Q${HX+34},${HC+98} ${HX+26},${HC+60} Z" fill="${RED}" ${S4(5.5)}/>`;
  h+=`<path d="M${HX-2},${HC+40} Q${HX+26},${HC+44} ${HX+48},${HC+40} Q${HX+30},${HC+(bo?72:56)} ${HX},${HC+(bo?66:52)} Z" fill="#e8912a" ${S4(5.5)}/>`;
  h+=`<path d="M${HX-8},${HC+20} Q${HX+30},${HC+12} ${HX+66},${HC+34} Q${HX+30},${HC+44} ${HX-8},${HC+40} Z" fill="#f7b83c" ${S4(5.5)}/><path d="M${HX+8},${HC+24} Q${HX+26},${HC+20} ${HX+40},${HC+26}" stroke="#fde59a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  h+=`<circle cx="${HX+4}" cy="${HC+26}" r="2.5" fill="${INK}"/>`;
  h+=o.overFace||'';
  if(only) return h;
  let s='';
  const leg=(x)=>`<path d="M${x},-120 L${x-4},-8" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M${x},-120 L${x-4},-8" fill="none" stroke="${BEAK}" stroke-width="6" stroke-linecap="round"/>`+
    [[-26,4],[0,8],[26,4]].map(([dx,dy])=>`<path d="M${x-4},-8 L${x-4+dx},${dy}" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M${x-4},-8 L${x-4+dx},${dy}" stroke="${BEAK}" stroke-width="6" stroke-linecap="round"/>`).join('');
  s+=leg(-30)+leg(34);
  s+=[[-196,-352],[-214,-292],[-206,-226]].map(([tx,ty],i)=>{const bx=-86,by=-214, mx=(bx+tx)/2, my=(by+ty)/2, nx=-(ty-by)*.22, ny=(tx-bx)*.22;
    return `<path d="M${bx},${by} Q${mx+nx},${my+ny} ${tx},${ty} Q${mx-nx},${my-ny} ${bx},${by} Z" fill="${i==1?'#f2ebe0':WH}" ${S4(6.5)}/><path d="M${bx-6},${by-2} Q${mx},${my} ${tx+10},${ty+4}" fill="none" stroke="${WHS}" stroke-width="4" stroke-linecap="round"/>`}).join('');
  const body='M-110,-190 C-120,-290 -40,-330 30,-320 C120,-310 140,-230 130,-170 C120,-100 60,-80 0,-82 C-70,-84 -104,-120 -110,-190 Z';
  s+=shadeClip(body,WH,WHS,12,-12)+`<path d="${body}" fill="none" ${S4()}/>`;
  s+=[[60,-250],[84,-210],[50,-196],[76,-160],[100,-176],[40,-150]].map(([x,y])=>`<path d="M${x-12},${y} Q${x},${y+12} ${x+12},${y}" fill="none" stroke="${WHS}" stroke-width="4" stroke-linecap="round"/>`).join('');
  s+=`<path d="M-70,-250 Q-10,-280 40,-230 Q60,-180 20,-150 Q-30,-130 -70,-160 Q-90,-200 -70,-250 Z" fill="#f2ebe0" ${S4(6.5)}/>`+
    [[-40,-172],[-12,-166],[16,-170]].map(([x,y])=>`<path d="M${x-14},${y-6} Q${x},${y+14} ${x+14},${y-6}" fill="none" ${S4(4)}/>`).join('')+
    [[-30,-204],[0,-200],[26,-206]].map(([x,y])=>`<path d="M${x-14},${y-6} Q${x},${y+12} ${x+14},${y-6}" fill="none" stroke="${WHS}" stroke-width="4"/>`).join('');
  s+=`<ellipse cx="-100" cy="-26" rx="22" ry="28" fill="#f4e2c4" ${S4(6)}/><ellipse cx="-106" cy="-36" rx="6" ry="9" fill="#fff" opacity=".7"/>`;
  return s+h;}
// ======== VERSIÓN 1 MEJORADA (sentados, estilo del gato del canal) ========
function qEye(x,y,o,sd,iris,lidCol,pupil='round',r=24){const e=o.eyes||'lid';
  if(e==='happy') return curve(`M${x-18},${y+8} Q${x},${y-14} ${x+18},${y+8}`,8);
  const big=e==='wide'?r*1.15:r, c=uid('ec');
  let s=`<defs><clipPath id="${c}"><circle cx="${x}" cy="${y}" r="${big}"/></clipPath></defs><circle cx="${x}" cy="${y}" r="${big}" fill="${iris}"/>`;
  s+=`<g clip-path="url(#${c})"><circle cx="${x-big*.3}" cy="${y+big*.4}" r="${big*.8}" fill="#000" opacity=".12"/></g>`;
  const pr=e==='wide'?big*.32:big*.42, px=x+(o.look?o.look[0]:0), py=y+(o.look?o.look[1]:0);
  s+=pupil==='slit'&&e!=='wide'?`<ellipse cx="${px}" cy="${py}" rx="${pr*.42}" ry="${pr*1.6}" fill="${INK}"/>`:`<circle cx="${px}" cy="${py}" r="${pr}" fill="${INK}"/>`;
  s+=`<circle cx="${px+pr*.5}" cy="${py-pr*.55}" r="${pr*.38}" fill="#fff"/><circle cx="${px-pr*.5}" cy="${py+pr*.6}" r="${pr*.16}" fill="#fff" opacity=".8"/>`;
  if(e==='lid'||e==='angry'){const t=e==='angry'?sd*-16:sd*-4, ly=e==='angry'?-big*.15:-big*.25;
    s+=`<g clip-path="url(#${c})"><rect x="${x-big-4}" y="${y-big*2-4}" width="${big*2+8}" height="${big*2+ly+4}" fill="${lidCol}" transform="rotate(${t} ${x} ${y})"/></g>`;
    s+=`<line x1="${x-big-6}" y1="${y+ly}" x2="${x+big+6}" y2="${y+ly}" stroke="${INK}" stroke-width="7" stroke-linecap="round" transform="rotate(${t} ${x} ${y})"/>`;}
  return s+`<circle cx="${x}" cy="${y}" r="${big}" fill="none" stroke="${INK}" stroke-width="6.5"/>`;}
function qBrows(x1,x2,y,o,def){const b=o.brows||def;return brow(x1,y-(o.bL||0),b[0],42,o.arcL??6,10.5)+brow(x2,y-(o.bR||0),b[1],42,o.arcR??6,10.5)}
const QB='M-88,-6 C-122,-112 -104,-238 -46,-276 L46,-276 C104,-238 122,-112 88,-6 Q0,8 -88,-6 Z';
function qBody(col,shade,belly,marks=''){return shadeClip(QB,col,shade,-16,-6)+clipTo(QB,
    `<path d="M-44,-260 Q-60,-150 -36,-30 Q0,-14 36,-30 Q60,-150 44,-260 Z" fill="${belly}"/>`+
    // pelo del pecho en zigzag
    `<path d="M-40,-246 l10,14 l8,-12 l10,14 l8,-12 l8,12 l10,-14 l8,12 l10,-14" fill="none" stroke="${shade}" stroke-width="4" stroke-linejoin="round" opacity=".7"/>`+marks+
    `<path d="M-70,-200 Q-88,-150 -80,-90 M70,-200 Q88,-150 80,-90" fill="none" stroke="${shade}" stroke-width="5" stroke-linecap="round"/>`)+
  `<path d="${QB}" fill="none" ${S4()}/>`+
  `<path d="M-88,-8 Q-134,-40 -118,-100 Q-100,-136 -66,-118" fill="${col}" ${S4()}/><path d="M88,-8 Q134,-40 118,-100 Q100,-136 66,-118" fill="${col}" ${S4()}/>`+
  `<path d="M-104,-60 Q-110,-82 -98,-100 M104,-60 Q110,-82 98,-100" fill="none" stroke="${shade}" stroke-width="4" stroke-linecap="round"/>`+
  curve('M-28,-156 Q-32,-72 -32,-16',6)+curve('M28,-156 Q32,-72 32,-16',6)}
function qPaws(col,claws=false){const toe=(x,y)=>`<path d="M${x-10},${y-14} L${x-10},${y-2} M${x+4},${y-14} L${x+4},${y-2} M${x+18},${y-14} L${x+18},${y-4}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  return [-1,1].map(sd=>`<ellipse cx="${sd*34}" cy="-8" rx="32" ry="16" fill="${col}" ${S4(6.5)}/>`+toe(sd*34-4,-6)+
      (claws?[-12,2,16].map(dx=>`<path d="M${sd*34+dx-4},0 l4,8 l4,-8" fill="#fbf3e2" ${S4(2.5)}/>`).join(''):'')).join('')+
    [-1,1].map(sd=>`<ellipse cx="${sd*104}" cy="-6" rx="32" ry="14" fill="${col}" ${S4(6.5)}/>`+toe(sd*104-4,-4)).join('')}
// ---------- PERRO (beagle sentado) ----------
function perro(o={},only=false){const HC=-372, TAN='#d9944a', TANS='#b0703a', TANL='#ecb878', DARK='#5a3420', WH='#fbf6ef', WHS='#e2d6c8';
  const headP=`M-118,${HC} C-120,${HC-94} -60,${HC-116} 0,${HC-116} C64,${HC-116} 122,${HC-90} 118,${HC} C116,${HC+80} 64,${HC+102} 0,${HC+102} C-64,${HC+102} -116,${HC+78} -118,${HC} Z`;
  let h='';
  // orejas largas con textura
  h+=[-1,1].map(sd=>`<path d="M${sd*84},${HC-84} Q${sd*170},${HC-70} ${sd*162},${HC+50} Q${sd*156},${HC+100} ${sd*112},${HC+72} Q${sd*94},${HC-6} ${sd*68},${HC-72} Z" fill="${DARK}" ${S4()}/>`+
    `<path d="M${sd*120},${HC-50} Q${sd*146},${HC+4} ${sd*136},${HC+56} M${sd*104},${HC-40} Q${sd*124},${HC+10} ${sd*118},${HC+50}" fill="none" stroke="#7a4a2e" stroke-width="5" stroke-linecap="round"/>`).join('');
  h+=shadeClip(headP,TAN,TANS,10,-10);
  h+=clipTo(headP,`<path d="M-16,${HC-120} Q0,${HC-60} -12,${HC+10} L12,${HC+10} Q0,${HC-60} 16,${HC-120} Z" fill="${WH}"/>`+
    `<ellipse cx="0" cy="${HC+56}" rx="86" ry="56" fill="${WH}"/><ellipse cx="0" cy="${HC+92}" rx="70" ry="24" fill="${WHS}"/>`+
    // mechones de las mejillas
    `<path d="M-118,${HC+30} l18,6 l-12,10 l18,4" fill="none" stroke="${TANS}" stroke-width="4" stroke-linejoin="round"/><path d="M118,${HC+30} l-18,6 l12,10 l-18,4" fill="none" stroke="${TANS}" stroke-width="4" stroke-linejoin="round"/>`+
    `<ellipse cx="-44" cy="${HC-44}" rx="20" ry="9" fill="${TANL}" opacity=".9"/><ellipse cx="44" cy="${HC-44}" rx="20" ry="9" fill="${TANL}" opacity=".9"/>`);
  h+=`<path d="${headP}" fill="none" ${S4()}/>`;
  h+=qEye(-44,HC-10,o,-1,'#7a4a24',TAN)+qEye(44,HC-10,o,1,'#7a4a24',TAN);
  h+=qBrows(-46,46,HC-48,o,[-4,4]);
  h+=`<path d="M-28,${HC+22} Q0,${HC+8} 28,${HC+22} Q26,${HC+46} 0,${HC+52} Q-26,${HC+46} -28,${HC+22} Z" fill="#241614" ${S4(5)}/><ellipse cx="-9" cy="${HC+22}" rx="9" ry="5" fill="#fff" opacity=".75"/><path d="M-10,${HC+40} Q-6,${HC+44} -2,${HC+40} M2,${HC+40} Q6,${HC+44} 10,${HC+40}" stroke="#555" stroke-width="2.5" fill="none"/>`;
  h+=curve(`M0,${HC+52} L0,${HC+66}`,5);
  const m=o.mouth||'tongue';
  if(m==='tongue') h+=`<path d="M-36,${HC+62} Q-18,${HC+84} 0,${HC+66} Q18,${HC+84} 36,${HC+62}" fill="none" ${S4(5.5)}/><path d="M-15,${HC+74} Q-17,${HC+112} 0,${HC+116} Q17,${HC+112} 15,${HC+74} Q0,${HC+80} -15,${HC+74} Z" fill="#ef6f86" ${S4(5)}/><path d="M0,${HC+84} L0,${HC+104}" stroke="#c84a64" stroke-width="3"/><ellipse cx="-6" cy="${HC+94}" rx="3" ry="6" fill="#fff" opacity=".45"/>`;
  if(m==='bark') h+=`<path d="M-38,${HC+64} Q0,${HC+134} 38,${HC+64} Q0,${HC+74} -38,${HC+64} Z" fill="#3a1a1a" ${S4(5.5)}/><path d="M-18,${HC+100} Q0,${HC+124} 18,${HC+100} Q0,${HC+108} -18,${HC+100} Z" fill="#ef6f86"/><path d="M-32,${HC+68} L-26,${HC+84} L-20,${HC+70} M32,${HC+68} L26,${HC+84} L20,${HC+70}" fill="#fff" ${S4(3)}/>`;
  if(m==='growl') h+=`<rect x="-32" y="${HC+62}" width="64" height="24" rx="5" fill="#fff" ${S4(5)}/><path d="M-32,${HC+74} L32,${HC+74} M-11,${HC+62} L-11,${HC+86} M11,${HC+62} L11,${HC+86}" stroke="${INK}" stroke-width="3"/><path d="M-36,${HC+30} Q-28,${HC+38} -20,${HC+30} M20,${HC+30} Q28,${HC+38} 36,${HC+30}" stroke="${INK}" stroke-width="3.5" fill="none"/>`;
  h+=[[-52,HC+44],[-62,HC+58],[-46,HC+64],[52,HC+44],[62,HC+58],[46,HC+64]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#b78a66"/>`).join('');
  h+=o.overFace||'';
  if(only) return h;
  let s='';
  s+=`<path d="M74,-40 Q156,-60 168,-160 Q172,-200 156,-216" fill="none" stroke="${INK}" stroke-width="40" stroke-linecap="round"/><path d="M74,-40 Q156,-60 168,-160 Q172,-200 156,-216" fill="none" stroke="${TAN}" stroke-width="26" stroke-linecap="round"/><path d="M166,-176 Q172,-200 156,-216" fill="none" stroke="${WH}" stroke-width="26" stroke-linecap="round"/>`;
  s+=`<path d="M150,-226 l-8,-12 M162,-224 l2,-14 M172,-214 l10,-8" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M184,-204 q14,-6 18,-20 M190,-172 q16,0 24,-12" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  s+=qBody(TAN,TANS,WH,`<ellipse cx="-80" cy="-150" rx="28" ry="36" fill="${DARK}" transform="rotate(-20 -80 -150)"/><ellipse cx="84" cy="-196" rx="20" ry="24" fill="${DARK}"/><ellipse cx="96" cy="-128" rx="13" ry="15" fill="${DARK}"/>`);
  s+=qPaws(WH);
  s+=`<path d="M-90,-270 Q0,-232 90,-270 L86,-244 Q0,-208 -86,-244 Z" fill="#d23a32" ${S4(6)}/>`+[-64,-40,40,64].map(x=>`<circle cx="${x}" cy="${-252+Math.abs(x)*.14}" r="4" fill="#f2d16a" ${S4(1.5)}/>`).join('')+
    `<rect x="-58" y="-262" width="18" height="20" rx="3" fill="none" stroke="#c9ced6" stroke-width="4" transform="rotate(14 -49 -252)"/>`;
  s+=`<g transform="translate(0,-212)"><circle cx="0" cy="-10" r="6" fill="none" stroke="#c9a24a" stroke-width="4"/><path d="M-20,4 a8,8 0 1 1 7,-9 L13,-5 a8,8 0 1 1 7,9 a8,8 0 1 1 -7,9 L-13,13 a8,8 0 1 1 -7,-9 Z" fill="${GOLD}" ${S4(3.5)}/><text x="0" y="8" text-anchor="middle" font-family="Inter" font-weight="900" font-size="9" fill="#8a5a10">MAX</text></g>`;
  return s+h;}
// ---------- LEÓN (sentado) ----------
function leon(o={},only=false){const HC=-384, FUR='#e8b064', FURS='#c08442', FURL='#f4cf94', MANE='#8e3f17', MANEM='#b4561f', MANEL='#d9772e', MUZ='#fbeeda';
  const lobes=(R,n,ry,off=0)=>{let d='';for(let i=0;i<n;i++){const a0=i/n*2*Math.PI+off, a1=(i+1)/n*2*Math.PI+off, am=(a0+a1)/2;
    const p=(a,r)=>`${(Math.cos(a)*r).toFixed(1)},${(HC+12+Math.sin(a)*r*ry).toFixed(1)}`;
    d+=(i?'':`M${p(a0,R)} `)+`Q${p(am,R*1.24)} ${p(a1,R)} `;}return d+'Z'};
  let h=`<path d="${lobes(176,16,1.04)}" fill="${MANE}" ${S4()}/><path d="${lobes(150,14,1.04,.2)}" fill="${MANEM}" ${S4(5)}/><path d="${lobes(126,12,1.04,.1)}" fill="${MANEL}" ${S4(4.5)}/>`;
  h+=[...Array(22)].map((_,i)=>{const a=i/22*2*Math.PI+.1,r1=128,r2=196;return `<path d="M${(Math.cos(a)*r1).toFixed(0)},${(HC+12+Math.sin(a)*r1).toFixed(0)} Q${(Math.cos(a+.1)*(r1+r2)/2).toFixed(0)},${(HC+12+Math.sin(a+.1)*(r1+r2)/2).toFixed(0)} ${(Math.cos(a+.05)*r2).toFixed(0)},${(HC+12+Math.sin(a+.05)*r2).toFixed(0)}" fill="none" stroke="#6a2a0e" stroke-width="4" stroke-linecap="round" opacity=".85"/>`}).join('');
  h+=[-1,1].map(sd=>`<circle cx="${sd*88}" cy="${HC-94}" r="30" fill="${FUR}" ${S4()}/><circle cx="${sd*88}" cy="${HC-92}" r="15" fill="#b8704a"/><path d="M${sd*80},${HC-104} l${sd*6},-6 M${sd*92},${HC-106} l${sd*2},-8" stroke="${FURL}" stroke-width="3" stroke-linecap="round"/>`).join('');
  const headP=`M-112,${HC} C-114,${HC-92} -56,${HC-110} 0,${HC-110} C58,${HC-110} 114,${HC-90} 112,${HC} C110,${HC+82} 60,${HC+104} 0,${HC+104} C-60,${HC+104} -110,${HC+80} -112,${HC} Z`;
  h+=shadeClip(headP,FUR,FURS,10,-10);
  h+=clipTo(headP,`<ellipse cx="-30" cy="${HC+50}" rx="46" ry="40" fill="${MUZ}"/><ellipse cx="30" cy="${HC+50}" rx="46" ry="40" fill="${MUZ}"/><ellipse cx="0" cy="${HC+86}" rx="32" ry="22" fill="${MUZ}"/>`+
    `<path d="M-14,${HC-96} Q-4,${HC-50} -12,${HC+10} M14,${HC-96} Q4,${HC-50} 12,${HC+10}" fill="none" stroke="${FURS}" stroke-width="5" stroke-linecap="round"/>`+
    `<path d="M-112,${HC+20} l16,6 l-10,10 l16,6 M112,${HC+20} l-16,6 l10,10 l-16,6" fill="none" stroke="${FURS}" stroke-width="4" stroke-linejoin="round"/>`);
  h+=`<path d="${headP}" fill="none" ${S4()}/>`;
  h+=qEye(-42,HC-14,o,-1,'#e8a91c',FUR)+qEye(42,HC-14,o,1,'#e8a91c',FUR);
  h+=qBrows(-44,44,HC-54,o,[10,-10]);
  h+=`<path d="M-30,${HC+20} L30,${HC+20} Q22,${HC+46} 0,${HC+52} Q-22,${HC+46} -30,${HC+20} Z" fill="#7a3a2a" ${S4(5)}/><ellipse cx="-10" cy="${HC+26}" rx="9" ry="4.5" fill="#fff" opacity=".55"/>`+curve(`M0,${HC+52} L0,${HC+64}`,5);
  const m=o.mouth||'smile';
  if(m==='smile') h+=`<path d="M-34,${HC+60} Q-16,${HC+78} 0,${HC+64} Q16,${HC+78} 34,${HC+60}" fill="none" ${S4(5.5)}/><path d="M-10,${HC+98} l4,10 l6,-8 l6,8 l4,-10" fill="${MUZ}" ${S4(3.5)}/>`;
  if(m==='roar') h+=`<path d="M-46,${HC+62} Q0,${HC+152} 46,${HC+62} Q0,${HC+72} -46,${HC+62} Z" fill="#3a1414" ${S4(6)}/><path d="M-22,${HC+110} Q0,${HC+134} 22,${HC+110} Q0,${HC+118} -22,${HC+110} Z" fill="#ef6f86"/><path d="M-40,${HC+66} L-32,${HC+90} L-26,${HC+68} M40,${HC+66} L32,${HC+90} L26,${HC+68}" fill="#fff" ${S4(3)}/><path d="M-32,${HC+126} L-26,${HC+108} L-20,${HC+130} M32,${HC+126} L26,${HC+108} L20,${HC+130}" fill="#fff" ${S4(3)}/>`;
  if(m==='o') h+=`<ellipse cx="0" cy="${HC+78}" rx="12" ry="15" fill="${INK}"/>`;
  h+=[[-56,HC+44],[-68,HC+56],[-52,HC+64],[56,HC+44],[68,HC+56],[52,HC+64]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.5" fill="#a0724a"/>`).join('');
  h+=[-1,1].map(sd=>`<path d="M${sd*74},${HC+50} L${sd*134},${HC+38} M${sd*74},${HC+62} L${sd*136},${HC+64} M${sd*72},${HC+72} L${sd*128},${HC+86}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`).join('');
  h+=o.overFace||'';
  if(only) return h;
  let s='';
  s+=`<path d="M80,-30 Q176,-30 182,-122 Q186,-184 222,-194" fill="none" stroke="${INK}" stroke-width="32" stroke-linecap="round"/><path d="M80,-30 Q176,-30 182,-122 Q186,-184 222,-194" fill="none" stroke="${FUR}" stroke-width="19" stroke-linecap="round"/>`;
  s+=`<path d="M206,-200 Q212,-246 246,-226 Q272,-206 252,-180 Q262,-160 236,-162 Q214,-150 208,-174 Q192,-186 206,-200 Z" fill="${MANE}" ${S4(6.5)}/><path d="M220,-208 L246,-196 M216,-190 L240,-180 M226,-220 L244,-212" stroke="#6a2a0e" stroke-width="3.5" stroke-linecap="round"/>`;
  s+=qBody(FUR,FURS,MUZ);
  // mechón de melena sobre el pecho
  s+=`<path d="M-60,-250 Q-40,-180 0,-160 Q40,-180 60,-250 Q0,-230 -60,-250 Z" fill="${MANEM}" ${S4(6)}/><path d="M-30,-232 Q-20,-200 -6,-180 M20,-232 Q14,-204 8,-182" fill="none" stroke="${MANE}" stroke-width="4" stroke-linecap="round"/>`;
  s+=qPaws(FUR,true);
  return s+h;}
// ---------- GALLINA mejorada (misma base redondita) ----------
const _gallinaBase=gallina;
gallina=function(o={},only=false){let s=_gallinaBase(o,only);if(only) return s;
  // hierba y granos a los pies, motas en el huevo, plumas en la cabeza
  const extra=`<path d="M-160,4 l8,-26 l6,24 l8,-30 l6,30 l8,-20 l4,22" fill="#7aa84a" ${S4(4)}/><path d="M150,4 l6,-22 l6,20 l8,-26 l6,28" fill="#7aa84a" ${S4(4)}/>`+
    [[60,-2],[78,4],[96,-1],[-60,2],[110,5]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="4" fill="#e8c26a" ${S4(2)}/>`).join('')+
    [[-108,-40],[-94,-20],[-102,-10]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.5" fill="#c8a882"/>`).join('');
  return s.replace('<ellipse cx="-100" cy="-26"',extra+'<ellipse cx="-100" cy="-26"');};

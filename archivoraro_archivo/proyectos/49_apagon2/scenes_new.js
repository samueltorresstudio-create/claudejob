// ================= APAGÓN · PARTE 2 (día 3: la comida) =================
const EVS={
  hook:B=>({super:B[0].w[6],fridge:B[0].w[14],smell:B[0].w[20]}),
  hunger:B=>({hunger:B[0].w[15],you:B[0].w[17]}),
  order:B=>({n1:B[0].w[9],n2:B[0].w[12],n3:B[0].w[14]}),
  cook:B=>({milk:B[0].w[3],chicken:B[0].w[5],cold:B[0].w[10],eat:B[0].w[11]}),
  gas:B=>({gas:B[0].w[5],co:B[0].w[10],smell:B[0].w[12],sleep:B[0].w[16]}),
  balcony:B=>({bal:B[0].w[6],bruno:B[0].w[7],pan:B[0].w[14]}),
  ambulance:B=>({amb:B[0].w[3],fam:B[0].w[8],stove:B[0].w[13],win:B[0].w[19]}),
  water:B=>({two:B[0].w[5],drink:B[0].w[13],bruno:B[0].w[16]}),
  count:B=>({count:B[0].w[1],nine:B[0].w[7]}),
  radio:B=>({on:B[0].w[2],voice:B[1].s,pump:B[1].w[3],fuel:B[1].w[9],four:B[1].w[11]}),
  tap:B=>({four:B[0].w[0],dry:B[0].w[5],tap:B[0].w[9]}),
  door:B=>({knock:B[0].w[1],open:B[1].s,vec:B[1].w[2],bottle:B[1].w[7]}),
};
const S={};
const VEC5S={...VEC5,top:'#cfcac0',topD:'#b0aa9e'};          // same neighbour, day 3: grey vest, no laughing
const PARA={skin:'#c99272',hs:'buzz',hair:'#1d1514',top:'#f0c419',topD:'#c9a010',pants:'#2a3a6a',shoes:'#1d1d22',seed:131};
const PARA2={skin:'#e8b48c',hs:'short',hair:'#5a3a24',top:'#f0c419',topD:'#c9a010',pants:'#2a3a6a',shoes:'#1d1d22',seed:132};
const faceY=(y,s)=>y-s*640;

// ---------- props ----------
const fridgeK=(x,y,k,o={})=>{ // fridge, door hinged on the right, k 0..1 open. o.note: the «NO ABRIR» post-it from part 1
  let s=`<rect x="${x}" y="${y-760}" width="300" height="760" rx="22" fill="#f3f5f6"/><rect x="${x}" y="${y-500}" width="300" height="8" fill="#c9d2d6"/>`;
  if(k>0){ // inside
    s+=`<rect x="${x+14}" y="${y-746}" width="272" height="732" rx="12" fill="#e9f2f6"/>`;
    for(const sy of [y-560,y-400,y-250]) s+=`<rect x="${x+14}" y="${sy}" width="272" height="8" fill="#b8c8d0"/>`;
    s+=`<rect x="${x+40}" y="${y-640}" width="50" height="80" fill="#f3f0e6" stroke="#9aa3ad" stroke-width="3"/><rect x="${x+40}" y="${y-640}" width="50" height="22" fill="#3a6aa8"/>`; // milk
    s+=`<ellipse cx="${x+190}" cy="${y-580}" rx="60" ry="22" fill="#e8c890"/><path d="M${x+150},${y-590} q40,-20 80,0" stroke="#7a9a3a" stroke-width="10" fill="none"/>`; // cheese + lettuce
    s+=`<rect x="${x+60}" y="${y-460}" width="90" height="60" rx="8" fill="#c8705a"/><rect x="${x+170}" y="${y-450}" width="70" height="50" rx="6" fill="#e0b04a"/>`;
    s+=`<rect x="${x+40}" y="${y-300}" width="220" height="50" rx="8" fill="#9ac46a" opacity=".7"/>`;
  }
  const dw=300*(1-k*.85);
  s+=`<rect x="${x+300-dw}" y="${y-760}" width="${dw}" height="760" rx="22" fill="${k>0?'#e3e8ea':'#f3f5f6'}" stroke="#c9d2d6" stroke-width="4"/>`;
  if(k<.3){s+=`<rect x="${x+262}" y="${y-700}" width="14" height="160" rx="6" fill="#9aa3ad"/><rect x="${x+262}" y="${y-460}" width="14" height="200" rx="6" fill="#9aa3ad"/>`;
    s+=`<rect x="${x+30}" y="${y-720}" width="60" height="40" fill="#e0b04a" transform="rotate(-6 ${x+60} ${y-700})"/><rect x="${x+120}" y="${y-700}" width="46" height="46" fill="#6cc6ff" transform="rotate(5 ${x+143} ${y-677})"/><circle cx="${x+210}" cy="${y-690}" r="18" fill="#ff6a8a"/>`;
    if(o.note) s+=`<g transform="translate(${x+150},${y-380}) rotate(-4)"><rect x="-80" y="-50" width="160" height="100" fill="#ffe36a"/><text x="0" y="-6" text-anchor="middle" font-family="Inter" font-weight="900" font-size="32" fill="#c23a3a">NO</text><text x="0" y="32" text-anchor="middle" font-family="Inter" font-weight="900" font-size="28" fill="#c23a3a">ABRIR</text></g>`;}
  return s};
const kitchen=(t,o={})=>{ const night=o.night;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${night?'#3a3430':'#e9e2d2'}"/>`;
  s+=decorWall({floor:null,paper:'dots',paperOp:.03,items:[['calendar',40,400,.9,{month:'NOVIEMBRE',mark:true}],['clock',610,330,.8,{stopped:true,h:12.55,m:33}],['shelf',300,440,.9,{w:230,seed:7}],['socket',560,640,.9]]});
  // backsplash tiles + counter + upper cabinets
  s+=`<rect x="-600" y="560" width="1260" height="260" fill="${night?'#4a4a48':'#f3f0e6'}"/>`;for(let x=-600;x<660;x+=52) for(let y=560;y<820;y+=52) s+=`<rect x="${x+2}" y="${y+2}" width="48" height="48" fill="none" stroke="${night?'#3a3a38':'#d9d4c8'}" stroke-width="3"/>`;
  s+=`<rect x="-600" y="820" width="1260" height="20" fill="#3a3e46"/><rect x="-600" y="840" width="1260" height="170" fill="#7a5434"/>`;for(let x=-560;x<640;x+=170) s+=`<rect x="${x}" y="860" width="150" height="130" rx="6" fill="none" stroke="#5a3e24" stroke-width="5"/><rect x="${x+65}" y="880" width="20" height="6" rx="3" fill="#c9c2b0"/>`;
  s+=`<rect x="-600" y="-900" width="1260" height="1050" fill="none"/>`;
  // sink + tap on the counter
  s+=`<rect x="120" y="808" width="230" height="16" rx="6" fill="#9aa3ad"/><path d="M230,808 L230,720 Q230,690 260,690 L290,690 L290,708" stroke="#9aa3ad" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  s+=`<rect x="-500" y="790" width="70" height="30" rx="4" fill="#5a3a24"/><rect x="-420" y="770" width="40" height="50" rx="6" fill="#c23a3a"/>`; // board + jar
  s+=fridgeK(700,1010,o.fridge||0,{note:o.note});
  s+=`<rect x="-600" y="1010" width="2280" height="600" fill="${night?'#2a2420':'#b8b0a4'}"/>`;for(let x=-600;x<1700;x+=90) s+=`<line x1="${x}" y1="1010" x2="${(x-540)*1.6+540}" y2="1600" stroke="#000" stroke-width="3" opacity=".1"/>`;
  s+=`<rect x="-600" y="1060" width="2280" height="3" fill="#000" opacity=".08"/>`;
  if(!night) s+=`<path d="M-200,200 L60,200 L360,1100 L-400,1100Z" fill="#fff4d0" opacity=".14"/>`+particles(t,'dust',{x0:-150,x1:300,y0:250,y1:1000,n:16});
  s+=dCorner(.22);
  return s};
const binK=(x,y)=>`<path d="M${x-55},${y} L${x-45},${y-150} L${x+45},${y-150} L${x+55},${y}Z" fill="#5a6068"/><rect x="${x-62}" y="${y-166}" width="124" height="20" rx="6" fill="#3a3e46"/>`;
const milkK=(x,y,s,rot=0)=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-25" y="-40" width="50" height="80" fill="#f3f0e6" stroke="#9aa3ad" stroke-width="3"/><path d="M-25,-40 L0,-58 L25,-40Z" fill="#e2dccf" stroke="#9aa3ad" stroke-width="3"/><rect x="-25" y="-20" width="50" height="22" fill="#3a6aa8"/></g>`;
const chickenK=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-60" y="-30" width="120" height="60" rx="10" fill="#e9e4d8" opacity=".9"/><ellipse cx="0" cy="0" rx="48" ry="22" fill="#f0c8a0"/><ellipse cx="-30" cy="-6" rx="18" ry="10" fill="#e8b890"/><rect x="-60" y="-30" width="120" height="60" rx="10" fill="#cfe6f6" opacity=".35"/></g>`;
const campStove=(x,y,s,t,on=1)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-40" y="-60" width="80" height="60" rx="14" fill="#3a6aa8"/><rect x="-40" y="-48" width="80" height="10" fill="#ffd34a"/><rect x="-50" y="-74" width="100" height="14" rx="4" fill="#2a2e36"/>${on?`<path d="M-30,-74 q8,${-14-4*Math.sin(t*20)} 16,0 q8,${-16-4*Math.sin(t*17)} 16,0 q8,${-14-4*Math.sin(t*23)} 16,0 q8,${-16-4*Math.sin(t*19)} 16,0" fill="#5ab4ff" opacity=".9"/>`:''}</g>`;
const panK=(x,y,s,t,food=1)=>`<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="80" ry="18" fill="#2a2e36"/><rect x="74" y="-8" width="110" height="14" rx="6" fill="#1d1f26"/>${food?`<ellipse cx="-14" cy="-6" rx="34" ry="10" fill="#d89a5a"/><ellipse cx="22" cy="-4" rx="26" ry="8" fill="#c8844a"/>`:''}${[0,1,2].map(i=>{const p=(t*1.3+i/3)%1;return `<path d="M${-30+i*28},${-14-p*80} q10,-12 0,-24" stroke="#fff" stroke-width="6" fill="none" opacity="${(.5*(1-p)).toFixed(2)}" stroke-linecap="round"/>`}).join('')}</g>`;
const bottleK=(x,y,s,lvl=1,o={})=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-26" y="-110" width="52" height="110" rx="12" fill="#dff2ff" opacity=".55" stroke="#9fc6dc" stroke-width="3"/>${lvl>0?`<rect x="-24" y="${(-108*lvl).toFixed(1)}" width="48" height="${(108*lvl).toFixed(1)}" rx="10" fill="#5ab4ff" opacity=".8"/>`:''}<rect x="-14" y="-128" width="28" height="20" rx="4" fill="${o.cap||'#2a6aa8'}"/><rect x="-26" y="-70" width="52" height="26" fill="#fff" opacity=".6"/></g>`;
const ambulanceK=(x,y,s,t)=>{const fl=Math.sin(t*14)>0;
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="280" ry="20" fill="#000" opacity=".3"/><path d="M-260,-40 L-260,-300 L120,-300 L120,-40Z" fill="#f3f3ee"/><path d="M120,-220 L210,-220 L270,-140 L270,-40 L120,-40Z" fill="#f3f3ee"/><path d="M130,-210 L200,-210 L248,-146 L130,-146Z" fill="#26304a"/>
  <rect x="-260" y="-150" width="530" height="26" fill="#d42a2a"/><rect x="-260" y="-118" width="530" height="12" fill="#f0c419"/><text x="-70" y="-190" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="#d42a2a">AMBULANCIA</text>
  <path d="M-30,-270 l0,60 M-60,-240 l60,0" stroke="#d42a2a" stroke-width="16"/><rect x="-200" y="-322" width="90" height="22" rx="6" fill="${fl?'#3a8aff':'#1a3a7a'}"/><rect x="0" y="-322" width="90" height="22" rx="6" fill="${fl?'#1a3a7a':'#3a8aff'}"/>
  <circle cx="-160" cy="-30" r="44" fill="#1d1d22"/><circle cx="160" cy="-30" r="44" fill="#1d1d22"/><circle cx="-160" cy="-30" r="18" fill="#9aa3ad"/><circle cx="160" cy="-30" r="18" fill="#9aa3ad"/></g>`};
const stretcher=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-150" y="-110" width="300" height="20" rx="6" fill="#9aa3ad"/><path d="M-130,-90 L-120,0 M130,-90 L120,0" stroke="#5a6068" stroke-width="8"/><circle cx="-120" cy="0" r="12" fill="#2a2e36"/><circle cx="120" cy="0" r="12" fill="#2a2e36"/><path d="M-140,-112 Q-100,-150 0,-146 Q100,-150 140,-112Z" fill="#e9e4d8"/><circle cx="-110" cy="-128" r="22" fill="#e8b48c"/><rect x="-80" y="-140" width="40" height="18" fill="#cfe6f6" opacity=".8"/></g>`;
const pumpIcon=(fuel)=>`<g><rect x="-70" y="-30" width="140" height="80" fill="#9aa3ad"/><rect x="-60" y="-70" width="40" height="40" fill="#7a838d"/><path d="M-40,-70 l0,-30 l40,0" stroke="#5a6068" stroke-width="10" fill="none"/><path d="M70,0 l40,0" stroke="#5ab4ff" stroke-width="14"/><text x="0" y="22" text-anchor="middle" font-family="Inter" font-weight="900" font-size="20" fill="#1d1f26">BOMBEO</text>
  <path d="M-46,96 A50,50 0 0 1 46,96" stroke="#3a3e46" stroke-width="10" fill="none"/><path d="M-46,96 A50,50 0 0 1 ${(-46*Math.cos(Math.PI*(1-fuel))).toFixed(1)},${(96-46*Math.sin(Math.PI*fuel)).toFixed(1)}" stroke="${fuel<.3?'#ff4a6a':'#45e07e'}" stroke-width="10" fill="none"/><line x1="0" y1="96" x2="${(-40*Math.cos(Math.PI*fuel)).toFixed(1)}" y2="${(96-40*Math.sin(Math.PI*fuel)).toFixed(1)}" stroke="#fff" stroke-width="5"/><text x="-56" y="118" font-family="Inter" font-weight="900" font-size="18" fill="#ff4a6a">E</text><text x="48" y="118" font-family="Inter" font-weight="900" font-size="18" fill="#45e07e">F</text></g>`;
const iconCard=(x,y,a,svg,label,col)=>a<=0?'':`<g transform="translate(${x},${y}) scale(${eBack(clamp(a)).toFixed(3)})"><rect x="-96" y="-96" width="192" height="200" fill="#11131f" fill-opacity=".92" stroke="${col}" stroke-width="4"/><rect x="-96" y="-96" width="192" height="12" fill="${col}"/>${svg}<text x="0" y="86" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="22" fill="${col}">${label}</text></g>`;
const noseX=(x,y,a)=>a<=0?'':`<g opacity="${clamp(a)}" transform="translate(${x},${y})"><path d="M-12,-30 Q-20,10 -4,18 Q12,22 14,8" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-40,-40 L40,40 M40,-40 L-40,40" stroke="#ff4a6a" stroke-width="10" stroke-linecap="round"/></g>`;

// ================= scenes =================
S.hook=(t,D,B)=>{const E=EVS.hook(B);
  if(t<E.fridge-.25){ // the empty supermarket, someone rushes in with a trolley
    let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#c9ced2"/>`;
    for(let i=0;i<5;i++) s+=`<rect x="${-120+i*280}" y="40" width="200" height="26" rx="6" fill="#e9ecee" stroke="#9aa3ad" stroke-width="4"/>`;
    s+=`<rect x="-300" y="200" width="1680" height="780" fill="#e3e6e8"/>`;
    for(let r=0;r<5;r++){const y=300+r*150;s+=`<rect x="-300" y="${y}" width="1680" height="14" fill="#8a9098"/>`;const rr=rng(r+3);for(let k=0;k<3;k++) if(rr()<.7) s+=`<rect x="${(-200+rr()*1500).toFixed(0)}" y="${y-40}" width="36" height="40" fill="${['#c23a3a','#3a6aa8','#e0b04a'][k]}"/>`;}
    for(let r=0;r<5;r++) s+=`<rect x="${200+r*120}" y="${310+r*150}" width="70" height="22" fill="#f3eee2" transform="rotate(-3)"/>`;
    s+=`<g transform="translate(780,420) rotate(-4)"><rect x="-180" y="-46" width="360" height="92" fill="#f3eee2" stroke="#c23a3a" stroke-width="6"/><text x="0" y="22" text-anchor="middle" font-family="Inter" font-weight="900" font-size="58" fill="#c23a3a">AGOTADO</text></g>`;
    s+=`<rect x="-600" y="980" width="2280" height="700" fill="#b8bcc0"/>`;for(let x=-600;x<1700;x+=110) s+=`<line x1="${x}" y1="980" x2="${(x-540)*1.8+540}" y2="1600" stroke="#9ea2a6" stroke-width="3"/>`;
    const cx=lerp(-200,560,eOut(prog(t,0,2.4)));
    s+=`<g transform="translate(${cx+150},1010)"><path d="M-120,-200 L120,-200 L100,-60 L-90,-60Z" fill="none" stroke="#5a6068" stroke-width="8"/>${[0,1,2,3].map(i=>`<line x1="${-110+i*60}" y1="-200" x2="${-95+i*55}" y2="-60" stroke="#5a6068" stroke-width="4"/>`).join('')}<circle cx="-70" cy="-20" r="20" fill="#2a2e36"/><circle cx="80" cy="-20" r="20" fill="#2a2e36"/><path d="M-120,-200 L-160,-240" stroke="#5a6068" stroke-width="8"/></g>`;
    s+=A({...CB('C19'),x:cx,y:1010,s:.62,walk:cx<559?t*9:null,stride:1.3,look:[10,-8],brows:'worried',eyes:'wide',mouth:'o',reachR:[220,-330]});
    s+=crowd([{c:'C08',mouth:'line',brows:'worried',look:[-8,0]},{c:'C12',mouth:'o',brows:'worried',look:[-10,-4]}],{y:1000,s:.5,x0:860,x1:1010});
    let o=cam(s,lerp(1.15,1.0,eOut(prog(t,0,1.4))),540,640,540,600,shake(t,1-prog(t,0,.4),6));
    return o;}
  const k=eOut(prog(t,E.fridge-.25,E.fridge+.4)), sm=prog(t,E.smell-.6,D);
  let bg=kitchen(t,{fridge:k});
  let fg=shepherd(560,1010,.42,t,{dir:1,alert:.8,head:18,seed:9});
  fg+=A({...ALEX,x:420,y:1010,s:.62,look:[12,-2],brows:sm>0?'worried':null,eyes:sm>0?'closed':'open',mouth:sm>0?'o':'line',reachR:[200,-560],reachL:sm>0?[30,-640]:null});
  // stink waves + flies
  if(k>0) for(let i=0;i<4;i++){const p=(t*.5+i/4)%1;fg+=`<path d="M${780+i*40},${640-p*240} q20,-20 0,-40 q-20,-20 0,-40" stroke="#8ab84a" stroke-width="10" fill="none" opacity="${(k*.8*(1-p)).toFixed(2)}" stroke-linecap="round"/>`;}
  if(k>.5) for(let i=0;i<4;i++) fg+=`<circle cx="${(840+Math.sin(t*9+i*2)*70).toFixed(0)}" cy="${(460+Math.cos(t*7+i)*50).toFixed(0)}" r="5" fill="#1d1d22"/>`;
  let o=cam(bg+fg,lerp(1.05,1.15,prog(t,E.fridge,D)),600,650,540,620);
  o+=bang(800,330,'¡PUAJ!',GREEN,P(t,E.smell,.12),88);
  return o;};

S.hunger=(t,D,B)=>{const E=EVS.hunger(B), k=eIO(prog(t,E.you-.2,E.you+1.1));
  let bg=street(t,{dim:true});
  bg+=`<rect x="170" y="560" width="520" height="320" fill="#9aa3ad"/>`;for(let y=570;y<880;y+=22) bg+=`<line x1="170" y1="${y}" x2="690" y2="${y}" stroke="#7a838d" stroke-width="4"/>`;
  bg+=`<rect x="170" y="500" width="520" height="70" fill="#2f8a5a"/><text x="430" y="548" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="#fff">SUPER<tspan fill="#ffd34a">MAR</tspan></text>`;
  bg+=`<g transform="translate(430,690) rotate(-3)"><rect x="-170" y="-50" width="340" height="100" fill="#f3eee2"/><text x="0" y="-8" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#c23a3a">CERRADO</text><text x="0" y="30" text-anchor="middle" font-family="Inter" font-weight="800" font-size="24" fill="#2a2620">SIN EXISTENCIAS</text></g>`;
  bg+=`<rect x="760" y="760" width="110" height="110" rx="8" fill="#2f5a4a"/><rect x="752" y="748" width="126" height="18" fill="#1f3f33"/>`;
  let fg=crowd([{c:'C02',mouth:'worried',brows:'worried',look:[4,-4],cane:true},{c:'C15',mouth:'line',brows:'worried',look:[6,-2]},{c:'C16',mouth:'o',brows:'angry',look:[-4,-4]},{c:'C04',mouth:'line',brows:'worried',look:[-6,0]}],{y:990,s:.5,x0:120,x1:620});
  fg+=shepherd(940,1012,.4,t,{dir:-1,walk:k<.1?t*9:null,alert:.6,head:4,seed:9});
  fg+=A({...ALEX,x:810,y:1010,s:.6,walk:k<.1?t*7:null,dirW:-1,look:k>0?[0,0]:[-12,-2],brows:'worried',mouth:'line'});
  let o=focusCam(bg,fg,k,810,faceY(1010,.6),{z0:1.04,z1:2.3});
  if(t>E.hunger&&k<.2) o+=tag(540,430,'DÍA 3 = HAMBRE',PINK,P(t,E.hunger,.2));
  return o;};

S.order=(t,D,B)=>{const E=EVS.order(B);
  let s=kitchen(t,{fridge:.9});
  s+=shepherd(560,1010,.42,t,{dir:1,alert:.6,head:10,tongue:true,seed:9});
  s+=A({...ALEX,x:400,y:1010,s:.62,look:[12,-4],mouth:'line',reachR:[180,-470]});
  let o=cam(s,1.06,600,700,540,640);
  const cards=[[E.n1,'NEVERA',`<rect x="-30" y="-60" width="60" height="96" rx="8" fill="#f3f5f6"/><rect x="-30" y="-24" width="60" height="4" fill="#c9d2d6"/>`],
    [E.n2,'CONGELADOR',`<path d="M0,-60 L0,40 M-44,-34 L44,14 M44,-34 L-44,14" stroke="#9fd8ff" stroke-width="10" stroke-linecap="round"/>`],
    [E.n3,'LATAS',`<rect x="-40" y="-50" width="80" height="84" rx="10" fill="#c9c2b0"/><rect x="-40" y="-30" width="80" height="40" fill="#c23a3a"/>`]];
  cards.forEach(([ev,l,svg],i)=>{const x=200+i*340;o+=iconCard(x,470,prog(t,ev-.1,ev+.25),`<text x="-70" y="-56" font-family="${MONO}" font-weight="800" font-size="26" fill="#ffd34a">${i+1}</text>`+svg,l,i===2?GREEN:i===1?BLUE:YEL);
    if(i>0&&t>ev) o+=`<path d="M${x-190},470 l40,0 m-14,-14 l14,14 l-14,14" stroke="#fff" stroke-width="7" fill="none" opacity="${P(t,ev,.2)}"/>`;});
  return o;};

S.cook=(t,D,B)=>{const E=EVS.cook(B);
  let s=kitchen(t,{fridge:t<E.chicken?.15:.9});
  s+=binK(160,1010);
  const fly=prog(t,E.milk-.5,E.milk+.25), mx=lerp(330,160,fly), my=lerp(620,860,fly)-Math.sin(fly*Math.PI)*160;
  if(fly<1) s+=milkK(mx,my,1,fly*240); else s+=`<g transform="translate(130,862) rotate(-20)" opacity=".9">${milkK(0,0,.8)}</g>`;
  const ch=t>E.chicken-.2;
  s+=shepherd(600,1010,.42,t,{dir:1,alert:.9,head:t>E.eat?20:8,wag:t>E.eat,tongue:t>E.eat,seed:9});
  s+=A({...ALEX,x:430,y:1010,s:.62,look:fly<1?[-12,4]:[12,-2],mouth:t>E.eat?'smile':fly>0&&fly<1?'o':'line',brows:t<E.chicken?'worried':null,
    reachL:fly<.4?[-170,-560]:null,reachR:ch?[150,-420]:null});
  if(ch){const hx=430+.62*150, hy=1010-.62*420;s+=chickenK(hx,hy,1);if(t>E.cold-.3) s+=particles(t,'snow',{x0:hx-80,x1:hx+80,y0:hy-120,y1:hy+20,n:10,op:.8});}
  let o=cam(s,lerp(1.02,1.1,prog(t,0,D)),480,700,540,640);
  o+=bang(220,560,'¡PLOF!',BLUE,P(t,E.milk+.2,.1)*(1-P(t,E.milk+1.2,.3)),70);
  if(t>E.cold&&t<E.eat) o+=tag(760,430,'TODAVÍA FRÍO',BLUE,P(t,E.cold,.2));
  if(t>E.eat) o+=tag(760,430,'HOY, SE COME',GREEN,P(t,E.eat,.2));
  return o;};

S.gas=(t,D,B)=>{const E=EVS.gas(B), co=eIO(prog(t,E.gas+.2,E.sleep+.6)), sl=prog(t,E.sleep,D);
  // a closed bedroom: stove on the table, CO filling the room from the ceiling down, someone asleep
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a2630"/>`;
  s+=`<rect x="60" y="300" width="960" height="710" fill="#c9b8d0"/>`+dWallpaper({kind:'stripes',x0:60,y0:300,w:960,h:710,op:.05});
  s+=`<rect x="100" y="380" width="220" height="260" fill="#8ab0c8"/><rect x="100" y="380" width="220" height="260" fill="none" stroke="#f3eee6" stroke-width="14"/><line x1="210" y1="380" x2="210" y2="640" stroke="#f3eee6" stroke-width="10"/>`;
  s+=`<path d="M120,400 L300,620 M300,400 L120,620" stroke="#ff4a6a" stroke-width="10" opacity="${P(t,E.co,.3)}"/>`;
  s+=dFrame(420,380,.8,{pic:'land'})+dCalendar(620,380,.8);
  s+=`<rect x="60" y="1010" width="960" height="40" fill="#5a4a3a"/>`;
  s+=`<rect x="560" y="900" width="440" height="110" fill="#5a4a6a"/><rect x="560" y="860" width="440" height="50" rx="14" fill="#e9e4d8"/><rect x="930" y="800" width="70" height="210" rx="10" fill="#6a5038"/><ellipse cx="620" cy="850" rx="50" ry="22" fill="#f3f0e6"/>`;
  s+=lying({...ALEX,x:930,y:868,s:.46,eyes:'closed',mouth:'line'},.46)+`<path d="M700,880 Q800,840 920,870 L920,900 L700,900Z" fill="#6a7ab0"/>`;
  s+=`<rect x="200" y="860" width="200" height="16" fill="#6a4a30"/><rect x="214" y="876" width="14" height="134" fill="#5a3e24"/><rect x="372" y="876" width="14" height="134" fill="#5a3e24"/>`+campStove(300,860,1,t);
  // the gas
  const top=300, lvl=top+co*600;
  s+=`<rect x="60" y="${top}" width="960" height="${(lvl-top).toFixed(1)}" fill="#7a7a8a" opacity=".55"/>`;
  for(let i=0;i<6;i++){const x=120+i*160+Math.sin(t+i)*20;s+=`<circle cx="${x}" cy="${(lvl-10).toFixed(0)}" r="${46+i%3*12}" fill="#7a7a8a" opacity=".45"/>`;}
  if(co>.2) s+=`<text x="540" y="${(top+60+co*120).toFixed(0)}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="70" fill="#fff" opacity=".8">CO</text>`;
  if(sl>0) s+=`<rect x="60" y="300" width="960" height="710" fill="#ff2a2a" opacity="${(.18*sl*(Math.sin(t*6)>0?1:.6)).toFixed(2)}"/>`;
  s+=`<rect x="60" y="300" width="960" height="710" fill="none" stroke="#1d1b2a" stroke-width="10"/>`;
  let o=cam(s,lerp(1.0,1.08,prog(t,0,D)),540,660,540,660);
  if(t>E.smell&&t<E.sleep) o+=noseX(880,480,P(t,E.smell,.2))+tag(700,600,'NO HUELE · NO SE VE',PINK,P(t,E.smell,.2));
  if(t>E.sleep) o+=tag(540,600,'MATA DURMIENDO',PINK,P(t,E.sleep,.2));
  return o;};

S.balcony=(t,D,B)=>{const E=EVS.balcony(B), walk=eIO(prog(t,0,E.bal));
  let s=skyTod('day')+puffs(t,220,'#fff',.8,8,4);
  s+=facade(-300,560,250,'#c98a6a',{seed:5})+facade(700,560,210,'#e2d2b4',{seed:6});
  // Álex's balcony: the flat's wall, the door, the railing
  s+=`<rect x="-600" y="420" width="2280" height="700" fill="#d8b48a"/>`;for(let y=430;y<1000;y+=40) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#c49c70" stroke-width="3"/>`;
  s+=`<rect x="60" y="480" width="240" height="530" fill="#2a2420"/><rect x="60" y="480" width="240" height="530" fill="none" stroke="#f3eee6" stroke-width="14"/><path d="M80,500 L80,990" stroke="#4a6a8a" stroke-width="40"/>`;
  s+=`<path d="M380,470 Q620,500 900,470" stroke="#3a3a3e" stroke-width="3" fill="none"/>`+[['#c23a3a',420],['#3a6aa8',540],['#f3eee6',660],['#e0b04a',780]].map(([c,x])=>`<rect x="${x}" y="${(482+Math.sin(t*2+x)*3).toFixed(1)}" width="70" height="90" fill="${c}"/>`).join('');
  s+=dPlant(1060,1010,.9)+`<rect x="-600" y="1010" width="2280" height="40" fill="#b8a48a"/>`;
  s+=`<rect x="520" y="860" width="260" height="16" fill="#6a4a30"/><rect x="540" y="876" width="12" height="134" fill="#5a3e24"/><rect x="748" y="876" width="12" height="134" fill="#5a3e24"/>`+campStove(620,860,1,t)+panK(620,786,1,t,t>E.bal-.3);
  if(t>E.bal) s+=particles(t,'sparks',{x0:560,x1:700,y0:760,y1:800,n:8,col:'#ffcf6a'});
  s+=shepherd(820,1010,.42,t,{dir:-1,alert:1,head:26,tongue:t>E.bruno,wag:t>E.pan,seed:9});
  if(t>E.bruno) {const p=(t*.8)%1;s+=`<ellipse cx="${780+0}" cy="${(880+p*60).toFixed(0)}" rx="5" ry="8" fill="#bfe6ff" opacity="${(1-p).toFixed(2)}"/>`;}
  s+=A({...ALEX,x:lerp(180,420,walk),y:1010,s:.62,walk:walk>0&&walk<1?t*7:null,look:[12,6],mouth:'smile',reachR:walk>=1?[260,-380]:[160,-430]});
  s+=`<rect x="-600" y="940" width="2280" height="14" fill="#2a2e3a"/>`+Array.from({length:44},(_,i)=>`<rect x="${-560+i*52}" y="954" width="7" height="100" fill="#2a2e3a"/>`).join('')+`<rect x="-600" y="1050" width="2280" height="60" fill="#8a7a6a"/>`;
  let o=cam(s,lerp(1.0,1.12,eIO(prog(t,0,D))),600,780,540,640);
  if(t>E.bal&&t<E.bruno) o+=tag(780,430,'AL AIRE LIBRE',GREEN,P(t,E.bal,.2));
  return o;};

S.ambulance=(t,D,B)=>{const E=EVS.ambulance(B), k=eIO(prog(t,E.win-.4,E.win+.9)), fl=Math.sin(t*14)>0;
  const lit=(i,j)=>(i===1&&j===2)?1:((i*5+j*3)%7===0?.6:0);
  let bg=street(t,{night:true,lit})+`<rect x="-600" y="-900" width="2280" height="2400" fill="${fl?'#2a4aff':'#ff2a3a'}" opacity=".07"/>`;
  bg+=`<rect x="300" y="420" width="110" height="130" fill="#ff9a4a"/><circle cx="355" cy="485" r="110" fill="#ff8a3a" opacity=".25"/><rect x="300" y="420" width="110" height="130" fill="none" stroke="#f3eee6" stroke-width="10"/><line x1="355" y1="420" x2="355" y2="550" stroke="#f3eee6" stroke-width="8"/><rect x="290" y="548" width="130" height="10" fill="#2a2e3a"/>`;
  bg+=`<rect x="450" y="760" width="120" height="110" fill="#ffcf8a" opacity=".85"/><rect x="450" y="760" width="120" height="110" fill="none" stroke="#2a2e3a" stroke-width="8"/>`; // open portal
  let fg=ambulanceK(780,1030,.68,t);
  const go=eIO(prog(t,E.amb,E.fam+1.6)), sx=lerp(520,650,go);
  fg+=A({...PARA,x:sx-150,y:1010,s:.55,walk:go>0&&go<1?t*6:null,look:[10,0],mouth:'line',brows:'worried',reachR:[150,-330]})+stretcher(sx,960,.8)+A({...PARA2,x:sx+150,y:1010,s:.55,walk:go>0&&go<1?t*6:null,look:[-6,0],mouth:'line',brows:'worried',reachL:[-150,-330]});
  fg+=crowd([{c:'C19',mouth:'o',brows:'worried',look:[8,-4]},{c:'C03',mouth:'line',brows:'worried',look:[10,-4]}],{y:1010,s:.48,x0:60,x1:200});
  let o=focusCam(bg,fg,k,355,485,{z0:1.02,z1:2.3,bars:true});
  if(t>E.stove&&t<E.win) o+=tag(540,430,'ESTUFA DE GAS',PINK,P(t,E.stove,.2));
  if(k>.5) o+=tag(540,880,'VENTANAS CERRADAS',PINK,P(t,E.win+.3,.2));
  return o;};

S.water=(t,D,B)=>{const E=EVS.water(B);
  let s=kitchen(t,{night:true,fridge:0,note:true})+dark(.35,[[480,760,520,360]]);
  s+=candle(120,820,.9,t);
  for(let i=0;i<5;i++) s+=bottleK(250+i*70,820,.8,1);
  s+=`<path d="M560,1010 l-46,0 l-10,-34 l66,0Z" fill="#c23a3a"/><ellipse cx="537" cy="976" rx="34" ry="8" fill="#5ab4ff" opacity="${t>E.bruno?1:.2}"/>`;
  s+=shepherd(t>E.bruno?660:760,1010,.42,t,{dir:-1,alert:.6,head:t>E.bruno?-20:8,seed:9});
  s+=A({...ALEX,x:880,y:1010,s:.62,look:[-12,2],mouth:'line',reachL:t>E.two&&t<E.bruno?[-160,-470]:null});
  if(t>E.two&&t<E.bruno) s+=bottleK(880-.62*160,1010-.62*400,.9,.6);
  let o=cam(s,lerp(1.04,1.12,prog(t,0,D)),560,740,540,640);
  if(t>E.two&&t<E.bruno) o+=countPop('2 L / DÍA',440,460,90,t-E.two,BLUE);
  if(t>E.bruno) o+=countPop('1,5 L',440,460,96,t-E.bruno,YEL);
  return o;};

S.count=(t,D,B)=>{const E=EVS.count(B), n=Math.min(12,Math.floor(Math.max(0,t-E.count+.2)*5.5));
  let s=kitchen(t,{night:true,fridge:0,note:true})+dark(.4,[[540,860,600,300]])+candle(980,820,.9,t);
  for(let i=0;i<12;i++){const x=80+i*74, on=i<n;s+=bottleK(x,1010,.9,1);if(on) s+=`<text x="${x}" y="880" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="30" fill="#ffd34a" stroke="#11131f" stroke-width="6" paint-order="stroke">${i+1}</text>`;}
  s+=A({...ALEX,x:lerp(100,860,n/12),y:1010,s:.6,look:[0,10],mouth:'line',brows:'worried',reachR:[100,-300]});
  let o=cam(s,1.04,540,760,540,640);
  if(t>E.nine) o+=countPop('9 DÍAS',540,440,130,t-E.nine,GREEN);
  return o;};

S.radio=(t,D,B)=>{const E=EVS.radio(B), on=t>E.on, k=eIO(prog(t,E.four-.3,E.four+.9));
  let bg=flat(t,{on:0,night:true,clock:''})+sofaK(560,1010,520,'#3a4450')+sofaArmsK(560,1010,520,'#3a4450')+`<rect x="640" y="900" width="200" height="16" fill="#3a2818"/>`+candle(800,900,.7,t);
  let fg=A({...ALEX,x:480,y:1010,s:.6,sit:true,look:[8,4],brows:t>E.fuel?'worried':null,eyes:t>E.four?'wide':'open',mouth:t>E.four?'o':'line',reachR:[180,-260]});
  fg+=`<g transform="translate(${480+.6*200},${1010-.6*250}) scale(.36)">${radioBig(0,0,1,t,on)}</g>`+dogLie(820,1050,.34,t,{dir:-1,head:t>E.voice?.8:.2,eyes:'open'});
  fg+=dark(.5,[[600,820,360,280]]);
  let o=focusCam(bg,fg,k,480,1010-.6*560,{z0:1.08,z1:2.2});
  if(t>E.pump&&t<E.four-.1&&k<.2) o+=iconCard(820,440,prog(t,E.pump,E.pump+.3),pumpIcon(lerp(.9,.15,prog(t,E.fuel-.3,E.fuel+.8))).replace('<g>','<g transform="translate(0,-30) scale(.8)">'),'GASOIL',PINK);
  if(t>E.four) o+=countPop('4 DÍAS',540,440,130,t-E.four,PINK);
  return o;};

S.tap=(t,D,B)=>{const E=EVS.tap(B), dry=t>E.dry;
  // close-up of the kitchen sink by candlelight
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#4a4a48"/>`;for(let x=-600;x<1700;x+=90) for(let y=-200;y<760;y+=90) s+=`<rect x="${x+3}" y="${y+3}" width="84" height="84" fill="none" stroke="#3a3a38" stroke-width="5"/>`;
  s+=`<rect x="-600" y="760" width="2280" height="40" fill="#3a3e46"/><rect x="-600" y="800" width="2280" height="400" fill="#5a3e24"/><path d="M220,770 L860,770 L820,960 L260,960Z" fill="#9aa3ad"/><path d="M250,780 L830,780 L800,940 L280,940Z" fill="#7a838d"/>`;
  s+=`<path d="M540,770 L540,380 Q540,300 620,300 L700,300 L700,350" stroke="#c9d2d6" stroke-width="40" fill="none" stroke-linecap="round"/><rect x="510" y="260" width="60" height="30" rx="8" fill="#9aa3ad" transform="rotate(${dry?40:0} 540 275)"/>`;
  if(!dry){const p=(t*1.4)%1;s+=`<ellipse cx="700" cy="${(380+p*380).toFixed(0)}" rx="10" ry="15" fill="#6cc6ff" opacity="${(1-p*.5).toFixed(2)}"/>`;}
  else {const p=prog(t,E.dry,E.dry+.9);if(p<1) s+=`<ellipse cx="700" cy="${(380+p*380).toFixed(0)}" rx="10" ry="15" fill="#6cc6ff"/>`;}
  s+=`<rect x="630" y="660" width="90" height="110" fill="#dff2ff" opacity=".45" stroke="#9fc6dc" stroke-width="4"/>`;
  s+=`<rect x="880" y="640" width="60" height="130" rx="10" fill="#45b06a"/><rect x="896" y="610" width="28" height="34" fill="#2a2e36"/><rect x="300" y="736" width="90" height="34" rx="6" fill="#ffd34a"/><rect x="300" y="736" width="90" height="12" fill="#3a8a5a"/>`+[0,1,2].map(i=>`<ellipse cx="${-60+i*70}" cy="700" rx="30" ry="70" fill="#e9e4d8" stroke="#9aa3ad" stroke-width="4"/>`).join('')+`<rect x="-120" y="760" width="260" height="14" fill="#9aa3ad"/>`;
  s+=candle(180,760,1.1,t)+dark(.45,[[400,640,520,380]]);
  let o=cam(s,lerp(1.05,1.2,eIO(prog(t,0,D))),600,560,540,600,dry?shake(t,1-prog(t,E.dry,E.dry+.4),4):0);
  if(t>E.tap) o+=tag(540,1000,'NINGÚN GRIFO',BLUE,P(t,E.tap,.2));
  return o;};

S.door=(t,D,B)=>{const E=EVS.door(B), op=eOut(prog(t,E.open-.3,E.open+.5)), kb=eIO(prog(t,E.bottle-.2,E.bottle+.9)), kf=eIO(prog(t,E.bottle+1.2,D));
  const knock=t>E.knock&&t<E.open-.2&&Math.sin(t*16)>.2;
  let bg=`<rect x="-600" y="-900" width="2280" height="2400" fill="#3a3430"/>`+decorWall({floor:1010,paper:'stripes',paperCol:'#000',paperOp:.05,base:'#5a4a3a',items:[['hooks',100,330,1,{coat:'#4a6a8a',bag:'#2a3a2a'}],['frame',100,560,.8,{pic:'photo'}],['switch',880,600,1]]});
  bg+=`<rect x="380" y="400" width="300" height="610" fill="#141210"/>`;   // doorway
  // the landing outside: neighbour with a torch
  bg+=`<g opacity="${op.toFixed(2)}"><circle cx="530" cy="640" r="260" fill="url(#glowY)"/>${A({...VEC5S,x:530,y:1010,s:.62,look:[0,2],brows:'worried',mouth:'line',blink:false,reachR:[120,-420]})}${bottleK(530+.62*120,1010-.62*380,.9,0,{cap:'#9aa3ad'})}</g>`;
  bg+=`<g transform="translate(380,400) scale(${(1-op*.85).toFixed(3)},1)"><rect x="0" y="0" width="300" height="610" fill="#7a5434"/><rect x="18" y="18" width="264" height="260" fill="none" stroke="#5a3e24" stroke-width="8"/><rect x="18" y="310" width="264" height="280" fill="none" stroke="#5a3e24" stroke-width="8"/><circle cx="262" cy="330" r="14" fill="#c9a050"/><circle cx="150" cy="150" r="10" fill="#1d1d22"/></g>`;
  bg+=`<rect x="370" y="390" width="320" height="16" fill="#5a3e24"/><rect x="370" y="390" width="12" height="620" fill="#5a3e24"/><rect x="678" y="390" width="12" height="620" fill="#5a3e24"/>`;
  bg+=candle(960,860,.8,t)+`<rect x="900" y="860" width="150" height="14" fill="#5a3e24"/>`;
  let fg=shepherd(820,1010,.42,t,{dir:-1,alert:1,bark:knock||(t>E.knock&&t<E.knock+.8),head:12,seed:9});
  fg+=A({...ALEX,x:lerp(980,760,eIO(prog(t,E.knock+.4,E.open))),y:1040,s:.68,walk:t>E.knock+.4&&t<E.open?t*7:null,dirW:-1,look:[-12,-2],brows:'worried',mouth:'line'});
  fg+=dark(.35,[[540,720,420,420],[960,820,200,200]]);
  const shk=knock?Math.sin(t*60)*4:0;
  let o;
  if(kf>0) o=focusCam(bg,fg,kf,530,faceY(1010,.62),{z0:2.2,z1:2.6,blur:7});
  else o=focusCam(bg,fg,kb,530+.62*120,1010-.62*430,{z0:1.04,z1:2.2,dx:shk});
  if(t>E.knock&&t<E.open) o+=bang(860,420,'¡TOC, TOC!',YEL,1,72);
  return o;};

window.CFG={steps:['1. COME LO QUE SE ESTROPEA','2. NUNCA GAS DENTRO DE CASA','3. RACIONA EL AGUA'],listEnd:'count',
  band:{hook:'#8a8c90',hunger:'#3a3c42',order:'#b8b0a4',cook:'#b8b0a4',gas:'#2a2630',balcony:'#8a7a6a',ambulance:'#1d1f26',water:'#2a2420',count:'#2a2420',radio:'#1a1410',tap:'#3a2818',door:'#2a2420'}};

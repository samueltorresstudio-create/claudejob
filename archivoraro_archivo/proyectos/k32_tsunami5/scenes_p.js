// ---------- key times per scene (scene-relative) ----------
const EVS={
  open:B=>({lamp:B[1].w[4]}),
  hide:B=>({steps:B[1].s,pair:B[1].w[6]}),
  lucia:B=>({voice:B[0].w[7],face:B[1].s,plea:B[2].w[0]}),
  map:B=>({tap:B[0].w[3],last:B[0].w[10]}),
  whistle:B=>({whistle:B[1].w[0],bark:B[1].w[8]}),
  run:B=>({go:B[0].w[3]}),
  follow:B=>({grab:B[1].w[2],smile:B[1].w[6]}),
  enter:B=>({door:B[0].w[11],mom:B[1].s,tell:B[1].w[7]}),
  confess:B=>({voice:B[0].w[7]}),
  arrow:B=>({fl:B[0].w[9],hour:B[0].w[16],msg:B[1].w[3]}),
};
const S={};

// ---------- props: store, storeroom, people ----------
const p5Unit=(x,y,w,h,col)=>{ // shelving unit with rows of products and yellow price strips
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`;
  const rh=h/4;
  for(let r=0;r<4;r++){const yy=y+r*rh;
    s+=`<rect x="${x}" y="${(yy+rh-16).toFixed(1)}" width="${w}" height="14" fill="#1b1e26"/>`;
    const n=Math.floor((w-20)/52);
    for(let i=0;i<n;i++){
      const c=['#c23a3a','#f2c94c','#3f86b8','#4f8a5a','#e9e4d8','#8a6a3a'][(i*3+r)%6];
      const hh=rh*(.45+.1*((i+r)%3));
      s+=`<rect x="${x+14+i*52}" y="${(yy+rh-16-hh).toFixed(1)}" width="40" height="${hh.toFixed(1)}" rx="6" fill="${c}"/>`;}
    s+=`<rect x="${x+10}" y="${(yy+8).toFixed(1)}" width="${w-20}" height="8" fill="#f2c94c" opacity=".6"/>`;}
  return s};
const p5Pallet=(x,y)=>{ // wooden pallet with water bottles
  let s=`<rect x="${x-130}" y="${y-40}" width="260" height="40" fill="#a8844f"/><rect x="${x-130}" y="${y-8}" width="260" height="8" fill="#7a5e38"/>`;
  for(let r=0;r<2;r++) for(let i=0;i<5;i++) s+=`<rect x="${x-118+i*50}" y="${y-100-r*60}" width="38" height="56" rx="10" fill="#6cb4e0"/><rect x="${x-118+i*50}" y="${y-106-r*60}" width="38" height="8" fill="#e9eef0"/>`;
  return s};
const p5Cart=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M-80,-230 L140,-230 L118,-70 L-60,-70Z" fill="none" stroke="#9aa3ad" stroke-width="14" stroke-linejoin="round"/><line x1="-80" y1="-230" x2="-130" y2="-290" stroke="#9aa3ad" stroke-width="14" stroke-linecap="round"/><path d="M-60,-160 L118,-160" stroke="#9aa3ad" stroke-width="8"/><circle cx="-40" cy="0" r="18" fill="#3a3e4a"/><circle cx="110" cy="0" r="18" fill="#3a3e4a"/><rect x="-20" y="-200" width="60" height="36" fill="#c23a3a" opacity=".8"/></g>`;
const p5Slats=(x,y,w,h)=>{let s='';for(let yy=y+18;yy<y+h-16;yy+=26) s+=`<line x1="${x}" y1="${yy}" x2="${x+w}" y2="${yy}" stroke="#5a636d" stroke-width="4"/>`;return s};
const p5Aisle=()=>{ // the supermarket aisle at night: ceiling lamps, shelves, floor tiles, the closed shutter and the exit sign
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0c0d12"/>`;
  for(let i=0;i<5;i++) s+=`<rect x="${-100+i*280}" y="-60" width="180" height="16" rx="6" fill="#e9e4d8" opacity="${i%2?.25:.1}"/>`;
  s+=`<g opacity=".55">`+p5Unit(-300,240,320,680,'#2e3442')+p5Unit(980,240,320,680,'#2e3442')+`</g>`;
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#23252d"/>`;
  for(let i=-6;i<=6;i++) s+=`<line x1="${540+i*160}" y1="880" x2="${540+i*420}" y2="1600" stroke="#2f323c" stroke-width="3"/>`;
  for(const y of [930,1000,1090,1200]) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#2f323c" stroke-width="3"/>`;
  s+=`<rect x="300" y="260" width="480" height="620" fill="#0c0b0a"/><rect x="300" y="260" width="480" height="620" fill="#7a838d"/>`+p5Slats(300,260,480,620)+`<rect x="300" y="864" width="480" height="16" fill="#6a737d"/>`;
  s+=`<rect x="390" y="190" width="300" height="44" rx="6" fill="#1f8a4c"/><text x="540" y="223" text-anchor="middle" font-family="Inter" font-weight="900" font-size="26" fill="#fff">SALIDA</text>`;
  s+=p5Pallet(880,1010)+p5Cart(160,1010,.7);
  return s};
const p5Lamp=on=>`<circle cx="540" cy="430" r="320" fill="url(#glowY)" opacity="${(.5*on).toFixed(2)}"/><rect x="500" y="404" width="80" height="34" rx="6" fill="#ffcf5a" opacity="${(.9*on).toFixed(2)}"/>`;
const p5Dim=(a=.45)=>`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity="${a}"/>`;
const p5Freezers=(xs)=>xs.map(x=>`<rect x="${x}" y="640" width="230" height="380" rx="10" fill="#2a3a4a"/><rect x="${x+16}" y="664" width="198" height="70" rx="6" fill="#5a7a90" opacity=".45"/><rect x="${x+16}" y="750" width="198" height="10" fill="#9fb8c8" opacity=".3"/>`).join('');
const p5Note=(x,y,rot,k=1)=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})"><rect x="-55" y="-70" width="110" height="140" fill="#efe6cf"/><path d="M-36,-40 H36 M-36,-20 H36 M-36,0 H24 M-36,20 H30" stroke="#5a544a" stroke-width="5"/></g>`;
// people: Lucía is a child, the mother is an adult woman in grey clothes, the thieves wear red and dark jackets
const P5LUCIA={skin:'#c98c64',hs:'pigtails',hair:'#3a2418',top:'#8a6aa8',topD:'#6a4a88',pants:'#3a3a4a',shoes:'#3a332c',seed:61};
const P5MOM={skin:'#c98c64',hs:'bun',hair:'#3a2a24',top:'#6a7a8a',topD:'#4a5a6a',pants:'#2a2e38',shoes:'#3a332c',seed:88};
const P5RED={...RUBEN};
const P5DARK={...RUBEN,skin:'#b98058',top:'#3a3f4e',topD:'#2a2e3a',jacket:'#3a3f4e',hair:'#2a2420',hs:'short',seed:31};

S.open=(t,D,B)=>{const E=EVS.open(B);
  let s=p5Aisle()+p5Lamp(1);
  s+=A({...MARCO,x:300,y:1010,s:.6,look:[12,-4],brows:'worried',mouth:'line'});
  s+=p5Dim(.3);
  let o=cam(s,1.05,540,640,540,560);
  if(t>E.lamp) o+=tag(540,470,'LUZ DE EMERGENCIA',YEL,P(t,E.lamp,.2));
  return o;};

S.hide=(t,D,B)=>{const E=EVS.hide(B), k=eIO(prog(t,0,E.steps));
  let s=p5Aisle()+p5Lamp(.6);
  s+=A({...P5RED,x:lerp(1000,880,k),y:1010,s:.6,walk:k<1?t*8:null,look:[8,-4],brows:'angry',mouth:'line'});
  s+=A({...P5DARK,x:lerp(1080,980,k),y:1010,s:.6,walk:k<1?t*8:null,look:[8,-4],brows:'angry',mouth:'line'});
  s+=A({...MARCO,x:170,y:1010,s:.6,look:[10,-4],brows:'worried',mouth:'line'});
  s+=p5Unit(-120,240,240,680,'#2e3442');
  s+=p5Dim(.45)+p5Lamp(.4);
  let o=cam(s,1.05,500,640,540,560);
  if(t>E.steps) o+=tag(540,470,'SE PARAN, ESCUCHAN',PINK,P(t,E.steps,.2));
  return o;};

S.lucia=(t,D,B)=>{const E=EVS.lucia(B), k=eOut(prog(t,E.voice,E.voice+.8));
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#15161c"/>`;
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#23252d"/>`;
  s+=p5Freezers([640,880,1120]);
  s+=A({...MARCO,x:260,y:1010,s:.6,look:[14,-4],brows:'worried',mouth:'line'});
  s+=A({...P5LUCIA,x:lerp(600,520,k),y:1010,s:.5,look:[-12,-4],eyes:'wide',brows:'worried',mouth:k>.5?'o':'line'});
  s+=p5Note(lerp(600,520,k)+40,870,-8,.6);
  s+=p5Dim(.4)+p5Lamp(.3);
  let o=cam(s,1.05,450,640,540,560);
  if(t>E.face) o+=tag(540,470,'LUCÍA',PINK,P(t,E.face,.2));
  return o;};

S.map=(t,D,B)=>{const E=EVS.map(B), pull=eOut(prog(t,E.tap,E.last)), mk=eIO(prog(t,E.last,E.last+2.5));
  if(t<E.last){
    let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="${MARCO.top}"/>`;
    s+=`<path d="M-600,300 Q540,260 1680,300" stroke="${MARCO.topD}" stroke-width="10" fill="none"/>`;
    s+=`<rect x="250" y="560" width="580" height="520" rx="18" fill="${MARCO.topD}"/><rect x="250" y="560" width="580" height="30" fill="#2f3624"/>`;
    s+=`<g transform="translate(540,${lerp(680,520,pull).toFixed(1)})">${p5Note(0,0,-6+4*pull,1.1)}</g>`;
    let o=cam(s,1.0,540,600,540,560);
    if(t>E.tap) o+=tag(540,450,'EL MAPA DE MARCO',YEL,P(t,E.tap,.2));
    return o;}
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1d1f26"/>`;
  s+=`<g opacity="${(.3+.7*mk).toFixed(2)}" transform="translate(540,580) scale(1.15) translate(-540,-580)">`+mapCard(t,Math.max(.001,mk))+`</g>`;
  let o=cam(s,1.0,540,580,540,560);
  o+=tag(540,960,'LA RUTA HASTA SAN TELMO',YEL,P(t,E.last,.3));
  return o;};

S.whistle=(t,D,B)=>{const E=EVS.whistle(B), blow=t>E.whistle&&t<E.whistle+.6;
  let s=p5Aisle()+p5Lamp(.3);
  s+=A({...MARCO,x:170,y:1010,s:.6,look:[10,-4],brows:'worried',mouth:blow?'o':'line'});
  s+=p5Unit(-120,240,240,680,'#2e3442');
  s+=p5Dim(.6);
  let o=cam(s,1.05,300,640,540,560);
  if(blow) o+=soundArcs(230,840,t,'#ffffff',1,3);
  if(t>E.whistle) o+=tag(540,470,'SILBIDO',YEL,P(t,E.whistle,.2));
  return o;};

S.run=(t,D,B)=>{const E=EVS.run(B), k=eIn(prog(t,E.go,E.go+1.6)), running=t>E.go&&k<1;
  let s=p5Aisle()+p5Lamp(.5);
  s+=A({...P5RED,x:lerp(880,520,k),y:1010,s:.6,walk:running?t*12:null,look:[-6,-10],brows:'angry',mouth:t>E.go?'o':'line'});
  s+=A({...P5DARK,x:lerp(980,600,k),y:1010,s:.6,walk:running?t*12:null,look:[-6,-10],brows:'angry',mouth:t>E.go?'o':'line'});
  s+=p5Dim(.4);
  let o=cam(s,1.05,540,640,540,560,shake(t,1-prog(t,0,.6),5));
  o+=bang(560,430,'¡GUAU!',YEL,P(t,0,.15)*(1-P(t,1.2,1.5)),70);
  if(t>E.go) o+=tag(540,470,'CORREN HACIA LA PERSIANA',PINK,P(t,E.go,.2));
  return o;};

S.follow=(t,D,B)=>{const E=EVS.follow(B);
  let s=p5Aisle()+p5Lamp(.4);
  s+=`<path d="M262,840 Q220,838 196,852" stroke="${P5LUCIA.skin}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  s+=A({...P5LUCIA,x:280,y:1010,s:.5,look:[-10,-4],eyes:'wide',mouth:'line',brows:'worried'});
  s+=A({...MARCO,x:170,y:1010,s:.6,look:[-10,-4],brows:'worried',mouth:'line'});
  s+=p5Dim(.4);
  let o=cam(s,1.05,400,640,540,560);
  if(t>E.grab) o+=tag(540,470,'NO LA SIGAS',PINK,P(t,E.grab,.2));
  return o;};

S.enter=(t,D,B)=>{const E=EVS.enter(B), k=eIO(prog(t,0,E.door)), dw=lerp(10,120,eOut(prog(t,E.door,E.door+.5)));
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a2622"/>`;
  s+=`<rect x="-600" y="180" width="2280" height="700" fill="#3a342c"/>`;
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#3e3830"/>`;
  s+=`<rect x="700" y="300" width="${dw.toFixed(1)}" height="580" fill="#0c0b0a"/>`;
  s+=`<rect x="-200" y="440" width="260" height="300" fill="#5a4a36"/><rect x="-200" y="440" width="260" height="20" fill="#7a6a4a"/>`;
  s+=`<g transform="translate(40,320)">${p5Unit(0,0,240,560,'#4a4238')}</g>`;
  s+=SA({...P5MOM,x:640,y:1010,s:.6,look:[-10,0],eyes:'open',mouth:'line',brows:'worried'});
  s+=`<rect x="580" y="870" width="130" height="14" fill="#8a6a3a"/>`;
  s+=A({...MARCO,x:lerp(180,420,k),y:1010,s:.6,walk:k<1?t*7:null,look:[10,-4],brows:'worried',mouth:'line'});
  let o=cam(s,1.05,520,640,540,560);
  if(t>E.mom) o+=tag(540,470,'SU MADRE',PINK,P(t,E.mom,.2));
  if(t>E.tell) o+=tag(540,560,'DÓNDE ESTABA LA MOCHILA',YEL,P(t,E.tell,.2));
  return o;};

S.confess=(t,D,B)=>{const E=EVS.confess(B), k=eOut(prog(t,E.voice,E.voice+.8));
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1a1816"/>`;
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#2e2a26"/>`;
  s+=`<rect x="-600" y="180" width="2280" height="700" fill="#3a342c"/>`;
  s+=`<rect x="700" y="300" width="120" height="580" fill="#0c0b0a"/>`;
  s+=SA({...P5MOM,x:260,y:1010,s:.6,look:[10,0],eyes:'open',mouth:'line',brows:'worried'});
  s+=A({...MARCO,x:480,y:1010,s:.6,look:[12,-4],brows:'worried',mouth:'line'});
  s+=A({...P5LUCIA,x:lerp(900,800,k),y:1010,s:.5,look:[-10,-4],eyes:'wide',mouth:'o',brows:'worried'});
  s+=p5Note(lerp(950,790,k),880,-8,.6);
  s+=p5Dim(.3);
  let o=cam(s,1.05,640,640,540,560);
  if(t>E.voice) o+=tag(540,470,'FUI YO',PINK,P(t,E.voice,.2));
  return o;};

S.arrow=(t,D,B)=>{const E=EVS.arrow(B), a=prog(t,E.fl,E.fl+1.2);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a2622"/>`;
  s+=`<rect x="-600" y="180" width="2280" height="700" fill="#4a4238"/><rect x="-600" y="880" width="2280" height="700" fill="#3a342c"/>`;
  s+=`<rect x="700" y="260" width="200" height="260" fill="#d9d0b8" opacity=".5"/><rect x="740" y="290" width="120" height="90" fill="#8a4a3a" opacity=".5"/>`;
  s+=p5Unit(160,690,220,330,'#4a4238');
  s+=sprayArrow(380,620,1.1,a,'');
  s+=`<text x="400" y="540" font-family="Inter" font-weight="900" font-size="56" fill="#ff8a2a" opacity="${prog(t,E.fl+.9,E.fl+1.1).toFixed(2)}">13:43</text>`;
  s+=`<text x="540" y="420" text-anchor="middle" font-family="Inter" font-weight="900" font-size="52" fill="#ff4a4a" stroke="#000" stroke-width="8" paint-order="stroke" opacity="${P(t,E.msg,.4).toFixed(2)}">SAN TELMO. TE ESPERAMOS.</text>`;
  s+=A({...MARCO,x:880,y:1010,s:.6,look:[-10,-4],brows:'worried',mouth:'line'});
  s+=p5Dim(.35);
  let o=cam(s,1.05,540,640,540,560);
  if(t>E.hour) o+=tag(540,760,'MARCO NO LA HA PINTADO',PINK,P(t,E.hour,.2));
  return o;};

window.CFG={steps:['1. ALÉJATE DE LA LUZ','2. LLAMA AL PERRO','3. NO SIGAS A NADIE'],listEnd:'enter',
  band:{open:'#0c0d12',hide:'#0c0d12',lucia:'#15161c',map:'#4f5a3a',whistle:'#0c0d12',run:'#0c0d12',follow:'#15161c',enter:'#2a2622',confess:'#1a1816',arrow:'#2a2622'}};

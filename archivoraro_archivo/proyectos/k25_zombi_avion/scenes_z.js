// ---------- cast ----------
const LEO={skin:'#f1c7a5',hs:'messy',hair:'#6a4a2a',top:'#3a6ab0',topD:'#2a4f88',pants:'#2a2e3e',shoes:'#e9e9ee',hood:true,strings:true};
const NORA={tall:false,fem:true,skin:'#f1c7a5',hs:'long',hair:'#6a4a2a',top:'#e2607a',topD:'#b8485e',pants:'#4a4a6a',shoes:'#f3eee6',lashes:true};
const VERA={fem:true,skin:'#e2b08e',hs:'bun',hair:'#2a1d18',top:'#f3f3f6',jacket:'#1f3a5a',pants:'#1f3a5a',shoes:'#15161c',lashes:true};
const WOMAN={fem:true,skin:'#e9d8c8',hs:'long',hair:'#c9a04a',top:'#8a5a9a',topD:'#6a4478',pants:'#3a3a48',shoes:'#2a2a33',lashes:true};
const MOM={fem:true,skin:'#f1c7a5',hs:'long',hair:'#5a2a20',top:'#3f8f7a',topD:'#2f6a5a',pants:'#3a3a48',lashes:true};
function scarf(o){return `<g transform="translate(${o.x},${o.y}) scale(${o.s})"><path d="M-30,-552 L30,-552 L12,-500 L-12,-500Z" fill="#d9333f"/><path d="M8,-512 L30,-450 L12,-446Z" fill="#b8262f"/></g>`}
const vera=o=>A({...VERA,...o})+scarf(o);
function skyIn(t,o={}){ // what you see through a window: sky + clouds (o.smoke draws the burning city)
  let s=`<rect x="-200" y="-200" width="1500" height="1500" fill="${o.smoke?'#c9a48a':'#8cc8f0'}"/>`+cloudBank(o.cy??400,'#ffffff',t*60,.8);
  if(o.smoke){
    s+=`<rect x="-200" y="${o.gy}" width="1500" height="800" fill="#6a6470"/>`;
    for(let i=0;i<12;i++){const x=o.x0+i*o.dx, h=60+((i*53)%5)*34;s+=`<rect x="${x}" y="${o.gy-h}" width="${o.dx*.8}" height="${h}" fill="#4a4652"/>`}
    for(const [cx,k] of [[o.x0+o.dx*2,0],[o.x0+o.dx*6,1],[o.x0+o.dx*9,2]]) for(let i=0;i<7;i++){const p=((t*.25+i/7+k*.3)%1);s+=`<circle cx="${cx+Math.sin(p*5+k)*20*o.k}" cy="${o.gy-60-p*o.rise}" r="${(18+p*70)*o.k}" fill="#3a3640" opacity="${(.85*(1-p)).toFixed(2)}"/>`}
    for(const cx of [o.x0+o.dx*2,o.x0+o.dx*6,o.x0+o.dx*9]) s+=`<circle cx="${cx}" cy="${o.gy-40}" r="${22*o.k}" fill="#ff7a2a" opacity="${(.7+.3*Math.sin(t*9)).toFixed(2)}"/>`;
  }
  return s}
function seatRowZ(t,o={}){ // the seat row from «El avión vacío», with a sunny or smoky window
  let s=`<rect width="1080" height="1100" fill="#cfd3dc"/><rect width="1080" height="200" fill="#e9ebf0"/><rect x="0" y="160" width="1080" height="70" fill="#f2efe8"/>`;
  s+=oval(110,470,150,210,skyIn(t,{cy:500}),o.shade??0);
  for(const x of [330,560,790]) s+=`<rect x="${x-110}" y="380" width="220" height="460" rx="40" fill="#2f4f8f"/><rect x="${x-96}" y="392" width="192" height="92" rx="20" fill="#eef0f4"/>`;
  s+=`<rect x="190" y="760" width="740" height="120" rx="30" fill="#35508f"/><rect y="880" width="1080" height="220" fill="#3a4370"/>`;
  return s}
function seated(t,o={}){ // Leo and Nora in seats 23A/23B, the third seat empty or taken
  let s='';
  if(o.third) s+=pax(1,790,1010,.72,{look:[-6,0],...o.third});
  s+=A({...LEO,x:330,y:1010,s:.74,sit:true,look:o.leoLook||[8,0],eyes:o.leoEyes||'open',brows:o.leoBrows||null,mouth:o.leoMouth||'line'});
  s+=A({...NORA,x:560,y:1010,s:.78,sit:true,look:o.noraLook||[-8,0],eyes:o.noraEyes||'open',brows:o.noraBrows||null,mouth:o.noraMouth||'line'});
  return s}
function airportClip(t,k,bite){ // the video mum sends: terminal, people running, a man biting another (280-wide screen units)
  let s=`<rect width="280" height="200" fill="#9fd0f0"/><rect y="120" width="280" height="80" fill="#c9c2b6"/><rect x="20" y="40" width="80" height="80" fill="#e9eef3"/><rect x="180" y="30" width="90" height="90" fill="#e9eef3"/><rect x="190" y="40" width="70" height="22" fill="#2a3a5a"/><text x="225" y="57" text-anchor="middle" font-family="Inter" font-weight="900" font-size="13" fill="#ffd34a">SALIDAS</text>`;
  for(let i=0;i<4;i++){const x=((k*120+i*80)%380)-60;s+=extra(ADULTS,i,{x,y:180,s:.1,walk:t*14+i,look:[8,0],mouth:'o',eyes:'wide'})}
  if(bite) s+=extra(ADULTS,0,{x:150,y:182,s:.11,look:[-6,0],mouth:'o',eyes:'wide'})+A({skin:'#a8c48f',top:'#6b7a5a',topD:'#4b563f',pants:'#3f4636',hs:'messy',hair:'#3b3f2a',x:178,y:182,s:.11,eyes:'zombie',mouth:'jag',rot:-14,still:true})+`<circle cx="160" cy="112" r="10" fill="#c21f2f" opacity=".7"/>`;
  return s}
function phoneScreen(t,E,k){
  let s=`<rect width="280" height="590" fill="#0f1420"/><rect width="280" height="96" fill="#1b2232"/>`+statusK({left:'11:42'});
  s+=`<circle cx="44" cy="70" r="18" fill="#3f8f7a"/><text x="72" y="78" font-family="Inter" font-weight="800" font-size="22" fill="#fff">MAMÁ</text>`;
  if(k<2){ // the video message
    s+=`<g transform="translate(14,130)"><rect width="252" height="210" rx="16" fill="#1b2232"/><g transform="translate(6,6) scale(.857)">${airportClip(t,t,k>=1&&t>E.bite)}</g>`;
    s+=`<rect x="10" y="182" width="${(232*clamp((t-E.msg)/6)).toFixed(0)}" height="6" rx="3" fill="#ff3e6c"/></g>`;
    s+=`<g transform="translate(14,360)"><rect width="200" height="52" rx="20" fill="#2a8a5a"/><text x="16" y="34" font-family="Inter" font-weight="700" font-size="20" fill="#fff">¿Mamá? ¿Estás bien?</text></g>`;
    if(k>=1) s+=`<text x="210" y="440" font-family="Inter" font-size="16" fill="#8a94a8">Enviado ✓</text>`;
  } else { // calling, no answer
    s=`<rect width="280" height="590" fill="#1b2232"/>`+statusK({left:'11:43'})+`<circle cx="140" cy="200" r="64" fill="#3f8f7a"/><text x="140" y="222" text-anchor="middle" font-family="Inter" font-weight="900" font-size="56" fill="#fff">M</text>`;
    s+=`<text x="140" y="320" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#fff">MAMÁ</text><text x="140" y="358" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="18" fill="#ff3e6c">SIN RESPUESTA</text>`;
    s+=`<circle cx="140" cy="500" r="36" fill="#e2453b"/><rect x="118" y="492" width="44" height="16" rx="8" fill="#fff" transform="rotate(135 140 500)"/>`;
  }
  return s}
function lavDoor(t,o={}){ // lavatory door at the end of the cabin
  let s=`<rect width="1080" height="1100" fill="#d9dde4"/><rect y="900" width="1080" height="200" fill="#3a4370"/><rect x="0" y="0" width="1080" height="120" fill="#eceef2"/>`;
  s+=`<rect x="300" y="200" width="480" height="${700}" fill="#b9c1cc"/>`;
  if(o.open>0) s+=`<rect x="320" y="220" width="440" height="680" fill="#0b0d14"/><rect x="560" y="300" width="160" height="140" fill="#9fb0c4" opacity=".3"/>`;
  const w=440*(1-.82*(o.open||0));
  s+=`<rect x="320" y="220" width="${w}" height="680" fill="#eef1f5"/><rect x="${320+w*.1}" y="260" width="${w*.8}" height="2" fill="#c9ced6"/>`;
  if(w>200){s+=`<text x="${320+w/2}" y="420" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#9aa3ad">WC</text><rect x="${320+w-70}" y="540" width="16" height="70" rx="8" fill="#8a929c"/>`;
    s+=`<rect x="${320+w/2-90}" y="300" width="180" height="52" rx="10" fill="${o.busy===false?'#2f8a5a':'#c23a3a'}"/><text x="${320+w/2}" y="336" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="26" fill="#fff">${o.busy===false?'LIBRE':'OCUPADO'}</text>`;}
  s+=`<rect x="320" y="896" width="440" height="6" fill="#0b0d14" opacity=".6"/>`;
  return s}

// ---------- key times per scene (scene-relative) ----------
const EVS={
  intro:B=>({zombie:B[0].w[6],plane:B[0].w[11]}),
  id:B=>({age:B[0].w[1],nora:B[0].w[7]}),
  seat:B=>({twenty:B[0].w[1],land:B[0].w[4]}),
  phones:B=>({all:B[0].w[2],ring:B[0].w[6]}),
  video:B=>({msg:B[0].w[1],airport:B[0].w[7],run:B[1].w[2],bite:B[1].w[5],call:B[2].s,none:B[2].w[4]}),
  vera:B=>({vera:B[0].w[0],calm:B[0].w[6]}),
  pilot:B=>({says:B[0].w[2],closed:B[0].w[6]}),
  nora:B=>({ask:B[0].w[1],home:B[0].w[6],yes:B[1].w[3],but:B[1].w[4]}),
  window:B=>({smoke:B[0].w[4],city:B[0].w[7]}),
  turn:B=>({turn:B[0].w[2],no:B[0].w[4]}),
  other:B=>({other:B[0].w[2],far:B[0].w[6],breathe:B[1].w[3],exit:B[1].w[7]}),
  bang:B=>({bang:B[0].w[3],behind:B[0].w[5]}),
  toilet:B=>({locked:B[0].w[4],call:B[1].w[1],says:B[1].w[4],dizzy:B[1].w[7]}),
  bracelet:B=>({falls:B[0].w[3],blood:B[0].w[7]}),
  open:B=>({open:B[0].w[2],sleeve:B[0].w[5],arm:B[0].w[9]}),
  marks:B=>({nora:B[0].w[0],marks:B[0].w[3],teeth:B[0].w[5]}),
  end:B=>({escaped:B[0].w[1],ground:B[0].w[5],someone:B[0].w[7],inf:B[0].w[10]}),
};
const S={};
S.intro=(t,D,B)=>{ // the plane above the clouds; push in to the lit window
  const E=EVS.intro(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#7ec0ee"/><rect x="-600" y="600" width="2280" height="800" fill="#bfe3f7"/>`+cloudBank(780,'#ffffff',t*90)+cloudBank(250,'#e9f5ff',t*40,.7);
  s+=plane(540,520+Math.sin(t*1.4)*6,.95,t);
  if(t>E.zombie) s+=tag(540,880,'APOCALIPSIS ZOMBI',PINK,P(t,E.zombie,.2));
  const zp=eIO(prog(t,E.plane-.3,D));
  return cam(s,lerp(1,2.4,zp),lerp(540,635,zp),lerp(560,508,zp),540,560);
};
S.id=(t,D,B)=>{const E=EVS.id(B);
  return idCard(t,D,{who:LEO,header:'PASAJERO · 23A',col:'#3a6ab0',name:'LEO',age:'13',ageAt:E.age,rows:[['VIAJA CON','NORA · 8 AÑOS',E.nora,'#d9607a'],['VUELO','626 · DESTINO MADRID',.4,'#1f2a3a']],h:500})
    +`<g opacity="${P(t,E.nora,.25).toFixed(2)}">${A({...NORA,x:110,y:1070,s:.95,look:[8,-4]})}</g>`;};
S.seat=(t,D,B)=>{
  const E=EVS.seat(B);
  let s=seatRowZ(t)+seated(t,{third:{eyes:'closed',tilt:8}})+armrests();
  s+=`<rect x="340" y="290" width="400" height="70" rx="12" fill="#1b2232"/><text x="540" y="337" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="30" fill="${YEL}">ATERRIZAJE ${String(20-Math.floor(prog(t,0,D)*0)).padStart(2,'0')}:00</text>`;
  return cam(s,1.06,540,640,540,620);
};
S.phones=(t,D,B)=>{ // every phone in the cabin lights up and buzzes
  const E=EVS.phones(B), on=t>E.all;
  let s=cabinAisle(t,{heads:()=>1});
  if(on) for(let r=6;r>=0;r--){const u=Math.pow((9-r)/9,1.5), yb=lerp(560,1150,u), sc=lerp(.14,1.35,u), half=lerp(40,250,u);
    for(const side of [-1,1]) for(let c=0;c<2;c++){const x=540+side*(half+c*112*sc+56*sc), y=yb-200*sc, a=P(t,E.all+(r*4+c)*.05,.2), bz=Math.sin(t*60+r+c)*2*sc;
      s+=`<g opacity="${a.toFixed(2)}"><circle cx="${x}" cy="${y}" r="${60*sc}" fill="url(#glowY)"/><rect x="${x-14*sc+bz}" y="${y-24*sc}" width="${28*sc}" height="${48*sc}" rx="${6*sc}" fill="#9fd0ff" stroke="#15161c" stroke-width="${4*sc}"/></g>`;}}
  if(t>E.ring){s+=bang(240,560,'BZZ',YEL,P(t,E.ring,.15),60)+bang(840,640,'BZZ',YEL,P(t,E.ring+.2,.15),54)+bang(560,360,'BZZ',YEL,P(t,E.ring+.4,.15),44);}
  if(on) s+=tag(540,300,'TODOS LOS MÓVILES',PINK,P(t,E.all,.2));
  return cam(s,1.04,540,600,540,560,on?shake(t,.3,3):0);
};
S.video=(t,D,B)=>{ // Leo's phone: mum's video from the airport, then no answer
  const E=EVS.video(B), k=t<B[1].s?0:t<E.call?1:2;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a3150"/>`+`<rect x="-600" y="-900" width="2280" height="2400" fill="#cfd3dc" opacity=".15"/>`;
  s+=handsPhone(540,560,1.15,phoneScreen(t,E,k),LEO.skin,LEO.top);
  if(k===1&&t>E.bite) s+=`<circle cx="${540+(150-140)*1.15}" cy="${560+(130+6+112*.857-295)*1.15}" r="40" fill="none" stroke="${PINK}" stroke-width="6" opacity="${P(t,E.bite,.2).toFixed(2)}"/>`;
  if(k===2) s+=tag(540,900,'NO CONTESTA',PINK,P(t,E.none,.2));
  const zp=k===1?eIO(prog(t,E.run-.4,E.bite+.4)):0;
  return cam(s,lerp(1,1.35,zp),540,lerp(560,420,zp),540,560);
};
S.vera=(t,D,B)=>{ // Vera in the aisle, calming everyone
  const E=EVS.vera(B);
  let s=cabinAisle(t,{heads:()=>1});
  const pal=t>E.calm?Math.sin(t*4)*20:0;
  s+=vera({x:540,y:1150,s:.82,look:[0,2],mouth:'smile',reachL:[-200,-560+pal],reachR:[200,-560-pal]});
  if(t>E.vera) s+=tag(540,430,'VERA · AUXILIAR',BLUE,P(t,E.vera,.2));
  if(t>E.calm) s+=tag(540,490,'CALMA',GREEN,P(t,E.calm,.2));
  return cam(s,1.04,540,600,540,560);
};
S.pilot=(t,D,B)=>{ // the PA speaker: the airport is closed
  const E=EVS.pilot(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#e2e5eb"/><rect x="-600" y="600" width="2280" height="900" fill="#cfd3dc"/>`;
  s+=`<circle cx="540" cy="380" r="150" fill="#b9bfc8"/><circle cx="540" cy="380" r="120" fill="#8a929c"/>`;
  for(let i=-3;i<=3;i++) s+=`<rect x="${540-90}" y="${380+i*28-4}" width="180" height="8" rx="4" fill="#5a616c"/>`;
  if(t>E.says){s+=soundArcs(700,380,t,'#5a616c',1)+soundArcs(380,380,t,'#5a616c',-1);}
  if(t>E.closed){const a=P(t,E.closed,.25);s+=`<g opacity="${a.toFixed(2)}" transform="translate(540,720) scale(${(.85+.15*eBack(a)).toFixed(3)})"><rect x="-330" y="-110" width="660" height="220" rx="20" fill="#11131f"/><text x="0" y="-30" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="40" fill="#fff" letter-spacing="4">AEROPUERTO</text><text x="0" y="60" text-anchor="middle" font-family="Inter" font-weight="900" font-size="96" fill="${PINK}">CERRADO</text></g>`;}
  return cam(s,1+.04*t/D,540,560,540,560);
};
S.nora=(t,D,B)=>{ // «¿vamos a volver a casa?» — «sí»
  const E=EVS.nora(B), yes=t>B[1].s;
  let s=seatRowZ(t)+seated(t,{third:{eyes:'closed',tilt:8},leoLook:[8,0],noraLook:[-8,-2],noraBrows:'worried',leoMouth:yes&&t<E.but?'smile':'line',leoBrows:t>E.but?'worried':null})+armrests();
  if(t>E.ask&&!yes) s+=bubble(620,360,520,90,'¿VAMOS A VOLVER A CASA?',{size:34,tx:580,ty:450,col:'#ffe0e8'});
  if(yes&&t<E.but) s+=bubble(300,380,160,90,'SÍ',{size:52,tx:330,ty:470});
  if(t>E.but) s+=tag(330,470,'NO LO SABES',PINK,P(t,E.but,.2));
  return cam(s,1.18,450,660,540,620);
};
S.window=(t,D,B)=>{ // through the window: smoke over the city
  const E=EVS.window(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#dfe2e8"/>`;
  s+=oval(540,560,520,720,skyIn(t,{smoke:t>E.smoke-.4,cy:330,gy:760,x0:240,dx:56,k:1,rise:420}),0);
  if(t>E.smoke) s+=tag(540,1020,'HUMO',PINK,P(t,E.smoke,.2));
  return cam(s,lerp(1,1.15,prog(t,0,D)),540,560,540,560);
};
S.turn=(t,D,B)=>{ // outside: the plane banks away from the burning city
  const E=EVS.turn(B), k=eIO(prog(t,E.turn-.3,D));
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#c9b8a8"/>`+skyIn(t,{smoke:true,cy:200,gy:900,x0:-80,dx:110,k:1.4,rise:520});
  s+=`<g transform="translate(${lerp(540,700,k)},${lerp(480,420,k)}) rotate(${lerp(0,-18,k)})">${plane(0,0,.75,t)}</g>`;
  if(t>E.no) s+=`<path d="M300,700 Q150,640 120,520" stroke="${YEL}" stroke-width="10" fill="none" stroke-dasharray="20 16" opacity="${P(t,E.no,.2).toFixed(2)}"/><polygon points="100,520 140,500 140,540" fill="${YEL}" opacity="${P(t,E.no,.2).toFixed(2)}"/>`;
  return cam(s,1.04,540,560,540,560);
};
S.other=(t,D,B)=>{
  const E=EVS.other(B);
  if(t<B[1].s){ // seat-back map: new route to another airport
    let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2f4f8f"/><rect x="120" y="180" width="840" height="700" rx="30" fill="#15161c"/><rect x="146" y="206" width="788" height="648" rx="16" fill="#1e3a2e"/>`;
    s+=`<path d="M146,620 Q400,560 600,640 T934,600 L934,854 L146,854Z" fill="#244a38"/>`;
    s+=`<circle cx="760" cy="420" r="60" fill="#c23a3a" opacity=".35"/><circle cx="760" cy="420" r="14" fill="#c23a3a"/><text x="760" y="510" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="24" fill="#ff8a8a">CIUDAD · CERRADA</text>`;
    s+=`<circle cx="300" cy="700" r="16" fill="#45e07e"/><text x="300" y="770" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="24" fill="#7dffb0">AEROPUERTO 2</text>`;
    const route='M640,300 Q520,360 420,520 T300,700', rk=prog(t,0,E.far+.6);
    s+=`<path d="${route}" stroke="#fff" stroke-width="8" fill="none" stroke-dasharray="18 14" opacity=".8"/>`;
    const px=lerp(640,300,rk), py=lerp(300,700,rk*rk);
    s+=`<g transform="translate(${px},${py}) rotate(${lerp(140,120,rk)}) scale(.9)"><path d="M0,-40 L10,-10 L46,6 L46,16 L10,8 L6,34 L18,44 L18,50 L0,44 L-18,50 L-18,44 L-6,34 L-10,8 L-46,16 L-46,6 L-10,-10Z" fill="${YEL}"/></g>`;
    if(t>E.far) s+=tag(540,250,'LEJOS DE LA CIUDAD',GREEN,P(t,E.far,.2));
    return cam(s,1.03,540,560,540,560);
  }
  // relief in the cabin
  let s=seatRowZ(t)+seated(t,{third:{mouth:'smile'},leoMouth:'smile',noraMouth:'smile',leoLook:[6,-2],noraLook:[-6,-2]})+armrests();
  if(t>E.exit) s+=tag(540,330,'DESVÍO CONFIRMADO',GREEN,P(t,E.exit,.2));
  return cam(s,1.06,540,640,540,620);
};
S.bang=(t,D,B)=>{ // a bang behind them: Leo turns round
  const E=EVS.bang(B), hit=t>E.bang;
  let s=seatRowZ(t)+seated(t,{third:{eyes:hit?'wide':'closed',look:[-10,-4]},leoLook:hit?[-10,-4]:[6,0],leoEyes:hit?'wide':'open',leoMouth:hit?'o':'line',noraLook:hit?[-10,-4]:[-6,0],noraEyes:hit?'wide':'open'})+armrests();
  if(hit) s+=bang(300,330,'¡PUM!',PINK,P(t,E.bang,.12),90);
  if(t>E.behind) s+=tag(820,430,'DETRÁS',PINK,P(t,E.behind,.2));
  return cam(s,1.06,540,640,540,620,hit?shake(t,1-prog(t,E.bang,E.bang+.5),9):0);
};
S.toilet=(t,D,B)=>{ // the lavatory: occupied; Vera knocks
  const E=EVS.toilet(B), knock=t>E.call&&t<E.says;
  let s=lavDoor(t,{});
  s+=vera({x:860,y:1080,s:.66,look:[-8,0],brows:t>E.dizzy?'worried':null,reachR:knock?[-200+Math.sin(t*25)*14,-480]:null});
  if(knock) s+=bang(660,520,'TOC TOC',YEL,1,48);
  if(t>E.locked&&t<E.call) s+=tag(540,1000,'ENCERRADA',YEL,P(t,E.locked,.2));
  if(t>E.says) s+=bubble(540,560,560,90,'«SOLO ESTOY MAREADA»',{size:34,tx:500,ty:680,col:'#ffe9a8'});
  return cam(s,1.04,560,560,540,560);
};
S.bracelet=(t,D,B)=>{ // under the door slides a bracelet stained with blood
  const E=EVS.bracelet(B), k=eOut(prog(t,E.falls-.3,E.falls+.6));
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#eef1f5"/><rect x="-600" y="600" width="2280" height="1000" fill="#3a4370"/><rect x="-600" y="560" width="2280" height="44" fill="#07080d"/>`;
  const bx=lerp(540,540,k), by=lerp(560,700,k);
  s+=`<g transform="translate(${bx},${by}) rotate(${lerp(0,-12,k)})"><rect x="-150" y="-26" width="300" height="52" rx="20" fill="#f3f3f6"/><rect x="-60" y="-18" width="120" height="36" rx="6" fill="#fff"/><text x="0" y="8" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="20" fill="#5a6070">HOSPITAL</text>`;
  if(t>E.blood) s+=`<g opacity="${P(t,E.blood,.3).toFixed(2)}"><circle cx="90" cy="-6" r="22" fill="#c21f2f"/><circle cx="118" cy="10" r="12" fill="#c21f2f"/><circle cx="-110" cy="12" r="10" fill="#c21f2f"/></g>`;
  s+=`</g>`;
  if(t>E.blood) s+=`<circle cx="700" cy="760" r="10" fill="#c21f2f" opacity="${P(t,E.blood+.3,.3).toFixed(2)}"/>`+tag(540,860,'SANGRE',PINK,P(t,E.blood,.2));
  return cam(s,lerp(1.2,1.35,prog(t,0,D)),540,640,540,560);
};
S.open=(t,D,B)=>{ // the woman opens, sleeve pressed to her arm
  const E=EVS.open(B), op=eOut(prog(t,E.open-.4,E.open+.4));
  let s=lavDoor(t,{open:op});
  if(op>.3) s+=A({...WOMAN,x:540,y:920,s:.64,look:[6,2],mouth:'line',brows:'worried',reachR:[-56,-330]})+`<ellipse cx="${540-56*.64}" cy="${920-300*.64}" rx="18" ry="24" fill="#8a1f2f" opacity="${P(t,E.sleeve,.4).toFixed(2)}"/>`;
  s+=vera({x:860,y:1080,s:.66,look:[-8,0],brows:'worried'});
  if(t>E.arm) s+=brackets(540-56*.64,920-320*.64,120,120,PINK)+tag(380,560,'EL BRAZO',PINK,P(t,E.arm,.2));
  return cam(s,1.06,560,580,540,560);
};
S.marks=(t,D,B)=>{ // close on the arm: teeth marks; Nora sees them
  const E=EVS.marks(B);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#d9dde4"/><rect x="-600" y="760" width="2280" height="800" fill="#3a4370"/>`;
  s+=`<path d="M-100,420 L520,380 Q600,376 640,400 L860,380 Q900,390 900,430 Q900,470 860,478 L640,470 Q600,500 520,490 L-100,520Z" fill="${WOMAN.skin}"/>`;
  s+=`<path d="M-120,400 L260,390 L280,540 L-120,540Z" fill="${WOMAN.top}"/>`;
  const a=P(t,E.marks-.2,.4);
  s+=`<g opacity="${a.toFixed(2)}"><ellipse cx="470" cy="440" rx="90" ry="46" fill="#e07a7a" opacity=".55"/>`;
  for(let i=0;i<8;i++){const an=i/8*Math.PI*2;s+=`<ellipse cx="${470+Math.cos(an)*62}" cy="${440+Math.sin(an)*28}" rx="8" ry="5" fill="#7a1f2a" transform="rotate(${an*57} ${470+Math.cos(an)*62} ${440+Math.sin(an)*28})"/>`}
  s+=`</g>`;
  s+=A({...NORA,x:860,y:1100,s:.9,look:[-10,-6],eyes:t>E.marks?'wide':'open',brows:'worried',mouth:t>E.teeth?'o':'line'});
  if(t>E.teeth) s+=tag(470,600,'MARCAS DE DIENTES',PINK,P(t,E.teeth,.2));
  return cam(s,1.04,540,560,540,560);
};
S.end=(t,D,B)=>{ // the woman, close up: her eyes start to change
  const E=EVS.end(B), turn=prog(t,E.inf-.1,E.inf+.3);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#b9bfc8"/>`;
  s+=A({...WOMAN,x:540,y:560+638*1.7,s:1.7,look:[0,0],mouth:t>E.someone?'line':'line',brows:'worried',eyes:turn>.5?'zombie':'open',still:true});
  s+=`<rect x="-600" y="900" width="2280" height="900" fill="#2a2e3a"/>`;
  if(turn>0) s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a4a2a" opacity="${(.25*turn).toFixed(2)}"/>`;
  const flick=t>E.someone&&Math.floor(t*11)%5===0?.35:0;
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity="${flick}"/>`;
  if(t>E.escaped&&t<E.someone) s+=tag(540,880,'ESCAPASTEIS DEL BROTE',GREEN,P(t,E.escaped,.2));
  const zp=eIO(prog(t,E.someone-.3,D));
  return cam(s,lerp(1,1.6,zp),540,lerp(560,520,zp),540,560,turn>0?shake(t,turn,4):0);
};
window.CFG={steps:[],band:{intro:'#2a5a8a',id:'#181b34',seat:'#2a3150',phones:'#2a3150',video:'#2a3150',vera:'#2a3150',pilot:'#3a3e4a',nora:'#2a3150',window:'#3a3640',turn:'#3a3640',other:'#1e3a2e',bang:'#2a3150',toilet:'#2a3150',bracelet:'#2a3150',open:'#2a3150',marks:'#2a3150',end:'#1a1c24'}};

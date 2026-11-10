// ---------- key times per scene (scene-relative) ----------
const EVS={
  cam:B=>({clock:B[1].s,cam:B[0].w[2]}),
  hall:B=>({sit:B[1].s,look:B[2].s}),
  sofa:B=>({tv:B[0].w[12],recall:B[1].w[2]}),
  rec:B=>({rise:B[0].w[4],turn:B[1].s,walk:B[2].s,steps:B[3].s,close:B[4].w[4]}),
  breath:B=>({breath:B[0].w[7]}),
  phone:B=>({ph:B[0].w[4],alg:B[0].w[18]}),
  end:B=>({cut:B[0].w[7]}),
};
const S={};

// ---------- people and places ----------
const QYOU={skin:'#e0b08a',hs:'short',hair:'#2a2420',top:'#4a6a8a',topD:'#3a5a7a',pants:'#2a2e38',shoes:'#222',seed:17};
// clock: the footage starts at 03:07:00
const tcAt=sec=>{const s=11220+Math.floor(sec);return [Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(v=>String(v).padStart(2,'0')).join(':')};

// the living room: a wall with a night window, a lamp, a sofa with the back to the room; the TV is off-screen on the left
const roomK=(t,o={})=>{
  let s=`<rect x="-600" y="-900" width="2280" height="1800" fill="#2a2420"/>`;
  s+=`<rect x="-600" y="900" width="2280" height="1000" fill="#4a3a2e"/>`;
  s+=`<rect x="-600" y="880" width="2280" height="22" fill="#2f2620"/>`;
  s+=winK(780,300,200,280,skyNight(t),{cur:'#8a4a5a'});
  s+=`<rect x="120" y="470" width="10" height="430" fill="#3a2e28"/><path d="M60,470 L180,470 L160,370 L80,370Z" fill="#fff1c8" opacity=".9"/>`;
  const tvA=(o.tv===undefined?.35:o.tv);
  s+=`<circle cx="120" cy="700" r="${(380+20*Math.sin(t*9)).toFixed(0)}" fill="url(#glowB)" opacity="${(tvA*(.7+.3*Math.sin(t*11))).toFixed(2)}"/>`;
  if(o.st!==false) s+=stranger(560,780,.6,{tilt:o.tilt||0});
  s+=sofaK(540,900,660,'#5a4a6a');
  if(o.you!==false) s+=A({...QYOU,x:540,y:900,s:.72,sit:true,look:o.look||[0,-4],mouth:'line',eyes:'open'});
  s+=sofaArmsK(540,900,660,'#5a4a6a');
  s+=dark(.5,[[540,640,320,260]]);
  return s};

// the CCTV look: green tint, grain, REC light, timecode and camera label
const cctv=(inner,t,label,tc)=>{
  const r=rng(Math.floor(t*12)+5); let g='';
  for(let i=0;i<70;i++) g+=`<rect x="${(r()*1080).toFixed(0)}" y="${(r()*1920).toFixed(0)}" width="2" height="2" fill="${r()<.5?'#fff':'#000'}" opacity=".35"/>`;
  let s=inner+`<rect x="-600" y="-900" width="2280" height="2400" fill="#0c1a12" opacity=".3"/>`+g;
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="url(#vig)" opacity=".9"/>`;
  s+=`<text x="60" y="236" font-family="${MONO}" font-weight="700" font-size="34" fill="#ff5a5a" opacity="${(Math.floor(t*2)%2?.25:1).toFixed(2)}">● REC</text>`;
  s+=`<text x="1020" y="290" text-anchor="end" font-family="${MONO}" font-weight="700" font-size="34" fill="#e9f7ee">${tc}</text>`;
  s+=`<text x="60" y="280" font-family="${MONO}" font-weight="700" font-size="26" fill="#e9f7ee" opacity=".85">${label}</text>`;
  return s};

// the upstairs hallway, seen from the camera: the bedroom door is open at the back
const hallway=(t,fig)=>{
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1c2420"/>`;
  s+=`<path d="M-600,-900 L1680,-900 L780,300 L300,300Z" fill="#2a302c"/>`;
  s+=`<path d="M-600,1600 L1680,1600 L780,900 L300,900Z" fill="#3a3f38"/>`;
  s+=`<path d="M-600,-900 L300,300 L300,900 L-600,1600Z" fill="#4a5048"/>`;
  s+=`<path d="M1680,-900 L780,300 L780,900 L1680,1600Z" fill="#4a5048"/>`;
  s+=`<rect x="300" y="300" width="480" height="600" fill="#363c36"/>`;
  s+=`<rect x="380" y="340" width="320" height="560" fill="#14181a"/>`;
  s+=`<rect x="400" y="640" width="280" height="220" fill="#3a4c60"/><rect x="420" y="612" width="110" height="40" rx="10" fill="#c9d4df"/>`;
  s+=`<rect x="366" y="326" width="348" height="16" fill="#e9e4d8"/><rect x="366" y="326" width="16" height="590" fill="#e9e4d8"/><rect x="698" y="326" width="16" height="590" fill="#e9e4d8"/>`;
  if(fig) s+=stranger(fig.x,fig.y,fig.s,{tilt:fig.tilt||0});
  if(fig&&fig.occ>0) s+=`<rect x="400" y="700" width="280" height="170" fill="#4a5c70" opacity="${fig.occ.toFixed(2)}"/>`;
  return s};

// ---------- scenes ----------
S.cam=(t,D,B)=>{const E=EVS.cam(B), on=t>E.clock;
  let s=roomK(t,{st:false,tv:.2});
  // the camera on the wall, with a red light that blinks
  s+=`<g transform="translate(930,360) scale(1.7) translate(-930,-360)"><rect x="880" y="340" width="100" height="50" rx="8" fill="#1d1d22"/><circle cx="888" cy="365" r="14" fill="#2a2a30"/><circle cx="950" cy="352" r="6" fill="${Math.floor(t*2)%2?'#ff3a3a':'#5a1a1a'}"/></g>`;
  if(on) return cam(cctv(s,t,'CÁM 1 · SALÓN',tcAt(t)),1,540,640,540,560);
  return cam(s,1.05,540,640,540,560);};

S.hall=(t,D,B)=>{const E=EVS.hall(B);
  const sitting=t>E.sit;
  const fig=sitting?{x:540,y:860,s:.36,tilt:-4+Math.sin(t*.7)*3,occ:1}:null;
  return cctv(hallway(t,fig),t,'CÁM 1 · PASILLO',tcAt(t));};

S.sofa=(t,D,B)=>{const E=EVS.sofa(B), tvOn=t>E.tv;
  let s=roomK(t,{st:false,tv:tvOn?.4:.05});
  return cam(s,1.05,540,640,540,560);};

S.rec=(t,D,B)=>{const E=EVS.rec(B), k=eIn(prog(t,E.walk,E.close));
  let fig;
  if(t<E.walk){
    const up=eOut(prog(t,E.rise,E.rise+.8));
    fig={x:540,y:lerp(860,880,up),s:lerp(.36,.42,up),tilt:t>E.turn?lerp(-4,14,eOut(prog(t,E.turn,E.walk))):-4,occ:1-prog(t,E.rise,E.rise+.6)};
  } else {
    fig={x:540,y:lerp(880,1750,k),s:lerp(.42,1.5,k),tilt:14,occ:0};
  }
  return cctv(hallway(t,fig),t,'CÁM 1 · PASILLO',tcAt(t+4));};

S.breath=(t,D,B)=>{const E=EVS.breath(B), bp=P(t,E.breath,.5);
  let s=roomK(t,{st:true,tilt:8});
  s+=`<circle cx="612" cy="640" r="${(34+26*Math.sin(t*3)).toFixed(0)}" fill="#ffffff" opacity="${(.22*bp*(.6+.4*Math.sin(t*4))).toFixed(2)}"/>`;
  return cam(s,1.08,540,640,540,600);};

S.phone=(t,D,B)=>{const E=EVS.phone(B), on=P(t,E.ph,.3);
  let s=roomK(t,{st:false,tv:.1});
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#14120f" opacity=".55"/>`;
  const id=uid('ph');
  s+=`<rect x="290" y="300" width="500" height="840" rx="60" fill="#0b0b0f"/>`;
  s+=`<clipPath id="${id}"><rect x="310" y="320" width="460" height="800" rx="30"/></clipPath>`;
  s+=`<g opacity="${on.toFixed(2)}"><g clip-path="url(#${id})"><g transform="translate(300,320) scale(.43)">${roomK(t,{st:true,tilt:6,tv:.3})}</g>`;
  s+=`<rect x="310" y="320" width="460" height="800" rx="30" fill="none" stroke="#ff5a5a" stroke-width="4" opacity="${(Math.floor(t*2)%2?0:.9).toFixed(2)}"/>`;
  s+=`<text x="330" y="360" font-family="${MONO}" font-weight="700" font-size="24" fill="#ff5a5a">● EN DIRECTO</text></g></g>`;
  return cam(s,1.0,540,640,540,560);};

S.end=(t,D,B)=>{const E=EVS.end(B), zk=eIO(prog(t,0,D));
  let s=roomK(t,{st:true,tilt:14,look:[0,-4],tv:.3});
  return cctv(cam(s,lerp(1.0,1.2,zk),540,640,540,600),t,'CÁM 1 · SALÓN',tcAt(t+6));};

window.CFG={steps:[],listEnd:'end',
  band:{cam:'#1a1f1c',hall:'#1c2420',sofa:'#2a2420',rec:'#1c2420',breath:'#2a2420',phone:'#14120f',end:'#0c1a12'}};

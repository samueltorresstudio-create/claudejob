p='scenes_new.js'; c=open(p).read()
R=[
("<g transform=\"translate(0,-10)\">${A({...VEC5,x:0,y:150,s:.32,look:[6,-4],eyes:'happy',mouth:'laugh'})}</g>","${A({...VEC5,x:0,y:420,s:.7,look:[6,-4],eyes:'happy',mouth:'laugh'})}"),
("  s+=dPlant(1000,1010,.8,{pot:'#7a5a4a'});\n  return s};\nconst balconyBg","  s+=`<g transform=\"translate(360,250) rotate(2)\"><rect x=\"0\" y=\"0\" width=\"220\" height=\"170\" fill=\"#8a6a4a\"/><rect x=\"12\" y=\"12\" width=\"196\" height=\"146\" fill=\"#c9b090\"/><rect x=\"28\" y=\"24\" width=\"110\" height=\"80\" fill=\"#fff\" transform=\"rotate(-4 83 64)\"/><text x=\"83\" y=\"52\" text-anchor=\"middle\" font-family=\"Inter\" font-weight=\"900\" font-size=\"18\" fill=\"#c23a3a\">AVISO</text><text x=\"83\" y=\"78\" text-anchor=\"middle\" font-family=\"Inter\" font-weight=\"800\" font-size=\"12\" fill=\"#2a2620\">SIN AGUA</text><rect x=\"130\" y=\"60\" width=\"64\" height=\"80\" fill=\"#ffe36a\" transform=\"rotate(6 162 100)\"/><circle cx=\"83\" cy=\"26\" r=\"5\" fill=\"#c23a3a\"/></g>`;\n  s+=dPlant(1000,1010,.8,{pot:'#7a5a4a'});\n  return s};\nconst balconyBg"),
("o+=bulb(560,180,.9,","o+=bulb(330,330,.8,"),
("if(t>E.six) o+=countPop('+6 L',540,330,150,","if(t>E.six) o+=countPop('+6 L',720,470,150,"),
("if(happy) o+=tag(540,300,'80 LITROS'","if(happy) o+=tag(760,460,'80 LITROS'"),
("o+=bang(770,200,'¿?',YEL","o+=bang(930,280,'¿?',YEL"),
("if(t>E.collect) o+=tag(540,330,'RECOGE TODO'","if(t>E.collect) o+=tag(760,440,'RECOGE TODO'"),
("o+=tag(400,330,'PLÁSTICO = EMBUDO'","o+=tag(700,440,'PLÁSTICO = EMBUDO'"),
("if(t>E.mop) o+=tag(540,330,'AGUA DE FREGAR'","if(t>E.mop) o+=tag(720,460,'AGUA DE FREGAR'"),
("o+=tag(540,880,'INFECCIONES'","o+=tag(540,470,'INFECCIONES'"),
("if(d1) o+=countPop(d2?'2 GOTAS':'1 GOTA',380,170,80,","if(d1) o+=countPop(d2?'2 GOTAS':'1 GOTA',600,560,80,"),
("let o=cam(s,lerp(1.06,1.0,prog(t,E.drops-.25,D)),560,560,540,560);","let o=cam(s,lerp(1.06,1.0,prog(t,E.drops-.25,D)),560,680,540,600);"),
("if(ok&&t<E.wait) o+=tag(800,330,'SIN PERFUME'","if(ok&&t<E.wait) o+=tag(800,450,'SIN PERFUME'"),
("if(t>E.wait-.1){o+=stopwatch(800,330,.75,","if(t>E.wait-.1){o+=stopwatch(800,380,.75,"),
("if(t>E.half) o+=countPop('30 MIN',800,500,80,","if(t>E.half) o+=countPop('30 MIN',800,550,80,"),
("o+=`<g transform=\"translate(540,560) scale(${lerp(1.04,1.7,k).toFixed(3)}) translate(-490,-650)\">`","o+=`<g transform=\"translate(540,600) scale(${lerp(1.04,1.45,k).toFixed(3)}) translate(${-lerp(540,560,k)},${-lerp(640,700,k)})\">`"),
]
for a,b in R:
    assert a in c, a[:70]; c=c.replace(a,b)
a="""fg+=`<path d="M120,705 L${lerp(120,640,pl)},705 Q${lerp(200,760,pl)},${lerp(720,820,pl)} ${lerp(150,880,pl)},${lerp(720,905,pl)} Q${lerp(140,520,pl)},${lerp(715,860,pl)} 120,705Z" fill="#bfe0ff" opacity=".5" stroke="#8ab8e0" stroke-width="5"/>`;"""
b="""const qx=lerp(120,640,pl), lx=lerp(150,880,pl), ly=lerp(720,905,pl);
    fg+=`<path d="M120,705 L${qx},705 Q${lerp(200,760,pl)},${lerp(720,820,pl)} ${lx},${ly} Q${lerp(140,520,pl)},${lerp(715,860,pl)} 120,705Z" fill="#3a7ad8" opacity=".85" stroke="#1f4f9a" stroke-width="6" stroke-linejoin="round"/>`;
    for(let i=1;i<4;i++) fg+=`<path d="M${lerp(120,qx,i/4)},708 Q${lerp(lerp(140,520,pl),lerp(200,760,pl),i/4)},${lerp(760,850,pl*i/4)} ${lx},${ly}" stroke="#9ac8ff" stroke-width="4" fill="none" opacity=".6"/>`;
    fg+=`<path d="M100,690 l40,30 M${qx-20},690 l40,30" stroke="#e0b04a" stroke-width="6"/>`;"""
assert a in c; c=c.replace(a,b)
a="""  fg+=A({...ALEX,x:780,y:1010,s:.64,look:[-12,6],mouth:'smile',reachL:[-260,-620],reachR:[-200,-640]});
  if(lid>.5) fg+=`<g transform="translate(${780-.64*240},${1010-.64*640}) rotate(-12)"><rect x="-160" y="-17" width="320" height="34" rx="10" fill="#e9eef0" stroke="#c9d2d6" stroke-width="4"/></g>`;
  fg+=A({...VEC5S,x:1000,y:1010,s:.6,look:[-12,4],brows:'up',mouth:'o'});
  let o=focusCam(bg,fg,k,490,650,{z0:1.04,z1:1.7});"""
b="""  if(lid>.5) fg+=`<g transform="translate(250,880) rotate(-80)"><rect x="0" y="-17" width="320" height="34" rx="10" fill="#e9eef0" stroke="#c9d2d6" stroke-width="4"/></g>`;
  fg+=A({...ALEX,x:780,y:1010,s:.64,look:[-12,6],mouth:'smile',reachL:lid>.5?[-300,-560]:[-360,-600]});
  fg+=A({...VEC5S,x:1000,y:1010,s:.6,look:[-12,4],brows:'up',mouth:'o'});
  let o=cam(bg+fg,lerp(1.04,1.45,k),lerp(540,560,k),lerp(640,700,k),540,600);"""
assert a in c; c=c.replace(a,b)
i0=c.index("  let s=`<rect x=\"-600\" y=\"-900\" width=\"2280\" height=\"2400\" fill=\"#d8c8b0\"/>`+decorWall")
i1=c.index("  let o=cam(s,lerp(1.06,1.0,prog(t,E.drops-.25,D)),560,680,540,600);")
b="""  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#d8c8b0"/>`+decorWall({floor:null,paper:'dots',paperOp:.04,items:[['frame',620,240,.8,{pic:'land'}],['clock',940,280,.7,{stopped:true,h:12.55,m:33}],['shelf',40,420,.8,{w:220,seed:4}]]});
  s+=`<rect x="-600" y="960" width="2280" height="800" fill="#8a6448"/><rect x="-600" y="960" width="2280" height="24" fill="#6a4a30"/>`;
  s+=literBottle(380,1040,.9,{})+bleachK(800,1040,1,{ok});
  const dy=prog(t,E.bleach-.2,E.bleach+.4);
  s+=`<g transform="translate(380,${(500-dy*20).toFixed(0)})"><rect x="-14" y="-60" width="28" height="90" rx="6" fill="#dff2ff" opacity=".7" stroke="#9fc6dc" stroke-width="4"/><rect x="-22" y="-120" width="44" height="64" rx="18" fill="#c23a3a"/><path d="M-6,30 L0,56 L6,30Z" fill="#dff2ff"/></g>`;
  for(const [on,ts] of [[d1,E.drops],[d2,E.drops+.45]]){if(!on) continue;const p=prog(t,ts,ts+.45);if(p<1) s+=`<ellipse cx="380" cy="${(560+p*170).toFixed(0)}" rx="10" ry="15" fill="#fff6c0" stroke="#d8c060" stroke-width="3"/>`;else s+=`<ellipse cx="380" cy="${(745+(ts===E.drops?0:6))}" rx="${(10+prog(t,ts+.45,ts+1)*40).toFixed(0)}" ry="6" fill="none" stroke="#fff" stroke-width="3" opacity="${(1-prog(t,ts+.45,ts+1)).toFixed(2)}"/>`;}
  s+=handIn(410,400,-35,.8);
"""
c=c[:i0]+b+c[i1:]
open(p,'w').write(c)
print('done')

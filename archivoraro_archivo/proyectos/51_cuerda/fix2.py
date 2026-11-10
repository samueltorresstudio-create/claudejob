import re
p='scenes_p.js'; c=open(p).read()
def block(name):
    i=c.index(name); j=c.index('\n\n',i); return i,j
def repl(name,new):
    global c
    i,j=block(name); c=c[:i]+new.strip('\n')+c[j:]

repl("const hookShot=",r"""
// Simon braced in his snow seat, big in frame, the rope running over the edge (o.slide px, o.knife 0..1, o.cut 0..1, o.face)
const SX=300, SY=900, SS=.8;
const simonBg=(t,o={})=>{let s=abyssBg(t)+wind(t,40,.4);
  s+=texPoly('M-600,860 L180,880 L560,866 L790,836 L812,1500 L-600,1500Z','snow',{edge:'#ffffff',ew:6});
  s+=`<path d="M790,836 L812,1500 L760,1500 L770,900Z" fill="#1d2a40" opacity=".6"/>`;
  s+=`<path d="M120,900 Q300,820 480,900 L480,930 L120,930Z" fill="#c9d6e8"/><path d="M120,900 Q300,820 480,900" stroke="#fff" stroke-width="5" fill="none"/>`;
  if(o.crack){for(let i=0;i<5;i++){const L=clamp(o.crack*1.4-i*.15)*110;if(L>0) s+=`<path d="M${180+i*60},905 l${(i%2?14:-10)},${(L*.4).toFixed(0)} l${(i%2?-8:12)},${(L*.6).toFixed(0)}" stroke="#4a5a7a" stroke-width="5" fill="none"/>`;}}
  return s};
const simonFg=(t,o={})=>{const sl=o.slide||0, x=SX+sl, kn=o.knife||0, cu=o.cut||0, jig=Math.sin(t*23)*3+(o.jerk||0);
  const hL=[x+230*SS,SY-250*SS], hR0=[x+260*SS,SY-232*SS];
  let rR=kn>0?(cu>0?[lerp(120,270,eOut(clamp(cu*3))),lerp(-480,-250,eOut(clamp(cu*3)))]:[120,-480]):[260,-232];
  const hR=[x+rR[0]*SS,SY+rR[1]*SS];
  let s='';
  if(cu<.34) s+=rope([[hL[0]-60,hL[1]+60],[hL[0],hL[1]],[hR0[0],hR0[1]],[650,780+jig],[790,836],[805,1400]],{w:13});
  else {const p=prog(cu,.34,1);s+=rope([[hL[0]-60,hL[1]+60],[hL[0],hL[1]],[hL[0]+60+p*40,hL[1]+20+p*80]],{w:13})+rope([[lerp(650,800,p),lerp(780,1000,p)],[790,836+p*200],[805,1400+p*400]],{w:13});}
  s+=A({...SIMON,x,y:SY,s:SS,sit:true,look:o.look||[12,6],brows:o.brows||'worried',eyes:o.eyes||'open',mouth:o.mouth||'line',reachL:[230,-250],reachR:rR});
  if(kn>0) s+=knifeK(hR[0]+10,hR[1]-10,.55,clamp(kn*1.6-.4),cu>0?lerp(-70,10,clamp(cu*3)):-70);
  if(o.sweat) s+=sweat(x,SY,SS,t);
  s+=breath(x+70,SY-SS*600,t,.5);
  return s};
""")
repl("S.hook=",r"""
S.hook=(t,D,B)=>{const E=EVS.hook(B), dr=t>E.drag, jerk=dr&&t<E.drag+.5?Math.sin((t-E.drag)*40)*14*(1-prog(t,E.drag,E.drag+.5)):0;
  const sl=40*eOut(prog(t,E.drag,E.drag+.4)), kn=prog(t,E.q-.5,E.q+.4), k=eIO(prog(t,E.q-.3,E.q+.7));
  const bg=simonBg(t), fg=simonFg(t,{slide:sl,jerk,knife:kn,eyes:dr?'wide':'open',mouth:dr?'o':'line',sweat:dr,look:kn>0?[0,-4]:[12,8]})+wind(t,40,.8,.4,2200);
  let o=focusCam(bg,fg+vignette(.5),k,SX+sl+60,SY-SS*560,{z0:1.08,z1:1.75});
  o=`<g transform="translate(${shake(t,dr?1-prog(t,E.drag,E.drag+.6):.2,dr?10:3)},0)">${o}</g>`;
  if(dr&&t<E.q-.3) o+=bang(800,330,'¡TIRA!',PINK,P(t,E.drag,.12),84);
  if(t>E.q) o+=bigText('?',880,420,220,'#ffd34a',P(t,E.q+.2,.2));
  return o;};
""")
# lower: bigger characters
c=c.replace("s+=A({...SIMON,x:240,y:450,s:.42,","s+=A({...SIMON,x:240,y:450,s:.5,").replace("const [hx,hy]=waist(240,450,.42);","const [hx,hy]=waist(240,450,.5);").replace("s+=A({...JOE,x:jx,y:jy+30,s:.42,rot:-58,","s+=A({...JOE,x:jx,y:jy+30,s:.5,rot:-58,")
# edge: push in on Joe's face once he hangs
c=c.replace("  const oy=lerp(-200,560,pan);\n  let o=cam(w,lerp(1.15,1.0,pan),lerp(380,700,pan),oy,540,560);",
"  const oy=lerp(-200,560,pan), fz=eIO(prog(t,E.hang+.2,E.voidw+.2));\n  let o=cam(w,lerp(lerp(1.15,1.0,pan),1.9,fz),lerp(lerp(380,700,pan),jx,fz),lerp(oy,jy-.48*520,fz),540,560);")
c=c.replace("if(t>E.voidw) o+=dpill(540,880,'VACÍO','',P(t,E.voidw,.3),'#ff3e6c');","if(t>E.voidw) o+=dpill(540,900,'VACÍO','',P(t,E.voidw,.3),'#ff3e6c');")
# stuck part 2: the big Simon set with the cracking seat
i=c.index("  // the snow seat gives way"); j=c.index("  // the «snow holding» meter")
c=c[:i]+"""  // the snow seat gives way
  const g=prog(t,E.snow,D+.5), give=t>E.give;
  const bg=simonBg(t,{crack:g}), fg=simonFg(t,{slide:g*55,eyes:give?'wide':'open',mouth:give?'o':'line',sweat:true});
  let snowf='';if(g>0) for(let i=0;i<6;i++){const p=(t*1.5+i/6)%1;snowf+=`<circle cx="${(420+i*30+p*120).toFixed(0)}" cy="${(910+p*160).toFixed(0)}" r="${(6+i%3*3)}" fill="#fff" opacity="${(g*(1-p)).toFixed(2)}"/>`;}
  let o=focusCam(bg,fg+snowf+wind(t,50,.7,.45,2200),eIO(prog(t,E.give-.6,E.give+.4))*.7,SX+60,SY-SS*450,{z0:1.06,z1:1.6,bars:false});
  if(give) o=`<g transform="translate(${shake(t,.5,4)},0)">${o}</g>`;
"""+c[j:]
c=c.replace("o+=`<g transform=\"translate(140,860)\"><rect x=\"-10\" y=\"-60\" width=\"820\"","o+=`<g transform=\"translate(140,180)\"><rect x=\"-10\" y=\"-60\" width=\"820\"")
repl("S.cut=",r"""
S.cut=(t,D,B)=>{const E=EVS.cut(B), cu=prog(t,E.cut-.25,E.cut+.5), kn=prog(t,E.knife-1,E.knife+.2);
  const kf=eIO(prog(t,E.knife-.8,E.knife))*(1-eIO(prog(t,E.cut-.4,E.cut+.1)));
  const bg=simonBg(t), fg=simonFg(t,{knife:kn,cut:cu,eyes:t>E.knife+.3&&t<E.cut?'closed':'wide',mouth:'line',brows:'worried',sweat:true,look:[0,-2]})+wind(t,40,.8,.4,2200);
  let o=focusCam(bg,fg,Math.max(kf,.35*(1-prog(t,E.cut+.2,D))),SX+60,SY-SS*560,{z0:1.06,z1:2.0});
  if(t>E.cut&&t<E.cut+.12) o+=`<rect x="0" y="0" width="1080" height="1100" fill="#fff" opacity=".8"/>`;
  if(t>E.cut) o=`<g transform="translate(${shake(t,1-prog(t,E.cut,E.cut+.7),14)},0)">${o}</g>`+bang(800,330,'¡ZAS!',PINK,P(t,E.cut,.1),110);
  return o;};
""")
repl("const crawler=",r"""
const crawler=(x,y,s,t,mv=1)=>{const ph=t*4*mv; // face down, pulling himself forward (to the left) with his arms
  return A({...JOE,x,y:y-80*s,s,rot:-84,look:[0,-12],brows:'worried',mouth:'line',eyes:'open',reachL:[-60+Math.sin(ph)*30,-820+Math.sin(ph)*110],reachR:[60-Math.sin(ph)*30,-820-Math.sin(ph)*110]})+breath(x-s*700,y-s*120,t,.4)};""")
c=c.replace("s+=crawler(x,1010,.62,t)+`<path d=\"M${x+380},1010 L${x+900},1020\" stroke=\"#5a4a40\" stroke-width=\"10\" opacity=\".4\"/>`;","s+=`<path d=\"M${x+300},1012 L${x+1000},1022\" stroke=\"#5a4a40\" stroke-width=\"14\" opacity=\".35\"/>`+crawler(x,1010,.7,t);")
c=c.replace("const x=lerp(640,560,prog(t,0,D+1));","const x=lerp(760,640,prog(t,0,D+1));")
c=c.replace("let o=cam(s,1.2,lerp(560,520,prog(t,0,D)),820,540,640);","let o=cam(s,lerp(1.3,1.4,prog(t,0,D)),lerp(420,380,prog(t,0,D)),880,540,640);")
# friends: a rock to sit on
c=c.replace("s+=`<path d=\"M300,1010 Q540,930 780,1010Z\" fill=\"#7a6a5e\"/>`;","s+=`<path d=\"M240,1010 Q240,850 400,836 L700,836 Q840,850 840,1010Z\" fill=\"#6a5a50\"/><path d=\"M260,900 Q300,846 400,840 L700,840 Q800,846 830,900Z\" fill=\"#fff\" opacity=\".12\"/>`;")
repl("S.you=",r"""
S.you=(t,D,B)=>{
  const bg=simonBg(t), fg=simonFg(t,{knife:1,eyes:'wide',mouth:'line',sweat:true,look:[0,-4]})+wind(t,40,.8,.4,2200);
  let o=focusCam(bg,fg,eIO(prog(t,0,D*.7)),SX+60,SY-SS*560,{z0:1.3,z1:1.9});
  o+=bigText('¿Y TÚ?',540,330,150,'#ffd34a',P(t,.1,.3));
  return o;};
""")
open(p,'w').write(c); print('ok')

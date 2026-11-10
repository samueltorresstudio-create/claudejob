p='scenes_p.js'; c=open(p).read()
def R(a,b,cnt=1):
    global c
    assert c.count(a)>=1, a[:80]
    c=c.replace(a,b) if cnt==0 else c.replace(a,b,cnt)
# bigger mittens
i0=c.index("const glove="); i1=c.index("\n",i0)
c=c[:i0]+"""const glove=(x,y,rot,s,col=GLOVE)=>`<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="40" y="-46" width="380" height="92" rx="40" fill="${SIMON.top}"/><rect x="40" y="-46" width="380" height="20" rx="10" fill="#fff" opacity=".15"/><rect x="20" y="-56" width="70" height="112" rx="22" fill="#1d1f2a"/><ellipse cx="-40" cy="0" rx="86" ry="70" fill="${col}"/><ellipse cx="-30" cy="-58" rx="40" ry="26" fill="${col}" transform="rotate(-25 -30 -58)"/><path d="M-110,-10 q30,-30 70,-16" stroke="#fff" stroke-width="6" opacity=".18" fill="none" stroke-linecap="round"/><path d="M-60,30 q30,10 60,-6" stroke="#000" stroke-width="5" opacity=".25" fill="none"/></g>`;"""+c[i1:]
R("s+=glove(150,420,-30,.75)+glove(320,520,-45,.7);","s+=glove(170,430,-30,.8)+glove(360,540,-40,.75);")
R("s+=glove(lerp(1200,700,k),lerp(560,600,k),20,.75)","s+=glove(lerp(1250,760,k),lerp(580,620,k),20,.8)")
R("fg+=glove(150,420,-30,.75);","fg+=glove(170,430,-30,.8);")
R("fg+=glove(kx+110,ky+40,20,.75)","fg+=glove(kx+150,ky+50,20,.8)")
# mountain: tags on the right person, bigger eiffel stack
R("o+=tag(330,420,'JOE',PINK,P(t,E.joe,.2))+tag(760,420,'SIMON',BLUE,P(t,E.simon,.2));","o+=tag(300,420,'SIMON',BLUE,P(t,E.simon,.2))+tag(800,520,'JOE',PINK,P(t,E.joe,.2));")
R("for(let i=0;i<19;i++) o+=eiffel(940,1060-i*48,52,clamp(k*19-i));","for(let i=0;i<19;i++) o+=eiffel(850,1080-i*49,50,clamp(k*19-i));")
c=c.replace("const eiffel=(x,y,h,a=1,col='#ffd36a')=>{const w=h*.42;","const eiffel=(x,y,h,a=1,col='#ffd36a')=>{const w=h*.62;")
c=c.replace("stroke-width=\"${Math.max(2,h*.025)}\"/><line","stroke-width=\"${Math.max(3,h*.06)}\"/><line")
# lower: Simon's seat visible
R("s+=texPoly('M-600,330 L120,330 L1680,1300 L-600,1500Z','snow',{edge:'#ffffff',ew:5,tint:'#2a3060',tintOp:.25});\n  s+=`<path d=\"M40,330 Q120,300 200,330 L200,360 L40,360Z\" fill=\"#c9d6e8\"/>`;",
  "s+=texPoly('M-600,450 L240,450 L1680,1300 L-600,1500Z','snow',{edge:'#ffffff',ew:5,tint:'#2a3060',tintOp:.25});\n  s+=`<path d=\"M140,450 Q240,420 320,450 L320,480 L140,480Z\" fill=\"#c9d6e8\"/>`;")
R("const [hx,hy]=waist(120,330,.42);\n  s+=A({...SIMON,x:120,y:330,","const [hx,hy]=waist(240,450,.42);\n  s+=A({...SIMON,x:240,y:450,")
R("const jx=lerp(380,900,q), jy=lerp(560,880,q);","const jx=lerp(480,920,q), jy=lerp(640,920,q);")
R("let o=cam(s,lerp(1.05,1.15,prog(t,0,D)),lerp(460,620,q),600,540,560);","let o=cam(s,lerp(1.02,1.1,prog(t,0,D)),lerp(520,640,q),640,540,600);")
# stuck: bottom panel content down into its frame
R("<g clip-path=\"url(#${id2})\"><g transform=\"translate(0,300) scale(1) translate(0,-300)\">${bot}</g></g>","<g clip-path=\"url(#${id2})\"><g transform=\"translate(0,430)\">${bot}</g></g>")
# alone: crevasse as a crack in the snow
R("s+=`<path d=\"M60,700 Q200,690 330,720 L320,736 Q200,712 70,716Z\" fill=\"#0a1020\"/>`;","s+=`<path d=\"M40,640 L120,628 L180,650 L260,636 L330,660 L320,690 L250,672 L170,690 L100,668 L40,684Z\" fill=\"#0a1830\"/><path d=\"M40,640 L120,628 L180,650 L260,636 L330,660\" stroke=\"#bfe8ff\" stroke-width=\"4\" fill=\"none\"/>`;")
# crawler: no detached leg
R("+`<path d=\"M${x+s*360},${y-s*30} L${x+s*620},${y-s*10}\" stroke=\"#2a3040\" stroke-width=\"${s*70}\" stroke-linecap=\"round\"/>`};","};")
R("fg=lying({...JOE,x:620,y:960,s:.6,eyes:'open',mouth:'o',brows:'worried'},.6)+`<path d=\"M${620+.6*360},${960-.6*30} L${620+.6*620},${960-.6*10}\" stroke=\"#2a3040\" stroke-width=\"${.6*70}\" stroke-linecap=\"round\"/>`;","fg=lying({...JOE,x:620,y:960,s:.6,eyes:'open',mouth:'o',brows:'worried'},.6);")
# sky down to the horizon in crawl / watch
c=c.replace("`<rect x=\"-600\" y=\"-900\" width=\"2280\" height=\"900\" fill=\"#9fb0c8\"/>`","`<rect x=\"-600\" y=\"-900\" width=\"2280\" height=\"1460\" fill=\"#9fb0c8\"/>`+puffs(t,250,'#fff',.6,5,4)")
# shout: Simon lying in the sleeping bag before he hears it
R("let fg=A({...SIMON,x:380,y:1080,s:.62,rot:lerp(-75,0,up),sit:up>.5,","let fg=up<.05?lying({...SIMON,x:420,y:1010,s:.62,eyes:'closed',mouth:'line'},.62):A({...SIMON,x:380,y:1080,s:.62,rot:lerp(-60,0,up),sit:up>.5,")
# friends: remove the white block
R("+`<rect x=\"470\" y=\"880\" width=\"70\" height=\"130\" rx=\"10\" fill=\"#f3efe6\" stroke=\"#c9c2b0\" stroke-width=\"4\"/>`;",";")
open(p,'w').write(c); print('ok')

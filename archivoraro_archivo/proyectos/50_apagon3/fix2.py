p='scenes_new.js'; c=open(p).read()
R=[
("s+=literBottle(380,1040,.9,{})+bleachK(800,1040,1,{ok});","s+=literBottle(720,1040,.9,{})+bleachK(330,1040,1,{ok});"),
("s+=`<g transform=\"translate(380,${(500-dy*20).toFixed(0)})\">","const out=eIO(prog(t,E.wait-.3,E.wait+.3));\n  s+=`<g transform=\"translate(720,${(560-dy*20-out*500).toFixed(0)})\">"),
("s+=`<ellipse cx=\"380\" cy=\"${(560+p*170).toFixed(0)}\"","s+=`<ellipse cx=\"720\" cy=\"${(620+p*110).toFixed(0)}\""),
("else s+=`<ellipse cx=\"380\" cy=\"${(745+","else s+=`<ellipse cx=\"720\" cy=\"${(745+"),
("s+=handIn(410,400,-35,.8);","s+=handIn(750,450-out*500,-35,.8);"),
("let o=cam(s,lerp(1.06,1.0,prog(t,E.drops-.25,D)),560,680,540,600);","let o=cam(s,lerp(1.38,1.3,prog(t,E.drops-.25,D)),540,800,540,600);"),
("if(d1) o+=countPop(d2?'2 GOTAS':'1 GOTA',600,560,80,","if(d1&&t<E.wait) o+=countPop(d2?'2 GOTAS':'1 GOTA',330,470,90,"),
("if(ok&&t<E.wait) o+=tag(800,450,'SIN PERFUME'","if(ok&&t<E.wait) o+=tag(300,580,'SIN PERFUME'"),
("if(t>E.wait-.1){o+=stopwatch(800,380,.75,","if(t>E.wait-.1){o+=stopwatch(780,330,.75,"),
("if(t>E.half) o+=countPop('30 MIN',800,550,80,","if(t>E.half) o+=countPop('30 MIN',780,500,90,"),
("if(t>E.six) o+=countPop('+6 L',720,470,150,","if(t>E.six) o+=countPop('+6 L',300,480,130,"),
("o+=tag(540,470,'INFECCIONES'","o+=tag(800,620,'INFECCIONES'"),
]
for a,b in R:
    assert a in c, a[:70]; c=c.replace(a,b)
open(p,'w').write(c); print('ok')

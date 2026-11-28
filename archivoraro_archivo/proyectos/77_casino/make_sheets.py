import json
# A: reparto
names=[('JUG','TÚ · el jugador'),('DIR','el director del casino'),('CIEN','la científica'),('SER1','jugador serio'),('SER2','jugadora seria'),('CROU','croupier'),('CLI1','cliente 1'),('CLI2','cliente 2'),('CLI3','cliente 3')]
cells=[]
for i,(n,l) in enumerate(names):
    cx=(i%3)*540; cy=(i//3)*640
    cells.append(dict(x=cx+10,y=cy+10,w=520,h=620,label=l,ls=36,labelTop=True,items=[dict(n=n,x=cx+270,y=cy+585,s=.74,pose=dict(turn=.15))]))
json.dump(dict(w=1620,h=1920,cells=cells),open('spec_cast.json','w'))
# B: expresiones del jugador
E=[('open','smile',.1,0,'entra confiado'),('shock','gasp',.9,0,'sorpresa'),('wary','tsk',.3,-.3,'sospecha'),('stars','cheer',.5,0,'fascinado'),
   ('hypno','pout',0,0,'hipnotizado'),('tired','yawn',-.2,.1,'cansado'),('sly','half',.2,0,'listillo'),('dreamy','smile',.4,0,'en las nubes'),
   ('up','line',.2,.2,'pensando'),('angry','teeth',-.7,0,'¡he perdido!'),('happy','laugh',.5,0,'ha ganado'),('wide','worry',.6,-.8,'preocupado')]
cells=[]
for i,(f,m,br,bt,l) in enumerate(E):
    cx=(i%4)*400; cy=(i//4)*400
    cells.append(dict(x=cx+8,y=cy+8,w=384,h=384,label=l,ls=30,labelTop=True,items=[dict(n='JUG',x=cx+192,y=cy+215+470*1.18,s=1.18,pose=dict(face=f,mouth=m,brows=br,browTilt=bt,turn=.1,bags=(f=='tired'),sweat=(m=='worry'),look=[6,-6] if f=='up' else [0,0]))]))
json.dump(dict(w=1600,h=1200,cells=cells),open('spec_expr.json','w'))
# C: caras del resto del reparto (3 expresiones cada uno)
H=[('DIR',[('open','smile',0,0),('shock','gasp',.8,0),('sly','half',.2,0)],'el director'),
   ('CIEN',[('open','smile',.2,0),('up','line',.2,.2),('wide','cheer',.6,0)],'la científica'),
   ('SER1',[('smug','line',0,0),('tired','yawn',-.2,.1),('angry','teeth',-.7,0)],'jugador serio'),
   ('SER2',[('smug','smirk',.1,0),('dreamy','smile',.4,0),('wary','tsk',.3,-.3)],'jugadora seria'),
   ('CROU',[('open','line',0,0),('sly','half',.2,0),('shock','o',.8,0)],'croupier'),
   ('CLI2',[('happy','laugh',.5,0),('wide','gasp',.7,0),('hypno','pout',0,0)],'clienta')]
cells=[]
for i,(n,L,lab) in enumerate(H):
    for j,(f,m,br,bt) in enumerate(L):
        cx=i*270; cy=j*320
        cells.append(dict(x=cx+6,y=cy+6,w=258,h=308,label=lab if j==0 else None,ls=26,labelTop=True,items=[dict(n=n,x=cx+129,y=cy+170+470*.92,s=.92,pose=dict(face=f,mouth=m,brows=br,browTilt=bt,turn=.1))]))
json.dump(dict(w=1620,h=960,cells=cells),open('spec_heads.json','w'))

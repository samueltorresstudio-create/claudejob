p='scenes.js'; c=open(p).read()
def R(a,b):
    global c
    assert a in c, a[:70]; c=c.replace(a,b)
# hook: Joe's silhouette far below on the rope, revealed at "amigo"
R("  ropeOverLip(t,{jerk,dip:dr?12:0});\n  if(kq>0)","  if(t>E.friend-.3){const a=P(t,E.friend-.3,.6)*.85;X.save();X.globalAlpha=a;X.filter='blur(1.5px)';figure({x:LX+44+Math.sin(t*1.2)*6,y:1960,s:.32,dir:1,...POSE.hang(t)},{...JOE,rim:'rgba(255,190,160,.4)'});X.restore();\n    X.save();X.globalAlpha=.5*a;const g=X.createLinearGradient(0,1700,0,2100);g.addColorStop(0,'rgba(10,10,30,0)');g.addColorStop(1,'rgba(10,10,30,.9)');X.fillStyle=g;X.fillRect(LX-200,1700,500,500);X.restore();}\n  ropeOverLip(t,{jerk,dip:dr?12:0});\n  if(kq>0)")
R("const z=lerp(1.12,1.32,eIO(prog(t,0,D))), kq=eOut(prog(t,E.q-.5,E.q+.4));\n  cam(z,lerp(560,620,prog(t,0,D)),lerp(1120,1080,prog(t,0,D)),",
  "const tilt=eIO(prog(t,E.friend-.4,E.friend+.5))*(1-eIO(prog(t,E.drag-.2,E.drag+.4)));const z=lerp(1.12,1.32,eIO(prog(t,0,D)))-tilt*.12, kq=eOut(prog(t,E.q-.5,E.q+.4));\n  cam(z,lerp(560,620,prog(t,0,D))+tilt*120,lerp(1120,1080,prog(t,0,D))+tilt*520,")
# mountain: faceted peak instead of stripes
i=c.index("  X.save();poly(PK)();X.clip();\n  for(const [a,b,c] of"); j=c.index("  X.save();X.beginPath();jag(peak,12,24,9)")
c=c[:i]+"""  X.save();poly(PK)();X.clip();
  // shaded west face, lit east face, ridges and rock outcrops
  X.fillStyle='rgba(30,30,90,.42)';poly([[560,600],[430,800],[260,1020],[60,1300],[-260,1700],[-260,2400],[520,2400],[600,1400],[540,900]])();X.fill();
  X.fillStyle='rgba(255,170,120,.16)';poly([[560,600],[640,720],[760,880],[900,1100],[1100,1300],[1400,1650],[1400,2400],[700,2400],[640,1300]])();X.fill();
  X.strokeStyle='rgba(255,255,255,.55)';X.lineWidth=4;X.beginPath();X.moveTo(560,600);X.quadraticCurveTo(530,1000,600,1400);X.stroke();
  X.strokeStyle='rgba(20,20,60,.35)';X.lineWidth=3;for(let i=0;i<9;i++){const x=200+i*90;X.beginPath();X.moveTo(x,1100+hsh(i,3)*200);X.quadraticCurveTo(x+30,1300,x+10,1700);X.stroke();}
  for(let i=0;i<6;i++){const x=300+i*110+hsh(i,5)*40,y=900+hsh(i,6)*400;texFill(poly(jag([[x,y],[x+40,y+60],[x+10,y+140],[x-30,y+70]],6,14,i)),'rock',x-60,y-20,160,200,t,{amp:0,tint:'#1a0c20',tintA:.55});}
  X.restore();
"""+c[j:]
# stuck: closer on Joe
R("cam(1.25,lerp(EDGE.jx-40,EDGE.sx+160,up),lerp(EDGE.jy-220,EDGE.sy+40,up));","cam(lerp(1.9,1.5,up),lerp(EDGE.jx,EDGE.sx+140,up),lerp(EDGE.jy-150,EDGE.sy+20,up));")
# friends: arm round the shoulder
R("figure({x:640,y:1400,s:.62,dir:-1,...POSE.sitRock(),aF:t>E.blame?120:44,eF:t>E.blame?20:66},{...back,hat:'#2a1e14'});","figure({x:640,y:1400,s:.62,dir:-1,...POSE.sitRock(),aF:lerp(44,96,P(t,E.blame,.6)),eF:lerp(66,40,P(t,E.blame,.6)),hd:lerp(8,22,P(t,E.blame,.6))},{...back,hat:'#2a1e14'});")
# fire: nicer tents
R("for(const [x,y,s,lit] of [[880,1440,1.0,.6],[200,1400,.7,0]]){X.save();X.translate(x,y);X.scale(s,s);X.fillStyle=lit?'#e8a43a':'#8a5a2a';X.beginPath();X.moveTo(-150,0);X.lineTo(0,-170);X.lineTo(150,0);X.fill();",
  "for(const [x,y,s,lit] of [[880,1440,1.0,.6],[200,1400,.7,0]]){X.save();X.translate(x,y);X.scale(s,s);X.strokeStyle='rgba(200,180,140,.35)';X.lineWidth=2;X.beginPath();X.moveTo(0,-170);X.lineTo(-230,10);X.moveTo(0,-170);X.lineTo(230,10);X.stroke();X.fillStyle=lit?'#e8a43a':'#8a5a2a';X.beginPath();X.moveTo(-150,0);X.quadraticCurveTo(-60,-90,0,-170);X.quadraticCurveTo(60,-90,150,0);X.fill();X.fillStyle=lit?'#ffd78a':'#3a2414';X.beginPath();X.moveTo(-30,0);X.lineTo(0,-110);X.lineTo(30,0);X.fill();")
open(p,'w').write(c);print('ok')

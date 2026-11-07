// ================= LA CUERDA · estilo SUCESOS (canvas, siluetas sin rostro, texturas pintadas) =================
const EVS={
  hook:B=>({rope:B[0].w[2],friend:B[0].w[8],drag:B[0].w[10],q:B[0].w[13]}),
  mountain:B=>({joe:B[0].w[2],simon:B[0].w[4],mount:B[0].w[8],six:B[0].w[10]}),
  fall:B=>({slip:B[0].w[1],brk:B[0].w[4]}),
  lower:B=>({low:B[0].w[2],stages:B[0].w[5],storm:B[0].w[9]}),
  edge:B=>({edge:B[0].w[7],hang:B[0].w[11],voidw:B[0].w[14]}),
  stuck:B=>({up:B[0].w[3],down:B[0].w[7],l2:B[1].s,snow:B[1].w[2],give:B[1].w[9]}),
  hour:B=>({hour:B[0].w[3]}),
  cut:B=>({knife:B[0].w[4],cut:B[0].w[6]}),
  crevasse:B=>({fall:B[0].w[1],crev:B[0].w[5]}),
  alone:B=>({dead:B[0].w[4],back:B[0].w[6]}),
  alive:B=>({alive:B[0].w[3]}),
  light:B=>({deep:B[0].w[3],exit:B[0].w[7],light:B[0].w[10]}),
  distance:B=>({km:B[0].w[2],food:B[0].w[5],leg:B[0].w[8]}),
  crawl:B=>({}),
  watch:B=>({watch:B[0].w[2],goal:B[0].w[7],rock:B[0].w[11],twenty:B[0].w[13],other:B[0].w[17]}),
  days:B=>({}),
  fire:B=>({burn:B[0].w[6],clothes:B[0].w[8],dawn:B[0].w[10]}),
  shout:B=>({dark:B[0].w[4],hear:B[0].w[5],shout:B[0].w[8]}),
  joe:B=>({joe:B[0].w[1]}),
  friends:B=>({blame:B[0].w[2],same:B[0].w[9]}),
  you:B=>({}),
};
const S={};
const JOE={jacket:'#a1301f',pants:'#1b1d27',head:'#2a2421',hair:'#140f0c',rim:'rgba(255,196,170,.6)',harness:'#e2662a'};
const SIM={jacket:'#2b5498',pants:'#1b1d27',head:'#272b38',hat:'#e2ad24',rim:'rgba(186,210,255,.65)',pack:'#3d4a2c',harness:'#e2662a'};
const RICH={jacket:'#3f6a38',pants:'#1b1d27',head:'#2a2723',hat:'#7a2a24',rim:'rgba(255,170,110,.6)'};
const w2s=(x,y,z,cx,cy)=>[540+(x-cx)*z,960+(y-cy)*z];

// ---------- shared sets ----------
function stormSky(t,o={}){tex('storm',-140,-140,1360,2200,t,{amp:16,sp:.5});
  shadeRect(-140,-140,1360,2200,`rgba(0,0,12,${o.top??.15})`,`rgba(0,0,8,${o.bot??.75})`);}
// the snow cornice + rope (macro): lip at (LX,LY). o.knife 0..1, o.cut 0..1, o.jerk, o.zoomed
const LX=780,LY=1240;
function corniceBg(t,o={}){
  stormSky(t,{top:.25,bot:.85});
  // far ice wall (out of focus)
  X.save();X.filter='blur(5px)';texFill(poly([[1180,500],[900,700],[960,1100],[880,1500],[980,2100],[1300,2100]]),'ice',820,400,520,1800,t,{amp:6,tint:'#000814',tintA:.55});X.restore();
  streaks(t,{n:40,a:.25,ang:.5});
  // the cornice
  const top=jag([[-200,980],[120,1010],[420,1060],[640,1130],[LX,LY]],10,30,3);
  const shape=[...top,[LX+18,LY+40],[LX-10,LY+120],[LX-40,LY+260],[LX-30,2200],[-200,2200]];
  texFill(poly(shape),'snow',-220,900,1100,1400,t*.2,{amp:2,shade:[0,1000,0,2100],shadeA:.75});
  X.save();X.beginPath();top.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.strokeStyle='rgba(235,245,255,.95)';X.lineWidth=7;X.shadowColor='#cfe6ff';X.shadowBlur=18;X.stroke();X.restore();
  // blue shade under the lip
  X.save();poly(shape)();X.clip();const g=X.createLinearGradient(LX-200,0,LX+20,0);g.addColorStop(0,'rgba(20,40,90,0)');g.addColorStop(1,'rgba(20,40,90,.6)');X.fillStyle=g;X.fillRect(LX-260,LY-40,300,1000);X.restore();
  // glitter
  const r=rng(31);X.save();X.globalCompositeOperation='lighter';for(let i=0;i<40;i++){const x=-100+r()*820,y=1000+r()*500,a=Math.max(0,Math.sin(t*3+i*1.7));X.globalAlpha=a*.8;X.fillStyle='#fff';X.fillRect(x,y,3,3);}X.restore();
}
function knife(x,y,s,open,rot,t){X.save();X.translate(x,y);X.rotate(rot*D2R);X.scale(s,s);
  X.save();X.rotate(-(1-open)*165*D2R);const g=X.createLinearGradient(0,-14,0,14);g.addColorStop(0,'#f4f7fb');g.addColorStop(.5,'#9aa4b0');g.addColorStop(1,'#dfe6ee');
  X.beginPath();X.moveTo(40,-12);X.lineTo(250,-6);X.quadraticCurveTo(272,4,248,12);X.lineTo(40,12);X.closePath();X.fillStyle=g;X.fill();X.strokeStyle='rgba(0,0,0,.35)';X.lineWidth=2;X.stroke();
  if(open>.9){X.globalCompositeOperation='lighter';const gx=120+Math.sin(t*2)*90;glow(gx,-4,60,'rgba(255,255,255,.9)',.8);}X.restore();
  rr(-120,-28,180,56,24);const h=X.createLinearGradient(0,-28,0,28);h.addColorStop(0,'#e8404a');h.addColorStop(1,'#8e1218');X.fillStyle=h;X.fill();
  X.fillStyle='#fff';X.fillRect(-40,-5,22,10);X.fillRect(-34,-11,10,22);X.beginPath();X.arc(36,0,7,0,7);X.fillStyle='#b8c0ca';X.fill();X.restore();}
function mitten(x,y,s,rot,col='#14161d',sleeve=SIM.jacket){X.save();X.translate(x,y);X.rotate(rot*D2R);X.scale(s,s);
  X.shadowColor='rgba(186,210,255,.6)';X.shadowOffsetX=-3;X.shadowOffsetY=-3;X.shadowBlur=3;
  rr(30,-56,520,112,52);X.fillStyle=sleeve;X.fill();X.shadowColor='transparent';
  X.globalAlpha=.25;for(let k=1;k<5;k++){X.beginPath();X.moveTo(30+k*100,-56);X.quadraticCurveTo(14+k*100,0,30+k*100,56);X.strokeStyle='#000';X.lineWidth=4;X.stroke();}X.globalAlpha=1;
  rr(10,-62,60,124,22);X.fillStyle='#0c0d12';X.fill();
  X.beginPath();X.ellipse(-40,0,86,70,0,0,7);X.fillStyle=col;X.fill();X.beginPath();X.ellipse(-20,-62,40,26,-.4,0,7);X.fill();
  X.globalAlpha=.2;X.beginPath();X.ellipse(-60,-20,40,20,-.4,0,7);X.fillStyle='#fff';X.fill();X.restore();}
function ropeOverLip(t,o={}){ // from upper-left (Simon, off frame) over the lip into the void
  const jig=Math.sin(t*25)*3+(o.jerk||0), ly=LY+(o.dip||0);
  if(!(o.cut>0)){rope([[-80,860],[200,930],[480,1030],[LX-20,ly-8+jig*.5],[LX+14,ly+30],[LX+40,2300]],22,{tw:t*40});
    // groove + snow grains rubbing off the lip
    sparks(t,LX+10,ly+20,{n:14,a0:60,spread:80,v:120,g:600,rate:1.6,col:'#e8f2ff'});}
  else{const k=o.cut;rope([[-80,860],[200,930],[480,1030],[lerp(LX-120,LX-260,eOut(k)),lerp(ly-30,ly-200,eOut(k))]],22,{tw:t*40});
    rope([[lerp(LX-60,LX+20,k),lerp(ly+10,ly+700,k*k)],[LX+14,ly+30+k*900],[LX+40,2300+k*1400]],22,{tw:t*40});}
}

// ================= scenes =================
S.hook=(X_,t,D,B)=>{const E=EVS.hook(B), dr=t>E.drag, jerk=dr&&t<E.drag+.6?Math.sin((t-E.drag)*38)*16*(1-prog(t,E.drag,E.drag+.6)):0;
  const tilt=eIO(prog(t,E.friend-.4,E.friend+.5))*(1-eIO(prog(t,E.drag-.2,E.drag+.4)));const z=lerp(1.12,1.32,eIO(prog(t,0,D)))-tilt*.12, kq=eOut(prog(t,E.q-.5,E.q+.4));
  cam(z,lerp(560,620,prog(t,0,D))+tilt*120,lerp(1120,1080,prog(t,0,D))+tilt*520,shake(t,dr?14*(1-prog(t,E.drag,E.drag+.8)):2));
  corniceBg(t);
  // a chunk of the cornice breaks off on the jerk
  if(dr){const k=prog(t,E.drag,E.drag+1.4);X.save();X.translate(LX-30,LY+40+k*k*900);X.rotate(k*2.4);texFill(poly([[-50,-30],[40,-40],[60,20],[-10,50],[-60,10]]),'snow',-80,-60,160,120,0,{amp:0,shade:[0,-40,0,50]});X.restore();
    burst(prog(t,E.drag,E.drag+.9),LX,LY+30,{n:30,a0:20,spread:140,v:300,g:900,r:5});}
  if(t>E.friend-.3){const a=P(t,E.friend-.3,.6)*.85;X.save();X.globalAlpha=a;X.filter='blur(1.5px)';figure({x:LX+44+Math.sin(t*1.2)*6,y:1960,s:.32,dir:1,...POSE.hang(t)},{...JOE,rim:'rgba(255,190,160,.4)'});X.restore();
    X.save();X.globalAlpha=.5*a;const g=X.createLinearGradient(0,1700,0,2100);g.addColorStop(0,'rgba(10,10,30,0)');g.addColorStop(1,'rgba(10,10,30,.9)');X.fillStyle=g;X.fillRect(LX-200,1700,500,500);X.restore();}
  ropeOverLip(t,{jerk,dip:dr?12:0});
  if(kq>0){mitten(lerp(1350,860,kq),lerp(700,860,kq),.9,24);knife(lerp(1200,700,kq),lerp(640,830,kq),.9,clamp(kq*1.4-.3),205,t);}
  snow(t,{n:70,wind:.5,sp:220,a:.7});
};

S.mountain=(X_,t,D,B)=>{const E=EVS.mountain(B);
  const kin=1-eIO(prog(t,E.mount-.3,E.mount+.8));const z=lerp(1.0,4.2,kin)*(1+.03*t), cx=lerp(540,600,kin), cy=lerp(1000,800,kin);
  cam(z,cx,cy);
  tex('dawn',-200,-300,1480,2600,t,{amp:6,sp:.3});glow(560,700,700,'rgba(255,190,140,.55)',.8);
  // far ranges
  X.fillStyle='#3a2c5a';poly(jag([[-300,1250],[0,1000],[200,1120],[380,980],[700,1180],[900,1020],[1400,1260],[1400,2400],[-300,2400]],16,30,5))();X.fill();
  X.fillStyle='rgba(60,40,90,.6)';X.fillRect(-300,1000,1800,1400);
  // Siula Grande
  const peak=[[-260,1700],[60,1300],[260,1020],[430,800],[560,600],[640,720],[760,880],[900,1100],[1100,1300],[1400,1650]];
  const PK=[...jag(peak,12,24,9),[1400,2400],[-260,2400]];
  texFill(poly(PK),'snow',-300,560,1760,1900,t*.1,{amp:0,shade:[300,600,900,1500],shadeA:.45});
  X.save();poly(PK)();X.clip();
  // shaded west face, lit east face, ridges and rock outcrops
  X.fillStyle='rgba(30,30,90,.42)';poly([[560,600],[430,800],[260,1020],[60,1300],[-260,1700],[-260,2400],[520,2400],[600,1400],[540,900]])();X.fill();
  X.fillStyle='rgba(255,170,120,.16)';poly([[560,600],[640,720],[760,880],[900,1100],[1100,1300],[1400,1650],[1400,2400],[700,2400],[640,1300]])();X.fill();
  X.strokeStyle='rgba(255,255,255,.55)';X.lineWidth=4;X.beginPath();X.moveTo(560,600);X.quadraticCurveTo(530,1000,600,1400);X.stroke();
  X.restore();
  X.save();X.beginPath();jag(peak,12,24,9).forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.strokeStyle='rgba(255,236,220,.9)';X.lineWidth=3;X.shadowColor='#ffd9c0';X.shadowBlur=10;X.stroke();X.restore();
  // climbers on the ridge, roped, going down
  const k=prog(t,0,D);const ax=lerp(612,640,k), ay=lerp(700,742,k);
  const sj={x:ax+30,y:ay+58,s:.07,dir:1,...POSE.descend(t*4)}, ss={x:ax-8,y:ay+4,s:.07,dir:1,...POSE.descend(t*4+1)};
  rope(sag(ss.x+3,ss.y-2,sj.x-3,sj.y-2,4,8),1.6,{tw:0});figure(ss,SIM);figure(sj,JOE);
  // clouds drifting over the lower slopes
  X.save();for(let i=0;i<7;i++){const x=((i*260+t*30)%1800)-400,y=1250+(i%3)*90;X.globalAlpha=.55;const g=X.createRadialGradient(x,y,10,x,y,260);g.addColorStop(0,'rgba(255,230,230,.9)');g.addColorStop(1,'rgba(255,230,230,0)');X.fillStyle=g;X.fillRect(x-260,y-120,520,240);}X.restore();
  snow(t,{n:40,sp:60,a:.5,r:2});
  // scale: Siula Grande ≈ almost two Teides (3.715 m) stacked
  if(t>E.mount){const kk=prog(t,E.mount,E.six+.3), base=1560, th=(base-600)*3715/6344, tx=890;
    X.save();X.strokeStyle='#ffd36a';X.shadowColor='#ffb84a';X.shadowBlur=14;X.lineWidth=4;X.lineJoin='round';
    for(let i=0;i<2;i++){const a=clamp(kk*2-i);if(a<=0) continue;const y0=base-i*th, h=th*eOut(a);X.globalAlpha=.9;
      X.beginPath();X.moveTo(tx-120,y0);X.quadraticCurveTo(tx-56,y0-h*.45,tx-22,y0-h);X.lineTo(tx-8,y0-h*.97);X.lineTo(tx+8,y0-h*.97);X.lineTo(tx+22,y0-h);X.quadraticCurveTo(tx+56,y0-h*.45,tx+120,y0);X.stroke();
      X.setLineDash([8,10]);X.beginPath();X.moveTo(tx-140,y0-h);X.lineTo(tx-30,y0-h);X.stroke();X.setLineDash([]);}
    X.restore();}
  if(kin>.6){const [jx,jy]=w2s(sj.x,sj.y-20,z,cx,cy),[sx,sy]=w2s(ss.x,ss.y-20,z,cx,cy);label(sx-80,sy-190,'Simon',P(t,E.simon,.25),{col:'#8cc0ff'});label(jx+90,jy-150,'Joe',P(t,E.joe,.25),{col:'#ff9a7a'});}
  if(t<E.joe-.3) pill(540,1560,'Perú','1985',P(t,.1,.4),{fs:84});
  if(t>E.six) pill(400,1500,'6.344','metros',P(t,E.six,.35));
  if(t>E.six+.4) label(800,1720,'Casi 2 Teides',P(t,E.six+.4,.3),{col:'#ffd36a'});
};

function slopeY(x){return 760+(x+100)*.6;}
S.fall=(X_,t,D,B)=>{const E=EVS.fall(B);
  const u=prog(t,E.slip-.2,E.brk), landed=t>=E.brk, xr=prog(t,E.brk+.25,E.brk+.6);
  const jx=landed?820:lerp(260,820,eIn(u)*.85+u*.15), jy=slopeY(jx);
  const z=lerp(1.25,1.12,u), cx=lerp(380,700,eIO(u)), cy=slopeY(cx)-200;
  cam(z,cx,cy,shake(t,landed?20*(1-prog(t,E.brk,E.brk+.6)):0));
  stormSky(t,{top:.1,bot:.6});
  X.fillStyle='#2a2448';poly(jag([[-400,900],[100,700],[300,820],[600,640],[900,840],[1500,700],[1500,1400],[-400,1400]],18,30,12))();X.fill();
  streaks(t,{n:30,a:.3});
  // the ice slope + a step where he stops
  const top=jag([[-400,slopeY(-400)],[860,slopeY(860)],[880,slopeY(860)+40],[1600,slopeY(1600)+40]],6,30,4);
  texFill(poly([...top,[1600,2600],[-400,2600]]),'ice',-420,500,2100,2200,t*.2,{amp:3,tint:'#e8f4ff',tintA:.25,shade:[0,900,0,1900],shadeA:.7});
  X.save();X.beginPath();top.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.strokeStyle='rgba(230,248,255,.9)';X.lineWidth=5;X.shadowColor='#bfe8ff';X.shadowBlur=14;X.stroke();X.restore();
  // Joe: careful steps, slip, tumble down the slope, impact
  if(t<E.slip-.2) figure({x:jx,y:jy-ground(.5)+6,s:.5,dir:1,rot:-14,...POSE.descend(t*5)},JOE);
  else if(!landed){const spin=-u*u*520;for(let g=3;g>=1;g--){const uu=Math.max(0,u-g*.025),gx=lerp(260,820,eIn(uu)*.85+uu*.15);X.save();X.globalAlpha=.12*g;figure({x:gx,y:slopeY(gx)-50,s:.5,dir:1,rot:spin+g*18,...POSE.tumble(t-g*.03,3)},JOE);X.restore();}
    figure({x:jx,y:jy-50,s:.5,dir:1,rot:u<.15?lerp(-14,-80,u/.15):spin,...(u<.15?POSE.slip(u/.15):POSE.tumble(t,3))},JOE);
    burst((u*3)%1,jx,jy,{n:16,a0:180,spread:90,v:200,g:300,r:4,seed:Math.floor(u*3)});}
  else{figure({x:820,y:slopeY(820)-24,s:.5,dir:-1,rot:90-31,...POSE.lieBack(),lF:-46,kF:70,hd:-20},JOE);
    puffAt(prog(t,E.brk,E.brk+.7),820,slopeY(820),70);burst(prog(t,E.brk,E.brk+.8),820,slopeY(820),{n:34,a0:-170,spread:160,v:420,g:700});}
  snow(t,{n:50,sp:180,wind:.6,a:.6});
  if(landed){X.setTransform(1,0,0,1,0,0);X.fillStyle=`rgba(255,255,255,${(.5*(1-prog(t,E.brk,E.brk+.15))).toFixed(2)})`;X.fillRect(0,0,W,H);
    monitor(540,1420,700,400,xr,(w,h)=>{ // x-ray: knee joint with the shin driven up
      X.strokeStyle='#d8ecff';X.lineCap='round';X.shadowColor='#9fd2ff';X.shadowBlur=18;X.lineWidth=46;X.beginPath();X.moveTo(-40,-h/2-20);X.lineTo(-12,-30);X.stroke();X.lineWidth=40;X.beginPath();X.moveTo(-6,-6);X.lineTo(30,h/2);X.stroke();
      X.beginPath();X.arc(-12,-24,36,0,7);X.fillStyle='#d8ecff';X.fill();X.shadowColor='#ff3a4a';X.strokeStyle='#ff4a5a';X.lineWidth=7;X.beginPath();X.moveTo(-60,10);X.lineTo(-20,-6);X.lineTo(-30,20);X.lineTo(14,6);X.lineTo(0,34);X.lineTo(50,18);X.stroke();},'Pierna rota',.12,'#e8484a');}
};

S.lower=(X_,t,D,B)=>{const E=EVS.lower(B), st=prog(t,E.storm-.6,E.storm+.5);
  const stage=t<E.stages?prog(t,E.low-.3,E.stages)*.6:.6+(t-E.stages)*1.0; const sk=Math.floor(stage), fr=stage-sk;
  const q=clamp((sk+eOut(clamp(fr*1.7)))/3.4);                  // 0..1 down the slope, in pulls
  const sl=x=>620+(x+100)*.7, sx=230, jx=lerp(470,980,q), jy=sl(jx);
  cam(lerp(1.08,1.0,prog(t,0,D)),lerp(420,600,q),lerp(900,1060,q),shake(t,st*3));
  stormSky(t,{top:.2,bot:.7});X.fillStyle=`rgba(5,6,20,${(.25+.35*st).toFixed(2)})`;X.fillRect(-200,-200,1500,2400);
  const top=jag([[-400,sl(-400)],[1600,sl(1600)]],5,30,6);
  texFill(poly([...top,[1600,2600],[-400,2600]]),'snow',-420,300,2100,2400,t*.2,{amp:3,tint:'#203060',tintA:.3,shade:[0,700,0,2000],shadeA:.7});
  X.save();X.beginPath();top.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.strokeStyle='rgba(225,240,255,.85)';X.lineWidth=5;X.stroke();X.restore();
  // Simon's bucket seat
  X.save();X.fillStyle='rgba(10,20,50,.5)';X.beginPath();X.ellipse(sx+10,sl(sx)+6,120,34,.6,0,7);X.fill();X.restore();
  const pull=.5+.5*Math.sin(t*6);
  const sp={x:sx,y:sl(sx)-60,s:.55,dir:1,rot:28,...POSE.seatBraced(pull*.5)};figure(sp,SIM);
  const hp=rigPts(sp).world.hF, jp={x:jx,y:jy-30,s:.55,dir:1,rot:118,...POSE.lieBack()};
  rope([hp,[lerp(hp[0],jx,.5),lerp(hp[1],jy-40,.5)+6],[jx-30,jy-60]],9,{tw:t*30});
  figure(jp,JOE);
  if(fr<.6&&q<1) burst((fr*1.6)%1,jx+40,jy,{n:10,a0:180,spread:60,v:120,g:200,r:4,seed:sk});
  streaks(t,{n:50+Math.round(90*st),a:.35+.4*st,ang:.6,sp:2600});snow(t,{n:60+Math.round(80*st),sp:260,wind:.9,a:.8});
  pill(540,1580,'90','metros de cuerda',P(t,E.low,.35),{fs:76});
  if(t>E.stages){const n=Math.min(3,sk);label(540,1720,`Tramo ${Math.max(1,n)} de 3`,P(t,E.stages,.25),{col:'#ffd36a'});}
};

// tall world for the edge / stuck scenes: Simon's seat at the top, the edge, Joe hanging below
const EDGE={sx:260,sy:560,lx:760,ly:900,jx:820,jy:2050};
function edgeWorld(t,o={}){
  tex('storm',-300,-400,1700,3600,t,{amp:14,sp:.5});shadeRect(-300,-400,1700,3600,'rgba(0,0,10,.15)','rgba(0,0,6,.95)');
  streaks(t,{n:60,a:.35,ang:.55,sp:2600});
  // far ice wall (right)
  X.save();X.filter='blur(4px)';texFill(poly([[1400,600],[1060,900],[1120,1500],[1030,2200],[1120,3200],[1400,3200]]),'ice',1000,500,500,2800,t,{amp:5,tint:'#000814',tintA:.5});X.restore();
  // slope + cornice + ice face below
  const top=jag([[-400,420],[EDGE.sx,EDGE.sy+40],[560,700],[EDGE.lx,EDGE.ly]],8,30,7);
  texFill(poly([...top,[EDGE.lx+30,EDGE.ly+60],[EDGE.lx-30,EDGE.ly+220],[EDGE.lx-20,1300],[EDGE.lx-110,1800],[EDGE.lx-60,2500],[EDGE.lx-140,3400],[-400,3400]]),'ice',-420,300,1300,3200,t*.2,{amp:4,tint:'#06122a',tintA:.4,shade:[0,900,0,3000],shadeA:.75});
  texFill(poly([...top,[EDGE.lx+30,EDGE.ly+60],[EDGE.lx-40,EDGE.ly+110],[400,780],[-400,560]]),'snow',-420,300,1300,700,t*.2,{amp:2,shade:[0,400,0,1000],shadeA:.4});
  X.save();X.beginPath();top.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.strokeStyle='rgba(235,245,255,.95)';X.lineWidth=6;X.shadowColor='#cfe6ff';X.shadowBlur=16;X.stroke();X.restore();
  // the crevasse far below
  const g=X.createRadialGradient(900,3100,40,900,3100,600);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.fillRect(300,2500,1200,1200);
  // Simon
  const sl=o.slide||0, sp={x:EDGE.sx+sl,y:EDGE.sy-30,s:.55,dir:1,rot:18,...POSE.seatBraced(o.pull||0)};
  X.save();X.fillStyle='rgba(10,20,50,.45)';X.beginPath();X.ellipse(EDGE.sx+10,EDGE.sy+40,110,30,.3,0,7);X.fill();X.restore();
  figure(sp,SIM);
  if(o.crack){X.save();X.strokeStyle='rgba(30,50,100,.8)';X.lineWidth=4;for(let i=0;i<6;i++){const L=clamp(o.crack*1.5-i*.12)*120;if(L<=0) continue;X.beginPath();X.moveTo(EDGE.sx-60+i*36,EDGE.sy+40+i*4);X.lineTo(EDGE.sx-60+i*36+(i%2?16:-12),EDGE.sy+40+L*.5);X.lineTo(EDGE.sx-60+i*36+(i%2?4:4),EDGE.sy+40+L);X.stroke();}X.restore();
    burst((t*1.2)%1,EDGE.sx+80,EDGE.sy+50,{n:Math.round(20*o.crack),a0:10,spread:60,v:160,g:600,r:4,seed:Math.floor(t*1.2)});}
  const hp=rigPts(sp).world.hF;
  // Joe hanging, slowly spinning
  const spin=Math.cos(t*.9), jp={x:EDGE.jx+Math.sin(t*1.1)*10,y:EDGE.jy,s:.55,dir:spin>=0?1:-1,...(o.climb?POSE.climbFail(t):POSE.hang(t))};
  const jw=rigPts(jp).world;
  rope([hp,[560,740],[EDGE.lx-6,EDGE.ly-6],[EDGE.lx+16,EDGE.ly+30],[jw.hip[0],jw.hip[1]-10]],12,{tw:t*30});
  X.save();X.translate(jp.x,0);X.scale(Math.max(.35,Math.abs(spin)),1);X.translate(-jp.x,0);figure(jp,JOE);X.restore();
  snow(t,{n:90,sp:240,wind:.8,a:.75,y1:3400});
  return {sp,jp};
}
S.edge=(X_,t,D,B)=>{const E=EVS.edge(B), pan=eIO(prog(t,E.edge-.4,E.hang+.1)), fz=eIO(prog(t,E.hang+.2,E.voidw+.4));
  const cy=lerp(lerp(860,1900,pan),EDGE.jy-130,fz), z=lerp(lerp(1.05,1.0,pan),1.7,fz), cx=lerp(lerp(560,700,pan),EDGE.jx,fz);
  cam(z,cx,cy);edgeWorld(t);
  if(t>E.voidw) pill(540,1640,'Vacío','debajo',P(t,E.voidw,.35),{col:'#ff6a7a',fs:76});
};
S.stuck=(X_,t,D,B)=>{const E=EVS.stuck(B);
  if(t<E.l2-.15){const up=eIO(prog(t,E.up+.1,E.down-.2));cam(lerp(1.9,1.5,up),lerp(EDGE.jx,EDGE.sx+140,up),lerp(EDGE.jy-150,EDGE.sy+20,up));edgeWorld(t,{climb:true,pull:.6+.4*Math.sin(t*5)});
    if(t>E.up-.2&&up<.4) label(540,1660,'No puede subir',P(t,E.up,.25),{col:'#ff8a8a'});
    if(t>E.down-.2) label(540,1660,'No puede bajar',P(t,E.down,.25),{col:'#ff8a8a'});return;}
  const g=prog(t,E.snow-.2,D+.3);
  cam(lerp(1.5,1.7,prog(t,E.l2,D)),EDGE.sx+120+g*30,EDGE.sy+30,shake(t,t>E.give?5:1.5));edgeWorld(t,{slide:g*60,crack:g,pull:1});
  monitor(540,1460,740,420,P(t,E.l2+.1,.4),(w,h)=>{ // the snow seat in cross-section, cracking
    X.fillStyle='#e8f2ff';X.beginPath();X.moveTo(-w/2,40);X.quadraticCurveTo(0,-90,w/2,40);X.lineTo(w/2,h/2);X.lineTo(-w/2,h/2);X.fill();
    X.strokeStyle='#2a3a6a';X.lineWidth=5;for(let i=0;i<5;i++){const L=clamp(g*1.5-i*.15)*140;if(L<=0) continue;X.beginPath();X.moveTo(-120+i*60,-10+Math.abs(i-2)*12);X.lineTo(-110+i*60+(i%2?18:-14),-10+L*.5);X.lineTo(-120+i*60,-10+L);X.stroke();}
    X.fillStyle='#14161d';X.beginPath();X.arc(0,-120,30,0,7);X.fill();rr(-40,-92,80,90,30);X.fill();},'La nieve aguanta',1-g*.92);
};

S.hour=(X_,t,D,B)=>{const E=EVS.hour(B), k=prog(t,0,D+.3);
  cam(1.9,EDGE.sx+120,EDGE.sy-10);edgeWorld(t*3,{pull:.4});
  // snow piling up on him
  X.save();X.fillStyle='#eef4ff';X.globalAlpha=.9;const sp=rigPts({x:EDGE.sx,y:EDGE.sy-30,s:.55,dir:1,rot:18,...POSE.seatBraced(.4)}).world;
  X.beginPath();X.ellipse(sp.head[0],sp.head[1]-24,30*k+4,10*k+2,.3,0,7);X.fill();X.beginPath();X.ellipse(sp.sh[0]-6,sp.sh[1]-10,34*k+4,10*k+2,.3,0,7);X.fill();X.restore();
  X.setTransform(1,0,0,1,0,0);X.fillStyle=`rgba(0,0,15,${(.35*k).toFixed(2)})`;X.fillRect(0,0,W,H);
  // clock ring
  X.save();X.translate(540,1440);X.globalAlpha=.9;X.strokeStyle='rgba(255,255,255,.18)';X.lineWidth=16;X.beginPath();X.arc(0,0,190,0,7);X.stroke();
  X.strokeStyle='#ffcf4a';X.shadowColor='#ffb84a';X.shadowBlur=20;X.beginPath();X.arc(0,0,190,-Math.PI/2,-Math.PI/2+k*Math.PI*2);X.stroke();X.restore();
  pill(540,1440,'≈ 1','hora',P(t,E.hour-.6,.35),{fs:96});
};

S.cut=(X_,t,D,B)=>{const E=EVS.cut(B), kn=prog(t,0,E.knife+.2), cu=prog(t,E.cut,E.cut+.7), saw=prog(t,E.cut-.6,E.cut);
  const z=lerp(1.35,1.75,eIO(prog(t,0,E.cut)));cam(z,lerp(640,LX-80,prog(t,0,E.cut)),lerp(1060,LY-150,prog(t,0,E.cut)),shake(t,t>E.cut?24*(1-cu):0));
  corniceBg(t);
  ropeOverLip(t,{cut:t>E.cut?cu:0});
  // the strands parting under the blade
  if(t<E.cut&&saw>0){const bx=LX-150,by=LY-90;for(let i=0;i<5;i++){if(saw*5<i) continue;X.save();X.strokeStyle='#ffb25a';X.lineWidth=3;X.beginPath();X.moveTo(bx+i*6,by-10);X.quadraticCurveTo(bx+i*6+10,by-26,bx+i*6+4,by-36);X.stroke();X.restore();}}
  const kx=lerp(1260,LX-150,eOut(kn))+(saw>0?Math.sin(t*30)*14*saw:0), ky=lerp(620,LY-120,eOut(kn));
  if(t<E.cut+.4){mitten(kx+170,ky-40,.95,30);knife(kx,ky,.95,clamp(prog(t,E.knife-.6,E.knife+.1)),200,t);}
  else{const a=prog(t,E.cut+.4,E.cut+1);mitten(kx+170+a*300,ky-40-a*200,.95,30+a*20);}
  if(t>E.cut&&t<E.cut+.12){X.setTransform(1,0,0,1,0,0);X.fillStyle='rgba(255,255,255,.85)';X.fillRect(0,0,W,H);}
  if(t>E.cut) burst(prog(t,E.cut,E.cut+.9),LX-60,LY,{n:40,a0:-180,spread:360,v:420,g:500,r:5});
  snow(t,{n:70,wind:.5,sp:220,a:.7});
};

S.crevasse=(X_,t,D,B)=>{const E=EVS.crevasse(B), f=prog(t,E.fall-.4,D-.45), land=t>D-.45, Y=jy=>lerp(0,4300,eIn(jy));
  const jy=Y(f), camy=land?4300-300:jy+120;
  cam(1.0,540,camy,shake(t,land?26*(1-prog(t,D-.45,D)):3));
  X.fillStyle='#01040c';X.fillRect(-200,camy-1100,1500,2300);
  // far walls (parallax 0.6) and near walls
  X.save();X.translate(0,camy*.4);for(const side of [-1,1]){const xs=side<0?[-300,330]:[750,1400];const pts=[];for(let y=-1000;y<=6000;y+=180) pts.push([side<0?330+Math.sin(y*.01)*40:750+Math.cos(y*.013)*40,y]);
    texFill(poly(side<0?[[-300,-1000],...pts,[-300,6000]]:[[1400,-1000],...pts,[1400,6000]]),'ice',xs[0],-1000,xs[1]-xs[0]+200,7000,t,{amp:6,tint:'#000814',tintA:.7});}X.restore();
  for(const side of [-1,1]){const pts=jag(Array.from({length:30},(_,i)=>[side<0?250+noise1(i*.7,3)*70:830+noise1(i*.7,5)*70,-800+i*200]),18,40,side<0?1:2);
    texFill(poly(side<0?[[-400,-800],...pts,[-400,5600]]:[[1500,-800],...pts,[1500,5600]]),'ice',side<0?-400:700,-800,800,6400,t,{amp:4,tint:'#06122a',tintA:.3});
    X.save();X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.strokeStyle='rgba(170,230,255,.75)';X.lineWidth=4;X.shadowColor='#8fd8ff';X.shadowBlur=12;X.stroke();X.restore();}
  // the ice bridge
  texFill(poly([[220,4420],[540,4380],[860,4420],[860,4480],[540,4450],[220,4480]]),'snow',200,4350,700,160,0,{amp:0});
  beam(540,camy-1300,90,1600,10,'rgba(160,210,255,.35)',.6);
  if(!land){for(let g=4;g>=1;g--){X.save();X.globalAlpha=.1*g;figure({x:540+Math.sin((t-g*.04)*3)*60,y:Y(Math.max(0,f-g*.02)),s:.55,rot:(t-g*.04)*420,...POSE.tumble(t-g*.04,7)},JOE);X.restore();}
    figure({x:540+Math.sin(t*3)*60,y:jy,s:.55,rot:t*420,...POSE.tumble(t,7)},JOE);
    X.save();X.strokeStyle='rgba(200,240,255,.35)';X.lineWidth=3;for(let i=0;i<14;i++){const x=300+i*36,y=jy-400-hsh(i,3)*400;X.beginPath();X.moveTo(x,y);X.lineTo(x,y+180);X.stroke();}X.restore();}
  else{figure({x:560,y:4400,s:.55,dir:1,rot:-90,...POSE.lieBack(),lF:-40,kF:70},JOE);puffAt(prog(t,D-.45,D),540,4420,90);burst(prog(t,D-.45,D),540,4420,{n:40,a0:-170,spread:160,v:420,g:600});}
  snow(t,{n:50,sp:-600,a:.5,y0:camy-1100,y1:camy+1100});
};

S.alone=(X_,t,D,B)=>{const E=EVS.alone(B), k=prog(t,0,D);
  cam(lerp(1.0,1.1,k),lerp(500,600,k),1000);
  tex('dawn',-200,-300,1480,2000,t,{amp:6,sp:.3});glow(820,980,500,'rgba(255,200,150,.8)',.9);
  X.fillStyle='#4a3a6a';poly(jag([[-300,1060],[100,900],[260,980],[500,760],[620,880],[900,940],[1400,1050],[1400,1200],[-300,1200]],14,30,21))();X.fill();
  // glacier with perspective
  texFill(poly([[-300,1080],[1400,1060],[1400,2400],[-300,2400]]),'snow',-300,1000,1700,1500,t*.1,{amp:2,tint:'#ffb08a',tintA:.18,shade:[0,1100,0,2300],shadeA:.35});
  X.save();X.globalCompositeOperation='lighter';X.globalAlpha=.25;const g=X.createLinearGradient(820,1060,400,1900);g.addColorStop(0,'#ffcf9a');g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.beginPath();X.moveTo(780,1060);X.lineTo(880,1060);X.lineTo(700,2400);X.lineTo(200,2400);X.fill();X.restore();
  // the crevasse behind him
  X.fillStyle='#071226';poly(jag([[60,1500],[220,1470],[380,1500],[420,1520],[260,1540],[80,1530]],6,20,4))();X.fill();X.strokeStyle='rgba(180,230,255,.7)';X.lineWidth=3;X.stroke();
  // tent far away
  X.save();X.translate(1010,1110);X.fillStyle='#e2a63a';X.beginPath();X.moveTo(-26,0);X.lineTo(0,-32);X.lineTo(26,0);X.fill();X.restore();
  // footprints + Simon walking away, long shadow
  const sx=lerp(520,700,k), sy=1640-k*60;
  for(let i=1;i<14;i++){const fx=sx-i*26,fy=sy+i*9;if(fx<300) break;X.fillStyle='rgba(60,80,130,.45)';X.beginPath();X.ellipse(fx,fy+((i%2)?8:-6),9,5,0,0,7);X.fill();}
  X.save();X.globalAlpha=.35;X.fillStyle='#2a2050';X.beginPath();X.ellipse(sx-140,sy+4,170,18,-.08,0,7);X.fill();X.restore();
  figure({x:sx,y:sy-ground(.5),s:.5,dir:1,...POSE.walk(t*4.6,.8),hd:24,tor:12},{...SIM,rim:'rgba(255,200,160,.7)',rimOff:[3,-3]});
  snow(t,{n:30,sp:40,a:.4,r:2});
  if(t>E.dead) label(540,1820,'Lo da por muerto',P(t,E.dead,.3),{col:'#ff8a9a'});
};

S.alive=(X_,t,D,B)=>{const E=EVS.alive(B), on=prog(t,E.alive-.35,E.alive-.1), k=eIO(prog(t,0,D));
  cam(lerp(1.4,1.7,k),560,1300);
  X.fillStyle='#010308';X.fillRect(-200,0,1500,2400);
  tex('ice',-200,300,1500,2000,t,{amp:4,a:.12});
  const head=[480,1290];
  if(on>0){X.save();X.beginPath();X.moveTo(head[0],head[1]);X.lineTo(-200,900);X.lineTo(-200,1700);X.closePath();X.clip();tex('ice',-300,600,1000,1400,t,{amp:4,a:on*.9});dust(t,{x0:-200,x1:480,y0:1000,y1:1600,n:30,a:.8*on});X.restore();
    beam(head[0],head[1],180+8,800,22,'rgba(255,246,200,.6)',.7*on);glow(head[0]-10,head[1]-6,60,'rgba(255,246,200,1)',on);}
  texFill(poly([[220,1380],[560,1350],[900,1380],[900,1440],[560,1410],[220,1440]]),'snow',200,1330,720,140,0,{amp:0,tint:'#000',tintA:.6});
  figure({x:620,y:1350,s:.55,dir:-1,rot:90,...POSE.lieBack(),hd:-6-on*24,lF:-40,kF:70},{...JOE,lamp:on>0});
  if(on>0) breath(head[0]-40,head[1]+10,t,.6,-1);
};

S.light=(X_,t,D,B)=>{const E=EVS.light(B), dn=eIO(prog(t,0,E.deep+.2)), li=prog(t,E.exit-.5,E.light);
  const jy=lerp(600,1900,dn);cam(1.0,540,lerp(800,1650,dn));
  X.fillStyle='#01040c';X.fillRect(-200,-400,1500,3400);
  for(const side of [-1,1]){const pts=jag(Array.from({length:16},(_,i)=>[side<0?280+noise1(i*.8,9)*60:820+noise1(i*.8,11)*60,-400+i*200]),14,40,side<0?5:6);
    texFill(poly(side<0?[[-400,-400],...pts,[-400,2800]]:[[1500,-400],...pts,[1500,2800]]),'ice',side<0?-400:700,-400,800,3200,t,{amp:4,tint:'#000814',tintA:.62});}
  // the opening with daylight on the right, low
  const ox=900, oy=2050;
  if(li>0){X.save();X.globalCompositeOperation='lighter';rays(ox,oy,200,1300,7,'rgba(255,236,190,.55)',li,t);glow(ox,oy,380,'rgba(255,240,200,.9)',li);X.restore();dust(t,{x0:200,x1:900,y0:1700,y1:2300,n:40,a:.7*li});}
  X.fillStyle=`rgba(255,246,220,${(.3+.7*li).toFixed(2)})`;poly(jag([[860,1900],[960,1880],[1000,2200],[880,2220]],8,20,3))();X.fill();
  texFill(poly([[240,2260],[560,2230],[900,2260],[900,2320],[560,2290],[240,2320]]),'snow',220,2200,700,140,0,{amp:0,tint:'#000',tintA:.4});
  if(t<E.exit){rope([[540,-400],[540,jy-120]],8,{tw:t*20});figure({x:540,y:jy,s:.55,dir:1,...POSE.rappel(t)},{...JOE,lamp:true});}
  else{const k=prog(t,E.exit,D);figure({x:lerp(560,820,k),y:2240,s:.55,dir:1,rot:90,...POSE.crawl(t*4)},{...JOE,lamp:true,rim:'rgba(255,230,180,.8)',rimOff:[3,-2]});}
};

S.distance=(X_,t,D,B)=>{const E=EVS.distance(B), k=prog(t,E.km-.4,D-.2);
  cam(lerp(1.0,1.08,prog(t,0,D)),540,1000);
  X.fillStyle='#0c0b12';X.fillRect(-100,-100,1300,2200);
  // map: glacier (top-left) → moraine (bottom-right)
  texFill(poly([[60,260],[1020,260],[1020,1780],[60,1780]]),'moraine',60,260,960,1520,t*.2,{amp:3});
  texFill(poly(jag([[60,260],[860,260],[700,600],[760,900],[460,1040],[60,960]],18,30,8)),'ice',60,260,960,1000,t*.2,{amp:3,tint:'#ffffff',tintA:.3});
  X.strokeStyle='rgba(255,255,255,.35)';X.lineWidth=4;X.strokeRect(60,260,960,1520);
  const path=[[230,420],[330,560],[420,720],[520,860],[600,1020],[700,1180],[800,1360],[880,1560]];
  const L=[0];for(let i=1;i<path.length;i++) L.push(L[i-1]+Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]));const tot=L[L.length-1];
  X.save();X.setLineDash([16,14]);X.strokeStyle='rgba(255,207,74,.35)';X.lineWidth=8;X.beginPath();path.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.stroke();X.restore();
  X.save();X.strokeStyle='#ffcf4a';X.shadowColor='#ffb84a';X.shadowBlur=16;X.lineWidth=9;X.setLineDash([tot*k,tot]);X.beginPath();path.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.stroke();X.restore();
  let hx=path[0][0],hy=path[0][1];for(let i=1;i<path.length;i++){if(L[i]>=tot*k){const q=(tot*k-L[i-1])/(L[i]-L[i-1]);hx=lerp(path[i-1][0],path[i][0],q);hy=lerp(path[i-1][1],path[i][1],q);break;}hx=path[i][0];hy=path[i][1];}
  glow(hx,hy,60,'rgba(255,220,120,.9)',1);X.fillStyle='#fff';X.beginPath();X.arc(hx,hy,10,0,7);X.fill();
  X.save();X.strokeStyle='#ff5a6a';X.lineWidth=10;X.lineCap='round';X.beginPath();X.moveTo(200,390);X.lineTo(260,450);X.moveTo(260,390);X.lineTo(200,450);X.stroke();X.restore();
  X.save();X.translate(880,1590);X.fillStyle='#e2a63a';X.beginPath();X.moveTo(-40,0);X.lineTo(0,-50);X.lineTo(40,0);X.fill();X.restore();
  label(880,1660,'Campamento',P(t,0,.3),{fs:30,col:'#ffd36a'});
  pill(540,1180,`${Math.round(8*clamp(k*1.25))}`,'km',P(t,E.km-.3,.35),{fs:110});
  if(t>E.food) label(330,1880,'Sin comida',P(t,E.food,.25),{col:'#ff8a8a'});
  if(t>E.leg) label(760,1880,'Pierna rota',P(t,E.leg,.25),{col:'#ff8a8a'});
};

function moraineSet(t,o={}){tex('dawn',-200,-300,1480,1700,t,{amp:5,sp:.3,a:.9});X.fillStyle=`rgba(120,140,190,${o.cool??.25})`;X.fillRect(-200,-300,1500,1700);
  X.fillStyle='#4a4a6a';poly(jag([[-300,1180],[200,1000],[450,1100],[800,960],[1400,1150],[1400,1400],[-300,1400]],14,30,31))();X.fill();
  texFill(poly(jag([[-300,1230],[1400,1200],[1400,2400],[-300,2400]],10,30,33)),'moraine',-300,1150,1700,1300,t*.1,{amp:2,shade:[0,1200,0,2300],shadeA:.4});
  for(let i=0;i<10;i++) rock(-200+i*170+hsh(i,7)*60,1250+hsh(i,8)*80,40+hsh(i,9)*40,i+40,{});}
S.crawl=(X_,t,D,B)=>{const k=prog(t,0,D+1);cam(1.45,lerp(560,500,k),1560);moraineSet(t);
  const x=lerp(720,600,k);X.save();X.globalAlpha=.3;X.fillStyle='#000';X.beginPath();X.ellipse(x,1640,230,18,0,0,7);X.fill();X.restore();
  figure({x,y:1595,s:.55,dir:-1,rot:-90,...POSE.crawl(t*3.6)},{...JOE,splint:'#c9b080'});
  burst((t*1.1)%1,x-150,1640,{n:10,a0:-160,spread:100,v:80,g:200,r:3,seed:Math.floor(t*1.1),col:'#cdb79a'});
  X.save();X.filter='blur(6px)';rock(300,1760,120,77,{});rock(820,1800,150,78,{});X.restore();dust(t,{x0:200,x1:900,y0:1300,y1:1700,n:24,a:.4});
};

function lcd(x,y,s,txt){X.save();X.translate(x,y);X.scale(s,s);
  rr(-230,-150,460,300,70);const g=X.createLinearGradient(0,-150,0,150);g.addColorStop(0,'#4a4c56');g.addColorStop(1,'#1c1d24');X.fillStyle=g;X.fill();X.strokeStyle='#8a8e9a';X.lineWidth=6;X.stroke();
  rr(-180,-90,360,170,16);X.fillStyle='#9fb48a';X.fill();X.fillStyle='rgba(0,0,0,.08)';for(let i=-80;i<80;i+=6) X.fillRect(-180,i,360,2);
  X.fillStyle='#16221a';X.font='800 112px "JetBrains Mono"';X.textAlign='center';X.textBaseline='middle';X.fillText(txt,0,0);
  X.fillStyle='#d9dde6';X.font='800 22px Inter';X.fillText('ALARM CHRONO',0,-118);[[-250,-60],[250,-60],[-250,60],[250,60]].forEach(([a,b])=>{rr(a-14,b-20,28,40,8);X.fillStyle='#6a6e7a';X.fill();});X.restore();}
S.watch=(X_,t,D,B)=>{const E=EVS.watch(B);
  if(t<E.rock-.3){const left=t<E.goal?20*60:Math.max(0,20*60-(t-E.goal)*90), txt=`${String(Math.floor(left/60)).padStart(2,'0')}:${String(Math.floor(left%60)).padStart(2,'0')}`;
    cam(lerp(1.0,1.1,prog(t,0,E.rock)),540,1100);moraineSet(t,{cool:.5});X.setTransform(1,0,0,1,0,0);X.fillStyle='rgba(0,0,0,.45)';X.fillRect(0,0,W,H);
    cam(lerp(1.0,1.1,prog(t,0,E.rock)),540,1100);
    // the wrist across the frame
    X.save();X.translate(540,1150);X.rotate(-8*D2R);X.shadowColor='rgba(255,196,170,.6)';X.shadowOffsetY=-4;rr(-800,-110,1600,220,100);X.fillStyle=JOE.jacket;X.fill();X.restore();
    X.save();X.translate(540,1150);X.rotate(-8*D2R);rr(-90,-230,180,460,30);X.fillStyle='#202128';X.fill();X.restore();
    lcd(540,1150,1.0,txt);glow(540,1150,420,'rgba(160,220,140,.25)',.8);
    if(t>E.goal) label(540,1520,'Una meta',P(t,E.goal,.25),{col:'#ffd36a'});return;}
  const second=t>E.other;const tx=second?300:640,ty=1450;
  cam(1.2,560,1420);moraineSet(t);
  rock(640,1480,110,201,{});rock(300,1440,90,202,{});
  X.save();X.translate(tx,ty+30);X.strokeStyle='#ffcf4a';X.shadowColor='#ffb84a';X.shadowBlur=20;X.lineWidth=6;X.setLineDash([22,16]);X.lineDashOffset=-t*40;X.beginPath();X.ellipse(0,0,second?150:180,46,0,0,7);X.stroke();X.restore();
  if(second){X.save();X.strokeStyle='#5ae08a';X.lineWidth=12;X.lineCap='round';X.shadowColor='#5ae08a';X.shadowBlur=14;X.beginPath();X.moveTo(610,1320);X.lineTo(640,1350);X.lineTo(690,1290);X.stroke();X.restore();}
  const x=second?lerp(700,560,prog(t,E.other,D+1)):lerp(980,780,prog(t,E.rock-.3,E.other));
  figure({x,y:1600,s:.5,dir:-1,rot:-90,...POSE.crawl(t*3.6)},{...JOE,splint:'#c9b080'});
  const [px,py]=w2s(tx,ty-150,1.2,560,1420);pill(px,py,'20','min',P(t,second?E.other:E.twenty,.35),{fs:84});
};

S.days=(X_,t,D,B)=>{const k=prog(t,0,D);cam(1.0,540,1100);
  const ph=k*3;const day=.5+.5*Math.cos(ph*Math.PI*2);
  tex('night',-200,-300,1480,1800,t,{amp:5});X.save();X.globalAlpha=day;tex('dawn',-200,-300,1480,1800,t,{amp:5});X.restore();
  const a=ph*Math.PI*2;X.save();X.translate(540,1250);glow(Math.cos(a+Math.PI)*520,-Math.abs(Math.sin(a))*700,140,'rgba(255,240,180,1)',day);X.fillStyle='#fff8d0';X.globalAlpha=day;X.beginPath();X.arc(Math.cos(a+Math.PI)*520,-Math.abs(Math.sin(a))*700,46,0,7);X.fill();X.restore();
  moraineSet(t,{cool:.2+.5*(1-day)});X.setTransform(1,0,0,1,0,0);X.fillStyle=`rgba(0,0,20,${(.55*(1-day)).toFixed(2)})`;X.fillRect(0,0,W,H);cam(1.0,540,1100);
  figure({x:lerp(900,250,k),y:1560,s:.38,dir:-1,rot:-90,...POSE.crawl(t*5)},JOE);
  X.setTransform(1,0,0,1,0,0);for(let i=0;i<3;i++){const s=P(t,i*D*.25,.2);if(s<=0) continue;X.save();X.translate(460+i*80,720);X.rotate(-6*D2R);X.globalAlpha=s;rr(-12,-110*s,24,220*s,12);X.fillStyle='#f3efe4';X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=14;X.fill();X.restore();}
  pill(540,980,'3','días',P(t,.1,.3),{fs:110,col:'#ff6a7a'});
};

function flames(x,y,s,t){X.save();X.translate(x,y);X.scale(s,s);X.globalCompositeOperation='lighter';
  for(let i=0;i<6;i++){const h=150+70*Math.sin(t*7+i*1.7)+40*noise1(t*5,i),w=40+i*6,ox=(i-2.5)*16+Math.sin(t*5+i)*8;const g=X.createLinearGradient(0,0,0,-h);g.addColorStop(0,'rgba(255,120,30,.9)');g.addColorStop(.6,'rgba(255,190,70,.7)');g.addColorStop(1,'rgba(255,240,180,0)');
    X.fillStyle=g;X.beginPath();X.moveTo(ox-w,0);X.quadraticCurveTo(ox-w*.6,-h*.6,ox+Math.sin(t*9+i)*14,-h);X.quadraticCurveTo(ox+w*.6,-h*.6,ox+w,0);X.fill();}X.restore();}
S.fire=(X_,t,D,B)=>{const E=EVS.fire(B), burn=prog(t,E.burn-.3,E.clothes+.6);
  cam(lerp(1.1,1.2,prog(t,0,D)),540,1300);
  tex('night',-200,-200,1480,2400,t,{amp:6});const r=rng(5);X.fillStyle='#fff';for(let i=0;i<120;i++){X.globalAlpha=.3+.7*Math.abs(Math.sin(t*2+i));X.fillRect(r()*1300-100,r()*1100,2.4,2.4);}X.globalAlpha=1;
  X.fillStyle='#120f20';poly(jag([[-300,1180],[100,900],[300,1020],[600,820],[900,1000],[1400,880],[1400,1400],[-300,1400]],14,30,41))();X.fill();
  texFill(poly([[-300,1300],[1400,1280],[1400,2400],[-300,2400]]),'moraine',-300,1250,1700,1200,t*.1,{amp:2,tint:'#0a0614',tintA:.65});
  glow(560,1520,700,'rgba(255,140,60,.55)',1);
  // tents
  for(const [x,y,s,lit] of [[880,1440,1.0,.6],[200,1400,.7,0]]){X.save();X.translate(x,y);X.scale(s,s);X.strokeStyle='rgba(200,180,140,.35)';X.lineWidth=2;X.beginPath();X.moveTo(0,-170);X.lineTo(-230,10);X.moveTo(0,-170);X.lineTo(230,10);X.stroke();X.fillStyle=lit?'#e8a43a':'#8a5a2a';X.beginPath();X.moveTo(-150,0);X.quadraticCurveTo(-60,-90,0,-170);X.quadraticCurveTo(60,-90,150,0);X.fill();X.fillStyle=lit?'#ffd78a':'#3a2414';X.beginPath();X.moveTo(-30,0);X.lineTo(0,-110);X.lineTo(30,0);X.fill();X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.moveTo(0,-170);X.lineTo(150,0);X.lineTo(50,0);X.fill();if(lit)glow(0,-60,200,'rgba(255,200,120,.6)',lit);X.restore();}
  // the fire with Joe's red jacket in it
  X.save();X.fillStyle='#3a2414';X.translate(560,1560);X.rotate(.1);rr(-90,-10,180,22,10);X.fill();X.rotate(-.25);rr(-90,-10,180,22,10);X.fill();X.restore();
  if(burn>0){X.save();X.translate(560,1540);X.rotate(-.12);X.globalAlpha=1-burn*.5;X.fillStyle=shadeC(JOE.jacket,1-burn*.7);rr(-80,-50,160,80,24);X.fill();rr(-150,-40,80,40,20);X.fill();rr(70,-40,80,40,20);X.fill();X.restore();}
  flames(560,1560,1.1,t);embers(t,560,1500,{n:40,w:160,h:600});
  figure({x:330,y:1470,s:.6,dir:1,...POSE.sitFire()},{...SIM,rim:'rgba(255,150,70,.85)',rimOff:[4,-2]});
  figure({x:820,y:1500,s:.6,dir:-1,...POSE.kneelPack(t)},{...RICH,rim:'rgba(255,150,70,.85)',rimOff:[-4,-2]});
  X.save();X.translate(980,1600);rr(-50,-110,100,120,24);X.fillStyle='#4a5a2a';X.fill();X.restore();
  if(t>E.clothes&&t<E.dawn) label(540,1840,'La ropa de Joe',P(t,E.clothes,.25),{col:'#ff9a7a'});
  if(t>E.dawn) pill(540,1820,'Al amanecer','se van',P(t,E.dawn,.35),{fs:70});
};

S.shout=(X_,t,D,B)=>{const E=EVS.shout(B), up=eOut(prog(t,E.hear,E.hear+.7)), k=eIO(prog(t,0,D));
  cam(lerp(1.0,1.25,k),lerp(560,700,k),1340);
  tex('night',-200,-200,1480,2400,t,{amp:6});X.fillStyle='#0c0a18';poly(jag([[-300,1150],[200,960],[600,1080],[1000,940],[1400,1100],[1400,1400],[-300,1400]],14,30,51))();X.fill();
  texFill(poly([[-300,1300],[1400,1280],[1400,2400],[-300,2400]]),'moraine',-300,1250,1700,1200,t*.1,{amp:2,tint:'#05040c',tintA:.75});
  // the lit tent with Simon's shadow on the fabric
  X.save();X.translate(760,1480);const tp=poly([[-260,0],[0,-300],[260,0]]);tp();const g=X.createLinearGradient(0,-300,0,0);g.addColorStop(0,'#f2b866');g.addColorStop(1,'#b8742a');X.fillStyle=g;X.fill();
  X.clip();X.globalAlpha=.55;figure({x:-30,y:lerp(-20,-120,up),s:.6,dir:-1,rot:lerp(-80,0,up),...(up>.5?POSE.sitRock():POSE.lieBack())},{jacket:'#5a2a10',pants:'#5a2a10',head:'#5a2a10',rim:'transparent',glove:'#5a2a10',boots:'#5a2a10'});X.restore();
  glow(760,1380,340,'rgba(255,190,110,.5)',.8);
  // the voice from the dark
  if(t>E.shout){X.save();X.strokeStyle='#ffd36a';X.lineWidth=5;X.shadowColor='#ffb84a';X.shadowBlur=14;for(let i=0;i<3;i++){const p=((t-E.shout)*.8+i/3)%1;X.globalAlpha=1-p;X.beginPath();X.arc(60,1380,60+p*260,-.6,.6);X.stroke();}X.restore();
    const [lx,ly]=w2s(230,1250,lerp(1.0,1.25,k),lerp(560,700,k),1340);label(lx,ly,'«¡Siiimon!»',P(t,E.shout,.3),{fs:46,col:'#ffd36a'});}
};

S.joe=(X_,t,D,B)=>{const k=eIO(prog(t,0,D));cam(lerp(1.2,1.6,k),600,1500);
  tex('night',-200,-200,1480,2400,t,{amp:6,a:.6});texFill(poly([[-300,1300],[1400,1280],[1400,2400],[-300,2400]]),'moraine',-300,1250,1700,1200,t*.1,{amp:2,tint:'#05040c',tintA:.8});
  const ang=lerp(160,200,k);X.save();X.beginPath();X.moveTo(1300,1100);X.lineTo(1300+Math.cos((ang-12)*D2R)*1600,1100+Math.sin((ang-12)*D2R)*1600);X.lineTo(1300+Math.cos((ang+12)*D2R)*1600,1100+Math.sin((ang+12)*D2R)*1600);X.closePath();X.clip();
  texFill(poly([[-300,1300],[1400,1280],[1400,2400],[-300,2400]]),'moraine',-300,1250,1700,1200,t*.1,{amp:2,tint:'#ffeec0',tintA:.15});X.restore();
  beam(1300,1100,ang,1600,12,'rgba(255,246,210,.5)',.6);
  figure({x:560,y:1560,s:.6,dir:-1,rot:90,...POSE.lieBack(),hd:-10,lF:-40,kF:70},{...JOE,splint:'#c9b080',rim:'rgba(255,240,200,.9)',rimOff:[3,-3]});
  breath(470,1500,t,.5,-1);
};

S.friends=(X_,t,D,B)=>{const E=EVS.friends(B), k=prog(t,0,D);cam(lerp(1.05,1.2,k),540,1250);
  tex('dawn',-200,-300,1480,2000,t,{amp:5,sp:.3});glow(540,1150,600,'rgba(255,210,150,1)',.9);X.fillStyle='#fff3d0';X.beginPath();X.arc(540,1150,110,0,7);X.fill();
  X.fillStyle='#4a3060';poly(jag([[-300,1220],[100,1060],[300,1140],[560,980],[800,1120],[1400,1000],[1400,1400],[-300,1400]],14,30,61))();X.fill();
  X.fillStyle='#1c1426';X.fillRect(-300,1380,1700,1200);
  X.fillStyle='#120c1a';X.beginPath();X.moveTo(230,1560);X.quadraticCurveTo(250,1430,420,1420);X.lineTo(700,1420);X.quadraticCurveTo(860,1430,860,1560);X.lineTo(900,1700);X.lineTo(180,1700);X.fill();
  const back={jacket:'#1a1420',pants:'#120e18',head:'#1a1420',rim:'rgba(255,200,140,.95)',rimBlur:6};
  figure({x:440,y:1400,s:.62,dir:1,...POSE.sitRock(),hd:t>E.same?10:2},{...back,splint:'#3a2a20'});
  figure({x:640,y:1400,s:.62,dir:-1,...POSE.sitRock(),aF:lerp(44,96,P(t,E.blame,.6)),eF:lerp(66,40,P(t,E.blame,.6)),hd:lerp(8,22,P(t,E.blame,.6))},{...back,hat:'#2a1e14'});
  dust(t,{x0:200,x1:900,y0:900,y1:1400,n:30,a:.4,col:'#ffe0b0'});
};

S.you=(X_,t,D,B)=>{const z=lerp(1.5,1.8,eIO(prog(t,0,D)));cam(z,LX-120,LY-140);corniceBg(t);ropeOverLip(t,{});
  mitten(LX+30,LY-180,.95,30);knife(LX-150,LY-130,.95,1,200,t);snow(t,{n:70,wind:.5,sp:220,a:.7});};

window.CFG={tex:['storm','ice','snow','rock','strata','moraine','dawn','night']};

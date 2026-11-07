// ===== SUCESOS style kit (canvas 2D): math, painterly textures, light, particles, rope, UI pills/cards, faceless rigged figures =====
const W=1080,H=1920;
const cv=document.getElementById('c'), X=cv.getContext('2d');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)), lerp=(a,b,k)=>a+(b-a)*k, prog=(t,a,b)=>clamp((t-a)/(b-a));
const eOut=k=>1-Math.pow(1-k,3), eIO=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2, eIn=k=>k*k*k, eBack=k=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2)};
const P=(t,a,d=.3)=>eOut(prog(t,a,a+d));
function rng(s){let a=s>>>0||1;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const hsh=(n,s=0)=>{const v=Math.sin(n*127.1+s*311.7)*43758.5453;return v-Math.floor(v)};
const noise1=(x,s=0)=>{const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);return lerp(hsh(i,s),hsh(i+1,s),u)*2-1};
const D2R=Math.PI/180;

// ---------- camera ----------
// world coords = screen coords at zoom 1 centred on (cx,cy). shake: [dx,dy]
function cam(z,cx,cy,sh=[0,0],rot=0){X.setTransform(1,0,0,1,0,0);X.translate(540+sh[0],960+sh[1]);if(rot)X.rotate(rot*D2R);X.scale(z,z);X.translate(-cx,-cy);}
const shake=(t,amt)=>amt<=0?[0,0]:[noise1(t*28,1)*amt,noise1(t*31,2)*amt];

// ---------- painterly textures ----------
// texture drawn with a slow horizontal wave (the "living paint" look). amp px, f waves per 1000px, sp speed
function tex(name,x,y,w,h,t=0,o={}){const im=IMG[name];if(!im) return;
  const amp=o.amp??10, f=(o.f??3)/1000, sp=o.sp??.6, step=o.step??8, ox=o.ox||0, oy=o.oy||0, a=o.a??1;
  X.save();X.globalAlpha*=a;if(o.op) X.globalCompositeOperation=o.op;
  const sx=im.width/(w+2*amp), sy=im.height/h;
  for(let yy=0;yy<h;yy+=step){const d=Math.sin((yy+oy)*f*Math.PI*2+t*sp)*amp+Math.sin((yy+oy)*f*2.3*Math.PI*2-t*sp*.7)*amp*.4;
    X.drawImage(im,clamp((amp+d+ox)*sx,0,im.width-1),yy*sy,w*sx,step*sy,x,y+yy,w,step+.6);}
  X.restore();}
// fill a path with a texture (path built by fn), plus optional tint + rim stroke
function texFill(path,name,x,y,w,h,t,o={}){X.save();path();X.clip();tex(name,x,y,w,h,t,o);
  if(o.tint){X.fillStyle=o.tint;X.globalAlpha=o.tintA??.35;X.fillRect(x,y,w,h);}
  if(o.shade){const g=X.createLinearGradient(o.shade[0],o.shade[1],o.shade[2],o.shade[3]);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${o.shadeA??.55})`);X.globalAlpha=1;X.fillStyle=g;X.fillRect(x,y,w,h);}
  X.restore();
  if(o.rim){X.save();path();X.strokeStyle=o.rim;X.lineWidth=o.rimW||4;X.globalAlpha=o.rimA??.8;X.shadowColor=o.rim;X.shadowBlur=o.rimBlur??8;X.stroke();X.restore();}}
const poly=pts=>()=>{X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.closePath();};
// jagged ridge path between points (deterministic)
function jag(pts,amp=14,seg=26,seed=1){const out=[];for(let i=0;i<pts.length-1;i++){const [x1,y1]=pts[i],[x2,y2]=pts[i+1],n=Math.max(1,Math.round(Math.hypot(x2-x1,y2-y1)/seg));
  for(let k=0;k<n;k++){const q=k/n, nx=-(y2-y1), ny=x2-x1, L=Math.hypot(nx,ny)||1, j=(hsh(i*97+k,seed)-.5)*2*amp*(k?1:0);out.push([lerp(x1,x2,q)+nx/L*j,lerp(y1,y2,q)+ny/L*j]);}}
  out.push(pts[pts.length-1]);return out}

// ---------- light ----------
function glow(x,y,r,col,a=1,op='lighter'){X.save();X.globalCompositeOperation=op;X.globalAlpha=a;const g=X.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.fillRect(x-r,y-r,2*r,2*r);X.restore();}
function shadeRect(x,y,w,h,c0,c1,vertical=true){const g=vertical?X.createLinearGradient(0,y,0,y+h):X.createLinearGradient(x,0,x+w,0);g.addColorStop(0,c0);g.addColorStop(1,c1);X.fillStyle=g;X.fillRect(x,y,w,h);}
function beam(x,y,ang,len,spread,col,a=.5){X.save();X.globalCompositeOperation='lighter';X.translate(x,y);X.rotate(ang*D2R);
  const g=X.createLinearGradient(0,0,len,0);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.globalAlpha=a;
  X.beginPath();X.moveTo(0,-6);X.lineTo(len,-len*Math.tan(spread*D2R));X.lineTo(len,len*Math.tan(spread*D2R));X.lineTo(0,6);X.closePath();X.fill();X.restore();}
function rays(x,y,ang,len,n,col,a,t){for(let i=0;i<n;i++){const s=(i/(n-1)-.5)*2;beam(x+s*40,y,ang+s*8+Math.sin(t*.7+i)*1.5,len*(.8+.3*hsh(i,4)),2.5+hsh(i,9)*2,col,a*(.5+.5*hsh(i,2)));}}

// ---------- particles ----------
function snow(t,o={}){const r=rng(o.seed||3),n=o.n||90,x0=o.x0??-200,x1=o.x1??1280,y0=o.y0??-200,y1=o.y1??2100,wind=o.wind??.3,sp=o.sp??140;
  X.save();X.fillStyle=o.col||'#fff';for(let i=0;i<n;i++){const z=.4+r()*.9,Hh=y1-y0,y=y0+((r()*Hh+t*sp*z)%Hh),x=x0+((r()*(x1-x0)+t*sp*wind*z+Math.sin(t*1.3+i)*14)%(x1-x0)+(x1-x0))%(x1-x0);
    X.globalAlpha=(o.a??.8)*z*.9;X.beginPath();X.arc(x,y,(o.r||3.4)*z,0,7);X.fill();}X.restore();}
function streaks(t,o={}){const r=rng(o.seed||5),n=o.n||60,ang=o.ang??.45,sp=o.sp??2200;X.save();X.strokeStyle=o.col||'#fff';X.lineCap='round';
  for(let i=0;i<n;i++){const z=.5+r()*.8,L=(30+r()*70)*z,p=(t*sp*z/2400+r())%1,x=-400+r()*1900+p*2400*ang,y=-200+p*2400;X.globalAlpha=(o.a??.5)*z;X.lineWidth=1.5+2*z;
    X.beginPath();X.moveTo(x,y);X.lineTo(x+L*ang,y+L);X.stroke();}X.restore();}
function sparks(t,x,y,o={}){const r=rng(o.seed||8),n=o.n||30;X.save();X.globalCompositeOperation='lighter';X.strokeStyle=o.col||'#ffcf6a';X.lineCap='round';
  for(let i=0;i<n;i++){const a=(o.a0??-180)+r()*(o.spread??360),v=(o.v??300)*(.4+r()),life=.5+r()*.5,p=((t*(o.rate??1.4)+r())%1);if(p>life) continue;const q=p/life,
    px=x+Math.cos(a*D2R)*v*q,py=y+Math.sin(a*D2R)*v*q+(o.g??200)*q*q;X.globalAlpha=1-q;X.lineWidth=2.4;X.beginPath();X.moveTo(px,py);X.lineTo(px-Math.cos(a*D2R)*14,py-Math.sin(a*D2R)*14);X.stroke();}X.restore();}
function burst(k,x,y,o={}){if(k<=0||k>=1) return;const r=rng(o.seed||11),n=o.n||26;X.save();X.fillStyle=o.col||'#eef4ff';
  for(let i=0;i<n;i++){const a=(o.a0??-170)+r()*(o.spread??160),v=(o.v??420)*(.3+r()),q=eOut(k),px=x+Math.cos(a*D2R)*v*q,py=y+Math.sin(a*D2R)*v*q+(o.g??500)*k*k;
    X.globalAlpha=(1-k)*(o.a??1);X.beginPath();X.arc(px,py,(o.r||6)*(.5+r()),0,7);X.fill();}X.restore();}
function puffAt(k,x,y,r0,col='rgba(255,255,255,.8)'){if(k<=0||k>=1) return;X.save();X.globalAlpha=(1-k)*.8;X.fillStyle=col;for(let i=0;i<6;i++){const a=i/6*Math.PI*2;X.beginPath();X.arc(x+Math.cos(a)*r0*k*1.4,y+Math.sin(a)*r0*k*.6,r0*(.4+.6*k),0,7);X.fill();}X.restore();}
function embers(t,x,y,o={}){const r=rng(o.seed||13),n=o.n||24;X.save();X.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const p=(t*.45*(.6+r())+r())%1,px=x+(r()-.5)*(o.w||120)+Math.sin(t*2+i)*30*p,py=y-p*(o.h||420);
  X.globalAlpha=(1-p);X.fillStyle=r()<.5?'#ffb84a':'#ff6a2a';X.beginPath();X.arc(px,py,2.5+r()*2,0,7);X.fill();}X.restore();}
function dust(t,o={}){const r=rng(o.seed||17),n=o.n||40;X.save();X.globalCompositeOperation='lighter';X.fillStyle=o.col||'#fff6d8';
  for(let i=0;i<n;i++){const x=(o.x0??0)+r()*((o.x1??1080)-(o.x0??0))+Math.sin(t*.4+i)*30,y=(o.y0??0)+r()*((o.y1??1920)-(o.y0??0))+Math.cos(t*.3+i*2)*24;X.globalAlpha=(o.a??.5)*(.3+.7*Math.abs(Math.sin(t*1.2+i)));X.beginPath();X.arc(x,y,1.5+r()*2.5,0,7);X.fill();}X.restore();}
function breath(x,y,t,a=.5,dir=1){const p=(t*.6)%1;X.save();X.globalAlpha=a*(1-p);X.fillStyle='#e8f0ff';X.beginPath();X.ellipse(x+dir*p*70,y-p*30,10+p*36,7+p*20,0,0,7);X.fill();X.restore();}

// ---------- rope ----------
// pts: [[x,y],...] polyline, smoothed. w width. twist animates with tw.
function rope(pts,w=12,o={}){if(pts.length<2) return;X.save();X.lineJoin='round';X.lineCap='round';
  const path=()=>{X.beginPath();X.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++){const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;X.quadraticCurveTo(pts[i][0],pts[i][1],mx,my);}X.lineTo(pts[pts.length-1][0],pts[pts.length-1][1]);};
  if(o.glow){X.shadowColor=o.glow;X.shadowBlur=18;}
  path();X.strokeStyle='#3a1606';X.lineWidth=w+5;X.stroke();X.shadowBlur=0;
  path();X.strokeStyle=o.col||'#e2662a';X.lineWidth=w;X.stroke();
  path();X.strokeStyle=o.col2||'#ffb25a';X.lineWidth=w*.42;X.setLineDash([w*.9,w*1.1]);X.lineDashOffset=-(o.tw||0);X.stroke();
  X.setLineDash([]);path();X.strokeStyle='rgba(255,255,255,.25)';X.lineWidth=w*.18;X.translate(-w*.18,-w*.18);X.stroke();X.restore();}
const sag=(x1,y1,x2,y2,s,n=16)=>Array.from({length:n+1},(_,i)=>{const k=i/n;return [lerp(x1,x2,k),lerp(y1,y2,k)+Math.sin(k*Math.PI)*s]});

// ---------- UI: data pill + monitor card ----------
function rr(x,y,w,h,r){X.beginPath();X.moveTo(x+r,y);X.arcTo(x+w,y,x+w,y+h,r);X.arcTo(x+w,y+h,x,y+h,r);X.arcTo(x,y+h,x,y,r);X.arcTo(x,y,x+w,y,r);X.closePath();}
function pill(x,y,big,small,a,o={}){if(a<=0) return;X.save();X.setTransform(1,0,0,1,0,0);const sc=(o.s||1)*(.7+.3*eBack(clamp(a)));X.translate(x,y);X.scale(sc,sc);X.globalAlpha=clamp(a*2);
  X.font=`800 ${o.fs||88}px Inter`;const bw=X.measureText(big).width;X.font=`800 ${(o.fs||88)*.42}px Inter`;const sw=small?X.measureText(small).width+16:0;const w=bw+sw+64,h=(o.fs||88)*1.36;
  X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=30;X.shadowOffsetY=10;rr(-w/2,-h/2,w,h,h*.3);X.fillStyle='rgba(22,18,30,.88)';X.fill();X.shadowColor='transparent';
  X.strokeStyle='rgba(255,255,255,.14)';X.lineWidth=3;X.stroke();
  X.textBaseline='middle';X.fillStyle=o.col||'#ffcf4a';X.shadowColor=o.col||'#ffcf4a';X.shadowBlur=16;X.font=`800 ${o.fs||88}px Inter`;X.fillText(big,-w/2+32,4);
  if(small){X.font=`800 ${(o.fs||88)*.42}px Inter`;X.fillText(small,-w/2+32+bw+16,(o.fs||88)*.16);}X.restore();}
function label(x,y,txt,a,o={}){if(a<=0) return;X.save();X.setTransform(1,0,0,1,0,0);X.globalAlpha=clamp(a*2);X.font=`700 ${o.fs||40}px Inter`;const w=X.measureText(txt).width+44,h=(o.fs||40)*1.7;
  X.translate(x,y);X.scale(.8+.2*eBack(clamp(a)),.8+.2*eBack(clamp(a)));rr(-w/2,-h/2,w,h,h/2);X.fillStyle='rgba(22,18,30,.82)';X.fill();X.strokeStyle=o.col||'rgba(255,255,255,.2)';X.lineWidth=3;X.stroke();
  X.fillStyle=o.col||'#fff';X.textAlign='center';X.textBaseline='middle';X.fillText(txt,0,3);X.restore();}
// old CRT-ish monitor with content drawn by fn(w,h) inside, a caption and a bar (v 0..1)
function monitor(x,y,w,h,a,fn,cap,v,col){if(a<=0) return;X.save();X.setTransform(1,0,0,1,0,0);X.globalAlpha=clamp(a*1.6);X.translate(x,y);const s=.85+.15*eBack(clamp(a));X.scale(s,s);
  X.shadowColor='rgba(0,0,0,.6)';X.shadowBlur=40;rr(-w/2-26,-h/2-26,w+52,h+52+40,34);X.fillStyle='#2a2c38';X.fill();X.shadowColor='transparent';
  const g=X.createLinearGradient(0,-h/2-26,0,h/2+66);g.addColorStop(0,'#4a4c5a');g.addColorStop(1,'#1c1e28');X.fillStyle=g;X.fill();
  rr(-w/2,-h/2,w,h,18);X.save();X.clip();const bg=X.createRadialGradient(0,-h*.1,10,0,0,w*.8);bg.addColorStop(0,'#2f6ad0');bg.addColorStop(1,'#0c1a48');X.fillStyle=bg;X.fillRect(-w/2,-h/2,w,h);
  X.save();fn(w,h);X.restore();
  if(cap){X.fillStyle='rgba(8,12,30,.75)';X.fillRect(-w/2,h/2-120,w,120);X.fillStyle='#fff';X.font='800 38px Inter';X.textAlign='left';X.fillText(cap,-w/2+30,h/2-70);
    rr(-w/2+30,h/2-46,w-60,22,11);X.fillStyle='rgba(255,255,255,.12)';X.fill();rr(-w/2+30,h/2-46,(w-60)*clamp(v),22,11);X.fillStyle=col||(v>.5?'#f2c24a':v>.25?'#f29a4a':'#e8484a');X.fill();}
  for(let yy=-h/2;yy<h/2;yy+=5){X.fillStyle='rgba(0,0,0,.12)';X.fillRect(-w/2,yy,w,2);}X.restore();
  X.fillStyle='#14151c';X.fillRect(w/2-90,h/2+14,70,20);X.restore();}

// ---------- rocks ----------
function rockShape(x,y,r,seed,o={}){const n=o.n||9,pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+hsh(i,seed)*.4;const rr=r*(.7+.4*hsh(i+20,seed));pts.push([x+Math.cos(a)*rr*(o.sx||1),y+Math.sin(a)*rr*(o.sy||.7)]);}return pts}
function rock(x,y,r,seed,o={}){const pts=rockShape(x,y,r,seed,o);texFill(poly(pts),o.tex||'moraine',x-r*1.5,y-r*1.2,r*3,r*2.4,0,{amp:0,tint:o.tint,tintA:o.tintA??.25,shade:[x-r,y-r,x+r*.6,y+r],shadeA:.6});
  X.save();X.globalCompositeOperation='lighter';X.globalAlpha=.18;X.fillStyle=o.lit||'#fff';X.beginPath();pts.slice(Math.floor(pts.length*.55)).concat([pts[0]]).forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.lineTo(x,y);X.closePath();X.fill();X.restore();
  X.save();poly(pts)();X.strokeStyle='rgba(0,0,0,.45)';X.lineWidth=3;X.stroke();X.restore();}

// ---------- FACELESS RIGGED FIGURE ----------
// pose: {x,y (hip), s, dir(1 right/-1 left), rot(deg, whole body), tor (lean fwd), hd, aB,eB (back arm: shoulder,elbow), aF,eF (front arm), lB,kB, lF,kF (legs: hip,knee)}
// angles in degrees measured from straight down, positive = forward (towards dir). Knee positive = shin bends backward.
const RIG={tor:136,neck:10,head:50,ua:82,fa:78,th:100,sh:100};
const STAND={tor:2,hd:0,aB:-6,eB:12,aF:8,eF:14,lB:-3,kB:4,lF:4,kF:4};
const vdir=a=>[Math.sin(a*D2R),Math.cos(a*D2R)];
function rigPts(p){const q={...STAND,...p},L=RIG;const pts={};
  const hip=[0,0], sh=[Math.sin(q.tor*D2R)*L.tor,-Math.cos(q.tor*D2R)*L.tor];
  const hdir=q.tor+q.hd;const head=[sh[0]+Math.sin(hdir*D2R)*(L.neck+L.head),sh[1]-Math.cos(hdir*D2R)*(L.neck+L.head)];
  const arm=(a,e)=>{const A=a+q.tor,v1=vdir(A),el=[sh[0]+v1[0]*L.ua,sh[1]+v1[1]*L.ua],v2=vdir(A+e),ha=[el[0]+v2[0]*L.fa,el[1]+v2[1]*L.fa];return [el,ha]};
  const leg=(a,k)=>{const v1=vdir(a),kn=[v1[0]*L.th,v1[1]*L.th],v2=vdir(a-k),ft=[kn[0]+v2[0]*L.sh,kn[1]+v2[1]*L.sh];return [kn,ft]};
  Object.assign(pts,{hip,sh,head});[pts.elB,pts.hB]=arm(q.aB,q.eB);[pts.elF,pts.hF]=arm(q.aF,q.eF);[pts.knB,pts.ftB]=leg(q.lB,q.kB);[pts.knF,pts.ftF]=leg(q.lF,q.kF);
  // to world
  const cs=Math.cos((q.rot||0)*D2R),sn=Math.sin((q.rot||0)*D2R),s=q.s||1,d=q.dir||1,wp={};
  for(const k in pts){const [lx,ly]=pts[k],x0=lx*d,y0=ly;wp[k]=[q.x+(x0*cs-y0*sn)*s,q.y+(x0*sn+y0*cs)*s];}
  return {local:pts,world:wp,q}}
function figure(p,st={}){const {local:L,q}=rigPts(p);X.save();X.translate(q.x,q.y);X.rotate((q.rot||0)*D2R);X.scale((q.s||1)*(q.dir||1),q.s||1);
  const jk=st.jacket||'#2a3346', jkB=st.jacketB||shadeC(jk,.66), pn=st.pants||'#191b24', pnB=shadeC(pn,.7), hd=st.head||'#22252f', rim=st.rim||'rgba(190,210,255,.55)', bt=st.boots||'#0b0c10';
  X.lineCap='round';X.lineJoin='round';
  const R=st.rimOff??[-3,-3];
  const path3=(a,b,c,w,col)=>{X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.lineTo(c[0],c[1]);X.strokeStyle=col;X.lineWidth=w;X.stroke();};
  const withRim=fn=>{X.save();X.shadowColor=rim;X.shadowOffsetX=R[0];X.shadowOffsetY=R[1];X.shadowBlur=st.rimBlur??3;fn();X.restore();};
  const boot=(kn,ft,c)=>{X.save();X.translate(ft[0],ft[1]);X.rotate(Math.atan2(ft[1]-kn[1],ft[0]-kn[0])-Math.PI/2);rr(-20,-12,62,30,12);X.fillStyle=c;X.fill();X.restore();};
  const mitt=(h,c)=>{X.beginPath();X.ellipse(h[0],h[1],20,18,0,0,7);X.fillStyle=c;X.fill();};
  // back side (darker)
  withRim(()=>path3(L.hip,L.knB,L.ftB,50,pnB));boot(L.knB,L.ftB,bt);
  withRim(()=>path3(L.sh,L.elB,L.hB,42,jkB));mitt(L.hB,st.glove||'#0e1014');
  if(st.pack){X.save();X.translate((L.hip[0]+L.sh[0])/2,(L.hip[1]+L.sh[1])/2);X.rotate(Math.atan2(L.sh[1]-L.hip[1],L.sh[0]-L.hip[0])+Math.PI/2);rr(-86,-74,58,136,20);X.fillStyle=st.pack;X.fill();X.fillStyle='rgba(0,0,0,.25)';X.fillRect(-86,-10,58,8);X.restore();}
  // puffy torso
  const a=Math.atan2(L.sh[1]-L.hip[1],L.sh[0]-L.hip[0]),nx=Math.cos(a+Math.PI/2),ny=Math.sin(a+Math.PI/2),ux=Math.cos(a),uy=Math.sin(a);
  withRim(()=>{X.beginPath();X.moveTo(L.hip[0]+nx*40-ux*6,L.hip[1]+ny*40-uy*6);
    X.bezierCurveTo(L.hip[0]+nx*50+ux*60,L.hip[1]+ny*50+uy*60,L.sh[0]+nx*58-ux*40,L.sh[1]+ny*58-uy*40,L.sh[0]+nx*44+ux*14,L.sh[1]+ny*44+uy*14);
    X.quadraticCurveTo(L.sh[0]+ux*34,L.sh[1]+uy*34,L.sh[0]-nx*44+ux*14,L.sh[1]-ny*44+uy*14);
    X.bezierCurveTo(L.sh[0]-nx*58-ux*40,L.sh[1]-ny*58-uy*40,L.hip[0]-nx*50+ux*60,L.hip[1]-ny*50+uy*60,L.hip[0]-nx*40-ux*6,L.hip[1]-ny*40-uy*6);
    X.quadraticCurveTo(L.hip[0]-ux*22,L.hip[1]-uy*22,L.hip[0]+nx*40-ux*6,L.hip[1]+ny*40-uy*6);
    const g=X.createLinearGradient(L.hip[0]-nx*50,L.hip[1]-ny*50,L.hip[0]+nx*50,L.hip[1]+ny*50);g.addColorStop(0,shadeC(jk,1.18));g.addColorStop(1,shadeC(jk,.8));X.fillStyle=g;X.fill();});
  X.save();X.globalAlpha=.22;X.strokeStyle='#000';X.lineWidth=3;for(let k=1;k<4;k++){const f=k/4,cx=lerp(L.hip[0],L.sh[0],f),cy=lerp(L.hip[1],L.sh[1],f),wv=44+12*Math.sin(f*Math.PI);
    X.beginPath();X.moveTo(cx-nx*wv,cy-ny*wv);X.quadraticCurveTo(cx-ux*8,cy-uy*8,cx+nx*wv,cy+ny*wv);X.stroke();}X.restore();
  if(st.harness){X.save();X.strokeStyle=st.harness;X.lineWidth=8;X.beginPath();X.moveTo(L.hip[0]-nx*42+ux*8,L.hip[1]-ny*42+uy*8);X.lineTo(L.hip[0]+nx*42+ux*8,L.hip[1]+ny*42+uy*8);X.stroke();X.restore();}
  // front leg
  withRim(()=>path3(L.hip,L.knF,L.ftF,54,pn));boot(L.knF,L.ftF,bt);
  if(st.splint){X.save();X.globalAlpha=.85;path3(L.knF,[lerp(L.knF[0],L.ftF[0],.5),lerp(L.knF[1],L.ftF[1],.5)],L.ftF,16,st.splint);X.restore();}
  // collar, neck, head (faceless)
  X.beginPath();X.ellipse(L.sh[0]+ux*10,L.sh[1]+uy*10,40,22,a+Math.PI/2,0,7);X.fillStyle=shadeC(jk,.85);X.fill();
  const hr=RIG.head;
  withRim(()=>{X.beginPath();X.ellipse(L.head[0],L.head[1],hr*.9,hr,(q.tor+q.hd)*D2R,0,7);const g=X.createRadialGradient(L.head[0]+14,L.head[1]-16,4,L.head[0],L.head[1],hr*1.15);g.addColorStop(0,shadeC(hd,1.7));g.addColorStop(1,hd);X.fillStyle=g;X.fill();});
  if(st.hat){X.save();X.translate(L.head[0],L.head[1]);X.rotate((q.tor+q.hd)*D2R);X.beginPath();X.ellipse(0,-10,hr*1.0,hr*.86,0,Math.PI,0);X.closePath();X.fillStyle=st.hat;X.fill();
    X.fillStyle=shadeC(st.hat,.72);rr(-hr*1.02,-18,hr*2.04,18,6);X.fill();X.beginPath();X.arc(0,-hr*.98,13,0,7);X.fillStyle=st.hat;X.fill();X.restore();}
  if(st.hair){X.save();X.translate(L.head[0],L.head[1]);X.rotate((q.tor+q.hd)*D2R);X.beginPath();X.ellipse(-6,-16,hr*.96,hr*.7,-.2,Math.PI*.92,Math.PI*2.06);X.fillStyle=st.hair;X.fill();X.restore();}
  if(st.lamp){X.save();X.translate(L.head[0],L.head[1]);X.rotate((q.tor+q.hd)*D2R);X.fillStyle='#fff6c0';X.shadowColor='#fff6c0';X.shadowBlur=24;X.beginPath();X.arc(hr*.78,-12,9,0,7);X.fill();X.restore();}
  // front arm
  withRim(()=>path3(L.sh,L.elF,L.hF,46,jk));mitt(L.hF,st.glove||'#0e1014');
  X.restore();}
function shadeC(hex,k){const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,f=v=>Math.round(clamp(v*k,0,255));return `rgb(${f(r)},${f(g)},${f(b)})`;}
const blendPose=(a,b,k)=>{const o={...a};for(const key in b){const va=a[key]??STAND[key]??0;o[key]=typeof b[key]==='number'?lerp(va,b[key],k):b[key];}return o};
// ready-made poses
const POSE={
  stand:()=>({...STAND}),
  walk:(ph,amt=1)=>{const s=Math.sin(ph),c=Math.cos(ph);return {tor:4,hd:2,aB:-s*26*amt,eB:18,aF:s*26*amt,eF:22,lB:s*24*amt,kB:Math.max(0,-c)*36*amt+4,lF:-s*24*amt,kF:Math.max(0,c)*36*amt+4,bob:-Math.abs(c)*6}},
  descend:(ph)=>{const s=Math.sin(ph);return {tor:-10,hd:14,aB:30,eB:30,aF:46+s*8,eF:40,lB:20+s*14,kB:30,lF:-10-s*14,kF:14}},
  seatBraced:(pull=0)=>({tor:-22-pull*10,hd:10,aB:72+pull*10,eB:10,aF:66+pull*14,eF:16,lB:78,kB:88,lF:70,kF:70}),
  hang:(t)=>({tor:Math.sin(t*1.1)*4,hd:-18,aB:172+Math.sin(t*2)*4,eB:8,aF:176-Math.sin(t*2)*4,eF:8,lB:4+Math.sin(t*1.3)*6,kB:14,lF:-6+Math.sin(t*1.5)*8,kF:22}),
  climbFail:(t)=>{const s=Math.sin(t*6);return {tor:0,hd:-22,aB:170+s*10,eB:20+s*20,aF:170-s*10,eF:20-s*20,lB:20+s*14,kB:40,lF:-6-s*10,kF:30}},
  tumble:(t,seed=0)=>({tor:noise1(t*3,seed)*30,hd:noise1(t*4,seed+1)*30,aB:120+noise1(t*5,seed+2)*90,eB:30+noise1(t*6,seed+3)*40,aF:-40+noise1(t*5.5,seed+4)*100,eF:30+noise1(t*6.3,seed+5)*50,lB:40+noise1(t*4.2,seed+6)*60,kB:40+noise1(t*5.1,seed+7)*40,lF:-30+noise1(t*4.6,seed+8)*60,kF:30+noise1(t*4.9,seed+9)*40}),
  slip:(k)=>({tor:lerp(4,-40,k),hd:lerp(0,-30,k),aB:lerp(-6,150,k),eB:30,aF:lerp(8,110,k),eF:30,lB:lerp(-3,70,k),kB:lerp(4,30,k),lF:lerp(4,40,k),kF:10}),
  lieBack:()=>({tor:0,hd:-6,aB:12,eB:30,aF:-10,eF:20,lB:4,kB:10,lF:-4,kF:20}),
  crawl:(ph)=>{const s=Math.sin(ph),c=Math.cos(ph);return {tor:0,hd:-20,aB:150+s*24,eB:30+Math.max(0,c)*60,aF:150-s*24,eF:30+Math.max(0,-c)*60,lB:6,kB:6,lF:24+s*16,kF:40+s*20}},
  rappel:(t)=>({tor:-18,hd:-10,aB:160,eB:20,aF:120,eF:40,lB:76+Math.sin(t*3)*6,kB:60,lF:70-Math.sin(t*3)*6,kF:66}),
  sitRock:()=>({tor:6,hd:8,aB:40,eB:60,aF:44,eF:66,lB:84,kB:86,lF:88,kF:90}),
  sitFire:()=>({tor:14,hd:18,aB:50,eB:70,aF:56,eF:76,lB:84,kB:96,lF:90,kF:100}),
  kneelPack:(t)=>({tor:34,hd:24,aB:70+Math.sin(t*3)*10,eB:40,aF:80-Math.sin(t*3)*10,eF:30,lB:-6,kB:100,lF:86,kF:92}),
};
const ground=(s)=>(RIG.th+RIG.sh+12)*s;   // hip height above the ground when standing

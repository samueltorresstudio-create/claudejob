import {THREE,setup,lights,M,mesh,box,planks,clouds,sprite,finish,canvasTex} from './common.js';
import {tree,windowsTex} from './props3d.js';
// calle de ciudad al atardecer
const {r,scene}=setup('#4a8ad8','#ffd8a8','#f0c8a0',160,520);
lights(scene,[-25,70,35],0xffe2b8,2.6,0xcfe0ff,0x8a7a7a,1.6,70);
clouds(scene,[[-40,70,-180,8],[50,80,-220,10]]);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(600,600),M(0x6a6a72));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
// asfalto con líneas, aceras con bordillo y baldosas
const road=new THREE.Mesh(new THREE.PlaneGeometry(12,340),M(0xffffff,{map:canvasTex(256,1024,(g,w,h)=>{g.fillStyle='#3a3c44';g.fillRect(0,0,w,h);for(let i=0;i<900;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*.05})`;g.fillRect(Math.random()*w,Math.random()*h,3,3);}
  g.fillStyle='#f2c53a';for(let y=0;y<h;y+=80)g.fillRect(w/2-4,y,8,46);g.fillStyle='#e8e8e8';g.fillRect(8,0,5,h);g.fillRect(w-13,0,5,h);},[1,6])}));
road.rotation.x=-Math.PI/2;road.position.set(0,.02,-100);road.receiveShadow=true;scene.add(road);
const tiles=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#bdb6aa';g.fillRect(0,0,w,h);g.strokeStyle='#9a9488';g.lineWidth=3;for(let i=0;i<=w;i+=64){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke();}},[3,60]);
[-1,1].forEach(sd=>{mesh(box(7,.35,260,.02),M(0xffffff,{map:tiles}),sd*9.5,.17,-60);mesh(box(.4,.4,260,.06),M(0xd8d2c6),sd*6.1,.2,-60);});
// paso de cebra
for(let i=0;i<7;i++)mesh(box(1.1,.04,4,.01),M(0xf2f2f2),-4.5+i*1.5,.05,12);
// edificios a ambos lados
const pal=[['#d98a5a','#f4e6d0'],['#e8c870','#ffffff'],['#7aa8c8','#f4f4f4'],['#c86a6a','#f2e2d2'],['#9ac08a','#ffffff'],['#e6d8c0','#7a5a3a'],['#8a7ab8','#f2eaf6'],['#f2a07a','#ffffff']];
const signs=['CAFÉ','HOTEL','PANADERÍA','BANCO','FARMACIA','PIZZA','LIBROS','CINE'];
function building(x,z,w,d,floors,i,side){const g=new THREE.Group();const [wall,frame]=pal[i%pal.length];const fh=3.2,H=floors*fh+1.5;
  const tex=windowsTex(wall,frame,'#5a7a9a',3,floors,.25);tex.repeat.set(Math.round(w/4.5),1);
  const mat=M(0xffffff,{map:tex});const plain=M(new THREE.Color(wall));
  const b=mesh(box(w,H-fh,d,.1),[plain,plain,plain,plain,side>0?mat:plain,side<0?mat:plain].length?plain:plain,0,fh+(H-fh)/2,0,g);
  b.material=[mat,mat,plain,plain,mat,mat];
  // planta baja: escaparate, toldo y cartel
  mesh(box(w,fh,d,.08),M(0x4a3a34),0,fh/2,0,g);
  mesh(box(w*.7,fh*.62,.15,.03),M(0x9ad0f0,{roughness:.1,metalness:.3,emissive:0xffc070,emissiveIntensity:.25}),0,fh*.48,side*(-d/2-.02)*-1,g);
  const awn=mesh(box(w*.85,.15,1.6,.04),M(0xffffff,{map:canvasTex(128,32,(c,ww,hh)=>{for(let k=0;k<8;k++){c.fillStyle=k%2?'#ffffff':['#c8302e','#2f6aa8','#3a8a3a','#e8a020'][i%4];c.fillRect(k*ww/8,0,ww/8,hh);}})}),0,fh+.1,side*(d/2+.7)*-1,g);awn.rotation.x=side*.3;
  const sg=canvasTex(512,128,(c,ww,hh)=>{c.fillStyle='#1e2230';c.fillRect(0,0,ww,hh);c.strokeStyle='#f2c53a';c.lineWidth=8;c.strokeRect(6,6,ww-12,hh-12);c.fillStyle='#fff3c8';c.font='900 70px Inter, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(signs[i%signs.length],ww/2,hh/2+4);});
  const sm=mesh(new THREE.PlaneGeometry(w*.6,.9),new THREE.MeshStandardMaterial({map:sg,emissive:0xffffff,emissiveMap:sg,emissiveIntensity:.35}),0,fh+.75,side*(d/2+.03)*-1,g);sm.rotation.y=side>0?Math.PI:0;
  // cornisa, depósito de agua o antena
  mesh(box(w+.4,.4,d+.4,.06),M(0xe8e2d6),0,H,0,g);
  if(i%3==0){const t=new THREE.Group();mesh(new THREE.CylinderGeometry(1,1,1.6,16),M(0x8a5a32),0,1.6,0,t);mesh(new THREE.ConeGeometry(1.1,.8,16),M(0x4a3a2a),0,2.8,0,t);[[-.7,-.7],[.7,-.7],[-.7,.7],[.7,.7]].forEach(([a,c])=>mesh(new THREE.CylinderGeometry(.06,.06,1.2,6),M(0x3a3a3a),a,.4,c,t));t.position.set(w*.2,H,0);g.add(t);}
  if(i%3==1){mesh(new THREE.CylinderGeometry(.05,.05,4,6),M(0x8a8a8a,{metalness:.6}),-w*.25,H+2,0,g);mesh(box(1.4,1,.2,.05),M(0xc8c8c8),w*.2,H+.6,d*.2,g);}
  // balcones
  for(let f=1;f<floors;f++)if((f+i)%2==0)mesh(box(w*.4,.15,1,.03),M(0x2a2a2a,{metalness:.5}),0,f*fh+fh,side*(d/2+.5)*-1,g);
  g.position.set(x,0,z);scene.add(g);return g;}
let zz=6;[[8,4],[9,6],[7,3],[10,8],[8,5],[9,4],[11,9],[8,6]].forEach(([w,f],i)=>{building(-17,zz-w/2,10,w,f,i,-1);zz-=w+.3;});
zz=4;[[9,5],[7,7],[10,4],[8,9],[9,5],[10,6],[8,4],[9,7]].forEach(([w,f],i)=>{building(17,zz-w/2,10,w,f,i+3,1);zz-=w+.3;});
// rascacielos al fondo
[[-30,-150,14,70,0x5a7aa8],[0,-170,16,90,0x7a8ab8],[26,-150,12,60,0x6a9ab0],[-8,-190,18,110,0x8a9ac8],[44,-180,14,80,0x5a6a98]].forEach(([x,z,w,h,c])=>{const t=windowsTex('#'+c.toString(16),'#2a3a5a','#bcd8f0',4,14,.3);t.repeat.set(1,1);mesh(box(w,h,w,.2),M(0xffffff,{map:t}),x,h/2,z);});
// farolas, árboles, papelera, boca de incendios, semáforo
function lamp(x,z,sd){const g=new THREE.Group();mesh(new THREE.CylinderGeometry(.12,.16,6,10),M(0x2a2e38,{metalness:.5}),0,3,0,g);const arm=mesh(box(1.6,.12,.12,.03),M(0x2a2e38),sd*-.7,6,0,g);
  mesh(box(.7,.3,.5,.08),M(0x2a2e38),sd*-1.4,5.9,0,g);mesh(new THREE.SphereGeometry(.22,12,8),M(0xffe2a0,{emissive:0xffc060,emissiveIntensity:1.6}),sd*-1.4,5.7,0,g);g.position.set(x,.35,z);scene.add(g);}
for(let z=4;z>-80;z-=14){lamp(-6.8,z,-1);lamp(6.8,z-7,1);tree(scene,-8.6,z-5,.6,0x5a9a3a);tree(scene,8.6,z-12,.6,0x5a9a3a);}
mesh(new THREE.CylinderGeometry(.35,.3,.9,12),M(0xc8302e,{roughness:.4}),7.2,.8,1.5);mesh(new THREE.SphereGeometry(.35,12,8,0,Math.PI*2,0,Math.PI/2),M(0xc8302e),7.2,1.25,1.5);
mesh(new THREE.CylinderGeometry(.4,.35,1.1,12),M(0x3a6a3a),-7.2,.9,2.5);
const tl=new THREE.Group();mesh(new THREE.CylinderGeometry(.1,.1,5,8),M(0x2a2e38),0,2.5,0,tl);mesh(box(.6,1.6,.5,.1),M(0x1e2230),0,5,0,tl);[[.5,0xff3a3a,.2],[0,0xf2c53a,.2],[-.5,0x3ae86a,2]].forEach(([y,c,e])=>mesh(new THREE.SphereGeometry(.17,12,8),M(c,{emissive:c,emissiveIntensity:e}),0,5+y,.26,tl));tl.position.set(6.6,.35,-3.5);scene.add(tl);
// coches
function car(x,z,col,rot){const g=new THREE.Group();mesh(box(2,1,4.2,.35),M(col,{roughness:.35,metalness:.3}),0,.85,0,g);mesh(box(1.8,.9,2.2,.35),M(col,{roughness:.35,metalness:.3}),0,1.65,-.2,g);
  mesh(box(1.82,.65,2,.2),M(0x9ad0f0,{roughness:.05,metalness:.3}),0,1.7,-.2,g);[[-1,1.4],[1,1.4],[-1,-1.4],[1,-1.4]].forEach(([a,b])=>{const w=mesh(new THREE.CylinderGeometry(.45,.45,.35,18),M(0x1a1a1a),a,.45,b,g);w.rotation.z=Math.PI/2;});
  [-.6,.6].forEach(a=>mesh(box(.4,.2,.1,.04),M(0xfff6c8,{emissive:0xfff0a0,emissiveIntensity:1}),a,.95,2.1,g));[-.6,.6].forEach(a=>mesh(box(.4,.2,.1,.04),M(0xff3a3a,{emissive:0xff2020,emissiveIntensity:.8}),a,.95,-2.1,g));
  g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);}
car(-2.8,-14,0xe8b020,0);car(2.8,-22,0x2f6aa8,Math.PI);car(-2.8,-34,0xc8302e,0);car(2.8,-50,0xf2f2f2,Math.PI);

// ===== DETALLE =====
// marquesina de autobús con anuncio, kiosco de prensa, puesto de helados, bancos, macetas, bicis, buzón, cabina, papeleras, señales, bolardos, banderines y peatones-silueta
function busStop(x,z,ry){const g=new THREE.Group();g.position.set(x,.35,z);g.rotation.y=ry;scene.add(g);mesh(box(4,.12,1.6,.04),M(0x2a2e38),0,3,0,g);[-1.9,1.9].forEach(a=>mesh(new THREE.CylinderGeometry(.06,.06,3,8),M(0x8a8f96,{metalness:.5}),a,1.5,-.7,g));
  mesh(box(3.8,2.4,.06,.02),M(0x9ad0f0,{transparent:true,opacity:.35,roughness:.05}),0,1.6,-.75,g);const ad=canvasTex(256,384,(c,w,h)=>{c.fillStyle='#ffd34a';c.fillRect(0,0,w,h);c.fillStyle='#1b1720';c.font='900 64px Inter';c.textAlign='center';c.fillText('ARCHIVO',w/2,120);c.fillText('RARO',w/2,190);c.fillStyle='#e94b3c';c.beginPath();c.arc(w/2,280,60,0,7);c.fill();c.fillStyle='#fff';c.font='900 48px Inter';c.fillText('?',w/2,298);});
  mesh(box(1.2,1.9,.12,.03),M(0xffffff,{map:ad,emissive:0xffffff,emissiveMap:ad,emissiveIntensity:.3}),1.2,1.4,-.7,g);mesh(box(2.4,.1,.5,.03),M(0x8a5a32),-.6,.6,-.4,g);
  const sg=canvasTex(128,128,(c,w,h)=>{c.fillStyle='#e94b3c';c.beginPath();c.arc(64,64,62,0,7);c.fill();c.fillStyle='#fff';c.font='900 70px Inter';c.textAlign='center';c.fillText('BUS',64,88);});mesh(new THREE.CircleGeometry(.4,24),new THREE.MeshStandardMaterial({map:sg,side:THREE.DoubleSide}),-2.4,3.3,0,g);mesh(new THREE.CylinderGeometry(.04,.04,3.4,6),M(0x8a8f96),-2.4,1.7,0,g);}
busStop(-9.2,-2,Math.PI/2);
const ic=new THREE.Group();ic.position.set(8.2,.35,3.5);ic.rotation.y=-.6;scene.add(ic);mesh(box(1.8,1,1,.1),M(0xf2f2f2),0,.9,0,ic);mesh(box(1.82,.25,1.02,.05),M(0xff8ab0),0,.55,0,ic);[[-.6,.3],[.6,.3]].forEach(([x])=>mesh(new THREE.CylinderGeometry(.3,.3,.08,16),M(0x1b1b1f),x,.3,.52,ic).rotation.x=Math.PI/2);
const um=mesh(new THREE.ConeGeometry(1.4,.6,12),M(0xff8ab0),0,2.6,0,ic);mesh(new THREE.CylinderGeometry(.03,.03,1.6,6),M(0xdddddd),0,1.9,0,ic);for(let i=0;i<12;i+=2){const st=mesh(new THREE.ConeGeometry(1.41,.6,12,1,true,i/12*Math.PI*2,Math.PI/6),M(0xffffff,{side:THREE.DoubleSide}),0,2.6,0,ic);}
[[-.5,0xffc0d8],[0,0x7ad0a8],[.5,0xf2d16a]].forEach(([x,c])=>{mesh(new THREE.ConeGeometry(.12,.35,10),M(0xd9a050),x,1.55,.1,ic).rotation.x=Math.PI;mesh(new THREE.SphereGeometry(.15,12,8),M(c),x,1.8,.1,ic);});
function bench(x,z,ry){const g=new THREE.Group();g.position.set(x,.35,z);g.rotation.y=ry;scene.add(g);for(let k=0;k<3;k++)mesh(box(2,.06,.14,.02),M(0xa8743f),0,.5,-.18+k*.17,g);for(let k=0;k<2;k++)mesh(box(2,.14,.05,.02),M(0xa8743f),0,.75+k*.18,-.26,g);[-.85,.85].forEach(a=>mesh(box(.06,.5,.5,.02),M(0x2a2e38),a,.25,0,g));}
bench(-8.4,6,Math.PI/2);bench(8.4,-14,-Math.PI/2);
function pot(x,z){mesh(new THREE.CylinderGeometry(.45,.35,.7,14),M(0xb5603f),x,.7,z);mesh(new THREE.IcosahedronGeometry(.55,1),M(0x4f9a3a,{flatShading:true}),x,1.35,z);[0,1,2].forEach(k=>mesh(new THREE.SphereGeometry(.09,8,6),M([0xff6a8a,0xffd34a,0xffffff][k]),x+Math.cos(k*2)*.4,1.55,z+Math.sin(k*2)*.4));}
[[-7,8],[7,6],[-7,-10],[7,-22]].forEach(([x,z])=>pot(x,z));
function bike(x,z,ry,c){const g=new THREE.Group();g.position.set(x,.35,z);g.rotation.y=ry;scene.add(g);[-.55,.55].forEach(a=>mesh(new THREE.TorusGeometry(.34,.035,8,24),M(0x1b1b1f),a,.36,0,g));
  [[0,.55,1.1,0],[-.2,.45,.55,.9],[.25,.5,.6,-.9]].forEach(([a,y,w,r])=>{const m=mesh(box(w,.04,.04,.01),M(c,{metalness:.3}),a,y,0,g);m.rotation.z=r;});mesh(box(.28,.06,.12,.02),M(0x1b1b1f),-.3,.82,0,g);mesh(box(.05,.05,.5,.01),M(0x8a8f96),.45,.86,0,g);}
bike(7.6,-2.6,.2,0x2f6aa8);bike(7.6,-1.6,.1,0xe94b3c);
const mbx=new THREE.Group();mbx.position.set(-7.4,.35,1);scene.add(mbx);mesh(box(.6,1.1,.5,.08),M(0xffd34a),0,.55,0,mbx);mesh(new THREE.CylinderGeometry(.3,.3,.6,14,1,false,0,Math.PI),M(0xffd34a),0,1.1,0,mbx).rotation.z=Math.PI/2;mesh(box(.4,.05,.05,.01),M(0x1b1720),0,.9,.26,mbx);
const ph=new THREE.Group();ph.position.set(-7.6,.35,-16);scene.add(ph);mesh(box(1,2.6,1,.06),M(0x2f6aa8),0,1.3,0,ph);mesh(box(.8,1.6,.05,.02),M(0x9ad0f0,{roughness:.05,transparent:true,opacity:.6}),0,1.4,.51,ph);mesh(box(1.02,.3,1.02,.03),M(0xffffff),0,2.5,0,ph);
[[-6.4,12],[6.4,-6],[6.4,-30],[-6.4,-26]].forEach(([x,z])=>{mesh(new THREE.CylinderGeometry(.3,.26,.9,14),M(0x3a6a3a),x,.8,z);mesh(new THREE.CylinderGeometry(.32,.32,.06,14),M(0x2a2e38),x,1.26,z);});
for(let z=10;z>-60;z-=2.4)[-6.4,6.4].forEach(x=>{if(Math.abs((z*7)%5)<1.2){mesh(new THREE.CylinderGeometry(.1,.12,.8,10),M(0x2a2e38,{metalness:.4}),x,.75,z);mesh(new THREE.SphereGeometry(.12,10,6),M(0xd9a53a,{metalness:.5}),x,1.17,z);}});
const stop=canvasTex(128,128,(c,w,h)=>{c.fillStyle='#e94b3c';c.beginPath();for(let i=0;i<8;i++){const a=i/8*6.283+.39;c.lineTo(64+Math.cos(a)*62,64+Math.sin(a)*62);}c.fill();c.fillStyle='#fff';c.font='900 36px Inter';c.textAlign='center';c.fillText('STOP',64,77);});
mesh(new THREE.CylinderGeometry(.05,.05,3,6),M(0x8a8f96),-6.6,1.85,14);mesh(new THREE.CircleGeometry(.45,8),new THREE.MeshStandardMaterial({map:stop,side:THREE.DoubleSide}),-6.6,3.2,14.05);
// banderines cruzando la calle
for(let k=0;k<3;k++){const z=-8-k*14,y=9+k*.4;const pts=[];for(let i=0;i<=20;i++){const x=-6.8+i*.68;pts.push(new THREE.Vector3(x,y-Math.sin(i/20*Math.PI)*1.2,z));}
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,.02,4),M(0xeeeeee));pts.forEach((p,i)=>{if(i%2)return;const f=mesh(new THREE.ConeGeometry(.3,.6,3),M([0xe94b3c,0xffd34a,0x2f6aa8,0x3a8a3a,0xff8ab0][i%5]),p.x,p.y-.35,p.z);f.rotation.x=Math.PI;});}
// peatones silueta al fondo (2D, de colores) y pájaros
const ped=(x,z,c,h=1.7)=>{const g=new THREE.Group();g.position.set(x,.35,z);scene.add(g);mesh(new THREE.CapsuleGeometry(.22,.5,4,10),M(c),0,.95,0,g);mesh(new THREE.SphereGeometry(.2,12,8),M(0xf6eee8),0,1.55,0,g);[-.1,.1].forEach(a=>mesh(new THREE.CylinderGeometry(.05,.05,.6,6),M(0x1b1720),a,.3,0,g));g.scale.setScalar(h/1.7);};
[[-8,-30,0x7a3fbf],[-8.6,-34,0xe94b3c],[8.2,-40,0x2f6aa8],[8.8,-26,0xffd34a],[-8.2,-46,0x3a8a3a]].forEach(([x,z,c])=>ped(x,z,c));
// alcantarillas, manchas y paso de peatones mejor
const mh=canvasTex(128,128,(c,w,h)=>{c.fillStyle='#3a3c42';c.beginPath();c.arc(64,64,62,0,7);c.fill();c.strokeStyle='#26282d';c.lineWidth=5;for(let i=0;i<8;i++){c.beginPath();c.moveTo(16,20+i*12);c.lineTo(112,20+i*12);c.stroke();}});
[[-2.8,2],[2.8,-18],[-2.8,-38]].forEach(([x,z])=>{const m=mesh(new THREE.CircleGeometry(.5,24),M(0xffffff,{map:mh,metalness:.5}),x,.03,z);m.rotation.x=-Math.PI/2;});

// personajes del canal en la acera
const mil=await sprite(scene,'millonario',[-250,-730,560,750],2.5,4.4,.05,6.5);
const dog=await sprite(scene,'perro',[-200,-560,460,580],1.25,3.4,.05,8.4);
const ck=await sprite(scene,'cocinero',[-280,-940,640,960],2.8,2.2,.05,6.8);
const cam=new THREE.PerspectiveCamera(50,1080/1920,.1,1000);cam.position.set(5.2,2.6,23);cam.lookAt(-.8,7.8,-40);
[mil,dog,ck].forEach(s=>s.lookAt(cam.position.x,s.position.y,cam.position.z));
finish(r,scene,cam);

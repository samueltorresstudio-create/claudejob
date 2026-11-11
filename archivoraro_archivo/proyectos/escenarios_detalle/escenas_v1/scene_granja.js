import {THREE,setup,lights,M,mesh,box,planks,clouds,sprite,finish,canvasTex} from './common.js';
import {tree,gable,roof,fence,windowsTex} from './props3d.js';
import {cow,pig,chick3d,sunflower,flower,crate,barrel} from './extras.js';
const {r,scene}=setup('#5cb2ee','#e4f5ff','#d6ecf6',80,320);
lights(scene,[50,70,40],0xfff1d6,2.6,0xd6ecff,0x7a8a5a,1.25,50);
clouds(scene,[[-50,46,-120,6],[30,58,-160,8],[80,40,-110,5],[-10,64,-200,9]]);
// suelo con variación de color
const gg=new THREE.PlaneGeometry(500,500,120,120);gg.rotateX(-Math.PI/2);const gp=gg.attributes.position;const gc=new Float32Array(gp.count*3);const a=new THREE.Color(0x6fb84a),b=new THREE.Color(0x5a9e3c);
for(let i=0;i<gp.count;i++){const x=gp.getX(i),z=gp.getZ(i);const fl=Math.min(1,Math.max(0,(Math.hypot(x*.6,z-(-10))-30)/30));gp.setY(i,-.05+fl*(Math.sin(x*.05)*.8+Math.cos(z*.04)*.9)+(z<-60?Math.sin(x*.03)*3*Math.min(1,(-60-z)/60):0));const c=a.clone().lerp(b,(Math.sin(x*.3)*Math.cos(z*.27)+1)/2);gc.set([c.r,c.g,c.b],i*3);}
gg.setAttribute('color',new THREE.BufferAttribute(gc,3));gg.computeVertexNormals();const ground=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));ground.receiveShadow=true;scene.add(ground);
// camino de tierra
const path=new THREE.Mesh(new THREE.PlaneGeometry(5,70,1,1),M(0xc8a26a,{map:canvasTex(256,1024,(g,w,h)=>{g.fillStyle='#c8a26a';g.fillRect(0,0,w,h);for(let i=0;i<500;i++){g.fillStyle=Math.random()<.5?'#b08a54':'#dcb882';g.beginPath();g.arc(Math.random()*w,Math.random()*h,2+Math.random()*5,0,7);g.fill();}g.fillStyle='rgba(0,0,0,.08)';g.fillRect(w*.25,0,w*.1,h);g.fillRect(w*.65,0,w*.1,h);})}));
path.rotation.x=-Math.PI/2;path.position.set(0,.05,4);path.receiveShadow=true;scene.add(path);
// campo arado con cultivos
for(let i=0;i<12;i++){mesh(box(1.2,.5,30,.2),M(0x8a5a32),-26+i*1.8,0,-12);for(let k=0;k<12;k++)mesh(new THREE.IcosahedronGeometry(.45,0),M(0x4a9a2a,{flatShading:true}),-26+i*1.8,.6,-26+k*2.4);}
// GRANERO rojo
const barn=new THREE.Group();scene.add(barn);
const red=M(0xb5322a,{map:planks('#b5322a','#8a2018',12,512,512,true)});
mesh(box(10,7,12,.1),red,0,3.5,0,barn);const gb=gable(10,4,12,0xb5322a);gb.material=red;gb.position.set(0,7,0);barn.add(gb);gb.castShadow=true;
const rf=roof(10,4,12,0x4a4e58,.6);rf.position.set(0,7,0);barn.add(rf);
const white=M(0xf4f0e8);
[[-5,3.5],[5,3.5]].forEach(([x,y])=>mesh(box(.35,7.2,.35,.05),white,x,y,6.05,barn));mesh(box(10.4,.35,.35,.05),white,0,7,6.05,barn);mesh(box(10.4,.35,.35,.05),white,0,.15,6.05,barn);
// puertas grandes con X blanca
[-1.6,1.6].forEach(x=>{mesh(box(3.1,4.6,.2,.05),M(0x9a2820),x,2.3,6.1,barn);mesh(box(3.1,.25,.25,.04),white,x,4.5,6.25,barn);mesh(box(3.1,.25,.25,.04),white,x,.2,6.25,barn);mesh(box(.25,4.6,.25,.04),white,x-1.45,2.3,6.25,barn);mesh(box(.25,4.6,.25,.04),white,x+1.45,2.3,6.25,barn);
  [1,-1].forEach(sd=>{const d=mesh(box(5.2,.22,.2,.04),white,x,2.3,6.28,barn);d.rotation.z=sd*Math.atan2(4.4,2.9);d.scale.x=.98;});});
mesh(box(2.4,2,.2,.05),M(0x9a2820),0,8.6,6.1,barn);[[0,9.7],[0,7.5]].forEach(([x,y])=>mesh(box(2.7,.22,.25,.04),white,x,y,6.25,barn));
const loft=mesh(new THREE.CylinderGeometry(.6,.6,.3,24),M(0xf4f0e8),0,8.6,6.25,barn);loft.rotation.x=Math.PI/2;
mesh(box(.6,.6,.6,.05),M(0xd9a53a),0,11.6,0,barn);const vane=mesh(box(1.6,.08,.08,.02),M(0x2a2a2a,{metalness:.6}),0,12.3,0,barn);mesh(new THREE.ConeGeometry(.25,.6,4),M(0x2a2a2a),.9,12.3,0,barn).rotation.z=-Math.PI/2;
barn.position.set(-2,0,-22);barn.rotation.y=.2;
// SILO
const silo=new THREE.Group();scene.add(silo);mesh(new THREE.CylinderGeometry(2.6,2.6,13,32),M(0x9ab0bf,{metalness:.3,roughness:.5}),0,6.5,0,silo);
for(let y=1;y<13;y+=1.6)mesh(new THREE.TorusGeometry(2.62,.07,6,48),M(0x7a8a96,{metalness:.4}),0,y,0,silo).rotation.x=Math.PI/2;
mesh(new THREE.SphereGeometry(2.7,32,16,0,Math.PI*2,0,Math.PI/2),M(0x6a7a86,{metalness:.4,roughness:.4}),0,13,0,silo);
for(let y=.5;y<12.5;y+=.6)mesh(box(.9,.07,.07,.02),M(0x3a3a3a),0,y,2.7,silo);[-.45,.45].forEach(x=>mesh(box(.08,12.5,.08,.02),M(0x3a3a3a),x,6.25,2.7,silo));
silo.position.set(-11,0,-26);
// CASA de la granja
const house=new THREE.Group();scene.add(house);
mesh(box(9,4.6,7,.08),M(0xffffff,{map:windowsTex('#f2e6cc','#ffffff','#7ab4d8',3,1)}),0,2.3,0,house);const hg=gable(9,3,7,0xf2e6cc);hg.position.set(0,4.6,0);house.add(hg);
const hr=roof(9,3,7,0x3a6a9a,.5);hr.position.set(0,4.6,0);house.add(hr);mesh(box(1,3,1,.06),M(0x9a5a3a),2.6,7.4,0,house);
mesh(box(9.6,.25,2.6,.05),M(0xa07448),0,.25,4.6,house);[-4.3,-1.5,1.5,4.3].forEach(x=>mesh(new THREE.CylinderGeometry(.12,.12,3.4,8),white,x,1.9,5.6,house));mesh(box(9.6,.3,2.8,.05),M(0x3a6a9a),0,3.7,4.7,house);
mesh(box(1.4,2.6,.15,.05),M(0x8a4a2a),0,1.6,3.55,house);
house.position.set(16,0,-30);house.rotation.y=-.35;
// cerca a lo largo del camino y balas de paja
fence(scene,-3.4,22,-3.4,-12);fence(scene,3.4,22,3.4,-8);fence(scene,3.4,-8,12,-14);
const hay=M(0xe6c25a,{map:canvasTex(256,256,(g,w,h)=>{g.fillStyle='#e6c25a';g.fillRect(0,0,w,h);for(let i=0;i<300;i++){g.strokeStyle=Math.random()<.5?'#c8a03a':'#f4dc8a';g.lineWidth=2;g.beginPath();const x=Math.random()*w,y=Math.random()*h;g.moveTo(x,y);g.lineTo(x+Math.random()*30-15,y+Math.random()*10);g.stroke();}})});
[[-7,2],[-8.6,3.4],[-7.6,5],[11.6,-2]].forEach(([x,z],i)=>{const h=mesh(new THREE.CylinderGeometry(1.1,1.1,1.6,28),hay,x,1.1,z);h.rotation.z=Math.PI/2;h.rotation.y=i*.6;});
// molino de agua (torre de celosía) y árboles
const mill=new THREE.Group();scene.add(mill);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{const l=mesh(new THREE.CylinderGeometry(.08,.08,12,6),M(0x8a8a8a,{metalness:.5}),a*.9,6,b*.9,mill);l.rotation.set(b*.08,0,-a*.08);});
for(let y=2;y<12;y+=2.5)mesh(box(2.2-y*.1,.08,2.2-y*.1,.02),M(0x8a8a8a,{metalness:.5}),0,y,0,mill);
const fan=new THREE.Group();for(let i=0;i<12;i++){const bl=mesh(box(.5,2.2,.06,.02),M(0xe8e8e8,{metalness:.3}),0,1.4,0);const p=new THREE.Group();p.add(bl);p.rotation.z=i/12*Math.PI*2;fan.add(p);}
fan.position.set(0,12.4,1);mill.add(fan);mesh(box(.3,.3,3,.05),M(0x8a8a8a),0,12.4,-.4,mill);mesh(box(.06,1.6,1.4,.02),M(0xc8302e),0,12.6,-2,mill);mill.position.set(-17,0,-14);
[[-24,-40,1.6],[22,-48,1.8],[30,-20,1.5],[-30,-6,1.3],[12,-60,2],[-6,-62,1.8],[28,8,1.4]].forEach(([x,z,s])=>tree(scene,x,z,s));
// tractor verde
const tr=new THREE.Group();scene.add(tr);mesh(box(3,1.4,1.8,.25),M(0x3a8a3a,{roughness:.5}),.6,1.6,0,tr);mesh(box(1.6,1.8,1.7,.2),M(0x3a8a3a),-.8,2.6,0,tr);mesh(box(1.5,1.2,1.75,.1),M(0x9ad0f0,{roughness:.1,metalness:.2}),-.8,2.8,0,tr);mesh(box(1.8,.2,1.9,.06),M(0x2a2a2a),-.8,3.6,0,tr);
[[-1,1.1,1.25,1.2],[1.6,.65,.75,1.1]].forEach(([x,y,rr,zz])=>[1,-1].forEach(sd=>{const w=mesh(new THREE.CylinderGeometry(rr,rr,.6,24),M(0x222222),x,y,sd*zz,tr);w.rotation.x=Math.PI/2;const hb=mesh(new THREE.CylinderGeometry(rr*.5,rr*.5,.62,16),M(0xe6c23a),x,y,sd*zz,tr);hb.rotation.x=Math.PI/2;}));
mesh(new THREE.CylinderGeometry(.1,.1,1.2,8),M(0x333333,{metalness:.6}),1.4,2.6,.4,tr);tr.position.set(8,0,-6);tr.rotation.y=-2.2;

// ===== DETALLE =====
// corral con vaca y cerdos, charco de barro, abrevadero
fence(scene,4.6,4,10,4);fence(scene,10,4,10,15);fence(scene,4.6,4,4.6,15);
const mud=mesh(new THREE.CircleGeometry(1.6,24),M(0x6a4a2a,{roughness:.3}),7.6,.03,12);mud.rotation.x=-Math.PI/2;mud.scale.y=.6;
cow(scene,7.4,7.4,1,-2.4);pig(scene,6.4,12.2,.9,-1.2);pig(scene,8.4,13,.7,-2.2);
const tr2=mesh(box(1.8,.5,.6,.05),M(0x8a5a32),8.6,.3,5.2);mesh(box(1.6,.06,.45,.02),M(0x5a9ad0,{roughness:.1}),8.6,.52,5.2);
// gallinas sueltas y gallinero
[[-1.2,6.4,1],[-.6,8,2.4],[-1.6,9.4,.4],[.2,5.2,3],[-2,7.4,1.6]].forEach(([x,z,r],i)=>chick3d(scene,x,z,1,r,i%2?0xa8452a:0xf6f2ea));
const coop=new THREE.Group();coop.position.set(-6.4,0,10);coop.rotation.y=.4;scene.add(coop);mesh(box(2.2,1.6,1.8,.05),M(0xc8a46a),0,1.4,0,coop);const cr=roof(2.2,.8,1.8,0xb5322a,.3);cr.position.y=2.2;coop.add(cr);
[-.8,.8].forEach(x=>[-.7,.7].forEach(z=>mesh(new THREE.CylinderGeometry(.06,.06,.6,6),M(0x6a4428),x,.3,z,coop)));const rmp=mesh(box(.5,.06,1.4,.02),M(0x8a5a32),.6,.4,1.4,coop);rmp.rotation.x=.5;mesh(box(.5,.5,.05,.02),M(0x2a1a10),.6,1.2,.91,coop);
// girasoles junto a la valla, buzón, pozo, espantapájaros, carretilla, cajas de verduras, flores
for(let i=0;i<8;i++)sunflower(scene,-4.6-(i%2)*.6,-2+i*1.6,2+(i%3)*.3);
const mb=new THREE.Group();mb.position.set(3.9,0,20);scene.add(mb);mesh(new THREE.CylinderGeometry(.06,.06,1.2,6),M(0x6a4428),0,.6,0,mb);const bx=mesh(new THREE.CapsuleGeometry(.22,.5,6,12),M(0x2f6aa8),0,1.3,0,mb);bx.rotation.x=Math.PI/2;mesh(box(.04,.3,.12,.01),M(0xe94b3c),.25,1.45,-.1,mb);
const well=new THREE.Group();well.position.set(6.2,0,-1);scene.add(well);mesh(new THREE.CylinderGeometry(.9,.95,1,20,1,true),M(0x9a9aa2,{side:THREE.DoubleSide,map:canvasTex(256,64,(c,w,h)=>{c.fillStyle='#9a9aa2';c.fillRect(0,0,w,h);c.strokeStyle='#6a6a72';c.lineWidth=3;for(let y=0;y<h;y+=16){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();for(let x=(y/16%2)*16;x<w;x+=32){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+16);c.stroke();}}})}),0,.5,0,well);
[-.85,.85].forEach(x=>mesh(box(.12,2,.12,.02),M(0x6a4428),x,1.5,0,well));const wr=roof(2,.7,1.2,0x7a3a2a,.2);wr.position.y=2.5;well.add(wr);mesh(new THREE.CylinderGeometry(.18,.18,.25,12),M(0x8a5a32),0,1.6,0,well);
const sc2=new THREE.Group();sc2.position.set(-12,0,-8);scene.add(sc2);mesh(new THREE.CylinderGeometry(.06,.06,3,6),M(0x6a4428),0,1.5,0,sc2);mesh(box(2,.08,.08,.02),M(0x6a4428),0,2.3,0,sc2);mesh(box(1,1.1,.4,.1),M(0x3a6a9a),0,2,0,sc2);mesh(new THREE.SphereGeometry(.35,12,8),M(0xe6c25a),0,2.85,0,sc2);
const hb=mesh(new THREE.CylinderGeometry(.15,.5,.25,16),M(0x8a5a32),0,3.25,0,sc2);mesh(new THREE.CylinderGeometry(.28,.28,.3,16),M(0x8a5a32),0,3.4,0,sc2);[-1,1].forEach(sd=>mesh(new THREE.ConeGeometry(.12,.4,6),M(0xe6c25a),sd*1.05,2.2,0,sc2).rotation.z=sd*Math.PI/2);
const wb=new THREE.Group();wb.position.set(-2,0,13);wb.rotation.y=.8;scene.add(wb);const tb=mesh(box(1.1,.4,.7,.1),M(0x3a8a3a,{metalness:.3}),0,.6,0,wb);mesh(new THREE.CylinderGeometry(.22,.22,.1,16),M(0x1b1b1f),.6,.22,0,wb).rotation.x=Math.PI/2;[-.25,.25].forEach(z=>{const h=mesh(box(1.2,.05,.05,.02),M(0x6a4428),-.8,.6,z,wb);h.rotation.z=.25;});
for(let i=0;i<6;i++)mesh(new THREE.SphereGeometry(.12,8,6),M([0xe94b3c,0xf2a42a,0x5a9a3a][i%3]),-.2+(i%3)*.2,.85,-.15+Math.floor(i/3)*.3,wb);
[[-2.2,6],[-2.4,4.8]].forEach(([x,z],i)=>{crate(scene,x,0,z,.7,i);for(let k=0;k<6;k++)mesh(new THREE.SphereGeometry(.12,8,6),M(i?0xe94b3c:0xf2a42a),x-.2+(k%3)*.2,.75,z-.12+Math.floor(k/3)*.24);});
for(let i=0;i<70;i++)flower(scene,4+Math.random()*12,15+Math.random()*10,[0xff6a8a,0xffd34a,0xffffff,0xb07aff][i%4]);
for(let i=0;i<30;i++){const t=mesh(new THREE.ConeGeometry(.08,.5+Math.random()*.3,4),M(0x4f9a3a),-20+Math.random()*40,.25,-4+Math.random()*30);t.castShadow=false;}

// personajes del canal: la gallina y el perro
const hen=await sprite(scene,'gallina',[-240,-560,480,580],1.6,1.2,0,11);
const dog=await sprite(scene,'perro',[-200,-560,460,580],1.7,1.8,0,5);
const cam=new THREE.PerspectiveCamera(48,1080/1920,.1,1000);cam.position.set(9,8.5,28);cam.lookAt(-.5,4.4,-14);
[hen,dog].forEach(s=>s.lookAt(cam.position.x,s.position.y,cam.position.z));
finish(r,scene,cam);

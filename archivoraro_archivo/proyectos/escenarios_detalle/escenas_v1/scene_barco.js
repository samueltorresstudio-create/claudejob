import {THREE,setup,lights,M,mesh,box,planks,clouds,sprite,finish,canvasTex} from './common.js';
import {sea,foam,island} from './sea.js';
import {gull,barrel,crate} from './extras.js';
const {r,scene}=setup('#4aa6e8','#d9f1ff','#cfeaf8',120,420);
lights(scene,[60,80,40],0xfff3dc,2.6,0xd6ecff,0x6a8aa0,1.2,40);
sea(scene);clouds(scene,[[-60,55,-160,7],[40,70,-200,9],[110,48,-150,6],[-20,80,-240,10]]);
island(scene,-70,-120,2.2);island(scene,80,-150,1.6);
const ship=new THREE.Group();scene.add(ship);
const wood=planks('#7a4a28','#4e2c14',10),woodD=planks('#5a3418','#3a200c',10),deckT=planks('#c89a62','#8a6236',14,512,512,true);
// casco: perfil lateral extruido y estrechado en proa y popa
const sh=new THREE.Shape();sh.moveTo(-9,4.6);sh.lineTo(-8.4,1.2);sh.quadraticCurveTo(-6,-.6,0,-.7);sh.quadraticCurveTo(7,-.6,9.6,3.6);sh.lineTo(9.8,4.2);sh.lineTo(-9,4.6);
const hg=new THREE.ExtrudeGeometry(sh,{depth:5.4,bevelEnabled:true,bevelThickness:.3,bevelSize:.2,bevelSegments:3,steps:1,curveSegments:24});hg.translate(0,0,-2.7);
const hp=hg.attributes.position;for(let i=0;i<hp.count;i++){const x=hp.getX(i),y=hp.getY(i);let t=1-Math.pow(Math.max(0,x-1)/9.2,2.2)*.92;if(x<-6)t*=1-((-6-x)/3)*.25;const v=.45+.55*Math.min(1,Math.max(0,(y+.7)/4.5));hp.setZ(i,hp.getZ(i)*t*v);}
hg.computeVertexNormals();const hullT=canvasTex(256,1024,(g,w,h)=>{const Y=v=>h-(v+.7)/5.6*h;g.fillStyle='#7a4a28';g.fillRect(0,0,w,h);
  for(let v=-.7;v<5;v+=.38){g.fillStyle=`rgba(0,0,0,${.05+Math.random()*.08})`;g.fillRect(0,Y(v+.38),w,Y(v)-Y(v+.38));g.fillStyle='#4e2c14';g.fillRect(0,Y(v)-2,w,3);}
  g.fillStyle='#2a1a10';g.fillRect(0,Y(.55),w,h-Y(.55));g.fillStyle='#d9a53a';g.fillRect(0,Y(2.05),w,Y(1.85)-Y(2.05));g.fillRect(0,Y(3.35),w,Y(3.1)-Y(3.35));
  g.fillStyle='#f0c86a';g.fillRect(0,Y(3.35),w,3);g.fillRect(0,Y(2.05),w,3);});
hullT.repeat.set(1/19,1/5.6);hullT.offset.set(.5,.7/5.6);hullT.wrapS=hullT.wrapT=THREE.RepeatWrapping;
const hull=mesh(hg,M(0xffffff,{map:hullT,roughness:.75}),0,0,0,ship);
// franjas: dorada y oscura en la línea de flotación
const band=(y,h,col)=>{const b=new THREE.ExtrudeGeometry(sh,{depth:5.6,bevelEnabled:false,curveSegments:24});b.translate(0,0,-2.8);const bp=b.attributes.position;for(let i=0;i<bp.count;i++){const x=bp.getX(i),yy=bp.getY(i);let t=1-Math.pow(Math.max(0,x-1)/9.2,2.2)*.92;if(x<-6)t*=1-((-6-x)/3)*.25;const v=.45+.55*Math.min(1,Math.max(0,(yy+.7)/4.5));bp.setZ(i,bp.getZ(i)*t*v*1.02);}
  b.computeVertexNormals();const m=mesh(b,M(col,{roughness:.5,metalness:col==0xd9a53a?.4:0}),0,0,0,ship);m.material.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,1,0),-y),new THREE.Plane(new THREE.Vector3(0,-1,0),y+h)];};

// cubierta
const ds=new THREE.Shape();const half=x=>2.5*(1-Math.pow(Math.max(0,x-1)/9,2.2)*.92)*(x<-6?1-((-6-x)/3)*.25:1);
ds.moveTo(-8.8,0);for(let x=-8.8;x<=9.4;x+=.3)ds.lineTo(x,half(x));for(let x=9.4;x>=-8.8;x-=.3)ds.lineTo(x,-half(x));
const dg=new THREE.ExtrudeGeometry(ds,{depth:.2,bevelEnabled:false});dg.rotateX(Math.PI/2);mesh(dg,M(0xffffff,{map:deckT}),0,4.3,0,ship);
// barandillas
const rail=M(0x5a3418);for(let x=-8.2;x<9;x+=.9){[1,-1].forEach(sd=>{mesh(new THREE.CylinderGeometry(.06,.06,.8,6),rail,x,4.7,sd*(half(x)-.05),ship);});}
[1,-1].forEach(sd=>{const pts=[];for(let x=-8.4;x<=9.2;x+=.4)pts.push(new THREE.Vector3(x,5.1,sd*(half(x)-.05)));mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),80,.09,6),rail,0,0,0,ship);});
// castillo de popa con ventanas iluminadas
mesh(box(3.6,2.4,4.6,.15),M(0xffffff,{map:woodD}),-7.2,5.4,0,ship);mesh(box(3.9,.25,4.9,.08),M(0xd9a53a,{metalness:.4,roughness:.5}),-7.2,6.65,0,ship);
for(let z=-1.5;z<=1.5;z+=1){mesh(box(.12,.8,.6,.04),M(0xffd67a,{emissive:0xffb43a,emissiveIntensity:.9}),-9.05,5.4,z,ship);mesh(box(.14,1,.8,.04),M(0x3a200c),-9.0,5.4,z,ship).scale.set(1,1,1);}
mesh(new THREE.SphereGeometry(.28,16,12),M(0xffd67a,{emissive:0xffb43a,emissiveIntensity:1.2}),-9.3,7.2,0,ship);mesh(new THREE.CylinderGeometry(.04,.04,1.2,6),M(0x2a1a10),-9.3,6.7,0,ship);
mesh(box(2.2,1.2,3.4,.12),M(0xffffff,{map:woodD}),7.6,4.9,0,ship);
// portas y cañones
for(let x=-4.5;x<=5;x+=2.4){[1,-1].forEach(sd=>{mesh(box(.8,.7,.1,.04),M(0x1a1008),x,2.6,sd*(half(x)+.08),ship);const c=mesh(new THREE.CylinderGeometry(.16,.2,1.1,14),M(0x2a2c30,{metalness:.6,roughness:.4}),x,2.6,sd*(half(x)+.5),ship);c.rotation.x=Math.PI/2;});}
// mástiles, vergas y velas
const mastM=M(0x6a4024),sailM=new THREE.MeshStandardMaterial({color:0xf5ecd8,roughness:.9,side:THREE.DoubleSide});
function sail(w,h,bulge){const g=new THREE.PlaneGeometry(w,h,16,12);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/w*2,y=p.getY(i)/h*2;p.setZ(i,bulge*(1-x*x)*(1-.5*y*y));}g.computeVertexNormals();return g;}
[[-3.4,15,[[5.5,3.4],[10,2.8]]],[1.2,18,[[6.2,3.8],[11,3.2],[15,2.2]]],[5.6,13,[[5,3.2],[9,2.6]]]].forEach(([x,h,sails],mi)=>{
  mesh(new THREE.CylinderGeometry(.2,.28,h,12),mastM,x,4.3+h/2,0,ship);
  sails.forEach(([y,hh],k)=>{const w=6.4-k*1.3-(mi==2?.8:0);const yard=mesh(new THREE.CylinderGeometry(.09,.09,w+.6,8),mastM,x,4.3+y+hh/2+.1,0,ship);yard.rotation.x=Math.PI/2;
    const s=mesh(sail(w,hh,.9),sailM,x+.35,4.3+y,0,ship);s.rotation.y=Math.PI/2;
    const st=canvasTex(64,64,(g)=>{g.fillStyle='#f5ecd8';g.fillRect(0,0,64,64);g.fillStyle='#e2d6bc';for(let i=0;i<64;i+=16)g.fillRect(i,0,2,64);});s.material=sailM.clone();s.material.map=st;});
  if(mi==1){const nest=mesh(new THREE.CylinderGeometry(.9,.7,.7,16,1,true),M(0x6a4024,{side:THREE.DoubleSide}),x,4.3+h-2.4,0,ship);}
  const flag=mesh(sail(1.8,1,.2),new THREE.MeshStandardMaterial({color:mi==1?0x1a1a1a:0xc8302e,side:THREE.DoubleSide,roughness:.8}),x-1,4.3+h+.4,0,ship);
});
// bauprés y foque
const bs=mesh(new THREE.CylinderGeometry(.12,.18,6,10),mastM,11.6,5.6,0,ship);bs.rotation.z=-1.2;

// jarcias
const rope=M(0x2a1a10);function line(a,b){const v=new THREE.Vector3().subVectors(b,a);const m=mesh(new THREE.CylinderGeometry(.03,.03,v.length(),4),rope,(a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2,ship);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());}
[[-3.4,19],[1.2,22],[5.6,17]].forEach(([x,top])=>{[1,-1].forEach(sd=>{for(let k=-1;k<=1;k++)line(new THREE.Vector3(x,top-.5,0),new THREE.Vector3(x+k*.9,4.9,sd*2.4));});});
line(new THREE.Vector3(1.2,22,0),new THREE.Vector3(14,7.2,0));line(new THREE.Vector3(1.2,22,0),new THREE.Vector3(-3.4,19,0));
ship.rotation.y=-.35;ship.rotation.z=.025;ship.position.set(0,.2,0);ship.updateMatrixWorld(true);
foam(scene,0,0,11,4,-.35,.6);
// el cocinero del canal en cubierta

// ===== DETALLE =====
// cubierta: barriles, cajas, cuerdas enrolladas, cubo y fregona, timón, campana, linternas
barrel(ship,-4.6,4.4,1.3);barrel(ship,-5.4,4.4,1.5,.9);barrel(ship,-5,4.4,.6,.8);crate(ship,3.6,4.4,-1.4,.9,.3);crate(ship,3.8,5.3,-1.3,.6,.7);crate(ship,-1.8,4.4,-1.6,.8,-.2);
[[-.6,1.6],[4.6,1.4]].forEach(([x,z])=>{for(let k=0;k<4;k++){const t=mesh(new THREE.TorusGeometry(.45-k*.08,.07,8,24),M(0xc8a46a),x,4.46+k*.06,z,ship);t.rotation.x=Math.PI/2;}});
const wheel=new THREE.Group();wheel.position.set(-6.2,7.4,0);wheel.rotation.y=Math.PI/2;ship.add(wheel);mesh(new THREE.TorusGeometry(.8,.07,8,32),M(0x6a4024),0,0,0,wheel);
for(let i=0;i<8;i++){const sp=mesh(new THREE.CylinderGeometry(.04,.04,2,6),M(0x8a5a32),0,0,0,wheel);sp.rotation.z=i/8*Math.PI;}mesh(new THREE.CylinderGeometry(.15,.15,.2,12),M(0xd9a53a,{metalness:.5}),0,0,0,wheel).rotation.x=Math.PI/2;
mesh(new THREE.CylinderGeometry(.08,.1,1.2,8),M(0x6a4024),-6.2,7,0,ship);
const bell=mesh(new THREE.CylinderGeometry(.18,.32,.45,16,1,true),M(0xd9a53a,{metalness:.7,roughness:.3,side:THREE.DoubleSide}),7.4,6.6,0,ship);mesh(box(.1,1.2,.1,.02),M(0x5a3418),7.4,6.2,.35,ship);
[[-2.5,1.9],[2.6,-1.9],[6.6,1.4]].forEach(([x,z])=>{mesh(box(.25,.35,.25,.04),M(0x2a2a2a,{metalness:.5}),x,5.5,z,ship);mesh(new THREE.SphereGeometry(.1,10,8),M(0xffe2a0,{emissive:0xffb050,emissiveIntensity:1.5}),x,5.5,z,ship);});
// bandera pirata con calavera AR, mascarón de proa, ancla, bote salvavidas colgando
const fl=canvasTex(256,160,(c,w,h)=>{c.fillStyle='#1a1a1a';c.fillRect(0,0,w,h);c.fillStyle='#f4f1ea';c.beginPath();c.arc(w/2,62,34,0,7);c.fill();c.fillRect(w/2-22,80,44,26);c.fillStyle='#1a1a1a';c.beginPath();c.arc(w/2-13,60,9,0,7);c.arc(w/2+13,60,9,0,7);c.fill();
  c.strokeStyle='#f4f1ea';c.lineWidth=12;c.beginPath();c.moveTo(w/2-60,110);c.lineTo(w/2+60,150);c.moveTo(w/2+60,110);c.lineTo(w/2-60,150);c.stroke();c.fillStyle='#ffd34a';c.font='900 26px Inter';c.fillText('AR',w/2-16,30);});
ship.children.filter(m=>m.material&&m.material.color&&m.material.color.getHex()===0x1a1a1a).forEach(m=>{m.material=new THREE.MeshStandardMaterial({map:fl,side:THREE.DoubleSide,roughness:.8});});
const fig=new THREE.Group();fig.position.set(9.9,3.6,0);ship.add(fig);mesh(new THREE.SphereGeometry(.45,14,10),M(0xd9a53a,{metalness:.5,roughness:.4}),0,.3,0,fig);mesh(new THREE.ConeGeometry(.35,1.1,12),M(0xd9a53a,{metalness:.5,roughness:.4}),-.3,-.3,0,fig).rotation.z=2.4;
const anchor=new THREE.Group();anchor.position.set(8.2,2.4,2.2);ship.add(anchor);const am=M(0x2a2c30,{metalness:.6,roughness:.4});mesh(new THREE.CylinderGeometry(.08,.08,1.8,8),am,0,0,0,anchor);mesh(new THREE.TorusGeometry(.6,.08,8,24,Math.PI),am,0,-.9,0,anchor).rotation.z=Math.PI;mesh(new THREE.TorusGeometry(.2,.05,6,16),am,0,1,0,anchor);
const lb=new THREE.Group();lb.position.set(-2,5.4,2.9);ship.add(lb);const lbg=new THREE.SphereGeometry(1,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2);lbg.scale(1.6,.45,.55);mesh(lbg,M(0xf4f1ea,{side:THREE.DoubleSide}),0,0,0,lb);[-1.2,1.2].forEach(x=>mesh(new THREE.CylinderGeometry(.03,.03,1.4,4),M(0x2a1a10),x,.7,0,lb));
// salvavidas en la borda
[[1,2.65],[-3.5,2.75]].forEach(([x,z])=>{const r=mesh(new THREE.TorusGeometry(.32,.1,10,24),M(0xffffff),x,4.2,z,ship);r.rotation.y=0;});
// gaviotas, barcos lejanos, rocas con espuma, delfines, sol
gull(scene,-6,16,8,1.2,.4);gull(scene,-2,18.5,6,1,2.4);gull(scene,-10,13,10,.9,-.3);gull(scene,-16,26,-20,1.1,1);
function far(x,z,s){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);const h=mesh(box(6,1.6,1.8,.4),M(0x4a2e1a),0,.6,0,g);mesh(new THREE.CylinderGeometry(.1,.1,8,6),M(0x4a2e1a),0,5,0,g);
  [[6.2,2.6],[3.4,2]].forEach(([y,w])=>{const sl=mesh(new THREE.PlaneGeometry(3.6-w*.3,w),new THREE.MeshStandardMaterial({color:0xefe6d0,side:THREE.DoubleSide}),.2,y,0,g);sl.rotation.y=Math.PI/2;});}
far(-60,-170,2);far(90,-210,1.6);
[[-24,-20],[30,-40]].forEach(([x,z])=>{const r=mesh(new THREE.DodecahedronGeometry(3,0),M(0x6a6a72,{flatShading:true}),x,0,z);r.scale.set(1.4,.8,1);foam(scene,x,z,5,3.5,0,.5);});
function dolphin(x,z,ry){const g=new THREE.Group();const b=mesh(new THREE.CapsuleGeometry(.45,2,6,12),M(0x6a8aa8),0,0,0,g);b.rotation.z=Math.PI/2+.5;mesh(new THREE.ConeGeometry(.25,.6,6),M(0x6a8aa8),.05,.55,0,g).rotation.z=-.6;mesh(new THREE.SphereGeometry(.07,8,6),M(0x1b1720),.75,.55,.38,g);const bl=mesh(new THREE.CapsuleGeometry(.36,1.6,6,12),M(0xdfe8f0),.1,-.12,0,g);bl.rotation.z=Math.PI/2+.5;bl.scale.z=.9;g.position.set(x,.4,z);g.rotation.y=ry;scene.add(g);foam(scene,x,z,1.8,1,0,.5);}
dolphin(8,9,.68);dolphin(4.5,11.5,.75);
const sunM=new THREE.Mesh(new THREE.CircleGeometry(14,48),new THREE.MeshBasicMaterial({color:0xfff6d0,fog:false}));sunM.position.set(-80,70,-300);scene.add(sunM);
// estela detrás del barco
for(let i=0;i<10;i++){const s2=new THREE.Mesh(new THREE.CircleGeometry(.6+i*.25,16),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5-i*.04,depthWrite:false}));s2.rotation.x=-Math.PI/2;const p=ship.localToWorld(new THREE.Vector3(-9.5-i*2.2,0,(i%2?1:-1)*(.6+i*.25)));s2.position.set(p.x,.42,p.z);scene.add(s2);}

ship.updateMatrixWorld(true);const cp=ship.localToWorld(new THREE.Vector3(2.4,4.5,.9));
const ck=await sprite(scene,'cocinero',[-280,-940,640,960],3.0,cp.x,cp.y,cp.z);
const cam=new THREE.PerspectiveCamera(42,1080/1920,.1,1000);cam.position.set(24,12.5,30);cam.lookAt(-.5,7.6,0);ck.lookAt(cam.position.x,ck.position.y,cam.position.z);
finish(r,scene,cam);

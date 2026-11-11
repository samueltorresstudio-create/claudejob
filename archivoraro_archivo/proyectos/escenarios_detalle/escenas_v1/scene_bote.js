import {THREE,setup,lights,M,mesh,box,planks,clouds,sprite,finish,canvasTex} from './common.js';
import {sea,foam} from './sea.js';
import {gull,barrel,crate,flower} from './extras.js';
// lago al atardecer: bote de remos junto a un embarcadero
const {r,scene}=setup('#f59a62','#ffe6c0','#f8cfa4',140,700);
lights(scene,[-50,30,-40],0xffd0a0,2.4,0xffd8b8,0x5a6a7a,1.2,30);
const w=sea(scene,0x3a8aa8,500,.08,0x2a6a88);
clouds(scene,[[-40,30,-140,6],[30,40,-170,7],[80,26,-120,5]]);
// sol bajo
const sun=new THREE.Mesh(new THREE.CircleGeometry(9,48),new THREE.MeshBasicMaterial({color:0xfff0c8,fog:false}));sun.position.set(-14,30,-300);scene.add(sun);
// montañas y orilla con árboles
const mtn=M(0x6a7aa8,{flatShading:true}),mtn2=M(0x8a8ab8,{flatShading:true});
[[-90,-210,60,50,mtn2],[-20,-230,70,64,mtn2],[60,-220,64,52,mtn2],[-60,-170,40,34,mtn],[30,-180,44,30,mtn]].forEach(([x,z,rr,h,m])=>{const c=new THREE.ConeGeometry(rr,h,7,2);const pp=c.attributes.position;for(let i=0;i<pp.count;i++)pp.setX(i,pp.getX(i)*(1+(Math.random()-.5)*.2));c.computeVertexNormals();mesh(c,m,x,h/2-1,z);});
const shore=new THREE.Mesh(new THREE.CylinderGeometry(60,64,2,40),M(0x5f9a48));shore.position.set(-10,0,-140);shore.scale.set(2,1,.4);shore.receiveShadow=true;scene.add(shore);
function tree(x,z,s=1){const g=new THREE.Group();mesh(new THREE.CylinderGeometry(.3,.45,4,8),M(0x6a4428),0,2,0,g);
  [[0,5,0,2.2],[1,4.2,.6,1.6],[-1,4.3,-.4,1.7],[0,6.4,0,1.5]].forEach(([a,b,c,rr])=>mesh(new THREE.IcosahedronGeometry(rr,1),M(0x3f8a3a,{flatShading:true}),a,b,c,g));g.position.set(x,1,z);g.scale.setScalar(s);scene.add(g);}
for(let i=0;i<22;i++)tree(-130+i*12+Math.random()*4,-128-Math.random()*16,1.4+Math.random()*.8);
// juncos
for(let i=0;i<40;i++){const x=8+Math.random()*10,z=-4+Math.random()*12;const h=1+Math.random()*1.6;const c=mesh(new THREE.CylinderGeometry(.03,.05,h,5),M(0x6a8a3a),x,h/2,z);c.rotation.z=(Math.random()-.5)*.3;if(Math.random()<.4)mesh(new THREE.CapsuleGeometry(.09,.35,4,8),M(0x6a3a1a),x,h,z);}
// embarcadero de madera
const pl=planks('#a07448','#6a4a28',6,512,512,true);
const pier=new THREE.Group();scene.add(pier);
mesh(box(3.2,.25,16,.04),M(0xffffff,{map:pl}),0,1.2,0,pier);
for(let z=-7.5;z<=7.5;z+=2.5)[-1.4,1.4].forEach(x=>mesh(new THREE.CylinderGeometry(.18,.2,3.4,10),M(0x6a4a28),x,0,z,pier));
mesh(new THREE.CylinderGeometry(.22,.22,1.2,10),M(0x6a4a28),1.4,1.8,7.5,pier);
const lamp=mesh(new THREE.SphereGeometry(.22,16,12),M(0xffe2a0,{emissive:0xffb050,emissiveIntensity:1.5}),1.4,2.6,7.5,pier);
const pt=new THREE.PointLight(0xffb060,6,10);pt.position.set(1.4,2.6,7.5);scene.add(pt);
pier.position.set(-6,0,-2);pier.rotation.y=.25;
// bote de remos: cuenco alargado con proa en punta
function rowboat(){const g=new THREE.Group();
  const geo=new THREE.SphereGeometry(1,48,24,0,Math.PI*2,Math.PI/2,Math.PI/2);const p=geo.attributes.position;
  for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);const t=(x+1)/2;z*=1-Math.pow(Math.max(0,t-.45)/.55,1.6)*.92;p.setXYZ(i,x*3.2,y*1.05,z*1.35);}geo.computeVertexNormals();
  const hullT=canvasTex(512,256,(c,w,h)=>{c.fillStyle='#2f6aa8';c.fillRect(0,0,w,h);c.fillStyle='#f3efe6';c.fillRect(0,0,w,h*.22);c.fillStyle='#c8302e';c.fillRect(0,h*.22,w,h*.06);for(let y=h*.3;y<h;y+=h/7){c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,y,w,3);}});
  const hull=mesh(geo,new THREE.MeshStandardMaterial({map:hullT,side:THREE.FrontSide,roughness:.7}),0,0,0,g);
  const inner=mesh(geo.clone().scale(.93,.9,.9),new THREE.MeshStandardMaterial({map:planks('#b88a58','#7a5430',8),side:THREE.BackSide,roughness:.9}),0,.02,0,g);
  // borda, bancos, remos, cuerda y farolillo
  const rim=new THREE.TorusGeometry(1,.07,8,64);const rp=rim.attributes.position;for(let i=0;i<rp.count;i++){let x=rp.getX(i),y=rp.getY(i),z=rp.getZ(i);const t=(x+1)/2;const k=1-Math.pow(Math.max(0,t-.45)/.55,1.6)*.92;rp.setXYZ(i,x*3.2,z,y*1.35*k);}rim.computeVertexNormals();mesh(rim,M(0x7a5430),0,0,0,g);
  [-1.4,0,1.3].forEach(x=>mesh(box(.5,.1,2.2-(x>1?1:0),.03),M(0xa07448),x,-.18,0,g));
  [1,-1].forEach(sd=>{const o=new THREE.Group();mesh(new THREE.CylinderGeometry(.05,.05,4.4,8),M(0xc89a62),0,0,0,o);mesh(box(.08,.9,.32,.03),M(0xc89a62),0,-2.4,0,o);o.position.set(-.2,.15,sd*1.4);o.rotation.set(sd*1.15,0,-.25);g.add(o);
    mesh(new THREE.TorusGeometry(.12,.035,6,16),M(0x5a5e66,{metalness:.6}),-.2,.12,sd*1.32,g);});
  mesh(new THREE.TorusGeometry(.35,.06,8,24),M(0xc8a46a),2.2,-.25,.2,g).rotation.x=Math.PI/2;
  mesh(box(.3,.4,.3,.05),M(0x2a2a2a),-2.4,.05,0,g);mesh(new THREE.SphereGeometry(.12,10,8),M(0xffe2a0,{emissive:0xffb050,emissiveIntensity:1.4}),-2.4,.08,0,g);
  mesh(box(.5,.3,.4,.05),M(0x8a5a2a),-.8,-.2,.6,g);
  return g;}
const boat=rowboat();boat.position.set(1.5,.72,3);boat.rotation.y=-.5;boat.rotation.z=.03;scene.add(boat);
foam(scene,1.5,3,3.8,1.9,-.5,.35);
// ondas en el agua
for(let i=0;i<4;i++){const ring=new THREE.Mesh(new THREE.RingGeometry(1,1.04,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.25-i*.05,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(1.5,.12,3);ring.scale.set(5+i*2,(5+i*2)*.45,1);ring.rotation.z=-.5;scene.add(ring);}
// reflejo del sol en el agua
for(let i=0;i<14;i++){const s=new THREE.Mesh(new THREE.PlaneGeometry(2+Math.random()*4,.12),new THREE.MeshBasicMaterial({color:0xfff0c8,transparent:true,opacity:.5,depthWrite:false}));s.rotation.x=-Math.PI/2;s.position.set(-20+i*.6+Math.random()*4,.15,-40-i*10);scene.add(s);}

// ===== DETALLE =====
// nenúfares con flores, patos, boya, caña de pescar con sedal, cubo con peces, red en el muelle, casita con humo, barca amarrada, luciérnagas, pájaros
for(let i=0;i<26;i++){const x=-1+Math.random()*6,z=-11+Math.random()*7;const l=mesh(new THREE.CircleGeometry(.55+Math.random()*.35,16,.3,5.8),M(0x4f9a3a,{side:THREE.DoubleSide}),x,.14,z);l.rotation.x=-Math.PI/2;l.rotation.z=Math.random()*6;if(i%4==0){for(let k=0;k<5;k++){const pe=mesh(new THREE.ConeGeometry(.05,.16,4),M(0xffc0d8),x+Math.cos(k*1.26)*.05,.22,z+Math.sin(k*1.26)*.05);pe.rotation.set(Math.sin(k*1.26)*.6,0,-Math.cos(k*1.26)*.6);}mesh(new THREE.SphereGeometry(.04,6,4),M(0xffd34a),x,.24,z);}}
function duck(x,z,ry,s=1){const g=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.35,14,10),M(0xf4f1ea),0,.2,0,g);b.scale.set(1.4,.8,1);mesh(new THREE.SphereGeometry(.2,12,8),M(0x2f7a4a),.4,.55,0,g);mesh(box(.22,.07,.12,.03),M(0xf2a42a),.62,.52,0,g);mesh(new THREE.SphereGeometry(.03,6,6),M(0x1b1720),.5,.62,.1,g);
  const t=mesh(new THREE.ConeGeometry(.12,.3,6),M(0xf4f1ea),-.45,.35,0,g);t.rotation.z=1.1;g.position.set(x,.1,z);g.rotation.y=ry;g.scale.setScalar(s);scene.add(g);for(let k=0;k<2;k++){const r=new THREE.Mesh(new THREE.RingGeometry(1,1.05,40),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.3,depthWrite:false}));r.rotation.x=-Math.PI/2;r.position.set(x,.13,z);r.scale.setScalar(.6+k*.5);scene.add(r);}}
duck(1,-12,2.4);duck(2.6,-13.5,2.6,.8);duck(-.4,-14,2.2,.8);
const buoy=new THREE.Group();buoy.position.set(-3,.2,-22);scene.add(buoy);mesh(new THREE.CylinderGeometry(.5,.6,1,16),M(0xe94b3c),0,.3,0,buoy);mesh(new THREE.CylinderGeometry(.52,.52,.25,16),M(0xffffff),0,.4,0,buoy);mesh(new THREE.ConeGeometry(.3,.8,12),M(0xe94b3c),0,1.2,0,buoy);
const bk=boat.localToWorld(new THREE.Vector3(1.6,-.1,.2));mesh(new THREE.CylinderGeometry(.3,.25,.45,14),M(0x8a8f96,{metalness:.5}),bk.x,bk.y,bk.z);
for(let i=0;i<3;i++){const f=mesh(new THREE.SphereGeometry(.12,10,8),M(0xc8d0d8,{metalness:.4}),bk.x-.1+i*.1,bk.y+.25,bk.z);f.scale.set(1.8,.6,.6);f.rotation.z=.5-i*.4;}
// red y cajas en el embarcadero
const pw=(x,y,z)=>{const v=new THREE.Vector3(x,y,z);pier.localToWorld(v);return v;};
[[.6,7.2],[-.8,6.4]].forEach(([x,z],i)=>{const p=pw(x,1.32,z);crate(scene,p.x,p.y,p.z,.6,i);});const bp=pw(.7,1.32,5.6);barrel(scene,bp.x,bp.y,bp.z,.7);
const netT=canvasTex(256,256,(c,w,h)=>{c.clearRect(0,0,w,h);c.strokeStyle='#5a4a3a';c.lineWidth=3;for(let i=0;i<w;i+=16){c.beginPath();c.moveTo(i,0);c.lineTo(i+60,h);c.stroke();c.beginPath();c.moveTo(i,0);c.lineTo(i-60,h);c.stroke();}});
const np=pw(1.2,1.3,-3);const net=mesh(new THREE.PlaneGeometry(2.2,1.6),new THREE.MeshStandardMaterial({map:netT,transparent:true,alphaTest:.3,side:THREE.DoubleSide}),np.x,np.y+.6,np.z);net.rotation.y=.25+Math.PI/2;
// casita de la orilla con chimenea y humo
const cab=new THREE.Group();cab.position.set(10,1,-128);cab.scale.setScalar(2.4);scene.add(cab);mesh(box(4,3,3,.05),M(0xc8a46a),0,1.5,0,cab);const rf=mesh(new THREE.ConeGeometry(3.3,2,4),M(0xb5322a),0,4,0,cab);rf.rotation.y=Math.PI/4;rf.scale.z=.8;
mesh(box(.8,1.4,.1,.03),M(0x6a4024),.6,.7,1.52,cab);mesh(box(.8,.7,.1,.03),M(0xffd88a,{emissive:0xffb050,emissiveIntensity:.8}),-1,1.6,1.52,cab);mesh(box(.5,1.5,.5,.03),M(0x8a8a8a),1.2,4.4,0,cab);
for(let i=0;i<6;i++){const sm=mesh(new THREE.SphereGeometry(.35+i*.12,10,8),M(0xeeeeee,{transparent:true,opacity:.7-i*.09}),1.2+i*.3,5.4+i*.6,0,cab);sm.castShadow=false;}
// barca amarrada al muelle
const b2=rowboat();const bp2=pw(2.6,.0,-5);b2.position.set(bp2.x,.6,bp2.z);b2.rotation.y=pier.rotation.y+Math.PI/2;b2.scale.setScalar(.85);scene.add(b2);b2.traverse(m=>{if(m.material&&m.material.map&&m.material.side===THREE.FrontSide){m.material=m.material.clone();m.material.color=new THREE.Color(0xd8a050);}});
// pájaros lejanos y luciérnagas
for(let i=0;i<5;i++){const v=new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.8,0,0),new THREE.Vector3(0,-.4,0),new THREE.Vector3(.8,0,0)),8,.06,4),new THREE.MeshBasicMaterial({color:0x3a2a3a}));v.position.set(-20+i*4,26+Math.sin(i)*3,-60-i*3);scene.add(v);}

for(let i=0;i<40;i++){const p=pw(-1.8+Math.random()*.8,0,4+Math.random()*4);const h=1+Math.random()*1.4;const c=mesh(new THREE.CylinderGeometry(.03,.05,h,5),M(0x6a8a3a),p.x,h/2,p.z);c.rotation.z=(Math.random()-.5)*.3;if(i%3==0)mesh(new THREE.CapsuleGeometry(.08,.3,4,8),M(0x6a3a1a),p.x,h,p.z);}
// flores en la orilla
for(let i=0;i<40;i++)flower(scene,-60+Math.random()*90,-130+Math.random()*6,[0xff6a8a,0xffd34a,0xffffff,0xb07aff][i%4]);

// el perro del canal sentado en el bote
const bw=boat.localToWorld(new THREE.Vector3(.3,-.15,0));
const dog=await sprite(scene,'perro',[-200,-560,460,580],1.9,bw.x,bw.y,bw.z);
const cam=new THREE.PerspectiveCamera(40,1080/1920,.1,1000);cam.position.set(7.5,4.6,15.5);cam.lookAt(-.4,3.4,-3);
dog.lookAt(cam.position.x,dog.position.y,cam.position.z);
finish(r,scene,cam);

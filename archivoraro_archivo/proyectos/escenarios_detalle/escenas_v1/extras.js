import {THREE,M,mesh,box,canvasTex} from './common.js';
export const ink=0x1b1720;
export function gull(scene,x,y,z,s=1,rot=0){const g=new THREE.Group();const w=M(0xffffff);const body=mesh(new THREE.SphereGeometry(.35,12,8),w,0,0,0,g);body.scale.set(1.6,.7,.7);
  [1,-1].forEach(sd=>{const wing=mesh(box(1.4,.06,.5,.02),w,0,.15,sd*.7,g);wing.rotation.x=sd*-.5;wing.rotation.y=sd*.2;const tip=mesh(box(.5,.06,.4,.02),M(0x2a2a2a),.1,.42,sd*1.32,g);tip.rotation.x=sd*.4;});
  mesh(new THREE.ConeGeometry(.08,.3,8),M(0xf2a42a),.65,0,0,g).rotation.z=-Math.PI/2;g.position.set(x,y,z);g.scale.setScalar(s);g.rotation.y=rot;scene.add(g);return g;}
export function barrel(par,x,y,z,s=1){const g=new THREE.Group();mesh(new THREE.CylinderGeometry(.42,.42,1,18),M(0x8a5a32,{map:canvasTex(128,64,(c,w,h)=>{c.fillStyle='#8a5a32';c.fillRect(0,0,w,h);c.fillStyle='#6a4024';for(let i=0;i<w;i+=16)c.fillRect(i,0,2,h);})}),0,.5,0,g);
  const mid=mesh(new THREE.CylinderGeometry(.5,.5,.5,18),M(0x9a6a3a),0,.5,0,g);[.12,.88].forEach(y=>mesh(new THREE.TorusGeometry(.44,.04,6,24),M(0x3a3a3a,{metalness:.6}),0,y,0,g).rotation.x=Math.PI/2);
  g.position.set(x,y,z);g.scale.setScalar(s);par.add(g);return g;}
export function crate(par,x,y,z,s=1,ry=0){const g=new THREE.Group();mesh(box(1,1,1,.04),M(0xb88a52),0,.5,0,g);[[0,.5,.51,1,.12,.02],[0,.5,-.51,1,.12,.02]].forEach(([a,b,c,w,h,d])=>{const m=mesh(box(w*1.3,h,d,.01),M(0x7a5430),a,b,c,g);m.rotation.z=.78;});
  [[0,.05],[0,.95]].forEach(([a,b])=>mesh(box(1.02,.1,1.02,.02),M(0x7a5430),a,b,0,g));g.position.set(x,y,z);g.scale.setScalar(s);g.rotation.y=ry;par.add(g);return g;}
export function cow(scene,x,z,s=1,ry=0){const g=new THREE.Group();const W=M(0xf6f2ea),B=M(0x2a2224),P=M(0xf2a8a8);
  const b=mesh(new THREE.CapsuleGeometry(.75,1.6,6,16),W,0,1.5,0,g);b.rotation.z=Math.PI/2;
  [[-.4,1.9,.4,.45],[.5,1.4,-.5,.4],[.1,1.8,-.55,.3]].forEach(([a,bb,c,r])=>{const sp=mesh(new THREE.SphereGeometry(r,12,8),B,a,bb,c,g);sp.scale.set(1,.7,.4);});
  [[-.8,-.4],[-.8,.4],[.8,-.4],[.8,.4]].forEach(([a,c])=>{mesh(new THREE.CylinderGeometry(.15,.13,1,10),W,a,.5,c,g);mesh(new THREE.CylinderGeometry(.16,.16,.15,10),B,a,.05,c,g);});
  const h=mesh(box(.8,.7,.65,.2),W,1.55,1.95,0,g);mesh(box(.4,.4,.7,.15),P,1.95,1.8,0,g);[.18,-.18].forEach(z=>{mesh(new THREE.SphereGeometry(.06,8,6),B,1.85,2.1,z,g);mesh(new THREE.ConeGeometry(.07,.3,8),M(0xf2ead8),1.5,2.45,z*1.6,g);const e=mesh(box(.12,.25,.08,.03),W,1.4,2.15,z*2.4,g);e.rotation.x=z>0?-.6:.6;});
  mesh(new THREE.SphereGeometry(.22,10,8),M(0xf2a8a8),-.1,.85,0,g);const t=mesh(new THREE.CylinderGeometry(.03,.03,1,6),W,-1.6,1.4,0,g);t.rotation.z=-.3;mesh(new THREE.SphereGeometry(.1,8,6),B,-1.75,.9,0,g);
  g.position.set(x,0,z);g.scale.setScalar(s);g.rotation.y=ry;scene.add(g);return g;}
export function pig(scene,x,z,s=1,ry=0){const g=new THREE.Group();const P=M(0xf4a8b0);const b=mesh(new THREE.SphereGeometry(.7,16,12),P,0,.8,0,g);b.scale.set(1.4,1,1);
  mesh(new THREE.CylinderGeometry(.22,.22,.15,14),M(0xe8909a),1.05,.85,0,g).rotation.z=Math.PI/2;[.08,-.08].forEach(z=>mesh(new THREE.SphereGeometry(.04,6,6),M(0x8a4a54),1.13,.86,z,g));
  [.2,-.2].forEach(z=>{mesh(new THREE.SphereGeometry(.06,8,6),M(0x1b1720),.85,1.08,z*1.4,g);const e=mesh(new THREE.ConeGeometry(.15,.3,8),P,.6,1.45,z*1.6,g);e.rotation.z=-.5;});
  [[-.5,-.35],[-.5,.35],[.5,-.35],[.5,.35]].forEach(([a,c])=>mesh(new THREE.CylinderGeometry(.11,.1,.4,8),P,a,.2,c,g));
  const t=mesh(new THREE.TorusGeometry(.1,.025,6,12,5),P,-1,.95,0,g);g.position.set(x,0,z);g.scale.setScalar(s);g.rotation.y=ry;scene.add(g);return g;}
export function chick3d(scene,x,z,s=1,ry=0,col=0xf6f2ea){const g=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.3,14,10),M(col),0,.42,0,g);b.scale.set(1.2,1,1);mesh(new THREE.SphereGeometry(.18,12,8),M(col),.3,.7,0,g);
  mesh(new THREE.ConeGeometry(.06,.16,8),M(0xf2a42a),.5,.68,0,g).rotation.z=-Math.PI/2;mesh(box(.04,.14,.18,.02),M(0xd8322e),.28,.9,0,g);mesh(new THREE.SphereGeometry(.03,6,6),M(0x1b1720),.42,.75,.1,g);
  [-.08,.08].forEach(zz=>mesh(new THREE.CylinderGeometry(.02,.02,.2,5),M(0xf2a42a),0,.1,zz,g));const t=mesh(new THREE.ConeGeometry(.15,.3,6),M(col),-.38,.6,0,g);t.rotation.z=.9;
  g.position.set(x,0,z);g.scale.setScalar(s);g.rotation.y=ry;scene.add(g);return g;}
export function sunflower(scene,x,z,h=2.2){const g=new THREE.Group();mesh(new THREE.CylinderGeometry(.04,.05,h,6),M(0x4a8a2a),0,h/2,0,g);const hd=new THREE.Group();hd.position.set(0,h,0);hd.rotation.x=-.3;g.add(hd);
  for(let i=0;i<14;i++){const p=mesh(box(.12,.34,.03,.01),M(0xffc81a),0,0,0);const q=new THREE.Group();q.add(p);p.position.y=.3;q.rotation.z=i/14*Math.PI*2;hd.add(q);}mesh(new THREE.CylinderGeometry(.2,.2,.08,16),M(0x6a3a1a),0,0,.03,hd).rotation.x=Math.PI/2;
  [.6,-.6].forEach(sd=>{const l=mesh(new THREE.SphereGeometry(.18,8,6),M(0x4a8a2a),sd*.2,h*.5,0,g);l.scale.set(1.4,.3,.8);});g.position.set(x,0,z);scene.add(g);return g;}
export function flower(scene,x,z,col){mesh(new THREE.CylinderGeometry(.015,.015,.4,4),M(0x4a8a2a),x,.2,z,scene);mesh(new THREE.SphereGeometry(.08,8,6),M(col),x,.42,z,scene);}
export function person3d(){}

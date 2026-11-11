import {THREE,M,mesh} from './common.js';
export function sea(scene,col=0x2a92bf,size=600,amp=.35,deep=0x16648a){
  const g=new THREE.PlaneGeometry(size,size,240,240);g.rotateX(-Math.PI/2);
  const p=g.attributes.position;const c=new Float32Array(p.count*3);const a=new THREE.Color(col),b=new THREE.Color(deep),w=new THREE.Color(0xd8f4ff);
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);const h=Math.sin(x*.18+z*.07)*amp+Math.sin(z*.23-x*.05)*amp*.7+Math.sin((x+z)*.6)*amp*.18;p.setY(i,h);
    const t=Math.min(1,Math.max(0,(h/amp+1.6)/3.2)), d=Math.min(1,Math.hypot(x,z)/220);const cc=b.clone().lerp(a,t*(1-d*.5));if(h>amp*1.25)cc.lerp(w,.35);c.set([cc.r,cc.g,cc.b],i*3);}
  g.setAttribute('color',new THREE.BufferAttribute(c,3));g.computeVertexNormals();
  const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,metalness:0}));m.receiveShadow=true;scene.add(m);return m;}
export function foam(scene,x,z,rx,rz,rot=0,op=.75){const g=new THREE.RingGeometry(.86,1,64);g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:op,depthWrite:false}));m.scale.set(rx,1,rz);m.rotation.y=rot;m.position.set(x,.45,z);scene.add(m);
  for(let i=0;i<26;i++){const a=Math.random()*Math.PI*2,r=1+Math.random()*.25;const s=new THREE.Mesh(new THREE.CircleGeometry(.12+Math.random()*.25,10),m.material);s.rotation.x=-Math.PI/2;s.position.set(x+Math.cos(a+rot)*rx*r,.46,z+Math.sin(a+rot)*rz*r);scene.add(s);}}
export function island(scene,x,z,s=1,palms=true){const g=new THREE.Group();
  const rock=M(0xb88a5a,{flatShading:true}),grass=M(0x5fae4a,{flatShading:true});
  [[0,0,0,6,9],[4,0,2,4,6],[-3.5,0,-1,3.5,5]].forEach(([a,b,c,r,h])=>{const cy=new THREE.CylinderGeometry(r*.75,r,h,9,3);const pos=cy.attributes.position;for(let i=0;i<pos.count;i++){pos.setX(i,pos.getX(i)*(1+(Math.random()-.5)*.15));pos.setZ(i,pos.getZ(i)*(1+(Math.random()-.5)*.15));}cy.computeVertexNormals();
    mesh(cy,rock,a,h/2-1,c,g);const top=new THREE.SphereGeometry(r*.8,12,8,0,Math.PI*2,0,Math.PI/2);top.scale(1,.35,1);mesh(top,grass,a,h-1.05,c,g);});
  if(palms)[[0,8,0],[4.5,5,2],[-3,4,-1]].forEach(([a,b,c])=>{const t=new THREE.CylinderGeometry(.18,.28,5,6);t.translate(0,2.5,0);const tm=mesh(t,M(0x8a6238),a,b,c,g);tm.rotation.z=.15;
    for(let k=0;k<6;k++){const l=new THREE.ConeGeometry(.5,3.2,4);l.rotateZ(Math.PI/2);l.translate(1.6,0,0);const lm=mesh(l,M(0x3f9a3a,{flatShading:true}),a+.7,b+4.8,c,g);lm.rotation.y=k/6*Math.PI*2;lm.rotation.z=-.35;lm.scale.set(1,.3,1);}});
  g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);return g;}

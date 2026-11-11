import {THREE,M,mesh,box,planks,canvasTex} from './common.js';
export function tree(scene,x,z,s=1,col=0x4f9a3a){const g=new THREE.Group();mesh(new THREE.CylinderGeometry(.3,.45,3.6,8),M(0x6a4428),0,1.8,0,g);
  [[0,4.6,0,2.2],[1.1,3.9,.6,1.6],[-1.1,4,-.4,1.7],[0,5.9,.2,1.5],[.4,4.4,-1,1.5]].forEach(([a,b,c,rr])=>mesh(new THREE.IcosahedronGeometry(rr,1),M(col,{flatShading:true}),a,b,c,g));g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);return g;}
export function gable(w,h,d,col){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(0,h);s.lineTo(w/2,0);s.lineTo(-w/2,0);const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);return new THREE.Mesh(g,M(col));}
export function roof(w,h,d,col,over=.5){const g=new THREE.Group();const L=Math.hypot(w/2+over,h+over*.6),a=Math.atan2(h,w/2);
  [1,-1].forEach(sd=>{const p=mesh(box(L,.3,d+over*2,.05),M(col,{roughness:.7}),sd*(w/4+over/4),h/2,0,g);p.rotation.z=-sd*a;});return g;}
export function fence(scene,x0,z0,x1,z1,col=0xf2ede4){const n=Math.ceil(Math.hypot(x1-x0,z1-z0)/2);for(let i=0;i<=n;i++){const t=i/n;mesh(box(.22,1.4,.22,.04),M(col),x0+(x1-x0)*t,.7,z0+(z1-z0)*t,scene);}
  [.5,1.05].forEach(y=>{const len=Math.hypot(x1-x0,z1-z0);const r=mesh(box(len,.14,.1,.03),M(col),(x0+x1)/2,y,(z0+z1)/2,scene);r.rotation.y=-Math.atan2(z1-z0,x1-x0);});}
export function windowsTex(wall,frame,glass,cols,rows,lit=0,extra){return canvasTex(512,512,(g,w,h)=>{g.fillStyle=wall;g.fillRect(0,0,w,h);
  for(let i=0;i<40;i++){g.fillStyle=`rgba(0,0,0,${Math.random()*.05})`;g.fillRect(Math.random()*w,Math.random()*h,40+Math.random()*80,6);}
  const cw=w/cols,rh=h/rows;for(let c=0;c<cols;c++)for(let r=0;r<rows;r++){const x=c*cw+cw*.22,y=r*rh+rh*.18,ww=cw*.56,hh=rh*.6;
    g.fillStyle=frame;g.fillRect(x-5,y-5,ww+10,hh+14);g.fillStyle=Math.random()<lit?'#ffd88a':glass;g.fillRect(x,y,ww,hh);
    g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.moveTo(x,y+hh*.6);g.lineTo(x+ww*.5,y);g.lineTo(x+ww*.75,y);g.lineTo(x,y+hh);g.fill();
    g.fillStyle=frame;g.fillRect(x+ww/2-2,y,4,hh);g.fillRect(x,y+hh*.45,ww,4);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x-6,y+hh+6,ww+12,5);}
  if(extra)extra(g,w,h);});}

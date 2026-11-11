import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
export {THREE};
export const W=1080,H=1920;
export function setup(bgTop,bgBot,fogCol,fogNear=60,fogFar=260){
  const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
  r.setPixelRatio(1);r.setSize(W,H);r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
  r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;r.outputColorSpace=THREE.SRGBColorSpace;
  document.body.appendChild(r.domElement);
  const scene=new THREE.Scene();window.__SC=scene;
  const c=document.createElement('canvas');c.width=4;c.height=512;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,512);gr.addColorStop(0,bgTop);gr.addColorStop(1,bgBot);g.fillStyle=gr;g.fillRect(0,0,4,512);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;scene.background=t;
  if(fogCol) scene.fog=new THREE.Fog(fogCol,fogNear,fogFar);
  return {r,scene};}
export function lights(scene,sunPos=[40,60,30],sunCol=0xfff1d6,sunI=2.4,hemiSky=0xcfe8ff,hemiGround=0x8a7a5a,hemiI=1.1,area=60){
  scene.add(new THREE.HemisphereLight(hemiSky,hemiGround,hemiI));
  const s=new THREE.DirectionalLight(sunCol,sunI);s.position.set(...sunPos);s.castShadow=true;s.shadow.mapSize.set(4096,4096);
  Object.assign(s.shadow.camera,{left:-area,right:area,top:area,bottom:-area,near:1,far:400});s.shadow.bias=-0.0004;s.shadow.radius=4;scene.add(s);return s;}
export const M=(col,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:col,roughness:.85,metalness:0},o));
export function mesh(geo,mat,x=0,y=0,z=0,parent){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(parent)parent.add(m);else if(window.__SC)window.__SC.add(m);return m;}
export const box=(w,h,d,r=.06)=>r>0?new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/2-.001,h/2-.001,d/2-.001)):new THREE.BoxGeometry(w,h,d);
export function canvasTex(w,h,draw,rep=[1,1]){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...rep);t.anisotropy=8;return t;}
export function planks(base,line,n=8,w=512,h=512,vertical=false){return canvasTex(w,h,(g)=>{g.fillStyle=base;g.fillRect(0,0,w,h);
  for(let i=0;i<n;i++){const y=i*h/n;g.fillStyle=`rgba(0,0,0,${.04+Math.random()*.08})`;vertical?g.fillRect(y,0,h/n,h):g.fillRect(0,y,w,h/n);
    g.strokeStyle=line;g.lineWidth=3;g.beginPath();vertical?(g.moveTo(y,0),g.lineTo(y,h)):(g.moveTo(0,y),g.lineTo(w,y));g.stroke();
    for(let k=0;k<3;k++){const x=Math.random()*w;g.beginPath();vertical?(g.moveTo(y,x),g.lineTo(y+h/n,x)):(g.moveTo(x,y),g.lineTo(x,y+h/n));g.stroke();}}});}
export function clouds(scene,list){const mat=M(0xffffff,{roughness:1,emissive:0xffffff,emissiveIntensity:.25});
  for(const [x,y,z,s] of list){const g=new THREE.Group();[[0,0,0,1],[1.1,-.2,.2,.8],[-1.1,-.25,.1,.75],[.4,.5,0,.8],[-.5,.4,-.2,.7]].forEach(([a,b,c,r])=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),mat);m.position.set(a,b,c);g.add(m);});g.position.set(x,y,z);g.scale.setScalar(s);scene.add(g);}}
// personajes 2D del canal como recortes dentro del 3D
// vb = viewBox del dibujo (para saber dónde caen los pies); el PNG ya está generado por sprites.js
export function sprite(scene,name,vb,heightWorld,x,y,z,flip=false){return new Promise(res=>{
  new THREE.TextureLoader().load(`sp_${name}.png`,t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
    const [vx,vy,vw,vh]=vb, wW=heightWorld*vw/vh, foot=(-vy)/vh, cx=flip?1-(-vx)/vw:(-vx)/vw;
    const geo=new THREE.PlaneGeometry(wW,heightWorld);geo.translate((.5-cx)*wW, foot*heightWorld-heightWorld/2, 0);
    const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:t,transparent:true,alphaTest:.35,side:THREE.DoubleSide}));
    m.position.set(x,y,z);m.renderOrder=10;scene.add(m);
    const sh=new THREE.Mesh(new THREE.CircleGeometry(heightWorld*.17,32),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.25,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.scale.y=.5;sh.position.set(x,y+.03,z);scene.add(sh);
    res(m);});});}
export function finish(r,scene,cam){r.render(scene,cam);window.DONE=true;}

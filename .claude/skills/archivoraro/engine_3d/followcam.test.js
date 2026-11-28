const FC=require('./followcam.js');
// 1) caminante cruzando 7 m en 5 s, con otro parado detrás
const subs=t=>[{x:-3.5+1.4*Math.min(t,5),y:0,z:-4,h:1.8,w:.54},{x:1,y:0,z:-6,h:2,w:.6}];
let T=5;
const A=FC.audit(t=>{const c=FC.shot(subs,t,T,{yaw:-14,occ:.5},{yaw:14,occ:.62}); return c;},subs,T);
console.log('seguimiento+orbita', A.length, A.slice(0,6));
// 2) dos hablando, plano de 6 s, zoom + grúa
const dos=t=>[{x:-.6,y:0,z:-3,h:1.8,w:.54},{x:.7,y:0,z:-3.2,h:1.7,w:.5}];
const B=FC.audit(t=>FC.shot(dos,t,6,{occ:.48,yaw:8,elev:.1},{occ:.7,yaw:-6,elev:.5,aim:.1}),dos,6);
console.log('dialogo', B.length, B.slice(0,6));
// 3) señalando (w .52 h) y de lado, cerca
const pt=t=>[{x:0,y:0,z:-2,h:2,w:1.04},{x:1.8,y:0,z:-2.5,h:1.8,w:.54}];
const C=FC.audit(t=>FC.shot(pt,t,4,{occ:.6},{occ:.8}),pt,4); console.log('señalando', C.length, C.slice(0,6));
// 4) cámara quieta (debe detectarse)
const D=FC.audit(t=>FC.frame(dos(t),{}),dos,4); console.log('quieta', D.length, D[0]);
const c=FC.shot(dos,2,6,{occ:.5},{occ:.7}); console.log(c);
const C2=FC.audit(t=>FC.shot(pt,t,4,{occ:.6,yaw:-8,elev:0},{occ:.8,yaw:8,elev:.4}),pt,4); console.log('señalando+yaw', C2.length, C2.slice(0,4));

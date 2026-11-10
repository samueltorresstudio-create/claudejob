// ---------- key times per scene (scene-relative) ----------
const EVS={
  hook:B=>({bag:B[0].w[5],prueba:B[1].w[14]}),
  alley:B=>({walk:B[0].s,rodea:B[0].w[7],tag:B[1].s}),
  back:B=>({enter:B[0].w[0],boxes:B[0].w[7],cans:B[0].w[9]}),
  front:B=>({bark:B[0].w[9],run:B[1].s,thieves:B[1].w[2]}),
  aisle:B=>({rule:B[0].s,bag:B[1].w[7],open:B[2].s,water:B[2].w[3],cans:B[2].w[6]}),
  note:B=>({perdon:B[0].w[9]}),
  trap:B=>({down:B[0].w[3],dark:B[0].w[9]}),
};
const S={};
const p4Crate=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-70" y="-120" width="140" height="120" fill="#a8844f"/><rect x="-70" y="-120" width="140" height="120" fill="none" stroke="#6a5030" stroke-width="6"/><path d="M-70,-120 L70,0 M70,-120 L-70,0" stroke="#7a5e38" stroke-width="5"/></g>`;
const p4Shelf=(x,y,w,h,col)=>{
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`;
  const rh=h/4;
  for(let r=0;r<4;r++){const yy=y+r*rh;
    s+=`<rect x="${x}" y="${yy+rh-14}" width="${w}" height="12" fill="#2b2e36"/>`;
    const n=Math.floor((w-20)/44);
    for(let i=0;i<n;i++) s+=`<rect x="${x+14+i*44}" y="${(yy+rh*.25).toFixed(1)}" width="30" height="${(rh*.6).toFixed(1)}" rx="5" fill="${['#c23a3a','#f2c94c','#3f86b8','#4f8a5a','#e9e4d8'][(i+r)%5]}"/>`;}
  return s};
const p4Alley=sc=>{
  let s=skyTod('afternoon');
  s+=`<rect x="-600" y="180" width="2280" height="800" fill="#d9ccb4"/>`;
  for(let i=0;i<9;i++){const x=((i*300-sc)%2700+2700)%2700-900;
    s+=`<rect x="${x.toFixed(1)}" y="260" width="200" height="620" fill="#c9bca2"/><rect x="${(x+24).toFixed(1)}" y="300" width="60" height="90" fill="#3a4250"/><rect x="${(x+116).toFixed(1)}" y="300" width="60" height="90" fill="#3a4250"/>`;}
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#6a6258"/>`;
  for(let i=0;i<5;i++){const x=((i*520-sc*1.4)%2600+2600)%2600-700;
    s+=`<rect x="${x.toFixed(1)}" y="760" width="230" height="120" rx="8" fill="#2f5a4a"/><rect x="${x.toFixed(1)}" y="752" width="230" height="16" fill="#1f3f33"/>`;}
  return s};

S.hook=(t,D,B)=>{const E=EVS.hook(B);
  let s=supermarket(t,{shut:.84});
  s+=doberman(640,1000,.48,t,{alert:.4,head:-10,seed:9});
  s+=A({...MARCO,x:420,y:1010,s:.6,look:[10,-4],brows:'worried',mouth:'line'});
  if(t>E.prueba) s+=redRag(640+.48*120,1000-.48*260,1.0,-12);
  let o=cam(s,1.05,540,640,540,560);
  if(t>E.bag) o+=tag(540,450,'MOCHILA ROBADA',PINK,P(t,E.bag,.2));
  return o;};

S.alley=(t,D,B)=>{const E=EVS.alley(B), walking=t<E.tag, sc=walking?t*160:E.tag*160;
  let s=p4Alley(sc);
  s+=A({...MARCO,x:420,y:1010,s:.6,walk:walking?t*7:null,look:[10,-4],brows:'worried',mouth:'line'});
  let o=cam(s,1.0,540,600,540,560);
  if(t>E.rodea&&t<E.tag) o+=tag(540,450,'POR LA PARTE DE ATRÁS',YEL,P(t,E.rodea,.2));
  if(t>E.tag) o+=tag(540,450,'LA PUERTA ESTÁ VIGILADA',PINK,P(t,E.tag,.2));
  return o;};

S.back=(t,D,B)=>{const E=EVS.back(B), k=eIO(prog(t,E.enter,D*.92)), sc=lerp(.72,.46,k), y=lerp(1010,800,k);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#262320"/>`;
  s+=`<rect x="-600" y="180" width="2280" height="700" fill="#3a342c"/>`;
  s+=`<rect x="380" y="300" width="320" height="580" fill="#ffe7a0" opacity=".85"/><rect x="380" y="300" width="320" height="580" fill="none" stroke="#1a1714" stroke-width="16"/>`;
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#4a443c"/>`;
  s+=p4Crate(160,920,1.5)+p4Crate(920,930,1.4)+p4Crate(880,800,1.0);
  for(let i=0;i<7;i++){const cx=300+(i*73)%400, cy=960+(i*37)%90;
    s+=`<circle cx="${cx}" cy="${cy}" r="22" fill="#9aa3ad"/><circle cx="${cx}" cy="${cy}" r="10" fill="#c23a3a" opacity=".6"/>`;}
  s+=A({...MARCO,x:540,y:y,s:sc,walk:k<1?t*7:null,look:[0,-4],brows:'worried',mouth:'line'});
  let o=cam(s,1.0,540,700,540,560);
  if(t>E.enter&&t<E.boxes+.8) o+=tag(540,450,'ALMACÉN',YEL,P(t,E.enter,.2));
  return o;};

S.front=(t,D,B)=>{const E=EVS.front(B), bark=t>E.bark;
  let s=supermarket(t,{shut:.84});
  s+=doberman(860,1000,.48,t,{dir:-1,alert:bark?1:.5,head:-8,bark:bark&&Math.sin(t*9)>-.2,seed:9});
  if(t>E.run){const k=eIn(prog(t,E.run,E.run+1.8));
    s+=A({...RUBEN,x:lerp(560,1200,k),y:1010,s:.6,walk:t*12,look:[11,-4],brows:'angry',mouth:'o'});
    s+=A({...RUBEN,skin:'#b98058',top:'#3a3f4e',topD:'#2a2e3a',jacket:'#3a3f4e',hair:'#2a2420',hs:'short',seed:31,x:lerp(470,1120,k),y:1010,s:.6,walk:t*12,look:[11,-4],brows:'angry',mouth:'o'});}
  if(bark) s+=bang(860,760,'¡GUAU!',YEL,P(t,E.bark,.15),80)+soundArcs(860,800,t,YEL,-1);
  let o=cam(s,1.05,540,640,540,560,bark?shake(t,1-prog(t,E.bark,E.bark+.6),5):0);
  if(t>E.thieves) o+=tag(540,450,'DOS LADRONES',PINK,P(t,E.thieves,.2));
  return o;};

S.aisle=(t,D,B)=>{const E=EVS.aisle(B), k=eIO(prog(t,B[1].s,E.bag)), walking=k>0&&k<1, opened=t>E.open;
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a2a30"/>`;
  s+=p4Shelf(200,200,640,300,'#9aa8b4');
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#cfc8bc"/>`;
  for(let i=0;i<8;i++) s+=`<line x1="-600" y1="${880+i*90}" x2="1680" y2="${880+i*90}" stroke="#b8b0a0" stroke-width="4"/>`;
  s+=p4Shelf(-260,260,300,660,'#8a9aa8')+p4Shelf(1000,260,300,660,'#8a9aa8');
  s+=opened?bagOpen(720,1000,.9,.5):bagClosed(720,1000,.9);
  s+=A({...MARCO,x:lerp(250,640,k),y:1010,s:.6,walk:walking?t*7:null,look:[opened?0:11,-4],brows:'worried',mouth:'line'});
  let o=cam(s,1.05,540,640,540,560);
  if(t>E.water) o+=tag(540,450,'SIN AGUA',PINK,P(t,E.water,.2));
  if(t>E.cans) o+=tag(540,530,'SIN LATAS',PINK,P(t,E.cans,.2));
  return o;};

S.note=(t,D,B)=>{const E=EVS.note(B), txt='PERDÓN. NOS OBLIGARON.', n=Math.ceil(txt.length*clamp(prog(t,E.perdon,E.perdon+1.8)));
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1a1b22"/><circle cx="540" cy="640" r="520" fill="url(#glowY)" opacity=".35"/>`;
  const rot=-3+Math.sin(t*.8)*.5;
  s+=`<g transform="translate(540,620) rotate(${rot.toFixed(2)}) scale(${(1+.03*prog(t,0,D)).toFixed(3)})">`+
     `<rect x="-420" y="-300" width="840" height="600" rx="8" fill="#efe6cf"/>`+
     `<rect x="-400" y="-280" width="800" height="560" rx="4" fill="none" stroke="#c8bb9a" stroke-width="5"/>`+
     `<text x="0" y="-170" text-anchor="middle" font-family="Inter" font-weight="800" font-size="40" letter-spacing="8" fill="#5a544a">NOTA</text>`+
     `<text x="0" y="10" text-anchor="middle" font-family="Inter" font-weight="900" font-size="50" fill="#1d1b18">${txt.slice(0,n)}</text></g>`;
  let o=cam(s,1.0,540,620,540,560);
  if(t>E.perdon-.5) o+=tag(540,1000,'ESCRITA A MANO',PINK,P(t,E.perdon-.5,.2));
  return o;};

S.trap=(t,D,B)=>{const E=EVS.trap(B), sy=lerp(260,880,eIn(prog(t,E.down,E.dark))), dk=prog(t,E.dark,E.dark+.7);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#14120f"/>`;
  s+=`<rect x="-600" y="180" width="2280" height="700" fill="#2e2a26"/>`;
  s+=`<rect x="-600" y="880" width="2280" height="700" fill="#4a443c"/>`;
  s+=`<rect x="300" y="260" width="480" height="620" fill="#0c0b0a"/>`;
  s+=`<rect x="300" y="260" width="480" height="${(sy-260).toFixed(1)}" fill="#9aa3ad"/>`;
  for(let y=280;y<sy;y+=26) s+=`<line x1="300" y1="${y}" x2="780" y2="${y}" stroke="#7a838d" stroke-width="4"/>`;
  s+=`<rect x="300" y="${(sy-16).toFixed(1)}" width="480" height="16" fill="#6a737d"/>`;
  s+=A({...MARCO,x:540,y:1010,s:.6,look:[0,-6],eyes:'wide',brows:'worried',mouth:'line'});
  let o=cam(s,lerp(1.0,1.15,prog(t,E.down,E.dark)),540,640,540,560);
  if(t>E.down&&t<E.dark) o+=tag(540,450,'PERSIANA',PINK,P(t,E.down,.2));
  o+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#000" opacity="${dk.toFixed(3)}"/>`;
  if(t>E.dark) o+=tag(540,450,'ATRAPADO',PINK,P(t,E.dark,.2));
  return o;};

window.CFG={steps:['1. NO ENTRES POR DONDE ESPERAN','2. NUNCA PELEES CON DOS'],listEnd:'trap',
  band:{hook:'#5a4e3e',alley:'#4a4638',back:'#2e2a26',front:'#5a4e3e',aisle:'#2a2a30',note:'#1a1b22',trap:'#14120f'}};

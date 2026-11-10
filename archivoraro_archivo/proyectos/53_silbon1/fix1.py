p='scenes_p.js'; c=open(p).read()
def R(a,b):
    global c
    assert a in c, a[:80]; c=c.replace(a,b)
# bones row with scale
R("function bonesRow(x,y,n,k=1){let s='';for(let i=0;i<n;i++){const bx=x+i*62,","function bonesRow(x,y,n,k=1,sc=1){let s='';for(let i=0;i<n;i++){const bx=x+i*62*sc,")
R("s+=`<g transform=\"translate(${bx},${y - (1-a)*40}) rotate(${-8+i*9})\" opacity=\"${a}\">","s+=`<g transform=\"translate(${bx},${y - (1-a)*40*sc}) rotate(${-8+i*9}) scale(${sc})\" opacity=\"${a}\">")
# hook close-up rebuilt
i=c.index("  if(t<E.l2-.1){ // close on the porch floor"); j=c.index("  // tilt up to the window: grandma asleep inside")
c=c[:i]+r"""  if(t<E.l2-.1){ // close on the porch floor at the foot of the door: a bony hand laying bones out, one by one
    const n=Math.min(6,1+Math.floor(t/0.85)), k=prog(t%0.85,0,.35);
    let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0c0a14"/>`;
    s+=`<rect x="120" y="-200" width="880" height="840" fill="#3a2414"/>`+[0,1,2,3].map(i=>`<rect x="${128+i*218}" y="-200" width="212" height="834" fill="#4a3020" stroke="#22140a" stroke-width="4"/>`).join('')+[0,1,2,3].map(i=>`<path d="M${150+i*218},${100+i*30} q60,-10 140,6" stroke="#2a1a0e" stroke-width="3" fill="none"/>`).join('');
    s+=`<rect x="100" y="630" width="920" height="22" fill="#2a1a0e"/>`;
    s+=`<path d="M-600,652 L1680,652 L1680,1500 L-600,1500Z" fill="#5a3022"/>`;for(let x=-600;x<1700;x+=110) s+=`<line x1="${x}" y1="652" x2="${(x-540)*1.9+540}" y2="1500" stroke="#3a1c12" stroke-width="3"/>`;for(const y of [720,820,960]) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#3a1c12" stroke-width="3"/>`;
    s+=`<path d="M-600,652 L300,652 L900,1500 L-600,1500Z" fill="#cfd8ff" opacity=".1"/>`;
    s+=sbSack(170,560,{bur:'bonebur',shade:'boneshade'}).replace('<path','<defs><pattern id="bonebur" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#9c7c4c"/><path d="M0,3 H12 M0,9 H12" stroke="#5e4828" stroke-width="2.4" opacity=".6"/></pattern><radialGradient id="boneshade"><stop offset=".4" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient></defs><path');
    s+=bonesRow(400,880,n,k,1.5);
    const bx=400+(n-1)*93, hy=lerp(700,800,k);
    s+=`<defs>${sbGrad('hgrad',0,0,1,0,[[0,SB.skinL],[.4,SB.skin],[1,SB.skinD]])}</defs><g transform="translate(${bx+60},${hy}) scale(1.5) translate(${-bx-60},${-hy})">`+sbLimb([bx+460,hy-640],[bx+60,hy-40],46,30,'hgrad')+sbHand([bx+60,hy-40],100,'hgrad',1.1,.45)+`</g>`;
    s+=dark(.5,[[520,860,620,320]]);
    let o=cam(s,lerp(1.0,1.1,eIO(prog(t,0,E.l2))),540,lerp(700,740,prog(t,0,E.l2)),540,560,shake(t,.2,1.5));
    if(t>E.bones) o+=tag(780,330,'HUESOS',PINK,P(t,E.bones,.2));
    if(t>E.listen) o+=bang(280,330,'CLAC...',YEL,P(t,E.listen,.15),70);
    return o;}
"""+c[j:]
# window shot: bigger window, grandma clearly asleep in bed
i=c.index("  let bg=porch(t);\n  // grandma visible through the shutters"); j=c.index("  if(t>E.dawn) o+=tag(540,880,'NO VERÁ EL AMANECER'")
c=c[:i]+r"""  let bg=porch(t);
  bg+=`<rect x="690" y="350" width="320" height="320" fill="#141a2a" stroke="#3a2414" stroke-width="16"/>`;
  let fg=`<defs><clipPath id="winclip"><rect x="698" y="358" width="304" height="304"/></clipPath></defs><g clip-path="url(#winclip)"><rect x="690" y="350" width="330" height="330" fill="#2a2c44"/><circle cx="760" cy="400" r="120" fill="#9ab0ff" opacity=".15"/>`;
  fg+=`<rect x="700" y="560" width="300" height="110" fill="#5a3a22"/><rect x="700" y="540" width="300" height="40" rx="12" fill="#e8e0d0"/>`+lying({...ABUELA,x:930,y:556,s:.34,eyes:'closed',mouth:'smile'},.34)+`<path d="M760,560 Q850,530 1000,556 L1000,600 L760,600Z" fill="#8a6a9a"/></g>`;
  fg+=[0,1,2,3,4].map(i=>`<rect x="${730+i*58}" y="360" width="7" height="300" fill="#1a1a1e"/>`).join('')+`<rect x="690" y="350" width="320" height="320" fill="none" stroke="#3a2414" stroke-width="16"/>`;
  let o=focusCam(bg,fg,Math.max(kf*.9,0),860,560,{z0:lerp(1.3,1.05,up),z1:2.6,cx:lerp(520,620,up),cy:lerp(900,560,up)});
"""+c[j:]
# home: night darkness with candle + window light
R("  let fg=canelo(560,1012,.42,t,{dir:1,alert:.5,head:4});\n  fg+=A({...MATEO,x:760,","  bg+=dark(.5,[[150,760,360,360],[560,420,300,260]]);\n  let fg=canelo(560,1012,.42,t,{dir:1,alert:.5,head:4});\n  fg+=A({...MATEO,x:760,")
# wake: bigger hammock + Mateo
i=c.index("  // hammock (chinchorro) with Mateo"); j=c.index("  let o=kc>0.01?focusCam(bg,fg,kc,980,250")
c=c[:i]+r"""  // hammock (chinchorro) with Mateo, big in frame
  let fg=`<path d="M-80,560 Q540,1010 1160,560" stroke="#c9a070" stroke-width="12" fill="none"/>`;
  fg+=lying({...MATEO,x:600,y:860,s:.62,eyes:op?'wide':'closed',mouth:op?'o':'line',brows:op?'up':null},.62);
  fg+=`<path d="M-80,560 Q540,1040 1160,560 L1160,610 Q540,1100 -80,610Z" fill="#c25a3a"/>`+[...Array(11)].map((_,i)=>{const x=-20+i*110,y=600+Math.sin((i/10)*Math.PI)*400;return `<path d="M${x},${y} l0,50" stroke="#e8c070" stroke-width="6"/>`}).join('')+`<path d="M-80,585 Q540,1070 1160,585" stroke="#e8c070" stroke-width="5" fill="none" opacity=".7"/>`;
  if(op) fg+=sweat(600,860,.62,t);
"""+c[j:]
R("let o=kc>0.01?focusCam(bg,fg,kc,980,250,{z0:1.04,z1:2.6}):focusCam(bg,fg,eIO(prog(t,E.wake-.1,D))*.8,560,820,{z0:1.04,z1:2});","let o=kc>0.01?focusCam(bg,fg,kc,980,250,{z0:1.04,z1:2.6}):focusCam(bg,fg,eIO(prog(t,E.wake-.1,D))*.8,420,800,{z0:1.04,z1:2});")
R("if(t>E.three-.2&&t<E.wake) o+=countPop('3:00',540,440,140,t-E.three,PINK);","if(t>E.three-.2&&t<E.wake) o+=countPop('3:00',540,820,140,t-E.three,PINK);")
# count: door from inside, bright gap with shadows of fingers and bones, details
i=c.index("    let s=`<rect x=\"-600\" y=\"-900\" width=\"2280\" height=\"2400\" fill=\"#0a0812\"/><rect x=\"100\" y=\"0\" width=\"880\" height=\"1010\" fill=\"#3a2414\"/>`"); j=c.index("    let o=cam(s,lerp(1.3,1.6,prog(t,0,E.l2)),540,960,540,620);")
c=c[:i]+r"""    let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#0a0812"/><rect x="100" y="-200" width="880" height="960" fill="#3a2414"/>`+[0,1,2,3].map(i=>`<rect x="${110+i*218}" y="-200" width="212" height="954" fill="#4a3020" stroke="#22140a" stroke-width="4"/>`).join('');
    s+=`<rect x="760" y="360" width="190" height="24" rx="8" fill="#22140a"/><rect x="930" y="350" width="26" height="44" fill="#2a2a2e"/>`;
    s+=`<rect x="-600" y="776" width="2280" height="800" fill="#2a1a14"/>`;for(let x=-600;x<1700;x+=110) s+=`<line x1="${x}" y1="776" x2="${(x-540)*1.8+540}" y2="1500" stroke="#1a0e0a" stroke-width="3"/>`;
    // the bright gap under the door, moonlight spilling in
    s+=`<rect x="100" y="756" width="880" height="20" fill="#dfe6ff"/><path d="M100,776 L980,776 L1200,1100 L-120,1100Z" fill="#cfd8ff" opacity=".16"/>`;
    const n=t<E.n1?0:t<E.n2?1:t<E.n3?2:3;
    for(let i=0;i<n;i++) s+=`<path d="M${330+i*110},766 l60,0" stroke="#0a0812" stroke-width="12" stroke-linecap="round"/><circle cx="${328+i*110}" cy="766" r="8" fill="#0a0812"/><circle cx="${392+i*110}" cy="766" r="8" fill="#0a0812"/>`;
    for(let i=0;i<4;i++){const fx=700+i*30+Math.sin(t*3+i)*24;s+=`<rect x="${fx}" y="756" width="12" height="20" fill="#0a0812"/>`;}
    s+=`<rect x="${780+Math.sin(t*1.5)*20}" y="756" width="170" height="20" fill="#0a0812"/>`;
    // details by the door: rubber boots, a straw mat, a broom
    s+=`<rect x="150" y="840" width="300" height="70" rx="8" fill="#9a7a4a" opacity=".85"/>`+[0,1,2,3,4,5].map(i=>`<line x1="${160+i*50}" y1="842" x2="${170+i*50}" y2="908" stroke="#7a5a30" stroke-width="3"/>`).join('');
    s+=`<path d="M40,640 L60,900 L110,900 L100,640Z" fill="#1d1d22"/><path d="M10,880 L110,880 L110,910 L10,910Z" fill="#1d1d22"/>`;
    s+=`<path d="M1010,300 L960,860" stroke="#8a6a3a" stroke-width="10"/><path d="M930,840 L1000,840 L1010,930 L920,930Z" fill="#b89a50"/>`;
    s+=dark(.45,[[540,800,620,220]]);
"""+c[j:]
R("let o=cam(s,lerp(1.3,1.6,prog(t,0,E.l2)),540,960,540,620);","let o=cam(s,lerp(1.15,1.4,prog(t,0,E.l2)),540,760,540,620);")
# whip: no blur
R("let o=focusCam(bg,'',k,540,420,{z0:1.6,z1:2.6});","let o=cam(bg,lerp(1.6,2.5,k),540,lerp(440,420,k),540,560);")
open(p,'w').write(c);print('ok')

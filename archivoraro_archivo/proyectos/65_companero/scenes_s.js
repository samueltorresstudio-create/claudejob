// ---------- escenas ----------
const cpS=.66, cpYX=395, cpDX=690;
const cpFY=cpFace(cpYX,cpS), cpFD=cpFace(cpDX,cpS*1.04);
const cpRed=(a)=>a>0?`<rect x="-600" y="-900" width="2280" height="2400" fill="#ff1a2a" opacity="${(a*.35).toFixed(3)}" style="mix-blend-mode:screen"/>`:'';
// mano con el móvil en primer plano (la tuya): chat con tu hermana
const cpChat=(t,typed,sent,o={})=>{const msg='Llama a la policía';
  let scr=chatK('Hermana',[['¿Qué tal el piso? 😊',-1,1],['Bien!!',1,1]],{time:'23:07',avatar:'#d9608a'});
  if(typed>0){const n=Math.ceil(msg.length*clamp(typed)), w=200, y=230;
    if(sent){scr+=`<rect x="${262-w}" y="${y}" width="${w}" height="44" rx="14" fill="#2f8a5a"/><text x="${262-w+14}" y="${y+29}" font-family="Inter" font-weight="700" font-size="19" fill="#fff">${msg}</text>`;
      if(o.fail>0) scr+=`<g opacity="${clamp(o.fail*3).toFixed(2)}"><circle cx="${262-w-24}" cy="${y+22}" r="15" fill="#e02a3a"/><text x="${262-w-24}" y="${y+30}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="22" fill="#fff">!</text><text x="262" y="${y+72}" text-anchor="end" font-family="Inter" font-weight="800" font-size="18" fill="#ff5a6a">No enviado</text></g>`;}
    else {scr+=`<rect x="10" y="520" width="260" height="54" rx="27" fill="#1b2232"/><text x="30" y="555" font-family="Inter" font-weight="600" font-size="19" fill="#fff">${msg.slice(0,n)}${Math.floor(t*3)%2?'|':''}</text>`;}}
  if(o.nodata) scr+=`<rect x="150" y="26" width="58" height="22" rx="4" fill="#e02a3a"/><text x="179" y="43" text-anchor="middle" font-family="Inter" font-weight="900" font-size="14" fill="#fff">SIN RED</text>`;
  // teclado
  if(!sent){scr+=`<rect x="0" y="590" width="280" height="0" fill="#000"/>`;}
  return scr};
const cpHands=(t,scr,o={})=>handsPhone(540+(o.dx||0),o.y??560,o.s??1.45,scr,CPYOU.skin,CPYOU.top);

S.hook=(t,D,B)=>{const E=EVS.hook(B);
  if(t<E.cut){ // la tele: SE BUSCA con su foto, luces de policía
    const tv=CPTV(t,'news',{photo:clamp(.55+t*2.2)});
    return cam(tv,1.16+.06*t,540,720,540,560,shake(t,.6,4))+cpRed(.4*Math.max(0,Math.sin(t*12.5)))};
  // y está en tu sofá: primer plano de Dani, que gira los ojos hacia ti
  const tt=t-E.cut, side=t>E.tele-.15?eIO(prog(t,E.tele-.15,E.tele+.3)):0;
  const {bg,fg}=cpSofa(t,{tv:'news',dani:{look:[lerp(1,-9,side),lerp(-2,0,side)],mouth:'smile',brows:side>.5?'angry':null},you:{look:[6,-2],eyes:'wide',mouth:'line'}});
  const punch=t>E.asesino?Math.exp(-(t-E.asesino)*7):0;
  return focusCam(bg,fg,1,cpFD[0],cpFD[1]+10,{z1:2.35+.12*tt+.25*punch,ty:560,blur:6,dx:shake(t,punch,10)})+cpRed(punch*.9)};

S.sofa=(t,D,B)=>{const E=EVS.sofa(B), k=eIO(prog(t,0,D));
  const laugh=t<E.martes;
  const {bg,fg}=cpSofa(t,{tv:'show',dani:{mouth:laugh?'laugh':'smile',eyes:laugh?'happy':'open',look:[0,-3]},you:{mouth:laugh?'happy':'smile',look:[0,-3]}});
  let s=bg+particles(t,'dust',{n:14,x0:100,x1:1000,y0:300,y1:900,op:.35})+fg;
  return cam(s,lerp(1.3,1.42,k),540,650,540,600)};

S.news=(t,D,B)=>{const E=EVS.news(B), k=eIO(prog(t,0,D));
  const mode=t<E.cortan?'show':t<E.cortan+.45?'glitch':'news';
  const s=cpBehind(t,mode,{photo:0,banner:prog(t,E.cortan+.45,E.cortan+.8)});
  return cam(s,lerp(1.02,1.16,k),540,560,540,560,mode==='glitch'?shake(t,1,8):0)};

S.photo=(t,D,B)=>{const E=EVS.photo(B);
  const tv=CPTV(t,'news',{photo:P(t,E.foto-.1,.35),banner:1});
  // cámara: tele entera → cicatriz (ceja derecha) → jersey
  const a=eIO(prog(t,E.cicatriz-.2,E.cicatriz+.35)), b=eIO(prog(t,E.jersey-.2,E.jersey+.35));
  const z=lerp(lerp(1.16,3.0,a),2.7,b), fx=lerp(lerp(540,350,a),310,b), fy=lerp(lerp(720,578,a),752,b);
  let s=cam(tv,z,fx,fy,540,560,shake(t,t>E.foto?Math.exp(-(t-E.foto)*6):0,8));
  if(a>.6&&b<.3) s+=brackets(540,560,250,170,YEL);
  if(b>.6) s+=brackets(540,560,560,300,YEL);
  return s};

S.near=(t,D,B)=>{const E=EVS.near(B);
  const {bg,fg}=cpSofa(t,{tv:'news',you:{eyes:'wide',mouth:'line',brows:'worried',look:[5,-1]},dani:{look:[0,-3],mouth:'smile',mopen:.25+.25*Math.sin(t*9)}});
  // primer plano de tus ojos → plano de los dos con la distancia entre las caras
  const k=1-eIO(prog(t,E.dani+.1,E.dani+.6));
  let s=focusCam(bg,fg+sweat(cpYX,905,cpS,t),k,cpFY[0],cpFY[1],{z0:1.5,z1:2.6,cy:600,cx:540});
  if(k<.3&&t>E.cm-.1){const a=P(t,E.cm-.1,.3), y=430, x0=380, x1=700;
    s+=`<g opacity="${a.toFixed(2)}"><line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${YEL}" stroke-width="8" stroke-dasharray="18 10"/><path d="M${x0},${y} l24,-16 l0,32Z M${x1},${y} l-24,-16 l0,32Z" fill="${YEL}"/></g>`+countPop('40 CM',540,y-30,78,t-E.cm,YEL);}
  return s};

S.rule1=(t,D,B)=>{const E=EVS.rule1(B), k=eIO(prog(t,0,D));
  const fake=t>E.cara-.2, front=t>E.tele-.2;
  const {bg,fg}=cpSofa(t,{tv:'news',you:{eyes:fake?'open':'wide',mouth:fake?'line':'o',brows:fake?null:'worried',look:front?[0,-3]:[5,-1]},dani:{look:[0,-3],mopen:Math.max(0,Math.sin(t*7))*.4}});
  return focusCam(bg,fg+sweat(cpYX,905,cpS,t),1,(cpFY[0]+cpFD[0])/2-60,cpFY[1]+20,{z1:lerp(1.9,2.15,k),blur:4,bars:false,dx:shake(t,fake?.25:0,3)})};

S.victim=(t,D,B)=>{const E=EVS.victim(B);
  const tv=CPTV(t,'victim',{name:prog(t,E.daniel-.05,E.daniel+.5)});
  const a=eIO(prog(t,E.daniel-.3,E.daniel+.3));
  return cam(tv,lerp(1.16,2.0,a),lerp(540,760,a),lerp(720,650,a),540,560)};

S.contract=(t,D,B)=>{const E=EVS.contract(B);
  const sig=eIO(prog(t,0,E.firmo+.4)), c=prog(t,E.contrato,E.contrato+.35), k=eIO(prog(t,0,D));
  let s=cam(cpContract(t,k,sig,c),lerp(1.05,1.3,k),lerp(530,420,k),lerp(560,640,k),540,560);
  return s+`<rect x="0" y="0" width="1080" height="1100" fill="url(#vig)" opacity=".8"/>`};

S.remote=(t,D,B)=>{const E=EVS.remote(B);
  const sw=t<E.cambia?'news':t<E.cambia+.3?'static':'cartoon';
  let s=cpBehind(t,sw,{drot:t>E.coge?4:0});
  // su brazo (jersey gris) entra por la derecha con el mando
  const up=eOut(prog(t,E.coge-.15,E.coge+.3)), click=t>E.cambia&&t<E.cambia+.15;
  const hx=lerp(1150,760,up), hy=lerp(1250,860,up);
  s+=`<g filter="url(#chFX)"><path d="M${hx+40},${hy+10} L${hx+520},${hy+420}" stroke="${CPDANI.top}" stroke-width="150" stroke-linecap="round"/><path d="M${hx+40},${hy+10} L${hx+80},${hy+44}" stroke="${CPDANI.topD}" stroke-width="150" stroke-linecap="round" opacity=".5"/>`;
  s+=`<g transform="translate(${hx},${hy}) rotate(-28)"><rect x="-34" y="-150" width="68" height="230" rx="22" fill="#1d1d22"/><circle cx="0" cy="-118" r="12" fill="${click?'#ff3a3a':'#8a1a1a'}"/>${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${-22+c*16}" y="${-80+r*22}" width="12" height="12" rx="3" fill="#4a4f5a"/>`).join('')).join('')}</g>`;
  s+=`<circle cx="${hx+10}" cy="${hy+40}" r="62" fill="${CPDANI.skin}"/><circle cx="${hx-30}" cy="${hy-10}" r="26" fill="${CPDANI.skin}"/></g>`;
  if(click) s+=`<circle cx="${hx-60}" cy="${hy-150}" r="40" fill="#fff" opacity=".5"/>`;
  return cam(s,1.06,540,600,540,560,sw==='static'?shake(t,1,6):0)};

S.odio=(t,D,B)=>{const E=EVS.odio(B);
  const him=t>E.odio-.15, talkY=!him&&t>E.pregunta-.1, talkD=him&&t<E.odio+1.2;
  const {bg,fg}=cpSofa(t,{tv:'show',you:{look:[7,-1],mouth:talkY?'o':'line',mopen:talkY?.3+.3*Math.sin(t*14):null,brows:'worried'},dani:{look:[0,-3],mouth:talkD?'o':'smile',mopen:talkD?.25+.3*Math.sin(t*12):null,brows:him?'angry':null}});
  const f=him?cpFD:cpFY;
  let s=focusCam(bg,fg,1,f[0],f[1],{z1:2.4+.1*(him?t-E.odio:t),blur:5});
  return s};

S.rule2=(t,D,B)=>{const E=EVS.rule2(B);
  // tu mirada se va a la puerta (la cámara también) y vuelve; coges el móvil; él te mira de reojo
  const toDoor=eIO(prog(t,.1,.6))*(1-eIO(prog(t,E.puerta,E.puerta+.4)));
  const phone=t>E.movil-.1, side=t>E.finge;
  const {bg,fg}=cpSofa(t,{tv:'show',router:'on',you:{look:toDoor>.3?[11,-2]:phone?[3,7]:[0,-3],phoneR:phone,eyes:'open',mouth:'line'},dani:{look:side?[-9,1]:[0,-3],mouth:'line'}});
  const fx=lerp(cpYX+60,1150,toDoor), z=lerp(2.0,1.8,toDoor);
  return cam(bg+fg,z,fx,lerp(cpFY[1]+40,600,toDoor),540,560)};

S.phone=(t,D,B)=>{const E=EVS.phone(B);
  const typed=prog(t,E.escribes+.2,E.policia+.2);
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1a1612"/>`+`<g opacity=".35">${cpRoom(t)}</g>`+dark(.6,[[540,560,500,500]]);
  s+=cpHands(t,cpChat(t,typed,false),{dx:shake(t,1,3)});
  return cam(s,1.0,540,560,540,560)};

S.wifi=(t,D,B)=>{const E=EVS.wifi(B);
  if(t<E.datos){ // tu móvil: no enviado, sin red
    let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1a1612"/>`+`<g opacity=".35">${cpRoom(t)}</g>`+dark(.6,[[540,560,500,500]]);
    s+=cpHands(t,cpChat(t,1,true,{fail:prog(t,E.sale-.4,E.sale),nodata:true}),{dx:shake(t,.6,3)});
    return cam(s,lerp(1.0,1.12,prog(t,0,E.datos)),540,560,540,560)};
  // el router de la estantería se apaga… y Dani tiene el móvil en la mano
  const off=t>E.apagar;
  const {bg,fg}=cpSofa(t,{tv:'show',router:off?'off':'on',dani:{phoneR:true,look:[3,8],mouth:'line'},you:{phoneR:true,look:[3,7]}});
  const a=eIO(prog(t,E.datos,E.datos+.5)), b=eIO(prog(t,E.movil-.3,E.movil+.2));
  let s=cam(bg+fg,lerp(lerp(1.5,2.3,a),2.6,b),lerp(lerp(700,930,a),cpDX+60,b),lerp(lerp(560,330,a),cpFD[1]+190,b),540,560);
  if(off&&b<.5) s+=bang(820,330,'CLIC',PINK,P(t,E.apagar,.2),70);
  if(b>.4){const ph=`<rect width="280" height="590" fill="#0f1420"/>${statusK({left:'23:07'})}<text x="140" y="140" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" fill="#fff">Wi-Fi</text><rect x="70" y="200" width="140" height="70" rx="35" fill="${off?'#3a3f4a':'#3aaa5a'}"/><circle cx="${off?105:175}" cy="235" r="30" fill="#fff"/><text x="140" y="330" text-anchor="middle" font-family="Inter" font-weight="800" font-size="24" fill="${off?'#ff5a6a':'#8aff9a'}">${off?'DESACTIVADO':'ACTIVADO'}</text>`;
    s+=`<g opacity="${clamp((b-.4)*3).toFixed(2)}">${phoneK(820,560,.85,ph,6)}</g>`;}
  return s};

S.rule3=(t,D,B)=>{const E=EVS.rule3(B), k=eIO(prog(t,0,D));
  const turn=eIO(prog(t,E.pregunta-.2,E.pregunta+.4));
  const {bg,fg}=cpSofa(t,{tv:'show',you:{phoneR:true,look:[3,7],eyes:'wide',brows:'worried',mouth:'line'},dani:{look:[lerp(0,-9,turn),lerp(-3,2,turn)],mouth:'line',brows:turn>.5?'angry':null}});
  return focusCam(bg,fg+sweat(cpYX,905,cpS,t),1,lerp(cpFY[0]+40,(cpFY[0]+cpFD[0])/2,k),cpFY[1]+30,{z1:lerp(2.3,2.0,k),blur:5,dx:shake(t,.3,2)})};

S.look=(t,D,B)=>{const E=EVS.look(B);
  // tu móvil en primer plano… y su cara asomando por encima, mirando la pantalla
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1a1612"/><g opacity=".3">${cpRoom(t)}</g>`+dark(.65,[[600,500,520,520]]);
  const lean=eOut(prog(t,0,E.mira));
  s+=A({...CPDANI,x:lerp(1180,980,lean),y:1420,s:1.45,look:[-8,7],mouth:'line',brows:'angry',tilt:-8});
  s+=cpHands(t,cpChat(t,1,true,{fail:1,nodata:true}),{dx:shake(t,.5,2),y:640,s:1.25});
  if(t>E.pantalla-.1) s+=`<rect x="0" y="0" width="1080" height="1100" fill="#000" opacity="${(.25*P(t,E.pantalla-.1,.3)).toFixed(2)}"/>`;
  return cam(s,lerp(1.0,1.12,prog(t,0,D)),620,560,540,560)};

S.ask=(t,D,B)=>{const E=EVS.ask(B);
  const up=eIO(prog(t,E.has-.1,E.has+.5)), talk=t>E.has&&t<E.tv+.35;
  const {bg,fg}=cpSofa(t,{tv:'news',dani:{blink:false,look:[lerp(-4,-9,up),lerp(7,0,up)],mouth:talk?'o':'line',mopen:talk?.08+.14*Math.abs(Math.sin(t*12)):null,brows:'angry'},you:{phoneR:true,look:[3,7]}});
  return focusCam(bg,fg,1,cpFD[0]-10,cpFD[1]+10,{z1:2.9+.15*t,blur:7,dx:shake(t,.15,2)})+dark(.4,[[540,600,320,360]])};

S.up=(t,D,B)=>{const E=EVS.up(B);
  const up=eIO(prog(t,E.lev,E.despacio+.3));
  const {bg,fg}=cpSofa(t,{tv:'news',you:{phoneR:true,look:[lerp(3,7,up),lerp(8,-1,up)],eyes:'wide',brows:'worried',mouth:'line',tilt:lerp(10,0,up)},dani:{look:[-9,0],mouth:'line',brows:'angry'}});
  return focusCam(bg,fg+sweat(cpYX,905,cpS,t),1,cpFY[0]+10,cpFY[1]+lerp(25,0,up),{z1:2.9,blur:7,dx:shake(t,.35,3)})};

S.end=(t,D,B)=>{const E=EVS.end(B), k=eIO(prog(t,0,D));
  const talk=t<E.nada+.3;
  const {bg,fg}=cpSofa(t,{tv:'news',dani:{blink:false,look:[-9,0],mouth:'smile',brows:'angry'},you:{eyes:'wide'}});
  let s=focusCam(bg,fg,1,cpFD[0]-15,cpFD[1]+5,{z1:lerp(3.1,3.7,k),blur:8})+dark(.55,[[540,600,300,330]]);
  // la luz de la tele parpadea y se apaga al final
  const fl=t>E.nada?prog(t,E.nada,E.nada+.5):0;
  s+=`<rect x="0" y="0" width="1080" height="1100" fill="#000" opacity="${(fl*.85+(Math.sin(t*23)>.85?.25:0)).toFixed(2)}"/>`;
  return s};

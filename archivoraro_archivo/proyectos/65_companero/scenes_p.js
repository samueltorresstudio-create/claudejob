// «¿Y si tu compañero de piso fuera un asesino?» — estilo 2D original (engine/). Sin voz (fake_voice) hasta que llegue el MP3.
// ---------- momentos clave por escena (relativos a la escena) ----------
const EVS={
  hook:B=>({cut:B[0].w[6],asesino:B[0].w[8],tele:B[0].w[14]}),
  sofa:B=>({dani:B[0].w[6],martes:B[0].w[7],sofa:B[0].w[16]}),
  news:B=>({cortan:B[0].w[2],policia:B[0].w[6],asesinato:B[0].w[12]}),
  photo:B=>({foto:B[0].w[3],cicatriz:B[0].w[6],jersey:B[0].w[12]}),
  near:B=>({dani:B[0].w[1],cm:B[0].w[6],ti:B[0].w[9]}),
  rule1:B=>({cara:B[0].w[5],tele:B[0].w[9]}),
  victim:B=>({nombre:B[0].w[3],daniel:B[0].w[7]}),
  contract:B=>({firmo:B[0].w[5],contrato:B[0].w[8]}),
  remote:B=>({coge:B[0].w[1],cambia:B[0].w[5]}),
  odio:B=>({pregunta:B[0].w[1],odio:B[0].w[6]}),
  rule2:B=>({puerta:B[0].w[5],movil:B[0].w[8],finge:B[0].w[10]}),
  phone:B=>({escribes:B[0].w[0],llama:B[0].w[8],policia:B[0].w[11]}),
  wifi:B=>({sale:B[0].w[4],datos:B[0].w[7],wifi:B[0].w[10],apagar:B[0].w[14],movil:B[0].w[18]}),
  rule3:B=>({pregunta:B[0].w[4],rapido:B[0].w[9]}),
  look:B=>({mira:B[0].w[6],pantalla:B[0].w[8]}),
  ask:B=>({has:B[0].w[0],hombre:B[0].w[3],tv:B[0].w[6]}),
  up:B=>({lev:B[0].w[0],despacio:B[0].w[4]}),
  end:B=>({sera:B[0].w[0],nada:B[0].w[5]}),
};
const S={};

// ---------- reparto ----------
// Dani: alto, pelo corto oscuro, barba de tres días, CICATRIZ EN LA CEJA y JERSEY GRIS (lo que dice la tele). Igual en todo el vídeo.
const CPDANI={skin:'#e6b896',hs:'short',hair:'#231c18',stubble:true,scar:true,top:'#8d939c',topD:'#6c727b',pants:'#2a2e38',shoes:'#1b1d2b',seed:23};
// tú: chica joven, coleta, sudadera lila con capucha
const CPYOU={skin:'#f1c6a4',hs:'ponytail',hair:'#6a3a22',fem:true,lashes:true,top:'#b98ad0',topD:'#9466ad',hood:true,strings:true,pants:'#3a4a6a',shoes:'#e9e4d8',seed:41};
// la víctima (el verdadero Daniel Roldán): otro hombre, rubio, gafas
const CPVICT={skin:'#f1c6a4',hs:'sidepart',hair:'#c9a050',glasses:'round',top:'#3f6fb5',topD:'#2f5590',jacket:'#2a3550',pants:'#2a3550',shoes:'#15161f',seed:77};

// ---------- reloj de la historia (martes, 23:04 → 23:08) ----------
const cpClock=T=>{const m=4+Math.min(4,Math.floor(T/16));return `23:${String(m).padStart(2,'0')}`};

// ---------- la tele: lo que sale en pantalla (coordenadas locales W×H) ----------
// mode: 'show' (concurso), 'glitch', 'news' (última hora + foto), 'victim', 'cartoon', 'static'
const cpPhoto=(o,x,y,w,h,k=1)=>{const id=uid('cpph');
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c9ced6"/>`+
    `<rect x="${x}" y="${y}" width="${w}" height="${h*.12}" fill="#000" opacity=".06"/>${[0,1,2,3].map(i=>`<rect x="${x}" y="${y+h*(.2+i*.2)}" width="${w}" height="3" fill="#000" opacity=".08"/>`).join('')}`+
    `<g clip-path="url(#${id})">${A({...o,x:x+w/2,y:y+h*.36+h*.003*640,s:h*.003,still:true,look:[0,0],mouth:'line',blink:false})}</g>`+
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#fff" stroke-width="5"/>`};
function cpTV(W,H,mode,t,o={}){
  let s='';
  if(mode==='show'){ // concurso de colores: focos y un presentador lejano
    s+=`<rect width="${W}" height="${H}" fill="#3a1f6a"/>`;
    for(let i=0;i<7;i++){const a=Math.sin(t*1.5+i)*14;s+=`<path d="M${W*(i+.5)/7},${-10} L${W*(i+.5)/7-60+a},${H} L${W*(i+.5)/7+60+a},${H}Z" fill="${['#ffd34a','#ff5a9a','#5ad4ff'][i%3]}" opacity=".18"/>`;}
    s+=`<rect x="0" y="${H*.72}" width="${W}" height="${H*.28}" fill="#2a1450"/>`;
    for(let i=0;i<9;i++) s+=`<circle cx="${W*(i+.5)/9}" cy="${H*.74}" r="7" fill="${Math.floor(t*6+i)%2?'#ffd34a':'#fff'}"/>`;
    s+=`<rect x="${W*.3}" y="${H*.18}" width="${W*.4}" height="${H*.18}" rx="8" fill="#ffd34a"/><text x="${W/2}" y="${H*.31}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${H*.11}" fill="#3a1f6a">¡GANA YA!</text>`;
    s+=`<g transform="translate(${W*.5},${H*.98}) scale(${H*.0016})">${A({...CAST_BY_ID.C04.o,x:0,y:0,s:1,mouth:'laugh',eyes:'happy',aR:-150,look:[0,0]})}</g>`;
  } else if(mode==='static'||mode==='glitch'){
    const r=rng(Math.floor(t*24)+3);s+=`<rect width="${W}" height="${H}" fill="#2a2e36"/>`;
    for(let i=0;i<120;i++) s+=`<rect x="${(r()*W).toFixed(0)}" y="${(r()*H).toFixed(0)}" width="${(4+r()*30).toFixed(0)}" height="3" fill="${r()<.5?'#fff':'#000'}" opacity=".6"/>`;
    if(mode==='glitch') ['#ff3a5a','#3affb0','#3a8aff','#ffd34a','#fff','#c23aff'].forEach((c,i)=>{s+=`<rect x="${i*W/6}" y="0" width="${W/6+1}" height="${H*.62}" fill="${c}" opacity=".85"/>`});
  } else if(mode==='cartoon'){ // dibujos: sol sonriente y colinas (lo que pone él)
    s+=`<rect width="${W}" height="${H}" fill="#8ad4ff"/><path d="M0,${H*.7} Q${W*.25},${H*.5} ${W*.5},${H*.7} T${W},${H*.68} L${W},${H} L0,${H}Z" fill="#6ac46a"/>`;
    s+=`<circle cx="${W*.75}" cy="${H*.3}" r="${H*.14}" fill="#ffd34a"/><circle cx="${W*.72}" cy="${H*.27}" r="5" fill="#2a2420"/><circle cx="${W*.78}" cy="${H*.27}" r="5" fill="#2a2420"/><path d="M${W*.71},${H*.33} Q${W*.75},${H*.37} ${W*.79},${H*.33}" stroke="#2a2420" stroke-width="4" fill="none"/>`;
  } else { // 'news' y 'victim': informativo de última hora
    const pol=Math.floor(t*4)%2;
    s+=`<rect width="${W}" height="${H}" fill="#14203a"/><rect width="${W}" height="${H}" fill="${pol?'#ff2a3a':'#2a5aff'}" opacity="${(.12+.08*Math.sin(t*12)).toFixed(2)}"/>`;
    s+=`<circle cx="${W*.92}" cy="${H*.1}" r="${H*.18}" fill="${pol?'#ff2a3a':'#2a5aff'}" opacity=".35"/>`;
    const banner=o.banner??1;
    if(mode==='news'){ const pk=o.photo??1;
      if(pk>0) s+=`<g transform="translate(${W*.27},${H*.42}) scale(${eBack(clamp(pk)).toFixed(3)}) translate(${-W*.27},${-H*.42})">${cpPhoto(CPDANI,W*.06,H*.1,W*.42,H*.5,1)}<rect x="${W*.06}" y="${H*.6}" width="${W*.42}" height="${H*.1}" fill="#c21a2a"/><text x="${W*.27}" y="${H*.675}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="${H*.065}" fill="#fff">SE BUSCA</text></g>`;
      s+=`<text x="${W*.54}" y="${H*.26}" font-family="Inter" font-weight="900" font-size="${H*.09}" fill="#fff">BUSCADO POR</text><text x="${W*.54}" y="${H*.38}" font-family="Inter" font-weight="900" font-size="${H*.11}" fill="#ff4a5a">ASESINATO</text>`;
      s+=`<rect x="${W*.54}" y="${H*.45}" width="${W*.38}" height="${H*.05}" fill="#fff" opacity=".18"/><rect x="${W*.54}" y="${H*.53}" width="${W*.3}" height="${H*.05}" fill="#fff" opacity=".18"/>`;
    } else { // victim: foto de OTRO hombre con su nombre
      s+=cpPhoto(CPVICT,W*.06,H*.1,W*.42,H*.5,1)+`<rect x="${W*.06}" y="${H*.6}" width="${W*.42}" height="${H*.1}" fill="#3a3f4a"/><text x="${W*.27}" y="${H*.675}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="${H*.06}" fill="#fff">VÍCTIMA</text>`;
      const nk=o.name??1, nm='DANIEL ROLDÁN';
      s+=`<text x="${W*.54}" y="${H*.26}" font-family="Inter" font-weight="900" font-size="${H*.08}" fill="#fff">LA VÍCTIMA:</text>`;
      if(nk>0) s+=`<text x="${W*.54}" y="${H*.39}" font-family="Inter" font-weight="900" font-size="${H*.085}" fill="#ffd34a">${nm.slice(0,Math.ceil(nm.length*clamp(nk)))}</text>`;
      s+=`<rect x="${W*.54}" y="${H*.47}" width="${W*.36}" height="${H*.05}" fill="#fff" opacity=".18"/>`;
    }
    // faldón de ÚLTIMA HORA con teletipo
    if(banner>0){s+=`<rect x="0" y="${H*.8}" width="${W}" height="${H*.2}" fill="#fff"/><rect x="0" y="${H*.8}" width="${W*.34}" height="${H*.2}" fill="#c21a2a"/><text x="${W*.17}" y="${H*.93}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${H*.075}" fill="#fff">ÚLTIMA HORA</text>`;
      const tick='LA POLICÍA PIDE COLABORACIÓN CIUDADANA · NO SE ACERQUE AL SOSPECHOSO · LLAME AL 091 · ';
      const id=uid('tk');s+=`<clipPath id="${id}"><rect x="${W*.35}" y="${H*.8}" width="${W*.65}" height="${H*.2}"/></clipPath><g clip-path="url(#${id})"><text x="${(W*1.05-((t*90)%(W*1.9))).toFixed(1)}" y="${H*.93}" font-family="${MONO}" font-weight="800" font-size="${H*.06}" fill="#14203a">${tick+tick}</text></g>`;}
    s+=`<text x="${W*.05}" y="${H*.075}" font-family="${MONO}" font-weight="800" font-size="${H*.05}" fill="#fff">● EN DIRECTO</text>`;
  }
  // líneas de barrido de la pantalla
  for(let y=0;y<H;y+=8) s+=`<rect x="0" y="${y}" width="${W}" height="2" fill="#000" opacity=".07"/>`;
  return s}
// televisor con mueble: (cx, y = suelo), w ancho de pantalla
function cpTVSet(cx,y,w,mode,t,o={}){const h=w*.58, x=cx-w/2, ty=y-170-h, id=uid('tvs');
  let s=`<rect x="${cx-w*.62}" y="${y-150}" width="${w*1.24}" height="150" fill="#5a3e2a"/><rect x="${cx-w*.62}" y="${y-150}" width="${w*1.24}" height="16" fill="#6e4e36"/>`;
  s+=[0,1,2].map(i=>`<rect x="${cx-w*.58+i*w*.4}" y="${y-120}" width="${w*.36}" height="100" fill="#4a3222"/><rect x="${cx-w*.58+i*w*.4+w*.15}" y="${y-74}" width="${w*.06}" height="8" fill="#c9a070"/>`).join('');
  s+=`<rect x="${cx-40}" y="${y-176}" width="80" height="26" fill="#1d1d22"/>`;
  s+=`<circle cx="${cx}" cy="${ty+h/2}" r="${w*.9}" fill="${mode==='news'||mode==='victim'?'url(#glowB)':'url(#glowY)'}" opacity=".55"/>`;
  s+=`<rect x="${x-14}" y="${ty-14}" width="${w+28}" height="${h+28}" rx="10" fill="#15161c"/><clipPath id="${id}"><rect x="${x}" y="${ty}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(${x},${ty})">${cpTV(w,h,mode,t,o)}</g></g>`;
  s+=`<rect x="${x}" y="${ty}" width="${w}" height="${h}" fill="url(#beam)" opacity=".08"/>`;
  // planta y altavoz a los lados
  s+=dPlant(cx-w*.52,y-150,.6)+`<rect x="${cx+w*.4}" y="${y-260}" width="60" height="110" rx="8" fill="#2a2e36"/><circle cx="${cx+w*.4+30}" cy="${y-225}" r="18" fill="#15161c"/><circle cx="${cx+w*.4+30}" cy="${y-178}" r="11" fill="#15161c"/>`;
  return s}

// ---------- el router (en la estantería del salón): luces verdes que se apagan ----------
const cpRouter=(x,y,s,t,off)=>{let g=`<rect x="-70" y="-34" width="140" height="34" rx="8" fill="#e9e4d8"/><rect x="-70" y="-6" width="140" height="6" fill="#000" opacity=".15"/><rect x="-56" y="-88" width="8" height="56" rx="3" fill="#d9d4ca"/><rect x="48" y="-88" width="8" height="56" rx="3" fill="#d9d4ca"/>`;
  for(let i=0;i<5;i++){const on=!off&&(i<3||Math.floor(t*6+i*1.7)%3);g+=`<circle cx="${-40+i*18}" cy="-17" r="5" fill="${off?'#3a3a3a':on?'#3aff6a':'#1a5a2a'}"/>`+(on?`<circle cx="${-40+i*18}" cy="-17" r="11" fill="#3aff6a" opacity=".25"/>`:'');}
  if(off) g+=`<circle cx="50" cy="-17" r="5" fill="#ff3a3a"/><circle cx="50" cy="-17" r="12" fill="#ff3a3a" opacity=".3"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`};

// ---------- el salón, de frente (desde la tele) ----------
// o: tv (color de la luz de la tele: 'show'|'news'|'off'), router off, door open, extra props
function cpRoom(t,o={}){
  let s=`<rect x="-600" y="-900" width="2280" height="1810" fill="#c7b49c"/>`;
  s+=decorWall({floor:900,paper:'diamonds',paperOp:.05,items:[['frame',150,260,1,{pic:'photo',w:150,h:120}],['calendar',360,250,1,{month:'NOVIEMBRE',mark:true}],['clock',600,250,1],['sconce',40,420,1,1],['switch',1010,600,1],['socket',300,840,1],['socket',820,840,1]]});
  // ventana de noche con la ciudad
  s+=winK(-210,250,260,330,skyNight(t)+`<g>${[0,1,2,3,4].map(i=>`<rect x="${-210+i*56}" y="${420-i%2*60}" width="46" height="${200+i%2*60}" fill="#1a1f33"/>`+[0,1,2].map(j=>`<rect x="${-200+i*56}" y="${440-i%2*60+j*40}" width="10" height="14" fill="${(i+j)%2?'#ffd76a':'#2a3048'}"/>`).join('')).join('')}</g>`,{cur:'#7a4a5a'});
  // estantería con libros y EL ROUTER
  s+=`<rect x="720" y="330" width="300" height="16" fill="#6a4a30"/><rect x="720" y="346" width="300" height="4" fill="#000" opacity=".2"/>`;
  s+=[0,1,2,3,4].map(i=>`<rect x="${740+i*24}" y="${270-i%2*12}" width="20" height="${60+i%2*12}" fill="${['#c23a3a','#3a6aa8','#e0b04a','#3a8a5a','#7a4a8a'][i]}"/>`).join('');
  s+=cpRouter(930,330,.9,t,o.router==='off');
  s+=`<rect x="730" y="520" width="280" height="16" fill="#6a4a30"/>`+dPlant(790,520,.55)+`<rect x="880" y="470" width="90" height="50" fill="#e9e4d8"/><rect x="886" y="476" width="78" height="38" fill="#9aa3ad"/>`;
  // la puerta de la calle (derecha) con cadena y mirilla
  s+=`<rect x="1080" y="300" width="240" height="600" fill="#f3eee6"/><rect x="1096" y="316" width="210" height="584" fill="#8a5a3a"/><circle cx="1201" cy="430" r="7" fill="#1d1d22"/><rect x="1110" y="600" width="18" height="44" rx="6" fill="#c9a070"/><path d="M1124,560 Q1150,590 1176,560" stroke="#9aa3ad" stroke-width="5" fill="none"/>`;
  s+=floorW(900,'#7a5640');
  s+=`<path d="M-600,900 L1680,900 L1680,1500 L-600,1500Z" fill="url(#beam)" opacity=".05"/>`;
  // alfombra
  s+=`<ellipse cx="540" cy="1040" rx="520" ry="70" fill="#a8484a" opacity=".85"/><ellipse cx="540" cy="1040" rx="440" ry="52" fill="none" stroke="#e0b04a" stroke-width="6" opacity=".6"/>`;
  return s}
// luz de la tele sobre los personajes (viene de la cámara): color según lo que se ve
const cpTVLight=(t,mode,k=1)=>{if(mode==='off')return '';const col=mode==='news'?(Math.floor(t*4)%2?'#ff2a3a':'#2a5aff'):mode==='show'?['#ffd34a','#ff5a9a','#5ad4ff'][Math.floor(t*1.5)%3]:'#9fd0ff';
  return `<rect x="-600" y="-900" width="2280" height="2400" fill="${col}" opacity="${(k*(.07+.03*Math.sin(t*11))).toFixed(3)}" style="mix-blend-mode:screen"/>`};
// el sofá con los dos: devuelve {bg, fg}. you/dani: opciones extra de cada uno
function cpSofa(t,o={}){
  const SY=905, sc=o.s??.66, yx=o.yx??395, dx=o.dx??690;
  const bg=cpRoom(t,o)+sofaK(540,SY,820,'#3f6f74');
  let fg=A({...CPYOU,x:yx,y:SY,s:sc,sit:true,look:[-2,-2],...(o.you||{})});
  fg+=A({...CPDANI,x:dx,y:SY,s:sc*1.04,sit:true,look:[2,-2],...(o.dani||{})});
  fg+=sofaArmsK(540,SY,820,'#3f6f74');
  // mesa baja delante: palomitas, dos tazas y el mando
  fg+=`<rect x="230" y="1000" width="620" height="24" rx="6" fill="#6e4e36"/><rect x="240" y="1024" width="600" height="80" fill="#5a3e2a"/><rect x="250" y="1034" width="290" height="60" fill="#4a3222"/><rect x="550" y="1034" width="280" height="60" fill="#4a3222"/>`;
  fg+=`<path d="M470,1000 L490,950 L590,950 L610,1000Z" fill="#c23a3a"/><path d="M470,1000 L490,950 L510,950 L500,1000Z M530,1000 L540,950 L560,950 L560,1000Z" fill="#fff" opacity=".8"/>`+[0,1,2,3,4,5,6].map(i=>`<circle cx="${500+i*13}" cy="${946-(i%3)*8}" r="11" fill="#fff6dc"/>`).join('');
  fg+=`<rect x="330" y="962" width="44" height="40" rx="6" fill="#e9e4d8"/><path d="M374,972 q18,8 0,20" stroke="#e9e4d8" stroke-width="6" fill="none"/><rect x="690" y="962" width="44" height="40" rx="6" fill="#3a6aa8"/>`;
  if(o.remote!==false) fg+=`<rect x="640" y="988" width="70" height="14" rx="6" fill="#1d1d22"/><circle cx="700" cy="995" r="3" fill="#ff3a3a"/>`;
  fg+=cpTVLight(t,o.tv||'show',o.tvK??1);
  return {bg,fg}}
// la cabeza de un personaje sentado: punto para focusCam
const cpFace=(x,s)=>[x,905-s*500];

// ---------- vista desde detrás del sofá: la tele de frente y las dos cabezas de espaldas ----------
const cpBackHead=(x,y,s,o)=>{let g='';
  g+=`<path d="M-150,170 Q-150,40 -60,30 L60,30 Q150,40 150,170Z" fill="${o.top}"/><path d="M-150,170 Q-150,40 -60,30 L-20,30 Q-110,60 -110,170Z" fill="#000" opacity=".12"/>`;
  if(o.hood) g+=`<path d="M-80,40 Q0,90 80,40 Q60,10 0,12 Q-60,10 -80,40Z" fill="${o.topD}"/>`;
  g+=`<rect x="-34" y="-10" width="68" height="50" fill="${o.skin}"/><circle cx="0" cy="-80" r="100" fill="${o.hair}"/><circle cx="-96" cy="-70" r="20" fill="${o.skin}"/><circle cx="96" cy="-70" r="20" fill="${o.skin}"/>`;
  if(o.hs==='ponytail') g+=`<circle cx="0" cy="-150" r="22" fill="${o.topD}"/><path d="M-30,-150 Q-20,-40 10,30 Q40,-40 30,-150Z" fill="${o.hair}"/>`;
  g+=`<path d="M-80,-140 Q0,-190 80,-140" stroke="#fff" stroke-width="10" opacity=".08" fill="none"/>`;
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${o.rot||0})" filter="url(#chFX)">${g}</g>`};
function cpBehind(t,mode,o={}){
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#2a2420"/>`;
  s+=dWallpaper({kind:'diamonds',col:'#000',op:.06});
  s+=`<rect x="-600" y="760" width="2280" height="800" fill="#4a3628"/>`+dBaseboard(760,'#5a4a3a');
  s+=dFrame(80,200,1,{pic:'abstract',w:140,h:180})+dPoster(880,190,1,{c1:'#2a3a6a',c2:'#ff8a4a'})+dSocket(120,700,1);
  s+=cpTVSet(540,760,o.w||620,mode,t,o);
  // la oscuridad del salón: solo la tele ilumina
  s+=dark(.45,[[540,480,520,380]]);
  // respaldo del sofá y las dos cabezas
  s+=`<rect x="-100" y="${o.sy??930}" width="1280" height="300" rx="40" fill="#2f5357"/><rect x="-100" y="${o.sy??930}" width="1280" height="26" rx="13" fill="#3f6f74"/>`;
  s+=cpBackHead(o.yx??330,(o.sy??930)+40,o.hs??1,{...CPYOU,rot:o.yrot||0});
  s+=cpBackHead(o.dx??740,(o.sy??930)+30,(o.hs??1)*1.06,{...CPDANI,rot:o.drot||0});
  return s}

// ---------- el contrato del piso (recuerdo, hace 4 meses) ----------
function cpContract(t,k,sig,circle){
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#6a4a30"/>`;
  for(let i=0;i<14;i++) s+=`<rect x="-600" y="${-200+i*90}" width="2280" height="4" fill="#000" opacity=".12"/>`;
  s+=`<g transform="translate(540,560) rotate(-4) translate(-540,-560)"><rect x="196" y="126" width="700" height="900" fill="#000" opacity=".25"/><rect x="180" y="110" width="700" height="900" fill="#f6f1e4"/>`;
  s+=`<text x="530" y="190" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="40" fill="#2a2420">CONTRATO DE ALQUILER</text><rect x="240" y="215" width="580" height="4" fill="#2a2420"/>`;
  for(let i=0;i<7;i++) s+=`<rect x="240" y="${260+i*38}" width="${560-(i%3)*90}" height="12" fill="#c9c2b0"/>`;
  s+=`<text x="240" y="580" font-family="${MONO}" font-weight="700" font-size="28" fill="#8a8f99">INQUILINO</text><text x="240" y="630" font-family="${MONO}" font-weight="800" font-size="40" fill="#2a2420">DANIEL ROLDÁN</text>`;
  for(let i=0;i<3;i++) s+=`<rect x="240" y="${670+i*38}" width="${520-i*80}" height="12" fill="#c9c2b0"/>`;
  s+=`<text x="240" y="850" font-family="${MONO}" font-weight="700" font-size="26" fill="#8a8f99">FIRMA</text><rect x="240" y="960" width="420" height="3" fill="#2a2420"/>`;
  // la firma que se va escribiendo
  const path='M250,940 C270,860 300,860 300,930 C300,960 330,880 350,900 C370,920 360,950 390,930 C420,900 430,880 450,920 C470,950 500,890 520,910 C540,930 560,940 600,900 L640,890';
  s+=`<path d="${path}" stroke="#1a3a8a" stroke-width="7" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1-sig).toFixed(3)}"/>`;
  if(circle>0) s+=`<ellipse cx="400" cy="618" rx="${190*eBack(clamp(circle))}" ry="${48*eBack(clamp(circle))}" fill="none" stroke="#e02a3a" stroke-width="9" transform="rotate(-3 400 618)"/>`;
  s+=`</g>`;
  // el bolígrafo (en la mano de Dani: manga del jersey gris)
  if(sig<1){const r=rng(3);const px=250+sig*390, py=930-Math.sin(sig*30)*30;
    s+=`<g transform="translate(${px},${py}) rotate(32)"><rect x="-8" y="-170" width="16" height="170" rx="6" fill="#1a3a8a"/><path d="M-8,0 L0,22 L8,0Z" fill="#c9c2b0"/></g>`;
    s+=`<g transform="translate(${px+34},${py-118}) rotate(32)" filter="url(#chFX)"><path d="M10,-30 Q60,-120 160,-200 L230,-120 Q140,-40 70,40Z" fill="${CPDANI.top}"/><path d="M40,-60 Q80,-110 140,-160" stroke="${CPDANI.topD}" stroke-width="14" fill="none" stroke-linecap="round"/><rect x="18" y="-62" width="70" height="30" rx="12" fill="${CPDANI.topD}" transform="rotate(-40 50 -45)"/><ellipse cx="0" cy="0" rx="52" ry="44" fill="${CPDANI.skin}"/><ellipse cx="-34" cy="18" rx="20" ry="14" fill="${CPDANI.skin}"/><path d="M-30,-14 Q-10,-24 14,-18" stroke="#000" stroke-opacity=".15" stroke-width="5" fill="none"/></g>`;}
  // tono sepia de recuerdo
  s+=`<rect x="-600" y="-900" width="2280" height="2400" fill="#a87a3a" opacity=".22" style="mix-blend-mode:multiply"/>`;
  return s}

// ---------- escenas ----------
const CPTV=(t,mode,o={})=>cpTVSet(540,1180,1000,mode,t,o);   // la tele en primer plano llenando el encuadre

window.CFG={steps:['1. NO CAMBIES LA CARA','2. NO MIRES LA PUERTA','3. NO CONTESTES RÁPIDO'],stepsTitle:'REGLAS',listEnd:'look',
  hud:(h,bt,st,T)=>'SALÓN · '+cpClock(T),
  band:{hook:'#14203a',sofa:'#2a2018',news:'#1a1612',photo:'#14203a',near:'#2a2018',rule1:'#2a2018',victim:'#14203a',contract:'#3a2a1a',remote:'#1a1612',odio:'#2a2018',rule2:'#2a2018',phone:'#0f1420',wifi:'#1a1612',rule3:'#2a2018',look:'#1a1612',ask:'#1a1612',up:'#1a1612',end:'#0c0a08'}};

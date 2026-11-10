// Archivo Raro · catálogo de personajes. ?p=1..3 reparto, ?p=4 peinados y sombreros, ?p=5 rasgos y ropa
const W=1080, H=1920, page=+(new URLSearchParams(location.search).get('p')||1);
const BG='#11131c', CARD='#1b1e2a', LINE='#2c3142';
const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const header=(title,sub)=>`<rect width="${W}" height="${H}" fill="${BG}"/>
  <text x="540" y="96" text-anchor="middle" font-family="Inter" font-weight="900" font-size="58" fill="#fff" letter-spacing="-1">${title}</text>
  <text x="540" y="150" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="24" fill="${YEL}" letter-spacing="3">${sub}</text>
  <rect x="380" y="178" width="320" height="4" rx="2" fill="${PINK}"/>`;
const body=(o,kid,x,y,s)=>(kid?person:A)({...o,x,y,s,blink:false,look:[0,0]});

// ---------- pages 1-3: the cast ----------
function castPage(list,sub){
  let s=header('CASTING · ARCHIVO RARO',sub);
  const cw=336,ch=540,gx=12,gy=20,x0=24,y0=230;
  list.forEach((c,i)=>{
    const col=i%3,row=Math.floor(i/3),x=x0+col*(cw+gx),y=y0+row*(ch+gy),cx=x+cw/2;
    s+=`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="24" fill="${CARD}" stroke="${LINE}" stroke-width="3"/>`;
    s+=`<ellipse cx="${cx}" cy="${y+404}" rx="120" ry="16" fill="#000" opacity=".25"/>`;
    s+=body(c.o,c.kid,cx,y+404,c.kid?.5:.44);
    s+=`<text x="${x+20}" y="${y+40}" font-family="${MONO}" font-weight="800" font-size="24" fill="${YEL}">${c.id}</text>`;
    s+=`<text x="${cx}" y="${y+452}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="32" fill="#fff">${esc(c.name)}</text>`;
    const parts=c.traits.split(' · '), half=Math.ceil(parts.length/2);
    [parts.slice(0,half).join(' · '),parts.slice(half).join(' · ')].forEach((ln,k)=>{if(ln) s+=`<text x="${cx}" y="${y+488+k*28}" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="17" fill="#b9bfd0">${esc(ln)}</text>`;});
  });
  return s;}

// ---------- pages 4-5: heads and small bodies showing one feature each ----------
const BASE={skin:'#e9b48e',hs:'short',hair:'#3a2a26',top:'#4a6a8a',topD:'#3a5a7a',pants:'#2a2e38',shoes:'#2a2620',blink:false,look:[0,0]};
function headCell(x,y,w,h,label,o){
  const cx=x+w/2, hy=y+118, k=.6, id=uid('hc');
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${CARD}" stroke="${LINE}" stroke-width="3"/>`;
  s+=`<clipPath id="${id}"><circle cx="${cx}" cy="${hy-14}" r="100"/></clipPath><circle cx="${cx}" cy="${hy-14}" r="100" fill="#262a38"/>`;
  s+=`<g clip-path="url(#${id})">${A({...BASE,...o,x:cx,y:hy+638*k,s:k})}</g>`;
  s+=`<text x="${cx}" y="${y+h-24}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="21" fill="#fff">${esc(label)}</text>`;
  return s}
function bodyCell(x,y,w,h,label,o){
  const cx=x+w/2;
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${CARD}" stroke="${LINE}" stroke-width="3"/>`;
  s+=A({...BASE,...o,x:cx,y:y+h-46,s:.29});
  s+=`<text x="${cx}" y="${y+h-14}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="20" fill="#fff">${esc(label)}</text>`;
  return s}
function gridOf(items,cols,x0,y0,w,h,gx,gy,fn){return items.map((it,i)=>fn(x0+(i%cols)*(w+gx),y0+Math.floor(i/cols)*(h+gy),w,h,it[0],it[1])).join('')}

function hairPage(){
  let s=header('PEINADOS Y SOMBREROS','CATÁLOGO DE RASGOS · 1/2');
  const items=[['Corto',{hs:'short'}],['Despeinado',{hs:'messy'}],['Raya al lado',{hs:'sidepart'}],['Tupé',{hs:'quiff',hair:'#d9a050'}],
    ['De punta',{hs:'spiky'}],['Rapado',{hs:'buzz'}],['Calvo',{hs:'bald',hair:'#8a847c'}],['Cresta',{hs:'mohawk',hair:'#45e07e'}],
    ['Melena larga',{hs:'long',fem:true,lashes:true}],['Ondulado',{hs:'wavy',hair:'#c23a2a',fem:true,lashes:true}],['Media melena',{hs:'bob',hair:'#6a3a24',fem:true,lashes:true}],['Rizado',{hs:'curly',hair:'#2a1a12',skin:'#c98c64',fem:true,lashes:true}],
    ['Afro',{hs:'afro',hair:'#15100e',skin:'#6a4030',fem:true,lashes:true}],['Coleta',{hs:'ponytail',hair:'#d9a050',fem:true,lashes:true}],['Moño',{hs:'bun',fem:true,lashes:true}],['Trenzas',{hs:'braids',hair:'#15100e',skin:'#8a5a3e',fem:true,lashes:true}],
    ['Coletas',{hs:'pigtails',hair:'#d9a050',fem:true,lashes:true}],['Gorra',{hat:'cap',hatCol:'#c23a3a'}],['Gorro de lana',{hat:'beanie',hatCol:'#2a2e36'}],['Sombrero',{hat:'fedora',hatCol:'#2a2a30'}],
    ['Policía',{hat:'police'}],['Paja',{hat:'straw'}],['Capucha',{hoodUp:true,top:'#1d1d22',topD:'#0c0c10'}],['Canoso',{hs:'sidepart',hair:'#d9d6cf',skin:'#e6b896'}]];
  s+=gridOf(items,4,30,220,247,262,4,12,headCell);
  return s}
function facePage(){
  let s=header('CARAS, CUERPOS Y ROPA','CATÁLOGO DE RASGOS · 2/2');
  const faces=[['Gafas redondas',{glasses:'round'}],['Gafas cuadradas',{glasses:'square'}],['Gafas de sol',{glasses:'sun'}],['Pecas',{freckles:true,hair:'#d9a050'}],
    ['Cicatriz',{scar:true}],['Parche',{eyepatch:true}],['Barba 3 días',{stubble:true}],['Barba',{beard:'#3a2a26'}],
    ['Bigote',{mustache:'#3a2a26'}],['Arrugas',{wrinkles:true,hair:'#d9d6cf'}],['Pendientes',{earrings:'#f1c84b',hs:'bob',fem:true,lashes:true}],['Pintalabios',{lip:'#c2405a',hs:'wavy',fem:true,lashes:true,mouth:'smile'}]];
  s+=gridOf(faces,4,30,220,247,262,4,12,headCell);
  const bodies=[['Delgado',{build:'slim'}],['Normal',{}],['Corpulento',{build:'heavy'}],['Corbata',{tie:'#c23a3a',top:'#e9eef2',topD:'#c9d2da'}],
    ['Bufanda',{scarf:'#ff3e6c'}],['Chaleco',{vest:'#6a5a44',top:'#e9e4d8',topD:'#c9c2b0'}],['Abrigo largo',{coat:'#2a2a30'}],['Bata',{labcoat:true}],
    ['Vestido',{dress:true,top:'#e8c547',topD:'#c9a82a',fem:true,hs:'long',lashes:true}],['Peto',{overalls:'#3f6fb5',top:'#e9e4d8',topD:'#c9c2b0'}],['Sudadera',{hood:true,strings:true,top:'#6a4a9a',topD:'#4a2a7a'}],['Placa',{badge:true,top:'#3a5a8a',topD:'#2a4270'}]];
  s+=gridOf(bodies,4,30,1050,247,272,4,12,bodyCell);
  return s}

const PAGES={1:()=>castPage(CAST.slice(0,9),'REPARTO · 1/3 · HOMBRES'),2:()=>castPage(CAST.slice(9,18),'REPARTO · 2/3 · HOMBRES Y MUJERES'),3:()=>castPage(CAST.slice(18,27),'REPARTO · 3/3 · MUJERES, JÓVENES Y VILLANOS'),4:hairPage,5:facePage};
document.getElementById('cat').innerHTML=PAGES[page]();

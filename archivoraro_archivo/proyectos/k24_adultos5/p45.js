// ---------- parts 4–5 shared helpers ----------
function fenceHole(y0,y1,o={}){ // fence with two bars bent apart at o.hx: a gap a child fits through
  const col=o.col||'#2a3240', hx=o.hx??240;let s='';
  for(let x=-400;x<1500;x+=52){
    if(Math.abs(x+7-hx)<60){ // bent bars
      const d=x+7<hx?-1:1;
      s+=`<path d="M${x+7},${y0} L${x+7},${y1-330} Q${x+7+d*46},${y1-200} ${x+7},${y1-70} L${x+7},${y1}" stroke="${col}" stroke-width="14" fill="none"/><polygon points="${x-6},${y0} ${x+7},${y0-34} ${x+20},${y0}" fill="${col}"/>`;
      continue;}
    s+=`<rect x="${x}" y="${y0}" width="14" height="${y1-y0}" fill="${col}"/><polygon points="${x-6},${y0} ${x+7},${y0-34} ${x+20},${y0}" fill="${col}"/>`;}
  s+=`<rect x="-600" y="${y0+40}" width="2280" height="16" fill="${col}"/><rect x="-600" y="${y1-80}" width="${hx-80+600}" height="16" fill="${col}"/><rect x="${hx+80}" y="${y1-80}" width="1600" height="16" fill="${col}"/>`;
  if(o.gx!=null) s+=`<rect x="${o.gx-12}" y="${y0-20}" width="24" height="${y1-y0+20}" fill="${mix(col,'#000000',.3)}"/>`;
  return s}
function photoCard(x,y,who,label,a){ // instant photo of someone's face
  if(a<=0) return '';const id=uid('pc');
  return `<g opacity="${a.toFixed(2)}" transform="translate(${x},${y}) rotate(-6) scale(${(.85+.15*eOut(a)).toFixed(3)})"><rect x="-120" y="-150" width="240" height="290" fill="#f3f3f6"/><clipPath id="${id}"><rect x="-100" y="-130" width="200" height="200"/></clipPath><rect x="-100" y="-130" width="200" height="200" fill="#9fd0f0"/><g clip-path="url(#${id})">${A({...who,x:0,y:-30+638*.42,s:.42,look:[0,0],mouth:'smile',still:true})}</g><text x="0" y="118" text-anchor="middle" font-family="Inter" font-weight="900" font-style="italic" font-size="34" fill="#283a8a">${label}</text></g>`}
function metroK(t){ // abandoned underground platform: tiled wall, dead lights, platform edge
  let s=`<rect x="-600" y="-900" width="2280" height="2400" fill="#1c2230"/>`;
  for(let y=160;y<760;y+=44) s+=`<line x1="-600" y1="${y}" x2="1680" y2="${y}" stroke="#2c3446" stroke-width="3"/>`;
  for(let x=-580;x<1680;x+=88) s+=`<line x1="${x}" y1="160" x2="${x}" y2="760" stroke="#2c3446" stroke-width="3"/>`;
  s+=`<rect x="-600" y="120" width="2280" height="40" fill="#141a26"/><rect x="200" y="230" width="680" height="90" rx="10" fill="#203a6a"/><text x="540" y="292" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="#cfd8e6" opacity=".7">ESTACIÓN CERRADA</text>`;
  s+=`<rect x="-600" y="760" width="2280" height="800" fill="#262a33"/><rect x="-600" y="1020" width="2280" height="22" fill="#d9b23a" opacity=".6"/>`;
  return s}
// rows of sleeping adults standing on the platform; o.skip(i) hides one, o.guards = indexes with black eyes
const ROWS=[{y:700,s:.34,xs:[60,190,320,450,580,710,840,970]},{y:770,s:.42,xs:[0,150,300,450,600,750,900,1050]},{y:860,s:.5,xs:[80,260,440,620,800,980]}];
function sleepers(t,o={}){
  let s='',n=0;
  ROWS.forEach((r,ri)=>r.xs.forEach((x,k)=>{const i=n++;if(o.skip&&o.skip(i,x,ri)) return;
    const g=o.guards&&o.guards.includes(i);
    s+=extra(ADULTS,i,{x,y:r.y,s:r.s,eyes:g?'open':'closed',look:[0,0],still:true,seed:i*3+1});
    if(g) s+=creepAt(x,r.y,r.s,1);}));
  return s}

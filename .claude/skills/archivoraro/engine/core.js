// Shared video core: narration-driven timeline, captions (two pages when long), HUD + rules list, cut punch, grain.
// Each video defines S (scenes), EVS (key times per scene) and CFG {steps, listEnd, band, hud} before loading this file.
const eIn=t=>t*t*t;
const CFG=window.CFG||{};
// ---------- timeline from the narration ----------
function wordTimes(b){
  if(b.words&&b.words.length) return b.words.slice();
  const ws=b.cap.split(' ').map(w=>w.split('|')[0]);
  const wt=ws.map(w=>w.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]/g,'').length+1.5);
  const tot=wt.reduce((a,c)=>a+c,0);let acc=0;
  if(b.chunks&&b.chunks.length){ // spread the words over the voiced time only, skipping the pauses
    const V=b.chunks.reduce((a,c)=>a+(c[1]-c[0]),0);
    const at=v=>{for(const [c0,c1] of b.chunks){if(v<=c1-c0) return c0+v;v-=c1-c0;}return b.chunks[b.chunks.length-1][1];};
    return ws.map((w,i)=>{const s=at(V*.97*acc/tot);acc+=wt[i];return s});}
  return ws.map((w,i)=>{const s=b.lead+b.vdur*.97*acc/tot;acc+=wt[i];return s});
}
const P=(t,a,d=.3)=>eOut(prog(t,a,a+d));
const BEATS=SCRIPT.map((l,i)=>Object.assign({},l,VOICE.beats[i]));
let sceneStart=0;
BEATS.forEach((b,i)=>{if(i===0||BEATS[i-1].sc!==b.sc)sceneStart=b.start;b.sStart=sceneStart;b.wt=wordTimes(b);});
BEATS.forEach(b=>{b.sDur=BEATS.filter(x=>x.sStart===b.sStart).reduce((a,x)=>a+x.d,0);b.B=BEATS.filter(x=>x.sStart===b.sStart).map(x=>({s:x.start-b.sStart,d:x.d,lead:x.lead,vdur:x.vdur,w:x.wt.map(w=>w+x.start-b.sStart)}))});
const TOTAL=VOICE.total, CUT=TOTAL-VOICE.tail; window.TOTAL=TOTAL;
const evAbs={};
BEATS.filter(b=>b.start===b.sStart).forEach(b=>{const E=EVS[b.sc](b.B);for(const k in E){const v=E[k];evAbs[b.sc+'.'+k]=Array.isArray(v)?v.map(x=>x+b.sStart):v+b.sStart}});
window.EVENTS={total:TOTAL,cut:CUT,ev:evAbs,beats:BEATS.map(b=>({start:b.start,d:b.d,sc:b.sc,cut:b.start===b.sStart,words:b.wt.map(w=>w+b.start),step:b.step??null,voice:b.voice||null,lead:b.lead,vdur:b.vdur}))};
const STEPS=CFG.steps||[];
const stepStart=STEPS.map((_,i)=>BEATS.find(b=>b.step===i).start), listEnd=CFG.listEnd?BEATS.find(b=>b.sc===CFG.listEnd).start:CUT;
// film grain tile (built once)
const GRAIN=(()=>{const r=rng(99);let g='';for(let i=0;i<260;i++)g+=`<rect x="${(r()*240).toFixed(0)}" y="${(r()*240).toFixed(0)}" width="2" height="2" fill="${r()<.5?'#fff':'#000'}"/>`;return g})();

function hudSvg(text,alert,reveal,T){
  // top card: «LABEL · VALUE» → small label + big value with an icon; plain text → one big line. Alert = red, pulsing.
  const col=alert?'#ff4a6a':'#ffd34a', pulse=alert?.5+.5*Math.sin(T*6):0;
  const parts=String(text).split(' · '), label=parts.length>1?parts[0]:'', value=parts.length>1?parts.slice(1).join(' · '):parts[0];
  const vis=s=>s.slice(0,Math.ceil(s.length*reveal));
  const isTime=/\d{1,2}:\d{2}/.test(value);
  const vW=value.length*(isTime?27:24), lW=label.length*15.5, w=Math.max(360,Math.max(vW,lW)+150), h=label?(CFG.hudFrac&&CFG.hudFrac(T)!=null?108:96):80, x=540-w/2, y=78;
  let s=`<defs><linearGradient id="hudG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2033"/><stop offset="1" stop-color="#0b0d17"/></linearGradient></defs>`;
  s+=`<rect x="${x-4}" y="${y-4}" width="${w+8}" height="${h+8}" rx="${h/2+4}" fill="${col}" opacity="${(.14+.22*pulse).toFixed(2)}" style="filter:blur(8px)"/>`;
  s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="url(#hudG)" stroke="${col}" stroke-width="3"/>`;
  s+=`<rect x="${x+h/2}" y="${y+3}" width="${w-h}" height="2" fill="#fff" opacity=".12"/>`;
  // icon badge
  const ix=x+h/2+2, iy=y+h/2;
  s+=`<circle cx="${ix}" cy="${iy}" r="${h/2-12}" fill="${col}" opacity="${alert?(.85+.15*pulse).toFixed(2):'.95'}"/>`;
  if(alert) s+=`<path d="M${ix},${iy-17} L${ix+17},${iy+13} L${ix-17},${iy+13}Z" fill="#11131f"/><rect x="${ix-2.5}" y="${iy-7}" width="5" height="11" rx="2" fill="${col}"/><circle cx="${ix}" cy="${iy+8}" r="2.8" fill="${col}"/>`;
  else if(isTime) s+=`<circle cx="${ix}" cy="${iy}" r="17" fill="none" stroke="#11131f" stroke-width="4.5"/><path d="M${ix},${iy-10} L${ix},${iy} L${ix+8},${iy+5}" stroke="#11131f" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  else s+=`<circle cx="${ix}" cy="${iy}" r="7" fill="#11131f" opacity="${(Math.floor(T*2)%2)?.4:1}"/>`;
  const tx=x+h+(w-h-24)/2;
  if(label){s+=`<text x="${tx}" y="${y+36}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="21" letter-spacing="5" fill="${col}" opacity=".85">${vis(label)}</text>`;
    s+=`<text x="${tx}" y="${y+78}" text-anchor="middle" font-family="${MONO}" font-weight="800" font-size="${isTime?42:36}" letter-spacing="3" fill="#fff">${vis(value)}</text>`;}
  else s+=`<text x="${tx}" y="${y+52}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="34" letter-spacing="3" fill="#fff">${vis(value)}</text>`;
  if(CFG.hudFrac&&CFG.hudFrac(T)!=null&&label){const f=clamp(CFG.hudFrac(T));s+=`<rect x="${x+h}" y="${y+h-16}" width="${w-h-28}" height="5" rx="2.5" fill="#fff" opacity=".12"/><rect x="${x+h}" y="${y+h-16}" width="${((w-h-28)*f).toFixed(1)}" height="5" rx="2.5" fill="${col}"/>`;}
  // steps card
  if(T>=stepStart[0]&&T<listEnd){
    const n=stepStart.filter(st=>T>=st).length, cw=Math.max(...STEPS.map(x=>x.replace(/^\d+\.\s*/,'').length))*14.6+120, ch=58+n*52, cx=24, cy=y+h+22;
    const appear=eOut(prog(T,stepStart[0],stepStart[0]+.35));
    s+=`<g transform="translate(${((appear-1)*60).toFixed(1)},0)" opacity="${appear.toFixed(2)}">`;
    s+=`<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="20" fill="url(#hudG)" fill-opacity=".94" stroke="#ffffff" stroke-opacity=".14" stroke-width="2"/>`;
    s+=`<rect x="${cx}" y="${cy}" width="7" height="${ch}" rx="3.5" fill="${YEL}"/>`;
    s+=`<text x="${cx+26}" y="${cy+34}" font-family="Inter" font-weight="900" font-size="19" letter-spacing="5" fill="${YEL}" opacity=".9">${CFG.stepsTitle||'PASOS'}</text><text x="${cx+cw-22}" y="${cy+34}" text-anchor="end" font-family="${MONO}" font-weight="800" font-size="19" fill="#fff" opacity=".5">${Math.max(0,n-1)}/${STEPS.length}</text>`;
    for(let i=0;i<n;i++){const a=prog(T,stepStart[i]+.15,stepStart[i]+.45),done=i<n-1, ry=cy+58+i*52, txt=STEPS[i].replace(/^\d+\.\s*/,'');
      const bx=cx+44, by=ry+12;
      if(done) s+=`<circle cx="${bx}" cy="${by}" r="17" fill="${GREEN}"/><path d="M${bx-8},${by} L${bx-2},${by+7} L${bx+9},${by-6}" stroke="#11131f" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      else s+=`<circle cx="${bx}" cy="${by}" r="${(17+2*Math.sin(T*5)).toFixed(1)}" fill="${YEL}"/><text x="${bx}" y="${by+7}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="20" fill="#11131f">${i+1}</text>`;
      s+=`<text x="${bx+32}" y="${by+8}" font-family="Inter" font-weight="800" font-size="23" fill="${done?'#9aa3ad':'#fff'}"${done?' text-decoration="line-through"':''}>${txt.slice(0,Math.ceil(txt.length*a))}</text>`;}
    s+=`</g>`;
  }
  return s;
}
const BAND=CFG.band||{};
const scEl=document.getElementById('scene'),hudEl=document.getElementById('hud'),capEl=document.getElementById('cap'),stEl=document.getElementById('stage');
window.render=function(T){
  window.__T=T;
  if(T>=CUT){stEl.style.background='#000';scEl.innerHTML='';hudEl.innerHTML='';capEl.innerHTML='';return;}
  let bi=BEATS.findIndex(b=>T>=b.start&&T<b.start+b.d); if(bi<0) bi=BEATS.length-1;
  const b=BEATS[bi], bt=T-b.start, st=T-b.sStart, band=BAND[b.sc]||'#121626';
  stEl.style.background=band||'#121626';
  let svg=`<defs>${tintDefs()}<clipPath id="sc"><rect width="1080" height="1100"/></clipPath>
    <linearGradient id="fadeB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${band}" stop-opacity="0"/><stop offset="1" stop-color="${band}"/></linearGradient>
    <radialGradient id="glowY"><stop offset="0" stop-color="#ffd76a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowB"><stop offset="0" stop-color="#9fd0ff" stop-opacity=".35"/><stop offset="1" stop-color="#9fd0ff" stop-opacity="0"/></radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6c8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient>
    <pattern id="grain" width="240" height="240" patternUnits="userSpaceOnUse" patternTransform="translate(${Math.floor(T*30*37)%240},${Math.floor(T*30*53)%240})">${GRAIN}</pattern>
    <radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></radialGradient>
    <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe2b0" stop-opacity=".22"/><stop offset=".6" stop-color="#ffe2b0" stop-opacity="0"/></linearGradient>
    <filter id="chFX" x="-20%" y="-12%" width="140%" height="124%" color-interpolation-filters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="4.8" result="dil"/><feFlood flood-color="#1d1b2a"/><feComposite in2="dil" operator="in" result="outline"/>
      <feOffset in="SourceAlpha" dx="-18" dy="-6" result="o1"/><feComposite in="SourceAlpha" in2="o1" operator="out" result="e1"/><feGaussianBlur in="e1" stdDeviation="6" result="e1b"/>
      <feFlood flood-color="#1a1430" flood-opacity=".26"/><feComposite in2="e1b" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="shade"/>
      <feOffset in="SourceAlpha" dx="12" dy="8" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="e2"/><feGaussianBlur in="e2" stdDeviation="5" result="e2b"/>
      <feFlood flood-color="#fff6e0" flood-opacity=".12"/><feComposite in2="e2b" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="rim"/>
      <feMerge><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/><feMergeNode in="shade"/><feMergeNode in="rim"/></feMerge></filter></defs>`;
  // cut punch: every new scene lands with a quick zoom-in that settles
  const cutIn=b.start===b.sStart&&bi>0, pk=cutIn?1-eOut(prog(bt,0,.32)):0;
  const dx=Math.sin(T*.7)*3+Math.sin(T*1.9)*1.2, dy=Math.sin(T*.9+1)*2.5;
  svg+=`<g clip-path="url(#sc)"><g transform="translate(540,550) scale(${(1+.075*pk).toFixed(4)}) translate(${(-540+dx).toFixed(2)},${(-550+dy).toFixed(2)})">${S[b.sc](st,b.sDur,b.B)}</g><rect width="1080" height="1100" fill="url(#warm)" style="mix-blend-mode:screen"/><rect width="1080" height="1100" fill="url(#vig)"/><rect width="1080" height="1100" fill="url(#grain)" opacity=".07"/></g>`;
  svg+=`<rect y="900" width="1080" height="202" fill="url(#fadeB)"/>`;
  if(cutIn) svg+=`<rect width="1080" height="1100" fill="#fff" opacity="${(.12*(1-prog(bt,0,.08))).toFixed(3)}"/>`;
  scEl.innerHTML=svg;
  const htxt=(b.hud||'').startsWith('#')&&CFG.hud?CFG.hud(b.hud,bt,st,T):b.hud;
  hudEl.innerHTML=hudSvg(htxt,!!b.alert,(bi>0&&BEATS[bi-1].hud===b.hud)||(b.hud||'').startsWith('#')?1:prog(bt,0,.28),T);
  const words=b.cap.split(' ').map(w=>{const [tx,c]=w.split('|');return{tx,c}});
  let len=b.cap.replace(/\|[a-z]/g,'').length, from=0, to=words.length;
  if(len>34&&words.length>5){
    let best=1,bs=1e9,acc=0;
    for(let i=1;i<words.length;i++){acc+=words[i-1].tx.length+1;const sc=Math.abs(acc/len-.5)-(/[.,:…]$/.test(words[i-1].tx)?.22:0);if(sc<bs){bs=sc;best=i}}
    if(bt<b.wt[best]-.04) to=best; else from=best;
    len=words.slice(from,to).reduce((a,w)=>a+w.tx.length+1,0);
  }
  capEl.style.fontSize=(len>30?92:len>22?100:108)+'px';
  let html='';
  words.forEach((w,i)=>{ if(i<from||i>=to) return;
    const wt=b.wt[i], on=bt>=wt, k=prog(bt,wt,wt+.14);
    const col=on?(w.c?ACC[w.c]:'#ffffff'):'rgba(255,255,255,.28)';
    const sc=on?lerp(1.16,1,eOut(k)):1;
    const glow=on&&w.c?`;text-shadow:0 0 28px ${ACC[w.c]}88,0 6px 0 rgba(0,0,0,.28)`:'';
    html+=`<span class="w" style="color:${col};transform:scale(${sc.toFixed(3)})${glow}">${w.tx}</span> `;
  });
  capEl.innerHTML=html;
  const cp=eOut(prog(bt,0,.12));
  capEl.style.transform=`translateY(${(1-cp)*20}px)`;
  capEl.style.opacity=cp.toFixed(3);
};
window.render(0);

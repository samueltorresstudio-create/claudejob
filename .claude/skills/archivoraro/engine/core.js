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
  const col=alert?PINK:YEL;
  const w=Math.max(500,text.length*24+140),x=540-w/2,y=92;
  let s=`<rect x="${x}" y="${y}" width="${w}" height="76" fill="#11131f" fill-opacity=".9" stroke="${col}" stroke-width="3"/>`;
  s+=`<circle cx="${x+32}" cy="${y+38}" r="8" fill="${PINK}" opacity="${(Math.floor(T*2)%2)?.25:1}"/>`;
  s+=`<text x="540" y="${y+50}" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="34" letter-spacing="4" fill="${col}">${text.slice(0,Math.ceil(text.length*reveal))}</text>`;
  if(T>=stepStart[0]&&T<listEnd){
    const n=stepStart.filter(st=>T>=st).length;
    s+=`<rect x="22" y="186" width="${Math.max(...STEPS.map(x=>x.length))*16+70}" height="${22+n*40}" rx="10" fill="#11131f" fill-opacity=".82"/>`;
    for(let i=0;i<n;i++){const a=prog(T,stepStart[i]+.15,stepStart[i]+.4),done=i<n-1;
      s+=`<text x="40" y="${222+i*40}" font-family="${MONO}" font-weight="700" font-size="25" letter-spacing="1" fill="${done?GREEN:YEL}">${STEPS[i].slice(0,Math.ceil(STEPS[i].length*a))}${done?' ✓':''}</text>`;}
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
    <radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient></defs>`;
  // cut punch: every new scene lands with a quick zoom-in that settles
  const cutIn=b.start===b.sStart&&bi>0, pk=cutIn?1-eOut(prog(bt,0,.32)):0;
  const dx=Math.sin(T*.7)*3+Math.sin(T*1.9)*1.2, dy=Math.sin(T*.9+1)*2.5;
  svg+=`<g clip-path="url(#sc)"><g transform="translate(540,550) scale(${(1+.075*pk).toFixed(4)}) translate(${(-540+dx).toFixed(2)},${(-550+dy).toFixed(2)})">${S[b.sc](st,b.sDur,b.B)}</g><rect width="1080" height="1100" fill="url(#vig)"/><rect width="1080" height="1100" fill="url(#grain)" opacity=".05"/></g>`;
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

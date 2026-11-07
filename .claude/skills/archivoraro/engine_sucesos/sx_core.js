// ===== SUCESOS style core (canvas 2D) =====
// Timeline from voice.js (same contract as core.js: window.render(t), window.TOTAL, window.EVENTS),
// captions at the top (spoken words white, upcoming grey, key word in a blue «selection» box),
// grain + vignette, black after the cut. Scenes: S[sc](X,t,D,B,T) draw the whole 1080x1920 frame.
const CFG=window.CFG||{};
// ---------- timeline ----------
function wordTimes(b){
  if(b.words&&b.words.length) return b.words.slice();
  const ws=b.cap.split(' ').map(w=>w.split('|')[0]);
  const wt=ws.map(w=>w.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]/g,'').length+1.5);
  const tot=wt.reduce((a,c)=>a+c,0);let acc=0;
  if(b.chunks&&b.chunks.length){const V=b.chunks.reduce((a,c)=>a+(c[1]-c[0]),0);
    const at=v=>{for(const [c0,c1] of b.chunks){if(v<=c1-c0) return c0+v;v-=c1-c0;}return b.chunks[b.chunks.length-1][1];};
    return ws.map((w,i)=>{const s=at(V*.97*acc/tot);acc+=wt[i];return s});}
  return ws.map((w,i)=>{const s=b.lead+b.vdur*.97*acc/tot;acc+=wt[i];return s});
}
const BEATS=SCRIPT.map((l,i)=>Object.assign({},l,VOICE.beats[i]));
let _ss=0;BEATS.forEach((b,i)=>{if(i===0||BEATS[i-1].sc!==b.sc)_ss=b.start;b.sStart=_ss;b.wt=wordTimes(b);});
BEATS.forEach(b=>{b.sDur=BEATS.filter(x=>x.sStart===b.sStart).reduce((a,x)=>a+x.d,0);b.B=BEATS.filter(x=>x.sStart===b.sStart).map(x=>({s:x.start-b.sStart,d:x.d,lead:x.lead,vdur:x.vdur,w:x.wt.map(w=>w+x.start-b.sStart)}))});
const TOTAL=VOICE.total, CUT=TOTAL-VOICE.tail; window.TOTAL=TOTAL;
const evAbs={};
BEATS.filter(b=>b.start===b.sStart).forEach(b=>{const E=EVS[b.sc](b.B);for(const k in E){const v=E[k];evAbs[b.sc+'.'+k]=Array.isArray(v)?v.map(x=>x+b.sStart):v+b.sStart}});
window.EVENTS={total:TOTAL,cut:CUT,ev:evAbs,beats:BEATS.map(b=>({start:b.start,d:b.d,sc:b.sc,cut:b.start===b.sStart,words:b.wt.map(w=>w+b.start),step:null,voice:b.voice||null,lead:b.lead,vdur:b.vdur}))};

// ---------- assets ----------
const IMG={};
const READY=Promise.all((CFG.tex||[]).map(n=>new Promise(r=>{const i=new Image();i.onload=()=>{IMG[n]=i;r()};i.onerror=()=>{console.error('missing tex '+n);r()};i.src='tex_'+n+'.png'}))).then(()=>document.fonts.ready);
const GRAIN=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),d=g.createImageData(256,256),r=rng(7);
  for(let i=0;i<d.data.length;i+=4){const v=r()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=26;}g.putImageData(d,0,0);return c})();

// ---------- captions (top) ----------
const ACC={y:'#ffd34a',p:'#ff5a7a',b:'#6cc6ff',g:'#5ae08a'};
// archive-film look: dust specks, a scratch now and then, slight gate weave
function filmFX(T){const f=Math.floor(T*30),r=rng(f*7+3);X.save();X.globalAlpha=.5;X.fillStyle='#000';for(let i=0;i<5;i++){X.beginPath();X.arc(r()*W,r()*H,1+r()*2.5,0,7);X.fill();}
  X.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<3;i++){X.fillRect(r()*W,r()*H,2,2);}
  if(hsh(Math.floor(T*2),5)<.35){const sx=hsh(Math.floor(T*2),6)*W;X.globalAlpha=.18;X.fillStyle='#fff';X.fillRect(sx+Math.sin(T*40)*2,0,1.5,H);}X.restore();}
function chunks(words){const out=[];let cur=[],len=0;
  words.forEach((w,i)=>{cur.push(i);len+=w.tx.length+1;const end=/[.,…?!:»]$/.test(w.tx);
    if(len>20||(end&&cur.length>=2)||(end&&len>12)){out.push(cur);cur=[];len=0;}});
  if(cur.length) out.push(cur);return out}
function captions(b,bt){
  const words=b.cap.split(' ').map(w=>{const [tx,c]=w.split('|');return{tx,c}});
  const ch=chunks(words);let ci=0;for(let k=0;k<ch.length;k++) if(bt>=b.wt[ch[k][0]]-.05) ci=k;
  const idx=ch[ci];
  X.save();X.setTransform(1,0,0,1,0,0);
  const FS=66;X.font=`800 ${FS}px Inter`;X.textBaseline='alphabetic';
  // wrap into max 2 lines of ~900px
  const lines=[[]];let lw=0;const sp=X.measureText(' ').width;
  idx.forEach(i=>{const w=X.measureText(words[i].tx).width;if(lw+w>900&&lines[lines.length-1].length){lines.push([]);lw=0;}lines[lines.length-1].push(i);lw+=w+sp;});
  const y0=220-(lines.length-1)*40;
  lines.forEach((ln,li)=>{const tw=ln.reduce((a,i)=>a+X.measureText(words[i].tx).width,0)+sp*(ln.length-1);let x=540-tw/2;const y=y0+li*84;
    ln.forEach(i=>{const w=words[i], ww=X.measureText(w.tx).width, on=bt>=b.wt[i]-.02, k=prog(bt,b.wt[i]-.02,b.wt[i]+.12);
      const mark=w.c&&on, mk=eOut(k);
      if(mark){ // yellow marker stroke behind the key word (Archivo Raro seal)
        const col=ACC[w.c]||ACC.y;X.save();X.translate(x-12,y-FS*.62);X.rotate(-1.5*D2R);X.fillStyle=col;X.globalAlpha=.95;
        X.beginPath();X.moveTo(0,6);X.lineTo((ww+24)*mk,0);X.lineTo((ww+24)*mk+6,FS*.82);X.lineTo(-4,FS*.88);X.closePath();X.fill();X.restore();}
      X.shadowColor='rgba(0,0,0,.55)';X.shadowBlur=14;X.shadowOffsetY=3;
      if(mark){X.shadowColor='transparent';X.fillStyle='#11131f';}else X.fillStyle=on?'#ffffff':'rgba(255,255,255,.42)';X.fillText(w.tx,x,y);
      X.shadowColor='transparent';x+=ww+sp;});});
  X.restore();
}

// ---------- frame ----------
function frame(T){
  X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';X.filter='none';
  if(T>=CUT){X.fillStyle='#000';X.fillRect(0,0,W,H);return;}
  let bi=0;for(let i=0;i<BEATS.length;i++) if(T>=BEATS[i].start) bi=i;
  const b=BEATS[bi], t=T-b.sStart;
  X.fillStyle='#000';X.fillRect(0,0,W,H);
  GW=[noise1(T*3,9)*1.4,noise1(T*3,10)*1.4];X.save();S[b.sc](X,t,b.sDur,b.B,T);X.restore();GW=[0,0];
  X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';X.filter='none';X.shadowColor='transparent';
  // top shade for the captions + vignette + grain
  let g=X.createLinearGradient(0,0,0,420);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.fillRect(0,0,W,420);
  g=X.createRadialGradient(540,960,600,540,960,1250);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.55)');X.fillStyle=g;X.fillRect(0,0,W,H);
  const r=rng(Math.floor(T*30)+1),ox=Math.floor(r()*256),oy=Math.floor(r()*256);X.globalAlpha=1;for(let y=-oy;y<H;y+=256) for(let x=-ox;x<W;x+=256) X.drawImage(GRAIN,x,y);
  // little flash on scene cuts
  if(t<.07&&bi>0){X.fillStyle=`rgba(255,255,255,${(.12*(1-t/.07)).toFixed(3)})`;X.fillRect(0,0,W,H);}
  filmFX(T);
  captions(b,T-b.start);
}
window.render=async T=>{await READY;frame(T);};

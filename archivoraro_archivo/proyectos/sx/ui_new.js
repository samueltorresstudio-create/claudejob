// ---------- UI (Archivo Raro seal): data tag, small tag, case-file card ----------
function rr(x,y,w,h,r){X.beginPath();X.moveTo(x+r,y);X.arcTo(x+w,y,x+w,y+h,r);X.arcTo(x+w,y+h,x,y+h,r);X.arcTo(x,y+h,x,y,r);X.arcTo(x,y,x+w,y,r);X.closePath();}
function brackets(x,y,w,h,col,L=22,lw=5){X.strokeStyle=col;X.lineWidth=lw;X.beginPath();
  X.moveTo(x,y+L);X.lineTo(x,y);X.lineTo(x+L,y);X.moveTo(x+w-L,y);X.lineTo(x+w,y);X.lineTo(x+w,y+L);
  X.moveTo(x+w,y+h-L);X.lineTo(x+w,y+h);X.lineTo(x+w-L,y+h);X.moveTo(x+L,y+h);X.lineTo(x,y+h);X.lineTo(x,y+h-L);X.stroke();}
// big data tag: square dark box, coloured side block, corner brackets, mono header with the REC dot
function pill(x,y,big,small,a,o={}){if(a<=0) return;X.save();X.setTransform(1,0,0,1,0,0);const col=o.col||'#ffd34a', fs=o.fs||88;
  X.font=`900 ${fs}px Inter`;const bw=X.measureText(big).width;X.font=`800 ${fs*.4}px Inter`;const sw=small?X.measureText(small).width+18:0;
  const w=bw+sw+90,h=fs*1.5,k=eBack(clamp(a));X.translate(x,y);X.scale(.75+.25*k,.75+.25*k);X.globalAlpha=clamp(a*2);
  X.shadowColor='rgba(0,0,0,.6)';X.shadowBlur=26;X.shadowOffsetY=10;X.fillStyle='rgba(14,15,24,.9)';X.fillRect(-w/2,-h/2,w,h);X.shadowColor='transparent';
  X.fillStyle=col;X.fillRect(-w/2,-h/2,16,h);brackets(-w/2-8,-h/2-8,w+16,h+16,'rgba(255,255,255,.55)',20,4);
  X.textBaseline='middle';X.fillStyle=col;X.font=`900 ${fs}px Inter`;X.fillText(big,-w/2+44,4);
  if(small){X.font=`800 ${fs*.4}px Inter`;X.fillStyle='#e9ecf4';X.fillText(small,-w/2+44+bw+18,fs*.18);}
  X.restore();}
function label(x,y,txt,a,o={}){if(a<=0) return;X.save();X.setTransform(1,0,0,1,0,0);const col=o.col||'#ffd34a',fs=o.fs||38;X.font=`800 ${fs}px "JetBrains Mono"`;
  const w=X.measureText(txt.toUpperCase()).width+64,h=fs*1.7;X.translate(x,y);const k=.8+.2*eBack(clamp(a));X.scale(k,k);X.globalAlpha=clamp(a*2);
  X.fillStyle='rgba(14,15,24,.88)';X.fillRect(-w/2,-h/2,w,h);X.fillStyle=col;X.fillRect(-w/2,-h/2,12,h);X.strokeStyle=col;X.globalAlpha*=.6;X.lineWidth=2;X.strokeRect(-w/2,-h/2,w,h);X.globalAlpha=clamp(a*2);
  X.fillStyle=col;X.textAlign='center';X.textBaseline='middle';X.fillText(txt.toUpperCase(),6,3);X.restore();}
// case-file card: header «ARCHIVO RARO · CASO 052» + REC dot, picture area drawn by fn(w,h), title + segmented meter (v 0..1)
function monitor(x,y,w,h,a,fn,cap,v,col){if(a<=0) return;X.save();X.setTransform(1,0,0,1,0,0);X.globalAlpha=clamp(a*1.6);X.translate(x,y);const s=.85+.15*eBack(clamp(a));X.scale(s,s);X.rotate(-1.2*D2R);
  const H2=h+150;X.shadowColor='rgba(0,0,0,.65)';X.shadowBlur=40;X.shadowOffsetY=14;X.fillStyle='#16171f';X.fillRect(-w/2-24,-h/2-70,w+48,H2+40);X.shadowColor='transparent';
  X.fillStyle='#1e2029';X.fillRect(-w/2-24,-h/2-70,w+48,56);X.fillStyle='#ff3a4a';X.beginPath();X.arc(-w/2+6,-h/2-42,10,0,7);X.globalAlpha*= (Math.floor(Date.now()/500)%2?1:1);X.fill();
  X.fillStyle='#c9ccd6';X.font='800 26px "JetBrains Mono"';X.textBaseline='middle';X.fillText('ARCHIVO RARO · CASO 052',-w/2+30,-h/2-41);
  X.save();X.beginPath();X.rect(-w/2,-h/2,w,h);X.clip();const bg=X.createLinearGradient(0,-h/2,0,h/2);bg.addColorStop(0,'#0e1a2c');bg.addColorStop(1,'#060a14');X.fillStyle=bg;X.fillRect(-w/2,-h/2,w,h);
  X.save();fn(w,h);X.restore();for(let yy=-h/2;yy<h/2;yy+=4){X.fillStyle='rgba(0,0,0,.08)';X.fillRect(-w/2,yy,w,1);}X.restore();
  brackets(-w/2+14,-h/2+14,w-28,h-28,'rgba(255,255,255,.5)',26,4);
  if(cap){X.fillStyle='#fff';X.font='900 42px Inter';X.textAlign='left';X.textBaseline='alphabetic';X.fillText(cap,-w/2,h/2+62);
    const n=14,gw=(w-(n-1)*8)/n,on=Math.round(clamp(v)*n),c=col||(v>.5?'#ffd34a':v>.25?'#ff9a3a':'#ff3a4a');
    for(let i=0;i<n;i++){X.fillStyle=i<on?c:'rgba(255,255,255,.1)';X.fillRect(-w/2+i*(gw+8),h/2+84,gw,22);}}
  X.restore();}

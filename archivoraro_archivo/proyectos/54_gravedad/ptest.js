const { chromium } = require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
await p.goto('file://'+path.join(__dirname,'index.html'));await p.evaluate(async()=>{await document.fonts.ready});
for(const t of [1,9,12,16,19,23]){const t0=Date.now();await p.evaluate(t=>window.render(t),t);await p.screenshot({path:`preview/t_${t}.png`});console.log(t,Date.now()-t0,'ms');}
await b.close();})();

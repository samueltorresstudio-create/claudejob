const { chromium } = require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.join(__dirname,'index.html'));await p.evaluate(async()=>{await document.fonts.ready});
for(const t of [60,70.5,72.2,72.7,73.5,75,77,80,83,85.5]){const t0=Date.now();await p.evaluate(t=>window.render(t),t);await p.screenshot({path:'/tmp/claude-0/-home-user-claudejob/e8526e9b-1df1-5b1c-ac97-c565bf3b54df/scratchpad/tt.png',timeout:300000});console.log(t,Date.now()-t0,'ms');}
await b.close();})();

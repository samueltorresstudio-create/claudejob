const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});p.on('pageerror',e=>console.log('ERR',e.message));
for(const v of ['A','B','C']){await p.goto('file://'+__dirname+'/page.html?v='+v);await p.evaluate(async()=>{await document.fonts.ready});await p.waitForTimeout(300);await p.screenshot({path:__dirname+'/boceto_'+v+'.png'});}
await b.close();})();

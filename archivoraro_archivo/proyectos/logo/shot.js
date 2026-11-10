const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});
for(const v of process.argv.slice(2)){await p.goto('file://'+__dirname+'/logo.html?v='+v);await p.evaluate(async()=>{await document.fonts.ready});await p.waitForTimeout(200);await p.screenshot({path:__dirname+'/logo_'+v+'.png'});}
await b.close();})();

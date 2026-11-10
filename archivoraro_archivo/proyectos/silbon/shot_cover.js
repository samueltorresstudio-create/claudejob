const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/cover_s1.html');await p.evaluate(async()=>{await document.fonts.ready});await p.waitForTimeout(400);await p.screenshot({path:__dirname+'/portada_silbon1_v2.png'});await b.close();})();

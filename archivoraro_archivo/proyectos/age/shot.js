const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:900}});
p.on('pageerror',e=>console.log('PAGE ERROR',e.message));await p.goto('file://'+__dirname+'/page.html');await p.waitForTimeout(300);
await p.screenshot({path:__dirname+'/edades.png'});await p.evaluate(()=>girls());await p.waitForTimeout(100);await p.screenshot({path:__dirname+'/edades2.png'});await b.close();})();

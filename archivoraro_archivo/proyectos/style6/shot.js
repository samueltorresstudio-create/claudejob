const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('PAGE ERROR',e.message));
await p.goto('file://'+__dirname+'/page.html');await p.waitForTimeout(300);
for(const k of ['room','balcony','shop','street','radioNight']){await p.evaluate(k=>draw(k),k);await p.waitForTimeout(200);await p.screenshot({path:__dirname+'/f_'+k+'.png'});}
await b.close();})();

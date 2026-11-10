const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});
p.on('pageerror',e=>console.log('PAGE ERROR',e.message));
await p.goto('file://'+__dirname+'/page5.html');await p.waitForTimeout(300);
for(const k of ['alex','vec','nina','caj','tani']){await p.evaluate(k=>draw(k),k);await p.waitForTimeout(80);await p.screenshot({path:__dirname+'/v5_'+k+'.png'});}
await b.close();})();

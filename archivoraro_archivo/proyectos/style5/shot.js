const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});
p.on('pageerror',e=>console.log('PAGE ERROR',e.message));
await p.goto('file://'+__dirname+'/page.html');await p.waitForTimeout(300);
for(const k of ['stick','chibi','bean','pixel','hose']){await p.evaluate(k=>draw(k),k);await p.waitForTimeout(150);await p.screenshot({path:__dirname+'/x_'+k+'.png'});}
await b.close();})();

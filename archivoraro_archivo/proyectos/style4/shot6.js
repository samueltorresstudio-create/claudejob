const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});
p.on('pageerror',e=>console.log('PAGE ERROR',e.message));
await p.goto('file://'+__dirname+'/page6.html');await p.waitForTimeout(400);
for(const k of ['riso','flat','paper','ink','neon']){await p.evaluate(k=>draw(k),k);await p.waitForTimeout(150);await p.screenshot({path:__dirname+'/s6_'+k+'.png'});}
await b.close();})();

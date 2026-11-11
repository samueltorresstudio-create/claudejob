const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.error('PAGE ERROR',e.message));
for(const c of ['gallina','perro','leon']){await p.goto('file://'+__dirname+'/asheet.html?c='+c);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:__dirname+'/'+c+'.png'});}
await b.close()})();

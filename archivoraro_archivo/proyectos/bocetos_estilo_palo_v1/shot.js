const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.error('PAGE ERROR',e.message));
for(const c of (process.argv.slice(2).length?process.argv.slice(2):['millonario','cocinero','guerrero'])){await p.goto('file://'+__dirname+'/sheet.html?c='+c);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:__dirname+'/'+c+'.png'});}
await b.close()})();

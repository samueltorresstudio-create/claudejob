const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('console',m=>{if(m.type()==='error')console.log(m.text())});p.on('pageerror',e=>console.log('PAGE ERROR',e.message));
for(const s of process.argv.slice(2)){await p.goto('file://'+__dirname+'/page.html?s='+s);await p.waitForFunction(()=>window.DONE,null,{timeout:120000});await p.screenshot({path:__dirname+'/'+s+'.png'});console.log('ok',s);}
await b.close()})();

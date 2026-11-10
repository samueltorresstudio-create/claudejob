const {chromium}=require('playwright');
const [,,mode,lib,out,dur,h]=process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:+h}});
p.on('pageerror',e=>console.log('PAGE ERROR',e.message));
await p.goto('file://'+__dirname+'/page.html?lib='+lib);await p.waitForTimeout(300);
require('fs').mkdirSync(out,{recursive:true});
for(let i=0;i<dur*30;i++){await p.evaluate(([m,t])=>window[m](t),[mode,i/30]);await p.screenshot({path:`${out}/f${String(i).padStart(4,'0')}.png`,clip:{x:0,y:0,width:1080,height:+h}});}
await b.close();})();

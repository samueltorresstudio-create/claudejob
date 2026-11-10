const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()));
await p.goto('file://'+__dirname+'/'+(process.argv[2]||'test.html'));await p.waitForFunction(()=>document.title==='done',{timeout:20000}).catch(()=>console.log('timeout'));
await p.screenshot({path:__dirname+'/'+(process.argv[3]||'test.png')});await b.close();})();

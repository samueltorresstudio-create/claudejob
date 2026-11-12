let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('PAGE ERROR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('ERR',m.text())});
await p.goto('file://'+__dirname+'/sheet.html');await p.evaluate(async()=>{await document.fonts.load('900 100px Inter');await document.fonts.ready;});
const L=(process.argv[2]||'1,2,3,4,5,6').split(',');for(const i of L){await p.evaluate(i=>window.shot(i),i);await p.screenshot({path:__dirname+`/k${i}.png`,timeout:300000});console.log('ok',i);}await b.close()})();

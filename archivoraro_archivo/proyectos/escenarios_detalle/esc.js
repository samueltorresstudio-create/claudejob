let chromium; try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('PAGE ERROR',e.message));
await p.goto('file://'+__dirname+'/esc.html');await p.evaluate(async()=>{await document.fonts.load('900 100px Inter');await document.fonts.ready;});
const L=JSON.parse(process.argv[2]||'[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]');for(const [i,n] of L){await p.evaluate(([i,n])=>window.shot(i,n),[i,n]);await p.screenshot({path:__dirname+`/e${i}${n?'n':''}.png`,timeout:300000});console.log('ok',i);}await b.close()})();

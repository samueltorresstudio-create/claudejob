// genera los personajes 2D como PNG transparentes para meterlos en el 3D
const {chromium}=require('playwright');
const L=[['cocinero','figure(cocinero({}),0,0,1)',[-280,-940,640,960]],['millonario','figure(millonario({}),0,0,1)',[-250,-730,560,750]],['guerrero','figure(guerrero({}),0,0,1)',[-260,-870,560,890]],
 ['perro','perro({})',[-200,-560,460,580]],['gallina','gallina({})',[-240,-560,480,580]],['leon','leon({})',[-230,-600,500,620]],
 ['perro_izq','perro({})',[-200,-560,460,580],1]];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1024,height:1536}});
await p.goto('file://'+__dirname+'/page.html?s=none');await p.waitForTimeout(800);
for(const [n,expr,vb,flip] of L){const ph=Math.round(1024*vb[3]/vb[2]);await p.setViewportSize({width:1024,height:ph});
 await p.evaluate(([expr,vb,ph,flip])=>{document.body.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="1024" height="${ph}" style="display:block${flip?';transform:scaleX(-1)':''}">${eval(expr)}</svg>`;document.body.style.background='transparent';document.documentElement.style.background='transparent';},[expr,vb,ph,flip]);
 await p.screenshot({path:__dirname+'/sp_'+n+'.png',omitBackground:true});console.log(n,ph);}
await b.close()})();

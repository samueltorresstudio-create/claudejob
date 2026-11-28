window.READY = W2.READY_W;
window.shot = (name, o) => { const W = W2; W.setTime(o.t || 3); W.setMood(o.mood || 'dia'); W.setWater(Object.assign({ vs: 0, spin: 0, level: 0, drain: 0, fall: 0 }, o.water || {}));
  if (o.dbg != null) W.LU.uDbg.value = o.dbg; W.gtao.enabled = !o.noao; (o.hide || []).forEach(n => { if (n === "lake") W.lake.visible = false; else if (W.G[n]) W.G[n].visible = false; }); W.setCam(V3(...o.p), V3(...o.l), o.f || 40); W.render(); document.getElementById('fx').innerHTML = ''; };

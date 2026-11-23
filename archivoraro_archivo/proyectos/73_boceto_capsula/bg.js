const W = W2; window.shot = function (n) { W.setTime(2); W.inkM.visible = false; document.getElementById('gl').style.filter = 'blur(18px) saturate(.7) sepia(.45) brightness(1.02)';
  W.setCam(V3(-1.12, 1.4, .1), V3(-1.2, 1.3, -1.9), 40, null, .003); W.render(); }; document.title = 'ready';

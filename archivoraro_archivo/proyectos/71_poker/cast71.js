// Reparto del 71 (diseños propios del canal).
const _P = { rich: true, eyeStyle: 'palo', legLen: 1.18 };
window.CAST71 = {
  // Manolo: el que pierde. Unos 60, pelo gris con raya, bigote gris, rebeca mostaza sobre camisa: el señor tranquilo del barrio
  MANOLO: Object.assign({}, _P, { outfit: 'cardigan', top: '#d8a23a', topD: '#a8781e', shirt: '#f4f1ea', hair2: 'bald', hairCol: '#b8b4ac', glasses: true, mustache: '#b8b4ac', browCol: '#e8e4dc', wrinkles: true, belly: 1.05, face: 'smug', mouth: 'smirk', shoes: '#5a3a22', sole: '#2a1a12' }),
  // Pepe: grandote, barba, camisa de cuadros roja
  PEPE: Object.assign({}, _P, { outfit: 'flannel', top: '#c8463a', topD: '#a03028', hair2: 'buzz', hairCol: '#3a2a22', beard: '#3a2a22', belly: 1.32, face: 'smug', mouth: 'line', shoes: '#2a2a30', sole: '#1b1b1b' }),
  // Luis: flaco, gafas, traje gris con corbata azul, tupé
  LUIS: Object.assign({}, _P, { outfit: 'suit', top: '#7a7e88', topD: '#5a5e68', shirt: '#eef2f6', tie: '#2f6fbf', hair2: 'tupe', hairCol: '#2a1a12', glasses: true, belly: .9, legLen: 1.26, face: 'smug', mouth: 'line', shoes: '#1b1720', sole: '#1b1720' }),
  // Toni: gorra plana, chaleco de punto verde, calvo por arriba
  TONI: Object.assign({}, _P, { outfit: 'cardigan', top: '#3f8a5a', topD: '#2a6a40', shirt: '#f4f1ea', hat: 'flatcap', hatCol: '#6b6458', hairCol: '#5a4a3a', mustache: '#5a4a3a', belly: 1.1, face: 'smug', mouth: 'line', shoes: '#2a2a30', sole: '#1b1b1b' }),
  // El camarero: joven, pelo negro peinado, chaleco y pajarita
  CAMARERO: Object.assign({}, _P, { outfit: 'waiter', top: '#1f1d24', topD: '#121016', shirt: '#f6f4ee', apron: '#f6f4ee', hair2: 'messy', hairCol: '#1b1720', legLen: 1.22, face: 'smug', mouth: 'smirk', shoes: '#1b1720', sole: '#1b1720' }),
  // El cuñado: chándal rojo, cadena de oro, pelo engominado
  CUNADO: Object.assign({}, _P, { outfit: 'zipjacket', top: '#c8302e', topD: '#a01a1a', pants: '#c8302e', hair2: 'tupe', hairCol: '#1b1720', chain: true, belly: 1.15, face: 'happy', mouth: 'laugh', shoes: '#f4f2ec', sole: '#c8302e' }),
};

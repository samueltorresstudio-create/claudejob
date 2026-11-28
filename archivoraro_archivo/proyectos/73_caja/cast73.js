// Reparto del 73 «El hombre que se mandó por correo» (Reg Spiers, Londres → Perth, 1964). Diseños propios del canal.
const _P = { rich: true, eyeStyle: 'palo', legLen: 1.18 };
window.CAST73 = {
  // Reg: lanzador de jabalina australiano, 23 años. Jersey de punto mostaza abierto (cárdigan) sobre camisa crema, pelo rubio arena con tupé, pantalón marrón
  REG: Object.assign({}, _P, { outfit: 'cardigan', top: '#c08a2e', topD: '#946418', shirt: '#efe8d6', btn: '#5a3a1e', hair2: 'tupe', hairCol: '#c49656', pants: '#5a4030', shoes: '#4a2e1c', sole: '#1b1720', belly: 1.0, legLen: 1.22, face: 'open', mouth: 'smile' }),
  // John, el amigo que fabrica la caja: camisa de cuadros azul, gorra plana y gafas
  JOHN: Object.assign({}, _P, { outfit: 'flannel', top: '#3a6a9a', topD: '#24476a', line: '#e8d8a8', tee: '#f4f2ec', glasses: true, hat: 'flatcap', hatCol: '#5a4a3a', pants: '#3a3a42', shoes: '#2a1a12', sole: '#1b1720', mustache: '#6a4a2a', belly: 1.1, face: 'open', mouth: 'line' }),
  // La hija de Reg (unos 5 años): vestido naranja de lunares blancos, coletas con lazos rojos, calcetines blancos y merceditas rojas
  HIJA: Object.assign({}, _P, { outfit: 'dress', top: '#f0883a', topD: '#c8661e', dots: '#ffffff', sash: '#ffffff', hair2: 'pigtails', hairCol: '#c89a5a', socks: '#ffffff', shoes: '#d03a34', sole: '#1b1720', legLen: .9, belly: .9, face: 'happy', mouth: 'smile' }),
  // Trabajadores del aeropuerto de Perth: camisa caqui, pantalón corto y calcetines altos (el uniforme australiano de los 60)
  AUSSIE1: Object.assign({}, _P, { outfit: 'shirt', top: '#c9b588', topD: '#a08c62', shorts: '#7a6a4a', shortsD: '#5a4c32', socks: '#efe6d2', hat: 'peaked', hatCol: '#4a5a3a', mustache: '#6a4a2a', shoes: '#3a2a1e', sole: '#1b1720', belly: 1.22, legLen: 1.08, face: 'angry', mouth: 'open' }),
  AUSSIE2: Object.assign({}, _P, { outfit: 'shirt', top: '#d8c9a2', topD: '#b0a07a', shorts: '#5a5a4a', shortsD: '#3e3e32', socks: '#efe6d2', hair2: 'buzz', hairCol: '#c84a2a', shoes: '#3a2a1e', sole: '#1b1720', belly: .96, legLen: 1.26, face: 'angry', mouth: 'open' }),
  // Mozo de carga de Londres (Heathrow, 1964): cazadora azul marino y gorra plana
  LONDON: Object.assign({}, _P, { outfit: 'zipjacket', top: '#2a3a5a', topD: '#1c2840', tee: '#d8d4cc', hat: 'flatcap', hatCol: '#3a3a40', pants: '#2a2a30', shoes: '#1b1720', sole: '#1b1720', belly: 1.12, face: 'open', mouth: 'line' }),
  // Personal de pista en la escala (Bombay): camisa blanca de manga corta, gorra de plato azul
  PISTA: Object.assign({}, _P, { outfit: 'shirt', top: '#f2f0e8', topD: '#cfccc2', hat: 'peaked', hatCol: '#2a3a6a', pants: '#4a4a52', mustache: '#1b1720', shoes: '#1b1720', sole: '#1b1720', belly: 1.04, face: 'open', mouth: 'line' }),
  // Vigilante nocturno del almacén de Perth
  VIGILANTE: Object.assign({}, _P, { outfit: 'guard', top: '#3a4a6a', topD: '#26324a', hat: 'peaked', hatCol: '#26324a', pants: '#26324a', mustache: '#8a8a8a', belly: 1.3, legLen: 1.1, face: 'closed', mouth: 'line' }),
  // Cartero que trae la factura
  CARTERO: Object.assign({}, _P, { outfit: 'shirt', top: '#9ab4cf', topD: '#7690ab', hat: 'peaked', hatCol: '#2a3a5a', pants: '#2a3a5a', bag: '#7a4a22', shoes: '#1b1720', sole: '#1b1720', belly: 1.0, face: 'open', mouth: 'smile' }),
  // Pasajeros elegantes de la cabina (arriba), mientras Reg va en la bodega (abajo)
  PAX1: Object.assign({}, _P, { outfit: 'suit', top: '#3a3a46', topD: '#26262e', tie: '#a82a3a', hat: 'bowler', hatCol: '#1f1d24', mustache: '#3a2a22', belly: 1.25, face: 'closed', mouth: 'smile' }),
  PAX2: Object.assign({}, _P, { outfit: 'dress', top: '#2f8a8a', topD: '#1f6666', sash: '#f4f2ec', hair2: 'side', hairCol: '#2a1a12', earrings: true, legLen: 1.1, belly: .95, face: 'closed', mouth: 'smile' }),
};

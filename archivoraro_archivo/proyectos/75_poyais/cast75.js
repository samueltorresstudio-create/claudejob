// Reparto del 75 «El país que no existía» (Poyais, 1821-23). Diseños propios del canal: sombreros que se leen en silueta.
const _P = { rich: true, eyeStyle: 'palo', legLen: 1.18 };
window.CAST75 = {
  // Gregor MacGregor: general con bicornio y pluma blanca, casaca roja, faja de tartán y bigotazo
  MACG: Object.assign({}, _P, { outfit: 'general', top: '#d4322c', topD: '#a3221e', hat: 'bicorne', hatCol: '#1f1c26', pants: '#f4f2ec', shoes: '#1f1c26', sole: '#1b1720', mustache: '#7a4a22', belly: 1.12, legLen: 1.22, face: 'smug', mouth: 'smirk', brows: .2 }),
  // Banquero rechoncho: chistera negra con cinta roja, frac verde y corbatín
  BANK: Object.assign({}, _P, { outfit: 'suit', tails: true, top: '#2f6b4a', topD: '#1f4a33', shirt: '#f4f2ec', tie: '#f4f2ec', hat: 'tophat', hatCol: '#25222a', hatBand: '#c8342c', pants: '#3a3a42', shoes: '#1b1720', sole: '#1b1720', mustache: '#6a4a2a', belly: 1.3, legLen: 1.1, face: 'open', mouth: 'smile' }),
  // Caballero delgado: chistera gris, frac morado, gafas redondas, bigote blanco
  GENT: Object.assign({}, _P, { outfit: 'suit', tails: true, top: '#7b4a8c', topD: '#563468', shirt: '#f4f2ec', tie: '#e7c24a', hat: 'tophat', hatCol: '#5a5666', hatBand: '#2c3f86', glasses: true, pants: '#2e2a38', shoes: '#1b1720', sole: '#1b1720', mustache: '#e8e4dc', belly: .92, legLen: 1.3, face: 'open', mouth: 'line' }),
  // Oficinista: bombín, traje marrón, gafas
  CLERK: Object.assign({}, _P, { outfit: 'suit', top: '#8a6a3a', topD: '#6a4e28', tie: '#2c3f86', hat: 'bowler', hatCol: '#3a3446', glasses: true, pants: '#3a3a42', shoes: '#1b1720', sole: '#1b1720', belly: 1.0, legLen: 1.2, face: 'open', mouth: 'line' }),
  // Damas de Londres: capota con lazo y flor, vestido de vuelo
  DAMA1: Object.assign({}, _P, { outfit: 'dress', top: '#f28fa8', topD: '#d8688a', sash: '#fbf0d2', dots: '#fbf0d2', hat: 'bonnet', hatCol: '#8ec5ff', ribbon: '#c8342c', shoes: '#3a2a1e', sole: '#1b1720', belly: 1.0, legLen: 1.1, face: 'open', mouth: 'smile' }),
  DAMA2: Object.assign({}, _P, { outfit: 'dress', top: '#43bd65', topD: '#2f9a52', sash: '#fbf0d2', hat: 'bonnet', hatCol: '#ffd96a', ribbon: '#4f8fe8', flower: '#ff6f91', shoes: '#3a2a1e', sole: '#1b1720', belly: 1.12, legLen: 1.05, face: 'open', mouth: 'o' }),
  // Colonos: gorra plana y chaqueta de punto; ella, capota gris; el niño, gorra grande
  COL1: Object.assign({}, _P, { outfit: 'cardigan', top: '#8a6a3a', topD: '#6a4e28', shirt: '#f4f2ec', hat: 'flatcap', hatCol: '#4a4a52', pants: '#3a3a42', shoes: '#2a1a12', sole: '#1b1720', mustache: '#5a3a22', belly: 1.1, legLen: 1.18, face: 'open', mouth: 'smile' }),
  COL2: Object.assign({}, _P, { outfit: 'dress', top: '#8a8fa8', topD: '#686d86', sash: '#f4f2ec', hat: 'bonnet', hatCol: '#f4f2ec', ribbon: '#4f8fe8', flower: '#ffd34a', shoes: '#2a1a12', sole: '#1b1720', belly: 1.0, legLen: 1.1, face: 'open', mouth: 'smile' }),
  COL3: Object.assign({}, _P, { outfit: 'shirt', top: '#4f8fe8', topD: '#3568b8', hat: 'flatcap', hatCol: '#a8733f', pants: '#5a4a3a', shoes: '#2a1a12', sole: '#1b1720', belly: .95, legLen: 1.05, face: 'open', mouth: 'smile' }),
  // Marinero del barco: marinera de rayas y gorro blanco con pompón
  MARIN: Object.assign({}, _P, { outfit: 'marin', top: '#f4f2ec', topD: '#cfd3dc', hat: 'bachi', pants: '#2c3f86', shoes: '#1b1720', sole: '#1b1720', mustache: '#7a4a22', belly: 1.05, legLen: 1.15, face: 'open', mouth: 'smile' }),
  // París: camarero con boina y bigote fino
  GARCON: Object.assign({}, _P, { outfit: 'waiter', top: '#f4f2ec', topD: '#d8d4cc', hat: 'beret', hatCol: '#1f1c26', pants: '#1f1c26', shoes: '#1b1720', sole: '#1b1720', mustache: '#2a1a12', belly: 1.0, legLen: 1.25, face: 'open', mouth: 'smile' }),
};

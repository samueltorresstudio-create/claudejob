// Reparto del 74 «El lago que desapareció» (Lake Peigneur, 1980). Diseños propios del canal.
const _P = { rich: true, eyeStyle: 'palo', legLen: 1.18 };
window.CAST74 = {
  // Perforador de la plataforma: mono naranja, casco blanco, bigote
  PERF: Object.assign({}, _P, { outfit: 'zipjacket', top: '#e8742a', topD: '#b8521a', tee: '#f2efe6', hat: 'hardhat', hatCol: '#f4f2ec', pants: '#c8622a', shoes: '#3a2a1e', sole: '#1b1720', mustache: '#5a3a22', belly: 1.18, face: 'open', mouth: 'line' }),
  // Ayudante: camisa vaquera, casco amarillo, gafas
  AYUD: Object.assign({}, _P, { outfit: 'shirt', top: '#5a7aa8', topD: '#3e5a84', hat: 'hardhat', hatCol: '#f2c230', glasses: true, pants: '#3a3a42', shoes: '#2a1a12', sole: '#1b1720', belly: 1.0, legLen: 1.24, face: 'open', mouth: 'line' }),
  // Mineros de la sal: chaqueta gris azulada con bandas reflectantes, casco con lámpara
  MIN1: Object.assign({}, _P, { outfit: 'zipjacket', top: '#4a5a6a', topD: '#33404c', tee: '#e8e2d2', hat: 'hardhat', hatCol: '#f4f2ec', lamp: true, pants: '#2e343c', shoes: '#1b1720', sole: '#1b1720', mustache: '#3a2a22', belly: 1.1, face: 'open', mouth: 'line' }),
  MIN2: Object.assign({}, _P, { outfit: 'zipjacket', top: '#6a5a3a', topD: '#4a3e26', tee: '#e8e2d2', hat: 'hardhat', hatCol: '#f2c230', lamp: true, pants: '#3a3428', shoes: '#1b1720', sole: '#1b1720', belly: .98, legLen: 1.26, face: 'open', mouth: 'line' }),
  MIN3: Object.assign({}, _P, { outfit: 'zipjacket', top: '#3a5a4a', topD: '#284034', tee: '#e8e2d2', hat: 'hardhat', hatCol: '#e86a2a', lamp: true, pants: '#2a3430', shoes: '#1b1720', sole: '#1b1720', hair2: 'buzz', hairCol: '#2a1a12', belly: 1.22, legLen: 1.1, face: 'open', mouth: 'line' }),
  // Pescador de camarones del canal de Delcambre
  PESC: Object.assign({}, _P, { outfit: 'flannel', top: '#a83a2a', topD: '#7a2618', line: '#2a2a2a', tee: '#f4f2ec', hat: 'flatcap', hatCol: '#3a4a3a', pants: '#3a4a5a', shoes: '#f4f2ec', sole: '#1b1720', mustache: '#8a8a8a', belly: 1.25, face: 'open', mouth: 'o' }),
};

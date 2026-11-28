// Reparto del 72 (diseños propios del canal): corte de Francia, 1340.
const _P = { rich: true, eyeStyle: 'palo', legLen: 1.18 };
window.CAST72 = {
  // El bufón: traje a cuartos verde y amarillo, rombos rojos, cuello y bajo de picos con cascabeles, mallas roja y verde, zapatos de punta, gorro de tres puntas
  BUFON: Object.assign({}, _P, { outfit: 'jester', jv2: true, top: '#c8302e', topD: '#9a2220', top2: '#e8b830', top3: '#2f8a4a', hat: 'jester2', hatCol: '#c8302e', hatCol2: '#e8b830',
    hose: ['#e8b830', '#c8302e'], poulaine: '#c8302e', belly: 1.04, legLen: 1.02, face: 'smug', mouth: 'smirk' }),
  // El rey (Felipe VI de Francia): manto azul con flores de lis y borde de armiño, jubón dorado, corona de lises, barba oscura rizada
  REY: Object.assign({}, _P, { outfit: 'king', top: '#2a4aa8', topD: '#18306e', vest: '#e7c24a', sash: 'none', lis: true, cape: '#22408f', hat: 'crownLis', velvet: '#2a4aa8', noMedal: true,
    hair2: 'curly', hairCol: '#2a1a12', beard: '#2a1a12', mustache: '#2a1a12', belly: 1.18, legLen: 1.2, shoes: '#2a1a12', sole: '#1b1720', face: 'smug', mouth: 'line' }),
  // Nobles: túnicas largas de colores con cuello de piel, chaperón o boina
  NOBLE1: Object.assign({}, _P, { outfit: 'tunic', top: '#7a2a3a', topD: '#561a28', fur: '#8a6a4a', hat: 'chaperon', hatCol: '#2a3a6a', hose: '#3a2a22', shoes: '#2a1a12', sole: '#1b1720', mustache: '#5a3a22', belly: 1.12, face: 'smug', mouth: 'line' }),
  NOBLE2: Object.assign({}, _P, { outfit: 'tunic', top: '#2f6a4a', topD: '#1f4a32', fur: '#c8b89a', hat: 'chaperon', hatCol: '#7a1f2a', hose: '#4a3a2a', shoes: '#2a1a12', sole: '#1b1720', beard: '#7a5a3a', belly: 1.0, legLen: 1.24, face: 'smug', mouth: 'line' }),
  NOBLE3: Object.assign({}, _P, { outfit: 'tunic', top: '#5a3a7a', topD: '#3a2456', fur: '#6a4a2a', hat: 'beret', hatCol: '#1f1d24', hair2: 'side', hairCol: '#c8c2b8', browCol: '#e8e4dc', wrinkles: true, hose: '#2a2430', shoes: '#2a1a12', sole: '#1b1720', belly: 1.25, face: 'smug', mouth: 'line' }),
  NOBLE4: Object.assign({}, _P, { outfit: 'tunic', top: '#a8763a', topD: '#7a5222', fur: '#4a3220', hat: 'chaperon', hatCol: '#2f5a3a', hose: '#3a3028', shoes: '#2a1a12', sole: '#1b1720', mustache: '#2a1a12', belly: .95, face: 'smug', mouth: 'line' }),
  // Guardia: cota de malla, sobreveste azul con lises, capacete de hierro y alabarda
  GUARDIA: Object.assign({}, _P, { outfit: 'tabard', top: '#2a4aa8', topD: '#18306e', hat: 'kettle', hose: '#5a5f68', shoes: '#2a2a30', sole: '#1b1b1b', mustache: '#3a2a22', prop: 'halberd', belly: 1.08, face: 'smug', mouth: 'line' }),
  // Mensajero: túnica corta ocre, boina verde, carta sellada
  MENSAJERO: Object.assign({}, _P, { outfit: 'tunic', top: '#b8863a', topD: '#8a5e22', fur: '#6a4a2a', hat: 'beret', hatCol: '#2f6a3a', hose: '#4a3a2a', shoes: '#3a2a1e', sole: '#1b1720', belly: .9, legLen: 1.1, face: 'wide', mouth: 'o' }),
};

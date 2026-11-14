// Reparto del 70 (diseños propios del canal; nada copiado de la referencia).
const _P = { rich: true, eyeStyle: 'palo', legLen: 1.18 };
window.CAST70 = {
  PRESO: Object.assign({}, _P, { outfit: 'prisoner', top: '#f2ede0', topD: '#c9c1ae', stripe: '#2a2a34', number: '707', hair2: 'buzz', hairCol: '#3a2a22', shoes: '#f2f0ea', sole: '#2a2a34', face: 'smug', mouth: 'smirk' }),
  JUEZ: Object.assign({}, _P, { outfit: 'robe', top: '#2a2830', topD: '#121016', hair2: 'bald', glasses: true, mustache: '#f4f2ec', browCol: '#f4f2ec', wrinkles: true, cuffs: '#f6f4ee', belly: 1.12, legLen: 1.05, face: 'smug', mouth: 'line', shoes: '#1b1720', sole: '#1b1720' }),
  PACO: Object.assign({}, _P, { outfit: 'guard', top: '#6f7d55', topD: '#4c5a38', hat: 'peaked', capTop: '#3e4a32', mustache: '#2a1a12', hair2: 'side', hairCol: '#2a1a12', belly: 1.28, legLen: 1.06, keys: true, baton: true, shoes: '#1b1720', sole: '#1b1720', face: 'smug', mouth: 'line' }),
  LOLA: Object.assign({}, _P, { outfit: 'guard', top: '#6f7d55', topD: '#4c5a38', hat: 'peaked', capTop: '#3e4a32', hair2: 'side', hairCol: '#5a2a1a', bun: '#5a2a1a', earrings: '#e7c24a', belly: .92, legLen: 1.24, baton: true, shoes: '#1b1720', sole: '#1b1720', face: 'smug', mouth: 'line' }),
  DIRECTOR: Object.assign({}, _P, { outfit: 'suit', top: '#2a2d36', topD: '#1a1c24', shirt: '#f4f2ec', tie: '#c8243a', square: '#c8243a', hair2: 'side', hairCol: '#1b1720', mustache: '#1b1720', belly: 1.16, face: 'smug', mouth: 'line', shoes: '#1b1720', sole: '#1b1720' }),
  INSPECTOR: Object.assign({}, _P, { outfit: 'suit', top: '#b89a6a', topD: '#8a7048', shirt: '#e8eef4', tie: '#3a4a6a', beltCoat: true, hat: 'bowler', hatCol: '#4a3426', hairCol: '#6a4a2a', glasses: true, belly: .96, face: 'smug', mouth: 'line', shoes: '#4a3426', sole: '#2a1a12' }),
  POLI1: Object.assign({}, _P, { outfit: 'guard', top: '#2c3c5e', topD: '#1c2840', btn: '#d8dde4', hat: 'peaked', capTop: '#1f2a44', hair2: 'buzz', hairCol: '#1b1720', star: true, shoes: '#1b1720', sole: '#1b1720', face: 'smug', mouth: 'line' }),
  POLI2: Object.assign({}, _P, { outfit: 'guard', top: '#2c3c5e', topD: '#1c2840', btn: '#d8dde4', hat: 'peaked', capTop: '#1f2a44', hair2: 'side', hairCol: '#3a2418', bun: '#3a2418', star: true, belly: .94, legLen: 1.2, shoes: '#1b1720', sole: '#1b1720', face: 'smug', mouth: 'line' }),
  RISA: Object.assign({}, _P, { outfit: 'cardigan', top: '#3f9a6a', topD: '#2a7048', shirt: '#f4f1ea', hair2: 'side', hairCol: '#2a1a12', bun: '#2a1a12', earrings: '#e7c24a', legLen: 1.1, face: 'happy', mouth: 'smile' }),
  ABOGADO: Object.assign({}, _P, { outfit: 'suit', top: '#5a5a62', topD: '#404048', shirt: '#f4f2ec', tie: '#2f6fbf', hair2: 'tupe', hairCol: '#2a1a12', glasses: true, face: 'smug', mouth: 'line' }),
  CAJERA: Object.assign({}, _P, { outfit: 'suit', top: '#3a5a7a', topD: '#28405a', shirt: '#f4f2ec', tie: '#e8b830', hair2: 'curly', hairCol: '#c87a3a', face: 'happy', mouth: 'smile' }),
};
// público del juzgado y clientes del banco (variantes)
window.CROWD70 = [
  { outfit: 'tee', top: '#e86a4a', topD: '#c04a2a', hair2: 'messy', hairCol: '#2a1a12' }, { outfit: 'hood', top: '#4a7ab8', topD: '#2a5a98', hair2: 'curly', hairCol: '#1b1720' },
  { outfit: 'cardigan', top: '#a87ab8', topD: '#8a5a9a', shirt: '#f4f1ea', hair2: 'bald', glasses: true, mustache: '#d8d4c8', browCol: '#f4f2ec', wrinkles: true },
  { outfit: 'zipjacket', top: '#e8b84a', topD: '#c0902a', hair2: 'tupe', hairCol: '#5a3a1a' }, { outfit: 'flannel', top: '#c8463a', topD: '#a03028', hair2: 'buzz', hairCol: '#3a2a22', beard: '#3a2a22' },
  { outfit: 'suit', top: '#3a4a3a', topD: '#28382a', shirt: '#f4f2ec', tie: '#c8243a', hat: 'bowler', hatCol: '#25222a', hairCol: '#2a1a12' },
  { outfit: 'tee', top: '#5ab88a', topD: '#3a9868', hair2: 'side', hairCol: '#c87a3a', bun: '#c87a3a' }, { outfit: 'hood', top: '#8a8a92', topD: '#6a6a72', hair2: 'capHair', hairCol: '#1b1720', cap: '#c8302e' },
].map(o => Object.assign({ rich: true, eyeStyle: 'palo', legLen: 1.12, face: 'smug', mouth: 'line' }, o));

// Efectos 2D del 69: fantasma propio del canal, iconos «pop» (!, ?, ✔), estallido de impacto y bocadillo de pensamiento.
const K = '#1b1720';
// Fantasma (diseño propio): cabeza redonda blanca como el resto del reparto, flequillo y melena negra lisa, cinta triangular blanca en la frente,
// kimono blanco de mangas anchas con las manos colgando, cuerpo que se deshace en una cola de humo; brillo azulado. p = proyección del centro de la cabeza.
function ghost2d(p, ppm, o = {}) { const t = o.t || 0, s = ppm * .0046, sway = Math.sin(t * 2.2) * 6, op = o.op ?? .92, look = o.look || [0, 0];
  const eyes = o.face === 'scared' ? `<circle cx="${-34 + look[0]}" cy="${4 + look[1]}" r="17" fill="#fff" stroke="${K}" stroke-width="6"/><circle cx="${34 + look[0]}" cy="${4 + look[1]}" r="17" fill="#fff" stroke="${K}" stroke-width="6"/><circle cx="${-34 + look[0] * 1.4}" cy="${6 + look[1]}" r="5" fill="${K}"/><circle cx="${34 + look[0] * 1.4}" cy="${6 + look[1]}" r="5" fill="${K}"/><ellipse cx="0" cy="52" rx="14" ry="18" fill="${K}"/>`
    : `<path d="M-52,6 Q-34,-6 -16,6" stroke="${K}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M16,6 Q34,-6 52,6" stroke="${K}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-42,10 Q-34,22 -26,10 Z" fill="${K}"/><path d="M26,10 Q34,22 42,10 Z" fill="${K}"/><path d="M-14,50 Q0,42 14,50" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  const tail = `M-88,140 C-110,260 -70,330 -20,380 C10,410 ${40 + sway},440 ${10 + sway * 2},${500} C${60 + sway},450 ${70 + sway},400 50,360 C110,300 110,220 88,140 Z`;
  return `<g transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)}) scale(${s.toFixed(4)}) rotate(${(Math.sin(t * 1.3) * 3).toFixed(2)})" opacity="${op}">
    <ellipse cx="0" cy="160" rx="210" ry="300" fill="#9fd0ff" opacity=".22" style="filter:blur(30px)"/>
    <path d="${tail}" fill="#f4f8fb" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M-30,190 C-40,280 -20,340 0,380" stroke="#c8dcea" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M-88,150 L0,230 L88,150" stroke="${K}" stroke-width="8" fill="none" stroke-linejoin="round"/><path d="M-6,226 L-6,300" stroke="#d9e6f0" stroke-width="8"/>
    <path d="M-96,150 C-150,170 -190,230 -170,300 L-110,300 C-110,250 -96,210 -80,190 Z" fill="#f4f8fb" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M96,150 C150,170 190,230 170,300 L110,300 C110,250 96,210 80,190 Z" fill="#f4f8fb" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    <ellipse cx="-142" cy="312" rx="20" ry="14" fill="${K}"/><ellipse cx="142" cy="312" rx="20" ry="14" fill="${K}"/>
    <path d="M-98,-30 C-120,60 -116,150 -100,210 L-60,170 C-70,110 -72,40 -60,0 Z" fill="#141018"/><path d="M98,-30 C120,60 116,150 100,210 L60,170 C70,110 72,40 60,0 Z" fill="#141018"/>
    <circle cx="0" cy="0" r="100" fill="#f7fbff" stroke="${K}" stroke-width="10"/>
    <path d="M-100,-6 C-96,-80 -40,-108 0,-108 C40,-108 96,-80 100,-6 C80,-40 60,-46 40,-30 C20,-50 -20,-50 -40,-30 C-60,-46 -80,-40 -100,-6 Z" fill="#141018" stroke="${K}" stroke-width="6"/>
    <path d="M-26,-74 L0,-108 L26,-74 Z" fill="#fff" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    ${eyes}<ellipse cx="-56" cy="34" rx="16" ry="9" fill="#cfe2ff" opacity=".7"/><ellipse cx="56" cy="34" rx="16" ry="9" fill="#cfe2ff" opacity=".7"/>
  </g>`; }
// fuego fatuo (hitodama) azul
function wisp(x, y, r, t, ph = 0) { const f = Math.sin(t * 6 + ph) * .15; return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><circle r="${(r * 2.2).toFixed(1)}" fill="#7fc8ff" opacity=".25" style="filter:blur(${(r * .6).toFixed(1)}px)"/><path d="M0,${-r * (2.4 + f)} C${r * .9},${-r * 1.2} ${r},${r * .2} 0,${r} C${-r},${r * .2} ${-r * .9},${-r * 1.2} 0,${-r * (2.4 + f)} Z" fill="#bfe6ff" stroke="#5aa8ff" stroke-width="${(r * .18).toFixed(1)}"/><circle r="${(r * .45).toFixed(1)}" cy="${(r * .2).toFixed(1)}" fill="#fff"/></g>`; }
// icono «pop» sobre la cabeza: '!', '?', 'ok'. k = 0..1 (aparece con rebote), x,y en pantalla, s = tamaño en px
function popIcon(kind, x, y, s, k) { if (k <= 0) return ''; const e = k < 1 ? eBack(Math.min(1, k)) : 1, sc = (s / 100) * e;
  let body = '';
  if (kind === '!') body = `<path d="M-16,-70 L16,-70 L10,18 L-10,18 Z" fill="#ff3b4a" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><circle cx="0" cy="50" r="15" fill="#ff3b4a" stroke="${K}" stroke-width="9"/>`;
  else if (kind === '?') body = `<path d="M-34,-36 C-34,-80 34,-84 34,-40 C34,-12 4,-6 4,22" stroke="${K}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M-34,-36 C-34,-80 34,-84 34,-40 C34,-12 4,-6 4,22" stroke="#ffd34a" stroke-width="18" fill="none" stroke-linecap="round"/><circle cx="4" cy="58" r="15" fill="#ffd34a" stroke="${K}" stroke-width="9"/>`;
  else if (kind === 'ok') body = `<circle r="62" fill="#3fbf6a" stroke="${K}" stroke-width="10"/><path d="M-30,0 L-8,24 L32,-22" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${((1 - Math.min(1, k)) * -20).toFixed(1)}) scale(${sc.toFixed(3)})">${body}</g>`; }
// estallido de impacto: círculo blanco que se abre + rayos de tinta
function impact(x, y, r, k) { if (k <= 0 || k >= 1) return ''; const e = eOut(k); let s = `<circle cx="${x}" cy="${y}" r="${(r * .55 * e).toFixed(1)}" fill="#fff" opacity="${(1 - k).toFixed(2)}" stroke="${K}" stroke-width="${(8 * (1 - k)).toFixed(1)}"/>`;
  for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283 + .2, r0 = r * (.5 + .3 * e), r1 = r * (.75 + .5 * e); s += `<path d="M${(x + Math.cos(a) * r0).toFixed(1)},${(y + Math.sin(a) * r0).toFixed(1)} L${(x + Math.cos(a) * r1).toFixed(1)},${(y + Math.sin(a) * r1).toFixed(1)}" stroke="${K}" stroke-width="${(10 * (1 - k)).toFixed(1)}" stroke-linecap="round"/>`; }
  return s; }
// bocadillo de pensamiento (contenido = SVG dibujado en un cuadro de 200×140 centrado)
function thought(x, y, w, k, content, fromX, fromY) { if (k <= 0) return ''; const e = eBack(Math.min(1, k)), sc = w / 260 * e;
  const dots = fromX == null ? '' : [.25, .5].map((f, i) => `<circle cx="${lerp(fromX, x, f).toFixed(1)}" cy="${lerp(fromY, y + w * .3, f).toFixed(1)}" r="${(8 + i * 6) * e}" fill="#fff" stroke="${K}" stroke-width="5"/>`).join('');
  return dots + `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)})"><path d="M-110,30 C-150,20 -150,-40 -110,-50 C-110,-100 -40,-110 -20,-80 C0,-115 70,-112 80,-70 C130,-80 150,-20 120,10 C150,40 120,90 80,80 C60,115 -10,112 -30,85 C-80,110 -130,80 -110,30 Z" fill="#fff" stroke="${K}" stroke-width="9"/><g transform="translate(0,0)">${content}</g></g>`; }

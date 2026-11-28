// Small helpers shared by 3D-style scenes (loaded before world3d.js / scenes.js).
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k, prog = (t, a, b) => clamp((t - a) / (b - a));
const eOut = t => 1 - Math.pow(1 - t, 3), eIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eBack = t => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2), ss = t => t * t * (3 - 2 * t);
const P = (t, a, d = .3) => eOut(prog(t, a, a + d));
const V3 = (x, y, z) => new THREE.Vector3(x, y, z), L3 = (a, b, k) => a.clone().lerp(b, k);
const YEL = '#ffd34a', PINK = '#ff4f7b', BLUE = '#6cc6ff', GREEN = '#5fe08a', INK = '#1b1720';
// dust motes floating in the light (screen space)
function motes(T, n = 30, op = .5) { let s = ''; for (let i = 0; i < n; i++) { const x = (i * 211 + T * (5 + i % 4)) % 1080, y = ((i * 389 - T * (4 + i % 3)) % 1920 + 1920) % 1920; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${2 + i % 3}" fill="#fff6dc" opacity="${(op * (.4 + .6 * Math.abs(Math.sin(T + i)))).toFixed(2)}"/>`; } return s; }
// comic impact helpers drawn over the 3D
function burstLines(x, y, r, k, col = '#ff4f5a') { if (k <= 0 || k >= 1) return ''; let s = ''; for (let i = 0; i < 3; i++) { const a = -.9 + i * .45; s += `<path d="M${x + Math.cos(a) * r},${y + Math.sin(a) * r} l${Math.cos(a) * 34},${Math.sin(a) * 34}" stroke="${col}" stroke-width="12" stroke-linecap="round" opacity="${(1 - k).toFixed(2)}"/>`; } return s; }
function ring(x, y, r, k, col = '#fff') { if (k <= 0 || k >= 1) return ''; return `<ellipse cx="${x}" cy="${y}" rx="${(r * eOut(k)).toFixed(1)}" ry="${(r * .3 * eOut(k)).toFixed(1)}" fill="none" stroke="${col}" stroke-width="${(14 * (1 - k)).toFixed(1)}" opacity="${(1 - k).toFixed(2)}"/>`; }
function puff(x, y, r, k, col = '#efe4cf') { if (k <= 0 || k >= 1) return ''; let s = ''; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + .3, d = r * (.4 + .9 * eOut(k)); s += `<circle cx="${(x + Math.cos(a) * d).toFixed(1)}" cy="${(y + Math.sin(a) * d * .35).toFixed(1)}" r="${(r * .3 * (1 - k * .6)).toFixed(1)}" fill="${col}" stroke="${INK}" stroke-width="5" opacity="${(.9 * (1 - k)).toFixed(2)}"/>`; } return s; }

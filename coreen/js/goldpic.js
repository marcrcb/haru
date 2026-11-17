// Édition Noir & Or : les dessins des mots (emoji) deviennent des gravures au trait fin doré.
// L'emoji est dessiné dans un canevas, ses contours (silhouette et détails) sont extraits,
// puis repeints en or sur fond transparent. Le résultat est mis en cache (une fois par emoji).

const SIZE = 132; // pixels du canevas (affiché ~ 56 px : trait d'environ 1 px sur un écran Retina)
const cache = new Map();

function draw(emoji) {
  const c = document.createElement('canvas');
  c.width = c.height = SIZE;
  const g = c.getContext('2d', { willReadFrequently: true });
  if (!g) return null;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `${Math.round(SIZE * 0.72)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  g.fillText(emoji, SIZE / 2, SIZE / 2 + SIZE * 0.04);
  const src = g.getImageData(0, 0, SIZE, SIZE);
  const d = src.data;
  const n = SIZE * SIZE;
  // Deux cartes : silhouette (opacité) et dessin intérieur (luminosité × opacité)
  const A = new Float32Array(n);
  const L = new Float32Array(n);
  let ink = 0;
  for (let i = 0; i < n; i++) {
    const a = d[i * 4 + 3] / 255;
    A[i] = a;
    L[i] = a * (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
    ink += a;
  }
  if (ink < 20) return null; // emoji absent de ce téléphone : on garde l'original
  const out = g.createImageData(SIZE, SIZE);
  const o = out.data;
  const sob = (M, x, y) => {
    const p = (dx, dy) => M[(y + dy) * SIZE + x + dx];
    const gx = -p(-1, -1) - 2 * p(-1, 0) - p(-1, 1) + p(1, -1) + 2 * p(1, 0) + p(1, 1);
    const gy = -p(-1, -1) - 2 * p(0, -1) - p(1, -1) + p(-1, 1) + 2 * p(0, 1) + p(1, 1);
    return Math.hypot(gx, gy);
  };
  const smooth = (v, a, b) => (v <= a ? 0 : v >= b ? 1 : ((v - a) / (b - a)) ** 2 * (3 - 2 * (v - a) / (b - a)));
  for (let y = 1; y < SIZE - 1; y++) {
    // or clair en haut, or profond en bas : un léger relief
    const k = y / SIZE;
    const r = Math.round(241 - 80 * k), gg = Math.round(220 - 95 * k), b = Math.round(161 - 105 * k);
    for (let x = 1; x < SIZE - 1; x++) {
      const edge = Math.max(smooth(sob(A, x, y), 0.9, 2.2), smooth(sob(L, x, y), 0.55, 1.4) * 0.85);
      if (edge <= 0.02) continue;
      const j = (y * SIZE + x) * 4;
      o[j] = r;
      o[j + 1] = gg;
      o[j + 2] = b;
      o[j + 3] = Math.round(edge * 255);
    }
  }
  g.clearRect(0, 0, SIZE, SIZE);
  g.putImageData(out, 0, 0);
  try {
    return c.toDataURL('image/png');
  } catch {
    return null;
  }
}

/** Gravure dorée d'un emoji (adresse d'image), ou null si le navigateur ne sait pas la produire. */
export function goldPicture(emoji) {
  if (!cache.has(emoji)) {
    let url = null;
    try { url = draw(emoji); } catch { url = null; }
    cache.set(emoji, url);
  }
  return cache.get(emoji);
}

// Ordre et sens des traits du hangeul, dans un carré de 109 × 109 (même repère que les kana).
// Règles : de haut en bas, de gauche à droite ; ㅇ se trace d'un seul trait, dans le sens inverse des aiguilles d'une montre.
// Les formes suivent les lettres imprimées (celles du clavier), pas l'écriture manuscrite : ㅈ = barre + deux jambes.
// Les barres des voyelles comme ㅐ ou ㅔ restent proches l'une de l'autre, comme à l'écran.
// Les traits d'une lettre sont séparés par « | ». Commandes utilisées : M, H, V, Q, A (coordonnées absolues).

const BASE = {
  // Consonnes
  ㄱ: 'M24 28H82V90',
  ㄴ: 'M26 22V84H88',
  ㄷ: 'M24 26H86|M24 26V84H88',
  ㄹ: 'M24 22H84V54|M24 54H84|M24 54V88H88',
  ㅁ: 'M26 24V88|M26 24H84V88|M26 88H84',
  ㅂ: 'M28 20V90|M82 20V90|M28 54H82|M28 90H82',
  ㅅ: 'M55 20Q50 62 18 90|M55 44Q66 74 92 90',
  ㅇ: 'M55 20A35 35 0 1 0 55.1 20',
  ㅈ: 'M20 28H88|M55 28Q48 66 18 92|M48 53Q62 80 92 92',
  ㅊ: 'M44 14H66|M20 36H88|M55 36Q48 70 18 94|M48 59Q62 82 92 94',
  ㅋ: 'M24 28H82V90|M24 58H82',
  ㅌ: 'M24 24H86|M24 55H84|M24 24V86H88',
  ㅍ: 'M18 24H92|M40 24V86|M70 24V86|M16 86H94',
  ㅎ: 'M44 12H66|M18 34H92|M55 48A23 23 0 1 0 55.1 48',
  // Voyelles
  ㅏ: 'M46 12V98|M46 54H80',
  ㅑ: 'M46 12V98|M46 42H80|M46 68H80',
  ㅓ: 'M30 54H64|M64 12V98',
  ㅕ: 'M30 42H64|M30 68H64|M64 12V98',
  ㅗ: 'M55 30V72|M12 72H98',
  ㅛ: 'M40 30V72|M70 30V72|M12 72H98',
  ㅜ: 'M12 40H98|M55 40V88',
  ㅠ: 'M12 40H98|M40 40V88|M70 40V88',
  ㅡ: 'M12 55H98',
  ㅣ: 'M55 10V100',
  // Voyelles composées
  ㅐ: 'M44 14V96|M44 55H66|M66 10V100',
  ㅔ: 'M28 55H52|M52 14V96|M72 10V100',
  ㅒ: 'M44 14V96|M44 42H66|M44 68H66|M66 10V100',
  ㅖ: 'M26 42H52|M26 68H52|M52 14V96|M72 10V100',
  ㅘ: 'M36 36V68|M10 68H62|M76 10V100|M76 55H98',
  ㅙ: 'M30 38V68|M8 68H54|M68 14V96|M68 55H86|M86 10V100',
  ㅚ: 'M38 34V68|M10 68H66|M82 10V100',
  ㅝ: 'M10 58H64|M38 58V94|M56 36H82|M82 10V100',
  ㅞ: 'M8 58H52|M30 58V94|M50 36H68|M68 14V96|M86 10V100',
  ㅟ: 'M10 56H66|M38 56V94|M82 10V100',
  ㅢ: 'M10 62H66|M82 10V100',
};

/** Resserre un tracé en largeur (facteur sx) et le décale (ox) : sert aux consonnes doubles. */
function squeeze(d, sx, ox) {
  const x = (v) => Math.round((Number(v) * sx + ox) * 10) / 10;
  return d.replace(/([MHVQA])([^MHVQA|]*)/g, (_, c, args) => {
    const n = args.trim().split(/[\s,]+/).filter(Boolean);
    if (c === 'H') return `H${x(n[0])}`;
    if (c === 'V') return `V${n[0]}`;
    if (c === 'M') return `M${x(n[0])} ${n[1]}`;
    if (c === 'Q') return `Q${x(n[0])} ${n[1]} ${x(n[2])} ${n[3]}`;
    return `A${Math.round(Number(n[0]) * sx * 10) / 10} ${n[1]} ${n[2]} ${n[3]} ${n[4]} ${x(n[5])} ${n[6]}`;
  });
}
const twice = (j) => `${squeeze(BASE[j], 0.5, 0)}|${squeeze(BASE[j], 0.5, 54)}`;

export const HANGUL_STROKES = {
  ...BASE,
  ㄲ: twice('ㄱ'), ㄸ: twice('ㄷ'), ㅃ: twice('ㅂ'), ㅆ: twice('ㅅ'), ㅉ: twice('ㅈ'),
};

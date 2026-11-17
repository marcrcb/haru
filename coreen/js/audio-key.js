// Clé et nom de fichier d'un enregistrement (voix naturelle). Partagé par l'application et tools/audio-list.mjs.
// La clé est le texte prononcé, sans la ponctuation finale ; le fichier porte une empreinte FNV-1a (32 bits) de la clé.

/** Texte normalisé : même clé pour « 안녕하세요. » et « 안녕하세요 ». */
export const audioKey = (text) => String(text ?? '').normalize('NFC').trim().replace(/[.?!。？！~〜…]+$/u, '').trim();

/** Empreinte FNV-1a 32 bits des octets UTF-8, en 8 caractères hexadécimaux. */
export function audioHash(key) {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(key)) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

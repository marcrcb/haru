// Morceaux d'une phrase générée, tels qu'ils sont enregistrés (voix naturelles) puis enchaînés à la lecture.
// Coréen : les mots séparés par des espaces (avec leurs particules et terminaisons).
// Japonais : les jetons du générateur (mot + particule), donnés à la synthèse avec leur lecture en kana.
const PUNCT = /[.,?!。、？！~〜…]/g;

/** [{ text, say }] dans l'ordre de la phrase. */
export function phraseTokens(p, courseId) {
  if (courseId === 'ja' && Array.isArray(p.ruby)) {
    return p.ruby
      .map((t) => ({ text: (t.w + (t.p || '')).replace(PUNCT, ''), say: (t.r + (t.p || '')).replace(PUNCT, '') }))
      .filter((t) => t.text);
  }
  return String(p.tl || '').split(/\s+/).map((w) => w.replace(PUNCT, '')).filter(Boolean).map((w) => ({ text: w, say: w }));
}

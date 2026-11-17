// Révisions prévues : les mots, lettres et kanji dont la date de révision (répétition espacée) est arrivée,
// plus les fautes en attente. C'est ce que propose la séance « Révisions du jour ».
import * as store from './store.js';
import { course } from './course.js';

export const REVIEW_MAX = 15; // questions par séance
/** Identifiants de suivi des lettres (kana : forme hiragana) et des kanji. */
export const letterId = (x) => `L:${x.base || x.j}`;
export const kanjiId = (x) => `K:${x.j}`;

/** Toutes les lettres et tous les kanji du cours, sans doublon. */
export function scriptItems() {
  const letters = new Map();
  const kanji = new Map();
  for (const set of Object.values(course().script.sets || {})) {
    for (const x of set.items || []) {
      if (set.kind === 'kanji') kanji.set(kanjiId(x), x);
      else letters.set(letterId(x), x);
    }
  }
  return { letters: [...letters.values()], kanji: [...kanji.values()] };
}

/** Ce qu'il faut revoir aujourd'hui : fautes d'abord, puis les révisions arrivées à échéance (les plus anciennes d'abord). */
export function reviewItems() {
  const C = course();
  const st = store.get();
  const today = store.dayNumber();
  const due = (id) => { const c = st.srs?.[id]; return !!c && c.due <= today; };
  const byDue = (id) => (a, b) => st.srs[id(a)].due - st.srs[id(b)].due;
  const mist = store.mistakes(C.words);
  const words = [...mist, ...C.words.filter((w) => due(w.id) && !mist.includes(w)).sort(byDue((w) => w.id))];
  const S = scriptItems();
  const letters = S.letters.filter((x) => due(letterId(x))).sort(byDue(letterId));
  const kanji = S.kanji.filter((x) => due(kanjiId(x))).sort(byDue(kanjiId));
  return { words, letters, kanji, total: words.length + letters.length + kanji.length };
}

export const reviewCount = () => reviewItems().total;

/** Dans combien de jours arrive la prochaine révision (null si rien n'est encore suivi). */
export function nextReviewIn() {
  const today = store.dayNumber();
  const next = Object.values(store.get().srs || {}).map((c) => c.due).filter((d) => d > today);
  return next.length ? Math.min(...next) - today : null;
}

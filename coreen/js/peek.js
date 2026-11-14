// Trou de mémoire : toucher un mot (dans une phrase, une question…) affiche son sens dans une bulle.
// Tout élément portant data-peek="sens" devient touchable ; les étiquettes à remettre dans l'ordre l'utilisent par appui long.
import { esc } from './ui.js';
import { course, gloss, lang } from './course.js';
import { CHO, decompose, isSyllable } from './hangul.js';

// Terminaisons à retirer pour retrouver le mot du lexique : particules coréennes, puis politesse.
const KO_TAILS = ['에서는', '에게서', '에서', '으로', '에게', '한테', '까지', '부터', '이랑', '하고', '처럼', '보다', '은', '는', '이', '가', '을', '를', '에', '도', '의', '로', '와', '과', '랑', '만', '요'];
const JA_TAILS = ['から', 'まで', 'より', 'は', 'が', 'を', 'に', 'で', 'と', 'も', 'の', 'へ', 'や', 'か', 'ね', 'よ'];
// Petits mots de grammaire des phrases générées (avant le lexique, où 안 voudrait dire « dedans »).
const GRAMMAR = {
  ko: {
    안: ['ne… pas (négation)', 'not (negation)'], 못: ['ne pas pouvoir', 'cannot'],
    거예요: ['(futur ou supposition)', '(future or guess)'], 거야: ['(futur ou supposition)', '(future or guess)'], 겁니다: ['(futur ou supposition)', '(future or guess)'],
    않아요: ['ne… pas (négation)', 'not (negation)'], 않습니다: ['ne… pas (négation)', 'not (negation)'], 않아: ['ne… pas (négation)', 'not (negation)'],
  },
  ja: {},
};
/** Même consonne de départ pour une syllabe coréenne (봐 / 보, 탈 / 타, 빠 / 쁘). */
const sameCho = (a, b) => isSyllable(a) && isSyllable(b) && CHO[decompose(a).cho] === CHO[decompose(b).cho];
/** Le mot ressemble-t-il à une forme conjuguée de ce verbe ou adjectif (dictionnaire en -다 / -る…) ? */
function conjugated(tk, f) {
  const st = f.replace(/[다るうくぐすつぬぶむい]$/, '');
  if (!st || st === f) return false;
  if (tk.startsWith(st)) return true;
  // Coréen : la dernière syllabe du radical se contracte souvent (보 → 봐, 타 → 탈, 바쁘 → 바빠).
  const head = st.slice(0, -1);
  return /[가-힣]/.test(st) && tk.length >= st.length && tk.startsWith(head) && sameCho(tk[head.length], st.at(-1));
}
const clean = (s) => String(s).replace(/[\s.,!?。、？！~〜…「」]/g, '');

/** Mot du texte → sens. words : mots de la phrase (générateur), sinon on cherche dans le vocabulaire du cours. */
export function meaningOf(token, words = null) {
  const tk = clean(token);
  if (!tk) return null;
  const forms = (w) => [w.tl, w.r].filter(Boolean).map(clean);
  const sense = (w) => (w.fr || w.en ? gloss(w) : null);
  // 1. Mots de la phrase : le mot exact, puis le mot suivi d'une particule, puis un verbe conjugué (même radical).
  if (words?.length) {
    const exact = words.find((w) => forms(w).includes(tk));
    if (exact) return sense(exact);
    const pre = words.filter((w) => forms(w).some((f) => f && tk.startsWith(f))).sort((a, b) => clean(b.tl).length - clean(a.tl).length)[0];
    if (pre) return sense(pre);
    const stem = words.find((w) => forms(w).some((f) => conjugated(tk, f)));
    if (stem) return sense(stem);
  }
  const C = course();
  const g = GRAMMAR[C.id]?.[tk];
  if (g) return lang() === 'en' ? g[1] : g[0];
  // 2. Vocabulaire du cours
  const byForm = new Map();
  for (const w of C.words) for (const f of forms(w)) if (!byForm.has(f)) byForm.set(f, w);
  if (byForm.has(tk)) return gloss(byForm.get(tk));
  for (const tail of C.id === 'ja' ? JA_TAILS : KO_TAILS) {
    if (tk.length > tail.length && tk.endsWith(tail) && byForm.has(tk.slice(0, -tail.length))) return gloss(byForm.get(tk.slice(0, -tail.length)));
  }
  return null;
}

// ---------- Bulle ----------
let tip = null;
let timer = 0;
export function closePeek() {
  tip?.remove();
  tip = null;
  clearTimeout(timer);
}
/** Affiche le sens au-dessus (ou au-dessous) de l'élément touché. */
export function showPeek(anchor, text) {
  closePeek();
  tip = document.createElement('div');
  tip.className = 'peek-tip';
  tip.setAttribute('role', 'status');
  tip.innerHTML = text ? esc(text) : '<span class="muted">?</span>';
  document.body.append(tip);
  const r = anchor.getBoundingClientRect();
  const w = tip.offsetWidth;
  const h = tip.offsetHeight;
  const left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2));
  const above = r.top - h - 8 > 8;
  tip.style.left = `${left}px`;
  tip.style.top = `${above ? r.top - h - 8 : r.bottom + 8}px`;
  tip.classList.toggle('below', !above);
  timer = setTimeout(closePeek, 3500);
}

// Toucher un élément [data-peek] : on montre son sens (pas pendant un examen). Toucher ailleurs ferme la bulle.
document.addEventListener('click', (e) => {
  const el = e.target.closest?.('[data-peek]');
  if (!el || el.closest('.exam-mode')) return closePeek();
  showPeek(el, el.dataset.peek);
});
addEventListener('hashchange', closePeek);
addEventListener('scroll', closePeek, { passive: true });

/** Attribut à ajouter à un mot pour qu'on puisse le toucher (rien si on ne connaît pas son sens). */
export const peekAttr = (token, words) => {
  const m = meaningOf(token, words);
  return m ? ` data-peek="${esc(m)}"` : '';
};

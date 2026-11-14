// Exercices à voix haute : le téléphone écoute (reconnaissance vocale du navigateur) et on vérifie
// que ce qu'il a compris correspond bien au mot attendu. Si l'appareil ne sait pas écouter, ces exercices
// sont remplacés par d'autres.
import { get } from './store.js';
import { course } from './course.js';
import { normAnswer } from './keyboard.js';
import { decompose, CHO, JUNG, JONG } from './hangul.js';

const Rec = () => (typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null);
let blocked = false; // micro refusé ou indisponible pendant cette séance

/** L'appareil sait-il écouter, et l'option est-elle activée ? */
export const listenSupported = () => !!Rec();
export const canListen = () => listenSupported() && !blocked && get().settings.speech !== false;
/** À appeler quand l'utilisateur ne peut pas parler maintenant : plus d'exercice oral jusqu'au prochain lancement. */
export const muteSpeech = () => { blocked = true; };

/**
 * Écoute une prise de parole. onResult(propositions) reçoit ce que le téléphone a compris (plusieurs hypothèses).
 * onError(code) : « denied » (micro refusé), « silence » (rien entendu), « error ».
 * hits(propositions) : si fourni, on s'arrête dès qu'une transcription provisoire correspond (réponse plus rapide).
 * expected : textes attendus, proposés au téléphone quand il sait en tenir compte.
 * Renvoie { stop() }.
 */
export function listen({ onResult, onError, onEnd, hits, expected = [] }) {
  const R = Rec();
  if (!R) { onError?.('error'); return { stop() {} }; }
  const rec = new R();
  rec.lang = course().tts;
  rec.interimResults = true; // certains téléphones s'arrêtent sans résultat final : on garde le provisoire
  rec.continuous = false;
  rec.maxAlternatives = 8;
  // Chrome récent : on peut signaler les mots attendus pour aider la reconnaissance.
  try {
    if (expected.length && 'phrases' in rec && typeof window.SpeechRecognitionPhrase === 'function') {
      rec.phrases = expected.map((p) => new window.SpeechRecognitionPhrase(p, 5));
    }
  } catch { /* non pris en charge */ }
  let done = false;
  let finals = [];
  let interim = [];
  const deliver = (alts) => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    try { rec.stop(); } catch { /* déjà arrêté */ }
    onResult([...new Set(alts)]);
  };
  rec.onresult = (e) => {
    const fin = [];
    const tmp = [];
    let allFinal = true;
    for (const res of e.results) {
      if (!res.isFinal) allFinal = false;
      for (const a of res) if (a.transcript.trim()) (res.isFinal ? fin : tmp).push(a.transcript.trim());
    }
    // Les morceaux successifs d'une même phrase, recollés.
    const joined = [...e.results].map((r) => r[0]?.transcript || '').join('').trim();
    if (joined) (allFinal ? fin : tmp).push(joined);
    if (fin.length) finals = fin;
    interim = tmp.length ? tmp : interim;
    if (allFinal && finals.length) return deliver([...finals, ...interim]);
    if (hits && hits([...finals, ...interim])) deliver([...finals, ...interim]);
  };
  rec.onerror = (e) => {
    if (done) return;
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { done = true; blocked = true; clearTimeout(timer); onError?.('denied'); return; }
    // Une erreur après avoir entendu quelque chose : on juge ce qui a été entendu.
    if (finals.length || interim.length) return deliver([...finals, ...interim]);
    done = true;
    clearTimeout(timer);
    onError?.(e.error === 'no-speech' || e.error === 'aborted' ? 'silence' : 'error');
  };
  rec.onend = () => {
    if (!done) {
      if (finals.length || interim.length) deliver([...finals, ...interim]);
      else { done = true; clearTimeout(timer); onError?.('silence'); }
    }
    onEnd?.();
  };
  // Filet de sécurité : certains appareils n'arrêtent jamais l'écoute d'eux-mêmes.
  const timer = setTimeout(() => { try { rec.stop(); } catch { /* déjà arrêté */ } }, 8000);
  try { rec.start(); } catch { done = true; clearTimeout(timer); onError?.('error'); onEnd?.(); }
  return { stop() { try { rec.stop(); } catch { /* déjà arrêté */ } } };
}

/** Distance d'édition entre deux listes (chaînes ou tableaux). */
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}
const similarity = (a, b) => (Math.max(a.length, b.length) ? 1 - distance(a, b) / Math.max(a.length, b.length) : 0);

// ---------- Coréen : comparer les sons, lettre par lettre ----------
// Voyelles qui se prononcent (presque) pareil aujourd'hui, et consonnes finales qui se confondent à l'oral.
const SAME_VOWEL = { 'ㅔ': 'ㅐ', 'ㅖ': 'ㅒ', 'ㅞ': 'ㅙ', 'ㅚ': 'ㅙ' };
const FINAL_SOUND = { 'ㄲ': 'ㄱ', 'ㅋ': 'ㄱ', 'ㄳ': 'ㄱ', 'ㄺ': 'ㄱ', 'ㅅ': 'ㄷ', 'ㅆ': 'ㄷ', 'ㅈ': 'ㄷ', 'ㅊ': 'ㄷ', 'ㅌ': 'ㄷ', 'ㅎ': 'ㄷ', 'ㅍ': 'ㅂ', 'ㅄ': 'ㅂ', 'ㄿ': 'ㅂ', 'ㄵ': 'ㄴ', 'ㄶ': 'ㄴ', 'ㄻ': 'ㅁ', 'ㄼ': 'ㄹ', 'ㄽ': 'ㄹ', 'ㄾ': 'ㄹ', 'ㅀ': 'ㄹ' };
const isHangul = (ch) => ch >= '가' && ch <= '힣';
// Consonne finale double : ce qui reste en fin de syllabe et ce qui passe à la suivante devant une voyelle.
const SPLIT = { 'ㄳ': ['ㄱ', 'ㅅ'], 'ㄵ': ['ㄴ', 'ㅈ'], 'ㄶ': ['ㄴ', ''], 'ㄺ': ['ㄹ', 'ㄱ'], 'ㄻ': ['ㄹ', 'ㅁ'], 'ㄼ': ['ㄹ', 'ㅂ'], 'ㄽ': ['ㄹ', 'ㅅ'], 'ㄾ': ['ㄹ', 'ㅌ'], 'ㄿ': ['ㄹ', 'ㅍ'], 'ㅀ': ['ㄹ', ''], 'ㅄ': ['ㅂ', 'ㅅ'], 'ㅎ': ['', ''] };
/**
 * Suite des sons d'un texte coréen : ㅇ muet retiré, liaison (같이 → 가치, 음악 → 으막),
 * consonnes finales et voyelles qui se prononcent pareil confondues.
 */
export function koSounds(text) {
  const syl = [...text].map((ch) => {
    if (!isHangul(ch)) return /[ㄱ-ㅣ]/.test(ch) ? { raw: SAME_VOWEL[ch] || ch } : null;
    const { cho, jung, jong } = decompose(ch);
    return { cho: CHO[cho], jung: JUNG[jung], jong: JONG[jong] };
  }).filter(Boolean);
  const out = [];
  syl.forEach((x, i) => {
    if (x.raw) return out.push(x.raw);
    const next = syl[i + 1];
    if (x.cho !== 'ㅇ') out.push(x.cho);
    out.push(SAME_VOWEL[x.jung] || x.jung);
    if (!x.jong) return;
    if (next && next.cho === 'ㅇ' && x.jong !== 'ㅇ') {
      // Liaison : la consonne finale devient le début de la syllabe suivante.
      const [stay, move] = SPLIT[x.jong] || ['', x.jong];
      if (stay) out.push('_' + (FINAL_SOUND[stay] || stay));
      if (!move) return;
      const pal = next.jung === 'ㅣ' ? { 'ㄷ': 'ㅈ', 'ㅌ': 'ㅊ' }[move] : null;
      next.cho = pal || move;
      return;
    }
    out.push('_' + (FINAL_SOUND[x.jong] || x.jong));
  });
  return out;
}

// ---------- Nombres écrits en chiffres par le téléphone ----------
const KO_SINO = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
const KO_NATIVE = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
const JA_NUM = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
function sino(n, digits, units) {
  if (n === 0) return digits === JA_NUM ? 'ぜろ' : '영';
  let out = '';
  [[1000, 3], [100, 2], [10, 1]].forEach(([v, u]) => {
    const d = Math.floor(n / v) % 10;
    if (d) out += (d > 1 ? digits[d] : '') + units[u];
  });
  return out + digits[n % 10];
}
/** « 3 » → 삼 / 셋 (coréen) ou さん (japonais) ; plusieurs lectures possibles. */
function numberReadings(text, ja) {
  if (!/\d/.test(text)) return [];
  const read = (fn) => text.replace(/\d+/g, (d) => (Number(d) < 10000 ? fn(Number(d)) : d));
  if (ja) return [read((n) => sino(n, JA_NUM, ['', 'じゅう', 'ひゃく', 'せん']))];
  return [read((n) => sino(n, KO_SINO, ['', '십', '백', '천'])), read((n) => (n >= 1 && n <= 10 ? KO_NATIVE[n] : sino(n, KO_SINO, ['', '십', '백', '천'])))];
}

// ---------- Japonais : le téléphone écrit souvent en kanji ce qu'on a dit en kana ----------
let kanjiMap = null;
/** Remplace les mots en kanji connus du lexique par leur lecture (le plus long d'abord). */
function kanjiToKana(C, text) {
  if (!/[一-龯々]/.test(text)) return text;
  kanjiMap ||= C.words.filter((w) => w.r && /[一-龯々]/.test(w.tl)).map((w) => [w.tl.replace(/[。、？！.?!\s]/g, ''), w.r.replace(/[。、？！.?!\s]/g, '')]).filter(([k]) => k).sort((a, b) => b[0].length - a[0].length);
  let s = text;
  for (const [k, r] of kanjiMap) if (s.includes(k)) s = s.split(k).join(r);
  return s;
}

/** Variantes d'une transcription : telle quelle, chiffres lus, kanji lus. */
function variants(C, alt) {
  const ja = C.id === 'ja';
  const list = [alt, ...numberReadings(alt, ja)];
  if (ja) list.push(...list.map((x) => kanjiToKana(C, x)));
  return [...new Set(list.map(normAnswer).filter(Boolean))];
}

/**
 * Ce qui a été entendu correspond-il à l'un des textes attendus ?
 * On compare l'écriture, puis les sons (coréen : lettre par lettre, en confondant ce qui se prononce pareil ;
 * japonais : kana et romanisation). 같이 et 가치 se disent pareil ; 개 et 게 aussi.
 * Renvoie { ok, heard, score (0 à 1) }.
 */
export function matchSpokenIn(C, alts, targets) {
  const ja = C.id === 'ja';
  const rom = (s) => { try { return C.romanize(s).toLowerCase().replace(/[^a-z]/g, ''); } catch { return ''; } };
  const want = targets.map(normAnswer).filter(Boolean);
  let best = { ok: false, heard: alts[0] || '', score: 0 };
  for (const alt of alts) {
    for (const a of variants(C, alt)) {
      for (const w of want) {
        let score = similarity(a, w);
        // Un mot de liaison en plus (ou une politesse) ne compte pas.
        if (a.includes(w) && a.length <= w.length + 3) score = 1;
        if (!ja) {
          const sa = koSounds(a);
          const sw = koSounds(w);
          if (sa.length && sw.length) score = Math.max(score, similarity(sa, sw));
        }
        const ra = rom(a);
        const rw = rom(w);
        if (ra && rw && !/[一-龯々]/.test(a + w)) score = Math.max(score, similarity(ra, rw));
        // Mot très court : il faut l'entendre presque exactement ; sinon un petit écart de prononciation passe.
        const need = w.length <= 1 ? 0.99 : w.length <= 2 ? 0.8 : 0.72;
        if (score > best.score) best = { ok: score >= need, heard: alt, score };
      }
    }
  }
  return best;
}
export const matchSpoken = (alts, targets) => matchSpokenIn(course(), alts, targets);

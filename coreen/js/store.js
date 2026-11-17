// Données de l'utilisateur, conservées uniquement sur le téléphone (localStorage).
// Structure : réglages communs + une progression séparée par langue apprise (coréen, japonais).

const KEY = 'haru.v1';
const DAY = 86400000;

const SETTINGS = () => ({
  roman: true, sound: true, rate: 0.85, theme: 'auto', krLarge: false, motion: true,
  autoplay: true, lang: 'fr', course: null, speech: true,
});
const COURSE = () => ({
  xp: 0,
  days: {}, // 'AAAA-MM-JJ' → XP gagnés ce jour-là
  srs: {}, // id du mot → { b: boîte 0-5, due: jour, ok, ko }
  journal: [], // phrases enregistrées
  daily: {}, // 'AAAA-MM-JJ' → nombre de phrases du défi réussies
  best: {}, // records (ex. temps du jeu des paires)
  read: {}, // leçons du guide déjà lues
  road: {}, // parcours : id d'étape → étoiles (1 à 3), 'open:<module>' et 'bonus:<module>' → true
  exams: {}, // examens de module : id du module → meilleur score (0 à 100)
  final: { best: 0, n: 0, last: 0, date: '' }, // examen final
  stats: {}, // compteurs pour les succès : typed, traced, dictation, perfect, phrases, combo, streak
  srsV: 2, // version de la répétition espacée (2 : intervalles longs, jusqu'à 6 mois)
  ach: {}, // succès : id → palier déjà fêté
});
const DAILY_GOAL = 30; // XP par jour pour compter dans la série (le réglage n'existe plus)
const ROOT = () => ({ v: 2, goal: DAILY_GOAL, settings: SETTINGS(), courses: { ko: COURSE(), ja: COURSE() } });

let root = load();
let state; // progression du cours actif (avec accès à settings et goal)
selectCourse(root.settings.course || 'ko');

/** Charge les données ; convertit l'ancien format (coréen seul) sans rien perdre. */
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch { /* stockage indisponible : on repart de zéro */ }
  return ROOT();
}

export function normalize(s) {
  const r = ROOT();
  if (s.v === 2) {
    r.settings = { ...r.settings, ...(s.settings || {}) };
    if (Number(s.goal) >= 5 && Number(s.goal) <= 200) r.goal = Number(s.goal); // objectif choisi au premier lancement ou dans les réglages
    for (const k of Object.keys(r.courses)) r.courses[k] = migrateSrs({ ...COURSE(), srsV: 1, ...(s.courses?.[k] || {}) });
    return r;
  }
  // Ancien format : tout appartenait au cours de coréen.
  r.settings = { ...r.settings, ...(s.settings || {}), course: 'ko' };
  const { settings, goal, ...rest } = s;
  r.courses.ko = migrateSrs({ ...COURSE(), srsV: 1, ...rest });
  return r;
}

/**
 * Passage aux intervalles longs (version 2). Ancienne boîte 0-5 (intervalles 0, 1, 2, 4, 8, 16 jours)
 * → nouvelle boîte 0-7 (0, 1, 3, 7, 16, 35, 90, 180 jours) ; l'ancienne boîte devient la série de bonnes réponses.
 */
function migrateSrs(c) {
  if (c.srsV >= 2) return c;
  for (const x of Object.values(c.srs || {})) {
    x.s ??= x.err ? 0 : x.b;
    x.b = [0, 1, 2, 3, 3, 4][x.b] ?? Math.min(x.b, 4);
  }
  c.srsV = 2;
  return c;
}

function bind(c) {
  Object.defineProperty(c, 'settings', { get: () => root.settings, enumerable: false, configurable: true });
  Object.defineProperty(c, 'goal', { get: () => root.goal, set: (v) => { root.goal = v; }, enumerable: false, configurable: true });
  return c;
}

/** Active la progression d'un cours. */
export function selectCourse(id) {
  root.courses[id] ||= COURSE();
  state = bind(root.courses[id]);
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(root)); } catch { /* navigation privée, quota… */ }
}

export const get = () => state;
export const exportAll = () => JSON.stringify(root);

/** Restaure une sauvegarde (nouveau ou ancien format). Lève une erreur si le fichier est invalide. */
export function importAll(data) {
  if (!data || typeof data !== 'object' || !(data.v === 2 ? data.courses : typeof data.xp === 'number')) throw new Error('invalid');
  root = normalize(data);
  selectCourse(root.settings.course || 'ko');
  save();
}

export function reset() {
  const keep = { lang: root.settings.lang, course: root.settings.course };
  root = ROOT();
  Object.assign(root.settings, keep);
  selectCourse(keep.course || 'ko');
  save();
}

// ---------- Dates ----------
/** Parcours : enregistre une étape réussie (on garde le meilleur nombre d'étoiles). */
export function markRoad(id, stars = 1) {
  if (!id) return;
  state.road ||= {};
  state.road[id] = Math.max(state.road[id] || 0, stars);
  save();
}
export const starsFor = (ratio) => (ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1);

// ---------- Compteurs (succès) ----------
/** Ajoute n à un compteur. */
export function bump(key, n = 1) {
  state.stats ||= {};
  state.stats[key] = (state.stats[key] || 0) + n;
  save();
  dispatchEvent(new CustomEvent('haru:stat'));
}
/** Garde la meilleure valeur d'un compteur (plus grande série, plus longue suite de jours…). */
export function record(key, v) {
  state.stats ||= {};
  if ((state.stats[key] || 0) >= v) return;
  state.stats[key] = v;
  save();
  dispatchEvent(new CustomEvent('haru:stat'));
}
export const stat = (key) => state.stats?.[key] || 0;

// ---------- Examens ----------
export const EXAM_PASS = 80; // score minimal (en %) pour réussir un examen de module
export const examScore = (unit) => state.exams?.[unit] || 0;
export const examPassed = (unit) => examScore(unit) >= EXAM_PASS;
export function markExam(unit, pct) {
  state.exams ||= {};
  state.exams[unit] = Math.max(state.exams[unit] || 0, pct);
  save();
  dispatchEvent(new CustomEvent('haru:stat'));
}
export function markFinal(pct) {
  const f = (state.final ||= { best: 0, n: 0, last: 0, date: '' });
  f.best = Math.max(f.best || 0, pct);
  f.n = (f.n || 0) + 1;
  f.last = pct;
  f.date = dayKey();
  save();
  dispatchEvent(new CustomEvent('haru:stat'));
}

export function dayKey(d = new Date()) {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
export const dayNumber = (d = new Date()) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / DAY);

// ---------- XP, niveau, série ----------
export function addXp(n) {
  const before = level().lv;
  const k = dayKey();
  const dayBefore = state.days[k] || 0;
  state.xp += n;
  state.days[k] = dayBefore + n;
  state.stats ||= {};
  state.stats.streak = Math.max(state.stats.streak || 0, streak());
  save();
  dispatchEvent(new CustomEvent('haru:xp'));
  // Événements pour les célébrations (niveau gagné, objectif du jour atteint)
  const after = level().lv;
  if (after > before) dispatchEvent(new CustomEvent('haru:levelup', { detail: after }));
  if (dayBefore < root.goal && state.days[k] >= root.goal) dispatchEvent(new CustomEvent('haru:goal', { detail: streak() }));
}

export const todayXp = () => state.days[dayKey()] || 0;

/** Niveau n atteint à 25·(n-1)² XP. */
export function level(xp = state.xp) {
  const lv = Math.floor(Math.sqrt(xp / 25)) + 1;
  const start = 25 * (lv - 1) ** 2;
  const next = 25 * lv ** 2;
  // into / span : XP gagnés dans le niveau en cours et XP à gagner pour le terminer (le compteur repart de zéro à chaque niveau)
  return { lv, progress: (xp - start) / (next - start), toNext: next - xp, into: xp - start, span: next - start };
}

/** Jours consécutifs avec l'objectif quotidien atteint (aujourd'hui compte s'il est atteint). */
export function streak() {
  let n = 0;
  const d = new Date();
  if ((state.days[dayKey(d)] || 0) < root.goal) d.setDate(d.getDate() - 1);
  while ((state.days[dayKey(d)] || 0) >= root.goal) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// ---------- Répétition espacée (boîtes de Leitner, intervalles longs) ----------
// Boîte 0 → 7 : on revoit l'élément après 0, 1, 3, 7, 16, 35, 90 puis 180 jours.
const INTERVALS = [0, 1, 3, 7, 16, 35, 90, 180];
const MAX_BOX = INTERVALS.length - 1;
/** « Maîtrisé » : l'élément a tenu au moins trois semaines (réussi à la révision de 16 jours). */
export const MASTER_BOX = 5;

/**
 * Enregistre une réponse. On ne monte d'une boîte que si la révision était due (ou pour un élément nouveau) :
 * réussir dix fois le même jour ne vaut pas une révision espacée. Une faute fait redescendre de deux boîtes.
 * s : bonnes réponses d'affilée (sert aux objectifs du parcours et à la difficulté des exercices).
 */
export function review(id, correct) {
  const today = dayNumber();
  const old = state.srs[id];
  const c = old || { b: 0, due: today, ok: 0, ko: 0, s: 0 };
  if (correct) {
    c.ok++;
    c.s = (c.s || 0) + 1;
    c.err = 0; // faute corrigée
    if (!old || c.due <= today) {
      c.b = Math.min(MAX_BOX, c.b + 1);
      c.due = today + INTERVALS[c.b];
    }
  } else {
    c.ko++;
    c.s = 0;
    c.err = 1; // faute à réviser
    c.b = Math.max(0, c.b - 2);
    c.due = today + INTERVALS[c.b];
  }
  state.srs[id] = c;
  save();
}

export const box = (id) => state.srs[id]?.b ?? -1;
/** Bonnes réponses d'affilée (-1 : jamais vu). */
export const streakOf = (id) => (state.srs[id] ? state.srs[id].s ?? 0 : -1);
/** Retenu : réussi au moins deux fois d'affilée (ou déjà espacé). C'est ce que demandent les objectifs du parcours. */
export const retained = (c) => !!c && ((c.s ?? 0) >= 2 || c.b >= 2);
export const isRetained = (id) => retained(state.srs[id]);
export const isMastered = (id) => (state.srs[id]?.b ?? -1) >= MASTER_BOX;

/** Choisit n mots : d'abord ceux à revoir, puis des nouveaux, puis les autres. */
export function pickForReview(words, n, random = Math.random) {
  const today = dayNumber();
  const shuffle = (a) => a.map((x) => [random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
  const due = shuffle(words.filter((w) => state.srs[w.id] && state.srs[w.id].due <= today)).sort((a, b) => state.srs[a.id].b - state.srs[b.id].b);
  const fresh = shuffle(words.filter((w) => !state.srs[w.id]));
  const rest = shuffle(words.filter((w) => state.srs[w.id] && state.srs[w.id].due > today));
  return [...due, ...fresh, ...rest].slice(0, n);
}

/** Faute en attente de révision ? (anciennes sauvegardes sans le drapeau : mot raté et encore mal connu) */
const isMistake = (c) => !!c && (c.err ?? (c.ko > 0 && c.b <= 1 ? 1 : 0)) === 1;
/** Mots ratés et pas encore réussis depuis : ce que l'onglet Révision fait retravailler, les plus anciennes fautes d'abord. */
export const mistakes = (words) => words.filter((w) => isMistake(state.srs[w.id])).sort((a, b) => state.srs[a.id].due - state.srs[b.id].due);

export const dueCount = (words) => {
  const today = dayNumber();
  return words.filter((w) => state.srs[w.id] && state.srs[w.id].due <= today).length;
};

export const mastered = () => Object.values(state.srs).filter((c) => c.b >= MASTER_BOX).length;

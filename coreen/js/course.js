// Cours actif (coréen ou japonais) et langue de l'interface (français ou anglais).
// Seul le cours appris est chargé (vocabulaire, guide, kanji…) ; l'autre l'est à la demande, quand on change de langue.
import * as store from './store.js';
import { STRINGS } from './content/strings.js';

/** Ce qu'il faut savoir d'un cours avant de le charger (écran d'accueil, réglages). */
export const COURSES = {
  ko: { id: 'ko', name: { fr: 'Coréen', en: 'Korean' }, native: '한국어' },
  ja: { id: 'ja', name: { fr: 'Japonais', en: 'Japanese' }, native: '日本語' },
};
const LOADERS = {
  ko: () => import('./lang/ko.js').then((m) => m.KO),
  ja: () => import('./lang/ja.js').then((m) => m.JA),
};
const loaded = {};
/** Charge un cours (une seule fois). */
export async function loadCourse(id) {
  if (!LOADERS[id]) return null;
  loaded[id] ||= await LOADERS[id]();
  return loaded[id];
}
// Au démarrage : le cours choisi (le coréen par défaut, le temps de l'écran d'accueil)
await loadCourse(LOADERS[store.get().settings.course] ? store.get().settings.course : 'ko');

export const course = () => loaded[store.get().settings.course] || loaded.ko || Object.values(loaded)[0];
export const hasCourse = () => !!LOADERS[store.get().settings.course];

/** Change de cours (charge d'abord son contenu). */
export async function setCourse(id) {
  await loadCourse(id);
  store.get().settings.course = id;
  store.selectCourse(id);
  store.save();
}

// ---------- Traductions de l'interface ----------
export const lang = () => (store.get().settings.lang === 'en' ? 'en' : 'fr');

/** Texte de l'interface : t('clé', { variable }) ; la clé elle-même s'affiche si elle manque. */
export function t(key, vars) {
  const d = STRINGS[lang()][key] ?? STRINGS.fr[key] ?? key;
  return vars ? d.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') : d;
}

/** Valeur bilingue { fr, en } → texte dans la langue de l'interface. */
export const tr = (o) => (o == null ? '' : typeof o === 'string' ? o : o[lang()] ?? o.fr);

/** Traduction d'un mot du lexique. */
export const gloss = (w) => (lang() === 'en' ? w.en || w.fr : w.fr);

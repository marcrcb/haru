// Protection de la progression, qui ne vit que sur ce téléphone :
// 1. stockage « persistant » demandé au navigateur (il ne l'efface plus de lui-même quand la place manque) ;
// 2. copie de secours dans une seconde mémoire du navigateur (IndexedDB), plus une copie par jour sur 7 jours :
//    si la mémoire principale est vidée ou abîmée, la progression revient toute seule au lancement ;
// 3. rappel hebdomadaire de faire une sauvegarde hors du téléphone (fichier partagé vers Drive, e-mail, Fichiers…).
import * as store from './store.js';

const DB = 'haru';
const OS = 'copies';
const KEEP_DAYS = 7;
export const REMIND_EVERY = 7; // jours entre deux rappels de sauvegarde

function open() {
  return new Promise((ok, ko) => {
    if (typeof indexedDB === 'undefined') return ko(new Error('no idb'));
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(OS);
    r.onsuccess = () => ok(r.result);
    r.onerror = () => ko(r.error);
  });
}
async function tx(mode, fn) {
  const db = await open();
  return new Promise((ok, ko) => {
    const t = db.transaction(OS, mode);
    const res = fn(t.objectStore(OS));
    t.oncomplete = () => { db.close(); ok(res?.result); };
    t.onerror = () => { db.close(); ko(t.error); };
  });
}
const put = (k, v) => tx('readwrite', (s) => s.put(v, k));
const getK = (k) => tx('readonly', (s) => s.get(k));
const keys = () => tx('readonly', (s) => s.getAllKeys());
const del = (k) => tx('readwrite', (s) => s.delete(k));

/** Quantité d'apprentissage d'une sauvegarde (pour choisir la plus avancée). */
export function weight(root) {
  if (!root?.courses) return 0;
  return Object.values(root.courses).reduce((n, c) => n + (c.xp || 0) + Object.keys(c.srs || {}).length + Object.keys(c.road || {}).length, 0);
}

// ---------- Copie de secours ----------
let timer = 0;
/** Recopie la progression (appelé après chaque enregistrement, regroupé toutes les 2 s). */
export function mirror() {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    try {
      const raw = store.exportAll();
      const root = JSON.parse(raw);
      if (!weight(root)) return; // rien d'appris : rien à protéger (et on n'écrase pas une bonne copie)
      const day = store.dayKey();
      await put('latest', { at: Date.now(), raw });
      await put(`day:${day}`, { at: Date.now(), raw });
      const old = (await keys()).filter((k) => String(k).startsWith('day:')).sort().slice(0, -KEEP_DAYS);
      for (const k of old) await del(k);
    } catch { /* navigation privée, quota… */ }
  }, 2000);
}

/** Copies disponibles, de la plus récente à la plus ancienne : [{ key, at, weight }]. */
export async function copies() {
  try {
    const ks = (await keys()).filter((k) => String(k).startsWith('day:')).sort().reverse();
    const out = [];
    for (const key of ks) {
      const c = await getK(key);
      if (c) out.push({ key, at: c.at, weight: weight(JSON.parse(c.raw)) });
    }
    return out;
  } catch { return []; }
}

/** Remet une copie du jour en place. */
export async function restoreCopy(key) {
  const c = await getK(key);
  store.importAll(JSON.parse(c.raw));
}

/**
 * Au lancement : si la mémoire principale a perdu la progression (vidée, abîmée) alors que la copie de secours
 * en contient davantage, on la remet. Renvoie true si la progression a été restaurée.
 */
export async function recover() {
  try {
    const c = await getK('latest');
    // seulement si la mémoire principale était vide au lancement : jamais pour écraser une progression (ni annuler une remise à zéro)
    if (!c || !store.startedFresh()) return false;
    const copy = JSON.parse(c.raw);
    if (weight(copy) <= weight(JSON.parse(store.exportAll()))) return false;
    store.importAll(copy);
    return true;
  } catch { return false; }
}

// ---------- Stockage persistant ----------
export async function persisted() {
  try { return !!(await navigator.storage?.persisted?.()); } catch { return false; }
}
/** Demande au navigateur de ne pas effacer les données de Haru (sans fenêtre sur Chrome et Safari). */
export async function protect() {
  try {
    if (!navigator.storage?.persist || (await navigator.storage.persisted())) return;
    await navigator.storage.persist();
  } catch { /* non pris en charge */ }
}

// ---------- Sauvegarde hors du téléphone ----------
const fileName = () => `haru-sauvegarde-${store.dayKey()}.json`;

/**
 * Sauvegarde dans un fichier : la feuille de partage du téléphone quand elle accepte les fichiers
 * (Drive, e-mail, Fichiers…), sinon un téléchargement. Renvoie true si la sauvegarde a été faite.
 */
export async function saveFile() {
  const raw = store.exportAll();
  const file = typeof File === 'function' ? new File([raw], fileName(), { type: 'application/json' }) : null;
  if (file && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Haru' });
      return done();
    } catch (e) {
      if (e?.name === 'AbortError') return false; // fermé sans choisir
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
  a.download = fileName();
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  return done();
}
function done() {
  const s = store.get().settings;
  s.lastBackup = store.dayKey();
  delete s.backupSnooze;
  store.save();
  return true;
}

const daysSince = (key) => (key ? store.dayNumber() - store.dayNumber(new Date(`${key}T12:00:00`)) : Infinity);
export const lastBackupDays = () => daysSince(store.get().settings.lastBackup);

/** Le rappel de sauvegarde est-il à montrer ? (assez de progression, pas de sauvegarde depuis une semaine) */
export function backupDue() {
  const s = store.get().settings;
  if (weight(JSON.parse(store.exportAll())) < 60) return false;
  if (daysSince(s.backupSnooze) < REMIND_EVERY) return false;
  return lastBackupDays() >= REMIND_EVERY;
}
export function snooze() {
  store.get().settings.backupSnooze = store.dayKey();
  store.save();
}

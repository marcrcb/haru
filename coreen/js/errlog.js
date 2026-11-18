// Journal des erreurs : les plantages survenus sur ce téléphone, gardés (20 au plus) pour pouvoir les signaler.
// Rien ne part sur Internet : le rapport se copie à la main depuis les réglages.
const KEY = 'haru.errors';
const MAX = 20;
let version = '';

export function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(-MAX))); } catch { /* stockage indisponible */ }
}
export function clear() {
  try { localStorage.removeItem(KEY); } catch { /* stockage indisponible */ }
}

export function log(msg, where = '') {
  const text = String(msg || 'Erreur inconnue').slice(0, 400);
  const list = read();
  const last = list[list.length - 1];
  // la même erreur répétée à la suite ne prend qu'une ligne
  if (last && last.msg === text && last.where === where) { last.n = (last.n || 1) + 1; last.at = Date.now(); return write(list); }
  list.push({ at: Date.now(), msg: text, where: String(where).slice(0, 200), screen: location.hash.slice(0, 80), v: version });
  write(list);
}

/** Version de l'application, notée avec chaque erreur. */
export const setVersion = (v) => { version = v; };

// Écoute dès le chargement de ce module (importé en premier : il voit aussi les erreurs des autres modules).
if (typeof addEventListener === 'function') {
  addEventListener('error', (e) => {
    if (!e.message) return; // ressource introuvable (image, son) : pas un plantage
    log(e.message, e.filename ? `${e.filename.replace(location.origin, '')}:${e.lineno}:${e.colno}` : '');
  });
  addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    if (r?.name === 'AbortError' || r?.name === 'NotAllowedError') return; // lecture du son interrompue, partage fermé…
    log(r?.message || r, (r?.stack || '').split('\n').slice(1, 2).join('').trim());
  });
}

/** Rapport à copier : version, appareil, puis les erreurs (les plus récentes en bas). */
export function report() {
  const list = read();
  const date = (t) => new Date(t).toISOString().replace('T', ' ').slice(0, 16);
  return [
    `Haru v${version} · ${navigator.userAgent}`,
    `Écran ${innerWidth}×${innerHeight} · ${matchMedia('(display-mode: standalone)').matches ? 'application installée' : 'navigateur'}`,
    '',
    ...list.map((e) => `${date(e.at)} ${e.screen || ''} (v${e.v})${e.n > 1 ? ` ×${e.n}` : ''}\n  ${e.msg}${e.where ? `\n  ${e.where}` : ''}`),
  ].join('\n');
}

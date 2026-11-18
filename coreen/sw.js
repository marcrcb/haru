// Service worker : met l'application en cache pour qu'elle fonctionne hors connexion.
// Changer VERSION à chaque mise à jour pour que les téléphones récupèrent les nouveaux fichiers.
const VERSION = 'haru-v78';
const AUDIO = 'haru-audio'; // voix enregistrées : gardées d'une version à l'autre (elles ne changent pas)
const REMINDER = 'haru-reminder'; // état du rappel quotidien, écrit par l'application (js/reminders.js)
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/ui.js',
  './js/store.js',
  './js/course.js',
  './js/hangul.js',
  './js/generator.js',
  './js/quiz.js',
  './js/peek.js',
  './js/review.js',
  './js/placement.js',
  './js/reminders.js',
  './js/audio-key.js',
  './js/story.js',
  './js/content/stories.js',
  './js/content/pictures.js',
  './js/games.js',
  './js/phrases.js',
  './js/road.js',
  './js/keyboard.js',
  './js/draw.js',
  './js/exam.js',
  './js/achievements.js',
  './js/speech.js',
  './js/content/roadmap.js',
  './js/lang/ko.js',
  './js/lang/ja.js',
  './js/lang/kana.js',
  './js/content/kanji.js',
  './js/content/concepts.js',
  './js/content/lexicon.js',
  './js/content/strings.js',
  './js/content/jamo.js',
  './js/content/guide.js',
  './js/content/guide.en.js',
  './js/content/guide.ja.js',
  './js/content/guide.ja.en.js',
  './js/content/guide.util.js',
  './js/content/guide.plus.js',
  './js/content/guide.adv.js',
  './js/content/guide.ja.plus.js',
  './js/content/guide.ja.adv.js',
  './js/content/awkward.js',
  './js/content/awkward.en.js',
  './js/content/guide.pron.js',
  './js/content/guide.ja.pron.js',
  './js/content/strokes.ko.js',
  './js/content/strokes.ja.js',
  './js/content/strokes.kanji.js',
  './fonts/nunito-latin.woff2',
  './icons/haru-icon.svg',
  './icons/haru-icon-192.png',
  './icons/haru-icon-512.png',
  './icons/haru-maskable-512.png',
  './icons/haru-apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== REMINDER && k !== AUDIO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Voix enregistrée : depuis le cache (sinon téléchargée une fois). Safari lit l'audio par morceaux (en-tête Range) :
// on renvoie alors le morceau demandé (réponse 206), sinon la lecture resterait muette.
async function voiceResponse(req) {
  const cache = await caches.open(AUDIO);
  let res = await cache.match(req.url);
  if (!res) {
    res = await fetch(req.url);
    if (!res.ok) return res;
    await cache.put(req.url, res.clone());
  }
  const range = req.headers.get('range');
  if (!range) return res;
  const buf = await res.arrayBuffer();
  const total = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const start = m[1] ? Number(m[1]) : 0;
  const end = m[2] ? Math.min(Number(m[2]), total - 1) : total - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: { 'Content-Type': 'audio/mpeg', 'Content-Range': `bytes ${start}-${end}/${total}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' },
  });
}

// Réseau d'abord (pour recevoir les mises à jour), cache en secours hors connexion.
// « no-cache » : le navigateur revalide chaque fichier auprès du serveur au lieu de resservir
// sa copie pendant 10 minutes, ce qui mélangeait anciens et nouveaux fichiers après une mise à jour.
self.addEventListener('fetch', (e) => {
  // Voix enregistrées : depuis le cache s'il y est, sinon téléchargées une fois puis gardées (écoute hors connexion).
  if (e.request.method === 'GET' && /\/audio\/[a-z]+\/[0-9a-f]{8}\.mp3$/.test(new URL(e.request.url).pathname)) {
    e.respondWith(voiceResponse(e.request));
    return;
  }
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request.url, { cache: 'no-cache' })
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'))),
  );
});

// ---------- Rappel quotidien ----------
// Le navigateur réveille ce script de temps en temps (application installée, Chrome sur Android).
// On prévient si l'heure choisie est passée, que l'objectif du jour n'est pas atteint
// et qu'aucun rappel n'a encore été envoyé aujourd'hui.
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

async function remind() {
  const cache = await caches.open(REMINDER);
  const res = await cache.match('./__reminder-state');
  if (!res) return;
  const s = await res.json();
  if (!s.on) return;
  const now = new Date();
  const today = dayKey(now);
  const [h, m] = String(s.at || '19:00').split(':').map(Number);
  if (now.getHours() * 60 + now.getMinutes() < h * 60 + (m || 0)) return;
  if (s.notified === today) return;
  const xp = s.day === today ? s.xp : 0; // l'état date peut-être d'hier : rien de fait aujourd'hui
  if (xp >= s.goal) return;
  const tx = s.texts || {};
  const body = xp > 0
    ? String(tx.left || '').replace('{n}', s.goal - xp)
    : s.day !== today && s.streak > 1 ? String(tx.streak || '').replace('{n}', s.streak) : tx.start || '';
  s.notified = today;
  await cache.put('./__reminder-state', new Response(JSON.stringify(s), { headers: { 'Content-Type': 'application/json' } }));
  await self.registration.showNotification(tx.title || 'Haru', {
    body, icon: 'icons/haru-icon-192.png', badge: 'icons/haru-icon-192.png', tag: 'haru-reminder', data: { url: './#/road' },
  });
}

self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'haru-reminder') e.waitUntil(remind());
});

// Toucher la notification ouvre l'application (ou la ramène au premier plan).
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const open = list.find((c) => 'focus' in c);
      return open ? open.focus() : self.clients.openWindow(e.notification.data?.url || './');
    }),
  );
});

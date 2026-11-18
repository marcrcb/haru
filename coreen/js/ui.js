// Petits outils d'interface : voix, sons, confettis, animations.
import { get } from './store.js';
import { course } from './course.js';
import { audioKey, audioHash } from './audio-key.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
/** Moment de la journée (ciel de la carte d'accueil) : matin, journée, soir ou nuit. */
export function skyTime(h = new Date().getHours()) {
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 18) return 'day';
  if (h >= 18 && h < 22) return 'evening';
  return 'night';
}
export const reducedMotion = () => !get().settings.motion || matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Synthèse vocale (langue du cours actif) ----------
// La voix vient du téléphone : on choisit la plus naturelle disponible pour la langue apprise.
/** Note de qualité : les voix « naturelles », « premium », « améliorées » ou en ligne sonnent bien moins robotiques. */
function quality(v) {
  const n = v.name.toLowerCase();
  let q = 0;
  if (/natural|neural|premium|wavenet|studio/.test(n)) q += 40;
  if (/enhanced|améliorée|online|network/.test(n)) q += 25;
  if (/google/.test(n)) q += 15;
  if (v.localService === false) q += 5;
  if (/compact|espeak|novelty|whisper|bad news|bells|zarvox|robot/.test(n)) q -= 60;
  return q;
}
let voiceCache = null;
const voicesFor = () => {
  if (!('speechSynthesis' in window)) return [];
  const tag = course().tts.toLowerCase();
  const all = speechSynthesis.getVoices().filter((v) => v.lang?.replace('_', '-').toLowerCase().startsWith(tag.slice(0, 2)));
  return all.sort((a, b) => quality(b) + (b.lang.replace('_', '-').toLowerCase() === tag ? 2 : 0) - quality(a) - (a.lang.replace('_', '-').toLowerCase() === tag ? 2 : 0));
};
function findVoice() {
  if (!('speechSynthesis' in window)) return null;
  const key = course().tts;
  if (voiceCache?.key === key) return voiceCache.v;
  const all = voicesFor();
  if (all.length) voiceCache = { key, v: all[0] };
  return all[0] || null;
}
if ('speechSynthesis' in window) {
  speechSynthesis.getVoices();
  speechSynthesis.addEventListener?.('voiceschanged', () => { voiceCache = null; });
}
export const canSpeak = () => 'speechSynthesis' in window;
export const hasVoice = () => !!findVoice();
/** La voix qui sera utilisée (pour l'afficher dans les réglages). */
export const currentVoice = () => findVoice();

let current = null; // garde une référence : sinon certains navigateurs coupent la voix en cours de route
let pending = 0;

// ---------- Voix naturelles (enregistrées) ----------
// audio/<langue>/index.json liste les enregistrements validés ; sans enregistrement, c'est la voix du téléphone.
// Désactivées pour l'instant : seule la voix du téléphone (synthèse vocale du navigateur ou du système) est utilisée.
// Remettre à true pour réactiver les enregistrements de audio/<langue>/.
export const NATURAL_VOICES = false;
const voiceIndex = {};
function loadVoices(id) {
  if (id in voiceIndex) return;
  if (!NATURAL_VOICES || typeof fetch === 'undefined') { voiceIndex[id] = new Set(); return; }
  voiceIndex[id] = null;
  fetch(`audio/${id}/index.json`)
    .then((r) => (r.ok ? r.json() : []))
    .then((list) => { voiceIndex[id] = new Set(list); })
    .catch(() => { voiceIndex[id] = new Set(); });
}
/** Charge à l'avance la liste des enregistrements de la langue apprise. */
export const preloadVoices = () => loadVoices(course().id);
/** Un enregistrement existe-t-il pour ce texte ? */
export function naturalUrl(text) {
  const id = course().id;
  loadVoices(id);
  if (get().settings.natural === false) return null;
  const h = audioHash(audioKey(text));
  return voiceIndex[id]?.has(h) ? `audio/${id}/${h}.mp3` : null;
}
/**
 * Phrase sans enregistrement entier (phrase générée) : on la découpe en morceaux enregistrés (mot avec sa
 * particule, verbe conjugué…), du plus long au plus court, pour les enchaîner. null s'il manque un morceau :
 * on ne mélange pas deux voix dans une même phrase.
 */
export function naturalChain(text) {
  const id = course().id;
  const idx = voiceIndex[id];
  if (!idx || get().settings.natural === false) return null;
  const pieces = String(text).normalize('NFC').split(/[\s.,?!。、？！~〜…]+/).filter(Boolean);
  const urls = [];
  for (const piece of pieces) {
    const ch = [...piece];
    let i = 0;
    while (i < ch.length) {
      let j = ch.length;
      // un morceau d'au moins deux signes, sauf s'il forme à lui seul un mot de la phrase
      for (; j > i; j--) {
        if (j - i < 2 && ch.length > 1) { j = i; break; }
        if (idx.has(audioHash(ch.slice(i, j).join('')))) break;
      }
      if (j <= i) return null;
      urls.push(`audio/${id}/${audioHash(ch.slice(i, j).join(''))}.mp3`);
      i = j;
    }
  }
  return urls.length > 1 ? urls : null;
}
// Un seul lecteur, réutilisé : sur iPhone, un lecteur débloqué par un premier toucher le reste ensuite.
let player = null;
let playing = false;
const voicePlayer = () => (player ||= typeof Audio === 'undefined' ? null : new Audio());
/** Coupe la voix en cours (enregistrement ou synthèse). */
export function stopSpeaking() {
  if (playing && player) player.pause();
  playing = false;
  clearTimeout(pending);
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
let last = { key: '', at: 0, slow: false };

/** Prononce un texte : voix enregistrée si elle existe, sinon voix du téléphone. Toucher deux fois de suite : plus lentement. */
export function speak(text, rate) {
  const key = audioKey(text);
  if (!key) return;
  const now = Date.now();
  const slow = last.key === key && now - last.at < 4000 && !last.slow;
  last = { key, at: now, slow };
  const url = naturalUrl(text);
  const chain = url ? null : naturalChain(text);
  if (!url && !chain) return ttsSpeak(text, rate, slow);
  const a = voicePlayer();
  if (!a) return ttsSpeak(text, rate, slow);
  const queue = chain ? chain.slice(1) : [];
  stopSpeaking();
  const turn = ++voiceTurn;
  let failed = false;
  const fallback = () => {
    if (failed || turn !== voiceTurn) return;
    failed = true;
    playing = false;
    ttsSpeak(text, rate, slow);
  };
  a.onerror = fallback;
  a.onended = () => {
    if (turn !== voiceTurn) return;
    if (!queue.length) { playing = false; return; }
    // morceau suivant, presque sans blanc (les enregistrements ont déjà un court silence)
    a.src = queue.shift();
    a.playbackRate = a.defaultPlaybackRate;
    const q = a.play();
    if (q) q.catch((e) => { if (e?.name !== 'AbortError') fallback(); });
  };
  a.src = url || chain[0];
  // vitesse du réglage (0,85 = vitesse naturelle de l'enregistrement), plus lente au deuxième toucher
  a.playbackRate = slow ? 0.72 : Math.max(0.7, Math.min(1.25, (rate ?? get().settings.rate) / 0.85));
  a.defaultPlaybackRate = a.playbackRate;
  a.preservesPitch = true;
  playing = true;
  const p = a.play();
  if (p) p.catch((e) => { if (e?.name !== 'AbortError') fallback(); });
}
let voiceTurn = 0;

function ttsSpeak(text, rate, slow = false) {
  if (!canSpeak()) return;
  if (player) { player.pause(); player = null; }
  clearTimeout(pending);
  const busy = speechSynthesis.speaking || speechSynthesis.pending;
  speechSynthesis.cancel();
  // Ponctuation de fin retirée (sinon certaines voix la prononcent), virgules gardées pour les pauses naturelles.
  const clean = String(text).replace(/[.?!。？！]+$/g, '').replace(/[.。]/g, ',').replace(/[?？!！~〜]/g, '').trim();
  if (!clean) return;
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = course().tts;
  const voice = findVoice();
  if (voice) u.voice = voice;
  // Les mots isolés, un peu plus posés, s'entendent mieux ; une vitesse trop lente sonne haché.
  const base = (rate ?? get().settings.rate) * (slow ? 0.75 : 1);
  const short = [...clean].length <= 2;
  u.rate = Math.max(0.6, Math.min(1.1, short ? base * 0.92 : base));
  u.pitch = 1;
  u.volume = 1;
  current = u;
  u.onend = () => { if (current === u) current = null; };
  // Juste après un « cancel », Chrome et Safari avalent parfois le début de la phrase : on laisse un court instant.
  const go = () => {
    if ('resume' in speechSynthesis) speechSynthesis.resume();
    speechSynthesis.speak(u);
  };
  if (busy) pending = setTimeout(go, 80);
  else go();
}

/** Prononce automatiquement (si la lecture automatique est activée dans les réglages). */
export function autoSpeak(text) {
  if (get().settings.autoplay) speak(text);
}

// ---------- Sons discrets (générés, aucun fichier) ----------
let ctx;
function tone(freqs, dur = 0.12, type = 'sine', gain = 0.06) {
  if (!get().settings.sound) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    let t = ctx.currentTime;
    for (const f of freqs) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
      t += dur * 0.8;
    }
  } catch { /* audio indisponible */ }
}
export const sfx = {
  ok: () => tone([660, 880], 0.1),
  ko: () => tone([220, 180], 0.14, 'triangle', 0.05),
  tap: () => tone([520], 0.04, 'sine', 0.025),
  win: () => tone([523, 659, 784, 1047], 0.12),
};


// ---------- Retour visuel ----------
export function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.append(el);
  setTimeout(() => el.classList.add('out'), 2000);
  setTimeout(() => el.remove(), 2400);
}

/** Petite bulle « +5 XP » qui s'envole depuis un élément. */
export function floatXp(n, from) {
  const el = document.createElement('div');
  el.className = 'float-xp';
  el.textContent = `+${n} XP`;
  const r = from?.getBoundingClientRect?.() ?? { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
  el.style.left = r.left + r.width / 2 + 'px';
  el.style.top = r.top + 'px';
  document.body.append(el);
  setTimeout(() => el.remove(), 1100);
}

/** Petite gerbe de pastilles colorées autour d'un élément (bonne réponse). */
export function burst(el, n = 12) {
  if (reducedMotion() || !el) return;
  const r = el.getBoundingClientRect();
  const css = getComputedStyle(document.documentElement);
  const colors = ['--c-home', '--c-hangul', '--c-words', '--c-phrases', '--c-guide', '--gold'].map((v) => css.getPropertyValue(v).trim());
  for (let i = 0; i < n; i++) {
    const d = document.createElement('i');
    d.className = 'burst';
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 50 + Math.random() * 40;
    d.style.left = r.left + r.width / 2 - 5 + 'px';
    d.style.top = r.top + r.height / 2 - 5 + 'px';
    d.style.background = colors[i % colors.length];
    d.style.setProperty('--dx', Math.cos(a) * dist + 'px');
    d.style.setProperty('--dy', Math.sin(a) * dist + 'px');
    document.body.append(d);
    setTimeout(() => d.remove(), 750);
  }
}

/** Fenêtre de célébration (niveau, objectif…). */
export function celebrate({ glyph, title, text, button = 'Continuer', stamp = '' }) {
  const box = document.createElement('div');
  box.className = `celebrate ${stamp ? 'stamped' : ''}`;
  // stamp : un sceau à l'encre vermillon s'imprime sur la carte (fin de chapitre)
  const top = stamp
    ? `<div class="cel-stamp" aria-hidden="true"><span class="cel-stamp-ink kr">${[...stamp].map((c) => `<i>${esc(c)}</i>`).join('')}</span></div><div class="cel-chglyph kr">${esc(glyph)}</div>`
    : `<div class="cel-glyph kr">${esc(glyph)}</div>`;
  box.innerHTML = `<div class="cel-card" role="dialog" aria-modal="true">
    ${top}<h2>${esc(title)}</h2><p class="muted">${esc(text)}</p>
    <button class="btn primary">${esc(button)}</button></div>`;
  document.body.append(box);
  sfx.win();
  confetti();
  const close = () => {
    box.classList.add('out');
    setTimeout(() => box.remove(), 200);
  };
  box.querySelector('.btn').addEventListener('click', close);
  box.addEventListener('click', (e) => e.target === box && close());
}

export function confetti() {
  if (reducedMotion()) return;
  const c = document.createElement('canvas');
  c.className = 'confetti';
  const dpr = devicePixelRatio || 1;
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  document.body.append(c);
  const g = c.getContext('2d');
  g.scale(dpr, dpr);
  const css = getComputedStyle(document.documentElement);
  const colors = ['--accent', '--ok', '--gold', '--rose'].map((v) => css.getPropertyValue(v).trim() || '#888');
  const parts = Array.from({ length: 90 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 80,
    y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 9,
    vy: -Math.random() * 9 - 4,
    s: Math.random() * 6 + 4,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    c: colors[Math.floor(Math.random() * colors.length)],
  }));
  const t0 = performance.now();
  (function frame(t) {
    const life = (t - t0) / 1600;
    g.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += 0.25;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      g.save();
      g.globalAlpha = Math.max(0, 1 - life);
      g.translate(p.x, p.y);
      g.rotate(p.r);
      g.fillStyle = p.c;
      g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      g.restore();
    }
    if (life < 1) requestAnimationFrame(frame);
    else c.remove();
  })(t0);
}

/** Fait défiler un nombre de `from` à `to`. */
export function countUp(el, to, from = 0, ms = 700) {
  if (reducedMotion()) { el.textContent = to; return; }
  const t0 = performance.now();
  (function frame(t) {
    const k = Math.min(1, (t - t0) / ms);
    el.textContent = Math.round(from + (to - from) * (1 - (1 - k) ** 3));
    if (k < 1) requestAnimationFrame(frame);
  })(t0);
}

/** Rejoue une animation CSS sur un élément. */
export function pulse(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

export const ICONS = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  learn: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>',
  phrase: '<svg viewBox="0 0 24 24"><path d="M4 5h16v10H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  stats: '<svg viewBox="0 0 24 24"><path d="M5 20V11M12 20V4M19 20v-6"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  sound: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M12 22c4 0 7-2.8 7-6.8 0-3.6-2.4-6-4-8.2-.4 2-1.4 3.2-2.6 3.8C12.6 7.6 11 4.6 8.6 2.5 8.8 6 5 9 5 15.2 5 19.2 8 22 12 22z"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24"><path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
};

/** Petits dessins à l'encre pour les états vides (pinceau, pousse). */
export function emptyArt(kind) {
  const art = {
    // pinceau posé, une goutte d'encre
    xp: '<path d="M14 44c8-2 18-10 26-22l4 4C36 38 26 46 16 48z"/><path d="M40 22l6-6 4 4-6 6"/><circle cx="12" cy="50" r="2.5"/>',
    // pousse qui sort de terre
    words: '<path d="M8 50h48"/><path d="M32 50V30"/><path d="M32 34c-2-8-9-12-16-11 1 8 8 12 16 11z"/><path d="M32 30c2-8 9-12 16-11-1 8-8 12-16 11z"/>',
    // pile de cartes
    cards: '<rect x="12" y="18" width="30" height="34" rx="4"/><path d="M20 12h26a4 4 0 0 1 4 4v30"/>',
    // carnet ouvert
    book: '<path d="M8 16c8-3 16-3 24 2v34c-8-5-16-5-24-2z"/><path d="M56 16c-8-3-16-3-24 2v34c8-5 16-5 24-2z"/>',
    // sceau « fini »
    done: '<circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="15"/><path d="M24 32l6 6 11-12"/>',
  }[kind];
  return `<svg class="ink-art" viewBox="0 0 64 64" aria-hidden="true">${art}</svg>`;
}

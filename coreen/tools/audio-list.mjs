// Liste des textes à enregistrer (voix naturelles) pour chaque langue : mots, lettres, kanji, exemples du guide, histoires,
// phrases « décalées » (liste fixe) et morceaux des phrases générées (l'application les enchaîne, voir ui.js).
// Sortie : JSON { ko: [{ key, say }], ja: [...] } sur la sortie standard.
//   key : texte tel que l'application le prononce (speak) ; text : texte donné à la synthèse (écriture d'origine) ;
//   say : prononciation attendue, pour le contrôle par reconnaissance vocale (lecture en kana pour le japonais).
// Usage : node tools/audio-list.mjs > /tmp/audio-list.json
import { KO } from '../js/lang/ko.js';
import { JA } from '../js/lang/ja.js';
import { audioKey } from '../js/audio-key.js';
import { generate } from '../js/generator.js';
import { THEMES } from '../js/content/concepts.js';
import { phraseTokens } from './phrase-tokens.mjs';

let STORIES = {};
try { ({ STORIES } = await import('../js/content/stories.js')); } catch { /* pas encore d'histoires */ }

const kana = (s) => /^[぀-ヿー・、。！？ 　]+$/.test(s);

function list(C) {
  const out = new Map();
  const add = (key, say = key) => {
    const k = audioKey(key);
    if (k && !out.has(k)) out.set(k, { key: k, text: String(key).trim(), say: String(say).trim() });
  };
  const ja = C.id === 'ja';
  for (const w of C.words) add(w.tl, ja ? w.r || w.tl : w.tl);
  for (const set of Object.values(C.script.sets)) for (const x of set.items) add(x.say);
  for (const g of [...(C.guide.fr || []), ...(C.guide.en || [])]) {
    for (const b of g.blocks || []) for (const [tl, , pr] of b.ex || []) add(tl, ja && pr && kana(pr) ? pr : tl);
  }
  for (const s of STORIES[C.id] || []) for (const l of s.lines) add(l.tl, ja && l.r ? l.r : l.tl);
  if (C.testVoice) add(C.testVoice);
  // Phrases générées : trop de combinaisons pour les enregistrer en entier ; on enregistre chaque morceau
  // (mot avec sa particule, verbe conjugué…) en tirant beaucoup de phrases avec les critères de l'application.
  let seed = 12345;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  for (let i = 0; i < 60000; i++) {
    const awk = i % 20 === 0;
    const p = generate({
      mood: awk ? 'awkward' : 'normal', level: String(pick([1, 2, 3])), theme: pick(['all', ...Object.keys(THEMES)]),
      tense: 'random', style: pick(C.styles), form: 'random', kind: 'random', subj: 'random', time: pick(['auto', 'yes', 'no']),
    }, rnd, C);
    if (awk) add(p.tl, ja && p.reading ? p.reading : p.tl); // phrase décalée : enregistrée en entier
    else for (const tk of phraseTokens(p, C.id)) add(tk.text, tk.say);
  }
  return [...out.values()];
}

process.stdout.write(JSON.stringify({ ko: list(KO), ja: list(JA) }));

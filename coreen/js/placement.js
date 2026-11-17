// Test de niveau : quelqu'un qui sait déjà lire l'alphabet (ou qui a des bases) commence plus loin dans le parcours.
// Le test ne fait pas de cadeau : réussi, il valide les premiers chapitres ; raté, on commence au début, sans perte.
import { $, $$, esc, shuffle, sfx } from './ui.js';
import * as store from './store.js';
import { course, t, tr } from './course.js';
import { runQuiz, letterQuestion, syllableQuestion, wordQuestion } from './quiz.js';
import { roadState, skipChapters } from './road.js';
import { maxErrors } from './exam.js';

const PASS = 0.8;

/** Lettres de l'alphabet (sans les kanji), pour le test « je sais lire ». */
function letters() {
  return Object.values(course().script.sets).filter((s) => s.kind !== 'kanji' && !s.hidden).flatMap((s) => s.items);
}

/** Mots du chapitre 2 (Premiers pas), pour le test « j'ai des bases ». */
function basicWords() {
  const R = roadState();
  const ch = R.chapters[1];
  const themes = new Set(ch.list.flatMap((u) => u.steps.map((s) => s.theme).filter(Boolean)));
  return course().words.filter((w) => themes.has(w.t));
}

function questionsFor(kind) {
  const L = letters();
  const part = (q, p) => ({ ...q, part: p });
  const read = shuffle(L).slice(0, kind === 'basics' ? 4 : 8).map((x) => part(letterQuestion(x, 'read', L), 'script'));
  const syl = Array.from({ length: kind === 'basics' ? 2 : 4 }, () => part(syllableQuestion('read'), 'script'));
  const out = [...read, ...syl];
  if (kind === 'basics') {
    const ws = shuffle(basicWords()).slice(0, 10);
    ws.forEach((w, k) => out.push(part(wordQuestion(w, k % 2 ? 'fr2kr' : 'kr2fr', { pool: basicWords(), plain: true, track: false, intro: false }), 'basics')));
  }
  return out.map((q) => ({ ...q, learn: undefined, onAnswer: undefined }));
}

/** Écran du test : choix du test (depuis les Réglages), présentation, puis questions façon examen. */
export function placementScreen(el, q) {
  const C = course();
  const kind = q.k === 'basics' ? 'basics' : q.k === 'script' ? 'script' : null;
  const scriptName = tr(C.script.title);
  if (!kind) {
    el.innerHTML = `
      <div class="screen result exam-intro">
        <div class="exam-seal"><span class="kr">${C.id === 'ja' ? '試験' : '시험'}</span></div>
        <h2>${t('place.title')}</h2>
        <p class="muted">${t('place.intro')}</p>
        <div class="stack">
          <a class="btn primary big" href="#/placement?k=script">${t('place.script', { script: scriptName })}</a>
          <a class="btn ghost big" href="#/placement?k=basics">${t('place.basics')}</a>
          <a class="btn ghost" href="#/road">${t('road.back')}</a>
        </div>
      </div>`;
    return;
  }
  const questions = questionsFor(kind);
  el.innerHTML = `
    <div class="screen result exam-intro">
      <div class="exam-seal"><span class="kr">${C.id === 'ja' ? '試験' : '시험'}</span></div>
      <span class="eyebrow">${t('place.title')}</span>
      <h2>${kind === 'basics' ? t('place.basics') : t('place.script', { script: scriptName })}</h2>
      <p class="muted">${kind === 'basics' ? t('place.basicsIntro') : t('place.scriptIntro', { script: scriptName })}</p>
      <ul class="exam-rules">
        <li><b>${questions.length}</b><span>${t('exam.rQuestions')}</span></li>
        <li><b>${maxErrors(questions.length, PASS)}</b><span>${t('exam.rErrors')}</span></li>
        <li><b>0</b><span>${t('exam.rHints')}</span></li>
      </ul>
      <div class="stack">
        <button class="btn primary big start">${t('place.start')}</button>
        <a class="btn ghost" href="#/road">${t('place.skip')}</a>
      </div>
    </div>`;
  $('.start', el).addEventListener('click', () => {
    sfx.tap();
    // Score par partie : l'alphabet seul peut suffire à passer le chapitre 1
    const score = { script: [0, 0], basics: [0, 0] };
    const qs = questions.map((x) => ({ ...x, onAnswer: (ok) => { score[x.part][1]++; if (ok) score[x.part][0]++; } }));
    const exam = {
      pass: PASS,
      onEnd(pct, passed) {
        const okScript = score.script[1] && score.script[0] >= Math.ceil(score.script[1] * PASS - 1e-9);
        const okBasics = kind === 'basics' && passed && okScript;
        const n = okBasics ? 2 : okScript ? 1 : 0;
        if (n) skipChapters(n);
        store.get().road.placed = true;
        store.save();
        exam.passText = t(n === 2 ? 'place.done2' : 'place.done1');
        exam.failText = n === 1 ? t('place.done1') : t('place.fail');
        return 0;
      },
    };
    runQuiz(el, { questions: qs, title: t('place.title'), again: () => placementScreen(el, q), exam });
  });
}

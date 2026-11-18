// Histoires : contenu complet, furigana sur chaque kanji, questions valides, un module par chapitre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STORIES } from '../js/content/stories.js';
import { ROADMAP, CHAPTERS } from '../js/content/roadmap.js';

test('une histoire par chapitre, du 2 au 17, dans chaque langue', () => {
  for (const c of ['ko', 'ja']) {
    assert.deepEqual(STORIES[c].map((s) => s.ch), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], c);
    assert.equal(new Set(STORIES[c].map((s) => s.id)).size, STORIES[c].length, `${c} : identifiants uniques`);
  }
});

test('chaque réplique est complète, chaque question a une bonne réponse et des leurres', () => {
  for (const c of ['ko', 'ja']) {
    for (const s of STORIES[c]) {
      assert.ok(s.title.fr && s.title.en && s.sub.fr && s.sub.en, `${s.id} : titre`);
      assert.ok(s.lines.length >= 6, `${s.id} : au moins 6 répliques`);
      for (const l of s.lines) assert.ok(l.tl && l.fr && l.en, `${s.id} : ${l.src}`);
      assert.ok(s.questions.length >= 3, `${s.id} : questions`);
      for (const q of s.questions) {
        assert.ok(q.q.fr && q.q.en && q.answers.length >= 3, `${s.id} : ${q.q.fr}`);
        assert.equal(new Set(q.answers.map((a) => a.fr)).size, q.answers.length, `${s.id} : réponses distinctes`);
      }
    }
  }
});

test('japonais : chaque kanji a sa lecture (furigana), aucun crochet ne reste dans le texte', () => {
  for (const s of STORIES.ja) {
    for (const l of s.lines) {
      const bare = l.src.replace(/[一-鿿々〆ヶ]+\[[^\]]+\]/g, '');
      // les noms des interlocuteurs ne sont pas dans le texte ; la narration et les répliques, si
      assert.doesNotMatch(bare, /[一-鿿々]/, `${s.id} : kanji sans lecture dans « ${l.src} »`);
      assert.doesNotMatch(l.tl, /[[\]]/, `${s.id} : ${l.tl}`);
      assert.match(l.r, /^[぀-ヿー！？、。「」…　 A-Za-z0-9]+$/, `${s.id} : lecture en kana de « ${l.tl} » : ${l.r}`);
    }
  }
});

test('chaque histoire est un module à la fin de son chapitre, sans examen', () => {
  for (const c of ['ko', 'ja']) {
    for (const s of STORIES[c]) {
      const id = `${c}st${s.ch}`;
      const chapter = CHAPTERS[c][s.ch - 1];
      assert.equal(chapter.units.at(-1), id, `${id} en fin de chapitre ${s.ch}`);
      const u = ROADMAP[c].find((x) => x.id === id);
      assert.ok(u && u.noExam && u.steps[0].kind === 'story' && u.steps[0].story === s.id, id);
    }
  }
});

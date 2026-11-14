import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchSpokenIn, koSounds } from '../js/speech.js';
import { KO } from '../js/lang/ko.js';
import { JA } from '../js/lang/ja.js';

const ok = (C, heard, want) => matchSpokenIn(C, [heard], [want].flat()).ok;

test('voix (coréen) : ce qui se prononce pareil est accepté', () => {
  assert.deepEqual(koSounds('개'), koSounds('게'));
  assert.ok(ok(KO, '게', '개'));
  assert.ok(ok(KO, '가치', '같이'));
  assert.ok(ok(KO, '안녕하세요.', '안녕하세요'));
  assert.ok(ok(KO, '사과요', '사과'));
  assert.ok(ok(KO, '3', '삼'));
  assert.ok(ok(KO, '3', '셋'));
  assert.ok(ok(KO, '학교', '학꾜'));
  assert.ok(ok(KO, '감사합니다', '감사함니다'));
  assert.ok(!ok(KO, '물', '불'));
  assert.ok(!ok(KO, '사과', '사람'));
  assert.ok(!ok(KO, '고양이', '강아지'));
});

test('voix (japonais) : kanji, chiffres et kana', () => {
  const w = JA.words.find((x) => x.tl === '水');
  if (w) assert.ok(ok(JA, '水', [w.r, w.tl]));
  const m = JA.words.find((x) => x.r === 'みず');
  assert.ok(ok(JA, 'お水', m ? [m.r, m.tl] : ['みず']));
  assert.ok(ok(JA, '3', 'さん'));
  assert.ok(ok(JA, 'ありがとうございます。', 'ありがとうございます'));
  assert.ok(!ok(JA, 'いぬ', 'ねこ'));
});

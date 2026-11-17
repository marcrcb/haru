// Répétition espacée (version 2) : intervalles longs, pas de montée en avance, conversion des anciennes progressions.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as store from '../js/store.js';

const today = () => store.dayNumber();
const card = (id) => store.get().srs[id];

test('un mot nouveau réussi passe en boîte 1, à revoir demain', () => {
  store.selectCourse('ko');
  store.review('t-new', true);
  assert.equal(card('t-new').b, 1);
  assert.equal(card('t-new').due, today() + 1);
});

test('réussir plusieurs fois le même jour ne fait pas monter plus haut', () => {
  store.review('t-same', true);
  store.review('t-same', true);
  store.review('t-same', true);
  assert.equal(card('t-same').b, 1);
  assert.equal(card('t-same').s, 3);
  assert.ok(store.isRetained('t-same'), 'deux bonnes réponses d’affilée suffisent pour « retenu »');
  assert.ok(!store.isMastered('t-same'));
});

test('une révision à échéance fait monter d’une boîte, avec des intervalles de plus en plus longs', () => {
  store.review('t-due', true);
  const gaps = [];
  for (let k = 0; k < 7; k++) {
    card('t-due').due = today(); // la révision est arrivée
    store.review('t-due', true);
    gaps.push(card('t-due').due - today());
  }
  assert.deepEqual(gaps, [3, 7, 16, 35, 90, 180, 180]);
  assert.ok(store.isMastered('t-due'));
});

test('une faute fait redescendre de deux boîtes et revient tout de suite en révision', () => {
  store.review('t-ko', true);
  for (let k = 0; k < 3; k++) { card('t-ko').due = today(); store.review('t-ko', true); }
  assert.equal(card('t-ko').b, 4);
  store.review('t-ko', false);
  assert.equal(card('t-ko').b, 2);
  assert.equal(card('t-ko').s, 0);
  assert.equal(card('t-ko').err, 1);
  assert.equal(card('t-ko').due, today() + 3);
  store.review('t-ko', false);
  assert.equal(card('t-ko').b, 0);
  assert.equal(card('t-ko').due, today());
});

test('les anciennes progressions sont converties une seule fois, sans rien perdre', () => {
  const r = store.normalize({ v: 2, settings: { course: 'ko' }, courses: { ko: { srs: { a: { b: 5, due: 10, ok: 5, ko: 0 }, z: { b: 1, due: 3, ok: 1, ko: 2, err: 1 } } } } });
  const { a, z } = r.courses.ko.srs;
  assert.equal(r.courses.ko.srsV, 2);
  assert.deepEqual([a.b, a.s, a.due], [4, 5, 10]);
  assert.deepEqual([z.b, z.s, z.err], [1, 0, 1]);
  const again = store.normalize(r); // déjà converti : inchangé
  assert.equal(again.courses.ko.srs.a.b, 4);
  assert.equal(store.normalize({ v: 2, courses: {} }).courses.ja.srsV, 2, 'nouveau cours : déjà en version 2');
});

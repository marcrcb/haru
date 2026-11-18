// Parcours : chapitres, modules et étapes de difficulté croissante, examens de module et examen final.
import { $, $$, esc, sfx, celebrate, ICONS, skyTime } from './ui.js';
import * as store from './store.js';
import { backupDue, saveFile, snooze } from './backup.js';
import { course, t, tr, lang } from './course.js';
import { ALL_THEMES, themeGlyph, themeShort } from './content/lexicon.js';
import { ROADMAP, CHAPTERS } from './content/roadmap.js';
import { reviewCount } from './review.js';
import { STORIES } from './content/stories.js';

const storyOf = (id) => (STORIES[course().id] || []).find((s) => s.id === id);

export const roadUnits = () => ROADMAP[course().id] || [];
export const roadChapters = () => CHAPTERS[course().id] || [];
export const findStep = (id) => roadUnits().flatMap((u) => u.steps).find((s) => s.id === id);
/** Avancement d'une étape dans le parcours, de 0 (premier module) à 1 (dernier) : sert à durcir les exercices. */
export function stepDepth(id) {
  const units = roadUnits();
  const k = units.findIndex((u) => u.steps.some((s) => s.id === id));
  return k < 0 || units.length < 2 ? 0 : k / (units.length - 1);
}

const UNIT_BONUS = 15; // XP offerts à la fin d'un module

// Repères officiels (indicatifs) : niveau du CECR et examen correspondant, chapitre par chapitre.
const LEVEL_BANDS = {
  ko: [[1, 'Pré-A1'], [3, 'A1 · TOPIK 1'], [3, 'A2 · TOPIK 2'], [4, 'A2+ · TOPIK 2'], [3, '→ B1 · TOPIK 3']],
  ja: [[1, 'Pré-A1'], [3, 'A1 · JLPT N5'], [3, 'A2 · JLPT N4'], [4, 'A2+ · JLPT N4'], [3, '→ B1 · JLPT N3']],
};
/** Repère officiel du chapitre k (0 = premier). */
export function chapterLevel(k) {
  let n = 0;
  for (const [len, label] of LEVEL_BANDS[course().id] || []) {
    n += len;
    if (k < n) return label;
  }
  return '';
}
/** Niveau atteint (dernier palier dont tous les chapitres sont terminés) et palier en cours avec sa progression. */
export function officialLevel(R = roadState()) {
  let k = 0;
  let reached = null;
  for (const [len, label] of LEVEL_BANDS[course().id] || []) {
    const chs = R.chapters.slice(k, k + len);
    k += len;
    const units = chs.flatMap((c) => c.list);
    const done = units.filter((u) => u.complete).length;
    if (units.length && done === units.length) { reached = label; continue; }
    return { reached, next: label, done, total: units.length, from: k - len + 1, to: k };
  }
  return { reached, next: null, done: 0, total: 0 };
}

/**
 * Test de niveau réussi : les n premiers chapitres sont validés (étapes, objectifs, examens),
 * sans célébration ni XP, et la suite s'ouvre.
 */
export function skipChapters(n) {
  const st = store.get();
  st.road ||= {};
  st.read ||= {};
  st.exams ||= {};
  const R = roadState();
  R.chapters.slice(0, n).forEach((c) => {
    c.list.forEach((u) => {
      u.steps.forEach((s) => {
        if (s.kind === 'lesson') st.read[s.lesson] ||= 1;
        else if (s.kind === 'pairs') { st.best ||= {}; st.best.pairs ||= 60000; }
        else st.road[s.id] = Math.max(st.road[s.id] || 0, 1);
      });
      st.exams[u.id] = Math.max(st.exams[u.id] || 0, store.EXAM_PASS);
      st.road[`bonus:${u.id}`] = true;
    });
    st.road[`chdone:${c.id}`] = true;
    delete openChapters[c.id];
  });
  store.save();
}
const LOCK = '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

const lessons = () => course().guide[lang()] || course().guide.fr;

// Étape « objectif » : retenir 60 % des mots d'un thème (réussis au moins deux fois d'affilée).
const GOAL_RATIO = 0.6;
function goal(theme, st = store.get()) {
  const ws = course().words.filter((w) => w.t === theme);
  return { n: Math.min(Math.ceil(ws.length * GOAL_RATIO), ws.filter((w) => store.retained(st.srs?.[w.id])).length), total: Math.ceil(ws.length * GOAL_RATIO) };
}

/** Meilleur score d'une étape (en %) : les leçons et les paires faites valent 100 %, l'objectif suit sa progression. */
export function stepScore(s, st = store.get()) {
  if (s.kind === 'lesson' || s.kind === 'pairs') return stepDone(s, st) ? 100 : 0;
  if (s.kind === 'mastery') { const g = goal(s.theme, st); return st.road?.[s.id] ? 100 : g.total ? Math.round((Math.min(g.n, g.total) / g.total) * 100) : 0; }
  const v = st.score?.[s.id];
  if (v != null) return v;
  const old = st.road?.[s.id] || 0; // anciennes étoiles (1 à 3) : score approché
  return old >= 3 ? 90 : old === 2 ? 70 : old ? 60 : 0;
}

/** Une étape est-elle terminée ? Les leçons, les paires et le défi se lisent dans la progression existante. */
export function stepDone(s, st = store.get()) {
  if (s.kind === 'lesson') return !!st.read?.[s.lesson];
  if (s.kind === 'pairs') return !!st.best?.pairs;
  if (s.kind === 'mastery') { const g = goal(s.theme, st); return !!st.road?.[s.id] || (g.total > 0 && g.n >= g.total); }
  return !!st.road?.[s.id];
}

/** Titre, type, pastille et adresse d'une étape. */
export function stepInfo(s) {
  const C = course();
  const ja = C.id === 'ja';
  const q = `step=${s.id}`;
  if (s.kind === 'lesson') {
    const g = lessons().find((x) => x.id === s.lesson);
    return { title: g?.title || s.lesson, type: t('road.lesson'), glyph: g?.glyph || '?', href: `#/guide?id=${s.lesson}&${q}` };
  }
  if (s.kind === 'script' || ((s.kind === 'type' || s.kind === 'speak') && s.set)) {
    const set = C.script.sets[s.set];
    const title = set ? tr(set.label) : s.set === 'syllables' ? tr(C.script.syllableLabel) : t('script.words');
    const glyph = set ? set.items[0].j : s.set === 'syllables' ? C.script.syllableSample.slice(0, 2) : ja ? 'さかな' : '사과';
    if (s.kind === 'type') return { title, type: s.set === 'words' ? t('road.dictation') : t('road.type'), glyph, href: `#/hquiz?set=${s.set}&mode=type&${q}` };
    if (s.kind === 'speak') return { title, type: t('road.speak'), glyph, href: `#/hquiz?set=${s.set}&mode=speak&${q}` };
    return { title, type: t('road.quiz'), glyph, href: `#/hquiz?set=${s.set}&${q}` };
  }
  if (s.theme) {
    const glyph = themeGlyph(s.theme, ja);
    const title = themeShort(tr(ALL_THEMES[s.theme]));
    if (s.kind === 'mastery') return { title, type: t('road.goal', goal(s.theme)), glyph, href: `#/quiz?t=${s.theme}&${q}` };
    if (s.kind === 'cards') return { title, type: t('road.cards'), glyph, href: `#/cards?t=${s.theme}&${q}` };
    if (s.kind === 'type') return { title, type: t('road.type'), glyph, href: `#/quiz?t=${s.theme}&mode=type&${q}` };
    if (s.kind === 'dictation') return { title, type: t('road.dictation'), glyph, href: `#/quiz?t=${s.theme}&mode=dictation&${q}` };
    if (s.kind === 'speak') return { title, type: t('road.speak'), glyph, href: `#/quiz?t=${s.theme}&mode=speak&${q}` };
    return { title, type: t('road.quiz'), glyph, href: `#/quiz?t=${s.theme}&${q}` };
  }
  if (s.kind === 'story') {
    const st = storyOf(s.story);
    return { title: st ? tr(st.title) : s.story, type: t('road.story'), glyph: ja ? '話' : '이야기', href: `#/story?id=${s.story}&${q}` };
  }
  if (s.kind === 'phrase') return { title: tr(s.title), type: t('road.phrases'), glyph: ja ? '文' : '문장', href: `#/rphrase?${q}` };
  if (s.kind === 'ptype') return { title: tr(s.title), type: t('road.ptype'), glyph: ja ? '作文' : '작문', href: `#/rphrase?${q}` };
  return { title: t('title.pairs'), type: t('road.game'), glyph: ja ? 'ペア' : '짝', href: `#/pairs?${q}` };
}

/** État du parcours : modules (ouverts ou non, étapes faites, examen), chapitres et prochaine étape. */
export function roadState() {
  const st = store.get();
  const units = roadUnits().map((u) => {
    const steps = u.steps.map((s) => ({ ...s, done: stepDone(s, st), score: stepScore(s, st) }));
    const done = steps.filter((s) => s.done).length;
    const score = st.exams?.[u.id] || 0;
    // Un module n'est validé qu'une fois son examen réussi (toutes les étapes faites ne suffisent pas).
    const stepsDone = done === steps.length;
    const passed = u.noExam ? stepsDone : score >= store.EXAM_PASS; // module sans examen (histoire) : validé avec ses étapes
    return { ...u, steps, done, stepsDone, complete: stepsDone && passed, score, passed };
  });
  units.forEach((u, k) => {
    u.open = k === 0 || units[k - 1].complete || u.done > 0 || !!st.road?.[`open:${u.id}`];
    u.n = k + 1;
  });
  const cur = units.find((u) => u.open && !u.complete);
  const next = cur?.steps.find((s) => !s.done);
  const total = units.reduce((n, u) => n + u.steps.length, 0);
  const done = units.reduce((n, u) => n + u.done, 0);
  const chapters = roadChapters().map((c) => {
    const us = units.filter((u) => u.chapter === c.id);
    const complete = us.filter((u) => u.complete).length;
    return { ...c, list: us, complete, full: us.length > 0 && complete === us.length };
  });
  return { units, chapters, cur, next, total, done };
}

const OFFSETS = [-1, -0.4, 0.4, 1, 0.4, -0.4]; // tracé sinueux : jamais au centre, le texte se place du côté libre
const openChapters = {}; // chapitres dépliés à la main pendant la séance

/**
 * Carte « ciel du jour » : salutation dans la langue apprise, objectif du jour, série, module en cours,
 * et l'action du moment (réviser s'il y a des révisions, sinon continuer). Son ciel suit l'heure.
 */
function skyCard(R, due) {
  const C = course();
  const st = store.get();
  const time = skyTime();
  const today = store.todayXp();
  const left = Math.max(0, st.goal - today);
  const streak = store.streak();
  const date = new Date().toLocaleDateString(lang() === 'en' ? 'en-GB' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const next = R.next ? stepInfo(R.next).href : null;
  const action = due
    ? `<a class="sky-chip sky-go" href="#/quiz?mode=review">${t('sky.review')} <b>${due}</b> ›</a>`
    : next ? `<a class="sky-chip sky-go" href="${next}">${t(R.done ? 'road.continue' : 'road.start')} ›</a>` : '';
  const unit = R.cur ? R.units.indexOf(R.cur) + 1 : 0;
  return `
      <section class="sky sky-${time}" aria-label="${t('home.goal')}">
        <div class="sky-top">
          <div class="sky-text">
            <span class="sky-date">${esc(date)} · ${t('sky.' + time)}</span>
            <span class="sky-hello kr">${esc(C.greeting(new Date().getHours()))}</span>
            <span class="sky-sub">${left ? t('sky.left', { n: left }) : t('sky.done')}</span>
          </div>
          <div class="sky-ring" style="--p:${Math.min(100, Math.round((today / st.goal) * 100))}"><span><b>${today}</b>/${st.goal} XP</span></div>
        </div>
        <div class="sky-row">
          <span class="sky-chip" title="${t('progress.rest')}">${ICONS.flame}<b>${streak}</b> ${t(streak > 1 ? 'sky.days' : 'sky.oneday')}</span>
          ${unit ? `<span class="sky-chip">${t('sky.module')} <b>${unit}</b></span>` : ''}
          ${action}
        </div>
        <div class="sky-progress" title="${t('road.steps', { n: R.done, total: R.total })}"><i style="width:${(R.done / R.total) * 100}%"></i></div>
      </section>`;
}

/** Récompenses en attente (module validé, chapitre terminé) : annoncées une fois. Renvoie l'état à jour. */
export function roadRewards() {
  const st = store.get();
  st.road ||= {};
  const R = roadState();
  // (les anciennes clés « plat:… » valent aussi annonce déjà faite)
  const seen = (u) => st.road[`bonus:${u.id}`] || st.road[`plat:${u.id}`];
  const fresh = R.units.find((u) => u.complete && !seen(u));
  const ended = R.chapters.find((c) => c.full && !st.road[`chdone:${c.id}`] && !st.road[`platch:${c.id}`]);
  if (fresh) {
    // Examen réussi : module validé (le bonus d'XP est donné par l'examen lui-même)
    R.units.filter((u) => u.complete).forEach((u) => { st.road[`bonus:${u.id}`] = true; });
    store.save();
    celebrate({ glyph: fresh.glyph, title: t('road.unitComplete'), text: t('road.unitValid', { name: tr(fresh.title) }), button: t('continue') });
  } else if (ended) {
    R.chapters.filter((c) => c.full).forEach((c) => { st.road[`chdone:${c.id}`] = true; delete openChapters[c.id]; });
    store.save();
    celebrate({ glyph: ended.glyph, stamp: course().id === 'ja' ? '修了' : '수료', title: t('road.chDoneTitle'), text: t('road.chDoneText', { name: tr(ended.title) }), button: t('continue') });
  }
  return R;
}

export function roadScreen(el) {
  const st = store.get();
  const C = course();
  const R = roadRewards();

  const ja = C.id === 'ja';
  const unitHtml = (u) => `
      <section class="ru ${u.open ? '' : 'locked'} ${u.complete ? 'complete' : ''}" style="--tc: ${u.color}" data-u="${u.id}">
        <div class="ru-stick"><header class="ru-head">
          <span class="ru-glyph kr">${esc(u.glyph)}</span>
          <div class="ru-text">
            <span class="ru-n">${t('road.unitN', { n: u.n, total: R.units.length })}${u.complete ? ` · ${t('road.validated')}` : ''}</span>
            <b>${esc(tr(u.title))}</b>
            <span class="ru-sub">${esc(tr(u.sub))}</span>
          </div>
          <span class="ru-count">${u.complete ? `<span class="seal-mark">${ja ? '済' : '완'}</span>` : u.open ? `${u.done} / ${u.steps.length}` : LOCK}</span>
        </header></div>
        ${u.open ? '' : `<div class="ru-lock"><span class="muted small">${t('road.locked')}</span><button class="btn small ghost ru-open">${t('road.unlock')}</button></div>`}
        <div class="ru-path">
          <svg class="ru-line" aria-hidden="true"></svg>
          ${u.steps.map((s, n) => {
            const info = stepInfo(s);
            const cur = R.next && s.id === R.next.id && u === R.cur;
            const x = OFFSETS[n % OFFSETS.length];
            const inner = `
              <span class="rn-btn kr ${info.glyph.length > 2 ? 'long' : ''}">${s.done ? `<span class="seal-mark">${ja ? '済' : '완'}</span>` : u.open ? esc(info.glyph) : LOCK}</span>
              <span class="rn-label"><b>${esc(info.title)}</b><span>${esc(info.type)}</span>${u.open ? `<span class="rn-score ${s.score === 100 ? 'full' : ''}" style="--p:${s.score}" role="img" aria-label="${t('step.scoreLabel', { n: s.score })}"><i></i></span>` : ''}${cur ? `<span class="rn-go">${R.done ? t('road.continue') : t('road.start')}</span>` : ''}</span>`;
            const cls = `rn ${x > 0 ? 'right' : 'left'} ${s.done ? 'done' : ''} ${cur ? 'cur' : ''}`;
            return u.open
              ? `<a class="${cls}" href="${info.href}" style="--x:${x}; --k:${n}">${inner}</a>`
              : `<div class="${cls}" style="--x:${x}; --k:${n}">${inner}</div>`;
          }).join('')}
          ${u.noExam ? '' : (() => {
            // Examen du module : accessible une fois toutes les étapes terminées
            const x = OFFSETS[u.steps.length % OFFSETS.length];
            const now = u === R.cur && u.stepsDone && !u.passed; // l'examen est la prochaine chose à faire
            const cls = `rn exam ${x > 0 ? 'right' : 'left'} ${u.passed ? 'done' : ''} ${u.stepsDone ? '' : 'wait'} ${now ? 'cur' : ''}`;
            const sub = u.passed ? t('exam.scoreDone') : u.score ? t('exam.scoreTry') : u.stepsDone ? t('exam.ready') : t('exam.locked');
            const inner = `
              <span class="rn-btn kr">${u.passed ? `<span class="seal-mark">${ja ? '合' : '합'}</span>` : u.stepsDone ? (ja ? '試験' : '시험') : LOCK}</span>
              <span class="rn-label"><b>${t('exam.node')}</b><span>${sub}</span>${u.stepsDone && !u.passed ? `<span class="rn-go">${t('exam.go')}</span>` : ''}</span>`;
            return u.stepsDone ? `<a class="${cls}" href="#/exam?u=${u.id}" style="--x:${x}; --k:${u.steps.length}">${inner}</a>` : `<div class="${cls}" style="--x:${x}">${inner}</div>`;
          })()}
        </div>
      </section>`;

  const fin = st.final || {};
  const due = reviewCount();
  el.innerHTML = `
    <div class="screen road">
      ${skyCard(R, due)}
      ${backupDue() ? `
      <div class="card safe-card" role="note">
        <span class="safe-seal kr" aria-hidden="true">${ja ? '保存' : '보관'}</span>
        <span class="safe-text"><b>${t('safe.cardTitle')}</b><span>${t('safe.cardText')}</span></span>
        <span class="safe-btns"><button class="btn small primary safe-go">${t('safe.save')}</button><button class="btn small ghost safe-later">${t('safe.later')}</button></span>
      </div>` : ''}
      ${!st.road?.placed && !R.chapters.some((c) => c.full) ? `
      <a class="card place-card" href="#/placement">
        <span class="place-seal kr">${ja ? '診断' : '진단'}</span>
        <span class="place-text"><b>${t('place.cardTitle', { lang: tr(C.name).toLowerCase() })}</b><span>${t('place.cardSub')}</span></span>
        <span class="place-go">${t('place.cardGo')}</span>
      </a>` : ''}
      ${R.chapters.map((c, k) => ({ c, k })).sort((a, b) => a.c.full - b.c.full || a.k - b.k).map(({ c, k }) => {
        const here = c.list.includes(R.cur) || (!R.cur && k === 0);
        const open = openChapters[c.id] ?? here;
        const full = c.full;
        const list = [...c.list.filter((u) => !u.complete), ...c.list.filter((u) => u.complete)];
        return `
      <details class="chapter ${full ? 'complete' : ''}" data-c="${c.id}" ${open ? 'open' : ''}>
        <summary class="ch-head">
          <span class="ch-glyph kr">${esc(c.glyph)}</span>
          <span class="ch-text">
            <span class="ch-n">${full ? `${t('road.chapterN', { n: k + 1 })} · ${t('road.chMastered')}` : t('road.chapterN', { n: k + 1 })}</span>
            <b>${esc(tr(c.title))}</b>
            <span class="ch-sub">${esc(tr(c.sub))}</span>
          </span>
          <span class="ch-count"><span class="ch-lvl">${esc(chapterLevel(k))}</span><b>${c.complete} / ${c.list.length}</b></span>
          <span class="ch-chev">›</span>
        </summary>
        <div class="ch-body">${list.map(unitHtml).join('')}</div>
      </details>`;
      }).join('')}
      ${R.done === R.total ? `<p class="center muted road-end">${t('road.allDone')}</p>` : ''}
      <a class="card final-card" href="#/exam?u=final">
        <span class="final-seal kr">${ja ? '総合' : '종합'}</span>
        <span class="final-text">
          <span class="eyebrow">${t('final.eyebrow')}</span>
          <b>${t('final.title')}</b>
          <span class="muted small">${fin.n ? t(fin.best >= 70 ? 'final.summaryOk' : 'final.summary', { n: fin.n }) : t('final.sub')}</span>
        </span>
        <span class="chev">›</span>
      </a>
    </div>`;

  requestAnimationFrame(() => requestAnimationFrame(() => $$('.mini-bar', el).forEach((b) => b.classList.add('go'))));

  // Rappel de sauvegarde : fait (ou remis à plus tard) → la carte s'efface
  const safe = $('.safe-card', el);
  const hideSafe = () => { safe.classList.add('out'); setTimeout(() => safe.remove(), 260); };
  $('.safe-go', el)?.addEventListener('click', async () => { if (await saveFile()) { sfx.win(); hideSafe(); } });
  $('.safe-later', el)?.addEventListener('click', () => { sfx.tap(); snooze(); hideSafe(); });
  $$('.ru-open', el).forEach((b) => b.addEventListener('click', () => {
    st.road[`open:${b.closest('.ru').dataset.u}`] = true;
    store.save();
    sfx.ok();
    roadScreen(el);
  }));

  // Tracé en pointillés entre les étapes, du bas d'un cercle au haut du suivant (sans passer sous les cercles ni les textes)
  function draw() {
    $$('.ru-path', el).forEach((path) => {
      const svg = $('.ru-line', path);
      const box = path.getBoundingClientRect();
      if (!box.width) return; // chapitre replié
      const pts = $$('.rn', path).map((r) => {
        const b = $('.rn-btn', r);
        // offsetTop/offsetLeft : positions stables, sans l'effet des animations d'apparition
        const x = r.offsetLeft + b.offsetLeft + b.offsetWidth / 2;
        const top = r.offsetTop + b.offsetTop;
        return { x, top, bottom: top + b.offsetHeight, done: r.classList.contains('done') };
      });
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      const GAP = 10;
      svg.innerHTML = pts.slice(1).map((p, i) => {
        const a = pts[i];
        const y1 = a.bottom + GAP;
        const y2 = p.top - GAP;
        if (y2 <= y1) return '';
        const bend = (y2 - y1) * 0.55;
        return `<path class="${a.done && p.done ? 'on' : ''}" d="M${a.x} ${y1} C${a.x} ${y1 + bend} ${p.x} ${y2 - bend} ${p.x} ${y2}"/>`;
      }).join('');
    });
  }
  draw();
  const onResize = () => (el.querySelector('.road') ? draw() : removeEventListener('resize', onResize));
  addEventListener('resize', onResize);
  document.fonts?.ready.then(() => el.querySelector('.road') && draw());
  // Seul un geste de l'utilisateur est retenu (l'ouverture automatique du chapitre en cours ne l'est pas),
  // pour qu'un chapitre terminé se replie ensuite de lui-même.
  $$('.chapter > summary', el).forEach((sm) => sm.addEventListener('click', () => { const d = sm.parentElement; openChapters[d.dataset.c] = !d.open; }));
  $$('.chapter', el).forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) draw();
  }));

  // On arrive directement sur l'étape en cours
  const cur = $('.rn.cur', el);
  if (cur && R.done) requestAnimationFrame(() => cur.scrollIntoView({ block: 'center' }));
}

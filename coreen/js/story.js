// Histoires : on lit réplique par réplique (voix, traduction à révéler, mots à toucher), puis on répond à quelques questions.
import { $, $$, esc, shuffle, sfx, speak, autoSpeak, canSpeak, ICONS } from './ui.js';
import { get } from './store.js';
import { course, t, tr } from './course.js';
import { runQuiz } from './quiz.js';
import { peekAttr } from './peek.js';
import { STORIES, PEEK } from './content/stories.js';

export const storyOf = (id) => (STORIES[course().id] || []).find((s) => s.id === id);

const KANJI = /([一-鿿々〆ヶ]+)\[([^\]]+)\]/g;
/** Un mot de la réplique, avec ses furigana (japonais) et son sens au toucher. */
function token(x, fix) {
  const html = esc(x.src).replace(KANJI, '<ruby>$1<rt>$2</rt></ruby>');
  return `<span${fix?.[x.w] ? ` data-peek="${esc(tr(fix[x.w]))}"` : peekAttr(x.w)}>${html}</span>`;
}

function lineHtml(l, i, fix) {
  const C = course();
  const roman = get().settings.roman;
  const ja = C.id === 'ja';
  // romanisation mot par mot (le japonais s'écrit sans espaces : sinon une seule longue chaîne)
  // particules は et へ en fin de mot : « wa » et « e » (彼は → kare wa, 公園へ → kōen e)
  const particle = (r) => r.replace(/(.)は([、。！？」]*)$/u, '$1わ$2').replace(/(.)へ([、。！？」]*)$/u, '$1え$2');
  const rom = roman ? (ja ? l.tokens.map((x) => C.romanize(particle(x.r))).join(' ') : C.romanize(l.tl)) : '';
  return `
    <li class="st-line ${l.who ? '' : 'narration'} ${l.who === '레오' || l.who === 'レオ' ? 'me' : ''}" style="--i:${i}">
      ${l.who ? `<span class="st-who kr">${esc(l.who)}</span>` : ''}
      <div class="st-bubble">
        <div class="st-tl kr ${ja ? 'has-ruby' : ''}">${l.tokens.map((x) => token(x, fix)).join(ja ? '' : ' ')}</div>
        ${rom ? `<div class="st-rom">${esc(rom)}</div>` : ''}
        <button class="reveal st-tr"><span class="blurred">${esc(tr(l))}</span><span class="reveal-label">${t('story.translate')}</span></button>
        ${canSpeak() ? `<button class="icon-btn st-say" data-i="${i}" aria-label="${t('listen')}">${ICONS.sound}</button>` : ''}
      </div>
    </li>`;
}

/** Écran d'une histoire. q.id : identifiant ; q.step : étape du parcours. */
export function storyScreen(el, q) {
  const s = storyOf(q.id);
  if (!s) { location.hash = '#/road'; return; }
  let shown = 1;
  el.innerHTML = `
    <div class="screen story">
      <div class="st-head">
        <span class="st-glyph kr">${esc(s.glyph)}</span>
        <div><span class="eyebrow">${t('story.eyebrow')}</span><h1>${esc(tr(s.title))}</h1><p class="muted small">${esc(tr(s.sub))}</p></div>
      </div>
      <p class="muted small st-help">${t('story.help')}</p>
      <ol class="st-lines"></ol>
      <div class="st-progress muted small"></div>
      <button class="btn primary big st-next"></button>
    </div>`;
  const list = $('.st-lines', el);
  const next = $('.st-next', el);
  function render(added) {
    list.innerHTML = s.lines.slice(0, shown).map((l, i) => lineHtml(l, i, PEEK[s.id])).join('');
    $('.st-progress', el).textContent = t('story.progress', { n: shown, total: s.lines.length });
    next.textContent = shown < s.lines.length ? t('story.next') : t('story.questions');
    if (added) {
      const last = list.lastElementChild;
      last?.classList.add('fresh');
      last?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      autoSpeak(s.lines[shown - 1].tl);
    }
  }
  list.addEventListener('click', (e) => {
    const say = e.target.closest('.st-say');
    if (say) return speak(s.lines[Number(say.dataset.i)].tl);
    const r = e.target.closest('.st-tr');
    if (r) { r.classList.add('shown'); sfx.tap(); }
  });
  next.addEventListener('click', () => {
    sfx.tap();
    if (shown < s.lines.length) { shown++; render(true); return; }
    quiz(el, s, q);
  });
  render(false);
  autoSpeak(s.lines[0].tl);
}

/** Questions de compréhension (le texte reste consultable : bouton « Relire » en fin de série). */
function quiz(el, s, q) {
  const questions = s.questions.map((x) => {
    const options = shuffle(x.answers.map((a, i) => ({ label: tr(a), ok: i === 0 })));
    return { prompt: `<span class="st-q">${esc(tr(x.q))}</span>`, sub: tr(s.title), options, correct: options.findIndex((o) => o.ok) };
  });
  runQuiz(el, {
    questions,
    title: tr(s.title),
    step: q.step,
    back: '#/road',
    again: () => storyScreen(el, q),
    againLabel: () => t('story.reread'),
  });
}

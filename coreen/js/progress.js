// Page de progrès (dans le profil) : XP par semaine, courbe des mots retenus, lettres et kanji maîtrisés.
import { $, $$, esc, emptyArt } from './ui.js';
import * as store from './store.js';
import { course, t, tr, lang } from './course.js';
import { letterId, kanjiId } from './review.js';

const WEEKS = 12;
const DAY = 86400000;

/** Lundi de la semaine d'une date (à midi, pour éviter les changements d'heure). */
function monday(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}
const fmt = (d, o) => d.toLocaleDateString(lang() === 'en' ? 'en-GB' : 'fr-FR', o);

/** Les WEEKS dernières semaines : { start, xp, words } (words : dernier relevé connu de la semaine, sinon null). */
export function weeks(st = store.get(), now = new Date()) {
  const first = monday(now);
  first.setDate(first.getDate() - (WEEKS - 1) * 7);
  const out = [];
  for (let w = 0; w < WEEKS; w++) {
    const start = new Date(first.getTime() + w * 7 * DAY);
    let xp = 0;
    let words = null;
    for (let i = 0; i < 7; i++) {
      const k = store.dayKey(new Date(start.getTime() + i * DAY));
      xp += st.days?.[k] || 0;
      if (st.hist?.[k]) words = st.hist[k][0];
    }
    out.push({ start, xp, words });
  }
  return out;
}

// ---------- Graphiques (SVG, une seule série chacun : le titre la nomme) ----------
const W = 320;
const H = 132;
const PAD = { l: 6, r: 6, t: 22, b: 20 };

function barChart(list) {
  const max = Math.max(...list.map((x) => x.xp), 1);
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const slot = iw / list.length;
  const bw = Math.min(18, slot - 6);
  const bars = list.map((x, i) => {
    const h = x.xp ? Math.max(4, (x.xp / max) * ih) : 0;
    const cx = PAD.l + slot * i + slot / 2;
    const y = PAD.t + ih - h;
    const r = Math.min(4, h / 2, bw / 2);
    // barre arrondie en haut seulement, posée sur la ligne de base
    const path = h ? `M${cx - bw / 2},${PAD.t + ih} V${y + r} Q${cx - bw / 2},${y} ${cx - bw / 2 + r},${y} H${cx + bw / 2 - r} Q${cx + bw / 2},${y} ${cx + bw / 2},${y + r} V${PAD.t + ih} Z` : '';
    const last = i === list.length - 1;
    return `<g class="pg-mark ${last ? 'now' : ''}" data-i="${i}">
      <rect class="pg-hit" x="${PAD.l + slot * i}" y="${PAD.t - 18}" width="${slot}" height="${ih + 18 + PAD.b}"/>
      ${path ? `<path class="pg-bar" d="${path}"/>` : `<rect class="pg-zero" x="${cx - bw / 2}" y="${PAD.t + ih - 1}" width="${bw}" height="2" rx="1"/>`}
      ${i % 3 === 2 || last ? `<text class="pg-x" x="${cx}" y="${H - 5}">${esc(fmt(x.start, { day: 'numeric', month: 'short' }))}</text>` : ''}
    </g>`;
  }).join('');
  return `<svg class="pg-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('pg.xpTitle')}">
    <line class="pg-base" x1="${PAD.l}" x2="${W - PAD.r}" y1="${PAD.t + ih + 0.5}" y2="${PAD.t + ih + 0.5}"/>${bars}</svg>`;
}

function lineChart(list) {
  const pts = list.map((x, i) => ({ ...x, i })).filter((x) => x.words != null);
  const max = Math.max(...pts.map((x) => x.words), 1);
  const min = Math.min(...pts.map((x) => x.words));
  const lo = Math.max(0, min - Math.ceil((max - min) * 0.2 + 1));
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const slot = iw / list.length;
  const X = (i) => PAD.l + slot * i + slot / 2;
  const Y = (v) => PAD.t + ih - ((v - lo) / Math.max(1, max - lo)) * ih;
  const d = pts.map((p, k) => `${k ? 'L' : 'M'}${X(p.i).toFixed(1)},${Y(p.words).toFixed(1)}`).join(' ');
  const area = `${d} L${X(pts[pts.length - 1].i).toFixed(1)},${PAD.t + ih} L${X(pts[0].i).toFixed(1)},${PAD.t + ih} Z`;
  return `<svg class="pg-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('pg.wordsTitle')}">
    <line class="pg-base" x1="${PAD.l}" x2="${W - PAD.r}" y1="${PAD.t + ih + 0.5}" y2="${PAD.t + ih + 0.5}"/>
    <path class="pg-area" d="${area}"/><path class="pg-line" d="${d}"/>
    ${list.map((x, i) => `<g class="pg-mark ${i === list.length - 1 ? 'now' : ''}" data-i="${i}"><rect class="pg-hit" x="${PAD.l + slot * i}" y="0" width="${slot}" height="${H}"/>
      ${x.words != null ? `<circle class="pg-dot" cx="${X(i)}" cy="${Y(x.words)}" r="4"/>` : ''}
      ${i % 3 === 2 || i === list.length - 1 ? `<text class="pg-x" x="${X(i)}" y="${H - 5}">${esc(fmt(x.start, { day: 'numeric', month: 'short' }))}</text>` : ''}</g>`).join('')}
  </svg>`;
}

/** Écriture : part des lettres (par série) et des kanji retenus. */
function scriptRows() {
  const C = course();
  const rows = [];
  let kanji = null;
  for (const set of Object.values(C.script.sets || {})) {
    if (set.kind === 'kanji') {
      kanji ||= new Map();
      for (const x of set.items || []) kanji.set(kanjiId(x), x);
      continue;
    }
    const ids = [...new Set((set.items || []).map((x) => letterId(x)))];
    if (!ids.length) continue;
    rows.push({ label: tr(set.label), sample: set.items[0].j, done: ids.filter((id) => store.isRetained(id)).length, total: ids.length });
  }
  if (kanji?.size) rows.push({ label: t('pg.kanji'), sample: '字', done: [...kanji.keys()].filter((id) => store.isRetained(id)).length, total: kanji.size });
  return rows;
}

/** Section « Ta progression » du profil. */
export function progressSection() {
  const list = weeks();
  const total = list.reduce((n, x) => n + x.xp, 0);
  const withWords = list.filter((x) => x.words != null);
  const rows = scriptRows();
  const week = (x) => t('pg.weekOf', { date: fmt(x.start, { day: 'numeric', month: 'long' }) });
  return `
      <h2>${t('pg.title')}</h2>
      <section class="card pg-card" data-kind="xp">
        <div class="pg-head"><b>${t('pg.xpTitle')}</b><span class="pg-read" aria-live="polite"><b>${list[list.length - 1].xp} XP</b> · ${t('pg.thisWeek')}</span></div>
        ${total ? barChart(list) : `<p class="pg-empty">${emptyArt('xp')}<span>${t('pg.xpEmpty')}</span></p>`}
        <table class="sr-only"><caption>${t('pg.xpTitle')}</caption>${list.map((x) => `<tr><th>${esc(week(x))}</th><td>${x.xp} XP</td></tr>`).join('')}</table>
      </section>
      <section class="card pg-card" data-kind="words">
        <div class="pg-head"><b>${t('pg.wordsTitle')}</b>${withWords.length ? `<span class="pg-read" aria-live="polite"><b>${withWords[withWords.length - 1].words}</b> · ${t('pg.now')}</span>` : ''}</div>
        ${withWords.length >= 2 ? lineChart(list) : `<p class="pg-empty">${emptyArt('words')}<span>${t('pg.wordsSoon')}</span></p>`}
        <table class="sr-only"><caption>${t('pg.wordsTitle')}</caption>${withWords.map((x) => `<tr><th>${esc(week(x))}</th><td>${x.words}</td></tr>`).join('')}</table>
      </section>
      <section class="card pg-card pg-script">
        <div class="pg-head"><b>${t('pg.scriptTitle', { name: tr(course().script.title) })}</b></div>
        ${rows.map((r) => `
        <div class="pg-row" role="img" aria-label="${esc(r.label)} : ${r.done} / ${r.total}">
          <span class="pg-glyph kr" aria-hidden="true">${esc(r.sample)}</span>
          <span class="pg-name">${esc(r.label)}</span>
          <span class="pg-meter"><i style="--w:${r.total ? r.done / r.total : 0}"></i></span>
          <span class="pg-n">${r.done}<span>/${r.total}</span></span>
        </div>`).join('')}
        <p class="muted small">${t('pg.scriptHelp')}</p>
      </section>`;
}

/** Toucher une semaine affiche sa valeur au-dessus du graphique. */
export function bindProgress(el) {
  const list = weeks();
  $$('.pg-card[data-kind]', el).forEach((card) => {
    const kind = card.dataset.kind;
    const read = $('.pg-read', card);
    if (!read) return;
    const show = (i) => {
      const x = list[i];
      const v = kind === 'xp' ? `${x.xp} XP` : x.words ?? '—';
      const when = i === list.length - 1 ? t(kind === 'xp' ? 'pg.thisWeek' : 'pg.now') : t('pg.weekOf', { date: fmt(x.start, { day: 'numeric', month: 'short' }) });
      read.innerHTML = `<b>${esc(String(v))}</b> · ${esc(when)}`;
      $$('.pg-mark', card).forEach((m) => m.classList.toggle('on', Number(m.dataset.i) === i));
    };
    $$('.pg-mark', card).forEach((m) => {
      m.addEventListener('pointerenter', () => show(Number(m.dataset.i)));
      m.addEventListener('click', () => show(Number(m.dataset.i)));
    });
    $('.pg-svg', card)?.addEventListener('pointerleave', () => show(list.length - 1));
  });
}

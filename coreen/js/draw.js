// Ordre des traits : démonstration animée d'un signe (détail d'une lettre dans l'onglet d'écriture).
import { reducedMotion } from './ui.js';
import { t } from './course.js';
import { HANGUL_STROKES } from './content/strokes.ko.js';
import { KANA_STROKES } from './content/strokes.ja.js';

const SIZE = 109;
let kanjiStrokes = null; // chargé à la demande (fichier volumineux)

/** Traits d'un signe (tableau de chemins SVG), ou null si on ne sait pas le tracer. */
export async function strokesOf(ch) {
  const d = HANGUL_STROKES[ch] || KANA_STROKES[ch];
  if (d) return d.split('|');
  if (/[一-龯]/.test(ch)) {
    kanjiStrokes ||= (await import('./content/strokes.kanji.js')).KANJI_STROKES;
    return kanjiStrokes[ch]?.split('|') || null;
  }
  return null;
}
/** Sait-on tracer ce signe sans rien charger ? (lettres du hangeul et kana) */
export const canTrace = (ch) => !!(HANGUL_STROKES[ch] || KANA_STROKES[ch]) || /^[一-龯]$/.test(ch);

const GRID = `<g class="pad-grid"><rect x="1.5" y="1.5" width="106" height="106" rx="10"/><path d="M54.5 4V105M4 54.5H105"/></g>`;

function draw(path, ms) {
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  if (reducedMotion()) return Promise.resolve();
  return path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: ms ?? Math.max(220, len * 7), easing: 'ease-in-out', fill: 'backwards' }).finished.catch(() => {});
}

/** Démonstration animée de l'ordre des traits (toucher pour rejouer). */
export async function strokeDemo(host, ch) {
  const strokes = await strokesOf(ch);
  if (!strokes || !host.isConnected) return;
  host.innerHTML = `
    <button class="stroke-demo" aria-label="${t('write.replay')}">
      <svg viewBox="0 0 ${SIZE} ${SIZE}">${GRID}
        <g class="pad-ghost">${strokes.map((d) => `<path d="${d}"/>`).join('')}</g>
        <g class="pad-ink">${strokes.map((d) => `<path d="${d}"/>`).join('')}</g>
        <g class="pad-nums">${strokes.map(() => '<text></text>').join('')}</g>
      </svg>
    </button>`;
  const paths = [...host.querySelectorAll('.pad-ink path')];
  const nums = [...host.querySelectorAll('.pad-nums text')];
  paths.forEach((p, k) => {
    const a = p.getPointAtLength(0);
    nums[k].setAttribute('x', Math.max(6, a.x - 5));
    nums[k].setAttribute('y', Math.max(9, a.y - 3));
    nums[k].textContent = k + 1;
  });
  let run = 0;
  async function play() {
    const me = ++run;
    paths.forEach((p) => { p.style.visibility = 'hidden'; });
    for (const p of paths) {
      if (me !== run || !host.isConnected) return;
      p.style.visibility = '';
      await draw(p);
      await new Promise((r) => setTimeout(r, 140));
    }
  }
  host.querySelector('.stroke-demo').addEventListener('click', play);
  play();
}

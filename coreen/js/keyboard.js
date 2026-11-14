// Clavier à l'écran : hangeul (disposition coréenne à deux jeux, les lettres s'assemblent en syllabes)
// et kana (tableau des cinquante sons, avec ゛ ゜ et les petits signes).
import { CHO, JUNG, JONG, compose, isSyllable, decompose } from './hangul.js';
import { toKata, toHira } from './lang/kana.js';

// ---------- Hangeul : assemblage des lettres ----------
const V_PAIR = { ㅗㅏ: 'ㅘ', ㅗㅐ: 'ㅙ', ㅗㅣ: 'ㅚ', ㅜㅓ: 'ㅝ', ㅜㅔ: 'ㅞ', ㅜㅣ: 'ㅟ', ㅡㅣ: 'ㅢ' };
const F_PAIR = { ㄱㅅ: 'ㄳ', ㄴㅈ: 'ㄵ', ㄴㅎ: 'ㄶ', ㄹㄱ: 'ㄺ', ㄹㅁ: 'ㄻ', ㄹㅂ: 'ㄼ', ㄹㅅ: 'ㄽ', ㄹㅌ: 'ㄾ', ㄹㅍ: 'ㄿ', ㄹㅎ: 'ㅀ', ㅂㅅ: 'ㅄ' };
const V_SPLIT = Object.fromEntries(Object.entries(V_PAIR).map(([k, v]) => [v, [...k]]));
const F_SPLIT = Object.fromEntries(Object.entries(F_PAIR).map(([k, v]) => [v, [...k]]));
const isV = (j) => JUNG.includes(j);
const isC = (j) => CHO.includes(j);

/** Suite de lettres tapées → texte en syllabes : ㅎㅏㄴㄱㅡㄹ → 한글. Les autres caractères (espace…) passent tels quels. */
export function assemble(keys) {
  let out = '';
  let i = 0;
  const vowelAt = (k) => {
    // voyelle simple ou composée (ㅗ + ㅏ → ㅘ)
    const a = keys[k];
    const pair = V_PAIR[a + (keys[k + 1] || '')];
    return pair ? [pair, 2] : [a, 1];
  };
  while (i < keys.length) {
    const a = keys[i];
    if (isC(a) && isV(keys[i + 1])) {
      const [v, n] = vowelAt(i + 1);
      i += 1 + n;
      let f = '';
      const c1 = keys[i];
      // Une consonne ne devient finale que si elle n'ouvre pas la syllabe suivante.
      if (c1 && JONG.includes(c1) && c1 !== '' && !isV(keys[i + 1])) {
        f = c1;
        i++;
        const pair = F_PAIR[c1 + (keys[i] || '')];
        if (pair && !isV(keys[i + 1])) {
          f = pair;
          i++;
        }
      }
      out += compose(CHO.indexOf(a), JUNG.indexOf(v), JONG.indexOf(f));
    } else if (isV(a)) {
      const [v, n] = vowelAt(i);
      out += v;
      i += n;
    } else {
      out += a;
      i++;
    }
  }
  return out;
}

/** Texte → lettres une à une (pour reprendre la saisie après un indice). */
export function disassemble(text) {
  const keys = [];
  for (const ch of text) {
    if (!isSyllable(ch)) {
      keys.push(...(V_SPLIT[ch] || [ch]));
      continue;
    }
    const d = decompose(ch);
    keys.push(CHO[d.cho], ...(V_SPLIT[JUNG[d.jung]] || [JUNG[d.jung]]));
    if (d.jong) keys.push(...(F_SPLIT[JONG[d.jong]] || [JONG[d.jong]]));
  }
  return keys;
}

// ---------- Kana : marques et petits signes ----------
const PLAIN = 'かきくけこさしすせそたちつてとはひふへほ';
const VOICED = 'がぎぐげござじずぜぞだぢづでどばびぶべぼ';
const HALF_FROM = 'はひふへほ';
const HALF = 'ぱぴぷぺぽ';
const BIG = 'つやゆよあいうえお';
const SMALL = 'っゃゅょぁぃぅぇぉ';

/** Applique ゛, ゜ ou « petit » au dernier signe (une seconde pression l'enlève). */
export function modifyKana(text, mark) {
  if (!text) return text;
  const last = text.at(-1);
  const kata = /[ァ-ヶ]/.test(last);
  let h = toHira(last);
  const swap = (from, to) => {
    const a = from.indexOf(h);
    const b = to.indexOf(h);
    if (a >= 0) h = to[a];
    else if (b >= 0) h = from[b];
    else return false;
    return true;
  };
  let ok;
  if (mark === '゛') {
    if (HALF.includes(h)) h = HALF_FROM[HALF.indexOf(h)];
    ok = swap(PLAIN, VOICED);
  } else if (mark === '゜') {
    if (VOICED.includes(h) && HALF_FROM.includes(PLAIN[VOICED.indexOf(h)])) h = PLAIN[VOICED.indexOf(h)];
    ok = swap(HALF_FROM, HALF);
  } else ok = swap(BIG, SMALL);
  return ok ? text.slice(0, -1) + (kata ? toKata(h) : h) : text;
}

// ---------- Dispositions ----------
const KO_ROWS = [
  ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
  ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
  ['⇧', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', '⌫'],
];
const KO_SHIFT = { ㅂ: 'ㅃ', ㅈ: 'ㅉ', ㄷ: 'ㄸ', ㄱ: 'ㄲ', ㅅ: 'ㅆ', ㅐ: 'ㅒ', ㅔ: 'ㅖ' };
// Appui long : doubles consonnes, ㅒ et ㅖ. Les voyelles composées se tapent en deux fois (ㅗ + ㅏ → ㅘ).
export const KO_LONG = {
  ㅂ: ['ㅃ'], ㅈ: ['ㅉ'], ㄷ: ['ㄸ'], ㄱ: ['ㄲ'], ㅅ: ['ㅆ'], ㅐ: ['ㅒ'], ㅔ: ['ㅖ'],
};
const LONG_MS = 380;
// Clavier d'ordinateur (AZERTY ou QWERTY : on lit la position de la touche, pas la lettre).
const KO_CODES = { KeyQ: 'ㅂ', KeyW: 'ㅈ', KeyE: 'ㄷ', KeyR: 'ㄱ', KeyT: 'ㅅ', KeyY: 'ㅛ', KeyU: 'ㅕ', KeyI: 'ㅑ', KeyO: 'ㅐ', KeyP: 'ㅔ', KeyA: 'ㅁ', KeyS: 'ㄴ', KeyD: 'ㅇ', KeyF: 'ㄹ', KeyG: 'ㅎ', KeyH: 'ㅗ', KeyJ: 'ㅓ', KeyK: 'ㅏ', KeyL: 'ㅣ', KeyZ: 'ㅋ', KeyX: 'ㅌ', KeyC: 'ㅊ', KeyV: 'ㅍ', KeyB: 'ㅠ', KeyN: 'ㅜ', KeyM: 'ㅡ' };

// Clavier japonais de téléphone (« 12 touches ») : une touche par colonne あ か さ…
// Toucher plusieurs fois fait défiler la colonne (あ → い → う…) ; glisser le doigt (« flick ») choisit directement :
// gauche → い, haut → う, droite → え, bas → お. ゛゜小 transforme le dernier signe, → passe au signe suivant, ↺ revient en arrière.
// Ordre de chaque liste : toucher, gauche, haut, droite, bas.
const FLICK = {
  あ: 'あいうえお', か: 'かきくけこ', さ: 'さしすせそ', た: 'たちつてと', な: 'なにぬねの',
  は: 'はひふへほ', ま: 'まみむめも', や: 'や「ゆ」よ', ら: 'らりるれろ', わ: 'わをんー〜', '、': '、。？！…',
};
const CYCLE = {
  あ: 'あいうえおぁぃぅぇぉ', か: 'かきくけこ', さ: 'さしすせそ', た: 'たちつてとっ', な: 'なにぬねの',
  は: 'はひふへほ', ま: 'まみむめも', や: 'やゆよゃゅょ', ら: 'らりるれろ', わ: 'わをんゎー', '、': '、。？！…',
};
const JA_GRID = [
  ['→', 'あ', 'か', 'さ', '⌫'],
  ['↺', 'た', 'な', 'は', '空白'],
  ['かな', 'ま', 'や', 'ら', '改行'],
  ['', '゛゜小', 'わ', '、', null],
];
/** Formes d'un signe pour la touche ゛゜小 : つ → っ → づ, は → ば → ぱ, や → ゃ… */
function markForms(h) {
  let base = h;
  for (const [from, to] of [[PLAIN, VOICED], [HALF_FROM, HALF], [BIG, SMALL]]) if (to.includes(h)) base = from[to.indexOf(h)];
  if (h === 'ゎ') base = 'わ';
  const forms = [base];
  if (BIG.includes(base)) forms.push(SMALL[BIG.indexOf(base)]);
  if (PLAIN.includes(base)) forms.push(VOICED[PLAIN.indexOf(base)]);
  if (HALF_FROM.includes(base)) forms.push(HALF[HALF_FROM.indexOf(base)]);
  if (base === 'わ') forms.push('ゎ');
  return forms;
}
/** Applique la touche ゛゜小 au dernier signe (forme suivante). */
export function cycleMark(text) {
  if (!text) return text;
  const last = text.at(-1);
  const kata = /[ァ-ヶ]/.test(last);
  const h = toHira(last);
  const forms = markForms(h);
  if (forms.length < 2) return text;
  const next = forms[(forms.indexOf(h) + 1) % forms.length];
  return text.slice(0, -1) + (kata ? toKata(next) : next);
}
/** Direction d'un glissement : 0 (toucher), 1 gauche, 2 haut, 3 droite, 4 bas. */
const flickDir = (dx, dy) => (Math.hypot(dx, dy) < 18 ? 0 : Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 3) : dy < 0 ? 2 : 4);

// Clavier latin, pour écrire la romanisation : AZERTY en français, QWERTY en anglais.
const LATIN = {
  azerty: [[...'azertyuiop'], [...'qsdfghjklm'], [...'wxcvbn', '’', '⌫']],
  qwerty: [[...'qwertyuiop'], [...'asdfghjkl'], [...'zxcvbnm', '’', '⌫']],
};

/**
 * Installe un clavier dans `host`.
 * kind : 'ko', 'ja' ou 'latin' (layout : 'azerty' | 'qwerty') ; kata : commencer en katakana ; onChange(texte) ; onEnter()
 * Renvoie { value, set(texte), clear(), lock(bool) }.
 */
export function mountKeyboard(host, { kind, layout = 'azerty', kata = false, space = false, onChange, onEnter }) {
  let keys = []; // coréen : lettres tapées ; japonais : signes
  let shift = false;
  let locked = false;
  const value = () => (kind === 'ko' ? assemble(keys) : keys.join(''));
  const emit = () => onChange?.(value());

  function draw() {
    if (kind === 'latin') {
      host.innerHTML = `<div class="kb kb-latin">${LATIN[layout].map((row, n) => `<div class="kb-row ${n === 1 && row.length < 10 ? 'inset' : ''}">${row.map((k) => (k === '⌫'
        ? '<button class="kb-key fn" data-fn="back" aria-label="⌫">⌫</button>'
        : `<button class="kb-key" data-k="${k === '’' ? "'" : k}">${k}</button>`)).join('')}</div>`).join('')}</div>`;
    } else if (kind === 'ko') {
      host.innerHTML = `<div class="kb kb-ko ${shift ? 'shift' : ''}">${KO_ROWS.map((row) => `<div class="kb-row">${row.map((k) => {
        if (k === '⇧') return `<button class="kb-key fn ${shift ? 'on' : ''}" data-fn="shift" aria-label="Shift">⇧</button>`;
        if (k === '⌫') return '<button class="kb-key fn" data-fn="back" aria-label="⌫">⌫</button>';
        const c = shift && KO_SHIFT[k] ? KO_SHIFT[k] : k;
        const long = !shift && KO_LONG[k];
        return `<button class="kb-key kr ${shift && KO_SHIFT[k] ? 'alt' : ''}" data-k="${c}"${long ? ` data-long="${long.join('')}"` : ''}>${c}${long ? `<small class="kb-alt">${long[0]}</small>` : ''}</button>`;
      }).join('')}</div>`).join('')}${space ? '<div class="kb-row"><button class="kb-key fn wide" data-k=" " aria-label="Espace">␣</button></div>' : ''}</div>`;
    } else {
      const lab = (k) => (kata ? toKata(k) : k);
      host.innerHTML = `<div class="kb kb-ja">${JA_GRID.flat().map((k) => {
        if (k === null) return '';
        if (k === '') return '<span class="kb-gap"></span>';
        if (k === '⌫') return '<button class="kb-key fn" data-fn="back" aria-label="⌫">⌫</button>';
        if (k === '→') return '<button class="kb-key fn" data-fn="next" aria-label="→">→</button>';
        if (k === '↺') return '<button class="kb-key fn" data-fn="undo" aria-label="↺">↺</button>';
        if (k === 'かな') return `<button class="kb-key fn kr" data-fn="kata">${kata ? 'かな' : 'カナ'}</button>`;
        if (k === '空白') return `<button class="kb-key fn kr" data-k=" "${space ? '' : ' disabled'}>空白</button>`;
        if (k === '改行') return '<button class="kb-key fn kr tall" data-fn="enter">改行</button>';
        if (k === '゛゜小') return '<button class="kb-key kr small-mark" data-fn="mark" aria-label="゛゜小">゛゜<small>小</small></button>';
        return `<button class="kb-key kr" data-flick="${k}">${k === '、' ? '、。?!' : lab(k)}</button>`;
      }).join('')}</div>`;
    }
  }

  let cyc = null; // touche japonaise en train de défiler : { key, i }
  function press(k) {
    cyc = null;
    keys.push(k);
    if (shift) {
      shift = false;
      draw();
    }
    emit();
  }
  function back() {
    cyc = null;
    keys.pop();
    emit();
  }
  /** Touche japonaise touchée : nouveau signe, ou signe suivant de la colonne si on touche encore la même. */
  function tapKana(k) {
    const list = [...CYCLE[k]];
    const out = (c) => (kata ? toKata(c) : c);
    if (cyc?.key === k && keys.length) {
      cyc.i = (cyc.i + 1) % list.length;
      keys[keys.length - 1] = out(list[cyc.i]);
    } else {
      keys.push(out(list[0]));
      cyc = { key: k, i: 0 };
    }
    emit();
  }
  function undoKana() {
    if (!cyc || !keys.length) return;
    const list = [...CYCLE[cyc.key]];
    cyc.i = (cyc.i - 1 + list.length) % list.length;
    keys[keys.length - 1] = kata ? toKata(list[cyc.i]) : list[cyc.i];
    emit();
  }
  function markKana() {
    cyc = null;
    const before = keys.join('');
    const after = cycleMark(before);
    if (after !== before) {
      keys = [...after];
      emit();
    }
  }
  function mark(m) {
    const before = keys.join('');
    const after = modifyKana(before, m);
    if (after !== before) {
      keys = [...after];
      emit();
    }
  }

  // Appui long : une bulle propose les variantes ; on glisse le doigt dessus et on relâche.
  let held = null; // { key, timer, pop, pick }
  const closePop = () => {
    if (!held) return;
    clearTimeout(held.timer);
    held.pop?.remove();
    held.key.classList.remove('hit');
    held = null;
  };
  function openPop(b) {
    const alts = [...b.dataset.long];
    const kb = host.querySelector('.kb');
    const pop = document.createElement('div');
    pop.className = 'kb-pop kr';
    pop.innerHTML = alts.map((a, i) => `<span class="${i ? '' : 'on'}" data-k="${a}">${a}</span>`).join('');
    kb.append(pop);
    const r = b.getBoundingClientRect();
    const k = kb.getBoundingClientRect();
    const w = pop.offsetWidth;
    pop.style.left = `${Math.max(2, Math.min(k.width - w - 2, r.left - k.left + r.width / 2 - w / 2))}px`;
    pop.style.top = `${r.top - k.top - pop.offsetHeight - 6}px`;
    held.pop = pop;
    held.pick = alts[0];
    if (navigator.vibrate) try { navigator.vibrate(8); } catch { /* sans vibreur */ }
  }
  /** Bulle au-dessus d'une touche japonaise : le signe qui sera écrit selon le glissement. */
  function showFlick() {
    const b = held.key;
    const kb = host.querySelector('.kb');
    if (!held.pop) {
      held.pop = document.createElement('div');
      held.pop.className = 'kb-pop kb-flick kr';
      kb.append(held.pop);
    }
    const c = [...FLICK[held.flick]][held.dir];
    held.pop.innerHTML = `<span class="on">${kata ? toKata(c) : c}</span>`;
    const r = b.getBoundingClientRect();
    const k = kb.getBoundingClientRect();
    const w = held.pop.offsetWidth;
    held.pop.style.left = `${Math.max(2, Math.min(k.width - w - 2, r.left - k.left + r.width / 2 - w / 2))}px`;
    held.pop.style.top = `${r.top - k.top - held.pop.offsetHeight - 6}px`;
  }
  function track(e) {
    if (held?.flick) {
      const d = flickDir(e.clientX - held.x0, e.clientY - held.y0);
      if (d !== held.dir) {
        held.dir = d;
        showFlick();
      }
      return;
    }
    if (!held?.pop) return;
    const spans = [...held.pop.children];
    let best = spans[0];
    let d = Infinity;
    for (const sp of spans) {
      const r = sp.getBoundingClientRect();
      const dd = Math.abs(e.clientX - (r.left + r.width / 2));
      if (dd < d) { d = dd; best = sp; }
    }
    spans.forEach((sp) => sp.classList.toggle('on', sp === best));
    held.pick = best.dataset.k;
  }

  host.addEventListener('contextmenu', (e) => e.preventDefault());
  host.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.kb-key');
    if (!b || locked) return;
    e.preventDefault(); // pas de sélection de texte ni de perte de focus
    closePop();
    if (b.dataset.flick) {
      // Clavier japonais : on attend le relâchement pour savoir s'il y a eu glissement.
      b.classList.add('hit');
      held = { key: b, flick: b.dataset.flick, x0: e.clientX, y0: e.clientY, dir: 0, pop: null };
      try { b.releasePointerCapture?.(e.pointerId); } catch { /* rien */ }
      showFlick();
      return;
    }
    if (b.dataset.long) {
      // La lettre s'écrit au relâchement : un appui long ouvre les variantes.
      b.classList.add('hit');
      held = { key: b, pop: null, pick: null };
      held.timer = setTimeout(() => held?.key === b && openPop(b), LONG_MS);
      try { b.releasePointerCapture?.(e.pointerId); } catch { /* rien */ }
      return;
    }
    if (b.dataset.fn === 'shift') {
      shift = !shift;
      draw();
    } else if (b.dataset.fn === 'back') back();
    else if (b.dataset.fn === 'kata') {
      kata = !kata;
      draw();
    } else if (b.dataset.fn === 'next') cyc = null;
    else if (b.dataset.fn === 'undo') undoKana();
    else if (b.dataset.fn === 'mark') markKana();
    else if (b.dataset.fn === 'enter') onEnter?.();
    else if (b.dataset.mark) mark(b.dataset.mark);
    else press(b.dataset.k);
    b.classList.add('hit');
    setTimeout(() => b.classList.remove('hit'), 120);
  });
  host.addEventListener('pointermove', track);
  const release = (e) => {
    if (!host.isConnected) {
      document.removeEventListener('pointerup', release);
      document.removeEventListener('pointercancel', release);
      return;
    }
    if (!held) return;
    const h = held;
    if (h.flick) {
      closePop();
      if (locked || e.type === 'pointercancel') return;
      if (!h.dir) return tapKana(h.flick);
      const c = [...FLICK[h.flick]][h.dir];
      return press(kata ? toKata(c) : c);
    }
    if (e.type === 'pointercancel' && !h.pop) return closePop();
    const k = h.pop ? h.pick : h.key.dataset.k;
    closePop();
    if (!locked && k) press(k);
  };
  document.addEventListener('pointerup', release);
  document.addEventListener('pointercancel', release);

  // Clavier d'ordinateur
  const onKey = (e) => {
    if (!host.isConnected) {
      document.removeEventListener('pointerup', release);
      document.removeEventListener('pointercancel', release);
      return document.removeEventListener('keydown', onKey);
    }
    if (locked || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Backspace') { e.preventDefault(); return back(); }
    if (e.key === 'Enter') { e.preventDefault(); return onEnter?.(); }
    if (kind === 'latin') {
      if (/^[a-zA-Z']$/.test(e.key)) press(e.key.toLowerCase());
    } else if (kind === 'ko') {
      if (e.key === ' ' && space) { e.preventDefault(); return press(' '); }
      if (/^[ㄱ-ㅣ]$/.test(e.key)) return press(e.key);
      const j = KO_CODES[e.code];
      if (j) press(e.shiftKey && KO_SHIFT[j] ? KO_SHIFT[j] : j);
    } else if (/^[ぁ-ゖァ-ヶー]$/.test(e.key)) press(e.key);
  };
  document.addEventListener('keydown', onKey);

  draw();
  return {
    get value() { return value(); },
    set(text) {
      keys = kind === 'ko' ? disassemble(text) : [...text];
      emit();
    },
    clear() {
      keys = [];
      emit();
    },
    lock(v) {
      locked = v;
      host.classList.toggle('kb-locked', v);
    },
  };
}

/** Zone de saisie complète : la ligne de réponse, les boutons éventuels (actions), puis le clavier. */
export function mountTyping(host, { kind, layout, kata, space, placeholder = '', actions = '', onEnter, onChange }) {
  host.innerHTML = `
    <div class="type-zone">
      <div class="type-box ${kind === 'latin' ? 'latin' : 'kr'}" aria-live="polite"><span class="type-text"></span><i class="caret"></i><span class="type-ph">${placeholder}</span></div>
      ${actions}
      <div class="kb-host"></div>
    </div>`;
  const box = host.querySelector('.type-box');
  const text = host.querySelector('.type-text');
  const kb = mountKeyboard(host.querySelector('.kb-host'), {
    kind, layout, kata, space, onEnter,
    onChange(v) {
      text.textContent = v;
      box.classList.toggle('filled', !!v);
      box.classList.remove('bad');
      onChange?.(v);
    },
  });
  return { kb, box, get value() { return kb.value; } };
}

/** Compare deux réponses sans tenir compte des espaces, de la ponctuation ni de hiragana / katakana. */
export const normAnswer = (s) => toHira(String(s)).replace(/[\s.,!?。、？！~〜・…'"’“”「」()（）]/g, '');

/** Compare deux romanisations : sans majuscules, espaces, apostrophes ni tirets. */
export const normRoman = (s) => String(s).toLowerCase().replace(/[^a-z]/g, '');

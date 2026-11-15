// Version « Aventure » (réglage Apparence → Style) : le parcours devient une carte de jeu.
// Chapitres = mondes, modules = niveaux, étapes = missions, examen de module = boss, examen final = boss final.
// Les données et la progression sont celles du parcours : on peut revenir au style Haru à tout moment sans rien perdre.
import { $, $$, esc, sfx, celebrate, toast } from './ui.js';
import * as store from './store.js';
import { course, tr } from './course.js';
import { roadRewards, stepInfo } from './road.js';

const L = (fr, en) => tr({ fr, en });
export const questMode = () => document.documentElement.dataset.style === 'quest';

/** Décor de chaque monde : trois éléments et deux couleurs de ciel / de sol. */
const WORLDS = [
  { deco: '🌸🌱🦋', a: '#ffd3e6', b: '#c7f0cf' },
  { deco: '🌳🍄🐿️', a: '#c9f1c0', b: '#8fd49a' },
  { deco: '🏘️🌻🐔', a: '#fff1b8', b: '#bfe8a6' },
  { deco: '🏖️🐚🦀', a: '#bfeaff', b: '#ffe7a8' },
  { deco: '🏔️🌲🦅', a: '#d8e8ff', b: '#b5d3c4' },
  { deco: '🏯🎐🐉', a: '#ffd9c2', b: '#f3b6a6' },
  { deco: '🌃🛵🏮', a: '#c8c3ff', b: '#9a8cf0' },
  { deco: '🚄🗻🌾', a: '#e3f4ff', b: '#cfe9b4' },
  { deco: '🏢☕💼', a: '#e7ecf5', b: '#c6d2e6' },
  { deco: '💞🎡🍰', a: '#ffd6ec', b: '#ffc0cf' },
  { deco: '🎭🎨🎤', a: '#ffe3c4', b: '#ffc78f' },
  { deco: '⚔️🛡️🔥', a: '#ffd0c4', b: '#f59d8a' },
  { deco: '📜🪶🏛️', a: '#efe2c8', b: '#d8c094' },
  { deco: '🌌🚀👑', a: '#c9c0ff', b: '#7d6ee8' },
];
const AVATARS = ['🐯', '🦊', '🐼', '🐰', '🐸', '🐧', '🦄', '🐲', '🐱', '🐶', '🐨', '🦁'];
export const avatar = () => store.get().settings.avatar || (course().id === 'ja' ? '🦊' : '🐯');
const OFFS = [0, 0.9, 0.35, -0.6, -0.95, -0.2, 0.7]; // tracé sinueux des niveaux

/** Étoiles d'un niveau (0 à 3) : la moyenne des étoiles de ses missions, 3 si l'examen est réussi. */
function levelStars(u) {
  if (u.plat) return 3;
  if (!u.complete) return 0;
  const st = u.steps.filter((s) => s.stars);
  return st.length ? Math.max(1, Math.round(st.reduce((n, s) => n + s.stars, 0) / st.length)) : 2;
}
const starRow = (n, cls = 'q-stars') => `<span class="${cls}" aria-label="${n} / 3">${[1, 2, 3].map((k) => `<i class="${k <= n ? 'on' : ''}">★</i>`).join('')}</span>`;

export function questScreen(el) {
  const st = store.get();
  const R = roadRewards();
  const lv = store.level();
  const goal = st.goal || 30;
  const tx = store.todayXp();
  const today = store.dayKey();
  const chestOpen = !!st.road?.[`chest:${today}`];
  const dailyDone = tx >= goal;
  const next = R.next && R.cur ? stepInfo(R.next) : null;

  // Mondes visibles : ceux qui ont un niveau ouvert, puis le suivant (fermé, pour donner envie).
  const openW = R.chapters.map((c) => c.list.some((u) => u.open));
  const lastOpen = openW.lastIndexOf(true);

  const levelHtml = (u, i) => {
    const cur = u === R.cur;
    const state = u.plat ? 'plat' : u.complete ? 'done' : cur ? 'cur' : u.open ? 'open' : 'locked';
    const inner = u.plat ? '👑' : u.complete ? '✓' : u.open ? u.n : '🔒';
    return `
      <button class="q-lv ${state}" data-u="${u.id}" style="--x:${OFFS[i % OFFS.length]}; --tc:${u.color}; --i:${i}">
        ${cur ? `<span class="q-pin" aria-hidden="true">${avatar()}</span>` : ''}
        <span class="q-lvb">${inner}</span>
        ${starRow(levelStars(u))}
        <span class="q-lvname">${esc(tr(u.title))}</span>
      </button>`;
  };

  el.innerHTML = `
    <div class="screen quest">
      <section class="q-hud">
        <button class="q-avatar" aria-label="${L('Changer d’avatar', 'Change avatar')}">${avatar()}</button>
        <div class="q-who">
          <b>${L('Niveau', 'Level')} ${lv.lv}</b>
          <span class="q-xpbar"><i style="--w:${lv.progress}"></i></span>
          <small>${lv.into} / ${lv.span} XP</small>
        </div>
        <div class="q-res">
          <span title="XP">🪙<b>${st.xp}</b></span>
          <span title="${L('Étoiles', 'Stars')}">⭐<b>${R.starCount}</b></span>
          <span title="${L('Série', 'Streak')}">🔥<b>${store.streak()}</b></span>
        </div>
      </section>

      <section class="q-daily ${dailyDone ? 'done' : ''} ${chestOpen ? 'claimed' : ''}">
        <button class="q-chest" ${dailyDone && !chestOpen ? '' : 'disabled'} aria-label="${L('Coffre du jour', 'Daily chest')}">${chestOpen ? '✨' : '🎁'}</button>
        <div class="q-dtext">
          <b>${L('Quête du jour', 'Daily quest')}</b>
          <small>${chestOpen ? L('Coffre ouvert. Reviens demain !', 'Chest opened. Come back tomorrow!') : dailyDone ? L('Quête réussie : ouvre ton coffre !', 'Quest complete: open your chest!') : L(`Gagne ${goal} XP aujourd’hui`, `Earn ${goal} XP today`)}</small>
          <span class="q-bar"><i style="--w:${Math.min(1, tx / goal)}"></i><em>${Math.min(tx, goal)} / ${goal}</em></span>
        </div>
        ${next ? `<a class="btn primary q-play" href="${next.href}">▶ ${L('Jouer', 'Play')}</a>` : ''}
      </section>

      ${R.chapters.map((c, k) => {
        if (k > lastOpen + 1) return '';
        const w = WORLDS[k % WORLDS.length];
        const locked = !openW[k];
        const stars = c.list.reduce((n, u) => n + levelStars(u), 0);
        return `
      <section class="q-world ${locked ? 'locked' : ''}" style="--wa:${w.a}; --wb:${w.b}" data-c="${c.id}">
        <header class="q-wh">
          <span class="q-wdeco" aria-hidden="true">${w.deco}</span>
          <span class="q-wn">${L('Monde', 'World')} ${k + 1}</span>
          <b>${esc(tr(c.title))}</b>
          <span class="q-wsub">${esc(tr(c.sub))}</span>
          <span class="q-wcount">⭐ ${stars} / ${c.list.length * 3}</span>
        </header>
        ${locked
          ? `<p class="q-wlock">🔒 ${L(`Termine le monde ${k} pour entrer ici.`, `Finish world ${k} to get in.`)}</p>`
          : `<div class="q-path"><svg class="q-line" aria-hidden="true"></svg>${c.list.map(levelHtml).join('')}</div>`}
      </section>`;
      }).join('')}

      <a class="q-boss" href="#/exam?u=final">
        <span class="q-boss-m" aria-hidden="true">🐉</span>
        <span><span class="q-wn">${L('Boss final', 'Final boss')}</span><b>${L('Le dragon des langues', 'The language dragon')}</b>
        <small>${st.final?.n ? L(`Meilleur score : ${st.final.best} %`, `Best score: ${st.final.best}%`) : L('Il pose des questions sur tout ce que tu as terminé.', 'He asks about everything you have finished.')}</small></span>
        <span class="q-go">⚔️</span>
      </a>
    </div>`;

  requestAnimationFrame(() => requestAnimationFrame(() => el.querySelector('.quest')?.classList.add('go')));

  // Avatar : on change d'animal en le touchant
  $('.q-avatar', el).addEventListener('click', (e) => {
    const cur = AVATARS.indexOf(avatar());
    st.settings.avatar = AVATARS[(cur + 1) % AVATARS.length];
    store.save();
    sfx.tap();
    e.currentTarget.textContent = st.settings.avatar;
    const pin = $('.q-pin', el);
    if (pin) pin.textContent = st.settings.avatar;
  });

  // Coffre du jour : 10 XP une fois par jour, quand la quête du jour est réussie
  $('.q-chest', el).addEventListener('click', () => {
    if (!dailyDone || st.road[`chest:${today}`]) return;
    st.road[`chest:${today}`] = true;
    store.save();
    store.addXp(10);
    celebrate({ glyph: '🎁', title: L('Coffre ouvert !', 'Chest opened!'), text: L('+10 XP. Ta quête du jour est réussie.', '+10 XP. Daily quest complete.'), button: L('Super !', 'Great!') });
    questScreen(el);
  });

  $$('.q-lv', el).forEach((b) => b.addEventListener('click', () => {
    sfx.tap();
    openLevel(R.units.find((u) => u.id === b.dataset.u), el);
  }));

  // Chemin en pointillés entre les niveaux
  function draw() {
    $$('.q-path', el).forEach((path) => {
      const svg = $('.q-line', path);
      const box = path.getBoundingClientRect();
      if (!box.width) return;
      const pts = $$('.q-lv', path).map((n) => {
        const b = $('.q-lvb', n);
        return { x: n.offsetLeft + b.offsetLeft + b.offsetWidth / 2, y: n.offsetTop + b.offsetTop + b.offsetHeight / 2, on: /done|plat/.test(n.className) };
      });
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      svg.innerHTML = pts.slice(1).map((p, i) => {
        const a = pts[i];
        const m = (a.y + p.y) / 2;
        return `<path class="${a.on ? 'on' : ''}" d="M${a.x} ${a.y} C${a.x} ${m} ${p.x} ${m} ${p.x} ${p.y}"/>`;
      }).join('');
    });
  }
  draw();
  document.fonts?.ready.then(() => el.querySelector('.quest') && draw());
  const onResize = () => (el.querySelector('.quest') ? draw() : removeEventListener('resize', onResize));
  addEventListener('resize', onResize);

  const cur = $('.q-lv.cur', el);
  if (cur && R.done) requestAnimationFrame(() => cur.scrollIntoView({ block: 'center' }));
}

/** Fiche d'un niveau : ses missions (les étapes du module), le boss (l'examen) et le bouton Jouer. */
function openLevel(u, el) {
  closeLevel();
  if (!u) return;
  const next = u.steps.find((s) => !s.done) || u.steps[0];
  const nextInfo = next ? stepInfo(next) : null;
  const box = document.createElement('div');
  box.className = 'q-sheet-bg';
  box.innerHTML = `
    <div class="q-sheet" role="dialog" aria-modal="true" style="--tc:${u.color}">
      <button class="q-x" aria-label="${L('Fermer', 'Close')}">✕</button>
      <header class="q-sh">
        <span class="q-shn">${u.plat ? '👑' : u.n}</span>
        <div><span class="q-wn">${L('Niveau', 'Level')} ${u.n}</span><b>${esc(tr(u.title))}</b><small>${esc(tr(u.sub))}</small></div>
      </header>
      <ol class="q-missions">
        ${u.steps.map((s, i) => {
          const info = stepInfo(s);
          const tag = s.done ? (s.stars ? starRow(s.stars, 'q-mstars') : '<span class="q-mok">✓</span>') : s === next && u.open ? `<span class="q-mnew">${L('À faire', 'Next')}</span>` : '';
          const body = `<span class="q-mg kr">${esc(info.glyph)}</span><span class="q-mt"><b>${esc(info.title)}</b><small>${L('Mission', 'Mission')} ${i + 1} · ${esc(info.type)}</small></span>${tag}`;
          return `<li>${u.open ? `<a class="q-mis ${s.done ? 'done' : ''}" href="${info.href}">${body}</a>` : `<div class="q-mis locked">${body}</div>`}</li>`;
        }).join('')}
        <li><${u.complete ? `a href="#/exam?u=${u.id}"` : 'div'} class="q-mis boss ${u.plat ? 'done' : ''} ${u.complete ? '' : 'locked'}">
          <span class="q-mg">${u.plat ? '👑' : '👹'}</span>
          <span class="q-mt"><b>${L('Boss du niveau', 'Level boss')}</b><small>${u.plat ? L(`Vaincu · ${u.score} %`, `Defeated · ${u.score}%`) : u.complete ? L(`Examen sans indice · ${store.EXAM_PASS} % pour le vaincre`, `No-hint exam · ${store.EXAM_PASS}% to win`) : L('Termine toutes les missions pour l’affronter', 'Finish every mission to face it')}</small></span>
          ${u.complete && !u.plat ? '<span class="q-mnew">⚔️</span>' : ''}
        </${u.complete ? 'a' : 'div'}></li>
      </ol>
      <div class="q-shbtn">
        ${!u.open
          ? `<button class="btn primary q-unlock">🔓 ${L('Débloquer ce niveau', 'Unlock this level')}</button>`
          : u.complete && !u.plat
            ? `<a class="btn primary" href="#/exam?u=${u.id}">⚔️ ${L('Affronter le boss', 'Fight the boss')}</a>`
            : nextInfo ? `<a class="btn primary" href="${nextInfo.href}">▶ ${u.complete ? L('Rejouer', 'Replay') : L('Jouer', 'Play')}</a>` : ''}
      </div>
    </div>`;
  document.body.append(box);
  box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('.q-x')) closeLevel(); });
  $('.q-unlock', box)?.addEventListener('click', () => {
    const st = store.get();
    st.road ||= {};
    st.road[`open:${u.id}`] = true;
    store.save();
    sfx.ok();
    toast(L('Niveau débloqué', 'Level unlocked'));
    closeLevel();
    questScreen(el);
  });
}
function closeLevel() {
  $$('.q-sheet-bg').forEach((b) => b.remove());
}
addEventListener('hashchange', closeLevel);

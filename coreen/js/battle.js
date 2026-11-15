// Version « Aventure » : chaque série d'exercices est un combat.
// Bonne réponse : le monstre perd un point de vie (coup critique en combo). Erreur : on perd un cœur.
// Les examens sont des boss. Les règles de l'apprentissage ne changent pas : c'est un habillage du quiz.
import { tr } from './course.js';

const L = (fr, en) => tr({ fr, en });
const MONSTERS = [
  ['👾', 'Pixelon', 'Pixelon'], ['🐙', 'Poulpe farceur', 'Prankster octopus'], ['👻', 'Fantôme bavard', 'Chatty ghost'],
  ['🦇', 'Chauve-souris', 'Night bat'], ['🧟', 'Zombie distrait', 'Absent zombie'], ['🤖', 'Robot rouillé', 'Rusty robot'],
  ['🦂', 'Scorpion des sables', 'Sand scorpion'], ['🦖', 'Dino grognon', 'Grumpy dino'], ['🧌', 'Troll des ponts', 'Bridge troll'],
  ['🦑', 'Calmar géant', 'Giant squid'], ['🐍', 'Serpent rusé', 'Sly snake'], ['🕷️', 'Araignée tisseuse', 'Weaver spider'],
];
const BOSS = ['👹', 'Oni gardien', 'Guardian oni'];
const FINAL = ['🐉', 'Dragon des langues', 'Language dragon'];
const HEARTS = 5;

const hash = (s) => [...String(s)].reduce((h, c) => (h * 31 + c.codePointAt(0)) >>> 0, 7);
export const battleMode = () => document.documentElement.dataset.style === 'quest';

/** Installe l'arène au-dessus des questions. Renvoie { hit(ok, combo), end(ratio, passed) }. */
export function battle(el, { total, exam, title }) {
  const final = !!exam?.final;
  const [emoji, fr, en] = exam ? (final ? FINAL : BOSS) : MONSTERS[hash(title) % MONSTERS.length];
  const name = L(fr, en);
  let hp = total;
  let hearts = HEARTS;
  const arena = document.createElement('div');
  arena.className = `arena ${exam ? 'boss' : ''}`;
  arena.innerHTML = `
    <div class="b-mon"><span class="b-emoji" aria-hidden="true">${emoji}</span></div>
    <div class="b-info">
      <b class="b-name">${exam ? '⚔️ ' : ''}${name}</b>
      <span class="b-hp" role="meter" aria-label="${L('Points de vie du monstre', 'Monster health')}"><i></i></span>
    </div>
    <div class="b-hearts" aria-label="${L('Cœurs', 'Hearts')}">${'<i>❤️</i>'.repeat(HEARTS)}</div>`;
  el.querySelector('.qbar')?.after(arena);
  const mon = arena.querySelector('.b-mon');
  const bar = arena.querySelector('.b-hp i');
  const setHp = () => { bar.style.width = `${Math.max(0, hp / total) * 100}%`; arena.classList.toggle('low', hp / total <= 0.3); };
  setHp();

  const replay = (node, cls) => { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); };
  const float = (text, cls) => {
    const d = document.createElement('span');
    d.className = `b-dmg ${cls}`;
    d.textContent = text;
    mon.append(d);
    setTimeout(() => d.remove(), 900);
  };

  return {
    hit(ok, combo) {
      if (ok) {
        hp = Math.max(0, hp - 1);
        setHp();
        replay(mon, 'hurt');
        float(combo >= 3 ? L(`Critique ! ×${combo}`, `Critical! ×${combo}`) : '-1', combo >= 3 ? 'crit' : '');
        if (hp === 0) arena.classList.add('ko');
      } else {
        hearts = Math.max(0, hearts - 1);
        const h = arena.querySelectorAll('.b-hearts i')[hearts];
        h?.classList.add('lost');
        replay(arena, 'ouch');
        replay(mon, 'taunt');
      }
    },
    /** Bandeau de fin de combat (au-dessus du score). */
    end(ratio, passed) {
      const win = exam ? passed : true;
      const lost = HEARTS - hearts;
      const verdict = win
        ? (exam ? L('Boss vaincu !', 'Boss defeated!') : L('Victoire !', 'Victory!'))
        : L('Le boss a résisté…', 'The boss held on…');
      const sub = win
        ? (lost === 0 ? L('Sans perdre un seul cœur !', 'Without losing a single heart!') : L(`${hearts} cœur${hearts > 1 ? 's' : ''} restant${hearts > 1 ? 's' : ''}`, `${hearts} heart${hearts > 1 ? 's' : ''} left`))
        : L('Reviens plus fort : réessaie quand tu veux.', 'Come back stronger: try again anytime.');
      return `
        <div class="b-result ${win ? 'win' : 'lose'}">
          <span class="b-res-m" aria-hidden="true">${win ? '🏆' : emoji}</span>
          <b>${verdict}</b>
          <small>${sub}</small>
          <span class="b-res-h" aria-hidden="true">${'❤️'.repeat(hearts)}${'🖤'.repeat(lost)}</span>
          ${win && ratio >= 0.7 ? `<span class="b-chest" aria-hidden="true">🎁</span>` : ''}
        </div>`;
    },
  };
}

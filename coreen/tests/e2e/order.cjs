// Ordre des exercices (navigateur réel) : une lettre, un kanji ou un mot jamais vu est toujours présenté
// (carte « Nouveau » : tracé, son, sens) AVANT la première question qui le concerne, à l'écrit comme à l'oral.
// Le micro est simulé, pour que les questions orales soient vraiment posées.
// Usage : servir le dossier (python3 -m http.server 8090), puis  node tests/e2e/order.cjs http://localhost:8090
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8090';
const ROUTES = {
  ko: ['hquiz?set=vowels', 'hquiz?set=consonants', 'hquiz?set=compound', 'hquiz?set=double', 'hquiz?set=vowels&mode=speak',
    'hquiz?set=consonants&mode=type', 'hquiz?set=words', 'quiz?t=all', 'quiz?t=food', 'quiz?t=food&mode=speak', 'quiz?t=all&mode=type', 'quiz?t=all&mode=dictation'],
  ja: ['hquiz?set=base', 'hquiz?set=voiced', 'hquiz?set=combo', 'hquiz?set=base&mode=speak', 'hquiz?set=base&mode=type',
    'hquiz?set=kanji-num', 'hquiz?set=kanji-body', 'hquiz?set=kanji-num&mode=speak', 'hquiz?set=words', 'quiz?t=all', 'quiz?t=food', 'quiz?t=food&mode=speak'],
};
const RUNS = 6; // chaque série est tirée au hasard : plusieurs tirages par écran

(async () => {
  const browser = await chromium.launch();
  const failures = [];
  let checked = 0;
  for (const course of Object.keys(ROUTES)) {
    for (const oral of [true, false]) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.addInitScript(([c, mic]) => {
        if (mic) { // micro simulé : la reconnaissance vocale existe (elle ne sera jamais lancée ici)
          window.SpeechRecognition = class { start() {} stop() {} abort() {} addEventListener() {} };
        }
        localStorage.setItem('haru.v1', JSON.stringify({ v: 2, goal: 20, settings: { sound: false, motion: false, autoplay: false, lang: 'fr', course: c, speech: true, onboarded: true }, courses: { ko: { xp: 0 }, ja: { xp: 0 } } }));
      }, [course, oral]);
      for (const route of ROUTES[course]) {
        for (let run = 0; run < RUNS; run++) {
          await page.goto(`${BASE}/?r=${run}${oral ? 'm' : ''}#/${route}`);
          const ok = await page.waitForSelector('.quiz', { timeout: 8000 }).then(() => true, () => false);
          if (!ok) { failures.push(`${course}/${route} : quiz non affiché`); break; }
          const bad = await page.evaluate(async () => {
            const { lastSeries } = await import('/js/quiz.js');
            const qs = lastSeries.questions;
            const taughtAt = new Map();
            qs.forEach((q, i) => { if (q.type === 'teach' && q.teaches != null && !taughtAt.has(q.teaches)) taughtAt.set(q.teaches, i); });
            // tout ce qu'une question touche : ses éléments à apprendre, et ceux des autres questions sur le même mot ou la même lettre
            const byWid = new Map();
            for (const q of qs) for (const L of q.learn || []) if (q.wid) byWid.set(q.wid, [...(byWid.get(q.wid) || []), L.id]);
            const out = [];
            qs.forEach((q, i) => {
              if (q.type === 'teach') return;
              const ids = new Set([...(q.learn || []).map((L) => L.id), ...(q.wid ? byWid.get(q.wid) || [] : [])]);
              for (const id of ids) {
                if (!taughtAt.has(id)) continue; // déjà connu : pas de carte
                if (taughtAt.get(id) > i) out.push(`question ${i + 1} (${q.type}) posée avant la carte « Nouveau » de ${id} (${taughtAt.get(id) + 1})`);
              }
            });
            // par le contenu : la première question qui affiche l'élément (énoncé ou bonne réponse) vient après sa carte
            const glyphs = new Map();
            for (const q of qs) for (const L of q.learn || []) glyphs.set(L.id, L.x?.j || L.k?.j || L.w?.tl);
            const strip = (h) => String(h || '').replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '').trim();
            for (const [id, at] of taughtAt) {
              const g = glyphs.get(id);
              if (!g) continue;
              const first = qs.findIndex((q) => q.type !== 'teach' && (strip(q.prompt) === g || (q.options && q.options[q.correct]?.label === g)));
              if (first >= 0 && first < at) out.push(`« ${g} » affiché à la question ${first + 1} (${qs[first].type}) avant sa carte « Nouveau » (${at + 1})`);
            }
            // à l'oral : un mot ou une lettre jamais vus n'est pas demandé sans avoir été montré avant
            qs.forEach((q, i) => {
              if (q.type !== 'speak' || !q.fresh) return;
              const shown = qs.slice(0, i).some((o) => o.type !== 'speak' && (o.wid === q.wid || (o.wids || []).includes(q.wid) || (o.type === 'teach' && (q.learn || []).some((L) => L.id === o.teaches))));
              if (!shown) out.push(`question orale ${i + 1} sur ${q.wid} sans présentation avant`);
            });
            return { out, n: qs.length, speak: qs.filter((q) => q.type === 'speak').length };
          });
          checked++;
          if (oral && /speak/.test(route) && !bad.speak) failures.push(`${course}/#/${route} : aucune question orale malgré le micro`);
          for (const m of bad.out) failures.push(`${course}/${oral ? 'micro' : 'sans micro'}/#/${route} : ${m}`);
        }
      }
      for (const e of errors) failures.push(`${course} : erreur : ${e}`);
      await page.close();
    }
  }
  // Appuyer plusieurs fois sur « Vérifier » ne valide la question qu'une fois (ni série ni XP en trop).
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.addInitScript(() => localStorage.setItem('haru.v1', JSON.stringify({ v: 2, goal: 20, settings: { lang: 'fr', course: 'ko', onboarded: true, motion: false, sound: false }, courses: { ko: { xp: 0 }, ja: { xp: 0 } } })));
    await page.goto(`${BASE}/#/hquiz?set=vowels&mode=type`);
    await page.waitForSelector('.quiz');
    for (let k = 0; k < 30; k++) {
      const teach = await page.$('.teach-next');
      if (teach) { await teach.click(); continue; }
      if (!(await page.$('.check-btn'))) break;
      const before = parseInt(await page.textContent('.qcount'), 10);
      for (let h = 0; h < 4 && await page.$eval('.check-btn', (x) => x.disabled); h++) await page.click('.hint-btn');
      for (let i = 0; i < 5; i++) await page.$eval('.check-btn', (x) => x.click());
      await page.evaluate(() => document.querySelector('.sheet:not([hidden]) .sheet-next')?.click());
      await page.waitForTimeout(80);
      const now = await page.$('.qcount') ? parseInt(await page.textContent('.qcount'), 10) : before + 1;
      if (now > before + 1) { failures.push(`ko/#/hquiz?set=vowels&mode=type : 5 appuis sur « Vérifier » ont avancé de ${now - before} questions`); break; }
      checked++;
    }
    await page.close();
  }
  await browser.close();
  if (failures.length) {
    console.error(`${failures.length} problème(s) :\n` + [...new Set(failures)].slice(0, 40).join('\n'));
    process.exit(1);
  }
  console.log(`Ordre des exercices correct (${checked} séries vérifiées, avec et sans micro).`);
})();

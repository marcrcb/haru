// Tests d'écrans (navigateur réel) : chaque écran s'affiche sans erreur, sans débordement horizontal,
// avec un contraste suffisant (WCAG AA), en coréen et en japonais, clair et sombre, téléphone et ordinateur.
// Usage : servir le dossier (python3 -m http.server 8090), puis  node tests/e2e/smoke.cjs http://localhost:8090
// Prérequis : playwright et axe-core (npm i --no-save playwright axe-core).
const { chromium } = require('playwright');
const axeSource = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const BASE = process.argv[2] || 'http://localhost:8090';
const ROUTES = ['road', 'hangul', 'words', 'phrases', 'profile', 'settings', 'guide', 'guide?id=syllabe', 'lexicon',
  'quiz?t=all', 'quiz?mode=review', 'hquiz?set=vowels', 'cards?t=food', 'pairs', 'exam?u=final', 'placement', 'placement?k=script', 'story?id=COURSE-3'];
const VIEWPORTS = [[390, 844], [1280, 800]];

(async () => {
  const browser = await chromium.launch();
  const failures = [];
  for (const course of ['ko', 'ja']) {
    for (const theme of ['light', 'dark']) {
      for (const [w, h] of VIEWPORTS) {
        const page = await browser.newPage({ viewport: { width: w, height: h } });
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
        await page.addInitScript(([c, th]) => {
          localStorage.setItem('haru.v1', JSON.stringify({ v: 2, goal: 20, settings: { roman: true, sound: false, rate: 0.85, theme: th, krLarge: false, motion: false, autoplay: false, lang: 'fr', course: c, speech: true, onboarded: true }, courses: { ko: { xp: 120 }, ja: { xp: 120 } } }));
        }, [course, theme]);
        for (const r of ROUTES) {
          const route = r.replace('COURSE', course);
          const where = `${course}/${theme}/${w}px/#/${route}`;
          errors.length = 0;
          await page.goto(`${BASE}/?t=${Date.now()}#/${route}`);
          const ok = await page.waitForSelector('#view .screen', { timeout: 8000 }).then(() => true, () => false);
          await page.waitForTimeout(300); // fin des animations d'entrée
          if (!ok) failures.push(`${where} : écran vide`);
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
          if (overflow > 1) failures.push(`${where} : débordement horizontal de ${overflow}px`);
          if (w < 900) { // (les traductions floutées exprès, à dévoiler d'un toucher, ne comptent pas)
            await page.addScriptTag({ content: axeSource });
            const bad = await page.evaluate(async () => (await axe.run({ include: [document], exclude: [['.reveal:not(.shown) .blurred']] }, { runOnly: ['color-contrast'] })).violations.flatMap((v) => v.nodes.map((n) => `${n.target.join(' ')} (${n.any[0]?.data?.contrastRatio})`)));
            if (bad.length) failures.push(`${where} : contraste insuffisant : ${bad.slice(0, 3).join(', ')}`);
          }
          for (const e of errors) failures.push(`${where} : erreur : ${e}`);
        }
        await page.close();
      }
    }
  }
  await browser.close();
  if (failures.length) {
    console.error(`${failures.length} problème(s) :\n` + failures.join('\n'));
    process.exit(1);
  }
  console.log(`Tous les écrans s'affichent correctement (${ROUTES.length} écrans × 2 langues × 2 thèmes × 2 tailles).`);
})();

# Haru (하루) — le coréen et le japonais au quotidien

Application web installable (PWA) pour s’entraîner au **coréen** ou au **japonais** sur iPhone et Android, avec une interface en **français** ou en **anglais**. Au premier lancement, on choisit la langue à apprendre ; chaque langue garde sa propre progression.
Elle fonctionne hors connexion. Toutes les données restent sur le téléphone, sans compte ni serveur.

## Contenu

Tout ce qui suit existe pour les deux langues (hangeul pour le coréen, hiragana et katakana pour le japonais, avec furigana au-dessus des kanji).

- **Alphabet** : voyelles, consonnes, lettres composées et doubles, avec la prononciation (voix coréenne du téléphone), des conseils en français, l’ordre des traits animé et des quiz de lecture.
- **Vocabulaire** : environ 1 400 mots classés en près de 70 thèmes. Trois façons de s’entraîner : quiz (coréen → français, français → coréen, écoute), cartes mémoire à glisser, et jeu des paires contre la montre. Une répétition espacée (boîtes de Leitner) fait revenir plus souvent les mots oubliés.
- **Générateur de phrases**, selon neuf critères (ton, niveau, thème, temps, politesse, forme, genre de phrase, sujet, moment), dont :
  - le niveau ;
  - le thème ;
  - le temps (présent, passé, futur) ;
  - la politesse (poli -요, formel -니다, familier) ;
  - la forme (affirmative, négative, question, envie -고 싶다).

  Chaque phrase est conjuguée et accordée correctement : particules 은/는, 이/가, 을/를 et 에/에서, irrégularités, négations 안 et -지 않다. Elle est accompagnée de sa traduction française, de sa romanisation et d’une explication grammaticale. Trois modes d’exercice : Lire, Traduire, Reconstituer.
- **Parcours** : une carte de modules de difficulté croissante. Chaque étape renvoie à une leçon, un quiz, des cartes mémoire ou une série de phrases ; les quiz donnent 1 à 3 étoiles et chaque module terminé offre un bonus d’XP. Le contenu se règle dans `js/content/roadmap.js`.
- **Écrire pour de bon** : clavier à l’écran collé en bas de l’écran pour écrire les lettres, les mots et des phrases entières, et dictées. Coréen : disposition à deux jeux, appui long pour ㄲ ㄸ ㅃ ㅆ ㅉ ㅒ ㅖ. Japonais : clavier de téléphone à 12 touches (toucher plusieurs fois ou glisser le doigt, touche ゛゜小). L’ordre des traits de chaque lettre s’affiche en animation.
- **Chapitres, examens et platine** : 100 modules par langue rangés en 14 chapitres, du tout début au niveau avancé (les chapitres 12 à 14 font tout écrire sans aide). Chaque module se termine par un examen sans indice, obligatoire : seul un examen réussi (peu d’erreurs permises) valide le module, le fait passer au platine et débloque la suite. Les examens affichent seulement « réussi » ou « pas encore », sans pourcentage. Un examen final, lançable à tout moment, porte sur tout ce qui est terminé.
- **Succès** : 17 badges à cinq paliers (bronze, argent, or, platine, diamant) dans le Profil.
- **À voix haute** : le téléphone écoute (reconnaissance vocale du navigateur) et vérifie qu’il comprend le bon mot ou la bonne lettre. Sans micro, ces exercices sont remplacés par des exercices écrits.
- **Difficulté progressive** : au début du parcours, surtout des choix multiples ; ensuite, de plus en plus d’exercices à écrire (clavier coréen ou japonais), des paires à relier, des syllabes et des mots à remettre dans l’ordre par glisser-déposer ; à la fin, plus aucun choix multiple. Le nombre de questions est fixé par type de série (`SERIES` dans `js/quiz.js`).
- **Apprendre avant d’être interrogé** : avant la première question sur un mot, une lettre ou un kanji jamais vu, une carte « Nouveau » le présente (son, sens, lecture, dessin, ordre des traits). Elle ne compte pas dans le score.
- **Premier lancement** : langue, objectif quotidien (5 à 20 min), niveau ; test de niveau qui valide les premiers chapitres (aussi dans les Réglages). Ensuite, l’application s’ouvre directement sur la dernière langue.
- **Repères officiels** : chaque chapitre indique son niveau indicatif (CECR, TOPIK, JLPT) ; le Profil montre le niveau atteint.
- **Histoires** : une par chapitre (2 à 14), avec Léo à Séoul ou à Tokyo : réplique par réplique (voix, traduction à révéler, sens de chaque mot au toucher, furigana), puis questions de compréhension (`js/content/stories.js`).
- **Voix naturelles** : mots, lettres, exemples et histoires enregistrés par synthèse vocale libre (MeloTTS pour le coréen, Kokoro pour le japonais) et vérifiés un par un par reconnaissance vocale (Whisper) ; sinon, voix du téléphone. Toucher deux fois : plus lent. Génération : `tools/audio-list.mjs` puis `tools/make-audio.py`.
- **Rappels** : rappel quotidien ajouté à l’agenda (tous les téléphones) et notification là où le navigateur le permet ; un jour de repos par semaine protège la série.
- **Nouveaux mots en images** : au premier contact avec un mot concret, on le reconnaît parmi quatre dessins (`js/content/pictures.js`).
- **Sans clavier** : un bouton clavier, en haut des exercices à écrire, remplace le clavier par les morceaux de la réponse à remettre dans l’ordre (ou, pour une seule lettre, à choisir). Le choix est mémorisé.
- **Trou de mémoire** : toucher un mot d’une phrase (ou appuyer longuement sur une étiquette à remettre dans l’ordre) affiche son sens ; pas pendant les examens.
- **Révisions du jour** : répétition espacée longue (révision après 1, 3, 7, 16, 35, 90 puis 180 jours ; on ne monte qu’à une révision due). Les mots, lettres et kanji arrivés à échéance et les fautes forment la séance du jour (carte en haut du Parcours, raccourci « Réviser » sur l’icône), en rappel actif. « Retenu » = deux bonnes réponses d’affilée (objectifs du parcours) ; « maîtrisé » = a tenu au moins trois semaines.
- **Mots par familles** : les thèmes sont rangés en grandes familles repliables (essentiels, gens, maison, ville et voyage…), chacune avec sa progression ; toucher un thème ouvre un volet avec ses cinq exercices expliqués, et « Reprendre » ramène au dernier thème travaillé. Les familles se règlent dans `CATS` (`js/app.js`).
- **À retenir** : à la fin de chaque série, les réponses ratées sont listées, à relire et à réécouter.
- **Progression** : XP, niveaux, série de jours, objectif quotidien et calendrier d’activité. La progression peut être exportée ou restaurée.

## Organisation du code

- `js/content/concepts.js` : vocabulaire partagé (coréen, japonais, français, anglais).
- `js/generator.js` : plan de phrase + traductions française et anglaise.
- `js/lang/ko.js`, `js/lang/ja.js`, `js/lang/kana.js` : rendu propre à chaque langue (conjugaison, particules, écriture).
- `js/content/strings.js` : textes de l’interface en français et en anglais.
- `js/content/guide*.js` : guides de prononciation et de grammaire.

## Tester sur un ordinateur

```bash
cd coreen
python3 -m http.server 8080      # puis ouvrir http://localhost:8080
node --test tests/*.test.js      # tests du moteur (langues, répétition espacée, histoires…)
node tests/e2e/smoke.cjs http://localhost:8080   # tests d’écrans (playwright et axe-core requis)
```

## Mettre l’application en ligne (gratuit, GitHub Pages)

1. Sur GitHub : **Settings → Pages → Source : « GitHub Actions »**.
2. Pousser sur la branche : le workflow `.github/workflows/haru-pages.yml` lance les tests du moteur, prépare une version minifiée (`tools/build.mjs`), la vérifie écran par écran dans un vrai navigateur (`tests/e2e/smoke.cjs` : aucune erreur, aucun débordement, contraste WCAG AA, en coréen et en japonais, clair et sombre, téléphone et ordinateur), puis la publie. Si un test échoue, rien n’est publié. Il est aussi possible de le lancer à la main dans l’onglet **Actions**.
3. L’adresse s’affiche dans le résultat du workflow, par exemple `https://<utilisateur>.github.io/<dépôt>/`.

## Publier sur le Play Store (Android)

**Les mises à jour ne changent pas** : l'application du Play Store est une « Trusted Web Activity », une coque Android qui affiche ce site en plein écran. Chaque modification publiée ici (GitHub Pages) apparaît donc aussi dans l'application du Play Store, sans rien republier. Il ne faut renvoyer un paquet que pour changer le nom, l'icône, ou quand Google demande une version plus récente d'Android (environ une fois par an).

Ce qui ne peut être fait que par le titulaire du compte :

1. **Compte développeur Google Play** ([play.google.com/console](https://play.google.com/console)) : 25 $ une seule fois et vérification d'identité. Un compte personnel récent doit d'abord faire un test fermé avec au moins 12 testeurs pendant 14 jours avant la publication.
2. **Paquet Android** : sur [pwabuilder.com](https://www.pwabuilder.com), saisir `https://marcrcb.github.io/haru/`, puis « Package for stores » → Android. On obtient le paquet `.aab`, la clé de signature (à garder précieusement) et un fichier `assetlinks.json`.
3. **Lien site ↔ application** : `assetlinks.json` doit être servi à la racine du domaine, `https://marcrcb.github.io/.well-known/assetlinks.json`. Pour un site `github.io`, il faut donc un dépôt `marcrcb.github.io` contenant `.well-known/assetlinks.json` (et un fichier `.nojekyll`). Sans ce fichier, l'application s'ouvre avec une barre d'adresse.
4. **Fiche Play Store** : captures d'écran, description, classification du contenu, et l'adresse de la politique de confidentialité : `https://marcrcb.github.io/haru/confidentialite.html` (déjà en ligne : aucune donnée collectée).

## Installer sur le téléphone

- **iPhone (Safari)** : ouvrir l’adresse → bouton Partager → « Sur l’écran d’accueil ».
- **Android (Chrome)** : ouvrir l’adresse → menu ⋮ → « Installer l’application ».

Pour la voix : si aucune voix coréenne n’est installée, en ajouter une dans les réglages de synthèse vocale du téléphone (iPhone : Accessibilité → Contenu énoncé → Voix).

## Mise à jour

Après une modification, changer `VERSION` dans `sw.js` et `APP_VERSION` dans `js/app.js` (affiché en bas des Réglages) pour que les téléphones récupèrent les nouveaux fichiers.

## Crédits


L’ordre des traits des kana et des kanji vient de [KanjiVG](https://kanjivg.tagaini.net) (© Ulrich Apel), sous licence [Creative Commons Attribution-Share Alike 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Les fichiers `js/content/strokes.ja.js` et `js/content/strokes.kanji.js` en sont dérivés et restent sous cette licence.

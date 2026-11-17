// Parcours : modules de difficulté croissante, composés d'étapes qui renvoient aux exercices existants.
// Types d'étape :
//   script  { set }            quiz d'écriture (lettres, syllabes, mots, kanji)
//   lesson  { lesson }         leçon du guide
//   cards   { theme }          cartes mémoire d'un thème
//   words   { theme }          quiz de vocabulaire d'un thème
//   phrase  { title, crit }    trois phrases à reconstituer selon des critères
//   mastery { theme }          objectif : retenir 60 % des mots du thème (suivi par la répétition espacée)
//   pairs                      jeu des paires
//   type    { set | theme }    écrire au clavier : lettres d'un jeu, ou mots d'un thème à partir de leur traduction
//   dictation { theme }        dictée : écrire au clavier les mots entendus
//   ptype   { title, crit }    trois phrases à écrire entièrement au clavier
//   speak   { set | theme }    prononcer à voix haute les lettres d'un jeu ou les mots d'un thème (le téléphone écoute)
// Chaque module se termine par un examen (ajouté automatiquement dans road.js) : réussi, il valide le module.
// Les modules sont rangés en chapitres (CHAPTERS, en bas du fichier).
// L'identifiant d'une étape (id) sert de clé de sauvegarde : ne pas le changer.

import { STORIES } from './stories.js';

const L = (fr, en) => ({ fr, en });
const script = (id, set) => ({ id, kind: 'script', set });
const lesson = (id) => ({ id: `l-${id}`, kind: 'lesson', lesson: id });
const cards = (theme) => ({ id: `c-${theme}`, kind: 'cards', theme });
const words = (theme) => ({ id: `w-${theme}`, kind: 'words', theme });
const phrase = (id, title, crit) => ({ id, kind: 'phrase', title, crit });
const mastery = (theme) => ({ id: `m-${theme}`, kind: 'mastery', theme });
// Un thème de vocabulaire complet : découvrir (cartes), s'entraîner (quiz), retenir (objectif)
const theme = (t) => [cards(t), words(t), mastery(t)];
const typeS = (set) => ({ id: `ty-${set}`, kind: 'type', set });
const typeW = (t) => ({ id: `t-${t}`, kind: 'type', theme: t });
const dict = (t) => ({ id: `d-${t}`, kind: 'dictation', theme: t });
const ptype = (id, title, crit) => ({ id, kind: 'ptype', title, crit });
const speakW = (t) => ({ id: `v-${t}`, kind: 'speak', theme: t });
const speakS = (set) => ({ id: `vs-${set}`, kind: 'speak', set });
// Thème approfondi : découvrir, reconnaître, écrire, comprendre à l'oreille, retenir
const themePlus = (t) => [cards(t), words(t), typeW(t), dict(t), speakW(t), mastery(t)];
// Phrases toutes faites : découvrir, reconnaître, comprendre à l'oreille, retenir
const phrasePlus = (t) => [cards(t), words(t), dict(t), speakW(t), mastery(t)];

const KO = [
  {
    id: 'ko1', glyph: '한글', color: 'var(--c-hangul)',
    title: L('Les lettres du hangeul', 'The hangul letters'), sub: L('Voyelles, consonnes, premières syllabes', 'Vowels, consonants, first syllables'),
    // Les lettres d'abord (chacune présentée avant d'être demandée), puis la leçon qui les assemble en syllabes.
    steps: [script('s-vowels', 'vowels'), script('s-consonants', 'consonants'), lesson('syllabe'), lesson('ieung'), script('s-syllables', 'syllables')],
  },
  {
    id: 'ko2', glyph: '읽기', color: 'var(--c-guide)',
    title: L('Lire pour de bon', 'Reading for real'), sub: L('Lettres composées, consonnes finales, vrais mots', 'Compound letters, final consonants, real words'),
    steps: [script('s-compound', 'compound'), script('s-double', 'double'), lesson('series'), lesson('sonores'), lesson('finales'), lesson('double-batchim'), script('s-words', 'words')],
  },
  {
    id: 'ko3', glyph: '안녕', color: 'var(--c-words)',
    title: L('Premiers mots', 'First words'), sub: L('Les essentiels et la phrase la plus simple', 'The essentials and the simplest sentence'),
    steps: [cards('basics'), words('basics'), lesson('ordre'), lesson('etre'), phrase('p-first', L('Premières phrases', 'First sentences'), { level: '1' })],
  },
  {
    id: 'ko4', glyph: '일상', color: 'var(--c-home)',
    title: L('Le quotidien', 'Everyday life'), sub: L('Parler de sa journée au présent', 'Talking about your day in the present'),
    steps: [cards('daily'), words('daily'), lesson('theme'), lesson('present'), lesson('politesse'), lesson('adjectifs'), phrase('p-daily', L('Phrases du quotidien', 'Everyday sentences'), { level: '1', theme: 'daily', tense: 'present' })],
  },
  {
    id: 'ko5', glyph: '음식', color: 'var(--c-phrases)',
    title: L('À table', 'At the table'), sub: L('La nourriture, l’objet 을/를 et les nombres', 'Food, the object 을/를 and numbers'),
    steps: [cards('food'), words('food'), lesson('objet'), lesson('nombres'), lesson('compteurs'), phrase('p-food', L('Commander et manger', 'Ordering and eating'), { level: '2', theme: 'food' })],
  },
  {
    id: 'ko6', glyph: '도시', color: 'var(--c-stats)',
    title: L('En ville', 'Around town'), sub: L('Les lieux, 에/에서 et les liaisons', 'Places, 에/에서 and linking sounds'),
    steps: [cards('city'), words('city'), lesson('lieu'), lesson('particules'), lesson('liaison'), phrase('p-city', L('Se déplacer', 'Getting around'), { level: '2', theme: 'city' })],
  },
  {
    id: 'ko7', glyph: '시간', color: 'var(--c-hangul)',
    title: L('Hier et demain', 'Yesterday and tomorrow'), sub: L('Le passé, le futur et les loisirs', 'Past, future and leisure'),
    steps: [lesson('passe'), phrase('p-past', L('Raconter au passé', 'Telling it in the past'), { level: '2', tense: 'past' }), cards('leisure'), words('leisure'), lesson('futur'), lesson('dates'), phrase('p-future', L('Faire des projets', 'Making plans'), { level: '2', tense: 'future' })],
  },
  {
    id: 'ko8', glyph: '대화', color: 'var(--c-guide)',
    title: L('Nuancer', 'Adding nuance'), sub: L('Dire non, dire ce qu’on veut, poser des questions', 'Saying no, saying what you want, asking questions'),
    steps: [lesson('negation'), phrase('p-neg', L('Phrases négatives', 'Negative sentences'), { level: '2', form: 'neg' }), lesson('envie'), phrase('p-want', L('Dire ses envies', 'Saying what you want'), { level: '2', form: 'want' }), lesson('questions'), phrase('p-question', L('Poser des questions', 'Asking questions'), { level: '2', form: 'question' }), lesson('connecteurs'), cards('study'), words('study')],
  },
  {
    id: 'ko8b', glyph: '부탁', color: 'var(--c-phrases)',
    title: L('Demander et comparer', 'Asking and comparing'), sub: L('Ordres polis, obligations, capacités, comparaisons', 'Polite requests, obligations, abilities, comparisons'),
    steps: [lesson('imperatif'), lesson('obligation'), lesson('pouvoir'), lesson('progressif'), lesson('comparaison'), phrase('p-mixed', L('Phrases variées', 'Mixed sentences'), { level: '2' })],
  },
  {
    id: 'ko9', glyph: '발음', color: 'var(--c-words)',
    title: L('Prononcer comme il faut', 'Sounding right'), sub: L('Les règles de prononciation avancées', 'The advanced pronunciation rules'),
    steps: [lesson('hieut'), lesson('nasal'), lesson('rieul'), lesson('tension'), lesson('palatal'), lesson('n-insertion'), lesson('ui'), { id: 'g-pairs', kind: 'pairs' }],
  },
  {
    id: 'ko10', glyph: '고급', color: 'var(--c-home)',
    title: L('Aller plus loin', 'Going further'), sub: L('Irréguliers, intonation et phrases avancées', 'Irregulars, intonation and advanced sentences'),
    steps: [lesson('voyelles'), lesson('si'), lesson('rythme'), lesson('irreguliers'), phrase('p-advanced', L('Phrases avancées', 'Advanced sentences'), { level: '3' }), ptype('pt-mix', L('Écrire des phrases variées', 'Writing mixed sentences'), { level: '2' })],
  },
  {
    id: 'ko11', glyph: '문장', color: 'var(--c-stats)',
    title: L('Phrases complexes', 'Complex sentences'), sub: L('Relatives, nominalisation, temps, cause, condition', 'Relative clauses, nominalisation, time, cause, condition'),
    steps: [lesson('determinatif'), lesson('nominalisation'), lesson('temps-clauses'), lesson('cause'), lesson('conditions'), phrase('p-complex', L('Phrases longues', 'Long sentences'), { level: '3', tense: 'past' })],
  },
  {
    id: 'ko12', glyph: '느낌', color: 'var(--c-hangul)',
    title: L('Exprimer les nuances', 'Expressing nuance'), sub: L('Intention, expérience, services, suppositions, fins de phrase', 'Intention, experience, favours, conjecture, sentence endings'),
    steps: [lesson('intention'), lesson('experience'), lesson('donner'), lesson('conjecture'), lesson('fins'), phrase('p-nuance', L('Envies et questions', 'Wishes and questions'), { level: '3', form: 'want' })],
  },
  {
    id: 'ko13', glyph: '존댓말', color: 'var(--c-guide)',
    title: L('Les registres', 'Registers'), sub: L('Honorifiques, discours rapporté, passif, style écrit', 'Honorifics, reported speech, passive, written style'),
    steps: [lesson('honorifiques'), lesson('rapporte'), lesson('passif'), lesson('neutre'), phrase('p-formal', L('Phrases formelles', 'Formal sentences'), { level: '3', style: 'formal' })],
  },
];

const JA = [
  {
    id: 'ja1', glyph: 'かな', color: 'var(--c-hangul)',
    title: L('Les kana de base', 'The basic kana'), sub: L('Trois écritures, cinq voyelles, les premiers signes', 'Three scripts, five vowels, the first characters'),
    steps: [lesson('ecritures'), lesson('voyelles'), script('s-base', 'base'), lesson('sons-difficiles'), script('s-syllables', 'syllables')],
  },
  {
    id: 'ja2', glyph: '読む', color: 'var(--c-guide)',
    title: L('Lire pour de bon', 'Reading for real'), sub: L('Sons voisés, sons combinés, vrais mots', 'Voiced sounds, combined sounds, real words'),
    steps: [lesson('dakuten'), script('s-voiced', 'voiced'), lesson('yoon'), script('s-combo', 'combo'), lesson('tsu'), lesson('longues'), lesson('n'), lesson('rendaku'), script('s-words', 'words')],
  },
  {
    id: 'ja3', glyph: '初め', color: 'var(--c-words)',
    title: L('Premiers mots', 'First words'), sub: L('Les essentiels et la phrase la plus simple', 'The essentials and the simplest sentence'),
    steps: [cards('basics'), words('basics'), lesson('ordre'), lesson('desu'), phrase('p-first', L('Premières phrases', 'First sentences'), { level: '1' })],
  },
  {
    id: 'ja4', glyph: '日常', color: 'var(--c-home)',
    title: L('Le quotidien', 'Everyday life'), sub: L('は et が, les verbes en ます', 'は and が, the ます verbs'),
    steps: [cards('daily'), words('daily'), lesson('wa-ga'), lesson('masu'), lesson('particules'), phrase('p-daily', L('Phrases du quotidien', 'Everyday sentences'), { level: '1', theme: 'daily', tense: 'present' })],
  },
  {
    id: 'ja5', glyph: '食事', color: 'var(--c-phrases)',
    title: L('À table', 'At the table'), sub: L('La nourriture, を et les premiers kanji', 'Food, を and the first kanji'),
    steps: [cards('food'), words('food'), lesson('wo'), lesson('nombres'), lesson('compteurs-ja'), script('s-kanjiNum', 'kanjiNum'), phrase('p-food', L('Commander et manger', 'Ordering and eating'), { level: '2', theme: 'food' })],
  },
  {
    id: 'ja6', glyph: '町', color: 'var(--c-stats)',
    title: L('En ville', 'Around town'), sub: L('Les lieux, に et で, les kanji des gens et des lieux', 'Places, に and で, kanji for people and places'),
    steps: [cards('city'), words('city'), lesson('ni-de'), lesson('particules-plus'), script('s-kanjiLife', 'kanjiLife'), phrase('p-city', L('Se déplacer', 'Getting around'), { level: '2', theme: 'city' })],
  },
  {
    id: 'ja7', glyph: '時間', color: 'var(--c-hangul)',
    title: L('Hier et demain', 'Yesterday and tomorrow'), sub: L('Le passé, le futur et les loisirs', 'Past, future and leisure'),
    steps: [lesson('temps'), phrase('p-past', L('Raconter au passé', 'Telling it in the past'), { level: '2', tense: 'past' }), cards('leisure'), words('leisure'), lesson('dates-ja'), phrase('p-future', L('Faire des projets', 'Making plans'), { level: '2', tense: 'future' })],
  },
  {
    id: 'ja8', glyph: '会話', color: 'var(--c-guide)',
    title: L('Nuancer', 'Adding nuance'), sub: L('Adjectifs, envies, questions et négations', 'Adjectives, wishes, questions and negatives'),
    steps: [lesson('adjectifs'), lesson('tai'), phrase('p-want', L('Dire ses envies', 'Saying what you want'), { level: '2', form: 'want' }), lesson('questions'), phrase('p-question', L('Poser des questions', 'Asking questions'), { level: '2', form: 'question' }), cards('study'), words('study'), script('s-kanjiAction', 'kanjiAction'), phrase('p-neg', L('Phrases négatives', 'Negative sentences'), { level: '2', form: 'neg' })],
  },
  {
    id: 'ja8b', glyph: 'て形', color: 'var(--c-phrases)',
    title: L('La forme en て', 'The て form'), sub: L('Enchaîner, demander, décrire ce qui est en cours', 'Chaining, requesting, describing what is going on'),
    steps: [lesson('te'), lesson('teiru'), lesson('liaisons'), lesson('devenir'), lesson('comparaison-ja'), phrase('p-mixed', L('Phrases variées', 'Mixed sentences'), { level: '2' })],
  },
  {
    id: 'ja9', glyph: '上級', color: 'var(--c-home)',
    title: L('Aller plus loin', 'Going further'), sub: L('Style familier, prononciation fine, phrases avancées', 'Casual style, fine pronunciation, advanced sentences'),
    steps: [lesson('familier'), lesson('nai'), lesson('permission'), lesson('potentiel'), lesson('muettes'), lesson('accent'), { id: 'g-pairs', kind: 'pairs' }, phrase('p-advanced', L('Phrases avancées', 'Advanced sentences'), { level: '3' }), ptype('pt-mix', L('Écrire des phrases variées', 'Writing mixed sentences'), { level: '2' })],
  },
  {
    id: 'ja10', glyph: '文', color: 'var(--c-stats)',
    title: L('Phrases complexes', 'Complex sentences'), sub: L('Relatives, nominalisation, conditions, temps, citation', 'Relative clauses, nominalisation, conditionals, time, quotation'),
    steps: [lesson('relative'), lesson('nominaliser'), lesson('conditionnel'), lesson('temps-ja'), lesson('citation'), phrase('p-complex', L('Phrases longues', 'Long sentences'), { level: '3', tense: 'past' })],
  },
  {
    id: 'ja11', glyph: '気持ち', color: 'var(--c-hangul)',
    title: L('Exprimer les nuances', 'Expressing nuance'), sub: L('Intention, essais, services, suppositions, explications', 'Intention, trying, favours, conjecture, explanation'),
    steps: [lesson('volitif'), lesson('experience-ja'), lesson('donner-ja'), lesson('apparence'), lesson('explication'), phrase('p-nuance', L('Envies et questions', 'Wishes and questions'), { level: '3', form: 'want' })],
  },
  {
    id: 'ja12', glyph: '敬語', color: 'var(--c-guide)',
    title: L('Les registres', 'Registers'), sub: L('Transitif et intransitif, passif, keigo, style écrit', 'Transitive and intransitive, passive, keigo, written style'),
    steps: [lesson('transitif'), lesson('passif-ja'), lesson('keigo'), lesson('ecrit-ja'), phrase('p-casual', L('Phrases familières', 'Casual sentences'), { level: '3', style: 'casual' })],
  },
];

// ---------- Modules de vocabulaire et de phrases, intercalés dans le parcours ----------
// [identifiant du module après lequel insérer, module]
const KO_VOCAB = [
  ['ko3', {
    id: 'kov1', glyph: '인사', color: 'var(--c-guide)',
    title: L('Se présenter', 'Introducing yourself'), sub: L('Saluer, parler de soi et de sa famille', 'Greeting, talking about yourself and your family'),
    steps: [...theme('phrPolite'), ...theme('family'), ...theme('phrTalk')],
  }],
  ['ko4', {
    id: 'kov2', glyph: '몸', color: 'var(--c-hangul)',
    title: L('Le corps et la maison', 'Body and home'), sub: L('Se décrire, dire où l’on a mal, nommer les objets', 'Describing yourself, saying what hurts, naming objects'),
    steps: [...theme('body'), ...theme('home')],
  }],
  ['ko5', {
    id: 'kov3', glyph: '쇼핑', color: 'var(--c-phrases)',
    title: L('Faire des achats', 'Going shopping'), sub: L('Vêtements, couleurs, prix, et les phrases du voyageur', 'Clothes, colours, prices and the traveller’s phrases'),
    steps: [...theme('clothes'), ...theme('phrTravel')],
  }],
  ['ko6', {
    id: 'kov4', glyph: '자연', color: 'var(--c-words)',
    title: L('Dehors', 'Out and about'), sub: L('Nature, météo, animaux, jours et moments', 'Nature, weather, animals, days and times'),
    steps: [...theme('nature'), ...theme('animals'), ...theme('time')],
  }],
  ['ko8', {
    id: 'kov5', glyph: '느낌', color: 'var(--c-guide)',
    title: L('Décrire et ressentir', 'Describing and feeling'), sub: L('Adjectifs, émotions et caractère', 'Adjectives, emotions and character'),
    steps: [...theme('describe'), ...theme('feelings')],
  }],
  ['ko8b', {
    id: 'kov6', glyph: '동사', color: 'var(--c-hangul)',
    title: L('Agir et se débrouiller', 'Acting and getting by'), sub: L('Les verbes du quotidien et les phrases en cas de pépin', 'Everyday verbs and phrases for when things go wrong'),
    steps: [...theme('actions'), ...theme('phrHelp')],
  }],
  ['ko10', {
    id: 'kov7', glyph: '사회', color: 'var(--c-stats)',
    title: L('Travail et société', 'Work and society'), sub: L('Métiers, actualité, idées', 'Jobs, news, ideas'),
    steps: [...theme('work'), phrase('p-work', L('Phrases du travail', 'Work sentences'), { level: '3', theme: 'study' })],
  }],
];

const JA_VOCAB = [
  ['ja3', {
    id: 'jav1', glyph: '挨拶', color: 'var(--c-guide)',
    title: L('Se présenter', 'Introducing yourself'), sub: L('Saluer, parler de soi et de sa famille', 'Greeting, talking about yourself and your family'),
    steps: [...theme('phrPolite'), ...theme('family'), script('s-kanji-people', 'kanji-people'), ...theme('phrTalk')],
  }],
  ['ja4', {
    id: 'jav2', glyph: '体', color: 'var(--c-hangul)',
    title: L('Le corps et la maison', 'Body and home'), sub: L('Se décrire, dire où l’on a mal, nommer les objets', 'Describing yourself, saying what hurts, naming objects'),
    steps: [...theme('body'), script('s-kanji-body', 'kanji-body'), ...theme('home')],
  }],
  ['ja5', {
    id: 'jav3', glyph: '買い物', color: 'var(--c-phrases)',
    title: L('Faire des achats', 'Going shopping'), sub: L('Vêtements, couleurs, prix, et les phrases du voyageur', 'Clothes, colours, prices and the traveller’s phrases'),
    steps: [...theme('clothes'), script('s-kanji-quality', 'kanji-quality'), ...theme('phrTravel')],
  }],
  ['ja6', {
    id: 'jav4', glyph: '自然', color: 'var(--c-words)',
    title: L('Dehors', 'Out and about'), sub: L('Nature, météo, animaux, jours et moments', 'Nature, weather, animals, days and times'),
    steps: [...theme('nature'), script('s-kanji-nature', 'kanji-nature'), ...theme('animals'), ...theme('time'), script('s-kanji-time', 'kanji-time'), script('s-kanji-places', 'kanji-places')],
  }],
  ['ja8', {
    id: 'jav5', glyph: '気持ち', color: 'var(--c-guide)',
    title: L('Décrire et ressentir', 'Describing and feeling'), sub: L('Adjectifs, émotions et caractère', 'Adjectives, emotions and character'),
    steps: [...theme('describe'), ...theme('feelings')],
  }],
  ['ja8b', {
    id: 'jav6', glyph: '動詞', color: 'var(--c-hangul)',
    title: L('Agir et se débrouiller', 'Acting and getting by'), sub: L('Les verbes du quotidien et les phrases en cas de pépin', 'Everyday verbs and phrases for when things go wrong'),
    steps: [...theme('actions'), ...theme('phrHelp')],
  }],
  ['ja9', {
    id: 'jav7', glyph: '社会', color: 'var(--c-stats)',
    title: L('Travail et société', 'Work and society'), sub: L('Métiers, actualité, idées, et les kanji de l’école et du travail', 'Jobs, news, ideas, and the kanji of school and work'),
    steps: [...theme('work'), script('s-kanji-study', 'kanji-study'), phrase('p-work', L('Phrases du travail', 'Work sentences'), { level: '3', theme: 'study' })],
  }],
];

// ---------- Nouveaux modules : écriture à la main, clavier, dictées, nouveaux thèmes ----------
// Communs aux deux cours (mêmes thèmes de vocabulaire) ; g : pastilles [coréen, japonais].
const shared = (ja) => {
  const g = (ko, jp) => (ja ? jp : ko);
  const p = ja ? 'ja' : 'ko';
  return [
    // Nouveaux thèmes de vocabulaire (chacun avec ses dessins pour découvrir les mots)
    {
      id: `${p}x1`, glyph: g('과일', '果物'), color: 'var(--c-words)',
      title: L('Fruits et légumes', 'Fruit and vegetables'), sub: L('Au marché : fruits, légumes et couleurs du goût', 'At the market: fruit, vegetables and their flavours'),
      steps: themePlus('fruitveg'),
    },
    {
      id: `${p}x2`, glyph: g('학교', '学校'), color: 'var(--c-stats)',
      title: L('À l’école', 'At school'), sub: L('La classe, les fournitures et les phrases du cours', 'The classroom, school supplies and classroom phrases'),
      steps: [...themePlus('school'), ...phrasePlus('phrClass')],
    },
    {
      id: `${p}x3`, glyph: g('장소', '場所'), color: 'var(--c-stats)',
      title: L('Les lieux de la ville', 'Places in town'), sub: L('Poste, pharmacie, zoo, mairie… savoir où aller', 'Post office, pharmacy, zoo, city hall… knowing where to go'),
      steps: themePlus('places'),
    },
    {
      id: `${p}x4`, glyph: g('식당', '食堂'), color: 'var(--c-phrases)',
      title: L('Au restaurant', 'At the restaurant'), sub: L('Commander, demander, payer', 'Ordering, asking, paying'),
      steps: [...phrasePlus('phrResto'), ptype('pt-resto', L('Écrire ce qu’on mange', 'Writing about what you eat'), { level: '1', theme: 'food' })],
    },
    {
      id: `${p}x5`, glyph: g('취미', '趣味'), color: 'var(--c-phrases)',
      title: L('Passe-temps et musique', 'Hobbies and music'), sub: L('Ce qu’on aime faire, les instruments, les concerts', 'What you like doing, instruments, concerts'),
      steps: [...themePlus('hobbies'), ...theme('music'), dict('music')],
    },
    {
      id: `${p}x6`, glyph: g('바다', '海'), color: 'var(--c-home)',
      title: L('Vacances à la mer', 'Holidays by the sea'), sub: L('La plage, les animaux marins, le port', 'The beach, sea creatures, the harbour'),
      steps: themePlus('beach'),
    },
    {
      id: `${p}x7`, glyph: g('병원', '病院'), color: 'var(--c-hangul)',
      title: L('Chez le médecin', 'At the doctor’s'), sub: L('Dire ce qui ne va pas, comprendre le médecin', 'Saying what’s wrong, understanding the doctor'),
      steps: themePlus('health'),
    },
    {
      id: `${p}x8`, glyph: g('집안일', '家事'), color: 'var(--c-home)',
      title: L('Soins et ménage', 'Personal care and chores'), sub: L('La salle de bain, le linge, le ménage', 'The bathroom, laundry, housework'),
      steps: themePlus('care'),
    },
    {
      id: `${p}x9`, glyph: g('복습', '復習'), color: 'var(--c-hangul)',
      title: L('Atelier d’écriture : ma vie', 'Writing workshop: my life'), sub: L('Écrire ses loisirs, ses courses, l’école et ses projets', 'Writing about hobbies, shopping, school and plans'),
      steps: [typeW('music'), speakW('music'), ptype('pt-hobby', L('Écrire ses loisirs', 'Writing about your free time'), { level: '2', theme: 'leisure' }), ptype('pt-market', L('Écrire ses courses', 'Writing about shopping for food'), { level: '2', theme: 'food' }), ptype('pt-class', L('Écrire sur l’école', 'Writing about school'), { level: '2', theme: 'study' }), ptype('pt-weekend', L('Écrire ses projets du week-end', 'Writing your weekend plans'), { level: '2', theme: 'leisure', tense: 'future' })],
    },
    {
      id: `${p}n1`, glyph: g('숫자', '数'), color: 'var(--c-stats)',
      title: L('Compter', 'Counting'), sub: L('Les nombres, les quantités et leur prononciation', 'Numbers, quantities and how to say them'),
      steps: [...themePlus('numbers'), lesson(ja ? 'compteurs-son' : 'nombres-pron'), ...(ja ? [typeS('kanji-num')] : [])],
    },
    {
      id: `${p}w1`, glyph: g('연습', '練習'), color: 'var(--c-home)',
      title: L('Atelier d’écriture : premiers mots', 'Writing workshop: first words'), sub: L('Écrire au clavier, sans modèle, puis sous la dictée', 'Typing without a model, then from dictation'),
      steps: [typeW('basics'), dict('basics'), typeW('family'), dict('family'), ptype('pt-first', L('Écrire ses premières phrases', 'Writing your first sentences'), { level: '1' })],
    },
    {
      id: `${p}f1`, glyph: g('반말', 'ため口'), color: 'var(--c-words)',
      title: L('Entre amis', 'Among friends'), sub: L('Le style familier, celui des messages et des séries', 'The casual style of text messages and TV dramas'),
      steps: phrasePlus('phrFriends'),
    },
    {
      id: `${p}c1`, glyph: g('요리', '料理'), color: 'var(--c-phrases)',
      title: L('En cuisine', 'In the kitchen'), sub: L('Ingrédients, ustensiles, goûts et gestes', 'Ingredients, utensils, tastes and techniques'),
      steps: themePlus('cooking'),
    },
    {
      id: `${p}s1`, glyph: g('가게', '店'), color: 'var(--c-guide)',
      title: L('Faire les magasins', 'Hitting the shops'), sub: L('Négocier, choisir une couleur, payer', 'Bargaining, picking a colour, paying'),
      steps: [...phrasePlus('phrShop'), ...themePlus('colors')],
    },
    {
      id: `${p}w2`, glyph: g('쓰기', '書く'), color: 'var(--c-home)',
      title: L('Atelier d’écriture : le quotidien', 'Writing workshop: everyday life'), sub: L('Les mots de tous les jours, de mémoire et à l’oreille', 'Everyday words, from memory and by ear'),
      steps: [typeW('daily'), dict('daily'), typeW('food'), dict('food'), typeW('body'), dict('home'), ptype('pt-daily', L('Écrire sa journée', 'Writing about your day'), { level: '1', theme: 'daily', tense: 'present' })],
    },
    {
      id: `${p}t1`, glyph: g('교통', '交通'), color: 'var(--c-stats)',
      title: L('Se déplacer', 'Getting about'), sub: L('Transports, directions, positions', 'Transport, directions, positions'),
      steps: themePlus('transport'),
    },
    {
      id: `${p}t2`, glyph: g('여행', '旅行'), color: 'var(--c-home)',
      title: L('Partir en voyage', 'Going on a trip'), sub: L('Réserver, se loger, visiter', 'Booking, staying, sightseeing'),
      steps: themePlus('trip'),
    },
    {
      id: `${p}sp`, glyph: g('운동', '運動'), color: 'var(--c-words)',
      title: L('Sport et forme', 'Sport and fitness'), sub: L('Disciplines, matchs et entraînement', 'Disciplines, matches and training'),
      steps: themePlus('sports'),
    },
    {
      id: `${p}w3`, glyph: g('받아쓰기', '聞き取り'), color: 'var(--c-hangul)',
      title: L('Atelier d’écriture : dehors', 'Writing workshop: out and about'), sub: L('La ville, la nature et le temps qui passe', 'The city, nature and the passing of time'),
      steps: [typeW('city'), dict('city'), typeW('nature'), dict('animals'), dict('time'), ptype('pt-city', L('Écrire ses déplacements', 'Writing about getting around'), { level: '2', theme: 'city' })],
    },
    {
      id: `${p}l1`, glyph: g('부사', '副詞'), color: 'var(--c-words)',
      title: L('Petits mots, grands effets', 'Small words, big effects'), sub: L('Adverbes, connecteurs et mots interrogatifs', 'Adverbs, connectors and question words'),
      steps: themePlus('linkers'),
    },
    {
      id: `${p}fe`, glyph: g('의견', '意見'), color: 'var(--c-guide)',
      title: L('Donner son avis, fixer un rendez-vous', 'Giving opinions, making plans'), sub: L('Dire ce qu’on ressent, téléphoner, se retrouver', 'Saying how you feel, phoning, meeting up'),
      steps: [...phrasePlus('phrFeel'), ...phrasePlus('phrPhone')],
    },
    {
      id: `${p}w4`, glyph: g('작문', '作文'), color: 'var(--c-phrases)',
      title: L('Atelier d’écriture : raconter', 'Writing workshop: telling stories'), sub: L('Décrire, agir, et écrire des phrases au passé', 'Describing, acting, and writing sentences in the past'),
      steps: [typeW('leisure'), dict('feelings'), typeW('describe'), dict('actions'), ptype('pt-past', L('Écrire au passé', 'Writing in the past'), { level: '2', tense: 'past' }), ptype('pt-neg', L('Écrire des phrases négatives', 'Writing negative sentences'), { level: '2', form: 'neg' })],
    },
    {
      id: `${p}9b`, glyph: g('예외', '読み方'), color: 'var(--c-guide)',
      title: ja ? L('Lectures particulières', 'Special readings') : L('Prononciations particulières', 'Special pronunciations'),
      sub: ja ? L('Lectures on et kun, mots irréguliers, phrases à l’oreille', 'On and kun readings, irregular words, phrases by ear') : L('Les mots qui surprennent, les emprunts, les phrases à l’oreille', 'Surprising words, loanwords, phrases by ear'),
      steps: [lesson(ja ? 'on-kun' : 'pron-exceptions'), lesson(ja ? 'jukujikun' : 'emprunts'), dict('phrPolite'), dict('phrTalk'), dict('phrTravel')],
    },
    {
      id: `${p}te`, glyph: g('기술', '技術'), color: 'var(--c-stats)',
      title: L('Technologie et médias', 'Technology and media'), sub: L('Téléphone, internet, écrans', 'Phone, internet, screens'),
      steps: themePlus('tech'),
    },
    {
      id: `${p}cu`, glyph: g('전통', '伝統'), color: 'var(--c-hangul)',
      title: L('Culture et traditions', 'Culture and traditions'), sub: L('Fêtes, arts, coutumes', 'Festivals, arts, customs'),
      steps: themePlus('culture'),
    },
    {
      id: `${p}w5`, glyph: g('완성', '仕上げ'), color: 'var(--c-phrases)',
      title: L('Grand atelier d’écriture', 'Master writing workshop'), sub: L('Tout écrire : mots, dictées et phrases avancées', 'Writing it all: words, dictations and advanced sentences'),
      steps: [typeW('study'), dict('work'), dict('phrHelp'), ptype('pt-future', L('Écrire ses projets', 'Writing about plans'), { level: '2', tense: 'future' }), ptype('pt-want', L('Écrire ses envies', 'Writing about wishes'), { level: '2', form: 'want' }), ptype('pt-advanced', L('Écrire des phrases avancées', 'Writing advanced sentences'), { level: '3' })],
    },
  ];
};

const KO_NEW = [
  {
    id: 'ko1w', glyph: '쓰기', color: 'var(--c-guide)',
    title: L('Le clavier coréen', 'The Korean keyboard'), sub: L('Taper les lettres et les premières syllabes', 'Typing the letters and first syllables'),
    steps: [typeS('vowels'), typeS('consonants'), speakS('vowels'), typeS('syllables')],
  },
  {
    id: 'ko2w', glyph: '받아쓰기', color: 'var(--c-home)',
    title: L('Écrire pour de bon', 'Writing for real'), sub: L('Lettres composées et doubles, puis des mots sous la dictée', 'Compound and double letters, then words from dictation'),
    steps: [typeS('compound'), typeS('double'), typeS('words'), speakS('words')],
  },
  {
    id: 'ko2b', glyph: '받침', color: 'var(--c-phrases)',
    title: L('Les finales à la loupe', 'Finals under the microscope'), sub: L('Doubles finales, liaisons entre mots, ㅅ intercalaire', 'Double finals, linking between words, the in-between ㅅ'),
    steps: [lesson('double-batchim-plus'), lesson('liaison-mots'), lesson('sai-siot')],
  },
];

const JA_NEW = [
  {
    id: 'ja1w', glyph: 'かく', color: 'var(--c-guide)',
    title: L('Le clavier des kana', 'The kana keyboard'), sub: L('Taper les hiragana et les premières syllabes', 'Typing hiragana and first syllables'),
    steps: [typeS('base'), speakS('base'), typeS('syllables')],
  },
  {
    id: 'ja1k', glyph: 'カナ', color: 'var(--c-home)',
    title: L('Les katakana', 'Katakana'), sub: L('Les katakana, les sons voisés et les mots étrangers', 'Katakana, voiced sounds and foreign words'),
    steps: [lesson('katakana-plus'), typeS('voiced')],
  },
  {
    id: 'ja2w', glyph: '書く', color: 'var(--c-phrases)',
    title: L('Écrire pour de bon', 'Writing for real'), sub: L('Sons combinés, mots sous la dictée, pièges de longueur', 'Combined sounds, words from dictation, length traps'),
    steps: [typeS('combo'), typeS('words'), speakS('words'), lesson('paires'), lesson('yotsugana')],
  },
  {
    id: 'jakw', glyph: '漢字', color: 'var(--c-hangul)',
    title: L('Lire les kanji', 'Reading kanji'), sub: L('Les kanji des gens, du temps, du corps et des actions', 'Kanji for people, time, the body and actions'),
    steps: [typeS('kanji-people'), typeS('kanji-time'), typeS('kanji-body'), typeS('kanji-action')],
  },
];

// ---------- Niveau avancé : chapitres 8 à 14 (50 modules par langue) ----------
// La difficulté monte d'un chapitre à l'autre : nouveaux thèmes (8 à 11), ateliers où l'on écrit, écoute et prononce
// les mots des anciens thèmes (12), puis des phrases générées de plus en plus complexes, à reconstituer puis à écrire (13 et 14).
const advanced = (ja) => {
  const g = (ko, jp) => (ja ? jp : ko);
  const p = ja ? 'ja' : 'ko';
  const formal = ja ? 'polite' : 'formal'; // le japonais n'a pas de style « formel » distinct dans le générateur
  const mod = (id, glyph, color, title, sub, steps) => ({ id: `${p}${id}`, glyph, color, title, sub, steps });
  const vocab = [
    // Chapitre 8 : vivre sur place
    mod('a01', g('날씨', '天気'), 'var(--c-words)', L('Météo et saisons', 'Weather and seasons'), L('Typhons, pluie, chaleur : parler du temps qu’il fait', 'Typhoons, rain, heat: talking about the weather'), themePlus('weather')),
    mod('a02', g('집', '住まい'), 'var(--c-home)', L('Le logement', 'Housing'), L('Louer, déménager, décrire son appartement', 'Renting, moving, describing your flat'), themePlus('housing')),
    mod('a03', g('집에서', '家で'), 'var(--c-home)', L('Phrases de la maison', 'Phrases at home'), L('Ce qu’on se dit en famille, du matin au soir', 'What families say from morning to night'), phrasePlus('phrHome')),
    mod('a04', g('외모', '外見'), 'var(--c-guide)', L('Apparence et caractère', 'Looks and personality'), L('Décrire quelqu’un, au physique et au moral', 'Describing someone’s looks and character'), themePlus('looks')),
    mod('a05', g('온라인', '通販'), 'var(--c-phrases)', L('Achats en ligne', 'Online shopping'), L('Commander, se faire livrer, rendre un article', 'Ordering, getting deliveries, returning items'), themePlus('online')),
    mod('a06', g('은행', '銀行'), 'var(--c-stats)', L('Banque et argent', 'Bank and money'), L('Compte, virement, économies', 'Accounts, transfers, savings'), themePlus('bank')),
    // Chapitre 9 : travail et démarches
    mod('a07', g('회사', '会社'), 'var(--c-stats)', L('Au bureau', 'At the office'), L('Collègues, réunions, dates limites', 'Colleagues, meetings, deadlines'), themePlus('office')),
    mod('a08', g('직장', '職場'), 'var(--c-stats)', L('Phrases du travail', 'Phrases at work'), L('La politesse du bureau, au téléphone et en réunion', 'Office politeness, on the phone and in meetings'), phrasePlus('phrWork')),
    mod('a09', g('서류', '手続き'), 'var(--c-stats)', L('Démarches', 'Paperwork'), L('Formulaires, guichets, papiers d’identité', 'Forms, counters, ID papers'), themePlus('admin')),
    mod('a10', g('기차', '電車'), 'var(--c-home)', L('Train et avion', 'Trains and planes'), L('Quais, sièges, retards et embarquement', 'Platforms, seats, delays and boarding'), themePlus('rail')),
    mod('a11', g('역', '駅'), 'var(--c-home)', L('À la gare et à l’aéroport', 'At the station and airport'), L('Acheter un billet, changer, embarquer', 'Buying tickets, changing, boarding'), phrasePlus('phrStation')),
    mod('a12', g('행사', '行事'), 'var(--c-guide)', L('Fêtes et événements', 'Celebrations and events'), L('Invitations, cérémonies, feux d’artifice', 'Invitations, ceremonies, fireworks'), themePlus('events')),
    // Chapitre 10 : relations et société
    mod('a13', g('사랑', '恋'), 'var(--c-hangul)', L('Amour et amitié', 'Love and friendship'), L('Se rencontrer, se disputer, se réconcilier', 'Meeting, arguing, making up'), themePlus('love')),
    mod('a14', g('데이트', 'デート'), 'var(--c-guide)', L('Sorties et rencontres', 'Going out and dating'), L('Proposer une sortie, dire ce qu’on ressent', 'Suggesting an outing, saying how you feel'), phrasePlus('phrDate')),
    mod('a15', g('SNS', 'SNS'), 'var(--c-guide)', L('Médias et réseaux', 'Media and social networks'), L('Publier, commenter, partager', 'Posting, commenting, sharing'), themePlus('media')),
    mod('a16', g('환경', '環境'), 'var(--c-words)', L('L’environnement', 'The environment'), L('Climat, catastrophes, recyclage', 'Climate, disasters, recycling'), themePlus('environment')),
    mod('a17', g('진료', '診察'), 'var(--c-hangul)', L('En consultation', 'At the clinic'), L('Expliquer ses symptômes, comprendre le traitement', 'Explaining symptoms, understanding treatment'), phrasePlus('phrDoctor')),
    mod('a18', g('과학', '科学'), 'var(--c-stats)', L('Sciences', 'Science'), L('Recherche, espace, inventions', 'Research, space, inventions'), themePlus('science2')),
    // Chapitre 11 : nuancer
    mod('a19', g('부엌', '台所'), 'var(--c-phrases)', L('Cuisiner', 'Cooking techniques'), L('Les gestes de la cuisine et les ustensiles', 'Kitchen techniques and utensils'), themePlus('kitchen')),
    mod('a20', g('동작', '動作'), 'var(--c-hangul)', L('Gestes et mouvements', 'Gestures and movements'), L('Décrire ce que fait le corps', 'Describing what the body does'), themePlus('moves')),
    mod('a21', g('세월', '年月'), 'var(--c-home)', L('Le temps qui passe', 'Time passing by'), L('Passé, avenir, années et moments', 'Past, future, years and moments'), themePlus('eras')),
    mod('a22', g('동사', '動詞'), 'var(--c-hangul)', L('Verbes pour aller plus loin', 'More useful verbs'), L('Décider, expliquer, comparer, renoncer', 'Deciding, explaining, comparing, giving up'), themePlus('verbs2')),
    mod('a23', g('형용사', '形容詞'), 'var(--c-phrases)', L('Adjectifs nuancés', 'Nuanced adjectives'), L('Simple ou compliqué, pareil ou différent', 'Simple or complicated, alike or different'), themePlus('adj2')),
    mod('a24', g('생각', '考え'), 'var(--c-guide)', L('Idées abstraites', 'Abstract ideas'), L('Liberté, réussite, cause et résultat', 'Freedom, success, cause and effect'), themePlus('ideas')),
  ];

  // Chapitre 12 : ateliers — écrire, écouter et prononcer les mots des anciens thèmes (sans aide)
  const work = (id, glyph, title, themes) => mod(id, glyph, 'var(--c-home)', title, L('De mémoire, à l’oreille et à voix haute', 'From memory, by ear and out loud'),
    themes.flatMap((t) => [typeW(t), dict(t), speakW(t)]));
  const workshops = [
    work('b01', g('가족', '家族'), L('Atelier : les gens', 'Workshop: people'), ['family', 'looks', 'feelings']),
    work('b02', g('몸', '体'), L('Atelier : le corps et la santé', 'Workshop: body and health'), ['body', 'health', 'moves', 'food', 'daily']),
    work('b03', g('물건', '物'), L('Atelier : la maison', 'Workshop: the home'), ['home', 'housing', 'care', 'leisure']),
    work('b04', g('쇼핑', '買い物'), L('Atelier : les achats', 'Workshop: shopping'), ['clothes', 'online', 'bank', 'phrTravel', 'phrResto']),
    work('b05', g('자연', '自然'), L('Atelier : la nature', 'Workshop: nature'), ['nature', 'animals', 'weather']),
    work('b06', g('시간', '時間'), L('Atelier : le temps', 'Workshop: time'), ['time', 'eras', 'events', 'city', 'basics']),
    work('b07', g('동사', '動詞'), L('Atelier : les verbes', 'Workshop: verbs'), ['actions', 'verbs2', 'kitchen', 'phrHelp']),
    work('b08', g('형용사', '形容詞'), L('Atelier : décrire', 'Workshop: describing'), ['describe', 'adj2', 'ideas', 'phrFeel', 'phrPhone', 'phrShop']),
    work('b09', g('일', '仕事'), L('Atelier : le travail', 'Workshop: work'), ['work', 'office', 'admin', 'study']),
    work('b10', g('인사', '挨拶'), L('Atelier : phrases de tous les jours', 'Workshop: everyday phrases'), ['phrPolite', 'phrTalk', 'phrHome', 'phrClass', 'phrFriends', 'phrDate']),
  ];

  // Chapitres 13 et 14 : phrases générées, du niveau intermédiaire au niveau avancé, à reconstituer puis à écrire.
  let n = 0;
  const sent = (id, glyph, color, title, sub, specs) => mod(id, glyph, color, title, sub, specs.map(([kind, t, crit]) => {
    n++;
    return (kind === 'w' ? ptype : phrase)(`${p}-a${n}`, t, crit);
  }));
  const S = (fr, en) => L(fr, en);
  const sentences = [
    sent('c01', g('과거', '過去'), 'var(--c-phrases)', L('Raconter sa journée', 'Telling about your day'), L('Le passé, phrase après phrase', 'The past, sentence by sentence'), [
      ['r', S('Hier', 'Yesterday'), { level: '2', tense: 'past', subj: 'me' }], ['r', S('Ce que les amis ont fait', 'What friends did'), { level: '2', tense: 'past', subj: 'friend' }],
      ['w', S('Écrire au passé', 'Write in the past'), { level: '2', tense: 'past' }], ['w', S('Écrire sa soirée', 'Write about your evening'), { level: '2', tense: 'past', theme: 'daily' }]]),
    sent('c02', g('미래', '未来'), 'var(--c-phrases)', L('Parler de ses projets', 'Talking about plans'), L('Le futur et les intentions', 'The future and intentions'), [
      ['r', S('Demain', 'Tomorrow'), { level: '2', tense: 'future' }], ['r', S('Les projets de voyage', 'Travel plans'), { level: '2', tense: 'future', theme: 'city' }],
      ['w', S('Écrire au futur', 'Write in the future'), { level: '2', tense: 'future' }], ['w', S('Écrire ses projets d’études', 'Write about study plans'), { level: '2', tense: 'future', theme: 'study' }]]),
    sent('c03', g('부정', '否定'), 'var(--c-guide)', L('Dire non', 'Saying no'), L('Les phrases négatives à tous les temps', 'Negative sentences in every tense'), [
      ['r', S('Ne pas faire', 'Not doing'), { level: '2', form: 'neg' }], ['r', S('Ne pas avoir fait', 'Not having done'), { level: '2', form: 'neg', tense: 'past' }],
      ['w', S('Écrire une négation', 'Write a negation'), { level: '2', form: 'neg', tense: 'present' }], ['w', S('Écrire ce qu’on ne fera pas', 'Write what you won’t do'), { level: '2', form: 'neg', tense: 'future' }]]),
    sent('c04', g('질문', '質問'), 'var(--c-guide)', L('Poser des questions', 'Asking questions'), L('Interroger sur le présent, le passé, l’avenir', 'Asking about the present, past and future'), [
      ['r', S('Questions simples', 'Simple questions'), { level: '2', form: 'question' }], ['r', S('Questions au passé', 'Questions in the past'), { level: '2', form: 'question', tense: 'past' }],
      ['w', S('Écrire une question', 'Write a question'), { level: '2', form: 'question' }], ['w', S('Écrire une question sur demain', 'Write a question about tomorrow'), { level: '2', form: 'question', tense: 'future' }]]),
    sent('c05', g('희망', '希望'), 'var(--c-words)', L('Exprimer ses envies', 'Expressing wishes'), L('Ce qu’on veut faire, manger, voir', 'What you want to do, eat, see'), [
      ['r', S('J’ai envie de…', 'I want to…'), { level: '2', form: 'want' }], ['r', S('Envies gourmandes', 'Food cravings'), { level: '2', form: 'want', theme: 'food' }],
      ['w', S('Écrire une envie', 'Write a wish'), { level: '2', form: 'want' }], ['w', S('Écrire ses envies de loisirs', 'Write leisure wishes'), { level: '2', form: 'want', theme: 'leisure' }]]),
    sent('c06', g('존댓말', '丁寧語'), 'var(--c-stats)', ja ? L('Rester poli', 'Staying polite') : L('Le style formel', 'The formal style'), ja ? L('La forme です・ます dans toutes les situations', 'The です・ます form in every situation') : L('Les terminaisons -니다 du travail et des annonces', 'The -니다 endings of work and announcements'), [
      ['r', S('Phrases soutenues', 'Formal sentences'), { level: '2', style: formal }], ['r', S('Au passé, poliment', 'Politely in the past'), { level: '2', style: formal, tense: 'past' }],
      ['w', S('Écrire poliment', 'Write politely'), { level: '2', style: formal }], ['w', S('Écrire une question polie', 'Write a polite question'), { level: '2', style: formal, form: 'question' }]]),
    sent('c07', g('반말', 'ため口'), 'var(--c-words)', L('Parler entre amis', 'Talking among friends'), L('Le style familier, sans les terminaisons polies', 'The casual style, without polite endings'), [
      ['r', S('Entre amis', 'Among friends'), { level: '2', style: 'casual' }], ['r', S('Entre amis, au passé', 'Among friends, in the past'), { level: '2', style: 'casual', tense: 'past' }],
      ['w', S('Écrire à un ami', 'Write to a friend'), { level: '2', style: 'casual' }], ['w', S('Demander à un ami', 'Ask a friend'), { level: '2', style: 'casual', form: 'question' }]]),
    sent('c08', g('장소', '場所'), 'var(--c-home)', L('Dire où l’on va', 'Saying where you go'), L('Les déplacements et les lieux', 'Getting around and places'), [
      ['r', S('Aller quelque part', 'Going somewhere'), { level: '2', kind: 'go' }], ['r', S('Y être allé', 'Having gone'), { level: '2', kind: 'go', tense: 'past' }],
      ['w', S('Écrire où l’on va', 'Write where you go'), { level: '2', kind: 'go' }], ['w', S('Écrire où l’on ira', 'Write where you will go'), { level: '2', kind: 'go', tense: 'future' }]]),
    sent('c09', g('묘사', '描写'), 'var(--c-guide)', L('Décrire les choses', 'Describing things'), L('Phrases avec des adjectifs', 'Sentences with adjectives'), [
      ['r', S('C’est comment ?', 'What is it like?'), { level: '2', kind: 'adj' }], ['r', S('C’était comment ?', 'What was it like?'), { level: '2', kind: 'adj', tense: 'past' }],
      ['w', S('Écrire une description', 'Write a description'), { level: '2', kind: 'adj' }], ['w', S('Écrire ce qui n’est pas', 'Write what it isn’t'), { level: '2', kind: 'adj', form: 'neg' }]]),
    // Chapitre 14 : niveau avancé
    sent('d01', g('고급', '上級'), 'var(--c-stats)', L('Phrases longues', 'Long sentences'), L('Sujet, moment, lieu, objet : tout à la fois', 'Subject, time, place, object: all at once'), [
      ['r', S('Phrases avancées', 'Advanced sentences'), { level: '3' }], ['r', S('Avec le moment', 'With the time'), { level: '3', time: 'yes' }],
      ['w', S('Écrire une phrase longue', 'Write a long sentence'), { level: '3' }], ['w', S('Écrire avec le moment', 'Write with the time'), { level: '3', time: 'yes' }]]),
    sent('d02', g('과거', '過去'), 'var(--c-phrases)', L('Raconter en détail', 'Telling in detail'), L('Le passé au niveau avancé', 'The past at advanced level'), [
      ['r', S('Récit au passé', 'Past narrative'), { level: '3', tense: 'past' }], ['r', S('Ce qui n’a pas eu lieu', 'What didn’t happen'), { level: '3', tense: 'past', form: 'neg' }],
      ['w', S('Écrire un récit', 'Write a narrative'), { level: '3', tense: 'past' }], ['w', S('Écrire au passé négatif', 'Write in the negative past'), { level: '3', tense: 'past', form: 'neg' }]]),
    sent('d03', g('계획', '計画'), 'var(--c-phrases)', L('Projets précis', 'Detailed plans'), L('Le futur au niveau avancé', 'The future at advanced level'), [
      ['r', S('Projets avancés', 'Advanced plans'), { level: '3', tense: 'future' }], ['r', S('Questions sur l’avenir', 'Questions about the future'), { level: '3', tense: 'future', form: 'question' }],
      ['w', S('Écrire un projet', 'Write a plan'), { level: '3', tense: 'future' }], ['w', S('Écrire une envie précise', 'Write a precise wish'), { level: '3', form: 'want' }]]),
    sent('d04', g('대화', '会話'), 'var(--c-guide)', L('Conversation', 'Conversation'), L('Questions et réponses au niveau avancé', 'Questions and answers at advanced level'), [
      ['r', S('Questions avancées', 'Advanced questions'), { level: '3', form: 'question' }], ['r', S('Entre amis, avancé', 'Among friends, advanced'), { level: '3', style: 'casual' }],
      ['w', S('Écrire une question avancée', 'Write an advanced question'), { level: '3', form: 'question' }], ['w', S('Répondre en familier', 'Answer casually'), { level: '3', style: 'casual', tense: 'past' }]]),
    sent('d05', g('격식', '敬語'), 'var(--c-stats)', L('Écrire comme au travail', 'Writing like at work'), L('Phrases soutenues et longues', 'Long, formal sentences'), [
      ['r', S('Formel et avancé', 'Formal and advanced'), { level: '3', style: formal }], ['r', S('Formel, au futur', 'Formal, in the future'), { level: '3', style: formal, tense: 'future' }],
      ['w', S('Écrire formellement', 'Write formally'), { level: '3', style: formal }], ['w', S('Écrire une question soutenue', 'Write a formal question'), { level: '3', style: formal, form: 'question' }]]),
    sent('d06', g('일상', '日常'), 'var(--c-home)', L('Grand atelier : le quotidien', 'Master workshop: daily life'), L('Tout écrire, sans aide, sur la vie de tous les jours', 'Writing everything, unaided, about everyday life'), [
      ['w', S('La maison', 'Home'), { level: '3', theme: 'daily' }], ['w', S('À table', 'At the table'), { level: '3', theme: 'food' }],
      ['w', S('Les loisirs', 'Leisure'), { level: '3', theme: 'leisure' }], ['w', S('En ville', 'In town'), { level: '3', theme: 'city' }], ['w', S('Les études', 'Studies'), { level: '3', theme: 'study' }]]),
    sent('d07', g('완성', '完成'), 'var(--c-hangul)', L('Vers la maîtrise', 'Towards mastery'), L('Les phrases les plus difficiles, à écrire sans modèle', 'The hardest sentences, written without a model'), [
      ['w', S('Négation avancée', 'Advanced negation'), { level: '3', form: 'neg', tense: 'future' }], ['w', S('Question familière', 'Casual question'), { level: '3', style: 'casual', form: 'question' }],
      ['w', S('Envie au passé', 'Past wish'), { level: '3', form: 'want', tense: 'past' }], ['w', S('Phrase insolite', 'Odd sentence'), { level: '3', mood: 'awkward' }],
      ['w', S('Tout mélangé', 'All mixed up'), { level: '3', time: 'yes', subj: 'we' }]]),
  ];
  return [...vocab, ...workshops, ...sentences];
};

// ---------- Chapitres : ordre final des modules ----------
const C = (id, glyph, title, sub, units) => ({ id, glyph, title, sub, units });
const CH = {
  ko: [
    C('kc1', '한글', L('Le hangeul', 'Hangul'), L('Lire, taper et prononcer les lettres', 'Reading, typing and saying the letters'), ['ko1', 'ko1w', 'ko2', 'ko2w', 'ko2b']),
    C('kc2', '첫걸음', L('Premiers pas', 'First steps'), L('Saluer, se présenter, compter', 'Greeting, introducing yourself, counting'), ['ko3', 'kov1', 'kon1', 'kow1', 'kof1', 'kox2']),
    C('kc3', '일상', L('La vie de tous les jours', 'Everyday life'), L('La maison, la table, les magasins', 'Home, meals, shops'), ['ko4', 'kov2', 'kox7', 'kox8', 'ko5', 'kov3', 'kox1', 'koc1', 'kox4', 'kos1', 'kow2']),
    C('kc4', '밖', L('Sortir et bouger', 'Out and about'), L('La ville, les transports, le voyage, le sport', 'Town, transport, travel, sport'), ['ko6', 'kov4', 'kox3', 'kot1', 'kot2', 'kox6', 'kosp', 'kox5', 'kow3']),
    C('kc5', '이야기', L('Raconter et nuancer', 'Telling and nuancing'), L('Passé, futur, envies, opinions', 'Past, future, wishes, opinions'), ['ko7', 'ko8', 'kov5', 'ko8b', 'kov6', 'kol1', 'kofe', 'kow4', 'kox9']),
    C('kc6', '발음', L('Bien prononcer', 'Sounding right'), L('Les règles avancées et les cas particuliers', 'Advanced rules and special cases'), ['ko9', 'ko9b', 'ko10', 'kov7', 'kote']),
    C('kc7', '고급', L('Niveau avancé', 'Advanced level'), L('Phrases complexes, registres, culture', 'Complex sentences, registers, culture'), ['ko11', 'ko12', 'ko13', 'kocu', 'kow5']),
    C('kc8', '생활', L('Vivre sur place', 'Living there'), L('Météo, logement, apparence, achats en ligne, banque', 'Weather, housing, looks, online shopping, banking'), ['koa01', 'koa02', 'koa03', 'koa04', 'koa05', 'koa06']),
    C('kc9', '직장', L('Travail et démarches', 'Work and paperwork'), L('Bureau, papiers, trains et fêtes', 'Office, paperwork, trains and celebrations'), ['koa07', 'koa08', 'koa09', 'koa10', 'koa11', 'koa12']),
    C('kc10', '관계', L('Relations et société', 'Relationships and society'), L('Amour, réseaux, environnement, santé, sciences', 'Love, social media, environment, health, science'), ['koa13', 'koa14', 'koa15', 'koa16', 'koa17', 'koa18']),
    C('kc11', '표현', L('Nuancer son vocabulaire', 'Refining your vocabulary'), L('Gestes, temps, verbes, adjectifs et idées', 'Gestures, time, verbs, adjectives and ideas'), ['koa19', 'koa20', 'koa21', 'koa22', 'koa23', 'koa24']),
    C('kc12', '연습', L('Ateliers sans filet', 'Workshops without a net'), L('Écrire, écouter et dire tous les mots appris', 'Writing, hearing and saying every word learnt'), ['kob01', 'kob02', 'kob03', 'kob04', 'kob05', 'kob06', 'kob07', 'kob08', 'kob09', 'kob10']),
    C('kc13', '문장', L('Construire des phrases', 'Building sentences'), L('Temps, négation, questions, envies, styles', 'Tenses, negation, questions, wishes, styles'), ['koc01', 'koc02', 'koc03', 'koc04', 'koc05', 'koc06', 'koc07', 'koc08', 'koc09']),
    C('kc14', '마스터', L('Vers la maîtrise', 'Towards mastery'), L('Phrases longues et complexes, écrites sans aide', 'Long, complex sentences, written unaided'), ['kod01', 'kod02', 'kod03', 'kod04', 'kod05', 'kod06', 'kod07']),
  ],
  ja: [
    C('jc1', 'かな', L('Les kana', 'Kana'), L('Lire, taper et prononcer hiragana et katakana', 'Reading, typing and saying hiragana and katakana'), ['ja1', 'ja1w', 'ja1k', 'ja2', 'ja2w']),
    C('jc2', '初め', L('Premiers pas', 'First steps'), L('Saluer, se présenter, compter', 'Greeting, introducing yourself, counting'), ['ja3', 'jav1', 'jan1', 'jaw1', 'jaf1', 'jax2']),
    C('jc3', '日常', L('La vie de tous les jours', 'Everyday life'), L('La maison, la table, les magasins', 'Home, meals, shops'), ['ja4', 'jav2', 'jax7', 'jax8', 'ja5', 'jav3', 'jax1', 'jac1', 'jax4', 'jas1', 'jaw2']),
    C('jc4', '外', L('Sortir et bouger', 'Out and about'), L('La ville, les transports, le voyage, le sport', 'Town, transport, travel, sport'), ['ja6', 'jav4', 'jax3', 'jat1', 'jat2', 'jax6', 'jasp', 'jax5', 'jaw3']),
    C('jc5', '話', L('Raconter et nuancer', 'Telling and nuancing'), L('Passé, futur, envies, opinions', 'Past, future, wishes, opinions'), ['ja7', 'ja8', 'jav5', 'ja8b', 'jav6', 'jal1', 'jafe', 'jaw4', 'jax9']),
    C('jc6', '読み', L('Bien lire et prononcer', 'Reading and sounding right'), L('Lectures particulières et kanji', 'Special readings and kanji'), ['ja9', 'ja9b', 'jav7', 'jate', 'jakw']),
    C('jc7', '上級', L('Niveau avancé', 'Advanced level'), L('Phrases complexes, registres, culture', 'Complex sentences, registers, culture'), ['ja10', 'ja11', 'ja12', 'jacu', 'jaw5']),
    C('jc8', '生活', L('Vivre sur place', 'Living there'), L('Météo, logement, apparence, achats en ligne, banque', 'Weather, housing, looks, online shopping, banking'), ['jaa01', 'jaa02', 'jaa03', 'jaa04', 'jaa05', 'jaa06']),
    C('jc9', '職場', L('Travail et démarches', 'Work and paperwork'), L('Bureau, papiers, trains et fêtes', 'Office, paperwork, trains and celebrations'), ['jaa07', 'jaa08', 'jaa09', 'jaa10', 'jaa11', 'jaa12']),
    C('jc10', '関係', L('Relations et société', 'Relationships and society'), L('Amour, réseaux, environnement, santé, sciences', 'Love, social media, environment, health, science'), ['jaa13', 'jaa14', 'jaa15', 'jaa16', 'jaa17', 'jaa18']),
    C('jc11', '表現', L('Nuancer son vocabulaire', 'Refining your vocabulary'), L('Gestes, temps, verbes, adjectifs et idées', 'Gestures, time, verbs, adjectives and ideas'), ['jaa19', 'jaa20', 'jaa21', 'jaa22', 'jaa23', 'jaa24']),
    C('jc12', '練習', L('Ateliers sans filet', 'Workshops without a net'), L('Écrire, écouter et dire tous les mots appris', 'Writing, hearing and saying every word learnt'), ['jab01', 'jab02', 'jab03', 'jab04', 'jab05', 'jab06', 'jab07', 'jab08', 'jab09', 'jab10']),
    C('jc13', '文', L('Construire des phrases', 'Building sentences'), L('Temps, négation, questions, envies, styles', 'Tenses, negation, questions, wishes, styles'), ['jac01', 'jac02', 'jac03', 'jac04', 'jac05', 'jac06', 'jac07', 'jac08', 'jac09']),
    C('jc14', '達人', L('Vers la maîtrise', 'Towards mastery'), L('Phrases longues et complexes, écrites sans aide', 'Long, complex sentences, written unaided'), ['jad01', 'jad02', 'jad03', 'jad04', 'jad05', 'jad06', 'jad07']),
  ],
};

// Histoires : un module par histoire, ajouté à la fin de son chapitre. Il se valide en répondant aux questions (pas d'examen).
const storyUnits = (c) => (STORIES[c] || []).map((s) => ({
  id: `${c}st${s.ch}`, glyph: s.glyph, color: 'var(--c-phrases)', title: s.title, sub: s.sub, noExam: true,
  steps: [{ id: `st-${s.id}`, kind: 'story', story: s.id }],
}));
for (const c of ['ko', 'ja']) for (const s of STORIES[c] || []) CH[c][s.ch - 1].units.push(`${c}st${s.ch}`);

function build(course, modules) {
  const byId = new Map(modules.map((m) => [m.id, m]));
  // Une étape déjà présente plus tôt dans le parcours n'est pas répétée (les ateliers reprennent d'anciens thèmes).
  const seen = new Set();
  return CH[course].flatMap((c) => c.units.map((id) => {
    const m = byId.get(id);
    const steps = m.steps.filter((x) => !seen.has(x.id) && seen.add(x.id));
    return { ...m, steps, chapter: c.id };
  }));
}

/** Tous les modules définis (pour vérifier qu'aucun n'est oublié dans les chapitres). */
export const MODULES = {
  ko: [...KO, ...KO_VOCAB.map((x) => x[1]), ...KO_NEW, ...shared(false), ...advanced(false), ...storyUnits('ko')],
  ja: [...JA, ...JA_VOCAB.map((x) => x[1]), ...JA_NEW, ...shared(true), ...advanced(true), ...storyUnits('ja')],
};
export const CHAPTERS = CH;
export const ROADMAP = { ko: build('ko', MODULES.ko), ja: build('ja', MODULES.ja) };

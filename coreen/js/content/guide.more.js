// Guide du coréen : leçons des chapitres 15 à 17 (bilingues, voir guide.util.js).
import { B } from './guide.util.js';

export const GUIDE_KO_MORE = [
  {
    id: 'changement', cat: 'adv', glyph: '지다', title: B('Devenir, finir par : -아/어지다 et -게 되다', 'Becoming, ending up: -아/어지다 and -게 되다'),
    sum: B('Dire qu’une chose change, ou qu’on en arrive à faire quelque chose.', 'Saying that something changes, or that you end up doing something.'),
    blocks: [
      { p: B('**Adjectif + -아/어지다** = « devenir (plus)… ». Le changement se fait petit à petit, souvent au passé ou au progressif.', '**Adjective + -아/어지다** = “to become (more) …”. The change is gradual, often in the past or progressive.') },
      { table: [[B('Adjectif', 'Adjective'), B('Devenir', 'Become'), B('Sens', 'Meaning')], ['춥다', '추워지다', B('se refroidir', 'get cold')], ['예쁘다', '예뻐지다', B('embellir', 'get prettier')], ['많다', '많아지다', B('augmenter', 'increase')], ['따뜻하다', '따뜻해지다', B('se réchauffer', 'get warmer')], ['바쁘다', '바빠지다', B('devenir occupé', 'get busy')]] },
      { ex: [['날씨가 추워졌어요.', B('Il s’est mis à faire froid.', 'It has got cold.')], ['한국어가 점점 쉬워져요.', B('Le coréen devient de plus en plus facile.', 'Korean is getting easier and easier.')], ['요즘 사람이 많아지고 있어요.', B('Il y a de plus en plus de monde ces temps-ci.', 'There are more and more people these days.')]] },
      { p: B('**Verbe + -게 되다** = « finir par, en venir à » : un changement qui ne dépend pas (seulement) de soi — les circonstances, une décision d’autrui.', '**Verb + -게 되다** = “to end up, come to”: a change not (only) up to you — circumstances, someone else’s decision.') },
      { ex: [['한국에서 일하게 됐어요.', B('Il se trouve que je vais travailler en Corée.', 'I ended up working in Korea.')], ['김치를 좋아하게 됐어요.', B('J’ai fini par aimer le kimchi.', 'I came to like kimchi.')], ['다음 달에 이사하게 될 것 같아요.', B('Je vais sans doute devoir déménager le mois prochain.', 'I’ll probably end up moving next month.')]] },
      { tip: B('-게 되다 adoucit aussi une annonce : 결혼하게 됐어요 (« je vais me marier ») sonne plus modeste que 결혼해요.', '-게 되다 also softens an announcement: 결혼하게 됐어요 (“I’m getting married”) sounds humbler than 결혼해요.') },
    ],
  },
  {
    id: 'degre', cat: 'adv', glyph: '수록', title: B('Plus… plus, au point de : -(으)ㄹ수록, -(으)ㄹ 정도로', 'The more… the more, so … that: -(으)ㄹ수록, -(으)ㄹ 정도로'),
    sum: B('Exprimer une progression et une intensité.', 'Expressing progression and intensity.'),
    blocks: [
      { p: B('**-(으)ㄹ수록** = « plus on…, plus… ». On peut le renforcer avec -(으)면 devant : 보면 볼수록.', '**-(으)ㄹ수록** = “the more you …, the more …”. It can be strengthened with -(으)면 before it: 보면 볼수록.') },
      { ex: [['보면 볼수록 예뻐요.', B('Plus je la regarde, plus je la trouve jolie.', 'The more I look at it, the prettier it is.')], ['빠를수록 좋아요.', B('Le plus tôt sera le mieux.', 'The sooner the better.')], ['공부할수록 재미있어요.', B('Plus j’étudie, plus c’est intéressant.', 'The more I study, the more fun it is.')]] },
      { p: B('**-(으)ㄹ 정도로** = « au point de, tellement… que ». **-(으)ㄹ 만큼** a presque le même sens (« autant que »).', '**-(으)ㄹ 정도로** = “to the point that, so … that”. **-(으)ㄹ 만큼** means almost the same (“as much as”).') },
      { ex: [['눈물이 날 정도로 웃었어요.', B('J’ai ri aux larmes.', 'I laughed until I cried.')], ['배가 터질 만큼 먹었어요.', B('J’ai mangé à en éclater.', 'I ate until I was about to burst.')], ['잠을 못 잘 정도로 걱정했어요.', B('J’étais inquiet au point de ne pas dormir.', 'I was so worried I couldn’t sleep.')]] },
      { table: [[B('Adverbe', 'Adverb'), B('Intensité', 'Intensity')], ['조금', B('un peu', 'a little')], ['꽤', B('assez, plutôt', 'quite')], ['많이 / 아주', B('beaucoup, très', 'a lot, very')], ['너무', B('trop, vraiment', 'too, really')], ['정말 / 진짜', B('vraiment', 'really')], ['엄청 / 되게', B('super (familier)', 'super (casual)')]] },
      { tip: B('너무 voulait dire « trop » ; à l’oral il veut souvent dire « vraiment », même en positif : 너무 좋아요 !', '너무 used to mean “too”; in speech it often means “really”, even when positive: 너무 좋아요!') },
    ],
  },
  {
    id: 'choix', cat: 'adv', glyph: '거나', title: B('Ou, n’importe : -거나, -든지, (이)나', 'Or, whatever: -거나, -든지, (이)나'),
    sum: B('Proposer un choix entre deux actions ou deux choses.', 'Offering a choice between two actions or things.'),
    blocks: [
      { p: B('Entre deux **noms** : **(이)나** (« ou »). Entre deux **verbes** : **-거나**.', 'Between two **nouns**: **(이)나** (“or”). Between two **verbs**: **-거나**.') },
      { ex: [['커피나 차 마실래요?', B('Tu veux un café ou un thé ?', 'Do you want coffee or tea?')], ['주말에는 책을 읽거나 영화를 봐요.', B('Le week-end, je lis ou je regarde un film.', 'At weekends I read or watch a film.')], ['버스나 지하철을 타세요.', B('Prenez le bus ou le métro.', 'Take the bus or the subway.')]] },
      { p: B('**-든지** (ou **-든**) = « que ce soit… ou… », « n’importe » : le choix est indifférent. Avec un mot interrogatif : 뭐든지 (n’importe quoi), 언제든지 (n’importe quand), 어디든지 (n’importe où), 누구든지 (n’importe qui).', '**-든지** (or **-든**) = “whether … or …”, “any”: the choice doesn’t matter. With a question word: 뭐든지 (anything), 언제든지 (any time), 어디든지 (anywhere), 누구든지 (anyone).') },
      { ex: [['가든지 말든지 마음대로 해.', B('Que tu y ailles ou non, fais comme tu veux.', 'Go or don’t, do as you like.')], ['언제든지 연락하세요.', B('Contactez-moi quand vous voulez.', 'Get in touch any time.')], ['뭐든지 괜찮아요.', B('N’importe quoi me va.', 'Anything is fine.')]] },
      { tip: B('(이)나 après un nombre veut dire « autant que ça ! » : 세 시간이나 기다렸어요 (j’ai attendu trois heures entières !).', '(이)나 after a number means “that many!”: 세 시간이나 기다렸어요 (I waited a whole three hours!).') },
    ],
  },
  {
    id: 'regret', cat: 'adv', glyph: '걸', title: B('Regrets et « j’ai failli » : -(으)ㄹ 걸, -았/었어야 했는데, -(으)ㄹ 뻔했다', 'Regrets and near misses: -(으)ㄹ 걸, -았/었어야 했는데, -(으)ㄹ 뻔했다'),
    sum: B('Ce qu’on aurait dû faire, ce qui a failli arriver.', 'What you should have done, what nearly happened.'),
    blocks: [
      { p: B('**-(으)ㄹ 걸 (그랬다)** = « j’aurais dû… » (regret, souvent en se parlant à soi-même). Au négatif : **-지 말 걸**.', '**-(으)ㄹ 걸 (그랬다)** = “I should have …” (regret, often said to yourself). Negative: **-지 말 걸**.') },
      { ex: [['우산을 가져올 걸.', B('J’aurais dû prendre un parapluie.', 'I should have brought an umbrella.')], ['더 일찍 잘 걸 그랬어요.', B('J’aurais dû me coucher plus tôt.', 'I should have gone to bed earlier.')], ['그 말을 하지 말 걸.', B('Je n’aurais pas dû dire ça.', 'I shouldn’t have said that.')]] },
      { p: B('**-았/었어야 했는데** = « il aurait fallu… (mais) » : un regret plus fort, avec l’idée d’obligation manquée.', '**-았/었어야 했는데** = “I should have … (but)”: a stronger regret, with a missed obligation.') },
      { ex: [['미리 예약했어야 했는데.', B('Il aurait fallu réserver à l’avance.', 'I should have booked in advance.')], ['좀 더 공부했어야 했어요.', B('J’aurais dû étudier davantage.', 'I should have studied more.')]] },
      { p: B('**-(으)ㄹ 뻔했다** = « avoir failli » : ça a presque eu lieu, mais non.', '**-(으)ㄹ 뻔했다** = “nearly, almost”: it almost happened, but didn’t.') },
      { ex: [['넘어질 뻔했어요.', B('J’ai failli tomber.', 'I nearly fell.')], ['기차를 놓칠 뻔했어요.', B('J’ai failli rater le train.', 'I almost missed the train.')], ['큰일 날 뻔했네요!', B('On l’a échappé belle !', 'That was a close call!')]] },
    ],
  },
  {
    id: 'simultane', cat: 'adv', glyph: '면서', title: B('En même temps, dès que : -(으)면서, -자마자, -는 김에', 'While, as soon as: -(으)면서, -자마자, -는 김에'),
    sum: B('Enchaîner ou superposer deux actions.', 'Chaining or overlapping two actions.'),
    blocks: [
      { p: B('**-(으)면서** = « tout en… » : deux actions en même temps, par la **même personne**.', '**-(으)면서** = “while …”: two actions at the same time, by the **same person**.') },
      { ex: [['음악을 들으면서 공부해요.', B('J’étudie en écoutant de la musique.', 'I study while listening to music.')], ['걸으면서 전화했어요.', B('J’ai téléphoné en marchant.', 'I phoned while walking.')]] },
      { p: B('**-자마자** = « dès que, aussitôt après ».', '**-자마자** = “as soon as, right after”.') },
      { ex: [['집에 오자마자 잤어요.', B('Je me suis couché dès que je suis rentré.', 'I went to sleep as soon as I got home.')], ['수업이 끝나자마자 나갔어요.', B('Il est sorti dès la fin du cours.', 'He left as soon as class ended.')]] },
      { p: B('**-는 김에** = « tant qu’à faire, pendant que j’y suis » : on profite d’une action pour en faire une autre. Au passé : **-(으)ㄴ 김에**.', '**-는 김에** = “while I’m at it”: you take advantage of one action to do another. Past: **-(으)ㄴ 김에**.') },
      { ex: [['시장에 가는 김에 과일도 샀어요.', B('Tant que j’allais au marché, j’ai aussi acheté des fruits.', 'Since I was going to the market, I bought fruit too.')], ['말이 나온 김에 물어볼게요.', B('Puisqu’on en parle, je vais demander.', 'Since it came up, let me ask.')]] },
      { tip: B('Avec -(으)면서, le sujet est le même ; pour deux personnes différentes, on dit -는 동안 (pendant que) : 제가 요리하는 동안 친구가 청소했어요.', 'With -(으)면서 the subject is the same; for two different people use -는 동안 (while): 제가 요리하는 동안 친구가 청소했어요.') },
    ],
  },
  {
    id: 'onomatopees', cat: 'adv', glyph: '쿵', title: B('Onomatopées et mots imagés', 'Sound and mimetic words'),
    sum: B('의성어 et 의태어 : le coréen en est plein, et ils donnent vie aux phrases.', '의성어 and 의태어: Korean is full of them, and they bring sentences to life.'),
    blocks: [
      { p: B('Le coréen distingue les **의성어** (bruits : 멍멍, 똑똑) et les **의태어** (manières, états : 반짝반짝, 두근두근). Beaucoup sont **redoublés**, et s’emploient comme adverbes ou avec **-하다** / **-거리다**.', 'Korean distinguishes **의성어** (sounds: 멍멍, 똑똑) and **의태어** (manners, states: 반짝반짝, 두근두근). Many are **doubled**, and work as adverbs or with **-하다** / **-거리다**.') },
      { table: [[B('Mot', 'Word'), B('Image', 'Image'), B('Exemple', 'Example')], ['두근두근', B('cœur qui bat', 'heart pounding'), '가슴이 두근두근해요'], ['반짝반짝', B('scintiller', 'twinkle'), '별이 반짝반짝 빛나요'], ['쿨쿨', B('dormir profondément', 'sound asleep'), '아기가 쿨쿨 자요'], ['주룩주룩', B('pluie battante', 'pouring rain'), '비가 주룩주룩 와요'], ['바삭바삭', B('croustillant', 'crispy'), '바삭바삭한 치킨'], ['깜짝', B('sursaut', 'with a start'), '깜짝 놀랐어요']] },
      { p: B('**Voyelles claires et sombres** : ㅏ ㅗ donnent une image petite et légère, ㅓ ㅜ une image grande et lourde. 졸졸 (un filet d’eau) / 줄줄 (l’eau qui coule à flots), 퐁당 (un caillou) / 풍덩 (un gros plongeon).', '**Bright and dark vowels**: ㅏ ㅗ give a small, light image; ㅓ ㅜ a big, heavy one. 졸졸 (a trickle) / 줄줄 (gushing), 퐁당 (a pebble) / 풍덩 (a big splash).') },
      { ex: [['배가 꼬르륵 소리가 나요.', B('Mon ventre gargouille.', 'My stomach is rumbling.')], ['아이가 방긋방긋 웃어요.', B('L’enfant sourit à pleines joues.', 'The child is beaming.')], ['고양이가 살금살금 다가왔어요.', B('Le chat s’est approché à pas de loup.', 'The cat crept up quietly.')]] },
      { tip: B('Les cris d’animaux changent d’une langue à l’autre : 멍멍 (chien), 야옹 (chat), 꿀꿀 (cochon), 꼬끼오 (coq), 음매 (vache).', 'Animal noises differ between languages: 멍멍 (dog), 야옹 (cat), 꿀꿀 (pig), 꼬끼오 (rooster), 음매 (cow).') },
    ],
  },
  {
    id: 'expressions', cat: 'adv', glyph: '눈', title: B('Expressions imagées avec le corps', 'Idioms with body parts'),
    sum: B('눈이 높다, 발이 넓다… des expressions que tout le monde utilise.', '눈이 높다, 발이 넓다… expressions everyone uses.'),
    blocks: [
      { p: B('Beaucoup d’expressions courantes associent une **partie du corps** et un adjectif. Le sens n’est pas littéral : il faut les apprendre en bloc.', 'Many everyday idioms pair a **body part** with an adjective. The meaning isn’t literal: learn them as a whole.') },
      { table: [[B('Expression', 'Expression'), B('Mot à mot', 'Literally'), B('Sens', 'Meaning')], ['눈이 높다', B('avoir les yeux hauts', 'eyes are high'), B('être exigeant', 'have high standards')], ['발이 넓다', B('avoir le pied large', 'feet are wide'), B('connaître beaucoup de monde', 'know lots of people')], ['손이 크다', B('avoir la main grande', 'hands are big'), B('être généreux (en portions)', 'be generous (with portions)')], ['입이 짧다', B('avoir la bouche courte', 'mouth is short'), B('être difficile pour manger', 'be a picky eater')], ['귀가 얇다', B('avoir l’oreille fine', 'ears are thin'), B('se laisser facilement convaincre', 'be easily swayed')], ['얼굴이 두껍다', B('avoir le visage épais', 'face is thick'), B('être sans gêne', 'be shameless')], ['배가 아프다', B('avoir mal au ventre', 'stomach hurts'), B('être jaloux', 'be jealous')], ['머리를 식히다', B('refroidir la tête', 'cool the head'), B('se changer les idées', 'clear your head')]] },
      { ex: [['우리 언니는 눈이 높아서 아직 혼자예요.', B('Ma grande sœur est exigeante, elle est encore célibataire.', 'My sister has high standards, so she’s still single.')], ['민수 씨는 발이 넓어요.', B('Minsu connaît beaucoup de monde.', 'Minsu knows a lot of people.')], ['할머니는 손이 커서 음식을 많이 하세요.', B('Grand-mère est généreuse, elle cuisine toujours beaucoup.', 'Grandma is generous and always cooks lots.')]] },
      { tip: B('배가 아프다 a deux sens : le vrai mal de ventre… et la jalousie (사촌이 땅을 사면 배가 아프다 : « quand ton cousin achète un terrain, tu as mal au ventre »).', '배가 아프다 has two senses: a real stomach ache… and jealousy (사촌이 땅을 사면 배가 아프다: “when your cousin buys land, your stomach hurts”).') },
    ],
  },
  {
    id: 'textos', cat: 'adv', glyph: 'ㅋㅋ', title: B('Le coréen des messages', 'Korean in text messages'),
    sum: B('ㅋㅋ, ㅠㅠ, abréviations et mots raccourcis.', 'ㅋㅋ, ㅠㅠ, abbreviations and shortened words.'),
    blocks: [
      { p: B('Dans les messages, on écrit souvent **seulement les consonnes** d’un mot : c’est rapide et tout le monde comprend.', 'In messages, people often write **just the consonants** of a word: it’s quick and everyone understands.') },
      { table: [[B('Message', 'Text'), B('Mot complet', 'Full word'), B('Sens', 'Meaning')], ['ㅋㅋ / ㅎㅎ', '크크 / 하하', B('mdr, haha', 'lol, haha')], ['ㅠㅠ / ㅜㅜ', '—', B('larmes (triste, ému)', 'tears (sad, touched)')], ['ㅇㅇ', '응응', B('ouais', 'yeah')], ['ㄱㅅ', '감사', B('merci', 'thanks')], ['ㅈㅅ', '죄송', B('pardon', 'sorry')], ['ㅊㅋ', '축하', B('félicitations', 'congrats')], ['ㄴㄴ', '노노', B('non non', 'no no')]] },
      { p: B('Les jeunes **raccourcissent** aussi les mots composés en gardant la première syllabe de chaque partie : 생일 선물 → **생선** (cadeau d’anniversaire… et « poisson » !), 맛있는 집 → **맛집** (bonne adresse), 아이스 아메리카노 → **아아**.', 'Young people also **shorten** compounds by keeping the first syllable of each part: 생일 선물 → **생선** (birthday present… and “fish”!), 맛있는 집 → **맛집** (great place to eat), 아이스 아메리카노 → **아아**.') },
      { ex: [['내일 시간 돼? ㅇㅇ 돼.', B('T’es dispo demain ? Ouais.', 'Free tomorrow? Yeah.')], ['합격했어! ㅊㅋㅊㅋ', B('J’ai réussi ! Félicitations !', 'I passed! Congrats!')], ['여기 진짜 맛집이야.', B('C’est une super adresse.', 'This place is really good.')]] },
      { tip: B('Ces formes sont familières : on ne les écrit pas à un professeur ou dans un mail de travail.', 'These forms are casual: don’t use them with a teacher or in a work email.') },
    ],
  },
];

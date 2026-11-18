// Guide du japonais : leçons des chapitres 15 à 17 (bilingues, voir guide.util.js).
import { B } from './guide.util.js';

export const GUIDE_JA_MORE = [
  {
    id: 'shimau', cat: 'adv', glyph: 'ちゃう', title: B('Finir, faire par mégarde : てしまう', 'Finishing, doing by accident: てしまう'),
    sum: B('L’action complète… ou regrettable. Contracté en ちゃう à l’oral.', 'A completed… or regrettable action. Contracted to ちゃう in speech.'),
    blocks: [
      { p: B('**Forme en て + しまう** a deux sens : 1) **terminer complètement** une action ; 2) faire quelque chose **sans le vouloir**, avec un regret.', '**て-form + しまう** has two meanings: 1) **finishing** an action completely; 2) doing something **unintentionally**, with regret.') },
      { ex: [['宿題をしてしまいました。', B('J’ai fini mes devoirs.', 'I’ve finished my homework.')], ['財布をなくしてしまいました。', B('J’ai perdu mon portefeuille (zut).', 'I’ve gone and lost my wallet.')], ['ケーキを全部食べてしまった。', B('J’ai mangé tout le gâteau…', 'I ate the whole cake…')]] },
      { p: B('À l’oral, **てしまう → ちゃう** et **でしまう → じゃう**. Au passé : ちゃった / じゃった.', 'In speech, **てしまう → ちゃう** and **でしまう → じゃう**. Past: ちゃった / じゃった.') },
      { table: [[B('Verbe', 'Verb'), B('Écrit', 'Written'), B('Oral', 'Spoken')], ['忘れる', '忘れてしまった', '忘れちゃった'], ['飲む', '飲んでしまった', '飲んじゃった'], ['寝る', '寝てしまった', '寝ちゃった'], ['行く', '行ってしまった', '行っちゃった']] },
      { tip: B('Avec un verbe de mouvement, 行っちゃった veut souvent dire « il est déjà parti » : la chose est faite, on ne peut plus rien y changer.', 'With a motion verb, 行っちゃった often means “they’ve already left”: it’s done, nothing can be changed.') },
    ],
  },
  {
    id: 'sugiru', cat: 'adv', glyph: '過ぎ', title: B('Trop, facile à, difficile à : すぎる, やすい, にくい', 'Too much, easy to, hard to: すぎる, やすい, にくい'),
    sum: B('Trois suffixes très courants qui se collent au radical en ます.', 'Three very common suffixes added to the ます-stem.'),
    blocks: [
      { p: B('**すぎる** = « trop ». Il se colle au radical d’un verbe (食べ**すぎる**), ou à un adjectif sans い / な (高**すぎる**, 静か**すぎる**). Il se conjugue comme un verbe en る.', '**すぎる** = “too (much)”. It attaches to a verb stem (食べ**すぎる**) or to an adjective without い / な (高**すぎる**, 静か**すぎる**). It conjugates like a る-verb.') },
      { ex: [['昨日飲みすぎました。', B('J’ai trop bu hier.', 'I drank too much yesterday.')], ['このかばんは高すぎます。', B('Ce sac est trop cher.', 'This bag is too expensive.')], ['この部屋は静かすぎる。', B('Cette pièce est trop silencieuse.', 'This room is too quiet.')]] },
      { p: B('**やすい** = « facile à », **にくい** = « difficile à ». Ils se collent au radical en ます et se conjuguent comme des adjectifs en い.', '**やすい** = “easy to”, **にくい** = “hard to”. They attach to the ます-stem and conjugate like い-adjectives.') },
      { table: [[B('Verbe', 'Verb'), 'やすい', 'にくい'], ['読む', B('読みやすい (facile à lire)', '読みやすい (easy to read)'), B('読みにくい (difficile à lire)', '読みにくい (hard to read)')], ['使う', B('使いやすい (pratique)', '使いやすい (easy to use)'), B('使いにくい (peu pratique)', '使いにくい (awkward to use)')], ['話す', B('話しやすい (facile à aborder)', '話しやすい (easy to talk to)'), B('話しにくい (gênant à dire)', '話しにくい (hard to talk about)')]] },
      { tip: B('すぎ seul devient un nom : 食べすぎ (le fait de trop manger), 働きすぎ (le surmenage).', 'すぎ alone becomes a noun: 食べすぎ (overeating), 働きすぎ (overwork).') },
    ],
  },
  {
    id: 'nagara', cat: 'adv', glyph: 'ながら', title: B('Tout en, entre autres : ながら, たり〜たり, し', 'While, among other things: ながら, たり〜たり, し'),
    sum: B('Superposer deux actions, en citer quelques-unes, empiler des raisons.', 'Overlapping two actions, listing a few, piling up reasons.'),
    blocks: [
      { p: B('**Radical en ます + ながら** = « tout en… » : deux actions en même temps, la principale vient en dernier.', '**ます-stem + ながら** = “while …”: two actions at once, the main one comes last.') },
      { ex: [['音楽を聞きながら勉強します。', B('J’étudie en écoutant de la musique.', 'I study while listening to music.')], ['歩きながら電話しないでください。', B('Ne téléphonez pas en marchant.', 'Please don’t phone while walking.')]] },
      { p: B('**〜たり〜たりする** = « faire entre autres… et… » : on cite quelques actions parmi d’autres. Formé sur la forme en た + り.', '**〜たり〜たりする** = “do things like … and …”: listing a few actions among others. Built on the た-form + り.') },
      { ex: [['週末は本を読んだり、映画を見たりします。', B('Le week-end, je lis, je regarde des films…', 'At weekends I read, watch films and so on.')], ['雨が降ったりやんだりしている。', B('Il pleut par intermittence.', 'It keeps raining on and off.')]] },
      { p: B('**し** relie des **raisons** qui s’additionnent : « en plus… et puis… ». Il suit une forme neutre.', '**し** links **reasons** that add up: “and what’s more … and …”. It follows a plain form.') },
      { ex: [['この店は安いし、おいしいし、よく来ます。', B('Ce restaurant est pas cher, bon… alors j’y viens souvent.', 'This place is cheap and tasty, so I come often.')], ['疲れたし、もう帰ろう。', B('En plus je suis fatigué, rentrons.', 'I’m tired anyway, let’s go home.')]] },
    ],
  },
  {
    id: 'conseil', cat: 'adv', glyph: '方', title: B('Conseiller : ほうがいい, べき, たらどう', 'Giving advice: ほうがいい, べき, たらどう'),
    sum: B('Du conseil amical au devoir moral.', 'From friendly advice to moral duty.'),
    blocks: [
      { p: B('**Forme en た + ほうがいい** = « tu ferais mieux de ». Au négatif : **forme en ない + ほうがいい**.', '**た-form + ほうがいい** = “you’d better”. Negative: **ない-form + ほうがいい**.') },
      { ex: [['早く寝たほうがいいですよ。', B('Tu ferais mieux de te coucher tôt.', 'You’d better go to bed early.')], ['無理しないほうがいい。', B('Mieux vaut ne pas forcer.', 'Better not to overdo it.')]] },
      { p: B('**Forme du dictionnaire + べき(だ)** = « on devrait, il faut » : un devoir moral, assez fort. Négatif : **べきではない**. する devient souvent **すべき**.', '**Dictionary form + べき(だ)** = “should, ought to”: a fairly strong moral duty. Negative: **べきではない**. する often becomes **すべき**.') },
      { ex: [['約束は守るべきだ。', B('On doit tenir ses promesses.', 'You should keep your promises.')], ['そんなことは言うべきではない。', B('On ne devrait pas dire ça.', 'You shouldn’t say such things.')]] },
      { p: B('**〜たらどう(ですか)** = « et si tu… ? » : une suggestion douce.', '**〜たらどう(ですか)** = “why don’t you …?”: a gentle suggestion.') },
      { ex: [['先生に聞いてみたらどうですか。', B('Et si tu demandais au professeur ?', 'Why not ask the teacher?')], ['少し休んだら？', B('Tu devrais te reposer un peu, non ?', 'Why don’t you rest a bit?')]] },
    ],
  },
  {
    id: 'tokoro', cat: 'adv', glyph: '所', title: B('Le moment précis : ところ et ばかり', 'The exact moment: ところ and ばかり'),
    sum: B('Sur le point de, en train de, venir de.', 'About to, in the middle of, just did.'),
    blocks: [
      { p: B('**ところ** (« endroit », puis « moment ») situe une action par rapport à maintenant, selon la forme du verbe :', '**ところ** (“place”, then “point in time”) locates an action relative to now, depending on the verb form:') },
      { table: [[B('Forme', 'Form'), B('Sens', 'Meaning'), B('Exemple', 'Example')], [B('dictionnaire + ところ', 'dictionary + ところ'), B('sur le point de', 'about to'), '今から出るところです'], [B('ている + ところ', 'ている + ところ'), B('en plein dedans', 'right in the middle of'), '今食べているところです'], [B('た + ところ', 'た + ところ'), B('à l’instant', 'just now'), '今着いたところです']] },
      { ex: [['ちょうど電話しようと思っていたところです。', B('J’allais justement t’appeler.', 'I was just about to call you.')], ['今、家に帰ったところです。', B('Je viens de rentrer à la maison.', 'I’ve just got home.')]] },
      { p: B('**Forme en た + ばかり** = « venir de » aussi, mais **du point de vue de celui qui parle** : le temps écoulé peut être long s’il le ressent comme récent.', '**た-form + ばかり** also means “just did”, but **from the speaker’s point of view**: the time elapsed can be long if it feels recent.') },
      { ex: [['日本に来たばかりです。', B('Je viens d’arriver au Japon (il y a peu).', 'I’ve only just come to Japan.')], ['買ったばかりの携帯が壊れた。', B('Mon portable tout neuf est cassé.', 'My brand-new phone broke.')]] },
      { tip: B('Après un nom, ばかり veut dire « que, rien que » : 肉ばかり食べる (ne manger que de la viande).', 'After a noun, ばかり means “only, nothing but”: 肉ばかり食べる (eat nothing but meat).') },
    ],
  },
  {
    id: 'giongo', cat: 'adv', glyph: 'ドキ', title: B('Onomatopées et mots imagés', 'Sound and mimetic words'),
    sum: B('擬音語・擬態語 : des centaines de mots qui imitent bruits, états et sensations.', '擬音語・擬態語: hundreds of words that imitate sounds, states and feelings.'),
    blocks: [
      { p: B('Le japonais distingue les **擬音語** (bruits : ワンワン, とんとん) et les **擬態語** (états, manières : きらきら, どきどき). On les écrit en hiragana ou en katakana, souvent **redoublés**, et on les utilise avec **と**, **する** ou **だ**.', 'Japanese distinguishes **擬音語** (sounds: ワンワン, とんとん) and **擬態語** (states, manners: きらきら, どきどき). They are written in hiragana or katakana, often **doubled**, and used with **と**, **する** or **だ**.') },
      { table: [[B('Mot', 'Word'), B('Image', 'Image'), B('Exemple', 'Example')], ['どきどき', B('cœur qui bat', 'heart pounding'), 'どきどきする'], ['きらきら', B('scintiller', 'twinkle'), '星がきらきら光る'], ['ぺこぺこ', B('avoir très faim', 'starving'), 'おなかがぺこぺこだ'], ['ざあざあ', B('pluie battante', 'pouring rain'), '雨がざあざあ降る'], ['にこにこ', B('sourire', 'smiling'), 'にこにこ笑う'], ['ふわふわ', B('moelleux, léger', 'fluffy'), 'ふわふわのパンケーキ']] },
      { p: B('Les **sons voisés** (avec ゛) donnent une image plus grosse ou plus lourde : ころころ (une petite bille qui roule) / ごろごろ (un rocher… ou paresser à la maison), さらさら (sec, soyeux) / ざらざら (rugueux).', '**Voiced sounds** (with ゛) give a bigger or heavier image: ころころ (a small ball rolling) / ごろごろ (a boulder… or lazing about at home), さらさら (dry, silky) / ざらざら (rough).') },
      { ex: [['子どもがすやすや寝ています。', B('L’enfant dort paisiblement.', 'The child is sleeping peacefully.')], ['もちもちしたパンが好きです。', B('J’aime le pain moelleux et élastique.', 'I like chewy bread.')], ['休みの日は家でごろごろしています。', B('Les jours de repos, je paresse à la maison.', 'On days off I laze around at home.')]] },
      { tip: B('Cris d’animaux : ワンワン (chien), ニャー (chat), ブーブー (cochon), コケコッコー (coq), モー (vache).', 'Animal noises: ワンワン (dog), ニャー (cat), ブーブー (pig), コケコッコー (rooster), モー (cow).') },
    ],
  },
  {
    id: 'kanyoku', cat: 'adv', glyph: '顔', title: B('Expressions imagées avec le corps', 'Idioms with body parts'),
    sum: B('顔が広い, 気が強い… des expressions que tout le monde utilise.', '顔が広い, 気が強い… expressions everyone uses.'),
    blocks: [
      { p: B('Beaucoup d’expressions courantes associent une **partie du corps** (ou 気, l’esprit) et un adjectif ou un verbe. Le sens n’est pas littéral : on les apprend en bloc.', 'Many everyday idioms pair a **body part** (or 気, the spirit) with an adjective or a verb. The meaning isn’t literal: learn them as a whole.') },
      { table: [[B('Expression', 'Expression'), B('Mot à mot', 'Literally'), B('Sens', 'Meaning')], ['顔が広い', B('avoir le visage large', 'face is wide'), B('connaître beaucoup de monde', 'know lots of people')], ['手が足りない', B('les mains manquent', 'not enough hands'), B('manquer de bras', 'be short-handed')], ['口が軽い', B('avoir la bouche légère', 'mouth is light'), B('être bavard, indiscret', 'can’t keep a secret')], ['耳が痛い', B('avoir mal aux oreilles', 'ears hurt'), B('être piqué au vif (critique juste)', 'hit a nerve')], ['頭が固い', B('avoir la tête dure', 'head is hard'), B('être rigide, borné', 'be inflexible')], ['気が強い', B('avoir l’esprit fort', 'spirit is strong'), B('avoir du caractère', 'be strong-willed')], ['気になる', B('l’esprit y devient', 'spirit becomes'), B('être intrigué, préoccupé', 'be curious, bothered')], ['腹が立つ', B('le ventre se lève', 'belly stands up'), B('être en colère', 'get angry')]] },
      { ex: [['田中さんは顔が広いですね。', B('Tanaka connaît vraiment beaucoup de monde.', 'Tanaka really knows a lot of people.')], ['彼は口が軽いから、言わないほうがいい。', B('Il est bavard, mieux vaut ne rien lui dire.', 'He can’t keep a secret, so better not tell him.')], ['テストの結果が気になる。', B('Les résultats de l’examen me tracassent.', 'I’m anxious about the test results.')]] },
      { tip: B('気 se retrouve partout : 気をつける (faire attention), 気にしない (ne pas s’en faire), 気が合う (bien s’entendre), 気がする (avoir l’impression).', '気 is everywhere: 気をつける (be careful), 気にしない (don’t worry), 気が合う (get on well), 気がする (have a feeling).') },
    ],
  },
  {
    id: 'kudaketa', cat: 'adv', glyph: 'w', title: B('Le japonais des messages', 'Japanese in text messages'),
    sum: B('w, 了解, スタンプ : raccourcis et mots du quotidien en ligne.', 'w, 了解, stickers: shortcuts and everyday online words.'),
    blocks: [
      { p: B('Dans les messages, on raccourcit beaucoup et on remplace les rires par des lettres.', 'In messages, people shorten a lot and replace laughter with letters.') },
      { table: [[B('Message', 'Text'), B('Origine', 'Origin'), B('Sens', 'Meaning')], ['w / 笑', B('warau (rire)', 'warau (laugh)'), B('mdr', 'lol')], ['りょ / 了解', 'りょうかい', B('ok, compris', 'got it')], ['おつ', 'おつかれさま', B('bon boulot, salut', 'good work, hi')], ['あけおめ', 'あけましておめでとう', B('bonne année', 'happy new year')], ['よろ', 'よろしく', B('merci d’avance', 'thanks in advance')], ['マジ', 'まじめ', B('sérieux ?, vraiment', 'seriously')], ['ヤバい', B('dangereux', 'dangerous'), B('génial… ou terrible', 'awesome… or awful')]] },
      { p: B('Les mots étrangers aussi se raccourcissent : スマートフォン → **スマホ**, コンビニエンスストア → **コンビニ**, パーソナルコンピューター → **パソコン**, エアコンディショナー → **エアコン**.', 'Loanwords get shortened too: スマートフォン → **スマホ**, コンビニエンスストア → **コンビニ**, パーソナルコンピューター → **パソコン**, エアコンディショナー → **エアコン**.') },
      { ex: [['明日ひま？ りょ、7時ね。', B('T’es libre demain ? Ok, à 7 h.', 'Free tomorrow? Got it, 7 o’clock then.')], ['マジでおいしいw', B('C’est trop bon mdr.', 'Seriously tasty lol.')], ['スマホの充電が切れた。', B('Mon téléphone n’a plus de batterie.', 'My phone battery died.')]] },
      { tip: B('Ces formes sont familières : avec un supérieur, on écrit 了解しました, ou mieux 承知しました.', 'These forms are casual: with a superior, write 了解しました, or better 承知しました.') },
    ],
  },
];

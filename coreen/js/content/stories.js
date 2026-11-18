// Histoires graduées : une par chapitre (du chapitre 2 au 14), avec Léo, étudiant français, à Séoul (Minji) ou à Tokyo (Yui).
// Chaque histoire : des répliques (avec voix, traduction à révéler, mots à toucher), puis des questions de compréhension.
//
// Réplique : [qui, texte, français, anglais] — « qui » vide pour la narration.
// Japonais : 漢字[よみ] donne les furigana ; les espaces séparent les mots (ils ne s'affichent pas).
// Question : [question en français, en anglais, [bonne réponse fr, en], [autre réponse fr, en], …] — la bonne réponse en premier.

const L = (fr, en) => ({ fr, en });
const KANJI = /([一-鿿々〆ヶ]+)\[([^\]]+)\]/g;

function line([who, src, fr, en], ja) {
  const tokens = src.split(' ').filter(Boolean);
  if (!ja) return { who, src, tl: src, fr, en, tokens: tokens.map((w) => ({ w, src: w })) };
  const plain = (s) => s.replace(/\[[^\]]*\]/g, '');
  const read = (s) => s.replace(KANJI, '$2');
  return { who, src, tl: tokens.map(plain).join(''), r: tokens.map(read).join(''), fr, en, tokens: tokens.map((t) => ({ w: plain(t), r: read(t), src: t })) };
}
const question = ([fr, en, ...answers]) => ({ q: L(fr, en), answers: answers.map(([a, b]) => L(a, b)) });
const story = (ja) => (id, ch, glyph, title, sub, lines, questions) => ({
  id, ch, glyph, title, sub, lines: lines.map((l) => line(l, ja)), questions: questions.map(question),
});
const ko = story(false);
const ja = story(true);

const KO = [
  ko('ko-2', 2, '만남', L('Première rencontre', 'First meeting'), L('Se présenter et se dire à demain', 'Introducing yourself and saying see you tomorrow'), [
    ['민지', '안녕하세요! 저는 민지예요.', 'Bonjour ! Je suis Minji.', 'Hello! I’m Minji.'],
    ['레오', '안녕하세요, 민지 씨. 저는 레오예요.', 'Bonjour, Minji. Moi, c’est Léo.', 'Hello, Minji. I’m Léo.'],
    ['민지', '레오 씨는 어느 나라 사람이에요?', 'Léo, tu viens de quel pays ?', 'Léo, which country are you from?'],
    ['레오', '저는 프랑스 사람이에요. 학생이에요.', 'Je suis français. Je suis étudiant.', 'I’m French. I’m a student.'],
    ['민지', '아, 그래요? 저도 학생이에요!', 'Ah bon ? Moi aussi, je suis étudiante !', 'Oh really? I’m a student too!'],
    ['레오', '만나서 반가워요.', 'Enchanté.', 'Nice to meet you.'],
    ['민지', '저도 반가워요. 내일 학교에서 봐요!', 'Moi aussi. À demain, à l’école !', 'Nice to meet you too. See you tomorrow at school!'],
  ], [
    ['De quel pays vient Léo ?', 'Which country is Léo from?', ['De France', 'France'], ['De Corée', 'Korea'], ['Du Japon', 'Japan']],
    ['Que fait Minji ?', 'What does Minji do?', ['Elle est étudiante', 'She’s a student'], ['Elle est professeure', 'She’s a teacher'], ['Elle est médecin', 'She’s a doctor']],
    ['Où se revoient-ils demain ?', 'Where will they meet tomorrow?', ['À l’école', 'At school'], ['Au café', 'At the café'], ['À la gare', 'At the station']],
  ]),
  ko('ko-3', 3, '시장', L('Au marché', 'At the market'), L('Demander le prix et acheter', 'Asking the price and buying'), [
    ['레오', '아주머니, 사과 얼마예요?', 'Madame, combien coûtent les pommes ?', 'Excuse me, how much are the apples?'],
    ['아주머니', '사과 한 개에 천 원이에요.', 'Mille wons la pomme.', 'One thousand won each.'],
    ['레오', '그럼 사과 세 개 주세요.', 'Alors donnez-moi trois pommes.', 'Then three apples, please.'],
    ['아주머니', '여기 있어요. 삼천 원이에요.', 'Voilà. Ça fait trois mille wons.', 'Here you are. That’s three thousand won.'],
    ['레오', '김치도 있어요?', 'Vous avez aussi du kimchi ?', 'Do you have kimchi too?'],
    ['아주머니', '네, 있어요. 아주 맛있어요!', 'Oui. Il est très bon !', 'Yes, we do. It’s really good!'],
    ['레오', '김치도 조금 주세요. 감사합니다!', 'Donnez-moi un peu de kimchi aussi. Merci !', 'A little kimchi too, please. Thank you!'],
  ], [
    ['Combien coûte une pomme ?', 'How much is one apple?', ['1 000 wons', '1,000 won'], ['3 000 wons', '3,000 won'], ['500 wons', '500 won']],
    ['Combien de pommes Léo achète-t-il ?', 'How many apples does Léo buy?', ['Trois', 'Three'], ['Une', 'One'], ['Dix', 'Ten']],
    ['Qu’achète-t-il aussi ?', 'What else does he buy?', ['Du kimchi', 'Kimchi'], ['Du pain', 'Bread'], ['Du café', 'Coffee']],
  ]),
  ko('ko-4', 4, '지하철', L('Prendre le métro', 'Taking the subway'), L('Demander son chemin', 'Asking the way'), [
    ['레오', '실례합니다. 경복궁에 어떻게 가요?', 'Excusez-moi. Comment va-t-on au palais Gyeongbokgung ?', 'Excuse me. How do I get to Gyeongbokgung Palace?'],
    ['행인', '지하철 3호선을 타세요.', 'Prenez la ligne 3 du métro.', 'Take subway line 3.'],
    ['레오', '어느 역에서 내려요?', 'À quelle station dois-je descendre ?', 'Which station do I get off at?'],
    ['행인', '경복궁역에서 내리세요. 여기서 가까워요.', 'Descendez à la station Gyeongbokgung. C’est près d’ici.', 'Get off at Gyeongbokgung Station. It’s close to here.'],
    ['레오', '몇 분 걸려요?', 'Ça prend combien de minutes ?', 'How many minutes does it take?'],
    ['행인', '십오 분쯤 걸려요.', 'Environ quinze minutes.', 'About fifteen minutes.'],
    ['레오', '정말 감사합니다!', 'Merci beaucoup !', 'Thank you so much!'],
  ], [
    ['Où Léo veut-il aller ?', 'Where does Léo want to go?', ['Au palais Gyeongbokgung', 'To Gyeongbokgung Palace'], ['À la gare de Séoul', 'To Seoul Station'], ['À l’aéroport', 'To the airport']],
    ['Que doit-il prendre ?', 'What should he take?', ['La ligne 3 du métro', 'Subway line 3'], ['Le bus', 'The bus'], ['Un taxi', 'A taxi']],
    ['Combien de temps faut-il ?', 'How long does it take?', ['Environ quinze minutes', 'About fifteen minutes'], ['Une heure', 'An hour'], ['Cinq minutes', 'Five minutes']],
  ]),
  ko('ko-5', 5, '주말', L('Le week-end', 'The weekend'), L('Raconter au passé, proposer une sortie', 'Telling in the past, suggesting an outing'), [
    ['민지', '레오 씨, 주말에 뭐 했어요?', 'Léo, qu’as-tu fait ce week-end ?', 'Léo, what did you do at the weekend?'],
    ['레오', '친구하고 한강에 갔어요. 자전거를 탔어요.', 'Je suis allé au bord du fleuve Han avec un ami. On a fait du vélo.', 'I went to the Han River with a friend. We rode bikes.'],
    ['민지', '와, 재미있었어요?', 'Waouh, c’était bien ?', 'Wow, was it fun?'],
    ['레오', '네, 정말 재미있었어요. 그런데 조금 피곤했어요.', 'Oui, vraiment. Mais j’étais un peu fatigué.', 'Yes, really fun. But I was a little tired.'],
    ['민지', '다음 주말에는 뭐 할 거예요?', 'Et le week-end prochain, que vas-tu faire ?', 'What are you going to do next weekend?'],
    ['레오', '영화를 보고 싶어요. 같이 갈래요?', 'J’ai envie de voir un film. Tu veux venir avec moi ?', 'I want to see a film. Do you want to come?'],
    ['민지', '좋아요! 토요일에 만나요.', 'D’accord ! Retrouvons-nous samedi.', 'Sure! Let’s meet on Saturday.'],
  ], [
    ['Qu’a fait Léo ce week-end ?', 'What did Léo do at the weekend?', ['Du vélo au bord du fleuve Han', 'Cycling by the Han River'], ['Du shopping', 'Shopping'], ['Il a dormi', 'He slept']],
    ['Comment se sentait-il ?', 'How did he feel?', ['Un peu fatigué', 'A little tired'], ['Malade', 'Ill'], ['Triste', 'Sad']],
    ['Que vont-ils faire samedi ?', 'What will they do on Saturday?', ['Voir un film', 'See a film'], ['Faire du vélo', 'Go cycling'], ['Aller au marché', 'Go to the market']],
  ]),
  ko('ko-6', 6, '발음', L('Leçon de prononciation', 'Pronunciation lesson'), L('Liaisons et sons qui changent', 'Linking and changing sounds'), [
    ['선생님', '레오 씨, 이 문장을 읽어 보세요.', 'Léo, essaie de lire cette phrase.', 'Léo, try reading this sentence.'],
    ['레오', '한국어는 재미있어요.', '« Le coréen, c’est amusant. »', '“Korean is fun.”'],
    ['선생님', '아주 좋아요! 연음을 잘했어요.', 'Très bien ! Tu as bien fait la liaison.', 'Very good! You linked the sounds well.'],
    ['레오', '그런데 "같이"는 왜 "가치"로 읽어요?', 'Mais pourquoi lit-on « 같이 » comme « 가치 » ?', 'But why is “같이” read as “가치”?'],
    ['선생님', 'ㅌ 다음에 ㅣ가 오면 ㅊ 소리가 나요.', 'Quand ㅣ suit ㅌ, on entend le son ㅊ.', 'When ㅣ follows ㅌ, it sounds like ㅊ.'],
    ['레오', '아, 그렇군요. 그럼 "국물"은요?', 'Ah, je vois. Et « 국물 », alors ?', 'Oh, I see. What about “국물”?'],
    ['선생님', '"궁물"이라고 읽어요. 연습하면 쉬워져요.', 'On lit « 궁물 ». Avec de l’entraînement, ça devient facile.', 'You read it “궁물”. With practice it gets easy.'],
  ], [
    ['Quelle phrase Léo lit-il ?', 'Which sentence does Léo read?', ['Le coréen, c’est amusant', 'Korean is fun'], ['Le coréen, c’est difficile', 'Korean is difficult'], ['J’aime le kimchi', 'I like kimchi']],
    ['Comment lit-on 같이 ?', 'How is 같이 read?', ['Comme 가치', 'Like 가치'], ['Comme 가티', 'Like 가티'], ['Comme 각이', 'Like 각이']],
    ['Que conseille la professeure ?', 'What does the teacher advise?', ['De s’entraîner', 'To practise'], ['D’écrire plus vite', 'To write faster'], ['D’apprendre par cœur', 'To learn by heart']],
  ]),
  ko('ko-7', 7, '면접', L('L’entretien d’embauche', 'The job interview'), L('Le style soutenu en -습니다', 'The formal -습니다 style'), [
    ['면접관', '자기소개를 해 주십시오.', 'Présentez-vous, je vous prie.', 'Please introduce yourself.'],
    ['레오', '안녕하십니까. 저는 프랑스에서 온 레오라고 합니다.', 'Bonjour. Je m’appelle Léo et je viens de France.', 'Good morning. My name is Léo and I come from France.'],
    ['면접관', '한국어를 얼마나 공부하셨습니까?', 'Depuis combien de temps étudiez-vous le coréen ?', 'How long have you studied Korean?'],
    ['레오', '이 년 동안 공부했습니다. 한국 문화에 관심이 많습니다.', 'Je l’étudie depuis deux ans. La culture coréenne m’intéresse beaucoup.', 'I have studied it for two years. I am very interested in Korean culture.'],
    ['면접관', '왜 우리 회사에서 일하고 싶습니까?', 'Pourquoi voulez-vous travailler dans notre entreprise ?', 'Why do you want to work at our company?'],
    ['레오', '한국과 프랑스를 연결하는 일을 하고 싶기 때문입니다.', 'Parce que je veux faire un travail qui relie la Corée et la France.', 'Because I want a job that connects Korea and France.'],
    ['면접관', '잘 알겠습니다. 결과는 다음 주에 알려 드리겠습니다.', 'C’est noté. Nous vous communiquerons le résultat la semaine prochaine.', 'Understood. We will let you know the result next week.'],
  ], [
    ['Depuis combien de temps Léo étudie-t-il le coréen ?', 'How long has Léo studied Korean?', ['Deux ans', 'Two years'], ['Six mois', 'Six months'], ['Cinq ans', 'Five years']],
    ['Pourquoi veut-il ce travail ?', 'Why does he want this job?', ['Pour relier la Corée et la France', 'To connect Korea and France'], ['Pour gagner beaucoup d’argent', 'To earn a lot of money'], ['Pour habiter à Séoul', 'To live in Seoul']],
    ['Quand aura-t-il la réponse ?', 'When will he get an answer?', ['La semaine prochaine', 'Next week'], ['Demain', 'Tomorrow'], ['Dans un mois', 'In a month']],
  ]),
  ko('ko-8', 8, '이사', L('Le déménagement', 'Moving in'), L('Logement, banque, achats en ligne, météo', 'Housing, banking, online shopping, weather'), [
    ['민지', '레오 씨, 새 집은 어때요?', 'Léo, comment est ton nouveau logement ?', 'Léo, how’s your new place?'],
    ['레오', '원룸인데 깨끗하고 밝아요. 그런데 좀 작아요.', 'C’est un studio, propre et lumineux. Mais un peu petit.', 'It’s a studio, clean and bright. But a bit small.'],
    ['민지', '월세는 비싸요?', 'Le loyer est cher ?', 'Is the rent expensive?'],
    ['레오', '한 달에 오십만 원이에요. 은행에서 자동 이체를 신청했어요.', 'Cinq cent mille wons par mois. J’ai demandé un prélèvement automatique à la banque.', 'Five hundred thousand won a month. I set up a direct debit at the bank.'],
    ['민지', '가구는 샀어요?', 'Tu as acheté des meubles ?', 'Did you buy furniture?'],
    ['레오', '인터넷으로 책상하고 의자를 주문했어요. 내일 배송될 거예요.', 'J’ai commandé un bureau et une chaise sur internet. Ils seront livrés demain.', 'I ordered a desk and a chair online. They’ll be delivered tomorrow.'],
    ['민지', '내일 비가 온대요. 우산 꼭 챙기세요!', 'Il paraît qu’il va pleuvoir demain. N’oublie pas ton parapluie !', 'They say it’ll rain tomorrow. Don’t forget your umbrella!'],
  ], [
    ['Comment est le logement de Léo ?', 'What is Léo’s place like?', ['Propre mais petit', 'Clean but small'], ['Grand et sombre', 'Big and dark'], ['Bruyant', 'Noisy']],
    ['Qu’a-t-il commandé sur internet ?', 'What did he order online?', ['Un bureau et une chaise', 'A desk and a chair'], ['Un lit', 'A bed'], ['Un réfrigérateur', 'A fridge']],
    ['Quel temps fera-t-il demain ?', 'What will the weather be tomorrow?', ['Il va pleuvoir', 'It will rain'], ['Il va neiger', 'It will snow'], ['Il fera beau', 'It will be sunny']],
  ]),
  ko('ko-9', 9, '출근', L('Premier jour au bureau', 'First day at the office'), L('Documents, réunion et voyage d’affaires', 'Paperwork, a meeting and a business trip'), [
    ['부장님', '레오 씨, 오늘부터 같이 일하게 돼서 반가워요.', 'Léo, je suis ravi que nous travaillions ensemble à partir d’aujourd’hui.', 'Léo, I’m glad we’ll be working together from today.'],
    ['레오', '잘 부탁드립니다. 열심히 하겠습니다.', 'Je compte sur vous. Je ferai de mon mieux.', 'I look forward to working with you. I’ll do my best.'],
    ['부장님', '먼저 이 서류를 작성해서 인사팀에 내 주세요.', 'D’abord, remplissez ce document et remettez-le au service du personnel.', 'First, fill in this form and hand it to HR.'],
    ['레오', '네, 알겠습니다. 회의는 몇 시에 있어요?', 'Oui, entendu. À quelle heure est la réunion ?', 'Yes, understood. What time is the meeting?'],
    ['부장님', '오후 두 시예요. 다음 주에는 부산으로 출장을 가요.', 'À deux heures de l’après-midi. La semaine prochaine, nous partons en déplacement à Busan.', 'At two in the afternoon. Next week we’re going on a business trip to Busan.'],
    ['레오', '기차로 가요?', 'On y va en train ?', 'Are we going by train?'],
    ['부장님', '네, 기차로 두 시간 반 정도 걸려요. 추석 전에 돌아올 거예요.', 'Oui, le train met environ deux heures et demie. Nous rentrerons avant Chuseok.', 'Yes, it takes about two and a half hours by train. We’ll be back before Chuseok.'],
  ], [
    ['Que doit faire Léo en premier ?', 'What must Léo do first?', ['Remplir un document', 'Fill in a form'], ['Appeler un client', 'Call a client'], ['Préparer le café', 'Make coffee']],
    ['À quelle heure est la réunion ?', 'What time is the meeting?', ['À deux heures de l’après-midi', 'At two in the afternoon'], ['À neuf heures', 'At nine'], ['À six heures du soir', 'At six in the evening']],
    ['Comment vont-ils à Busan ?', 'How are they going to Busan?', ['En train', 'By train'], ['En avion', 'By plane'], ['En voiture', 'By car']],
  ]),
  ko('ko-10', 10, '건강', L('Pas en forme', 'Under the weather'), L('Santé, amitié et réseaux sociaux', 'Health, friendship and social media'), [
    ['민지', '레오 씨, 얼굴이 안 좋아 보여요. 어디 아파요?', 'Léo, tu n’as pas bonne mine. Tu as mal quelque part ?', 'Léo, you don’t look well. Does something hurt?'],
    ['레오', '어제부터 머리가 아프고 열이 나요.', 'Depuis hier, j’ai mal à la tête et de la fièvre.', 'Since yesterday I’ve had a headache and a fever.'],
    ['민지', '병원에 가 봤어요?', 'Tu es allé chez le médecin ?', 'Have you been to the doctor?'],
    ['레오', '아직요. 요즘 너무 바빠서 잠을 잘 못 잤어요.', 'Pas encore. Ces temps-ci, j’étais si occupé que j’ai mal dormi.', 'Not yet. I’ve been so busy lately that I haven’t slept well.'],
    ['민지', '건강이 제일 중요해요. 오늘은 푹 쉬세요.', 'La santé, c’est le plus important. Repose-toi bien aujourd’hui.', 'Health comes first. Get some proper rest today.'],
    ['레오', '고마워요. 민지 씨는 정말 좋은 친구예요.', 'Merci. Tu es vraiment une bonne amie.', 'Thank you. You’re a really good friend.'],
    ['민지', '그러니까 오늘은 SNS도 하지 말고 꼭 쉬어요!', 'Alors aujourd’hui, pas de réseaux sociaux : repose-toi vraiment !', 'So no social media today: really rest!'],
  ], [
    ['Qu’est-ce qui ne va pas chez Léo ?', 'What’s wrong with Léo?', ['Mal à la tête et de la fièvre', 'A headache and a fever'], ['Mal au ventre', 'A stomach ache'], ['Mal au dos', 'Back pain']],
    ['Pourquoi a-t-il mal dormi ?', 'Why hasn’t he slept well?', ['Il était très occupé', 'He’s been very busy'], ['Il faisait trop chaud', 'It was too hot'], ['Ses voisins étaient bruyants', 'His neighbours were noisy']],
    ['Que lui conseille Minji ?', 'What does Minji advise?', ['De bien se reposer', 'To rest properly'], ['D’aller travailler', 'To go to work'], ['De faire du sport', 'To do some sport']],
  ]),
  ko('ko-11', 11, '시간', L('Un an déjà', 'A year already'), L('Le temps qui passe, les habitudes, les projets', 'Time passing, habits, plans'), [
    ['레오', '벌써 한국에 온 지 일 년이 됐어요.', 'Ça fait déjà un an que je suis arrivé en Corée.', 'It’s already been a year since I came to Korea.'],
    ['민지', '시간이 정말 빨리 지나가네요.', 'Le temps passe vraiment vite.', 'Time really flies.'],
    ['레오', '처음에는 모든 게 낯설고 어색했어요.', 'Au début, tout était inconnu et je me sentais mal à l’aise.', 'At first everything felt strange and awkward.'],
    ['민지', '지금은 어때요?', 'Et maintenant ?', 'And now?'],
    ['레오', '이제는 익숙해졌어요. 한국 사람처럼 고개를 숙여서 인사해요.', 'Maintenant, j’ai l’habitude. Je salue en inclinant la tête, comme un Coréen.', 'I’m used to it now. I bow my head when I greet people, like a Korean.'],
    ['민지', '하하, 그럼 앞으로 계획이 뭐예요?', 'Haha. Et quels sont tes projets ?', 'Haha. So what are your plans?'],
    ['레오', '한국에서 일하면서 계속 배우고 싶어요. 제 꿈은 통역사가 되는 거예요.', 'J’aimerais travailler en Corée tout en continuant à apprendre. Mon rêve, c’est de devenir interprète.', 'I want to keep learning while working in Korea. My dream is to become an interpreter.'],
  ], [
    ['Depuis combien de temps Léo est-il en Corée ?', 'How long has Léo been in Korea?', ['Un an', 'A year'], ['Un mois', 'A month'], ['Cinq ans', 'Five years']],
    ['Comment se sentait-il au début ?', 'How did he feel at first?', ['Dépaysé et mal à l’aise', 'Out of place and awkward'], ['Très à l’aise', 'Very comfortable'], ['En colère', 'Angry']],
    ['Quel est son rêve ?', 'What is his dream?', ['Devenir interprète', 'To become an interpreter'], ['Devenir cuisinier', 'To become a cook'], ['Rentrer en France', 'To go back to France']],
  ]),
  ko('ko-12', 12, '편지', L('Une lettre à la famille', 'A letter home'), L('Raconter sa vie en quelques lignes', 'Telling your life in a few lines'), [
    ['', '사랑하는 가족에게,', 'À ma chère famille,', 'To my dear family,'],
    ['', '저는 서울에서 잘 지내고 있어요.', 'Je vais bien à Séoul.', 'I’m doing well in Seoul.'],
    ['', '요즘은 회사 일이 많지만 동료들이 친절해서 즐거워요.', 'En ce moment, il y a beaucoup de travail, mais mes collègues sont gentils, alors c’est agréable.', 'There’s a lot of work at the moment, but my colleagues are kind, so it’s enjoyable.'],
    ['', '주말에는 민지와 등산을 하거나 시장에서 맛있는 음식을 먹어요.', 'Le week-end, je fais de la randonnée avec Minji ou je mange de bons plats au marché.', 'At weekends I go hiking with Minji or eat delicious food at the market.'],
    ['', '지난달에는 부산에 가서 바닷가에서 회를 먹었어요.', 'Le mois dernier, je suis allé à Busan et j’ai mangé du poisson cru au bord de la mer.', 'Last month I went to Busan and ate raw fish by the sea.'],
    ['', '다들 보고 싶어요. 겨울에 프랑스에 갈게요.', 'Vous me manquez tous. Je viendrai en France cet hiver.', 'I miss you all. I’ll come to France this winter.'],
    ['', '레오가', 'Léo', 'Léo'],
  ], [
    ['Comment sont ses collègues ?', 'What are his colleagues like?', ['Gentils', 'Kind'], ['Sévères', 'Strict'], ['Souvent absents', 'Often away']],
    ['Qu’a-t-il fait à Busan ?', 'What did he do in Busan?', ['Manger du poisson cru au bord de la mer', 'Eat raw fish by the sea'], ['Visiter un musée', 'Visit a museum'], ['Prendre l’avion', 'Take a plane']],
    ['Quand ira-t-il en France ?', 'When will he go to France?', ['Cet hiver', 'This winter'], ['Cet été', 'This summer'], ['Jamais', 'Never']],
  ]),
  ko('ko-13', 13, '반말', L('Entre amis', 'Between friends'), L('Le style familier, sans les terminaisons polies', 'The casual style, without polite endings'), [
    ['민지', '레오야, 이번 주말에 뭐 해?', 'Léo, tu fais quoi ce week-end ?', 'Léo, what are you doing this weekend?'],
    ['레오', '아직 몰라. 너는?', 'Je ne sais pas encore. Et toi ?', 'Don’t know yet. You?'],
    ['민지', '나는 콘서트에 가고 싶은데 표가 없어.', 'J’aimerais aller à un concert, mais je n’ai pas de billet.', 'I want to go to a concert, but I don’t have a ticket.'],
    ['레오', '진짜? 나한테 표 두 장 있어! 회사에서 받았어.', 'Vraiment ? Moi, j’ai deux billets ! On me les a donnés au travail.', 'Really? I’ve got two tickets! I got them at work.'],
    ['민지', '대박! 그럼 같이 가자!', 'Génial ! Alors on y va ensemble !', 'Awesome! Let’s go together then!'],
    ['레오', '좋아. 근데 늦지 마. 지난번에는 삼십 분이나 늦었잖아.', 'D’accord. Mais ne sois pas en retard. La dernière fois, tu avais trente minutes de retard.', 'OK. But don’t be late. Last time you were thirty minutes late.'],
    ['민지', '알았어, 알았어. 이번에는 절대 안 늦을게!', 'Oui, oui. Cette fois, je ne serai absolument pas en retard !', 'OK, OK. This time I definitely won’t be late!'],
  ], [
    ['Pourquoi Minji ne peut-elle pas aller au concert ?', 'Why can’t Minji go to the concert?', ['Elle n’a pas de billet', 'She has no ticket'], ['Elle est malade', 'She’s ill'], ['Elle travaille', 'She’s working']],
    ['Où Léo a-t-il eu les billets ?', 'Where did Léo get the tickets?', ['Au travail', 'At work'], ['Sur internet', 'Online'], ['Par sa famille', 'From his family']],
    ['Que reproche Léo à Minji ?', 'What does Léo tease Minji about?', ['D’avoir été en retard', 'Being late'], ['D’avoir oublié son anniversaire', 'Forgetting his birthday'], ['D’avoir perdu les billets', 'Losing the tickets']],
  ]),
  ko('ko-14', 14, '다시', L('Le jour des retrouvailles', 'The day they met again'), L('Un récit au style écrit', 'A story in written style'), [
    ['', '레오가 한국에 온 지 삼 년이 지난 어느 봄날이었다.', 'C’était un jour de printemps, trois ans après l’arrivée de Léo en Corée.', 'It was a spring day, three years after Léo had come to Korea.'],
    ['', '그는 처음 민지를 만났던 학교 앞 카페에 다시 앉아 있었다.', 'Il était de nouveau assis au café devant l’école, là où il avait rencontré Minji pour la première fois.', 'He was sitting again in the café in front of the school where he had first met Minji.'],
    ['', '그때는 "안녕하세요" 한마디도 떨려서 제대로 하지 못했지만, 지금은 통역사로 일하고 있다.', 'À l’époque, il tremblait tant qu’il n’arrivait même pas à dire « bonjour » correctement ; aujourd’hui, il travaille comme interprète.', 'Back then he was too nervous even to say “hello” properly; now he works as an interpreter.'],
    ['', '문이 열리고 민지가 웃으며 들어왔다.', 'La porte s’ouvrit et Minji entra en souriant.', 'The door opened and Minji came in, smiling.'],
    ['민지', '레오야, 우리 처음 만난 날 기억나?', 'Léo, tu te souviens du jour où on s’est rencontrés ?', 'Léo, do you remember the day we first met?'],
    ['레오', '당연하지. 그날 네가 "내일 학교에서 봐요"라고 한 말이 아직도 생각나.', 'Bien sûr. Je me souviens encore que, ce jour-là, tu m’as dit « À demain, à l’école ».', 'Of course. I still remember you saying “See you tomorrow at school” that day.'],
    ['', '두 사람은 오랫동안 이야기를 나누며, 언어가 사람과 사람을 이어 준다는 것을 다시 한번 느꼈다.', 'Ils parlèrent longtemps et sentirent une fois de plus que la langue relie les gens.', 'They talked for a long time and felt once again that language brings people together.'],
  ], [
    ['Depuis combien de temps Léo est-il en Corée ?', 'How long has Léo been in Korea?', ['Trois ans', 'Three years'], ['Un an', 'One year'], ['Dix ans', 'Ten years']],
    ['Quel est son métier aujourd’hui ?', 'What is his job now?', ['Interprète', 'Interpreter'], ['Professeur', 'Teacher'], ['Cuisinier', 'Cook']],
    ['De quoi Léo se souvient-il ?', 'What does Léo remember?', ['Des mots de Minji le jour de leur rencontre', 'Minji’s words the day they met'], ['D’un voyage à Busan', 'A trip to Busan'], ['De son premier salaire', 'His first salary']],
  ]),
  ko('ko-15', 15, '경주', L('Week-end à Gyeongju', 'A weekend in Gyeongju'), L('Visiter, faire une pause au café, voir la ville la nuit', 'Sightseeing, a café break, the city by night'), [
    ['', '토요일 아침, 레오와 민지는 기차를 타고 경주에 갔다.', 'Samedi matin, Léo et Minji prirent le train pour Gyeongju.', 'On Saturday morning, Léo and Minji took the train to Gyeongju.'],
    ['민지', '경주는 옛날 신라의 수도였어요. 볼 게 정말 많아요.', 'Gyeongju était la capitale de l’ancien royaume de Silla. Il y a plein de choses à voir.', 'Gyeongju was the capital of the old Silla kingdom. There’s so much to see.'],
    ['레오', '먼저 호텔에 짐을 맡기고 절을 구경하는 게 어때요?', 'Et si on déposait d’abord nos bagages à l’hôtel pour aller visiter le temple ?', 'How about leaving our bags at the hotel first and visiting the temple?'],
    ['', '절은 관광객으로 가득했지만, 경치는 생각보다 훨씬 아름다웠다.', 'Le temple était plein de touristes, mais le paysage était bien plus beau que prévu.', 'The temple was full of tourists, but the scenery was far more beautiful than expected.'],
    ['민지', '다리 아프죠? 저기 카페에서 좀 쉬어요.', 'Tu as mal aux jambes ? Faisons une pause dans ce café, là-bas.', 'Your legs hurt, right? Let’s rest in that café over there.'],
    ['레오', '좋아요. 저는 빙수 먹을래요. 민지 씨는요?', 'D’accord. Moi, je prends une glace pilée. Et toi, Minji ?', 'Good idea. I’ll have shaved ice. What about you, Minji?'],
    ['민지', '저는 따뜻한 녹차요. 밤에는 야경을 보러 가요!', 'Moi, un thé vert chaud. Ce soir, on va voir la ville illuminée !', 'A hot green tea for me. Tonight let’s go and see the night view!'],
  ], [
    ['Comment sont-ils allés à Gyeongju ?', 'How did they get to Gyeongju?', ['En train', 'By train'], ['En voiture', 'By car'], ['En avion', 'By plane']],
    ['Qu’a commandé Léo au café ?', 'What did Léo order at the café?', ['Une glace pilée', 'Shaved ice'], ['Un thé vert', 'A green tea'], ['Un gâteau', 'A cake']],
    ['Que veulent-ils faire le soir ?', 'What do they want to do in the evening?', ['Voir la ville la nuit', 'See the night view'], ['Aller au karaoké', 'Go to karaoke'], ['Rentrer à Séoul', 'Go back to Seoul']],
  ]),
  ko('ko-16', 16, '나비', L('Le chat a disparu', 'The missing cat'), L('Une recherche dans le quartier, un jardin et un soulagement', 'A search of the neighbourhood, a garden and a relief'), [
    ['', '일요일 오후, 민지에게서 급한 전화가 왔다.', 'Dimanche après-midi, Minji appela en urgence.', 'On Sunday afternoon, Minji made an urgent call.'],
    ['민지', '레오 씨, 큰일 났어요! 고양이 나비가 없어졌어요.', 'Léo, c’est la catastrophe ! Mon chat Nabi a disparu.', 'Léo, it’s terrible! My cat Nabi has gone missing.'],
    ['레오', '진정하세요. 지금 바로 갈게요. 마지막으로 언제 봤어요?', 'Calme-toi. J’arrive tout de suite. Tu l’as vu pour la dernière fois quand ?', 'Calm down. I’m coming right now. When did you last see him?'],
    ['민지', '아침에 창문을 열어 놓았는데, 그때 나간 것 같아요.', 'J’avais laissé la fenêtre ouverte ce matin ; il a dû sortir à ce moment-là.', 'I left the window open this morning; he must have got out then.'],
    ['', '두 사람은 동네를 돌아다니며 이웃들에게 물어보았다.', 'Ils firent le tour du quartier en interrogeant les voisins.', 'They went around the neighbourhood asking the neighbours.'],
    ['', '그때 옆집 할머니의 정원에서 작은 소리가 들렸다. "야옹!"', 'C’est alors qu’un petit bruit vint du jardin de la vieille dame d’à côté : « Miaou ! »', 'Just then a little sound came from the old lady’s garden next door: “Meow!”'],
    ['민지', '나비야! 꽃 사이에서 자고 있었구나. 정말 다행이다.', 'Nabi ! Tu dormais au milieu des fleurs. Quel soulagement !', 'Nabi! You were sleeping among the flowers. What a relief!'],
  ], [
    ['Qu’est-il arrivé à Minji ?', 'What happened to Minji?', ['Son chat a disparu', 'Her cat went missing'], ['Elle s’est blessée', 'She got hurt'], ['Elle a perdu son portefeuille', 'She lost her wallet']],
    ['Par où le chat est-il sorti ?', 'How did the cat get out?', ['Par la fenêtre ouverte', 'Through the open window'], ['Par la porte d’entrée', 'Through the front door'], ['Dans un sac', 'In a bag']],
    ['Où était le chat ?', 'Where was the cat?', ['Dans le jardin de la voisine', 'In the neighbour’s garden'], ['À la clinique vétérinaire', 'At the vet’s'], ['Sous le lit', 'Under the bed']],
  ]),
  ko('ko-17', 17, '첫 출근', L('Premier jour à la télé', 'First day at the TV station'), L('Actualités, trac et messages entre amis', 'News, nerves and texts between friends'), [
    ['', '레오는 방송국에서 통역사로 첫 출근을 했다.', 'Léo commençait son premier jour comme interprète dans une chaîne de télévision.', 'Léo started his first day as an interpreter at a TV station.'],
    ['', '뉴스 팀은 아침부터 정신없이 바빴다. 선거 결과가 곧 발표될 예정이었다.', 'L’équipe de l’info était débordée depuis le matin : les résultats de l’élection allaient être annoncés.', 'The news team had been frantically busy since morning: the election results were about to be announced.'],
    ['기자', '레오 씨, 이 인터뷰를 프랑스어로 통역해 줄 수 있어요?', 'Léo, tu peux interpréter cette interview en français ?', 'Léo, can you interpret this interview into French?'],
    ['레오', '네, 해 볼게요. 가슴이 두근두근하네요.', 'Oui, je vais essayer. J’ai le cœur qui bat la chamade.', 'Yes, I’ll give it a try. My heart is pounding.'],
    ['', '통역은 생각보다 순조롭게 끝났고, 모두가 박수를 쳤다.', 'L’interprétation se passa mieux que prévu, et tout le monde applaudit.', 'The interpreting went more smoothly than expected, and everyone applauded.'],
    ['', '저녁에 민지에게서 문자가 왔다. "첫날 어땠어? ㅋㅋ 떨렸지?"', 'Le soir, Minji lui envoya un message : « Alors, ce premier jour ? mdr T’avais le trac ? »', 'In the evening Minji texted: “How was day one? lol Were you nervous?”'],
    ['레오', '응, 엄청 떨렸어. 그래도 사장님이 잘했다고 하셨어! ㅎㅎ', 'Ouais, super stressé. Mais le patron m’a dit que j’avais bien travaillé ! haha', 'Yeah, super nervous. But the boss said I did well! haha'],
  ], [
    ['Où Léo travaille-t-il ?', 'Where does Léo work?', ['Dans une chaîne de télévision', 'At a TV station'], ['Dans un hôtel', 'At a hotel'], ['Dans une école', 'At a school']],
    ['Quelle nouvelle l’équipe attendait-elle ?', 'What news was the team waiting for?', ['Les résultats d’une élection', 'Election results'], ['La météo', 'The weather forecast'], ['Un match de football', 'A football match']],
    ['Comment s’est passée l’interprétation ?', 'How did the interpreting go?', ['Mieux que prévu', 'Better than expected'], ['Très mal', 'Very badly'], ['Elle a été annulée', 'It was cancelled']],
  ]),
];

const JA = [
  ja('ja-2', 2, '出会い', L('Première rencontre', 'First meeting'), L('Se présenter et se dire à demain', 'Introducing yourself and saying see you tomorrow'), [
    ['ゆい', 'こんにちは！ わたしは ゆいです。', 'Bonjour ! Je suis Yui.', 'Hello! I’m Yui.'],
    ['レオ', 'こんにちは、 ゆいさん。 わたしは レオです。', 'Bonjour, Yui. Moi, c’est Léo.', 'Hello, Yui. I’m Léo.'],
    ['ゆい', 'レオさんは どこの 国[くに]の 人[ひと]ですか。', 'Léo, tu viens de quel pays ?', 'Léo, which country are you from?'],
    ['レオ', 'フランス人[じん]です。 学生[がくせい]です。', 'Je suis français. Je suis étudiant.', 'I’m French. I’m a student.'],
    ['ゆい', 'そうですか。 わたしも 学生[がくせい]です！', 'Ah bon ? Moi aussi, je suis étudiante !', 'Oh really? I’m a student too!'],
    ['レオ', 'どうぞ よろしく おねがいします。', 'Enchanté.', 'Nice to meet you.'],
    ['ゆい', 'こちらこそ。 また あした 学校[がっこう]で！', 'Moi aussi. À demain, à l’école !', 'Likewise. See you tomorrow at school!'],
  ], [
    ['De quel pays vient Léo ?', 'Which country is Léo from?', ['De France', 'France'], ['Du Japon', 'Japan'], ['De Corée', 'Korea']],
    ['Que fait Yui ?', 'What does Yui do?', ['Elle est étudiante', 'She’s a student'], ['Elle est professeure', 'She’s a teacher'], ['Elle est médecin', 'She’s a doctor']],
    ['Où se revoient-ils demain ?', 'Where will they meet tomorrow?', ['À l’école', 'At school'], ['Au café', 'At the café'], ['À la gare', 'At the station']],
  ]),
  ja('ja-3', 3, '店', L('À la boutique', 'At the shop'), L('Demander le prix et acheter', 'Asking the price and buying'), [
    ['レオ', 'すみません、 りんごは いくらですか。', 'Excusez-moi, combien coûtent les pommes ?', 'Excuse me, how much are the apples?'],
    ['店員', '一[ひと]つ 百円[ひゃくえん]です。', 'Cent yens pièce.', 'One hundred yen each.'],
    ['レオ', 'じゃあ、 三[みっ]つ ください。', 'Alors, trois s’il vous plaît.', 'Then three, please.'],
    ['店員', 'はい、 三百円[さんびゃくえん]です。', 'Voilà, ça fait trois cents yens.', 'Here you are, that’s three hundred yen.'],
    ['レオ', 'おにぎりも ありますか。', 'Vous avez aussi des onigiri ?', 'Do you have rice balls too?'],
    ['店員', 'はい、 ありますよ。 とても おいしいです。', 'Oui. Ils sont très bons.', 'Yes, we do. They’re really good.'],
    ['レオ', 'じゃあ、 おにぎりも 一[ひと]つ ください。 ありがとうございます！', 'Alors un onigiri aussi, s’il vous plaît. Merci !', 'One rice ball too, please. Thank you!'],
  ], [
    ['Combien coûte une pomme ?', 'How much is one apple?', ['100 yens', '100 yen'], ['300 yens', '300 yen'], ['1 000 yens', '1,000 yen']],
    ['Combien de pommes Léo achète-t-il ?', 'How many apples does Léo buy?', ['Trois', 'Three'], ['Une', 'One'], ['Dix', 'Ten']],
    ['Qu’achète-t-il aussi ?', 'What else does he buy?', ['Un onigiri', 'A rice ball'], ['Du pain', 'Bread'], ['Du thé', 'Tea']],
  ]),
  ja('ja-4', 4, '電車', L('Prendre le métro', 'Taking the subway'), L('Demander son chemin', 'Asking the way'), [
    ['レオ', 'すみません。 浅草[あさくさ]へは どう 行[い]きますか。', 'Excusez-moi. Comment va-t-on à Asakusa ?', 'Excuse me. How do I get to Asakusa?'],
    ['通行人', '銀座線[ぎんざせん]に 乗[の]って ください。', 'Prenez la ligne Ginza.', 'Take the Ginza line.'],
    ['レオ', 'どの 駅[えき]で 降[お]りますか。', 'À quelle station dois-je descendre ?', 'Which station do I get off at?'],
    ['通行人', '浅草駅[あさくさえき]で 降[お]りて ください。 ここから 近[ちか]いですよ。', 'Descendez à la station Asakusa. C’est près d’ici.', 'Get off at Asakusa Station. It’s close to here.'],
    ['レオ', '何分[なんぷん]ぐらい かかりますか。', 'Ça prend combien de minutes ?', 'About how many minutes does it take?'],
    ['通行人', '十五分[じゅうごふん]ぐらいです。', 'Environ quinze minutes.', 'About fifteen minutes.'],
    ['レオ', 'どうも ありがとうございます！', 'Merci beaucoup !', 'Thank you very much!'],
  ], [
    ['Où Léo veut-il aller ?', 'Where does Léo want to go?', ['À Asakusa', 'To Asakusa'], ['À la gare de Tokyo', 'To Tokyo Station'], ['À l’aéroport', 'To the airport']],
    ['Que doit-il prendre ?', 'What should he take?', ['La ligne Ginza', 'The Ginza line'], ['Le bus', 'The bus'], ['Un taxi', 'A taxi']],
    ['Combien de temps faut-il ?', 'How long does it take?', ['Environ quinze minutes', 'About fifteen minutes'], ['Une heure', 'An hour'], ['Cinq minutes', 'Five minutes']],
  ]),
  ja('ja-5', 5, '週末', L('Le week-end', 'The weekend'), L('Raconter au passé, proposer une sortie', 'Telling in the past, suggesting an outing'), [
    ['ゆい', 'レオさん、 週末[しゅうまつ]は 何[なに]を しましたか。', 'Léo, qu’as-tu fait ce week-end ?', 'Léo, what did you do at the weekend?'],
    ['レオ', '友[とも]だちと 公園[こうえん]へ 行[い]きました。 自転車[じてんしゃ]に 乗[の]りました。', 'Je suis allé au parc avec un ami. On a fait du vélo.', 'I went to the park with a friend. We rode bikes.'],
    ['ゆい', 'わあ、 楽[たの]しかったですか。', 'Waouh, c’était bien ?', 'Wow, was it fun?'],
    ['レオ', 'はい、 とても 楽[たの]しかったです。 でも、 少[すこ]し 疲[つか]れました。', 'Oui, vraiment. Mais j’étais un peu fatigué.', 'Yes, it was great fun. But I got a little tired.'],
    ['ゆい', '来週[らいしゅう]の 週末[しゅうまつ]は 何[なに]を しますか。', 'Et le week-end prochain, que vas-tu faire ?', 'What will you do next weekend?'],
    ['レオ', '映画[えいが]を 見[み]たいです。 いっしょに 行[い]きませんか。', 'J’ai envie de voir un film. Tu veux venir avec moi ?', 'I want to see a film. Would you like to come?'],
    ['ゆい', 'いいですね！ 土曜日[どようび]に 会[あ]いましょう。', 'Bonne idée ! Retrouvons-nous samedi.', 'Sounds good! Let’s meet on Saturday.'],
  ], [
    ['Qu’a fait Léo ce week-end ?', 'What did Léo do at the weekend?', ['Du vélo au parc', 'Cycling in the park'], ['Du shopping', 'Shopping'], ['Il a dormi', 'He slept']],
    ['Comment se sentait-il ?', 'How did he feel?', ['Un peu fatigué', 'A little tired'], ['Malade', 'Ill'], ['Triste', 'Sad']],
    ['Que vont-ils faire samedi ?', 'What will they do on Saturday?', ['Voir un film', 'See a film'], ['Faire du vélo', 'Go cycling'], ['Faire les courses', 'Go shopping']],
  ]),
  ja('ja-6', 6, '読み', L('Leçon de lecture', 'Reading lesson'), L('Les lectures particulières des kanji', 'Special kanji readings'), [
    ['先生', 'レオさん、 この 文[ぶん]を 読[よ]んで ください。', 'Léo, lis cette phrase, s’il te plaît.', 'Léo, please read this sentence.'],
    ['レオ', '日本語[にほんご]は おもしろいです。', '« Le japonais, c’est intéressant. »', '“Japanese is interesting.”'],
    ['先生', 'よく できました。 では、 「一日[ついたち]」は 読[よ]めますか。', 'Très bien. Et 一日, tu sais le lire ?', 'Well done. Now, can you read “一日”?'],
    ['レオ', '「いちにち」ですか。', 'C’est « ichinichi » ?', 'Is it “ichinichi”?'],
    ['先生', '「いちにち」とも 読[よ]みますが、 月[つき]の 最初[さいしょ]の 日[ひ]は 「ついたち」です。', 'On le lit aussi « ichinichi », mais le premier jour du mois se dit « tsuitachi ».', 'It can also be read “ichinichi”, but the first day of the month is “tsuitachi”.'],
    ['レオ', 'へえ、 むずかしいですね。 「大人[おとな]」も 特別[とくべつ]な 読[よ]み方[かた]ですか。', 'Tiens, c’est difficile. Et 大人, c’est aussi une lecture spéciale ?', 'Huh, that’s hard. Is “大人” a special reading too?'],
    ['先生', 'そうです。 練習[れんしゅう]すれば、 だんだん 慣[な]れますよ。', 'Oui. Avec de l’entraînement, tu t’y habitueras peu à peu.', 'Yes. With practice you’ll gradually get used to them.'],
  ], [
    ['Quelle phrase Léo lit-il ?', 'Which sentence does Léo read?', ['Le japonais, c’est intéressant', 'Japanese is interesting'], ['Le japonais, c’est difficile', 'Japanese is difficult'], ['J’aime les sushis', 'I like sushi']],
    ['Comment dit-on « le premier jour du mois » ?', 'How do you say “the first day of the month”?', ['Tsuitachi', 'Tsuitachi'], ['Ichinichi', 'Ichinichi'], ['Hitohi', 'Hitohi']],
    ['Que conseille la professeure ?', 'What does the teacher advise?', ['De s’entraîner', 'To practise'], ['D’écrire plus vite', 'To write faster'], ['D’apprendre par cœur', 'To learn by heart']],
  ]),
  ja('ja-7', 7, '面接', L('L’entretien d’embauche', 'The job interview'), L('Le langage respectueux (keigo)', 'Respectful language (keigo)'), [
    ['面接官', '自己紹介[じこしょうかい]を お願[ねが]いします。', 'Présentez-vous, je vous prie.', 'Please introduce yourself.'],
    ['レオ', 'はじめまして。 フランスから 来[き]た レオと 申[もう]します。', 'Enchanté. Je m’appelle Léo et je viens de France.', 'How do you do. My name is Léo and I come from France.'],
    ['面接官', '日本語[にほんご]は どのくらい 勉強[べんきょう]されましたか。', 'Depuis combien de temps étudiez-vous le japonais ?', 'How long have you studied Japanese?'],
    ['レオ', '二年間[にねんかん] 勉強[べんきょう]いたしました。 日本[にほん]の 文化[ぶんか]に とても 興味[きょうみ]が ございます。', 'Je l’étudie depuis deux ans. La culture japonaise m’intéresse beaucoup.', 'I have studied it for two years. I am very interested in Japanese culture.'],
    ['面接官', 'なぜ 弊社[へいしゃ]で 働[はたら]きたいのですか。', 'Pourquoi voulez-vous travailler dans notre entreprise ?', 'Why do you want to work at our company?'],
    ['レオ', '日本[にほん]と フランスを つなぐ 仕事[しごと]が したいからです。', 'Parce que je veux faire un travail qui relie le Japon et la France.', 'Because I want a job that connects Japan and France.'],
    ['面接官', 'わかりました。 結果[けっか]は 来週[らいしゅう] ご連絡[れんらく]いたします。', 'C’est noté. Nous vous communiquerons le résultat la semaine prochaine.', 'Understood. We will contact you with the result next week.'],
  ], [
    ['Depuis combien de temps Léo étudie-t-il le japonais ?', 'How long has Léo studied Japanese?', ['Deux ans', 'Two years'], ['Six mois', 'Six months'], ['Cinq ans', 'Five years']],
    ['Pourquoi veut-il ce travail ?', 'Why does he want this job?', ['Pour relier le Japon et la France', 'To connect Japan and France'], ['Pour gagner beaucoup d’argent', 'To earn a lot of money'], ['Pour habiter à Tokyo', 'To live in Tokyo']],
    ['Quand aura-t-il la réponse ?', 'When will he get an answer?', ['La semaine prochaine', 'Next week'], ['Demain', 'Tomorrow'], ['Dans un mois', 'In a month']],
  ]),
  ja('ja-8', 8, '引越', L('Le déménagement', 'Moving in'), L('Logement, banque, achats en ligne, météo', 'Housing, banking, online shopping, weather'), [
    ['ゆい', 'レオさん、 新[あたら]しい 部屋[へや]は どうですか。', 'Léo, comment est ton nouvel appartement ?', 'Léo, how’s your new flat?'],
    ['レオ', 'ワンルームですが、 きれいで 明[あか]るいです。 でも、 ちょっと 狭[せま]いです。', 'C’est un studio, propre et lumineux. Mais un peu petit.', 'It’s a studio, clean and bright. But a bit small.'],
    ['ゆい', '家賃[やちん]は 高[たか]いですか。', 'Le loyer est cher ?', 'Is the rent expensive?'],
    ['レオ', '月[つき]に 七万円[ななまんえん]です。 銀行[ぎんこう]で 自動[じどう] 引[ひ]き落[お]としを 申[もう]し込[こ]みました。', 'Soixante-dix mille yens par mois. J’ai demandé un prélèvement automatique à la banque.', 'Seventy thousand yen a month. I set up a direct debit at the bank.'],
    ['ゆい', '家具[かぐ]は 買[か]いましたか。', 'Tu as acheté des meubles ?', 'Did you buy furniture?'],
    ['レオ', 'ネットで 机[つくえ]と いすを 注文[ちゅうもん]しました。 あした 届[とど]きます。', 'J’ai commandé un bureau et une chaise sur internet. Ils arrivent demain.', 'I ordered a desk and a chair online. They arrive tomorrow.'],
    ['ゆい', 'あしたは 雨[あめ]だそうですよ。 傘[かさ]を 忘[わす]れないで くださいね。', 'Il paraît qu’il va pleuvoir demain. N’oublie pas ton parapluie !', 'They say it’ll rain tomorrow. Don’t forget your umbrella!'],
  ], [
    ['Comment est l’appartement de Léo ?', 'What is Léo’s flat like?', ['Propre mais petit', 'Clean but small'], ['Grand et sombre', 'Big and dark'], ['Bruyant', 'Noisy']],
    ['Qu’a-t-il commandé sur internet ?', 'What did he order online?', ['Un bureau et une chaise', 'A desk and a chair'], ['Un lit', 'A bed'], ['Un réfrigérateur', 'A fridge']],
    ['Quel temps fera-t-il demain ?', 'What will the weather be tomorrow?', ['Il va pleuvoir', 'It will rain'], ['Il va neiger', 'It will snow'], ['Il fera beau', 'It will be sunny']],
  ]),
  ja('ja-9', 9, '出勤', L('Premier jour au bureau', 'First day at the office'), L('Documents, réunion et voyage d’affaires', 'Paperwork, a meeting and a business trip'), [
    ['部長', 'レオさん、 今日[きょう]から よろしく お願[ねが]いします。', 'Léo, à partir d’aujourd’hui, je compte sur vous.', 'Léo, welcome aboard from today.'],
    ['レオ', 'よろしく お願[ねが]いいたします。 がんばります。', 'Moi de même. Je ferai de mon mieux.', 'Thank you. I’ll do my best.'],
    ['部長', 'まず、 この 書類[しょるい]を 書[か]いて、 人事部[じんじぶ]に 出[だ]して ください。', 'D’abord, remplissez ce document et remettez-le au service du personnel.', 'First, fill in this form and hand it to HR.'],
    ['レオ', 'はい、 わかりました。 会議[かいぎ]は 何時[なんじ]からですか。', 'Oui, entendu. À quelle heure commence la réunion ?', 'Yes, understood. What time does the meeting start?'],
    ['部長', '午後[ごご] 二時[にじ]からです。 来週[らいしゅう]は 大阪[おおさか]へ 出張[しゅっちょう]ですよ。', 'À deux heures de l’après-midi. La semaine prochaine, nous partons en déplacement à Osaka.', 'At two in the afternoon. Next week we have a business trip to Osaka.'],
    ['レオ', '電車[でんしゃ]で 行[い]きますか。', 'On y va en train ?', 'Are we going by train?'],
    ['部長', 'ええ、 新幹線[しんかんせん]で 二時間半[にじかんはん]ぐらいです。 お盆[ぼん]の 前[まえ]に 帰[かえ]ります。', 'Oui, environ deux heures et demie en shinkansen. Nous rentrerons avant Obon.', 'Yes, about two and a half hours by shinkansen. We’ll be back before Obon.'],
  ], [
    ['Que doit faire Léo en premier ?', 'What must Léo do first?', ['Remplir un document', 'Fill in a form'], ['Appeler un client', 'Call a client'], ['Préparer le thé', 'Make tea']],
    ['À quelle heure commence la réunion ?', 'What time does the meeting start?', ['À deux heures de l’après-midi', 'At two in the afternoon'], ['À neuf heures', 'At nine'], ['À six heures du soir', 'At six in the evening']],
    ['Comment vont-ils à Osaka ?', 'How are they going to Osaka?', ['En shinkansen', 'By shinkansen'], ['En avion', 'By plane'], ['En voiture', 'By car']],
  ]),
  ja('ja-10', 10, '健康', L('Pas en forme', 'Under the weather'), L('Santé, amitié et réseaux sociaux', 'Health, friendship and social media'), [
    ['ゆい', 'レオさん、 顔色[かおいろ]が 悪[わる]いですよ。 どこか 痛[いた]いんですか。', 'Léo, tu n’as pas bonne mine. Tu as mal quelque part ?', 'Léo, you look pale. Does something hurt?'],
    ['レオ', 'きのうから 頭[あたま]が 痛[いた]くて、 熱[ねつ]も あります。', 'Depuis hier, j’ai mal à la tête et j’ai aussi de la fièvre.', 'Since yesterday I’ve had a headache, and a fever too.'],
    ['ゆい', '病院[びょういん]へ 行[い]きましたか。', 'Tu es allé chez le médecin ?', 'Have you been to the doctor?'],
    ['レオ', 'まだです。 最近[さいきん] 忙[いそが]しくて、 よく 寝[ね]られませんでした。', 'Pas encore. Ces temps-ci, j’étais si occupé que je n’ai pas bien dormi.', 'Not yet. I’ve been busy lately and couldn’t sleep well.'],
    ['ゆい', '健康[けんこう]が いちばん 大切[たいせつ]ですよ。 今日[きょう]は ゆっくり 休[やす]んで ください。', 'La santé, c’est le plus important. Repose-toi bien aujourd’hui.', 'Health comes first. Please take it easy today.'],
    ['レオ', 'ありがとう。 ゆいさんは 本当[ほんとう]に いい 友[とも]だちです。', 'Merci. Tu es vraiment une bonne amie.', 'Thank you. You’re a really good friend.'],
    ['ゆい', 'だから、 今日[きょう]は SNSも 見[み]ないで、 ちゃんと 休[やす]んでね。', 'Alors aujourd’hui, pas de réseaux sociaux : repose-toi vraiment.', 'So no social media today: get some proper rest.'],
  ], [
    ['Qu’est-ce qui ne va pas chez Léo ?', 'What’s wrong with Léo?', ['Mal à la tête et de la fièvre', 'A headache and a fever'], ['Mal au ventre', 'A stomach ache'], ['Mal au dos', 'Back pain']],
    ['Pourquoi a-t-il mal dormi ?', 'Why hasn’t he slept well?', ['Il était très occupé', 'He’s been very busy'], ['Il faisait trop chaud', 'It was too hot'], ['Ses voisins étaient bruyants', 'His neighbours were noisy']],
    ['Que lui conseille Yui ?', 'What does Yui advise?', ['De bien se reposer', 'To rest properly'], ['D’aller travailler', 'To go to work'], ['De faire du sport', 'To do some sport']],
  ]),
  ja('ja-11', 11, '時間', L('Un an déjà', 'A year already'), L('Le temps qui passe, les habitudes, les projets', 'Time passing, habits, plans'), [
    ['レオ', '日本[にほん]に 来[き]て、 もう 一年[いちねん]に なりました。', 'Ça fait déjà un an que je suis arrivé au Japon.', 'It’s already been a year since I came to Japan.'],
    ['ゆい', '時間[じかん]が たつのは 本当[ほんとう]に 早[はや]いですね。', 'Le temps passe vraiment vite.', 'Time really flies.'],
    ['レオ', '最初[さいしょ]は 何[なに]もかも 慣[な]れなくて、 戸惑[とまど]いました。', 'Au début, rien ne m’était familier et j’étais perdu.', 'At first nothing felt familiar and I was confused.'],
    ['ゆい', '今[いま]は どうですか。', 'Et maintenant ?', 'And now?'],
    ['レオ', 'もう すっかり 慣[な]れました。 日本人[にほんじん]みたいに お辞儀[じぎ]を して あいさつします。', 'Maintenant, j’ai pris l’habitude. Je salue en m’inclinant, comme un Japonais.', 'I’m completely used to it now. I bow when I greet people, like a Japanese person.'],
    ['ゆい', 'ふふ。 これからの 計画[けいかく]は 何[なん]ですか。', 'Hihi. Et quels sont tes projets ?', 'Hehe. So what are your plans?'],
    ['レオ', '日本[にほん]で 働[はたら]きながら、 勉強[べんきょう]を 続[つづ]けたいです。 夢[ゆめ]は 通訳[つうやく]に なる ことです。', 'J’aimerais travailler au Japon tout en continuant à étudier. Mon rêve, c’est de devenir interprète.', 'I want to keep studying while working in Japan. My dream is to become an interpreter.'],
  ], [
    ['Depuis combien de temps Léo est-il au Japon ?', 'How long has Léo been in Japan?', ['Un an', 'A year'], ['Un mois', 'A month'], ['Cinq ans', 'Five years']],
    ['Comment se sentait-il au début ?', 'How did he feel at first?', ['Perdu, rien ne lui était familier', 'Lost, nothing felt familiar'], ['Très à l’aise', 'Very comfortable'], ['En colère', 'Angry']],
    ['Quel est son rêve ?', 'What is his dream?', ['Devenir interprète', 'To become an interpreter'], ['Devenir cuisinier', 'To become a cook'], ['Rentrer en France', 'To go back to France']],
  ]),
  ja('ja-12', 12, '手紙', L('Une lettre à la famille', 'A letter home'), L('Raconter sa vie en quelques lignes', 'Telling your life in a few lines'), [
    ['', '大好[だいす]きな 家族[かぞく]へ', 'À ma famille que j’aime tant,', 'To my dearest family,'],
    ['', 'ぼくは 東京[とうきょう]で 元気[げんき]に 暮[く]らして います。', 'Je vis bien à Tokyo.', 'I’m living happily in Tokyo.'],
    ['', '最近[さいきん]は 仕事[しごと]が 多[おお]いけど、 同僚[どうりょう]が 親切[しんせつ]なので 楽[たの]しいです。', 'En ce moment, il y a beaucoup de travail, mais mes collègues sont gentils, alors c’est agréable.', 'There’s a lot of work lately, but my colleagues are kind, so it’s enjoyable.'],
    ['', '週末[しゅうまつ]は ゆいさんと 山[やま]に 登[のぼ]ったり、 市場[いちば]で おいしい ものを 食[た]べたり します。', 'Le week-end, je fais de la montagne avec Yui ou je mange de bonnes choses au marché.', 'At weekends I climb mountains with Yui or eat good food at the market.'],
    ['', '先月[せんげつ]は 大阪[おおさか]へ 行[い]って、 たこ焼[や]きを 食[た]べました。', 'Le mois dernier, je suis allé à Osaka et j’ai mangé des takoyaki.', 'Last month I went to Osaka and ate takoyaki.'],
    ['', 'みんなに 会[あ]いたいです。 冬[ふゆ]に フランスへ 帰[かえ]ります。', 'Vous me manquez tous. Je rentre en France cet hiver.', 'I miss you all. I’ll come back to France this winter.'],
    ['', 'レオより', 'Léo', 'Léo'],
  ], [
    ['Comment sont ses collègues ?', 'What are his colleagues like?', ['Gentils', 'Kind'], ['Sévères', 'Strict'], ['Souvent absents', 'Often away']],
    ['Qu’a-t-il mangé à Osaka ?', 'What did he eat in Osaka?', ['Des takoyaki', 'Takoyaki'], ['Des sushis', 'Sushi'], ['Des ramen', 'Ramen']],
    ['Quand rentre-t-il en France ?', 'When will he go back to France?', ['Cet hiver', 'This winter'], ['Cet été', 'This summer'], ['Jamais', 'Never']],
  ]),
  ja('ja-13', 13, 'ため口', L('Entre amis', 'Between friends'), L('Le style familier, sans les formes polies', 'The casual style, without polite forms'), [
    ['ゆい', 'レオ、 今週末[こんしゅうまつ] 何[なに] する？', 'Léo, tu fais quoi ce week-end ?', 'Léo, what are you doing this weekend?'],
    ['レオ', 'まだ わからない。 ゆいは？', 'Je ne sais pas encore. Et toi ?', 'Don’t know yet. You?'],
    ['ゆい', 'コンサートに 行[い]きたいんだけど、 チケットが ないんだ。', 'J’aimerais aller à un concert, mais je n’ai pas de billet.', 'I want to go to a concert, but I don’t have a ticket.'],
    ['レオ', 'ほんと？ ぼく、 チケット 二枚[にまい] あるよ！ 会社[かいしゃ]で もらったんだ。', 'Vraiment ? Moi, j’ai deux billets ! On me les a donnés au travail.', 'Really? I’ve got two tickets! I got them at work.'],
    ['ゆい', 'すごい！ じゃあ、 いっしょに 行[い]こう！', 'Génial ! Alors on y va ensemble !', 'Amazing! Let’s go together then!'],
    ['レオ', 'いいよ。 でも、 遅[おく]れないでね。 この 前[まえ]は 三十分[さんじゅっぷん]も 遅[おく]れたじゃない。', 'D’accord. Mais ne sois pas en retard. La dernière fois, tu avais trente minutes de retard.', 'OK. But don’t be late. Last time you were thirty minutes late.'],
    ['ゆい', 'わかった、 わかった。 今度[こんど]は ぜったい 遅[おく]れないから！', 'Oui, oui. Cette fois, je ne serai absolument pas en retard !', 'OK, OK. This time I definitely won’t be late!'],
  ], [
    ['Pourquoi Yui ne peut-elle pas aller au concert ?', 'Why can’t Yui go to the concert?', ['Elle n’a pas de billet', 'She has no ticket'], ['Elle est malade', 'She’s ill'], ['Elle travaille', 'She’s working']],
    ['Où Léo a-t-il eu les billets ?', 'Where did Léo get the tickets?', ['Au travail', 'At work'], ['Sur internet', 'Online'], ['Par sa famille', 'From his family']],
    ['Que reproche Léo à Yui ?', 'What does Léo tease Yui about?', ['D’avoir été en retard', 'Being late'], ['D’avoir oublié son anniversaire', 'Forgetting his birthday'], ['D’avoir perdu les billets', 'Losing the tickets']],
  ]),
  ja('ja-14', 14, '再会', L('Le jour des retrouvailles', 'The day they met again'), L('Un récit au style écrit', 'A story in written style'), [
    ['', 'レオが 日本[にほん]に 来[き]て 三年[さんねん]が たった、 ある 春[はる]の 日[ひ]の ことだった。', 'C’était un jour de printemps, trois ans après l’arrivée de Léo au Japon.', 'It was a spring day, three years after Léo had come to Japan.'],
    ['', '彼[かれ]は、 はじめて ゆいに 会[あ]った 学校[がっこう]の 前[まえ]の カフェに また 座[すわ]って いた。', 'Il était de nouveau assis au café devant l’école, là où il avait rencontré Yui pour la première fois.', 'He was sitting again in the café in front of the school where he had first met Yui.'],
    ['', 'あの ころは 「こんにちは」の 一言[ひとこと]さえ 緊張[きんちょう]して うまく 言[い]えなかったが、 今[いま]は 通訳[つうやく]として 働[はたら]いて いる。', 'À l’époque, il était si nerveux qu’il n’arrivait même pas à dire « bonjour » ; aujourd’hui, il travaille comme interprète.', 'Back then he was too nervous even to say “hello” properly; now he works as an interpreter.'],
    ['', 'ドアが 開[あ]いて、 ゆいが 笑[わら]いながら 入[はい]って きた。', 'La porte s’ouvrit et Yui entra en souriant.', 'The door opened and Yui came in, smiling.'],
    ['ゆい', 'レオ、 わたしたちが はじめて 会[あ]った 日[ひ]の こと、 覚[おぼ]えてる？', 'Léo, tu te souviens du jour où on s’est rencontrés ?', 'Léo, do you remember the day we first met?'],
    ['レオ', 'もちろん。 あの 日[ひ]、 ゆいが 「また あした 学校[がっこう]で」って 言[い]ったのを 今[いま]でも 覚[おぼ]えてるよ。', 'Bien sûr. Je me souviens encore que, ce jour-là, tu m’as dit « À demain, à l’école ».', 'Of course. I still remember you saying “See you tomorrow at school” that day.'],
    ['', '二人[ふたり]は 長[なが]い 間[あいだ] 話[はな]しながら、 言葉[ことば]が 人[ひと]と 人[ひと]を つなぐ ことを あらためて 感[かん]じた。', 'Ils parlèrent longtemps et sentirent une fois de plus que la langue relie les gens.', 'They talked for a long time and felt once again that language brings people together.'],
  ], [
    ['Depuis combien de temps Léo est-il au Japon ?', 'How long has Léo been in Japan?', ['Trois ans', 'Three years'], ['Un an', 'One year'], ['Dix ans', 'Ten years']],
    ['Quel est son métier aujourd’hui ?', 'What is his job now?', ['Interprète', 'Interpreter'], ['Professeur', 'Teacher'], ['Cuisinier', 'Cook']],
    ['De quoi Léo se souvient-il ?', 'What does Léo remember?', ['Des mots de Yui le jour de leur rencontre', 'Yui’s words the day they met'], ['D’un voyage à Osaka', 'A trip to Osaka'], ['De son premier salaire', 'His first salary']],
  ]),
  ja('ja-15', 15, '京都', L('Week-end à Kyoto', 'A weekend in Kyoto'), L('Visiter, faire une pause au café, voir la ville la nuit', 'Sightseeing, a café break, the city by night'), [
    ['', '土曜日[どようび]の 朝[あさ]、 レオと ゆいは 新幹線[しんかんせん]で 京都[きょうと]へ 行[い]った。', 'Samedi matin, Léo et Yui prirent le shinkansen pour Kyoto.', 'On Saturday morning, Léo and Yui took the bullet train to Kyoto.'],
    ['ゆい', '京都[きょうと]は 昔[むかし]の 都[みやこ]です。 見[み]る ところが たくさん ありますよ。', 'Kyoto était l’ancienne capitale. Il y a plein de choses à voir.', 'Kyoto was the old capital. There’s so much to see.'],
    ['レオ', 'まず ホテルに 荷物[にもつ]を 預[あず]けて、 お寺[てら]を 見[み]に 行[い]きませんか。', 'Et si on déposait d’abord nos bagages à l’hôtel pour aller voir le temple ?', 'Shall we leave our bags at the hotel first and go and see the temple?'],
    ['', 'お寺[てら]は 観光客[かんこうきゃく]で いっぱいだったが、 景色[けしき]は 思[おも]ったより ずっと きれいだった。', 'Le temple était plein de touristes, mais le paysage était bien plus beau que prévu.', 'The temple was full of tourists, but the scenery was far more beautiful than expected.'],
    ['ゆい', '足[あし]が 疲[つか]れたでしょう？ あの カフェで 少[すこ]し 休[やす]みましょう。', 'Tu as mal aux jambes ? Faisons une pause dans ce café, là-bas.', 'Your legs are tired, right? Let’s rest in that café over there.'],
    ['レオ', 'いいですね。 ぼくは かき氷[ごおり]に します。 ゆいさんは？', 'D’accord. Moi, je prends une glace pilée. Et toi, Yui ?', 'Good idea. I’ll have shaved ice. What about you, Yui?'],
    ['ゆい', 'わたしは 温[あたた]かい 緑茶[りょくちゃ]。 夜[よる]は 夜景[やけい]を 見[み]に 行[い]きましょう！', 'Moi, un thé vert chaud. Ce soir, on va voir la ville illuminée !', 'A hot green tea for me. Tonight let’s go and see the night view!'],
  ], [
    ['Comment sont-ils allés à Kyoto ?', 'How did they get to Kyoto?', ['En shinkansen', 'By bullet train'], ['En voiture', 'By car'], ['En avion', 'By plane']],
    ['Qu’a commandé Léo au café ?', 'What did Léo order at the café?', ['Une glace pilée', 'Shaved ice'], ['Un thé vert', 'A green tea'], ['Un gâteau', 'A cake']],
    ['Que veulent-ils faire le soir ?', 'What do they want to do in the evening?', ['Voir la ville la nuit', 'See the night view'], ['Aller au karaoké', 'Go to karaoke'], ['Rentrer à Tokyo', 'Go back to Tokyo']],
  ]),
  ja('ja-16', 16, 'ミケ', L('Le chat a disparu', 'The missing cat'), L('Une recherche dans le quartier, un jardin et un soulagement', 'A search of the neighbourhood, a garden and a relief'), [
    ['', '日曜日[にちようび]の 午後[ごご]、 ゆいから 急[いそ]ぎの 電話[でんわ]が あった。', 'Dimanche après-midi, Yui appela en urgence.', 'On Sunday afternoon, Yui made an urgent call.'],
    ['ゆい', 'レオさん、 大変[たいへん]です！ 猫[ねこ]の ミケが いなく なりました。', 'Léo, c’est la catastrophe ! Ma chatte Mike a disparu.', 'Léo, it’s terrible! My cat Mike has gone missing.'],
    ['レオ', '落[お]ち着[つ]いて ください。 すぐ 行[い]きます。 最後[さいご]に 見[み]たのは いつですか。', 'Calme-toi. J’arrive tout de suite. Tu l’as vue pour la dernière fois quand ?', 'Calm down. I’m coming right away. When did you last see her?'],
    ['ゆい', '朝[あさ]、 窓[まど]を 開[あ]けて おいたので、 その とき 出[で]て 行[い]ったみたいです。', 'J’avais laissé la fenêtre ouverte ce matin ; elle a dû sortir à ce moment-là.', 'I left the window open this morning; she seems to have got out then.'],
    ['', '二人[ふたり]は 近所[きんじょ]を 歩[ある]きまわって、 となりの 人[ひと]たちに 聞[き]いた。', 'Ils firent le tour du quartier en interrogeant les voisins.', 'They walked around the neighbourhood asking the neighbours.'],
    ['', 'その とき、 となりの おばあさんの 庭[にわ]から 小[ちい]さな 声[こえ]が 聞[き]こえた。 「ニャー！」', 'C’est alors qu’une petite voix vint du jardin de la vieille dame d’à côté : « Miaou ! »', 'Just then a little voice came from the old lady’s garden next door: “Meow!”'],
    ['ゆい', 'ミケ！ 花[はな]の 間[あいだ]で 寝[ね]て いたの？ 本当[ほんとう]に よかった。', 'Mike ! Tu dormais au milieu des fleurs ? Quel soulagement !', 'Mike! Were you sleeping among the flowers? What a relief!'],
  ], [
    ['Qu’est-il arrivé à Yui ?', 'What happened to Yui?', ['Sa chatte a disparu', 'Her cat went missing'], ['Elle s’est blessée', 'She got hurt'], ['Elle a perdu son portefeuille', 'She lost her wallet']],
    ['Par où la chatte est-elle sortie ?', 'How did the cat get out?', ['Par la fenêtre ouverte', 'Through the open window'], ['Par la porte d’entrée', 'Through the front door'], ['Dans un sac', 'In a bag']],
    ['Où était la chatte ?', 'Where was the cat?', ['Dans le jardin de la voisine', 'In the neighbour’s garden'], ['À la clinique vétérinaire', 'At the vet’s'], ['Sous le lit', 'Under the bed']],
  ]),
  ja('ja-17', 17, '初出勤', L('Premier jour à la télé', 'First day at the TV station'), L('Actualités, trac et messages entre amis', 'News, nerves and texts between friends'), [
    ['', 'レオは テレビ局[きょく]で 通訳[つうやく]として 初出勤[はつしゅっきん]した。', 'Léo commençait son premier jour comme interprète dans une chaîne de télévision.', 'Léo started his first day as an interpreter at a TV station.'],
    ['', 'ニュースの チームは 朝[あさ]から とても 忙[いそが]しかった。 選挙[せんきょ]の 結果[けっか]が もうすぐ 発表[はっぴょう]される 予定[よてい]だった。', 'L’équipe de l’info était débordée depuis le matin : les résultats de l’élection allaient être annoncés.', 'The news team had been very busy since morning: the election results were about to be announced.'],
    ['記者', 'レオさん、 この インタビューを フランス語[ご]に 通訳[つうやく]して もらえますか。', 'Léo, tu peux interpréter cette interview en français ?', 'Léo, could you interpret this interview into French?'],
    ['レオ', 'はい、 やって みます。 どきどきしますね。', 'Oui, je vais essayer. J’ai le cœur qui bat la chamade.', 'Yes, I’ll give it a try. My heart is pounding.'],
    ['', '通訳[つうやく]は 思[おも]ったより うまく いって、 みんなが 拍手[はくしゅ]した。', 'L’interprétation se passa mieux que prévu, et tout le monde applaudit.', 'The interpreting went better than expected, and everyone applauded.'],
    ['', '夜[よる]、 ゆいから メッセージが 来[き]た。 「初日[しょにち]どうだった？w 緊張[きんちょう]した？」', 'Le soir, Yui lui envoya un message : « Alors, ce premier jour ? mdr T’avais le trac ? »', 'In the evening Yui texted: “How was day one? lol Were you nervous?”'],
    ['レオ', 'うん、 マジで 緊張[きんちょう]した。 でも 社長[しゃちょう]に よく やったって 言[い]われたよ！', 'Ouais, super stressé. Mais le patron m’a dit que j’avais bien travaillé !', 'Yeah, seriously nervous. But the boss told me I did well!'],
  ], [
    ['Où Léo travaille-t-il ?', 'Where does Léo work?', ['Dans une chaîne de télévision', 'At a TV station'], ['Dans un hôtel', 'At a hotel'], ['Dans une école', 'At a school']],
    ['Quelle nouvelle l’équipe attendait-elle ?', 'What news was the team waiting for?', ['Les résultats d’une élection', 'Election results'], ['La météo', 'The weather forecast'], ['Un match de football', 'A football match']],
    ['Comment s’est passée l’interprétation ?', 'How did the interpreting go?', ['Mieux que prévu', 'Better than expected'], ['Très mal', 'Very badly'], ['Elle a été annulée', 'It was cancelled']],
  ]),
];

export const STORIES = { ko: KO, ja: JA };

/** Sens des mots à double sens dans une histoire donnée (passe avant le dictionnaire du cours). */
export const PEEK = {
  'ko-3': { '개에': L('pièce (compteur)', 'item (counter)'), '개': L('pièce (compteur)', 'item (counter)') },
  'ko-6': { '이': L('ce, cette', 'this') },
  'ko-7': { '해': L('faire (해 주십시오 : veuillez faire)', 'to do (해 주십시오: please do)'), '일하고': L('travailler', 'to work'), '일을': L('travail', 'work') },
  'ko-8': { '새': L('nouveau, nouvelle', 'new'), '달에': L('mois', 'month') },
  'ko-11': { '게': L('chose (모든 게 : tout)', 'thing (모든 게: everything)'), '앞으로': L('à l’avenir', 'from now on') },
  'ko-12': { '일이': L('travail', 'work') },
  'ko-13': { '해?': L('faire (뭐 해 ? : tu fais quoi ?)', 'to do (뭐 해?: what are you doing?)') },
  'ko-14': { '네가': L('tu (sujet)', 'you (subject)'), '말이': L('parole, mots', 'words') },
  'ja-6': { 'よく': L('bien', 'well'), '月の': L('mois', 'month') },
  'ja-8': { '月に': L('par mois', 'a month') },
  'ja-9': { '前に': L('avant', 'before') },
  'ja-12': { '元気に': L('en forme, en bonne santé', 'well, in good health') },
  'ja-13': { 'ほんと？': L('vraiment ?', 'really?'), '前は': L('la dernière fois (この前)', 'last time (この前)') },
};

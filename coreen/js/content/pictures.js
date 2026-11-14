// Dessins des mots concrets (emoji), repérés par la traduction anglaise du mot (champ `en`, commun aux deux cours).
// Ils servent à la première rencontre d'un mot : « Lequel est … ? » avec un dessin sur chaque réponse.
// Les mots abstraits (raison, politique…) n'ont pas de dessin : ils ne sont pas proposés dans ces questions.

const P = {
  // Nourriture et boissons
  'rice, meal': '🍚', bread: '🍞', kimchi: '🥬', apple: '🍎', 'ramen (noodles)': '🍜', bibimbap: '🥗', bulgogi: '🥩',
  tteokbokki: '🌶️', sushi: '🍣', 'rice ball': '🍙', udon: '🍜', meat: '🍖', fish: '🐟', cake: '🍰', water: '💧',
  coffee: '☕', tea: '🍵', 'green tea': '🍵', milk: '🥛', juice: '🧃', beer: '🍺', pizza: '🍕', salad: '🥗', chocolate: '🍫',
  'fried chicken': '🍗', sandwich: '🥪', 'ice cream': '🍦', cola: '🥤', wine: '🍷', tempura: '🍤', 'miso soup': '🥣',
  egg: '🥚', fruit: '🍇', salt: '🧂', sugar: '🍬', oil: '🫒', vegetables: '🥕', onion: '🧅', garlic: '🧄', potato: '🥔',
  tofu: '🧈', soup: '🍲', chopsticks: '🥢', spoon: '🥄', plate: '🍽️', 'cup, glass': '🥛', knife: '🔪', 'cooking, dish': '🍳',
  // Loisirs, médias
  movie: '🎬', 'TV series': '📺', book: '📕', webtoon: '📱', 'manga, comic': '📚', newspaper: '📰', music: '🎵', song: '🎤',
  radio: '📻', anime: '🎞️', magazine: '📖', podcast: '🎧', postcard: '💌', camera: '📷', notebook: '📓', toy: '🧸',
  diary: '📔', letter: '✉️', email: '📧', gift: '🎁', 'picture, painting': '🖼️', 'musical instrument': '🎻', novel: '📖',
  'video game': '🎮', video: '📹', 'theatre, play': '🎭', dance: '💃', ball: '⚽', 'football, soccer': '⚽', baseball: '⚾',
  basketball: '🏀', swimming: '🏊', tennis: '🎾', running: '🏃', hiking: '🥾', 'exercise, sport': '🏋️', taekwondo: '🥋', judo: '🥋',
  // Personnes
  friend: '🧑‍🤝‍🧑', teacher: '🧑‍🏫', family: '👨‍👩‍👧', student: '🧑‍🎓', mom: '👩', dad: '👨', mother: '👩', father: '👨',
  'mother, mom': '👩', 'father, dad': '👨', parents: '👫', son: '👦', daughter: '👧', grandfather: '👴', grandmother: '👵',
  child: '🧒', baby: '👶', man: '👨', woman: '👩', 'person, people': '🧑', person: '🧑', doctor: '🧑‍⚕️', nurse: '🧑‍⚕️',
  police: '👮', 'cook, chef': '🧑‍🍳', singer: '🧑‍🎤', actor: '🎭', 'office worker': '🧑‍💼', 'player, athlete': '🏅',
  // Lieux et ville
  school: '🏫', 'home, house': '🏠', café: '☕', restaurant: '🍽️', 'company, office': '🏢', library: '📚', market: '🛒',
  park: '🌳', cinema: '🎦', hospital: '🏥', 'convenience store': '🏪', gym: '🏋️', sea: '🌊', university: '🎓',
  bookshop: '📚', supermarket: '🛒', bank: '🏦', pub: '🍻', airport: '🛫', hotel: '🏨', 'road, way': '🛣️', shop: '🏬',
  'department store': '🏬', station: '🚉', 'bus stop': '🚏', 'traffic light': '🚦', 'car park': '🅿️', map: '🗺️',
  palace: '🏯', castle: '🏯', 'Buddhist temple': '🛕', museum: '🏛️', 'hot spring': '♨️', bridge: '🌉', Korea: '🇰🇷',
  Japan: '🇯🇵', France: '🇫🇷',
  // Transports, voyage
  bus: '🚌', subway: '🚇', taxi: '🚕', train: '🚆', car: '🚗', bicycle: '🚲', plane: '✈️', 'boat, ship': '🚢', ticket: '🎫',
  passport: '🛂', luggage: '🧳', 'trip, travel': '🧳', souvenir: '🎁', exit: '🚪',
  // Objets, maison
  bag: '👜', clothes: '👕', shoes: '👟', umbrella: '☂️', 'mobile phone': '📱', smartphone: '📱', 'T-shirt': '👕',
  trousers: '👖', skirt: '👗', shirt: '👔', coat: '🧥', socks: '🧦', 'hat, cap': '🧢', kimono: '👘', 'hanbok (traditional dress)': '👘',
  room: '🛏️', kitchen: '🍳', toilet: '🚽', bathroom: '🛁', door: '🚪', window: '🪟', bed: '🛏️', desk: '🪑', chair: '🪑',
  fridge: '🧊', television: '📺', computer: '💻', telephone: '☎️', key: '🔑', 'watch, clock': '⌚', wallet: '👛', money: '💰',
  cash: '💵', card: '💳', receipt: '🧾', paper: '📄', pen: '🖊️', photo: '📸', glasses: '👓', towel: '🧺', soap: '🧼',
  rubbish: '🗑️', box: '📦', battery: '🔋', screen: '🖥️', machine: '⚙️', internet: '🌐', message: '💬', password: '🔒',
  homework: '📝', exam: '📝', medicine: '💊', 'a cold': '🤧', fever: '🤒',
  // Corps
  body: '🧍', head: '🗣️', face: '🙂', eye: '👁️', nose: '👃', mouth: '👄', ear: '👂', tooth: '🦷', arm: '💪', hand: '✋',
  finger: '☝️', leg: '🦵', foot: '🦶', hair: '💇', 'heart, mind': '❤️', sweat: '💦',
  // Nature, météo, temps
  weather: '🌤️', sky: '🌌', sun: '☀️', moon: '🌙', star: '⭐', rain: '🌧️', snow: '❄️', 'to snow': '🌨️', 'to rain': '🌧️',
  wind: '💨', cloud: '☁️', mountain: '⛰️', river: '🏞️', lake: '🏞️', island: '🏝️', forest: '🌲', tree: '🌳', flower: '🌸',
  grass: '🌿', stone: '🪨', fire: '🔥', spring: '🌱', summer: '🏖️', autumn: '🍂', winter: '⛄', 'clear, sunny': '☀️',
  cloudy: '☁️', night: '🌃', morning: '🌅', birthday: '🎂', 'New Year': '🎍', festival: '🎆', love: '💕',
  // Animaux
  animal: '🐾', dog: '🐶', cat: '🐱', bird: '🐦', cow: '🐮', pig: '🐷', chicken: '🐔', horse: '🐴', sheep: '🐑', rabbit: '🐰',
  bear: '🐻', tiger: '🐯', monkey: '🐵', mouse: '🐭', snake: '🐍', insect: '🐛', butterfly: '🦋', elephant: '🐘', lion: '🦁',
  fox: '🦊', turtle: '🐢', frog: '🐸', deer: '🦌',
  // Couleurs et formes
  red: '🔴', blue: '🔵', yellow: '🟡', green: '🟢', white: '⚪', black: '⚫', pink: '🩷', orange: '🟠', purple: '🟣',
  brown: '🟤', grey: '🩶', gold: '🥇', silver: '🥈', circle: '⭕', square: '🟥', triangle: '🔺',
  // Actions et états faciles à dessiner
  'to eat': '🍽️', 'to drink': '🥤', 'to sleep': '😴', 'to read': '📖', 'to write': '✍️', 'to listen to': '👂', 'to watch': '👀',
  'to sing': '🎤', 'to swim': '🏊', 'to dance': '💃', 'to drive': '🚗', 'to cook': '🍳', 'to walk': '🚶', 'to run': '🏃',
  'to study': '📚', 'to buy': '🛍️', 'to travel': '🧳', 'to clean': '🧹', 'to laugh': '😂', 'to cry': '😢', 'to sit': '🪑',
  'to wash': '🧼', 'to draw': '🎨', 'to call': '📞', 'to be sad': '😢', 'to be happy': '😊', 'to be tired': '😩',
  'to be hungry': '🍽️', 'to be thirsty': '🥤', 'to get angry': '😠', 'scared, scary': '😱', 'to be surprised': '😮',
  sleepy: '😪', 'to be spicy': '🌶️', 'to be tasty': '😋', 'to be hot (weather)': '🥵', 'to be cold (weather)': '🥶',
  hello: '👋', 'thank you': '🙏', 'I love you': '🥰',  // Fruits et légumes
  banana: '🍌', strawberry: '🍓', grapes: '🍇', watermelon: '🍉', peach: '🍑', mandarin: '🍊', lemon: '🍋', cherry: '🍒',
  pineapple: '🍍', mango: '🥭', melon: '🍈', kiwi: '🥝', tomato: '🍅', carrot: '🥕', cucumber: '🥒', mushroom: '🍄',
  corn: '🌽', 'chilli pepper': '🌶️', 'napa cabbage': '🥬', broccoli: '🥦', 'sweet potato': '🍠', bean: '🫘', avocado: '🥑',
  // École
  classroom: '🏫', blackboard: '👩‍🏫', pencil: '✏️', ruler: '📏', scissors: '✂️', textbook: '📘', dictionary: '📙',
  'class, lesson': '🧑‍🏫', question: '❓', answer: '💡', calculator: '🧮', 'pencil case': '🖍️', grades: '💯', graduation: '🎓',
  'school entrance': '🎒', playground: '🛝', classmate: '👫', timetable: '🗓️', presentation: '📊',
  // Mer
  beach: '🏖️', sand: '⏳', wave: '🌊', swimsuit: '🩱', sunglasses: '🕶️', shell: '🐚', crab: '🦀', octopus: '🐙', squid: '🦑',
  shrimp: '🦐', whale: '🐋', shark: '🦈', dolphin: '🐬', penguin: '🐧', 'sailing boat': '⛵', lighthouse: '🗼', harbour: '⚓',
  sunscreen: '🧴', 'swim ring': '🛟', sandcastle: '🏰', seaside: '🏝️',
  // Musique
  piano: '🎹', guitar: '🎸', violin: '🎻', drums: '🥁', trumpet: '🎺', saxophone: '🎷', concert: '🎶', karaoke: '🎤', melody: '🎼',
  album: '💿', fan: '🙌', stage: '🎪', performance: '🎭', 'sheet music': '🎼', earphones: '🎧', microphone: '🎙️', 'idol (pop star)': '🌟',
  'to play (an instrument)': '🎹', lyrics: '📝', rhythm: '🥁', composer: '🎼',
  // Lieux de la ville
  'post office': '🏤', 'police station': '🚓', 'fire station': '🚒', pharmacy: '💊', 'hair salon': '💇', bakery: '🥐', florist: '💐',
  'city hall': '🏛️', church: '⛪', zoo: '🦒', 'amusement park': '🎢', 'swimming pool': '🏊', 'petrol station': '⛽',
  'apartment block': '🏢', building: '🏬', 'square, plaza': '⛲', alley: '🏘️', factory: '🏭', embassy: '🏳️', stadium: '🏟️',
  // Passe-temps
  hobby: '🎨', yoga: '🧘', camping: '⛺', knitting: '🧶', reading: '📚', chess: '♟️', puzzle: '🧩', 'go (board game)': '⚫',
  garden: '🏡', gardening: '🌻', skiing: '⛷️', skating: '⛸️', bowling: '🎳', fishing: '🎣', 'walk, stroll': '🚶',
  collecting: '🗃️', 'board game': '🎲', 'magic tricks': '🎩', 'cooking class': '👩‍🍳', 'taking photos': '📸',
  // Médecin
  cough: '😷', headache: '🤕', 'runny nose': '🤧', wound: '🩹', bandage: '🩹', injection: '💉', allergy: '🌾', dentist: '🦷',
  ambulance: '🚑', patient: '🛌', thermometer: '🌡️', prescription: '📋', 'hospital stay': '🏥', surgery: '🩺',
  'stomach ache': '🤢', blood: '🩸', bone: '🦴', 'to get hurt': '🤕', 'to get better': '💪', insurance: '📄', 'medical examination': '🩺',
  // Soins et ménage
  toothbrush: '🪥', toothpaste: '🦷', shampoo: '🧴', shower: '🚿', bath: '🛁', mirror: '🪞', comb: '💇', tissue: '🧻',
  cosmetics: '💄', razor: '🪒', 'hair dryer': '💨', nail: '💅', perfume: '🌸', laundry: '🧺', 'washing machine': '🫧',
  'vacuum cleaner': '🧹', bin: '🗑️', 'washing-up': '🍽️', broom: '🧹', iron: '👔', duvet: '🛏️',
  // Lexique avancé
  typhoon: '🌀', 'rainy season': '☔', humidity: '💧', temperature: '🌡️', 'weather forecast': '📺', lightning: '⚡', thunder: '🌩️',
  fog: '🌫️', rainbow: '🌈', 'shower (rain)': '🌦️', ice: '🧊', frost: '❄️', 'heavy snow': '🌨️', heat: '🥵', 'cold (the cold)': '🥶',
  height: '📏', 'to wear glasses': '👓', 'curly hair': '👩‍🦱', 'long hair': '💇‍♀️', beard: '🧔', smile: '😊', 'to grow old': '👴',
  rent: '🏠', landlord: '🔑', 'moving house': '🚚', 'lift, elevator': '🛗', stairs: '🪜', balcony: '🌇', 'living room': '🛋️',
  bedroom: '🛏️', 'front door, entrance': '🚪', roof: '🏠', wall: '🧱', furniture: '🪑', sofa: '🛋️', curtain: '🪟', lamp: '💡',
  contract: '📝', printer: '🖨️', documents: '📄', deadline: '⏰', boss: '👔', overtime: '🌙', 'business trip': '💼', 'business card': '📇',
  'meeting room': '🪑', 'job interview': '🤝', 'CV, résumé': '📄', promotion: '📈', 'to photocopy': '📠',
  delivery: '🚚', 'order (purchase)': '🛒', refund: '💸', 'parcel delivery': '📦', parcel: '📦', review: '⭐', 'shopping cart': '🛒',
  payment: '💳', 'free (of charge)': '🆓', coupon: '🎟️', 'sold out': '🚫', address: '🏠', 'phone number': '📞', 'log-in': '🔐',
  'bank account': '🏦', transfer: '💸', 'cash machine': '🏧', coin: '🪙', banknote: '💴', loan: '💰', savings: '🐷', payday: '💰',
  tax: '🧾', 'PIN code': '🔢', 'rich person': '🤑',
  platform: '🚉', seat: '💺', 'window seat': '🪟', delay: '⏱️', boarding: '🛫', customs: '🛃', 'plane ticket': '🎫',
  'high-speed train': '🚄', 'ticket office': '🎫', 'take-off': '🛫', landing: '🛬', 'in-flight meal': '🍱', 'seat belt': '💺', 'passport control': '🛂',
  environment: '🌍', pollution: '🏭', recycling: '♻️', energy: '⚡', climate: '🌡️', earthquake: '🫨', flood: '🌊', drought: '🏜️',
  'sorting rubbish': '♻️', plastic: '🥤', 'the Earth': '🌏', 'solar power': '🔆', volcano: '🌋', desert: '🏜️', air: '💨', jungle: '🌴',
  'to throw away': '🗑️',
  post: '📝', follower: '👥', like: '👍', comment: '💬', subscription: '🔔', YouTuber: '📹', hashtag: '#️⃣', selfie: '🤳',
  'live broadcast': '🔴', article: '📰', chat: '💬', emoji: '😀', 'to upload': '⬆️', 'to download': '⬇️', 'to share': '🔗', notification: '🔔',
  date: '💑', 'confession of love': '💌', breakup: '💔', wedding: '💒', divorce: '💔', friendship: '🤝', 'first love': '💘', ring: '💍',
  'marriage proposal': '💍', lover: '💑', 'to argue': '😤', 'to make up': '🤝', jealousy: '😒', honeymoon: '🏝️',
  pot: '🍲', 'frying pan': '🍳', oven: '🔥', 'chopping board': '🔪', recipe: '📖', ingredients: '🧺', 'to stir-fry': '🥘', 'to deep-fry': '🍤',
  'to mix': '🥣', 'to peel': '🍌', 'to pour': '🫗', microwave: '♨️', flour: '🌾', butter: '🧈', 'pepper (spice)': '🧂', honey: '🍯', cheese: '🧀',
  'to nod': '🙂', 'to wave': '👋', 'to hug': '🤗', 'to kick': '🦵', 'to jump': '🤸', 'to lie down': '🛌', 'to throw': '🤾', 'to push': '👐',
  'to fall over': '🤕', 'to hide': '🙈', 'to clap': '👏', 'to point': '👉', 'to kneel': '🧎', 'to yawn': '🥱', 'to wink': '😉',
  century: '🏛️', 'the past': '⏪', 'the future': '🚀', moment: '⏱️', schedule: '📅', dawn: '🌄', midnight: '🕛', calendar: '📆',
  freedom: '🕊️', peace: '☮️', happiness: '😊', success: '🏆', failure: '❌', lie: '🤥', thought: '💭', goal: '🎯', hope: '🌟', courage: '🦁',
  experiment: '🧪', research: '🔬', robot: '🤖', space: '🌌', planet: '🪐', rocket: '🚀', telescope: '🔭', microscope: '🔬', scientist: '🧑‍🔬',
  invention: '💡', discovery: '🔍', magnet: '🧲', electricity: '⚡', 'artificial intelligence': '🤖', data: '📊', molecule: '⚛️', gene: '🧬',
  dinosaur: '🦖', fossil: '🦴',
  party: '🥳', invitation: '💌', anniversary: '🎉', fireworks: '🎆', parade: '🎺', Christmas: '🎄', 'harvest festival': '🌕', 'New Year’s holiday': '🎍',
  'graduation ceremony': '🎓', funeral: '⚱️', celebration: '🎊', 'to give a present': '🎁', 'to cut the cake': '🎂', candle: '🕯️', balloon: '🎈',
  'cheers! (toast)': '🥂', competition: '🏆',
  'application form': '📝', signature: '✍️', 'ID card': '🪪', visa: '🛂', 'residence card': '🪪', 'reception desk': '🛎️', 'queue ticket': '🎫',
  'name stamp': '🔖', 'due date': '📅', rule: '📏', certificate: '📜', 'lost property': '🧳', 'counter, window': '🪟',
};

/** Dessin d'un mot, ou null s'il n'en a pas. */
export const pictureOf = (w) => P[w.en] || null;

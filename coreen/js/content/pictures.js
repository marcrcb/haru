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
  hello: '👋', 'thank you': '🙏', 'I love you': '🥰',
};

/** Dessin d'un mot, ou null s'il n'en a pas. */
export const pictureOf = (w) => P[w.en] || null;

const { latestUserText } = require('./messageClassifier');
const { usesCyrillic } = require('../../utils/language');

const CASUAL_CLASSES = new Set(['casual_chat', 'casual_short', 'meme', 'slang', 'emotional_reaction']);

const RU_REACTIONS = new Map([
  ['привет', 'привет, я тут 🙂'],
  ['здравствуй', 'привет, я тут 🙂'],
  ['здравствуйте', 'здравствуйте, я тут 🙂'],
  ['хай', 'хай, что делаем? 😄'],
  ['ку', 'ку, я тут 🙂'],
  ['доброе утро', 'доброе утро'],
  ['добрый день', 'добрый день'],
  ['добрый вечер', 'добрый вечер'],
  ['привіт', 'привіт, я тут'],
  ['вітаю', 'вітаю, я тут'],
  ['сәлем', 'сәлем, мен осындамын'],
  ['спасибо', 'да без проблем'],
  ['спс', 'да без проблем'],
  ['жесть', 'да, жесть конечно 😬'],
  ['капец', 'капец как есть 😅'],
  ['пон', 'понял'],
  ['понял', 'понял'],
  ['ну просто', 'ну просто так просто 😄'],
  ['просто', 'бывает, просто и всё 😄'],
  ['лол', 'ахах да 😄'],
  ['хах', 'ахах 😄'],
  ['ахах', 'ахах, понимаю 😄'],
  ['имба', 'имба, согласен 🔥'],
  ['кринж', 'да, кринжово 😬'],
  ['банан', 'ахах банан так банан 🍌'],
  ['апельсин', 'ахах почему именно апельсин 🍊'],
  ['мандарин', 'мандарин тоже вариант 🍊'],
  ['яблоко', 'яблоко звучит спокойнее 🍏']
]);

const EN_REACTIONS = new Map([
  ['hello', "hey, I'm here 🙂"],
  ['hi', "hey, I'm here 🙂"],
  ['hey', 'hey, what are we doing? 😄'],
  ['yo', "yo, I'm here 😄"],
  ['thanks', 'no problem'],
  ['thank you', 'no problem'],
  ['hola', 'hola, estoy aqui'],
  ['bonjour', 'salut, je suis la'],
  ['hallo', 'hallo, ich bin da'],
  ['ciao', 'ciao, ci sono'],
  ['merhaba', 'merhaba, buradayim'],
  ['ola', 'ola, estou aqui'],
  ['lol', 'lol yeah 😄'],
  ['haha', 'haha yeah 😄'],
  ['ok', 'got it'],
  ['bruh', 'yeah, bruh moment'],
  ['banana', 'banana it is 🍌'],
  ['orange', 'why orange specifically lol 🍊'],
  ['apple', 'apple is a calmer choice 🍏']
]);

function quickCasualResponse(payload) {
  if (payload.task !== 'chat' || !CASUAL_CLASSES.has(payload.messageClass)) return null;
  const latest = latestUserText(payload.text);
  const normalized = latest.toLowerCase().replace(/[!?.,…]+/g, '').trim();
  if (!normalized || normalized.length > 36) return null;
  if (/[?？]/.test(latest) || isQuestionLike(normalized)) return null;
  if (/^\d+(?:[.,]\d+)?$/.test(normalized)) {
    return payload.language === 'ru'
      ? `${normalized}. Что с ним сделать?`
      : `${normalized}. What should I do with it?`;
  }

  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length > 3) return null;

  if (usesCyrillic(normalized)) {
    if (RU_REACTIONS.has(normalized)) return RU_REACTIONS.get(normalized);
    if (/^ты теперь/i.test(normalized)) return 'принял, буду увереннее';
    if (words.length === 1 && looksLikeNormalWord(normalized)) return `ахах почему именно ${normalized} 😄`;
    return null;
  }

  if (EN_REACTIONS.has(normalized)) return EN_REACTIONS.get(normalized);
  if (words.length === 1 && /^[a-z]+$/i.test(normalized)) return `why ${normalized} specifically lol 😄`;
  return null;
}

function looksLikeNormalWord(value) {
  return /^[а-яёіїєґқұүғһөә]+$/i.test(value) && value.length >= 3;
}

function isQuestionLike(value) {
  const starters = [
    'что', 'кто', 'где', 'куда', 'откуда', 'когда', 'зачем', 'почему', 'как',
    'какой', 'какая', 'какое', 'какие', 'чем'
  ];
  return starters.some(starter => value === starter || value.startsWith(`${starter} `))
    || /^(?:what|who|where|when|why|how)\b/i.test(value);
}

module.exports = {
  quickCasualResponse
};

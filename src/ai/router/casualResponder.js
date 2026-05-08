const { latestUserText } = require('./messageClassifier');
const { usesCyrillic } = require('../../utils/language');

const RU_REACTIONS = new Map([
  ['жесть', 'Да, жёстко. Такое правда выбивает из колеи.'],
  ['капец', 'Капец как есть. Тут без лишних церемоний.'],
  ['пон', 'Понял. Двигаемся дальше.'],
  ['лол', 'Вот это поворот.'],
  ['хах', 'Да, забавно вышло.'],
  ['ахах', 'Да, смешно получилось.'],
  ['имба', 'Имба, согласен. Выглядит мощно.'],
  ['кринж', 'Да, кринж чувствуется.'],
  ['банан', 'Банан принят. Жёлтый аргумент в чате.']
]);

const EN_REACTIONS = new Map([
  ['lol', 'Yeah, that landed funny.'],
  ['haha', 'That one is pretty funny.'],
  ['ok', 'Got it.'],
  ['bruh', 'Yeah, that has bruh energy.'],
  ['banana', 'Banana accepted. A surprisingly strong chat move.']
]);

function quickCasualResponse(payload) {
  if (payload.task !== 'chat' || payload.messageClass !== 'casual_chat') return null;
  const latest = latestUserText(payload.text);
  const normalized = latest.toLowerCase().replace(/[!?.,…]+/g, '').trim();
  if (!normalized || normalized.length > 36) return null;
  if (/[?]/.test(latest)) return null;

  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length > 3) return null;

  if (usesCyrillic(normalized)) {
    if (RU_REACTIONS.has(normalized)) return RU_REACTIONS.get(normalized);
    if (/^ты теперь/i.test(normalized)) return 'Принял. Буду держаться увереннее.';
    if (words.length === 1) return `${capitalize(normalized)}. Неожиданно, но принимается.`;
    return 'Принял. Звучит как настрой на продолжение.';
  }

  if (EN_REACTIONS.has(normalized)) return EN_REACTIONS.get(normalized);
  if (words.length === 1) return `${capitalize(normalized)}. Unexpected, but accepted.`;
  return 'Got it. Keeping the flow going.';
}

function capitalize(value) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

module.exports = {
  quickCasualResponse
};

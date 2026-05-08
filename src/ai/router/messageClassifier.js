const { extractMathExpression } = require('../../utils/math');

const CASUAL_TOKENS = new Set([
  'привет', 'здравствуй', 'здравствуйте', 'хай', 'ку', 'салам',
  'жесть', 'капец', 'пон', 'понял', 'ну', 'да', 'неа', 'ага', 'лол', 'хах', 'ахах',
  'имба', 'кринж', 'ок', 'окей', 'ясно', 'ладно', 'блин', 'мда', 'жиза', 'база',
  'спасибо', 'спс', 'норм', 'круто', 'ого', 'вау',
  'lol', 'haha', 'ok', 'yeah', 'yep', 'nope', 'bruh', 'lmao', 'xd', 'wow', 'nice'
]);

function classifyMessage(payload) {
  if (payload.task === 'translate' || payload.task?.startsWith('translate_')) return 'translation';
  if (payload.deepResearch || payload.deepThinking) return 'deep_reasoning';

  const latest = latestUserText(payload.text);
  const normalized = latest.toLowerCase().trim();
  if (!normalized) return 'casual_short';
  if (isMath(normalized)) return 'math';
  if (isCoding(normalized)) return 'coding';
  if (isShortQuestion(normalized)) return 'serious_question';
  if (isSeriousQuestion(normalized)) return 'serious_question';
  if (isMeme(normalized)) return 'meme';
  if (isSlang(normalized)) return 'slang';
  if (isEmotionalReaction(normalized)) return 'emotional_reaction';
  if (isCasual(normalized)) return 'casual_short';
  return normalized.length <= 80 ? 'casual_short' : 'serious_question';
}

function latestUserText(text) {
  const lines = String(text || '')
    .split('\n')
    .filter(line => line.startsWith('User:') || line.startsWith('User question about selected text:'))
    .map(line => line
      .replace(/^User:\s*/, '')
      .replace(/^User question about selected text:\s*/, '')
      .trim());
  return lines.length ? lines[lines.length - 1] : String(text || '').trim();
}

function isMath(text) {
  return Boolean(extractMathExpression(text))
    || /(?:корень|процент|сколько будет|посчитай|вычисли|sqrt|sin|cos|tan|\d+\s*[+\-*/^%]\s*\d+)/i.test(text);
}

function isCoding(text) {
  return /(?:код|ошибка|bug|function|class|const|let|npm|electron|api|css|html|js|node|рефактор|компонент)/i.test(text);
}

function isShortQuestion(text) {
  const starters = [
    'что', 'кто', 'где', 'куда', 'откуда', 'когда', 'зачем', 'почему', 'как',
    'какой', 'какая', 'какое', 'какие', 'чем', 'чья', 'чей'
  ];
  return /[?？]$/.test(text)
    || starters.some(starter => text === starter || text.startsWith(`${starter} `))
    || /^(?:what|who|where|when|why|how)\b/i.test(text);
}

function isSeriousQuestion(text) {
  return /(?:как|почему|зачем|что такое|объясни|сравни|напиши|сделай|помоги|how|why|what|explain|compare|write|implement)/i.test(text)
    && text.length > 10;
}

function isCasual(text) {
  const compact = text.replace(/[!?.,…\s]+/g, ' ').trim();
  if (CASUAL_TOKENS.has(compact)) return true;
  if (compact.split(/\s+/).length <= 3) return true;
  return /(?:ха+|ахах|лол|имба|жесть|капец|пон|кринж|bruh|haha|lol)/i.test(compact);
}

function isMeme(text) {
  return /(?:лол|ахах|хах|мем|рофл|bruh|lol|lmao|haha|xd)/i.test(text);
}

function isSlang(text) {
  return /(?:имба|кринж|пон|окей|жиза|вайб|чилл|база|bruh|based|cringe|vibe)/i.test(text);
}

function isEmotionalReaction(text) {
  return /(?:жесть|капец|блин|мда|ого|вау|ужас|круто|nice|wow|damn|ouch)/i.test(text);
}

module.exports = {
  classifyMessage,
  latestUserText
};

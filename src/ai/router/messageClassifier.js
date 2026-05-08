const { extractMathExpression } = require('../../utils/math');

const CASUAL_TOKENS = new Set([
  'жесть', 'капец', 'пон', 'понял', 'ну', 'да', 'неа', 'ага', 'лол', 'хах', 'ахах',
  'имба', 'кринж', 'ок', 'окей', 'ясно', 'ладно', 'блин', 'мда',
  'lol', 'haha', 'ok', 'yeah', 'yep', 'nope', 'bruh'
]);

function classifyMessage(payload) {
  if (payload.task === 'translate' || payload.task?.startsWith('translate_')) return 'translation';
  if (payload.deepResearch || payload.deepThinking) return 'deep_reasoning';

  const latest = latestUserText(payload.text);
  const normalized = latest.toLowerCase().trim();
  if (!normalized) return 'casual_chat';
  if (isMath(normalized)) return 'math';
  if (isCoding(normalized)) return 'coding';
  if (isSeriousQuestion(normalized)) return 'serious_question';
  if (isCasual(normalized)) return 'casual_chat';
  return normalized.length <= 80 ? 'casual_chat' : 'serious_question';
}

function latestUserText(text) {
  const lines = String(text || '')
    .split('\n')
    .filter(line => line.startsWith('User:'))
    .map(line => line.replace(/^User:\s*/, '').trim());
  return lines.length ? lines[lines.length - 1] : String(text || '').trim();
}

function isMath(text) {
  return Boolean(extractMathExpression(text))
    || /(?:корень|процент|сколько будет|посчитай|вычисли|sqrt|sin|cos|tan|\d+\s*[+\-*/^%]\s*\d+)/i.test(text);
}

function isCoding(text) {
  return /(?:код|ошибка|bug|function|class|const|let|npm|electron|api|css|html|js|node|рефактор|компонент)/i.test(text);
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

module.exports = {
  classifyMessage,
  latestUserText
};

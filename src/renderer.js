const THEMES = [
  ['rgb', 'RGB', ['#61dafb', '#ff65b7', '#ffe15a', '#9dff47'], false],
  ['white-green', 'WHITE / GREEN', ['#9dff47', '#ffffff'], false],
  ['green-cyan', 'GREEN / CYAN', ['#9dff47', '#36d5ff'], false],
  ['green-yellow', 'GREEN / YELLOW', ['#9dff47', '#ffe15a'], false],
  ['green-pink', 'GREEN / PINK', ['#9dff47', '#ff65b7'], false],
  ['green-violet', 'GREEN / VIOLET', ['#9dff47', '#9c6bff'], false],
  ['green-orange', 'GREEN / ORANGE', ['#9dff47', '#ff9f43'], false],
  ['green-red', 'GREEN / RED', ['#9dff47', '#ff4b4b'], false],
  ['green-blue', 'GREEN / BLUE', ['#9dff47', '#4b7bff'], false],
  ['green-mint', 'GREEN / MINT', ['#9dff47', '#67ffd2'], false],
  ['green-silver', 'GREEN / SILVER', ['#9dff47', '#b8c0cc'], false],
  ['ua', 'Ukraine', ['#0057b7', '#ffd700'], true],
  ['ru', 'Russia', ['#ffffff', '#0039a6', '#d52b1e'], true],
  ['by', 'Belarus', ['#c8313e', '#c8313e', '#4aa657'], true],
  ['us', 'America', ['#b22234', '#ffffff', '#3c3b6e'], true],
  ['tr', 'Turkey', ['#e30a17', '#ffffff'], true]
];

const DEFAULTS = {
  chatInput: '',
  selectedQuote: '',
  chatAnswer: '',
  chatMessages: [],
  deepThinking: false,
  deepResearch: false,
  activeSavedId: null,
  translateInput: '',
  translateOutput: '',
  fromLang: 'auto',
  toLang: 'ru',
  totalCopies: 0,
  theme: 'white-green',
  language: 'en',
  savedChats: [],
  watermark: true,
  watermarkText: 'helpsense | {time}',
  watermarkPosition: 'top-right',
  watermarkStyle: 'solid'
};

const state = loadState();
state.isThinking = false;

const status = document.getElementById('status');
const themeGrid = document.getElementById('themeGrid');
const chatInput = document.getElementById('chatInput');
const chatLog = document.getElementById('chatLog');
const chatPlus = document.getElementById('chatPlus');
const plusMenu = document.getElementById('plusMenu');
const deepThink = document.getElementById('deepThink');
const deepResearch = document.getElementById('deepResearch');
const selectionPopover = document.getElementById('selectionPopover');
const selectedQuote = document.getElementById('selectedQuote');
const selectedQuoteText = document.getElementById('selectedQuoteText');
const clearSelectedQuote = document.getElementById('clearSelectedQuote');
const toast = document.getElementById('toast');
const translateInput = document.getElementById('translateInput');
const translateOutput = document.getElementById('translateOutput');
const translateLoading = document.getElementById('translateLoading');
const fromLang = document.getElementById('fromLang');
const toLang = document.getElementById('toLang');
const savedList = document.getElementById('savedList');
const watermark = document.getElementById('watermark');
const watermarkToggle = document.getElementById('watermarkToggle');
const watermarkText = document.getElementById('watermarkText');
const watermarkStyle = document.getElementById('watermarkStyle');
const watermarkPositionSelect = document.getElementById('watermarkPositionSelect');
const languageSelect = document.getElementById('languageSelect');
let translateRequestId = 0;
let typewriterTimer = null;
let translateTypeTimer = null;
let typingBubbleElement = null;
let userScrolledChat = false;
let activeChatRequestId = null;
let activeStreamBubble = null;
let activeStreamText = '';
let activeStreamFullText = '';
let activeStreamQueue = '';
let activeStreamTimer = null;
let activeTranslateRequestId = null;
let translateLoadingTimer = null;
let translateAutoTimer = null;

const I18N = {
  en: {
    chat_title: 'Lite',
    chat_placeholder: 'Ask Lite',
    empty_chat: 'Ask something below. The answer will appear here.',
    lang_auto: 'Detect language',
    lang_ru: 'Русский',
    lang_en: 'English',
    lang_uk: 'Українська',
    lang_be: 'Беларуская',
    lang_tr: 'Türkçe',
    lang_kk: 'Қазақша',
    lang_es: 'Español',
    lang_pt: 'Português',
    lang_de: 'Deutsch',
    lang_fr: 'Français',
    lang_pl: 'Polski',
    translate_input: 'Enter text',
    translate_output: 'Translation',
    watermark: 'Watermark',
    style: 'Style',
    enabled: 'Enabled',
    position: 'Position',
    text: 'Text',
    saved: 'Saved',
    copy_time: 'Copy Time',
    copy_date: 'Copy Date',
    themes: 'Themes',
    language: 'Language',
    ai_mode: 'AI Mode',
    ai_info: 'Online no-key mode is enabled. Local Ollama is used automatically when available.',
    reset_settings: 'Reset Settings',
    about_desc: 'Desktop helper with Lite, translator, themes and watermark.',
    saved_empty: 'Saved chats appear here.',
    wm_solid: 'Solid',
    wm_minimal: 'Minimal',
    pos_top_left: 'Top Left',
    pos_top_right: 'Top Right',
    pos_bottom_left: 'Bottom Left',
    pos_bottom_right: 'Bottom Right',
    menu_deep: 'Think longer',
    menu_research: 'Deep research',
    ask_chatgpt_lite: 'Ask Lite'
  },
  ru: {
    chat_title: 'Lite',
    chat_placeholder: 'Спросить у Lite',
    empty_chat: 'Спросите что-нибудь внизу. Ответ появится здесь.',
    lang_auto: 'Определить язык',
    lang_ru: 'Русский',
    lang_en: 'English',
    lang_uk: 'Українська',
    lang_be: 'Беларуская',
    lang_tr: 'Türkçe',
    lang_kk: 'Қазақша',
    lang_es: 'Español',
    lang_pt: 'Português',
    lang_de: 'Deutsch',
    lang_fr: 'Français',
    lang_pl: 'Polski',
    translate_input: 'Введите текст',
    translate_output: 'Перевод',
    watermark: 'Ватермарка',
    style: 'Стиль',
    enabled: 'Включено',
    position: 'Позиция',
    text: 'Текст',
    saved: 'Сохранённые',
    copy_time: 'Копировать время',
    copy_date: 'Копировать дату',
    themes: 'Темы',
    language: 'Язык',
    ai_mode: 'Режим ИИ',
    ai_info: 'Онлайн-режим без ключа включён. Локальный Ollama используется автоматически, если доступен.',
    reset_settings: 'Сбросить настройки',
    about_desc: 'Помощник с Lite, переводчиком, темами и ватермаркой.',
    saved_empty: 'Сохранённые чаты появятся здесь.',
    wm_solid: 'Обычный',
    wm_minimal: 'Минималистичный',
    pos_top_left: 'Сверху слева',
    pos_top_right: 'Сверху справа',
    pos_bottom_left: 'Снизу слева',
    pos_bottom_right: 'Снизу справа',
    menu_deep: 'Думай дольше',
    menu_research: 'Глубокое исследование',
    ask_chatgpt_lite: 'Спросить у Lite'
  }
};

function loadState() {
  try {
    const loaded = { ...DEFAULTS, ...JSON.parse(localStorage.getItem('helpsense.desktop') || '{}') };
    if (!Array.isArray(loaded.savedChats)) loaded.savedChats = [];
    if (!Array.isArray(loaded.chatMessages)) loaded.chatMessages = [];
    return loaded;
  } catch {
    localStorage.removeItem('helpsense.desktop');
    return { ...DEFAULTS };
  }
}

function save() {
  localStorage.setItem('helpsense.desktop', JSON.stringify(state));
  window.helpsense?.saveAppState(state);
}

function t(key) {
  return (I18N[state.language] || I18N.en)[key] || I18N.en[key] || key;
}

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('option[data-i18n]').forEach(option => {
    option.textContent = t(option.dataset.i18n);
  });
  watermarkStyle.value = state.watermarkStyle;
  watermarkPositionSelect.value = state.watermarkPosition;
  fromLang.value = state.fromLang;
  toLang.value = state.toLang;
  languageSelect.value = state.language;
}

function setStatus(text) {
  status.textContent = text;
  clearTimeout(setStatus.timer);
  setStatus.timer = setTimeout(() => {
    status.textContent = 'Ready';
  }, 1800);
}

function formattedDate() {
  return new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function formattedTime() {
  return new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

async function copy(text) {
  const value = String(text ?? '');
  if (!value.trim()) return setStatus('Nothing to copy');
  if (window.helpsense?.copyText) await window.helpsense.copyText(value);
  else await navigator.clipboard.writeText(value);
  state.totalCopies += 1;
  save();
  renderWatermark();
  showToast('Message copied');
  setStatus('Copied');
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatInline(value) {
  return escapeHtml(value)
    .replace(/==(.+?)==/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1');
}

function assistantMarkdown(text) {
  const lines = String(text || '').split(/\r?\n/);
  const html = [];
  let list = null;

  function closeList() {
    if (!list) return;
    html.push(`</${list}>`);
    list = null;
  }

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      return;
    }

    const bullet = trimmed.match(/^(?:[-*•])\s+(.+)$/);
    if (bullet) {
      if (list !== 'ul') {
        closeList();
        html.push('<ul>');
        list = 'ul';
      }
      html.push(`<li>${formatInline(bullet[1])}</li>`);
      return;
    }

    const numbered = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (numbered) {
      if (list !== 'ol') {
        closeList();
        html.push('<ol>');
        list = 'ol';
      }
      html.push(`<li>${formatInline(numbered[2])}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${formatInline(trimmed)}</p>`);
  });

  closeList();
  return html.join('');
}

function cleanAssistantText(text) {
  const raw = String(text || '').trim();
  const jsonAnswer = extractUserFacingJsonAnswer(raw);
  if (jsonAnswer !== null) return jsonAnswer;
  if (/^\s*```(?:json)?\s*\{[\s\S]*?(?:"reasoning"|"analysis"|"role")/i.test(raw)) {
    const fenced = raw.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
    const fencedAnswer = extractUserFacingJsonAnswer(fenced);
    if (fencedAnswer !== null) return fencedAnswer;
  }
  if (/^\s*\{[\s\S]*?(?:"reasoning"|"analysis"|"role")/i.test(raw)) return '';
  return String(text || '')
    .replace(/(?:\n|\r|\s)*\(?\s*note\s*:\s*[\s\S]*$/i, '')
    .replace(/(?:\n|\r|\s)*\(?\s*примечание\s*:\s*[\s\S]*$/i, '')
    .trim();
}

function extractUserFacingJsonAnswer(raw) {
  try {
    const parsed = JSON.parse(String(raw || '').trim());
    if (!parsed || typeof parsed !== 'object') return null;
    if (!('reasoning' in parsed) && !('analysis' in parsed) && !('role' in parsed)) return null;
    const candidates = [
      parsed.final,
      parsed.answer,
      parsed.content,
      parsed.text,
      parsed.message?.content,
      Array.isArray(parsed.messages) ? parsed.messages.at(-1)?.content : ''
    ];
    const answer = candidates.find(value => typeof value === 'string' && value.trim());
    return answer ? cleanAssistantText(answer) : '';
  } catch {
    return null;
  }
}

function typeText(target, text, onDone, speed = 32) {
  clearInterval(typewriterTimer);
  typingBubbleElement = target;
  state.isTyping = true;
  renderSendButton();
  target.textContent = '';
  target.classList.add('typing-text');
  let index = 0;
  typewriterTimer = setInterval(() => {
    index += 1;
    target.textContent = text.slice(0, index);
    if (!userScrolledChat) chatLog.scrollTop = chatLog.scrollHeight;
    if (index >= text.length) {
      clearInterval(typewriterTimer);
      target.textContent = text;
      target.classList.remove('typing-text');
      state.isTyping = false;
      typingBubbleElement = null;
      renderSendButton();
      onDone?.();
    }
  }, speed);
}

function stopTyping() {
  if (!state.isTyping) return false;
  clearInterval(typewriterTimer);
  typingBubbleElement?.classList.remove('typing-text');
  state.isTyping = false;
  typingBubbleElement = null;
  renderSendButton();
  setStatus('Stopped');
  return true;
}

function typeTextarea(target, text, speed = 30) {
  clearInterval(translateTypeTimer);
  target.value = '';
  let index = 0;
  translateTypeTimer = setInterval(() => {
    index += 1;
    target.value = text.slice(0, index);
    if (index >= text.length) {
      clearInterval(translateTypeTimer);
      target.value = text;
    }
  }, speed);
}

function setTranslateLoading(isLoading) {
  translateLoading?.parentElement?.classList.toggle('translating', Boolean(isLoading));
  clearInterval(translateLoadingTimer);
  if (!isLoading) {
    const label = translateLoading?.querySelector('span');
    if (label) label.textContent = 'Переводится';
    return;
  }

  const label = translateLoading?.querySelector('span');
  if (!label) return;
  const text = 'Переводится';
  let index = 0;
  label.textContent = '';
  translateLoadingTimer = setInterval(() => {
    index = index >= text.length ? text.length : index + 1;
    label.textContent = text.slice(0, index);
    if (index >= text.length) clearInterval(translateLoadingTimer);
  }, 35);
}

function clearTranslateOutput() {
  translateRequestId += 1;
  clearTimeout(translateAutoTimer);
  if (activeTranslateRequestId) {
    window.helpsense?.cancelOpenAIHelper?.(activeTranslateRequestId);
    activeTranslateRequestId = null;
  }
  setTranslateLoading(false);
  state.translateOutput = '';
  eraseTranslateOutput();
}

function scheduleAutoTranslate() {
  clearTimeout(translateAutoTimer);
  if (!translateInput.value.trim()) return;
  translateAutoTimer = setTimeout(() => {
    document.getElementById('translateAi').click();
  }, 2500);
}

function eraseTranslateOutput() {
  clearInterval(translateTypeTimer);
  const startValue = translateOutput.value;
  if (!startValue) {
    translateOutput.placeholder = t('translate_output');
    return;
  }

  translateOutput.placeholder = '';
  let index = startValue.length;
  translateTypeTimer = setInterval(() => {
    index -= Math.max(1, Math.ceil(index / 24));
    translateOutput.value = startValue.slice(0, Math.max(0, index));
    if (index <= 0) {
      clearInterval(translateTypeTimer);
      translateOutput.value = '';
      translateOutput.placeholder = t('translate_output');
    }
  }, 14);
}

async function rememberApiKey() {
  return true;
}

async function runAi(payload) {
  await rememberApiKey();
  return window.helpsense?.runOpenAIHelper(payload);
}

async function streamAi(payload, onChunk) {
  await rememberApiKey();
  if (!window.helpsense?.streamOpenAIHelper) {
    const response = await runAi(payload);
    if (response?.ok && response.text) onChunk(response.text);
    return response;
  }
  return window.helpsense.streamOpenAIHelper(payload);
}

function stopThinking() {
  if (!state.isThinking) return false;
  const requestId = activeChatRequestId;
  activeChatRequestId = null;
  state.isThinking = false;
  activeStreamBubble = null;
  activeStreamText = '';
  activeStreamFullText = '';
  activeStreamQueue = '';
  clearInterval(activeStreamTimer);
  window.helpsense?.cancelOpenAIHelper?.(requestId);
  renderChat();
  renderSendButton();
  setStatus('Stopped');
  return true;
}

function appendStreamChunk(requestId, chunk) {
  if (activeChatRequestId !== requestId) return;
  ensureStreamBubble();
  activeStreamFullText += String(chunk || '');
  activeStreamFullText = cleanAssistantText(activeStreamFullText);
  activeStreamQueue += String(chunk || '');
  startStreamTypewriter();
}

function ensureStreamBubble() {
  if (activeStreamBubble) return;
  chatLog.querySelector('.typing-bubble')?.remove();
  activeStreamBubble = streamingAssistantBubble();
  chatLog.appendChild(activeStreamBubble);
  if (!userScrolledChat) chatLog.scrollTop = chatLog.scrollHeight;
}

window.helpsense?.onAIStreamChunk?.(({ requestId, chunk }) => {
  appendStreamChunk(requestId, chunk);
});

function startStreamTypewriter() {
  if (activeStreamTimer) return;
  activeStreamTimer = setInterval(() => {
    if (!activeStreamQueue || !activeStreamBubble) {
      clearInterval(activeStreamTimer);
      activeStreamTimer = null;
      return;
    }
    const step = 1;
    activeStreamText += activeStreamQueue.slice(0, step);
    activeStreamQueue = activeStreamQueue.slice(step);
    activeStreamBubble.textContent = cleanAssistantText(activeStreamText);
    if (!userScrolledChat) chatLog.scrollTop = chatLog.scrollHeight;
  }, 30);
}

function flushStreamTypewriter() {
  activeStreamText = cleanAssistantText(activeStreamFullText || activeStreamText);
  activeStreamQueue = '';
  if (activeStreamBubble) activeStreamBubble.textContent = activeStreamText;
}

function waitForStreamTypewriter(maxWait = 8000) {
  const started = Date.now();
  return new Promise(resolve => {
    const timer = setInterval(() => {
      if (!activeStreamQueue || Date.now() - started > maxWait) {
        clearInterval(timer);
        if (Date.now() - started > maxWait) flushStreamTypewriter();
        resolve();
      }
    }, 30);
  });
}

function chatContext() {
  return state.chatMessages
    .slice(-8)
    .map(message => {
      if (message.role === 'user' && message.quote) {
        return `Selected text: "${message.quote}"\nUser: ${message.text || 'Explain it.'}`;
      }
      return `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.text || ''}`;
    })
    .join('\n');
}

function themeBackground(colors, isFlag, id) {
  if (id === 'rgb') {
    return 'conic-gradient(from 20deg,#36d5ff,#9c6bff,#ff65b7,#ffe15a,#9dff47,#36d5ff)';
  }
  if (id === 'us') {
    return 'linear-gradient(90deg,#3c3b6e 0 43%,transparent 43%),repeating-linear-gradient(180deg,#b22234 0 7.7%,#fff 7.7% 15.4%)';
  }
  if (isFlag) {
    return `linear-gradient(180deg, ${colors.map((color, index) => {
      const start = (index / colors.length) * 100;
      const end = ((index + 1) / colors.length) * 100;
      return `${color} ${start}% ${end}%`;
    }).join(', ')})`;
  }
  return `radial-gradient(circle at 34% 32%, ${colors[1] || colors[0]} 0 18%, transparent 42%), linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`;
}

function renderThemes() {
  themeGrid.replaceChildren(...THEMES.map(([id, name, colors, isFlag]) => {
    const button = document.createElement('button');
    button.className = `theme theme-${id}${state.theme === id ? ' active' : ''}${isFlag ? ' flag' : ''}`;
    button.type = 'button';
    button.title = name;
    button.setAttribute('aria-label', name);
    button.style.background = themeBackground(colors, isFlag, id);
    button.addEventListener('click', () => {
      state.theme = id;
      save();
      applyTheme();
      renderThemes();
      renderWatermark();
    });
    return button;
  }));
}

function applyTheme() {
  const theme = THEMES.find(item => item[0] === state.theme) || THEMES[1];
  const main = state.theme === 'rgb' ? '#9dff47' : theme[2][0];
  document.documentElement.style.setProperty('--main', main);
  document.documentElement.style.setProperty('--second', theme[2][1] || theme[2][0]);
  document.documentElement.style.setProperty('--bar', `linear-gradient(90deg, ${theme[2].join(', ')})`);
  document.documentElement.style.setProperty('--sense', '#9dff47');
}

function renderWatermark() {
  const template = state.watermarkText || DEFAULTS.watermarkText;
  watermark.textContent = template
    .replaceAll('{time}', formattedTime())
    .replaceAll('{date}', formattedDate());
  watermark.style.display = state.watermark ? 'block' : 'none';
  watermark.className = `watermark ${state.watermarkPosition} ${state.watermarkStyle}`;
  watermarkToggle.classList.toggle('on', state.watermark);
  watermarkToggle.setAttribute('aria-pressed', String(state.watermark));
  watermarkText.value = state.watermarkText;
  watermarkStyle.value = state.watermarkStyle;
  watermarkPositionSelect.value = state.watermarkPosition;
}

function renderChat() {
  chatLog.replaceChildren();
  const messages = state.chatMessages;
  if (!messages.length) {
    chatLog.appendChild(emptyChatNode());
    return;
  }
  messages.forEach(message => chatLog.appendChild(messageBubble(message)));
  if (state.isThinking) chatLog.appendChild(typingBubble());
  const last = messages[messages.length - 1];
  if (!state.isThinking && last?.role === 'assistant') {
    chatLog.appendChild(copyAnswerButton());
  }
  chatLog.scrollTop = chatLog.scrollHeight;
}

function emptyChatNode() {
  const empty = document.createElement('div');
  empty.className = 'empty-chat';
  const logo = document.createElement('div');
  logo.className = 'lite-empty-logo';
  logo.innerHTML = '<span></span><span></span><span></span><span></span>';
  const name = document.createElement('strong');
  name.textContent = 'LITE';
  const text = document.createElement('p');
  text.textContent = t('empty_chat');
  empty.append(logo, name, text);
  return empty;
}

function messageBubble(messageOrType, text = '') {
  const message = typeof messageOrType === 'object'
    ? messageOrType
    : { role: messageOrType, text };

  if (message.role === 'user' && message.quote) {
    const turn = document.createElement('div');
    turn.className = 'user-turn';
    const quote = document.createElement('div');
    quote.className = 'sent-quote';
    quote.innerHTML = `<span class="quote-arrow">↪</span><span>${escapeHtml(message.quote)}</span>`;
    const bubble = messageBubble({ role: 'user', text: message.text });
    turn.append(quote, bubble);
    return turn;
  }

  const bubble = document.createElement('div');
  bubble.className = `message ${message.role}`;
  if (message.text) {
    const content = document.createElement('div');
    if (message.role === 'assistant') {
      content.className = 'assistant-content';
      content.innerHTML = assistantMarkdown(message.text);
    } else {
      content.textContent = message.text;
    }
    bubble.appendChild(content);
  }
  return bubble;
}

function animatedAssistantBubble(text) {
  const bubble = messageBubble({ role: 'assistant', text: '' });
  typeText(bubble, text, () => {
    renderChat();
  });
  return bubble;
}

function streamingAssistantBubble() {
  const bubble = messageBubble({ role: 'assistant', text: '' });
  bubble.classList.add('typing-text');
  return bubble;
}

function typingBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'message assistant typing-bubble';
  bubble.innerHTML = '<span></span><span></span><span></span>';
  return bubble;
}

function copyAnswerButton() {
  const wrap = document.createElement('div');
  wrap.className = 'answer-tools';
  const button = document.createElement('button');
  button.className = 'copy-answer';
  button.type = 'button';
  button.title = 'Copy answer';
  button.setAttribute('aria-label', 'Copy answer');
  button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 8h10v12H8z"></path><path d="M5 16V4h11"></path></svg>';
  button.addEventListener('click', () => copy(state.chatAnswer));
  wrap.appendChild(button);
  return wrap;
}

function renderSaved() {
  savedList.replaceChildren();
  if (!state.savedChats.length) {
    const empty = document.createElement('div');
    empty.className = 'saved-empty';
    empty.textContent = t('saved_empty');
    savedList.appendChild(empty);
    return;
  }
  state.savedChats.slice().reverse().forEach(item => {
    const row = document.createElement('div');
    row.className = 'saved-item';
    const title = document.createElement('button');
    title.className = 'saved-title';
    title.type = 'button';
    title.textContent = `${item.question.slice(0, 38) || 'Untitled chat'}`;
    const meta = document.createElement('span');
    meta.textContent = item.date;
    const del = document.createElement('button');
    del.className = 'saved-delete';
    del.type = 'button';
    del.textContent = 'x';
    title.addEventListener('click', () => {
      state.chatMessages = Array.isArray(item.messages)
        ? item.messages
        : [
          { role: 'user', text: item.question || '' },
          { role: 'assistant', text: item.answer || '' }
        ].filter(message => message.text);
      state.chatInput = '';
      state.selectedQuote = '';
      state.chatAnswer = state.chatMessages.filter(message => message.role === 'assistant').slice(-1)[0]?.text || '';
      state.activeSavedId = item.id || item.date;
      chatInput.value = '';
      save();
      renderChat();
      setStatus('Loaded saved chat');
    });
    del.addEventListener('click', event => {
      event.stopPropagation();
      state.savedChats = state.savedChats.filter(saved => (saved.id || saved.date) !== (item.id || item.date));
      if (state.activeSavedId === (item.id || item.date)) state.activeSavedId = null;
      save();
      renderSaved();
      setStatus('Saved chat deleted');
    });
    row.append(title, meta, del);
    savedList.appendChild(row);
  });
}

function saveCurrentChat() {
  if (!state.chatMessages.length) return setStatus('Nothing to save');
  state.savedChats = [
    ...state.savedChats,
    {
      id: `${Date.now()}`,
      date: `${formattedDate()} ${formattedTime()}`,
      question: state.chatMessages.find(item => item.role === 'user')?.text || '',
      answer: state.chatMessages.filter(item => item.role === 'assistant').slice(-1)[0]?.text || '',
      messages: state.chatMessages
    }
  ].slice(-30);
  save();
  renderSaved();
  setStatus('Chat saved');
}

function clearCurrentChat() {
  if (state.isThinking) stopThinking();
  if (!state.chatMessages.length) return setStatus('Chat is already empty');
  chatLog.classList.add('clearing');
  setTimeout(() => {
    state.chatMessages = [];
    state.chatAnswer = '';
    state.activeSavedId = null;
    chatLog.classList.remove('clearing');
    save();
    renderChat();
    setStatus('Chat cleared');
  }, 230);
}

function render() {
  chatInput.value = state.chatInput;
  resizeChatInput();
  renderSelectedQuote();
  translateInput.value = state.translateInput;
  translateOutput.value = state.translateOutput;
  fromLang.value = state.fromLang;
  toLang.value = state.toLang;
  renderComposerModes();
  renderSendButton();
  renderChat();
  renderSaved();
  renderWatermark();
  applyLanguage();
}

function renderComposerModes() {
  deepThink.classList.toggle('active', Boolean(state.deepThinking));
  deepResearch.classList.toggle('active', Boolean(state.deepResearch));
}

function renderSendButton() {
  const button = document.getElementById('sendChat');
  const canStop = Boolean(state.isTyping || state.isThinking);
  button.classList.toggle('stop-mode', canStop);
  button.title = canStop ? 'Stop' : 'Send';
  button.setAttribute('aria-label', canStop ? 'Stop' : 'Send');
  button.innerHTML = canStop
    ? '<span class="stop-square" aria-hidden="true"></span>'
    : '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>';
}

function renderSelectedQuote() {
  const hasQuote = Boolean(state.selectedQuote);
  selectedQuote.classList.toggle('show', hasQuote);
  selectedQuote.classList.remove('active');
  selectedQuoteText.textContent = state.selectedQuote || '';
  resizeChatInput();
}

function resizeChatInput() {
  chatInput.style.height = 'auto';
  const nextHeight = Math.min(chatInput.scrollHeight, 150);
  chatInput.style.height = `${Math.max(nextHeight, 42)}px`;
  chatInput.style.overflowY = chatInput.scrollHeight > 150 ? 'auto' : 'hidden';
  const composerHeight = document.querySelector('.chat-bar')?.offsetHeight || 64;
  document.documentElement.style.setProperty('--composer-height', `${composerHeight}px`);
}

document.querySelectorAll('.tab').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab === button));
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(`view-${button.dataset.tab}`).classList.add('active');
  });
});

languageSelect.addEventListener('change', event => {
  state.language = event.target.value;
  save();
  applyLanguage();
  renderChat();
  renderSaved();
});

chatInput.addEventListener('input', event => {
  state.chatInput = event.target.value;
  resizeChatInput();
  save();
});

chatInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.getElementById('sendChat').click();
  }
});

chatLog.addEventListener('scroll', () => {
  const distanceFromBottom = chatLog.scrollHeight - chatLog.scrollTop - chatLog.clientHeight;
  userScrolledChat = distanceFromBottom > 80;
});

chatPlus.addEventListener('click', event => {
  event.stopPropagation();
  const open = !plusMenu.classList.contains('open');
  plusMenu.classList.toggle('open', open);
  chatPlus.classList.toggle('active', open);
});

document.addEventListener('click', event => {
  if (!plusMenu.contains(event.target) && event.target !== chatPlus) {
    plusMenu.classList.remove('open');
    chatPlus.classList.remove('active');
  }
});

deepThink.addEventListener('click', () => {
  state.deepThinking = !state.deepThinking;
  save();
  renderComposerModes();
  setStatus(state.deepThinking ? 'Think longer enabled' : 'Think longer disabled');
});

deepResearch.addEventListener('click', () => {
  state.deepResearch = !state.deepResearch;
  save();
  renderComposerModes();
  setStatus(state.deepResearch ? 'Deep research enabled' : 'Deep research disabled');
});

function selectedTextInfo() {
  const selection = window.getSelection();
  const text = selection?.toString().trim() || '';
  if (!text) return null;
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) return null;
  return { text, rect };
}

document.addEventListener('selectionchange', () => {
  clearTimeout(document.selectionTimer);
  document.selectionTimer = setTimeout(() => {
    const info = selectedTextInfo();
    if (!info || selectionPopover.contains(document.activeElement)) {
      selectionPopover.classList.remove('show');
      return;
    }

    selectionPopover.dataset.text = info.text.slice(0, 1800);
    selectionPopover.style.left = `${Math.min(window.innerWidth - 180, Math.max(10, info.rect.left + info.rect.width / 2 - 76))}px`;
    selectionPopover.style.top = `${Math.max(8, info.rect.top - 48)}px`;
    selectionPopover.classList.add('show');
  }, 80);
});

selectionPopover.addEventListener('mousedown', event => {
  event.preventDefault();
});

selectionPopover.addEventListener('click', () => {
  const text = selectionPopover.dataset.text || '';
  if (!text) return;
  state.selectedQuote = text;
  save();
  renderSelectedQuote();
  document.querySelector('[data-tab="chat"]').click();
  chatInput.focus();
  selectionPopover.classList.remove('show');
  setStatus('Selected text added to Lite');
});

clearSelectedQuote.addEventListener('click', () => {
  state.selectedQuote = '';
  save();
  renderSelectedQuote();
});

selectedQuote.addEventListener('click', event => {
  if (event.target === clearSelectedQuote) return;
  selectedQuote.classList.add('active');
  clearTimeout(selectedQuote.activeTimer);
  selectedQuote.activeTimer = setTimeout(() => {
    selectedQuote.classList.remove('active');
  }, 3000);
});

translateInput.addEventListener('input', event => {
  state.translateInput = event.target.value;
  clearTranslateOutput();
  scheduleAutoTranslate();
  save();
});

translateInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.getElementById('translateAi').click();
  }
});

fromLang.addEventListener('change', event => {
  state.fromLang = event.target.value;
  clearTranslateOutput();
  scheduleAutoTranslate();
  save();
});

toLang.addEventListener('change', event => {
  state.toLang = event.target.value;
  clearTranslateOutput();
  scheduleAutoTranslate();
  save();
});

watermarkText.addEventListener('input', event => {
  state.watermarkText = event.target.value;
  save();
  renderWatermark();
});

watermarkStyle.addEventListener('change', event => {
  state.watermarkStyle = event.target.value;
  save();
  renderWatermark();
});

watermarkPositionSelect.addEventListener('change', event => {
  state.watermarkPosition = event.target.value;
  save();
  renderWatermark();
});

watermarkToggle.addEventListener('click', () => {
  state.watermark = !state.watermark;
  save();
  renderWatermark();
});

document.getElementById('sendChat').addEventListener('click', async () => {
  if (stopTyping()) return;
  if (stopThinking()) return;
  if (!chatInput.value.trim() && !state.selectedQuote) return setStatus('Question is empty');
  const question = chatInput.value.trim() || (state.language === 'ru' ? 'Объясни выделенный фрагмент.' : 'Explain the selected text.');
  const selectedQuoteText = state.selectedQuote;
  state.chatInput = '';
  state.selectedQuote = '';
  state.chatAnswer = '';
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  activeChatRequestId = requestId;
  state.chatMessages.push({
    role: 'user',
    text: question,
    quote: selectedQuoteText || ''
  });
  chatInput.value = '';
  resizeChatInput();
  renderSelectedQuote();
  state.isThinking = true;
  renderSendButton();
  renderChat();
  activeStreamText = '';
  activeStreamFullText = '';
  activeStreamQueue = '';
  activeStreamBubble = null;
  setStatus('Lite is thinking...');
  const response = await streamAi({
    requestId,
    task: 'chat',
    text: chatContext(),
    language: state.language,
    deepThinking: state.deepThinking,
    deepResearch: state.deepResearch
  }, chunk => appendStreamChunk(requestId, chunk));
  if (activeChatRequestId !== requestId) return;
  activeChatRequestId = null;
  state.isThinking = false;
  await waitForStreamTypewriter();
  activeStreamBubble?.classList.remove('typing-text');
  activeStreamBubble = null;
  renderSendButton();
  if (!response?.ok) {
    activeStreamText = '';
    activeStreamFullText = '';
    activeStreamQueue = '';
    renderChat();
    return setStatus(response?.error || 'Lite failed');
  }
  const answer = cleanAssistantText(response.text || activeStreamFullText || activeStreamText);
  activeStreamText = '';
  activeStreamFullText = '';
  activeStreamQueue = '';
  state.chatAnswer = answer;
  state.chatMessages.push({ role: 'assistant', text: answer });
  if (state.activeSavedId) {
    const saved = state.savedChats.find(item => (item.id || item.date) === state.activeSavedId);
    if (saved) {
      saved.answer = answer;
      saved.messages = state.chatMessages;
    }
  }
  save();
  renderChat();
  setStatus('Lite answered');
});

document.getElementById('saveChat').addEventListener('click', saveCurrentChat);
document.getElementById('swapLang').addEventListener('click', () => {
  const from = fromLang.value;
  const to = toLang.value;
  const inputText = translateInput.value;
  const outputText = translateOutput.value;
  state.fromLang = from === 'auto' ? to : to;
  state.toLang = from === 'auto'
    ? (state.language !== to ? state.language : (to === 'ru' ? 'en' : 'ru'))
    : from;
  state.translateInput = outputText;
  state.translateOutput = inputText;
  fromLang.value = state.fromLang;
  toLang.value = state.toLang;
  translateInput.value = state.translateInput;
  clearInterval(translateTypeTimer);
  setTranslateLoading(false);
  translateOutput.placeholder = state.translateOutput ? '' : t('translate_output');
  translateOutput.value = state.translateOutput;
  clearTimeout(translateAutoTimer);
  scheduleAutoTranslate();
  save();
});

document.getElementById('translateAi').addEventListener('click', async () => {
  clearTimeout(translateAutoTimer);
  if (!translateInput.value.trim()) {
    clearTranslateOutput();
    return setStatus('Text is empty');
  }
  state.translateInput = translateInput.value;
  const requestId = ++translateRequestId;
  const requestToken = `translate-${requestId}`;
  activeTranslateRequestId = requestToken;
  clearInterval(translateTypeTimer);
  translateOutput.value = '';
  translateOutput.placeholder = '';
  setTranslateLoading(true);
  setStatus('Translating...');
  const response = await runAi({
    requestId: requestToken,
    task: 'translate',
    text: state.translateInput,
    language: state.language,
    from: fromLang.value,
    to: toLang.value
  });
  if (requestId !== translateRequestId) return;
  activeTranslateRequestId = null;
  setTranslateLoading(false);
  if (!response?.ok) {
    translateOutput.placeholder = t('translate_output');
    return setStatus(response?.error || 'Translation failed');
  }
  const translatedText = String(response.text || '');
  const translated = translatedText.trim() === '...' ? '' : translatedText;
  state.translateOutput = translated;
  translateOutput.placeholder = translated ? '' : t('translate_output');
  typeTextarea(translateOutput, translated, 22);
  save();
  setStatus('Translated');
});

document.getElementById('clearChat').addEventListener('click', clearCurrentChat);
document.getElementById('copyTime').addEventListener('click', () => copy(formattedTime()));
document.getElementById('copyDate').addEventListener('click', () => copy(formattedDate()));
document.getElementById('resetAll').addEventListener('click', () => {
  Object.assign(state, DEFAULTS);
  save();
  applyTheme();
  renderThemes();
  render();
  setStatus('Settings reset');
});

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    saveCurrentChat();
  }
});

setInterval(renderWatermark, 1000);
applyTheme();
renderThemes();
render();
window.helpsense?.loadAppState().then(saved => {
  if (!saved || typeof saved !== 'object') return;
  Object.assign(state, { ...DEFAULTS, ...saved });
  if (!Array.isArray(state.savedChats)) state.savedChats = [];
  if (!Array.isArray(state.chatMessages)) state.chatMessages = [];
  state.isThinking = false;
  applyTheme();
  renderThemes();
  render();
});

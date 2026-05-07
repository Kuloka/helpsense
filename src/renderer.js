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
  chatAnswer: '',
  chatMessages: [],
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
const toast = document.getElementById('toast');
const translateInput = document.getElementById('translateInput');
const translateOutput = document.getElementById('translateOutput');
const fromLang = document.getElementById('fromLang');
const toLang = document.getElementById('toLang');
const savedList = document.getElementById('savedList');
const watermark = document.getElementById('watermark');
const watermarkToggle = document.getElementById('watermarkToggle');
const watermarkText = document.getElementById('watermarkText');
const watermarkStyle = document.getElementById('watermarkStyle');
const watermarkPositionSelect = document.getElementById('watermarkPositionSelect');
const languageSelect = document.getElementById('languageSelect');

const I18N = {
  en: {
    chat_title: 'ChatGPT lite',
    chat_placeholder: 'Ask ChatGPT',
    empty_chat: 'Ask something below. The answer will appear here.',
    lang_auto: 'Detect language',
    lang_ru: 'Russian',
    lang_en: 'English',
    lang_uk: 'Ukrainian',
    lang_be: 'Belarusian',
    lang_tr: 'Turkish',
    lang_kk: 'Kazakh',
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
    about_desc: 'Desktop helper with ChatGPT, translator, themes and watermark.',
    saved_empty: 'Saved chats appear here.',
    wm_solid: 'Solid',
    wm_minimal: 'Minimal',
    pos_top_left: 'Top Left',
    pos_top_right: 'Top Right',
    pos_bottom_left: 'Bottom Left',
    pos_bottom_right: 'Bottom Right'
  },
  ru: {
    chat_title: 'ChatGPT lite',
    chat_placeholder: 'Спросите ChatGPT',
    empty_chat: 'Спросите что-нибудь внизу. Ответ появится здесь.',
    lang_auto: 'Определить язык',
    lang_ru: 'Русский',
    lang_en: 'Английский',
    lang_uk: 'Украинский',
    lang_be: 'Белорусский',
    lang_tr: 'Турецкий',
    lang_kk: 'Казахский',
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
    about_desc: 'Помощник с ChatGPT, переводчиком, темами и ватермаркой.',
    saved_empty: 'Сохранённые чаты появятся здесь.',
    wm_solid: 'Обычный',
    wm_minimal: 'Минималистичный',
    pos_top_left: 'Сверху слева',
    pos_top_right: 'Сверху справа',
    pos_bottom_left: 'Снизу слева',
    pos_bottom_right: 'Снизу справа'
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

async function rememberApiKey() {
  return true;
}

async function runAi(payload) {
  await rememberApiKey();
  return window.helpsense?.runOpenAIHelper(payload);
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
    chatLog.appendChild(Object.assign(document.createElement('div'), {
      className: 'empty-chat',
      textContent: t('empty_chat')
    }));
    return;
  }
  messages.forEach(message => chatLog.appendChild(messageBubble(message.role, message.text)));
  if (state.isThinking) chatLog.appendChild(typingBubble());
  const last = messages[messages.length - 1];
  if (!state.isThinking && last?.role === 'assistant') {
    chatLog.appendChild(copyAnswerButton());
  }
  chatLog.scrollTop = chatLog.scrollHeight;
}

function messageBubble(type, text) {
  const bubble = document.createElement('div');
  bubble.className = `message ${type}`;
  bubble.textContent = text;
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

function render() {
  chatInput.value = state.chatInput;
  translateInput.value = state.translateInput;
  translateOutput.value = state.translateOutput;
  fromLang.value = state.fromLang;
  toLang.value = state.toLang;
  renderChat();
  renderSaved();
  renderWatermark();
  applyLanguage();
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
  save();
});

chatInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.getElementById('sendChat').click();
  }
});

translateInput.addEventListener('input', event => {
  state.translateInput = event.target.value;
  if (!event.target.value.trim()) {
    state.translateOutput = '';
    translateOutput.value = '';
    clearTimeout(translateInput.timer);
  } else {
    clearTimeout(translateInput.timer);
    translateInput.timer = setTimeout(() => {
      document.getElementById('translateAi').click();
    }, 520);
  }
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
  save();
});

toLang.addEventListener('change', event => {
  state.toLang = event.target.value;
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
  if (!chatInput.value.trim()) return setStatus('Question is empty');
  const question = chatInput.value;
  state.chatInput = '';
  state.chatAnswer = '';
  state.chatMessages.push({ role: 'user', text: question });
  chatInput.value = '';
  state.isThinking = true;
  renderChat();
  setStatus('ChatGPT is thinking...');
  const response = await runAi({ task: 'chat', text: question });
  state.isThinking = false;
  if (!response?.ok) {
    renderChat();
    return setStatus(response?.error || 'ChatGPT failed');
  }
  state.chatAnswer = response.text;
  state.chatMessages.push({ role: 'assistant', text: response.text });
  if (state.activeSavedId) {
    const saved = state.savedChats.find(item => (item.id || item.date) === state.activeSavedId);
    if (saved) {
      saved.answer = response.text;
      saved.messages = state.chatMessages;
    }
  }
  save();
  renderChat();
  setStatus('ChatGPT answered');
});

document.getElementById('saveChat').addEventListener('click', saveCurrentChat);
document.getElementById('swapLang').addEventListener('click', () => {
  if (fromLang.value === 'auto') return setStatus('Auto source cannot swap');
  const from = fromLang.value;
  state.fromLang = toLang.value;
  state.toLang = from;
  fromLang.value = state.fromLang;
  toLang.value = state.toLang;
  save();
});

document.getElementById('translateAi').addEventListener('click', async () => {
  if (!translateInput.value.trim()) return setStatus('Text is empty');
  state.translateInput = translateInput.value;
  setStatus('Translating...');
  const response = await runAi({
    task: 'translate',
    text: state.translateInput,
    from: fromLang.value,
    to: toLang.value
  });
  if (!response?.ok) return setStatus(response?.error || 'Translation failed');
  state.translateOutput = response.text;
  translateOutput.value = response.text;
  save();
  setStatus('Translated');
});

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

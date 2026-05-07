const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('helpsense', {
  copyText: (text) => ipcRenderer.invoke('copy-text', text),
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  setOpenAIKey: (apiKey) => ipcRenderer.invoke('set-openai-key', apiKey),
  runOpenAIHelper: (payload) => ipcRenderer.invoke('run-openai-helper', payload),
  loadAppState: () => ipcRenderer.invoke('load-app-state'),
  saveAppState: (state) => ipcRenderer.invoke('save-app-state', state)
});

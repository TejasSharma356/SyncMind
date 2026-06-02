const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Transcript
    sendTranscript: (data) => ipcRenderer.invoke('send-transcript', data),
    getWhisperMode: () => ipcRenderer.invoke('get-whisper-mode'),

    // Window
    toggleFloatingMode: () => ipcRenderer.invoke('toggle-floating-mode'),
    // openExternal is routed via IPC — shell.openExternal must run in main process
    openExternal: (url) => ipcRenderer.invoke('open-external', url),

    // Audio streaming
    startAudio: () => ipcRenderer.send('start-audio'),
    stopAudio: () => ipcRenderer.send('stop-audio'),
    sendAudioChunk: (chunk) => ipcRenderer.send('audio-chunk', chunk),

    // Transcription mode
    toggleTranscriptionMode: (mode) => ipcRenderer.send('toggle-transcription-mode', mode),

    // Auth
    setAuthToken: (token) => ipcRenderer.send('set-auth-token', token),
    // Preload runs in Node context — read process.env directly, no IPC needed
    getWebAppUrl: () => process.env.VITE_WEB_APP_URL || 'https://sync-mind-test.vercel.app',

    // Events from main
    onAudioStatus: (callback) => {
        ipcRenderer.removeAllListeners('audio-status');
        ipcRenderer.on('audio-status', (event, status) => callback(status));
    },
    onCaptionStatus: (callback) => {
        ipcRenderer.removeAllListeners('caption-status');
        ipcRenderer.on('caption-status', (event, status) => callback(status));
    },
    onTranscriptUpdated: (callback) => {
        ipcRenderer.removeAllListeners('transcript-updated');
        ipcRenderer.on('transcript-updated', (event, text) => callback(text));
    },
    onUploadStatus: (callback) => {
        ipcRenderer.removeAllListeners('upload-status');
        ipcRenderer.on('upload-status', (event, data) => callback(data));
    },
    onAuthTokenReceived: (callback) => {
        ipcRenderer.removeAllListeners('auth-token-received');
        ipcRenderer.on('auth-token-received', (event, token) => callback(token));
    },

    // Logger
    saveLog: (text) => ipcRenderer.send('save-log', text),
    onLog: (callback) => {
        ipcRenderer.removeAllListeners('log');
        ipcRenderer.on('log', (event, msg) => callback(msg));
    },

    // Screen Capture
    getDesktopSources: () => ipcRenderer.invoke('get-desktop-sources', { types: ['screen'] }),
});

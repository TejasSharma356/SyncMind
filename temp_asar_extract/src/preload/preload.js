const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Transcript
    sendTranscript: (data) => ipcRenderer.invoke('send-transcript', data),
    getWhisperMode: () => ipcRenderer.invoke('get-whisper-mode'),

    // Window
    toggleFloatingMode: () => ipcRenderer.invoke('toggle-floating-mode'),

    // Audio streaming
    startAudio: () => ipcRenderer.send('start-audio'),
    stopAudio: () => ipcRenderer.send('stop-audio'),
    sendAudioChunk: (chunk) => ipcRenderer.send('audio-chunk', chunk),

    // Transcription mode
    toggleTranscriptionMode: (mode) => ipcRenderer.send('toggle-transcription-mode', mode),

    // Auth
    setAuthToken: (token) => ipcRenderer.send('set-auth-token', token),

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

    // Logger
    saveLog: (text) => ipcRenderer.send('save-log', text),
    onLog: (callback) => {
        ipcRenderer.removeAllListeners('log');
        ipcRenderer.on('log', (event, msg) => callback(msg));
    },

    // Screen Capture
    getDesktopSources: () => ipcRenderer.invoke('get-desktop-sources', { types: ['screen'] }),
});

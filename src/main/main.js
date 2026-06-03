// ─── EARLY STARTUP DIAGNOSTIC ────────────────────────────────────────────────
// Writes a step-by-step log to %TEMP%\syncmind_startup.log so we can see
// exactly where the process is dying on any machine.
const _fs = require('fs');
const _os = require('os');
const _path = require('path');
const _startupLog = _path.join(_os.tmpdir(), 'syncmind_startup.log');
function _log(msg) {
    try { _fs.appendFileSync(_startupLog, `[${new Date().toISOString()}] ${msg}\n`); } catch(e) {}
}
_log('STEP 1: main.js started');
// ─────────────────────────────────────────────────────────────────────────────

const { app, BrowserWindow, BrowserView, ipcMain, desktopCapturer, dialog, shell } = require('electron');
_log('STEP 2: electron required');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables based on environment
_log('STEP 3: loading .env');
const envPath = app.isPackaged
    ? path.join(process.resourcesPath, '.env')
    : path.resolve(app.getAppPath(), '.env');

dotenv.config({ path: envPath });
_log('STEP 4: .env loaded from: ' + envPath);

const http = require('http');
const { spawn } = require('child_process');

// Disable hardware acceleration — prevents silent GPU crash on machines
// with older/integrated graphics drivers (common cause of "app doesn't open").
// Must be called before app.whenReady().
_log('STEP 5: disabling hardware acceleration');
app.disableHardwareAcceleration();
_log('STEP 6: hardware acceleration disabled');

let mainWindow;
let lastHeartbeatTime = 0;
let loginRequestActive = false;
let localServer = null;

// Safe crash logger — uses a temp path before app is ready, userData path after
function getCrashLogPath() {
    try { return path.join(app.getPath('userData'), 'crash_log.txt'); } catch(e) {}
    try { return path.join(require('os').tmpdir(), 'syncmind_crash_log.txt'); } catch(e) {}
    return null;
}

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    try {
        const logPath = getCrashLogPath();
        if (logPath) fs.appendFileSync(logPath, `[${new Date().toISOString()}] UNCAUGHT EXCEPTION: ${err.stack || err}\n`);
    } catch(e){}
});

process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED REJECTION:', reason);
    try {
        const logPath = getCrashLogPath();
        if (logPath) fs.appendFileSync(logPath, `[${new Date().toISOString()}] UNHANDLED REJECTION: ${reason}\n`);
    } catch(e){}
});

// Start a tiny local HTTP server on port 5185 for communicating with already open web pages
function startLocalServer() {
    localServer = http.createServer((req, res) => {
        // Enable CORS for localhost web app
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        try {
            const parsedUrl = new URL(req.url, 'http://localhost');
            if (parsedUrl.pathname === '/heartbeat') {
                lastHeartbeatTime = Date.now();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'ok', 
                    loginRequested: loginRequestActive 
                }));
                
                // Reset flag once consumed by the web client
                if (loginRequestActive) {
                    loginRequestActive = false;
                }
                return;
            }
        } catch (err) {
            console.error('[LOCAL SERVER ERROR]', err);
        }

        res.writeHead(404);
        res.end();
    });

    localServer.on('error', (err) => {
        console.error('[LOCAL SERVER] Failed to start:', err.message);
        try {
            fs.appendFileSync(path.join(app.getPath('userData'), 'crash_log.txt'), `[${new Date().toISOString()}] LOCAL SERVER ERROR: ${err.message}\n`);
        } catch (e) {}
    });

    localServer.listen(5185, '127.0.0.1', () => {
        console.log('[LOCAL SERVER] Running on http://127.0.0.1:5185');
    });
}

// Meeting Logger Path — computed lazily after app is ready to avoid pre-ready crash
let logFilePath = null;
function getLogFilePath() {
    if (!logFilePath) logFilePath = path.join(app.getPath('userData'), 'meeting_log.txt');
    return logFilePath;
}

ipcMain.handle('get-whisper-mode', () => false);

let globalAuthToken = "";
let meetingStartTime = null;

ipcMain.handle('get-web-app-url', () => {
    return process.env.VITE_WEB_APP_URL || 'https://sync-mind.vercel.app';
});

ipcMain.handle('open-external', (event, url) => {
    // If a heartbeat was received recently, the website is open. Signal it to log in.
    if (Date.now() - lastHeartbeatTime < 3000) {
        console.log('[LOCAL SERVER] Existing web tab detected. Directing to login in-place.');
        loginRequestActive = true;
        return true;
    }
    
    // Otherwise open a new browser window/tab
    console.log('[LOCAL SERVER] No active web tab detected. Opening new browser tab.');
    return shell.openExternal(url);
});

ipcMain.on("set-auth-token", (e, token) => {
    globalAuthToken = token;
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false, // Prevent white flash — window is shown after ready-to-show
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload/preload.js'),
        },
        frame: true,
        transparent: false,
        alwaysOnTop: false,
    });

    // Show window only after content is painted — with 5s fallback
    // so window always appears even if ready-to-show never fires
    let windowShown = false;
    const showWindow = () => {
        if (!windowShown && mainWindow) {
            windowShown = true;
            mainWindow.show();
        }
    };
    mainWindow.once('ready-to-show', showWindow);
    setTimeout(showWindow, 5000); // Fallback: force-show after 5 seconds

    mainWindow.on('closed', () => {
        mainWindow = null;
        globalAuthToken = "";
    });

    // Load Vite dev server if in development, else load local file
    const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
    if (isDev) {
        mainWindow.loadURL('http://localhost:5180');
        mainWindow.webContents.openDevTools();
    } else {
        // Use app.getAppPath() instead of __dirname to correctly resolve
        // inside ASAR-packaged builds where __dirname is inside the archive
        mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));
    }
}

// ----------------------------------------------------
// DEEP LINKING: Custom Protocol Handler (syncmind://)
// ----------------------------------------------------
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('syncmind', process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient('syncmind');
}

const handleDeepLink = (url) => {
    console.log('[DEEP LINK] Received URL:', url);
    if (!url || url.startsWith('--')) return;
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol === 'syncmind:' && parsedUrl.hostname === 'auth') {
            const token = parsedUrl.searchParams.get('token');
            const refreshToken = parsedUrl.searchParams.get('refreshToken') || '';
            const apiKey = parsedUrl.searchParams.get('apiKey') || '';
            
            if (token) {
                console.log('[DEEP LINK] Token and metadata extracted successfully.');
                globalAuthToken = token;
                if (mainWindow) {
                    if (mainWindow.isMinimized()) mainWindow.restore();
                    mainWindow.focus();
                    mainWindow.webContents.send('auth-token-received', { token, refreshToken, apiKey });
                }
            }
        }
    } catch (err) {
        console.error('[DEEP LINK] Failed to parse deep link:', err);
    }
};

_log('STEP 7: requesting single instance lock');
const gotTheLock = app.requestSingleInstanceLock();
_log('STEP 8: gotTheLock = ' + gotTheLock);
if (!gotTheLock) {
    _log('STEP 8a: another instance running, quitting');
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
        // Windows deep linking
        const url = commandLine.pop();
        handleDeepLink(url);
    });

    _log('STEP 9: waiting for app.whenReady');
    app.whenReady().then(() => {
        _log('STEP 10: app ready, calling createWindow');
        createWindow();
        _log('STEP 11: createWindow done, starting local server');
        startLocalServer();
        _log('STEP 12: local server started');

        // macOS deep linking (app is already running)
        app.on('open-url', (event, url) => {
            event.preventDefault();
            handleDeepLink(url);
        });

    // CRASH DIAGNOSTIC: Log renderer crash reason to main process terminal
    app.on('render-process-gone', (event, webContents, details) => {
        console.error('[MAIN CRASH DIAGNOSTIC] render-process-gone:', {
            reason: details.reason,
            exitCode: details.exitCode
        });
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
} // <-- ADDED THIS BRACE

app.on('window-all-closed', () => {
    if (localServer) {
        localServer.close();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

let audioBuffer = [];
let sampleRate = 16000;

let totalChunksReceived = 0;

// Audio Stream IPC
ipcMain.on('start-audio', (event) => {
    meetingStartTime = Date.now();
    audioBuffer = [];
    totalChunksReceived = 0;
    console.log("[AUDIO MAIN] recording started");
    mainWindow.webContents.send('audio-status', 'started');
});

ipcMain.on('audio-chunk', (event, payload) => {
    if (!payload || !payload.data) {
        console.warn("[AUDIO MAIN] Received empty audio-chunk payload");
        return;
    }

    if (payload.isTest) {
        console.log("[AUDIO MAIN] SUCCESS! Received synthetic test chunk from frontend over IPC.");
        return;
    }

    if (payload.sampleRate && payload.sampleRate !== sampleRate) {
        sampleRate = payload.sampleRate;
        console.log(`[AUDIO MAIN] Updated sampleRate to ${sampleRate}`);
    }

    totalChunksReceived++;
    if (totalChunksReceived % 100 === 0) {
        console.log(`[AUDIO MAIN] Received ${totalChunksReceived} chunks. Latest length: ${payload.data.length}`);
    }

    try {
        // Renderer now sends a plain Array of numbers (copied from Float32Array).
        // Reconstruct Float32Array from the plain array, then get its raw buffer.
        const float32 = new Float32Array(payload.data);
        const chunkBuffer = Buffer.from(float32.buffer);
        audioBuffer.push(chunkBuffer);
    } catch (err) {
        console.error("[AUDIO MAIN] Error buffering audio chunk:", err);
    }
});

async function uploadToS3(filePath, fileName) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const apiEndpoint = process.env.VITE_API_URL;
        if (!apiEndpoint) {
            console.error('[UPLOAD] VITE_API_URL is not set in .env file. Aborting upload.');
            if (mainWindow) mainWindow.webContents.send('upload-status', { status: 'error', message: 'API URL not configured. Check .env file.' });
            return;
        }
        
        console.log(`[UPLOAD] Requesting Presigned URL from ${apiEndpoint}...`);
        if (mainWindow) {
            mainWindow.webContents.send('upload-status', { status: 'requesting', message: 'Securing upload slot from cloud...' });
        }
        
        // 1. Get Presigned URL from API Gateway
        const presignResponse = await global.fetch(`${apiEndpoint}?action=getPresignedUrl&fileName=${encodeURIComponent(fileName)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${globalAuthToken}`
            }
        });

        if (!presignResponse.ok) {
            throw new Error(`Failed to get presigned URL: ${presignResponse.status} ${presignResponse.statusText}`);
        }

        const data = await presignResponse.json();
        const presignedUrl = data.uploadUrl;

        if (!presignedUrl) {
            throw new Error("API did not return a valid presigned URL.");
        }

        console.log(`[UPLOAD] Received Presigned URL. Uploading audio securely to S3...`);
        if (mainWindow) {
            mainWindow.webContents.send('upload-status', { status: 'uploading', message: 'Uploading audio to AWS S3 securely...' });
        }
        
        // 2. Upload file directly to S3 using the Presigned URL
        const uploadResponse = await global.fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'audio/wav'
            },
            body: fileBuffer
        });

        if (!uploadResponse.ok) {
            throw new Error(`Failed to upload to S3: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }

        console.log("[UPLOAD] completed successfully");
        if (mainWindow) {
            mainWindow.webContents.send('upload-status', { status: 'success', message: 'Upload complete! Cloud processing started...' });
        }

        if (app.isPackaged) {
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Upload Success',
                message: `Successfully uploaded ${fileName}!`
            });
        }
        return true;
    } catch (err) {
        console.error("[UPLOAD ERROR] Failed to upload audio:", err);
        if (mainWindow) {
            mainWindow.webContents.send('upload-status', { status: 'error', message: `Upload failed: ${err.message}` });
        }
        if (app.isPackaged) {
            dialog.showErrorBox("Upload Failed", `Error: ${err.message}\n\nMake sure you are logged in and have an active internet connection.`);
        }
        return false;
    }
}

function writeWavHeader(buffer, sampleRate, numChannels, byteRate) {
    const header = Buffer.alloc(44);
    // RIFF identifier
    header.write('RIFF', 0);
    // file length minus RIFF identifier length and file description length
    header.writeUInt32LE(36 + buffer.length, 4);
    // RIFF type
    header.write('WAVE', 8);
    // format chunk identifier
    header.write('fmt ', 12);
    // format chunk length
    header.writeUInt32LE(16, 16);
    // sample format (raw)
    header.writeUInt16LE(1, 20);
    // channel count
    header.writeUInt16LE(numChannels, 22);
    // sample rate
    header.writeUInt32LE(sampleRate, 24);
    // byte rate (sample rate * block align)
    header.writeUInt32LE(byteRate, 28);
    // block align (channel count * bytes per sample)
    header.writeUInt16LE(numChannels * 2, 32);
    // bits per sample
    header.writeUInt16LE(16, 34);
    // data chunk identifier
    header.write('data', 36);
    // data chunk length
    header.writeUInt32LE(buffer.length, 40);

    return Buffer.concat([header, buffer]);
}

let isProcessingAudio = false;

ipcMain.on('stop-audio', async (event) => {
    if (isProcessingAudio) return;
    isProcessingAudio = true;

    console.log("[AUDIO MAIN] recording stopped");
    mainWindow.webContents.send('audio-status', 'stopped');

    if (audioBuffer.length === 0) {
        console.log("[AUDIO MAIN] No audio data to save.");
        isProcessingAudio = false;
        return;
    }

    console.log(`[AUDIO MAIN] Processing ${audioBuffer.length} PCM chunks...`);

    const combinedBuffer = Buffer.concat(audioBuffer);
    // Use the stored sampleRate from the renderer
    const actualSampleRate = sampleRate || 48000;

    // Node.js Buffers are Uint8Arrays that can be views into shared pool ArrayBuffers.
    // Creating a fresh Uint8Array guarantees a new, perfectly aligned and isolated ArrayBuffer
    // that does not contain any garbage data from the Node.js buffer allocation pool.
    const alignedBuffer = new Uint8Array(combinedBuffer).buffer;
    const float32Array = new Float32Array(alignedBuffer);

    console.log(`[AUDIO MAIN] Converting ${float32Array.length} samples to Int16...`);

    // Convert to Int16 PCM
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    const pcmBuffer = Buffer.from(pcm16.buffer);
    const numChannels = 1;
    const byteRate = actualSampleRate * numChannels * 2;

    const wavBuffer = writeWavHeader(pcmBuffer, actualSampleRate, numChannels, byteRate);

    const timestamp = Date.now();
    const fileName = `meeting-${timestamp}.wav`;
    const filePath = path.join(app.getPath('userData'), fileName);

    fs.writeFileSync(filePath, wavBuffer);
    console.log(`[AUDIO MAIN] audio recording complete: Saved to ${filePath}`);

    audioBuffer = [];

    const uploaded = await uploadToS3(filePath, fileName);

    if (uploaded) {
        console.log("[AUDIO MAIN] Upload successful. S3 Trigger will automatically start the transcription process.");
    }

    isProcessingAudio = false;
});



// ipcMain.on('ocr-caption-detected', (event, text) => {
//     console.log("MAIN PROCESS RECEIVED OCR:", text);
//     if (transcriptManager) {
//         transcriptManager.addScraperText(text);
//     }
// });

let isFloating = false;

ipcMain.handle('toggle-floating-mode', () => {
    if (!mainWindow) return false;

    isFloating = !isFloating;

    if (isFloating) {
        // For transparent, it usually requires a restart or the window to be created with transparent: true
        // However, on Windows/macOS we can do this dynamically or just simulate it
        mainWindow.setAlwaysOnTop(true, 'floating');

        // We can't dynamically change 'frame' and 'transparent' easily in Electron without recreating the window,
        // so let's check what happens. Wait, we can't change 'frame' dynamically on Windows.
        // Let me recreate the window or just stick to 'alwaysOnTop' and bounds change for this demo?
        // Actually, setting bounds and always on top is the core, and frameless can be default if needed.
        // Wait! Let's just create a new window OR we can make it frameless initially and draw our own title bar.
        // For now, let's just make it always on top and smaller.
        mainWindow.setBounds({ width: 400, height: 600 });
    } else {
        mainWindow.setAlwaysOnTop(false);
        mainWindow.setBounds({ width: 900, height: 700 });
    }

    return isFloating;
});

ipcMain.handle('send-transcript', async (event, data) => {
    try {
        // Use the API URL from .env — never hardcode endpoints
        const endpoint = process.env.VITE_API_URL;

        // In a real scenario, this Axios request happens here:
        // const response = await axios.post(endpoint, { transcript: data });
        // return response.data;

        // Simulating response matching the Data Contract:
        console.log('Received transcript in Main process, simulating AWS call...', data);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    id: "msg_12345",
                    summary: "This was a discussion about the upcoming launch of the Silent Teammate MVP. The team aligned on completing the Electron scaffold by Friday.",
                    tasks: [
                        { title: "Complete Electron Setup", owner: "John", deadline: "Friday", status: "In Progress" },
                        { title: "Finalize AWS endpoint", owner: "Sarah", deadline: "Next Tuesday", status: "Pending" }
                    ],
                    risks: [
                        { description: "API Gateway rate limits might be hit", severity: "High", relatedTask: "Finalize AWS endpoint" }
                    ]
                });
            }, 1500);
        });
    } catch (error) {
        console.error('Error sending transcript to API Gateway:', error);
        throw error;
    }
});

// Meeting Log file IPC
ipcMain.on('save-log', (event, text) => {
    try {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${text}\n`;
        fs.appendFileSync(getLogFilePath(), logEntry);
    } catch (err) {
        console.error('Failed to write to meeting log:', err);
    }
});

// Screen Capture Sources
ipcMain.handle('get-desktop-sources', async (event, options) => {
    const captureOptions = options || { types: ['screen'] };
    const sources = await desktopCapturer.getSources(captureOptions);
    return sources.map(source => ({
        id: source.id,
        name: source.name,
        thumbnail: source.thumbnail.toDataURL()
    }));
});

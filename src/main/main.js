const { app, BrowserWindow, BrowserView, ipcMain, desktopCapturer, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables based on environment
const envPath = app.isPackaged
    ? path.join(process.resourcesPath, '.env')
    : path.resolve(app.getAppPath(), '.env');

dotenv.config({ path: envPath });

const { spawn } = require('child_process');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

let mainWindow;

// Meeting Logger Path
const logFilePath = path.join(app.getPath('userData'), 'meeting_log.txt');

ipcMain.handle('get-whisper-mode', () => false);

let globalAuthToken = "";
let meetingStartTime = null;

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

    // Show window only after content is painted to prevent white screen flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Load Vite dev server if in development, else load local file
    const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // Use app.getAppPath() instead of __dirname to correctly resolve
        // inside ASAR-packaged builds where __dirname is inside the archive
        mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

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

app.on('window-all-closed', () => {
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
    const s3Client = new S3Client({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
    const bucketName = process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET || "syncmind-meeting-audio";

    try {
        console.log(`[S3 DEBUG] Checking credentials... Has AccessKey: ${!!process.env.AWS_ACCESS_KEY_ID}, Has SecretKey: ${!!process.env.AWS_SECRET_ACCESS_KEY}, Region: ${process.env.AWS_REGION}`);

        const fileBuffer = fs.readFileSync(filePath);
        const uploadParams = {
            Bucket: bucketName,
            Key: `Audio/${fileName}`,
            Body: fileBuffer,
            ContentType: 'audio/wav'
        };

        console.log(`[S3 UPLOAD] started: Uploading ${fileName} to ${bucketName}...`);
        await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("[S3 UPLOAD] completed");

        // Show success dialog in production
        if (app.isPackaged) {
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Upload Success',
                message: `Successfully uploaded ${fileName} to S3!`
            });
        }
        return true;
    } catch (err) {
        console.error("[S3 UPLOAD ERROR] Failed to upload audio:", err);

        // Show error dialog in production
        if (app.isPackaged) {
            dialog.showErrorBox("S3 Upload Failed", `Error: ${err.message}\n\nCheck if AWS keys are valid and internet is connected.`);
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

    // combinedBuffer contains raw bytes of Float32 samples
    const float32Array = new Float32Array(
        combinedBuffer.buffer,
        combinedBuffer.byteOffset,
        combinedBuffer.length / Float32Array.BYTES_PER_ELEMENT
    );

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
        // Trigger Next.js API
        const apiEndpoint = process.env.NEXTJS_API_ENDPOINT || 'http://localhost:3001/api/process-meeting';
        console.log(`[API] Triggering backend API: ${apiEndpoint} for ${fileName}`);

        let attempts = 0;
        let success = false;

        while (attempts < 3 && !success) {
            try {
                // We use standard fetch available in Node.js 18+ (Electron 29 supports global fetch)
                const response = await global.fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${globalAuthToken}`
                    },
                    body: JSON.stringify({ audioFileName: fileName })
                });

                if (!response.ok) {
                    console.error(`[API ERROR] Backend responded with status: ${response.status}`);
                    break; // If it responded but with an error status (e.g. 500), no point retrying connection
                } else {
                    console.log("[API] backend triggered");
                    success = true;
                }
            } catch (err) {
                attempts++;
                console.error(`[API ERROR] Backend unavailable. Retrying in 2 seconds... (Attempt ${attempts}/3)`);
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        if (!success) {
            console.error("[API ERROR] Failed to trigger backend after retries.");
        }
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
        // Placeholder AWS API Gateway endpoint
        const endpoint = 'https://placeholder.execute-api.us-east-1.amazonaws.com/dev/process';

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
        fs.appendFileSync(logFilePath, logEntry);
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

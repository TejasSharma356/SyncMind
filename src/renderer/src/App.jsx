import React, { useState, useEffect, useRef } from 'react';

// Secure preload bridge — no more window.require('electron')
const api = window.api || null;

// Crash Diagnostic Addition
window.onerror = function (message, source, lineno, colno, error) {
    console.error("FATAL CRASH [window.onerror]:", { message, source, lineno, colno, error });
    return false;
};

window.addEventListener('unhandledrejection', function (event) {
    console.error("FATAL CRASH [unhandledrejection]:", event.reason);
});

function App() {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState('');
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');
    const [isFloating, setIsFloating] = useState(false);
    const [useAWS, setUseAWS] = useState(false);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('syncmind_auth_token') || '');

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const transcriptEndRef = useRef(null);

    // Audio Refs
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const processorRef = useRef(null);

    useEffect(() => {
        fetchSources();

        if (api) {
            api.getWhisperMode().then(mode => setUseAWS(!mode));
            api.onTranscriptUpdated((text) => {
                setLiveTranscript(text);
            });
        }

        return () => {
            stopMonitoring();
        };
    }, []);

    useEffect(() => {
        if (transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [liveTranscript]);

    const fetchSources = async () => {
        if (api) {
            try {
                const desktopSources = await api.getDesktopSources();
                setSources(desktopSources);
                if (desktopSources.length > 0) setSelectedSource(desktopSources[0].id);
            } catch (err) {
                console.error("Failed to fetch sources via IPC:", err);
            }
        } else {
            console.error("api bridge is not available. Check preload.js configuration.");
        }
    };

    const toggleFloatingMode = async () => {
        if (api) {
            const mode = await api.toggleFloatingMode();
            setIsFloating(mode);
        }
    };

    const toggleEngine = async () => {
        if (api && !isMonitoring) {
            const nextMode = !useAWS;
            setUseAWS(nextMode);
            api.toggleTranscriptionMode(nextMode);
        }
    };

    const handleAuthTokenChange = (e) => {
        const val = e.target.value;
        setAuthToken(val);
        localStorage.setItem('syncmind_auth_token', val);
        if (api) {
            api.setAuthToken(val);
        }
    };

    const startMonitoring = async () => {
        console.log('[CAPTURE] Start Capture clicked');

        setIsMonitoring(true);
        setLiveTranscript("");

        let stream;
        try {
            if (!selectedSource) {
                throw new Error("No desktop source selected to capture");
            }
            console.log(`[AUDIO] Attempting Desktop capture for source: ${selectedSource}`);

            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: selectedSource
                    }
                },
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: selectedSource
                    }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            console.log("[AUDIO] Capture device initialized (Desktop)");
        } catch (err) {
            console.warn("[AUDIO] Desktop capture failed, falling back to Microphone:", err);
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                console.log("[AUDIO] Capture device initialized (Microphone)");
            } catch (fallbackErr) {
                console.error("[AUDIO] FAIL: Both Desktop and Microphone capture failed:", fallbackErr);
                setIsMonitoring(false);
                return;
            }
        }

        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length === 0) {
            console.error("[AUDIO ERROR] No audio tracks found in the captured stream! The S3 upload will be empty.");
            // You might want to show a UI alert here in the future
        } else {
            const track = audioTracks[0];
            console.log(`[AUDIO] Captured stream has ${audioTracks.length} audio track(s).`);
            console.log(`[AUDIO] Track label: ${track.label}`);
            console.log("Audio track settings:", track.getSettings());
            console.log("Track enabled:", track.enabled);
            console.log("Track muted:", track.muted);
            console.log("Track readyState:", track.readyState);
        }

        streamRef.current = stream;
        stream.getTracks().forEach(track => {
            track.onended = () => {
                console.log("[AUDIO] Capture ended via system UI");
                stopMonitoring();
            };
        });

        // Create an audio-only stream for the recorder to prevent DOMExceptions
        // when trying to record a video track into an audio/webm container
        const audioStream = new MediaStream(stream.getAudioTracks());

        // PCM Streaming setup (to support WAV format)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("[AUDIO] AudioContext sampleRate:", audioContext.sampleRate);

        // Ensure AudioContext is running (required by some Chrome versions/packaged builds)
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
            console.log("[AUDIO] AudioContext resumed");
        }

        const audioSource = audioContext.createMediaStreamSource(audioStream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        let rendererChunks = 0;

        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            rendererChunks++;

            // Log a few samples to verify audio is not silent here
            if (rendererChunks % 100 === 0) {
                console.log(`[RENDERER] Chunk ${rendererChunks} PCM preview:`, inputData.slice(0, 5));
            }

            // Send copied PCM data to main process via IPC
            if (api) {
                // CRITICAL: Copy the Float32Array into a plain Array before sending.
                // inputData is a live reference to the AudioBuffer's internal memory,
                // which gets reused/zeroed on the next onaudioprocess callback.
                // In packaged builds, IPC serialization can be deferred, causing
                // the buffer to be overwritten before it's cloned — producing silence.
                const dataCopy = Array.from(inputData);
                api.sendAudioChunk({
                    data: dataCopy,
                    sampleRate: audioContext.sampleRate
                });
            }
        };

        // Connect nodes
        audioSource.connect(processor);
        processor.connect(audioContext.destination);

        processorRef.current = {
            stop: () => {
                processor.disconnect();
                audioSource.disconnect();
                audioContext.close();
            }
        };

        if (api) {
            api.setAuthToken(authToken); // Ensure main process has the latest token
            console.log("[AUDIO] recording started (PCM/WAV)");
            api.startAudio();

            // SYNTHETIC IPC TEST
            console.log("[AUDIO FRONTEND] Sending synthetic test chunk over IPC...");
            api.sendAudioChunk({ data: [0, 0, 0, 0], isTest: true });
        }
    };

    const stopMonitoring = () => {
        setIsMonitoring(false);

        // Stop AV Streams
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        // Stop PCM Stream
        if (processorRef.current) {
            try {
                processorRef.current.stop();
            } catch (err) {
                console.error("[AUDIO FRONTEND] Error stopping processor:", err);
            }
        }

        if (api) {
            console.log("[AUDIO FRONTEND] recording stopped, calling api.stopAudio()...");
            try {
                api.stopAudio();
                console.log("[AUDIO FRONTEND] api.stopAudio() called successfully");
            } catch (err) {
                console.error("[AUDIO FRONTEND ERROR] api.stopAudio() failed:", err);
            }
        }
    };

    return (
        <div className={`p-4 h-screen flex flex-col gap-4 ${isFloating ? 'bg-black/90 backdrop-blur border border-white/20' : 'bg-background'}`}>

            {/* Header controls */}
            <div className="flex justify-between items-center drag-region">
                <h1 className="font-bold text-lg text-text px-2">Silent Teammate <span className="text-primary text-xs uppercase ml-2">Recorder Mode</span></h1>
                <div className="no-drag-region flex gap-2">
                    <button
                        className={`text-xs px-3 py-1 rounded no-drag-region transition-colors ${isMonitoring ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'} ${useAWS ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50' : 'bg-green-600/30 text-green-400 border border-green-500/50'}`}
                        onClick={toggleEngine}
                        disabled={isMonitoring}
                        title="Switch Transcription Engine"
                    >
                        {useAWS ? 'Use Whisper' : 'Use AWS'}
                    </button>
                    <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded" onClick={toggleFloatingMode}>Toggle Popout</button>
                </div>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Paste Auth Token here"
                    value={authToken}
                    onChange={handleAuthTokenChange}
                    disabled={isMonitoring}
                    className="flex-1 max-w-[200px] bg-surface border border-white/20 hover:border-white/40 rounded px-2 py-1 text-sm text-text outline-none focus:border-primary"
                />

                <select
                    className="flex-1 bg-surface border border-white/10 rounded px-2 py-1 text-sm text-text"
                    value={selectedSource}
                    onChange={e => setSelectedSource(e.target.value)}
                    disabled={isMonitoring}
                >
                    {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                {!isMonitoring ? (
                    <button onClick={startMonitoring} className="bg-primary hover:bg-primary/90 text-white px-4 py-1 rounded text-sm font-medium">Start Capture</button>
                ) : (
                    <button onClick={stopMonitoring} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm font-medium">Stop</button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
                {/* Video Preview */}
                <div className="flex-1 bg-black border border-white/10 rounded overflow-hidden relative group">
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-contain pointer-events-none" />
                </div>

                {/* Transcript Panel */}
                <div className="flex-1 bg-surface border border-white/10 rounded flex flex-col p-4 overflow-hidden shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Meeting Transcript</h2>
                        <span className={`text-[10px] px-2 py-1 rounded text-white font-medium ${useAWS ? 'bg-green-600' : 'bg-blue-600'}`}>
                            {useAWS ? 'AWS Transcribe Mode' : 'Local Whisper Mode'}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto text-base text-text/90 p-4 bg-black/30 rounded flex flex-col gap-2 relative">
                        {liveTranscript ? (
                            <div className="whitespace-pre-wrap leading-relaxed">{liveTranscript}</div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted italic">
                                {isMonitoring ? "Listening..." : "Click Start Capture to begin"}
                            </div>
                        )}
                        <div ref={transcriptEndRef} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default App;

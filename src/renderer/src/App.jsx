import React, { useState, useEffect, useRef } from 'react';

// Secure preload bridge — no more window.require('electron')
const api = window.api || null;

function decodeJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.warn("Failed to decode token as JWT:", e);
        return null;
    }
}

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
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem('syncmind_auth_token') || '');
    const [user, setUser] = useState(() => decodeJwt(sessionStorage.getItem('syncmind_auth_token') || ''));
    const [uploadStatus, setUploadStatus] = useState(null); // { status: '...', message: '...' }
    
    // Dropdown and settings states
    const [showDropdown, setShowDropdown] = useState(false);
    const [micDevices, setMicDevices] = useState([]);
    const [selectedMicId, setSelectedMicId] = useState(() => localStorage.getItem('syncmind_selected_mic_id') || 'default');
    const [selectedFrameRate, setSelectedFrameRate] = useState(() => parseInt(localStorage.getItem('syncmind_frame_rate') || '30'));
    const dropdownRef = useRef(null);

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const transcriptEndRef = useRef(null);

    // Audio Refs
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const processorRef = useRef(null);

    // Sync user state when token changes
    useEffect(() => {
        if (authToken) {
            const decoded = decodeJwt(authToken);
            setUser(decoded);
        } else {
            setUser(null);
        }
    }, [authToken]);

    // Handle click outside of dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load available microphone devices
    useEffect(() => {
        const loadMics = async () => {
            try {
                // Request temporary permission to list full labels (standard browser security)
                await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
                const devices = await navigator.mediaDevices.enumerateDevices();
                const mics = devices.filter(d => d.kind === 'audioinput');
                setMicDevices(mics);
            } catch (err) {
                console.warn("Failed to load microphone devices:", err);
            }
        };
        loadMics();
    }, []);

    // Session auto-refresher definition
    const refreshAuthToken = async () => {
        const refreshToken = sessionStorage.getItem('syncmind_refresh_token');
        const apiKey = sessionStorage.getItem('syncmind_firebase_api_key');
        if (!refreshToken || !apiKey) {
            console.warn("[AUTH] Cannot refresh token: missing refresh token or api key");
            return null;
        }

        try {
            console.log("[AUTH] Refreshing Firebase auth token...");
            const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                })
            });

            if (response.ok) {
                const resData = await response.json();
                const newToken = resData.id_token;
                const newRefreshToken = resData.refresh_token;

                setAuthToken(newToken);
                sessionStorage.setItem('syncmind_auth_token', newToken);
                if (newRefreshToken) {
                    sessionStorage.setItem('syncmind_refresh_token', newRefreshToken);
                }
                if (api) api.setAuthToken(newToken);
                console.log("[AUTH] Token refreshed successfully.");
                return newToken;
            } else {
                console.error("[AUTH] Failed to refresh token. Status:", response.status);
            }
        } catch (err) {
            console.error("[AUTH] Error refreshing token:", err);
        }
        return null;
    };

    // Check token expiration on load and setup background refresh interval (every 45 mins)
    useEffect(() => {
        const initialToken = sessionStorage.getItem('syncmind_auth_token') || '';
        if (initialToken) {
            const decoded = decodeJwt(initialToken);
            if (decoded && decoded.exp) {
                const expiryMs = decoded.exp * 1000;
                const isExpired = Date.now() >= expiryMs - 5 * 60 * 1000; // expired, or expires in less than 5 mins
                if (isExpired) {
                    refreshAuthToken();
                }
            }
        }
        
        const interval = setInterval(() => {
            if (sessionStorage.getItem('syncmind_refresh_token')) {
                refreshAuthToken();
            }
        }, 45 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchSources();

        if (api) {
            api.getWhisperMode().then(mode => setUseAWS(!mode));
            api.onTranscriptUpdated((text) => {
                setLiveTranscript(text);
            });
            api.onUploadStatus((status) => {
                setUploadStatus(status);
                // Auto-fade success messages after 5 seconds
                if (status.status === 'success') {
                    setTimeout(() => {
                        setUploadStatus(prev => prev && prev.status === 'success' ? null : prev);
                    }, 5000);
                }
            });
            
            // Fix: Send initial auth token from sessionStorage to main process
            const initialToken = sessionStorage.getItem('syncmind_auth_token') || '';
            if (initialToken) {
                api.setAuthToken(initialToken);
            }

            api.onAuthTokenReceived((data) => {
                console.log("[FRONTEND] Received Auth Token Payload from Deep Link!");
                let token = "";
                let refreshToken = "";
                let apiKey = "";

                if (data && typeof data === 'object') {
                    token = data.token;
                    refreshToken = data.refreshToken;
                    apiKey = data.apiKey;
                } else {
                    token = data;
                }

                setAuthToken(token);
                sessionStorage.setItem('syncmind_auth_token', token);
                
                if (refreshToken) {
                    sessionStorage.setItem('syncmind_refresh_token', refreshToken);
                }
                if (apiKey) {
                    sessionStorage.setItem('syncmind_firebase_api_key', apiKey);
                }

                api.setAuthToken(token);
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

    const handleLoginViaWeb = () => {
        if (api) {
            const webAppUrl = api.getWebAppUrl();
            api.openExternal(`${webAppUrl}/?source=desktop`);
        }
    };

    const handleLogout = () => {
        setAuthToken('');
        sessionStorage.removeItem('syncmind_auth_token');
        sessionStorage.removeItem('syncmind_refresh_token');
        sessionStorage.removeItem('syncmind_firebase_api_key');
        if (api) api.setAuthToken('');
    };

    const [micStreamRef, setMicStreamRef] = useState(null); // Keep track of mic stream to stop it later

    const startMonitoring = async () => {
        console.log('[CAPTURE] Start Capture clicked');

        setIsMonitoring(true);
        setLiveTranscript("");

        let desktopStream;
        let micStream;

        try {
            if (!selectedSource) {
                throw new Error("No desktop source selected to capture");
            }
            console.log(`[AUDIO] Attempting Desktop capture for source: ${selectedSource}`);

            desktopStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: selectedSource
                    }
                },
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: selectedSource,
                        maxFrameRate: selectedFrameRate
                    }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = desktopStream;
            }

            console.log(`[AUDIO] Capture device initialized (Desktop) at ${selectedFrameRate} FPS`);
        } catch (err) {
            console.warn("[AUDIO] Desktop capture failed:", err);
            setIsMonitoring(false);
            return;
        }

        // Try to get the microphone stream so we capture BOTH sides of the conversation
        try {
            const micConstraints = {
                audio: selectedMicId === 'default' ? true : { exact: selectedMicId },
                video: false
            };
            micStream = await navigator.mediaDevices.getUserMedia(micConstraints);
            console.log("[AUDIO] Microphone capture initialized with device:", selectedMicId);
        } catch (err) {
            console.warn("[AUDIO] Microphone capture failed (will only record desktop audio):", err);
        }

        streamRef.current = desktopStream;
        setMicStreamRef(micStream);

        desktopStream.getTracks().forEach(track => {
            track.onended = () => {
                console.log("[AUDIO] Capture ended via system UI");
                stopMonitoring();
            };
        });

        // PCM Streaming setup (to support WAV format)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("[AUDIO] AudioContext sampleRate:", audioContext.sampleRate);

        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        // Create sources for both streams
        const desktopAudioSource = audioContext.createMediaStreamSource(new MediaStream(desktopStream.getAudioTracks()));
        
        let micAudioSource = null;
        if (micStream && micStream.getAudioTracks().length > 0) {
            micAudioSource = audioContext.createMediaStreamSource(new MediaStream(micStream.getAudioTracks()));
        }

        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        let rendererChunks = 0;

        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            rendererChunks++;

            if (api) {
                const dataCopy = Array.from(inputData);
                api.sendAudioChunk({
                    data: dataCopy,
                    sampleRate: audioContext.sampleRate
                });
            }
        };

        // Mix both sources into the processor
        desktopAudioSource.connect(processor);
        if (micAudioSource) {
            micAudioSource.connect(processor);
        }

        // Connect processor to destination through a silent GainNode to prevent feedback loops/echo
        const silentGain = audioContext.createGain();
        silentGain.gain.value = 0;
        processor.connect(silentGain);
        silentGain.connect(audioContext.destination);

        processorRef.current = {
            stop: () => {
                processor.disconnect();
                silentGain.disconnect();
                desktopAudioSource.disconnect();
                if (micAudioSource) micAudioSource.disconnect();
                audioContext.close();
            }
        };

        if (api) {
            api.setAuthToken(authToken); // Ensure main process has the latest token
            console.log("[AUDIO] recording started (PCM/WAV mixed)");
            api.startAudio();
            api.sendAudioChunk({ data: [0, 0, 0, 0], isTest: true });
        }
    };

    const stopMonitoring = () => {
        setIsMonitoring(false);

        // Stop AV Streams
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        // Stop Mic Stream
        setMicStreamRef(prevMic => {
            if (prevMic) {
                prevMic.getTracks().forEach(track => track.stop());
            }
            return null;
        });

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
            } catch (err) {
                console.error("[AUDIO FRONTEND ERROR] api.stopAudio() failed:", err);
            }
        }
    };

    if (!authToken) {
        return (
            <div className="p-8 h-screen flex flex-col items-center justify-center bg-black text-white gap-6 text-center drag-region relative">
                <div className="absolute top-4 right-4 no-drag-region">
                     <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors" onClick={toggleFloatingMode}>Toggle Popout</button>
                </div>
                <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/50 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome to <span className="text-blue-400">Silent Teammate</span></h1>
                <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                    Log in securely via your web dashboard to start recording and generating AI insights for your meetings.
                </p>
                <button 
                    onClick={handleLoginViaWeb}
                    className="no-drag-region mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-3 group"
                >
                    Login to Continue
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div className={`p-4 h-screen flex flex-col ${isFloating ? 'bg-black/90 backdrop-blur border border-white/20' : 'bg-background'}`}>

            {/* Header controls */}
            <div className="flex justify-between items-center drag-region mb-4 relative z-50">
                <h1 className="font-bold text-lg text-text px-2 flex items-center gap-2">
                    Silent Teammate 
                    <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">Recorder</span>
                </h1>
                
                <div className="no-drag-region flex items-center gap-3" ref={dropdownRef}>
                    {/* Cloud/Local Active Status Badge */}
                    <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-xs text-muted">
                        <div className={`w-1.5 h-1.5 rounded-full ${useAWS ? 'bg-blue-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></div>
                        <span>{useAWS ? 'AWS Cloud Engine' : 'Whisper Local Engine'}</span>
                    </div>

                    {/* Premium Profile Dropdown Trigger */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-10 h-10 rounded-full overflow-hidden border border-white/10 hover:border-primary/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center bg-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                            title="View Settings & Profile"
                        >
                            {user?.picture ? (
                                <img src={user.picture} alt={user.name || user.email} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold uppercase">
                                    {(user?.name || user?.email || 'U').charAt(0)}
                                </div>
                            )}
                        </button>

                        {/* Glassmorphic Dropdown Panel */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-3 w-80 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_10px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4 text-text select-none animate-in fade-in zoom-in-95 duration-150">
                                
                                {/* Identity Banner */}
                                <div className="flex items-center gap-3 p-2 bg-white/5 border border-white/5 rounded-xl">
                                    {user?.picture ? (
                                        <img src={user.picture} alt={user.name || user.email} className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-base font-bold uppercase shrink-0">
                                            {(user?.name || user?.email || 'U').charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex flex-col min-w-0 text-left">
                                        <span className="font-semibold text-sm text-white truncate">{user?.name || user?.email?.split('@')[0] || 'Member'}</span>
                                        <span className="text-xs text-muted truncate">{user?.email || 'Authenticated'}</span>
                                    </div>
                                </div>

                                <div className="h-px bg-white/10 w-full" />

                                {/* Settings Options List */}
                                <div className="flex flex-col gap-3">
                                    
                                    {/* Mic Select Option */}
                                    <div className="flex flex-col gap-1.5 px-2 text-left">
                                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Audio Input Device</label>
                                        <select
                                            value={selectedMicId}
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                setSelectedMicId(id);
                                                localStorage.setItem('syncmind_selected_mic_id', id);
                                            }}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                                        >
                                            <option value="default">Default Microphone</option>
                                            {micDevices.map(device => (
                                                <option key={device.deviceId} value={device.deviceId}>
                                                    {device.label || `Microphone Input (${device.deviceId.slice(0, 5)})`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Frame Rate Select Option */}
                                    <div className="flex flex-col gap-1.5 px-2 text-left">
                                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Capture Quality (FPS)</label>
                                        <select
                                            value={selectedFrameRate}
                                            onChange={(e) => {
                                                const fr = parseInt(e.target.value);
                                                setSelectedFrameRate(fr);
                                                localStorage.setItem('syncmind_frame_rate', fr);
                                            }}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                                        >
                                            <option value={15}>15 FPS (Resource Saver)</option>
                                            <option value={30}>30 FPS (Standard Smooth)</option>
                                            <option value={60}>60 FPS (Ultra Performance)</option>
                                        </select>
                                    </div>

                                    {/* Cloud Engine Toggle Option */}
                                    <div className="flex items-center justify-between px-2 py-1">
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-semibold text-white">AWS Cloud Transcribe</span>
                                            <span className="text-[10px] text-muted">Buffering S3 uploading</span>
                                        </div>
                                        <button
                                            onClick={toggleEngine}
                                            disabled={isMonitoring}
                                            className={`w-10 h-6 rounded-full p-0.5 transition-all flex items-center ${useAWS ? 'bg-blue-600 justify-end' : 'bg-zinc-800 justify-start'} disabled:opacity-50`}
                                            title="Toggle Transcription Engine"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-white shadow-md transition-all"></div>
                                        </button>
                                    </div>

                                    {/* Popout Option */}
                                    <div className="flex items-center justify-between px-2 py-1">
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-semibold text-white">Floating Popout</span>
                                            <span className="text-[10px] text-muted">Compact overlay mode</span>
                                        </div>
                                        <button
                                            onClick={toggleFloatingMode}
                                            className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${isFloating ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-transparent text-white border-white/10 hover:bg-white/5'}`}
                                        >
                                            {isFloating ? 'Active' : 'Toggle'}
                                        </button>
                                    </div>

                                </div>

                                <div className="h-px bg-white/10 w-full" />

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white text-xs font-semibold py-2.5 rounded-xl transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out Session
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">Authenticated</span>
                </div>

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
                            <div className="absolute inset-0 flex items-center justify-center text-muted italic text-center p-4">
                                {isMonitoring ? (
                                    useAWS ? (
                                        <div className="flex flex-col items-center gap-4 max-w-sm">
                                            {/* Pulsing indicator icon */}
                                            <div className="relative flex h-4 w-4">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-blue-400 font-semibold tracking-wide text-sm">AWS Cloud Recording Active</span>
                                                <span className="text-xs text-muted leading-relaxed">
                                                    Audio is buffering and uploading securely. Once you stop the meeting, AWS Transcribe and Bedrock analysis will automatically generate the transcript, summary, and action items.
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span>Listening...</span>
                                        </div>
                                    )
                                ) : (
                                    <span className="text-muted/60 text-sm">Click Start Capture to begin</span>
                                )}
                            </div>
                        )}
                        <div ref={transcriptEndRef} />
                    </div>
                </div>
            </div>

            {uploadStatus && (
                <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-2xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
                    uploadStatus.status === 'success' ? 'bg-green-600/90 border-green-500/50 text-white' :
                    uploadStatus.status === 'error' ? 'bg-red-600/90 border-red-500/50 text-white' :
                    'bg-blue-600/90 border-blue-500/50 text-white'
                }`}>
                    {uploadStatus.status !== 'success' && uploadStatus.status !== 'error' && (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {uploadStatus.status === 'success' && (
                        <svg className="h-4 w-4 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {uploadStatus.status === 'error' && (
                        <svg className="h-4 w-4 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    )}
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold opacity-75 uppercase tracking-wider">S3 Audio Pipeline</span>
                        <span className="text-sm font-medium">{uploadStatus.message}</span>
                    </div>
                    {(uploadStatus.status === 'success' || uploadStatus.status === 'error') && (
                        <button onClick={() => setUploadStatus(null)} className="ml-2 hover:opacity-75 focus:outline-none">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

        </div>
    );
}

export default App;

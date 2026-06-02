import React from 'react';
import { Mic, Download, Play, X, Sparkles } from 'lucide-react';

const RecordFirstMeetingPopup = ({ isOpen, onClose, onGetSoftware }) => {
    if (!isOpen) return null;

    const handleLaunchApp = () => {
        // Native Custom Protocol Client launch back to Electron app
        window.location.href = 'syncmind://';
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative w-full max-w-lg mx-4">
                {/* Border gradient glow */}
                <div className="absolute -inset-px bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl" />

                <div className="relative bg-zinc-950/90 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center">
                    
                    {/* Close button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                        title="Dismiss"
                    >
                        <X size={18} />
                    </button>

                    {/* Creative Icon Circle */}
                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)]">
                        <Mic size={30} className="animate-pulse" />
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles size={12} />
                        Awaiting Live Signal
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                        Capture Your First Meeting
                    </h2>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-md">
                        SyncMind uses our companion desktop recorder to capture your conversations, transcribe them via cloud AI, and automatically load analysis details directly onto this dashboard.
                    </p>

                    {/* Inquiry & Action Card */}
                    <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 mb-6 text-left">
                        <h4 className="text-sm font-semibold text-white mb-2">Do you have the SyncMind desktop app?</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-4">
                            The desktop client runs silently in your tray to record meeting audio.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            {/* Option A: Already have it */}
                            <button
                                onClick={handleLaunchApp}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm shadow-lg shadow-emerald-600/10"
                            >
                                <Play size={16} fill="white" />
                                Yes, Launch App
                            </button>

                            {/* Option B: Need it */}
                            <button
                                onClick={onGetSoftware}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm shadow-lg shadow-blue-500/10"
                            >
                                <Download size={16} />
                                No, Get Software
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-medium"
                    >
                        Skip and explore the mock view
                    </button>

                </div>
            </div>
        </div>
    );
};

export default RecordFirstMeetingPopup;

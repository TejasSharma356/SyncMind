import React from 'react';
import { UserCheck, ArrowRight, X } from 'lucide-react';

const OnboardingModal = ({ isOpen, onClose, onComplete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200">
            {/* Background Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />
            </div>

            {/* Modal Card */}
            <div className="relative bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center animate-in zoom-in-95 duration-200 select-none">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"
                    aria-label="Close onboarding panel"
                >
                    <X size={16} />
                </button>

                {/* Animated Badge Icon */}
                <div className="w-16 h-16 mx-auto bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.15)] animate-bounce duration-1000">
                    <UserCheck className="h-8 w-8 text-blue-400" />
                </div>

                {/* Header Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">SyncMind!</span>
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                    Let's personalize your meeting intelligence workspace. Fill in your professional details to unlock customized transcription analysis and action items tailored specifically to your role.
                </p>

                {/* Actions Grid */}
                <div className="flex flex-col sm:flex-row gap-3.5">
                    <button
                        onClick={onClose}
                        className="flex-1 order-2 sm:order-1 px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl text-sm font-semibold transition-all active:scale-95 duration-150"
                    >
                        Skip for Now
                    </button>
                    <button
                        onClick={onComplete}
                        className="flex-1 order-1 sm:order-2 flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 active:scale-95 transition-all duration-150 group"
                    >
                        Complete Profile
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OnboardingModal;

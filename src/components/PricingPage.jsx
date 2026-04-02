import React from 'react';
import { ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react';
import { GLSLHills } from './ui/glsl-hills';

const PricingPage = ({ onBack, onLaunch }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-white relative overflow-auto">
            {/* GLSL Hills Background */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <GLSLHills width="100%" height="100%" speed={0.3} />
            </div>

            {/* Dark gradient overlay */}
            <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/20 to-black/80 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {/* Navbar */}
                <div className="flex justify-between items-center px-8 pt-8 pb-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <div />

                    <button
                        onClick={onLaunch}
                        className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
                    >
                        Launch Dashboard <ArrowRight size={14} />
                    </button>
                </div>

                {/* Hero */}
                <div className="max-w-4xl mx-auto px-8 pt-16 pb-12 text-center">
                    <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05 }} className="mb-6">
                        <span className="italic font-thin" style={{ fontSize: '0.8em' }}>Simple, transparent<br /></span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Pricing.</span>
                    </h1>

                    <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        SyncMInd is currently in early access and <strong className="text-white">100% Free and Open Source</strong>. Enjoy full access to all features while we continue to build and improve.
                    </p>
                    
                    <div className="flex justify-center mb-16">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl max-w-sm w-full mx-auto transform transition-all hover:scale-105 hover:bg-white/10">
                            <div className="flex justify-center mb-4">
                                <Heart className="text-pink-500 w-12 h-12" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Open Source Edition</h2>
                            <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-gray-400 font-normal">/forever</span></div>
                            
                            <ul className="text-left space-y-4 mb-8">
                                {[
                                    'Unlimited Meeting Recordings',
                                    'AI-Powered Transcripts',
                                    'Automated Insights & Action Items',
                                    'Local Desktop Client',
                                    'Full Source Code Access'
                                ].map((feature, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                                        <Check size={18} className="text-green-400 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={onLaunch}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                            >
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="text-center py-8 text-gray-600 text-xs border-t border-white/5 mt-auto">
                    &copy; 2026 SyncMInd Inc. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default PricingPage;

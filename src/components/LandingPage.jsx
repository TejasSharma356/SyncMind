import React from 'react';
import { ArrowRight, CheckCircle, Zap, Shield, Users } from 'lucide-react';
import FloatingLines from './FloatingLines';

const LandingPage = ({ onLaunch }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-white relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                <FloatingLines
                    enabledWaves={["top", "middle", "bottom"]}
                    lineCount={9}
                    lineDistance={7}
                    bendRadius={4}
                    bendStrength={0.5}
                    interactive={true}
                    parallax={true}
                    mixBlendMode="screen"
                    linesGradient={['#4f46e5', '#818cf8', '#c084fc']} // Blue/Purple gradient
                />
            </div>

            <div className="relative z-10">
                {/* Navbar */}
                <div className="flex justify-center pt-8 px-4 relative z-20">
                    <nav className="flex items-center gap-8 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <div className="w-0.5 h-2.5 bg-white mx-0.5 rounded-full"></div>
                                <div className="w-0.5 h-4 bg-white mx-0.5 rounded-full"></div>
                                <div className="w-0.5 h-1.5 bg-white mx-0.5 rounded-full"></div>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">SyncMInd</span>
                        </div>

                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                            <a href="#" className="hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all">Features</a>
                            <a href="#" className="hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all">Pricing</a>
                            <a href="#" className="hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all">About</a>
                        </div>

                        <button
                            onClick={onLaunch}
                            className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg active:scale-95"
                        >
                            Login
                        </button>
                    </nav>
                </div>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-8 py-20 md:py-32 flex flex-col items-center text-center relative z-20">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 border border-blue-500/20 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        New: AI Silent Teammate 2.0
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl text-white">
                        Your meetings, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">perfectly synced </span>
                        and recalled.
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mb-10 leading-relaxed font-medium">
                        SyncMInd joins your calls, transcribes in real-time, and generates actionable insights automatically. Never miss a detail again.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onLaunch}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25"
                        >
                            Launch Dashboard
                            <ArrowRight size={20} />
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm">
                            View Demo
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="py-24 relative z-20">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Zap,
                                    title: "Real-time Transcription",
                                    desc: "Identify speakers and capture every word instantly with 99% accuracy.",
                                    delay: "0s"
                                },
                                {
                                    icon: Shield,
                                    title: "Private & Secure",
                                    desc: "Enterprise-grade encryption ensures your meeting data stays strictly confidential.",
                                    delay: "2s"
                                },
                                {
                                    icon: Users,
                                    title: "Team Alignment",
                                    desc: "Automatically distribute action items and summaries to keeps everyone on the same page.",
                                    delay: "4s"
                                }
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 animate-float hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
                                    style={{ animationDelay: feature.delay }}
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 shadow-inner border border-white/5">
                                        <feature.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-white/5 py-12 relative z-20">
                    <div className="max-w-7xl mx-auto px-8 text-center text-gray-500 text-sm">
                        &copy; 2026 SyncMInd Inc. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;

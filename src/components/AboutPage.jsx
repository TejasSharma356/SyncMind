import React from 'react';
import { ArrowLeft, Download, Mic, Brain, Zap, Shield, Monitor, ArrowRight, Github, ExternalLink } from 'lucide-react';
import { GLSLHills } from './ui/glsl-hills';

const DOWNLOAD_URL = 'https://github.com/TejasSharma356/SyncMInd/releases/latest/download/SyncMind_Setup.exe';

const AboutPage = ({ onBack, onLaunch }) => {
    const handleDownload = () => {
        window.location.href = DOWNLOAD_URL;
    };

    const features = [
        { icon: Mic, title: 'Records Your Meetings', desc: 'Automatically captures audio from any meeting — in person or remote.' },
        { icon: Brain, title: 'AI-Powered Analysis', desc: 'Sends your recording to the cloud and generates transcripts, key points, and insights.' },
        { icon: Zap, title: 'Instant Summaries', desc: 'Meeting results appear in your dashboard seconds after the call ends.' },
        { icon: Shield, title: 'Private by Default', desc: 'Your audio is processed securely and tied to your personal account only.' },
    ];

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

                    {/* spacer to keep Back and Launch balanced */}
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
                        <span className="italic font-thin" style={{ fontSize: '0.8em' }}>Download the<br /></span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Desktop App.</span>
                    </h1>

                    <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        SyncMInd for Windows silently records your meetings, uploads them to our AI pipeline, and populates your dashboard automatically — no manual work needed.
                    </p>

                    {/* Download Button */}
                    <a
                        href={DOWNLOAD_URL}
                        className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-5 rounded-2xl text-xl shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-200 group mb-3"
                    >
                        <Download size={24} className="group-hover:animate-bounce" />
                        Download for Windows
                    </a>
                    <p className="text-gray-500 text-xs mb-8">SyncMind.Setup.1.0.0.exe · Requires Windows 10 or later · Free</p>

                    <div className="flex items-center gap-3 justify-center">
                        <div className="h-px w-16 bg-white/10" />
                        <span className="text-gray-500 text-xs">Already have it?</span>
                        <div className="h-px w-16 bg-white/10" />
                    </div>
                    <button
                        onClick={onLaunch}
                        className="mt-4 inline-flex items-center gap-2 text-gray-300 hover:text-white border border-white/10 hover:border-white/30 px-8 py-3 rounded-xl font-semibold transition-all text-base"
                    >
                        Launch Dashboard <ArrowRight size={18} />
                    </button>
                </div>

                {/* Features */}
                <div className="max-w-5xl mx-auto px-8 pb-16">
                    <h2 className="text-2xl font-bold text-white text-center mb-10">How It Works</h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-14">
                        {features.map((f, i) => (
                            <div key={i} className="flex gap-5 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                <div className="w-11 h-11 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 flex-shrink-0 border border-blue-500/20">
                                    <f.icon size={22} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Steps */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8">
                        <h2 className="text-xl font-bold text-white mb-6">Getting Started</h2>
                        <ol className="space-y-6">
                            {[
                                { step: '01', title: 'Download & Install', desc: 'Click the download button and run the installer on your Windows PC.' },
                                { step: '02', title: 'Launch SyncMInd', desc: 'Open the app — it runs quietly in your system tray.' },
                                { step: '03', title: 'Start a Meeting', desc: 'Hit Record before your meeting begins. SyncMInd captures audio in the background.' },
                                { step: '04', title: 'View Your Dashboard', desc: 'When the meeting ends, transcript, insights, and action items appear in your dashboard automatically.' },
                            ].map((s) => (
                                <li key={s.step} className="flex gap-5 items-start">
                                    <span className="text-blue-400 font-bold text-sm w-8 flex-shrink-0 mt-0.5">{s.step}</span>
                                    <div>
                                        <p className="font-semibold text-white text-sm">{s.title}</p>
                                        <p className="text-sm text-gray-400">{s.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* GitHub */}
                    <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl text-sm">
                        <Github size={20} className="text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-gray-300 font-medium">Open Source on GitHub</p>
                            <p className="text-gray-500 text-xs">View source code, report issues, or contribute.</p>
                        </div>
                        <a
                            href="https://github.com/Boomerforlife/SyncMind_Electron"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            View Repo <ExternalLink size={14} />
                        </a>
                    </div>
                </div>

                <footer className="text-center py-8 text-gray-600 text-xs border-t border-white/5">
                    &copy; 2026 SyncMInd Inc. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default AboutPage;

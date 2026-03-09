import React from 'react';
import { ArrowLeft, ArrowRight, Brain, Mic, Zap, Shield, Users, Target, Eye, Sparkles } from 'lucide-react';
import { GLSLHills } from './ui/glsl-hills';

const ProjectInfoPage = ({ onBack, onGetSoftware, onLaunch }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-white relative overflow-auto">

            {/* GLSL Hills Background */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <GLSLHills width="100%" height="100%" speed={0.3} />
            </div>

            {/* Dark gradient overlay */}
            <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none" />

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

                    {/* spacer to balance Back and Get the Software */}
                    <div />

                    <button
                        onClick={onGetSoftware}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
                    >
                        Get the Software <ArrowRight size={14} />
                    </button>
                </div>

                {/* Hero */}
                <div className="max-w-4xl mx-auto px-8 pt-16 pb-16 text-center">
                    <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05 }} className="mb-6">
                        <span className="italic font-thin" style={{ fontSize: '0.8em' }}>About the<br /></span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Project.</span>
                    </h1>

                    <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
                        SyncMInd is an AI-powered meeting assistant that silently attends your calls, transcribes every word, and turns conversations into actionable insights — automatically.
                    </p>
                    <p className="text-gray-500 text-base max-w-xl mx-auto mb-12 leading-relaxed">
                        No more manual note-taking. No more missed action items. Just pure focus on the conversation that matters.
                    </p>

                    <button
                        onClick={onLaunch}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-all backdrop-blur-sm"
                    >
                        Open Dashboard <ArrowRight size={18} />
                    </button>
                </div>

                {/* Vision & Mission */}
                <div className="max-w-5xl mx-auto px-8 pb-16">
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-5 border border-blue-500/20">
                                <Target size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                            <p className="text-gray-400 leading-relaxed">
                                To eliminate the cognitive overhead of meetings. We believe humans should focus on thinking, collaborating, and deciding — not on capturing information that a machine can handle.
                            </p>
                        </div>
                        <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-5 border border-purple-500/20">
                                <Eye size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                            <p className="text-gray-400 leading-relaxed">
                                A world where every decision made in a meeting is remembered, every commitment is tracked, and every insight is surfaced — without anyone lifting a pen.
                            </p>
                        </div>
                    </div>

                    {/* What SyncMInd Does */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white text-center mb-4">What SyncMInd Does</h2>
                        <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">A complete pipeline from audio to action.</p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: Mic, color: 'blue', title: 'Capture', desc: 'The desktop app silently records audio from any meeting — in person or remote — through your Windows device.' },
                                { icon: Brain, color: 'purple', title: 'Analyse', desc: 'AWS Lambda processes the audio with AI to generate a full transcript, key points, insights, and action items in seconds.' },
                                { icon: Zap, color: 'pink', title: 'Deliver', desc: 'Results are pushed to your personal dashboard in real-time. Your notes are ready before the meeting even ends.' },
                            ].map((f, i) => (
                                <div key={i} className="p-7 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl text-center hover:bg-white/10 transition-all">
                                    <div className={`w-12 h-12 bg-${f.color}-500/20 border border-${f.color}-500/20 rounded-xl flex items-center justify-center text-${f.color}-400 mx-auto mb-4`}>
                                        <f.icon size={24} />
                                    </div>
                                    <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-16 p-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl">
                        <h2 className="text-2xl font-bold text-white mb-2">Built with Modern Tech</h2>
                        <p className="text-gray-500 text-sm mb-8">A serverless-first architecture that scales automatically.</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: 'Electron', desc: 'Desktop App', emoji: '⚡' },
                                { name: 'React + Vite', desc: 'Web Dashboard', emoji: '⚛️' },
                                { name: 'AWS Lambda', desc: 'AI Processing', emoji: '☁️' },
                                { name: 'DynamoDB', desc: 'Data Storage', emoji: '🗄️' },
                            ].map((t, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                    <div className="text-2xl mb-2">{t.emoji}</div>
                                    <p className="font-semibold text-white text-sm">{t.name}</p>
                                    <p className="text-gray-500 text-xs">{t.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <footer className="text-center py-8 text-gray-600 text-xs border-t border-white/5">
                    &copy; 2026 SyncMInd Inc. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default ProjectInfoPage;

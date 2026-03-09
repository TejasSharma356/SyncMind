import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { GLSLHills } from './ui/glsl-hills';

const DemoPage = ({ onBack, onLaunch }) => {
    // Boilerplate configuration for video source
    // Toggle this to false to use a local video uploaded from your device
    const useYouTube = true;

    // Placeholder YouTube ID - replace with your actual YouTube video ID
    const youtubeId = "dQw4w9WgXcQ";

    // Placeholder Local Video URL - replace with your video path (e.g. '/demo.mp4' in public folder)
    const localVideoUrl = "/placeholder-video.mp4";

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-white relative overflow-auto">
            {/* GLSL Hills Background - matching existing UI */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <GLSLHills width="100%" height="100%" speed={0.3} />
            </div>

            {/* Dark gradient overlay */}
            <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/20 to-black/80 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Navbar */}
                <div className="flex justify-between items-center px-8 pt-8 pb-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>

                    <button
                        onClick={onLaunch}
                        className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
                    >
                        Login
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-8 py-12 w-full text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                        See <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">SyncMInd</span> in Action
                    </h1>
                    <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                        Watch how SyncMInd silently captures your meetings, analyzes the conversation, and generates actionable insights automatically.
                    </p>

                    {/* Video Container */}
                    <div className="w-full max-w-4xl aspect-video bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative group flex items-center justify-center ring-1 ring-white/5">
                        {useYouTube ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                                title="SyncMInd Demo Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <video
                                className="w-full h-full object-cover"
                                controls
                                poster="/api/placeholder/1280/720"
                            >
                                <source src={localVideoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="text-center py-8 text-gray-600 text-xs border-t border-white/5 mt-auto w-full relative z-10">
                    &copy; 2026 SyncMInd Inc. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default DemoPage;

import React, { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { AetherHero } from './ui/aether-hero';
import { FaBars, FaTimes } from 'react-icons/fa';

const LandingPage = ({onLaunch,onAbout,onGetSoftware,onFeatures,onWatchDemo,onPricing,}) => {
    
const [isOpen, setIsOpen] = useState(false);

const handleOpenNavbar = () => {
setIsOpen((prev) => !prev);
};

const closeMenu = () => {
setIsOpen(false);
};

return (
<div
    className="min-h-screen font-sans text-white relative"
    style={{
    fontFamily:
        "'Space Grotesk', ui-sans-serif, system-ui, -apple-system, sans-serif",
    }}>

    {/* Google Font */}
    <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap"
    />

    {/* Background */}
    <div className="fixed inset-0 z-0">
    <AetherHero
        height="100%"
        overlayGradient="linear-gradient(180deg, #000000bb 0%, #00000055 40%, transparent 70%, #000000aa 100%)"
    />
    </div>

    {/* Main Content */}
    <div className="relative z-10">

    {/* Navbar */}
    <div className="sticky top-0 z-20 px-4 pt-4 pb-2">
        <nav className="max-w-xl mx-auto bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">

        {/* Top Row */}
        <div className="flex items-center justify-between px-6 py-4">

            {/* Logo */}
            <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <div className="w-0.5 h-2.5 bg-white mx-0.5 rounded-full"></div>
                <div className="w-0.5 h-4 bg-white mx-0.5 rounded-full"></div>
                <div className="w-0.5 h-1.5 bg-white mx-0.5 rounded-full"></div>
            </div>

            <span className="font-bold text-lg tracking-tight text-white">
                SyncMInd
            </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <button
                onClick={onFeatures}
                className="hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
            >
                Features
            </button>

            <button
                onClick={onPricing}
                className="hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
            >
                Pricing
            </button>

            <button
                onClick={onAbout}
                className="hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
            >
                About
            </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">

            {/* Desktop Login */}
            <button
                onClick={onLaunch}
                className="hidden md:block bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg active:scale-95"
            >
                Login
            </button>

            {/* Mobile Menu Button */}
            <button
                onClick={handleOpenNavbar}
                className="md:hidden text-white text-xl"
                aria-label="Toggle navigation"
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
            <div className="md:hidden px-6 pb-5 flex flex-col gap-4 border-t border-white/10">

            <button
                onClick={() => {
                onFeatures();
                closeMenu();
                }}
                className="text-left text-gray-300 hover:text-white transition"
            >
                Features
            </button>

            <button
                onClick={() => {
                onPricing();
                closeMenu();
                }}
                className="text-left text-gray-300 hover:text-white transition"
            >
                Pricing
            </button>

            <button
                onClick={() => {
                onAbout();
                closeMenu();
                }}
                className="text-left text-gray-300 hover:text-white transition"
            >
                About
            </button>

            <button
                onClick={() => {
                onLaunch();
                closeMenu();
                }}
                className="bg-white text-black px-4 py-2 rounded-xl font-semibold"
            >
                Login
            </button>
            </div>
        )}
        </nav>
    </div>

    {/* Hero Section */}
    <section className="min-h-screen flex flex-col items-start justify-center px-6 md:px-24 max-w-5xl py-32">

        <h1
        className="font-bold tracking-tight mb-6 leading-tight text-white"
        style={{
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            textShadow: '0 6px 36px rgba(0,0,0,0.5)',
        }}
        >
        Your meetings,{' '}
        <span style={{
            background: 'linear-gradient(90deg, #60a5fa, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
        }}>
            perfectly synced
        </span>{' '}
        and recalled.
        </h1>

        <p
        className="text-gray-200 mb-10 leading-relaxed max-w-2xl"
        style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            textShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
        >
        SyncMInd silently records your calls, transcribes every word,
        and surfaces key insights and action items automatically —
        so you never miss a detail again.
        </p>

        <div className="flex flex-col gap-6 w-full">

        <div className="flex flex-col sm:flex-row gap-4">

            <button
            onClick={onGetSoftware}
            className="inline-flex items-center gap-2.5 font-semibold px-8 py-4 rounded-xl text-base transition-all hover:scale-105 active:scale-95"
            style={{
                background:
                'linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.06))',
                boxShadow:
                'inset 0 0 0 1px rgba(255,255,255,.28), 0 10px 30px rgba(0,0,0,.25)',
                backdropFilter: 'blur(6px)',
            }}
            >
            Get the Software
            </button>

            <button
            onClick={onWatchDemo}
            className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-xl text-base transition-all hover:bg-white/10"
            style={{
                boxShadow:
                'inset 0 0 0 1px rgba(255,255,255,.22)',
                backdropFilter: 'blur(4px)',
            }}
            >
            <Play size={18} fill="currentColor" />
            Watch Demo
            </button>
        </div>

        <button
            onClick={onLaunch}
            className="w-fit inline-flex items-center gap-2.5 font-semibold px-8 py-4 rounded-xl text-base transition-all hover:scale-105 active:scale-95 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-white"
        >
            Visit Dashboard
            <ArrowRight size={18} />
        </button>
        </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-white/5 py-10 text-center text-gray-500 text-xs">
        &copy; 2026 SyncMInd Inc. All rights reserved.
    </footer>
    </div>
</div>
);
};

export default LandingPage;
import React, { useCallback, memo } from 'react';
import { ArrowLeft, ArrowRight, Brain, Mic, Zap, Target, Eye } from 'lucide-react';
import { GLSLHills } from './ui/glsl-hills';

// ─── Style Token System ────────────────────────────────────────────────────────
// Replaces unsafe dynamic Tailwind class interpolation with deterministic mappings.
const FEATURE_VARIANTS = {
  blue: {
    iconBg:     'bg-blue-500/15',
    iconBorder: 'border-blue-500/25',
    iconText:   'text-blue-400',
    glow:       'hover:shadow-blue-500/10',
    accent:     'from-blue-500/20',
  },
  purple: {
    iconBg:     'bg-purple-500/15',
    iconBorder: 'border-purple-500/25',
    iconText:   'text-purple-400',
    glow:       'hover:shadow-purple-500/10',
    accent:     'from-purple-500/20',
  },
  rose: {
    iconBg:     'bg-rose-500/15',
    iconBorder: 'border-rose-500/25',
    iconText:   'text-rose-400',
    glow:       'hover:shadow-rose-500/10',
    accent:     'from-rose-500/20',
  },
};

const MISSION_VARIANTS = {
  blue: {
    iconBg:     'bg-blue-500/10',
    iconBorder: 'border-blue-500/20',
    iconText:   'text-blue-400',
    border:     'hover:border-blue-500/30',
  },
  purple: {
    iconBg:     'bg-purple-500/10',
    iconBorder: 'border-purple-500/20',
    iconText:   'text-purple-400',
    border:     'hover:border-purple-500/30',
  },
};

// ─── Static Data ───────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon:  Mic,
    color: 'blue',
    step:  '01',
    title: 'Capture',
    desc:  'The desktop app silently records audio from any meeting — in person or remote — through your Windows device.',
  },
  {
    icon:  Brain,
    color: 'purple',
    step:  '02',
    title: 'Analyse',
    desc:  'AWS Lambda processes the audio with AI to generate a full transcript, key points, insights, and action items in seconds.',
  },
  {
    icon:  Zap,
    color: 'rose',
    step:  '03',
    title: 'Deliver',
    desc:  'Results are pushed to your personal dashboard in real-time. Your notes are ready before the meeting even ends.',
  },
];

const MISSIONS = [
  {
    icon:  Target,
    color: 'blue',
    title: 'Our Mission',
    desc:  'To eliminate the cognitive overhead of meetings. We believe humans should focus on thinking, collaborating, and deciding — not on capturing information a machine can handle.',
  },
  {
    icon:  Eye,
    color: 'purple',
    title: 'Our Vision',
    desc:  'A world where every decision made in a meeting is remembered, every commitment is tracked, and every insight is surfaced — without anyone lifting a pen.',
  },
];

const TECH_STACK = [
  { emoji: '⚡', name: 'Electron',      desc: 'Desktop App'    },
  { emoji: '⚛️', name: 'React + Vite',  desc: 'Web Dashboard'  },
  { emoji: '☁️', name: 'AWS Lambda',    desc: 'AI Processing'  },
  { emoji: '🗄️', name: 'DynamoDB',      desc: 'Data Storage'   },
];

// ─── Primitive Components ──────────────────────────────────────────────────────

/** Accessible glass-morphic card wrapper */
const GlassPanel = memo(({ children, className = '', ...props }) => (
  <div
    className={[
      'bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl',
      'transition-colors duration-300',
      className,
    ].join(' ')}
    {...props}
  >
    {children}
  </div>
));
GlassPanel.displayName = 'GlassPanel';

/** Section heading with consistent hierarchy */
const SectionHeading = memo(({ eyebrow, title, subtitle, center = false }) => (
  <header className={center ? 'text-center' : ''}>
    {eyebrow && (
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400/80 mb-3">
        {eyebrow}
      </p>
    )}
    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
  </header>
));
SectionHeading.displayName = 'SectionHeading';

/** Accessible CTA button with visible focus ring and configurable icon placement */
const CTAButton = memo(({ onClick, children, variant = 'primary', className = '', icon: Icon, iconPosition = 'right' }) => {
  const base =
    'inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black ' +
    'active:scale-95 motion-safe:hover:scale-[1.03]';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-sm shadow-lg shadow-blue-700/30 ' +
      'focus-visible:ring-blue-500',
    ghost:
      'bg-white/8 hover:bg-white/14 border border-white/15 text-white px-7 py-3 text-base ' +
      'backdrop-blur-sm focus-visible:ring-white/50',
    nav:
      'text-gray-400 hover:text-white text-sm px-0 py-0 gap-1.5 ' +
      'focus-visible:ring-white/50 focus-visible:rounded-sm',
  };

  return (
    <button
      onClick={onClick}
      className={[base, variants[variant], className].join(' ')}
    >
      {Icon && iconPosition === 'left' && <Icon size={variant === 'nav' ? 15 : 17} aria-hidden="true" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={variant === 'nav' ? 15 : 17} aria-hidden="true" />}
    </button>
  );
});
CTAButton.displayName = 'CTAButton';

// ─── Feature Card ──────────────────────────────────────────────────────────────
const FeatureCard = memo((props) => {
  const { icon: Icon, color, step, title, desc } = props;
  const v = FEATURE_VARIANTS[color] ?? FEATURE_VARIANTS.blue;
  return (
    <article
      className={[
        'group relative p-6 sm:p-7 flex flex-col gap-4',
        'bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur-xl',
        'hover:bg-white/[0.07] hover:border-white/[0.15]',
        'hover:shadow-2xl', v.glow,
        'transition-all duration-300',
        'focus-within:ring-2 focus-within:ring-white/20 focus-within:rounded-2xl',
      ].join(' ')}
    >
      {/* Step badge */}
      <span
        className="absolute top-4 right-5 text-[10px] font-bold tracking-[0.25em] text-white/15 select-none"
        aria-hidden="true"
      >
        {step}
      </span>

      {/* Icon */}
      <div
        className={[
          'w-11 h-11 rounded-xl flex items-center justify-center border',
          v.iconBg, v.iconBorder, v.iconText,
          'motion-safe:group-hover:scale-110 transition-transform duration-300',
        ].join(' ')}
        aria-hidden="true"
      >
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-bold text-white text-lg mb-1.5">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>

      {/* Subtle gradient accent */}
      <div
        className={[
          'absolute inset-x-0 bottom-0 h-px rounded-b-2xl',
          `bg-gradient-to-r ${v.accent} via-transparent to-transparent`,
          'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        ].join(' ')}
        aria-hidden="true"
      />
    </article>
  );
});
FeatureCard.displayName = 'FeatureCard';

// ─── Mission Card ──────────────────────────────────────────────────────────────
const MissionCard = memo((props) => {
  const { icon: Icon, color, title, desc } = props;
  const v = MISSION_VARIANTS[color] ?? MISSION_VARIANTS.blue;
  return (
    <article
      className={[
        'p-7 sm:p-8 flex flex-col gap-5',
        'bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur-xl',
        'hover:bg-white/[0.06]', v.border,
        'transition-all duration-300',
      ].join(' ')}
    >
      <div
        className={[
          'w-12 h-12 rounded-xl flex items-center justify-center border',
          v.iconBg, v.iconBorder, v.iconText,
        ].join(' ')}
        aria-hidden="true"
      >
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{desc}</p>
      </div>
    </article>
  );
});
MissionCard.displayName = 'MissionCard';

// ─── Tech Card ─────────────────────────────────────────────────────────────────
const TechCard = memo(({ emoji, name, desc }) => (
  <div className="p-4 sm:p-5 bg-white/[0.03] rounded-xl border border-white/[0.07] text-center hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200 group">
    <div
      className="text-2xl mb-2 motion-safe:group-hover:scale-110 transition-transform duration-200 inline-block"
      role="img"
      aria-label={name}
    >
      {emoji}
    </div>
    <p className="font-semibold text-white text-sm">{name}</p>
    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
  </div>
));
TechCard.displayName = 'TechCard';

// ─── Main Page ─────────────────────────────────────────────────────────────────
const ProjectInfoPage = ({ onBack, onGetSoftware, onLaunch }) => {
  const handleBack = useCallback(() => onBack?.(), [onBack]);
  const handleGetSoftware = useCallback(() => onGetSoftware?.(), [onGetSoftware]);
  const handleLaunch = useCallback(() => onLaunch?.(), [onLaunch]);

  return (
    <div className="min-h-screen bg-[#080808] font-sans text-white relative overflow-auto">

      {/* ── Background Layer ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 opacity-50 pointer-events-none" aria-hidden="true">
        <GLSLHills width="100%" height="100%" speed={0.3} />
      </div>

      {/* Gradient overlays for atmosphere */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,8,8,0.72) 0%, rgba(8,8,8,0.18) 40%, rgba(8,8,8,0.82) 100%)',
        }}
      />

      {/* Radial accent — subtle blue glow centre-top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[340px] z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%)',
        }}
      />

      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10">

        {/* ── Navbar ───────────────────────────────────────────────────── */}
        <header role="banner">
          <nav
            className="flex items-center justify-between px-5 sm:px-8 pt-6 pb-4"
            aria-label="Page navigation"
          >
            <CTAButton onClick={handleBack} variant="nav" icon={ArrowLeft} iconPosition="left">
              Back
            </CTAButton>

            {/* Empty div to maintain flex spacing since center branding was removed */}
            <div aria-hidden="true" />

            <CTAButton onClick={handleGetSoftware} variant="primary" icon={ArrowRight} iconPosition="right">
              Get the Software
            </CTAButton>
          </nav>
        </header>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section aria-labelledby="hero-heading" className="max-w-4xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-20 text-center">

          <h1
            id="hero-heading"
            className="mb-6 tracking-tight leading-[1.04]"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.25rem)', fontWeight: 700, letterSpacing: '-0.025em' }}
          >
            <span className="block font-light text-gray-400 text-[0.52em] italic mb-1" aria-hidden="true">
              About the
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-rose-400">
              Project.
            </span>
          </h1>

          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-3 leading-relaxed">
            SyncMind is an AI-powered meeting assistant that silently attends your calls, transcribes every word, and turns conversations into actionable insights — automatically.
          </p>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto mb-10 leading-relaxed">
            No more manual note-taking. No more missed action items. Just pure focus on the conversation that matters.
          </p>

          <CTAButton onClick={handleLaunch} variant="ghost" icon={ArrowRight} iconPosition="right">
            Open Dashboard
          </CTAButton>
        </section>

        {/* ── Main Content ─────────────────────────────────────────────── */}
        <main id="main-content" className="max-w-5xl mx-auto px-5 sm:px-8 pb-20 space-y-16 sm:space-y-20">

          {/* ── Mission & Vision ─────────────────────────────────────── */}
          <section aria-labelledby="mission-heading">
            <h2 id="mission-heading" className="sr-only">Mission and Vision</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {MISSIONS.map(m => (
                <MissionCard key={m.title} {...m} />
              ))}
            </div>
          </section>

          {/* ── Feature Pipeline ─────────────────────────────────────── */}
          <section aria-labelledby="features-heading">
            <div className="mb-8">
              <SectionHeading
                eyebrow="How it works"
                title="What SyncMind Does"
                subtitle="A complete pipeline from raw audio to ready-to-act insights."
                center
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {FEATURES.map(f => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </section>

          {/* ── Tech Stack ───────────────────────────────────────────── */}
          <section aria-labelledby="tech-heading">
            <GlassPanel className="p-7 sm:p-8">
              <div className="mb-7">
                <SectionHeading
                  eyebrow="Engineering"
                  title="Built with Modern Tech"
                  subtitle="A serverless-first architecture that scales automatically with your team."
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {TECH_STACK.map(t => (
                  <TechCard key={t.name} {...t} />
                ))}
              </div>
            </GlassPanel>
          </section>

        </main>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer
          className="text-center py-8 text-gray-600 text-xs border-t border-white/[0.05]"
          role="contentinfo"
        >
          <p>
            &copy; 2026 SyncMind Inc.{' '}
            <span className="text-gray-700">All rights reserved.</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ProjectInfoPage;

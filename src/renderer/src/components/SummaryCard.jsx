import React from 'react';

export default function SummaryCard({ text }) {
    return (
        <div className="bg-surface border border-white/5 rounded-xl p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> Summary
            </h2>
            <p className="text-muted leading-relaxed text-sm">
                {text}
            </p>
        </div>
    );
}
